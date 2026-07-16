-- =============================================================================
-- Studuel — Migration 157 : objectifs perso de la semaine
-- profiles.weekly_goals (JSONB, tableau) : les 1 à 3 objectifs libres que l'élève
-- se fixe pour la semaine, affichés dans l'onglet Moi. Chaque objectif porte la
-- clé du LUNDI de sa semaine ; l'ajout purge les objectifs des autres semaines →
-- remise à zéro hebdomadaire automatique, sans cron.
--
-- Forme du JSON (tableau) :
--   [ { "id": "<uuid>", "text": "3 sessions de maths", "done": false,
--       "week": "2026-07-13" }, … ]
--
-- Sécurité : lecture par la RLS de profiles (auth.uid() = id, déjà en place).
-- ÉCRITURE : uniquement via les fonctions atomiques ci-dessous — PAS de GRANT
-- UPDATE direct sur la colonne (même raison que 087/156 : read-modify-write d'un
-- tableau JSONB côté client perdrait une mise à jour ; ici c'est sérialisé sous
-- FOR UPDATE).
--
-- PRÉREQUIS : schema.sql (profiles). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS weekly_goals JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Plafond partagé avec lib/weekly-goals.ts (MAX_WEEKLY_GOALS = 3). Si tu changes
-- l'un, change l'autre.

-- Ajoute un objectif à la semaine `p_week` (clé du lundi 'YYYY-MM-DD'). Purge
-- d'abord les objectifs des AUTRES semaines (reset hebdo), refuse au-delà de 3
-- objectifs pour la semaine visée (renvoie la liste inchangée). L'id et l'état
-- `done=false` sont posés en base. NULL si non authentifié / entrée invalide.
CREATE OR REPLACE FUNCTION public.add_weekly_goal(p_text TEXT, p_week TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_text TEXT := NULLIF(btrim(COALESCE(p_text, '')), '');
  v_list JSONB;
  v_week_list JSONB;
  v_entry JSONB;
BEGIN
  IF v_user IS NULL
     OR v_text IS NULL
     OR p_week !~ '^\d{4}-\d{2}-\d{2}$'
  THEN
    RETURN NULL;
  END IF;

  SELECT COALESCE(weekly_goals, '[]'::jsonb) INTO v_list
    FROM public.profiles WHERE id = v_user FOR UPDATE;

  -- Objectifs déjà posés pour la semaine visée.
  SELECT COALESCE(jsonb_agg(e), '[]'::jsonb) INTO v_week_list
    FROM jsonb_array_elements(v_list) e
   WHERE e->>'week' = p_week;

  -- Semaine pleine → on ne touche à rien (liste inchangée, autres semaines
  -- conservées comme le fait la logique pure).
  IF jsonb_array_length(v_week_list) >= 3 THEN
    RETURN v_list;
  END IF;

  v_entry := jsonb_build_object(
    'id', gen_random_uuid()::text,
    'text', left(v_text, 200),
    'done', false,
    'week', p_week
  );

  -- Succès : on ne garde que la semaine courante + le nouvel objectif.
  v_list := v_week_list || jsonb_build_array(v_entry);
  UPDATE public.profiles SET weekly_goals = v_list WHERE id = v_user;
  RETURN v_list;
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_weekly_goal(TEXT, TEXT) TO authenticated;

-- Bascule l'état coché d'un objectif. Renvoie la nouvelle liste. NULL si non
-- authentifié.
CREATE OR REPLACE FUNCTION public.toggle_weekly_goal(p_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_list JSONB;
BEGIN
  IF v_user IS NULL OR p_id IS NULL THEN RETURN NULL; END IF;

  SELECT COALESCE(weekly_goals, '[]'::jsonb) INTO v_list
    FROM public.profiles WHERE id = v_user FOR UPDATE;

  SELECT COALESCE(
           jsonb_agg(
             CASE WHEN e->>'id' = p_id
                  THEN jsonb_set(e, '{done}',
                                 to_jsonb(NOT COALESCE((e->>'done')::boolean, false)))
                  ELSE e END
             ORDER BY ord
           ),
           '[]'::jsonb
         ) INTO v_list
    FROM jsonb_array_elements(v_list) WITH ORDINALITY AS t(e, ord);

  UPDATE public.profiles SET weekly_goals = v_list WHERE id = v_user;
  RETURN v_list;
END;
$$;

GRANT EXECUTE ON FUNCTION public.toggle_weekly_goal(TEXT) TO authenticated;

-- Retire un objectif. Renvoie la nouvelle liste. NULL si non authentifié.
CREATE OR REPLACE FUNCTION public.remove_weekly_goal(p_id TEXT)
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

  SELECT COALESCE(weekly_goals, '[]'::jsonb) INTO v_list
    FROM public.profiles WHERE id = v_user FOR UPDATE;

  SELECT COALESCE(jsonb_agg(e), '[]'::jsonb) INTO v_list
    FROM jsonb_array_elements(v_list) e
   WHERE e->>'id' IS DISTINCT FROM p_id;

  UPDATE public.profiles SET weekly_goals = v_list WHERE id = v_user;
  RETURN v_list;
END;
$$;

GRANT EXECUTE ON FUNCTION public.remove_weekly_goal(TEXT) TO authenticated;
