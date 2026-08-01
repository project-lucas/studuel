-- =============================================================================
-- Studuel — Migration 221 : LA CAISSE, version 0
--
-- LE CONSTAT (audit du 31/07/2026, revérifié le 01/08) : aucun système de
-- paiement n'existe, et `profiles.subscription_tier` n'est écrit par AUCUNE
-- ligne de code du dépôt. Personne ne peut devenir `tier1`. Conséquence en
-- chaîne : tout le gating premium (quiz payants, cartes mentales, fiches, les
-- 30 questions/jour de Marcel) est du code mort, et l'onglet Trésor est une
-- page de promesse. Cliquer « Choisir cette offre » n'écrivait littéralement
-- RIEN — pas même le fait qu'un parent ait voulu payer.
--
-- CE QUE FAIT CETTE MIGRATION, ET CE QU'ELLE NE FAIT PAS
--   ✔ Elle enregistre l'INTENTION d'abonnement (qui, quelle offre, quand,
--     comment être recontacté).
--   ✔ Elle donne à un ADMIN le moyen d'accorder réellement un abonnement, avec
--     une échéance et une trace vérifiable.
--   ✘ Elle ne choisit AUCUN prestataire de paiement, ne stocke aucune donnée
--     bancaire, ne débite personne. Le paiement se fait hors de l'app (virement,
--     lien externe, espèces) — c'est le choix de Lucas, et il reste entier.
--
-- POURQUOI CETTE VERSION RUSTIQUE PLUTÔT QUE RIEN : elle valide qu'un parent
-- paie, ce qu'aucune ligne de code ne sait aujourd'hui. Et le jour où un
-- prestataire est branché, son webhook n'aura qu'à appeler `grant_subscription`
-- — la moitié serveur est déjà là, testée, tracée.
--
-- SÉCURITÉ (mêmes règles que 198 et 215)
--   · `subscription_tier` reste INÉCRIVABLE par l'élève : la colonne n'est pas
--     dans le GRANT UPDATE de `profiles`, et cette migration ne l'y met pas.
--     Seule la fonction `grant_subscription`, SECURITY DEFINER et réservée aux
--     admins, y touche.
--   · `subscription_grants` n'a AUCUNE policy d'écriture : la trace ne peut pas
--     être fabriquée depuis le client, même par un admin.
--   · L'élève ne voit que SES propres intentions. L'admin voit tout.
--   · Anti-spam : une intention par utilisateur et par offre et par jour.
--
-- PRÉREQUIS : schema.sql (profiles), 028 (is_admin). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. SUBSCRIPTION_INTEREST — « je veux m'abonner »
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subscription_interest (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  -- Le domaine reprend EXACTEMENT celui de `profiles.subscription_tier`,
  -- 'free' compris, parce que le garde-miroir (lib/premium-mirror-guard.test)
  -- exige que toute énumération de paliers en SQL soit identique des deux
  -- côtés — une divergence est le meilleur moyen d'ouvrir un accès payant sans
  -- que rien ne rougisse. Une demande sur 'free' n'a aucun sens, et c'est
  -- `estPlanPayant` (lib/abonnement.ts, testé) qui la refuse avant l'insert.
  plan_id    TEXT NOT NULL CHECK (plan_id IN ('free', 'tier1', 'tier2', 'tier3')),
  -- Facultatif : de quoi rappeler un parent qui n'est pas l'élève connecté.
  -- Jamais obligatoire — un élève qui montre son envie compte aussi.
  contact    TEXT CHECK (contact IS NULL OR length(contact) BETWEEN 5 AND 160),
  note       TEXT CHECK (note IS NULL OR length(note) <= 500),
  -- Jour UTC de la demande : porte l'anti-doublon (une par offre et par jour).
  day        DATE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Suivi commercial, écrit par l'admin uniquement (cf. policy plus bas).
  handled_at TIMESTAMPTZ,
  UNIQUE (user_id, plan_id, day)
);

CREATE INDEX IF NOT EXISTS subscription_interest_created_idx
  ON public.subscription_interest (created_at DESC);
