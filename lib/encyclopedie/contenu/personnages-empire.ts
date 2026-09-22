// -----------------------------------------------------------------------------
// RÉVOLUTION ET EMPIRE — les six qui ont fait, servi, sacré ou combattu
// Napoléon : Pie VII, Joséphine, Talleyrand, Madame de Staël, Fouché, et
// l'Empereur lui-même.
//
// Le ton suit `docs/encyclopedie.md` § 3 : Pie VII est raconté avec le respect
// dû aux figures chrétiennes — sa foi comme moteur de ses actes, sa captivité
// dans son temps, son pardon d'après Waterloo — et Napoléon sans hagiographie
// ni réquisitoire : ce qu'il FONDE et qui tient encore (Code civil, préfets,
// lycées, Banque de France, franc germinal) ET ce que ça coûte (un million de
// morts français, l'esclavage rétabli en 1802, la presse réduite à quatre
// journaux). Les deux sont de lui, et la fiche écrit les deux.
//
// NOTE SUR LE TRI. Deux fiches meurent au-delà des bornes de la période
// `revolution` (`PERIODE_BORNES`, lib/encyclopedie/types.ts) : Pie VII (1823)
// et Talleyrand (1838). Elles sont triées sur leur FAIT MAJEUR — le Concordat
// de 1801, le congrès de Vienne de 1815 — et leur vraie date de mort reste
// dans `dates`. Napoléon, lui, est trié sur 1821 : c'est la BORNE qui a été
// repoussée à 1825, parce qu'une encyclopédie qui classe l'Empereur sur une
// autre année que celle de sa mort se trompe de correctif.
// -----------------------------------------------------------------------------

import type { Personnage } from '../types'

