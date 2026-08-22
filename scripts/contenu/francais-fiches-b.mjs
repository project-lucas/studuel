// Français — PREMIÈRE : le rayon « Fiches de lecture » (2/5).
//
// SUITE DE `francais-fiches-a.mjs`. Même format court, même rayon « fiches »,
// mêmes titres portant l'auteur (ce qui évite la collision avec les fiches du
// rayon Programme, `chapters` étant UNIQUE(subject_id, level, title)).
//
// LES POSITIONS REPRENNENT À 152 : le module A occupe 100 à 151. L'ordre
// alphabétique de la maquette est ainsi celui de la page, qui trie par
// `position`.
//
// AUCUN MÉNAGE ICI : il est joué par la 259, à exécuter AVANT.

export default {
  slug: 'francais',
  nom: 'Français',

  titreMigration: 'FRANÇAIS 1re — FICHES DE LECTURE (2/5) : Eugénie Grandet → La Curée',

  motif: `DEUXIÈME TRANCHE DES FICHES DE LECTURE (voir la 261 pour le détail du
rayon et de son format). Cinquante-deux œuvres, d'Eugénie Grandet à La Curée.

Les positions reprennent à 152, derrière les 52 fiches de la 261 : l'ordre
alphabétique de la maquette est celui de la page, qui trie par position.

⚠️ ORDRE D'EXÉCUTION : la 259 D'ABORD (colonnes theme et discipline, ménage
des composites). Cette migration n'écrit que des fiches neuves.`,

  blocs: [
    {
      niveaux: ['1re'],
      rayon: 'fiches',
      axe: 'Fiches de lecture',
      positionDepart: 152,
      chapitres: [
        {
          titre: 'Eugénie Grandet, Honoré de Balzac',
          lecon: {
            titre: 'Balzac, 1833 — l’avarice contre une vie',
            cours: `## L’histoire
À **Saumur**, le père **Grandet**, ancien tonnelier devenu l’homme le plus riche de la ville, vit dans une maison glacée avec sa femme et sa fille **Eugénie**, qu’il tient dans l’ignorance de sa fortune. Deux familles, les Cruchot et les des Grassins, courtisent l’héritière. Arrive le cousin **Charles**, ruiné par le suicide de son père. Eugénie l’aime, lui donne en secret son or ; il part faire fortune aux Indes en lui promettant le mariage. Grandet, découvrant le don, séquestre sa fille au pain et à l’eau ; sa femme en meurt. Sept ans plus tard, Charles revient riche, épouse une aristocrate laide et rompt par lettre. Eugénie paie les dettes de l’oncle, épouse sans amour le président de Bonfons, se retrouve veuve — et vit désormais comme son père, immensément riche et seule.

## À retenir
Roman des *Scènes de la vie de province*. L’**argent** y est un personnage : il structure la maison, la ville, le mariage, la piété. Balzac construit une tragédie domestique à partir de rien — quelques pièces d’or, un morceau de sucre coupé en deux. La fin est cruelle : la victime finit par ressembler à son bourreau.

> « Sa vie n’a pas été heureuse, et son cœur n’a pas été rempli. »`,
          },
          questions: [
            ['Où se déroule le roman ?', ['À Saumur', 'À Angoulême', 'À Paris', 'À Tours'], 0, 'Il appartient aux Scènes de la vie de province.'],
            ['Comment le père Grandet a-t-il fait fortune ?', ['Ancien tonnelier, il a spéculé sur les terres et les biens nationaux', 'Par héritage', 'Dans le commerce colonial', 'Par un mariage riche'], 0, 'Il tient sa famille dans l’ignorance de sa richesse.'],
            ['Que donne Eugénie à son cousin Charles ?', ['Son or, en secret', 'La maison familiale', 'Une lettre de recommandation', 'Rien'], 0, 'La découverte de ce don déclenche la séquestration.'],
            ['Que fait Charles à son retour ?', ['Il épouse une aristocrate et rompt par lettre', 'Il épouse Eugénie', 'Il meurt aux Indes', 'Il rembourse tout le monde'], 0, 'La fortune l’a rendu semblable au vieux Grandet.'],
            ['Comment finit Eugénie ?', ['Riche, veuve et seule, vivant comme son père', 'Ruinée', 'Mariée à Charles', 'Au couvent'], 0, 'La victime finit par ressembler à son bourreau.'],
            ['L’argent est un simple arrière-plan dans ce roman.', ['Vrai', 'Faux'], 1, 'Il est un personnage : il structure la maison, la ville, les mariages et jusqu’à la piété.'],
          ],
        },
        {
          titre: 'Fables, Jean de La Fontaine',
          lecon: {
            titre: 'La Fontaine, 1668-1694 — instruire en amusant',
            cours: `## L’œuvre
Douze livres publiés en trois recueils : **1668** (livres I-VI), **1678-1679** (VII-XI), **1694** (XII). La Fontaine emprunte ses sujets à **Ésope**, **Phèdre** et à la tradition orientale (Pilpay), mais en fait une œuvre neuve par le style.

## La forme
Le **vers libre** classique : alternance d’alexandrins, d’octosyllabes et de vers courts, qui épouse le rythme du récit et souligne les chutes. Dialogues vifs, portraits en deux mots, **morale** placée au début, à la fin, ou absente.

## Les fables à connaître
Livre I-VI : « La Cigale et la Fourmi », « Le Corbeau et le Renard », « Le Loup et l’Agneau », « Le Chêne et le Roseau », « Le Rat de ville et le Rat des champs ». Livres VII-XI : « Les Animaux malades de la peste », « La Laitière et le Pot au lait », « Le Coche et la Mouche », « Le Savetier et le Financier », « Les Deux Pigeons », « Les Obsèques de la Lionne ».

## À retenir
Sous l’apparence enfantine, une **satire de la cour** de Louis XIV (le lion roi, les courtisans, la justice du plus fort), une réflexion sur la condition humaine et une défense du bonheur discret. « Une morale nue apporte de l’ennui : le conte fait passer le précepte avec lui. »

> « La raison du plus fort est toujours la meilleure. »`,
          },
          questions: [
            ['Combien de livres les Fables comptent-elles ?', ['Douze', 'Six', 'Vingt', 'Trois'], 0, 'Publiés en trois recueils, de 1668 à 1694.'],
            ['À quels auteurs La Fontaine emprunte-t-il ses sujets ?', ['Ésope, Phèdre et la tradition orientale', 'Homère et Virgile', 'Sénèque et Cicéron', 'Rabelais et Marot'], 0, 'Il transforme la matière par le style, pas par l’invention.'],
            ['Quelle forme métrique caractérise les Fables ?', ['Le vers libre classique, mélangeant les mètres', 'L’alexandrin exclusivement', 'La prose', 'Le décasyllabe'], 0, 'Le changement de mètre souligne les chutes.'],
            ['Que dénonce « Les Animaux malades de la peste » ?', ['La justice qui condamne le plus faible', 'La peur des épidémies', 'L’avarice des marchands', 'L’ignorance des paysans'], 0, '« Selon que vous serez puissant ou misérable… »'],
            ['Quelle est la formule de La Fontaine sur la morale ?', ['« Une morale nue apporte de l’ennui »', '« Il faut châtier les mœurs par le rire »', '« Le vrai peut quelquefois n’être pas vraisemblable »', '« Rien n’est plus beau que le vrai »'], 0, 'Le conte fait passer le précepte avec lui.'],
            ['Les Fables ne visent que le jeune public.', ['Vrai', 'Faux'], 1, 'Sous l’apparence enfantine, elles font la satire de la cour de Louis XIV.'],
          ],
        },
        {
          titre: 'Fin de partie, Samuel Beckett',
          lecon: {
            titre: 'Beckett, 1957 — la dernière partie d’échecs',
            cours: `## La pièce
Un acte unique, un intérieur nu avec deux fenêtres hautes. **Hamm**, aveugle et paralysé, trône dans un fauteuil à roulettes ; **Clov**, son serviteur, ne peut pas s’asseoir et ne peut pas partir. Dans deux poubelles vivent **Nagg** et **Nell**, les parents de Hamm, cul-de-jatte, qui se souviennent d’un jour heureux au lac de Côme. Dehors, il n’y a plus rien : « zéro », dit Clov en regardant par la fenêtre. La journée passe en rituels, en histoires racontées, en menaces de départ. À la fin, Clov, prêt à partir, reste sur le seuil ; Hamm se couvre le visage de son mouchoir.

## À retenir
Créée en **1957**, c’est la pièce la plus dépouillée de Beckett, après *En attendant Godot*. Le titre vient des **échecs** : la fin de partie est le moment où l’issue est connue mais où il faut continuer à jouer. Thèmes : la dépendance mutuelle (personne ne peut se passer de l’autre, personne ne le supporte), la fin du monde déjà advenue, le langage comme dernier rituel. Humour noir permanent.

> « Rien n’est plus drôle que le malheur, je te l’accorde. »`,
          },
          questions: [
            ['Quelle est la situation de Hamm ?', ['Aveugle et paralysé dans un fauteuil à roulettes', 'Sourd et muet', 'Enfermé dans une poubelle', 'Debout, immobile'], 0, 'Clov, lui, ne peut ni s’asseoir ni partir.'],
            ['Où vivent Nagg et Nell ?', ['Dans deux poubelles', 'Dans la pièce voisine', 'Au grenier', 'Dehors'], 0, 'Ils se souviennent d’un jour heureux au lac de Côme.'],
            ['Que voit Clov par la fenêtre ?', ['Rien : « zéro »', 'La mer agitée', 'Une ville en ruine', 'Un jardin'], 0, 'La fin du monde semble déjà advenue.'],
            ['D’où vient le titre de la pièce ?', ['Des échecs : le moment où l’issue est connue mais où il faut jouer', 'Du théâtre antique', 'D’un jeu de cartes', 'D’une expression militaire'], 0, 'Beckett était un joueur d’échecs passionné.'],
            ['Comment la pièce se termine-t-elle ?', ['Clov reste sur le seuil, Hamm se couvre le visage', 'Clov part définitivement', 'Hamm meurt', 'Les parents sortent des poubelles'], 0, 'Le départ annoncé n’a pas lieu : c’est la structure même de Beckett.'],
            ['La pièce est dépourvue d’humour.', ['Vrai', 'Faux'], 1, 'L’humour noir y est constant : « Rien n’est plus drôle que le malheur. »'],
          ],
        },
        {
          titre: 'Gargantua, François Rabelais',
          lecon: {
            titre: 'Rabelais, 1534 — rire et savoir',
            cours: `## Le récit
Publié sous le pseudonyme d’**Alcofribas Nasier**. Le prologue compare le livre aux **Silènes** et invite le lecteur à briser l’os pour en tirer la « **substantifique moelle** » — tout en se moquant de ceux qui cherchent trop loin.
**Gargantua** naît par l’**oreille** de Gargamelle après un repas de tripes, et crie « À boire ! ». Il reçoit d’abord l’éducation scolastique de **Thubal Holoferne** (mémoire, latin, années perdues), puis celle de l’humaniste **Ponocrates** : journée réglée, exercice physique, lectures commentées, observation directe. Une querelle de marchands de fouaces déclenche la **guerre picrocholine** : **Picrochole** se rêve empereur du monde, **Grandgousier** plaide la paix, **Frère Jean des Entommeures** défend l’abbaye à coups de bâton de croix. Récompense : l’**abbaye de Thélème**, anti-monastère mixte sans horloge, avec une seule règle — « **Fais ce que voudras** ».

## À retenir
Gigantisme, listes vertigineuses, obscénité, latin de cuisine : le rire est une **méthode** qui désacralise la scolastique, la guerre de conquête et la religion formaliste. Thélème est une utopie **élitiste** : la liberté y suppose des gens « bien nés, bien instruits ».

> « Science sans conscience n’est que ruine de l’âme. » (Pantagruel)`,
          },
          questions: [
            ['Sous quel pseudonyme Rabelais publie-t-il ?', ['Alcofribas Nasier', 'Maître Janotus', 'Ponocrates', 'Grandgousier'], 0, 'Une anagramme de François Rabelais.'],
            ['Que signifie la « substantifique moelle » ?', ['Le sens profond caché sous l’apparence comique', 'La recette d’un plat', 'La morale finale du livre', 'Le résumé du prologue'], 0, 'Le prologue invite à briser l’os — en se moquant de ceux qui cherchent trop loin.'],
            ['Quel précepteur réforme l’éducation de Gargantua ?', ['Ponocrates', 'Thubal Holoferne', 'Janotus de Bragmardo', 'Jobelin Bridé'], 0, 'Journée réglée, corps entretenu, lectures commentées.'],
            ['Quelle est l’origine de la guerre picrocholine ?', ['Une querelle de marchands de fouaces', 'Un vol de terres', 'Une insulte au roi', 'Un mariage rompu'], 0, 'L’absurdité de la cause dénonce l’absurdité de la guerre.'],
            ['Quelle est la règle de l’abbaye de Thélème ?', ['« Fais ce que voudras »', '« Prie et travaille »', '« Silence et jeûne »', '« Obéis à ton abbé »'], 0, 'Un anti-monastère mixte, sans horloge ni contrainte.'],
            ['Le rire est chez Rabelais un simple divertissement.', ['Vrai', 'Faux'], 1, 'C’est une méthode critique : on ne discute pas une autorité dont on rit.'],
          ],
        },
        {
          titre: 'Germinal, Émile Zola',
          lecon: {
            titre: 'Zola, 1885 — la grève, la mine, la colère',
            cours: `## L’histoire
**Étienne Lantier**, machineur au chômage, arrive au **Voreux**, fosse du nord de la France, et se fait embaucher. Il découvre la vie des mineurs : la famille **Maheu**, la faim, la maladie, le travail des enfants, les rapports au fond, l’usure des corps. Il lit, s’instruit, gagne en influence et pousse à la **grève**. Elle dure des semaines : la faim gagne, la répression suit, la troupe tire sur la foule, le boutiquier Maigrat est mutilé par les femmes. L’anarchiste russe **Souvarine** sabote le puits ; l’eau envahit la mine et engloutit les mineurs. **Catherine** meurt au fond dans les bras d’Étienne, tandis que **Chaval** est tué. Étienne, seul survivant, quitte le pays au printemps.

## À retenir
Treizième volume des *Rougon-Macquart*, le plus célèbre. Roman du **travail** et du **collectif** : la foule y est un personnage. Zola s’est documenté sur place, à Anzin. Le titre — mois du calendrier révolutionnaire — annonce une germination : la révolte à venir. Dernière page fameuse sur les « hommes noirs » poussant sous les champs.

> « Des hommes poussaient, une armée noire, vengeresse, qui germait lentement dans les sillons. »`,
          },
          questions: [
            ['Où se déroule le roman ?', ['Dans une mine du nord de la France, le Voreux', 'Dans une usine parisienne', 'Dans un port normand', 'Dans une ferme du Beauce'], 0, 'Zola s’était documenté sur place, à Anzin.'],
            ['Qui est Étienne Lantier ?', ['Un machineur au chômage devenu mineur puis meneur de la grève', 'Le directeur de la mine', 'Un journaliste parisien', 'Le fils Maheu'], 0, 'Il s’instruit par la lecture et gagne en influence.'],
            ['Que provoque le sabotage de Souvarine ?', ['L’inondation de la mine', 'Un incendie', 'L’arrêt de la grève', 'L’arrestation d’Étienne'], 0, 'L’anarchiste russe agit seul, contre tous.'],
            ['Que devient Catherine ?', ['Elle meurt au fond, dans les bras d’Étienne', 'Elle épouse Chaval', 'Elle quitte la mine', 'Elle survit et part avec Étienne'], 0, 'Chaval, lui, est tué au fond.'],
            ['Que signifie le titre du roman ?', ['Un mois du calendrier révolutionnaire, qui annonce une germination', 'Le nom de la fosse', 'Le nom du village', 'Un terme de géologie'], 0, 'La révolte à venir germe sous les champs.'],
            ['La foule est traitée comme un simple décor.', ['Vrai', 'Faux'], 1, 'Elle est un personnage à part entière : c’est l’une des grandes réussites du roman.'],
          ],
        },
        {
          titre: 'Germinie Lacerteux, Edmond et Jules de Goncourt',
          lecon: {
            titre: 'Les Goncourt, 1865 — le peuple entre au roman',
            cours: `## L’histoire
**Germinie**, servante dévouée d’une vieille demoiselle, mademoiselle de Varandeuil, mène une double vie que sa maîtresse ignore : violée à quatorze ans, elle a perdu un enfant, s’attache à **Jupillon**, jeune homme veule qui la ruine, sombre dans l’alcool, la dette et les rencontres nocturnes. Elle meurt à l’hôpital ; sa maîtresse, en apprenant tout après coup, découvre qu’elle a vécu vingt ans à côté d’une inconnue.

## À retenir
Roman fondateur du **naturalisme** avant la lettre : la préface, célèbre, revendique le droit du roman à décrire « **les basses classes** » et à être une « **clinique de l’Amour** ». Les Goncourt s’appuient sur un cas réel — leur propre bonne, Rose Malingre, dont ils avaient découvert la double vie à sa mort. Écriture nerveuse, notations sensorielles, « écriture artiste » qui influencera Zola.

> La préface annonce que le roman moderne se fait « par le document humain ».`,
          },
          questions: [
            ['Qui est Germinie Lacerteux ?', ['Une servante dont la maîtresse ignore la double vie', 'Une ouvrière d’usine', 'Une bourgeoise déclassée', 'Une actrice'], 0, 'Alcool, dettes et rencontres nocturnes, derrière un dévouement irréprochable.'],
            ['Sur quel fait le roman s’appuie-t-il ?', ['La double vie de leur propre bonne, découverte à sa mort', 'Un fait divers judiciaire', 'Un rapport de police', 'Une légende populaire'], 0, 'Le « document humain » est la méthode revendiquée.'],
            ['Que revendique la préface du roman ?', ['Le droit du roman à décrire les basses classes', 'Le retour au roman historique', 'La primauté du style sur le sujet', 'La fin du roman'], 0, 'Elle qualifie le livre de « clinique de l’Amour ».'],
            ['Quel mouvement le roman annonce-t-il ?', ['Le naturalisme', 'Le romantisme', 'Le symbolisme', 'Le surréalisme'], 0, 'Zola s’en réclamera explicitement.'],
            ['Comment Germinie meurt-elle ?', ['À l’hôpital, épuisée et ruinée', 'Assassinée', 'De vieillesse chez sa maîtresse', 'Noyée'], 0, 'Sa maîtresse découvre la vérité seulement après sa mort.'],
            ['Le style des Goncourt est neutre et dépouillé.', ['Vrai', 'Faux'], 1, 'Leur « écriture artiste » est nerveuse et très sensorielle.'],
          ],
        },
        {
          titre: 'Gil Blas de Santillane, Alain-René Lesage',
          lecon: {
            titre: 'Lesage, 1715-1735 — la France sous un décor espagnol',
            cours: `## L’histoire
Publié en quatre parties de **1715 à 1735**. **Gil Blas**, fils d’un écuyer et d’une femme de chambre, quitte Oviedo pour étudier à Salamanque : il est aussitôt volé, embrigadé de force par des brigands, puis lancé dans une carrière de **valet** au service d’une vingtaine de maîtres — médecin ignorant (le docteur Sangrado, qui saigne tous ses patients), archevêque vaniteux, comédiens, seigneurs. Il devient secrétaire du **duc de Lerme**, premier ministre, connaît la faveur, la prison, la disgrâce, puis se retire dans un château avec une petite fortune honnêtement acquise.

## À retenir
Le grand **roman picaresque** français : héros de basse condition, récit à la première personne, succession d’épisodes et de maîtres, satire des professions. L’Espagne est un décor transparent : c’est la France de la Régence que Lesage peint. Le personnage n’est ni bon ni méchant, il **s’adapte** — ce qui en fait un observateur idéal des mœurs.

> Lesage est aussi l’auteur de la comédie *Turcaret*, satire des financiers.`,
          },
          questions: [
            ['À quel genre romanesque Gil Blas appartient-il ?', ['Le roman picaresque', 'Le roman épistolaire', 'Le roman historique', 'Le roman d’analyse'], 0, 'Héros de basse condition, récit à la première personne, épisodes successifs.'],
            ['Quelle est la fonction principale de Gil Blas dans le roman ?', ['Valet successif d’une vingtaine de maîtres', 'Officier de marine', 'Marchand ambulant', 'Prêtre'], 0, 'Chaque maître permet la satire d’une profession.'],
            ['Qui est le docteur Sangrado ?', ['Un médecin ignorant qui saigne tous ses patients', 'Un maître d’armes', 'Un juge corrompu', 'Un banquier'], 0, 'La satire de la médecine est un morceau célèbre.'],
            ['Quel pays sert de décor au roman ?', ['L’Espagne, décor transparent pour peindre la France', 'L’Italie', 'Le Portugal', 'La France directement'], 0, 'C’est la France de la Régence qui est visée.'],
            ['Comment le roman se termine-t-il ?', ['Gil Blas se retire avec une fortune honnêtement acquise', 'Il meurt en prison', 'Il devient premier ministre', 'Il repart sur les routes'], 0, 'Après la faveur, la prison et la disgrâce.'],
            ['Gil Blas est un héros vertueux et constant.', ['Vrai', 'Faux'], 1, 'Il s’adapte, ce qui fait de lui un observateur idéal des mœurs.'],
          ],
        },
        {
          titre: 'Harry Potter et le prisonnier d’Azkaban, J. K. Rowling',
          lecon: {
            titre: 'Rowling, 1999 — le tournant de la série',
            cours: `## L’histoire
Troisième tome. **Sirius Black**, évadé de la prison d’**Azkaban**, est présenté comme le traître qui a livré les parents de Harry à Voldemort. Poudlard est gardé par les **Détraqueurs**, créatures qui aspirent les souvenirs heureux ; Harry apprend, avec le professeur **Lupin**, le sortilège du **Patronus**. Ron, Hermione et lui découvrent que le vrai traître est **Peter Pettigrow**, caché depuis douze ans sous la forme du rat Croûtard, et que Sirius est innocent — c’est le **parrain** de Harry. Grâce au **Retourneur de Temps** d’Hermione, ils sauvent Sirius et l’hippogriffe Buck.

## À retenir
Le tome où la série change de nature : plus de manichéisme simple, un innocent condamné, un adulte lâche, une justice défaillante. Les **Détraqueurs** sont une image très juste de la dépression, ce que Rowling a confirmé. Structure de récit policier avec fausse piste, et premier usage du **voyage dans le temps** dans la série.

> Le Patronus de Harry prend la forme d’un cerf, comme son père.`,
          },
          questions: [
            ['Qui est Sirius Black ?', ['Le parrain de Harry, injustement accusé', 'Le meurtrier des parents de Harry', 'Un professeur de Poudlard', 'Un Détraqueur'], 0, 'Le vrai traître est Peter Pettigrow.'],
            ['Que sont les Détraqueurs ?', ['Des créatures qui aspirent les souvenirs heureux', 'Des gardiens fantômes du château', 'Des créatures de Voldemort ressuscitées', 'Des professeurs déguisés'], 0, 'Rowling a confirmé qu’ils figurent la dépression.'],
            ['Quel sortilège Lupin enseigne-t-il à Harry ?', ['Le Patronus', 'L’Expelliarmus', 'Le Lumos', 'L’Impero'], 0, 'Celui de Harry prend la forme d’un cerf, comme son père.'],
            ['Sous quelle forme Peter Pettigrow se cachait-il ?', ['Le rat Croûtard', 'Un chien noir', 'Un hibou', 'Un chat'], 0, 'Depuis douze ans, dans la famille Weasley.'],
            ['Quel objet permet de sauver Sirius et Buck ?', ['Le Retourneur de Temps', 'La cape d’invisibilité', 'La carte du Maraudeur', 'Le Choixpeau'], 0, 'Premier usage du voyage dans le temps dans la série.'],
            ['Ce tome conserve un partage simple entre bons et méchants.', ['Vrai', 'Faux'], 1, 'Innocent condamné, adulte lâche, justice défaillante : la série change de nature.'],
          ],
        },
        {
          titre: 'Hernani, Victor Hugo',
          lecon: {
            titre: 'Hugo, 1830 — la bataille du drame romantique',
            cours: `## L’histoire
En Espagne, en 1519. **Doña Sol** est aimée de trois hommes : le vieux **don Ruy Gomez**, son oncle et fiancé ; le roi **don Carlos**, futur Charles Quint ; et **Hernani**, proscrit et bandit, fils d’un noble tué par le père du roi. Enlèvements, cachettes, serments. Devenu empereur, Carlos pardonne et permet le mariage. Mais Hernani avait juré à don Ruy Gomez de mourir quand celui-ci sonnerait du **cor**. Le soir des noces, le cor retentit : Hernani et Doña Sol s’empoisonnent, don Ruy Gomez se tue.

## À retenir
La création, le **25 février 1830**, provoque la « **bataille d’Hernani** » entre classiques et romantiques : sifflets, cris, bagarres, avec Théophile Gautier en gilet rouge. La pièce applique la **préface de Cromwell** : mélange des genres et des registres, rejet des unités, alexandrin disloqué dès les premiers vers (« Serait-ce déjà lui ? C’est bien à l’escalier / Dérobé »), personnages nobles et bandits sur la même scène. C’est la victoire du **drame romantique**.

> « Je suis une force qui va. »`,
          },
          questions: [
            ['Que s’est-il passé à la création de la pièce, en 1830 ?', ['La « bataille d’Hernani » entre classiques et romantiques', 'Un triomphe unanime', 'Une interdiction royale', 'Un incendie du théâtre'], 0, 'Sifflets, cris et bagarres — Gautier y portait un gilet rouge.'],
            ['Qui aime Doña Sol ?', ['Hernani, don Carlos et don Ruy Gomez', 'Hernani seulement', 'Le roi seulement', 'Personne'], 0, 'Trois rivaux : un proscrit, un roi, un vieillard.'],
            ['Quel serment lie Hernani à don Ruy Gomez ?', ['Mourir quand celui-ci sonnera du cor', 'Lui céder Doña Sol', 'Le servir dix ans', 'Quitter l’Espagne'], 0, 'Le cor retentit le soir des noces.'],
            ['Quelle règle classique la pièce rejette-t-elle ?', ['Les unités de temps et de lieu', 'L’usage du vers', 'La division en actes', 'La présence d’un dénouement'], 0, 'Elle applique la préface de Cromwell.'],
            ['Comment la pièce se termine-t-elle ?', ['Par la mort des trois personnages principaux', 'Par le mariage heureux', 'Par le pardon du roi', 'Par la fuite d’Hernani'], 0, 'Le serment l’emporte sur le pardon impérial.'],
            ['L’alexandrin y est respecté de façon classique.', ['Vrai', 'Faux'], 1, 'Il est disloqué dès les premiers vers par les enjambements : c’est une provocation.'],
          ],
        },
        {
          titre: 'Hippolyte, Euripide',
          lecon: {
            titre: 'Euripide, 428 av. J.-C. — la source antique de Phèdre',
            cours: `## L’histoire
**Aphrodite**, déesse de l’amour, se venge d’**Hippolyte**, fils de Thésée, qui la méprise et ne sert que la chaste **Artémis** : elle inspire à **Phèdre**, épouse de Thésée, une passion pour son beau-fils. Phèdre lutte, se laisse mourir de faim, mais sa **nourrice** arrache son secret et le révèle à Hippolyte, qui la repousse avec horreur. Phèdre se pend en laissant une tablette qui accuse faussement Hippolyte de l’avoir violée. Thésée maudit son fils et obtient de **Poséidon** sa mort : un taureau surgi de la mer épouvante les chevaux et Hippolyte est traîné, brisé. Artémis apparaît et révèle la vérité ; le père et le fils se réconcilient avant qu’il n’expire.

## À retenir
La pièce d’Euripide encadre l’action par les **dieux** : ce sont eux qui l’ouvrent et la ferment. Chez Racine (1677), Phèdre est vivante quand la vérité éclate, et c’est elle qui l’avoue — l’accent se déplace de la vengeance divine vers la **conscience coupable**. Comparer les deux versions est un exercice classique.

> « Ma langue a juré, mais mon cœur n’a pas juré. »`,
          },
          questions: [
            ['Quelle déesse déclenche l’action ?', ['Aphrodite, qui se venge du mépris d’Hippolyte', 'Artémis', 'Héra', 'Athéna'], 0, 'Elle inspire à Phèdre une passion qu’elle n’a pas choisie.'],
            ['Qui révèle le secret de Phèdre à Hippolyte ?', ['Sa nourrice', 'Thésée', 'Le chœur', 'Artémis'], 0, 'Phèdre voulait mourir sans que rien ne se sache.'],
            ['Comment Phèdre accuse-t-elle Hippolyte ?', ['Par une tablette laissée avant son suicide', 'En parlant à Thésée', 'Par un témoin', 'Elle ne l’accuse pas'], 0, 'Chez Euripide, elle est morte quand l’accusation éclate.'],
            ['Comment Hippolyte meurt-il ?', ['Traîné par ses chevaux épouvantés par un taureau marin', 'Poignardé par Thésée', 'Empoisonné', 'Noyé'], 0, 'Poséidon exauce la malédiction de Thésée.'],
            ['Quelle différence majeure avec la Phèdre de Racine ?', ['Chez Racine, Phèdre est vivante et avoue elle-même la vérité', 'Chez Racine, Hippolyte survit', 'Chez Racine, il n’y a pas de dieux mentionnés', 'Chez Racine, Thésée est mort'], 0, 'L’accent se déplace de la vengeance divine vers la conscience coupable.'],
            ['La pièce d’Euripide est encadrée par des apparitions divines.', ['Vrai', 'Faux'], 0, 'Aphrodite l’ouvre, Artémis la ferme : les dieux tiennent l’action.'],
          ],
        },
        {
          titre: 'Histoire de Tom Jones, enfant trouvé, Henry Fielding',
          lecon: {
            titre: 'Fielding, 1749 — le grand roman comique anglais',
            cours: `## L’histoire
**Tom Jones**, enfant trouvé recueilli par le généreux **squire Allworthy**, grandit auprès de **Blifil**, neveu hypocrite du maître, et aime **Sophia Western**, fille du squire voisin. Calomnié par Blifil, chassé de la maison, Tom prend la route de Londres : auberges, duels, rencontres, maîtresses, prison, et une longue série de méprises. Sophia s’enfuit pour ne pas épouser Blifil. Tout se dénoue par la révélation de la **naissance** de Tom : il est le fils de la sœur d’Allworthy. Réhabilité, il épouse Sophia.

## À retenir
Roman en dix-huit livres, chacun ouvert par un **chapitre-préface** où l’auteur discute avec le lecteur de l’art du roman : Fielding y théorise le « **poème épique comique en prose** ». Ironie constante, narrateur omniprésent, intrigue d’horlogerie, morale généreuse — la vertu n’est pas la pureté mais la bonté du cœur. Modèle majeur pour Stendhal, Dickens et le roman européen.

> Le narrateur se compare à un aubergiste qui sert à ses lecteurs le repas qu’il a préparé.`,
          },
          questions: [
            ['Qui est Tom Jones ?', ['Un enfant trouvé recueilli par le squire Allworthy', 'Un jeune noble de Londres', 'Un marin', 'Un pasteur de campagne'], 0, 'Sa naissance inconnue est le ressort de tout le roman.'],
            ['Qui calomnie Tom ?', ['Blifil, le neveu hypocrite d’Allworthy', 'Sophia', 'Le squire Western', 'Partridge'], 0, 'Il veut épouser Sophia et écarter son rival.'],
            ['Comment le dénouement s’opère-t-il ?', ['Par la révélation de la naissance de Tom', 'Par un héritage inattendu', 'Par la mort de Blifil', 'Par un duel'], 0, 'Il est le fils de la sœur d’Allworthy.'],
            ['Quelle particularité présente la structure du roman ?', ['Chaque livre s’ouvre par un chapitre où l’auteur discute de l’art du roman', 'Il n’a pas de chapitres', 'Il est écrit en lettres', 'Il alterne prose et vers'], 0, 'Fielding y théorise le « poème épique comique en prose ».'],
            ['Quelle morale le roman défend-il ?', ['La vertu est la bonté du cœur, non la pureté sans faute', 'La vertu exige la chasteté absolue', 'Seule la naissance fait l’homme', 'La réussite justifie tout'], 0, 'Tom fait des fautes et reste bon : c’est la thèse du livre.'],
            ['Le narrateur de Tom Jones s’efface derrière son récit.', ['Vrai', 'Faux'], 1, 'Il est omniprésent, ironique, et s’adresse constamment au lecteur.'],
          ],
        },
        {
          titre: 'Histoire du romantisme, Théophile Gautier',
          lecon: {
            titre: 'Gautier, 1874 — les mémoires d’un témoin',
            cours: `## L’œuvre
Publié après la mort de **Théophile Gautier** (1872), cet ensemble de souvenirs raconte de l’intérieur la **bataille romantique** des années 1830 : la première d’*Hernani*, où Gautier portait le fameux **gilet rouge** ; le « petit cénacle » ; les portraits de Hugo, Nerval, Pétrus Borel, Balzac ; les excentricités, les modes, les manifestes.

## À retenir
Ce n’est ni une histoire savante ni un essai théorique : c’est un **témoignage** de participant, écrit quarante ans après, avec nostalgie et humour. Gautier y montre le romantisme comme un mouvement de **jeunesse** — vêtements, cheveux longs, provocations —, autant qu’une révolution littéraire.
Gautier lui-même a évolué : après avoir été le romantique en gilet rouge, il défend dans *Émaux et Camées* et dans la préface de *Mademoiselle de Maupin* la doctrine de l’« **art pour l’art** », qui annonce le Parnasse.

> Le gilet rouge d’Hernani est devenu le symbole d’une génération.`,
          },
          questions: [
            ['Quel épisode fameux Gautier raconte-t-il de l’intérieur ?', ['La bataille d’Hernani, où il portait un gilet rouge', 'La Révolution de 1848', 'Le procès de Baudelaire', 'La Commune de Paris'], 0, 'Il en fut l’un des acteurs les plus visibles.'],
            ['Quelle est la nature de cet ouvrage ?', ['Un témoignage de participant, écrit quarante ans après', 'Une histoire littéraire savante', 'Un manifeste théorique', 'Un roman autobiographique'], 0, 'Il paraît après la mort de Gautier, en 1874.'],
            ['Comment Gautier présente-t-il le romantisme ?', ['Comme un mouvement de jeunesse autant qu’une révolution littéraire', 'Comme une école académique', 'Comme un mouvement religieux', 'Comme une mode passagère sans importance'], 0, 'Vêtements, cheveux longs, provocations en font partie.'],
            ['Quelle doctrine Gautier défend-il plus tard ?', ['L’art pour l’art', 'Le naturalisme', 'Le réalisme social', 'Le symbolisme'], 0, 'Elle annonce le Parnasse ; voir la préface de Mademoiselle de Maupin.'],
            ['Quels écrivains Gautier portraiture-t-il ?', ['Hugo, Nerval, Balzac, Pétrus Borel', 'Zola, Maupassant, Daudet', 'Racine et Corneille', 'Sartre et Camus'], 0, 'Ce sont ses compagnons du « petit cénacle ».'],
            ['L’ouvrage a été publié du vivant de Gautier.', ['Vrai', 'Faux'], 1, 'Il paraît deux ans après sa mort.'],
          ],
        },
        {
          titre: 'Horace, Pierre Corneille',
          lecon: {
            titre: 'Corneille, 1640 — l’État contre la famille',
            cours: `## L’histoire
Rome et Albe, deux cités alliées par des mariages, sont en guerre. Pour éviter un massacre, chaque camp désigne trois champions : les trois **Horaces** pour Rome, les trois **Curiaces** pour Albe. Or les familles sont unies : **Camille**, sœur des Horaces, est fiancée à **Curiace** ; **Sabine**, sœur des Curiaces, est l’épouse d’**Horace**. Deux Horaces meurent ; le troisième feint la fuite, sépare les Curiaces blessés et les tue l’un après l’autre. Rentré en vainqueur, il entend **Camille** maudire Rome dans une imprécation célèbre — il la tue. Jugé, il est sauvé par le roi **Tulle** au nom du service rendu à l’État.

## À retenir
Tragédie du **conflit entre devoir civique et sentiments**, poussé jusqu’à l’insoutenable. Corneille y oppose l’héroïsme de la volonté (Horace) et l’humanité déchirée (Curiace, qui accepte mais souffre). Le vieil **Horace**, le père, incarne la loi romaine absolue (« Qu’il mourût ! »). La pièce interroge le prix de la grandeur d’État.

> « Rome, l’unique objet de mon ressentiment ! »`,
          },
          questions: [
            ['Pourquoi le combat est-il déchirant pour les deux familles ?', ['Elles sont unies par des mariages et des fiançailles', 'Elles se haïssent depuis des siècles', 'Elles se disputent un héritage', 'Elles servent le même roi'], 0, 'Camille est fiancée à Curiace, Sabine est l’épouse d’Horace.'],
            ['Comment Horace vainc-t-il les trois Curiaces ?', ['Il feint de fuir pour les séparer, puis les tue l’un après l’autre', 'Il les affronte tous en même temps', 'Il gagne par ruse nocturne', 'Il ne les tue pas'], 0, 'La ruse est racontée par un témoin, non montrée.'],
            ['Que fait Horace au retour ?', ['Il tue sa sœur Camille, qui maudit Rome', 'Il pardonne à sa sœur', 'Il refuse les honneurs', 'Il quitte Rome'], 0, 'L’imprécation de Camille est l’un des morceaux les plus célèbres du théâtre.'],
            ['Quelle réplique célèbre le vieil Horace prononce-t-il ?', ['« Qu’il mourût ! »', '« Je suis maître de moi »', '« Ô rage, ô désespoir »', '« Rome n’est plus dans Rome »'], 0, 'Il aurait préféré la mort de son fils au déshonneur d’une fuite.'],
            ['Comment se termine le procès d’Horace ?', ['Le roi Tulle le sauve au nom du service rendu à l’État', 'Il est exécuté', 'Il est exilé', 'Il est acquitté par le peuple'], 0, 'La raison d’État l’emporte sur la justice ordinaire.'],
            ['Curiace refuse de combattre pour Albe.', ['Vrai', 'Faux'], 1, 'Il accepte, mais en souffrant : il incarne l’humanité déchirée face à Horace.'],
          ],
        },
        {
          titre: 'Huis clos, Jean-Paul Sartre',
          lecon: {
            titre: 'Sartre, 1944 — « l’enfer, c’est les autres »',
            cours: `## La pièce
Un acte unique. Trois morts entrent l’un après l’autre dans un salon **Second Empire** sans fenêtre, sans miroir, sans sommeil, sans bourreau : **Garcin**, journaliste pacifiste fusillé pour désertion ; **Inès**, employée des postes, lesbienne, qui a poussé sa maîtresse au suicide ; **Estelle**, mondaine qui a tué son enfant et provoqué le suicide de son amant. Ils comprennent vite : ils sont là pour se torturer mutuellement. Chacun a besoin du regard d’un autre qui le lui refuse : Garcin veut qu’Inès le croie courageux, Estelle veut Garcin, Inès veut Estelle. Le triangle est parfait et sans issue — la porte s’ouvre, et personne ne sort.

## À retenir
Créée en **1944**. Illustration théâtrale de l’**existentialisme** : l’homme est « ce qu’il fait de ce qu’on a fait de lui » ; il n’y a pas d’essence, seulement des actes. Garcin est lâche parce qu’il a fui, non par nature — mais il est mort, donc il ne peut plus rien changer. Le regard d’autrui me fige en objet : d’où la réplique la plus citée du théâtre français.

> « L’enfer, c’est les autres. »`,
          },
          questions: [
            ['Où se déroule la pièce ?', ['Dans un salon Second Empire sans fenêtre ni miroir', 'Dans une prison', 'Dans une chambre d’hôtel', 'Sur une plage'], 0, 'Ni sommeil, ni bourreau, ni sortie : le décor est l’enfer même.'],
            ['Qui sont les trois personnages ?', ['Garcin, Inès et Estelle', 'Garcin, Inès et le garçon d’étage', 'Trois soldats', 'Un couple et son enfant'], 0, 'Un déserteur, une employée des postes, une mondaine.'],
            ['Pourquoi n’y a-t-il pas besoin de bourreau ?', ['Chacun est le bourreau des deux autres', 'Le bourreau viendra plus tard', 'Ils sont innocents', 'Ils dorment sans cesse'], 0, 'Le triangle des désirs est sans issue.'],
            ['Que se passe-t-il quand la porte s’ouvre ?', ['Personne ne sort', 'Ils sortent tous', 'Garcin seul s’échappe', 'Le garçon les emmène'], 0, 'Ils sont liés par le besoin du regard des autres.'],
            ['Que signifie « l’enfer, c’est les autres » ?', ['Le regard d’autrui me fige en objet et me juge', 'Les autres sont mauvais par nature', 'La solitude est préférable', 'L’enfer est une invention sociale'], 0, 'C’est une thèse philosophique, pas une misanthropie.'],
            ['La pièce illustre la philosophie existentialiste.', ['Vrai', 'Faux'], 0, 'L’homme est ce qu’il fait de ce qu’on a fait de lui : il n’y a pas d’essence, seulement des actes.'],
          ],
        },
        {
          titre: 'Iliade, Homère',
          lecon: {
            titre: 'Homère, VIIIe siècle av. J.-C. — la colère d’Achille',
            cours: `## Le récit
Vingt-quatre chants en hexamètres. Le poème ne raconte pas toute la guerre de Troie, mais **cinquante et un jours** de la dixième année : la **colère d’Achille**. Agamemnon lui prend sa captive Briséis ; Achille se retire du combat. Les Troyens, menés par **Hector**, prennent l’avantage jusqu’aux navires. **Patrocle**, l’ami d’Achille, revêt ses armes et meurt tué par Hector. Fou de douleur, Achille revient, massacre, tue Hector et traîne son corps autour de la ville. Le poème s’achève au chant XXIV par la scène la plus bouleversante : le vieux roi **Priam** vient supplier Achille de lui rendre le corps de son fils, et les deux ennemis pleurent ensemble.

## À retenir
L’épopée fondatrice de la littérature occidentale. Ses procédés : **épithètes de nature** (Achille « aux pieds légers », Athéna « aux yeux pers »), **comparaisons développées**, catalogues, discours. Les **dieux** interviennent constamment, prenant parti. Le poème ne célèbre pas la guerre : il en montre le coût, avec une compassion égale pour les deux camps.

> « Chante, déesse, la colère d’Achille, fils de Pélée. »`,
          },
          questions: [
            ['Quel est le sujet annoncé du poème ?', ['La colère d’Achille', 'La chute de Troie', 'Le retour d’Ulysse', 'La fondation de Rome'], 0, 'Le poème couvre cinquante et un jours de la dixième année de guerre.'],
            ['Pourquoi Achille se retire-t-il du combat ?', ['Agamemnon lui a pris sa captive Briséis', 'Il est blessé', 'Les dieux le lui ordonnent', 'Il veut rentrer chez lui'], 0, 'L’affront à son honneur déclenche toute l’intrigue.'],
            ['Qu’est-ce qui fait revenir Achille au combat ?', ['La mort de Patrocle, tué par Hector', 'Les excuses d’Agamemnon', 'Un oracle', 'La menace des dieux'], 0, 'La colère change d’objet : elle vise désormais Hector.'],
            ['Sur quelle scène le poème se termine-t-il ?', ['Priam suppliant Achille de lui rendre le corps d’Hector', 'La prise de Troie', 'La mort d’Achille', 'Le départ des Grecs'], 0, 'Les deux ennemis y pleurent ensemble.'],
            ['Qu’est-ce qu’une épithète de nature ?', ['Une formule fixe accolée à un nom, comme Achille « aux pieds légers »', 'Une comparaison développée', 'Une invocation aux dieux', 'Un catalogue de guerriers'], 0, 'Ces formules facilitaient la récitation orale.'],
            ['Le poème glorifie la guerre sans en montrer le coût.', ['Vrai', 'Faux'], 1, 'La compassion y est égale pour les deux camps : le coût humain est constamment montré.'],
          ],
        },
        {
          titre: 'Illuminations, Arthur Rimbaud',
          lecon: {
            titre: 'Rimbaud, 1886 — la prose comme éblouissement',
            cours: `## Le recueil
Une quarantaine de **poèmes en prose** et quelques textes en vers libres, écrits vers 1873-1875 et publiés en **1886**, sans que Rimbaud — parti pour l’Afrique et le commerce — y ait pris part : c’est **Verlaine** qui les fait paraître. L’ordre du recueil n’est donc pas sûrement celui de l’auteur.

## Les textes
« Après le Déluge », « Enfance », « Villes », « Aube », « Matinée d’ivresse », « Barbare », « Départ », « Génie », « Solde ». Aucun récit, aucun sujet lyrique stable : des visions juxtaposées, des paysages impossibles (villes suspendues, ponts de cristal), des changements brusques de sujet et de temps.

## À retenir
C’est l’aboutissement du programme des **lettres du voyant** (1871) : « Je dis qu’il faut être **voyant**, se faire **voyant** », par « un long, immense et raisonné dérèglement de tous les sens ». Le poème ne décrit plus, il **produit** une réalité. Le vers libre y apparaît (« Marine », « Mouvement »), quinze ans avant sa généralisation. Après quoi Rimbaud, à vingt ans, cesse d’écrire.

> « J’ai seul la clef de cette parade sauvage. »`,
          },
          questions: [
            ['De quel type de textes le recueil est-il composé ?', ['De poèmes en prose et de quelques vers libres', 'De sonnets', 'De lettres', 'De récits de voyage'], 0, 'Le vers libre y apparaît quinze ans avant sa généralisation.'],
            ['Qui a fait publier le recueil ?', ['Verlaine, en 1886', 'Rimbaud lui-même', 'Mallarmé', 'La famille de Rimbaud'], 0, 'Rimbaud était alors en Afrique et ne s’en est pas occupé.'],
            ['Quel programme les Illuminations réalisent-elles ?', ['Celui des lettres du voyant : se faire voyant par le dérèglement des sens', 'Le programme parnassien', 'La doctrine de l’art pour l’art', 'Le naturalisme en poésie'], 0, 'Le poème ne décrit plus : il produit une réalité.'],
            ['Que peut-on dire de l’ordre des textes ?', ['Il n’est pas sûrement celui voulu par Rimbaud', 'Il est chronologique', 'Il suit un plan strict en quatre parties', 'Il a été fixé par l’auteur avant son départ'], 0, 'Le manuscrit a circulé sans instructions claires.'],
            ['Que fait Rimbaud après ces textes ?', ['Il cesse d’écrire, à vingt ans', 'Il publie encore dix recueils', 'Il devient critique littéraire', 'Il retourne à la poésie régulière'], 0, 'Le silence fait partie de la légende — et de l’œuvre.'],
            ['Les Illuminations racontent une histoire suivie.', ['Vrai', 'Faux'], 1, 'Ce sont des visions juxtaposées, sans récit ni sujet lyrique stable.'],
          ],
        },
        {
          titre: 'Iphigénie, Jean Racine',
          lecon: {
            titre: 'Racine, 1674 — le sacrifice d’une fille',
            cours: `## L’histoire
La flotte grecque est immobilisée à **Aulis** : les vents ne se lèveront que si **Agamemnon** sacrifie sa fille **Iphigénie**. Il la fait venir sous prétexte de la marier à **Achille**, puis tente de la renvoyer ; sa lettre est interceptée par **Ulysse**. Iphigénie arrive avec sa mère **Clytemnestre**. Quand la vérité éclate, Achille veut la sauver par les armes, Clytemnestre supplie, Iphigénie accepte de mourir par obéissance. **Ériphile**, princesse captive amoureuse d’Achille et jalouse, dénonce le projet de fuite. Au dernier moment, le devin Calchas révèle qu’Ériphile est elle-même une « Iphigénie » (fille d’Hélène et de Thésée) : c’est elle que les dieux réclament. Elle se tue sur l’autel, les vents se lèvent.

## À retenir
Racine évite la solution antique du **coup de théâtre divin** (chez Euripide, Artémis substitue une biche) en inventant **Ériphile** : la vraisemblance est sauve, et la victime devient une coupable. Tragédie de l’**autorité paternelle**, du chantage religieux et de la raison d’État.

> « Un père qui commande, une fille qui obéit. »`,
          },
          questions: [
            ['Pourquoi la flotte grecque est-elle immobilisée ?', ['Les dieux exigent le sacrifice d’Iphigénie pour rendre les vents', 'Une épidémie frappe l’armée', 'Une tempête a brisé les navires', 'Achille refuse de combattre'], 0, 'Le chantage religieux met en marche toute la pièce.'],
            ['Sous quel prétexte Iphigénie est-elle appelée à Aulis ?', ['Un mariage avec Achille', 'Une cérémonie religieuse', 'La maladie de son père', 'Un conseil de guerre'], 0, 'Agamemnon tente ensuite de la renvoyer, en vain.'],
            ['Qui est Ériphile ?', ['Une captive amoureuse d’Achille, qui dénonce la fuite', 'La sœur d’Iphigénie', 'Une prêtresse d’Artémis', 'La confidente de Clytemnestre'], 0, 'Racine l’invente pour éviter le miracle final d’Euripide.'],
            ['Comment la pièce se dénoue-t-elle ?', ['Ériphile se tue sur l’autel : c’est elle que les dieux voulaient', 'Iphigénie est sacrifiée', 'Achille enlève Iphigénie', 'Une biche est substituée par Artémis'], 0, 'La vraisemblance est sauve, et la victime devient coupable.'],
            ['Quelle attitude adopte Iphigénie face au sacrifice ?', ['Elle accepte de mourir par obéissance', 'Elle s’enfuit', 'Elle maudit son père', 'Elle demande à Achille de tuer Agamemnon'], 0, 'Son obéissance rend la cruauté paternelle plus visible encore.'],
            ['Racine reprend le dénouement d’Euripide à l’identique.', ['Vrai', 'Faux'], 1, 'Il remplace la substitution divine par le personnage inventé d’Ériphile.'],
          ],
        },
        {
          titre: 'Isabelle, André Gide',
          lecon: {
            titre: 'Gide, 1911 — le roman d’une illusion',
            cours: `## L’histoire
**Gérard Lacase**, jeune homme venu travailler dans un château normand délabré, **La Quartfourche**, pour y étudier un manuscrit, observe une maisonnée étrange : de vieux propriétaires, un abbé, un enfant infirme, **Casimir**, dont la mère absente s’appelle **Isabelle de Saint-Auréol**. Gérard découvre une lettre d’amour ancienne, cachée, et se met à rêver de cette femme qu’il n’a jamais vue. Quand Isabelle paraît enfin, la réalité détruit l’image : elle est égoïste, calculatrice, indifférente à son fils. Le domaine se vend, les arbres sont abattus.

## À retenir
Un **récit** bref, au sens gidien : narrateur unique, sujet limité, ironie discrète. Le sujet est le décalage entre l’**image rêvée** et la personne réelle — la littérature elle-même est ici accusée de fabriquer des attentes. Gide oppose ses « récits » (*L’Immoraliste*, *La Porte étroite*, *Isabelle*) à ses « soties » et à son unique « roman », *Les Faux-Monnayeurs*.

> Le romanesque naît d’un manque d’information, et meurt de sa correction.`,
          },
          questions: [
            ['Pourquoi Gérard vient-il à La Quartfourche ?', ['Pour étudier un manuscrit', 'Pour y passer des vacances', 'Pour y enseigner', 'Pour acheter le domaine'], 0, 'Il y découvre une maisonnée étrange et une lettre cachée.'],
            ['Qu’est-ce qui fait naître le rêve de Gérard ?', ['Une ancienne lettre d’amour trouvée par hasard', 'Un portrait dans le salon', 'Le récit de l’abbé', 'Une rencontre au village'], 0, 'Il aime une femme qu’il n’a jamais vue.'],
            ['Que se passe-t-il quand Isabelle paraît ?', ['La réalité détruit l’image rêvée', 'Elle épouse Gérard', 'Elle s’enfuit à nouveau', 'Elle reprend son fils'], 0, 'Elle est égoïste, calculatrice et indifférente à Casimir.'],
            ['Comment Gide classe-t-il ce livre ?', ['Parmi ses « récits »', 'Parmi ses « soties »', 'Parmi ses romans', 'Parmi ses essais'], 0, 'Il ne reconnaissait qu’un seul « roman » : Les Faux-Monnayeurs.'],
            ['Quel est le sujet profond du livre ?', ['Le décalage entre l’image rêvée et la personne réelle', 'La ruine de l’aristocratie', 'L’éducation d’un enfant infirme', 'La vie de province'], 0, 'La littérature y est accusée de fabriquer des attentes.'],
            ['Le récit se termine sur la restauration du domaine.', ['Vrai', 'Faux'], 1, 'Le domaine est vendu et les arbres abattus : tout le décor du rêve disparaît.'],
          ],
        },
        {
          titre: 'Ivanhoé, Walter Scott',
          lecon: {
            titre: 'Scott, 1819 — l’invention du roman historique',
            cours: `## L’histoire
Angleterre, fin du XIIe siècle. **Wilfred d’Ivanhoé**, chevalier saxon revenu de croisade, est déshérité par son père **Cedric** pour avoir suivi Richard Cœur de Lion et aimé **Rowena**. Le pays est déchiré entre **Saxons** vaincus et **Normands** conquérants ; le prince **Jean** complote pendant l’absence du roi. Tournoi d’Ashby, enlèvements, siège du château de Torquilstone, **Robin des Bois** en allié, et surtout **Rebecca**, jeune juive accusée de sorcellerie par le templier **Bois-Guilbert**, sauvée in extremis lors d’un duel judiciaire. Richard reparaît, l’ordre est rétabli, Ivanhoé épouse Rowena.

## À retenir
Le livre qui fixe le **roman historique** : une intrigue fictive nouée dans une époque documentée, avec personnages réels en arrière-plan, couleur locale, langue et costumes reconstitués. Modèle immense pour **Hugo** (*Notre-Dame de Paris*), Dumas, Balzac et Manzoni. Rebecca, personnage juif traité avec dignité et injustement sacrifié au dénouement, a fait couler beaucoup d’encre.

> Scott a appris au XIXe siècle à imaginer le passé comme un monde entier.`,
          },
          questions: [
            ['Quel conflit traverse le roman ?', ['L’opposition entre Saxons vaincus et Normands conquérants', 'La guerre de Cent Ans', 'La guerre des Deux-Roses', 'La conquête de l’Irlande'], 0, 'Le prince Jean complote pendant l’absence de Richard.'],
            ['Quel personnage légendaire apparaît comme allié ?', ['Robin des Bois', 'Merlin', 'Le roi Arthur', 'Guillaume Tell'], 0, 'Il aide lors du siège de Torquilstone.'],
            ['Qui est Rebecca ?', ['Une jeune juive accusée de sorcellerie', 'La sœur d’Ivanhoé', 'La fiancée du prince Jean', 'Une religieuse'], 0, 'Elle est sauvée lors d’un duel judiciaire, mais écartée du dénouement.'],
            ['Quel genre ce roman fixe-t-il ?', ['Le roman historique', 'Le roman gothique', 'Le roman épistolaire', 'Le roman policier'], 0, 'Intrigue fictive dans une époque documentée, avec personnages réels en arrière-plan.'],
            ['Quels écrivains français ont suivi ce modèle ?', ['Hugo, Dumas et Balzac', 'Racine et Corneille', 'Zola et Maupassant', 'Sartre et Camus'], 0, 'Notre-Dame de Paris en est l’héritier direct.'],
            ['Le roman se déroule au XVe siècle.', ['Vrai', 'Faux'], 1, 'Il se situe à la fin du XIIe siècle, au retour de la troisième croisade.'],
          ],
        },
        {
          titre: 'Jacques le fataliste, Denis Diderot',
          lecon: {
            titre: 'Diderot, 1796 — le roman qui se moque du roman',
            cours: `## L’œuvre
Écrit vers 1765-1780 et publié après la mort de Diderot, en **1796**. **Jacques** et son **maître** voyagent — on ne sait ni d’où ni vers où — et Jacques entreprend de raconter ses **amours**. Il n’y parviendra jamais : le récit est sans cesse interrompu par des incidents, des rencontres, d’autres histoires (celle de **Madame de La Pommeraye**, la plus célèbre), et par le **narrateur** lui-même, qui s’adresse au lecteur, se moque de ses attentes et lui propose plusieurs suites possibles.

## Le fatalisme
Jacques répète que tout est « écrit là-haut, sur le grand rouleau ». La question traverse le livre : sommes-nous libres ? Diderot ne tranche pas, il **montre** — Jacques agit comme s’il était libre tout en professant le contraire.

## À retenir
Un **anti-roman** qui démonte ses propres procédés, hérité de *Tristram Shandy* de Sterne, et qui annonce Queneau, Calvino et le Nouveau Roman. Dialogue permanent, oralité, digressions assumées : la liberté du lecteur est le vrai sujet.

> « Comment s’étaient-ils rencontrés ? Par hasard, comme tout le monde. »`,
          },
          questions: [
            ['Que tente de raconter Jacques tout au long du livre ?', ['L’histoire de ses amours', 'Sa carrière militaire', 'Le voyage de son maître', 'La vie de Madame de La Pommeraye'], 0, 'Il n’y parvient jamais : les interruptions sont le principe du livre.'],
            ['Qui interrompt le plus souvent le récit ?', ['Le narrateur lui-même, qui s’adresse au lecteur', 'Le maître', 'L’aubergiste', 'Un notaire'], 0, 'Il se moque des attentes du lecteur et propose plusieurs suites.'],
            ['Quelle formule résume le fatalisme de Jacques ?', ['« Tout est écrit là-haut, sur le grand rouleau »', '« Il faut cultiver notre jardin »', '« Tout est pour le mieux »', '« Le hasard n’existe pas »'], 0, 'Il agit pourtant comme s’il était libre.'],
            ['Quel roman anglais a inspiré Diderot ?', ['Tristram Shandy, de Sterne', 'Robinson Crusoé', 'Pamela', 'Gulliver'], 0, 'Même goût de la digression et de l’adresse au lecteur.'],
            ['Quand le livre a-t-il été publié ?', ['En 1796, après la mort de Diderot', 'En 1765', 'En 1749', 'En 1830'], 0, 'Il avait circulé sous forme manuscrite auparavant.'],
            ['Le livre respecte les conventions du roman de son temps.', ['Vrai', 'Faux'], 1, 'C’est un anti-roman : il démonte ses propres procédés et annonce le Nouveau Roman.'],
          ],
        },
        {
          titre: 'Jean de Florette, Marcel Pagnol',
          lecon: {
            titre: 'Pagnol, 1963 — la source bouchée',
            cours: `## L’histoire
Premier volume de *L’Eau des collines*. Dans un village provençal des années 1920, le **Papet** (César Soubeyran) et son neveu **Ugolin** veulent racheter le domaine des Romarins pour y cultiver des œillets. Ils bouchent en secret la **source** de la propriété. Le nouvel héritier arrive : **Jean Cadoret**, dit Jean de Florette, bossu, ancien percepteur, plein de livres et de projets agricoles, avec sa femme Aimée et sa fille **Manon**. Sans eau, il s’épuise à porter des seaux depuis une source lointaine, s’endette, refuse d’abandonner. Il meurt en creusant, tué par une charge de mine. Les Soubeyran rachètent le domaine et débouchent la source — Manon, cachée, les voit faire.

## À retenir
Roman écrit par Pagnol d’après son propre film *Manon des sources* (1952). Tragédie **paysanne** : la terre, l’eau, le silence du village complice. Le mal n’y est pas spectaculaire — deux hommes qui se taisent suffisent. La suite, *Manon des sources*, est le récit de la vengeance.

> Le crime est un secret partagé par tout un village.`,
          },
          questions: [
            ['Que font le Papet et Ugolin pour s’emparer du domaine ?', ['Ils bouchent secrètement la source', 'Ils incendient la ferme', 'Ils falsifient un testament', 'Ils achètent les dettes'], 0, 'Le crime est passif, ce qui le rend plus terrible.'],
            ['Qui est Jean de Florette ?', ['Un bossu ancien percepteur, venu cultiver le domaine hérité', 'Un fermier du village', 'Un notaire marseillais', 'Le fils du Papet'], 0, 'Il arrive avec sa femme Aimée et sa fille Manon.'],
            ['Comment Jean meurt-il ?', ['Tué par une charge de mine en creusant pour trouver l’eau', 'De maladie', 'Assassiné par Ugolin', 'Noyé'], 0, 'Il refusait d’abandonner malgré l’épuisement et les dettes.'],
            ['Qui voit les Soubeyran déboucher la source ?', ['Manon, cachée', 'Le curé', 'Aimée', 'Personne'], 0, 'C’est le point de départ de la vengeance du second volume.'],
            ['Quel rôle joue le village dans le drame ?', ['Il sait et se tait : le silence est complice', 'Il aide Jean à trouver l’eau', 'Il dénonce les Soubeyran', 'Il ignore tout jusqu’à la fin'], 0, 'La tragédie paysanne repose sur ce silence.'],
            ['Le roman a été écrit avant le film de Pagnol.', ['Vrai', 'Faux'], 1, 'Pagnol l’écrit en 1963 d’après son film Manon des sources de 1952.'],
          ],
        },
        {
          titre: 'Journal des faux-monnayeurs, André Gide',
          lecon: {
            titre: 'Gide, 1926 — le carnet de bord d’un roman',
            cours: `## L’œuvre
Publié en **1926**, un an après *Les Faux-Monnayeurs*, ce journal réunit les notes prises par Gide **pendant** l’écriture du roman : hésitations sur la construction, choix des personnages, doutes, réflexions sur ce qu’est un roman, comptes rendus de lectures.

## Ce qu’on y apprend
Gide veut « purger le roman de tous les éléments qui n’appartiennent pas spécifiquement au roman » : ni description gratuite, ni récit d’événements pour eux-mêmes. Il veut un livre où l’on voie l’auteur en train d’écrire — d’où le personnage d’**Édouard**, romancier qui tient un journal et prépare un roman intitulé *Les Faux-Monnayeurs*. La **mise en abyme** est donc préparée, discutée, justifiée dans ce carnet.

## À retenir
Le premier grand exemple français d’un livre publié comme **atelier** d’un autre livre — geste que reprendront quantité d’écrivains contemporains. À lire en regard des *Faux-Monnayeurs*, dont il éclaire toutes les décisions techniques.

> « Je voudrais que ce roman fût un carrefour de problèmes. »`,
          },
          questions: [
            ['Que contient le Journal des faux-monnayeurs ?', ['Les notes prises pendant l’écriture du roman', 'La suite du roman', 'Une autobiographie de Gide', 'Des critiques du roman par ses lecteurs'], 0, 'Hésitations, choix de construction, doutes.'],
            ['Quel personnage du roman tient lui aussi un journal ?', ['Édouard, romancier qui prépare Les Faux-Monnayeurs', 'Bernard', 'Olivier', 'Le comte de Passavant'], 0, 'C’est le cœur de la mise en abyme.'],
            ['Que veut « purger » Gide du roman ?', ['Tout ce qui n’appartient pas spécifiquement au roman', 'Les dialogues', 'La psychologie', 'Les personnages secondaires'], 0, 'Ni description gratuite, ni événement raconté pour lui-même.'],
            ['Quand ce journal a-t-il été publié ?', ['En 1926, un an après le roman', 'La même année que le roman', 'Après la mort de Gide', 'Avant le roman'], 0, 'Il éclaire toutes les décisions techniques du livre.'],
            ['Quel geste littéraire ce livre inaugure-t-il en France ?', ['Publier l’atelier d’un livre comme livre à part entière', 'La publication en feuilleton', 'L’écriture collective', 'Le roman épistolaire moderne'], 0, 'De nombreux écrivains contemporains l’ont repris.'],
            ['Le journal a été écrit après coup, une fois le roman terminé.', ['Vrai', 'Faux'], 1, 'Il est écrit pendant : c’est ce qui en fait un document sur le travail en cours.'],
          ],
        },
        {
          titre: 'Journal, André Gide',
          lecon: {
            titre: 'Gide, 1889-1949 — soixante ans d’écriture quotidienne',
            cours: `## L’œuvre
Gide tient son journal de sa vingtaine jusqu’à sa mort : environ **soixante ans**, publiés en deux volumes de la Pléiade — l’un des plus vastes journaux d’écrivain en langue française. Il y note ses lectures, ses voyages (Afrique du Nord, Congo, URSS), ses rencontres, ses doutes religieux, ses relations, ses états de santé, ses jugements souvent tranchants sur ses contemporains.

## Ce qu’on y trouve
La formation d’une œuvre et d’une pensée : le protestantisme et sa révolte contre lui, la découverte du désir, l’engagement anticolonial (*Voyage au Congo*, 1927, qui provoqua une enquête parlementaire), la rupture avec le communisme après le *Retour de l’URSS* (1936), les années d’Occupation.

## À retenir
Le journal d’écrivain est un **genre** : il donne à voir le travail, les hésitations, la vie ordinaire d’où sort l’œuvre. Celui de Gide est aussi un document sur un demi-siècle de vie littéraire — la NRF, Claudel, Valéry, Proust, Malraux, Sartre. Prix Nobel de littérature en **1947**.

> « Rien n’est plus difficile que d’être sincère avec soi-même. »`,
          },
          questions: [
            ['Sur combien de temps s’étend le Journal de Gide ?', ['Environ soixante ans', 'Dix ans', 'Vingt ans', 'Cinq ans'], 0, 'De sa vingtaine jusqu’à sa mort en 1951.'],
            ['Quel voyage a provoqué une enquête parlementaire ?', ['Le Voyage au Congo, en 1927', 'Le voyage en URSS', 'Le voyage en Algérie', 'Le voyage en Italie'], 0, 'Gide y dénonçait les abus des compagnies concessionnaires.'],
            ['Quelle rupture politique le Journal documente-t-il ?', ['Sa rupture avec le communisme après le Retour de l’URSS', 'Son ralliement à la monarchie', 'Sa rupture avec la NRF', 'Son engagement dans la Résistance armée'], 0, 'Le Retour de l’URSS (1936) fit scandale à gauche.'],
            ['Quel prix Gide a-t-il reçu en 1947 ?', ['Le prix Nobel de littérature', 'Le Goncourt', 'Le grand prix de l’Académie', 'Le prix Femina'], 0, 'Quatre ans avant sa mort.'],
            ['Quel intérêt présente un journal d’écrivain ?', ['Il montre le travail, les hésitations et la vie d’où sort l’œuvre', 'Il remplace l’œuvre', 'Il donne les clés définitives des romans', 'Il n’a qu’un intérêt biographique'], 0, 'C’est un genre littéraire à part entière.'],
            ['Le Journal de Gide ne parle que de littérature.', ['Vrai', 'Faux'], 1, 'Voyages, santé, politique, religion et vie quotidienne y tiennent une place immense.'],
          ],
        },
        {
          titre: 'Julie ou la Nouvelle Héloïse, Jean-Jacques Rousseau',
          lecon: {
            titre: 'Rousseau, 1761 — le plus grand succès du siècle',
            cours: `## L’histoire
Roman **épistolaire** en six parties. **Julie d’Étange**, noble, et **Saint-Preux**, son précepteur roturier, s’aiment. Le baron d’Étange refuse cette mésalliance ; les amants cèdent une fois à la passion, puis se séparent. Julie épouse par obéissance **M. de Wolmar**, athée serein et plus âgé, avec qui elle fonde à **Clarens**, au bord du lac Léman, une communauté rurale exemplaire : travail partagé, vertu, transparence. Saint-Preux, revenu de voyage, y est accueilli — Wolmar sait tout et fait le pari de la vertu. Julie meurt après avoir sauvé son fils de la noyade, en avouant dans une dernière lettre qu’elle n’avait jamais cessé d’aimer.

## À retenir
**Immense succès** : plus de soixante éditions en quarante ans, des lecteurs en larmes qui écrivaient à Rousseau. Le roman invente la **sensibilité** moderne : la nature (le Valais, le lac, les orages) accompagne les états d’âme, ce qui annonce le romantisme. Il est aussi une utopie sociale et morale — Clarens — et une réflexion sur le mariage, la vertu et la transparence des cœurs.

> « Il faut renoncer à l’amour ou à la vertu. »`,
          },
          questions: [
            ['Quelle est la forme du roman ?', ['Un roman épistolaire en six parties', 'Un roman-mémoires', 'Un conte philosophique', 'Un dialogue'], 0, 'Les lettres échangées portent toute la narration.'],
            ['Pourquoi Julie ne peut-elle épouser Saint-Preux ?', ['Il est roturier, son père refuse la mésalliance', 'Il est déjà marié', 'Il part à la guerre', 'Elle ne l’aime pas'], 0, 'Elle épousera M. de Wolmar par obéissance.'],
            ['Qu’est-ce que Clarens ?', ['Le domaine où Julie fonde une communauté rurale exemplaire', 'Le village natal de Saint-Preux', 'Un couvent suisse', 'Un port du Léman'], 0, 'Travail partagé, vertu et transparence : c’est une utopie.'],
            ['Comment Julie meurt-elle ?', ['Après avoir sauvé son fils de la noyade', 'De chagrin', 'En couches', 'Assassinée'], 0, 'Sa dernière lettre avoue qu’elle n’a jamais cessé d’aimer Saint-Preux.'],
            ['Quel mouvement le roman annonce-t-il ?', ['Le romantisme, par la sensibilité et le rôle de la nature', 'Le naturalisme', 'Le classicisme', 'Le surréalisme'], 0, 'Le paysage y accompagne et exprime les états d’âme.'],
            ['Le roman fut un échec commercial.', ['Vrai', 'Faux'], 1, 'Plus de soixante éditions en quarante ans : c’est le plus grand succès du siècle.'],
          ],
        },
        {
          titre: 'Juste la fin du monde, Jean-Luc Lagarce',
          lecon: {
            titre: 'Lagarce, 1990 — l’aveu qui n’aura pas lieu',
            cours: `## La pièce
**Louis**, trente-quatre ans, revient après **douze ans** d’absence annoncer à sa famille sa mort prochaine. Il le dit au public dès le **prologue**. Suivent deux parties séparées par un intermède, puis un épilogue. Autour de lui : **La Mère**, qui organise le dimanche comme si de rien n’était ; **Antoine**, le frère resté au pays, blessé et colérique ; **Suzanne**, la sœur, qui ne connaît son frère que par ses « petits mots » ; **Catherine**, la belle-sœur, qu’il n’avait jamais vue. On déjeune, on se dispute, on évoque le passé. Louis repart **sans avoir rien dit**.

## À retenir
Écrite en 1990 par un auteur atteint du sida, mort en 1995, la pièce est aujourd’hui l’une des plus jouées de France (adaptée au cinéma par Xavier Dolan en 2016). Sa langue est immédiatement reconnaissable : phrases reprises, corrigées, réajustées — « c’est ce que je voulais dire, ce n’est pas ce que je voulais dire ». On y parle sans arrêt **pour ne pas dire** l’essentiel.

> « Juste la fin du monde » : l’immense catastrophe intime, minimisée par un adverbe.`,
          },
          questions: [
            ['Pourquoi Louis revient-il ?', ['Pour annoncer sa mort prochaine', 'Pour un héritage', 'Pour un mariage', 'Pour se réconcilier avec Antoine'], 0, 'Le prologue l’annonce au public dès le début.'],
            ['Que fait Louis à la fin ?', ['Il repart sans avoir rien dit', 'Il annonce la nouvelle', 'Il reste vivre au pays', 'Il emmène Suzanne'], 0, 'L’épilogue évoque au conditionnel un cri jamais poussé.'],
            ['Quelle est la particularité de la langue de Lagarce ?', ['Les phrases se reprennent et se corrigent en direct', 'Elle est en alexandrins', 'Elle est très argotique', 'Elle imite le style juridique'], 0, 'La forme dit le sujet : on parle pour ne pas dire.'],
            ['Qui est Catherine ?', ['La belle-sœur, que Louis n’avait jamais rencontrée', 'La mère de Louis', 'Sa sœur', 'Son amie d’enfance'], 0, 'Sa politesse gênée souligne l’étrangeté de la situation.'],
            ['Qui a adapté la pièce au cinéma en 2016 ?', ['Xavier Dolan', 'François Ozon', 'Arnaud Desplechin', 'Patrice Chéreau'], 0, 'Le film a fait connaître la pièce à un très large public.'],
            ['La pièce comporte de nombreux rebondissements.', ['Vrai', 'Faux'], 1, 'Il ne s’y passe presque rien : l’aveu impossible tient lieu d’intrigue.'],
          ],
        },
        {
          titre: 'L’Adolescence clémentine, Clément Marot',
          lecon: {
            titre: 'Marot, 1532 — le premier recueil imprimé par son auteur',
            cours: `## L’œuvre
Publié en **1532**, ce recueil rassemble les poèmes de jeunesse de **Clément Marot** — d’où le titre : l’« adolescence » de Clément. C’est l’un des premiers cas où un poète français **compose lui-même** son recueil et en surveille l’impression, geste neuf à l’époque de l’imprimerie naissante.

## Le contenu
Épîtres (dont la célèbre **« Épître au roi pour avoir été dérobé »**, où Marot raconte avec humour le vol commis par son valet pour demander de l’argent à François Ier), ballades, rondeaux, chants royaux, élégies, épigrammes, complaintes et traductions.

## Le style marotique
Vers courts, souvent octosyllabes, ton **familier**, humour, légèreté, adresse directe au destinataire, et un art de la **pointe** finale. Marot est le poète de la transition : il hérite des formes médiévales (rondeau, ballade) que la Pléiade rejettera bientôt, mais il apporte une liberté de ton et un « je » vivant qui annoncent la poésie moderne. La Fontaine et Voltaire s’en réclameront.

> « Je perdis mon temps à faire des vers, et mon argent à les faire imprimer. »`,
          },
          questions: [
            ['Que signifie le titre du recueil ?', ['Les poèmes de jeunesse de Clément — son « adolescence »', 'Un éloge de la clémence royale', 'Un hommage au pape Clément', 'Une allégorie du printemps'], 0, 'Le jeu de mots sur son prénom est délibéré.'],
            ['Quelle est la nouveauté du recueil dans l’histoire du livre ?', ['Le poète compose lui-même son recueil et en surveille l’impression', 'Il est imprimé en couleurs', 'Il est publié anonymement', 'Il est écrit en latin'], 0, 'Geste neuf à l’époque de l’imprimerie naissante.'],
            ['De quoi parle l’« Épître au roi pour avoir été dérobé » ?', ['Du vol commis par son valet, prétexte à demander de l’argent', 'D’une bataille', 'D’un exil', 'D’un procès en hérésie'], 0, 'Marot y fait de l’humour une stratégie de requête.'],
            ['Quelles formes Marot pratique-t-il ?', ['Épîtres, ballades, rondeaux, épigrammes', 'Sonnets et odes uniquement', 'Tragédies', 'Romans en vers'], 0, 'Ce sont les formes médiévales que la Pléiade rejettera bientôt.'],
            ['Qu’appelle-t-on le style marotique ?', ['Un ton familier, léger, spirituel, avec une pointe finale', 'Un style grave et solennel', 'Une écriture obscure et savante', 'Un langage populaire sans art'], 0, 'La Fontaine et Voltaire s’en réclameront explicitement.'],
            ['Marot appartient déjà à la Pléiade.', ['Vrai', 'Faux'], 1, 'Il la précède : c’est un poète de la transition entre Moyen Âge et Renaissance.'],
          ],
        },
        {
          titre: 'L’Amant, Marguerite Duras',
          lecon: {
            titre: 'Duras, 1984 — l’image absolue qui n’a pas été prise',
            cours: `## L’histoire
Indochine française, vers 1930. Une jeune fille française de **quinze ans et demi**, pauvre, coiffée d’un feutre d’homme et chaussée de lamé, traverse le **Mékong** sur un bac. Un riche **Chinois** de Cholen, de douze ans son aîné, l’aborde. Commence une liaison qui durera un an et demi, dans une garçonnière de Cholen. Autour : la **mère**, ruinée par l’achat d’une concession incultivable et à demi folle, le **frère aîné** violent et voleur, le **petit frère** aimé qui mourra. La famille accepte l’argent du Chinois et l’humilie. La jeune fille repart pour la France ; des années plus tard, il lui téléphonera pour lui dire qu’il l’aime encore.

## À retenir
**Prix Goncourt 1984**, immense succès international. Récit **autobiographique** éclaté : pas de chronologie, alternance du « je » et du « elle », phrases courtes, répétitions, blancs. Le livre s’ouvre sur l’image d’une photographie **jamais prise** — la traversée du bac —, et c’est cette absence qui autorise la littérature. Duras reprendra la matière dans *L’Amant de la Chine du Nord* (1991).

> « Très vite dans ma vie il a été trop tard. »`,
          },
          questions: [
            ['Où se déroule le récit ?', ['En Indochine française, vers 1930', 'Au Vietnam des années 1960', 'En Chine continentale', 'À Paris'], 0, 'La traversée du Mékong sur un bac ouvre le livre.'],
            ['Quel âge a la narratrice au début de la liaison ?', ['Quinze ans et demi', 'Dix-huit ans', 'Vingt ans', 'Treize ans'], 0, 'L’amant chinois a douze ans de plus qu’elle.'],
            ['Quelle image ouvre le livre ?', ['Une photographie jamais prise, celle de la traversée du bac', 'Un portrait de famille', 'Une carte de l’Indochine', 'Une photo de mariage'], 0, 'C’est cette absence qui autorise le récit.'],
            ['Quel prix le livre a-t-il reçu ?', ['Le prix Goncourt 1984', 'Le Renaudot', 'Le prix Femina', 'Le Médicis'], 0, 'Il a connu un immense succès international.'],
            ['Comment la famille se comporte-t-elle face à la liaison ?', ['Elle accepte l’argent du Chinois tout en l’humiliant', 'Elle l’ignore complètement', 'Elle s’y oppose violemment', 'Elle encourage le mariage'], 0, 'La mère est ruinée, le frère aîné violent.'],
            ['Le récit suit une chronologie stricte.', ['Vrai', 'Faux'], 1, 'Il est éclaté : alternance du « je » et du « elle », répétitions, blancs.'],
          ],
        },
        {
          titre: 'L’Argent, Émile Zola',
          lecon: {
            titre: 'Zola, 1891 — la spéculation comme passion',
            cours: `## L’histoire
**Aristide Saccard**, déjà vu dans *La Curée*, ruiné, fonde la **Banque universelle** pour financer de grands travaux en Orient. Il lance une campagne de presse, gonfle artificiellement le cours de l’action, entraîne dans la spéculation aussi bien les grands financiers que les petits épargnants — la princesse d’Orviedo, le comptable Sigismond, les employés, les concierges. Face à lui, le banquier juif **Gundermann**, froid et méthodique, attend. Le cours s’effondre : ruine générale, suicides, procès. Saccard est condamné, mais reste indestructible — il repart ailleurs.

## À retenir
Dix-huitième volume des *Rougon-Macquart*, inspiré du krach de l’**Union générale** (1882). Zola y montre l’argent comme une **force ambivalente** : destructrice et pourtant fécondante — « L’argent, jusqu’à ce jour, était le fumier dans lequel poussait l’humanité de demain ». Le roman contient aussi un personnage de socialiste utopiste, Sigismond Busch, qui annonce un autre monde possible.

> La Bourse y est décrite comme un temple et un champ de bataille.`,
          },
          questions: [
            ['Qui est Aristide Saccard ?', ['Un spéculateur qui fonde la Banque universelle', 'Un banquier suisse', 'Un journaliste financier', 'Un industriel du textile'], 0, 'On l’a déjà rencontré dans La Curée.'],
            ['Quel événement réel a inspiré le roman ?', ['Le krach de l’Union générale, en 1882', 'La crise de 1929', 'Le scandale de Panama', 'La faillite du Crédit lyonnais'], 0, 'Zola s’est documenté avec précision sur les mécanismes boursiers.'],
            ['Qui est Gundermann ?', ['Le grand banquier rival, froid et méthodique', 'Le comptable de Saccard', 'Un journaliste', 'Un ministre'], 0, 'Il attend, et il gagne.'],
            ['Que provoque l’effondrement du cours ?', ['La ruine générale, des suicides et un procès', 'Une révolution', 'La faillite de l’État', 'Le départ de Saccard à l’étranger uniquement'], 0, 'Les petits épargnants sont les premières victimes.'],
            ['Quelle vision de l’argent Zola propose-t-il ?', ['Une force ambivalente, destructrice et fécondante', 'Un mal absolu', 'Un bien nécessaire', 'Un sujet indifférent'], 0, '« Le fumier dans lequel poussait l’humanité de demain. »'],
            ['Saccard est définitivement anéanti à la fin du roman.', ['Vrai', 'Faux'], 1, 'Condamné, il repart ailleurs : c’est une force que rien n’arrête.'],
          ],
        },
        {
          titre: 'L’Art poétique, Nicolas Boileau',
          lecon: {
            titre: 'Boileau, 1674 — le code du classicisme',
            cours: `## L’œuvre
Poème didactique en **quatre chants**, en alexandrins, publié en **1674**. Boileau y expose les règles de la bonne écriture, sur le modèle de l’*Art poétique* d’Horace.

## Les quatre chants
1. Les règles générales : clarté, travail, vraisemblance.
2. Les genres brefs : idylle, élégie, ode, sonnet, satire.
3. Les grands genres : tragédie, épopée, comédie — avec la **règle des trois unités** et la **bienséance**.
4. Conseils au poète : intégrité morale, patience, refus de la flatterie et de l’argent facile.

## Les préceptes à connaître
« Ce que l’on conçoit bien s’énonce clairement, et les mots pour le dire arrivent aisément. » « Hâtez-vous lentement, et sans perdre courage, vingt fois sur le métier remettez votre ouvrage. » « Le vrai peut quelquefois n’être pas vraisemblable » — d’où la primauté du vraisemblable sur le vrai.

## À retenir
Boileau ne crée pas le classicisme : il le **formule** au moment où Racine, Molière et La Fontaine l’ont déjà pratiqué. Longtemps tenu pour le législateur du Parnasse, il a été violemment rejeté par les romantiques — Hugo l’appelait « le pédant ». Il reste la meilleure porte d’entrée dans la doctrine classique.

> « Vingt fois sur le métier remettez votre ouvrage. »`,
          },
          questions: [
            ['Quelle forme prend L’Art poétique ?', ['Un poème didactique en quatre chants, en alexandrins', 'Un traité en prose', 'Un dialogue', 'Une préface de théâtre'], 0, 'Sur le modèle de l’Art poétique d’Horace.'],
            ['Quel précepte concerne la clarté ?', ['« Ce que l’on conçoit bien s’énonce clairement »', '« Le beau est toujours bizarre »', '« Il faut être absolument moderne »', '« Rien de trop »'], 0, 'La clarté est la vertu cardinale du classicisme.'],
            ['Quel conseil Boileau donne-t-il sur le travail ?', ['« Vingt fois sur le métier remettez votre ouvrage »', '« Écrivez d’un seul jet »', '« Suivez votre inspiration »', '« Imitez sans corriger »'], 0, 'L’inspiration ne dispense jamais du travail.'],
            ['Quelle règle du théâtre le chant III expose-t-il ?', ['La règle des trois unités', 'La règle du chœur', 'L’unité de registre', 'La division en cinq actes seulement'], 0, 'Avec la bienséance, elle organise la tragédie classique.'],
            ['Boileau invente-t-il le classicisme ?', ['Non, il le formule après que Racine et Molière l’ont pratiqué', 'Oui, il le crée entièrement', 'Non, il le combat', 'Oui, avant tous les autres'], 0, 'Il en est le codificateur, pas l’inventeur.'],
            ['Les romantiques ont admiré Boileau.', ['Vrai', 'Faux'], 1, 'Ils l’ont violemment rejeté : Hugo l’appelait « le pédant ».'],
          ],
        },
        {
          titre: 'L’Assommoir, Émile Zola',
          lecon: {
            titre: 'Zola, 1877 — la descente d’une blanchisseuse',
            cours: `## L’histoire
**Gervaise Macquart**, blanchisseuse boiteuse abandonnée par **Lantier**, épouse le zingueur **Coupeau**, travailleur et sobre. Ils s’élèvent : elle ouvre sa boutique, la fête de l’oie marque l’apogée. Puis Coupeau tombe d’un toit, ne se remet jamais au travail, se met à boire à l’**Assommoir**, le débit du père Colombe. Lantier revient et s’installe dans le ménage. Les dettes s’accumulent, la boutique est perdue, Gervaise glisse à son tour dans l’alcool et la faim. Coupeau meurt du delirium tremens à Sainte-Anne ; Gervaise meurt de misère sous un escalier. Sa fille **Nana** est déjà partie.

## À retenir
Septième volume des *Rougon-Macquart*, premier grand succès de Zola et scandale : on lui reproche de salir le peuple. Sa nouveauté est le **style indirect libre** généralisé et l’usage du **langage populaire** dans la narration elle-même, non seulement dans les dialogues. Thèse naturaliste : le milieu et l’hérédité écrasent l’individu — mais le roman est aussi un livre de compassion.

> « Voilà où ça mène, le travail quand on n’a plus de chance. »`,
          },
          questions: [
            ['Quel est le métier de Gervaise ?', ['Blanchisseuse', 'Couturière', 'Ouvrière en usine', 'Marchande des quatre-saisons'], 0, 'Elle ouvre sa propre boutique avant la chute.'],
            ['Qu’est-ce que l’Assommoir ?', ['Le débit de boisson du père Colombe', 'L’atelier de zinguerie', 'L’hôpital Sainte-Anne', 'L’immeuble de la Goutte-d’Or'], 0, 'Le titre désigne le lieu qui assomme le quartier.'],
            ['Quel événement déclenche la chute du ménage ?', ['La chute de Coupeau d’un toit', 'La faillite de la boutique', 'Le retour de Lantier', 'La naissance de Nana'], 0, 'Il ne reprend jamais le travail et se met à boire.'],
            ['Quelle est la grande nouveauté stylistique du roman ?', ['Le langage populaire passe dans la narration, pas seulement dans les dialogues', 'L’absence de descriptions', 'Le récit à la première personne', 'Le refus du discours indirect'], 0, 'Le style indirect libre y est généralisé.'],
            ['Comment Gervaise meurt-elle ?', ['De misère, sous un escalier', 'À l’hôpital', 'Assassinée par Coupeau', 'En couches'], 0, 'Coupeau meurt de delirium tremens à Sainte-Anne.'],
            ['Le roman fut aussitôt salué par la critique comme un hommage au peuple.', ['Vrai', 'Faux'], 1, 'On reprocha à Zola de salir le peuple : le livre fit scandale.'],
          ],
        },
        {
          titre: 'L’Avare, Molière',
          lecon: {
            titre: 'Molière, 1668 — « ma cassette ! »',
            cours: `## L’histoire
Comédie en **cinq actes et en prose**. **Harpagon**, veuf riche et avare, veut épouser la jeune **Mariane**, aimée de son fils **Cléante** ; il destine sa fille **Élise** au vieux Anselme parce qu’il la prend « sans dot », alors qu’elle aime **Valère**, entré au service de la maison comme intendant. Harpagon a enterré une **cassette** de dix mille écus dans son jardin ; il soupçonne tout le monde. **La Flèche**, valet de Cléante, la vole. Harpagon devient fou de douleur (« Au voleur ! au voleur ! … Rendez-moi mon argent »). Le dénouement, invraisemblable et assumé, révèle qu’Anselme est le père perdu de Valère et de Mariane : tout s’arrange, et Harpagon retrouve sa cassette — la seule chose qu’il voulait.

## À retenir
Comique de **caractère** (l’avarice comme passion totale, qui contamine la famille), de **répétition** (« sans dot »), de **mots** et de gestes. Molière s’inspire de *L’Aulularia* de **Plaute**. La pièce est plus noire qu’il n’y paraît : l’avarice y détruit tout lien familial, et le dénouement heureux n’efface rien.

> « Sans dot ! »`,
          },
          questions: [
            ['Que cache Harpagon dans son jardin ?', ['Une cassette de dix mille écus', 'Des titres de propriété', 'Des bijoux de sa femme', 'Un testament'], 0, 'Son vol déclenche la crise finale.'],
            ['Pourquoi Harpagon veut-il marier Élise au vieil Anselme ?', ['Parce qu’il la prend « sans dot »', 'Parce qu’Anselme est noble', 'Pour se venger de Valère', 'Parce qu’elle le demande'], 0, 'La répétition de « sans dot » est un ressort comique majeur.'],
            ['Qui vole la cassette ?', ['La Flèche, valet de Cléante', 'Valère', 'Maître Jacques', 'Anselme'], 0, 'Le vol met Harpagon hors de lui.'],
            ['De quelle pièce antique Molière s’inspire-t-il ?', ['L’Aulularia de Plaute', 'Les Guêpes d’Aristophane', 'Amphitryon de Térence', 'Les Bacchantes d’Euripide'], 0, 'La Marmite, en français.'],
            ['Comment le dénouement s’opère-t-il ?', ['Anselme se révèle être le père perdu de Valère et de Mariane', 'Harpagon renonce à son argent', 'Cléante s’enfuit avec Mariane', 'Élise entre au couvent'], 0, 'Invraisemblance assumée : Harpagon ne veut que sa cassette.'],
            ['La pièce est écrite en vers.', ['Vrai', 'Faux'], 1, 'Elle est en prose, ce qui fut reproché à Molière à sa création.'],
          ],
        },
        {
          titre: 'L’Écume des jours, Boris Vian',
          lecon: {
            titre: 'Vian, 1947 — le nénuphar dans le poumon',
            cours: `## L’histoire
**Colin**, jeune homme riche et oisif, vit dans un appartement où le soleil se plie à ses désirs, avec son cuisinier **Nicolas** et un **pianocktail** qui fabrique des cocktails d’après la musique jouée. Son ami **Chick** collectionne tout ce qui touche au philosophe **Jean-Sol Partre**, jusqu’à s’y ruiner et perdre **Alise**. Colin rencontre **Chloé**, l’épouse — et Chloé tombe malade : un **nénuphar** pousse dans son poumon. Pour payer les fleurs qui seules la soulagent, Colin doit travailler, découvre des métiers absurdes et cruels, s’épuise. L’appartement rétrécit, s’assombrit, se déforme à mesure. Chloé meurt ; la souris de la maison se fait tuer par le chat.

## À retenir
Le roman le plus célèbre de **Boris Vian**, longtemps ignoré puis adoré des lycéens à partir des années 1960. Univers de **fantaisie** verbale (jeux de mots, mots-valises, objets vivants) qui se dégrade en **cauchemar** : la forme même du livre se contracte avec la maladie. Satire du travail, de la religion, de la mode intellectuelle (Sartre), et grande histoire d’amour.

> « Il y a seulement deux choses : c’est l’amour, de toutes les façons, avec des jolies filles, et la musique de La Nouvelle-Orléans. »`,
          },
          questions: [
            ['De quoi Chloé tombe-t-elle malade ?', ['Un nénuphar pousse dans son poumon', 'D’une pneumonie ordinaire', 'D’un cancer', 'D’une allergie aux fleurs'], 0, 'Seules les fleurs autour d’elle la soulagent.'],
            ['Qu’est-ce que le pianocktail ?', ['Un piano qui fabrique des cocktails d’après la musique jouée', 'Un bar de jazz', 'Un instrument imaginaire de Chloé', 'Un jeu de société'], 0, 'Invention emblématique de la fantaisie de Vian.'],
            ['De quel philosophe Chick est-il le collectionneur obsessionnel ?', ['Jean-Sol Partre', 'Albert Camus', 'Simone de Beauvoir', 'Henri Bergson'], 0, 'Anagramme transparente de Jean-Paul Sartre.'],
            ['Que devient l’appartement au fil du roman ?', ['Il rétrécit et s’assombrit à mesure que Chloé décline', 'Il s’agrandit', 'Il est vendu', 'Il prend feu'], 0, 'Le décor épouse la maladie : la forme dit le fond.'],
            ['Que doit faire Colin pour payer les fleurs ?', ['Travailler, dans des métiers absurdes et cruels', 'Vendre le pianocktail seulement', 'Emprunter à Chick', 'Voler'], 0, 'La satire du travail est l’une des cibles du livre.'],
            ['Le roman fut un succès immédiat à sa parution.', ['Vrai', 'Faux'], 1, 'Il fut d’abord ignoré, et n’est devenu culte qu’à partir des années 1960.'],
          ],
        },
        {
          titre: 'L’Éducation sentimentale, Gustave Flaubert',
          lecon: {
            titre: 'Flaubert, 1869 — le roman d’une génération qui rate tout',
            cours: `## L’histoire
**Frédéric Moreau**, jeune provincial, aperçoit sur un bateau **Madame Arnoux** : coup de foudre qui durera toute sa vie sans jamais aboutir. À Paris, il fréquente le marchand d’art **Arnoux**, son ami **Deslauriers**, la courtisane **Rosanette**, la riche **Madame Dambreuse** ; il hérite, dépense, projette d’écrire, de peindre, de faire de la politique — et n’achève rien. La **révolution de 1848**, les journées de Juin, le coup d’État de 1851 traversent le roman sans qu’il s’y engage vraiment. À la fin, Madame Arnoux, vieillie, vient le voir ; il ne se passe rien. Dernier chapitre : les deux amis se remémorent une visite ratée au bordel dans leur jeunesse — « C’est là ce que nous avons eu de meilleur. »

## À retenir
Le grand roman de l’**échec** et de la **désillusion**, sous-titré « histoire d’un jeune homme ». Flaubert y refuse l’intrigue romanesque : les événements historiques et intimes se produisent sans produire d’effet. L’ironie est constante, la construction très travaillée (rimes de situations, ellipses fameuses — « Il voyagea »). Roman longtemps mal reçu, devenu central au XXe siècle.

> « Il voyagea. Il connut la mélancolie des paquebots… »`,
          },
          questions: [
            ['Qui Frédéric Moreau aime-t-il toute sa vie ?', ['Madame Arnoux', 'Rosanette', 'Madame Dambreuse', 'Louise Roque'], 0, 'Le coup de foudre initial ne débouche jamais sur rien.'],
            ['Quel événement historique traverse le roman ?', ['La révolution de 1848 et ses suites', 'La Commune de 1871', 'La Révolution de 1789', 'La guerre de 1870 seule'], 0, 'Frédéric la traverse sans jamais s’y engager vraiment.'],
            ['Que réalise Frédéric de ses nombreux projets ?', ['Rien : il n’achève ni livre, ni tableau, ni carrière', 'Un roman célèbre', 'Une carrière politique', 'Une collection d’art'], 0, 'C’est le roman de l’inachèvement.'],
            ['Sur quoi le roman se termine-t-il ?', ['Le souvenir d’une visite ratée au bordel, « ce que nous avons eu de meilleur »', 'La mort de Madame Arnoux', 'Le mariage de Frédéric', 'Un duel'], 0, 'La dérision est totale, et bouleversante.'],
            ['Quelle phrase célèbre marque une ellipse de plusieurs années ?', ['« Il voyagea »', '« Il attendit »', '« Le temps passa »', '« Rien n’arriva »'], 0, 'Deux mots pour effacer des années entières.'],
            ['Le roman fut un grand succès à sa parution.', ['Vrai', 'Faux'], 1, 'Il fut mal reçu en 1869, et n’est devenu central qu’au XXe siècle.'],
          ],
        },
        {
          titre: 'L’éloge de la folie, Érasme',
          lecon: {
            titre: 'Érasme, 1511 — la Folie fait son propre éloge',
            cours: `## L’œuvre
Écrit en **latin** en 1509, publié en **1511** et dédié à **Thomas More**, le texte est un **discours** prononcé par la **Folie** elle-même, qui monte en chaire et se loue devant un public.

## Le mouvement du texte
1. La Folie explique qu’elle est indispensable : sans illusion, ni amour, ni amitié, ni mariage, ni société ne tiendraient. L’ton est d’abord badin.
2. Puis elle passe en revue les états et les professions — grammairiens, juristes, médecins, philosophes, théologiens, moines, princes, évêques, papes — et le ton devient **satirique** et de plus en plus dur.
3. Enfin, retournement : la vraie folie est celle de la **foi**, celle de saint Paul et du Christ, folie aux yeux du monde et sagesse devant Dieu.

## À retenir
Chef-d’œuvre de l’**humanisme chrétien**. Érasme critique l’Église de l’intérieur, réclame le retour aux Évangiles et à leur simplicité — sans jamais rompre, contrairement à **Luther**, avec qui il polémiquera. L’**ironie** y est constante : la Folie dit des vérités que personne d’autre ne pourrait dire.

> On lui a reproché d’avoir « pondu l’œuf que Luther a couvé ».`,
          },
          questions: [
            ['Qui prononce le discours de L’Éloge de la folie ?', ['La Folie elle-même', 'Érasme en son nom', 'Thomas More', 'Un moine anonyme'], 0, 'Le procédé permet de tout dire sous le masque.'],
            ['À qui l’œuvre est-elle dédiée ?', ['À Thomas More', 'À Luther', 'Au pape Léon X', 'À Charles Quint'], 0, 'Le titre latin, Moriae encomium, joue sur son nom.'],
            ['Comment le ton évolue-t-il au fil du texte ?', ['Du badinage à la satire de plus en plus dure', 'De la colère à la douceur', 'Il reste badin du début à la fin', 'Il est uniformément savant'], 0, 'Grammairiens, théologiens, moines, princes et papes y passent.'],
            ['Quel retournement clôt l’ouvrage ?', ['La vraie folie est celle de la foi, sagesse devant Dieu', 'La Folie avoue avoir menti', 'La Raison prend la parole', 'Le texte s’interrompt sans conclusion'], 0, 'C’est la folie de saint Paul et du Christ.'],
            ['Quelle est la position d’Érasme envers l’Église ?', ['Il la critique de l’intérieur, sans rompre', 'Il la quitte pour la Réforme', 'Il la défend sans réserve', 'Il l’ignore'], 0, 'Il polémiquera d’ailleurs avec Luther.'],
            ['L’œuvre a été écrite en français.', ['Vrai', 'Faux'], 1, 'Elle est écrite en latin, langue commune des humanistes européens.'],
          ],
        },
        {
          titre: 'L’Étrange Cas du docteur Jekyll et de M. Hyde, Robert Louis Stevenson',
          lecon: {
            titre: 'Stevenson, 1886 — le double à l’intérieur',
            cours: `## L’histoire
À Londres, le notaire **Utterson** s’inquiète : son ami le docteur **Jekyll**, respectable et généreux, a fait un testament au profit d’un inconnu, **Edward Hyde**, petit homme repoussant aperçu piétinant une fillette, puis auteur du meurtre du député Carew. Utterson enquête. Après la mort de Jekyll, deux documents révèlent la vérité : Jekyll, cherchant à séparer chimiquement le bien et le mal en lui, a fabriqué une **potion** qui le transforme en Hyde. D’abord maître du passage, il finit par se transformer **involontairement**, et Hyde prend le dessus. À court d’ingrédient, Jekyll s’enferme et se suicide.

## À retenir
Récit bref, construit comme une **enquête** : le lecteur découvre les faits avant l’explication, par témoignages et lettres. Thème du **double** (comme le *Horla*, *Le Portrait de Dorian Gray*), et satire de l’**hypocrisie victorienne** : la respectabilité de façade exige une part cachée. Le mythe a dépassé le livre.

> « L’homme n’est pas véritablement un, mais véritablement deux. »`,
          },
          questions: [
            ['Qui mène l’enquête dans le récit ?', ['Le notaire Utterson', 'La police de Londres', 'Le docteur Lanyon seul', 'Jekyll lui-même'], 0, 'Le lecteur découvre les faits avant l’explication.'],
            ['Quel est le projet initial de Jekyll ?', ['Séparer chimiquement le bien et le mal en lui', 'Rajeunir', 'Guérir une maladie', 'Devenir invisible'], 0, 'La potion lui permet de devenir Hyde.'],
            ['Que se passe-t-il à mesure que le récit avance ?', ['Les transformations deviennent involontaires', 'Hyde disparaît', 'Jekyll retrouve la maîtrise', 'La potion cesse d’agir'], 0, 'Hyde prend progressivement le dessus.'],
            ['Comment le récit se termine-t-il ?', ['Jekyll s’enferme et se suicide', 'Hyde est arrêté', 'Jekyll guérit', 'Utterson découvre l’antidote'], 0, 'Il n’a plus l’ingrédient nécessaire à la transformation inverse.'],
            ['Que dénonce le récit dans la société victorienne ?', ['L’hypocrisie de la respectabilité de façade', 'La pauvreté des faubourgs', 'La corruption politique', 'Le poids de l’Église'], 0, 'La respectabilité exige une part cachée.'],
            ['Le récit dévoile l’explication dès les premières pages.', ['Vrai', 'Faux'], 1, 'Il est construit comme une enquête : la vérité arrive par documents, à la fin.'],
          ],
        },
        {
          titre: 'L’Étranger, Albert Camus',
          lecon: {
            titre: 'Camus, 1942 — « Aujourd’hui, maman est morte »',
            cours: `## L’histoire
**Meursault**, employé de bureau à Alger, apprend la mort de sa mère, l’enterre sans pleurer, retourne à la plage le lendemain, commence une liaison avec **Marie**, accepte d’aider son voisin **Raymond** dans une histoire louche. Sur une plage écrasée de soleil, il tue un **Arabe** de cinq balles. Deuxième partie : l’instruction et le procès. On ne lui reproche pas tant le meurtre que de **n’avoir pas pleuré à l’enterrement** de sa mère : il est jugé pour son indifférence. Condamné à mort, il refuse l’aumônier, explose de colère, puis trouve la paix dans l’acceptation : « Je m’ouvrais pour la première fois à la tendre indifférence du monde. »

## À retenir
Récit à la **première personne**, au **passé composé**, en phrases courtes et neutres — l’« écriture blanche » qu’analysera Barthes. Roman du cycle de l’**absurde**, avec *Le Mythe de Sisyphe* et *Caligula*. Meursault n’est pas insensible : il refuse de **mentir** sur ce qu’il ressent, et c’est ce refus que la société ne pardonne pas.

> « Aujourd’hui, maman est morte. Ou peut-être hier, je ne sais pas. »`,
          },
          questions: [
            ['Par quelle phrase le roman commence-t-il ?', ['« Aujourd’hui, maman est morte »', '« Il faisait très chaud »', '« Je m’appelle Meursault »', '« Le soleil était insoutenable »'], 0, 'Le ton neutre est donné dès la première ligne.'],
            ['Que reproche-t-on surtout à Meursault lors du procès ?', ['De n’avoir pas pleuré à l’enterrement de sa mère', 'D’avoir prémédité le meurtre', 'D’avoir menti à la police', 'D’avoir fui'], 0, 'Il est jugé pour son indifférence plus que pour son crime.'],
            ['Où et dans quelles circonstances le meurtre a-t-il lieu ?', ['Sur une plage écrasée de soleil', 'Dans un bar la nuit', 'Chez Raymond', 'Au cimetière'], 0, 'Le soleil est présenté comme un élément déterminant.'],
            ['Comment appelle-t-on le style du roman ?', ['L’écriture blanche', 'Le style flamboyant', 'Le réalisme lyrique', 'L’écriture artiste'], 0, 'Phrases courtes, passé composé, neutralité : Barthes l’a analysée.'],
            ['Comment Meursault réagit-il face à l’aumônier ?', ['Il refuse ses consolations et explose de colère', 'Il se convertit', 'Il l’ignore poliment', 'Il demande le pardon'], 0, 'Puis il accède à « la tendre indifférence du monde ».'],
            ['Meursault est un personnage insensible et sans émotion.', ['Vrai', 'Faux'], 1, 'Il refuse de mentir sur ce qu’il ressent : c’est ce refus que la société condamne.'],
          ],
        },
        {
          titre: 'L’Être et le Néant, Jean-Paul Sartre',
          lecon: {
            titre: 'Sartre, 1943 — le traité de l’existentialisme',
            cours: `## L’œuvre
Sous-titré « Essai d’ontologie phénoménologique », publié en **1943**. Sartre y distingue l’**en-soi** — l’être des choses, plein, identique à lui-même — et le **pour-soi** — la conscience, qui n’est jamais ce qu’elle est, toujours en projet, traversée de **néant**.

## Les notions clés
- **L’existence précède l’essence** : l’homme n’a pas de nature préalable, il se définit par ses actes.
- La **liberté** est totale, et donc la **responsabilité** aussi : « nous sommes condamnés à être libres ».
- La **mauvaise foi** : se mentir à soi-même pour fuir cette liberté — l’exemple célèbre du garçon de café qui « joue » à être garçon de café, ou de la femme qui laisse sa main dans celle de son partenaire en feignant de ne pas la sentir.
- **Le regard d’autrui** : il me fige en objet ; c’est le point de départ du conflit des consciences, dont *Huis clos* est l’illustration théâtrale.
- L’**angoisse** naît de la découverte que rien ne fonde mes choix.

## À retenir
Livre difficile, mais dont les notions irriguent toute l’œuvre littéraire de Sartre (*La Nausée*, *Huis clos*, *Les Mouches*) et une bonne part de la pensée du XXe siècle. La conférence *L’existentialisme est un humanisme* (1946) en donne une version accessible.

> « L’homme est condamné à être libre. »`,
          },
          questions: [
            ['Quelle distinction fonde l’ouvrage ?', ['L’en-soi (les choses) et le pour-soi (la conscience)', 'Le corps et l’âme', 'Le bien et le mal', 'La nature et la culture'], 0, 'Le pour-soi n’est jamais ce qu’il est : il est en projet.'],
            ['Que signifie « l’existence précède l’essence » ?', ['L’homme n’a pas de nature préalable : il se définit par ses actes', 'L’âme existe avant le corps', 'La matière précède l’esprit', 'La société détermine l’individu'], 0, 'C’est la formule centrale de l’existentialisme sartrien.'],
            ['Qu’est-ce que la mauvaise foi ?', ['Se mentir à soi-même pour fuir sa liberté', 'Mentir aux autres', 'Renier ses engagements politiques', 'Refuser la religion'], 0, 'Le garçon de café qui « joue » son rôle en est l’exemple célèbre.'],
            ['Quel effet le regard d’autrui produit-il ?', ['Il me fige en objet', 'Il me libère', 'Il n’a aucun effet', 'Il me révèle ma nature'], 0, 'C’est le point de départ du conflit des consciences, mis en scène dans Huis clos.'],
            ['Quel texte donne une version accessible de cette philosophie ?', ['L’existentialisme est un humanisme (1946)', 'La Nausée', 'Les Mots', 'Situations I'], 0, 'C’est une conférence, publiée l’année suivante.'],
            ['Selon Sartre, la liberté est limitée par une nature humaine donnée.', ['Vrai', 'Faux'], 1, 'Il n’y a pas de nature humaine préalable : « l’homme est condamné à être libre ».'],
          ],
        },
        {
          titre: 'L’Homme qui rit, Victor Hugo',
          lecon: {
            titre: 'Hugo, 1869 — un visage taillé pour le rire',
            cours: `## L’histoire
Angleterre, fin du XVIIe siècle. **Gwynplaine**, enfant noble, a été vendu à des **comprachicos**, trafiquants qui mutilaient les enfants pour en faire des monstres de foire : son visage a été taillé en un **rire perpétuel**. Abandonné dans la neige, il sauve un bébé aveugle, **Dea**, et tous deux sont recueillis par le forain **Ursus** et son loup **Homo**. Ils grandissent, s’aiment, jouent un spectacle où le public rit de Gwynplaine. Un document révèle qu’il est **lord Clancharlie** : introduit à la Chambre des lords, il prononce un discours enflammé sur la misère du peuple — les lords éclatent de rire à cause de son visage. Il renonce, retrouve Dea mourante, et se jette à la mer.

## À retenir
Roman **noir et politique**, mal reçu à sa parution, aujourd’hui relu comme l’un des plus forts de Hugo. Le rire figé est une image saisissante : le peuple, quoi qu’il dise, est condamné à faire rire ceux qui le dominent. Contrastes hugoliens (monstre et beauté, aveugle qui voit, rire et douleur), style incantatoire, digressions historiques.

> « Je suis celui qui vient des profondeurs. »`,
          },
          questions: [
            ['Pourquoi Gwynplaine rit-il perpétuellement ?', ['Son visage a été taillé par des comprachicos', 'Il est atteint d’une maladie nerveuse', 'C’est un masque de scène', 'Il a choisi ce rôle'], 0, 'Ils mutilaient les enfants pour en faire des monstres de foire.'],
            ['Qui sont Dea, Ursus et Homo ?', ['Une jeune aveugle, le forain qui les recueille et son loup', 'Trois enfants perdus', 'Des lords anglais', 'Les parents de Gwynplaine'], 0, 'Ils forment la famille de substitution du héros.'],
            ['Que se passe-t-il à la Chambre des lords ?', ['Gwynplaine plaide pour le peuple, et les lords rient de son visage', 'Il est acclamé', 'Il est chassé sans parler', 'Il refuse de siéger'], 0, 'Le peuple, quoi qu’il dise, fait rire ceux qui le dominent.'],
            ['Quelle est la véritable identité de Gwynplaine ?', ['Lord Clancharlie', 'Le fils d’Ursus', 'Un prince français', 'Un bâtard royal'], 0, 'Un document retrouvé révèle sa naissance.'],
            ['Comment le roman se termine-t-il ?', ['Dea meurt, et Gwynplaine se jette à la mer', 'Gwynplaine devient lord et épouse Dea', 'Ursus adopte Gwynplaine officiellement', 'Gwynplaine se venge des comprachicos'], 0, 'La fin est parmi les plus sombres de Hugo.'],
            ['Le roman fut un succès immédiat.', ['Vrai', 'Faux'], 1, 'Il fut mal reçu en 1869, et n’a été relu et apprécié que bien plus tard.'],
          ],
        },
        {
          titre: 'L’Île des esclaves, Marivaux',
          lecon: {
            titre: 'Marivaux, 1725 — l’expérience du renversement',
            cours: `## L’histoire
Comédie en **un acte et en prose**. Une tempête jette sur une île quatre naufragés : **Iphicrate**, maître athénien, et son esclave **Arlequin** ; **Euphrosine**, dame, et sa servante **Cléanthis**. L’île est peuplée d’anciens esclaves révoltés : **Trivelin**, le gouverneur, applique la loi locale — les maîtres et les serviteurs **échangent** leurs noms, leurs habits et leurs conditions pour trois ans, le temps de « se corriger ». Arlequin et Cléanthis dressent des portraits impitoyables de leurs anciens maîtres, puis, quand ils pourraient se venger, ils **pardonnent**. Les rôles sont rendus ; tous rentrent à Athènes, changés.

## À retenir
Une **utopie** pédagogique, non une pièce révolutionnaire : Marivaux ne veut pas abolir les conditions, il veut les rendre **humaines** — le maître doit apprendre ce qu’il fait subir. Le comique naît du décalage entre l’habit et la personne ; l’émotion, de la générosité des serviteurs. Un an après *L’Île des esclaves*, Marivaux écrira *L’Île de la raison*.

> « Ta vie est un opprobre, et il faut la réparer. »`,
          },
          questions: [
            ['Quelle est la loi de l’île ?', ['Maîtres et serviteurs échangent conditions et habits pour trois ans', 'Les maîtres sont exécutés', 'Les esclaves sont libérés puis renvoyés', 'Tout le monde devient égal définitivement'], 0, 'L’échange doit servir à corriger les maîtres.'],
            ['Qui applique cette loi ?', ['Trivelin, le gouverneur de l’île', 'Arlequin', 'Iphicrate', 'Cléanthis'], 0, 'L’île est peuplée d’anciens esclaves révoltés.'],
            ['Que font Arlequin et Cléanthis quand ils pourraient se venger ?', ['Ils pardonnent', 'Ils punissent leurs maîtres', 'Ils s’enfuient', 'Ils réclament de l’argent'], 0, 'Le dénouement repose sur leur générosité.'],
            ['Quelle est la visée de la pièce ?', ['Rendre les rapports humains, non abolir les conditions', 'Appeler à la révolution', 'Défendre l’esclavage antique', 'Se moquer des serviteurs'], 0, 'C’est une utopie pédagogique, pas un programme politique.'],
            ['D’où naît le comique de la pièce ?', ['Du décalage entre l’habit et la personne', 'De quiproquos amoureux', 'De jeux de mots savants', 'De chutes et de coups'], 0, 'Les portraits des maîtres par leurs serviteurs sont impitoyables.'],
            ['La pièce est en cinq actes et en vers.', ['Vrai', 'Faux'], 1, 'Elle tient en un acte et en prose.'],
          ],
        },
        {
          titre: 'L’Île mystérieuse, Jules Verne',
          lecon: {
            titre: 'Verne, 1874 — refaire une civilisation à partir de rien',
            cours: `## L’histoire
En **1865**, pendant la guerre de Sécession, cinq prisonniers nordistes s’évadent de Richmond en **ballon** et échouent sur une île déserte du Pacifique : l’ingénieur **Cyrus Smith**, le journaliste **Gédéon Spilett**, le marin **Pencroff**, le jeune **Harbert**, l’ancien esclave **Nab** et le chien Top. Ils nomment l’île **Lincoln** et, à partir de presque rien, reconstruisent une civilisation : feu, poterie, briques, fer, nitroglycérine, télégraphe, moulin, élevage. Des événements inexplicables les protègent — une caisse échouée, un sauvetage. À la fin, l’inconnu se révèle : c’est le **capitaine Nemo**, vieilli, dans son *Nautilus*, dernier survivant de *Vingt Mille Lieues sous les mers*. L’île explose ; les colons sont sauvés.

## À retenir
La grande **robinsonnade** scientifique de Verne : l’ingénieur remplace la Providence, le savoir remplace le miracle. Roman du **travail collectif** et de la solidarité, il relie deux autres livres de Verne (*Les Enfants du capitaine Grant* et *Vingt Mille Lieues sous les mers*) en une trilogie.

> « Tout est possible à qui sait et à qui veut. »`,
          },
          questions: [
            ['Comment les héros arrivent-ils sur l’île ?', ['En s’évadant en ballon pendant la guerre de Sécession', 'Par un naufrage', 'À bord du Nautilus', 'Par une expédition scientifique'], 0, 'Ils nomment l’île Lincoln en hommage au président.'],
            ['Qui est le chef naturel du groupe ?', ['L’ingénieur Cyrus Smith', 'Le marin Pencroff', 'Le journaliste Spilett', 'Nab'], 0, 'Son savoir permet de reconstruire une civilisation à partir de rien.'],
            ['Quel personnage protège secrètement les colons ?', ['Le capitaine Nemo', 'Un naufragé anglais', 'Un pirate repenti', 'Un savant américain'], 0, 'Il est le dernier survivant de Vingt Mille Lieues sous les mers.'],
            ['À quel genre le roman appartient-il ?', ['La robinsonnade scientifique', 'Le roman policier', 'Le roman historique', 'Le conte philosophique'], 0, 'Le savoir remplace le miracle et la Providence.'],
            ['Comment le roman se termine-t-il ?', ['L’île explose et les colons sont sauvés', 'Les colons restent sur l’île', 'Nemo emmène les colons', 'Ils construisent un navire et rentrent seuls'], 0, 'Le volcan de l’île entre en éruption.'],
            ['Le roman est indépendant des autres livres de Verne.', ['Vrai', 'Faux'], 1, 'Il forme une trilogie avec Les Enfants du capitaine Grant et Vingt Mille Lieues sous les mers.'],
          ],
        },
        {
          titre: 'L’Illusion comique, Pierre Corneille',
          lecon: {
            titre: 'Corneille, 1636 — le théâtre dans le théâtre dans le théâtre',
            cours: `## L’histoire
**Pridamant** cherche son fils **Clindor**, chassé dix ans plus tôt. Le magicien **Alcandre** lui propose de le lui montrer : dans une grotte, il fait apparaître des scènes. Pridamant voit Clindor devenu valet du fanfaron **Matamore**, amoureux d’**Isabelle**, rival de son maître et d’Adraste, emprisonné, sauvé, puis — dans un dernier tableau — riche, infidèle, et **assassiné**. Pridamant s’effondre. Alcandre tire alors le rideau : les personnages comptent de l’argent. Ce dernier meurtre était une **pièce de théâtre** : Clindor est devenu comédien. Le père, d’abord horrifié par ce métier, se laisse convaincre par l’**éloge du théâtre** que prononce Alcandre.

## À retenir
Corneille l’appelait « un étrange monstre » : la pièce mélange comédie, tragédie, farce (Matamore, hérité de la comédie espagnole) et **mise en abyme** — du théâtre dans du théâtre, vu par un spectateur intérieur. C’est une **défense et illustration du théâtre**, à un moment où le métier de comédien était méprisé et excommunié. Créée en **1636**, la même année que *Le Cid*.

> « Le théâtre est un fief dont les rentes sont bonnes. »`,
          },
          questions: [
            ['Que demande Pridamant au magicien Alcandre ?', ['De lui montrer ce qu’est devenu son fils Clindor', 'De lui rendre sa jeunesse', 'De punir son fils', 'De lui prédire l’avenir'], 0, 'Alcandre fait apparaître des scènes dans sa grotte.'],
            ['Qui est Matamore ?', ['Un fanfaron dont Clindor est le valet', 'Le père d’Isabelle', 'Un magicien rival', 'Un comédien de la troupe'], 0, 'Personnage hérité de la comédie espagnole.'],
            ['Que découvre-t-on à la fin de la pièce ?', ['Le dernier meurtre était une scène de théâtre : Clindor est comédien', 'Clindor est mort pour de bon', 'Alcandre avait menti depuis le début', 'Pridamant rêvait'], 0, 'Le rideau tiré révèle des comédiens qui comptent leur recette.'],
            ['Quel procédé structure la pièce ?', ['La mise en abyme : du théâtre dans du théâtre', 'Le monologue continu', 'Le récit épistolaire', 'Le chœur antique'], 0, 'Avec un spectateur intérieur, Pridamant.'],
            ['Quelle est la visée de la pièce ?', ['Défendre le théâtre et le métier de comédien', 'Dénoncer l’illusion théâtrale', 'Célébrer la magie', 'Critiquer les pères autoritaires'], 0, 'Le métier de comédien était alors méprisé et excommunié.'],
            ['Corneille jugeait sa pièce parfaitement régulière.', ['Vrai', 'Faux'], 1, 'Il l’appelait lui-même « un étrange monstre ».'],
          ],
        },
        {
          titre: 'L’Immoraliste, André Gide',
          lecon: {
            titre: 'Gide, 1902 — se guérir, et détruire',
            cours: `## L’histoire
**Michel**, jeune érudit élevé dans la rigueur protestante, épouse **Marceline** sans amour, par obéissance à son père mourant. En voyage de noces en **Tunisie**, il manque mourir de la tuberculose. Sa guérison est une révélation : il découvre son corps, le soleil, la sensualité, l’attirance pour les jeunes garçons arabes, et décide de vivre selon sa seule **nature**. De retour en Normandie, puis à Paris, il devient étranger à son métier, à son milieu, à sa morale. Marceline tombe malade à son tour ; Michel l’entraîne dans un voyage vers le sud, épuisant, qui la tue. Il raconte tout cela à trois amis venus le retrouver en Algérie.

## À retenir
Un **récit** au sens gidien, court et à narrateur unique, publié en **1902**. Gide y met en scène l’**immoralisme** — non l’absence de morale, mais le refus des valeurs reçues — sans l’approuver : la préface prévient que le livre est un « fruit plein de cendre amère ». La liberté conquise se paie de la mort de l’autre. À lire en regard de *La Porte étroite* (1909), qui traite l’excès inverse : le renoncement.

> « Savoir se libérer n’est rien ; l’ardu, c’est savoir être libre. »`,
          },
          questions: [
            ['Qu’est-ce qui transforme Michel ?', ['Sa guérison de la tuberculose en Tunisie', 'La mort de son père', 'Un héritage', 'La lecture de Nietzsche'], 0, 'Il découvre son corps, le soleil et la sensualité.'],
            ['Que devient Marceline ?', ['Elle tombe malade et meurt lors d’un voyage vers le sud', 'Elle quitte Michel', 'Elle guérit et l’accompagne', 'Elle entre au couvent'], 0, 'La liberté de Michel se paie de sa mort.'],
            ['Que signifie « immoralisme » chez Gide ?', ['Le refus des valeurs reçues, non l’absence de morale', 'La défense du crime', 'L’athéisme militant', 'L’indifférence au bien et au mal'], 0, 'La préface met en garde : le livre est un « fruit plein de cendre amère ».'],
            ['À qui Michel raconte-t-il son histoire ?', ['À trois amis venus le retrouver en Algérie', 'À un prêtre', 'Dans un journal intime', 'À un médecin'], 0, 'Le récit est encadré par cette confession.'],
            ['Quel autre récit de Gide traite l’excès inverse ?', ['La Porte étroite, sur le renoncement', 'Les Faux-Monnayeurs', 'Les Caves du Vatican', 'Si le grain ne meurt'], 0, 'Les deux livres se répondent comme deux excès symétriques.'],
            ['Gide approuve entièrement la conduite de son personnage.', ['Vrai', 'Faux'], 1, 'Le récit expose sans absoudre : la libération de Michel détruit autour de lui.'],
          ],
        },
        {
          titre: 'L’Ingénu, Voltaire',
          lecon: {
            titre: 'Voltaire, 1767 — un Huron en Basse-Bretagne',
            cours: `## L’histoire
Un jeune **Huron** débarque en Bretagne en 1689 ; on découvre qu’il est le neveu du prieur de Kerkabon. Baptisé sous le nom d’**Hercule de Kerkabon**, dit **l’Ingénu**, il juge tout ce qu’il voit avec une **logique** implacable : il ne comprend ni le baptême, ni la confession, ni l’interdiction d’épouser sa marraine, **Mademoiselle de Saint-Yves**. Après avoir repoussé une attaque anglaise, il monte à Versailles réclamer une récompense — et se retrouve embastillé, victime d’une dénonciation et d’un ordre arbitraire. En prison, il s’instruit auprès d’un vieux **janséniste**, Gordon. Pour le libérer, Mademoiselle de Saint-Yves cède au sous-ministre Saint-Pouange ; elle en meurt de honte et de chagrin.

## À retenir
**Conte philosophique** plus sombre que *Candide* : le rire y cède peu à peu à l’indignation. Cibles : l’arbitraire royal (**lettres de cachet**), les querelles religieuses (jansénistes/jésuites), la corruption de la cour. Le **regard neuf** de l’Ingénu sert d’abord au comique, puis à la dénonciation. La fin, sans consolation, contredit tout optimisme.

> « Il devint un excellent officier et un philosophe intrépide. »`,
          },
          questions: [
            ['Qui est l’Ingénu ?', ['Un jeune Huron qui se révèle neveu du prieur de Kerkabon', 'Un paysan breton', 'Un soldat anglais', 'Un moine défroqué'], 0, 'Son regard neuf sert d’abord le comique, puis la dénonciation.'],
            ['Pourquoi l’Ingénu est-il embastillé ?', ['Sur dénonciation, par un ordre arbitraire, après avoir servi le roi', 'Pour vol', 'Pour hérésie prouvée', 'Pour désertion'], 0, 'Les lettres de cachet sont une cible majeure du conte.'],
            ['Qui instruit l’Ingénu en prison ?', ['Gordon, un vieux janséniste', 'Un jésuite', 'Un officier', 'Le prieur de Kerkabon'], 0, 'La prison devient paradoxalement un lieu de formation.'],
            ['Comment Mademoiselle de Saint-Yves obtient-elle la libération ?', ['En cédant au sous-ministre Saint-Pouange', 'En payant une rançon', 'En s’adressant au roi', 'Par un procès'], 0, 'Elle en meurt de honte et de chagrin.'],
            ['En quoi ce conte diffère-t-il de Candide ?', ['Le rire y cède progressivement à l’indignation', 'Il est plus optimiste', 'Il ne comporte aucune satire', 'Il se déroule hors de France'], 0, 'La fin est sans consolation.'],
            ['L’Ingénu comprend immédiatement les usages religieux français.', ['Vrai', 'Faux'], 1, 'Il les juge par la logique, ce qui les rend absurdes : c’est le ressort du conte.'],
          ],
        },
        {
          titre: 'L’Œuvre, Émile Zola',
          lecon: {
            titre: 'Zola, 1886 — le peintre qui n’y arrive pas',
            cours: `## L’histoire
**Claude Lantier**, peintre novateur, veut imposer une peinture de plein air, lumineuse, refusée par les jurys officiels. Son grand tableau, exposé au **Salon des refusés**, provoque le rire du public. Il rencontre **Christine**, l’épouse, a un enfant — qu’il peindra mort sur son lit. Obsédé par un tableau monumental de Paris, il le recommence sans fin, y sacrifie sa famille et sa santé, ne parvient jamais à faire coïncider la toile et sa vision. Il se pend devant elle. Son ami l’écrivain **Sandoz** conclut, au cimetière : « Allons travailler. »

## À retenir
Quatorzième volume des *Rougon-Macquart*. Roman de l’**impuissance créatrice** et du prix payé par l’art. Il provoqua la **rupture** entre Zola et son ami d’enfance **Paul Cézanne**, qui se reconnut en partie dans Claude. Zola y règle aussi ses comptes avec le monde artistique du Second Empire et met en scène, sous les traits de Sandoz, sa propre méthode de travail.

> « Ah ! cette vie, il fallait la vivre pour la peindre. »`,
          },
          questions: [
            ['Quel est le métier de Claude Lantier ?', ['Peintre', 'Écrivain', 'Sculpteur', 'Journaliste'], 0, 'Il veut imposer une peinture de plein air, lumineuse.'],
            ['Où son grand tableau est-il exposé ?', ['Au Salon des refusés', 'Au Louvre', 'Dans une galerie privée', 'À l’Académie'], 0, 'Le public en rit : c’est un épisode historique réel.'],
            ['Qu’est-ce qui perd Claude ?', ['Un tableau monumental qu’il recommence sans fin', 'Une dette de jeu', 'La maladie de Christine', 'La censure officielle'], 0, 'Il ne parvient jamais à faire coïncider la toile et sa vision.'],
            ['Quelle amitié le roman a-t-il brisée ?', ['Celle de Zola et de Paul Cézanne', 'Celle de Zola et de Manet', 'Celle de Zola et de Flaubert', 'Celle de Zola et de Maupassant'], 0, 'Cézanne s’est en partie reconnu dans Claude Lantier.'],
            ['Que fait Sandoz au cimetière ?', ['Il dit : « Allons travailler »', 'Il maudit l’art', 'Il brûle les toiles', 'Il promet de venger Claude'], 0, 'Sandoz est le double romanesque de Zola.'],
            ['Le roman célèbre la réussite artistique.', ['Vrai', 'Faux'], 1, 'C’est un roman de l’impuissance créatrice et du prix payé par l’art.'],
          ],
        },
        {
          titre: 'La Ballade des pendus, François Villon',
          lecon: {
            titre: 'Villon, vers 1462 — les morts s’adressent aux vivants',
            cours: `## Le poème
Aussi appelé « **L’Épitaphe Villon** », il aurait été écrit alors que Villon, emprisonné, était condamné à être **pendu** — peine ensuite commuée en bannissement. Trois **huitains** de décasyllabes et un **envoi**, forme de la ballade.

## Le texte
Les pendus eux-mêmes prennent la parole : « **Frères humains qui après nous vivez** ». Ils décrivent leurs corps rongés par la pluie, noircis par le soleil, becquetés par les oiseaux, « plus becquetés d’oiseaux que dés à coudre ». Ils demandent non l’admiration mais la **prière** et l’absence de moquerie : « Ne soyez donc de notre confrérie ; / Mais priez Dieu que tous nous veuille absoudre ! »

## À retenir
Un des sommets de la poésie médiévale française. Le poème mêle le **macabre** (très présent au XVe siècle, après la peste et la guerre de Cent Ans), la **fraternité** (« frères humains ») et la **supplication** religieuse. Villon, maître ès arts, voleur, meurtrier, banni, disparaît sans laisser de trace après 1463 — sa légende a nourri Rimbaud, Verlaine et la chanson française.

> « Frères humains qui après nous vivez, / N’ayez les cœurs contre nous endurcis. »`,
          },
          questions: [
            ['Qui prend la parole dans le poème ?', ['Les pendus eux-mêmes', 'Le bourreau', 'Villon en son nom', 'Dieu'], 0, '« Frères humains qui après nous vivez. »'],
            ['Dans quelles circonstances le poème aurait-il été écrit ?', ['Alors que Villon était condamné à la pendaison', 'Après sa libération', 'Pendant un voyage', 'À la cour du duc d’Orléans'], 0, 'La peine fut ensuite commuée en bannissement.'],
            ['Que demandent les pendus aux vivants ?', ['De ne pas se moquer et de prier Dieu pour eux', 'De les venger', 'De les enterrer', 'De prouver leur innocence'], 0, '« Priez Dieu que tous nous veuille absoudre ! »'],
            ['Quelle est la forme du poème ?', ['Une ballade : trois huitains et un envoi', 'Un sonnet', 'Un rondeau', 'Une ode'], 0, 'Forme fixe très pratiquée au XVe siècle.'],
            ['Quelle esthétique le poème illustre-t-il ?', ['Le macabre médiéval, après la peste et la guerre', 'Le lyrisme courtois', 'La poésie pastorale', 'Le burlesque'], 0, 'Les corps y sont décrits avec un réalisme cru.'],
            ['On connaît précisément la fin de la vie de Villon.', ['Vrai', 'Faux'], 1, 'Il disparaît sans trace après 1463 : sa légende a nourri toute la poésie française.'],
          ],
        },
        {
          titre: 'La Bête humaine, Émile Zola',
          lecon: {
            titre: 'Zola, 1890 — le train, le meurtre, l’hérédité',
            cours: `## L’histoire
**Roubaud**, sous-chef de gare au Havre, apprend que sa femme **Séverine** a été la maîtresse du président **Grandmorin** ; fou de rage, il l’oblige à l’attirer dans un train et l’égorge. Le crime est aperçu, en une seconde, par **Jacques Lantier**, mécanicien de la locomotive **la Lison**. Jacques souffre d’une pulsion héréditaire : le désir de tuer les femmes qu’il désire. Il devient l’amant de Séverine, qui lui demande de tuer Roubaud ; incapable de le faire, il finit par tuer **Séverine** elle-même. Un autre homme, Cabuche, est condamné à sa place. À la fin, Jacques et son chauffeur Pecqueux se battent sur la machine lancée et tombent : le train, plein de soldats ivres partant pour la guerre de 1870, continue **sans conducteur**.

## À retenir
Dix-septième volume des *Rougon-Macquart*. Roman du **chemin de fer** — la machine y est un personnage, la Lison a un corps et une agonie — et de l’**hérédité** criminelle, thèse naturaliste poussée à l’extrême. La dernière image, du train fou lancé dans la nuit, est l’une des plus célèbres de Zola.

> « Elle roulait, roulait sans fin, comme affolée de plus en plus. »`,
          },
          questions: [
            ['Pourquoi Roubaud tue-t-il le président Grandmorin ?', ['Parce qu’il apprend que sa femme a été sa maîtresse', 'Pour de l’argent', 'Par vengeance politique', 'Par accident'], 0, 'Il contraint Séverine à l’attirer dans un train.'],
            ['De quoi souffre Jacques Lantier ?', ['D’une pulsion héréditaire à tuer les femmes qu’il désire', 'D’alcoolisme', 'D’une maladie des poumons', 'De crises de somnambulisme'], 0, 'C’est la thèse naturaliste de l’hérédité poussée à l’extrême.'],
            ['Comment s’appelle la locomotive de Jacques ?', ['La Lison', 'La Bête', 'La Séverine', 'L’Étoile'], 0, 'Elle est traitée comme un personnage, avec un corps et une agonie.'],
            ['Qui Jacques finit-il par tuer ?', ['Séverine', 'Roubaud', 'Cabuche', 'Pecqueux'], 0, 'Cabuche sera condamné à sa place.'],
            ['Quelle est la dernière image du roman ?', ['Un train sans conducteur, plein de soldats, lancé dans la nuit', 'Un incendie de gare', 'Un procès', 'Le suicide de Roubaud'], 0, 'Les soldats partent pour la guerre de 1870 : l’image est politique.'],
            ['Le chemin de fer n’est qu’un décor dans le roman.', ['Vrai', 'Faux'], 1, 'La machine est un personnage à part entière, jusque dans son agonie.'],
          ],
        },
        {
          titre: 'La Chartreuse de Parme, Stendhal',
          lecon: {
            titre: 'Stendhal, 1839 — Waterloo, la prison, le bonheur',
            cours: `## L’histoire
Écrit en **cinquante-deux jours**. **Fabrice del Dongo**, jeune noble milanais enthousiaste de Napoléon, part le rejoindre et se retrouve à **Waterloo** sans rien comprendre à la bataille — page célèbre, modèle du récit de guerre vu d’en bas. De retour en Italie, il est protégé par sa tante, la **duchesse Sanseverina**, qui l’aime, et par le comte **Mosca**, premier ministre de Parme, qui aime la duchesse. Intrigues de cour, meurtre d’un rival, emprisonnement à la **tour Farnèse** — où Fabrice, du haut de sa cellule, découvre **Clélia Conti**, fille du gouverneur, et connaît le bonheur le plus intense de sa vie. Évasion, retours, séparations : Clélia a fait vœu de ne plus jamais le voir ; ils s’aiment dans l’obscurité. Leur enfant meurt, Clélia meurt, Fabrice se retire à la chartreuse de Parme et meurt un an après.

## À retenir
Roman de l’**énergie** et du **bonheur** — Stendhal dédie son livre « To the happy few ». Prison paradoxalement heureuse, politique de cour féroce, écriture rapide et sèche. Balzac lui consacra un article dithyrambique.

> « To the happy few. »`,
          },
          questions: [
            ['Quelle bataille Fabrice traverse-t-il sans la comprendre ?', ['Waterloo', 'Austerlitz', 'Marengo', 'Iéna'], 0, 'Page modèle du récit de guerre vu d’en bas.'],
            ['Qui protège Fabrice à Parme ?', ['Sa tante la duchesse Sanseverina et le comte Mosca', 'Le prince de Parme', 'Le général Conti', 'L’archevêque'], 0, 'La duchesse l’aime, et Mosca aime la duchesse.'],
            ['Où Fabrice connaît-il le plus grand bonheur de sa vie ?', ['En prison, dans la tour Farnèse', 'À Waterloo', 'Au couvent', 'À Milan'], 0, 'Il y aperçoit Clélia Conti depuis sa cellule.'],
            ['Quel vœu Clélia a-t-elle prononcé ?', ['Ne plus jamais revoir Fabrice', 'Ne jamais se marier', 'Entrer au couvent', 'Renoncer à son père'], 0, 'Ils s’aimeront dans l’obscurité, pour ne pas se voir.'],
            ['En combien de temps Stendhal a-t-il écrit le roman ?', ['Cinquante-deux jours', 'Deux ans', 'Cinq ans', 'Six mois'], 0, 'La rapidité de la dictée se sent dans le rythme du livre.'],
            ['La prison est décrite comme un lieu de malheur absolu.', ['Vrai', 'Faux'], 1, 'Elle est paradoxalement le lieu du bonheur le plus intense de Fabrice.'],
          ],
        },
        {
          titre: 'La Comédie humaine, Honoré de Balzac',
          lecon: {
            titre: 'Balzac, 1829-1850 — un monde en quatre-vingt-dix romans',
            cours: `## L’ensemble
Titre donné en **1842** à l’ensemble de son œuvre romanesque : environ **quatre-vingt-dix** romans et nouvelles achevés (sur cent trente-sept prévus), plus de **deux mille personnages**. Le titre répond à Dante : à la *Divine Comédie* succède la comédie **humaine**.

## L’architecture
Trois grands ensembles :
- les **Études de mœurs**, elles-mêmes divisées en Scènes de la vie privée, de province, parisienne, politique, militaire et de campagne — c’est le gros de l’œuvre (*Le Père Goriot*, *Eugénie Grandet*, *Illusions perdues*, *La Cousine Bette*) ;
- les **Études philosophiques** (*La Peau de chagrin*, *Louis Lambert*, *Le Chef-d’œuvre inconnu*), où Balzac cherche les causes ;
- les **Études analytiques** (*Physiologie du mariage*), presque inachevées.

## Le retour des personnages
Trouvaille capitale : **Rastignac**, **Vautrin**, Bianchon, Nucingen, la duchesse de Langeais reparaissent d’un roman à l’autre, à des âges et des places différents. L’effet est saisissant : le monde décrit **existe** en dehors de chaque livre, et le lecteur y circule.

## À retenir
L’ambition est celle d’un **naturaliste** de la société : « La Société française allait être l’historien, je ne devais être que le secrétaire. » Balzac veut classer les « espèces sociales » comme Buffon classait les espèces animales.

> « J’aurai porté une société tout entière dans ma tête. »`,
          },
          questions: [
            ['Combien de romans et nouvelles La Comédie humaine compte-t-elle ?', ['Environ quatre-vingt-dix achevés', 'Une vingtaine', 'Deux cents', 'Cinquante exactement'], 0, 'Sur cent trente-sept prévus, avec plus de deux mille personnages.'],
            ['À quelle œuvre le titre répond-il ?', ['La Divine Comédie de Dante', 'L’Iliade', 'Les Essais de Montaigne', 'La Légende des siècles'], 0, 'À la comédie divine succède la comédie humaine.'],
            ['Quelles sont les trois grandes divisions de l’ensemble ?', ['Études de mœurs, Études philosophiques, Études analytiques', 'Romans, contes, essais', 'Paris, province, étranger', 'Passé, présent, avenir'], 0, 'Les Études de mœurs forment la plus grande part.'],
            ['Qu’est-ce que le retour des personnages ?', ['Les mêmes personnages reparaissent d’un roman à l’autre', 'Les héros ressuscitent après leur mort', 'Les romans sont republiés dans un autre ordre', 'Les personnages racontent leur propre histoire'], 0, 'Rastignac, Vautrin, Bianchon circulent d’un livre à l’autre.'],
            ['Quelle ambition Balzac formule-t-il ?', ['Être le secrétaire de la société française, comme un naturaliste', 'Écrire une épopée nationale', 'Réformer la langue', 'Fonder une école littéraire'], 0, 'Il veut classer les « espèces sociales » comme Buffon les espèces animales.'],
            ['Le titre La Comédie humaine a été donné dès le premier roman.', ['Vrai', 'Faux'], 1, 'Il est adopté en 1842, alors qu’une grande partie de l’œuvre était écrite.'],
          ],
        },
        {
          titre: 'La Comtesse de Tende, Madame de La Fayette',
          lecon: {
            titre: 'Madame de La Fayette, 1724 — la nouvelle la plus noire',
            cours: `## L’histoire
Publiée après la mort de l’autrice, cette **nouvelle** brève se situe à la cour d’Henri II, comme *La Princesse de Clèves*. La **comtesse de Tende**, mariée sans amour, s’éprend du **chevalier de Navarre**, qui épouse par ambition une autre femme, la princesse de Neufchâtel. Les amants cèdent à la passion. La comtesse se découvre **enceinte** ; le chevalier meurt à la guerre. Désespérée, elle **avoue tout par écrit** à son mari. Le comte, d’abord décidé à la tuer, choisit une vengeance plus froide : il l’abandonne à sa honte et laisse croire à l’enfant qu’il est le sien, avant que la comtesse ne meure en couches.

## À retenir
Écrite sans doute avant *La Princesse de Clèves*, la nouvelle en est comme la version **sans espoir** : ici, l’aveu ne sauve rien, la passion est consommée, l’enfant naît, et la mort suit. La sécheresse du récit et la brièveté renforcent la noirceur. Un texte court, très commode pour comparer deux traitements du même dilemme moral.

> L’aveu, chez Madame de La Fayette, ne libère jamais.`,
          },
          questions: [
            ['Quand la nouvelle a-t-elle été publiée ?', ['En 1724, après la mort de l’autrice', 'En 1678, avec La Princesse de Clèves', 'En 1662', 'En 1700'], 0, 'Elle a probablement été écrite avant La Princesse de Clèves.'],
            ['Que découvre la comtesse après sa liaison ?', ['Qu’elle est enceinte', 'Que son mari sait tout', 'Que le chevalier est marié', 'Qu’elle est ruinée'], 0, 'Le chevalier meurt à la guerre peu après.'],
            ['Comment la comtesse avoue-t-elle sa faute ?', ['Par écrit, à son mari', 'Devant la cour', 'À un confesseur', 'Elle n’avoue pas'], 0, 'L’aveu écrit est un motif propre à cette nouvelle.'],
            ['Quelle vengeance le comte choisit-il ?', ['L’abandonner à sa honte plutôt que la tuer', 'La tuer aussitôt', 'La répudier publiquement', 'La faire enfermer au couvent'], 0, 'Il laisse même croire que l’enfant est le sien.'],
            ['En quoi la nouvelle diffère-t-elle de La Princesse de Clèves ?', ['La passion y est consommée et l’aveu ne sauve rien', 'Elle finit bien', 'Elle se déroule au XVIIIe siècle', 'Elle est écrite en vers'], 0, 'C’est la version sans espoir du même dilemme.'],
            ['La comtesse survit à l’accouchement.', ['Vrai', 'Faux'], 1, 'Elle meurt en couches : la noirceur est complète.'],
          ],
        },
        {
          titre: 'La Condition humaine, André Malraux',
          lecon: {
            titre: 'Malraux, 1933 — Shanghai, 1927',
            cours: `## L’histoire
**Shanghai**, mars **1927**. Les communistes chinois, alliés au Kuomintang, s’emparent de la ville ; **Tchang Kaï-chek** les fait ensuite massacrer. Autour de cette insurrection : **Kyo Gisors**, révolutionnaire métis, qui veut donner un sens à sa vie par l’action collective ; **Tchen**, terroriste que le meurtre a transformé et qui se fait sauter sous une voiture ; le vieux **Gisors**, père de Kyo, sinologue et fumeur d’opium ; le baron **Clappique**, mythomane et joueur, dont l’oubli au casino coûtera la vie à Kyo ; **Katow**, révolutionnaire russe, qui donne son **cyanure** à deux jeunes compagnons et affronte la locomotive où l’on brûle vifs les prisonniers.

## À retenir
**Prix Goncourt 1933**. Roman de l’**action** et de la **fraternité** : chaque personnage cherche une réponse à la condition humaine — la révolution, la drogue, l’érotisme, l’art, le mythe. Le style est haché, fait de scènes brèves et de dialogues philosophiques. La scène du don du cyanure est l’une des plus célèbres de la littérature française du XXe siècle.

> « Il est très rare qu’un homme puisse supporter… sa condition d’homme. »`,
          },
          questions: [
            ['Où et quand se déroule le roman ?', ['À Shanghai, en 1927', 'À Pékin, en 1949', 'À Canton, en 1911', 'À Madrid, en 1936'], 0, 'L’insurrection communiste y est écrasée par Tchang Kaï-chek.'],
            ['Qui est Tchen ?', ['Un terroriste transformé par le meurtre, qui se fait sauter', 'Le chef du Kuomintang', 'Le père de Kyo', 'Un journaliste français'], 0, 'Son parcours illustre la solitude du terrorisme.'],
            ['Quel geste rend Katow célèbre ?', ['Il donne son cyanure à deux jeunes compagnons', 'Il s’évade seul', 'Il négocie avec Tchang', 'Il tue un général'], 0, 'La scène est l’une des plus fortes du roman.'],
            ['Quel personnage cause indirectement la mort de Kyo ?', ['Clappique, retenu au casino', 'Le vieux Gisors', 'Ferral', 'Hemmelrich'], 0, 'Il oublie de transmettre l’avertissement.'],
            ['Quel prix le roman a-t-il obtenu ?', ['Le prix Goncourt 1933', 'Le Renaudot', 'Le Femina', 'Le prix Nobel'], 0, 'Il a fait de Malraux un écrivain majeur.'],
            ['Le roman propose une seule réponse à la condition humaine.', ['Vrai', 'Faux'], 1, 'Révolution, opium, érotisme, art : chaque personnage tente une réponse différente.'],
          ],
        },
        {
          titre: 'La Critique de l’École des femmes, Molière',
          lecon: {
            titre: 'Molière, 1663 — répondre aux critiques par une pièce',
            cours: `## L’œuvre
Comédie en **un acte et en prose**, jouée en 1663, un an après *L’École des femmes*, qui avait déclenché une querelle. Molière n’écrit pas une préface : il écrit une **pièce** où des personnages discutent de sa pièce précédente, dans un salon.

## Les personnages et les arguments
**Climène**, précieuse offusquée, et le marquis, qui n’a pas d’argument sinon que la pièce est « détestable », attaquent ; **Dorante** et **Uranie** défendent. Les critiques réelles sont reprises une à une — obscénités supposées, invraisemblances, mélange des genres — et démontées. Deux principes en sortent :
- la seule règle est de **plaire** : « je voudrais bien savoir si la grande règle de toutes les règles n’est pas de plaire » ;
- la **comédie** est plus difficile que la tragédie, car il faut peindre d’après nature et faire rire les honnêtes gens.

## À retenir
Un texte capital pour connaître la **poétique de Molière**, et un objet théâtral audacieux : du théâtre qui parle du théâtre, sans intrigue ni dénouement. La querelle se poursuivra avec *L’Impromptu de Versailles* la même année.

> « La grande règle de toutes les règles, n’est-ce pas de plaire ? »`,
          },
          questions: [
            ['Quel est le sujet de cette pièce ?', ['La discussion des critiques faites à L’École des femmes', 'Un mariage arrangé', 'Une querelle de voisinage', 'Un procès'], 0, 'Molière répond par une pièce plutôt que par une préface.'],
            ['Quelle est la règle suprême selon Dorante ?', ['Plaire', 'Respecter les unités', 'Instruire', 'Imiter les Anciens'], 0, '« La grande règle de toutes les règles n’est-elle pas de plaire ? »'],
            ['Quel personnage incarne la précieuse offusquée ?', ['Climène', 'Uranie', 'Élise', 'Dorante'], 0, 'Elle attaque la pièce au nom de la bienséance.'],
            ['Que dit la pièce sur la comédie ?', ['Elle est plus difficile que la tragédie', 'Elle est un genre mineur', 'Elle doit corriger sans faire rire', 'Elle doit imiter la tragédie'], 0, 'Il faut peindre d’après nature et faire rire les honnêtes gens.'],
            ['Quelle pièce prolonge la querelle la même année ?', ['L’Impromptu de Versailles', 'Le Misanthrope', 'Tartuffe', 'Les Précieuses ridicules'], 0, 'Molière y met en scène sa propre troupe en répétition.'],
            ['La pièce comporte une intrigue et un dénouement classiques.', ['Vrai', 'Faux'], 1, 'C’est une conversation de salon : du théâtre qui parle du théâtre.'],
          ],
        },
        {
          titre: 'La Curée, Émile Zola',
          lecon: {
            titre: 'Zola, 1872 — spéculer sur Paris éventré',
            cours: `## L’histoire
Sous le **Second Empire**, **Aristide Saccard**, venu de province, fait fortune en spéculant sur les **expropriations** du baron Haussmann : il achète, grâce à des informations obtenues à l’Hôtel de Ville, les immeubles que la percée des boulevards va détruire, et se fait indemniser au prix fort. Il épouse **Renée**, jeune femme riche, pour son argent. Renée, désœuvrée et dévorée d’ennui, devient la maîtresse de **Maxime**, le fils que Saccard a eu d’un premier mariage — son beau-fils. Quand Saccard découvre la liaison, il n’y voit qu’une occasion : il fait signer à sa femme les papiers qu’il attendait. Renée, ruinée et abandonnée, meurt d’une méningite.

## À retenir
Deuxième volume des *Rougon-Macquart*. Le titre désigne le partage des dépouilles après la chasse : Paris est la bête, l’Empire les chasseurs. Roman de l’**argent** et de la **jouissance**, avec des descriptions somptueuses (la serre, les toilettes, les dîners) où le luxe devient étouffant. Zola y transpose le mythe de **Phèdre** dans la spéculation immobilière.

> « Paris était éventré, et l’argent coulait des plaies. »`,
          },
          questions: [
            ['Sur quoi Saccard fait-il fortune ?', ['La spéculation sur les expropriations haussmanniennes', 'Le commerce colonial', 'Les chemins de fer', 'La banque agricole'], 0, 'Il achète ce qu’il sait devoir être détruit et démoli.'],
            ['Qui est Maxime ?', ['Le fils de Saccard, amant de Renée', 'Le frère de Renée', 'Un banquier rival', 'Le notaire de la famille'], 0, 'La liaison est incestueuse au sens social du terme.'],
            ['Comment Saccard réagit-il en découvrant la liaison ?', ['Il en profite pour faire signer des papiers à sa femme', 'Il tue Maxime', 'Il divorce', 'Il quitte Paris'], 0, 'Tout se convertit en argent chez lui, même le déshonneur.'],
            ['Que signifie le titre du roman ?', ['Le partage des dépouilles après la chasse', 'La course des chevaux au bois', 'La chute d’un régime', 'Le nom d’un quartier de Paris'], 0, 'Paris est la bête, l’Empire les chasseurs.'],
            ['Quel mythe antique Zola transpose-t-il ?', ['Phèdre, amoureuse de son beau-fils', 'Œdipe', 'Antigone', 'Médée'], 0, 'Le mythe est transposé dans la spéculation immobilière.'],
            ['Renée est un personnage actif et maître de son destin.', ['Vrai', 'Faux'], 1, 'Désœuvrée, manipulée et ruinée, elle meurt abandonnée.'],
          ],
        },
      ],
    },
  ],
}
