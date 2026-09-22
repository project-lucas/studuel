// -----------------------------------------------------------------------------
// TEMPS MODERNES — LA FRANCE. Huit journées qui font passer le royaume de la
// Renaissance aux Lumières : une victoire d'Italie, une nuit de massacre, un
// édit de paix civile, une révolte des grands, un palais-gouvernement, la
// révocation de cet édit, un dictionnaire qui range tout le savoir, et une
// guerre gagnée au bout du monde.
//
// TON (docs/encyclopedie.md, § 3) : les rois de France et les figures
// chrétiennes sont racontés avec respect et DANS LEUR TEMPS. La
// Saint-Barthélemy est dite avec gravité et sans instrumentalisation ; l'édit
// de Nantes pour ce qu'il est — le premier grand texte de coexistence
// religieuse d'Europe ; sa révocation avec ses conséquences réelles, mais sans
// procès rétrospectif ni ironie : c'est Vauban, serviteur de Louis XIV, qui
// tient ici le rôle du contradicteur, parce qu'il l'a tenu pour de vrai.
//
// La fiche `guerre-d-independance-americaine` raconte LA GUERRE — les
// opérations, Yorktown, les traités. Le côté finances (le milliard de livres,
// la dette qui mange la moitié du budget) est déjà dans
// `crise-financiere-de-la-monarchie` : elle y renvoie au lieu de le refaire.
// -----------------------------------------------------------------------------

import type { Evenement } from '../types'

