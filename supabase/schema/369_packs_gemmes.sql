-- =============================================================================
-- 369 — LES PACKS DE GEMMES : la section « Gemmes » de la Boutique, sur le
-- modèle du magasin de Clash Royale (Lucas, 18/09/2026). Trois packs —
-- quelques gemmes, un sac, un baril —, vendus en euros.
--
-- L'app n'encaisse encore aucun euro (même régime que Studuel+, 221, et que
-- les capsules par carte, 366). Acheter un pack enregistre donc une DEMANDE,
-- avec le contact facultatif d'un parent ; l'admin — demain le webhook d'un
-- prestataire de paiement — la confirme avec `accorder_pack_gemmes`, qui
-- crédite les gemmes. Le crédit lit la quantité NOTÉE SUR LA DEMANDE (prise au
-- catalogue au moment de la demande) : changer un prix ensuite ne change pas
-- ce qui a été promis.
--
-- PRIX ET QUANTITÉS PROVISOIRES, miroir de `PACKS_GEMMES`
-- (lib/boutique/packs-gemmes.ts) — un test compare les deux.
--
-- PRÉREQUIS : schema.sql (profiles), 028 (is_admin), 183 et 192
--             (profiles.gems). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. LE CATALOGUE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.packs_gemmes (
  id         TEXT PRIMARY KEY CHECK (id ~ '^[a-z0-9-]{2,40}$'),
  titre      TEXT NOT NULL,
  gemmes     INTEGER NOT NULL CHECK (gemmes > 0),
  prix_euros NUMERIC(7, 2) NOT NULL CHECK (prix_euros > 0),
  ordre      INTEGER NOT NULL DEFAULT 0,
  publie     BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO public.packs_gemmes (id, titre, gemmes, prix_euros, ordre) VALUES
  ('poignee', 'Quelques gemmes',   80,  1.19, 10),
  ('sac',     'Sac de gemmes',    500,  5.99, 20),
  ('baril',   'Baril de gemmes', 1200, 11.99, 30)
ON CONFLICT (id) DO UPDATE
  SET titre      = EXCLUDED.titre,
      gemmes     = EXCLUDED.gemmes,
      prix_euros = EXCLUDED.prix_euros,
      ordre      = EXCLUDED.ordre;

-- -----------------------------------------------------------------------------
-- 2. LES DEMANDES D'ACHAT
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.gemmes_achats (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  pack_id    TEXT NOT NULL REFERENCES public.packs_gemmes (id),
  -- Ce qui a été promis au moment de la demande.
  gemmes     INTEGER NOT NULL CHECK (gemmes > 0),
  prix_euros NUMERIC(7, 2) NOT NULL CHECK (prix_euros > 0),
  statut     TEXT NOT NULL DEFAULT 'attente_paiement'
             CHECK (statut IN ('attente_paiement', 'payee', 'annulee')),
  contact    TEXT CHECK (contact IS NULL OR length(contact) BETWEEN 5 AND 160),
  reference  TEXT CHECK (reference IS NULL OR length(reference) <= 200),
  demande_le TIMESTAMPTZ NOT NULL DEFAULT now(),
  payee_le   TIMESTAMPTZ
);

-- Les demandes à traiter, pour l'admin.
CREATE INDEX IF NOT EXISTS gemmes_achats_attente_idx
  ON public.gemmes_achats (demande_le DESC)
  WHERE statut = 'attente_paiement';
CREATE INDEX IF NOT EXISTS gemmes_achats_user_idx
  ON public.gemmes_achats (user_id, demande_le DESC);

-- -----------------------------------------------------------------------------
-- 3. RLS
-- -----------------------------------------------------------------------------
ALTER TABLE public.packs_gemmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gemmes_achats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "packs_gemmes_lecture" ON public.packs_gemmes;
CREATE POLICY "packs_gemmes_lecture" ON public.packs_gemmes
  FOR SELECT TO anon, authenticated
  USING (publie OR (SELECT public.is_admin()));

-- L'élève relit SES demandes ; l'admin voit tout. Aucune écriture directe.
DROP POLICY IF EXISTS "gemmes_achats_lecture" ON public.gemmes_achats;
CREATE POLICY "gemmes_achats_lecture" ON public.gemmes_achats
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()) OR (SELECT public.is_admin()));

-- -----------------------------------------------------------------------------
-- 4. DEMANDER UN PACK
-- Une seule demande EN ATTENTE par élève et par pack : la redemander la
-- rafraîchit (date, contact) au lieu d'empiler des doublons.
-- Renvoie {"ok": true} ou {"ok": false, "raison": anonyme | inconnu}.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.demander_pack_gemmes(
  p_pack    TEXT,
  p_contact TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user    UUID := auth.uid();
  v_pack    public.packs_gemmes%ROWTYPE;
  v_contact TEXT := NULLIF(btrim(COALESCE(p_contact, '')), '');
  v_id      UUID;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'anonyme');
  END IF;

  SELECT * INTO v_pack FROM public.packs_gemmes WHERE id = p_pack AND publie;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'inconnu');
  END IF;

  IF v_contact IS NOT NULL AND length(v_contact) NOT BETWEEN 5 AND 160 THEN
    v_contact := NULL;
  END IF;

  SELECT id INTO v_id
    FROM public.gemmes_achats
   WHERE user_id = v_user AND pack_id = p_pack AND statut = 'attente_paiement'
   ORDER BY demande_le DESC
   LIMIT 1
   FOR UPDATE;

  IF v_id IS NOT NULL THEN
    UPDATE public.gemmes_achats
       SET demande_le = now(),
           contact    = COALESCE(v_contact, contact),
           gemmes     = v_pack.gemmes,
           prix_euros = v_pack.prix_euros
     WHERE id = v_id;
  ELSE
    INSERT INTO public.gemmes_achats (user_id, pack_id, gemmes, prix_euros, contact)
    VALUES (v_user, p_pack, v_pack.gemmes, v_pack.prix_euros, v_contact);
  END IF;

  RETURN jsonb_build_object('ok', true);
END;
$$;

REVOKE ALL ON FUNCTION public.demander_pack_gemmes(TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.demander_pack_gemmes(TEXT, TEXT) TO authenticated;

-- -----------------------------------------------------------------------------
-- 5. CONFIRMER UN PAIEMENT — admin seulement. Crédite les gemmes notées sur
-- la demande, une seule fois : une demande déjà payée ou annulée renvoie false
-- sans rien créditer.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.accorder_pack_gemmes(
  p_achat     UUID,
  p_reference TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_achat public.gemmes_achats%ROWTYPE;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'accorder_pack_gemmes : réservé aux administrateurs';
  END IF;

  SELECT * INTO v_achat FROM public.gemmes_achats WHERE id = p_achat FOR UPDATE;
  IF NOT FOUND OR v_achat.statut <> 'attente_paiement' THEN
    RETURN false;
  END IF;

  UPDATE public.profiles SET gems = gems + v_achat.gemmes WHERE id = v_achat.user_id;
  UPDATE public.gemmes_achats
     SET statut    = 'payee',
         payee_le  = now(),
         reference = NULLIF(btrim(COALESCE(p_reference, '')), '')
   WHERE id = p_achat;
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.accorder_pack_gemmes(UUID, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.accorder_pack_gemmes(UUID, TEXT) TO authenticated;
