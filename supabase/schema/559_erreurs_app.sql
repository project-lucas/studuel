-- =============================================================================
-- 559 — La remontée des erreurs : `erreurs_app` et `erreur_signaler`
--       (12/10/2026)
--
-- Jusqu'ici, un plantage en production ne laissait AUCUNE trace relisible :
-- les logs de l'hébergeur vivent une heure, et personne ne les regarde. Pour
-- des milliers d'élèves, il faut un journal : ce qui casse, où, chez combien
-- d'élèves, depuis quand.
--
--   · `erreurs_app` : une ligne par erreur — navigateur (window.onerror,
--     frontière d'erreur de l'app) ou serveur (rendu, route, action). Message,
--     nom, pile, page, `digest` de Next (relie les deux lignes d'un même
--     plantage), contexte, navigateur, et l'élève si connecté.
--   · `erreur_signaler(...)` : la SEULE porte d'écriture (SECURITY DEFINER,
--     ouverte à anon et authenticated : l'onboarding est public). Elle tronque,
--     borne la rafale — 60 lignes par élève par 10 minutes, 2 000 au total par
--     heure — et fait le ménage au passage (30 jours).
--   · Lecture et suppression : l'admin seulement (/admin/erreurs).
--
-- PRÉREQUIS : 028 (is_admin). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.erreurs_app (
  id          BIGSERIAL PRIMARY KEY,
  cree_le     TIMESTAMPTZ NOT NULL DEFAULT now(),
  source      TEXT NOT NULL CHECK (source IN ('navigateur', 'serveur')),
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  message     TEXT NOT NULL,
  nom         TEXT,
  pile        TEXT,
  url         TEXT,
  digest      TEXT,
  contexte    JSONB NOT NULL DEFAULT '{}'::jsonb,
  navigateur  TEXT
);

CREATE INDEX IF NOT EXISTS erreurs_app_cree_le_idx
  ON public.erreurs_app (cree_le DESC);
CREATE INDEX IF NOT EXISTS erreurs_app_user_recent_idx
  ON public.erreurs_app (user_id, cree_le DESC);

ALTER TABLE public.erreurs_app ENABLE ROW LEVEL SECURITY;

-- L'admin lit tout, l'élève rien (ce n'est pas son journal) ; aucune écriture
-- directe : la RPC ci-dessous est la seule porte.
DROP POLICY IF EXISTS "erreurs_app_lecture_admin" ON public.erreurs_app;
CREATE POLICY "erreurs_app_lecture_admin" ON public.erreurs_app
  FOR SELECT TO authenticated
  USING ((SELECT public.is_admin()));

DROP POLICY IF EXISTS "erreurs_app_suppression_admin" ON public.erreurs_app;
CREATE POLICY "erreurs_app_suppression_admin" ON public.erreurs_app
  FOR DELETE TO authenticated
  USING ((SELECT public.is_admin()));

-- -----------------------------------------------------------------------------
-- erreur_signaler : range une ligne, bornée, et refuse la rafale EN SILENCE
-- (un rapporteur qui lève une erreur serait le comble).
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.erreur_signaler(
  p_source     TEXT,
  p_message    TEXT,
  p_nom        TEXT DEFAULT NULL,
  p_pile       TEXT DEFAULT NULL,
  p_url        TEXT DEFAULT NULL,
  p_digest     TEXT DEFAULT NULL,
  p_contexte   JSONB DEFAULT '{}'::jsonb,
  p_navigateur TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := (SELECT auth.uid());
  v_recentes INTEGER;
BEGIN
  IF p_source IS NULL OR p_source NOT IN ('navigateur', 'serveur') THEN RETURN; END IF;
  IF p_message IS NULL OR length(btrim(p_message)) = 0 THEN RETURN; END IF;

  -- La rafale, par élève (ou pour l'ensemble des anonymes) : 60 par 10 min.
  SELECT count(*) INTO v_recentes
    FROM public.erreurs_app
   WHERE cree_le > now() - interval '10 minutes'
     AND user_id IS NOT DISTINCT FROM v_uid;
  IF v_recentes >= 60 THEN RETURN; END IF;

  -- Et au total : 2 000 par heure, quoi qu'il arrive.
  SELECT count(*) INTO v_recentes
    FROM public.erreurs_app
   WHERE cree_le > now() - interval '1 hour';
  IF v_recentes >= 2000 THEN RETURN; END IF;

  INSERT INTO public.erreurs_app
    (source, user_id, message, nom, pile, url, digest, contexte, navigateur)
  VALUES (
    p_source,
    v_uid,
    left(p_message, 500),
    left(p_nom, 80),
    left(p_pile, 4000),
    left(p_url, 500),
    left(p_digest, 80),
    -- Un contexte trop long n'est pas tronqué (un JSON coupé n'est plus un
    -- JSON) : il est remplacé par un objet vide, le message reste.
    CASE WHEN p_contexte IS NULL OR jsonb_typeof(p_contexte) <> 'object'
           OR length(p_contexte::text) > 2000
         THEN '{}'::jsonb
         ELSE p_contexte END,
    left(p_navigateur, 300)
  );

  -- Le ménage, une fois sur deux cents : le journal garde 30 jours.
  IF random() < 0.005 THEN
    DELETE FROM public.erreurs_app WHERE cree_le < now() - interval '30 days';
  END IF;
EXCEPTION WHEN OTHERS THEN
  -- Un contexte qui n'est pas un JSON valide une fois tronqué, une contrainte :
  -- on se tait, la ligne est perdue, l'app continue.
  RETURN;
END;
$$;

-- Ouverte à anon ET authenticated : l'onboarding (/bienvenue) est public, et
-- ses plantages comptent autant. La rafale est bornée dans la fonction.
REVOKE ALL ON FUNCTION public.erreur_signaler(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.erreur_signaler(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, TEXT) TO anon, authenticated;
