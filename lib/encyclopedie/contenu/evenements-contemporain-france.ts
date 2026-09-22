// -----------------------------------------------------------------------------
// LA FRANCE CONTEMPORAINE — six événements qui font le pays d'aujourd'hui.
//
// Deux guerres de décolonisation qu'on a longtemps refusé de nommer, une
// Constitution née d'une émeute, un mois de mai qui ne renverse pas le régime
// mais retourne la société, et deux lois qui déplacent la frontière de ce que
// la République autorise et de ce qu'elle s'interdit.
//
// L'Indochine et l'Algérie sont des sujets sensibles, et donc traités comme le
// demande `docs/encyclopedie.md`, § 3 : FACTUEL, daté, chiffré, sobre. On ne
// prend pas parti et on ne tait rien — ni la torture, ni l'OAS, ni le sort des
// harkis, ni le nombre de morts, ni les trente-sept ans qu'il a fallu à la loi
// française pour écrire le mot « guerre ».
// -----------------------------------------------------------------------------

import type { Evenement } from '../types'

export const EVENEMENTS_CONTEMPORAIN_FRANCE: Evenement[] = [
  {
    id: 'guerre-d-indochine',
    volet: 'evenements',
    nom: 'La guerre d’Indochine',
    date: '1946 – 1954',
    tri: 1954,
    fin: 1954,
    periode: 'contemporain',
    emoji: '🌏',
    lieu: 'Viêt Nam, Laos et Cambodge',
    accroche:
      'Huit ans de guerre à dix mille kilomètres de Paris, une cuvette perdue le 7 mai 1954 : la France découvre qu’un empire peut se défaire.',
    citations: [
      {
        texte:
          'Tous les hommes sont créés égaux. Ils sont doués par le Créateur de certains droits inaliénables ; parmi ces droits, il y a la vie, la liberté et la recherche du bonheur.',
        qui: 'Hô Chi Minh',
        contexte:
          'Place Ba Dinh, à Hanoï, le 2 septembre 1945, en proclamant l’indépendance du Viêt Nam.',
        sens:
          'Il ouvre sa déclaration en citant celle des États-Unis de 1776 : une façon de dire aux Alliés que l’indépendance vietnamienne se réclame de leurs propres principes.',
      },
      {
        texte:
          'Vous tuerez dix de mes hommes quand j’en tuerai un des vôtres, mais à ce prix-là vous perdrez et je gagnerai.',
        qui: 'Hô Chi Minh',
        contexte:
          'Au négociateur français Jean Sainteny, en 1946, qui l’a rapporté après coup.',
        sens:
          'Le résumé de toute la guerre : une armée moderne peut gagner chaque bataille et perdre quand même, parce que l’adversaire tient plus longtemps qu’elle.',
      },
      {
        texte:
          'Si, au 20 juillet, le cessez-le-feu n’est pas intervenu, j’apporterai au Président de la République ma démission.',
        qui: 'Pierre Mendès France',
        contexte:
          'Discours d’investiture devant l’Assemblée nationale, le 17 juin 1954, six semaines après Diên Biên Phu.',
        sens: 'Il se donne quatre semaines pour finir une guerre de huit ans. Il tiendra le délai.',
      },
    ],
    reperes: [
      'Le 2 septembre 1945, Hô Chi Minh proclame à Hanoï l’indépendance du Viêt Nam ; la France refuse de la reconnaître.',
      'La guerre commence en décembre 1946, après le bombardement du port de Haïphong.',
      'Elle est faite par le corps expéditionnaire, sans aucun appelé du contingent : la métropole la suit de loin.',
      'Le camp retranché de Diên Biên Phu tombe le 7 mai 1954 après cinquante-six jours de siège.',
      'Les accords de Genève (21 juillet 1954) coupent le Viêt Nam en deux au 17ᵉ parallèle.',
    ],
    causes: [
      'Une colonisation ancienne : depuis les années 1880, l’Indochine française fournit riz, charbon et caoutchouc, et l’« indigène » n’y est pas un citoyen.',
      'L’occupation japonaise de 1940 à 1945, qui humilie l’administration française et laisse le Viêt-minh s’organiser dans les campagnes.',
      'La proclamation d’indépendance du 2 septembre 1945, que la France refuse de reconnaître.',
      'L’échec des négociations de 1946 : les accords du 6 mars et la conférence de Fontainebleau ne tranchent pas la question du pouvoir.',
      'Le bombardement de Haïphong le 23 novembre 1946, puis l’insurrection de Hanoï le 19 décembre.',
      'La guerre froide : après la victoire de Mao en Chine (1949), la Chine arme le Viêt-minh et les États-Unis financent la France.',
    ],
    recit: [
      {
        titre: 'Hanoï, 2 septembre 1945',
        texte:
          'Le Japon vient de capituler. Place Ba Dinh, à **Hanoï**, devant une foule immense, **Hô Chi Minh** proclame l’indépendance de la **République démocratique du Viêt Nam** — et il ouvre son discours en citant la Déclaration d’indépendance américaine de 1776. L’Indochine française, c’est depuis les années 1880 le Viêt Nam, le Laos et le Cambodge : du riz, du charbon, de l’hévéa, et un régime où l’« indigène » n’est pas un citoyen. La France, qui vient elle-même d’être libérée, refuse de lâcher. On négocie d’abord : les **accords du 6 mars 1946** reconnaissent un « État libre » vietnamien dans l’Union française, et Hô Chi Minh passe l’été à discuter à **Fontainebleau**. Rien n’est réglé sur l’essentiel — qui commande. Le **23 novembre 1946**, la marine française bombarde le port de **Haïphong** ; le **19 décembre**, le Viêt-minh attaque les Français de Hanoï. La guerre commence, et personne ne la déclare.',
      },
      {
        titre: 'Une guerre que la métropole ne regarde pas',
        texte:
          'C’est une guerre de professionnels : le **corps expéditionnaire** est fait d’engagés, de légionnaires, de tirailleurs d’Afrique et de supplétifs vietnamiens. **Aucun appelé du contingent n’y est envoyé** — c’est l’une des raisons pour lesquelles la France, occupée à se reconstruire, la suit de si loin. Sur le terrain, il n’y a pas de front : des embuscades, des postes isolés, des rizières, et une population qu’il faut tenir village par village. Tout bascule en **1949** : Mao gagne en Chine, la frontière du Nord s’ouvre, et le Viêt-minh reçoit armes, canons et instructeurs. À l’automne **1950**, les postes de la **route coloniale n° 4** sont évacués dans le désastre : plus de 4 000 hommes perdus. La guerre devient alors un front de la **guerre froide** : à partir de 1952, les États-Unis en paient une part croissante, jusqu’aux trois quarts du coût en 1954. En France, le Parti communiste la dénonce comme « la sale guerre » ; ailleurs, on préfère ne pas y penser.',
      },
      {
        titre: 'Diên Biên Phu, cinquante-six jours',
        texte:
          'À la fin de 1953, le général **Navarre** installe un camp retranché dans une **cuvette** du Nord-Ouest, **Diên Biên Phu**, pour attirer le Viêt-minh en terrain découvert et l’écraser à l’artillerie. Le calcul se retourne. **Giap** fait hisser des canons sur les crêtes qui dominent le camp, à travers la jungle, à force d’hommes et de vélos renforcés ; des centaines de milliers de porteurs ravitaillent le siège. L’attaque commence le **13 mars 1954**. Les pistes d’aviation sont hors d’usage en deux jours : le camp ne vit plus que de parachutages, sous le feu. Cinquante-six jours de tranchées, de pluie et d’assauts sur des collines qui portent des noms de femmes. Le **7 mai 1954**, le camp tombe : **11 721 prisonniers** partent à pied vers les camps du Viêt-minh, sur des centaines de kilomètres ; moins de la moitié en reviendra. Militairement, la France n’a pas perdu l’Indochine ce jour-là ; politiquement, tout est joué.',
      },
      {
        titre: 'Genève, en quatre semaines',
        texte:
          'La nouvelle tombe à Paris au moment où s’ouvre la conférence de **Genève**. Le 17 juin 1954, **Pierre Mendès France** est investi président du Conseil sur une promesse inouïe : la paix avant le 20 juillet, sinon sa démission. Il l’obtient dans la nuit du 20 au 21. Les **accords de Genève** coupent le Viêt Nam en deux au **17ᵉ parallèle** — le Nord au Viêt-minh, le Sud à l’État du Viêt Nam — et prévoient pour 1956 des élections qui doivent le réunifier. Elles n’auront jamais lieu : les **États-Unis** prennent la relève au Sud, et la guerre du Viêt Nam durera jusqu’en 1975. Le Laos et le Cambodge deviennent indépendants. Trois mois après Genève, le **1ᵉʳ novembre 1954**, la guerre d’Algérie commence — et une partie de l’armée française y arrive avec la certitude de ne plus jamais « lâcher » une terre.',
      },
    ],
    consequences: [
      'La France quitte l’Indochine : le Viêt Nam est coupé en deux, le Laos et le Cambodge deviennent indépendants.',
      'Les États-Unis prennent la relève au Sud : la guerre du Viêt Nam durera jusqu’en 1975.',
      'L’armée française sort de là persuadée d’avoir été lâchée par le pouvoir politique — un ressentiment qu’elle emporte en Algérie.',
      'Mendès France enchaîne sur l’autonomie interne de la Tunisie (juillet 1954) : la décolonisation française est lancée.',
      'La guerre d’Algérie commence le 1ᵉʳ novembre 1954, trois mois après les accords de Genève.',
    ],
    chiffres: [
      { valeur: '8 ans', quoi: 'de guerre, de décembre 1946 à juillet 1954' },
      { valeur: '56 jours', quoi: 'de siège à Diên Biên Phu' },
      { valeur: '11 721', quoi: 'prisonniers faits à la chute du camp' },
      { valeur: '17ᵉ', quoi: 'parallèle : la ligne qui coupe le Viêt Nam en deux' },
    ],
    chrono: [
      { date: '2 septembre 1945', fait: 'Hô Chi Minh proclame l’indépendance à Hanoï.' },
      { date: '6 mars 1946', fait: 'Accords Hô Chi Minh – Sainteny : un « État libre » vietnamien.' },
      { date: '23 novembre 1946', fait: 'Bombardement du port de Haïphong.' },
      { date: '19 décembre 1946', fait: 'Insurrection de Hanoï : la guerre commence.' },
      { date: 'octobre 1950', fait: 'Désastre de la route coloniale n° 4.' },
      { date: '13 mars 1954', fait: 'Le Viêt-minh attaque Diên Biên Phu.' },
      { date: '7 mai 1954', fait: 'Chute du camp retranché.' },
      { date: '21 juillet 1954', fait: 'Accords de Genève : partition au 17ᵉ parallèle.' },
    ],
    leSaisTu:
      'Les canons de Giap sont arrivés à dos d’homme et à vélo. Des bicyclettes renforcées de bambou, poussées et non pédalées, portaient jusqu’à 200 kg de riz ou d’obus sur des centaines de kilomètres de piste. L’état-major français avait jugé l’artillerie lourde impossible à hisser sur ces crêtes.',
    aRetenir: [
      'Le 2 septembre 1945, Hô Chi Minh proclame l’indépendance du Viêt Nam ; la France la refuse.',
      'La guerre d’Indochine dure de décembre 1946 à juillet 1954 et n’emploie aucun appelé du contingent.',
      'Le camp retranché de Diên Biên Phu tombe le 7 mai 1954 après cinquante-six jours de siège.',
      'Les accords de Genève du 21 juillet 1954, obtenus par Pierre Mendès France, partagent le Viêt Nam au 17ᵉ parallèle.',
    ],
    mots: [
      {
        mot: 'Viêt-minh',
        sens: 'Front d’indépendance vietnamien fondé en 1941 par Hô Chi Minh, à la fois parti, armée et administration.',
      },
      {
        mot: 'Corps expéditionnaire',
        sens: 'Armée de métier envoyée outre-mer : engagés, légionnaires, troupes coloniales — jamais d’appelés en Indochine.',
      },
      {
        mot: 'Décolonisation',
        sens: 'Accès à l’indépendance des territoires colonisés, par négociation ou par la guerre, surtout entre 1945 et 1975.',
      },
    ],
    lies: ['pierre-mendes-france', 'guerre-d-algerie', 'partage-de-l-afrique', 'gandhi'],
    niveaux: ['3e'],
    programme: 'Indépendances et construction de nouveaux États',
    tags: [
      'Indochine',
      'Viêt Nam',
      'Hô Chi Minh',
      'Diên Biên Phu',
      'Giap',
      'Genève',
      'Mendès France',
      'décolonisation',
      'Viêt-minh',
      'guerre froide',
    ],
  },
  {
    id: 'naissance-de-la-ve-republique',
    volet: 'evenements',
    nom: 'La naissance de la Ve République',
    date: '4 octobre 1958',
    tri: 1958,
    periode: 'contemporain',
    emoji: '🏛️',
    lieu: 'Alger, Paris, Colombey-les-Deux-Églises',
    accroche:
      'Une émeute à Alger fait tomber un régime : en cinq mois, de Gaulle revient au pouvoir et donne à la France la Constitution sous laquelle elle vit encore.',
    citations: [
      {
        texte: 'Croit-on qu’à 67 ans je vais commencer une carrière de dictateur ?',
        qui: 'Charles de Gaulle',
        contexte:
          'Conférence de presse au Palais d’Orsay, le 19 mai 1958, six jours après l’émeute d’Alger.',
        sens:
          'Il se dit disponible sans se dire putschiste : la phrase rassure une partie des députés, qui l’investiront le 1ᵉʳ juin.',
      },
      {
        texte:
          'C’est donc du chef de l’État, placé au-dessus des partis, que doit procéder le pouvoir exécutif.',
        qui: 'Charles de Gaulle',
        contexte: 'Discours de Bayeux, le 16 juin 1946, douze ans avant la Constitution de 1958.',
        sens:
          'Le plan de la Ve République existait dès 1946 : il attendait une crise assez grave pour être accepté.',
      },
      {
        texte:
          'L’autorité indivisible de l’État est confiée tout entière au président par le peuple qui l’a élu.',
        qui: 'Charles de Gaulle',
        contexte: 'Conférence de presse du 31 janvier 1964, après la réforme de 1962.',
        sens:
          'Lecture présidentielle des institutions : le président gouverne, le Premier ministre exécute. Elle vaut toujours hors cohabitation.',
      },
      {
        texte: 'Je me tourne vers le plus illustre des Français.',
        qui: 'René Coty',
        contexte:
          'Message au Parlement du 29 mai 1958, en menaçant de démissionner si de Gaulle n’est pas appelé.',
      },
    ],
    reperes: [
      'La IVe République a usé 22 gouvernements en moins de douze ans : personne ne gouverne longtemps.',
      'Le 13 mai 1958, l’émeute d’Alger et le comité de salut public font vaciller l’État.',
      'De Gaulle est investi le 1ᵉʳ juin 1958 et reçoit le pouvoir de rédiger une Constitution.',
      'Le référendum du 28 septembre 1958 l’approuve par 79,25 % de « oui » ; la Constitution est promulguée le 4 octobre.',
      'Le référendum du 28 octobre 1962 fait élire le président au suffrage universel direct.',
    ],
    causes: [
      'L’instabilité de la IVe République : un scrutin proportionnel, des coalitions fragiles, 22 gouvernements en douze ans.',
      'La guerre d’Algérie, que le pouvoir civil ne maîtrise plus et où l’armée agit pour son compte.',
      'Le 13 mai 1958 : à Alger, l’émeute installe un comité de salut public et réclame de Gaulle.',
      'La menace d’une opération militaire sur Paris (« Résurrection »), qui fait céder les députés.',
      'Un projet constitutionnel tout prêt, exposé par de Gaulle dès le discours de Bayeux en 1946.',
      'Un président de la République, René Coty, qui menace de démissionner si de Gaulle n’est pas appelé.',
    ],
    recit: [
      {
        titre: 'Le 13 mai 1958',
        texte:
          'La **IVe République** meurt de ne pas tenir debout : élue à la proportionnelle, l’Assemblée fabrique des coalitions qui durent six mois en moyenne — **22 gouvernements** en moins de douze ans. Et elle a sur les bras une guerre d’Algérie qui lui échappe. Le **13 mai 1958**, jour de l’investiture de Pierre Pflimlin, soupçonné de vouloir négocier, les Européens d’Alger envahissent le Gouvernement général. Un **comité de salut public** se forme, présidé par le général **Massu**, qui télégraphie à Paris pour réclamer **de Gaulle**. L’armée d’Algérie suit ; la Corse bascule le 24 mai ; on prépare une opération aéroportée sur Paris. Le pouvoir civil n’a plus les moyens de se faire obéir. Le 29 mai, le président **René Coty** annonce qu’il démissionnera si l’Assemblée n’appelle pas « le plus illustre des Français ».',
      },
      {
        titre: 'Quatre mois pour une Constitution',
        texte:
          'Le **1ᵉʳ juin 1958**, de Gaulle est investi président du Conseil par 329 voix contre 224. La **loi du 3 juin** lui confie le pouvoir de préparer une Constitution, à cinq conditions posées par les députés : le suffrage universel reste la seule source du pouvoir, l’exécutif et le législatif sont séparés, le gouvernement reste responsable devant le Parlement, l’autorité judiciaire demeure indépendante, les rapports avec les peuples associés sont organisés. Le texte est écrit en quelques semaines par **Michel Debré** et un petit groupe de juristes, présenté au Conseil d’État le **27 août**, puis au peuple. Le **28 septembre 1958**, le référendum donne **79,25 % de « oui »** avec 85 % de participation. La Constitution est promulguée le **4 octobre 1958**. De Gaulle est élu président le 21 décembre par un collège de quelque 80 000 élus.',
      },
      {
        titre: 'Ce que la Constitution déplace',
        texte:
          'Le président cesse d’être un arbitre honorifique : il nomme le **Premier ministre**, préside le Conseil des ministres, peut **dissoudre l’Assemblée** (article 12), soumettre un texte au **référendum** (article 11) et, en cas de péril, exercer des pouvoirs exceptionnels (**article 16**). Le gouvernement, lui, maîtrise l’ordre du jour du Parlement et peut faire adopter un texte sans vote en engageant sa responsabilité (**article 49, alinéa 3**). Le domaine de la loi est limité par l’article 34 ; au-delà, le gouvernement décide par décret. Un **Conseil constitutionnel** est créé pour vérifier que les lois respectent la Constitution. Le Parlement garde l’arme de la **motion de censure**, mais elle n’a abouti qu’une seule fois depuis 1958, le 5 octobre 1962.',
      },
      {
        titre: '1962 : le peuple élit son président',
        texte:
          'Le **22 août 1962**, de Gaulle échappe de peu à un attentat de l’OAS au **Petit-Clamart**. Il en tire un argument : son successeur n’aura pas sa légitimité historique, il lui faut celle des urnes. Il annonce un référendum pour faire élire le président **au suffrage universel direct**. Les juristes crient à la violation de la procédure ; l’Assemblée renverse le gouvernement Pompidou le 5 octobre — seule motion de censure adoptée de toute la Ve République. De Gaulle dissout, et gagne deux fois : le **28 octobre 1962**, **62,25 %** des votants disent « oui » ; en novembre, les gaullistes emportent les législatives. La première élection présidentielle au suffrage universel a lieu les 5 et 19 décembre **1965** : de Gaulle est mis en ballottage par **François Mitterrand** et l’emporte avec 55,2 %. Depuis, tout le système politique français tourne autour de ce rendez-vous.',
      },
    ],
    consequences: [
      'La France passe d’un régime d’assemblée à un régime où le président est la clé de voûte des institutions.',
      'Le référendum de 1962 fait du président l’élu direct des Français : la légitimité change de camp.',
      'Le Parlement perd la main sur l’ordre du jour et subit le 49.3 ; une seule motion de censure a abouti depuis 1958.',
      'Le Conseil constitutionnel, d’abord gardien des compétences, devient à partir de 1971 le gardien des libertés.',
      'Le régime s’est révélé souple : trois cohabitations (1986, 1993, 1997) et le passage au quinquennat en 2000.',
    ],
    chiffres: [
      { valeur: '22', quoi: 'gouvernements sous la IVe République, en douze ans' },
      { valeur: '79,25 %', quoi: 'de « oui » au référendum du 28 septembre 1958' },
      { valeur: '62,25 %', quoi: 'de « oui » pour l’élection du président au suffrage universel, en 1962' },
      { valeur: '1', quoi: 'seule motion de censure adoptée depuis 1958' },
    ],
    chrono: [
      { date: '16 juin 1946', fait: 'Discours de Bayeux : de Gaulle expose ses institutions.' },
      { date: '13 mai 1958', fait: 'Émeute d’Alger et comité de salut public.' },
      { date: '1ᵉʳ juin 1958', fait: 'De Gaulle investi président du Conseil.' },
      { date: '3 juin 1958', fait: 'Loi lui confiant la rédaction d’une Constitution.' },
      { date: '28 septembre 1958', fait: 'Référendum : 79,25 % de « oui ».' },
      { date: '4 octobre 1958', fait: 'Promulgation de la Constitution de la Ve République.' },
      { date: '21 décembre 1958', fait: 'De Gaulle élu président par 80 000 grands électeurs.' },
      { date: '28 octobre 1962', fait: 'Référendum : le président sera élu au suffrage universel.' },
      { date: '19 décembre 1965', fait: 'Première élection présidentielle au suffrage universel.' },
    ],
    leSaisTu:
      'La Constitution de 1958 a été écrite en quatre mois, de la loi du 3 juin à la promulgation du 4 octobre. Celle de 1946 avait demandé deux assemblées constituantes, deux référendums et dix-huit mois — et n’a tenu que douze ans.',
    aRetenir: [
      'Le 13 mai 1958, la crise d’Alger provoque la chute de la IVe République.',
      'De Gaulle, investi le 1ᵉʳ juin 1958, fait rédiger une Constitution approuvée par référendum le 28 septembre.',
      'La Constitution de la Ve République est promulguée le 4 octobre 1958.',
      'Le référendum du 28 octobre 1962 instaure l’élection du président au suffrage universel direct.',
      'Le président nomme le Premier ministre, peut dissoudre l’Assemblée et recourir au référendum.',
    ],
    mots: [
      {
        mot: 'Référendum',
        sens: 'Vote par lequel les citoyens répondent eux-mêmes « oui » ou « non » à une question posée par le pouvoir.',
      },
      {
        mot: 'Dissolution',
        sens: 'Décision du président mettant fin à l’Assemblée nationale avant son terme et provoquant de nouvelles élections.',
      },
      {
        mot: 'Motion de censure',
        sens: 'Vote par lequel l’Assemblée nationale renverse le gouvernement. Une seule a abouti depuis 1958.',
      },
      {
        mot: 'Cohabitation',
        sens: 'Situation où le président et la majorité de l’Assemblée ne sont pas du même camp politique.',
      },
    ],
    lies: [
      'charles-de-gaulle',
      'guerre-d-algerie',
      'mai-68',
      'francois-mitterrand',
      'georges-pompidou',
    ],
    niveaux: ['3e', 'Tle'],
    programme: 'Françaises et Français dans une République repensée',
    tags: [
      'Ve République',
      'Constitution',
      '1958',
      'de Gaulle',
      '13 mai 1958',
      'référendum',
      'Michel Debré',
      'suffrage universel',
      'IVe République',
      'institutions',
    ],
  },
  {
    id: 'guerre-d-algerie',
    volet: 'evenements',
    nom: 'La guerre d’Algérie',
    date: '1954 – 1962',
    tri: 1962,
    fin: 1962,
    periode: 'contemporain',
    emoji: '🏜️',
    lieu: 'Algérie et France métropolitaine',
    accroche:
      'Huit ans d’une guerre qui n’osait pas dire son nom : l’Algérie devient indépendante en 1962, et la loi française met trente-sept ans à écrire le mot « guerre ».',
    citations: [
      {
        texte: 'Je vous ai compris !',
        qui: 'Charles de Gaulle',
        contexte:
          'Au balcon du Gouvernement général, devant la foule européenne du Forum d’Alger, le 4 juin 1958.',
        sens:
          'Chacun y entendit ce qu’il espérait. Les partisans de l’Algérie française y lurent une promesse ; quinze mois plus tard, de Gaulle proposait l’autodétermination.',
      },
      {
        texte: 'L’Algérie, c’est la France.',
        qui: 'François Mitterrand',
        contexte:
          'Ministre de l’Intérieur, à la tribune de l’Assemblée nationale, le 12 novembre 1954.',
        sens:
          'L’Algérie n’est pas une colonie en droit mais trois départements français depuis 1848 : c’est ce statut qui rend toute négociation impensable en 1954.',
      },
      {
        texte:
          'But : l’indépendance nationale par la restauration de l’État algérien souverain, démocratique et social.',
        qui: 'La proclamation du FLN',
        contexte: 'Texte diffusé dans la nuit du 1ᵉʳ novembre 1954, au début des attentats.',
      },
      {
        texte:
          'Un pouvoir insurrectionnel s’est établi en Algérie par un pronunciamiento militaire… Ce pouvoir a une apparence : un quarteron de généraux en retraite.',
        qui: 'Charles de Gaulle',
        contexte:
          'Allocution télévisée du 23 avril 1961, pendant le putsch des généraux à Alger.',
        sens:
          'Écouté sur les transistors par les appelés du contingent, ce discours retourne la troupe contre ses chefs : le putsch s’effondre en trois jours.',
      },
    ],
    reperes: [
      'En 1954, l’Algérie compte environ 1 million d’Européens pour 9 millions de « Français musulmans » aux droits inégaux.',
      'La guerre commence le 1ᵉʳ novembre 1954, la « Toussaint rouge », par une trentaine d’attentats du FLN.',
      'Pendant la bataille d’Alger (1957), l’armée reçoit les pouvoirs de police et pratique la torture.',
      'Le 13 mai 1958, la crise d’Alger renverse la IVe République et ramène de Gaulle.',
      'Les accords d’Évian sont signés le 18 mars 1962 ; l’indépendance est reconnue le 3 juillet.',
      'La loi du 18 octobre 1999 remplace enfin « opérations de maintien de l’ordre » par « guerre d’Algérie ».',
    ],
    causes: [
      'La conquête commencée en 1830 et la colonisation de peuplement : les meilleures terres passent aux Européens.',
      'Un statut inégal : la citoyenneté française refusée en pratique aux musulmans, un double collège électoral, des élections truquées à partir de 1948.',
      'Le poids démographique et politique des Européens d’Algérie : 1 million de personnes qu’un vote égalitaire mettrait en minorité, et qui bloquent toute réforme.',
      'La répression de Sétif, Guelma et Kherrata le 8 mai 1945, qui fait des milliers de morts et ruine la confiance dans la France.',
      'L’exemple de l’Indochine : Diên Biên Phu prouve qu’une armée européenne peut être battue.',
      'La création du FLN en 1954, décidé à l’action armée là où les partis nationalistes ont échoué.',
    ],
    recit: [
      {
        titre: 'Trois départements, deux populations',
        texte:
          'L’Algérie n’est pas une colonie comme les autres : depuis **1848**, c’est **trois départements français**, avec des préfets, des sous-préfets et des députés. Mais la France n’y compte qu’une seule citoyenneté pleine. En 1954, environ **un million d’Européens** — Français de métropole, mais aussi familles venues d’Espagne, d’Italie, de Malte, et Juifs d’Algérie français depuis le décret Crémieux de 1870 — vivent auprès de **neuf millions de « Français musulmans »** qui n’ont ni les mêmes droits politiques, ni les mêmes terres, ni les mêmes écoles. Le statut de 1947 promettait l’égalité : il n’a jamais été appliqué, et les élections de 1948 sont ouvertement truquées. Un **double collège** fait qu’une voix européenne pèse huit voix musulmanes. Tout le drame tient dans cette arithmétique : l’égalité réclamée par les uns signifie, pour les autres, devenir minoritaires chez eux.',
      },
      {
        titre: 'La Toussaint rouge et l’engrenage',
        texte:
          'Dans la nuit du **1ᵉʳ novembre 1954**, une trentaine d’attentats éclatent en Algérie. Le bilan est de sept morts, dont un jeune instituteur, Guy Monnerot. Un mouvement inconnu, le **Front de libération nationale (FLN)**, revendique et appelle à l’indépendance. Paris répond par le refus : **Pierre Mendès France** déclare que « les départements d’Algérie constituent une partie de la République », et son ministre de l’Intérieur **François Mitterrand** résume : « L’Algérie, c’est la France. » L’engrenage est rapide. Le **20 août 1955**, le FLN massacre des civils à Philippeville et El-Halia ; la répression qui suit fait beaucoup plus de morts encore. Le **12 mars 1956**, l’Assemblée vote les **pouvoirs spéciaux** par 455 voix contre 76, communistes compris : le gouvernement peut désormais tout faire par décret. Les **appelés du contingent** partent pour vingt-sept mois. Ils seront, en tout, près d’un million et demi à servir en Algérie.',
      },
      {
        titre: 'La bataille d’Alger et la torture',
        texte:
          'En janvier **1957**, le FLN pose des bombes dans les cafés d’Alger ; le gouvernement confie les **pouvoirs de police** à la 10ᵉ division parachutiste du général **Massu**. La ville est quadrillée, fichée, fouillée ; les réseaux du FLN sont démantelés en quelques mois. Le prix est connu : **la torture devient une méthode**, systématique et couverte en haut lieu — la « gégène », la baignoire, les exécutions sommaires maquillées en fuites. Le mathématicien **Maurice Audin** disparaît après son arrestation en juin 1957 ; la France a reconnu en 2018 qu’il était mort sous la torture. Le journaliste **Henri Alleg** raconte la sienne dans *La Question* (1958), livre aussitôt saisi. En France, une partie de l’opinion, des intellectuels, des évêques et des officiers s’indignent : la République découvre qu’elle emploie, pour se défendre, des moyens qu’elle condamne.',
      },
      {
        titre: 'Du 13 mai 1958 aux accords d’Évian',
        texte:
          'Le **13 mai 1958**, l’émeute d’Alger emporte la IVe République et ramène **de Gaulle**. Le 4 juin, il lance au Forum d’Alger son « **Je vous ai compris !** ». Le **16 septembre 1959**, il propose l’**autodétermination** : les Algériens choisiront. Les partisans de l’Algérie française se sentent trahis. Ils dressent les barricades d’Alger en janvier 1960, puis tentent le **putsch des généraux** du 21 au 26 avril 1961 — brisé en trois jours par le refus des appelés. L’**OAS**, organisation clandestine, répond par les attentats, en Algérie comme en métropole, jusqu’à tenter d’assassiner de Gaulle. La répression touche aussi les Algériens de France : le **17 octobre 1961**, une manifestation pacifique est réprimée à Paris, avec des dizaines de morts. Les négociations aboutissent aux **accords d’Évian**, signés le **18 mars 1962** ; le cessez-le-feu prend effet le 19. Le **1ᵉʳ juillet**, le référendum d’autodétermination donne une écrasante majorité à l’indépendance, reconnue le **3 juillet 1962**.',
      },
      {
        titre: 'L’exode, les harkis, et le mot « guerre »',
        texte:
          'La paix ne referme rien. En quelques mois de 1962, près de **800 000 pieds-noirs** — presque toute la population européenne — embarquent pour la France avec deux valises, dans des ports surchargés. Les **harkis**, ces Algériens qui avaient servi comme supplétifs de l’armée française, sont désarmés et, pour la plupart, laissés sur place : des milliers sont massacrés après le cessez-le-feu, les estimations allant de 10 000 à plusieurs dizaines de milliers. Ceux qui parviennent à passer sont parqués dans des camps, à Rivesaltes ou Saint-Maurice-l’Ardoise. Le bilan humain de huit ans de guerre est lourd des deux côtés : environ **25 000 militaires français** tués, et, pour les Algériens, des estimations historiennes de 250 000 à 400 000 morts, quand le chiffre officiel algérien parle d’un million et demi de *chouhada*, les martyrs. En France, on n’en parle pas : les textes officiels disent « opérations de maintien de l’ordre ». Il faudra la **loi du 18 octobre 1999** pour que la République écrive « guerre d’Algérie ».',
      },
    ],
    consequences: [
      'L’Algérie devient indépendante : l’indépendance est reconnue le 3 juillet 1962, l’Algérie la fête le 5 juillet.',
      'Près de 800 000 pieds-noirs quittent l’Algérie en quelques mois de 1962 et arrivent sans rien en métropole.',
      'Les harkis sont désarmés et abandonnés : des milliers sont tués, les rescapés sont placés dans des camps en France.',
      'La crise du 13 mai 1958 a emporté la IVe République : la guerre a changé les institutions du pays.',
      'Une mémoire longue et disputée : le mot « guerre » reconnu par la loi en 1999, la mort de Maurice Audin reconnue en 2018, le 17 octobre 1961 en 2012 et 2021.',
      'Une immigration algérienne durable en France et une relation franco-algérienne qui reste marquée par ces huit ans.',
    ],
    chiffres: [
      { valeur: '1 million', quoi: 'd’Européens en Algérie pour 9 millions de musulmans, en 1954' },
      { valeur: '1,5 million', quoi: 'de soldats français ayant servi en Algérie' },
      { valeur: '25 000', quoi: 'militaires français tués, selon les comptes officiels' },
      { valeur: '800 000', quoi: 'pieds-noirs arrivés en France en 1962' },
    ],
    chrono: [
      { date: '1ᵉʳ novembre 1954', fait: 'Toussaint rouge : une trentaine d’attentats du FLN.' },
      { date: '20 août 1955', fait: 'Massacres de Philippeville et répression massive.' },
      { date: '12 mars 1956', fait: 'L’Assemblée vote les pouvoirs spéciaux.' },
      { date: 'janvier 1957', fait: 'Bataille d’Alger : l’armée reçoit les pouvoirs de police.' },
      { date: '13 mai 1958', fait: 'Alger fait tomber la IVe République.' },
      { date: '16 septembre 1959', fait: 'De Gaulle propose l’autodétermination.' },
      { date: '21-26 avril 1961', fait: 'Putsch des généraux, brisé par les appelés.' },
      { date: '17 octobre 1961', fait: 'Répression sanglante d’une manifestation algérienne à Paris.' },
      { date: '18 mars 1962', fait: 'Accords d’Évian ; cessez-le-feu le 19 mars.' },
      { date: '3 juillet 1962', fait: 'L’indépendance de l’Algérie est reconnue.' },
    ],
    leSaisTu:
      'Jusqu’en 1999, aucun texte français ne disait « guerre d’Algérie » : les papiers officiels parlaient d’« opérations de maintien de l’ordre en Afrique du Nord ». Les anciens combattants ont mis trente-sept ans à obtenir un mot — celui qui donnait son nom à ce qu’ils avaient vécu.',
    aRetenir: [
      'La guerre d’Algérie commence le 1ᵉʳ novembre 1954 avec les attentats du FLN, la « Toussaint rouge ».',
      'En 1954, un million d’Européens vivent en Algérie face à neuf millions de musulmans aux droits inégaux.',
      'La bataille d’Alger (1957) démantèle le FLN de la ville au prix d’un recours systématique à la torture.',
      'Les accords d’Évian sont signés le 18 mars 1962 ; l’indépendance est reconnue le 3 juillet 1962.',
      'Près de 800 000 pieds-noirs quittent l’Algérie en 1962 ; les harkis, désarmés, sont massacrés par milliers.',
      'La loi du 18 octobre 1999 reconnaît officiellement le terme de « guerre d’Algérie ».',
    ],
    mots: [
      {
        mot: 'FLN',
        sens: 'Front de libération nationale, mouvement fondé en 1954 qui mène la lutte armée pour l’indépendance algérienne.',
      },
      {
        mot: 'OAS',
        sens: 'Organisation armée secrète, groupe clandestin créé en 1961 pour empêcher l’indépendance par les attentats.',
      },
      {
        mot: 'Harki',
        sens: 'Algérien engagé comme supplétif dans l’armée française ; beaucoup furent abandonnés puis massacrés en 1962.',
      },
      {
        mot: 'Pied-noir',
        sens: 'Nom donné aux Européens d’Algérie, presque tous rapatriés en France en 1962.',
      },
      {
        mot: 'Autodétermination',
        sens: 'Droit d’un peuple à choisir lui-même son statut, ici par le référendum du 1ᵉʳ juillet 1962.',
      },
    ],
    lies: [
      'guerre-d-indochine',
      'naissance-de-la-ve-republique',
      'charles-de-gaulle',
      'francois-mitterrand',
      'pierre-mendes-france',
    ],
    niveaux: ['3e', 'Tle'],
    programme: 'Indépendances et construction de nouveaux États',
    tags: [
      'Algérie',
      'FLN',
      'OAS',
      'Évian',
      'pieds-noirs',
      'harkis',
      'Toussaint rouge',
      'bataille d’Alger',
      'décolonisation',
      'appelés',
      '1962',
    ],
  },
  {
    id: 'mai-68',
    volet: 'evenements',
    nom: 'Mai 68',
    date: 'mai – juin 1968',
    tri: 1968,
    fin: 1968,
    periode: 'contemporain',
    emoji: '✊',
    lieu: 'Nanterre, le Quartier latin, et toute la France',
    accroche:
      'Une poignée d’étudiants de Nanterre, puis neuf millions de grévistes : en un mois, la France découvre qu’elle a changé sans se l’être dit.',
    citations: [
      {
        texte: 'Il est interdit d’interdire.',
        qui: 'Les murs du Quartier latin',
        contexte: 'Slogan peint sur les murs de la Sorbonne et de Nanterre, mai 1968.',
        sens:
          'Le mot d’ordre d’une génération contre toutes les autorités à la fois : le père, le patron, le professeur, l’État.',
      },
      {
        texte: 'La réforme, oui ; la chienlit, non.',
        qui: 'Charles de Gaulle',
        contexte:
          'En Conseil des ministres le 19 mai 1968, rapporté par Alain Peyrefitte et repris le soir même par les radios.',
        sens:
          'La « chienlit », c’est le désordre de carnaval. Le mot, jugé méprisant, se retourne contre lui : les manifestants s’en font des pancartes.',
      },
      {
        texte:
          'Dans les circonstances présentes, je ne me retirerai pas… Je dissous aujourd’hui l’Assemblée nationale.',
        qui: 'Charles de Gaulle',
        contexte:
          'Allocution radiodiffusée de quatre minutes, le 30 mai 1968, au lendemain de sa disparition à Baden-Baden.',
        sens:
          'Il renvoie le conflit vers les urnes. Dans l’heure, des centaines de milliers de partisans descendent les Champs-Élysées.',
      },
    ],
    reperes: [
      'Le 22 mars 1968, des étudiants occupent la tour administrative de la faculté de Nanterre.',
      'Dans la nuit du 10 au 11 mai, la « nuit des barricades » ensanglante le Quartier latin.',
      'La grève générale touche 7 à 9 millions de salariés : la plus grande grève de l’histoire de France.',
      'Les accords de Grenelle (27 mai) augmentent le SMIG de 35 % et les salaires de 10 %.',
      'Le 30 mai, de Gaulle dissout l’Assemblée ; les législatives de juin donnent 358 sièges sur 487 à sa majorité.',
    ],
    causes: [
      'Une université débordée : plus de 500 000 étudiants en 1968, trois fois plus qu’en 1958, dans des facultés construites pour beaucoup moins.',
      'Une France très jeune, née du baby-boom, dans une société encore encadrée : autorité du père, du patron, du professeur, télévision d’État.',
      'Des Trente Glorieuses qui ont enrichi le pays sans partager : SMIG bas, cadences d’usine, ouvriers spécialisés et immigrés mal logés.',
      'De Gaulle au pouvoir depuis dix ans, et un slogan qui court : « Dix ans, ça suffit ! »',
      'Un air du temps international : la guerre du Viêt Nam, Berkeley, Berlin, le printemps de Prague.',
      'L’étincelle : Nanterre fermée le 2 mai, la Sorbonne évacuée par la police le 3 — chose qui ne s’était pas vue depuis des siècles.',
    ],
    recit: [
      {
        titre: 'Nanterre, une faculté dans la boue',
        texte:
          'La faculté de **Nanterre** a quatre ans. On l’a bâtie en 1964 dans la banlieue ouest, au bord d’un **bidonville**, pour désengorger la Sorbonne ; elle accueille déjà plus d’étudiants qu’elle n’en peut tenir, dans un règlement de pensionnat qui interdit aux garçons l’accès aux résidences de filles. Le **22 mars 1968**, après l’arrestation de militants ayant attaqué le siège parisien d’American Express en protestation contre la **guerre du Viêt Nam**, cent cinquante étudiants occupent la tour administrative. Le **mouvement du 22 Mars** est né ; **Daniel Cohn-Bendit** en devient la figure. Le doyen ferme la faculté le **2 mai**. Le mouvement se replie sur la **Sorbonne**, que le recteur fait évacuer par la police le **3 mai** : des centaines d’arrestations dans la cour d’une université, image que la France n’avait plus vue depuis très longtemps.',
      },
      {
        titre: 'La nuit des barricades',
        texte:
          'La contestation gonfle pendant une semaine. Dans la **nuit du 10 au 11 mai**, les étudiants dressent une soixantaine de **barricades** rue Gay-Lussac, avec les pavés, les grilles d’arbres et les voitures du Quartier latin. Les CRS chargent vers deux heures du matin. Au petit jour, le bilan officiel compte **367 blessés**, 468 interpellations et 188 voitures brûlées. La différence avec toutes les émeutes précédentes tient à un objet : le **transistor**. Europe n° 1 et RTL retransmettent la nuit en direct, minute par minute, et la France entière l’écoute dans sa cuisine. L’opinion bascule du côté des étudiants. Le **13 mai**, les syndicats appellent à une grève et à une manifestation d’une journée : des centaines de milliers de personnes défilent de la République à Denfert-Rochereau aux cris de « Dix ans, ça suffit ! ».',
      },
      {
        titre: 'Neuf millions de grévistes',
        texte:
          'Ce qui devait durer un jour ne s’arrête plus. Le 14 mai, les ouvriers de **Sud-Aviation**, à Nantes, occupent leur usine et enferment le directeur. Le 16, c’est **Renault-Billancourt**, la plus grande usine de France. En une semaine, le pays s’immobilise : **7 à 9 millions de grévistes**, la plus grande grève de l’histoire française. Plus de trains, plus de courrier, plus d’essence, les banques fermées, les ordures dans les rues. Les revendications ne sont pas celles des étudiants : ce sont les salaires, les cadences, le droit de s’organiser dans l’entreprise. Du 25 au 27 mai, rue de Grenelle, **Georges Pompidou** négocie avec les syndicats : les **accords de Grenelle** prévoient **+35 % pour le SMIG**, **+10 % sur les salaires**, la reconnaissance de la **section syndicale d’entreprise**. Georges Séguy va les présenter aux ouvriers de Billancourt, qui les refusent par acclamation. Le pouvoir paraît suspendu dans le vide.',
      },
      {
        titre: 'Le 30 mai, et les urnes',
        texte:
          'Le **29 mai**, de Gaulle disparaît. Sans prévenir ses ministres, il s’envole pour **Baden-Baden** rencontrer le général **Massu**, qui commande les troupes françaises en Allemagne : il va s’assurer que l’armée le soutient. Le lendemain, **30 mai**, il parle quatre minutes à la radio — pas à la télévision, en grève : il reste, il garde Pompidou, il **dissout l’Assemblée nationale**. Dans l’heure, entre cinq cent mille et un million de personnes descendent les **Champs-Élysées** en soutien. L’essence revient, les usines rouvrent l’une après l’autre en juin. Aux législatives des **23 et 30 juin**, la majorité gaulliste remporte **358 sièges sur 487** : la plus large victoire parlementaire de la Ve République. La rue avait gagné la rue ; elle a perdu les urnes. De Gaulle, lui, s’en ira onze mois plus tard, battu au référendum du 27 avril 1969.',
      },
      {
        titre: 'Ce qui a vraiment changé',
        texte:
          'Le régime n’a pas bougé — la société, si. Sur les salaires, Grenelle tient : le **SMIG** bondit et le **droit syndical dans l’entreprise** est inscrit dans la loi du 27 décembre 1968. À l’université, la **loi Faure** du 12 novembre 1968 crée des universités autonomes où étudiants et enseignants siègent ensemble. Surtout, l’autorité cesse d’aller de soi : dans la famille, à l’école, à l’usine, on discute désormais ce qui se décidait. Les années qui suivent en portent la marque — naissance du **MLF** en 1970, montée de l’écologie politique, majorité abaissée à **18 ans** en 1974, **loi Veil** et divorce par consentement mutuel en 1975. Mai 68 n’a renversé aucun pouvoir ; il a déplacé ce que les Français acceptaient qu’on leur impose.',
      },
    ],
    consequences: [
      'Les accords de Grenelle relèvent le SMIG de 35 % et les salaires d’environ 10 %.',
      'La loi du 27 décembre 1968 reconnaît la section syndicale dans l’entreprise.',
      'La loi Faure du 12 novembre 1968 réorganise l’université autour d’établissements autonomes.',
      'Les législatives de juin 1968 donnent à la majorité gaulliste 358 sièges sur 487 : la contestation perd aux urnes.',
      'De Gaulle quitte le pouvoir onze mois plus tard, après l’échec du référendum du 27 avril 1969.',
      'Une révolution des mœurs suit : féminisme, contestation de l’autorité, majorité à 18 ans en 1974, loi Veil en 1975.',
    ],
    chiffres: [
      { valeur: '7 à 9 millions', quoi: 'de grévistes : la plus grande grève de l’histoire de France' },
      { valeur: '367', quoi: 'blessés dans la nuit du 10 au 11 mai' },
      { valeur: '+35 %', quoi: 'd’augmentation du SMIG aux accords de Grenelle' },
      { valeur: '358', quoi: 'sièges sur 487 pour la majorité aux législatives de juin' },
    ],
    chrono: [
      { date: '22 mars 1968', fait: 'Occupation de la tour administrative de Nanterre.' },
      { date: '3 mai 1968', fait: 'La police évacue la Sorbonne.' },
      { date: 'nuit du 10 au 11 mai', fait: 'Nuit des barricades rue Gay-Lussac.' },
      { date: '13 mai 1968', fait: 'Grève et manifestation d’une journée à Paris.' },
      { date: '16 mai 1968', fait: 'Renault-Billancourt entre en grève et s’occupe.' },
      { date: '27 mai 1968', fait: 'Accords de Grenelle, rejetés par les ouvriers de Billancourt.' },
      { date: '29 mai 1968', fait: 'De Gaulle s’envole pour Baden-Baden.' },
      { date: '30 mai 1968', fait: 'Dissolution de l’Assemblée ; défilé des Champs-Élysées.' },
      { date: '23 et 30 juin 1968', fait: 'Raz-de-marée gaulliste aux législatives.' },
    ],
    leSaisTu:
      'Le slogan « Sous les pavés, la plage » n’est pas une image : les pavés du Quartier latin reposaient sur un lit de sable, qui apparaissait dès qu’on les arrachait pour bâtir une barricade. Après 1968, la Ville de Paris a fait goudronner la plupart de ces rues.',
    aRetenir: [
      'Mai 68 commence à Nanterre le 22 mars 1968 et gagne le Quartier latin début mai.',
      'La nuit des barricades, du 10 au 11 mai, retourne l’opinion en faveur des étudiants.',
      'La grève générale mobilise 7 à 9 millions de salariés : c’est la plus grande grève de l’histoire de France.',
      'Les accords de Grenelle (27 mai) augmentent le SMIG de 35 % mais sont rejetés par la base ouvrière.',
      'Le 30 mai, de Gaulle dissout l’Assemblée et gagne largement les législatives de juin.',
    ],
    mots: [
      {
        mot: 'SMIG',
        sens: 'Salaire minimum interprofessionnel garanti, ancêtre du SMIC : le plus bas salaire horaire légal.',
      },
      {
        mot: 'Grève générale',
        sens: 'Arrêt du travail dans tous les secteurs en même temps, jusqu’à paralyser un pays entier.',
      },
      {
        mot: 'Section syndicale',
        sens: 'Représentation d’un syndicat à l’intérieur même de l’entreprise, reconnue par la loi en décembre 1968.',
      },
      {
        mot: 'Dissolution',
        sens: 'Décision du président de mettre fin à l’Assemblée nationale et de convoquer de nouvelles élections.',
      },
    ],
    lies: [
      'charles-de-gaulle',
      'georges-pompidou',
      'naissance-de-la-ve-republique',
      'loi-veil-1975',
    ],
    niveaux: ['3e', 'Tle'],
    programme: 'Françaises et Français dans une République repensée',
    tags: [
      'Mai 68',
      'Nanterre',
      'Sorbonne',
      'barricades',
      'Grenelle',
      'grève générale',
      'Cohn-Bendit',
      'Quartier latin',
      'de Gaulle',
      'SMIG',
    ],
  },
  {
    id: 'loi-veil-1975',
    volet: 'evenements',
    nom: 'La loi Veil',
    date: '17 janvier 1975',
    tri: 1975,
    periode: 'contemporain',
    emoji: '♀️',
    lieu: 'Assemblée nationale, Paris',
    accroche:
      'Une femme seule à la tribune devant 490 députés presque tous des hommes : en trois jours de débat, Simone Veil fait entrer l’avortement dans la loi.',
    citations: [
      {
        texte:
          'Je voudrais tout d’abord vous faire partager une conviction de femme — je m’excuse de le faire devant cette Assemblée presque exclusivement composée d’hommes.',
        qui: 'Simone Veil',
        contexte:
          'Premiers mots de son discours à la tribune de l’Assemblée nationale, le 26 novembre 1974.',
        sens:
          'Neuf femmes siégeaient alors parmi 490 députés. La phrase dit l’obstacle avant même d’aborder le texte.',
      },
      {
        texte:
          'Aucune femme ne recourt de gaieté de cœur à l’avortement. Il suffit d’écouter les femmes.',
        qui: 'Simone Veil',
        contexte: 'Même discours, le 26 novembre 1974, devant une Assemblée houleuse.',
        sens:
          'Elle défend une loi d’exception, pas un droit banalisé : l’argument qui a convaincu une partie des hésitants.',
      },
      {
        texte: 'Je déclare que je suis l’une d’elles. Je déclare avoir avorté.',
        qui: 'Le manifeste des 343',
        contexte:
          'Publié par *Le Nouvel Observateur* le 5 avril 1971, rédigé par Simone de Beauvoir.',
        sens:
          'Trois cent quarante-trois femmes s’accusent publiquement d’un délit puni de prison, pour obliger la justice à choisir entre les poursuivre toutes ou changer la loi.',
      },
    ],
    reperes: [
      'La loi du 31 juillet 1920 interdisait l’avortement et jusqu’à l’information sur la contraception.',
      'On estimait entre 300 000 et un million le nombre d’avortements clandestins par an en France.',
      'Le manifeste des 343 (1971) et le procès de Bobigny (1972) retournent l’opinion.',
      'Le 29 novembre 1974, l’Assemblée adopte le texte par 284 voix contre 189, grâce aux voix de la gauche.',
      'Votée pour cinq ans à titre d’essai, la loi est rendue définitive le 31 décembre 1979.',
    ],
    causes: [
      'La loi du 31 juillet 1920, qui punit l’avortement de prison et interdit toute propagande sur la contraception.',
      'Des centaines de milliers d’avortements clandestins chaque année, et des femmes qui en meurent, en restent stériles ou vont en prison.',
      'Une inégalité criante : la clinique en Suisse ou à Londres pour celles qui ont l’argent, la « faiseuse d’anges » pour les autres.',
      'La loi Neuwirth de 1967, qui autorise la contraception mais reste des années sans décrets d’application.',
      'Le manifeste des 343 en avril 1971, puis le procès de Bobigny en novembre 1972, qui déplacent l’opinion.',
      'L’élection de Valéry Giscard d’Estaing en 1974, qui en fait une réforme de début de mandat et la confie à Simone Veil.',
    ],
    recit: [
      {
        titre: 'Ce que produisait la loi de 1920',
        texte:
          'Au lendemain d’une guerre qui a tué 1,4 million d’hommes, la **loi du 31 juillet 1920** frappe l’avortement de peines de prison et interdit même d’informer sur les moyens d’éviter une grossesse. Sous Vichy, l’avortement devient un crime contre la sûreté de l’État : **Marie-Louise Giraud** est guillotinée pour cela en juillet 1943. Après-guerre, la loi tient, mais la réalité l’a quittée : on estime entre **300 000 et un million** les avortements clandestins annuels — chiffre impossible à établir, précisément parce qu’il est clandestin. Les conséquences, elles, sont visibles dans les hôpitaux : hémorragies, septicémies, stérilités, décès. Et l’injustice est sociale avant d’être morale : celles qui ont de l’argent partent en **Angleterre**, en **Suisse** ou aux **Pays-Bas** ; les autres vont chez la « faiseuse d’anges », avec une sonde ou une aiguille à tricoter. La **loi Neuwirth** autorise la contraception en **1967**, mais ses décrets d’application n’arrivent qu’entre 1969 et 1972.',
      },
      {
        titre: 'Les 343 et le procès de Bobigny',
        texte:
          'Le **5 avril 1971**, *Le Nouvel Observateur* publie un texte écrit par **Simone de Beauvoir** et signé par **343 femmes** : elles déclarent avoir avorté, donc avoir commis un délit. Parmi elles, Catherine Deneuve, Marguerite Duras, Françoise Sagan, Delphine Seyrig, des anonymes surtout. Le pari est simple : la justice ne poursuivra pas trois cent quarante-trois personnes à la fois. Elle ne le fait pas. L’année suivante, le procès de **Bobigny** donne un visage à l’affaire : **Marie-Claire Chevalier**, seize ans, enceinte après un viol, avortée avec l’aide de sa mère, est dénoncée par son violeur. Son avocate, **Gisèle Halimi**, retourne l’audience : ce n’est plus l’adolescente qu’on juge, c’est la loi de 1920. Marie-Claire est **relaxée le 22 novembre 1972**, sa mère condamnée à une amende avec sursis. En 1973, **331 médecins** déclarent à leur tour pratiquer des avortements. La loi est morte avant d’être abrogée.',
      },
      {
        titre: 'Trois jours et deux nuits de débat',
        texte:
          '**Valéry Giscard d’Estaing**, élu en mai 1974, confie le dossier à sa ministre de la Santé, **Simone Veil** — magistrate, ancienne déportée d’Auschwitz, et l’une des rares femmes du gouvernement. Elle monte à la tribune le **26 novembre 1974** devant une Assemblée où siègent **neuf femmes sur 490 députés**. Le débat dure vingt-cinq heures, sur trois jours et deux nuits. Les attaques viennent surtout de son propre camp : on lui parle d’« embryons jetés au four crématoire », on évoque ses enfants, on l’injurie. Elle ne répond pas sur ce terrain et tient son argument : l’avortement clandestin existe, il tue, et la loi doit organiser une exception plutôt que fermer les yeux. Dans la nuit du 28 au **29 novembre 1974**, le texte est adopté par **284 voix contre 189** — mais seule une minorité de la majorité l’a voté : **181 des 284 voix viennent de la gauche**, socialiste et communiste. Le Sénat suit le 20 décembre ; la loi est **promulguée le 17 janvier 1975**.',
      },
      {
        titre: 'Cinq ans d’essai, puis un droit',
        texte:
          'La loi de 1975 n’ouvre pas un droit sans condition : l’interruption volontaire de grossesse est possible avant la fin de la **dixième semaine**, après un entretien social et une semaine de réflexion, par un médecin qui peut invoquer sa **clause de conscience**, dans un établissement agréé — et elle n’est **pas remboursée**. Surtout, elle est votée **pour cinq ans seulement**, à titre d’expérience : il faudra revenir devant le Parlement. La **loi du 31 décembre 1979** la rend définitive, de nouveau grâce aux voix de la gauche. La suite s’écrit par étapes : **remboursement** par la Sécurité sociale en 1982, création du **délit d’entrave** en 1993, délai porté à **douze semaines** en 2001 puis à **quatorze** en 2022. En mars **2024**, le Congrès réuni à Versailles inscrit la liberté de recourir à l’IVG dans la **Constitution**. Simone Veil, entrée au Panthéon en 2018, n’aura pas vu ce dernier vote.',
      },
    ],
    consequences: [
      'L’interruption volontaire de grossesse devient légale en France, sous conditions, à partir du 17 janvier 1975.',
      'Les avortements clandestins de masse et leur mortalité reculent rapidement.',
      'Une loi de droite adoptée surtout par les voix de la gauche : un vote qui traverse les camps politiques.',
      'La loi du 31 décembre 1979 la rend définitive ; le remboursement arrive en 1982 et le délit d’entrave en 1993.',
      'Le délai légal passe à douze semaines en 2001, puis à quatorze en 2022.',
      'En mars 2024, la liberté de recourir à l’IVG est inscrite dans la Constitution française.',
    ],
    chiffres: [
      { valeur: '343', quoi: 'femmes signataires du manifeste d’avril 1971' },
      { valeur: '9', quoi: 'femmes parmi les 490 députés de l’Assemblée en 1974' },
      { valeur: '284', quoi: 'voix pour la loi, contre 189' },
      { valeur: '5 ans', quoi: 'la durée d’essai du texte, avant sa reconduction définitive en 1979' },
    ],
    chrono: [
      { date: '31 juillet 1920', fait: 'Loi interdisant l’avortement et la propagande contraceptive.' },
      { date: '28 décembre 1967', fait: 'Loi Neuwirth : la contraception est autorisée.' },
      { date: '5 avril 1971', fait: 'Publication du manifeste des 343.' },
      { date: '22 novembre 1972', fait: 'Relaxe de Marie-Claire Chevalier au procès de Bobigny.' },
      { date: '26 novembre 1974', fait: 'Discours de Simone Veil à l’Assemblée nationale.' },
      { date: '29 novembre 1974', fait: 'Adoption par 284 voix contre 189.' },
      { date: '17 janvier 1975', fait: 'Promulgation de la loi relative à l’IVG.' },
      { date: '31 décembre 1979', fait: 'La loi est rendue définitive.' },
      { date: 'mars 2024', fait: 'L’IVG est inscrite dans la Constitution.' },
    ],
    leSaisTu:
      'Pendant le débat et les mois qui ont suivi, Simone Veil a reçu des lettres d’injures et de menaces, et des croix gammées ont été peintes sur sa porte. Elle a gardé ces lettres et en a parlé dans ses mémoires, *Une vie*, publiées en 2007.',
    aRetenir: [
      'La loi du 31 juillet 1920 interdisait l’avortement et l’information sur la contraception.',
      'Le manifeste des 343 (1971) et le procès de Bobigny (1972) retournent l’opinion publique.',
      'Simone Veil défend le projet à l’Assemblée le 26 novembre 1974 ; il est adopté par 284 voix contre 189.',
      'La loi est promulguée le 17 janvier 1975 et votée pour cinq ans seulement.',
      'La loi du 31 décembre 1979 la rend définitive ; l’IVG entre dans la Constitution en mars 2024.',
    ],
    mots: [
      {
        mot: 'IVG',
        sens: 'Interruption volontaire de grossesse : l’avortement pratiqué à la demande de la femme, dans le cadre de la loi.',
      },
      {
        mot: 'Clause de conscience',
        sens: 'Droit d’un médecin de refuser de pratiquer un acte, à charge pour lui d’orienter la patiente ailleurs.',
      },
      {
        mot: 'Promulgation',
        sens: 'Signature par le président de la République qui rend applicable une loi votée par le Parlement.',
      },
      {
        mot: 'Manifeste',
        sens: 'Texte public par lequel un groupe proclame une position, ici en s’exposant volontairement à la loi.',
      },
    ],
    lies: ['simone-veil', 'mai-68', 'abolition-de-la-peine-de-mort'],
    niveaux: ['3e'],
    programme: 'Françaises et Français dans une République repensée',
    tags: [
      'loi Veil',
      'IVG',
      'avortement',
      'Simone Veil',
      '1975',
      'manifeste des 343',
      'Bobigny',
      'Gisèle Halimi',
      'droits des femmes',
      'Neuwirth',
    ],
  },
  {
    id: 'abolition-de-la-peine-de-mort',
    volet: 'evenements',
    nom: 'L’abolition de la peine de mort',
    date: '9 octobre 1981',
    tri: 1981,
    periode: 'contemporain',
    emoji: '⚖️',
    lieu: 'Assemblée nationale, Paris',
    accroche:
      'Le 9 octobre 1981, la France abolit la peine de mort alors que deux Français sur trois y sont encore attachés : une loi votée contre les sondages.',
    citations: [
      {
        texte:
          'J’ai l’honneur, au nom du gouvernement de la République, de demander à l’Assemblée nationale l’abolition de la peine de mort en France.',
        qui: 'Robert Badinter',
        contexte:
          'Première phrase de son discours à la tribune de l’Assemblée nationale, le 17 septembre 1981.',
        sens:
          'Le garde des Sceaux ne plaide pas d’abord, il annonce : la décision est prise, le débat portera sur les raisons.',
      },
      {
        texte: 'Demain, grâce à vous, la justice française ne sera plus une justice qui tue.',
        qui: 'Robert Badinter',
        contexte: 'Fin du même discours, le 17 septembre 1981.',
        sens:
          'La formule qui est restée : ce qui est en cause n’est pas le sort des condamnés, mais ce que la justice s’autorise en notre nom.',
      },
      {
        texte: 'Je vote l’abolition pure, simple et définitive de la peine de mort.',
        qui: 'Victor Hugo',
        contexte: 'Devant l’Assemblée constituante, le 15 septembre 1848, cent trente-trois ans plus tôt.',
        sens:
          'L’abolition a été réclamée par tous les régimes et refusée par tous : Hugo en 1848, Briand en 1908, Jaurès à sa suite.',
      },
      {
        texte:
          'Dans ma conscience profonde […] je suis contre la peine de mort. Et je n’ai pas besoin de lire les sondages qui disent le contraire.',
        qui: 'François Mitterrand',
        contexte:
          'Sur TF1, dans l’émission *Cartes sur table*, le 16 mars 1981, en pleine campagne présidentielle.',
        sens:
          'Il annonce l’abolition avant d’être élu, en sachant l’opinion contre lui : le vote de septembre ne surprendra personne.',
      },
    ],
    reperes: [
      'La dernière exécution en France a lieu le 10 septembre 1977, à Marseille : c’est la dernière d’Europe occidentale.',
      'En 1981, les sondages donnent environ 62 % des Français favorables au maintien de la peine de mort.',
      'Robert Badinter, avocat devenu garde des Sceaux, avait vu guillotiner l’un de ses clients en 1972.',
      'Le discours du 17 septembre 1981 est suivi d’un vote à l’Assemblée par 363 voix contre 117.',
      'La loi est adoptée le 30 septembre par le Sénat et promulguée le 9 octobre 1981.',
    ],
    causes: [
      'Deux siècles de combat abolitionniste français, de la Constituante de 1791 à Victor Hugo, Briand et Jaurès, toujours battu au dernier vote.',
      'L’isolement de la France : en 1981, elle est le dernier pays d’Europe occidentale à exécuter ses condamnés.',
      'Des affaires qui montrent l’irréparable : Roger Bontems guillotiné en 1972 sans avoir tué, puis le doute jamais levé de l’affaire Ranucci (1976).',
      'L’expérience personnelle de Robert Badinter, avocat de Bontems puis de Patrick Henry, sauvé de la guillotine en 1977.',
      'L’engagement public de François Mitterrand en pleine campagne, le 16 mars 1981, et son élection le 10 mai.',
      'Une majorité parlementaire nouvelle, complétée par une partie de la droite — Jacques Chirac et Raymond Barre votent l’abolition.',
    ],
    recit: [
      {
        titre: 'Ce qu’un avocat a vu',
        texte:
          'En septembre 1971, une mutinerie à la prison de **Clairvaux** tourne au drame : deux otages, une infirmière et un surveillant, sont égorgés. Deux hommes sont jugés, **Claude Buffet** et **Roger Bontems**. L’enquête établit que Bontems n’a tué personne. Il est pourtant condamné à mort avec son complice, et tous deux sont guillotinés le **28 novembre 1972**. Son avocat, **Robert Badinter**, assiste à l’exécution — la loi l’exige. Il en ressort abolitionniste, non par théorie mais par ce qu’il a vu : une justice qui, pour punir un crime, en commet un autre, froidement, à l’aube, derrière des murs. Cinq ans plus tard, au procès de **Troyes**, il défend **Patrick Henry**, meurtrier d’un enfant de sept ans, dans une France qui réclame sa tête. Il ne plaide pas l’innocence : il met la peine de mort elle-même en accusation, et il arrache la perpétuité. Ce jour-là, en janvier 1977, l’abolition devient possible.',
      },
      {
        titre: 'La France de 1981',
        texte:
          'Le **10 septembre 1977**, **Hamida Djandoubi** est guillotiné à la prison des Baumettes, à Marseille. Personne ne le sait encore, mais c’est la dernière exécution capitale de France — et la dernière d’**Europe occidentale**. Les condamnations, elles, continuent : des hommes attendent dans les couloirs des prisons que le président réponde à leur recours en grâce. L’opinion n’a pas bougé : les sondages de 1981 donnent environ **62 % des Français** favorables au maintien. C’est dans ce paysage que **François Mitterrand**, candidat, déclare sur TF1 le **16 mars 1981** qu’il est contre la peine de mort et qu’il n’a pas besoin des sondages pour le savoir. Élu le **10 mai**, il nomme Badinter **garde des Sceaux** en juin et gracie les condamnés en attente. Parmi eux, **Philippe Maurice**, le dernier condamné à mort français.',
      },
      {
        titre: 'Le 17 septembre 1981',
        texte:
          'Le **17 septembre 1981**, Robert Badinter monte à la tribune de l’Assemblée nationale. Il commence sans préambule : « J’ai l’honneur, au nom du gouvernement de la République, de demander à l’Assemblée nationale l’abolition de la peine de mort en France. » Son discours dure une heure. Il rappelle que la justice se trompe et qu’aucune erreur n’est réparable, que la peine de mort n’a jamais fait reculer le crime, qu’elle frappe surtout les pauvres et les mal défendus, et que la France est le dernier pays de l’Europe des libertés à guillotiner. Il termine par la phrase qui restera : « Demain, grâce à vous, la justice française ne sera plus une justice qui tue. » Le **18 septembre**, l’Assemblée vote l’abolition par **363 voix contre 117** ; la droite se divise, et **Jacques Chirac** comme **Raymond Barre** votent pour. Le **Sénat** suit le 30 septembre par 160 voix contre 126. La **loi du 9 octobre 1981** est publiée le lendemain.',
      },
      {
        titre: 'Deux siècles pour y arriver',
        texte:
          'L’abolition avait été demandée dès **1791** à la Constituante, votée par la Convention en **1795** pour « le jour de la paix générale » — jour qui n’est jamais venu —, réclamée par **Victor Hugo** en 1848, par **Aristide Briand** en 1908 devant une Chambre qui la rejette, puis par Jaurès et par Camus. La dernière exécution publique, celle d’Eugène Weidmann à **Versailles le 17 juin 1939**, avait tellement choqué qu’on avait décidé de guillotiner désormais à l’abri des regards : on ne supprimait pas la peine, on la cachait. Après 1981, la France verrouille : ratification du **protocole n° 6** de la Convention européenne des droits de l’homme en 1986, puis du protocole n° 13 ; et surtout, la **loi constitutionnelle du 23 février 2007** inscrit dans la Constitution un article 66-1 : « Nul ne peut être condamné à la peine de mort. » Rétablir la guillotine supposerait désormais de réviser la Constitution.',
      },
    ],
    consequences: [
      'La peine de mort disparaît du droit français : les condamnés en attente sont graciés, la guillotine entre au musée.',
      'La France ratifie le protocole n° 6 de la Convention européenne des droits de l’homme en 1986, puis le protocole n° 13 en 2007.',
      'La loi constitutionnelle du 23 février 2007 inscrit l’abolition dans la Constitution (article 66-1).',
      'La France milite depuis pour un moratoire universel sur les exécutions aux Nations unies.',
      'L’opinion finit par basculer : la demande de rétablissement devient minoritaire dans les années 2000.',
    ],
    chiffres: [
      { valeur: '363', quoi: 'voix pour l’abolition à l’Assemblée, contre 117' },
      { valeur: '62 %', quoi: 'des Français favorables au maintien de la peine de mort en 1981' },
      { valeur: '1977', quoi: 'la dernière exécution en France, le 10 septembre' },
      { valeur: '2007', quoi: 'l’abolition inscrite dans la Constitution' },
    ],
    chrono: [
      { date: '1791', fait: 'Première demande d’abolition devant la Constituante.' },
      { date: '15 septembre 1848', fait: 'Victor Hugo plaide l’abolition devant les constituants.' },
      { date: '17 juin 1939', fait: 'Dernière exécution publique, à Versailles.' },
      { date: '28 novembre 1972', fait: 'Buffet et Bontems guillotinés ; Badinter y assiste.' },
      { date: 'janvier 1977', fait: 'Patrick Henry échappe à la guillotine au procès de Troyes.' },
      { date: '10 septembre 1977', fait: 'Dernière exécution en France, à Marseille.' },
      { date: '16 mars 1981', fait: 'Mitterrand annonce son opposition à la peine de mort.' },
      { date: '17 septembre 1981', fait: 'Discours de Robert Badinter à l’Assemblée.' },
      { date: '9 octobre 1981', fait: 'Loi portant abolition de la peine de mort.' },
      { date: '23 février 2007', fait: 'L’abolition entre dans la Constitution.' },
    ],
    leSaisTu:
      'Le dernier condamné à mort français s’appelle Philippe Maurice. Condamné en octobre 1980, gracié par François Mitterrand en 1981, il a passé son baccalauréat puis une thèse en prison, et est devenu historien médiéviste, spécialiste du Gévaudan.',
    aRetenir: [
      'La dernière exécution en France a lieu le 10 septembre 1977 ; c’est la dernière d’Europe occidentale.',
      'En 1981, environ 62 % des Français restent favorables à la peine de mort.',
      'Robert Badinter défend l’abolition à l’Assemblée nationale le 17 septembre 1981.',
      'Le texte est voté par 363 voix contre 117 et promulgué le 9 octobre 1981.',
      'La loi constitutionnelle du 23 février 2007 inscrit l’abolition dans la Constitution.',
    ],
    mots: [
      {
        mot: 'Garde des Sceaux',
        sens: 'Autre nom du ministre de la Justice, qui conserve le sceau de l’État servant à authentifier les lois.',
      },
      {
        mot: 'Grâce présidentielle',
        sens: 'Pouvoir du président de dispenser un condamné de tout ou partie de sa peine, sans annuler la condamnation.',
      },
      {
        mot: 'Loi constitutionnelle',
        sens: 'Loi qui modifie la Constitution elle-même, adoptée par référendum ou par le Congrès réuni à Versailles.',
      },
      {
        mot: 'Moratoire',
        sens: 'Suspension décidée d’une pratique, ici des exécutions, sans que la loi soit encore changée.',
      },
    ],
    lies: [
      'francois-mitterrand',
      'victor-hugo',
      'loi-veil-1975',
      'naissance-de-la-ve-republique',
    ],
    niveaux: ['3e'],
    programme: 'Françaises et Français dans une République repensée',
    tags: [
      'peine de mort',
      'abolition',
      'Badinter',
      '1981',
      'guillotine',
      'Mitterrand',
      'justice',
      'Victor Hugo',
      'Constitution',
      'Patrick Henry',
    ],
  },
]
