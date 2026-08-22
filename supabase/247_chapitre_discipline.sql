-- =============================================================================
-- Studuel — Migration 247 : LA DISCIPLINE PORTÉE PAR LE CHAPITRE
--
-- LE TROU QU'ELLE BOUCHE. « Histoire-Géo » n'est pas une matière : c'en est
-- DEUX, dans un seul dossier. Depuis les migrations 245 et 246, la page affiche
-- 15 chapitres en Première comme en Terminale — six d'histoire puis neuf de
-- géographie, onze puis quatre. L'élève qui révise la guerre froide fait défiler
-- des chapitres sur les espaces ruraux, et celui qui prépare la géo remonte
-- toute l'histoire pour l'atteindre. Aucun cahier de classe n'est rangé comme
-- ça : ce sont deux cours, deux professeurs parfois, deux épreuves au bac.
--
-- CE QU'ON STOCKE : la discipline à laquelle appartient le chapitre, en clair —
-- 'histoire' ou 'geographie'. Une colonne texte, comme `theme` (migration 234),
-- et pour les mêmes raisons : une discipline n'a ni identité, ni attributs, ni
-- existence hors du chapitre qui la porte.
--
-- NULL VAUT « matière unique », et c'est l'état par défaut de tout le reste du
-- contenu. L'app le sait : sans discipline, ou avec une seule, la page garde son
-- onglet « Programme » unique (cf. `disciplinesOf` / `modesFor`, testés). Dès
-- qu'une matière en porte DEUX, l'onglet Programme se dédouble — « Histoire » et
-- « Géographie » — et chaque onglet ne montre que ses chapitres.
--
-- POURQUOI PAS UNE MATIÈRE PAR DISCIPLINE ? Parce que le bulletin, l'emploi du
-- temps et le bac disent « Histoire-Géographie » : séparer les deux matières
-- dédoublerait la moyenne, le classement, le boss et la vignette pour une
-- distinction qui n'existe qu'À L'INTÉRIEUR du dossier. Le filtre est un
-- problème d'affichage, il se règle à l'affichage.
--
-- LA COLONNE N'EST PAS DANS `CHAPTER_COLUMNS` (lib/types.ts), pour la même
-- raison que `theme` : cette liste sert TOUTES les requêtes de Réviser, et une
-- colonne absente de la base y ferait répondre « column does not exist » à
-- PostgREST — l'onglet entier tomberait tant que la migration n'est pas jouée.
-- Elle se lit dans le select isolé de l'axe, qui retombe sur `id, theme` seul si
-- elle manque.
--
-- ⚠️ LE GRANT N'EST PAS FACULTATIF. La migration 182 a RÉVOQUÉ le SELECT de
-- table sur `chapters` et ne l'a rendu que colonne par colonne : une colonne
-- ajoutée après elle n'hérite de RIEN.
--
-- PRÉREQUIS : 008 (chapters), 182 (grants par colonne), 245 et 246 (les thèmes
-- d'histoire-géo, sur lesquels s'appuie le remplissage). Idempotent.
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

ALTER TABLE public.chapters
  ADD COLUMN IF NOT EXISTS discipline TEXT;

COMMENT ON COLUMN public.chapters.discipline IS
  'Discipline du chapitre dans une matière qui en réunit plusieurs (« histoire », « geographie »). NULL = matière unique : la page garde un seul onglet Programme.';

GRANT SELECT (discipline) ON public.chapters TO anon;
GRANT SELECT (discipline) ON public.chapters TO authenticated;

