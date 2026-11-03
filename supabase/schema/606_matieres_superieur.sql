-- =============================================================================
-- Studuel — Migration 606 : LES MATIÈRES DU SUPÉRIEUR (03/11/2026)
--
-- Les étudiants arrivent : cinq cursus, le Pareto des vœux Parcoursup 2025 —
-- PASS, droit, STAPS, psychologie, économie-gestion (docs/CADRAGE-SUPERIEUR.md).
-- Chaque cursus a une CLASSE par année (« L1 droit », « L2 droit »…, « PASS »),
-- déclarée dans lib/types.ts comme la voie techno ; cette migration déclare les
-- 60 matières de ces classes, chacune pour les seules années qui la suivent
-- (`subjects.levels`). Un collégien ou un lycéen ne les voit donc jamais.
--
-- Fichier GÉNÉRÉ par scripts/superieur-matieres-sql.mjs depuis
-- lib/superieur/cursus.ts — ne pas l'éditer à la main.
--
-- Leur contenu (chapitres, cours, quiz) vit à la classe EXACTE
-- (`chapters.level = 'L1 droit'`), sans alias ; il arrive par les migrations de
-- contenu qui suivent. Tant qu'elles manquent, ces matières s'affichent
-- « Bientôt », comme partout ailleurs.
--
-- Catégorie 'tronc_commun' : à l'onboarding, toutes les matières de l'année
-- sont cochées, l'étudiant fait le tri au stylo (lib/programme-classes.ts).
-- Aucun slug ne recouvre une matière existante (vérifié le 03/11/2026).
--
-- Idempotent (ON CONFLICT (slug) DO UPDATE). Supabase Dashboard → SQL Editor →
-- New query → Run.
-- =============================================================================