export const EVENEMENTS_TEMPS_MODERNES_FRANCE: Evenement[] = [
  {
    id: 'bataille-de-marignan',
    volet: 'evenements',
    nom: 'La bataille de Marignan',
    date: '13-14 septembre 1515',
    tri: 1515,
    periode: 'temps-modernes',
    emoji: '⚔️',
    lieu: 'Marignan, au sud-est de Milan',
    accroche:
      'À vingt et un ans, François Ier passe les Alpes avec son artillerie et bat en deux jours les Suisses réputés invincibles.',
    citations: [
      {
        texte: 'Depuis deux mille ans il n’y a point eu bataille si fière et si cruelle.',
        qui: 'François Ier',
        contexte:
          'Dans la lettre qu’il écrit à sa mère Louise de Savoie au lendemain de la bataille, le 14 septembre 1515.',
      },
      {
        texte:
          'Ce fut une bataille de géants ; les dix-huit autres où je me suis trouvé n’étaient auprès que jeux d’enfants.',
        qui: 'Le maréchal Trivulce',
        contexte:
          'Le vieux condottiere au service du roi de France, qui avait fait toutes les guerres d’Italie, au soir du 14 septembre 1515.',
      },
      {
        texte: 'Bayard, mon ami, je veux aujourd’hui être fait chevalier par vos mains.',
        qui: 'François Ier au chevalier Bayard',
        contexte:
          'Sur le champ de bataille, selon le récit du *Loyal Serviteur*, biographe de Bayard écrivant dix ans plus tard.',
        sens:
          'Un roi sacré à Reims n’avait pas besoin d’être adoubé : la scène est d’abord une mise en scène, et rien ne prouve qu’elle ait eu lieu.',
        incertaine: true,
      },
    ],
    reperes: [
      'François Ier est roi depuis le 1er janvier 1515 ; il a vingt et un ans depuis la veille de la bataille.',
      'Il fait passer les Alpes à son armée et à soixante-douze canons par un col que personne ne surveillait.',
      'Les Suisses, meilleurs fantassins d’Europe, attaquent le 13 au soir et se battent encore le 14 au matin.',
      'L’arrivée des alliés vénitiens d’Alviano emporte la décision ; les Suisses laissent environ dix mille hommes.',
      'La victoire donne Milan au roi, la paix perpétuelle avec les cantons suisses et le concordat de Bologne.',
    ],
    causes: [
      'Les guerres d’Italie, commencées en 1494 : les rois de France revendiquent le duché de Milan par héritage des Visconti.',
      'La défaite française de Novare en 1513, qui avait chassé Louis XII d’Italie et qu’il faut effacer.',
      'Un roi de vingt et un ans qui monte sur le trône et veut une victoire qui le fasse connaître de toute l’Europe.',
      'La richesse de Milan, la ville la plus peuplée d’Italie du Nord, et le prestige d’être le maître de la péninsule.',
      'Les cantons suisses, qui louent leurs régiments au plus offrant et tiennent alors le Milanais pour leur protégé.',
      'Le passage inattendu par le col de l’Argentière, qui met l’armée française derrière les cols que les Suisses gardaient.',
    ],
    recit: [
      {
        titre: 'Faire passer des canons par la montagne',
        texte:
          'En août **1515**, l’armée royale — près de **trente mille hommes** — se présente devant les Alpes. Les Suisses tiennent les cols connus, le mont Genèvre et le mont Cenis, et attendent là. François Ier fait ouvrir un autre chemin : le **col de l’Argentière**, un passage de muletiers où il faut tailler la roche, jeter des ponts sur les torrents et démonter les affûts. Les pionniers du maréchal **Trivulce** y font passer **soixante-douze canons** de bronze, pièce par pièce. Quand l’armée débouche dans la plaine du Pô, les Suisses sont tournés : ils n’ont plus de position à défendre. Cette artillerie, la meilleure d’Europe, sera l’arme de la bataille — elle est arrivée là par un sentier de chèvres.',
      },
      {
        titre: 'Deux jours, presque sans nuit',
        texte:
          'Le **13 septembre** en fin d’après-midi, les Suisses sortent de Milan et se jettent sur le camp français à **Marignan**, à seize kilomètres de la ville. Ils marchent en **carrés de piquiers**, serrés, tambour battant : la formation qui n’a pas perdu une bataille depuis cinquante ans. Les canons français tirent à bout portant dans la masse, la gendarmerie charge, les rangs se referment. On se bat jusque vers minuit, à la lueur de la lune, puis les deux armées s’arrêtent où elles sont, à quelques pas les unes des autres, sans pouvoir se séparer. Le roi passe la nuit assis sur l’affût d’un canon. Au petit jour du **14 septembre**, tout recommence. Vers midi, la cavalerie vénitienne de **Bartolomeo d’Alviano**, alliée de la France, arrive sur le flanc suisse en criant « Marco ! Marco ! ». Les carrés se retirent en ordre vers Milan, laissant **environ dix mille morts** sur le terrain. Les Français en comptent près de six mille.',
      },
      {
        titre: 'Ce qu’une victoire achète',
        texte:
          'Milan se rend le **4 octobre**. Mais l’essentiel se signe après. Le **29 novembre 1516**, à Fribourg, la France et les cantons suisses concluent une **paix perpétuelle** : elle ne sera jamais rompue, elle fonde le service des Suisses auprès des rois de France et, de loin, la **neutralité suisse**. Le **18 août 1516**, le concordat de Bologne, négocié avec le pape **Léon X**, donne au roi le droit de **nommer les évêques et les abbés** du royaume : l’Église de France passe pour trois siècles sous la main du souverain. Et le roi ramène d’Italie autre chose que des provinces : des artistes, des livres, des manières. **Léonard de Vinci** accepte son invitation et s’installe en 1516 au **Clos Lucé**, près d’Amboise. Marignan n’est pas seulement une victoire : c’est la porte par laquelle la Renaissance italienne entre en France.',
      },
    ],
    consequences: [
      'Le duché de Milan revient au roi de France, qui y entre le 4 octobre 1515.',
      'Paix perpétuelle de Fribourg (1516) avec les cantons suisses : elle ne sera jamais dénoncée.',
      'Concordat de Bologne (1516) : le roi nomme désormais les évêques et les abbés du royaume.',
      'François Ier devient le roi-chevalier de la légende française, et « 1515 » la date que tout élève retient.',
      'La Renaissance italienne passe en France : artistes, architectes, et Léonard de Vinci au Clos Lucé dès 1516.',
      'Dix ans plus tard, la revanche impériale à Pavie (1525) montrera la fragilité de cette conquête.',
    ],
    chiffres: [
      { valeur: '72', quoi: 'canons passés par le col de l’Argentière' },
      { valeur: '10 000', quoi: 'morts environ dans les rangs suisses' },
      { valeur: '21 ans', quoi: 'l’âge de François Ier au soir de sa victoire' },
      { valeur: '28 heures', quoi: 'de combat, la nuit comprise' },
    ],
    chrono: [
      { date: '1er janvier 1515', fait: 'François Ier devient roi de France.' },
      { date: 'août 1515', fait: 'Passage des Alpes par le col de l’Argentière.' },
      { date: '13 septembre 1515', fait: 'Les Suisses attaquent le camp français au soir.' },
      { date: '14 septembre 1515', fait: 'Les Vénitiens arrivent ; les Suisses décrochent.' },
      { date: '4 octobre 1515', fait: 'Entrée de François Ier dans Milan.' },
      { date: '18 août 1516', fait: 'Concordat de Bologne avec le pape Léon X.' },
      { date: '29 novembre 1516', fait: 'Paix perpétuelle de Fribourg avec les Suisses.' },
      { date: '1516', fait: 'Léonard de Vinci s’installe au Clos Lucé.' },
    ],
    leSaisTu:
      'Léonard de Vinci a franchi les Alpes à dos de mulet, à soixante-quatre ans, avec trois tableaux dans ses bagages. L’un d’eux était *La Joconde*. C’est pour cela qu’elle est au Louvre et non à Florence : elle est arrivée en France dans les fontes d’un vieux peintre invité par le vainqueur de Marignan.',
    aRetenir: [
      'Le 13 et le 14 septembre 1515, François Ier bat les Suisses à Marignan, près de Milan.',
      'La victoire tient à l’artillerie française, passée par le col de l’Argentière, et à l’arrivée des alliés vénitiens.',
      'Elle donne au roi le duché de Milan, la paix perpétuelle avec les Suisses (1516) et le concordat de Bologne (1516).',
      'Par le concordat, le roi de France nomme lui-même les évêques et les abbés du royaume.',
      'Marignan ouvre la France à la Renaissance italienne : Léonard de Vinci s’installe au Clos Lucé en 1516.',
    ],
    mots: [
      {
        mot: 'Carré de piquiers',
        sens: 'Bloc serré de fantassins armés de piques de six mètres : la formation qui avait fait la réputation des Suisses.',
      },
      {
        mot: 'Concordat',
        sens: 'Accord signé entre un pape et un souverain pour régler la vie de l’Église dans son État.',
      },
      {
        mot: 'Condottiere',
        sens: 'Chef de guerre italien qui loue son armée au prince qui le paie.',
      },
    ],
    lies: ['francois-ier', 'leonard-de-vinci', 'massacre-de-la-saint-barthelemy'],
    niveaux: ['5e'],
    programme: 'Du Prince de la Renaissance au roi absolu',
    tags: [
      'Marignan',
      '1515',
      'François Ier',
      'Suisses',
      'guerres d’Italie',
      'Milan',
      'Bayard',
      'concordat de Bologne',
      'Renaissance',
      'artillerie',
    ],
  },
  {
    id: 'massacre-de-la-saint-barthelemy',
    volet: 'evenements',
    nom: 'Le massacre de la Saint-Barthélemy',
    date: '24 août 1572',
    tri: 1572,
    periode: 'temps-modernes',
    emoji: '🕯️',
    lieu: 'Paris, puis une douzaine de villes du royaume',
    accroche:
      'Six jours après un mariage censé réconcilier les deux religions, Paris massacre ses protestants : deux à trois mille morts en un jour.',
    citations: [
      {
        texte: 'Vous avez la blessure, et moi la douleur.',
        qui: 'Charles IX à l’amiral de Coligny',
        contexte:
          'Au chevet de l’amiral, blessé d’un coup d’arquebuse le 22 août 1572. Deux jours plus tard, Coligny était assassiné.',
      },
      {
        texte:
          'Jeune homme, tu devrais respecter mon âge et ma faiblesse ; mais tu n’abrégeras pas ma vie de beaucoup.',
        qui: 'Gaspard de Coligny',
        contexte:
          'À l’homme d’armes qui entre dans sa chambre de la rue de Béthisy, à l’aube du 24 août 1572.',
        sens:
          'Rapportée par les mémorialistes protestants, qui écrivent après coup : la phrase est belle, elle n’est pas prouvée.',
        incertaine: true,
      },
      {
        texte: 'Ce qui s’est fait l’a été par mon commandement.',
        qui: 'Charles IX',
        contexte:
          'Devant le Parlement de Paris, le 26 août 1572 : le roi prend publiquement la responsabilité du massacre.',
        sens:
          'Il affirme avoir devancé un complot protestant. Aucun historien ne retrouve ce complot ; la couronne, elle, ne pouvait pas dire qu’elle avait perdu le contrôle de sa capitale.',
      },
    ],
    reperes: [
      'Depuis 1562, catholiques et protestants se font la guerre dans le royaume : trois guerres déjà, refermées par des paix fragiles.',
      'Le 18 août 1572, Marguerite de Valois, sœur du roi, épouse Henri de Navarre, protestant : le mariage de la réconciliation.',
      'Le 22 août, un tireur manque l’amiral de Coligny, chef du parti protestant et conseiller écouté de Charles IX.',
      'Dans la nuit du 23 au 24, le conseil royal décide d’abattre les chefs huguenots réunis à Paris pour les noces.',
      'Le massacre échappe aux ordres : la milice et la foule tuent dans les rues jusqu’au 29 août, puis en province jusqu’en octobre.',
    ],
    causes: [
      'Dix ans de guerres civiles ouvertes depuis le massacre de Wassy (1562), et des haines de famille que les paix n’éteignent pas.',
      'Une idée admise partout en Europe : un royaume ne peut tenir qu’avec une seule foi — la coexistence paraît impossible à tous les camps.',
      'La place prise par l’amiral de Coligny auprès du jeune Charles IX et son projet de guerre aux Pays-Bas contre l’Espagne, que la reine mère et le conseil refusent.',
      'La vendetta entre les Guise et Coligny, que la famille accuse de l’assassinat de François de Guise en 1563.',
      'Le mariage du 18 août, qui rassemble à Paris des milliers de nobles protestants dans une ville catholique, chère et à cran.',
      'L’attentat manqué du 22 août : la crainte d’une riposte armée des huguenots pousse le conseil à frapper le premier.',
      'Une milice bourgeoise parisienne armée, encadrée par quartier, et qui connaît les maisons où logent les protestants.',
    ],
    recit: [
      {
        titre: 'Un mariage pour refermer dix ans de guerre',
        texte:
          'La paix de **Saint-Germain**, signée le 8 août 1570, avait mis fin à la troisième guerre de religion et rendu aux protestants quatre places fortes. Pour la sceller, **Catherine de Médicis** marie sa fille **Marguerite de Valois**, catholique, à **Henri de Navarre**, protestant : c’est le **18 août 1572**, devant Notre-Dame, le marié restant sur le parvis pendant la messe. Des milliers de gentilshommes huguenots sont venus à Paris pour les noces. La ville ne les voit pas d’un bon œil : le pain est cher, la population est catholique et la prédication y est dure. Au Louvre, l’**amiral de Coligny**, chef du parti réformé, a l’oreille du roi, qui l’appelle « mon père ». Il veut entraîner la France dans une guerre aux Pays-Bas contre l’Espagne — une guerre étrangère pour faire oublier la guerre civile. Catherine de Médicis et le conseil s’y opposent de toutes leurs forces.',
      },
      {
        titre: 'Le coup manqué du 22 août',
        texte:
          'Le **22 août**, en rentrant du Louvre, Coligny est atteint de deux balles tirées d’une fenêtre : il perd un doigt et a le bras fracassé. Le tireur s’échappe ; la maison appartient à un client des **Guise**. Les gentilshommes protestants s’assemblent et parlent de justice, ou de vengeance. Le roi vient au chevet du blessé, promet une enquête, fait garder la rue. Mais la cour a peur : cinq à six cents nobles huguenots sont dans Paris, armés, et le royaume tient à un fil. Dans la nuit du **23 au 24 août**, le conseil réuni au Louvre décide d’abattre les chefs protestants — une opération limitée, une liste de noms. On réveille le prévôt des marchands, on ferme les portes de la ville, on fait sonner le tocsin à **Saint-Germain-l’Auxerrois**.',
      },
      {
        titre: 'Le jour de la Saint-Barthélemy',
        texte:
          'À l’aube du **24 août**, jour de la fête de l’apôtre **Barthélemy**, les hommes du duc de Guise forcent la porte de Coligny. L’amiral est tué dans sa chambre, son corps jeté par la fenêtre, traîné dans les rues, pendu au gibet de Montfaucon. Ailleurs, les gentilshommes logés au Louvre sont tués dans la cour. Et puis l’opération échappe à ceux qui l’ont décidée : la **milice bourgeoise**, marquée d’un brassard blanc, va de maison en maison ; des voisins tuent des voisins ; on jette les corps à la Seine. Les massacres durent jusqu’au 29 août dans Paris, puis gagnent **Orléans, Lyon, Rouen, Bordeaux, Toulouse, Meaux, Bourges** jusqu’en octobre. On compte **deux à trois mille morts à Paris**, sans doute **dix mille dans le royaume**. Henri de Navarre et le prince de Condé, princes du sang, ont la vie sauve contre une abjuration forcée. Le 26 août, devant le Parlement, Charles IX déclare que tout s’est fait par son ordre, pour prévenir un complot.',
      },
      {
        titre: 'Ce que ce jour a laissé',
        texte:
          'Le parti protestant perd ses chefs et ne perd pas la guerre : elle reprend aussitôt, plus dure, avec le siège de **La Rochelle** en 1573. Une partie des réformés quitte le royaume pour Genève, l’Angleterre, les Provinces-Unies. Chez ceux qui restent naît une pensée nouvelle : si un roi peut ordonner cela, l’obéissance au roi n’est pas sans limite — ce sont les **monarchomaques**, les premiers à écrire, en France, que le pouvoir se doit à ses sujets. Chez les catholiques, un courant se détache, celui des **politiques** : ils jugent que l’État doit passer avant l’unité de foi, parce qu’un royaume mort de ses guerres ne sauve personne. De ce courant sortira, vingt-six ans plus tard, l’**édit de Nantes**. La Saint-Barthélemy reste une date de deuil national dans l’histoire de France : ni une bataille, ni une émeute — un massacre décidé en haut et continué en bas.',
      },
    ],
    consequences: [
      'Le parti protestant perd l’amiral de Coligny et la plupart de ses chefs ; Henri de Navarre abjure sous la contrainte.',
      'La quatrième guerre de religion s’ouvre aussitôt : siège de La Rochelle en 1573.',
      'Des milliers de réformés quittent le royaume pour Genève, l’Angleterre et les Provinces-Unies.',
      'Des théoriciens protestants, les monarchomaques, écrivent que l’obéissance au roi a des limites.',
      'Le parti catholique modéré des « politiques » se forme : l’État doit primer l’unité de religion.',
      'Vingt-six ans plus tard, l’édit de Nantes tire la leçon de l’échec de la solution par la force.',
    ],
    chiffres: [
      { valeur: '2 000 à 3 000', quoi: 'morts à Paris' },
      { valeur: '10 000', quoi: 'morts environ dans tout le royaume' },
      { valeur: '6 jours', quoi: 'entre le mariage royal et le massacre' },
      { valeur: '12', quoi: 'villes de province touchées jusqu’en octobre' },
    ],
    chrono: [
      { date: '1er mars 1562', fait: 'Massacre de Wassy : les guerres de religion commencent.' },
      { date: '8 août 1570', fait: 'Paix de Saint-Germain, fin de la troisième guerre.' },
      { date: '18 août 1572', fait: 'Mariage de Marguerite de Valois et d’Henri de Navarre.' },
      { date: '22 août 1572', fait: 'Coligny blessé par un tireur embusqué.' },
      { date: 'nuit du 23 au 24 août', fait: 'Le conseil royal décide d’abattre les chefs huguenots.' },
      { date: '24 août 1572', fait: 'Coligny tué à l’aube ; le massacre gagne la ville.' },
      { date: '26 août 1572', fait: 'Charles IX assume le massacre devant le Parlement.' },
      { date: 'septembre-octobre 1572', fait: 'Massacres en province, d’Orléans à Bordeaux.' },
      { date: '30 mai 1574', fait: 'Mort de Charles IX, à vingt-trois ans.' },
    ],
    leSaisTu:
      'Le peintre protestant François Dubois a survécu et peint la scène vers 1576. Son tableau, conservé à Lausanne, est le seul témoignage figuré contemporain : on y reconnaît la rue de Béthisy, le corps de Coligny à la fenêtre et le gibet de Montfaucon, tous rassemblés dans une même image — un plan de la journée plutôt qu’un instant.',
    aRetenir: [
      'Le 24 août 1572, jour de la Saint-Barthélemy, les protestants réunis à Paris pour un mariage royal sont massacrés.',
      'L’amiral de Coligny, chef du parti protestant, est tué à l’aube ; le massacre gagne ensuite une douzaine de villes.',
      'On compte deux à trois mille morts à Paris et environ dix mille dans le royaume.',
      'Le 26 août, Charles IX déclare devant le Parlement que le massacre s’est fait par son commandement.',
      'La guerre reprend aussitôt : c’est l’échec de la solution par la force, dont l’édit de Nantes (1598) tirera la leçon.',
    ],
    mots: [
      {
        mot: 'Huguenot',
        sens: 'Nom donné en France aux protestants réformés, disciples de Calvin.',
      },
      {
        mot: 'Amiral de France',
        sens: 'Grand officier de la couronne, chef des flottes du roi : la charge de Coligny.',
      },
      {
        mot: 'Milice bourgeoise',
        sens: 'Habitants d’une ville armés et encadrés par quartier pour en assurer la garde.',
      },
      {
        mot: 'Politiques',
        sens: 'Catholiques modérés pour qui la survie de l’État passe avant l’unité de religion.',
      },
    ],
    lies: [
      'catherine-de-medicis',
      'henri-iv',
      'edit-de-nantes',
      'reforme-protestante',
      'jean-calvin',
    ],
    niveaux: ['5e'],
    programme: 'Humanisme, réformes et conflits religieux',
    tags: [
      'Saint-Barthélemy',
      '1572',
      'Coligny',
      'Charles IX',
      'Catherine de Médicis',
      'huguenots',
      'guerres de religion',
      'Paris',
      'Guise',
      'protestants',
    ],
  },
  {
    id: 'edit-de-nantes',
    volet: 'evenements',
    nom: 'L’édit de Nantes',
    date: '13 avril 1598',
    tri: 1598,
    periode: 'temps-modernes',
    emoji: '🕊️',
    lieu: 'Nantes',
    accroche:
      'Après trente-six ans de guerres civiles, Henri IV fait tenir deux religions dans un même royaume : le premier grand texte de coexistence d’Europe.',
    citations: [
      {
        texte:
          'Que la mémoire de toutes choses passées d’une part et d’autre demeurera éteinte et assoupie, comme de chose non advenue.',
        qui: 'L’édit de Nantes, article premier',
        contexte: 'Premier article du texte signé par Henri IV à Nantes, le 13 avril 1598.',
        sens:
          'Personne ne sera poursuivi pour ce qu’il a fait pendant les guerres. La paix commence par effacer les comptes.',
      },
      {
        texte: 'Pour ne laisser aucune occasion de troubles et différends entre nos sujets.',
        qui: 'Le préambule de l’édit de Nantes',
        contexte:
          'Henri IV y explique pourquoi il donne « une loi générale, claire, nette et absolue » sur la religion.',
        sens:
          'Le but n’est pas la tolérance au sens d’aujourd’hui : c’est la paix civile, et elle passe par des règles écrites une fois pour toutes.',
      },
      {
        texte: 'Je suis roi maintenant, et parle en roi. Je veux être obéi.',
        qui: 'Henri IV',
        contexte:
          'Aux magistrats du Parlement de Paris, le 7 janvier 1599, qui refusaient d’enregistrer l’édit depuis neuf mois.',
      },
      {
        texte: 'Paris vaut bien une messe.',
        qui: 'Attribué à Henri IV',
        contexte:
          'Phrase prêtée au roi lors de son abjuration à Saint-Denis, le 25 juillet 1593. On ne la trouve écrite qu’en 1622, dans un recueil satirique.',
        sens:
          'Il n’a jamais dit cela. Mais l’abjuration, elle, est bien réelle : sans elle, aucun roi protestant n’aurait pu entrer dans Paris.',
        incertaine: true,
      },
    ],
    reperes: [
      'Depuis 1562, huit guerres de religion ont ravagé le royaume : trente-six ans de guerre civile.',
      'Henri de Navarre, protestant, devient roi en 1589, abjure en 1593 et entre dans Paris en 1594.',
      'L’édit compte 92 articles publics, 56 articles particuliers et deux brevets signés du roi.',
      'Il accorde la liberté de conscience partout, le culte dans des lieux définis, et l’égalité civile.',
      'Il laisse aux protestants environ 150 places de sûreté, gardées aux frais du roi.',
      'Les parlements refusent de l’enregistrer ; celui de Paris cède le 25 février 1599.',
    ],
    causes: [
      'Trente-six ans de guerres civiles (1562-1598) : villages brûlés, récoltes perdues, une population épuisée des deux côtés.',
      'L’échec de la solution par la force : ni la Saint-Barthélemy ni les batailles n’ont fait disparaître la minorité réformée.',
      'Un roi protestant devenu roi de France en 1589, puis catholique en 1593 : le seul homme que les deux camps puissent croire.',
      'La guerre contre l’Espagne, qui soutenait la Ligue catholique : il faut la paix au-dedans pour tenir au-dehors.',
      'Le courant des « politiques », qui soutient depuis 1572 que l’État doit passer avant l’unité de foi.',
      'Une série d’édits de pacification depuis 1562, tous violés : il faut cette fois un texte complet, détaillé et garanti.',
    ],
    recit: [
      {
        titre: 'Un royaume qui n’en peut plus',
        texte:
          'Entre **1562 et 1598**, la France a connu **huit guerres de religion**. Elles ont tout traversé : des massacres comme la **Saint-Barthélemy**, l’assassinat d’un duc de Guise et de deux rois, une Ligue catholique alliée à l’Espagne, un siège de Paris où l’on a mangé des chiens. Quand **Henri de Navarre** devient roi en 1589 sous le nom d’**Henri IV**, il est protestant et la plus grande partie du royaume ne veut pas de lui. Il gagne des batailles — Arques, Ivry — sans gagner la paix. Le **25 juillet 1593**, il abjure à Saint-Denis et entre dans Paris l’année suivante. Restait à régler ce qui avait mis le feu : la place des réformés dans un royaume catholique. Cela prend quatre ans de négociations, article par article, avec des députés protestants méfiants et un clergé hostile.',
      },
      {
        titre: 'Ce que l’édit accorde, exactement',
        texte:
          'Signé à **Nantes le 13 avril 1598**, le texte tient en **quatre étages**. D’abord la **liberté de conscience** : partout dans le royaume, nul ne peut être inquiété pour sa croyance — c’est l’article le plus neuf. Ensuite la **liberté de culte**, mais limitée : on prêche là où le culte existait déjà, dans un lieu par bailliage, et chez les seigneurs protestants ; jamais à Paris ni à la cour. Puis l’**égalité civile** : les réformés peuvent occuper toutes les charges, entrer dans les universités, les hôpitaux, les métiers, et ils obtiennent dans les parlements des **chambres mi-parties**, composées pour moitié de juges protestants, afin d’être jugés équitablement. Enfin, deux **brevets** secrets leur laissent environ **150 places de sûreté** — des villes fortifiées tenues par leurs garnisons, payées par le roi pendant huit ans — et un subside pour l’entretien des pasteurs. Le premier article, lui, efface tout : les crimes des guerres sont réputés « non advenus ».',
      },
      {
        titre: 'Faire enregistrer un texte que personne n’aime',
        texte:
          'Un édit n’a force de loi qu’après son **enregistrement** par les parlements. Or ils refusent : les magistrats parisiens trouvent qu’on donne trop aux réformés, le clergé proteste, les huguenots intransigeants trouvent qu’on leur donne trop peu. Pendant neuf mois, rien ne bouge. Le **7 janvier 1599**, Henri IV convoque les magistrats et leur parle debout, sans texte, pendant près d’une heure : il rappelle les ruines, les corps, les années perdues, et finit par cette phrase que les greffiers notent — « Je suis roi maintenant, et parle en roi. Je veux être obéi. » Le Parlement de Paris enregistre le **25 février 1599** ; ceux de province suivront jusqu’en 1600, certains à contrecœur. L’édit n’a pas été aimé : il a été imposé, par un roi qui savait de quoi il parlait.',
      },
      {
        titre: 'Le premier texte de coexistence d’Europe',
        texte:
          'En 1598, l’Europe vit sous une autre règle, posée à Augsbourg en 1555 : *cujus regio, ejus religio* — le prince choisit la religion, les sujets suivent ou s’en vont. Nantes fait autre chose : **un royaume, un roi, deux cultes légaux**. C’est la première fois qu’un grand État accepte durablement, par écrit, une minorité religieuse en son sein. Il ne faut pas y lire la tolérance au sens d’aujourd’hui : Henri IV ne dit pas que les deux religions se valent, il dit que la guerre coûte plus cher que la différence, et il donne à cette idée une forme juridique. La paix revient, et avec elle le travail : avec **Sully**, les routes se refont, les dettes se remboursent, les campagnes respirent. La France du XVIIᵉ siècle commence là — et l’édit tiendra **quatre-vingt-sept ans**.',
      },
    ],
    consequences: [
      'Les guerres de religion s’arrêtent : le royaume connaît sa première paix civile depuis 1562.',
      'La liberté de conscience est reconnue partout, et l’accès aux charges et aux métiers ouvert aux protestants.',
      'Des chambres de justice mi-parties jugent les procès entre catholiques et réformés.',
      'La France se relève : avec Sully, les finances se redressent et les campagnes se repeuplent.',
      'Les places de sûreté font du parti protestant un État dans l’État : Richelieu les supprimera (La Rochelle, 1628).',
      'L’édit sert de modèle et de référence en Europe jusqu’à sa révocation par Louis XIV en 1685.',
    ],
    chiffres: [
      { valeur: '92', quoi: 'articles publics, plus 56 articles particuliers' },
      { valeur: '150', quoi: 'places de sûreté laissées aux protestants' },
      { valeur: '36 ans', quoi: 'de guerres civiles refermées d’un texte' },
      { valeur: '87 ans', quoi: 'la durée de vie de l’édit, jusqu’en 1685' },
    ],
    chrono: [
      { date: '2 août 1589', fait: 'Henri de Navarre devient roi sous le nom d’Henri IV.' },
      { date: '25 juillet 1593', fait: 'Abjuration du roi à Saint-Denis.' },
      { date: '22 mars 1594', fait: 'Henri IV entre dans Paris.' },
      { date: '13 avril 1598', fait: 'Signature de l’édit à Nantes.' },
      { date: '2 mai 1598', fait: 'Paix de Vervins : fin de la guerre avec l’Espagne.' },
      { date: '7 janvier 1599', fait: 'Henri IV somme le Parlement d’enregistrer l’édit.' },
      { date: '25 février 1599', fait: 'Enregistrement par le Parlement de Paris.' },
      { date: '14 mai 1610', fait: 'Assassinat d’Henri IV rue de la Ferronnerie.' },
    ],
    leSaisTu:
      'L’original de l’édit a disparu. Il n’en reste que des copies enregistrées par les parlements — et, à Genève, l’exemplaire que les protestants avaient mis à l’abri. En 1685, les agents de Louis XIV firent chercher partout les copies pour les détruire : c’est grâce aux villes qui avaient caché la leur que l’on connaît le texte entier.',
    aRetenir: [
      'Le 13 avril 1598, Henri IV signe à Nantes l’édit qui met fin aux guerres de religion.',
      'Il accorde la liberté de conscience partout, la liberté de culte dans des lieux définis et l’égalité civile.',
      'Il laisse aux protestants environ 150 places de sûreté gardées aux frais du roi.',
      'C’est le premier grand texte de coexistence religieuse en Europe : un royaume, deux cultes légaux.',
      'Enregistré par le Parlement de Paris le 25 février 1599, il sera révoqué par Louis XIV en 1685.',
    ],
    mots: [
      {
        mot: 'Édit',
        sens: 'Loi donnée par le roi sur une matière précise ; elle n’est applicable qu’une fois enregistrée par les parlements.',
      },
      {
        mot: 'Liberté de conscience',
        sens: 'Droit de croire ce que l’on veut sans être inquiété — distinct du droit de pratiquer son culte en public.',
      },
      {
        mot: 'Place de sûreté',
        sens: 'Ville fortifiée laissée à la garde des protestants pour garantir qu’on tiendra parole.',
      },
      {
        mot: 'Chambre mi-partie',
        sens: 'Tribunal composé pour moitié de juges catholiques et de juges protestants.',
      },
    ],
    lies: [
      'henri-iv',
      'massacre-de-la-saint-barthelemy',
      'revocation-de-l-edit-de-nantes',
      'jean-calvin',
      'richelieu',
    ],
    niveaux: ['5e'],
    programme: 'Humanisme, réformes et conflits religieux',
    tags: [
      'édit de Nantes',
      '1598',
      'Henri IV',
      'huguenots',
      'protestants',
      'guerres de religion',
      'tolérance',
      'liberté de conscience',
      'Nantes',
      'places de sûreté',
    ],
  },
  {
    id: 'la-fronde',
    volet: 'evenements',
    nom: 'La Fronde',
    date: '1648 – 1653',
    tri: 1648,
    fin: 1653,
    periode: 'temps-modernes',
    emoji: '🧱',
    lieu: 'Paris, puis la Guyenne et la Champagne',
    accroche:
      'Pendant cinq ans, magistrats et princes tiennent tête à la régente. Le roi enfant fuit Paris de nuit : il n’oubliera jamais, et Versailles en sortira.',
    citations: [
      {
        texte:
          'Paris s’arma en un instant : on vit en moins de deux heures plus de douze cents barricades.',
        qui: 'Le cardinal de Retz',
        contexte:
          'Dans ses *Mémoires*, sur la journée des barricades du 26 août 1648, qu’il avait lui-même largement attisée.',
      },
      {
        texte:
          'Le Parlement fait comme ces écoliers qui frondent dans les fossés de Paris, et se séparent dès qu’ils voient le lieutenant civil.',
        qui: 'Le conseiller Bachaumont',
        contexte: 'Au Parlement de Paris, en 1649 : la moquerie qui donne son nom à la Fronde.',
        sens:
          'La fronde est le lance-pierre des enfants de Paris. Les magistrats reprennent l’insulte à leur compte et en font leur enseigne.',
      },
      {
        texte: 'L’État, c’est moi.',
        qui: 'Attribué à Louis XIV',
        contexte:
          'Prêtée au roi devant le Parlement le 13 avril 1655, deux ans après la Fronde. Aucun témoin de la séance ne la rapporte.',
        sens:
          'Inventée ou non, elle dit juste ce que le roi a retenu de son enfance : plus jamais un corps du royaume ne parlera au nom de l’État à sa place.',
        incertaine: true,
      },
    ],
    reperes: [
      'Louis XIV est roi à quatre ans, en 1643 ; sa mère Anne d’Autriche gouverne avec le cardinal Mazarin.',
      'La guerre de Trente Ans a triplé les impôts ; l’État taxe même les offices des magistrats.',
      'Le 26 août 1648, l’arrestation du conseiller Broussel couvre Paris de barricades.',
      'Dans la nuit du 5 au 6 janvier 1649, la cour quitte Paris en secret pour Saint-Germain.',
      'La Fronde des princes (1650-1653) met Condé et Turenne aux prises, et chasse deux fois Mazarin du royaume.',
      'Louis XIV rentre dans Paris le 21 octobre 1652 ; c’est la dernière révolte nobiliaire de notre histoire.',
    ],
    causes: [
      'Le coût de la guerre de Trente Ans : la taille a presque triplé depuis 1635 et les campagnes ne suivent plus.',
      'Une régence — une reine espagnole, un ministre italien, un roi de dix ans — que beaucoup croient facile à faire plier.',
      'Les expédients fiscaux du pouvoir, qui finissent par frapper les officiers de justice eux-mêmes en retenant leurs gages.',
      'Un Parlement de Paris décidé à obtenir un droit de regard sur l’impôt et sur les arrestations arbitraires.',
      'Les grands seigneurs, princes du sang en tête, qui veulent reprendre la place que Richelieu leur avait ôtée.',
      'L’exemple anglais : le roi Charles Ier jugé par son Parlement et décapité le 30 janvier 1649.',
      'L’arrestation du vieux conseiller Broussel, le 26 août 1648, au lendemain d’un Te Deum de victoire : l’étincelle.',
    ],
    recit: [
      {
        titre: 'Une régence, un enfant, un cardinal',
        texte:
          'Louis XIII meurt en 1643 en laissant un fils de **quatre ans**. **Anne d’Autriche** exerce la régence avec **Mazarin**, cardinal italien formé par Richelieu, habile et détesté. Il faut finir la guerre contre l’Espagne et l’Empire, et pour cela payer : la **taille** a presque triplé en dix ans, on crée des offices pour les revendre, on invente des taxes sur les maisons de Paris, on retient les gages des magistrats. Le 13 mai **1648**, les quatre cours souveraines de Paris passent un **arrêt d’union** et se réunissent en **chambre Saint-Louis** : elles réclament la suppression des intendants, le vote de l’impôt et l’interdiction d’emprisonner sans jugement plus de vingt-quatre heures. Ce sont des demandes de juristes, pas de révolutionnaires — mais elles touchent au cœur du pouvoir.',
      },
      {
        titre: 'Les barricades du 26 août 1648',
        texte:
          'Le **26 août 1648**, Paris chante un *Te Deum* à Notre-Dame pour la victoire de Condé à **Lens**. Au sortir de la cérémonie, la régente fait arrêter le conseiller **Broussel**, vieux magistrat populaire. En quelques heures, la ville se hérisse : chaînes tendues, tonneaux, pavés, **plus de douze cents barricades** selon le coadjuteur **Retz**, qui court les rues et les encourage. La foule vient jusqu’aux grilles du Palais-Royal. Anne d’Autriche cède et libère Broussel le 28. C’est la première fois depuis la Ligue que Paris impose sa volonté à la couronne, et la première leçon donnée au jeune roi : une capitale peut faire reculer une régente.',
      },
      {
        titre: 'La fuite du 6 janvier 1649',
        texte:
          'Dans la nuit du **5 au 6 janvier 1649**, jour des Rois, la cour quitte Paris en secret. Le roi de **dix ans**, sa mère, son frère et Mazarin roulent jusqu’à **Saint-Germain-en-Laye**, où le château n’est pas meublé : on dort sur de la paille. Condé met le siège devant Paris et coupe les convois de blé. La ville tient trois mois, puis traite : c’est la **paix de Rueil**, en mars 1649. Deux ans plus tard, autre humiliation : dans la nuit du **9 au 10 février 1651**, des Parisiens en armes exigent de voir si le roi est bien au Palais-Royal. Anne d’Autriche les fait entrer et défiler devant le lit de son fils, qui fait semblant de dormir. Il a douze ans. Il s’en souviendra toute sa vie.',
      },
      {
        titre: 'La Fronde des princes',
        texte:
          'La seconde partie de l’affaire n’a plus rien de juridique. Le **18 janvier 1650**, Mazarin fait arrêter le prince de **Condé**, vainqueur de Rocroi et de Lens, avec son frère et son beau-frère : les grands prennent les armes pour les libérer. Libéré en février 1651, Condé se révolte à son tour, s’allie à l’Espagne, et l’on voit les deux meilleurs soldats du siècle s’affronter — Condé contre **Turenne**, resté fidèle au roi. Mazarin, chassé du royaume par deux fois, gouverne par courrier depuis l’exil, pendant que paraissent plus de **cinq mille pamphlets** contre lui, les *mazarinades*. Le **2 juillet 1652**, Turenne acculé Condé contre la porte Saint-Antoine ; la **Grande Mademoiselle**, cousine du roi, fait tirer sur les troupes royales le canon de la **Bastille** pour sauver l’armée des princes. Paris finit par se lasser : le **21 octobre 1652**, Louis XIV rentre dans sa capitale ; Mazarin revient en février 1653.',
      },
      {
        titre: 'Ce que le roi en a retenu',
        texte:
          'La Fronde laisse un royaume abîmé — récoltes brûlées, peste et famine dans le Bassin parisien, des provinces entières désorganisées — et un enfant devenu adulte. À la mort de Mazarin, en 1661, Louis XIV annonce qu’il gouvernera **sans premier ministre** : il tiendra parole cinquante-quatre ans. En 1673, il retire aux parlements le droit de faire des **remontrances** avant d’enregistrer une loi. Et surtout, il décide de ne pas gouverner depuis Paris, et d’avoir sa noblesse sous les yeux plutôt que dans ses provinces : en 1682, la cour s’installe à **Versailles**. On peut lire le château comme un caprice de bâtisseur ; il est d’abord la réponse d’un homme de quarante ans aux nuits de ses dix ans.',
      },
    ],
    consequences: [
      'La monarchie sort victorieuse et durcie : plus de premier ministre après Mazarin, le roi gouverne seul dès 1661.',
      'Les parlements perdent en 1673 le droit de remontrance avant enregistrement des lois.',
      'Les grands seigneurs sont attirés à la cour et tenus par l’étiquette : Versailles répond à la Fronde.',
      'Louis XIV se méfiera toute sa vie de Paris et installera son gouvernement hors de la capitale.',
      'Cinq ans de guerre civile laissent des campagnes ravagées, la famine et la peste dans le Bassin parisien.',
      'C’est la dernière grande révolte nobiliaire de l’histoire de France.',
    ],
    chiffres: [
      { valeur: '1 200', quoi: 'barricades dans Paris le 26 août 1648' },
      { valeur: '5 000', quoi: 'pamphlets contre Mazarin, les « mazarinades »' },
      { valeur: '10 ans', quoi: 'l’âge de Louis XIV la nuit de la fuite' },
      { valeur: '2 fois', quoi: 'Mazarin chassé du royaume, en 1651 et 1652' },
    ],
    chrono: [
      { date: '13 mai 1648', fait: 'Arrêt d’union des cours souveraines de Paris.' },
      { date: '26 août 1648', fait: 'Arrestation de Broussel, journée des barricades.' },
      { date: '6 janvier 1649', fait: 'La cour quitte Paris de nuit pour Saint-Germain.' },
      { date: 'mars 1649', fait: 'Paix de Rueil : fin de la Fronde parlementaire.' },
      { date: '18 janvier 1650', fait: 'Arrestation de Condé : la Fronde des princes commence.' },
      { date: '9 février 1651', fait: 'Les Parisiens défilent devant le lit du roi.' },
      { date: '2 juillet 1652', fait: 'Combat du faubourg Saint-Antoine ; le canon de la Bastille.' },
      { date: '21 octobre 1652', fait: 'Louis XIV rentre dans Paris.' },
      { date: 'février 1653', fait: 'Retour de Mazarin : la Fronde est finie.' },
    ],
    leSaisTu:
      'Le mot « fronde » désigne le lance-pierre avec lequel les gamins de Paris se battaient dans les fossés de la ville. C’était une insulte : on traitait les magistrats de gosses. Ils en ont fait leur emblème, jusqu’à porter des chapeaux et des rubans « à la fronde ». Depuis, en français, « fronder » veut dire contester l’autorité en se moquant d’elle.',
    aRetenir: [
      'La Fronde (1648-1653) est une révolte contre la régence d’Anne d’Autriche et le cardinal Mazarin.',
      'Elle commence par les magistrats du Parlement de Paris, puis se poursuit avec les princes, Condé en tête.',
      'Le 26 août 1648, Paris se couvre de barricades ; la cour s’enfuit de nuit le 6 janvier 1649.',
      'Louis XIV, enfant, y perd Paris deux fois : il gouvernera seul dès 1661 et s’installera à Versailles en 1682.',
      'C’est la dernière grande révolte nobiliaire de l’histoire de France.',
    ],
    mots: [
      {
        mot: 'Régence',
        sens: 'Gouvernement exercé au nom d’un roi trop jeune pour régner, ici par sa mère Anne d’Autriche.',
      },
      {
        mot: 'Remontrance',
        sens: 'Objection que les parlements pouvaient adresser au roi avant d’enregistrer une loi.',
      },
      {
        mot: 'Mazarinade',
        sens: 'Pamphlet imprimé contre le cardinal Mazarin : il en a paru plus de cinq mille.',
      },
      {
        mot: 'Intendant',
        sens: 'Envoyé du roi dans une province, chargé de la justice, de la police et des finances.',
      },
    ],
    lies: ['louis-xiv', 'richelieu', 'versailles-et-la-cour'],
    niveaux: ['5e', '4e', '2de'],
    programme: 'Du Prince de la Renaissance au roi absolu',
    tags: [
      'Fronde',
      'Mazarin',
      'Anne d’Autriche',
      'Condé',
      'Turenne',
      'Retz',
      'barricades',
      'Parlement de Paris',
      'régence',
      'mazarinades',
    ],
  },
  {
    id: 'versailles-et-la-cour',
    volet: 'evenements',
    nom: 'Versailles et la cour',
    date: '6 mai 1682',
    tri: 1682,
    periode: 'temps-modernes',
    emoji: '👑',
    lieu: 'Versailles',
    accroche:
      'Le roi installe sa cour à six lieues de Paris et y fixe la noblesse du royaume : un palais qui est d’abord un instrument de gouvernement.',
    citations: [
      {
        texte:
          'Personne ne connut mieux que lui l’art de vendre ses paroles, son sourire, jusqu’à ses regards.',
        qui: 'Saint-Simon',
        contexte:
          'Portrait de Louis XIV dans ses *Mémoires*, écrits après 1715 par un duc qui avait passé vingt ans à la cour.',
        sens:
          'À Versailles, un regard du roi vaut une charge, une pension ou un mariage. C’est cette monnaie-là qui tient la noblesse.',
      },
      {
        texte: 'Versailles, cette machine à faire des courtisans.',
        qui: 'Saint-Simon',
        contexte:
          'Formule passée dans les manuels pour résumer son jugement sur la cour ; ses *Mémoires* le disent en vingt pages, pas en cinq mots.',
        incertaine: true,
      },
      {
        texte: 'Le métier de roi est grand, noble et délicieux.',
        qui: 'Louis XIV',
        contexte:
          'Dans les *Mémoires pour l’instruction du Dauphin*, où il écrit lui-même à son fils ce qu’il attend d’un souverain.',
      },
      {
        texte:
          'Ne m’imitez pas dans le goût que j’ai eu pour les bâtiments, ni dans celui que j’ai eu pour la guerre.',
        qui: 'Louis XIV à son arrière-petit-fils',
        contexte:
          'Sur son lit de mort, le 26 août 1715, au futur Louis XV, alors âgé de cinq ans.',
        sens: 'Le bâtisseur de Versailles juge lui-même, à la fin, ce que son œuvre a coûté au royaume.',
      },
    ],
    reperes: [
      'Le 6 mai 1682, Louis XIV installe officiellement à Versailles la cour et le gouvernement du royaume.',
      'Le château est né d’un relais de chasse de Louis XIII, agrandi à partir de 1661 par Le Vau puis Hardouin-Mansart.',
      'Le Nôtre dessine les jardins, Le Brun conduit les décors ; la galerie des Glaces s’achève en 1684.',
      'Jusqu’à dix mille personnes y vivent : famille royale, courtisans, ministres, gardes et domestiques.',
      'La journée du roi est réglée heure par heure, du lever au coucher, et toute la cour y assiste.',
      'Les comptes des Bâtiments du roi portent environ 63 millions de livres pour Versailles.',
    ],
    causes: [
      'La Fronde (1648-1653) : un roi enfant chassé deux fois de Paris, qui ne veut plus d’une capitale maîtresse de lui.',
      'Une haute noblesse sans emploi depuis que l’État est tenu par des ministres et des intendants : il lui faut un théâtre, à défaut d’une armée.',
      'Une doctrine du pouvoir : le roi tient sa charge de Dieu, et cette grandeur doit SE VOIR — l’architecture est un argument politique.',
      'La fête de Vaux-le-Vicomte en 1661, où Fouquet montre au roi ce qu’un particulier peut bâtir : Louis XIV prendra ses trois artistes.',
      'Les moyens donnés par Colbert : une administration des finances capable de porter un chantier de cinquante ans.',
      'Le goût personnel du roi pour la chasse, les jardins, la musique et le bâtiment, qu’il reconnaîtra lui-même à sa mort.',
    ],
    recit: [
      {
        titre: 'D’un relais de chasse à un palais',
        texte:
          'En 1623, Louis XIII s’était fait bâtir sur la butte de Versailles un petit relais de chasse de brique et de pierre. Son fils décide en **1661** de l’agrandir sans le détruire : le pavillon paternel est toujours là, au cœur de la cour de Marbre. **Louis Le Vau** l’enveloppe d’un corps de bâtiments côté jardin (1668-1670), **Jules Hardouin-Mansart** double tout à partir de 1678 — aile du Midi, aile du Nord, et surtout la **galerie des Glaces**, soixante-treize mètres de long et **357 miroirs**, achevée en 1684. **André Le Nôtre** dessine huit cents hectares de jardins sur un terrain marécageux, **Charles Le Brun** conduit trois cents peintres et sculpteurs. Au plus fort, en 1685, **36 000 ouvriers** et 6 000 chevaux travaillent sur le chantier. Le problème le plus difficile ne fut ni la pierre ni l’or : c’est l’eau. Pour alimenter les 1 400 jets d’eau, on construit la **machine de Marly**, quatorze roues sur la Seine, et l’on creuse des rigoles sur des dizaines de kilomètres.',
      },
      {
        titre: 'Tenir la noblesse sous le même toit',
        texte:
          'Le **6 mai 1682**, la cour et le gouvernement s’installent : Versailles devient la capitale politique du royaume. Ce n’est pas un déménagement de confort, c’est une méthode. La haute noblesse, qui s’est soulevée pendant la Fronde, est invitée à vivre auprès du roi ; elle y vient parce que **tout se décide là**. Un gouvernement de province, un régiment, une pension, un mariage avantageux : rien ne s’obtient sans être vu. Un logement au château, même une soupente sous les combles, vaut mieux qu’un hôtel à Paris, et l’on se bat pour un appartement marqué d’un simple « **pour** M. le duc de… » tracé à la craie sur la porte. Saint-Simon raconte le roi remarquant une absence : « Je ne le connais point. » La phrase suffit à ruiner une carrière. À vivre ainsi, un noble dépense sa fortune en habits et en carrosses, et n’a plus ni le temps ni l’argent de comploter dans ses terres. **Jusqu’à dix mille personnes** logent ou travaillent à Versailles.',
      },
      {
        titre: 'La journée du roi, à la minute',
        texte:
          'Tout commence à huit heures et demie, quand le premier valet de chambre touche l’épaule du roi : « **Sire, voilà l’heure.** » Suit le **lever**, découpé en entrées successives — les familiers d’abord, puis les grands officiers, puis la foule des courtisans —, où l’on se dispute l’honneur de tendre la chemise. Messe à dix heures dans la chapelle, conseil jusqu’à une heure, **dîner au petit couvert** seul à sa table mais devant tout le monde, promenade, chasse ou travail avec les ministres l’après-midi, **appartement** trois soirs par semaine (jeu, musique, billard), **souper au grand couvert** à dix heures, puis le **coucher**, où le roi désigne d’un geste celui qui tiendra le bougeoir. Saint-Simon assure qu’avec un almanach et une montre, on pouvait dire à trois cents lieues ce que faisait le roi. Cette régularité n’est pas une manie : elle fait de chaque heure une occasion d’être remarqué, et de chaque geste une faveur à distribuer.',
      },
      {
        titre: 'L’étiquette, une arme qui ne coûte rien',
        texte:
          'L’**étiquette** règle qui entre, qui s’assoit, qui passe devant. Seules les duchesses ont droit au **tabouret** devant la reine ; les autres restent debout, et une famille peut plaider dix ans pour obtenir ce droit. Qui tient la manche de la chemise au lever, qui éclaire le coucher, qui monte dans les carrosses du roi : chaque détail est une distinction publique, et elle ne coûte pas un sou au Trésor. C’est là le génie du système : le roi n’a pas assez de charges et de pensions pour contenter trois mille nobles, mais il a un nombre illimité de **marques d’honneur**. Les querelles de préséance occupent la cour comme les batailles occupaient jadis les mêmes hommes. Le revers est connu et le roi le savait : ceux qui gouvernent vraiment — Colbert, Louvois, les intendants — sortent de la bourgeoisie de robe, pas de cette noblesse-là.',
      },
      {
        titre: 'Ce que le palais dit aux étrangers',
        texte:
          'Versailles est aussi un argument diplomatique. Les ambassadeurs sont reçus dans la **galerie des Glaces**, où la lumière des fenêtres revient sur les miroirs, où les peintures de Le Brun racontent les victoires du règne, et où l’on fait sortir l’**argenterie massive** du Trésor. Le doge de Gênes y vient s’excuser en 1685 ; les ambassadeurs du **Siam** y sont reçus en 1686 devant toute la cour, avec leurs présents portés à bout de bras dans la galerie. L’effet dépasse la France : Vienne bâtira Schönbrunn, Berlin Charlottenbourg, Naples Caserte, Saint-Pétersbourg Peterhof — tous avec Versailles en tête, et le **français** devient la langue des cours d’Europe. Mais le prix est là, inscrit aux comptes des Bâtiments du roi : environ **63 millions de livres**, et une cour qui absorbe chaque année autour de 5 % du budget de l’État. C’est cette charge-là que Louis XVI traînera encore en 1789.',
      },
    ],
    consequences: [
      'La haute noblesse vient vivre auprès du roi : être absent, c’est être oublié, et les révoltes nobiliaires cessent.',
      'Le gouvernement se fixe en un lieu : ministres, bureaux et archives réunis, embryon d’administration moderne.',
      'Versailles devient le modèle des cours d’Europe, de Schönbrunn à Peterhof, et le français leur langue commune.',
      'Les arts français — meuble, tapisserie, jardin, musique, mode — s’imposent dans toute l’Europe.',
      'La cour coûte autour de 5 % du budget de l’État, une charge que la monarchie portera jusqu’en 1789.',
      'Le 6 octobre 1789, les femmes venues de Paris ramèneront le roi aux Tuileries : la cour quittera Versailles pour toujours.',
    ],
    chiffres: [
      { valeur: '10 000', quoi: 'personnes vivant ou travaillant à Versailles' },
      { valeur: '63 millions', quoi: 'de livres aux comptes des Bâtiments du roi' },
      { valeur: '36 000', quoi: 'ouvriers sur le chantier en 1685' },
      { valeur: '357', quoi: 'miroirs dans la galerie des Glaces' },
    ],
    chrono: [
      { date: '1623', fait: 'Louis XIII bâtit un relais de chasse à Versailles.' },
      { date: '17 août 1661', fait: 'Fête de Vaux-le-Vicomte chez Fouquet.' },
      { date: '1668-1670', fait: 'Le Vau enveloppe le château côté jardin.' },
      { date: '1678-1684', fait: 'Hardouin-Mansart bâtit la galerie des Glaces.' },
      { date: '6 mai 1682', fait: 'La cour et le gouvernement s’installent à Versailles.' },
      { date: '1685', fait: 'Le chantier au plus haut : 36 000 ouvriers.' },
      { date: '1er septembre 1686', fait: 'Réception des ambassadeurs du Siam.' },
      { date: '1710', fait: 'Achèvement de la chapelle royale.' },
      { date: '1er septembre 1715', fait: 'Mort de Louis XIV, après cinquante-quatre ans de règne personnel.' },
    ],
    leSaisTu:
      'Le château n’avait presque pas de salles de bains, mais il avait un service de chaises percées et des « porteurs d’eau ». Et pour les milliers de visiteurs, on installa des privés publics : Versailles était ouvert à quiconque portait une épée — on en louait une à la grille. Un paysan bien habillé pouvait voir le roi dîner.',
    aRetenir: [
      'Le 6 mai 1682, Louis XIV installe la cour et le gouvernement à Versailles.',
      'Le château est un instrument politique : il fixe la noblesse auprès du roi après la Fronde.',
      'Jusqu’à dix mille personnes y vivent ; le chantier emploie 36 000 ouvriers en 1685.',
      'La journée du roi et l’étiquette distribuent des marques d’honneur qui ne coûtent rien au Trésor.',
      'Les comptes des Bâtiments portent environ 63 millions de livres, et la cour près de 5 % du budget de l’État.',
    ],
    mots: [
      {
        mot: 'Cour',
        sens: 'L’ensemble des personnes qui entourent le souverain et vivent auprès de lui.',
      },
      {
        mot: 'Étiquette',
        sens: 'Règles précises qui fixent les préséances et les gestes de la vie de cour.',
      },
      {
        mot: 'Courtisan',
        sens: 'Noble qui vit à la cour et y cherche les faveurs du roi.',
      },
      {
        mot: 'Lever du roi',
        sens: 'Cérémonie du réveil royal, découpée en « entrées » où chaque rang a sa place.',
      },
      {
        mot: 'Bâtiments du roi',
        sens: 'Administration chargée des chantiers royaux ; ses comptes nous donnent le coût de Versailles.',
      },
    ],
    lies: [
      'louis-xiv',
      'colbert',
      'la-fronde',
      'revocation-de-l-edit-de-nantes',
      'vauban',
    ],
    niveaux: ['5e', '4e', '2de'],
    programme: 'Du Prince de la Renaissance au roi absolu',
    tags: [
      'Versailles',
      'Louis XIV',
      'cour',
      'étiquette',
      'galerie des Glaces',
      'Le Nôtre',
      'Hardouin-Mansart',
      'Saint-Simon',
      'monarchie absolue',
      'courtisans',
    ],
  },
  {
    id: 'revocation-de-l-edit-de-nantes',
    volet: 'evenements',
    nom: 'La révocation de l’édit de Nantes',
    date: '18 octobre 1685',
    tri: 1685,
    periode: 'temps-modernes',
    emoji: '📜',
    lieu: 'Fontainebleau',
    accroche:
      'Louis XIV supprime l’édit de son aïeul et interdit le culte réformé : environ deux cent mille protestants quittent le royaume avec leurs métiers.',
    citations: [
      {
        texte:
          'Les rois sont bien les maîtres de la vie et des biens de leurs sujets, mais jamais de leurs opinions.',
        qui: 'Vauban',
        contexte:
          'Dans son *Mémoire pour le rappel des huguenots*, remis en 1689 : le meilleur ingénieur du roi désapprouve la révocation.',
        sens:
          'Ce n’est pas un jugement d’aujourd’hui : c’est celui d’un maréchal de France, catholique et fidèle, écrit quatre ans après le texte.',
      },
      {
        texte:
          'Nous avons révoqué et révoquons l’édit du roi notre aïeul, donné à Nantes au mois d’avril 1598, en toute son étendue.',
        qui: 'L’édit de Fontainebleau, article premier',
        contexte: 'Texte signé par Louis XIV le 18 octobre 1685 et enregistré quatre jours plus tard.',
      },
      {
        texte:
          'Vous avez affermi la foi, vous avez exterminé les hérétiques : c’est le digne ouvrage de votre règne.',
        qui: 'Bossuet',
        contexte:
          'Oraison funèbre de Michel Le Tellier, 1686 : l’évêque salue la révocation en reprenant les mots du concile de Chalcédoine.',
        sens:
          'Presque tout le royaume catholique accueillit le texte ainsi. C’est le sentiment du temps qu’il faut entendre ici, non le nôtre.',
      },
      {
        texte:
          'Nous offrons un asile sûr et libre dans tous nos pays à ceux de nos coreligionnaires chassés de France.',
        qui: 'Frédéric-Guillaume de Brandebourg',
        contexte:
          'Édit de Potsdam, 29 octobre 1685 : onze jours après Fontainebleau, le Brandebourg ouvre ses portes aux huguenots.',
      },
    ],
    reperes: [
      'L’édit de Fontainebleau, signé le 18 octobre 1685, annule l’édit de Nantes de 1598.',
      'Il ordonne la démolition des temples, l’interdiction du culte et l’exil des pasteurs sous quinze jours.',
      'Il interdit en revanche aux fidèles de quitter le royaume, sous peine de galères pour les hommes.',
      'Depuis 1681, les dragonnades logeaient des soldats chez les protestants jusqu’à leur conversion.',
      'Environ 200 000 personnes partent malgré l’interdiction : c’est ce qu’on appelle le Refuge.',
      'Le culte réformé restera clandestin jusqu’à l’édit de tolérance de Louis XVI, en 1787.',
    ],
    causes: [
      'Un principe admis dans toute l’Europe depuis 1555 : un prince, une foi. La France faisait exception depuis 1598.',
      'La conviction du roi qu’il répond devant Dieu du salut de ses sujets : ramener les réformés à l’Église est un devoir de sa charge.',
      'Un édit de Nantes présenté dès l’origine comme provisoire, « en attendant que Dieu rende la paix aux esprits ».',
      'L’assemblée du clergé qui, depuis vingt ans, réclame et finance la fin du culte réformé.',
      'La disparition de toute force militaire protestante depuis la paix d’Alès (1629), qui rend la mesure sans risque apparent.',
      'La caisse des conversions ouverte en 1676, puis les dragonnades de 1681, qui font remonter aux intendants des chiffres de conversions massives.',
      'Le roi croit, sur la foi de ces rapports, qu’il ne reste presque plus de protestants à convertir : il pense signer un constat.',
    ],
    recit: [
      {
        titre: 'Vingt ans de restrictions avant le texte',
        texte:
          'La révocation n’arrive pas d’un coup. À partir de 1661, l’administration royale relit l’édit de Nantes **à la lettre la plus étroite** : tout temple bâti sans titre exact est démoli, les métiers se ferment un à un, les chambres mi-parties sont supprimées. En **1676**, Pellisson ouvre la **caisse des conversions** : six livres à qui abjure, davantage pour un notable. À partir de **1681**, l’intendant Marillac essaie en Poitou un procédé nouveau : on loge des **dragons** chez les familles protestantes, avec licence de s’y conduire mal, jusqu’à ce que la maison abjure. Les **dragonnades** gagnent le Béarn, le Languedoc, le Dauphiné. Les intendants annoncent des paroisses entières converties en une semaine. Ces chiffres montent jusqu’au roi, qui les croit : il pense que le problème est réglé et qu’il ne reste plus qu’à en prendre acte.',
      },
      {
        titre: 'L’édit de Fontainebleau',
        texte:
          'Le **18 octobre 1685**, à Fontainebleau, Louis XIV signe l’édit rédigé par le chancelier Le Tellier. Il révoque l’édit de Nantes « en toute son étendue ». Tous les **temples** sont à démolir — il y en avait environ huit cents. Le culte réformé est interdit partout, en public comme en famille. Les **pasteurs** ont quinze jours pour quitter le royaume, sauf à se convertir, auquel cas on leur offre une pension. Les enfants nés de parents réformés doivent être **baptisés catholiques** et élevés comme tels. Les écoles protestantes ferment. Et l’article 10 interdit aux simples fidèles de sortir du royaume, sous peine de **galères** pour les hommes et de prison pour les femmes : on ne leur laisse ni le droit de pratiquer, ni le droit de partir. Le texte se termine sur une formule qui dit tout de l’intention : ceux qui restent pourront demeurer chez eux « en attendant qu’il plaise à Dieu de les éclairer ».',
      },
      {
        titre: 'Un royaume qui applaudit',
        texte:
          'Il faut dire les choses comme elles furent : la révocation est accueillie par la France catholique comme un couronnement du règne. **Bossuet** y voit l’œuvre d’un nouveau Constantin ; **La Fontaine**, **Racine** et **La Bruyère** l’approuvent ; le Parlement l’enregistre sans difficulté ; le pape Innocent XI, pourtant en conflit avec Louis XIV, fait chanter un *Te Deum*. Une seule grande voix s’élève au-dedans, et c’est celle d’un serviteur irréprochable du roi : **Vauban**, commissaire général des fortifications. Dans son *Mémoire pour le rappel des huguenots* de **1689**, il écrit que le royaume a perdu près de **100 000 habitants**, **60 millions de livres**, **9 000 marins**, **12 000 soldats** et **600 officiers**, et que les rois ne sont pas maîtres des opinions de leurs sujets. Son mémoire ne circule pas ; il est classé.',
      },
      {
        titre: 'Le Refuge',
        texte:
          'Malgré l’interdiction, malgré les gardes aux frontières et aux ports, **environ 200 000 personnes** quittent le royaume entre 1685 et 1700 — sur sept à huit cent mille protestants. On part de nuit, par les Cévennes, la Suisse, les Flandres ; on cache les enfants dans des ballots de marchandise ; on abandonne maisons et terres. Ils s’installent dans les **Provinces-Unies**, en **Angleterre**, en **Suisse**, au **Brandebourg** — dont l’électeur les appelle par l’édit de Potsdam onze jours après Fontainebleau —, jusqu’au Cap de Bonne-Espérance et en Amérique. Ce sont des horlogers, des tisserands de soie, des papetiers, des imprimeurs, des chirurgiens, des officiers. Berlin comptera vers 1700 **un habitant sur cinq** d’origine huguenote ; les manufactures de soie de Spitalfields à Londres et l’horlogerie de Genève doivent beaucoup à ce départ. Le maréchal de **Schomberg**, chassé de France, commandera l’armée de Guillaume d’Orange contre les alliés de Louis XIV.',
      },
      {
        titre: 'Ceux qui restent, et l’attente de cent ans',
        texte:
          'La majorité ne peut pas partir. On les appelle les **nouveaux convertis** : catholiques sur le registre, réformés chez eux. Dans les Cévennes et le Languedoc, des assemblées clandestines se tiennent la nuit dans les bois — c’est l’**Église du Désert** —, avec des pasteurs formés en Suisse qui rentrent au péril de leur vie. En 1702, l’assassinat de l’abbé du Chayla déclenche la guerre des **Camisards**, deux ans de guérilla dans la montagne qui mobilise jusqu’à 25 000 soldats du roi. Il faudra attendre le **29 novembre 1787** pour que Louis XVI signe l’**édit de tolérance**, qui rend aux protestants un état civil — le droit de se marier, de déclarer leurs enfants, d’hériter — sans leur rendre la liberté de culte. Celle-ci viendra en **1789**, avec la Déclaration des droits de l’homme. Entre les deux édits, cent deux ans.',
      },
    ],
    consequences: [
      'Huit cents temples démolis, le culte réformé interdit, les pasteurs expulsés et les enfants baptisés catholiques.',
      'Environ 200 000 protestants quittent le royaume malgré l’interdiction : c’est le Refuge.',
      'L’économie perd des métiers entiers — soie, papier, horlogerie, imprimerie — et la marine des milliers de marins.',
      'Les pays d’accueil en profitent : Berlin, Londres, Amsterdam et Genève gagnent artisans et capitaux.',
      'L’Europe protestante se coalise contre Louis XIV ; des officiers français servent désormais contre lui.',
      'Le protestantisme survit clandestinement au Désert et se soulève avec les Camisards (1702-1710).',
      'Il faudra l’édit de tolérance de 1787, puis 1789, pour rendre aux protestants état civil et liberté de culte.',
    ],
    chiffres: [
      { valeur: '200 000', quoi: 'protestants partis pour le Refuge' },
      { valeur: '800 000', quoi: 'protestants dans le royaume avant 1685' },
      { valeur: '1 sur 5', quoi: 'habitants de Berlin d’origine huguenote vers 1700' },
      { valeur: '102 ans', quoi: 'avant l’édit de tolérance de 1787' },
    ],
    chrono: [
      { date: 'à partir de 1661', fait: 'L’édit de Nantes est appliqué au plus étroit.' },
      { date: '1676', fait: 'Pellisson ouvre la caisse des conversions.' },
      { date: '1681', fait: 'Premières dragonnades en Poitou.' },
      { date: '18 octobre 1685', fait: 'Louis XIV signe l’édit de Fontainebleau.' },
      { date: '29 octobre 1685', fait: 'Édit de Potsdam : le Brandebourg accueille les huguenots.' },
      { date: '1689', fait: 'Vauban écrit son Mémoire pour le rappel des huguenots.' },
      { date: '1702-1710', fait: 'Guerre des Camisards dans les Cévennes.' },
      { date: '29 novembre 1787', fait: 'Édit de tolérance de Louis XVI.' },
    ],
    leSaisTu:
      'Les huguenots ont emporté leurs métiers dans leurs bagages. Le chapelier Antoine Cadeau a monté sa fabrique à Londres, les tisserands de Tours celles de Spitalfields, et l’horlogerie de Genève s’est remplie d’ouvriers venus de Nîmes. En Prusse, on parlait encore français dans certaines paroisses de Berlin au XIXᵉ siècle.',
    aRetenir: [
      'Le 18 octobre 1685, Louis XIV signe l’édit de Fontainebleau, qui révoque l’édit de Nantes de 1598.',
      'Les temples sont démolis, le culte interdit, les pasteurs exilés, mais les fidèles n’ont pas le droit de partir.',
      'Environ 200 000 protestants quittent quand même le royaume : c’est le Refuge.',
      'Vauban, maréchal de France, chiffre dès 1689 la perte à 100 000 habitants et 60 millions de livres.',
      'Le culte réformé reste clandestin jusqu’à l’édit de tolérance de 1787 et la liberté de culte de 1789.',
    ],
    mots: [
      {
        mot: 'Dragonnade',
        sens: 'Logement forcé de soldats chez une famille protestante jusqu’à ce qu’elle abjure.',
      },
      {
        mot: 'Refuge',
        sens: 'Nom donné à l’émigration des protestants français après 1685 et aux pays qui les ont accueillis.',
      },
      {
        mot: 'Nouveau converti',
        sens: 'Protestant inscrit comme catholique après la révocation, souvent sous la contrainte.',
      },
      {
        mot: 'Désert',
        sens: 'Nom donné aux assemblées clandestines des réformés, tenues la nuit hors des villages.',
      },
      {
        mot: 'Camisards',
        sens: 'Insurgés protestants des Cévennes entre 1702 et 1710, nommés d’après leur chemise de toile.',
      },
    ],
    lies: [
      'louis-xiv',
      'edit-de-nantes',
      'vauban',
      'versailles-et-la-cour',
      'henri-iv',
    ],
    niveaux: ['5e', '4e', '2de'],
    programme: 'Du Prince de la Renaissance au roi absolu',
    tags: [
      'révocation',
      'édit de Fontainebleau',
      '1685',
      'Louis XIV',
      'huguenots',
      'dragonnades',
      'Refuge',
      'Camisards',
      'Vauban',
      'protestants',
    ],
  },
  {
    id: 'l-encyclopedie',
    volet: 'evenements',
    nom: 'L’Encyclopédie',
    date: '1751 – 1772',
    tri: 1751,
    fin: 1772,
    periode: 'temps-modernes',
    emoji: '📚',
    lieu: 'Paris, et de fausses adresses en Suisse',
    accroche:
      'Vingt et un ans, vingt-huit volumes, cent cinquante auteurs : Diderot et d’Alembert rangent tout le savoir du siècle, et la censure court derrière.',
    citations: [
      {
        texte: 'Aucun homme n’a reçu de la nature le droit de commander aux autres.',
        qui: 'Diderot, article « Autorité politique »',
        contexte: 'Tome I de l’*Encyclopédie*, 1751 : l’article qui fit le plus peur aux censeurs.',
        sens:
          'Le pouvoir ne vient donc ni de la naissance ni de Dieu seul, mais du consentement de ceux qui obéissent. En 1751, la phrase est explosive.',
      },
      {
        texte:
          'Le but d’une encyclopédie est de rassembler les connaissances éparses sur la surface de la terre, afin que nos neveux, devenant plus instruits, deviennent en même temps plus vertueux et plus heureux.',
        qui: 'Diderot, article « Encyclopédie »',
        contexte: 'Tome V de l’ouvrage, 1755 : Diderot y explique ce qu’il croit être en train de faire.',
      },
      {
        texte:
          'On a pris la peine d’aller dans leurs ateliers, de les interroger, d’écrire sous leur dictée, de développer leurs pensées.',
        qui: 'Diderot, *Prospectus* de 1750',
        contexte:
          'L’annonce de souscription : pour décrire les métiers, les auteurs sont allés voir travailler les ouvriers.',
        sens:
          'C’est la nouveauté de l’ouvrage : les savoirs de la main entrent pour la première fois dans un livre savant.',
      },
      {
        texte:
          'Comme *Encyclopédie*, il doit exposer autant qu’il est possible l’ordre et l’enchaînement des connaissances humaines.',
        qui: 'D’Alembert, *Discours préliminaire*',
        contexte: 'En tête du tome I, juin 1751 : le texte qui fixe le programme des Lumières.',
      },
    ],
    reperes: [
      'Titre complet : *Encyclopédie, ou Dictionnaire raisonné des sciences, des arts et des métiers*.',
      'Dirigée par Denis Diderot et, jusqu’en 1758, par le mathématicien Jean Le Rond d’Alembert.',
      'Vingt-huit volumes : dix-sept de texte (1751-1765) et onze de planches gravées (1762-1772).',
      'Environ 71 800 articles, écrits par quelque 150 auteurs, dont Voltaire, Rousseau et Montesquieu.',
      'Interdite en 1752, privée de son privilège en 1759, condamnée par le pape — et publiée quand même.',
      'La collection coûte près de 980 livres : environ trois ans du salaire d’un ouvrier parisien.',
    ],
    causes: [
      'Le succès en Angleterre de la *Cyclopaedia* d’Ephraim Chambers (1728), qu’un libraire parisien veut faire traduire.',
      'Une confiance nouvelle dans la raison et l’expérience : le savoir ne se prouve plus par l’autorité des Anciens.',
      'Un public qui achète : salons, académies de province, cabinets de lecture, nobles et bourgeois abonnés.',
      'Des techniques en pleine transformation que personne n’avait décrites : les métiers étaient des secrets d’atelier.',
      'Un libraire, Le Breton, qui y voit une affaire, et deux directeurs qui en font tout autre chose.',
      'Des protecteurs au sein même du pouvoir, à commencer par Malesherbes, directeur de la Librairie, c’est-à-dire chef des censeurs.',
    ],
    recit: [
      {
        titre: 'Une traduction qui tourne autrement',
        texte:
          'Au départ, une commande de libraire : traduire en français la *Cyclopaedia* de l’Anglais **Chambers**, un dictionnaire des sciences en deux volumes. Le libraire **Le Breton** confie l’affaire en 1747 à **Denis Diderot**, écrivain sans fortune, et à **Jean Le Rond d’Alembert**, mathématicien déjà membre de l’Académie des sciences. Ils ne traduisent pas : ils recommencent tout. Le **Prospectus** de novembre 1750 annonce un ouvrage entièrement neuf, qui doit couvrir les **sciences**, les **arts** — au sens de techniques — et les **métiers**. Le tome I paraît en **juin 1751**, ouvert par le *Discours préliminaire* de d’Alembert, où le savoir humain est classé selon trois facultés : mémoire, raison, imagination. Ce plan tient dans un dépliant que l’on peut lire d’un coup d’œil : c’est la première fois qu’on propose une **carte** de tout ce que l’on sait.',
      },
      {
        titre: 'Ce qu’il y a dedans',
        texte:
          'L’ouvrage achevé compte **vingt-huit volumes** : dix-sept de texte, onze de **planches**. Environ **71 800 articles**. Quelque cent cinquante auteurs y ont écrit : **Voltaire** (« Esprit », « Histoire »), **Rousseau** (les articles de musique), **Montesquieu** (« Goût », laissé inachevé à sa mort), Quesnay, Turgot, le baron d’Holbach pour la chimie et les mines, Daubenton pour l’histoire naturelle. Et surtout le chevalier de **Jaucourt**, qui rédige à lui seul environ **17 000 articles**, le quart du texte, en y engloutissant sa fortune — il vendit une maison pour payer ses secrétaires. Les **2 885 planches** sont la partie la plus originale : on y voit, dessinés avec une précision d’ingénieur, l’atelier du serrurier, la fonderie de caractères, la fabrique d’épingles, la coupe d’un navire, la taille d’un diamant. Des gestes que personne n’avait jamais mis en gravure.',
      },
      {
        titre: 'Écrire sous la censure',
        texte:
          'L’ouvrage est attaqué dès le tome II. Le **7 février 1752**, le Conseil du roi interdit les deux premiers volumes à la suite d’une querelle de théologie. En **1759**, après le scandale du livre d’Helvétius, le **privilège** est révoqué le 8 mars, et le pape **Clément XIII** condamne l’ouvrage le 3 septembre : les acheteurs sont censés remettre leurs exemplaires à leur curé. D’Alembert a quitté l’entreprise l’année précédente ; Diderot continue seul, huit ans, sans salaire fixe. Il tient grâce à **Malesherbes**, directeur de la Librairie — le chef de la censure lui-même —, qui le prévient des perquisitions et lui propose de cacher ses manuscrits chez lui, où personne n’ira les chercher. Les dix derniers volumes de texte paraissent en **1765** sous une fausse adresse de Neuchâtel. Dernière blessure : Diderot découvre en 1764 que Le Breton faisait secrètement couper les passages les plus hardis sur les épreuves. Il ne s’en consolera pas.',
      },
      {
        titre: 'L’arme des renvois',
        texte:
          'Comment écrire ce qu’on ne peut pas écrire ? Diderot a trouvé un procédé : le **renvoi**. Un article parfaitement orthodoxe se termine par un « voyez aussi… » qui envoie le lecteur vers un autre mot, où l’idée se retourne. L’article « Anthropophages » renvoie à « Eucharistie » ; « Capuchon » traite gravement de la forme des cagoules de moines et conclut en renvoyant aux querelles de religion. Dans l’article « Encyclopédie », Diderot explique lui-même que les renvois peuvent servir à « attaquer, ébranler, renverser secrètement quelques opinions ridicules ». Le lecteur pressé ne voit rien ; le lecteur attentif comprend. C’est une manière de penser autant qu’une ruse : relier les savoirs les uns aux autres, c’est déjà refuser qu’un domaine échappe à l’examen.',
      },
      {
        titre: 'Qui la lisait',
        texte:
          'La première édition coûte près de **980 livres**, environ trois ans du salaire d’un ouvrier : on ne l’achète pas, on y **souscrit**, et il y a quatre mille souscripteurs. Mais des éditions moins chères suivent aussitôt — Genève, Lucques, Livourne, et surtout l’édition **in-quarto** de Neuchâtel, qui divise le prix par plus de deux. Au total, environ **24 000 exemplaires** circulent en Europe avant 1789. On les retrouve chez des avocats de province, des médecins, des curés, des officiers, des négociants — exactement ceux qui rédigeront les cahiers de doléances et siégeront aux États généraux. L’*Encyclopédie* n’a pas fait la Révolution : elle a donné un vocabulaire commun à ceux qui l’ont faite, et elle a montré qu’un livre pouvait tenir tête, pendant vingt et un ans, à l’Église, au Conseil du roi et au pape.',
      },
    ],
    consequences: [
      'Le savoir sort des académies : environ 24 000 exemplaires circulent en Europe avant 1789.',
      'Les métiers manuels entrent dans un livre savant grâce à 2 885 planches dessinées dans les ateliers.',
      'Le modèle de l’encyclopédie moderne est fixé : classement raisonné, auteurs multiples, renvois entre articles.',
      'Les idées des Lumières — examen critique, tolérance, origine du pouvoir — passent du salon à la province.',
      'La bataille menée contre la censure devient un argument pour la liberté d’écrire et d’imprimer.',
      'Elle fournit son vocabulaire à la génération qui rédigera les cahiers de doléances de 1789.',
    ],
    chiffres: [
      { valeur: '28', quoi: 'volumes, dont 11 de planches gravées' },
      { valeur: '71 800', quoi: 'articles environ' },
      { valeur: '17 000', quoi: 'articles écrits par le seul chevalier de Jaucourt' },
      { valeur: '980 livres', quoi: 'le prix de la collection, trois ans de salaire d’un ouvrier' },
    ],
    chrono: [
      { date: '1747', fait: 'Diderot et d’Alembert prennent la direction du projet.' },
      { date: 'novembre 1750', fait: 'Le *Prospectus* annonce la souscription.' },
      { date: 'juin 1751', fait: 'Tome I et *Discours préliminaire* de d’Alembert.' },
      { date: '7 février 1752', fait: 'Le Conseil du roi interdit les deux premiers tomes.' },
      { date: '1758', fait: 'D’Alembert quitte l’entreprise ; Diderot reste seul.' },
      { date: '8 mars 1759', fait: 'Le privilège est révoqué.' },
      { date: '3 septembre 1759', fait: 'Condamnation par le pape Clément XIII.' },
      { date: '1765', fait: 'Les dix derniers volumes de texte, sous fausse adresse.' },
      { date: '1772', fait: 'Parution du dernier volume de planches.' },
    ],
    leSaisTu:
      'Le chef de la censure a sauvé l’*Encyclopédie*. Prévenu qu’on allait perquisitionner chez Diderot, Malesherbes le fit avertir la veille. Diderot répondit qu’il n’aurait jamais le temps de déménager ses manuscrits. « Envoyez-les-moi », dit Malesherbes : personne n’irait fouiller chez le directeur de la Librairie.',
    aRetenir: [
      'L’*Encyclopédie* paraît de 1751 à 1772 sous la direction de Diderot et, jusqu’en 1758, de d’Alembert.',
      'Elle compte 28 volumes, environ 71 800 articles et 2 885 planches consacrées aux sciences, aux arts et aux métiers.',
      'Elle décrit les métiers manuels d’après les ateliers : c’est sa nouveauté la plus forte.',
      'Interdite en 1752, privée de privilège en 1759, condamnée par le pape, elle paraît malgré tout.',
      'Environ 24 000 exemplaires circulent en Europe avant 1789 et diffusent les idées des Lumières.',
    ],
    mots: [
      {
        mot: 'Lumières',
        sens: 'Mouvement de pensée du XVIIIᵉ siècle qui veut soumettre toute chose à l’examen de la raison.',
      },
      {
        mot: 'Privilège',
        sens: 'Autorisation royale d’imprimer et de vendre un livre : sans elle, l’ouvrage est interdit.',
      },
      {
        mot: 'Renvoi',
        sens: 'Lien d’un article vers un autre ; Diderot s’en sert aussi pour glisser des idées sous la censure.',
      },
      {
        mot: 'Souscription',
        sens: 'Achat payé d’avance, par versements, qui finance l’impression d’un ouvrage coûteux.',
      },
    ],
    lies: ['diderot', 'voltaire', 'rousseau', 'montesquieu'],
    niveaux: ['4e', '2de'],
    programme: 'L’Europe des Lumières',
    tags: [
      'Encyclopédie',
      'Diderot',
      'd’Alembert',
      'Lumières',
      'Jaucourt',
      'censure',
      'planches',
      'métiers',
      'Malesherbes',
      'XVIIIe siècle',
    ],
  },
  {
    id: 'guerre-d-independance-americaine',
    volet: 'evenements',
    nom: 'La guerre d’indépendance américaine',
    date: '1775 – 1783',
    tri: 1775,
    fin: 1783,
    periode: 'temps-modernes',
    emoji: '🦅',
    lieu: 'Les treize colonies, des Grands Lacs à la Floride',
    accroche:
      'Treize colonies se donnent une constitution et arrachent leur indépendance ; la France y envoie sa flotte et son armée, et l’emporte à Yorktown.',
    citations: [
      {
        texte:
          'Nous tenons ces vérités pour évidentes par elles-mêmes : tous les hommes sont créés égaux.',
        qui: 'La déclaration d’indépendance des États-Unis',
        contexte: 'Adoptée à Philadelphie le 4 juillet 1776, rédigée par Thomas Jefferson.',
        sens:
          'Pour la première fois, une idée des Lumières sert d’acte de naissance à un État. Elle ne vaudra pourtant pas pour les esclaves.',
      },
      {
        texte: 'Ô Dieu ! Tout est fini !',
        qui: 'Lord North, Premier ministre britannique',
        contexte:
          'En apprenant à Londres, le 25 novembre 1781, la capitulation de Cornwallis à Yorktown.',
      },
      {
        texte:
          'Dès que j’entendis parler de l’Amérique, je l’aimai ; dès que je sus qu’elle se battait pour la liberté, je brûlai du désir de verser mon sang pour elle.',
        qui: 'La Fayette',
        contexte:
          'Dans ses *Mémoires*, sur sa décision de partir en 1777, à dix-neuf ans, contre l’avis du roi.',
      },
      {
        texte: 'Le monde à l’envers.',
        qui: 'L’air joué par les musiciens de l’armée anglaise',
        contexte:
          'Reddition de Yorktown, 19 octobre 1781 : selon la tradition, les tambours anglais défilèrent sur *The World Turned Upside Down*.',
        sens:
          'Le détail vient de souvenirs écrits bien plus tard et n’est prouvé par aucun témoin du jour. Il dit pourtant l’effet produit en Europe.',
        incertaine: true,
      },
    ],
    reperes: [
      'La guerre commence le 19 avril 1775 par les coups de feu de Lexington et Concord, près de Boston.',
      'Le 4 juillet 1776, le Congrès de Philadelphie proclame l’indépendance des treize colonies.',
      'La victoire américaine de Saratoga (17 octobre 1777) décide la France à s’engager.',
      'Le traité d’alliance franco-américain est signé le 6 février 1778 ; Rochambeau débarque en 1780.',
      'À Yorktown, du 28 septembre au 19 octobre 1781, 8 000 Français assiègent Cornwallis avec Washington.',
      'Les traités de Paris et de Versailles, le 3 septembre 1783, reconnaissent les États-Unis.',
    ],
    causes: [
      'Londres veut faire payer aux colonies la dette de la guerre de Sept Ans : Stamp Act (1765), taxes Townshend (1767), Tea Act (1773).',
      'Les colons n’ont pas de députés au Parlement de Londres : « pas de taxation sans représentation ».',
      'La victoire anglaise de 1763 a chassé la France d’Amérique du Nord — les colonies n’ont plus besoin d’être protégées.',
      'Treize colonies riches et peuplées de deux millions et demi d’habitants, habituées à s’administrer par leurs assemblées.',
      'Les idées des Lumières et de Locke : le pouvoir vient du consentement, et un gouvernement injuste peut être renversé.',
      'La Boston Tea Party du 16 décembre 1773 et les « lois intolérables » de 1774, qui ferment le port de Boston.',
      'La volonté française de prendre sa revanche sur l’Angleterre après le traité de Paris de 1763.',
    ],
    recit: [
      {
        titre: 'Une guerre que les insurgents faillirent perdre',
        texte:
          'Le **19 avril 1775**, une colonne anglaise envoyée saisir les armes cachées à **Concord** est accrochée par les miliciens de **Lexington** : la guerre commence. Le Congrès nomme **George Washington** commandant en chef le 15 juin, et le **4 juillet 1776**, à Philadelphie, proclame l’indépendance. Militairement, les deux premières années sont mauvaises : l’armée anglaise, la meilleure d’Europe, prend New York, bat Washington plusieurs fois et occupe Philadelphie. L’armée continentale n’a ni uniformes, ni solde, ni discipline ; les engagements sont de quelques mois. Washington sauve tout en refusant la bataille décisive : il recule, harcèle, survit. La nuit de Noël **1776**, il repasse le Delaware sur les glaces et surprend les mercenaires allemands à **Trenton** — une petite affaire qui relance tout. L’hiver suivant, à **Valley Forge**, un quart de l’armée meurt de froid et de faim pendant que le Prussien **von Steuben** apprend enfin la manœuvre aux survivants.',
      },
      {
        titre: 'Saratoga fait entrer la France',
        texte:
          'Le **17 octobre 1777**, à **Saratoga**, toute une armée anglaise, celle du général Burgoyne, capitule : sept mille hommes. C’est la première grande victoire américaine, et elle change la nature de la guerre. À Paris, **Benjamin Franklin**, envoyé du Congrès depuis 1776, y trouve l’argument qui lui manquait : les insurgents peuvent gagner. Le **6 février 1778**, la France signe avec eux un traité de commerce et un traité d’**alliance**. L’Espagne suit en 1779, les Provinces-Unies en 1780 : l’Angleterre se retrouve seule contre l’Europe, de la Manche aux Antilles et jusqu’aux Indes. Des Français étaient déjà partis à titre privé — **La Fayette**, dix-neuf ans, avait acheté un navire et quitté la France malgré une interdiction royale, pour être blessé à Brandywine en septembre 1777. En juillet **1780**, c’est une armée régulière qui débarque à Newport : six mille hommes sous les ordres du comte de **Rochambeau**.',
      },
      {
        titre: 'Yorktown : trois semaines qui finissent la guerre',
        texte:
          'En 1781, l’Anglais **Cornwallis** conduit la campagne du Sud et s’installe avec huit mille hommes à **Yorktown**, en Virginie, dos à la mer — une position tenable tant que la flotte anglaise commande la baie. Washington et Rochambeau prennent alors le risque de leur vie : ils quittent le nord et marchent huit cents kilomètres vers le sud, pendant que l’amiral de **Grasse** remonte des Antilles avec vingt-huit vaisseaux. Le **5 septembre 1781**, au large des caps de Virginie, de Grasse bat l’escadre anglaise de Graves et **ferme la baie de Chesapeake** : Cornwallis est enfermé. Le siège commence le **28 septembre**. Vingt mille assiégeants, dont **huit mille Français**, creusent les tranchées ; l’artillerie de siège, débarquée des vaisseaux, écrase les défenses. La nuit du **14 octobre**, deux redoutes sont enlevées à la baïonnette — la n° 10 par les Américains d’Hamilton, la n° 9 par les grenadiers français de Guillaume de Deux-Ponts. Le **19 octobre 1781**, l’armée anglaise sort et dépose les armes. Cornwallis, se disant malade, envoie le général O’Hara présenter son épée : O’Hara la tend à Rochambeau, qui désigne Washington, qui la fait remettre à son propre second. Jusque dans la reddition, chacun tient son rang.',
      },
      {
        titre: 'Ce que disent les traités',
        texte:
          'Yorktown ne finit pas la guerre sur le papier, mais il la finit en fait : le cabinet de **lord North** tombe en mars 1782 et Londres ouvre les négociations. La mer, elle, n’a pas dit son dernier mot : le **12 avril 1782**, aux **Saintes**, l’amiral Rodney bat et capture de Grasse — l’Angleterre garde la maîtrise de l’Atlantique et pèse à la table. Le **3 septembre 1783** sont signés le **traité de Paris**, entre les États-Unis et la Grande-Bretagne, et les **traités de Versailles**, entre la Grande-Bretagne, la France et l’Espagne. Les États-Unis sont reconnus indépendants, avec une frontière poussée jusqu’au **Mississippi**. La France récupère **Tobago**, **Saint-Louis du Sénégal** et ses droits de pêche à Terre-Neuve : elle ne reprend ni le Canada ni la Louisiane. Elle a gagné la guerre et n’a presque rien gagné à la paix.',
      },
      {
        titre: 'Ce que la France y a gagné, et ce qu’elle y a perdu',
        texte:
          'Le prestige est immense : la France a battu l’Angleterre et fait naître un État. Le prix l’est aussi — plus d’un milliard de livres, entièrement empruntés, une dette qui absorbera bientôt la moitié des recettes du royaume : c’est l’objet de la fiche « **La faillite du royaume** », et c’est de là que part 1789. Il y a plus discret et plus lourd encore. Des officiers français — La Fayette, Rochambeau, les frères de Noailles, Ségur, Berthier — sont rentrés d’Amérique avec une idée neuve dans la tête : un peuple peut se donner une **constitution**, élire ses gouvernants, écrire ses droits. La **déclaration des droits de Virginie** (juin 1776) et la déclaration d’indépendance sont lues et traduites à Paris ; on les retrouvera, en 1789, dans les débats de l’Assemblée. Reste une ombre que la déclaration n’efface pas : dans le pays qui proclame que « tous les hommes sont créés égaux » vivent alors **cinq cent mille esclaves**, et l’indépendance ne les libère pas.',
      },
    ],
    consequences: [
      'Naissance des États-Unis : indépendance reconnue le 3 septembre 1783, Constitution en 1787, Washington président en 1789.',
      'La Grande-Bretagne perd treize colonies mais garde le Canada et la maîtrise des mers après Les Saintes (1782).',
      'La France gagne Tobago et Saint-Louis du Sénégal, un prestige considérable — et une dette qui la ruine.',
      'Les officiers revenus d’Amérique rapportent l’idée qu’un peuple peut se donner une constitution.',
      'La déclaration d’indépendance et la déclaration de Virginie servent de modèles aux textes de 1789.',
      'L’esclavage n’est pas aboli : cinq cent mille esclaves vivent dans le pays qui proclame l’égalité des hommes.',
    ],
    chiffres: [
      { valeur: '13', quoi: 'colonies révoltées contre Londres' },
      { valeur: '8 ans', quoi: 'de guerre, de Lexington aux traités de 1783' },
      { valeur: '8 000', quoi: 'soldats anglais prisonniers à Yorktown' },
      { valeur: '19 ans', quoi: 'l’âge de La Fayette à son arrivée en Amérique' },
    ],
    chrono: [
      { date: '19 avril 1775', fait: 'Premiers coups de feu à Lexington et Concord.' },
      { date: '15 juin 1775', fait: 'Washington nommé commandant en chef.' },
      { date: '4 juillet 1776', fait: 'Déclaration d’indépendance à Philadelphie.' },
      { date: '17 octobre 1777', fait: 'Capitulation anglaise à Saratoga.' },
      { date: '6 février 1778', fait: 'Traité d’alliance entre la France et les insurgents.' },
      { date: 'juillet 1780', fait: 'Rochambeau débarque à Newport avec 6 000 hommes.' },
      { date: '5 septembre 1781', fait: 'De Grasse ferme la baie de Chesapeake.' },
      { date: '19 octobre 1781', fait: 'Capitulation de Cornwallis à Yorktown.' },
      { date: '12 avril 1782', fait: 'Défaite navale française aux Saintes.' },
      { date: '3 septembre 1783', fait: 'Traités de Paris et de Versailles.' },
    ],
    leSaisTu:
      'La Fayette avait dix-neuf ans, aucune expérience de la guerre, et une interdiction formelle de partir. Il acheta lui-même un navire, *La Victoire*, embarqua depuis l’Espagne et débarqua en Caroline du Sud en juin 1777. Le Congrès le fit major général. Il servit sans solde, paya ses hommes de sa poche, et commanda l’une des divisions de Yorktown à vingt-quatre ans.',
    aRetenir: [
      'La guerre d’indépendance américaine dure de 1775 à 1783 entre treize colonies et la Grande-Bretagne.',
      'La déclaration d’indépendance est adoptée le 4 juillet 1776 à Philadelphie.',
      'La victoire de Saratoga (1777) décide la France à signer l’alliance du 6 février 1778.',
      'Yorktown (19 octobre 1781) est une victoire franco-américaine : de Grasse ferme la baie, Rochambeau et Washington assiègent Cornwallis.',
      'Les traités du 3 septembre 1783 reconnaissent les États-Unis ; la France y ruine ses finances.',
    ],
    mots: [
      {
        mot: 'Insurgents',
        sens: 'Nom donné en France aux colons américains révoltés contre le roi d’Angleterre.',
      },
      {
        mot: 'Minutemen',
        sens: 'Miliciens des colonies censés prendre les armes en une minute : ceux de Lexington en 1775.',
      },
      {
        mot: 'Redoute',
        sens: 'Petit ouvrage fortifié isolé ; celles de Yorktown furent enlevées à la baïonnette.',
      },
      {
        mot: 'Capitulation',
        sens: 'Acte par lequel une armée assiégée se rend à des conditions négociées.',
      },
    ],
    lies: [
      'la-fayette',
      'george-washington',
      'benjamin-franklin',
      'crise-financiere-de-la-monarchie',
      'louis-xvi',
    ],
    niveaux: ['4e', '2de'],
    programme: 'L’Europe des Lumières',
    tags: [
      'guerre d’Amérique',
      'indépendance américaine',
      'Yorktown',
      'Washington',
      'La Fayette',
      'Rochambeau',
      'de Grasse',
      'Saratoga',
      'insurgents',
      '1776',
      'traité de Paris',
    ],
  },
]