-- Le remplissage se fait par le THÈME, c'est-à-dire par le chapitre du
-- programme : chaque chapitre appartient à une discipline et à une seule, et le
-- couple (niveau, thème) est unique. Passer par le titre des 96 fiches serait
-- 96 lignes à tenir à jour ; par le thème, 30 suffisent.
UPDATE public.chapters c
   SET discipline = v.discipline
  FROM (VALUES
    -- ---------------- Première : 6 chapitres d'histoire ----------------
    ('1re', 'L’Europe face aux révolutions', 'histoire'),
    ('1re', 'La France dans l’Europe des nationalités : politique et société (1848-1871)', 'histoire'),
    ('1re', 'La Troisième République avant 1914 : la mise en œuvre du projet républicain', 'histoire'),
    ('1re', 'La Troisième République avant 1914 : permanences et mutations de la société française jusqu’en 1914', 'histoire'),
    ('1re', 'La Troisième République avant 1914 : métropoles et colonies', 'histoire'),
    ('1re', 'La Première Guerre mondiale : le « suicide de l’Europe » et la fin des empires européens', 'histoire'),
    -- ---------------- Première : 9 chapitres de géographie -------------
    ('1re', 'Les villes à l’échelle mondiale : le poids croissant des métropoles', 'geographie'),
    ('1re', 'Des métropoles inégales et en mutation', 'geographie'),
    ('1re', 'La France : la métropolisation et ses effets', 'geographie'),
    ('1re', 'Les espaces de production dans le monde : une diversité croissante', 'geographie'),
    ('1re', 'Métropolisation, littoralisation des espaces productifs et accroissement des flux', 'geographie'),
    ('1re', 'La France : les systèmes productifs entre valorisation locale et intégration européenne et mondiale', 'geographie'),
    ('1re', 'Les espaces ruraux : multifonctionnalité ou fragmentation ?', 'geographie'),
    ('1re', 'La France : des espaces ruraux multifonctionnels, entre initiatives locales et politiques européennes', 'geographie'),
    ('1re', 'La Chine : des recompositions spatiales multiples', 'geographie'),
    -- ---------------- Terminale : 11 chapitres d'histoire --------------
    ('Tle', 'L’impact de la crise de 1929 : déséquilibres économiques et sociaux', 'histoire'),
    ('Tle', 'Les régimes totalitaires', 'histoire'),
    ('Tle', 'La Seconde Guerre mondiale', 'histoire'),
    ('Tle', 'La fin de la Seconde Guerre mondiale et les débuts d’un nouvel ordre mondial bipolaire', 'histoire'),
    ('Tle', 'Une nouvelle donne géopolitique : bipolarisation et émergence du tiers-monde', 'histoire'),
    ('Tle', 'La France : une nouvelle place dans le monde', 'histoire'),
    ('Tle', 'La modification des grands équilibres économiques et politiques', 'histoire'),
    ('Tle', 'Un tournant social, politique et culturel, la France de 1974 à 1988', 'histoire'),
    ('Tle', 'Nouveaux rapports de puissance et enjeux mondiaux', 'histoire'),
    ('Tle', 'La construction européenne entre élargissement, approfondissement et remise en question', 'histoire'),
    ('Tle', 'La République française', 'histoire'),
    -- ---------------- Terminale : 4 chapitres de géographie ------------
    ('Tle', 'Mers et océans au cœur de la mondialisation', 'geographie'),
    ('Tle', 'Dynamiques territoriales, coopérations et tensions dans la mondialisation', 'geographie'),
    ('Tle', 'L’Union européenne dans la mondialisation', 'geographie'),
    ('Tle', 'La France et ses régions dans l’Union européenne et dans la mondialisation', 'geographie')
  ) AS v(level, theme, discipline), public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'histoire-geo'
   AND c.level = v.level
   AND c.theme = v.theme
   AND c.discipline IS DISTINCT FROM v.discipline;

-- Filet de vérification ------------------------------------------------------
-- Une fiche d'histoire-géo sans discipline tomberait dans l'onglet Histoire par
-- défaut, en silence. Le compte doit être exact : 43 fiches en 1re, 53 en Tle.
DO $$
DECLARE
  sans_discipline INT;
  histoire INT;
  geographie INT;
BEGIN
  SELECT count(*) FILTER (WHERE c.discipline IS NULL),
         count(*) FILTER (WHERE c.discipline = 'histoire'),
         count(*) FILTER (WHERE c.discipline = 'geographie')
    INTO sans_discipline, histoire, geographie
    FROM public.chapters c
    JOIN public.subjects s ON s.id = c.subject_id
   WHERE s.slug = 'histoire-geo' AND c.level IN ('1re', 'Tle');
  IF sans_discipline > 0 THEN
    RAISE WARNING 'Histoire-Géo : % fiche(s) sans discipline (attendu 0) — % en histoire, % en geographie.',
      sans_discipline, histoire, geographie;
  ELSE
    RAISE NOTICE 'Histoire-Geo : % fiches d''histoire et % de geographie, aucune orpheline.',
      histoire, geographie;
  END IF;
END $$;