CREATE INDEX IF NOT EXISTS subscription_interest_pending_idx
  ON public.subscription_interest (created_at DESC)
  WHERE handled_at IS NULL;

ALTER TABLE public.subscription_interest ENABLE ROW LEVEL SECURITY;

-- L'élève : il crée SA demande et relit les siennes. Rien d'autre.
DROP POLICY IF EXISTS "interest_insert_self" ON public.subscription_interest;
CREATE POLICY "interest_insert_self" ON public.subscription_interest
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "interest_select_self" ON public.subscription_interest;
CREATE POLICY "interest_select_self" ON public.subscription_interest
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id OR public.is_admin());

-- L'admin : il marque une demande comme traitée. Pas de suppression : la
-- demande d'un parent n'a pas à disparaître d'un clic.
DROP POLICY IF EXISTS "interest_update_admin" ON public.subscription_interest;
CREATE POLICY "interest_update_admin" ON public.subscription_interest
  FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

REVOKE ALL ON public.subscription_interest FROM authenticated, anon;
GRANT SELECT, INSERT ON public.subscription_interest TO authenticated;
GRANT UPDATE (handled_at) ON public.subscription_interest TO authenticated;

-- -----------------------------------------------------------------------------
-- 2. SUBSCRIPTION_GRANTS — la trace de ce qui a été RÉELLEMENT accordé
--    Une ligne par octroi (jamais modifiée) : c'est le journal comptable.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subscription_grants (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  tier       TEXT NOT NULL CHECK (tier IN ('free', 'tier1', 'tier2', 'tier3')),
  -- Fin de validité. NULL = sans échéance (offert, test interne).
  expires_at TIMESTAMPTZ,
  -- D'où vient l'octroi : 'manuel' (Lucas encaisse hors app), 'cadeau',
  -- 'test', ou plus tard le nom d'un prestataire de paiement.
  source     TEXT NOT NULL DEFAULT 'manuel',
  -- Référence externe : n° de virement, identifiant de transaction…
  reference  TEXT CHECK (reference IS NULL OR length(reference) <= 120),
  granted_by UUID REFERENCES public.profiles (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS subscription_grants_user_idx
  ON public.subscription_grants (user_id, created_at DESC);

ALTER TABLE public.subscription_grants ENABLE ROW LEVEL SECURITY;

-- Lecture seule, et seulement la sienne (ou tout, si admin). AUCUNE policy
-- d'écriture : seule la RPC ci-dessous insère.
DROP POLICY IF EXISTS "grants_select_self_or_admin" ON public.subscription_grants;
CREATE POLICY "grants_select_self_or_admin" ON public.subscription_grants
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = user_id OR public.is_admin());

REVOKE ALL ON public.subscription_grants FROM authenticated, anon;
GRANT SELECT ON public.subscription_grants TO authenticated;

-- -----------------------------------------------------------------------------
-- 3. GRANT_SUBSCRIPTION — le seul chemin vers `profiles.subscription_tier`
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.grant_subscription(
  p_user_id UUID,
  p_tier    TEXT,
  p_months  INTEGER DEFAULT 1,
  p_source  TEXT DEFAULT 'manuel',
  p_reference TEXT DEFAULT NULL
)
RETURNS TABLE (tier TEXT, expires_at TIMESTAMPTZ)
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin   UUID := auth.uid();
  v_expires TIMESTAMPTZ;
