// -----------------------------------------------------------------------------
// APRÈS 1945 — CE QU’ON A BÂTI SUR LES RUINES.
//
// Six fiches, six fondations encore debout : le bulletin de vote donné aux
// Françaises, une organisation mondiale pour empêcher la guerre suivante, une
// caisse commune contre la maladie et la vieillesse, le monde coupé en deux
// camps, une liste de droits valable pour tout être humain, et six pays qui
// mettent leurs douanes en commun.
//
// Ces six textes ont un point commun : ils sont écrits par des gens qui
// sortent de la guerre et qui savent exactement ce qu’ils veulent empêcher.
// D’où le ton : on date, on chiffre, on dit ce que chaque texte peut faire —
// et ce qu’il ne peut pas. Cf. `docs/encyclopedie.md`.
// -----------------------------------------------------------------------------

import type { Evenement } from '../types'

export const EVENEMENTS_CONTEMPORAIN_1945: Evenement[] = [
  {
    id: 'droit-de-vote-des-femmes-1944',
    volet: 'evenements',
    nom: 'Le droit de vote des femmes',
    date: '21 avril 1944',
    tri: 1944,
    periode: 'contemporain',
    emoji: '🗳️',
    lieu: 'Alger, siège du Gouvernement provisoire',
    accroche:
      'Une ordonnance signée à Alger donne enfin le vote aux Françaises : elles voteront le 29 avril 1945, un demi-siècle après les Néo-Zélandaises.',
    citations: [
      {
        texte: 'Les femmes sont électrices et éligibles dans les mêmes conditions que les hommes.',
        qui: 'L’article 17 de l’ordonnance du 21 avril 1944',
        contexte:
          'Ordonnance portant organisation des pouvoirs publics en France après la Libération, signée à Alger par le général de Gaulle.',
        sens:
          'Une seule phrase, et rien d’autre : pas de condition d’âge différente, pas de délai, pas d’exception. Le retard de cinquante ans se rattrape en dix-sept mots.',
      },
      {
        texte:
          'Il y a des citoyens, il n’y a pas de citoyennes. C’est là un état violent : il faut qu’il cesse.',
        qui: 'Victor Hugo',
        contexte:
          'Lettre à Léon Richer, fondateur de la Ligue française pour le droit des femmes, le 8 juin 1872.',
      },
      {
        texte: 'Je ne vote pas, je ne paie pas.',
        qui: 'Hubertine Auclert',
        contexte:
          'En refusant de payer ses impôts, à Paris, en 1880 : elle réclame le droit de vote en retournant contre l’État son propre argument.',
        sens:
          'Pas de représentation, pas de contribution. L’huissier saisit ses meubles ; le journal *Le Droit des femmes*, qu’elle fonde, raconte la saisie.',
      },
      {
        texte:
          'La femme a le droit de monter sur l’échafaud ; elle doit avoir également celui de monter à la tribune.',
        qui: 'Olympe de Gouges',
        contexte:
          'Article X de sa Déclaration des droits de la femme et de la citoyenne, septembre 1791.',
        sens:
          'Elle sera guillotinée deux ans plus tard : la première moitié de la phrase s’est vérifiée cent cinquante-trois ans avant la seconde.',
      },
    ],
    reperes: [
      'L’ordonnance du 21 avril 1944 est signée à Alger, quand la moitié de la France est encore occupée.',
      'Les Françaises votent pour la première fois aux élections municipales du 29 avril 1945.',
      'Elles sont près de 13 millions d’électrices nouvelles, soit un peu plus de la moitié du corps électoral.',
      'Entre 1919 et 1936, la Chambre vote six fois le suffrage féminin ; le Sénat le bloque à chaque fois.',
      'La Nouvelle-Zélande vote dès 1893, l’Allemagne et le Royaume-Uni en 1918 : la France a un demi-siècle de retard.',
      'En octobre 1945, 33 femmes entrent à l’Assemblée constituante, sur 586 sièges.',
    ],
    causes: [
      'Un siècle de campagnes suffragistes, d’Olympe de Gouges (1791) à Hubertine Auclert, puis à Louise Weiss dans les années 1930.',
      'Le blocage du Sénat sous la IIIᵉ République : les sénateurs radicaux craignent que les femmes, jugées plus proches de l’Église, fassent voter « le curé ».',
      'Les deux guerres, où les femmes tiennent les usines, les champs, les hôpitaux et les administrations à la place des hommes mobilisés.',
      'L’engagement des femmes dans la Résistance : agents de liaison, boîtes aux lettres, passeuses, déportées — une revendication devenue impossible à refuser.',
      'L’exemple étranger : vingt-cinq pays votent déjà, et la France se présente comme la patrie des droits de l’homme.',
      'L’amendement déposé par le député communiste Fernand Grenier à l’Assemblée consultative d’Alger, adopté le 24 mars 1944 par 51 voix contre 16.',
    ],
    recit: [
      {
        titre: 'Un siècle de demandes',
        texte:
          'La demande est aussi vieille que la République. En **1790**, **Condorcet** publie *Sur l’admission des femmes au droit de cité* : si le droit vient de la raison, il n’a pas de sexe. En **1791**, **Olympe de Gouges** écrit sa *Déclaration des droits de la femme et de la citoyenne*, calquée article par article sur celle de 1789. La Révolution ne les suit pas, et le suffrage « universel » de **1848** ne concerne que les hommes : neuf millions d’électeurs, zéro électrice. **Hubertine Auclert** fonde en 1876 le premier journal suffragiste français et refuse de payer l’impôt ; en 1908, elle renverse une urne à Paris. Dans les années 1930, **Louise Weiss** invente la manifestation moderne : elle lâche des ballons sur la Concorde, s’enchaîne, fait campagne dans une fausse élection et se fait photographier — la presse suit, les sénateurs ne bougent pas.',
      },
      {
        titre: 'La Chambre dit oui, le Sénat dit non',
        texte:
          'Le **20 mai 1919**, la Chambre des députés vote le suffrage féminin par **344 voix contre 97** : c’est massif. Le texte part au **Sénat**, qui le laisse dormir trois ans et le rejette le **21 novembre 1922**. Le scénario recommence en 1925, 1932, 1935 et 1936 : la Chambre vote, le Sénat enterre. L’argument n’est presque jamais dit en public ; en commission, il est simple. Les sénateurs, majoritairement **radicaux** et attachés à la laïcité, sont persuadés que les femmes votent comme leur curé et qu’ouvrir l’urne, c’est rendre la France cléricale. En **1936**, Léon Blum nomme trois femmes sous-secrétaires d’État dans son gouvernement : elles peuvent gouverner la France, elles ne peuvent pas y voter. La IIIᵉ République mourra sans avoir franchi le pas.',
      },
      {
        titre: 'Alger, 24 mars 1944',
        texte:
          'La décision ne vient donc pas d’un parlement élu, mais d’une **assemblée provisoire réunie à Alger**, à 1 500 km de Paris, pendant que la France est occupée. Le **24 mars 1944**, le député communiste **Fernand Grenier** dépose un amendement d’une ligne : les femmes seront électrices et éligibles comme les hommes. Il est adopté par **51 voix contre 16**. Le **21 avril 1944**, l’ordonnance du Gouvernement provisoire reprend la formule à son **article 17**. Personne ne la fête : le pays est en guerre, le texte passe dans un journal officiel imprimé en Algérie. Il faudra attendre un an de plus, la Libération et la reconstitution des listes électorales, pour que la phrase devienne un bulletin.',
      },
      {
        titre: 'Le 29 avril 1945, le premier bulletin',
        texte:
          'Aux **élections municipales du 29 avril 1945**, les Françaises votent. La participation est forte, les files s’allongent, et la presse commente la tenue des électrices plus que leurs choix. Le **21 octobre 1945**, elles votent pour la première fois à une élection nationale, celle de l’Assemblée constituante, et y envoient **33 députées** sur 586 — 5,6 % des sièges. C’est peu, et ce sera longtemps le sommet : la proportion retombera sous 2 % dans les années 1950 et 1960, et il faudra la **loi sur la parité du 6 juin 2000** pour la faire remonter durablement. Le droit de vote ouvre une porte ; il ne remplit pas la salle.',
      },
      {
        titre: 'Voter ne suffit pas',
        texte:
          'Le préambule de la Constitution de **1946** grave le principe : « la loi garantit à la femme, dans tous les domaines, des droits égaux à ceux de l’homme ». La réalité civile met vingt ans à suivre. Jusqu’en **1965**, une femme mariée ne peut pas ouvrir un compte en banque ni exercer une profession sans l’autorisation de son mari, qui reste « chef de famille » jusqu’en **1970**. L’égalité politique de 1944 précède donc l’égalité juridique d’une génération entière, et l’égalité salariale n’est toujours pas atteinte. C’est ce décalage qui explique les combats suivants : la **loi Neuwirth** sur la contraception (1967), la **loi Veil** (1975), la parité (2000).',
      },
    ],
    consequences: [
      'Près de 13 millions d’électrices s’ajoutent au corps électoral : la moitié du pays entre en politique d’un coup.',
      '33 femmes sont élues à l’Assemblée constituante en octobre 1945, dont la future ministre Germaine Poinso-Chapuis.',
      'Le préambule de la Constitution de 1946 inscrit l’égalité des droits entre femmes et hommes dans tous les domaines.',
      'L’égalité civile reste très en retard : il faut attendre 1965 pour qu’une femme mariée travaille sans l’accord de son mari.',
      'La faible part des élues conduira, un demi-siècle plus tard, à la loi sur la parité du 6 juin 2000.',
    ],
    chiffres: [
      { valeur: '51 ans', quoi: 'de retard sur la Nouvelle-Zélande, première en 1893' },
      { valeur: '13 millions', quoi: 'd’électrices nouvelles au scrutin de 1945' },
      { valeur: '33', quoi: 'femmes élues à la Constituante d’octobre 1945, sur 586 sièges' },
      { valeur: '6', quoi: 'votes favorables de la Chambre enterrés par le Sénat entre 1919 et 1936' },
    ],
    chrono: [
      { date: '1791', fait: 'Olympe de Gouges publie la Déclaration des droits de la femme.' },
      { date: '1876', fait: 'Hubertine Auclert fonde la première société suffragiste française.' },
      { date: '1893', fait: 'La Nouvelle-Zélande accorde le vote aux femmes, la première au monde.' },
      { date: '1918', fait: 'L’Allemagne et le Royaume-Uni ouvrent le vote aux femmes.' },
      { date: '20 mai 1919', fait: 'La Chambre vote le suffrage féminin par 344 voix contre 97.' },
      { date: '21 novembre 1922', fait: 'Le Sénat le rejette ; il recommencera jusqu’en 1936.' },
      { date: '1935', fait: 'Louise Weiss lance les actions spectaculaires de La Femme nouvelle.' },
      { date: '24 mars 1944', fait: 'L’amendement Grenier est adopté à Alger, 51 voix contre 16.' },
      { date: '21 avril 1944', fait: 'Ordonnance du Gouvernement provisoire, article 17.' },
      { date: '29 avril 1945', fait: 'Premier vote des Françaises, aux élections municipales.' },
      { date: '21 octobre 1945', fait: '33 femmes élues à l’Assemblée constituante.' },
      { date: '6 juin 2000', fait: 'Loi sur la parité entre femmes et hommes aux élections.' },
    ],
    leSaisTu:
      'Le 29 avril 1945, Odette Roux est élue maire des Sables-d’Olonne : la première femme maire d’une ville française. Elle peut administrer une commune entière, voter le budget et marier les habitants — mais pas ouvrir un compte en banque sans la signature de son mari. Il faudra attendre 1965.',
    aRetenir: [
      'L’ordonnance du 21 avril 1944, signée à Alger, rend les femmes électrices et éligibles comme les hommes.',
      'Les Françaises votent pour la première fois aux élections municipales du 29 avril 1945.',
      'La Chambre des députés avait voté le suffrage féminin dès le 20 mai 1919 : c’est le Sénat qui l’a bloqué jusqu’en 1940.',
      'La Nouvelle-Zélande (1893), l’Allemagne et le Royaume-Uni (1918) ont précédé la France de plusieurs décennies.',
      'L’égalité politique de 1944 précède de vingt ans l’égalité civile : en 1965 seulement, une femme mariée travaille sans l’accord de son mari.',
    ],
    mots: [
      {
        mot: 'Suffrage universel',
        sens: 'Droit de vote reconnu à tous les citoyens adultes ; en France, il n’est réellement universel qu’à partir de 1944.',
      },
      {
        mot: 'Ordonnance',
        sens: 'Texte qui a force de loi, pris par un gouvernement sans vote du Parlement — ici, parce qu’aucun Parlement élu n’existe.',
      },
      {
        mot: 'Éligible',
        sens: 'Qui a le droit d’être candidat et d’être élu, et pas seulement de voter.',
      },
      {
        mot: 'Suffragiste',
        sens: 'Militante ou militant du droit de vote des femmes ; « suffragette » désigne d’abord les Britanniques, plus radicales.',
      },
    ],
    lies: [
      'olympe-de-gouges',
      'charles-de-gaulle',
      'liberation-de-paris',
      'simone-veil',
      'louise-michel',
    ],
    niveaux: ['3e'],
    programme: 'Françaises et Français dans une République repensée',
    tags: [
      'suffrage féminin',
      'vote des femmes',
      'ordonnance',
      'Alger',
      '1944',
      'Louise Weiss',
      'Hubertine Auclert',
      'suffragettes',
      'Fernand Grenier',
      'citoyenneté',
      'égalité',
      'parité',
    ],
  },
  {
    id: 'creation-de-l-onu',
    volet: 'evenements',
    nom: 'La création de l’ONU',
    date: '26 juin 1945',
    tri: 1945,
    periode: 'contemporain',
    emoji: '🕊️',
    lieu: 'San Francisco, Californie',
    accroche:
      'Cinquante et un États signent à San Francisco une charte contre la guerre ; pour qu’elle tienne, ils donnent un droit de veto aux cinq vainqueurs de 1945.',
    citations: [
      {
        texte:
          'Nous, peuples des Nations unies, résolus à préserver les générations futures du fléau de la guerre qui deux fois en l’espace d’une vie humaine a infligé à l’humanité d’indicibles souffrances…',
        qui: 'Le préambule de la Charte des Nations unies',
        contexte:
          'Premiers mots du texte signé à San Francisco le 26 juin 1945, six semaines avant Hiroshima.',
        sens:
          '« Deux fois en l’espace d’une vie humaine » : 1914 et 1939. Les rédacteurs ont vu les deux, et écrivent pour que leurs enfants n’en voient pas une troisième.',
      },
      {
        texte:
          'L’ONU n’a pas été créée pour mener l’humanité au paradis, mais pour la sauver de l’enfer.',
        qui: 'Dag Hammarskjöld',
        contexte:
          'Deuxième secrétaire général de l’ONU, devant la presse, en 1954, à ceux qui reprochaient à l’organisation son impuissance.',
        sens:
          'La bonne mesure pour juger l’ONU : non pas « a-t-elle rendu le monde juste ? », mais « a-t-elle évité le pire ? ».',
      },
      {
        texte:
          'Ce sera la fin du système des actions unilatérales, des alliances exclusives, des sphères d’influence et de l’équilibre des puissances.',
        qui: 'Franklin Roosevelt',
        contexte:
          'Devant le Congrès des États-Unis, le 1ᵉʳ mars 1945, au retour de Yalta. Il mourra six semaines plus tard, avant San Francisco.',
      },
      {
        texte: 'Ce machin qu’on appelle l’ONU.',
        qui: 'Charles de Gaulle',
        contexte:
          'En conférence de presse, dans les années 1960, pour dire que seuls les États comptent et qu’une organisation ne remplace pas une nation.',
        sens:
          'Le reproche le plus célèbre fait à l’ONU en français : elle ne décide rien que ses membres les plus puissants ne veuillent.',
      },
    ],
    reperes: [
      'La Charte est signée le 26 juin 1945 à San Francisco par 51 États ; elle entre en vigueur le 24 octobre 1945.',
      'Le siège est à New York ; l’organisation compte six organes principaux et des agences spécialisées.',
      'L’Assemblée générale réunit tous les membres, un État une voix, mais ne vote que des recommandations.',
      'Le Conseil de sécurité décide ; ses cinq membres permanents peuvent tout bloquer d’un veto.',
      'L’ONU remplace la SDN, créée en 1920, que les États-Unis n’avaient jamais rejointe.',
      'De 51 États fondateurs, elle est passée à 193 membres aujourd’hui.',
    ],
    causes: [
      'L’échec complet de la Société des Nations, sans armée, sans les États-Unis, et paralysée par la règle de l’unanimité.',
      'Une guerre qui a tué environ 60 millions de personnes, dont une majorité de civils, et révélé les camps d’extermination.',
      'La volonté de Roosevelt, dès la Charte de l’Atlantique (14 août 1941), d’organiser la paix avant même d’avoir gagné la guerre.',
      'La Déclaration des Nations unies du 1ᵉʳ janvier 1942, par laquelle 26 États alliés s’engagent à ne pas signer de paix séparée : le nom est déjà là.',
      'Les conférences préparatoires de Moscou (1943), de Dumbarton Oaks (1944) et de Yalta (février 1945), où le droit de veto est arraché par Staline.',
      'La certitude que l’organisation ne servira à rien si les grandes puissances en sortent : c’est pour les retenir dedans qu’on leur donne le veto.',
    ],
    recit: [
      {
        titre: 'Pourquoi la SDN n’a pas tenu',
        texte:
          'La **Société des Nations** naît en 1920 de l’idée du président américain **Wilson** — et le Sénat des États-Unis refuse d’y entrer. Installée à Genève, elle décide à l’**unanimité**, ce qui donne à chaque État un veto de fait, et elle n’a **aucune force armée**. Le résultat est une suite d’humiliations : le Japon envahit la Mandchourie en 1931 et quitte la SDN ; l’Italie envahit l’Éthiopie en 1935, les sanctions restent symboliques, l’Italie s’en va ; l’Allemagne remilitarise la Rhénanie en 1936 après avoir claqué la porte dès 1933. En 1939, la SDN exclut l’URSS pour l’attaque de la Finlande : c’est son dernier acte notable. La leçon que les Alliés en tirent est nette — une organisation de la paix a besoin des **grandes puissances dedans** et de **moyens de contrainte**. Toute l’architecture de l’ONU découle de ce diagnostic, y compris ce qu’on lui reproche.',
      },
      {
        titre: 'De l’Atlantique à San Francisco',
        texte:
          'Le **14 août 1941**, avant même l’entrée en guerre des États-Unis, **Roosevelt** et **Churchill** signent à bord d’un cuirassé la **Charte de l’Atlantique** : renoncement aux conquêtes, droit des peuples à choisir leur gouvernement, sécurité collective. Le **1ᵉʳ janvier 1942**, 26 pays signent à Washington la « **Déclaration des Nations unies** » — l’expression est de Roosevelt. Les plans se précisent à **Dumbarton Oaks** (août-octobre 1944), où l’on dessine les organes, puis à **Yalta** (février 1945), où Staline obtient que les cinq grands disposent du **veto**. La conférence s’ouvre à **San Francisco le 25 avril 1945**, quinze jours après la mort de Roosevelt et deux semaines avant la capitulation allemande. Deux mois de négociations, 850 délégués, et la signature de la **Charte le 26 juin 1945**. Elle entre en vigueur le **24 octobre**, date devenue la journée des Nations unies.',
      },
      {
        titre: 'Comment c’est fait',
        texte:
          'L’**Assemblée générale** réunit tous les États : un État, une voix, du plus peuplé au plus petit. Elle débat de tout, mais ses résolutions sont des **recommandations** — elles n’obligent personne. Le pouvoir réel est au **Conseil de sécurité** : quinze membres, dont **cinq permanents** — États-Unis, URSS (aujourd’hui Russie), Royaume-Uni, France, Chine. Lui seul peut décider de sanctions ou de l’emploi de la force, et ses décisions s’imposent ; mais un seul « non » d’un permanent suffit à tout arrêter : c’est le **droit de veto**. À côté, le **Secrétariat** et son secrétaire général, la **Cour internationale de justice** à La Haye, le Conseil économique et social, et une galaxie d’agences : l’**UNESCO** (Paris, 1946), l’**OMS**, l’**UNICEF**, la FAO, le HCR pour les réfugiés.',
      },
      {
        titre: 'Ce qu’elle peut, ce qu’elle ne peut pas',
        texte:
          'Ce qu’elle peut : accompagner la **décolonisation** — l’ONU passe de 51 à 193 membres, et la tribune de l’Assemblée générale sert de porte d’entrée aux nouveaux États ; déployer des **casques bleus**, inventés lors de la crise de Suez en 1956, entre deux camps qui ont accepté de s’arrêter ; nourrir, vacciner, loger, à travers ses agences ; écrire du droit — la **Déclaration universelle des droits de l’homme** en 1948, les conventions sur le génocide, la torture, les droits de l’enfant. Ce qu’elle ne peut pas : agir contre un membre permanent ou son protégé. Pendant la guerre froide, l’URSS oppose son veto plus de cent fois ; l’ONU regarde sans pouvoir arrêter le **Rwanda en 1994** et **Srebrenica en 1995**. Elle n’est pas un gouvernement mondial : c’est une table où les États s’assoient, et ce qui s’y décide vaut ce que valent leurs volontés.',
      },
    ],
    consequences: [
      'Une enceinte permanente où tous les États se parlent, même en pleine guerre froide : c’est là que la crise de Cuba se dénoue en public en 1962.',
      'L’ONU devient le cadre de la décolonisation : 51 membres en 1945, 193 aujourd’hui.',
      'La Déclaration universelle des droits de l’homme (1948) puis des dizaines de conventions donnent un droit international écrit.',
      'Les opérations de maintien de la paix — les casques bleus — naissent en 1956 et sont déployées sur tous les continents.',
      'Le droit de veto des cinq permanents paralyse le Conseil de sécurité dès que l’un d’eux est concerné, hier comme aujourd’hui.',
    ],
    chiffres: [
      { valeur: '51', quoi: 'États fondateurs signataires de la Charte' },
      { valeur: '193', quoi: 'États membres aujourd’hui' },
      { valeur: '5', quoi: 'membres permanents du Conseil de sécurité, détenteurs du veto' },
      { valeur: '111', quoi: 'articles dans la Charte des Nations unies' },
    ],
    chrono: [
      { date: '14 août 1941', fait: 'Charte de l’Atlantique, signée en mer par Roosevelt et Churchill.' },
      { date: '1ᵉʳ janvier 1942', fait: 'Déclaration des Nations unies : 26 États alliés.' },
      { date: 'octobre 1944', fait: 'Dumbarton Oaks dessine les futurs organes.' },
      { date: 'février 1945', fait: 'Yalta : les cinq grands obtiennent le droit de veto.' },
      { date: '25 avril 1945', fait: 'Ouverture de la conférence de San Francisco.' },
      { date: '26 juin 1945', fait: 'Signature de la Charte par 50 délégations.' },
      { date: '24 octobre 1945', fait: 'Entrée en vigueur : journée des Nations unies.' },
      { date: '10 décembre 1948', fait: 'Déclaration universelle des droits de l’homme.' },
      { date: '1956', fait: 'Premiers casques bleus, pendant la crise de Suez.' },
      { date: '2011', fait: 'Le Soudan du Sud devient le 193ᵉ État membre.' },
    ],
    leSaisTu:
      'La Charte a été signée par 50 délégations, mais l’ONU compte 51 fondateurs. La Pologne n’avait pas de gouvernement reconnu en juin 1945 : on lui a laissé une ligne blanche sur le document. Elle a signé le 15 octobre 1945, et figure quand même parmi les membres originaires.',
    aRetenir: [
      'La Charte des Nations unies est signée le 26 juin 1945 à San Francisco par 51 États et entre en vigueur le 24 octobre 1945.',
      'L’ONU naît de l’échec de la SDN, incapable d’empêcher la Seconde Guerre mondiale.',
      'Le Conseil de sécurité a cinq membres permanents — États-Unis, URSS puis Russie, Royaume-Uni, France, Chine — qui disposent du droit de veto.',
      'L’Assemblée générale réunit tous les États, un État une voix, mais ne vote que des recommandations.',
      'L’ONU compte aujourd’hui 193 États membres et son siège est à New York.',
    ],
    mots: [
      {
        mot: 'Veto',
        sens: 'Droit de bloquer à lui seul une décision du Conseil de sécurité, réservé aux cinq membres permanents (du latin *veto*, « je m’oppose »).',
      },
      {
        mot: 'Charte',
        sens: 'Traité fondateur d’une organisation : il dit ce qu’elle est, ce qu’elle peut faire et qui y décide.',
      },
      {
        mot: 'Casque bleu',
        sens: 'Soldat prêté par un État membre à l’ONU pour surveiller un cessez-le-feu, sous commandement international.',
      },
      {
        mot: 'SDN',
        sens: 'Société des Nations, créée en 1920 à Genève : l’ancêtre de l’ONU, dissoute en 1946 après avoir échoué à empêcher la guerre.',
      },
    ],
    lies: [
      'debut-de-la-guerre-froide',
      'declaration-universelle-des-droits-de-l-homme',
      'traite-de-versailles',
      'hiroshima',
      'franklin-roosevelt',
    ],
    niveaux: ['3e', 'Tle'],
    programme: 'Le monde depuis 1945',
    tags: [
      'ONU',
      'Nations unies',
      'San Francisco',
      'Charte',
      'Conseil de sécurité',
      'veto',
      'SDN',
      'casques bleus',
      'New York',
      '1945',
      'sécurité collective',
    ],
  },
  {
    id: 'securite-sociale-1945',
    volet: 'evenements',
    nom: 'La création de la Sécurité sociale',
    date: '4 octobre 1945',
    tri: 1945,
    periode: 'contemporain',
    emoji: '🏥',
    lieu: 'Paris, Gouvernement provisoire de la République française',
    accroche:
      'Deux ordonnances d’octobre 1945 créent un système où chacun cotise selon ses moyens et reçoit selon ses besoins : maladie, accident, vieillesse, famille.',
    citations: [
      {
        texte:
          'Un plan complet de sécurité sociale, visant à assurer à tous les citoyens des moyens d’existence, dans tous les cas où ils sont incapables de se les procurer par le travail.',
        qui: 'Le programme du Conseil national de la Résistance',
        contexte:
          'Programme adopté clandestinement le 15 mars 1944, dans un appartement parisien, sous le titre Les Jours heureux.',
        sens:
          'La Sécurité sociale n’est pas une idée d’après-guerre : elle est écrite sous l’Occupation, par des gens qui risquent leur vie en la signant.',
      },
      {
        texte:
          'La sécurité sociale est la garantie donnée à chacun qu’en toutes circonstances il disposera des moyens nécessaires pour assurer sa subsistance et celle de sa famille dans des conditions décentes.',
        qui: 'Pierre Laroque',
        contexte:
          'Exposé des motifs de l’ordonnance du 4 octobre 1945, écrit par le haut fonctionnaire chargé de bâtir le système.',
      },
      {
        texte:
          'Jamais nous ne tolérerons que soit renié un seul des avantages de la Sécurité sociale. Nous défendrons à en mourir cette loi de progrès et de justice.',
        qui: 'Ambroise Croizat',
        contexte:
          'Ministre du Travail, devant les premiers administrateurs élus des caisses, en 1946.',
        sens:
          'Ancien ouvrier métallurgiste entré à l’usine à treize ans, il sait exactement ce que la maladie coûtait à une famille avant 1945.',
      },
    ],
    reperes: [
      'Deux ordonnances la fondent : celle du 4 octobre 1945 pour l’organisation, celle du 19 octobre 1945 pour les prestations.',
      'Pierre Laroque, haut fonctionnaire, en conçoit le plan ; Ambroise Croizat, ministre du Travail, le met en place.',
      'Quatre risques sont couverts : la maladie, les accidents du travail, la vieillesse et les charges de famille.',
      'Elle est financée par des cotisations prélevées sur les salaires, employeur et salarié, et non par l’impôt.',
      'Les caisses sont dirigées par des administrateurs élus : les premières élections ont lieu le 24 avril 1947.',
      'Avant 1945, dix millions de Français seulement sont couverts par une assurance sociale, sur quarante millions.',
    ],
    causes: [
      'Au XIXᵉ siècle, un accident, une maladie ou la vieillesse suffisent à jeter une famille ouvrière dans la misère : il n’existe que la charité et les sociétés de secours mutuel.',
      'Les lois sociales d’avant-guerre sont un patchwork : accidents du travail en 1898, retraites ouvrières en 1910, assurances sociales en 1930 pour les seuls salariés modestes, allocations familiales en 1932.',
      'Le rapport Beveridge, publié au Royaume-Uni en 1942, popularise l’idée d’une couverture universelle et unique — il se vend à des centaines de milliers d’exemplaires.',
      'Le programme du Conseil national de la Résistance du 15 mars 1944 en fait une promesse écrite de la France libérée.',
      'À la Libération, le rapport de force est exceptionnel : communistes, socialistes et démocrates-chrétiens sont d’accord, et le patronat sort discrédité de l’Occupation.',
      'La France a perdu des centaines de milliers d’habitants et veut relancer la natalité : d’où une branche famille très généreuse dès le départ.',
    ],
    recit: [
      {
        titre: 'Avant : tomber malade, c’était tomber',
        texte:
          'Jusqu’au XXᵉ siècle, l’ouvrier qui se casse une jambe ne touche rien. Il existe des **sociétés de secours mutuel**, des caisses d’usine, des bureaux de bienfaisance — utiles, mais volontaires et pauvres. L’État avance à petits pas : la loi du **9 avril 1898** rend l’employeur responsable des **accidents du travail** ; celle de **1910** crée les « retraites ouvrières et paysannes » à 65 ans, quand l’espérance de vie d’un ouvrier en approche à peine — les socialistes l’appellent « la retraite pour les morts ». Les **assurances sociales de 1928-1930** couvrent enfin maladie, maternité, invalidité et vieillesse, mais seulement les salariés gagnant moins qu’un plafond ; les **allocations familiales** deviennent obligatoires en 1932. Résultat en 1939 : une mosaïque de caisses, des règles différentes selon le métier, et la majorité des Français hors du système.',
      },
      {
        titre: 'Les Jours heureux',
        texte:
          'Le **15 mars 1944**, le **Conseil national de la Résistance** — qui réunit les mouvements de résistance, les syndicats et les partis — adopte clandestinement un programme en deux parties : un plan d’action immédiate contre l’occupant, et les mesures à appliquer après la Libération. On y lit la nationalisation de l’énergie et des banques, la liberté de la presse, et « **un plan complet de sécurité sociale** ». Ce texte, connu plus tard sous le titre *Les Jours heureux*, n’est pas une utopie de salon : il est écrit dans la clandestinité, par des hommes dont plusieurs seront arrêtés. Il donne au futur système sa **légitimité politique** : ce n’est pas une faveur accordée par un gouvernement, c’est une dette de la Résistance envers le pays.',
      },
      {
        titre: 'Deux ordonnances et un homme pressé',
        texte:
          'L’**ordonnance du 4 octobre 1945** crée l’organisation : un réseau unique de **caisses**, gérées par des conseils où siègent des représentants **élus** des salariés et des employeurs, et non par l’État. Celle du **19 octobre 1945** fixe les prestations. L’architecte est **Pierre Laroque**, conseiller d’État, qui veut un système *unique* et *universel* ; le bâtisseur est **Ambroise Croizat**, ancien métallurgiste, ministre du Travail de novembre 1945 à mai 1947, qui sillonne la France pour faire sortir les caisses de terre. En dix-huit mois, des centaines de caisses ouvrent, souvent dans des locaux prêtés, tenues par des bénévoles le soir après l’usine. Le **24 avril 1947**, les assurés élisent eux-mêmes leurs administrateurs : la Sécurité sociale n’appartient ni au gouvernement ni aux compagnies d’assurance, elle appartient à ceux qui cotisent.',
      },
      {
        titre: 'Ce que ça change dans une vie',
        texte:
          'Concrètement : un maçon tombe d’un échafaudage, il est soigné et indemnisé, sa famille garde un revenu. Une femme accouche à l’hôpital au lieu d’accoucher chez elle. Un enfant fiévreux voit un médecin au lieu d’attendre. Les chiffres suivent : la **mortalité infantile**, de 84 pour mille en 1946, tombe sous 4 pour mille aujourd’hui ; l’**espérance de vie** passe d’environ 60 ans pour un homme en 1946 à près de 80 ans. La vieillesse cesse d’être synonyme de dépendance vis-à-vis des enfants. Et la santé cesse d’être un luxe : c’est le sens du mot **solidarité** inscrit dans le système — les bien-portants paient pour les malades, les actifs pour les retraités, sans savoir de quel côté ils seront demain.',
      },
      {
        titre: 'Ce qui a changé depuis',
        texte:
          'L’universalité voulue par Laroque n’est pas atteinte d’un coup : les **régimes spéciaux** (mineurs, cheminots, marins) refusent de se fondre dans le régime général, les indépendants et les agriculteurs obtiennent leurs propres caisses (1961 pour l’agriculture). En **1967**, les ordonnances Jeanneney séparent le système en **trois branches** — maladie, vieillesse, famille — chacune avec ses comptes. À partir des années 1970, les dépenses de santé montent plus vite que les salaires : c’est le « trou de la Sécu », auquel répondent la **CSG** en 1991, puis des plans d’économies réguliers. L’accès, lui, s’élargit : la **couverture maladie universelle** en 1999, la protection universelle maladie en 2016. Quatre-vingts ans après, le système couvre l’ensemble de la population — et reste l’un des postes les plus lourds du budget national.',
      },
    ],
    consequences: [
      'La quasi-totalité des Français est couverte contre la maladie, l’accident et la vieillesse, en une génération.',
      'La mortalité infantile s’effondre et l’espérance de vie gagne près de vingt ans entre 1946 et aujourd’hui.',
      'Les caisses sont dirigées par des administrateurs élus par les assurés : la gestion échappe à l’État comme aux assureurs privés.',
      'La branche famille, très généreuse, accompagne le baby-boom et la reconstruction démographique du pays.',
      'Le financement par cotisations sur les salaires devient un enjeu politique permanent, du « trou de la Sécu » à la CSG créée en 1991.',
    ],
    chiffres: [
      { valeur: '4', quoi: 'risques couverts : maladie, accident du travail, vieillesse, famille' },
      { valeur: '10 millions', quoi: 'de Français seulement assurés avant 1945, sur 40 millions' },
      { valeur: '84 ‰', quoi: 'de mortalité infantile en 1946 ; moins de 4 ‰ aujourd’hui' },
      { valeur: '18 mois', quoi: 'pour couvrir le pays de caisses, d’octobre 1945 au printemps 1947' },
    ],
    chrono: [
      { date: '9 avril 1898', fait: 'Loi sur la responsabilité des accidents du travail.' },
      { date: '1910', fait: 'Retraites ouvrières et paysannes, à 65 ans.' },
      { date: '1930', fait: 'Assurances sociales pour les salariés modestes.' },
      { date: '1932', fait: 'Allocations familiales rendues obligatoires.' },
      { date: '1942', fait: 'Rapport Beveridge au Royaume-Uni.' },
      { date: '15 mars 1944', fait: 'Le CNR adopte son programme, Les Jours heureux.' },
      { date: '4 octobre 1945', fait: 'Ordonnance créant la Sécurité sociale.' },
      { date: '19 octobre 1945', fait: 'Ordonnance fixant les prestations des assurances sociales.' },
      { date: '22 mai 1946', fait: 'Loi de généralisation à toute la population.' },
      { date: '24 avril 1947', fait: 'Première élection des administrateurs des caisses.' },
      { date: '1967', fait: 'Séparation en trois branches : maladie, vieillesse, famille.' },
      { date: '1999', fait: 'Couverture maladie universelle pour les plus démunis.' },
    ],
    leSaisTu:
      'Ambroise Croizat a quitté l’école à treize ans pour la métallurgie et a passé la guerre en prison comme député communiste. Devenu ministre, il a signé les textes qui remboursent les ouvriers de son ancienne usine. À sa mort, en 1951, une foule immense suit son convoi jusqu’au Père-Lachaise.',
    aRetenir: [
      'La Sécurité sociale est créée par les ordonnances des 4 et 19 octobre 1945.',
      'Elle applique le programme du Conseil national de la Résistance adopté le 15 mars 1944.',
      'Pierre Laroque en conçoit le plan, Ambroise Croizat, ministre du Travail, la met en place.',
      'Elle couvre quatre risques : maladie, accidents du travail, vieillesse et charges de famille.',
      'Elle est financée par des cotisations prélevées sur les salaires, et non par l’impôt.',
    ],
    mots: [
      {
        mot: 'Cotisation',
        sens: 'Somme prélevée sur le salaire — part salariale et part employeur — qui finance la Sécurité sociale.',
      },
      {
        mot: 'Risque',
        sens: 'Dans le vocabulaire de la Sécu, l’événement couvert : tomber malade, se blesser au travail, vieillir, élever des enfants.',
      },
      {
        mot: 'Répartition',
        sens: 'Principe selon lequel les cotisations d’aujourd’hui paient les prestations d’aujourd’hui, sans épargne individuelle.',
      },
      {
        mot: 'CNR',
        sens: 'Conseil national de la Résistance, créé par Jean Moulin en 1943 pour réunir mouvements, syndicats et partis de la Résistance.',
      },
    ],
    lies: [
      'la-resistance',
      'charles-de-gaulle',
      'front-populaire',
      'droit-de-vote-des-femmes-1944',
      'simone-veil',
    ],
    niveaux: ['3e'],
    programme: 'Françaises et Français dans une République repensée',
    tags: [
      'Sécurité sociale',
      'Sécu',
      'CNR',
      'Croizat',
      'Laroque',
      'ordonnances',
      'cotisations',
      'protection sociale',
      'État-providence',
      'Beveridge',
      '1945',
    ],
  },
  {
    id: 'debut-de-la-guerre-froide',
    volet: 'evenements',
    nom: 'Le début de la guerre froide',
    date: '1947 – 1991',
    tri: 1947,
    fin: 1991,
    periode: 'contemporain',
    emoji: '❄️',
    lieu: 'L’Europe coupée en deux, de Stettin à Trieste',
    accroche:
      'Deux vainqueurs de 1945 se partagent le monde sans jamais se combattre : entre eux, un rideau de fer, deux camps — et la bombe qui interdit la guerre.',
    citations: [
      {
        texte:
          'De Stettin, dans la Baltique, à Trieste, dans l’Adriatique, un rideau de fer est descendu à travers le continent.',
        qui: 'Winston Churchill',
        contexte:
          'Discours au Westminster College de Fulton, dans le Missouri, le 5 mars 1946, en présence du président Truman.',
        sens:
          'Churchill n’est plus Premier ministre : il parle en simple invité, et donne à la coupure de l’Europe l’image qui lui restera pendant quarante-cinq ans.',
      },
      {
        texte:
          'Je crois que les États-Unis doivent soutenir les peuples libres qui résistent à des tentatives d’asservissement par des minorités armées ou par des pressions extérieures.',
        qui: 'Harry Truman',
        contexte:
          'Message au Congrès des États-Unis, le 12 mars 1947, pour obtenir une aide d’urgence à la Grèce et à la Turquie.',
        sens:
          'C’est la doctrine Truman : l’Amérique renonce à se retirer du monde et s’engage à contenir partout l’expansion soviétique.',
      },
      {
        texte:
          'Le monde s’est divisé en deux camps : le camp impérialiste et antidémocratique d’une part, le camp anti-impérialiste et démocratique d’autre part.',
        qui: 'Andreï Jdanov',
        contexte:
          'Rapport à la conférence fondatrice du Kominform, en Pologne, en septembre 1947 : la réponse soviétique à Truman.',
      },
      {
        texte: 'Ne nous y trompons pas : nous sommes aujourd’hui en pleine guerre froide.',
        qui: 'Bernard Baruch',
        contexte:
          'Devant les parlementaires de Caroline du Sud, le 16 avril 1947 : c’est là que l’expression entre dans le vocabulaire politique.',
      },
    ],
    reperes: [
      'Le 5 mars 1946, à Fulton, Churchill décrit un rideau de fer tombé sur l’Europe.',
      'Le 12 mars 1947, la doctrine Truman engage les États-Unis à contenir le communisme partout.',
      'Le 5 juin 1947, le plan Marshall offre des dollars à toute l’Europe ; l’URSS les refuse et les fait refuser à ses voisins.',
      'En septembre 1947, la doctrine Jdanov et le Kominform organisent le camp d’en face.',
      'De juin 1948 à mai 1949, le blocus de Berlin est brisé par un pont aérien de 277 000 vols.',
      'L’OTAN naît en 1949, le pacte de Varsovie en 1955 : deux blocs, deux armées, une seule peur.',
    ],
    causes: [
      'Une alliance de circonstance : Américains, Britanniques et Soviétiques n’étaient unis que contre Hitler, et il n’est plus là.',
      'Deux modèles inconciliables : démocratie parlementaire et économie de marché d’un côté, parti unique et économie d’État de l’autre.',
      'Le partage de fait décidé à Yalta et à Potsdam en 1945 : l’Armée rouge occupe l’Europe de l’Est, les Occidentaux l’Ouest, et personne ne recule.',
      'La soviétisation des démocraties populaires entre 1945 et 1948, achevée par le coup de Prague du 25 février 1948.',
      'La question allemande : le pays le plus industriel d’Europe est coupé en zones, et celui qui le contrôlera pèsera sur tout le continent.',
      'La bombe atomique américaine d’août 1945, puis la bombe soviétique d’août 1949 : chacun devient capable de détruire l’autre.',
      'Le retrait britannique de Grèce et de Turquie en février 1947, faute d’argent : les États-Unis doivent prendre la place ou laisser le vide.',
    ],
    recit: [
      {
        titre: 'De l’alliance à la méfiance',
        texte:
          'En février 1945 à **Yalta**, les trois Grands promettent des « élections libres » dans l’Europe libérée. Sur le terrain, c’est l’**Armée rouge** qui tient la Pologne, la Roumanie, la Hongrie, la Bulgarie, et une armée ne rend pas un pays. Entre 1945 et 1948, le même scénario se répète : gouvernement d’union, ministère de l’Intérieur aux communistes, police politique, élections truquées, partis d’opposition dissous. On appelle ces régimes des **démocraties populaires**. Le point de bascule est le **coup de Prague**, le **25 février 1948** : la Tchécoslovaquie, seule démocratie de la région, bascule en quelques jours ; le ministre des Affaires étrangères **Jan Masaryk** est retrouvé mort sous ses fenêtres deux semaines plus tard. À l’Ouest, l’effet est immédiat : ce qui semblait une querelle d’alliés devient une menace.',
      },
      {
        titre: '1947, l’année de la rupture',
        texte:
          'Tout se noue en quelques mois. Le **12 mars 1947**, **Truman** demande au Congrès 400 millions de dollars pour la Grèce et la Turquie et énonce sa **doctrine** : soutenir les peuples libres menacés — c’est l’**endiguement**, *containment*. Le **5 juin 1947**, le secrétaire d’État **George Marshall** annonce à Harvard une aide massive à la reconstruction européenne : **13 milliards de dollars** en quatre ans. L’offre est faite à toute l’Europe, URSS comprise ; **Molotov** claque la porte de la conférence de Paris en juillet et interdit aux pays de l’Est d’accepter. Seize pays signent et créent l’**OECE** en 1948. En septembre 1947, **Jdanov** réunit les partis communistes en Pologne, proclame la division du monde en deux camps et fonde le **Kominform**. En France, les ministres communistes ont été exclus du gouvernement le 5 mai. Les blocs sont faits.',
      },
      {
        titre: 'Berlin, la ville test',
        texte:
          'Berlin est à 150 km dans la zone soviétique, mais partagée en quatre secteurs : c’est une enclave occidentale en territoire communiste. Le **20 juin 1948**, les Occidentaux y introduisent une nouvelle monnaie, le **Deutsche Mark**. Le **24 juin**, Staline coupe routes, voies ferrées et canaux : **2,2 millions de Berlinois** sont privés de ravitaillement. Forcer le passage, c’est la guerre ; céder, c’est perdre l’Allemagne. Truman choisit une troisième voie : le **pont aérien**. Pendant onze mois, un avion atterrit à Tempelhof toutes les trois minutes — **277 000 vols**, 2,3 millions de tonnes de charbon, de farine et de lait. Staline lève le blocus le **12 mai 1949** sans avoir tiré un coup de feu. La conséquence est durable : l’Allemagne est coupée en deux États, la **RFA** le 23 mai 1949, la **RDA** le 7 octobre.',
      },
      {
        titre: 'Deux blocs, deux mondes',
        texte:
          'Chaque camp se dote de ses institutions. À l’Ouest : l’**OTAN**, alliance militaire signée le **4 avril 1949** par douze États, où l’attaque contre l’un est une attaque contre tous. À l’Est : le **COMECON** en 1949 pour l’économie, le **pacte de Varsovie** le 14 mai 1955 pour l’armée. Entre les deux, une course aux armements sans précédent : bombe soviétique en 1949, bombes à hydrogène en 1952 et 1953, missiles intercontinentaux, jusqu’à **64 000 ogives nucléaires** dans le monde au milieu des années 1980. Comme un affrontement direct signifierait la destruction des deux, la guerre se fait **ailleurs et par procuration** : Corée (1950-1953), Vietnam, Afghanistan, Amérique latine, Afrique. C’est ce que les stratèges appellent l’**équilibre de la terreur** — une paix armée qui tiendra jusqu’à la chute du mur de Berlin en 1989 et la disparition de l’URSS le 25 décembre 1991.',
      },
    ],
    consequences: [
      'L’Europe est coupée en deux pour quarante ans, et l’Allemagne partagée en deux États dès 1949.',
      'Deux alliances militaires se font face : l’OTAN en 1949, le pacte de Varsovie en 1955.',
      'La course aux armements nucléaires rend la guerre directe impossible et les crises terrifiantes, de Berlin à Cuba.',
      'Les conflits se déplacent vers le reste du monde : Corée, Vietnam, Proche-Orient, Afrique, Amérique latine.',
      'Le plan Marshall relance l’économie de l’Europe de l’Ouest et pousse les Six à coopérer : la construction européenne y prend racine.',
      'La bipolarisation ne s’achève qu’avec la chute du mur de Berlin en 1989 et la disparition de l’URSS en 1991.',
    ],
    chiffres: [
      { valeur: '13 milliards', quoi: 'de dollars versés par le plan Marshall à seize pays' },
      { valeur: '277 000', quoi: 'vols du pont aérien de Berlin en onze mois' },
      { valeur: '64 000', quoi: 'ogives nucléaires dans le monde au sommet de la course, vers 1986' },
      { valeur: '44 ans', quoi: 'de guerre froide, de 1947 à 1991' },
    ],
    chrono: [
      { date: 'février 1945', fait: 'Conférence de Yalta : partage de fait de l’Europe.' },
      { date: '5 mars 1946', fait: 'Churchill parle du rideau de fer, à Fulton.' },
      { date: '12 mars 1947', fait: 'Doctrine Truman : l’endiguement du communisme.' },
      { date: '5 juin 1947', fait: 'Le plan Marshall est annoncé à Harvard.' },
      { date: 'septembre 1947', fait: 'Doctrine Jdanov et création du Kominform.' },
      { date: '25 février 1948', fait: 'Coup de Prague : la Tchécoslovaquie bascule.' },
      { date: '24 juin 1948', fait: 'Début du blocus de Berlin ; le pont aérien s’organise.' },
      { date: '4 avril 1949', fait: 'Signature du traité de l’Atlantique Nord : l’OTAN.' },
      { date: '29 août 1949', fait: 'Première bombe atomique soviétique.' },
      { date: '14 mai 1955', fait: 'Pacte de Varsovie : le bloc de l’Est a son alliance.' },
      { date: '9 novembre 1989', fait: 'Chute du mur de Berlin.' },
      { date: '25 décembre 1991', fait: 'Disparition de l’URSS : la guerre froide s’achève.' },
    ],
    leSaisTu:
      'Pendant le pont aérien, un pilote américain, Gail Halvorsen, s’est mis à lâcher des bonbons accrochés à des mouchoirs en parachute avant d’atterrir. Des milliers de pilotes l’ont imité. Les enfants de Berlin appelaient ces avions les Rosinenbomber : les « bombardiers de raisins secs ».',
    aRetenir: [
      'La guerre froide oppose les États-Unis et l’URSS de 1947 à 1991, sans affrontement militaire direct entre eux.',
      'Le 12 mars 1947, la doctrine Truman engage les États-Unis à contenir le communisme ; le plan Marshall en est l’outil économique.',
      'En septembre 1947, la doctrine Jdanov divise le monde en deux camps et fonde le Kominform.',
      'Le blocus de Berlin (juin 1948 – mai 1949) est brisé par un pont aérien ; l’Allemagne est coupée en deux États en 1949.',
      'L’OTAN (1949) et le pacte de Varsovie (1955) organisent militairement les deux blocs.',
    ],
    mots: [
      {
        mot: 'Rideau de fer',
        sens: 'La frontière fermée qui sépare l’Europe de l’Ouest de l’Europe soviétique, de la Baltique à l’Adriatique.',
      },
      {
        mot: 'Endiguement',
        sens: 'Traduction de *containment* : empêcher le communisme de s’étendre, sans chercher à le renverser là où il est installé.',
      },
      {
        mot: 'Bloc',
        sens: 'Ensemble d’États rangés derrière une superpuissance, avec son alliance militaire et son organisation économique.',
      },
      {
        mot: 'Équilibre de la terreur',
        sens: 'Situation où chacun peut détruire l’autre : la peur réciproque interdit la guerre directe.',
      },
      {
        mot: 'Kominform',
        sens: 'Bureau d’information créé en 1947 pour aligner les partis communistes européens sur Moscou.',
      },
    ],
    lies: [
      'creation-de-l-onu',
      'winston-churchill',
      'staline',
      'hiroshima',
      'traite-de-rome',
    ],
    niveaux: ['3e', 'Tle'],
    programme: 'Le monde depuis 1945',
    tags: [
      'guerre froide',
      'rideau de fer',
      'Fulton',
      'Truman',
      'plan Marshall',
      'Jdanov',
      'Kominform',
      'blocus de Berlin',
      'pont aérien',
      'OTAN',
      'pacte de Varsovie',
      'bipolarisation',
    ],
  },
  {
    id: 'declaration-universelle-des-droits-de-l-homme',
    volet: 'evenements',
    nom: 'La Déclaration universelle des droits de l’homme',
    date: '10 décembre 1948',
    tri: 1948,
    periode: 'contemporain',
    emoji: '📜',
    lieu: 'Paris, palais de Chaillot',
    accroche:
      'Trois ans après les camps, l’ONU proclame à Paris trente articles qui valent pour tout être humain — sans un seul tribunal pour les faire appliquer.',
    citations: [
      {
        texte: 'Tous les êtres humains naissent libres et égaux en dignité et en droits.',
        qui: 'L’article premier de la Déclaration',
        contexte:
          'Adopté au palais de Chaillot, à Paris, dans la nuit du 10 décembre 1948, par 48 voix, aucune contre et 8 abstentions.',
        sens:
          'Chaque mot a été pesé : « êtres humains » et non « hommes », « naissent » et non « sont », pour que le droit précède toute loi et toute nationalité.',
      },
      {
        texte:
          'La méconnaissance et le mépris des droits de l’homme ont conduit à des actes de barbarie qui révoltent la conscience de l’humanité.',
        qui: 'Le préambule de la Déclaration',
        contexte:
          'Deuxième phrase du texte : les « actes de barbarie » sont les camps, dont les images sont vieilles de trois ans.',
      },
      {
        texte: 'La Déclaration est comme le portique d’un temple, soutenu par quatre colonnes.',
        qui: 'René Cassin',
        contexte:
          'Le juriste français, l’un des rédacteurs du texte, pour expliquer son plan : dignité, droits de la personne, libertés publiques, droits sociaux.',
        sens:
          'Le préambule est le perron, les deux premiers articles les fondations, les articles 3 à 27 les quatre colonnes, les trois derniers le fronton.',
      },
      {
        texte: 'Où donc commencent les droits de l’homme ? Dans de petits lieux, tout près de chez soi.',
        qui: 'Eleanor Roosevelt',
        contexte:
          'Aux Nations unies, en 1958, dix ans après avoir présidé la commission qui a rédigé la Déclaration.',
        sens:
          'Un droit qui n’existe pas dans l’école, l’atelier ou le quartier n’existe nulle part, quoi qu’en dise un traité.',
      },
    ],
    reperes: [
      'Adoptée à Paris, au palais de Chaillot, le 10 décembre 1948, par l’Assemblée générale de l’ONU.',
      '48 États votent pour, aucun contre, 8 s’abstiennent : le bloc soviétique, l’Arabie saoudite et l’Afrique du Sud.',
      'Trente articles : libertés individuelles, droits politiques, puis droits économiques et sociaux.',
      'La commission de rédaction est présidée par Eleanor Roosevelt ; le Français René Cassin en est l’un des principaux auteurs.',
      'Ce n’est pas un traité : elle n’oblige juridiquement aucun État, elle proclame.',
      'René Cassin reçoit le prix Nobel de la paix en 1968, vingt ans après l’adoption.',
    ],
    causes: [
      'La Shoah et les crimes de masse de la Seconde Guerre mondiale : six millions de Juifs assassinés, des populations entières déplacées ou exterminées.',
      'Le procès de Nuremberg (1945-1946), qui invente la notion de crime contre l’humanité et montre qu’un État peut être criminel envers ses propres habitants.',
      'La Charte de l’ONU de 1945 parle des droits de l’homme mais ne les définit nulle part : il faut une liste.',
      'Les déclarations existantes — américaine de 1776, française de 1789 — sont nationales, faites par un peuple pour lui-même : l’enjeu est cette fois l’universalité.',
      'La guerre froide qui commence : chaque camp veut que le texte porte ses valeurs, ce qui oblige à y mettre les deux.',
    ],
    recit: [
      {
        titre: 'Après les camps, une liste',
        texte:
          'En 1945, les photographies des camps font le tour du monde, et le **procès de Nuremberg** juge pour la première fois des dirigeants d’État pour **crime contre l’humanité**. Une évidence s’impose : la souveraineté d’un État ne peut plus être un permis de tout faire chez soi. La **Charte de l’ONU** mentionne bien les droits de l’homme, mais sans dire lesquels. Une **Commission des droits de l’homme** est donc créée en 1946 : dix-huit membres, présidés par **Eleanor Roosevelt**, veuve du président américain, qui s’impose par son autorité morale. Autour d’elle, le juriste français **René Cassin**, le Libanais **Charles Malik**, le Chinois **Peng Chun Chang**, et le Canadien **John Humphrey**, qui rédige un premier brouillon à partir de toutes les constitutions du monde.',
      },
      {
        titre: 'Deux ans de discussions',
        texte:
          'Le travail dure deux ans et près de **1 400 votes**, article par article, mot par mot. Faut-il écrire que les hommes sont créés par Dieu, comme le veulent certains délégués, ou par la nature, comme le veulent les marxistes ? **Chang** et **Malik** trouvent la sortie : on n’écrit ni l’un ni l’autre, on écrit que les êtres humains **naissent** libres et égaux — le fait suffit, chacun y mettra sa raison. Faut-il s’en tenir aux libertés classiques, comme le souhaitent les Occidentaux, ou inscrire le travail, le repos, la santé et l’école, comme l’exigent les Soviétiques et les Latino-Américains ? Le texte fera les deux. Chaque compromis est un pari : un texte accepté par des mondes qui se détestent aura plus de force qu’un texte parfait signé par un seul camp.',
      },
      {
        titre: 'Ce que disent les trente articles',
        texte:
          'L’article premier pose l’égalité en **dignité** ; l’article 2 interdit toute distinction de race, de sexe, de religion ou d’opinion. Viennent ensuite les droits de la personne : droit à la vie (article 3), interdiction de l’**esclavage** (4) et de la **torture** (5), droit à un procès équitable (10-11). Puis les libertés dans la cité : circuler, se marier librement, posséder, croire ou ne pas croire (**article 18**), s’exprimer, se réunir, participer au gouvernement de son pays (21). Enfin les droits économiques et sociaux, la partie la plus neuve : sécurité sociale (22), travail et salaire égal (23), repos et congés payés (24), niveau de vie suffisant (25), **éducation gratuite** au moins élémentaire (26). Les trois derniers articles rappellent que ces droits n’existent que dans une société organisée et ne peuvent servir à les détruire.',
      },
      {
        titre: 'Un texte sans tribunal',
        texte:
          'Le vote a lieu dans la nuit du **10 décembre 1948** : **48 pour, 0 contre, 8 abstentions**. S’abstiennent les six pays du bloc soviétique, qui jugent le texte trop peu social et trop intrusif ; l’**Arabie saoudite**, à cause de la liberté de changer de religion et de l’égalité dans le mariage ; l’**Afrique du Sud**, qui vient d’instaurer l’**apartheid** et ne peut signer l’égalité des races. Surtout, la Déclaration n’est pas un traité : aucun juge, aucune sanction, aucune obligation. Sa force est **morale** — et elle est réelle. Elle inspire la **Convention européenne des droits de l’homme** (1950) et sa Cour de Strasbourg, les **deux pactes internationaux de 1966** qui, eux, obligent les États signataires, les constitutions de dizaines de pays décolonisés, et la **Cour pénale internationale** entrée en fonction en 2002. Un texte sans tribunal a fini par en faire naître plusieurs.',
      },
    ],
    consequences: [
      'Pour la première fois, des droits sont proclamés pour tout être humain, indépendamment de son État et de sa nationalité.',
      'Le texte inspire la Convention européenne des droits de l’homme (1950) et sa Cour, qui, elle, condamne les États.',
      'Les deux pactes internationaux de 1966, entrés en vigueur en 1976, transforment une partie de la Déclaration en obligations juridiques.',
      'Les mouvements d’indépendance, puis les militants anti-apartheid et les dissidents de l’Est, s’en servent comme d’une arme contre leurs gouvernements.',
      'Sa faiblesse reste entière : aucun État n’est condamné pour l’avoir violée, et les grandes puissances y échappent au Conseil de sécurité.',
    ],
    chiffres: [
      { valeur: '30', quoi: 'articles, du droit à la vie au droit à l’éducation' },
      { valeur: '48 – 0 – 8', quoi: 'voix pour, contre et abstentions, le 10 décembre 1948' },
      { valeur: '1 400', quoi: 'votes environ pendant les deux ans de rédaction' },
      { valeur: '500', quoi: 'langues et plus : le texte le plus traduit du monde' },
    ],
    chrono: [
      { date: '1945', fait: 'Découverte des camps ; la Charte de l’ONU cite les droits de l’homme.' },
      { date: 'novembre 1945', fait: 'Ouverture du procès de Nuremberg.' },
      { date: 'février 1946', fait: 'Création de la Commission des droits de l’homme de l’ONU.' },
      { date: 'janvier 1947', fait: 'Première réunion, présidée par Eleanor Roosevelt.' },
      { date: 'juin 1948', fait: 'Le projet est achevé, après près de 1 400 votes.' },
      { date: '10 décembre 1948', fait: 'Adoption au palais de Chaillot, à Paris.' },
      { date: '4 novembre 1950', fait: 'Convention européenne des droits de l’homme.' },
      { date: '1966', fait: 'Deux pactes internationaux rendent des droits obligatoires.' },
      { date: '1968', fait: 'Prix Nobel de la paix pour René Cassin.' },
      { date: '2002', fait: 'Entrée en fonction de la Cour pénale internationale.' },
    ],
    leSaisTu:
      'La Déclaration universelle détient un record du monde homologué : c’est le document le plus traduit de la planète, disponible dans plus de cinq cents langues, du zoulou au breton. Et le 10 décembre est devenu la Journée internationale des droits de l’homme.',
    aRetenir: [
      'La Déclaration universelle des droits de l’homme est adoptée le 10 décembre 1948 à Paris, au palais de Chaillot.',
      'Elle compte 30 articles et affirme dès le premier que tous les êtres humains naissent libres et égaux en dignité et en droits.',
      'Elle est adoptée par 48 voix, sans opposition, avec 8 abstentions : bloc soviétique, Arabie saoudite, Afrique du Sud.',
      'Le Français René Cassin est l’un de ses rédacteurs ; il reçoit le prix Nobel de la paix en 1968.',
      'Elle n’a aucune valeur contraignante : elle inspire des traités qui, eux, obligent les États signataires.',
    ],
    mots: [
      {
        mot: 'Universel',
        sens: 'Qui vaut pour tous, partout et en tout temps : un droit universel ne dépend ni du pays ni de l’époque.',
      },
      {
        mot: 'Déclaration',
        sens: 'Texte qui proclame des principes, par opposition au traité, qui engage juridiquement ceux qui le signent.',
      },
      {
        mot: 'Dignité',
        sens: 'Valeur reconnue à tout être humain du seul fait qu’il est humain, qu’on ne peut ni mériter ni perdre.',
      },
      {
        mot: 'Contraignant',
        sens: 'Se dit d’un texte qu’un juge peut faire appliquer : la Déclaration ne l’est pas, la Convention européenne l’est.',
      },
    ],
    lies: [
      'rene-cassin',
      'creation-de-l-onu',
      'declaration-des-droits-de-l-homme',
      'la-shoah',
      'simone-veil',
    ],
    niveaux: ['3e', 'Tle'],
    programme: 'Le monde depuis 1945',
    tags: [
      'droits de l’homme',
      'DUDH',
      '1948',
      'Chaillot',
      'René Cassin',
      'Eleanor Roosevelt',
      'ONU',
      'dignité',
      'universalité',
      'Nuremberg',
      '10 décembre',
    ],
  },
  {
    id: 'traite-de-rome',
    volet: 'evenements',
    nom: 'Le traité de Rome',
    date: '25 mars 1957',
    tri: 1957,
    periode: 'contemporain',
    emoji: '🇪🇺',
    lieu: 'Rome, palais des Conservateurs, au Capitole',
    accroche:
      'Six pays signent au Capitole un marché sans douanes : c’est ce traité qui, quarante-cinq ans plus tard, mettra des euros dans les poches.',
    citations: [
      {
        texte:
          'L’Europe ne se fera pas d’un coup, ni dans une construction d’ensemble : elle se fera par des réalisations concrètes, créant d’abord une solidarité de fait.',
        qui: 'Robert Schuman',
        contexte:
          'Déclaration du 9 mai 1950, salon de l’Horloge du Quai d’Orsay : l’acte de naissance de la construction européenne.',
        sens:
          'La méthode tient en une phrase : on ne commence pas par les grands principes, on met en commun du charbon, de l’acier, des douanes — et l’habitude fait le reste.',
      },
      {
        texte:
          'Déterminés à établir les fondements d’une union sans cesse plus étroite entre les peuples européens.',
        qui: 'Le préambule du traité de Rome',
        contexte:
          'Première phrase du traité instituant la Communauté économique européenne, signé le 25 mars 1957.',
        sens:
          '« Sans cesse plus étroite » : le traité ne fixe pas de point d’arrivée, il annonce un mouvement — c’est ce qui sera discuté pendant soixante ans.',
      },
      {
        texte: 'Rien n’est possible sans les hommes, rien n’est durable sans les institutions.',
        qui: 'Jean Monnet',
        contexte:
          'Dans ses Mémoires, en 1976, par l’inspirateur du plan Schuman et premier président de la Haute Autorité de la CECA.',
      },
      {
        texte: 'Nous ne coalisons pas des États, nous unissons des hommes.',
        qui: 'Attribué à Jean Monnet',
        contexte:
          'Phrase répandue depuis les années 1950 et gravée un peu partout ; Monnet lui-même a démenti l’avoir prononcée.',
        sens:
          'Elle résume pourtant bien l’idée : une alliance se dénoue, une communauté d’institutions et d’échanges résiste mieux.',
        incertaine: true,
      },
    ],
    reperes: [
      'Signé le 25 mars 1957 à Rome par six pays : France, RFA, Italie, Belgique, Pays-Bas, Luxembourg.',
      'Deux traités en un : la CEE, un marché commun, et l’Euratom, pour l’énergie atomique civile.',
      'Entré en vigueur le 1ᵉʳ janvier 1958 ; les derniers droits de douane entre les Six tombent le 1ᵉʳ juillet 1968.',
      'Quatre libertés de circulation : marchandises, personnes, services et capitaux.',
      'La politique agricole commune est décidée en 1962 : prix garantis et préférence européenne.',
      'La CEE devient l’Union européenne au traité de Maastricht, signé le 7 février 1992.',
    ],
    causes: [
      'Deux guerres mondiales parties du même endroit en trente ans : l’objectif premier est de rendre matériellement impossible une nouvelle guerre franco-allemande.',
      'Une Europe ruinée et dépassée par les deux Grands, qui découvre à Suez en 1956 qu’elle ne pèse plus seule.',
      'Le plan Marshall, qui oblige dès 1948 seize pays à répartir l’aide ensemble au sein de l’OECE : la première habitude de travail commun.',
      'Le succès de la CECA, créée en 1951 : mettre le charbon et l’acier sous une autorité commune a marché, il faut continuer.',
      'L’échec de la Communauté européenne de défense, rejetée par l’Assemblée française le 30 août 1954 : la voie militaire est fermée, reste l’économie.',
      'La conférence de Messine (juin 1955) et le rapport rédigé par le Belge Paul-Henri Spaak, qui dessinent le marché commun.',
    ],
    recit: [
      {
        titre: 'Du charbon avant le reste',
        texte:
          'Le **9 mai 1950**, le ministre français des Affaires étrangères **Robert Schuman** lit une déclaration préparée avec **Jean Monnet** : la France propose de placer l’ensemble de sa production de **charbon et d’acier**, et celle de l’Allemagne, sous une **autorité commune**. L’idée est d’une simplicité redoutable — le charbon et l’acier font les canons ; qui ne contrôle plus seul ses canons ne peut plus déclarer seul la guerre. Le **traité de Paris du 18 avril 1951** crée la **CECA** avec six pays. C’est la première institution européenne **supranationale** : ses décisions s’imposent aux États. Quand on tente d’aller plus loin avec une armée commune, la **CED**, l’Assemblée nationale française la rejette le **30 août 1954**. Leçon retenue : l’Europe avancera par l’économie, pas par les drapeaux.',
      },
      {
        titre: 'Messine, Val Duchesse, Rome',
        texte:
          'En **juin 1955**, les ministres des Six se réunissent à **Messine**, en Sicile, et confient au Belge **Paul-Henri Spaak** le soin de préparer la suite. Son rapport, remis en 1956, propose deux chantiers : un **marché commun** général et une communauté de l’**énergie atomique**. Les négociations se tiennent au château de **Val Duchesse**, près de Bruxelles, pendant toute l’année 1956. Elles sont difficiles — la France craint la concurrence industrielle allemande et exige en échange une politique agricole et l’association de ses territoires d’outre-mer. La **crise de Suez**, en novembre 1956, tranche les hésitations : Français et Britanniques y sont humiliés par Washington et Moscou en quelques jours. Le **25 mars 1957**, au Capitole, dans la salle des Horaces et des Curiaces, les Six signent.',
      },
      {
        titre: 'Ce que le traité organise',
        texte:
          'Le cœur est l’**union douanière** : suppression progressive des droits de douane entre les Six, et **tarif extérieur commun** face au reste du monde — à l’intérieur on circule, à l’extérieur on parle d’une seule voix. S’y ajoutent les **quatre libertés** : marchandises, personnes, services, capitaux. Puis des politiques communes : **agriculture**, transports, concurrence, et un fonds social. Le traité crée aussi des institutions qui existent encore, sous d’autres noms : une **Commission** qui propose et surveille, un **Conseil des ministres** qui décide, une **Assemblée parlementaire** qui contrôle — élue au suffrage universel direct à partir de 1979 —, et une **Cour de justice** à Luxembourg dont les arrêts s’imposent aux États. Les 248 articles sont techniques ; le pari est politique.',
      },
      {
        titre: 'La PAC, la grande affaire française',
        texte:
          'La **politique agricole commune** est le prix payé à la France pour son entrée dans le marché commun, et elle est décidée en **janvier 1962**. Trois principes : un **marché unique** des produits agricoles, la **préférence communautaire** — on achète européen avant d’acheter ailleurs — et la **solidarité financière**, tous payant pour un fonds commun. Le mécanisme est simple : Bruxelles garantit un prix minimum, l’agriculteur produit sans craindre l’effondrement des cours. Les effets sont massifs : l’Europe, importatrice en 1957, devient l’une des premières exportatrices agricoles du monde, et la France sa première ferme. Le revers arrive dans les années 1980 : surproduction, « montagnes de beurre » et « lacs de lait » stockés aux frais du contribuable, d’où les quotas laitiers de 1984 et la réforme de 1992. La PAC absorbera longtemps plus de la moitié du budget européen.',
      },
      {
        titre: 'De six à vingt-sept',
        texte:
          'Le marché commun attire. Le Royaume-Uni, qui avait refusé d’entrer en 1957, frappe à la porte dès 1961 ; de Gaulle lui oppose deux vetos, et il n’entre qu’en **1973** avec l’Irlande et le Danemark. Suivent la Grèce (**1981**), l’Espagne et le Portugal (**1986**), sortis de leurs dictatures — l’adhésion sert de garantie démocratique. L’**Acte unique** de 1986 achève le marché intérieur au 1ᵉʳ janvier 1993 ; le traité de **Maastricht**, signé le 7 février 1992, transforme la CEE en **Union européenne**, ajoute une citoyenneté européenne et prépare la monnaie unique. L’**euro** apparaît dans les comptes en 1999, dans les poches le **1ᵉʳ janvier 2002**. Après les élargissements de 2004, 2007 et 2013, l’Union compte vingt-huit États — puis vingt-sept, le Royaume-Uni en étant sorti en 2020.',
      },
    ],
    consequences: [
      'Les droits de douane entre les Six disparaissent en onze ans : le commerce entre eux est multiplié par six dans la décennie.',
      'La politique agricole commune, décidée en 1962, modernise l’agriculture européenne et fait de la France une puissance exportatrice.',
      'Des institutions communes s’imposent aux États : une Commission, un Conseil, une Assemblée élue depuis 1979 et une Cour de justice.',
      'La guerre entre la France et l’Allemagne devient économiquement impensable : c’était l’objectif premier.',
      'La CEE s’élargit de six à vingt-sept membres et devient l’Union européenne à Maastricht en 1992.',
      'La monnaie unique, préparée par ce marché commun, entre dans les portefeuilles le 1ᵉʳ janvier 2002.',
    ],
    chiffres: [
      { valeur: '6', quoi: 'pays fondateurs en 1957 ; ils sont 27 aujourd’hui' },
      { valeur: '248', quoi: 'articles dans le traité instituant la CEE' },
      { valeur: '11 ans', quoi: 'pour supprimer les droits de douane entre les Six, de 1957 à 1968' },
      { valeur: '45 ans', quoi: 'entre la signature du traité et les premiers euros en poche' },
    ],
    chrono: [
      { date: '9 mai 1950', fait: 'Déclaration Schuman, écrite avec Jean Monnet.' },
      { date: '18 avril 1951', fait: 'Traité de Paris : la CECA réunit six pays.' },
      { date: '30 août 1954', fait: 'L’Assemblée française rejette la Communauté de défense.' },
      { date: 'juin 1955', fait: 'Conférence de Messine : on relance par l’économie.' },
      { date: 'novembre 1956', fait: 'La crise de Suez montre l’effacement des Européens.' },
      { date: '25 mars 1957', fait: 'Signature des traités de Rome : CEE et Euratom.' },
      { date: '1ᵉʳ janvier 1958', fait: 'Entrée en vigueur du marché commun.' },
      { date: 'janvier 1962', fait: 'Naissance de la politique agricole commune.' },
      { date: '1ᵉʳ juillet 1968', fait: 'Union douanière achevée entre les Six.' },
      { date: '1973', fait: 'Royaume-Uni, Irlande et Danemark rejoignent la CEE.' },
      { date: '7 février 1992', fait: 'Traité de Maastricht : naissance de l’Union européenne.' },
      { date: '1ᵉʳ janvier 2002', fait: 'Les premiers billets en euros circulent.' },
    ],
    leSaisTu:
      'Le jour de la signature, le traité était presque vide. L’imprimerie italienne n’avait pas terminé le texte : les chefs de délégation ont signé un volume dont seules la première et la dernière page étaient imprimées, le reste n’étant que des feuilles blanches. Le vrai texte est arrivé quelques jours plus tard.',
    aRetenir: [
      'Le traité de Rome est signé le 25 mars 1957 par six pays : France, RFA, Italie, Belgique, Pays-Bas et Luxembourg.',
      'Il crée la Communauté économique européenne (CEE) et la Communauté européenne de l’énergie atomique (Euratom).',
      'Il institue un marché commun : suppression des douanes entre les Six et tarif commun vers l’extérieur.',
      'La politique agricole commune, décidée en 1962, garantit les prix des produits agricoles européens.',
      'La CEE devient l’Union européenne au traité de Maastricht (1992) ; l’euro circule à partir de 2002.',
    ],
    mots: [
      {
        mot: 'Marché commun',
        sens: 'Espace où marchandises, personnes, services et capitaux circulent sans entrave entre les pays membres.',
      },
      {
        mot: 'Union douanière',
        sens: 'Suppression des droits de douane entre les membres et tarif unique appliqué aux produits venus d’ailleurs.',
      },
      {
        mot: 'Supranational',
        sens: 'Se dit d’une institution dont les décisions s’imposent aux États, au-dessus de leurs gouvernements.',
      },
      {
        mot: 'PAC',
        sens: 'Politique agricole commune : prix garantis, préférence européenne et budget commun pour l’agriculture.',
      },
      {
        mot: 'CECA',
        sens: 'Communauté européenne du charbon et de l’acier, créée en 1951 : la première pierre de l’Europe.',
      },
    ],
    lies: [
      'jean-monnet',
      'robert-schuman',
      'debut-de-la-guerre-froide',
      'creation-de-l-onu',
      'charles-de-gaulle',
    ],
    niveaux: ['3e', 'Tle'],
    programme: 'Le monde depuis 1945',
    tags: [
      'traité de Rome',
      'CEE',
      'Euratom',
      'marché commun',
      'Schuman',
      'Jean Monnet',
      'CECA',
      'PAC',
      'Europe',
      'Union européenne',
      '1957',
      'Six',
    ],
  },
]
