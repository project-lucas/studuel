-- =============================================================================
-- Studuel — Migration 581 : LES RECHARGES DE MARCEL, ET LA MESURE DE CE QU'IL
-- COÛTE
--
-- Lucas, 15/10/2026 : « il faut rajouter, comme pour Claude, des recharges de
-- crédit : Marcel doit dormir, il se réveillera dans X jours s'il a atteint la
-- limite, avec en boutique la possibilité de le recharger » ; « faire attention
-- à ce que cette fonctionnalité ne flingue pas ma marge ». Choix du même jour :
-- les recharges se paient EN EUROS seulement.
--
-- CE QU'ELLE INSTALLE.
--   1. `recharges_marcel` — le catalogue (miroir de lib/coach/recharges.ts,
--      testé contre ce fichier) ;
--   2. `recharges_marcel_achats` + `demander_recharge_marcel` (l'élève) +
--      `accorder_recharge_marcel` (l'admin, demain le webhook d'un prestataire)
--      — le même circuit que les packs de gemmes (369). Le crédit s'ajoute au
--      solde de RECHARGE (`coach_tokens.balance`, les anciens « jetons de
--      Prof » de la 215) : la porte de Marcel (378) le dépense déjà quand les
--      crédits du mois sont passés, et il ne s'efface pas en fin de mois ;
--   3. `coach_buy_tokens` FERMÉE : les gemmes (gagnées en jouant, et
--      désormais en rente, 580) n'achètent plus de temps d'IA — elle répond
--      toujours « ferme » ;
--   4. `marcel_usage` + `marcel_usage_noter` : chaque appel au modèle note ses
--      jetons (entrée, cache, sortie), pour MESURER la marge (/admin/marcel,
--      `marcel_usage_mois`, lu par l'admin seul). Le serveur n'ayant que la clé
--      anonyme, la note est écrite au nom de l'élève : elle est bornée (valeurs,
--      60 lignes par jour) et ne sert qu'à des statistiques.
--
-- PRÉREQUIS : 028 (is_admin), 215 (coach_tokens), 378. Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- ───────────────────────────────────────────────────── 1. le catalogue

CREATE TABLE IF NOT EXISTS public.recharges_marcel (
  id         TEXT PRIMARY KEY CHECK (id ~ '^[a-z0-9-]{2,40}$'),
  titre      TEXT NOT NULL,
  credits    INTEGER NOT NULL CHECK (credits > 0),
  prix_euros NUMERIC(7, 2) NOT NULL CHECK (prix_euros > 0),
  ordre      INTEGER NOT NULL DEFAULT 0,
  publie     BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO public.recharges_marcel (id, titre, credits, prix_euros, ordre) VALUES
  ('coup-de-pouce', 'Coup de pouce', 50, 1.99, 10),
  ('semaine', 'Semaine de révisions', 150, 3.99, 20),
  ('examens', 'Pack examens', 400, 7.99, 30)
ON CONFLICT (id) DO UPDATE
  SET titre      = EXCLUDED.titre,
      credits    = EXCLUDED.credits,
      prix_euros = EXCLUDED.prix_euros,
      ordre      = EXCLUDED.ordre;

ALTER TABLE public.recharges_marcel ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS recharges_marcel_lecture ON public.recharges_marcel;
CREATE POLICY recharges_marcel_lecture ON public.recharges_marcel
  FOR SELECT TO anon, authenticated
  USING (publie OR (SELECT public.is_admin()));
GRANT SELECT ON public.recharges_marcel TO anon, authenticated;

-- ─────────────────────────────────────────────── 2. les demandes d'achat

CREATE TABLE IF NOT EXISTS public.recharges_marcel_achats (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  recharge_id TEXT NOT NULL REFERENCES public.recharges_marcel (id),
  -- Ce qui a été promis au moment de la demande.
  credits     INTEGER NOT NULL CHECK (credits > 0),
  prix_euros  NUMERIC(7, 2) NOT NULL CHECK (prix_euros > 0),
  statut      TEXT NOT NULL DEFAULT 'attente_paiement'
              CHECK (statut IN ('attente_paiement', 'payee', 'annulee')),
  contact     TEXT CHECK (contact IS NULL OR length(contact) BETWEEN 5 AND 160),
  reference   TEXT CHECK (reference IS NULL OR length(reference) <= 200),
  demande_le  TIMESTAMPTZ NOT NULL DEFAULT now(),
  payee_le    TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS recharges_marcel_achats_attente_idx
  ON public.recharges_marcel_achats (demande_le DESC)
  WHERE statut = 'attente_paiement';
CREATE INDEX IF NOT EXISTS recharges_marcel_achats_user_idx
  ON public.recharges_marcel_achats (user_id, demande_le DESC);
-- Une seule demande EN ATTENTE par élève et par recharge : c'est l'index qui
-- le garantit (un double clic ne crée pas deux demandes), pas un verrou.
CREATE UNIQUE INDEX IF NOT EXISTS recharges_marcel_achats_une_attente
  ON public.recharges_marcel_achats (user_id, recharge_id)
  WHERE statut = 'attente_paiement';

ALTER TABLE public.recharges_marcel_achats ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS recharges_marcel_achats_lecture ON public.recharges_marcel_achats;
CREATE POLICY recharges_marcel_achats_lecture ON public.recharges_marcel_achats
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()) OR (SELECT public.is_admin()));
REVOKE INSERT, UPDATE, DELETE ON public.recharges_marcel_achats FROM anon, authenticated;

-- Une seule demande EN ATTENTE par élève et par recharge : la redemander la
-- rafraîchit. Rend {"ok": true} ou {"ok": false, "raison": anonyme | inconnu}.
CREATE OR REPLACE FUNCTION public.demander_recharge_marcel(
  p_recharge TEXT,
  p_contact  TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user     UUID := auth.uid();
  v_recharge public.recharges_marcel%ROWTYPE;
  v_contact  TEXT := NULLIF(btrim(COALESCE(p_contact, '')), '');
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'anonyme');
  END IF;

  SELECT * INTO v_recharge FROM public.recharges_marcel WHERE id = p_recharge AND publie;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'inconnu');
  END IF;

  IF v_contact IS NOT NULL AND length(v_contact) NOT BETWEEN 5 AND 160 THEN
    v_contact := NULL;
  END IF;

  INSERT INTO public.recharges_marcel_achats (user_id, recharge_id, credits, prix_euros, contact)
  VALUES (v_user, p_recharge, v_recharge.credits, v_recharge.prix_euros, v_contact)
  ON CONFLICT (user_id, recharge_id) WHERE statut = 'attente_paiement'
  DO UPDATE SET demande_le = now(),
                contact    = COALESCE(EXCLUDED.contact, recharges_marcel_achats.contact),
                credits    = EXCLUDED.credits,
                prix_euros = EXCLUDED.prix_euros;

  RETURN jsonb_build_object('ok', true);
