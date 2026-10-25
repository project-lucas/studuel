-- =============================================================================
-- 601 — La découverte progressive (25/10/2026, cadrage « le jeu vivant », § E)
--
-- Le jeu que Lucas a montré ouvre ses fonctionnalités UNE PAR UNE : chaque
-- niveau débloque un onglet, l'annonce et l'explique. Ici, la mémoire de ce
-- que l'élève a DÉJÀ découvert, et le marqueur qui décide si la découverte
-- progressive s'applique à lui.
--
--   · `decouvertes` : une ligne par (élève, clé du catalogue) — la clé est
--     celle de `lib/decouverte/catalogue.ts` (DECOUVERTES) ; `vu_at` dit quand
--     le mini-tour de cette fonctionnalité a été joué. Lecture par l'élève
--     seul ; ÉCRITURE par `decouverte_marquer` seulement (aucun INSERT direct).
--   · `profiles.decouverte_depuis` : posé à now() PAR DÉFAUT pour les profils
--     créés après cette migration ; les comptes EXISTANTS reçoivent NULL dans
--     la même migration — rien de rétroactif ni de punitif : ils voient tout,
--     quel que soit leur niveau (décision 1 du cadrage). NULL = tout ouvert.
--   · `decouverte_marquer(p_cle)` : la SEULE porte d'écriture, élève connecté,
--     bornée aux clés du catalogue (la liste est RECOPIÉE ici — une clé
--     ajoutée au catalogue l'est aussi ici, `lib/decouverte/miroir-601.test.ts`
--     relit ce fichier pour le garantir). Rend 'ok' · 'deja' · 'inconnue' ·
--     'anonyme'.
--   · `mes_decouvertes()` : les clés déjà vues de l'appelant (le bandeau les
--     lit au lancement, dans la même vague que le niveau).
--   · ON DELETE CASCADE : un compte supprimé (596) emporte ses découvertes.
--
-- IDEMPOTENTE : la colonne n'est ajoutée (et les anciens profils remis à NULL)
-- QUE si elle n'existe pas encore ; un second passage ne touche à rien — un
-- profil créé entre deux passages garde son marqueur.
-- PRÉREQUIS : schema.sql (profiles). Rejouée deux fois sur PGlite.
-- À exécuter à la main : Supabase Dashboard → SQL Editor → Run.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. profiles.decouverte_depuis — les nouveaux profils seulement
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = 'profiles'
       AND column_name = 'decouverte_depuis'
  ) THEN
    ALTER TABLE public.profiles
      ADD COLUMN decouverte_depuis TIMESTAMPTZ DEFAULT now();
    -- Les comptes qui existent à cet instant voient tout : le DEFAULT n'a
    -- servi qu'à remplir la colonne, on l'efface pour eux dans la même
    -- transaction. Seuls les profils créés APRÈS porteront une date.
    UPDATE public.profiles SET decouverte_depuis = NULL;
  END IF;
END
$$;

-- -----------------------------------------------------------------------------
-- 2. decouvertes
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.decouvertes (
  user_id UUID        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  cle     TEXT        NOT NULL CHECK (char_length(cle) BETWEEN 1 AND 40),
  vu_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, cle)
);

ALTER TABLE public.decouvertes ENABLE ROW LEVEL SECURITY;

-- L'élève lit les siennes ; personne n'écrit directement (la RPC seule).
DROP POLICY IF EXISTS "decouvertes_lecture_soi" ON public.decouvertes;
CREATE POLICY "decouvertes_lecture_soi" ON public.decouvertes
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

REVOKE ALL ON TABLE public.decouvertes FROM PUBLIC, anon;
GRANT SELECT ON TABLE public.decouvertes TO authenticated;

-- -----------------------------------------------------------------------------
-- 3. decouverte_marquer(p_cle) : 'ok' · 'deja' · 'inconnue' · 'anonyme'
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.decouverte_marquer(p_cle TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := (SELECT auth.uid());
BEGIN
  IF v_uid IS NULL THEN RETURN 'anonyme'; END IF;

  -- LA LISTE DU CATALOGUE (lib/decouverte/catalogue.ts, DECOUVERTES), dans le
  -- même ordre. Une clé ajoutée là-bas s'ajoute ici.
  IF COALESCE(p_cle, '') NOT IN (
    'reviser',
    'courrier',
    'marcel',
    'bibliotheque',
    'defi',
    'amis',
    'tresor',
    'gardiens'
  ) THEN
    RETURN 'inconnue';
  END IF;

  INSERT INTO public.decouvertes (user_id, cle)
  VALUES (v_uid, p_cle)
  ON CONFLICT (user_id, cle) DO NOTHING;

  IF FOUND THEN RETURN 'ok'; END IF;
  RETURN 'deja';
END;
$$;

REVOKE ALL ON FUNCTION public.decouverte_marquer(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.decouverte_marquer(TEXT) TO authenticated;

-- -----------------------------------------------------------------------------
-- 4. mes_decouvertes() : les clés déjà vues de l'appelant
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.mes_decouvertes()
RETURNS TABLE (cle TEXT, vu_at TIMESTAMPTZ)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT d.cle, d.vu_at
    FROM public.decouvertes d
   WHERE d.user_id = (SELECT auth.uid())
   ORDER BY d.vu_at ASC, d.cle ASC;
$$;

REVOKE ALL ON FUNCTION public.mes_decouvertes() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.mes_decouvertes() TO authenticated;
