// -----------------------------------------------------------------------------
// TEMPS MODERNES — ENTRE HENRI IV ET LOUIS XIV : Sully, Marie de Médicis,
// Louis XIII, Mazarin, Anne d'Autriche, Turenne.
//
// L'encyclopédie sautait d'Henri IV assassiné en 1610 à Louis XIV gouvernant
// en 1661 : un demi-siècle sans personne, alors que c'est là que l'État se
// bâtit. Ce lot comble le trou — et rend à LOUIS XIII ce que les manuels
// donnent d'ordinaire à son seul ministre. C'est lui qui choisit Richelieu,
// lui qui le garde contre sa propre mère à la journée des Dupes, lui qui
// commande devant La Rochelle, lui qui consacre le royaume à la Vierge en
// 1638, lui qui signe l'Académie française et le Jardin royal des plantes.
//
// Ton : celui du § 3 de `docs/encyclopedie.md`. On raconte ces vies DANS LEUR
// TEMPS, leur foi prise au sérieux comme moteur de leurs actes, leurs fautes
// dites sans ironie — la rupture de Marie de Médicis avec son fils, l'année
// que Turenne passe du côté des princes, le Palatinat brûlé sur son ordre.
// Aucun procès rétrospectif, aucune moquerie.
// -----------------------------------------------------------------------------

import type { Personnage } from '../types'

