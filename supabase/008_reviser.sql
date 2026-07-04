-- =============================================================================
-- Scolaria — Migration 008 : refonte Réviser (matières → chapitres → leçons)
-- Programmes conformes Éduscol, niveaux 6e → Terminale.
-- PRÉREQUIS : schema.sql, 002, 007 exécutés. Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. SUBJECTS — matières (catalogue, lecture authentifiée)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subjects (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug     TEXT UNIQUE NOT NULL,
  name     TEXT NOT NULL,
  icon     TEXT NOT NULL DEFAULT '📘',   -- émoji « sticker »
  color    TEXT NOT NULL DEFAULT 'blue', -- clé de thème pastel côté UI
  category TEXT NOT NULL DEFAULT 'college'
             CHECK (category IN ('college', 'tronc_commun', 'specialite', 'option')),
  levels   TEXT[] NOT NULL DEFAULT '{}'  -- niveaux où la matière est enseignée
);

-- -----------------------------------------------------------------------------
-- 2. CHAPTERS — chapitres du programme, par matière ET par niveau
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chapters (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID NOT NULL REFERENCES public.subjects (id) ON DELETE CASCADE,
  level      TEXT NOT NULL,
  title      TEXT NOT NULL,
  position   INT  NOT NULL DEFAULT 0,
  UNIQUE (subject_id, level, title)
);
CREATE INDEX IF NOT EXISTS chapters_subject_level_idx
  ON public.chapters (subject_id, level);

-- -----------------------------------------------------------------------------
-- 3. LESSONS — leçons d'un chapitre (contenu + quiz associables)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lessons (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id    UUID NOT NULL REFERENCES public.chapters (id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  thumbnail_url TEXT,
  content       TEXT,
  position      INT NOT NULL DEFAULT 0,
  UNIQUE (chapter_id, title)
);
CREATE INDEX IF NOT EXISTS lessons_chapter_idx ON public.lessons (chapter_id);

-- Un quiz peut être rattaché à une leçon (bouton play).
ALTER TABLE public.quizzes
  ADD COLUMN IF NOT EXISTS lesson_id UUID REFERENCES public.lessons (id) ON DELETE SET NULL;

-- Sélection de matières de l'élève (bouton « Éditer » du niveau 1).
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS selected_subjects JSONB;

REVOKE UPDATE ON public.profiles FROM authenticated, anon;
GRANT  UPDATE (full_name, grade_level, daily_goal, onboarded, selected_subjects)
  ON public.profiles TO authenticated;

-- RLS : lecture authentifiée uniquement.
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons  ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "subjects_select_auth" ON public.subjects;
CREATE POLICY "subjects_select_auth" ON public.subjects
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "chapters_select_auth" ON public.chapters;
CREATE POLICY "chapters_select_auth" ON public.chapters
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "lessons_select_auth" ON public.lessons;
CREATE POLICY "lessons_select_auth" ON public.lessons
  FOR SELECT TO authenticated USING (true);

-- =============================================================================
-- SEED — matières
-- =============================================================================
INSERT INTO public.subjects (slug, name, icon, color, category, levels) VALUES
  ('maths', 'Maths', '🧮', 'blue', 'specialite', '{6e,5e,4e,3e,2de,1re,Tle}'),
  ('francais', 'Français', '📚', 'red', 'tronc_commun', '{6e,5e,4e,3e,2de,1re}'),
  ('histoire-geo', 'Histoire-Géo', '🗺️', 'orange', 'tronc_commun', '{6e,5e,4e,3e,2de,1re,Tle}'),
  ('anglais', 'Anglais', '🇬🇧', 'indigo', 'tronc_commun', '{6e,5e,4e,3e,2de,1re,Tle}'),
  ('svt', 'SVT', '🧬', 'green', 'specialite', '{6e,5e,4e,3e,2de,1re,Tle}'),
  ('physique-chimie', 'Physique-Chimie', '⚗️', 'purple', 'specialite', '{5e,4e,3e,2de,1re,Tle}'),
  ('technologie', 'Technologie', '🤖', 'slate', 'college', '{5e,4e,3e}'),
  ('espagnol', 'Espagnol', '🇪🇸', 'yellow', 'tronc_commun', '{5e,4e,3e}'),
  ('philosophie', 'Philosophie', '💭', 'pink', 'tronc_commun', '{Tle}'),
  ('ses', 'SES', '📊', 'teal', 'specialite', '{2de,1re,Tle}'),
  ('nsi', 'NSI', '💻', 'purple', 'specialite', '{1re,Tle}'),
  ('hggsp', 'HGGSP', '🌍', 'orange', 'specialite', '{1re,Tle}'),
  ('enseignement-scientifique', 'Ens. scientifique', '🔭', 'teal', 'tronc_commun', '{1re,Tle}'),
  ('maths-expertes', 'Maths expertes', '♾️', 'blue', 'option', '{Tle}'),
  ('latin', 'Latin', '🏛️', 'yellow', 'option', '{5e,4e,3e}')
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- SEED — chapitres (programmes Éduscol, 4-5 par matière et par niveau)
-- =============================================================================

