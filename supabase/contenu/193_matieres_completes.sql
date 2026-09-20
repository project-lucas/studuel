-- =============================================================================
-- Studuel — Migration 193 : le catalogue COMPLET des matières, de la 6e à la Tle
--
-- Constat : en choisissant « 6e » dans Ma classe, l'élève ne voyait pas Sport,
-- ni Musique, ni Arts plastiques, ni EMC. Une matière n'apparaît dans une classe
-- que si `subjects.levels` contient ce niveau (cf. app/reviser/page.tsx :
-- `subjects.filter(s => s.levels.includes(grade))`) — il manquait donc à la fois
-- des matières et des niveaux sur des matières existantes.
--
-- Cette migration met le catalogue au niveau des programmes de l'Éducation
-- nationale. Elle fait TROIS choses :
--   1. crée les 6 matières qui manquaient (EMC, SNT, HLP, LLCER, SI, Maths
--      complémentaires) ;
--   2. étend les niveaux des matières qui s'arrêtaient trop tôt (les LV2 et les
--      langues anciennes continuent au lycée ; techno et physique-chimie
--      existent dès la 6e via « Sciences et technologie ») ;
--   3. ne touche à AUCUN chapitre. Les matières naissent vides — le contenu se
--      remplira au Studio /admin ou par une migration de seed ultérieure. La
--      page matière fonctionne quand même : elle affiche son template et un
--      programme vide.
--
-- PRÉREQUIS : migration 191 (Allemand, Arts plastiques, Grec, Musique, Sport).
--             Si elle n'est pas passée, la sonde finale le dira.
--
-- Note sur `category` : l'app ne s'en sert que pour deux choses — isoler la
-- culture générale (`culture`) et sous-grouper le LYCÉE en tronc commun /
-- spécialités / options. Au collège elle est ignorée (grille unique). C'est
-- pourquoi Arts plastiques et Musique passent en `option` : au collège ça ne
-- change rien à l'affichage, et au lycée c'est exactement leur statut
-- (enseignement optionnel).
--
-- Idempotent. À exécuter à la main dans :
-- Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Les matières manquantes
-- -----------------------------------------------------------------------------
INSERT INTO public.subjects (slug, name, icon, color, category, levels)
VALUES
  -- Enseignement moral et civique : de la 6e à la Terminale, sans exception.
  ('emc', 'EMC', '⚖️', 'teal', 'tronc_commun', '{6e,5e,4e,3e,2de,1re,Tle}'),
  -- Sciences numériques et technologie : tronc commun de 2de, elle seule.
  ('snt', 'SNT', '🖥️', 'slate', 'tronc_commun', '{2de}'),
  -- Humanités, littérature et philosophie : spécialité de 1re et Tle.
  ('hlp', 'HLP', '📜', 'pink', 'specialite', '{1re,Tle}'),
  -- Langues, littératures et cultures étrangères (anglais).
  ('llcer-anglais', 'LLCER Anglais', '🎭', 'indigo', 'specialite', '{1re,Tle}'),
  -- Sciences de l'ingénieur.
  ('si', 'Sciences de l''ingénieur', '⚙️', 'blue', 'specialite', '{1re,Tle}'),
  -- Maths complémentaires : option de Tle, pour ceux qui ont lâché la spé.
  ('maths-complementaires', 'Maths complémentaires', '➗', 'blue', 'option', '{Tle}')
ON CONFLICT (slug) DO UPDATE
  SET name = EXCLUDED.name, icon = EXCLUDED.icon, color = EXCLUDED.color,
      category = EXCLUDED.category, levels = EXCLUDED.levels;

-- -----------------------------------------------------------------------------
-- 2. Les niveaux qui manquaient sur des matières existantes
-- -----------------------------------------------------------------------------

-- LV2 : elles commencent en 5e et ne s'arrêtent pas au brevet.
UPDATE public.subjects SET levels = '{5e,4e,3e,2de,1re,Tle}'
 WHERE slug IN ('espagnol', 'allemand');

-- Langues anciennes : option continue du collège au lycée.
UPDATE public.subjects SET levels = '{5e,4e,3e,2de,1re,Tle}' WHERE slug = 'latin';
UPDATE public.subjects SET levels = '{3e,2de,1re,Tle}'      WHERE slug = 'grec';

-- Arts plastiques et Musique : obligatoires au collège, optionnels au lycée.
-- Le passage en `option` ne change rien au collège (catégorie ignorée) et les
-- range au bon endroit au lycée.
UPDATE public.subjects
   SET levels = '{6e,5e,4e,3e,2de,1re,Tle}', category = 'option'
 WHERE slug IN ('arts-plastiques', 'musique');

-- En 6e, « Sciences et technologie » couvre SVT + physique-chimie + techno.
-- SVT est déjà en 6e (avec ses chapitres) : on aligne les deux autres plutôt
-- que de créer une matière fourre-tout qui ferait doublon avec SVT 6e.
UPDATE public.subjects SET levels = '{6e,5e,4e,3e,2de,1re,Tle}'
 WHERE slug = 'physique-chimie';
UPDATE public.subjects SET levels = '{6e,5e,4e,3e}' WHERE slug = 'technologie';

-- -----------------------------------------------------------------------------
-- 3. Sonde : chaque classe doit proposer un nombre plausible de matières
-- -----------------------------------------------------------------------------
DO $$
DECLARE
  g            text;
  n            integer;
  manquantes   text;
  minimum      integer := 8; -- en dessous, c'est qu'une migration n'est pas passée
BEGIN
  -- Les matières attendues par la 191 doivent exister, sinon la 193 ment.
  SELECT string_agg(s, ', ') INTO manquantes
    FROM unnest(ARRAY['allemand','arts-plastiques','grec','musique','sport']) AS s
   WHERE NOT EXISTS (SELECT 1 FROM public.subjects WHERE slug = s);
  IF manquantes IS NOT NULL THEN
    RAISE EXCEPTION 'Migration 191 non passée — matières absentes : %', manquantes;
  END IF;

  FOREACH g IN ARRAY ARRAY['6e','5e','4e','3e','2de','1re','Tle'] LOOP
    SELECT count(*) INTO n
      FROM public.subjects
     WHERE category <> 'culture' AND levels @> ARRAY[g];
    IF n < minimum THEN
      RAISE EXCEPTION 'Classe % : seulement % matière(s) au programme', g, n;
    END IF;
    RAISE NOTICE 'Classe % : % matières au programme.', g, n;
  END LOOP;

  RAISE NOTICE 'Migration 193 OK — catalogue complet de la 6e à la Terminale.';
END $$;
