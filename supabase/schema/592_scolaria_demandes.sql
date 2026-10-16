-- =============================================================================
-- 592 — Les demandes de bilan du site Scolaria : `scolaria_demandes`,
--       `scolaria_demande_enregistrer`, `scolaria_demande_statut`
--       (16/10/2026)
--
-- Le site scolaria.fr (statique, Astro) avait des boutons Calendly qui
-- menaient à une page 404 : aucun parent ne pouvait demander de bilan. Lucas
-- a choisi un FORMULAIRE (16/10/2026). Le site n'a pas de serveur : le
-- formulaire appelle directement cette RPC avec la clé anonyme, et les
-- demandes se lisent dans la console admin (Scolaria › Demandes de bilan).
--
--   · `scolaria_demandes` : une ligne par demande — le parent (nom, e-mail,
--     téléphone), l'élève (prénom, classe), le besoin, le message, les
--     créneaux souhaités, la page d'origine, le consentement, le statut
--     (nouvelle → contactée → close) et une note de l'admin.
--   · `scolaria_demande_enregistrer(...)` : la SEULE porte d'écriture
--     (SECURITY DEFINER, ouverte à anon). Elle valide, tronque, et borne la
--     rafale : 3 demandes par e-mail par jour, 60 au total par heure. Elle
--     répond `{ok}` ou `{ok:false, raison}` — le formulaire dit pourquoi.
--   · `scolaria_demande_statut(id, statut, note)` : l'admin seul.
--   · Lecture : l'admin seul (RLS). Ménage des demandes closes après 2 ans.
--
-- PRÉREQUIS : 028 (is_admin). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.scolaria_demandes (
  id            BIGSERIAL PRIMARY KEY,
  cree_le       TIMESTAMPTZ NOT NULL DEFAULT now(),
  parent_nom    TEXT NOT NULL,
  email         TEXT NOT NULL,
  telephone     TEXT,
  eleve_prenom  TEXT,
  classe        TEXT,
  besoin        TEXT,
  message       TEXT,
  creneaux      TEXT,
  source        TEXT,
  consentement  BOOLEAN NOT NULL DEFAULT false,
  statut        TEXT NOT NULL DEFAULT 'nouvelle' CHECK (statut IN ('nouvelle', 'contactee', 'close')),
  note          TEXT,
  traitee_le    TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS scolaria_demandes_cree_le_idx ON public.scolaria_demandes (cree_le DESC);
CREATE INDEX IF NOT EXISTS scolaria_demandes_email_idx ON public.scolaria_demandes (lower(email), cree_le DESC);

ALTER TABLE public.scolaria_demandes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "scolaria_demandes_lecture_admin" ON public.scolaria_demandes;
CREATE POLICY "scolaria_demandes_lecture_admin" ON public.scolaria_demandes
  FOR SELECT TO authenticated
  USING ((SELECT public.is_admin()));

-- Aucune écriture directe (ni insert, ni update, ni delete) : les deux RPC
-- ci-dessous sont les seules portes.
REVOKE INSERT, UPDATE, DELETE ON public.scolaria_demandes FROM anon, authenticated;

-- -----------------------------------------------------------------------------
-- scolaria_demande_enregistrer : la porte du formulaire du site.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.scolaria_demande_enregistrer(
  p_parent_nom   TEXT,
  p_email        TEXT,
  p_telephone    TEXT DEFAULT NULL,
  p_eleve_prenom TEXT DEFAULT NULL,
  p_classe       TEXT DEFAULT NULL,
  p_besoin       TEXT DEFAULT NULL,
  p_message      TEXT DEFAULT NULL,
  p_creneaux     TEXT DEFAULT NULL,
  p_source       TEXT DEFAULT NULL,
  p_consentement BOOLEAN DEFAULT false
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_nom   TEXT := left(btrim(coalesce(p_parent_nom, '')), 120);
  v_email TEXT := lower(left(btrim(coalesce(p_email, '')), 200));
  v_tel   TEXT := nullif(btrim(left(regexp_replace(coalesce(p_telephone, ''), '[^0-9+ ().-]', '', 'g'), 30)), '');
  v_n     INTEGER;
BEGIN
  IF length(v_nom) < 2 THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'nom');
  END IF;
  IF v_email !~ '^[^@\s]+@[^@\s]+\.[a-z]{2,}$' THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'email');
  END IF;
  IF coalesce(p_consentement, false) IS NOT TRUE THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'consentement');
  END IF;

  -- La rafale : 3 demandes par e-mail par jour, 60 en tout par heure.
  SELECT count(*) INTO v_n FROM public.scolaria_demandes
   WHERE lower(email) = v_email AND cree_le > now() - interval '1 day';
  IF v_n >= 3 THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'deja');
  END IF;
  SELECT count(*) INTO v_n FROM public.scolaria_demandes
   WHERE cree_le > now() - interval '1 hour';
  IF v_n >= 60 THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'rafale');
  END IF;

  INSERT INTO public.scolaria_demandes
    (parent_nom, email, telephone, eleve_prenom, classe, besoin, message, creneaux, source, consentement)
  VALUES (
    v_nom,
    v_email,
    v_tel,
    nullif(left(btrim(coalesce(p_eleve_prenom, '')), 60), ''),
    nullif(left(btrim(coalesce(p_classe, '')), 40), ''),
    nullif(left(btrim(coalesce(p_besoin, '')), 120), ''),
    nullif(left(btrim(coalesce(p_message, '')), 2000), ''),
    nullif(left(btrim(coalesce(p_creneaux, '')), 300), ''),
    nullif(left(btrim(coalesce(p_source, '')), 200), ''),
    true
  );

  -- Le ménage, une fois sur deux cents : les demandes closes partent après 2 ans.
  IF random() < 0.005 THEN
    DELETE FROM public.scolaria_demandes WHERE statut = 'close' AND cree_le < now() - interval '2 years';
  END IF;

  RETURN jsonb_build_object('ok', true);
END;
$$;

REVOKE ALL ON FUNCTION public.scolaria_demande_enregistrer(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.scolaria_demande_enregistrer(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN) TO anon, authenticated;

-- -----------------------------------------------------------------------------
-- scolaria_demande_statut : l'admin fait avancer une demande et y note un mot.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.scolaria_demande_statut(
  p_id     BIGINT,
  p_statut TEXT,
  p_note   TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RETURN false;
  END IF;
  IF p_statut IS NULL OR p_statut NOT IN ('nouvelle', 'contactee', 'close') THEN
    RETURN false;
  END IF;
  UPDATE public.scolaria_demandes
     SET statut = p_statut,
         note = CASE WHEN p_note IS NULL THEN note ELSE nullif(left(btrim(p_note), 1000), '') END,
         traitee_le = CASE WHEN p_statut = 'nouvelle' THEN NULL ELSE coalesce(traitee_le, now()) END
   WHERE id = p_id;
  RETURN FOUND;
END;
$$;

REVOKE ALL ON FUNCTION public.scolaria_demande_statut(BIGINT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.scolaria_demande_statut(BIGINT, TEXT, TEXT) TO authenticated;
