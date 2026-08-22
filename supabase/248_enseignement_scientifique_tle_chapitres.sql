-- =============================================================================
-- Studuel — Migration 248 : L'ENSEIGNEMENT SCIENTIFIQUE DE Tle, RANGÉ SOUS SES
--                           6 CHAPITRES
--
-- LA SUITE DE LA 244. L'anglais (243) puis l'espagnol (244) ont été rendus à
-- leur programme : les chapitres du cours en en-têtes, les fiches dessous.
-- L'enseignement scientifique de Terminale suit, et le travail y est le plus
-- court de la série — la migration 228 avait déjà installé les 16 fiches du
-- programme officiel, DANS L'ORDRE de ses six chapitres (sondé le 19/08/2026,
-- node _ASSOCIE/sonde-chapitres.mjs Tle enseignement-scientifique : positions 1
-- à 16, exactement la suite attendue, et rien d'autre dans le dossier). Il ne
-- manque QUE le chapitre qui coiffe chaque fiche, sans quoi la page aligne 16
-- lignes à plat au lieu d'afficher les six sections du programme.
--
-- CE QUE L'ÉLÈVE DOIT VOIR — les six chapitres du programme, et rien d'autre :
--   1. Science, climat et société : sciences de l'atmosphère et conséquences
--      de la modification anthropique du climat            (4 fiches)
--   2. Le futur des énergies : l'électricité, approche historique et rôle
--      central                                             (4 fiches)
--   3. Le futur des énergies : choix de développement et futur climatique
--                                                          (2 fiches)
--   4. Une histoire du vivant : biodiversité et dynamique des populations
--                                                          (2 fiches)
--   5. Une histoire du vivant : théorie de l'évolution      (2 fiches)
--   6. Une histoire du vivant : impacts des nouvelles technologies sur le
--      vivant                                              (2 fiches)
--
-- POURQUOI SIX ET NON QUATRE. Le BO découpe l'année en THÈMES : « Science,
-- climat et société », « Le futur des énergies », « Une histoire du vivant »,
-- plus le projet expérimental et numérique — qui n'est pas un chapitre de cours
-- mais un travail d'année, sans fiche à réviser. Deux de ces thèmes pèsent
-- quatre et six fiches : les laisser d'un bloc rendrait l'en-tête inutile, un
-- élève qui cherche la lignée humaine devant encore parcourir tout « Une
-- histoire du vivant ». Le découpage retenu est celui des manuels et du cahier
-- de texte — le thème 2 en deux chapitres (l'électricité ; les choix de
-- développement), le thème 3 en trois (biodiversité ; théorie de l'évolution ;
-- technologies et vivant). Il ne déplace AUCUNE fiche : l'ordre du BO est
-- conservé à l'identique, seules les frontières de sections sont posées.
--
-- AUCUNE SUPPRESSION ICI, à la différence des 243, 244, 245 et 246 : les quatre
-- fiches de synthèse héritées du premier jeu de données (« L'atmosphère et le
-- climat », « L'énergie : conversions et enjeux », « Une histoire du vivant »,
-- « L'intelligence artificielle ») sont déjà parties avec la 228, qui les
-- recouvrait entièrement. Le dossier ne contient que les 16 fiches du
-- programme, la sonde le confirme. Cette migration ne fait qu'ÉCRIRE.
--
-- LA COLONNE `chapters.theme` (migration 234) est REPRISE en ADD COLUMN IF NOT
-- EXISTS, comme dans les 243, 244, 245 et 246 : la 234 n'a jamais été exécutée.
-- Le GRANT n'est pas décoratif — la 182 a révoqué le SELECT de table sur
-- `chapters` et ne l'a rendu que colonne par colonne : une colonne ajoutée
-- après elle n'hérite d'aucun droit, et l'app lirait « permission denied » au
-- lieu du chapitre.
--
-- LES POSITIONS SONT RÉÉCRITES UNE À UNE (1 à 16). Elles y sont déjà, l'UPDATE
-- ne les touchera pas (`IS DISTINCT FROM`), mais les écrire rend la migration
-- vraie même si une position avait dérivé : un thème posé sur des fiches mal
-- ordonnées produirait des sections entrelacées, pire que la liste à plat.
--
-- Idempotent : un seul UPDATE, gardé par IS DISTINCT FROM. Rejouable sans
-- risque, et sans effet au second passage.
--
-- PRÉREQUIS : 008 (chapters), 182 (grants par colonne), 228 (les 16 fiches).
-- Aucun ordre imposé vis-à-vis de 234, 243, 244, 245, 246 ni 247.
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- 0. La colonne du chapitre de programme -------------------------------------
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;

-- 1. Les 16 fiches, rangées sous leurs six chapitres -------------------------
-- Le repère est le TITRE EXACT de la fiche, apostrophes typographiques
-- comprises (’ et non ') : ce sont celles de la 228, qui est un fichier généré.
-- Une apostrophe droite ici ne ferait pas échouer la migration — elle ne
-- trouverait simplement pas la ligne, et le filet de vérification en fin de
-- fichier le dirait.
UPDATE public.chapters c
   SET position = v.position, theme = v.theme
  FROM (VALUES
    ('L’atmosphère terrestre : son rôle dans l’apparition et dans le maintien de la vie', 1, 'Science, climat et société : sciences de l’atmosphère et conséquences de la modification anthropique du climat'),
    ('Le climat : un système complexe', 2, 'Science, climat et société : sciences de l’atmosphère et conséquences de la modification anthropique du climat'),
    ('Variations passées, récentes et futures du climat', 3, 'Science, climat et société : sciences de l’atmosphère et conséquences de la modification anthropique du climat'),
    ('Modèles prédictifs du climat du futur', 4, 'Science, climat et société : sciences de l’atmosphère et conséquences de la modification anthropique du climat'),
    ('L’énergie électrique au cours des deux derniers siècles : le XIXe siècle', 5, 'Le futur des énergies : l’électricité, approche historique et rôle central'),
    ('L’énergie électrique au cours des deux derniers siècles : le XXe siècle', 6, 'Le futur des énergies : l’électricité, approche historique et rôle central'),
    ('Le transport de l’électricité', 7, 'Le futur des énergies : l’électricité, approche historique et rôle central'),
    ('Les atouts de l’électricité et ses enjeux dans le développement durable', 8, 'Le futur des énergies : l’électricité, approche historique et rôle central'),
    ('La nécessité d’une transition énergétique pour agir sur le futur climatique', 9, 'Le futur des énergies : choix de développement et futur climatique'),
    ('Le choix énergétique : une décision stratégique à fort impact sur les sociétés', 10, 'Le futur des énergies : choix de développement et futur climatique'),
    ('Origine et évolution de la biodiversité', 11, 'Une histoire du vivant : biodiversité et dynamique des populations'),
    ('Modèles démographiques : comprendre l’évolution quantitative des populations', 12, 'Une histoire du vivant : biodiversité et dynamique des populations'),
    ('L’évolution comme grille de lecture du monde', 13, 'Une histoire du vivant : théorie de l’évolution'),
    ('Histoire évolutive de la lignée humaine', 14, 'Une histoire du vivant : théorie de l’évolution'),
    ('Automatisation du traitement de l’information : une évolution des capacités humaines', 15, 'Une histoire du vivant : impacts des nouvelles technologies sur le vivant'),
    ('L’intelligence artificielle : enjeux et débats', 16, 'Une histoire du vivant : impacts des nouvelles technologies sur le vivant')
  ) AS v(title, position, theme), public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'enseignement-scientifique'
   AND c.level = 'Tle'
   AND c.title = v.title
   AND (c.position IS DISTINCT FROM v.position OR c.theme IS DISTINCT FROM v.theme);

-- 2. Filet de vérification ---------------------------------------------------
-- Le compte doit tomber sur 16 fiches, toutes rangées, sous 6 chapitres. S'il
-- n'y tombe pas, la migration le DIT au lieu de laisser passer une matière à
-- moitié corrigée — c'est ainsi qu'on repère une apostrophe qui aurait dérivé.
DO $$
DECLARE
  total INT;
  rangees INT;
  chapitres INT;
BEGIN
  SELECT count(*), count(c.theme), count(DISTINCT c.theme)
    INTO total, rangees, chapitres
    FROM public.chapters c
    JOIN public.subjects s ON s.id = c.subject_id
   WHERE s.slug = 'enseignement-scientifique' AND c.level = 'Tle';
  IF total <> 16 OR rangees <> 16 OR chapitres <> 6 THEN
    RAISE WARNING 'Ens. scientifique Tle : % fiche(s), % rangee(s), % chapitre(s) — attendu 16 / 16 / 6.',
      total, rangees, chapitres;
  ELSE
    RAISE NOTICE 'Ens. scientifique Tle : 16 fiches rangees sous 6 chapitres.';
  END IF;
END $$;
