-- =============================================================================
-- Studuel — Migration 234 : L'AXE DU PROGRAMME PORTÉ PAR LE CHAPITRE
--
-- LE TROU QU'ELLE BOUCHE. Une page matière affiche ses chapitres à plat : 28
-- lignes identiques pour l'anglais de Terminale, 22 pour la SVT. Or aucun
-- programme officiel n'est écrit comme ça — le BO range ces 28 chapitres sous
-- 8 axes (« Faire société », « Environnements en mutation »…). L'élève, lui,
-- révise « l'axe 3 », pas « les chapitres 9 à 12 ». En perdant l'axe, l'app
-- perdait la seule structure que l'élève reconnaît de son cours, et rendait la
-- liste illisible passé le dixième chapitre.
--
-- CE QU'ON STOCKE : le libellé de l'axe, tel qu'il est écrit au programme. Une
-- colonne texte, pas une table `axes` : un axe n'a ni identité, ni attributs,
-- ni existence hors du chapitre qui le porte — une table serait une jointure
-- de plus pour ne stocker qu'un intitulé.
--
-- NULL VAUT « pas d'axe », et c'est l'état par défaut de tout le contenu déjà
-- en base. L'app le sait : sans aucun axe sur une matière, sa liste s'affiche à
-- plat, exactement comme avant (cf. `groupChaptersByTheme`, testé). Le
-- remplissage des axes peut donc se faire matière par matière, sans jamais
-- casser celles qui attendent leur tour.
--
-- POURQUOI LA COLONNE N'EST PAS DANS `CHAPTER_COLUMNS` (lib/types.ts) : cette
-- liste sert TOUTES les requêtes de Réviser. Une colonne absente de la base y
-- ferait répondre « column does not exist » à PostgREST, et l'onglet entier
-- tomberait tant que cette migration n'est pas exécutée. L'axe se lit donc dans
-- un select ISOLÉ, dont l'échec ne coûte que le regroupement.
--
-- ⚠️ LE GRANT N'EST PAS FACULTATIF. La migration 182 a RÉVOQUÉ le SELECT de
-- table sur `chapters` (pour cacher `mind_map`, payante) et ne l'a rendu que
-- colonne par colonne. Une colonne ajoutée après elle n'hérite donc de RIEN :
-- sans le GRANT ci-dessous, `select('id, theme')` répondrait « permission
-- denied » au lieu de la valeur.
--
-- PRÉREQUIS : 008 (chapters), 182 (grants par colonne). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

ALTER TABLE public.chapters
  ADD COLUMN IF NOT EXISTS theme TEXT;

COMMENT ON COLUMN public.chapters.theme IS
  'Axe / thème du programme officiel qui coiffe ce chapitre (« Faire société : unité et pluralité »). NULL = pas d''axe : la matière s''affiche à plat.';

-- Lecture publique : l'axe est du CATALOGUE, comme le titre et la position —
-- il transite par le cache anon (getProgrammeCached). Aucun contenu payant.
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;

-- Le regroupement lit tous les chapitres d'une matière/niveau d'un coup : c'est
-- l'index (subject_id, level) de la 008 qui sert cette requête. L'axe lui-même
-- n'est jamais un critère de filtre — pas d'index dessus, il ne servirait qu'à
-- ralentir les écritures du studio de contenu.
