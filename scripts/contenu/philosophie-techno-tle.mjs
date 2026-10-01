// Philosophie — Terminale de la VOIE TECHNOLOGIQUE (toutes séries : STMG,
// STI2D, STL, ST2S, STD2A, STHR, S2TMD).
//
// SOURCE : programme de l'arrêté du 19 juillet 2019 (BO spécial n° 8 du
// 25 juillet 2019), document « Philosophie, classe terminale, enseignement
// commun, voie technologique ». La voie technologique n'étudie que SEPT notions
// — L'art, La justice, La liberté, La nature, La religion, La technique, La
// vérité — contre dix-sept en voie générale ; la liste d'auteurs et les
// 34 repères sont les mêmes. L'étude suivie d'une œuvre n'y est pas
// obligatoire, mais « l'étude de textes d'une ampleur suffisante » l'est.
//
// L'ÉPREUVE (4 h, coefficient 4) : trois sujets au choix, deux dissertations et
// une explication de texte. Propre à la voie technologique : l'explication se
// rédige AU CHOIX en répondant dans l'ordre aux questions posées (option 1 :
// éléments d'analyse, éléments de synthèse, commentaire) ou en suivant son
// propre développement (option 2) — format relevé sur le sujet officiel de la
// session 2026. La note de service qui définit l'épreuve à compter de la
// session 2027 est parue au BO n° 4 de 2026 (MENE2622663N).
//
// Découpage : une fiche par notion (7), les repères en deux fiches (regroupés
// par usage : raisonner et prouver / définir et juger), puis la méthode de la
// dissertation et celle de l'explication de texte, version techno. Chaque
// notion est posée comme un PROBLÈME, avec deux ou trois positions repérables :
// c'est ce qui se réutilise dans une copie.

