// Histoire — Troisième : LE PROGRAMME COMPLET (14 fiches).
//
// CE QUE REMPLACE CE MODULE. La 3e n'avait que CINQ chapitres d'histoire-géo,
// hérités du tout premier jeu de données (migration 008, contenu rempli par la
// 115) : « La Première Guerre mondiale », « L'Europe entre les deux guerres »,
// « La Seconde Guerre mondiale », « La France de 1944 à nos jours » et « Les
// aires urbaines en France ». Quatre fiches d'histoire pour un programme qui en
// demande quatorze : rien sur les totalitarismes autrement qu'en survol, rien
// sur Vichy, rien sur la décolonisation, rien sur la construction européenne,
// rien sur les Trente Glorieuses, rien sur la géopolitique du monde actuel.
//
// LE DÉCOUPAGE. Les 3 chapitres de la maquette de référence, éclatés en leurs
// 14 fiches. Chaque fiche est un chapitre en base ; le CHAPITRE du programme est
// porté par `axe` (colonne `chapters.theme`), qui fait grouper la page matière —
// cf. docs/template-matiere.md.
//
// ⚠️ LA GÉOGRAPHIE DE 3e RESTE À FAIRE. Ce module ne couvre QUE l'histoire :
// c'est la seule moitié du dossier dont la maquette a été relevée. Les 14 fiches
// portent donc `rayon: 'histoire'` (colonne `chapters.discipline`, migration
// 247), exactement comme en 2de, en 1re et en Tle — mais l'onglet ne se dédouble
// PAS encore : `disciplinesOf` (lib/subject-template) ne rend des onglets qu'à
// partir de DEUX rayons, et il n'y en a qu'un tant que la géographie n'est pas
// écrite. Le rayon est posé d'avance pour que le jour où la géographie arrive,
// les deux onglets apparaissent sans toucher à cette migration.
//
// L'UNIQUE FICHE DE GÉOGRAPHIE SURVIT. « Les aires urbaines en France » n'est
// pas supprimée : la retirer laisserait la géographie de 3e entièrement VIDE, ce
// qui serait pire que de la laisser incomplète. Elle ne porte ni thème ni rayon,
// donc la page la range sous « Autres chapitres », à la suite des trois
// chapitres d'histoire (cf. ChapterList). Le ménage la repousse simplement en
// position 99 pour qu'elle ne s'intercale pas au milieu du programme d'histoire.
//
// LES QUATRE FICHES D'HISTOIRE PARTENT (voir `menage`). Toutes les quatre sont
// recouvertes au titre près par le nouveau découpage : « La Première Guerre
// mondiale » devient « … : vers une guerre totale », « L'Europe entre les deux
// guerres » se scinde en « Les régimes totalitaires dans les années 1930 » et
// « La France durant l'entre-deux-guerres », « La Seconde Guerre mondiale »
// devient « … : une guerre d'anéantissement », « La France de 1944 à nos jours »
// se déplie en les quatre fiches du chapitre 3. Les laisser en base ferait deux
// objets voisins à deux places différentes.
//
// CHOIX ASSUMÉ, L'ORDRE DU CHAPITRE 3. La maquette range « La Ve République à
// l'épreuve de la durée (1958-2012) » AVANT « Les années de Gaulle (1958-1969) »
// et « Les Trente Glorieuses ». Une fiche qui court jusqu'en 2012 se lirait donc
// avant celle qui s'arrête en 1969, et avant les trente années de croissance qui
// la précèdent. Les quatre fiches sont ici dans l'ordre CHRONOLOGIQUE
// (1944-1947, de Gaulle, Trente Glorieuses, puis la durée de 1958 à 2012, qui
// referme le chapitre en le récapitulant). Les titres et le contenu sont ceux de
// la maquette : seul l'ordre change.
//
// ⚠️ Le slug reste `histoire-geo` et CINQ modules le portent désormais
// (`histoire-geo-tle` = 227, `geographie-tle` = 229, `histoire-geo-1re` = 245,
// `histoire-tle-1-6` = 246, `histoire-geo-2de` = 279, celui-ci = 291) : ne
// JAMAIS générer avec `--slugs histoire-geo`, qui les fusionnerait et réécrirait
// cinq migrations. Toujours `--modules histoire-3e`.

