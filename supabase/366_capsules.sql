-- =============================================================================
-- 366 — LES CAPSULES : des mini-formations débloquées dans la Boutique et lues
-- dans « Mon carnet » (Lucas, 18/09/2026).
--
-- Une capsule = quatre éléments : un cours court, une fiche récap, un quiz et
-- un outil pratique. Réussir le quiz la termine, et un badge rejoint le profil.
-- Elles se paient en GEMMES ; certaines coûtent volontairement très cher, et la
-- carte bancaire devient alors le raccourci.
--
-- TROIS TABLES :
--   1. capsules          — le catalogue (prix en gemmes, prix carte, thème…) ;
--   2. capsule_elements  — le contenu, un élément par type ;
--   3. capsule_achats    — les achats de chaque élève, avec leur date
--                          d'ouverture (la pastille du bouton « Mon carnet »)
--                          et de fin (le badge).
--
-- LA CARTE BANCAIRE, SANS PASSERELLE DE PAIEMENT. L'app n'encaisse encore
-- aucun euro (même régime que Studuel+, migration 221). « Payer par carte »
-- enregistre donc une demande (achat en `attente_paiement`, avec le contact
-- d'un parent) ; l'admin — puis, demain, le webhook du prestataire — confirme
-- avec `accorder_capsule`, qui rend la capsule active.
--
-- Écritures : AUCUNE par le client. Tout passe par des fonctions SECURITY
-- DEFINER qui vérifient l'élève, le prix (lu en base, jamais reçu du client)
-- et le solde, sous verrou de la ligne `profiles`.
--
-- PRÉREQUIS : schema.sql (profiles), 010 (badges, user_badges), 028
--             (is_admin), 183 et 192 (profiles.gems). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- PUIS : 367 (le contenu des six capsules de lancement).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. LES TABLES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.capsules (
  id           TEXT PRIMARY KEY CHECK (id ~ '^[a-z0-9-]{2,40}$'),
  theme        TEXT NOT NULL
               CHECK (theme IN ('bien-etre', 'methode', 'vie-pratique', 'avenir')),
  titre        TEXT NOT NULL CHECK (length(titre) BETWEEN 2 AND 80),
  accroche     TEXT NOT NULL DEFAULT '',
  emoji        TEXT NOT NULL DEFAULT '✨',
  teinte       TEXT NOT NULL DEFAULT 'violet',
  -- Prix en gemmes (0 = offerte). Réglable ici sans toucher au code.
  prix_gemmes  INTEGER NOT NULL DEFAULT 0 CHECK (prix_gemmes >= 0),
  -- Le raccourci par carte bancaire ; NULL = pas de paiement par carte.
  prix_euros   NUMERIC(6, 2) CHECK (prix_euros IS NULL OR prix_euros > 0),
  duree_min    INTEGER NOT NULL DEFAULT 10 CHECK (duree_min > 0),
  au_programme TEXT[] NOT NULL DEFAULT '{}',
  -- Le nom du badge gagné en terminant la capsule (cf. trigger, § 3).
  badge        TEXT NOT NULL DEFAULT '',
  ordre        INTEGER NOT NULL DEFAULT 0,
  publiee      BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.capsule_elements (
  capsule_id TEXT NOT NULL REFERENCES public.capsules (id) ON DELETE CASCADE,
  type       TEXT NOT NULL CHECK (type IN ('cours', 'fiche', 'quiz', 'outil')),
  titre      TEXT NOT NULL DEFAULT '',
  -- Forme validée côté application (lib/capsules.ts → lireContenu).
  contenu    JSONB NOT NULL,
  PRIMARY KEY (capsule_id, type)
);

CREATE TABLE IF NOT EXISTS public.capsule_achats (
  user_id       UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  capsule_id    TEXT NOT NULL REFERENCES public.capsules (id) ON DELETE CASCADE,
  -- `attente_paiement` : paiement par carte demandé, pas encore confirmé.
  statut        TEXT NOT NULL DEFAULT 'active'
                CHECK (statut IN ('active', 'attente_paiement')),
  moyen         TEXT NOT NULL CHECK (moyen IN ('gemmes', 'carte', 'offerte')),
  gemmes_payees INTEGER NOT NULL DEFAULT 0 CHECK (gemmes_payees >= 0),
  -- De quoi joindre le parent qui paiera par carte (facultatif).
  contact       TEXT CHECK (contact IS NULL OR length(contact) BETWEEN 5 AND 160),
  -- Référence du paiement confirmé (admin aujourd'hui, prestataire demain).
  reference     TEXT CHECK (reference IS NULL OR length(reference) <= 200),
  achetee_le    TIMESTAMPTZ NOT NULL DEFAULT now(),
  ouverte_le    TIMESTAMPTZ,
  terminee_le   TIMESTAMPTZ,
  PRIMARY KEY (user_id, capsule_id)
);

-- Les demandes de paiement à traiter, pour l'admin.
CREATE INDEX IF NOT EXISTS capsule_achats_attente_idx
  ON public.capsule_achats (achetee_le DESC)
  WHERE statut = 'attente_paiement';

-- -----------------------------------------------------------------------------
-- 2. RLS
-- -----------------------------------------------------------------------------
ALTER TABLE public.capsules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capsule_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capsule_achats ENABLE ROW LEVEL SECURITY;

-- Le catalogue est une vitrine : tout le monde le lit, visiteurs compris.
DROP POLICY IF EXISTS "capsules_lecture" ON public.capsules;
CREATE POLICY "capsules_lecture" ON public.capsules
  FOR SELECT TO anon, authenticated
  USING (publiee OR (SELECT public.is_admin()));

-- Le CONTENU ne se lit qu'une fois la capsule à soi (achat actif).
DROP POLICY IF EXISTS "capsule_elements_achetees" ON public.capsule_elements;
CREATE POLICY "capsule_elements_achetees" ON public.capsule_elements
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
        FROM public.capsule_achats a
       WHERE a.capsule_id = capsule_elements.capsule_id
         AND a.user_id = (SELECT auth.uid())
         AND a.statut = 'active'
    )
    OR (SELECT public.is_admin())
  );

-- L'élève relit SES achats ; l'admin voit tout (demandes de paiement).
DROP POLICY IF EXISTS "capsule_achats_lecture" ON public.capsule_achats;
CREATE POLICY "capsule_achats_lecture" ON public.capsule_achats
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()) OR (SELECT public.is_admin()));

