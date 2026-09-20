-- =============================================================================
-- Studuel — Migration 328 : FRANÇAIS 6e — LE PROGRAMME COMPLET (10 fiches)
--
-- ⚠️ FICHIER GÉNÉRÉ — ne pas éditer à la main.
--    Source : scripts/contenu/*.mjs
--    Regénérer : node scripts/seed-contenu.mjs --num 328 --modules francais-6e
--
-- CONSTAT : le français de 6e n'avait que les 5 fiches du premier jeu de données de
-- l'app — « Le conte merveilleux », « Récits d'aventures », « Poésie : jeux de
-- langage », « Le groupe nominal et ses accords », « Conjugaison : présent et
-- imparfait ». Un élève qui préparait un contrôle sur les récits de création, sur
-- Molière ou sur la poésie du programme ne trouvait RIEN. Cette migration installe
-- les 10 fiches, rangées sous les 3 chapitres de la maquette, et retire les 5
-- fiches génériques.
-- LE DÉCOUPAGE SUIT LES QUESTIONNEMENTS DU BO, pas les genres : le programme de
-- cycle 3 est une suite d'entrées thématiques adossées à des œuvres, d'où des
-- titres de fiches qui nomment des œuvres. La langue n'est pas pour autant absente
-- — elle est traitée dans le cours de chaque fiche, là où l'œuvre l'appelle.
--
-- Cette migration apporte : 10 chapitres, 10 leçons,
-- 10 quiz et 80 questions, sur 1 matière.
--
-- CHOIX ASSUMÉS :
--  · tous les quiz sont `is_free = true`. Aucun compte ne peut aujourd’hui
--    passer `tier1` (aucun paiement n’existe), donc un quiz payant serait un
--    quiz INVISIBLE pour 100 % des élèves — le contraire du but ;
--  · chaque cours porte des sections `##`, ce qui rend sa carte mentale
--    dérivable (cf. lib/mind-map-auto) : aucune tuile ne promet dans le vide.
--
-- Idempotent : les UUID sont dérivés du contenu (SHA-1), donc stables ; les
-- INSERT sont tous gardés par ON CONFLICT DO NOTHING. Rejouable sans risque.
--
-- PRÉREQUIS : 002, 008, 191, 193 exécutées (les matières doivent exister).
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- 0. Ménage ----------------------------------------------------------------
-- [francais] La colonne chapters.theme (migration 234) conditionne tout ce qui suit : ce
-- [francais] module range ses 10 fiches sous 3 chapitres, et l'INSERT écrit la colonne. Elle
-- [francais] est REPRISE ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut pas garantir que
-- [francais] la 234 soit passée en production — sans cette reprise, la migration échouerait
-- [francais] sur "column chapters.theme does not exist", les 5 anciens chapitres déjà
-- [francais] supprimés et les 10 neufs pas encore posés : une matière vide.
-- [francais] Le ménage qui suit LIT cette colonne : elle doit exister avant lui.
-- [francais] Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
-- [francais] chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne.
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;

-- [francais] Les 5 chapitres hérités de la 008 partent, au niveau 6e SEULEMENT.
-- [francais] 
-- [francais] LE REPÈRE EST theme IS NULL, PAS LE TITRE : le critère « pas de chapitre de
-- [francais] programme » vise exactement les cinq lignes voulues. Elles datent de la 008, bien
-- [francais] avant la colonne theme, tandis que les 10 fiches neuves en portent une dès
-- [francais] l'INSERT — le ménage tourne AVANT les insertions et ne peut donc jamais mordre
-- [francais] sur elles, ni au premier passage ni au rejeu.
-- [francais] Le filtre level = '6e' est indispensable : le français existe sur sept niveaux,
-- [francais] et chacun a sa propre migration.
-- [francais] L'ordre compte : la file "À revoir" d'abord (review_items.item_id n'a PAS de clé
-- [francais] étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL), puis les
-- [francais] chapitres, dont les leçons partent en cascade.
DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'francais'
   AND c.level = '6e'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'francais'
   AND c.level = '6e'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'francais'
   AND c.level = '6e'
   AND c.theme IS NULL;

-- 1. Chapitres -------------------------------------------------------------
-- Jointure sur le SLUG (et non le nom) : c’est la clé stable de `subjects`.
INSERT INTO public.chapters (id, subject_id, level, title, position, theme)
SELECT v.id, s.id, v.level, v.title, v.position, v.theme
  FROM (VALUES
    ('8f69c9d1-7cdd-5e7e-b37d-ff57ba7a4e4b'::uuid, 'francais', '6e', 'Créer, recréer le monde : récits des origines dans les différentes religions monothéistes', 1, 'Créer, recréer le monde : récit des origines'),
    ('1f0ed8c8-b29a-5bd3-89ab-46dee89079f5'::uuid, 'francais', '6e', 'Création et recréation du monde dans les différentes religions polythéistes', 2, 'Créer, recréer le monde : récit des origines'),
    ('26e5fcc3-931a-5cc7-8118-27f00ecde058'::uuid, 'francais', '6e', 'Un conte étiologique : « Comment le chameau eut sa bosse », Histoires comme ça, de Rudyard Kipling', 3, 'Créer, recréer le monde : récit des origines'),
    ('ac165b13-446f-5097-bc4c-887ba7eef21e'::uuid, 'francais', '6e', 'Créer une autre manière de s’exprimer grâce à la poésie', 4, 'Chanter et enchanter le monde : mots et merveilles'),
    ('64df3209-e4e8-548e-a89f-fb120625e366'::uuid, 'francais', '6e', 'La poésie pour chanter et enchanter le monde', 5, 'Chanter et enchanter le monde : mots et merveilles'),
    ('5a396493-5b55-5ed9-8879-3481b3d8fdda'::uuid, 'francais', '6e', 'Jeux d’ani-mots : Jacques Roubaud, Les Animaux de tout le monde', 6, 'Chanter et enchanter le monde : mots et merveilles'),
    ('90d6b904-720c-518a-ba2f-3826e18909db'::uuid, 'francais', '6e', 'Le Médecin malgré lui, Molière', 7, 'Se masquer, jouer, déjouer : ruses en action'),
    ('663aaaa7-2515-599e-84c4-9184cf6eb0bd'::uuid, 'francais', '6e', 'Les Fourberies de Scapin, Molière', 8, 'Se masquer, jouer, déjouer : ruses en action'),
    ('e77034bb-2c62-5e62-8c94-b3d3a29313a2'::uuid, 'francais', '6e', 'Le théâtre, un art de l’illusion ?', 9, 'Se masquer, jouer, déjouer : ruses en action'),
    ('fd7d8ba4-d56d-5ba6-990f-6b6f69cbb3ae'::uuid, 'francais', '6e', 'Le Petit Chaperon Rouge de Joël Pommerat', 10, 'Se masquer, jouer, déjouer : ruses en action')
  ) AS v(id, slug, level, title, position, theme)
  JOIN public.subjects s ON s.slug = v.slug
-- ON CONFLICT NU : `chapters` porte aussi UNIQUE(subject_id, level, title).
ON CONFLICT DO NOTHING;

-- 1 bis. Axes du programme -------------------------------------------------
-- `chapters.theme` (migration 234) : l’intitulé du programme officiel qui
-- coiffe le chapitre. La page matière s’en sert pour grouper au lieu
-- d’aligner 28 lignes à plat. UPDATE et non INSERT : le chapitre peut déjà
-- exister (l’INSERT précédent l’aurait alors ignoré).
UPDATE public.chapters c SET theme = v.theme
  FROM (VALUES
    ('8f69c9d1-7cdd-5e7e-b37d-ff57ba7a4e4b'::uuid, 'Créer, recréer le monde : récit des origines'),
    ('1f0ed8c8-b29a-5bd3-89ab-46dee89079f5'::uuid, 'Créer, recréer le monde : récit des origines'),
    ('26e5fcc3-931a-5cc7-8118-27f00ecde058'::uuid, 'Créer, recréer le monde : récit des origines'),
    ('ac165b13-446f-5097-bc4c-887ba7eef21e'::uuid, 'Chanter et enchanter le monde : mots et merveilles'),
    ('64df3209-e4e8-548e-a89f-fb120625e366'::uuid, 'Chanter et enchanter le monde : mots et merveilles'),
    ('5a396493-5b55-5ed9-8879-3481b3d8fdda'::uuid, 'Chanter et enchanter le monde : mots et merveilles'),
    ('90d6b904-720c-518a-ba2f-3826e18909db'::uuid, 'Se masquer, jouer, déjouer : ruses en action'),
    ('663aaaa7-2515-599e-84c4-9184cf6eb0bd'::uuid, 'Se masquer, jouer, déjouer : ruses en action'),
    ('e77034bb-2c62-5e62-8c94-b3d3a29313a2'::uuid, 'Se masquer, jouer, déjouer : ruses en action'),
    ('fd7d8ba4-d56d-5ba6-990f-6b6f69cbb3ae'::uuid, 'Se masquer, jouer, déjouer : ruses en action')
  ) AS v(id, theme)
 WHERE c.id = v.id AND c.theme IS DISTINCT FROM v.theme;

-- 2. Leçons ----------------------------------------------------------------
INSERT INTO public.lessons (id, chapter_id, title, content, position) VALUES
  ('1cdbd7b9-bac3-51d3-8ff8-efe277c4569f', '8f69c9d1-7cdd-5e7e-b37d-ff57ba7a4e4b', 'La Genèse, et ce qu’un récit de création raconte', E'Toutes les cultures ont cherché à répondre à la même question : d’où vient le monde ? Ces réponses s’appellent des cosmogonies.\n\n## Le récit de la Genèse\nLa Bible s’ouvre sur la création en **sept jours** — six jours d’action, un jour de repos.\n\n= Monothéiste = monos (seul) + theos (dieu)\n\nCe récit est partagé, avec des variantes, par les trois monothéismes : **judaïsme**, **christianisme**, **islam**.\n\n## Ce qui fait sa force d’écriture\n| Le procédé | Ce qu’il produit |\n| La **répétition** | « Dieu dit… et cela fut ainsi », reprise à chaque étape : un **rythme** solennel |\n| La **progression** | Du plus général — la lumière, le ciel — au plus particulier : les animaux, l’humain |\n| La **parole créatrice** | Ici, **dire suffit à faire exister**. C’est un choix littéraire fort |\n\nLe **déluge** est un récit de **re**-création : le monde est effacé, puis recommencé avec Noé.\n\n## Les outils de la langue du récit\n| Le temps | Ce qu’il fait | Exemple |\n| Le **passé simple** | Les actions principales, achevées | *il créa*, *il sépara* |\n| L’**imparfait** | Le décor et l’état des choses | *la terre était informe* |\n| Les **connecteurs de temps** | Ils organisent | *au commencement*, *puis*, *le septième jour* |\n\n> Le passé simple fait **avancer** l’histoire ; l’imparfait **installe le décor**. C’est la répartition à retenir pour tout récit.\n\n## Lire ces textes en classe\n!> On les étudie comme des **textes fondateurs** : des œuvres littéraires qui ont façonné la culture, les arts et la langue. On y cherche la **construction** et les **images**, pas une vérité scientifique — ce n’est pas le même terrain.', 1),
  ('8dd9d5c2-31aa-5333-ad37-b78caabafbfa', '1f0ed8c8-b29a-5bd3-89ab-46dee89079f5', 'Quand les dieux sont nombreux', E'Chez les Grecs, le monde ne naît pas d’une parole : il naît d’une succession de générations et de conflits de famille.\n\n## La cosmogonie grecque\n~ Le Chaos → Gaïa (la Terre) et Ouranos (le Ciel) → Cronos renverse son père → Zeus renverse Cronos\n\nC’est le récit d’**Hésiode**, dans *La Théogonie*. Zeus s’installe alors sur l’**Olympe** avec les douze dieux.\n\n## Ce qui distingue ces récits\n| Chez les polythéistes | Chez les monothéistes |\n| Les dieux sont **anthropomorphes** : corps, caractère, défauts humains | Un dieu unique, sans image |\n| Le monde naît d’une **succession de générations** | Le monde naît d’une **parole** |\n| Chaque dieu a son **domaine** | |\n\n= Polythéiste = poly (nombreux) + theos (dieu)\n\n| Le dieu | Son domaine |\n| **Zeus** | Le ciel |\n| **Poséidon** | La mer |\n| **Hadès** | Les Enfers |\n| **Athéna** | La sagesse |\n| **Arès** | La guerre |\n\n## Les grands mythes qui en découlent\n| Le mythe | Ce qu’il raconte |\n| **Prométhée** | Il vole le feu pour les humains, et sera puni : le savoir conquis contre les dieux |\n| **Pandore** | Elle ouvre la jarre d’où s’échappent les maux, ne laissant que l’espérance |\n| Le **déluge** | Il existe aussi chez les Grecs (Deucalion) et chez les Mésopotamiens |\n\n!> *L’Épopée de Gilgamesh*, qui contient un déluge, est **bien plus ancienne que la Bible**. Le même motif traverse des cultures qui ne se connaissaient pas.\n\n> C’est ce qui rend ces récits passionnants à **comparer** plutôt qu’à classer.\n\n## Ce que ces récits nous laissent\n| Le mot | Son origine |\n| *panique* | Le dieu **Pan** |\n| *narcissique* | **Narcisse** |\n| *titanesque* | Les **Titans** |\n| *olympien* | L’**Olympe** |\n| *dédale* | **Dédale**, l’architecte du labyrinthe |', 1),
  ('f54a5ea9-99aa-5bfb-9681-f68818981500', '26e5fcc3-931a-5cc7-8118-27f00ecde058', 'Le conte qui explique pourquoi', E'Un conte étiologique explique pourquoi une chose est comme elle est. En vérité, il fait semblant d’expliquer — et c’est le jeu qui plaît.\n\n## De quoi il s’agit\n= Étiologique vient du grec aitia, la cause\n\nPourquoi le chameau a une bosse, pourquoi la mer est salée, pourquoi le léopard a des taches.\n\n## L’histoire de Kipling\nDans *Histoires comme ça* (**1902**), **Rudyard Kipling** raconte un chameau paresseux qui refuse de travailler et répond toujours « **Bof !** ».\n\n~ Le chameau dit « Bof » → le Djinn du désert le punit → le « Bof » se change en BOSSE → elle lui permettra de travailler trois jours sans manger\n\n## La structure, toujours la même\n1. Une **situation initiale** où la chose n’existe pas encore ;\n2. un **événement** — une faute, une ruse, une punition ;\n3. une **situation finale** qui explique l’état actuel.\n\n!> Cette situation finale vaut **pour toujours** et pour **toute l’espèce**. Ce n’est pas ce chameau-ci qui a une bosse : ce sont tous les chameaux, depuis ce jour.\n\n## Le ton de Kipling\n| Le procédé | Son effet |\n| L’**apostrophe** : « Ô Bien-Aimé » | Il s’adresse **directement** au lecteur |\n| Les **répétitions** et les mots inventés | On entend une voix de conteur |\n| L’**humour** | La morale n’est pas assenée, elle est glissée dans le rire |\n\n> Le conte étiologique n’explique pas vraiment : il **fait semblant** d’expliquer.\n\n## Écrire le sien\n~ Choisir une particularité animale → inventer la faute → inventer la sanction → écrire au passé simple et à l’imparfait → clore par « et depuis ce jour… »', 1),
  ('22799687-5396-5698-b43a-2811ac14ecbd', 'ac165b13-446f-5097-bc4c-887ba7eef21e', 'Les outils du poète', E'La poésie ne dit pas les choses autrement pour compliquer : elle les dit autrement pour les faire voir et entendre.\n\n## Le vers et la strophe\n| Le vers | Ses syllabes |\n| **Octosyllabe** | 8 |\n| **Décasyllabe** | 10 |\n| **Alexandrin** | **12** — le vers le plus célèbre de la poésie française |\n\n| La strophe | Ses vers |\n| **Distique** | 2 |\n| **Tercet** | 3 |\n| **Quatrain** | 4 |\n\n## La rime\n| La disposition | Son schéma |\n| **Suivies** (ou plates) | AABB |\n| **Croisées** | ABAB |\n| **Embrassées** | ABBA |\n\n## Les images\n| L’image | Sa définition | Exemple |\n| La **comparaison** | Deux éléments rapprochés par un **outil** — comme, tel, semblable à | Il est fort **comme** un lion |\n| La **métaphore** | La même image, **sans outil** | C’est un lion |\n| La **personnification** | On prête à une chose des traits humains | Le vent **murmure** |\n\n!> **La différence entre comparaison et métaphore tient à un seul mot** : l’outil de comparaison. C’est le piège classique des contrôles.\n\n## Les jeux de sons\n| Le procédé | Ce qui se répète | Exemple |\n| L’**allitération** | Des **consonnes** | *Pour qui sont ces serpents qui sifflent sur nos têtes ?* |\n| L’**assonance** | Des **voyelles** | |\n\n> Ces répétitions créent une musique qui **imite** parfois ce que le texte décrit.\n\n## La poésie libre\nDepuis le XIXe siècle, les poètes s’affranchissent des règles : **vers libres** sans compte fixe, **calligrammes** dont la forme dessine le sujet — **Apollinaire**.\n\n> La contrainte disparaît ; l’intention reste.', 1),
  ('c3240f3e-9210-51fc-bf23-cfd1d8a05db2', '64df3209-e4e8-548e-a89f-fb120625e366', 'Célébrer, émerveiller, transformer', E'« Lyrique » vient de la lyre, l’instrument d’Orphée. Le mot dit lui-même que le poème, à l’origine, se chantait.\n\n## Ce que fait la poésie lyrique\nElle **chante** : elle exprime des sentiments — joie, amour, tristesse, émerveillement — et cherche à les faire partager.\n\n## Le monde vu autrement\n~ Un objet banal → le regard du poète → un objet extraordinaire\n\nUne flaque devient un miroir du ciel, un caillou une planète.\n\n> C’est le **regard** qui change, pas la chose.\n\n## Les marques du lyrisme\n| La marque | Exemple |\n| La **première personne** | *je*, *mon*, *mes* |\n| Les **exclamations** et **apostrophes** | *Ô temps ! suspends ton vol* |\n| Le champ lexical du **sentiment** | |\n| Les **images** fortes | Comparaisons, métaphores |\n\n## La musique du poème\n| Le procédé | Ce qu’il produit |\n| Le **rythme** | La longueur des vers et les pauses |\n| Les **répétitions** — d’un mot, d’un vers entier | Le **refrain** installe une mélodie |\n| L’**harmonie imitative** | Les sonorités imitent le réel |\n\n## Poésie et chanson\nLa frontière est mince : beaucoup de poèmes ont été **mis en musique**, et les textes de chansons obéissent aux mêmes outils — rimes, refrains, images.\n\n> Étudier un texte de chanson, c’est faire de la poésie. Le mot « lyrique » raconte lui-même cette parenté.\n\n## Dire un poème\n1. Respecter les **pauses** ;\n2. détacher les **images** ;\n3. varier le **volume**.\n\n!> Un poème s’**entend** autant qu’il se lit. Le dire à voix haute fait apparaître ce que l’œil seul ne perçoit pas.', 1),
  ('1bc02359-610d-52e8-8a91-12296bce4dc2', '5a396493-5b55-5ed9-8879-3481b3d8fdda', 'Quand le mot devient un jouet', E'Roubaud écrit pour les enfants sans écrire en dessous d’eux : la fantaisie est réelle, mais la langue est exigeante.\n\n## Le recueil\nDans **Les Animaux de tout le monde** (**1990**), **Jacques Roubaud** consacre un poème à chaque animal — de la sardine au morse. Des poèmes courts, drôles, où l’animal sert de prétexte à jouer avec la langue.\n\n## L’Oulipo\n= OULIPO = OUvroir de LIttérature POtentielle\n\nUn groupe d’écrivains qui s’imposent des **contraintes volontaires** pour écrire.\n\n| La contrainte | Ce qu’elle impose |\n| Le lipogramme | N’employer aucun *e* |\n| La méthode S + 7 | Remplacer chaque nom par le septième qui le suit dans le dictionnaire |\n| Le poème combinatoire | Des vers qui se recombinent |\n\n> La contrainte n’empêche pas d’écrire : elle **oblige à trouver** ce qu’on n’aurait pas cherché.\n\n## Les jeux de langue du recueil\n| Le jeu | Ce qu’il fait | Exemple |\n| Le **calembour** | Jouer sur deux sens ou deux sons proches | |\n| Le **mot-valise** | Fondre deux mots en un | *ani-mots* |\n| La **paronymie** | Rapprocher des mots qui se ressemblent | *sardine* / *sourdine* |\n| Le **détournement** | Retourner un proverbe ou une expression figée | |\n\n## Le ton\nL’humour vient du **décalage** entre le sérieux de la forme poétique et la drôlerie du sujet.\n\n## Écrire à sa manière\n~ Choisir un animal → chercher tous les mots que son nom contient ou évoque → s’imposer une contrainte → écrire\n\nUne seule voyelle, un acrostiche, une rime imposée : c’est la contrainte qui fait surgir l’idée.', 1),
  ('665feca0-2bd6-5ddb-82bc-41ad91447f05', '90d6b904-720c-518a-ba2f-3826e18909db', 'Un faux médecin, une vraie farce', E'Sganarelle ne trompe personne par son savoir : il trompe par son assurance. C’est le vrai sujet de la pièce.\n\n## La pièce\n*Le Médecin malgré lui* (**1666**) est une **comédie** en **trois actes** de **Molière**.\n\n~ Sganarelle bat sa femme Martine → elle le fait passer pour un médecin génial → on le roue de coups → il « avoue » qu’il est médecin → il se prend au jeu\n\nLe ressort : ce faux médecin « ne reconnaîtrait son talent que sous les coups ».\n\n## La farce\nMolière reprend les ressorts de la **farce** médiévale.\n\n| Le ressort | Ce qu’il est |\n| Les **coups de bâton** | |\n| Le **déguisement** et l’**imposture** | |\n| Le **quiproquo** | Un malentendu où chacun croit parler de la même chose |\n| Le **comique de mots** | Sganarelle débite du **faux latin**, que personne n’ose contredire |\n\n## Les cinq formes de comique\n| La forme | Ses moyens |\n| De **gestes** | Coups, chutes, grimaces |\n| De **mots** | Jeux de langage, patois, latin de cuisine, répétitions |\n| De **situation** | Quiproquos, déguisements |\n| De **caractère** | L’ivrogne, le crédule, le pédant |\n| De **répétition** | Une réplique qui revient et déclenche le rire |\n\n## Ce que la pièce dénonce\nDerrière le rire, Molière moque les **médecins** de son temps — leur jargon, leur assurance, leur incapacité à guérir — et la **crédulité** de ceux qui se laissent impressionner par un vocabulaire qu’ils ne comprennent pas.\n\n## Le vocabulaire du théâtre\n| Le mot | Ce qu’il désigne |\n| Une **réplique** | Ce que dit un personnage |\n| Une **tirade** | Une longue réplique |\n| Un **monologue** | Un personnage seul en scène |\n| Un **aparté** | Ce qu’un personnage dit sans être entendu des autres |\n| Les **didascalies** | Les indications de mise en scène, en italique |', 1),
  ('098bcc5d-8cba-5744-a31c-f97b27d44405', '663aaaa7-2515-599e-84c4-9184cf6eb0bd', 'Le valet qui mène le jeu', E'Molière fait rire d’un ordre renversé : le valet mène, les maîtres suivent.\n\n## La pièce\n*Les Fourberies de Scapin* (**1671**), comédie en **trois actes**.\n\n| Le personnage | Son rôle |\n| **Scapin** | Le valet rusé |\n| **Octave** et **Léandre** | Les jeunes gens amoureux |\n| **Argante** et **Géronte** | Leurs pères, opposés aux mariages |\n\nPour les aider, Scapin ment, invente, manipule et soutire de l’argent.\n\n## Ce qu’est une « fourberie »\nUne **ruse**, une tromperie habile.\n\n~ Un mariage forcé inventé → un frère vengeur inventé → une galère turque inventée\n\n> Chaque mensonge en appelle un autre : c’est le moteur de la pièce.\n\n## La scène du sac\nActe III, la scène la plus célèbre.\n\n~ Scapin persuade Géronte de se cacher dans un sac → il imite plusieurs voix d’ennemis → il roue son maître de coups → tout en prétendant le sauver\n\n= « Que diable allait-il faire dans cette galère ? »\n\nCette réplique est passée en proverbe.\n\n## Le type du valet rusé\n| L’ancêtre | Où |\n| L’esclave malin | La comédie latine |\n| Le ***zanni*** | La **commedia dell’arte** italienne |\n\n!> Scapin est **plus intelligent que ses maîtres**. C’est là que la pièce devient piquante : le **pouvoir social** et l’**intelligence** ne sont pas du même côté.\n\n## Le rythme\nLes répliques sont **courtes**, s’enchaînent vite, se répètent en écho.\n\n> Cette **vitesse** est l’essentiel du comique : c’est elle qu’il faut retrouver en lisant à voix haute.', 1),
  ('6aa60b40-bc12-5d51-9a2a-0a38a64795a5', 'e77034bb-2c62-5e62-8c94-b3d3a29313a2', 'Faire croire, tout en sachant', E'Le spectateur sait que la scène est un décor. Il accepte quand même d’y croire : c’est un contrat, pas une naïveté.\n\n## Un art qui se joue\nLe théâtre est le seul genre écrit **pour être joué**. Un texte de théâtre n’est achevé que sur une scène, devant un public : il attend des corps, des voix, une lumière.\n\n## Le double jeu du spectateur\n= La convention théâtrale, ou « suspension volontaire de l’incrédulité »\n\n> On ne se laisse pas tromper : on **accepte** d’être trompé.\n\n## Les outils de l’illusion\n| L’outil | Ce qu’il apporte |\n| Le **décor** et les **accessoires** | Le lieu |\n| Le **costume** et le **maquillage** | Le personnage |\n| La **lumière** | Elle isole, colore et rythme |\n| Le **son** et la **musique** | L’atmosphère |\n| Le **jeu** de l’acteur | Voix, geste, regard, **silence** |\n\n## Le théâtre dans le théâtre\n~ Sganarelle joue au médecin → Scapin joue la peur → le spectateur voit DEUX niveaux\n\nIl sait ce que le personnage trompé ignore : ce décalage s’appelle l’**ironie dramatique**, et c’est une grande source de plaisir.\n\n## Le vocabulaire de la représentation\n| Le mot | Ce qu’il désigne |\n| La **mise en scène** | Le travail du **metteur en scène** : comment le texte devient spectacle |\n| Les **coulisses** | L’espace caché |\n| Le **plateau** | L’espace de jeu |\n| La **scène** | À la fois le lieu et une unité du texte |\n\n## Deux grands genres\n| Le genre | Ses personnages | Sa fin |\n| La **comédie** | Ordinaires | Elle finit **bien** |\n| La **tragédie** | Illustres, pris dans un destin funeste | Elle finit **mal** |', 1),
  ('94cfad26-9579-52dd-9eb4-47a08f6a1376', 'fd7d8ba4-d56d-5ba6-990f-6b6f69cbb3ae', 'Réécrire un conte pour aujourd’hui', E'Pommerat garde la trame du conte de Perrault et en change tout l’éclairage — au sens propre.\n\n## La pièce\n**Joël Pommerat** est un auteur et metteur en scène contemporain. Son *Petit Chaperon Rouge* (**2004**) réécrit le conte de **Charles Perrault** pour la scène.\n\n## Ce qu’il garde, ce qu’il change\n| Il garde | Il change |\n| La petite fille, la mère, la grand-mère | Un **narrateur** vient sur scène raconter et commenter |\n| Le loup, le chemin, la dévoration | Les personnages n’ont **pas de nom** : « la petite fille », « la mère » |\n| | Le cadre devient **quotidien** : une mère trop occupée, une enfant qui s’ennuie |\n\n## Le rôle de la lumière\nLa pièce se joue dans une **quasi-obscurité** traversée de faisceaux. Le loup est souvent une ombre, une voix, une silhouette.\n\n!> La peur naît de ce qu’on **ne voit pas**. Ce n’est pas un effet ajouté : c’est le sujet même du spectacle.\n\n> Chez Pommerat, le noir n’est pas une absence de décor : c’est le décor.\n\n## Le thème\nLe conte parle de l’**enfance qui grandit**.\n\n~ Quitter la maison → désobéir → affronter la peur → revenir changé\n\nPommerat déplace l’accent de la morale — « n’écoutez pas les inconnus » — vers la **solitude** de l’enfant et le **désir d’aventure**.\n\n## Trois mots à distinguer\n| Le mot | Ce qu’il désigne |\n| **Réécrire** | Reprendre une trame et la traiter autrement |\n| **Adapter** | Faire passer une œuvre d’un genre à un autre — conte → théâtre |\n| **Parodier** | Imiter en exagérant, pour faire rire |\n\n!> Pommerat **réécrit** et **adapte** ; il ne **parodie pas**. Son texte est grave.\n\n## Comparer deux versions\nComparer Perrault et Pommerat, c’est mesurer ce qu’une époque fait d’une même histoire : la **fin**, le **rôle de la mère**, la présence ou l’absence de **morale explicite**.', 1)
ON CONFLICT DO NOTHING;

-- 3. Quiz ------------------------------------------------------------------
-- Double garde : ON CONFLICT (id) protège du rejeu, et le NOT EXISTS protège
-- la leçon d’un SECOND quiz venu d’ailleurs — le hub de leçon lit son quiz en
-- .maybeSingle(), deux quiz feraient lever « multiple rows » à de vrais élèves.
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.id, v.title, v.subject, v.grade_level, v.chapter, true, l.id
  FROM (VALUES
    ('7ddee756-ff54-5b55-bdd8-d39c2a43ea89'::uuid, 'Quiz — La Genèse, et ce qu’un récit de création raconte', 'Français', '6e', 'Créer, recréer le monde : récits des origines dans les différentes religions monothéistes', '1cdbd7b9-bac3-51d3-8ff8-efe277c4569f'::uuid),
    ('461fba42-6507-523a-b361-2f5226ed5351'::uuid, 'Quiz — Quand les dieux sont nombreux', 'Français', '6e', 'Création et recréation du monde dans les différentes religions polythéistes', '8dd9d5c2-31aa-5333-ad37-b78caabafbfa'::uuid),
    ('41709434-a947-5aa3-bb0d-06cb11e561a5'::uuid, 'Quiz — Le conte qui explique pourquoi', 'Français', '6e', 'Un conte étiologique : « Comment le chameau eut sa bosse », Histoires comme ça, de Rudyard Kipling', 'f54a5ea9-99aa-5bfb-9681-f68818981500'::uuid),
    ('45e2f1cc-6efe-554e-8e7f-1b62f3605441'::uuid, 'Quiz — Les outils du poète', 'Français', '6e', 'Créer une autre manière de s’exprimer grâce à la poésie', '22799687-5396-5698-b43a-2811ac14ecbd'::uuid),
    ('368dda24-1fe5-553f-9bb3-83222a8722a9'::uuid, 'Quiz — Célébrer, émerveiller, transformer', 'Français', '6e', 'La poésie pour chanter et enchanter le monde', 'c3240f3e-9210-51fc-bf23-cfd1d8a05db2'::uuid),
    ('dc0c22c1-1df5-540a-92a3-f96180c1869d'::uuid, 'Quiz — Quand le mot devient un jouet', 'Français', '6e', 'Jeux d’ani-mots : Jacques Roubaud, Les Animaux de tout le monde', '1bc02359-610d-52e8-8a91-12296bce4dc2'::uuid),
    ('82a2ed82-e0b8-5023-98f8-4c06cbee0062'::uuid, 'Quiz — Un faux médecin, une vraie farce', 'Français', '6e', 'Le Médecin malgré lui, Molière', '665feca0-2bd6-5ddb-82bc-41ad91447f05'::uuid),
    ('87b4d0ce-af17-55cb-aa78-34f167a6e153'::uuid, 'Quiz — Le valet qui mène le jeu', 'Français', '6e', 'Les Fourberies de Scapin, Molière', '098bcc5d-8cba-5744-a31c-f97b27d44405'::uuid),
    ('a71ccfc4-94cb-54a8-84d0-3c19d899139a'::uuid, 'Quiz — Faire croire, tout en sachant', 'Français', '6e', 'Le théâtre, un art de l’illusion ?', '6aa60b40-bc12-5d51-9a2a-0a38a64795a5'::uuid),
    ('86b33d71-e30a-5f6c-9cb5-ef57e136ab7a'::uuid, 'Quiz — Réécrire un conte pour aujourd’hui', 'Français', '6e', 'Le Petit Chaperon Rouge de Joël Pommerat', '94cfad26-9579-52dd-9eb4-47a08f6a1376'::uuid)
  ) AS v(id, title, subject, grade_level, chapter, lesson_id)
  JOIN public.lessons l ON l.id = v.lesson_id
 WHERE NOT EXISTS (SELECT 1 FROM public.quizzes qz WHERE qz.lesson_id = l.id)
ON CONFLICT (id) DO NOTHING;

-- 4. Questions -------------------------------------------------------------
INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT v.id, v.quiz_id, v.question, v.kind, v.options, v.correct_index, v.explanation, v.position
  FROM (VALUES
    ('9b641440-b3f9-55b0-b8f0-0df8c5b4e996'::uuid, '7ddee756-ff54-5b55-bdd8-d39c2a43ea89'::uuid, 'Qu’est-ce qu’un récit des origines ?', 'mcq', '["Un récit qui explique la naissance du monde","Un récit d’aventures","Une pièce de théâtre","Un poème d’amour"]'::jsonb, 0, 'On parle aussi de cosmogonie.', 1),
    ('834f285d-0826-5956-87b4-07bc9e71518a'::uuid, '7ddee756-ff54-5b55-bdd8-d39c2a43ea89'::uuid, 'Que signifie « monothéiste » ?', 'mcq', '["Qui ne reconnaît qu’un seul dieu","Qui reconnaît plusieurs dieux","Qui ne croit en aucun dieu","Qui adore la nature"]'::jsonb, 0, 'Du grec monos, seul, et theos, dieu.', 2),
    ('9c31b743-d4f1-580d-bb07-89887a09e7f7'::uuid, '7ddee756-ff54-5b55-bdd8-d39c2a43ea89'::uuid, 'En combien de jours la création est-elle racontée dans la Genèse ?', 'mcq', '["Sept","Trois","Douze","Quarante"]'::jsonb, 0, 'Six jours d’action et un jour de repos.', 3),
    ('c3ff54f6-bce6-502e-9395-0ed40c00646d'::uuid, '7ddee756-ff54-5b55-bdd8-d39c2a43ea89'::uuid, 'Quel procédé donne son rythme solennel au récit de la Genèse ?', 'mcq', '["La répétition de formules","Le dialogue","La rime","Le suspense"]'::jsonb, 0, '« Dieu dit… et cela fut ainsi ».', 4),
    ('14c7073b-fd76-59fe-8404-bcfc80cc5771'::uuid, '7ddee756-ff54-5b55-bdd8-d39c2a43ea89'::uuid, 'Quel temps raconte les actions principales d’un récit ?', 'mcq', '["Le passé simple","L’imparfait","Le présent","Le futur"]'::jsonb, 0, 'L’imparfait, lui, installe le décor.', 5),
    ('c239afb3-6123-5c27-961e-bd626c8d62bf'::uuid, '7ddee756-ff54-5b55-bdd8-d39c2a43ea89'::uuid, 'À quoi sert l’imparfait dans un récit ?', 'mcq', '["À décrire le décor et l’état des choses","À raconter les actions brèves","À exprimer un ordre","À poser une question"]'::jsonb, 0, '« La terre était informe ».', 6),
    ('ee69114e-77c8-5d20-ae76-8c36dd94ddee'::uuid, '7ddee756-ff54-5b55-bdd8-d39c2a43ea89'::uuid, 'Quel épisode de la Bible est un récit de re-création ?', 'mcq', '["Le déluge","La tour de Babel","L’Exode","La Nativité"]'::jsonb, 0, 'Le monde est effacé, puis recommencé avec Noé.', 7),
    ('8a2515ae-267b-5579-81a6-79a524f8ffa6'::uuid, '7ddee756-ff54-5b55-bdd8-d39c2a43ea89'::uuid, 'On étudie les textes fondateurs comme des documents scientifiques.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'On les lit comme des œuvres littéraires qui ont façonné la culture.', 8),
    ('ebe2bd92-8d73-5dff-86bb-d944d8db8ef1'::uuid, '461fba42-6507-523a-b361-2f5226ed5351'::uuid, 'Que signifie « polythéiste » ?', 'mcq', '["Qui reconnaît plusieurs dieux","Qui ne reconnaît qu’un dieu","Qui ne croit en rien","Qui adore les ancêtres"]'::jsonb, 0, 'Du grec poly, nombreux.', 1),
    ('d402d97b-a7f7-5860-a099-47a20869a83c'::uuid, '461fba42-6507-523a-b361-2f5226ed5351'::uuid, 'De quoi naît le monde dans la cosmogonie grecque d’Hésiode ?', 'mcq', '["Du Chaos","De l’Olympe","De la mer","D’un œuf"]'::jsonb, 0, 'Puis viennent Gaïa et Ouranos.', 2),
    ('4124d737-ee4e-563b-ab8f-416cd6ecc5d0'::uuid, '461fba42-6507-523a-b361-2f5226ed5351'::uuid, 'Qui règne sur l’Olympe après avoir renversé Cronos ?', 'mcq', '["Zeus","Poséidon","Hadès","Prométhée"]'::jsonb, 0, 'Cronos avait lui-même renversé Ouranos.', 3),
    ('f1ab3198-1fc0-57a2-8543-09447824adac'::uuid, '461fba42-6507-523a-b361-2f5226ed5351'::uuid, 'Que signifie « anthropomorphe » pour un dieu ?', 'mcq', '["Il a une forme et un caractère humains","Il est invisible","Il est unique","Il vit sous terre"]'::jsonb, 0, 'Les dieux grecs ont des défauts très humains.', 4),
    ('2b92fc72-b937-557f-8ebe-2dcebd0f9174'::uuid, '461fba42-6507-523a-b361-2f5226ed5351'::uuid, 'Qu’a fait Prométhée pour les humains ?', 'mcq', '["Il leur a volé le feu","Il leur a donné la parole","Il a créé la Terre","Il a ouvert une jarre"]'::jsonb, 0, 'Il en sera puni par Zeus.', 5),
    ('04435ae0-4a71-5141-8043-7c20fb2f3773'::uuid, '461fba42-6507-523a-b361-2f5226ed5351'::uuid, 'Qu’a laissé Pandore dans la jarre après en avoir libéré les maux ?', 'mcq', '["L’espérance","Le feu","La sagesse","Rien"]'::jsonb, 0, 'Tous les autres maux s’en étaient échappés.', 6),
    ('26a2371c-3276-5603-bbde-444f31604152'::uuid, '461fba42-6507-523a-b361-2f5226ed5351'::uuid, 'Quel dieu grec règne sur la mer ?', 'mcq', '["Poséidon","Hadès","Arès","Athéna"]'::jsonb, 0, 'Hadès règne sur les Enfers.', 7),
    ('50580e4f-256d-583a-8a5e-39648ec92b0a'::uuid, '461fba42-6507-523a-b361-2f5226ed5351'::uuid, 'Le motif du déluge n’existe que dans la Bible.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'On le trouve chez les Grecs et dans L’Épopée de Gilgamesh, plus ancienne.', 8),
    ('ce4f9061-a8e4-5a73-a5c1-fd7bc23f2f76'::uuid, '41709434-a947-5aa3-bb0d-06cb11e561a5'::uuid, 'Qu’explique un conte étiologique ?', 'mcq', '["Pourquoi une chose est comme elle est","Comment finit une aventure","Qui a gagné une guerre","Comment cuisiner"]'::jsonb, 0, 'Du grec aitia, la cause.', 1),
    ('401fab7f-0ab7-50dd-97a1-91a742c05166'::uuid, '41709434-a947-5aa3-bb0d-06cb11e561a5'::uuid, 'Qui a écrit Histoires comme ça ?', 'mcq', '["Rudyard Kipling","Charles Perrault","Jean de La Fontaine","Joël Pommerat"]'::jsonb, 0, 'Le recueil paraît en 1902.', 2),
    ('e21fc0b2-9e66-58d4-aab7-1931415c34b1'::uuid, '41709434-a947-5aa3-bb0d-06cb11e561a5'::uuid, 'Que devient le « Bof » du chameau dans le conte ?', 'mcq', '["Sa bosse","Sa longue patte","Son cri","Sa fourrure"]'::jsonb, 0, 'Le Djinn le punit de sa paresse.', 3),
    ('7c69d2bc-300e-5197-8736-06df464d129f'::uuid, '41709434-a947-5aa3-bb0d-06cb11e561a5'::uuid, 'Comment appelle-t-on le fait de s’adresser directement au lecteur ?', 'mcq', '["L’apostrophe","La comparaison","La métaphore","La rime"]'::jsonb, 0, 'Kipling dit « Ô Bien-Aimé ».', 4),
    ('f02bfed5-14fd-5c7a-8ec5-bedd0efe146b'::uuid, '41709434-a947-5aa3-bb0d-06cb11e561a5'::uuid, 'Par quoi commence un conte étiologique ?', 'mcq', '["Une situation où la chose n’existe pas encore","La situation finale","Une morale","Un dialogue"]'::jsonb, 0, 'Puis vient l’événement qui la fait apparaître.', 5),
    ('d35a6aa5-b25c-538c-ab0c-f25fad2620a2'::uuid, '41709434-a947-5aa3-bb0d-06cb11e561a5'::uuid, 'Quel temps emploie-t-on pour les actions d’un conte ?', 'mcq', '["Le passé simple","Le présent","Le futur","Le conditionnel"]'::jsonb, 0, 'L’imparfait sert aux descriptions.', 6),
    ('aae01f62-84cd-503a-adf1-116d2fbe62ba'::uuid, '41709434-a947-5aa3-bb0d-06cb11e561a5'::uuid, 'Quelle formule installe le caractère définitif de l’explication ?', 'mcq', '["« Et depuis ce jour… »","« Il était une fois »","« Soudain »","« En effet »"]'::jsonb, 0, 'Elle vaut pour toute l’espèce et pour toujours.', 7),
    ('2c607d45-37bb-5f0d-a8b5-3d0d2175ab2d'::uuid, '41709434-a947-5aa3-bb0d-06cb11e561a5'::uuid, 'Un conte étiologique donne une explication scientifique.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'Il fait semblant d’expliquer : c’est un jeu littéraire.', 8),
    ('e61a6c60-fa7b-5d3b-be7b-d108432258ae'::uuid, '45e2f1cc-6efe-554e-8e7f-1b62f3605441'::uuid, 'Combien de syllabes compte un alexandrin ?', 'mcq', '["Douze","Dix","Huit","Quatorze"]'::jsonb, 0, 'C’est le vers le plus célèbre de la poésie française.', 1),
    ('f41353ea-faa2-5610-b542-5a183f02aac8'::uuid, '45e2f1cc-6efe-554e-8e7f-1b62f3605441'::uuid, 'Comment appelle-t-on une strophe de quatre vers ?', 'mcq', '["Un quatrain","Un tercet","Un distique","Un sonnet"]'::jsonb, 0, 'Le tercet en compte trois.', 2),
    ('5fed358e-7255-5b12-a7f7-e4772982ad2f'::uuid, '45e2f1cc-6efe-554e-8e7f-1b62f3605441'::uuid, 'Quelle est la différence entre comparaison et métaphore ?', 'mcq', '["La comparaison utilise un outil comme « comme », la métaphore non","La métaphore utilise un outil, la comparaison non","Il n’y en a aucune","La métaphore concerne les animaux"]'::jsonb, 0, 'C’est le piège classique des contrôles.', 3),
    ('7df864e5-b8a2-5b32-a317-ac13e589c127'::uuid, '45e2f1cc-6efe-554e-8e7f-1b62f3605441'::uuid, 'Qu’est-ce qu’une personnification ?', 'mcq', '["Prêter des traits humains à une chose ou un animal","Comparer deux personnes","Répéter une consonne","Décrire un personnage"]'::jsonb, 0, '« Le vent murmure ».', 4),
    ('e5a8798a-5abe-506a-bc2e-70a2e8cb3618'::uuid, '45e2f1cc-6efe-554e-8e7f-1b62f3605441'::uuid, 'Qu’est-ce qu’une allitération ?', 'mcq', '["La répétition d’un son consonne","La répétition d’un son voyelle","Une rime croisée","Un vers de douze syllabes"]'::jsonb, 0, 'L’assonance concerne les voyelles.', 5),
    ('346aa957-04b0-5cc4-9bc1-3831044d88bc'::uuid, '45e2f1cc-6efe-554e-8e7f-1b62f3605441'::uuid, 'Comment appelle-t-on la disposition de rimes ABAB ?', 'mcq', '["Rimes croisées","Rimes suivies","Rimes embrassées","Rimes libres"]'::jsonb, 0, 'ABBA donne des rimes embrassées.', 6),
    ('06f0fdce-e441-5a7c-b91a-30bf6a1aed63'::uuid, '45e2f1cc-6efe-554e-8e7f-1b62f3605441'::uuid, 'Qu’est-ce qu’un calligramme ?', 'mcq', '["Un poème dont la forme dessine son sujet","Un poème sans rime","Un poème de douze vers","Un poème chanté"]'::jsonb, 0, 'Apollinaire en a écrit de célèbres.', 7),
    ('52aa9fba-67de-569d-9b89-ac49d4f952b4'::uuid, '45e2f1cc-6efe-554e-8e7f-1b62f3605441'::uuid, 'Un vers libre ne compte pas un nombre fixe de syllabes.', 'true_false', '["Vrai","Faux"]'::jsonb, 0, 'La contrainte disparaît, mais l’intention poétique demeure.', 8),
    ('1fecb138-bfb5-5719-b979-edcfc0fd30f4'::uuid, '368dda24-1fe5-553f-9bb3-83222a8722a9'::uuid, 'D’où vient le mot « lyrique » ?', 'mcq', '["De la lyre, l’instrument du poète antique","Du nom d’un poète","D’une ville grecque","Du mot « lire »"]'::jsonb, 0, 'À l’origine, le poème se chantait.', 1),
    ('569e184d-022d-5659-8094-00a9115593ad'::uuid, '368dda24-1fe5-553f-9bb3-83222a8722a9'::uuid, 'Qu’exprime la poésie lyrique ?', 'mcq', '["Des sentiments","Des démonstrations scientifiques","Des règles de grammaire","Des faits historiques"]'::jsonb, 0, 'Joie, amour, tristesse, émerveillement.', 2),
    ('442d658a-5600-563b-8be0-3b5481788924'::uuid, '368dda24-1fe5-553f-9bb3-83222a8722a9'::uuid, 'Quelle marque grammaticale signale souvent le lyrisme ?', 'mcq', '["La première personne : je, mon, mes","La troisième personne","Le pronom « on »","Le passé simple"]'::jsonb, 0, 'Le poète parle en son nom.', 3),
    ('021d9135-0242-514f-b2e7-3eafc1456859'::uuid, '368dda24-1fe5-553f-9bb3-83222a8722a9'::uuid, 'Qu’est-ce qu’un refrain ?', 'mcq', '["Un vers ou un groupe de vers répété","La première strophe","La dernière rime","Un vers de douze syllabes"]'::jsonb, 0, 'Il installe une mélodie.', 4),
    ('dea6c575-13b5-5dba-9221-8f91c7d4cb53'::uuid, '368dda24-1fe5-553f-9bb3-83222a8722a9'::uuid, 'Qu’est-ce que l’harmonie imitative ?', 'mcq', '["Des sonorités qui imitent ce que le texte décrit","Une rime parfaite","Un vers régulier","Une strophe de quatre vers"]'::jsonb, 0, 'Le son rejoint le sens.', 5),
    ('b41155e0-ba83-51d0-b83a-872835ec5541'::uuid, '368dda24-1fe5-553f-9bb3-83222a8722a9'::uuid, 'Quel poète antique jouait de la lyre ?', 'mcq', '["Orphée","Homère","Hésiode","Molière"]'::jsonb, 0, 'Son nom est resté attaché au chant poétique.', 6),
    ('bb15009e-b947-5764-ab9a-45dd34c2c7d8'::uuid, '368dda24-1fe5-553f-9bb3-83222a8722a9'::uuid, 'Que fait le poète d’un objet banal ?', 'mcq', '["Il en transforme le regard qu’on porte dessus","Il le décrit scientifiquement","Il le supprime","Il le compte"]'::jsonb, 0, 'Une flaque devient un miroir du ciel.', 7),
    ('f29221e9-6e60-5907-b3f3-cf3575ebbdfd'::uuid, '368dda24-1fe5-553f-9bb3-83222a8722a9'::uuid, 'Un texte de chanson ne peut pas être étudié comme un poème.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'Il emploie les mêmes outils : rimes, refrains, images.', 8),
    ('ff396a03-5a00-53b9-8193-bb5bcbaa1cd6'::uuid, 'dc0c22c1-1df5-540a-92a3-f96180c1869d'::uuid, 'Qui a écrit Les Animaux de tout le monde ?', 'mcq', '["Jacques Roubaud","Rudyard Kipling","Guillaume Apollinaire","Raymond Queneau"]'::jsonb, 0, 'Le recueil paraît en 1990.', 1),
    ('168185d4-27a6-5ff1-ae73-38e43da5a642'::uuid, 'dc0c22c1-1df5-540a-92a3-f96180c1869d'::uuid, 'Qu’est-ce que l’Oulipo ?', 'mcq', '["Un groupe d’écrivains qui s’imposent des contraintes d’écriture","Une maison d’édition","Un mouvement politique","Un prix littéraire"]'::jsonb, 0, 'Ouvroir de Littérature Potentielle.', 2),
    ('99c37e6a-e0dc-51ee-8e31-2d05e304ac18'::uuid, 'dc0c22c1-1df5-540a-92a3-f96180c1869d'::uuid, 'Qu’est-ce qu’un mot-valise ?', 'mcq', '["Un mot formé en fondant deux mots en un","Un mot très long","Un mot inventé sans sens","Un mot étranger"]'::jsonb, 0, '« Ani-mots » est formé sur animal et mots.', 3),
    ('30a47a2e-a127-54cd-b60d-2d74219e7428'::uuid, 'dc0c22c1-1df5-540a-92a3-f96180c1869d'::uuid, 'Qu’est-ce qu’un calembour ?', 'mcq', '["Un jeu sur deux sens ou deux sons proches d’un mot","Une rime riche","Un vers de dix syllabes","Une strophe"]'::jsonb, 0, 'C’est un ressort central du recueil.', 4),
    ('f58d5586-92d1-50ec-9641-af1ab23aa6df'::uuid, 'dc0c22c1-1df5-540a-92a3-f96180c1869d'::uuid, 'À quoi sert une contrainte d’écriture selon l’Oulipo ?', 'mcq', '["Elle oblige à trouver ce qu’on n’aurait pas cherché","Elle empêche d’écrire","Elle simplifie le travail","Elle sert à corriger les fautes"]'::jsonb, 0, 'La contrainte est un moteur, pas un frein.', 5),
    ('265c8460-e178-547b-afb6-c48f6cac83ea'::uuid, 'dc0c22c1-1df5-540a-92a3-f96180c1869d'::uuid, 'Qu’est-ce que la paronymie ?', 'mcq', '["Le rapprochement de mots qui se ressemblent","La répétition d’une voyelle","L’emploi de synonymes","Le contraire d’un mot"]'::jsonb, 0, 'Sardine et sourdine, par exemple.', 6),
    ('6cd4d675-a330-55c1-aeb0-9cced58fd6f0'::uuid, 'dc0c22c1-1df5-540a-92a3-f96180c1869d'::uuid, 'À quoi chaque poème du recueil est-il consacré ?', 'mcq', '["À un animal","À une saison","À une ville","À un sentiment"]'::jsonb, 0, 'De la sardine au morse.', 7),
    ('76d01c0f-9846-5ceb-9a21-03cfee3a91a3'::uuid, 'dc0c22c1-1df5-540a-92a3-f96180c1869d'::uuid, 'Écrire sous contrainte empêche toute créativité.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'C’est précisément le pari inverse de l’Oulipo.', 8),
    ('85812423-1687-5471-a8a1-32c59d122f6a'::uuid, '82a2ed82-e0b8-5023-98f8-4c06cbee0062'::uuid, 'En quelle année Le Médecin malgré lui a-t-il été créé ?', 'mcq', '["1666","1670","1622","1700"]'::jsonb, 0, 'C’est une comédie en trois actes.', 1),
    ('21834f8f-1d1a-5e01-ab64-6b5715db5d37'::uuid, '82a2ed82-e0b8-5023-98f8-4c06cbee0062'::uuid, 'Qui est Sganarelle au début de la pièce ?', 'mcq', '["Un bûcheron ivrogne","Un vrai médecin","Un noble","Un valet de comédie"]'::jsonb, 0, 'Sa femme le fait passer pour médecin par vengeance.', 2),
    ('bfbcdf4d-6f41-5d8c-8faf-3150a980caa1'::uuid, '82a2ed82-e0b8-5023-98f8-4c06cbee0062'::uuid, 'Qu’est-ce qu’un quiproquo ?', 'mcq', '["Un malentendu où l’on croit parler de la même chose","Un long discours","Une indication de mise en scène","Un personnage seul en scène"]'::jsonb, 0, 'C’est un ressort classique de la farce.', 3),
    ('cc4eadeb-b795-56a0-9d0f-3ffac08734e7'::uuid, '82a2ed82-e0b8-5023-98f8-4c06cbee0062'::uuid, 'Comment appelle-t-on les indications de mise en scène ?', 'mcq', '["Les didascalies","Les répliques","Les tirades","Les apartés"]'::jsonb, 0, 'Elles sont écrites en italique.', 4),
    ('60f63b1f-506f-55da-87fa-841bd76ecf65'::uuid, '82a2ed82-e0b8-5023-98f8-4c06cbee0062'::uuid, 'Qu’est-ce qu’un aparté ?', 'mcq', '["Ce qu’un personnage dit sans être entendu des autres","Une longue réplique","Un dialogue à deux","Le titre d’un acte"]'::jsonb, 0, 'Le public l’entend, pas les personnages.', 5),
    ('89c829e2-0a78-51ef-9629-c5d5043ec03e'::uuid, '82a2ed82-e0b8-5023-98f8-4c06cbee0062'::uuid, 'Quel comique repose sur les coups de bâton et les grimaces ?', 'mcq', '["Le comique de gestes","Le comique de mots","Le comique de caractère","Le comique de situation"]'::jsonb, 0, 'C’est un héritage direct de la farce.', 6),
    ('79a906f9-bd26-5584-be49-87a6b34faa3e'::uuid, '82a2ed82-e0b8-5023-98f8-4c06cbee0062'::uuid, 'Que moque Molière derrière le rire de cette pièce ?', 'mcq', '["Les médecins de son temps et la crédulité du public","Les paysans","Les rois","Les comédiens"]'::jsonb, 0, 'Sganarelle impressionne par son assurance, pas par son savoir.', 7),
    ('13ccdae9-a5ad-5ab0-bade-aca20175ae80'::uuid, '82a2ed82-e0b8-5023-98f8-4c06cbee0062'::uuid, 'Une tirade est une réplique très courte.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'C’est au contraire une longue réplique.', 8),
    ('9cab39be-ecfd-5602-949f-b7accd006ecd'::uuid, '87b4d0ce-af17-55cb-aa78-34f167a6e153'::uuid, 'En quelle année Les Fourberies de Scapin ont-elles été créées ?', 'mcq', '["1671","1666","1680","1650"]'::jsonb, 0, 'C’est une comédie en trois actes.', 1),
    ('57d7b743-d197-5c13-9b54-84d0c7597bf4'::uuid, '87b4d0ce-af17-55cb-aa78-34f167a6e153'::uuid, 'Qu’est-ce qu’une « fourberie » ?', 'mcq', '["Une ruse, une tromperie habile","Un costume","Une chanson","Un pardon"]'::jsonb, 0, 'Scapin en enchaîne tout au long de la pièce.', 2),
    ('442d8a02-fcc9-51e7-87db-cea116019674'::uuid, '87b4d0ce-af17-55cb-aa78-34f167a6e153'::uuid, 'Que fait Scapin subir à Géronte dans la scène du sac ?', 'mcq', '["Il le fait cacher dans un sac et le roue de coups","Il le déguise en médecin","Il le marie de force","Il le vole discrètement"]'::jsonb, 0, 'Il imite plusieurs voix pour le tromper.', 3),
    ('1887b360-b93e-57b7-95af-b2807de66528'::uuid, '87b4d0ce-af17-55cb-aa78-34f167a6e153'::uuid, 'Quelle réplique célèbre vient de cette pièce ?', 'mcq', '["« Que diable allait-il faire dans cette galère ? »","« Tu l’as voulu, Georges Dandin »","« Couvrez ce sein »","« Le poumon ! »"]'::jsonb, 0, 'Elle est passée en proverbe.', 4),
    ('a0a086cd-1b43-5065-a235-f6d11995930d'::uuid, '87b4d0ce-af17-55cb-aa78-34f167a6e153'::uuid, 'De quelle tradition italienne Scapin descend-il ?', 'mcq', '["La commedia dell’arte","L’opéra","La tragédie grecque","Le roman de chevalerie"]'::jsonb, 0, 'Le personnage du zanni, valet rusé.', 5),
    ('0cb4fabf-9f3f-53cf-9d3d-25218f20c7dc'::uuid, '87b4d0ce-af17-55cb-aa78-34f167a6e153'::uuid, 'Qui Scapin aide-t-il ?', 'mcq', '["Deux jeunes gens qui veulent épouser celles qu’ils aiment","Les deux pères","Un médecin","Un roi"]'::jsonb, 0, 'Contre la volonté d’Argante et Géronte.', 6),
    ('5089e8b1-ca81-5e33-ae93-efb6638b7e7f'::uuid, '87b4d0ce-af17-55cb-aa78-34f167a6e153'::uuid, 'Qu’est-ce qui fait le comique du rythme de la pièce ?', 'mcq', '["Des répliques courtes qui s’enchaînent vite","De longues tirades","Le silence des personnages","L’absence de dialogue"]'::jsonb, 0, 'On le retrouve en lisant à voix haute.', 7),
    ('87b811aa-469a-50d7-a2ad-bf2b50169e3f'::uuid, '87b4d0ce-af17-55cb-aa78-34f167a6e153'::uuid, 'Dans la pièce, les maîtres sont plus intelligents que le valet.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'C’est l’inverse, et c’est ce renversement qui fait rire.', 8),
    ('beab5a70-b3d8-5550-ae46-aab51a1ce890'::uuid, 'a71ccfc4-94cb-54a8-84d0-3c19d899139a'::uuid, 'Qu’est-ce que la convention théâtrale ?', 'mcq', '["L’accord tacite du spectateur pour croire à ce qu’il voit","Le contrat de l’acteur","Le règlement de la salle","Le plan du décor"]'::jsonb, 0, 'On accepte d’être trompé, on n’est pas dupe.', 1),
    ('742cc9b8-21fe-5cc6-a15b-db6e0ad3c59c'::uuid, 'a71ccfc4-94cb-54a8-84d0-3c19d899139a'::uuid, 'Comment appelle-t-on le travail de celui qui transforme le texte en spectacle ?', 'mcq', '["La mise en scène","La dramaturgie","La scénographie seule","La régie"]'::jsonb, 0, 'Elle est signée par le metteur en scène.', 2),
    ('b5cadaf1-d2d6-5490-8d28-00cb12a17bb4'::uuid, 'a71ccfc4-94cb-54a8-84d0-3c19d899139a'::uuid, 'Qu’est-ce que l’ironie dramatique ?', 'mcq', '["Le spectateur sait ce qu’un personnage ignore","Un personnage se moque d’un autre","Une réplique drôle","Un décor comique"]'::jsonb, 0, 'Elle naît souvent du théâtre dans le théâtre.', 3),
    ('137d1d1c-5cda-5ad6-9b80-a29796c3ad19'::uuid, 'a71ccfc4-94cb-54a8-84d0-3c19d899139a'::uuid, 'Comment appelle-t-on l’espace caché du public ?', 'mcq', '["Les coulisses","Le plateau","La scène","Le parterre"]'::jsonb, 0, 'Le plateau est l’espace de jeu.', 4),
    ('b8bb9bff-f421-51a6-b457-5ba4fcd8c05d'::uuid, 'a71ccfc4-94cb-54a8-84d0-3c19d899139a'::uuid, 'Qu’est-ce qui distingue la tragédie de la comédie ?', 'mcq', '["Elle met en scène des personnages illustres et finit mal","Elle est plus courte","Elle n’a pas de dialogue","Elle se joue sans décor"]'::jsonb, 0, 'La comédie met en scène des personnages ordinaires.', 5),
    ('667c02b7-ca08-52de-8c4a-90acd730291a'::uuid, 'a71ccfc4-94cb-54a8-84d0-3c19d899139a'::uuid, 'Pourquoi dit-on qu’un texte de théâtre n’est pas achevé sur la page ?', 'mcq', '["Il est écrit pour être joué devant un public","Il est toujours trop court","Il manque des mots","Il n’a pas de fin"]'::jsonb, 0, 'Il attend des corps, des voix, une lumière.', 6),
    ('77a209a3-5b8e-574f-8c33-ae3f7bab44dc'::uuid, 'a71ccfc4-94cb-54a8-84d0-3c19d899139a'::uuid, 'Lequel de ces éléments n’est PAS un outil de l’illusion théâtrale ?', 'mcq', '["La table des matières","Le costume","La lumière","Le décor"]'::jsonb, 0, 'Le son et le jeu de l’acteur en sont aussi.', 7),
    ('94cbd372-d628-5ba2-839c-090cb7ef7784'::uuid, 'a71ccfc4-94cb-54a8-84d0-3c19d899139a'::uuid, 'Le spectateur de théâtre croit vraiment que ce qu’il voit est réel.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'Il accepte d’y croire : c’est une convention, pas une illusion subie.', 8),
    ('b563f5dc-1499-5818-80d2-60449043f607'::uuid, '86b33d71-e30a-5f6c-9cb5-ef57e136ab7a'::uuid, 'Qui a écrit ce Petit Chaperon Rouge pour le théâtre ?', 'mcq', '["Joël Pommerat","Charles Perrault","Les frères Grimm","Molière"]'::jsonb, 0, 'La pièce date de 2004.', 1),
    ('3ac5c484-aa00-5a1c-9373-9d422d7fac2e'::uuid, '86b33d71-e30a-5f6c-9cb5-ef57e136ab7a'::uuid, 'De qui Pommerat reprend-il le conte ?', 'mcq', '["Charles Perrault","Jacques Roubaud","Rudyard Kipling","Jean de La Fontaine"]'::jsonb, 0, 'Il en garde la trame et en change l’éclairage.', 2),
    ('84ef52ac-5f3e-58e0-b499-0ec63a4a0535'::uuid, '86b33d71-e30a-5f6c-9cb5-ef57e136ab7a'::uuid, 'Comment les personnages sont-ils désignés dans la pièce ?', 'mcq', '["Sans nom propre : « la petite fille », « la mère »","Par des prénoms modernes","Par des numéros","Par des noms d’animaux"]'::jsonb, 0, 'Cela leur donne une portée générale.', 3),
    ('9f5eace7-dca7-5d8a-bc6d-47ab2624b5fb'::uuid, '86b33d71-e30a-5f6c-9cb5-ef57e136ab7a'::uuid, 'Quel élément de mise en scène crée la peur ?', 'mcq', '["La quasi-obscurité et ce qu’on ne voit pas","Les décors très détaillés","La musique forte","Les costumes colorés"]'::jsonb, 0, 'Le loup est souvent une ombre ou une voix.', 4),
    ('1091bcdc-5523-51e5-addc-e2567ac07f93'::uuid, '86b33d71-e30a-5f6c-9cb5-ef57e136ab7a'::uuid, 'Quel personnage vient commenter l’histoire sur scène ?', 'mcq', '["Un narrateur","Le loup","La grand-mère","Un chœur d’enfants"]'::jsonb, 0, 'Il raconte et fait le lien avec le public.', 5),
    ('1638cf0e-1124-5941-aa68-3b0bb9e9b9c2'::uuid, '86b33d71-e30a-5f6c-9cb5-ef57e136ab7a'::uuid, 'Que signifie « adapter » une œuvre ?', 'mcq', '["La faire passer d’un genre à un autre","L’imiter en exagérant","La traduire","La résumer"]'::jsonb, 0, 'Ici, du conte au théâtre.', 6),
    ('c2d46c43-0a55-5cb7-a05d-42cf96bd364a'::uuid, '86b33d71-e30a-5f6c-9cb5-ef57e136ab7a'::uuid, 'Sur quoi Pommerat déplace-t-il l’accent du conte ?', 'mcq', '["La solitude de l’enfant et son désir d’aventure","La punition du loup","La richesse de la grand-mère","La morale explicite"]'::jsonb, 0, 'Perrault insistait sur l’avertissement.', 7),
    ('91db90f6-7305-51b9-992b-59ac5b4451b9'::uuid, '86b33d71-e30a-5f6c-9cb5-ef57e136ab7a'::uuid, 'Le Petit Chaperon Rouge de Pommerat est une parodie comique.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'C’est une réécriture grave, non une parodie.', 8)
  ) AS v(id, quiz_id, question, kind, options, correct_index, explanation, position)
-- Le quiz doit exister : si le NOT EXISTS ci-dessus a écarté un quiz (une
-- leçon en avait déjà un), ses questions ne partent pas dans le vide.
 WHERE EXISTS (SELECT 1 FROM public.quizzes qz WHERE qz.id = v.quiz_id)
ON CONFLICT (id) DO NOTHING;

-- 5. Sonde finale ----------------------------------------------------------
DO $$
DECLARE
  n_vides integer;
  n_chap  integer;
BEGIN
  SELECT count(*) INTO n_chap FROM public.chapters c
   JOIN public.subjects s ON s.id = c.subject_id
   WHERE s.slug IN ('francais');
  SELECT count(*) INTO n_vides FROM public.subjects s
   WHERE s.slug IN ('francais')
     AND NOT EXISTS (SELECT 1 FROM public.chapters c WHERE c.subject_id = s.id);
  IF n_vides > 0 THEN
    RAISE EXCEPTION 'Migration 328 incomplète : % matiere(s) encore sans chapitre', n_vides;
  END IF;
  RAISE NOTICE 'Migration 328 OK : % chapitres sur les matieres visees.', n_chap;
END $$;
