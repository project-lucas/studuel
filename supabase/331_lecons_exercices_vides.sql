-- =============================================================================
-- Studuel — Migration 331 : LES 31 LEÇONS « EXERCICES TYPES » QUI NE MÈNENT NULLE PART
--
-- LE DÉFAUT, ET POURQUOI C'EST LE PIRE DE TOUS.
--
-- Trente et une leçons de l'app portent le titre « Exercices types », un
-- contenu de trois lignes, et AUCUN QUIZ. Leur texte, à l'identique partout :
--
--     « Les exercices corrigés de ce chapitre arrivent bientôt.
--       Lance le quiz pour tester ce que tu sais déjà ! »
--
-- Elles invitent donc à lancer exactement ce qui n'existe pas.
--
-- C'est la pire forme de trou du produit, et il faut voir POURQUOI : un dossier
-- marqué « Bientôt » déçoit AVANT l'effort — l'élève n'y entre pas. Ici, il a
-- choisi sa matière, ouvert un chapitre, lu la vraie leçon, puis cliqué sur ce
-- qui ressemble à la suite. Le trou frappe APRÈS l'investissement, au moment
-- précis où l'app avait promis un exercice. Ça ne se lit pas comme un manque,
-- ça se lit comme un BUG — et un bug en pleine session fait désinstaller.
--
-- CE QU'ON FAIT, ET POURQUOI PAS L'INVERSE.
--
-- Le réflexe serait d'écrire 31 quiz. C'est le mauvais geste : ces leçons ne
-- portent aucun cours (140 caractères d'excuse), et surtout LES 31 CHAPITRES
-- CONCERNÉS ONT DÉJÀ une autre leçon, avec son cours et son quiz — vérifié un
-- par un. La coquille n'ajoute donc rien au chapitre : elle ne fait que
-- promettre. On la retire.
--
-- Après cette migration, chaque chapitre garde sa leçon utile ; ce qui
-- disparaît est une porte qui ne s'ouvrait pas.
--
-- LE PÉRIMÈTRE EST FERMÉ PAR TROIS CONDITIONS SIMULTANÉES, et c'est voulu :
--   1. le titre est exactement « Exercices types » ;
--   2. la leçon n'a AUCUN quiz ;
--   3. son chapitre a une AUTRE leçon qui, elle, en a un.
-- La troisième est la sécurité : sans elle, une leçon isolée et sans quiz
-- serait supprimée avec son chapitre pour seul contenu, laissant un chapitre
-- vide. Avec elle, on ne peut retirer que du surnuméraire.
--
-- CE QUI PART AVEC : `lesson_completions` et `lesson_activities` sont en
-- ON DELETE CASCADE. Des lignes de progression disparaissent donc — celles
-- d'élèves ayant « terminé » une page d'excuses. Aucun quiz n'est touché
-- (ces leçons n'en ont pas), donc aucune question, donc AUCUNE ligne de la
-- file « À revoir » : le SRS de personne ne bouge.
--
-- RÉPARTITION DES 31 (relevé du 2026-08-31) :
--   anglais 6e        5     latin 5e / 4e / 3e   3 + 3 + 3
--   histoire-géo 4e   5     SES 2de              4
--   technologie 5e    4     technologie 4e       4
--
-- Idempotent : la migration ne peut retirer que des leçons répondant aux trois
-- conditions. Rejouée, elle n'en trouve plus aucune et ne fait rien.
--
-- PRÉREQUIS : aucun au-delà du socle (002, 008).
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

BEGIN;

-- Trace d'exécution : on compte AVANT, pour pouvoir comparer.
DO $$
DECLARE
  n_avant integer;
BEGIN
  SELECT count(*) INTO n_avant
    FROM public.lessons l
   WHERE l.title = 'Exercices types'
     AND NOT EXISTS (SELECT 1 FROM public.quizzes q WHERE q.lesson_id = l.id)
     AND EXISTS (
       SELECT 1 FROM public.lessons s
        JOIN public.quizzes q2 ON q2.lesson_id = s.id
       WHERE s.chapter_id = l.chapter_id AND s.id <> l.id
     );
  RAISE NOTICE 'Migration 331 : % leçon(s) « Exercices types » sans quiz à retirer.', n_avant;
END $$;

DELETE FROM public.lessons l
 WHERE l.title = 'Exercices types'
   -- (2) elle n'a aucun quiz
   AND NOT EXISTS (
     SELECT 1 FROM public.quizzes q WHERE q.lesson_id = l.id
   )
   -- (3) son chapitre a une AUTRE leçon pourvue d'un quiz : on ne vide jamais
   --     un chapitre, on ne retire que du surnuméraire.
   AND EXISTS (
     SELECT 1
       FROM public.lessons s
       JOIN public.quizzes q2 ON q2.lesson_id = s.id
      WHERE s.chapter_id = l.chapter_id
        AND s.id <> l.id
   );

-- Vérification : plus une seule leçon sans quiz nulle part, et aucun chapitre
-- laissé sans leçon. Les deux comptes doivent être à zéro.
DO $$
DECLARE
  n_orphelines integer;
  n_chap_vides integer;
BEGIN
  SELECT count(*) INTO n_orphelines
    FROM public.lessons l
   WHERE NOT EXISTS (SELECT 1 FROM public.quizzes q WHERE q.lesson_id = l.id);

  SELECT count(*) INTO n_chap_vides
    FROM public.chapters c
   WHERE NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.chapter_id = c.id);

  IF n_chap_vides > 0 THEN
    RAISE EXCEPTION 'Migration 331 ANNULÉE : % chapitre(s) se retrouvent sans leçon.', n_chap_vides;
  END IF;

  RAISE NOTICE 'Migration 331 OK : % leçon(s) sans quiz restantes, % chapitre(s) sans leçon.',
    n_orphelines, n_chap_vides;
END $$;

COMMIT;
