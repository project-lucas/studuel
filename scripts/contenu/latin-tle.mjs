// Latin — TERMINALE : le programme réel (option LCA et spécialité LLCA).
//
// MÊME SLUG que `latin-lycee.mjs` (`latin`), d'où la génération par
// `--modules latin-tle` : la 220, qui pose le socle lycée (2de-1re-Tle), est
// déjà exécutée et ne doit pas être régénérée.
//
// Sources officielles :
// - programme de l'enseignement de spécialité LLCA, classe terminale
//   (BO spécial n° 8 du 25 juillet 2019) : trois objets d'étude — « L'homme,
//   le monde, le destin », « Croire, savoir, douter », « Méditerranée :
//   présence des mondes antiques » —, et l'étude de la langue propre à la
//   spécialité (style indirect, attraction modale, quicumque / quisquis,
//   memini / novi / odi, expression de l'âge) ;
// - programme de l'enseignement optionnel LCA, classe terminale (même BO) :
//   « Leçons de sagesse antique », « Comprendre le monde », « Inventer,
//   créer, fabriquer, produire », « Méditerranée » ; langue : verbes
//   irréguliers, semi-déponents, non personnels, supin, interrogative
//   indirecte, relatives au subjonctif, double négation ;
// - programme limitatif 2026-2027 et 2027-2028 (BO n° 11 du 12 mars 2026,
//   MENE2605298N) : Ovide, « Tristes », livre III, et Karen Blixen, « La
//   ferme africaine », dans l'objet d'étude « L'homme, le monde, le destin » ;
// - définition de l'épreuve écrite (note de service 2020-028, version
//   consolidée 2024) : 4 h, traduction d'environ 90 mots, fait de langue,
//   lexique, essai sur trois textes.
//
// Positions : les 3 fiches maison de la 220 occupent 1→3 ; ce bloc démarre à 4.