export const PERSONNAGES_LOUIS_XIII: Personnage[] = [
  {
    id: 'sully',
    volet: 'personnages',
    nom: 'Sully',
    surnom: 'le ministre du labourage',
    dates: '1560 – 1641',
    tri: 1641,
    periode: 'temps-modernes',
    emoji: '🌾',
    roles: [
      'Surintendant des finances',
      'Grand voyer de France',
      'Duc et pair de Sully',
      'Maréchal de France',
    ],
    origine: 'Rosny-sur-Seine, d’une famille protestante',
    accroche:
      'Ministre huguenot d’Henri IV, il remet les comptes du royaume à l’endroit et fonde sa richesse sur la terre : labourage et pâturage.',
    citations: [
      {
        texte:
          'Labourage et pâturage sont les deux mamelles dont la France est alimentée, les vraies mines et trésors du Pérou.',
        contexte:
          'Dans ses *Économies royales*, contre ceux qui voulaient bâtir la fortune du royaume sur les manufactures de soie.',
        sens:
          'Le Pérou, c’est l’or que l’Espagne rapporte d’Amérique. Sully répond que la vraie mine de la France est son sol : du blé et des bêtes, pas du métal volé au bout du monde.',
      },
      {
        texte:
          'Sire, quand le roi votre père me faisait l’honneur de me consulter sur ses affaires, il commençait par faire sortir les bouffons de sa chambre.',
        contexte:
          'À Louis XIII, rappelé à la cour dans ses vieux habits, dont les jeunes courtisans avaient ri. Anecdote rapportée par les mémorialistes du siècle.',
        incertaine: true,
      },
      {
        texte: 'Réduire toute l’Europe en une république très chrétienne, toujours pacifique en elle-même.',
        contexte:
          'Le « Grand Dessein » que les *Économies royales* prêtent à Henri IV : quinze États d’Europe réglant leurs querelles devant un conseil commun.',
        sens:
          'Les historiens y voient surtout le projet de Sully lui-même, écrit après la mort du roi. C’est, trois siècles avant l’heure, l’idée d’une Europe qui parle au lieu de se battre.',
        incertaine: true,
      },
    ],
    reperes: [
      'Protestant toute sa vie, compagnon d’armes d’Henri IV : Coutras, Arques, Ivry, où il est blessé.',
      'Surintendant des finances de 1598 à 1611 : il remet de l’ordre dans des comptes que personne ne tenait.',
      'Grand voyer de France en 1599 : routes, ponts, plantations d’ormes, canal de Briare commencé en 1604.',
      'En 1610, le Trésor a une réserve à la Bastille — plus de treize millions de livres, inouï depuis un siècle.',
      'Écarté par Marie de Médicis en 1611, il se retire et écrit ses *Économies royales*.',
      'Fait maréchal de France par Louis XIII en 1634 ; il meurt en 1641, à quatre-vingt-un ans.',
    ],
    recit: [
      {
        titre: 'Un huguenot dans les guerres de Religion',
        texte:
          'Maximilien de Béthune, baron de **Rosny**, naît en 1560 dans une famille protestante de petite noblesse. À onze ans, il étudie à Paris quand éclate la **Saint-Barthélemy** ; il en réchappe de justesse. À seize ans, il rejoint **Henri de Navarre**, le futur Henri IV, et ne le quittera plus pendant trente ans : **Coutras** (1587), **Arques** (1589), **Ivry** (1590), où il est blessé et laissé pour mort. Il se révèle surtout artilleur et ingénieur de sièges — il calcule des trajectoires, dresse des batteries, compte les boulets. Quand le roi, en 1593, se résout à passer au catholicisme pour entrer dans Paris, Sully le lui conseille et reste, lui, **protestant** : il sera pendant quinze ans le seul huguenot du Conseil du roi de France.',
      },
      {
        titre: 'Des comptes que personne ne tenait',
        texte:
          'Le royaume sort de trente-six ans de guerre civile. La dette approche les **trois cents millions de livres**, les impôts sont affermés à des financiers — les **traitants** — qui avancent l’argent au roi et gardent la différence, et nul ne sait au juste ce que l’État possède. Sully entre au Conseil des finances en 1596, prend la **surintendance** en 1598, et fait ce que personne n’avait fait : il **vérifie**. Une chambre de justice fait rendre gorge aux traitants ; les rentes sont renégociées ; le domaine royal engagé est racheté ; la **taille**, l’impôt qui écrase les paysans, est allégée de plusieurs millions. En 1604, la **paulette** — un droit annuel d’un soixantième — rend les offices héréditaires et donne au roi un revenu régulier. Le résultat tient en une image : à la mort d’Henri IV, en 1610, il y a de l’argent d’avance dans les coffres de la **Bastille**, ce qu’aucun roi n’avait vu depuis un siècle.',
      },
      {
        titre: 'Labourage et pâturage',
        texte:
          'Sa doctrine tient en une phrase, et elle est agricole. Contre Barthélemy de **Laffemas**, qui veut enrichir la France par les manufactures de soie, Sully répond que la richesse d’un royaume sort de sa terre. Il supprime des péages, laisse sortir les grains quand la récolte est bonne, fait assécher des marais en Poitou et dans l’Ouest. **Grand voyer de France** depuis 1599, il refait les grands chemins, relève les ponts et fait planter le long des routes les ormes qu’on appelle encore les « **ormes de Sully** ». Il lance surtout le **canal de Briare** en 1604 : quarante kilomètres et des écluses pour faire passer les bateaux de la **Loire** au bassin de la **Seine** par-dessus une ligne de partage des eaux — le premier ouvrage de ce genre en Europe. Les blés du Centre peuvent désormais remonter vers Paris, qui mangeait mal dès qu’une récolte manquait.',
      },
      {
        titre: 'L’homme d’un seul roi',
        texte:
          'Le **14 mai 1610**, Henri IV est assassiné. Sully, qui a vingt-huit ans de service, se sait perdu : la régente **Marie de Médicis** n’aime ni sa brusquerie, ni son avarice, ni sa religion. Il quitte la surintendance en **janvier 1611** et se retire dans son duché de **Sully-sur-Loire**, acheté en 1602. Il y passe trente ans à rédiger d’immenses mémoires, les *Mémoires des sages et royales œconomies d’État* — les **Économies royales** —, imprimées en secret dans son château et écrites, chose rare, à la deuxième personne : ce sont ses secrétaires qui lui racontent sa propre vie. **Louis XIII** le fait **maréchal de France** en 1634, honneur sans commandement, en souvenir du règne de son père. Sully meurt le 22 décembre **1641**, un an avant Richelieu, dernier survivant de l’équipe qui avait relevé le royaume.',
      },
    ],
    chrono: [
      { date: '1560', fait: 'Naissance à Rosny-sur-Seine.' },
      { date: '1572', fait: 'À onze ans, il échappe à la Saint-Barthélemy.' },
      { date: '1590', fait: 'Blessé à Ivry, aux côtés d’Henri de Navarre.' },
      { date: '1598', fait: 'Surintendant des finances du royaume.' },
      { date: '1599', fait: 'Grand voyer de France et grand maître de l’artillerie.' },
      { date: '1604', fait: 'Canal de Briare ; création de la paulette.' },
      { date: '1606', fait: 'Il est fait duc et pair de Sully.' },
      { date: '14 mai 1610', fait: 'Assassinat d’Henri IV.' },
      { date: '1611', fait: 'Marie de Médicis l’écarte du gouvernement.' },
      { date: '1634', fait: 'Maréchal de France, à soixante-treize ans.' },
      { date: '1641', fait: 'Mort le 22 décembre, au château de Villebon.' },
    ],
    leSaisTu:
      'Le 24 août 1572, jour de la Saint-Barthélemy, le jeune Maximilien a onze ans et loge dans un collège de Paris. Pour traverser les rues où l’on égorge les protestants, il serre sous son bras un gros livre d’heures catholique et marche sans courir. Deux prêtres l’arrêtent, voient le livre, le laissent passer. Il arrive vivant chez son principal.',
    aRetenir: [
      'Sully (1560-1641) est le ministre des finances d’Henri IV, de 1598 à 1611.',
      'Il vérifie les comptes, réduit la dette, allège la taille et laisse en 1610 une réserve au Trésor.',
      '« Labourage et pâturage sont les deux mamelles de la France » : il fonde la richesse du royaume sur l’agriculture.',
      'Grand voyer de France, il refait les routes et les ponts et lance le canal de Briare en 1604.',
      'Resté protestant, il est écarté par Marie de Médicis en 1611 et se retire pour écrire ses *Économies royales*.',
    ],
    mots: [
      {
        mot: 'Surintendant des finances',
        sens: 'Ministre chargé de toutes les recettes et de toutes les dépenses du roi — l’ancêtre du ministre des Finances.',
      },
      {
        mot: 'Traitant',
        sens: 'Financier privé qui avance l’impôt au roi et se paie ensuite sur les contribuables, en gardant la différence.',
      },
      {
        mot: 'Paulette',
        sens: 'Droit annuel créé en 1604 : en le payant, un officier du roi peut transmettre sa charge à son fils.',
      },
    ],
    lies: ['henri-iv', 'edit-de-nantes', 'marie-de-medicis', 'louis-xiii'],
    niveaux: ['5e'],
    programme: 'Du prince de la Renaissance au roi absolu (François Ier, Henri IV, Louis XIV)',
    tags: [
      'Rosny',
      'Béthune',
      'surintendant',
      'finances',
      'labourage et pâturage',
      'canal de Briare',
      'grand voyer',
      'huguenot',
      'Économies royales',
      'paulette',
      'Henri IV',
    ],
  },
  {
    id: 'marie-de-medicis',
    volet: 'personnages',
    nom: 'Marie de Médicis',
    surnom: 'la régente florentine',
    dates: '1575 – 1642',
    tri: 1642,
    periode: 'temps-modernes',
    emoji: '⛲',
    roles: ['Reine de France', 'Régente du royaume', 'Mécène'],
    origine: 'Florence, grand-duché de Toscane',
    accroche:
      'Régente à la mort d’Henri IV, elle tient le royaume sept ans et fait entrer Richelieu au Conseil — puis perd contre lui son fils et sa place.',
    citations: [
      {
        texte: 'J’ai régné sept ans ; je n’espère plus qu’une couronne dans le ciel.',
        contexte:
          'Au Louvre, le 24 avril 1617, en apprenant que son favori Concini vient d’être abattu sur l’ordre de son fils de quinze ans.',
        sens:
          'Elle comprend en une phrase que tout est fini : le roi qu’elle croyait encore enfant vient de prendre le pouvoir, et elle partira le soir même pour l’exil de Blois.',
      },
      {
        texte: 'Les rois ne meurent point en France.',
        qui: 'Le chancelier, à la reine en larmes',
        contexte:
          'Au Louvre, le 14 mai 1610, quelques heures après l’assassinat d’Henri IV : on lui montre son fils de huit ans, roi depuis un instant.',
        sens:
          'La règle du royaume : il n’y a pas un jour sans roi. Le pouvoir passe à la seconde même de la mort — et c’est à la mère de l’exercer jusqu’à la majorité.',
      },
      {
        texte: 'Je dois plus à mon État qu’à ma mère.',
        qui: 'Louis XIII',
        contexte:
          'Ce que la tradition lui fait répondre à ceux qui le pressaient de céder, au lendemain de la journée des Dupes, le 10 novembre 1630.',
        incertaine: true,
      },
    ],
    reperes: [
      'Florentine, fille du grand-duc de Toscane : elle épouse Henri IV en 1600 et lui donne six enfants.',
      'Couronnée à Saint-Denis le 13 mai 1610 — la veille de l’assassinat du roi.',
      'Régente de 1610 à 1617 : elle maintient la paix et l’édit de Nantes.',
      'Double mariage espagnol de 1615 : Louis XIII épouse Anne d’Autriche, sa fille épouse le futur Philippe IV.',
      'C’est elle qui fait entrer Richelieu au Conseil du roi, en 1624.',
      'Journée des Dupes, 10 novembre 1630 : son fils choisit le cardinal contre elle. Elle s’exile en 1631.',
    ],
    recit: [
      {
        titre: 'Une Médicis pour épouse',
        texte:
          'Marie naît à **Florence** en 1575, fille du grand-duc de Toscane et petite-nièce de **Catherine de Médicis**. Elle grandit au **palais Pitti**, parmi les tableaux et les jardins, dans la famille de banquiers la plus puissante d’Europe. En **1600**, Henri IV, qui vient de faire annuler son premier mariage, l’épouse — par procuration, à Florence, avant de la rencontrer. Le roi a besoin d’un héritier et d’argent : la **dot** est énorme, six cent mille écus d’or, dont une partie efface les dettes de la couronne envers les banques florentines. Marie débarque à **Marseille** en novembre 1600 ; Rubens peindra la scène vingt-cinq ans plus tard. Elle donne au royaume six enfants, dont le futur **Louis XIII** en 1601, et deux filles qui seront reines d’Espagne et d’Angleterre. Le **13 mai 1610**, elle est enfin couronnée à Saint-Denis. Le lendemain, Ravaillac tue le roi.',
      },
      {
        titre: 'Sept ans de régence',
        texte:
          'Le royaume a un roi de **huit ans** et l’Europe attend de voir s’il va se défaire comme au temps des guerres de Religion. Marie de Médicis prend la régence le jour même et choisit la prudence : elle maintient l’**édit de Nantes**, renonce à la guerre qu’Henri IV préparait contre les **Habsbourg**, et achète la paix des grands seigneurs à coups de pensions — ce qui engloutit la réserve laissée par **Sully**, écarté dès 1611. En **1614**, pour répondre aux princes révoltés, elle réunit les **états généraux** : ce seront les derniers avant **1789**, et un jeune évêque de Luçon nommé **Richelieu** s’y fait remarquer. En **1615**, elle scelle le double **mariage espagnol** : son fils épouse l’infante **Anne d’Autriche**, sa fille Élisabeth épouse le futur Philippe IV. Après quarante ans de guerre avec l’Espagne, c’est une paix. Mais le gouvernement réel appartient à un couple d’aventuriers florentins, **Concino Concini** et sa femme Leonora, que la France déteste.',
      },
      {
        titre: 'La rupture avec son fils',
        texte:
          'Le **24 avril 1617**, Louis XIII a quinze ans, il est majeur depuis deux ans et sa mère ne lui a rien rendu. Il fait abattre **Concini** sur le pont du Louvre par le capitaine de **Vitry**, et relègue sa mère au château de **Blois**. Deux ans plus tard, à quarante-quatre ans, elle s’en évade et lève des troupes : ce sont les « **guerres de la mère et du fils** », deux campagnes courtes et sans gloire, arrêtées par la négociation. Le négociateur est **Richelieu**, son propre aumônier, le seul homme en qui les deux camps aient confiance. Réconciliée, Marie revient au Conseil en 1622, obtient le **chapeau de cardinal** pour son protégé, et en **1624** le fait entrer au gouvernement. Toute la carrière de Richelieu commence par elle — et c’est de tous ses actes celui qui pèsera le plus lourd.',
      },
      {
        titre: 'Le Luxembourg et Rubens',
        texte:
          'Reine mère, elle bâtit. Dès **1615**, elle fait élever par Salomon de Brosse le **palais du Luxembourg**, copié sur le palais Pitti de son enfance : il abrite aujourd’hui le **Sénat**. Elle fait achever l’**aqueduc d’Arcueil**, qui amène l’eau de Rungis jusqu’aux fontaines de la rive gauche, et tracer le **Cours-la-Reine** le long de la Seine, première promenade plantée de Paris. Surtout, elle commande en **1622** à **Rubens** vingt-quatre immenses toiles pour la galerie de son palais : sa naissance, son débarquement à Marseille, son couronnement, sa régence — sa vie racontée en dieux et en allégories, les épisodes gênants noyés dans les nuages. Le peintre livre l’ensemble en trois ans. Le *cycle de Marie de Médicis* est aujourd’hui au **Louvre**, dans une salle entière : c’est le plus grand programme peint jamais consacré à une femme de pouvoir.',
      },
      {
        titre: 'La journée des Dupes, puis l’exil',
        texte:
          'Ce qui les sépare est politique : Marie veut l’alliance des puissances catholiques, Richelieu fait la guerre aux **Habsbourg** au nom de la **raison d’État**. Le **10 novembre 1630**, malade au **palais du Luxembourg**, elle arrache à son fils la promesse de renvoyer le cardinal ; toute la cour se précipite pour la féliciter. Le soir même, à Versailles, Louis XIII confirme son ministre : les courtisans ont été « dupes », et ceux qui avaient parlé trop vite sont exilés ou arrêtés. Marie refuse de plier. En juillet **1631**, elle quitte le royaume pour **Bruxelles**, chez l’ennemi espagnol. Elle errera onze ans — Bruxelles, Londres, La Haye — sans jamais revenir. Elle meurt à **Cologne** le 3 juillet **1642**, dans une maison qui avait appartenu à **Rubens**, cinq mois avant Richelieu. Son fils fera ramener son corps à Saint-Denis, auprès d’Henri IV.',
      },
    ],
    chrono: [
      { date: '1575', fait: 'Naissance à Florence, fille du grand-duc de Toscane.' },
      { date: '1600', fait: 'Mariage avec Henri IV.' },
      { date: '1601', fait: 'Naissance du futur Louis XIII.' },
      { date: '13 mai 1610', fait: 'Couronnement à Saint-Denis ; le roi est tué le lendemain.' },
      { date: '1614', fait: 'États généraux : les derniers avant 1789.' },
      { date: '1615', fait: 'Double mariage espagnol.' },
      { date: '24 avril 1617', fait: 'Concini abattu : elle est reléguée à Blois.' },
      { date: '1619', fait: 'Évasion de Blois ; guerres de la mère et du fils.' },
      { date: '1624', fait: 'Elle fait entrer Richelieu au Conseil du roi.' },
      { date: '10 novembre 1630', fait: 'Journée des Dupes : le roi garde son ministre.' },
      { date: '1631', fait: 'Départ pour Bruxelles : elle ne reverra pas la France.' },
      { date: '3 juillet 1642', fait: 'Mort à Cologne.' },
    ],
    leSaisTu:
      'Dans la nuit du 22 février 1619, la reine mère s’évade du château de Blois par une fenêtre, à quarante-quatre ans passés et fort corpulente. Elle descend une échelle de corde de dix mètres jusqu’à la terrasse, puis, terrorisée par la seconde échelle, se laisse glisser le long du talus assise sur un manteau, dans le noir, jusqu’au carrosse qui l’attendait.',
    aRetenir: [
      'Marie de Médicis, seconde femme d’Henri IV, est régente de France de 1610 à 1617 pour son fils Louis XIII.',
      'Elle maintient la paix et l’édit de Nantes, et scelle en 1615 le double mariage espagnol.',
      'Elle réunit en 1614 les derniers états généraux avant 1789.',
      'C’est elle qui fait entrer Richelieu au Conseil du roi, en 1624.',
      'La journée des Dupes, le 10 novembre 1630, la fait perdre : elle s’exile en 1631 et meurt à Cologne en 1642.',
      'Elle laisse le palais du Luxembourg et les vingt-quatre toiles peintes pour elle par Rubens.',
    ],
    mots: [
      {
        mot: 'Régence',
        sens: 'Gouvernement exercé au nom d’un roi trop jeune pour régner — ici, par sa mère.',
      },
      {
        mot: 'Favori',
        sens: 'Homme que le prince distingue et comble, et dont tout le pouvoir tient à cette faveur.',
      },
      {
        mot: 'Mécène',
        sens: 'Personne qui paie des artistes et des savants pour qu’ils travaillent, et dont la gloire y gagne.',
      },
    ],
    lies: ['henri-iv', 'louis-xiii', 'richelieu', 'anne-d-autriche', 'sully'],
    niveaux: ['5e'],
    programme: 'Du prince de la Renaissance au roi absolu (François Ier, Henri IV, Louis XIV)',
    tags: [
      'Médicis',
      'Florence',
      'régente',
      'Concini',
      'palais du Luxembourg',
      'Rubens',
      'journée des Dupes',
      'Blois',
      'états généraux de 1614',
      'mariage espagnol',
      'Cologne',
    ],
  },
  {
    id: 'louis-xiii',
    volet: 'personnages',
    nom: 'Louis XIII',
    surnom: 'le Juste',
    dates: '1601 – 1643',
    tri: 1643,
    periode: 'temps-modernes',
    emoji: '🎼',
    roles: ['Roi de France et de Navarre', 'Vainqueur de La Rochelle', 'Musicien et compositeur'],
    origine: 'Fontainebleau',
    accroche:
      'Roi à huit ans, il choisit Richelieu et le tient contre sa mère et contre sa cour, prend La Rochelle en personne et consacre la France à la Vierge.',
    citations: [
      {
        texte: 'Grand merci à vous ! À cette heure je suis roi.',
        contexte:
          'À ses gardes, d’une fenêtre du Louvre, le 24 avril 1617 : Concini, le favori de sa mère, vient d’être abattu sur son ordre. Il a quinze ans.',
        sens:
          'Il est roi depuis sept ans et n’a jamais gouverné. En une matinée, il reprend son royaume à la régence — et il ne le lâchera plus jusqu’à sa mort.',
      },
      {
        texte:
          'Prenant la très sacrée et très glorieuse Vierge pour protectrice spéciale de notre royaume, nous lui consacrons particulièrement notre personne, notre État, notre couronne et nos sujets.',
        contexte: 'Déclaration du 10 février 1638, enregistrée par le Parlement : le vœu de Louis XIII.',
        sens:
          'Il promet en échange une procession dans chaque paroisse le 15 août. L’Assomption devient la grande fête du royaume jusqu’en 1789 — et le 15 août est resté férié en France.',
      },
      {
        texte: 'Pas encore, mon fils ; mais ce sera bientôt, si c’est la volonté de Dieu.',
        contexte:
          'Au dauphin de quatre ans qui, le jour de son baptême, en avril 1643, venait de répondre s’appeler « Louis XIV ». Le roi mourra trois semaines plus tard.',
      },
      {
        texte: 'Voilà un grand politique qui est mort.',
        contexte: 'À l’annonce de la mort de Richelieu, le 4 décembre 1642, cinq mois avant la sienne.',
        sens:
          'Pas un mot de chagrin, pas un mot de soulagement non plus. Il garde les ministres du cardinal, continue sa guerre et sa politique : le choix de 1624 était le sien.',
        incertaine: true,
      },
    ],
    reperes: [
      'Roi à huit ans, le 14 mai 1610 ; sa mère Marie de Médicis gouverne jusqu’en 1617.',
      'Le 24 avril 1617, à quinze ans, il fait abattre le favori Concini et prend le pouvoir.',
      'Il appelle Richelieu au Conseil en 1624 et le soutient dix-huit ans, contre sa mère et contre la cour.',
      'Il conduit en personne le siège de La Rochelle (1627-1628) et force le Pas de Suse à la tête de ses troupes.',
      'Vœu de 1638 : il consacre le royaume à la Vierge ; le 15 août devient la fête de la France.',
      'Musicien et compositeur, il écrit, règle et danse le *Ballet de la Merlaison* en 1635.',
    ],
    recit: [
      {
        titre: 'Un enfant roi, et très seul',
        texte:
          'Louis naît à **Fontainebleau** le 27 septembre 1601, premier fils d’Henri IV et de Marie de Médicis. Son médecin **Jean Héroard** tient jour après jour, pendant vingt-sept ans, le journal de sa santé, de ses mots et de ses jeux : on sait ce que ce garçon mangeait, ce qu’il disait à trois ans, quand il a bégayé pour la première fois. Il a **huit ans** quand Ravaillac tue son père, le 14 mai **1610**. Il est sacré à **Reims** le 17 octobre suivant, mais sa mère gouverne et ne lui montre rien des affaires. L’enfant grandit à l’écart : santé fragile, bégaiement, peu de mots. Il chasse, il monte à cheval mieux que personne, il apprend le luth et la musique, il forge et il jardine. Sept ans durant, on le tient pour négligeable. C’est une erreur de lecture que sa cour paiera cher.',
      },
      {
        titre: '24 avril 1617 : le roi prend son royaume',
        texte:
          'Le favori de la régente, le Florentin **Concino Concini**, maréchal d’Ancre, gouverne la France sans avoir jamais commandé une armée ni rendu un jugement. Louis XIII a quinze ans, il est majeur depuis deux ans, et personne ne lui obéit. Avec son compagnon de chasse **Charles d’Albert de Luynes**, il prépare un coup d’État : le matin du **24 avril 1617**, le capitaine des gardes **Vitry** arrête Concini sur le pont du Louvre et l’abat. Le roi paraît à une fenêtre, remercie ses gardes, et devient roi pour de bon. Sa mère part pour **Blois**. Les années qui suivent sont dures : deux guerres contre elle, la révolte des grands, et les campagnes du Midi contre les places protestantes armées. En **1620**, il rattache le **Béarn** et la **Navarre** à la couronne — la France prend sa forme d’un bloc.',
      },
      {
        titre: 'Le roi choisit son ministre',
        texte:
          'En **1624**, il appelle au Conseil **Richelieu**, l’homme de sa mère, qu’il n’aime pas et dont il reconnaît la valeur. Ce n’est pas un roi qui s’efface : c’est un roi qui **choisit** un instrument et le tient. Les mémoires du cardinal sont écrits pour être lus par lui, annotés de sa main, et rien ne se décide sans son ordre. Le prix est un règne de complots, car toute la cour veut la chute du ministre : la conspiration de **Chalais** (1626), les intrigues de son frère **Gaston d’Orléans**, la révolte du duc de **Montmorency** (1632), enfin **Cinq-Mars**, son propre favori, qui signe en 1642 un traité avec l’Espagne et finit sur l’échafaud. Le moment décisif est la **journée des Dupes**, le **10 novembre 1630** : Marie de Médicis exige le renvoi du cardinal, obtient la promesse du roi, et la cour la félicite. Le soir, à **Versailles**, Louis XIII confirme Richelieu. Il a préféré l’État à sa mère, et il le sait.',
      },
      {
        titre: 'Devant La Rochelle, et sous le feu',
        texte:
          'Ce roi silencieux est un homme de guerre. En **1627**, il vient en personne devant **La Rochelle**, dernière grande place armée des protestants, vit au camp, visite les tranchées, tombe malade, revient. La ville capitule le 28 octobre **1628** après quatorze mois ; il y entre le **1er novembre**, interdit le pillage et laisse aux habitants la liberté de leur culte : la **paix d’Alès** (1629) ôte aux protestants leurs armées et leurs places, et leur **garde l’édit de Nantes**. Trois mois plus tard, en mars 1629, il force au pas de charge le **Pas de Suse**, dans les Alpes, à la tête de ses gardes — un roi de France en première ligne, chose qu’on n’avait pas vue depuis son père. En **1635**, il déclare la guerre à l’Espagne ; en 1636, l’ennemi prend **Corbie** et menace Paris : le roi part au camp, la capitale tient. Il meurt cinq jours avant que son armée n’écrase les Espagnols à **Rocroi**.',
      },
      {
        titre: 'Le vœu de 1638',
        texte:
          'Louis XIII est un roi pieux, au sens exact du mot : il se croit comptable devant Dieu du royaume qu’il a reçu. Marié depuis vingt-trois ans, il n’a pas d’héritier ; le trône irait à son frère Gaston, brouillon et comploteur. Le **10 février 1638**, par une déclaration solennelle enregistrée au Parlement, il place la France sous la protection de la **Vierge Marie** : c’est le **vœu de Louis XIII**. En échange, il ordonne que, chaque **15 août**, jour de l’**Assomption**, toutes les paroisses du royaume fassent une procession, et il promet de faire refaire le maître-autel de **Notre-Dame de Paris**. Le **5 septembre 1638** naît un fils, qu’on appelle **Louis-Dieudonné** — donné par Dieu. La fête du 15 août restera la grande fête nationale jusqu’à la Révolution ; elle est encore aujourd’hui un jour férié. Le vœu sera tenu : l’autel de Notre-Dame, achevé sous Louis XV, porte les deux rois agenouillés devant la Vierge.',
      },
      {
        titre: 'Ce qu’il laisse en trente-trois ans',
        texte:
          'Son règne fonde, et pas seulement par les armes. L’**Académie française** naît en **1635** pour fixer la langue. La même année s’ouvre le **Jardin royal des plantes médicinales**, voulu dès 1626 pour que les remèdes s’étudient sur le vivant : c’est l’actuel **Muséum national d’histoire naturelle**, et il n’a jamais fermé depuis. L’**Imprimerie royale** s’installe au Louvre en 1640 ; la même année, une monnaie d’or nouvelle prend son nom — le **louis**. La **marine**, inexistante en 1624, compte deux flottes de guerre ; **Québec** et les îles d’Amérique sont peuplées ; les **intendants** portent le roi dans les provinces. À **Versailles**, il a fait bâtir un petit château de chasse en brique et pierre : son fils le gardera au centre du palais. Épuisé par la maladie, Louis XIII meurt à Saint-Germain-en-Laye le **14 mai 1643**, à quarante et un ans — trente-trois ans jour pour jour après l’assassinat de son père.',
      },
    ],
    chrono: [
      { date: '27 septembre 1601', fait: 'Naissance à Fontainebleau.' },
      { date: '14 mai 1610', fait: 'Roi à huit ans ; sacré à Reims en octobre.' },
      { date: '24 avril 1617', fait: 'Concini abattu : il prend le pouvoir.' },
      { date: '1624', fait: 'Richelieu entre au Conseil du roi.' },
      { date: '1er novembre 1628', fait: 'Il entre dans La Rochelle réduite.' },
      { date: '1629', fait: 'Il force le Pas de Suse ; paix d’Alès avec les protestants.' },
      { date: '10 novembre 1630', fait: 'Journée des Dupes : il garde son ministre.' },
      { date: '1635', fait: 'Académie française, Jardin royal des plantes, guerre à l’Espagne.' },
      { date: '10 février 1638', fait: 'Vœu de Louis XIII : la France consacrée à la Vierge.' },
      { date: '5 septembre 1638', fait: 'Naissance du dauphin, futur Louis XIV.' },
      { date: '4 décembre 1642', fait: 'Mort de Richelieu.' },
      { date: '14 mai 1643', fait: 'Mort à Saint-Germain, 33 ans jour pour jour après son père.' },
    ],
    leSaisTu:
      'Louis XIII composait. Le 15 mars 1635, au château de Chantilly, on donne le *Ballet de la Merlaison* — « la chasse au merle », seize tableaux : il en a écrit la musique, dessiné les costumes, réglé les pas, et il y danse lui-même deux rôles. On lui doit aussi des airs de cour et des motets, et la cour disait qu’il chantait juste, d’une belle voix de basse.',
    aRetenir: [
      'Louis XIII règne de 1610 à 1643 ; sa mère Marie de Médicis est régente jusqu’en 1617.',
      'Le 24 avril 1617, à quinze ans, il fait tuer Concini et gouverne lui-même.',
      'Il appelle Richelieu au Conseil en 1624 et le maintient contre sa mère à la journée des Dupes, le 10 novembre 1630.',
      'Il conduit en personne le siège de La Rochelle (1627-1628) : la paix d’Alès laisse aux protestants la liberté de culte.',
      'Par le vœu du 10 février 1638, il consacre le royaume à la Vierge : le 15 août devient la fête de la France.',
      'Son règne fonde l’Académie française et le Jardin royal des plantes (1635), futur Muséum.',
    ],
    mots: [
      {
        mot: 'Vœu',
        sens: 'Promesse solennelle faite à Dieu, qui engage celui qui la prononce — ici, tout un royaume.',
      },
      {
        mot: 'Principal ministre',
        sens: 'Ministre à qui le roi confie la conduite de toutes les affaires, sans cesser lui-même de décider.',
      },
      {
        mot: 'Majorité du roi',
        sens: 'Âge — treize ans accomplis — à partir duquel le roi gouverne en son nom et la régence prend fin.',
      },
    ],
    lies: ['richelieu', 'marie-de-medicis', 'anne-d-autriche', 'henri-iv', 'louis-xiv'],
    niveaux: ['5e', '2de'],
    programme: 'Du prince de la Renaissance au roi absolu (François Ier, Henri IV, Louis XIV)',
    tags: [
      'le Juste',
      'Concini',
      'La Rochelle',
      'journée des Dupes',
      'vœu de 1638',
      'Académie française',
      'Jardin des plantes',
      'Merlaison',
      'Richelieu',
      'Pas de Suse',
      'louis d’or',
      'Saint-Germain',
    ],
  },
  {
    id: 'mazarin',
    volet: 'personnages',
    nom: 'Mazarin',
    surnom: 'le cardinal qui gagnait du temps',
    dates: '1602 – 1661',
    tri: 1661,
    periode: 'temps-modernes',
    emoji: '🕰️',
    roles: [
      'Cardinal',
      'Principal ministre d’Anne d’Autriche',
      'Négociateur de Westphalie et des Pyrénées',
    ],
    origine: 'Pescina, dans les Abruzzes',
    accroche:
      'Cardinal italien devenu ministre d’une régente française, il traverse la Fronde et laisse à Louis XIV la première puissance d’Europe.',
    citations: [
      {
        texte: 'Qu’ils chantent, pourvu qu’ils paient.',
        contexte:
          'Ce qu’on lui prête devant les chansons et les pamphlets de la Fronde ; aucun texte de son temps ne l’écrit.',
        sens:
          'La phrase dit juste ce qu’il faisait : il laissait Paris se moquer de lui par écrit tant que l’impôt rentrait et que l’armée tenait la campagne.',
        incertaine: true,
      },
      {
        texte: 'Le temps et moi.',
        contexte: 'Sa formule de gouvernement, répétée pendant la Fronde à ses correspondants.',
        sens:
          'Il ne force rien. Il attend que la révolte se fatigue, que les alliés se brouillent, que l’adversaire se trompe — puis il revient. Il a été chassé deux fois du royaume, et deux fois il est rentré.',
      },
      {
        texte: 'Pace ! Pace !',
        contexte:
          'Au galop, entre deux armées rangées en bataille devant Casal, le 26 octobre 1630, un papier à la main.',
        sens:
          '« La paix ! La paix ! » Envoyé du pape, âgé de vingt-huit ans, il arrête seul une bataille que deux ans de négociations n’avaient pas empêchée. Richelieu le remarque ce jour-là.',
      },
      {
        texte: 'Sire, je vous dois tout ; mais je crois m’acquitter envers Votre Majesté en lui donnant Colbert.',
        contexte: 'À Louis XIV, sur son lit de mort, à Vincennes, en mars 1661. Phrase rapportée, jamais écrite de sa main.',
        incertaine: true,
      },
    ],
    reperes: [
      'Italien, Giulio Mazarini, fils d’un intendant sicilien : il arrête une bataille devant Casal à vingt-huit ans.',
      'Repéré par Richelieu, naturalisé français en 1639, cardinal en 1641 — sans avoir jamais été prêtre.',
      'Principal ministre de la régente Anne d’Autriche dès 1643, et pour dix-huit ans.',
      'Traités de Westphalie, 1648 : la guerre de Trente Ans finit, l’Alsace entre dans le royaume.',
      'Chassé deux fois du royaume par la Fronde, il gouverne par courrier depuis l’exil et revient.',
      'Traité des Pyrénées, 1659 : vingt-quatre ans de guerre avec l’Espagne s’achèvent.',
    ],
    recit: [
      {
        titre: 'Un Italien qui sait attendre',
        texte:
          'Giulio **Mazarini** naît en 1602 à Pescina, dans les **Abruzzes**, fils d’un intendant sicilien au service des Colonna. Les jésuites l’élèvent à Rome, il étudie en Espagne, sert comme capitaine dans les troupes du pape, puis passe à la diplomatie. Le **26 octobre 1630**, devant **Casal**, en Italie, les armées française et espagnole vont s’entre-tuer quand un jeune envoyé du pape galope entre les lignes en criant « *Pace !* » : l’accord est signé. **Richelieu**, qui le tenait à l’œil, le veut pour la France. Mazarini devient **Mazarin**, **naturalisé français en 1639**, **cardinal en 1641** — sans avoir jamais reçu la prêtrise, ce qui était alors possible. Rien chez lui ne ressemble à Richelieu : là où le premier tranchait, celui-ci enveloppe, retarde, sourit, et finit par obtenir. Mourant, Richelieu le recommande au roi : « Je ne connais que lui qui puisse me remplacer. »',
      },
      {
        titre: '1643 : la régente le choisit',
        texte:
          'Louis XIII meurt le 14 mai **1643** en laissant un fils de quatre ans et un testament qui enferme la reine dans un conseil. Quatre jours plus tard, le Parlement casse le testament et donne à **Anne d’Autriche** la régence entière. Toute la cour attend qu’elle chasse l’Italien de Richelieu, qu’elle a tant de raisons de haïr. Elle le nomme **principal ministre**. C’est la décision qui commande tout le reste : pendant dix-huit ans, une reine espagnole et un cardinal italien vont gouverner la France ensemble, se voir chaque jour, s’écrire en chiffre, et ne jamais se lâcher. Il faut finir la guerre contre l’Espagne et l’Empire, donc payer : la **taille** monte, on crée des offices pour les vendre, on taxe les maisons de Paris. Le pays gronde. Cinq jours après la mort du roi, le duc d’Enghien — le futur **Condé** — écrase les Espagnols à **Rocroi** : la France a une armée.',
      },
      {
        titre: 'Westphalie, 1648',
        texte:
          'La guerre dure depuis trente ans quand s’ouvrent, dans deux villes de Westphalie, **Münster** et **Osnabrück**, les premiers grands congrès de l’histoire européenne : quatre ans de négociations, près de deux cents délégations, des courriers qui font l’aller-retour jusqu’à Paris. Mazarin y conduit la partie française pied à pied. Les **traités de Westphalie**, signés le **24 octobre 1648**, donnent à la France les droits des Habsbourg en **Alsace** et confirment **Metz, Toul et Verdun** ; ils reconnaissent l’indépendance des Provinces-Unies et de la Suisse, et laissent l’Empire éclaté en plus de trois cents États qui traitent désormais chacun pour soi. Surtout, ils posent une règle qui vaut encore : les États sont **souverains** chez eux et règlent leurs différends par **traité**, autour d’une table, et non par la sentence d’un pape ou d’un empereur. L’Europe des États commence là.',
      },
      {
        titre: 'La Fronde traversée',
        texte:
          'L’année même de ce triomphe, Paris se soulève. La **Fronde** (1648-1653) dresse contre lui d’abord les magistrats du **Parlement**, puis les princes, puis les deux ensemble avec l’appui de l’Espagne. On imprime contre lui plus de **cinq mille pamphlets**, les **mazarinades**, où l’on se moque de son accent, de sa fortune, de ses nièces. Il est **chassé du royaume par deux fois**, en 1651 et en 1652, et continue de gouverner par courrier depuis l’Allemagne, dictant à la reine ce qu’il faut faire et ce qu’il faut promettre. Il ne rend jamais les armes et ne cède jamais l’essentiel : l’autorité du roi. Le **21 octobre 1652**, Louis XIV rentre dans Paris ; Mazarin revient en février **1653**, accueilli par ceux-là mêmes qui l’avaient vendu. **Condé**, passé au service de l’Espagne, sera battu et pardonné.',
      },
      {
        titre: 'Les Pyrénées, la bibliothèque, l’élève',
        texte:
          'Reste l’Espagne. Après la victoire des **Dunes** (1658) remportée par **Turenne**, Mazarin négocie vingt-quatre conférences sur l’**île des Faisans**, au milieu de la Bidassoa, et signe le **7 novembre 1659** le **traité des Pyrénées** : le **Roussillon** et l’**Artois** entrent dans le royaume, et Louis XIV épouse l’infante **Marie-Thérèse**, qui renonce à ses droits sur l’Espagne contre une dot — jamais payée, ce dont son mari se souviendra. La France est la première puissance d’Europe. Le cardinal laisse aussi une **bibliothèque** : quarante mille volumes rassemblés par **Gabriel Naudé** et **ouverts à tous ceux qui savaient lire** dès 1643, la première bibliothèque publique de France. Par testament, il fonde le **collège des Quatre-Nations**, qui abrite aujourd’hui l’**Institut de France**. Il meurt à **Vincennes** le 9 mars **1661** ; le lendemain matin, son élève de vingt-deux ans annonce qu’il gouvernera seul.',
      },
    ],
    chrono: [
      { date: '1602', fait: 'Naissance à Pescina, dans les Abruzzes.' },
      { date: '26 octobre 1630', fait: 'Il arrête une bataille devant Casal.' },
      { date: '1639', fait: 'Naturalisé français.' },
      { date: '1641', fait: 'Cardinal, sans avoir été prêtre.' },
      { date: '1643', fait: 'Principal ministre de la régente Anne d’Autriche.' },
      { date: '24 octobre 1648', fait: 'Traités de Westphalie ; la Fronde commence à Paris.' },
      { date: '1651 et 1652', fait: 'Chassé deux fois du royaume, il gouverne par courrier.' },
      { date: 'février 1653', fait: 'Retour à Paris : la Fronde est finie.' },
      { date: '7 novembre 1659', fait: 'Traité des Pyrénées avec l’Espagne.' },
      { date: '9 juin 1660', fait: 'Mariage de Louis XIV et de Marie-Thérèse.' },
      { date: '9 mars 1661', fait: 'Mort à Vincennes.' },
    ],
    leSaisTu:
      'Sa bibliothèque était ouverte à qui voulait lire, un jour par semaine, dès 1643 : personne n’avait fait cela en France. Pendant la Fronde, le Parlement la fit vendre aux enchères pour le punir ; son bibliothécaire Naudé passa des années à racheter les livres un par un. La bibliothèque Mazarine existe toujours, quai de Conti, et reste la plus ancienne bibliothèque publique du pays.',
    aRetenir: [
      'Mazarin, cardinal italien, est principal ministre de 1643 à 1661, aux côtés de la régente Anne d’Autriche.',
      'Les traités de Westphalie (1648) mettent fin à la guerre de Trente Ans et donnent l’Alsace à la France.',
      'Il traverse la Fronde (1648-1653), chassé deux fois du royaume, sans céder l’autorité du roi.',
      'Le traité des Pyrénées (1659) fait de la France la première puissance d’Europe.',
      'Il forme le jeune Louis XIV, qui décide de gouverner seul dès le lendemain de sa mort, en mars 1661.',
      'Il lègue la bibliothèque Mazarine, première bibliothèque publique de France.',
    ],
    mots: [
      {
        mot: 'Mazarinade',
        sens: 'Pamphlet imprimé contre le cardinal Mazarin pendant la Fronde : il en a paru plus de cinq mille.',
      },
      {
        mot: 'Congrès',
        sens: 'Réunion des envoyés de plusieurs États pour négocier ensemble une paix générale, comme à Westphalie.',
      },
      {
        mot: 'Souveraineté',
        sens: 'Droit d’un État de décider chez lui sans rendre de comptes à une autorité supérieure.',
      },
    ],
    lies: ['anne-d-autriche', 'louis-xiv', 'la-fronde', 'richelieu', 'colbert'],
    niveaux: ['5e'],
    programme: 'Du prince de la Renaissance au roi absolu (François Ier, Henri IV, Louis XIV)',
    tags: [
      'Mazarini',
      'cardinal',
      'Fronde',
      'mazarinades',
      'Westphalie',
      'traité des Pyrénées',
      'bibliothèque Mazarine',
      'Anne d’Autriche',
      'Casal',
      'Quatre-Nations',
      'Marie-Thérèse',
    ],
  },
  {
    id: 'anne-d-autriche',
    volet: 'personnages',
    nom: 'Anne d’Autriche',
    surnom: 'la régente qui n’a rien cédé',
    dates: '1601 – 1666',
    tri: 1666,
    periode: 'temps-modernes',
    emoji: '👸',
    roles: ['Reine de France', 'Régente du royaume', 'Infante d’Espagne'],
    origine: 'Valladolid, royaume d’Espagne',
    accroche:
      'Reine venue d’Espagne, régente pour un fils de quatre ans, elle traverse la Fronde sans rien céder et lui rend un royaume entier.',
    citations: [
      {
        texte: 'C’était une grande reine, et je ne dis pas assez : c’était un grand roi.',
        qui: 'Louis XIV',
        contexte:
          'Ce que son fils dit d’elle à sa mort, le 20 janvier 1666, selon Mme de Motteville, sa dame d’atours.',
        sens:
          'Le plus grand éloge qu’un roi de France pouvait faire : elle n’a pas gardé la place, elle a fait le métier — et elle le lui a rendu intact.',
        incertaine: true,
      },
      {
        texte: 'Voyez comme mes mains sont enflées : il est temps de m’en aller.',
        contexte:
          'À ses proches, dans les derniers mois de sa maladie, en 1665. Rapporté par Mme de Motteville dans ses *Mémoires*.',
        sens:
          'On disait qu’elle avait les plus belles mains d’Europe et elle en prenait un soin célèbre. C’est en les regardant qu’elle comprend qu’elle va mourir, et elle le dit sans trembler.',
      },
    ],
    reperes: [
      'Infante d’Espagne, fille de Philippe III : elle épouse Louis XIII en 1615, tous deux ont quatorze ans.',
      'Vingt-trois ans de mariage sans enfant, puis la naissance de Louis-Dieudonné, le 5 septembre 1638.',
      'Le 18 mai 1643, le Parlement casse le testament de Louis XIII et lui donne la régence entière.',
      'Elle garde Mazarin comme ministre contre le Parlement, les princes et Paris.',
      'Elle fait bâtir l’église du Val-de-Grâce, promise à Dieu pour la naissance de son fils.',
      'Morte d’un cancer le 20 janvier 1666, après avoir remis à Louis XIV un royaume entier.',
    ],
    recit: [
      {
        titre: 'Une infante à quatorze ans',
        texte:
          'Ana María Mauricia naît à **Valladolid** en 1601, fille du roi **Philippe III** d’Espagne. On l’appelle « d’**Autriche** » parce que les rois d’Espagne sont des **Habsbourg**, la maison d’Autriche. En **1615**, le double mariage espagnol voulu par Marie de Médicis l’échange sur la Bidassoa contre une princesse française : elle épouse **Louis XIII**, ils ont quatorze ans l’un et l’autre. Le mariage est froid, la cour est hostile, Richelieu la surveille. En **1637**, on découvre qu’elle écrit en secret à son frère, le roi d’Espagne, avec lequel la France est en guerre : interrogée au **Val-de-Grâce**, elle doit signer un engagement humiliant. Vingt-trois ans passent sans héritier — et sans héritier, le trône irait au frère du roi, comploteur notoire. C’est la première moitié de sa vie : une étrangère soupçonnée, sans pouvoir et sans enfant.',
      },
      {
        titre: 'Louis-Dieudonné',
        texte:
          'Le **5 septembre 1638**, à Saint-Germain-en-Laye, elle met au monde un fils. Le royaume, qui n’y croyait plus, l’appelle **Louis-Dieudonné** — donné par Dieu. Son mari venait, sept mois plus tôt, de consacrer la France à la **Vierge**. Un second fils, **Philippe**, naît en 1640. Anne d’Autriche avait fait de son côté une promesse : si Dieu lui donnait un enfant, elle élèverait une église magnifique. Elle tiendra parole. Le **Val-de-Grâce**, commencé en **1645** sur les plans de **François Mansart**, a sa première pierre posée par un roi de **sept ans** ; sa coupole reste l’une des plus belles de Paris, et c’est là que reposera le cœur de la reine. Ce n’est pas un détail de dévote : cette femme a gouverné dix-huit ans en pensant qu’elle devrait en répondre.',
      },
      {
        titre: '18 mai 1643 : la régence entière',
        texte:
          'Louis XIII meurt le 14 mai **1643**. Son testament, méfiant, enferme sa veuve dans un conseil qu’elle ne pourra pas contredire. Quatre jours plus tard, dans un **lit de justice** tenu par un roi de quatre ans assis sur les genoux d’un chancelier, le **Parlement de Paris casse le testament** et lui donne « l’administration libre, absolue et entière » du royaume. Toute la cour attend alors qu’elle renvoie **Mazarin**, l’homme de Richelieu, l’Italien, le ministre de ceux qui l’avaient humiliée. Elle le garde, et en fait son **principal ministre**. C’est le choix le plus important de sa vie et il est entièrement le sien : elle a compris que le royaume avait besoin d’un professionnel, et que la guerre contre l’Espagne — son propre pays — devait être gagnée avant d’être négociée.',
      },
      {
        titre: 'La Fronde : ne rien céder',
        texte:
          'En août **1648**, l’arrestation du conseiller **Broussel** dresse douze cents barricades dans Paris ; elle cède sur l’homme et n’oublie rien. Dans la nuit du **5 au 6 janvier 1649**, elle fait sortir la cour de Paris en secret et couche à **Saint-Germain** sur de la paille, avec ses deux enfants. En février **1651**, des Parisiens en armes exigent de vérifier que le roi n’a pas fui : elle ouvre les portes du Palais-Royal et les fait défiler en silence devant le lit où son fils fait semblant de dormir. **Mazarin** est chassé deux fois ; elle continue de lui écrire et de le rappeler. Sur tout le reste, elle ne bouge pas : ni le Parlement ni les princes n’obtiendront une part de l’autorité royale. Quatre siècles plus tôt, une autre reine étrangère, **Blanche de Castille**, avait tenu de la même façon la couronne d’un enfant contre les grands révoltés. La comparaison a été faite dès l’époque.',
      },
      {
        titre: 'Ce qu’elle transmet',
        texte:
          'Le **7 septembre 1651**, Louis XIV est déclaré majeur à treize ans ; sa mère reste pourtant au Conseil, et gouverne avec Mazarin jusqu’en **1661**. Elle élève son fils dans deux idées simples : un roi rend des comptes à Dieu, et un roi ne partage pas. En 1659, elle revoit à **Saint-Jean-de-Luz** sa famille d’Espagne pour le mariage de Louis XIV — elle n’avait pas vu son frère depuis quarante-quatre ans. À la mort de Mazarin, elle se retire ; son fils, poliment, ne lui demande plus son avis. Un **cancer du sein** la prend en 1664 ; elle endure deux ans de traitements atroces sans se plaindre et meurt au Louvre le **20 janvier 1666**, à soixante-quatre ans. Son corps va à Saint-Denis, son cœur au **Val-de-Grâce**. Elle avait reçu un royaume en guerre civile avec un roi de quatre ans ; elle a rendu un royaume entier à un roi de vingt-deux.',
      },
    ],
    chrono: [
      { date: '22 septembre 1601', fait: 'Naissance à Valladolid, infante d’Espagne.' },
      { date: '1615', fait: 'Mariage avec Louis XIII : ils ont quatorze ans.' },
      { date: '5 septembre 1638', fait: 'Naissance du dauphin, futur Louis XIV.' },
      { date: '14 mai 1643', fait: 'Mort de Louis XIII.' },
      { date: '18 mai 1643', fait: 'Le Parlement casse le testament : elle est régente sans partage.' },
      { date: '1645', fait: 'Première pierre du Val-de-Grâce, posée par son fils de sept ans.' },
      { date: 'août 1648', fait: 'Barricades de Paris : la Fronde commence.' },
      { date: '6 janvier 1649', fait: 'La cour quitte Paris de nuit pour Saint-Germain.' },
      { date: 'février 1651', fait: 'Les Parisiens défilent devant le lit du roi endormi.' },
      { date: '7 septembre 1651', fait: 'Majorité de Louis XIV, à treize ans.' },
      { date: '1661', fait: 'Mort de Mazarin : elle quitte les affaires.' },
      { date: '20 janvier 1666', fait: 'Mort au Louvre ; son cœur va au Val-de-Grâce.' },
    ],
    leSaisTu:
      'Anne d’Autriche avait, disait-on, les plus belles mains d’Europe. Elle les soignait toute l’année, dormait avec des gants enduits de pommade, et les peintres les mettaient en avant sur ses portraits. Ce sont ces mains qu’elle regarda, en 1665, pour comprendre qu’elle allait mourir.',
    aRetenir: [
      'Anne d’Autriche, infante d’Espagne, épouse Louis XIII en 1615 et lui donne un héritier en 1638, après 23 ans.',
      'Le 18 mai 1643, le Parlement casse le testament de Louis XIII et lui confie la régence entière.',
      'Elle choisit de garder Mazarin comme principal ministre et ne l’abandonne jamais.',
      'Pendant la Fronde (1648-1653), elle ne cède rien de l’autorité royale.',
      'Comme Blanche de Castille quatre siècles plus tôt, c’est une reine étrangère qui sauve la couronne d’un enfant.',
      'Elle meurt le 20 janvier 1666 ; son cœur repose au Val-de-Grâce, qu’elle avait fait bâtir.',
    ],
    mots: [
      {
        mot: 'Infante',
        sens: 'Titre porté par les filles du roi d’Espagne, comme « dauphin » pour le fils aîné du roi de France.',
      },
      {
        mot: 'Lit de justice',
        sens: 'Séance où le roi vient en personne au Parlement pour imposer l’enregistrement d’un acte.',
      },
      {
        mot: 'Régence',
        sens: 'Gouvernement exercé au nom d’un roi trop jeune pour régner, jusqu’à ses treize ans accomplis.',
      },
    ],
    lies: ['louis-xiii', 'mazarin', 'louis-xiv', 'la-fronde', 'blanche-de-castille'],
    niveaux: ['5e'],
    programme: 'Du prince de la Renaissance au roi absolu (François Ier, Henri IV, Louis XIV)',
    tags: [
      'infante',
      'Espagne',
      'Habsbourg',
      'régente',
      'Fronde',
      'Mazarin',
      'Val-de-Grâce',
      'Louis-Dieudonné',
      'Saint-Germain',
      'lit de justice',
    ],
  },
  {
    id: 'turenne',
    volet: 'personnages',
    nom: 'Turenne',
    surnom: 'le premier capitaine du siècle',
    dates: '1611 – 1675',
    tri: 1675,
    periode: 'temps-modernes',
    emoji: '🛡️',
    roles: [
      'Maréchal général des camps et armées du roi',
      'Vicomte de Turenne',
      'Vainqueur des Dunes',
    ],
    origine: 'Sedan, principauté souveraine',
    accroche:
      'Maréchal de France à trente-deux ans, il sauve la couronne pendant la Fronde, dégage l’Alsace en plein hiver et meurt d’un boulet, face à l’ennemi.',
    citations: [
      {
        texte:
          'Tu trembles, carcasse ; mais si tu savais où je vais te mener tout à l’heure, tu tremblerais bien davantage.',
        contexte:
          'À son propre corps, avant d’entrer au feu. La phrase la plus célèbre qu’on lui prête ; aucun témoin ne l’a écrite de son vivant.',
        sens:
          'Le courage n’est pas l’absence de peur : c’est la peur à qui l’on donne des ordres. Turenne, enfant maladif et bègue, s’est fabriqué son courage.',
        incertaine: true,
      },
      {
        texte: 'Il est mort aujourd’hui un homme qui faisait honneur à l’homme.',
        qui: 'Montecuccoli, le général impérial qui lui faisait face',
        contexte: 'À l’annonce de la mort de Turenne, tué par un boulet à Sasbach le 27 juillet 1675.',
        sens:
          'L’adversaire qu’il manœuvrait depuis des mois arrête la campagne et lui rend hommage devant ses propres troupes : cela ne s’était jamais vu.',
        incertaine: true,
      },
      {
        texte:
          'Lisez et relisez les campagnes d’Alexandre, d’Hannibal, de César, de Gustave-Adolphe, de Turenne, d’Eugène et de Frédéric.',
        qui: 'Napoléon Ier',
        contexte: 'Conseil donné aux jeunes officiers dans ses *Maximes de guerre* : c’est ainsi, dit-il, qu’on devient un grand capitaine.',
        sens:
          'Sept noms en tout dans l’histoire du monde, et un seul Français : cent trente ans après sa mort, Turenne était encore le manuel.',
      },
    ],
    reperes: [
      'Petit-fils de Guillaume d’Orange, élevé protestant à Sedan, qui n’est pas encore terre française.',
      'À quatorze ans, il sert en Hollande comme simple soldat sous son oncle Maurice de Nassau.',
      'Maréchal de France à trente-deux ans, en 1643 ; maréchal général des armées du roi en 1660.',
      'Un an du côté des princes pendant la Fronde, puis il sauve la couronne au faubourg Saint-Antoine.',
      'Converti au catholicisme en 1668, après des années d’étude et de discussions avec Bossuet.',
      'Campagne d’hiver d’Alsace et surprise de Turckheim, le 5 janvier 1675 : son chef-d’œuvre.',
    ],
    recit: [
      {
        titre: 'L’enfant des remparts de Sedan',
        texte:
          'Henri de La Tour d’Auvergne, vicomte de **Turenne**, naît en **1611** à **Sedan**, alors principauté souveraine que son père gouverne, et qui n’appartient pas au roi de France. Par sa mère, il est le petit-fils de **Guillaume d’Orange**, le fondateur des Provinces-Unies. On l’élève dans la religion **protestante**. L’enfant est chétif et bègue ; on le juge incapable de faire un soldat. À dix ans, pour prouver le contraire, il passe une nuit d’hiver seul sur un rempart, couché contre un canon : on l’y retrouve endormi au matin. À quatorze ans, il part servir en Hollande auprès de son oncle **Maurice de Nassau**, non comme prince mais comme **simple soldat**, la pique sur l’épaule. Il entre au service de la France en **1630** ; à vingt-trois ans il est maréchal de camp.',
      },
      {
        titre: 'Le maréchal de l’armée d’Allemagne',
        texte:
          'Fait **maréchal de France** en **1643**, à trente-deux ans, il reçoit une armée d’Allemagne battue, découragée, impayée — et la refait en six mois. Suivent **Fribourg** (1644) avec **Condé**, **Nördlingen** (1645), puis **Zusmarshausen** (1648), où, avec le Suédois Wrangel, il pousse les armées impériales si loin que l’empereur se résout à signer la paix de **Westphalie**. Sa manière est à l’opposé de celle de Condé, qui charge : Turenne **marche**. Il use l’adversaire par des mouvements, lui coupe ses vivres, choisit son terrain, et n’accepte la bataille que si elle décide de quelque chose. Il compte ses hommes et déteste les pertes inutiles. Ses soldats disaient qu’il parlait de « **nous** » quand on avait gagné, et de « **je** » quand on avait perdu.',
      },
      {
        titre: 'La Fronde, des deux côtés',
        texte:
          'Sa vie a une tache, et il ne l’a jamais niée. En **1649**, entraîné par la duchesse de Longueville et par la révolte des princes, il quitte le service du roi, prend les armes contre lui et s’allie aux Espagnols. Il est battu à **Rethel** en décembre 1650. Pardonné, il revient — et c’est lui qui sauve la couronne. En avril **1652**, à **Bléneau**, il couvre avec une poignée d’hommes la retraite de la cour que Condé allait enlever. Le **2 juillet 1652**, au **faubourg Saint-Antoine**, il acculé l’armée des princes contre les murs de Paris et la détruisait quand la **Grande Mademoiselle** fit tirer sur lui le canon de la **Bastille** pour sauver Condé. Louis XIV, qui avait treize ans et regardait la bataille de la colline de Charonne, n’a jamais oublié qui, ce jour-là, se battait pour lui.',
      },
      {
        titre: 'Les Dunes, puis la conversion',
        texte:
          'Le **14 juin 1658**, sur la plage près de **Dunkerque**, il livre la **bataille des Dunes** contre l’armée espagnole où sert Condé : il attaque à marée basse, enlève les dunes à la baïonnette et gagne en quelques heures. Dunkerque tombe ; l’Espagne demande la paix, et **Mazarin** signe l’année suivante le traité des Pyrénées. Louis XIV fait relever pour lui, en **1660**, la dignité de **maréchal général des camps et armées du roi**. Restait sa religion : Turenne étudie pendant des années, discute avec **Bossuet**, lit les Pères de l’Église, et **abjure le protestantisme le 23 octobre 1668**. Toute l’Europe en parle, parce que personne ne peut dire qu’il y gagnait quelque chose : il était déjà au sommet. Il continuera d’ailleurs à protéger ses anciens coreligionnaires.',
      },
      {
        titre: 'L’hiver d’Alsace, et Sasbach',
        texte:
          'Sa dernière campagne est celle qu’on enseigne encore. En **1674**, la France est attaquée de tous côtés ; l’Alsace est envahie par soixante mille Impériaux, Turenne en a moitié moins. Il gagne **Sinsheim**, puis **Entzheim**, mais ne peut tenir : il fait alors ce que personne ne fait au XVIIᵉ siècle, il refuse de prendre ses **quartiers d’hiver**. En décembre, il disparaît derrière les **Vosges**, descend plein sud par des cols enneigés sans qu’aucun espion ne le suive, surgit à **Belfort**, remonte la plaine et surprend l’ennemi à **Turckheim** le **5 janvier 1675**. En un mois, l’Alsace est dégagée sans grande bataille. Son ordre de dévaster le **Palatinat**, l’été précédent, appartient aussi à cette guerre, et l’Allemagne s’en souviendra longtemps. Le **27 juillet 1675**, à **Sasbach**, il observe le terrain à la lunette quand un boulet le tue net. L’armée recule sans lui. **Louis XIV** le fait enterrer à **Saint-Denis parmi les rois** — honneur accordé avant lui au seul **Du Guesclin** ; **Bonaparte** le transférera en 1800 aux **Invalides**, où est son tombeau.',
      },
    ],
    chrono: [
      { date: '11 septembre 1611', fait: 'Naissance à Sedan.' },
      { date: '1625', fait: 'À quatorze ans, simple soldat en Hollande sous son oncle.' },
      { date: '1643', fait: 'Maréchal de France à trente-deux ans.' },
      { date: '1648', fait: 'Zusmarshausen : l’Empire se résout à signer la paix de Westphalie.' },
      { date: '1649-1650', fait: 'Il prend les armes avec les princes, contre le roi.' },
      { date: '2 juillet 1652', fait: 'Faubourg Saint-Antoine : il sauve la couronne.' },
      { date: '14 juin 1658', fait: 'Victoire des Dunes sur les Espagnols et sur Condé.' },
      { date: '1660', fait: 'Maréchal général des camps et armées du roi.' },
      { date: '23 octobre 1668', fait: 'Il abjure le protestantisme.' },
      { date: '5 janvier 1675', fait: 'Surprise de Turckheim : l’Alsace est dégagée.' },
      { date: '27 juillet 1675', fait: 'Tué par un boulet à Sasbach.' },
      { date: '1800', fait: 'Son tombeau est transféré aux Invalides.' },
    ],
    leSaisTu:
      'Enfant, on le disait trop faible pour la guerre. Une nuit d’hiver, à dix ans, il sortit prouver le contraire : il alla dormir seul sur les remparts de Sedan, couché contre l’affût d’un canon. On le chercha toute la nuit et on le retrouva là au matin, glacé et endormi. Personne, ensuite, ne lui reparla de sa santé.',
    aRetenir: [
      'Turenne (1611-1675) est le premier capitaine du siècle : maréchal de France à 32 ans, en 1643.',
      'Élevé protestant à Sedan, il se convertit au catholicisme en 1668.',
      'Après un an passé du côté des princes, il sauve la couronne au faubourg Saint-Antoine, le 2 juillet 1652.',
      'Sa victoire des Dunes, le 14 juin 1658, conduit au traité des Pyrénées.',
      'La campagne d’hiver d’Alsace et la surprise de Turckheim (5 janvier 1675) sont son chef-d’œuvre.',
      'Tué à Sasbach en 1675, il est enterré à Saint-Denis parmi les rois, puis aux Invalides depuis 1800.',
    ],
    mots: [
      {
        mot: 'Maréchal de France',
        sens: 'La plus haute dignité militaire du royaume, donnée à vie par le roi à un chef d’armée.',
      },
      {
        mot: 'Quartiers d’hiver',
        sens: 'Les mois où les armées cessent de se battre et se logent dans les villes — règle que Turenne a brisée.',
      },
      {
        mot: 'Abjuration',
        sens: 'Acte par lequel on renonce publiquement à sa religion pour en embrasser une autre.',
      },
    ],
    lies: ['la-fronde', 'mazarin', 'louis-xiv', 'vauban', 'anne-d-autriche'],
    niveaux: ['5e'],
    programme: 'Du prince de la Renaissance au roi absolu (François Ier, Henri IV, Louis XIV)',
    tags: [
      'maréchal',
      'Sedan',
      'La Tour d’Auvergne',
      'bataille des Dunes',
      'Turckheim',
      'Sasbach',
      'Condé',
      'Alsace',
      'Fronde',
      'Invalides',
      'Bossuet',
    ],
  },
]
