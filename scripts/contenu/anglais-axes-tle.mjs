// Anglais — Terminale : LES SIX AXES DU PROGRAMME (repères culturels).
//
// POURQUOI CE FICHIER EXISTE. L'anglais de Terminale portait quatre chapitres
// présentés comme « les axes du programme de LV » :
//   « Faire société : unité et pluralité », « Environnements en mutation »,
//   « Art et débats d'idées », « Innovations et responsabilité ».
// Vérification faite au texte officiel, AUCUN des quatre n'est un axe du
// programme de terminale. Ce sont des intitulés reformulés, dont deux
// (« Faire société », « Environnements en mutation ») appartiennent à un AUTRE
// enseignement — la spécialité « Anglais, monde contemporain ». Un élève de
// terminale ouvrait donc sa matière sur quatre titres qui ne figurent nulle
// part dans son cours.
//
// LE PROGRAMME QUI FAIT FOI. Arrêté du 5 mai 2025, BO n° 22 du 29 mai 2025
// (MENE2504621A). Son article 4 fixe l'entrée en vigueur : seconde à la
// rentrée 2025-2026, PREMIÈRE ET TERMINALE À LA RENTRÉE 2026-2027 — celle que
// vivent les élèves de l'app. C'est donc ce programme-là, et non celui de 2019,
// qui décrit leur année. Il tient en six axes, et non huit comme en 2019 :
//   1. Espace privé et espace public
//   2. Territoire et mémoire
//   3. Fictions et réalités
//   4. Enjeux et formes de la communication
//   5. Citoyenneté et mondes virtuels
//   6. Le Royaume-Uni et ses nations
// Les intitulés sont repris MOT POUR MOT : c'est ce que l'élève lit sur le
// tableau de son professeur, et le seul repère commun entre l'app et son cours.
//
// CE QUE FAIT LA MIGRATION. Elle supprime les quatre faux axes (leurs leçons et
// quiz partent avec, par cascade), installe les six vrais aux positions 1 à 6,
// et RANGE les 24 fiches de grammaire déjà en base (migration 226) derrière eux,
// sous leurs quatre repères linguistiques. Le programme officiel est écrit
// exactement comme ça : des « repères culturels » (les axes) et des « repères
// linguistiques » (la langue). La page matière cesse d'aligner 28 lignes à plat.
//
// LE RÔLE DE CHAQUE AXE. Un axe n'est pas une leçon de langue : c'est une
// question que l'année pose et à laquelle l'élève doit savoir répondre en
// anglais, appuyé sur des faits du monde anglophone. Chaque cours donne donc la
// problématique du BO, les repères de civilisation qui la nourrissent, et le
// lexique que l'épreuve attend. Les énoncés interrogent EN FRANÇAIS, règle du
// dépôt ; les exemples et le lexique restent en anglais.
//
// ⚠️ Le slug reste `anglais` : la matière existe depuis 008. Le fichier
// s'appelle `anglais-axes-tle.mjs` pour dire ce qu'il couvre, à côté de
// `anglais-tle.mjs` (la grammaire, migration 226, DÉJÀ EXÉCUTÉE — ne jamais la
// régénérer). D'où la génération par `--modules`.

// Les quatre repères linguistiques de la migration 226, dans son ordre à elle.
// Sert au ménage ci-dessous : chaque fiche reçoit son axe et sa nouvelle place.
const GRAMMAIRE = [
  ['Les déterminants', 'Repères linguistiques — le groupe nominal'],
  ['Exprimer une quantité', 'Repères linguistiques — le groupe nominal'],
  ['Les adjectifs qualificatifs', 'Repères linguistiques — le groupe nominal'],
  ['Les verbes lexicaux et les auxiliaires', 'Repères linguistiques — le groupe verbal'],
  ['Les auxiliaires modaux', 'Repères linguistiques — le groupe verbal'],
  [
    'Les verbes à particule et les verbes prépositionnels',
    'Repères linguistiques — le groupe verbal',
  ],
  ['Infinitif et gérondif', 'Repères linguistiques — le groupe verbal'],
  ['Les adverbes', 'Repères linguistiques — le groupe verbal'],
  ['Le présent simple et le présent en BE + -ING', 'Repères linguistiques — les temps'],
  ['Le prétérit simple et le prétérit BE + -ING', 'Repères linguistiques — les temps'],
  [
    'Le present perfect et le present perfect BE + -ING',
    'Repères linguistiques — les temps',
  ],
  ['Le past perfect et le past perfect BE + -ING', 'Repères linguistiques — les temps'],
  ['Exprimer le futur et le conditionnel', 'Repères linguistiques — les temps'],
  ['Les questions', 'Repères linguistiques — la phrase'],
  ['La phrase exclamative', 'Repères linguistiques — la phrase'],
  ['Le comparatif et le superlatif', 'Repères linguistiques — la phrase'],
  ['Les subordonnées', 'Repères linguistiques — la phrase'],
  ['Exprimer la temporalité et la durée', 'Repères linguistiques — la phrase'],
  ['Exprimer la cause et le but', 'Repères linguistiques — la phrase'],
  [
    'Exprimer la condition, la concession et l’opposition',
    'Repères linguistiques — la phrase',
  ],
  ['Exprimer l’habitude', 'Repères linguistiques — la phrase'],
  ['Faire faire quelque chose à quelqu’un', 'Repères linguistiques — la phrase'],
  ['La voix passive', 'Repères linguistiques — la phrase'],
  ['Le discours indirect', 'Repères linguistiques — la phrase'],
]

// Les six axes prennent les positions 1 à 6 ; la grammaire recule d'autant.
const rangeeGrammaire = GRAMMAIRE.map(
  ([titre, axe], i) => `    (${sql(titre)}, ${7 + i}, ${sql(axe)})`,
).join(',\n')