export default {
  slug: 'philosophie-techno',
  nom: 'Philosophie',

  titreMigration: 'PHILOSOPHIE Tle techno — les 7 notions, les repères et l’épreuve',

  motif: `La philosophie de la voie technologique est une matière à part : sept
notions (l'art, la justice, la liberté, la nature, la religion, la technique, la
vérité), les 34 repères et une épreuve de 4 h dont l'explication de texte peut
se traiter en répondant à des questions. Un élève de Tle techno ne trouvait
jusqu'ici que le programme de la voie générale, dix notions de trop et une
méthode qui n'était pas la sienne. Cette migration installe 11 fiches : les sept
notions, les repères en deux fiches, la méthode de la dissertation et celle de
l'explication de texte.`,

  blocs: [
    {
      niveaux: ['Tle'],
      positionDepart: 1,
      chapitres: [
        // ------------------------------------------------------------------
        {
          titre: 'L’art',
          axe: 'Les notions du programme',
          lecon: {
            titre: 'Faire une œuvre, juger du beau',
            cours: `Un tableau ne sert à rien, et pourtant on le garde des siècles quand on jette un grille-pain au bout de dix ans. Qu’est-ce qui fait qu’un objet devient une **œuvre** ?

## Art, artisanat, technique
Le mot latin *ars* traduit le grec *technè* : un savoir-faire réglé. Pendant longtemps, le peintre et le menuisier relèvent du même mot. La distinction moderne se fait par la **fin** visée.

| | Ce qu’il produit | Ce qu’on en attend |
| L’artisan | Un objet d’usage | Qu’il serve, puis s’use |
| L’artiste | Une œuvre | Qu’elle soit contemplée, et qu’elle dure |

**Hannah Arendt** note que l’œuvre d’art est l’objet le plus durable du monde humain : elle échappe à la consommation.

## L’art imite-t-il la nature ?
**Platon** se méfie de la peinture : le peintre copie le lit du menuisier, qui copie lui-même l’Idée du lit. L’image est une copie de copie, **éloignée de trois degrés** de la vérité. L’art trompe.

**Hegel** renverse le jugement : la beauté artistique est **supérieure** à la beauté naturelle, parce qu’elle est née de l’esprit. Une œuvre n’imite pas, elle **manifeste** une idée sous une forme sensible.

**Bergson** va plus loin : l’artiste voit ce que nous ne voyons plus, parce que nous regardons les choses selon leur utilité. Il **dévoile** le réel au lieu de le recopier.

## Le beau se discute-t-il ?
« Des goûts et des couleurs on ne discute pas » : le proverbe réduit le beau à l’**agréable**, qui est personnel.

| | L’agréable | Le beau (selon Kant) |
| Sa source | Mes sens, mon intérêt | Un libre jeu de mes facultés |
| Sa portée | « Cela me plaît » | « C’est beau » : je parle pour tous |
| Intérêt | Je veux posséder, consommer | Plaisir **désintéressé** |

**Kant** : le beau est ce qui plaît **universellement sans concept**. Je ne peux pas prouver qu’une œuvre est belle, mais en le disant j’attends l’accord des autres.

**Hume** propose un critère d’expérience : l’épreuve du **temps**. Les modes passent ; les œuvres qui plaisent encore à des époques et des peuples différents ont une valeur qui dépasse le préjugé.

## Le génie
Une œuvre n’est pas l’application d’une recette. Pour Kant, le **génie** est le talent qui **donne ses règles à l’art** : il invente une manière que d’autres imiteront ensuite.

> L’art n’est ni une copie du monde ni un caprice : il rend visible, sous une forme sensible, ce que nous ne savions pas voir.

## Exemple d’usage en copie
Sujet : « Une œuvre d’art peut-elle être inutile ? » On distingue l’**utile** (servir à une fin) et le **précieux** ; l’œuvre ne sert à rien, et c’est justement ce qui lui permet de nous apprendre à regarder.`,
          },
          questions: [
            ['Que signifiait d’abord le mot latin *ars* ?', ['Une œuvre de musée', 'Une émotion forte', 'Un savoir-faire réglé', 'Un don divin'], 2, '*Ars* traduit le grec *technè* : l’artisan et l’artiste portaient le même nom.'],
            ['Pour Platon, pourquoi la peinture d’un lit est-elle trompeuse ?', ['Elle coûte plus cher que le lit', 'Elle représente mal les couleurs', 'Elle est réservée aux riches', 'Elle ne copie qu’une copie de l’Idée du lit'], 3, 'Le lit peint imite le lit du menuisier, qui imite l’Idée : trois degrés d’éloignement.'],
            ['Pour Hegel, la beauté artistique est…', ['Supérieure à la beauté naturelle, car née de l’esprit', 'Inférieure à la beauté naturelle', 'Identique à la beauté naturelle', 'Une pure illusion'], 0, 'L’œuvre manifeste une idée ; elle porte la marque de l’esprit.'],
            ['Selon Bergson, que fait l’artiste ?', ['Il copie fidèlement ce que tout le monde voit', 'Il dévoile ce que notre regard utilitaire ne voit plus', 'Il décore les objets utiles', 'Il invente des mondes sans rapport avec le réel'], 1, 'Nous percevons les choses selon leur usage ; l’artiste lève ce voile.'],
            ['Chez Kant, le beau est ce qui plaît…', ['À chacun selon ses goûts', 'Parce que c’est utile', 'Universellement sans concept', 'Parce que c’est cher'], 2, 'Je ne démontre pas qu’une œuvre est belle, mais j’attends l’accord de tous.'],
            ['Le plaisir esthétique est, selon Kant, désintéressé.', ['Vrai', 'Faux'], 0, 'Je n’ai pas besoin de posséder ou de consommer l’objet pour le trouver beau.'],
            ['Quel critère Hume propose-t-il pour reconnaître une grande œuvre ?', ['Son prix de vente', 'L’avis de son auteur', 'Le nombre de visiteurs en une année', 'Qu’elle continue de plaire à travers les époques et les peuples'], 3, 'Les préjugés d’une époque passent ; la durée de l’admiration fait preuve.'],
            ['Le génie, chez Kant, est le talent qui…', ['Donne ses règles à l’art', 'Applique parfaitement les règles existantes', 'Refuse toute technique', 'Copie les maîtres anciens'], 0, 'Il invente une manière que d’autres imiteront.'],
            ['Qu’est-ce qui distingue d’abord l’œuvre d’art de l’objet d’usage ?', ['Le matériau employé', 'Sa fin : être contemplée et durer, non servir puis s’user', 'Le temps de fabrication', 'Le nombre d’exemplaires'], 1, 'Un objet d’usage est fait pour être consommé ; l’œuvre pour être regardée.'],
            ['Selon Hannah Arendt, l’œuvre d’art est l’objet le plus ___ du monde humain.', ['Utile', 'Fragile', 'Durable', 'Coûteux'], 2, 'Elle échappe au cycle de la consommation.', 'Quel adjectif Arendt emploie-t-elle pour l’œuvre d’art ?'],
            ['Le proverbe « des goûts et des couleurs on ne discute pas » confond le beau avec…', ['Le vrai', 'Le bien', 'L’utile', 'L’agréable'], 3, 'L’agréable est personnel ; le beau prétend à l’accord de tous.'],
            ['Pour Platon, l’art est avant tout une source de vérité.', ['Vrai', 'Faux'], 1, 'Il y voit au contraire une imitation qui éloigne du vrai.'],
          ],
        },
        // ------------------------------------------------------------------
        {
          titre: 'La justice',
          axe: 'Les notions du programme',
          lecon: {
            titre: 'Le juste, la loi et la force',
            cours: `Un enfant dit « c’est pas juste ! » bien avant de connaître une seule loi. Le sentiment de l’injustice précède le droit — mais suffit-il à dire ce qui est juste ?

## Légal ou légitime
| | Le légal | Le légitime |
| Ce qu’il désigne | Ce qui est **conforme à la loi** en vigueur | Ce qui est **fondé en justice**, en raison |
| Sa source | Le législateur, à un moment donné | Un principe supérieur (dignité, égalité…) |
| Exemple | La ségrégation en Alabama en 1955 | Le refus de Rosa Parks de céder sa place |

> Une loi peut être légale et injuste : c’est pour cela qu’on peut critiquer les lois au nom de la justice.

## Deux formes de justice (Aristote)
| | Justice **corrective** (ou commutative) | Justice **distributive** |
| Domaine | Les échanges, les contrats, les délits | Le partage des honneurs, des biens, des charges |
| Principe | Égalité **arithmétique** : à chacun la même chose | Égalité **proportionnelle** : à chacun selon son mérite ou son besoin |
| Exemple | Rembourser exactement ce qu’on doit | Une bourse selon les revenus des parents |

**Aristote** ajoute l’**équité** : la loi est générale, elle ne peut tout prévoir. Le juge équitable corrige la loi là où son application mécanique serait injuste, comme la règle de plomb des maçons de Lesbos qui épouse la forme de la pierre.

## La justice n’est-elle que la loi du plus fort ?
Dans la *République*, **Platon** raconte l’anneau de Gygès, qui rend invisible : un berger qui le trouve tue le roi et prend le pouvoir. Si l’on pouvait agir sans être vu, serait-on encore juste ? Platon répond que oui pour le sage : l’injuste est un homme **désordonné** en lui-même, jamais vraiment heureux.

**Pascal** constate, amer : « ne pouvant faire que ce qui est juste fût fort, on a fait que ce qui est fort fût juste ». **Rousseau** répond que la force ne fait pas le droit : céder à la force est un acte de **nécessité**, non de devoir ; si le plus fort avait toujours raison, il n’y aurait plus de droit du tout.

## Une société juste
**John Rawls** propose une expérience de pensée : choisir les règles de la société derrière un **voile d’ignorance**, sans savoir quelle place on y occupera (riche ou pauvre, valide ou malade). On retiendrait alors l’égalité des libertés et n’accepterait des inégalités que si elles profitent aux plus défavorisés.

## Exemple d’usage en copie
Sujet : « Suffit-il d’obéir aux lois pour être juste ? » Première partie : le citoyen juste respecte la loi commune (Socrate refuse de s’évader). Deuxième : la loi peut être injuste (distinction légal / légitime). Troisième : la justice demande aussi l’équité et le souci de l’autre, qu’aucune loi ne prescrit entièrement.`,
          },
          questions: [
            ['Est légal ce qui est…', ['Fondé en raison', 'Approuvé par la majorité', 'Conforme à la morale', 'Conforme à la loi en vigueur'], 3, 'Le légal est un fait : ce que dit la loi à un moment donné.'],
            ['Une loi peut être légale et injuste.', ['Vrai', 'Faux'], 0, 'Les lois de ségrégation étaient légales ; elles n’étaient pas légitimes.'],
            ['La justice distributive, chez Aristote, repose sur…', ['Une égalité proportionnelle au mérite ou au besoin', 'Une égalité arithmétique', 'Le tirage au sort', 'La loi du plus fort'], 0, 'On ne donne pas la même chose à tous, mais à chacun selon ce qui lui revient.'],
            ['Rembourser exactement la somme empruntée relève de la justice…', ['Distributive', 'Corrective (commutative)', 'Divine', 'Équitable'], 1, 'Dans l’échange, on vise l’égalité arithmétique stricte.'],
            ['Qu’est-ce que l’équité selon Aristote ?', ['Le partage égal de tout', 'La vengeance proportionnée', 'Le correctif de la loi là où sa généralité la rend injuste', 'L’obéissance stricte à la lettre de la loi'], 2, 'La loi ne peut tout prévoir ; le juge équitable l’adapte au cas.'],
            ['Que permet l’anneau de Gygès dans le récit de Platon ?', ['Devenir riche', 'Lire dans les pensées', 'Voyager dans le temps', 'Devenir invisible'], 3, 'L’expérience de pensée demande : serait-on juste sans risque d’être vu ?'],
            ['« Ne pouvant faire que ce qui est juste fût fort, on a fait que ce qui est fort fût juste » est de…', ['Pascal', 'Rousseau', 'Rawls', 'Aristote'], 0, 'Pascal constate que la force se déguise volontiers en justice.'],
            ['Pour Rousseau, céder à la force est…', ['Un devoir moral', 'Un acte de nécessité, non de devoir', 'Le fondement du droit', 'Une preuve de justice'], 1, 'Si la force faisait le droit, le droit changerait avec chaque nouveau plus fort.'],
            ['Le « voile d’ignorance » est une expérience de pensée de…', ['Platon', 'Pascal', 'John Rawls', 'Aristote'], 2, 'On choisit les règles sans savoir quelle place on occupera dans la société.'],
            ['Derrière le voile d’ignorance, quelles inégalités Rawls juge-t-il acceptables ?', ['Toutes, si elles sont légales', 'Aucune', 'Celles qui récompensent la naissance', 'Celles qui profitent aux plus défavorisés'], 3, 'C’est son « principe de différence ».'],
            ['Est ___ ce qui est fondé en justice, même si aucune loi ne le prévoit.', ['Légitime', 'Légal', 'Réglementaire', 'Obligatoire'], 0, 'Le légitime renvoie à un principe, le légal à un texte.', 'Quel mot désigne ce qui est fondé en justice ?'],
            ['Pour Platon, l’homme injuste qui échappe aux sanctions est pleinement heureux.', ['Vrai', 'Faux'], 1, 'Il reste désordonné en lui-même : l’injustice est un désordre de l’âme.'],
          ],
        },
        // ------------------------------------------------------------------
        {
          titre: 'La liberté',
          axe: 'Les notions du programme',
          lecon: {
            titre: 'Choisir, se déterminer, vivre sous des lois',
            cours: `« Je suis libre, je fais ce que je veux. » La formule semble évidente ; elle pose pourtant trois problèmes différents qu’il faut séparer dans une copie.

## Trois questions sous un même mot
| Le sens | La question | Le contraire |
| **Faire ce qui me plaît** | Suis-je empêché ? | La contrainte, l’obstacle |
| **Libre arbitre** | Mon choix vient-il vraiment de moi ? | Le déterminisme |
| **Liberté politique** | Sous quelles lois suis-je libre ? | La servitude, la tyrannie |

## Faire ce qui me plaît : une liberté fragile
Céder à chaque envie, est-ce être libre ? Le fumeur qui ne peut pas arrêter obéit à son besoin. Pour les stoïciens comme **Épictète**, la liberté consiste à distinguer **ce qui dépend de nous** (nos jugements, nos désirs) de ce qui n’en dépend pas (la santé, la réputation, la fortune).

## Le libre arbitre en question
**Descartes** fait de la volonté libre ce qui nous rend le plus semblables à Dieu : je peux toujours suspendre mon jugement. Mais la **liberté d’indifférence** (choisir sans raison) est « le plus bas degré de la liberté » : on est d’autant plus libre qu’on voit clairement le bien.

**Spinoza** conteste : les hommes se croient libres parce qu’ils sont **conscients de leurs actions et ignorants des causes** qui les déterminent — comme une pierre lancée qui, si elle pensait, se croirait libre de voler. La liberté n’est pas une absence de causes, mais l’action qui découle de notre propre nature comprise.

**Sartre**, à l’opposé, affirme que « l’homme est **condamné à être libre** » : il n’a pas de nature fixée d’avance, il se fait par ses choix, et ne peut s’en décharger sur les circonstances. Même ne pas choisir est un choix.

## La liberté politique
Vivre sans loi, ce serait être à la merci du plus fort. **Montesquieu** définit la liberté comme « le droit de faire tout ce que les lois permettent ». **Rousseau** va plus loin : « l’obéissance à la loi qu’on s’est prescrite est liberté ». Le citoyen est libre quand il obéit à des lois qu’il a contribué à faire.

> La loi n’est pas l’ennemie de la liberté : elle la protège de la loi du plus fort.

## Exemple d’usage en copie
Sujet : « Être libre, est-ce n’obéir à personne ? » On montre que refuser toute obéissance livre au caprice et aux plus forts ; puis que l’obéissance à une loi juste, que l’on reconnaît comme sienne, est une forme supérieure de liberté (Rousseau) ; enfin que cette liberté exige un effort de jugement personnel (Descartes, Sartre).`,
          },
          questions: [
            ['Quel est le contraire du libre arbitre ?', ['Le déterminisme', 'La loi', 'La politique', 'Le désir'], 0, 'Le déterminisme soutient que tout choix a des causes qui ne viennent pas de nous.'],
            ['Pour Épictète, qu’est-ce qui dépend de nous ?', ['Notre santé', 'Nos jugements et nos désirs', 'Notre réputation', 'Notre fortune'], 1, 'La liberté stoïcienne se joue dans ce que nous pensons des choses.'],
            ['Descartes voit dans la liberté d’indifférence…', ['Le plus haut degré de la liberté', 'Une illusion totale', 'Le plus bas degré de la liberté', 'Un privilège des rois'], 2, 'Choisir sans raison est une liberté pauvre : on est plus libre quand on voit clairement le bien.'],
            ['Selon Spinoza, pourquoi les hommes se croient-ils libres ?', ['Dieu leur a donné le libre arbitre', 'Les lois les protègent', 'Ils vivent en démocratie', 'Ils sont conscients de leurs actions et ignorants des causes qui les déterminent'], 3, 'L’exemple de la pierre qui se croirait libre de voler illustre cette illusion.'],
            ['« L’homme est condamné à être libre » est une formule de…', ['Sartre', 'Rousseau', 'Descartes', 'Montesquieu'], 0, 'Sans nature fixée d’avance, l’homme se fait par ses choix.'],
            ['Pour Sartre, ne pas choisir est encore un choix.', ['Vrai', 'Faux'], 0, 'On ne peut se décharger de sa liberté sur les circonstances.'],
            ['Montesquieu définit la liberté politique comme…', ['L’absence de toute loi', 'Le droit de faire tout ce que les lois permettent', 'Le pouvoir de faire ce qu’on veut', 'L’obéissance au roi'], 1, 'Sans loi, chacun serait exposé à la volonté des autres.'],
            ['Pour Rousseau, « l’obéissance à la loi qu’on s’est ___ est liberté ».', ['Imposée', 'Refusée', 'Prescrite', 'Oubliée'], 2, 'Le citoyen obéit à une loi qu’il a contribué à faire.', 'Quel mot complète la formule de Rousseau ?'],
            ['Le fumeur qui ne peut pas s’arrêter illustre…', ['Une liberté parfaite', 'La liberté politique', 'Le libre arbitre selon Descartes', 'Le fait que céder à ses envies n’est pas forcément être libre'], 3, 'Obéir à un besoin, c’est être dominé par lui.'],
            ['Pour Spinoza, être libre, c’est…', ['Agir par la nécessité de sa propre nature comprise', 'Agir sans aucune cause', 'Obéir à ses caprices', 'Refuser toutes les lois'], 0, 'La liberté n’est pas l’absence de causes mais la compréhension de celles qui nous font agir.'],
            ['Dans une copie, pourquoi faut-il distinguer les sens du mot « liberté » ?', ['Pour allonger la copie', 'Parce qu’ils posent des problèmes différents qu’on confond facilement', 'Parce que le correcteur l’exige par principe', 'Parce qu’un seul sens est au programme'], 1, 'Être empêché, être déterminé et être gouverné sont trois questions distinctes.'],
            ['Pour Rousseau, la loi est l’ennemie de la liberté.', ['Vrai', 'Faux'], 1, 'Une loi juste et commune protège de la domination du plus fort.'],
          ],
        },
        // ------------------------------------------------------------------
        {
          titre: 'La nature',
          axe: 'Les notions du programme',
          lecon: {
            titre: 'Ce qui est donné, ce que l’homme fait',
            cours: `On dit qu’une plante « pousse naturellement », qu’il est « dans la nature humaine » de mentir, ou qu’un produit est « 100 % naturel ». Le même mot désigne des choses très différentes.

## Les sens du mot
| Le sens | Ce qu’il désigne | Exemple |
| L’ensemble des êtres | Tout ce qui existe sans l’intervention humaine | Une forêt primaire, les océans |
| Un principe interne | Ce qui fait qu’un être se développe par lui-même | La graine qui devient arbre |
| L’essence | Ce qu’est une chose, ses propriétés | « La nature du triangle » |
| La nature humaine | Ce qui serait commun à tous les hommes | Le langage, la raison ? |

**Aristote** distingue l’être naturel, qui a **en lui-même** le principe de son mouvement (l’arbre grandit seul), et l’objet technique, qui le reçoit de l’extérieur (le lit ne pousse pas).

## Maîtriser la nature ?
**Descartes** propose de connaître la nature pour nous rendre « comme **maîtres et possesseurs** » de celle-ci — d’abord pour la santé. Ce programme a donné la médecine moderne et l’industrie.

Mais le pouvoir humain a changé d’échelle. **Hans Jonas** en tire une éthique de la **responsabilité** : nos actions engagent désormais les générations futures et la nature elle-même, que nous pouvons détruire.

## Y a-t-il une nature humaine ?
**Rousseau** dit que l’homme se distingue de l’animal par la **perfectibilité** : l’animal est au bout de quelques mois ce qu’il sera toute sa vie, l’homme se transforme — en mieux ou en pire.

**Sartre** va plus loin : chez l’homme, « l’existence précède l’essence ». Il n’y a pas de nature humaine fixée d’avance ; chacun se définit par ce qu’il fait.

**Merleau-Ponty** refuse de choisir : chez l’homme, « tout est fabriqué et tout est naturel ». Marcher, parler, manger sont des besoins naturels, mais toujours façonnés par une culture.

## Nature et culture
**Claude Lévi-Strauss** propose un critère : ce qui est **universel** chez l’homme relève de la nature ; ce qui est soumis à une **règle** relève de la culture. La prohibition de l’inceste est une règle, mais universelle : elle marque le passage même de la nature à la culture.

> Opposer la nature et l’homme est trop simple : l’homme est un être de la nature qui ne vit jamais « naturellement ».

## Exemple d’usage en copie
Sujet : « Faut-il suivre la nature ? » On distingue la nature comme modèle (les stoïciens : vivre en accord avec la nature), la nature comme donné à transformer (Descartes), et la nature comme ce qui nous oblige (Jonas).`,
          },
          questions: [
            ['Pour Aristote, qu’est-ce qui distingue un être naturel d’un objet technique ?', ['Sa taille', 'Il a en lui-même le principe de son mouvement', 'Sa couleur', 'Il est plus ancien'], 1, 'L’arbre pousse seul ; le lit ne pousse pas, il est fabriqué.'],
            ['Dans « la nature du triangle », le mot nature désigne…', ['Les forêts', 'Le paysage', 'L’essence de la chose', 'Ce qui est sauvage'], 2, 'C’est l’ensemble des propriétés qui font qu’un triangle est un triangle.'],
            ['Descartes veut rendre l’homme « comme maître et ___ de la nature ».', ['Serviteur', 'Gardien', 'Ennemi', 'Possesseur'], 3, 'Le programme moderne : connaître la nature pour agir sur elle.', 'Quel mot complète la formule de Descartes ?'],
            ['Pour Descartes, à quoi doit d’abord servir la maîtrise de la nature ?', ['À conserver la santé', 'À faire la guerre', 'À s’enrichir', 'À construire des villes'], 0, 'La médecine est pour lui le premier bien visé.'],
            ['Hans Jonas fonde une éthique de…', ['La domination de la nature', 'La responsabilité envers les générations futures', 'Le plaisir immédiat', 'L’obéissance religieuse'], 1, 'Le pouvoir technique engage désormais ceux qui ne sont pas encore nés.'],
            ['Selon Rousseau, qu’est-ce qui distingue l’homme de l’animal ?', ['La force', 'L’instinct', 'La perfectibilité', 'La vie en groupe'], 2, 'L’homme se transforme au cours de sa vie et de l’histoire.'],
            ['« L’existence précède l’essence » signifie que…', ['L’homme a une nature fixée d’avance', 'L’animal est supérieur à l’homme', 'La nature n’existe pas', 'L’homme se définit par ce qu’il fait'], 3, 'Pour Sartre, aucune nature humaine ne décide à notre place.'],
            ['Pour Merleau-Ponty, chez l’homme…', ['Tout est fabriqué et tout est naturel', 'Tout est naturel, rien n’est fabriqué', 'Tout est fabriqué, rien n’est naturel', 'Seul le corps est naturel'], 0, 'Nos besoins naturels sont toujours mis en forme par une culture.'],
            ['Selon Lévi-Strauss, ce qui est universel chez l’homme relève de la culture.', ['Vrai', 'Faux'], 1, 'L’universel relève de la nature ; la règle, de la culture.'],
            ['Pourquoi la prohibition de l’inceste est-elle un cas remarquable pour Lévi-Strauss ?', ['Elle n’existe que dans une seule société', 'Elle est à la fois une règle et universelle', 'Elle est purement biologique', 'Elle a disparu'], 1, 'Règle (culture) et universelle (nature) : elle marque le passage de l’une à l’autre.'],
            ['Un produit « 100 % naturel » utilise le mot nature au sens de…', ['L’essence d’une chose', 'La nature humaine', 'Ce qui n’a pas été transformé par l’homme', 'Le principe de mouvement'], 2, 'C’est le sens courant : ce qui existe sans intervention humaine.'],
            ['Pour les stoïciens, bien vivre, c’est vivre en accord avec la nature.', ['Vrai', 'Faux'], 0, 'La nature y est un ordre rationnel qu’il faut suivre.'],
          ],
        },
        // ------------------------------------------------------------------
        {
          titre: 'La religion',
          axe: 'Les notions du programme',
          lecon: {
            titre: 'Croire, relier, rendre raison',
            cours: `Il n’existe presque aucune société humaine sans rites, sans prières, sans lieux sacrés. La religion n’est pas un détail de l’histoire : c’est l’une des façons les plus anciennes et les plus répandues de donner sens à l’existence.

## Deux étymologies
| Le mot latin | Son sens | Ce qu’il souligne |
| *religare* (Lactance) | **Relier** | Le lien entre l’homme et Dieu, et entre les croyants |
| *relegere* (Cicéron) | **Relire**, recueillir avec soin | Le scrupule, le respect des rites |

## Une définition sociologique
**Durkheim** définit la religion comme un système de croyances et de pratiques relatives à des **choses sacrées**, séparées et interdites, qui unissent en une même **communauté morale** tous ceux qui y adhèrent. Le **sacré** s’oppose au **profane** : on n’entre pas dans une église, une mosquée ou une synagogue comme dans un magasin.

## Foi et raison
La foi est-elle contraire à la raison ?

| Position | Auteur | L’idée |
| La foi cherche à comprendre | **Augustin**, **Anselme** | « Je crois pour comprendre » : la foi met en route l’intelligence |
| Elles ne peuvent se contredire | **Thomas d’Aquin** | Toutes deux viennent de Dieu ; la raison prouve certaines vérités, la foi en reçoit d’autres |
| Le cœur a ses raisons | **Pascal** | « Le cœur a ses raisons que la raison ne connaît point » ; Dieu est « sensible au cœur » |
| Limiter le savoir | **Kant** | La raison ne peut ni prouver ni réfuter l’existence de Dieu ; il faut limiter le savoir pour faire place à la croyance |

**Pascal** propose aussi son pari à celui qui doute : si Dieu existe et que l’on a cru, on gagne tout ; s’il n’existe pas, on ne perd presque rien.

## Les critiques de la religion
Au XIXe siècle, plusieurs penseurs cherchent l’origine humaine de la croyance.

| Auteur | Sa thèse |
| **Feuerbach** | L’homme projette en Dieu ses propres qualités idéalisées |
| **Marx** | La religion est « l’opium du peuple » : elle console d’une misère réelle au lieu de la combattre ; mais elle est aussi « le soupir de la créature opprimée » |
| **Freud** | La croyance est une **illusion**, née du désir d’être protégé comme un enfant par son père |

Ces critiques décrivent des causes possibles de la croyance ; elles ne tranchent pas la question de sa **vérité**.

## Religion et société
**Tocqueville** observe qu’aux États-Unis la religion, séparée de l’État, soutient les mœurs démocratiques. En France, la loi de **1905** sépare les Églises et l’État : la **laïcité** garantit la liberté de conscience et la neutralité de l’État, pas l’hostilité aux croyances.

> Croire n’est pas savoir, mais ce n’est pas non plus renoncer à penser.

## Exemple d’usage en copie
Sujet : « La religion n’est-elle qu’une affaire privée ? » On distingue la foi intime (Pascal), la communauté qu’elle forme (Durkheim), puis sa place dans une république laïque.`,
          },
          questions: [
            ['Le latin *religare* signifie…', ['Relire', 'Refuser', 'Relier', 'Réfléchir'], 2, 'La religion relie l’homme à Dieu et les croyants entre eux.'],
            ['Chez Durkheim, la religion est d’abord liée à…', ['L’économie', 'La science', 'La guerre', 'La distinction du sacré et du profane'], 3, 'Les choses sacrées sont séparées et entourées d’interdits.'],
            ['Pour Durkheim, une religion unit ses fidèles en une même…', ['Communauté morale', 'Entreprise', 'Nation', 'Famille biologique'], 0, 'C’est sa dimension collective : la religion fait lien.'],
            ['« Le cœur a ses raisons que la raison ne connaît point » est de…', ['Kant', 'Pascal', 'Marx', 'Durkheim'], 1, 'Pour Pascal, Dieu est sensible au cœur plus qu’à la démonstration.'],
            ['Pour Thomas d’Aquin, la foi et la raison…', ['Se contredisent toujours', 'Sont sans rapport', 'Ne peuvent se contredire, car elles viennent toutes deux de Dieu', 'Doivent être séparées par la loi'], 2, 'La raison démontre certaines vérités, la foi en reçoit d’autres.'],
            ['Selon Kant, la raison peut démontrer que Dieu existe.', ['Vrai', 'Faux'], 1, 'Elle ne peut ni le prouver ni le réfuter : il faut limiter le savoir pour faire place à la croyance.'],
            ['Que dit le pari de Pascal ?', ['Qu’il faut jouer aux jeux de hasard', 'Que Dieu n’existe pas', 'Que la foi est inutile', 'Que croire en Dieu est le choix le plus raisonnable pour qui doute'], 3, 'On a tout à gagner et presque rien à perdre en pariant que Dieu existe.'],
            ['Qui a écrit que la religion est « l’opium du peuple » ?', ['Marx', 'Freud', 'Feuerbach', 'Pascal'], 0, 'Elle console d’une misère réelle au lieu de la transformer, selon lui.'],
            ['Pour Freud, la croyance religieuse est…', ['Une erreur de calcul', 'Une illusion née du désir de protection', 'Une vérité démontrée', 'Une invention des prêtres'], 1, 'Une illusion est une croyance motivée par un désir.'],
            ['Montrer la cause psychologique d’une croyance suffit à prouver qu’elle est fausse.', ['Vrai', 'Faux'], 1, 'L’origine d’une croyance et sa vérité sont deux questions distinctes.'],
            ['En France, la loi de séparation des Églises et de l’État date de…', ['1789', '1848', '1905', '1958'], 2, 'La laïcité garantit la liberté de conscience et la neutralité de l’État.'],
            ['Pour Feuerbach, l’homme ___ en Dieu ses propres qualités idéalisées.', ['Oublie', 'Cache', 'Refuse', 'Projette'], 3, 'Dieu serait l’image agrandie de l’homme.', 'Que fait l’homme de ses qualités, selon Feuerbach ?'],
          ],
        },
        // ------------------------------------------------------------------
        {
          titre: 'La technique',
          axe: 'Les notions du programme',
          lecon: {
            titre: 'L’outil, la machine et la responsabilité',
            cours: `Ton téléphone te sert, mais combien de fois par jour te commande-t-il ? La technique est d’abord un moyen ; toute la question est de savoir si elle le reste.

## Qu’est-ce que la technique ?
C’est l’ensemble des **procédés** et des **outils** par lesquels l’homme transforme la nature pour répondre à ses besoins. Elle est plus ancienne que la science : on a fait du feu et poli des pierres bien avant toute théorie.

| | La science | La technique |
| Son but | **Connaître** : dire ce qui est | **Produire** : obtenir un résultat |
| Sa question | Pourquoi ? | Comment faire ? |
| Son critère | Le vrai | L’efficace |

Aujourd’hui les deux sont liées : on parle de **technoscience**.

## Une nécessité pour l’homme
Dans le mythe de **Prométhée**, raconté par Platon dans le *Protagoras*, l’homme est oublié lors de la distribution des qualités : il naît nu, sans griffes ni fourrure. Prométhée vole le feu et les arts : la technique **compense** notre faiblesse naturelle. **Bergson** propose d’appeler notre espèce *Homo faber*, l’homme qui fabrique des outils.

## De l’outil à la machine
L’outil prolonge la main : c’est l’artisan qui le guide. La machine, elle, fait le geste à la place de l’homme. **Marx** montre qu’à l’usine, l’ouvrier devient l’**appendice** de la machine : ce n’est plus lui qui se sert de l’instrument, c’est la machine qui se sert de lui.

**Gilbert Simondon** refuse pourtant d’opposer culture et technique : les objets techniques sont des réalités humaines qu’il faut **comprendre**, et c’est l’ignorance de leur fonctionnement qui nous rend esclaves de ce que nous utilisons.

## La technique est-elle neutre ?
| Position | L’idée |
| La technique est un simple moyen | Tout dépend de l’usage : un couteau sert à cuisiner ou à tuer |
| La technique transforme notre regard (**Heidegger**) | Elle nous fait voir tout ce qui existe — fleuve, forêt, homme — comme une **ressource disponible** |

## Pouvoir n’est pas devoir
La technique moderne peut modifier le climat, le vivant, le génome. **Hans Jonas** en tire le **principe responsabilité** : « agis de façon que les effets de ton action soient compatibles avec la permanence d’une vie authentiquement humaine sur terre ».

> La technique dit comment faire ; elle ne dit jamais s’il faut le faire.

## Exemple d’usage en copie
Sujet : « La technique nous libère-t-elle ? » Oui, elle nous délivre de la faim, du froid, de la peine (Prométhée, Descartes). Mais elle crée de nouvelles dépendances (Marx, Heidegger). La liberté dépend alors de notre capacité à la comprendre (Simondon) et à la limiter (Jonas).`,
          },
          questions: [
            ['Quelle est la question propre à la technique ?', ['Pourquoi les choses sont-elles ainsi ?', 'Qu’est-ce que le beau ?', 'Qu’est-ce que Dieu ?', 'Comment obtenir un résultat ?'], 3, 'La science cherche à connaître ; la technique cherche à produire.'],
            ['La technique est apparue bien avant la science moderne.', ['Vrai', 'Faux'], 0, 'Le feu et les outils de pierre précèdent de loin toute théorie.'],
            ['Dans le mythe de Prométhée, pourquoi l’homme a-t-il besoin de la technique ?', ['Parce qu’il naît nu et démuni', 'Pour s’enrichir', 'Pour dominer les dieux', 'Pour faire la guerre'], 0, 'Le feu et les arts compensent un oubli dans la distribution des qualités.'],
            ['Bergson propose d’appeler l’espèce humaine…', ['*Homo sapiens*', '*Homo faber*', '*Homo ludens*', '*Homo economicus*'], 1, 'L’intelligence humaine se reconnaît d’abord à la fabrication d’outils.'],
            ['Selon Marx, à l’usine, l’ouvrier devient…', ['Le maître de la machine', 'Un artiste', 'L’appendice de la machine', 'Un ingénieur'], 2, 'Ce n’est plus lui qui guide l’instrument, c’est la machine qui l’emploie.'],
            ['Pour Simondon, qu’est-ce qui nous rend esclaves des objets techniques ?', ['Leur prix', 'Leur nombre', 'Leur beauté', 'Notre ignorance de leur fonctionnement'], 3, 'Comprendre la technique, c’est cesser de la subir.'],
            ['Pour Heidegger, la technique moderne est un outil neutre.', ['Vrai', 'Faux'], 1, 'Elle impose un regard qui voit tout comme une ressource disponible.'],
            ['Quel exemple illustre l’idée que la technique n’est qu’un moyen ?', ['Un couteau peut servir à cuisiner ou à tuer', 'Un fleuve devient une centrale électrique', 'L’ouvrier suit le rythme de la machine', 'Le climat se réchauffe'], 0, 'Selon cette thèse, tout dépend de l’usage qu’on en fait.'],
            ['Le « principe responsabilité » est une idée de…', ['Descartes', 'Hans Jonas', 'Bergson', 'Marx'], 1, 'Nos actions techniques engagent la vie humaine future sur terre.'],
            ['Quel mot désigne aujourd’hui l’union étroite de la science et de la technique ?', ['Artisanat', 'Mécanique', 'Technoscience', 'Magie'], 2, 'La recherche et l’application ne se séparent presque plus.'],
            ['La technique a pour critère ___, la science a pour critère le vrai.', ['Le beau', 'Le sacré', 'Le juste', 'L’efficace'], 3, 'Un procédé technique se juge à son résultat.', 'Quel est le critère propre de la technique ?'],
            ['Que distingue-t-on entre l’outil et la machine ?', ['L’outil prolonge la main guidée par l’homme ; la machine fait le geste à sa place', 'L’outil est électrique, la machine non', 'Il n’y a aucune différence', 'La machine est plus ancienne'], 0, 'Avec la machine, le rapport entre l’homme et l’instrument s’inverse.'],
          ],
        },
        // ------------------------------------------------------------------
        {
          titre: 'La vérité',
          axe: 'Les notions du programme',
          lecon: {
            titre: 'Dire ce qui est, et le prouver',
            cours: `Une photo retouchée est bien réelle — elle existe —, mais elle n’est pas vraie. La vérité ne se confond pas avec la réalité : elle est une qualité de ce que l’on **dit** ou **pense** du réel.

## Vérité et réalité
| | La réalité | La vérité |
| Elle concerne | Les choses, les faits | Les jugements, les énoncés |
| Son contraire | L’illusion, l’apparence | L’erreur, le mensonge |
| Exemple | Le soleil existe | « Le soleil est une étoile » est vrai |

## Trois critères du vrai
| Critère | Ce qu’il dit | Sa limite |
| **Correspondance** | Est vrai l’énoncé conforme à la chose (Thomas d’Aquin : l’adéquation de l’intelligence et de la chose) | Comment comparer ma pensée à la chose sans passer par ma pensée ? |
| **Évidence** | Est vrai ce que je conçois « clairement et distinctement » (Descartes) | On peut se sentir certain et se tromper |
| **Vérification** | Est vrai ce que l’expérience confirme | Une expérience ne confirme jamais pour toujours |

## Opinion, erreur, mensonge
L’**opinion** croit sans savoir pourquoi. Dans l’allégorie de la **caverne**, Platon montre des prisonniers qui prennent des ombres pour la réalité : sortir de l’opinion demande un effort, et fait d’abord mal aux yeux. **Bachelard** est sévère : « l’opinion pense mal ; elle ne pense pas ».

L’**erreur** est involontaire ; le **mensonge** est une volonté de tromper. On peut dire une chose fausse sans mentir, et dire une chose vraie en espérant qu’on ne vous croira pas.

## La vérité scientifique
**Karl Popper** montre qu’une théorie scientifique n’est jamais vérifiée définitivement : on peut observer mille cygnes blancs, un seul cygne noir suffit à réfuter « tous les cygnes sont blancs ». Une théorie est scientifique si elle est **réfutable**, c’est-à-dire si elle peut être mise à l’épreuve par l’expérience.

## Toute vérité est-elle relative ?
**Nietzsche** écrit qu’« il n’y a pas de faits, seulement des interprétations ». Mais dire « tout est relatif » prétend être vrai **absolument** : le relativisme se contredit lui-même. On peut reconnaître que nos connaissances sont provisoires sans renoncer à distinguer le vrai du faux.

## Doit-on toujours dire la vérité ?
**Kant** refuse tout droit de mentir, même à un assassin qui demande où se cache ton ami : le mensonge ruine la confiance sur laquelle repose toute parole. **Benjamin Constant** lui objecte qu’on ne doit la vérité qu’à ceux qui y ont droit.

> La vérité ne dépend pas de ce que je veux croire ; c’est justement pour cela qu’elle peut nous mettre d’accord.

## Exemple d’usage en copie
Sujet : « Peut-on se passer de la vérité ? » On montre qu’on vit souvent d’opinions et d’illusions confortables, puis que la vie commune, la justice et la science supposent qu’on distingue le vrai du faux.`,
          },
          questions: [
            ['La vérité est une qualité…', ['De nos jugements et de nos énoncés', 'Des choses elles-mêmes', 'Des images seulement', 'Des émotions'], 0, 'Une chose est réelle ou non ; c’est ce qu’on en dit qui est vrai ou faux.'],
            ['Le critère de la correspondance définit le vrai comme…', ['Ce qui plaît au plus grand nombre', 'L’accord de l’énoncé avec la chose', 'Ce qui est utile', 'Ce que dit l’autorité'], 1, 'Thomas d’Aquin parle d’adéquation de l’intelligence et de la chose.'],
            ['Pour Descartes, le critère du vrai est…', ['La tradition', 'L’utilité', 'L’évidence de ce que je conçois clairement et distinctement', 'Le vote'], 2, 'L’évidence résiste au doute méthodique.'],
            ['Quelle est la différence entre l’erreur et le mensonge ?', ['Aucune', 'Le mensonge est toujours plus grave', 'L’erreur concerne les sciences seulement', 'L’erreur est involontaire, le mensonge est une volonté de tromper'], 3, 'On peut dire faux sans mentir, et mentir en disant vrai.'],
            ['Dans l’allégorie de la caverne, les prisonniers prennent…', ['Des ombres pour la réalité', 'Le soleil pour une lampe', 'Des livres pour des images', 'Leurs rêves pour des souvenirs'], 0, 'Platon y montre la condition de l’homme prisonnier de l’opinion.'],
            ['« L’opinion pense mal ; elle ne pense pas » est de…', ['Platon', 'Bachelard', 'Nietzsche', 'Kant'], 1, 'Pour Bachelard, l’opinion traduit des besoins en connaissances.'],
            ['Selon Popper, une théorie scientifique doit être…', ['Vérifiée définitivement', 'Acceptée par tous', 'Réfutable', 'Ancienne'], 2, 'Elle doit pouvoir être mise à l’épreuve par l’expérience.'],
            ['Observer mille cygnes blancs prouve définitivement que tous les cygnes sont blancs.', ['Vrai', 'Faux'], 1, 'Un seul cygne noir suffit à réfuter l’énoncé.'],
            ['Pourquoi l’affirmation « tout est relatif » pose-t-elle problème ?', ['Elle est trop longue', 'Elle est prouvée par la science', 'Elle vient de Descartes', 'Elle prétend être vraie absolument, ce qu’elle nie'], 3, 'Le relativisme absolu se contredit lui-même.'],
            ['Pour Kant, a-t-on le droit de mentir pour sauver un ami ?', ['Non : le mensonge ruine la confiance dont dépend toute parole', 'Oui, toujours', 'Oui, si l’ami est innocent', 'Seulement devant un juge'], 0, 'Benjamin Constant lui objecte qu’on ne doit la vérité qu’à qui y a droit.'],
            ['Une photographie retouchée est ___ mais elle n’est pas vraie.', ['Fausse', 'Réelle', 'Illusoire', 'Absente'], 1, 'Elle existe bien : c’est ce qu’elle prétend montrer qui est faux.', 'Que peut-on dire d’une photographie retouchée ?'],
            ['Le contraire de la vérité est l’apparence.', ['Vrai', 'Faux'], 1, 'Le contraire de la vérité est l’erreur (ou le mensonge) ; l’apparence s’oppose à la réalité.'],
          ],
        },
        // ------------------------------------------------------------------
        {
          titre: 'Les repères pour raisonner et prouver',
          axe: 'Les repères',
          lecon: {
            titre: 'Dix-sept distinctions pour construire un argument',
            cours: `Le programme donne une liste de 34 **repères** : des couples de mots qui aident à penser. Ils ne font pas l’objet d’une leçon à part et **aucun sujet ne porte directement sur un repère**, mais un repère bien employé transforme une copie : il permet de **distinguer** là où l’on mélangeait. Voici ceux qui servent à raisonner.

## Pour construire une démonstration
| Repère | La distinction |
| **Analyse / synthèse** | Décomposer un tout en ses éléments / recomposer un tout à partir des éléments |
| **Exemple / preuve** | Un cas qui illustre / une raison qui établit. Un exemple ne prouve pas une règle générale, mais un **contre-exemple** suffit à la réfuter |
| **Hypothèse / conséquence / conclusion** | Ce qu’on suppose / ce qui en découle / ce qu’on retient à la fin du raisonnement |
| **Intuitif / discursif** | Saisi d’un coup d’œil / atteint par un enchaînement d’étapes |
| **Médiat / immédiat** | Qui passe par un intermédiaire / qui est donné directement |
| **Question / problème** | Ce qu’on demande / la difficulté qui rend la réponse non évidente |

## Pour juger d’une connaissance
| Repère | La distinction |
| **Croire / savoir** | Tenir pour vrai sans preuve suffisante / pouvoir justifier ce qu’on tient pour vrai |
| **Vrai / probable / certain** | Conforme au réel / vraisemblable mais pas établi / dont on ne peut douter (le certain est un état de l’esprit : on peut être certain et se tromper) |
| **Objectif / subjectif / intersubjectif** | Qui vaut indépendamment de moi / qui dépend de moi / qui vaut pour tous les sujets qui peuvent en discuter |
| **Expliquer / comprendre** | Rendre compte par des causes (sciences de la nature) / saisir un sens, une intention (sciences humaines) |
| **Théorie / pratique** | Le savoir qui contemple / l’action qui transforme |

## Pour manier les idées
| Repère | La distinction |
| **Abstrait / concret** | Séparé par la pensée / donné dans l’expérience |
| **Concept / image / métaphore** | Idée générale définie / représentation sensible / transfert de sens d’une chose à une autre |
| **Ressemblance / analogie** | Des traits communs / une identité de rapports (A est à B ce que C est à D) |
| **Formel / matériel** | Qui concerne la forme d’un raisonnement / son contenu |
| **En fait / en droit** | Ce qui est / ce qui doit être ou est fondé |
| **Persuader / convaincre** | Faire croire en touchant les passions / faire admettre par des raisons |

> Un repère n’est pas une définition à réciter : c’est un outil pour débloquer un sujet.

## Exemple travaillé
Sujet : « Suffit-il d’avoir des preuves pour convaincre ? » Deux repères éclairent aussitôt le problème. **Persuader / convaincre** : on peut emporter l’adhésion sans preuve (la publicité persuade). **Exemple / preuve** : un témoignage frappant n’est qu’un exemple. On peut alors poser le problème : les preuves suffisent **en droit** à convaincre un esprit rationnel, mais **en fait** les hommes se laissent souvent davantage persuader que convaincre.

## Comment s’en servir
1. Dès l’analyse du sujet, cherche si un repère éclaire un mot de l’intitulé.
2. Emploie-le pour **distinguer deux sens** et faire apparaître le problème.
3. Ne l’annonce pas comme une définition apprise : fais-le travailler dans l’argument.`,
          },
          questions: [
            ['Un sujet de dissertation au bac porte-t-il directement sur un repère ?', ['Oui, toujours', 'Non, jamais directement, mais son intitulé peut en employer un terme', 'Oui, une année sur deux', 'Seulement en explication de texte'], 1, 'Les sujets portent sur les notions ; les repères aident à les traiter.'],
            ['Que suffit-il pour réfuter une règle générale ?', ['Un exemple', 'Une métaphore', 'Un contre-exemple', 'Une hypothèse'], 2, 'Mille exemples ne prouvent pas une règle, un seul contre-exemple la réfute.'],
            ['Persuader, c’est…', ['Faire admettre par des raisons', 'Démontrer une vérité', 'Vérifier par l’expérience', 'Faire croire en touchant les passions'], 3, 'Convaincre passe par des raisons ; persuader peut s’en passer.'],
            ['Savoir se distingue de croire parce que…', ['On peut justifier ce qu’on sait', 'On le dit plus fort', 'C’est plus ancien', 'C’est partagé par tous'], 0, 'Le savoir s’accompagne de raisons suffisantes.'],
            ['On peut être certain et se tromper.', ['Vrai', 'Faux'], 0, 'La certitude est un état de l’esprit ; la vérité dépend du réel.'],
            ['Expliquer, au sens de ce repère, c’est…', ['Saisir une intention', 'Rendre compte par des causes', 'Raconter une histoire', 'Donner son avis'], 1, 'Comprendre, c’est saisir un sens ; expliquer, rendre compte par des causes.'],
            ['« Le vieillard est au soir de sa vie » repose sur…', ['Une preuve', 'Une hypothèse', 'Une analogie de rapports (la vieillesse est à la vie ce que le soir est au jour)', 'Une analyse'], 2, 'L’analogie est une identité de rapports, non une simple ressemblance.'],
            ['Que désigne le couple « en fait / en droit » ?', ['Le passé / le futur', 'Le vrai / le faux', 'Le concret / l’abstrait', 'Ce qui est / ce qui doit être ou est fondé'], 3, 'Ce qui se passe n’est pas forcément ce qui devrait se passer.'],
            ['Une connaissance intuitive est…', ['Saisie d’un coup d’œil', 'Obtenue par une suite d’étapes', 'Toujours fausse', 'Transmise par un autre'], 0, 'Le discursif, lui, procède par étapes.'],
            ['Ce qui vaut pour tous les sujets capables d’en discuter est…', ['Subjectif', 'Intersubjectif', 'Immédiat', 'Matériel'], 1, 'L’intersubjectif dépasse l’opinion individuelle sans prétendre à l’objectivité d’une chose.'],
            ['Décomposer un tout en ses éléments, c’est faire ___.', ['Une synthèse', 'Une métaphore', 'Une analyse', 'Une conclusion'], 2, 'La synthèse fait le chemin inverse : recomposer.', 'Comment appelle-t-on la décomposition d’un tout en ses éléments ?'],
            ['Quelle est la bonne façon d’utiliser un repère dans une copie ?', ['Réciter sa définition en introduction', 'En citer le plus possible', 'Le mettre en titre de partie', 'L’employer pour distinguer deux sens et faire apparaître le problème'], 3, 'Un repère est un outil qui doit travailler dans l’argument.'],
          ],
        },
        // ------------------------------------------------------------------
        {
          titre: 'Les repères pour définir et juger',
          axe: 'Les repères',
          lecon: {
            titre: 'Dix-sept distinctions pour éviter les confusions',
            cours: `La seconde moitié des repères sert à **définir** avec précision (qu’est-ce qu’une chose ? peut-elle être autrement ?) et à **juger** des actions et des lois. Beaucoup de faux débats viennent de deux sens confondus sous un même mot.

## Pour dire ce qu’est une chose
| Repère | La distinction |
| **Essentiel / accidentel** | Ce sans quoi la chose ne serait pas ce qu’elle est / ce qui pourrait changer sans qu’elle cesse d’être elle-même (être raisonnable est essentiel à l’homme, être blond est accidentel) |
| **Genre / espèce / individu** | La catégorie large (animal) / la catégorie plus précise (homme) / l’être unique (Socrate) |
| **Identité / égalité / différence** | Être le même / avoir la même valeur ou les mêmes droits sans être le même / ne pas être le même. **Deux citoyens égaux ne sont pas identiques** |
| **Universel / général / particulier / singulier** | Vaut pour tous sans exception / vaut pour la plupart / vaut pour une partie / ne vaut que pour un seul |
| **En acte / en puissance** | Ce qui est réalisé / ce qui peut se réaliser (le gland est un chêne en puissance) |
| **Donné / construit** | Ce qui se présente à nous / ce que l’esprit ou la société élabore |

## Pour penser ce qui peut être autrement
| Repère | La distinction |
| **Contingent / nécessaire** | Qui pourrait ne pas être / qui ne peut pas ne pas être |
| **Possible / impossible** | Qui peut être sans contradiction / qui ne le peut pas |
| **Absolu / relatif** | Qui ne dépend de rien d’autre / qui n’existe ou ne vaut que par rapport à autre chose |
| **Idéal / réel** | Le modèle qu’on vise / ce qui existe effectivement |
| **Transcendant / immanent** | Qui dépasse et reste extérieur / qui est intérieur à la chose même |

## Pour juger de l’action et de la loi
| Repère | La distinction |
| **Légal / légitime** | Conforme à la loi / fondé en justice |
| **Obligation / contrainte** | Ce que je dois faire et que je peux refuser (un devoir) / ce qui s’impose à moi par la force |
| **Origine / fondement** | D’où vient une chose, son commencement dans le temps / ce qui la justifie en droit |
| **Principe / cause / fin** | Le point de départ premier / ce qui produit un effet / le but visé |
| **Passion / action** | Ce que je subis / ce dont je suis l’auteur |
| **Public / privé** | Ce qui concerne tous les citoyens / ce qui relève de la vie de chacun |

> L’origine d’une règle ne dit rien de sa valeur : une loi peut naître d’un rapport de force et être juste, ou d’un vote et être injuste.

## Exemple travaillé
Sujet : « Obéir, est-ce renoncer à sa liberté ? » Le repère **obligation / contrainte** débloque tout : céder à la **contrainte**, c’est subir une force ; reconnaître une **obligation**, c’est accepter librement une règle qu’on pourrait refuser. On peut alors montrer qu’obéir à une loi juste n’est pas renoncer à sa liberté mais l’exercer. Le couple **légal / légitime** ouvre la dernière partie : que faire d’une loi légale mais injuste ?

## Comment s’en servir
1. Repère le mot de l’intitulé qui a **deux sens**.
2. Cherche le repère qui nomme cette différence.
3. Fais de cette distinction le **moteur** de ton plan, pas un ornement.`,
          },
          questions: [
            ['Pour l’homme, être blond est…', ['Essentiel', 'Nécessaire', 'Accidentel', 'Universel'], 2, 'Il pourrait changer sans que la personne cesse d’être un homme.'],
            ['Le gland est un chêne…', ['En acte', 'Par accident', 'En droit', 'En puissance'], 3, 'Il peut devenir chêne, il ne l’est pas encore.'],
            ['Est contingent ce qui…', ['Pourrait ne pas être', 'Ne peut pas ne pas être', 'Est impossible', 'Est universel'], 0, 'Le nécessaire, lui, ne peut pas être autrement.'],
            ['Deux citoyens égaux en droits sont identiques.', ['Vrai', 'Faux'], 1, 'L’égalité n’est pas l’identité : on peut être très différents et égaux en droits.'],
            ['Quelle est la différence entre obligation et contrainte ?', ['Aucune', 'L’obligation peut être refusée librement, la contrainte s’impose par la force', 'La contrainte est morale, l’obligation physique', 'L’obligation est toujours injuste'], 1, 'Un devoir s’adresse à ma liberté ; une contrainte la supprime.'],
            ['Le fondement d’une règle désigne…', ['Son commencement dans le temps', 'Son auteur', 'Ce qui la justifie en droit', 'Sa date de publication'], 2, 'L’origine dit d’où elle vient ; le fondement dit ce qui la rend valable.'],
            ['Dans la série genre / espèce / individu, « Socrate » est…', ['Un genre', 'Une espèce', 'Un concept universel', 'Un individu'], 3, 'Animal est le genre, homme l’espèce, Socrate l’individu.'],
            ['Ce qui vaut pour la plupart des cas, mais pas pour tous, est…', ['Général', 'Universel', 'Singulier', 'Nécessaire'], 0, 'L’universel ne souffre aucune exception, le général en admet.'],
            ['La colère que je subis relève plutôt de…', ['L’action', 'La passion', 'Le fondement', 'La fin'], 1, 'La passion est ce que l’on subit ; l’action, ce dont on est l’auteur.'],
            ['Ce qui reste extérieur et supérieur à la chose est dit ___.', ['Immanent', 'Relatif', 'Transcendant', 'Accidentel'], 2, 'L’immanent, au contraire, est intérieur à la chose même.', 'Quel mot désigne ce qui dépasse et reste extérieur à la chose ?'],
            ['Connaître l’origine d’une loi suffit pour juger de sa valeur.', ['Vrai', 'Faux'], 1, 'L’origine est un fait ; la valeur relève du fondement.'],
            ['Dans le sujet « Obéir, est-ce renoncer à sa liberté ? », quel repère débloque le problème ?', ['Genre / espèce / individu', 'En acte / en puissance', 'Formel / matériel', 'Obligation / contrainte'], 3, 'Obéir à une obligation reconnue n’est pas subir une contrainte.'],
          ],
        },
        // ------------------------------------------------------------------
        {
          titre: 'Méthode : la dissertation au bac techno',
          axe: 'L’épreuve de philosophie',
          lecon: {
            titre: 'Transformer une question en problème',
            cours: `L’épreuve de philosophie de la voie technologique dure **4 heures** (coefficient **4**). Tu choisis **un** sujet parmi trois : **deux dissertations** et **une explication de texte**. Les sujets de dissertation sont toujours des **questions** qui portent sur une ou plusieurs des sept notions. Dictionnaire et calculatrice sont interdits.

## Ce qu’on attend
La dissertation n’est pas une récitation de cours ni un avis. C’est l’**examen méthodique d’un problème** : tu montres qu’une question apparemment simple admet plusieurs réponses défendables, puis tu construis une réponse justifiée.

## 1. Analyser le sujet (40 minutes)
1. Souligne chaque mot : la notion, mais aussi les petits mots (« peut-on », « doit-on », « seulement », « toujours »). « Peut-on » interroge une **possibilité** ou un **droit** ; « doit-on », une **obligation**.
2. Donne **au moins deux sens** aux termes principaux. Exemple : dans « La technique nous rend-elle libres ? », libre peut vouloir dire « délivré de la peine » ou « maître de ses choix ».
3. Cherche un **repère** qui éclaire le sujet (obligation / contrainte, en fait / en droit…).
4. Note des exemples précis et des références (un auteur, une thèse).

## 2. Formuler le problème
Le problème naît d’une **tension** : deux réponses semblent vraies à la fois. Formule-le en une ou deux questions.

> Une réponse « oui » ou « non » évidente signale que tu n’as pas encore trouvé le problème.

## 3. Construire le plan
| Partie | Ce qu’elle fait | Exemple : « La technique nous rend-elle libres ? » |
| I | La réponse la plus naturelle, justifiée | Oui : elle délivre de la faim, du froid, de la peine (Prométhée, Descartes) |
| II | Ses limites, ce qu’elle oublie | Mais elle crée des dépendances nouvelles (l’ouvrier appendice de la machine chez Marx) |
| III | Une réponse plus fine qui tient compte des deux | Elle libère si on la comprend et la limite (Simondon, Jonas) |

Chaque partie contient **deux ou trois paragraphes** : une idée, un argument, un exemple analysé, une petite conclusion.

## 4. Rédiger
**L’introduction** (une dizaine de lignes) : une accroche concrète, le sujet cité, l’analyse des termes, le **problème**, l’annonce du plan.
**Le développement** : une **transition** entre les parties, qui dit pourquoi la réponse précédente ne suffit pas.
**La conclusion** : ta réponse nette au problème, sans idée nouvelle.

## Les pièges à éviter
1. **Réciter** un cours sans rapport précis avec la question.
2. **Changer de sujet** : répondre à « la technique est-elle dangereuse ? » quand on te demande si elle libère.
3. **Accumuler les citations** sans les expliquer : une référence doit servir un argument.
4. **Donner son opinion** sans la justifier.
5. Oublier de relire : l’orthographe et la clarté de l’expression comptent.

## Gérer les 4 heures
| Temps | Étape |
| 0 h 00 – 0 h 10 | Lire les trois sujets et choisir |
| 0 h 10 – 1 h 00 | Analyse, problème, plan au brouillon |
| 1 h 00 – 1 h 20 | Introduction et conclusion au brouillon |
| 1 h 20 – 3 h 45 | Rédaction au propre |
| 3 h 45 – 4 h 00 | Relecture |`,
          },
          questions: [
            ['Combien de temps dure l’épreuve de philosophie du bac technologique ?', ['2 heures', '3 heures', '5 heures', '4 heures'], 3, 'Quatre heures, pour un seul sujet choisi parmi trois.'],
            ['Quel est le coefficient de la philosophie au bac technologique ?', ['4', '2', '8', '16'], 0, 'Il est de 4 en voie technologique (8 en voie générale).'],
            ['Combien de sujets de dissertation sont proposés ?', ['Un', 'Deux', 'Trois', 'Quatre'], 1, 'Deux dissertations et une explication de texte : trois sujets au choix.'],
            ['Sous quelle forme se présente toujours un sujet de dissertation ?', ['Une citation à commenter', 'Un thème', 'Une question', 'Un texte'], 2, 'Et les notions qu’il interroge sont clairement identifiables.'],
            ['« Peut-on… ? » interroge plutôt…', ['Une obligation', 'Un fait historique', 'Une préférence personnelle', 'Une possibilité ou un droit'], 3, '« Doit-on… ? » interroge une obligation.'],
            ['D’où naît le problème d’une dissertation ?', ['D’une tension entre deux réponses qui semblent vraies à la fois', 'D’une erreur dans le sujet', 'De l’avis du candidat', 'D’une citation célèbre'], 0, 'Si la réponse est évidente, le problème n’est pas encore trouvé.'],
            ['Que doit faire une transition entre deux parties ?', ['Résumer tout le cours', 'Montrer pourquoi la réponse précédente ne suffit pas', 'Annoncer la conclusion', 'Citer un auteur'], 1, 'Elle fait avancer la réflexion d’une partie à l’autre.'],
            ['La conclusion peut introduire une idée entièrement nouvelle.', ['Vrai', 'Faux'], 1, 'Elle donne la réponse au problème, sans relancer un nouveau débat.'],
            ['Donner deux sens aux termes du sujet sert à…', ['Allonger l’introduction', 'Montrer qu’on connaît le dictionnaire', 'Faire apparaître le problème', 'Éviter de répondre'], 2, 'C’est souvent l’écart entre deux sens qui crée la tension.'],
            ['Quel est le défaut d’une citation non expliquée ?', ['Elle est interdite', 'Elle fait perdre du temps au correcteur', 'Elle est toujours fausse', 'Elle ne sert aucun argument'], 3, 'Une référence doit être expliquée et mise au service de ta thèse.'],
            ['Une copie qui donne son avis sans le justifier est une bonne dissertation.', ['Vrai', 'Faux'], 1, 'Une opinion ne devient réflexion que par des arguments.'],
            ['Que doit contenir l’introduction ?', ['Une accroche, le sujet, l’analyse des termes, le problème et l’annonce du plan', 'Uniquement la réponse finale', 'La liste des auteurs connus', 'Une biographie de philosophe'], 0, 'Elle mène le lecteur jusqu’au problème et annonce le chemin.'],
          ],
        },
        // ------------------------------------------------------------------
        {
          titre: 'Méthode : l’explication de texte au bac techno',
          axe: 'L’épreuve de philosophie',
          lecon: {
            titre: 'Deux manières d’expliquer : par les questions ou librement',
            cours: `Le troisième sujet de l’épreuve est un **texte d’un auteur du programme**, d’une quinzaine de lignes, qui se rapporte à une ou plusieurs des sept notions. On te demande de l’**expliquer** : montrer ce qu’il dit, **comment** il le dit, et ce qu’il permet de penser. Tu n’as pas à connaître toute la doctrine de l’auteur.

## Une spécificité de la voie technologique
Tu choisis entre **deux manières de rédiger**, et tu indiques ton choix au **début de la copie** :

| | Option 1 | Option 2 |
| Comment | Tu réponds **dans l’ordre**, de façon précise et développée, aux questions posées | Tu suis le développement de ton choix |
| Pour qui | Pour être guidé pas à pas | Pour ceux qui maîtrisent l’explication continue |

## Les trois blocs de questions (option 1)
| Bloc | Ce qu’il demande |
| **A. Éléments d’analyse** | Expliquer un passage, une expression, un exemple, un mot précis du texte |
| **B. Éléments de synthèse** | La **question** à laquelle l’auteur répond, les **moments** de l’argumentation, l’**idée principale** |
| **C. Commentaire** | Une ou deux questions de réflexion personnelle sur le problème du texte |

> Même en option 1, lis tout le texte et fais le bloc B au brouillon **d’abord** : on explique mieux un détail quand on sait où va le texte.

## La méthode, pas à pas
1. **Lire trois fois** le texte : une fois pour le sens général, une fois crayon en main (connecteurs, exemples, mots répétés), une fois pour vérifier.
2. **Trouver la thèse** : ce que l’auteur affirme, en une phrase à toi.
3. **Trouver la question** à laquelle il répond — souvent une des sept notions interrogée sous un angle précis.
4. **Découper** le texte en deux ou trois moments, à partir des **connecteurs** (« mais », « donc », « au contraire », « car »).
5. Pour chaque passage demandé : **citer** entre guillemets, **reformuler**, puis **expliquer** — pourquoi l’auteur dit cela, quel exemple il emploie, quel adversaire il vise.
6. Au bloc C : prends position en **argumentant**, avec un exemple et, si possible, une autre référence.

## Répondre à une question d’analyse
Question type : « Pourquoi l’auteur prend-il l’exemple de… ? »
1. Rappelle l’exemple en citant le texte.
2. Dis ce qu’il montre.
3. Rattache-le à la thèse : à quoi sert-il dans l’argument ?

## Les pièges
1. **La paraphrase** : répéter le texte avec d’autres mots sans l’expliquer.
2. **Le hors-sujet biographique** : raconter la vie de l’auteur.
3. **Répondre en une ligne** : chaque réponse doit être rédigée et justifiée.
4. **Sauter une question** en option 1 : chacune compte.

## Exemple de réponse de synthèse
« Dans ce texte, l’auteur se demande si le beau n’est qu’une affaire de goût personnel. Il répond que non : le temps fait le tri entre les œuvres à la mode et les œuvres véritables. Il montre d’abord…, puis… » — une question, une thèse, des moments : c’est ce qu’attend le bloc B.`,
          },
          questions: [
            ['Sur quel auteur peut porter le texte à expliquer ?', ['Un auteur de la liste du programme', 'N’importe quel écrivain', 'Un journaliste contemporain', 'Uniquement un auteur antique'], 0, 'Les extraits sont obligatoirement empruntés à la liste d’auteurs du programme.'],
            ['En voie technologique, combien de manières de rédiger l’explication te sont proposées ?', ['Une seule', 'Deux', 'Trois', 'Quatre'], 1, 'Répondre aux questions (option 1) ou suivre son propre développement (option 2).'],
            ['Où dois-tu indiquer l’option choisie ?', ['À la fin de la copie', 'Nulle part', 'Au début de la copie', 'Sur une feuille à part'], 2, 'Le correcteur doit savoir d’emblée comment lire ta copie.'],
            ['Que demande le bloc « éléments de synthèse » ?', ['Une réflexion personnelle', 'La biographie de l’auteur', 'Un résumé ligne à ligne', 'La question du texte, ses moments et son idée principale'], 3, 'C’est la vue d’ensemble du texte.'],
            ['Que demande le bloc « commentaire » ?', ['Une réflexion personnelle argumentée sur le problème du texte', 'Recopier le texte', 'La date de publication', 'La liste des connecteurs'], 0, 'Tu prends position en argumentant, avec des exemples.'],
            ['En option 1, il faut traiter les questions dans l’ordre.', ['Vrai', 'Faux'], 0, 'On répond dans l’ordre, de manière précise et développée.'],
            ['Qu’est-ce que la paraphrase ?', ['Une explication réussie', 'Répéter le texte avec d’autres mots sans l’expliquer', 'Une citation exacte', 'Un plan en trois parties'], 1, 'Reformuler ne suffit pas : il faut dire pourquoi l’auteur dit ce qu’il dit.'],
            ['Quels mots aident le plus à découper un texte en moments ?', ['Les noms propres', 'Les adjectifs', 'Les connecteurs logiques', 'Les dates'], 2, '« Mais », « donc », « car », « au contraire » marquent les articulations.'],
            ['Pourquoi faire le bloc B au brouillon avant le bloc A ?', ['Parce que le sujet l’impose', 'Pour gagner des points bonus', 'Parce que le bloc A est facultatif', 'Parce qu’on explique mieux un détail quand on sait où va le texte'], 3, 'La thèse d’ensemble éclaire chaque passage.'],
            ['Pour expliquer un passage, on le cite, on le reformule, puis on ___.', ['L’explique', 'Le recopie', 'L’ignore', 'Le résume en un mot'], 0, 'Citer et reformuler préparent l’explication, qui est l’essentiel.', 'Quelle étape suit la citation et la reformulation ?'],
            ['Il faut connaître toute la doctrine de l’auteur pour réussir l’explication.', ['Vrai', 'Faux'], 1, 'Le texte doit pouvoir se comprendre par lui-même ; la connaissance de l’auteur n’est pas exigée.'],
            ['À quoi sert d’identifier la question à laquelle répond le texte ?', ['À connaître la date du texte', 'À trouver le problème et le rattacher aux notions du programme', 'À deviner la note', 'À choisir l’option 2'], 1, 'Un texte est toujours une réponse à un problème : le trouver, c’est commencer à expliquer.'],
          ],
        },
      ],
    },
  ],
}
