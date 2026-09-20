-- =============================================================================
-- Studuel — Migration 236 : LES ANNALES (sujets et épreuves d'examen)
--
-- LE TROU QU'ELLE BOUCHE. Trois classes finissent sur une épreuve nationale :
-- la 3e (brevet), la 1re (épreuves anticipées) et la Terminale (bac). L'app le
-- SAIT déjà — `lib/annales.ts` le dit, et l'onglet « Annales » n'apparaît que
-- pour elles. Mais cet onglet n'avait rien à montrer : aucune table ne portait
-- les épreuves, si bien qu'il affichait un encart « Pas encore de sujet ici ».
-- L'élève de 3e savait donc que le brevet arrivait, sans jamais pouvoir voir à
-- quoi il ressemble : combien de temps, combien de parties, quel barème, quels
-- chapitres tombent où.
--
-- CE QU'ON STOCKE : une ligne = UNE ÉPREUVE D'UNE SESSION. « Brevet 2026 —
-- Mathématiques » est une ligne ; « Bac 2026 — Philosophie » en est une autre.
-- Le découpage interne (les exercices, leur barème, ce qu'ils mobilisent) tient
-- dans `outline`, en JSONB.
--
-- POURQUOI `outline` EN JSONB ET NON UNE TABLE `exam_exercises`. Un exercice
-- n'existe jamais hors de son épreuve : il n'est ni partagé, ni recherché, ni
-- compté à part. Une table dédiée n'apporterait qu'une jointure et une clé
-- étrangère pour restituer, à chaque lecture, exactement le tableau qu'on vient
-- d'éclater. Le JSONB est lu d'un bloc, comme il est écrit.
--
-- POURQUOI LES CHAPITRES SONT CITÉS PAR TITRE dans `outline.chapters` et non
-- par UUID. Un sujet d'examen est écrit une fois pour toutes ; les chapitres,
-- eux, sont réécrits à chaque fois qu'un programme change (la 233 a remplacé
-- les 5 chapitres de SVT par 22, la 235 les 4 axes d'anglais par 6). Des UUID
-- auraient transformé chaque refonte de programme en migration de rattrapage
-- des annales, avec des clés étrangères mortes entre-temps. Le titre, lui, est
-- ce que l'élève lit, et un titre qui ne correspond plus se voit tout de suite
-- — au lieu de disparaître en silence.
--
-- `session` EST DU TEXTE, PAS UN ENTIER : une session s'écrit « 2026 », mais
-- aussi « 2025 · Amérique du Nord » ou « sujet zéro ». La contrainte d'unicité
-- porte donc sur (matière, niveau, session, centre) : deux centres d'examen
-- peuvent avoir deux sujets la même année, ce qui est le cas normal au bac.
--
-- LECTURE AUTHENTIFIÉE, ÉCRITURE PAR PERSONNE. C'est du catalogue, comme
-- `chapters` : tout élève connecté lit toutes les annales, et rien dans cette
-- table n'appartient à quelqu'un. Aucune policy d'écriture n'est créée — le
-- contenu n'arrive que par migration, comme le reste du contenu scolaire.
--
-- PRÉREQUIS : 008 (subjects). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.exam_papers (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id   UUID NOT NULL REFERENCES public.subjects (id) ON DELETE CASCADE,
  level        TEXT NOT NULL,
  -- Reprend les clés de `lib/annales.ts` (ExamYearKey) : une annale appartient
  -- toujours à l'un des trois examens que l'app connaît.
  exam         TEXT NOT NULL CHECK (exam IN ('brevet', 'bac-anticipe', 'bac')),
  session      TEXT NOT NULL,
  -- Centre d'examen. '' (et non NULL) quand l'épreuve n'en dépend pas : NULL
  -- rendrait la contrainte UNIQUE inopérante, deux NULL n'étant jamais égaux
  -- en SQL — on pourrait alors insérer dix fois la même épreuve.
  center       TEXT NOT NULL DEFAULT '',
  title        TEXT NOT NULL,
  duration_min INT  NOT NULL CHECK (duration_min > 0),
  -- NUMERIC et non INT : le brevet 2026 note l'histoire-géographie au
  -- coefficient 1,5 et l'EMC au coefficient 0,5.
  coefficient  NUMERIC(4, 2),
  -- [{ title, points, chapters: [titres], expected }] — le sujet, partie par
  -- partie. Tableau JSON, jamais un objet : l'ordre des exercices EST le sujet.
  outline      JSONB NOT NULL DEFAULT '[]'::jsonb
                 CHECK (jsonb_typeof(outline) = 'array'),
  position     INT  NOT NULL DEFAULT 0,
  UNIQUE (subject_id, level, session, center)
);

COMMENT ON TABLE public.exam_papers IS
  'Annales : une épreuve d''examen d''une session (brevet, épreuves anticipées, bac), décrite exercice par exercice dans `outline`.';
COMMENT ON COLUMN public.exam_papers.outline IS
  'Tableau JSON des parties de l''épreuve : [{ title, points, chapters (titres de chapitres du programme), expected }]. L''ordre du tableau est l''ordre du sujet.';

-- L'onglet Annales ouvre toujours sur UNE matière à UN niveau : c'est cette
-- requête-là, et elle seule, qui doit être indexée.
CREATE INDEX IF NOT EXISTS exam_papers_subject_level_idx
  ON public.exam_papers (subject_id, level);

ALTER TABLE public.exam_papers ENABLE ROW LEVEL SECURITY;

-- Une policy de LECTURE seule, pour les comptes connectés. Pas de policy
-- d'écriture : sans elle, aucun INSERT/UPDATE/DELETE ne passe par la clé
-- anonyme, quelle que soit la requête. C'est voulu — le contenu scolaire
-- n'arrive que par migration.
DROP POLICY IF EXISTS "exam_papers lisibles par les comptes connectés" ON public.exam_papers;
CREATE POLICY "exam_papers lisibles par les comptes connectés"
  ON public.exam_papers FOR SELECT TO authenticated USING (true);

GRANT SELECT ON public.exam_papers TO authenticated;

-- Contrôle : la table répond et reste vide tant que la 237 n'est pas jouée.
DO $$
DECLARE n INT;
BEGIN
  SELECT count(*) INTO n FROM public.exam_papers;
  RAISE NOTICE 'exam_papers : table en place, % épreuve(s) enregistrée(s).', n;
END $$;
