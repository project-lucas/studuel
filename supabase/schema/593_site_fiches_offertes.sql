-- =============================================================================
-- 593 — Les fiches offertes du site Studuel : `site_leads`,
--       `site_lead_enregistrer` (16/10/2026)
--
-- Lucas (16/10/2026), devant le pop-up de Nomad Education (« 5 fiches
-- personnalisées ») : « on va faire mieux : 10 fiches sur la matière de votre
-- choix ». Le visiteur du site (élève, parent, enseignant) choisit sa classe
-- et une matière, laisse son e-mail, et reçoit TOUT DE SUITE, à l'écran, dix
-- vraies fiches PDF de cette matière (liens signés de 7 jours, fabriqués par la
-- route `/api/fiches-offertes` du site avec la clé de service).
--
--   · `site_leads` : une ligne par demande — e-mail, profil, classe, matière,
--     accord pour recevoir des nouvelles (case séparée, jamais pré-cochée),
--     page d'origine.
--   · `site_lead_enregistrer(...)` : la SEULE porte d'écriture (SECURITY
--     DEFINER, anon). Valide, et borne : 5 demandes par e-mail par jour, 400
--     au total par heure. Répond `{ok}` ou `{ok:false, raison}`.
--   · Lecture : l'admin seul (RLS), dans la console.
--
-- PRÉREQUIS : 028 (is_admin). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.site_leads (
  id            BIGSERIAL PRIMARY KEY,
  cree_le       TIMESTAMPTZ NOT NULL DEFAULT now(),
  email         TEXT NOT NULL,
  profil        TEXT NOT NULL CHECK (profil IN ('eleve', 'parent', 'enseignant', 'autre')),
  classe        TEXT NOT NULL,
  matiere       TEXT NOT NULL,
  nouvelles     BOOLEAN NOT NULL DEFAULT false,
  source        TEXT
);

CREATE INDEX IF NOT EXISTS site_leads_cree_le_idx ON public.site_leads (cree_le DESC);
CREATE INDEX IF NOT EXISTS site_leads_email_idx ON public.site_leads (lower(email), cree_le DESC);

ALTER TABLE public.site_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "site_leads_lecture_admin" ON public.site_leads;
CREATE POLICY "site_leads_lecture_admin" ON public.site_leads
  FOR SELECT TO authenticated
  USING ((SELECT public.is_admin()));

REVOKE INSERT, UPDATE, DELETE ON public.site_leads FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.site_lead_enregistrer(
  p_email     TEXT,
  p_profil    TEXT,
  p_classe    TEXT,
  p_matiere   TEXT,
  p_nouvelles BOOLEAN DEFAULT false,
  p_source    TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email TEXT := lower(left(btrim(coalesce(p_email, '')), 200));
  v_n     INTEGER;
BEGIN
  IF v_email !~ '^[^@\s]+@[^@\s]+\.[a-z]{2,}$' THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'email');
  END IF;
  IF p_profil IS NULL OR p_profil NOT IN ('eleve', 'parent', 'enseignant', 'autre') THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'profil');
  END IF;
  IF p_classe IS NULL OR p_classe NOT IN ('6e', '5e', '4e', '3e', '2de', '1re', 'Tle') THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'classe');
  END IF;
  IF p_matiere IS NULL OR p_matiere !~ '^[a-z0-9-]{2,60}$' THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'matiere');
  END IF;

  SELECT count(*) INTO v_n FROM public.site_leads
   WHERE lower(email) = v_email AND cree_le > now() - interval '1 day';
  IF v_n >= 5 THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'deja');
  END IF;
  SELECT count(*) INTO v_n FROM public.site_leads WHERE cree_le > now() - interval '1 hour';
  IF v_n >= 400 THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'rafale');
  END IF;

  INSERT INTO public.site_leads (email, profil, classe, matiere, nouvelles, source)
  VALUES (v_email, p_profil, p_classe, p_matiere, coalesce(p_nouvelles, false), nullif(left(btrim(coalesce(p_source, '')), 200), ''));

  RETURN jsonb_build_object('ok', true);
END;
$$;

REVOKE ALL ON FUNCTION public.site_lead_enregistrer(TEXT, TEXT, TEXT, TEXT, BOOLEAN, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.site_lead_enregistrer(TEXT, TEXT, TEXT, TEXT, BOOLEAN, TEXT) TO anon, authenticated;