-- -----------------------------------------------------------------------------
-- 3. UN BADGE PAR CAPSULE — tenu à jour tout seul
--
-- Chaque capsule publiée a son badge au catalogue `badges` (slug
-- « capsule-<id> », condition { type: 'capsule_done', capsule: <id> }).
-- `award_earned_badges` (200) ignore ce type (ELSE false) : c'est
-- `terminer_capsule`, plus bas, qui l'accorde.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.capsule_synchroniser_badge()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.badges (slug, title, description, icon, condition)
  VALUES (
    'capsule-' || NEW.id,
    COALESCE(NULLIF(NEW.badge, ''), NEW.titre),
    'Termine la capsule « ' || NEW.titre || ' ».',
    NEW.emoji,
    jsonb_build_object('type', 'capsule_done', 'capsule', NEW.id)
  )
  ON CONFLICT (slug) DO UPDATE
    SET title       = EXCLUDED.title,
        description = EXCLUDED.description,
        icon        = EXCLUDED.icon,
        condition   = EXCLUDED.condition;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS capsules_badge ON public.capsules;
CREATE TRIGGER capsules_badge
  AFTER INSERT OR UPDATE OF titre, badge, emoji ON public.capsules
  FOR EACH ROW EXECUTE FUNCTION public.capsule_synchroniser_badge();

-- -----------------------------------------------------------------------------
-- 4. ACHETER EN GEMMES
-- Renvoie {"ok": true, "gemmes": <solde>} ou {"ok": false, "raison": …} avec
-- raison ∈ anonyme | inconnue | deja | pas_assez.
-- Une demande de paiement par carte en attente n'empêche pas de payer en
-- gemmes : la ligne passe alors à `active`.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.acheter_capsule(p_capsule TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := auth.uid();
  v_prix   INTEGER;
  v_gems   INTEGER;
  v_statut TEXT;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'anonyme');
  END IF;

  SELECT prix_gemmes INTO v_prix
    FROM public.capsules
   WHERE id = p_capsule AND publiee;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'inconnue');
  END IF;

  -- Verrou du solde : deux achats simultanés ne dépensent pas deux fois.
  SELECT gems INTO v_gems FROM public.profiles WHERE id = v_user FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'anonyme');
  END IF;

  SELECT statut INTO v_statut
    FROM public.capsule_achats
   WHERE user_id = v_user AND capsule_id = p_capsule;
  IF v_statut = 'active' THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'deja', 'gemmes', v_gems);
  END IF;

  IF COALESCE(v_gems, 0) < v_prix THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'pas_assez', 'gemmes', v_gems);
  END IF;

  INSERT INTO public.capsule_achats
    (user_id, capsule_id, statut, moyen, gemmes_payees, achetee_le)
  VALUES
    (v_user, p_capsule, 'active',
     CASE WHEN v_prix = 0 THEN 'offerte' ELSE 'gemmes' END, v_prix, now())
  ON CONFLICT (user_id, capsule_id) DO UPDATE
    SET statut        = 'active',
        moyen         = EXCLUDED.moyen,
        gemmes_payees = EXCLUDED.gemmes_payees,
        achetee_le    = now();

  UPDATE public.profiles
     SET gems = gems - v_prix
   WHERE id = v_user
  RETURNING gems INTO v_gems;

  RETURN jsonb_build_object('ok', true, 'gemmes', v_gems);
END;
$$;