export const PERSONNAGES_EMPIRE: Personnage[] = [
  {
    id: 'pie-vii',
    volet: 'personnages',
    nom: 'Pie VII',
    surnom: 'le pape qui tint tête à l’Empereur',
    dates: '1742 – 1823',
    tri: 1801,
    periode: 'revolution',
    emoji: '⛪',
    roles: ['Pape', 'Moine bénédictin', 'Prisonnier de Napoléon'],
    origine: 'Cesena, États pontificaux',
    accroche:
      'Il signe avec Bonaparte la paix religieuse de la France, vient le sacrer à Paris, lui refuse le reste — et passe cinq ans prisonnier.',
    citations: [
      {
        texte: 'Non debemus, non possumus, non volumus.',
        contexte:
          'Réponse aux envoyés de Napoléon qui exigeaient qu’il renonce à ses États, en 1809.',
        sens:
          '« Nous ne le devons pas, nous ne le pouvons pas, nous ne le voulons pas » : le refus du pape tient en trois mots de latin.',
      },
      {
        texte:
          'Il ne peut plus être dangereux pour personne ; nous ne voudrions pas qu’il devînt un remords pour nous.',
        contexte:
          'À son secrétaire d’État Consalvi, en 1817, pour demander aux Anglais d’adoucir la captivité de Sainte-Hélène.',
        sens:
          'Six ans après avoir été son prisonnier, le pape intercède pour l’homme qui l’avait fait enlever.',
      },
      {
        texte: 'Commediante ! … Tragediante !',
        contexte:
          'Réponse prêtée au pape devant les colères de Napoléon, rapportée par les mémorialistes du temps.',
        sens:
          '« Comédien ! … Tragédien ! » : il aurait refusé de prendre au sérieux les mises en scène de l’Empereur. Aucune source directe ne l’atteste.',
        incertaine: true,
      },
    ],
    reperes: [
      'Barnaba Chiaramonti, moine bénédictin, élu pape à Venise en 1800, alors que la France occupe Rome.',
      'Le Concordat du 15 juillet 1801 rend la paix religieuse à la France après dix ans de rupture.',
      'Il vient à Paris sacrer Napoléon le 2 décembre 1804 — mais l’Empereur se couronne lui-même.',
      'Il excommunie les spoliateurs de ses États en juin 1809 ; enlevé de nuit, il est détenu cinq ans.',
      'Il rentre à Rome le 24 mai 1814 et rétablit la Compagnie de Jésus la même année.',
      'Après Waterloo, il accueille à Rome la mère et les frères de Napoléon.',
    ],
    recit: [
      {
        titre: 'Un pape élu loin de Rome',
        texte:
          'Barnaba Chiaramonti devient pape dans les pires circonstances : son prédécesseur **Pie VI** vient de mourir prisonnier des Français, à Valence, en août 1799. Rome est occupée, les cardinaux dispersés. Le conclave se tient à **Venise**, sous protection autrichienne, et dure trois mois et demi ; le 14 mars **1800**, Chiaramonti est élu et prend le nom de **Pie VII**. Il a cinquante-sept ans, il est moine **bénédictin**, professeur de théologie, réputé pour sa douceur et son obstination. Évêque d’Imola pendant l’occupation française, il avait prêché à Noël 1797 un sermon resté célèbre : la démocratie, disait-il, n’est pas contraire à l’Évangile, et un chrétien peut servir une république. C’est cet homme-là que **Bonaparte** trouve en face de lui quand il décide, quelques mois plus tard, de refaire la paix religieuse de la France.',
      },
      {
        titre: 'Le Concordat : rendre la messe à la France',
        texte:
          'Depuis la **Constitution civile du clergé** (1790), l’Église de France est coupée en deux : les prêtres « jureurs », qui ont prêté serment à la Nation, et les « réfractaires », qui ont refusé — déportés, cachés, parfois fusillés. Les églises ont été fermées, les cloches fondues, le calendrier républicain a effacé le dimanche. Bonaparte n’est pas dévot, il compte : on ne gouverne pas durablement un pays dont la majorité veut la messe. Les négociations durent huit mois. Le **15 juillet 1801**, le **Concordat** est signé. Le catholicisme y est reconnu comme « la religion de la grande majorité des Français » — et non comme religion d’État. L’État paie le clergé ; le Premier consul nomme les évêques, le pape leur donne l’institution canonique ; l’Église renonce définitivement aux **biens nationaux** vendus pendant la Révolution. Pie VII a beaucoup cédé ; il a rouvert les églises. Au printemps 1802, Bonaparte publie le texte flanqué d’**Articles organiques** que le pape n’a jamais vus et qui placent l’Église sous la surveillance de la police : la première brouille est déjà là.',
      },
      {
        titre: 'Le sacre, puis l’enlèvement',
        texte:
          'Le **2 décembre 1804**, Pie VII est à **Notre-Dame de Paris**. Il a franchi les Alpes en plein hiver pour venir sacrer un empereur, ce qu’aucun pape n’avait fait depuis **Charlemagne**. Il bénit les couronnes ; Napoléon se couronne lui-même, puis couronne Joséphine. Le pape obtient peu en échange et repart. La rupture vient de la guerre : l’Empereur exige que les États du pape ferment leurs ports aux Anglais, puis, en 1809, les **annexe** purement et simplement. Le 10 juin 1809, Pie VII répond par la seule arme qui lui reste : la bulle *Quum memoranda* **excommunie** les spoliateurs du patrimoine de saint Pierre, sans nommer Napoléon mais sans que personne s’y trompe. Dans la nuit du 5 au 6 juillet, le général **Radet** escalade le palais du **Quirinal** et l’emmène. Commence une captivité de cinq ans : **Savone** d’abord, puis **Fontainebleau** à partir de 1812. Épuisé, malade, séparé de ses cardinaux, il signe en janvier 1813 un « concordat de Fontainebleau » — et le rétracte deux mois plus tard, par écrit.',
      },
      {
        titre: 'Le retour, et le pardon',
        texte:
          'L’Empire s’effondre ; Napoléon libère son prisonnier. Le **24 mai 1814**, Pie VII rentre dans Rome au milieu d’une foule immense. Dès le mois d’août, il rétablit la **Compagnie de Jésus**, supprimée quarante ans plus tôt, rouvre les écoles et les musées, rappelle les savants et fait protéger les monuments antiques. Puis vient **Waterloo**, et le geste que l’on attendait le moins : le pape ouvre Rome à la famille de l’homme qui l’avait fait enlever. **Letizia Bonaparte**, la mère de l’Empereur, son oncle le cardinal **Fesch**, ses frères Lucien et Louis y trouvent asile et y finiront leurs jours. En 1817, il charge son secrétaire d’État **Consalvi** de demander aux Anglais d’adoucir la captivité de **Sainte-Hélène**, et obtient qu’un prêtre corse, l’abbé Vignali, parte rejoindre le prisonnier. Il meurt à Rome en **1823**, à quatre-vingt-un ans.',
      },
    ],
    chrono: [
      { date: '1742', fait: 'Naissance à Cesena, dans les États pontificaux.' },
      { date: '14 mars 1800', fait: 'Élu pape à Venise, il prend le nom de Pie VII.' },
      { date: '15 juillet 1801', fait: 'Concordat signé avec Bonaparte.' },
      { date: '2 décembre 1804', fait: 'Il sacre Napoléon à Notre-Dame de Paris.' },
      { date: '10 juin 1809', fait: 'Il excommunie les spoliateurs des États pontificaux.' },
      { date: 'juillet 1809', fait: 'Enlevé de nuit au Quirinal, emmené à Savone.' },
      { date: '1812', fait: 'Transféré à Fontainebleau, malade et isolé.' },
      { date: '24 mai 1814', fait: 'Retour triomphal à Rome.' },
      { date: '1815', fait: 'Il accueille la famille Bonaparte après Waterloo.' },
      { date: '1823', fait: 'Mort à Rome, à 81 ans.' },
    ],
    leSaisTu:
      'Dans la nuit du 5 au 6 juillet 1809, le général Radet fait dresser des échelles contre le palais du Quirinal et entre par une fenêtre. Il trouve le pape assis à sa table, en habit blanc, entouré de ses cardinaux. Pie VII ne résiste pas : il demande seulement qu’on le laisse emporter son bréviaire. Ce sera, avec un crucifix, tout le bagage de cinq ans de captivité.',
    aRetenir: [
      'Le Concordat du 15 juillet 1801, signé entre Bonaparte et Pie VII, rétablit la paix religieuse en France.',
      'Pie VII vient sacrer Napoléon à Notre-Dame le 2 décembre 1804, mais l’Empereur se couronne lui-même.',
      'En 1809, Napoléon annexe les États pontificaux : le pape l’excommunie, est enlevé et détenu cinq ans à Savone puis à Fontainebleau.',
      'Pie VII rentre à Rome le 24 mai 1814 et rétablit la Compagnie de Jésus la même année.',
      'Après Waterloo, il accueille la famille Bonaparte et demande aux Anglais d’adoucir la captivité de Sainte-Hélène.',
    ],
    mots: [
      {
        mot: 'Concordat',
        sens: 'Accord signé entre le pape et un État pour régler le statut de l’Église dans ce pays.',
      },
      {
        mot: 'Excommunication',
        sens: 'Sentence qui exclut un baptisé de la communion de l’Église et de ses sacrements.',
      },
      {
        mot: 'États pontificaux',
        sens: 'Les territoires d’Italie centrale gouvernés par le pape comme un souverain, jusqu’en 1870.',
      },
    ],
    lies: ['napoleon-bonaparte', 'concordat-de-1801', 'sacre-de-napoleon', 'talleyrand'],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'pape',
      'Concordat',
      'Rome',
      'Savone',
      'Fontainebleau',
      'Chiaramonti',
      'excommunication',
      'sacre',
      'États pontificaux',
      'Quirinal',
    ],
  },
  {
    id: 'josephine-de-beauharnais',
    volet: 'personnages',
    nom: 'Joséphine de Beauharnais',
    surnom: 'l’impératrice répudiée',
    dates: '1763 – 1814',
    tri: 1814,
    periode: 'revolution',
    emoji: '🌹',
    roles: ['Impératrice des Français', 'Créole de Martinique', 'Première épouse de Napoléon'],
    origine: 'Les Trois-Îlets, Martinique',
    accroche:
      'Veuve de la Terreur devenue impératrice, elle est répudiée à quarante-six ans parce qu’elle ne donne pas d’héritier à l’Empire.',
    citations: [
      {
        texte:
          'Je me plais à lui donner la plus grande preuve d’attachement et de dévouement qui ait jamais été donnée sur la terre.',
        contexte:
          'Déclaration lue lors de la cérémonie de divorce, aux Tuileries, le 15 décembre 1809.',
        sens:
          'La voix brisée, elle n’a pas pu achever : un ministre a lu la fin du texte à sa place, devant toute la cour.',
      },
      {
        texte:
          'Je n’ai pas passé un jour sans t’aimer ; je n’ai pas passé une nuit sans te serrer dans mes bras.',
        qui: 'Napoléon Bonaparte',
        contexte: 'Lettre envoyée d’Italie à Joséphine, en 1796, pendant la première campagne.',
      },
      {
        texte: 'Bonaparte… l’île d’Elbe… le roi de Rome…',
        contexte: 'Derniers mots prêtés à Joséphine, à Malmaison, le 29 mai 1814.',
        sens:
          'Ses proches les ont rapportés après coup, et pas tous de la même façon : la scène est belle, la source est faible.',
        incertaine: true,
      },
    ],
    reperes: [
      'Née Marie-Josèphe-Rose Tascher de La Pagerie en 1763 dans une habitation sucrière de la Martinique.',
      'Son premier mari, le général de Beauharnais, est guillotiné en juillet 1794 ; elle sort de prison après le 9 thermidor.',
      'Elle épouse Bonaparte le 9 mars 1796 : c’est lui qui l’appelle « Joséphine ».',
      'Couronnée impératrice des Français à Notre-Dame le 2 décembre 1804.',
      'Répudiée le 15 décembre 1809 faute d’héritier ; elle garde son titre et le château de Malmaison.',
      'Morte à Malmaison le 29 mai 1814 ; son petit-fils deviendra Napoléon III.',
    ],
    recit: [
      {
        titre: 'De la Martinique à la prison des Carmes',
        texte:
          'Marie-Josèphe-Rose **Tascher de La Pagerie** naît en 1763 aux **Trois-Îlets**, en Martinique, dans une habitation sucrière que font tourner des esclaves. À seize ans, mariée à Paris au vicomte **Alexandre de Beauharnais**, elle lui donne deux enfants, **Eugène** et **Hortense**, et se sépare de lui au bout de quatre ans. La Révolution rattrape le ménage : Alexandre, devenu général républicain, est accusé d’avoir laissé tomber Mayence et **guillotiné le 23 juillet 1794**. Rose est enfermée depuis trois mois à la prison des **Carmes**, où l’on attend son tour. La chute de **Robespierre**, le 9 thermidor — deux jours après l’exécution de son mari —, lui sauve la vie. Elle sort de prison à trente et un ans : veuve, ruinée, avec deux enfants à élever.',
      },
      {
        titre: 'Madame Bonaparte',
        texte:
          'Le Paris du **Directoire** est celui des fêtes, des fortunes rapides et des salons. Rose de Beauharnais y devient l’une des « merveilleuses », protégée de **Barras**. À l’automne 1795, elle rencontre un général corse de vingt-six ans, maigre et mal habillé, qui tombe fou d’elle. Il déteste son prénom et l’appelle **Joséphine** : le nom lui restera pour l’histoire. Ils se marient civilement le **9 mars 1796** — elle s’est rajeunie de quatre ans sur l’acte, lui vieilli de deux. Deux jours plus tard, il part pour l’**Italie** et lui écrit des lettres brûlantes qu’elle lit distraitement. Elle le trompe ; il l’apprend en Égypte et le lui rend. Le ménage tient pourtant, parce qu’elle lui apporte exactement ce qui lui manque : le monde, les usages, les relations d’Ancien Régime, un art de plaire qui désarme les salons et rallie les anciens émigrés. En 1799, elle achète le château de la **Malmaison**, qui sera pendant quinze ans le seul endroit où il se repose.',
      },
      {
        titre: 'Le sacre, et une nuit de retard',
        texte:
          'La veille du sacre, Joséphine demande audience à **Pie VII** et lui apprend que son mariage n’a jamais été que civil. Le pape refuse aussitôt de couronner une femme qui n’est pas mariée devant l’Église : dans la nuit du 1er décembre 1804, le cardinal **Fesch** bénit en hâte l’union impériale dans la chapelle des Tuileries. Le lendemain, à **Notre-Dame**, Napoléon se couronne lui-même, puis pose le diadème sur la tête de sa femme agenouillée — c’est cette scène-là, et non la sienne, que **David** met au centre de son immense tableau, parce que c’est la plus humaine du sacre. Joséphine est **impératrice des Français**. Elle sait déjà ce que la cour murmure : l’Empire est héréditaire, et elle a quarante et un ans.',
      },
      {
        titre: 'La répudiation',
        texte:
          'Le couple n’a pas d’enfant. En 1806, la naissance du fils d’**Éléonore Denuelle** prouve que Napoléon peut en avoir : la décision est prise, il faudra une autre impératrice. Le **30 novembre 1809**, il le lui dit après le dîner ; elle s’effondre. Le **15 décembre**, aux Tuileries, devant la famille et les grands dignitaires, on lit l’acte de dissolution du mariage ; le lendemain, un sénatus-consulte l’enregistre. Joséphine garde le titre d’impératrice, trois millions de francs de rente et la **Malmaison**. Napoléon épouse en 1810 **Marie-Louise d’Autriche**, qui lui donne un fils l’année suivante, le **roi de Rome**. Joséphine se retire dans ses serres et ses roses, reçoit les souverains de passage — le tsar **Alexandre Ier** vient la voir en avril 1814 —, prend froid en se promenant avec lui dans le parc et meurt le **29 mai 1814**, à cinquante ans. Napoléon est à l’île d’Elbe depuis trois semaines ; il apprendra la nouvelle par un journal.',
      },
    ],
    chrono: [
      { date: '1763', fait: 'Naissance aux Trois-Îlets, en Martinique.' },
      { date: '1779', fait: 'Mariage avec Alexandre de Beauharnais.' },
      { date: 'juillet 1794', fait: 'Veuve de la guillotine, elle sort de la prison des Carmes.' },
      { date: '9 mars 1796', fait: 'Mariage civil avec Napoléon Bonaparte.' },
      { date: '1799', fait: 'Elle achète le château de Malmaison.' },
      { date: '2 décembre 1804', fait: 'Couronnée impératrice à Notre-Dame.' },
      { date: '15 décembre 1809', fait: 'Cérémonie du divorce aux Tuileries.' },
      { date: '1810', fait: 'Napoléon épouse Marie-Louise d’Autriche.' },
      { date: '29 mai 1814', fait: 'Mort à Malmaison, à 50 ans.' },
    ],
    leSaisTu:
      'Joséphine rassembla à Malmaison la plus grande collection de roses d’Europe : environ deux cent cinquante variétés, que le peintre Pierre-Joseph Redouté portraitura une à une. En pleine guerre, les navires anglais chargés de plants pour son jardin recevaient des laissez-passer. Le Blocus continental s’arrêtait à ses rosiers.',
    aRetenir: [
      'Joséphine, née en Martinique en 1763, épouse Napoléon Bonaparte le 9 mars 1796.',
      'Veuve du général de Beauharnais, guillotiné en 1794, elle a été emprisonnée sous la Terreur.',
      'Elle est couronnée impératrice des Français le 2 décembre 1804 à Notre-Dame.',
      'Napoléon la répudie le 15 décembre 1809 faute d’héritier et épouse Marie-Louise d’Autriche en 1810.',
      'Elle meurt à Malmaison le 29 mai 1814 ; son petit-fils, fils d’Hortense, deviendra Napoléon III.',
    ],
    mots: [
      {
        mot: 'Répudiation',
        sens: 'Renvoi de l’épouse par le mari ; ici, une dissolution de mariage prononcée pour raison d’État.',
      },
      {
        mot: 'Sénatus-consulte',
        sens: 'Acte voté par le Sénat qui, sous le Consulat et l’Empire, avait force de loi.',
      },
    ],
    lies: ['napoleon-bonaparte', 'sacre-de-napoleon', 'pie-vii', 'la-terreur'],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Beauharnais',
      'impératrice',
      'Malmaison',
      'Martinique',
      'divorce',
      'répudiation',
      'Tascher de La Pagerie',
      'roses',
      'sacre',
      'Hortense',
    ],
  },
  {
    id: 'talleyrand',
    volet: 'personnages',
    nom: 'Talleyrand',
    surnom: 'le diable boiteux',
    dates: '1754 – 1838',
    tri: 1815,
    periode: 'revolution',
    emoji: '🎩',
    roles: ['Évêque d’Autun', 'Ministre des Relations extérieures', 'Prince de Bénévent'],
    origine: 'Paris',
    accroche:
      'Évêque devenu ministre de cinq régimes, il quitte chacun d’eux à temps — et sauve la France vaincue au congrès de Vienne.',
    citations: [
      {
        texte: 'Quel dommage qu’un si grand homme soit si mal élevé !',
        contexte:
          'En sortant du conseil des Tuileries, le 28 janvier 1809, après que Napoléon l’a couvert d’injures devant témoins.',
        sens:
          'La scène est rapportée par plusieurs mémorialistes, avec des variantes : aucun procès-verbal ne l’enregistre.',
        incertaine: true,
      },
      {
        texte: 'Vous êtes de la merde dans un bas de soie !',
        qui: 'Napoléon, à Talleyrand',
        contexte:
          'Aux Tuileries, le 28 janvier 1809 : l’Empereur, rentré d’Espagne, apprend que son ministre a conspiré avec Fouché.',
        sens:
          'Attention au sens de la scène : le mot est prêté à Napoléon, pas à Talleyrand. C’est l’Empereur qui insulte, et le ministre qui répond froidement en sortant.',
        incertaine: true,
      },
      {
        texte:
          'Le premier besoin de l’Europe est de bannir à jamais l’opinion qu’on peut acquérir des droits par la seule conquête.',
        contexte:
          'Instructions qu’il rédige pour le congrès de Vienne, en 1814 : c’est le principe de « légitimité ».',
        sens:
          'Si la force suffit à créer un droit, aucun trône n’est sûr — pas même celui des vainqueurs. L’argument sauvera la France.',
      },
      {
        texte: 'Je souffre comme un damné.',
        contexte: 'À Louis-Philippe venu à son chevet, le 17 mai 1838, quelques heures avant sa mort.',
      },
    ],
    reperes: [
      'Boiteux depuis l’enfance, il est destiné à l’Église : évêque d’Autun à trente-quatre ans.',
      'Le 10 octobre 1789, il propose de mettre les biens du clergé à la disposition de la Nation.',
      'Ministre des Relations extérieures du Directoire, du Consulat puis de l’Empire.',
      'Il conspire contre Napoléon dès 1808 et organise le retour de Louis XVIII en 1814.',
      'Au congrès de Vienne, il obtient que la France vaincue siège avec les vainqueurs.',
      'Ambassadeur de Louis-Philippe à Londres de 1830 à 1834 : cinquième régime servi.',
    ],
    recit: [
      {
        titre: 'Un évêque par défaut',
        texte:
          '**Charles-Maurice de Talleyrand-Périgord** naît en 1754 dans l’une des plus vieilles familles du royaume. Un pied infirme — accident d’enfance ou malformation, on en discute encore — lui interdit la carrière des armes ; la famille le destine à l’Église, qui est l’autre voie des cadets de grande maison. Séminaire de **Saint-Sulpice**, ordination en 1779, puis **agent général du clergé de France** : à trente ans, il administre la fortune de la première institution du royaume et y découvre ce qu’il saura faire mieux que personne — compter, prévoir, négocier. Il est nommé **évêque d’Autun** en 1788. Il y passera moins de cinq mois.',
      },
      {
        titre: 'Le retourneur de régimes',
        texte:
          'Élu député du clergé aux **États généraux**, il choisit tout de suite l’autre camp. Le **10 octobre 1789**, c’est lui qui propose de mettre les **biens du clergé à la disposition de la Nation** : la vente des biens nationaux, qui financera la Révolution et fera basculer les fortunes du royaume, commence par sa motion. Le 14 juillet 1790, il célèbre la messe de la **Fête de la Fédération** au Champ-de-Mars devant trois cent mille personnes. Rome l’excommunie en 1791. Il s’éloigne à temps, passe la Terreur en Angleterre puis aux **États-Unis**, rentre en 1796 et se fait nommer, l’année suivante, **ministre des Relations extérieures** du Directoire. Il y invente sa méthode et sa fortune : on paie pour être reçu, on paie pour être entendu, on paie pour signer. En 1799, il pousse **Bonaparte** au coup d’État du **18 brumaire** et devient son ministre.',
      },
      {
        titre: 'La rupture avec l’Empereur',
        texte:
          'Dix ans durant, il négocie les traités de l’Empire et en encaisse les commissions ; Napoléon le fait **prince de Bénévent** en 1806. Puis il cesse de croire à l’affaire. La guerre d’**Espagne**, en 1808, lui paraît une faute sans retour : un pays qu’on ne peut ni tenir ni quitter. À l’entrevue d’**Erfurt**, la même année, il conseille en secret au tsar **Alexandre Ier** de résister à l’Empereur — c’est une trahison, et il le sait. Napoléon l’apprend. Le **28 janvier 1809**, aux Tuileries, devant les dignitaires réunis, il l’accable d’injures pendant une demi-heure. Talleyrand écoute sans un mot, salue, sort en boitant, et laisse tomber dans l’antichambre la phrase que tout Paris répétera le soir même. Il perd sa charge de grand chambellan, garde ses titres, et attend cinq ans.',
      },
      {
        titre: 'Vienne : la France sauvée par la parole',
        texte:
          'Le **31 mars 1814**, les Alliés entrent dans Paris. Le tsar loge chez Talleyrand, rue Saint-Florentin ; c’est là que se décide le sort du pays. En trois jours, il fait voter par le **Sénat** la déchéance de l’Empereur et rappelle **Louis XVIII** : la Restauration est son œuvre. Au **congrès de Vienne**, ouvert en septembre 1814, il arrive représentant d’une France vaincue que les quatre vainqueurs comptaient bien traiter sans elle. Il impose un principe, la **légitimité** : si la force suffit à défaire un trône, aucun n’est garanti, pas même ceux des vainqueurs. Puis il brise leur bloc par un **traité secret**, le 3 janvier 1815, qui allie la France à l’Autriche et à l’Angleterre contre la Russie et la Prusse. Résultat : la France garde ses frontières de 1792 et redevient une grande puissance. Les **Cent-Jours** gâcheront une partie du succès — le second traité de Paris, en novembre 1815, la ramène aux frontières de 1790, lui impose 700 millions d’indemnité et trois ans d’occupation.',
      },
      {
        titre: 'La dernière charge',
        texte:
          'Chef du gouvernement quelques semaines en 1815, il est écarté par les **ultras** et passe quinze ans dans ses châteaux à soigner sa légende et à écrire ses *Mémoires*. La révolution de **Juillet 1830** le remet en selle : à soixante-seize ans, il devient ambassadeur de **Louis-Philippe** à Londres et négocie, de 1830 à 1834, l’indépendance de la **Belgique** et sa neutralité — sa dernière réussite, et l’une des plus durables, puisqu’elle tiendra jusqu’en 1914. Il meurt le **17 mai 1838**, après avoir signé le matin même une rétractation de ses actes contre l’Église, que Rome accepte. Cinq régimes, cinq serments, une seule constante : il n’a jamais servi un pouvoir au-delà du jour où celui-ci cessait de tenir.',
      },
    ],
    chrono: [
      { date: '1754', fait: 'Naissance à Paris ; un pied infirme le destine à l’Église.' },
      { date: '1788', fait: 'Évêque d’Autun.' },
      { date: '10 octobre 1789', fait: 'Il propose de nationaliser les biens du clergé.' },
      { date: '1797', fait: 'Ministre des Relations extérieures du Directoire.' },
      { date: '9 novembre 1799', fait: 'Il aide Bonaparte au coup d’État du 18 brumaire.' },
      { date: '1806', fait: 'Fait prince de Bénévent.' },
      { date: '28 janvier 1809', fait: 'Scène des Tuileries : Napoléon l’accable d’injures.' },
      { date: '31 mars 1814', fait: 'Il reçoit le tsar chez lui et fait déposer l’Empereur.' },
      { date: '1814 – 1815', fait: 'Congrès de Vienne : la France garde ses frontières de 1792.' },
      { date: '1830 – 1834', fait: 'Ambassadeur de Louis-Philippe à Londres.' },
      { date: '17 mai 1838', fait: 'Mort à Paris, après avoir signé sa rétractation.' },
    ],
    leSaisTu:
      'Partant pour Vienne, Talleyrand aurait réclamé à Louis XVIII « plus de casseroles que d’instructions écrites » : il emmenait son cuisinier, Antonin Carême, le premier grand chef de l’histoire moderne. Pendant neuf mois, les souverains d’Europe dînèrent chez le représentant du pays vaincu — et une partie du congrès se décida à sa table.',
    aRetenir: [
      'Talleyrand, évêque d’Autun en 1788, propose en 1789 de mettre les biens du clergé à la disposition de la Nation.',
      'Il est ministre des Relations extérieures sous le Directoire, le Consulat et l’Empire.',
      'Il rompt avec Napoléon à partir de 1808 et organise le retour de Louis XVIII en 1814.',
      'Au congrès de Vienne (1814-1815), il fait admettre la France vaincue parmi les grandes puissances au nom de la « légitimité ».',
      'Il sert cinq régimes en cinquante ans et meurt ambassadeur de Louis-Philippe, en 1838.',
    ],
    mots: [
      {
        mot: 'Légitimité',
        sens: 'Principe défendu à Vienne : un souverain règne par un droit ancien et hérité, jamais par la seule conquête.',
      },
      {
        mot: 'Congrès',
        sens: 'Réunion des représentants de plusieurs États pour régler ensemble une paix générale.',
      },
    ],
    lies: ['napoleon-bonaparte', 'fouche', 'congres-de-vienne', 'pie-vii', 'louis-xviii'],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Autun',
      'diplomate',
      'congrès de Vienne',
      'Bénévent',
      'légitimité',
      'Louis XVIII',
      'Directoire',
      'Périgord',
      'diable boiteux',
      'Restauration',
    ],
  },
  {
    id: 'madame-de-stael',
    volet: 'personnages',
    nom: 'Madame de Staël',
    surnom: 'l’exilée de Coppet',
    dates: '1766 – 1817',
    tri: 1817,
    periode: 'revolution',
    emoji: '📖',
    roles: ['Femme de lettres', 'Salonnière', 'Opposante à Napoléon'],
    origine: 'Paris, fille du banquier Necker',
    accroche:
      'Napoléon la chassa de Paris parce qu’elle pensait tout haut : de son exil, elle fit entrer le romantisme allemand en France.',
    citations: [
      {
        texte: 'La gloire est le deuil éclatant du bonheur.',
        contexte: 'Dans son roman *Corinne ou l’Italie*, publié en 1807.',
        sens:
          'On ne devient célèbre qu’en perdant la vie tranquille : la gloire est un habit de deuil, mais un habit qui brille.',
      },
      {
        texte: 'Tout comprendre rend très indulgent.',
        contexte: '*Corinne ou l’Italie*, 1807. La formule est passée en proverbe sous une autre forme.',
        sens:
          'On la cite aujourd’hui « tout comprendre, c’est tout pardonner » — une version qu’elle n’a jamais écrite.',
      },
      {
        texte: 'En France, on étudie les hommes ; en Allemagne, les livres.',
        contexte: '*De l’Allemagne*, achevé en 1810, détruit par la censure et publié à Londres en 1813.',
      },
      {
        texte:
          'Cette femme apprend à penser à des gens qui n’y avaient jamais songé, ou qui l’avaient oublié.',
        qui: 'Napoléon',
        contexte: 'Propos rapporté : l’Empereur expliquait ainsi pourquoi il tenait à l’éloigner de Paris.',
      },
    ],
    reperes: [
      'Fille de Jacques Necker, ministre des Finances de Louis XVI, et de Suzanne Curchod.',
      'Son salon de la rue du Bac est l’un des lieux où se fait la politique sous le Directoire.',
      'Bonaparte l’exile en 1803 : interdiction d’approcher Paris à moins de quarante lieues.',
      'Son château de Coppet, en Suisse, devient la capitale de l’opposition européenne.',
      'Les dix mille exemplaires de *De l’Allemagne* sont mis au pilon par la police en 1810.',
      'Rentrée à Paris en 1814, elle meurt le 14 juillet 1817, à cinquante et un ans.',
    ],
    recit: [
      {
        titre: 'La fille du ministre',
        texte:
          '**Germaine Necker** naît à Paris en 1766, fille unique du banquier genevois **Jacques Necker**, que Louis XVI appellera aux Finances, et de Suzanne Curchod. Elle grandit dans le salon de sa mère, entre **Buffon**, **Diderot** et Grimm, à écouter discuter des hommes de cinquante ans ; à quinze ans, elle rédige des commentaires de *L’Esprit des lois*. Mariée en 1786 au baron de **Staël-Holstein**, ambassadeur de Suède, elle obtient du mariage exactement ce qu’elle en attendait : un nom, une ambassade et la liberté d’ouvrir son propre salon. En 1789, elle assiste à l’ouverture des **États généraux** et défend une monarchie constitutionnelle à l’anglaise. Pendant les **massacres de Septembre** 1792, elle use de son immunité diplomatique pour faire sortir de Paris plusieurs amis condamnés, puis gagne à son tour la Suisse.',
      },
      {
        titre: 'La femme qui pense tout haut',
        texte:
          'Rentrée sous le **Directoire**, elle tient rue du Bac le salon où se font et se défont les carrières. **Benjamin Constant**, rencontré en 1794, sera pendant quinze ans son compagnon et son égal en idées. Elle publie *De la littérature* (1800), qui soutient une thèse neuve : une littérature dépend de la société, des mœurs et des lois qui la portent — donc la liberté produit d’autres livres que le despotisme. Elle avait d’abord vu en **Bonaparte** l’homme qui allait clore la Révolution sans fermer la liberté ; elle comprend vite qu’il veut tout le pouvoir, et elle le dit. Lui la trouve insupportable pour une raison simple : chez elle, on discute ses décisions. En 1803, son roman *Delphine* achève de le décider. Elle reçoit l’ordre de ne pas approcher Paris à moins de **quarante lieues** — environ cent soixante kilomètres.',
      },
      {
        titre: 'L’exil, et l’Allemagne',
        texte:
          'L’exil la jette sur les routes d’Europe, et c’est ce qui fait d’elle un écrivain européen. À **Weimar**, elle interroge **Goethe** et **Schiller** ; à Berlin, elle engage **August Schlegel** comme précepteur de ses enfants et l’emmène avec elle. L’Italie lui donne *Corinne ou l’Italie* (1807), succès immense : l’héroïne y est une femme de génie que la société finit par broyer. Puis vient *De l’Allemagne* (1810), le livre qui révèle aux Français une littérature qu’ils ignoraient et, avec elle, le mot **romantisme**. Le ministre de la Police **Savary** fait saisir les dix mille exemplaires de la première édition et les envoie au **pilon**, avec cette phrase : « Votre ouvrage n’est point français. » En 1812, surveillée jusque chez elle, elle s’enfuit par Vienne, la Russie — qu’elle traverse quelques semaines avant la Grande Armée —, Saint-Pétersbourg et la Suède, et gagne **Londres**, où le livre paraît enfin en 1813.',
      },
      {
        titre: 'Coppet, et ce qui reste',
        texte:
          '**Coppet**, son château au bord du Léman, est devenu pendant dix ans la capitale d’une Europe qui ne se résigne pas : Constant, l’historien **Sismondi**, Schlegel, plus tard **Byron** y passent et y discutent. Elle y défend trois causes : le régime représentatif contre le pouvoir d’un seul, la liberté de la presse, et l’**abolition de la traite des Noirs**, qu’elle réclame publiquement en 1814. Rentrée à Paris à la chute de l’Empire, elle rouvre son salon, refuse les Cent-Jours et combat les **ultras** de la Restauration. Elle meurt le **14 juillet 1817**. Son grand livre paraît l’année suivante : les *Considérations sur les principaux événements de la Révolution française*, où elle soutient que la Révolution n’a été ni un accident ni un crime, mais l’aboutissement d’un siècle — et que la liberté, une fois perdue, se reprend. C’est l’acte de naissance du libéralisme français.',
      },
    ],
    chrono: [
      { date: '1766', fait: 'Naissance à Paris, fille de Jacques Necker.' },
      { date: '1786', fait: 'Mariage avec le baron de Staël-Holstein, ambassadeur de Suède.' },
      { date: '1789', fait: 'Son salon soutient la monarchie constitutionnelle.' },
      { date: '1800', fait: 'Publication de son essai De la littérature.' },
      { date: '1803', fait: 'Bonaparte l’exile à quarante lieues de Paris.' },
      { date: '1807', fait: 'Succès européen du roman Corinne ou l’Italie.' },
      { date: '1810', fait: 'La police impériale met De l’Allemagne au pilon.' },
      { date: '1812', fait: 'Fuite par Vienne, Moscou, Saint-Pétersbourg et Londres.' },
      { date: '1814', fait: 'Retour à Paris à la chute de l’Empire.' },
      { date: '14 juillet 1817', fait: 'Mort à Paris, à 51 ans.' },
    ],
    leSaisTu:
      'À un bal du Directoire, Madame de Staël demanda à Bonaparte quelle était, selon lui, la première des femmes. « Celle qui fait le plus d’enfants, madame », répondit-il. Le mot fit le tour de Paris en une soirée. Ils ne se sont plus jamais entendus, et dix ans plus tard il lui interdisait la ville.',
    aRetenir: [
      'Germaine de Staël, fille du ministre Necker, tient l’un des grands salons politiques de la Révolution.',
      'Bonaparte l’exile de Paris en 1803 : elle s’installe à Coppet, en Suisse.',
      'Son livre De l’Allemagne, imprimé en 1810, est détruit par la police impériale et paraît à Londres en 1813.',
      'Elle fait connaître en France le romantisme allemand et défend la liberté politique à l’anglaise.',
      'Elle meurt le 14 juillet 1817 ; ses Considérations sur la Révolution française paraissent en 1818.',
    ],
    mots: [
      {
        mot: 'Romantisme',
        sens: 'Courant né en Allemagne, qui préfère le sentiment, l’histoire et la nature aux règles du classicisme.',
      },
      {
        mot: 'Pilon',
        sens: 'Machine qui broie les livres ; « mettre au pilon », c’est détruire une édition entière.',
      },
      {
        mot: 'Salon',
        sens: 'Réunion régulière, chez une femme du monde, où l’on parle littérature et politique.',
      },
    ],
    lies: ['napoleon-bonaparte', 'necker', 'talleyrand', 'josephine-de-beauharnais'],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Staël',
      'Coppet',
      'Necker',
      'De l’Allemagne',
      'Corinne',
      'exil',
      'romantisme',
      'salon',
      'Benjamin Constant',
      'censure',
    ],
  },
  {
    id: 'fouche',
    volet: 'personnages',
    nom: 'Joseph Fouché',
    surnom: 'le ministre de tous les régimes',
    dates: '1759 – 1820',
    tri: 1820,
    periode: 'revolution',
    emoji: '🕵️',
    roles: ['Ministre de la Police', 'Conventionnel régicide', 'Duc d’Otrante'],
    origine: 'Le Pellerin, près de Nantes',
    accroche:
      'Professeur chez les oratoriens, mitrailleur de Lyon, puis maître de la police impériale : il a survécu à tout en sachant tout.',
    citations: [
      {
        texte: 'La mort n’est qu’un sommeil éternel.',
        contexte:
          'Arrêté pris dans la Nièvre en octobre 1793 : il fait graver la formule à l’entrée des cimetières.',
        sens:
          'Le représentant en mission veut effacer la religion de la vie publique ; l’inscription remplace la promesse chrétienne d’une vie après la mort.',
      },
      {
        texte: 'La terreur, salutaire terreur, est maintenant ici à l’ordre du jour.',
        contexte: 'Lettre à la Convention envoyée de Lyon, à l’automne 1793.',
        sens: 'Il ne subit pas la Terreur, il la revendique par écrit et en réclame le mérite.',
      },
      {
        texte: 'C’est plus qu’un crime, c’est une faute.',
        contexte: 'Sur l’exécution du duc d’Enghien, enlevé et fusillé sur ordre de Bonaparte en mars 1804.',
        sens:
          'Le mot est attribué tantôt à Fouché, tantôt à Talleyrand, tantôt à Boulay de la Meurthe : personne ne sait qui l’a dit le premier.',
        incertaine: true,
      },
      {
        texte:
          'Entre silencieusement le vice appuyé sur le bras du crime, M. de Talleyrand marchant soutenu par M. Fouché.',
        qui: 'Chateaubriand',
        contexte:
          '*Mémoires d’outre-tombe* : les deux hommes viennent se mettre au service de Louis XVIII, en juillet 1815.',
      },
    ],
    reperes: [
      'Professeur de mathématiques chez les oratoriens, en habit religieux, sans être ordonné prêtre.',
      'Député à la Convention, il vote la mort de Louis XVI en janvier 1793.',
      'Représentant en mission à Lyon, il organise la répression de la ville révoltée, fin 1793.',
      'Ministre de la Police de 1799 à 1810 ; fait duc d’Otrante en 1809.',
      'Il négocie en secret avec les Anglais dans le dos de Napoléon, ce qui lui coûte son poste.',
      'Banni comme régicide en 1816, il meurt à Trieste en 1820.',
    ],
    recit: [
      {
        titre: 'L’oratorien qui vota la mort du roi',
        texte:
          '**Joseph Fouché** naît en 1759 au Pellerin, près de Nantes, dans une famille de capitaines au long cours. De santé trop fragile pour la mer, il entre chez les **oratoriens**, où il enseigne les mathématiques et la physique pendant dix ans — en portant l’habit, mais sans être jamais ordonné prêtre. La Révolution le sort du collège : en 1792, il est élu à la **Convention** comme député de la Loire-Inférieure. Il siège d’abord avec les modérés, puis vote la mort de **Louis XVI** « sans sursis ni appel ». Envoyé en mission dans la **Nièvre** en 1793, il y mène une déchristianisation méthodique : églises fermées, argenterie fondue, prêtres poussés au mariage, et cet arrêté qui fait scandale jusqu’à Paris, la formule « La mort n’est qu’un sommeil éternel » gravée aux portes des cimetières. Il y organise aussi, la même année, l’un des premiers secours publics aux vieillards et aux indigents.',
      },
      {
        titre: 'Lyon',
        texte:
          '**Lyon** s’est soulevée contre la Convention ; la ville tombe en octobre 1793 et la Convention décrète qu’elle sera détruite. Fouché y est envoyé avec **Collot d’Herbois**. La guillotine leur paraît trop lente : en décembre, sur la plaine des **Brotteaux**, des condamnés sont alignés et fusillés au canon chargé à mitraille — ce sont les « **mitraillades** ». La répression lyonnaise fait, en quelques mois, près de mille neuf cents exécutions. Fouché écrit à la Convention des lettres où il revendique la **Terreur** comme un devoir. **Robespierre**, qui lui reproche à la fois cette violence et son athéisme militant, le fait rappeler et exclure des Jacobins en juillet 1794 : Fouché est alors un homme condamné à quelques jours près. Il passe ces jours-là à compter les députés menacés comme lui et à les rassembler. Le **9 thermidor** (27 juillet 1794), Robespierre tombe. Fouché a survécu ; il ne fera plus jamais autre chose.',
      },
      {
        titre: 'Le maître de la police',
        texte:
          'Nommé ministre de la **Police générale** en 1799, il aide Bonaparte au 18 brumaire et reste en place, avec une interruption, jusqu’en **1810**. Il invente un métier : des dossiers sur tout le monde, un réseau d’informateurs payés dans les salons, les théâtres, les auberges et jusque dans les ministères, un « **cabinet noir** » qui ouvre le courrier avant de le refermer, et un bulletin quotidien remis à l’Empereur. Il connaît les dettes des maréchaux, les amants des dames de la cour, les propos tenus la veille chez tel banquier. Napoléon le craint, s’en sert et le paie : **duc d’Otrante** en 1809, une fortune immense. La même année, Fouché va trop loin. Il lève des troupes de sa propre autorité contre le débarquement anglais de **Walcheren**, puis engage des pourparlers secrets avec Londres. L’Empereur le renvoie en juin 1810.',
      },
      {
        titre: 'Deux fois ministre du retour',
        texte:
          'Les **Cent-Jours** le ramènent : Napoléon, revenu de l’île d’Elbe, reprend comme ministre de la Police l’homme qui, dans le même temps, correspond avec **Metternich**, avec **Wellington** et avec les Bourbons. Après **Waterloo**, c’est Fouché qui préside le gouvernement provisoire, obtient la seconde abdication, livre Paris aux Alliés et rappelle **Louis XVIII**. Le 7 juillet 1815, il entre chez le roi au bras de **Talleyrand** : le régicide et l’évêque, ministres du frère de Louis XVI. Il le restera trois mois. La loi de janvier **1816** bannit les régicides qui ont servi les Cent-Jours ; il est le premier visé. Ambassadeur à Dresde, puis proscrit, il erre en Allemagne et en Autriche, se fait naturaliser autrichien, et meurt à **Trieste** le 26 décembre 1820, laissant quatorze millions de francs et une réputation dont aucun régime n’a voulu.',
      },
    ],
    chrono: [
      { date: '1759', fait: 'Naissance au Pellerin, près de Nantes.' },
      { date: '1792', fait: 'Élu à la Convention comme député de la Loire-Inférieure.' },
      { date: 'janvier 1793', fait: 'Il vote la mort de Louis XVI.' },
      { date: '1793', fait: 'Représentant en mission dans la Nièvre, puis à Lyon.' },
      { date: '27 juillet 1794', fait: 'Il participe à la chute de Robespierre, le 9 thermidor.' },
      { date: '1799', fait: 'Ministre de la Police générale.' },
      { date: '1809', fait: 'Fait duc d’Otrante.' },
      { date: 'juin 1810', fait: 'Renvoyé pour avoir négocié seul avec l’Angleterre.' },
      { date: '1815', fait: 'Ministre de la Police des Cent-Jours, puis de Louis XVIII.' },
      { date: '1816', fait: 'Banni de France comme régicide.' },
      { date: '26 décembre 1820', fait: 'Mort à Trieste.' },
    ],
    leSaisTu:
      'Quand Napoléon le renvoie, en juin 1810, il exige la remise de ses archives. Fouché en brûle une partie avant de céder son bureau à Savary : il y avait là les dossiers de la cour, des maréchaux et de la famille impériale. Personne n’a jamais su ce qui avait disparu dans la cheminée du ministère de la Police.',
    aRetenir: [
      'Fouché, élu à la Convention en 1792, vote la mort de Louis XVI en janvier 1793.',
      'Représentant en mission, il organise à Lyon la répression de la ville révoltée, fin 1793.',
      'Ministre de la Police de 1799 à 1810, il bâtit le premier grand système de surveillance moderne.',
      'Fait duc d’Otrante en 1809, il est renvoyé en 1810 pour avoir négocié seul avec l’Angleterre.',
      'Il sert encore les Cent-Jours puis Louis XVIII, et meurt banni à Trieste en 1820.',
    ],
    mots: [
      {
        mot: 'Régicide',
        sens: 'Député de la Convention ayant voté la mort de Louis XVI ; la Restauration les bannit en 1816.',
      },
      {
        mot: 'Représentant en mission',
        sens: 'Député envoyé par la Convention en province ou aux armées, avec des pouvoirs presque illimités.',
      },
      {
        mot: 'Cabinet noir',
        sens: 'Bureau où l’on ouvrait secrètement le courrier des particuliers avant de le refermer.',
      },
    ],
    lies: ['napoleon-bonaparte', 'talleyrand', 'robespierre', 'la-terreur', 'execution-de-louis-xvi'],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire',
    tags: [
      'Fouché',
      'police',
      'Otrante',
      'Lyon',
      'Convention',
      'régicide',
      'Nièvre',
      'Cent-Jours',
      'mitraillades',
      'Trieste',
    ],
  },
  {
    id: 'napoleon-bonaparte',
    volet: 'personnages',
    nom: 'Napoléon Bonaparte',
    surnom: 'l’Empereur',
    dates: '1769 – 1821',
    tri: 1821,
    periode: 'revolution',
    emoji: '🦅',
    roles: ['Empereur des Français', 'Général', 'Premier consul', 'Législateur'],
    origine: 'Ajaccio, Corse',
    accroche:
      'Général à vingt-quatre ans, maître de l’Europe à trente-cinq, mort prisonnier sur un rocher : il a refondé la France et il l’a saignée.',
    citations: [
      {
        texte: 'Soldats, songez que, du haut de ces pyramides, quarante siècles vous contemplent.',
        contexte: 'À l’armée d’Égypte, avant la bataille des Pyramides, le 21 juillet 1798.',
        sens:
          'Il ne promet ni butin ni gloire : il dit à des paysans français qu’ils entrent dans l’histoire la plus ancienne du monde.',
      },
      {
        texte:
          'Ma gloire n’est pas d’avoir gagné quarante batailles ; Waterloo effacera le souvenir de tant de victoires. Ce que rien n’effacera, ce qui vivra éternellement, c’est mon Code civil.',
        contexte: 'À Sainte-Hélène, rapporté par Las Cases dans le *Mémorial*.',
        sens:
          'Le jugement qu’il porte lui-même sur son œuvre : les batailles s’annulent, les lois restent. Deux siècles plus tard, le Code est toujours en vigueur.',
      },
      {
        texte: 'Du sublime au ridicule il n’y a qu’un pas.',
        contexte: 'À l’ambassadeur de Pradt, à Varsovie, le 10 décembre 1812, au retour de Russie.',
        sens:
          'Il vient de perdre une armée de six cent mille hommes dans la neige : la plus grande entreprise du siècle finit en déroute.',
      },
      {
        texte: 'Impossible n’est pas français.',
        contexte: 'Formule tirée d’une lettre au général Lemarois, le 9 juillet 1813.',
        sens:
          'Il avait écrit exactement : « Ce n’est pas possible, m’écrivez-vous : cela n’est pas français. » La devise que l’on répète est un raccourci du XIXᵉ siècle.',
        incertaine: true,
      },
      {
        texte:
          'Soldats, vous êtes nus, mal nourris ; le gouvernement vous doit beaucoup, il ne peut rien vous donner. Je veux vous conduire dans les plus fertiles plaines du monde.',
        contexte: 'Proclamation à l’armée d’Italie, le 27 mars 1796. Il a vingt-six ans.',
      },
    ],
    reperes: [
      'Né à Ajaccio en 1769, un an après le rattachement de la Corse à la France.',
      'Général de brigade à vingt-quatre ans après la prise de Toulon, en décembre 1793.',
      'Le coup d’État du 18 brumaire an VIII (9 novembre 1799) lui donne le pouvoir.',
      'Empereur des Français le 2 décembre 1804 ; il se couronne lui-même à Notre-Dame.',
      'Code civil, préfets, lycées, Banque de France, Légion d’honneur, franc germinal : l’administration française date de lui.',
      'Abdique en 1814, revient cent jours, perd Waterloo le 18 juin 1815, meurt à Sainte-Hélène en 1821.',
    ],
    recit: [
      {
        titre: 'Toulon, l’Italie, l’Égypte',
        texte:
          '**Napoleone Buonaparte** naît à **Ajaccio** le 15 août 1769, un an après le rattachement de la **Corse** à la France, dans une famille de petite noblesse. Boursier du roi à Brienne puis à l’École militaire de Paris, il est **lieutenant d’artillerie à seize ans**. La Révolution lui ouvre ce que l’Ancien Régime lui fermait. En décembre **1793**, devant **Toulon** livrée aux Anglais, le capitaine de vingt-quatre ans qu’il est comprend que toute la rade dépend d’un promontoire, le fort de l’Éguillette : on le lui laisse prendre, la flotte anglaise doit partir, il est fait **général de brigade** dans la foulée. Le 5 octobre 1795, il balaie au canon l’insurrection royaliste devant l’église Saint-Roch : la République lui doit deux fois la vie. Elle lui confie l’**armée d’Italie**, la plus mal équipée de toutes. En un an, il bat les Piémontais puis quatre armées autrichiennes — **Lodi**, **Arcole**, **Rivoli** —, fait vivre ses troupes sur le pays, envoie l’or et les tableaux à Paris, et signe lui-même le traité de **Campoformio** : un général qui fait la politique étrangère de la France. Envoyé en **Égypte** en 1798 pour couper aux Anglais la route des Indes, il gagne les batailles et perd la campagne : **Nelson** détruit sa flotte à Aboukir et l’enferme dans sa conquête. En août 1799, il abandonne son armée et rentre.',
      },
      {
        titre: 'Le 18 brumaire',
        texte:
          'La France de 1799 est à bout. Le **Directoire** a fait faillite, le papier-monnaie ne vaut rien, les routes sont aux brigands, la guerre a repris sur trois fronts et deux coups d’État ont déjà tordu la Constitution. Une partie des dirigeants cherche un général pour la « réviser » de force : **Sieyès** a le projet, il lui faut une épée. Bonaparte rentre d’Égypte auréolé d’un prestige que les mauvaises nouvelles n’ont pas encore atteint. Les **18 et 19 brumaire an VIII** (9 et 10 novembre 1799), les Conseils sont transférés à **Saint-Cloud** sous prétexte d’un complot. Le second jour, Bonaparte affronte les Cinq-Cents, se fait huer, manque tout perdre — et c’est son frère **Lucien**, qui préside la séance, qui fait entrer les grenadiers et vider la salle. Le soir même, trois consuls provisoires remplacent le Directoire. La **Constitution de l’an VIII**, rédigée en six semaines, ne contient aucune déclaration de droits et donne l’essentiel au **Premier consul**. Soumise au peuple, elle est approuvée par trois millions de oui. La Révolution est close ; il dira l’avoir « fixée sur les principes qui l’ont commencée ».',
      },
      {
        titre: 'Ce qu’il fonde et qui tient encore',
        texte:
          'Les quatre années du **Consulat** sont les plus fécondes de sa vie, et ce sont celles qu’on raconte le moins. Le **Code civil**, promulgué le **21 mars 1804** et discuté sous sa présidence en une centaine de séances, rassemble en 2 281 articles le droit des personnes, de la famille et de la propriété : il consacre l’**égalité devant la loi**, la fin des privilèges, l’état civil laïque, la liberté de contracter — et il maintient l’autorité du mari sur la femme. Il est toujours en vigueur, et il a été copié dans la moitié de l’Europe. La loi du **28 pluviôse an VIII** (17 février 1800) installe un **préfet** par département, nommé par le gouvernement : la carte administrative de la France est celle-là. Suivent la **Banque de France** (1800), le **franc germinal** (1803), qui gardera la même valeur en or jusqu’en 1914, la **Légion d’honneur** (1802), les **lycées** (1802) puis le **baccalauréat** (1808), le **Concordat** de 1801 signé avec **Pie VII**, la Cour des comptes et le cadastre. Le même pouvoir, par la loi du **20 mai 1802**, **rétablit l’esclavage** dans les colonies, huit ans après l’abolition votée par la Convention : Saint-Domingue se soulève, **Toussaint Louverture** meurt en 1803 dans un cachot du Jura, la Guadeloupe est reprise par les armes. On ne peut pas citer l’un sans l’autre : ce sont les deux faces de la même année.',
      },
      {
        titre: 'Le sacre, Austerlitz, et l’Europe fermée',
        texte:
          'Le **2 décembre 1804**, à **Notre-Dame**, devant **Pie VII** venu de Rome, il pose lui-même la couronne sur sa tête : l’Empire est héréditaire, la République est morte. Un an jour pour jour plus tard, à **Austerlitz** (2 décembre 1805), il détruit les armées russe et autrichienne réunies dans la manœuvre la plus étudiée de l’histoire militaire. **Iéna** et **Auerstedt** écrasent la Prusse en 1806 ; **Friedland** ramène le tsar à la table de **Tilsit** en 1807. Le **Saint-Empire romain germanique**, vieux de mille ans, est dissous. Ses frères deviennent rois — **Joseph** à Naples puis en Espagne, **Louis** en Hollande, **Jérôme** en Westphalie —, ses maréchaux princes, et l’Europe se couvre de codes civils, de préfets et de lycées. Reste l’Angleterre, invaincue sur mer depuis **Trafalgar** (1805). Ne pouvant l’envahir, il décide de l’étouffer : le décret de Berlin du **21 novembre 1806** ferme le continent à son commerce. C’est le **Blocus continental**, et c’est le piège. Pour fermer les côtes, il faut les occuper ; pour les occuper, il faut prendre le Portugal, l’Espagne, la Hollande, les villes de la Baltique — et se brouiller avec la Russie, qui vit de ses ventes à Londres. Les ports français, eux, meurent : Nantes, Bordeaux et Marseille perdent l’essentiel de leur trafic.',
      },
      {
        titre: 'L’Espagne, la Russie, la chute',
        texte:
          'En 1808, il fait abdiquer les Bourbons d’Espagne et met son frère **Joseph** sur le trône. Madrid se soulève le **2 mai** ; la répression du lendemain donnera à **Goya** ses deux tableaux les plus noirs. Commence une guerre sans lignes ni batailles décisives, la **guérilla** : six ans, trois cent mille hommes immobilisés, un « ulcère espagnol » dont l’Empire ne guérira pas. En juin **1812**, il passe le **Niémen** avec la **Grande Armée** — six cent mille hommes, dont la moitié ne sont pas français. Les Russes reculent et brûlent tout derrière eux. À la **Moskova** (7 septembre), soixante-dix mille hommes tombent en une journée pour une victoire qui ne décide rien. Moscou est atteinte, vide, et brûle. Il y attend cinq semaines une paix qui ne vient pas, repart le 19 octobre, trop tard : le gel, la faim, les cosaques, puis la **Bérézina** (26-29 novembre). Moins de cinquante mille hommes repassent le fleuve. L’Europe se retourne ; à **Leipzig**, en octobre 1813, la « bataille des Nations » chasse les Français d’Allemagne. Pendant la **campagne de France** (1814), avec soixante mille conscrits de dix-huit ans — les « Marie-Louise » — contre trois cent mille alliés, il livre sa campagne la plus brillante et la perd quand même. Paris capitule le 31 mars, le Sénat le déchoit, il **abdique à Fontainebleau le 6 avril 1814** et part pour l’**île d’Elbe**.',
      },
      {
        titre: 'Waterloo, Sainte-Hélène, et l’addition',
        texte:
          'Il revient. Débarqué au golfe Juan le **1er mars 1815**, il remonte sur Paris sans tirer un coup de feu : les soldats envoyés l’arrêter passent de son côté. Ce sont les **Cent-Jours**. Il promulgue un **Acte additionnel** libéral, rétablit la liberté de la presse, abolit la traite des Noirs. L’Europe, elle, ne négocie pas : elle l’a mis hors la loi. Le **18 juin 1815**, à **Waterloo**, devant **Wellington** rejoint le soir par les Prussiens de Blücher, tout se joue en une journée. Il abdique le 22 juin, se rend aux Anglais et part pour **Sainte-Hélène**, un rocher de l’Atlantique sud à deux mille kilomètres de toute côte. Il y dicte pendant six ans le récit de sa vie — le *Mémorial* de **Las Cases**, publié en 1823, fondera la légende — et meurt le **5 mai 1821**, à cinquante et un ans. L’addition est lourde : environ **un million de morts français** en quinze ans de guerre, deux millions d’Européens, la **conscription** qui a pris les hommes par classes d’âge entières, l’esclavage rétabli en 1802, et une presse réduite à quatre journaux dans Paris en 1811, tous surveillés. L’héritage tient debout à côté : le Code, les préfets, les lycées, le franc, la Banque, l’égalité devant la loi. Les deux sont de lui.',
      },
    ],
    chrono: [
      { date: '15 août 1769', fait: 'Naissance à Ajaccio, en Corse.' },
      { date: 'décembre 1793', fait: 'Siège de Toulon : général de brigade à 24 ans.' },
      { date: '1796 – 1797', fait: 'Campagne d’Italie ; traité de Campoformio.' },
      { date: '9 novembre 1799', fait: 'Coup d’État du 18 brumaire : il devient Premier consul.' },
      { date: '21 mars 1804', fait: 'Promulgation du Code civil.' },
      { date: '2 décembre 1804', fait: 'Sacre à Notre-Dame : il se couronne empereur.' },
      { date: '2 décembre 1805', fait: 'Victoire d’Austerlitz.' },
      { date: '1812', fait: 'Campagne de Russie : la Grande Armée est détruite.' },
      { date: '6 avril 1814', fait: 'Abdication à Fontainebleau ; exil à l’île d’Elbe.' },
      { date: '18 juin 1815', fait: 'Défaite de Waterloo.' },
      { date: '15 juillet 1815', fait: 'Il se rend aux Anglais ; départ pour Sainte-Hélène.' },
      { date: '5 mai 1821', fait: 'Mort à Sainte-Hélène, à 51 ans.' },
    ],
    leSaisTu:
      'Il emmena en Égypte cent soixante-sept savants, avec leurs instruments et une imprimerie. En juillet 1799, en creusant un fort près de Rosette, des soldats mirent au jour une pierre noire gravée en trois écritures. C’est elle qui permit à Champollion, en 1822, de déchiffrer les hiéroglyphes : de toute l’expédition d’Égypte, c’est ce qu’il en reste de plus durable.',
    aRetenir: [
      'Napoléon Bonaparte prend le pouvoir par le coup d’État du 18 brumaire an VIII (9 novembre 1799) et devient Premier consul.',
      'Le Consulat fonde le Code civil (1804), les préfets, les lycées, la Banque de France, la Légion d’honneur et le franc germinal.',
      'Empereur le 2 décembre 1804, il domine l’Europe après Austerlitz (1805) et impose le Blocus continental en 1806.',
      'La guerre d’Espagne (1808) et la campagne de Russie (1812) brisent l’Empire ; il abdique le 6 avril 1814.',
      'Revenu pour les Cent-Jours, il est battu à Waterloo le 18 juin 1815 et meurt à Sainte-Hélène le 5 mai 1821.',
      'Les guerres de l’Empire coûtent environ un million de morts français ; la loi du 20 mai 1802 rétablit l’esclavage dans les colonies.',
    ],
    mots: [
      {
        mot: 'Consulat',
        sens: 'Régime de 1799 à 1804 : trois consuls, mais tout le pouvoir réel au premier d’entre eux.',
      },
      {
        mot: 'Code civil',
        sens: 'Recueil de 2 281 articles fixant le droit des personnes, de la famille et de la propriété ; toujours en vigueur.',
      },
      {
        mot: 'Blocus continental',
        sens: 'Interdiction faite à l’Europe, à partir de 1806, de commercer avec l’Angleterre.',
      },
      {
        mot: 'Conscription',
        sens: 'Service militaire obligatoire par tirage au sort, instauré par la loi Jourdan de 1798.',
      },
    ],
    lies: [
      'josephine-de-beauharnais',
      'talleyrand',
      'pie-vii',
      'code-civil',
      'bataille-de-waterloo',
      'madame-de-stael',
    ],
    niveaux: ['4e', '1re'],
    programme: 'La Révolution française et l’Empire : une nouvelle conception de la nation',
    tags: [
      'Bonaparte',
      'Empereur',
      'Austerlitz',
      'Waterloo',
      'Code civil',
      'Sainte-Hélène',
      'brumaire',
      'Grande Armée',
      'Ajaccio',
      'Consulat',
      'Blocus continental',
      'sacre',
    ],
  },
]
