// -----------------------------------------------------------------------------
// TEMPS MODERNES — la Renaissance hors de France : Rabelais, Charles Quint,
// Michel-Ange, Soliman le Magnifique, Montaigne, Philippe II, Shakespeare.
//
// Ce lot donne à François Ier et à Henri IV leurs VRAIS interlocuteurs. Le roi
// de France ne gouverne pas seul dans son siècle : en face, il y a l'empereur
// sur lequel le soleil ne se couche jamais, le sultan avec qui la France
// s'allie contre lui, et le roi de l'Escurial qui paiera la Ligue contre Henri
// IV. À côté, la même Europe produit quatre hommes qui n'ont ni armée ni
// couronne et qu'on lit encore : deux Français qui inventent le roman et
// l'essai, un Florentin qui taille le marbre, un Anglais qui écrit pour un
// théâtre de bois.
//
// LE TON. Soliman est traité avec exactement le même respect que les figures
// chrétiennes du lot voisin : c'est un grand souverain, un législateur et un
// bâtisseur, pas l'épouvantail des gravures d'époque. Charles Quint abdique de
// tout et finit dans un monastère — on le raconte avec le sérieux que cette
// fin mérite. Philippe II est dit par ses actes, ses réussites et ses échecs,
// sans la « légende noire » ni son contraire.
//
// LA PREMIÈRE CITATION D'UN PORTRAIT EST CELLE QUI S'AFFICHE SUR LA CARTE :
// c'est donc toujours, ici, une phrase du personnage lui-même — et quand elle
// n'est que PRÊTÉE (Charles Quint et ses quatre langues, Michel-Ange et sa
// pierre, Philippe II et ses navires), la fiche le dit noir sur blanc.
// -----------------------------------------------------------------------------

import type { Personnage } from '../types'

