-- =============================================================================
-- Studuel — Migration 215 : Marcel — quota d'IA et jetons de Prof
--
-- CE QU'ELLE INSTALLE.
--   1. `coach_calls`   — compteur quotidien des appels au Prof, par élève ;
--   2. `coach_tokens`  — solde de JETONS DE PROF (troisième ressource) ;
--   3. `coach_ask_allowed(p_kind)` — la porte : consomme le quota gratuit du
--      jour, sinon un jeton, jamais au-delà du plafond absolu ;
--   4. `coach_buy_tokens(p_packs)` — convertit des gemmes en jetons.
--
-- POURQUOI UNE TROISIÈME RESSOURCE. Les gemmes ouvrent des chapitres À VIE
-- (183/192) et ne s'achètent volontairement pas avec des pièces : sinon le
-- grind cosmétique achèterait Studuel+. Le jeton, lui, se CONSOMME et n'ouvre
-- aucun contenu — on peut donc l'obtenir avec les gemmes (et demain avec des
-- écus) sans ouvrir la moindre brèche dans l'offre payante.
--
-- DEUX PLAFONDS, à ne pas confondre :
--   • le QUOTA quotidien (3 gratuit / 30 abonné) est une limite d'USAGE, que le
--     jeton lève ;
--   • le PLAFOND ABSOLU (50/jour, jetons compris) est une limite de COÛT, que
--     rien ne lève. Sans lui, un élève assis sur un gros solde se paierait des
--     milliers d'appels dans la nuit.
--
-- Modèle repris de la migration 198 (quota IA du carnet), qui a déjà servi de
-- leçon : compteurs écrits UNIQUEMENT par des fonctions `SECURITY DEFINER`, RLS
-- active, aucune policy en écriture, plafonds décidés ICI et jamais fournis par
-- l'appelant.
--
-- ⚠️ ORDRE, différent de la 198. Ici le code REFUSE quand la RPC est absente
-- (fail closed) : c'est une fonctionnalité neuve, personne ne perd rien tant que
-- la migration n'est pas passée, et le trou ne peut donc jamais s'ouvrir.
--
-- Miroir applicatif : `lib/coach/jetons.ts` (mêmes montants). Toute évolution
-- doit toucher LES DEUX.
--
-- PRÉREQUIS : 001 (profiles), 183 + 192 (profiles.gems). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- ------------------------------------------------------- 1. les compteurs
-- Une ligne par (élève, jour). Volume minuscule ; le ménage des vieux jours
-- pourra se faire plus tard, il ne gêne personne en attendant.
CREATE TABLE IF NOT EXISTS public.coach_calls (
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  day_bucket DATE NOT NULL,
  attempts   INT  NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, day_bucket)
);

ALTER TABLE public.coach_calls ENABLE ROW LEVEL SECURITY;

-- Lecture de SON compteur seulement : l'écran affiche « il te reste 2
-- questions », il a besoin de le lire. L'écriture, elle, reste interdite —
-- aucune policy INSERT/UPDATE, seule la fonction definer écrit.
DROP POLICY IF EXISTS coach_calls_select_own ON public.coach_calls;
CREATE POLICY coach_calls_select_own ON public.coach_calls
  FOR SELECT USING (user_id = auth.uid());

REVOKE INSERT, UPDATE, DELETE ON public.coach_calls FROM anon, authenticated;

