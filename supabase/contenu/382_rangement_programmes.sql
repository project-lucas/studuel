-- =============================================================================
-- Studuel — Migration 382 : RANGER CE QUI N'EST PAS (OU PLUS) AU PROGRAMME
--
-- CONSTAT MESURÉ (node _ASSOCIE/sonde-contenu.mjs, 26/09/2026) :
--  · Français 1re : les 30 fiches « Anciens programmes » s'affichaient DANS le
--    rayon Programme, mêlées aux quatre objets d'étude du bac. Et le programme
--    limitatif du bac 2027 (note de service du 4 juillet 2025, BO n° 30 du
--    24 juillet 2025) renouvelle l'objet « Le roman et le récit » : Manon
--    Lescaut, La Peau de chagrin et Sido sortent, Chrétien de Troyes (Le
--    Chevalier de la charrette), Zola (Pot-Bouille) et Simone Schwarz-Bart
--    (Pluie et vent sur Télumée Miracle) entrent (migration de contenu à part).
--  · 17 chapitres de lycée n'avaient aucun chapitre de programme (`theme`) :
--    ils tombaient dans une liste à plat sous les chapitres rangés.
--  · Langues : les fiches de langue vont recevoir, à côté d'elles, les axes
--    culturels du programme 2025 — deux rayons, « Langue » et « Culture ».
--
-- RIEN N'EST SUPPRIMÉ. Les œuvres des anciens programmes restent lisibles, dans
-- leur propre rayon (`chapters.discipline = 'anciens'`, onglet « Anciens
-- programmes » du dossier de français), rangées APRÈS les autres rayons
-- (positions 600+) : le rayon Programme ne montre plus que le programme.
--
-- ÉCRITURE PURE : aucune ligne créée ni supprimée, aucun UUID touché. Les
-- chapitres sont désignés par leur clé naturelle (matière, niveau, titre) ou par
-- leur identifiant quand deux niveaux portent le même titre. Idempotent : chaque
-- UPDATE est gardé par IS DISTINCT FROM. Rejouable sans risque.
--
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- 1. Français 1re : les œuvres sorties du programme rejoignent les anciens ----
UPDATE public.chapters c
   SET theme = 'Anciens programmes'
  FROM public.subjects s
 WHERE s.id = c.subject_id AND s.slug = 'francais' AND c.level = '1re'
   AND c.title IN (
     'Manon Lescaut',
     'La peau de chagrin',
     'La peau de chagrin - Partie 2',
     'Sido, suivi de Les Vrilles de la vigne',
     'Sido, suivi de Les Vrilles de la vigne - Partie 2'
   )
   AND c.theme IS DISTINCT FROM 'Anciens programmes';

-- 2. Français 1re : les anciens programmes ont leur rayon, après les autres -----
UPDATE public.chapters c
   SET discipline = 'anciens',
       position   = CASE WHEN c.position < 600 THEN c.position + 600 ELSE c.position END
  FROM public.subjects s
 WHERE s.id = c.subject_id AND s.slug = 'francais' AND c.level = '1re'
   AND c.theme = 'Anciens programmes'
   AND (c.discipline IS DISTINCT FROM 'anciens' OR c.position < 600);

-- 3. Langues : les fiches existantes forment le rayon « Langue » ---------------
-- Seulement aux niveaux où arrivent les axes culturels (rayon « Culture »).
UPDATE public.chapters c
   SET discipline = 'langue'
  FROM public.subjects s
 WHERE s.id = c.subject_id
   AND (
     (s.slug IN ('anglais', 'espagnol') AND c.level IN ('2de', '1re', 'Tle'))
     OR (s.slug = 'allemand' AND c.level IN ('3e', '2de', '1re', 'Tle'))
   )
   AND c.title <> 'Le monde hispanique aujourd’hui'
   AND c.discipline IS NULL;

-- L'espagnol avait déjà une fiche de civilisation : elle passe en Culture.
UPDATE public.chapters c
   SET discipline = 'culture', theme = 'Repères culturels'
  FROM public.subjects s
 WHERE s.id = c.subject_id AND s.slug = 'espagnol' AND c.level IN ('2de', '1re', 'Tle')
   AND c.title = 'Le monde hispanique aujourd’hui'
   AND (c.discipline IS DISTINCT FROM 'culture' OR c.theme IS DISTINCT FROM 'Repères culturels');

