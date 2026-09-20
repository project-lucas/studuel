-- =============================================================================
-- Studuel — Migration 241 : le primaire (CP → CM2) et la voie technologique
--
-- L'app s'arrêtait au collège et au lycée général : 6e → Tle, sept classes.
-- Elle en compte QUATORZE, du CP à la Terminale, voie technologique comprise.
--
-- CE QUI CHANGE ICI, ET SEULEMENT ICI : le CATALOGUE DES MATIÈRES. Une matière
-- n'apparaît dans une classe que si `subjects.levels` contient ce niveau —
-- c'est le seul levier. Aucune table n'est créée, aucun chapitre n'est déplacé.
--
-- 1. LE PRIMAIRE (CP, CE1, CE2, CM1, CM2)
--    Les neuf enseignements du socle : français, mathématiques, langue vivante
--    (anglais), EPS, arts plastiques, éducation musicale, EMC, histoire-géo, et
--    « Sciences et technologie » — matière NEUVE, propre au primaire (au
--    collège, elle se sépare en SVT / physique-chimie / technologie). Espagnol
--    et allemand n'ouvrent qu'en CM1-CM2, comme les LV2 précoces.
--    Ces classes n'ont PAS ENCORE de chapitres : leurs matières s'afficheront
--    « Bientôt » sur Réviser, ce que l'app sait déjà faire (subject-visibility).
--
-- 2. LA VOIE TECHNOLOGIQUE (1re techno, Tle techno)
--    On lui déclare son tronc commun réel : français (1re) / philosophie (Tle),
--    histoire-géo, EMC, LVA + LVB, maths, EPS, arts, musique, grand oral.
--    Elle n'a NI enseignement scientifique NI les spécialités de la voie
--    générale (SES, NSI, HGGSP, SVT, physique-chimie, HLP, LLCER, SI) : ce sont
--    des enseignements de la voie générale, et les spécialités technologiques
--    dépendent de la série (STMG, STI2D, ST2S…), que le profil ne demande pas
--    encore. Elles viendront quand la série sera demandée à l'onboarding.
--
--    ATTENTION : le CONTENU de la techno n'est PAS dupliqué. Son tronc commun
--    EST celui de la voie générale, et reste rangé aux niveaux « 1re » / « Tle ».
--    L'app replie la classe sur son niveau général pour lire les chapitres
--    (`contentLevelFor`, lib/grades.ts). Ne PAS seeder de chapitres au niveau
--    « 1re techno » sans changer cette règle d'abord.
--
-- 3. LE GRAND ORAL devient une matière à part entière (il n'existait que comme
--    atelier chez Marcel). Sans chapitre pour l'instant, il affiche « Bientôt ».
--
-- PRÉREQUIS : 008 (subjects), 190, 191, 193. Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Les deux matières neuves
-- -----------------------------------------------------------------------------
INSERT INTO public.subjects (slug, name, icon, color, category, levels)
VALUES
  -- « Sciences et technologie » : l'unique matière scientifique du primaire.
  -- Elle ne monte PAS au collège, où SVT, physique-chimie et technologie
  -- prennent le relais, chacune avec son programme.
  ('sciences-technologie', 'Sciences et technologie', '🔬', 'green',
   'tronc_commun', '{CP,CE1,CE2,CM1,CM2}'),
  -- Le grand oral : épreuve terminale des DEUX voies, préparée dès la 1re.
  ('grand-oral', 'Grand oral', '🎤', 'pink',
   'tronc_commun', '{1re,"1re techno",Tle,"Tle techno"}')
ON CONFLICT (slug) DO UPDATE
  SET name = EXCLUDED.name, icon = EXCLUDED.icon, color = EXCLUDED.color,
      category = EXCLUDED.category, levels = EXCLUDED.levels;

-- -----------------------------------------------------------------------------
-- 2. Le socle commun : présent du CP à la Terminale, les deux voies comprises
-- -----------------------------------------------------------------------------

-- Histoire-géo, anglais, EMC, EPS : quatorze années sans interruption.
UPDATE public.subjects
   SET levels = '{CP,CE1,CE2,CM1,CM2,6e,5e,4e,3e,2de,1re,"1re techno",Tle,"Tle techno"}'
 WHERE slug IN ('histoire-geo', 'anglais', 'emc', 'sport');

-- Arts plastiques et éducation musicale : obligatoires jusqu'au collège,
-- optionnels au lycée, mais proposés partout.
UPDATE public.subjects
   SET levels = '{CP,CE1,CE2,CM1,CM2,6e,5e,4e,3e,2de,1re,"1re techno",Tle,"Tle techno"}'
 WHERE slug IN ('arts-plastiques', 'musique');