INSERT INTO public.subjects (slug, name, icon, color, category, levels)
VALUES
  -- Droit (L1, L2, L3)
  ('droit-civil', 'Droit civil', '⚖️', 'indigo', 'tronc_commun', '{"L1 droit","L2 droit","L3 droit"}'),
  ('droit-constitutionnel', 'Droit constitutionnel', '⚖️', 'blue', 'tronc_commun', '{"L1 droit"}'),
  ('histoire-du-droit', 'Histoire du droit et des institutions', '⚖️', 'orange', 'tronc_commun', '{"L1 droit"}'),
  ('institutions-juridictionnelles', 'Institutions juridictionnelles', '⚖️', 'purple', 'tronc_commun', '{"L1 droit"}'),
  ('science-politique', 'Science politique', '⚖️', 'teal', 'tronc_commun', '{"L1 droit"}'),
  ('economie-politique', 'Introduction à l’économie', '⚖️', 'yellow', 'tronc_commun', '{"L1 droit"}'),
  ('droit-administratif', 'Droit administratif', '⚖️', 'blue', 'tronc_commun', '{"L2 droit","L3 droit"}'),
  ('droit-penal', 'Droit pénal', '⚖️', 'red', 'tronc_commun', '{"L2 droit","L3 droit"}'),
  ('finances-publiques', 'Finances publiques', '⚖️', 'green', 'tronc_commun', '{"L2 droit"}'),
  ('droit-des-affaires', 'Droit des affaires', '⚖️', 'purple', 'tronc_commun', '{"L2 droit","L3 droit"}'),
  ('droit-europeen', 'Droit de l’Union européenne', '⚖️', 'indigo', 'tronc_commun', '{"L2 droit"}'),
  ('droit-international', 'Droit international public', '⚖️', 'teal', 'tronc_commun', '{"L3 droit"}'),
  ('droit-du-travail', 'Droit du travail', '⚖️', 'orange', 'tronc_commun', '{"L3 droit"}'),
  ('libertes-fondamentales', 'Libertés fondamentales', '⚖️', 'pink', 'tronc_commun', '{"L3 droit"}'),
  ('droit-fiscal', 'Droit fiscal', '⚖️', 'yellow', 'tronc_commun', '{"L3 droit"}'),
  ('procedure-civile', 'Procédure civile', '⚖️', 'slate', 'tronc_commun', '{"L3 droit"}'),
  ('methodologie-juridique', 'Méthodologie juridique', '⚖️', 'slate', 'tronc_commun', '{"L1 droit","L2 droit","L3 droit"}'),
  -- Santé (PASS)
  ('chimie-sante', 'Chimie générale et organique', '🩺', 'teal', 'tronc_commun', '{"PASS"}'),
  ('biochimie', 'Biochimie', '🩺', 'green', 'tronc_commun', '{"PASS"}'),
  ('biologie-cellulaire', 'Biologie cellulaire', '🩺', 'pink', 'tronc_commun', '{"PASS"}'),
  ('genetique', 'Biologie moléculaire et génétique', '🩺', 'purple', 'tronc_commun', '{"PASS"}'),
  ('biophysique', 'Biophysique', '🩺', 'blue', 'tronc_commun', '{"PASS"}'),
  ('physiologie', 'Physiologie', '🩺', 'red', 'tronc_commun', '{"PASS"}'),
  ('anatomie', 'Anatomie', '🩺', 'orange', 'tronc_commun', '{"PASS"}'),
  ('histologie-embryologie', 'Histologie et embryologie', '🩺', 'yellow', 'tronc_commun', '{"PASS"}'),
  ('biostatistiques', 'Biostatistiques', '🩺', 'slate', 'tronc_commun', '{"PASS"}'),
  ('sante-societe', 'Santé, société, humanité', '🩺', 'indigo', 'tronc_commun', '{"PASS"}'),
  ('pharmacologie', 'Initiation à la connaissance du médicament', '🩺', 'green', 'tronc_commun', '{"PASS"}'),
  -- STAPS (L1, L2, L3)
  ('anatomie-fonctionnelle', 'Anatomie fonctionnelle', '🏃', 'red', 'tronc_commun', '{"L1 staps"}'),
  ('physiologie-exercice', 'Physiologie de l’exercice', '🏃', 'pink', 'tronc_commun', '{"L1 staps","L2 staps","L3 staps"}'),
  ('biomecanique', 'Biomécanique', '🏃', 'blue', 'tronc_commun', '{"L1 staps","L2 staps","L3 staps"}'),
  ('psycho-sport', 'Psychologie du sport', '🏃', 'purple', 'tronc_commun', '{"L1 staps","L2 staps","L3 staps"}'),
  ('sciences-sociales-sport', 'Sociologie et histoire du sport', '🏃', 'orange', 'tronc_commun', '{"L1 staps","L2 staps","L3 staps"}'),
  ('entrainement', 'Théorie de l’entraînement', '🏃', 'green', 'tronc_commun', '{"L1 staps","L2 staps","L3 staps"}'),
  ('apprentissage-moteur', 'Contrôle et apprentissage moteur', '🏃', 'teal', 'tronc_commun', '{"L2 staps","L3 staps"}'),
  ('management-sport', 'Management du sport', '🏃', 'yellow', 'tronc_commun', '{"L3 staps"}'),
  ('apa', 'Activité physique adaptée', '🏃', 'indigo', 'tronc_commun', '{"L3 staps"}'),
  -- Psychologie (L1, L2, L3)
  ('psycho-developpement', 'Psychologie du développement', '🧠', 'green', 'tronc_commun', '{"L1 psycho","L2 psycho","L3 psycho"}'),
  ('psycho-sociale', 'Psychologie sociale', '🧠', 'pink', 'tronc_commun', '{"L1 psycho","L2 psycho","L3 psycho"}'),
  ('psycho-cognitive', 'Psychologie cognitive', '🧠', 'purple', 'tronc_commun', '{"L1 psycho","L2 psycho","L3 psycho"}'),
  ('neurosciences', 'Neurosciences et psychophysiologie', '🧠', 'indigo', 'tronc_commun', '{"L1 psycho","L2 psycho","L3 psycho"}'),
  ('psycho-clinique', 'Psychologie clinique et psychopathologie', '🧠', 'teal', 'tronc_commun', '{"L1 psycho","L2 psycho","L3 psycho"}'),
  ('psycho-differentielle', 'Psychologie différentielle', '🧠', 'orange', 'tronc_commun', '{"L2 psycho","L3 psycho"}'),
  ('methodo-psycho', 'Méthodologie et statistiques', '🧠', 'slate', 'tronc_commun', '{"L1 psycho","L2 psycho","L3 psycho"}'),
  ('histoire-psychologie', 'Histoire et épistémologie de la psychologie', '🧠', 'yellow', 'tronc_commun', '{"L1 psycho"}'),
  ('psycho-travail', 'Psychologie du travail', '🧠', 'blue', 'tronc_commun', '{"L3 psycho"}'),
  -- Économie-gestion (L1, L2, L3)
  ('microeconomie', 'Microéconomie', '📈', 'yellow', 'tronc_commun', '{"L1 eco","L2 eco","L3 eco"}'),
  ('macroeconomie', 'Macroéconomie', '📈', 'orange', 'tronc_commun', '{"L1 eco","L2 eco","L3 eco"}'),
  ('maths-economie', 'Mathématiques pour l’économie', '📈', 'blue', 'tronc_commun', '{"L1 eco","L2 eco"}'),
  ('statistiques', 'Statistiques et probabilités', '📈', 'teal', 'tronc_commun', '{"L1 eco","L2 eco"}'),
  ('econometrie', 'Économétrie', '📈', 'indigo', 'tronc_commun', '{"L3 eco"}'),
  ('comptabilite', 'Comptabilité', '📈', 'green', 'tronc_commun', '{"L1 eco","L2 eco"}'),
  ('gestion', 'Management des organisations', '📈', 'purple', 'tronc_commun', '{"L1 eco","L3 eco"}'),
  ('histoire-economique', 'Histoire des faits économiques', '📈', 'orange', 'tronc_commun', '{"L1 eco"}'),
  ('marketing', 'Marketing', '📈', 'pink', 'tronc_commun', '{"L2 eco"}'),
  ('finance', 'Finance d’entreprise', '📈', 'green', 'tronc_commun', '{"L2 eco","L3 eco"}'),
  ('economie-monetaire', 'Monnaie et banque', '📈', 'yellow', 'tronc_commun', '{"L2 eco"}'),
  ('economie-internationale', 'Économie internationale', '📈', 'teal', 'tronc_commun', '{"L2 eco","L3 eco"}'),
  ('economie-publique', 'Économie publique', '📈', 'blue', 'tronc_commun', '{"L3 eco"}'),
  ('controle-de-gestion', 'Contrôle de gestion', '📈', 'slate', 'tronc_commun', '{"L3 eco"}')
