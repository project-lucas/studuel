-- =============================================================================
-- Studuel — Migration 178 : AUTORISATION REALTIME des duels live et de la coop
--
-- CONTEXTE (audit du temps réel, 2026-07-20) :
--   `useLiveDuel` / `useCoop` ouvrent des canaux Realtime PUBLICS
--   (`duel-<uuid>`, `coop-<uuid>`). Sans `private: true` côté client ET sans
--   policy sur `realtime.messages`, Supabase n'applique AUCUN contrôle d'accès
--   au canal : n'importe qui possédant la clé anon (elle est publique, dans le
--   bundle JS) et le code du duel — un code justement FAIT pour être partagé,
--   affiché en QR et copiable — peut rejoindre le canal SANS jamais passer par
--   `join_live_duel` / `join_coop`, et donc :
--     - espionner en direct les manches des deux joueurs ;
--     - injecter de faux événements `round`/`answer`, fusionnés côté client, et
--       faire afficher une fausse « Victoire ! » / « Défaite » aux vrais joueurs ;
--     - s'inscrire en `presence` pour forcer `waiting → active` avant l'arrivée
--       du véritable adversaire.
--
--   Ce n'est PAS un vecteur économique (vérifié : `submit_live_rounds` /
--   `submit_coop_answers` n'écrivent que les données de l'appelant authentifié,
--   et `recordChallenge` recalcule toujours l'XP côté serveur) — c'est de
--   l'intégrité de partie, de l'espionnage et du sabotage.
--
-- ⚠️ ORDRE D'APPLICATION — l'inverse du réflexe habituel :
--   Cette migration est INERTE tant que le client n'a pas basculé : les policies
--   de `realtime.messages` ne s'appliquent QU'AUX canaux privés, les canaux
--   publics actuels continuent de fonctionner exactement pareil. Elle est donc
--   sûre à exécuter à tout moment.
--   EN REVANCHE, le passage du client en `config: { private: true }`
--   (`components/useLiveDuel.ts`, `components/useCoop.ts`) ne doit être déployé
--   QU'APRÈS l'exécution de cette migration : sans ces policies, un canal privé
--   voit TOUTES ses souscriptions refusées et les duels en direct cessent de
--   fonctionner. Migration d'abord, code ensuite.
--
-- PRÉREQUIS : 046_duels_live.sql et 080_coop.sql exécutées.
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- Idempotent : réexécutable sans erreur.
-- =============================================================================

-- Realtime Authorization s'appuie sur la table `realtime.messages` : une policy
-- SELECT autorise à RECEVOIR sur le topic, une policy INSERT à y ÉMETTRE
-- (broadcast et presence passent tous les deux par là).
-- `realtime.topic()` renvoie le nom du canal demandé par le client.

ALTER TABLE IF EXISTS realtime.messages ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------- duels live (046)
-- Topic `duel-<uuid>` : réservé à l'hôte et à l'invité de CE duel.
DROP POLICY IF EXISTS "duel_live_realtime_read" ON realtime.messages;
CREATE POLICY "duel_live_realtime_read" ON realtime.messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.live_duels d
      WHERE 'duel-' || d.id::text = realtime.topic()
        AND auth.uid() IN (d.host_id, d.guest_id)
    )
  );

DROP POLICY IF EXISTS "duel_live_realtime_write" ON realtime.messages;
CREATE POLICY "duel_live_realtime_write" ON realtime.messages
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.live_duels d
      WHERE 'duel-' || d.id::text = realtime.topic()
        AND auth.uid() IN (d.host_id, d.guest_id)
    )
  );

-- ------------------------------------------------------------- coop (080)
-- Topic `coop-<uuid>` : réservé aux deux équipiers de CETTE session.
DROP POLICY IF EXISTS "coop_realtime_read" ON realtime.messages;
CREATE POLICY "coop_realtime_read" ON realtime.messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.coop_sessions s
      WHERE 'coop-' || s.id::text = realtime.topic()
        AND auth.uid() IN (s.host_id, s.guest_id)
    )
  );

DROP POLICY IF EXISTS "coop_realtime_write" ON realtime.messages;
CREATE POLICY "coop_realtime_write" ON realtime.messages
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.coop_sessions s
      WHERE 'coop-' || s.id::text = realtime.topic()
        AND auth.uid() IN (s.host_id, s.guest_id)
    )
  );

-- =============================================================================
-- APRÈS EXÉCUTION — à faire par l'agent/Lucas, une fois cette migration passée :
--   1. `components/useLiveDuel.ts` : `supabase.channel(channelName(duelId), {
--        config: { private: true, presence: { key: userId } } })`
--   2. `components/useCoop.ts` : idem sur `coopChannelName(sessionId)`.
--   3. QA à deux comptes : un duel en direct doit toujours fonctionner, et un
--      TROISIÈME compte muni du code ne doit plus recevoir aucun événement.
-- Tant que (1) et (2) ne sont pas faits, le trou reste ouvert — les policies
-- ci-dessus ne protègent que des canaux privés.
-- =============================================================================
