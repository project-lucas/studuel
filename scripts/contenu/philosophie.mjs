// Philosophie — Terminale (tronc commun, toutes séries générales).
//
// Découpage : les 17 notions du programme officiel (arrêté du 19/07/2019), avec
// la liberté éclatée en trois chapitres — « faire ce qui me plaît »,
// « libre arbitre », « liberté politique » — parce que ce sont trois problèmes
// distincts que les élèves confondent systématiquement à l'écrit.
//
// La philosophie n'a pas de « chapitres » au sens des autres matières : chaque
// notion est un PROBLÈME. Chaque cours pose donc le problème, distingue les
// sens du mot, puis oppose deux ou trois positions repérables — c'est ce qui
// s'utilise dans une dissertation, pas une liste de définitions.

export default {
  slug: 'philosophie',
  nom: 'Philosophie',

  titreMigration: 'LE PROGRAMME DE PHILOSOPHIE (Tle)',

  motif: `CONSTAT MESURÉ (node _ASSOCIE/sonde-contenu.mjs, 05/08/2026) : la
philosophie Tle n'avait que 5 chapitres, taillés dans un découpage maison
(« La conscience et l'inconscient », « La vérité et la raison »…) qui ne
correspond à AUCUNE des notions au programme du baccalauréat. Un élève qui
révisait « le devoir », « la technique » ou « le temps » ne trouvait rien.
Cette migration installe les 17 notions officielles, la liberté étant
éclatée en trois chapitres (indépendance / libre arbitre / liberté
politique) — soit 19 chapitres.`,

  // Les 5 anciens chapitres partent : deux d'entre eux (« Le bonheur », « La
  // justice et le droit ») portent EXACTEMENT le titre d'une notion nouvelle,
  // et `chapters` est UNIQUE(subject_id, level, title) — les garder ferait
  // échouer la migration à mi-parcours. Les trois autres sont des composites
  // que les nouveaux chapitres recouvrent entièrement.
  //
  // ON NE SUPPRIME PAS PAR TITRE : « Le bonheur » désigne aussi un chapitre
  // NEUF, un second passage de la migration l'effacerait avec la progression
  // des élèves. Le repère est la LEÇON — les 5 anciens chapitres, et eux seuls,
  // portent les deux leçons génériques posées par 025/144 (« L'essentiel du
  // cours » et « Exercices types »), vérifié en base le 05/08/2026. Aucun
  // chapitre neuf n'en porte : rejouer la migration ne supprime plus rien.
  menage: [
    {
      raison: `La file « À revoir » d'abord : review_items.item_id n'a PAS de clé
étrangère (il pointe soit une question, soit une carte). Rien ne casse si on
l'oublie — le lecteur écarte déjà un contenu disparu — mais le compteur
« X à revoir » continuerait de compter des questions qui n'existent plus.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'philosophie'
   AND c.level = 'Tle'
   AND l.title IN ('L''essentiel du cours', 'Exercices types');`,
    },
    {
      raison: `Les quiz ensuite : quizzes.lesson_id est ON DELETE SET NULL, donc
supprimer le chapitre laisserait derrière lui des quiz orphelins, rattachés à
aucune leçon mais toujours servis par le moteur de révision.`,
      sql: `DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'philosophie'
   AND c.level = 'Tle'
   AND l.title IN ('L''essentiel du cours', 'Exercices types');`,
    },
    {
      raison: `Puis les chapitres : leçons, fiches de révision, supports, progression
et chapitres cochés partent en cascade (toutes les clés étrangères vers
chapters et lessons sont ON DELETE CASCADE).`,
      sql: `DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'philosophie'
   AND c.level = 'Tle'
   AND EXISTS (
     SELECT 1 FROM public.lessons l
      WHERE l.chapter_id = c.id
        AND l.title IN ('L''essentiel du cours', 'Exercices types')
   );`,
    },
  ],

  blocs: [
    {
      niveaux: ['Tle'],
      chapitres: [
        // ------------------------------------------------------------------
        {
          titre: 'La conscience',
          lecon: {
            titre: 'Être présent à soi',
            cours: `« Conscience » vient du latin *cum scientia* : accompagné de savoir. Être conscient, ce n'est pas seulement percevoir, c'est savoir que l'on perçoit.

## Trois degrés
La conscience **immédiate** est le rapport spontané au monde : je vois, je marche, j'ai froid. La conscience **réfléchie** est le retour de la pensée sur elle-même : je sais que je vois. La conscience **morale**, elle, ne dit pas ce qui est mais ce qui vaut : elle juge ce que je fais.

## Le sujet pensant
Descartes cherche une certitude que le doute ne puisse pas entamer. Il peut douter de ses sens, du monde, de son corps — mais s'il doute, il pense, et s'il pense, il est. « Je pense, donc je suis » (*Discours de la méthode*, 1637). Le doute n'est pas ici du scepticisme : il est **méthodique**, il sert à trouver un point fixe.

## Les soupçons
Kant accorde que le « je pense » accompagne toutes mes représentations, mais il ajoute que je me connais seulement comme phénomène : la conscience ne me livre pas ce que je suis en moi-même. Freud fait de la conscience une petite partie du psychisme. Sartre, lui, retourne l'affaire : la conscience n'est pas une chose, elle est vide, elle n'est rien d'autre que le mouvement par lequel elle vise le monde et se choisit.

## Une séparation d'avec soi
Être conscient, c'est ne plus coïncider avec soi : je me juge, je me projette, je me regrette. Pascal y voit à la fois notre inquiétude et notre grandeur — l'homme est « un roseau, le plus faible de la nature, mais un roseau pensant », et « toute notre dignité consiste en la pensée ».`,
          },
          questions: [
            ['Que dit l’étymologie latine du mot « conscience » (*cum scientia*) ?', ['Accompagné de savoir', 'Sans savoir', 'Au-dessus du savoir', 'Contre le savoir'], 0, 'Être conscient, c’est savoir que l’on sait.'],
            ['« Je pense, donc je suis » est une formule de…', ['Descartes', 'Kant', 'Freud', 'Sartre'], 0, 'Le cogito du *Discours de la méthode* (1637), seule certitude qui résiste au doute.'],
            ['La conscience réfléchie désigne…', ['Le retour de la pensée sur elle-même', 'La perception spontanée du monde', 'Le jugement porté sur autrui', 'Le sommeil sans rêve'], 0, 'Je ne me contente pas de voir : je sais que je vois.'],
            ['La conscience morale porte sur ce qui est, et non sur ce qui vaut.', ['Vrai', 'Faux'], 1, 'C’est l’inverse : elle juge la valeur de nos actes.'],
            ['Le doute cartésien vise à détruire définitivement toute certitude.', ['Vrai', 'Faux'], 1, 'C’est un doute méthodique : il cherche un point fixe, pas le scepticisme.'],
            ['Pour Sartre, la conscience est…', ['Un rapport au monde, non une chose', 'Une substance matérielle', 'Un organe du cerveau', 'Une illusion sans effet'], 0, 'Elle n’est rien d’autre que le mouvement par lequel elle vise le monde.'],
            ['Selon Kant, le « je pense » me donne à connaître ce que je suis en moi-même.', ['Vrai', 'Faux'], 1, 'Je me saisis comme phénomène, pas comme chose en soi.'],
            ['Chez Pascal, la pensée fait de l’homme…', ['Un roseau pensant : faible, mais digne', 'Un animal comme les autres', 'Un être tout-puissant', 'Un pur esprit sans corps'], 0, '« Toute notre dignité consiste en la pensée. »'],
          ],
        },
        // ------------------------------------------------------------------
        {
          titre: 'L’inconscient',
          lecon: {
            titre: 'Ce qui agit en nous à notre insu',
            cours: `Peut-on parler d'une pensée qui échappe à la conscience ? L'idée paraît contradictoire — et c'est pourtant l'hypothèse que Freud transforme en méthode.

## Ce que l'inconscient n'est pas
Il ne désigne pas le **non-conscient** biologique (la digestion, le rythme cardiaque), ni l'inattention, ni l'oubli banal. L'inconscient **psychique** est fait de représentations qui ont un sens et qui agissent : des pensées, mais des pensées que le sujet ne peut pas reconnaître comme siennes.

## Le refoulement et ses retours
Certains désirs, incompatibles avec les exigences morales et sociales, sont **refoulés** : repoussés hors de la conscience par une censure. Ils ne disparaissent pas pour autant, ils reviennent déguisés — dans les **rêves**, les **lapsus**, les **actes manqués**, les **symptômes**. Rien n'est fortuit dans la vie psychique : c'est le **déterminisme psychique**.

## Les deux topiques
Première topique : inconscient / préconscient / conscient. Seconde topique : le **Ça** (les pulsions, qui ne connaît que le plaisir), le **Moi** (qui compose avec le réel) et le **Surmoi** (les interdits intériorisés). D'où la formule : le Moi « n'est pas maître dans sa propre maison ».

## L'objection de la mauvaise foi
Sartre refuse l'inconscient : pour censurer un désir, la censure devrait déjà le connaître — donc en être consciente. Ce que Freud appelle refoulement, il l'appelle **mauvaise foi** : une fuite de la conscience devant sa propre liberté, dont on reste responsable. C'est là tout l'enjeu : l'inconscient explique-t-il l'homme, ou l'excuse-t-il ?`,
          },
          questions: [
            ['L’inconscient psychique freudien désigne…', ['Des représentations refoulées qui agissent à notre insu', 'Les fonctions du corps comme la digestion', 'Un simple manque d’attention', 'La perte de mémoire liée à l’âge'], 0, 'Ce sont des pensées porteuses de sens, pas des mécanismes biologiques.'],
            ['Pour Freud, le rêve est…', ['L’expression déguisée d’un désir refoulé', 'Un phénomène sans signification', 'Un message venu de l’extérieur', 'La preuve du libre arbitre'], 0, 'Le rêve est « la voie royale » vers l’inconscient.'],
            ['Un acte manqué est, du point de vue du désir, un acte réussi.', ['Vrai', 'Faux'], 0, 'Il réalise une intention que le sujet ne s’avoue pas.'],
            ['Dans la seconde topique, l’instance des interdits intériorisés s’appelle…', ['Le Surmoi', 'Le Ça', 'Le Moi', 'Le préconscient'], 0, 'Il hérite des exigences parentales puis sociales.'],
            ['Le Ça est le siège…', ['Des pulsions', 'De la raison', 'De la morale', 'De la perception'], 0, 'Il ignore la contradiction et le temps, et ne suit que le principe de plaisir.'],
            ['Sartre reprend à son compte l’hypothèse de l’inconscient.', ['Vrai', 'Faux'], 1, 'Il lui oppose la mauvaise foi, dont le sujet reste responsable.'],
            ['Le déterminisme psychique affirme que…', ['Aucun fait psychique n’est le fruit du hasard', 'Tout est décidé par la biologie', 'Rien ne peut être expliqué', 'La conscience contrôle tout'], 0, 'Lapsus, oublis et rêves ont une cause psychique.'],
            ['Reconnaître un inconscient supprime toute responsabilité du sujet.', ['Vrai', 'Faux'], 1, 'C’est l’objection classique ; la cure vise au contraire à rendre le sujet responsable de son désir.'],
          ],
        },
        // ------------------------------------------------------------------
        {
          titre: 'La nature',
          lecon: {
            titre: 'Ce qui n’est pas l’œuvre de l’homme',
            cours: `Le mot « nature » sert à tout : la campagne, l'univers, l'essence d'une chose, ce qui est normal. Une dissertation commence toujours par y mettre de l'ordre.

## Deux sens à distinguer
La **nature d'une chose** est ce qu'elle est essentiellement (« la nature du triangle »). **La nature** est l'ensemble de ce qui existe et se produit sans l'homme. Les Grecs opposent la *phusis*, ce qui pousse et se développe de soi-même, à la *technè*, ce qui est produit par l'art humain. Aristote y ajoute une idée forte : dans la nature, chaque être tend vers sa fin — « la nature ne fait rien en vain ».

## Nature et culture
Est **naturel** ce qui est universel et spontané ; est **culturel** ce qui varie d'une société à l'autre et relève de la norme. Lévi-Strauss note que la prohibition de l'inceste tient les deux à la fois : universelle comme la nature, règle comme la culture. C'est le seuil où l'humain commence.

## Y a-t-il une nature humaine ?
L'état de nature de Hobbes ou de Rousseau n'est pas un fait historique : c'est une **fiction méthodique** qui sert à comprendre ce que la société nous a fait. Chez Hobbes, l'homme sans État vit dans « la guerre de tous contre tous » ; chez Rousseau, il est paisible, ignorant, mû par l'amour de soi et la pitié. Sartre récuse la question : « l'existence précède l'essence », rien n'est donné d'avance à l'homme.

## Maîtriser ou ménager
Descartes veut nous rendre « comme maîtres et possesseurs de la nature » : la connaître pour l'utiliser. La crise écologique retourne le programme — Hans Jonas demande d'agir de telle sorte que les effets de nos actes soient compatibles avec la permanence d'une vie humaine sur terre. La nature devient alors moins une réserve qu'une responsabilité.`,
          },
          questions: [
            ['À quoi les Grecs opposent-ils la *phusis* (la nature) ?', ['À la *technè*, ce qui est produit par l’art humain', 'Au *logos*', 'À la *polis*', 'À la *doxa*'], 0, 'Ce qui pousse de soi-même s’oppose à ce qui est fabriqué.'],
            ['Pour Aristote, la nature agit au hasard, sans finalité.', ['Vrai', 'Faux'], 1, '« La nature ne fait rien en vain » : chaque être tend vers sa fin.'],
            ['Selon Lévi-Strauss, la prohibition de l’inceste est remarquable parce qu’elle est…', ['Universelle comme la nature et normative comme la culture', 'Propre à l’Occident', 'Purement biologique', 'Récente dans l’histoire'], 0, 'Elle marque le passage de la nature à la culture.'],
            ['Chez Hobbes, l’état de nature est…', ['La guerre de tous contre tous', 'Un âge d’or pacifique', 'Une société avec des lois', 'Une invention des philosophes grecs'], 0, 'D’où la nécessité d’un pouvoir commun qui fasse peur à tous.'],
            ['Pour Rousseau, l’homme de l’état de nature est mû par l’amour de soi et la pitié.', ['Vrai', 'Faux'], 0, 'Ce sont les rapports sociaux, non la nature, qui le rendent méchant.'],
            ['L’état de nature désigne une époque historique attestée par l’archéologie.', ['Vrai', 'Faux'], 1, 'C’est une hypothèse méthodique, un outil pour penser la société.'],
            ['« Comme maîtres et possesseurs de la nature » est une formule de…', ['Descartes', 'Rousseau', 'Aristote', 'Jonas'], 0, 'Elle exprime le projet de la science moderne dans le *Discours de la méthode*.'],
            ['Quand Sartre écrit que « l’existence précède l’essence », il affirme…', ['Qu’il n’y a pas de nature humaine donnée d’avance', 'Que l’homme est déterminé par ses gènes', 'Que Dieu a créé l’homme', 'Que la culture n’existe pas'], 0, 'L’homme est d’abord, et se définit ensuite par ses actes.'],
          ],
        },
        // ------------------------------------------------------------------
        {
          titre: 'Le bonheur',
          lecon: {
            titre: 'Le souverain bien',
            cours: `Tout le monde veut être heureux : c'est ce que les philosophes appellent le **souverain bien**, la fin que l'on recherche pour elle-même et non pour autre chose. Le désaccord commence dès qu'on demande en quoi il consiste.

## Un idéal flou
Kant y voit « un idéal, non de la raison, mais de l'imagination » : chacun le veut, personne ne peut dire précisément ce qu'il veut. Le bonheur n'est pas non plus le **plaisir**, qui est ponctuel et fugitif, ni la **joie**, qui est une émotion : il désigne un état durable de satisfaction complète.

## Les recettes antiques
**Épicure** distingue les désirs naturels et nécessaires (manger), naturels et non nécessaires (bien manger), ni naturels ni nécessaires (la gloire, la richesse). Réduire ses désirs suffit : le bonheur est l'*ataraxie*, l'absence de trouble. Les **stoïciens** (Épictète, Marc Aurèle) distinguent ce qui dépend de nous — nos jugements — et ce qui n'en dépend pas : vouloir changer le reste, c'est se condamner au malheur. **Aristote** répond autrement : le bonheur est l'activité de l'âme conforme à la vertu, dans une vie accomplie ; il y faut aussi des amis et un minimum de biens.

## Les objections
Pascal soutient que nous ne cherchons pas le bonheur mais le **divertissement** : nous fuyons le repos, où nous rencontrerions notre condition. Schopenhauer décrit une oscillation entre la souffrance du manque et l'ennui de la satisfaction. Kant, lui, sépare morale et bonheur : la morale n'apprend pas à être heureux mais à se rendre **digne** de l'être.`,
          },
          questions: [
            ['Le « souverain bien » désigne…', ['La fin recherchée pour elle-même', 'Le plaisir immédiat', 'La richesse', 'Le pouvoir politique'], 0, 'Tout le reste est recherché en vue de lui.'],
            ['Pour Kant, le bonheur est un idéal de la raison, parfaitement définissable.', ['Vrai', 'Faux'], 1, 'C’est « un idéal de l’imagination » : chacun le veut sans pouvoir en fixer le contenu.'],
            ['Chez Épicure, boire quand on a soif relève des désirs…', ['Naturels et nécessaires', 'Naturels mais non nécessaires', 'Ni naturels ni nécessaires', 'Interdits'], 0, 'Seuls ceux-là doivent être satisfaits sans réserve.'],
            ['L’*ataraxie* désigne…', ['L’absence de trouble de l’âme', 'L’accumulation de plaisirs', 'La colère maîtrisée', 'Le devoir accompli'], 0, 'C’est le but de la sagesse épicurienne comme stoïcienne.'],
            ['Les stoïciens conseillent de changer l’ordre du monde plutôt que ses propres désirs.', ['Vrai', 'Faux'], 1, 'Épictète invite à l’inverse : distinguer ce qui dépend de nous de ce qui n’en dépend pas.'],
            ['Pour Aristote, le bonheur consiste…', ['Dans l’activité de l’âme conforme à la vertu', 'Dans l’absence de toute activité', 'Dans la possession de richesses', 'Dans la suppression de tout désir'], 0, 'Le bonheur est une manière de vivre, pas un état passif.'],
            ['Selon Pascal, le divertissement nous détourne de notre condition.', ['Vrai', 'Faux'], 0, '« Tout le malheur des hommes vient d’une seule chose, qui est de ne savoir pas demeurer en repos. »'],
            ['Pour Kant, la morale nous enseigne…', ['À nous rendre dignes d’être heureux', 'Le chemin le plus court vers le bonheur', 'À rechercher le plaisir', 'À fuir toute obligation'], 0, 'Le bonheur n’est pas le principe du devoir, mais son espérance.'],
          ],
        },
        // ------------------------------------------------------------------
        {
          titre: 'Le travail',
          lecon: {
            titre: 'Peine, œuvre et valeur',
            cours: `Le mot vient du latin *tripalium*, un instrument de torture — et la Genèse fait du travail une punition. Pourtant, c'est aussi par lui que l'homme se fait lui-même.

## La nécessité et la peine
Travailler, c'est transformer la nature pour subsister : une activité contrainte, pénible, qui prend du temps de vie. Les Grecs la réservaient aux esclaves, laissant aux citoyens libres le loisir (*skholè*) — d'où vient notre mot « école ».

## Le travail qui humanise
Hegel renverse ce mépris. Dans la dialectique du **maître et de l'esclave**, c'est l'esclave qui, en travaillant la chose, forme le monde et se forme lui-même : il se reconnaît dans son œuvre, tandis que le maître, qui ne fait que consommer, ne produit rien. Marx ajoute la différence décisive : « ce qui distingue dès l'abord le plus mauvais architecte de l'abeille la plus experte, c'est qu'il a construit la cellule dans sa tête avant de la construire dans la ruche ».

## L'aliénation
Mais le travail peut aussi défaire celui qui travaille. Marx appelle **aliénation** la situation où le travailleur ne se reconnaît plus dans son produit : il vend sa force de travail, l'objet lui échappe, la tâche est parcellisée. Adam Smith avait déjà décrit les gains de la division du travail ; Marx en montre le prix humain.

## Œuvre, travail, action
Hannah Arendt distingue le **travail** (qui produit du consommable et recommence sans fin), l'**œuvre** (qui produit un monde durable) et l'**action** (la parole et l'initiative politiques). Sa question reste ouverte : une société qui ne valorise plus que le travail sait-elle encore ce qu'elle fait des deux autres ?`,
          },
          questions: [
            ['Le mot « travail » vient du latin *tripalium*, qui désignait…', ['Un instrument de torture', 'Une charrue', 'Un salaire', 'Un atelier'], 0, 'L’étymologie garde la trace de la peine.'],
            ['Dans la dialectique hégélienne du maître et de l’esclave, qui se transforme en transformant la chose ?', ['L’esclave, par le travail', 'Le maître, par la jouissance', 'Aucun des deux', 'Le spectateur'], 0, 'Le maître consomme, l’esclave forme le monde et se forme.'],
            ['Pour Marx, ce qui distingue l’architecte de l’abeille, c’est…', ['Qu’il conçoit son ouvrage avant de le réaliser', 'Qu’il travaille plus vite', 'Qu’il travaille en groupe', 'Qu’il obéit à son instinct'], 0, 'Le travail humain est d’abord une représentation.'],
            ['Chez les Grecs, le travail manuel était valorisé comme l’activité la plus noble.', ['Vrai', 'Faux'], 1, 'Il était réservé aux esclaves ; la liberté supposait le loisir (*skholè*).'],
            ['L’aliénation, au sens de Marx, désigne…', ['Le fait que le travailleur ne se reconnaisse plus dans son produit', 'Une maladie mentale', 'Le chômage', 'La retraite'], 0, 'Le produit du travail lui devient étranger et hostile.'],
            ['La division du travail augmente la productivité sans aucun coût humain.', ['Vrai', 'Faux'], 1, 'Smith en décrit les gains, Marx la parcellisation qui abrutit.'],
            ['Hannah Arendt distingue le travail, l’œuvre et…', ['L’action', 'Le loisir', 'Le salaire', 'La technique'], 0, 'L’action, c’est la parole et l’initiative dans l’espace public.'],
            ['Le travail peut être à la fois source d’aliénation et d’émancipation.', ['Vrai', 'Faux'], 0, 'C’est toute la tension de la notion : il fait l’homme et peut le défaire.'],
          ],
        },
        // ------------------------------------------------------------------
        {
          titre: 'L’État',
          lecon: {
            titre: 'Pourquoi obéir à un pouvoir commun',
            cours: `L'État n'est pas la société : c'est l'institution qui détient le pouvoir politique sur un territoire, avec ses lois, son administration, sa police, ses tribunaux.

## Le pari de Hobbes
Sans pouvoir commun, dit Hobbes, les hommes sont dans « la guerre de tous contre tous », et la vie y est « solitaire, misérable, dangereuse, animale et brève ». Chacun renonce alors à son droit sur tout au profit d'un souverain — le **Léviathan** — en échange de la sécurité. L'État naît d'un **contrat**, non de la nature.

## Les autres contrats
Locke n'accepte pas un pouvoir absolu : les individus ont des droits naturels (vie, liberté, propriété) que l'État doit **garantir**, et qu'il perd le droit de gouverner s'il les viole. Rousseau change encore la donne : le peuple ne se donne pas un maître, il devient souverain ; obéir à la **volonté générale** exprimée par la loi, c'est n'obéir qu'à soi-même.

## Ce qui définit l'État moderne
Max Weber le définit par le **monopole de la violence physique légitime** sur un territoire donné : l'État seul peut contraindre légalement, et cette contrainte est reconnue comme fondée. S'y ajoutent l'impersonnalité du droit et une administration réglée.

## Les critiques
Pour Marx, l'État n'est pas neutre : il est l'instrument par lequel une classe maintient sa domination. La Boétie s'étonne d'autre chose — de la **servitude volontaire**, qui fait que des millions d'hommes obéissent à un seul sans y être forcés. Reste alors la question de fond : jusqu'où l'État doit-il aller, et où commence la tyrannie ?`,
          },
          questions: [
            ['Pour Hobbes, l’État naît…', ['D’un contrat par lequel chacun renonce à son droit sur tout', 'De la nature humaine sociable', 'De la volonté divine', 'De la conquête militaire uniquement'], 0, 'C’est un artifice destiné à sortir de la guerre de tous contre tous.'],
            ['Max Weber définit l’État par…', ['Le monopole de la violence physique légitime', 'La taille de son territoire', 'La richesse de sa population', 'L’ancienneté de ses lois'], 0, 'Seul l’État peut contraindre légalement, et cette contrainte est reconnue.'],
            ['Chez Locke, l’État a pour fin de garantir des droits naturels.', ['Vrai', 'Faux'], 0, 'Vie, liberté, propriété : s’il les viole, il perd sa légitimité.'],
            ['Pour Rousseau, la loi doit exprimer…', ['La volonté générale', 'La volonté du prince', 'La somme des intérêts particuliers', 'La coutume ancienne'], 0, 'Obéir à la loi qu’on s’est prescrite, c’est rester libre.'],
            ['L’État et la société sont deux termes équivalents.', ['Vrai', 'Faux'], 1, 'La société est l’ensemble des relations humaines ; l’État en est l’institution politique.'],
            ['Pour Marx, l’État est un arbitre neutre entre les classes sociales.', ['Vrai', 'Faux'], 1, 'Il y voit l’instrument de domination de la classe dominante.'],
            ['La Boétie s’étonne surtout…', ['Que les hommes obéissent sans y être contraints', 'Que les tyrans soient nombreux', 'Que la guerre existe', 'Que les lois changent'], 0, 'C’est le paradoxe de la servitude volontaire.'],
            ['Le Léviathan désigne, chez Hobbes…', ['Le souverain, corps artificiel formé de tous', 'Un monstre marin réel', 'Le peuple révolté', 'La loi naturelle'], 0, 'La figure biblique sert d’image à la puissance publique.'],
          ],
        },
        // ------------------------------------------------------------------
        {
          titre: 'La justice et le droit',
          lecon: {
            titre: 'Le juste, le légal, le légitime',
            cours: `Le droit dit ce qui est **légal** ; la justice demande ce qui est **légitime**. Tant que les deux coïncident, la question dort ; c'est quand une loi paraît injuste qu'elle se réveille.

## Droit positif et droit naturel
Le **droit positif** est l'ensemble des règles effectivement en vigueur dans une société, à une époque. Le **droit naturel** désigne des principes valables indépendamment des lois écrites, auxquels on peut les mesurer. Antigone, chez Sophocle, oppose déjà « les lois non écrites des dieux » à l'édit de Créon : la scène pose le problème une fois pour toutes.

## Les deux justices d'Aristote
La justice **distributive** répartit les biens et les honneurs selon le mérite : c'est une égalité **proportionnelle** (à chacun selon sa contribution). La justice **corrective** rétablit l'équilibre rompu par un tort, indépendamment des personnes : c'est une égalité **arithmétique**. Confondre les deux, c'est se tromper d'exigence.

## La force et la justice
Pascal constate froidement : « ne pouvant faire que ce qui est juste fût fort, on a fait que ce qui est fort fût juste ». Rawls cherche une issue : imaginons des personnes choisissant les règles de leur société sous un **voile d'ignorance**, sans savoir la place qu'elles y occuperont. Elles n'accepteraient d'inégalités que si elles profitent aux plus défavorisés.

## Punir
Pourquoi punir ? Par **rétribution** — la peine répare l'ordre rompu, elle est due au crime ; ou par **prévention** — elle dissuade et protège. Beccaria en tire une règle qui a fait le droit pénal moderne : ce n'est pas la sévérité de la peine qui dissuade, mais sa certitude.`,
          },
          questions: [
            ['Le droit positif désigne…', ['Les règles effectivement en vigueur dans une société', 'Les principes universels de la morale', 'Les droits que l’on mérite', 'Les lois favorables aux citoyens'], 0, 'Il s’oppose au droit naturel, qui sert à le juger.'],
            ['Dans *Antigone*, l’héroïne oppose à l’édit de Créon…', ['Les lois non écrites', 'Un autre décret royal', 'La coutume militaire', 'Le droit de propriété'], 0, 'La pièce met en scène le conflit du légal et du légitime.'],
            ['La justice distributive d’Aristote repose sur une égalité…', ['Proportionnelle au mérite', 'Strictement arithmétique', 'Décidée par le sort', 'Fondée sur la naissance'], 0, 'À chacun selon sa contribution : ce n’est pas donner la même chose à tous.'],
            ['La justice corrective tient compte du mérite des personnes.', ['Vrai', 'Faux'], 1, 'Elle répare un tort en ignorant qui l’a commis ou subi.'],
            ['Une loi peut être légale sans être légitime.', ['Vrai', 'Faux'], 0, 'Les lois raciales ou esclavagistes en sont l’exemple historique.'],
            ['Le « voile d’ignorance » de Rawls consiste à choisir les règles…', ['Sans savoir quelle place on occupera dans la société', 'En ignorant les lois existantes', 'Sans consulter les citoyens', 'Au hasard'], 0, 'L’impartialité vient de l’ignorance de son propre intérêt.'],
            ['Selon Beccaria, c’est la sévérité de la peine, plus que sa certitude, qui dissuade.', ['Vrai', 'Faux'], 1, 'Il soutient l’inverse : la certitude d’être puni compte davantage.'],
            ['Punir par rétribution, c’est punir…', ['Parce que la faute a été commise', 'Pour l’exemple', 'Pour protéger la société', 'Pour rééduquer le condamné'], 0, 'La peine y est due au crime, non calculée sur ses effets.'],
          ],
        },
        // ------------------------------------------------------------------
        {
          titre: 'Le devoir',
          lecon: {
            titre: 'Agir par devoir',
            cours: `Le devoir n'est pas la contrainte. La contrainte me force de l'extérieur ; l'obligation morale me lie de l'intérieur — je peux toujours y désobéir, et c'est pourquoi elle a un sens.

## Par devoir, ou conformément au devoir
Kant introduit la distinction décisive. Le commerçant honnête par intérêt agit **conformément** au devoir ; celui qui l'est parce que c'est juste agit **par** devoir. Seule la seconde intention a une valeur morale : « il n'est rien dans le monde que l'on puisse concevoir sans restriction comme bon, à l'exception d'une bonne volonté ».

## L'impératif catégorique
Un impératif **hypothétique** dit : si tu veux X, fais Y. L'impératif **catégorique** commande sans condition. Kant en donne deux formulations à retenir : « agis uniquement d'après la maxime qui fait que tu peux vouloir en même temps qu'elle devienne une loi universelle » ; et « agis de façon à traiter l'humanité, en toi comme en autrui, toujours en même temps comme une fin, jamais simplement comme un moyen ».

## Les objections
Benjamin Constant objecte le cas du mensonge : faut-il dire la vérité à l'assassin qui cherche sa victime ? L'**utilitarisme** (Bentham, Mill) répond autrement — une action est bonne selon ses conséquences, par la plus grande somme de bonheur du plus grand nombre. Nietzsche, lui, soupçonne : la morale du devoir serait une invention des faibles, un **ressentiment** retourné en vertu.

## Conviction et responsabilité
Max Weber propose une sortie utile : l'**éthique de conviction** juge l'acte sur son principe, l'**éthique de responsabilité** sur ses effets prévisibles. Un homme d'action sérieux tient les deux, sans jamais les confondre.`,
          },
          questions: [
            ['Chez Kant, agir « conformément au devoir » sans agir « par devoir », c’est…', ['Faire ce qu’il faut, mais par intérêt', 'Désobéir à la loi', 'Agir sans réfléchir', 'Agir par pitié'], 0, 'L’acte est correct, mais sa valeur morale est nulle.'],
            ['Un impératif catégorique commande…', ['Sans condition', 'Si l’on veut être heureux', 'Si la loi l’exige', 'Si autrui l’approuve'], 0, 'L’impératif hypothétique, lui, est un simple moyen en vue d’une fin.'],
            ['Kant demande de traiter l’humanité toujours en même temps comme une fin, jamais simplement comme un moyen.', ['Vrai', 'Faux'], 0, 'C’est la deuxième formulation de l’impératif catégorique.'],
            ['Le critère d’universalisation kantien demande de se demander…', ['Ce qui se passerait si tout le monde agissait ainsi', 'Ce qui me rendrait heureux', 'Ce que la loi autorise', 'Ce que ferait la majorité'], 0, 'Une maxime qui se détruit en devenant universelle est immorale.'],
            ['L’utilitarisme juge une action…', ['À ses conséquences sur le bonheur du plus grand nombre', 'À l’intention qui l’anime', 'À sa conformité à la coutume', 'À la sincérité de son auteur'], 0, 'Bentham et Mill s’opposent en cela au formalisme kantien.'],
            ['Benjamin Constant objecte à Kant le cas du mensonge fait à un assassin.', ['Vrai', 'Faux'], 0, 'L’interdit absolu du mensonge se heurte là à une conséquence intolérable.'],
            ['Pour Nietzsche, la morale du devoir…', ['Est suspecte : elle traduirait le ressentiment des faibles', 'Est le sommet de la civilisation', 'Vient directement de la nature', 'Est un fait scientifique'], 0, 'Il en fait la généalogie plutôt que d’en accepter l’évidence.'],
            ['L’éthique de responsabilité, chez Weber, juge l’acte sur son seul principe.', ['Vrai', 'Faux'], 1, 'Elle le juge sur ses effets prévisibles ; c’est l’éthique de conviction qui s’en tient au principe.'],
          ],
        },
        // ------------------------------------------------------------------
        {
          titre: 'La raison',
          lecon: {
            titre: 'Le pouvoir de rendre raison',
            cours: `La raison est double : c'est la **faculté** de penser et de juger, et c'est aussi la **cause** d'une chose — « la raison de ce phénomène ». Les deux sens tiennent ensemble : rendre raison, c'est expliquer.

## Le principe de raison
Leibniz le formule : « rien n'arrive sans qu'il y ait une raison suffisante ». C'est ce principe qui interdit de se satisfaire du hasard ou du merveilleux, et qui a fait sortir la pensée du mythe : au lieu de raconter comment le monde est né, on cherche par quoi il s'explique.

## Rationalisme et empirisme
Descartes soutient que la raison — « la chose du monde la mieux partagée » — peut atteindre le vrai par ses seules idées claires et distinctes. Hume répond que toute connaissance vient de l'**expérience**, et que notre idée de causalité n'est qu'une habitude : nous avons vu mille fois B suivre A, nous n'avons jamais vu de lien nécessaire. Kant tranche : « des pensées sans contenu sont vides, des intuitions sans concepts sont aveugles » — il faut les deux.

## Les limites de la raison
Kant montre que la raison s'égare quand elle veut connaître ce qui excède toute expérience possible (Dieu, l'âme, le monde comme totalité) : elle produit alors des raisonnements également démontrables et contradictoires. Pascal ajoute : « le cœur a ses raisons que la raison ne connaît point » — non pour renoncer à penser, mais pour marquer un autre ordre.

## Raison et histoire
Les Lumières font de la raison une émancipation : « Sapere aude ! Aie le courage de te servir de ton propre entendement », écrit Kant. Le XXe siècle apporte la contre-épreuve : une rationalité purement **instrumentale**, qui calcule parfaitement les moyens sans jamais interroger les fins, peut servir le pire.`,
          },
          questions: [
            ['Le principe de raison suffisante, formulé par Leibniz, affirme que…', ['Rien n’arrive sans raison', 'Tout est le fruit du hasard', 'La raison est infaillible', 'Seule l’expérience compte'], 0, 'Il interdit de se contenter du merveilleux ou de l’inexpliqué.'],
            ['Pour Hume, l’idée de causalité nécessaire vient…', ['De l’habitude née de l’expérience répétée', 'D’une intuition innée', 'D’une démonstration mathématique', 'De la révélation'], 0, 'Nous voyons la succession, jamais le lien nécessaire.'],
            ['Descartes affirme que le bon sens est la chose du monde la mieux partagée.', ['Vrai', 'Faux'], 0, 'La raison est entière en chacun ; c’est la méthode qui manque.'],
            ['Selon Kant, « des intuitions sans concepts sont… »', ['Aveugles', 'Vides', 'Fausses', 'Inutiles'], 0, 'Et « des pensées sans contenu sont vides » : connaissance = sensibilité + entendement.'],
            ['La raison peut connaître sans risque d’erreur ce qui dépasse toute expérience possible.', ['Vrai', 'Faux'], 1, 'Kant montre qu’elle y produit des thèses contradictoires également démontrables.'],
            ['« Sapere aude » — la devise des Lumières selon Kant — signifie…', ['Aie le courage de te servir de ton propre entendement', 'Crois ce que l’on t’enseigne', 'Doute de tout', 'Obéis à la loi'], 0, 'Les Lumières sont la sortie de la minorité dont l’homme est responsable.'],
            ['Pascal écrit que « le cœur a ses raisons que la raison ne connaît point » pour…', ['Marquer un autre ordre que celui de la démonstration', 'Rejeter toute pensée rationnelle', 'Défendre la superstition', 'Prouver l’existence de Dieu par la logique'], 0, 'Il distingue les ordres, il ne congédie pas la raison.'],
            ['Une rationalité purement instrumentale calcule les moyens sans interroger les fins.', ['Vrai', 'Faux'], 0, 'C’est la critique adressée à la raison technicienne au XXe siècle.'],
          ],
        },
        // ------------------------------------------------------------------
        {
          titre: 'La liberté de faire ce qui me plaît',
          lecon: {
            titre: 'Indépendance, caprice et licence',
            cours: `Le premier sens du mot est le plus spontané : être libre, ce serait n'être gêné par rien ni personne, faire ce qui me plaît. Ce sens ne résiste pas longtemps à l'examen — et c'est précisément ce qu'une dissertation doit montrer.

## L'indépendance
Au sens le plus simple, la liberté est l'absence d'obstacle : je suis libre quand rien ne m'empêche de faire ce que je veux. Hobbes en reste à cette définition, celle du mouvement sans entrave. Mais elle laisse une question entière : d'où viennent les désirs que je suis ?

## Le caprice n'est pas la liberté
Spinoza prend l'exemple de l'ivrogne « qui croit dire par un libre décret de son esprit ce qu'ensuite, à jeun, il voudrait avoir tu ». Les hommes « se croient libres parce qu'ils ont conscience de leurs actions et ignorants des causes qui les déterminent ». Suivre le premier désir venu, ce n'est pas être libre : c'est obéir à ce qui, en nous, a été mis par autre chose — la mode, l'habitude, la publicité, l'humeur.

## La limite d'autrui
« La liberté consiste à pouvoir faire tout ce qui ne nuit pas à autrui » (Déclaration des droits de l'homme et du citoyen, 1789, article 4). La liberté sans limite est la **licence** : elle se détruit elle-même, puisque la liberté de chacun y devient la proie de la force du plus fort.

## Se libérer de soi
D'où le renversement de toute la tradition : être libre, ce n'est pas assouvir ses désirs, c'est en devenir le maître. Épicure trie ses désirs, les stoïciens s'attachent à ce qui dépend d'eux, Rousseau écrit que « l'impulsion du seul appétit est esclavage, et l'obéissance à la loi qu'on s'est prescrite est liberté ». La liberté cesse d'être un point de départ : elle devient une conquête.`,
          },
          questions: [
            ['Définir la liberté comme simple absence d’obstacle, c’est en rester…', ['À l’indépendance', 'À l’autonomie', 'Au libre arbitre', 'À la liberté politique'], 0, 'C’est le premier sens, celui du mouvement sans entrave.'],
            ['Selon Spinoza, les hommes se croient libres parce qu’ils…', ['Ignorent les causes qui les déterminent', 'Connaissent parfaitement leurs raisons', 'Obéissent à la loi', 'Sont capables de résister à leurs désirs'], 0, 'Ils ont conscience de leurs actions, non de leurs causes.'],
            ['L’exemple spinoziste de l’ivrogne montre que la conscience de vouloir suffit à prouver la liberté.', ['Vrai', 'Faux'], 1, 'Il montre exactement le contraire : on peut se croire libre en étant déterminé.'],
            ['Selon l’article 4 de la Déclaration de 1789, la liberté consiste à pouvoir faire…', ['Tout ce qui ne nuit pas à autrui', 'Tout ce que l’on désire', 'Ce que la majorité décide', 'Ce que la nature commande'], 0, 'La limite n’est pas une atteinte à la liberté : elle la rend possible pour tous.'],
            ['La licence désigne…', ['Une liberté sans limite, qui se détruit elle-même', 'Une autorisation administrative', 'La liberté d’expression', 'L’obéissance à la loi'], 0, 'Sans règle, la liberté de chacun devient la proie du plus fort.'],
            ['Pour Rousseau, « l’impulsion du seul appétit est esclavage ».', ['Vrai', 'Faux'], 0, '« …et l’obéissance à la loi qu’on s’est prescrite est liberté. »'],
            ['Le renversement opéré par la tradition philosophique consiste à dire qu’être libre, c’est…', ['Devenir maître de ses désirs', 'Satisfaire tous ses désirs', 'Supprimer toute règle', 'Ignorer autrui'], 0, 'La liberté devient une conquête, non un point de départ.'],
            ['Mes désirs sont toujours entièrement les miens, sans influence extérieure.', ['Vrai', 'Faux'], 1, 'Habitude, éducation, mode et publicité en façonnent une bonne part.'],
          ],
        },
        // ------------------------------------------------------------------
        {
          titre: 'Le libre arbitre',
          lecon: {
            titre: 'Sommes-nous les auteurs de nos actes ?',
            cours: `Le libre arbitre est le pouvoir de choisir entre plusieurs possibles, et d'avoir pu faire autrement. Sans lui, la responsabilité et le mérite s'effondrent : on ne juge pas une pierre qui tombe.

## Le pouvoir de la volonté
Descartes fait de la volonté ce qu'il y a de plus grand en nous : « elle est si ample qu'elle nous rend en quelque façon semblables à Dieu ». Mais il ajoute une nuance qu'on oublie souvent : la **liberté d'indifférence** — choisir sans aucune raison, à pile ou face — est « le plus bas degré de la liberté ». Choisir librement, c'est choisir en connaissance de cause.

## Le déterminisme
Toute chose a une cause ; nos actes aussi. Spinoza y voit une illusion tenace, et Laplace pousse l'idée jusqu'au bout : une intelligence qui connaîtrait toutes les forces et toutes les positions à un instant donné saurait l'avenir. Les sciences humaines rendent l'objection concrète — origine sociale, éducation, neurologie, contexte : nos décisions sont conditionnées.

## Une confusion à éviter
Le **fatalisme** dit que l'avenir arrivera quoi que je fasse : mes actes ne changent rien. Le **déterminisme** dit que mes actes ont des causes — mais ils sont bien des causes à leur tour. C'est très différent : un déterministe conséquent peut soutenir que ce que je fais compte, tout en niant que j'aurais pu faire autrement.

## Sauver la liberté
Kant sépare les plans : comme phénomène, je suis soumis aux lois de la nature ; comme sujet moral, je dois me penser libre, sinon le devoir n'aurait aucun sens. Sartre va plus loin : l'homme est « condamné à être libre », il ne peut pas ne pas choisir, et invoquer ses déterminations est déjà un choix — celui de la mauvaise foi.`,
          },
          questions: [
            ['Le libre arbitre est le pouvoir…', ['De choisir entre plusieurs possibles', 'De faire ce qui plaît', 'De vivre sans lois', 'De prévoir l’avenir'], 0, 'Sans lui, il n’y a ni mérite ni responsabilité.'],
            ['Pour Descartes, la liberté d’indifférence — choisir sans raison — est…', ['Le plus bas degré de la liberté', 'La liberté la plus haute', 'Une impossibilité logique', 'Le fondement de la morale'], 0, 'Choisir vraiment librement, c’est choisir éclairé.'],
            ['Le déterminisme affirme que tout événement a une cause.', ['Vrai', 'Faux'], 0, 'Y compris nos décisions, qui ne tombent pas du ciel.'],
            ['Fatalisme et déterminisme sont deux noms pour la même thèse.', ['Vrai', 'Faux'], 1, 'Le fataliste dit que nos actes ne changent rien ; le déterministe dit qu’ils ont des causes, et produisent des effets.'],
            ['L’intelligence imaginée par Laplace…', ['Connaîtrait tout l’avenir à partir de l’état présent du monde', 'Serait incapable de calculer', 'Créerait le monde', 'Déciderait de nos actes'], 0, 'C’est la figure limite du déterminisme scientifique.'],
            ['Pour Kant, la liberté est…', ['Un postulat que la loi morale exige', 'Un fait observable', 'Une illusion à écarter', 'Un privilège des savants'], 0, 'Le « tu dois » n’aurait aucun sens sans le « tu peux ».'],
            ['Selon Sartre, l’homme est « condamné à être libre ».', ['Vrai', 'Faux'], 0, 'Il n’a pas choisi d’exister, mais ne peut pas ne pas choisir.'],
            ['Invoquer ses déterminations pour s’excuser, c’est, selon Sartre…', ['Encore un choix, celui de la mauvaise foi', 'Une preuve scientifique', 'Un acte de courage', 'Une impossibilité'], 0, 'La fuite devant la liberté est elle-même une conduite libre.'],
          ],
        },
        // ------------------------------------------------------------------
        {
          titre: 'La liberté politique',
          lecon: {
            titre: 'Obéir à la loi qu’on s’est prescrite',
            cours: `Comment être libre dans une société qui impose des lois ? La réponse dépend de ce que l'on met sous le mot : ou bien la loi est l'ennemie de la liberté, ou bien elle en est la condition.

## La loi rend libre
Pour Rousseau, l'obéissance n'est pas la servitude quand la loi est l'expression de la **volonté générale** : le citoyen obéit à ce qu'il a voulu comme membre du souverain. Ce qui compte n'est donc pas la quantité de lois, mais leur origine. Sans loi, ce n'est pas la liberté qui règne : c'est la force.

## Deux libertés
Benjamin Constant distingue la liberté des **Anciens** — participer directement aux décisions collectives, quitte à ce que l'individu soit entièrement soumis à la cité — et la liberté des **Modernes** : jouir paisiblement de son indépendance privée, avec des droits garantis contre le pouvoir. Une démocratie sérieuse tient les deux, sans sacrifier l'une à l'autre.

## Les garanties
La liberté politique ne repose pas sur la vertu des gouvernants mais sur des **institutions**. Montesquieu : « pour qu'on ne puisse abuser du pouvoir, il faut que, par la disposition des choses, le pouvoir arrête le pouvoir » — d'où la séparation des pouvoirs, l'État de droit, l'indépendance de la justice et la liberté de la presse.

## Les menaces
Tocqueville avertit contre la **tyrannie de la majorité** : un pouvoir légitime par le nombre peut écraser les minorités et l'esprit d'indépendance. Mill pose la limite : la seule raison d'user de la contrainte envers un individu est d'**empêcher qu'il ne nuise à autrui**. Reste la question limite : que faire quand la loi est injuste ? La désobéissance civile assume la sanction, publiquement, au nom du droit lui-même.`,
          },
          questions: [
            ['Pour Rousseau, l’obéissance à la loi est compatible avec la liberté quand la loi…', ['Exprime la volonté générale', 'Vient d’un roi éclairé', 'Est ancienne', 'Est peu contraignante'], 0, 'Le citoyen obéit alors à ce qu’il a lui-même voulu.'],
            ['La liberté des Anciens, selon Benjamin Constant, consiste à…', ['Participer directement aux décisions collectives', 'Jouir de son indépendance privée', 'Voyager librement', 'Choisir sa religion'], 0, 'Celle des Modernes est au contraire l’indépendance individuelle garantie.'],
            ['Montesquieu écrit qu’il faut que « le pouvoir arrête le pouvoir ».', ['Vrai', 'Faux'], 0, 'C’est le principe de la séparation des pouvoirs.'],
            ['La liberté politique repose avant tout sur la vertu personnelle des gouvernants.', ['Vrai', 'Faux'], 1, 'Elle repose sur des institutions et des contre-pouvoirs, précisément parce qu’on ne peut pas compter sur la vertu.'],
            ['La « tyrannie de la majorité » désigne, chez Tocqueville…', ['L’oppression exercée au nom du nombre', 'Le pouvoir d’un tyran isolé', 'Le règne des experts', 'L’absence de gouvernement'], 0, 'Une décision majoritaire n’est pas pour autant juste.'],
            ['Selon Mill, la seule raison d’exercer une contrainte sur quelqu’un est…', ['D’empêcher qu’il ne nuise à autrui', 'De le rendre meilleur', 'De protéger la tradition', 'De faire respecter la majorité'], 0, 'C’est le principe de non-nuisance, cœur du libéralisme politique.'],
            ['L’absence totale de lois garantit la liberté de chacun.', ['Vrai', 'Faux'], 1, 'Sans loi, c’est la force qui règne, et le plus fort qui décide.'],
            ['La désobéissance civile se caractérise par…', ['Une infraction publique qui assume la sanction', 'Une révolte armée', 'Une fraude discrète', 'Un vote de protestation'], 0, 'Elle conteste une loi injuste au nom du droit lui-même.'],
          ],
        },
        // ------------------------------------------------------------------
        {
          titre: 'Le langage',
          lecon: {
            titre: 'Parler, penser, agir',
            cours: `Le **langage** est la faculté de communiquer par des signes ; une **langue** est le système particulier d'une communauté ; la **parole** en est l'usage individuel. Trois mots à ne pas confondre.

## Le signe et la convention
Saussure décompose le signe en **signifiant** (l'image sonore) et **signifié** (le concept), et pose que leur lien est **arbitraire** : rien dans l'animal n'impose le mot « chien » plutôt que *dog*. Arbitraire ne veut pas dire libre : le locuteur ne peut pas changer sa langue à volonté, elle lui préexiste.

## Le langage et la pensée
Peut-on penser sans mots ? Hegel soutient que c'est dans le mot que la pensée trouve son existence : sans langage, elle reste une brume. Bergson objecte que le mot commun écrase la nuance et la singularité du vécu : « le mot brutal, qui emmagasine ce qu'il y a de stable, d'impersonnel dans les impressions de l'humanité, écrase les impressions délicates et fugitives de notre conscience individuelle ». Les deux ont raison contre un tiers : le langage rend la pensée possible **et** la trahit.

## Parler, c'est agir
Austin remarque que certaines phrases ne décrivent rien : « je promets », « je te baptise », « la séance est ouverte » — ce sont des **performatifs**, elles font ce qu'elles disent. D'où le pouvoir des mots : promettre, insulter, ordonner, séduire, propager. Une langue truquée fabrique une pensée truquée — c'est ce que montrent les analyses de la propagande.

## Le propre de l'homme ?
Les abeilles transmettent des informations, certains animaux communiquent. Mais Benveniste souligne une différence : leur code est fixe, sans dialogue ni combinaison libre. Descartes en tirait un argument : ce qui manque aux animaux n'est pas la voix, c'est le pouvoir d'arranger des mots pour répondre à toute situation nouvelle.`,
          },
          questions: [
            ['Chez Saussure, le lien entre signifiant et signifié est…', ['Arbitraire', 'Naturel', 'Imposé par la logique', 'Décidé par chaque locuteur'], 0, 'Rien dans l’animal n’impose le mot « chien » plutôt que *dog*.'],
            ['« Arbitraire » signifie que chaque locuteur peut changer sa langue à volonté.', ['Vrai', 'Faux'], 1, 'La langue est une institution collective, qui préexiste à celui qui la parle.'],
            ['La distinction langue / parole oppose…', ['Le système commun et son usage individuel', 'L’écrit et l’oral', 'Le vrai et le faux', 'La grammaire et le vocabulaire'], 0, 'La langue est sociale, la parole est un acte.'],
            ['Pour Bergson, le mot risque…', ['D’écraser la singularité de ce que nous ressentons', 'De rendre la pensée impossible', 'De remplacer la logique', 'De supprimer la mémoire'], 0, 'Le mot commun ne dit que ce qu’il y a de stable et d’impersonnel.'],
            ['Un énoncé performatif…', ['Accomplit l’acte qu’il énonce', 'Décrit un fait', 'Est toujours faux', 'Est une question'], 0, '« Je promets », « la séance est ouverte » : dire, c’est faire.'],
            ['Hegel estime que la pensée trouve son existence dans le mot.', ['Vrai', 'Faux'], 0, 'Sans langage, elle reste indéterminée.'],
            ['Ce qui distingue le langage humain de la communication animale, c’est notamment…', ['La combinaison libre des signes et le dialogue', 'Le volume sonore', 'Le nombre de signaux', 'La rapidité de transmission'], 0, 'Le code des abeilles est fixe : il ne se répond pas.'],
            ['Le langage sert uniquement à décrire la réalité.', ['Vrai', 'Faux'], 1, 'Il agit aussi : promettre, ordonner, blesser, engager.'],
          ],
        },
        // ------------------------------------------------------------------
        {
          titre: 'La vérité',
          lecon: {
            titre: 'Ce qui se dit du discours',
            cours: `Une chose n'est ni vraie ni fausse : elle est. Le vrai et le faux se disent d'un **jugement**, d'une proposition. C'est la première précaution à prendre, et elle règle déjà la moitié des confusions.

## La définition classique
Est vrai le discours **conforme à ce qui est** : c'est la vérité-correspondance, ou adéquation. La difficulté saute aux yeux : pour comparer mon idée à la chose, il faudrait sortir de ma pensée. D'où d'autres critères — la **cohérence** (pas de contradiction), l'**évidence** (Descartes : ce qui se présente si clairement à l'esprit qu'on ne peut en douter), la **vérification** par l'expérience.

## Vérité, réalité, opinion
Le vrai n'est pas le réel, et il n'est pas non plus le vraisemblable. L'**opinion** (*doxa*) est un avis reçu sans examen : elle peut se trouver juste par accident, mais elle ne sait pas pourquoi elle l'est. Dans l'allégorie de la caverne, Platon décrit des prisonniers qui prennent les ombres pour la réalité — et qui n'accueillent pas volontiers celui qui revient leur dire qu'ils se trompent.

## Le relativisme et sa réfutation
Protagoras affirme que « l'homme est la mesure de toute chose » : à chacun sa vérité. L'objection est classique et redoutable — si toute vérité est relative, cette affirmation l'est aussi, et se détruit elle-même. Confondre la tolérance (respecter les personnes) et le relativisme (renoncer à distinguer le vrai du faux) revient à désarmer la discussion.

## Vérité et pouvoir
Chercher la vérité n'est pas neutre : elle dérange les intérêts établis. Le procès de Socrate, celui de Galilée, la fabrication moderne du mensonge organisé rappellent que la vérité a besoin d'institutions — écoles, sciences, presse libre — pour être autre chose qu'une opinion parmi d'autres.`,
          },
          questions: [
            ['Le vrai et le faux se disent proprement…', ['D’un jugement ou d’une proposition', 'D’une chose', 'd’une sensation', 'D’une personne'], 0, 'Une chose est réelle ou non, elle n’est pas « vraie ».'],
            ['La définition classique de la vérité est l’adéquation entre le discours et…', ['Ce qui est', 'L’opinion commune', 'L’intérêt général', 'La cohérence interne'], 0, 'C’est la vérité-correspondance.'],
            ['Chez Platon, la *doxa* désigne…', ['L’opinion reçue sans examen', 'La science démontrée', 'Le mythe fondateur', 'La vertu politique'], 0, 'Elle peut être juste par hasard, mais elle ignore pourquoi.'],
            ['Dans l’allégorie de la caverne, les prisonniers prennent les ombres pour la réalité.', ['Vrai', 'Faux'], 0, 'Et celui qui revient leur dire la vérité n’est pas bien accueilli.'],
            ['La formule « l’homme est la mesure de toute chose » est de…', ['Protagoras', 'Platon', 'Descartes', 'Kant'], 0, 'Elle résume le relativisme des sophistes.'],
            ['Le relativisme intégral se réfute lui-même.', ['Vrai', 'Faux'], 0, 'Si toute vérité est relative, cette thèse l’est aussi.'],
            ['Le critère cartésien de la vérité est…', ['L’évidence, ce qui est clair et distinct', 'L’accord de la majorité', 'L’utilité pratique', 'L’ancienneté de la thèse'], 0, 'Ce que l’esprit ne peut pas mettre en doute.'],
            ['Tolérance et relativisme signifient la même chose.', ['Vrai', 'Faux'], 1, 'La tolérance respecte les personnes ; le relativisme renonce à distinguer le vrai du faux.'],
          ],
        },
        // ------------------------------------------------------------------
        {
          titre: 'La science',
          lecon: {
            titre: 'Expérience, hypothèse, réfutation',
            cours: `La science ne se définit pas par son objet mais par sa **méthode** : elle explique au lieu de raconter, elle démontre au lieu d'affirmer, et elle accepte d'avoir tort.

## La rupture avec le mythe
Le mythe raconte une origine ; la science cherche des lois. Galilée fait le pas décisif en écrivant que le grand livre de la nature « est écrit en langue mathématique » : mesurer, quantifier, idéaliser (le plan sans frottement, le corps sans résistance de l'air) — la science ne décrit pas le monde tel qu'il apparaît, elle en construit le modèle.

## La méthode expérimentale
Claude Bernard en donne la formule : l'**observation** fait naître une **hypothèse**, l'**expérience** la met à l'épreuve, et le savant doit être prêt à l'abandonner. « L'expérimentateur doit douter, fuir les idées fixes ». Le fait ne parle jamais seul : il ne répond qu'à une question qu'on lui pose.

## Induire, ou réfuter
Passer de « tous les cygnes observés sont blancs » à « tous les cygnes sont blancs », c'est induire — et Hume montre que rien ne le garantit. Popper renverse le problème : aucune expérience ne prouve définitivement une théorie, une seule peut la **réfuter**. Est donc scientifique un énoncé **falsifiable**, qui prend le risque d'être démenti ; une théorie que rien ne pourrait contredire n'est pas invincible, elle est hors du jeu.

## Les révolutions
Bachelard montre que le savoir ne s'accumule pas sagement : il progresse contre des **obstacles épistémologiques**, des évidences familières qu'il faut détruire. Kuhn décrit des **paradigmes** qui se succèdent par crises. La science n'est donc pas un stock de vérités définitives, mais une pratique collective, faillible et contrôlée — ce qui fait sa force, non sa faiblesse.`,
          },
          questions: [
            ['Selon Galilée, le grand livre de la nature est écrit…', ['En langue mathématique', 'En grec ancien', 'Dans le langage des mythes', 'Par la seule observation'], 0, 'Mesurer et quantifier fondent la science moderne.'],
            ['Dans la méthode expérimentale de Claude Bernard, l’hypothèse vient…', ['Après l’observation et avant l’expérience', 'Après l’expérience', 'À la place de l’observation', 'Après la publication'], 0, 'Observation → hypothèse → expérience, avec obligation de douter.'],
            ['Un fait scientifique parle de lui-même, sans hypothèse préalable.', ['Vrai', 'Faux'], 1, 'Il ne répond qu’à une question qu’on lui pose.'],
            ['Le problème de l’induction, souligné par Hume, est que…', ['Aucune répétition observée ne garantit la loi générale', 'L’expérience est impossible', 'Les mathématiques sont fausses', 'La logique est inutile'], 0, 'Le passage du particulier au général n’est jamais démontré.'],
            ['Pour Popper, un énoncé est scientifique s’il est…', ['Falsifiable', 'Invérifiable', 'Approuvé par la majorité des savants', 'Utile'], 0, 'Il doit prendre le risque d’être démenti par l’expérience.'],
            ['Une théorie que rien ne pourrait réfuter est la plus solide des sciences.', ['Vrai', 'Faux'], 1, 'Selon Popper, elle est simplement hors du champ scientifique.'],
            ['Un « obstacle épistémologique », chez Bachelard, désigne…', ['Une évidence familière qui empêche de connaître', 'Un manque de moyens financiers', 'Une erreur de calcul', 'Une censure politique'], 0, 'On connaît contre une connaissance antérieure.'],
            ['Kuhn décrit l’histoire des sciences comme une succession de paradigmes.', ['Vrai', 'Faux'], 0, 'Les périodes de science normale sont interrompues par des révolutions.'],
          ],
        },
        // ------------------------------------------------------------------
        {
          titre: 'La technique',
          lecon: {
            titre: 'Prolonger le corps, transformer le monde',
            cours: `La technique est l'ensemble des procédés et des outils par lesquels l'homme transforme son milieu. Elle n'est pas de la science appliquée : elle lui est bien antérieure — on taillait des silex avant d'avoir des théories.

## L'outil et l'espèce
Bergson propose de nommer notre espèce *Homo faber* plutôt que *sapiens* : l'intelligence se reconnaît d'abord à sa capacité de fabriquer des outils, et des outils pour fabriquer des outils. L'outil prolonge le corps : le marteau prolonge le poing, la roue la marche, l'ordinateur la mémoire.

## Le mythe de Prométhée
Dans le mythe raconté par Protagoras chez Platon, l'homme naît nu, sans griffes ni fourrure : la technique compense un défaut originel. Elle n'est donc pas un luxe mais la condition même de la survie humaine — et Descartes lui donne son programme moderne : connaître la nature pour nous en rendre « comme maîtres et possesseurs », notamment pour la santé.

## Quand le moyen devient une fin
La question moderne n'est plus « la technique est-elle utile ? » mais « qui commande ? ». Heidegger soutient que la technique moderne n'est pas un simple outil neutre : elle impose un regard qui traite tout ce qui existe — la forêt, le fleuve, l'homme — comme un stock disponible. Jacques Ellul décrit un **système technicien** qui se développe selon sa propre logique d'efficacité, sans qu'aucune décision politique ne l'oriente vraiment.

## La responsabilité
Le pouvoir technique a changé d'échelle : il engage désormais des générations qui ne sont pas nées. D'où l'impératif de Hans Jonas : « agis de telle sorte que les effets de ton action soient compatibles avec la permanence d'une vie authentiquement humaine sur terre ». Ce que nous pouvons faire ne dit toujours pas ce que nous devons faire.`,
          },
          questions: [
            ['La technique est-elle née de la science ?', ['Non, elle lui est très antérieure', 'Oui, au XVIIe siècle', 'Oui, au XIXe siècle', 'Oui, dès l’Antiquité grecque'], 0, 'On taillait des outils bien avant toute théorie scientifique.'],
            ['Bergson propose de nommer notre espèce…', ['*Homo faber*', '*Homo sapiens*', '*Homo economicus*', '*Homo ludens*'], 0, 'L’intelligence se mesure d’abord à la fabrication d’outils.'],
            ['Dans le mythe de Prométhée, la technique compense un défaut originel de l’homme.', ['Vrai', 'Faux'], 0, 'Né nu et démuni, l’homme survit par l’art et le feu.'],
            ['Le programme cartésien de maîtrise de la nature visait notamment…', ['La conservation de la santé', 'La domination militaire', 'La contemplation désintéressée', 'La suppression du travail'], 0, 'Descartes en fait explicitement « le premier bien » visé.'],
            ['Pour Heidegger, la technique moderne est un outil parfaitement neutre.', ['Vrai', 'Faux'], 1, 'Elle impose un rapport au monde qui traite tout comme un stock disponible.'],
            ['Jacques Ellul décrit un « système technicien » qui…', ['Se développe selon sa propre logique d’efficacité', 'Est piloté par les philosophes', 'Décline depuis 1950', 'Dépend uniquement des besoins'], 0, 'L’efficacité y devient sa propre justification.'],
            ['Le principe responsabilité de Jonas demande de tenir compte…', ['Des générations futures', 'Du seul intérêt présent', 'De la rentabilité', 'De la tradition'], 0, 'Le pouvoir technique engage ceux qui ne sont pas nés.'],
            ['Ce que nous pouvons techniquement faire indique ce que nous devons faire.', ['Vrai', 'Faux'], 1, 'Du pouvoir on ne déduit aucun devoir : c’est le cœur du problème éthique.'],
          ],
        },
        // ------------------------------------------------------------------
        {
          titre: 'L’art',
          lecon: {
            titre: 'Le beau, l’œuvre et le génie',
            cours: `« Art » a d'abord voulu dire savoir-faire — l'*ars* latine traduit la *technè* grecque. L'art au sens des beaux-arts, activité désintéressée qui produit des œuvres, est une idée récente : elle date du XVIIIe siècle.

## Le beau n'est pas l'agréable
Kant distingue trois jugements. L'**agréable** plaît aux sens, et ne se discute pas (chacun ses goûts). Le **bon** plaît par le concept qu'on en a. Le **beau** plaît « universellement sans concept » : le jugement de goût est **désintéressé** — je ne veux pas posséder ni consommer l'objet — et pourtant je prétends que les autres devraient en juger comme moi. C'est le paradoxe du goût : subjectif, mais qui exige un accord.

## L'œuvre et le produit
L'artisan sait d'avance ce qu'il fabrique, et il peut le refaire à l'identique. L'artiste, dit Kant, travaille par **génie** : « le talent par lequel la nature donne ses règles à l'art » — il produit une œuvre exemplaire dont il ne peut pas expliquer la recette. Walter Benjamin ajoute que la reproduction technique (photo, cinéma, écran) fait perdre à l'œuvre son *hic et nunc*, ce qu'il appelle son **aura**.

## Imiter ou créer
Platon condamne l'art comme imitation d'imitation, éloigné deux fois du vrai. Aristote le réhabilite : la **mimèsis** n'est pas une copie, elle donne à comprendre, et la tragédie opère une **catharsis**, une purgation des passions. L'art moderne, lui, rompt souvent avec la ressemblance : ce qu'il vise n'est plus de reproduire le visible, mais de rendre visible.

## À quoi bon
Hegel voit dans l'art une présentation sensible de la vérité, une manière de penser autrement que par concepts. D'autres y voient une contestation, un plaisir, un marché. Une œuvre peut déplaire et compter ; c'est ce qui distingue l'art du divertissement.`,
          },
          questions: [
            ['Pour Kant, le jugement de goût est…', ['Désintéressé et pourtant prétendument universel', 'Un simple goût personnel sans portée', 'Une connaissance par concepts', 'Un calcul d’utilité'], 0, 'C’est tout le paradoxe du beau : subjectif, mais réclamant l’accord d’autrui.'],
            ['L’agréable et le beau, chez Kant, désignent la même chose.', ['Vrai', 'Faux'], 1, 'L’agréable plaît aux sens et ne se discute pas ; le beau exige un assentiment.'],
            ['Le génie, selon Kant, est…', ['Le talent par lequel la nature donne ses règles à l’art', 'Un savoir-faire enseignable', 'Une intelligence supérieure', 'Le succès commercial'], 0, 'L’artiste ne peut pas expliquer la recette de son œuvre.'],
            ['Platon condamne l’art parce qu’il…', ['Imite ce qui n’est déjà qu’une copie', 'Coûte trop cher', 'Est réservé aux riches', 'Ne plaît à personne'], 0, 'L’art serait éloigné deux fois de la vérité.'],
            ['Pour Aristote, la tragédie opère une catharsis, c’est-à-dire…', ['Une purgation des passions', 'Une leçon de morale explicite', 'Une imitation exacte du réel', 'Un divertissement sans effet'], 0, 'La terreur et la pitié y sont éprouvées puis épurées.'],
            ['Ce que Walter Benjamin appelle l’« aura » se perd avec la reproduction technique.', ['Vrai', 'Faux'], 0, 'L’œuvre perd son ici-et-maintenant unique.'],
            ['L’artisan se distingue de l’artiste en ce qu’il…', ['Sait d’avance ce qu’il produit et peut le refaire', 'Travaille sans outil', 'Ne vend rien', 'Ignore les règles'], 0, 'L’œuvre d’art, elle, n’est pas la réalisation d’un plan préexistant.'],
            ['Une œuvre d’art doit nécessairement plaire pour avoir de la valeur.', ['Vrai', 'Faux'], 1, 'Elle peut déranger, choquer, et compter davantage qu’une œuvre plaisante.'],
          ],
        },
        // ------------------------------------------------------------------
        {
          titre: 'La religion',
          lecon: {
            titre: 'Croire, savoir, relier',
            cours: `Deux étymologies se disputent le mot : *religare*, relier les hommes entre eux et au divin ; *relegere*, recueillir avec scrupule ce qui a été transmis. Les deux disent quelque chose de vrai du phénomène.

## Un fait humain
Une religion, ce n'est pas seulement une croyance : c'est un ensemble de **rites**, de textes, d'interdits et une **communauté**. Durkheim en propose une définition sociologique : elle repose sur le partage du **sacré** et du **profane**, et la société y célèbre aussi, sans le savoir, sa propre unité.

## Croire n'est pas savoir
La foi n'est pas une connaissance imparfaite : elle est d'un autre ordre. Le savant démontre et doit céder devant la preuve contraire ; le croyant adhère et engage sa vie. Les preuves classiques de l'existence de Dieu (l'ordre du monde, la cause première) ont été discutées puis critiquées par Kant : elles dépassent ce que la raison peut établir. Pascal en tire son **pari** — puisque la raison ne tranche pas, il faut miser, et l'enjeu est infini.

## Les soupçons
Feuerbach y voit une **projection** : l'homme met en Dieu ce qu'il y a de meilleur en lui, et s'appauvrit d'autant. Marx la dit « opium du peuple » — consolation réelle d'une misère réelle, mais qui la fait supporter au lieu de la supprimer. Freud parle d'une **illusion** née du désir infantile de protection. Ces critiques ne prouvent pas que Dieu n'existe pas : elles expliquent pourquoi on y croit.

## Tolérance et laïcité
Spinoza et Locke posent une distinction devenue politique : le salut relève de la conscience, l'ordre public relève de l'État. La **laïcité** n'est pas l'hostilité aux religions mais la neutralité de l'État, qui garantit à chacun la liberté de croire, de changer de croyance ou de n'en avoir aucune.`,
          },
          questions: [
            ['L’étymologie *religare* renvoie à l’idée…', ['De lien', 'De secret', 'De sacrifice', 'De loi écrite'], 0, 'Relier les hommes entre eux et au divin.'],
            ['Durkheim définit la religion par…', ['Le partage du sacré et du profane dans une communauté', 'La seule croyance individuelle', 'L’existence d’un livre saint', 'La croyance en un dieu unique'], 0, 'Le fait religieux y est d’abord un fait social.'],
            ['La foi est une connaissance scientifique imparfaite.', ['Vrai', 'Faux'], 1, 'Elle relève d’un autre ordre : on démontre un savoir, on adhère à une foi.'],
            ['Le pari de Pascal repose sur l’idée que…', ['La raison ne peut trancher, il faut donc miser', 'L’existence de Dieu est démontrable', 'La religion est inutile', 'La foi vient de l’expérience'], 0, 'L’enjeu infini commande, selon lui, le choix.'],
            ['Pour Feuerbach, Dieu est…', ['Une projection des qualités humaines', 'Une hypothèse scientifique', 'Une invention des prêtres seuls', 'Une réalité démontrée'], 0, 'L’homme s’appauvrit de ce qu’il attribue au ciel.'],
            ['Marx appelle la religion « l’opium du peuple » pour dire qu’elle…', ['Console d’une misère réelle sans la supprimer', 'Rend les hommes violents', 'Est une drogue interdite', 'Enrichit les pauvres'], 0, 'Elle est « le soupir de la créature opprimée ».'],
            ['Les critiques de Feuerbach, Marx et Freud démontrent que Dieu n’existe pas.', ['Vrai', 'Faux'], 1, 'Elles expliquent la croyance, elles ne réfutent pas son objet.'],
            ['La laïcité, au sens du droit français, signifie…', ['La neutralité de l’État et la liberté de conscience', 'L’interdiction des religions', 'L’obligation d’être athée', 'La religion d’État'], 0, 'Chacun reste libre de croire, de changer de croyance ou de n’en avoir aucune.'],
          ],
        },
        // ------------------------------------------------------------------
        {
          titre: 'Le temps',
          lecon: {
            titre: 'Le passage, la durée, la mort',
            cours: `« Qu'est-ce donc que le temps ? Si personne ne me le demande, je le sais ; si je veux l'expliquer à qui me le demande, je ne le sais plus. » L'aveu d'Augustin dit l'essentiel : rien n'est plus familier ni plus obscur.

## Mesurer le temps
Aristote le définit comme « le nombre du mouvement selon l'antérieur et le postérieur » : sans changement, pas de temps mesurable. Newton en fait au contraire un cadre absolu, qui s'écoule uniformément, indépendant de ce qui s'y produit. Kant renverse encore : le temps n'est ni une chose ni une propriété des choses, c'est la **forme de notre sensibilité**, la manière dont un sujet ordonne nécessairement ses expériences.

## Le temps vécu
Augustin remarque le paradoxe : le passé n'est plus, le futur n'est pas encore, et le présent n'a pas d'épaisseur. Il propose de parler de trois présents : le présent du passé (la mémoire), le présent du présent (l'attention), le présent de l'avenir (l'attente). Bergson oppose le temps **spatialisé** des horloges — des instants juxtaposés, tous équivalents — à la **durée** vécue, continue et hétérogène, où une heure d'ennui et une heure de joie n'ont rien de commun.

## Le temps et la mort
Le temps humain est celui d'un être qui sait qu'il finira. Épicure veut désamorcer la crainte : « la mort n'est rien pour nous, car quand nous sommes, la mort n'est pas là, et quand elle est là, nous ne sommes plus ». Sénèque déplace la question : « ce n'est pas que nous ayons peu de temps, c'est que nous en perdons beaucoup » — et Horace en tire le *carpe diem*, cueille le jour.

## Ce que le temps rend possible
L'irréversibilité fait le regret, le remords, le vieillissement. Mais elle fait aussi le projet, la promesse et l'histoire : parce que le temps passe, mes actes engagent quelque chose. Une existence sans temps ne serait pas éternelle : elle serait sans conséquence.`,
          },
          questions: [
            ['Qui écrit : « Si personne ne me le demande, je le sais ; si je veux l’expliquer, je ne le sais plus » ?', ['Augustin', 'Aristote', 'Bergson', 'Kant'], 0, 'Le livre XI des *Confessions* est le texte de référence sur le temps.'],
            ['Aristote définit le temps comme…', ['Le nombre du mouvement', 'Une illusion de l’esprit', 'Un cadre absolu et vide', 'La forme de la sensibilité'], 0, 'Sans changement, il n’y a pas de temps mesurable.'],
            ['Pour Kant, le temps est une propriété des choses elles-mêmes.', ['Vrai', 'Faux'], 1, 'C’est la forme *a priori* de notre sensibilité, notre manière d’ordonner l’expérience.'],
            ['Les « trois présents » d’Augustin sont…', ['Mémoire, attention, attente', 'Passé, présent, futur', 'Enfance, âge adulte, vieillesse', 'Instant, durée, éternité'], 0, 'Le passé n’est plus et le futur n’est pas encore : seul le présent de l’âme les tient.'],
            ['La durée bergsonienne s’oppose au temps des horloges parce qu’elle est…', ['Continue et hétérogène', 'Divisible en instants égaux', 'Mesurable avec précision', 'Identique pour tous'], 0, 'Une heure d’ennui et une heure de joie ne se valent pas.'],
            ['Selon Épicure, « la mort n’est rien pour nous ».', ['Vrai', 'Faux'], 0, 'Quand nous sommes, elle n’est pas là ; quand elle est là, nous ne sommes plus.'],
            ['Sénèque soutient que…', ['Nous perdons beaucoup de temps plutôt que nous n’en manquons', 'La vie est trop courte par nature', 'Le temps n’existe pas', 'Il faut vivre pour l’avenir'], 0, '« La vie est assez longue pour qui sait en user. »'],
            ['L’irréversibilité du temps ne fait que des malheurs : regret, vieillissement.', ['Vrai', 'Faux'], 1, 'Elle rend aussi possibles le projet, la promesse et l’histoire.'],
          ],
        },
      ],
    },
  ],
}