export default {
  slug: 'latin',
  nom: 'Latin',

  titreMigration: 'LATIN Tle — LE PROGRAMME DE TERMINALE (OPTION ET SPÉCIALITÉ LLCA)',

  motif: `CONSTAT : le latin de Terminale n'avait que 3 fiches maison, écrites pour
les trois niveaux du lycée à la fois (déclinaisons, subordonnées, Rome), et
jamais confrontées au programme. Rien sur les objets d'étude de Terminale
(« L'homme, le monde, le destin », « Croire, savoir, douter », « Méditerranée :
présence des mondes antiques », ni sur ceux de l'option), rien sur les œuvres
du programme limitatif 2026-2028 (Ovide, Tristes III ; Karen Blixen, La ferme
africaine), rien sur la langue propre à la Terminale ni sur l'épreuve écrite.
Cette migration AJOUTE 15 fiches derrière les 3 existantes, qui restent en place.`,

  blocs: [
    {
      niveaux: ['Tle'],
      // 1→3 : le socle lycée de la 220. 4→18 : ce bloc.
      positionDepart: 4,
      chapitres: [
        // ===== L'homme, le monde, le destin ================================
        {
          titre: 'Chaos, fatum et Sibylle : le destin chez les Latins',
          axe: 'L’homme, le monde, le destin',
          lecon: {
            titre: 'D’où vient le monde, et qui décide de nos vies ?',
            cours: `Pour un Romain, le destin n’est pas une idée abstraite : c’est une **parole**. Le mot *fatum* vient du verbe *fari*, « parler » — le destin, c’est **ce qui a été dit**, une fois pour toutes.

## Au commencement, le chaos
Ovide ouvre ses *Métamorphoses* par une cosmogonie : *Ante mare et terras et quod tegit omnia caelum / unus erat toto naturae vultus in orbe, / quem dixere chaos*. « Avant la mer, les terres et le ciel qui couvre tout, la nature n’avait dans tout l’univers qu’un seul visage, qu’on a appelé chaos. » Puis un dieu — Ovide dit simplement *deus et melior natura* — sépare les éléments, range le lourd en bas, le léger en haut : le monde naît d’un **tri**, et l’homme vient en dernier, seul être qui lève le visage vers le ciel.

| Récit | Auteur | Ce qui crée le monde |
| *Théogonie* | Hésiode (grec) | Des générations de dieux, du Chaos à Zeus |
| *Timée* | Platon (grec) | Un démiurge, artisan qui copie un modèle parfait |
| *Métamorphoses*, livre I | Ovide | Un dieu qui sépare et ordonne |
| *De rerum natura* | Lucrèce | Aucun dieu : la rencontre des atomes |

## Les fileuses du destin
Les **Parques** (*Parcae*), calquées sur les Moires grecques, filent la vie de chacun : l’une file, l’autre mesure, la troisième coupe. Même Jupiter ne peut défaire ce qu’elles ont filé. Le *fatum* dépasse les dieux eux-mêmes.

## Énée, l’homme du destin
Dès le deuxième vers de l’*Énéide*, Virgile présente son héros *fato profugus*, « exilé par le destin ». Énée ne choisit pas : il doit fonder la lignée d’où sortira Rome, quitte à abandonner Didon. Sa vertu, la *pietas*, c’est d’accepter ce rôle.

> Le héros romain n’est pas grand parce qu’il échappe au destin, mais parce qu’il y **consent**. C’est tout l’opposé de la révolte tragique.

## Les voix qui annoncent l’avenir
1. **La Sibylle de Cumes** : prophétesse d’Apollon qui guide Énée aux Enfers (*Énéide*, VI) ; Rome conservait les *libri Sibyllini*, consultés en cas de crise.
2. **Les augures** observent le vol des oiseaux (*auspicium*, de *avis* « oiseau » et *specere* « regarder »).
3. **Les haruspices**, venus d’Étrurie, lisent les entrailles des victimes.
4. **Les prodiges** (*prodigia*) — pluie de sang, veau à deux têtes — signalent que la *pax deorum*, la paix avec les dieux, est rompue.
5. **Les songes** : Virgile reprend à Homère les deux portes du sommeil, de corne pour les songes vrais, d’ivoire pour les trompeurs.

## Exemple travaillé : traduire fato profugus
Mot à mot : « par le destin (ablatif de cause) fugitif ». En bon français : **« exilé par le destin »**. L’ablatif dit la cause : Énée ne fuit pas par peur, il part parce que c’est écrit.`,
          },
          questions: [
            ['De quel verbe latin vient le mot fatum ?', ['facere, faire', 'fari, parler', 'fallere, tromper', 'ferre, porter'], 1, 'Fatum vient de fari, « parler » : le destin est ce qui a été dit une fois pour toutes.'],
            ['Dans les Métamorphoses d’Ovide, comment s’appelle l’état du monde avant l’ordre ?', ['Le cosmos', 'L’Olympe', 'Le chaos', 'L’Hadès'], 2, 'Ovide écrit « quem dixere chaos » : un seul visage de la nature, sans séparation des éléments.'],
            ['Que sont les Parques ?', ['Les fileuses qui règlent la durée de chaque vie', 'Les prêtresses de Vesta', 'Les juges des Enfers', 'Les muses de l’histoire'], 0, 'Les Parques filent, mesurent et coupent le fil de la vie, comme les Moires grecques.'],
            ['Que signifie « fato profugus », au début de l’Énéide ?', ['Fuyant le destin', 'Maître de son destin', 'Oublié du destin', 'Exilé par le destin'], 3, 'L’ablatif fato exprime la cause : Énée est chassé de Troie par le destin qui l’envoie fonder Rome.'],
            ['Chez Virgile, Énée est admirable parce qu’il se révolte contre le destin.', ['Vrai', 'Faux'], 1, 'Sa vertu est la pietas : il accepte le rôle que le destin lui assigne, même au prix de Didon.'],
            ['Quel devin romain observe le vol des oiseaux ?', ['L’haruspice', 'La Sibylle', 'L’augure', 'Le flamine'], 2, 'L’augure prend les auspices (avis + specere) ; l’haruspice, lui, lit les entrailles.'],
            ['Qui guide Énée aux Enfers au chant VI de l’Énéide ?', ['La Sibylle de Cumes', 'Mercure', 'Didon', 'La Pythie'], 0, 'La Sibylle de Cumes, prophétesse d’Apollon, conduit Énée chez les morts.'],
            ['Dans le De rerum natura, qu’est-ce qui forme le monde ?', ['Un démiurge', 'Jupiter', 'Les Parques', 'La rencontre des atomes'], 3, 'Lucrèce, épicurien, explique le monde sans intervention divine, par le mouvement des atomes.'],
            ['Que signale un prodige, pour un Romain ?', ['Une victoire prochaine', 'La rupture de la paix avec les dieux', 'La naissance d’un empereur', 'La fin d’une magistrature'], 1, 'Le prodige montre que la pax deorum est rompue : il faut l’expier par des rites.'],
            ['Selon la tradition reprise par Virgile, les songes vrais sortent par la porte de corne.', ['Vrai', 'Faux'], 0, 'La porte de corne laisse passer les songes vrais, celle d’ivoire les songes trompeurs.'],
            ['Que lit l’haruspice ?', ['Les étoiles', 'Les livres sibyllins', 'Les entrailles des victimes', 'Le vol des oiseaux'], 2, 'L’haruspicine, d’origine étrusque, interprète le foie et les entrailles des animaux sacrifiés.'],
            ['Chez Ovide, quel être naît en dernier et lève le visage vers le ciel ?', ['Le cheval', 'L’homme', 'Le géant', 'L’aigle'], 1, 'L’homme, créé en dernier, est le seul vivant qui regarde vers le ciel.'],
          ],
        },
        {
          titre: 'Sénèque tragique et le théâtre du monde',
          axe: 'L’homme, le monde, le destin',
          lecon: {
            titre: 'Familles maudites et vie jouée comme une pièce',
            cours: `Rome a hérité des familles maudites de la tragédie grecque, et c’est **Sénèque**, le philosophe stoïcien, qui leur a donné leur version latine la plus noire.

## Sénèque, philosophe et dramaturge
Précepteur puis conseiller de Néron, Sénèque (vers 4 av. J.-C. – 65 ap. J.-C.) a écrit des traités de sagesse… et des tragédies d’une violence extrême : *Médée*, *Œdipe*, *Phèdre*, *Thyeste*, *Agamemnon*. Le paradoxe n’est qu’apparent : ses pièces montrent ce que devient l’âme quand la passion l’emporte sur la raison.

| Pièce | La famille | Le crime |
| *Thyeste* | Les Atrides | Atrée sert à son frère la chair de ses propres fils |
| *Agamemnon* | Les Atrides | Clytemnestre tue son époux au retour de Troie |
| *Œdipe* | Les Labdacides | Le roi découvre qu’il a tué son père et épousé sa mère |
| *Médée* | La Colchidienne | Abandonnée par Jason, elle tue leurs enfants |

## Le furor, moteur de la tragédie
Le mot clé est *furor* : la fureur, la passion devenue folie. Chez Sénèque, le crime n’est pas seulement subi, il est **voulu, préparé, proclamé**. Quand la nourrice rappelle à Médée qu’elle a tout perdu, l’héroïne répond : *Medea superest*, « il reste Médée ». Deux mots qui résument un personnage réduit à sa seule volonté.

> Chez Sophocle, le destin écrase Œdipe ; chez Sénèque, le crime naît d’une passion que le héros aurait pu dominer. La tragédie devient une **leçon stoïcienne à l’envers**.

## Le grand théâtre du monde
L’Antiquité a forgé une image promise à un long avenir : la vie est une pièce, chacun y tient un rôle. Sénèque l’écrit dans une lettre à Lucilius : *quomodo fabula, sic vita : non quam diu, sed quam bene acta sit, refert* — « il en va de la vie comme d’une pièce : ce qui compte, ce n’est pas sa durée, mais la qualité du jeu ». Selon Suétone, Auguste mourant demanda à ses amis s’il avait bien joué la comédie de la vie.

| Époque | L’œuvre | Le theatrum mundi |
| Ier siècle | Sénèque, *Lettres à Lucilius* | Bien jouer son rôle, quelle que soit sa longueur |
| 1599 | Shakespeare, *Comme il vous plaira* | « Le monde entier est un théâtre » |
| 1635 | Calderón, *La vie est un songe* | Le réel et l’illusion se confondent |
| 1636 | Corneille, *L’Illusion comique* | Le théâtre dans le théâtre |

## Méthode : lire une tirade de Sénèque
1. Repère les **impératifs** et les **subjonctifs de souhait** : le héros s’exhorte au crime.
2. Relève le vocabulaire de la passion : *furor*, *ira*, *dolor*, *scelus* (le crime).
3. Observe les **sentences** brèves, frappées comme des maximes : c’est la marque du style de Sénèque.
4. Demande-toi ce que la raison stoïcienne aurait conseillé : la pièce se lit en creux.`,
          },
          questions: [
            ['Quel est le mot clé des tragédies de Sénèque ?', ['Pietas', 'Furor', 'Gravitas', 'Otium'], 1, 'Le furor, passion devenue folie, pousse les héros de Sénèque au crime.'],
            ['Dans quelle tragédie Atrée sert-il à son frère la chair de ses fils ?', ['Médée', 'Œdipe', 'Thyeste', 'Phèdre'], 2, 'Thyeste met en scène la vengeance d’Atrée contre son frère, au cœur de la malédiction des Atrides.'],
            ['Que signifie « Medea superest » ?', ['Il reste Médée', 'Médée est vaincue', 'Médée s’enfuit', 'Médée pleure'], 0, 'Tout lui a été retiré, sauf elle-même : sa volonté suffit au crime.'],
            ['Sénèque a été le précepteur de Néron.', ['Vrai', 'Faux'], 0, 'Sénèque fut précepteur puis conseiller de Néron, qui lui ordonna de se donner la mort en 65.'],
            ['À quelle famille maudite appartiennent Laïos et Œdipe ?', ['Les Atrides', 'Les Pélopides', 'Les Scipions', 'Les Labdacides'], 3, 'Les Labdacides descendent de Labdacos : Laïos, Œdipe, puis Étéocle, Polynice et Antigone.'],
            ['Selon Sénèque, qu’est-ce qui compte dans la vie comme dans une pièce ?', ['Sa durée', 'Le nombre de spectateurs', 'La qualité du jeu', 'Le décor'], 2, '« Non quam diu, sed quam bene acta sit » : non la durée, mais la façon dont elle est jouée.'],
            ['Quel auteur fait dire à un personnage « Le monde entier est un théâtre » ?', ['Molière', 'Shakespeare', 'Racine', 'Calderón'], 1, 'C’est la tirade de Jacques dans Comme il vous plaira de Shakespeare, héritière du theatrum mundi antique.'],
            ['Que désigne le latin scelus ?', ['Le crime', 'Le destin', 'La scène', 'Le masque'], 0, 'Scelus désigne le crime, souvent le crime monstrueux qui souille une famille.'],
            ['Chez Sénèque, le crime est souvent préparé et revendiqué par le héros.', ['Vrai', 'Faux'], 0, 'Le crime y est voulu et proclamé : la passion l’emporte sur une raison que le héros aurait pu écouter.'],
            ['Quelle doctrine philosophique Sénèque défend-il dans ses traités ?', ['L’épicurisme', 'Le cynisme', 'Le scepticisme', 'Le stoïcisme'], 3, 'Sénèque est stoïcien : la raison doit gouverner les passions, ce que ses héros tragiques ne font pas.'],
            ['Selon Suétone, qu’a demandé Auguste à ses amis avant de mourir ?', ['S’il avait bien joué la comédie de la vie', 'S’ils le vengeraient', 'Qui serait son successeur', 'S’il deviendrait un dieu'], 0, 'Auguste reprend l’image du theatrum mundi : la vie est un rôle qu’il faut bien tenir.'],
            ['Quelle pièce de Corneille pratique le théâtre dans le théâtre ?', ['Le Cid', 'Horace', 'L’Illusion comique', 'Cinna'], 2, 'L’Illusion comique (1636) joue sur l’illusion : le spectateur découvre qu’il regardait une pièce.'],
          ],
        },
        {
          titre: 'Ovide, Tristes III : le poète relégué à Tomis',
          axe: 'L’homme, le monde, le destin',
          lecon: {
            titre: 'L’œuvre antique au programme 2026-2028',
            cours: `En 8 après J.-C., le poète le plus célèbre de Rome reçoit l’ordre de quitter la ville. Il ne la reverra jamais. Les *Tristes* sont les lettres en vers de cet exil, et le livre III est l’œuvre antique au programme de la spécialité pour 2026-2027 et 2027-2028.

## L’homme et sa faute
Ovide (*Publius Ovidius Naso*, 43 av. J.-C. – vers 17 ap. J.-C.), né à Sulmone, est l’auteur à la mode de la Rome d’Auguste : les *Amours*, l’*Art d’aimer*, les *Métamorphoses*. Auguste le frappe de **relégation** à Tomis, au bord de la mer Noire (le Pont-Euxin), dans l’actuelle Constanța, en Roumanie. Ovide dira lui-même avoir été perdu par deux choses : *carmen et error*, « un poème et une erreur ». Le poème, c’est l’*Art d’aimer*, jugé contraire aux lois morales d’Auguste ; l’erreur, il ne l’a jamais dite.

| Relégation (relegatio) | Exil (exilium) |
| Ordre de l’empereur, sans procès | Peine plus lourde |
| Le condamné garde sa citoyenneté et ses biens | Perte de la citoyenneté et souvent des biens |
| C’est le sort d’Ovide | Ovide se dit pourtant *exul* dans ses vers |

## Le livre III, élégie par élégie
Le recueil est écrit en **distiques élégiaques** (un hexamètre suivi d’un pentamètre), le vers de la plainte. Quelques poèmes à connaître :
1. **III, 1** : c’est le **livre lui-même qui parle**. Envoyé à Rome, il erre timidement de monument en monument et découvre que les bibliothèques publiques lui ferment leurs portes.
2. **III, 3** : malade, Ovide écrit à sa femme et compose son épitaphe : *Hic ego qui iaceo tenerorum lusor amorum / ingenio perii Naso poeta meo* — « Moi qui repose ici, chantre des tendres amours, le poète Nason, c’est mon talent qui m’a perdu. »
3. **III, 7** : lettre à Périlla, jeune poétesse : tout peut être enlevé, sauf le génie. *Ingenio tamen ipse meo comitorque fruorque* : « je suis accompagné de mon génie, et j’en jouis ».
4. **III, 9** : l’origine du nom de Tomis — Médée y aurait découpé son frère Absyrtos (en grec, *temnein*, « couper »).
5. **III, 10** : l’hiver scythe. L’Hister (le Danube) gèle, les barbares le traversent à cheval, le vin gèle dans les jarres et se boit… en morceaux.
6. **III, 12** : le printemps revient à Rome, pas à Tomis.

> Les *Tristes* ne sont pas un journal de voyage : c’est un **plaidoyer**. Chaque détail du froid et de la barbarie est aussi un argument adressé à Auguste pour obtenir un lieu d’exil plus doux.

## Mots latins à maîtriser
| Mot | Sens | Ce qu’il dit de l’œuvre |
| *exul* | exilé | L’identité nouvelle d’Ovide |
| *ingenium* | talent, génie | Ce qui l’a perdu, ce qui le sauve |
| *patria* | la terre des pères | Rome, toujours regrettée |
| *barbarus* | celui qui ne parle pas latin ni grec | Les Gètes, les Sarmates… et bientôt lui |
| *carmen* | poème, chant | La cause et le remède de l’exil |

## Exemple travaillé : ingenio perii
*Ingenio* est un ablatif de cause, *perii* le parfait de *pereo*, « je péris ». Mot à mot : « par mon talent j’ai péri ». Traduction : **« c’est mon talent qui m’a perdu »**. La tournure présentative rend l’insistance du latin.`,
          },
          questions: [
            ['En quelle année Ovide est-il relégué ?', ['44 av. J.-C.', '8 ap. J.-C.', '27 av. J.-C.', '64 ap. J.-C.'], 1, 'Auguste relègue Ovide en 8 après J.-C. ; le poète meurt à Tomis vers 17.'],
            ['Où se trouve Tomis ?', ['En Sicile', 'En Gaule', 'Sur la mer Noire', 'En Égypte'], 2, 'Tomis, sur le Pont-Euxin, est l’actuelle Constanța, en Roumanie.'],
            ['Quelles sont, selon Ovide, les deux causes de sa perte ?', ['Un poème et une erreur', 'L’argent et l’ambition', 'Un complot et une trahison', 'L’impiété et le luxe'], 0, '« Carmen et error » : l’Art d’aimer et une faute qu’il n’a jamais révélée.'],
            ['Le relégué perd sa citoyenneté romaine.', ['Vrai', 'Faux'], 1, 'La relégation laisse au condamné sa citoyenneté et ses biens ; c’est l’exil qui les lui retire.'],
            ['Dans quel vers sont écrits les Tristes ?', ['L’hexamètre seul', 'Le sénaire iambique', 'Le vers saturnien', 'Le distique élégiaque'], 3, 'Hexamètre suivi d’un pentamètre : le distique élégiaque est le vers de la plainte.'],
            ['Qui prend la parole dans l’élégie III, 1 ?', ['Le livre lui-même', 'Auguste', 'La femme d’Ovide', 'Le Danube'], 0, 'Le livre envoyé à Rome parle et découvre que les bibliothèques publiques le refusent.'],
            ['Que signifie « ingenio perii » ?', ['J’ai péri par la guerre', 'C’est mon talent qui m’a perdu', 'Mon génie m’a sauvé', 'J’ai perdu mon talent'], 1, 'Ingenio est un ablatif de cause, perii le parfait de pereo : « par mon talent j’ai péri ».'],
            ['Quel fleuve gèle dans l’élégie III, 10 ?', ['Le Tibre', 'Le Nil', 'L’Hister, c’est-à-dire le Danube', 'Le Rhône'], 2, 'Ovide décrit l’Hister gelé, que les barbares traversent à cheval.'],
            ['D’après l’élégie III, 9, d’où viendrait le nom de Tomis ?', ['D’un roi gète', 'D’un tombeau d’Achille', 'D’une montagne', 'Du meurtre d’Absyrtos découpé par Médée'], 3, 'Le nom est rattaché au grec temnein, « couper » : Médée y aurait découpé son frère.'],
            ['Que désigne le mot ingenium ?', ['Le talent, le génie', 'L’ingénieur', 'La naissance', 'La prison'], 0, 'Ingenium, le talent naturel, est à la fois la cause de l’exil et la consolation du poète.'],
            ['Les Tristes sont aussi un plaidoyer adressé à Auguste.', ['Vrai', 'Faux'], 0, 'Chaque détail du froid et de la barbarie sert à obtenir un exil plus doux.'],
            ['À qui est adressée l’élégie III, 7 ?', ['À Auguste', 'À Tibère', 'À Périlla, jeune poétesse', 'À Virgile'], 2, 'Ovide encourage Périlla à écrire : le génie est le seul bien qu’on ne peut pas confisquer.'],
          ],
        },
        {
          titre: 'Ovide et Karen Blixen : partir, écrire',
          axe: 'L’homme, le monde, le destin',
          lecon: {
            titre: 'Lecture croisée des deux œuvres du programme limitatif',
            cours: `Le programme limitatif associe deux livres séparés par dix-neuf siècles : les *Tristes* (livre III) d’Ovide et *La ferme africaine* de Karen Blixen. L’un est chassé par le pouvoir, l’autre part de son plein gré ; tous deux écrivent **parce qu’ils sont loin**.

## Karen Blixen et sa ferme
Karen Blixen (1885-1962), romancière danoise qui signe souvent **Isak Dinesen**, s’installe en 1914 au Kenya, alors possession britannique, pour exploiter une plantation de café au pied des collines de Ngong, près de Nairobi. Dix-sept ans plus tard, tout s’effondre : la ferme fait faillite, son ami Denys Finch Hatton meurt en 1931 dans l’accident de son avion, elle doit vendre et rentrer au Danemark. C’est là, loin de l’Afrique, qu’elle écrit *La ferme africaine* (1937), qui s’ouvre sur une phrase restée célèbre : « J’avais une ferme en Afrique, au pied des collines du Ngong. »

## Deux départs, deux regards
| | Ovide, *Tristes* III | Blixen, *La ferme africaine* |
| Le départ | Imposé : relégation par Auguste | Choisi : une vie nouvelle |
| Le lieu | Tomis, bord de la mer Noire | Les hauts plateaux du Kenya |
| Quand il écrit | Pendant l’exil, au présent | Après le retour, au passé |
| Le regard sur l’autre | Gètes et Sarmates, des « barbares » | Kikuyus, Masaïs, Somalis, observés avec attachement |
| Le ton | La plainte, l’appel à l’aide | La mémoire, la gratitude, le deuil |
| Ce qui est perdu | Rome, la *patria* | La ferme, l’Afrique, un ami |

## Des questions pour l’essai
1. **Écrire pour survivre** : pour Ovide, l’écriture est un lien avec Rome et une arme de plaidoirie ; pour Blixen, elle sauve de l’oubli un monde disparu.
2. **Le regard sur l’étranger** : Ovide finit par se dire lui-même barbare, dans le livre V, parce que personne ne le comprend ; Blixen décrit ses voisins africains comme des personnes, sans échapper tout à fait au regard du colon de son temps. L’essai gagne à le dire avec nuance.
3. **Le destin** : Ovide accuse la colère d’un dieu — Auguste — et sa propre faute ; Blixen accepte les coups du sort avec une sorte de fierté aristocratique.
4. **Le paysage** : l’hiver de Tomis est un argument, la lumière des collines de Ngong un souvenir. Le même motif sert deux intentions.

> Le programme résume l’enjeu ainsi : on part à cause de ce qu’on a écrit, ou l’on écrit parce qu’on est parti. Ovide illustre la première formule, Blixen la seconde — et chacun des deux touche aussi l’autre.

## Méthode : construire un rapprochement
1. Pars d’un **motif commun** précis (l’hiver, la maison perdue, l’animal, la langue de l’autre).
2. Cite une **expression latine** traduite et une phrase de Blixen.
3. Dis ce qui **rapproche**, puis ce qui **sépare** : le contexte (exil forcé, aventure coloniale), l’époque, le genre (élégie, récit autobiographique).
4. Conclus sur ce que la confrontation révèle et qu’aucune des deux œuvres ne dirait seule.`,
          },
          questions: [
            ['Quelle œuvre moderne accompagne les Tristes au programme limitatif ?', ['Mémoires d’Hadrien', 'La ferme africaine', 'L’Étranger', 'Le Désert des Tartares'], 1, 'Le programme 2026-2028 associe Ovide, Tristes III, et Karen Blixen, La ferme africaine.'],
            ['De quelle nationalité est Karen Blixen ?', ['Norvégienne', 'Britannique', 'Danoise', 'Suédoise'], 2, 'Karen Blixen est danoise ; elle signe souvent Isak Dinesen.'],
            ['Où se trouvait la ferme de Karen Blixen ?', ['Au pied des collines de Ngong, au Kenya', 'Au bord du Nil', 'Au Cap', 'Au Sénégal'], 0, 'Sa plantation de café était près de Nairobi, au pied des collines de Ngong.'],
            ['Que cultivait-on sur la ferme de Karen Blixen ?', ['Le thé', 'Le coton', 'La canne à sucre', 'Le café'], 3, 'C’était une plantation de café, qui finit par faire faillite.'],
            ['Karen Blixen écrit La ferme africaine après son retour au Danemark.', ['Vrai', 'Faux'], 0, 'Le livre paraît en 1937, six ans après son départ du Kenya : elle écrit parce qu’elle est partie.'],
            ['Qu’est-ce qui distingue d’abord les deux départs ?', ['Ils ont lieu la même année', 'Ovide part de force, Blixen par choix', 'Blixen est exilée par un roi', 'Ovide part pour cultiver la terre'], 1, 'Ovide est relégué par Auguste ; Blixen choisit de partir pour une vie nouvelle.'],
            ['Quel ami de Karen Blixen meurt en 1931 dans l’accident de son avion ?', ['Farah', 'Bror Blixen', 'Denys Finch Hatton', 'Kamante'], 2, 'La mort de Denys Finch Hatton s’ajoute à la faillite de la ferme et précipite le départ.'],
            ['Ovide écrit les Tristes pendant son exil, au présent de la plainte.', ['Vrai', 'Faux'], 0, 'Les élégies sont envoyées de Tomis ; Blixen, elle, écrit au passé, après le retour.'],
            ['Pour Ovide, à qui s’adresse en dernier ressort le plaidoyer des Tristes ?', ['Au peuple de Tomis', 'À Auguste', 'Aux dieux des Enfers', 'À Virgile'], 1, 'Chaque plainte vise à fléchir Auguste pour obtenir un exil plus doux.'],
            ['Dans un essai, par quoi vaut-il mieux commencer un rapprochement ?', ['Par la biographie complète des auteurs', 'Par un jugement de goût', 'Par un résumé des deux livres', 'Par un motif commun précis'], 3, 'Un motif précis (l’hiver, la maison perdue, la langue) permet de citer, comparer puis nuancer.'],
            ['Que signifie le latin patria ?', ['La terre des pères, la patrie', 'Le patrimoine', 'Le patron', 'La paternité'], 0, 'Patria, dérivé de pater, désigne la terre des pères : pour Ovide, Rome.'],
            ['Quel genre littéraire est La ferme africaine ?', ['Une tragédie', 'Une épopée', 'Un récit autobiographique', 'Un recueil d’élégies'], 2, 'C’est le récit des années kényanes de l’autrice, écrit à la première personne.'],
          ],
        },

        // ===== Croire, savoir, douter =======================================
        {
          titre: 'Magie à Rome : tablettes d’exécration et sorcières',
          axe: 'Croire, savoir, douter',
          lecon: {
            titre: 'Dominer la nature par le rite secret',
            cours: `La magie, pour les Anciens, c’est l’art d’obtenir par des rites secrets ce que la religion demande ouvertement aux dieux : faire aimer, faire souffrir, faire gagner, faire taire. Rome la redoute, la condamne… et la pratique.

## Ce que disent les objets
Les **tablettes d’exécration** (*tabellae defixionum*) sont des lames de plomb gravées de malédictions, roulées, percées d’un clou et jetées dans une tombe, un puits ou une source. Le verbe *defigere*, « clouer, fixer », dit leur but : **immobiliser** l’adversaire. On en a retrouvé des centaines, visant un rival en amour, un voleur, un avocat adverse ou l’aurige de l’écurie concurrente au cirque. Elles prouvent que la magie n’est pas qu’un motif littéraire : c’est une pratique ordinaire.

| Support | Ce qu’il vise | Exemple |
| Tablette de plomb | Lier, faire échouer | Un aurige du cirque |
| Amulette | Protéger | La *bulla* portée par les enfants |
| Poupée percée | Envoûter | Figurine d’argile ou de cire |
| Philtre | Faire aimer | Mélange d’herbes et d’incantations |

## La loi contre la magie
Dès la **loi des Douze Tables** (milieu du Ve siècle av. J.-C.), Rome punit celui qui attire par ses chants les récoltes du voisin dans son champ. Pline l’Ancien, au livre XXX de l’*Histoire naturelle*, qualifie la magie de plus trompeuse des pratiques. Au IIe siècle ap. J.-C., **Apulée** est accusé de magie pour avoir épousé une riche veuve, Pudentilla ; son discours de défense, l’*Apologie*, est un document unique.

## Les sorcières de la littérature
1. **Canidia**, chez Horace (*Épodes* V, *Satires* I, 8) : elle déterre des os, invoque la Nuit et Diane, prépare un philtre avec la moelle d’un enfant.
2. **Médée**, chez Ovide (*Métamorphoses* VII) : elle rajeunit le vieil Éson en remplaçant son sang par un breuvage d’herbes.
3. **Érichtho**, chez Lucain (*Pharsale* VI) : sorcière de Thessalie, elle ranime un cadavre pour qu’il prédise l’issue de la guerre civile.
4. **Pamphile**, chez Apulée (*Métamorphoses*, dites *L’Âne d’or*) : en volant son onguent, le jeune Lucius se change par erreur en âne ; il ne retrouvera forme humaine que grâce à Isis, en mangeant des roses.

> La Thessalie est, pour les Romains, la patrie des sorcières : on disait qu’elles savaient **faire descendre la Lune** du ciel.

## Magie et religion : où passe la frontière ?
| Religion (*religio*) | Magie (*magia*) |
| Publique, au grand jour | Secrète, souvent de nuit |
| Demande aux dieux : *do ut des*, « je donne pour que tu donnes » | Prétend les contraindre par la formule exacte |
| Rites de la cité | Intérêt privé, souvent contre autrui |

Le mot *magus* vient du perse, par le grec : il désignait d’abord les prêtres des Perses. Le mot dit déjà que la magie, c’est la religion **des autres**.`,
          },
          questions: [
            ['Que signifie le verbe defigere, qui a donné les « défixions » ?', ['Clouer, fixer', 'Brûler', 'Chanter', 'Défaire'], 0, 'La tablette « cloue » l’adversaire pour l’immobiliser ; on la perçait d’ailleurs d’un clou.'],
            ['Sur quel matériau les tablettes d’exécration sont-elles le plus souvent gravées ?', ['L’or', 'Le plomb', 'Le marbre', 'Le papyrus'], 1, 'Le plomb, métal lourd et froid associé aux Enfers, était roulé puis jeté dans une tombe ou un puits.'],
            ['Quel auteur a été accusé de magie et a écrit sa défense, l’Apologie ?', ['Cicéron', 'Horace', 'Apulée', 'Tacite'], 2, 'Apulée fut accusé d’avoir séduit par magie la riche veuve Pudentilla.'],
            ['Dans L’Âne d’or, grâce à quelle déesse Lucius redevient-il homme ?', ['Vénus', 'Diane', 'Hécate', 'Isis'], 3, 'Au livre XI, Isis lui fait manger des roses : Lucius retrouve forme humaine et devient son initié.'],
            ['La loi des Douze Tables punissait déjà certaines pratiques magiques.', ['Vrai', 'Faux'], 0, 'Elle punissait celui qui attirait par des chants les récoltes d’autrui dans son champ.'],
            ['Quelle sorcière apparaît chez Horace ?', ['Érichtho', 'Canidia', 'Pamphile', 'Circé'], 1, 'Canidia, dans les Épodes et les Satires, prépare des philtres macabres.'],
            ['Chez Lucain, que fait Érichtho ?', ['Elle ranime un cadavre pour qu’il prédise l’avenir', 'Elle change des hommes en porcs', 'Elle rajeunit Éson', 'Elle fait gagner un aurige'], 0, 'Dans la Pharsale, la sorcière thessalienne interroge un mort sur l’issue de la guerre civile.'],
            ['Quelle région passait pour la patrie des sorcières ?', ['La Sicile', 'L’Égypte', 'La Gaule', 'La Thessalie'], 3, 'On disait que les Thessaliennes savaient faire descendre la Lune du ciel.'],
            ['Que résume la formule do ut des ?', ['La contrainte magique', 'L’échange avec les dieux : je donne pour que tu donnes', 'La loi du talion', 'La prière des morts'], 1, 'La religion romaine est un contrat : on offre pour obtenir ; la magie prétend contraindre.'],
            ['La magie se distingue de la religion notamment par son caractère secret et privé.', ['Vrai', 'Faux'], 0, 'La religion est publique et civique ; la magie agit dans l’ombre, souvent contre autrui.'],
            ['D’où vient le mot magus ?', ['Du latin magnus, grand', 'De l’étrusque', 'Du perse, par le grec', 'De l’hébreu'], 2, 'Les mages étaient les prêtres des Perses : la magie, c’est d’abord la religion des autres.'],
            ['Dans les Métamorphoses d’Ovide, qui Médée rajeunit-elle ?', ['Jason', 'Éson, le père de Jason', 'Pélias', 'Égée'], 1, 'Elle remplace le sang du vieil Éson par un breuvage d’herbes magiques.'],
          ],
        },
        {
          titre: 'Lucrèce et Cicéron : la raison contre la crainte des dieux',
          axe: 'Croire, savoir, douter',
          lecon: {
            titre: 'Naissance de la pensée rationnelle à Rome',
            cours: `Au Ier siècle avant J.-C., deux Romains s’attaquent, chacun à sa manière, à la peur superstitieuse : Lucrèce en poète épicurien, Cicéron en avocat qui pèse le pour et le contre.

## Lucrèce, le poème de la nature
Du poète Lucrèce (vers 98 – vers 55 av. J.-C.), on ne sait presque rien, sinon son grand poème en six livres, le *De rerum natura*, « De la nature des choses ». Il y expose en vers la physique d’**Épicure** pour délivrer les hommes de deux terreurs : la peur des dieux et la peur de la mort.

| Principe | En latin | Ce qu’il veut dire |
| Rien ne naît de rien | *nullam rem e nihilo gigni divinitus umquam* | Aucun dieu ne crée à partir du néant |
| Tout est fait d’atomes et de vide | *primordia*, *semina rerum*, *inane* | Les « semences des choses » bougent dans le vide |
| La déviation | *clinamen* | Un écart minime des atomes rend possibles les rencontres… et la liberté |
| L’âme est mortelle | *anima*, *animus* | Faite d’atomes, elle se disperse à la mort |
| La mort n’est rien | *nil igitur mors est ad nos* | Là où elle est, nous ne sommes plus |

Au livre I, Lucrèce raconte le sacrifice d’Iphigénie, immolée par son père pour obtenir des vents favorables, et conclut : *Tantum religio potuit suadere malorum !* — « Tant la religion a pu conseiller de crimes ! » Pour lui, *religio* désigne ici la crainte superstitieuse, pas la piété sereine.

> Le paradoxe de Lucrèce : il ne nie pas l’existence des dieux, il leur retire tout pouvoir sur nous. Ils vivent heureux, loin du monde, et **ne s’occupent pas des hommes**.

## Cicéron, le doute méthodique
Cicéron (106-43 av. J.-C.) est lui-même **augure**, membre du collège qui prend les auspices. Pourtant, dans le *De divinatione* (44 av. J.-C.), il fait parler son frère Quintus pour la divination au livre I, puis la réfute lui-même au livre II. Il y rapporte le mot de Caton l’Ancien : il s’étonnait qu’un haruspice pût croiser un autre haruspice sans éclater de rire.

Sa position est celle de la **Nouvelle Académie** : chercher le plus probable, suspendre son jugement quand on ne sait pas. Il distingue la *religio*, culte des ancêtres utile à la cité, de la *superstitio*, peur excessive qui asservit l’esprit.

## Religio et superstitio
| Mot | Sens chez Cicéron | Étymologie proposée |
| *religio* | Scrupule, culte réglé des dieux | *relegere*, « relire avec soin » (Cicéron) ; *religare*, « relier » (Lactance, auteur chrétien) |
| *superstitio* | Crainte excessive, crédulité | Selon Cicéron, ceux qui priaient pour que leurs enfants leur « survivent » (*superstites*) |

## Méthode : repérer un raisonnement dans un texte latin
1. Cherche les **connecteurs** : *nam*, *enim* (car), *igitur*, *ergo* (donc), *sed*, *at* (mais), *autem* (or).
2. Repère les **interrogations oratoires** (*nonne…?*) qui attendent un oui évident.
3. Distingue ce que l’auteur **rapporte** (proposition infinitive, style indirect) de ce qu’il **affirme**.`,
          },
          questions: [
            ['Quel philosophe grec Lucrèce met-il en vers ?', ['Platon', 'Épicure', 'Zénon', 'Aristote'], 1, 'Le De rerum natura expose la physique et la morale d’Épicure.'],
            ['Comment Lucrèce appelle-t-il la légère déviation des atomes ?', ['L’inane', 'Le fatum', 'Le clinamen', 'L’animus'], 2, 'Le clinamen permet aux atomes de se rencontrer et fonde la liberté humaine.'],
            ['Que signifie « Tantum religio potuit suadere malorum » ?', ['Tant la religion a pu conseiller de crimes', 'La religion a vaincu tant de maux', 'Tant de malheurs ont suscité la religion', 'La religion ne peut rien contre le mal'], 0, 'Lucrèce commente le sacrifice d’Iphigénie : la crainte superstitieuse mène au crime.'],
            ['Selon Lucrèce, les dieux interviennent sans cesse dans la vie des hommes.', ['Vrai', 'Faux'], 1, 'Ils existent mais vivent heureux, loin du monde, sans s’occuper des hommes.'],
            ['Quel est le principe « nullam rem e nihilo gigni » ?', ['Tout naît de l’eau', 'Tout vient des dieux', 'Rien ne meurt', 'Rien ne naît de rien'], 3, 'Aucune chose ne naît du néant, même par la volonté divine : tout vient d’atomes préexistants.'],
            ['Quelle fonction religieuse Cicéron exerçait-il ?', ['Pontife', 'Flamine', 'Haruspice', 'Augure'], 3, 'Cicéron était augure, ce qui rend d’autant plus piquante sa critique de la divination.'],
            ['Dans quelle œuvre Cicéron discute-t-il de la valeur de la divination ?', ['Le De divinatione', 'Les Catilinaires', 'Le De oratore', 'Les Verrines'], 0, 'Au livre I, Quintus la défend ; au livre II, Cicéron la réfute.'],
            ['D’après Cicéron, de quoi Caton s’étonnait-il ?', ['Qu’un augure pût se tromper', 'Qu’un haruspice pût en croiser un autre sans rire', 'Que les dieux parlent aux oiseaux', 'Que le Sénat consulte les Sibylles'], 1, 'Le mot de Caton suggère que les haruspices eux-mêmes ne croyaient pas à leur art.'],
            ['Chez Cicéron, que désigne superstitio ?', ['Le culte des ancêtres', 'La piété filiale', 'Une crainte excessive et crédule', 'Le respect des lois'], 2, 'La superstitio asservit l’esprit ; la religio est un culte réglé, utile à la cité.'],
            ['Pour Lucrèce, l’âme est mortelle.', ['Vrai', 'Faux'], 0, 'Faite d’atomes, elle se disperse à la mort : il n’y a donc rien à craindre après.'],
            ['Quel connecteur latin signifie « donc » ?', ['Igitur', 'Sed', 'Nam', 'Autem'], 0, 'Igitur et ergo introduisent une conclusion ; nam et enim une explication.'],
            ['À quelle école appartient Cicéron quand il suspend son jugement ?', ['Au Portique', 'Au Jardin', 'À la Nouvelle Académie', 'Au Lycée'], 2, 'La Nouvelle Académie cherche le plus probable sans prétendre à la certitude.'],
          ],
        },
        {
          titre: 'Des dieux de Rome au Dieu des chrétiens',
          axe: 'Croire, savoir, douter',
          lecon: {
            titre: 'Polythéismes et monothéismes',
            cours: `En quatre siècles, l’Empire romain passe d’une religion de la cité, aux dieux innombrables, à une religion universelle, au Dieu unique. Ce basculement est l’un des plus grands tournants de l’histoire européenne.

## La religion de la cité
La religion romaine traditionnelle n’est ni un dogme ni une croyance intime : c’est un **ensemble de rites** qui garantissent la *pax deorum*. On y trouve la triade du Capitole (Jupiter, Junon, Minerve), Vesta et ses vestales gardiennes du feu, et, à la maison, les **Lares** et les **Pénates**. La vertu attendue est la *pietas* : le devoir envers les dieux, la patrie et la famille.

## Les cultes à mystères
Venus d’Orient, ils offrent ce que la religion civique ne promet pas : une **initiation personnelle** et un salut.
| Culte | Origine | Ce qu’il promet |
| Cybèle, la *Magna Mater* | Phrygie, introduite à Rome en 204 av. J.-C. | Renaissance, fécondité |
| Isis | Égypte | Protection, salut après la mort |
| Mithra | Perse | Culte masculin des soldats, dans des grottes : le dieu tue un taureau |
| Bacchus | Grèce | L’extase ; le Sénat réprime les Bacchanales en 186 av. J.-C. |

## Les chrétiens, un problème pour Rome
Rome tolère tous les dieux… pourvu qu’on honore aussi ceux de la cité et l’empereur. Les chrétiens refusent : leur Dieu est **unique et exclusif**.
@ 64 ap. J.-C. — après l’incendie de Rome, Néron accuse les chrétiens. Tacite (*Annales* XV, 44) rapporte que le Christ avait été supplicié sous Tibère par le procurateur Ponce Pilate.
@ Vers 112 — **Pline le Jeune**, gouverneur de Bithynie, écrit à Trajan (*Lettres* X, 96) : les chrétiens se réunissent avant l’aube et chantent un hymne *Christo quasi deo*, « au Christ comme à un dieu ». Trajan répond qu’il ne faut pas les rechercher, mais punir ceux qui, dénoncés, refusent de sacrifier.
@ 303 — grande persécution de Dioclétien.
@ 312-313 — Constantin, vainqueur au pont Milvius, accorde avec Licinius la liberté de culte (dite « édit de Milan »).
@ 380 — l’édit de Thessalonique de Théodose fait du christianisme la religion de l’Empire ; les cultes païens sont interdits en 391-392.

> Le christianisme ne naît pas contre la culture antique : il s’écrit en grec, puis en latin, avec les outils de la rhétorique et de la philosophie. **Augustin** a été professeur de rhétorique avant de devenir évêque.

## Les grands textes chrétiens latins
| Auteur | Œuvre | Ce qu’elle apporte |
| Tertullien (vers 200) | *Apologétique* | Défense des chrétiens devant les magistrats |
| Jérôme (fin IVe siècle) | La *Vulgate* | Traduction latine de la Bible, lue pendant plus de mille ans |
| Augustin (354-430) | *Confessions*, *La Cité de Dieu* | Après le sac de Rome par Alaric en 410, il distingue la cité terrestre et la cité de Dieu |

## Des mots qui ont changé de sens
*Paganus*, le « paysan », finit par désigner le **païen** : les campagnes restèrent longtemps fidèles aux anciens dieux. *Fides*, la bonne foi du contrat, devient la **foi** chrétienne.`,
          },
          questions: [
            ['Quelle est la vertu romaine du devoir envers les dieux, la patrie et la famille ?', ['La virtus', 'La pietas', 'La clementia', 'La gravitas'], 1, 'La pietas règle les devoirs envers les dieux, la patrie et les parents ; c’est la vertu d’Énée.'],
            ['Quels dieux protègent la maison romaine ?', ['Les Lares et les Pénates', 'Les Parques', 'Les Muses', 'Les Titans'], 0, 'Les Lares et les Pénates veillent sur le foyer et les provisions de la famille.'],
            ['De quel pays vient le culte de Mithra ?', ['L’Égypte', 'La Phrygie', 'La Perse', 'La Grèce'], 2, 'Mithra, dieu perse, est honoré dans des grottes, surtout par les soldats.'],
            ['Quel empereur accuse les chrétiens après l’incendie de Rome en 64 ?', ['Trajan', 'Auguste', 'Constantin', 'Néron'], 3, 'Tacite rapporte que Néron fit des chrétiens les boucs émissaires de l’incendie.'],
            ['Que demande Pline le Jeune à Trajan dans sa lettre X, 96 ?', ['Comment traiter les chrétiens de sa province', 'S’il faut construire un temple', 'De lever une armée', 'De libérer des esclaves'], 0, 'Gouverneur de Bithynie, Pline ne sait pas comment procéder contre les chrétiens dénoncés.'],
            ['Trajan ordonne de rechercher activement les chrétiens.', ['Vrai', 'Faux'], 1, 'Il répond qu’il ne faut pas les rechercher, mais punir ceux qui, dénoncés, refusent de sacrifier.'],
            ['En quelle année l’édit de Thessalonique fait-il du christianisme la religion de l’Empire ?', ['313', '64', '410', '380'], 3, 'En 380, Théodose impose le christianisme ; les cultes païens sont interdits en 391-392.'],
            ['Qu’est-ce que la Vulgate ?', ['Un recueil de lois', 'La traduction latine de la Bible par Jérôme', 'Un poème de Virgile', 'Un édit de Constantin'], 1, 'Jérôme traduit la Bible en latin à la fin du IVe siècle ; elle sera lue pendant plus de mille ans.'],
            ['Quel événement pousse Augustin à écrire La Cité de Dieu ?', ['La mort de Constantin', 'La prise de Jérusalem', 'Le sac de Rome par Alaric en 410', 'La chute de Carthage'], 2, 'Les païens accusaient les chrétiens d’avoir causé le désastre ; Augustin leur répond.'],
            ['D’où vient le mot « païen » ?', ['De paganus, le paysan', 'De pax, la paix', 'De pagina, la page', 'De Pan, le dieu'], 0, 'Les campagnes restèrent longtemps fidèles aux anciens dieux : le paysan devint le païen.'],
            ['Le Sénat a réprimé les Bacchanales en 186 av. J.-C.', ['Vrai', 'Faux'], 0, 'Le sénatus-consulte des Bacchanales encadre sévèrement ce culte jugé dangereux pour l’ordre.'],
            ['Quelle déesse phrygienne est introduite à Rome en 204 av. J.-C. ?', ['Isis', 'Minerve', 'Vesta', 'Cybèle, la Magna Mater'], 3, 'Pendant la guerre contre Hannibal, Rome fait venir la Grande Mère de Phrygie.'],
          ],
        },

        // ===== Enseignement optionnel ======================================
        {
          titre: 'Sénèque et Horace : leçons de sagesse latine',
          axe: 'Leçons de sagesse antique',
          lecon: {
            titre: 'Comment diriger sa vie, affronter la mort, être heureux',
            cours: `Pour les Romains, la philosophie n’est pas une théorie : c’est un **art de vivre**. Deux auteurs le montrent mieux que tous : Sénèque, qui dirige la conscience d’un ami, et Horace, qui cueille le jour.

## Deux écoles, deux chemins vers le bonheur
| | Stoïcisme | Épicurisme |
| Fondateur | Zénon de Citium, à Athènes (vers 300 av. J.-C.) | Épicure, à Athènes (IVe-IIIe siècle av. J.-C.) |
| Le bonheur | La vertu, vivre selon la raison et la nature | Le plaisir compris comme absence de trouble (*ataraxie*) |
| Face au destin | L’accepter : il est rationnel | Il n’existe pas : les atomes et le hasard |
| Face à la cité | S’engager, servir | Vivre caché, entre amis |
| Auteur latin | Sénèque | Lucrèce (Horace s’en inspire souvent) |

## Sénèque, directeur de conscience
Dans les *Lettres à Lucilius*, 124 lettres écrites à la fin de sa vie, Sénèque guide un ami pas à pas. La première s’ouvre sur un impératif : *Vindica te tibi*, « Revendique-toi pour toi-même », c’est-à-dire reprends possession de ton temps. Et plus loin : *Omnia, Lucili, aliena sunt, tempus tantum nostrum est* — « Tout, Lucilius, nous est étranger : seul le temps est à nous. »
Dans *De la brièveté de la vie*, il ajoute : nous n’avons pas peu de temps, **nous en perdons beaucoup**.

Sénèque a vécu ses principes jusqu’au bout : accusé d’avoir trempé dans la conjuration de Pison, il reçoit de Néron l’ordre de mourir en 65 et s’ouvre les veines en consolant ses proches.

## Horace, le poète du juste milieu
Horace (65-8 av. J.-C.), fils d’affranchi devenu ami de Mécène, résume en quelques mots une sagesse souriante :
1. *Carpe diem, quam minimum credula postero* (*Odes* I, 11) : « Cueille le jour, sans te fier le moins du monde au lendemain. » *Carpere*, c’est cueillir un fruit mûr : il ne s’agit pas de s’étourdir, mais de goûter le présent.
2. *Aurea mediocritas* (*Odes* II, 10) : le « juste milieu d’or », entre la pauvreté et le luxe.
3. *Non omnis moriar* (*Odes* III, 30) : « je ne mourrai pas tout entier », grâce à l’œuvre.

> Stoïciens et épicuriens se disputent sur presque tout, mais s’accordent sur un point : le sage ne dépend ni de la fortune ni de l’opinion des autres.

## Regarder la mort en face
| Auteur | Ce qu’il dit de la mort |
| Lucrèce | *Nil igitur mors est ad nos* : la mort n’est rien pour nous |
| Sénèque | S’y préparer chaque jour, c’est apprendre à vivre libre |
| Cicéron (*De senectute*) | La vieillesse n’est pas un malheur pour qui a bien vécu |

## Exemple travaillé : carpe diem
*Carpe* est l’impératif présent de *carpo*, « cueillir » ; *diem* l’accusatif de *dies*, le jour. *Credula* s’accorde avec le « tu » féminin (Horace s’adresse à Leuconoé), et *postero* est au datif : « crédule envers le lendemain ». Traduction : **« Cueille le jour, et fie-toi le moins possible au lendemain. »**`,
          },
          questions: [
            ['Que signifie « Vindica te tibi » ?', ['Venge-toi', 'Reprends possession de toi-même', 'Connais-toi toi-même', 'Donne-toi aux autres'], 1, 'Sénèque invite Lucilius à se revendiquer, c’est-à-dire à reprendre possession de son temps.'],
            ['Selon Sénèque, quelle est la seule chose qui nous appartient vraiment ?', ['Le temps', 'La fortune', 'Le corps', 'La gloire'], 0, '« Tempus tantum nostrum est » : seul le temps est à nous.'],
            ['À qui Sénèque adresse-t-il ses 124 lettres ?', ['À Néron', 'À Lucilius', 'À Atticus', 'À Mécène'], 1, 'Les Lettres à Lucilius guident un ami sur le chemin de la sagesse stoïcienne.'],
            ['Pour les épicuriens, le bonheur réside dans l’absence de trouble.', ['Vrai', 'Faux'], 0, 'C’est l’ataraxie : le plaisir épicurien est avant tout tranquillité de l’âme.'],
            ['Que signifie carpere dans « carpe diem » ?', ['Profiter sans limite', 'Oublier', 'Cueillir', 'Compter'], 2, 'Carpere, c’est cueillir un fruit mûr : goûter le présent, non s’étourdir.'],
            ['Que désigne l’aurea mediocritas d’Horace ?', ['La médiocrité', 'La richesse', 'La pauvreté volontaire', 'Le juste milieu'], 3, 'Le « juste milieu d’or » évite à la fois la misère et l’excès du luxe.'],
            ['Qui a fondé le stoïcisme ?', ['Épicure', 'Diogène', 'Zénon de Citium', 'Pythagore'], 2, 'Zénon de Citium enseignait sous le Portique peint (stoa) d’Athènes, vers 300 av. J.-C.'],
            ['Comment Sénèque meurt-il ?', ['Au combat', 'Sur ordre de Néron, en s’ouvrant les veines', 'Empoisonné par Agrippine', 'De vieillesse en exil'], 1, 'Accusé d’avoir participé à la conjuration de Pison, il reçoit l’ordre de mourir en 65.'],
            ['Que veut dire « Non omnis moriar » ?', ['Je ne mourrai pas tout entier', 'Nul n’échappe à la mort', 'Je ne veux pas mourir', 'Tous mourront'], 0, 'Horace compte survivre par son œuvre, « monument plus durable que l’airain ».'],
            ['Les stoïciens conseillent de vivre caché, loin de la cité.', ['Vrai', 'Faux'], 1, 'C’est la règle épicurienne ; les stoïciens appellent au contraire à servir la cité.'],
            ['Dans « carpe diem », à quel cas est diem ?', ['Nominatif', 'Datif', 'Ablatif', 'Accusatif'], 3, 'Diem est l’accusatif de dies, complément d’objet de carpe.'],
            ['Selon Sénèque, dans De la brièveté de la vie, quel est notre vrai problème ?', ['Nous avons trop peu de temps', 'Nous perdons beaucoup de temps', 'Les dieux nous volent le temps', 'Le temps n’existe pas'], 1, 'Nous n’avons pas peu de temps, nous en perdons beaucoup : la vie est longue si l’on sait l’employer.'],
          ],
        },
        {
          titre: 'Pline et le Vésuve : observer la nature',
          axe: 'Comprendre le monde',
          lecon: {
            titre: 'Savoir encyclopédique et catastrophes naturelles',
            cours: `Les Romains ont voulu comprendre le monde en le **recensant**. Leur plus grand monument de savoir est l’œuvre d’un homme mort en observant de trop près un volcan.

## Pline l’Ancien, l’encyclopédiste
Pline l’Ancien (23-79 ap. J.-C.), officier et haut fonctionnaire, consacre ses nuits à lire et à prendre des notes. Son *Histoire naturelle*, en **37 livres** dédiés au futur empereur Titus, embrasse tout : astronomie, géographie, hommes, animaux, plantes, remèdes, métaux et pierres, arts. Il dit avoir rassemblé vingt mille faits tirés de deux mille volumes.

| Livres | Contenu |
| II | Le monde, les astres, les phénomènes du ciel |
| III-VI | Géographie de l’univers connu |
| VII | L’homme |
| VIII-XI | Les animaux |
| XII-XXXII | Les plantes et les remèdes |
| XXXIII-XXXVII | Métaux, peinture, sculpture, pierres précieuses |

Pline mêle observation, compilation et récits merveilleux : il décrit les peuples fabuleux des confins de la terre avec le même sérieux que la culture de la vigne. C’est un savoir qui **accumule** plus qu’il ne vérifie.

## L’éruption de 79
En 79, Pline commande la flotte de Misène, dans la baie de Naples. Le Vésuve entre en éruption. Son neveu, **Pline le Jeune**, raconte la suite dans deux lettres à l’historien Tacite (*Lettres* VI, 16 et VI, 20) :
1. Un nuage immense s’élève, dont la forme évoque un **pin parasol** : un tronc très haut, puis des branches.
2. Pline l’Ancien fait armer des navires pour secourir les habitants et observer le phénomène.
3. À Stabies, sous la pluie de cendres et de pierres, il meurt, sans doute asphyxié.
4. Pompéi et Herculanum sont ensevelies.

> Les volcanologues parlent aujourd’hui d’**éruption plinienne** : le nom de Pline est resté à ce type d’éruption, celle qui projette une colonne verticale géante.

## Sénèque et les Questions naturelles
Sénèque, dans ses *Questions naturelles*, cherche les causes des séismes, des vents, des comètes ou des crues du Nil. Il évoque le tremblement de terre qui frappa la Campanie en 62 ou 63. Sa conviction : comprendre la nature délivre de la peur, car l’âme qui connaît les causes cesse de trembler.

## La médecine romaine
Les Romains doivent leur médecine aux Grecs : **Galien** (IIe siècle), médecin de Pergame installé à Rome, écrit en grec et reprend la théorie des quatre humeurs d’Hippocrate. En latin, **Celse** (Ier siècle) rédige un traité *De medicina* d’une grande clarté.

## Mots latins du savoir
| Latin | Sens | Héritier français |
| *natura* (de *nasci*, naître) | Ce qui fait naître et croître | nature, naturel |
| *mundus* | Le monde ordonné, mais aussi la parure | monde, mondain |
| *orbis terrarum* | Le cercle des terres, le monde habité | orbite |
| *caelum* | Le ciel | céleste |
| *scientia* | La connaissance | science |`,
          },
          questions: [
            ['Combien de livres compte l’Histoire naturelle de Pline l’Ancien ?', ['12', '37', '6', '142'], 1, 'Pline couvre en 37 livres tout le savoir de son temps, du ciel aux pierres précieuses.'],
            ['À quel futur empereur l’Histoire naturelle est-elle dédiée ?', ['Titus', 'Néron', 'Hadrien', 'Auguste'], 0, 'Pline dédie son œuvre à Titus, fils de Vespasien.'],
            ['Qui raconte la mort de Pline l’Ancien ?', ['Tacite', 'Suétone', 'Pline le Jeune, son neveu', 'Sénèque'], 2, 'Pline le Jeune écrit deux lettres à Tacite sur l’éruption et la mort de son oncle.'],
            ['À quoi Pline le Jeune compare-t-il le nuage du Vésuve ?', ['À une tour', 'À un champignon', 'À une vague', 'À un pin parasol'], 3, 'Un tronc très haut, puis des branches : c’est l’image du pin parasol.'],
            ['En quelle année le Vésuve ensevelit-il Pompéi ?', ['79', '64', '44', '410'], 0, 'L’éruption de 79 ensevelit Pompéi, Herculanum et Stabies.'],
            ['Pline l’Ancien meurt en tentant de secourir des habitants et d’observer l’éruption.', ['Vrai', 'Faux'], 0, 'Commandant de la flotte de Misène, il se porte au secours des habitants et meurt à Stabies.'],
            ['Qu’appelle-t-on une éruption plinienne ?', ['Une coulée de lave lente', 'Une éruption à colonne verticale géante', 'Un séisme sous-marin', 'Une éruption sans cendres'], 1, 'Le nom de Pline est resté à ce type d’éruption explosive décrit par son neveu.'],
            ['Quelle œuvre de Sénèque cherche les causes des séismes et des comètes ?', ['Les Lettres à Lucilius', 'La Médée', 'Les Questions naturelles', 'De la colère'], 2, 'Pour Sénèque, connaître les causes délivre l’âme de la peur.'],
            ['Galien, médecin de Rome, écrivait en latin.', ['Vrai', 'Faux'], 1, 'Galien, né à Pergame, écrivait en grec : la médecine savante de Rome restait grecque.'],
            ['De quel verbe vient natura ?', ['Nare, nager', 'Nasci, naître', 'Narrare, raconter', 'Nectere, lier'], 1, 'La nature, c’est ce qui fait naître et croître.'],
            ['Que désigne l’expression orbis terrarum ?', ['Le monde habité, le cercle des terres', 'L’orbite de la Lune', 'Le ciel étoilé', 'Les Enfers'], 0, 'L’orbis terrarum est l’ensemble des terres connues, disposées en cercle autour de la Méditerranée.'],
            ['Qui a rédigé en latin un traité De medicina au Ier siècle ?', ['Galien', 'Hippocrate', 'Vitruve', 'Celse'], 3, 'Celse est l’auteur du grand traité latin de médecine, remarquable par sa clarté.'],
          ],
        },
        {
          titre: 'Vitruve, Dédale, Pygmalion : l’homo faber romain',
          axe: 'Inventer, créer, fabriquer, produire',
          lecon: {
            titre: 'Techniques, machines et mythes d’artistes',
            cours: `Rome n’a pas inventé la philosophie, mais elle a bâti comme personne. Ses ingénieurs ont laissé des ponts encore debout ; ses poètes, des mythes d’artistes qui hantent encore notre imaginaire technique.

## Vitruve, l’architecte d’Auguste
Vitruve dédie à Auguste son *De architectura* en **dix livres**, le seul traité d’architecture antique conservé. Il y pose trois exigences restées classiques :
| Latin | Sens | Exemple |
| *firmitas* | La solidité | Des fondations jusqu’au sol dur |
| *utilitas* | L’utilité, la commodité | Un bâtiment adapté à son usage |
| *venustas* | La beauté (de *Venus*) | Des proportions harmonieuses |

Il décrit aussi les proportions du corps humain, inscrit dans un cercle et un carré. Quinze siècles plus tard, **Léonard de Vinci** en tire son dessin de l’*Homme de Vitruve*. Le livre X traite des **machines** : grues, pompes, roues hydrauliques, machines de guerre.

## Les grandes réalisations
1. **Les aqueducs** : l’eau vient de loin, par la seule pente. Le **pont du Gard**, au Ier siècle, porte l’aqueduc de Nîmes au-dessus du Gardon. À Rome, **Frontin**, *curator aquarum* à la fin du Ier siècle, écrit un traité sur l’alimentation en eau de la ville.
2. **Le béton romain** (*opus caementicium*) : chaux, eau, cailloux et cendre volcanique, qui durcit même sous l’eau.
3. **La coupole du Panthéon**, reconstruit sous Hadrien : plus de 43 mètres de diamètre, percée d’un oculus, jamais dépassée en béton non armé.
4. **Les voies** : la *via Appia*, commencée en 312 av. J.-C., relie Rome au sud de l’Italie.

## Les mythes de l’artiste chez Ovide
| Mythe | *Métamorphoses* | Ce qu’il dit de la technique |
| **Dédale et Icare** | Livre VIII | L’inventeur fabrique des ailes de plumes et de cire ; son fils vole trop près du soleil et tombe |
| **Pygmalion** | Livre X | Le sculpteur tombe amoureux de sa statue d’ivoire, que Vénus rend vivante |
| **Arachné** | Livre VI | La tisserande défie Minerve et devient araignée |

Dédale conseille à son fils : *medio ut limite curras*, « tiens-toi dans la voie du milieu ». Icare désobéit : la technique n’est pas en cause, c’est l’**ivresse** de celui qui s’en sert.
De Pygmalion, Ovide dit : *ars adeo latet arte sua*, « tant l’art se cache par son art même » — la statue est si parfaite qu’on la croirait vivante.

> Pygmalion est l’ancêtre de tous les récits de créatures qui s’animent, de Pinocchio aux robots humanoïdes. Dédale, celui de l’ingénieur que dépasse son invention.

## Ars et technè
Le latin *ars*, comme le grec *technè*, désigne à la fois le **savoir-faire** de l’artisan et l’œuvre de l’artiste : les Anciens ne séparaient pas les deux. De *ars* viennent « art », « artisan », « artifice » ; de *technè*, « technique » et « technologie » ; de *machina*, emprunté au grec, « machine » et « machination ».`,
          },
          questions: [
            ['Quelles sont les trois exigences de l’architecture selon Vitruve ?', ['Firmitas, utilitas, venustas', 'Pietas, virtus, fides', 'Ordo, forma, color', 'Aqua, terra, ignis'], 0, 'Solidité, utilité, beauté : la triade vitruvienne reste une référence des architectes.'],
            ['Quel artiste de la Renaissance a dessiné l’Homme de Vitruve ?', ['Michel-Ange', 'Raphaël', 'Botticelli', 'Léonard de Vinci'], 3, 'Léonard inscrit le corps humain dans un cercle et un carré, d’après les proportions de Vitruve.'],
            ['Que porte le pont du Gard ?', ['Une route impériale', 'L’aqueduc de Nîmes', 'Un temple', 'Un rempart'], 1, 'Construit au Ier siècle, il fait franchir le Gardon à l’aqueduc qui alimentait Nîmes.'],
            ['Le béton romain pouvait durcir même sous l’eau.', ['Vrai', 'Faux'], 0, 'Grâce à la cendre volcanique, l’opus caementicium prenait même dans l’eau.'],
            ['Quel monument romain possède une coupole de plus de 43 mètres percée d’un oculus ?', ['Le Colisée', 'La Maison carrée', 'Le Panthéon', 'Le Circus Maximus'], 2, 'La coupole du Panthéon, reconstruit sous Hadrien, reste la plus grande en béton non armé.'],
            ['Quel conseil Dédale donne-t-il à Icare ?', ['Voler le plus haut possible', 'Se tenir dans la voie du milieu', 'Suivre les oiseaux', 'Ne jamais regarder la mer'], 1, '« Medio ut limite curras » : ni trop près du soleil, ni trop près de la mer.'],
            ['Quelle déesse rend vivante la statue de Pygmalion ?', ['Minerve', 'Junon', 'Diane', 'Vénus'], 3, 'Touchée par la prière du sculpteur, Vénus anime la statue d’ivoire.'],
            ['Que signifie « ars adeo latet arte sua » ?', ['L’art est inutile', 'Tant l’art se cache par son art même', 'L’art est un mensonge', 'L’artiste se cache'], 1, 'La perfection de la statue fait oublier qu’elle est fabriquée.'],
            ['Qui a écrit un traité sur l’alimentation en eau de Rome ?', ['Frontin', 'Vitruve', 'Pline l’Ancien', 'Caton'], 0, 'Frontin, curator aquarum à la fin du Ier siècle, décrit les aqueducs de la ville.'],
            ['Le De architectura de Vitruve est le seul traité d’architecture antique conservé.', ['Vrai', 'Faux'], 0, 'C’est pourquoi il a tant compté pour les architectes de la Renaissance.'],
            ['Quelle voie, commencée en 312 av. J.-C., relie Rome au sud de l’Italie ?', ['La via Domitia', 'La via Aurelia', 'La via Appia', 'La via Egnatia'], 2, 'La via Appia, « reine des routes », porte le nom du censeur Appius Claudius.'],
            ['Quel mot français ne vient PAS du latin ars ?', ['Artisan', 'Artifice', 'Artiste', 'Technique'], 3, 'Technique vient du grec technè ; art, artisan, artifice et artiste viennent de ars.'],
          ],
        },

        // ===== Méditerranée : présence des mondes antiques =================
        {
          titre: 'Mare nostrum : villes et sites de la Méditerranée romaine',
          axe: 'Méditerranée : présence des mondes antiques',
          lecon: {
            titre: 'Sites, villes, bibliothèques et héritages',
            cours: `Les Romains appelaient la Méditerranée *mare nostrum*, « notre mer ». Au IIe siècle, tous ses rivages appartiennent au même empire, et les villes qu’ils y ont fondées ou transformées sont encore habitées, fouillées ou menacées.

## Les grands sites à situer
| Site | Pays actuel | Ce qu’il faut savoir |
| **Pompéi** et **Herculanum** | Italie | Ensevelies en 79 par le Vésuve ; fouilles depuis le XVIIIe siècle |
| **Carthage** | Tunisie | Rivale de Rome détruite en 146 av. J.-C., refondée en colonie romaine |
| **Leptis Magna** | Libye | Ville natale de l’empereur Septime Sévère, qui l’embellit |
| **Timgad** | Algérie | Colonie fondée sous Trajan vers 100, plan en damier parfait |
| **Éphèse** | Turquie | Bibliothèque de Celsus, au IIe siècle |
| **Palmyre** | Syrie | Carrefour caravanier ; monuments dynamités par l’État islamique en 2015 |
| **Nîmes**, **Arles** | France | Maison carrée, arènes, théâtre : la Gaule romaine |

## La ville romaine, un modèle exporté
Partout, on retrouve la même grammaire urbaine : deux rues principales, le **cardo** (nord-sud) et le **decumanus** (est-ouest), le **forum** à leur croisement, avec la basilique (le tribunal) et le temple ; puis les **thermes**, le **théâtre**, l’**amphithéâtre**, l’aqueduc. Vivre à la romaine, c’est adopter ce décor : c’est ainsi que Rome **romanise** sans toujours contraindre.

## Lieux de culture et figures du savoir
1. **Les bibliothèques publiques** : la première à Rome est ouverte par Asinius Pollion en 39 av. J.-C. ; Auguste en installe une sur le Palatin, Trajan une double bibliothèque, grecque et latine, près de son forum.
2. **La villa des Papyrus** d’Herculanum a livré une bibliothèque de rouleaux carbonisés par l’éruption, surtout de philosophie épicurienne ; on commence à les lire grâce à l’imagerie numérique.
3. **Les écoles** : le fils de bonne famille apprend à lire chez le *litterator*, les auteurs chez le *grammaticus*, l’art de parler chez le *rhetor*. Les plus riches achèvent leurs études à Athènes ou à Rhodes, comme Cicéron.

> Rome n’a jamais cessé d’apprendre de la Grèce. Horace l’a dit en une formule : *Graecia capta ferum victorem cepit* — « la Grèce conquise a conquis son farouche vainqueur ».

## Art romain, héritages modernes
| Antiquité | Reprise moderne |
| Le Panthéon et sa coupole | Le Panthéon de Paris, le Capitole de Washington |
| La colonne Trajane | La colonne Vendôme, à Paris |
| L’arc de triomphe | L’Arc de triomphe de l’Étoile |
| La Maison carrée de Nîmes | L’église de la Madeleine, à Paris |

## Le patrimoine en danger
Pillages, guerres, tourisme de masse, montée des eaux : le programme invite à confronter l’Antiquité aux réalités contemporaines. La destruction de Palmyre a montré qu’un site antique reste un **enjeu politique** : le détruire, c’est vouloir effacer une mémoire commune.`,
          },
          questions: [
            ['Que signifie mare nostrum ?', ['La mer des morts', 'Notre mer', 'La mer du milieu', 'La mer intérieure'], 1, 'Les Romains appellent ainsi la Méditerranée, dont ils contrôlent tous les rivages.'],
            ['En quelle année Carthage est-elle détruite par Rome ?', ['146 av. J.-C.', '79 ap. J.-C.', '44 av. J.-C.', '212 av. J.-C.'], 0, 'À la fin de la troisième guerre punique, Carthage est rasée, puis refondée plus tard en colonie romaine.'],
            ['Dans quel pays actuel se trouve Leptis Magna ?', ['La Tunisie', 'L’Égypte', 'La Libye', 'Le Maroc'], 2, 'Leptis Magna, en Libye, est la ville natale de Septime Sévère.'],
            ['Comment s’appelle la rue principale nord-sud d’une ville romaine ?', ['Le decumanus', 'La via', 'Le forum', 'Le cardo'], 3, 'Le cardo croise le decumanus (est-ouest) ; le forum s’installe à leur croisement.'],
            ['Timgad, en Algérie, a été fondée sous Trajan avec un plan en damier.', ['Vrai', 'Faux'], 0, 'Fondée vers 100, Timgad est un exemple parfait d’urbanisme romain régulier.'],
            ['Quel monument célèbre se trouve à Éphèse ?', ['La bibliothèque de Celsus', 'La Maison carrée', 'Le pont du Gard', 'La colonne Trajane'], 0, 'Sa façade du IIe siècle a été relevée par les archéologues.'],
            ['Qui ouvre la première bibliothèque publique de Rome ?', ['Auguste', 'Asinius Pollion', 'Trajan', 'Cicéron'], 1, 'Asinius Pollion ouvre la première bibliothèque publique de Rome en 39 av. J.-C.'],
            ['Qu’a livré la villa des Papyrus d’Herculanum ?', ['Des statues d’or', 'Des fresques érotiques', 'Des rouleaux carbonisés, surtout de philosophie épicurienne', 'Des tablettes de défixion'], 2, 'L’éruption de 79 a carbonisé la bibliothèque ; l’imagerie numérique commence à la faire lire.'],
            ['Chez qui l’élève romain apprend-il l’art de parler ?', ['Le litterator', 'Le grammaticus', 'Le paedagogus', 'Le rhetor'], 3, 'Le rhéteur enseigne l’éloquence, dernière étape des études.'],
            ['Que dit la formule « Graecia capta ferum victorem cepit » ?', ['La Grèce a vaincu Rome par les armes', 'Rome a détruit la culture grecque', 'La Grèce conquise a conquis son vainqueur', 'La Grèce a été libérée par Rome'], 2, 'Horace reconnaît que Rome, victorieuse, a été conquise par la culture grecque.'],
            ['La colonne Vendôme s’inspire de la colonne Trajane.', ['Vrai', 'Faux'], 0, 'Elle reprend son fût à décor spiralé qui raconte des campagnes militaires.'],
            ['Où se trouvent des monuments antiques dynamités par l’État islamique en 2015 ?', ['À Pompéi', 'À Palmyre', 'À Carthage', 'À Nîmes'], 1, 'À Palmyre, en Syrie, la destruction visait à effacer une mémoire commune.'],
          ],
        },

        // ===== Étude de la langue ===========================================
        {
          titre: 'Verbes irréguliers, semi-déponents et impersonnels',
          axe: 'Étude de la langue',
          lecon: {
            titre: 'La morphologie verbale de Terminale',
            cours: `Les verbes les plus courants sont souvent les plus irréguliers : on les rencontre à chaque ligne, il faut donc les reconnaître sans hésiter.

## Les verbes irréguliers
| Verbe | Sens | Temps primitifs | Pièges |
| *eo* | aller | *eo, is, ire, ii (ivi), itum* | *eunt* (ils vont), *iens, euntis* (allant) |
| *fero* | porter | *fero, fers, ferre, tuli, latum* | Trois radicaux différents |
| *volo* | vouloir | *volo, vis, velle, volui* | *vis* = tu veux (ne pas confondre avec *vis*, la force) |
| *nolo* | ne pas vouloir | *nolo, non vis, nolle, nolui* | *noli* + infinitif = « ne… pas » (défense) |
| *malo* | préférer | *malo, mavis, malle, malui* | *magis volo* : vouloir plutôt |
| *fio* | devenir, être fait | *fio, fis, fieri, factus sum* | Sert de passif à *facio* |

Les composés suivent le modèle : *redeo* (revenir), *transeo* (traverser), *perfero* (supporter), *affero* (apporter).
Exemple : *Noli me tangere*, « ne me touche pas ».

## Les semi-déponents
Actifs au présent, ils prennent au parfait des formes **passives**, avec un sens actif.
| Verbe | Parfait | Sens |
| *audeo* | *ausus sum* | oser |
| *gaudeo* | *gavisus sum* | se réjouir |
| *soleo* | *solitus sum* | avoir l’habitude |
| *fido* | *fisus sum* | se fier |

*Ausus est* ne signifie pas « il a été osé » mais **« il a osé »**.

## Les verbes non personnels
Ils ne s’emploient qu’à la 3e personne du singulier.
| Verbe | Sens | Construction |
| *decet* | il convient | accusatif de la personne + infinitif |
| *licet* | il est permis | datif de la personne + infinitif |
| *libet* | il plaît | datif + infinitif |
| *pudet* | on a honte | accusatif de la personne, génitif de la cause |
| *paenitet* | on se repent | accusatif de la personne, génitif de la cause |

*Me pudet stultitiae meae* : « j’ai honte de ma sottise » — mot à mot, « il me fait honte de ma sottise ».

## Autres points du programme de l’option
1. **Le supin** : en *-um*, après un verbe de mouvement, il exprime le **but** (*eo cubitum*, « je vais me coucher ») ; en *-u*, il complète un adjectif (*mirabile dictu*, « étonnant à dire »).
2. **Les particules interrogatives** : *-ne* attend une réponse neutre, *nonne* attend « oui », *num* attend « non » ; *utrum… an* pose une alternative.
3. **Videor** : « sembler », en construction personnelle. *Videris esse felix* : « tu sembles être heureux ».
4. **La double négation** vaut une affirmation nuancée : *non nemo*, « quelqu’un » ; *nemo non*, « tout le monde » ; *nonnulli*, « quelques-uns ».
5. **Les indéfinis** : *quisque* (chacun), *uterque* (l’un et l’autre), *alter* (l’autre, de deux), *alius* (un autre).

> Méthode : devant une forme inconnue, cherche d’abord si elle vient de *eo*, *fero* ou *fio* — c’est la bonne réponse une fois sur deux.`,
          },
          questions: [
            ['Quel est le parfait de fero ?', ['Feri', 'Ferui', 'Tuli', 'Latus sum'], 2, 'Fero, ferre, tuli, latum : trois radicaux différents, à apprendre par cœur.'],
            ['Que signifie « Noli me tangere » ?', ['Tu ne peux pas me toucher', 'Ne me touche pas', 'Je ne veux pas te toucher', 'Touche-moi'], 1, 'Noli + infinitif exprime la défense : « ne… pas ».'],
            ['Quel verbe sert de passif à facio ?', ['Fio', 'Fero', 'Eo', 'Volo'], 0, 'Fio, fieri, factus sum : « devenir, être fait ».'],
            ['Que signifie « ausus est » ?', ['Il a été osé', 'Il osera', 'Il ose', 'Il a osé'], 3, 'Audeo est semi-déponent : forme passive au parfait, sens actif.'],
            ['Que signifie « me pudet stultitiae meae » ?', ['Ma sottise me plaît', 'J’ai honte de ma sottise', 'Il convient d’être sot', 'Je me repens de ma sagesse'], 1, 'Pudet : accusatif de la personne (me), génitif de la cause (stultitiae).'],
            ['Avec licet, la personne est au datif.', ['Vrai', 'Faux'], 0, 'Licet mihi ire : « il m’est permis d’aller ».'],
            ['Dans « eo cubitum », qu’exprime le supin ?', ['La cause', 'Le moyen', 'Le but', 'Le temps'], 2, 'Après un verbe de mouvement, le supin en -um exprime le but : « je vais me coucher ».'],
            ['Quelle réponse attend une question introduite par num ?', ['Oui', 'Une alternative', 'Une précision de lieu', 'Non'], 3, 'Num attend « non », nonne attend « oui », -ne reste neutre.'],
            ['Que signifie nemo non ?', ['Tout le monde', 'Personne', 'Quelqu’un', 'Presque personne'], 0, 'Deux négations s’annulent : « personne ne… pas », donc tout le monde.'],
            ['Que signifie « videris esse felix » ?', ['On te voit heureux', 'Tu sembles être heureux', 'Tu vois le bonheur', 'Tu seras vu heureux'], 1, 'Videor, en construction personnelle, signifie « sembler ».'],
            ['Dans « mirabile dictu », dictu est un supin en -u.', ['Vrai', 'Faux'], 0, 'Le supin en -u complète un adjectif : « étonnant à dire ».'],
            ['Que signifie uterque ?', ['Chacun', 'Un autre', 'L’un et l’autre', 'Aucun des deux'], 2, 'Uterque se dit de deux : l’un et l’autre ; quisque signifie chacun.'],
          ],
        },
        {
          titre: 'Style indirect, attraction modale, quisquis et memini',
          axe: 'Étude de la langue',
          lecon: {
            titre: 'La langue propre à la spécialité de Terminale',
            cours: `La spécialité ajoute quelques points qui reviennent sans cesse chez les historiens et les poètes. Les connaître, c’est cesser de buter sur des subjonctifs « inexplicables ».

## Le style indirect (oratio obliqua)
Pour rapporter un discours, le latin transforme chaque proposition selon une règle stricte.
| Dans le discours direct | Au style indirect |
| Principale déclarative | **Proposition infinitive** (sujet à l’accusatif) |
| Principale d’ordre ou de défense | **Subjonctif** |
| Principale interrogative | **Subjonctif** (le plus souvent) |
| Toute subordonnée | **Subjonctif** |
| *ego*, *meus* (celui qui parle) | *se*, *suus* |

Exemple, chez César : des ambassadeurs disent *nos pacem petimus* (« nous demandons la paix »). Au style indirect : *legati dixerunt se pacem petere*, « les ambassadeurs dirent **qu’ils** demandaient la paix ».

> Un long passage à l’infinitif et au subjonctif, sans verbe introducteur visible, c’est presque toujours du **discours rapporté** : cherche qui parle quelques lignes plus haut.

## L’attraction modale
Une subordonnée qui dépend d’une proposition au subjonctif ou d’une infinitive passe elle-même **au subjonctif**, même si elle serait à l’indicatif seule. Ce subjonctif n’a pas de sens propre : il signale seulement la dépendance. Traduis-le par un indicatif.

## Les relatifs indéfinis
*Quicumque* et *quisquis* signifient « quiconque, qui que ce soit qui » ; au neutre, *quodcumque* et *quidquid*, « tout ce qui, quoi que ce soit ».
Le vers de Virgile le plus cité le montre : *Quidquid id est, timeo Danaos et dona ferentes* (*Énéide* II) — « Quoi que ce soit, je crains les Grecs, même quand ils apportent des présents. » C’est Laocoon devant le cheval de Troie.

## Les parfaits à sens de présent
| Verbe | Forme | Sens |
| *memini* | parfait | je me souviens (impératif : *memento*) |
| *novi* | parfait de *nosco* | je sais (« j’ai appris », donc je connais) |
| *odi* | parfait | je hais |
| *coepi* | parfait | j’ai commencé |

Catulle : *Odi et amo*, « je hais et j’aime ». Deux parfaits, deux présents en français. Et la maxime *memento mori* : « souviens-toi que tu vas mourir ».

## L’expression de l’âge
| Tournure | Mot à mot | Traduction |
| *puer decem annos natus* | enfant né depuis dix ans | un enfant de dix ans |
| *annum agens vicesimum* | menant sa vingtième année | à dix-neuf ans révolus |

*Annos* est un **accusatif de durée**.

## Les exclamatifs
*Quantus* (combien grand), *qualis* (quel), *quot* (combien nombreux) s’emploient aussi dans l’exclamation : *Quanta est vis amoris !* — « Quelle est la force de l’amour ! » Et Cicéron : *O tempora, o mores !*, « Quelle époque, quelles mœurs ! », où l’on emploie l’accusatif exclamatif avec *o*.

## Rappel : la concordance des temps
| Principale | Simultanéité | Antériorité |
| Présent ou futur | Subjonctif présent | Subjonctif parfait |
| Passé | Subjonctif imparfait | Subjonctif plus-que-parfait |`,
          },
          questions: [
            ['Au style indirect, que devient une principale déclarative ?', ['Une proposition au subjonctif', 'Une proposition infinitive', 'Un ablatif absolu', 'Une relative'], 1, 'Le sujet passe à l’accusatif et le verbe à l’infinitif.'],
            ['Au style indirect, que devient une subordonnée ?', ['Elle passe au subjonctif', 'Elle reste à l’indicatif', 'Elle passe à l’infinitif', 'Elle disparaît'], 0, 'Toute subordonnée du discours rapporté est au subjonctif.'],
            ['Au style indirect, par quoi est remplacé ego, désignant celui qui parle ?', ['Is', 'Ille', 'Se', 'Hic'], 2, 'Le réfléchi se renvoie au locuteur dont on rapporte les paroles.'],
            ['Le subjonctif d’attraction modale a un sens propre de souhait.', ['Vrai', 'Faux'], 1, 'Il ne fait que marquer la dépendance ; on le traduit par un indicatif.'],
            ['Que signifie « Quidquid id est, timeo Danaos et dona ferentes » ?', ['Quoi que ce soit, je crains les Grecs, même porteurs de présents', 'Ce sont les Grecs qui portent des présents', 'Je donne tout aux Grecs', 'Les Grecs craignent les dons'], 0, 'Laocoon se méfie du cheval de Troie : quidquid est un relatif indéfini.'],
            ['Que signifie odi ?', ['J’ai haï autrefois', 'Je haïrai', 'On me hait', 'Je hais'], 3, 'Odi est un parfait à sens de présent.'],
            ['Que veut dire memento mori ?', ['Souviens-toi que tu vas mourir', 'La mort se souvient', 'Il faut mourir en souvenir', 'Oublie la mort'], 0, 'Memento est l’impératif de memini, parfait à sens de présent.'],
            ['Novi, parfait de nosco, signifie…', ['J’ai oublié', 'Je sais, je connais', 'Je suis nouveau', 'Je renouvelle'], 1, 'Avoir appris, c’est savoir : le parfait prend le sens d’un présent.'],
            ['Que signifie « puer decem annos natus » ?', ['Un enfant né il y a dix jours', 'Un enfant de dix ans', 'Dix enfants nés', 'Un enfant de dix mois'], 1, 'Natus + accusatif de durée exprime l’âge.'],
            ['Dans « decem annos natus », annos est un accusatif de durée.', ['Vrai', 'Faux'], 0, 'L’accusatif exprime la durée : né depuis dix ans.'],
            ['Après une principale au passé, quel temps exprime la simultanéité au subjonctif ?', ['Le présent', 'Le parfait', 'Le plus-que-parfait', 'L’imparfait'], 3, 'Concordance : principale passée, simultanéité au subjonctif imparfait.'],
            ['Quel est le sens de quicumque ?', ['Chacun', 'Quelqu’un', 'Quiconque, qui que ce soit qui', 'Personne'], 2, 'Quicumque et quisquis sont des relatifs indéfinis : quiconque.'],
          ],
        },
        {
          titre: 'Mots-concepts latins et étymologie',
          axe: 'Étude de la langue',
          lecon: {
            titre: 'Des mots latins aux mots d’aujourd’hui',
            cours: `L’épreuve de spécialité pose toujours une **question de lexique** sur une notion clé du texte. Connaître l’histoire de quelques grands mots, c’est gagner ces points — et comprendre le français.

## Les mots du destin et du sacré
| Mot latin | Sens premier | Héritiers français |
| *fatum* (de *fari*, parler) | Ce qui a été dit | fatal, fatalité |
| *fortuna* | Le sort, bon ou mauvais | fortune, fortuit |
| *monstrum* (de *monere*, avertir) | Signe envoyé par les dieux | monstre, montrer |
| *sacer* | Mis à part pour les dieux ; aussi maudit | sacré, sacrifice |
| *templum* | Espace du ciel découpé par l’augure | temple, contempler |
| *augurium* | Présage tiré des oiseaux | augure, inaugurer |
| *religio* | Scrupule, culte | religion |

Inaugurer, c’était prendre les auspices avant d’ouvrir un bâtiment ; contempler, c’était observer le *templum* céleste.

## Les mots de l’homme
| Mot latin | Sens | Remarque |
| *homo, hominis* | l’être humain | Parent de *humus*, la terre : l’homme est le terrestre, opposé aux dieux |
| *humanitas* | culture, bienveillance | Chez Cicéron, ce qui rend l’homme vraiment humain : l’éducation |
| *vir* | l’homme, le mâle, le héros | a donné viril, vertu (*virtus*) |
| *ingenium* | talent naturel | ingénieux, ingénieur |
| *exsilium* | exil | de *ex-* + *solum*, le sol : hors de sa terre |

## Les doublets : un mot latin, deux mots français
Le même mot latin a souvent donné un mot **populaire**, usé par des siècles de bouche à oreille, et un mot **savant**, recopié plus tard par les lettrés.
| Latin | Mot populaire | Mot savant |
| *fragilis* | frêle | fragile |
| *hospitale* | hôtel | hôpital |
| *potionem* | poison | potion |
| *pensare* | peser | penser |
| *auscultare* | écouter | ausculter |
| *liberare* | livrer | libérer |

## Méthode : la question de lexique à l’épreuve
1. **Donne le sens premier** du mot, avec son étymologie si tu la connais.
2. **Relève ses emplois dans le texte** : le même mot n’a pas toujours le même sens deux lignes plus bas.
3. **Dis le sens en contexte** et ce qu’il apporte à l’interprétation.
4. **Ouvre** : un héritier français, ou un équivalent grec (*fatum* et *moira*, *natura* et *physis*, *homo* et *anthropos*).

> Exemple : *ingenium* chez Ovide. Sens premier : le caractère inné. Dans les *Tristes* : le talent poétique, qui l’a perdu (*ingenio perii*) et qui le console. Héritiers : ingénieux, ingénieur. Voilà une réponse complète en quatre temps.

## Quelques racines rentables
*Duc-* (conduire : conduire, aqueduc, éducation), *cap-* (prendre : capture, captif, capable), *fac-/fec-* (faire : facteur, effet, infection), *mitt-/miss-* (envoyer : mission, émettre), *vid-/vis-* (voir : vision, évident, providence).`,
          },
          questions: [
            ['De quel verbe vient monstrum ?', ['Monere, avertir', 'Mons, la montagne', 'Mostrare, exhiber', 'Mori, mourir'], 0, 'Le monstre est d’abord un avertissement envoyé par les dieux.'],
            ['Que désignait d’abord le templum ?', ['Une maison de dieux', 'Un espace du ciel découpé par l’augure', 'Un tombeau', 'Un autel domestique'], 1, 'L’augure découpait un espace du ciel pour y lire le vol des oiseaux : d’où contempler.'],
            ['D’où vient le verbe « inaugurer » ?', ['D’aurum, l’or', 'D’augere, augmenter', 'D’augurium, le présage', 'D’Augustus'], 2, 'Inaugurer, c’était prendre les auspices avant d’ouvrir un lieu.'],
            ['Homo est apparenté à humus, la terre.', ['Vrai', 'Faux'], 0, 'L’homme est le « terrestre », opposé aux dieux du ciel.'],
            ['Quel est le mot populaire issu de hospitale ?', ['Hôpital', 'Hospitalité', 'Hospice', 'Hôtel'], 3, 'Hôtel est le mot populaire, hôpital le mot savant.'],
            ['Quel doublet savant correspond à « poison » ?', ['Potion', 'Portion', 'Position', 'Passion'], 0, 'Potionem a donné poison (populaire) et potion (savant).'],
            ['De quels éléments est formé exsilium ?', ['Ex + silere, se taire', 'Ex + solum, le sol', 'Ex + salire, sauter', 'Ex + sol, le soleil'], 1, 'L’exilé est hors de son sol, hors de sa terre.'],
            ['Chez Cicéron, que désigne humanitas ?', ['La foule', 'La faiblesse humaine', 'La culture et la bienveillance', 'La mortalité'], 2, 'L’humanitas est ce qui rend vraiment humain : l’éducation et la douceur envers autrui.'],
            ['Quel mot français vient de vir ?', ['Virgule', 'Virus', 'Virage', 'Vertu'], 3, 'Virtus, la qualité de l’homme courageux, a donné vertu.'],
            ['À l’épreuve, la question de lexique demande seulement la traduction du mot.', ['Vrai', 'Faux'], 1, 'Il faut expliquer le sens en contexte et ce qu’il apporte à l’interprétation.'],
            ['Quel mot ne contient PAS la racine duc-, conduire ?', ['Aqueduc', 'Éducation', 'Caduc', 'Conduire'], 2, 'Caduc vient de cadere, tomber ; les autres viennent de ducere.'],
            ['Quel équivalent grec correspond à natura ?', ['Physis', 'Moira', 'Anthropos', 'Logos'], 0, 'Physis, la nature, a donné physique ; natura et physis dérivent tous deux de verbes signifiant naître, croître.'],
          ],
        },

        // ===== L'épreuve =====================================================
        {
          titre: 'L’épreuve de LLCA latin : traduire et écrire l’essai',
          axe: 'Épreuve écrite et orale',
          lecon: {
            titre: 'Méthode de traduction et d’interprétation',
            cours: `L’épreuve écrite de spécialité dure **4 heures**, avec un dictionnaire latin-français (le Gaffiot, en général). Elle porte sur un corpus de trois textes, dont un extrait de l’œuvre antique au programme — pour 2026-2028, les *Tristes*, livre III.

## Le sujet, pièce par pièce
| Partie | Question | Points |
| 1. Étude de la langue | Traduction d’environ 90 mots de l’œuvre antique | 6 |
| | Un fait de langue : identifier (1 pt) et interpréter (1 pt) | 2 |
| | Une notion clé du lexique, expliquée en contexte | 2 |
| 2. Compréhension et interprétation | Un essai organisé sur les trois textes du corpus | 10 |

Le corpus associe : le texte latin (300 mots au plus, avec sa traduction, sauf le passage à traduire), un extrait de l’œuvre moderne du programme (*La ferme africaine*) et un court texte antique donné en traduction.

## Traduire en sept étapes
1. **Lis le titre, le chapeau et la traduction fournie autour** : tu dois savoir qui parle et de quoi avant d’ouvrir le dictionnaire.
2. **Repère tous les verbes conjugués** et délimite les propositions (une par verbe conjugué).
3. **Identifie les mots de liaison** : conjonctions de subordination, relatifs, coordinations.
4. **Dans chaque proposition**, trouve le sujet (nominatif accordé au verbe), puis l’objet, puis les compléments.
5. **Cherche au dictionnaire** les mots inconnus, en vérifiant leur forme d’entrée (nominatif, première personne).
6. **Rédige une traduction exacte** puis améliore le français sans trahir la construction.
7. **Relis** : chaque mot latin est-il traduit ? Chaque phrase française a-t-elle un sens ?

> Chez Ovide, le distique élégiaque forme souvent une unité de sens : un distique, une phrase. L’ordre des mots est libre en poésie — les accords, eux, ne mentent jamais.

## Le fait de langue
On t’interroge par exemple sur un ablatif absolu, un subjonctif, un participe. Deux temps : **identifier** précisément (cas, mode, temps, fonction), puis **interpréter** (qu’apporte cette forme au sens ? une insistance, une cause, une plainte ?).

## L’essai
1. **Analyse la question** : ses mots clés, et la tension qu’elle contient.
2. **Formule une problématique** qui ne soit pas la question recopiée.
3. **Construis deux ou trois parties** qui avancent ; chaque paragraphe = une idée, un exemple précis tiré des trois textes, une analyse.
4. **Mobilise tes connaissances** : les deux œuvres du programme, les objets d’étude, ton portfolio, tes lectures.
5. **Cite le latin** avec parcimonie, toujours traduit.

| Défaut fréquent | Remède |
| Paraphraser les textes | Toujours analyser : comment et pourquoi |
| Traiter les textes un par un | Les confronter dans chaque partie |
| Oublier l’œuvre moderne | Au moins un exemple de Blixen par partie |

## L’oral de contrôle
Vingt minutes de préparation : un passage d’une vingtaine de lignes de l’œuvre antique à commenter en lien avec l’œuvre moderne, et un extrait de 25 mots au plus à traduire. Puis dix minutes d’exposé (lecture du latin comprise) et dix minutes d’entretien.`,
          },
          questions: [
            ['Combien de temps dure l’épreuve écrite de spécialité LLCA ?', ['2 heures', '4 heures', '3 heures', '5 heures'], 1, 'L’épreuve dure 4 heures, avec un dictionnaire latin-français.'],
            ['Combien de mots environ faut-il traduire à l’écrit ?', ['30', '300', '90', '150'], 2, 'La traduction porte sur environ 90 mots de l’œuvre antique au programme.'],
            ['Combien de points vaut l’essai ?', ['10', '6', '4', '20'], 0, 'La partie « compréhension et interprétation » vaut 10 points sur 20.'],
            ['Quel document est autorisé à l’épreuve ?', ['Les œuvres du programme', 'Une grammaire latine', 'Aucun document', 'Un dictionnaire latin-français'], 3, 'Seul le dictionnaire latin-français est autorisé à l’écrit.'],
            ['Pour traduire, par quoi faut-il commencer après avoir lu le chapeau ?', ['Par chercher chaque mot au dictionnaire', 'Par repérer les verbes conjugués', 'Par traduire le premier mot', 'Par écrire le français'], 1, 'Un verbe conjugué = une proposition : c’est l’ossature de la phrase.'],
            ['La question sur le fait de langue demande d’identifier la forme puis de l’interpréter.', ['Vrai', 'Faux'], 0, 'Un point pour l’identification, un point pour ce que la forme apporte au sens.'],
            ['Combien de textes compte le corpus de l’épreuve ?', ['Deux', 'Quatre', 'Un seul', 'Trois'], 3, 'Le texte antique au programme, un extrait de l’œuvre moderne, et un court texte antique en traduction.'],
            ['Quelle œuvre moderne accompagne les Tristes pour 2026-2028 ?', ['La ferme africaine de Karen Blixen', 'Mémoires d’Hadrien', 'L’Exil et le Royaume', 'Le Baron perché'], 0, 'Le Baron perché accompagne Lucien, pour le grec.'],
            ['Dans un essai, traiter les textes l’un après l’autre est la meilleure méthode.', ['Vrai', 'Faux'], 1, 'Il faut les confronter à l’intérieur de chaque partie.'],
            ['Chez Ovide, quelle unité correspond souvent à une phrase ?', ['Le vers seul', 'Le distique élégiaque', 'La strophe', 'Le chant'], 1, 'Un hexamètre et un pentamètre forment souvent une unité de sens.'],
            ['À l’oral de contrôle, combien de mots au plus faut-il traduire ?', ['90', '10', '25', '50'], 2, 'L’extrait à traduire compte 25 mots au plus, tirés du passage commenté.'],
            ['Pourquoi relire sa traduction à la fin ?', ['Pour la raccourcir', 'Pour vérifier que chaque mot est traduit et que le français a un sens', 'Pour ajouter des notes', 'Pour recopier le latin'], 1, 'Un oubli ou un contresens se repère souvent à la relecture d’une phrase française absurde.'],
          ],
        },
      ],
    },
  ],
}