INSERT INTO public.chapters (subject_id, level, title, position)
SELECT s.id, v.level, v.title, v.pos FROM public.subjects s, (VALUES
  ('6e','Nombres entiers et décimaux',1),('6e','Fractions',2),('6e','Proportionnalité',3),('6e','Géométrie plane',4),('6e','Aires, périmètres et volumes',5),
  ('5e','Nombres relatifs',1),('5e','Fractions et calculs',2),('5e','Calcul littéral : initiation',3),('5e','Triangles et angles',4),('5e','Proportionnalité et pourcentages',5),
  ('4e','Puissances',1),('4e','Calcul littéral',2),('4e','Théorème de Pythagore',3),('4e','Proportionnalité et fonctions',4),('4e','Statistiques et probabilités',5),
  ('3e','Arithmétique',1),('3e','Fonctions linéaires et affines',2),('3e','Théorème de Thalès',3),('3e','Trigonométrie',4),('3e','Probabilités et statistiques',5),
  ('2de','Ensembles de nombres et calculs',1),('2de','Équations et inéquations',2),('2de','Fonctions de référence',3),('2de','Vecteurs',4),('2de','Statistiques et probabilités',5),
  ('1re','Suites numériques',1),('1re','Second degré',2),('1re','Dérivation',3),('1re','Produit scalaire',4),('1re','Probabilités conditionnelles',5),
  ('Tle','Limites de fonctions',1),('Tle','Continuité et convexité',2),('Tle','Logarithme népérien',3),('Tle','Primitives et équations différentielles',4),('Tle','Lois de probabilité',5)
) AS v(level, title, pos) WHERE s.slug = 'maths'
ON CONFLICT (subject_id, level, title) DO NOTHING;

INSERT INTO public.chapters (subject_id, level, title, position)
SELECT s.id, v.level, v.title, v.pos FROM public.subjects s, (VALUES
  ('6e','Le conte merveilleux',1),('6e','Récits d''aventures',2),('6e','Poésie : jeux de langage',3),('6e','Le groupe nominal et ses accords',4),('6e','Conjugaison : présent et imparfait',5),
  ('5e','Le roman de chevalerie',1),('5e','Voyages et découvertes',2),('5e','Théâtre : la comédie',3),('5e','Les compléments de phrase',4),('5e','Conjugaison : passé simple',5),
  ('4e','La lettre et l''épistolaire',1),('4e','Le fantastique',2),('4e','La ville en poésie',3),('4e','Les propositions subordonnées',4),('4e','Cause, conséquence et but',5),
  ('3e','Se raconter : l''autobiographie',1),('3e','Dénoncer les travers de la société',2),('3e','La poésie engagée',3),('3e','Le discours rapporté',4),('3e','Préparer l''oral du brevet',5),
  ('2de','Le roman et le récit',1),('2de','La poésie du Moyen Âge au XVIIIe',2),('2de','Le théâtre du XVIIe au XXIe',3),('2de','La littérature d''idées et la presse',4),('2de','Méthode du commentaire',5),
  ('1re','La poésie du XIXe au XXIe siècle',1),('1re','Le roman : parcours bac',2),('1re','Le théâtre : parcours bac',3),('1re','La littérature d''idées',4),('1re','Dissertation et oral du bac',5)
) AS v(level, title, pos) WHERE s.slug = 'francais'
ON CONFLICT (subject_id, level, title) DO NOTHING;

