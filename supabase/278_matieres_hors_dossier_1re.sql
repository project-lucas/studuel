-- =============================================================================
-- Studuel — Migration 278 : SIX MATIÈRES SORTENT DES DOSSIERS DE PREMIÈRE
--
-- LA DÉCISION (Lucas, 21/08/2026). Les dossiers de 1re ne montrent plus que les
-- matières dont l'app tient réellement le programme. Six d'entre elles n'ont
-- jamais eu que les 3 fiches passe-partout du seed lycée (migrations 216 → 220),
-- identiques du collège à la Terminale : arts plastiques, musique, EPS, latin,
-- grec, LLCER anglais. Elles quittent la classe de PREMIÈRE GÉNÉRALE et gardent
-- tous leurs autres niveaux.
--
-- CE QUI RESTE INTACT : le collège (arts plastiques et musique de la 6e à la 3e,
-- latin de la 5e à la 3e, grec en 3e, EPS partout), le primaire, la 2de, la
-- Terminale — et la PREMIÈRE TECHNOLOGIQUE, voir plus bas. Aucune de ces
-- matières n'est supprimée du catalogue : seule la ligne « 1re » de leur tableau
-- `levels` s'en va.
--
-- ⚠️ LA VOIE TECHNOLOGIQUE GARDE L'EPS, LES ARTS ET LA MUSIQUE. Une 1re techno
-- n'a pas les spécialités de la voie générale : son programme dans l'app est
-- fait du seul tronc commun. Lui retirer ces trois matières la ferait tomber
-- sous les dix matières qu'une classe doit proposer (garde
-- `lib/subject-catalogue.test.ts`) — un dossier de classe à moitié vide, pour
-- corriger un défaut qui n'était pas le sien. Leurs 3 fiches de niveau « 1re »
-- restent donc EN BASE : le contenu de la voie techno n'est pas dupliqué, il se
-- lit au niveau général (`contentLevelFor`, lib/grades). C'est aussi la raison
-- pour laquelle ce ménage ne supprime QUE les fiches du latin, du grec et de
-- LLCER anglais, que plus personne ne peut atteindre.
--
-- ⚠️ CE QUE CETTE MIGRATION ASSUME, ET QUI EST FAUX DANS LES TEXTES.
--   · L'EPS est un enseignement OBLIGATOIRE de tronc commun en 1re (2 h par
--     semaine, programme du BO du 22 janvier 2019). La retirer du dossier de
--     révision ne la retire pas de l'emploi du temps de l'élève : c'est un choix
--     de PRODUIT (on ne révise pas l'EPS), pas une correction de programme. La
--     garde `lib/subject-catalogue.test.ts`, qui exigeait l'EPS dans CHAQUE
--     classe depuis l'incident « je clique sur 6e, il n'y a pas sport », porte
--     désormais l'exception correspondante — écrite noir sur blanc pour que
--     personne ne la relise comme un oubli.
--   · LLCER anglais est un enseignement de SPÉCIALITÉ de première (4 h), au même
--     titre que HLP ou NSI, avec ses deux thématiques « Imaginaires » et
--     « Rencontres » (BO spécial n° 1 du 22 janvier 2019). Un élève de 1re qui
--     l'a choisie perd son dossier. Le contenu de Terminale reste en place.
--   · Arts plastiques, musique, latin et grec sont des enseignements OPTIONNELS
--     de première (3 h). C'est le seul groupe pour lequel « hors dossier » et
--     « hors programme » se ressemblent : ils ne concernent qu'une partie des
--     élèves, et l'app ne sait rien leur montrer.
-- Le jour où l'une de ces matières reçoit son programme, il suffit de remettre
-- « 1re » dans `levels` — et, pour les trois dernières, de rejouer leur seed.
--
-- ⚠️ PRÉREQUIS DUR : LA MIGRATION 241 D'ABORD. Elle réécrit ENTIÈREMENT le
-- tableau `levels` de l'EPS, des arts plastiques et de la musique pour y ajouter
-- le primaire et la voie technologique. Exécutée APRÈS celle-ci, elle
-- ramènerait les trois matières en 1re sans que rien ne le signale. Le bloc de
-- garde ci-dessous refuse donc de tourner tant que la 241 n'est pas passée, et
-- les tableaux écrits plus bas sont ceux d'APRÈS la 241, moins la « 1re ».
--
-- ⚠️ LES SEEDS DE CONTENU SONT REJOUABLES : recoller 219 ou 220 ferait revenir
-- les 3 fiches du latin, du grec et de LLCER anglais au niveau 1re. Elles
-- seraient alors invisibles (la matière ne déclare plus ce niveau) mais
-- présentes ; il suffirait de rejouer cette migration pour les reprendre.
--
-- Idempotent : les UPDATE écrivent un tableau ABSOLU (les rejouer ne dérive
-- pas), et les DELETE sont bornés à trois slugs au seul niveau 1re (rejoués, ils
-- ne trouvent plus rien).
--
-- PRÉREQUIS : 008 (subjects/chapters/lessons), 021 (review_items), 241 (les
-- classes du primaire et de la voie technologique).
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 0. La garde : la 241 doit être passée
--    Repère : le primaire dans les niveaux de l'histoire-géo, que seule la 241
--    y met. Sans elle, les tableaux écrits plus bas ajouteraient le primaire à
--    l'EPS, aux arts plastiques et à la musique AVANT que la 241 n'ait installé
--    le reste — ou, pire, la 241 rejouée après remettrait ces trois matières en
--    première.
-- -----------------------------------------------------------------------------
DO $garde$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.subjects
     WHERE slug = 'histoire-geo' AND 'CP' = ANY(levels)
  ) THEN
    RAISE EXCEPTION
      'Migration 278 : exécuter D''ABORD la 241 (classes du primaire et voie techno). Sans elle, cette migration écrirait des niveaux que la 241 réécrirait ensuite, et les six matières reviendraient en 1re.';
  END IF;
