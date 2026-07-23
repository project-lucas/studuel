-- =============================================================================
-- Studuel — Migration 198 : quota quotidien sur les appels IA du carnet
--
-- PROBLÈME. Les deux Server Actions d'IA du carnet
-- (`generateCourseQuestions`, `generateQuestionFeedback`) n'exigeaient QUE
-- d'être connecté. Or l'inscription est en libre-service, et
-- `generateQuestionFeedback` prend un énoncé et une réponse en TEXTE LIBRE,
-- puis renvoie la réponse du modèle au client : c'était un relais LLM ouvert,
-- facturé sur la clé du projet, rejouable en boucle par un simple POST de
-- Server Action (le `disabled` du bouton n'est qu'un garde-fou d'interface).
--
-- CORRECTIF. Un quota QUOTIDIEN par élève et par type d'appel, sur le modèle
-- exact du limiteur des codes amis (migration 169) : une table de compteurs
-- écrite uniquement par une fonction `SECURITY DEFINER`, RLS activée et aucune
-- policy — un client ne peut ni lire ni remettre à zéro son compteur.
--
-- Les plafonds sont larges pour un élève réel (qui génère une poignée de
-- séries par jour) et rendent l'abus sans intérêt :
--   - generation : 15 séries/jour (chacune ≤ 15 questions) ;
--   - feedback   : 40 feedbacks/jour.
--
-- ⚠️ ORDRE. Le code est écrit pour tolérer l'ABSENCE de cette RPC (il laisse
-- alors passer, comme aujourd'hui) : sans ça, déployer avant d'exécuter la
-- migration couperait la génération pour tout le monde. Toute AUTRE erreur de
-- la RPC, elle, ferme la porte. **Tant que cette migration n'est pas exécutée,
-- le trou reste ouvert** — c'est la seule d'aujourd'hui qui coûte de l'argent.
--
-- PRÉREQUIS : 001 (profiles), 186 (carnet). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- Une ligne par (élève, jour, type d'appel). Volume minuscule ; le ménage des
-- vieux jours peut se faire plus tard, il ne gêne personne en attendant.
CREATE TABLE IF NOT EXISTS public.ai_call_attempts (
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  day_bucket DATE NOT NULL,
  kind       TEXT NOT NULL,
  attempts   INT  NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, day_bucket, kind)
);

ALTER TABLE public.ai_call_attempts ENABLE ROW LEVEL SECURITY;
-- Aucune policy, volontairement : seule la fonction definer ci-dessous écrit
-- ici. Avec la RLS active et zéro policy, la clé anon publique ne voit rien.
REVOKE ALL ON public.ai_call_attempts FROM anon, authenticated;

-- Incrémente le compteur du jour et dit si l'appel est encore permis.
-- VOLATILE : le comptage est un effet de bord assumé — un appel refusé compte
-- lui aussi, sinon marteler l'endpoint serait gratuit.
CREATE OR REPLACE FUNCTION public.ai_call_allowed(p_kind TEXT)
RETURNS boolean
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user  UUID := auth.uid();
  v_day   DATE := (now() AT TIME ZONE 'utc')::date;
  v_limit INT;
  v_count INT;
BEGIN
  IF v_user IS NULL THEN RETURN false; END IF;

  -- Le plafond est décidé ICI, jamais fourni par l'appelant : c'est toute la
  -- leçon de la 088 et de la 192 (« jamais un montant venu du client »).
  v_limit := CASE p_kind
               WHEN 'generation' THEN 15
               WHEN 'feedback'   THEN 40
               ELSE 0                    -- type inconnu : rien n'est permis
             END;
  IF v_limit = 0 THEN RETURN false; END IF;

  INSERT INTO public.ai_call_attempts (user_id, day_bucket, kind, attempts)
  VALUES (v_user, v_day, p_kind, 1)
  ON CONFLICT (user_id, day_bucket, kind)
    DO UPDATE SET attempts = ai_call_attempts.attempts + 1
  RETURNING attempts INTO v_count;

  RETURN v_count <= v_limit;
END;
$$;

REVOKE ALL ON FUNCTION public.ai_call_allowed(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ai_call_allowed(TEXT) TO authenticated;