INSERT INTO public.chapters (subject_id, level, title, position)
SELECT s.id, v.level, v.title, v.pos FROM public.subjects s, (VALUES
  ('6e','La longue histoire de l''humanité',1),('6e','Premiers États, premières écritures',2),('6e','Rome : du mythe à l''histoire',3),('6e','Habiter une métropole',4),('6e','Habiter les littoraux',5),
  ('5e','Byzance et l''Europe carolingienne',1),('5e','Société, Église et pouvoir féodal',2),('5e','L''islam médiéval : pouvoirs et cultures',3),('5e','La croissance démographique et ses effets',4),('5e','L''accès aux ressources : énergie et eau',5),
  ('4e','L''Europe des Lumières',1),('4e','La Révolution française et l''Empire',2),('4e','L''Europe de la révolution industrielle',3),('4e','L''urbanisation du monde',4),('4e','Les mobilités humaines',5),
  ('3e','La Première Guerre mondiale',1),('3e','L''Europe entre les deux guerres',2),('3e','La Seconde Guerre mondiale',3),('3e','La France de 1944 à nos jours',4),('3e','Les aires urbaines en France',5),
  ('2de','La Méditerranée antique',1),('2de','La Méditerranée médiévale',2),('2de','L''ouverture atlantique (XVe-XVIe)',3),('2de','Sociétés et environnements',4),('2de','Des mobilités généralisées',5),
  ('1re','L''Europe face aux révolutions',1),('1re','La Troisième République',2),('1re','La Grande Guerre et la fin des empires',3),('1re','La métropolisation',4),('1re','Les espaces productifs français',5),
  ('Tle','Démocraties fragiles et totalitarismes',1),('Tle','La Seconde Guerre mondiale',2),('Tle','La Guerre froide',3),('Tle','Mers et océans dans la mondialisation',4),('Tle','L''Union européenne dans la mondialisation',5)
) AS v(level, title, pos) WHERE s.slug = 'histoire-geo'
ON CONFLICT (subject_id, level, title) DO NOTHING;

INSERT INTO public.chapters (subject_id, level, title, position)
SELECT s.id, v.level, v.title, v.pos FROM public.subjects s, (VALUES
  ('6e','Se présenter et parler de soi',1),('6e','Present simple : routines',2),('6e','La famille et les animaux',3),('6e','L''école en pays anglophone',4),('6e','Fêtes et traditions',5),
  ('5e','Present simple vs continuous',1),('5e','Le prétérit : raconter au passé',2),('5e','Décrire un lieu, une ville',3),('5e','La nourriture et les quantités',4),('5e','Les pays anglophones',5),
  ('4e','Le present perfect',1),('4e','Comparatifs et superlatifs',2),('4e','Exprimer le futur',3),('4e','Les médias et les réseaux',4),('4e','Portraits d''artistes anglophones',5),
  ('3e','Le passif',1),('3e','Les modaux : conseils et obligation',2),('3e','Present perfect vs prétérit',3),('3e','Le monde du travail',4),('3e','Préparer l''épreuve orale',5),
  ('2de','Vivre entre générations',1),('2de','Les univers professionnels',2),('2de','Représentation de soi et d''autrui',3),('2de','Le passé dans le présent',4),
  ('1re','Identités et échanges',1),('1re','Espace privé et espace public',2),('1re','Art et pouvoir',3),('1re','Citoyenneté et mondes virtuels',4),
  ('Tle','Faire société : unité et pluralité',1),('Tle','Environnements en mutation',2),('Tle','Art et débats d''idées',3),('Tle','Innovations et responsabilité',4)
) AS v(level, title, pos) WHERE s.slug = 'anglais'
ON CONFLICT (subject_id, level, title) DO NOTHING;

