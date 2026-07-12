-- =============================================================================
-- Scolaria — Migration 021 : répétition espacée (SRS) + cahier d'erreurs
-- (« la Revanche »). Une ligne par (élève, question/carte) : série de succès,
-- erreurs cumulées, prochaine date de révision, présence dans la Revanche.
-- L'algorithme (intervalles J+1 → J+35) vit côté application (lib/srs.ts) ;
-- la base garantit l'intégrité et l'isolation par élève (RLS).
-- Le bonus « Revanche vidée » verse des pièces via une fonction SECURITY
-- DEFINER (profiles.coins n'est pas modifiable directement), au plus une fois
-- par jour UTC (table revanche_clears, même pattern que chest_opens).
-- PRÉREQUIS : 001, 002, 007, 018 exécutées. Idempotent.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.review_items (
  user_id     UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  item_kind   TEXT NOT NULL CHECK (item_kind IN ('question', 'card')),
  item_id     UUID NOT NULL, -- quiz_questions.id ou deck_cards.id
  subject     TEXT,          -- dénormalisé : la Revanche s'affiche par matière
  streak      INT  NOT NULL DEFAULT 0 CHECK (streak >= 0),
  lapses      INT  NOT NULL DEFAULT 0 CHECK (lapses >= 0),
  due_date    DATE NOT NULL,
  in_revanche BOOLEAN NOT NULL DEFAULT false,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, item_kind, item_id)
);

-- La file du jour se lit par élève et par date d'échéance.
CREATE INDEX IF NOT EXISTS review_items_due_idx
  ON public.review_items (user_id, due_date);

ALTER TABLE public.review_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "review_items_select_own" ON public.review_items;
CREATE POLICY "review_items_select_own" ON public.review_items
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "review_items_insert_own" ON public.review_items;
CREATE POLICY "review_items_insert_own" ON public.review_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "review_items_update_own" ON public.review_items;
CREATE POLICY "review_items_update_own" ON public.review_items
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

GRANT SELECT, INSERT, UPDATE ON public.review_items TO authenticated;

-- -----------------------------------------------------------------------------
-- Bonus « Revanche vidée » : quelques pièces, au plus une fois par jour UTC.
-- L'action serveur vérifie que la Revanche est bien vide avant d'appeler.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.revanche_clears (
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  date       DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, date)
);

ALTER TABLE public.revanche_clears ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "revanche_clears_select_own" ON public.revanche_clears;
CREATE POLICY "revanche_clears_select_own" ON public.revanche_clears
  FOR SELECT USING (auth.uid() = user_id);
-- Pas de policy INSERT : l'écriture passe par claim_revanche_bonus() (definer).

CREATE OR REPLACE FUNCTION public.claim_revanche_bonus(p_coins INT)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
BEGIN
  IF v_user IS NULL THEN RETURN false; END IF;

  -- Garde-fou serveur : le bonus ne se réclame que Revanche réellement vide.
  IF EXISTS (
    SELECT 1 FROM public.review_items
    WHERE user_id = v_user AND in_revanche
  ) THEN RETURN false; END IF;

  INSERT INTO public.revanche_clears (user_id, date)
  VALUES (v_user, (now() AT TIME ZONE 'utc')::date)
  ON CONFLICT (user_id, date) DO NOTHING;
  IF NOT FOUND THEN RETURN false; END IF; -- déjà réclamé aujourd'hui

  UPDATE public.profiles
     SET coins = coins + GREATEST(0, LEAST(p_coins, 100))
   WHERE id = v_user;

  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_revanche_bonus(INT) TO authenticated;
