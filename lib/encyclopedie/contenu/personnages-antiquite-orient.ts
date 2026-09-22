// -----------------------------------------------------------------------------
// ANTIQUITÉ — Orient et Grèce : de la première loi écrite à la dernière figure
// du monde grec.
//
// Dix fiches qui tiennent en une phrase chacune : Hammourabi fait graver la
// loi sur une pierre, Moïse fait sortir un peuple d'Égypte, Ramsès II bâtit
// pour l'éternité, Homère donne aux Grecs leurs récits, Périclès leur donne le
// mot « démocratie », Socrate la question, Platon l'école, Aristote la
// méthode, Alexandre l'empire, Archimède la machine et le nombre.
//
// Le lot suit le patron de `personnages-moyen-age-rois.ts` : la citation
// d'abord, des repères qu'on lit en trente secondes, un récit dense, une
// frise, une anecdote, ce qui tombe au contrôle. Le guide complet est dans
// `docs/encyclopedie.md`.
//
// DEUX PRÉCAUTIONS PROPRES À CETTE PÉRIODE. D'abord, beaucoup de ces phrases
// nous viennent d'auteurs qui écrivent des siècles plus tard (Plutarque,
// Vitruve, Diogène Laërce) : celles-là portent `incertaine` et disent pourquoi
// dans `sens` — « Eurêka ! » se garde, mais pas donnée pour vraie. Ensuite, la
// fiche de Moïse raconte ce que RACONTE le livre de l'Exode : c'est le récit
// fondateur d'un peuple, traité avec le même respect que les figures
// chrétiennes du Moyen Âge (cf. § 3 du guide), ni pris pour une chronique, ni
// tourné en dérision.
// -----------------------------------------------------------------------------

import type { Personnage } from '../types'