END $garde$;

-- -----------------------------------------------------------------------------
-- 1. Les six matières quittent la première générale
--    Tableaux ABSOLUS = état d'après la 241, moins « 1re ».
--    Écrits matière par matière, avec un WHERE sur le slug : c'est la seule
--    forme que sait relire la garde `lib/subject-catalogue.test.ts`, qui rejoue
--    ces migrations pour vérifier le catalogue final. Un `array_remove` serait
--    plus court et INVISIBLE pour elle — le test continuerait de croire que ces
--    matières sont en 1re.
-- -----------------------------------------------------------------------------

-- EPS : du CP à la Terminale, la 1re générale exceptée. Enseignement obligatoire
-- au programme, mais sans fiche à réviser (cf. l'avertissement de l'en-tête).
UPDATE public.subjects
   SET levels = '{CP,CE1,CE2,CM1,CM2,6e,5e,4e,3e,2de,"1re techno",Tle,"Tle techno"}'
 WHERE slug = 'sport';

-- Arts plastiques et éducation musicale : obligatoires jusqu'au collège,
-- optionnels au lycée. Elles restent proposées partout, sauf en 1re générale.
UPDATE public.subjects
   SET levels = '{CP,CE1,CE2,CM1,CM2,6e,5e,4e,3e,2de,"1re techno",Tle,"Tle techno"}'
 WHERE slug IN ('arts-plastiques', 'musique');

