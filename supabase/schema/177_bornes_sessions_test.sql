-- =============================================================================
-- Studuel — Migration 177 : BORNES EN BASE sur test_sessions / exam_blanc_sessions
--
-- CONTEXTE (audit du parcours quiz, 2026-07-20) :
--   La migration 165 a durci `challenge_sessions` avec un CHECK par ligne,
--   parce que sa policy INSERT ne vérifie QUE `user_id` : un client
--   authentifié peut écrire en direct (même clé anon, même JWT) sans passer
--   par la Server Action. Le même motif existait encore sur `test_sessions`,
--   qui n'a JAMAIS eu de CHECK depuis sa création (003) :
--
--     supabase.from('test_sessions').insert({ user_id, score: 999999, total: 1 })
--
--   passait la RLS sans broncher. Or `score` alimente `computeXp()`
--   (`score * 10 + 20`, SANS plafond) → niveau et titre affichés partout
--   (bandeau du haut, /reviser, /defi/jouer), moyenne hebdo et badge
--   « sans faute » de /moi. Le plafond de volume 017 (100 lignes/jour) borne
--   le NOMBRE de lignes, pas la magnitude de chacune.
--
--   Les bornes ci-dessous sont le MIROIR EXACT des clamps déjà appliqués côté
--   serveur : total ≤ 50 pour un quiz (`recordTestSession`), total ≤ 40 pour
--   un examen blanc (`finishExamBlanc`). Elles ne changent donc RIEN au
--   comportement normal de l'app — elles ferment l'écriture directe.
--
-- `NOT VALID` : seules les NOUVELLES lignes sont contraintes, l'existant n'est
-- pas re-scanné (même choix qu'en 165 — une ligne aberrante déjà écrite ne
-- doit pas bloquer la migration).
--
-- PRÉREQUIS : 003_test_sessions.sql et 022_examen_blanc.sql exécutées.
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- Idempotent : réexécutable sans erreur.
-- =============================================================================

-- ------------------------------------------------------ test_sessions : CHECK
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'test_sessions_bounds_check'
      AND conrelid = 'public.test_sessions'::regclass
  ) THEN
    ALTER TABLE public.test_sessions
      ADD CONSTRAINT test_sessions_bounds_check
      CHECK (
        score >= 0 AND total >= 0 AND total <= 50 AND score <= total
      ) NOT VALID;
  END IF;
END $$;

-- ----------------------------------------------- exam_blanc_sessions : CHECK
-- 022 posait déjà `score >= 0` et `total >= 0 AND score <= total`, mais aucune
-- borne HAUTE : un INSERT direct pouvait poser total = 2 000 000 000. Impact
-- moindre (cette table n'alimente pas l'XP — `finishExamBlanc` écrit l'XP dans
-- `test_sessions`), mais on aligne par cohérence de défense en profondeur.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'exam_blanc_sessions_bounds_check'
      AND conrelid = 'public.exam_blanc_sessions'::regclass
  ) THEN
    ALTER TABLE public.exam_blanc_sessions
      ADD CONSTRAINT exam_blanc_sessions_bounds_check
      CHECK (
        score >= 0 AND total >= 0 AND total <= 40 AND score <= total
      ) NOT VALID;
  END IF;
END $$;

-- =============================================================================
-- NOTE — ce que cette migration NE ferme PAS (chantier gated, décision produit)
--   Le score d'un quiz reste AUTO-DÉCLARÉ : `recordTestSession(quizId, score,
--   total)` fait confiance au client (il ne fait que le borner), et
--   `correct_index` est envoyé au client avant réponse pour la « correction
--   immédiate ». Un élève peut donc encore déclarer 10/10 sur un quiz raté —
--   mais plus 999999/1. Le vrai correctif (grading serveur) entre en conflit
--   avec le design « correction immédiate » et attend l'arbitrage de Lucas.
-- =============================================================================
