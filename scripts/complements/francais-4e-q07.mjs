// Français 4e — lot 07 : quatre questions de plus par fiche (18 fiches),
// de la presse et des médias à la nouvelle du XVIIIe siècle à nos jours.
//
// Elles portent sur ce que le cours dit et que le quiz ne testait pas encore
// (genres et architecture de l’article, procédés de propagande, œuvres et
// personnages secondaires, procédés d’écriture, formes et dates) ; aucune ne
// reprend une question existante.

export default {
  slug: 'francais',
  titreMigration: 'QUESTIONS EN PLUS — FRANÇAIS 4e (lot 07)',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveau: "4e", titre: "Lire et comprendre la presse et les médias",
      questions: [
        ['Quel genre journalistique suppose que le journaliste s’est rendu sur place et raconte ce qu’il a vu ?', ['La brève', 'L’éditorial', 'Le reportage', 'La chronique'], 2, 'Le reportage repose sur le témoignage direct du journaliste présent sur les lieux. La brève donne l’essentiel en quelques lignes ; l’éditorial et la chronique expriment une opinion.'],
        ['Dans un article, comment appelle-t-on la première phrase du texte, celle qui doit accrocher le lecteur ?', ['Le chapô', 'L’intertitre', 'La chute', 'L’attaque'], 3, 'Un article se lit dans l’ordre titre → chapô → attaque → corps → chute : l’attaque ouvre le texte, la chute le referme.'],
        ['Que signifie « recouper » une information ?', ['La raccourcir pour qu’elle tienne dans la page', 'Vérifier que plusieurs médias indépendants la donnent', 'Recadrer la photo qui l’accompagne', 'La répéter dans le titre et dans le chapô'], 1, 'Une information confirmée par plusieurs médias indépendants les uns des autres est plus solide. Le recoupement est le cœur du travail d’enquête.'],
        ['Laquelle de ces limites la loi pose-t-elle à la liberté de la presse ?', ['Interdire la diffamation et l’injure', 'Interdire de critiquer le gouvernement', 'Obliger les journaux à paraître chaque jour', 'Interdire toute opinion dans un journal'], 0, 'La loi de 1881 garantit la liberté de la presse, mais punit la diffamation, l’injure et l’incitation à la haine. Critiquer le pouvoir, en revanche, fait partie de cette liberté.'],
      ],
    },
    {
      niveau: "4e", titre: "Étude de textes et documents produits à des fins de propagande",
      questions: [
        ['Un tract affirme : « Des millions de gens le savent déjà ! » Quel procédé de propagande emploie-t-il ?', ['La falsification', 'L’argument d’autorité', 'Le culte du chef', 'La simplification'], 1, 'Invoquer « tout le monde » ou « des millions de gens » remplace la preuve par le nombre : c’est un argument d’autorité, qui dispense de vérifier.'],
        ['Quel procédé consiste à marteler un slogan jusqu’à ce qu’il paraisse évident ?', ['L’appel aux émotions', 'La désignation d’un ennemi', 'La falsification', 'La répétition'], 3, 'À force d’être entendu partout, un slogan finit par sembler vrai, alors qu’aucune preuve n’a été donnée.'],
        ['Lequel de ces éléments est un contre-pouvoir face à la propagande ?', ['La censure des journaux', 'Le culte du chef', 'La pluralité des médias', 'Le slogan unique'], 2, 'Quand des médias indépendants coexistent, un mensonge peut être contredit. Le droit de réponse, la vérification des faits et l’éducation aux médias jouent le même rôle.'],
        ['Des chiffres tronqués ou une photo sortie de son contexte relèvent de quel procédé ?', ['La falsification', 'La répétition', 'L’argument d’autorité', 'La simplification'], 0, 'Falsifier ne suppose pas toujours d’inventer : il suffit de couper un chiffre ou de déplacer une photo pour lui faire dire autre chose que la réalité.'],
      ],
    },
    {
      niveau: "4e", titre: "Le journalisme à travers les romans et les films du XIXe siècle à nos jours",
      questions: [
        ['Qui est le héros d’Illusions perdues, venu de province réussir dans le journalisme parisien ?', ['Georges Duroy', 'Eugène de Rastignac', 'Lucien de Rubempré', 'Albert Londres'], 2, 'Lucien de Rubempré monte à Paris, réussit dans le journalisme et s’y perd : Balzac montre un milieu où l’article se vend.'],
        ['Pour quel journal travaillent les deux journalistes des Hommes du président ?', ['Le New York Times', 'Le Boston Globe', 'Le Chicago Tribune', 'Le Washington Post'], 3, 'Deux journalistes du Washington Post enquêtent sur le Watergate ; leurs révélations mènent jusqu’à la démission d’un président.'],
        ['Dans Bel-Ami, à quoi sert surtout le journal ?', ['À défendre les plus pauvres', 'À spéculer et à manœuvrer en politique', 'À publier des romans-feuilletons', 'À former de jeunes écrivains'], 1, 'Chez Maupassant, le journal sert les intérêts de ceux qui le dirigent : on y informe moins qu’on n’y spécule et qu’on n’y fait de la politique.'],
        ['Quel genre journalistique Albert Londres a-t-il inventé ?', ['Le grand reportage', 'Le roman-feuilleton', 'L’éditorial politique', 'Le journal télévisé'], 0, 'Albert Londres part sur le terrain et raconte ce qu’il voit : c’est le grand reportage. Pour lui, le journaliste doit « porter la plume dans la plaie ».'],
      ],
    },
    {
      niveau: "4e", titre: "La ville comme sujet de roman",
      questions: [
        ['Dans quel quartier de Paris se joue L’Assommoir de Zola ?', ['Le Marais', 'La Goutte-d’Or', 'Montmartre', 'Le Quartier latin'], 1, 'L’histoire tient dans quelques rues de la Goutte-d’Or, quartier ouvrier : pour Zola, le quartier explique le destin des personnages.'],
        ['Quel nom reste attaché aux grands travaux qui transforment Paris au XIXe siècle ?', ['Colbert', 'Eiffel', 'Le Nôtre', 'Haussmann'], 3, 'Les grands travaux d’Haussmann percent de larges boulevards et font disparaître des quartiers entiers : Paris devient méconnaissable, et le roman s’en empare.'],
        ['Pour Balzac, qu’est-ce surtout que la ville ?', ['Un refuge paisible', 'Un souvenir d’enfance', 'Un champ de bataille', 'Un décor de fête'], 2, 'La ville de Balzac promet, donne, puis dévore : Rastignac la défie comme un adversaire, du haut du Père-Lachaise.'],
        ['Un romancier décrit un boulevard illuminé, puis, à deux rues de là, une impasse boueuse. Quel procédé utilise-t-il ?', ['Le contraste', 'La personnification', 'La focalisation interne', 'L’ellipse'], 0, 'Le contraste oppose quartiers riches et pauvres, souvent très proches : il fait voir les inégalités de la ville et le jugement du romancier.'],
      ],
    },
    {
      niveau: "4e", titre: "La ville comme objet poétique",
      questions: [
        ['Quel poète écrit « Il pleure dans mon cœur / Comme il pleut sur la ville » ?', ['Baudelaire', 'Apollinaire', 'Verlaine', 'Rimbaud'], 2, 'Chez Verlaine, la pluie sur la ville répond à la tristesse du poète : le paysage urbain devient un état d’âme.'],
        ['Quelle particularité d’écriture frappe dans « Zone » d’Apollinaire ?', ['L’absence de ponctuation', 'L’emploi du sonnet', 'La prose rimée', 'L’absence de verbes'], 0, 'Apollinaire supprime la ponctuation : le rythme du vers et le retour à la ligne suffisent, et le poème épouse le mouvement de la ville moderne.'],
        ['Quel procédé, en accumulant les éléments, mime le défilé du regard du poète dans la ville ?', ['L’oxymore', 'La synesthésie', 'La personnification', 'L’énumération'], 3, 'L’énumération aligne ce que l’œil saisit en passant — affiches, visages, vitrines — comme un flâneur qui avance dans la rue.'],
        ['Comment Rimbaud voit-il la ville dans les Illuminations ?', ['Pluvieuse et mélancolique', 'Rêvée et démesurée', 'Grise et silencieuse', 'Paisible et rurale'], 1, 'Rimbaud invente des villes gigantesques et impossibles : la ville n’y est plus décrite, elle est rêvée. La ville pluvieuse et mélancolique, c’est celle de Verlaine.'],
      ],
    },
    {
      niveau: "4e", titre: "L’importance de la ville dans le roman policier",
      questions: [
        ['Comment s’appelle l’enquêteur de « Double assassinat dans la rue Morgue » ?', ['Hercule Poirot', 'Le chevalier Dupin', 'Le commissaire Maigret', 'Rouletabille'], 1, 'Chez Poe, le chevalier Dupin résout l’énigme par la seule déduction : il est l’ancêtre des détectives logiciens, Sherlock Holmes compris.'],
        ['Quel ancien bagnard, devenu chef de la Sûreté, a inspiré les romanciers ?', ['Vidocq', 'Gaboriau', 'Lupin', 'Maigret'], 0, 'Vidocq connaissait le crime de l’intérieur avant de le combattre à la tête de la Sûreté : sa vie romanesque a nourri l’imagination des écrivains.'],
        ['Dans quel sous-genre le suspense l’emporte-t-il sur l’énigme ?', ['Le roman à énigme', 'Le roman judiciaire', 'Le thriller', 'Le roman noir'], 2, 'Dans le thriller, on ne se demande plus seulement qui est coupable : on court après le criminel, et la menace tient le lecteur en haleine.'],
        ['Quel auteur a inventé le roman judiciaire ?', ['Georges Simenon', 'Maurice Leblanc', 'Gaston Leroux', 'Émile Gaboriau'], 3, 'Émile Gaboriau fait du roman le récit d’une affaire criminelle et de son instruction : il est l’un des pionniers français du genre.'],
      ],
    },
    {
      niveau: "4e", titre: "La ville dans la photographie, les films et la bande-dessinée",
      questions: [
        ['Qu’a-t-on appris sur le célèbre « baiser de l’Hôtel de Ville » de Robert Doisneau ?', ['C’est une photo mise en scène, avec un couple qui pose', 'Il a été saisi par hasard, à l’insu du couple', 'C’est un photomontage de deux images différentes', 'C’est une image tirée d’un film de l’époque'], 0, 'Doisneau a fait poser un couple pour cette image : une photo qui a l’air spontanée ne l’est pas toujours, et il faut s’interroger sur sa fabrication.'],
        ['À quel photographe doit-on l’idée d’« instant décisif » ?', ['Eugène Atget', 'Willy Ronis', 'Henri Cartier-Bresson', 'Robert Doisneau'], 2, 'Pour Cartier-Bresson, tout se joue dans la fraction de seconde où la forme et le sens d’une scène se rejoignent : c’est là qu’il faut déclencher.'],
        ['Au cinéma, à quoi sert surtout le gros plan ?', ['À situer l’action dans son décor', 'À faire sentir l’émotion d’un personnage', 'À suivre un personnage qui se déplace', 'À filmer une scène sans aucune coupure'], 1, 'Le plan général situe, le gros plan rapproche du visage, donc de l’émotion. Suivre un personnage, c’est le travelling ; filmer sans coupure, le plan-séquence.'],
        ['Quel film de 1995 fait de la banlieue un décor de cinéma à part entière ?', ['Metropolis', 'Blade Runner', 'Les Hommes du président', 'La Haine'], 3, 'La Haine filme la banlieue et ses tours comme le cinéma avait filmé autrefois les quais et les faubourgs : un lieu qui porte son propre récit.'],
      ],
    },
    {
      niveau: "4e", titre: "Un roman naturaliste : L’Assommoir de Zola",
      questions: [
        ['Quel est le sous-titre des Rougon-Macquart ?', ['Études de mœurs parisiennes sous la monarchie de Juillet', 'Histoire naturelle et sociale d’une famille sous le Second Empire', 'Chronique ouvrière d’une ville de province sous la Restauration', 'Tableau moral et politique de la France sous la République'], 1, 'Zola suit une même famille sur cinq générations : « naturelle » pour l’hérédité qu’il étudie, « sociale » pour les milieux qu’il traverse.'],
        ['Quel accident fait basculer la vie de Gervaise et de Coupeau ?', ['Le départ de Gervaise pour la province', 'Un incendie dans leur immeuble', 'La chute de Coupeau d’un toit', 'Une dispute avec le père Colombe'], 2, 'Coupeau, ouvrier zingueur, tombe d’un toit ; pendant sa convalescence, il cesse de travailler et se met à boire. C’est le début de la déchéance.'],
        ['Selon Le Roman expérimental, que doit être le romancier ?', ['Un poète et un visionnaire', 'Un moraliste et un prédicateur', 'Un historien et un juge', 'Un observateur et un expérimentateur'], 3, 'Comme un savant, le romancier naturaliste observe et se documente, puis place ses personnages dans un milieu pour voir ce que produisent l’hérédité et ce milieu.'],
        ['Où Gervaise finit-elle ses jours ?', ['Dans un réduit sous l’escalier', 'Dans un hôpital de province', 'Dans la boutique du père Colombe', 'Chez sa fille Nana'], 0, 'Gervaise, qui ne demandait qu’une vie tranquille, meurt dans la misère, dans un réduit sous l’escalier : Zola montre jusqu’au bout l’effet du milieu.'],
      ],
    },
    {
      niveau: "4e", titre: "Une nouvelle réaliste : « La Parure » de Maupassant et l’adaptation éponyme de Claude Chabrol",
      questions: [
        ['Combien les Loisel paient-ils la parure qui remplace celle qu’ils ont perdue ?', ['500 francs', '5 000 francs', '36 000 francs', '100 000 francs'], 2, 'Ils paient 36 000 francs, empruntés en grande partie, alors que le bijou perdu valait au plus 500 francs : toute la cruauté de la nouvelle est dans cet écart.'],
        ['Quel indice préparait discrètement la chute ?', ['Le bijoutier ne reconnaît pas la parure', 'Madame Forestier refuse de la prêter', 'Loisel soupçonne un vol au bal', 'Mathilde a déjà perdu un bijou'], 0, 'Le bijoutier dont le nom figure sur la boîte n’a fourni que l’écrin : à la relecture, on comprend que ce bijou n’était pas ce qu’il paraissait.'],
        ['Chez Maupassant, qu’est-ce qui frappe Mathilde ?', ['La fatalité voulue par les dieux', 'Le hasard, qui n’a pas de justice à rendre', 'La vengeance de Madame Forestier', 'Une punition méritée par ses fautes'], 1, 'Une simple perte au retour d’un bal coûte dix ans de misère : ce n’est pas le destin qui punit, c’est le hasard, sans rapport avec la gravité de la faute.'],
        ['Que perd l’adaptation de Chabrol par rapport à la nouvelle ?', ['Les décors et la lumière du bal', 'Le corps et le costume des acteurs', 'La durée réelle des scènes', 'Les dix ans résumés en un paragraphe'], 3, 'La caméra ajoute les décors, les corps et la durée réelle, mais elle ne peut pas condenser dix années en quelques lignes comme le fait le narrateur de Maupassant.'],
      ],
    },
    {
      niveau: "4e", titre: "Une nouvelle fantastique : « La Chute de la maison Usher » d’Edgar Allan Poe",
      questions: [
        ['Quel lien unit Roderick et Madeline Usher ?', ['Ils sont mari et femme', 'Ils sont frère et sœur jumeaux', 'Elle est sa cousine éloignée', 'Elle est sa fille unique'], 1, 'Madeline est la sœur jumelle de Roderick : les derniers Usher sont liés jusque dans la mort, comme la maison l’est à ses habitants.'],
        ['Dans quel genre le surnaturel est-il expliqué par la science ?', ['Le fantastique', 'Le merveilleux', 'La science-fiction', 'Le conte'], 2, 'La science-fiction explique l’étrange par la science ; le merveilleux l’accepte comme allant de soi ; seul le fantastique laisse le lecteur hésiter.'],
        ['Pourquoi le narrateur se rend-il dans la maison Usher ?', ['Il est appelé au chevet de son ami d’enfance', 'Il veut acheter le domaine', 'Il enquête sur la mort de Madeline', 'Il est le médecin de la famille'], 0, 'Le narrateur, un ami d’enfance dont on ne saura jamais le nom, répond à l’appel de Roderick : c’est par ses yeux de témoin qu’on découvre la maison.'],
        ['Quelle « correspondance » la nouvelle établit-elle entre la maison et ses habitants ?', ['La maison est hantée par leurs ancêtres', 'Roderick a construit la maison lui-même', 'Les habitants veulent quitter la maison', 'Les deux se fissurent et s’effondrent ensemble'], 3, 'La lézarde de la façade annonce la fin de la lignée : la maison sombre dans l’étang au moment même où meurent les derniers Usher.'],
      ],
    },
    {
      niveau: "4e", titre: "La poésie lyrique et amoureuse de l’Antiquité à nos jours",
      questions: [
        ['Comment appelle-t-on le poème lyrique de la plainte ?', ['L’ode', 'L’élégie', 'La ballade', 'Le sonnet'], 1, 'L’élégie dit la plainte : l’amour perdu, l’absence, le deuil. L’ode, au contraire, célèbre.'],
        ['De quel poète vient le sonnet que les poètes français du XVIe siècle adoptent ?', ['Sappho', 'Virgile', 'Pétrarque', 'Ovide'], 2, 'Le sonnet vient de Pétrarque, poète italien du XIVe siècle, qui en a fait la forme du chant amoureux ; au XVIe siècle, Ronsard et Louise Labé l’acclimatent en français.'],
        ['Quel poète du XXe siècle a écrit « Les Yeux d’Elsa » ?', ['Éluard', 'Apollinaire', 'Musset', 'Aragon'], 3, 'Aragon a consacré de nombreux poèmes à Elsa Triolet, sa compagne : il renouvelle au XXe siècle la tradition du chant d’amour.'],
        ['À quel mouvement appartiennent Lamartine, Hugo et Musset ?', ['Le romantisme', 'La Pléiade', 'Le classicisme', 'Le surréalisme'], 0, 'Au XIXe siècle, les romantiques placent le moi et ses émotions au cœur du poème : l’amour, la nature et la fuite du temps deviennent leurs grands thèmes.'],
      ],
    },
    {
      niveau: "4e", titre: "« Demain, dès l’aube… », Victor Hugo",
      questions: [
        ['Où Léopoldine, la fille de Victor Hugo, s’est-elle noyée en 1843 ?', ['Dans la Seine, à Villequier', 'Dans la mer, à Harfleur', 'Dans la Loire, à Nantes', 'Dans le Rhône, à Lyon'], 0, 'En septembre 1843, Léopoldine, dix-neuf ans, se noie dans la Seine à Villequier. Le poème raconte le chemin vers sa tombe.'],
        ['Quel procédé met en valeur le « je » repris en tête de vers (« Je partirai », « Je marcherai », « Je ne regarderai ») ?', ['L’antithèse', 'L’anaphore', 'L’oxymore', 'La personnification'], 1, 'La reprise du « je » en tête de vers montre un homme tout entier tourné vers un seul geste : aller jusqu’à sa fille.'],
        ['Qu’exprime l’antithèse finale entre le houx vert et la bruyère en fleur ?', ['La joie et la colère', 'L’été et l’hiver', 'La richesse et la pauvreté', 'La fidélité et le deuil'], 3, 'Le houx, persistant et piquant, dit la fidélité qui dure ; la bruyère en fleur, fragile, dit la vie brève. Le même bouquet réunit l’amour et la perte.'],
        ['En quelle année paraissent Les Contemplations, où figure le poème ?', ['1843', '1830', '1856', '1885'], 2, 'Le recueil paraît en 1856, treize ans après la mort de Léopoldine : ce deuil de 1843 en est le centre.'],
      ],
    },
    {
      niveau: "4e", titre: "La tragédie au XVIIe siècle : Bérénice de Racine",
      questions: [
        ['Selon la préface de Racine, que suffit-il qu’une tragédie ait, à défaut de sang et de morts ?', ['Un dénouement heureux', 'Un chœur qui commente', 'Une action grande', 'Une double intrigue amoureuse'], 2, 'Racine l’écrit dans sa préface : « il suffit que l’action en soit grande ». La grandeur de Bérénice tient au sacrifice, pas au sang.'],
        ['Quel est le conflit tragique au cœur de Bérénice ?', ['La richesse contre la pauvreté', 'L’amour contre le devoir', 'La jeunesse contre la vieillesse', 'La ruse contre la force'], 1, 'Titus aime Bérénice, mais la loi de Rome interdit à son empereur d’épouser une reine étrangère : la passion se heurte au devoir.'],
        ['Quel philosophe grec a fait de la catharsis le but de la tragédie ?', ['Platon', 'Socrate', 'Sophocle', 'Aristote'], 3, 'Aristote assigne à la tragédie de purger les passions du spectateur par la terreur et la pitié ; les auteurs classiques du XVIIe siècle reprennent cette idée.'],
        ['Comment qualifier la langue de Racine ?', ['Simple, au vocabulaire volontairement restreint', 'Savante, remplie de mots rares', 'Familière, mêlée de mots d’argot', 'Très imagée, surchargée de figures'], 0, 'Racine écrit avec peu de mots, choisis pour leur musique : la simplicité de la langue rend la douleur plus nue.'],
      ],
    },
    {
      niveau: "4e", titre: "La comédie au XVIIIe siècle",
      questions: [
        ['Un personnage avare poussé jusqu’au ridicule relève de quel comique ?', ['Le comique de mots', 'Le comique de gestes', 'Le comique de caractère', 'Le comique de situation'], 2, 'Le comique de caractère grossit un défaut jusqu’à l’excès : avarice, jalousie, vanité. On rit de ce qu’est le personnage, pas de ce qui lui arrive.'],
        ['Que Figaro reproche-t-il à son maître ?', ['De s’être donné la peine de naître', 'D’avoir trop voyagé à l’étranger', 'D’avoir épousé une simple servante', 'D’être bien trop généreux avec lui'], 0, 'Pour Figaro, le comte ne doit sa fortune et son rang qu’à sa naissance, non à son mérite : une critique directe des privilèges, cinq ans avant la Révolution.'],
        ['En quelle année est créé Le Barbier de Séville ?', ['1730', '1784', '1670', '1775'], 3, 'Le Barbier de Séville (1775) fait connaître Figaro ; Le Mariage de Figaro suit en 1784, après plusieurs années d’interdiction.'],
        ['Que vise la critique sociale dans la comédie du XVIIIe siècle ?', ['Les progrès des sciences et des arts', 'Le mariage arrangé et le pouvoir des pères', 'Les voyages lointains et le commerce', 'Les querelles entre poètes classiques'], 1, 'Sous le rire, la comédie interroge l’inégalité des conditions, les mariages imposés et l’autorité des pères.'],
      ],
    },
    {
      niveau: "4e", titre: "Un exemple de comédie du XVIIIe siècle : Le Jeu de l’amour et du hasard, Marivaux",
      questions: [
        ['Qui sont Monsieur Orgon et Mario ?', ['Le père et le frère de Silvia', 'Le père et le valet de Dorante', 'Deux prétendants de Lisette', 'Deux domestiques de la maison'], 0, 'Orgon, père de Silvia, et Mario, son frère, sont dans la confidence du double déguisement et laissent faire : ils regardent le jeu comme le public.'],
        ['Pourquoi Silvia prolonge-t-elle l’épreuve après avoir appris qui est Dorante ?', ['Pour punir Dorante de son mensonge', 'Pour être sûre d’être aimée pour elle-même', 'Pour laisser à Lisette le temps de fuir', 'Pour obéir à un ordre de son père'], 1, 'Silvia veut que Dorante l’aime alors qu’il la croit servante : ainsi, elle sera certaine d’être aimée pour elle-même, et non pour son rang.'],
        ['Qu’est-ce qui trahit le vrai rang des personnages malgré leur déguisement ?', ['Leur costume', 'Leur prénom', 'Leur âge', 'Leur langage'], 3, 'L’habit change, pas la façon de parler : Arlequin déguisé en maître garde ses manières de valet, et le spectateur s’en amuse.'],
        ['Quelle est la forme du Jeu de l’amour et du hasard ?', ['Cinq actes en alexandrins', 'Trois actes en alexandrins', 'Trois actes en prose', 'Un seul acte en prose'], 2, 'Marivaux écrit en prose : ce choix sert un dialogue vif et naturel, où les mots trahissent les sentiments que les personnages voudraient cacher.'],
      ],
    },
    {
      niveau: "4e", titre: "Le drame du XIXe siècle : Lorenzaccio, Alfred de Musset",
      questions: [
        ['Que signifie le surnom « Lorenzaccio » ?', ['Le petit Lorenzo', 'Le mauvais Lorenzo', 'Lorenzo le sage', 'Lorenzo le Florentin'], 1, 'Le suffixe italien -accio est péjoratif : les Florentins méprisent ce débauché, sans savoir qu’il joue un rôle pour approcher le tyran.'],
        ['Où et quand se déroule l’action de Lorenzaccio ?', ['À Florence, en 1537', 'À Venise, en 1789', 'À Rome, en 1600', 'À Paris, en 1830'], 0, 'La pièce se passe dans la Florence de 1537, sous la tyrannie d’Alexandre de Médicis : Musset y transpose le désenchantement de sa propre génération.'],
        ['Qu’exige le drame romantique à la place du décor conventionnel ?', ['Un décor unique, le même pour tous', 'Aucun décor, pour laisser place au texte', 'La couleur locale, précise et historique', 'Un décor antique, grec ou romain'], 2, 'Le drame romantique veut faire voir une époque : costumes, lieux et détails historiques précis, pour que le spectateur s’y croie.'],
        ['Comment appelle-t-on le désenchantement de la génération de Musset, née trop tard pour la Révolution ?', ['L’esprit des Lumières', 'Le spleen de Paris', 'L’amour courtois', 'Le mal du siècle'], 3, 'Les jeunes gens des années 1830 ne trouvent plus de grande cause à servir. Lorenzo, qui agit sans croire à son acte, incarne ce mal du siècle.'],
      ],
    },
    {
      niveau: "4e", titre: "La tragi-comédie au XVIIe siècle : Le Cid, Corneille",
      questions: [
        ['Que doit faire Chimène après la mort de son père ?', ['Réclamer au roi la mort de Rodrigue', 'Épouser Rodrigue sans attendre', 'Quitter l’Espagne pour toujours', 'Défier elle-même Rodrigue en duel'], 0, 'Chimène aime toujours Rodrigue, mais l’honneur lui impose de réclamer sa mort au roi : elle vit à son tour un déchirement cornélien.'],
        ['Comment le roi dénoue-t-il la situation à la fin de la pièce ?', ['Il exile Rodrigue loin de la cour', 'Il enferme Chimène dans un couvent', 'Il condamne Don Diègue à l’exil', 'Il accorde aux amants un délai d’un an'], 3, 'Le roi laisse au temps le soin d’apaiser la blessure. C’est cette fin heureuse — Chimène promise au meurtrier de son père — que l’Académie jugea contraire à la bienséance.'],
        ['En quelle année Corneille rebaptise-t-il Le Cid « tragédie » ?', ['1637', '1648', '1670', '1730'], 1, 'Créé en 1637 comme tragi-comédie, Le Cid devient « tragédie » dans l’édition de 1648, après la querelle qui a contribué à fixer les règles classiques.'],
        ['En quoi le héros de Racine s’oppose-t-il au héros de Corneille ?', ['Il choisit toujours l’honneur', 'Il triomphe par la ruse', 'Il est écrasé par une passion qu’il subit', 'Il ne connaît aucun conflit'], 2, 'Le héros cornélien se définit par sa volonté et grandit par son choix ; le héros racinien subit une passion qui le dépasse et l’écrase.'],
      ],
    },
    {
      niveau: "4e", titre: "La nouvelle du XVIIIe siècle à nos jours",
      questions: [
        ['Qui a écrit la nouvelle fantastique La Vénus d’Ille ?', ['Maupassant', 'Mérimée', 'Voltaire', 'Poe'], 1, 'Dans La Vénus d’Ille, de Prosper Mérimée, une statue de bronze semble prendre vie : le lecteur hésite jusqu’au bout entre explication naturelle et surnaturel.'],
        ['Pourquoi le XIXe siècle est-il l’âge d’or de la nouvelle ?', ['Parce que les romans y sont interdits', 'Parce que le théâtre y a disparu', 'Parce que la presse en publie chaque semaine', 'Parce que les livres y sont gratuits'], 2, 'Les journaux publient chaque semaine des récits courts : Maupassant a ainsi donné à la presse la plupart de ses quelque trois cents nouvelles.'],
        ['Qu’est-ce qu’une bonne chute, selon le cours ?', ['Une fin qui surgit sans aucun indice', 'Une fin longue et très détaillée', 'Une fin qui résume tout le récit', 'Une fin préparée par des indices'], 3, 'À la relecture, les indices étaient là : une chute qui sort de nulle part n’étonne pas, elle paraît invraisemblable.'],
        ['Dans quel registre le surnaturel est-il admis sans étonnement ?', ['Le merveilleux', 'Le fantastique', 'Le réaliste', 'L’absurde'], 0, 'Dans le merveilleux, comme dans les contes, personne ne s’étonne qu’un animal parle ; dans le fantastique, au contraire, l’étrange inquiète.'],
      ],
    },
  ],
}
