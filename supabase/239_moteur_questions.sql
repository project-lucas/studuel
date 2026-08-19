-- Scolaria - Migration 239 : LE MOTEUR DE SELECTION DE QUESTIONS (Leitner).
--
-- Un seul moteur pour tous les quiz de contenu de l'app (quiz de lecon, jeu
-- « Programme », duel classe, boss, examen blanc, annales, carnet). Jusqu'ici
-- chaque player composait sa liste a sa facon, et la repetition espacee vivait
-- a cote sous une forme reduite (021 : une serie de succes, une DATE de
-- prochaine revision).
--
-- CE QUI CHANGE, ET POURQUOI CHAQUE COLONNE EXISTE.
--
--   box (1..5)          Le niveau de Leitner. La 021 deduisait l'intervalle de
--                       `streak`, ce qui rendait les deux notions impossibles a
--                       distinguer : une serie de 12 succes et une serie de 5
--                       tombaient sur le meme intervalle sans que la table le
--                       dise. `box` plafonne a 5, `streak` (renomme
--                       consecutive_correct dans le code) continue de compter.
--
--   due_at TIMESTAMPTZ  L'echeance a l'HEURE, et non au jour. C'est la raison
--                       n°1 de cette migration : une mauvaise reponse doit
--                       revenir « dans 10 minutes », DANS LA MEME SESSION. Avec
--                       une colonne DATE, « maintenant + 10 min » et
--                       « aujourd'hui » sont la meme valeur : l'item ratait son
--                       rappel court et repartait a J+1. La 021 ne pouvait donc
--                       pas porter de reprise intra-session, quel que soit le
--                       code au-dessus.
--
--   times_seen / times_correct / times_wrong
--                       Le compteur brut. `lapses` disait les erreurs, rien ne
--                       disait les passages : impossible de calculer un taux de
--                       reussite par question, donc impossible de mesurer la
--                       maitrise d'un chapitre autrement qu'au dernier score de
--                       quiz.
--
--   last_seen_at        La fraicheur. Le tirage pondere du bucket C (questions
--                       non echues) en depend : plus une question est ancienne,
--                       plus elle a de poids. Sans cette colonne il faudrait
--                       deduire la fraicheur de due_at, qui melange fraicheur et
--                       niveau de box — une question box 5 vue hier paraitrait
--                       plus ancienne qu'une box 1 vue le mois dernier.
--
--   chapter_id / level  Le perimetre. Le moteur tire PAR CHAPITRE (et par
--                       matiere pour le duel classe) ; sans ces deux colonnes il
--                       faudrait rejoindre quiz_questions -> quizzes -> lessons
--                       -> chapters a chaque tirage, pour une donnee qui ne
--                       bouge jamais. `subject` existait deja (021 le
--                       denormalisait pour la Revanche) et sert de la meme
--                       facon.
--
-- due_date SURVIT, maintenue par un trigger. Elle est la cle de lecture de la
-- file « A revoir » depuis la 021 ; la recalculer depuis due_at dans un trigger
-- coute une ligne et evite d'avoir a reecrire d'un coup tous les lecteurs. Elle
-- devient une valeur DERIVEE — un seul ecrivain, comme profiles.trophies l'est
-- devenu en 238.
--
-- Idempotente. A EXECUTER A LA MAIN dans le SQL Editor, apres la 238.
-- Astuce : selectionne TOUT le fichier (Ctrl+A) avant de lancer.

-- ------------------------------------------------------------- 1. les colonnes

ALTER TABLE public.review_items
  ADD COLUMN IF NOT EXISTS box            SMALLINT    NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS times_seen     INTEGER     NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS times_correct  INTEGER     NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS times_wrong    INTEGER     NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS due_at         TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_seen_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS chapter_id     UUID,
  ADD COLUMN IF NOT EXISTS level          TEXT;

-- Les bornes de Leitner. Ajoutee a part (et toleree si deja la) : la contrainte
-- ne peut pas figurer dans ADD COLUMN IF NOT EXISTS sans etre rejouee en erreur.
DO $$
BEGIN
  ALTER TABLE public.review_items
    ADD CONSTRAINT review_items_box_range CHECK (box BETWEEN 1 AND 5);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ------------------------------------------------------------- 2. la reprise