function sql(s) {
  return `'${s.replace(/'/g, "''")}'`
}

export default {
  slug: 'anglais',
  nom: 'Anglais',

  titreMigration: 'LES SIX AXES DU PROGRAMME D’ANGLAIS (Tle)',

  motif: `LE DÉFAUT CORRIGÉ. L'anglais de Terminale ouvrait sur quatre chapitres
donnés pour « les axes du programme » :  « Faire société : unité et pluralité »,
« Environnements en mutation », « Art et débats d'idées », « Innovations et
responsabilité ». Aucun des quatre n'est un axe du programme de terminale ; deux
d'entre eux viennent d'un AUTRE enseignement, la spécialité « Anglais, monde
contemporain ». L'élève lisait donc quatre intitulés absents de son cours.

LE TEXTE QUI FAIT FOI. Arrêté du 5 mai 2025, BO n° 22 du 29 mai 2025
(MENE2504621A), dont l'article 4 applique le programme aux classes de première
et de terminale À LA RENTRÉE 2026-2027 — l'année en cours. Il compte SIX axes
(et non huit comme le programme de 2019) : Espace privé et espace public ·
Territoire et mémoire · Fictions et réalités · Enjeux et formes de la
communication · Citoyenneté et mondes virtuels · Le Royaume-Uni et ses nations.
Cinq des six sont à traiter dans l'année, dont obligatoirement le sixième.

CE QUI CHANGE. Les quatre faux axes sont supprimés (leçons et quiz partent par
cascade), les six vrais s'installent aux positions 1 à 6, et les 24 fiches de
grammaire de la migration 226 se rangent derrière eux sous leurs quatre repères
linguistiques. La page matière groupe au lieu d'aligner 28 lignes à plat.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui
suit. Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS parce que 234 n'a pas
encore été jouée sur la base de production (sondé le 07/08/2026 : « column
chapters.theme does not exist »). Sans elle, cette migration échouerait à
mi-parcours — les quatre faux axes déjà supprimés, les six vrais pas encore
posés : une matière vide en production. Les deux migrations sont idempotentes,
jouer 234 avant ou après ne change rien.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters pour cacher mind_map, et ne l'a rendu que colonne par colonne. Une
colonne ajoutée après elle n'hérite d'aucun droit — sans ce GRANT, l'app lirait
« permission denied » au lieu de l'axe.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les quatre chapitres qui se donnaient pour les axes du programme.
Ils partent avec leurs leçons et leurs quiz (ON DELETE CASCADE) : les garder
« au cas où » laisserait à l'élève quatre portes vers un hors-programme.
Le DELETE est borné aux quatre titres exacts — aucun autre chapitre d'anglais de
Terminale n'est touché, et rejouer ne trouve plus rien à supprimer.`,
      sql: `DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'anglais'
   AND c.level = 'Tle'
   AND c.title IN (
     'Faire société : unité et pluralité',
     'Environnements en mutation',
     'Art et débats d''idées',
     'Innovations et responsabilité'
   );`,
    },
    {
      raison: `Les 24 fiches de grammaire (migration 226) occupent les positions 5
à 28 : elles reculent à 7-30 pour laisser les six premières places aux axes, et
reçoivent leur repère linguistique. Positions ÉCRITES UNE À UNE et non décalées
d'un « +6 » : un décalage relatif rejoué décalerait une seconde fois.`,
      sql: `UPDATE public.chapters c
   SET position = v.position, theme = v.theme
  FROM (VALUES
${rangeeGrammaire}
  ) AS v(title, position, theme), public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'anglais'
   AND c.level = 'Tle'
   AND c.title = v.title
   AND (c.position IS DISTINCT FROM v.position OR c.theme IS DISTINCT FROM v.theme);`,
    },
  ],

  blocs: [
    {
      niveaux: ['Tle'],
      axe: 'Repères culturels — les six axes du programme',
      chapitres: [
        // ===================== Axe 1 — Espace privé et espace public =========
        {
          titre: 'Axe 1 — Espace privé et espace public',
          lecon: {
            titre: 'Où s’arrête le privé, où commence le public',
            cours: `L’axe pose deux questions, reprises du programme : **quels sont les espaces de rencontre et les transitions entre l’espace privé et l’espace public ?** Et **dans quelle mesure la sphère privée peut-elle résister à l’intrusion de la sphère publique ?**

## La frontière n’est pas un mur, c’est une zone
Entre le *private* et le *public*, il existe tout un espace intermédiaire — ce que l’on appelle les *transitional spaces*. Le porche d’une maison américaine (*the porch*), le jardin partagé (*community garden*), le café où l’on travaille, l’open space : ni tout à fait chez soi, ni tout à fait dehors. C’est là que la vie sociale se fabrique.

> L’axe ne demande pas de choisir un camp, mais de savoir décrire un DÉPLACEMENT de frontière, et de dire qui le décide.

## Le corps, terrain du public
Le programme cite « le corps des femmes : entre domaine public et sphère privée ». Aux États-Unis, la décision *Roe v. Wade* (1973) puis son annulation par la Cour suprême en 2022 (*Dobbs*) ont fait passer une question intime dans le débat politique national. Le vocabulaire lui-même est un combat : *pro-choice* contre *pro-life*.

## Quand la foule juge : de Salem à aujourd’hui
Les procès de Salem (1692) sont l’image fondatrice : une communauté qui transforme la rumeur en verdict. Arthur Miller s’en sert dans *The Crucible* (1953) pour parler du maccarthysme. Le mot *witch hunt* désigne aujourd’hui encore toute accusation collective menée sans preuve, et *trial by public opinion* le fait d’être jugé par les médias avant de l’être par un tribunal.

## Le fait religieux
Dans beaucoup de pays anglophones, la religion irrigue les institutions : le souverain britannique est chef de l’Église d’Angleterre, et le président américain prête serment sur la Bible. La séparation à la française n’est pas la règle partout — c’est précisément ce que l’axe invite à comparer.

## Le lexique attendu
- Les lieux : *public facilities, neighbourhood, porch, workplace, co-working, gated community*
- Les gestes : *to socialise, to interact, to intermingle, to commute, to be secluded*
- Le procès : *trial, courtroom, jury, to sue, guilty, a culprit, whistle-blower, to prosecute*`,
          },
          questions: [
            [
              'Que désigne-t-on par « transitional space » dans cet axe ?',
              [
                'Un lieu ni tout à fait privé ni tout à fait public, comme un porche ou un jardin partagé',
                'Un logement temporaire pour personnes sans domicile',
                'Un couloir de gare',
                'Une salle d’attente médicale',
              ],
              0,
              'Le programme cite « nouvelles formes d’habitat urbain et espaces transitionnels : chez soi et ensemble ». Ce sont les seuils où la vie privée et la vie collective se touchent : *the porch*, le *community garden*, le café-bureau.',
            ],
            [
              'Que s’est-il passé en 2022 concernant l’arrêt « Roe v. Wade » ?',
              [
                'La Cour suprême des États-Unis l’a annulé',
                'Il a été inscrit dans la Constitution',
                'Il a été étendu au Canada',
                'Il a été confirmé à l’unanimité',
              ],
              0,
              'L’arrêt *Dobbs v. Jackson* (2022) a annulé *Roe v. Wade* (1973), renvoyant la question de l’avortement aux États fédérés. Un sujet intime redevenu enjeu politique national : c’est le cœur de l’axe.',
            ],
            [
              'À quoi renvoie l’expression « witch hunt » aujourd’hui ?',
              [
                'À une accusation collective menée sans preuve',
                'À une fête d’Halloween',
                'À une enquête judiciaire officielle',
                'À un rite religieux protestant',
              ],
              0,
              'Née des procès de Salem (1692), l’expression désigne toute traque collective fondée sur le soupçon. Arthur Miller l’applique au maccarthysme dans *The Crucible*.',
            ],
            [
              'Que signifie « trial by public opinion » ?',
              [
                'Être jugé par les médias et l’opinion avant tout tribunal',
                'Un procès filmé et retransmis',
                'Un jury tiré au sort parmi les citoyens',
                'Un vote populaire sur une loi',
              ],
              0,
              'Littéralement « le procès par l’opinion publique » : la réputation est détruite avant qu’une justice ait statué. Terme central de l’axe, qui interroge l’intrusion du public dans le privé.',
            ],
            [
              'Le souverain britannique est le chef de l’Église d’Angleterre.',
              ['Vrai', 'Faux'],
              0,
              'Vrai. Depuis Henri VIII, le monarque porte le titre de *Supreme Governor of the Church of England*. Une illustration de ce que le programme appelle « la religion qui irrigue les institutions » dans les pays anglophones.',
            ],
            [
              'Que désigne « a gated community » ?',
              [
                'Un quartier résidentiel fermé, à accès contrôlé',
                'Une communauté religieuse',
                'Un forum en ligne privé',
                'Un immeuble en copropriété',
              ],
              0,
              'Un lotissement clos par des grilles et un poste de garde, très répandu aux États-Unis. L’exemple type d’un espace qui privatise ce qui était public : la rue elle-même.',
            ],
            [
              'Que veut dire le verbe « to commute » ?',
              [
                'Faire le trajet quotidien domicile-travail',
                'Échanger un bien contre un autre',
                'Commuer une peine de prison',
                'Communiquer par messagerie',
              ],
              0,
              '*To commute* = faire la navette entre chez soi et le travail ; *a commuter* est celui qui la fait. Le mot appartient au lexique des lieux publics et transitionnels de l’axe. (Le sens juridique « commuer » existe, mais ce n’est pas celui du programme.)',
            ],
            [
              'Que désigne « a whistle-blower » ?',
              [
                'Une personne qui révèle publiquement des faits répréhensibles de son organisation',
                'Un arbitre sportif',
                'Un policier en civil',
                'Un témoin cité au tribunal',
              ],
              0,
              'Un lanceur d’alerte — littéralement « celui qui donne un coup de sifflet ». Figure exemplaire de l’axe : il fait passer de force une information privée dans l’espace public.',
            ],
          ],
        },

        // ===================== Axe 2 — Territoire et mémoire =================
        {
          titre: 'Axe 2 — Territoire et mémoire',
          lecon: {
            titre: 'Ce qu’un lieu garde et ce qu’il tait',
            cours: `Le programme formule la question ainsi : **comment appréhender l’histoire pour construire un héritage collectif ?** Des peuples cherchent à faire entendre leur voix et à se réapproprier leur passé, en l’inscrivant dans des lieux.

## Un lieu de mémoire, c’est une décision
Un monument, un musée, une plaque, un nom de rue : rien de tout cela n’est naturel. Quelqu’un a décidé de ce qu’on garde et de ce qu’on oublie. C’est pourquoi le programme parle de « la CONSTRUCTION des lieux de mémoire ».

> Retenir la formule : *memory is not the past — it is what a society decides to keep of it.*

## Esclavage et colonisation
Le monde anglophone travaille depuis vingt ans à rendre visible ce qu’il avait effacé. À Liverpool, l’*International Slavery Museum* est installé dans les docks mêmes d’où partaient les navires négriers. À Montgomery (Alabama), le *National Memorial for Peace and Justice* (2018) nomme plus de 4 000 victimes de lynchages. Le débat sur les statues (*to topple a statue*, Edward Colston à Bristol en 2020) est le prolongement direct de cet axe.

## Le Commonwealth et ses commémorations
Le *Remembrance Day* (11 novembre) et son coquelicot (*the poppy*) rassemblent le Royaume-Uni, le Canada, l’Australie et la Nouvelle-Zélande. L’*ANZAC Day* (25 avril) commémore le débarquement de Gallipoli : une défaite devenue acte de naissance de deux nations.

## Territoires autochtones
Le programme demande : « intégration, assimilation ou appropriation ? ». Le *Native Title* australien, les *First Nations* canadiennes et leur *Truth and Reconciliation Commission*, le traité de Waitangi en Nouvelle-Zélande : autant de cas où un territoire et une mémoire se disputent.

## Le lexique attendu
*slavery, enslavement, to rule over, former colonies, decolonisation, reparation, to demand, to call for, emancipation, heritage, landmark, to commemorate, to reclaim, indigenous, settler*`,
          },
          questions: [
            [
              'Que commémore l’ANZAC Day, le 25 avril ?',
              [
                'Le débarquement de Gallipoli en 1915',
                'La fin de la Seconde Guerre mondiale',
                'L’indépendance de l’Australie',
                'L’arrivée du capitaine Cook',
              ],
              0,
              'ANZAC = *Australian and New Zealand Army Corps*. Le débarquement de Gallipoli (1915) fut une défaite militaire, devenue le récit fondateur de l’identité australienne et néo-zélandaise — exemple parfait d’une mémoire qui fabrique une nation.',
            ],
            [
              'Quelle fleur est le symbole du Remembrance Day au Royaume-Uni ?',
              ['Le coquelicot (poppy)', 'La rose', 'Le chardon', 'Le trèfle'],
              0,
              '*The poppy*, inspiré du poème *In Flanders Fields*. Porté à la boutonnière début novembre dans tout le Commonwealth — un objet de mémoire partagé par plusieurs nations.',
            ],
            [
              'Que s’est-il passé à Bristol en 2020 avec la statue d’Edward Colston ?',
              [
                'Des manifestants l’ont déboulonnée et jetée dans le port',
                'Elle a été inaugurée',
                'Elle a été classée monument historique',
                'Elle a été vendue à un musée américain',
              ],
              0,
              'Colston, marchand d’esclaves du XVIIe siècle, était honoré d’une statue. Son déboulonnage (*toppling*) lors des manifestations de 2020 a ouvert un débat national sur ce que l’espace public doit célébrer.',
            ],
            [
              'Où se trouve l’International Slavery Museum, et pourquoi à cet endroit ?',
              [
                'À Liverpool, dans les docks d’où partaient les navires négriers',
                'À Londres, près du Parlement',
                'À New York, sur Ellis Island',
                'À Édimbourg, dans le château',
              ],
              0,
              'Le lieu fait partie du propos : le musée occupe les *Albert Docks* de Liverpool, port majeur de la traite. Le territoire porte la mémoire — c’est l’axe même.',
            ],
            [
              'Que signifie « to reclaim » dans le contexte de cet axe ?',
              [
                'Se réapproprier (un passé, une terre, un récit)',
                'Réclamer un remboursement',
                'Se plaindre officiellement',
                'Recycler des matériaux',
              ],
              0,
              '*To reclaim one’s history / one’s land* : reprendre ce dont on avait été dépossédé. Verbe clé de l’axe, notamment pour les peuples autochtones.',
            ],
            [
              'Que désigne la « Truth and Reconciliation Commission » au Canada ?',
              [
                'Une commission sur les pensionnats imposés aux enfants autochtones',
                'Un tribunal sur les crimes de guerre',
                'Une réforme du système électoral',
                'Une commission sur la corruption politique',
              ],
              0,
              'Créée en 2008, elle a documenté les *residential schools*, où des enfants des Premières Nations furent arrachés à leur famille pour être assimilés. Elle illustre « intégration, assimilation ou appropriation ? ».',
            ],
            [
              'Un lieu de mémoire existe naturellement, indépendamment de tout choix politique.',
              ['Vrai', 'Faux'],
              1,
              'Faux — et c’est le cœur de l’axe. Le programme parle de la CONSTRUCTION des lieux de mémoire : une société décide ce qu’elle érige, ce qu’elle nomme et ce qu’elle laisse disparaître.',
            ],
            [
              'Que veut dire l’adjectif « indigenous » ?',
              ['Autochtone, natif d’un territoire', 'Pauvre', 'Indigné', 'Étranger'],
              0,
              '*Indigenous peoples* = les peuples autochtones (*Aboriginal Australians*, *First Nations*, *Māori*). Attention au faux ami avec « indigent » ou « indigné ».',
            ],
          ],
        },

        // ===================== Axe 3 — Fictions et réalités ==================
        {
          titre: 'Axe 3 — Fictions et réalités',
          lecon: {
            titre: 'Ce que la fiction fait au réel',
            cours: `Question du programme : **comment s’articulent réalité et fantasme dans la construction d’un récit national ?** Et **dans quelle mesure la fiction se nourrit-elle du réel pour le questionner, le sublimer ou le réinventer ?**

## Un récit national est une fiction efficace
L’*American Dream* n’est pas un fait : c’est une histoire que l’Amérique se raconte — *from rags to riches*, chacun peut réussir par son seul mérite. Fitzgerald la met en pièces dans *The Great Gatsby* (1925) : Gatsby s’invente un passé, réussit, et meurt sans que personne ne vienne à son enterrement. Steinbeck fait de même dans *Of Mice and Men*.

> Une fiction ne dit pas le contraire du réel : elle en fait apparaître ce qu’on ne voulait pas voir.

## La dystopie comme avertissement
Orwell (*Nineteen Eighty-Four*, 1949) invente *Big Brother*, la *Newspeak* et le *Ministry of Truth*. Huxley (*Brave New World*) imagine une servitude par le plaisir. Margaret Atwood (*The Handmaid’s Tale*, 1985) affirme n’avoir écrit aucun événement qui ne se soit déjà produit quelque part. Le programme parle de « la dystopie, une catharsis sociétale ? » : la fiction sert d’exutoire et d’alerte.

## La société de classes britannique en fiction
De Dickens à *Downton Abbey*, en passant par Ken Loach : la fiction britannique met en scène des classes qui se croisent sans se mélanger. Elle représente ce système — et parfois le conteste (*to challenge, to question*).

## Quand la science-fiction précède la science
Le sous-marin de Jules Verne, les communicateurs de *Star Trek* devenus téléphones portables, les satellites imaginés par Arthur C. Clarke : la fiction fournit l’image avant que l’ingénieur ne fournisse l’objet.

## Le lexique attendu
*a myth, a narrative, to debunk, far-fetched, to sublimate, to reinvent, dystopia, utopia, a cautionary tale, self-made man, rags to riches, class divide, to challenge, to blur the line*`,
          },
          questions: [
            [
              'Dans « The Great Gatsby », que met en cause Fitzgerald ?',
              [
                'Le mythe du rêve américain',
                'La monarchie britannique',
                'La colonisation de l’Inde',
                'La révolution industrielle',
              ],
              0,
              'Gatsby s’invente un passé et une fortune pour reconquérir Daisy — et meurt seul. Le roman montre que le *self-made man* se heurte à une société de classes que l’argent ne suffit pas à franchir.',
            ],
            [
              'Qui a écrit « Nineteen Eighty-Four » ?',
              ['George Orwell', 'Aldous Huxley', 'Ray Bradbury', 'Margaret Atwood'],
              0,
              'Orwell, en 1949. Le roman a donné à l’anglais courant *Big Brother*, *Newspeak*, *doublethink* et *thought police* — une fiction devenue vocabulaire du réel.',
            ],
            [
              'Que signifie l’expression « from rags to riches » ?',
              [
                'Passer de la misère à la fortune',
                'Perdre tout son argent',
                'Vivre modestement par choix',
                'Hériter d’une grande famille',
              ],
              0,
              'Littéralement « des haillons à la richesse ». La formule condense le récit du *self-made man*, cœur du rêve américain — et la cible des fictions qui le questionnent.',
            ],
            [
              'Qu’affirme Margaret Atwood au sujet de « The Handmaid’s Tale » ?',
              [
                'Qu’elle n’y a mis aucun événement qui ne se soit déjà produit quelque part',
                'Qu’il s’agit d’une pure invention sans lien avec l’histoire',
                'Qu’il décrit exclusivement le Canada contemporain',
                'Qu’il s’agit d’une autobiographie',
              ],
              0,
              'C’est ce qui rend la dystopie efficace : elle recompose du réel attesté. La fiction ne s’oppose pas au vrai, elle le réagence pour le rendre visible.',
            ],
            [
              'Que veut dire le verbe « to debunk » ?',
              [
                'Démystifier, démonter une idée fausse',
                'Publier un livre',
                'Exagérer un récit',
                'Adapter au cinéma',
              ],
              0,
              '*To debunk a myth* = démonter un mythe en le confrontant aux faits. Verbe clé quand l’axe demande d’articuler fiction et réalité.',
            ],
            [
              'Que désigne « a cautionary tale » ?',
              [
                'Un récit qui met en garde',
                'Un conte pour enfants',
                'Une histoire vraie',
                'Un roman policier',
              ],
              0,
              'Un récit-avertissement. C’est la fonction que le programme prête à la dystopie : montrer où mène une tendance pour qu’on ne l’y laisse pas aller.',
            ],
            [
              'La science-fiction a parfois précédé et inspiré des innovations techniques réelles.',
              ['Vrai', 'Faux'],
              0,
              'Vrai — le programme en fait un objet d’étude : « quand la science-fiction nourrit l’innovation scientifique ». Les communicateurs de *Star Trek* ont précédé le téléphone mobile, Arthur C. Clarke a décrit le satellite géostationnaire en 1945.',
            ],
            [
              'Que signifie « to blur the line between fiction and reality » ?',
              [
                'Brouiller la frontière entre fiction et réalité',
                'Tracer une ligne nette entre les deux',
                'Interdire la fiction',
                'Traduire une œuvre',
              ],
              0,
              '*To blur* = rendre flou. L’expression décrit exactement ce que l’axe met en question : le moment où l’on ne distingue plus le récit du fait.',
            ],
          ],
        },

        // ============= Axe 4 — Enjeux et formes de la communication ==========
        {
          titre: 'Axe 4 — Enjeux et formes de la communication',
          lecon: {
            titre: 'L’anglais, langue-monde : réunir ou uniformiser ?',
            cours: `Question du programme : **quel rôle singulier pour l’anglais, langue-monde ?** Cette langue est-elle capable de fédérer, de faire entendre des voix minoritaires, de saisir le monde dans sa complexité — mais aussi d’uniformiser ou de manipuler ?

## Une langue devenue *lingua franca*
Environ 1,5 milliard de personnes parlent anglais, dont une large majorité ne l’a pas pour langue maternelle. On parle d’*English as a lingua franca* : la langue de la science, du commerce, d’Internet. Le programme demande si cette « nouvelle Tour de Babel » rapproche les peuples ou « aplanit les singularités ».

> Une langue commune est un pont — et, pour les langues qu’elle remplace, une menace.

## Des anglais au pluriel
Il n’y a pas un anglais mais des *Englishes* : *Indian English*, *Nigerian English*, *Singlish* à Singapour, *African American Vernacular English*. Chacun a sa grammaire et son lexique. Une variété n’est pas un anglais raté : c’est une norme locale.

## Le discours politique, de Churchill aux réseaux
Churchill (*We shall fight on the beaches*, 1940) et Martin Luther King (*I have a dream*, 1963) construisent par l’anaphore et le rythme. Aujourd’hui la parole politique tient en 280 caractères. La forme a changé, la fonction demeure : convaincre.

## Complotisme et vérité
Le programme pose : « Chacun sa vérité ? Le défi du complotisme ». Les mots à connaître : *fake news*, *echo chamber* (on n’entend que ce qu’on pense déjà), *filter bubble*, *post-truth* (mot de l’année 2016 pour l’Oxford Dictionary), *conspiracy theory*.

## Précautions sémantiques : inclusion, censure ou trahison ?
Réécrire Roald Dahl ou Agatha Christie pour en retirer des termes jugés blessants : geste d’inclusion ou trahison de l’œuvre ? Le débat sur le *politically correct* et les *sensitivity readers* est explicitement au programme.

## Le lexique attendu
*lingua franca, native/non-native speaker, to convey, to put across, misleading, biased, echo chamber, filter bubble, post-truth, fake news, to debunk, wording, to water down, freedom of speech*`,
          },
          questions: [
            [
              'Que désigne l’expression « English as a lingua franca » ?',
              [
                'L’anglais utilisé comme langue commune entre locuteurs de langues maternelles différentes',
                'L’anglais parlé uniquement en Angleterre',
                'Un mélange d’anglais et de français',
                'L’anglais littéraire du XIXe siècle',
              ],
              0,
              'Une *lingua franca* est une langue véhiculaire. La majorité des échanges en anglais dans le monde se font aujourd’hui entre locuteurs non natifs — d’où la question du programme sur la « nouvelle Tour de Babel ».',
            ],
            [
              'Que signifie « echo chamber » dans le débat sur l’information ?',
              [
                'Un espace où l’on n’est exposé qu’à des opinions déjà semblables aux siennes',
                'Un studio d’enregistrement',
                'Une salle de conférence de presse',
                'Un dispositif de traduction simultanée',
              ],
              0,
              'La « chambre d’écho » renvoie à l’utilisateur sa propre opinion, amplifiée. Voisine de la *filter bubble*, elle explique comment une croyance se durcit sans jamais rencontrer de contradiction.',
            ],
            [
              'Que veut dire « post-truth » ?',
              [
                'Se dit d’une situation où l’émotion pèse plus que les faits dans l’opinion',
                'Une vérité démontrée après coup',
                'Un article publié après vérification',
                'Une déclaration officielle',
              ],
              0,
              'Mot de l’année 2016 pour l’Oxford Dictionary : *relating to circumstances in which objective facts are less influential than appeals to emotion*. Terme central du « défi du complotisme ».',
            ],
            [
              'Quel procédé rhétorique structure « I have a dream » de Martin Luther King ?',
              [
                'L’anaphore — la répétition d’une même formule en tête de phrase',
                'L’ellipse',
                'La litote',
                'Le calembour',
              ],
              0,
              'La répétition de *I have a dream that one day…* donne au discours son rythme et sa force mémorielle. Le programme met en regard « la forme et la portée du discours politique, de Winston Churchill aux réseaux sociaux ».',
            ],
            [
              'Il existe plusieurs variétés d’anglais dotées chacune de règles propres.',
              ['Vrai', 'Faux'],
              0,
              'Vrai. *Indian English*, *Nigerian English*, *Singlish*, AAVE : ce sont des normes constituées, pas des fautes. Le programme demande précisément si l’anglais-monde « fait entendre des voix minoritaires » ou « aplanit les singularités ».',
            ],
            [
              'Que désigne « a sensitivity reader » ?',
              [
                'Une personne chargée de relire un texte pour en signaler les passages potentiellement blessants',
                'Un lecteur de livres audio',
                'Un critique littéraire de presse',
                'Un correcteur orthographique automatique',
              ],
              0,
              'Au cœur de l’objet d’étude « les précautions sémantiques dans les œuvres : inclusion, censure ou trahison ? », qu’ont ravivé les réécritures de Roald Dahl et d’Agatha Christie.',
            ],
            [
              'Que signifie l’adjectif « biased » ?',
              ['Partial, orienté', 'Fondé sur des preuves', 'Traduit', 'Officiel'],
              0,
              '*A biased account* = un récit partial. Avec *misleading* (trompeur), c’est le mot que l’épreuve attend pour qualifier une source dans cet axe.',
            ],
            [
              'Que veut dire « to water down a statement » ?',
              [
                'En atténuer la force, l’édulcorer',
                'Le traduire mot à mot',
                'Le publier intégralement',
                'Le démentir formellement',
              ],
              0,
              'Littéralement « le diluer ». Verbe utile pour décrire une reformulation qui ménage — au risque, dit le programme, de trahir.',
            ],
          ],
        },

        // ============= Axe 5 — Citoyenneté et mondes virtuels ================
        {
          titre: 'Axe 5 — Citoyenneté et mondes virtuels',
          lecon: {
            titre: 'Être citoyen quand la place publique est un écran',
            cours: `Question du programme : **à l’heure des mondes virtuels, quels sont les enjeux démocratiques dans les aires anglophones ?** Et **comment les citoyens peuvent-ils s’emparer des outils numériques et en garder la maîtrise ?**

## Le numérique a déplacé l’agora
Une pétition en ligne, un mot-dièse, une vidéo tournée au téléphone : #MeToo (2017) et #BlackLivesMatter (né en 2013) ont montré qu’un mouvement pouvait naître sans parti, sans journal, sans local. Le programme parle de « la parole sur les réseaux sociaux : portée et limites du pouvoir horizontal ».

> Horizontal ne veut pas dire égal : la visibilité, elle, reste distribuée par un algorithme privé.

## Vie connectée, vie exposée
*Is a connected life an exposed life?* — l’objet d’étude est écrit ainsi au programme. Les notions : *digital footprint* (la trace qu’on laisse), *data privacy*, *surveillance capitalism* (Shoshana Zuboff), *the right to be forgotten*. Et son revers : *cyberbullying*, *doxxing*, *online harassment*.

## Le jeu vidéo comme *soft power*
Le programme demande si le jeu vidéo est « une nouvelle forme du soft power américain ». Le concept de *soft power* est de Joseph Nye : influencer par l’attrait plutôt que par la contrainte. Minecraft, Fortnite et GTA exportent des récits et des normes autant que Hollywood en son temps.

## Apprendre à l’heure de l’IA
Dernier objet d’étude : les « nouvelles modalités d’apprentissage à l’heure de l’intelligence artificielle dans le monde éducatif anglophone ». Débat ouvert dans les universités britanniques et américaines : outil d’accessibilité ou machine à tricher ?

## Le lexique attendu
*digital footprint, data privacy, to opt out, surveillance, echo chamber, to go viral, grassroots movement, e-petition, digital divide, cyberbullying, accountability, soft power*`,
          },
          questions: [
            [
              'Qui a forgé la notion de « soft power » ?',
              ['Joseph Nye', 'Noam Chomsky', 'Shoshana Zuboff', 'Marshall McLuhan'],
              0,
              'Le politologue américain Joseph Nye : la capacité d’obtenir ce que l’on veut par l’attrait culturel plutôt que par la contrainte. Le programme l’applique au jeu vidéo.',
            ],
            [
              'Que désigne « a digital footprint » ?',
              [
                'L’ensemble des traces qu’une personne laisse en ligne',
                'La consommation électrique d’un ordinateur',
                'Une signature électronique certifiée',
                'La taille d’un fichier téléchargé',
              ],
              0,
              '« L’empreinte numérique » : publications, recherches, achats, déplacements. Notion centrale de l’objet d’étude « la vie connectée est-elle synonyme de vie exposée ? ».',
            ],
            [
              'Que signifie « a grassroots movement » ?',
              [
                'Un mouvement né de la base, sans organisation dirigeante',
                'Un mouvement écologiste',
                'Un parti politique traditionnel',
                'Une campagne financée par un gouvernement',
              ],
              0,
              'Littéralement « à la racine de l’herbe » : parti des citoyens eux-mêmes. C’est le « pouvoir horizontal » dont le programme demande d’évaluer la portée ET les limites.',
            ],
            [
              'Que désigne le « digital divide » ?',
              [
                'L’écart d’accès et de maîtrise du numérique entre populations',
                'La séparation entre logiciels libres et propriétaires',
                'Un désaccord politique en ligne',
                'La scission d’un réseau social en deux plateformes',
              ],
              0,
              'La « fracture numérique » : sans accès ni compétence, la citoyenneté en ligne reste théorique. Un contrepoids indispensable à l’idée d’un espace numérique égalitaire.',
            ],
            [
              'Le mouvement #BlackLivesMatter a d’abord émergé sur les réseaux sociaux.',
              ['Vrai', 'Faux'],
              0,
              'Vrai. Né en 2013 comme mot-dièse après l’acquittement de George Zimmerman, il est devenu un mouvement international — cas d’école du « pouvoir horizontal ».',
            ],
            [
              'Que signifie « to opt out » ?',
              [
                'Choisir de ne pas participer, se retirer d’un dispositif',
                'S’inscrire à un service',
                'Optimiser un réglage',
                'Voter contre une loi',
              ],
              0,
              '*To opt out of data collection* = refuser la collecte de ses données. Son contraire est *to opt in*. Verbe indispensable pour parler de maîtrise des outils numériques.',
            ],
            [
              'Que désigne « accountability » ?',
              [
                'L’obligation de rendre des comptes',
                'La comptabilité d’entreprise',
                'Un compte utilisateur',
                'Le nombre d’abonnés',
              ],
              0,
              'Faux ami à connaître : *accountability* = la responsabilité au sens de devoir répondre de ses actes. Terme clé quand on demande des comptes à une plateforme.',
            ],
            [
              'Que désigne « surveillance capitalism », selon Shoshana Zuboff ?',
              [
                'Un modèle économique fondé sur l’exploitation commerciale des données personnelles',
                'La surveillance policière des rues par caméras',
                'Le contrôle des marchés financiers',
                'L’espionnage industriel entre entreprises',
              ],
              0,
              'Zuboff décrit un capitalisme dont la matière première est l’expérience humaine transformée en données prédictives. Notion attendue sur l’axe pour dépasser le simple constat « les réseaux nous surveillent ».',
            ],
          ],
        },

        // ============= Axe 6 — Le Royaume-Uni et ses nations =================
        {
          titre: 'Axe 6 — Le Royaume-Uni et ses nations',
          lecon: {
            titre: 'Un royaume toujours uni ?',
            cours: `C’est **l’axe obligatoire** de la terminale : cinq axes sur six sont à traiter dans l’année, dont celui-ci nécessairement. Questions du programme : **comment les relations entre les différentes nations composant le Royaume-Uni ont-elles évolué ?** **Comment les identités se définissent-elles par rapport aux nations ?** **Quels sont les vecteurs d’union ?**

## Trois mots à ne jamais confondre
- **England** : une nation.
- **Great Britain** : l’île — England + Scotland + Wales.
- **The United Kingdom** : Great Britain + Northern Ireland. C’est l’État.
Quatre nations, un seul État : c’est toute la tension de l’axe.

## La dévolution
Depuis 1998-1999, l’Écosse, le pays de Galles et l’Irlande du Nord ont leur parlement ou assemblée et leur *First Minister*. C’est la *devolution* : un transfert de compétences, sans indépendance. Le référendum écossais de 2014 a répondu *No* à 55 %.

## Le Brexit a rouvert la question
Référendum de 2016 : 52 % pour le *Leave* à l’échelle du Royaume-Uni — mais l’Écosse a voté *Remain* à 62 % et l’Irlande du Nord à 56 %. D’où la relance de l’indépendantisme écossais et la question de la frontière irlandaise, réglée par le *Northern Ireland Protocol* puis le *Windsor Framework* (2023).

## L’Irlande du Nord : identités plurielles
L’accord du Vendredi saint (*Good Friday Agreement*, 1998) a mis fin aux *Troubles*. Il autorise la double nationalité britannique et irlandaise : on peut y être l’un, l’autre, ou les deux.

## Écosse : Glasgow et Édimbourg
Le programme met en regard « deux visages de l’Écosse en mutation » : Édimbourg, capitale politique et festivalière ; Glasgow, ville industrielle reconvertie.

## Les vecteurs d’union
La monarchie, le NHS (*National Health Service*), la BBC — dont le programme demande si elle est un « vecteur de soft power britannique ».

## Le lexique attendu
*devolution, to break away from, dissent, dual identity, constituency, general election, Prime Minister, First Minister, Brexiteers, Labour, Tories, parliamentary monarchy, shared culture, working class*`,
          },
          questions: [
            [
              'Que comprend le Royaume-Uni que la Grande-Bretagne ne comprend pas ?',
              ['L’Irlande du Nord', 'Le pays de Galles', 'L’Écosse', 'L’île de Man'],
              0,
              '*Great Britain* = Angleterre + Écosse + pays de Galles (l’île). *The United Kingdom* y ajoute l’Irlande du Nord. Distinction fondatrice de l’axe — et faute classique à l’épreuve.',
            ],
            [
              'Que désigne la « devolution » au Royaume-Uni ?',
              [
                'Le transfert de compétences à des parlements nationaux, sans indépendance',
                'La sortie de l’Union européenne',
                'L’abolition de la monarchie',
                'Le retour de pouvoirs vers Londres',
              ],
              0,
              'Engagée en 1998-1999, elle a doté l’Écosse, le pays de Galles et l’Irlande du Nord de leur propre assemblée et de leur *First Minister*. Autonomie, pas souveraineté.',
            ],
            [
              'Quel a été le résultat du référendum d’indépendance écossais de 2014 ?',
              [
                'Le « non » l’a emporté avec environ 55 % des voix',
                'Le « oui » l’a emporté de justesse',
                'Le référendum a été annulé',
                'Le résultat fut une égalité parfaite',
              ],
              0,
              '55 % de *No*, 45 % de *Yes*. Le Brexit de 2016, rejeté par l’Écosse, a relancé la revendication d’un second référendum.',
            ],
            [
              'Comment l’Écosse a-t-elle voté au référendum sur le Brexit en 2016 ?',
              [
                'Majoritairement pour rester dans l’UE (Remain), à environ 62 %',
                'Majoritairement pour le Leave, à environ 62 %',
                'À égalité parfaite',
                'Elle n’a pas participé au vote',
              ],
              0,
              'L’Écosse a voté *Remain* à 62 % et l’Irlande du Nord à 56 %, tandis que le Royaume-Uni dans son ensemble votait *Leave* à 52 %. Cet écart entre nations est le nœud de l’axe.',
            ],
            [
              'Qu’a établi le Good Friday Agreement de 1998 ?',
              [
                'La paix en Irlande du Nord et le droit à la double nationalité',
                'L’indépendance de l’Irlande du Nord',
                'La sortie du Royaume-Uni de l’UE',
                'La création du Parlement écossais uniquement',
              ],
              0,
              'L’accord du Vendredi saint met fin aux *Troubles* et reconnaît que l’on peut être britannique, irlandais, ou les deux — l’illustration même des « identités plurielles » du programme.',
            ],
            [
              'Comment appelle-t-on le chef du gouvernement écossais ?',
              ['First Minister', 'Prime Minister', 'Chancellor', 'Lord Mayor'],
              0,
              'Le *First Minister* dirige le gouvernement dévolu d’Écosse (comme au pays de Galles et en Irlande du Nord). Le *Prime Minister* est le chef du gouvernement du Royaume-Uni, à Londres.',
            ],
            [
              'L’axe 6 est le seul dont le traitement est obligatoire en terminale.',
              ['Vrai', 'Faux'],
              0,
              'Vrai. Le programme précise : « Cinq axes parmi les six proposés doivent être traités pendant l’année, dont obligatoirement l’axe 6 ». La focale sur le Royaume-Uni est imposée en terminale.',
            ],
            [
              'Que désigne « a constituency » ?',
              [
                'Une circonscription électorale',
                'Une constitution écrite',
                'Un parti politique',
                'Une commission parlementaire',
              ],
              0,
              'Le Royaume-Uni compte 650 *constituencies*, chacune élisant un député aux Communes au scrutin majoritaire à un tour (*first-past-the-post*). Les électeurs d’une circonscription sont ses *constituents*.',
            ],
          ],
        },
      ],
    },
  ],
}
