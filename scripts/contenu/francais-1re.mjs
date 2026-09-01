// Français — PREMIÈRE générale et technologique : le PROGRAMME et la GRAMMAIRE.
//
// Le dossier de français ne se lit pas comme les autres. Un élève de 1re y vient
// pour trois choses différentes, jamais dans le même mouvement :
//   · réviser les ŒUVRES AU PROGRAMME de son bac (les quatre objets d'étude) ;
//   · retrouver la FICHE DE LECTURE d'une œuvre précise, pour un devoir ou une
//     dissertation — deux cent soixante et une œuvres, qu'on cherche une par une ;
//   · revoir un point de GRAMMAIRE, parce que la question de langue vaut deux
//     points à l'oral et qu'elle tombe sur un texte qu'on ne choisit pas.
// D'où trois RAYONS dans le même dossier (colonne `chapters.discipline`,
// migration 247, cf. lib/subject-template.ts) : « programme », « fiches »,
// « grammaire ». Ce module écrit les deux premiers rayons du sommaire — le
// programme et la grammaire ; les fiches de lecture sont dans leurs propres
// modules (`francais-fiches-*.mjs`), pour que les migrations restent collables.
//
// CE QU'IL Y AVAIT (node _ASSOCIE/sonde-chapitres.mjs 1re francais, 20/08/2026) :
// CINQ chapitres composites hérités des migrations 008 / 142 — « La poésie du
// XIXe au XXIe siècle », « Le roman : parcours bac », « Le théâtre : parcours
// bac », « La littérature d'idées », « Dissertation et oral du bac ». Aucune
// œuvre au programme n'avait sa fiche : ni Manon Lescaut, ni La Peau de chagrin,
// ni les Cahiers de Douai, ni Mes forêts. Un élève qui préparait son oral sur un
// texte de Ponge ou une dissertation sur Colette ne trouvait rien.
//
// LE DÉCOUPAGE EST CELUI DE LA MAQUETTE transmise par Lucas : quatre objets
// d'étude, chacun ouvert par une fiche de synthèse puis suivi de ses œuvres, et
// un cinquième chapitre « Anciens programmes » qui garde les œuvres sorties du
// programme en cours — elles restent au menu des devoirs, des concours blancs et
// des secondes chances. Les œuvres longues sont en DEUX PARTIES, comme dans la
// maquette : le résumé et la structure d'abord, l'analyse et le parcours ensuite.
//
// PIÈGE DE TITRE À CONNAÎTRE : la fiche de synthèse « La poésie du XIXe au XXIe
// siècle » porte EXACTEMENT le titre de l'ancien chapitre composite, et
// `chapters` est UNIQUE(subject_id, level, title). Sans le ménage joué AVANT,
// l'INSERT tomberait dans le ON CONFLICT DO NOTHING, la fiche ne serait jamais
// créée et sa leçon échouerait sur une clé étrangère absente : migration à
// moitié jouée. Le ménage n'est donc pas un confort, il est structurel.