INSERT INTO public.chapters (subject_id, level, title, position)
SELECT s.id, v.level, v.title, v.pos FROM public.subjects s, (VALUES
  ('6e','Le vivant et sa diversité',1),('6e','Le développement des êtres vivants',2),('6e','Les besoins des plantes vertes',3),('6e','L''origine de nos aliments',4),('6e','La Terre dans le système solaire',5),
  ('5e','La nutrition des êtres vivants',1),('5e','La respiration en milieux variés',2),('5e','Géologie externe : les paysages',3),('5e','La reproduction sexuée',4),('5e','Les besoins de l''organisme',5),
  ('4e','L''activité interne du globe',1),('4e','La transmission de la vie',2),('4e','Le système nerveux',3),('4e','Météorologie et climats',4),
  ('3e','Le programme génétique',1),('3e','L''évolution des espèces',2),('3e','Le système immunitaire',3),('3e','Santé et responsabilité',4),('3e','Les risques géologiques',5),
  ('2de','La cellule, unité du vivant',1),('2de','Biodiversité et évolution',2),('2de','Le métabolisme cellulaire',3),('2de','Érosion et sédimentation',4),('2de','Microorganismes et santé',5),
  ('1re','Expression du patrimoine génétique',1),('1re','La dynamique interne de la Terre',2),('1re','Écosystèmes et services',3),('1re','Variation génétique et santé',4),
  ('Tle','Génétique et évolution',1),('Tle','Le temps et les roches',2),('Tle','Les climats de la Terre',3),('Tle','Comportement et stress',4),('Tle','De la plante sauvage à la plante cultivée',5)
) AS v(level, title, pos) WHERE s.slug = 'svt'
ON CONFLICT (subject_id, level, title) DO NOTHING;

INSERT INTO public.chapters (subject_id, level, title, position)
SELECT s.id, v.level, v.title, v.pos FROM public.subjects s, (VALUES
  ('5e','Les états de la matière',1),('5e','Les mélanges et solutions',2),('5e','Circuits électriques simples',3),('5e','La lumière : sources et propagation',4),
  ('4e','L''air et ses propriétés',1),('4e','Les transformations chimiques',2),('4e','Intensité et tension électriques',3),('4e','Vitesse et mouvement',4),
  ('3e','Ions et pH',1),('3e','L''énergie et ses conversions',2),('3e','La gravitation',3),('3e','Puissance et énergie électriques',4),
  ('2de','Constitution de la matière',1),('2de','Transformations chimiques : équations',2),('2de','Le mouvement : vitesse et référentiel',3),('2de','Ondes et signaux',4),('2de','La lumière : spectres',5),
  ('1re','Suivi d''une transformation chimique',1),('1re','Structure des entités chimiques',2),('1re','Mouvement et interactions',3),('1re','L''énergie mécanique',4),('1re','Ondes mécaniques',5),
  ('Tle','Cinétique chimique',1),('Tle','Acides et bases',2),('Tle','Mécanique : lois de Newton',3),('Tle','Ondes lumineuses : diffraction',4),('Tle','Énergie et thermodynamique',5)
) AS v(level, title, pos) WHERE s.slug = 'physique-chimie'
ON CONFLICT (subject_id, level, title) DO NOTHING;

INSERT INTO public.chapters (subject_id, level, title, position)
SELECT s.id, v.level, v.title, v.pos FROM public.subjects s, (VALUES
  ('5e','Le fonctionnement d''un objet technique',1),('5e','Matériaux et familles',2),('5e','Croquis et schémas',3),('5e','Habitat et ouvrages',4),
  ('4e','Chaîne d''information et d''énergie',1),('4e','La programmation par blocs',2),('4e','Réseaux et internet',3),('4e','Prototypage',4),
  ('3e','Modélisation et simulation',1),('3e','Objets connectés',2),('3e','Algorithmes et programmation',3),('3e','Projet : concevoir un objet',4)
) AS v(level, title, pos) WHERE s.slug = 'technologie'
ON CONFLICT (subject_id, level, title) DO NOTHING;

