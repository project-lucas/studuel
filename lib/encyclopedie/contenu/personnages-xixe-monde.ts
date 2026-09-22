// -----------------------------------------------------------------------------
// XIXᵉ SIÈCLE — le monde hors de France : Bolívar, Lincoln, Darwin, Bismarck,
// Victoria, Louise Michel, Jaurès.
//
// Sept fiches pour le siècle qui invente presque tout ce dont l'élève hérite :
// les nations (Bolívar, Bismarck), l'abolition (Lincoln), la machine et
// l'empire (Victoria), la science qui déplace la place de l'homme (Darwin), et
// la question sociale — la barricade (Louise Michel) et le bulletin de vote
// (Jaurès). Elles se lisent séparément ; elles se répondent.
//
// Le lot suit le patron de `personnages-moyen-age-rois.ts` : la citation
// d'abord, des repères qu'on lit en trente secondes, un récit dense, une
// frise, une anecdote, ce qui tombe au contrôle. Guide : `docs/encyclopedie.md`.
// -----------------------------------------------------------------------------

import type { Personnage } from '../types'

export const PERSONNAGES_XIXE_MONDE: Personnage[] = [
  {
    id: 'simon-bolivar',
    volet: 'personnages',
    nom: 'Simón Bolívar',
    surnom: 'el Libertador',
    dates: '1783 – 1830',
    tri: 1830,
    periode: 'xixe',
    emoji: '🐎',
    roles: ['Général', 'Libérateur de l’Amérique du Sud', 'Président de la Grande Colombie'],
    origine: 'Caracas, Venezuela',
    accroche:
      'Il arrache six pays à l’Espagne, rêve d’une Amérique du Sud unie, et meurt à quarante-sept ans en disant avoir labouré la mer.',
    citations: [
      {
        texte: 'J’ai labouré la mer.',
        contexte:
          'Lettre au général Juan José Flores, le 9 novembre 1830, un mois avant sa mort, alors que la Grande Colombie se disloque.',
        sens:
          'Tout ce qu’il a bâti se défait derrière lui : les pays qu’il a libérés se déchirent, et il juge son œuvre effacée comme un sillon dans l’eau.',
      },
      {
        texte: 'Pour nous, la patrie, c’est l’Amérique.',
        contexte:
          'Lettre de Jamaïque, écrite à Kingston le 6 septembre 1815, en exil, où il dessine l’avenir des colonies espagnoles révoltées.',
        sens:
          'Il ne se bat pas pour le Venezuela seul : il veut que les anciennes colonies espagnoles se pensent comme une seule nation continentale.',
      },
      {
        texte: 'Un peuple ignorant est l’instrument aveugle de sa propre destruction.',
        contexte:
          'Discours d’Angostura, le 15 février 1819, devant le congrès qui va fonder la Grande Colombie.',
        sens:
          'Sans écoles, dit-il, un peuple libéré se donnera de lui-même un nouveau maître : l’instruction est la condition de la liberté.',
      },
      {
        texte:
          'Je jure que je n’accorderai de repos à mon bras ni de répit à mon âme avant d’avoir brisé les chaînes qui nous oppriment.',
        contexte:
          'Serment du Mont Sacré, à Rome, le 15 août 1805, devant son précepteur Simón Rodríguez. Il a vingt-deux ans.',
      },
    ],
    reperes: [
      'Fils d’une riche famille créole de Caracas, orphelin à neuf ans, élevé par un précepteur nourri des Lumières.',
      'Serment du Mont Sacré, à Rome, en 1805 : il jure de libérer l’Amérique espagnole.',
      'Traversée des Andes en 1819 : 2 500 hommes franchissent des cols à 4 000 mètres et surgissent derrière l’ennemi.',
      'Six pays actuels sont nés de ses campagnes : Venezuela, Colombie, Panama, Équateur, Pérou et Bolivie.',
      'Président de la Grande Colombie de 1819 à 1830, un État qui se disloque de son vivant.',
      'Mort de la tuberculose à Santa Marta le 17 décembre 1830, à quarante-sept ans.',
    ],
    recit: [
      {
        titre: 'Un héritier très riche et très seul',
        texte:
          'Simón Bolívar naît en 1783 à **Caracas** dans une des plus grosses fortunes de la colonie : mines, plantations, esclaves. Il est **créole**, c’est-à-dire descendant d’Espagnols né en Amérique — riche, instruit, et pourtant écarté des postes de gouvernement, réservés aux Espagnols venus de la péninsule. Orphelin à neuf ans, il est confié à un précepteur hors du commun, **Simón Rodríguez**, disciple de Rousseau, qui lui fait lire les Lumières et marcher pieds nus dans la montagne. Marié à dix-huit ans, veuf à dix-neuf, il repart en Europe, voit **Napoléon** se couronner empereur à Paris — le spectacle le dégoûte et le fascine à la fois — et monte en 1805 sur le mont Aventin, à Rome, pour y jurer de libérer son continent.',
      },
      {
        titre: 'Quinze ans de guerre, de la mer aux Andes',
        texte:
          'L’occasion vient d’Europe : en 1808, **Napoléon** dépose le roi d’Espagne et met son frère sur le trône. Les colonies refusent d’obéir à ce roi-là et se gouvernent elles-mêmes. Le Venezuela se déclare indépendant en 1811 ; la république s’effondre deux fois, et Bolívar doit fuir. Réfugié en **Haïti**, il obtient des armes du président **Alexandre Pétion** en échange d’une promesse : abolir l’esclavage dans les terres qu’il libérera. Il tient parole. En **1819**, il tente l’impossible : au lieu d’attaquer par la côte, il traverse les plaines inondées puis les **Andes**, à 4 000 mètres, avec 2 500 hommes mal vêtus dont un quart meurt en route — et tombe dans le dos des Espagnols. Victoire de **Boyacá**, le 7 août : la Nouvelle-Grenade est libre en un seul jour. Suivront **Carabobo** (1821) pour le Venezuela, **Pichincha** (1822) pour l’Équateur, enfin **Junín** et **Ayacucho** (1824), où son lieutenant **Sucre** achève l’empire espagnol d’Amérique continentale.',
      },
      {
        titre: 'La Grande Colombie, un rêve trop grand',
        texte:
          'Bolívar ne veut pas d’une poussière de républiques. Au congrès d’**Angostura**, en 1819, il fonde la **Grande Colombie** : Venezuela, Colombie, Panama et bientôt Équateur réunis en un seul État, dont il est le président. En 1826, il convoque à **Panama** un congrès de toutes les nations américaines — l’ancêtre lointain de leurs organisations d’aujourd’hui. Mais le continent est immense, sans routes, et chaque région a son chef de guerre, son **caudillo**, qui préfère commander chez lui. Le Venezuela de Páez fait sécession, le Pérou se détache, un complot tente de l’assassiner à Bogotá dans la nuit du 25 septembre 1828 — sa compagne **Manuela Sáenz** le fait sauter par la fenêtre et gagne le surnom de « libératrice du Libertador ». Il gouverne alors en dictateur pour tenir l’ensemble, et se fait haïr de ceux-là mêmes qu’il avait libérés.',
      },
      {
        titre: 'La mer labourée',
        texte:
          'En avril 1830, épuisé, tuberculeux, il démissionne et prend la route de la côte pour s’exiler en Europe. Il n’ira pas : il meurt le **17 décembre 1830** dans une maison prêtée près de **Santa Marta**, à quarante-sept ans, si pauvre qu’on l’enterre dans une chemise empruntée. Un mois plus tôt, il avait écrit sa phrase la plus amère : « J’ai labouré la mer. » Elle était injuste. Les pays qu’il avait arrachés à l’Espagne ne sont jamais redevenus des colonies, l’esclavage y a reculé, et son nom est resté partout : sur un pays entier, la **Bolivie**, sur des monnaies, des places et des milliers d’écoles. Deux siècles plus tard, on l’appelle encore, dans toute l’Amérique latine, **el Libertador** — le Libérateur.',
      },
    ],
    chrono: [
      { date: '24 juillet 1783', fait: 'Naissance à Caracas, au Venezuela.' },
      { date: '15 août 1805', fait: 'Serment du Mont Sacré, à Rome.' },
      { date: '1813', fait: 'Campagne admirable : il entre à Caracas, on le nomme Libertador.' },
      { date: '6 septembre 1815', fait: 'Lettre de Jamaïque, écrite en exil.' },
      { date: '7 août 1819', fait: 'Traversée des Andes et victoire de Boyacá.' },
      { date: '1819', fait: 'Le congrès d’Angostura fonde la Grande Colombie.' },
      { date: '24 juin 1821', fait: 'Carabobo : le Venezuela est libre.' },
      { date: '9 décembre 1824', fait: 'Ayacucho : fin de l’empire espagnol d’Amérique.' },
      { date: '1825', fait: 'Le Haut-Pérou libéré prend le nom de Bolivie.' },
      { date: '17 décembre 1830', fait: 'Mort à Santa Marta, ruiné et malade.' },
    ],
    leSaisTu:
      'La Bolivie est le seul pays au monde à porter le nom d’un homme encore vivant au moment du baptême. En 1825, le congrès de Chuquisaca décide d’appeler « république de Bolívar » le Haut-Pérou libéré. Le Libertador, gêné, suggéra d’en rester là ; on se contenta de transformer le nom en Bolivie.',
    aRetenir: [
      'Simón Bolívar, dit el Libertador, mène l’indépendance de l’Amérique du Sud contre l’Espagne de 1810 à 1824.',
      'La traversée des Andes et la victoire de Boyacá, le 7 août 1819, libèrent la Nouvelle-Grenade, future Colombie.',
      'Le congrès d’Angostura fonde en 1819 la Grande Colombie, dont il est président jusqu’en 1830.',
      'Les victoires de Junín et d’Ayacucho, en 1824, mettent fin à l’empire espagnol d’Amérique continentale.',
      'La Grande Colombie éclate de son vivant ; il meurt ruiné à Santa Marta le 17 décembre 1830.',
    ],
    mots: [
      {
        mot: 'Créole',
        sens: 'Descendant d’Européens né en Amérique : riche et instruit, mais écarté des hautes charges, réservées aux Espagnols venus de la péninsule.',
      },
      {
        mot: 'Vice-royauté',
        sens: 'Immense province d’Amérique gouvernée au nom du roi d’Espagne par un vice-roi.',
      },
      {
        mot: 'Caudillo',
        sens: 'Chef militaire qui gouverne une région par son prestige et son armée plutôt que par la loi.',
      },
    ],
    lies: [
      'toussaint-louverture',
      'la-fayette',
      'guerre-d-independance-americaine',
      'napoleon-bonaparte',
    ],
    niveaux: ['4e'],
    programme: 'L’Europe et le monde au XIXᵉ siècle : nations, libertés et révolutions',
    tags: [
      'Libertador',
      'Venezuela',
      'Colombie',
      'Bolivie',
      'Andes',
      'Boyacá',
      'Ayacucho',
      'Grande Colombie',
      'indépendance',
      'Amérique du Sud',
      'Bolivar',
    ],
  },
  {
    id: 'abraham-lincoln',
    volet: 'personnages',
    nom: 'Abraham Lincoln',
    surnom: 'l’homme de la cabane de rondins',
    dates: '1809 – 1865',
    tri: 1865,
    periode: 'xixe',
    emoji: '🎩',
    roles: ['Président des États-Unis', 'Avocat', 'Chef de guerre'],
    origine: 'Comté de Hardin, Kentucky',
    accroche:
      'Né dans une cabane de rondins, il devient président, tient l’Union pendant quatre ans de guerre et abolit l’esclavage — avant d’être tué dans un théâtre.',
    citations: [
      {
        texte:
          'Que le gouvernement du peuple, par le peuple, pour le peuple, ne disparaisse pas de la terre.',
        contexte:
          'Dernière phrase du discours de Gettysburg, le 19 novembre 1863, sur le champ de bataille transformé en cimetière national.',
        sens:
          'Il redéfinit l’enjeu de la guerre : on ne se bat pas pour un territoire, mais pour prouver qu’un peuple peut se gouverner lui-même.',
      },
      {
        texte: 'Une maison divisée contre elle-même ne peut pas tenir debout.',
        contexte:
          'Discours de Springfield, le 16 juin 1858, devant les républicains de l’Illinois qui viennent de le désigner candidat au Sénat.',
        sens:
          'Les États-Unis ne pourront pas rester moitié esclavagistes et moitié libres : il faudra bien que l’un des deux l’emporte.',
      },
      {
        texte: 'Si l’esclavage n’est pas un mal, alors rien n’est un mal.',
        contexte: 'Lettre à Albert Hodges, rédacteur d’un journal du Kentucky, le 4 avril 1864.',
      },
      {
        texte:
          'Sans malveillance envers personne, avec charité pour tous, efforçons-nous de panser les blessures de la nation.',
        contexte:
          'Second discours d’investiture, le 4 mars 1865, six semaines avant son assassinat, alors que la victoire du Nord est certaine.',
        sens:
          'Il refuse d’avance la vengeance : les États du Sud vaincus devront être réintégrés, pas punis.',
      },
    ],
    reperes: [
      'Né en 1809 dans une cabane de rondins du Kentucky ; moins d’un an d’école en tout, et des livres empruntés.',
      'Bûcheron, batelier, épicier, arpenteur, puis avocat sans avoir jamais suivi de faculté de droit.',
      'Élu président en novembre 1860 : onze États du Sud font sécession avant même son entrée en fonction.',
      'Proclamation d’émancipation le 1ᵉʳ janvier 1863 : les esclaves des États rebelles sont déclarés libres.',
      'Discours de Gettysburg, le 19 novembre 1863 : 272 mots, deux minutes.',
      'Assassiné le 14 avril 1865 au théâtre Ford, cinq jours après la reddition du Sud.',
    ],
    recit: [
      {
        titre: 'De la cabane au barreau',
        texte:
          'Abraham Lincoln naît en **1809** dans une cabane d’une seule pièce, au fond du **Kentucky**, dans une famille de défricheurs illettrés. Sa mère meurt quand il a neuf ans. Il aura, toute sa vie, additionné **moins d’un an de classe** : tout le reste, il l’apprend seul, à la lueur du feu, dans les quelques livres qu’on lui prête — la Bible, Shakespeare, une grammaire, un traité de géométrie qu’il recopie. Bûcheron, batelier sur le Mississippi, épicier ruiné, arpenteur, il se présente aux élections locales, lit le droit dans son coin et devient **avocat** en Illinois sans avoir jamais mis les pieds dans une faculté. C’est le **Kansas-Nebraska Act** de 1854, qui autorise l’esclavage à s’étendre vers l’ouest, qui le ramène à la politique. En 1858, ses sept débats publics contre le sénateur **Stephen Douglas** font de lui une figure nationale : il perd l’élection et gagne le pays.',
      },
      {
        titre: 'Élu, et le pays se casse',
        texte:
          'En novembre **1860**, Lincoln est élu président avec moins de 40 % des voix : dans dix États du Sud, son nom ne figurait même pas sur les bulletins. Le Sud vit du **coton**, et le coton vit de **quatre millions d’esclaves** sur une population de trente et un millions d’Américains. Lincoln ne promet pas d’abolir l’esclavage là où il existe — il promet de l’empêcher de s’étendre, ce qui suffit à condamner le système à terme. La **Caroline du Sud** fait sécession dès le 20 décembre 1860, dix autres États suivent et forment les **États confédérés d’Amérique**. Le 12 avril 1861, les canons du Sud tirent sur le fort Sumter : la **guerre de Sécession** commence. Elle durera quatre ans et fera environ **620 000 morts** — plus que toutes les autres guerres américaines réunies.',
      },
      {
        titre: 'La proclamation d’émancipation',
        texte:
          'Au début, Lincoln dit se battre pour l’**Union**, pas contre l’esclavage : « Si je pouvais sauver l’Union sans libérer un seul esclave, je le ferais », écrit-il en août 1862 — parce qu’il a besoin des États esclavagistes restés fidèles. Puis la guerre s’éternise et il change d’arme. Après la bataille d’Antietam, il annonce que le **1ᵉʳ janvier 1863**, tous les esclaves des États en rébellion seront « libres à jamais ». La mesure a ses limites : elle ne s’applique qu’aux territoires ennemis, donc là où Washington ne commande pas. Mais elle change tout. La guerre devient une **guerre d’émancipation**, l’Europe ne peut plus soutenir le Sud, et près de **180 000 soldats noirs** s’engagent dans l’armée de l’Union. Chaque avancée nordiste libère désormais réellement des hommes.',
      },
      {
        titre: 'Gettysburg, deux minutes',
        texte:
          'Du 1ᵉʳ au 3 juillet 1863, la plus grande bataille jamais livrée sur le sol américain s’achève à **Gettysburg**, en Pennsylvanie : l’invasion du Nord est brisée, au prix de 50 000 tués, blessés et disparus. Quatre mois plus tard, on inaugure le cimetière militaire. L’orateur officiel parle deux heures. Puis Lincoln se lève et prononce **272 mots**. Il ne cite aucun général, aucune bataille : il dit que la nation est née d’une idée — que tous les hommes sont créés égaux —, que les morts du champ l’ont défendue, et que les vivants doivent achever leur tâche, pour que « le gouvernement du peuple, par le peuple, pour le peuple, ne disparaisse pas de la terre ». Ces deux minutes sont devenues le texte le plus récité de l’histoire américaine.',
      },
      {
        titre: 'Le XIIIᵉ amendement, puis le théâtre Ford',
        texte:
          'Réélu en novembre 1864, Lincoln veut graver l’abolition dans la loi, là où aucune décision de guerre ne pourra la défaire : il lui faut un **amendement à la Constitution**. Le 31 janvier 1865, après une bataille de voix menée maison par maison, la Chambre des représentants vote le **XIIIᵉ amendement**, qui interdit l’esclavage partout aux États-Unis ; il sera ratifié en décembre. Le 9 avril, le général **Lee** capitule à Appomattox : la guerre est finie. Cinq jours plus tard, le vendredi **14 avril 1865**, Lincoln assiste à une comédie au **théâtre Ford** de Washington. Un acteur sudiste, **John Wilkes Booth**, entre dans la loge et lui tire une balle dans la nuque. Le président meurt le lendemain matin. Son train funéraire traverse sept États pendant treize jours ; des centaines de milliers d’Américains attendent sur les voies.',
      },
    ],
    chrono: [
      { date: '12 février 1809', fait: 'Naissance dans une cabane de rondins du Kentucky.' },
      { date: '1858', fait: 'Débats avec Douglas : « une maison divisée ».' },
      { date: '6 novembre 1860', fait: 'Élu président des États-Unis.' },
      { date: '12 avril 1861', fait: 'Fort Sumter : la guerre de Sécession commence.' },
      { date: '1ᵉʳ janvier 1863', fait: 'Proclamation d’émancipation.' },
      { date: '19 novembre 1863', fait: 'Discours de Gettysburg, en 272 mots.' },
      { date: '31 janvier 1865', fait: 'Le Congrès vote le XIIIᵉ amendement.' },
      { date: '9 avril 1865', fait: 'Reddition du général Lee à Appomattox.' },
      { date: '14 avril 1865', fait: 'Assassiné au théâtre Ford, à Washington.' },
      { date: 'décembre 1865', fait: 'Le XIIIᵉ amendement est ratifié : l’esclavage est aboli.' },
    ],
    leSaisTu:
      'À Gettysburg, la vedette était Edward Everett, le meilleur orateur du pays : il parla deux heures. Lincoln vint après, dit ses 272 mots en deux minutes et se rassit persuadé d’avoir échoué. Everett lui écrivit le lendemain : « Je serais heureux d’avoir approché en deux heures de l’idée centrale de cette cérémonie comme vous l’avez fait en deux minutes. »',
    aRetenir: [
      'Abraham Lincoln est élu président des États-Unis en novembre 1860 ; onze États esclavagistes du Sud font sécession.',
      'La guerre de Sécession oppose l’Union au Sud de 1861 à 1865 et fait environ 620 000 morts.',
      'La proclamation d’émancipation du 1ᵉʳ janvier 1863 déclare libres les esclaves des États rebelles.',
      'Le discours de Gettysburg, le 19 novembre 1863, définit la démocratie : « le gouvernement du peuple, par le peuple, pour le peuple ».',
      'Le XIIIᵉ amendement, voté en janvier 1865 et ratifié en décembre, abolit l’esclavage dans tous les États-Unis.',
      'Lincoln est assassiné le 14 avril 1865, cinq jours après la reddition du général Lee.',
    ],
    mots: [
      {
        mot: 'Sécession',
        sens: 'Séparation d’une partie d’un État qui décide de ne plus lui appartenir.',
      },
      {
        mot: 'Amendement',
        sens: 'Modification ajoutée à la Constitution des États-Unis : il faut les deux tiers du Congrès, puis les trois quarts des États.',
      },
      {
        mot: 'Émancipation',
        sens: 'Acte qui rend libre une personne tenue en esclavage ou placée sous l’autorité d’un autre.',
      },
    ],
    lies: [
      'guerre-de-secession',
      'victor-schoelcher',
      'abolition-de-l-esclavage-1848',
      'traite-atlantique-et-code-noir',
      'martin-luther-king',
    ],
    niveaux: ['4e'],
    programme: 'Traites, esclavages et abolitions au XIXᵉ siècle',
    tags: [
      'Lincoln',
      'États-Unis',
      'guerre de Sécession',
      'esclavage',
      'Gettysburg',
      'émancipation',
      'Nord et Sud',
      'amendement',
      'théâtre Ford',
      'Union',
      'Amérique',
    ],
  },
  {
    id: 'charles-darwin',
    volet: 'personnages',
    nom: 'Charles Darwin',
    surnom: 'le naturaliste du Beagle',
    dates: '1809 – 1882',
    tri: 1882,
    periode: 'xixe',
    emoji: '🐢',
    roles: ['Naturaliste', 'Géologue', 'Auteur de L’Origine des espèces'],
    origine: 'Shrewsbury, Angleterre',
    accroche:
      'Cinq ans de voyage autour du monde, vingt ans de doute et un livre : les espèces ne sont pas fixes, elles se transforment.',
    citations: [
      {
        texte:
          'Des formes sans fin, infiniment belles et admirables, sont nées et naissent encore à partir d’un début si simple.',
        contexte:
          'Dernière phrase de L’Origine des espèces, publié le 24 novembre 1859 après vingt ans de travail.',
        sens:
          'Il termine son livre par un émerveillement : l’immense variété du vivant vient d’un petit nombre de formes de départ.',
      },
      {
        texte:
          'Ce ne sont pas les plus forts qui survivent, mais ceux qui s’adaptent le mieux au changement.',
        contexte:
          'Phrase attribuée à Darwin depuis les années 1960, reprise dans des manuels, des discours et des publicités.',
        sens:
          'Darwin n’a jamais écrit cela. La formule vient d’un professeur américain, Leon Megginson, qui résumait à sa façon L’Origine des espèces en 1963.',
        incertaine: true,
      },
      {
        texte:
          'J’appelle sélection naturelle cette conservation des variations favorables et cette élimination des variations nuisibles.',
        contexte: 'L’Origine des espèces, chapitre IV, 1859.',
        sens:
          'La nature ne choisit pas : elle trie. Ce qui aide à survivre et à se reproduire se transmet, le reste disparaît.',
      },
      {
        texte: 'C’est comme confesser un meurtre.',
        contexte:
          'Lettre au botaniste Joseph Hooker, le 11 janvier 1844, quand il lui avoue enfin penser que les espèces ne sont pas fixes.',
        sens:
          'Il mesure le scandale à venir : dire que les espèces changent, c’est contredire ce que tout son monde tient pour acquis depuis toujours.',
      },
    ],
    reperes: [
      'Fils de médecin, il abandonne la médecine à Édimbourg, puis la théologie à Cambridge, pour la chasse aux insectes.',
      'Embarqué à vingt-deux ans sur le Beagle : cinq ans de tour du monde, de 1831 à 1836.',
      'Aux Galápagos, il observe des animaux très proches mais différents d’une île à l’autre.',
      'Il attend vingt ans avant de publier, et ne s’y décide que menacé d’être devancé.',
      'L’Origine des espèces paraît le 24 novembre 1859 : les 1 250 exemplaires partent en un jour.',
      'Enterré à l’abbaye de Westminster, à quelques mètres de Newton.',
    ],
    recit: [
      {
        titre: 'Un étudiant qui préfère les scarabées',
        texte:
          'Charles Darwin naît en **1809** à Shrewsbury, dans une famille aisée de médecins et d’industriels. Son père l’envoie étudier la **médecine** à Édimbourg : il s’enfuit de la salle d’opération, où l’on charcute sans anesthésie. On le destine alors à devenir **pasteur** de campagne, à Cambridge — et il y passe surtout son temps à collectionner des coléoptères et à suivre le botaniste **John Henslow**. C’est Henslow qui, en 1831, lui fait proposer une place à bord du *HMS Beagle*, un navire chargé de cartographier les côtes d’Amérique du Sud : le capitaine **FitzRoy** cherche un gentleman naturaliste pour partager sa table. Le père de Darwin refuse, jugeant l’affaire ridicule ; un oncle plaide la cause du garçon et emporte la décision. Darwin a vingt-deux ans et va être absent cinq ans.',
      },
      {
        titre: 'Cinq ans autour du monde',
        texte:
          'Le *Beagle* appareille le 27 décembre 1831. Darwin aura le **mal de mer** pendant presque tout le voyage, mais il descend à terre dès qu’il le peut : forêt du Brésil, plaines de Patagonie où il déterre des **fossiles** de mammifères géants ressemblant aux paresseux et aux tatous vivants d’aujourd’hui, Andes où il trouve des coquillages à 4 000 mètres, tremblement de terre du Chili qui soulève la côte sous ses pieds. Il lit à bord la *Géologie* de **Charles Lyell** et en retient une idée neuve : la Terre est très ancienne, et de petites causes, répétées très longtemps, produisent d’énormes effets. En septembre 1835, le navire mouille cinq semaines aux **Galápagos**, un archipel volcanique du Pacifique. Le vice-gouverneur lui dit une chose qu’il note sans y croire : on reconnaît l’île d’où vient une **tortue** rien qu’à la forme de sa carapace.',
      },
      {
        titre: 'Les pinsons, et vingt ans de silence',
        texte:
          'De retour en 1836, Darwin confie ses oiseaux des Galápagos à l’ornithologue **John Gould**. Le verdict tombe en 1837 : ce ne sont pas des espèces variées d’oiseaux différents, mais **treize espèces de pinsons** très proches, distinctes d’une île à l’autre, dont les becs ne diffèrent que par la taille et la forme — un bec épais pour casser les graines dures, un bec fin pour les insectes. Une seule espèce venue du continent s’est donc divisée. Reste à comprendre comment. En 1838, il lit l’économiste **Malthus** : il naît toujours plus d’individus que le milieu ne peut en nourrir. Le mécanisme lui apparaît d’un coup. Et il se tait. Il écrit un résumé en 1844, le range dans un tiroir avec une lettre demandant à sa femme de le publier s’il mourait, puis passe **huit ans à disséquer des balanes** et à élever des pigeons. Ce qui le décide, en 1858, c’est une lettre : un jeune naturaliste, **Alfred Russel Wallace**, lui envoie depuis l’Indonésie exactement la même idée.',
      },
      {
        titre: 'Ce que dit vraiment la sélection naturelle',
        texte:
          'L’idée tient en quatre constats. **Un** : au sein d’une même espèce, les individus ne sont pas identiques — taille, couleur, résistance, tout varie un peu. **Deux** : ces différences se transmettent en partie aux descendants. **Trois** : il naît beaucoup plus d’individus qu’il n’en survit, donc il y a concurrence pour la nourriture, l’espace et la reproduction. **Quatre** : ceux dont les variations sont utiles dans **ce** milieu-là survivent un peu plus souvent et laissent plus de descendants. Génération après génération, la variation utile se répand et l’espèce se transforme. Personne ne décide, rien ne vise un but : c’est un **tri**, pas un choix — et le mot « sélection » ne doit pas tromper. Darwin ignorait encore comment se transmettent les caractères ; les lois de l’hérédité, publiées par **Mendel** en 1866, passeront inaperçues quarante ans. Le XXᵉ siècle réunira les deux et fera de l’évolution la colonne vertébrale de la biologie.',
      },
      {
        titre: 'Le scandale de 1859, et ce qu’en retient la science',
        texte:
          '*L’Origine des espèces* paraît le **24 novembre 1859** ; les 1 250 exemplaires sont enlevés le jour même. Le livre ne parle presque pas de l’homme, mais tout le monde comprend. Ce qui choque n’est pas seulement que les espèces changent : c’est que **l’espèce humaine** appartienne au même arbre que les autres, et qu’aucun plan ne semble conduire l’ensemble. En juin 1860, à Oxford, l’évêque Wilberforce demande publiquement au biologiste **Thomas Huxley** s’il descend du singe par son grand-père ou par sa grand-mère ; les caricatures représenteront Darwin en orang-outan pendant vingt ans. D’autres savants croyants, comme l’Américain **Asa Gray**, soutiennent au contraire la théorie sans y voir de conflit avec leur foi. Darwin, lui, poursuit : *La Filiation de l’homme* en 1871, puis des travaux sur les vers de terre. Il meurt le 19 avril 1882 et l’Angleterre l’enterre à **Westminster**. Aujourd’hui, fossiles, observations de terrain et comparaison des **ADN** confirment l’évolution ; c’est le socle de toute la biologie moderne.',
      },
    ],
    chrono: [
      { date: '12 février 1809', fait: 'Naissance à Shrewsbury, en Angleterre.' },
      { date: '27 décembre 1831', fait: 'Départ de Plymouth à bord du Beagle.' },
      { date: 'septembre 1835', fait: 'Cinq semaines aux îles Galápagos.' },
      { date: '1836', fait: 'Retour en Angleterre après cinq ans de mer.' },
      { date: '1837', fait: 'Gould identifie treize espèces de pinsons distinctes.' },
      { date: '1838', fait: 'Lecture de Malthus : le mécanisme lui apparaît.' },
      { date: '1er juillet 1858', fait: 'Sa théorie est lue à Londres avec celle de Wallace.' },
      { date: '24 novembre 1859', fait: 'Parution de L’Origine des espèces.' },
      { date: '1871', fait: 'La Filiation de l’homme étend la théorie à notre espèce.' },
      { date: '19 avril 1882', fait: 'Mort à Down ; obsèques à l’abbaye de Westminster.' },
    ],
    leSaisTu:
      'Avant de se marier, Darwin a pesé le pour et le contre sur une feuille coupée en deux. Colonne « se marier » : « des enfants, une compagne constante, une amie pour la vieillesse — mieux qu’un chien, en tout cas ». Colonne « ne pas se marier » : « la liberté d’aller où l’on veut, et pas de visites à rendre ». Il conclut « Marry, Marry, Marry » et épousa sa cousine Emma Wedgwood.',
    aRetenir: [
      'Charles Darwin embarque en 1831 sur le Beagle pour un tour du monde de cinq ans.',
      'Aux Galápagos, il observe des espèces voisines mais différentes d’une île à l’autre, notamment treize espèces de pinsons.',
      'L’Origine des espèces paraît en 1859 et expose la théorie de la sélection naturelle.',
      'La sélection naturelle : les individus varient, et ceux dont les variations aident à survivre et à se reproduire laissent plus de descendants.',
      'La théorie fit scandale en 1859 parce qu’elle range l’espèce humaine dans le même arbre que les autres êtres vivants.',
      'L’évolution est aujourd’hui confirmée par les fossiles, l’observation de terrain et la comparaison des ADN.',
    ],
    mots: [
      {
        mot: 'Espèce',
        sens: 'Ensemble d’êtres vivants qui se ressemblent et peuvent avoir ensemble des descendants eux-mêmes féconds.',
      },
      {
        mot: 'Sélection naturelle',
        sens: 'Tri opéré par le milieu : les variations qui aident à survivre et à se reproduire se transmettent, les autres disparaissent.',
      },
      {
        mot: 'Fossile',
        sens: 'Reste ou empreinte d’un être vivant conservé dans la roche pendant des millions d’années.',
      },
      {
        mot: 'Naturaliste',
        sens: 'Savant qui observe, collecte, décrit et classe les êtres vivants.',
      },
    ],
    lies: ['louis-pasteur', 'reine-victoria', 'revolution-industrielle', 'marie-curie'],
    niveaux: ['4e', '1re'],
    programme: 'L’Europe de la révolution industrielle : sciences, techniques et sociétés',
    tags: [
      'Darwin',
      'évolution',
      'sélection naturelle',
      'Galápagos',
      'Beagle',
      'pinsons',
      'Origine des espèces',
      'naturaliste',
      'espèces',
      'Wallace',
      'fossiles',
    ],
  },
  {
    id: 'otto-von-bismarck',
    volet: 'personnages',
    nom: 'Otto von Bismarck',
    surnom: 'le chancelier de fer',
    dates: '1815 – 1898',
    tri: 1898,
    periode: 'xixe',
    emoji: '🦅',
    roles: ['Chancelier de l’Empire allemand', 'Ministre-président de Prusse', 'Diplomate'],
    origine: 'Schönhausen, royaume de Prusse',
    accroche:
      'Il fait l’unité allemande en huit ans et trois guerres, proclame l’Empire à Versailles, puis passe vingt ans à protéger son œuvre.',
    citations: [
      {
        texte:
          'Ce n’est pas par des discours et des votes de majorité que se règlent les grandes questions du temps, mais par le fer et par le sang.',
        contexte:
          'Devant la commission du budget de la Chambre prussienne, le 30 septembre 1862, une semaine après sa nomination.',
        sens:
          'Il annonce sa méthode : l’unité allemande se fera par l’armée et par la guerre, pas par les débats d’un parlement.',
      },
      {
        texte: 'La politique est l’art du possible.',
        contexte: 'Dans un entretien avec le journaliste Friedrich Meyer von Waldeck, le 11 août 1867.',
        sens:
          'Il se méfie des programmes parfaits : un homme d’État obtient ce que le rapport de forces permet, pas ce qu’il rêverait.',
      },
      {
        texte: 'Nous, Allemands, nous craignons Dieu, et rien d’autre au monde.',
        contexte:
          'Discours au Reichstag, le 6 février 1888, au plus fort des tensions avec la France et la Russie.',
      },
      {
        texte:
          'Un homme d’État ne crée rien lui-même. Il doit attendre et écouter jusqu’à entendre les pas de Dieu dans les événements, puis bondir et saisir le pan de son manteau.',
        contexte: 'Formule qu’il aimait répéter sur son métier et que ses proches ont rapportée.',
        sens:
          'Il ne se croit pas maître des événements : son art est de reconnaître l’occasion une seconde avant les autres et de s’en saisir.',
      },
    ],
    reperes: [
      'Junker, c’est-à-dire noble propriétaire terrien de Prusse, réputé ultra-conservateur à ses débuts.',
      'Ambassadeur à Saint-Pétersbourg puis à Paris : il apprend l’Europe avant de la refaire.',
      'Ministre-président de Prusse en septembre 1862, il gouverne quatre ans sans budget voté.',
      'Trois guerres en huit ans : le Danemark en 1864, l’Autriche en 1866, la France en 1870-1871.',
      'L’Empire allemand est proclamé le 18 janvier 1871 dans la galerie des Glaces de Versailles.',
      'Renvoyé par le jeune empereur Guillaume II le 20 mars 1890, après vingt-huit ans de pouvoir.',
    ],
    recit: [
      {
        titre: 'Trente-neuf États et pas de nation',
        texte:
          'Au milieu du XIXᵉ siècle, « l’Allemagne » n’est pas un pays : c’est une **confédération de trente-neuf États** qui parlent la même langue, unis depuis 1834 par une union douanière, le **Zollverein**, et rien de plus. Deux puissances s’en disputent la direction : l’**Autriche** des Habsbourg et la **Prusse**, plus petite mais mieux administrée et mieux armée. En 1848, les révolutionnaires réunis à Francfort offrent une couronne allemande au roi de Prusse, qui refuse une couronne « ramassée dans le ruisseau » : l’unité par le vote a échoué. En **1862**, le roi **Guillaume Ier**, en conflit avec les députés qui refusent de financer sa réforme de l’armée, appelle un homme que toute l’Europe juge impossible : **Otto von Bismarck**, hobereau de cinquante-sept ans, brutal, drôle et redouté. Huit jours plus tard, celui-ci annonce aux députés que les grandes questions se règleront « par le fer et par le sang » — et il gouverne quatre ans en levant l’impôt sans leur accord.',
      },
      {
        titre: 'Trois guerres, un empire',
        texte:
          'Bismarck ne fait pas trois guerres par goût du sang : il les prépare, les limite et s’arrête dès qu’il a ce qu’il veut. **1864** : avec l’Autriche, il enlève au Danemark les duchés du Schleswig et du Holstein — et fait de leur partage le prétexte de la guerre suivante. **1866** : en sept semaines, l’armée prussienne écrase l’Autriche à **Sadowa**. Vainqueur, il refuse d’humilier Vienne, se contente d’exclure l’Autriche des affaires allemandes et fonde la **Confédération de l’Allemagne du Nord**. Reste le Sud, catholique et méfiant, que seule une guerre commune peut souder. **1870** : la succession d’Espagne fournit l’occasion. Bismarck raccourcit la **dépêche d’Ems**, la livre à la presse, et Napoléon III déclare la guerre le 19 juillet. L’armée française est encerclée à **Sedan** le 2 septembre, l’empereur capitule, Paris est assiégé quatre mois.',
      },
      {
        titre: 'Versailles, 18 janvier 1871',
        texte:
          'Le **18 janvier 1871**, pendant que Paris affamé tient encore, les princes allemands se réunissent dans la **galerie des Glaces** du château de **Versailles** et proclament Guillaume Ier **empereur allemand**. Le lieu n’est pas un hasard : c’est le palais de Louis XIV, celui qui rêvait de dicter sa loi à l’Allemagne, et la date est l’anniversaire du royaume de Prusse. Bismarck devient **chancelier** de l’Empire. Le traité de Francfort, en mai, impose à la France une indemnité de **5 milliards de francs-or** et l’annexion de l’**Alsace et d’une partie de la Lorraine** — 1,6 million d’habitants qui changent de pays. Bismarck lui-même hésitait sur cette annexion réclamée par les militaires : elle donne à l’Allemagne une frontière plus solide et, du même coup, une ennemie durable. Pendant quarante-trois ans, la France vivra avec l’idée de la « revanche ».',
      },
      {
        titre: 'Le chancelier qui invente les assurances sociales',
        texte:
          'Maître de l’Empire, Bismarck se bat d’abord contre l’Église catholique (le *Kulturkampf*, 1872-1878), puis contre les **socialistes**, qu’il met hors la loi en 1878. L’interdiction ne marche pas : le parti gagne des voix à chaque élection. Il change alors de moyen et fait voter ce qu’aucun pays au monde n’a : l’**assurance maladie** en 1883, l’**assurance accidents du travail** en 1884, l’**assurance vieillesse et invalidité** en 1889. Un ouvrier malade est payé, un ouvrier blessé est indemnisé, un ouvrier de plus de soixante-dix ans touche une pension. Le but n’est pas la générosité : « celui qui a une retraite à attendre est bien plus facile à gouverner », explique-t-il en privé. L’intention est politique, le résultat est immense : c’est de là que descendent, dans toute l’Europe, nos systèmes de **protection sociale**.',
      },
      {
        titre: 'L’équilibre, puis la sortie',
        texte:
          'Après 1871, Bismarck déclare l’Allemagne « **rassasiée** » et consacre vingt ans à empêcher ce qu’il appelle son cauchemar : une coalition contre elle. Il isole la France, ménage la Russie, s’allie à l’Autriche et à l’Italie (**Triple-Alliance**, 1882), joue au congrès de Berlin de 1878 le rôle de « courtier honnête », et réunit encore à Berlin, en 1884-1885, les puissances qui se partagent l’**Afrique**. Le système tient tant qu’il le tient lui-même. En 1888, le jeune **Guillaume II** monte sur le trône ; il veut une « politique mondiale », une flotte, des colonies, et supporte mal un chancelier de soixante-quinze ans. Le **20 mars 1890**, il le renvoie — un dessin de presse anglais le montre en pilote débarqué du navire. Trois ans plus tard, la Russie signe une alliance avec la France. Bismarck meurt en 1898 ; ce qu’il avait passé sa vie à éviter arrivera en 1914.',
      },
    ],
    chrono: [
      { date: '1er avril 1815', fait: 'Naissance à Schönhausen, en Prusse.' },
      { date: '23 septembre 1862', fait: 'Nommé ministre-président de Prusse.' },
      { date: '30 septembre 1862', fait: 'Discours « du fer et du sang ».' },
      { date: '1864', fait: 'Guerre des Duchés contre le Danemark.' },
      { date: '3 juillet 1866', fait: 'Sadowa : l’Autriche est écartée de l’Allemagne.' },
      { date: '2 septembre 1870', fait: 'Sedan : l’armée française capitule.' },
      { date: '18 janvier 1871', fait: 'L’Empire allemand proclamé à Versailles.' },
      { date: '1883-1889', fait: 'Assurances maladie, accidents du travail et vieillesse.' },
      { date: '20 mars 1890', fait: 'Renvoyé par l’empereur Guillaume II.' },
      { date: '30 juillet 1898', fait: 'Mort à Friedrichsruh, près de Hambourg.' },
    ],
    leSaisTu:
      'Le 13 juillet 1870, Bismarck reçoit de Bad Ems le compte rendu d’un entretien entre son roi et l’ambassadeur de France. Il le raccourcit avant de le donner aux journaux — sans rien inventer — et le texte devient insultant pour les deux pays. « Un chiffon rouge pour le taureau gaulois », dit-il à ses invités. Six jours plus tard, la France déclarait la guerre.',
    aRetenir: [
      'Bismarck est ministre-président de Prusse à partir de 1862, puis chancelier de l’Empire allemand de 1871 à 1890.',
      'Il annonce le 30 septembre 1862 que l’unité allemande se fera « par le fer et par le sang ».',
      'Trois guerres font cette unité : contre le Danemark en 1864, l’Autriche en 1866 et la France en 1870-1871.',
      'L’Empire allemand est proclamé le 18 janvier 1871 dans la galerie des Glaces de Versailles ; la France perd l’Alsace et une partie de la Lorraine.',
      'Il crée entre 1883 et 1889 les premières assurances sociales du monde : maladie, accidents du travail, vieillesse.',
      'Guillaume II le renvoie le 20 mars 1890, et son système d’alliances se défait ensuite.',
    ],
    mots: [
      {
        mot: 'Junker',
        sens: 'Noble propriétaire terrien de l’est de la Prusse : le milieu d’où sortaient les officiers et les hauts fonctionnaires.',
      },
      {
        mot: 'Chancelier',
        sens: 'Chef du gouvernement de l’Empire allemand, responsable devant l’empereur et non devant le parlement.',
      },
      {
        mot: 'Reichstag',
        sens: 'Parlement de l’Empire allemand, élu au suffrage universel masculin mais aux pouvoirs limités.',
      },
      {
        mot: 'Nationalisme',
        sens: 'Volonté de rassembler dans un même État tous ceux qui partagent une langue, une culture et une histoire.',
      },
    ],
    lies: [
      'unification-de-l-allemagne',
      'defaite-de-sedan',
      'napoleon-iii',
      'commune-de-paris',
      'partage-de-l-afrique',
    ],
    niveaux: ['4e'],
    programme: 'L’Europe des nationalités : l’unité allemande au XIXᵉ siècle',
    tags: [
      'Bismarck',
      'Prusse',
      'Allemagne',
      'fer et sang',
      'Sedan',
      'galerie des Glaces',
      'chancelier de fer',
      'unité allemande',
      'Guillaume Ier',
      'Alsace-Lorraine',
      'Sadowa',
    ],
  },
  {
    id: 'reine-victoria',
    volet: 'personnages',
    nom: 'La reine Victoria',
    surnom: 'la grand-mère de l’Europe',
    dates: '1819 – 1901',
    tri: 1901,
    periode: 'xixe',
    emoji: '👑',
    roles: ['Reine du Royaume-Uni', 'Impératrice des Indes'],
    origine: 'Palais de Kensington, Londres',
    accroche:
      'Soixante-trois ans sur le trône : elle donne son nom à une époque, à une morale, et à l’empire le plus vaste que le monde ait connu.',
    citations: [
      {
        texte:
          'Nous ne nous intéressons pas aux possibilités de la défaite : elles n’existent pas.',
        contexte:
          'À son Premier ministre par intérim Arthur Balfour, en décembre 1899, pendant la « semaine noire » de la guerre des Boers.',
        sens:
          'Au plus mauvais moment de la guerre, elle interdit qu’on parle de défaite devant elle : la reine doit tenir le moral du pays.',
      },
      {
        texte: 'Je serai bonne.',
        contexte:
          'À onze ans, découvrant sur un arbre généalogique qu’elle héritera du trône. Rapporté par sa gouvernante, la baronne Lehzen.',
        sens:
          'Elle ne dit pas « je serai reine » mais « je serai bonne » : le devoir avant le pouvoir, ce sera la ligne de tout son règne.',
      },
      {
        texte:
          'Le plus grand jour de notre histoire, le spectacle le plus beau, le plus imposant et le plus émouvant qu’on ait jamais vu.',
        contexte:
          'Dans son journal, le 1ᵉʳ mai 1851, au soir de l’ouverture de l’Exposition universelle du Crystal Palace, organisée par son mari.',
      },
      {
        texte: 'Ma vie heureuse est finie. Le monde s’en est allé pour moi.',
        contexte:
          'Lettre à son oncle Léopold, roi des Belges, le 24 décembre 1861, dix jours après la mort du prince Albert.',
        sens:
          'Elle a quarante-deux ans et portera le deuil jusqu’à sa mort, quarante ans plus tard.',
      },
    ],
    reperes: [
      'Reine à dix-huit ans, le 20 juin 1837, dans une famille qui ne l’attendait pas sur le trône.',
      'Elle épouse en 1840 son cousin Albert de Saxe-Cobourg : neuf enfants en dix-sept ans.',
      'Veuve en 1861, elle porte le deuil quarante ans et disparaît longtemps de la vie publique.',
      'Proclamée impératrice des Indes en 1876 : l’Empire couvre alors un quart des terres émergées.',
      'Soixante-trois ans et sept mois de règne : un record britannique battu seulement en 2015.',
      'Ses enfants et petits-enfants règnent ou se marient dans presque toutes les cours d’Europe.',
    ],
    recit: [
      {
        titre: 'Une héritière imprévue',
        texte:
          'Le roi **George III** a eu quinze enfants, et pourtant, en 1817, la mort de sa petite-fille Charlotte laisse la couronne sans héritier direct. Ses fils vieillissants se marient en hâte. De cette course naît, le 24 mai **1819**, une petite fille prénommée **Victoria**. Son père meurt huit mois plus tard. Élevée au palais de Kensington par une mère possessive et son conseiller Conroy, qui l’isolent pour mieux la tenir — elle ne descend pas un escalier sans qu’on lui donne la main —, elle devient reine à **dix-huit ans**, le 20 juin 1837, quand son oncle Guillaume IV meurt à l’aube. Sa toute première décision, ce matin-là, est de demander une heure seule, puis de faire sortir le lit de sa mère de sa chambre. Elle mesure 1,52 m et vient de prendre le pouvoir.',
      },
      {
        titre: 'Albert',
        texte:
          'En 1840, elle épouse son cousin allemand **Albert de Saxe-Cobourg-Gotha** — c’est elle qui fait la demande, l’étiquette interdisant qu’on demande la main d’une reine. Le mariage est heureux et l’association politique redoutable : Albert remet de l’ordre dans une cour qui gaspillait, s’intéresse aux sciences, aux machines, aux écoles techniques. Son grand œuvre est l’**Exposition universelle de 1851**, dans un palais de verre et de fer monté à Hyde Park, le *Crystal Palace* : **six millions de visiteurs** en cinq mois, et des bénéfices qui financeront les musées de South Kensington. Neuf enfants naissent entre 1840 et 1857 ; la reine, qui déteste la grossesse et se fait donner du chloroforme en 1853 — scandale médical, puis mode nationale. Le 14 décembre **1861**, Albert meurt d’une fièvre typhoïde à quarante-deux ans. Victoria ne s’en remettra jamais.',
      },
      {
        titre: 'La veuve de Windsor',
        texte:
          'Pendant dix ans, la reine se retire. Elle fait entretenir la chambre d’Albert comme s’il allait rentrer, ne paraît plus au Parlement, s’habille de noir jusqu’à sa mort. Le pays s’impatiente : dans les années 1870, des voix **républicaines** demandent à quoi sert une souveraine qu’on ne voit jamais. C’est son Premier ministre **Benjamin Disraeli** qui la ramène sur la scène, par la flatterie assumée — « avec la royauté, il faut l’étaler à la truelle », disait-il — et par un titre : en **1876**, une loi fait de Victoria l’**impératrice des Indes**. Les deux jubilés, en 1887 puis en 1897, achèvent la réconciliation : le **jubilé de diamant** rassemble à Londres des troupes venues de tout l’Empire et des millions de spectateurs. La monarchie a changé de nature : la reine ne gouverne plus, elle **représente** — et c’est ce métier-là qu’exercent encore les souverains britanniques.',
      },
      {
        titre: 'L’atelier du monde',
        texte:
          'Son règne recouvre l’apogée de la **révolution industrielle** anglaise. Le Royaume-Uni passe de 14 à 37 millions d’habitants, Londres de 1 à 6,5 millions : la plus grande ville du monde. Le **chemin de fer**, né en 1830 entre Liverpool et Manchester, compte 30 000 km de voies en 1900. Le charbon, la vapeur, le coton de Manchester, les chantiers navals de Glasgow font de l’Angleterre « l’atelier du monde ». Le revers est dans les mêmes villes : journées de douze heures, taudis, choléra, et des enfants au fond des mines — une loi de **1842** interdit d’y employer les femmes et les garçons de moins de dix ans, ce qui dit assez ce qui se pratiquait avant. Les romans de **Dickens** en tiennent le registre. Tout au long du siècle, des lois d’usine, puis les syndicats, arrachent des limites à la durée du travail.',
      },
      {
        titre: 'Un empire, une époque, une famille',
        texte:
          'À la mort de Victoria, l’**Empire britannique** compte près de **400 millions de sujets** et couvre un quart des terres : Canada, Australie, Nouvelle-Zélande, Inde, Afrique du Sud, Égypte, Nigeria… « L’empire sur lequel le soleil ne se couche jamais ». Cette domination s’appuie sur la flotte, le commerce et la conviction affichée d’apporter la civilisation — une prétention que les peuples colonisés contesteront dès le siècle suivant. Le mot « **victorien** » désigne aussi une morale : famille, devoir, travail, respectabilité, avec sa part d’hypocrisie que les écrivains de l’époque n’ont pas manquée. Victoria meurt le **22 janvier 1901** à Osborne, à quatre-vingt-un ans, entourée de ses enfants et de son petit-fils l’empereur allemand **Guillaume II**. Treize ans plus tard, ses descendants se feront la guerre.',
      },
    ],
    chrono: [
      { date: '24 mai 1819', fait: 'Naissance au palais de Kensington, à Londres.' },
      { date: '20 juin 1837', fait: 'Elle devient reine, à dix-huit ans.' },
      { date: '10 février 1840', fait: 'Mariage avec le prince Albert.' },
      { date: '1er mai 1851', fait: 'Exposition universelle du Crystal Palace.' },
      { date: '14 décembre 1861', fait: 'Mort d’Albert : quarante ans de deuil.' },
      { date: '1er mai 1876', fait: 'Elle est proclamée impératrice des Indes.' },
      { date: '1887', fait: 'Jubilé d’or : cinquante ans de règne.' },
      { date: '1897', fait: 'Jubilé de diamant, avec les troupes de tout l’Empire.' },
      { date: '22 janvier 1901', fait: 'Mort à Osborne, après soixante-trois ans de règne.' },
    ],
    leSaisTu:
      'Victoria portait sans le savoir le gène de l’hémophilie, une maladie qui empêche le sang de coaguler. Par ses filles et petites-filles mariées à Madrid, Berlin et Saint-Pétersbourg, elle est entrée dans trois familles régnantes : le tsarévitch Alexis, fils de Nicolas II, en hérita — et c’est pour le soigner que ses parents firent venir Raspoutine.',
    aRetenir: [
      'Victoria règne sur le Royaume-Uni de 1837 à 1901, soit soixante-trois ans.',
      'Son mari le prince Albert organise l’Exposition universelle de 1851 à Londres ; sa mort en 1861 la plonge dans un deuil de quarante ans.',
      'Elle est proclamée impératrice des Indes en 1876 ; l’Empire britannique couvre alors un quart des terres émergées.',
      'Son règne correspond à l’apogée de la révolution industrielle anglaise : chemin de fer, charbon, coton, villes ouvrières.',
      'L’époque victorienne désigne cette période et sa morale : famille, devoir, travail, respectabilité.',
      'Dans cette monarchie parlementaire, la reine règne mais ne gouverne pas : le pouvoir appartient au Parlement.',
    ],
    mots: [
      {
        mot: 'Monarchie parlementaire',
        sens: 'Régime où le souverain règne mais ne gouverne pas : le pouvoir appartient au parlement élu et au gouvernement qui en sort.',
      },
      {
        mot: 'Jubilé',
        sens: 'Fête donnée dans tout le pays pour l’anniversaire d’un long règne.',
      },
      {
        mot: 'Empire colonial',
        sens: 'Ensemble des territoires qu’un État domine et administre hors de ses frontières.',
      },
    ],
    lies: [
      'revolution-industrielle',
      'partage-de-l-afrique',
      'exposition-universelle-1889',
      'charles-darwin',
      'gandhi',
    ],
    niveaux: ['4e'],
    programme: 'L’Europe de la révolution industrielle et les empires coloniaux',
    tags: [
      'Victoria',
      'Royaume-Uni',
      'Angleterre',
      'époque victorienne',
      'empire britannique',
      'Albert',
      'Indes',
      'Crystal Palace',
      'révolution industrielle',
      'Londres',
      'jubilé',
    ],
  },
  {
    id: 'louise-michel',
    volet: 'personnages',
    nom: 'Louise Michel',
    surnom: 'la Vierge rouge',
    dates: '1830 – 1905',
    tri: 1905,
    periode: 'xixe',
    emoji: '🚩',
    roles: ['Institutrice', 'Communarde', 'Militante anarchiste'],
    origine: 'Vroncourt-la-Côte, Haute-Marne',
    accroche:
      'Institutrice et poétesse, elle se bat sur les barricades de la Commune, réclame la mort à ses juges, et revient du bagne plus écoutée qu’avant.',
    citations: [
      {
        texte:
          'Puisqu’il semble que tout cœur qui bat pour la liberté n’a droit qu’à un peu de plomb, j’en réclame ma part !',
        contexte:
          'Devant le 6ᵉ conseil de guerre de Versailles, le 16 décembre 1871. Elle refuse de se défendre et demande à être fusillée.',
        sens:
          'Elle exige d’être traitée comme ses camarades exécutés, et non épargnée parce qu’elle est une femme.',
      },
      {
        texte: 'Si vous n’êtes pas des lâches, tuez-moi.',
        contexte:
          'Suite immédiate de sa déclaration aux juges, le 16 décembre 1871. Le tribunal la condamna à la déportation, pas à la mort.',
      },
      {
        texte: 'Le pouvoir est maudit, et c’est pour cela que je suis anarchiste.',
        contexte:
          'À son procès de juin 1883, après la manifestation des sans-travail de Paris, où elle avait porté le drapeau noir.',
        sens:
          'Elle ne veut pas prendre le pouvoir à la place des autres : elle refuse qu’il existe un pouvoir à prendre.',
      },
      {
        texte:
          'Si j’allais au noir cimetière, frères, jetez sur votre sœur, comme une espérance dernière, de rouges œillets tout en fleur.',
        contexte:
          'Poème Les Œillets rouges, écrit en prison à Versailles en 1871 et dédié à Théophile Ferré, fusillé le 28 novembre.',
      },
    ],
    reperes: [
      'Fille naturelle d’une servante, élevée au château de ses grands-parents et instruite comme eux.',
      'Institutrice à vingt-deux ans, elle ouvre des écoles libres plutôt que de prêter serment à l’Empire.',
      'Pendant la Commune, elle combat en uniforme au fort d’Issy et sur les barricades de Montmartre.',
      'Elle se constitue prisonnière pour faire libérer sa mère, arrêtée à sa place.',
      'Déportée en Nouvelle-Calédonie de 1873 à 1880, elle y enseigne aux enfants des déportés et aux Kanaks.',
      'Cent mille personnes suivent son enterrement à Levallois, en janvier 1905.',
    ],
    recit: [
      {
        titre: 'L’institutrice qui refuse de prêter serment',
        texte:
          'Louise Michel naît en **1830** en Haute-Marne, fille naturelle d’une servante et, probablement, du fils de la maison. Fait rare, le châtelain et sa femme l’élèvent avec leurs livres et leurs idées de 1789. Elle passe son brevet d’institutrice en 1852 — l’année où **Napoléon III** devient empereur. Pour enseigner dans une école publique, il faut prêter serment à l’Empereur : elle refuse, et ouvre des **écoles libres**, d’abord en Haute-Marne, puis à Paris à partir de 1856. On y apprend à lire, mais aussi à dessiner, à chanter, à observer ; on n’y frappe pas les enfants. Elle écrit des poèmes, en envoie à **Victor Hugo**, qui lui répond et devient son correspondant. Dans les dernières années de l’Empire, elle fréquente les clubs et les réunions publiques où l’on parle de république, d’instruction et de misère.',
      },
      {
        titre: 'Montmartre, 18 mars 1871',
        texte:
          'La guerre contre la Prusse est perdue, Paris a tenu **quatre mois de siège** — on y a mangé les animaux du zoo, les rats, les chiens. La ville a payé par souscription les **canons** installés sur la butte Montmartre. Le 18 mars 1871, **Adolphe Thiers**, chef du gouvernement replié à Versailles, envoie des soldats les reprendre à l’aube. Les femmes du quartier sortent les premières, se glissent entre les canons et les troupes, parlent aux soldats ; Louise Michel est parmi elles. Les soldats refusent de tirer. Dix jours plus tard, la **Commune de Paris** est proclamée à l’Hôtel de Ville. Elle durera soixante-douze jours et décidera, dans le fracas, l’**école gratuite, laïque et obligatoire**, la séparation des Églises et de l’État, l’interdiction des amendes patronales, la remise des loyers. Louise Michel y est tout à la fois : infirmière, ambulancière, oratrice au club de la Révolution, et soldat au 61ᵉ bataillon.',
      },
      {
        titre: 'La Semaine sanglante et le procès',
        texte:
          'Du **21 au 28 mai 1871**, l’armée de Versailles reprend Paris rue par rue. C’est la **Semaine sanglante** : les fusillades sommaires font au moins six mille morts, sans doute bien davantage ; on tue au Père-Lachaise, au Luxembourg, à la caserne Lobau. Louise Michel se bat jusqu’au dernier jour au cimetière de Montmartre, puis se cache. Quand elle apprend que sa **mère** a été arrêtée à sa place, elle se rend aussitôt. Le **16 décembre 1871**, devant le conseil de guerre, elle ne demande pas grâce : elle revendique tout, réclame la mort — « j’en réclame ma part ! » — et lance à ses juges « si vous n’êtes pas des lâches, tuez-moi ». Le tribunal, qui ne veut pas d’une martyre, la condamne à la **déportation dans une enceinte fortifiée**. La presse conservatrice invente alors son surnom : la **Vierge rouge**.',
      },
      {
        titre: 'Le bagne, les Kanaks',
        texte:
          'En août 1873, elle embarque sur la *Virginie* pour la **Nouvelle-Calédonie** : quatre mois de mer dans une cage de fer, aux côtés de sa compagne d’armes Nathalie Lemel. Sur la presqu’île Ducos, elle refuse la grâce, cultive un jardin, observe les plantes, publie un journal manuscrit et **fait la classe** — aux enfants des déportés, puis aux **Kanaks**, à qui elle apprend à lire et dont elle recueille les légendes. En **1878**, quand la révolte kanake éclate, presque tous les déportés prennent le parti de l’administration coloniale : elle est l’une des très rares à se ranger du côté des insurgés, et donne à deux d’entre eux l’**écharpe rouge de la Commune**, coupée en deux. L’**amnistie** de 1880 la ramène en France : vingt mille personnes l’attendent à la gare Saint-Lazare.',
      },
      {
        titre: 'Vingt-cinq ans de tribune',
        texte:
          'Le reste de sa vie n’est qu’une longue tournée de conférences, en France, en Belgique, en Angleterre : l’instruction, le sort des femmes, la misère ouvrière, la fin des prisons. En **1883**, elle conduit une manifestation de chômeurs qui pille trois boulangeries ; on la condamne à six ans, elle en fera trois. Le 22 janvier **1888**, au Havre, un homme lui tire deux balles dans la tête pendant une conférence : elle survit, garde le plomb derrière l’oreille et **demande la grâce de son agresseur**, refusant de porter plainte. Exilée à Londres de 1890 à 1895, elle y ouvre encore une école. Elle meurt à **Marseille** le 9 janvier **1905**, en tournée, à soixante-quatorze ans. Cent mille personnes suivent son cercueil jusqu’au cimetière de Levallois-Perret. Plus de deux cents écoles et rues portent aujourd’hui son nom.',
      },
    ],
    chrono: [
      { date: '29 mai 1830', fait: 'Naissance à Vroncourt-la-Côte, en Haute-Marne.' },
      { date: '1853', fait: 'Institutrice, elle refuse de prêter serment à l’Empire.' },
      { date: '18 mars 1871', fait: 'Montmartre : les femmes s’interposent devant les canons.' },
      { date: '28 mars 1871', fait: 'Proclamation de la Commune de Paris.' },
      { date: '21-28 mai 1871', fait: 'Semaine sanglante : la Commune est écrasée.' },
      { date: '16 décembre 1871', fait: 'Procès de Versailles : « j’en réclame ma part ! »' },
      { date: 'août 1873', fait: 'Déportation en Nouvelle-Calédonie.' },
      { date: '1878', fait: 'Elle soutient la révolte kanake contre la colonie.' },
      { date: '9 novembre 1880', fait: 'Amnistiée, elle rentre à Paris en triomphe.' },
      { date: '9 janvier 1905', fait: 'Mort à Marseille ; 100 000 personnes à ses obsèques.' },
    ],
    leSaisTu:
      'Après avoir reçu deux balles dans la tête au Havre, Louise Michel a exigé qu’on ne poursuive pas le tireur : « il a été trompé, on l’a abusé », répétait-elle. Les médecins n’osèrent pas retirer le projectile logé derrière son oreille : elle l’a gardé dix-sept ans, jusqu’à sa mort.',
    aRetenir: [
      'Louise Michel est institutrice avant d’être l’une des figures de la Commune de Paris, du 18 mars au 28 mai 1871.',
      'Elle combat les armes à la main, puis se rend pour faire libérer sa mère, arrêtée à sa place.',
      'À son procès, le 16 décembre 1871, elle réclame la mort : « j’en réclame ma part ! »',
      'Déportée en Nouvelle-Calédonie de 1873 à 1880, elle y enseigne et soutient la révolte kanake de 1878.',
      'Amnistiée en 1880, elle devient une grande figure du mouvement anarchiste jusqu’à sa mort en 1905.',
    ],
    mots: [
      {
        mot: 'Commune',
        sens: 'Gouvernement révolutionnaire de Paris, du 18 mars au 28 mai 1871, élu par les Parisiens contre l’Assemblée installée à Versailles.',
      },
      {
        mot: 'Déportation',
        sens: 'Peine d’exil forcé dans une colonie lointaine, sous surveillance, pour une durée déterminée ou à vie.',
      },
      {
        mot: 'Anarchiste',
        sens: 'Partisan d’une société sans État ni patron, où les hommes s’organisent librement entre eux.',
      },
      {
        mot: 'Amnistie',
        sens: 'Loi qui efface des condamnations et permet aux condamnés de rentrer et de retrouver leurs droits.',
      },
    ],
    lies: ['commune-de-paris', 'adolphe-thiers', 'victor-hugo', 'jules-ferry'],
    niveaux: ['4e'],
    programme: 'La difficile conquête de la République en France',
    tags: [
      'Louise Michel',
      'Commune',
      'Vierge rouge',
      'Montmartre',
      'Nouvelle-Calédonie',
      'anarchiste',
      'institutrice',
      'Semaine sanglante',
      'déportation',
      'drapeau noir',
      'Kanaks',
    ],
  },
  {
    id: 'jean-jaures',
    volet: 'personnages',
    nom: 'Jean Jaurès',
    surnom: 'la voix du socialisme français',
    dates: '1859 – 1914',
    tri: 1914,
    periode: 'xixe',
    emoji: '🕊️',
    roles: ['Député socialiste', 'Professeur de philosophie', 'Fondateur de L’Humanité'],
    origine: 'Castres, Tarn',
    accroche:
      'Normalien devenu tribun des mineurs, dreyfusard, fondateur de L’Humanité : il est tué pour avoir voulu empêcher la guerre, trois jours avant qu’elle éclate.',
    citations: [
      {
        texte: 'Le courage, c’est de chercher la vérité et de la dire.',
        contexte:
          'Discours à la jeunesse, prononcé à la distribution des prix du lycée d’Albi, le 30 juillet 1903, devant des élèves de son ancien lycée.',
        sens:
          'Le courage n’est pas de crier plus fort que les autres : c’est de chercher honnêtement ce qui est vrai, puis de ne pas se taire.',
      },
      {
        texte: 'Le capitalisme porte en lui la guerre comme la nuée porte l’orage.',
        contexte:
          'Formule de ses campagnes contre la course aux armements et les marchands de canons, reprise de discours en discours à partir de 1895.',
        sens:
          'Pour lui, la concurrence économique entre puissances mène mécaniquement au conflit armé : la guerre n’est pas un accident.',
      },
      {
        texte:
          'Un peu d’internationalisme éloigne de la patrie ; beaucoup d’internationalisme y ramène.',
        contexte:
          'Discours à la jeunesse, Albi, le 30 juillet 1903. La phrase continue : « un peu de patriotisme éloigne de l’Internationale, beaucoup de patriotisme y ramène ».',
        sens:
          'Il refuse qu’on choisisse entre aimer son pays et vouloir la paix entre les peuples : pour lui, les deux se rejoignent.',
      },
      {
        texte: 'Le courage, c’est d’aller à l’idéal et de comprendre le réel.',
        contexte: 'Toujours le discours d’Albi, 1903 : la phrase qui résume le mieux sa méthode.',
        sens:
          'Ne jamais renoncer à ce qui devrait être, sans jamais cesser de regarder ce qui est. C’est son programme politique en dix mots.',
      },
    ],
    reperes: [
      'Fils d’une famille modeste du Tarn, il entre premier à l’École normale supérieure en 1878.',
      'Professeur de philosophie, puis député à vingt-cinq ans : le plus jeune de la Chambre.',
      'La grève des mineurs de Carmaux, en 1892, fait de lui un socialiste.',
      'Dreyfusard contre une partie de son propre camp, il publie Les Preuves en 1898.',
      'Il fonde le journal L’Humanité le 18 avril 1904 et unifie les socialistes en 1905.',
      'Assassiné le 31 juillet 1914 au Café du Croissant, trois jours avant la mobilisation générale.',
    ],
    recit: [
      {
        titre: 'Le boursier de Castres',
        texte:
          'Jean Jaurès naît en **1859** à Castres, dans une famille de petite bourgeoisie désargentée : son père essaie l’élevage et le commerce, sans succès. Repéré par un inspecteur, l’élève monte à Paris avec une **bourse**, entre au lycée Louis-le-Grand et est reçu **premier à l’École normale supérieure** en 1878 ; trois ans plus tard, il est troisième à l’agrégation de philosophie, derrière un certain **Henri Bergson**. Il enseigne la philosophie à Albi puis à Toulouse, et se fait élire **député du Tarn en 1885**, à vingt-cinq ans, comme républicain modéré. Battu en 1889, il retourne à ses cours et à sa thèse. Ce sont les ouvriers, et non les livres, qui vont le déplacer.',
      },
      {
        titre: 'Carmaux, la grève qui le fait socialiste',
        texte:
          'En **1892**, les mineurs de **Carmaux**, dans le Tarn, élisent l’un des leurs, **Jean-Baptiste Calvignac**, comme maire. Le propriétaire de la mine, le marquis de Solages, le licencie aussitôt : un ouvrier n’a pas à s’absenter pour gouverner une commune. Deux mille mineurs cessent le travail pendant plus de deux mois ; le gouvernement envoie la troupe. Jaurès prend leur parti, écrit article sur article et pose la question qui fera sa réputation : à quoi sert le **suffrage universel** si un patron peut défaire ce que les électeurs ont fait ? La grève est gagnée, et Jaurès est élu **député de Carmaux** en janvier 1893, cette fois comme **socialiste**. Quand, trois ans plus tard, les verriers de la même ville sont mis dehors, il les aide à bâtir leur propre usine : la verrerie ouvrière d’Albi.',
      },
      {
        titre: 'Dreyfus : la vérité avant le camp',
        texte:
          'En 1898, quand l’**affaire Dreyfus** déchire la France, une partie de la gauche hausse les épaules : ce serait une querelle entre bourgeois, entre un officier et des généraux, qui ne regarde pas les ouvriers. Jaurès répond qu’un innocent est un innocent, et qu’une République qui laisse condamner un homme sur un faux n’est plus une République. Il perd son siège aux élections de mai 1898, et c’est précisément là, sans mandat, qu’il publie dans *La Petite République* la série d’articles intitulée ***Les Preuves*** : pièce par pièce, il démonte le dossier et montre la fabrication du faux. Émile **Zola** avait publié *J’accuse* en janvier. Dreyfus sera réhabilité en **1906**, et c’est Jaurès qui obtiendra, en 1908, le transfert des cendres de Zola au **Panthéon**.',
      },
      {
        titre: 'Un parti, un journal, des lois',
        texte:
          'Jaurès veut un socialisme qui passe par la **République**, les élections et les lois, et non par un coup de force. Le 18 avril **1904**, il fonde le quotidien ***L’Humanité***, qu’il dirige et où il écrit presque chaque jour ; y collaborent des écrivains, des savants et le jeune **Léon Blum**. En **1905**, les courants socialistes rivaux se réunissent enfin dans un seul parti, la **SFIO**. À la Chambre, il défend la **séparation des Églises et de l’État** (1905), les **retraites ouvrières** (1910), l’impôt sur le revenu, le droit de grève, l’école pour tous. Il reste un professeur : il écrit une *Histoire socialiste de la Révolution française* en plusieurs volumes, où il explique 1789 par l’économie autant que par les idées.',
      },
      {
        titre: 'Trois jours avant la guerre',
        texte:
          'À partir de 1911, l’Europe s’arme. Jaurès combat la **loi de trois ans** qui allonge le service militaire et propose, dans *L’Armée nouvelle* (1911), une armée de citoyens capable de défendre le pays sans pouvoir l’entraîner dans une attaque. Après l’**attentat de Sarajevo**, il court d’une capitale à l’autre : le 29 juillet 1914, il parle à **Bruxelles** devant sept mille personnes et plaide pour que les ouvriers allemands et français refusent ensemble la guerre. Rentré à Paris, il passe la journée du **31 juillet** au ministère, à supplier qu’on retienne la Russie. Le soir, il dîne au **Café du Croissant**, rue Montmartre. À 21 h 40, un nationaliste de vingt-neuf ans, **Raoul Villain**, tire deux balles par la fenêtre ouverte. Jaurès meurt en quelques minutes. Le **1ᵉʳ août**, la France décrète la mobilisation générale ; le 3, l’Allemagne déclare la guerre.',
      },
    ],
    chrono: [
      { date: '3 septembre 1859', fait: 'Naissance à Castres, dans le Tarn.' },
      { date: '1878', fait: 'Reçu premier à l’École normale supérieure.' },
      { date: '1885', fait: 'Élu député du Tarn, à vingt-cinq ans.' },
      { date: '1892', fait: 'Grève des mineurs de Carmaux : il rejoint les socialistes.' },
      { date: '1898', fait: 'Les Preuves : il défend Dreyfus contre une partie des siens.' },
      { date: '18 avril 1904', fait: 'Fondation du journal L’Humanité.' },
      { date: '1905', fait: 'Unification des socialistes : naissance de la SFIO.' },
      { date: '29 juillet 1914', fait: 'Discours pour la paix à Bruxelles.' },
      { date: '31 juillet 1914', fait: 'Assassiné au Café du Croissant, à Paris.' },
      { date: '23 novembre 1924', fait: 'Ses cendres sont transférées au Panthéon.' },
    ],
    leSaisTu:
      'Raoul Villain, l’assassin de Jaurès, fut acquitté en mars 1919 : le jury estima que la France victorieuse n’avait pas à punir un homme qui avait tué un « pacifiste ». Pire, la veuve de Jaurès fut condamnée à payer les frais du procès. Il fallut attendre 1924 pour que les cendres de Jaurès entrent au Panthéon.',
    aRetenir: [
      'Jean Jaurès, professeur de philosophie, devient député socialiste après la grève des mineurs de Carmaux en 1892.',
      'Il défend Dreyfus dès 1898 et publie Les Preuves, au risque de se couper d’une partie de son camp.',
      'Il fonde le journal L’Humanité le 18 avril 1904 et unifie les socialistes dans la SFIO en 1905.',
      'Il combat la course aux armements et cherche jusqu’au bout à empêcher la guerre, en juillet 1914.',
      'Il est assassiné le 31 juillet 1914 au Café du Croissant ; la mobilisation générale est décrétée le 1ᵉʳ août.',
      'Ses cendres entrent au Panthéon en 1924.',
    ],
    mots: [
      {
        mot: 'Socialisme',
        sens: 'Doctrine qui veut mettre les grands moyens de production au service de tous plutôt qu’au profit de quelques propriétaires.',
      },
      {
        mot: 'SFIO',
        sens: 'Section française de l’Internationale ouvrière : le parti socialiste français, fondé en 1905.',
      },
      {
        mot: 'Pacifisme',
        sens: 'Refus de la guerre comme moyen de régler les conflits entre États.',
      },
      {
        mot: 'Union sacrée',
        sens: 'Trêve politique décidée en août 1914 : tous les partis, y compris les socialistes, soutiennent le gouvernement de guerre.',
      },
    ],
    lies: [
      'affaire-dreyfus',
      'emile-zola',
      'karl-marx',
      'attentat-de-sarajevo',
      'georges-clemenceau',
    ],
    niveaux: ['4e', '3e'],
    programme: 'La Troisième République et l’entrée dans la Première Guerre mondiale',
    tags: [
      'Jaurès',
      'socialisme',
      'Humanité',
      'Carmaux',
      'Dreyfus',
      'SFIO',
      'Café du Croissant',
      'pacifisme',
      'Panthéon',
      'Albi',
      '1914',
    ],
  },
]
