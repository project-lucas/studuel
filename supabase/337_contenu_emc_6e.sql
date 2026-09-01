-- =============================================================================
-- Studuel — Migration 337 : EMC 6e — LE PROGRAMME DU CYCLE 3 (8 fiches)
--
-- ⚠️ FICHIER GÉNÉRÉ — ne pas éditer à la main.
--    Source : scripts/contenu/*.mjs
--    Regénérer : node scripts/seed-contenu.mjs --num 337 --modules emc-6e
--
-- CONSTAT : l'EMC de 6e n'avait que TROIS chapitres hérités du premier jeu de
-- données, pour une année entière. Le lycée a reçu ses programmes (230, 277, 284),
-- le collège est resté aux seeds d'origine. Un élève qui révisait le harcèlement,
-- la laïcité, la devise de la République, la différence entre règle et loi ou
-- l'engagement ne trouvait presque RIEN.
-- Cette migration installe 8 fiches sous les 3 chapitres du programme et retire les
-- 3 chapitres génériques.
-- ÉCRITE POUR LE CYCLE 3, séparément du cycle 4 : le programme d'EMC est rédigé par
-- cycle, et la 6e aborde les mêmes notions à partir de l'expérience immédiate de
-- l'élève — la classe, la cour, le collège — là où le cycle 4 les reprend au niveau
-- du droit et des institutions.
-- PÉRIMÈTRE : la SIXIÈME SEULE — le ménage est borné à level = '6e'.
--
-- Cette migration apporte : 8 chapitres, 8 leçons,
-- 8 quiz et 64 questions, sur 1 matière.
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
-- [emc] La colonne chapters.theme (migration 234) porte le chapitre du programme, et
-- [emc] l'INSERT l'écrit pour les 8 fiches. Elle est REPRISE ici en ADD COLUMN IF NOT
-- [emc] EXISTS parce qu'on ne peut pas garantir que la 234 soit passée en production.
-- [emc] Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
-- [emc] chapters et ne l'a rendu que colonne par colonne.
ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;

-- [emc] Les 3 chapitres hérités partent, au niveau 6e SEULEMENT.
-- [emc] 
-- [emc] LE REPÈRE EST theme IS NULL, PAS LE TITRE — et il compte ici : la fiche neuve
-- [emc] « Le respect d'autrui, et les différences » est proche du chapitre hérité « Le
-- [emc] respect d'autrui », et chapters impose UNIQUE(subject_id, level, title). Le
-- [emc] critère « pas de chapitre de programme » vise exactement les trois lignes
-- [emc] voulues ; les 8 fiches neuves portent un thème dès l'INSERT, et le ménage tourne
-- [emc] AVANT elles.
-- [emc] Le filtre level = '6e' est indispensable : l'EMC existe sur sept niveaux, dont
-- [emc] trois ont déjà leur module au lycée.
DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'emc'
   AND c.level = '6e'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'emc'
   AND c.level = '6e'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'emc'
   AND c.level = '6e'
   AND c.theme IS NULL;

-- 1. Chapitres -------------------------------------------------------------
-- Jointure sur le SLUG (et non le nom) : c’est la clé stable de `subjects`.
INSERT INTO public.chapters (id, subject_id, level, title, position, theme)
SELECT v.id, s.id, v.level, v.title, v.position, v.theme
  FROM (VALUES
    ('ac90145b-f5e8-5758-a693-20adf8c54b69'::uuid, 'emc', '6e', 'Le respect d’autrui, et les différences', 1, 'Respecter autrui'),
    ('0165dc05-4a53-5233-b1a2-4a0dbe4ac780'::uuid, 'emc', '6e', 'Le harcèlement : reconnaître et agir', 2, 'Respecter autrui'),
    ('fe11dd4d-cfdf-5a34-8513-38a2d70c829d'::uuid, 'emc', '6e', 'L’égalité entre les filles et les garçons', 3, 'Respecter autrui'),
    ('74137f62-de99-5c1d-a450-5a479535c67b'::uuid, 'emc', '6e', 'Les symboles de la République française', 4, 'Les valeurs et symboles de la République'),
    ('fcdb2e20-7248-5c26-b40a-566f95c96d13'::uuid, 'emc', '6e', 'La devise : liberté, égalité, fraternité', 5, 'Les valeurs et symboles de la République'),
    ('ebc93d31-f95a-5be1-a7e6-27c3575ae336'::uuid, 'emc', '6e', 'La laïcité à l’école', 6, 'Les valeurs et symboles de la République'),
    ('a2dd6f82-d9ec-57b4-ac59-63700189c6a2'::uuid, 'emc', '6e', 'La règle et la loi', 7, 'Construire une culture civique'),
    ('9875e9aa-116d-5019-85f1-667cf8385bb8'::uuid, 'emc', '6e', 'S’engager : le délégué, les associations, les secours', 8, 'Construire une culture civique')
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
    ('ac90145b-f5e8-5758-a693-20adf8c54b69'::uuid, 'Respecter autrui'),
    ('0165dc05-4a53-5233-b1a2-4a0dbe4ac780'::uuid, 'Respecter autrui'),
    ('fe11dd4d-cfdf-5a34-8513-38a2d70c829d'::uuid, 'Respecter autrui'),
    ('74137f62-de99-5c1d-a450-5a479535c67b'::uuid, 'Les valeurs et symboles de la République'),
    ('fcdb2e20-7248-5c26-b40a-566f95c96d13'::uuid, 'Les valeurs et symboles de la République'),
    ('ebc93d31-f95a-5be1-a7e6-27c3575ae336'::uuid, 'Les valeurs et symboles de la République'),
    ('a2dd6f82-d9ec-57b4-ac59-63700189c6a2'::uuid, 'Construire une culture civique'),
    ('9875e9aa-116d-5019-85f1-667cf8385bb8'::uuid, 'Construire une culture civique')
  ) AS v(id, theme)
 WHERE c.id = v.id AND c.theme IS DISTINCT FROM v.theme;

-- 2. Leçons ----------------------------------------------------------------
INSERT INTO public.lessons (id, chapter_id, title, content, position) VALUES
  ('5efa0556-1677-5d16-95a6-93d4005256d1', 'ac90145b-f5e8-5758-a693-20adf8c54b69', 'Vivre ensemble sans se ressembler', E'Respecter quelqu’un, ce n’est pas être d’accord avec lui. C’est refuser de le rabaisser.\n\n## Ce qu’est le respect\nReconnaître qu’une personne a la **même valeur** que soi, même si elle ne pense pas, ne croit pas, ne vit pas comme soi.\n\n## La dignité\n= La dignité ne se mérite pas et ne se perd pas\n\nElle ne dépend ni des notes, ni de l’argent, ni de l’apparence, ni de l’origine.\n\n> C’est le fondement de **tous** les droits : si la dignité se méritait, les droits se retireraient.\n\n## Les différences\nOrigine, religion ou absence de religion, famille, santé, handicap, goûts : ces différences sont **normales**.\n\n!> Un groupe où tout le monde serait identique **n’existe pas**. La question n’est donc jamais « faut-il des différences ? », mais « comment vit-on avec ? ».\n\n## Le préjugé et le stéréotype\n| Le mot | Ce qu’il est | Exemple |\n| Le **stéréotype** | Une idée toute faite sur un **groupe** | « Les filles sont… », « les garçons sont… » |\n| Le **préjugé** | Un jugement porté **avant** de connaître | |\n\nTous deux se répandent **sans preuve**, et font mal parce qu’ils traitent une personne comme un **exemplaire de son groupe**.\n\n> On ne choisit pas d’avoir des préjugés : on les reçoit. Mais on peut choisir de les **vérifier** avant d’agir dessus.\n\n## La discrimination\n= Traiter quelqu’un moins bien à cause de son origine, son sexe, sa religion, son handicap ou son apparence\n\n!> Ce n’est pas seulement impoli : c’est **interdit par la loi**. C’est un **délit**.\n\n## Le respect en actes\n~ Écouter sans couper → ne pas se moquer → ne pas surnommer sans accord → s’excuser quand on a blessé\n\n> Le respect n’est pas une intention : c’est une suite de gestes qui **se voient**.', 1),
  ('b73dcc5c-1684-5edf-8d56-2b1d9c079c07', '0165dc05-4a53-5233-b1a2-4a0dbe4ac780', 'Ce n’est jamais « juste pour rire »', E'Le harcèlement s’effondre presque toujours quand les témoins cessent d’être un public.\n\n## La définition\nUne violence **répétée**, exercée contre quelqu’un qui ne peut pas se défendre. Trois éléments le caractérisent :\n\n1. la **répétition** ;\n2. l’**intention** de nuire ;\n3. le **déséquilibre** de force — en nombre, en popularité, en âge.\n\n!> Une dispute entre **deux élèves à égalité** n’est pas du harcèlement. Une moquerie répétée par un **groupe** contre une même personne, si. Les trois critères comptent ensemble.\n\n## Les formes\n| La forme | Exemples |\n| **Verbale** | Moqueries, insultes, surnoms |\n| **Sociale** | Mise à l’écart, rumeurs |\n| **Matérielle** | Vol ou dégradation d’affaires |\n| **Physique** | Coups, bousculades |\n| **Cyber** | Messages, photos, comptes créés pour nuire |\n\n## Pourquoi le cyberharcèlement est pire\n| Ce qui change | Sa conséquence |\n| Il ne s’arrête pas à la grille | Il suit la victime **chez elle**, **la nuit** |\n| Les traces restent | Elles se **rediffusent** indéfiniment |\n| L’écran | Le harceleur se croit protégé — alors qu’une **adresse IP s’identifie** |\n\n## Les trois rôles\n| Le rôle | Ce qu’il faut savoir |\n| La **victime** | Elle ne « l’a pas cherché ». **Personne ne mérite d’être harcelé** |\n| Les **harceleurs** | |\n| Les **témoins** | Ce sont eux qui font tout basculer |\n\n!> Un groupe qui rit **encourage** ; un groupe qui refuse **arrête**. Ne rien faire, c’est **déjà choisir un camp**.\n\n## Que faire\n~ En parler à un adulte → conserver les preuves (captures d’écran) → ne pas répondre aux provocations → bloquer\n\n!> **Signaler n’est pas rapporter.** Rapporter, c’est nuire à quelqu’un ; **signaler, c’est protéger**.\n\n## Les numéros\n| Le numéro | Pour quoi |\n| **3018** | Harcèlement et cyberharcèlement — gratuit et anonyme |\n| **119** | Enfance en danger |\n\n@ 2022 — Le harcèlement scolaire devient un délit puni par la loi, y compris pour les mineurs', 1),
  ('9c457a3d-ca26-5766-b1a2-ea06fa47652e', 'fe11dd4d-cfdf-5a34-8513-38a2d70c829d', 'Le même droit, et la même liberté de choisir', E'Un droit inscrit dans la loi n’est pas encore une réalité dans les faits. C’est justement pour cela qu’on continue d’en parler.\n\n## Le principe\nFilles et garçons ont **les mêmes droits** : même école, mêmes matières, mêmes métiers possibles, même liberté de choisir. C’est inscrit dans la **Constitution** et dans la loi.\n\n## Ce qui gêne encore\n| L’obstacle | Comment il agit |\n| Les **stéréotypes** | « Les maths, c’est pour les garçons », « le soin, c’est pour les filles » : rien ne les fonde, et ils orientent pourtant des choix d’études à 15 ans |\n| Le partage de l’**espace** | Dans une cour de récréation, le terrain central est le plus souvent occupé par des garçons |\n| Les **remarques** sur l’apparence | Plus fréquentes envers les filles |\n\n## Dans le monde du travail\n@ 1972 — La loi impose l’égalité salariale en France\n\n!> Elle **n’est toujours pas atteinte** : à travail comparable, les femmes gagnent encore moins, et les postes de direction leur sont moins ouverts.\n\n## Le sexisme\n= Traiter quelqu’un moins bien, ou le juger, à cause de son sexe\n\nBlagues rabaissantes, remarques sur le corps, insultes genrées.\n\n> Ce ne sont pas des maladresses : ce sont des **atteintes**.\n\n## Le consentement et le respect du corps\n!> Personne n’a le droit de toucher quelqu’un **sans son accord**. Le **consentement** est libre, clair, et peut être **retiré à tout moment** — à tout âge et dans toutes les situations.\n\n## Agir\n~ Ne pas rire d’une blague sexiste → ne pas relayer une image → dire quand ce n’est pas normal → en parler à un adulte', 1),
  ('d6c88da6-1dba-52db-816a-e6db664ebae4', '74137f62-de99-5c1d-a450-5a479535c67b', 'Ce qui représente la France', E'Un symbole n’est pas une décoration : c’est un raccourci qui rappelle une histoire commune.\n\n## Le drapeau tricolore\n| La couleur | Son origine |\n| Le **bleu** et le **rouge** | Les couleurs de **Paris** |\n| Le **blanc** | La couleur du **roi** |\n\n@ 1790 — Naissance du drapeau tricolore, qui réunit la ville et la monarchie\n\nIl flotte sur les bâtiments publics.\n\n## La Marseillaise\n@ 1792 — Rouget de Lisle l’écrit à Strasbourg, comme chant de guerre\n@ 1879 — Elle devient hymne national\n\nElle doit son nom aux **fédérés marseillais** qui la chantaient en montant à Paris.\n\n## Marianne\nUne figure de femme coiffée du **bonnet phrygien**, porté par les **esclaves affranchis** de Rome : elle représente la **liberté** et la République.\n\n> On la trouve dans toutes les mairies et sur les timbres.\n\n## La devise\n= Liberté, Égalité, Fraternité\n\nApparue pendant la Révolution, officielle sous la Troisième République. Elle est gravée au fronton des mairies et des écoles.\n\n## Le 14 Juillet\n@ 1880 — Le 14 Juillet devient fête nationale\n\n!> Il commémore **deux** événements : la prise de la **Bastille** (1789) **et** la **Fête de la Fédération** (1790), qui célébrait l’unité de la Nation.\n\n## Le coq gaulois\nUn symbole plus ancien et **non officiel**, né d’un jeu de mots latin : *gallus* signifie à la fois « coq » et « gaulois ». On le voit surtout dans le sport.\n\n## À quoi ça sert\n> Les symboles disent qu’au-delà des différences, les citoyens appartiennent à une **même communauté politique**. Ils sont visibles partout précisément pour être un rappel quotidien.', 1),
  ('53d9db4c-cd59-5c7c-af68-bc851aab76a5', 'fcdb2e20-7248-5c26-b40a-566f95c96d13', 'Trois mots, trois exigences', E'Liberté et égalité peuvent s’opposer. La fraternité est ce qui permet de tenir les deux ensemble.\n\n## La liberté\nLe droit de **penser, croire, s’exprimer, circuler, se réunir**.\n\n= La liberté des uns s’arrête où commence celle des autres\n\n!> On ne peut ni **insulter**, ni **menacer**, ni **diffamer**, ni **appeler à la haine** au nom de la liberté d’expression. Ces limites sont fixées par la loi.\n\n## L’égalité\nTous les citoyens sont **égaux devant la loi** : mêmes droits, mêmes devoirs, même justice, quels que soient l’origine, la religion, le sexe, la fortune.\n\n!> **Égalité ne veut pas dire identité** : les gens restent différents. Et elle ne veut pas dire égalité des **situations** — l’école gratuite existe justement parce que les familles ne sont pas également riches.\n\n## L’équité\n= Traiter également des personnes en situation inégale ne suffit pas\n\n~ Un élève dyslexique reçoit du temps supplémentaire → ce n’est pas un privilège → c’est ce qui rétablit l’égalité RÉELLE\n\n## La fraternité\nLe lien qui fait qu’on se sent concerné par les autres : entraide, solidarité, refus de laisser quelqu’un de côté.\n\n!> C’est la **seule des trois qui ne s’impose pas par la loi** — elle se pratique. Elle est pourtant inscrite dans le droit : la **non-assistance à personne en danger** est un délit.\n\n## Pourquoi les trois ensemble\n| Seule | Ce qu’elle produit |\n| La **liberté** totale | Elle **creuse les écarts** |\n| L’**égalité** absolue | Elle **supprime les choix** |\n| La **fraternité** | Elle permet de tenir les deux ensemble |\n\n## En classe\nLa liberté d’exprimer son avis, l’égalité de traitement entre élèves, l’entraide : la devise n’est pas un slogan lointain, elle se joue chaque jour dans un établissement.', 1),
  ('883439e0-7159-5575-a3e5-b53a09594a8d', 'ebc93d31-f95a-5be1-a7e6-27c3575ae336', 'Un espace où chacun est libre de croire ou non', E'La laïcité ne demande à personne de renoncer à ce qu’il croit. Elle demande que l’État, lui, ne croie rien.\n\n## Ce qu’elle garantit\n| La garantie | Ce qu’elle veut dire |\n| La **liberté de conscience** | Croire, ne pas croire, changer d’avis |\n| La **séparation** | Entre l’État et les religions |\n| L’**égalité** | De tous devant la loi, quelle que soit la croyance |\n\n## Ce qu’elle n’est pas\n!> Ce n’est **pas** l’interdiction des religions, ni une opinion contre elles. L’État ne se mêle pas des croyances : il ne les impose pas, ne les combat pas, **n’en finance aucune**.\n\n> C’est parce qu’il ne croit rien qu’il peut accueillir tout le monde.\n\n## La loi de 1905\n@ 1905 — La séparation des Églises et de l’État\n\nElle met fin au financement public des cultes et garantit le libre exercice de chacun.\n\n## À l’école publique\n| Qui | Ce que la règle lui demande |\n| Les **enseignants**, agents de l’État | Une **stricte neutralité** |\n| Les **élèves** | Libres de croire, mais **pas de signes religieux ostensibles** |\n| Les **programmes** | Les mêmes pour tous : pas de dispense au nom d’une croyance |\n\n@ 15 mars 2004 — La loi interdit les signes religieux ostensibles dans les écoles, collèges et lycées publics\n@ 2013 — La Charte de la laïcité, en 15 articles, est affichée dans tous les établissements\n\n## Pourquoi l’école\n> C’est le lieu où l’on apprend **ensemble**, avant de choisir. Mettre les croyances à distance dans la classe, c’est faire en sorte qu’aucun élève ne soit d’abord vu comme **le représentant d’un groupe**.\n\n## Ce qui reste possible\n!> **Parler des religions en cours est prévu par les programmes** — en histoire, en français, en arts. Les **connaître** est un savoir ; les **pratiquer** est un choix privé.', 1),
  ('1ad39dfe-7683-5b7c-8f26-d92b90de78f2', 'a2dd6f82-d9ec-57b4-ac59-63700189c6a2', 'Pourquoi on n’est pas libre de tout faire', E'Une règle n’est pas là pour empêcher, elle est là pour permettre. Sans règles, un match de football n’est pas plus libre : il n’existe pas.\n\n## Règle ou loi\n| Le texte | À qui il s’applique | Qui le fait |\n| La **règle** | À **un groupe précis** : un collège, un jeu, une famille | Le groupe lui-même |\n| La **loi** | À **tous**, sur tout le territoire | Le **Parlement** : Assemblée nationale et Sénat |\n\nLa loi est publiée au *Journal officiel*.\n\n## À quoi elles servent\n| Leur rôle | Le détail |\n| **Protéger** | La loi protège le plus **faible** du plus **fort** |\n| **Organiser** | Le code de la route ne bride pas la liberté de circuler : il la **rend possible** |\n| **Sanctionner** | Ce qui porte atteinte à autrui |\n\n!> Sans loi, seul le **rapport de force** compterait. C’est exactement ce dont elle protège.\n\n## La hiérarchie des normes\n~ La Constitution → les lois → les décrets → les règlements\n\n!> Une règle ne peut **jamais** contredire une norme supérieure : le règlement intérieur d’un collège ne peut pas aller contre la loi.\n\n## Comment une loi se fait\n~ Une proposition (parlementaires) ou un projet (gouvernement) → discuté et voté par les deux chambres → éventuel contrôle du Conseil constitutionnel → promulgation par le président\n\n## Une loi peut changer\n@ 1848 — Abolition définitive de l’esclavage\n@ 1981 — Abolition de la peine de mort\n\n> Une loi n’est pas éternelle : elle est votée par des représentants **élus**, et peut être modifiée ou abrogée.\n\n## Sanction et réparation\n| La sanction doit être… | |\n| **Proportionnée** | À la faute |\n| **Prévue à l’avance** | Pas inventée après coup |\n| **Expliquée** | |\n\n!> La sanction n’est pas une **vengeance**. Elle vise aussi à **réparer** — d’où les mesures de responsabilisation au collège.', 1),
  ('de77d258-afa6-577f-9193-00c885847ebd', '9875e9aa-116d-5019-85f1-667cf8385bb8', 'Agir avant d’avoir 18 ans', E'On n’attend pas la majorité pour agir. Le collège offre plusieurs voies concrètes.\n\n## Le délégué de classe\nÉlu par ses camarades au **scrutin secret**, il les **représente** au conseil de classe.\n\n| Son devoir | |\n| Porter la parole **du groupe**, pas la sienne | |\n| **Rendre compte** ensuite | |\n| Ne pas révéler ce qui est **confidentiel** | |\n\n> C’est la première expérience de **démocratie représentative** : on choisit quelqu’un pour parler en son nom, et **on lui demande des comptes**.\n\n## Les autres instances\n| L’instance | Son objet |\n| Le **CVC** (conseil de la vie collégienne) | Les élèves proposent des projets sur la vie de l’établissement |\n| Les **éco-délégués** | Tri, gaspillage alimentaire, énergie |\n| Le **foyer socio-éducatif**, les clubs, l’**AS** | La vie associative de l’établissement |\n\n## Les associations\n= Une association loi 1901 : des personnes réunies autour d’un but NON LUCRATIF\n\nBénévolat, aide aux devoirs, protection animale, secourisme, environnement : des millions de personnes y consacrent du temps **sans être payées**.\n\n## Porter secours\n| Le numéro | Pour quoi |\n| **15** | SAMU — urgence médicale |\n| **17** | Police / Gendarmerie |\n| **18** | Pompiers |\n| **112** | Numéro d’urgence **européen**, depuis n’importe quel téléphone |\n| **114** | Urgences **par SMS**, pour les personnes sourdes ou malentendantes |\n\nAu collège, la formation **PSC1** apprend les gestes qui sauvent.\n\n~ Alerter → masser → utiliser un défibrillateur\n\n!> **Ne pas porter secours quand on le peut est un délit.** Appeler, c’est déjà secourir.\n\n## Ce que l’engagement apporte\n> Il change le rapport à l’établissement : on cesse de **subir** un lieu pour en devenir **responsable**. Et il s’apprend — comme tout le reste.', 1)
ON CONFLICT DO NOTHING;

-- 3. Quiz ------------------------------------------------------------------
-- Double garde : ON CONFLICT (id) protège du rejeu, et le NOT EXISTS protège
-- la leçon d’un SECOND quiz venu d’ailleurs — le hub de leçon lit son quiz en
-- .maybeSingle(), deux quiz feraient lever « multiple rows » à de vrais élèves.
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.id, v.title, v.subject, v.grade_level, v.chapter, true, l.id
  FROM (VALUES
    ('ebd1aba6-2142-5b5c-9358-4da7ea2a5507'::uuid, 'Quiz — Vivre ensemble sans se ressembler', 'EMC', '6e', 'Le respect d’autrui, et les différences', '5efa0556-1677-5d16-95a6-93d4005256d1'::uuid),
    ('a51ab4a8-6da1-5b27-b6ec-e6a80babdd67'::uuid, 'Quiz — Ce n’est jamais « juste pour rire »', 'EMC', '6e', 'Le harcèlement : reconnaître et agir', 'b73dcc5c-1684-5edf-8d56-2b1d9c079c07'::uuid),
    ('74164e11-962b-54d4-a0aa-1e34c859bef6'::uuid, 'Quiz — Le même droit, et la même liberté de choisir', 'EMC', '6e', 'L’égalité entre les filles et les garçons', '9c457a3d-ca26-5766-b1a2-ea06fa47652e'::uuid),
    ('208882be-364e-5056-ad38-e10676f593ae'::uuid, 'Quiz — Ce qui représente la France', 'EMC', '6e', 'Les symboles de la République française', 'd6c88da6-1dba-52db-816a-e6db664ebae4'::uuid),
    ('ac4c19c9-4b35-56a0-8aca-de457a2b2bb2'::uuid, 'Quiz — Trois mots, trois exigences', 'EMC', '6e', 'La devise : liberté, égalité, fraternité', '53d9db4c-cd59-5c7c-af68-bc851aab76a5'::uuid),
    ('a249db67-3a91-5dae-9525-10e44a52d140'::uuid, 'Quiz — Un espace où chacun est libre de croire ou non', 'EMC', '6e', 'La laïcité à l’école', '883439e0-7159-5575-a3e5-b53a09594a8d'::uuid),
    ('55d44e0b-7eac-5496-a2f8-622387afb0df'::uuid, 'Quiz — Pourquoi on n’est pas libre de tout faire', 'EMC', '6e', 'La règle et la loi', '1ad39dfe-7683-5b7c-8f26-d92b90de78f2'::uuid),
    ('c0496899-8ee5-5195-b910-67105f3ced5f'::uuid, 'Quiz — Agir avant d’avoir 18 ans', 'EMC', '6e', 'S’engager : le délégué, les associations, les secours', 'de77d258-afa6-577f-9193-00c885847ebd'::uuid)
  ) AS v(id, title, subject, grade_level, chapter, lesson_id)
  JOIN public.lessons l ON l.id = v.lesson_id
 WHERE NOT EXISTS (SELECT 1 FROM public.quizzes qz WHERE qz.lesson_id = l.id)
ON CONFLICT (id) DO NOTHING;

-- 4. Questions -------------------------------------------------------------
INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT v.id, v.quiz_id, v.question, v.kind, v.options, v.correct_index, v.explanation, v.position
  FROM (VALUES
    ('9e19c9bf-4c8b-5db1-a019-6bfb780f8b56'::uuid, 'ebd1aba6-2142-5b5c-9358-4da7ea2a5507'::uuid, 'Que signifie respecter quelqu’un ?', 'mcq', '["Reconnaître qu’il a la même valeur que soi","Être d’accord avec lui","Lui obéir","L’éviter"]'::jsonb, 0, 'Ce n’est pas être d’accord, c’est refuser de rabaisser.', 1),
    ('7eb4c127-e912-5e81-967e-e5137db97378'::uuid, 'ebd1aba6-2142-5b5c-9358-4da7ea2a5507'::uuid, 'Qu’est-ce que la dignité ?', 'mcq', '["Une valeur que chaque personne possède sans avoir à la mériter","Une récompense","Un droit qu’on obtient à 18 ans","Un titre honorifique"]'::jsonb, 0, 'Elle ne se perd pas.', 2),
    ('a2a5f945-7bbb-57e7-a957-5ce20b0df7fd'::uuid, 'ebd1aba6-2142-5b5c-9358-4da7ea2a5507'::uuid, 'Qu’est-ce qu’un stéréotype ?', 'mcq', '["Une idée toute faite sur un groupe","Une insulte","Une loi","Une preuve"]'::jsonb, 0, '« Les filles sont… », « les garçons sont… ».', 3),
    ('9af729f1-f905-5b6f-ab89-2834c941567a'::uuid, 'ebd1aba6-2142-5b5c-9358-4da7ea2a5507'::uuid, 'Qu’est-ce qu’un préjugé ?', 'mcq', '["Un jugement porté avant de connaître","Un jugement de tribunal","Une opinion vérifiée","Une règle de classe"]'::jsonb, 0, 'Il se répand sans preuve.', 4),
    ('65be65e2-4ae4-59fc-a275-2bc372bb8424'::uuid, 'ebd1aba6-2142-5b5c-9358-4da7ea2a5507'::uuid, 'Qu’est-ce qu’une discrimination ?', 'mcq', '["Traiter quelqu’un moins bien en raison de ce qu’il est","Ne pas aimer quelqu’un","Être en désaccord","Préférer un ami à un autre"]'::jsonb, 0, 'C’est interdit par la loi.', 5),
    ('4daaf3b4-40c5-5091-a6a6-77f465530833'::uuid, 'ebd1aba6-2142-5b5c-9358-4da7ea2a5507'::uuid, 'La discrimination est-elle seulement impolie ?', 'mcq', '["Non, c’est un délit puni par la loi","Oui, c’est un simple manque de savoir-vivre","Non, c’est autorisé","Cela dépend des cas"]'::jsonb, 0, 'La loi la sanctionne.', 6),
    ('869f4a6f-d173-56b4-81d5-4bb822ebd35e'::uuid, 'ebd1aba6-2142-5b5c-9358-4da7ea2a5507'::uuid, 'Comment le respect se manifeste-t-il ?', 'mcq', '["Par des gestes concrets : écouter, ne pas se moquer, s’excuser","Par de bonnes intentions","En se taisant toujours","En évitant les autres"]'::jsonb, 0, 'Il se voit, il ne se déclare pas.', 7),
    ('b525c9db-8083-5c3b-ad65-523e8de94e37'::uuid, 'ebd1aba6-2142-5b5c-9358-4da7ea2a5507'::uuid, 'Les différences entre élèves d’une classe sont un problème.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'Elles sont normales : un groupe identique n’existe pas.', 8),
    ('dc2263f4-e203-5303-aaae-8ac333ae86d3'::uuid, 'a51ab4a8-6da1-5b27-b6ec-e6a80babdd67'::uuid, 'Quels sont les trois éléments du harcèlement ?', 'mcq', '["La répétition, l’intention de nuire, le déséquilibre de force","La colère, le bruit, la peur","L’âge, le sexe, l’origine","Une seule insulte suffit"]'::jsonb, 0, 'Une dispute à égalité n’est pas du harcèlement.', 1),
    ('34057f60-e837-5b07-b873-4799a1fb8c91'::uuid, 'a51ab4a8-6da1-5b27-b6ec-e6a80babdd67'::uuid, 'Pourquoi le cyberharcèlement est-il particulièrement grave ?', 'mcq', '["Il suit la victime chez elle et les traces se rediffusent","Il est moins visible","Il ne concerne que les adultes","Il s’arrête vite"]'::jsonb, 0, 'Il ne s’arrête pas à la grille du collège.', 2),
    ('9f089e35-4b32-53ba-a26d-84d67d5530f9'::uuid, 'a51ab4a8-6da1-5b27-b6ec-e6a80babdd67'::uuid, 'Quel rôle est décisif pour arrêter le harcèlement ?', 'mcq', '["Les témoins","La victime seule","Les harceleurs","Personne"]'::jsonb, 0, 'Un groupe qui rit encourage, un groupe qui refuse arrête.', 3),
    ('639b2789-59c8-5e54-83f7-274ac4d39384'::uuid, 'a51ab4a8-6da1-5b27-b6ec-e6a80babdd67'::uuid, 'Quelle est la différence entre rapporter et signaler ?', 'mcq', '["Rapporter nuit à quelqu’un, signaler protège quelqu’un","Aucune","Signaler est interdit","Rapporter est plus courageux"]'::jsonb, 0, 'En parler n’est pas trahir.', 4),
    ('f24b41e6-ea95-53dd-87d3-ee568604ca9a'::uuid, 'a51ab4a8-6da1-5b27-b6ec-e6a80babdd67'::uuid, 'Quel numéro appeler en cas de harcèlement ?', 'mcq', '["Le 3018","Le 15","Le 17","Le 112"]'::jsonb, 0, 'Gratuit et anonyme. Le 119 concerne l’enfance en danger.', 5),
    ('55c38b38-f246-505e-ab4a-79cb60bd1b81'::uuid, 'a51ab4a8-6da1-5b27-b6ec-e6a80babdd67'::uuid, 'Que faut-il faire des messages de cyberharcèlement ?', 'mcq', '["Conserver les preuves par captures d’écran","Les supprimer aussitôt","Répondre pour se défendre","Les partager largement"]'::jsonb, 0, 'Et bloquer sans répondre aux provocations.', 6),
    ('8a3aa304-b826-5723-a67b-0bdc722e02b4'::uuid, 'a51ab4a8-6da1-5b27-b6ec-e6a80babdd67'::uuid, 'Depuis quand le harcèlement scolaire est-il un délit ?', 'mcq', '["Depuis 2022","Depuis 1990","Il ne l’est pas","Depuis 2005"]'::jsonb, 0, 'Y compris pour les mineurs, avec des peines adaptées.', 7),
    ('0cfe78e7-28f9-5737-8d24-f8c8620a0332'::uuid, 'a51ab4a8-6da1-5b27-b6ec-e6a80babdd67'::uuid, 'Une victime de harcèlement a forcément fait quelque chose pour le provoquer.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'Personne ne mérite d’être harcelé.', 8),
    ('5d74e1a1-b65a-57ad-b896-17d1e4949bc0'::uuid, '74164e11-962b-54d4-a0aa-1e34c859bef6'::uuid, 'Que garantit la loi entre filles et garçons ?', 'mcq', '["Les mêmes droits et la même liberté de choisir","Des matières différentes","Des métiers séparés","Rien de particulier"]'::jsonb, 0, 'C’est inscrit dans la Constitution.', 1),
    ('03d4bd0d-5117-5290-83d1-7abb998ad293'::uuid, '74164e11-962b-54d4-a0aa-1e34c859bef6'::uuid, 'Qu’est-ce qu’un stéréotype de genre ?', 'mcq', '["Une idée toute faite sur ce que feraient « les filles » ou « les garçons »","Une loi","Un métier","Une matière scolaire"]'::jsonb, 0, 'Rien ne le fonde, et il oriente pourtant des choix d’études.', 2),
    ('7ad56d57-8cd4-5f01-8c6b-edf451e8e2ae'::uuid, '74164e11-962b-54d4-a0aa-1e34c859bef6'::uuid, 'Depuis quand la loi impose-t-elle l’égalité salariale en France ?', 'mcq', '["Depuis 1972","Depuis 2020","Depuis 1945","Elle ne l’impose pas"]'::jsonb, 0, 'Elle n’est toujours pas atteinte dans les faits.', 3),
    ('600af706-3b2b-5f45-9bde-106ac68cc4fd'::uuid, '74164e11-962b-54d4-a0aa-1e34c859bef6'::uuid, 'Qu’est-ce que le sexisme ?', 'mcq', '["Traiter ou juger quelqu’un moins bien à cause de son sexe","Une opinion politique","Une préférence personnelle","Une règle scolaire"]'::jsonb, 0, 'Blagues rabaissantes, remarques sur le corps, insultes genrées.', 4),
    ('e68fea41-fcd9-5471-8208-fe01cfc20abd'::uuid, '74164e11-962b-54d4-a0aa-1e34c859bef6'::uuid, 'Qu’est-ce que le consentement ?', 'mcq', '["Un accord libre et clair, qui peut être retiré à tout moment","Une autorisation définitive","Un contrat écrit","Une règle de politesse"]'::jsonb, 0, 'Personne n’a le droit de toucher sans accord.', 5),
    ('8a12d9ee-e6cd-553c-860d-adadcb2a77d3'::uuid, '74164e11-962b-54d4-a0aa-1e34c859bef6'::uuid, 'Comment se manifeste l’inégalité dans une cour de récréation ?', 'mcq', '["Le terrain central est le plus souvent occupé par des garçons","Les filles arrivent en retard","Les garçons parlent moins","Il n’y a aucune différence"]'::jsonb, 0, 'Le partage de l’espace est un indicateur.', 6),
    ('57f81143-eec7-542c-a4b2-5805fda22196'::uuid, '74164e11-962b-54d4-a0aa-1e34c859bef6'::uuid, 'Que faire face à une blague sexiste ?', 'mcq', '["Ne pas en rire, dire que ce n’est pas normal, en parler","Rire pour ne pas faire d’histoires","La répéter","L’ignorer toujours"]'::jsonb, 0, 'Le silence des témoins la valide.', 7),
    ('e4321760-81f8-56ff-9799-3aa0ff3c5814'::uuid, '74164e11-962b-54d4-a0aa-1e34c859bef6'::uuid, 'L’égalité entre les sexes est atteinte en France puisqu’elle est dans la loi.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'Un droit inscrit n’est pas encore une réalité dans les faits.', 8),
    ('4a96fd08-7cdf-5537-94bf-35f3b76c5e57'::uuid, '208882be-364e-5056-ad38-e10676f593ae'::uuid, 'Quelles sont les couleurs du drapeau français, et d’où viennent-elles ?', 'mcq', '["Bleu et rouge de Paris, blanc du roi","Trois couleurs choisies au hasard","Les couleurs de la Révolution américaine","Les couleurs de la Bastille"]'::jsonb, 0, 'Le drapeau naît en 1790.', 1),
    ('386c0ae9-3db4-525e-9f15-66e244288093'::uuid, '208882be-364e-5056-ad38-e10676f593ae'::uuid, 'Qui a écrit la Marseillaise, et en quelle année ?', 'mcq', '["Rouget de Lisle, en 1792","Victor Hugo, en 1848","Napoléon, en 1804","Jules Ferry, en 1881"]'::jsonb, 0, 'Elle devient hymne national en 1879.', 2),
    ('7b588c6e-9b7e-5e9c-bb7f-7c1b61031eb6'::uuid, '208882be-364e-5056-ad38-e10676f593ae'::uuid, 'Que porte Marianne sur la tête ?', 'mcq', '["Le bonnet phrygien","Une couronne","Un casque","Un chapeau de paille"]'::jsonb, 0, 'Porté par les esclaves affranchis de Rome, il symbolise la liberté.', 3),
    ('a8072d85-39c5-5c3a-abfd-85a11274856b'::uuid, '208882be-364e-5056-ad38-e10676f593ae'::uuid, 'Quelle est la devise de la République française ?', 'mcq', '["Liberté, Égalité, Fraternité","Travail, Famille, Patrie","Unité, Force, Justice","Paix, Ordre, Progrès"]'::jsonb, 0, 'Elle est gravée au fronton des mairies et des écoles.', 4),
    ('56f664ac-4c88-5fee-8c35-0729d6a9ae5d'::uuid, '208882be-364e-5056-ad38-e10676f593ae'::uuid, 'Depuis quand le 14 Juillet est-il la fête nationale ?', 'mcq', '["Depuis 1880","Depuis 1789","Depuis 1848","Depuis 1958"]'::jsonb, 0, 'Il commémore la Bastille et la Fête de la Fédération.', 5),
    ('d6e0ff18-1210-5089-a49d-7b8dcb377029'::uuid, '208882be-364e-5056-ad38-e10676f593ae'::uuid, 'D’où vient le symbole du coq gaulois ?', 'mcq', '["D’un jeu de mots latin : gallus signifie coq et gaulois","D’une loi de 1880","Du drapeau","D’un roi"]'::jsonb, 0, 'C’est un symbole non officiel.', 6),
    ('7380871c-549a-521b-9ec6-c47e241b19d3'::uuid, '208882be-364e-5056-ad38-e10676f593ae'::uuid, 'À quoi servent les symboles de la République ?', 'mcq', '["Rappeler que les citoyens appartiennent à une même communauté","Décorer les bâtiments","Distinguer les régions","Marquer les frontières"]'::jsonb, 0, 'Ils sont visibles partout pour être un rappel quotidien.', 7),
    ('aa92a7da-2456-5b4a-afab-a778631a03c7'::uuid, '208882be-364e-5056-ad38-e10676f593ae'::uuid, 'Marianne est un personnage historique ayant réellement existé.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'C’est une figure allégorique qui représente la République.', 8),
    ('90d35236-ea19-5fe3-b4b9-c4d5a172908b'::uuid, 'ac4c19c9-4b35-56a0-8aca-de457a2b2bb2'::uuid, 'Où s’arrête la liberté de chacun ?', 'mcq', '["Là où commence celle des autres","Nulle part","À la porte de l’école","Elle est illimitée"]'::jsonb, 0, 'La loi fixe ces limites.', 1),
    ('ba619a8b-efd7-54c8-baa7-7d552f888618'::uuid, 'ac4c19c9-4b35-56a0-8aca-de457a2b2bb2'::uuid, 'Que signifie l’égalité devant la loi ?', 'mcq', '["Mêmes droits, mêmes devoirs et même justice pour tous","Tout le monde est identique","Tout le monde a le même revenu","Chacun fait ce qu’il veut"]'::jsonb, 0, 'Quels que soient l’origine, la religion, le sexe ou la fortune.', 2),
    ('fafbfdc6-726f-5f80-9e41-e4259ed54a95'::uuid, 'ac4c19c9-4b35-56a0-8aca-de457a2b2bb2'::uuid, 'Qu’est-ce que l’équité ?', 'mcq', '["Adapter le traitement pour rétablir une égalité réelle","Traiter tout le monde exactement pareil","Donner un privilège","Supprimer les différences"]'::jsonb, 0, 'Le tiers-temps d’un élève dyslexique en est un exemple.', 3),
    ('32b87574-3b02-586f-a717-f0087e93e91d'::uuid, 'ac4c19c9-4b35-56a0-8aca-de457a2b2bb2'::uuid, 'Qu’est-ce que la fraternité ?', 'mcq', '["Le lien de solidarité qui fait qu’on se sent concerné par les autres","Une obligation légale de s’aimer","Un lien de famille","Une association"]'::jsonb, 0, 'Elle se pratique plus qu’elle ne s’impose.', 4),
    ('b1a27528-27e2-5298-b735-6db9fe46bf17'::uuid, 'ac4c19c9-4b35-56a0-8aca-de457a2b2bb2'::uuid, 'Quel délit rattache la fraternité au droit ?', 'mcq', '["La non-assistance à personne en danger","Le vol","La diffamation","L’excès de vitesse"]'::jsonb, 0, 'Ne pas porter secours est puni.', 5),
    ('63ced0c8-5c92-5b87-846a-1ef32dcec297'::uuid, 'ac4c19c9-4b35-56a0-8aca-de457a2b2bb2'::uuid, 'Peut-on tout dire au nom de la liberté d’expression ?', 'mcq', '["Non : insulte, menace, diffamation et appel à la haine sont interdits","Oui, toujours","Oui, sauf à l’école","Cela dépend de l’âge"]'::jsonb, 0, 'La loi fixe des limites précises.', 6),
    ('80318ab0-5e1f-539c-ad1b-9d85bb120b30'::uuid, 'ac4c19c9-4b35-56a0-8aca-de457a2b2bb2'::uuid, 'Pourquoi l’école est-elle gratuite ?', 'mcq', '["Parce que les familles ne sont pas également riches","Pour occuper les enfants","Par tradition","Parce que c’est moins cher"]'::jsonb, 0, 'C’est une application de l’égalité.', 7),
    ('0978f885-f19f-5c0b-88e6-af416736c6a6'::uuid, 'ac4c19c9-4b35-56a0-8aca-de457a2b2bb2'::uuid, 'Liberté et égalité vont toujours dans le même sens.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'Elles peuvent s’opposer : c’est la fraternité qui les tient ensemble.', 8),
    ('1143c918-4857-5606-84ff-618dfed22a68'::uuid, 'a249db67-3a91-5dae-9525-10e44a52d140'::uuid, 'Que garantit la laïcité ?', 'mcq', '["La liberté de conscience, la séparation État-religions et l’égalité","L’interdiction des religions","Le financement des cultes","Une religion officielle"]'::jsonb, 0, 'Trois choses en même temps.', 1),
    ('dd43086a-cb86-5cf4-94a2-4f029abdfd21'::uuid, 'a249db67-3a91-5dae-9525-10e44a52d140'::uuid, 'Quelle loi établit la séparation des Églises et de l’État ?', 'mcq', '["La loi de 1905","La loi de 2004","La loi de 1881","La loi de 1789"]'::jsonb, 0, 'Elle met fin au financement public des cultes.', 2),
    ('d44900b7-b216-5aad-a814-6a6f8e5c30eb'::uuid, 'a249db67-3a91-5dae-9525-10e44a52d140'::uuid, 'Que dit la loi du 15 mars 2004 ?', 'mcq', '["Elle interdit les signes religieux ostensibles dans les écoles publiques","Elle interdit toute religion en France","Elle finance les écoles privées","Elle supprime les cours d’histoire des religions"]'::jsonb, 0, 'Elle concerne écoles, collèges et lycées publics.', 3),
    ('d87361e0-3be0-5b46-bc69-b9ab55547079'::uuid, 'a249db67-3a91-5dae-9525-10e44a52d140'::uuid, 'À quoi les enseignants sont-ils tenus ?', 'mcq', '["À une stricte neutralité","À déclarer leur religion","À enseigner une religion","À rien de particulier"]'::jsonb, 0, 'Ils sont agents de l’État.', 4),
    ('b20fc8e0-59c7-509a-abaf-d153e3e647c0'::uuid, 'a249db67-3a91-5dae-9525-10e44a52d140'::uuid, 'Peut-on parler des religions en cours ?', 'mcq', '["Oui, c’est prévu par les programmes","Non, c’est interdit","Seulement en dehors des cours","Uniquement avec autorisation"]'::jsonb, 0, 'Les connaître est un savoir, les pratiquer un choix privé.', 5),
    ('ccfbab33-4e9f-519b-9345-a89dbd5bd260'::uuid, 'a249db67-3a91-5dae-9525-10e44a52d140'::uuid, 'La laïcité est-elle une opinion contre les religions ?', 'mcq', '["Non, l’État ne les impose ni ne les combat","Oui","Oui, depuis 2004","Cela dépend des établissements"]'::jsonb, 0, 'Elle protège aussi le libre exercice des cultes.', 6),
    ('adbcd82e-01fe-5e1d-a953-ac866b60e2b2'::uuid, 'a249db67-3a91-5dae-9525-10e44a52d140'::uuid, 'Qu’est-ce que la Charte de la laïcité ?', 'mcq', '["Un texte de 15 articles affiché dans les établissements depuis 2013","Une loi de 1905","Un règlement intérieur","Un programme scolaire"]'::jsonb, 0, 'Elle rappelle les principes en termes simples.', 7),
    ('89252074-8ae8-58b6-845b-d7d45100bd45'::uuid, 'a249db67-3a91-5dae-9525-10e44a52d140'::uuid, 'Un élève peut être dispensé d’un cours au nom de sa croyance.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'Les programmes sont les mêmes pour tous.', 8),
    ('f557ad3e-5078-56b8-9acb-a5c65404b630'::uuid, '55d44e0b-7eac-5496-a2f8-622387afb0df'::uuid, 'Quelle est la différence entre une règle et une loi ?', 'mcq', '["La règle vaut dans un cadre précis, la loi s’applique à tous","Aucune","La loi ne concerne que les adultes","La règle est plus forte"]'::jsonb, 0, 'La loi est votée par le Parlement.', 1),
    ('46e35287-c706-53a5-a840-50fda03bc80c'::uuid, '55d44e0b-7eac-5496-a2f8-622387afb0df'::uuid, 'Qui vote la loi en France ?', 'mcq', '["Le Parlement : Assemblée nationale et Sénat","Le président seul","Le gouvernement seul","Les maires"]'::jsonb, 0, 'Elle est ensuite publiée au Journal officiel.', 2),
    ('4fd8129c-8a30-510f-8de0-2797259d237b'::uuid, '55d44e0b-7eac-5496-a2f8-622387afb0df'::uuid, 'À quoi sert principalement la loi ?', 'mcq', '["Protéger, organiser la vie commune et sanctionner","Empêcher toute liberté","Punir uniquement","Enrichir l’État"]'::jsonb, 0, 'Elle protège le plus faible du plus fort.', 3),
    ('3a847e6c-b05f-5088-8777-29b8e6946002'::uuid, '55d44e0b-7eac-5496-a2f8-622387afb0df'::uuid, 'Quelle norme est au sommet de la hiérarchie ?', 'mcq', '["La Constitution","La loi","Le décret","Le règlement intérieur"]'::jsonb, 0, 'Aucune règle ne peut la contredire.', 4),
    ('b1431c81-5d6b-5e4a-83e5-84de6f931c6c'::uuid, '55d44e0b-7eac-5496-a2f8-622387afb0df'::uuid, 'Une loi peut-elle être changée ?', 'mcq', '["Oui, elle peut être modifiée ou abrogée","Non, jamais","Seulement par référendum","Seulement tous les dix ans"]'::jsonb, 0, 'C’est ainsi que la peine de mort a été abolie en 1981.', 5),
    ('f8b6952d-bfc6-5b8d-ba8d-e1556e641e2c'::uuid, '55d44e0b-7eac-5496-a2f8-622387afb0df'::uuid, 'Quelles conditions une sanction doit-elle respecter ?', 'mcq', '["Être proportionnée, prévue à l’avance et expliquée","Être la plus sévère possible","Être décidée sur le moment","Rester secrète"]'::jsonb, 0, 'Elle vise aussi à réparer.', 6),
    ('906b2031-08d0-563a-a1c2-9f4e51018820'::uuid, '55d44e0b-7eac-5496-a2f8-622387afb0df'::uuid, 'Le règlement intérieur d’un collège peut-il contredire la loi ?', 'mcq', '["Non, il lui est subordonné","Oui, dans l’établissement","Oui, si le principal le décide","Cela dépend des cas"]'::jsonb, 0, 'C’est la hiérarchie des normes.', 7),
    ('95f24294-a72f-5232-95ce-1f878e0e0c93'::uuid, '55d44e0b-7eac-5496-a2f8-622387afb0df'::uuid, 'Sans règles, un jeu serait plus libre.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'Sans règles, il n’existerait pas : elles rendent le jeu possible.', 8),
    ('620d095e-9062-5d74-8159-936559fb1152'::uuid, 'c0496899-8ee5-5195-b910-67105f3ced5f'::uuid, 'Comment le délégué de classe est-il désigné ?', 'mcq', '["Élu par ses camarades au scrutin secret","Désigné par le professeur principal","Tiré au sort","Volontaire sans vote"]'::jsonb, 0, 'C’est une première expérience de démocratie représentative.', 1),
    ('78380145-bce5-568d-bc46-26a1f77ca1cc'::uuid, 'c0496899-8ee5-5195-b910-67105f3ced5f'::uuid, 'Quel est le rôle du délégué ?', 'mcq', '["Porter la parole du groupe et rendre compte","Donner son avis personnel","Noter les élèves","Surveiller la classe"]'::jsonb, 0, 'Il ne révèle pas ce qui est confidentiel.', 2),
    ('43b09482-6624-5cfe-aa1f-b4f6a2314819'::uuid, 'c0496899-8ee5-5195-b910-67105f3ced5f'::uuid, 'Que font les éco-délégués ?', 'mcq', '["Ils portent les questions d’environnement dans l’établissement","Ils surveillent la cantine","Ils notent les absences","Ils remplacent les délégués"]'::jsonb, 0, 'Tri, gaspillage alimentaire, énergie.', 3),
    ('561647f8-044f-56b5-b24d-27ee52b04374'::uuid, 'c0496899-8ee5-5195-b910-67105f3ced5f'::uuid, 'Qu’est-ce qu’une association loi 1901 ?', 'mcq', '["Un groupement de personnes autour d’un but non lucratif","Une entreprise","Un service de l’État","Un syndicat obligatoire"]'::jsonb, 0, 'Le bénévolat n’est pas rémunéré.', 4),
    ('4722ec35-53f9-5bb4-973e-2e6e671e0ced'::uuid, 'c0496899-8ee5-5195-b910-67105f3ced5f'::uuid, 'Quel numéro appeler pour une urgence médicale ?', 'mcq', '["Le 15","Le 17","Le 18","Le 114"]'::jsonb, 0, 'Le 112 fonctionne aussi partout en Europe.', 5),
    ('e8500c04-c9df-59c3-b5f5-73139fcf6860'::uuid, 'c0496899-8ee5-5195-b910-67105f3ced5f'::uuid, 'Quel numéro permet d’alerter par SMS ?', 'mcq', '["Le 114","Le 15","Le 18","Le 112"]'::jsonb, 0, 'Il est destiné aux personnes sourdes ou malentendantes.', 6),
    ('16fa9ac2-78b2-5f38-bba2-3977f7bd6a47'::uuid, 'c0496899-8ee5-5195-b910-67105f3ced5f'::uuid, 'Qu’apprend la formation PSC1 ?', 'mcq', '["Les gestes qui sauvent : alerter, masser, utiliser un défibrillateur","Le code de la route","Le règlement intérieur","Les premiers secours des animaux"]'::jsonb, 0, 'Elle se suit dès le collège.', 7),
    ('e7bfd93c-c791-5fc2-af33-03acf5d5e2fe'::uuid, 'c0496899-8ee5-5195-b910-67105f3ced5f'::uuid, 'Il faut avoir 18 ans pour s’engager utilement.', 'true_false', '["Vrai","Faux"]'::jsonb, 1, 'Délégué, éco-délégué, CVC, associations, secours : tout est possible avant.', 8)
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
   WHERE s.slug IN ('emc');
  SELECT count(*) INTO n_vides FROM public.subjects s
   WHERE s.slug IN ('emc')
     AND NOT EXISTS (SELECT 1 FROM public.chapters c WHERE c.subject_id = s.id);
  IF n_vides > 0 THEN
    RAISE EXCEPTION 'Migration 337 incomplète : % matiere(s) encore sans chapitre', n_vides;
  END IF;
  RAISE NOTICE 'Migration 337 OK : % chapitres sur les matieres visees.', n_chap;
END $$;