-- --------------------------------------------------------- 2. les jetons
CREATE TABLE IF NOT EXISTS public.coach_tokens (
  user_id    UUID PRIMARY KEY REFERENCES public.profiles (id) ON DELETE CASCADE,
  balance    INT  NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$
BEGIN
  ALTER TABLE public.coach_tokens
    ADD CONSTRAINT coach_tokens_balance_positive CHECK (balance >= 0);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE public.coach_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS coach_tokens_select_own ON public.coach_tokens;
CREATE POLICY coach_tokens_select_own ON public.coach_tokens
  FOR SELECT USING (user_id = auth.uid());

-- Même principe que profiles.gems : un client qui tenterait
-- `update coach_tokens set balance = 999` se heurte à l'absence de droit.
REVOKE INSERT, UPDATE, DELETE ON public.coach_tokens FROM anon, authenticated;

-- ----------------------------------------------------------- 3. la porte
-- Autorise (ou non) un appel au Prof, et le fait payer dans le bon ordre :
-- quota gratuit du jour → jeton → refus. Le compteur monte AVANT la réponse du
-- modèle, y compris sur un refus : marteler l'endpoint doit coûter, sinon le
-- limiteur ne limite rien (leçon de la 198).
CREATE OR REPLACE FUNCTION public.coach_ask_allowed(p_kind TEXT DEFAULT 'question')
RETURNS TEXT
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user    UUID := auth.uid();
  v_day     DATE := (now() AT TIME ZONE 'utc')::date;
  v_tier    TEXT;
  v_quota   INT;
  v_count   INT;
  v_tokens  INT;
  -- Plafond de FACTURE : jetons compris, il ne se lève avec rien.
  v_plafond CONSTANT INT := 50;
BEGIN
  IF v_user IS NULL THEN RETURN 'refuse'; END IF;

  -- Le type d'appel n'est là que pour les statistiques futures ; il ne décide
  -- d'aucun montant. Aucun plafond ne vient jamais de l'appelant.
  IF p_kind IS NULL OR length(p_kind) > 40 THEN RETURN 'refuse'; END IF;

  SELECT subscription_tier INTO v_tier FROM public.profiles WHERE id = v_user;
  v_quota := CASE WHEN v_tier IN ('tier1', 'tier2', 'tier3') THEN 30 ELSE 3 END;

  INSERT INTO public.coach_calls (user_id, day_bucket, attempts)
  VALUES (v_user, v_day, 1)
  ON CONFLICT (user_id, day_bucket)
    DO UPDATE SET attempts = coach_calls.attempts + 1
  RETURNING attempts INTO v_count;

  -- Limite de coût d'abord : elle prime sur tout, abonnement compris.
  IF v_count > v_plafond THEN RETURN 'plafond'; END IF;

  -- Dans le quota du jour : rien à débiter.
  IF v_count <= v_quota THEN RETURN 'quota'; END IF;

  -- Au-delà : un jeton, s'il y en a un. Le UPDATE conditionnel joue le rôle de
  -- verrou — deux requêtes simultanées ne peuvent pas dépenser le même jeton.
  UPDATE public.coach_tokens
     SET balance = balance - 1, updated_at = now()
   WHERE user_id = v_user AND balance > 0
  RETURNING balance INTO v_tokens;

  IF FOUND THEN RETURN 'jeton'; END IF;

  RETURN 'refuse';
END;
$$;

REVOKE ALL ON FUNCTION public.coach_ask_allowed(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.coach_ask_allowed(TEXT) TO authenticated;

-- ------------------------------------------------------- 4. l'achat en gemmes
-- Convertit des gemmes en jetons. Les montants sont ICI, jamais fournis par le
-- client (leçon des 088 et 192).
CREATE OR REPLACE FUNCTION public.coach_buy_tokens(p_packs INT DEFAULT 1)
RETURNS TEXT
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := auth.uid();
  v_packs  INT;
  v_cout   INT;
  v_gems   INT;
  -- Miroir de lib/coach/jetons.ts : 5 gemmes → 10 jetons.
  v_prix   CONSTANT INT := 5;
  v_gain   CONSTANT INT := 10;
  -- Garde-fou : on n'achète pas 10 000 packs d'un coup par mégarde ou par script.
  v_max    CONSTANT INT := 5;
BEGIN
  IF v_user IS NULL THEN RETURN 'refuse'; END IF;

  v_packs := GREATEST(1, LEAST(COALESCE(p_packs, 1), v_max));
  v_cout  := v_packs * v_prix;

  -- Débit conditionnel : le WHERE fait office de vérification ET de verrou.
  UPDATE public.profiles
     SET gems = gems - v_cout
   WHERE id = v_user AND gems >= v_cout
  RETURNING gems INTO v_gems;

  IF NOT FOUND THEN RETURN 'no_gems'; END IF;

  INSERT INTO public.coach_tokens (user_id, balance, updated_at)
  VALUES (v_user, v_packs * v_gain, now())
  ON CONFLICT (user_id)
    DO UPDATE SET balance = coach_tokens.balance + v_packs * v_gain,
                  updated_at = now();

  RETURN 'ok';
END;
$$;

REVOKE ALL ON FUNCTION public.coach_buy_tokens(INT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.coach_buy_tokens(INT) TO authenticated;
