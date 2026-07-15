-- =============================================================================
-- Studuel — Migration 089 : purge RÉTROACTIVE des review_items orphelins
--
-- La migration 085 a posé des triggers AFTER DELETE sur quiz_questions/deck_cards
-- qui nettoient review_items à CHAQUE nouvelle suppression de contenu. Mais elle
-- ne rattrape PAS les orphelins déjà présents (contenu supprimé AVANT que 085 ne
-- soit exécutée). Or un item `in_revanche` orphelin reste en TÊTE de la file « À
-- revoir » (in_revanche court-circuite l'échéance dans lib/srs.ts), n'est jamais
-- rejouable (le player fait `continue` si le contenu est introuvable) et bloque
-- DÉFINITIVEMENT le bonus « Revanche vidée » (claim_revanche_bonus refuse tant
-- qu'un in_revanche existe) — en plus de réduire la taille utile des sessions.
--
-- Ce nettoyage ponctuel supprime tous les review_items dont la source n'existe
-- plus. À exécuter APRÈS 085 (les triggers empêchent ensuite toute réapparition).
-- Exécuté dans le SQL Editor (rôle service → bypass RLS) : purge tous les élèves,
-- comme les triggers SECURITY DEFINER de 085.
--
-- PRÉREQUIS : 002 (quiz_questions), 007 (deck_cards), 021 (review_items), 085.
-- Idempotent (réexécutable : ne supprime rien de plus une fois la base saine).
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- Items « question » dont la question source a disparu.
DELETE FROM public.review_items ri
 WHERE ri.item_kind = 'question'
   AND NOT EXISTS (
     SELECT 1 FROM public.quiz_questions q WHERE q.id = ri.item_id
   );

-- Items « card » dont la carte de deck source a disparu.
DELETE FROM public.review_items ri
 WHERE ri.item_kind = 'card'
   AND NOT EXISTS (
     SELECT 1 FROM public.deck_cards c WHERE c.id = ri.item_id
   );