-- Les items suivis existants gardent leur histoire. La traduction est directe :
--
--   box              = serie de succes + 1, plafonnee a 5 (un item jamais rate
--                      et revu 4 fois est bien au sommet de l'echelle)
--   times_correct    = la serie de succes (on ne sait pas compter les succes
--                      anterieurs a une erreur : la 021 ne les gardait pas)
--   times_wrong      = les erreurs cumulees, elles, etaient comptees
--   due_at           = due_date a minuit UTC — l'echeance au jour pres, ce qui
--                      est exactement ce que la ligne promettait
--
-- La garde `due_at IS NULL` rend le bloc rejouable : un second passage ne
-- reecrase pas des echeances entre-temps recalculees a l'heure.
UPDATE public.review_items
   SET box           = LEAST(5, GREATEST(1, streak + 1)),
       times_correct = streak,
       times_wrong   = lapses,
       times_seen    = streak + lapses,
       due_at        = due_date::timestamptz
 WHERE due_at IS NULL;

-- Desormais obligatoire : toute ligne a une echeance a l'heure.
ALTER TABLE public.review_items
  ALTER COLUMN due_at SET DEFAULT now();

UPDATE public.review_items SET due_at = now() WHERE due_at IS NULL;

DO $$
BEGIN
  ALTER TABLE public.review_items ALTER COLUMN due_at SET NOT NULL;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- ------------------------------------------------------------- 3. le miroir
-- due_date suit due_at, toujours. Un trigger plutot qu'une colonne GENERATED :
-- la colonne existe deja en simple DATE depuis la 021, et Postgres ne sait pas
-- convertir une colonne ordinaire en colonne generee — il faudrait la supprimer
-- et la recreer, donc casser les lecteurs pendant la migration.
CREATE OR REPLACE FUNCTION public.review_items_sync_due_date()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.due_date := (NEW.due_at AT TIME ZONE 'utc')::date;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS review_items_due_date_sync ON public.review_items;
CREATE TRIGGER review_items_due_date_sync
  BEFORE INSERT OR UPDATE OF due_at ON public.review_items
  FOR EACH ROW EXECUTE FUNCTION public.review_items_sync_due_date();

-- ------------------------------------------------------------- 4. les index
-- Le tirage lit « mes questions de CE chapitre » puis trie par echeance. Sans
-- l'index par chapitre, chaque session scannerait tout l'historique de l'eleve.
CREATE INDEX IF NOT EXISTS review_items_due_at_idx
  ON public.review_items (user_id, due_at);

CREATE INDEX IF NOT EXISTS review_items_chapter_idx
  ON public.review_items (user_id, chapter_id)
  WHERE chapter_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS review_items_subject_idx
  ON public.review_items (user_id, subject)
  WHERE subject IS NOT NULL;

-- ------------------------------------------------- 5. le perimetre des chapitres
-- La carte quiz_question -> chapitre, en une lecture. Le moteur en a besoin a
-- deux moments : composer le vivier d'un chapitre (« toutes les questions de ce
-- chapitre ») et etiqueter une ligne de review_items au moment de l'ecrire.
--
-- Une VUE et non une table : la donnee existe deja (quiz_questions -> quizzes
-- -> lessons -> chapters), la dupliquer creerait une seconde source de verite a
-- resynchroniser a chaque import de contenu — l'app a deja paye ce prix.
--
-- security_invoker : la vue applique les RLS de CELUI qui lit, donc le gating
-- premium de quiz_questions (021 : quiz gratuit OU abonne) reste en vigueur.
-- Sans cette option, une vue appartenant au proprietaire du schema servirait le
-- contenu payant a tout le monde.
-- PERIMETRE ASSUME : seules les questions rattachables a un chapitre PAR LEUR
-- LECON y figurent. Un quiz dont `lesson_id` est NULL (les plus anciens, qui
-- portaient leur chapitre en simple texte) n'a pas de chapitre exploitable —
-- c'est deja l'hypothese de lib/mastery.ts, qui les ignore de la meme facon.
CREATE OR REPLACE VIEW public.question_scope
WITH (security_invoker = true) AS
  SELECT
    qq.id          AS question_id,
    q.id           AS quiz_id,
    l.chapter_id   AS chapter_id,
    s.slug         AS subject_slug,
    s.name         AS subject_name,
    c.level        AS level,
    qq.position    AS position
  FROM public.quiz_questions qq
  JOIN public.quizzes  q ON q.id = qq.quiz_id
  JOIN public.lessons  l ON l.id = q.lesson_id
  JOIN public.chapters c ON c.id = l.chapter_id
  JOIN public.subjects s ON s.id = c.subject_id;

GRANT SELECT ON public.question_scope TO authenticated, anon;
