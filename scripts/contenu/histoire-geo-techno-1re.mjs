// Histoire-géographie — Première TECHNOLOGIQUE : le programme de la voie techno.
//
// POURQUOI UNE MATIÈRE À PART. Le programme de la voie technologique n'est pas
// celui de la voie générale allégé à la marge : il a SON découpage. Chaque
// thème porte UNE question obligatoire (A) et DEUX sujets d'étude (B), dont le
// professeur choisit un seul. Un élève de STMG, STI2D, ST2S ou STL ne sait pas
// lequel son professeur a retenu : on écrit donc les deux.
//
// LE DÉCOUPAGE (programme de l'arrêté du 17 janvier 2019, BO spécial n° 1 du
// 22 janvier 2019, annexe « première technologique ») :
//   HISTOIRE — « Construire une nation démocratique dans l'Europe des monarchies
//   et des empires : la France de 1789 aux lendemains de la Première Guerre
//   mondiale » : 4 thèmes × (A + 2 B) = 12 fiches.
//   GÉOGRAPHIE — « Les dynamiques d'un monde en recomposition » : 3 thèmes ×
//   (A + 2 B) + le thème 4 conclusif sur la Chine = 10 fiches.
// Chaque fiche est un chapitre en base ; `axe` (chapters.theme) porte le THÈME
// du programme, `rayon` (chapters.discipline) l'onglet histoire / géographie.
//
// Le niveau est '1re' : l'app range la « 1re techno » sur le contenu de 1re
// (contentLevelFor, lib/grades.ts), et la matière `histoire-geo-techno` n'est
// déclarée que pour les classes technologiques.

const H = 'histoire'
const G = 'geographie'

const T1 = 'L’Europe bouleversée par la Révolution française (1789-1815)'
const T2 = 'Les transformations politiques et sociales de la France de 1848 à 1870'
const T3 = 'La Troisième République : un régime, un empire colonial'
const T4 = 'La Première Guerre mondiale et la fin des empires européens'
const G1 = 'La métropolisation : un processus mondial différencié'
const G2 = 'Une diversification des espaces et des acteurs de la production'
const G3 = 'Les espaces ruraux : une multifonctionnalité toujours plus marquée'
const G4 = 'La Chine : des recompositions spatiales multiples'