REVOKE ALL ON FUNCTION public.acheter_capsule(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.acheter_capsule(TEXT) TO authenticated;

-- -----------------------------------------------------------------------------
-- 5. DEMANDER LE PAIEMENT PAR CARTE
-- Enregistre (ou rafraîchit) une demande en attente, avec le contact facultatif
-- d'un parent. raison ∈ anonyme | inconnue | pas_de_carte | deja.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.demander_capsule_carte(
  p_capsule TEXT,
  p_contact TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user    UUID := auth.uid();
  v_euros   NUMERIC;
  v_statut  TEXT;
  v_contact TEXT := NULLIF(btrim(COALESCE(p_contact, '')), '');
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'anonyme');
  END IF;

  SELECT prix_euros INTO v_euros
    FROM public.capsules
   WHERE id = p_capsule AND publiee;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'inconnue');
  END IF;
  IF v_euros IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'pas_de_carte');
  END IF;

  IF v_contact IS NOT NULL AND length(v_contact) NOT BETWEEN 5 AND 160 THEN
    v_contact := NULL;
  END IF;

  SELECT statut INTO v_statut
    FROM public.capsule_achats
   WHERE user_id = v_user AND capsule_id = p_capsule;
  IF v_statut = 'active' THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'deja');
  END IF;

  INSERT INTO public.capsule_achats
    (user_id, capsule_id, statut, moyen, gemmes_payees, contact, achetee_le)
  VALUES
    (v_user, p_capsule, 'attente_paiement', 'carte', 0, v_contact, now())
  ON CONFLICT (user_id, capsule_id) DO UPDATE
    SET contact    = COALESCE(EXCLUDED.contact, public.capsule_achats.contact),
        achetee_le = now()
  WHERE public.capsule_achats.statut = 'attente_paiement';

  RETURN jsonb_build_object('ok', true);
END;
$$;

REVOKE ALL ON FUNCTION public.demander_capsule_carte(TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.demander_capsule_carte(TEXT, TEXT) TO authenticated;

-- -----------------------------------------------------------------------------
-- 6. CONFIRMER UN PAIEMENT PAR CARTE — admin seulement (le webhook du futur
-- prestataire appellera la même chose). Rend la capsule active.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.accorder_capsule(
  p_user_id   UUID,
  p_capsule   TEXT,
  p_reference TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'accorder_capsule : réservé aux administrateurs';
  END IF;

  INSERT INTO public.capsule_achats
    (user_id, capsule_id, statut, moyen, gemmes_payees, reference, achetee_le)
  VALUES
    (p_user_id, p_capsule, 'active', 'carte', 0, NULLIF(btrim(p_reference), ''), now())
  ON CONFLICT (user_id, capsule_id) DO UPDATE
    SET statut     = 'active',
        moyen      = 'carte',
        reference  = COALESCE(EXCLUDED.reference, public.capsule_achats.reference),
        achetee_le = now();
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.accorder_capsule(UUID, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.accorder_capsule(UUID, TEXT, TEXT) TO authenticated;

-- -----------------------------------------------------------------------------
-- 7. OUVRIR — la première ouverture éteint la pastille du carnet.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.ouvrir_capsule(p_capsule TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH maj AS (
    UPDATE public.capsule_achats
       SET ouverte_le = now()
     WHERE user_id = auth.uid()
       AND capsule_id = p_capsule
       AND statut = 'active'
       AND ouverte_le IS NULL
    RETURNING 1
  )
  SELECT EXISTS (SELECT 1 FROM maj);
$$;

REVOKE ALL ON FUNCTION public.ouvrir_capsule(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ouvrir_capsule(TEXT) TO authenticated;

-- -----------------------------------------------------------------------------
-- 8. TERMINER — quiz réussi : la capsule est finie et son badge est accordé.
-- Renvoie {"ok": true, "badge": <titre>, "nouveau": <badge gagné à l'instant>}
-- ou {"ok": false}. Le seuil de réussite est jugé côté application
-- (lib/capsules.ts, SEUIL_QUIZ_REUSSI) : l'enjeu est un badge, pas une monnaie.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.terminer_capsule(p_capsule TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user    UUID := auth.uid();
  v_badge   UUID;
  v_titre   TEXT;
  v_nouveau BOOLEAN := false;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('ok', false);
  END IF;

  UPDATE public.capsule_achats
     SET terminee_le = COALESCE(terminee_le, now()),
         ouverte_le  = COALESCE(ouverte_le, now())
   WHERE user_id = v_user
     AND capsule_id = p_capsule
     AND statut = 'active';
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false);
  END IF;

  SELECT id, title INTO v_badge, v_titre
    FROM public.badges
   WHERE slug = 'capsule-' || p_capsule;

  IF v_badge IS NOT NULL THEN
    INSERT INTO public.user_badges (user_id, badge_id)
    VALUES (v_user, v_badge)
    ON CONFLICT (user_id, badge_id) DO NOTHING;
    v_nouveau := FOUND;
  END IF;

  RETURN jsonb_build_object('ok', true, 'badge', v_titre, 'nouveau', v_nouveau);
END;
$$;

REVOKE ALL ON FUNCTION public.terminer_capsule(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.terminer_capsule(TEXT) TO authenticated;
