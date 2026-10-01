-- =============================================================================
-- Studuel — Migration 384 : LES ANCIENNES FICHES DES OPTIONS DE Tle REJOIGNENT
-- LEUR PROGRAMME
--
-- CONSTAT (26/09/2026) : en Terminale, SI, EPS, latin, grec, LLCER anglais et
-- musique n'avaient que trois fiches maison, sans chapitre de programme. Les
-- migrations de contenu qui suivent leur apportent le programme officiel, rangé
-- sous ses chapitres (`chapters.theme`). Les trois fiches d'origine sont GARDÉES
-- et rattachées au chapitre du programme qui les couvre, pour ne pas tomber
-- dans une liste à plat sous les chapitres rangés.
--
-- ÉCRITURE PURE : aucun chapitre créé ni supprimé. Désignés par clé naturelle
-- (matière, niveau, titre) ; seuls les chapitres SANS thème sont touchés.
-- Idempotent. À exécuter dans : Supabase Dashboard → SQL Editor → Run.
-- =============================================================================

UPDATE public.chapters c
   SET theme = v.theme
  FROM (VALUES
    ('si', 'Systèmes asservis', 'Systèmes asservis'),
    ('si', 'Modélisation et simulation', 'Systèmes asservis'),
    ('si', 'Projet et démarche d’ingénieur', 'Projet et épreuves'),
    ('sport', 'S’entraîner et planifier', 'Savoir se préparer et s’entraîner'),
    ('sport', 'Alimentation, sommeil et performance', 'Construire durablement sa santé'),
    ('sport', 'Sport, société et valeurs', 'Exercer sa responsabilité'),
    ('latin', 'Les cinq déclinaisons', 'Étude de la langue'),
    ('latin', 'Propositions subordonnées et syntaxe', 'Étude de la langue'),
    ('latin', 'Rome : société, pouvoir, héritage', 'Méditerranée : présence des mondes antiques'),
    ('grec', 'La déclinaison grecque', 'Étude de la langue'),
    ('grec', 'Athènes et la démocratie', 'Méditerranée : présence des mondes antiques'),
    ('grec', 'Théâtre et philosophie', 'L’homme, le monde, le destin'),
    ('llcer-anglais', 'Expression et construction de soi', 'Expression et construction de soi'),
    ('llcer-anglais', 'Voyages, territoires, frontières', 'Voyages, territoires, frontières'),
    ('llcer-anglais', 'L’épreuve de LLCER en terminale', 'Méthodes de l’épreuve'),
    ('musique', 'Langage musical et analyse', 'Le son, la musique, l’espace et le temps'),
    ('musique', 'Création et technologies', 'La musique, l’homme et la société'),
    ('musique', 'Interpréter et écouter', 'Le son, la musique, l’espace et le temps')
  ) AS v(slug, title, theme)
  JOIN public.subjects s ON s.slug = v.slug
 WHERE c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.title
   AND c.theme IS NULL;

DO $$
DECLARE n integer;
BEGIN
  SELECT count(*) INTO n
    FROM public.chapters c JOIN public.subjects s ON s.id = c.subject_id
   WHERE c.level = 'Tle' AND c.theme IS NULL
     AND s.slug IN ('si', 'sport', 'latin', 'grec', 'llcer-anglais', 'musique');
  RAISE NOTICE 'Migration 384 : % fiche(s) d’option de Tle encore sans chapitre (attendu 0).', n;
END $$;