INSERT INTO public.chapters (subject_id, level, title, position)
SELECT s.id, v.level, v.title, v.pos FROM public.subjects s, (VALUES
  ('5e','Saludos : se présenter',1),('5e','Los artículos y el género',2),('5e','La familia y la casa',3),('5e','El presente de indicativo',4),
  ('4e','El pretérito perfecto',1),('4e','La ciudad y las direcciones',2),('4e','Gustos y opiniones',3),('4e','La vida cotidiana',4),
  ('3e','El pretérito indefinido',1),('3e','Hablar del futuro',2),('3e','El mundo hispánico',3),('3e','Preparar la expresión oral',4)
) AS v(level, title, pos) WHERE s.slug = 'espagnol'
ON CONFLICT (subject_id, level, title) DO NOTHING;

INSERT INTO public.chapters (subject_id, level, title, position)
SELECT s.id, v.level, v.title, v.pos FROM public.subjects s, (VALUES
  ('Tle','La conscience et l''inconscient',1),('Tle','La liberté',2),('Tle','Le bonheur',3),('Tle','La justice et le droit',4),('Tle','La vérité et la raison',5)
) AS v(level, title, pos) WHERE s.slug = 'philosophie'
ON CONFLICT (subject_id, level, title) DO NOTHING;

INSERT INTO public.chapters (subject_id, level, title, position)
SELECT s.id, v.level, v.title, v.pos FROM public.subjects s, (VALUES
  ('2de','Comment raisonnent les économistes ?',1),('2de','La production',2),('2de','Comment se forment les prix ?',3),('2de','La socialisation',4),
  ('1re','Le marché et ses défaillances',1),('1re','La monnaie et le financement',2),('1re','Socialisation et groupes sociaux',3),('1re','L''opinion publique',4),
  ('Tle','Croissance et environnement',1),('Tle','Le commerce international',2),('Tle','Les mutations du travail',3),('Tle','La justice sociale',4)
) AS v(level, title, pos) WHERE s.slug = 'ses'
ON CONFLICT (subject_id, level, title) DO NOTHING;

INSERT INTO public.chapters (subject_id, level, title, position)
SELECT s.id, v.level, v.title, v.pos FROM public.subjects s, (VALUES
  ('1re','Types de données et représentation',1),('1re','Python : bases de la programmation',2),('1re','Tableaux et dictionnaires',3),('1re','Le web : HTML, CSS, HTTP',4),
  ('Tle','Structures de données',1),('Tle','Bases de données et SQL',2),('Tle','Réseaux et protocoles',3),('Tle','Algorithmique : les graphes',4)
) AS v(level, title, pos) WHERE s.slug = 'nsi'
ON CONFLICT (subject_id, level, title) DO NOTHING;

INSERT INTO public.chapters (subject_id, level, title, position)
SELECT s.id, v.level, v.title, v.pos FROM public.subjects s, (VALUES
  ('1re','La démocratie : fragilités et évolutions',1),('1re','Les frontières dans le monde',2),('1re','Le pouvoir des médias',3),('1re','États et religions',4),
  ('Tle','Environnement : exploiter, préserver',1),('Tle','Guerres et paix',2),('Tle','L''enjeu de la connaissance',3),('Tle','Le patrimoine',4)
) AS v(level, title, pos) WHERE s.slug = 'hggsp'
ON CONFLICT (subject_id, level, title) DO NOTHING;

INSERT INTO public.chapters (subject_id, level, title, position)
SELECT s.id, v.level, v.title, v.pos FROM public.subjects s, (VALUES
  ('1re','La Terre, un astre singulier',1),('1re','Le Soleil, source d''énergie',2),('1re','Une longue histoire de la matière',3),('1re','Son et musique',4),
  ('Tle','L''atmosphère et le climat',1),('Tle','L''énergie : conversions et enjeux',2),('Tle','Une histoire du vivant',3),('Tle','L''intelligence artificielle',4)
) AS v(level, title, pos) WHERE s.slug = 'enseignement-scientifique'
ON CONFLICT (subject_id, level, title) DO NOTHING;

