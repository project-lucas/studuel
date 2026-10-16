-- =============================================================================
-- Studuel — Migration 584 : LE CARNET DE MARCEL — CE QU'IL SAIT DE L'ÉLÈVE
--
-- Lucas, 16/10/2026 : « Marcel doit connaître le user, très bien même ». Le
-- bureau de Marcel a un onglet « Toi » qui montre ce qu'il retient, et
-- l'élève peut TOUT effacer (lib/coach/carnet-marcel.ts).
--
-- CE QU'ELLE INSTALLE :
--   1. `marcel_carnet` — la carte d'identité de la première rencontre (une
--      ligne par élève, JSON de valeurs de listes fermées) ;
--      `marcel_identite_enregistrer(p_identite)` l'écrit, après avoir jeté
--      toute clé ou valeur inconnue ;
--   2. `marcel_notes` — ce que l'élève a confié en conversation (200 caractères
--      au plus, 30 notes gardées, la plus ancienne s'efface) ;
--      `marcel_notes_ajouter(p_textes)` (3 au plus par appel) et
--      `marcel_note_effacer(p_id)`.
--
-- Les deux tables ne s'écrivent QUE par ces fonctions ; l'élève lit les siennes.
-- Miroir : lib/coach/carnet-marcel.ts (testé contre ce fichier).
-- PRÉREQUIS : aucun. Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- ───────────────────────────────────────────── 1. la carte d'identité

CREATE TABLE IF NOT EXISTS public.marcel_carnet (
  user_id    UUID PRIMARY KEY REFERENCES public.profiles (id) ON DELETE CASCADE,
  identite   JSONB NOT NULL DEFAULT '{}'::jsonb
             CHECK (jsonb_typeof(identite) = 'object' AND octet_length(identite::text) <= 1000),
  modifie_le TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.marcel_carnet ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS marcel_carnet_select_own ON public.marcel_carnet;
CREATE POLICY marcel_carnet_select_own ON public.marcel_carnet
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
REVOKE INSERT, UPDATE, DELETE ON public.marcel_carnet FROM anon, authenticated;
GRANT SELECT ON public.marcel_carnet TO authenticated;

-- Écrit la carte, en ne gardant que les valeurs reconnues. Rend la carte gardée.
CREATE OR REPLACE FUNCTION public.marcel_identite_enregistrer(p_identite JSONB)
RETURNS JSONB
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_id   JSONB := '{}'::jsonb;
  v_val  TEXT;
BEGIN
  IF v_user IS NULL OR p_identite IS NULL OR jsonb_typeof(p_identite) <> 'object' THEN
    RETURN NULL;
  END IF;

  v_val := p_identite ->> 'passion';
  IF v_val IN ('foot', 'basket', 'hand', 'danse', 'jeux', 'mangas', 'musique', 'dessin', 'animaux', 'series', 'cuisine', 'sport') THEN
    v_id := v_id || jsonb_build_object('passion', v_val);
  END IF;
  v_val := p_identite ->> 'objectif';
  IF v_val IN ('examen', 'moyenne', 'mention', 'stress', 'retard') THEN
    v_id := v_id || jsonb_build_object('objectif', v_val);
  END IF;
  v_val := p_identite ->> 'moment';
  IF v_val IN ('matin', 'sortie', 'soir', 'weekend') THEN
    v_id := v_id || jsonb_build_object('moment', v_val);
  END IF;
  v_val := p_identite ->> 'preferee';
  IF v_val ~ '^[a-z0-9-]{1,40}$' THEN
    v_id := v_id || jsonb_build_object('preferee', v_val);
  END IF;
  v_val := p_identite ->> 'beteNoire';
  IF v_val ~ '^[a-z0-9-]{1,40}$' THEN
    v_id := v_id || jsonb_build_object('beteNoire', v_val);
  END IF;

  INSERT INTO public.marcel_carnet (user_id, identite, modifie_le)
  VALUES (v_user, v_id, now())
  ON CONFLICT (user_id) DO UPDATE SET identite = EXCLUDED.identite, modifie_le = now();
  RETURN v_id;
END;
$$;
REVOKE ALL ON FUNCTION public.marcel_identite_enregistrer(JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.marcel_identite_enregistrer(JSONB) TO authenticated;

-- ───────────────────────────────────────────── 2. les notes

CREATE TABLE IF NOT EXISTS public.marcel_notes (
  id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  texte   TEXT NOT NULL CHECK (char_length(texte) BETWEEN 1 AND 200),
  cree_le TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS marcel_notes_user_idx ON public.marcel_notes (user_id, cree_le DESC);
ALTER TABLE public.marcel_notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS marcel_notes_select_own ON public.marcel_notes;
CREATE POLICY marcel_notes_select_own ON public.marcel_notes
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
REVOKE INSERT, UPDATE, DELETE ON public.marcel_notes FROM anon, authenticated;
GRANT SELECT ON public.marcel_notes TO authenticated;

-- Ajoute 1 à 3 notes (le tri des conversations les écrira), puis ne garde que
-- les 30 plus récentes. Rend le nombre de notes ajoutées.
CREATE OR REPLACE FUNCTION public.marcel_notes_ajouter(p_textes TEXT[])
RETURNS INTEGER
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_t    TEXT;
  v_n    INTEGER := 0;
BEGIN
  IF v_user IS NULL OR p_textes IS NULL THEN RETURN 0; END IF;
  FOREACH v_t IN ARRAY p_textes[1:3] LOOP
    v_t := btrim(v_t);
    IF v_t IS NOT NULL AND char_length(v_t) BETWEEN 1 AND 200 THEN
      INSERT INTO public.marcel_notes (user_id, texte) VALUES (v_user, v_t);
      v_n := v_n + 1;
    END IF;
  END LOOP;
  DELETE FROM public.marcel_notes
   WHERE user_id = v_user
     AND id IN (SELECT id FROM public.marcel_notes WHERE user_id = v_user
                 ORDER BY cree_le DESC, id OFFSET 30);
  RETURN v_n;
END;
$$;
REVOKE ALL ON FUNCTION public.marcel_notes_ajouter(TEXT[]) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.marcel_notes_ajouter(TEXT[]) TO authenticated;

-- Efface une note de l'élève. Rend true si elle existait.
CREATE OR REPLACE FUNCTION public.marcel_note_effacer(p_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  DELETE FROM public.marcel_notes WHERE id = p_id AND user_id = auth.uid();
  RETURN FOUND;
END;
$$;
REVOKE ALL ON FUNCTION public.marcel_note_effacer(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.marcel_note_effacer(UUID) TO authenticated;
