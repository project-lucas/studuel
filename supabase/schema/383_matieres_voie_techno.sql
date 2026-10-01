-- =============================================================================
-- Studuel — Migration 383 : LES ENSEIGNEMENTS PROPRES À LA VOIE TECHNOLOGIQUE
--
-- CONSTAT (26/09/2026) : la 1re techno et la Tle techno (migration 241) lisaient
-- le contenu de la voie générale (alias `contentLevelFor`, lib/grades.ts) et
-- aucune de leurs spécialités n'existait. Un élève de STMG ou de STI2D ne
-- trouvait ni son management, ni son droit-économie, ni sa 2I2D ; et la
-- philosophie qu'on lui servait était celle de la voie générale, alors que son
-- programme (et son épreuve) sont les siens.
--
-- CE QUE FAIT CETTE MIGRATION : elle déclare les enseignements propres à la
-- voie technologique, chacun pour les seules classes techno qui le suivent. Un
-- élève de la voie générale ne les voit donc jamais (le filtre est
-- `subjects.levels`). Leur CONTENU est rangé, comme tout le contenu techno, au
-- niveau général correspondant (« 1re », « Tle ») : c'est `contentLevelFor` qui
-- fait le lien. Les chapitres arrivent par les migrations de contenu qui
-- suivent ; tant qu'elles manquent, ces matières s'affichent « Bientôt ».
--
--   · tronc commun : philosophie (programme techno), mathématiques (tronc
--     commun techno), histoire-géographie (programme techno) ;
--   · STMG, STI2D, ST2S, STL : leurs enseignements de spécialité.
--
-- Les séries STD2A, STHR, S2TMD et STAV ne sont pas encore couvertes.
-- RIEN N'EST SUPPRIMÉ : la philosophie, les maths et l'histoire-géographie de la
-- voie générale gardent leurs niveaux ; le choix proposé à l'élève techno
-- (lib/programme-classes.ts) passe simplement à ses propres enseignements.
--
-- Idempotent (ON CONFLICT (slug) DO UPDATE). À exécuter AVANT les migrations de
-- contenu de la voie techno. Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

INSERT INTO public.subjects (slug, name, icon, color, category, levels)
VALUES
  -- Tronc commun de la voie technologique
  ('philosophie-techno', 'Philosophie', '🧠', 'indigo', 'tronc_commun', '{"Tle techno"}'),
  ('maths-techno', 'Mathématiques', '📐', 'blue', 'tronc_commun', '{"1re techno","Tle techno"}'),
  ('histoire-geo-techno', 'Histoire-géographie', '🌍', 'orange', 'tronc_commun', '{"1re techno","Tle techno"}'),
  -- STMG
  ('sciences-gestion-numerique', 'Sciences de gestion et numérique (STMG)', '📊', 'teal', 'specialite', '{"1re techno"}'),
  ('management', 'Management (STMG)', '📈', 'teal', 'specialite', '{"1re techno"}'),
  ('droit-economie', 'Droit et économie (STMG)', '⚖️', 'slate', 'specialite', '{"1re techno","Tle techno"}'),
  ('management-sgn', 'Management, sciences de gestion et numérique (STMG)', '📈', 'teal', 'specialite', '{"Tle techno"}'),
  -- STI2D
  ('innovation-technologique', 'Innovation technologique (STI2D)', '💡', 'yellow', 'specialite', '{"1re techno"}'),
  ('ingenierie-dd', 'Ingénierie et développement durable (STI2D)', '⚙️', 'green', 'specialite', '{"1re techno"}'),
  ('i2d', 'Ingénierie, innovation et développement durable (STI2D)', '⚙️', 'green', 'specialite', '{"Tle techno"}'),
  ('physique-chimie-maths', 'Physique-chimie et mathématiques (STI2D · STL)', '⚗️', 'purple', 'specialite', '{"1re techno","Tle techno"}'),
  -- ST2S
  ('physique-chimie-sante', 'Physique-chimie pour la santé (ST2S)', '⚗️', 'purple', 'specialite', '{"1re techno"}'),
  ('biologie-physiopathologie', 'Biologie et physiopathologie humaines (ST2S)', '🫀', 'red', 'specialite', '{"1re techno"}'),
  ('sciences-sanitaires-sociales', 'Sciences et techniques sanitaires et sociales (ST2S)', '🤝', 'pink', 'specialite', '{"1re techno","Tle techno"}'),
  ('chimie-biologie-physiopathologie', 'Chimie, biologie et physiopathologie humaines (ST2S)', '🫀', 'red', 'specialite', '{"Tle techno"}'),
  -- STL
  ('biochimie-biologie', 'Biochimie-biologie (STL)', '🧬', 'green', 'specialite', '{"1re techno"}'),
  ('biotechnologies', 'Biotechnologies (STL)', '🧫', 'teal', 'specialite', '{"1re techno"}'),
  ('spcl', 'Sciences physiques et chimiques en laboratoire (STL)', '🧪', 'purple', 'specialite', '{"1re techno","Tle techno"}'),
  ('biochimie-biologie-biotechnologie', 'Biochimie, biologie et biotechnologie (STL)', '🧬', 'green', 'specialite', '{"Tle techno"}')
ON CONFLICT (slug) DO UPDATE
  SET name = EXCLUDED.name, icon = EXCLUDED.icon, color = EXCLUDED.color,
      category = EXCLUDED.category, levels = EXCLUDED.levels;

DO $sonde$
DECLARE
  n integer;
BEGIN
  SELECT count(*) INTO n FROM public.subjects
   WHERE slug IN ('philosophie-techno', 'maths-techno', 'histoire-geo-techno',
                  'sciences-gestion-numerique', 'management', 'droit-economie', 'management-sgn',
                  'innovation-technologique', 'ingenierie-dd', 'i2d', 'physique-chimie-maths',
                  'physique-chimie-sante', 'biologie-physiopathologie',
                  'sciences-sanitaires-sociales', 'chimie-biologie-physiopathologie',
                  'biochimie-biologie', 'biotechnologies', 'spcl',
                  'biochimie-biologie-biotechnologie');
  IF n <> 19 THEN
    RAISE EXCEPTION 'Migration 383 : % matière(s) techno sur 19', n;
  END IF;
  RAISE NOTICE 'Migration 383 OK : 19 enseignements de la voie technologique déclarés.';
END $sonde$;