export const PERSONNAGES_RENAISSANCE_MONDE: Personnage[] = [
  {
    id: 'rabelais',
    volet: 'personnages',
    nom: 'François Rabelais',
    surnom: 'le moine médecin qui fit rire l’humanisme',
    dates: 'vers 1483 – 1553',
    tri: 1553,
    periode: 'temps-modernes',
    emoji: '🍷',
    roles: ['Moine', 'Médecin', 'Écrivain'],
    origine: 'La Devinière, près de Chinon, en Touraine',
    accroche:
      'Moine, puis médecin, puis conteur : il invente deux géants pour dire que le savoir sans conscience ne vaut rien — et fonde le roman français.',
    citations: [
      {
        texte: 'Science sans conscience n’est que ruine de l’âme.',
        contexte:
          'Lettre de Gargantua à son fils Pantagruel, dans *Pantagruel*, chapitre VIII, 1532.',
        sens:
          'Apprendre sans savoir à quoi sert ce qu’on apprend ne construit rien. C’est la phrase que l’humanisme a laissée à l’école, et on la cite encore aujourd’hui.',
      },
      {
        texte: 'Fais ce que voudras.',
        contexte:
          'Unique règle de l’abbaye de Thélème, l’abbaye imaginaire de *Gargantua*, 1534.',
        sens:
          'Ce n’est pas « fais n’importe quoi » : Rabelais suppose des gens instruits et libres, chez qui l’honneur suffit à régler la conduite sans qu’on ait besoin de les surveiller.',
      },
      {
        texte: 'Rire est le propre de l’homme.',
        contexte:
          'Poème d’ouverture de *Gargantua*, 1534 : « Mieux est de ris que de larmes écrire, pour ce que rire est le propre de l’homme. »',
        sens:
          'Le rire n’est pas un divertissement à côté du savoir : c’est ce qui distingue l’homme, et donc une manière sérieuse de dire des choses graves.',
      },
      {
        texte: 'Je vais quérir un grand peut-être.',
        contexte: 'Derniers mots prêtés à Rabelais mourant, à Paris, en avril 1553.',
        sens:
          'Aucun témoin ne la rapporte de son vivant : la formule apparaît bien plus tard. Elle lui va si bien qu’on n’a jamais voulu s’en séparer.',
        incertaine: true,
      },
    ],
    reperes: [
      'Né vers 1483 près de Chinon ; moine franciscain, puis bénédictin, puis prêtre séculier.',
      'Reçu médecin à Montpellier, il soigne à l’Hôtel-Dieu de Lyon à partir de 1532.',
      '*Pantagruel* (1532) puis *Gargantua* (1534), signés du pseudonyme Alcofribas Nasier.',
      'La Sorbonne condamne ses livres ; les frères Du Bellay et François Ier le protègent.',
      'Il écrit un français énorme, plein de mots savants, de patois et de listes interminables.',
      'Mort à Paris en 1553 ; son nom a donné l’adjectif « rabelaisien ».',
    ],
    recit: [
      {
        titre: 'Du cloître à la table de dissection',
        texte:
          'Fils d’un avocat de Chinon, Rabelais entre jeune chez les **Franciscains** de Fontenay-le-Comte. Il y apprend le **grec** — la langue des humanistes, et celle des textes de la Bible que l’Église préfère lire en latin : ses supérieurs lui confisquent ses livres. Il passe alors chez les **Bénédictins**, plus tolérants, puis quitte le cloître sans autorisation, ce qui fait de lui un « moine apostat » jusqu’à ce que le pape régularise sa situation. Il étudie la **médecine** à **Montpellier** et devient, en 1532, médecin du grand **Hôtel-Dieu de Lyon** : deux cents malades, un salaire de quarante livres par an. Il y pratique une **dissection publique**, encore rare, et publie des textes d’**Hippocrate** et de Galien annotés en grec. Toute sa vie il sera cela : un homme de science qui écrit des livres drôles.',
      },
      {
        titre: 'Deux géants pour dire le monde',
        texte:
          'En 1532, il publie à Lyon *Pantagruel*, l’histoire d’un géant, sous le pseudonyme d’**Alcofribas Nasier** — l’anagramme exacte de François Rabelais. Le livre se vend dans les foires comme les romans de chevalerie bon marché dont il imite la forme. Deux ans plus tard vient *Gargantua*, l’histoire du père, écrite après celle du fils. Suivront le *Tiers Livre* (1546) et le *Quart Livre* (1552). On y trouve des batailles d’andouilles, des listes de trois cents jeux, des tempêtes en mer, des injures inoubliables — et, au milieu, les questions les plus sérieuses de son siècle : comment élever un enfant, quand une guerre est juste, ce qu’on peut croire. Rabelais l’annonce lui-même : il faut « rompre l’os pour sucer la substantifique moelle », c’est-à-dire chercher sous la farce ce qui y est caché.',
      },
      {
        titre: 'La lettre de Gargantua : le programme des humanistes',
        texte:
          'Au chapitre VIII de *Pantagruel*, le géant Gargantua écrit à son fils étudiant à Paris. Il lui décrit un monde neuf : les **langues anciennes** rétablies, l’**imprimerie** qui met les livres partout, les savoirs qui reviennent. Puis il lui ordonne d’apprendre le grec, le latin, l’hébreu, la géométrie, l’astronomie, le droit, l’histoire naturelle — « que je voie un abîme de science ». Et il ferme la lettre par l’avertissement qui a fait la fortune du texte : « **science sans conscience n’est que ruine de l’âme** ». Tout l’**humanisme** est là, et son contraire aussi : ailleurs, Rabelais se moque de l’ancienne école, celle du maître Thubal Holoferne, qui fait apprendre un livre par cœur à l’envers pendant treize ans et rend l’élève « fou, niais, tout rêveux et rassoté ».',
      },
      {
        titre: 'Thélème, une abbaye à l’envers',
        texte:
          'À la fin de *Gargantua*, le géant récompense le moine Jean des Entommeures en lui bâtissant une abbaye — mais une abbaye sans murailles, sans horloge, sans vœux, où les hommes et les femmes vivent ensemble, entrent et sortent quand ils veulent, et où l’on ne compte pas les heures. Son règlement tient en trois mots : « **Fais ce que voudras** ». Thélème n’est pas un appel au désordre : Rabelais précise que les Thélémites, bien nés et bien instruits, ont « un instinct qui les pousse à faire ce qui est bon ». C’est une **utopie**, c’est-à-dire une manière de critiquer le monde réel — ici les couvents, l’obéissance apprise par la peur, et l’idée qu’on ne tient les gens qu’enfermés.',
      },
      {
        titre: 'Condamné, protégé, immortel',
        texte:
          'La **Sorbonne**, faculté de théologie de Paris, condamne *Pantagruel* dès 1533, puis chacun des livres suivants. Rabelais échappe au bûcher parce qu’il a de puissants protecteurs : les frères **Du Bellay**, dont l’un est cardinal et l’emmène trois fois à Rome comme médecin, et **François Ier** lui-même, qui lui accorde en 1545 un privilège d’impression. Quand ses appuis vacillent, il disparaît quelques mois — une fois à Metz, une fois en Savoie. Il meurt à Paris en avril **1553**, curé sur le papier d’une paroisse où il n’avait jamais mis les pieds. Son livre, lui, n’a plus quitté la langue : il a donné « gigantesque », « quintessence », « thélémite », « rabelaisien », et une façon de mêler le rire au savoir que la littérature française n’a plus oubliée.',
      },
    ],
    chrono: [
      { date: 'vers 1483', fait: 'Naissance près de Chinon, en Touraine.' },
      { date: 'vers 1520', fait: 'Moine franciscain à Fontenay-le-Comte ; il apprend le grec.' },
      { date: '1530', fait: 'Il s’inscrit à la faculté de médecine de Montpellier.' },
      { date: '1532', fait: 'Médecin à l’Hôtel-Dieu de Lyon ; publication de *Pantagruel*.' },
      { date: '1534', fait: '*Gargantua* : l’abbaye de Thélème et « Fais ce que voudras ».' },
      { date: '1533-1543', fait: 'La Sorbonne condamne ses livres les uns après les autres.' },
      { date: '1545', fait: 'François Ier lui accorde un privilège d’impression.' },
      { date: '1546', fait: '*Tiers Livre* ; il se met à l’abri quelque temps à Metz.' },
      { date: '1552', fait: '*Quart Livre*, aussitôt censuré par le parlement de Paris.' },
      { date: 'avril 1553', fait: 'Mort à Paris.' },
    ],
    leSaisTu:
      'On doit au médecin de Lyon l’expression « le quart d’heure de Rabelais » : le moment où il faut payer l’addition. La légende raconte qu’il régla une note d’auberge en laissant traîner des sachets marqués « poison pour le roi » — on l’arrêta, et on lui offrit ainsi le voyage jusqu’à Paris.',
    aRetenir: [
      'Rabelais, né vers 1483, est moine puis médecin avant d’être écrivain.',
      'Il publie *Pantagruel* en 1532 et *Gargantua* en 1534, sous le pseudonyme Alcofribas Nasier.',
      '« Science sans conscience n’est que ruine de l’âme » vient de la lettre de Gargantua à son fils.',
      'L’abbaye de Thélème et sa règle unique, « Fais ce que voudras », sont une utopie humaniste.',
      'Ses livres sont condamnés par la Sorbonne ; il est protégé par les Du Bellay et François Ier.',
    ],
    mots: [
      {
        mot: 'Humanisme',
        sens: 'Mouvement du XVIᵉ siècle qui remet l’homme, les langues anciennes et l’esprit critique au centre du savoir.',
      },
      {
        mot: 'Utopie',
        sens: 'Description d’un monde idéal qui n’existe nulle part, écrite pour critiquer le monde réel.',
      },
      {
        mot: 'Pseudonyme',
        sens: 'Faux nom qu’un auteur prend pour publier, souvent pour échapper à la censure.',
      },
    ],
    lies: ['montaigne', 'francois-ier', 'invention-de-l-imprimerie', 'reforme-protestante'],
    niveaux: ['5e', '2de'],
    programme: 'Humanisme, Réformes et conflits religieux',
    tags: [
      'Gargantua',
      'Pantagruel',
      'Thélème',
      'humanisme',
      'Chinon',
      'Alcofribas Nasier',
      'science sans conscience',
      'rabelaisien',
      'Lyon',
      'géants',
      'Sorbonne',
    ],
  },
  {
    id: 'charles-quint',
    volet: 'personnages',
    nom: 'Charles Quint',
    surnom: 'l’empereur sur lequel le soleil ne se couche jamais',
    dates: '1500 – 1558',
    tri: 1558,
    periode: 'temps-modernes',
    emoji: '🌐',
    roles: ['Empereur du Saint Empire', 'Roi d’Espagne', 'Prince des Pays-Bas'],
    origine: 'Gand, Flandre',
    accroche:
      'Héritier de quatre familles à la fois, il règne de l’Allemagne au Pérou — puis abdique de tout, à cinquante-cinq ans, pour finir dans un monastère.',
    citations: [
      {
        texte:
          'Je parle latin à Dieu, italien aux femmes, français aux hommes et allemand à mon cheval.',
        contexte:
          'Mot prêté à l’empereur polyglotte. On ne le trouve écrit qu’à la fin du XVIᵉ siècle, bien après sa mort.',
        sens:
          'La phrase dit pourtant quelque chose de vrai : né à Gand, élevé en français, il régnait sur des peuples dont il ne parlait pas toutes les langues.',
        incertaine: true,
      },
      {
        texte:
          'Un seul frère, qui va contre l’opinion de toute la chrétienté depuis mille ans et plus, se tromperait nécessairement.',
        contexte:
          'Déclaration écrite de sa main aux princes de l’Empire, au lendemain du refus de Luther, diète de Worms, 19 avril 1521.',
        sens:
          'Il a écouté Luther et lui a laissé son sauf-conduit, mais il tranche : un homme seul ne peut pas avoir raison contre mille ans d’Église. L’Empire met le moine au ban.',
      },
      {
        texte:
          'Si en quelque chose j’ai manqué, sachez que ce fut sans le vouloir, et je vous en demande pardon.',
        contexte:
          'Discours d’abdication, devant les états généraux des Pays-Bas réunis à Bruxelles, le 25 octobre 1555.',
        sens:
          'Appuyé sur l’épaule de Guillaume d’Orange, l’homme le plus puissant du monde rend ses pouvoirs et demande pardon à ses sujets. Beaucoup de témoins pleurent.',
      },
      {
        texte:
          'Je ne parviens pas à faire marcher d’accord deux horloges, et je prétendais faire penser de même tous les hommes.',
        contexte:
          'Mot prêté à l’empereur retiré au monastère de Yuste, où il collectionnait les horloges, vers 1557.',
        sens:
          'Aucune source contemporaine ne le confirme. Il résume pourtant l’échec du règne : l’unité religieuse de l’Europe lui a échappé.',
        incertaine: true,
      },
    ],
    reperes: [
      'Né à Gand en 1500 : il hérite des Pays-Bas à 6 ans, de l’Espagne à 16, de l’Empire à 19.',
      'Élu empereur en 1519 contre François Ier, grâce aux prêts de la banque Fugger.',
      'Quatre guerres contre la France ; il fait François Ier prisonnier à Pavie en 1525.',
      'À la diète de Worms, en 1521, il met Martin Luther au ban de l’Empire.',
      'Son empire va des Pays-Bas au Pérou : le soleil ne s’y couche jamais.',
      'Il abdique en 1555-1556 et meurt au monastère de Yuste, en Estrémadure, en 1558.',
    ],
    recit: [
      {
        titre: 'Quatre héritages, un seul garçon',
        texte:
          'Les **Habsbourg** n’ont pas conquis leur empire : ils l’ont épousé. De son père Philippe le Beau, mort quand il a six ans, Charles reçoit les **Pays-Bas** et la Bourgogne ; de sa mère **Jeanne de Castille**, la Castille, l’Aragon, Naples, la Sicile et l’**Amérique** ; de son grand-père **Maximilien**, les terres d’Autriche et la candidature à l’Empire. Né à **Gand** en 1500, élevé en français par sa tante Marguerite et par le futur pape Adrien VI, il débarque en Espagne à dix-sept ans sans parler un mot de castillan — les villes se révoltent contre ce roi étranger et ses conseillers flamands (la révolte des *Comuneros*, 1520-1521), et il les écrase. Il apprendra l’espagnol, finira par préférer ce pays à tous les autres, et choisira d’y mourir.',
      },
      {
        titre: 'L’élection de 1519',
        texte:
          'À la mort de Maximilien, trois candidats se disputent la couronne du **Saint Empire** : Charles, **François Ier** et le roi d’Angleterre Henri VIII. Sept princes allemands votent, et leurs voix s’achètent. Le banquier d’Augsbourg **Jacob Fugger** avance à Charles près de 850 000 florins ; François Ier ne peut pas suivre. Le **28 juin 1519**, Charles est élu à dix-neuf ans ; il est couronné à Aix-la-Chapelle l’année suivante. Il est désormais **Charles Quint** pour l’Empire et Charles Ier pour l’Espagne, et son domaine enserre la France de la Flandre aux Pyrénées et des Alpes à la Méditerranée. Toute la politique française du siècle découlera de cet encerclement.',
      },
      {
        titre: 'Le duel avec François Ier',
        texte:
          'Quatre guerres, vingt-cinq ans. La plus célèbre se décide à **Pavie**, le 24 février **1525** : l’armée française est détruite, et le roi de France, cheval tué sous lui, est fait **prisonnier** puis emmené à Madrid. Charles obtient le traité de Madrid (1526) et la Bourgogne — que François Ier, à peine libéré, refuse d’appliquer. La guerre reprend ; en 1527, les troupes impériales impayées **saccagent Rome** et emprisonnent le pape, au grand embarras de l’empereur. La « paix des Dames » de Cambrai (1529), négociée entre Louise de Savoie et Marguerite d’Autriche, puis la trêve de Crépy (1544) ne règlent rien. Pour tenir tête à ce voisin, François Ier fait alors ce qu’aucun roi très chrétien n’avait osé : il s’allie au sultan **Soliman**.',
      },
      {
        titre: 'Worms, et la chrétienté qui se brise',
        texte:
          'Catholique convaincu, Charles se veut le protecteur de l’unité chrétienne. En **1521**, il convoque **Luther** à la **diète de Worms**, lui garantit un sauf-conduit, l’écoute refuser de se rétracter — et signe l’**édit de Worms** qui le met au ban de l’Empire. Mais il est occupé ailleurs : les Français à l’ouest, les Ottomans à l’est, l’Italie au sud. Pendant ce temps la **Réforme** gagne les princes allemands, qui s’unissent dans la **ligue de Smalkalde**. Il les écrase à **Mühlberg** en 1547, se fait peindre par Titien en cavalier vainqueur — puis perd tout en 1552 quand les princes se retournent, alliés au roi de France. La **paix d’Augsbourg** de 1555, signée par son frère Ferdinand, acte la défaite : chaque prince choisira désormais la religion de ses sujets. L’Allemagne est coupée en deux, et elle le restera.',
      },
      {
        titre: 'L’empire des deux mondes',
        texte:
          'Sous son règne, l’Amérique espagnole passe de quelques comptoirs à deux empires conquis : **Hernán Cortés** prend Mexico en 1521, **Pizarro** abat l’empire inca en 1533. En 1545, on découvre la montagne d’argent de **Potosí**, dans les Andes ; les galions en rapportent des tonnes chaque année, et cet argent finance les guerres d’Europe autant qu’il fait flamber les prix. La conquête pose aussi une question que Charles est le premier souverain à faire trancher publiquement : les Indiens sont-ils des hommes libres ? Il promulgue en 1542 les **Lois Nouvelles** qui interdisent de les réduire en esclavage, et convoque en 1550-1551 la **controverse de Valladolid**, où le dominicain **Bartolomé de Las Casas** défend les Indiens contre le théologien Sepúlveda. Les lois seront très mal appliquées ; le débat, lui, est fondateur.',
      },
      {
        titre: 'Yuste, 1556',
        texte:
          'À cinquante-cinq ans, usé par la goutte au point de ne plus tenir debout, il fait ce qu’aucun empereur n’avait fait : il **abdique de tout**. Le 25 octobre **1555**, à Bruxelles, il rend les Pays-Bas à son fils **Philippe II** ; en janvier 1556, l’Espagne et l’Amérique ; l’Empire va à son frère **Ferdinand**. Puis il s’embarque pour l’Espagne et se retire au monastère hiéronymite de **Yuste**, en Estrémadure, dans une maison de huit pièces accolée à l’église, avec une chambre dont une fenêtre donne sur l’autel. Il y vit deux ans entre ses **horloges**, ses tableaux du Titien, un jardin et la lecture des dépêches que son fils lui envoie encore. Il meurt le **21 septembre 1558**, en tenant le crucifix de sa femme. Sa dépouille rejoindra plus tard l’Escurial, dans le caveau que Philippe II fait bâtir pour les rois d’Espagne.',
      },
    ],
    chrono: [
      { date: '24 février 1500', fait: 'Naissance à Gand, en Flandre.' },
      { date: '1516', fait: 'Il devient roi d’Espagne à la mort de Ferdinand d’Aragon.' },
      { date: '28 juin 1519', fait: 'Élu empereur contre François Ier.' },
      { date: '18 avril 1521', fait: 'Diète de Worms : Luther est mis au ban de l’Empire.' },
      { date: '24 février 1525', fait: 'Victoire de Pavie : François Ier est fait prisonnier.' },
      { date: '1527', fait: 'Ses troupes impayées saccagent Rome.' },
      { date: '1535', fait: 'Expédition de Tunis contre les alliés du sultan.' },
      { date: '1545', fait: 'Découverte de la montagne d’argent de Potosí.' },
      { date: '1547', fait: 'Victoire de Mühlberg sur les princes protestants.' },
      { date: '25 octobre 1555', fait: 'Abdication à Bruxelles ; paix d’Augsbourg.' },
      { date: '21 septembre 1558', fait: 'Mort au monastère de Yuste.' },
    ],
    leSaisTu:
      'Les Habsbourg avaient une mâchoire inférieure si avancée que Charles ne fermait jamais complètement la bouche. On raconte qu’à Valladolid un paysan lui cria dans la rue : « Majesté, fermez la bouche, les mouches de ce pays sont insolentes ! » L’empereur, dit-on, en rit.',
    aRetenir: [
      'Charles Quint hérite des Pays-Bas, de l’Espagne, de l’Amérique et des terres d’Autriche.',
      'Élu empereur en 1519 contre François Ier, il lutte contre la France pendant vingt-cinq ans.',
      'Il met Luther au ban de l’Empire à la diète de Worms, en 1521, mais ne peut arrêter la Réforme.',
      'La paix d’Augsbourg (1555) laisse chaque prince allemand choisir la religion de ses sujets.',
      'Il abdique en 1555-1556 et meurt au monastère de Yuste en 1558.',
    ],
    mots: [
      {
        mot: 'Saint Empire',
        sens: 'Ensemble de principautés d’Allemagne et d’Europe centrale dont le souverain, l’empereur, est élu par sept princes.',
      },
      {
        mot: 'Abdication',
        sens: 'Acte par lequel un souverain renonce volontairement à son pouvoir.',
      },
      {
        mot: 'Ban de l’Empire',
        sens: 'Mise hors la loi prononcée par l’empereur : le condamné perd toute protection juridique.',
      },
    ],
    lies: [
      'francois-ier',
      'martin-luther',
      'soliman-le-magnifique',
      'philippe-ii-d-espagne',
      'hernan-cortes',
    ],
    niveaux: ['5e', '2de'],
    programme: 'Le monde au temps de Charles Quint et de Soliman le Magnifique',
    tags: [
      'Habsbourg',
      'Saint Empire',
      'Pavie',
      'Worms',
      'Yuste',
      'Espagne',
      'Charles Ier d’Espagne',
      'empereur',
      'Gand',
      'abdication',
      'Potosí',
      'Augsbourg',
    ],
  },
  {
    id: 'michel-ange',
    volet: 'personnages',
    nom: 'Michel-Ange',
    surnom: 'le divin',
    dates: '1475 – 1564',
    tri: 1564,
    periode: 'temps-modernes',
    emoji: '🗿',
    roles: ['Sculpteur', 'Peintre', 'Architecte', 'Poète'],
    origine: 'Caprese, Toscane',
    accroche:
      'Il se disait sculpteur et rien d’autre — il a pourtant peint la voûte de la Sixtine et dessiné la coupole de Saint-Pierre de Rome.',
    citations: [
      {
        texte: 'Je sculpte jusqu’à ce que la figure sorte de la pierre.',
        contexte:
          'Formule condensée, répandue au XIXᵉ siècle, de ce qu’il écrit en vers et dans ses lettres.',
        sens:
          'Elle résume sa vraie phrase, citée juste après : la statue est déjà dans le bloc de marbre, le sculpteur ne fait qu’ôter tout ce qui la cache.',
        incertaine: true,
      },
      {
        texte:
          'Le meilleur artiste n’a pas une seule idée que le marbre, en lui-même, ne contienne déjà : seule y atteint la main qui obéit à l’intelligence.',
        contexte: 'Sonnet écrit vers 1538, adressé à Vittoria Colonna.',
        sens:
          'Sculpter n’est pas ajouter, c’est enlever : l’œuvre attend dans la pierre, et la main ne l’atteint que guidée par la pensée.',
      },
      {
        texte: 'Je ne suis pas en bon lieu, et je ne suis pas peintre.',
        contexte:
          'Sonnet envoyé à son ami Giovanni da Pistoia pendant qu’il peint la voûte de la chapelle Sixtine, vers 1510.',
        sens:
          'Le poème décrit son corps tordu, son goitre, sa barbe pointée vers le ciel et la peinture qui lui tombe sur le visage. Il se plaint : il n’est pas peintre, il est sculpteur.',
      },
      {
        texte: 'J’apprends encore.',
        contexte:
          'Mot prêté à Michel-Ange âgé de quatre-vingt-sept ans, en italien *Ancora imparo*.',
        sens:
          'Aucun texte de son vivant ne le rapporte. La phrase colle pourtant à un homme qui taillait encore le marbre six jours avant de mourir.',
        incertaine: true,
      },
    ],
    reperes: [
      'Apprenti à 13 ans chez Ghirlandaio, puis élevé au palais de Laurent de Médicis, à Florence.',
      'La *Pietà* de Saint-Pierre à 24 ans, le *David* de Florence à 29.',
      'Quatre ans debout, la tête renversée, pour la voûte de la chapelle Sixtine (1508-1512).',
      'Le *Jugement dernier*, vingt-cinq ans plus tard, sur le mur de l’autel (1536-1541).',
      'Architecte de Saint-Pierre de Rome à 71 ans, sans vouloir de salaire : il dessine la coupole.',
      'Mort à Rome en 1564, à 88 ans ; son corps est ramené en secret à Florence.',
    ],
    recit: [
      {
        titre: 'L’enfant du marbre',
        texte:
          'Né en 1475 à **Caprese**, en Toscane, Michelangelo Buonarroti est mis en nourrice à **Settignano**, un village de carriers et de tailleurs de pierre : il dira plus tard avoir tété « le marteau et les ciseaux » avec le lait de sa nourrice. Son père, petit noble ruiné, le bat pour le détourner d’un métier manuel ; l’enfant tient bon et entre à treize ans dans l’atelier du peintre **Ghirlandaio**. Un an plus tard, **Laurent de Médicis** le remarque, l’installe dans son palais et le fait manger à sa table, parmi les poètes et les philosophes de Florence. Il y apprend l’Antiquité, la poésie, l’anatomie — qu’il complète en disséquant des cadavres dans un couvent. Un condisciple jaloux lui brise le nez d’un coup de poing : tous ses portraits garderont ce profil cassé.',
      },
      {
        titre: 'La Pietà, puis le David',
        texte:
          'À vingt-quatre ans, il sculpte à Rome la **Pietà** de Saint-Pierre : une mère de marbre, très jeune, tenant son fils mort sur ses genoux, et un drapé qu’on croirait tissé. De retour à Florence, il demande un bloc que personne n’a su travailler — cinq mètres de marbre abandonnés depuis quarante ans dans la cour de la cathédrale, surnommés « le Géant ». Il en tire en trois ans le **David** (1501-1504), 5,17 mètres, un adolescent nu, la fronde sur l’épaule, à l’instant qui précède le combat. La République de Florence le dresse devant le **Palazzo Vecchio** : le jeune homme qui abat le géant devient le symbole de la ville libre, face aux princes qui la convoitent. Quarante citoyens, dont **Léonard de Vinci** et Botticelli, avaient été réunis pour décider de son emplacement.',
      },
      {
        titre: 'Quatre ans sous la voûte',
        texte:
          'En 1508, le pape **Jules II** l’arrache à son chantier de sculpture pour lui confier la **voûte de la chapelle Sixtine**. Michel-Ange refuse, proteste qu’il n’est pas peintre, et finit par accepter. Quatre ans, environ 500 m² de **fresque**, plus de trois cents figures : la **Création d’Adam** et ses deux doigts qui ne se touchent pas, le Déluge, les prophètes et les sibylles. Contrairement à la légende, il ne peint pas couché sur le dos, mais **debout sur un échafaudage de son invention**, la tête renversée en arrière, la peinture lui coulant sur le visage — c’est ce qu’il décrit lui-même dans un poème furieux. Le chantier est rouvert au public le 31 octobre **1512**. Vingt-cinq ans plus tard, il revient peindre le mur du fond : le **Jugement dernier** (1536-1541), quatre cents corps nus emportés vers le ciel ou vers l’abîme.',
      },
      {
        titre: 'La querelle des corps nus',
        texte:
          'Le *Jugement dernier* choque autant qu’il fascine. Le maître de cérémonie du pape, **Biagio da Cesena**, juge ces nudités bonnes pour une taverne ; Michel-Ange le peint aussitôt en juge des enfers, avec des oreilles d’âne et un serpent. Après le **concile de Trente**, qui exige la décence dans les images sacrées, un peintre est chargé en 1565 de couvrir les nudités les plus visibles : on le surnommera *il Braghettone*, « le culottier ». Une partie de ces ajouts a été retirée lors de la restauration des années 1980-1994, qui a aussi rendu à la fresque ses couleurs vives, longtemps cachées sous la fumée des cierges.',
      },
      {
        titre: 'Saint-Pierre, à soixante et onze ans',
        texte:
          'En 1546, le pape le nomme **architecte de Saint-Pierre de Rome**, le plus grand chantier de la chrétienté — celui-là même dont la vente des **indulgences** devait payer les pierres, et qui avait déclenché la colère de Luther trente ans plus tôt. Michel-Ange accepte sans salaire, « pour l’amour de Dieu », revient au plan en croix de Bramante et dessine la **coupole** : 42 mètres de diamètre, achevée en 1590, après sa mort. Il avait déjà bâti à Florence la bibliothèque Laurentienne et son escalier, et il redessine à Rome la place du **Capitole**. Il meurt le **18 février 1564**, à quatre-vingt-huit ans, six jours après avoir encore travaillé à sa dernière *Pietà*. Son neveu fait sortir le corps de Rome caché dans une balle de marchandises : Florence voulait son sculpteur, et l’enterra à **Santa Croce**.',
      },
    ],
    chrono: [
      { date: '6 mars 1475', fait: 'Naissance à Caprese, en Toscane.' },
      { date: '1489', fait: 'Il entre au jardin des Médicis, à Florence.' },
      { date: '1499', fait: 'La *Pietà* de Saint-Pierre, achevée à 24 ans.' },
      { date: '1504', fait: 'Le *David* est dressé devant le Palazzo Vecchio.' },
      { date: '1508-1512', fait: 'Voûte de la chapelle Sixtine, pour Jules II.' },
      { date: '1520-1534', fait: 'Chapelle et tombeaux des Médicis, à Florence.' },
      { date: '1536-1541', fait: 'Le *Jugement dernier* sur le mur de l’autel.' },
      { date: '1546', fait: 'Architecte de Saint-Pierre de Rome ; il dessine la coupole.' },
      { date: '18 février 1564', fait: 'Mort à Rome, à 88 ans.' },
      { date: '1564', fait: 'Son corps est ramené en secret à Florence, à Santa Croce.' },
    ],
    leSaisTu:
      'La *Pietà* est la seule œuvre qu’il ait signée. Il aurait entendu des visiteurs l’attribuer à un sculpteur milanais et serait revenu de nuit, à la lampe, graver son nom sur la bande qui barre la poitrine de la Vierge. Il regretta ensuite ce geste d’orgueil et ne signa plus jamais rien.',
    aRetenir: [
      'Michel-Ange (1475-1564) est sculpteur, peintre, architecte et poète de la Renaissance italienne.',
      'Il sculpte la *Pietà* de Saint-Pierre en 1499 et le *David* de Florence en 1501-1504.',
      'Il peint la voûte de la chapelle Sixtine de 1508 à 1512, pour le pape Jules II.',
      'Nommé architecte de Saint-Pierre de Rome en 1546, il en dessine la coupole.',
      'Ses commanditaires sont les Médicis et les papes : l’art de la Renaissance vit du mécénat.',
    ],
    mots: [
      {
        mot: 'Fresque',
        sens: 'Peinture faite sur un enduit encore frais : la couleur entre dans le mur et devient indélébile.',
      },
      {
        mot: 'Pietà',
        sens: 'Œuvre représentant la Vierge Marie tenant sur ses genoux le corps du Christ mort.',
      },
      {
        mot: 'Mécène',
        sens: 'Personne riche et puissante qui commande des œuvres et fait vivre les artistes.',
      },
    ],
    lies: ['leonard-de-vinci', 'martin-luther', 'charles-quint', 'francois-ier'],
    niveaux: ['5e'],
    programme: 'Humanisme, Réformes et conflits religieux',
    tags: [
      'Sixtine',
      'David',
      'Pietà',
      'Saint-Pierre de Rome',
      'Florence',
      'Jugement dernier',
      'marbre',
      'Renaissance',
      'Jules II',
      'Médicis',
      'coupole',
      'fresque',
    ],
  },
  {
    id: 'soliman-le-magnifique',
    volet: 'personnages',
    nom: 'Soliman le Magnifique',
    surnom: 'le législateur',
    dates: '1494 – 1566',
    tri: 1566,
    periode: 'temps-modernes',
    emoji: '🕌',
    roles: ['Sultan ottoman', 'Calife', 'Législateur', 'Poète'],
    origine: 'Trébizonde, Empire ottoman',
    accroche:
      'Sous ses quarante-six ans de règne, l’Empire ottoman atteint son apogée : il assiège Vienne, s’allie à la France et couvre Istanbul de mosquées.',
    citations: [
      {
        texte:
          'Il n’est rien parmi les hommes de plus prisé que le pouvoir ; mais il n’est au monde aucun pouvoir qui vaille un souffle de santé.',
        contexte:
          'Distique écrit par le sultan lui-même sous son nom de poète, *Muhibbî* — « celui qui aime ».',
        sens:
          'Le maître de trois continents écrit que la santé d’un instant vaut mieux que son empire. Les Ottomans connaissent ce vers par cœur.',
      },
      {
        texte:
          'Je suis le serviteur de Dieu et le sultan de ce monde. Par la grâce de Dieu, je suis le chef de la communauté de Mahomet. Je suis le sultan de Bagdad et d’Irak, César de toutes les terres de Rome, sultan d’Égypte.',
        contexte:
          'Inscription gravée sur ordre du sultan à Bender, sur le Dniestr, en 1538.',
        sens:
          'Chaque titre est une conquête, et « César des terres de Rome » vise l’héritage de Constantinople, prise par ses ancêtres en 1453.',
      },
      {
        texte:
          'Prends courage et ne te laisse pas abattre. Nuit et jour notre cheval est sellé et notre sabre est ceint.',
        contexte:
          'Lettre au roi de France François Ier, alors prisonnier de Charles Quint après Pavie, février 1526.',
        sens:
          'Le sultan répond à la mère du roi, qui a demandé son aide. Six mois plus tard, son armée écrase la Hongrie à Mohács — et l’empereur doit se retourner vers l’est.',
      },
    ],
    reperes: [
      'Dixième sultan ottoman, il règne quarante-six ans, de 1520 à 1566.',
      'Ses sujets l’appellent *Kanunî*, « le Législateur » ; l’Europe dit « le Magnifique ».',
      'Belgrade en 1521, Rhodes en 1522, la Hongrie à Mohács en 1526, Vienne assiégée en 1529.',
      'Alliance avec François Ier contre Charles Quint : les Capitulations de 1536.',
      'Son architecte Sinan bâtit la mosquée Süleymaniye d’Istanbul, achevée en 1557.',
      'Mort le 6 septembre 1566 sous les murs de Szigetvár, en Hongrie, pendant une campagne.',
    ],
    recit: [
      {
        titre: 'Un empire à son zénith',
        texte:
          'Quand Soliman succède à son père Selim en **1520**, l’Empire ottoman vient de doubler : il tient déjà la Syrie, l’Égypte, et surtout **La Mecque et Médine**, ce qui fait du sultan le **calife**, protecteur des lieux saints de l’islam. Le jeune souverain reprend aussitôt la marche vers l’ouest. **Belgrade** tombe en 1521, la verrouillant porte de l’Europe centrale ; **Rhodes** en 1522, après six mois de siège, chasse les chevaliers de Saint-Jean, qui iront s’installer à Malte. Le 29 août **1526**, à **Mohács**, l’armée hongroise est anéantie en deux heures et le roi Louis II se noie dans sa fuite : la **Hongrie**, royaume chrétien millénaire, disparaît de la carte. L’empire compte alors une quinzaine de millions d’habitants, de l’Algérie à la Perse, et **Istanbul** est la plus grande ville d’Europe.',
      },
      {
        titre: 'Vienne, 1529',
        texte:
          'En septembre **1529**, Soliman est devant **Vienne**, capitale des Habsbourg et verrou de l’Empire. Il a plus de cent mille hommes, mais la route de Hongrie a été noyée par des pluies d’automne : la grosse **artillerie** de siège est restée embourbée derrière lui. Les défenseurs, bien moins nombreux, tiennent trois semaines, comblent les brèches ouvertes par les mines, et la saison tourne. Le **14 octobre**, le sultan lève le siège et repart. C’est la limite de l’expansion ottomane vers l’ouest, et elle ne bougera plus : une seconde tentative, en 1532, s’arrête devant la petite place de Kőszeg. Vienne restera pour deux siècles la frontière de deux mondes, et la peur du Turc, une donnée permanente de la politique européenne.',
      },
      {
        titre: 'L’alliance avec le roi de France',
        texte:
          'La France et l’Empire ottoman ont le même adversaire : **Charles Quint**. Après **Pavie** (1525), la mère de François Ier demande secours au sultan, qui répond. En **1536**, les deux États signent les **Capitulations** : les marchands français obtiennent le droit de commercer librement dans tout l’empire, d’y être jugés par leur propre consul, et le roi de France se voit reconnaître un rôle de protecteur des chrétiens latins du Levant. Les flottes coopèrent : en 1543, l’escadre du corsaire **Barberousse** hiverne à **Toulon**, ce qui scandalise toute la chrétienté. L’alliance est jugée impie par les ennemis de la France ; elle est pourtant froidement raisonnable, et elle durera, sous des formes diverses, jusqu’au XVIIIᵉ siècle.',
      },
      {
        titre: 'Kanunî, le Législateur',
        texte:
          'L’Europe l’a surnommé « le Magnifique » pour son faste ; ses sujets l’appellent **Kanunî**, « le Législateur », et c’est de cela qu’il était le plus fier. Avec le grand juriste **Ebussuud**, il fait réviser et harmoniser le ***kanun*** — le droit de l’État, impôts, propriété, statut des paysans, peines — pour le faire tenir avec la loi religieuse sans la contredire. Les paysans, la *reaya*, reçoivent des garanties écrites contre l’arbitraire des gouverneurs ; l’administration est tenue par des fonctionnaires formés à l’école du palais. Les communautés non musulmanes — chrétiens orthodoxes, arméniens, juifs — vivent sous leurs propres chefs religieux, qui rendent la justice de leur communauté et répondent d’elle devant le sultan. Les juifs chassés d’Espagne en 1492 avaient été accueillis par cet empire ; beaucoup vivent à Salonique et à Istanbul.',
      },
      {
        titre: 'Sinan, et la pierre',
        texte:
          'Son règne est l’**âge d’or** ottoman. Le sultan confie ses chantiers à **Mimar Sinan**, ancien soldat du génie devenu architecte en chef pendant cinquante ans, auteur de plus de trois cents bâtiments. Son chef-d’œuvre pour Soliman est la **Süleymaniye** (1550-1557), qui domine Istanbul : ce n’est pas seulement une mosquée mais une petite ville — quatre écoles, une école de médecine, un hôpital, une cuisine qui nourrit les pauvres, des bains, une bibliothèque, un caravansérail. Autour, les ateliers d’**Iznik** produisent les céramiques bleues et rouges qui habillent les murs, les calligraphes dessinent la signature impériale, la *tughra*, et les poètes écrivent en turc une langue nouvelle. Le sultan est de ceux-là : sous le nom de **Muhibbî**, il a laissé près de trois mille poèmes.',
      },
      {
        titre: 'Roxelane, les fils, la dernière campagne',
        texte:
          'Le palais est aussi un théâtre. Soliman épouse **Hürrem**, une captive d’origine ruthène que l’Europe appelle **Roxelane** : il l’affranchit et se marie avec elle, ce qu’aucun sultan ne faisait plus depuis des générations, et il lui écrit des poèmes. Elle pèse sur les affaires, et la succession devient une guerre de famille : le prince **Mustafa**, le fils aîné, est exécuté en 1553 sur ordre de son père, convaincu d’un complot ; le prince Bayezid l’est en 1561. Reste Selim, qui régnera. Le grand vizir **Ibrahim Pacha**, ami d’enfance du sultan, avait déjà été mis à mort en 1536. Soliman meurt de vieillesse le **6 septembre 1566**, sous sa tente, pendant le siège de **Szigetvár**. Le grand vizir Sokollu cache sa mort pendant des semaines, faisant porter le corps dans la litière impériale, pour que l’armée ne se débande pas avant l’arrivée du nouveau sultan.',
      },
    ],
    chrono: [
      { date: '1494', fait: 'Naissance à Trébizonde, sur la mer Noire.' },
      { date: '1520', fait: 'Il succède à son père Selim Ier.' },
      { date: '1521', fait: 'Prise de Belgrade.' },
      { date: '1522', fait: 'Prise de Rhodes : les chevaliers de Saint-Jean partent pour Malte.' },
      { date: '29 août 1526', fait: 'Victoire de Mohács : la Hongrie s’effondre.' },
      { date: 'septembre-octobre 1529', fait: 'Siège de Vienne, levé le 14 octobre.' },
      { date: '1536', fait: 'Capitulations : traité de commerce et d’alliance avec la France.' },
      { date: '1543', fait: 'La flotte de Barberousse hiverne à Toulon.' },
      { date: '1557', fait: 'Inauguration de la mosquée Süleymaniye, bâtie par Sinan.' },
      { date: '6 septembre 1566', fait: 'Mort devant Szigetvár, en Hongrie.' },
    ],
    leSaisTu:
      'Son corps repose à Istanbul, mais son cœur et ses viscères furent enterrés là où il était mort, en Hongrie, sous un petit sanctuaire détruit un siècle plus tard. Des archéologues hongrois en ont retrouvé les fondations en 2015, au milieu d’un champ de vignes, près de Szigetvár.',
    aRetenir: [
      'Soliman le Magnifique règne sur l’Empire ottoman de 1520 à 1566 : c’est son apogée.',
      'Ses sujets l’appellent le Législateur, pour la refonte du kanun, le droit de l’État.',
      'Il prend Belgrade et Rhodes, écrase la Hongrie à Mohács en 1526, mais échoue devant Vienne en 1529.',
      'Il s’allie à François Ier contre Charles Quint : les Capitulations de 1536.',
      'Son architecte Sinan bâtit la Süleymaniye d’Istanbul, achevée en 1557.',
    ],
    mots: [
      {
        mot: 'Sultan',
        sens: 'Titre du souverain ottoman, qui détient le pouvoir politique et militaire.',
      },
      {
        mot: 'Calife',
        sens: 'Successeur de Mahomet à la tête de la communauté musulmane ; les sultans ottomans le sont depuis 1517.',
      },
      {
        mot: 'Kanun',
        sens: 'Droit édicté par le sultan — impôts, terres, peines — à côté de la loi religieuse.',
      },
      {
        mot: 'Janissaire',
        sens: 'Soldat d’élite de l’infanterie ottomane, recruté enfant et formé au service du sultan.',
      },
    ],
    lies: [
      'charles-quint',
      'francois-ier',
      'chute-de-constantinople',
      'philippe-ii-d-espagne',
      'mahomet',
    ],
    niveaux: ['5e', '2de'],
    programme: 'Le monde au temps de Charles Quint et de Soliman le Magnifique',
    tags: [
      'Ottomans',
      'sultan',
      'Istanbul',
      'Vienne',
      'Kanunî',
      'Sinan',
      'Süleymaniye',
      'Mohács',
      'Roxelane',
      'Capitulations',
      'janissaires',
      'Szigetvár',
    ],
  },
  {
    id: 'montaigne',
    volet: 'personnages',
    nom: 'Michel de Montaigne',
    surnom: 'l’homme qui s’est pris lui-même pour sujet',
    dates: '1533 – 1592',
    tri: 1592,
    periode: 'temps-modernes',
    emoji: '🧐',
    roles: ['Écrivain', 'Magistrat', 'Maire de Bordeaux'],
    origine: 'Château de Montaigne, en Périgord',
    accroche:
      'À trente-huit ans, il s’enferme dans sa tour pour écrire sur le seul sujet qu’il connaisse vraiment — lui-même — et invente l’essai.',
    citations: [
      {
        texte: 'Que sais-je ?',
        contexte:
          'Devise qu’il fait graver sur une médaille, avec une balance en équilibre, *Essais*, livre II.',
        sens:
          'Ce n’est pas un aveu d’ignorance mais une méthode : peser, douter, se méfier de soi d’abord — et n’affirmer qu’ensuite.',
      },
      {
        texte: 'Parce que c’était lui, parce que c’était moi.',
        contexte:
          'Sur son amitié avec Étienne de La Boétie, mort en 1563 ; *Essais*, livre I, chapitre 28, « De l’amitié ».',
        sens:
          'Il cherche pourquoi il aimait son ami, n’y parvient pas — et écrit ainsi la phrase la plus citée de la langue française sur l’amitié.',
      },
      {
        texte: 'Le plus grand signe de sagesse, c’est une constante allégresse.',
        contexte:
          '*Essais*, livre I, chapitre 26. En français du XVIᵉ siècle : « Le plus expres signe de la sagesse, c’est une esjouissance constante. »',
        sens:
          'Un homme vraiment sage n’est pas un homme triste : pour Montaigne, la gaieté prouve que le savoir a servi à quelque chose.',
      },
      {
        texte:
          'Je veux qu’on m’y voie en ma façon simple, naturelle et ordinaire, sans étude et artifice : car c’est moi que je peins.',
        contexte: 'Avis « Au lecteur » placé en tête des *Essais*, daté du 1ᵉʳ mars 1580.',
        sens:
          'Le programme du livre en une phrase : il n’écrit ni pour instruire ni pour briller, il se décrit tel qu’il est, défauts compris.',
      },
    ],
    reperes: [
      'Élevé en latin : jusqu’à six ans, un précepteur allemand ne lui parle pas d’autre langue.',
      'Conseiller au parlement de Bordeaux dès 1557 ; il y rencontre Étienne de La Boétie.',
      'En 1571, à 38 ans, il se retire dans la tour de son château pour lire et écrire.',
      'Les *Essais* paraissent en 1580, augmentés en 1588, puis jusqu’à sa mort dans les marges.',
      'Maire de Bordeaux de 1581 à 1585, en pleine guerre de Religion.',
      'Médiateur entre Henri III et Henri de Navarre, qui dort deux fois chez lui.',
    ],
    recit: [
      {
        titre: 'Un enfant élevé en latin',
        texte:
          'La fortune de la famille vient du commerce de vin et de poisson salé à Bordeaux ; l’anoblissement est récent, et le père, **Pierre Eyquem**, maire de la ville, a rapporté d’Italie des idées d’éducation. Il fait éveiller son fils en musique, le met en nourrice dans un village pour qu’il connaisse le peuple, et lui donne un précepteur allemand qui ne parle **que latin** — au point que toute la maison doit s’y mettre. À six ans, Michel entre au collège de Guyenne en sachant le latin mieux que ses maîtres. Il étudie ensuite le droit, et devient à vingt-quatre ans **conseiller au parlement de Bordeaux**, cour de justice où il passera treize ans à juger, sans grand enthousiasme.',
      },
      {
        titre: 'La Boétie',
        texte:
          'En 1558, il rencontre un autre magistrat, **Étienne de La Boétie**, dont il a lu le *Discours de la servitude volontaire* — un texte qui demande pourquoi des millions d’hommes obéissent à un seul. Leur amitié est immédiate et totale ; Montaigne dira n’avoir jamais rien connu de tel. La Boétie meurt de la peste en **1563**, à trente-deux ans, dans ses bras, après trois jours d’agonie que Montaigne raconte dans une lettre bouleversante à son père. Il n’aura ensuite qu’une idée : publier les œuvres de son ami, puis remplir le vide. « Si on me presse de dire pourquoi je l’aimais, je sens que cela ne se peut exprimer qu’en répondant : **parce que c’était lui, parce que c’était moi**. » Les *Essais* naissent en grande partie de cette absence.',
      },
      {
        titre: 'La tour, la librairie, les Essais',
        texte:
          'Le **28 février 1571**, jour de ses trente-huit ans, il fait peindre sur le mur de sa tour l’acte de sa retraite : las de servir, il se retire « au sein des doctes vierges », c’est-à-dire dans ses livres. Sa **librairie** ronde compte un millier de volumes ; sur les poutres, il fait peindre cinquante-sept sentences grecques et latines. Il se met à écrire ce qu’il appelle des ***essais*** — au sens d’essayer, de mettre à l’épreuve. Le mot va devenir un genre. Il parle de l’amitié, de l’éducation, de la peur, des pouces, des coches, des cannibales, de sa propre mémoire défaillante et de ses reins malades. « Je ne peins pas l’être, je peins le passage » : il ne cherche pas une vérité définitive, il suit un homme qui change. Le livre paraît en **1580**, grossit d’un tiers en 1588, et continue de grossir dans les marges de son exemplaire jusqu’à sa mort.',
      },
      {
        titre: 'Un livre contre la cruauté',
        texte:
          'Montaigne écrit pendant les **guerres de Religion**, dans un pays où l’on massacre au nom de la vérité. Son livre est, sans jamais prêcher, une longue défense de la mesure. Au chapitre « Des cannibales », il raconte avoir rencontré à Rouen, en 1562, trois Indiens **Tupinamba** amenés du Brésil, et interroge : qui est le barbare ? « **Chacun appelle barbarie ce qui n’est pas de son usage** », écrit-il, avant de remarquer que manger un ennemi mort est moins cruel que de déchirer un homme vivant par des supplices « sous prétexte de piété et de religion », comme on le fait entre voisins en France. C’est, un siècle avant les Lumières, l’un des premiers textes européens qui retourne le regard.',
      },
      {
        titre: 'Maire de Bordeaux, dans la guerre',
        texte:
          'En 1581, alors qu’il voyage en Italie pour soigner ses calculs rénaux aux eaux thermales, il apprend qu’on l’a élu **maire de Bordeaux** en son absence. Il accepte, et fait deux mandats de deux ans dans une ville coupée en deux, entre un gouverneur catholique et un roi de Navarre protestant. Sa politique est celle de son livre : tenir la ville hors de la guerre, parler aux deux camps, ne rien envenimer. **Henri de Navarre**, futur Henri IV, dort deux fois à son château et lui confie des messages pour la cour. Quand la **peste** ravage Bordeaux en 1585 — près de la moitié des habitants meurt —, son mandat s’achève et il ne rentre pas dans la ville : on le lui reprochera, alors qu’il n’avait plus de charge à y exercer.',
      },
      {
        titre: 'Ce qu’il laisse',
        texte:
          'Il meurt le **13 septembre 1592**, à cinquante-neuf ans, dans sa chambre, pendant une messe qu’il avait fait dire. **Marie de Gournay**, une jeune admiratrice qu’il appelait sa « fille d’alliance », publie en 1595 l’édition complète établie sur son exemplaire annoté ; c’est grâce à elle que nous lisons les *Essais* d’aujourd’hui. Le livre sera mis à l’Index par Rome en 1676 — trop libre —, ce qui ne l’empêchera pas d’être lu par Pascal, qui le combat, par Rousseau, qui l’imite, par Nietzsche et par Zweig, qui s’y réfugie en 1942. Il a inventé un genre, l’**essai**, et une manière d’écrire : à la première personne, sans système, en se méfiant de soi. « Que sais-je ? » est aujourd’hui encore le titre d’une collection de livres de poche.',
      },
    ],
    chrono: [
      { date: '28 février 1533', fait: 'Naissance au château de Montaigne, en Périgord.' },
      { date: '1557', fait: 'Conseiller au parlement de Bordeaux.' },
      { date: '1563', fait: 'Mort d’Étienne de La Boétie, son ami.' },
      { date: '1571', fait: 'Il se retire dans la tour de son château, à 38 ans.' },
      { date: '1580', fait: 'Première édition des *Essais*, en deux livres.' },
      { date: '1580-1581', fait: 'Voyage en Allemagne, en Suisse et en Italie.' },
      { date: '1581-1585', fait: 'Maire de Bordeaux, réélu une fois.' },
      { date: '1588', fait: 'Édition augmentée d’un troisième livre.' },
      { date: '13 septembre 1592', fait: 'Mort au château de Montaigne.' },
      { date: '1595', fait: 'Édition posthume établie par Marie de Gournay.' },
    ],
    leSaisTu:
      'Sur les poutres de sa librairie, il avait fait peindre cinquante-sept sentences grecques et latines, qu’il pouvait lire en levant les yeux de son travail. Une partie est encore visible aujourd’hui dans la tour, seul bâtiment du château à avoir échappé à l’incendie de 1885.',
    aRetenir: [
      'Michel de Montaigne (1533-1592) est un magistrat périgourdin devenu écrivain.',
      'Il se retire dans sa tour en 1571 et publie les *Essais* en 1580, augmentés en 1588.',
      'Il invente l’essai : un texte à la première personne qui met les idées à l’épreuve.',
      'Sa devise « Que sais-je ? » résume son doute méthodique face à toute certitude.',
      'Maire de Bordeaux de 1581 à 1585, il cherche la paix pendant les guerres de Religion.',
    ],
    mots: [
      {
        mot: 'Essai',
        sens: 'Texte où l’auteur examine librement une question à la première personne ; le genre naît avec Montaigne.',
      },
      {
        mot: 'Librairie',
        sens: 'Au XVIᵉ siècle, la pièce où l’on garde ses livres : ce que nous appelons une bibliothèque.',
      },
      {
        mot: 'Scepticisme',
        sens: 'Attitude de celui qui suspend son jugement et doute qu’on puisse atteindre une certitude.',
      },
      {
        mot: 'Index',
        sens: 'Liste des livres dont l’Église catholique interdisait la lecture aux fidèles.',
      },
    ],
    lies: ['rabelais', 'shakespeare', 'henri-iv', 'massacre-de-la-saint-barthelemy'],
    niveaux: ['5e', '2de'],
    programme: 'Humanisme, Réformes et conflits religieux',
    tags: [
      'Essais',
      'Que sais-je',
      'La Boétie',
      'Bordeaux',
      'Périgord',
      'humanisme',
      'Des cannibales',
      'tour',
      'amitié',
      'scepticisme',
      'Marie de Gournay',
    ],
  },
  {
    id: 'philippe-ii-d-espagne',
    volet: 'personnages',
    nom: 'Philippe II d’Espagne',
    surnom: 'le roi prudent',
    dates: '1527 – 1598',
    tri: 1598,
    periode: 'temps-modernes',
    emoji: '🖋️',
    roles: ['Roi d’Espagne', 'Roi du Portugal', 'Maître des Pays-Bas'],
    origine: 'Valladolid, Castille',
    accroche:
      'Depuis un bureau de l’Escurial, il gouverne par écrit un empire où le soleil ne se couche jamais — et le voit se fissurer aux Pays-Bas.',
    citations: [
      {
        texte:
          'Je préférerais perdre tous mes États et cent vies plutôt que de régner sur des hérétiques.',
        contexte:
          'Réponse rapportée aux envoyés des Pays-Bas venus demander l’arrêt des persécutions, en 1566.',
        sens:
          'Tout le règne tient là : il se croit d’abord comptable devant Dieu de la foi de ses sujets, et il paiera ce choix par quarante ans de guerre aux Pays-Bas.',
      },
      {
        texte: 'J’ai envoyé mes navires combattre les hommes, non les tempêtes.',
        contexte:
          'Mot prêté au roi apprenant la destruction de l’Invincible Armada, à l’automne 1588.',
        sens:
          'Aucune source du temps ne l’atteste. Les vents ont bien achevé la flotte, mais c’est la marine anglaise qui l’avait d’abord rompue devant Gravelines.',
        incertaine: true,
      },
      {
        texte:
          'Je ne puis approuver que des princes veuillent commander à la conscience de leurs sujets et leur ôter la liberté de croyance et de religion.',
        qui: 'Guillaume d’Orange, chef de la révolte des Pays-Bas',
        contexte:
          'Dans son *Apologie*, réponse publiée en 1581 au ban qui mettait sa tête à prix.',
        sens:
          'La réponse exacte à la phrase du roi : deux idées de l’autorité se font face, et ce sont les Provinces-Unies qui naîtront de celle-ci.',
      },
    ],
    reperes: [
      'Fils de Charles Quint ; il reçoit en 1556 l’Espagne, les Pays-Bas, Naples, Milan et l’Amérique.',
      'Il gouverne par écrit, annotant lui-même des milliers de dépêches, sans presque quitter Madrid.',
      'Il fait bâtir l’Escurial (1563-1584) : palais, monastère, bibliothèque et tombeau des rois.',
      'Victoire navale de Lépante sur la flotte ottomane, le 7 octobre 1571.',
      'Roi du Portugal en 1580 : son empire fait alors le tour du monde.',
      'L’Invincible Armada est détruite en 1588 ; il meurt à l’Escurial en 1598.',
    ],
    recit: [
      {
        titre: 'L’héritier du plus grand empire du monde',
        texte:
          'Quand **Charles Quint** abdique, il coupe son héritage en deux : l’Empire et l’Autriche vont à son frère, tout le reste à son fils. Philippe, né à Valladolid en 1527 et élevé en Espagne, reçoit donc la Castille, l’Aragon, Naples, la Sicile, Milan, les **Pays-Bas** et l’**Amérique**. En 1561, il fixe sa capitale à **Madrid**, jusque-là bourgade sans importance : l’Espagne a pour la première fois un centre. Les galions rapportent chaque année des centaines de tonnes d’**argent** de Potosí et du Mexique — et pourtant l’État fait **banqueroute** trois fois sous son règne, en 1557, 1575 et 1596. L’argent d’Amérique passe tout entier dans les guerres et chez les banquiers génois, et sa masse fait flamber les prix dans toute l’Europe.',
      },
      {
        titre: 'Le bureau du monde',
        texte:
          'Il ne ressemble en rien à son père le chevalier. Philippe II gouverne **assis**, en lisant. Les dépêches arrivent de Mexico, de Manille, de Naples, de Bruxelles ; il les lit toutes, écrit ses réponses dans la marge de sa petite écriture, corrige jusqu’à l’orthographe de ses secrétaires. On l’appelle « le roi paperassier », et aussi **el Rey Prudente**, le roi prudent : il ne décide jamais vite. Ce système a un prix — un ordre met six mois à atteindre les Pays-Bas et revenir —, mais il produit la première grande administration d’État d’Europe, avec ses conseils spécialisés et ses archives, installées au château de **Simancas**, qui existent toujours.',
      },
      {
        titre: 'L’Escurial',
        texte:
          'Pour remercier Dieu de la victoire de Saint-Quentin, remportée le jour de la Saint-Laurent 1557, il fait bâtir dans la montagne, à cinquante kilomètres de Madrid, le monastère-palais de **San Lorenzo de El Escorial** (1563-1584). C’est un immense quadrilatère de granit gris, nu, austère, dont le plan évoque le gril du supplice de saint Laurent. On y trouve réunis un monastère, une basilique, une **bibliothèque** de plusieurs dizaines de milliers de volumes, un collège, un hôpital, le palais du roi et le **caveau des rois d’Espagne**, où il fait transférer le corps de son père. La chambre du souverain, petite et sombre, ouvre par une fenêtre sur le maître-autel : malade, il pouvait suivre la messe depuis son lit. L’Escurial est le portrait du roi en pierre.',
      },
      {
        titre: 'Lépante, 1571',
        texte:
          'Les Ottomans, après la mort de Soliman, avancent encore en Méditerranée et prennent Chypre à Venise. Le pape réunit une **Sainte Ligue** : l’Espagne, Venise, Gênes, Malte. Le **7 octobre 1571**, dans le golfe de **Lépante**, plus de deux cents galères chrétiennes commandées par **Don Juan d’Autriche**, demi-frère du roi, affrontent une flotte ottomane de taille comparable. En quatre heures, la flotte du sultan est détruite ; des milliers de rameurs chrétiens enchaînés sont libérés. Toute l’Europe catholique sonne les cloches. La portée réelle est plus mesurée : les Ottomans reconstruisent leur flotte en un an et gardent Chypre. Mais la légende de leur invincibilité navale est morte ce jour-là.',
      },
      {
        titre: 'Les Pays-Bas, la plaie ouverte',
        texte:
          'Les **dix-sept provinces** des Pays-Bas sont la région la plus riche d’Europe : villes marchandes, drapiers, imprimeurs, banquiers — et, de plus en plus, **calvinistes**. Philippe, absent et espagnol, y lève des impôts nouveaux et y renforce l’Inquisition. En 1566, une vague d’**iconoclasme** brise les statues des églises. Il envoie le duc d’**Albe** et son « Conseil des troubles », qui prononce plus d’un millier de condamnations à mort, dont celles des comtes d’**Egmont** et de Hornes, décapités à Bruxelles en 1568. La révolte devient guerre. **Guillaume d’Orange**, dit le Taciturne, la conduit jusqu’à son assassinat en 1584, par un homme attiré par la prime que le roi avait mise sur sa tête. Les provinces du Nord se sont liées par l’**Union d’Utrecht** (1579) et ont déposé leur souverain en 1581 : les **Provinces-Unies** sont nées. La guerre durera quatre-vingts ans.',
      },
      {
        titre: 'L’Armada, 1588',
        texte:
          'L’Angleterre d’**Élisabeth Ire** soutient les révoltés, ses corsaires pillent les galions d’argent, et l’exécution de **Marie Stuart** en 1587 décide le roi. Il arme l’**Invincible Armada** : environ 130 navires et 30 000 hommes, qui doivent remonter la Manche et embarquer au passage l’armée des Pays-Bas pour débarquer en Angleterre. Le plan suppose une coordination impossible à cette distance. Devant **Calais**, les Anglais lancent des brûlots dans la flotte au mouillage et la dispersent ; le combat de **Gravelines** l’empêche de se reformer ; le vent du sud interdit le retour par la Manche et force la ronde par l’Écosse et l’Irlande, où les tempêtes achèvent les navires. La moitié de la flotte est perdue. L’Espagne reconstruit et la guerre continue jusqu’en 1604 — mais le **mythe de sa puissance** est entamé.',
      },
      {
        titre: 'Le siècle d’or et la fin',
        texte:
          'En **1580**, à la mort du roi du Portugal, il fait valoir ses droits, envoie le duc d’Albe et réunit les deux couronnes : Lisbonne, le Brésil, l’Afrique, les Indes et Manille s’ajoutent à Mexico et Lima. Son empire fait littéralement le tour de la Terre, et la formule est de ce temps-là : « l’empire où le soleil ne se couche jamais ». C’est aussi le **Siècle d’or** espagnol : **Cervantès**, Lope de Vega, sainte Thérèse d’Ávila, **Le Greco** à Tolède. Vers la fin, il intervient en France contre **Henri IV** au profit de la Ligue, et doit y renoncer par la paix de **Vervins**, en mai 1598. Il meurt quatre mois plus tard, le **13 septembre 1598**, à l’Escurial, après cinquante-trois jours d’agonie supportés sans une plainte, dans la chambre qui donne sur l’autel.',
      },
    ],
    chrono: [
      { date: '21 mai 1527', fait: 'Naissance à Valladolid, fils de Charles Quint.' },
      { date: '1556', fait: 'Il reçoit l’Espagne, les Pays-Bas, l’Italie et l’Amérique.' },
      { date: '1561', fait: 'Madrid devient la capitale de la monarchie.' },
      { date: '1563', fait: 'Début du chantier de l’Escurial.' },
      { date: '1566', fait: 'Vague iconoclaste aux Pays-Bas ; le duc d’Albe est envoyé.' },
      { date: '7 octobre 1571', fait: 'Victoire navale de Lépante sur les Ottomans.' },
      { date: '1579-1581', fait: 'Union d’Utrecht : les provinces du Nord déposent le roi.' },
      { date: '1580', fait: 'Il devient roi de Portugal : les deux empires sont réunis.' },
      { date: '1588', fait: 'Destruction de l’Invincible Armada.' },
      { date: 'mai 1598', fait: 'Paix de Vervins avec Henri IV.' },
      { date: '13 septembre 1598', fait: 'Mort à l’Escurial.' },
    ],
    leSaisTu:
      'Un soldat de vingt-quatre ans reçut trois coups d’arquebuse à Lépante et y perdit l’usage de la main gauche : il s’appelait Cervantès, et écrivit plus tard Don Quichotte. Il disait n’avoir aucun regret, cette main ayant été perdue « à la plus haute occasion qu’aient vue les siècles ».',
    aRetenir: [
      'Philippe II, fils de Charles Quint, règne sur l’Espagne et son empire de 1556 à 1598.',
      'Il gouverne par écrit depuis l’Escurial, qu’il fait bâtir de 1563 à 1584.',
      'La Sainte Ligue qu’il soutient bat la flotte ottomane à Lépante le 7 octobre 1571.',
      'La révolte des Pays-Bas donne naissance aux Provinces-Unies, indépendantes de fait.',
      'L’Invincible Armada envoyée contre l’Angleterre est détruite en 1588.',
    ],
    mots: [
      {
        mot: 'Banqueroute',
        sens: 'Faillite d’un État qui suspend le paiement de ses dettes ; l’Espagne en connaît trois sous Philippe II.',
      },
      {
        mot: 'Armada',
        sens: 'Mot espagnol pour « flotte de guerre » ; l’Armada de 1588 devait débarquer en Angleterre.',
      },
      {
        mot: 'Iconoclasme',
        sens: 'Destruction des images et des statues religieuses, au nom d’une foi qui les juge idolâtres.',
      },
      {
        mot: 'Provinces-Unies',
        sens: 'État né en 1581 de la révolte des provinces du nord des Pays-Bas contre le roi d’Espagne.',
      },
    ],
    lies: [
      'charles-quint',
      'soliman-le-magnifique',
      'henri-iv',
      'shakespeare',
      'hernan-cortes',
    ],
    niveaux: ['5e', '2de'],
    programme: 'Le monde au temps de Charles Quint et de Soliman le Magnifique',
    tags: [
      'Escurial',
      'Armada',
      'Lépante',
      'Pays-Bas',
      'Habsbourg',
      'Espagne',
      'Madrid',
      'Potosí',
      'Élisabeth Ire',
      'Guillaume d’Orange',
      'Siècle d’or',
      'Vervins',
    ],
  },
  {
    id: 'shakespeare',
    volet: 'personnages',
    nom: 'William Shakespeare',
    surnom: 'le barde d’Avon',
    dates: '1564 – 1616',
    tri: 1616,
    periode: 'temps-modernes',
    emoji: '🪶',
    roles: ['Auteur de théâtre', 'Comédien', 'Poète'],
    origine: 'Stratford-upon-Avon, Angleterre',
    accroche:
      'Trente-sept pièces écrites pour un théâtre de bois au bord de la Tamise — et, quatre siècles plus tard, on les joue encore chaque soir quelque part.',
    citations: [
      {
        texte: 'To be, or not to be, that is the question.',
        contexte:
          '*Hamlet*, acte III, scène 1, vers 1601 : le prince, seul, se demande s’il faut vivre ou en finir.',
        sens:
          '« Être ou ne pas être, telle est la question. » C’est la réplique la plus citée du théâtre mondial, et tout le monologue tient dans ces six mots.',
      },
      {
        texte: 'All the world’s a stage, and all the men and women merely players.',
        contexte: '*Comme il vous plaira*, acte II, scène 7, vers 1599.',
        sens:
          '« Le monde entier est un théâtre, et tous, hommes et femmes, n’en sont que les acteurs. » La devise du Globe disait à peu près la même chose en latin.',
      },
      {
        texte:
          'What’s in a name? That which we call a rose by any other name would smell as sweet.',
        contexte: '*Roméo et Juliette*, acte II, scène 2, la scène du balcon, vers 1595.',
        sens:
          '« Qu’y a-t-il dans un nom ? Ce que nous appelons une rose embaumerait autant sous un autre nom. » Le nom de Montaigu ne change rien à celui que Juliette aime.',
      },
      {
        texte:
          'Life’s but a walking shadow… a tale told by an idiot, full of sound and fury, signifying nothing.',
        contexte: '*Macbeth*, acte V, scène 5, vers 1606. Macbeth vient d’apprendre la mort de sa femme.',
        sens:
          '« La vie n’est qu’une ombre qui marche… un récit conté par un idiot, plein de bruit et de fureur, et qui ne signifie rien. » Faulkner y a pris un titre de roman.',
      },
    ],
    reperes: [
      'Fils d’un gantier de Stratford-upon-Avon ; il quitte l’école vers 15 ans et n’ira pas à l’université.',
      'Marié à 18 ans à Anne Hathaway ; trois enfants, dont Hamnet, mort à 11 ans.',
      'Comédien et associé de la troupe des *Lord Chamberlain’s Men*, protégée par Élisabeth Ire puis par Jacques Ier.',
      'Le théâtre du Globe, bâti en 1599 au bord de la Tamise, tient près de 3 000 spectateurs.',
      'Trente-sept pièces et 154 sonnets, écrits en une vingtaine d’années.',
      'Mort le 23 avril 1616 ; le *Premier Folio* sauve ses pièces de l’oubli en 1623.',
    ],
    recit: [
      {
        titre: 'Un fils de gantier',
        texte:
          'William Shakespeare est baptisé à **Stratford-upon-Avon** le 26 avril **1564** ; son père, gantier et marchand de laine, est un temps bailli de la petite ville. L’enfant fréquente l’école latine locale — Ovide, la rhétorique, le théâtre de Sénèque — mais s’arrête là : pas d’Oxford, pas de Cambridge, contrairement aux auteurs à la mode de Londres, qui le lui feront sentir. À dix-huit ans, il épouse **Anne Hathaway**, de huit ans son aînée et déjà enceinte ; ils auront trois enfants. Puis, entre 1585 et 1592, on perd sa trace : ce sont les « années perdues », sur lesquelles on n’a que des hypothèses. Il réapparaît à Londres en 1592, assez connu pour qu’un rival, Robert Greene, le traite de « corbeau parvenu, paré de nos plumes ».',
      },
      {
        titre: 'Le Globe',
        texte:
          'Le théâtre élisabéthain est un commerce. Shakespeare n’est pas seulement auteur : il est **comédien** et **actionnaire** de sa troupe, les *Lord Chamberlain’s Men*, ce qui le rendra riche. En décembre 1598, la troupe, en conflit avec le propriétaire de son terrain, démonte son théâtre poutre par poutre pendant la nuit, traverse la Tamise et le remonte sur l’autre rive : ce sera le **Globe**, ouvert en 1599. C’est un anneau de bois ouvert sur le ciel ; on joue l’après-midi, à la lumière du jour ; pour un penny, le peuple reste **debout** dans la fosse, les riches s’assoient dans les galeries. Presque pas de décor : le lieu et l’heure sont dits par le texte. Les rôles de femmes sont tenus par de jeunes garçons. Le 29 juin 1613, un canon tiré pendant *Henri VIII* met le feu au toit de chaume et le Globe brûle en une heure.',
      },
      {
        titre: 'Comédies, histoires, tragédies',
        texte:
          'Il écrit dans tous les genres et pour tous les publics. Des **comédies** (*Le Songe d’une nuit d’été*, *Beaucoup de bruit pour rien*, *La Nuit des rois*), des **pièces historiques** qui racontent aux Anglais leurs propres rois (*Richard III*, *Henri V*), et les grandes **tragédies** : *Roméo et Juliette* vers 1595, *Jules César*, *Hamlet* vers 1601, *Othello*, *Le Roi Lear*, *Macbeth* en 1606. Il n’invente presque aucune de ses intrigues : il les prend chez les chroniqueurs anglais, chez **Plutarque** pour les Romains, dans les nouvelles italiennes — et, pour *La Tempête*, dans les *Essais* de **Montaigne**, qu’il lit dans la traduction anglaise de John Florio parue en 1603. Son génie n’est pas dans l’histoire racontée : il est dans ce que les personnages disent d’eux-mêmes.',
      },
      {
        titre: 'Une langue qui s’invente',
        texte:
          'Il écrit le plus souvent en **vers blancs** — des vers de dix syllabes qui ne riment pas et suivent le rythme de la parole —, en passant à la prose pour les scènes populaires ou comiques. Son vocabulaire est immense, et des centaines de mots et d’expressions apparaissent pour la première fois par écrit chez lui : on lui a longtemps attribué la création de près de deux mille mots, chiffre que les dictionnaires modernes revoient à la baisse, faute de savoir ce qui se disait déjà dans la rue. Reste que l’anglais courant parle encore par ses phrases, comme le français parle par Molière. Il écrit aussi **154 sonnets**, publiés en 1609, dont on discute encore les destinataires.',
      },
      {
        titre: 'Le Premier Folio, 1623',
        texte:
          'Riche, propriétaire de la deuxième maison de Stratford et d’une part du Globe, il cesse d’écrire vers 1613 et meurt le **23 avril 1616**, à cinquante-deux ans. À sa mort, **dix-huit** de ses pièces n’avaient jamais été imprimées : *Macbeth*, *La Tempête*, *Jules César*, *La Nuit des rois* vivaient seulement dans les cahiers de la troupe. Sept ans plus tard, deux de ses camarades comédiens, **John Heminges et Henry Condell**, réunissent trente-six pièces en un gros volume, le **Premier Folio** de 1623 : sans eux, la moitié de l’œuvre aurait disparu. Son rival et ami **Ben Jonson** y écrit la phrase qui a fait le tour du monde : « Il n’était pas d’un temps, mais de tous les temps. »',
      },
    ],
    chrono: [
      { date: '26 avril 1564', fait: 'Baptême à Stratford-upon-Avon.' },
      { date: '1582', fait: 'Mariage avec Anne Hathaway, à 18 ans.' },
      { date: '1592', fait: 'Première mention de lui comme auteur à Londres.' },
      { date: 'vers 1595', fait: '*Roméo et Juliette*.' },
      { date: '1599', fait: 'Ouverture du théâtre du Globe, au bord de la Tamise.' },
      { date: 'vers 1601', fait: '*Hamlet*.' },
      { date: '1603', fait: 'La troupe devient celle du roi Jacques Ier.' },
      { date: '1606', fait: '*Macbeth*.' },
      { date: '29 juin 1613', fait: 'Le Globe brûle pendant une représentation.' },
      { date: '23 avril 1616', fait: 'Mort à Stratford, à 52 ans.' },
      { date: '1623', fait: 'Le Premier Folio réunit trente-six pièces.' },
    ],
    leSaisTu:
      'Sa tombe, à Stratford, porte une malédiction qu’il aurait dictée : « Béni soit celui qui épargne ces pierres, et maudit celui qui déplacera mes os. » On la prend encore au sérieux : la dalle n’a jamais été soulevée, et une étude de 2016 a dû se contenter d’un radar pour regarder dessous.',
    aRetenir: [
      'William Shakespeare (1564-1616) est auteur, comédien et associé d’une troupe de Londres.',
      'Il écrit trente-sept pièces et 154 sonnets, joués au théâtre du Globe à partir de 1599.',
      '*Roméo et Juliette*, *Hamlet* et *Macbeth* comptent parmi les pièces les plus jouées au monde.',
      'Il emprunte ses intrigues aux chroniques, à Plutarque et aux *Essais* de Montaigne.',
      'Le Premier Folio de 1623, publié par deux de ses camarades, sauve la moitié de son œuvre.',
    ],
    mots: [
      {
        mot: 'Tragédie',
        sens: 'Pièce de théâtre où un personnage est conduit au malheur par son destin ou par ses propres fautes.',
      },
      {
        mot: 'Folio',
        sens: 'Livre de grand format, fait de feuilles pliées une seule fois ; celui de 1623 réunit les pièces de Shakespeare.',
      },
      {
        mot: 'Vers blanc',
        sens: 'Vers régulier mais sans rime, forme habituelle du théâtre élisabéthain.',
      },
    ],
    lies: ['montaigne', 'philippe-ii-d-espagne', 'moliere', 'invention-de-l-imprimerie'],
    niveaux: ['5e', '2de'],
    programme: 'Humanisme, Réformes et conflits religieux',
    tags: [
      'Hamlet',
      'Roméo et Juliette',
      'Macbeth',
      'Globe',
      'Stratford',
      'théâtre',
      'Élisabeth Ire',
      'Angleterre',
      'sonnets',
      'Premier Folio',
      'barde',
    ],
  },
]