END;
$$;
REVOKE ALL ON FUNCTION public.demander_recharge_marcel(TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.demander_recharge_marcel(TEXT, TEXT) TO authenticated;

-- Confirmer un paiement — admin seulement. Crédite les crédits notés sur la
-- demande, une seule fois.
CREATE OR REPLACE FUNCTION public.accorder_recharge_marcel(
  p_achat     UUID,
  p_reference TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_achat public.recharges_marcel_achats%ROWTYPE;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'accorder_recharge_marcel : réservé aux administrateurs';
  END IF;

  SELECT * INTO v_achat FROM public.recharges_marcel_achats WHERE id = p_achat FOR UPDATE;
  IF NOT FOUND OR v_achat.statut <> 'attente_paiement' THEN
    RETURN false;
  END IF;

  INSERT INTO public.coach_tokens (user_id, balance, updated_at)
  VALUES (v_achat.user_id, v_achat.credits, now())
  ON CONFLICT (user_id)
    DO UPDATE SET balance = coach_tokens.balance + EXCLUDED.balance, updated_at = now();

  UPDATE public.recharges_marcel_achats
     SET statut    = 'payee',
         payee_le  = now(),
         reference = NULLIF(btrim(COALESCE(p_reference, '')), '')
   WHERE id = p_achat;
  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.accorder_recharge_marcel(UUID, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.accorder_recharge_marcel(UUID, TEXT) TO authenticated;

-- ─────────────────────── 3. les gemmes n'achètent plus de temps d'IA

CREATE OR REPLACE FUNCTION public.coach_buy_tokens(p_packs INT DEFAULT 1)
RETURNS TEXT
LANGUAGE sql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 'ferme'::text;
$$;
REVOKE ALL ON FUNCTION public.coach_buy_tokens(INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.coach_buy_tokens(INT) TO authenticated;

-- ───────────────────────────────────── 4. ce que coûte chaque appel

CREATE TABLE IF NOT EXISTS public.marcel_usage (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  jour         DATE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')::date,
  mode         TEXT NOT NULL CHECK (mode IN ('question', 'fiche', 'exercice', 'flashcards', 'oral', 'autre')),
  modele       TEXT NOT NULL CHECK (char_length(modele) BETWEEN 1 AND 60),
  entree       INTEGER NOT NULL CHECK (entree BETWEEN 0 AND 40000),
  entree_cache INTEGER NOT NULL DEFAULT 0 CHECK (entree_cache BETWEEN 0 AND 40000),
  sortie       INTEGER NOT NULL CHECK (sortie BETWEEN 0 AND 8000),
  cree_le      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS marcel_usage_jour_idx ON public.marcel_usage (jour);
CREATE INDEX IF NOT EXISTS marcel_usage_user_jour_idx ON public.marcel_usage (user_id, jour);
ALTER TABLE public.marcel_usage ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS marcel_usage_admin ON public.marcel_usage;
CREATE POLICY marcel_usage_admin ON public.marcel_usage
  FOR SELECT TO authenticated USING ((SELECT public.is_admin()));
REVOKE INSERT, UPDATE, DELETE ON public.marcel_usage FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.marcel_usage_noter(
  p_mode         TEXT,
  p_modele       TEXT,
  p_entree       INTEGER,
  p_entree_cache INTEGER,
  p_sortie       INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_jour DATE := (now() AT TIME ZONE 'utc')::date;
BEGIN
  IF v_user IS NULL THEN RETURN; END IF;
  -- Le plafond de facture est de 50 appels par jour (378) : au-delà de 60
  -- lignes, la note est un abus, on l'ignore.
  IF (SELECT count(*) FROM public.marcel_usage WHERE user_id = v_user AND jour = v_jour) >= 60 THEN
    RETURN;
  END IF;
  INSERT INTO public.marcel_usage (user_id, jour, mode, modele, entree, entree_cache, sortie)
  VALUES (
    v_user, v_jour,
    CASE WHEN p_mode IN ('question', 'fiche', 'exercice', 'flashcards', 'oral') THEN p_mode ELSE 'autre' END,
    left(COALESCE(NULLIF(btrim(p_modele), ''), 'inconnu'), 60),
    LEAST(40000, GREATEST(0, COALESCE(p_entree, 0))),
    LEAST(40000, GREATEST(0, COALESCE(p_entree_cache, 0))),
    LEAST(8000, GREATEST(0, COALESCE(p_sortie, 0))));
END;
$$;
REVOKE ALL ON FUNCTION public.marcel_usage_noter(TEXT, TEXT, INTEGER, INTEGER, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.marcel_usage_noter(TEXT, TEXT, INTEGER, INTEGER, INTEGER) TO authenticated;

-- Le mois, pour /admin/marcel : jetons par modèle et par mode, élèves actifs,
-- abonnés (pour rapporter le coût à l'abonné). Admin seulement.
CREATE OR REPLACE FUNCTION public.marcel_usage_mois(p_mois DATE DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_debut DATE := date_trunc('month', COALESCE(p_mois, (now() AT TIME ZONE 'utc')::date))::date;
  v_fin   DATE := (date_trunc('month', COALESCE(p_mois, (now() AT TIME ZONE 'utc')::date)) + interval '1 month')::date;
BEGIN
  IF NOT public.is_admin() THEN RETURN NULL; END IF;
  RETURN jsonb_build_object(
    'mois', v_debut,
    'lignes', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
               'modele', modele, 'mode', mode, 'appels', appels,
               'entree', entree, 'entree_cache', entree_cache, 'sortie', sortie)
             ORDER BY appels DESC)
        FROM (
          SELECT modele, mode, count(*) AS appels, sum(entree) AS entree,
                 sum(entree_cache) AS entree_cache, sum(sortie) AS sortie
            FROM public.marcel_usage
           WHERE jour >= v_debut AND jour < v_fin
           GROUP BY modele, mode
        ) t), '[]'::jsonb),
    'eleves', (SELECT count(DISTINCT user_id) FROM public.marcel_usage WHERE jour >= v_debut AND jour < v_fin),
    'abonnes', (SELECT count(*) FROM public.profiles WHERE subscription_tier IN ('tier1', 'tier2', 'tier3')),
    'recharges_payees', (SELECT COALESCE(sum(prix_euros), 0) FROM public.recharges_marcel_achats
                          WHERE statut = 'payee' AND payee_le >= v_debut AND payee_le < v_fin));
END;
$$;
REVOKE ALL ON FUNCTION public.marcel_usage_mois(DATE) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.marcel_usage_mois(DATE) TO authenticated;

-- Contrôle à la main :
--   select * from public.recharges_marcel order by ordre;   → 3 lignes
--   select public.coach_buy_tokens(1);                       → ferme