-- Les maths ne s'arrêtent jamais non plus, et restent au tronc commun de la
-- voie technologique. Leur catégorie `specialite` ne les range en « Mes
-- spécialités » qu'en 1re et Tle GÉNÉRALES : la techno affiche une grille
-- unique (lib/subject-groups), la catégorie y est sans effet.
UPDATE public.subjects
   SET levels = '{CP,CE1,CE2,CM1,CM2,6e,5e,4e,3e,2de,1re,"1re techno",Tle,"Tle techno"}'
 WHERE slug = 'maths';

-- Le français va du CP à la 1re, dans les deux voies. En Terminale, c'est la
-- philosophie qui prend le relais.
UPDATE public.subjects
   SET levels = '{CP,CE1,CE2,CM1,CM2,6e,5e,4e,3e,2de,1re,"1re techno"}'
 WHERE slug = 'francais';

-- La philosophie : tronc commun des DEUX Terminales.
UPDATE public.subjects SET levels = '{Tle,"Tle techno"}' WHERE slug = 'philosophie';

-- LV2 : première approche en CM1-CM2, puis de la 5e au bac, voie techno incluse.
UPDATE public.subjects
   SET levels = '{CM1,CM2,5e,4e,3e,2de,1re,"1re techno",Tle,"Tle techno"}'
 WHERE slug IN ('espagnol', 'allemand');

-- -----------------------------------------------------------------------------
-- 3. La culture générale suit toutes les classes
--    Ces matières rangent leur contenu à un niveau FIXE (`fixed_level = 'tous'`)
--    et déclarent tous les niveaux pour être proposées partout. Une classe
--    oubliée ici perdrait son bloc « Hors programme ».
-- -----------------------------------------------------------------------------
--    Les matières sont NOMMÉES plutôt que filtrées par `category = 'culture'` :
--    la garde qui rejoue ces migrations en test (lib/subject-catalogue.test.ts)
--    ne sait relire qu'un WHERE sur le slug. Un UPDATE qu'elle ne voit pas est
--    un UPDATE qu'elle ne vérifie pas.
UPDATE public.subjects
   SET levels = '{CP,CE1,CE2,CM1,CM2,6e,5e,4e,3e,2de,1re,"1re techno",Tle,"Tle techno"}'
 WHERE slug IN ('economie', 'fiscalite', 'finances-personnelles',
                'entrepreneuriat', 'figures-historiques');

-- -----------------------------------------------------------------------------
-- 4. Sonde : chaque classe doit proposer un programme plausible
-- -----------------------------------------------------------------------------
DO $sonde$
DECLARE
  g          text;
  n          integer;
  n_culture  integer;
  attendu    integer;
  manquantes text;
BEGIN
  -- Les matières des migrations précédentes doivent exister, sinon la 241 ment.
  SELECT string_agg(s, ', ') INTO manquantes
    FROM unnest(ARRAY['emc','sport','arts-plastiques','musique','philosophie']) AS s
   WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE slug = s);
  IF manquantes IS NOT NULL THEN
    RAISE EXCEPTION 'Migrations 191/193 non passees - matieres absentes : %', manquantes;
  END IF;

  FOREACH g IN ARRAY ARRAY['CP','CE1','CE2','CM1','CM2','6e','5e','4e','3e',
                           '2de','1re','1re techno','Tle','Tle techno'] LOOP
    SELECT count(*) INTO n
      FROM public.subjects
     WHERE category <> 'culture' AND levels @> ARRAY[g];

    SELECT count(*) INTO n_culture
      FROM public.subjects
     WHERE category = 'culture' AND levels @> ARRAY[g];

    -- Le primaire n'a que les neuf enseignements de son socle ; a partir de la
    -- 6e le programme se ramifie, et on en attend au moins dix.
    attendu := CASE WHEN g IN ('CP','CE1','CE2') THEN 9 ELSE 10 END;

    IF n < attendu THEN
      RAISE EXCEPTION 'Classe % : seulement % matiere(s) au programme (attendu %)',
        g, n, attendu;
    END IF;
    IF n_culture = 0 THEN
      RAISE EXCEPTION 'Classe % : aucune matiere de culture generale', g;
    END IF;
    RAISE NOTICE 'Classe % : % matieres au programme, % en culture generale.',
      g, n, n_culture;
  END LOOP;

  RAISE NOTICE 'Migration 241 OK - catalogue complet du CP a la Terminale, deux voies.';
END $sonde$;