-- Langues et cultures de l'Antiquité : le latin s'ouvre en 5e, le grec en 3e.
-- La 241 ne les touche pas (elles n'existent pas dans la voie technologique) :
-- leur tableau est celui de la 193, moins la première.
UPDATE public.subjects SET levels = '{5e,4e,3e,2de,Tle}' WHERE slug = 'latin';
UPDATE public.subjects SET levels = '{3e,2de,Tle}'       WHERE slug = 'grec';

-- LLCER anglais : spécialité du cycle terminal. Son dossier de Terminale (3
-- fiches, migration 219) reste en place ; celui de première s'en va.
UPDATE public.subjects SET levels = '{Tle}' WHERE slug = 'llcer-anglais';

-- -----------------------------------------------------------------------------
-- 2. Les fiches devenues inatteignables partent
--    Latin, grec et LLCER anglais ne sont plus déclarés sur AUCUNE première :
--    leurs 9 chapitres de niveau « 1re » resteraient invisibles dans Réviser
--    mais accessibles par URL directe, et leurs 72 questions resteraient
--    tirables par le moteur de questions — qui joint sur `quizzes.subject` +
--    `grade_level`, pas sur le catalogue.
--    L'EPS, les arts plastiques et la musique GARDENT les leurs : la 1re techno
--    les déclare encore, et son contenu se lit au niveau « 1re ».
--
--    L'ordre compte, et c'est toujours le même : la file « À revoir » d'abord
--    (review_items.item_id n'a PAS de clé étrangère — rien ne casserait, mais le
--    compteur « X à revoir » continuerait de compter des questions disparues),
--    puis les quiz (quizzes.lesson_id est ON DELETE SET NULL : ils survivraient
--    orphelins de leur leçon et resteraient tirables), puis les chapitres, dont
--    les leçons partent en cascade.
--
--    Aucun filtre sur le titre ni sur `theme` : au niveau 1re, ces trois
--    matières n'ont QUE ces fiches. Le filtre `level = '1re'` est le seul garde-
--    fou nécessaire — et il est indispensable : sans lui, ce ménage viderait le
--    collège, la 2de et la Terminale.
-- -----------------------------------------------------------------------------
DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug IN ('latin', 'grec', 'llcer-anglais')
   AND c.level = '1re';

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug IN ('latin', 'grec', 'llcer-anglais')
   AND c.level = '1re';

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug IN ('latin', 'grec', 'llcer-anglais')
   AND c.level = '1re';

-- -----------------------------------------------------------------------------
-- 3. Sonde finale : la 1re générale ne propose plus aucune des six, la 1re
--    techno garde son tronc commun, et le collège n'a rien perdu.
-- -----------------------------------------------------------------------------
DO $sonde$
DECLARE
  n_1re      integer;
  n_techno   integer;
  n_college  integer;
  n_fiches   integer;
BEGIN
  SELECT count(*) INTO n_1re
    FROM public.subjects
   WHERE slug IN ('sport', 'arts-plastiques', 'musique', 'latin', 'grec', 'llcer-anglais')
     AND '1re' = ANY(levels);
  IF n_1re > 0 THEN
    RAISE EXCEPTION 'Migration 278 : % matiere(s) declarent encore la premiere generale.', n_1re;
  END IF;

  SELECT count(*) INTO n_techno
    FROM public.subjects
   WHERE slug IN ('sport', 'arts-plastiques', 'musique')
     AND '1re techno' = ANY(levels);
  IF n_techno <> 3 THEN
    RAISE EXCEPTION 'Migration 278 : la 1re techno a perdu son tronc commun (% sur 3).', n_techno;
  END IF;

  -- Le collège garde les cinq qui l'y concernent (LLCER anglais n'est pas une
  -- matière de collège ; le grec n'y est qu'en 3e, ce que ce compte vérifie).
  SELECT count(*) INTO n_college
    FROM public.subjects
   WHERE slug IN ('sport', 'arts-plastiques', 'musique', 'latin', 'grec')
     AND '3e' = ANY(levels);
  IF n_college <> 5 THEN
    RAISE EXCEPTION 'Migration 278 : le college a perdu des matieres (% sur 5 en 3e).', n_college;
  END IF;

  SELECT count(*) INTO n_fiches
    FROM public.chapters c
    JOIN public.subjects s ON s.id = c.subject_id
   WHERE s.slug IN ('latin', 'grec', 'llcer-anglais')
     AND c.level = '1re';
  IF n_fiches > 0 THEN
    RAISE EXCEPTION 'Migration 278 : % fiche(s) de premiere subsistent.', n_fiches;
  END IF;

  RAISE NOTICE 'Migration 278 OK — six matieres hors des dossiers de 1re generale, techno et college intacts.';
END $sonde$;