ON CONFLICT (slug) DO UPDATE
  SET name = EXCLUDED.name, icon = EXCLUDED.icon, color = EXCLUDED.color,
      category = EXCLUDED.category, levels = EXCLUDED.levels;

DO $sonde$
DECLARE
  n integer;
BEGIN
  SELECT count(*) INTO n FROM public.subjects
   WHERE slug IN ('droit-civil', 'droit-constitutionnel', 'histoire-du-droit', 'institutions-juridictionnelles', 'science-politique', 'economie-politique', 'droit-administratif', 'droit-penal', 'finances-publiques', 'droit-des-affaires', 'droit-europeen', 'droit-international', 'droit-du-travail', 'libertes-fondamentales', 'droit-fiscal', 'procedure-civile', 'methodologie-juridique', 'chimie-sante', 'biochimie', 'biologie-cellulaire', 'genetique', 'biophysique', 'physiologie', 'anatomie', 'histologie-embryologie', 'biostatistiques', 'sante-societe', 'pharmacologie', 'anatomie-fonctionnelle', 'physiologie-exercice', 'biomecanique', 'psycho-sport', 'sciences-sociales-sport', 'entrainement', 'apprentissage-moteur', 'management-sport', 'apa', 'psycho-developpement', 'psycho-sociale', 'psycho-cognitive', 'neurosciences', 'psycho-clinique', 'psycho-differentielle', 'methodo-psycho', 'histoire-psychologie', 'psycho-travail', 'microeconomie', 'macroeconomie', 'maths-economie', 'statistiques', 'econometrie', 'comptabilite', 'gestion', 'histoire-economique', 'marketing', 'finance', 'economie-monetaire', 'economie-internationale', 'economie-publique', 'controle-de-gestion');
  IF n <> 60 THEN
    RAISE EXCEPTION 'Migration 606 : % matière(s) du supérieur sur 60', n;
  END IF;
  RAISE NOTICE 'Migration 606 OK : 60 matières du supérieur déclarées.';
END $sonde$;