export default {
  slug: 'francais',
  nom: 'Français',

  titreMigration: 'FRANÇAIS 1re — LE PROGRAMME DU BAC ET LA GRAMMAIRE',

  motif: `CONSTAT MESURÉ (node _ASSOCIE/sonde-chapitres.mjs 1re francais, 20/08/2026) :
le français de PREMIÈRE n'avait que CINQ chapitres composites, hérités des
migrations 008 et 142 (« La poésie du XIXe au XXIe siècle », « Le roman :
parcours bac », « Le théâtre : parcours bac », « La littérature d'idées »,
« Dissertation et oral du bac »). AUCUNE œuvre au programme n'avait sa fiche.
Un élève qui préparait son oral sur les Cahiers de Douai, une dissertation sur
La Peau de chagrin ou une explication linéaire de Colette ne trouvait rien —
et la question de grammaire, qui vaut deux points sur vingt à l'oral, n'avait
aucune entrée non plus.

Cette migration installe les 48 fiches du programme, rangées sous leurs 5
chapitres, et les 10 fiches de grammaire du BO, rangées sous leurs 3 chapitres.
Elle retire les 5 fiches composites que les nouvelles recouvrent.

LE DOSSIER PREND TROIS RAYONS (colonne chapters.discipline, migration 247) :
« programme », « fiches » (les fiches de lecture, écrites par les migrations
suivantes) et « grammaire ». La page matière en fait trois onglets, chacun avec
son propre compte et son propre bouton « Reprendre ».

⚠️ CE QUI EST PERDU AU PASSAGE : les 5 leçons « Exercices types » (aucun quiz
en base, sondé le 20/08/2026) et les 50 questions des 5 leçons « L'essentiel
du cours ».

⚠️ LES MIGRATIONS 008 ET 142 SONT REJOUABLES : les recoller un jour ferait
revenir les 5 fiches composites en doublon.`,

  menage: [
    {
      raison: `Les DEUX colonnes de rangement conditionnent tout ce qui suit : theme
(migration 234) porte le chapitre du programme, discipline (migration 247)
porte le rayon du dossier. Elles sont REPRISES ici en ADD COLUMN IF NOT EXISTS,
comme dans les migrations 243 à 258 : la 234 n'a jamais été exécutée, et la 247
n'a jamais posé de GRANT sur sa colonne pour le rôle anonyme.
Le GRANT n'est pas décoratif : la 182 a révoqué le SELECT de table sur chapters
(pour cacher mind_map) et ne l'a rendu que colonne par colonne ; une colonne
ajoutée après elle n'hérite d'aucun droit, et l'app lirait « permission denied »
au lieu de l'onglet.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;

ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS discipline TEXT;
GRANT SELECT (discipline) ON public.chapters TO anon;
GRANT SELECT (discipline) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 fiches composites partent, au niveau 1re SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE. Deux raisons, et la première suffit :
la fiche de synthèse neuve « La poésie du XIXe au XXIe siècle » porte le titre
EXACT de l'ancien chapitre composite, si bien qu'un ménage par titre et un
INSERT par titre se marcheraient dessus au moindre écart de rédaction. La
seconde : trois de ces cinq titres portent une apostrophe, et le contenu ancien
de la base la porte DROITE là où le contenu récent la porte typographique — un
DELETE par titre ne trouverait pas la ligne, en silence (piège de la 249).
Le critère « pas de chapitre de programme » vise exactement les cinq lignes
voulues : elles sont antérieures à la 234 et n'ont jamais eu de thème (vérifié
le 20/08/2026), tandis que les 58 fiches neuves en portent un dès l'INSERT.
Le ménage tourne AVANT les insertions : il ne peut jamais mordre sur elles, ni
au premier passage ni au rejeu.
Le filtre level = '1re' est indispensable : le français existe sur SIX niveaux,
tous bâtis sur le même modèle de cinq composites avec les mêmes deux leçons
génériques. Seule la Première est refondue ici.
L'ordre compte : la file « À revoir » d'abord (review_items.item_id n'a PAS de
clé étrangère — rien ne casserait, mais le compteur « X à revoir » continuerait
de compter des questions disparues), puis les quiz (quizzes.lesson_id est ON
DELETE SET NULL : ils survivraient orphelins, rattachés à aucune leçon et
toujours tirables par le moteur de questions), puis les chapitres, dont les
leçons partent en cascade.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'francais'
   AND c.level = '1re'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'francais'
   AND c.level = '1re'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'francais'
   AND c.level = '1re'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['1re'],
      rayon: 'programme',
      chapitres: [
        // ===================================================================
        // Chapitre 1 — La poésie du XIXe au XXIe siècle
        // ===================================================================
        {
          titre: 'La poésie du XIXe au XXIe siècle',
          axe: 'La poésie du XIXe au XXIe siècle',
          lecon: {
            titre: 'L’objet d’étude : ce qu’on attend de vous',
            cours: `Deux siècles de poésie, **trois œuvres** au choix du professeur, une épreuve : l’**explication linéaire** à l’oral et, à l’écrit, le **commentaire** ou la **dissertation**.

## Ce que le programme demande
On étudie une **œuvre intégrale** et son **parcours associé** — un fil de lecture, formulé par le programme, qui oriente la dissertation.

| Ce qu’il faut savoir faire | Le détail |
| **Situer** l’œuvre | Auteur, date, contexte |
| Connaître sa **structure** | Sections, progression |
| **Citer** une dizaine de textes | De mémoire, avec précision |
| Rattacher chacun au **parcours** | C’est ce qui fait la dissertation |

## Le vers et la prose
| Vers | Son nombre de syllabes |
| L’**octosyllabe** | 8 |
| Le **décasyllabe** | 10 |
| L’**alexandrin** | **12** |

> Le **e muet** compte devant consonne, s’**élide** devant voyelle ou en fin de vers.

| Notion | Ce qu’elle désigne |
| La **césure** | Elle coupe l’alexandrin en deux **hémistiches** |
| L’**enjambement**, le **rejet**, le **contre-rejet** | Ils brisent la coïncidence entre vers et phrase |

> Cette rupture **fait sens** : elle n’est jamais un accident métrique.

| Rimes, par disposition | Rimes, par richesse |
| **Plates** AABB | **Pauvres** : un son commun |
| **Croisées** ABAB | **Suffisantes** : deux |
| **Embrassées** ABBA | **Riches** : trois ou plus |

| Forme | Son époque |
| Le **sonnet** — deux quatrains, deux tercets | La forme reine du XIXe |
| Le **poème en prose** | Baudelaire, Rimbaud |
| Le **vers libre** | Apollinaire, puis tout le XXe |

> Le vers libre abandonne le mètre, **jamais le rythme**.

## Trois moments à situer
| Moment | Ce que devient le poète |
| Le **romantisme** — Hugo, Lamartine | Une **conscience** qui dit le moi et le monde |
| Le **symbolisme** et la modernité — Baudelaire, Rimbaud, Mallarmé | Le poème devient une **expérience de langage**, non un message |
| Les **XXe et XXIe siècles** | Le poème se fait **atelier** (Ponge), cri, ou traversée intime du monde naturel (Dorion) |

## Les figures à savoir nommer
Comparaison et **métaphore**, **personnification**, **oxymore**, **anaphore**, **allitération** et **assonance**, **synesthésie** — les correspondances entre les sens, cœur du programme baudelairien.

> **Nommer ne suffit jamais** : à l’oral, une figure repérée doit être suivie d’un **effet** et d’une **interprétation**.

> La règle d’or de l’explication linéaire : **suivre le mouvement du texte**, du premier vers au dernier, sans plan thématique plaqué.`,
          },
          questions: [
            ['Combien de syllabes compte un alexandrin ?', ['12', '10', '8', '14'], 0, 'L’octosyllabe en compte 8, le décasyllabe 10 : ce sont les trois mètres à connaître.'],
            ['Comment appelle-t-on la coupe qui sépare les deux hémistiches de l’alexandrin ?', ['La césure', 'L’élision', 'La diérèse', 'Le rejet'], 0, 'Elle tombe classiquement après la sixième syllabe.'],
            ['Qu’est-ce qu’un enjambement ?', ['La phrase se poursuit au vers suivant sans pause', 'Deux vers riment ensemble', 'Une syllabe est supprimée', 'Un vers est plus long que les autres'], 0, 'Quand le débordement est bref et mis en valeur, on parle de rejet.'],
            ['Quelle est la structure d’un sonnet ?', ['Deux quatrains puis deux tercets', 'Trois quatrains puis un distique', 'Quatre tercets', 'Deux tercets puis deux quatrains'], 0, 'Forme héritée de la Renaissance italienne, encore dominante au XIXe siècle.'],
            ['Qu’est-ce qu’une synesthésie ?', ['Une correspondance entre des sensations de sens différents', 'Une répétition en début de vers', 'Un rapprochement de deux mots contradictoires', 'Une comparaison sans outil de comparaison'], 0, 'C’est la figure des « Correspondances » de Baudelaire : parfums, couleurs et sons se répondent.'],
            ['Comment nomme-t-on la disposition de rimes ABBA ?', ['Rimes embrassées', 'Rimes croisées', 'Rimes plates', 'Rimes suivies'], 0, 'ABAB donne des rimes croisées, AABB des rimes plates ou suivies.'],
            ['Le parcours associé est un simple thème décoratif, sans effet sur l’épreuve.', ['Vrai', 'Faux'], 1, 'Il oriente le sujet de dissertation : le connaître, c’est déjà avoir le plan de la moitié des sujets possibles.'],
            ['Quelle méthode l’explication linéaire impose-t-elle à l’oral ?', ['Suivre le mouvement du texte du début à la fin', 'Regrouper les remarques par thèmes', 'Comparer le texte à une autre œuvre', 'Résumer le texte puis donner son avis'], 0, 'Le plan thématique plaqué est la faute la plus sanctionnée de l’exercice.'],
          ],
        },
        {
          titre: 'Les Cahiers de Douai',
          axe: 'La poésie du XIXe au XXIe siècle',
          lecon: {
            titre: 'Rimbaud, 1870 — vingt-deux poèmes écrits à seize ans',
            cours: `Parcours associé : **émancipations créatrices**. Tout tient dans cette formule : un adolescent quitte sa ville, sa mère et les formes reçues — et le poème est le lieu où il s’en libère.

## Ce que sont les « Cahiers de Douai »
| Fait | Le détail |
| Ce n’est **pas** un recueil composé par l’auteur | **Vingt-deux poèmes** recopiés à la main |
| L’âge de Rimbaud | **Quinze et seize ans** |
| Le lieu et la date | Chez son ami **Paul Demeny**, à **Douai**, en **1870** |
| La forme | **Deux liasses** |
| Le titre | **Posthume** — on dit aussi « recueil Demeny » |

> Cette origine explique l’**absence de progression narrative** : ce sont des **textes de fugue**, écrits pendant les mois où Rimbaud s’échappe de Charleville.

## Trois veines
| Veine | Ses textes | Ce qu’elle fait |
| La **fugue** et la **sensation** | « Sensation », « Ma Bohème », « Au Cabaret-Vert », « Roman » | Le corps marche, mange, regarde ; la nature remplace la maison |
| La **satire** politique et sociale | « Le Forgeron », « Rages de Césars », « Le Mal », « Le Dormeur du val » | Le pouvoir, l’Église et l’armée attaqués **frontalement** |
| La **provocation** et le corps | « Vénus Anadyomène », « Les Reparties de Nina », « À la Musique » | La beauté conventionnelle **retournée en laideur crue** |

Rimbaud écrit pendant la **guerre franco-prussienne** et la chute du Second Empire : le contexte est dans les textes.

## Le travail de la forme
| Ce qu’il maîtrise | Ce qu’il maltraite |
| Sonnets réguliers, alexandrins impeccables | **Enjambements violents**, rejets |
| — | **Ruptures de registre** : mots familiers ou triviaux dans un moule noble |

> « Le Dormeur du val » en est le modèle : **treize vers** de nature riante, puis la chute — « Il a **deux trous rouges** au côté droit ».

## En dissertation
L’émancipation est **triple** :

| Contre quoi | De qui |
| La famille et la province | L’**adolescent** |
| L’ordre impérial et clérical | Le **citoyen** |
| Les formes héritées | Le **poète** |

> Et elle passe par la **sensation** : le monde est d’abord **touché, senti, mangé** — avant d’être pensé.`,
          },
          questions: [
            ['Combien de poèmes composent les Cahiers de Douai ?', ['22', '12', '50', '30'], 0, 'Recopiés en deux liasses chez Paul Demeny, à Douai, en 1870.'],
            ['Quel âge a Rimbaud lorsqu’il écrit ces poèmes ?', ['Quinze et seize ans', 'Vingt ans', 'Dix-huit ans', 'Vingt-cinq ans'], 0, 'C’est un argument central du parcours : l’émancipation est d’abord celle d’un adolescent.'],
            ['Quel est le parcours associé à l’œuvre ?', ['Émancipations créatrices', 'Alchimie poétique : la boue et l’or', 'La célébration du monde', 'Modernité poétique ?'], 0, 'Émancipation de l’adolescent, du citoyen et du poète : les trois se lisent dans les mêmes textes.'],
            ['Sur quelle chute se termine « Le Dormeur du val » ?', ['Deux trous rouges au côté droit', 'Un baiser volé', 'Une aube d’été', 'Un cri de révolte'], 0, 'Treize vers de nature riante préparent la révélation du dernier : le soldat est mort.'],
            ['Quel événement historique traverse le recueil ?', ['La guerre franco-prussienne de 1870', 'La Révolution de 1789', 'La Commune de Paris de 1871', 'La Première Guerre mondiale'], 0, 'La chute du Second Empire nourrit les poèmes satiriques comme « Rages de Césars ».'],
            ['Dans « Ma Bohème », comment le poète se présente-t-il ?', ['En vagabond, les poings dans ses poches crevées', 'En soldat blessé', 'En savant enfermé dans sa bibliothèque', 'En amant éconduit'], 0, 'La fugue devient la condition même de l’écriture.'],
            ['Rimbaud rejette entièrement les formes classiques dans ce recueil.', ['Vrai', 'Faux'], 1, 'Il écrit des sonnets et des alexandrins réguliers : il les fait craquer de l’intérieur, par les enjambements et le vocabulaire.'],
            ['Quel poème retourne les codes de la beauté idéale en laideur crue ?', ['Vénus Anadyomène', 'Sensation', 'Au Cabaret-Vert', 'Le Forgeron'], 0, 'Le sonnet, forme noble, y sert une description volontairement répugnante.'],
          ],
        },
        {
          titre: 'La rage de l’expression',
          axe: 'La poésie du XIXe au XXIe siècle',
          lecon: {
            titre: 'Ponge, 1952 — le poème montré en chantier',
            cours: `Parcours associé : **dans l’atelier du poète**. L’œuvre est unique en son genre : au lieu de livrer des poèmes **finis**, Francis Ponge publie les **brouillons** eux-mêmes — datés, repris, contredits.

## Un livre de carnets
| Fait | Le détail |
| Période d’écriture | **1938-1944** |
| Publication | **1952** |
| Composition | **Sept** ensembles |

« Berges de la Loire », « Le Carnet du bois de pins », « La Mounine », « L’Œillet », « La Guêpe », « Le Mimosa », « Notes prises pour un oiseau ».

> Chacun est un **journal d’écriture** : on y voit le poète **recommencer**, rayer, **dater ses séances**, avouer ses échecs.

## Le parti pris des choses, poursuivi
Ponge choisit des objets **modestes** — un pin, un œillet, une guêpe, une branche de mimosa — et cherche à les dire **sans les humaniser ni les symboliser**.

| Le lyrisme romantique | Ponge |
| La chose est un **miroir** des sentiments du poète | La chose est un **défi posé au langage** |

## Ce que veut dire « rage »
Le mot dit l’**acharnement** : la langue ne rend **jamais** l’objet, il faut donc reprendre.

> « Berges de la Loire » ouvre par une déclaration de méthode : se tenir **devant l’objet** et se laisser corriger **par lui**, plutôt que par la rhétorique.

> L’**échec est intégré à l’œuvre** : c’est le **sujet**, pas l’accident.

## L’écriture
| Outil | Son usage |
| L’**étymologie** et le **dictionnaire** | Ponge écrit avec le **Littré ouvert** |
| Les **jeux sonores** | Le mot travaillé pour lui-même |
| Les **définitions successives** | Aucune n’est la bonne |
| Les **néologismes** | Quand la langue manque |

La prose y côtoie le vers, la note brute la phrase travaillée.

> On y trouve peu de « je » **sentimental** et beaucoup de « je » **technicien** : un **ouvrier au travail**.

## En dissertation
> L’œuvre déplace l’idée même de poème : le poème n’est plus un **résultat** mais un **processus** — et le lecteur est mis à la place du poète, dans l’atelier, **devant l’objet qui résiste**.

> C’est aussi une leçon de **modestie** : nommer une guêpe correctement est plus difficile que chanter ses états d’âme.`,
          },
          questions: [
            ['Quelle est la particularité de La rage de l’expression ?', ['Elle publie les brouillons et les reprises du poète', 'Elle ne contient que des sonnets', 'Elle raconte la vie de l’auteur', 'Elle est écrite en vers réguliers'], 0, 'Le livre est fait de carnets datés : on voit le poème se chercher.'],
            ['Quel est le parcours associé à l’œuvre ?', ['Dans l’atelier du poète', 'Émancipations créatrices', 'La poésie, la nature, l’intime', 'Les Mémoires d’une âme'], 0, 'L’atelier est ici littéral : ce sont les séances de travail elles-mêmes qui sont publiées.'],
            ['Quels objets Ponge choisit-il de décrire ?', ['Des objets modestes : un pin, un œillet, une guêpe, un mimosa', 'Des paysages grandioses', 'Des figures mythologiques', 'Des scènes historiques'], 0, 'Le choix du minuscule est une prise de position contre le lyrisme du grandiose.'],
            ['Que refuse Ponge en décrivant les choses ?', ['De les humaniser et d’en faire le miroir de ses sentiments', 'De les nommer précisément', 'D’utiliser le dictionnaire', 'De les observer directement'], 0, 'C’est le contraire du paysage romantique, où la nature reflète l’âme du poète.'],
            ['Que désigne le mot « rage » du titre ?', ['L’acharnement du poète à reprendre son texte', 'La colère politique', 'La violence de la nature décrite', 'La haine du lecteur'], 0, 'L’échec de la langue à saisir l’objet est intégré à l’œuvre, il en est le sujet.'],
            ['Quel outil accompagne l’écriture de Ponge ?', ['Le dictionnaire, notamment le Littré', 'Le carnet de voyage', 'Le journal intime', 'Le traité de versification'], 0, 'L’étymologie et les définitions successives sont des matériaux du poème.'],
            ['Les textes de La rage de l’expression sont tous écrits en vers.', ['Vrai', 'Faux'], 1, 'La prose domine, mêlée à des notes brutes et à quelques passages versifiés.'],
            ['En quelle année l’œuvre paraît-elle ?', ['1952', '1942', '1938', '1961'], 0, 'Elle rassemble des textes écrits entre 1938 et 1944.'],
          ],
        },
        {
          titre: 'Mes forêts',
          axe: 'La poésie du XIXe au XXIe siècle',
          lecon: {
            titre: 'Hélène Dorion, 2021 — la forêt comme miroir intime',
            cours: `Parcours associé : **la poésie, la nature, l’intime**. Publié en **2021**, le recueil de la poétesse québécoise **Hélène Dorion** est la **première œuvre d’une autrice vivante** inscrite au programme du bac de français.

## La composition
Quatre sections, précédées d’un poème liminaire.

| Section | Son motif |
| **L’écorce incertaine** | La forêt comme **corps** et comme mémoire |
| **Une chute de galets** | La fragilité, la perte, le **deuil** |
| **Mes forêts sont de longues traînées de temps** | Le temps, l’enfance, la **filiation** |
| **Le bruissement du temps** | L’écoute, la présence au monde, l’**apaisement** |

> Des **citations en exergue** — Rilke, Char, des scientifiques — ouvrent les sections : le recueil **dialogue** avec d’autres voix.

## La forêt n’est pas un décor
Elle est un **double du sujet**.

| Le mot de l’arbre | Ce qu’il dit aussi de l’humain |
| Les **racines** | L’origine, la filiation |
| Les **cernes** | Le temps accumulé |
| L’**écorce** | La protection, la blessure |
| Tomber et repousser | La perte et le recommencement |

> Le titre le dit avec un **possessif** : *mes* forêts. Le paysage est **intérieur autant qu’extérieur**, et c’est en le décrivant que le « je » se dit.

## Une écriture du dépouillement
| Procédé | Son effet |
| **Vers libres**, poèmes courts | Une lecture qui respire |
| Absence quasi totale de **ponctuation** | Le sens reste ouvert |
| **Blancs typographiques** nombreux | Le **silence fait partie du texte** |
| Les **anaphores** — « mes forêts sont… » | Une pulsation d’**incantation** |

> La langue est **simple, concrète, sans effet rare** : la difficulté est ailleurs, dans la **densité des images**.

## Les thèmes du parcours
| Thème | Ce qu’il recouvre |
| L’**intime** | Le deuil du père, l’enfance, le corps qui vieillit |
| La **nature** | L’arbre, la lumière, l’eau, la neige, l’oiseau |
| L’**écologie** | Non comme discours militant, mais comme **conscience d’appartenir au vivant** |

> Quand la forêt brûle, c’est **nous** que la perte atteint.

## En dissertation
> Le recueil **refuse la séparation** entre le sujet et le monde : le poème ne décrit pas la nature **vue par** un moi, il montre un moi **fait de** nature.

> C’est en cela qu’il **renouvelle le lyrisme sans le refuser** — contrairement à Ponge. La comparaison est le meilleur angle de dissertation.`,
          },
          questions: [
            ['En quelle année Mes forêts a-t-il été publié ?', ['2021', '1998', '2010', '1952'], 0, 'C’est la première œuvre d’une autrice vivante inscrite au programme du bac de français.'],
            ['De quelle nationalité est Hélène Dorion ?', ['Québécoise', 'Française', 'Belge', 'Suisse'], 0, 'Elle est une des grandes voix de la poésie contemporaine de langue française.'],
            ['Combien de sections composent le recueil ?', ['Quatre', 'Deux', 'Sept', 'Douze'], 0, 'Elles sont précédées d’un poème liminaire et ouvertes par des citations en exergue.'],
            ['Quel est le parcours associé à l’œuvre ?', ['La poésie, la nature, l’intime', 'Dans l’atelier du poète', 'Émancipations créatrices', 'La célébration du monde'], 0, 'Le recueil fait tenir ces trois termes ensemble, jamais séparément.'],
            ['Que signifie le possessif du titre « Mes forêts » ?', ['La forêt est un paysage intérieur autant qu’extérieur', 'La poétesse possède une forêt', 'Il s’agit de forêts imaginaires', 'Le titre est ironique'], 0, 'L’arbre — racines, cernes, écorce — sert à dire une vie humaine.'],
            ['Quelle forme prennent les poèmes du recueil ?', ['Des vers libres, presque sans ponctuation', 'Des sonnets réguliers', 'Des poèmes en prose', 'Des alexandrins rimés'], 0, 'Les blancs typographiques et les anaphores donnent au texte sa pulsation.'],
            ['La dimension écologique du recueil prend la forme d’un discours militant.', ['Vrai', 'Faux'], 1, 'Elle passe par la conscience d’appartenir au vivant : la perte de la forêt est vécue comme une perte intime.'],
            ['Quel deuil traverse le recueil ?', ['Celui du père', 'Celui d’un enfant', 'Celui d’un ami poète', 'Aucun deuil'], 0, 'Il nourrit la deuxième section, « Une chute de galets ».'],
          ],
        },
        // ===================================================================
        // Chapitre 2 — La littérature d’idées du XVIe au XVIIIe siècle
        // ===================================================================
        {
          titre: 'La littérature d’idées du XVIe au XVIIIe siècle',
          axe: 'La littérature d’idées du XVIe au XVIIIe siècle',
          lecon: {
            titre: 'L’objet d’étude : convaincre, persuader, délibérer',
            cours: `Trois siècles pendant lesquels la littérature sert à **penser** : l’humanisme, l’âge classique, les Lumières. L’objet d’étude ne demande pas une histoire des idées, mais de savoir **comment un texte agit sur son lecteur**.

## Les trois visées
| Visée | À quoi elle s’adresse | Ses moyens |
| **Convaincre** | À la **raison** | Thèse, arguments, exemples, connecteurs logiques |
| **Persuader** | Aux **émotions** et à l’imagination | Récit, image, ironie, apostrophe, rythme |
| **Délibérer** | Au **jugement** | Le pour et le contre, souvent par **dialogue**, sans trancher d’avance |

> Un même texte fait presque toujours **les trois** : l’analyse consiste à repérer **laquelle domine, et pourquoi**.

## Argumentation directe ou indirecte
| | **Directe** | **Indirecte** |
| Les formes | Essai, **discours**, lettre ouverte, article | **Fable**, conte philosophique, **apologue**, utopie, lettre fictive |
| Son avantage | La clarté | Elle **échappe à la censure** et se retient mieux |

> Le **regard étranger** — le Persan, le Huron, la Péruvienne — est le procédé maître de l’argumentation indirecte : **ce que l’habitude rend invisible devient absurde vu du dehors**.

## Trois moments
| Moment | Sa posture | Ses auteurs |
| L’**humanisme** (XVIe) | Confiance dans l’étude et les Anciens, **examen critique de tout** | Montaigne, Rabelais, La Boétie |
| L’**âge classique** (XVIIe) | Le moraliste observe l’homme **en société** ; la forme est **brève et ciselée** | La Rochefoucauld, La Bruyère, La Fontaine |
| Les **Lumières** (XVIIIe) | La raison contre les **préjugés** : tolérance, égalité, diffusion des savoirs | Montesquieu, Voltaire, Diderot, Fontenelle, Olympe de Gouges |

## Les outils à savoir nommer
**Ironie** et **antiphrase**, **hyperbole**, **question rhétorique**, **antithèse**, **gradation**, **modalisateurs**, **connecteurs logiques**, lexique **péjoratif** ou **mélioratif**.

> À l’oral, chaque outil repéré doit être rattaché à une **visée** : ridiculiser, émouvoir, faire douter, faire agir.

> Un texte d’idées se lit toujours en se demandant : **contre qui** écrit-il, et **pour convaincre qui** ?`,
          },
          questions: [
            ['À quoi s’adresse une argumentation qui vise à convaincre ?', ['À la raison du lecteur', 'À ses émotions', 'À son imagination', 'À sa mémoire'], 0, 'Persuader s’adresse aux émotions ; délibérer pèse le pour et le contre.'],
            ['Qu’est-ce que l’argumentation indirecte ?', ['Défendre une thèse par le détour de la fiction', 'Écrire un essai sans plan', 'Citer un auteur célèbre', 'Répondre à un adversaire par lettre'], 0, 'Fable, conte philosophique, utopie, lettre fictive : le détour contourne aussi la censure.'],
            ['Quel procédé consiste à faire décrire la société française par un visiteur étranger ?', ['Le regard éloigné', 'La maxime', 'L’antiphrase', 'La périphrase'], 0, 'Ce que l’habitude rend invisible redevient étrange, donc discutable.'],
            ['Qu’est-ce qu’une antiphrase ?', ['Dire le contraire de ce que l’on pense pour être compris ironiquement', 'Répéter un mot en début de phrase', 'Rapprocher deux termes opposés', 'Exagérer volontairement'], 0, 'C’est le principal support de l’ironie.'],
            ['Quel siècle correspond aux Lumières ?', ['Le XVIIIe', 'Le XVIe', 'Le XVIIe', 'Le XIXe'], 0, 'Le XVIe est celui de l’humanisme, le XVIIe celui des moralistes classiques.'],
            ['Quel genre bref les moralistes du XVIIe siècle privilégient-ils ?', ['La maxime et le portrait', 'Le roman-fleuve', 'La tragédie en vers', 'L’essai autobiographique'], 0, 'La Rochefoucauld et La Bruyère en sont les maîtres.'],
            ['Un texte peut viser à la fois à convaincre et à persuader.', ['Vrai', 'Faux'], 0, 'C’est même le cas le plus fréquent : l’analyse consiste à déterminer lequel des deux domine.'],
            ['Qu’est-ce qu’un modalisateur ?', ['Un mot qui marque le degré d’adhésion de l’auteur à ce qu’il dit', 'Un connecteur logique', 'Une figure d’insistance', 'Un synonyme atténué'], 0, '« Peut-être », « sans doute », « il est certain que » : ils dessinent la position de l’énonciateur.'],
          ],
        },
        {
          titre: 'Discours de la servitude volontaire',
          axe: 'La littérature d’idées du XVIe au XVIIIe siècle',
          lecon: {
            titre: 'La Boétie, vers 1548 — pourquoi obéit-on ?',
            cours: `Parcours associé : **peut-on se libérer de la servitude ?** Le *Discours de la servitude volontaire*, aussi appelé *Contr’un*, est écrit par **Étienne de La Boétie** vers **1548** — il n’a pas **vingt ans** — et publié **après sa mort**.

## Le renversement de départ
| La question habituelle | La question de La Boétie |
| Comment le **tyran** tient-il le peuple ? | Comment le **peuple** tient-il le tyran ? |

> Un homme seul ne peut rien contre des millions. S’il domine, c’est que les dominés lui **donnent** leur force.

> La domination n’est donc **pas subie**, elle est **consentie** — d’où le paradoxe du titre : une servitude *volontaire*.

## La conséquence, immédiate et désarmante
« **Soyez résolus de ne servir plus, et vous voilà libres.** »

| Ce qu’il ne faut pas | Ce qu’il suffit de faire |
| Ni bataille, ni armes | **Retirer son consentement** |

> Le tyran, écrit La Boétie, tombe comme un **colosse dont on a retiré le socle**.

## Les trois ressorts de l’obéissance
| Ressort | Comment il agit |
| L’**habitude** | On naît sous le joug, on le croit **naturel** : « la première raison de la servitude volontaire, c’est la **coutume** » |
| Le **divertissement** | Jeux, théâtres, fêtes, distributions de blé : le pouvoir **amuse ceux qu’il dépouille** |
| La **chaîne des complices** | « Cinq ou six » profitent du tyran, six cents en profitent à leur tour, six mille ensuite |

> La troisième est la plus redoutable : une **pyramide d’intérêts** fait tenir l’édifice **sans que le tyran ait à agir**.

## L’écriture
Un texte **court, oral, brûlant** : **apostrophes** au lecteur, **questions rhétoriques**, exclamations, **métaphores** frappantes — le colosse, la chaîne, le feu.

> L’érudition antique (Xerxès, les Spartiates, Ulysse) sert la **démonstration**, jamais l’ornement. C’est un discours d’humaniste : la **liberté est naturelle**, la **servitude est acquise**.

## En dissertation
> L’œuvre déplace la **responsabilité politique** du tyran vers le peuple. Cette audace la rendra utilisable par **tous les camps** : protestants au XVIe, révolutionnaires ensuite, anarchistes et théoriciens de la **désobéissance civile** au XXe.

La Boétie était l’ami intime de **Montaigne**, qui lui consacre le chapitre « De l’amitié » des *Essais*.`,
          },
          questions: [
            ['Quelle question centrale le Discours de la servitude volontaire pose-t-il ?', ['Pourquoi les peuples consentent-ils à obéir à un seul homme ?', 'Comment un roi doit-il gouverner ?', 'Faut-il tuer le tyran ?', 'Quelle est la meilleure constitution ?'], 0, 'Le renversement est là : ce n’est pas le tyran qui tient le peuple, c’est le peuple qui le porte.'],
            ['Quelle solution La Boétie propose-t-il contre la tyrannie ?', ['Cesser de consentir, sans violence', 'Assassiner le tyran', 'Organiser une armée', 'Attendre un souverain plus juste'], 0, '« Soyez résolus de ne servir plus, et vous voilà libres. »'],
            ['Quelle est, selon La Boétie, la première cause de la servitude ?', ['La coutume et l’habitude', 'La peur des armes', 'La religion', 'La pauvreté'], 0, 'On naît sous le joug et l’on croit qu’il est naturel.'],
            ['Comment La Boétie nomme-t-il le système d’intérêts qui soutient le tyran ?', ['Une pyramide de complices, des cinq ou six aux six mille', 'Une armée de mercenaires', 'Un conseil de sages', 'Une assemblée élue'], 0, 'Chaque étage profite de l’étage supérieur : le tyran n’a presque rien à faire.'],
            ['Quel rôle jouent les jeux et les fêtes selon La Boétie ?', ['Ils divertissent le peuple pour mieux l’asservir', 'Ils entretiennent la santé publique', 'Ils permettent la révolte', 'Ils n’ont aucun rôle politique'], 0, 'Le divertissement est le second ressort de la servitude volontaire.'],
            ['À quel écrivain La Boétie était-il intimement lié ?', ['Montaigne', 'Rabelais', 'Ronsard', 'Du Bellay'], 0, 'Montaigne lui consacre le chapitre « De l’amitié » des Essais.'],
            ['Le Discours a été publié du vivant de son auteur.', ['Vrai', 'Faux'], 1, 'Il circule d’abord manuscrit et paraît après sa mort, notamment repris par des pamphlétaires protestants.'],
            ['Quel est l’autre titre traditionnel de l’œuvre ?', ['Le Contr’un', 'Le Prince', 'L’Utopie', 'Le Léviathan'], 0, 'Titre qui dit la thèse : tout le texte est dirigé contre le pouvoir d’un seul.'],
          ],
        },
        {
          titre: 'Entretiens sur la pluralité des mondes',
          axe: 'La littérature d’idées du XVIe au XVIIIe siècle',
          lecon: {
            titre: 'Fontenelle, 1686 — six soirs pour comprendre le ciel',
            cours: `Parcours associé : **peut-on rendre la science accessible ?** Publié en **1686**, l’ouvrage de **Bernard Le Bouyer de Fontenelle** invente presque la **vulgarisation scientifique** moderne.

## Le dispositif
Un philosophe séjourne chez une **marquise**. Chaque soir, dans le parc du château, ils regardent le ciel et conversent : **six soirs**, **six leçons**.

| Ce que le dialogue permet | Pourquoi c’est décisif |
| Les **objections** de la marquise | Elles sont celles du **lecteur** |
| Les **résistances** et les images | La compréhension progresse par étapes |
| — | Il rend visible le **chemin**, pas seulement le **résultat** |

> Le lecteur, comme la marquise, **part de zéro**.

## Ce qui est enseigné
| Notion | Ce qu’elle bouscule |
| Le **système de Copernic** | La Terre tourne autour du Soleil **et** sur elle-même |
| La **taille** de l’univers | Elle dépasse l’imagination |
| La nature des **planètes** | Des mondes, pas des points lumineux |
| La **pluralité des mondes habités** | Les étoiles fixes vues comme autant de **soleils** |

> Fontenelle la présente comme une **conjecture raisonnable**, **jamais comme un dogme**. La prudence est une méthode.

## Les images qui font tout
| Image | Ce qu’elle explique |
| Le **spectacle d’opéra** | Le spectateur voit les **effets** ; le philosophe cherche les **machines et les cordes** derrière le décor |
| La Terre comme **vaisseau** | Le mouvement qu’on ne sent pas |
| L’univers comme **horloge** | Un mécanisme réglé |
| Les autres mondes comme **voisins** | Qu’on n’a pas encore visités |

> Chaque notion difficile est rendue par une **analogie prise dans le monde mondain** de la marquise.

## Le ton
**Galanterie**, esprit, humour, compliments à l’interlocutrice : Fontenelle écrit pour un public **mondain, largement féminin**, exclu du latin et des académies.

> Le badinage est une **stratégie de diffusion**, pas une faiblesse — et il a une portée **politique** : il suppose que la science **n’est pas réservée aux savants**.

## En dissertation
| La tension de l’œuvre | La réponse de Fontenelle |
| Rendre accessible, c’est **simplifier** | Le **dialogue** : la marquise pose les objections |
| Simplifier, c’est risquer de **déformer** | La **prudence** : des hypothèses, pas des vérités assénées |

> L’ouvrage annonce les Lumières : **diffuser les savoirs est déjà une manière de combattre les préjugés**.`,
          },
          questions: [
            ['Quelle forme littéraire Fontenelle choisit-il ?', ['Le dialogue, sur six soirs', 'Le traité en chapitres numérotés', 'La lettre ouverte', 'Le conte philosophique'], 0, 'Le dialogue rend visible le chemin de la compréhension, objections comprises.'],
            ['Qui est l’interlocutrice du philosophe ?', ['Une marquise', 'Une religieuse', 'Une astronome', 'Sa propre fille'], 0, 'Elle représente le public mondain, souvent féminin, tenu à l’écart des savoirs savants.'],
            ['Quel système astronomique l’ouvrage expose-t-il ?', ['Le système de Copernic', 'Le système de Ptolémée', 'La théorie de la relativité', 'Le système de Tycho Brahe'], 0, 'La Terre tourne autour du Soleil : l’ouvrage le rend accessible à un public non savant.'],
            ['Quelle hypothèse audacieuse le livre défend-il ?', ['Les autres mondes pourraient être habités', 'La Terre est plate', 'Le Soleil tourne autour de la Terre', 'Les étoiles sont des reflets'], 0, 'D’où le titre : la pluralité des mondes.'],
            ['À quel spectacle Fontenelle compare-t-il l’univers ?', ['À un opéra dont on cherche les machines cachées', 'À une bataille rangée', 'À une bibliothèque', 'À un jardin à la française'], 0, 'Le spectateur voit les effets, le philosophe cherche les cordes derrière le décor.'],
            ['En quelle année paraissent les Entretiens ?', ['1686', '1748', '1610', '1751'], 0, 'Un siècle avant l’Encyclopédie, dont l’ouvrage annonce le projet de diffusion des savoirs.'],
            ['Le ton galant de l’ouvrage est une faiblesse qui trahit la rigueur scientifique.', ['Vrai', 'Faux'], 1, 'C’est une stratégie de diffusion assumée : elle suppose que la science n’appartient pas aux seuls savants.'],
            ['Quelle tension traverse l’œuvre selon le parcours ?', ['Rendre accessible sans déformer', 'Croire ou savoir', 'Obéir ou se révolter', 'Décrire ou raconter'], 0, 'Fontenelle y répond par le dialogue et par la prudence des hypothèses.'],
          ],
        },
        {
          titre: 'Lettres d’une Péruvienne',
          axe: 'La littérature d’idées du XVIe au XVIIIe siècle',
          lecon: {
            titre: 'Françoise de Graffigny, 1747 — une étrangère juge la France',
            cours: `Le parcours tourne autour du **regard éloigné** et de la **découverte de soi**. Le roman épistolaire de **Françoise de Graffigny** paraît en **1747**, augmenté en **1752** : l’un des plus grands succès du siècle.

## L’histoire
| Étape | Ce qui arrive à Zilia |
| Le début | Jeune Inca promise à **Aza**, elle est enlevée par les **conquistadors** le jour de ses noces |
| En mer | Capturée par des **Français** |
| En France | Recueillie par le chevalier **Déterville** ; elle ignore tout — langue, usages, religion, place des femmes |
| Elle écrit | D’abord sur des **quipus**, cordelettes nouées des Incas ; puis, épuisés, **en français**, qu’elle a appris |

## Le regard étranger comme arme
Ne rien comprendre permet de **tout décrire sans l’excuse de l’habitude**.

| L’objet devenu énigme | Ce qu’il dévoile |
| Les **miroirs**, les carrosses | La vanité |
| Les rites **religieux** | L’hypocrisie |
| La **politesse mondaine** | La superficialité |
| L’**éducation des femmes** | Réduite à des ornements, **privée de savoir** |

> La lettre sur l’éducation des femmes est restée célèbre : c’est la charge la plus directe du livre.

## Une héroïne qui apprend
Le roman est aussi un **récit d’apprentissage**.

| Étape | Ce qu’écrire devient |
| D’abord | **Survivre** |
| Ensuite | **Comprendre** |
| Enfin | **Exister par soi-même** |

## Un dénouement sans mariage
| Prétendant | Ce qui se passe |
| **Aza**, retrouvé | Converti, il va épouser une Espagnole |
| **Déterville** | Il aime Zilia et espère |
| **Zilia** | Elle refuse **les deux** |

Elle choisit l’**amitié**, l’**étude** et la retraite dans la maison offerte par Déterville.

> Ce refus du mariage est **impensable** dans le roman de l’époque, où l’héroïne finit **mariée ou morte**. C’est le geste le plus radical du livre.

## En dissertation
> La forme **épistolaire** fait tenir ensemble les deux visées : la **satire** de la société d’accueil et la **construction d’un sujet féminin autonome**.

> Le roman ne se contente pas de **critiquer** la condition des femmes : il **montre une femme qui, page après page, s’en sort par le langage**.`,
          },
          questions: [
            ['Qui est Zilia ?', ['Une jeune Inca enlevée par les Espagnols puis conduite en France', 'Une aristocrate française en voyage au Pérou', 'Une religieuse espagnole', 'Une servante de Déterville'], 0, 'Son ignorance des usages français est le moteur du regard critique.'],
            ['Sur quel support Zilia écrit-elle ses premières lettres ?', ['Des quipus, cordelettes nouées incas', 'Du papier de riz', 'Des tablettes de cire', 'Des feuilles de palmier'], 0, 'Quand elle les a épuisés, elle poursuit en français, langue qu’elle a apprise.'],
            ['Quel personnage recueille Zilia en France ?', ['Le chevalier Déterville', 'Le prince Aza', 'Le marquis de Sévigné', 'Le père Ambroise'], 0, 'Il l’aime, mais elle refusera de l’épouser.'],
            ['Comment se termine le roman ?', ['Zilia refuse le mariage et choisit l’étude et l’amitié', 'Zilia épouse Déterville', 'Zilia retrouve Aza et l’épouse', 'Zilia meurt de chagrin'], 0, 'Un dénouement inouï pour l’époque, où l’héroïne finissait mariée ou morte.'],
            ['Quelle critique sociale le roman développe-t-il particulièrement ?', ['L’éducation des femmes, réduite aux ornements', 'La fiscalité royale', 'La politique coloniale espagnole seule', 'L’organisation de l’armée'], 0, 'C’est la dénonciation la plus célèbre de l’œuvre.'],
            ['En quelle année paraît la première édition ?', ['1747', '1782', '1721', '1759'], 0, 'Une version augmentée paraît en 1752 ; le succès fut considérable.'],
            ['Le regard étranger sert seulement à faire rire du personnage principal.', ['Vrai', 'Faux'], 1, 'Il retourne le rire contre la société décrite : ce sont les usages français qui deviennent absurdes.'],
            ['À quel genre romanesque l’œuvre appartient-elle ?', ['Le roman épistolaire', 'Le roman-mémoires', 'Le conte philosophique', 'Le roman picaresque'], 0, 'La forme des lettres fait tenir ensemble satire de la société et construction du sujet.'],
          ],
        },
        // ===================================================================
        // Chapitre 3 — Le roman et le récit du Moyen Âge au XXIe siècle
        // ===================================================================
        {
          titre: 'Le roman et le récit du Moyen Âge au XXIe siècle',
          axe: 'Le roman et le récit du Moyen Âge au XXIe siècle',
          lecon: {
            titre: 'L’objet d’étude : qui raconte, et d’où ?',
            cours: `Le roman est le genre qui a le **plus changé** : né en vers au Moyen Âge, forme dominante au XIXe, il se retourne contre lui-même au XXe. L’objet d’étude demande d’analyser un **récit** — pas d’en résumer l’histoire.

## Les trois questions du narrateur
| Question | Les réponses possibles |
| **Qui raconte ?** | Narrateur **interne** (« je », personnage), **externe**, ou **omniscient** (il entre dans les consciences) |
| **Depuis quel point de vue ?** | Focalisation **interne** (par les yeux d’un personnage), **zéro** (savoir total), **externe** (on filme du dehors) |
| **Quand ?** | Récit **rétrospectif** (après coup, comme Des Grieux), **simultané**, ou **enchâssé** |

> Le récit **enchâssé** — un récit dans le récit — installe une distance et pose la question de la **fiabilité du témoin**.

## Le temps du récit
| Procédé | Ce qu’il fait |
| Le **sommaire** | Vingt ans en trois lignes |
| La **scène** | Le temps du récit **épouse** celui de l’histoire |
| L’**ellipse** | On saute |
| La **pause** | La description arrête l’action |
| L’**analepse** | Retour en arrière |
| La **prolepse** | Annonce de l’avenir |

> Comparer le temps de l’**histoire** et celui du **récit**, c’est déjà interpréter : **ce qu’un roman étire, il le juge important**.

## Les grandes étapes
| Époque | Ce que devient le roman |
| **Moyen Âge** | En **vers**, chevaleresque et courtois — Chrétien de Troyes |
| **XVIIe** | Le roman d’**analyse** : *La Princesse de Clèves* |
| **XVIIIe** | **Mémoires** et **lettres fictives** donnent l’illusion du vrai — *Manon Lescaut*, *Les Liaisons dangereuses* |
| **XIXe** | Le **réalisme** (Balzac, Stendhal, Flaubert) puis le **naturalisme** (Zola) : une science de la société |
| **XXe-XXIe** | Le récit se **fragmente**, le personnage se défait (Proust, Céline, Nouveau Roman) ; le **récit intime** revient (Colette, Duras, Ernaux) |

## Le personnage
Héros, **antihéros**, personnage **en marge** : le roman a très tôt cherché ses figures **hors des normes** — criminels, courtisanes, déclassés.

> Pourquoi ? Parce qu’elles **rendent visible ce que la société veut ignorer**.

| On lit un personnage par… | Exemple |
| Ses **actes** | Ce qu’il fait, pas ce qu’il dit faire |
| Ses **paroles** | Registre, adresse, silences |
| Son **portrait** et son **nom** | Le choix n’est jamais neutre |
| La manière dont le **narrateur** en parle | C’est là que se cache le jugement |

> Une dissertation sur le roman **ne juge jamais un personnage moralement** : elle demande **ce que le récit fait de lui**.`,
          },
          questions: [
            ['Qu’est-ce qu’une focalisation interne ?', ['Le récit fait voir par les yeux d’un personnage', 'Le narrateur sait tout de tous les personnages', 'Le narrateur filme de l’extérieur sans entrer dans les consciences', 'Le récit est raconté après coup'], 0, 'La focalisation zéro donne un savoir total, la focalisation externe reste au-dehors.'],
            ['Qu’est-ce qu’un récit enchâssé ?', ['Un récit rapporté à l’intérieur d’un autre récit', 'Un récit raconté à l’envers', 'Un récit sans narrateur', 'Un récit interrompu par des descriptions'], 0, 'Le dispositif installe une distance et pose la question de la fiabilité du témoin.'],
            ['Que désigne une ellipse narrative ?', ['Un moment de l’histoire passé sous silence', 'Un retour en arrière', 'Une description qui suspend l’action', 'Une annonce de la suite'], 0, 'L’analepse revient en arrière, la pause décrit, la prolepse annonce.'],
            ['Quel roman du XVIIe siècle est considéré comme le premier roman d’analyse ?', ['La Princesse de Clèves', 'Manon Lescaut', 'Gargantua', 'Le Roman de Renart'], 0, 'Madame de Lafayette y peint les mouvements intérieurs plus que l’action.'],
            ['Quel mouvement littéraire Zola incarne-t-il ?', ['Le naturalisme', 'Le romantisme', 'Le symbolisme', 'Le classicisme'], 0, 'Il prolonge le réalisme en y ajoutant l’ambition d’une méthode scientifique.'],
            ['Qu’est-ce qu’un personnage « en marge » ?', ['Un personnage situé hors des normes sociales', 'Un personnage secondaire', 'Un personnage absent du dénouement', 'Un narrateur non identifié'], 0, 'Criminels, courtisanes, déclassés : ils rendent visible ce que la société veut ignorer.'],
            ['Un récit rétrospectif est raconté au moment où l’action se déroule.', ['Vrai', 'Faux'], 1, 'Il est raconté après coup, ce qui permet au narrateur de commenter et de sélectionner.'],
            ['Comment appelle-t-on le passage où le temps du récit épouse celui de l’histoire ?', ['La scène', 'Le sommaire', 'La pause', 'L’ellipse'], 0, 'Le sommaire, à l’inverse, résume une longue durée en quelques lignes.'],
          ],
        },
        {
          titre: 'Manon Lescaut',
          axe: 'Le roman et le récit du Moyen Âge au XXIe siècle',
          lecon: {
            titre: 'Prévost, 1731 — la passion racontée par celui qui l’a subie',
            cours: `Parcours associé : **personnages en marge, plaisirs du romanesque**. Le titre complet dit déjà le dispositif : *Histoire du chevalier Des Grieux et de Manon Lescaut*, publiée en **1731** par l’**abbé Prévost**.

## Un récit dans un récit
| Étape | Ce qui se passe |
| Le narrateur premier, le **marquis de Renoncour** | Il croise à Pacy un convoi de filles qu’on **déporte en Amérique** — parmi elles, Manon |
| Deux ans plus tard, à Calais | Il retrouve **Des Grieux** et recueille son récit |

> Tout le roman est donc **la parole de Des Grieux**, à la première personne, **après coup**. Nous ne voyons Manon que **par les yeux de l’homme qui l’aime et qui se justifie**. C’est le point à ne jamais oublier.

## L’intrigue, par étapes
| Lieu | Ce qui arrive |
| **Amiens** | Des Grieux, **dix-sept ans**, promis à l’ordre de Malte, rencontre Manon qu’on envoie au couvent. Coup de foudre, fuite |
| **Paris** | La misère arrive vite ; Manon accepte la protection de **M. de B…** ; Des Grieux, trahi, entre à **Saint-Sulpice** |
| Le **retour** | Manon vient l’arracher à sa vocation **le jour de sa thèse**. Vie de jeu avec **Lescaut**, le frère |
| La **chute** | Escroquerie de **G… M…**, arrestation : **Saint-Lazare** pour lui, l’**Hôpital** pour elle ; évasion, mort de Lescaut |
| La **Louisiane** | Manon déportée, Des Grieux la suit ; la paix enfin, puis le duel avec Synnelet, la fuite au désert, la **mort de Manon** |

Des Grieux l’enterre **de ses mains**.

## Les personnages
| Personnage | Ce qu’il est |
| **Des Grieux** | Noble, brillant, sincère — **et** menteur, tricheur, voleur, presque assassin. Il raconte sa déchéance en la présentant comme une **fatalité** |
| **Manon** | **Jamais analysée de l’intérieur** : insaisissable, tendre et infidèle, incapable de supporter la pauvreté |
| **Tiberge** | L’ami fidèle, la voix de la morale — **toujours écouté, jamais suivi** |

## Le romanesque
Coups de théâtre, évasions, duels, déguisements, larmes, exil, mort au désert.

> C’est le « plaisir du romanesque » du parcours : le récit tient par une **accélération constante** — qui ne laisse **jamais le temps de juger**.`,
          },
          questions: [
            ['Qui raconte l’histoire de Des Grieux et Manon ?', ['Des Grieux lui-même, à un narrateur qui rapporte son récit', 'Manon, dans son journal', 'Un narrateur omniscient', 'Tiberge, après leur mort'], 0, 'Le marquis de Renoncour recueille le récit : nous ne voyons Manon que par les yeux de Des Grieux.'],
            ['En quelle année le roman paraît-il ?', ['1731', '1782', '1678', '1830'], 0, 'Il forme le septième tome des Mémoires et aventures d’un homme de qualité.'],
            ['Où Des Grieux et Manon se rencontrent-ils ?', ['À Amiens', 'À Paris', 'À Calais', 'Au Havre'], 0, 'Elle allait au couvent, il était promis à l’ordre de Malte.'],
            ['Où Manon meurt-elle ?', ['Dans le désert de Louisiane', 'À l’Hôpital de Paris', 'Sur le bateau de la déportation', 'À Saint-Lazare'], 0, 'Des Grieux l’enterre de ses mains : c’est la dernière scène du roman.'],
            ['Quel personnage incarne la voix de la morale et de l’amitié fidèle ?', ['Tiberge', 'Lescaut', 'M. de B…', 'Synnelet'], 0, 'Il est toujours écouté et jamais suivi.'],
            ['Quel est le parcours associé à l’œuvre ?', ['Personnages en marge, plaisirs du romanesque', 'Les romans de l’énergie', 'La célébration du monde', 'Individu, morale et société'], 0, 'Les deux héros vivent hors des normes, et le récit tire son plaisir de cette marge.'],
            ['Le roman donne accès aux pensées intimes de Manon.', ['Vrai', 'Faux'], 1, 'Elle n’est jamais analysée de l’intérieur : son opacité est un choix de construction.'],
            ['Que se passe-t-il le jour de la thèse de Des Grieux en Sorbonne ?', ['Manon reparaît et l’arrache à sa vocation religieuse', 'Il est arrêté par la police', 'Il apprend la mort de son père', 'Il rencontre Tiberge pour la première fois'], 0, 'C’est la scène de la rechute, au moment même où il croyait guéri.'],
          ],
        },
        {
          titre: 'La peau de chagrin',
          axe: 'Le roman et le récit du Moyen Âge au XXIe siècle',
          lecon: {
            titre: 'Balzac, 1831 — le talisman qui rétrécit à chaque désir',
            cours: `Parcours associé : **les romans de l’énergie : création et destruction**. Publié en **1831**, *La Peau de chagrin* ouvre les **Études philosophiques** de *La Comédie humaine*.

## Trois parties, un mécanisme
| Partie | Ce qui s’y passe |
| **Le Talisman** | **Raphaël de Valentin**, ruiné, perd son dernier napoléon au jeu et va se noyer. Il entre chez un **antiquaire** qui lui montre une **peau d’onagre** |
| **La Femme sans cœur** | Récit **rétrospectif** : l’étudiant pauvre, le travail acharné, l’amour pour **Fœdora**, la ruine |
| **L’Agonie** | Devenu riche, Raphaël voit la peau rétrécir. Il tente de **ne plus rien vouloir**. **Pauline** réapparaît : en la désirant, il meurt |

## Le pacte
La peau **exauce tous les souhaits** — mais elle **rétrécit à chaque vœu**, et la vie de son possesseur avec elle.

> Raphaël la saisit et souhaite aussitôt un banquet, qu’il trouve en sortant, offert par ses amis. Le piège est refermé **dans la même page**.

## Les personnages
| Personnage | Ce qu’il représente |
| **Raphaël de Valentin** | L’intelligence et l’ambition, **brûlées par l’envie de vivre** |
| **Fœdora** | « La femme sans cœur » : la société parisienne, **séduisante et vide** |
| **Pauline** | L’amour désintéressé — **longtemps ignoré parce que pauvre** |
| L’**antiquaire** | Le vieillard qui a survécu **en ne désirant rien** : le contre-modèle exact |
| **Rastignac** | L’ami cynique, qui enseigne l’art de réussir |

## Le pacte fantastique
| L’élément impossible | Le monde qui l’entoure |
| Le **talisman**, emprunté au conte | Un Paris **minutieusement décrit** : la maison de jeu du Palais-Royal, le magasin d’antiquités, l’orgie chez Taillefer, les salles de rédaction |

> C’est le **réalisme fantastique** : un objet impossible dans un monde **parfaitement documenté** — ce qui rend la fable **d’autant plus dure**.

## L’inscription de la peau
« Si tu me possèdes, tu posséderas tout, mais ta vie m’appartiendra. »

> **Vouloir, c’est vivre ; vivre, c’est se consumer.** Toute la loi du roman tient dans cette phrase gravée.`,
          },
          questions: [
            ['Que fait la peau de chagrin à chaque souhait exaucé ?', ['Elle rétrécit, et la vie de son possesseur avec elle', 'Elle change de couleur', 'Elle devient plus grande', 'Elle disparaît une journée'], 0, 'Vouloir, c’est vivre ; vivre, c’est se consumer : c’est la loi du roman.'],
            ['Comment s’appelle le héros du roman ?', ['Raphaël de Valentin', 'Eugène de Rastignac', 'Lucien de Rubempré', 'Félix de Vandenesse'], 0, 'Rastignac est présent, mais comme ami cynique et conseiller.'],
            ['Quelles sont les trois parties du roman ?', ['Le Talisman, La Femme sans cœur, L’Agonie', 'L’Enfance, La Gloire, La Chute', 'Paris, Province, Exil', 'Le Jeu, L’Amour, La Mort'], 0, 'La deuxième est un long récit rétrospectif fait par Raphaël.'],
            ['Qui est Fœdora ?', ['La comtesse incapable d’aimer, dite « la femme sans cœur »', 'La mère de Raphaël', 'Une servante amoureuse de Raphaël', 'La femme de l’antiquaire'], 0, 'Elle incarne la société parisienne : séduisante et vide.'],
            ['Que fait Raphaël au début du roman, avant d’entrer chez l’antiquaire ?', ['Il perd son dernier argent au jeu et veut se suicider', 'Il vient d’hériter d’une fortune', 'Il soutient sa thèse', 'Il se bat en duel'], 0, 'Il entre chez l’antiquaire pour attendre la nuit et se jeter dans la Seine.'],
            ['Qui aime Raphaël d’un amour désintéressé ?', ['Pauline', 'Fœdora', 'Aquilina', 'Euphrasie'], 0, 'Longtemps ignorée parce que pauvre, elle réapparaît à la fin — et c’est en la désirant qu’il meurt.'],
            ['L’antiquaire a survécu longtemps grâce à sa richesse.', ['Vrai', 'Faux'], 1, 'Il a survécu en ne désirant rien : il est le contre-modèle exact de Raphaël.'],
            ['À quel ensemble de La Comédie humaine le roman appartient-il ?', ['Les Études philosophiques', 'Les Scènes de la vie parisienne', 'Les Scènes de la vie de province', 'Les Études analytiques'], 0, 'Le roman y expose une idée : la pensée et le désir usent la vie.'],
          ],
        },
        {
          titre: 'La peau de chagrin - Partie 2',
          axe: 'Le roman et le récit du Moyen Âge au XXIe siècle',
          lecon: {
            titre: 'Balzac — l’énergie qui crée est celle qui détruit',
            cours: `Cette seconde partie prend le roman par son **parcours** : *les romans de l’énergie*. Le mot « énergie » n’est pas une image chez Balzac : c’est une **loi physique appliquée à l’homme**.

## La thèse du roman
Balzac la formule par la bouche de l’antiquaire.

| Verbe | Son effet sur la vie |
| **VOULOIR** | Il **brûle** |
| **POUVOIR** | Il **détruit** |
| **SAVOIR** | Il **conserve** |

> « Vouloir nous brûle et Pouvoir nous détruit ; mais SAVOIR laisse notre faible organisation dans un perpétuel état de calme. »

Raphaël l’apprend **trop tard** : jeunesse passée à travailler dans une mansarde (**savoir**), puis tout misé sur le désir (**vouloir**) — il meurt de n’avoir pas pu **s’empêcher de désirer**.

## Une même énergie, deux effets
| La même force pousse Raphaël… | Vers |
| À écrire une *Théorie de la volonté* dans le dénuement | La **création** |
| À l’orgie, au jeu, à la passion pour Fœdora | La **destruction** |

> Le roman **ne condamne pas l’énergie** : il montre qu’elle **ne se divise pas**. Le génie et la ruine ont la **même source**.

C’est vrai des personnages — et de la société de **1830** : spéculation, arrivisme, journalisme, révolution industrielle. **Une époque qui se brûle à sa propre vitesse.**

## Le fantastique au service du réel
La peau **rend visible un processus invisible** : l’usure de la vie par le désir.

| Tentative | Son issue |
| Mesurer la peau au crayon | Elle rétrécit quand même |
| Le physicien, le chimiste, le mécanicien | **Tous échouent** à l’étirer |

> Balzac fait de la **science moderne** un personnage **impuissant**.

## Le style
Descriptions **saturées** — l’inventaire du magasin d’antiquités passe en revue **tous les âges du monde** —, **hyperboles**, énumérations vertigineuses, discours philosophiques insérés dans l’action.

> Le roman avance par **contrastes** : l’orgie et la mansarde, Fœdora et Pauline, Paris et l’Auvergne.

## Les axes de dissertation
| Question | Ce que le roman répond |
| Le désir est-il une force de **vie** ou de **mort** ? | Il **refuse de choisir** : il est les deux |
| La science peut-elle contre le destin ? | L’échec des savants dit **non** |
| Le personnage balzacien est-il **libre** ? | Raphaël **choisit** la peau, puis ne peut **plus rien** choisir |
| Que devient l’artiste dans une société de l’argent ? | La *Théorie de la volonté* n’intéresse personne ; le **banquet**, si |`,
          },
          questions: [
            ['Quels deux verbes usent la vie selon l’antiquaire ?', ['Vouloir et Pouvoir', 'Aimer et Haïr', 'Savoir et Comprendre', 'Créer et Détruire'], 0, 'Seul SAVOIR laisse l’homme en repos, dit-il : c’est la thèse du roman.'],
            ['Que montre le roman à propos de l’énergie créatrice ?', ['Elle est la même force que celle qui détruit', 'Elle est réservée aux artistes', 'Elle protège du malheur', 'Elle s’oppose au désir'], 0, 'Le génie et la ruine ont la même source : le roman ne les sépare pas.'],
            ['Que tente Raphaël pour ne plus faire rétrécir la peau ?', ['Ne plus rien désirer : régime, silence, retraite à la campagne', 'Vendre la peau', 'La brûler', 'La confier à l’antiquaire'], 0, 'Le désir revient malgré lui, et c’est en désirant Pauline qu’il meurt.'],
            ['Que font les savants consultés par Raphaël ?', ['Ils échouent tous à étirer ou à altérer la peau', 'Ils la font grandir', 'Ils refusent de l’examiner', 'Ils prouvent qu’elle est ordinaire'], 0, 'La science moderne est ici un personnage impuissant devant la loi du désir.'],
            ['Quel ouvrage Raphaël écrit-il dans sa mansarde ?', ['Une Théorie de la volonté', 'Un traité d’économie', 'Un roman autobiographique', 'Une histoire de France'], 0, 'Elle n’intéresse personne : le roman oppose l’œuvre de l’esprit et la société de l’argent.'],
            ['Quelle époque le roman peint-il en arrière-plan ?', ['La France des années 1830, spéculation et arrivisme', 'La Révolution de 1789', 'Le règne de Louis XIV', 'Le Second Empire'], 0, 'Une société qui se brûle à sa propre vitesse, comme Raphaël.'],
            ['Le roman condamne clairement le désir comme une faute morale.', ['Vrai', 'Faux'], 1, 'Il montre le désir comme une force ambivalente : sans lui, pas de création ; avec lui, la destruction.'],
            ['Quel objet du roman rend visible l’usure de la vie ?', ['La peau de chagrin, mesurée au crayon', 'Le miroir de Fœdora', 'La table de jeu', 'Le manuscrit de Raphaël'], 0, 'Chaque mesure est une confrontation avec le temps qu’il reste.'],
          ],
        },
        {
          titre: 'Sido, suivi de Les Vrilles de la vigne',
          axe: 'Le roman et le récit du Moyen Âge au XXIe siècle',
          lecon: {
            titre: 'Colette — deux livres réunis, une même attention au monde',
            cours: `Parcours associé : **la célébration du monde**. Le volume réunit **deux textes que quinze ans séparent** : *Les Vrilles de la vigne* (**1908**) et *Sido* (**1930**).

## Sido : trois parties, trois figures
| Partie | Qui elle porte | Ce qu’on retient |
| **Sido** | La mère, **Sidonie Landoy** | Elle guette les orages, **sauve les chenilles**, connaît chaque plante, **refuse de quitter son jardin** même pour voir sa fille |
| **Le Capitaine** | Le père, ancien militaire amputé | **Poète sans œuvre** : à sa mort, on découvre que ses volumes reliés sont **blancs**, sauf la dédicace à sa femme |
| **Les Sauvages** | Les frères et la sœur | Silencieux, indépendants, **à peine domestiqués** par la vie de famille |

> Ce n’est **ni un roman ni une autobiographie suivie** : c’est un **récit de mémoire**.

## Les Vrilles de la vigne : vingt textes brefs
Écrits pour la presse, **sans intrigue commune**.

| Type de texte | Exemples |
| Le texte **liminaire** | Le **rossignol** pris dans les vrilles, qui **chante pour ne plus se laisser attacher** |
| Les **dialogues d’animaux** | La chienne **Toby-Chien**, la chatte **Kiki-la-Doucette** |
| Les **souvenirs d’enfance** | « Nuit blanche », « Jour gris », « Le Dernier Feu » |
| Les **chroniques** | Les femmes, la scène, le maquillage |

La forme est **libre** : conte, chronique, poème en prose, dialogue.

## La figure de Sido
Elle est le personnage central des **deux** livres — et une **manière de voir** plus qu’une personne.

| Ce qu’elle est | Ce qu’elle transmet |
| Attentive aux **signes du temps** | L’art de **regarder** |
| Indifférente aux convenances, à la religion, à l’argent | Une liberté |
| Vouée au **culte du vivant** | Le respect de ce qui pousse et de ce qui rampe |

> C’est elle qui apprend à sa fille à **regarder** — et **ce regard deviendra un style**.

## Une écriture des sens
Colette écrit par **sensations** : odeurs (la pluie sur la poussière, le chocolat, les feuilles chaudes), couleurs, textures, bruits.

> Les **notations concrètes** l’emportent toujours sur l’abstraction ; les phrases sont amples, rythmées par des **énumérations** — et l’**animal y a le même statut que l’humain**.

## Situer l’œuvre
Colette (**1873-1954**), **première femme à recevoir des funérailles nationales** en France, écrit *Sido* à **cinquante-sept ans**, longtemps après la mort de sa mère.

> Le livre est un **acte de mémoire**, écrit **du côté de la perte** — ce qui explique sa lumière : **on ne célèbre bien que ce qu’on n’a plus**.`,
          },
          questions: [
            ['De quelles années datent les deux textes réunis dans le volume ?', ['1908 pour Les Vrilles de la vigne, 1930 pour Sido', '1930 pour les deux', '1900 et 1910', '1920 et 1940'], 0, 'Quinze ans les séparent : ce sont deux moments d’écriture très différents.'],
            ['Quelles sont les trois parties de Sido ?', ['Sido, Le Capitaine, Les Sauvages', 'La Mère, Le Jardin, Le Village', 'L’Enfance, Paris, Le Retour', 'Le Printemps, L’Été, L’Hiver'], 0, 'La mère, le père, puis la fratrie : trois portraits, pas un récit continu.'],
            ['Que découvre-t-on à la mort du Capitaine ?', ['Ses volumes reliés sont vierges, sauf la dédicace à sa femme', 'Il avait écrit un roman célèbre', 'Il cachait une seconde famille', 'Il avait vendu la maison'], 0, 'Le père poète n’a rien écrit : l’œuvre manquante hante le livre.'],
            ['Qui sont Toby-Chien et Kiki-la-Doucette ?', ['Les animaux de Colette, personnages dialoguant dans Les Vrilles de la vigne', 'Deux amis d’enfance', 'Les frères de Colette', 'Des personnages de théâtre'], 0, 'L’animal y a le même statut de personnage que l’humain.'],
            ['Quel est le parcours associé à l’œuvre ?', ['La célébration du monde', 'Personnages en marge, plaisirs du romanesque', 'Les romans de l’énergie', 'Crise personnelle, crise familiale'], 0, 'Célébrer, chez Colette, c’est nommer précisément ce que l’on regarde.'],
            ['Quel est le prénom réel de Sido ?', ['Sidonie', 'Gabrielle', 'Adèle', 'Juliette'], 0, 'Sidonie Landoy, mère de Sidonie-Gabrielle Colette.'],
            ['Sido est une autobiographie chronologique et complète.', ['Vrai', 'Faux'], 1, 'C’est un récit de mémoire en trois portraits, sans continuité narrative.'],
            ['Quelle image donne son titre au recueil de 1908 ?', ['Un rossignol pris dans les vrilles de la vigne, qui chante pour ne plus s’endormir', 'Une vigne brûlée par le gel', 'Un raisin cueilli trop tôt', 'Un jardin abandonné'], 0, 'Le chant naît d’une contrainte : c’est un art poétique en miniature.'],
          ],
        },
        {
          titre: 'Sido, suivi de Les Vrilles de la vigne - Partie 2',
          axe: 'Le roman et le récit du Moyen Âge au XXIe siècle',
          lecon: {
            titre: 'Colette — comment on célèbre sans embellir',
            cours: `Cette seconde partie travaille le **parcours** : la **célébration du monde**. Le mot est piégé — célébrer n’est **ni décrire, ni idéaliser**.

## Célébrer, c’est nommer
| Ce que Colette **n’écrit pas** | Ce qu’elle écrit |
| « Une fleur » | Un **souci**, une **pivoine**, un pied d’**angélique** |
| « Le printemps » | L’odeur **exacte** de la première pluie sur la poussière chaude |

> L’émerveillement naît de l’**exactitude**, pas de l’effusion. C’est un **lyrisme sans grandiloquence**, ancré dans le concret.

## Ce que la célébration ne cache pas
| Ce qui est célébré | Ce qui est perdu |
| Le jardin, la maison, les saisons | La **mère morte**, l’enfance enfuie, la maison **vendue** |
| Le père | **Sans œuvre** |
| Les frères | Devenus **silencieux** |

Dans *Les Vrilles de la vigne*, plusieurs textes disent l’**insomnie**, la tristesse, la séparation.

> La lumière du livre tient à cette **tension** : on écrit **du côté de la perte**, et **c’est pour cela qu’on regarde si bien**.

## La place de l’animal et du végétal
Le chat, la chienne, l’araignée, le chèvrefeuille, la vigne : le vivant non humain n’est **pas un décor** mais une **société**.

> Sido **sauve une chenille**, refuse de tuer, parle à ses plantes ; Colette **prête la parole à ses bêtes**. Le geste est **écologique avant la lettre** : il n’y a pas d’un côté l’humain, de l’autre la nature.

## Une femme qui écrit
| Étape | Ce qu’elle marque |
| Elle publie d’abord sous le nom de son mari, **Willy** | L’effacement |
| Elle monte sur scène au **music-hall** pour vivre | Le scandale et l’autonomie |
| Elle **divorce** et publie sous son seul nom | *Les Vrilles de la vigne* est le **premier livre signé « Colette » seule** |

> Le **rossignol** du texte liminaire, qui chante **pour ne plus être ligoté**, est une **figure d’émancipation** — et elle est autobiographique.

## Les axes de dissertation
| Question | La réponse de l’œuvre |
| Célébrer le monde, est-ce l’**embellir** ? | **Non** : la précision remplace l’idéalisation |
| L’écriture du souvenir est-elle **fidèle** ? | Colette **compose, sélectionne, invente** : le vrai y est de l’ordre de la **sensation**, pas du document |
| Le regard de l’**enfant** ou de l’**adulte** ? | **Les deux se superposent** — et c’est cette double focale qui donne l’émotion |
| En quoi est-ce un **art poétique** ? | Le style **naît d’une manière de regarder héritée de la mère** |`,
          },
          questions: [
            ['Par quel moyen la célébration s’exprime-t-elle chez Colette ?', ['Par la précision des noms et des sensations', 'Par l’exagération lyrique', 'Par la description abstraite', 'Par le refus de décrire'], 0, 'L’émerveillement naît de l’exactitude, jamais de l’effusion.'],
            ['La célébration du monde exclut-elle la perte ?', ['Non, elle s’écrit justement depuis la perte', 'Oui, tout est joyeux', 'Oui, la mort est absente du livre', 'Non, mais la perte reste implicite'], 0, 'Mère morte, enfance enfuie, maison vendue : la lumière du livre naît de cette tension.'],
            ['Sous quel nom Colette a-t-elle d’abord publié ?', ['Willy, le nom de son mari', 'Sido', 'Gabrielle Landoy', 'Colette Willy dès le premier livre'], 0, 'Les Vrilles de la vigne marque une étape décisive vers la signature de son seul nom.'],
            ['Quel statut le vivant non humain occupe-t-il dans l’œuvre ?', ['Celui d’une société à part entière, non d’un décor', 'Un simple arrière-plan', 'Un symbole religieux', 'Une métaphore du désir'], 0, 'Sido sauve une chenille et refuse de tuer ; Colette prête la parole à ses bêtes.'],
            ['Que symbolise le rossignol pris dans les vrilles de la vigne ?', ['L’émancipation par le chant et l’écriture', 'La fragilité de la nature', 'L’amour malheureux', 'Le retour des saisons'], 0, 'Il chante pour ne plus se laisser ligoter : c’est un art poétique en miniature.'],
            ['Quelle double focale traverse Sido ?', ['Le regard de l’enfant et celui de l’adulte qui se souvient', 'Celui du père et celui de la mère', 'Celui de la ville et celui de la campagne', 'Celui du narrateur et celui du lecteur'], 0, 'Leur superposition constante est la source de l’émotion.'],
            ['L’écriture du souvenir chez Colette est un document fidèle et vérifiable.', ['Vrai', 'Faux'], 1, 'Elle compose, sélectionne et invente : la vérité y est de l’ordre de la sensation.'],
            ['En quoi Sido est-elle plus qu’un personnage ?', ['Elle est une manière de regarder, dont naît le style de Colette', 'Elle est la narratrice du récit', 'Elle est une figure allégorique de la France rurale', 'Elle est l’autrice fictive du livre'], 0, 'C’est elle qui apprend à sa fille à voir : le style hérite du regard.'],
          ],
        },
        // ===================================================================
        // Chapitre 4 — Le théâtre du XVIIe au XXIe siècle
        // ===================================================================
        {
          titre: 'Le théâtre du XVIIe au XXIe siècle',
          axe: 'Le théâtre du XVIIe au XXIe siècle',
          lecon: {
            titre: 'L’objet d’étude : un texte fait pour être joué',
            cours: `Une pièce n’est **pas un roman en dialogues** : c’est une **partition**. L’objet d’étude demande de lire le texte **en imaginant la scène** — voix, corps, espace, silences.

## Le texte et ce qui l’entoure
| Forme de parole | Ce qu’elle signale |
| La **tirade** | Une longue prise de parole : domination, plaidoyer |
| Le **monologue** | Seul en scène : il **dit ce qu’on cache** |
| La **stichomythie** | Répliques très brèves qui s’enchaînent : **tension** |
| L’**aparté** | Dit **au public**, pas à l’interlocuteur |

| Élément | Son statut |
| Les **didascalies** | Indications de lieu, ton, gestes — **le cœur du texte** chez Sarraute, **presque absentes** chez Corneille |
| La **double énonciation** | Ce qu’un personnage dit à un autre est **en même temps dit au public** |

> C’est la double énonciation qui rend possible l’**ironie dramatique** : le spectateur **en sait plus** que le personnage.

## Les genres
| Genre | Ses règles ou son geste |
| La **tragédie** classique | Personnages de haut rang, **fatalité**, mort ; les **trois unités** — action, lieu, temps — et la **bienséance** |
| La **comédie** | Corriger les mœurs en faisant rire : comique de **mots, gestes, situation, caractère, répétition** |
| Le **drame romantique** — Hugo, Musset | Il **refuse les règles**, mêle registres et tons |
| Le théâtre du **XXe** | Plus d’**intrigue** chez Beckett, plus de **personnage** chez Sarraute : **la parole devient l’action** |

## La structure
Exposition, nœud, péripéties, **coup de théâtre**, dénouement.

| Ressort | Ce qu’il fait |
| Le **quiproquo** | Un malentendu qui relance l’action |
| La **scène d’aveu** | Elle fait basculer l’intrigue |
| Le **dénouement** | Il se juge à ce qu’il laisse **ouvert ou refermé** |

## Les registres
**Comique**, **tragique**, **pathétique**, **lyrique**, **ironique**, **polémique**.

> Une même pièce en mêle presque toujours plusieurs : l’analyse consiste à repérer les **basculements** — le **moment exact** où le rire devient grinçant.

## La mise en scène compte
Décor, costumes, rythme, jeu des corps : une pièce **n’existe pleinement que jouée**.

> À l’oral comme à l’écrit, mentionner un **choix de mise en scène possible** — un ton, un silence, un déplacement — est toujours valorisé, **à condition de le justifier par le texte**.

> Question à se poser sur toute scène : **qui a le pouvoir de la parole, et qui le perd ?**`,
          },
          questions: [
            ['Qu’est-ce que la double énonciation au théâtre ?', ['Une réplique s’adresse à la fois au personnage et au public', 'Un personnage parle deux fois de suite', 'Deux personnages disent la même chose', 'Le narrateur commente le dialogue'], 0, 'Elle rend possible l’ironie dramatique, quand le spectateur en sait plus que le personnage.'],
            ['Qu’est-ce qu’une stichomythie ?', ['Un échange de répliques très brèves', 'Une longue prise de parole', 'Une parole dite au public seul', 'Une indication scénique'], 0, 'Elle marque presque toujours une montée de tension.'],
            ['Que sont les didascalies ?', ['Les indications scéniques données par l’auteur', 'Les répliques du chœur', 'Les monologues du héros', 'Les titres des actes'], 0, 'Chez Nathalie Sarraute, elles deviennent presque le cœur du texte.'],
            ['Quelles sont les trois unités du théâtre classique ?', ['Action, lieu, temps', 'Action, personnage, décor', 'Temps, décor, langue', 'Lieu, registre, genre'], 0, 'Le drame romantique s’en libère explicitement.'],
            ['Qu’est-ce qu’un aparté ?', ['Une parole dite au public, censée ne pas être entendue des autres personnages', 'Une réplique en vers', 'Un monologue de fin d’acte', 'Une réplique coupée par une autre'], 0, 'C’est un ressort comique très employé, notamment par les valets.'],
            ['Sur quoi repose un quiproquo ?', ['Sur un malentendu entre les personnages', 'Sur un mensonge assumé', 'Sur une révélation finale', 'Sur une coïncidence de dates'], 0, 'Le spectateur, lui, comprend tout : c’est ce décalage qui fait rire.'],
            ['Une pièce de théâtre ne peut mêler qu’un seul registre.', ['Vrai', 'Faux'], 1, 'Les basculements de registre — du rire au grinçant — sont souvent le cœur de l’analyse.'],
            ['Quel dramaturge du XXe siècle fait de la parole elle-même l’action de la pièce ?', ['Nathalie Sarraute', 'Pierre Corneille', 'Alfred de Musset', 'Victor Hugo'], 0, 'Dans Pour un oui ou pour un non, il ne se passe rien d’autre que du langage.'],
          ],
        },
        {
          titre: 'Le Menteur',
          axe: 'Le théâtre du XVIIe au XXIe siècle',
          lecon: {
            titre: 'Corneille, 1644 — mentir pour exister',
            cours: `Parcours associé : **mensonge et comédie**. Comédie en **cinq actes et en vers**, créée en **1644**, adaptée d’une pièce espagnole de Juan Ruiz de Alarcón, *La Verdad sospechosa*.

> **Corneille**, l’auteur du *Cid*, y prouve qu’il sait aussi faire **rire**.

## L’intrigue
| Étape | Ce que Dorante invente |
| L’arrivée | Il vient de **Poitiers**, abandonne le droit pour se faire homme du monde |
| Aux **Tuileries** | Il se présente comme un **héros de guerre** revenu d’Allemagne après quatre ans |
| Puis | Une **fête somptueuse** offerte sur la Seine |
| Face au mariage préparé par son père **Géronte** | Il se dit **déjà marié** à Poitiers : séduction, nuit surprise, grossesse |

> Le mensonge **appelle le mensonge**. Son valet **Cliton**, stupéfait, tente de suivre.

## L’erreur qui gouverne tout
Dorante croit que celle qu’il aime, **Clarice**, s’appelle **Lucrèce**.

> Ce **quiproquo de noms** gouverne toute la pièce — et manque de le faire **tuer en duel** par **Alcippe**, l’amoureux de Clarice.

## Le dénouement
Démasqué par son père, humilié, Dorante **retombe sur ses pieds** : puisqu’il aime en réalité la femme qui s’appelle **bien Lucrèce**, il l’épouse.

> La comédie s’achève sur un mariage — mais sur un menteur **ni puni, ni corrigé**. C’est le point le plus discuté de la pièce.

## Les personnages
| Personnage | Son rôle |
| **Dorante** | Jeune, brillant, **jamais pris de court** : ses mensonges sont des **improvisations d’artiste** |
| **Cliton** | Le valet lucide : il commente et sert de **relais au spectateur** |
| **Géronte** | Le père noble, dont l’**honneur est blessé** — la seule gravité de la pièce |
| **Clarice** et **Lucrèce** | Les deux jeunes femmes que le quiproquo **échange** |

## Le comique
| Type | Où il opère |
| De **situation** | Le quiproquo des noms |
| De **caractère** | Le menteur **pris à son propre piège** |
| De **mots** | Les tirades d’invention, **virtuoses et hyperboliques** |
| De **répétition** | Chaque mensonge en **exige un nouveau** |

> Le rythme vient de cette **fuite en avant** : Dorante ne ment **jamais deux fois de la même manière** — le spectateur **admire autant qu’il rit**.`,
          },
          questions: [
            ['De quelle ville Dorante arrive-t-il au début de la pièce ?', ['Poitiers', 'Lyon', 'Rouen', 'Bordeaux'], 0, 'Il vient d’abandonner le droit pour se faire homme du monde à Paris.'],
            ['Quel mensonge Dorante invente-t-il en rencontrant Clarice ?', ['Qu’il revient couvert de gloire de quatre ans de guerre en Allemagne', 'Qu’il est le fils d’un roi', 'Qu’il est très riche par héritage', 'Qu’il est poète célèbre'], 0, 'Le mensonge de guerre est le premier ; tous les autres en découlent.'],
            ['Sur quel quiproquo repose l’intrigue ?', ['Dorante croit que celle qu’il aime s’appelle Lucrèce alors qu’elle se nomme Clarice', 'Dorante croit son père mort', 'Cliton se fait passer pour son maître', 'Clarice se déguise en homme'], 0, 'L’erreur de nom gouverne toute la pièce et manque de le faire tuer en duel.'],
            ['Qui est Cliton ?', ['Le valet de Dorante, témoin lucide de ses mensonges', 'Le père de Clarice', 'Le rival amoureux', 'Un ami d’enfance de Lucrèce'], 0, 'Il commente les inventions de son maître et sert de relais au spectateur.'],
            ['Comment la pièce se termine-t-elle ?', ['Dorante épouse Lucrèce, sans avoir été puni', 'Dorante est banni de Paris', 'Dorante meurt en duel', 'Dorante entre dans les ordres'], 0, 'Le menteur n’est ni corrigé ni châtié : c’est ce qui rend le dénouement troublant.'],
            ['En quelle année la pièce est-elle créée ?', ['1644', '1636', '1670', '1601'], 0, 'Quelques années après Le Cid, du même Corneille.'],
            ['Le Menteur est une pièce en prose.', ['Vrai', 'Faux'], 1, 'C’est une comédie en cinq actes et en vers.'],
            ['De quelle pièce étrangère Corneille s’inspire-t-il ?', ['La Verdad sospechosa d’Alarcón', 'La Vie est un songe de Calderón', 'Hamlet de Shakespeare', 'La Mandragore de Machiavel'], 0, 'Corneille adapte librement cette comédie espagnole.'],
          ],
        },
        {
          titre: 'On ne badine pas avec l’amour',
          axe: 'Le théâtre du XVIIe au XXIe siècle',
          lecon: {
            titre: 'Musset, 1834 — un jeu qui tue',
            cours: `Parcours associé : **les jeux du cœur et de la parole**. Publié en **1834** dans *Un spectacle dans un fauteuil*, ce **proverbe** en trois actes n’était **pas destiné à la scène** : Musset l’écrit après l’échec de sa première pièce, **pour être lu**.

## L’intrigue
| Étape | Ce qui se passe |
| Le projet | **Perdican**, docteur revenu de Paris, doit épouser sa cousine **Camille**, sortie du couvent : le **baron** a tout arrangé |
| Le refus | Marquée par les confidences amères des religieuses, Camille craint l’**infidélité des hommes** et veut retourner au couvent |
| La riposte | Blessé, Perdican courtise **Rosette**, jeune paysanne et sœur de lait de Camille, et annonce qu’il l’épousera |
| Le piège | Camille **cache Rosette** pour lui faire entendre les aveux de Perdican |
| Le retournement | Les deux orgueils s’affrontent ; au moment de l’aveu, un cri : **Rosette est morte** |

## Le dénouement
« Elle est morte. Adieu, Perdican ! »

> L’amour est **reconnu au moment exact où il devient impossible**. Aucun mariage, aucune réconciliation : un **badinage a fait une victime** — et elle est **innocente**.

## Les personnages
| Personnage | Ce qu’il est |
| **Perdican** | Sincère **et** cruel : il défend l’amour humain contre le renoncement — « On est souvent trompé en amour, souvent blessé et souvent malheureux ; **mais on aime** » |
| **Camille** | Intelligente, orgueilleuse, **terrifiée par ce qu’on lui a appris** |
| **Rosette** | La seule qui **ne joue pas** — et la seule qui **meurt** |
| Le **baron**, **Blazius**, **Bridaine**, **dame Pluche** | Figures grotesques : un **chœur comique** face à la tragédie des jeunes gens |

## Le mélange des registres
| Registre | Qui le porte |
| **Comique** | Les adultes ridicules |
| **Lyrique** | Les déclarations des jeunes gens |
| **Tragique** | Le dénouement |

> Ce mélange, marque du **drame romantique**, n’est pas un ornement : il fait sentir que **le drame naît d’un jeu**, et que **personne ne l’a vu venir**.

## Le titre
« **Badiner** » signifie plaisanter, jouer avec les mots.

> Le proverbe énonce la morale **par avance** : la **parole amoureuse n’est jamais un jeu sans conséquence**.`,
          },
          questions: [
            ['Quel genre théâtral Musset revendique-t-il pour cette pièce ?', ['Le proverbe', 'La tragédie classique', 'La farce', 'Le vaudeville'], 0, 'Publié dans Un spectacle dans un fauteuil, le texte était d’abord destiné à la lecture.'],
            ['Pourquoi Camille refuse-t-elle d’épouser Perdican ?', ['Les confidences amères des religieuses lui ont fait craindre l’infidélité des hommes', 'Elle en aime un autre', 'Son père l’a promise ailleurs', 'Elle veut vivre seule à Paris'], 0, 'Son refus vient d’une peur apprise, pas d’une indifférence.'],
            ['Qui est Rosette ?', ['Une jeune paysanne, sœur de lait de Camille', 'La sœur de Perdican', 'Une religieuse du couvent', 'La fille du baron'], 0, 'Elle est la seule qui ne joue pas — et la seule qui meurt.'],
            ['Comment la pièce se termine-t-elle ?', ['Rosette meurt et Camille quitte Perdican', 'Camille et Perdican se marient', 'Perdican épouse Rosette', 'Camille retourne au couvent après le mariage'], 0, '« Elle est morte. Adieu, Perdican ! » : l’amour est reconnu quand il devient impossible.'],
            ['Quel rôle jouent le baron, Blazius et Bridaine ?', ['Un contrepoint comique et grotesque au drame des jeunes gens', 'Les responsables directs de la mort de Rosette', 'Les confidents de Camille', 'Les narrateurs de la pièce'], 0, 'Ils forment une sorte de chœur ridicule face à la tragédie.'],
            ['Que signifie le verbe « badiner » ?', ['Plaisanter, jouer avec les mots', 'Mentir', 'Séduire par intérêt', 'Renoncer'], 0, 'Le titre énonce la morale de la pièce avant même qu’elle commence.'],
            ['La pièce mêle registres comique, lyrique et tragique.', ['Vrai', 'Faux'], 0, 'C’est la marque du drame romantique, et le moteur de l’émotion finale.'],
            ['Quelle tirade célèbre Perdican prononce-t-il ?', ['Un éloge de l’amour humain, imparfait mais vrai', 'Un plaidoyer pour le couvent', 'Une déclaration à Rosette', 'Un discours contre son père'], 0, '« On est souvent trompé en amour… mais on aime » : il défend l’amour contre le renoncement.'],
          ],
        },
        {
          titre: 'Pour un oui ou pour un non',
          axe: 'Le théâtre du XVIIe au XXIe siècle',
          lecon: {
            titre: 'Sarraute, 1982 — une amitié détruite par une intonation',
            cours: `Parcours associé : **théâtre et dispute**. Écrite en **1982** par **Nathalie Sarraute**, alors âgée de **quatre-vingt-deux ans**, la pièce dure une heure et ne compte, pour l’essentiel, que **deux personnages sans nom** : **H1** et **H2**.

## Le point de départ, minuscule
H1 vient demander à H2 pourquoi il ne le voit plus. La réponse met longtemps à venir — et elle est **dérisoire**.

> Un jour, H1 lui a dit « **C’est bien… ça** », avec une certaine **suspension** dans la voix, un accent de **condescendance**. **Rien d’autre.**

Toute la pièce consiste à **faire exister ce presque-rien** : le rejouer, le mesurer, le contester.

## Les tropismes
Sarraute a donné ce nom, emprunté à la **biologie**, aux **mouvements intérieurs infimes** — attraction, recul, méfiance — qui **précèdent la parole** et que la conversation polie recouvre.

| Ce que la pièce n’a pas | Ce qu’elle a |
| Ni **intrigue**, ni **décor** | Une **pression qui monte** |
| Ni **psychologie** au sens classique | Une **lutte réelle sous la banalité des mots** |

## La mécanique de la dispute
| Étape | Ce qui se joue |
| Les deux hommes **rejouent la scène** | Ils s’accusent, se réconcilient, repartent |
| On appelle des **témoins imaginaires** | Un couple de voisins qui **juge** |
| On invoque la vie **réussie** de l’un, la vie « **ratée** » de l’autre | La vraie blessure apparaît : l’**écart social** et la **condescendance** |
| Le dénouement | « C’est ça… », « oui… » : la **rupture est consommée sans qu’aucun fait ne l’explique** |

La dispute avance par **reprises**, **répétitions**, phrases **inachevées**, points de suspension.

## L’écriture
| Trait | Son effet |
| Didascalies **rares mais décisives** | Elles portent le ton |
| **Suspension** permanente, syntaxe **orale** | Rien ne se dit d’un bloc |
| **Absence de noms propres** | Les personnages sont des **positions**, pas des individus |

> Le texte demande au comédien un travail sur le **souffle** et le **silence** : **ce sont les blancs qui portent le sens**.

> C’est un théâtre où le langage **n’accompagne pas l’action** — il **est** l’action.

## En dissertation
> La pièce **prend au sérieux ce que la vie sociale traite comme négligeable**, et démontre la **violence du langage ordinaire** : une **intonation** suffit à classer quelqu’un, à l’humilier, à briser **vingt ans d’amitié**.

> Le titre le dit : on se sépare « pour un oui ou pour un non » — c’est-à-dire **pour rien**, c’est-à-dire **pour tout**.`,
          },
          questions: [
            ['Combien de personnages principaux la pièce compte-t-elle ?', ['Deux, nommés H1 et H2', 'Trois', 'Un seul', 'Quatre'], 0, 'Des voisins interviennent brièvement, mais l’essentiel est un face-à-face.'],
            ['Quelle phrase déclenche la rupture entre les deux amis ?', ['« C’est bien… ça »', '« Tu as changé »', '« Je ne t’aime plus »', '« Tu as réussi »'], 0, 'Ce n’est pas la phrase qui blesse, c’est la suspension et le ton qui l’accompagnent.'],
            ['Qu’appelle-t-on « tropismes » chez Nathalie Sarraute ?', ['Les mouvements intérieurs infimes qui précèdent la parole', 'Les didascalies de ses pièces', 'Les répliques très courtes', 'Les personnages sans nom'], 0, 'Le terme est emprunté à la biologie : son théâtre les fait remonter à la surface.'],
            ['Quelle est la véritable blessure révélée par la dispute ?', ['La condescendance et l’écart social entre les deux hommes', 'Une rivalité amoureuse', 'Une trahison financière', 'Un mensonge ancien'], 0, 'La vie « réussie » de l’un contre la vie « ratée » de l’autre.'],
            ['Comment la pièce se termine-t-elle ?', ['Sans résolution, sur la rupture consommée', 'Par une réconciliation complète', 'Par la mort d’un des personnages', 'Par l’arrivée d’un troisième ami'], 0, '« C’est ça… », « oui… » : aucun fait n’explique la séparation.'],
            ['Quel rôle jouent les silences et les points de suspension ?', ['Ils portent le sens : le non-dit est l’essentiel du texte', 'Ils marquent seulement des respirations', 'Ils indiquent des changements de scène', 'Ils signalent des apartés'], 0, 'Le comédien y travaille le souffle autant que la parole.'],
            ['La pièce comporte une intrigue et un décor détaillés.', ['Vrai', 'Faux'], 1, 'Ni intrigue, ni décor, ni psychologie classique : seulement une pression qui monte.'],
            ['En quelle année la pièce a-t-elle été écrite ?', ['1982', '1959', '1971', '1995'], 0, 'Nathalie Sarraute avait alors quatre-vingt-deux ans.'],
          ],
        },
      ],
    },
    {
      niveaux: ['1re'],
      rayon: 'grammaire',
      positionDepart: 500,
      chapitres: [
        // ===================================================================
        // Rayon « Grammaire » — les points de langue du programme de 1re
        // (la question de grammaire vaut 2 points sur 20 à l'oral du bac)
        // ===================================================================
        {
          titre: 'Phrase simple et phrase complexe',
          axe: 'La phrase complexe',
          lecon: {
            titre: 'Compter les verbes conjugués, et rien d’autre',
            cours: `Tout le programme de grammaire part de là : savoir **découper** une phrase. La méthode tient en une opération — **compter les verbes conjugués**.

## La proposition
Une **proposition** est un ensemble organisé autour d’**un verbe conjugué**.

| Nombre de verbes conjugués | Le type de phrase | Exemple |
| **Un** | Phrase **simple** | Le jour se lève. |
| **Deux ou plus** | Phrase **complexe** | Le jour se lève, les oiseaux chantent. |

## Les quatre pièges
| Piège | Ce qu’il faut savoir |
| Les **temps composés** | « il avait chanté » = **un seul** verbe conjugué |
| L’**infinitif** et le **participe** | Non conjugués : « Il sort **acheter** du pain » reste une phrase **simple** |
| La phrase **averbale** | « Quelle horreur ! » : aucune proposition |
| Le sujet **inversé** ou **sous-entendu** | « Sors ! » est bien une proposition |

## Les trois relations possibles
Entre deux propositions, il n’existe que **trois** liens.

| Relation | Ce qui la marque | Le rang |
| La **juxtaposition** | Un signe de ponctuation : virgule, point-virgule, deux-points | **Égalité** |
| La **coordination** | Une conjonction (*mais, ou, et, donc, or, ni, car*) ou un adverbe de liaison | **Égalité** |
| La **subordination** | Un pronom relatif, une conjonction de subordination, un mot interrogatif | **Dépendance** |

## Le vocabulaire de la subordination
| Terme | Ce qu’il désigne |
| La **principale** | La proposition qui **commande** |
| La **subordonnée** | Celle qui **dépend** |
| L’**enchâssement** | Une subordonnée qui en contient elle-même une autre |
| L’**indépendante** | Aucun lien de dépendance : elle forme la phrase à elle seule |

> Méthode à l’oral : **souligner les verbes conjugués**, **encadrer les mots subordonnants**, **puis nommer**. L’analyse suit toujours cet ordre.`,
          },
          questions: [
            ['Qu’est-ce qui définit une proposition ?', ['Un ensemble organisé autour d’un verbe conjugué', 'Un groupe de mots séparé par une virgule', 'Un sujet et un complément', 'Une phrase entre deux points'], 0, 'C’est le nombre de verbes conjugués qui distingue phrase simple et phrase complexe.'],
            ['« Il sort acheter du pain » est une phrase :', ['Simple, car l’infinitif n’est pas un verbe conjugué', 'Complexe, car il y a deux verbes', 'Averbale', 'Coordonnée'], 0, 'Infinitifs et participes ne comptent jamais dans le découpage en propositions.'],
            ['Combien de verbes conjugués compte-t-on dans « il avait chanté » ?', ['Un seul', 'Deux', 'Aucun', 'Trois'], 0, 'Un temps composé est une seule forme verbale conjuguée.'],
            ['Quelles sont les trois relations possibles entre propositions ?', ['Juxtaposition, coordination, subordination', 'Addition, opposition, conclusion', 'Principale, relative, complétive', 'Sujet, verbe, complément'], 0, 'Il n’en existe pas d’autres : toute analyse commence par ce classement.'],
            ['Comment appelle-t-on la proposition dont dépend une subordonnée ?', ['La principale', 'L’indépendante', 'La coordonnée', 'La juxtaposée'], 0, 'Une subordonnée peut elle-même en contenir une autre : c’est l’enchâssement.'],
            ['Qu’est-ce qu’une proposition indépendante ?', ['Une proposition qui n’a aucun lien de dépendance', 'Une proposition sans verbe', 'Une proposition qui commande une subordonnée', 'Une proposition entre parenthèses'], 0, 'Elle peut être seule dans la phrase, ou juxtaposée, ou coordonnée à une autre.'],
            ['Une phrase sans verbe conjugué est impossible en français.', ['Vrai', 'Faux'], 1, 'Les phrases averbales existent : « Quelle horreur ! », « Silence. »'],
            ['Quelle est la première opération à faire pour analyser une phrase ?', ['Souligner les verbes conjugués', 'Chercher les adjectifs', 'Repérer la ponctuation forte', 'Identifier le sujet du premier verbe'], 0, 'On encadre ensuite les mots subordonnants, puis on nomme.'],
          ],
        },
        {
          titre: 'Juxtaposition et coordination',
          axe: 'La phrase complexe',
          lecon: {
            titre: 'Deux propositions à égalité',
            cours: `Juxtaposition et coordination ont un point commun décisif : les propositions y sont **de même rang**. Aucune ne dépend de l’autre, **chacune pourrait exister seule**.

## Les deux constructions
| | **Juxtaposition** | **Coordination** |
| Ce qui relie | Un **signe de ponctuation** | Une **conjonction** ou un **adverbe de liaison** |
| Le lien logique | **Implicite** — au lecteur de le reconstituer | **Explicite** : opposition, cause, conséquence… |
| L’effet | **Rapidité**, accumulation, brutalité | Un **raisonnement construit** |
| L’exemple | Le vent tombait, la mer se calmait, le jour finissait. | Il pleuvait, **mais** nous sommes sortis. |

Les conjonctions : *mais, ou, et, donc, or, ni, car*. Les adverbes de liaison : *puis, ensuite, cependant, pourtant, ainsi, en effet*.

> La coordination **construit** un raisonnement ; la juxtaposition le **suggère**.

## Trois pièges
| Piège | La règle |
| *car* contre *parce que* | **car coordonne** (même rang), **parce que subordonne** — la distinction la plus demandée à l’oral |
| L’**adverbe de liaison** | Il **se déplace** dans la proposition (« nous sommes, cependant, sortis ») ; pas une conjonction |
| Le mot *et* | Il relie des mots, des groupes **ou** des propositions : seule la troisième situation concerne l’analyse |

## Ce qu’on en dit à l’oral
Ne jamais s’arrêter à l’étiquette.

| Le contexte | Ce que produit la juxtaposition |
| Dans un **récit** | Elle **accélère** l’action |
| Dans une **description** | Elle **entasse** les détails |
| Dans un **discours** | Elle marque l’**émotion** qui bouscule la syntaxe |

> La **coordination adversative** — *mais*, *pourtant* — marque au contraire un **raisonnement contrôlé**.`,
          },
          questions: [
            ['Qu’est-ce qui relie deux propositions juxtaposées ?', ['Un signe de ponctuation', 'Une conjonction de coordination', 'Un pronom relatif', 'Une conjonction de subordination'], 0, 'Virgule, point-virgule ou deux-points : le lien logique reste implicite.'],
            ['Quelles sont les conjonctions de coordination ?', ['Mais, ou, et, donc, or, ni, car', 'Que, quand, comme, si', 'Qui, que, dont, où', 'Puis, ensuite, cependant'], 0, 'Les derniers sont des adverbes de liaison, qui coordonnent aussi mais peuvent se déplacer.'],
            ['Quelle différence y a-t-il entre « car » et « parce que » ?', ['« Car » coordonne, « parce que » subordonne', 'Aucune, ce sont des synonymes exacts', '« Car » subordonne, « parce que » coordonne', '« Car » introduit une conséquence'], 0, 'C’est la distinction la plus fréquemment demandée à l’oral du bac.'],
            ['Quel effet produit une longue série de propositions juxtaposées dans un récit ?', ['Une accélération de l’action', 'Un ralentissement du rythme', 'Une explication détaillée', 'Une mise à distance ironique'], 0, 'Les rapports restant implicites, le texte va plus vite que l’explication.'],
            ['Dans « Il pleuvait, mais nous sommes sortis », quel rapport est exprimé ?', ['L’opposition', 'La cause', 'La conséquence', 'Le but'], 0, '« Mais » est la conjonction adversative par excellence.'],
            ['Les propositions coordonnées sont-elles de même rang ?', ['Oui, aucune ne dépend de l’autre', 'Non, la seconde dépend de la première', 'Non, la première dépend de la seconde', 'Cela dépend de la conjonction'], 0, 'C’est ce qui les distingue de la subordination.'],
            ['Un adverbe de liaison peut se déplacer dans la proposition.', ['Vrai', 'Faux'], 0, '« Nous sommes, cependant, sortis » : une conjonction de coordination ne le permet pas.'],
            ['Que faut-il ajouter à l’identification d’une juxtaposition, à l’oral ?', ['Son effet dans le texte étudié', 'Le nom de l’auteur', 'La nature des verbes employés', 'Le nombre de syllabes'], 0, 'Nommer sans interpréter ne rapporte pas les points de la question de grammaire.'],
          ],
        },
        {
          titre: 'La proposition subordonnée relative',
          axe: 'La phrase complexe',
          lecon: {
            titre: 'Elle complète un nom, comme un adjectif',
            cours: `La **subordonnée relative** est introduite par un **pronom relatif** et complète un **nom** ou un pronom, appelé son **antécédent**.

> Elle occupe la fonction de **complément de l’antécédent** — autrement dit, elle fait le **travail d’un adjectif**.

## Les pronoms relatifs
| Type | Les formes |
| **Simples** | *qui, que, quoi, dont, où* |
| **Composés** | *lequel, laquelle, lesquels, auquel, duquel*… |

Le pronom relatif a une **double fonction** : il **relie** les deux propositions **et** occupe une **fonction dans la subordonnée**.

## La fonction du relatif — ce qu’il faut dire à l’oral
| L’exemple | Le relatif | Sa fonction |
| L’homme **qui** parle est mon père | qui | **Sujet** de « parle » |
| Le livre **que** je lis est ancien | que | **COD** de « lis » |
| La ville **dont** je viens | dont | Complément du verbe « venir **de** » |
| Le jour **où** nous sommes partis | où | Complément circonstanciel de **temps** |

## Déterminative ou explicative
| | **Déterminative** (restrictive) | **Explicative** (appositive) |
| Ce qu’elle fait | Elle **restreint** le sens de l’antécédent | Elle **ajoute** une information |
| Sa ponctuation | **Aucune virgule** | **Détachée par des virgules** |
| Peut-on la supprimer ? | **Non**, elle est indispensable | **Oui** |
| L’exemple | Les élèves qui ont fini peuvent sortir : **les autres restent** | Les élèves, qui ont fini, peuvent sortir : **tous ont fini** |

> **La virgule change le sens de la phrase.** C’est un exemple d’analyse très apprécié à l’oral.

## Effets dans un texte
| Effet | Ce qu’il produit |
| Elle **allonge** la phrase | Elle permet d’**enchâsser** les informations : c’est la **période classique** — Bossuet, Proust |
| Elle **caractérise** | Un personnage décrit **indirectement** |
| Elle **retarde** | L’information principale arrive plus tard |
| Elle **accumule** | Les précisions, jusqu’au vertige |`,
          },
          questions: [
            ['Que complète une subordonnée relative ?', ['Un nom ou un pronom, appelé antécédent', 'Un verbe', 'Toute la proposition principale', 'Un adjectif'], 0, 'Elle fait le travail d’un adjectif : c’est un complément de l’antécédent.'],
            ['Quelle est la double fonction du pronom relatif ?', ['Il relie les propositions et occupe une fonction dans la subordonnée', 'Il remplace le verbe et le sujet', 'Il coordonne et il interroge', 'Il détermine et il qualifie'], 0, 'C’est exactement ce qu’il faut dire à l’oral : « qui », sujet de tel verbe.'],
            ['Dans « Le livre que je lis est ancien », quelle est la fonction de « que » ?', ['COD du verbe « lis »', 'Sujet de « lis »', 'Complément du nom « livre »', 'Attribut'], 0, 'On le retrouve en reformulant : je lis le livre.'],
            ['Qu’est-ce qu’une relative explicative ?', ['Une relative détachée par des virgules, supprimable', 'Une relative indispensable au sens', 'Une relative introduite par « dont »', 'Une relative sans antécédent'], 0, 'La déterminative, elle, restreint le sens et ne peut pas être supprimée.'],
            ['« Les élèves qui ont fini peuvent sortir » : que signifie l’absence de virgules ?', ['Seuls ceux qui ont fini peuvent sortir', 'Tous les élèves ont fini', 'Aucun élève n’a fini', 'La phrase est incorrecte'], 0, 'La relative y est déterminative : elle restreint l’antécédent.'],
            ['Quelle est la fonction de « où » dans « le jour où nous sommes partis » ?', ['Complément circonstanciel de temps', 'Sujet', 'COD', 'Complément du nom'], 0, '« Où » peut marquer le lieu comme le temps.'],
            ['Le pronom relatif « dont » remplace toujours un complément du nom.', ['Vrai', 'Faux'], 1, 'Il peut aussi remplacer un complément du verbe (« la ville dont je viens ») ou de l’adjectif.'],
            ['Quel effet stylistique la relative produit-elle dans une longue phrase ?', ['Elle enchâsse les informations et construit la période', 'Elle accélère le récit', 'Elle marque une rupture logique', 'Elle supprime le sujet'], 0, 'C’est le procédé de la phrase ample, de Bossuet à Proust.'],
          ],
        },
        {
          titre: 'La proposition subordonnée conjonctive complétive',
          axe: 'La phrase complexe',
          lecon: {
            titre: 'Elle complète un verbe, comme un COD',
            cours: `La **complétive** est introduite par la conjonction de subordination **que** — parfois **ce que**, **à ce que** — et complète le plus souvent un **verbe**, dont elle est le **COD**.

> On la reconnaît au fait qu’on peut la remplacer par « **quelque chose** ».

## Ses fonctions possibles
| Fonction | L’exemple |
| **COD** | Je crois **que tu as raison** — je crois **quelque chose** |
| **Sujet** | **Qu’il soit venu** m’étonne |
| **Attribut** | Mon espoir est **qu’il revienne** |
| Complément de l’**adjectif** | Je suis certain **qu’il viendra** |
| Complément du **nom** | L’idée **qu’il parte** me déplaît |

## Le piège du mot « que »
| Valeur de « que » | Ce qui le caractérise | L’exemple |
| **Pronom relatif** | Il a un **antécédent** et une **fonction** | le livre **que** je lis |
| **Conjonction de subordination** | **Ni antécédent, ni fonction** : il ne fait qu’introduire | je crois **que** tu mens |
| **Adverbe** exclamatif ou interrogatif | Il porte l’intensité | **Que** c’est beau ! |

> Test simple : **cherchez un antécédent**. S’il n’y en a pas, ce n’est **pas** un relatif.

## Le mode dans la complétive
| Après quoi | Le mode | L’exemple |
| Verbes de **déclaration**, d’**opinion**, de **perception** | **Indicatif** | je sais **qu’il vient** |
| Verbes de **volonté**, de **sentiment**, de **doute** | **Subjonctif** | je veux **qu’il vienne** |
| Tournures **impersonnelles** | **Subjonctif** | il faut **qu’il vienne** |
| La **négation** ou l’**interrogation** | Elles font basculer au **subjonctif** | je ne crois pas **qu’il vienne** |

> Ce basculement est un excellent point d’analyse : il dit le **degré de certitude de celui qui parle**.

## L’interrogative indirecte
« Je me demande **s’il viendra** » est une subordonnée **interrogative indirecte**, introduite par *si* ou un mot interrogatif.

> Ce n’est **pas** une complétive ordinaire — mais elle occupe la **même fonction de COD**.`,
          },
          questions: [
            ['Quelle est la fonction la plus fréquente d’une complétive ?', ['COD du verbe de la principale', 'Complément circonstanciel', 'Complément de l’antécédent', 'Apposition'], 0, 'Test : on peut la remplacer par « quelque chose ».'],
            ['Comment distinguer « que » pronom relatif de « que » conjonction ?', ['Le relatif a un antécédent et une fonction, la conjonction n’en a pas', 'Le relatif est toujours en début de phrase', 'La conjonction introduit une relative', 'Ils sont interchangeables'], 0, 'C’est la confusion la plus fréquente à l’oral du bac.'],
            ['Quel mode emploie-t-on après un verbe de volonté ?', ['Le subjonctif', 'L’indicatif', 'Le conditionnel', 'L’impératif'], 0, '« Je veux qu’il vienne » : la volonté n’assure pas la réalité du fait.'],
            ['Que devient le mode dans « je ne crois pas qu’il… » ?', ['Il bascule au subjonctif', 'Il reste à l’indicatif', 'Il passe au conditionnel', 'Il passe à l’infinitif'], 0, 'La négation affaiblit la certitude : c’est un point d’analyse très valorisé.'],
            ['Dans « L’idée qu’il parte me déplaît », quelle est la fonction de la complétive ?', ['Complément du nom « idée »', 'COD', 'Sujet', 'Attribut'], 0, 'La complétive ne complète pas toujours un verbe.'],
            ['Comment appelle-t-on la subordonnée dans « Je me demande s’il viendra » ?', ['Une interrogative indirecte', 'Une relative', 'Une circonstancielle de condition', 'Une complétive ordinaire'], 0, 'Elle est introduite par « si » et occupe la fonction de COD.'],
            ['Une complétive peut être sujet de la principale.', ['Vrai', 'Faux'], 0, '« Qu’il soit venu m’étonne » : elle occupe alors la place du sujet.'],
            ['Quel est l’intérêt d’analyser le mode d’une complétive dans un texte ?', ['Il révèle le degré de certitude de celui qui parle', 'Il indique le temps du récit', 'Il détermine le genre littéraire', 'Il précise le niveau de langue'], 0, 'Indicatif ou subjonctif : la modalité change le rapport au réel.'],
          ],
        },
        {
          titre: 'Les propositions subordonnées circonstancielles',
          axe: 'La phrase complexe',
          lecon: {
            titre: 'Elles complètent la phrase entière',
            cours: `La **circonstancielle** complète non pas un mot, mais la **proposition principale tout entière**.

> Elle est **déplaçable** et souvent **supprimable** : c’est le test qui la distingue de la **complétive**, qui, elle, **ne bouge pas**.

## Les principaux rapports
| Rapport | Ses conjonctions | Le mode |
| **Temps** | quand, lorsque, dès que, après que, tandis que | Indicatif — sauf **avant que** : subjonctif |
| **Cause** | parce que, puisque, comme, étant donné que | Indicatif |
| **Conséquence** | si bien que, de sorte que, au point que, tellement… que | Indicatif |
| **But** | pour que, afin que, de peur que | **Subjonctif toujours** |
| **Concession / opposition** | bien que, quoique / alors que, tandis que | Subjonctif / indicatif |
| **Condition** | si, à condition que, pourvu que, à moins que | Voir ci-dessous |
| **Comparaison** | comme, ainsi que, de même que, plus… que | Indicatif |

> Le **but** est au subjonctif parce qu’il **n’est pas réalisé** au moment où l’on parle. La règle se comprend, elle ne s’apprend pas.

## Le système hypothétique avec « si »
| La construction | Ce qu’elle exprime |
| Présent + **futur** — Si tu viens, je serai content | Le **potentiel** : la chose est possible |
| Imparfait + **conditionnel présent** — Si tu venais, je serais content | L’**irréel du présent** |
| Plus-que-parfait + **conditionnel passé** — Si tu étais venu, j’aurais été content | L’**irréel du passé** |

> Après le *si* de condition : **jamais de futur ni de conditionnel**. Le mode se joue dans la **principale**.

## Ce qu’il faut dire à l’oral
Nommer le rapport, **puis l’interpréter**.

| L’observation | Son interprétation |
| Une accumulation de **causales** | Un **raisonnement** qui s’installe |
| Une **concessive** — « bien que » | Un locuteur qui **anticipe l’objection** |
| Une **hypothétique** à l’irréel du passé | Le **regret** |

> C’est cette **seconde étape** qui rapporte les points.`,
          },
          questions: [
            ['Qu’est-ce qui distingue une circonstancielle d’une complétive ?', ['Elle est déplaçable et souvent supprimable', 'Elle est introduite par « que »', 'Elle complète un nom', 'Elle est toujours en fin de phrase'], 0, 'La complétive, COD du verbe, ne peut pas se déplacer.'],
            ['Quel mode exigent les conjonctions de but comme « pour que » ?', ['Le subjonctif', 'L’indicatif', 'Le conditionnel', 'L’infinitif'], 0, 'Le but n’est pas réalisé au moment où l’on parle.'],
            ['Quel rapport exprime « bien que » ?', ['La concession', 'La cause', 'La conséquence', 'Le temps'], 0, 'Elle est suivie du subjonctif, contrairement à « alors que ».'],
            ['Comment se construit l’irréel du présent ?', ['Imparfait dans la subordonnée, conditionnel présent dans la principale', 'Présent et futur', 'Plus-que-parfait et conditionnel passé', 'Futur et conditionnel'], 0, '« Si tu venais, je serais content. »'],
            ['Que ne trouve-t-on jamais après « si » de condition ?', ['Le futur et le conditionnel', 'L’imparfait', 'Le plus-que-parfait', 'Le présent'], 0, 'C’est l’erreur la plus fréquente à l’écrit comme à l’oral.'],
            ['Quel rapport exprime « si bien que » ?', ['La conséquence', 'La cause', 'Le but', 'La condition'], 0, 'Elle est suivie de l’indicatif : la conséquence est réalisée.'],
            ['« Avant que » se construit avec l’indicatif.', ['Vrai', 'Faux'], 1, 'Il exige le subjonctif : l’action n’a pas encore eu lieu. « Après que » demande en principe l’indicatif.'],
            ['Que faut-il faire après avoir nommé une circonstancielle à l’oral ?', ['Interpréter son effet dans le texte', 'Donner la liste des autres conjonctions', 'Réciter la règle du subjonctif', 'Repérer les figures de style'], 0, 'Une concessive montre par exemple un locuteur qui anticipe l’objection.'],
          ],
        },
        {
          titre: 'L’interrogation totale et partielle',
          axe: 'L’interrogation et la négation',
          lecon: {
            titre: 'Sur quoi porte la question ?',
            cours: `L’interrogation est au programme parce qu’elle **met en scène celui qui parle** : poser une question, ce n’est pas seulement ignorer — c’est **solliciter, feindre, accuser ou faire réfléchir**.

## Totale ou partielle
| | **Totale** | **Partielle** |
| Sur quoi elle porte | **Toute la phrase** | **Un élément** de la phrase |
| La réponse attendue | **oui / non / si** | Une **information précise** |
| Ce qui l’introduit | Rien de particulier | Un **mot interrogatif** : qui, que, quoi, où, quand, comment, pourquoi, combien, quel |
| L’exemple | Viens-tu ? | **Quand** viens-tu ? |

## Les trois niveaux de langue
Une même question totale se formule de **trois** façons — et le choix est **signifiant**.

| Construction | Son niveau | L’exemple |
| **Intonation seule** | Oral, familier | Tu viens ? |
| « **Est-ce que** » | Courant | Est-ce que tu viens ? |
| **Inversion** sujet-verbe | Soutenu | Viens-tu ? |
| **Inversion complexe** (sujet nominal) | Soutenu | Pierre viendra-t-il ? |

> Dans un texte littéraire, l’**inversion** signale un registre soutenu ou une **distance** ; l’**intonation seule**, la **vivacité de l’oral**.

## Les fausses questions
| Type | Ce qu’il fait | L’exemple |
| La question **rhétorique** | Elle **n’attend pas de réponse** : elle **affirme** | « Qui ne le sait pas ? » = tout le monde le sait |
| La question **oratoire** | Elle **relance** le discours et guide l’auditeur | — |
| La **délibération** | Une question qu’on se pose **à soi-même** | « Que faire ? » |

> La question rhétorique est une **arme majeure de l’argumentation**. La délibération est fréquente dans le **monologue théâtral**, où elle **donne à voir l’hésitation**.

## À l’oral du bac
1. Repérer le **type** — totale ou partielle ;
2. Repérer la **construction** — intonation, « est-ce que », inversion ;
3. Nommer la **valeur** — vraie question, question rhétorique, délibération.

> C’est la **troisième étape** qui montre ce que vous savez lire.`,
          },
          questions: [
            ['Sur quoi porte une interrogation totale ?', ['Sur toute la phrase, avec une réponse oui / non', 'Sur un seul élément de la phrase', 'Sur le sujet uniquement', 'Sur le complément'], 0, 'L’interrogation partielle, elle, appelle une information précise.'],
            ['Quels mots introduisent une interrogation partielle ?', ['Qui, que, où, quand, comment, pourquoi, combien, quel', 'Est-ce que', 'Si', 'Que et ce que'], 0, 'Ils indiquent l’élément précis sur lequel porte la question.'],
            ['Quelle construction interrogative appartient au registre soutenu ?', ['L’inversion sujet-verbe', 'L’intonation seule', '« Est-ce que »', 'La question sans verbe'], 0, 'Dans un texte, elle signale un registre soutenu ou une distance.'],
            ['Qu’est-ce qu’une question rhétorique ?', ['Une question qui n’attend pas de réponse et affirme', 'Une question posée à soi-même', 'Une question indirecte', 'Une question partielle'], 0, '« Qui ne le sait pas ? » signifie : tout le monde le sait.'],
            ['Comment nomme-t-on une question qu’un personnage se pose à lui-même ?', ['Une délibération', 'Une interrogation totale', 'Une interrogative indirecte', 'Une exclamation'], 0, 'Fréquente dans le monologue théâtral, elle donne à voir l’hésitation.'],
            ['Quelle réponse peut appeler une interrogation totale portant sur une phrase négative ?', ['« Si »', '« Que »', '« Quoi »', '« Comment »'], 0, '« Tu ne viens pas ? — Si. » : c’est une particularité du français.'],
            ['Une question rhétorique attend une vraie réponse de l’interlocuteur.', ['Vrai', 'Faux'], 1, 'Elle affirme sous forme de question : c’est une arme d’argumentation.'],
            ['Quelle est la troisième étape de l’analyse d’une interrogation à l’oral ?', ['En déterminer la valeur : vraie question, rhétorique ou délibération', 'Compter les mots', 'Chercher le sujet inversé', 'Vérifier la ponctuation'], 0, 'C’est celle qui montre que vous savez lire, pas seulement nommer.'],
          ],
        },
        {
          titre: 'L’interrogation directe et indirecte',
          axe: 'L’interrogation et la négation',
          lecon: {
            titre: 'La question rapportée change de forme',
            cours: `L’**interrogation directe** est posée telle quelle, avec un **point d’interrogation**. L’**interrogation indirecte** est **rapportée** dans une subordonnée — et **perd tous les signes de la question**.

## Les trois transformations
| Transformation | Ce qui change | L’exemple |
| 1. La **ponctuation et l’ordre** | Plus de **point d’interrogation**, plus d’**inversion** | Viendra-t-il ? → Je demande **s’il viendra**. |
| 2. Les **mots interrogatifs** | Certains sont remplacés | Voir le tableau ci-dessous |
| 3. La **concordance** | Temps **et** personnes, si le verbe introducteur est au passé | « Où vas-tu ? » → Il m’a demandé **où j’allais**. |

| Au direct | À l’indirect |
| *est-ce que* | **si** |
| *qu’est-ce qui* | **ce qui** |
| *qu’est-ce que*, *que* | **ce que** |
| *où, quand, comment, pourquoi, combien, qui, quel* | **inchangés** |

## La fonction
L’interrogative indirecte est une **subordonnée**, le plus souvent **COD** du verbe introducteur — *demander, savoir, se demander, ignorer, chercher*.

> C’est le rappel attendu à l’oral : nommer la **nature** et la **fonction**.

## L’erreur à ne pas commettre
> Ne **jamais** garder l’inversion ni « est-ce que » dans l’indirect. « Je me demande **où est-ce qu’il va** » est **fautif** : on dit « Je me demande **où il va** ».

## Ce que cela apporte à l’analyse
| Discours | Ce qu’il fait |
| **Direct** | Il **met la question en scène** : on entend le personnage |
| **Indirect** | Il **efface la voix** : le narrateur se place **entre le lecteur et la parole** |

> Un romancier qui rapporte **indirectement** les questions d’un personnage prend de la **distance**, parfois de l’**ironie**.

> Comparer les deux dans un même extrait est un excellent réflexe d’oral.`,
          },
          questions: [
            ['Que perd une interrogation lorsqu’elle devient indirecte ?', ['Le point d’interrogation et l’inversion du sujet', 'Son sujet', 'Son verbe', 'Son mot interrogatif toujours'], 0, 'Elle devient une subordonnée intégrée à la phrase.'],
            ['Par quoi « est-ce que » est-il remplacé dans l’interrogation indirecte ?', ['Par « si »', 'Par « que »', 'Par « ce que »', 'Il disparaît sans remplacement'], 0, '« Je demande s’il viendra. »'],
            ['Comment transpose-t-on « Qu’est-ce que tu veux ? » à l’indirect ?', ['Je demande ce que tu veux', 'Je demande qu’est-ce que tu veux', 'Je demande que tu veux', 'Je demande si tu veux'], 0, '« Qu’est-ce que » devient « ce que » ; « qu’est-ce qui » devient « ce qui ».'],
            ['Quelle fonction occupe généralement une interrogative indirecte ?', ['COD du verbe introducteur', 'Complément circonstanciel', 'Sujet', 'Complément du nom'], 0, 'Après demander, savoir, ignorer, se demander, chercher.'],
            ['Quelle phrase est correcte ?', ['Je me demande où il va', 'Je me demande où est-ce qu’il va', 'Je me demande où va-t-il', 'Je me demande où va-t-il ?'], 0, 'Ni inversion ni « est-ce que » dans l’interrogation indirecte.'],
            ['Que devient « Où vas-tu ? » rapporté au passé ?', ['Il m’a demandé où j’allais', 'Il m’a demandé où tu vas', 'Il m’a demandé où vas-tu', 'Il m’a demandé si j’allais'], 0, 'La concordance des temps et le changement de personne s’appliquent.'],
            ['L’interrogation indirecte conserve le point d’interrogation.', ['Vrai', 'Faux'], 1, 'La phrase se termine par un point : ce n’est plus une question posée, c’est une question rapportée.'],
            ['Quel effet le passage à l’indirect produit-il dans un récit ?', ['Il efface la voix du personnage et installe le narrateur entre lui et le lecteur', 'Il rend la scène plus vivante', 'Il accélère l’action', 'Il supprime toute subordination'], 0, 'Le discours direct met la question en scène ; l’indirect prend de la distance.'],
          ],
        },
        {
          titre: 'L’expression de la négation',
          axe: 'L’interrogation et la négation',
          lecon: {
            titre: 'Dire non, et de combien',
            cours: `En français, la négation est le plus souvent **en deux parties** : l’adverbe **ne** et un second terme — *pas, plus, jamais, rien, personne, aucun, nul, guère*.

> Le programme demande de savoir la **classer** et d’en mesurer la **portée**.

## Totale ou partielle
| | **Totale** | **Partielle** |
| Sur quoi elle porte | **Toute** la phrase | **Un seul élément** — le reste tient debout |
| L’exemple | Il **ne** vient **pas**. | Il **ne** vient **jamais le lundi** : il vient les autres jours |

> Repérer la **portée exacte** est souvent la question posée à l’oral.

## Les formes particulières
| Forme | Ce qu’elle est | L’exemple |
| La **négation exceptive** — *ne… que* | **Ce n’est PAS une négation** : c’est une **restriction** | « Je n’ai que dix euros » = j’ai **seulement** dix euros |
| La **négation lexicale** | Le sens négatif est **dans le mot** | impossible, malheureux, inhumain, refuser, sans, ignorer |
| Le **ne** explétif | Il **ne nie rien** | « Je crains qu’il **ne** vienne » = je crains qu’il vienne |
| La négation **à un seul terme** | Le « ne » tombe à l’oral, ou subsiste seul en langue littéraire | « je viens pas » ; « je **ne** saurais dire » |

> L’exceptive *ne… que* est le **piège classique** : elle a la **forme** d’une négation et le **sens** d’une restriction.

## Ce qu’on en fait dans un texte
| Procédé | L’effet |
| Une **accumulation** de négations | Elle peint le **vide**, le manque, le refus, l’enfermement |
| Un portrait **par soustraction** | « Il ne dit rien, ne demande rien, n’attend plus personne » |
| La **négation exceptive** | Elle **resserre** l’attention sur **une seule chose** : une insistance |
| Les **négations lexicales** en série | Un texte polémique **disqualifie sans avoir l’air de nier** |`,
          },
          questions: [
            ['De quoi la négation française se compose-t-elle le plus souvent ?', ['De deux éléments : « ne » et un second terme', 'D’un seul adverbe', 'D’un préfixe', 'D’une inversion du sujet'], 0, '« Ne… pas », « ne… jamais », « ne… rien », « ne… personne ».'],
            ['Qu’est-ce qu’une négation partielle ?', ['Elle ne nie qu’un élément de la phrase', 'Elle porte sur toute la phrase', 'Elle utilise un mot négatif lexical', 'Elle emploie « ne » seul'], 0, '« Il ne vient jamais le lundi » : il vient les autres jours.'],
            ['Que signifie « Je n’ai que dix euros » ?', ['J’ai seulement dix euros', 'Je n’ai pas dix euros', 'Je n’ai rien', 'J’ai plus de dix euros'], 0, '« Ne… que » est une restriction, pas une négation : c’est un piège classique.'],
            ['Qu’est-ce qu’une négation lexicale ?', ['Le sens négatif est porté par le mot lui-même', 'Le « ne » est supprimé', 'La négation porte sur le verbe', 'La phrase est interrogative'], 0, '« Impossible », « refuser », « sans », « ignorer ».'],
            ['Qu’est-ce que le « ne » explétif ?', ['Un « ne » qui ne nie rien, employé dans certaines subordonnées', 'Un « ne » oublié à l’oral', 'Un « ne » de restriction', 'Un « ne » interrogatif'], 0, '« Je crains qu’il ne vienne » signifie que je crains sa venue.'],
            ['Dans quel registre le « ne » disparaît-il couramment ?', ['À l’oral familier', 'Dans la langue littéraire', 'Dans les textes juridiques', 'Dans la poésie classique'], 0, '« Je viens pas » : sa présence ou son absence caractérise un personnage.'],
            ['« Ne… que » est une forme de négation totale.', ['Vrai', 'Faux'], 1, 'C’est une négation exceptive, qui restreint au lieu de nier.'],
            ['Quel effet une accumulation de négations peut-elle produire dans un portrait ?', ['Construire le personnage par soustraction : vide, manque, enfermement', 'Accélérer le récit', 'Marquer l’ironie du narrateur seulement', 'Signaler un dialogue'], 0, '« Qui ne dit rien, ne demande rien, n’attend plus personne. »'],
          ],
        },
        {
          titre: 'La méthode de la question de grammaire',
          axe: 'La question de grammaire à l’oral',
          lecon: {
            titre: 'Deux points en cinq minutes, si l’on suit l’ordre',
            cours: `À l’oral du bac, après l’explication linéaire, l’examinateur pose une **question de grammaire** sur une phrase du texte : elle vaut **2 points sur 20**.

> Elle se **prépare**, et elle se **gagne** — à condition de suivre **toujours la même méthode**.

## Les quatre étapes
| Étape | Ce qu’on fait | L’erreur à éviter |
| 1. **Relire** la phrase à voix haute | En **entier** | Analyser un **fragment** fait perdre des points |
| 2. **Identifier** | Compter les verbes conjugués, repérer les subordonnants, délimiter les propositions | Se lancer sans compter |
| 3. **Nommer** précisément | Nature, fonction — et pour un relatif, sa **double fonction** | Rester vague |
| 4. **Interpréter** | Que produit cette construction **dans ce texte** ? | **C’est l’étape qu’on oublie** — et celle qui fait la différence entre 1 et 2 points |

À l’étape 2, dire à voix haute : « Cette phrase compte **trois verbes conjugués**, donc **trois propositions**. »

## Les questions les plus fréquentes
| La consigne | Ce qu’elle attend |
| « Analysez la phrase suivante » | Un **découpage complet** en propositions |
| « Analysez la négation » | **Totale ou partielle**, et sa **portée** |
| « Transformez cette phrase interrogative » | Direct → indirect, ou changement de **registre** |
| « Quelle est la fonction de la subordonnée ? » | Nature **puis** fonction |
| « Quel est le mode employé, et pourquoi ? » | La **valeur** du subjonctif ou de l’indicatif |

## Trois conseils
| Conseil | Pourquoi |
| Ne pas paniquer devant une phrase **longue** | Le **nombre de verbes conjugués** donne toujours le squelette |
| Employer le **métalangage exact** | « Subordonnée conjonctive complétive COD » vaut mieux que « une subordonnée avec que » |
| **Ne jamais inventer** | Mieux vaut **deux propositions justes sur trois** qu’une étiquette fausse pour tout |

> La grammaire n’est **pas une épreuve à part** : elle **sert l’explication**. Une subordonnée de cause dans un plaidoyer, une négation totale dans un aveu — c’est la **même lecture, poursuivie par d’autres moyens**.`,
          },
          questions: [
            ['Combien de points vaut la question de grammaire à l’oral du bac ?', ['2 points sur 20', '5 points sur 20', '1 point sur 20', '4 points sur 20'], 0, 'Elle est posée après l’explication linéaire, sur une phrase du texte.'],
            ['Quelle est la première étape de la méthode ?', ['Relire la phrase entière à voix haute', 'Nommer la subordonnée', 'Chercher les figures de style', 'Donner la fonction du sujet'], 0, 'Analyser un fragment au lieu de la phrase entière fait perdre des points.'],
            ['Comment délimite-t-on les propositions ?', ['En comptant les verbes conjugués', 'En comptant les virgules', 'En repérant les adjectifs', 'En cherchant les points-virgules'], 0, 'Le nombre de verbes conjugués donne toujours le squelette de la phrase.'],
            ['Quelle étape les candidats oublient-ils le plus souvent ?', ['L’interprétation de l’effet dans le texte', 'L’identification du verbe', 'La lecture de la phrase', 'La mention du sujet'], 0, 'C’est elle qui fait la différence entre 1 et 2 points.'],
            ['Que doit-on préciser pour un pronom relatif ?', ['Son antécédent et sa fonction dans la subordonnée', 'Son genre uniquement', 'Sa place dans la phrase', 'Le temps du verbe qui suit'], 0, 'La double fonction du relatif est le rappel attendu par l’examinateur.'],
            ['Que vaut-il mieux faire si l’on n’est pas sûr de tout ?', ['Analyser correctement ce que l’on maîtrise, sans inventer', 'Donner plusieurs étiquettes au hasard', 'Ne rien dire', 'Changer de phrase'], 0, 'Une étiquette fausse coûte plus cher qu’une analyse partielle mais juste.'],
            ['La question de grammaire est une épreuve séparée de l’explication du texte.', ['Vrai', 'Faux'], 1, 'Elle prolonge la lecture : une négation ou une subordonnée s’interprètent dans le texte étudié.'],
            ['Quelle formulation est la meilleure à l’oral ?', ['« Subordonnée conjonctive complétive, COD du verbe croire »', '« Une subordonnée avec que »', '« Une proposition secondaire »', '« Un complément »'], 0, 'Le métalangage exact fait partie de ce qui est évalué.'],
          ],
        },
        {
          titre: 'Les fonctions grammaticales à savoir nommer',
          axe: 'La question de grammaire à l’oral',
          lecon: {
            titre: 'Le minimum vital, sans lequel rien ne tient',
            cours: `Toutes les questions de grammaire supposent le même socle : distinguer la **nature** — ce qu’un mot **est** — de la **fonction** — le **rôle qu’il joue** dans la phrase.

> Un même mot **change de fonction**, **jamais de nature**.

## Les natures
Nom, déterminant, adjectif qualificatif, pronom, verbe, adverbe, préposition, conjonction (de coordination ou de subordination), interjection.

> Ce sont des **classes grammaticales** : elles s’apprennent **une fois pour toutes**.

## Les fonctions essentielles
| Fonction | Ce qu’elle est | Le test |
| **Sujet** | Ce dont on dit quelque chose | « c’est… qui » |
| **COD** | Il complète le verbe **sans préposition** | « qui ? quoi ? » après le verbe |
| **COI** | Il complète le verbe **avec préposition** | « à qui ? de quoi ? » |
| **Attribut du sujet** | Il **qualifie le sujet**, après un verbe d’état | On ne peut **pas** le supprimer |
| **Complément circonstanciel** | Temps, lieu, manière, cause, but, moyen | **Déplaçable**, souvent supprimable |
| **Épithète** | Adjectif **accolé** au nom, sans verbe | une nuit **noire** |
| **Apposition** | **Détachée** par une virgule, elle désigne la même réalité | Paris, **capitale de la France** |
| **Complément du nom** | Introduit par une **préposition** | le livre **de Pierre** |
| **Complément de l’antécédent** | La fonction d’une subordonnée **relative** | — |

Les verbes d’état : *être, sembler, paraître, devenir, rester, demeurer, avoir l’air*.

## Le piège épithète / attribut
| L’exemple | La fonction | Pourquoi |
| Une femme **heureuse** | **Épithète** | Pas de verbe d’état |
| Cette femme **est heureuse** | **Attribut du sujet** | Après « est » |

> La différence est **constamment demandée**.

## L’usage littéraire
| Observation | Ce qu’elle produit |
| Une **accumulation d’épithètes** | Elle alourdit — ou enrichit — une description |
| Une **apposition** | Elle **ralentit** la phrase et met en relief |
| Un **complément circonstanciel en tête** | Il **installe un cadre** avant l’action |

> Nommer une fonction n’a d’intérêt que si l’on en **tire quelque chose** : la grammaire **décrit ce que le style fait**.`,
          },
          questions: [
            ['Quelle différence y a-t-il entre nature et fonction ?', ['La nature est ce qu’un mot est, la fonction le rôle qu’il joue', 'Ce sont deux mots pour la même chose', 'La nature dépend de la phrase, la fonction non', 'La fonction concerne seulement les verbes'], 0, 'Un mot change de fonction selon la phrase, jamais de classe grammaticale.'],
            ['Quel test permet d’identifier un COD ?', ['Poser « qui ? » ou « quoi ? » après le verbe, sans préposition', 'Poser « à qui ? »', 'Vérifier qu’il est déplaçable', 'Chercher un verbe d’état'], 0, 'Le COI, lui, se construit avec une préposition.'],
            ['Après quels verbes trouve-t-on un attribut du sujet ?', ['Les verbes d’état : être, sembler, paraître, devenir, rester', 'Les verbes de mouvement', 'Les verbes pronominaux', 'Les verbes impersonnels'], 0, 'L’attribut qualifie le sujet et ne peut pas être supprimé.'],
            ['Qu’est-ce qu’une apposition ?', ['Un groupe détaché par une virgule qui désigne la même réalité que le nom', 'Un adjectif accolé au nom', 'Un complément introduit par une préposition', 'Un pronom relatif'], 0, '« Paris, capitale de la France » : elle ralentit la phrase et met en relief.'],
            ['Dans « une femme heureuse », quelle est la fonction de l’adjectif ?', ['Épithète', 'Attribut du sujet', 'Apposition', 'Complément du nom'], 0, 'Il devient attribut dans « cette femme est heureuse ».'],
            ['Quelle est la fonction d’une subordonnée relative ?', ['Complément de l’antécédent', 'COD du verbe', 'Complément circonstanciel', 'Attribut'], 0, 'Elle complète le nom ou le pronom qui la précède.'],
            ['Un complément circonstanciel est en général déplaçable.', ['Vrai', 'Faux'], 0, 'C’est même le test qui le distingue d’un complément essentiel comme le COD.'],
            ['Quel effet produit un complément circonstanciel placé en tête de phrase ?', ['Il installe un cadre avant l’action', 'Il accélère le récit', 'Il supprime le sujet', 'Il marque une négation'], 0, 'La grammaire sert à décrire ce que le style fait : c’est le but de l’analyse.'],
          ],
        },
      ],
    },
  ],
}
