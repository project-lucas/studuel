-- =============================================================================
-- Studuel — Migration 175 : PLAFOND JOURNALIER d'XP de défi + bornes duels
--
-- CONTEXTE (audit backend Défi, 2026-07-19) :
--   La ligue hebdo (161) et sa promotion/relégation classent les élèves par
--   SUM(challenge_sessions.xp) sur la semaine. Or la policy d'INSERT de
--   challenge_sessions (011) n'autorise QUE la vérif user_id, et l'INSERT direct
--   est ouvert à `authenticated`. La migration 165 a ajouté un CHECK PAR LIGNE
--   (xp <= 1000) — mais RIEN ne borne le VOLUME de lignes. Un client authentifié
--   pouvait donc insérer 500 lignes à 1000 XP en contournant la Server Action
--   recordChallenge → +500 000 XP/semaine → rang #1 garanti et relégation de
--   vrais élèves. Ce n'est pas cosmétique : la ligue est un classement
--   compétitif inter-joueurs.
--
-- CORRECTIF (sans changement de code client → déployable seul) :
--   1. Un trigger BEFORE INSERT plafonne la SOMME d'XP de défi versée par élève
--      et par jour (UTC) à DAILY_CAP (5000). Au-delà, la ligne s'insère quand
--      même (elle compte pour la série/les habitudes) mais avec xp ramené à 0 :
--      le classement ne peut plus être gonflé par le volume. 5000/jour est très
--      au-dessus d'une journée légitime maximale (~3000), donc aucun faux
--      plafonnement en pratique. Le plafond PAR LIGNE de 165 (xp<=1000) reste.
--   2. Bornes serveur sur la longueur de question_ids des duels live (046) et
--      coop (080) : le client cape à 25, mais un appel RPC direct pouvait passer
--      un tableau géant (bloat stockage + payload Realtime). CHECK à 30 (marge).
--
-- Ce fichier NE ferme PAS les deux points connus et déjà planifiés ailleurs :
--   - jeton de match signé pour apply_ranked_match (trophées classés) — chantier
--     séparé documenté dans l'en-tête de 171 ;
--   - vainqueur autoritaire du duel live dans submit_live_rounds (bilan V/D) —
--     à traiter avec la logique de manches, hors de cette passe.
--
-- PRÉREQUIS : 011 (challenge_sessions), 046 (live_duels), 080 (coop_sessions).
-- Idempotent.
-- =============================================================================

-- ---------------------------------------------------------- 1. plafond XP/jour
CREATE OR REPLACE FUNCTION public.cap_challenge_xp_daily()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  DAILY_CAP CONSTANT INTEGER := 5000;  -- plafond d'XP de défi versée par jour UTC
  v_today   DATE := (now() AT TIME ZONE 'utc')::date;
  v_already INTEGER;
  v_room    INTEGER;
BEGIN
  -- Rien à plafonner sur une ligne sans gain.
  IF COALESCE(NEW.xp, 0) <= 0 THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(SUM(cs.xp), 0) INTO v_already
    FROM public.challenge_sessions cs
   WHERE cs.user_id = NEW.user_id
     AND (cs.created_at AT TIME ZONE 'utc')::date = v_today;

  v_room := GREATEST(0, DAILY_CAP - v_already);
  IF NEW.xp > v_room THEN
    NEW.xp := v_room;  -- ramène au reliquat du plafond (peut être 0)
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_cap_challenge_xp_daily ON public.challenge_sessions;
CREATE TRIGGER trg_cap_challenge_xp_daily
  BEFORE INSERT ON public.challenge_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.cap_challenge_xp_daily();

-- ------------------------------------------------- 2. bornes question_ids duels
-- Duels live (046) et coop (080) : longueur de la liste de questions bornée au
-- niveau du stockage, indépendamment de l'appelant (client OU RPC direct).
ALTER TABLE public.live_duels
  DROP CONSTRAINT IF EXISTS live_duels_question_ids_len;
ALTER TABLE public.live_duels
  ADD CONSTRAINT live_duels_question_ids_len
  CHECK (array_length(question_ids, 1) BETWEEN 1 AND 30);

ALTER TABLE public.coop_sessions
  DROP CONSTRAINT IF EXISTS coop_sessions_question_ids_len;
ALTER TABLE public.coop_sessions
  ADD CONSTRAINT coop_sessions_question_ids_len
  CHECK (array_length(question_ids, 1) BETWEEN 1 AND 30);
