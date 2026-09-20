-- =============================================================================
-- Studuel — Migration 156 : liste des textes du bac de français ORAL
-- profiles.oral_texts (JSONB, tableau) : le *descriptif* de l'élève de 1re — la
-- liste des textes étudiés qu'il/elle présentera à l'oral, chacun avec un statut
-- de préparation (À faire → En cours → Maîtrisé). Affiché sous l'objectif examen
-- de l'onglet Réviser. Complète l'objectif « Bac de français » (écrit + oral).
--
-- Forme du JSON (tableau) :
--   [ { "id": "<uuid>", "title": "Le Malade imaginaire, acte I sc. 5",
--       "work": "Molière" | null, "status": "a_faire"|"en_cours"|"maitrise" }, … ]
--
-- Sécurité : lecture par la RLS de profiles (auth.uid() = id, déjà en place).
-- ÉCRITURE : uniquement via les fonctions atomiques ci-dessous — PAS de GRANT
-- UPDATE direct sur la colonne. Comme pour upcoming_exams (087), le
-- read-modify-write d'un tableau JSONB côté client perdrait une mise à jour si
-- l'élève édite depuis deux appareils : les fonctions font le read-modify-write
-- dans la même transaction avec FOR UPDATE, donc sérialisé, aucun texte perdu.
--
-- PRÉREQUIS : schema.sql (profiles). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS oral_texts JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Plafond partagé avec lib/oral-texts.ts (MAX_ORAL_TEXTS = 30). Si tu changes
-- l'un, change l'autre.

-- Ajoute un texte au descriptif. L'id est généré EN BASE (donnée fiable), le
-- statut initial est « à faire ». Borne aux 30 plus récents, renvoie la nouvelle
-- liste. NULL si non authentifié ou titre vide.
CREATE OR REPLACE FUNCTION public.add_oral_text(p_title TEXT, p_work TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_title TEXT := NULLIF(btrim(COALESCE(p_title, '')), '');
  v_work TEXT := NULLIF(btrim(COALESCE(p_work, '')), '');
  v_entry JSONB;
  v_list JSONB;
BEGIN
  IF v_user IS NULL OR v_title IS NULL THEN RETURN NULL; END IF;

  v_entry := jsonb_build_object(
    'id', gen_random_uuid()::text,
    'title', left(v_title, 200),
    'work', CASE WHEN v_work IS NULL THEN NULL ELSE to_jsonb(left(v_work, 200)) END,
    'status', 'a_faire'
  );

  SELECT COALESCE(oral_texts, '[]'::jsonb) INTO v_list
    FROM public.profiles WHERE id = v_user FOR UPDATE;

  v_list := v_list || jsonb_build_array(v_entry);
  IF jsonb_array_length(v_list) > 30 THEN
    SELECT COALESCE(jsonb_agg(e ORDER BY ord), '[]'::jsonb) INTO v_list
      FROM (
        SELECT e, ord
          FROM jsonb_array_elements(v_list) WITH ORDINALITY AS t(e, ord)
         ORDER BY ord DESC
         LIMIT 30
      ) s;
  END IF;

  UPDATE public.profiles SET oral_texts = v_list WHERE id = v_user;
  RETURN v_list;
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_oral_text(TEXT, TEXT) TO authenticated;

-- Change le statut d'un texte (le seul champ éditable). Statut validé contre les
-- 3 valeurs autorisées. Renvoie la nouvelle liste. NULL si non authentifié ou
-- statut invalide.
CREATE OR REPLACE FUNCTION public.set_oral_text_status(p_id TEXT, p_status TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_list JSONB;
BEGIN
  IF v_user IS NULL
     OR p_id IS NULL
     OR p_status NOT IN ('a_faire', 'en_cours', 'maitrise')
  THEN
    RETURN NULL;
  END IF;

  SELECT COALESCE(oral_texts, '[]'::jsonb) INTO v_list
    FROM public.profiles WHERE id = v_user FOR UPDATE;

  SELECT COALESCE(
           jsonb_agg(
             CASE WHEN e->>'id' = p_id
                  THEN jsonb_set(e, '{status}', to_jsonb(p_status))
                  ELSE e END
             ORDER BY ord
           ),
           '[]'::jsonb
         ) INTO v_list
    FROM jsonb_array_elements(v_list) WITH ORDINALITY AS t(e, ord);

  UPDATE public.profiles SET oral_texts = v_list WHERE id = v_user;
  RETURN v_list;
END;
$$;

GRANT EXECUTE ON FUNCTION public.set_oral_text_status(TEXT, TEXT) TO authenticated;

-- Retire un texte du descriptif (ajouté par erreur, ou retiré du programme).
-- Renvoie la nouvelle liste. NULL si non authentifié.
CREATE OR REPLACE FUNCTION public.remove_oral_text(p_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_list JSONB;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;

  SELECT COALESCE(oral_texts, '[]'::jsonb) INTO v_list
    FROM public.profiles WHERE id = v_user FOR UPDATE;

  SELECT COALESCE(jsonb_agg(e), '[]'::jsonb) INTO v_list
    FROM jsonb_array_elements(v_list) e
   WHERE e->>'id' IS DISTINCT FROM p_id;

  UPDATE public.profiles SET oral_texts = v_list WHERE id = v_user;
  RETURN v_list;
END;
$$;

GRANT EXECUTE ON FUNCTION public.remove_oral_text(TEXT) TO authenticated;
