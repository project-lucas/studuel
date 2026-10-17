-- =============================================================================
-- 594 — Rejoindre un groupe de coach donne Studuel+ (17/10/2026)
--
-- Lucas (17/10/2026), le matin où il fait entrer ses joueurs de basket : « je
-- les intègre via Scolaria et ils auront l'abonnement Studuel+ d'office ».
-- Jusqu'ici, le rattachement par code (560) ne touchait pas à l'abonnement :
-- chaque joueur aurait dû être basculé à la main dans /admin/abonnements.
--
--   · `rattachement_par_code` (560) est redéfinie à l'identique, plus une
--     étape : un élève encore GRATUIT qui rejoint un groupe passe en Studuel+
--     (tier1) pour 12 mois, journalisé dans `subscription_grants` (source
--     'coach', référence = le groupe). `expire_subscriptions` (221) le rendra
--     gratuit à l'échéance, comme tout octroi daté.
--   · UNE SEULE FOIS par compte : quitter puis rejoindre un groupe ne rallonge
--     rien. Un abonné payant (tier1/2/3) n'est jamais touché.
--   · Rattrapage : les élèves DÉJÀ rattachés à un groupe actif, encore
--     gratuits et jamais servis, reçoivent le même octroi.
--
-- PRÉREQUIS : 221 (subscription_grants), 560 (coach_groupes, coach_membres).
-- Idempotente (CREATE OR REPLACE ; le rattrapage saute qui a déjà un octroi
-- 'coach'). À exécuter à la main : Supabase Dashboard → SQL Editor → Run.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.rattachement_par_code(p_code TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid    UUID := auth.uid();
  v_code   TEXT := upper(regexp_replace(COALESCE(p_code, ''), '[^A-Za-z0-9]', '', 'g'));
  v_groupe UUID;
  v_type   TEXT;
BEGIN
  IF v_uid IS NULL THEN RETURN 'introuvable'; END IF;
  SELECT profile_type INTO v_type FROM public.profiles WHERE id = v_uid;
  IF v_type IN ('coach', 'parent') THEN RETURN 'coach'; END IF;
  IF v_code !~ '^[A-Z0-9]{8}$' THEN RETURN 'introuvable'; END IF;

  SELECT id INTO v_groupe FROM public.coach_groupes
   WHERE code = v_code AND archive_le IS NULL;
  IF v_groupe IS NULL THEN RETURN 'introuvable'; END IF;

  IF EXISTS (
    SELECT 1 FROM public.coach_membres
     WHERE groupe_id = v_groupe AND eleve_id = v_uid AND statut = 'actif'
  ) THEN RETURN 'deja'; END IF;

  -- Un seul rattachement actif : on quitte l'ancien groupe.
  UPDATE public.coach_membres
     SET statut = 'revoque', revoque_le = now(), revoque_par = 'eleve'
   WHERE eleve_id = v_uid AND statut = 'actif';

  INSERT INTO public.coach_membres (groupe_id, eleve_id, statut, rattache_le, revoque_le, revoque_par)
  VALUES (v_groupe, v_uid, 'actif', now(), NULL, NULL)
  ON CONFLICT (groupe_id, eleve_id) DO UPDATE
     SET statut = 'actif', rattache_le = now(), revoque_le = NULL, revoque_par = NULL;

  -- 594 : Studuel+ offert par le coach, une seule fois par compte.
  IF NOT EXISTS (
    SELECT 1 FROM public.subscription_grants
     WHERE user_id = v_uid AND source = 'coach'
  ) THEN
    UPDATE public.profiles
       SET subscription_tier = 'tier1'
     WHERE id = v_uid AND COALESCE(subscription_tier, 'free') = 'free';
    IF FOUND THEN
      INSERT INTO public.subscription_grants (user_id, tier, expires_at, source, reference, granted_by)
      VALUES (v_uid, 'tier1', now() + interval '12 months', 'coach', v_groupe::text, NULL);
    END IF;
  END IF;

  RETURN 'ok';
END;
$$;
REVOKE ALL ON FUNCTION public.rattachement_par_code(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.rattachement_par_code(TEXT) TO authenticated;

-- Rattrapage : les élèves déjà dans un groupe actif.
WITH eligibles AS (
  SELECT DISTINCT ON (m.eleve_id) m.eleve_id, m.groupe_id
    FROM public.coach_membres m
    JOIN public.coach_groupes g ON g.id = m.groupe_id AND g.archive_le IS NULL
    JOIN public.profiles p ON p.id = m.eleve_id
   WHERE m.statut = 'actif'
     AND COALESCE(p.subscription_tier, 'free') = 'free'
     AND NOT EXISTS (
       SELECT 1 FROM public.subscription_grants s
        WHERE s.user_id = m.eleve_id AND s.source = 'coach'
     )
   ORDER BY m.eleve_id, m.rattache_le DESC
),
bascule AS (
  UPDATE public.profiles p
     SET subscription_tier = 'tier1'
    FROM eligibles e
   WHERE p.id = e.eleve_id
  RETURNING e.eleve_id, e.groupe_id
)
INSERT INTO public.subscription_grants (user_id, tier, expires_at, source, reference, granted_by)
SELECT eleve_id, 'tier1', now() + interval '12 months', 'coach', groupe_id::text, NULL
  FROM bascule;
