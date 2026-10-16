-- =============================================================================
-- Studuel — Migration 585 : LE MODE EXAMEN DANS LE BUREAU DE MARCEL
--
-- Lucas, 16/10/2026 : « implémente les maquettes dans le mode examen, il doit
-- devenir à terme indispensable » (assets-sources/maquettes/marcel-examen.html).
--
-- CE QU'ELLE INSTALLE :
--   1. `examen_oral` — LE DOSSIER D'ORAL de l'élève, pièce par pièce :
--        projet   l'oral du brevet (1 pièce)
--        texte    la liste de textes de l'oral de français (30 au plus)
--        question les deux questions du Grand oral (2 au plus)
--      Chaque pièce porte ses étapes (JSON de booléens, clés connues par genre)
--      et le nombre d'oraux blancs passés. Fonctions d'écriture :
--      `examen_oral_ajouter`, `examen_oral_ajouter_liste` (la photo du
--      descriptif lue par Marcel), `examen_oral_modifier`, `examen_oral_etape`,
--      `examen_oral_passage`, `examen_oral_retirer`.
--   2. `examen_notes` — les notes que l'élève donne au simulateur « Ce qu'il te
--      faut en juin » (voie, moyenne de l'année, épreuves anticipées) ;
--      `examen_notes_enregistrer(p_notes)`.
--   3. La reprise de l'ancien descriptif (`profiles.oral_texts`, 156) dans
--      `examen_oral`, pour un élève qui n'a encore aucun texte.
--
-- Les deux tables ne s'écrivent QUE par ces fonctions ; l'élève lit les siennes.
-- Miroirs : lib/examen/dossier-oral.ts (étapes, plafonds) et
-- lib/examen/simulateur.ts (bornes des notes).
-- PRÉREQUIS : aucun (156 facultative). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- ───────────────────────────────────────────── 1. le dossier d'oral

CREATE TABLE IF NOT EXISTS public.examen_oral (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id  UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  genre    TEXT NOT NULL CHECK (genre IN ('projet', 'texte', 'question')),
  titre    TEXT NOT NULL CHECK (char_length(titre) BETWEEN 1 AND 200),
  detail   TEXT CHECK (detail IS NULL OR char_length(detail) <= 200),
  matiere  TEXT CHECK (matiere IS NULL OR matiere ~ '^[a-z0-9-]{1,40}$'),
  etapes   JSONB NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(etapes) = 'object'),
  passages INTEGER NOT NULL DEFAULT 0 CHECK (passages BETWEEN 0 AND 999),
  ordre    INTEGER NOT NULL DEFAULT 0,
  cree_le  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS examen_oral_user_idx ON public.examen_oral (user_id, genre, ordre);
ALTER TABLE public.examen_oral ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS examen_oral_select_own ON public.examen_oral;
CREATE POLICY examen_oral_select_own ON public.examen_oral
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
REVOKE INSERT, UPDATE, DELETE ON public.examen_oral FROM anon, authenticated;
GRANT SELECT ON public.examen_oral TO authenticated;

-- Le plafond de pièces par genre (miroir : DOSSIER.max, lib/examen/dossier-oral).
CREATE OR REPLACE FUNCTION public.examen_oral_plafond(p_genre TEXT)
RETURNS INTEGER
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT CASE p_genre WHEN 'projet' THEN 1 WHEN 'question' THEN 2 WHEN 'texte' THEN 30 ELSE 0 END;
$$;

-- Les étapes reconnues par genre (miroir : ETAPES, lib/examen/dossier-oral).
CREATE OR REPLACE FUNCTION public.examen_oral_etapes(p_genre TEXT)
RETURNS TEXT[]
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT CASE p_genre
    WHEN 'projet'   THEN ARRAY['sujet', 'plan', 'oral']
    WHEN 'texte'    THEN ARRAY['explication', 'grammaire', 'oral']
    WHEN 'question' THEN ARRAY['problematique', 'plan', 'introduction', 'oral']
    ELSE ARRAY[]::TEXT[] END;
$$;

-- Ajoute une pièce. Rend son id, ou NULL (pas connecté, titre vide, plafond atteint).
CREATE OR REPLACE FUNCTION public.examen_oral_ajouter(p_genre TEXT, p_titre TEXT, p_detail TEXT, p_matiere TEXT)
RETURNS UUID
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user  UUID := auth.uid();
  v_titre TEXT := left(NULLIF(btrim(COALESCE(p_titre, '')), ''), 200);
  v_det   TEXT := left(NULLIF(btrim(COALESCE(p_detail, '')), ''), 200);
  v_mat   TEXT := CASE WHEN p_matiere ~ '^[a-z0-9-]{1,40}$' THEN p_matiere END;
  v_n     INTEGER;
  v_id    UUID;
BEGIN
  IF v_user IS NULL OR v_titre IS NULL OR public.examen_oral_plafond(p_genre) = 0 THEN RETURN NULL; END IF;
  -- Sérialise les ajouts d'un même élève (deux appareils, double toucher).
  PERFORM pg_advisory_xact_lock(hashtext('examen_oral:' || v_user::text));
  SELECT count(*) INTO v_n FROM public.examen_oral WHERE user_id = v_user AND genre = p_genre;
  IF v_n >= public.examen_oral_plafond(p_genre) THEN RETURN NULL; END IF;
  INSERT INTO public.examen_oral (user_id, genre, titre, detail, matiere, ordre)
  VALUES (v_user, p_genre, v_titre, v_det, v_mat, v_n + 1)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;
REVOKE ALL ON FUNCTION public.examen_oral_ajouter(TEXT, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.examen_oral_ajouter(TEXT, TEXT, TEXT, TEXT) TO authenticated;

-- Ajoute une LISTE de textes d'un coup (la photo du descriptif lue par Marcel) :
-- un tableau de { "titre", "detail" }, jusqu'au plafond. Rend le nombre ajouté.
CREATE OR REPLACE FUNCTION public.examen_oral_ajouter_liste(p_textes JSONB)
RETURNS INTEGER
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user  UUID := auth.uid();
  v_n     INTEGER;
  v_ajout INTEGER := 0;
  v_e     JSONB;
  v_titre TEXT;
BEGIN
  IF v_user IS NULL OR p_textes IS NULL OR jsonb_typeof(p_textes) <> 'array' THEN RETURN 0; END IF;
  PERFORM pg_advisory_xact_lock(hashtext('examen_oral:' || v_user::text));
  SELECT count(*) INTO v_n FROM public.examen_oral WHERE user_id = v_user AND genre = 'texte';
  FOR v_e IN SELECT value FROM jsonb_array_elements(p_textes) LOOP
    EXIT WHEN v_n >= 30;
    CONTINUE WHEN jsonb_typeof(v_e) <> 'object';
    v_titre := left(NULLIF(btrim(COALESCE(v_e ->> 'titre', '')), ''), 200);
    CONTINUE WHEN v_titre IS NULL;
    -- Pas de doublon : un texte déjà recopié n'est pas ajouté deux fois.
    CONTINUE WHEN EXISTS (SELECT 1 FROM public.examen_oral
                           WHERE user_id = v_user AND genre = 'texte' AND lower(titre) = lower(v_titre));
    v_n := v_n + 1;
    INSERT INTO public.examen_oral (user_id, genre, titre, detail, matiere, ordre)
    VALUES (v_user, 'texte', v_titre, left(NULLIF(btrim(COALESCE(v_e ->> 'detail', '')), ''), 200), 'francais', v_n);
    v_ajout := v_ajout + 1;
  END LOOP;
  RETURN v_ajout;
END;
$$;
REVOKE ALL ON FUNCTION public.examen_oral_ajouter_liste(JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.examen_oral_ajouter_liste(JSONB) TO authenticated;

-- Réécrit le titre, le détail et la matière d'une pièce de l'élève.
CREATE OR REPLACE FUNCTION public.examen_oral_modifier(p_id UUID, p_titre TEXT, p_detail TEXT, p_matiere TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_titre TEXT := left(NULLIF(btrim(COALESCE(p_titre, '')), ''), 200);
BEGIN
  IF auth.uid() IS NULL OR v_titre IS NULL THEN RETURN false; END IF;
  UPDATE public.examen_oral
     SET titre = v_titre,
         detail = left(NULLIF(btrim(COALESCE(p_detail, '')), ''), 200),
         matiere = CASE WHEN p_matiere ~ '^[a-z0-9-]{1,40}$' THEN p_matiere END
   WHERE id = p_id AND user_id = auth.uid();
  RETURN FOUND;
END;
$$;
REVOKE ALL ON FUNCTION public.examen_oral_modifier(UUID, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.examen_oral_modifier(UUID, TEXT, TEXT, TEXT) TO authenticated;

-- Coche ou décoche une étape reconnue pour le genre de la pièce.
CREATE OR REPLACE FUNCTION public.examen_oral_etape(p_id UUID, p_etape TEXT, p_fait BOOLEAN)
RETURNS BOOLEAN
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR p_etape IS NULL THEN RETURN false; END IF;
  UPDATE public.examen_oral
     SET etapes = etapes || jsonb_build_object(p_etape, COALESCE(p_fait, false))
   WHERE id = p_id AND user_id = auth.uid()
     AND p_etape = ANY (public.examen_oral_etapes(genre));
  RETURN FOUND;
END;
$$;
REVOKE ALL ON FUNCTION public.examen_oral_etape(UUID, TEXT, BOOLEAN) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.examen_oral_etape(UUID, TEXT, BOOLEAN) TO authenticated;

-- Un oral blanc passé sur la pièce : un passage de plus, l'étape « oral » cochée.
CREATE OR REPLACE FUNCTION public.examen_oral_passage(p_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_n INTEGER;
BEGIN
  IF auth.uid() IS NULL THEN RETURN NULL; END IF;
  UPDATE public.examen_oral
     SET passages = LEAST(passages + 1, 999),
         etapes = etapes || '{"oral": true}'::jsonb
   WHERE id = p_id AND user_id = auth.uid()
  RETURNING passages INTO v_n;
  RETURN v_n;
END;
$$;
REVOKE ALL ON FUNCTION public.examen_oral_passage(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.examen_oral_passage(UUID) TO authenticated;

-- Retire une pièce de l'élève.
CREATE OR REPLACE FUNCTION public.examen_oral_retirer(p_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  DELETE FROM public.examen_oral WHERE id = p_id AND user_id = auth.uid();
  RETURN FOUND;
END;
$$;
REVOKE ALL ON FUNCTION public.examen_oral_retirer(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.examen_oral_retirer(UUID) TO authenticated;

-- ───────────────────────────────────────────── 2. les notes du simulateur

CREATE TABLE IF NOT EXISTS public.examen_notes (
  user_id          UUID PRIMARY KEY REFERENCES public.profiles (id) ON DELETE CASCADE,
  voie             TEXT NOT NULL DEFAULT 'generale' CHECK (voie IN ('generale', 'technologique')),
  controle_continu NUMERIC(4, 2) CHECK (controle_continu BETWEEN 0 AND 20),
  francais_ecrit   NUMERIC(4, 2) CHECK (francais_ecrit BETWEEN 0 AND 20),
  francais_oral    NUMERIC(4, 2) CHECK (francais_oral BETWEEN 0 AND 20),
  maths_anticipees NUMERIC(4, 2) CHECK (maths_anticipees BETWEEN 0 AND 20),
  modifie_le       TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.examen_notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS examen_notes_select_own ON public.examen_notes;
CREATE POLICY examen_notes_select_own ON public.examen_notes
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
REVOKE INSERT, UPDATE, DELETE ON public.examen_notes FROM anon, authenticated;
GRANT SELECT ON public.examen_notes TO authenticated;

-- Une note du JSON : un nombre entre 0 et 20, sinon NULL (la note est effacée).
CREATE OR REPLACE FUNCTION public.examen_note_lue(p JSONB, p_cle TEXT)
RETURNS NUMERIC
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT CASE WHEN jsonb_typeof(p -> p_cle) = 'number'
                AND (p ->> p_cle)::numeric BETWEEN 0 AND 20
              THEN round((p ->> p_cle)::numeric, 2) END;
$$;

-- Enregistre les notes du simulateur (toutes à la fois). Rend true.
CREATE OR REPLACE FUNCTION public.examen_notes_enregistrer(p_notes JSONB)
RETURNS BOOLEAN
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
BEGIN
  IF v_user IS NULL OR p_notes IS NULL OR jsonb_typeof(p_notes) <> 'object' THEN RETURN false; END IF;
  INSERT INTO public.examen_notes (user_id, voie, controle_continu, francais_ecrit, francais_oral, maths_anticipees, modifie_le)
  VALUES (
    v_user,
    CASE WHEN p_notes ->> 'voie' = 'technologique' THEN 'technologique' ELSE 'generale' END,
    public.examen_note_lue(p_notes, 'controleContinu'),
    public.examen_note_lue(p_notes, 'francaisEcrit'),
    public.examen_note_lue(p_notes, 'francaisOral'),
    public.examen_note_lue(p_notes, 'mathsAnticipees'),
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    voie = EXCLUDED.voie,
    controle_continu = EXCLUDED.controle_continu,
    francais_ecrit = EXCLUDED.francais_ecrit,
    francais_oral = EXCLUDED.francais_oral,
    maths_anticipees = EXCLUDED.maths_anticipees,
    modifie_le = now();
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.examen_notes_enregistrer(JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.examen_notes_enregistrer(JSONB) TO authenticated;

-- ───────────────────────────────────────────── 3. la reprise du descriptif (156)

-- Un élève qui avait déjà recopié ses textes (profiles.oral_texts) les retrouve
-- dans son dossier : « maîtrisé » coche l'explication et la grammaire, « en
-- cours » l'explication. Seulement pour qui n'a encore aucun texte ici.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
              WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'oral_texts') THEN
    INSERT INTO public.examen_oral (user_id, genre, titre, detail, matiere, etapes, ordre)
    SELECT p.id, 'texte', left(btrim(e.value ->> 'title'), 200),
           left(NULLIF(btrim(COALESCE(e.value ->> 'work', '')), ''), 200), 'francais',
           CASE e.value ->> 'status'
             WHEN 'maitrise' THEN '{"explication": true, "grammaire": true}'::jsonb
             WHEN 'en_cours' THEN '{"explication": true}'::jsonb
             ELSE '{}'::jsonb END,
           e.ordinality::int
      FROM public.profiles p
      CROSS JOIN LATERAL jsonb_array_elements(
        CASE WHEN jsonb_typeof(p.oral_texts) = 'array' THEN p.oral_texts ELSE '[]'::jsonb END
      ) WITH ORDINALITY AS e(value, ordinality)
     WHERE e.ordinality <= 30
       AND NULLIF(btrim(COALESCE(e.value ->> 'title', '')), '') IS NOT NULL
       AND NOT EXISTS (SELECT 1 FROM public.examen_oral x WHERE x.user_id = p.id AND x.genre = 'texte');
  END IF;
END;
$$;