export default {
  slug: 'histoire-geo-techno',
  nom: 'Histoire-géographie',

  titreMigration: 'HISTOIRE-GÉOGRAPHIE 1re TECHNOLOGIQUE — le programme (22 fiches)',

  motif: `La voie technologique a son propre programme d'histoire-géographie
(BO spécial n° 1 du 22 janvier 2019) : quatre thèmes d'histoire et quatre de
géographie, chacun organisé en une question obligatoire et deux sujets d'étude
au choix du professeur. Cette migration installe les 22 fiches de la 1re
technologique (12 d'histoire, 10 de géographie), rangées sous leur thème et
dans leur rayon, avec un cours et un quiz de 12 questions chacune.`,

  blocs: [
    {
      niveaux: ['1re'],
      positionDepart: 1,
      chapitres: [
        // ===================================================================
        // HISTOIRE — Thème 1
        // ===================================================================
        {
          titre: 'L’Europe bouleversée par la Révolution française (1789-1815)',
          axe: T1,
          rayon: H,
          lecon: {
            titre: 'Des sujets devenus citoyens, une Europe en guerre',
            cours: `En vingt-six ans, de 1789 à 1815, la France passe de la monarchie absolue à la République puis à l’Empire, et toute l’Europe est entraînée dans la guerre. Ce chapitre montre **la rupture révolutionnaire**, en France comme en Europe.

## 1789 : une nation de citoyens égaux en droit
| Date | Événement | Ce qui change |
| **17 juin 1789** | Les députés du tiers état se proclament **Assemblée nationale** | La **souveraineté nationale** remplace la souveraineté du roi |
| **14 juillet 1789** | Prise de la **Bastille** | Le peuple de Paris entre dans la Révolution |
| **4 août 1789** | Abolition des **privilèges** | Fin de la société d’ordres |
| **26 août 1789** | **Déclaration des droits de l’homme et du citoyen** | **Égalité devant la loi**, libertés, souveraineté de la nation |

> La **nation** n’est plus l’ensemble des sujets d’un roi : c’est le corps des **citoyens**, égaux en droit, qui détient la souveraineté.

La Constitution de **1791** crée une **monarchie constitutionnelle** : le roi garde le pouvoir exécutif, mais la loi est votée par une assemblée élue (au suffrage censitaire).

## La chute de la monarchie et la première République
La fuite du roi à **Varennes** (juin 1791) ruine la confiance. La France déclare la guerre à l’Autriche en **avril 1792**. Le **10 août 1792**, les Tuileries sont prises : le roi est suspendu. La **République** est proclamée le **22 septembre 1792** et **Louis XVI** est guillotiné en **janvier 1793**.
La République affronte une guerre extérieure (coalitions des monarchies européennes) et intérieure (Vendée) : c’est la **Terreur** (1793-1794), gouvernement d’exception mené par le Comité de salut public et **Robespierre**.

## Napoléon Bonaparte : conserver et diffuser la Révolution
Par le coup d’État du **18 brumaire an VIII (novembre 1799)**, le général Bonaparte prend le pouvoir ; il se fait sacrer **empereur** en **décembre 1804**. Il conserve certains acquis de 1789 : l’**égalité devant la loi**, la fin des privilèges, inscrites dans le **Code civil (1804)**. Mais il supprime la liberté politique.
Ses conquêtes diffusent ces principes en Europe (Code civil, fin du servage dans certains territoires) tout en imposant la domination française, ce qui réveille le sentiment national des peuples conquis.

## 1815 : le retour de l’ordre monarchique
Réuni de 1814 jusqu’à la veille de **Waterloo (18 juin 1815)**, le **congrès de Vienne** redessine la carte de l’Europe. Les vainqueurs (Autriche, Russie, Prusse, Royaume-Uni) veulent **restaurer l’ordre monarchique** et **asseoir la paix** par l’équilibre entre puissances. En France, les Bourbons reviennent avec Louis XVIII.

## Repères à retenir
| Repère | Date |
| Déclaration des droits de l’homme et du citoyen | 26 août 1789 |
| Proclamation de la République | 22 septembre 1792 |
| Sacre de Napoléon | 2 décembre 1804 |
| Code civil | 1804 |
| Waterloo | 18 juin 1815 |
| Congrès de Vienne | 1814-1815 |

**Notions** : Révolution, souveraineté nationale, égalité devant la loi, nation, République, Empire.`,
          },
          questions: [
            ['Que proclament les députés du tiers état le 17 juin 1789 ?', ['Ils se déclarent Assemblée nationale', 'Ils proclament la République', 'Ils rédigent le Code civil', 'Ils déclarent la guerre à l’Autriche'], 0, 'Se dire « Assemblée nationale », c’est affirmer que la souveraineté appartient à la nation et non plus au roi.'],
            ['Quel texte proclame l’égalité des citoyens devant la loi en août 1789 ?', ['Le Code civil', 'La Constitution de 1791', 'La Déclaration des droits de l’homme et du citoyen', 'Le Concordat'], 2, 'La Déclaration du 26 août 1789 pose les principes d’égalité en droits et de souveraineté nationale.'],
            ['Que supprime la nuit du 4 août 1789 ?', ['La monarchie', 'Les privilèges', 'Le suffrage censitaire', 'L’esclavage dans les colonies'], 1, 'L’abolition des privilèges met fin à la société d’ordres (clergé, noblesse, tiers état).'],
            ['Quel régime la Constitution de 1791 met-elle en place ?', ['Une république', 'Un empire', 'Une monarchie absolue', 'Une monarchie constitutionnelle'], 3, 'Le roi reste chef de l’exécutif, mais il doit respecter une constitution et la loi votée par l’Assemblée.'],
            ['La République est proclamée en France le 22 septembre 1792.', ['Vrai', 'Faux'], 0, 'Elle est proclamée par la Convention, quelques semaines après la chute de la monarchie le 10 août 1792.'],
            ['Pourquoi parle-t-on de la « Terreur » en 1793-1794 ?', ['Pour désigner l’occupation étrangère de Paris', 'Pour désigner un gouvernement d’exception qui suspend les libertés face aux guerres', 'Pour désigner la famine de 1789', 'Pour désigner le règne de Napoléon'], 1, 'Menacée de l’extérieur et de l’intérieur, la République confie le pouvoir au Comité de salut public, qui fait arrêter et exécuter les « suspects ».'],
            ['Comment Napoléon Bonaparte arrive-t-il au pouvoir en 1799 ?', ['Par une élection au suffrage universel', 'Par un héritage dynastique', 'Par le coup d’État du 18 brumaire', 'Par une victoire à Waterloo'], 2, 'Le 18 brumaire an VIII (9 novembre 1799), il renverse le Directoire et fonde le Consulat.'],
            ['Quel acquis de la Révolution Napoléon conserve-t-il dans le Code civil de 1804 ?', ['La liberté de la presse', 'Le suffrage universel', 'Le droit de grève', 'L’égalité devant la loi'], 3, 'Le Code civil garantit l’égalité civile et la propriété, mais Napoléon supprime les libertés politiques.'],
            ['Les conquêtes napoléoniennes ont diffusé en Europe certains principes révolutionnaires.', ['Vrai', 'Faux'], 0, 'Le Code civil et la fin des privilèges sont exportés dans des territoires conquis, tout en imposant la domination française.'],
            ['Quelle est la date de la bataille de Waterloo ?', ['18 juin 1815', '14 juillet 1789', '2 décembre 1804', '10 août 1792'], 0, 'La défaite de Waterloo met fin aux Cent-Jours et au règne de Napoléon.'],
            ['Quel est le but principal du congrès de Vienne (1814-1815) ?', ['Diffuser les idées révolutionnaires', 'Restaurer l’ordre monarchique et assurer la paix en Europe', 'Créer une Europe unie', 'Libérer les colonies'], 1, 'Les vainqueurs de Napoléon redessinent l’Europe pour y rétablir les monarchies et un équilibre entre puissances.'],
            ['Quelle notion désigne l’idée que le pouvoir appartient à l’ensemble des citoyens ?', ['Le droit divin', 'L’absolutisme', 'La souveraineté nationale', 'Le suffrage censitaire'], 2, 'La souveraineté nationale, proclamée en 1789, remplace le pouvoir de droit divin du roi.'],
          ],
        },
        {
          titre: '10 août 1792 : la chute de la monarchie et le basculement vers une république révolutionnaire',
          axe: T1,
          rayon: H,
          lecon: {
            titre: 'Une journée qui renverse mille ans de monarchie',
            cours: `Le **10 août 1792**, les Parisiens et les fédérés prennent d’assaut le palais des **Tuileries**, où vit Louis XVI. En une journée, la monarchie tombe. Étudier cette journée révolutionnaire, c’est comprendre comment la France rompt avec l’Europe des rois et entre dans sa première expérience républicaine.

## Pourquoi la monarchie constitutionnelle échoue
1. **La fuite à Varennes (20-21 juin 1791)** : le roi tente de rejoindre la frontière ; arrêté, il apparaît comme un traître à la nation.
2. **La guerre** : le 20 avril 1792, la France déclare la guerre à l’Autriche (bientôt alliée à la Prusse). Les premières défaites font craindre une trahison de la cour.
3. **Le veto royal** : Louis XVI bloque des décrets de l’Assemblée législative (contre les prêtres réfractaires, pour un camp de fédérés).
4. **Le manifeste de Brunswick (juillet 1792)** : le chef des armées prussiennes menace Paris d’une « exécution militaire » si l’on touche au roi. L’effet est inverse : Paris se soulève.

> La guerre extérieure transforme la méfiance envers le roi en insurrection : le roi paraît lié aux ennemis de la nation.

## Le déroulement de la journée
| Heure / moment | Ce qui se passe |
| Nuit du 9 au 10 août | Les sections parisiennes forment une **Commune insurrectionnelle** |
| Matin | Les **sans-culottes** et les **fédérés** (dont les Marseillais) marchent sur les Tuileries |
| Vers 8 h | Le roi et sa famille se réfugient à l’**Assemblée législative** |
| Fin de matinée | Combat contre les **gardes suisses** : plusieurs centaines de morts des deux côtés |
| Soir | L’Assemblée **suspend le roi** et convoque une **Convention** élue au suffrage universel masculin |

## Les acteurs
- **Louis XVI**, roi des Français depuis 1791, puis prisonnier au Temple.
- **Les sans-culottes** : artisans, boutiquiers du peuple parisien, favorables à une démocratie directe.
- **Les fédérés** : gardes nationaux venus des départements, comme les Marseillais qui popularisent le chant qui deviendra *La Marseillaise*.
- **Danton**, **Robespierre** : figures du mouvement révolutionnaire.

## Les conséquences : une république en guerre
- Le **21 septembre 1792**, la Convention abolit la royauté ; le **22 septembre** marque le début de la **République**. La veille, la victoire de **Valmy** (20 septembre) a stoppé les Prussiens.
- **Louis XVI** est jugé et **guillotiné le 21 janvier 1793** : les monarchies européennes forment une coalition contre la France.
- La République affronte aussi une guerre intérieure (**Vendée**, 1793) : c’est le contexte de la **Terreur**.

## Repères à retenir
| Repère | Date |
| Fuite à Varennes | juin 1791 |
| Déclaration de guerre à l’Autriche | 20 avril 1792 |
| Prise des Tuileries | 10 août 1792 |
| Valmy | 20 septembre 1792 |
| Proclamation de la République | 21-22 septembre 1792 |
| Exécution de Louis XVI | 21 janvier 1793 |`,
          },
          questions: [
            ['Quel palais est pris d’assaut le 10 août 1792 ?', ['Versailles', 'Le Louvre', 'Les Tuileries', 'La Bastille'], 2, 'Depuis octobre 1789, la famille royale vit aux Tuileries, à Paris.'],
            ['Quel événement de juin 1791 ruine la confiance envers le roi ?', ['La fuite à Varennes', 'La bataille de Valmy', 'Le serment du Jeu de paume', 'La prise de la Bastille'], 0, 'Arrêté à Varennes alors qu’il fuyait vers la frontière, le roi apparaît comme un traître.'],
            ['Contre quel pays la France déclare-t-elle la guerre en avril 1792 ?', ['Le Royaume-Uni', 'L’Espagne', 'La Russie', 'L’Autriche'], 3, 'La guerre est déclarée au « roi de Bohême et de Hongrie », c’est-à-dire à l’Autriche, rejointe par la Prusse.'],
            ['Quel texte menace Paris d’une « exécution militaire » à l’été 1792 ?', ['La Déclaration de Pillnitz', 'Le manifeste de Brunswick', 'Le Code civil', 'La loi des suspects'], 1, 'Ce manifeste du chef des armées prussiennes provoque l’effet inverse de celui voulu : il pousse Paris à l’insurrection.'],
            ['Qui sont les sans-culottes ?', ['Des nobles émigrés', 'Des soldats prussiens', 'Des révolutionnaires du peuple parisien', 'Des prêtres réfractaires'], 2, 'Artisans et boutiquiers, ils portent le pantalon et non la culotte des aristocrates, et réclament une démocratie directe.'],
            ['Les fédérés marseillais ont popularisé le chant qui deviendra La Marseillaise.', ['Vrai', 'Faux'], 0, 'Composé à Strasbourg par Rouget de Lisle, le chant est popularisé par les fédérés marseillais arrivés à Paris en 1792.'],
            ['Que décide l’Assemblée législative le soir du 10 août 1792 ?', ['Elle rétablit le roi', 'Elle déclare la guerre à la Prusse', 'Elle proclame l’Empire', 'Elle suspend le roi et convoque une Convention'], 3, 'La Convention sera élue au suffrage universel masculin : c’est un basculement démocratique.'],
            ['Quelle victoire de septembre 1792 arrête l’avancée prussienne ?', ['Valmy', 'Austerlitz', 'Waterloo', 'Iéna'], 0, 'La canonnade de Valmy, le 20 septembre 1792, précède d’un jour l’abolition de la royauté.'],
            ['Quand Louis XVI est-il exécuté ?', ['Le 10 août 1792', 'Le 21 janvier 1793', 'Le 14 juillet 1790', 'Le 9 thermidor an II'], 1, 'Jugé par la Convention, le roi est guillotiné le 21 janvier 1793, ce qui élargit la coalition européenne contre la France.'],
            ['Qui défend les Tuileries le 10 août 1792 ?', ['Les fédérés marseillais', 'Les sans-culottes', 'Les gardes suisses', 'L’armée prussienne'], 2, 'Les gardes suisses de la garde du roi combattent les insurgés ; beaucoup sont tués.'],
            ['La chute de la monarchie rapproche la France des autres monarchies européennes.', ['Vrai', 'Faux'], 1, 'C’est l’inverse : la rupture avec la royauté isole la France et élargit la guerre contre les monarchies européennes.'],
            ['Dans quel contexte la République met-elle en place la Terreur ?', ['Une paix durable', 'Une guerre extérieure et une guerre intérieure', 'Une crise économique sans conflit', 'Le retour de Napoléon'], 1, 'La guerre contre la coalition européenne et le soulèvement de la Vendée expliquent le gouvernement d’exception de 1793-1794.'],
          ],
        },
        {
          titre: 'Les puissances européennes contre Napoléon : la bataille de Waterloo',
          axe: T1,
          rayon: H,
          lecon: {
            titre: 'Waterloo, la coalition des monarchies contre l’Empereur',
            cours: `Le **18 juin 1815**, près de **Waterloo** (au sud de Bruxelles, dans l’actuelle Belgique), Napoléon livre sa dernière bataille. Étudier cette journée et ses acteurs, c’est comprendre **pourquoi toute l’Europe monarchique s’unit** pour empêcher son retour.

## Le contexte : les Cent-Jours
1. **Avril 1814** : vaincu, Napoléon abdique et part en exil sur l’île d’**Elbe**. Louis XVIII, frère de Louis XVI, devient roi : c’est la **Restauration**.
2. **1er mars 1815** : Napoléon débarque à Golfe-Juan et remonte vers Paris sans combat ; Louis XVIII s’enfuit à Gand. C’est le début des **Cent-Jours**.
3. Réunies au **congrès de Vienne**, les puissances déclarent Napoléon « hors des relations civiles et sociales » et forment une **septième coalition**.

> Pour les monarchies européennes, Napoléon incarne la Révolution armée : le laisser revenir, c’est risquer vingt ans de guerres de plus.

## Les forces en présence
| Camp | Chef | Composition |
| **Armée du Nord** (France) | **Napoléon** | Environ 70 000 hommes |
| **Armée anglo-alliée** | Le duc de **Wellington** | Britanniques, Néerlandais, Belges, Allemands (Hanovre, Brunswick, Nassau) |
| **Armée prussienne** | Le maréchal **Blücher** | Environ 50 000 hommes engagés à Waterloo |

La coalition rassemble aussi l’**Autriche** et la **Russie**, dont les armées marchent vers la France sans arriver à temps.

## Le déroulement de la bataille
- Napoléon veut battre séparément Anglais et Prussiens. Le 16 juin, il bat les Prussiens à **Ligny**, mais ne les détruit pas.
- Le 18 juin, la pluie retarde l’attaque. Wellington tient le plateau de **Mont-Saint-Jean** ; les charges de la cavalerie du maréchal **Ney** se brisent sur les carrés britanniques.
- L’après-midi, les **Prussiens de Blücher** arrivent sur le flanc droit français. Le soir, l’assaut de la **Garde impériale** échoue : l’armée française se débande.
- Bilan : environ **50 000 tués et blessés** au total en une journée.

## Les conséquences
- Napoléon abdique une seconde fois le **22 juin 1815** et est exilé sur l’île de **Sainte-Hélène**, dans l’Atlantique Sud, où il meurt en **1821**.
- Le **second traité de Paris** (novembre 1815) impose à la France une occupation et une indemnité de guerre.
- Signé neuf jours avant la bataille, l’acte final du **congrès de Vienne** (9 juin 1815) redessine l’Europe ; après Waterloo, la **Sainte-Alliance** (Russie, Autriche, Prusse) veut empêcher tout retour des révolutions.

## Repères à retenir
| Repère | Date |
| Abdication et exil à l’île d’Elbe | avril 1814 |
| Retour de Napoléon (Cent-Jours) | mars-juin 1815 |
| Bataille de Waterloo | 18 juin 1815 |
| Seconde abdication | 22 juin 1815 |
| Mort à Sainte-Hélène | 1821 |`,
          },
          questions: [
            ['Où se situe Waterloo ?', ['En Prusse', 'Près de Bruxelles, dans l’actuelle Belgique', 'Dans le nord de la France', 'En Autriche'], 1, 'Waterloo est au sud de Bruxelles ; en 1815, le territoire appartient au royaume uni des Pays-Bas.'],
            ['Comment appelle-t-on la période du retour de Napoléon en 1815 ?', ['La Restauration', 'Le Consulat', 'Les Cent-Jours', 'La Terreur'], 2, 'De son débarquement le 1er mars à sa seconde abdication le 22 juin 1815 s’écoulent environ cent jours.'],
            ['Où Napoléon était-il exilé avant les Cent-Jours ?', ['À Sainte-Hélène', 'En Corse', 'À Malte', 'À l’île d’Elbe'], 3, 'Après son abdication d’avril 1814, il reçoit la souveraineté de la petite île d’Elbe, en Méditerranée.'],
            ['Qui commande l’armée anglo-alliée à Waterloo ?', ['Le duc de Wellington', 'Le maréchal Blücher', 'Le maréchal Ney', 'Le tsar Alexandre Ier'], 0, 'Wellington tient le plateau de Mont-Saint-Jean en attendant les Prussiens.'],
            ['Quelle armée arrive sur le flanc français l’après-midi du 18 juin ?', ['L’armée autrichienne', 'L’armée russe', 'L’armée prussienne de Blücher', 'L’armée espagnole'], 2, 'L’arrivée des Prussiens de Blücher décide de la bataille.'],
            ['L’armée anglo-alliée de Wellington ne comptait que des soldats britanniques.', ['Vrai', 'Faux'], 1, 'Elle mêlait Britanniques, Néerlandais, Belges et contingents allemands : c’est une armée de coalition.'],
            ['Pourquoi les monarchies européennes s’unissent-elles contre Napoléon en 1815 ?', ['Pour lui confier la France', 'Parce qu’il incarne la Révolution et la guerre permanente', 'Pour partager l’Amérique', 'Pour protéger la République française'], 1, 'Les rois voient en lui l’héritier armé de la Révolution qui menace l’ordre monarchique.'],
            ['Où Napoléon est-il exilé après Waterloo ?', ['À l’île d’Elbe', 'En Russie', 'À Sainte-Hélène', 'En Amérique'], 2, 'Les Britanniques l’envoient sur cette île isolée de l’Atlantique Sud, où il meurt en 1821.'],
            ['Quelle bataille Napoléon gagne-t-il contre les Prussiens le 16 juin 1815 ?', ['Ligny', 'Austerlitz', 'Iéna', 'Valmy'], 0, 'Il bat Blücher à Ligny, mais sans détruire son armée, qui rejoindra Waterloo deux jours plus tard.'],
            ['Quelle alliance de 1815 réunit la Russie, l’Autriche et la Prusse pour défendre l’ordre monarchique ?', ['La Triple-Entente', 'La Sainte-Alliance', 'La Triple-Alliance', 'La Ligue des nations'], 1, 'Proposée par le tsar, la Sainte-Alliance veut empêcher le retour des idées révolutionnaires.'],
            ['Quel roi revient au pouvoir en France après la défaite de Napoléon ?', ['Louis XVI', 'Charles X', 'Louis-Philippe', 'Louis XVIII'], 3, 'Frère de Louis XVI, Louis XVIII règne de 1814 à 1824, avec l’interruption des Cent-Jours.'],
            ['Waterloo a fait environ 50 000 tués et blessés en une journée.', ['Vrai', 'Faux'], 0, 'L’ordre de grandeur, tous camps confondus, montre la violence des batailles napoléoniennes.'],
          ],
        },

        // ===================================================================
        // HISTOIRE — Thème 2
        // ===================================================================
        {
          titre: 'Politique et société en France sous la Deuxième République et le Second Empire',
          axe: T2,
          rayon: H,
          lecon: {
            titre: 'Du suffrage universel à l’empire autoritaire (1848-1870)',
            cours: `Entre **1848 et 1870**, la France vit deux régimes très différents : une république démocratique, puis un empire autoritaire. Pendant ce temps, l’économie et la société se transforment en profondeur. Ce chapitre relie ces deux histoires.

## 1848 : l’affirmation des principes démocratiques
En **février 1848**, une révolution parisienne renverse le roi **Louis-Philippe**. Un **gouvernement provisoire** proclame la **Deuxième République** et prend aussitôt des mesures majeures :
| Mesure | Date | Portée |
| **Suffrage universel masculin** | mars 1848 | Tous les hommes de 21 ans et plus votent : 9 millions d’électeurs au lieu de 250 000 |
| **Abolition de l’esclavage** | 27 avril 1848 | Décret porté par **Victor Schœlcher** |
| Liberté de la presse et de réunion | 1848 | Fin de la censure |
| **Ateliers nationaux** | février 1848 | Travail pour les chômeurs parisiens |

## La rupture de juin 1848
L’Assemblée élue en avril est modérée. Elle ferme les **ateliers nationaux** : les ouvriers parisiens se soulèvent (**journées de juin 1848**). La répression par le général Cavaignac fait des milliers de morts. La République se coupe du monde ouvrier.
En **décembre 1848**, **Louis-Napoléon Bonaparte**, neveu de Napoléon Ier, est élu président avec près de 75 % des voix.

> Juin 1848 marque la rupture entre la République et les ouvriers : la démocratie politique ne règle pas la question sociale.

## Le Second Empire : un régime autoritaire (1852-1870)
Le **2 décembre 1851**, Louis-Napoléon fait un **coup d’État** ; un an plus tard, il devient **Napoléon III**. Le régime garde le suffrage universel masculin (plébiscites, candidats officiels) mais surveille la presse et exile les opposants. Il se libéralise dans les années 1860, par exemple en reconnaissant le **droit de grève** (**loi Ollivier, 1864**).

## Industrialisation et urbanisation
- **Chemin de fer** : le réseau passe d’environ 3 000 km en 1851 à environ 17 000 km en 1870.
- Grandes banques (Crédit lyonnais, Société générale), grands magasins (le Bon Marché).
- **Urbanisation** : à Paris, le préfet **Haussmann** perce de grands boulevards, construit égouts et parcs.
- La société reste majoritairement rurale, mais le monde ouvrier grandit.

## La chute de l’Empire
En **juillet 1870**, la France déclare la guerre à la **Prusse**. Napoléon III est capturé à **Sedan** le **2 septembre 1870** ; le **4 septembre**, la République est proclamée à Paris. L’**Empire allemand** est proclamé à Versailles le **18 janvier 1871** : l’unité allemande se fait contre la France, qui perd l’**Alsace-Moselle**.

## Repères à retenir
| Repère | Date |
| Révolution et IIe République | février 1848 |
| Abolition de l’esclavage | 27 avril 1848 |
| Journées de juin | juin 1848 |
| Coup d’État | 2 décembre 1851 |
| Droit de grève | 1864 |
| Sedan, proclamation de la République | 2 et 4 septembre 1870 |

**Notions** : démocratie, suffrage universel masculin, régime autoritaire, industrialisation, urbanisation, droit de grève.`,
          },
          questions: [
            ['Quel roi est renversé par la révolution de février 1848 ?', ['Charles X', 'Louis-Philippe', 'Louis XVIII', 'Napoléon III'], 1, 'Louis-Philippe, roi de la monarchie de Juillet depuis 1830, abdique face à l’insurrection parisienne.'],
            ['Que change le suffrage universel masculin instauré en 1848 ?', ['Les femmes obtiennent le droit de vote', 'Seuls les riches votent', 'Tous les hommes de 21 ans et plus peuvent voter', 'Le roi choisit les députés'], 2, 'Le corps électoral passe d’environ 250 000 à 9 millions d’électeurs.'],
            ['Qui porte le décret d’abolition de l’esclavage d’avril 1848 ?', ['Victor Schœlcher', 'Victor Hugo', 'Lamartine', 'Haussmann'], 0, 'Le décret du 27 avril 1848 abolit l’esclavage dans les colonies françaises.'],
            ['Pourquoi les ouvriers parisiens se soulèvent-ils en juin 1848 ?', ['Pour rétablir le roi', 'Contre la guerre avec la Prusse', 'Contre le suffrage universel', 'Contre la fermeture des ateliers nationaux'], 3, 'La fermeture de ces ateliers qui employaient les chômeurs déclenche l’insurrection, durement réprimée.'],
            ['Louis-Napoléon Bonaparte est élu président de la République en décembre 1848.', ['Vrai', 'Faux'], 0, 'Il l’emporte largement au suffrage universel masculin, grâce au prestige de son nom.'],
            ['Comment Louis-Napoléon Bonaparte met-il fin à la Deuxième République ?', ['Par une défaite militaire', 'Par un coup d’État le 2 décembre 1851', 'Par une élection perdue', 'Par une révolution ouvrière'], 1, 'Ne pouvant être réélu, il s’empare du pouvoir par la force ; l’Empire est rétabli un an plus tard.'],
            ['Pourquoi dit-on que le Second Empire est un régime autoritaire ?', ['Parce qu’il supprime le suffrage universel', 'Parce que le pouvoir est concentré et les libertés surveillées', 'Parce qu’il n’a pas de chef', 'Parce qu’il est dirigé par l’Assemblée'], 1, 'Le suffrage universel masculin est conservé, mais la presse est surveillée, les opposants exilés et les candidats officiels favorisés.'],
            ['Quelle loi de 1864 reconnaît le droit de grève ?', ['La loi Le Chapelier', 'La loi Falloux', 'La loi Ollivier', 'La loi Guizot'], 2, 'La loi Ollivier supprime le délit de coalition : faire grève n’est plus un crime.'],
            ['Quel préfet transforme Paris sous le Second Empire ?', ['Haussmann', 'Schneider', 'Cavaignac', 'Thiers'], 0, 'Le baron Haussmann perce de grands boulevards, construit égouts, parcs et immeubles à façade uniforme.'],
            ['Quelle défaite entraîne la chute du Second Empire ?', ['Waterloo', 'Verdun', 'Solferino', 'Sedan'], 3, 'Napoléon III est fait prisonnier à Sedan le 2 septembre 1870 ; la République est proclamée le 4 septembre.'],
            ['Sous le Second Empire, la France devient majoritairement urbaine.', ['Vrai', 'Faux'], 1, 'Malgré l’industrialisation et l’urbanisation, la population reste majoritairement rurale jusqu’en 1931.'],
            ['Quelle conséquence la guerre de 1870-1871 a-t-elle pour l’Allemagne ?', ['Elle perd l’Alsace', 'Elle réalise son unité autour de la Prusse', 'Elle devient une république', 'Elle s’allie à la France'], 1, 'L’Empire allemand est proclamé dans la galerie des Glaces de Versailles le 18 janvier 1871.'],
          ],
        },
        {
          titre: 'Victor Hugo sous la Deuxième République et le Second Empire',
          axe: T2,
          rayon: H,
          lecon: {
            titre: 'Du conservateur au proscrit : Hugo devient la voix de la République',
            cours: `**Victor Hugo** (1802-1885) est déjà un écrivain célèbre en 1848. En vingt ans, il devient **l’une des grandes références des républicains**. Comprendre son évolution politique, c’est suivre l’histoire de la France de 1848 à 1870 à travers un homme.

## 1848 : un élu conservateur
- Pair de France sous Louis-Philippe, Hugo est élu en **juin 1848** député de Paris à l’Assemblée constituante, avec les voix du parti de l’Ordre.
- Pendant les **journées de juin 1848**, il fait partie des députés envoyés pour rétablir l’ordre face aux insurgés.
- En décembre 1848, il soutient la candidature de **Louis-Napoléon Bonaparte** à la présidence.

## 1849-1851 : le tournant vers la gauche
Élu à l’**Assemblée législative** en 1849, Hugo s’éloigne de la droite :
| Discours | Date | Idée défendue |
| Discours sur la **misère** | juillet 1849 | « Détruire la misère » est un devoir du législateur |
| Contre la **loi Falloux** | janvier 1850 | Il défend l’école laïque contre l’influence de l’Église |
| Contre la restriction du **suffrage universel** | mai 1850 | La loi du 31 mai 1850 retire le vote à environ 3 millions d’hommes |
| Contre la **révision** de la Constitution | juillet 1851 | Il dénonce l’ambition de « Napoléon le Petit » |

> Hugo passe du camp de l’ordre à celui de la République démocratique et sociale : il défend le suffrage universel, l’école, la lutte contre la misère.

## Le proscrit : lutter contre le Second Empire
- Le **2 décembre 1851**, Hugo tente d’organiser la résistance au coup d’État à Paris. Menacé, il s’enfuit à **Bruxelles**.
- Il s’installe ensuite dans les îles Anglo-Normandes : **Jersey** (1852), puis **Guernesey** (1855), à **Hauteville House**.
- Il écrit contre l’empereur : le pamphlet **Napoléon le Petit** (1852) et le recueil **Les Châtiments** (1853), diffusés clandestinement en France.
- En **1859**, il refuse l’**amnistie** offerte par Napoléon III : « Quand la liberté rentrera, je rentrerai. » Il devient un **exilé volontaire**.
- Il publie **Les Misérables** (1862), roman de la misère sociale et de la justice.

## Le retour et la gloire républicaine
Le **5 septembre 1870**, au lendemain de la proclamation de la République, Hugo rentre à Paris, acclamé par la foule. Élu député en 1871, puis sénateur, il plaide pour l’**amnistie des communards**. À sa mort en **1885**, la République lui offre des **funérailles nationales** et il entre au **Panthéon**.

## Repères à retenir
| Repère | Date |
| Élu député | juin 1848 |
| Discours sur la misère | 1849 |
| Exil après le coup d’État | décembre 1851 |
| Les Châtiments | 1853 |
| Refus de l’amnistie | 1859 |
| Retour à Paris | 5 septembre 1870 |
| Funérailles nationales, Panthéon | 1885 |`,
          },
          questions: [
            ['Quelle est la position politique de Victor Hugo lorsqu’il est élu en juin 1848 ?', ['Socialiste révolutionnaire', 'Conservateur, élu avec le parti de l’Ordre', 'Bonapartiste convaincu depuis toujours', 'Monarchiste légitimiste radical'], 1, 'Il est d’abord un notable conservateur ; son évolution vers la République démocratique vient ensuite.'],
            ['Quel combat Hugo mène-t-il dans son discours de juillet 1849 ?', ['La guerre contre la Prusse', 'Le rétablissement de la monarchie', 'La lutte contre la misère', 'La colonisation de l’Algérie'], 2, 'Il affirme que le législateur doit « détruire la misère », un thème qu’on retrouve dans Les Misérables.'],
            ['Contre quelle loi de 1850 Hugo défend-il l’école laïque ?', ['La loi Ferry', 'La loi Falloux', 'La loi Ollivier', 'La loi Guizot'], 1, 'La loi Falloux renforce la place de l’Église dans l’enseignement ; Hugo la combat au nom de la liberté de pensée.'],
            ['Pourquoi Hugo s’exile-t-il en décembre 1851 ?', ['Parce qu’il a perdu une élection', 'Pour écrire au calme', 'Parce qu’il est nommé ambassadeur', 'Parce qu’il s’est opposé au coup d’État de Louis-Napoléon'], 3, 'Il tente d’organiser la résistance au coup d’État, puis fuit pour échapper à l’arrestation.'],
            ['Sur quelle île Hugo vit-il la plus grande partie de son exil ?', ['Guernesey', 'Sainte-Hélène', 'La Corse', 'Elbe'], 0, 'Il s’installe à Guernesey en 1855, dans sa maison de Hauteville House.'],
            ['Quel recueil de poèmes de 1853 attaque Napoléon III ?', ['Les Contemplations', 'Les Misérables', 'Les Châtiments', 'Notre-Dame de Paris'], 2, 'Les Châtiments dénoncent le coup d’État ; le recueil circule clandestinement en France.'],
            ['Comment Hugo surnomme-t-il Louis-Napoléon Bonaparte ?', ['Napoléon le Grand', 'Napoléon le Petit', 'Le roi bourgeois', 'L’Aigle'], 1, 'Le pamphlet Napoléon le Petit (1852) oppose le neveu au grand oncle.'],
            ['En 1859, Hugo accepte l’amnistie et rentre en France.', ['Vrai', 'Faux'], 1, 'Il la refuse : « Quand la liberté rentrera, je rentrerai. » Il devient alors un exilé volontaire.'],
            ['Quand Hugo rentre-t-il à Paris ?', ['En 1852', 'En 1885', 'En 1859', 'Au lendemain de la proclamation de la République, en septembre 1870'], 3, 'Il arrive le 5 septembre 1870, acclamé par la foule.'],
            ['Quel roman de 1862 met en scène la misère sociale ?', ['Les Misérables', 'Germinal', 'Le Rouge et le Noir', 'Madame Bovary'], 0, 'Écrit en exil, Les Misérables suit Jean Valjean, ancien forçat, et dénonce l’injustice sociale.'],
            ['Pourquoi Hugo devient-il une référence des républicains ?', ['Parce qu’il a toujours été républicain', 'Par son combat pour le suffrage universel et son opposition au Second Empire', 'Parce qu’il a fondé la IIIe République', 'Parce qu’il a été président'], 1, 'Son évolution politique et vingt ans d’exil font de lui un symbole de la résistance au pouvoir personnel.'],
            ['À sa mort en 1885, Victor Hugo reçoit des funérailles nationales et entre au Panthéon.', ['Vrai', 'Faux'], 0, 'La IIIe République honore en lui une figure fondatrice de la culture républicaine.'],
          ],
        },
        {
          titre: 'Les établissements Schneider au Creusot sous la Deuxième République et le Second Empire',
          axe: T2,
          rayon: H,
          lecon: {
            titre: 'Le Creusot, une ville-usine au cœur de l’industrialisation',
            cours: `Au **Creusot**, en Saône-et-Loire (Bourgogne), la famille **Schneider** bâtit l’un des plus grands ensembles industriels d’Europe. C’est un exemple concret de l’**industrialisation** de la France au milieu du XIXe siècle, et de ses conséquences pour les ouvriers et leurs familles.

## Une entreprise familiale devenue géante
En **1836**, les frères **Adolphe** et **Eugène Schneider** rachètent les forges et fonderies du Creusot, situées près de gisements de **charbon** et de **minerai de fer**. Après la mort d’Adolphe (1845), **Eugène Schneider** dirige seul l’entreprise.
| Production | Exemple |
| **Sidérurgie** | Fonte, fer puis acier ; hauts fourneaux, grande forge |
| **Transports** | Locomotives (l’une des premières françaises dès 1838), rails, ponts métalliques |
| **Navires** | Coques et machines pour bateaux à vapeur (chantiers de Chalon-sur-Saône) |
| **Armement** | Canons, surtout après 1870 |

Les effectifs passent d’environ 3 000 ouvriers vers 1850 à plus de 10 000 vers 1870.

## Eugène Schneider, patron et homme politique
Eugène Schneider (1805-1875) cumule le pouvoir économique et le pouvoir politique : **député**, **ministre** de l’Agriculture et du Commerce (1851), **président du Corps législatif** (1867-1870), maire du Creusot. Il soutient Napoléon III, dont le régime favorise les grands industriels (commandes de rails, traité de libre-échange de 1860).

> Au Creusot, le patron contrôle l’usine, la ville et la représentation politique : c’est le modèle du **paternalisme**.

## Une ville-usine : le paternalisme
Schneider fait construire autour de l’usine :
1. des **logements ouvriers** (cités, maisons avec jardin) ;
2. des **écoles** pour former les futurs ouvriers et contremaîtres ;
3. un **hôpital**, une **caisse de secours** et de retraite, une église.
Ces avantages attachent les ouvriers à l’entreprise, mais les placent sous la surveillance du patron, jusque dans leur vie privée.

## Nouvelles formes de travail et conflits sociaux
- Le travail change : grands ateliers, machines à vapeur, **discipline** stricte, horaires longs, travail des enfants.
- Les ouvriers viennent souvent des campagnes voisines : c’est l’**exode rural**.
- En **janvier et mars-avril 1870**, de grandes **grèves** éclatent au Creusot (conflit sur la gestion de la caisse de secours, salaires) ; l’armée intervient. Elles montrent la montée d’une **conscience ouvrière**, peu après la reconnaissance du **droit de grève (1864)**.

## Le croquis en mots
Imagine une carte de la Bourgogne : au centre, **Le Creusot**, relié par le **canal du Centre** et le chemin de fer à **Chalon-sur-Saône** (chantiers navals, sur la Saône), et au-delà aux grands marchés (Paris, Lyon). Autour de l’usine, les cités ouvrières, les écoles et l’église forment la ville.

## Repères à retenir
| Repère | Date |
| Rachat par les frères Schneider | 1836 |
| Premières locomotives du Creusot | 1838 |
| Eugène, président du Corps législatif | 1867-1870 |
| Grandes grèves du Creusot | 1870 |`,
          },
          questions: [
            ['Dans quelle région se trouve Le Creusot ?', ['En Lorraine', 'En Bourgogne (Saône-et-Loire)', 'Dans le Nord', 'En Provence'], 1, 'Le Creusot est en Saône-et-Loire, près de gisements de charbon et de fer.'],
            ['En quelle année les frères Schneider rachètent-ils le Creusot ?', ['1789', '1848', '1836', '1870'], 2, 'Adolphe et Eugène Schneider rachètent les forges en 1836.'],
            ['Quelle activité est au cœur des établissements Schneider ?', ['Le textile', 'L’agriculture', 'La banque', 'La sidérurgie et la construction mécanique'], 3, 'Fonte, fer, acier, locomotives, rails et machines font du Creusot un grand centre sidérurgique.'],
            ['Quelle fonction politique Eugène Schneider occupe-t-il de 1867 à 1870 ?', ['Président du Corps législatif', 'Empereur', 'Préfet de la Seine', 'Président de la République'], 0, 'Il préside l’assemblée élue du Second Empire, ce qui montre le lien entre grands industriels et pouvoir.'],
            ['Qu’appelle-t-on le paternalisme ?', ['Le pouvoir du père dans la famille', 'L’encadrement de la vie des ouvriers par le patron (logement, école, santé)', 'Un syndicat ouvrier', 'Une loi sur le travail des enfants'], 1, 'Le patron offre des avantages sociaux mais contrôle ainsi la vie des ouvriers.'],
            ['Schneider construit des écoles, des logements et un hôpital pour ses ouvriers.', ['Vrai', 'Faux'], 0, 'Ces équipements fixent la main-d’œuvre et forment les futurs ouvriers.'],
            ['D’où viennent principalement les ouvriers du Creusot ?', ['De Paris', 'D’Angleterre', 'Des campagnes voisines', 'Des colonies'], 2, 'L’exode rural fournit à l’usine une main-d’œuvre venue des campagnes.'],
            ['Que produit notamment le Creusot pour le chemin de fer ?', ['Des locomotives et des rails', 'Des wagons en bois uniquement', 'Des billets', 'Des gares'], 0, 'Les premières locomotives du Creusot sortent dès 1838 ; les rails alimentent l’essor du réseau.'],
            ['Que se passe-t-il au Creusot en 1870 ?', ['Une révolution qui renverse Napoléon III', 'La fermeture définitive de l’usine', 'De grandes grèves ouvrières', 'L’arrivée des Prussiens'], 2, 'Les grèves de janvier et du printemps 1870 montrent la montée d’une conscience ouvrière.'],
            ['Quelle loi permet aux ouvriers de faire grève légalement depuis 1864 ?', ['La loi Falloux', 'La loi Ollivier', 'La loi Ferry', 'La loi de 1905'], 1, 'La loi Ollivier supprime le délit de coalition.'],
            ['Eugène Schneider est opposé au Second Empire.', ['Vrai', 'Faux'], 1, 'Il soutient Napoléon III, dont la politique favorise les grands industriels.'],
            ['Quelle ville proche accueille les chantiers navals des Schneider ?', ['Marseille', 'Le Havre', 'Lyon', 'Chalon-sur-Saône'], 3, 'Reliée au Creusot par le canal du Centre, Chalon-sur-Saône construit des bateaux à vapeur.'],
          ],
        },

        // ===================================================================
        // HISTOIRE — Thème 3
        // ===================================================================
        {
          titre: 'La Troisième République avant 1914 : un régime, un empire colonial',
          axe: T3,
          rayon: H,
          lecon: {
            titre: 'Enraciner la République, étendre l’empire',
            cours: `Née dans la défaite de 1870, la **Troisième République** devient le régime le plus durable de la France depuis 1789. Elle reprend et approfondit les **principes de 1789**, et elle relance l’expansion d’un vaste **empire colonial**.

## Un régime qui s’installe
- **4 septembre 1870** : proclamation de la République après Sedan.
- **1875** : les **lois constitutionnelles** créent un président, une Chambre des députés élue au **suffrage universel masculin** et un Sénat.
- **1879** : les républicains contrôlent tous les pouvoirs. Paris redevient capitale.

## Le projet républicain : libertés et unité nationale
| Domaine | Mesure | Date |
| Symboles | *La Marseillaise* hymne national, le **14 juillet** fête nationale | 1879-1880 |
| Libertés | Liberté de **réunion** (1881), de la **presse** (1881), **syndicats** (1884), **associations** (1901) | 1881-1901 |
| École | **Lois Jules Ferry** : école primaire **gratuite**, **laïque** et **obligatoire** (6-13 ans) | 1881-1882 |
| Commune | Élection des maires par le conseil municipal | 1882-1884 |

> La République veut unir la nation autour des valeurs de 1789 : l’école forme des citoyens, les symboles rassemblent.

## L’affaire Dreyfus et l’antisémitisme
En **1894**, le capitaine **Alfred Dreyfus**, officier juif, est condamné à tort pour espionnage au profit de l’Allemagne. L’affaire divise la France : les **dreyfusards** (Zola, « **J’accuse…!** », 1898) défendent la vérité et les droits de l’individu ; les **antidreyfusards** mettent l’armée au-dessus de tout, et beaucoup expriment un **antisémitisme** violent. Dreyfus est **réhabilité en 1906**.

## La laïcité : la loi de 1905
La **loi du 9 décembre 1905** sépare les **Églises et l’État** : la République garantit la **liberté de conscience** et le libre exercice des cultes, mais n’en reconnaît ni n’en finance aucun.

## Un empire colonial
- Les puissances européennes sont en **rivalité** : conférence de **Berlin (1884-1885)** sur le partage de l’Afrique, crise de **Fachoda** (1898) avec le Royaume-Uni.
- L’empire français s’étend en Afrique du Nord (Algérie depuis 1830, **Tunisie** 1881, **Maroc** 1912), en **Afrique occidentale et équatoriale** (AOF, AEF), à **Madagascar** (1896) et en **Indochine**. En 1914, il couvre environ **10 millions de km²**.
- **Jules Ferry** justifie la colonisation par des arguments économiques, politiques et une prétendue « mission civilisatrice » ; Clemenceau s’y oppose.
- La **société coloniale** est inégalitaire : colons citoyens, « indigènes » **sujets** soumis au **code de l’indigénat** (1881), travail forcé, résistances.

## Repères à retenir
| Repère | Date |
| Lois constitutionnelles | 1875 |
| Lois Ferry | 1881-1882 |
| Affaire Dreyfus | 1894-1906 |
| Loi de séparation | 1905 |
| Protectorat sur le Maroc | 1912 |

**Notions** : démocratie, République, libertés fondamentales, laïcité, antisémitisme, colonisation, société coloniale.`,
          },
          questions: [
            ['Quand la Troisième République est-elle proclamée ?', ['Le 4 septembre 1870', 'Le 22 septembre 1792', 'Le 24 février 1848', 'Le 11 novembre 1918'], 0, 'Elle est proclamée à Paris après la capture de Napoléon III à Sedan.'],
            ['Que rendent obligatoire les lois Jules Ferry de 1881-1882 ?', ['Le service militaire', 'Le vote des femmes', 'L’école primaire, gratuite et laïque', 'Le catéchisme'], 2, 'L’école de la République forme des citoyens attachés aux valeurs de 1789.'],
            ['Quelle date devient la fête nationale en 1880 ?', ['Le 11 novembre', 'Le 4 août', 'Le 1er mai', 'Le 14 juillet'], 3, 'Le 14 juillet rappelle à la fois la prise de la Bastille (1789) et la fête de la Fédération (1790).'],
            ['Quelle liberté est accordée en 1884 ?', ['La liberté syndicale', 'La liberté de culte', 'Le droit de vote des femmes', 'La liberté d’association'], 0, 'La loi Waldeck-Rousseau de 1884 autorise les syndicats ; la liberté d’association date de 1901.'],
            ['De quoi Alfred Dreyfus est-il accusé à tort en 1894 ?', ['De vol', 'D’espionnage au profit de l’Allemagne', 'De désertion', 'D’assassinat'], 1, 'Officier juif, il est condamné sans preuve ; le vrai coupable était le commandant Esterhazy.'],
            ['Qui publie « J’accuse… ! » en 1898 ?', ['Victor Hugo', 'Jean Jaurès', 'Émile Zola', 'Georges Clemenceau'], 2, 'Zola accuse l’état-major d’avoir condamné un innocent ; le texte paraît dans L’Aurore, journal de Clemenceau.'],
            ['Que révèle l’affaire Dreyfus ?', ['L’absence de divisions en France', 'Un antisémitisme violent dans une partie de la société', 'La victoire de la monarchie', 'La fin de l’armée'], 1, 'Beaucoup d’antidreyfusards attaquent Dreyfus parce qu’il est juif.'],
            ['La loi de 1905 interdit toutes les religions en France.', ['Vrai', 'Faux'], 1, 'Elle garantit au contraire la liberté de conscience et le libre exercice des cultes ; l’État ne reconnaît ni ne finance aucun culte.'],
            ['Quel texte soumet les « indigènes » des colonies à un régime pénal spécial ?', ['Le Code civil', 'La loi de 1905', 'Le code de l’indigénat', 'La Déclaration des droits de l’homme'], 2, 'Instauré en 1881 en Algérie puis étendu, il prévoit des sanctions sans jugement pour les sujets colonisés.'],
            ['Quel homme politique défend la colonisation au nom d’une prétendue « mission civilisatrice » ?', ['Jean Jaurès', 'Alfred Dreyfus', 'Georges Clemenceau', 'Jules Ferry'], 3, 'En 1885, Ferry avance des arguments économiques, politiques et « civilisateurs » ; Clemenceau lui répond en dénonçant la colonisation.'],
            ['Quelle conférence de 1884-1885 organise le partage de l’Afrique entre Européens ?', ['La conférence de Berlin', 'Le congrès de Vienne', 'La conférence de Yalta', 'Le traité de Versailles'], 0, 'Les puissances y fixent les règles de l’occupation des côtes africaines.'],
            ['En 1914, l’empire colonial français couvre environ 10 millions de km².', ['Vrai', 'Faux'], 0, 'C’est le deuxième empire colonial du monde, derrière l’Empire britannique.'],
          ],
        },
        {
          titre: 'L’instruction des filles sous la Troisième République avant 1914',
          axe: T3,
          rayon: H,
          lecon: {
            titre: 'Instruire les filles pour former des républicaines',
            cours: `Sous la Troisième République, l’**instruction des filles** devient une affaire d’État. Le *Nouveau dictionnaire de pédagogie* dirigé par **Ferdinand Buisson** lui consacre une entrée : elle concerne l’instruction **primaire, secondaire et supérieure**. Mais l’égalité avec les garçons reste loin.

## Pourquoi instruire les filles ?
Pour les républicains, l’enjeu est politique. Au XIXe siècle, beaucoup de filles sont instruites par des **congrégations religieuses**. Jules Ferry explique en **1870** que qui a l’influence sur les femmes l’a sur toute la famille : il veut arracher les futures mères à l’influence de l’Église et former des **mères républicaines** qui transmettront les valeurs de la République à leurs enfants.

> L’école des filles doit former des épouses et des mères républicaines, pas encore des citoyennes : les femmes n’ont pas le droit de vote.

## Les grandes lois
| Loi | Date | Contenu |
| Loi **Camille Sée** | 21 décembre 1880 | Crée l’**enseignement secondaire public** de jeunes filles (collèges et lycées) |
| Loi créant l’**École normale supérieure de Sèvres** | 1881 | Forme les professeures des lycées de filles |
| **Lois Ferry** | 1881-1882 | École primaire **gratuite, laïque et obligatoire** de 6 à 13 ans, pour les filles comme pour les garçons |
| Loi **Goblet** | 1886 | Laïcise le personnel des écoles publiques |

## Un enseignement différent de celui des garçons
- Le **primaire** est commun dans ses principes, mais les programmes des filles ajoutent **travaux d’aiguille**, économie domestique et hygiène.
- Le **secondaire** féminin dure cinq ans, sans **latin** ni **grec**, et se termine par un **diplôme de fin d’études**, et non par le **baccalauréat**, qui ouvre l’université. Il faudra attendre **1924** pour que les programmes deviennent identiques.
- Dans le **supérieur**, les femmes sont peu nombreuses. Julie-Victoire **Daubié** avait été la première bachelière en **1861** ; en 1914, les étudiantes restent une petite minorité, souvent en lettres ou en médecine.

## Les institutrices, aux côtés des « hussards noirs » de la République
- La **loi Paul Bert (1879)** impose une **école normale** d’institutrices dans chaque département.
- Formées pendant trois ans, elles enseignent la morale laïque, le français, le calcul, l’histoire de la nation.
- Souvent jeunes, parfois isolées dans un village, surveillées par le maire et l’inspecteur, elles incarnent la République face au curé. En 1914, elles sont plus nombreuses que les instituteurs dans le primaire public.
- Leur salaire reste longtemps inférieur à celui des hommes.

## Repères à retenir
| Repère | Date |
| Première bachelière (Julie-Victoire Daubié) | 1861 |
| Écoles normales d’institutrices dans chaque département | 1879 |
| Loi Camille Sée | 1880 |
| Lois Ferry | 1881-1882 |
| Programmes identiques filles et garçons dans le secondaire | 1924 |`,
          },
          questions: [
            ['Qui dirige le Nouveau dictionnaire de pédagogie ?', ['Jules Ferry', 'Ferdinand Buisson', 'Camille Sée', 'Paul Bert'], 1, 'Ferdinand Buisson, directeur de l’enseignement primaire, est un grand artisan de l’école laïque.'],
            ['Que crée la loi Camille Sée de 1880 ?', ['L’école primaire obligatoire', 'Le droit de vote des femmes', 'L’enseignement secondaire public pour les jeunes filles', 'Les universités'], 2, 'Elle ouvre des collèges et lycées publics de jeunes filles.'],
            ['Pourquoi les républicains veulent-ils instruire les filles ?', ['Pour qu’elles deviennent soldats', 'Pour qu’elles votent', 'Pour les éloigner de l’influence de l’Église et former des mères républicaines', 'Pour qu’elles apprennent le latin'], 2, 'Les républicains veulent que les futures mères transmettent les valeurs républicaines.'],
            ['Les lois Ferry de 1881-1882 rendent l’école primaire obligatoire pour les filles comme pour les garçons.', ['Vrai', 'Faux'], 0, 'L’obligation concerne tous les enfants de 6 à 13 ans.'],
            ['Quel diplôme termine le secondaire des filles avant 1924 ?', ['Le baccalauréat', 'Le brevet des collèges', 'L’agrégation', 'Un diplôme de fin d’études'], 3, 'Sans latin ni grec, il ne donnait pas accès à l’université, contrairement au baccalauréat.'],
            ['Quelle matière est ajoutée aux programmes des filles ?', ['Les travaux d’aiguille et l’économie domestique', 'Le latin', 'L’escrime', 'La philosophie'], 0, 'Ces matières préparent au rôle d’épouse et de mère que la société de l’époque leur assigne.'],
            ['Qui est la première bachelière française, en 1861 ?', ['Marie Curie', 'Louise Michel', 'Julie-Victoire Daubié', 'George Sand'], 2, 'Julie-Victoire Daubié obtient le baccalauréat à Lyon en 1861, avant même la Troisième République.'],
            ['Que prévoit la loi Paul Bert de 1879 ?', ['Une école normale d’institutrices par département', 'Le droit de vote des institutrices', 'La fermeture des écoles religieuses', 'Le baccalauréat pour les filles'], 0, 'Ces écoles forment les institutrices qui enseigneront dans les écoles de filles.'],
            ['Quelle école forme les professeures des lycées de jeunes filles ?', ['L’École polytechnique', 'L’École normale supérieure de Sèvres', 'Saint-Cyr', 'La Sorbonne'], 1, 'Créée en 1881, l’ENS de Sèvres forme les enseignantes du secondaire féminin.'],
            ['En quelle année les programmes du secondaire deviennent-ils identiques pour filles et garçons ?', ['1882', '1905', '1944', '1924'], 3, 'La réforme Bérard de 1924 aligne les programmes et ouvre aux filles la préparation du baccalauréat.'],
            ['Avant 1914, les institutrices sont payées autant que les instituteurs.', ['Vrai', 'Faux'], 1, 'Leur salaire est longtemps inférieur, signe d’une égalité encore incomplète.'],
            ['Quel rôle joue l’institutrice dans un village de la Troisième République ?', ['Elle représente l’Église', 'Elle incarne la République et enseigne la morale laïque', 'Elle dirige la mairie', 'Elle est élue députée'], 1, 'Comme l’instituteur, elle diffuse les valeurs républicaines, souvent face à l’influence du curé.'],
          ],
        },
        {
          titre: 'Vivre à Alger au début du XXe siècle',
          axe: T3,
          rayon: H,
          lecon: {
            titre: 'Alger, une ville coloniale partagée et séparée',
            cours: `Au début du XXe siècle, **Alger** est la préfecture du **département d’Alger** : l’Algérie, conquise à partir de **1830**, est découpée depuis **1848** en trois départements français (Alger, Oran, Constantine). Étudier la vie à Alger, c’est comprendre le fonctionnement d’une **société coloniale**.

## Des populations diverses et inégales
Vers **1906**, l’agglomération compte environ **150 000 habitants**, dont une majorité d’**Européens**.
| Groupe | Qui ? | Statut |
| **Français d’origine** | Fonctionnaires, militaires, colons, commerçants | Citoyens français |
| **Européens naturalisés** | Espagnols, Italiens, Maltais, naturalisés par la **loi de 1889** | Citoyens français |
| **Juifs d’Algérie** | Présents depuis des siècles | Citoyens français depuis le **décret Crémieux (1870)** |
| **« Indigènes » musulmans** | Algériens arabes et berbères | **Sujets** français, soumis au **code de l’indigénat** ; pas de droits politiques |

> La société coloniale repose sur l’inégalité des statuts : on y vit côte à côte, mais pas avec les mêmes droits.

Au tournant du siècle, Alger connaît aussi de violentes **émeutes antisémites** (1897-1898) : l’antisémitisme est fort chez une partie des Européens.

## Une ville coupée en deux
**Le croquis en mots.** Sur la baie d’Alger, face à la Méditerranée, la ville s’étage sur une colline :
- En hauteur, la **Casbah**, la vieille ville ottomane : ruelles étroites, maisons blanches à terrasses, mosquées ; elle est surtout habitée par les Algériens musulmans et une partie des Juifs.
- En contrebas, le long de la mer, la **ville européenne** : boulevards à arcades comme le **front de mer** (boulevard de la République), places, immeubles haussmanniens, et au sud les quartiers neufs de **Mustapha** et les villas des hauteurs.
- Le **port**, relié à Marseille par des lignes régulières, et la gare structurent la ville basse.

## Architecture, urbanisme et toponymie
- Les Français ont détruit une partie de la ville basse ottomane pour percer des places (**place du Gouvernement**) et des rues droites (rue Bab-Azoun, rue de la Lyre).
- Au début du XXe siècle, le style **néo-mauresque**, voulu par le gouverneur **Charles Jonnart**, orne les bâtiments officiels : la **Grande Poste** (1910), la préfecture.
- La **toponymie** marque la domination : rues et places portent des noms de victoires et de généraux français (rue d’Isly, du nom d’une bataille de 1844 ; place Bugeaud).

## Des relations entre habitants
Les groupes se croisent au marché, au port, dans le travail (domestiques, dockers, porteurs), mais se mélangent peu : écoles, quartiers, mariages et droits restent séparés. Une petite élite algérienne instruite en français, les « **Jeunes Algériens** », commence avant 1914 à réclamer l’égalité des droits.

## Repères à retenir
| Repère | Date |
| Prise d’Alger | 1830 |
| Création des départements algériens | 1848 |
| Décret Crémieux | 1870 |
| Loi sur la naturalisation des Européens | 1889 |
| Grande Poste d’Alger | 1910 |`,
          },
          questions: [
            ['Depuis quand l’Algérie est-elle conquise par la France ?', ['1830', '1848', '1870', '1905'], 0, 'La prise d’Alger, en juillet 1830, ouvre une longue conquête.'],
            ['Quel est le statut administratif d’Alger au début du XXe siècle ?', ['Un protectorat', 'Une colonie à part', 'La préfecture d’un département français', 'Un État indépendant'], 2, 'L’Algérie est divisée en trois départements depuis 1848 : Alger, Oran, Constantine.'],
            ['Que fait le décret Crémieux de 1870 ?', ['Il abolit l’esclavage', 'Il donne la citoyenneté française aux Juifs d’Algérie', 'Il crée le code de l’indigénat', 'Il sépare les Églises et l’État'], 1, 'Les Juifs d’Algérie deviennent citoyens français, contrairement aux Algériens musulmans.'],
            ['Quel est le statut des Algériens musulmans ?', ['Citoyens français', 'Étrangers', 'Européens naturalisés', 'Sujets français sans droits politiques'], 3, 'Soumis au code de l’indigénat, ils ne votent pas aux élections nationales.'],
            ['Comment appelle-t-on la vieille ville ottomane d’Alger ?', ['La Casbah', 'Mustapha', 'Bab-el-Oued', 'Le front de mer'], 0, 'Perchée sur la colline, elle est faite de ruelles étroites et de maisons à terrasses.'],
            ['La loi de 1889 naturalise les enfants d’Européens nés en Algérie (Espagnols, Italiens, Maltais).', ['Vrai', 'Faux'], 0, 'Cette loi fait des Européens d’origine étrangère des citoyens français et renforce la population européenne.'],
            ['Où se trouve la ville européenne d’Alger ?', ['Dans la Casbah', 'Dans le désert', 'Dans la ville basse, le long de la mer', 'Sur une île'], 2, 'Boulevards à arcades, places et immeubles de style parisien bordent le front de mer.'],
            ['Quel style architectural le gouverneur Jonnart encourage-t-il ?', ['Le style gothique', 'Le style néo-mauresque', 'Le style Art déco', 'Le style roman'], 1, 'Ce style mêle décor d’inspiration arabe et techniques européennes, comme à la Grande Poste (1910).'],
            ['Que montre la toponymie des rues d’Alger coloniale ?', ['L’égalité entre habitants', 'L’influence ottomane', 'La domination française', 'L’indépendance de l’Algérie'], 2, 'Les rues et places portent des noms de généraux et d’hommes politiques français.'],
            ['Quelle ville est reliée à Alger par des lignes maritimes régulières ?', ['Marseille', 'Londres', 'Rome', 'Tunis seulement'], 0, 'Le port d’Alger vit des échanges avec la métropole, surtout Marseille.'],
            ['Dans l’Alger coloniale, toutes les populations ont les mêmes droits.', ['Vrai', 'Faux'], 1, 'La société coloniale est fondée sur l’inégalité des statuts entre citoyens et sujets.'],
            ['Que réclament les « Jeunes Algériens » avant 1914 ?', ['L’annexion au Maroc', 'Le départ immédiat de tous les Européens', 'Le retour des Ottomans', 'L’égalité des droits'], 3, 'Cette petite élite formée à l’école française demande l’égalité au sein de la République.'],
          ],
        },

        // ===================================================================
        // HISTOIRE — Thème 4
        // ===================================================================
        {
          titre: 'La Première Guerre mondiale bouleverse les sociétés et l’ordre européen',
          axe: T4,
          rayon: H,
          lecon: {
            titre: 'Une guerre totale qui fait tomber les empires',
            cours: `De **1914 à 1918**, la Première Guerre mondiale mobilise des millions d’hommes, fait près de **10 millions de morts militaires** et fait disparaître quatre empires. Ce chapitre présente les caractéristiques de cette guerre, la fin des empires et la difficile construction de la paix.

## Une guerre longue, sur plusieurs fronts
Après l’assassinat de l’archiduc **François-Ferdinand** à **Sarajevo** (28 juin 1914), le jeu des alliances entraîne l’Europe dans la guerre (fin juillet-début août 1914).
| Camp | Pays principaux |
| **Triple-Entente** (Alliés) | France, Royaume-Uni, Russie, puis Italie (1915), États-Unis (1917) |
| **Puissances centrales** | Allemagne, **Autriche-Hongrie**, Empire ottoman (1914), Bulgarie (1915) |

1. **1914 : guerre de mouvement**. Les Allemands envahissent la Belgique ; ils sont arrêtés sur la **Marne** (septembre).
2. **1915-1917 : guerre de position**. Les soldats s’enterrent dans les **tranchées** du front Ouest, de la mer du Nord à la Suisse. Batailles de **Verdun** (1916) et de la **Somme** (1916).
3. Autres fronts : front de l’Est (Russie), Balkans, Italie, Dardanelles, Proche-Orient, colonies d’Afrique, guerre sous-marine.
4. **1918 : retour du mouvement**. La Russie bolchevique signe la paix de Brest-Litovsk ; l’Allemagne signe l’**armistice le 11 novembre 1918**.

## Une guerre industrielle et mondiale
- **Mobilisation** totale : usines d’armement, femmes au travail, emprunts, propagande. Armes nouvelles : artillerie lourde, gaz (1915), chars, avions.
- Les **empires coloniaux** envoient soldats et travailleurs : environ 600 000 soldats coloniaux pour la France, plus d’un million de soldats venus de l’Inde pour le Royaume-Uni.
- L’entrée en guerre des **États-Unis** (avril 1917) montre la mondialisation du conflit.

## Une guerre meurtrière pour les combattants et les civils
- Environ **1,4 million** de soldats français tués.
- Les civils souffrent : occupation, bombardements, déportations.
- En **1915-1916**, le gouvernement **jeune-turc** de l’Empire ottoman organise le **génocide des Arméniens** : massacres et déportations font environ **1,2 million de morts**, soit les deux tiers des Arméniens de l’empire.

> Un **génocide** est l’extermination organisée d’un peuple parce qu’il est ce peuple. Le génocide arménien est le premier du XXe siècle.

## Les traités de paix et la fin des empires
La conférence de la paix s’ouvre à **Paris en janvier 1919**. Le président américain **Wilson** défend le **droit des peuples à disposer d’eux-mêmes** (Quatorze Points).
| Traité | Date | Pays vaincu |
| **Versailles** | 28 juin 1919 | Allemagne : perd l’Alsace-Moselle, ses colonies ; responsable de la guerre ; réparations |
| **Saint-Germain-en-Laye** | 10 septembre 1919 | Autriche |
| **Trianon** | 4 juin 1920 | Hongrie |
| **Sèvres** | 10 août 1920 | Empire ottoman |

Quatre **empires multinationaux** disparaissent : allemand, austro-hongrois, russe, ottoman. De nouveaux États naissent (Pologne, Tchécoslovaquie, Yougoslavie). La **Société des Nations (SDN)** est créée pour préserver la paix. Mais l’Allemagne vit Versailles comme un « **diktat** ».

## Repères à retenir
| Repère | Date |
| Attentat de Sarajevo | 28 juin 1914 |
| Verdun | février-décembre 1916 |
| Génocide arménien | 1915-1916 |
| Entrée en guerre des États-Unis | avril 1917 |
| Armistice | 11 novembre 1918 |
| Traité de Versailles | 28 juin 1919 |

**Notions** : empire multinational, mobilisation, front, génocide, traité, diplomatie.`,
          },
          questions: [
            ['Quel événement déclenche la crise de l’été 1914 ?', ['L’invasion de la Pologne', 'L’assassinat de l’archiduc François-Ferdinand à Sarajevo', 'La révolution russe', 'Le naufrage du Lusitania'], 1, 'L’attentat du 28 juin 1914 entraîne, par le jeu des alliances, l’entrée en guerre des puissances européennes.'],
            ['Quels pays forment la Triple-Entente en 1914 ?', ['Allemagne, Autriche-Hongrie, Italie', 'France, Royaume-Uni, États-Unis', 'France, Royaume-Uni, Russie', 'Russie, Empire ottoman, Bulgarie'], 2, 'L’Italie rejoint les Alliés en 1915 et les États-Unis en 1917.'],
            ['Comment appelle-t-on la guerre menée dans les tranchées de 1915 à 1917 ?', ['La guerre de position', 'La guerre de mouvement', 'La guerre éclair', 'La guerre froide'], 0, 'Les armées s’enterrent face à face, et chaque offensive coûte des centaines de milliers de vies pour quelques kilomètres.'],
            ['Pourquoi parle-t-on d’une guerre mondiale ?', ['Parce qu’elle ne touche que l’Europe', 'Parce qu’elle dure un an', 'Parce que seuls les soldats y participent', 'Parce qu’elle mobilise les empires coloniaux et des pays de tous les continents'], 3, 'Soldats coloniaux, travailleurs chinois, entrée en guerre des États-Unis et du Japon : le conflit est mondial.'],
            ['Quel peuple est victime d’un génocide en 1915-1916 ?', ['Les Arméniens', 'Les Serbes', 'Les Polonais', 'Les Grecs'], 0, 'Le gouvernement jeune-turc organise massacres et déportations : environ 1,2 million de morts.'],
            ['Quand est signé l’armistice ?', ['Le 28 juin 1919', 'Le 11 novembre 1918', 'Le 8 mai 1945', 'Le 1er août 1914'], 1, 'L’armistice de Rethondes met fin aux combats sur le front Ouest.'],
            ['Environ 1,4 million de soldats français sont morts pendant la guerre.', ['Vrai', 'Faux'], 0, 'C’est environ un homme mobilisé sur six, une saignée qui marque durablement la France.'],
            ['Quel président américain défend le droit des peuples à disposer d’eux-mêmes ?', ['Roosevelt', 'Lincoln', 'Wilson', 'Truman'], 2, 'Ses Quatorze Points (janvier 1918) guident en partie les traités de paix.'],
            ['Quel traité est imposé à l’Allemagne ?', ['Le traité de Saint-Germain', 'Le traité de Sèvres', 'Le traité de Trianon', 'Le traité de Versailles'], 3, 'Signé le 28 juin 1919, il lui retire l’Alsace-Moselle et ses colonies et lui impose des réparations.'],
            ['Quels empires disparaissent à la suite de la guerre ?', ['Britannique et français', 'Allemand, austro-hongrois, russe et ottoman', 'Japonais et chinois', 'Espagnol et portugais'], 1, 'Les empires multinationaux vaincus ou effondrés laissent place à de nouveaux États.'],
            ['Quelle organisation est créée en 1919 pour préserver la paix ?', ['L’ONU', 'L’OTAN', 'La Société des Nations', 'L’Union européenne'], 2, 'La SDN, installée à Genève, doit régler les conflits par la négociation.'],
            ['Les Allemands considèrent le traité de Versailles comme une paix juste.', ['Vrai', 'Faux'], 1, 'Ils le vivent comme un « diktat », une paix imposée et humiliante.'],
          ],
        },
        {
          titre: 'Juillet-novembre 1916 : la bataille de la Somme',
          axe: T4,
          rayon: H,
          lecon: {
            titre: 'La Somme, l’offensive de toute l’Entente',
            cours: `Du **1er juillet au 18 novembre 1916**, Britanniques et Français lancent sur la **Somme**, en Picardie, la plus grande offensive alliée de l’année. Elle montre le fonctionnement de la **Triple-Entente**, l’**échelle mondiale** de la guerre et le coût humain terrible de la guerre de position.

## Pourquoi une offensive sur la Somme ?
1. Fin **1915**, à la conférence de **Chantilly**, les Alliés décident d’attaquer ensemble en 1916 sur tous les fronts (Ouest, Est, Italie).
2. Le lieu est choisi parce que les armées **britannique** et **française** s’y rejoignent.
3. L’offensive allemande sur **Verdun** (février 1916) oblige la France à y engager une grande partie de ses forces : les **Britanniques** fournissent l’essentiel de l’effort sur la Somme, qui doit aussi soulager Verdun.

> La Somme est d’abord une bataille de coalition : elle montre que l’Entente coordonne ses efforts.

## Une armée venue du monde entier
| Participants | Origine |
| Armée britannique (général **Haig**) | Royaume-Uni, mais aussi **Canadiens**, **Terre-Neuviens**, **Australiens**, **Néo-Zélandais**, **Sud-Africains**, soldats de l’**Inde** |
| Armée française (général **Foch**) | Métropolitains, **tirailleurs sénégalais**, soldats d’Afrique du Nord |
| Main-d’œuvre de l’arrière | **Travailleurs chinois** recrutés par les Britanniques et les Français à partir de 1916-1917, travailleurs coloniaux |

## Une guerre d’innovations techniques
- **Artillerie** : une semaine de bombardement (environ 1,5 million d’obus) doit détruire les défenses allemandes ; beaucoup de barbelés et d’abris résistent.
- **Premiers chars d’assaut** : les *tanks* britanniques entrent en action le **15 septembre 1916** à Flers-Courcelette.
- **Aviation d’observation** : avions et ballons photographient les lignes et règlent les tirs d’artillerie ; les premiers combats aériens se multiplient.

## Un coût humain immense
- Le **1er juillet 1916** reste le jour le plus meurtrier de l’histoire de l’armée britannique : près de **20 000 morts** et 57 000 soldats hors de combat en une journée.
- Au total, la bataille fait plus de **1 million** de tués, blessés et disparus pour les trois armées.
- Pour une avancée d’une dizaine de kilomètres seulement.

## Traces et lieux de mémoire
**Le croquis en mots.** Dans la Somme, entre **Albert** et **Péronne**, le front coupe la vallée de la Somme. Aujourd’hui, le paysage garde les traces des combats : cratère de **Lochnagar** à La Boisselle, **mémorial de Thiepval** (plus de 72 000 noms de soldats britanniques et sud-africains disparus), parc de **Beaumont-Hamel** (Terre-Neuve), mémorial sud-africain de **Longueval**, australien de Pozières, cimetières militaires, et l’**Historial de la Grande Guerre** à Péronne.

## Repères à retenir
| Repère | Date |
| Conférence de Chantilly | décembre 1915 |
| Début de Verdun | 21 février 1916 |
| Début de la Somme | 1er juillet 1916 |
| Premiers chars britanniques | 15 septembre 1916 |
| Fin de la bataille | 18 novembre 1916 |`,
          },
          questions: [
            ['Dans quelle région se déroule la bataille de la Somme ?', ['En Lorraine', 'En Picardie', 'En Alsace', 'En Champagne'], 1, 'La Somme est un fleuve et un département de Picardie, où se rejoignaient les armées britannique et française.'],
            ['Quand commence la bataille de la Somme ?', ['Le 21 février 1916', 'Le 11 novembre 1918', 'Le 1er juillet 1916', 'Le 6 septembre 1914'], 2, 'L’offensive commence le 1er juillet 1916, après une semaine de bombardement.'],
            ['Quelle armée fournit l’essentiel de l’effort sur la Somme ?', ['L’armée allemande', 'L’armée américaine', 'L’armée russe', 'L’armée britannique'], 3, 'La France étant engagée à Verdun, les Britanniques portent la plus grande part de l’offensive.'],
            ['Quelle décision alliée prépare l’offensive de la Somme ?', ['La conférence de Chantilly (1915)', 'Le traité de Versailles', 'Le congrès de Vienne', 'L’armistice de Rethondes'], 0, 'Les Alliés y décident d’attaquer ensemble en 1916 sur plusieurs fronts.'],
            ['Quelle innovation apparaît pour la première fois sur la Somme, en septembre 1916 ?', ['Le gaz de combat', 'Le char d’assaut', 'La mitrailleuse', 'Le sous-marin'], 1, 'Les tanks britanniques attaquent à Flers-Courcelette le 15 septembre 1916.'],
            ['Des soldats de tout l’Empire britannique ont combattu sur la Somme.', ['Vrai', 'Faux'], 0, 'Canadiens, Terre-Neuviens, Australiens, Néo-Zélandais, Sud-Africains et Indiens y ont combattu.'],
            ['À quoi sert l’aviation pendant la bataille ?', ['À bombarder Berlin', 'À transporter les troupes', 'À observer les lignes ennemies et régler l’artillerie', 'À ravitailler les civils'], 2, 'Avions et ballons d’observation photographient les tranchées et guident les tirs.'],
            ['Combien de soldats britanniques meurent le 1er juillet 1916 ?', ['Environ 200', 'Près de 20 000', 'Environ 1 million', 'Environ 2 000'], 1, 'C’est la journée la plus meurtrière de l’histoire de l’armée britannique.'],
            ['Quel est le bilan total approximatif de la bataille ?', ['Environ 10 000 victimes', 'Aucune perte grâce aux chars', 'Plus d’un million de tués, blessés et disparus', 'Environ 50 000 victimes'], 2, 'Pour une avancée d’une dizaine de kilomètres, les pertes dépassent le million pour les trois armées.'],
            ['Quel monument porte les noms de plus de 72 000 soldats disparus ?', ['Le mémorial de Thiepval', 'L’ossuaire de Douaumont', 'L’Arc de Triomphe', 'Le mémorial de Caen'], 0, 'Il honore les soldats britanniques et sud-africains disparus sans sépulture connue.'],
            ['Des travailleurs chinois ont été recrutés par les Alliés pendant la guerre.', ['Vrai', 'Faux'], 0, 'Ils travaillent à l’arrière du front (ports, routes, dépôts) : un signe de l’échelle mondiale de la guerre.'],
            ['Quelle bataille allemande de 1916 explique que la France engage moins de forces sur la Somme ?', ['La Marne', 'Waterloo', 'Sedan', 'Verdun'], 3, 'Commencée le 21 février 1916, Verdun absorbe une grande partie de l’armée française.'],
          ],
        },
        {
          titre: 'L’Autriche-Hongrie de 1914 au traité de Saint-Germain',
          axe: T4,
          rayon: H,
          lecon: {
            titre: 'La double monarchie, de la guerre à la dislocation',
            cours: `L’**Autriche-Hongrie**, ou « **double monarchie** », est en 1914 un empire de plus de **50 millions** d’habitants qui rassemble une dizaine de **nationalités**. Elle joue un rôle décisif dans le déclenchement de la guerre, et sa défaite entraîne sa **dislocation**.

## Un empire multinational
Depuis le **compromis de 1867**, l’empire est formé de deux États (Autriche et Hongrie) réunis sous un même souverain, l’empereur **François-Joseph** (règne de 1848 à 1916).
| Nationalités | Exemples |
| Germaniques | Allemands d’Autriche |
| Magyars | Hongrois |
| Slaves du Nord | Tchèques, Slovaques, Polonais, Ukrainiens (Ruthènes) |
| Slaves du Sud | Croates, Slovènes, Serbes, Bosniaques |
| Latins | Roumains, Italiens |

> Aucune nationalité n’est majoritaire : l’empire tient par la dynastie des **Habsbourg**, l’armée et l’administration.

## Un rôle décisif dans le déclenchement de la guerre
- En **1908**, l’Autriche-Hongrie annexe la **Bosnie-Herzégovine**, ce qui irrite la **Serbie** et la Russie.
- Le **28 juin 1914**, l’héritier du trône, l’archiduc **François-Ferdinand**, est assassiné à **Sarajevo** par **Gavrilo Princip**, un nationaliste serbe de Bosnie.
- Soutenue par l’Allemagne, l’Autriche-Hongrie adresse un **ultimatum** à la Serbie, puis lui déclare la guerre le **28 juillet 1914**. Le jeu des alliances fait le reste.

## Une guerre qui épuise l’empire
- L’armée austro-hongroise combat sur trois fronts : **Serbie**, **Russie** (Galicie), et **Italie** à partir de 1915 (batailles de l’Isonzo, de **Caporetto** en 1917, de **Vittorio Veneto** en 1918).
- Les défaites, les pertes et la **famine** à Vienne affaiblissent le pays. **François-Joseph** meurt en 1916 ; **Charles Ier** lui succède et cherche en vain une paix séparée.
- Des soldats tchèques et slovaques désertent et forment des légions aux côtés des Alliés.

## La dislocation (octobre-novembre 1918)
Les nationalités proclament leur indépendance : **Tchécoslovaquie** (28 octobre 1918), **État des Slovènes, Croates et Serbes** (29 octobre), bientôt uni à la Serbie dans le futur **royaume des Serbes, Croates et Slovènes**, **Pologne** reconstituée. L’armistice est signé à **Villa Giusti** le **3 novembre 1918** ; la république est proclamée à Vienne le 12 novembre.

## Le traité de Saint-Germain-en-Laye (10 septembre 1919)
- L’**Autriche**, réduite à environ 6,5 millions d’habitants, reconnaît l’indépendance des nouveaux États.
- Elle cède le **Tyrol du Sud** et Trieste à l’Italie, la Galicie à la Pologne, la Bohême et la Moravie à la Tchécoslovaquie.
- Il lui est **interdit de s’unir à l’Allemagne** (Anschluss).
- La Hongrie, elle, perd environ les deux tiers de son territoire au **traité de Trianon** (1920).

## Le croquis en mots
Sur une carte de l’Europe centrale en 1914, un grand ensemble autour du **Danube**, de Prague à Sarajevo et de Trieste à la Galicie. Sur la carte de 1920, cet espace éclate en petits États : Autriche, Hongrie, Tchécoslovaquie, Yougoslavie, et des territoires passés à la Pologne, à la Roumanie (Transylvanie) et à l’Italie. Dans chacun vivent des **minorités** : les frontières ne suivent pas les peuples, et la région reste une **zone de tension**.

## Repères à retenir
| Repère | Date |
| Compromis austro-hongrois | 1867 |
| Annexion de la Bosnie-Herzégovine | 1908 |
| Attentat de Sarajevo | 28 juin 1914 |
| Mort de François-Joseph | 1916 |
| Indépendance tchécoslovaque | 28 octobre 1918 |
| Traité de Saint-Germain | 10 septembre 1919 |`,
          },
          questions: [
            ['Pourquoi appelle-t-on l’Autriche-Hongrie la « double monarchie » ?', ['Parce qu’elle a deux empereurs', 'Parce que deux États sont réunis sous un même souverain', 'Parce qu’elle a deux capitales en guerre', 'Parce qu’elle est alliée à deux pays'], 1, 'Depuis le compromis de 1867, l’Autriche et la Hongrie partagent le même souverain, François-Joseph.'],
            ['Qu’est-ce qu’un empire multinational ?', ['Un empire composé de plusieurs nationalités', 'Un empire commercial', 'Une alliance de pays', 'Une république fédérale'], 0, 'L’Autriche-Hongrie rassemble une dizaine de peuples, sans majorité nationale.'],
            ['Qui assassine l’archiduc François-Ferdinand à Sarajevo ?', ['Un anarchiste français', 'Un soldat russe', 'Gavrilo Princip, nationaliste serbe de Bosnie', 'Un espion allemand'], 2, 'Princip appartient à un groupe qui veut unir les Slaves du Sud autour de la Serbie.'],
            ['À quel pays l’Autriche-Hongrie déclare-t-elle la guerre le 28 juillet 1914 ?', ['À la Serbie', 'À la France', 'À la Russie', 'À l’Italie'], 0, 'Après un ultimatum jugé inacceptable par Belgrade, la guerre commence ; les alliances font le reste.'],
            ['Quel territoire l’Autriche-Hongrie annexe-t-elle en 1908 ?', ['La Galicie', 'La Bohême', 'Le Tyrol', 'La Bosnie-Herzégovine'], 3, 'Cette annexion attise la rivalité avec la Serbie et la Russie.'],
            ['Quel empereur règne de 1848 à 1916 ?', ['Guillaume II', 'François-Joseph', 'Charles Ier', 'Nicolas II'], 1, 'Son très long règne incarne l’unité de l’empire ; sa mort en 1916 l’affaiblit encore.'],
            ['L’Autriche-Hongrie combat aussi contre l’Italie à partir de 1915.', ['Vrai', 'Faux'], 0, 'Entrée en guerre aux côtés de l’Entente, l’Italie ouvre un front dans les Alpes et sur l’Isonzo.'],
            ['Quel État proclame son indépendance le 28 octobre 1918 ?', ['La Hongrie', 'L’Autriche', 'La Tchécoslovaquie', 'La Roumanie'], 2, 'Tchèques et Slovaques fondent un État commun, dirigé par Masaryk.'],
            ['Quel traité règle le sort de l’Autriche en 1919 ?', ['Le traité de Versailles', 'Le traité de Trianon', 'Le traité de Sèvres', 'Le traité de Saint-Germain-en-Laye'], 3, 'Signé le 10 septembre 1919, il réduit l’Autriche à un petit État.'],
            ['Que le traité de Saint-Germain interdit-il à l’Autriche ?', ['D’avoir une armée', 'De s’unir à l’Allemagne', 'D’avoir une capitale', 'De commercer'], 1, 'L’Anschluss est interdit : les vainqueurs ne veulent pas renforcer l’Allemagne.'],
            ['Les nouvelles frontières de 1919-1920 correspondent exactement aux peuples.', ['Vrai', 'Faux'], 1, 'Chaque nouvel État compte des minorités : l’Europe centrale reste une zone de tension.'],
            ['Quelle part de son territoire la Hongrie perd-elle au traité de Trianon ?', ['Environ un dixième', 'La moitié', 'Aucune', 'Environ les deux tiers'], 3, 'Au traité de Trianon (1920), elle perd notamment la Slovaquie, la Croatie et la Transylvanie.'],
          ],
        },

        // ===================================================================
        // GÉOGRAPHIE — Thème 1
        // ===================================================================
        {
          titre: 'Les villes à l’échelle mondiale : le poids croissant des métropoles et des mégalopoles',
          axe: G1,
          rayon: G,
          lecon: {
            titre: 'Un monde de villes, dominé par les métropoles',
            cours: `Depuis **2007**, plus de la moitié de l’humanité vit en ville ; en **2025**, c’est environ **58 %** des habitants de la planète. Cette **urbanisation** s’accompagne d’un processus de **métropolisation** : les plus grandes villes concentrent les habitants, les activités et le pouvoir.

## Les notions à maîtriser
| Notion | Définition |
| **Ville** | Espace de forte densité de population et de bâti, où dominent les activités non agricoles |
| **Agglomération urbaine** | Ville-centre et banlieues formant un espace bâti continu |
| **Métropole** | Grande ville qui concentre des **fonctions de commandement** (politique, économique, culturel) et rayonne au-delà de sa région |
| **Métropolisation** | Concentration croissante des populations, activités et fonctions de commandement dans les métropoles |
| **Centre-périphérie** | Modèle où un centre qui domine s’oppose à des périphéries qui dépendent de lui |

## Les caractéristiques d’une métropole
1. Un **quartier d’affaires** (CBD) : sièges sociaux, banques, bourse — La Défense, la City, Manhattan.
2. Des **équipements culturels** de premier plan : musées, universités, stades.
3. Des **nœuds de transport** majeurs : aéroport international, port, gares à grande vitesse.
4. Des institutions de **recherche** et d’**innovation**.

> La métropole ne se mesure pas seulement à sa taille : c’est son **pouvoir** et son **rayonnement** qui comptent. Lagos est plus peuplée que Zurich, mais Zurich commande davantage l’économie mondiale.

## Des métropoles très inégales
| Rang | Exemples | Rayonnement |
| **Mondial** | New York, Londres, Tokyo, Paris | Commandent l’économie et la culture mondiales |
| **National ou continental** | Lyon, Madrid, São Paulo, Mumbai | Dominent un pays ou une grande région du monde |
| **Régional** | Rennes, Montpellier | Rayonnent sur une région |

Les métropoles sont en **concurrence** pour attirer entreprises, touristes, étudiants et grands événements (Jeux olympiques, expositions universelles).
Il existe aussi de nombreuses **mégapoles** (plus de 10 millions d’habitants) dans les pays émergents et en développement (Delhi, Shanghai, Dacca, Le Caire), où la croissance urbaine est la plus rapide et où une part importante des habitants vit dans des quartiers informels (**bidonvilles**).

## Les mégalopoles
Une **mégalopole** est un chapelet de métropoles reliées entre elles, qui concentre population et richesse :
- la **Mégalopolis** du Nord-Est des États-Unis, de Boston à Washington ;
- la **mégalopole japonaise**, de Tokyo à Fukuoka ;
- la **mégalopole européenne**, de Londres à Milan (la « dorsale »).

## Le croquis en mots
Sur un planisphère, trois grandes taches marquent les mégalopoles des pays riches (Nord-Est des États-Unis, Europe de Londres à Milan, Japon). Les métropoles mondiales y sont concentrées et reliées par des flux aériens et financiers épais. Ailleurs, des points rouges signalent les mégapoles d’Asie, d’Afrique et d’Amérique latine, à la croissance rapide mais au rayonnement souvent plus faible.

## Repères à retenir
| Repère | Chiffre |
| Population urbaine mondiale | environ 58 % (2025) |
| Moitié de l’humanité en ville | depuis 2007 |
| Plus grande agglomération (selon l’ONU, 2025) | Jakarta, devant Dacca et Tokyo |`,
          },
          questions: [
            ['Depuis quand plus de la moitié de l’humanité vit-elle en ville ?', ['Depuis 1950', 'Depuis 1990', 'Depuis 2007', 'Depuis 2020'], 2, 'L’ONU estime que la barre des 50 % a été franchie en 2007.'],
            ['Qu’est-ce que la métropolisation ?', ['L’étalement des villes à la campagne', 'La concentration des populations, activités et fonctions de commandement dans les grandes villes', 'La construction de métros', 'Le déclin des villes'], 1, 'La métropolisation renforce le poids des plus grandes villes, qui concentrent le pouvoir.'],
            ['Qu’est-ce qui distingue une métropole d’une simple grande ville ?', ['Ses fonctions de commandement et son rayonnement', 'Sa superficie', 'Son climat', 'Son âge'], 0, 'Une métropole domine un territoire par ses fonctions politiques, économiques et culturelles.'],
            ['Quel est un exemple de quartier d’affaires ?', ['La Casbah d’Alger', 'Le Marais', 'Un bidonville', 'La Défense'], 3, 'La Défense, près de Paris, concentre sièges sociaux et tours de bureaux.'],
            ['Quelle ville est une métropole de rang mondial ?', ['Rennes', 'Londres', 'Montpellier', 'Clermont-Ferrand'], 1, 'Londres commande l’économie et la finance mondiales, comme New York, Tokyo ou Paris.'],
            ['Une mégapole est forcément une métropole mondiale.', ['Vrai', 'Faux'], 1, 'Une mégapole est définie par sa taille (plus de 10 millions d’habitants) ; beaucoup ont un rayonnement mondial limité.'],
            ['Qu’est-ce qu’une mégalopole ?', ['Une ville de plus de 10 millions d’habitants', 'Un chapelet de métropoles reliées entre elles', 'Un bidonville géant', 'Un quartier d’affaires'], 1, 'La Mégalopolis américaine relie Boston, New York, Philadelphie, Baltimore et Washington.'],
            ['Où se trouve la mégalopole européenne ?', ['De Madrid à Varsovie', 'De Paris à Moscou', 'De Londres à Milan', 'De Lisbonne à Rome'], 2, 'Cette « dorsale » passe par le Benelux et la vallée du Rhin.'],
            ['Dans quelles régions du monde la croissance urbaine est-elle la plus rapide ?', ['En Afrique et en Asie', 'En Europe de l’Ouest', 'En Amérique du Nord', 'Au Japon'], 0, 'Les pays en développement et émergents connaissent la croissance urbaine la plus forte, avec souvent des quartiers informels.'],
            ['Que désigne le modèle centre-périphérie ?', ['Un plan de ville en cercle', 'Un réseau de métro', 'La domination d’un centre sur des espaces qui en dépendent', 'L’égalité entre territoires'], 2, 'Le centre concentre richesse et pouvoir ; les périphéries en dépendent.'],
            ['Les métropoles sont en concurrence pour accueillir les Jeux olympiques ou des sièges d’entreprises.', ['Vrai', 'Faux'], 0, 'Attirer ces grands événements et ces entreprises renforce leur rayonnement.'],
            ['Qu’est-ce qu’une agglomération urbaine ?', ['Une ville sans banlieue', 'Un village', 'Une métropole mondiale', 'Une ville-centre et ses banlieues formant un bâti continu'], 3, 'L’agglomération dépasse souvent les limites de la commune-centre.'],
          ],
        },
        {
          titre: 'Lyon : les mutations d’une métropole',
          axe: G1,
          rayon: G,
          lecon: {
            titre: 'Lyon, une métropole qui s’affirme et se transforme',
            cours: `Troisième aire d’attraction de France (environ **2,3 millions** d’habitants), **Lyon** s’affirme comme une métropole de rang **européen**. Cette affirmation s’accompagne de multiples **recompositions** à l’échelle locale, et de **contrastes** accrus en son sein.

## Une métropole qui s’affirme
- Depuis **2015**, la **Métropole de Lyon** est une collectivité territoriale à statut particulier (59 communes, environ 1,4 million d’habitants), qui exerce aussi les compétences du département.
- Fonctions de commandement : sièges d’entreprises, pôles de **santé** et de **biotechnologies** (Lyonbiopôle, Sanofi, bioMérieux), **Interpol**, le Centre international de recherche sur le cancer.
- Un carrefour : entre Paris et la Méditerranée, entre l’Europe du Nord et l’Italie, au confluent du **Rhône** et de la **Saône**.

## Les recompositions à l’échelle locale
| Transformation | Exemple lyonnais |
| **Transports** renforcés | Métro, tramway, gare TGV **Part-Dieu** (1983), aéroport **Saint-Exupéry** et sa gare TGV |
| **Quartier d’affaires** | **La Part-Dieu** : tours (Incity, To-Lyon), l’un des premiers pôles tertiaires de France hors Paris |
| **Grands équipements** | Musée des **Confluences** (2014), **Groupama Stadium** (2016) à Décines, Cité internationale |
| **Reconquête du front d’eau et des friches** | Quartier **Confluence** sur d’anciens terrains industriels et portuaires ; berges du Rhône aménagées en promenade |
| **Polycentrisme** | Plusieurs centres : Presqu’île, Part-Dieu, Confluence, Gerland, Vaulx-en-Velin |

> Lyon se transforme pour attirer : elle recycle ses friches industrielles, renforce ses connexions et multiplie les équipements de prestige.

## Étalement urbain et contrastes
- L’**étalement urbain** gagne les campagnes proches (Plaine de l’Ain, Isère, Beaujolais) : les **périurbains** font chaque jour la navette.
- Les **contrastes socio-spatiaux** s’accentuent : quartiers aisés de l’Ouest lyonnais et du centre rénové, **gentrification** de la Croix-Rousse ou de la Guillotière, quartiers populaires de l’Est (Vaulx-en-Velin, Vénissieux, Les Minguettes) où se concentrent chômage et logements sociaux, en partie rénovés.

## Le croquis en mots
Au centre, la **Presqu’île** entre Rhône et Saône, avec au sud le quartier de **Confluence**. À l’est du Rhône, le quartier d’affaires de la **Part-Dieu** et sa gare. Autour, le **périphérique** et les autoroutes (A6 vers Paris, A7 vers Marseille, A43 vers les Alpes). À l’est, l’aéroport **Saint-Exupéry** ; à l’est encore, les banlieues populaires ; à l’ouest, les communes aisées des Monts d’Or. Un grand ruban industriel longe le Rhône au sud : la **vallée de la chimie**.

## Repères à retenir
| Repère | Donnée |
| Création de la Métropole de Lyon | 2015 |
| Métropole de Lyon | 59 communes, environ 1,4 million d’habitants |
| Musée des Confluences | 2014 |
| Groupama Stadium | 2016 |`,
          },
          questions: [
            ['Quel statut particulier Lyon a-t-elle depuis 2015 ?', ['Capitale régionale unique', 'Métropole collectivité territoriale exerçant aussi les compétences du département', 'Ville libre', 'Département d’outre-mer'], 1, 'La Métropole de Lyon est une collectivité à statut particulier qui a remplacé le département du Rhône sur son territoire.'],
            ['Au confluent de quels cours d’eau se trouve Lyon ?', ['La Seine et la Marne', 'La Loire et l’Allier', 'Le Rhône et la Saône', 'La Garonne et la Dordogne'], 2, 'La Presqu’île s’étend entre les deux, jusqu’au confluent.'],
            ['Quel est le grand quartier d’affaires de Lyon ?', ['La Part-Dieu', 'La Croix-Rousse', 'Fourvière', 'Les Minguettes'], 0, 'Autour de la gare TGV, la Part-Dieu concentre bureaux et tours.'],
            ['Le quartier Confluence a été construit sur :', ['Des terres agricoles', 'Une forêt', 'Un ancien aéroport', 'D’anciens terrains industriels et portuaires'], 3, 'C’est un exemple de reconquête de friches et de front d’eau.'],
            ['Quel équipement culturel ouvre en 2014 à la Confluence ?', ['L’Opéra de Lyon', 'Le musée des Confluences', 'Le Louvre-Lens', 'Le Groupama Stadium'], 1, 'Ce musée de sciences et de sociétés est devenu un symbole de la métropole.'],
            ['Que signifie le fonctionnement polycentrique de Lyon ?', ['La ville a plusieurs centres d’activité', 'La ville n’a pas de centre', 'La ville est un seul quartier', 'La ville est circulaire'], 0, 'Presqu’île, Part-Dieu, Confluence, Gerland : plusieurs pôles se partagent les fonctions.'],
            ['Lyon accueille le siège d’Interpol.', ['Vrai', 'Faux'], 0, 'L’organisation internationale de police criminelle y a son siège depuis 1989.'],
            ['Qu’est-ce que l’étalement urbain ?', ['La densification du centre', 'La progression de l’urbanisation sur les espaces ruraux proches', 'La construction de tours', 'La disparition des banlieues'], 1, 'Les périurbains vivent de plus en plus loin et se déplacent chaque jour vers la métropole.'],
            ['Où se concentrent plutôt les quartiers populaires de la métropole lyonnaise ?', ['À l’ouest, dans les Monts d’Or', 'Dans la Presqu’île', 'À l’est (Vaulx-en-Velin, Vénissieux)', 'Sur la colline de Fourvière'], 2, 'Les banlieues de l’Est concentrent logements sociaux et difficultés sociales.'],
            ['Quel aéroport dessert la métropole lyonnaise ?', ['Roissy-Charles-de-Gaulle', 'Saint-Exupéry', 'Orly', 'Blagnac'], 1, 'Lyon-Saint-Exupéry, à l’est, est relié au centre par tramway express et à la ligne TGV.'],
            ['La métropolisation de Lyon a réduit tous les contrastes sociaux.', ['Vrai', 'Faux'], 1, 'Elle les a plutôt accentués : gentrification de certains quartiers, relégation d’autres.'],
            ['Comment appelle-t-on la zone industrielle qui longe le Rhône au sud de Lyon ?', ['La vallée de la chimie', 'La Silicon Valley', 'La dorsale européenne', 'La Plaine Saint-Denis'], 0, 'Raffinerie de Feyzin et usines chimiques bordent le fleuve.'],
          ],
        },
        {
          titre: 'Londres, une métropole de rang mondial',
          axe: G1,
          rayon: G,
          lecon: {
            titre: 'Londres, ville mondiale qui se réinvente',
            cours: `Avec environ **9 millions** d’habitants dans le Grand Londres et plus de **14 millions** dans sa région urbaine, **Londres** est l’une des quatre ou cinq **villes mondiales**, avec New York, Tokyo et Paris. Elle témoigne des grandes mutations liées à la métropolisation.

## Les fonctions de commandement d’une ville mondiale
| Fonction | Exemple |
| **Politique** | Capitale du Royaume-Uni, siège du Parlement et du gouvernement |
| **Financière** | La **City** (bourse, banques, assurances) et **Canary Wharf** : l’une des deux premières places financières mondiales avec New York |
| **Culturelle** | British Museum, Tate Modern, théâtres du West End, universités de rang mondial |
| **Médiatique** | BBC, grandes agences de presse |

## Une concurrence croissante entre métropoles
Londres rivalise avec New York, Paris, Francfort ou Singapour. Depuis le **Brexit** (sortie de l’UE en **2020**), certaines activités financières sont parties vers Paris, Francfort, Dublin ou Amsterdam, mais la City reste une place majeure.

## Les recompositions territoriales
1. **Les Docklands** : ces anciens docks du port, en déclin dans les années 1960-1980, sont réhabilités à partir de **1981** ; ils deviennent un quartier d’affaires (**Canary Wharf**) et résidentiel, desservi par un métro léger (DLR).
2. **Les transports** : la ligne **Elizabeth** (2022) traverse Londres d’est en ouest ; le tunnel sous la Manche et l’**Eurostar** (gare de St Pancras) relient Paris en 2 h 20 environ ; **six aéroports** internationaux, dont **Heathrow**, l’un des premiers aéroports mondiaux, et Gatwick.
3. **Les Jeux olympiques de 2012** : ils ont servi à rénover l’**Est londonien** (Stratford), ancien quartier industriel pauvre : parc olympique, centre commercial, logements, universités.
4. **Les grands équipements culturels** : la **Tate Modern** (2000) installée dans une ancienne centrale électrique, sur la rive sud de la Tamise.

> Londres montre les deux faces de la métropolisation : un rayonnement mondial et des **contrastes socio-spatiaux** croissants.

## Des contrastes socio-spatiaux accentués
- Le prix des logements chasse les classes moyennes et populaires vers la périphérie (**gentrification** de l’Est et du Sud).
- Des quartiers très riches (Kensington, Chelsea) côtoient des quartiers pauvres (Tower Hamlets, Newham), parfois à quelques centaines de mètres de Canary Wharf.
- La **ceinture verte** (Green Belt) limite l’étalement, ce qui renforce la pression immobilière.

## Le croquis en mots
La **Tamise** traverse la ville d’ouest en est. Au centre, la **City**, cœur historique de la finance, et le **West End** (pouvoir politique, commerces, théâtres). Vers l’est, les **Docklands** et Canary Wharf dans une boucle de la Tamise, puis le parc olympique de **Stratford**. Autour, une **ceinture verte**, et à la périphérie les aéroports (Heathrow à l’ouest, Gatwick au sud, Stansted au nord-est).

## Repères à retenir
| Repère | Donnée |
| Grand Londres | environ 9 millions d’habitants |
| Réhabilitation des Docklands | à partir de 1981 |
| Tate Modern | 2000 |
| Jeux olympiques | 2012 |
| Sortie de l’UE | 2020 |`,
          },
          questions: [
            ['Combien d’habitants compte environ le Grand Londres ?', ['1 million', '3 millions', '9 millions', '30 millions'], 2, 'Le Grand Londres compte près de 9 millions d’habitants, plus de 14 millions avec sa région urbaine.'],
            ['Quel quartier est le cœur historique de la finance londonienne ?', ['La City', 'Stratford', 'Chelsea', 'Heathrow'], 0, 'La City concentre banques, assurances et bourse depuis des siècles.'],
            ['Que sont devenus les Docklands ?', ['Un parc naturel', 'Un aéroport', 'Une zone agricole', 'Un quartier d’affaires et résidentiel autour de Canary Wharf'], 3, 'Réhabilités à partir de 1981, ces anciens docks portent aujourd’hui des tours de bureaux.'],
            ['Quel quartier de l’Est londonien a été rénové pour les Jeux olympiques de 2012 ?', ['Kensington', 'Stratford', 'Westminster', 'Soho'], 1, 'Le parc olympique a transformé cet ancien quartier industriel et pauvre.'],
            ['Quel est le principal aéroport de Londres ?', ['Heathrow', 'Orly', 'Schiphol', 'Stansted'], 0, 'Heathrow est l’un des aéroports les plus fréquentés du monde ; Londres en compte six internationaux.'],
            ['Le Brexit a fait perdre à la City toute son importance financière.', ['Vrai', 'Faux'], 1, 'Certaines activités sont parties vers l’UE, mais la City reste l’une des premières places financières mondiales.'],
            ['Où est installée la Tate Modern ?', ['Dans un ancien palais royal', 'Dans une ancienne centrale électrique', 'Dans une gare', 'Dans un stade'], 1, 'Ce musée d’art moderne ouvert en 2000 occupe l’ancienne centrale de Bankside.'],
            ['Quel rôle joue la ceinture verte (Green Belt) ?', ['Elle accueille les usines', 'Elle protège les quartiers d’affaires', 'Elle limite l’étalement urbain', 'Elle relie les aéroports'], 2, 'En limitant l’étalement, elle accroît aussi la pression immobilière dans l’agglomération.'],
            ['Quel train relie Londres à Paris par le tunnel sous la Manche ?', ['Le Thalys', 'L’Eurostar', 'L’ICE', 'Le Frecciarossa'], 1, 'Il part de St Pancras et relie Paris en 2 h 20 environ.'],
            ['Quelle ligne ferroviaire ouverte en 2022 traverse Londres d’est en ouest ?', ['La ligne Elizabeth', 'Le RER A', 'La ligne Victoria', 'Le DLR'], 0, 'Cette grande ligne a renforcé les connexions entre les pôles de la métropole et l’aéroport d’Heathrow.'],
            ['À Londres, des quartiers très pauvres existent à proximité immédiate de Canary Wharf.', ['Vrai', 'Faux'], 0, 'Tower Hamlets, voisin des tours de Canary Wharf, compte parmi les quartiers les plus pauvres du pays.'],
            ['Qu’est-ce que la gentrification ?', ['La construction de tours', 'La fuite des riches', 'La démolition des bidonvilles', 'L’installation de ménages aisés dans un quartier populaire, qui en chasse les habitants modestes'], 3, 'La hausse des loyers repousse les classes populaires vers la périphérie.'],
          ],
        },

        // ===================================================================
        // GÉOGRAPHIE — Thème 2
        // ===================================================================
        {
          titre: 'Métropolisation, littoralisation des espaces productifs et accroissement des flux',
          axe: G2,
          rayon: G,
          lecon: {
            titre: 'Produire en réseau : métropoles, littoraux et flux',
            cours: `À l’échelle mondiale, les **espaces productifs** — lieux où l’on crée des richesses, y compris des **services** — se multiplient, se spécialisent et s’interconnectent. Ils se concentrent surtout dans les **métropoles** et sur les **littoraux**, et la production s’organise en **chaînes de valeur** mondiales.

## Les notions à maîtriser
| Notion | Définition |
| **Espace productif** | Espace aménagé pour produire des biens ou des services (usine, port, technopole, quartier d’affaires, bassin agricole) |
| **Production** | Création de biens et de services |
| **Flux** | Déplacement de marchandises, de personnes, de capitaux ou d’informations |
| **Réseau international de production** | Ensemble de sites dans plusieurs pays reliés pour fabriquer un produit |
| **Chaîne mondiale de valeur ajoutée** | Découpage de la production en étapes (conception, fabrication, assemblage, vente), chacune réalisée là où elle rapporte le plus |

## Des espaces productifs concentrés
1. **Dans les métropoles** : elles concentrent les activités à forte **valeur ajoutée** — sièges sociaux, finance, recherche, services aux entreprises. Les **technopôles** (Silicon Valley, Saclay, Bangalore) y associent universités et entreprises innovantes.
2. **Sur les littoraux** : c’est la **littoralisation**. Environ 80 % du commerce mondial en volume passe par la mer ; les grandes zones industrialo-portuaires (**ZIP**) s’installent au bord de l’eau (Rotterdam, Shanghai, Singapour, Le Havre, Fos-sur-Mer).
3. Les espaces **peu connectés** (intérieur de l’Afrique, grandes montagnes) restent en marge.

> Les espaces productifs majeurs sont là où l’on est le mieux **connecté** : métropoles et façades maritimes.

## Une production organisée en chaîne
Exemple d’un **smartphone** :
| Étape | Lieu typique | Valeur ajoutée |
| Conception, marque, logiciel | Californie (siège de la firme) | Très forte |
| Composants de pointe | Corée du Sud, Taïwan, Japon | Forte |
| Assemblage | Chine, Inde, Vietnam | Faible |
| Vente, services | Monde entier | Forte |

Les acteurs sont les **firmes transnationales** (FTN), leurs **sous-traitants**, les États (zones franches, aides), les ports et les régions.

## Des flux toujours plus importants
- **Matériels** : les conteneurs (les ports du monde en manutentionnent environ 850 millions d’EVP par an au début des années 2020), les vracs (pétrole, minerais, céréales).
- **Immatériels** : données, capitaux, brevets, qui circulent par les câbles sous-marins et les satellites.
Les **façades maritimes** (Asie de l’Est, Northern Range européenne, Nord-Est américain) concentrent l’essentiel des échanges.

## Le croquis en mots
Sur un planisphère, trois grands pôles productifs : Amérique du Nord, Europe de l’Ouest, Asie de l’Est. Chacun a sa **façade maritime** (Northern Range de Rotterdam à Hambourg, littoral chinois de Shanghai à Shenzhen, côtes Est et Ouest des États-Unis) reliées par d’épaisses **routes maritimes** qui passent par les détroits (Malacca, Suez, Panama). Les métropoles y figurent comme les nœuds de commandement.

## Repères à retenir
| Repère | Donnée |
| Part du commerce mondial transportée par mer (en volume) | environ 80 % |
| Premier port à conteneurs du monde | Shanghai |
| Premier port d’Europe | Rotterdam |`,
          },
          questions: [
            ['Qu’est-ce qu’un espace productif ?', ['Un espace naturel protégé', 'Un espace aménagé pour produire des biens ou des services', 'Un quartier résidentiel', 'Une zone sans activité'], 1, 'Une usine, un port, un quartier d’affaires ou un bassin agricole sont des espaces productifs.'],
            ['Que désigne la littoralisation ?', ['L’érosion des côtes', 'La montée des océans', 'La concentration des activités et des hommes sur les littoraux', 'Le tourisme balnéaire uniquement'], 2, 'Les grandes zones industrialo-portuaires s’installent au bord de la mer, porte d’entrée du commerce mondial.'],
            ['Quelle part du commerce mondial, en volume, passe par la mer ?', ['Environ 20 %', 'Environ 50 %', 'Environ 5 %', 'Environ 80 %'], 3, 'Le transport maritime est le moins coûteux pour les grandes quantités.'],
            ['Qu’est-ce qu’une chaîne mondiale de valeur ajoutée ?', ['Le découpage de la production en étapes réalisées dans différents pays', 'Une chaîne de magasins', 'Un réseau de câbles', 'Une usine unique'], 0, 'Chaque étape est localisée là où elle est la plus rentable.'],
            ['Dans la production d’un smartphone, quelle étape rapporte le moins de valeur ajoutée ?', ['La conception', 'L’assemblage', 'La marque', 'Le logiciel'], 1, 'L’assemblage, souvent réalisé en Asie avec une main-d’œuvre peu payée, capte une faible part de la valeur.'],
            ['Où se concentrent les activités à forte valeur ajoutée ?', ['Dans les espaces ruraux isolés', 'Dans les déserts', 'Dans les métropoles', 'Dans les montagnes'], 2, 'Sièges sociaux, finance et recherche cherchent les métropoles, bien connectées et riches en main-d’œuvre qualifiée.'],
            ['Un technopôle associe universités, recherche et entreprises innovantes.', ['Vrai', 'Faux'], 0, 'La Silicon Valley ou le plateau de Saclay en sont des exemples.'],
            ['Quel est le premier port d’Europe ?', ['Marseille', 'Hambourg', 'Anvers', 'Rotterdam'], 3, 'Rotterdam domine la Northern Range, la façade maritime de la mer du Nord.'],
            ['Quels flux sont dits immatériels ?', ['Les données et les capitaux', 'Les conteneurs', 'Le pétrole', 'Les touristes'], 0, 'Ils circulent surtout par les câbles sous-marins et les réseaux numériques.'],
            ['Quels acteurs organisent les réseaux internationaux de production ?', ['Uniquement les États', 'Les firmes transnationales et leurs sous-traitants', 'Les ONG', 'Les agriculteurs'], 1, 'Les FTN répartissent leurs sites dans le monde ; les États les attirent par des aides ou des zones franches.'],
            ['Les services ne font pas partie des espaces productifs.', ['Vrai', 'Faux'], 1, 'Les services (finance, conseil, recherche, tourisme) créent aussi des richesses : le programme demande de ne pas les oublier.'],
            ['Comment s’appelle la façade maritime européenne de la mer du Nord ?', ['La dorsale', 'La Mégalopolis', 'La Northern Range', 'La Sun Belt'], 2, 'Du Havre à Hambourg, elle concentre les plus grands ports européens.'],
          ],
        },

        {
          titre: 'Les espaces des industries aéronautique et aérospatiale européennes',
          axe: G2,
          rayon: G,
          lecon: {
            titre: 'Airbus, un avion fabriqué en réseau à travers l’Europe',
            cours: `Un avion **Airbus** n’est pas construit dans une seule usine : ses pièces sont fabriquées dans plusieurs pays européens, puis assemblées. Les industries **aéronautique** (avions, hélicoptères) et **aérospatiale** (lanceurs, satellites) montrent une **mise en réseau** d’acteurs et de territoires par un processus de production.

## Un acteur majeur : Airbus
- Né en **1970** d’un groupement franco-allemand, rejoint par l’Espagne et le Royaume-Uni, Airbus est devenu l’un des **deux premiers constructeurs mondiaux** d’avions de ligne, en concurrence avec l’américain **Boeing**.
- Il livre environ **700 à 800 avions par an** dans les années 2020 et emploie environ **150 000 personnes**, dont une grande partie en France et en Allemagne.
- Le secteur spatial européen s’organise autour de l’**Agence spatiale européenne (ESA)**, d’**ArianeGroup** (lanceurs Ariane) et de constructeurs de satellites (Thales Alenia Space, Airbus Defence and Space).

## Un réseau de production européen
| Site | Pays | Rôle |
| **Toulouse** (Blagnac) | France | Siège, assemblage final des A320, A330, A350 |
| **Hambourg** (Finkenwerder) | Allemagne | Assemblage final des A320 et A321, aménagement des cabines |
| **Saint-Nazaire**, Nantes | France | Tronçons de fuselage, caissons centraux |
| **Broughton** | Royaume-Uni (pays de Galles) | Ailes |
| **Getafe**, Illescas | Espagne | Empennages, pièces en composite |
| **Brême** | Allemagne | Équipements des ailes |

Les pièces voyagent par la route, par bateau (sur la Garonne et en mer) et par des avions-cargos géants, les **Beluga**. Airbus a aussi des chaînes d’assemblage hors d’Europe : **Tianjin** (Chine) et **Mobile** (États-Unis), pour se rapprocher de ses clients.

> L’avion est un produit européen : chaque région y apporte une spécialité, et le produit final circule d’un site à l’autre avant d’être assemblé.

## Des dynamiques territoriales à l’échelle locale
- **Toulouse** et **Hambourg** doivent en partie leur dynamisme à Airbus : emplois directs mais aussi chez des milliers de **sous-traitants** (Safran, Latécoère, Liebherr…).
- Autour de Toulouse, le pôle de compétitivité **Aerospace Valley** (Occitanie et Nouvelle-Aquitaine) associe entreprises, écoles d’ingénieurs (ISAE-Supaéro), laboratoires et centre spatial du CNES.
- Ces activités attirent des ingénieurs et des cadres : elles nourrissent la **métropolisation** et la croissance démographique de Toulouse.

## Des enjeux internationaux
- La **concurrence** avec Boeing et l’arrivée du chinois **Comac** poussent à innover (avions moins gourmands en carburant, projets d’avion à hydrogène).
- La production dépend de **chaînes d’approvisionnement mondiales** fragiles (pénuries de pièces après la crise du Covid-19).
- Les **clients** sont dans le monde entier : compagnies d’Asie, du Golfe, d’Amérique.

## Le croquis en mots
Sur une carte de l’Europe de l’Ouest, deux grands pôles d’assemblage, **Toulouse** et **Hambourg**. Reliés à eux par des flèches (routes, voies maritimes, lignes des Beluga) : Saint-Nazaire et Nantes, Broughton au Royaume-Uni, Getafe en Espagne, Brême en Allemagne. Hors d’Europe, deux points : Tianjin et Mobile.

## Repères à retenir
| Repère | Donnée |
| Création d’Airbus | 1970 |
| Grands sites d’assemblage | Toulouse, Hambourg |
| Principal concurrent | Boeing (États-Unis) |
| Pôle de compétitivité | Aerospace Valley |`,
          },
          questions: [
            ['Quel est le principal concurrent d’Airbus ?', ['Comac', 'Boeing', 'Embraer', 'Dassault'], 1, 'Airbus et Boeing se partagent l’essentiel du marché mondial des avions de ligne.'],
            ['Dans quelles villes se trouvent les grandes chaînes d’assemblage d’Airbus en Europe ?', ['Paris et Berlin', 'Londres et Madrid', 'Toulouse et Hambourg', 'Lyon et Munich'], 2, 'Toulouse assemble notamment les A350, Hambourg une grande partie des A320 et A321.'],
            ['Où sont fabriquées les ailes des avions Airbus ?', ['À Broughton, au Royaume-Uni', 'À Toulouse', 'À Hambourg', 'À Getafe'], 0, 'Le site gallois de Broughton est spécialisé dans les ailes.'],
            ['Comment s’appellent les avions-cargos géants qui transportent les tronçons d’Airbus ?', ['Les Concorde', 'Les Rafale', 'Les Transall', 'Les Beluga'], 3, 'Leur forme de baleine permet de transporter des morceaux entiers de fuselage.'],
            ['Pourquoi dit-on que la production d’Airbus est organisée en réseau ?', ['Parce qu’elle ne se fait que dans une usine', 'Parce que plusieurs sites spécialisés dans plusieurs pays fabriquent les pièces avant l’assemblage', 'Parce qu’Airbus vend sur Internet', 'Parce qu’Airbus n’a pas de siège'], 1, 'Chaque site a sa spécialité, et les pièces circulent entre eux.'],
            ['Le dynamisme de Toulouse est en partie lié à Airbus et à ses sous-traitants.', ['Vrai', 'Faux'], 0, 'Emplois directs et indirects, ingénieurs, écoles : Airbus nourrit la croissance de la métropole toulousaine.'],
            ['Qu’est-ce qu’un sous-traitant ?', ['Une entreprise qui fabrique pour une autre une partie de sa production', 'Un client d’Airbus', 'Un syndicat', 'Une agence de l’État'], 0, 'Safran ou Latécoère fabriquent des pièces et équipements pour Airbus.'],
            ['Comment s’appelle le pôle de compétitivité aéronautique du Sud-Ouest ?', ['Silicon Valley', 'Aerospace Valley', 'Vallée de la chimie', 'Sophia Antipolis'], 1, 'Il associe entreprises, écoles et laboratoires en Occitanie et Nouvelle-Aquitaine.'],
            ['Pourquoi Airbus a-t-il ouvert des chaînes d’assemblage en Chine et aux États-Unis ?', ['Parce que l’Europe interdit l’aéronautique', 'Pour fuir la concurrence', 'Pour se rapprocher de ses clients et de ses marchés', 'Pour fermer Toulouse'], 2, 'Tianjin et Mobile lui ouvrent l’accès aux marchés chinois et américain.'],
            ['Quelle agence organise la politique spatiale européenne ?', ['L’ESA', 'La NASA', 'L’OTAN', 'L’ONU'], 0, 'L’Agence spatiale européenne coordonne les programmes, dont les lanceurs Ariane.'],
            ['Airbus est une entreprise uniquement française.', ['Vrai', 'Faux'], 1, 'Né d’une coopération franco-allemande rejointe par l’Espagne et le Royaume-Uni, Airbus est un groupe européen.'],
            ['Quel constructeur chinois concurrence désormais Airbus et Boeing ?', ['Huawei', 'BYD', 'Alibaba', 'Comac'], 3, 'Son avion C919 vise d’abord le marché intérieur chinois.'],
          ],
        },
        {
          titre: 'Rotterdam : un espace industrialo-portuaire européen de dimension internationale',
          axe: G2,
          rayon: G,
          lecon: {
            titre: 'Rotterdam, la porte de l’Europe',
            cours: `**Rotterdam**, aux Pays-Bas, est le **premier port d’Europe** : il manutentionne environ **440 millions de tonnes** de marchandises par an (années 2020) et environ **13 à 15 millions d’EVP** (conteneurs). Il illustre la **mondialisation** des processus de production et l’importance fondamentale du **transport maritime**.

## Un site et une situation exceptionnels
- **Le site** : à l’embouchure du **Rhin** et de la **Meuse**, sur la mer du Nord, avec des eaux profondes qui accueillent les plus grands navires.
- **La situation** : au cœur de la **Northern Range** (façade maritime du Havre à Hambourg), au débouché de l’**hinterland** le plus riche d’Europe (Pays-Bas, Allemagne rhénane, Belgique, nord de la France, Suisse).

## Un espace industrialo-portuaire (ZIP)
| Activité | Exemple |
| **Conteneurs** | Terminaux automatisés de Maasvlakte |
| **Énergie** | Pétrole brut, raffineries (Shell, ExxonMobil, BP), gaz naturel liquéfié (terminal GNL) |
| **Pétrochimie et chimie** | Complexes chimiques du Botlek et de l’Europoort |
| **Vracs** | Charbon, minerai de fer, céréales |
| **Logistique** | Entrepôts, distriparks, redistribution vers l’Europe |

## Une desserte multimodale vers l’hinterland
Les marchandises repartent par :
1. **les barges fluviales** sur le Rhin, jusqu’à Duisbourg, premier port fluvial d’Europe ;
2. **le rail** (ligne de fret **Betuweroute** vers l’Allemagne, ouverte en 2007) ;
3. **la route** ;
4. **les oléoducs** vers l’Allemagne et la Belgique ;
5. les navires plus petits (*feeders*) vers la Scandinavie et le Royaume-Uni.

> Rotterdam n’est pas seulement un port : c’est une plateforme où la matière arrive, est transformée, stockée et redistribuée à toute l’Europe.

## Des territoires recomposés
- **Le port se déplace vers l’aval** de l’estuaire, vers la mer : du centre-ville historique au **Botlek**, puis à l’**Europoort** (années 1960) et à **Maasvlakte 1 et 2** — Maasvlakte 2, gagné sur la mer, ouvre en **2013**.
- Les anciens bassins du centre sont reconvertis : le quartier de **Kop van Zuid** (bureaux, logements, pont Erasmus) sur d’anciennes friches portuaires.
- Le **déclin de zones industrielles** laisse place à des **espaces de logistique**.
- Enjeux d’aménagement : concurrence avec **Anvers-Bruges** et **Hambourg**, **transition énergétique** (projets d’hydrogène, capture de CO₂, éolien en mer), protection contre la montée des eaux (barrage mobile **Maeslantkering**, 1997).

!> Ne confonds pas le site (le lieu précis où le port est installé) et la situation (la position par rapport aux régions voisines).

## Le croquis en mots
D’est en ouest, le long du fleuve (la Nouvelle Meuse) : la **ville** de Rotterdam et ses anciens bassins reconvertis, puis le **Botlek** (chimie), l’**Europoort** (pétrole) et, tout à l’ouest, gagnés sur la mer du Nord, **Maasvlakte 1 et 2** (conteneurs). Des flèches partent vers l’est : Rhin, rail, route, oléoducs vers la Ruhr.

## Repères à retenir
| Repère | Donnée |
| Rang | Premier port d’Europe |
| Trafic | environ 440 millions de tonnes par an |
| Maasvlakte 2 | 2013 |
| Betuweroute | 2007 |`,
          },
          questions: [
            ['Dans quel pays se trouve Rotterdam ?', ['En Belgique', 'En Allemagne', 'Aux Pays-Bas', 'Au Danemark'], 2, 'Rotterdam est aux Pays-Bas, à l’embouchure du Rhin et de la Meuse.'],
            ['Quel est le rang de Rotterdam parmi les ports européens ?', ['Premier', 'Cinquième', 'Dixième', 'Deuxième derrière Marseille'], 0, 'Avec environ 440 millions de tonnes par an, il domine les ports européens.'],
            ['Qu’est-ce que l’hinterland d’un port ?', ['Son avant-port', 'Sa zone d’influence à l’intérieur des terres', 'Sa flotte de navires', 'Son quartier historique'], 1, 'L’hinterland de Rotterdam s’étend jusqu’à la Ruhr et la Suisse.'],
            ['Par quel fleuve les barges relient-elles Rotterdam à l’Allemagne ?', ['La Seine', 'Le Danube', 'L’Elbe', 'Le Rhin'], 3, 'Le Rhin relie Rotterdam à Duisbourg, premier port fluvial d’Europe, et à la Ruhr.'],
            ['Dans quel sens le port de Rotterdam s’est-il déplacé ?', ['Vers l’aval, vers la mer', 'Vers l’amont, vers l’intérieur', 'Il n’a jamais bougé', 'Vers le sud, en Belgique'], 0, 'Du centre-ville au Botlek, à l’Europoort puis à Maasvlakte : il suit les navires de plus en plus grands.'],
            ['Maasvlakte 2 a été gagné sur la mer du Nord.', ['Vrai', 'Faux'], 0, 'Cette extension ouverte en 2013 accueille des terminaux à conteneurs automatisés.'],
            ['Que désigne le sigle ZIP ?', ['Une zone interdite portuaire', 'Une zone industrialo-portuaire', 'Une zone internationale de pêche', 'Une zone d’immeubles protégés'], 1, 'Une ZIP associe port et industries qui transforment les matières importées.'],
            ['Quelle industrie est très présente à Rotterdam ?', ['L’horlogerie', 'Le textile', 'La pétrochimie', 'L’aéronautique'], 2, 'Raffineries et complexes chimiques transforment le pétrole importé.'],
            ['Qu’est-ce que la Betuweroute ?', ['Un pont', 'Une ligne ferroviaire de fret vers l’Allemagne', 'Un canal', 'Un oléoduc'], 1, 'Ouverte en 2007, elle achemine les conteneurs vers l’hinterland allemand.'],
            ['Que sont devenus les anciens bassins du centre de Rotterdam ?', ['Des terminaux pétroliers', 'Des zones agricoles', 'Des quartiers reconvertis (bureaux, logements)', 'Des bases militaires'], 2, 'Kop van Zuid est un exemple de reconversion de friches portuaires.'],
            ['Rotterdam n’a aucun concurrent en Europe.', ['Vrai', 'Faux'], 1, 'Anvers-Bruges et Hambourg lui disputent les trafics de la Northern Range.'],
            ['Quelle façade maritime Rotterdam domine-t-il ?', ['La Northern Range', 'La façade méditerranéenne', 'La façade atlantique', 'La façade baltique'], 0, 'Du Havre à Hambourg, c’est la première façade maritime d’Europe.'],
          ],
        },

        // ===================================================================
        // GÉOGRAPHIE — Thème 3
        // ===================================================================
        {
          titre: 'Des espaces ruraux aux fonctions de plus en plus variées',
          axe: G3,
          rayon: G,
          lecon: {
            titre: 'La campagne ne sert plus seulement à cultiver',
            cours: `Les **espaces ruraux** connaissent d’importantes transformations. L’agriculture y reste importante, mais ces espaces sont de plus en plus liés aux villes et accueillent des fonctions **résidentielles**, **industrielles**, **environnementales** et **touristiques**.

## Les notions à maîtriser
| Notion | Définition |
| **Espace rural** | Espace de faible densité, où dominent les paysages agricoles, forestiers ou naturels |
| **Multifonctionnalité** | Coexistence de plusieurs fonctions dans un même espace (produire, habiter, se détendre, protéger) |
| **Périurbanisation** | Extension de l’urbanisation autour des villes, dans des communes rurales, par l’installation de citadins |
| **Fragmentation** | Division d’un espace en morceaux aux dynamiques opposées, qui se côtoient sans se mélanger |

## Les fonctions des espaces ruraux
1. **Produire** : agriculture (plus de 50 % du territoire français est agricole), forêt, industries agroalimentaires, énergie (éoliennes, méthanisation, panneaux solaires).
2. **Habiter** : des citadins s’installent à la campagne (maison individuelle, prix plus bas, cadre de vie), et le télétravail renforce ce mouvement depuis 2020.
3. **Se détendre** : tourisme vert, résidences secondaires, randonnée, agrotourisme.
4. **Protéger** : parcs naturels, zones humides, préservation de la biodiversité et des paysages.

> Les campagnes ne sont plus seulement des espaces agricoles : elles sont **multifonctionnelles**, et ces fonctions peuvent entrer en **conflit** (agriculteurs contre néo-ruraux, éoliennes contre paysage, tourisme contre protection).

## Des espaces ruraux très différents
| Type | Caractéristiques | Exemples |
| **Rural périurbain** | Sous influence d’une ville, croissance démographique | Autour de Toulouse, Rennes, Lyon |
| **Rural agricole productif** | Grandes exploitations modernes, tournées vers l’exportation | Beauce, Brie, Midwest américain, Mato Grosso au Brésil |
| **Rural touristique** | Littoral, montagne, patrimoine | Alpes, Provence, Dordogne |
| **Rural isolé** (« hyper-rural ») | Faible densité, vieillissement, recul des services | Diagonale des faibles densités, de la Meuse aux Landes |

## Dans le monde
- Dans les pays riches, les agriculteurs sont peu nombreux (environ **1,5 %** des actifs en France) mais très productifs.
- Dans les pays en développement, la population rurale reste nombreuse (plus de 60 % en Afrique subsaharienne dans plusieurs pays) ; beaucoup de paysans pratiquent une agriculture vivrière et migrent vers les villes (**exode rural**).
- Les **accaparements de terres** par des firmes ou des États étrangers et l’**agrobusiness** fragmentent les campagnes du Sud.

## Le croquis en mots
Sur une carte de France : des auréoles **périurbaines** autour des grandes métropoles ; les grandes plaines céréalières du **Bassin parisien** ; les campagnes **touristiques** des littoraux et des montagnes ; et une large **diagonale des faibles densités** du nord-est (Meuse) au sud-ouest (Landes), où la population vieillit et les services reculent.

## Repères à retenir
| Repère | Donnée |
| Part des agriculteurs dans l’emploi en France | environ 1,5 % |
| Part du territoire français agricole | un peu plus de 50 % |
| Communes rurales en France (définition Insee 2020) | environ 88 % des communes, un tiers de la population |`,
          },
          questions: [
            ['Qu’est-ce que la multifonctionnalité d’un espace rural ?', ['Le fait qu’il n’ait qu’une seule fonction', 'La coexistence de plusieurs fonctions : produire, habiter, se détendre, protéger', 'L’abandon de l’agriculture', 'La construction d’usines uniquement'], 1, 'Un même village peut accueillir agriculteurs, navetteurs, touristes et une zone protégée.'],
            ['Qu’est-ce que la périurbanisation ?', ['L’extension de l’urbanisation autour des villes dans des communes rurales', 'L’exode rural', 'La reconstruction des centres-villes', 'La création de parcs naturels'], 0, 'Des citadins s’installent à la campagne tout en travaillant en ville.'],
            ['Quelle part des actifs français sont agriculteurs ?', ['Environ 20 %', 'Environ 10 %', 'Environ 1,5 %', 'Environ 40 %'], 2, 'Peu nombreux, ils exploitent pourtant plus de la moitié du territoire.'],
            ['Quelle fonction correspond à l’installation d’éoliennes ou de méthaniseurs ?', ['La fonction de production d’énergie', 'La fonction résidentielle', 'La fonction touristique', 'La fonction de protection'], 0, 'Les campagnes produisent de plus en plus d’énergies renouvelables.'],
            ['Les fonctions des espaces ruraux peuvent entrer en conflit.', ['Vrai', 'Faux'], 0, 'Par exemple, des néo-ruraux se plaignent des nuisances agricoles, ou des habitants refusent des éoliennes.'],
            ['Qu’est-ce que la diagonale des faibles densités ?', ['Une autoroute', 'Une bande de territoires peu peuplés de la Meuse aux Landes', 'Une ligne TGV', 'Une frontière'], 1, 'Ces espaces ruraux isolés connaissent vieillissement et recul des services.'],
            ['Quelle région française est un grand espace rural agricole productif ?', ['La Beauce', 'La Côte d’Azur', 'La Lozère', 'Le Mercantour'], 0, 'Ses grandes exploitations céréalières sont très mécanisées.'],
            ['Que désigne la fragmentation d’un espace rural ?', ['Sa division en parcelles égales', 'Sa protection totale', 'Sa division en morceaux aux dynamiques opposées qui se côtoient', 'Son abandon complet'], 2, 'Grandes exploitations exportatrices et petits paysans pauvres peuvent se côtoyer, par exemple au Brésil.'],
            ['Dans les pays en développement, la population rurale est très faible.', ['Vrai', 'Faux'], 1, 'Elle reste nombreuse, notamment en Afrique subsaharienne et en Asie du Sud.'],
            ['Quel phénomène renforce l’installation de citadins à la campagne depuis 2020 ?', ['La fermeture des routes', 'La hausse des prix à la campagne', 'La fin des voitures', 'Le télétravail'], 3, 'Travailler à distance permet de vivre plus loin de son lieu de travail.'],
            ['Qu’est-ce que l’exode rural ?', ['Le départ des habitants des campagnes vers les villes', 'L’arrivée de citadins à la campagne', 'Le tourisme vert', 'La création de villages'], 0, 'Il a vidé les campagnes françaises aux XIXe et XXe siècles et reste fort dans les pays du Sud.'],
            ['Quel type d’espace rural connaît une croissance démographique ?', ['Le rural isolé', 'Le rural périurbain', 'Le rural de haute montagne', 'Aucun'], 1, 'Sous l’influence des villes, les communes périurbaines gagnent des habitants.'],
          ],
        },
        {
          titre: 'Les espaces périurbains en France (métropolitaine et ultramarine)',
          axe: G3,
          rayon: G,
          lecon: {
            titre: 'Le périurbain, entre ville et campagne',
            cours: `Autour des villes françaises, des communes rurales se sont couvertes de **lotissements**, de **zones commerciales** et d’**entrepôts**. Ces **espaces périurbains** connaissent de profondes recompositions : l’agriculture y recule, les fonctions résidentielles et logistiques progressent.

## Qu’est-ce qu’un espace périurbain ?
Un espace **périurbain** est un espace rural situé autour d’une ville, où une grande partie des actifs travaillent dans le pôle urbain. L’Insee parle aujourd’hui d’**aire d’attraction d’une ville** : le pôle et sa **couronne**, où au moins 15 % des actifs vont travailler dans le pôle.
- Environ **un Français sur quatre** vit dans une couronne périurbaine.
- La périurbanisation s’est accélérée depuis les années **1970**, avec la voiture et le rêve de la **maison individuelle**.

## Les fonctions du périurbain
| Fonction | Ce qu’on y trouve |
| **Résidentielle** | Lotissements pavillonnaires, nouveaux habitants (jeunes familles) |
| **Commerciale** | Hypermarchés, zones commerciales aux entrées de ville |
| **Logistique** | Entrepôts près des autoroutes (plateformes de e-commerce) |
| **Loisirs** | Golfs, parcs de loisirs, bases nautiques |
| **Production non agricole** | Zones d’activités, entreprises artisanales |
| **Agricole** | Maraîchage, circuits courts, mais des surfaces en recul |

## Des problèmes et des débats
1. **L’artificialisation des sols** : chaque année, plus de **20 000 hectares** d’espaces naturels, agricoles et forestiers sont artificialisés en France ; la loi **Climat et résilience (2021)** fixe l’objectif **zéro artificialisation nette** (ZAN) en 2050.
2. **La dépendance à la voiture** : longues navettes, coût du carburant (le mouvement des « gilets jaunes » en 2018 est parti en partie de ces espaces).
3. **Le maintien du caractère rural** : paysages, vie de village, place des agriculteurs.

> Le périurbain n’est ni tout à fait la ville ni tout à fait la campagne : on s’interroge sur son **extension**, sa **localisation** et le **maintien de son caractère rural**.

## Dans les outre-mer
- À **La Réunion**, la population se concentre sur le littoral ; la périurbanisation gagne les « **Hauts** » et les pentes au-dessus de Saint-Denis et de Saint-Pierre, au détriment des terres de canne à sucre.
- En **Martinique** et en **Guadeloupe**, les lotissements s’étendent autour de Fort-de-France et de Pointe-à-Pitre, sur des terres agricoles et des mangroves.
- Le relief et le littoral limitent l’espace disponible : les conflits d’usage y sont plus forts.

## Le croquis en mots
Imagine une ville au centre d’une carte. Autour, la **banlieue** dense ; puis, au-delà, une **couronne périurbaine** : villages anciens entourés de lotissements, zones commerciales et entrepôts le long des autoroutes et des rocades, champs mités par le bâti. Plus loin encore, l’espace rural sous faible influence urbaine.

## Repères à retenir
| Repère | Donnée |
| Part des Français vivant en couronne périurbaine | environ un quart |
| Artificialisation annuelle | plus de 20 000 ha |
| Objectif ZAN | 2050 (loi de 2021) |`,
          },
          questions: [
            ['Qu’est-ce qu’un espace périurbain ?', ['Le centre historique d’une ville', 'Un espace rural autour d’une ville dont beaucoup d’actifs travaillent dans le pôle urbain', 'Un espace montagnard', 'Un quartier d’affaires'], 1, 'Il mêle paysages ruraux et habitants au mode de vie urbain.'],
            ['Quel logement domine dans le périurbain ?', ['La maison individuelle en lotissement', 'Le grand ensemble', 'La tour de bureaux', 'L’immeuble haussmannien'], 0, 'Le rêve pavillonnaire a porté la périurbanisation depuis les années 1970.'],
            ['Quel moyen de transport rend la périurbanisation possible ?', ['Le métro', 'Le bateau', 'L’automobile', 'L’avion'], 2, 'La voiture permet de vivre loin de son travail, au prix d’une forte dépendance.'],
            ['Quelle part des Français vit dans une couronne périurbaine ?', ['Environ 1 %', 'Environ 75 %', 'Environ 50 %', 'Environ un quart'], 3, 'Environ un Français sur quatre vit dans ces couronnes.'],
            ['Pourquoi trouve-t-on des entrepôts dans le périurbain ?', ['Pour profiter de terrains moins chers près des autoroutes', 'Parce que c’est interdit en ville', 'Pour cacher les marchandises', 'Pour l’agriculture'], 0, 'Les plateformes logistiques cherchent des grands terrains accessibles.'],
            ['L’agriculture progresse fortement dans les espaces périurbains.', ['Vrai', 'Faux'], 1, 'Elle recule sous l’effet des fonctions résidentielles, logistiques et commerciales.'],
            ['Que signifie l’objectif ZAN ?', ['Zone agricole nouvelle', 'Zéro artificialisation nette', 'Zone d’aménagement national', 'Zéro automobile en navette'], 1, 'Fixé par la loi Climat et résilience de 2021 pour 2050.'],
            ['Qu’est-ce que l’artificialisation des sols ?', ['La plantation de forêts', 'La transformation de terres naturelles ou agricoles en surfaces bâties ou revêtues', 'L’irrigation', 'Le drainage'], 1, 'Elle détruit des terres fertiles et des habitats naturels.'],
            ['À La Réunion, où progresse la périurbanisation ?', ['Dans les Hauts et les pentes au-dessus des villes littorales', 'Au sommet du Piton des Neiges', 'Dans l’océan', 'Seulement dans le centre de Saint-Denis'], 0, 'Le relief contraint l’urbanisation, qui gagne les pentes aux dépens de la canne à sucre.'],
            ['Quel mouvement social de 2018 est parti en partie des espaces périurbains ?', ['Mai 68', 'Nuit debout', 'Les gilets jaunes', 'La Manif pour tous'], 2, 'La hausse du prix des carburants frappait des ménages très dépendants de la voiture.'],
            ['Dans les outre-mer, le relief et le littoral limitent l’espace disponible, ce qui renforce les conflits d’usage.', ['Vrai', 'Faux'], 0, 'Agriculture, habitat et protection des mangroves se disputent peu de terres.'],
            ['Comment l’Insee appelle-t-il aujourd’hui l’ensemble formé par un pôle et sa couronne ?', ['Une métropole', 'Une commune nouvelle', 'Une région', 'Une aire d’attraction d’une ville'], 3, 'Ce zonage de 2020 mesure l’influence d’une ville par les déplacements domicile-travail.'],
          ],
        },
        {
          titre: 'L’agro-tourisme en France (métropolitaine et ultramarine)',
          axe: G3,
          rayon: G,
          lecon: {
            titre: 'Accueillir à la ferme : un tourisme qui fait revivre les campagnes',
            cours: `L’**agro-tourisme** est un tourisme qui valorise l’**agriculture** et les **produits du terroir** : dormir dans une ferme, visiter une exploitation, déguster et acheter des produits locaux. Il est en plein essor même si les flux restent **modestes** à l’échelle nationale.

## Les formes de l’agro-tourisme
| Forme | Exemple |
| **Hébergement** | Gîtes ruraux, chambres d’hôtes, camping à la ferme |
| **Restauration** | Fermes-auberges (Vosges, Alsace) |
| **Visites** | Caves et domaines viticoles (œnotourisme), fromageries, distilleries de rhum aux Antilles |
| **Vente directe** | Marchés de producteurs, boutiques à la ferme |
| **Activités** | Cueillette, ateliers, fermes pédagogiques |

Des réseaux structurent l’offre : **Bienvenue à la ferme** (chambres d’agriculture, plus de 8 000 agriculteurs), **Accueil paysan**, **Gîtes de France**.

## Des acteurs à plusieurs échelles
1. **Locale** : l’agriculteur qui choisit de diversifier son activité ; les communes, les offices de tourisme.
2. **Nationale** : l’État (labels, appellations comme les AOC/AOP), les chambres d’agriculture.
3. **Européenne** : la **politique agricole commune (PAC)** finance le développement rural (fonds **FEADER**, programmes **LEADER** portés par des groupes d’action locale).

> Né de volontés individuelles et soutenu par les politiques nationales et européennes, l’agro-tourisme **diversifie** les fonctions des campagnes et leur apporte des revenus.

## Les effets sur les espaces ruraux
- Un **complément de revenu** pour les agriculteurs et le maintien d’exploitations.
- La **valorisation du patrimoine** : bâtiments restaurés, paysages entretenus, savoir-faire et gastronomie.
- Une **diversification des populations** : touristes saisonniers, néo-ruraux qui s’installent, emplois saisonniers.

## Les limites
- Les flux restent faibles comparés au tourisme balnéaire ou urbain.
- Le risque de « **muséification** » ou de folklorisation du patrimoine.
- La question de la **préservation** du patrimoine bâti, paysager et culturel face à une fréquentation qui augmente.

## En outre-mer
- En **Martinique** et en **Guadeloupe**, les **distilleries de rhum** (rhum agricole AOC Martinique), les plantations de banane et de cacao se visitent.
- À **La Réunion**, la route de la vanille et des tables d’hôtes dans les Hauts.
- Ces activités permettent de diversifier un tourisme longtemps limité aux plages.

## Le croquis en mots
Sur une carte de France : de nombreux points d’agro-tourisme dans les régions viticoles (Bordelais, Bourgogne, Champagne, Alsace, vallée du Rhône), dans les massifs de moyenne montagne (Vosges et leurs fermes-auberges, Massif central, Pyrénées) et en Dordogne ; en encarts, les Antilles avec leurs distilleries et La Réunion avec ses Hauts.

## Repères à retenir
| Repère | Donnée |
| Réseau Bienvenue à la ferme | plus de 8 000 agriculteurs |
| Financement européen | PAC, FEADER, programmes LEADER |
| Exemple ultramarin | rhum agricole AOC Martinique |`,
          },
          questions: [
            ['Qu’est-ce que l’agro-tourisme ?', ['Un tourisme balnéaire', 'Un tourisme qui valorise l’agriculture et les produits du terroir', 'Un tourisme d’affaires', 'Un tourisme en ville'], 1, 'Dormir à la ferme, visiter une exploitation, acheter des produits locaux en sont des formes.'],
            ['Qu’est-ce qu’une ferme-auberge ?', ['Une ferme qui sert des repas avec ses propres produits', 'Un hôtel de luxe', 'Un supermarché', 'Une usine agroalimentaire'], 0, 'Elles sont nombreuses dans les Vosges et en Alsace.'],
            ['Comment s’appelle le tourisme de visite des vignobles et des caves ?', ['L’écotourisme', 'Le tourisme vert', 'L’œnotourisme', 'Le tourisme de masse'], 2, 'Il est une forme importante d’agro-tourisme en Bourgogne, en Champagne ou dans le Bordelais.'],
            ['Quelle politique européenne soutient le développement rural ?', ['La politique de cohésion urbaine', 'Schengen', 'L’euro', 'La politique agricole commune (PAC)'], 3, 'Son deuxième pilier, financé par le FEADER, soutient le développement rural et les programmes LEADER.'],
            ['L’agro-tourisme représente des flux touristiques massifs à l’échelle nationale.', ['Vrai', 'Faux'], 1, 'Les flux restent modestes, même si l’activité est en plein essor.'],
            ['Quel avantage l’agro-tourisme apporte-t-il aux agriculteurs ?', ['Un complément de revenu', 'La fin de leur activité agricole', 'Une exonération de tout impôt', 'Des subventions automatiques'], 0, 'En diversifiant leur activité, ils sécurisent leurs revenus.'],
            ['Quel réseau regroupe des agriculteurs qui accueillent le public ?', ['Airbnb', 'Bienvenue à la ferme', 'Club Med', 'Center Parcs'], 1, 'Porté par les chambres d’agriculture, il rassemble plus de 8 000 agriculteurs.'],
            ['Que peut-on visiter en Martinique dans le cadre de l’agro-tourisme ?', ['Des vignobles', 'Des mines de charbon', 'Des distilleries de rhum', 'Des stations de ski'], 2, 'Le rhum agricole de Martinique bénéficie d’une AOC.'],
            ['Quelle limite de l’agro-tourisme est soulignée par le programme ?', ['L’absence totale de touristes', 'La question de la préservation du patrimoine rural', 'La pollution industrielle', 'La disparition des routes'], 1, 'Une fréquentation accrue peut menacer le patrimoine bâti, paysager ou culturel.'],
            ['L’agro-tourisme contribue à diversifier les populations des espaces ruraux.', ['Vrai', 'Faux'], 0, 'Touristes saisonniers, travailleurs saisonniers et nouveaux habitants s’ajoutent aux populations permanentes.'],
            ['À quelle échelle se situe l’agriculteur qui ouvre un gîte ?', ['Mondiale', 'Européenne', 'Nationale', 'Locale'], 3, 'L’agro-tourisme est né de volontés individuelles locales, relayées par les politiques publiques.'],
            ['Que désigne le risque de « muséification » ?', ['La construction de musées', 'La transformation du patrimoine en décor figé pour touristes', 'La destruction des fermes', 'La vente des terres'], 1, 'Le patrimoine risque de devenir une vitrine sans vie locale réelle.'],
          ],
        },

        // ===================================================================
        // GÉOGRAPHIE — Thème 4 conclusif
        // ===================================================================
        {
          titre: 'Urbanisation, littoralisation et mutations des espaces ruraux en Chine',
          axe: G4,
          rayon: G,
          lecon: {
            titre: 'La Chine, des campagnes aux mégapoles littorales',
            cours: `Avec environ **1,4 milliard** d’habitants, la **Chine** connaît des recompositions spatiales spectaculaires : des campagnes aux villes, de l’agriculture à une économie diversifiée, du repli à l’ouverture sur le monde. Ce thème conclusif applique les notions de l’année (métropolisation, espaces productifs, espaces ruraux) à un seul pays.

## Une urbanisation très rapide
| Année | Part de la population urbaine |
| 1980 | environ 20 % |
| 2011 | plus de 50 % |
| 2024 | environ 67 % |

- Des centaines de millions de ruraux sont partis vers les villes : ce sont les **mingong**, travailleurs migrants venus des campagnes.
- Le **hukou** (livret de résidence) les rattache à leur village : en ville, ils ont souvent un accès limité à l’école, à la santé et au logement.
- La Chine compte de nombreuses **mégapoles** : **Shanghai** (environ 25 millions d’habitants), **Pékin** (environ 22 millions), **Chongqing**, **Canton**, **Shenzhen**.
- De grandes régions urbaines se forment : le **delta de la rivière des Perles** (Canton, Shenzhen, Hong Kong), le **delta du Yangzi** (Shanghai), la région **Pékin-Tianjin**.

## La littoralisation : l’ouverture sur le monde
Depuis les réformes de **Deng Xiaoping** (à partir de **1978**), la Chine s’ouvre :
1. **1980** : création des **zones économiques spéciales** (ZES), comme **Shenzhen**, alors un bourg de pêcheurs, aujourd’hui une métropole de plus de 17 millions d’habitants.
2. Ports géants : **Shanghai** est le premier port à conteneurs du monde ; la Chine en compte sept dans les dix premiers.
3. Le littoral concentre l’essentiel de la production industrielle, des exportations et des investissements étrangers : la Chine devient l’« **atelier du monde** ».

> La Chine est un pays à deux vitesses : une **façade littorale** riche et ouverte, un **intérieur** plus pauvre qui se rattrape lentement.

## Les mutations des espaces ruraux
- L’agriculture occupe encore environ **22 %** des actifs (contre plus de 60 % en 1990).
- Les campagnes se **vident** de leurs jeunes : restent les personnes âgées et les enfants « laissés derrière ».
- Elles se modernisent : remembrement, mécanisation, grandes fermes, tourisme rural ; la périurbanisation dévore des terres autour des villes.
- L’État lance des politiques de rattrapage : **développement de l’Ouest** (2000), lutte contre la pauvreté rurale, grands travaux (barrage des **Trois-Gorges**, lignes à grande vitesse : plus de 45 000 km).

## Des contrastes territoriaux accentués
| Espace | Caractéristiques |
| **Littoral Est** | Mégapoles, ports, industries, richesse |
| **Centre** | Rattrapage industriel (Wuhan, Chongqing), agriculture |
| **Ouest** (Tibet, Xinjiang) | Faibles densités, déserts et montagnes, ressources minières, tensions avec les minorités |

## Le croquis en mots
Sur une carte de la Chine : une **façade littorale** colorée de l’est, de Pékin-Tianjin au delta de la rivière des Perles, avec les grands ports (Shanghai, Ningbo, Shenzhen, Canton, Qingdao). Un **centre** en rattrapage le long du **Yangzi** (Wuhan, Chongqing). Un **Ouest** immense et peu peuplé. Des flèches montrent les migrations de l’intérieur vers le littoral, et des flux maritimes vers le monde.

## Repères à retenir
| Repère | Donnée |
| Population | environ 1,4 milliard |
| Population urbaine | environ 67 % (2024) |
| Réformes de Deng Xiaoping | 1978 |
| Création des ZES (Shenzhen) | 1980 |
| Premier port à conteneurs mondial | Shanghai |`,
          },
          questions: [
            ['Environ quelle part de la population chinoise vit en ville en 2024 ?', ['20 %', '67 %', '40 %', '90 %'], 1, 'La Chine est passée d’environ 20 % d’urbains en 1980 à environ deux tiers aujourd’hui.'],
            ['Qui sont les mingong ?', ['Des paysans qui refusent de partir', 'Des travailleurs migrants venus des campagnes vers les villes', 'Des chefs d’entreprise', 'Des touristes'], 1, 'Ils ont fourni la main-d’œuvre de l’« atelier du monde ».'],
            ['À quoi sert le hukou ?', ['C’est un passeport', 'C’est une carte bancaire', 'C’est un livret de résidence qui rattache chacun à son lieu d’origine', 'C’est un permis de conduire'], 2, 'En ville, un migrant sans hukou urbain a un accès limité aux services publics.'],
            ['Qui lance l’ouverture économique de la Chine à partir de 1978 ?', ['Mao Zedong', 'Xi Jinping', 'Sun Yat-sen', 'Deng Xiaoping'], 3, 'Ses réformes ouvrent la Chine aux capitaux étrangers et au marché.'],
            ['Quelle ville était un bourg de pêcheurs avant de devenir une zone économique spéciale en 1980 ?', ['Shenzhen', 'Pékin', 'Wuhan', 'Lhassa'], 0, 'Voisine de Hong Kong, Shenzhen compte aujourd’hui plus de 17 millions d’habitants.'],
            ['Quel est le premier port à conteneurs du monde ?', ['Rotterdam', 'Singapour', 'Shanghai', 'Los Angeles'], 2, 'Shanghai, à l’embouchure du Yangzi, domine le classement mondial.'],
            ['Le littoral chinois concentre l’essentiel des industries et des exportations.', ['Vrai', 'Faux'], 0, 'C’est la littoralisation : la façade Est est tournée vers la mondialisation.'],
            ['Quelle politique vise à rattraper le retard de l’intérieur ?', ['Les zones économiques spéciales', 'Le développement de l’Ouest', 'Le Grand Bond en avant', 'La politique de l’enfant unique'], 1, 'Lancée en 2000, elle finance infrastructures et industries dans l’intérieur.'],
            ['Quelle part des actifs chinois travaille encore dans l’agriculture ?', ['Environ 2 %', 'Environ 80 %', 'Environ 60 %', 'Environ 22 %'], 3, 'Elle a fortement reculé, mais reste bien plus élevée qu’en Europe.'],
            ['Quelle région urbaine rassemble Canton, Shenzhen et Hong Kong ?', ['Le delta de la rivière des Perles', 'Le delta du Yangzi', 'La région Pékin-Tianjin', 'Le Sichuan'], 0, 'C’est l’une des plus grandes concentrations urbaines et industrielles du monde.'],
            ['Les campagnes chinoises gagnent des jeunes grâce à l’exode urbain.', ['Vrai', 'Faux'], 1, 'C’est l’inverse : les jeunes partent en ville, les campagnes vieillissent.'],
            ['Quel grand ouvrage hydraulique a été construit sur le Yangzi ?', ['Le barrage d’Assouan', 'Le canal de Suez', 'Le barrage des Trois-Gorges', 'Le barrage Hoover'], 2, 'Achevé en 2006-2012, c’est la plus grande centrale hydroélectrique du monde.'],
          ],
        },
      ],
    },
  ],
}