BEGIN
  -- Fail closed : un non-admin ne passe pas, même en appelant la RPC à la main
  -- avec la clé anon publique.
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'reserve aux administrateurs';
  END IF;
  -- Pas de liste de paliers recopiée ici : c'est le CHECK de
  -- `profiles.subscription_tier` (schema.sql) qui fait autorité. Un palier
  -- inventé fait échouer l'UPDATE ci-dessous, donc toute la transaction. Une
  -- énumération de plus, c'est une énumération qui peut diverger — et le
  -- garde-miroir des paliers existe précisément parce que c'est déjà arrivé.
  --
  -- Bornes de durée, en revanche : ni durée absurde, ni octroi perpétuel par
  -- inadvertance. « 999 mois » est la façon la plus courante de transformer un
  -- abonnement en cadeau à vie sans s'en apercevoir.
  IF p_months IS NOT NULL AND (p_months < 0 OR p_months > 36) THEN
    RAISE EXCEPTION 'duree hors bornes (0 a 36 mois) : %', p_months;
  END IF;

  -- 0 mois OU palier 'free' = révocation : pas d'échéance à écrire.
  IF p_tier = 'free' OR COALESCE(p_months, 0) = 0 THEN
    v_expires := NULL;
  ELSE
    v_expires := now() + make_interval(months => p_months);
  END IF;

  UPDATE public.profiles
     SET subscription_tier = p_tier
   WHERE id = p_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'profil introuvable : %', p_user_id;
  END IF;

  INSERT INTO public.subscription_grants
    (user_id, tier, expires_at, source, reference, granted_by)
  VALUES (p_user_id, p_tier, v_expires, COALESCE(p_source, 'manuel'), p_reference, v_admin);

  RETURN QUERY SELECT p_tier, v_expires;
END $$;

REVOKE ALL ON FUNCTION public.grant_subscription(UUID, TEXT, INTEGER, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.grant_subscription(UUID, TEXT, INTEGER, TEXT, TEXT) TO authenticated;

-- -----------------------------------------------------------------------------
-- 4. EXPIRE_SUBSCRIPTIONS — la contrepartie honnête de l'échéance
--    Sans elle, « 1 mois » voudrait dire « à vie ». Appelée par le cron des
--    rappels (GitHub Actions), ou à la main depuis /admin.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.expire_subscriptions()
RETURNS INTEGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER := 0;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'reserve aux administrateurs';
  END IF;

  -- Un profil retombe en 'free' si son dernier octroi a une échéance passée.
  WITH dernier AS (
    SELECT DISTINCT ON (user_id) user_id, tier, expires_at
      FROM public.subscription_grants
     ORDER BY user_id, created_at DESC
  ), a_expirer AS (
    SELECT d.user_id FROM dernier d
      JOIN public.profiles p ON p.id = d.user_id
     WHERE d.expires_at IS NOT NULL
       AND d.expires_at < now()
       AND p.subscription_tier <> 'free'
  )
  UPDATE public.profiles p
     SET subscription_tier = 'free'
    FROM a_expirer a
   WHERE p.id = a.user_id;

  GET DIAGNOSTICS v_count = ROW_COUNT;

  -- Trace : une expiration est un mouvement de compte, elle se journalise.
  INSERT INTO public.subscription_grants (user_id, tier, source, granted_by)
  SELECT p.id, 'free', 'expiration', auth.uid()
    FROM public.profiles p
   WHERE p.subscription_tier = 'free'
     AND EXISTS (
       SELECT 1 FROM public.subscription_grants g
        WHERE g.user_id = p.id AND g.expires_at IS NOT NULL AND g.expires_at < now()
     )
     AND NOT EXISTS (
       SELECT 1 FROM public.subscription_grants g2
        WHERE g2.user_id = p.id AND g2.source = 'expiration'
          AND g2.created_at > (
            SELECT max(g3.expires_at) FROM public.subscription_grants g3
             WHERE g3.user_id = p.id AND g3.expires_at IS NOT NULL
          )
     );

  RETURN v_count;
END $$;

REVOKE ALL ON FUNCTION public.expire_subscriptions() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.expire_subscriptions() TO authenticated;

-- -----------------------------------------------------------------------------
-- 5. Sonde finale
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF to_regclass('public.subscription_interest') IS NULL
     OR to_regclass('public.subscription_grants') IS NULL THEN
    RAISE EXCEPTION 'Migration 221 incomplete : tables absentes';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'grant_subscription'
  ) THEN
    RAISE EXCEPTION 'Migration 221 incomplete : grant_subscription absente';
  END IF;
  RAISE NOTICE 'Migration 221 OK : la caisse v0 est en place.';
END $$;