-- 4. Les chapitres sans chapitre de programme --------------------------------
UPDATE public.chapters c
   SET theme = v.theme
  FROM (VALUES
    -- SNT 2de : les sept thèmes du programme, nommés par leur verbe dans l'app
    ('snt', '2de', 'Internet', 'Connecter'),
    ('snt', '2de', 'Le Web', 'Naviguer'),
    ('snt', '2de', 'Les réseaux sociaux', 'Rassembler'),
    ('snt', '2de', 'Les données structurées', 'Mémoriser et traiter'),
    ('snt', '2de', 'Localisation et photographie numérique', 'Cartographier'),
    -- Espagnol, lycée : deux fiches de langue rejoignent leur chapitre
    ('espagnol', '2de', 'Les temps du passé', 'Les temps'),
    ('espagnol', '1re', 'Les temps du passé', 'Les temps'),
    ('espagnol', 'Tle', 'Les temps du passé', 'Les temps'),
    ('espagnol', '2de', 'Ser, estar et les tournures essentielles', 'Le groupe verbal'),
    ('espagnol', '1re', 'Ser, estar et les tournures essentielles', 'Le groupe verbal'),
    ('espagnol', 'Tle', 'Ser, estar et les tournures essentielles', 'Le groupe verbal'),
    -- HLP : les fiches d'ouverture de semestre rejoignent leur première période
    ('hlp', '1re', 'Les pouvoirs de la parole', 'L’art de la parole'),
    ('hlp', '1re', 'Les représentations du monde', 'Découverte du monde et rencontre des cultures'),
    ('hlp', '1re', 'Lire, analyser, écrire', 'Méthode de l’épreuve'),
    ('hlp', 'Tle', 'La recherche de soi', 'Éducation, transmission et émancipation'),
    ('hlp', 'Tle', 'L’Humanité en question', 'Création, continuités et ruptures'),
    ('hlp', 'Tle', 'Méthode de l’épreuve', 'Méthode de l’épreuve'),
    -- SI 1re : les trois fiches de synthèse rejoignent le chapitre qu'elles ouvrent
    ('si', '1re', 'Analyser un système', 'Analyse du besoin'),
    ('si', '1re', 'Énergie et mécanique', 'Statique du solide indéformable'),
    ('si', '1re', 'Information, capteurs et programmation', 'Transfert de l’information'),
    -- Maths complémentaires Tle : les deux parties du programme
    ('maths-complementaires', 'Tle', 'Suites et modèles d’évolution', 'Analyse'),
    ('maths-complementaires', 'Tle', 'Fonctions, dérivées et optimisation', 'Analyse'),
    ('maths-complementaires', 'Tle', 'Probabilités conditionnelles', 'Probabilités et statistique'),
    ('maths-complementaires', 'Tle', 'Statistiques et échantillonnage', 'Probabilités et statistique')
  ) AS v(slug, level, title, theme)
  JOIN public.subjects s ON s.slug = v.slug
 WHERE c.subject_id = s.id AND c.level = v.level AND c.title = v.title
   AND c.theme IS NULL;

-- 5. Sonde finale ------------------------------------------------------------
DO $$
DECLARE
  n_anciens_programme integer;
  n_sans_theme        integer;
BEGIN
  SELECT count(*) INTO n_anciens_programme
    FROM public.chapters c JOIN public.subjects s ON s.id = c.subject_id
   WHERE s.slug = 'francais' AND c.level = '1re'
     AND c.theme = 'Anciens programmes' AND c.discipline = 'programme';
  SELECT count(*) INTO n_sans_theme
    FROM public.chapters c JOIN public.subjects s ON s.id = c.subject_id
   WHERE s.slug IN ('snt', 'hlp', 'maths-complementaires') AND c.theme IS NULL;
  RAISE NOTICE 'Migration 382 : % ancien(s) programme(s) encore dans le rayon Programme (attendu 0), % chapitre(s) SNT/HLP/maths compl. sans thème (attendu 0).',
    n_anciens_programme, n_sans_theme;
END $$;
