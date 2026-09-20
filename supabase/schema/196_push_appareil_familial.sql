-- =============================================================================
-- Studuel — Migration 196 : un appareil, plusieurs élèves (abonnements push)
--
-- Le problème : `push_subscriptions` avait `endpoint` SEUL en clé primaire. Or
-- un endpoint push identifie un NAVIGATEUR, pas une personne. Sur la tablette
-- familiale, le frère ou la sœur qui active les rappels après le premier tombe
-- donc sur la ligne de l'autre : la RLS (« soi uniquement ») refuse l'écriture,
-- l'écran affiche « Impossible d'activer les rappels » et il n'a aucun recours.
--
-- La clé devient (endpoint, user_id) : chacun a sa ligne, l'appareil partagé
-- reçoit les rappels des deux. La suppression d'un abonnement mort (404/410)
-- se fait toujours par endpoint, et efface bien les lignes de tout le monde —
-- c'est correct, l'endpoint est mort pour tous.
--
-- ⚠️ ORDRE : déployer le code AVANT d'exécuter cette migration. La route
-- d'abonnement ne nomme plus aucune clé de conflit (elle fait un UPDATE de sa
-- propre ligne, puis un INSERT si elle n'existe pas), donc elle fonctionne des
-- deux côtés ; mais l'ancienne version, elle, faisait `ON CONFLICT (endpoint)`
-- et casserait dès la clé primaire changée.
--
-- PRÉREQUIS : 045 (push_subscriptions). Idempotent.
-- =============================================================================

ALTER TABLE public.push_subscriptions
  DROP CONSTRAINT IF EXISTS push_subscriptions_pkey;

ALTER TABLE public.push_subscriptions
  ADD CONSTRAINT push_subscriptions_pkey PRIMARY KEY (endpoint, user_id);

-- L'index par user_id de la 045 reste utile : la nouvelle clé primaire commence
-- par `endpoint`, elle ne sert donc pas à filtrer « mes abonnements ».
CREATE INDEX IF NOT EXISTS push_subscriptions_user_idx
  ON public.push_subscriptions (user_id);