export default {
  slug: 'histoire-geo',
  nom: 'Histoire-Géographie',

  titreMigration: 'HISTOIRE 3e — LE PROGRAMME COMPLET (14 fiches)',

  motif: `CONSTAT : la Troisième n'avait que QUATRE fiches d'histoire, héritées du
premier jeu de données de l'app, pour un programme qui en demande quatorze —
l'Europe dans les guerres totales, le monde depuis 1945, et la République
française repensée. Un élève de 3e qui révisait les régimes totalitaires des
années 1930, la France de Vichy, la décolonisation, les deux temps de la guerre
froide, la construction européenne, la géopolitique du monde actuel, la
refondation de 1944-1947, les années de Gaulle ou les Trente Glorieuses ne
trouvait RIEN. Cette migration installe les 14 fiches, rangées sous leurs 3
chapitres, et retire les 4 fiches génériques que ce découpage recouvre.
LA GÉOGRAPHIE DE 3e N'EST PAS TRAITÉE ICI : sa seule fiche héritée ("Les aires
urbaines en France") est CONSERVÉE, car la supprimer laisserait la géographie
entièrement vide.`,

  menage: [
    {
      raison: `Les colonnes chapters.theme (migration 234) et chapters.discipline
(migration 247) conditionnent tout ce qui suit : ce module range ses 14 fiches
sous 3 chapitres et un rayon, et l'INSERT écrit les deux colonnes. Elles sont
REPRISES ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut pas garantir que la
234 et la 247 soient passées en production — sans cette reprise, la migration
échouerait sur "column chapters.theme does not exist", les 4 anciens chapitres
déjà supprimés et les 14 neufs pas encore posés : une matière vide.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne. Une
colonne ajoutée après elle n'hérite d'aucun droit — sans lui, l'app lirait
"permission denied" au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;

ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS discipline TEXT;
GRANT SELECT (discipline) ON public.chapters TO anon;
GRANT SELECT (discipline) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 4 fiches d'histoire héritées partent. Toutes les quatre sont
recouvertes au titre près par le nouveau découpage : les garder ferait deux
objets voisins à deux places différentes, un en-tête de section et une ligne
dans la liste.
"Les aires urbaines en France" N'EST PAS DANS LA LISTE, et c'est volontaire :
c'est la seule fiche de géographie de la 3e, et ce module ne traite que
l'histoire. La supprimer laisserait la géographie entièrement vide.
ATTENTION À L'APOSTROPHE : les titres de la 008 s'écrivent avec l'apostrophe
DROITE, pas la typographique qu'emploient les fiches neuves. Un DELETE qui se
tromperait de signe ne trouverait rien EN SILENCE.
Le filtre level = '3e' est indispensable : "La Première Guerre mondiale" et "La
Seconde Guerre mondiale" sont aussi des titres de 1re et de Tle, et le ménage
mordrait sur le lycée.
L'ordre compte : la file "À revoir" d'abord (review_items.item_id n'a PAS de clé
étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL : ils
survivraient orphelins à leur chapitre, mais toujours tirables par le moteur de
questions), puis les chapitres, dont les leçons partent en cascade.
Le ménage tourne AVANT les insertions à CHAQUE passage : sans la borne des
quatre titres, un rejeu effacerait les quiz des 14 fiches neuves.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'histoire-geo'
   AND c.level = '3e'
   AND c.title IN ('La Première Guerre mondiale',
                   'L''Europe entre les deux guerres',
                   'La Seconde Guerre mondiale',
                   'La France de 1944 à nos jours');

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'histoire-geo'
   AND c.level = '3e'
   AND c.title IN ('La Première Guerre mondiale',
                   'L''Europe entre les deux guerres',
                   'La Seconde Guerre mondiale',
                   'La France de 1944 à nos jours');

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'histoire-geo'
   AND c.level = '3e'
   AND c.title IN ('La Première Guerre mondiale',
                   'L''Europe entre les deux guerres',
                   'La Seconde Guerre mondiale',
                   'La France de 1944 à nos jours');`,
    },
    {
      raison: `La fiche de géographie survivante est repoussée en position 99. Sans cet
UPDATE elle resterait en position 5 et s'intercalerait au milieu du programme
d'histoire, que ce module numérote de 1 à 14 : la page matière trie par
position, et un chapitre de géographie tomberait entre deux fiches sur la guerre
froide. En 99, elle ferme la liste, sous l'en-tête "Autres chapitres" que
ChapterList réserve aux chapitres sans thème.
L'UPDATE est idempotent : rejoué, il repose la même valeur.`,
      sql: `UPDATE public.chapters c
   SET position = 99
  FROM public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'histoire-geo'
   AND c.level = '3e'
   AND c.title = 'Les aires urbaines en France'
   AND c.position IS DISTINCT FROM 99;`,
    },
  ],

  blocs: [
    {
      niveaux: ['3e'],
      rayon: 'histoire',
      chapitres: [
        // ===================================================================
        // Chapitre 1 : L'Europe, un théâtre majeur des guerres totales
        // ===================================================================
        {
          titre: 'La Première Guerre mondiale : vers une guerre totale',
          axe: 'L’Europe, un théâtre majeur des guerres totales (1914-1945)',
          lecon: {
            titre: '1914-1918 : quand la guerre engloutit les sociétés',
            cours: `La Première Guerre mondiale inaugure un type de conflit nouveau : la guerre totale.

## Les deux camps
| Le camp | Ses membres |
| La **Triple-Entente** | France, Royaume-Uni, Russie ; l'Italie en 1915, les États-Unis en 1917 |
| Les **Empires centraux** | Allemagne, Autriche-Hongrie, Empire ottoman |

Dates : **28 juillet 1914 – 11 novembre 1918**.

## Trois phases
| La phase | Ses dates | Ce qui s'y passe |
| La guerre de **mouvement** | 1914 | L'attentat de Sarajevo (28 juin) déclenche les alliances ; le front se bloque après la **Marne** |
| La guerre de **position** | 1915-1917 | 700 km de **tranchées** ; **Verdun** et la **Somme** en 1916 |
| Le **tournant** | 1917-1918 | La Russie sort du conflit ; les **États-Unis** entrent en avril 1917 ; armistice le 11 novembre |

## Qu'est-ce qu'une guerre totale
| Le domaine mobilisé | Ce qu'il engage |
| **Militaire** | Plus de 70 millions d'hommes, conscription générale |
| **Économique** | Usines converties, femmes à l'usine, emprunts de guerre |
| **Scientifique** | Gaz de combat, chars, aviation, sous-marins |
| **Moral** | Censure, **propagande**, « bourrage de crâne » |

> La frontière entre le front et l'arrière s'efface : les civils deviennent une cible **et** une ressource.

## La violence de masse
| Le fait | Son contenu |
| La vie dans les **tranchées** | Boue, rats, poux, bombardements, attaques à la baïonnette |
| Les **mutineries** de 1917 | Le refus des offensives inutiles |
| Le **génocide des Arméniens**, 1915-1916 | Organisé par le gouvernement jeune-turc : environ **1,2 million** de morts — le premier génocide du siècle |

## Un bilan écrasant
| Le chiffre ou le fait | Sa valeur |
| Les morts | Près de **10 millions** |
| Les blessés | 20 millions, dont les « **gueules cassées** » |
| Le **traité de Versailles**, 28 juin 1919 | Responsabilité de la guerre, réparations, pertes territoriales imposées à l'Allemagne — un **diktat** à ses yeux |
| Les empires disparus | Allemand, austro-hongrois, ottoman, russe |
| La **Société des Nations** | Créée pour garantir la paix — **sans** les États-Unis, qui refusent d'y entrer |`,
          },
          questions: [
            ['Quelles dates encadrent la Première Guerre mondiale ?', ['28 juillet 1914 – 11 novembre 1918', '1er septembre 1914 – 8 mai 1918', '3 août 1914 – 28 juin 1919', '28 juin 1914 – 11 novembre 1919'], 0, 'L’armistice du 11 novembre 1918 précède le traité de Versailles de 1919.'],
            ['Quelle bataille de 1916 est devenue le symbole de l’enfer des tranchées françaises ?', ['Verdun', 'La Marne', 'Stalingrad', 'Waterloo'], 0, 'Elle dure de février à décembre 1916.'],
            ['Qu’est-ce qu’une guerre totale ?', ['Une guerre qui mobilise toutes les ressources d’un pays', 'Une guerre menée sur tous les continents', 'Une guerre sans prisonniers', 'Une guerre qui dure plus de quatre ans'], 0, 'Militaires, économiques, scientifiques et morales.'],
            ['Quel pays entre en guerre en avril 1917 aux côtés de l’Entente ?', ['Les États-Unis', 'L’Italie', 'Le Japon', 'L’Espagne'], 0, 'Leur entrée compense la sortie de la Russie.'],
            ['Pourquoi la Russie quitte-t-elle le conflit en 1917-1918 ?', ['À cause de la révolution bolchevique', 'Parce qu’elle a été envahie entièrement', 'Parce qu’elle change d’alliance en 1915', 'Parce qu’elle a épuisé ses réserves de charbon'], 0, 'Le traité de Brest-Litovsk est signé en mars 1918.'],
            ['Quel génocide est perpétré en 1915-1916 par le gouvernement jeune-turc ?', ['Le génocide des Arméniens', 'Le génocide des Tutsi', 'La Shoah', 'Le massacre de Katyn'], 0, 'Environ 1,2 million de morts : le premier génocide du siècle.'],
            ['Quel traité met fin à la guerre avec l’Allemagne en 1919 ?', ['Le traité de Versailles', 'Le traité de Brest-Litovsk', 'Le traité de Rome', 'Le pacte Briand-Kellogg'], 0, 'Signé le 28 juin 1919, l’Allemagne le juge comme un diktat.'],
            ['La Société des Nations est créée après 1918 avec la participation des États-Unis.', ['Vrai', 'Faux'], 1, 'Le Sénat américain refuse d’y adhérer, ce qui affaiblit l’organisation.'],
          ],
        },
        {
          titre: 'Les régimes totalitaires dans les années 1930',
          axe: 'L’Europe, un théâtre majeur des guerres totales (1914-1945)',
          lecon: {
            titre: 'URSS, Italie, Allemagne : l’État contre l’individu',
            cours: `Un régime totalitaire ne se contente pas d'exercer le pouvoir : il veut transformer l'homme et contrôler la société tout entière.

## Les traits communs
| Le trait | Sa forme |
| Un **parti unique** et un **chef** au-dessus des lois | Le culte de la personnalité |
| Une **idéologie** officielle | Elle prétend expliquer le monde entier |
| La **propagande** | Radio, cinéma, affiches, défilés |
| L'**embrigadement de la jeunesse** | Organisations obligatoires |
| La **terreur** | Police politique, camps, procès truqués, dénonciation |
| La suppression des **libertés** | Presse, réunion, opposition, syndicats |
| Une **économie dirigée** | Par l'État |

## Les trois régimes
| Le régime | Son chef | Sa prise de pouvoir | Son fondement |
| **URSS** | **Staline** | Après la mort de Lénine, 1924 | La lutte des classes, une société sans classes |
| **Italie** | **Mussolini** | **1922**, la marche sur Rome | Le **fascisme**, la nation et le chef |
| **Allemagne** | **Hitler** | **30 janvier 1933**, chancelier | Le **racisme** et l'antisémitisme |

## L'URSS de Staline
| La politique | Son coût |
| La **collectivisation** des terres | La liquidation des « koulaks » ; famine terrible en Ukraine, l'**Holodomor** de 1932-1933 |
| Les **plans quinquennaux** | Une industrialisation à marche forcée |
| Les **Grandes Purges**, 1936-1938 | Elles frappent jusqu'aux cadres du parti |
| Le **Goulag** | Le système concentrationnaire |

## L'Italie de Mussolini
Parti unique, chemises noires, culte du *Duce*, encadrement de la jeunesse par les *Balilla*, conquête de l'Éthiopie en 1935.

## L'Allemagne d'Hitler
| L'étape | Sa date | Son contenu |
| Les pleins pouvoirs | 1933 | En quelques semaines |
| Les **lois de Nuremberg** | **1935** | Elles privent les Juifs de la citoyenneté |
| La **Nuit de Cristal** | Novembre **1938** | La violence déchaînée |
| Gestapo, SS, premiers camps (Dachau) | Dès 1933 | La terreur installée |
| Le **réarmement** | Années 1930 | Il prépare la guerre |

> Trois régimes, une même ambition : fabriquer un « homme nouveau » et faire disparaître l'individu dans la masse.

## Des différences réelles
| Le régime | Son but |
| Le communisme stalinien | Une société sans classes, par la lutte des classes |
| Le nazisme | La **race** et la conquête d'un « espace vital » |

> Les moyens se ressemblent, les buts s'opposent.`,
          },
          questions: [
            ['Qu’est-ce qui caractérise un régime totalitaire ?', ['Il veut contrôler la société entière et transformer l’homme', 'Il limite son action à l’économie', 'Il organise des élections libres', 'Il respecte l’indépendance de la justice'], 0, 'Travail, loisirs, famille et pensée sont encadrés.'],
            ['Quelle famine frappe l’Ukraine en 1932-1933 ?', ['L’Holodomor', 'La Grande Famine irlandaise', 'La famine du Bengale', 'La famine de la Volga de 1891'], 0, 'Elle résulte de la collectivisation forcée des terres.'],
            ['Comment s’appelle le système de camps soviétique ?', ['Le Goulag', 'Le Kolkhoze', 'Le Komintern', 'Le Politburo'], 0, 'Les Grandes Purges de 1936-1938 y envoient des millions de personnes.'],
            ['En quelle année Mussolini arrive-t-il au pouvoir en Italie ?', ['1922', '1917', '1933', '1936'], 0, 'La marche sur Rome lui ouvre la présidence du Conseil.'],
            ['Quand Hitler devient-il chancelier d’Allemagne ?', ['Le 30 janvier 1933', 'Le 1er septembre 1939', 'Le 9 novembre 1918', 'Le 30 avril 1945'], 0, 'Il obtient les pleins pouvoirs dans les semaines qui suivent.'],
            ['Que font les lois de Nuremberg de 1935 ?', ['Elles privent les Juifs de la citoyenneté allemande', 'Elles instaurent le suffrage universel', 'Elles interdisent le réarmement', 'Elles créent la Société des Nations'], 0, 'L’antisémitisme devient une législation d’État.'],
            ['Qu’est-ce que la Nuit de Cristal de novembre 1938 ?', ['Un pogrom organisé contre les Juifs d’Allemagne', 'Une manifestation ouvrière à Berlin', 'Un défilé de la jeunesse hitlérienne', 'Une conférence internationale sur la paix'], 0, 'Synagogues incendiées, commerces saccagés, arrestations massives.'],
            ['Le nazisme et le stalinisme poursuivent exactement les mêmes buts.', ['Vrai', 'Faux'], 1, 'Les moyens se ressemblent, mais l’un se fonde sur la race, l’autre sur la classe.'],
          ],
        },
        {
          titre: 'La France durant l’entre-deux-guerres',
          axe: 'L’Europe, un théâtre majeur des guerres totales (1914-1945)',
          lecon: {
            titre: 'Une République ébranlée, du deuil au Front populaire',
            cours: `Sortie victorieuse mais saignée de la Grande Guerre, la France traverse la reconstruction, la crise, puis une profonde crise politique.

## Le poids de la guerre
| Le chiffre ou le fait | Sa portée |
| **1,4 million** de morts | Chaque commune élève son **monument aux morts** |
| Des régions dévastées | Nord et Est reconstruits |
| Une dette immense | Elle pèse sur les finances |
| Les anciens combattants | Ils s'organisent ; les « gueules cassées » rappellent le prix payé |

Les **années 1920** apportent une relative prospérité et l'espoir d'une paix durable — accords de Locarno, 1925.

## La crise des années 1930
| L'effet | Sa manifestation |
| L'arrivée de la crise | **1931-1932**, venue des États-Unis |
| L'économie | Chute de la production, chômage, faillites agricoles |
| La politique | Les gouvernements se succèdent sans stabilité |
| La confiance | Elle s'effrite envers la République |

## Le 6 février 1934
| L'élément | Le détail |
| Les acteurs | Les **ligues d'extrême droite** : Croix-de-Feu, Action française, Jeunesses patriotes |
| Le lieu | Devant la Chambre des députés |
| Le bilan | Une quinzaine de morts |
| La lecture à gauche | Une tentative de coup de force **antiparlementaire** |

> Le 6 février 1934 est le déclencheur : la peur du fascisme fait naître l'union des gauches.

## Le Front populaire
| L'élément | Le détail |
| La coalition | **SFIO**, **radicaux**, **communistes** |
| La victoire | Élections de **mai 1936** |
| Le chef du gouvernement | **Léon Blum** |
| Le contexte | Une immense vague de grèves avec occupation d'usines |

Les **accords Matignon** du 7 juin 1936 :

| La mesure | Son contenu |
| Les **salaires** | Hausse d'environ 12 % |
| Les **conventions collectives** | Et la reconnaissance des délégués du personnel |
| Le temps de travail | La **semaine de 40 heures** |
| Les **congés payés** | **Deux semaines** |

S'y ajoutent la scolarité obligatoire jusqu'à 14 ans et un sous-secrétariat aux Sports et Loisirs.

## Un héritage durable
Le Front populaire se défait dès 1938, miné par les divisions, la crise et la guerre d'Espagne.

> Mais les congés payés, les 40 heures et les conventions collectives marquent durablement la société — et le mot « vacances » change de sens pour des millions de familles.`,
          },
          questions: [
            ['Combien de morts la Première Guerre mondiale coûte-t-elle à la France ?', ['Environ 1,4 million', 'Environ 400 000', 'Environ 3 millions', 'Environ 700 000'], 0, 'Chaque commune élève un monument aux morts.'],
            ['Quand la crise économique mondiale atteint-elle la France ?', ['En 1931-1932', 'Dès octobre 1929', 'En 1936', 'En 1925'], 0, 'Elle y arrive avec deux ans de décalage sur les États-Unis.'],
            ['Que se passe-t-il le 6 février 1934 à Paris ?', ['Des ligues d’extrême droite manifestent devant la Chambre des députés', 'Le Front populaire remporte les élections', 'Léon Blum est nommé président du Conseil', 'La France signe les accords de Locarno'], 0, 'L’affrontement fait une quinzaine de morts.'],
            ['Quelles forces composent le Front populaire ?', ['Socialistes, radicaux et communistes', 'Radicaux et ligues nationalistes', 'Communistes et Croix-de-Feu', 'Socialistes et monarchistes'], 0, 'L’union naît de la peur du fascisme après février 1934.'],
            ['Qui dirige le gouvernement du Front populaire en 1936 ?', ['Léon Blum', 'Édouard Daladier', 'Maurice Thorez', 'Raymond Poincaré'], 0, 'Il est le premier socialiste président du Conseil.'],
            ['Quelle durée hebdomadaire de travail les accords de 1936 instaurent-ils ?', ['40 heures', '35 heures', '48 heures', '44 heures'], 0, 'Elle accompagne les congés payés et les conventions collectives.'],
            ['Combien de semaines de congés payés le Front populaire accorde-t-il ?', ['Deux semaines', 'Une semaine', 'Quatre semaines', 'Cinq semaines'], 0, 'C’est la mesure la plus emblématique de 1936.'],
            ['Les accords Matignon prévoient une hausse générale des salaires.', ['Vrai', 'Faux'], 0, 'Environ 12 %, en plus des conventions collectives.'],
          ],
        },
        {
          titre: 'La Seconde Guerre mondiale : une guerre d’anéantissement',
          axe: 'L’Europe, un théâtre majeur des guerres totales (1914-1945)',
          lecon: {
            titre: '1939-1945 : une guerre qui vise des peuples',
            cours: `La Seconde Guerre mondiale dépasse la guerre totale : elle devient une guerre d'anéantissement, où l'ennemi n'est plus une armée à battre mais un peuple à détruire.

Dates : **1er septembre 1939 – 2 septembre 1945**.

## Les grandes étapes
| La période | Ce qui s'y passe |
| **1939-1941** | Les victoires de l'Axe : Pologne, **Blitzkrieg**, défaite française de juin 1940, bataille d'Angleterre, invasion de l'URSS (Barbarossa, juin 1941) |
| **1941-1942** | La **mondialisation** : **Pearl Harbor**, 7 décembre 1941, fait entrer les États-Unis |
| **1942-1943** | Le **tournant** : Stalingrad, El-Alamein, Midway, Guadalcanal |
| **1943-1945** | La victoire alliée : Sicile, **Normandie** (6 juin 1944), Provence, Paris ; capitulation allemande le **8 mai 1945** ; **Hiroshima** et **Nagasaki** (6 et 9 août) ; capitulation japonaise le 2 septembre |

## Une guerre d'anéantissement
| Le fait | Son contenu |
| La guerre idéologique à l'Est | Populations slaves jugées inférieures, prisonniers soviétiques laissés mourir par millions, villages détruits |
| Les **bombardements massifs** | Londres, Coventry, Dresde, Tokyo |
| L'arme **nucléaire** | Employée deux fois : elle change la nature même de la guerre |

## La Shoah
| L'étape | Sa date | Son contenu |
| La « Shoah par balles » | Dès **1941** | Les **Einsatzgruppen** fusillent à l'Est : Babi Yar |
| La conférence de **Wannsee** | Janvier **1942** | Elle organise la déportation |
| Les **camps d'extermination** | 1942-1944 | Auschwitz-Birkenau, Treblinka, Sobibor |

| La victime | Le bilan |
| Les **Juifs d'Europe** | Environ **5 à 6 millions** assassinés |
| Les **Tsiganes** | Entre 200 000 et 500 000 |

> Un **camp de concentration** enferme et fait travailler jusqu'à la mort ; un **camp d'extermination** est conçu pour tuer dès l'arrivée. La distinction est essentielle.

## Un bilan sans précédent
| Le chiffre ou le fait | Sa valeur |
| Les morts | **50 à 60 millions** |
| Leur composition | Une **majorité de civils** — l'inverse de 1914-1918 |
| L'**ONU** | Créée en juin 1945 |
| Le procès de **Nuremberg** | Il invente la notion de **crime contre l'humanité** |`,
          },
          questions: [
            ['Quelle date marque le début de la Seconde Guerre mondiale en Europe ?', ['Le 1er septembre 1939', 'Le 3 septembre 1939', 'Le 10 mai 1940', 'Le 22 juin 1941'], 0, 'L’Allemagne envahit la Pologne ; France et Royaume-Uni déclarent la guerre deux jours plus tard.'],
            ['Quel événement fait entrer les États-Unis dans le conflit ?', ['L’attaque de Pearl Harbor', 'La bataille de Stalingrad', 'Le débarquement de Normandie', 'L’invasion de la Pologne'], 0, 'Le 7 décembre 1941, la flotte américaine du Pacifique est attaquée.'],
            ['Quelle bataille marque le tournant du front de l’Est ?', ['Stalingrad', 'Verdun', 'La Marne', 'Dunkerque'], 0, 'La VIe armée allemande y capitule en février 1943.'],
            ['Quelle date correspond au débarquement de Normandie ?', ['6 juin 1944', '8 mai 1945', '15 août 1944', '11 novembre 1943'], 0, 'L’opération Overlord ouvre un second front à l’Ouest.'],
            ['Que décide la conférence de Wannsee en janvier 1942 ?', ['L’organisation de la déportation vers les camps d’extermination', 'La création de la Société des Nations', 'La capitulation de l’Italie', 'Le partage de l’Allemagne en zones'], 0, 'Elle planifie administrativement la « solution finale ».'],
            ['Quelle différence entre camp de concentration et camp d’extermination ?', ['Le premier enferme et fait travailler, le second est conçu pour tuer dès l’arrivée', 'Le premier est en Allemagne, le second en Pologne', 'Le premier est militaire, le second civil', 'Il n’y a aucune différence'], 0, 'La distinction est essentielle pour comprendre la Shoah.'],
            ['Quel bilan humain la Seconde Guerre mondiale laisse-t-elle ?', ['Entre 50 et 60 millions de morts, en majorité des civils', 'Environ 10 millions de morts, en majorité des soldats', 'Environ 20 millions de morts, uniquement militaires', 'Moins de 5 millions de morts'], 0, 'C’est l’inverse du rapport de 1914-1918.'],
            ['Le procès de Nuremberg invente la notion de crime contre l’humanité.', ['Vrai', 'Faux'], 0, 'Elle entre à cette occasion dans le droit international.'],
          ],
        },
        {
          titre: 'La France de Vichy (1940-1944)',
          axe: 'L’Europe, un théâtre majeur des guerres totales (1914-1945)',
          lecon: {
            titre: 'Défaite, collaboration, Résistance',
            cours: `En juin 1940, l'armée française s'effondre en six semaines. La République laisse place à l'État français.

## L'effondrement
| La date | L'événement |
| **17 juin 1940** | **Pétain** annonce qu'il faut « cesser le combat » |
| **22 juin 1940** | L'armistice est signé |
| **10 juillet 1940** | L'Assemblée nationale lui accorde les pleins pouvoirs |

La capitale de l'**État français** est **Vichy**.

## Un régime autoritaire
| La mesure | Son contenu |
| La devise | « **Travail, Famille, Patrie** » |
| Le Parlement | Il ne siège plus |
| Partis et syndicats | Dissous |
| La presse | Censurée |
| Le **culte du Maréchal** | Organisé |
| La **Révolution nationale** | Retour à la terre, à l'ordre, à la religion |

Elle désigne des responsables de la défaite : la République, les communistes, les étrangers, les Juifs.

## L'antisémitisme d'État
| La mesure | Sa date | Son contenu |
| Le **statut des Juifs** | **3 octobre 1940**, aggravé en juin 1941 | Exclusion de la fonction publique, de l'enseignement, de la presse |
| La **rafle du Vél' d'Hiv'** | 16-17 juillet **1942** | Menée par la **police française** : plus de 13 000 personnes, dont plus de 4 000 enfants |
| Le bilan | — | Environ **75 000 Juifs** déportés de France ; moins de 3 % reviennent |

> Aucune autorité allemande n'avait exigé le statut des Juifs.

## La collaboration
| Sa forme | Son contenu |
| **Politique** | L'entrevue de **Montoire**, 24 octobre 1940 |
| **Économique** | Livraisons, puis le **STO** en 1943 |
| **Policière** | La **Milice**, créée en janvier 1943 |
| **Idéologique** | Propagande et dénonciation |

> Une **collaboration d'État**, décidée à Vichy, s'ajoute à la contrainte de l'occupation. La France a mis un demi-siècle à le reconnaître officiellement : discours de Jacques Chirac, 1995.

## La Résistance
| La date | L'acte |
| **18 juin 1940** | De Gaulle appelle de Londres à poursuivre le combat : naissance de la **France libre** |
| 1941-1943 | Réseaux et mouvements : Combat, Libération, Franc-Tireur — journaux clandestins, renseignement, sabotage |
| **27 mai 1943** | **Jean Moulin** réunit le **Conseil national de la Résistance** |
| 1944 | Le CNR adopte un programme de réformes |

## La Libération
| La date | L'événement |
| **21 avril 1944** | Une ordonnance accorde le **droit de vote aux femmes** |
| Août 1944 | Paris est libéré |
| — | Le **GPRF** rétablit la légalité républicaine |`,
          },
          questions: [
            ['Quelle devise remplace « Liberté, Égalité, Fraternité » sous Vichy ?', ['Travail, Famille, Patrie', 'Ordre, Force, Nation', 'Terre, Peuple, Chef', 'Honneur, Patrie, Discipline'], 0, 'Elle résume le programme de la Révolution nationale.'],
            ['Quand l’Assemblée nationale accorde-t-elle les pleins pouvoirs à Pétain ?', ['Le 10 juillet 1940', 'Le 18 juin 1940', 'Le 22 juin 1940', 'Le 3 octobre 1940'], 0, 'L’État français succède alors à la IIIe République.'],
            ['Qu’instaure le statut des Juifs du 3 octobre 1940 ?', ['Leur exclusion de la fonction publique, de l’enseignement et de la presse', 'Leur obligation de porter l’étoile jaune', 'Leur déportation immédiate', 'La confiscation de tous leurs biens'], 0, 'Vichy le promulgue sans qu’aucune autorité allemande ne l’ait exigé.'],
            ['Qui mène la rafle du Vél’ d’Hiv’ des 16-17 juillet 1942 ?', ['La police française', 'La Wehrmacht', 'La Gestapo seule', 'La Milice'], 0, 'Plus de 13 000 personnes sont arrêtées, dont plus de 4 000 enfants.'],
            ['Que met en place le STO en 1943 ?', ['L’envoi obligatoire de travailleurs français en Allemagne', 'Un service militaire dans l’armée de Vichy', 'Un impôt exceptionnel sur les entreprises', 'Un contrôle des prix agricoles'], 0, 'Il pousse de nombreux jeunes à rejoindre les maquis.'],
            ['Quel appel de Gaulle lance-t-il depuis Londres le 18 juin 1940 ?', ['L’appel à poursuivre le combat', 'L’appel à signer l’armistice', 'L’appel au rationnement', 'L’appel à l’insurrection de Paris'], 0, 'C’est l’acte de naissance de la France libre.'],
            ['Quel rôle joue Jean Moulin dans la Résistance ?', ['Il unifie les mouvements au sein du Conseil national de la Résistance', 'Il commande les Forces françaises libres', 'Il dirige le gouvernement de Vichy', 'Il négocie l’armistice de 1940'], 0, 'Le CNR se réunit pour la première fois le 27 mai 1943.'],
            ['Les Françaises obtiennent le droit de vote par l’ordonnance du 21 avril 1944.', ['Vrai', 'Faux'], 0, 'Elles votent pour la première fois aux municipales d’avril 1945.'],
          ],
        },

        // ===================================================================
        // Chapitre 2 : Le monde depuis 1945
        // ===================================================================
        {
          titre: 'La décolonisation',
          axe: 'Le monde depuis 1945',
          lecon: {
            titre: 'La fin des empires coloniaux',
            cours: `En 1945, l'Europe domine encore une grande partie de l'Afrique et de l'Asie. En 1975, presque tous ces territoires sont indépendants.

## Pourquoi maintenant
| La cause | Son contenu |
| L'**affaiblissement** des puissances coloniales | Elles sortent épuisées de la guerre |
| La **participation** des colonies à la victoire | Elles réclament une contrepartie |
| Les mouvements **nationalistes** | Organisés autour de chefs souvent formés en Europe |
| Les **deux Grands** | États-Unis et URSS, pour des raisons opposées, sont hostiles aux empires |
| La **Charte de l'ONU** | Elle consacre le droit des peuples à disposer d'eux-mêmes |

## Deux voies
| La voie | Ses exemples | Son coût |
| **Négociée** | L'**Inde** en **1947** (Gandhi, Nehru) ; l'Afrique noire française en **1960** | La partition sanglante entre Inde et Pakistan |
| **Par la guerre** | L'**Indochine** (1946-1954), l'**Algérie** (1954-1962) | Diên Biên Phu ; huit ans de guerre |

## La guerre d'Algérie
| La date | L'événement |
| **1er novembre 1954** | La « Toussaint rouge », à l'initiative du **FLN** |
| 1954-1962 | Attentats, guérilla, torture, déplacements de populations |
| **1958** | La guerre provoque la chute de la IVe République et le retour de **de Gaulle** |
| **18 mars 1962** | Les **accords d'Évian** |
| **5 juillet 1962** | L'indépendance |

Suivent l'exode de près d'un million de **pieds-noirs** et l'abandon de nombreux **harkis**.

## Le tiers-monde
| L'élément | Sa date | Son contenu |
| La conférence de **Bandung** | **1955** | Vingt-neuf pays d'Asie et d'Afrique refusent de choisir entre les blocs et condamnent le colonialisme |
| Le mouvement des **non-alignés** | 1961 | Il s'organise |
| Le mot « **tiers-monde** » | Forgé par Alfred Sauvy en 1952 | Il désigne ces pays pauvres et nouvellement indépendants |

> L'indépendance politique ne suffit pas : frontières héritées, économies dépendantes, instabilité politique pèsent longtemps sur les nouveaux États.`,
          },
          questions: [
            ['Quel principe de la Charte de l’ONU sert d’appui aux mouvements de décolonisation ?', ['Le droit des peuples à disposer d’eux-mêmes', 'La liberté de circulation', 'La souveraineté des empires', 'L’égalité devant l’impôt'], 0, 'Il est inscrit dans la Charte signée en 1945.'],
            ['En quelle année l’Inde devient-elle indépendante ?', ['1947', '1945', '1954', '1960'], 0, 'La partition avec le Pakistan s’accompagne de violences massives.'],
            ['Quelle défaite met fin à la guerre d’Indochine en 1954 ?', ['Diên Biên Phu', 'Sedan', 'Dunkerque', 'Alger'], 0, 'Elle conduit aux accords de Genève.'],
            ['Quelles dates encadrent la guerre d’Algérie ?', ['1954-1962', '1945-1954', '1956-1968', '1958-1962'], 0, 'Elle commence le 1er novembre 1954, la Toussaint rouge.'],
            ['Quel accord conduit à l’indépendance de l’Algérie ?', ['Les accords d’Évian', 'Les accords de Genève', 'Les accords de Matignon', 'Les accords de Yalta'], 0, 'Signés le 18 mars 1962, ils sont suivis d’un référendum.'],
            ['Pourquoi 1960 est-elle appelée « l’année de l’Afrique » ?', ['Dix-sept pays africains accèdent à l’indépendance cette année-là', 'La conférence de Bandung s’y tient', 'L’ONU y est créée', 'La guerre d’Algérie s’y termine'], 0, 'La plupart des colonies françaises d’Afrique noire deviennent indépendantes.'],
            ['Que proclame la conférence de Bandung en 1955 ?', ['Le refus de choisir entre les deux blocs et la condamnation du colonialisme', 'La création du Pacte de Varsovie', 'La fin de la guerre de Corée', 'La création de la CEE'], 0, 'Vingt-neuf pays d’Asie et d’Afrique y participent.'],
            ['L’indépendance politique a suffi à régler les difficultés économiques des nouveaux États.', ['Vrai', 'Faux'], 1, 'Frontières héritées, dépendance économique et instabilité ont longtemps pesé.'],
          ],
        },
        {
          titre: 'Le monde durant la guerre froide (1947-1962)',
          axe: 'Le monde depuis 1945',
          lecon: {
            titre: 'Deux blocs, une paix impossible et une guerre improbable',
            cours: `Alliés contre l'Allemagne jusqu'en 1945, les États-Unis et l'URSS deviennent adversaires dès 1947.

## La rupture de 1947
| Le camp | Sa doctrine | Son instrument |
| Les **États-Unis** | La **doctrine Truman**, mars 1947 : aider tout pays menacé par le communisme — l'**endiguement** | Le **plan Marshall**, une aide économique massive |
| L'**URSS** | La doctrine **Jdanov** : le monde en deux camps | Le **Kominform** |

> Churchill avait annoncé dès 1946 qu'un « **rideau de fer** » était tombé à travers l'Europe.

## Berlin, symbole du monde coupé en deux
| La date | L'événement |
| Juin 1948 – mai 1949 | Le **blocus de Berlin** ; les Alliés ravitaillent par un **pont aérien** |
| **1949** | Naissance de la **RFA** et de la **RDA** ; création de l'**OTAN** |
| **1955** | Le **pacte de Varsovie** |
| **12-13 août 1961** | Le **mur de Berlin**, pour arrêter les départs vers l'Ouest |

## Des guerres par procuration
| Le conflit | Ses dates | Son issue |
| La **guerre de Corée** | 1950-1953 | La péninsule figée au 38e parallèle |
| L'**Indochine** | 1946-1954 | La défaite française |
| Coups d'État et régimes soutenus | En permanence | Amérique latine, Afrique, Moyen-Orient |

## La crise de Cuba
| L'étape | Ce qui se passe |
| Le déclencheur | Des missiles soviétiques installés à Cuba, à 150 km des côtes américaines |
| La réponse | **Kennedy** impose un **blocus naval** |
| L'issue, après treize jours | **Khrouchtchev** retire les missiles ; les États-Unis s'engagent à ne pas envahir Cuba et retirent discrètement leurs missiles de Turquie |
| La suite | Un « téléphone rouge » est installé |

Octobre **1962** : la crise la plus dangereuse du siècle.

## L'équilibre de la terreur
| Le fait | Sa conséquence |
| L'URSS a l'arme nucléaire depuis **1949** | Les deux camps peuvent se détruire |
| La **dissuasion** | La guerre directe devient suicidaire |

> Raymond Aron le résume : « **paix impossible, guerre improbable** ».`,
          },
          questions: [
            ['Qu’annonce la doctrine Truman en mars 1947 ?', ['L’aide américaine à tout pays menacé par le communisme', 'Le retrait des troupes américaines d’Europe', 'La création de l’ONU', 'Le désarmement nucléaire'], 0, 'C’est la politique dite d’endiguement.'],
            ['Quel plan apporte une aide économique massive à l’Europe de l’Ouest ?', ['Le plan Marshall', 'Le plan Schuman', 'Le plan Dawes', 'Le plan Monnet'], 0, 'L’URSS le refuse et l’interdit à ses satellites.'],
            ['Comment les Alliés répondent-ils au blocus de Berlin en 1948-1949 ?', ['Par un pont aérien', 'Par une offensive terrestre', 'Par un embargo sur l’URSS', 'En abandonnant la ville'], 0, 'Berlin-Ouest est ravitaillée par avion pendant onze mois.'],
            ['Quelles alliances militaires s’opposent pendant la guerre froide ?', ['L’OTAN et le pacte de Varsovie', 'La SDN et le Kominform', 'La CEE et le CAEM', 'L’ONU et l’OTAN'], 0, 'L’OTAN date de 1949, le pacte de Varsovie de 1955.'],
            ['Quand le mur de Berlin est-il construit ?', ['Dans la nuit du 12 au 13 août 1961', 'En juin 1948', 'En octobre 1962', 'En mai 1949'], 0, 'Il vise à arrêter les départs vers l’Ouest.'],
            ['Quel conflit fige une péninsule au 38e parallèle entre 1950 et 1953 ?', ['La guerre de Corée', 'La guerre du Vietnam', 'La guerre d’Indochine', 'La guerre d’Afghanistan'], 0, 'La frontière est toujours en place aujourd’hui.'],
            ['Comment se règle la crise des missiles de Cuba en 1962 ?', ['Khrouchtchev retire les missiles contre l’engagement américain de ne pas envahir Cuba', 'Les États-Unis envahissent Cuba', 'L’ONU place l’île sous tutelle', 'L’URSS annexe Cuba'], 0, 'Un téléphone rouge est ensuite installé entre les deux capitales.'],
            ['Les deux superpuissances se sont affrontées directement sur un champ de bataille.', ['Vrai', 'Faux'], 1, 'La dissuasion nucléaire les en a dissuadées : « paix impossible, guerre improbable ».'],
          ],
        },
        {
          titre: 'Le monde durant la guerre froide (1963-1991)',
          axe: 'Le monde depuis 1945',
          lecon: {
            titre: 'De la détente à l’effondrement du bloc de l’Est',
            cours: `Après la peur d'octobre 1962, les deux blocs cherchent à encadrer leur rivalité — sans y renoncer.

## Trois temps
| La période | Son nom | Son climat |
| 1963-1975 | La **détente** | Les traités se multiplient |
| 1975-1985 | La **guerre fraîche** | La tension repart |
| 1985-1991 | L'**effondrement** | Le bloc de l'Est se défait |

## La détente
| L'accord | Sa date | Son objet |
| Interdiction des essais atmosphériques | 1963 | Le nucléaire |
| Traité de **non-prolifération** | 1968 | Limiter le nombre de puissances nucléaires |
| **SALT I** | 1972 | Les armements stratégiques |
| L'*Ostpolitik* de Willy Brandt | Années 1970 | La reconnaissance mutuelle des deux Allemagnes |
| L'acte final d'**Helsinki** | 1975 | Frontières et droits de l'homme |

> La coexistence n'efface pas la répression intérieure : **Prague, 1968**, où les chars du pacte de Varsovie écrasent le « socialisme à visage humain ».

## La guerre fraîche
| L'événement | Sa date |
| La défaite américaine au **Vietnam** | 1975 |
| L'**invasion de l'Afghanistan** par l'URSS | 1979 |
| La crise des **euromissiles** | Début des années 1980 |
| L'arrivée de **Reagan** | 1981 |

## L'URSS à bout de souffle
| La faiblesse | Son effet |
| L'économie **stagnante** | Pénuries, retard technologique |
| Le coût de l'armement et de l'Afghanistan | Un budget insoutenable |
| **Tchernobyl**, 1986 | La confiance dans le régime s'effondre |

En 1985, **Gorbatchev** lance la **perestroïka** — restructuration économique — et la **glasnost** — transparence.

## 1989, l'année charnière
| Le pays | Ce qui s'y passe |
| La **Pologne** | Solidarność |
| La **Hongrie** | L'ouverture de la frontière |
| La **Tchécoslovaquie** | La « révolution de velours » |
| La **RDA** | Le **mur de Berlin tombe le 9 novembre 1989** |

L'Allemagne est réunifiée le 3 octobre 1990.

> La chute du Mur n'est pas une victoire militaire : c'est un régime qui cesse d'être cru par ses propres populations.

## 1991, la fin de l'URSS
| La date | L'événement |
| Juillet 1991 | Le pacte de Varsovie est dissous |
| Août 1991 | Un putsch échoue |
| **25 décembre 1991** | L'**URSS disparaît** |

Les États-Unis restent seule superpuissance : on parle d'un monde **unipolaire**.`,
          },
          questions: [
            ['Que désigne la « détente » entre 1963 et 1975 ?', ['Une période d’accords limitant la rivalité sans y renoncer', 'La fin définitive de la guerre froide', 'L’alliance militaire des deux blocs', 'Le désarmement total des deux camps'], 0, 'SALT I, non-prolifération et Helsinki en sont les jalons.'],
            ['Que se passe-t-il à Prague en 1968 ?', ['Les chars du pacte de Varsovie écrasent le Printemps de Prague', 'Le mur de Berlin est construit', 'L’URSS quitte l’Afghanistan', 'La Tchécoslovaquie rejoint l’OTAN'], 0, 'Le « socialisme à visage humain » est brisé.'],
            ['Quel événement de 1979 relance la tension entre les blocs ?', ['L’invasion de l’Afghanistan par l’URSS', 'La chute de Saigon', 'La signature des accords SALT I', 'La catastrophe de Tchernobyl'], 0, 'Elle ouvre la période dite de la guerre fraîche.'],
            ['Quelles réformes Gorbatchev lance-t-il à partir de 1985 ?', ['La perestroïka et la glasnost', 'Les plans quinquennaux', 'La collectivisation et les purges', 'Le Kominform et la doctrine Jdanov'], 0, 'Restructuration économique et transparence.'],
            ['Quelle catastrophe de 1986 ébranle la confiance dans le régime soviétique ?', ['Tchernobyl', 'Bhopal', 'Fukushima', 'Seveso'], 0, 'L’accident nucléaire et son silence initial marquent les esprits.'],
            ['Quand le mur de Berlin tombe-t-il ?', ['Le 9 novembre 1989', 'Le 3 octobre 1990', 'Le 25 décembre 1991', 'Le 13 août 1961'], 0, 'L’Allemagne est réunifiée moins d’un an plus tard.'],
            ['Quand l’URSS disparaît-elle officiellement ?', ['Le 25 décembre 1991', 'Le 9 novembre 1989', 'En juillet 1991', 'En mars 1985'], 0, 'Le pacte de Varsovie avait été dissous quelques mois plus tôt.'],
            ['Après 1991, on qualifie le monde d’unipolaire, dominé par les États-Unis.', ['Vrai', 'Faux'], 0, 'Ils restent la seule superpuissance militaire et économique.'],
          ],
        },
        {
          titre: 'La construction européenne',
          axe: 'Le monde depuis 1945',
          lecon: {
            titre: 'De la CECA à l’Union européenne',
            cours: `Après deux guerres nées en Europe, des responsables politiques cherchent à rendre la guerre entre voisins matériellement impossible.

## Les débuts
| La date | L'étape | Son contenu |
| **9 mai 1950** | La **déclaration Schuman**, inspirée par Jean Monnet | Mettre en commun le charbon et l'acier, matières premières de l'armement |
| **1951** | La **CECA** | Six pays : France, RFA, Italie, Belgique, Pays-Bas, Luxembourg |
| **25 mars 1957** | Le **traité de Rome**, qui crée la **CEE** | Marché commun : libre circulation des marchandises, personnes, services, capitaux ; la **PAC** |

## Les élargissements
| L'année | Le nombre de membres | Les entrants |
| 1957 | **6** | Les fondateurs |
| 1973 | 9 | Dont le Royaume-Uni |
| 1986 | 12 | Espagne, Portugal |
| 1995 | 15 | — |
| **2004** | **25** | Les pays d'Europe centrale et orientale |
| 2013 | 28 | Croatie |
| **2020** | **27** | Le Royaume-Uni part : le **Brexit** |

## L'approfondissement
| Le traité ou l'accord | Sa date | Son apport |
| **Schengen** | 1985, appliqué en 1995 | Fin des contrôles aux frontières intérieures |
| **Maastricht** | 1992 | L'**Union européenne**, la **citoyenneté européenne**, la monnaie unique programmée |
| L'**euro** | 1999, puis **1er janvier 2002** | Monnaie de compte, puis pièces et billets |
| **Lisbonne** | 2007 | Réforme des institutions, après le rejet du projet de Constitution en 2005 |

## Les institutions
| L'institution | Son rôle |
| Le **Parlement européen** | Élu au suffrage universel direct depuis **1979** |
| La **Commission** | Elle propose les textes et veille aux traités |
| Le **Conseil de l'Union** | Les ministres des États |
| Le **Conseil européen** | Les chefs d'État et de gouvernement |
| La **Cour de justice** | Elle tranche les litiges |

> Deux logiques cohabitent : la **supranationale**, où des décisions s'imposent aux États, et l'**intergouvernementale**, où les États décident ensemble. Tout l'équilibre européen tient dans ce dosage.

## Débats
| La critique | La défense |
| Un déficit démocratique | Un espace de **paix** |
| La lourdeur des décisions | La **libre circulation** |
| Les écarts économiques entre membres | Des **normes protectrices** et un poids commercial |`,
          },
          questions: [
            ['Quelle déclaration du 9 mai 1950 lance la construction européenne ?', ['La déclaration Schuman', 'Le traité de Rome', 'Le traité de Maastricht', 'La déclaration de Messine'], 0, 'Elle propose de mettre en commun le charbon et l’acier.'],
            ['Combien de pays fondent la CECA puis la CEE ?', ['Six', 'Neuf', 'Douze', 'Quatre'], 0, 'France, RFA, Italie, Belgique, Pays-Bas, Luxembourg.'],
            ['Que crée le traité de Rome de 1957 ?', ['La Communauté économique européenne et le marché commun', 'L’euro', 'L’espace Schengen', 'Le Parlement européen'], 0, 'Il pose les quatre libertés de circulation.'],
            ['Que change le traité de Maastricht de 1992 ?', ['Il crée l’Union européenne et la citoyenneté européenne', 'Il crée la CECA', 'Il organise le Brexit', 'Il supprime la PAC'], 0, 'Il programme aussi la monnaie unique.'],
            ['Quand l’euro entre-t-il en circulation sous forme de pièces et billets ?', ['Le 1er janvier 2002', 'En 1999', 'En 1992', 'En 2007'], 0, 'Il existait comme monnaie de compte depuis 1999.'],
            ['Que permettent les accords de Schengen ?', ['La suppression des contrôles aux frontières intérieures', 'La création d’une armée européenne', 'L’adhésion automatique des pays candidats', 'L’harmonisation des impôts'], 0, 'Signés en 1985, ils s’appliquent à partir de 1995.'],
            ['Depuis quand le Parlement européen est-il élu au suffrage universel direct ?', ['Depuis 1979', 'Depuis 1957', 'Depuis 1992', 'Depuis 2004'], 0, 'C’est la seule institution européenne élue directement par les citoyens.'],
            ['Le Royaume-Uni a quitté l’Union européenne en 2020.', ['Vrai', 'Faux'], 0, 'L’Union est passée de 28 à 27 membres.'],
          ],
        },
        {
          titre: 'La géopolitique du monde actuel',
          axe: 'Le monde depuis 1945',
          lecon: {
            titre: 'Un monde multipolaire et ses conflits',
            cours: `Après 1991, on a cru à un monde simple, dominé par une seule puissance. Trente ans plus tard, le monde est multipolaire.

## Les pôles
| La puissance | Son atout principal |
| Les **États-Unis** | La première puissance militaire |
| La **Chine** | Économique, technologique, navale |
| La **Russie** | Elle réaffirme ses ambitions **par la force** |
| L'**Union européenne** | Son marché et ses **normes** |
| L'**Inde**, le **Brésil** | Des émergents qui revendiquent leur place |

## Le terrorisme international
| La date | L'événement |
| **11 septembre 2001** | Les attentats aux États-Unis |
| 2001, 2003 | Interventions en Afghanistan, puis en Irak |
| 2014-2019 | Essor puis recul de **Daech** |
| 2015-2016 | Attentats en France |

> Le terrorisme frappe des civils pour peser sur des sociétés entières.

## Les grands foyers de tension
| La région | Le conflit |
| **Proche et Moyen-Orient** | Conflit israélo-palestinien, guerre en Syrie, rivalités régionales |
| **Europe orientale** | Annexion de la Crimée en 2014, invasion de l'**Ukraine** en février 2022 |
| **Asie** | Tensions autour de Taïwan et en mer de Chine méridionale |
| **Sahel** | États fragiles, groupes armés, coups d'État |

## Les défis communs
| Le défi | Pourquoi il dépasse les États |
| Le **changement climatique** | Accord de Paris, 2015 |
| Les **migrations** | Elles traversent les frontières |
| Les **pandémies** | Covid-19 |
| La **cybersécurité** | Les attaques ignorent les territoires |
| La régulation du numérique et de l'IA | Les acteurs sont mondiaux |

> Les menaces sont devenues **transnationales** alors que les décisions restent **nationales** : c'est la principale difficulté de la gouvernance mondiale.

## Une gouvernance contestée
| L'acteur | Sa limite |
| L'**ONU** | Le **droit de veto** des cinq membres permanents bloque souvent l'action |
| G7, G20, OMC, ONG | Aucune autorité contraignante |

> Le débat sur la réforme du Conseil de sécurité est ouvert depuis des décennies.`,
          },
          questions: [
            ['Que signifie « monde multipolaire » ?', ['Plusieurs pôles de puissance coexistent', 'Une seule puissance domine', 'Deux blocs s’affrontent', 'Aucun État n’a de puissance militaire'], 0, 'C’est la situation qui succède à l’unipolarité des années 1990.'],
            ['Quel événement de 2001 ouvre une nouvelle séquence géopolitique ?', ['Les attentats du 11 septembre', 'L’invasion de l’Irak', 'La création de l’euro', 'L’élargissement de l’Union européenne'], 0, 'Ils entraînent l’intervention en Afghanistan.'],
            ['Quel territoire la Russie annexe-t-elle en 2014 ?', ['La Crimée', 'La Géorgie', 'La Moldavie', 'La Biélorussie'], 0, 'L’invasion de l’Ukraine suit en février 2022.'],
            ['Quel accord international sur le climat est signé en 2015 ?', ['L’accord de Paris', 'Le protocole de Kyoto', 'La convention de Genève', 'Le traité de Lisbonne'], 0, 'Il vise à contenir le réchauffement global.'],
            ['Qu’est-ce qui bloque souvent l’action du Conseil de sécurité de l’ONU ?', ['Le droit de veto des cinq membres permanents', 'L’absence de siège permanent', 'Le vote à la majorité simple', 'Le refus des ONG'], 0, 'Sa réforme est débattue depuis des décennies.'],
            ['Pourquoi parle-t-on de menaces transnationales ?', ['Elles dépassent les frontières alors que les décisions restent nationales', 'Elles ne concernent qu’un seul pays', 'Elles sont uniquement militaires', 'Elles sont traitées par l’ONU seule'], 0, 'Climat, pandémies et cybersécurité en sont les exemples.'],
            ['Quelle zone est marquée par des tensions autour de Taïwan ?', ['L’Asie orientale', 'L’Afrique sahélienne', 'L’Amérique centrale', 'L’Europe du Nord'], 0, 'La mer de Chine méridionale est un foyer de rivalités.'],
            ['La Chine est aujourd’hui une puissance économique et technologique de premier plan.', ['Vrai', 'Faux'], 0, 'Elle est l’un des principaux pôles du monde multipolaire.'],
          ],
        },

        // ===================================================================
        // Chapitre 3 : Françaises et Français dans une République repensée
        // ===================================================================
        {
          titre: '1944-1947 : refonder la République, redéfinir la démocratie',
          axe: 'Françaises et Français dans une République repensée',
          lecon: {
            titre: 'La IVe République et l’État providence',
            cours: `À la Libération, il ne s'agit pas de rétablir l'ordre d'avant-guerre mais de refonder la République sur de nouvelles bases.

Le programme du **Conseil national de la Résistance**, adopté en mars 1944 sous le titre *Les Jours heureux*, en fixe la feuille de route.

## Rétablir la légalité républicaine
| L'action | Son contenu |
| Le **GPRF**, dirigé par de Gaulle | Il rétablit les libertés |
| L'**épuration** | Légale par des cours de justice ; parfois sauvage dans les premières semaines |
| Le **droit de vote des femmes** | Ordonnance du **21 avril 1944** ; premier vote en avril 1945 |

## Les grandes réformes sociales
| La réforme | Son contenu |
| La **Sécurité sociale** | Ordonnances d'octobre 1945 : maladie, accidents du travail, vieillesse, famille |
| Les **nationalisations** | Renault, charbonnages, Banque de France, EDF-GDF, Air France |
| Les **comités d'entreprise** | Et le statut de la fonction publique |
| L'école publique et la recherche | Renforcées |

> L'idée directrice : protéger chacun contre les risques de l'existence, par la **solidarité nationale** plutôt que par la charité.

## La IVe République
| Le point | Son contenu |
| Son adoption | Par référendum en **octobre 1946**, après un premier projet rejeté |
| Son équilibre | L'essentiel du pouvoir à l'**Assemblée nationale** |
| Sa fragilité | Le gouvernement dépend d'une majorité instable |
| De Gaulle | Hostile à ce régime, il a démissionné dès **janvier 1946** |

## Réussites et faiblesses
| La réussite | La faiblesse |
| La reconstruction du pays | Plus de **vingt gouvernements en douze ans** |
| La construction européenne engagée | Les guerres coloniales : Indochine, puis Algérie |
| La modernisation économique | Le régime est emporté en **1958** |

## Un héritage vivant
Sécurité sociale, nationalisations, préambule de 1946 — droit au travail, à la santé, à l'instruction, égalité femmes-hommes.

> C'est le socle du modèle social français, encore discuté aujourd'hui.`,
          },
          questions: [
            ['Quel texte adopté en 1944 sert de feuille de route à la refondation ?', ['Le programme du Conseil national de la Résistance', 'La Charte de l’ONU', 'Le préambule de 1958', 'Les accords Matignon'], 0, 'Il est intitulé Les Jours heureux.'],
            ['Quand les Françaises votent-elles pour la première fois ?', ['En avril 1945', 'En 1944', 'En 1946', 'En 1936'], 0, 'L’ordonnance leur accordant le droit de vote date du 21 avril 1944.'],
            ['Quelle grande institution sociale est créée en octobre 1945 ?', ['La Sécurité sociale', 'Le RMI', 'Pôle emploi', 'Les allocations chômage'], 0, 'Elle couvre maladie, accidents du travail, vieillesse et famille.'],
            ['Quelles entreprises sont nationalisées à la Libération ?', ['Renault, les charbonnages, EDF-GDF, Air France', 'Peugeot, Michelin, Danone', 'Les banques privées uniquement', 'Aucune entreprise'], 0, 'L’État prend le contrôle de secteurs jugés stratégiques.'],
            ['Quand la Constitution de la IVe République est-elle adoptée ?', ['En octobre 1946', 'En 1944', 'En 1945', 'En 1958'], 0, 'Un premier projet avait été rejeté en mai 1946.'],
            ['Quelle est la principale faiblesse de la IVe République ?', ['L’instabilité ministérielle', 'L’absence d’élections', 'L’absence de Parlement', 'Le refus de la construction européenne'], 0, 'Plus de vingt gouvernements se succèdent en douze ans.'],
            ['Quel conflit emporte la IVe République en 1958 ?', ['La guerre d’Algérie', 'La guerre de Corée', 'La guerre d’Indochine', 'La crise de Suez'], 0, 'La crise du 13 mai 1958 ramène de Gaulle au pouvoir.'],
            ['De Gaulle a dirigé la IVe République pendant toute sa durée.', ['Vrai', 'Faux'], 1, 'Hostile à ce régime, il démissionne dès janvier 1946.'],
          ],
        },
        {
          titre: 'Les années de Gaulle (1958-1969)',
          axe: 'Françaises et Français dans une République repensée',
          lecon: {
            titre: 'Une République nouvelle et un pouvoir présidentiel',
            cours: `La crise du 13 mai 1958 en Algérie ramène de Gaulle au pouvoir. Une nouvelle Constitution est approuvée par référendum le 28 septembre 1958 : c'est la Ve République.

## Une Constitution qui renverse l'équilibre
| Le pouvoir présidentiel | Son fondement |
| Nommer le Premier ministre | La Constitution |
| **Dissoudre** l'Assemblée nationale | — |
| Soumettre un texte au **référendum** | Article 11 |
| Disposer de pouvoirs exceptionnels | Article 16 |

Le Parlement voit son domaine de compétence **délimité**.

| La date | La réforme |
| **1962** | Référendum : le président est élu au **suffrage universel direct** |
| **1965** | Première application |

> Le référendum devient l'instrument privilégié du général : il pose sa propre légitimité en jeu à chaque consultation.

## Régler la question algérienne
| L'étape | Sa date |
| Le passage à l'**autodétermination** | 1959-1961 |
| Le **putsch des généraux** | Avril 1961 |
| Les attentats de l'**OAS** | 1961-1962 |
| Les **accords d'Évian** | Mars 1962 |
| L'indépendance | **5 juillet 1962** |

## L'indépendance nationale
| L'acte | Sa date |
| Premier essai de l'**arme nucléaire** | 1960 |
| Le **traité de l'Élysée** avec l'Allemagne | 1963 |
| Reconnaissance de la **Chine populaire** | 1964 |
| Sortie du commandement intégré de l'**OTAN** | 1966 |
| Discours de Phnom Penh contre la guerre du Vietnam | 1966 |

## Mai 1968
| L'étape | Ce qui se passe |
| Le départ | Les universités, puis les lycées |
| L'extension | Une **grève générale** de plusieurs millions de salariés |
| Les **accords de Grenelle** | Forte hausse du SMIG, droits syndicaux |
| Au-delà des salaires | La contestation vise l'autorité, la famille, l'école, la place des femmes |

> La société française change plus vite que ses institutions.

## Le départ
| La date | L'événement |
| Juin 1968 | De Gaulle dissout et remporte les législatives |
| **Avril 1969** | Il **perd le référendum** sur la régionalisation et le Sénat |
| Le lendemain | Il démissionne ; Georges Pompidou lui succède |`,
          },
          questions: [
            ['Quel événement ramène de Gaulle au pouvoir en 1958 ?', ['La crise du 13 mai 1958 en Algérie', 'Mai 1968', 'La guerre d’Indochine', 'La crise de Suez'], 0, 'Il obtient les pleins pouvoirs pour rédiger une Constitution.'],
            ['Quand la Constitution de la Ve République est-elle approuvée ?', ['Le 28 septembre 1958', 'En octobre 1946', 'En 1962', 'En 1969'], 0, 'Elle est adoptée par référendum.'],
            ['Que change le référendum de 1962 ?', ['Le président est désormais élu au suffrage universel direct', 'Le Sénat est supprimé', 'Le président est élu par le Parlement', 'La durée du mandat passe à cinq ans'], 0, 'La première élection de ce type a lieu en 1965.'],
            ['Quel article permet au président de soumettre un texte au référendum ?', ['L’article 11', 'L’article 16', 'L’article 49', 'L’article 5'], 0, 'L’article 16 concerne les pouvoirs exceptionnels.'],
            ['Quelle décision marque la politique d’indépendance nationale en 1966 ?', ['La sortie du commandement intégré de l’OTAN', 'L’entrée dans le pacte de Varsovie', 'Le renoncement à l’arme nucléaire', 'La rupture avec l’Allemagne'], 0, 'La France conserve son alliance mais reprend son autonomie militaire.'],
            ['Quel traité franco-allemand est signé en 1963 ?', ['Le traité de l’Élysée', 'Le traité de Rome', 'Le traité de Maastricht', 'Le traité de Versailles'], 0, 'Il scelle la réconciliation entre les deux pays.'],
            ['Qu’accordent les accords de Grenelle en mai 1968 ?', ['Une forte hausse du SMIG et des droits syndicaux', 'La semaine de 35 heures', 'La retraite à 60 ans', 'La cinquième semaine de congés payés'], 0, 'La contestation dépassait toutefois les seules revendications salariales.'],
            ['De Gaulle démissionne après avoir perdu le référendum d’avril 1969.', ['Vrai', 'Faux'], 0, 'Il quitte le pouvoir dès le lendemain du scrutin.'],
          ],
        },
        {
          titre: 'Les Trente Glorieuses',
          axe: 'Françaises et Français dans une République repensée',
          lecon: {
            titre: '1945-1975 : trente ans qui transforment la société',
            cours: `L'expression Trente Glorieuses, forgée par Jean Fourastié, désigne les trois décennies de forte croissance qui suivent la guerre.

Dates : **1945 – 1973-1975**.

## Une croissance exceptionnelle
| Le moteur | Son apport |
| La **reconstruction** | Une demande énorme |
| Le **plan Marshall** | Des capitaux |
| La modernisation industrielle et la **planification** | Des gains de productivité |
| Le **marché commun** | Des débouchés |
| Le **baby-boom** et l'immigration | Une main-d'œuvre nombreuse |
| Un **pétrole bon marché** | Une énergie abondante |

Le rythme dépasse **5 % par an** en moyenne.

## La société de consommation
| Le changement | Sa manifestation |
| Le **pouvoir d'achat** | Il **double** |
| L'équipement des ménages | Réfrigérateur, machine à laver, télévision, automobile |
| Le commerce | Les **grandes surfaces** apparaissent |
| Le financement | Le **crédit** se répand |
| Les **congés payés** | Ils deviennent des départs en vacances |

## L'exode rural et l'urbanisation
| Le phénomène | Son effet |
| La chute de la population agricole | L'**exode rural** |
| L'extension des villes | Les **grands ensembles**, construits vite |
| Leur apport initial | Eau chaude, chauffage, salle de bains |
| Leur problème ultérieur | L'enclavement |

## Le travail et les femmes
| L'évolution | Son contenu |
| Le **salariat** | Il devient la norme |
| Le secteur **tertiaire** | Il dépasse l'industrie |
| Le **travail des femmes** | Il progresse fortement |

| La conquête juridique | Sa date |
| Ouvrir un compte bancaire sans l'accord du mari | **1965** |
| L'autorisation de la contraception, **loi Neuwirth** | **1967** |
| La dépénalisation de l'IVG, **loi Veil** | **1975** |

> La croissance ne fait pas que produire des biens : elle déplace les gens, change les familles et redessine les paysages.

## La fin d'un cycle
| Le fait | Sa conséquence |
| Le **choc pétrolier de 1973** | Ralentissement, inflation, **chômage de masse** |
| L'héritage positif | Équipement du pays, protection sociale, niveau de vie |
| L'héritage négatif | Une facture environnementale, des inégalités territoriales durables |`,
          },
          questions: [
            ['Qui a forgé l’expression « Trente Glorieuses » ?', ['Jean Fourastié', 'Alfred Sauvy', 'Raymond Aron', 'Fernand Braudel'], 0, 'Elle désigne les trois décennies de forte croissance après 1945.'],
            ['Quel taux de croissance annuel moyen caractérise cette période en France ?', ['Plus de 5 %', 'Environ 1 %', 'Environ 2 %', 'Plus de 10 %'], 0, 'Un rythme jamais retrouvé depuis.'],
            ['Qu’est-ce que le baby-boom ?', ['Une forte hausse des naissances après 1945', 'Une vague d’immigration', 'Une politique de logement social', 'Une réforme scolaire'], 0, 'Il fournit une main-d’œuvre nombreuse à la croissance.'],
            ['Quel équipement se diffuse massivement dans les foyers durant cette période ?', ['Le réfrigérateur, la machine à laver, la télévision', 'L’ordinateur personnel', 'Le téléphone portable', 'Le four à micro-ondes uniquement'], 0, 'La société de consommation se met en place.'],
            ['Que sont les grands ensembles ?', ['De vastes quartiers de logements construits rapidement', 'Des zones industrielles', 'Des centres commerciaux', 'Des complexes agricoles'], 0, 'Ils apportent d’abord un confort moderne inédit.'],
            ['Quelle loi de 1967 autorise la contraception en France ?', ['La loi Neuwirth', 'La loi Veil', 'La loi Haby', 'La loi Royer'], 0, 'La loi Veil dépénalise l’IVG en 1975.'],
            ['Quel événement met fin aux Trente Glorieuses ?', ['Le choc pétrolier de 1973', 'Mai 1968', 'La chute du mur de Berlin', 'Le traité de Rome'], 0, 'Il ouvre une période d’inflation et de chômage de masse.'],
            ['Le secteur tertiaire dépasse l’industrie durant les Trente Glorieuses.', ['Vrai', 'Faux'], 0, 'Le salariat devient la norme et les services se développent.'],
          ],
        },
        {
          titre: 'La Ve République à l’épreuve de la durée (1958-2012)',
          axe: 'Françaises et Français dans une République repensée',
          lecon: {
            titre: 'Alternances, cohabitations et réformes',
            cours: `Conçue pour un homme et une crise, la Ve République a duré : elle a résisté au départ de son fondateur, à l'alternance et à la cohabitation.

## Les présidences successives
| Le président | Ses dates | Ses marques |
| **Georges Pompidou** | 1969-1974 | Modernisation industrielle et urbaine |
| **Valéry Giscard d'Estaing** | 1974-1981 | Majorité à **18 ans**, **loi Veil** (1975), divorce par consentement mutuel, collège unique — et le premier choc du chômage |
| **François Mitterrand** | 1981-1995 | Première **alternance** de gauche, abolition de la **peine de mort** (1981), retraite à 60 ans, cinquième semaine de congés, décentralisation ; puis la rigueur en 1983 |
| **Jacques Chirac** | 1995-2007 | Fin du service militaire, **quinquennat** (2000), loi sur la laïcité à l'école (2004) |
| **Nicolas Sarkozy** | 2007-2012 | Réforme constitutionnelle de 2008, crise financière |

## L'alternance et la cohabitation
| Le phénomène | Ce qu'il montre |
| L'**alternance** de 1981 | La Constitution fonctionne quel que soit le camp au pouvoir |
| Les trois **cohabitations** — 1986-1988, 1993-1995, 1997-2002 | Le président garde la défense et les affaires étrangères, le gouvernement conduit la politique intérieure |

> Le **quinquennat** (2000) et l'inversion du calendrier électoral visent précisément à rendre la cohabitation improbable.

## La décentralisation
| La réforme | Sa date | Son contenu |
| Les lois **Defferre** | 1982 | Transfert de compétences aux communes, départements et régions |
| La révision constitutionnelle | 2003 | La République est déclarée **décentralisée** |

## Une société qui se transforme
| La réforme | Sa date |
| La **parité** | 1999-2000 |
| Le **PACS** | 1999 |
| La saisine élargie du **Conseil constitutionnel** | 1974 |
| La **question prioritaire de constitutionnalité** | 2008 |

S'y ajoute le poids grandissant du droit européen.

## Les débats permanents
Puissance du président, place du Parlement, abstention croissante, montée des extrêmes, rôle des corps intermédiaires.

> La Ve République vit depuis soixante ans avec le même débat : l'équilibre entre **efficacité** et **représentation**.`,
          },
          questions: [
            ['Quelle réforme majeure Valéry Giscard d’Estaing fait-il adopter dès 1974 ?', ['La majorité à 18 ans', 'L’abolition de la peine de mort', 'Le quinquennat', 'La retraite à 60 ans'], 0, 'La loi Veil sur l’IVG suit en 1975.'],
            ['Quelle grande réforme marque l’arrivée de François Mitterrand en 1981 ?', ['L’abolition de la peine de mort', 'Le passage au quinquennat', 'La fin du service militaire', 'La loi sur la laïcité à l’école'], 0, 'Elle est portée par Robert Badinter.'],
            ['Qu’est-ce qu’une cohabitation ?', ['Un président et un Premier ministre d’orientations politiques opposées', 'Deux présidents en exercice', 'Un gouvernement sans majorité', 'Une alliance entre deux partis de même camp'], 0, 'La France en a connu trois entre 1986 et 2002.'],
            ['Combien de temps dure le mandat présidentiel depuis la réforme de 2000 ?', ['Cinq ans', 'Sept ans', 'Quatre ans', 'Six ans'], 0, 'Le quinquennat rend la cohabitation improbable.'],
            ['Que transfèrent les lois Defferre de 1982 ?', ['Des compétences de l’État aux communes, départements et régions', 'Des compétences des régions vers l’État', 'Les impôts locaux à l’État', 'Le pouvoir législatif au président'], 0, 'C’est l’acte fondateur de la décentralisation.'],
            ['Qu’instaure la réforme constitutionnelle de 2008 en matière de justice ?', ['La question prioritaire de constitutionnalité', 'La suppression du Conseil constitutionnel', 'Le référendum obligatoire', 'La nomination des juges par le Parlement'], 0, 'Elle permet à tout justiciable de contester une loi appliquée à son cas.'],
            ['Que prouve l’alternance de 1981 ?', ['Que la Constitution fonctionne quel que soit le camp au pouvoir', 'Que le président doit être issu de la droite', 'Que le Parlement domine l’exécutif', 'Que la cohabitation est impossible'], 0, 'La Ve République survit à son fondateur et au changement de majorité.'],
            ['Pendant une cohabitation, le président conserve la défense et les affaires étrangères.', ['Vrai', 'Faux'], 0, 'Le gouvernement conduit alors la politique intérieure.'],
          ],
        },
      ],
    },
  ],
}
