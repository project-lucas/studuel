-- =============================================================================
-- Studuel — Migration 235 : LES SIX AXES DU PROGRAMME D’ANGLAIS (Tle)
--
-- ⚠️ FICHIER GÉNÉRÉ — ne pas éditer à la main.
--    Source : scripts/contenu/*.mjs
--    Regénérer : node scripts/seed-contenu.mjs --num 235 --modules anglais-axes-tle
--
-- LE DÉFAUT CORRIGÉ. L'anglais de Terminale ouvrait sur quatre chapitres
-- donnés pour « les axes du programme » :  « Faire société : unité et pluralité »,
-- « Environnements en mutation », « Art et débats d'idées », « Innovations et
-- responsabilité ». Aucun des quatre n'est un axe du programme de terminale ; deux
-- d'entre eux viennent d'un AUTRE enseignement, la spécialité « Anglais, monde
-- contemporain ». L'élève lisait donc quatre intitulés absents de son cours.
-- LE TEXTE QUI FAIT FOI. Arrêté du 5 mai 2025, BO n° 22 du 29 mai 2025
-- (MENE2504621A), dont l'article 4 applique le programme aux classes de première
-- et de terminale À LA RENTRÉE 2026-2027 — l'année en cours. Il compte SIX axes
-- (et non huit comme le programme de 2019) : Espace privé et espace public ·
-- Territoire et mémoire · Fictions et réalités · Enjeux et formes de la
-- communication · Citoyenneté et mondes virtuels · Le Royaume-Uni et ses nations.
-- Cinq des six sont à traiter dans l'année, dont obligatoirement le sixième.
-- CE QUI CHANGE. Les quatre faux axes sont supprimés (leçons et quiz partent par
-- cascade), les six vrais s'installent aux positions 1 à 6, et les 24 fiches de
-- grammaire de la migration 226 se rangent derrière eux sous leurs quatre repères
-- linguistiques. La page matière groupe au lieu d'aligner 28 lignes à plat.
--
-- Cette migration apporte : 6 chapitres, 6 leçons,
-- 6 quiz et 48 questions, sur 1 matière.
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
-- [anglais] La colonne chapters.theme (migration 234) conditionne tout ce qui
-- [anglais] suit. Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS parce que 234 n'a pas
-- [anglais] encore été jouée sur la base de production (sondé le 07/08/2026 : « column
-- [anglais] chapters.theme does not exist »). Sans elle, cette migration échouerait à
-- [anglais] mi-parcours — les quatre faux axes déjà supprimés, les six vrais pas encore
-- [anglais] posés : une matière vide en production. Les deux migrations sont idempotentes,
-- [anglais] jouer 234 avant ou après ne change rien.
-- [anglais] Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
-- [anglais] chapters pour cacher mind_map, et ne l'a rendu que colonne par colonne. Une
-- [anglais] colonne ajoutée après elle n'hérite d'aucun droit — sans ce GRANT, l'app lirait
-- [anglais] « permission denied » au lieu de l'axe.
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;

-- [anglais] Les quatre chapitres qui se donnaient pour les axes du programme.
-- [anglais] Ils partent avec leurs leçons et leurs quiz (ON DELETE CASCADE) : les garder
-- [anglais] « au cas où » laisserait à l'élève quatre portes vers un hors-programme.
-- [anglais] Le DELETE est borné aux quatre titres exacts — aucun autre chapitre d'anglais de
-- [anglais] Terminale n'est touché, et rejouer ne trouve plus rien à supprimer.
DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'anglais'
   AND c.level = 'Tle'
   AND c.title IN (
     'Faire société : unité et pluralité',
     'Environnements en mutation',
     'Art et débats d''idées',
     'Innovations et responsabilité'
   );

-- [anglais] Les 24 fiches de grammaire (migration 226) occupent les positions 5
-- [anglais] à 28 : elles reculent à 7-30 pour laisser les six premières places aux axes, et
-- [anglais] reçoivent leur repère linguistique. Positions ÉCRITES UNE À UNE et non décalées
-- [anglais] d'un « +6 » : un décalage relatif rejoué décalerait une seconde fois.
UPDATE public.chapters c
   SET position = v.position, theme = v.theme
  FROM (VALUES
    ('Les déterminants', 7, 'Repères linguistiques — le groupe nominal'),
    ('Exprimer une quantité', 8, 'Repères linguistiques — le groupe nominal'),
    ('Les adjectifs qualificatifs', 9, 'Repères linguistiques — le groupe nominal'),
    ('Les verbes lexicaux et les auxiliaires', 10, 'Repères linguistiques — le groupe verbal'),
    ('Les auxiliaires modaux', 11, 'Repères linguistiques — le groupe verbal'),
    ('Les verbes à particule et les verbes prépositionnels', 12, 'Repères linguistiques — le groupe verbal'),
    ('Infinitif et gérondif', 13, 'Repères linguistiques — le groupe verbal'),
    ('Les adverbes', 14, 'Repères linguistiques — le groupe verbal'),
    ('Le présent simple et le présent en BE + -ING', 15, 'Repères linguistiques — les temps'),
    ('Le prétérit simple et le prétérit BE + -ING', 16, 'Repères linguistiques — les temps'),
    ('Le present perfect et le present perfect BE + -ING', 17, 'Repères linguistiques — les temps'),
    ('Le past perfect et le past perfect BE + -ING', 18, 'Repères linguistiques — les temps'),
    ('Exprimer le futur et le conditionnel', 19, 'Repères linguistiques — les temps'),
    ('Les questions', 20, 'Repères linguistiques — la phrase'),
    ('La phrase exclamative', 21, 'Repères linguistiques — la phrase'),
    ('Le comparatif et le superlatif', 22, 'Repères linguistiques — la phrase'),
    ('Les subordonnées', 23, 'Repères linguistiques — la phrase'),
    ('Exprimer la temporalité et la durée', 24, 'Repères linguistiques — la phrase'),
    ('Exprimer la cause et le but', 25, 'Repères linguistiques — la phrase'),
    ('Exprimer la condition, la concession et l’opposition', 26, 'Repères linguistiques — la phrase'),
    ('Exprimer l’habitude', 27, 'Repères linguistiques — la phrase'),
    ('Faire faire quelque chose à quelqu’un', 28, 'Repères linguistiques — la phrase'),
    ('La voix passive', 29, 'Repères linguistiques — la phrase'),
    ('Le discours indirect', 30, 'Repères linguistiques — la phrase')
  ) AS v(title, position, theme), public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'anglais'
   AND c.level = 'Tle'
   AND c.title = v.title
   AND (c.position IS DISTINCT FROM v.position OR c.theme IS DISTINCT FROM v.theme);

-- 1. Chapitres -------------------------------------------------------------
-- Jointure sur le SLUG (et non le nom) : c’est la clé stable de `subjects`.
INSERT INTO public.chapters (id, subject_id, level, title, position, theme)
SELECT v.id, s.id, v.level, v.title, v.position, v.theme
  FROM (VALUES
    ('3c1dcbac-962d-55ef-84c7-9077ad730676'::uuid, 'anglais', 'Tle', 'Axe 1 — Espace privé et espace public', 1, 'Repères culturels — les six axes du programme'),
    ('3503f752-3133-5559-8086-1bda1a5e518e'::uuid, 'anglais', 'Tle', 'Axe 2 — Territoire et mémoire', 2, 'Repères culturels — les six axes du programme'),
    ('9002a344-ea11-589d-9774-77dea63ff3d6'::uuid, 'anglais', 'Tle', 'Axe 3 — Fictions et réalités', 3, 'Repères culturels — les six axes du programme'),
    ('85abce27-d584-5742-8959-d68d13c82c28'::uuid, 'anglais', 'Tle', 'Axe 4 — Enjeux et formes de la communication', 4, 'Repères culturels — les six axes du programme'),
    ('6a8722a8-3910-5289-9efa-ce934a8be19b'::uuid, 'anglais', 'Tle', 'Axe 5 — Citoyenneté et mondes virtuels', 5, 'Repères culturels — les six axes du programme'),
    ('b3f02b72-a771-5302-b784-a23bc05d95cf'::uuid, 'anglais', 'Tle', 'Axe 6 — Le Royaume-Uni et ses nations', 6, 'Repères culturels — les six axes du programme')
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
    ('3c1dcbac-962d-55ef-84c7-9077ad730676'::uuid, 'Repères culturels — les six axes du programme'),
    ('3503f752-3133-5559-8086-1bda1a5e518e'::uuid, 'Repères culturels — les six axes du programme'),
    ('9002a344-ea11-589d-9774-77dea63ff3d6'::uuid, 'Repères culturels — les six axes du programme'),
    ('85abce27-d584-5742-8959-d68d13c82c28'::uuid, 'Repères culturels — les six axes du programme'),
    ('6a8722a8-3910-5289-9efa-ce934a8be19b'::uuid, 'Repères culturels — les six axes du programme'),
    ('b3f02b72-a771-5302-b784-a23bc05d95cf'::uuid, 'Repères culturels — les six axes du programme')
  ) AS v(id, theme)
 WHERE c.id = v.id AND c.theme IS DISTINCT FROM v.theme;

-- 2. Leçons ----------------------------------------------------------------
INSERT INTO public.lessons (id, chapter_id, title, content, position) VALUES
  ('a4715957-f889-561a-bd3c-18a074ecc418', '3c1dcbac-962d-55ef-84c7-9077ad730676', 'Où s’arrête le privé, où commence le public', E'L’axe pose deux questions, reprises du programme : **quels sont les espaces de rencontre et les transitions entre l’espace privé et l’espace public ?** Et **dans quelle mesure la sphère privée peut-elle résister à l’intrusion de la sphère publique ?**\n\n## La frontière n’est pas un mur, c’est une zone\nEntre le *private* et le *public*, il existe tout un espace intermédiaire — ce que l’on appelle les *transitional spaces*. Le porche d’une maison américaine (*the porch*), le jardin partagé (*community garden*), le café où l’on travaille, l’open space : ni tout à fait chez soi, ni tout à fait dehors. C’est là que la vie sociale se fabrique.\n\n> L’axe ne demande pas de choisir un camp, mais de savoir décrire un DÉPLACEMENT de frontière, et de dire qui le décide.\n\n## Le corps, terrain du public\nLe programme cite « le corps des femmes : entre domaine public et sphère privée ». Aux États-Unis, la décision *Roe v. Wade* (1973) puis son annulation par la Cour suprême en 2022 (*Dobbs*) ont fait passer une question intime dans le débat politique national. Le vocabulaire lui-même est un combat : *pro-choice* contre *pro-life*.\n\n## Quand la foule juge : de Salem à aujourd’hui\nLes procès de Salem (1692) sont l’image fondatrice : une communauté qui transforme la rumeur en verdict. Arthur Miller s’en sert dans *The Crucible* (1953) pour parler du maccarthysme. Le mot *witch hunt* désigne aujourd’hui encore toute accusation collective menée sans preuve, et *trial by public opinion* le fait d’être jugé par les médias avant de l’être par un tribunal.\n\n## Le fait religieux\nDans beaucoup de pays anglophones, la religion irrigue les institutions : le souverain britannique est chef de l’Église d’Angleterre, et le président américain prête serment sur la Bible. La séparation à la française n’est pas la règle partout — c’est précisément ce que l’axe invite à comparer.\n\n## Le lexique attendu\n- Les lieux : *public facilities, neighbourhood, porch, workplace, co-working, gated community*\n- Les gestes : *to socialise, to interact, to intermingle, to commute, to be secluded*\n- Le procès : *trial, courtroom, jury, to sue, guilty, a culprit, whistle-blower, to prosecute*', 1),
  ('06038ce2-2864-505d-87f1-9ee6faf63f4f', '3503f752-3133-5559-8086-1bda1a5e518e', 'Ce qu’un lieu garde et ce qu’il tait', E'Le programme formule la question ainsi : **comment appréhender l’histoire pour construire un héritage collectif ?** Des peuples cherchent à faire entendre leur voix et à se réapproprier leur passé, en l’inscrivant dans des lieux.\n\n## Un lieu de mémoire, c’est une décision\nUn monument, un musée, une plaque, un nom de rue : rien de tout cela n’est naturel. Quelqu’un a décidé de ce qu’on garde et de ce qu’on oublie. C’est pourquoi le programme parle de « la CONSTRUCTION des lieux de mémoire ».\n\n> Retenir la formule : *memory is not the past — it is what a society decides to keep of it.*\n\n## Esclavage et colonisation\nLe monde anglophone travaille depuis vingt ans à rendre visible ce qu’il avait effacé. À Liverpool, l’*International Slavery Museum* est installé dans les docks mêmes d’où partaient les navires négriers. À Montgomery (Alabama), le *National Memorial for Peace and Justice* (2018) nomme plus de 4 000 victimes de lynchages. Le débat sur les statues (*to topple a statue*, Edward Colston à Bristol en 2020) est le prolongement direct de cet axe.\n\n## Le Commonwealth et ses commémorations\nLe *Remembrance Day* (11 novembre) et son coquelicot (*the poppy*) rassemblent le Royaume-Uni, le Canada, l’Australie et la Nouvelle-Zélande. L’*ANZAC Day* (25 avril) commémore le débarquement de Gallipoli : une défaite devenue acte de naissance de deux nations.\n\n## Territoires autochtones\nLe programme demande : « intégration, assimilation ou appropriation ? ». Le *Native Title* australien, les *First Nations* canadiennes et leur *Truth and Reconciliation Commission*, le traité de Waitangi en Nouvelle-Zélande : autant de cas où un territoire et une mémoire se disputent.\n\n## Le lexique attendu\n*slavery, enslavement, to rule over, former colonies, decolonisation, reparation, to demand, to call for, emancipation, heritage, landmark, to commemorate, to reclaim, indigenous, settler*', 1),
  ('c58bb9d1-db9e-5919-b4ba-7934d8867819', '9002a344-ea11-589d-9774-77dea63ff3d6', 'Ce que la fiction fait au réel', E'Question du programme : **comment s’articulent réalité et fantasme dans la construction d’un récit national ?** Et **dans quelle mesure la fiction se nourrit-elle du réel pour le questionner, le sublimer ou le réinventer ?**\n\n## Un récit national est une fiction efficace\nL’*American Dream* n’est pas un fait : c’est une histoire que l’Amérique se raconte — *from rags to riches*, chacun peut réussir par son seul mérite. Fitzgerald la met en pièces dans *The Great Gatsby* (1925) : Gatsby s’invente un passé, réussit, et meurt sans que personne ne vienne à son enterrement. Steinbeck fait de même dans *Of Mice and Men*.\n\n> Une fiction ne dit pas le contraire du réel : elle en fait apparaître ce qu’on ne voulait pas voir.\n\n## La dystopie comme avertissement\nOrwell (*Nineteen Eighty-Four*, 1949) invente *Big Brother*, la *Newspeak* et le *Ministry of Truth*. Huxley (*Brave New World*) imagine une servitude par le plaisir. Margaret Atwood (*The Handmaid’s Tale*, 1985) affirme n’avoir écrit aucun événement qui ne se soit déjà produit quelque part. Le programme parle de « la dystopie, une catharsis sociétale ? » : la fiction sert d’exutoire et d’alerte.\n\n## La société de classes britannique en fiction\nDe Dickens à *Downton Abbey*, en passant par Ken Loach : la fiction britannique met en scène des classes qui se croisent sans se mélanger. Elle représente ce système — et parfois le conteste (*to challenge, to question*).\n\n## Quand la science-fiction précède la science\nLe sous-marin de Jules Verne, les communicateurs de *Star Trek* devenus téléphones portables, les satellites imaginés par Arthur C. Clarke : la fiction fournit l’image avant que l’ingénieur ne fournisse l’objet.\n\n## Le lexique attendu\n*a myth, a narrative, to debunk, far-fetched, to sublimate, to reinvent, dystopia, utopia, a cautionary tale, self-made man, rags to riches, class divide, to challenge, to blur the line*', 1),
  ('9e720a73-a6bb-5ffa-8e44-3c9853cd7c7b', '85abce27-d584-5742-8959-d68d13c82c28', 'L’anglais, langue-monde : réunir ou uniformiser ?', E'Question du programme : **quel rôle singulier pour l’anglais, langue-monde ?** Cette langue est-elle capable de fédérer, de faire entendre des voix minoritaires, de saisir le monde dans sa complexité — mais aussi d’uniformiser ou de manipuler ?\n\n## Une langue devenue *lingua franca*\nEnviron 1,5 milliard de personnes parlent anglais, dont une large majorité ne l’a pas pour langue maternelle. On parle d’*English as a lingua franca* : la langue de la science, du commerce, d’Internet. Le programme demande si cette « nouvelle Tour de Babel » rapproche les peuples ou « aplanit les singularités ».\n\n> Une langue commune est un pont — et, pour les langues qu’elle remplace, une menace.\n\n## Des anglais au pluriel\nIl n’y a pas un anglais mais des *Englishes* : *Indian English*, *Nigerian English*, *Singlish* à Singapour, *African American Vernacular English*. Chacun a sa grammaire et son lexique. Une variété n’est pas un anglais raté : c’est une norme locale.\n\n## Le discours politique, de Churchill aux réseaux\nChurchill (*We shall fight on the beaches*, 1940) et Martin Luther King (*I have a dream*, 1963) construisent par l’anaphore et le rythme. Aujourd’hui la parole politique tient en 280 caractères. La forme a changé, la fonction demeure : convaincre.\n\n## Complotisme et vérité\nLe programme pose : « Chacun sa vérité ? Le défi du complotisme ». Les mots à connaître : *fake news*, *echo chamber* (on n’entend que ce qu’on pense déjà), *filter bubble*, *post-truth* (mot de l’année 2016 pour l’Oxford Dictionary), *conspiracy theory*.\n\n## Précautions sémantiques : inclusion, censure ou trahison ?\nRéécrire Roald Dahl ou Agatha Christie pour en retirer des termes jugés blessants : geste d’inclusion ou trahison de l’œuvre ? Le débat sur le *politically correct* et les *sensitivity readers* est explicitement au programme.\n\n## Le lexique attendu\n*lingua franca, native/non-native speaker, to convey, to put across, misleading, biased, echo chamber, filter bubble, post-truth, fake news, to debunk, wording, to water down, freedom of speech*', 1),
  ('86064262-b45e-5b2b-be2a-3b25fa7587bb', '6a8722a8-3910-5289-9efa-ce934a8be19b', 'Être citoyen quand la place publique est un écran', E'Question du programme : **à l’heure des mondes virtuels, quels sont les enjeux démocratiques dans les aires anglophones ?** Et **comment les citoyens peuvent-ils s’emparer des outils numériques et en garder la maîtrise ?**\n\n## Le numérique a déplacé l’agora\nUne pétition en ligne, un mot-dièse, une vidéo tournée au téléphone : #MeToo (2017) et #BlackLivesMatter (né en 2013) ont montré qu’un mouvement pouvait naître sans parti, sans journal, sans local. Le programme parle de « la parole sur les réseaux sociaux : portée et limites du pouvoir horizontal ».\n\n> Horizontal ne veut pas dire égal : la visibilité, elle, reste distribuée par un algorithme privé.\n\n## Vie connectée, vie exposée\n*Is a connected life an exposed life?* — l’objet d’étude est écrit ainsi au programme. Les notions : *digital footprint* (la trace qu’on laisse), *data privacy*, *surveillance capitalism* (Shoshana Zuboff), *the right to be forgotten*. Et son revers : *cyberbullying*, *doxxing*, *online harassment*.\n\n## Le jeu vidéo comme *soft power*\nLe programme demande si le jeu vidéo est « une nouvelle forme du soft power américain ». Le concept de *soft power* est de Joseph Nye : influencer par l’attrait plutôt que par la contrainte. Minecraft, Fortnite et GTA exportent des récits et des normes autant que Hollywood en son temps.\n\n## Apprendre à l’heure de l’IA\nDernier objet d’étude : les « nouvelles modalités d’apprentissage à l’heure de l’intelligence artificielle dans le monde éducatif anglophone ». Débat ouvert dans les universités britanniques et américaines : outil d’accessibilité ou machine à tricher ?\n\n## Le lexique attendu\n*digital footprint, data privacy, to opt out, surveillance, echo chamber, to go viral, grassroots movement, e-petition, digital divide, cyberbullying, accountability, soft power*', 1),
  ('060cc776-c982-5921-8f92-bf09b365f39c', 'b3f02b72-a771-5302-b784-a23bc05d95cf', 'Un royaume toujours uni ?', E'C’est **l’axe obligatoire** de la terminale : cinq axes sur six sont à traiter dans l’année, dont celui-ci nécessairement. Questions du programme : **comment les relations entre les différentes nations composant le Royaume-Uni ont-elles évolué ?** **Comment les identités se définissent-elles par rapport aux nations ?** **Quels sont les vecteurs d’union ?**\n\n## Trois mots à ne jamais confondre\n- **England** : une nation.\n- **Great Britain** : l’île — England + Scotland + Wales.\n- **The United Kingdom** : Great Britain + Northern Ireland. C’est l’État.\nQuatre nations, un seul État : c’est toute la tension de l’axe.\n\n## La dévolution\nDepuis 1998-1999, l’Écosse, le pays de Galles et l’Irlande du Nord ont leur parlement ou assemblée et leur *First Minister*. C’est la *devolution* : un transfert de compétences, sans indépendance. Le référendum écossais de 2014 a répondu *No* à 55 %.\n\n## Le Brexit a rouvert la question\nRéférendum de 2016 : 52 % pour le *Leave* à l’échelle du Royaume-Uni — mais l’Écosse a voté *Remain* à 62 % et l’Irlande du Nord à 56 %. D’où la relance de l’indépendantisme écossais et la question de la frontière irlandaise, réglée par le *Northern Ireland Protocol* puis le *Windsor Framework* (2023).\n\n## L’Irlande du Nord : identités plurielles\nL’accord du Vendredi saint (*Good Friday Agreement*, 1998) a mis fin aux *Troubles*. Il autorise la double nationalité britannique et irlandaise : on peut y être l’un, l’autre, ou les deux.\n\n## Écosse : Glasgow et Édimbourg\nLe programme met en regard « deux visages de l’Écosse en mutation » : Édimbourg, capitale politique et festivalière ; Glasgow, ville industrielle reconvertie.\n\n## Les vecteurs d’union\nLa monarchie, le NHS (*National Health Service*), la BBC — dont le programme demande si elle est un « vecteur de soft power britannique ».\n\n## Le lexique attendu\n*devolution, to break away from, dissent, dual identity, constituency, general election, Prime Minister, First Minister, Brexiteers, Labour, Tories, parliamentary monarchy, shared culture, working class*', 1)
ON CONFLICT DO NOTHING;

-- 3. Quiz ------------------------------------------------------------------
-- Double garde : ON CONFLICT (id) protège du rejeu, et le NOT EXISTS protège
-- la leçon d’un SECOND quiz venu d’ailleurs — le hub de leçon lit son quiz en
-- .maybeSingle(), deux quiz feraient lever « multiple rows » à de vrais élèves.
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.id, v.title, v.subject, v.grade_level, v.chapter, true, l.id
  FROM (VALUES
    ('229be02b-d17c-50ed-ac91-a1a4dcba11c2'::uuid, 'Quiz — Où s’arrête le privé, où commence le public', 'Anglais', 'Tle', 'Axe 1 — Espace privé et espace public', 'a4715957-f889-561a-bd3c-18a074ecc418'::uuid),
    ('0f0d5403-93b2-510f-adcf-ea3a0e7a6d0c'::uuid, 'Quiz — Ce qu’un lieu garde et ce qu’il tait', 'Anglais', 'Tle', 'Axe 2 — Territoire et mémoire', '06038ce2-2864-505d-87f1-9ee6faf63f4f'::uuid),
    ('809687d1-c612-59ac-b824-ced7c4406131'::uuid, 'Quiz — Ce que la fiction fait au réel', 'Anglais', 'Tle', 'Axe 3 — Fictions et réalités', 'c58bb9d1-db9e-5919-b4ba-7934d8867819'::uuid),
    ('fddabb11-0a15-5d52-968c-383d621abc32'::uuid, 'Quiz — L’anglais, langue-monde : réunir ou uniformiser ?', 'Anglais', 'Tle', 'Axe 4 — Enjeux et formes de la communication', '9e720a73-a6bb-5ffa-8e44-3c9853cd7c7b'::uuid),
    ('c8e087c5-e5d6-55f8-b8c9-2dd55d135d20'::uuid, 'Quiz — Être citoyen quand la place publique est un écran', 'Anglais', 'Tle', 'Axe 5 — Citoyenneté et mondes virtuels', '86064262-b45e-5b2b-be2a-3b25fa7587bb'::uuid),
    ('13bb01a6-d161-53e6-8ef8-f3c90af6bd90'::uuid, 'Quiz — Un royaume toujours uni ?', 'Anglais', 'Tle', 'Axe 6 — Le Royaume-Uni et ses nations', '060cc776-c982-5921-8f92-bf09b365f39c'::uuid)
  ) AS v(id, title, subject, grade_level, chapter, lesson_id)
  JOIN public.lessons l ON l.id = v.lesson_id
 WHERE NOT EXISTS (SELECT 1 FROM public.quizzes qz WHERE qz.lesson_id = l.id)
ON CONFLICT (id) DO NOTHING;

-- 4. Questions -------------------------------------------------------------
INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT v.id, v.quiz_id, v.question, v.kind, v.options, v.correct_index, v.explanation, v.position
  FROM (VALUES
    ('5446af39-7355-5170-80db-93455ad47967'::uuid, '229be02b-d17c-50ed-ac91-a1a4dcba11c2'::uuid, 'Que désigne-t-on par « transitional space » dans cet axe ?', 'mcq', '["Un lieu ni tout à fait privé ni tout à fait public, comme un porche ou un jardin partagé","Un logement temporaire pour personnes sans domicile","Un couloir de gare","Une salle d’attente médicale"]'::jsonb, 0, 'Le programme cite « nouvelles formes d’habitat urbain et espaces transitionnels : chez soi et ensemble ». Ce sont les seuils où la vie privée et la vie collective se touchent : *the porch*, le *community garden*, le café-bureau.', 1),
    ('2c519efd-b604-5a79-974b-f52fe99a9c1c'::uuid, '229be02b-d17c-50ed-ac91-a1a4dcba11c2'::uuid, 'Que s’est-il passé en 2022 concernant l’arrêt « Roe v. Wade » ?', 'mcq', '["La Cour suprême des États-Unis l’a annulé","Il a été inscrit dans la Constitution","Il a été étendu au Canada","Il a été confirmé à l’unanimité"]'::jsonb, 0, 'L’arrêt *Dobbs v. Jackson* (2022) a annulé *Roe v. Wade* (1973), renvoyant la question de l’avortement aux États fédérés. Un sujet intime redevenu enjeu politique national : c’est le cœur de l’axe.', 2),
    ('c9047a1b-b294-539a-aaaf-ed1aeae899dc'::uuid, '229be02b-d17c-50ed-ac91-a1a4dcba11c2'::uuid, 'À quoi renvoie l’expression « witch hunt » aujourd’hui ?', 'mcq', '["À une accusation collective menée sans preuve","À une fête d’Halloween","À une enquête judiciaire officielle","À un rite religieux protestant"]'::jsonb, 0, 'Née des procès de Salem (1692), l’expression désigne toute traque collective fondée sur le soupçon. Arthur Miller l’applique au maccarthysme dans *The Crucible*.', 3),
    ('b1c3a0cd-a498-5a10-9f98-e85c39ec7dd0'::uuid, '229be02b-d17c-50ed-ac91-a1a4dcba11c2'::uuid, 'Que signifie « trial by public opinion » ?', 'mcq', '["Être jugé par les médias et l’opinion avant tout tribunal","Un procès filmé et retransmis","Un jury tiré au sort parmi les citoyens","Un vote populaire sur une loi"]'::jsonb, 0, 'Littéralement « le procès par l’opinion publique » : la réputation est détruite avant qu’une justice ait statué. Terme central de l’axe, qui interroge l’intrusion du public dans le privé.', 4),
    ('3f6a2505-392c-55ff-8a49-7b9896351384'::uuid, '229be02b-d17c-50ed-ac91-a1a4dcba11c2'::uuid, 'Le souverain britannique est le chef de l’Église d’Angleterre.', 'true_false', '["Vrai","Faux"]'::jsonb, 0, 'Vrai. Depuis Henri VIII, le monarque porte le titre de *Supreme Governor of the Church of England*. Une illustration de ce que le programme appelle « la religion qui irrigue les institutions » dans les pays anglophones.', 5),
    ('4c5232da-08b5-5637-910d-bea8ca166780'::uuid, '229be02b-d17c-50ed-ac91-a1a4dcba11c2'::uuid, 'Que désigne « a gated community » ?', 'mcq', '["Un quartier résidentiel fermé, à accès contrôlé","Une communauté religieuse","Un forum en ligne privé","Un immeuble en copropriété"]'::jsonb, 0, 'Un lotissement clos par des grilles et un poste de garde, très répandu aux États-Unis. L’exemple type d’un espace qui privatise ce qui était public : la rue elle-même.', 6),
    ('360625f1-d63c-5588-9606-19ae89bfac6f'::uuid, '229be02b-d17c-50ed-ac91-a1a4dcba11c2'::uuid, 'Que veut dire le verbe « to commute » ?', 'mcq', '["Faire le trajet quotidien domicile-travail","Échanger un bien contre un autre","Commuer une peine de prison","Communiquer par messagerie"]'::jsonb, 0, '*To commute* = faire la navette entre chez soi et le travail ; *a commuter* est celui qui la fait. Le mot appartient au lexique des lieux publics et transitionnels de l’axe. (Le sens juridique « commuer » existe, mais ce n’est pas celui du programme.)', 7),
    ('ffc499eb-f519-5234-938c-654bc2758c08'::uuid, '229be02b-d17c-50ed-ac91-a1a4dcba11c2'::uuid, 'Que désigne « a whistle-blower » ?', 'mcq', '["Une personne qui révèle publiquement des faits répréhensibles de son organisation","Un arbitre sportif","Un policier en civil","Un témoin cité au tribunal"]'::jsonb, 0, 'Un lanceur d’alerte — littéralement « celui qui donne un coup de sifflet ». Figure exemplaire de l’axe : il fait passer de force une information privée dans l’espace public.', 8),
    ('3e3e4289-8e5f-5f3b-90bf-4fb2d26018cd'::uuid, '0f0d5403-93b2-510f-adcf-ea3a0e7a6d0c'::uuid, 'Que commémore l’ANZAC Day, le 25 avril ?', 'mcq', '["Le débarquement de Gallipoli en 1915","La fin de la Seconde Guerre mondiale","L’indépendance de l’Australie","L’arrivée du capitaine Cook"]'::jsonb, 0, 'ANZAC = *Australian and New Zealand Army Corps*. Le débarquement de Gallipoli (1915) fut une défaite militaire, devenue le récit fondateur de l’identité australienne et néo-zélandaise — exemple parfait d’une mémoire qui fabrique une nation.', 1),
    ('5fba1d25-9429-5bf5-a081-edf4b0842fe4'::uuid, '0f0d5403-93b2-510f-adcf-ea3a0e7a6d0c'::uuid, 'Quelle fleur est le symbole du Remembrance Day au Royaume-Uni ?', 'mcq', '["Le coquelicot (poppy)","La rose","Le chardon","Le trèfle"]'::jsonb, 0, '*The poppy*, inspiré du poème *In Flanders Fields*. Porté à la boutonnière début novembre dans tout le Commonwealth — un objet de mémoire partagé par plusieurs nations.', 2),
    ('92f28852-c0e9-5270-99fb-042826ad2760'::uuid, '0f0d5403-93b2-510f-adcf-ea3a0e7a6d0c'::uuid, 'Que s’est-il passé à Bristol en 2020 avec la statue d’Edward Colston ?', 'mcq', '["Des manifestants l’ont déboulonnée et jetée dans le port","Elle a été inaugurée","Elle a été classée monument historique","Elle a été vendue à un musée américain"]'::jsonb, 0, 'Colston, marchand d’esclaves du XVIIe siècle, était honoré d’une statue. Son déboulonnage (*toppling*) lors des manifestations de 2020 a ouvert un débat national sur ce que l’espace public doit célébrer.', 3),
    ('442441e4-1669-527a-8629-a7059cbea830'::uuid, '0f0d5403-93b2-510f-adcf-ea3a0e7a6d0c'::uuid, 'Où se trouve l’International Slavery Museum, et pourquoi à cet endroit ?', 'mcq', '["À Liverpool, dans les docks d’où partaient les navires négriers","À Londres, près du Parlement","À New York, sur Ellis Island","À Édimbourg, dans le château"]'::jsonb, 0, 'Le lieu fait partie du propos : le musée occupe les *Albert Docks* de Liverpool, port majeur de la traite. Le territoire porte la mémoire — c’est l’axe même.', 4),
    ('633fefdf-0992-5fd1-ba56-12e024a96721'::uuid, '0f0d5403-93b2-510f-adcf-ea3a0e7a6d0c'::uuid, 'Que signifie « to reclaim » dans le contexte de cet axe ?', 'mcq', '["Se réapproprier (un passé, une terre, un récit)","Réclamer un remboursement","Se plaindre officiellement","Recycler des matériaux"]'::jsonb, 0, '*To reclaim one’s history / one’s land* : reprendre ce dont on avait été dépossédé. Verbe clé de l’axe, notamment pour les peuples autochtones.', 5),
    ('84dba2dd-3cc9-5215-be1e-95c5ee36ee3e'::uuid, '0f0d5403-93b2-510f-adcf-ea3a0e7a6d0c'::uuid, 'Que désigne la « Truth and Reconciliation Commission » au Canada ?', 'mcq', '["Une commission sur les pensionnats imposés aux enfants autochtones","Un tribunal sur les crimes de guerre","Une réforme du système électoral","Une commission sur la corruption politique"]'::jsonb, 0, 'Créée en 2008, elle a documenté les *residential schools*, où des enfants des Premières Nations furent arrachés à leur famille pour être assimilés. Elle illustre « intégration, assimilation ou appropriation ? ».', 6),
    ('7446e06f-fdba-511b-9d96-815b2aa0b692'::uuid, '0f0d5403-93b2-510f-adcf-ea3a0e7a6d0c'::uuid, 'Un lieu de mémoire existe naturellement, indépendamment de tout choix politique.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'Faux — et c’est le cœur de l’axe. Le programme parle de la CONSTRUCTION des lieux de mémoire : une société décide ce qu’elle érige, ce qu’elle nomme et ce qu’elle laisse disparaître.', 7),
    ('1f79abd7-ce46-5aab-9054-e70a11cba46a'::uuid, '0f0d5403-93b2-510f-adcf-ea3a0e7a6d0c'::uuid, 'Que veut dire l’adjectif « indigenous » ?', 'mcq', '["Autochtone, natif d’un territoire","Pauvre","Indigné","Étranger"]'::jsonb, 0, '*Indigenous peoples* = les peuples autochtones (*Aboriginal Australians*, *First Nations*, *Māori*). Attention au faux ami avec « indigent » ou « indigné ».', 8),
    ('72893c81-25be-5fd7-aada-989b23b9b5c2'::uuid, '809687d1-c612-59ac-b824-ced7c4406131'::uuid, 'Dans « The Great Gatsby », que met en cause Fitzgerald ?', 'mcq', '["Le mythe du rêve américain","La monarchie britannique","La colonisation de l’Inde","La révolution industrielle"]'::jsonb, 0, 'Gatsby s’invente un passé et une fortune pour reconquérir Daisy — et meurt seul. Le roman montre que le *self-made man* se heurte à une société de classes que l’argent ne suffit pas à franchir.', 1),
    ('3b838fff-fd76-5bb2-86c8-8a153c76886d'::uuid, '809687d1-c612-59ac-b824-ced7c4406131'::uuid, 'Qui a écrit « Nineteen Eighty-Four » ?', 'mcq', '["George Orwell","Aldous Huxley","Ray Bradbury","Margaret Atwood"]'::jsonb, 0, 'Orwell, en 1949. Le roman a donné à l’anglais courant *Big Brother*, *Newspeak*, *doublethink* et *thought police* — une fiction devenue vocabulaire du réel.', 2),
    ('db0c2eb4-3f19-5840-ab69-116e2a10c991'::uuid, '809687d1-c612-59ac-b824-ced7c4406131'::uuid, 'Que signifie l’expression « from rags to riches » ?', 'mcq', '["Passer de la misère à la fortune","Perdre tout son argent","Vivre modestement par choix","Hériter d’une grande famille"]'::jsonb, 0, 'Littéralement « des haillons à la richesse ». La formule condense le récit du *self-made man*, cœur du rêve américain — et la cible des fictions qui le questionnent.', 3),
    ('1f26b54c-21e2-5626-9b7c-db5ccbc992ce'::uuid, '809687d1-c612-59ac-b824-ced7c4406131'::uuid, 'Qu’affirme Margaret Atwood au sujet de « The Handmaid’s Tale » ?', 'mcq', '["Qu’elle n’y a mis aucun événement qui ne se soit déjà produit quelque part","Qu’il s’agit d’une pure invention sans lien avec l’histoire","Qu’il décrit exclusivement le Canada contemporain","Qu’il s’agit d’une autobiographie"]'::jsonb, 0, 'C’est ce qui rend la dystopie efficace : elle recompose du réel attesté. La fiction ne s’oppose pas au vrai, elle le réagence pour le rendre visible.', 4),
    ('79f1becc-aefa-5984-94f3-df3feb62fdcd'::uuid, '809687d1-c612-59ac-b824-ced7c4406131'::uuid, 'Que veut dire le verbe « to debunk » ?', 'mcq', '["Démystifier, démonter une idée fausse","Publier un livre","Exagérer un récit","Adapter au cinéma"]'::jsonb, 0, '*To debunk a myth* = démonter un mythe en le confrontant aux faits. Verbe clé quand l’axe demande d’articuler fiction et réalité.', 5),
    ('a96f043e-0700-5d4a-b432-7dd4d86811ab'::uuid, '809687d1-c612-59ac-b824-ced7c4406131'::uuid, 'Que désigne « a cautionary tale » ?', 'mcq', '["Un récit qui met en garde","Un conte pour enfants","Une histoire vraie","Un roman policier"]'::jsonb, 0, 'Un récit-avertissement. C’est la fonction que le programme prête à la dystopie : montrer où mène une tendance pour qu’on ne l’y laisse pas aller.', 6),
    ('a55fffc0-9852-5a92-a9f3-287954cf382d'::uuid, '809687d1-c612-59ac-b824-ced7c4406131'::uuid, 'La science-fiction a parfois précédé et inspiré des innovations techniques réelles.', 'true_false', '["Vrai","Faux"]'::jsonb, 0, 'Vrai — le programme en fait un objet d’étude : « quand la science-fiction nourrit l’innovation scientifique ». Les communicateurs de *Star Trek* ont précédé le téléphone mobile, Arthur C. Clarke a décrit le satellite géostationnaire en 1945.', 7),
    ('72f8ec46-f92f-5a7b-ac19-da5d079c0812'::uuid, '809687d1-c612-59ac-b824-ced7c4406131'::uuid, 'Que signifie « to blur the line between fiction and reality » ?', 'mcq', '["Brouiller la frontière entre fiction et réalité","Tracer une ligne nette entre les deux","Interdire la fiction","Traduire une œuvre"]'::jsonb, 0, '*To blur* = rendre flou. L’expression décrit exactement ce que l’axe met en question : le moment où l’on ne distingue plus le récit du fait.', 8),
    ('a6889fe1-6837-5090-884f-167940068793'::uuid, 'fddabb11-0a15-5d52-968c-383d621abc32'::uuid, 'Que désigne l’expression « English as a lingua franca » ?', 'mcq', '["L’anglais utilisé comme langue commune entre locuteurs de langues maternelles différentes","L’anglais parlé uniquement en Angleterre","Un mélange d’anglais et de français","L’anglais littéraire du XIXe siècle"]'::jsonb, 0, 'Une *lingua franca* est une langue véhiculaire. La majorité des échanges en anglais dans le monde se font aujourd’hui entre locuteurs non natifs — d’où la question du programme sur la « nouvelle Tour de Babel ».', 1),
    ('0066acb1-8c3e-5ae3-9acb-0d7fe241112f'::uuid, 'fddabb11-0a15-5d52-968c-383d621abc32'::uuid, 'Que signifie « echo chamber » dans le débat sur l’information ?', 'mcq', '["Un espace où l’on n’est exposé qu’à des opinions déjà semblables aux siennes","Un studio d’enregistrement","Une salle de conférence de presse","Un dispositif de traduction simultanée"]'::jsonb, 0, 'La « chambre d’écho » renvoie à l’utilisateur sa propre opinion, amplifiée. Voisine de la *filter bubble*, elle explique comment une croyance se durcit sans jamais rencontrer de contradiction.', 2),
    ('83c5321e-966d-51be-b51f-d549e98dd77b'::uuid, 'fddabb11-0a15-5d52-968c-383d621abc32'::uuid, 'Que veut dire « post-truth » ?', 'mcq', '["Se dit d’une situation où l’émotion pèse plus que les faits dans l’opinion","Une vérité démontrée après coup","Un article publié après vérification","Une déclaration officielle"]'::jsonb, 0, 'Mot de l’année 2016 pour l’Oxford Dictionary : *relating to circumstances in which objective facts are less influential than appeals to emotion*. Terme central du « défi du complotisme ».', 3),
    ('a2252889-b8e5-5a89-95a8-14d16796ac15'::uuid, 'fddabb11-0a15-5d52-968c-383d621abc32'::uuid, 'Quel procédé rhétorique structure « I have a dream » de Martin Luther King ?', 'mcq', '["L’anaphore — la répétition d’une même formule en tête de phrase","L’ellipse","La litote","Le calembour"]'::jsonb, 0, 'La répétition de *I have a dream that one day…* donne au discours son rythme et sa force mémorielle. Le programme met en regard « la forme et la portée du discours politique, de Winston Churchill aux réseaux sociaux ».', 4),
    ('054335d1-ad80-5b82-879b-8046b4f47f67'::uuid, 'fddabb11-0a15-5d52-968c-383d621abc32'::uuid, 'Il existe plusieurs variétés d’anglais dotées chacune de règles propres.', 'true_false', '["Vrai","Faux"]'::jsonb, 0, 'Vrai. *Indian English*, *Nigerian English*, *Singlish*, AAVE : ce sont des normes constituées, pas des fautes. Le programme demande précisément si l’anglais-monde « fait entendre des voix minoritaires » ou « aplanit les singularités ».', 5),
    ('3804e5cd-1817-5cd8-a570-8b78fd6e9893'::uuid, 'fddabb11-0a15-5d52-968c-383d621abc32'::uuid, 'Que désigne « a sensitivity reader » ?', 'mcq', '["Une personne chargée de relire un texte pour en signaler les passages potentiellement blessants","Un lecteur de livres audio","Un critique littéraire de presse","Un correcteur orthographique automatique"]'::jsonb, 0, 'Au cœur de l’objet d’étude « les précautions sémantiques dans les œuvres : inclusion, censure ou trahison ? », qu’ont ravivé les réécritures de Roald Dahl et d’Agatha Christie.', 6),
    ('d41b5105-d54f-52e9-bee7-d21136fd5fbb'::uuid, 'fddabb11-0a15-5d52-968c-383d621abc32'::uuid, 'Que signifie l’adjectif « biased » ?', 'mcq', '["Partial, orienté","Fondé sur des preuves","Traduit","Officiel"]'::jsonb, 0, '*A biased account* = un récit partial. Avec *misleading* (trompeur), c’est le mot que l’épreuve attend pour qualifier une source dans cet axe.', 7),
    ('089e0678-5a50-564c-a17e-89147c988b42'::uuid, 'fddabb11-0a15-5d52-968c-383d621abc32'::uuid, 'Que veut dire « to water down a statement » ?', 'mcq', '["En atténuer la force, l’édulcorer","Le traduire mot à mot","Le publier intégralement","Le démentir formellement"]'::jsonb, 0, 'Littéralement « le diluer ». Verbe utile pour décrire une reformulation qui ménage — au risque, dit le programme, de trahir.', 8),
    ('91ccff41-29fd-5592-8c09-a046705591e8'::uuid, 'c8e087c5-e5d6-55f8-b8c9-2dd55d135d20'::uuid, 'Qui a forgé la notion de « soft power » ?', 'mcq', '["Joseph Nye","Noam Chomsky","Shoshana Zuboff","Marshall McLuhan"]'::jsonb, 0, 'Le politologue américain Joseph Nye : la capacité d’obtenir ce que l’on veut par l’attrait culturel plutôt que par la contrainte. Le programme l’applique au jeu vidéo.', 1),
    ('8bb2970e-f68a-55d1-9f8d-7628861f8846'::uuid, 'c8e087c5-e5d6-55f8-b8c9-2dd55d135d20'::uuid, 'Que désigne « a digital footprint » ?', 'mcq', '["L’ensemble des traces qu’une personne laisse en ligne","La consommation électrique d’un ordinateur","Une signature électronique certifiée","La taille d’un fichier téléchargé"]'::jsonb, 0, '« L’empreinte numérique » : publications, recherches, achats, déplacements. Notion centrale de l’objet d’étude « la vie connectée est-elle synonyme de vie exposée ? ».', 2),
    ('13ceb855-785d-587e-bef3-ef937219d27f'::uuid, 'c8e087c5-e5d6-55f8-b8c9-2dd55d135d20'::uuid, 'Que signifie « a grassroots movement » ?', 'mcq', '["Un mouvement né de la base, sans organisation dirigeante","Un mouvement écologiste","Un parti politique traditionnel","Une campagne financée par un gouvernement"]'::jsonb, 0, 'Littéralement « à la racine de l’herbe » : parti des citoyens eux-mêmes. C’est le « pouvoir horizontal » dont le programme demande d’évaluer la portée ET les limites.', 3),
    ('3768c15a-9e9c-5fcd-97d5-8a90d9ecbfac'::uuid, 'c8e087c5-e5d6-55f8-b8c9-2dd55d135d20'::uuid, 'Que désigne le « digital divide » ?', 'mcq', '["L’écart d’accès et de maîtrise du numérique entre populations","La séparation entre logiciels libres et propriétaires","Un désaccord politique en ligne","La scission d’un réseau social en deux plateformes"]'::jsonb, 0, 'La « fracture numérique » : sans accès ni compétence, la citoyenneté en ligne reste théorique. Un contrepoids indispensable à l’idée d’un espace numérique égalitaire.', 4),
    ('1c6c0457-3178-5fc1-89a2-faf888493f6c'::uuid, 'c8e087c5-e5d6-55f8-b8c9-2dd55d135d20'::uuid, 'Le mouvement #BlackLivesMatter a d’abord émergé sur les réseaux sociaux.', 'true_false', '["Vrai","Faux"]'::jsonb, 0, 'Vrai. Né en 2013 comme mot-dièse après l’acquittement de George Zimmerman, il est devenu un mouvement international — cas d’école du « pouvoir horizontal ».', 5),
    ('54dc1ca2-4419-5ebd-a901-15bce8dd7439'::uuid, 'c8e087c5-e5d6-55f8-b8c9-2dd55d135d20'::uuid, 'Que signifie « to opt out » ?', 'mcq', '["Choisir de ne pas participer, se retirer d’un dispositif","S’inscrire à un service","Optimiser un réglage","Voter contre une loi"]'::jsonb, 0, '*To opt out of data collection* = refuser la collecte de ses données. Son contraire est *to opt in*. Verbe indispensable pour parler de maîtrise des outils numériques.', 6),
    ('91bfe6f3-ee28-5b78-ac66-73a449b70a7a'::uuid, 'c8e087c5-e5d6-55f8-b8c9-2dd55d135d20'::uuid, 'Que désigne « accountability » ?', 'mcq', '["L’obligation de rendre des comptes","La comptabilité d’entreprise","Un compte utilisateur","Le nombre d’abonnés"]'::jsonb, 0, 'Faux ami à connaître : *accountability* = la responsabilité au sens de devoir répondre de ses actes. Terme clé quand on demande des comptes à une plateforme.', 7),
    ('c2347102-86fc-597a-93cc-b6bc2fc995ae'::uuid, 'c8e087c5-e5d6-55f8-b8c9-2dd55d135d20'::uuid, 'Que désigne « surveillance capitalism », selon Shoshana Zuboff ?', 'mcq', '["Un modèle économique fondé sur l’exploitation commerciale des données personnelles","La surveillance policière des rues par caméras","Le contrôle des marchés financiers","L’espionnage industriel entre entreprises"]'::jsonb, 0, 'Zuboff décrit un capitalisme dont la matière première est l’expérience humaine transformée en données prédictives. Notion attendue sur l’axe pour dépasser le simple constat « les réseaux nous surveillent ».', 8),
    ('0725646b-f14c-5404-99cd-2560e19c73e7'::uuid, '13bb01a6-d161-53e6-8ef8-f3c90af6bd90'::uuid, 'Que comprend le Royaume-Uni que la Grande-Bretagne ne comprend pas ?', 'mcq', '["L’Irlande du Nord","Le pays de Galles","L’Écosse","L’île de Man"]'::jsonb, 0, '*Great Britain* = Angleterre + Écosse + pays de Galles (l’île). *The United Kingdom* y ajoute l’Irlande du Nord. Distinction fondatrice de l’axe — et faute classique à l’épreuve.', 1),
    ('2a14ebc3-7b15-596f-9471-6e9945b59d06'::uuid, '13bb01a6-d161-53e6-8ef8-f3c90af6bd90'::uuid, 'Que désigne la « devolution » au Royaume-Uni ?', 'mcq', '["Le transfert de compétences à des parlements nationaux, sans indépendance","La sortie de l’Union européenne","L’abolition de la monarchie","Le retour de pouvoirs vers Londres"]'::jsonb, 0, 'Engagée en 1998-1999, elle a doté l’Écosse, le pays de Galles et l’Irlande du Nord de leur propre assemblée et de leur *First Minister*. Autonomie, pas souveraineté.', 2),
    ('10895b63-c3b4-5fdf-8044-63d4a2fcd389'::uuid, '13bb01a6-d161-53e6-8ef8-f3c90af6bd90'::uuid, 'Quel a été le résultat du référendum d’indépendance écossais de 2014 ?', 'mcq', '["Le « non » l’a emporté avec environ 55 % des voix","Le « oui » l’a emporté de justesse","Le référendum a été annulé","Le résultat fut une égalité parfaite"]'::jsonb, 0, '55 % de *No*, 45 % de *Yes*. Le Brexit de 2016, rejeté par l’Écosse, a relancé la revendication d’un second référendum.', 3),
    ('1483c3cd-9409-5ca3-b12e-45e0ba205588'::uuid, '13bb01a6-d161-53e6-8ef8-f3c90af6bd90'::uuid, 'Comment l’Écosse a-t-elle voté au référendum sur le Brexit en 2016 ?', 'mcq', '["Majoritairement pour rester dans l’UE (Remain), à environ 62 %","Majoritairement pour le Leave, à environ 62 %","À égalité parfaite","Elle n’a pas participé au vote"]'::jsonb, 0, 'L’Écosse a voté *Remain* à 62 % et l’Irlande du Nord à 56 %, tandis que le Royaume-Uni dans son ensemble votait *Leave* à 52 %. Cet écart entre nations est le nœud de l’axe.', 4),
    ('250098a9-2996-5893-8fa4-bd4e72e2658f'::uuid, '13bb01a6-d161-53e6-8ef8-f3c90af6bd90'::uuid, 'Qu’a établi le Good Friday Agreement de 1998 ?', 'mcq', '["La paix en Irlande du Nord et le droit à la double nationalité","L’indépendance de l’Irlande du Nord","La sortie du Royaume-Uni de l’UE","La création du Parlement écossais uniquement"]'::jsonb, 0, 'L’accord du Vendredi saint met fin aux *Troubles* et reconnaît que l’on peut être britannique, irlandais, ou les deux — l’illustration même des « identités plurielles » du programme.', 5),
    ('739b16ff-2a7d-590f-86c0-420fd69806d0'::uuid, '13bb01a6-d161-53e6-8ef8-f3c90af6bd90'::uuid, 'Comment appelle-t-on le chef du gouvernement écossais ?', 'mcq', '["First Minister","Prime Minister","Chancellor","Lord Mayor"]'::jsonb, 0, 'Le *First Minister* dirige le gouvernement dévolu d’Écosse (comme au pays de Galles et en Irlande du Nord). Le *Prime Minister* est le chef du gouvernement du Royaume-Uni, à Londres.', 6),
    ('7cfa3eaf-ec70-5923-be6c-329a912d7783'::uuid, '13bb01a6-d161-53e6-8ef8-f3c90af6bd90'::uuid, 'L’axe 6 est le seul dont le traitement est obligatoire en terminale.', 'true_false', '["Vrai","Faux"]'::jsonb, 0, 'Vrai. Le programme précise : « Cinq axes parmi les six proposés doivent être traités pendant l’année, dont obligatoirement l’axe 6 ». La focale sur le Royaume-Uni est imposée en terminale.', 7),
    ('18705ceb-d039-550f-8e2c-0e58181e06aa'::uuid, '13bb01a6-d161-53e6-8ef8-f3c90af6bd90'::uuid, 'Que désigne « a constituency » ?', 'mcq', '["Une circonscription électorale","Une constitution écrite","Un parti politique","Une commission parlementaire"]'::jsonb, 0, 'Le Royaume-Uni compte 650 *constituencies*, chacune élisant un député aux Communes au scrutin majoritaire à un tour (*first-past-the-post*). Les électeurs d’une circonscription sont ses *constituents*.', 8)
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
   WHERE s.slug IN ('anglais');
  SELECT count(*) INTO n_vides FROM public.subjects s
   WHERE s.slug IN ('anglais')
     AND NOT EXISTS (SELECT 1 FROM public.chapters c WHERE c.subject_id = s.id);
  IF n_vides > 0 THEN
    RAISE EXCEPTION 'Migration 235 incomplète : % matiere(s) encore sans chapitre', n_vides;
  END IF;
  RAISE NOTICE 'Migration 235 OK : % chapitres sur les matieres visees.', n_chap;
END $$;
