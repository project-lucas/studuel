-- Studuel — Migration 191 : 5 nouvelles matières scolaires
--                           (Allemand, Arts plastiques, Grec, Musique, Sport)
--
-- Leurs vignettes illustrées (lot v2) sont déjà dans
-- public/images/matieres/vignettes/<slug>.webp et branchées dans
-- lib/subject-style.ts — cette migration crée les matières correspondantes.
--
-- Choix de classement (mêmes conventions que 008) :
--   - allemand         : LV2, comme l'espagnol → tronc_commun, 5e→3e ;
--   - arts-plastiques  : matière du collège → college, 6e→3e ;
--   - grec             : langue ancienne, comme le latin → option, dès la 3e ;
--   - musique          : éducation musicale, collège → college, 6e→3e ;
--   - sport            : EPS, toutes classes → tronc_commun, 6e→Tle.
--
-- Les matières naissent SANS chapitre : leurs pages restent vides tant que le
-- contenu n'est pas créé (Studio /admin ou future migration de seed).
--
-- Idempotent (ON CONFLICT sur le slug). À exécuter à la main dans :
-- Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

INSERT INTO public.subjects (slug, name, icon, color, category, levels)
VALUES
  ('allemand',        'Allemand',        '🇩🇪', 'slate',  'tronc_commun', '{5e,4e,3e}'),
  ('arts-plastiques', 'Arts plastiques', '🎨', 'pink',   'college',      '{6e,5e,4e,3e}'),
  ('grec',            'Grec',            '🏺', 'yellow', 'option',       '{3e,2de,1re,Tle}'),
  ('musique',         'Musique',         '🎵', 'purple', 'college',      '{6e,5e,4e,3e}'),
  ('sport',           'Sport',           '⚽', 'green',  'tronc_commun', '{6e,5e,4e,3e,2de,1re,Tle}')
ON CONFLICT (slug) DO UPDATE
  SET name = EXCLUDED.name, icon = EXCLUDED.icon, color = EXCLUDED.color,
      category = EXCLUDED.category, levels = EXCLUDED.levels;

-- Sonde : les 5 slugs doivent exister.
DO $$
DECLARE
  n integer;
BEGIN
  SELECT count(*) INTO n FROM public.subjects
  WHERE slug IN ('allemand','arts-plastiques','grec','musique','sport');
  IF n <> 5 THEN
    RAISE EXCEPTION 'Migration 191 incomplète : % matière(s) sur 5', n;
  END IF;
  RAISE NOTICE 'Migration 191 OK : 5 matières en place.';
END $$;