export const PERSONNAGES_ANTIQUITE_ORIENT: Personnage[] = [
  {
    id: 'hammourabi',
    volet: 'personnages',
    nom: 'Hammourabi',
    surnom: 'le roi de justice',
    dates: 'vers 1810 – 1750 av. J.-C.',
    tri: -1750,
    periode: 'antiquite',
    emoji: '📜',
    roles: ['Roi de Babylone', 'Législateur', 'Conquérant de la Mésopotamie'],
    origine: 'Babylone, Mésopotamie',
    accroche:
      'Il y a trente-sept siècles, un roi de Babylone fait graver ses lois sur une pierre de deux mètres et la dresse en pleine ville : la loi devient publique.',
    citations: [
      {
        texte:
          'Si un homme a crevé l’œil d’un homme libre, on lui crèvera l’œil. S’il a brisé l’os d’un homme libre, on lui brisera l’os.',
        contexte: 'Articles 196 et 197 du code, gravés sur la stèle vers 1755 av. J.-C.',
        sens:
          'C’est la loi du talion, « œil pour œil, dent pour dent » : la punition doit être égale au crime, ni plus ni moins. Elle paraît dure ; elle sert d’abord à empêcher la vengeance sans fin entre familles.',
      },
      {
        texte:
          'Afin que le fort n’opprime pas le faible, pour rendre justice à l’orphelin et à la veuve.',
        contexte:
          'Prologue du code : Hammourabi y dit pourquoi les dieux Anu et Enlil l’ont appelé à régner.',
        sens:
          'Le roi ne se présente pas comme le plus fort mais comme l’arbitre : sa légitimité vient de ce qu’il protège ceux qui ne peuvent pas se défendre seuls.',
      },
      {
        texte:
          'Si un maçon a bâti une maison sans la rendre solide, et que la maison s’écroule et tue le propriétaire, ce maçon sera mis à mort.',
        contexte: 'Article 229 du code, sur la responsabilité des métiers.',
        sens:
          'Le code ne règle pas que les crimes : il fixe les salaires, les loyers, les dettes, le divorce, le prix d’un bœuf loué — c’est le mode d’emploi d’une société entière.',
      },
      {
        texte: 'Hammourabi, le roi de justice, à qui Shamash a accordé la vérité, c’est moi.',
        contexte: 'Épilogue du code, gravé au bas de la stèle.',
      },
    ],
    reperes: [
      'Roi de Babylone de 1792 à 1750 av. J.-C. environ : quarante-deux ans de règne.',
      'Il unifie la Mésopotamie en soumettant Larsa, Eshnunna et Mari.',
      'Son code compte 282 articles gravés en akkadien sur une stèle de diorite noire de 2,25 m.',
      'La peine dépend du rang : le talion entre hommes libres, une amende en argent pour les autres.',
      'Le sommet de la stèle montre le dieu-soleil Shamash remettant au roi le bâton et l’anneau.',
      'Pillée par les Élamites, la stèle a été retrouvée à Suse en 1901 : elle est au Louvre.',
    ],
    recit: [
      {
        titre: 'Une ville qui devient un empire',
        texte:
          'Quand Hammourabi monte sur le trône vers **1792 av. J.-C.**, **Babylone** n’est qu’un royaume moyen coincé entre des voisins plus puissants, au bord de l’**Euphrate**. Il attend, il fortifie, il creuse des canaux — puis il frappe. En 1763, il écrase **Larsa** et prend tout le sud ; en 1761, il enlève **Mari**, la riche cité marchande du nord, dont les archives (vingt mille tablettes d’argile retrouvées par les archéologues) racontent le quotidien de son époque. À sa mort, toute la **Mésopotamie** obéit à une seule ville. L’empire ne lui survivra guère ; sa loi, si.',
      },
      {
        titre: '282 articles sur une pierre dressée dans la rue',
        texte:
          'Le code n’est pas le premier recueil de lois de la Mésopotamie — d’autres rois en avaient promulgué avant lui —, mais c’est le mieux conservé et le plus complet : **282 articles**, environ 3 600 lignes d’écriture **cunéiforme**, gravés sur une stèle de **diorite** noire haute de 2,25 m. Tous sont bâtis sur le même modèle : « si un homme… alors… ». Ils règlent le vol, le meurtre, les faux témoignages, mais aussi les salaires du médecin, le loyer d’un champ, le divorce, la dette d’un paysan après une mauvaise récolte. L’essentiel est ailleurs : la pierre est **dressée en public**. N’importe qui peut la faire lire. Une loi affichée n’est plus la décision d’un juge selon son humeur, c’est une règle que l’on peut opposer au puissant.',
      },
      {
        titre: 'Œil pour œil — mais pas pour tout le monde',
        texte:
          'La société du code compte **trois rangs** : l’homme libre (*awîlum*), le subalterne (*mushkênum*) et l’esclave (*wardum*). Le **talion** ne joue qu’entre égaux : crever l’œil d’un homme libre coûte un œil, mais crever l’œil d’un subalterne coûte une **amende en argent**, et blesser l’esclave d’un autre se rembourse comme un dommage matériel. Les peines sont lourdes — la mort punit le vol avec effraction, le faux témoignage dans une affaire capitale, la fuite d’un esclave aidée par un tiers. Mais le texte protège aussi : la veuve garde sa dot, l’adoptant doit nourrir l’enfant, le soldat fait prisonnier retrouve son champ. C’est un monde inégal qui écrit noir sur blanc ce qu’il doit à chacun.',
      },
      {
        titre: 'Volée par un roi, retrouvée par un archéologue',
        texte:
          'Vers **1155 av. J.-C.**, six siècles après la mort d’Hammourabi, le roi élamite **Shutruk-Nahhunte** pille Babylone et emporte la stèle comme trophée dans sa capitale, **Suse**, en Iran actuel. Il fait marteler sept colonnes de texte — une trentaine d’articles — pour y graver son propre nom : il ne le fera jamais, et le vide est resté. C’est là qu’une mission archéologique française la retrouve, en trois morceaux, pendant l’hiver **1901-1902**. Le père **Jean-Vincent Scheil** en publie la traduction dès 1902. La stèle est aujourd’hui au **musée du Louvre**, et elle se lit encore : c’est le plus vieux texte de loi que l’humanité puisse ouvrir à n’importe quelle page.',
      },
    ],
    chrono: [
      { date: 'vers 1792 av. J.-C.', fait: 'Hammourabi devient roi de Babylone.' },
      { date: '1763 av. J.-C.', fait: 'Conquête de Larsa : le sud mésopotamien est soumis.' },
      { date: '1761 av. J.-C.', fait: 'Prise de Mari, sur l’Euphrate.' },
      { date: 'vers 1755 av. J.-C.', fait: 'La stèle du code est gravée et dressée.' },
      { date: '1750 av. J.-C.', fait: 'Mort d’Hammourabi.' },
      { date: 'vers 1155 av. J.-C.', fait: 'Les Élamites emportent la stèle à Suse.' },
      { date: '1901-1902', fait: 'Une mission française la retrouve à Suse, en trois morceaux.' },
      { date: '1902', fait: 'Première traduction, par le père Scheil.' },
    ],
    leSaisTu:
      'Le code prévoit le jugement par l’eau : accusé de sorcellerie sans preuve, on vous jette dans le fleuve. Si vous coulez, l’accusateur prend votre maison ; si vous en sortez vivant, il est mis à mort et vous prenez la sienne. C’est l’article 2, le tout premier après l’accusation de meurtre.',
    aRetenir: [
      'Hammourabi règne sur Babylone d’environ 1792 à 1750 av. J.-C. et unifie la Mésopotamie.',
      'Son code compte 282 articles gravés en cunéiforme sur une stèle de pierre exposée en public.',
      'Il applique la loi du talion entre hommes libres : « œil pour œil, dent pour dent ».',
      'Les peines varient selon le rang social : homme libre, subalterne, esclave.',
      'La stèle, emportée à Suse vers 1155 av. J.-C., a été retrouvée en 1901 ; elle est au Louvre.',
    ],
    mots: [
      {
        mot: 'Cunéiforme',
        sens: 'Écriture en forme de coins, tracée avec un roseau taillé dans l’argile molle, inventée en Mésopotamie.',
      },
      {
        mot: 'Talion',
        sens: 'Principe qui veut que la punition soit exactement égale au dommage subi.',
      },
      {
        mot: 'Stèle',
        sens: 'Pierre dressée portant un texte ou une image, faite pour être vue de tous.',
      },
    ],
    lies: ['moise', 'ramses-ii', 'naissance-de-l-ecriture'],
    niveaux: ['6e'],
    programme: 'Premiers États, premières écritures',
    tags: [
      'Babylone',
      'Mésopotamie',
      'code',
      'talion',
      'cunéiforme',
      'Suse',
      'Louvre',
      'Shamash',
      'Euphrate',
      'loi écrite',
      'Hammurabi',
    ],
  },
  {
    id: 'moise',
    volet: 'personnages',
    nom: 'Moïse',
    surnom: 'celui qui fut tiré des eaux',
    dates: 'vers le XIIIᵉ siècle av. J.-C.',
    tri: -1250,
    periode: 'antiquite',
    emoji: '🏔️',
    roles: ['Prophète', 'Guide des Hébreux', 'Figure de la Bible'],
    origine: 'Égypte, selon le livre de l’Exode',
    accroche:
      'Le livre de l’Exode raconte comment un enfant sauvé des eaux fait sortir son peuple d’Égypte et reçoit au Sinaï une Loi que trois religions lisent encore.',
    citations: [
      {
        texte: 'Laisse partir mon peuple.',
        contexte:
          'À Pharaon, au nom du Dieu d’Israël, dans le livre de l’Exode (chapitre 5, verset 1).',
        sens:
          'La demande revient comme un refrain à chaque plaie d’Égypte. Devenue chant, elle a traversé les siècles : les esclaves des plantations américaines la chantaient encore au XIXᵉ siècle.',
      },
      {
        texte: 'Je suis celui qui suis.',
        qui: 'La voix du buisson ardent, dans le livre de l’Exode',
        contexte:
          'Réponse à Moïse qui demande quel nom donner à celui qui l’envoie (Exode 3, 14).',
        sens:
          'Le nom refuse d’être un nom comme les autres : ce Dieu-là ne se range pas dans la liste des dieux de l’Égypte ou de Babylone, il est le seul. C’est le cœur du monothéisme.',
      },
      {
        texte: 'Ôte tes sandales de tes pieds, car le lieu où tu te tiens est une terre sainte.',
        qui: 'La voix du buisson ardent',
        contexte: 'Au pied de l’Horeb, devant le buisson qui brûle sans se consumer (Exode 3, 5).',
      },
      {
        texte: 'Tu ne tueras point. Tu ne voleras point. Tu ne porteras pas de faux témoignage.',
        contexte: 'Trois des Dix Commandements reçus au mont Sinaï (Exode 20).',
        sens:
          'Le Décalogue tient en dix phrases très courtes : quatre sur ce qui est dû à Dieu, six sur ce qui est dû aux autres hommes. C’est cette forme brève qui l’a rendu mémorable.',
      },
    ],
    reperes: [
      'Sa vie est racontée par la Bible, dans le livre de l’Exode : c’est un récit fondateur, pas une chronique.',
      'Sauvé des eaux dans une corbeille, il est élevé à la cour de Pharaon selon le récit.',
      'Il conduit les Hébreux hors d’Égypte : la Pâque juive célèbre cette sortie chaque année.',
      'Au mont Sinaï, il reçoit les Dix Commandements, appelés aussi le Décalogue.',
      'Juifs, chrétiens et musulmans — qui le nomment Moussa — le reconnaissent comme prophète.',
      'Il meurt sur le mont Nébo, en vue de la Terre promise où il n’entrera pas.',
    ],
    recit: [
      {
        titre: 'Sauvé des eaux',
        texte:
          'Le **livre de l’Exode** ouvre sur une menace : les **Hébreux**, installés en Égypte depuis des générations, sont devenus si nombreux que Pharaon les réduit en esclavage et ordonne de noyer leurs nouveau-nés mâles. Une mère cache son fils trois mois, puis le dépose dans une corbeille de papyrus enduite de bitume, au bord du **Nil**. La fille de Pharaon l’y trouve, l’adopte et l’appelle **Moïse**, « parce que, dit-elle, je l’ai tiré des eaux ». Devenu adulte, il tue un contremaître égyptien qui frappait un Hébreu, et doit fuir au désert de **Madian**, où il se fait berger. C’est là, dit le récit, qu’il est rattrapé.',
      },
      {
        titre: 'Le buisson qui brûle sans se consumer',
        texte:
          'Sur la montagne d’**Horeb**, Moïse voit un buisson en flammes qui ne brûle pas. Une voix l’envoie vers Pharaon pour faire sortir son peuple ; Moïse se dérobe — il bégaie, dit-il, personne ne le croira — et demande au moins un nom à donner. Suit la réponse la plus commentée de toute la Bible : **« Je suis celui qui suis. »** Le récit enchaîne alors les **dix plaies d’Égypte** (l’eau changée en sang, les grenouilles, les sauterelles, les ténèbres, la mort des premiers-nés), la nuit de la **Pâque** où les Hébreux marquent leurs portes et mangent debout, prêts à partir, puis le **passage de la mer** : les eaux s’ouvrent devant les fuyards et se referment sur les chars lancés à leur poursuite. C’est la scène fondatrice — la sortie de l’esclavage.',
      },
      {
        titre: 'Le Sinaï et les Dix Commandements',
        texte:
          'Suivent **quarante ans de désert** : la faim, la soif, la **manne** ramassée chaque matin, les révoltes contre Moïse, l’envie de retourner en Égypte où l’on mangeait au moins à sa faim. Au troisième mois, le peuple campe devant le **mont Sinaï**. Moïse y monte seul et en redescend avec les **Tables de la Loi** : dix commandements qui établissent une **alliance** entre Dieu et son peuple — un seul Dieu, pas d’image taillée, un jour de repos, le respect des parents, et l’interdiction de tuer, de voler, de mentir, de convoiter. Pendant son absence, les Hébreux ont fondu un **veau d’or** ; de colère, Moïse brise les Tables, qu’il faudra graver de nouveau. La Loi n’est pas donnée à un homme sage : elle est donnée à un peuple qui vient de faillir.',
      },
      {
        titre: 'Ce que les historiens peuvent dire',
        texte:
          'Aucune source égyptienne ne mentionne Moïse ni la sortie d’Égypte, et les archéologues n’ont retrouvé aucune trace de campement au Sinaï. Les historiens situent la **mise par écrit** de ces récits entre le VIIIᵉ et le VIᵉ siècle av. J.-C., bien après les événements qu’ils rapportent, à partir de traditions transmises oralement. Cela ne diminue pas leur portée : le texte a fondé le **judaïsme**, première religion à n’adorer qu’un seul Dieu et à mettre sa loi par écrit ; le christianisme et l’islam l’ont reçu après lui. Le récit s’achève sur une image que la Bible n’adoucit pas : Moïse meurt au **mont Nébo**, à cent vingt ans, après avoir vu de loin la **Terre promise** où il n’entrera pas.',
      },
    ],
    chrono: [
      { date: 'Exode 2', fait: 'Sauvé des eaux, il est recueilli par la fille de Pharaon.' },
      { date: 'Exode 3', fait: 'Le buisson ardent : il est envoyé vers Pharaon.' },
      { date: 'Exode 7 à 12', fait: 'Les dix plaies d’Égypte et la première Pâque.' },
      { date: 'Exode 14', fait: 'Le passage de la mer : les Hébreux quittent l’Égypte.' },
      { date: 'Exode 20', fait: 'Les Dix Commandements au mont Sinaï.' },
      { date: 'Exode 32', fait: 'Le veau d’or : Moïse brise les Tables de la Loi.' },
      { date: 'Deutéronome 34', fait: 'Mort au mont Nébo, face à la Terre promise.' },
      { date: 'vers 1250 av. J.-C.', fait: 'Date traditionnelle de la sortie d’Égypte.' },
      { date: 'VIIIᵉ – VIᵉ s. av. J.-C.', fait: 'Mise par écrit du récit, en hébreu.' },
    ],
    leSaisTu:
      'Le texte explique lui-même le nom de Moïse : « je l’ai tiré des eaux » (Exode 2, 10). Les égyptologues remarquent qu’il ressemble aussi à un élément de vrais noms égyptiens — Thoutmôsis, Ramsès — où *mes* signifie « est né ». Un indice, pas une preuve.',
    aRetenir: [
      'Le livre de l’Exode, dans la Bible, raconte la sortie d’Égypte des Hébreux conduits par Moïse.',
      'La tradition situe cet Exode vers le XIIIᵉ siècle av. J.-C. ; aucune source égyptienne ne le mentionne.',
      'Au mont Sinaï, Moïse reçoit les Dix Commandements : c’est l’alliance entre Dieu et son peuple.',
      'Le judaïsme est la première religion monothéiste : un seul Dieu et une loi mise par écrit, la Torah.',
      'Moïse est reconnu comme prophète par les juifs, les chrétiens et les musulmans.',
    ],
    mots: [
      {
        mot: 'Monothéisme',
        sens: 'Croyance en un seul Dieu, par opposition au polythéisme qui en adore plusieurs.',
      },
      {
        mot: 'Exode',
        sens: 'La sortie d’Égypte des Hébreux — et le nom du livre de la Bible qui la raconte.',
      },
      {
        mot: 'Décalogue',
        sens: 'Les Dix Commandements reçus au Sinaï, du grec *deka* (dix) et *logos* (parole).',
      },
      {
        mot: 'Torah',
        sens: 'Les cinq premiers livres de la Bible hébraïque, lus dans les synagogues sur un rouleau.',
      },
    ],
    lies: ['hammourabi', 'ramses-ii'],
    niveaux: ['6e'],
    programme: 'Récits fondateurs, croyances et citoyenneté dans la Méditerranée antique',
    tags: [
      'Exode',
      'Bible',
      'Sinaï',
      'Dix Commandements',
      'Hébreux',
      'Pâque',
      'monothéisme',
      'Torah',
      'Moussa',
      'judaïsme',
      'buisson ardent',
    ],
  },
  {
    id: 'ramses-ii',
    volet: 'personnages',
    nom: 'Ramsès II',
    surnom: 'le grand bâtisseur',
    dates: '1279 – 1213 av. J.-C.',
    tri: -1213,
    periode: 'antiquite',
    emoji: '🗿',
    roles: ['Pharaon d’Égypte', 'Chef de guerre', 'Bâtisseur'],
    origine: 'Delta du Nil, Égypte',
    accroche:
      'Soixante-six ans de règne, une bataille manquée transformée en chef-d’œuvre de propagande, et le premier traité de paix écrit de l’histoire.',
    citations: [
      {
        texte:
          'Mes soldats m’ont abandonné, mes chars se sont enfuis : aucun d’eux ne s’est retourné. Je suis seul, et nul autre n’est avec moi !',
        contexte:
          'Le Poème de Qadesh, gravé sur les murs de Karnak, Louxor et Abou Simbel après la bataille de 1274 av. J.-C.',
        sens:
          'Pharaon raconte lui-même qu’il s’est retrouvé encerclé, abandonné des siens — pour que sa sortie du piège paraisse surhumaine. La faiblesse est mise en scène au service de la gloire.',
      },
      {
        texte:
          'Une bonne paix et une bonne fraternité entre nous, pour toujours.',
        contexte:
          'Traité conclu avec Hattousili III, roi des Hittites, en 1259 av. J.-C., seize ans après la bataille.',
        sens:
          'C’est le plus ancien traité de paix dont on possède le texte, en égyptien d’un côté, en akkadien de l’autre : non-agression, alliance militaire, renvoi des fugitifs.',
      },
      {
        texte:
          'Je suis Ozymandias, roi des rois. Si quelqu’un veut savoir combien je suis grand et où je repose, qu’il surpasse l’une de mes œuvres.',
        contexte:
          'Inscription d’une statue colossale du Ramesseum, rapportée par l’historien grec Diodore de Sicile, mille ans plus tard.',
        sens:
          'Personne n’a jamais retrouvé cette inscription sur la pierre : elle nous vient d’un voyageur grec et reste invérifiable. Elle a inspiré au poète Shelley, en 1818, le célèbre sonnet *Ozymandias*.',
        incertaine: true,
      },
    ],
    reperes: [
      'Pharaon pendant soixante-six ans, de 1279 à 1213 av. J.-C. ; il meurt vers quatre-vingt-dix ans.',
      'Bataille de Qadesh, en 1274 av. J.-C. : un match nul raconté partout comme un triomphe.',
      'En 1259 av. J.-C., il signe avec les Hittites le premier traité de paix connu de l’histoire.',
      'Bâtisseur : Abou Simbel, le Ramesseum, la salle hypostyle de Karnak, sa capitale Pi-Ramsès.',
      'Une centaine d’enfants ; son fils Mérenptah lui succède à plus de soixante ans.',
      'Sa momie, retrouvée en 1881, a été soignée à Paris en 1976 — avec un passeport égyptien.',
    ],
    recit: [
      {
        titre: 'Soixante-six ans sur le trône',
        texte:
          'Ramsès II monte sur le trône vers vingt-cinq ans, en **1279 av. J.-C.**, et règne **soixante-six ans** — plus longtemps que Louis XIV. À sa mort, les Égyptiens nés sous son règne sont grands-parents et n’ont jamais connu d’autre pharaon. Il déplace la capitale du sud vers le delta, à **Pi-Ramsès**, plus près de la frontière menacée d’Asie, et y installe des casernes, des écuries pour des milliers de chevaux et des ateliers d’armes. Il aura une centaine d’enfants de plusieurs épouses, dont la plus célèbre, **Néfertari**, reçoit à Abou Simbel un temple à son nom : « celle pour qui le soleil se lève ».',
      },
      {
        titre: 'Qadesh : le désastre changé en chef-d’œuvre',
        texte:
          'En **1274 av. J.-C.**, il marche sur **Qadesh**, en Syrie, contre les **Hittites** de Muwatalli II : environ vingt mille hommes de chaque côté et des milliers de chars, l’une des plus grandes batailles de chars de l’Antiquité. Trompé par deux faux déserteurs, Ramsès avance avec une seule de ses quatre divisions et tombe dans une embuscade. Il s’en sort de justesse, l’arrivée d’une colonne de renfort évite le désastre, et la ville reste hittite. Rentré en Égypte, il fait graver l’épisode — le **Poème de Qadesh** et ses images — sur les murs de cinq temples, avec lui seul au milieu des ennemis. Résultat : l’une des rares batailles du IIᵉ millénaire dont nous connaissons le déroulement heure par heure… racontée par le camp qui ne l’a pas gagnée.',
      },
      {
        titre: 'Le premier traité de paix de l’histoire',
        texte:
          'Seize ans plus tard, ni l’Égypte ni le Hatti ne peuvent l’emporter, et une nouvelle puissance monte à l’est, l’Assyrie. En **1259 av. J.-C.**, Ramsès II et le roi hittite **Hattousili III** signent un traité : arrêt des combats, frontière reconnue, secours mutuel en cas d’attaque, extradition des fugitifs — avec la promesse qu’ils seront traités sans cruauté. Le texte nous est parvenu en double : gravé en **hiéroglyphes** sur un mur de Karnak, et copié en **akkadien** sur des tablettes d’argile retrouvées dans les archives hittites de Boğazköy, en Turquie. Un agrandissement de l’une de ces tablettes est affiché au siège de l’**ONU**, à New York. La paix tiendra plus de soixante-dix ans, scellée par le mariage de Ramsès avec une princesse hittite.',
      },
      {
        titre: 'Bâtir pour l’éternité',
        texte:
          'Aucun pharaon n’a autant construit. Il achève la **salle hypostyle de Karnak** et ses 134 colonnes, élève le **Ramesseum** sur la rive ouest de Thèbes, couvre l’Égypte et la Nubie de statues à son effigie — quitte à faire regraver son nom sur des monuments plus anciens. Le chef-d’œuvre est **Abou Simbel**, taillé en plein grès : quatre colosses de vingt mètres assis devant la façade, et un couloir calculé pour que, deux fois par an, le soleil levant aille éclairer au fond du sanctuaire les statues des dieux. En **1964-1968**, la montée des eaux du barrage d’Assouan allait le noyer : le temple a été découpé en 1 035 blocs, remonté soixante-cinq mètres plus haut par une opération internationale de l’UNESCO, et le rayon de soleil tombe toujours juste — à un jour près.',
      },
    ],
    chrono: [
      { date: '1279 av. J.-C.', fait: 'Ramsès II monte sur le trône d’Égypte.' },
      { date: '1274 av. J.-C.', fait: 'Bataille de Qadesh contre les Hittites.' },
      { date: '1259 av. J.-C.', fait: 'Traité de paix avec Hattousili III.' },
      { date: 'vers 1255 av. J.-C.', fait: 'Achèvement des temples d’Abou Simbel.' },
      { date: '1213 av. J.-C.', fait: 'Mort après soixante-six ans de règne.' },
      { date: '1881', fait: 'Sa momie est retrouvée dans la cachette de Deir el-Bahari.' },
      { date: '1968', fait: 'Abou Simbel est remonté 65 m plus haut, loin du barrage.' },
      { date: '1976', fait: 'La momie est traitée à Paris contre un champignon.' },
    ],
    leSaisTu:
      'En 1976, la momie de Ramsès II, rongée par un champignon, part se faire soigner à Paris. La loi française exigeant des papiers pour tout voyageur, l’Égypte lui délivre un passeport, profession : « roi (décédé) ». À l’arrivée au Bourget, elle est accueillie avec les honneurs militaires dus à un chef d’État.',
    aRetenir: [
      'Ramsès II est pharaon de 1279 à 1213 av. J.-C., soit soixante-six ans de règne.',
      'La bataille de Qadesh (1274 av. J.-C.) contre les Hittites est un match nul présenté comme une victoire.',
      'Le traité de 1259 av. J.-C. avec les Hittites est le plus ancien traité de paix conservé.',
      'Il fait construire Abou Simbel, le Ramesseum et achève la salle hypostyle de Karnak.',
      'Ses monuments couverts de hiéroglyphes sont notre principale source sur son règne.',
    ],
    mots: [
      {
        mot: 'Pharaon',
        sens: 'Le roi d’Égypte, considéré comme le fils des dieux et garant de l’ordre du monde.',
      },
      {
        mot: 'Hiéroglyphes',
        sens: 'L’écriture sacrée des Égyptiens, faite de dessins, déchiffrée par Champollion en 1822.',
      },
      {
        mot: 'Momie',
        sens: 'Corps préparé et desséché pour être conservé, afin que le défunt vive dans l’au-delà.',
      },
    ],
    lies: ['moise', 'hammourabi'],
    niveaux: ['6e'],
    programme: 'Premiers États, premières écritures',
    tags: [
      'Égypte',
      'pharaon',
      'Qadesh',
      'Hittites',
      'Abou Simbel',
      'Ramesseum',
      'Karnak',
      'momie',
      'traité de paix',
      'Néfertari',
      'Nil',
    ],
  },
  {
    id: 'homere',
    volet: 'personnages',
    nom: 'Homère',
    surnom: 'l’aède aveugle',
    dates: 'VIIIᵉ siècle av. J.-C.',
    tri: -750,
    periode: 'antiquite',
    emoji: '📖',
    roles: ['Poète', 'Aède'],
    origine: 'Ionie, côte d’Asie Mineure (selon la tradition)',
    accroche:
      'On ne sait pas s’il a existé, mais toute la Grèce a appris à lire, à parler et à vivre dans ses deux poèmes : l’Iliade et l’Odyssée.',
    citations: [
      {
        texte: 'Chante, déesse, la colère d’Achille, fils de Pélée.',
        contexte: 'Premier vers de *l’Iliade*.',
        sens:
          'Le poème ne commence pas par la guerre de Troie mais par une humeur : la colère d’un homme, et tout ce qu’elle coûte à son camp. C’est le premier vers de la littérature européenne.',
      },
      {
        texte: 'Muse, dis-moi l’homme aux mille tours, qui erra si longtemps.',
        contexte: 'Premier vers de *l’Odyssée*.',
        sens:
          '« Aux mille tours » traduit *polytropos* : l’homme aux mille ruses, aux mille détours. Tout Ulysse tient dans ce mot.',
      },
      {
        texte: 'Personne est mon nom : mon père, ma mère et mes compagnons m’appellent Personne.',
        contexte: 'Ulysse au cyclope Polyphème, avant de l’aveugler (*l’Odyssée*, chant IX).',
        sens:
          'La ruse est parfaite : le cyclope blessé hurle que « Personne » l’a attaqué, et ses voisins, rassurés, retournent se coucher.',
      },
      {
        texte:
          'J’aimerais mieux être valet de charrue chez un paysan sans terre que de régner sur tous les morts.',
        qui: 'L’ombre d’Achille, aux Enfers',
        contexte: 'À Ulysse descendu chez les morts (*l’Odyssée*, chant XI).',
        sens:
          'Le plus grand des héros, mort jeune et couvert de gloire, dit qu’il échangerait tout contre une vie de misère — mais vivante.',
      },
    ],
    reperes: [
      'Poète grec du VIIIᵉ siècle av. J.-C. : on ne sait presque rien de lui, sept villes se disputent sa naissance.',
      '*L’Iliade* : 24 chants, plus de 15 000 vers, cinquante et un jours de la dixième année du siège de Troie.',
      '*L’Odyssée* : 24 chants, près de 12 000 vers, le retour d’Ulysse à Ithaque en dix ans.',
      'Les poèmes étaient chantés de mémoire par des aèdes bien avant d’être mis par écrit.',
      'On les a appelés « la Bible des Grecs » : on y apprenait à lire, à parler et à se conduire.',
    ],
    recit: [
      {
        titre: 'Un poète dont on ne sait rien',
        texte:
          'Aveugle, errant, chantant de ville en ville : le portrait d’**Homère** est une tradition, pas un état civil. Sept cités au moins — Smyrne, Chios, Colophon, Ithaque, Argos, Athènes, Rhodes — ont prétendu l’avoir vu naître. Depuis le XVIIIᵉ siècle, les savants se disputent : un seul homme, ou plusieurs générations d’**aèdes** ? La réponse est venue des années 1930, quand l’Américain **Milman Parry** est allé écouter, en Yougoslavie, des chanteurs illettrés capables de réciter des heures d’épopée. Il a montré que les formules qui reviennent sans cesse chez Homère — « l’aurore aux doigts de rose », « Achille aux pieds légers », « la mer vineuse » — sont des **briques de mémoire** : des groupes de mots calibrés pour tomber juste dans le vers et permettre de chanter sans texte. Homère est le sommet d’une tradition orale, peut-être son premier auteur écrit.',
      },
      {
        titre: 'L’Iliade : la colère d’un homme',
        texte:
          '*L’Iliade* ne raconte ni le début ni la fin de la guerre de Troie : elle prend cinquante et un jours de la dixième année. Le roi **Agamemnon** enlève à **Achille** sa captive Briséis ; humilié, le meilleur guerrier grec se retire sous sa tente et laisse les siens se faire massacrer. Son ami **Patrocle** emprunte son armure pour sauver l’armée et se fait tuer par **Hector**, fils du roi de Troie. Achille revient alors — non par patriotisme, mais par chagrin et par fureur —, tue Hector et traîne son corps autour de la ville. Le poème s’achève sur la scène la plus douce de toute l’épopée : le vieux roi **Priam** traverse de nuit le camp ennemi, s’agenouille devant l’assassin de son fils et lui baise les mains pour réclamer le cadavre. Achille pleure avec lui et le lui rend.',
      },
      {
        titre: 'L’Odyssée : dix ans pour rentrer chez soi',
        texte:
          'L’autre poème est son contraire : pas de champ de bataille, mais un homme qui veut rentrer. **Ulysse** met dix ans à revenir de Troie jusqu’à **Ithaque**. En chemin : le cyclope **Polyphème** aveuglé par un pieu, la magicienne **Circé** qui change ses compagnons en porcs, les **sirènes** qu’il écoute attaché au mât, les monstres **Charybde et Scylla**, sept ans retenu par la nymphe **Calypso** qui lui offre l’immortalité — et qu’il refuse. Pendant ce temps, à Ithaque, sa femme **Pénélope** tient tête à cent huit prétendants en défaisant chaque nuit la toile qu’elle tisse le jour. Ulysse rentre déguisé en mendiant, seul son vieux chien Argos le reconnaît, et il reprend sa maison à l’arc. Une épopée où l’on gagne par la ruse et la patience, pas par la force.',
      },
      {
        titre: 'Troie a-t-elle existé ?',
        texte:
          'Les Grecs n’en doutaient pas. En **1870**, un négociant allemand fou d’Homère, **Heinrich Schliemann**, se met à creuser la colline d’**Hisarlik**, en Turquie, l’*Iliade* à la main — et trouve non pas une ville, mais neuf villes superposées. L’une d’elles, détruite par un incendie vers **1180 av. J.-C.**, correspond à peu près à la date que les Grecs donnaient à la chute de Troie. Rien ne prouve qu’Achille ou Hector aient existé, mais le décor, lui, est réel : une cité fortifiée qui contrôlait l’entrée des Détroits, et qui a brûlé. Quatre siècles plus tard, Homère chantait un monde déjà ancien pour ses auditeurs — comme si nous racontions aujourd’hui les croisades.',
      },
    ],
    chrono: [
      { date: 'vers 1180 av. J.-C.', fait: 'Date traditionnelle de la chute de Troie.' },
      { date: 'VIIIᵉ s. av. J.-C.', fait: 'Composition de *l’Iliade* et de *l’Odyssée*.' },
      { date: 'VIᵉ s. av. J.-C.', fait: 'À Athènes, le texte des deux poèmes est fixé par écrit.' },
      { date: 'IIIᵉ s. av. J.-C.', fait: 'Les savants d’Alexandrie les découpent en 24 chants.' },
      { date: '1870', fait: 'Schliemann fouille la colline d’Hisarlik et trouve neuf villes.' },
      { date: 'années 1930', fait: 'Milman Parry perce le secret des formules orales.' },
    ],
    leSaisTu:
      'En 1873, Schliemann exhume à Troie un magot d’or qu’il baptise « le trésor de Priam » et dont il pare sa femme Sophia pour la photo. Les archéologues ont depuis daté ces bijoux : ils ont environ mille ans de plus que la guerre de Troie. Priam n’a jamais pu les voir.',
    aRetenir: [
      'Homère est le poète grec auquel on attribue *l’Iliade* et *l’Odyssée*, au VIIIᵉ siècle av. J.-C.',
      '*L’Iliade* raconte la colère d’Achille pendant le siège de Troie ; *l’Odyssée*, le retour d’Ulysse.',
      'Ces épopées étaient chantées oralement par des aèdes avant d’être mises par écrit.',
      'Elles sont le socle de la culture grecque : récits fondateurs, dieux de l’Olympe, modèles de héros.',
      'Les fouilles d’Hisarlik, dès 1870, ont montré qu’une ville détruite vers 1180 av. J.-C. existait bien.',
    ],
    mots: [
      {
        mot: 'Aède',
        sens: 'Poète grec qui chantait les épopées de mémoire, en s’accompagnant d’une lyre.',
      },
      {
        mot: 'Épopée',
        sens: 'Long poème qui raconte les exploits de héros, mêlant les hommes et les dieux.',
      },
      {
        mot: 'Épithète homérique',
        sens: 'Formule collée à un nom — « Ulysse aux mille ruses » — qui aidait l’aède à chanter sans texte.',
      },
    ],
    lies: ['pericles', 'alexandre-le-grand', 'moise'],
    niveaux: ['6e'],
    programme: 'Récits fondateurs, croyances et citoyenneté dans la Méditerranée antique',
    tags: [
      'Iliade',
      'Odyssée',
      'Troie',
      'Ulysse',
      'Achille',
      'aède',
      'épopée',
      'Grèce',
      'Schliemann',
      'Pénélope',
      'cyclope',
    ],
  },
  {
    id: 'pericles',
    volet: 'personnages',
    nom: 'Périclès',
    surnom: 'le premier des Athéniens',
    dates: 'vers 495 – 429 av. J.-C.',
    tri: -429,
    periode: 'antiquite',
    emoji: '🏛️',
    roles: ['Stratège d’Athènes', 'Homme politique', 'Bâtisseur du Parthénon'],
    origine: 'Athènes',
    accroche:
      'Quinze fois élu stratège, il fait bâtir le Parthénon, paie les pauvres pour qu’ils siègent au tribunal, et donne à la démocratie sa plus belle définition.',
    citations: [
      {
        texte:
          'Notre régime s’appelle démocratie parce que le pouvoir est entre les mains non d’une minorité, mais du plus grand nombre.',
        contexte:
          'Oraison funèbre des premiers morts de la guerre du Péloponnèse, hiver 431-430 av. J.-C., rapportée par Thucydide.',
        sens:
          'C’est la plus ancienne définition de la démocratie qui nous soit parvenue : *dêmos*, le peuple, *kratos*, le pouvoir.',
      },
      {
        texte:
          'Nous sommes les seuls à considérer celui qui ne prend aucune part aux affaires publiques non comme un homme tranquille, mais comme un citoyen inutile.',
        contexte: 'Même discours, rapporté par Thucydide dans *la Guerre du Péloponnèse*.',
        sens:
          'À Athènes, se désintéresser de la politique n’est pas un droit : c’est un manquement. La cité attend de chaque citoyen qu’il vote, siège au tribunal et prenne la parole.',
      },
      {
        texte: 'Notre cité tout entière est l’école de la Grèce.',
        contexte: 'Oraison funèbre, 431-430 av. J.-C.',
      },
      {
        texte: 'La terre entière est le tombeau des hommes illustres.',
        contexte: 'Fin de l’oraison funèbre, devant les familles des soldats tués.',
        sens:
          'Ceux qui ont bien servi leur cité n’ont pas besoin d’un monument : leur souvenir est gravé partout, dans la mémoire des hommes plutôt que dans la pierre.',
      },
    ],
    reperes: [
      'Élu stratège quinze années de suite, de 443 à 429 av. J.-C., par une assemblée qui votait chaque année.',
      'Il fait payer les juges des tribunaux (le misthos) : un citoyen pauvre peut enfin siéger.',
      'Il lance le chantier de l’Acropole : le Parthénon est bâti de 447 à 432 av. J.-C.',
      'Athènes dirige la ligue de Délos et en a transféré le trésor sur son Acropole en 454.',
      'La guerre contre Sparte éclate en 431 ; une épidémie emporte un tiers des Athéniens — et lui, en 429.',
    ],
    recit: [
      {
        titre: 'Le pouvoir d’un homme dans une cité qui vote',
        texte:
          'Périclès n’est ni roi ni dictateur : il est **stratège**, un poste militaire électif, et les Athéniens le réélisent quinze fois de suite. Son seul pouvoir est de convaincre l’**Ecclésia**, l’assemblée du peuple, qui se réunit une quarantaine de fois par an sur la colline de la **Pnyx** et où n’importe quel citoyen peut prendre la parole. Il fait voter le **misthos**, une indemnité de deux oboles versée aux juges du tribunal des Héliastes : sans elle, seuls les riches pouvaient perdre une journée de travail pour rendre la justice. La démocratie athénienne reste pourtant étroite : sur quelque 300 000 habitants, environ **40 000 citoyens** seulement — ni les femmes, ni les esclaves, ni les métèques, ces étrangers installés à Athènes.',
      },
      {
        titre: 'Le chantier de l’Acropole',
        texte:
          'En 447 av. J.-C., Périclès ouvre le plus grand chantier du monde grec. Sur l’**Acropole** brûlée par les Perses trente ans plus tôt s’élèvent le **Parthénon** (architectes Ictinos et Callicratès, sculpteur **Phidias**), les Propylées, le temple d’Athéna Nikè, puis l’Érechthéion. Le Parthénon abrite une statue d’**Athéna** haute de douze mètres, en or et en ivoire. Les colonnes sont légèrement bombées et inclinées vers l’intérieur pour corriger l’illusion d’optique : vues d’en bas, elles paraissent parfaitement droites. Le financement fait scandale — l’argent vient du trésor de la **ligue de Délos**, versé par les cités alliées pour se défendre des Perses. Périclès répond, en substance, que la protection est assurée et que le reste regarde Athènes. Le chantier emploie des milliers d’ouvriers et fait vivre la ville.',
      },
      {
        titre: 'L’oraison funèbre : une démocratie qui se décrit',
        texte:
          'À l’hiver **431-430 av. J.-C.**, Athènes enterre ses premiers morts de la guerre. L’usage veut qu’un citoyen prononce l’éloge des défunts ; c’est Périclès qui parle. Au lieu de nommer les tués un à un, il fait le portrait de la cité pour laquelle ils sont morts : un régime où l’on est jugé sur son mérite et non sur sa naissance, où la pauvreté n’empêche pas de servir, où l’on discute avant d’agir au lieu d’agir par ignorance, où l’on aime la beauté « sans mollesse » et le savoir « sans faiblesse ». Le texte nous est connu par l’historien **Thucydide**, qui l’a entendu et reconstruit : c’est le discours le plus cité de toute l’Antiquité, et la démocratie n’a jamais fait mieux pour se définir elle-même.',
      },
      {
        titre: 'La guerre, la peste, la chute',
        texte:
          'Sparte et ses alliés ne supportent plus la puissance d’Athènes : la **guerre du Péloponnèse** éclate en **431 av. J.-C.** et durera vingt-sept ans. La stratégie de Périclès est de tout miser sur la flotte, d’abandonner les campagnes et de faire entrer toute l’Attique derrière les **Longs Murs** qui relient la ville au port du Pirée. La ville, surpeuplée, devient un piège : en **430**, une **épidémie** — peut-être une fièvre typhoïde — emporte peut-être un tiers de la population. Les Athéniens lui font payer : il est destitué et condamné à une amende, puis réélu quelques mois plus tard. La maladie a tué ses deux fils légitimes ; elle l’emporte lui-même à l’automne **429 av. J.-C.** Athènes perdra la guerre vingt-cinq ans plus tard, mais le siècle gardera son nom.',
      },
    ],
    chrono: [
      { date: 'vers 495 av. J.-C.', fait: 'Naissance à Athènes, dans la famille des Alcméonides.' },
      { date: '461 av. J.-C.', fait: 'Réformes démocratiques ; son rival Cimon est ostracisé.' },
      { date: '454 av. J.-C.', fait: 'Le trésor de la ligue de Délos est transféré à Athènes.' },
      { date: '451 av. J.-C.', fait: 'Loi réservant la citoyenneté aux fils de deux parents athéniens.' },
      { date: '447 av. J.-C.', fait: 'Début du chantier du Parthénon.' },
      { date: '443 av. J.-C.', fait: 'Premier d’une série de quinze mandats de stratège.' },
      { date: '431 av. J.-C.', fait: 'Début de la guerre du Péloponnèse ; oraison funèbre.' },
      { date: '430 av. J.-C.', fait: 'L’épidémie ravage Athènes assiégée.' },
      { date: '429 av. J.-C.', fait: 'Mort de Périclès.' },
    ],
    leSaisTu:
      'Périclès avait, dit-on, le crâne anormalement allongé, et les poètes comiques le surnommaient « tête d’oignon ». Les sculpteurs ont trouvé la parade : toutes ses statues antiques le représentent coiffé d’un casque de stratège relevé sur le front. Pas un seul portrait ne montre son crâne nu.',
    aRetenir: [
      'Périclès dirige Athènes comme stratège élu, de 443 à 429 av. J.-C., dans un régime démocratique.',
      'Il instaure le misthos, indemnité qui permet aux citoyens pauvres de participer à la justice.',
      'Il fait construire le Parthénon (447-432 av. J.-C.) avec le trésor de la ligue de Délos.',
      'Son oraison funèbre, rapportée par Thucydide, définit la démocratie comme le pouvoir du plus grand nombre.',
      'La citoyenneté athénienne exclut les femmes, les métèques et les esclaves : environ 40 000 citoyens.',
    ],
    mots: [
      {
        mot: 'Démocratie',
        sens: 'Du grec *dêmos* (le peuple) et *kratos* (le pouvoir) : le gouvernement par les citoyens.',
      },
      {
        mot: 'Stratège',
        sens: 'Magistrat élu chaque année à Athènes, chef militaire et, de fait, chef politique.',
      },
      {
        mot: 'Ecclésia',
        sens: 'L’assemblée de tous les citoyens athéniens, qui votait les lois sur la colline de la Pnyx.',
      },
      {
        mot: 'Métèque',
        sens: 'Étranger installé à Athènes : libre, il paie l’impôt et sert à l’armée, mais ne vote pas.',
      },
    ],
    lies: ['socrate', 'homere', 'platon'],
    niveaux: ['6e', '2de'],
    programme: 'La cité des Athéniens (Vᵉ siècle av. J.-C.) : citoyenneté et démocratie',
    tags: [
      'Athènes',
      'démocratie',
      'Parthénon',
      'Acropole',
      'stratège',
      'Ecclésia',
      'Thucydide',
      'ligue de Délos',
      'Phidias',
      'guerre du Péloponnèse',
    ],
  },
  {
    id: 'socrate',
    volet: 'personnages',
    nom: 'Socrate',
    surnom: 'l’homme qui posait des questions',
    dates: 'vers 470 – 399 av. J.-C.',
    tri: -399,
    periode: 'antiquite',
    emoji: '💭',
    roles: ['Philosophe', 'Citoyen d’Athènes', 'Maître de Platon'],
    origine: 'Athènes',
    accroche:
      'Il n’a pas écrit une ligne : il posait des questions sur la place publique — et Athènes l’a condamné à boire la ciguë pour cela.',
    citations: [
      {
        texte: 'Connais-toi toi-même.',
        contexte:
          'Maxime gravée au fronton du temple d’Apollon à Delphes, que Socrate reprend sans cesse (Platon, *Charmide*).',
        sens:
          'La phrase n’est pas de lui : il l’a faite sienne. Elle veut dire : commence par savoir ce que tu es et ce que tu ignores, avant de juger le monde.',
      },
      {
        texte: 'Tout ce que je sais, c’est que je ne sais rien.',
        contexte: 'Formule résumée par la postérité, à partir de son procès de 399 av. J.-C.',
        sens:
          'Socrate n’a pas dit exactement cela. Dans *l’Apologie*, Platon lui fait dire : « Je ne crois pas savoir ce que je ne sais pas. » Nuance décisive — il ne se vante pas d’ignorer tout, il refuse de croire qu’il sait.',
        incertaine: true,
      },
      {
        texte: 'Une vie sans examen ne vaut pas la peine d’être vécue.',
        contexte: 'Devant ses juges, qui lui proposaient de se taire pour avoir la vie sauve (Platon, *Apologie*).',
        sens:
          'On lui offrait l’exil ou le silence : il répond qu’une vie où l’on cesse de se demander ce qui est juste n’est plus une vie d’homme.',
      },
      {
        texte: 'Criton, nous devons un coq à Asclépios ; payez cette dette, ne l’oubliez pas.',
        contexte: 'Ses dernières paroles, après avoir bu la ciguë (Platon, *Phédon*).',
        sens:
          'On offrait un coq à Asclépios, dieu de la médecine, quand on guérissait. Socrate remercie donc d’être guéri — de la vie. C’est sa dernière ironie.',
      },
    ],
    reperes: [
      'Fils d’un tailleur de pierre et d’une sage-femme ; il dit exercer sur les idées le métier de sa mère.',
      'Il n’a rien écrit : on ne le connaît que par Platon, Xénophon et le comique Aristophane.',
      'L’oracle de Delphes l’a déclaré le plus sage des hommes : il passera sa vie à vérifier pourquoi.',
      'Soldat courageux à Potidée, Délion et Amphipolis pendant la guerre du Péloponnèse.',
      'Jugé en 399 av. J.-C. pour impiété et corruption de la jeunesse, déclaré coupable par 280 voix contre 220.',
      'Il refuse de s’évader et boit la ciguë au soir du dernier jour.',
    ],
    recit: [
      {
        titre: 'Un homme laid qui arrête les passants',
        texte:
          'Petit, ventru, le nez épaté, pieds nus en toute saison : ses amis le comparaient à un **silène**, ces figurines grotesques qu’on ouvrait pour y trouver une statue de dieu. Socrate ne tient pas école et ne fait pas payer — c’est ce qui le sépare des **sophistes**, ces professeurs itinérants qui monnayaient l’art de convaincre. Il arpente l’**agora** d’Athènes, aborde un général, un poète, un artisan, et leur demande ce qu’est le courage, la beauté, la justice. Chacun répond sans hésiter ; puis les questions arrivent, et la réponse s’effondre. Il appelle sa méthode la **maïeutique**, l’art d’accoucher les esprits : il n’apprend rien à personne, il fait sortir de son interlocuteur ce que celui-ci ignorait penser — ou ignorait ne pas savoir.',
      },
      {
        titre: 'L’oracle et l’enquête',
        texte:
          'Son ami Chéréphon va un jour interroger l’oracle de **Delphes** : y a-t-il un homme plus sage que Socrate ? La Pythie répond que non. Socrate, stupéfait, entreprend de prouver que l’oracle se trompe. Il interroge les hommes politiques : ils croient savoir gouverner. Les poètes : ils font de belles choses sans pouvoir expliquer comment. Les artisans : ils savent leur métier et s’imaginent aussitôt tout savoir du reste. Conclusion : sa **seule supériorité** est de connaître l’étendue de son ignorance. L’enquête lui vaut une réputation de sagesse — et une collection d’ennemis, car nul n’aime être démonté en public devant ses élèves et ses voisins.',
      },
      {
        titre: 'Le procès de 399',
        texte:
          'Le contexte pèse lourd. Athènes a perdu la guerre en **404 av. J.-C.** ; Sparte y a installé les **Trente Tyrans**, dont **Critias**, ancien familier de Socrate ; un autre de ses proches, **Alcibiade**, avait trahi la cité. La démocratie rétablie cherche des responsables. Trois citoyens — Mélétos, Anytos et Lycon — l’accusent de ne pas reconnaître les dieux de la cité, d’en introduire de nouveaux et de **corrompre la jeunesse**. Devant les cinq cents jurés, Socrate ne demande pas grâce : il explique qu’il a rendu service à la ville comme un **taon** qui pique un cheval trop lourd pour le réveiller, et propose, en guise de peine, d’être nourri gratuitement au Prytanée, l’honneur réservé aux vainqueurs olympiques. Les juges votent la mort.',
      },
      {
        titre: 'La ciguë, et le refus de s’enfuir',
        texte:
          'L’exécution est retardée d’un mois : un navire sacré est parti pour Délos, et la cité ne peut mettre personne à mort avant son retour. Ses amis achètent les gardiens et organisent son évasion ; **Criton** vient le supplier de partir. Socrate refuse : il a vécu soixante-dix ans sous les lois d’Athènes, il en a profité, il n’a pas le droit de les briser le jour où elles lui déplaisent. Le soir venu, il boit la **ciguë**, marche jusqu’à ce que ses jambes s’alourdissent, s’allonge, et parle jusqu’au bout. La scène, racontée par Platon dans *le Phédon*, est devenue le modèle de la mort du juste. Avec lui, dira **Cicéron**, la philosophie « est descendue du ciel sur la terre » : elle cesse d’expliquer les astres pour demander comment il faut vivre.',
      },
    ],
    chrono: [
      { date: 'vers 470 av. J.-C.', fait: 'Naissance à Athènes.' },
      { date: '432-422 av. J.-C.', fait: 'Il combat comme hoplite à Potidée, Délion, Amphipolis.' },
      { date: '423 av. J.-C.', fait: 'Aristophane le caricature dans sa comédie *les Nuées*.' },
      { date: '406 av. J.-C.', fait: 'Seul, il s’oppose au jugement illégal des généraux des Arginuses.' },
      { date: '404 av. J.-C.', fait: 'Athènes capitule ; les Trente Tyrans prennent le pouvoir.' },
      { date: '403 av. J.-C.', fait: 'La démocratie est rétablie ; les comptes se règlent.' },
      { date: '399 av. J.-C.', fait: 'Procès, condamnation, mort par la ciguë.' },
    ],
    leSaisTu:
      'Vingt-quatre ans avant son procès, Aristophane l’avait mis en scène dans *les Nuées*, suspendu dans une corbeille au-dessus du théâtre, étudiant les nuages et apprenant aux fils à rouler leur père. Des milliers d’Athéniens avaient ri. Socrate dira à ses juges que ces accusateurs-là, comiques et anciens, sont les plus difficiles à réfuter.',
    aRetenir: [
      'Socrate vit à Athènes de 470 à 399 av. J.-C. et n’a laissé aucun écrit.',
      'Sa méthode, la maïeutique, consiste à questionner pour faire découvrir à l’autre ce qu’il ignore.',
      'Il est connu par les dialogues de son élève Platon, par Xénophon et par Aristophane.',
      'Accusé d’impiété et de corrompre la jeunesse, il est condamné à mort en 399 av. J.-C.',
      'Il refuse de s’évader par respect des lois de la cité et boit la ciguë.',
    ],
    mots: [
      {
        mot: 'Philosophie',
        sens: 'Du grec : « amour de la sagesse ». Chercher par la raison ce qui est vrai, juste et bon.',
      },
      {
        mot: 'Maïeutique',
        sens: 'L’art d’accoucher les esprits : faire trouver la réponse par des questions, sans la donner.',
      },
      {
        mot: 'Sophiste',
        sens: 'Maître payé qui enseignait l’art de convaincre, avec ou sans souci de la vérité.',
      },
      {
        mot: 'Ciguë',
        sens: 'Plante vénéneuse dont le poison servait aux exécutions à Athènes.',
      },
    ],
    lies: ['platon', 'aristote', 'pericles'],
    niveaux: ['6e', '2de'],
    programme: 'La cité des Athéniens (Vᵉ siècle av. J.-C.) : citoyenneté et démocratie',
    tags: [
      'Athènes',
      'philosophie',
      'maïeutique',
      'ciguë',
      'Delphes',
      'Platon',
      'procès',
      'agora',
      'sophistes',
      'Apologie',
    ],
  },
  {
    id: 'platon',
    volet: 'personnages',
    nom: 'Platon',
    surnom: 'le maître de l’Académie',
    dates: 'vers 428 – 348 av. J.-C.',
    tri: -347,
    periode: 'antiquite',
    emoji: '🏫',
    roles: ['Philosophe', 'Fondateur de l’Académie', 'Écrivain'],
    origine: 'Athènes',
    accroche:
      'Bouleversé par la mort de Socrate, il fonde la première école de philosophie d’Occident et compare les hommes à des prisonniers qui regardent des ombres.',
    citations: [
      {
        texte:
          'Ils sont là depuis l’enfance, les jambes et le cou enchaînés, de sorte qu’ils ne peuvent bouger ni voir ailleurs que devant eux.',
        contexte: 'Début de l’allégorie de la caverne, *la République*, livre VII.',
        sens:
          'Les prisonniers ne voient que les ombres projetées sur la paroi et les prennent pour la réalité. C’est, dit Platon, notre situation à tous tant que nous n’avons pas cherché à comprendre.',
      },
      {
        texte:
          'Tant que les philosophes ne seront pas rois dans les cités, il n’y aura pas de fin aux maux des cités.',
        contexte: '*La République*, livre V : Platon décrit la cité juste.',
        sens:
          'Il ne réclame pas le pouvoir pour les professeurs : il affirme que gouverner est un savoir, et qu’on ne devrait pas plus l’improviser que la médecine.',
      },
      {
        texte: 'Que nul n’entre ici s’il n’est géomètre.',
        contexte: 'Inscription que la tradition place au fronton de l’Académie, à Athènes.',
        sens:
          'Aucun texte contemporain ne la mentionne : elle n’apparaît que chez des auteurs très tardifs. Elle dit juste, malgré tout, la place des mathématiques dans son école — on y entrait par la géométrie.',
        incertaine: true,
      },
      {
        texte: 'Le temps est l’image mobile de l’éternité.',
        contexte: '*Le Timée*, sur la création du monde par le démiurge.',
      },
    ],
    reperes: [
      'Né dans une grande famille athénienne, il devient à vingt ans le disciple de Socrate.',
      'La condamnation de son maître, en 399 av. J.-C., le dégoûte de la politique de son temps.',
      'Il fonde vers 387 av. J.-C. l’Académie, première école durable d’Occident, fermée en 529 apr. J.-C.',
      'Il n’écrit pas de traités mais des dialogues, où Socrate parle et où Platon n’apparaît jamais.',
      'Trois voyages en Sicile pour former un roi philosophe : trois échecs, dont un qui faillit lui coûter la liberté.',
    ],
    recit: [
      {
        titre: 'Celui qui devait gouverner',
        texte:
          'Platon naît vers **428 av. J.-C.** dans une des plus anciennes familles d’Athènes ; tout le destine à la politique. Il écrit des tragédies, rencontre **Socrate** à vingt ans et, dit-on, brûle ses pièces. Deux expériences le vaccinent. En **404**, les **Trente Tyrans** — parmi lesquels son oncle Charmide et son cousin Critias — installent une dictature sanglante ; il est invité à les rejoindre et refuse. En **399**, la démocratie rétablie condamne Socrate à mort. Dégoûté des deux régimes, il quitte Athènes, voyage douze ans en Égypte, en Italie du Sud auprès des mathématiciens **pythagoriciens**, et revient avec une idée fixe : il faut d’abord savoir ce qu’est la justice avant de prétendre gouverner.',
      },
      {
        titre: 'L’Académie, école pour neuf siècles',
        texte:
          'Vers **387 av. J.-C.**, il achète un terrain près du bois sacré du héros **Académos**, au nord-ouest d’Athènes, et y installe une communauté de recherche : l’**Académie**. On n’y paie pas, contrairement aux écoles de sophistes. On y fait de la **géométrie**, de l’astronomie, de l’arithmétique autant que de la politique et de la morale — et l’on y discute, puisque la vérité, pour Platon, naît du dialogue et non du cours. Deux femmes au moins y sont admises, Axiothéa et Lasthénéia, fait rarissime dans la Grèce du IVᵉ siècle. Platon y enseignera quarante ans ; **Aristote** y entre à dix-sept ans et y reste vingt. L’école lui survivra neuf cents ans, jusqu’à sa fermeture par l’empereur Justinien en **529 apr. J.-C.**',
      },
      {
        titre: 'La caverne, ou pourquoi nous nous trompons',
        texte:
          'L’image la plus célèbre de toute la philosophie tient en trois pages de *la République*. Des hommes sont enchaînés depuis l’enfance au fond d’une grotte, face à une paroi. Derrière eux brûle un feu ; entre le feu et eux, on promène des objets dont les **ombres** défilent sur le mur. Ces ombres sont, pour eux, la réalité entière. Qu’on en détache un : la lumière le blesse, la montée le fatigue, il découvre dehors les objets réels, puis le **soleil** qui rend tout visible. S’il redescend prévenir les autres, il verra mal dans le noir, on le prendra pour un fou, et « si l’on pouvait mettre la main sur lui, on le tuerait ». Platon écrit cela vingt ans après le procès de Socrate : personne, alors, n’a eu besoin qu’on lui explique de qui il parlait.',
      },
      {
        titre: 'Un roi à éduquer, trois échecs',
        texte:
          'Platon a cru qu’on pouvait appliquer sa théorie. Trois fois il fait voile vers **Syracuse**, en Sicile, pour former un souverain à la philosophie. Le premier voyage, vers **388**, tourne mal : le tyran Denys l’Ancien, fatigué de ses leçons, l’aurait fait vendre comme esclave sur le marché d’Égine, d’où un ami le rachète. Il revient pourtant en **367** puis en **361** auprès de Denys le Jeune, qui préfère les fêtes aux mathématiques. Platon rentre bredouille et meurt à Athènes vers **348 av. J.-C.**, la plume à la main. Fait unique dans l’Antiquité : **toute son œuvre nous est parvenue**, une trentaine de dialogues, sans qu’aucun se soit perdu. Le philosophe Whitehead résumera : toute la philosophie occidentale est une suite de notes en bas de page à Platon.',
      },
    ],
    chrono: [
      { date: 'vers 428 av. J.-C.', fait: 'Naissance à Athènes, dans une famille aristocratique.' },
      { date: 'vers 407 av. J.-C.', fait: 'À vingt ans, il devient disciple de Socrate.' },
      { date: '399 av. J.-C.', fait: 'Mort de Socrate ; Platon quitte Athènes pour douze ans.' },
      { date: 'vers 388 av. J.-C.', fait: 'Premier voyage en Sicile, auprès de Denys l’Ancien.' },
      { date: 'vers 387 av. J.-C.', fait: 'Fondation de l’Académie, à Athènes.' },
      { date: '367 av. J.-C.', fait: 'Aristote, à dix-sept ans, entre à l’Académie.' },
      { date: '361 av. J.-C.', fait: 'Dernier voyage à Syracuse : nouvel échec.' },
      { date: 'vers 348 av. J.-C.', fait: 'Mort à Athènes.' },
      { date: '529 apr. J.-C.', fait: 'Justinien ferme l’Académie, neuf siècles après sa fondation.' },
    ],
    leSaisTu:
      'Platon est un surnom. Son nom serait Aristoclès, et « Platon » viendrait de *platus*, « large » : les épaules d’un garçon qui aurait lutté aux jeux Isthmiques, disent les anciens — à moins que ce ne soit la largeur de son front, ou de son style. Le philosophe le plus lu du monde a gardé son nom de vestiaire.',
    aRetenir: [
      'Platon, élève de Socrate, vit à Athènes de 428 à 348 av. J.-C. environ.',
      'Il fonde l’Académie vers 387 av. J.-C. : c’est la première école de philosophie durable d’Occident.',
      'Il écrit une trentaine de dialogues, dont *la République*, *le Banquet* et *l’Apologie de Socrate*.',
      'L’allégorie de la caverne montre des hommes qui prennent des ombres pour la réalité.',
      'Il juge la démocratie incapable de choisir les meilleurs et rêve d’une cité dirigée par des philosophes.',
    ],
    mots: [
      {
        mot: 'Dialogue',
        sens: 'Forme d’écriture choisie par Platon : une conversation, avec des objections et des rires.',
      },
      {
        mot: 'Allégorie',
        sens: 'Récit imagé qui illustre une idée abstraite — la caverne pour l’ignorance.',
      },
      {
        mot: 'Académie',
        sens: 'L’école de Platon, près du bois d’Académos ; le mot désigne aujourd’hui toute institution savante.',
      },
    ],
    lies: ['socrate', 'aristote', 'pericles'],
    niveaux: ['6e', '2de'],
    programme: 'Le monde des cités grecques',
    tags: [
      'Athènes',
      'Académie',
      'caverne',
      'République',
      'dialogues',
      'Idées',
      'Socrate',
      'Syracuse',
      'philosophie',
    ],
  },
  {
    id: 'aristote',
    volet: 'personnages',
    nom: 'Aristote',
    surnom: 'le maître de ceux qui savent',
    dates: '384 – 322 av. J.-C.',
    tri: -322,
    periode: 'antiquite',
    emoji: '🦉',
    roles: ['Philosophe', 'Savant', 'Précepteur d’Alexandre'],
    origine: 'Stagire, Macédoine',
    accroche:
      'Élève de Platon, précepteur d’Alexandre : il a voulu tout observer et tout classer, et son autorité a tenu deux mille ans.',
    citations: [
      {
        texte: 'L’homme est par nature un animal politique.',
        contexte: 'Premières pages de *la Politique*.',
        sens:
          '*Politique* vient de *polis*, la cité : l’homme est fait pour vivre en cité. Qui n’en a pas besoin, ajoute Aristote, est « une bête ou un dieu ».',
      },
      {
        texte: 'Tous les hommes désirent naturellement savoir.',
        contexte: 'Première phrase de *la Métaphysique*.',
        sens:
          'La preuve, dit-il aussitôt : le plaisir que nous prenons à regarder, à écouter, à remarquer des différences — même sans que cela serve à rien.',
      },
      {
        texte: 'Une hirondelle ne fait pas le printemps, ni un seul beau jour.',
        contexte: '*Éthique à Nicomaque*, livre I, à propos du bonheur.',
        sens:
          'On n’est pas heureux pour une bonne journée : le bonheur se juge sur une vie entière. Le proverbe français vient de là.',
      },
      {
        texte: 'Ami de Platon, mais plus encore ami de la vérité.',
        contexte: 'Formule latine médiévale, *Amicus Plato, sed magis amica veritas*.',
        sens:
          'Elle condense un vrai passage de *l’Éthique à Nicomaque*, où Aristote écrit qu’il est pénible de critiquer ses amis, mais qu’un philosophe doit préférer la vérité. La formule elle-même est postérieure de quinze siècles.',
        incertaine: true,
      },
    ],
    reperes: [
      'Fils d’un médecin de la cour de Macédoine ; il entre à dix-sept ans à l’Académie de Platon.',
      'Il y reste vingt ans, jusqu’à la mort de son maître, en 347 av. J.-C.',
      'Précepteur d’Alexandre le Grand à Pella, de 343 à 340 av. J.-C.',
      'Il fonde le Lycée à Athènes en 335 et enseigne en marchant : d’où le nom de péripatéticiens.',
      'Il invente la logique, décrit près de cinq cents espèces animales et classe les régimes politiques.',
      'Sa physique et son ciel géocentrique feront autorité jusqu’à Galilée, deux mille ans plus tard.',
    ],
    recit: [
      {
        titre: 'Vingt ans chez Platon',
        texte:
          'Aristote naît en **384 av. J.-C.** à **Stagire**, petite cité grecque de Macédoine. Son père est le médecin du roi : l’enfant grandit au milieu des dissections et des herbiers, et gardera toute sa vie le regard d’un naturaliste. À dix-sept ans, il part pour Athènes et entre à l’**Académie**, où il restera **vingt ans**, jusqu’à la mort de Platon. Il en sort avec une admiration immense et un désaccord de fond : son maître place le vrai dans un monde d’**Idées** pures, séparé du nôtre ; Aristote, lui, pense que le vrai est *dans* les choses, et qu’on l’atteint en les observant. Toute la philosophie occidentale se partagera ensuite entre ces deux gestes — lever les yeux, ou se pencher.',
      },
      {
        titre: 'Le précepteur du futur conquérant',
        texte:
          'En **343 av. J.-C.**, le roi **Philippe II** de Macédoine le rappelle pour instruire son fils de treize ans, **Alexandre**. Trois ans de leçons à Miéza, près de Pella : Homère, la politique, la médecine, la biologie. Alexandre emportera en Asie un exemplaire de *l’Iliade* annoté par son maître, qu’il gardera, dit-on, sous son oreiller avec un poignard. Les anciens racontent aussi qu’il faisait envoyer à Aristote des plantes et des animaux inconnus rapportés de ses campagnes — invérifiable, mais l’idée dit bien ce qu’était devenue la science grecque : une collecte du monde. Les deux hommes se brouilleront ; Aristote n’approuvait ni la démesure ni les mœurs perses adoptées par son ancien élève.',
      },
      {
        titre: 'Le Lycée : tout observer, tout classer',
        texte:
          'De retour à Athènes en **335 av. J.-C.**, il ouvre sa propre école dans un gymnase consacré à Apollon Lycien : le **Lycée**. On y enseigne en se promenant sous les portiques — les élèves seront surnommés les **péripatéticiens**, « ceux qui marchent ». Le programme est le plus ambitieux jamais conçu : la **logique** (il invente le **syllogisme** : si tous les hommes sont mortels et que Socrate est un homme, alors Socrate est mortel), la physique, la biologie, l’éthique, la politique, la rhétorique, la poétique. Il dissèque, compare, classe près de **cinq cents espèces** animales, décrit la croissance jour par jour d’un embryon de poulet, et range les régimes politiques en trois bons et trois mauvais. Il pense aussi, comme son époque, que certains hommes sont esclaves par nature — l’un des textes les plus contestés de toute son œuvre.',
      },
      {
        titre: 'Deux mille ans d’autorité',
        texte:
          'À la mort d’Alexandre, en **323**, Athènes se retourne contre tout ce qui vient de Macédoine. Accusé d’impiété comme Socrate, Aristote quitte la ville et meurt l’année suivante à **Chalcis**, à soixante-deux ans. Ses traités — des notes de cours plutôt que des livres — traversent l’Antiquité, sont traduits en **arabe** et commentés par **Averroès** à Cordoue, puis retraduits en latin au XIIIᵉ siècle : l’Occident médiéval le redécouvre alors et ne jure plus que par lui. **Thomas d’Aquin** l’appelle « le Philosophe », **Dante** « le maître de ceux qui savent ». Le revers est brutal : sa physique devient un dogme, et il faudra **Galilée** et Newton pour oser mesurer plutôt que citer. On ne lui reproche pas de s’être trompé — on lui reproche d’avoir eu raison trop longtemps.',
      },
    ],
    chrono: [
      { date: '384 av. J.-C.', fait: 'Naissance à Stagire, en Macédoine.' },
      { date: '367 av. J.-C.', fait: 'Il entre à l’Académie de Platon, à dix-sept ans.' },
      { date: '347 av. J.-C.', fait: 'Mort de Platon ; Aristote quitte Athènes.' },
      { date: '343 av. J.-C.', fait: 'Il devient le précepteur d’Alexandre, à Pella.' },
      { date: '335 av. J.-C.', fait: 'Fondation du Lycée, à Athènes.' },
      { date: '323 av. J.-C.', fait: 'Mort d’Alexandre ; menacé, Aristote fuit à Chalcis.' },
      { date: '322 av. J.-C.', fait: 'Mort à Chalcis, en Eubée.' },
      { date: 'XIIIᵉ siècle', fait: 'L’Occident le redécouvre par les traductions arabes et latines.' },
    ],
    leSaisTu:
      'Aristote décrit un poisson-chat dont le mâle surveille les œufs jusqu’à l’éclosion. Pendant des siècles, on a tenu le détail pour une fable. Au XIXᵉ siècle, des naturalistes ont retrouvé l’animal dans les rivières de Grèce et constaté qu’il fait exactement cela. L’espèce porte son nom : *Silurus aristotelis*.',
    aRetenir: [
      'Aristote (384-322 av. J.-C.) est l’élève de Platon et le précepteur d’Alexandre le Grand.',
      'Il fonde le Lycée à Athènes en 335 av. J.-C. et enseigne en marchant.',
      'Il crée la logique et le syllogisme, et fonde l’observation scientifique de la nature.',
      'Pour lui, la connaissance vient de l’observation des choses, non d’un monde d’Idées séparé.',
      'Traduit en arabe puis en latin, il domine la pensée européenne jusqu’à Galilée.',
    ],
    mots: [
      {
        mot: 'Logique',
        sens: 'La science du raisonnement juste : comment passer de propositions vraies à une conclusion vraie.',
      },
      {
        mot: 'Syllogisme',
        sens: 'Raisonnement en trois temps : deux affirmations, une conclusion qui en découle nécessairement.',
      },
      {
        mot: 'Péripatéticien',
        sens: 'Élève d’Aristote, du grec *peripatein*, « se promener » : on y étudiait en marchant.',
      },
      {
        mot: 'Géocentrisme',
        sens: 'Système du monde plaçant la Terre immobile au centre ; admis jusqu’au XVIIᵉ siècle.',
      },
    ],
    lies: ['platon', 'socrate', 'alexandre-le-grand'],
    niveaux: ['6e', '2de'],
    programme: 'Le monde des cités grecques',
    tags: [
      'Lycée',
      'logique',
      'syllogisme',
      'Stagire',
      'Alexandre',
      'Platon',
      'sciences',
      'péripatéticiens',
      'Politique',
      'Métaphysique',
    ],
  },
  {
    id: 'alexandre-le-grand',
    volet: 'personnages',
    nom: 'Alexandre le Grand',
    surnom: 'le conquérant de l’Asie',
    dates: '356 – 323 av. J.-C.',
    tri: -323,
    periode: 'antiquite',
    emoji: '🐎',
    roles: ['Roi de Macédoine', 'Conquérant', 'Fondateur de villes'],
    origine: 'Pella, Macédoine',
    accroche:
      'Roi à vingt ans, il conquiert en treize ans l’empire le plus puissant du monde, et meurt à trente-deux sans avoir perdu une seule bataille.',
    citations: [
      {
        texte:
          'Ô mon fils, cherche-toi un royaume digne de toi : la Macédoine est trop petite pour te contenir.',
        qui: 'Philippe II, son père',
        contexte:
          'Après qu’Alexandre, âgé d’environ douze ans, a dompté le cheval Bucéphale. Rapporté par Plutarque.',
        sens:
          'L’enfant avait compris ce qu’aucun écuyer ne voyait : le cheval avait peur de sa propre ombre. Il l’a tourné face au soleil, et l’a monté.',
      },
      {
        texte: 'Je ne vole pas la victoire.',
        contexte:
          'À son général Parménion, qui lui conseillait d’attaquer les Perses de nuit, la veille de Gaugamèles, en 331 av. J.-C.',
        sens:
          'Une victoire arrachée dans le noir n’aurait pas convaincu les Perses d’avoir été vaincus. Il attaquera en plein jour, à un contre trois au moins.',
      },
      {
        texte: 'Si je n’étais Alexandre, je voudrais être Diogène.',
        contexte:
          'À Corinthe, devant le philosophe Diogène qui, allongé au soleil, lui demandait seulement de s’ôter de sa lumière.',
        sens:
          'L’anecdote est rapportée quatre siècles plus tard par Plutarque : belle, célèbre, invérifiable. Elle oppose l’homme qui veut tout et celui qui ne veut rien.',
        incertaine: true,
      },
      {
        texte: 'Au plus fort.',
        contexte: 'Sur son lit de mort, à Babylone, à ceux qui lui demandaient à qui il laissait son empire.',
        sens:
          'Les historiens antiques eux-mêmes écrivent « on dit que ». Vraie ou non, la réponse décrit la suite : quarante ans de guerres entre ses généraux pour se partager les morceaux.',
        incertaine: true,
      },
    ],
    reperes: [
      'Fils de Philippe II de Macédoine et élève d’Aristote ; il devient roi à vingt ans, en 336 av. J.-C.',
      'En treize ans, il conquiert l’Empire perse, de la Grèce jusqu’à l’Indus : près de 5 000 km parcourus.',
      'Trois grandes victoires sur les Perses : le Granique (334), Issos (333), Gaugamèles (331).',
      'Il fonde une vingtaine de villes à son nom, dont Alexandrie d’Égypte, en 331 av. J.-C.',
      'Mort à Babylone à trente-deux ans ; ses généraux, les Diadoques, se partagent l’empire.',
      'De l’Égypte à l’Afghanistan, le grec devient la langue des élites : c’est le monde hellénistique.',
    ],
    recit: [
      {
        titre: 'L’élève d’Aristote et le cheval noir',
        texte:
          'Alexandre naît à **Pella** en **356 av. J.-C.**, fils du roi **Philippe II** — qui a fait de la Macédoine, royaume rustique méprisé des Grecs, la première puissance militaire de la région — et de la princesse épirote **Olympias**. À douze ans, selon Plutarque, il dompte **Bucéphale**, un cheval que personne ne peut monter, en comprenant qu’il s’effraie de son ombre. De treize à seize ans, il a pour précepteur **Aristote**, qui lui enseigne Homère, la politique et les sciences. À **dix-huit ans**, il commande l’aile gauche de la cavalerie à **Chéronée** (338 av. J.-C.), la bataille qui met les cités grecques sous tutelle macédonienne. À vingt ans, son père est assassiné : il est roi.',
      },
      {
        titre: 'Trois batailles, un empire',
        texte:
          'Il commence par mater les révoltes : **Thèbes** est rasée en 335, six mille morts, trente mille habitants vendus — seule la maison du poète Pindare est épargnée. Le message porte. Puis il passe en Asie avec environ 35 000 hommes. **Granique** (334) lui ouvre l’Asie Mineure ; **Issos** (333) met en fuite le Grand Roi **Darius III**, qui abandonne sa mère, sa femme et ses filles au vainqueur — qu’Alexandre traite avec égards. **Tyr** résiste sept mois derrière ses murailles : il fait construire une digue de 800 mètres pour atteindre l’île. En **331**, il fonde **Alexandrie** sur le delta du Nil, va se faire reconnaître fils d’Amon à l’oasis de **Siwa**, puis écrase les Perses à **Gaugamèles**. Babylone, Suse et **Persépolis** tombent ; le palais des rois perses brûle en 330.',
      },
      {
        titre: 'Jusqu’à l’Indus, et l’armée qui dit non',
        texte:
          'Darius assassiné par les siens, Alexandre se proclame son héritier — et commence à porter des vêtements perses, à exiger la **proskynèse**, cette prosternation que les Grecs ne devaient qu’aux dieux. Ses compagnons macédoniens le supportent mal ; au cours d’une dispute d’ivrognes, il tue de sa main **Cleitos**, qui lui avait sauvé la vie au Granique. Il poursuit vers l’est : Bactriane, mariage avec **Roxane**, passage de l’Hindou Kouch, puis l’Inde, où il bat le roi **Pôros** et ses éléphants à l’**Hydaspe** (326). Sur les rives de l’Hyphase, l’armée refuse d’avancer : huit ans de marche, la mousson, les blessures. Il cède, pleure, et rentre — par le désert de **Gédrosie**, où il perd plus d’hommes que dans toutes ses batailles.',
      },
      {
        titre: 'Babylone, trente-deux ans',
        texte:
          'À **Suse**, en 324, il marie d’un coup quatre-vingts officiers et dix mille soldats macédoniens à des femmes perses : il veut un empire où les deux peuples se mêlent, non un peuple vainqueur assis sur l’autre. L’année suivante, à **Babylone**, il prépare une expédition vers l’Arabie quand une fièvre l’emporte en onze jours, le **10 juin 323 av. J.-C.** Il a trente-deux ans et ne laisse pas d’héritier en âge de régner. Ses généraux, les **Diadoques**, se partagent l’empire après quarante ans de guerres : **Ptolémée** prend l’Égypte et détourne le corps d’Alexandre vers Alexandrie, **Séleucos** l’Asie, **Antigone** la Macédoine. L’unité politique est morte ; la civilisation, elle, tient. Du Nil à l’Afghanistan, on parle grec, on bâtit des théâtres et des gymnases, et Alexandrie devient avec sa **Bibliothèque** la capitale intellectuelle du monde : c’est l’époque **hellénistique**.',
      },
    ],
    chrono: [
      { date: '356 av. J.-C.', fait: 'Naissance à Pella, en Macédoine.' },
      { date: '343 av. J.-C.', fait: 'Aristote devient son précepteur.' },
      { date: '338 av. J.-C.', fait: 'À dix-huit ans, il commande la cavalerie à Chéronée.' },
      { date: '336 av. J.-C.', fait: 'Philippe II est assassiné ; Alexandre devient roi.' },
      { date: '334 av. J.-C.', fait: 'Passage en Asie et victoire du Granique.' },
      { date: '333 av. J.-C.', fait: 'Victoire d’Issos sur Darius III.' },
      { date: '331 av. J.-C.', fait: 'Fondation d’Alexandrie, puis victoire de Gaugamèles.' },
      { date: '330 av. J.-C.', fait: 'Persépolis est prise et incendiée.' },
      { date: '326 av. J.-C.', fait: 'Victoire de l’Hydaspe ; l’armée refuse d’aller plus loin.' },
      { date: '323 av. J.-C.', fait: 'Mort à Babylone, le 10 juin, à trente-deux ans.' },
    ],
    leSaisTu:
      'Bucéphale a suivi Alexandre pendant vingt ans, de la Macédoine à l’Inde. Le cheval meurt après la bataille de l’Hydaspe, vers trente ans. Alexandre fait bâtir une ville sur place et l’appelle Bouképhala : la seule de ses fondations à ne pas porter son nom, mais celui de son cheval.',
    aRetenir: [
      'Alexandre, roi de Macédoine en 336 av. J.-C., conquiert l’Empire perse en une dizaine d’années.',
      'Ses trois grandes victoires sont le Granique (334), Issos (333) et Gaugamèles (331 av. J.-C.).',
      'Il fonde Alexandrie d’Égypte en 331 av. J.-C. et une vingtaine d’autres villes.',
      'Il meurt à Babylone en 323 av. J.-C. ; ses généraux se partagent l’empire.',
      'Sa conquête diffuse la langue et la culture grecques jusqu’en Asie : c’est le monde hellénistique.',
    ],
    mots: [
      {
        mot: 'Hellénistique',
        sens: 'Se dit du monde né des conquêtes d’Alexandre, où la culture grecque se mêle à celles de l’Orient.',
      },
      {
        mot: 'Phalange',
        sens: 'Formation macédonienne serrée, hérissée de lances de cinq mètres, presque impossible à enfoncer de face.',
      },
      {
        mot: 'Diadoques',
        sens: 'Les généraux d’Alexandre, « successeurs » qui se partagèrent son empire après sa mort.',
      },
    ],
    lies: ['aristote', 'homere', 'archimede'],
    niveaux: ['6e', '2de'],
    programme: 'Alexandre le Grand et le monde hellénistique',
    tags: [
      'Macédoine',
      'Perses',
      'Darius',
      'Gaugamèles',
      'Alexandrie',
      'Bucéphale',
      'hellénistique',
      'Babylone',
      'Diadoques',
      'Issos',
      'Aristote',
    ],
  },
  {
    id: 'archimede',
    volet: 'personnages',
    nom: 'Archimède',
    surnom: 'le savant de Syracuse',
    dates: 'vers 287 – 212 av. J.-C.',
    tri: -212,
    periode: 'antiquite',
    emoji: '🛁',
    roles: ['Mathématicien', 'Physicien', 'Ingénieur'],
    origine: 'Syracuse, Sicile',
    accroche:
      'Il tient la flotte romaine en échec pendant deux ans, calcule le nombre de grains de sable de l’univers, et meurt sur un problème de géométrie.',
    citations: [
      {
        texte: 'Eurêka ! (J’ai trouvé !)',
        contexte:
          'Dans son bain, en comprenant comment mesurer le volume d’une couronne d’or — il en serait sorti nu pour courir dans la rue.',
        sens:
          'L’histoire est racontée par l’architecte romain Vitruve deux siècles plus tard, et la méthode décrite ne correspond pas à ce qu’Archimède écrit dans *Des corps flottants*. Le cri est devenu celui de toutes les découvertes ; il n’est pas prouvé.',
        incertaine: true,
      },
      {
        texte: 'Donnez-moi un point d’appui et je soulèverai le monde.',
        contexte:
          'Sur la puissance du levier, devant le roi Hiéron II de Syracuse. Rapporté par Pappus d’Alexandrie, cinq siècles plus tard.',
        sens:
          'La phrase illustre une loi vraie, la sienne : avec un bras de levier assez long, une force minuscule soulève n’importe quelle masse. Mais on n’a pas la preuve qu’il l’ait dite ainsi.',
        incertaine: true,
      },
      {
        texte:
          'Il est des gens, roi Gélon, qui pensent que le nombre des grains de sable est infini en multitude.',
        contexte: 'Première phrase de *l’Arénaire*, un traité qu’Archimède a bel et bien écrit.',
        sens:
          'Il entreprend alors de compter combien de grains de sable rempliraient l’univers entier — et trouve un nombre à soixante-trois chiffres. Objectif : prouver qu’aucune quantité n’échappe au calcul.',
      },
      {
        texte: 'Ne dérange pas mes cercles.',
        contexte: 'Au soldat romain venu l’arrêter, alors qu’il traçait des figures dans le sable, en 212 av. J.-C.',
        sens:
          'La phrase latine *Noli turbare circulos meos* apparaît des siècles plus tard, et Archimède parlait grec. Le soldat, dit-on, le tua sur place — contre l’ordre exprès du général romain.',
        incertaine: true,
      },
    ],
    reperes: [
      'Savant grec de Syracuse, en Sicile ; il meurt en 212 av. J.-C. quand les Romains prennent la ville.',
      'La poussée d’Archimède : un corps plongé dans un liquide reçoit une poussée égale au poids du liquide déplacé.',
      'Il explique le levier, invente la vis sans fin et des palans qui déplacent un navire chargé.',
      'Il encadre le nombre π entre 3,1408 et 3,1429 — un résultat inégalé pendant des siècles.',
      'Ses machines de guerre tiennent la flotte romaine en échec pendant deux ans de siège.',
    ],
    recit: [
      {
        titre: 'Syracuse, une capitale savante',
        texte:
          '**Syracuse**, en Sicile, est au IIIᵉ siècle av. J.-C. l’une des plus grandes villes du monde grec. Archimède y naît vers **287 av. J.-C.**, fils d’un astronome, et se forme sans doute à **Alexandrie**, où travaillent les héritiers d’Euclide ; il correspondra toute sa vie avec les savants de la Bibliothèque. Le roi **Hiéron II**, son protecteur, le charge des problèmes concrets d’un État : lancer à la mer un navire géant, irriguer, fortifier. C’est la marque d’Archimède — il démontre comme un mathématicien pur et construit comme un ingénieur, sans voir entre les deux la frontière que ses contemporains y mettaient.',
      },
      {
        titre: 'La couronne, le bain et la poussée',
        texte:
          'Le roi soupçonne son orfèvre d’avoir remplacé une partie de l’or d’une **couronne** par de l’argent, sans pouvoir le prouver ni fondre l’objet. Archimède, dit la légende, trouve la solution dans son bain en voyant l’eau déborder : un même poids d’argent, moins dense, occupe plus de place et déplace plus d’eau. Derrière l’anecdote, il y a une vraie loi, démontrée dans son traité *Des corps flottants* : **tout corps plongé dans un liquide subit une poussée verticale égale au poids du liquide déplacé**. C’est la **poussée d’Archimède**, et c’est pour cela qu’un navire d’acier flotte, qu’un ballon d’hélium monte et qu’un sous-marin peut choisir de couler ou non.',
      },
      {
        titre: 'Des machines et des nombres',
        texte:
          'Archimède énonce la loi du **levier** et construit des **palans** démultiplicateurs capables, dit Plutarque, de faire glisser à lui seul un navire chargé hors de l’eau. Il met au point la **vis sans fin** qui monte l’eau d’un niveau à l’autre : on s’en sert encore aujourd’hui dans les stations d’épuration. Côté mathématiques, il calcule l’aire d’un segment de parabole par une méthode d’« épuisement » qui annonce le **calcul intégral** de Newton et Leibniz, dix-neuf siècles plus tôt. Il encadre **π** entre 223/71 et 22/7, et démontre que la **sphère** vaut les deux tiers du cylindre qui l’enveloppe — le résultat dont il était le plus fier, au point d’en demander la figure sur sa tombe.',
      },
      {
        titre: 'Deux ans contre Rome',
        texte:
          'Pendant la deuxième guerre punique, Syracuse choisit le camp de Carthage. Le consul **Marcellus** met le siège en **213 av. J.-C.** avec une flotte et une armée, et croit en finir en quelques jours. Il s’y heurte deux ans. Archimède a truffé les remparts de **catapultes** réglées pour toutes les distances, et de « griffes » — des bras articulés qui saisissent la proue des navires, la soulèvent et la retournent. Les soldats romains, raconte Plutarque, fuyaient dès qu’une poutre dépassait d’un mur. La ville finit par tomber en **212**, la nuit d’une fête, par trahison. Marcellus avait ordonné qu’on épargne le savant ; un soldat le tue au milieu de ses figures tracées dans le sable. Il avait soixante-quinze ans.',
      },
      {
        titre: 'Le tombeau perdu et le livre gratté',
        texte:
          'Cent trente-sept ans plus tard, un jeune questeur romain en poste en Sicile cherche sa tombe dont plus personne ne connaît l’emplacement. **Cicéron** la retrouve en **75 av. J.-C.**, envahie de ronces, reconnaissable à la figure gravée au sommet : une **sphère inscrite dans un cylindre**. L’autre résurrection est plus étonnante encore. Au XIIIᵉ siècle, un moine a gratté un vieux manuscrit grec pour en faire un livre de prières. En **1906**, le philologue danois **Heiberg** identifie sous les prières sept traités d’Archimède, dont *la Méthode*, inconnue jusque-là. Vendu deux millions de dollars en 1998, ce **palimpseste** a été déchiffré aux rayons X : on y a lu comment Archimède trouvait ses résultats avant de les démontrer.',
      },
    ],
    chrono: [
      { date: 'vers 287 av. J.-C.', fait: 'Naissance à Syracuse, en Sicile.' },
      { date: 'vers 250 av. J.-C.', fait: '*Des corps flottants*, *De la sphère et du cylindre*, *l’Arénaire*.' },
      { date: '213 av. J.-C.', fait: 'Le Romain Marcellus met le siège devant Syracuse.' },
      { date: '212 av. J.-C.', fait: 'La ville tombe ; Archimède est tué par un soldat.' },
      { date: '75 av. J.-C.', fait: 'Cicéron retrouve son tombeau sous les ronces.' },
      { date: '1906', fait: 'Heiberg découvre le palimpseste qui contient *la Méthode*.' },
      { date: '1998', fait: 'Le manuscrit est vendu aux enchères, puis lu aux rayons X.' },
    ],
    leSaisTu:
      'On raconte qu’Archimède aurait incendié les navires romains avec des miroirs concentrant le soleil. Aucun auteur contemporain n’en parle : la légende apparaît près de mille ans plus tard. Les essais modernes, eux, n’ont enflammé qu’une barque immobile, par ciel parfaitement dégagé.',
    aRetenir: [
      'Archimède vit à Syracuse d’environ 287 à 212 av. J.-C., à l’époque hellénistique.',
      'La poussée d’Archimède explique pourquoi un corps plongé dans un liquide flotte ou coule.',
      'Il formule la loi du levier, invente la vis sans fin et de nombreuses machines de guerre.',
      'Il calcule une valeur très précise de π et le volume de la sphère par rapport au cylindre.',
      'Il est tué en 212 av. J.-C. lors de la prise de Syracuse par les Romains.',
    ],
    mots: [
      {
        mot: 'Poussée d’Archimède',
        sens: 'Force verticale qu’un liquide exerce vers le haut sur un corps plongé dedans.',
      },
      {
        mot: 'Levier',
        sens: 'Barre rigide tournant autour d’un point d’appui : elle multiplie la force appliquée.',
      },
      {
        mot: 'Palimpseste',
        sens: 'Manuscrit dont on a gratté le texte pour réécrire dessus — et sous lequel on retrouve l’ancien.',
      },
    ],
    lies: ['alexandre-le-grand', 'aristote', 'platon'],
    niveaux: ['6e', '2de'],
    programme: 'Le monde hellénistique : sciences et techniques',
    tags: [
      'Syracuse',
      'Eurêka',
      'poussée',
      'levier',
      'pi',
      'Sicile',
      'Marcellus',
      'palimpseste',
      'sciences grecques',
      'vis sans fin',
    ],
  },
]