INSERT INTO public.chapters (subject_id, level, title, position)
SELECT s.id, v.level, v.title, v.pos FROM public.subjects s, (VALUES
  ('Tle','Nombres complexes',1),('Tle','Arithmétique : congruences',2),('Tle','Matrices et graphes',3)
) AS v(level, title, pos) WHERE s.slug = 'maths-expertes'
ON CONFLICT (subject_id, level, title) DO NOTHING;

INSERT INTO public.chapters (subject_id, level, title, position)
SELECT s.id, v.level, v.title, v.pos FROM public.subjects s, (VALUES
  ('5e','Premiers pas : les déclinaisons',1),('5e','La vie quotidienne à Rome',2),('5e','La fondation de Rome',3),
  ('4e','Les verbes : temps du récit',1),('4e','La société romaine',2),('4e','Mythes et héros',3),
  ('3e','Rhétorique et citoyenneté',1),('3e','L''Empire romain',2),('3e','Traduire des textes authentiques',3)
) AS v(level, title, pos) WHERE s.slug = 'latin'
ON CONFLICT (subject_id, level, title) DO NOTHING;

-- =============================================================================
-- SEED — leçons : 2 placeholders par chapitre, générées automatiquement
-- =============================================================================
INSERT INTO public.lessons (chapter_id, title, content, position)
SELECT c.id, 'L''essentiel du cours',
       '# ' || c.title || E'\n\nCe cours détaillé arrive bientôt. En attendant, retiens les idées clés du chapitre « ' || c.title || ' » et entraîne-toi avec le quiz associé.',
       1
FROM public.chapters c
ON CONFLICT (chapter_id, title) DO NOTHING;

INSERT INTO public.lessons (chapter_id, title, content, position)
SELECT c.id, 'Exercices types',
       '# Exercices — ' || c.title || E'\n\nLes exercices corrigés de ce chapitre arrivent bientôt. Lance le quiz pour tester ce que tu sais déjà !',
       2
FROM public.chapters c
ON CONFLICT (chapter_id, title) DO NOTHING;

-- =============================================================================
-- Rattacher les quiz existants aux leçons correspondantes
-- =============================================================================
CREATE OR REPLACE FUNCTION public._link_quiz(quiz UUID, s TEXT, lvl TEXT, chap TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.quizzes q SET lesson_id = (
    SELECT l.id FROM public.lessons l
    JOIN public.chapters c ON c.id = l.chapter_id
    JOIN public.subjects sub ON sub.id = c.subject_id
    WHERE sub.slug = s AND c.level = lvl AND c.title = chap AND l.position = 1
    LIMIT 1
  ) WHERE q.id = quiz;
END;
$$ LANGUAGE plpgsql;

SELECT public._link_quiz('11111111-1111-4111-8111-111111111101', 'maths', '6e', 'Fractions');
SELECT public._link_quiz('11111111-1111-4111-8111-111111111102', 'francais', '6e', 'Conjugaison : présent et imparfait');
SELECT public._link_quiz('11111111-1111-4111-8111-111111111103', 'histoire-geo', '4e', 'La Révolution française et l''Empire');
SELECT public._link_quiz('11111111-1111-4111-8111-111111111104', 'maths', '4e', 'Théorème de Pythagore');
SELECT public._link_quiz('11111111-1111-4111-8111-111111111105', 'svt', '6e', 'Le vivant et sa diversité');
SELECT public._link_quiz('11111111-1111-4111-8111-111111111106', 'anglais', '5e', 'Present simple vs continuous');
SELECT public._link_quiz('11111111-1111-4111-8111-111111111107', 'physique-chimie', '5e', 'Les états de la matière');
SELECT public._link_quiz('11111111-1111-4111-8111-111111111108', 'histoire-geo', '3e', 'La Première Guerre mondiale');

DROP FUNCTION public._link_quiz(UUID, TEXT, TEXT, TEXT);
