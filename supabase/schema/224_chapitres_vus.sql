-- =============================================================================
-- Studuel — Migration 224 : LES CHAPITRES VUS EN COURS
--
-- LE TROU QU'ELLE BOUCHE. Jusqu'ici, l'app ne connaissait QUE ce que l'élève a
-- fait DANS l'app : un quiz joué, une leçon terminée. Elle ne savait rien de ce
-- que le prof a réellement traité en classe. Conséquence directe, visible sur
-- l'écran « Progrès » de Marcel : un chapitre fait en cours mais jamais révisé
-- dans Studuel s'affichait « jamais ouvert », et la matière tombait à 10 %.
-- L'app accusait l'élève d'un trou qui n'en était pas un, et le pourcentage
-- répondait à une question que personne ne posait (« où en es-tu du programme
-- de l'année ? ») au lieu de la seule qui compte (« est-ce que je maîtrise ce
-- qu'on a fait ? »).
--
-- CE QU'ON STOCKE : une ligne = « le prof a traité ce chapitre ». Rien d'autre.
-- Pas de niveau déclaré, pas d'auto-évaluation, pas de note. La maîtrise reste
-- MESURÉE par l'app (quiz, leçons) — l'élève déclare le périmètre, jamais son
-- niveau. C'est ce qui empêche l'écran de devenir un formulaire d'auto-flatterie.
--
-- L'ABSENCE DE LIGNE VAUT « pas encore vu ». Deux états, donc pas de colonne
-- d'état : un booléen déguisé en table coûterait une valeur à maintenir et un
-- cas « ligne présente mais fausse » à gérer.
--
-- Miroir applicatif : `lib/progression.ts` (la définition unique du pourcentage
-- d'une matière, partagée par Marcel ET par Réviser), testé.
--
-- PRÉREQUIS : schema.sql (profiles), 008 (chapters). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.chapitres_vus (
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES public.chapters (id) ON DELETE CASCADE,
  vu_le      TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- La clé primaire porte l'unicité ET sert d'index pour « tous les chapitres
  -- vus par cet élève » (user_id est en tête). Aucun index supplémentaire à
  -- créer : ce serait un doublon de la clé.
  PRIMARY KEY (user_id, chapter_id)
);

-- -----------------------------------------------------------------------------
-- RLS — chacun ne voit et n'écrit que ses lignes.
--
-- `auth.uid()` est enveloppé dans un SELECT : sans ça, Postgres réévalue la
-- fonction POUR CHAQUE LIGNE au lieu d'une fois par requête (InitPlan). Sur une
-- table lue à chaque affichage de Réviser, c'est la différence entre un filtre
-- constant et un appel par chapitre. Même correctif que la migration 208.
-- -----------------------------------------------------------------------------
ALTER TABLE public.chapitres_vus ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chapitres_vus_select_own" ON public.chapitres_vus;
CREATE POLICY "chapitres_vus_select_own" ON public.chapitres_vus
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "chapitres_vus_insert_own" ON public.chapitres_vus;
CREATE POLICY "chapitres_vus_insert_own" ON public.chapitres_vus
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "chapitres_vus_delete_own" ON public.chapitres_vus;
CREATE POLICY "chapitres_vus_delete_own" ON public.chapitres_vus
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- Pas de policy UPDATE, et c'est volontaire : une ligne n'a rien à modifier
-- (elle existe ou non). Décocher un chapitre est un DELETE.
