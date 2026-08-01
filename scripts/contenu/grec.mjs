// Grec ancien — option, 3e → Terminale.
// Bloc 3e (découverte) puis bloc lycée (2de-1re-Tle).

export default {
  slug: 'grec',
  nom: 'Grec',
  blocs: [
    {
      niveaux: ['3e'],
      chapitres: [
        {
          titre: 'L’alphabet grec',
          lecon: {
            titre: 'Lire et écrire le grec ancien',
            cours: `Tout commence par l'alphabet : 24 lettres, dont une bonne moitié se reconnaissent au premier coup d'œil.

## Les 24 lettres
α (alpha), β (bêta), γ (gamma), δ (delta), ε (epsilon), ζ (zêta), η (êta), θ (thêta), ι (iota), κ (kappa), λ (lambda), μ (mu), ν (nu), ξ (xi), ο (omicron), π (pi), ρ (rhô), σ/ς (sigma), τ (tau), υ (upsilon), φ (phi), χ (khi), ψ (psi), ω (oméga).

## Les voyelles longues et brèves
ε (bref) et η (long) notent le même son E ; ο (bref) et ω (long) notent le O. C'est une distinction de **durée**, qui compte pour la métrique de la poésie.

## Les esprits
Toute voyelle initiale porte un **esprit** : l'esprit **doux** (᾿) ne se prononce pas ; l'esprit **rude** (῾) ajoute une aspiration, un « h ». C'est lui qu'on retrouve dans *histoire* (ἱστορία) ou *hippodrome* (ἵππος, le cheval).

## Le sigma final
La lettre sigma s'écrit **σ** à l'intérieur du mot et **ς** en fin de mot : λόγος. C'est la seule lettre grecque à avoir deux formes selon la position.`,
          },
          questions: [
            ['Combien de lettres compte l’alphabet grec ?', ['24', '26', '21', '30'], 0, 'De l’alpha à l’oméga.'],
            ['Que signale un esprit rude sur une voyelle initiale ?', ['Une aspiration, un « h »', 'Un accent tonique', 'Une voyelle longue', 'Un pluriel'], 0, 'D’où *hippodrome* pour ἵππος.'],
            ['Le sigma s’écrit différemment en fin de mot.', ['Vrai', 'Faux'], 0, 'σ à l’intérieur, ς à la fin : λόγος.'],
            ['Quelle lettre note un O long ?', ['ω (oméga)', 'ο (omicron)', 'υ (upsilon)', 'α (alpha)'], 0, '*Oméga* signifie littéralement « grand O ».'],
            ['La distinction entre η et ε est une distinction de durée.', ['Vrai', 'Faux'], 0, 'Le grec oppose voyelles longues et brèves, ce qui compte en poésie.'],
            ['Quelle lettre grecque correspond au « p » ?', ['π (pi)', 'ρ (rhô)', 'φ (phi)', 'ψ (psi)'], 0, 'ρ se lit « r », φ se lit « ph ».'],
            ['L’esprit doux ne se prononce pas.', ['Vrai', 'Faux'], 0, 'Il note seulement l’absence d’aspiration.'],
            ['Que vaut la lettre χ (khi) ?', ['Un son « kh »', 'Un son « x »', 'Un son « ch » français', 'Un son « k » simple'], 0, 'ξ note le son « x ».'],
          ],
        },
        {
          titre: 'Les mots grecs dans le français',
          lecon: {
            titre: 'Ce que nous devons au grec',
            cours: `Apprendre le grec, c'est d'abord comprendre le français qu'on parle déjà.

## Les racines les plus fréquentes
*ἄνθρωπος* (anthrôpos, l'homme) → anthropologie, philanthrope. *λόγος* (logos, parole, science) → biologie, dialogue. *γράφειν* (graphein, écrire) → graphique, orthographe. *φιλεῖν* (philein, aimer) → philosophie, cinéphile. *πόλις* (polis, la cité) → politique, métropole. *βίος* (bios, la vie) → biologie, antibiotique.

## Les préfixes
*ἀ-* privatif (athée, amoral), *anti-* (contre), *hyper-* (au-dessus), *hypo-* (en dessous), *péri-* (autour), *syn-/sym-* (avec), *dia-* (à travers), *méta-* (au-delà).

## Le vocabulaire savant
La médecine et les sciences puisent massivement dans le grec : *cardio-* (cœur), *derm-* (peau), *hémat-* (sang), *néphr-* (rein), *pneum-* (poumon), *psych-* (âme). Décomposer un mot savant permet souvent d'en deviner le sens sans dictionnaire.

## Décomposer pour comprendre
*Chronologie* = χρόνος (temps) + λόγος (discours). *Démocratie* = δῆμος (peuple) + κράτος (pouvoir). *Hippopotame* = ἵππος (cheval) + ποταμός (fleuve) : le « cheval du fleuve ».`,
          },
          questions: [
            ['Que signifie la racine grecque « logos » ?', ['Parole, discours, science', 'Vie', 'Cheval', 'Cité'], 0, 'On la retrouve dans biologie, dialogue, catalogue.'],
            ['« Démocratie » vient de dêmos + kratos, soit…', ['Le pouvoir du peuple', 'La loi du roi', 'La cité des dieux', 'La parole du sage'], 0, 'δῆμος = peuple, κράτος = pouvoir.'],
            ['Le préfixe « a- » privatif signifie l’absence.', ['Vrai', 'Faux'], 0, '*athée* = sans dieu, *amoral* = sans morale.'],
            ['Que signifie « bios » ?', ['La vie', 'Le livre', 'Le corps', 'Le temps'], 0, 'Biologie, antibiotique, biographie.'],
            ['« Hippopotame » signifie littéralement…', ['Le cheval du fleuve', 'Le grand animal', 'Le roi de l’eau', 'Le géant gris'], 0, 'ἵππος (cheval) + ποταμός (fleuve).'],
            ['Le préfixe « hypo- » signifie « au-dessus ».', ['Vrai', 'Faux'], 1, 'C’est *hyper-* ; *hypo-* signifie « en dessous ».'],
            ['La racine « cardio- » désigne…', ['Le cœur', 'La peau', 'Le rein', 'Le sang'], 0, 'Cardiologie, cardiaque, électrocardiogramme.'],
            ['« Philosophie » signifie l’amour de la sagesse.', ['Vrai', 'Faux'], 0, 'φιλεῖν (aimer) + σοφία (sagesse).'],
          ],
        },
        {
          titre: 'La mythologie grecque',
          lecon: {
            titre: 'Les dieux et les héros',
            cours: `La mythologie n'est pas un recueil d'histoires : c'est la manière dont les Grecs pensaient le monde.

## Les douze Olympiens
**Zeus** (roi des dieux, foudre), **Héra** (mariage), **Poséidon** (mers), **Athéna** (sagesse, guerre stratégique), **Apollon** (lumière, arts), **Artémis** (chasse), **Arès** (guerre brutale), **Aphrodite** (amour), **Héphaïstos** (forge), **Hermès** (messager), **Déméter** (moissons), **Hestia** ou **Dionysos** (foyer / vin) selon les listes. **Hadès** règne aux Enfers, hors de l'Olympe.

## Les grands héros
**Héraclès** et ses douze travaux, **Thésée** et le Minotaure, **Persée** et Méduse, **Achille** et son talon, **Ulysse** et son retour de dix ans.

## Les récits fondateurs
L'*Iliade* raconte quelques semaines de la guerre de Troie ; l'*Odyssée*, le retour d'Ulysse. Tous deux sont attribués à **Homère** (VIIIe siècle av. J.-C.).

## Le mythe comme explication
Les saisons naissent de l'enlèvement de Perséphone, le feu du vol de **Prométhée**, les malheurs humains de la boîte de **Pandore**. Le mythe donne une forme narrative à ce qui n'a pas encore d'explication.`,
          },
          questions: [
            ['Qui est le roi des dieux grecs ?', ['Zeus', 'Poséidon', 'Apollon', 'Hadès'], 0, 'Son attribut est la foudre.'],
            ['Athéna est la déesse de…', ['La sagesse et de la guerre stratégique', 'L’amour', 'La chasse', 'La forge'], 0, 'Elle protège Athènes, qui porte son nom.'],
            ['Hadès fait partie des douze Olympiens.', ['Vrai', 'Faux'], 1, 'Il règne aux Enfers, hors de l’Olympe.'],
            ['Combien de travaux Héraclès doit-il accomplir ?', ['12', '7', '10', '20'], 0, 'Imposés par Eurysthée.'],
            ['Qui a écrit l’Iliade et l’Odyssée selon la tradition ?', ['Homère', 'Hésiode', 'Sophocle', 'Platon'], 0, 'Au VIIIe siècle av. J.-C.'],
            ['L’Odyssée raconte le retour d’Ulysse.', ['Vrai', 'Faux'], 0, 'Dix années de voyage pour rentrer à Ithaque.'],
            ['Qui a volé le feu aux dieux pour le donner aux hommes ?', ['Prométhée', 'Héphaïstos', 'Hermès', 'Dionysos'], 0, 'Il en est puni par Zeus.'],
            ['Thésée affronte le Minotaure dans le labyrinthe.', ['Vrai', 'Faux'], 0, 'Aidé par le fil d’Ariane.'],
          ],
        },
      ],
    },
    {
      niveaux: ['2de', '1re', 'Tle'],
      chapitres: [
        {
          titre: 'La déclinaison grecque',
          lecon: {
            titre: 'Cas, genres et nombres',
            cours: `Le grec, comme le latin, marque la fonction du mot par sa **terminaison**.

## Les cinq cas
**Nominatif** (sujet, attribut), **vocatif** (interpellation), **accusatif** (COD, direction), **génitif** (complément du nom, origine), **datif** (COI, moyen, lieu). L'ordre des mots devient dès lors très libre : c'est la terminaison, pas la place, qui indique la fonction.

## La première déclinaison
Noms féminins en *-η* ou *-α* : ἡ τιμή, τῆς τιμῆς, τῇ τιμῇ, τὴν τιμήν. Quelques masculins en *-ης* (ὁ πολίτης, le citoyen).

## La deuxième déclinaison
Masculins et neutres en *-ος* / *-ον* : ὁ λόγος, τοῦ λόγου, τῷ λόγῳ, τὸν λόγον. Au neutre, **nominatif et accusatif sont toujours identiques** — règle valable dans toute la langue.

## L'article, votre meilleur allié
ὁ / ἡ / τό se décline lui aussi et accompagne presque toujours le nom : sa terminaison suffit souvent à identifier le cas d'un mot inconnu.`,
          },
          questions: [
            ['Combien de cas compte la déclinaison grecque ?', ['5', '3', '6', '4'], 0, 'Nominatif, vocatif, accusatif, génitif, datif.'],
            ['Au neutre, nominatif et accusatif sont identiques.', ['Vrai', 'Faux'], 0, 'Règle constante, très utile pour identifier les formes.'],
            ['Quel cas exprime le complément du nom ?', ['Le génitif', 'Le datif', 'L’accusatif', 'Le vocatif'], 0, 'Il marque aussi l’origine et la possession.'],
            ['À quoi sert le vocatif ?', ['À interpeller quelqu’un', 'À marquer le sujet', 'À marquer le COD', 'À marquer le lieu'], 0, 'C’est le cas de l’apostrophe.'],
            ['En grec, l’ordre des mots détermine la fonction.', ['Vrai', 'Faux'], 1, 'C’est la terminaison qui la marque, d’où une grande liberté syntaxique.'],
            ['La deuxième déclinaison regroupe surtout des noms en…', ['-ος et -ον', '-η et -α', '-ης seulement', '-ω'], 0, 'Masculins en *-ος*, neutres en *-ον*.'],
            ['Le datif exprime notamment le COI et le moyen.', ['Vrai', 'Faux'], 0, 'Ainsi que certains compléments de lieu.'],
            ['L’article grec…', ['Se décline et aide à identifier le cas', 'Est invariable', 'N’existe pas', 'Se place après le nom'], 0, 'Sa terminaison renseigne même sur un nom inconnu.'],
          ],
        },
        {
          titre: 'Athènes et la démocratie',
          lecon: {
            titre: 'La cité grecque et son invention politique',
            cours: `Athènes n'a pas inventé le mot seulement : elle a inventé une pratique, avec ses limites.

## La polis
La cité grecque associe une ville, un territoire et une communauté de citoyens. Elle est **indépendante** : le monde grec est un monde de cités rivales, non un État unifié.

## Les réformes fondatrices
**Solon** (594 av. J.-C.) abolit l'esclavage pour dettes et classe les citoyens par la richesse. **Clisthène** (508-507) réorganise le corps civique par dèmes et fonde l'**isonomie**, l'égalité devant la loi. **Périclès** (Ve siècle) instaure le *misthos*, indemnité qui permet aux plus pauvres de siéger.

## Les institutions
L'**Ecclésia** (assemblée de tous les citoyens) vote les lois et la guerre. La **Boulè** (500 membres tirés au sort) prépare les décisions. L'**Héliée** est le tribunal populaire. Les **stratèges**, eux, sont élus.

## Les limites
Sur environ 250 000 habitants, seuls **40 000 citoyens** environ : sont exclus les femmes, les métèques (étrangers libres) et les esclaves. Une démocratie **directe** mais **restreinte** — les deux mots comptent.`,
          },
          questions: [
            ['Qu’est-ce que l’Ecclésia à Athènes ?', ['L’assemblée de tous les citoyens', 'Le tribunal', 'Le conseil des 500', 'Le collège des stratèges'], 0, 'Elle vote les lois, la guerre et l’ostracisme.'],
            ['Combien de membres compte la Boulè ?', ['500', '100', '1000', '50'], 0, 'Tirés au sort, ils préparent les décisions de l’Ecclésia.'],
            ['Les femmes étaient citoyennes à Athènes.', ['Vrai', 'Faux'], 1, 'Femmes, métèques et esclaves étaient exclus de la citoyenneté.'],
            ['Qui a instauré l’isonomie par une réorganisation en dèmes ?', ['Clisthène', 'Solon', 'Périclès', 'Dracon'], 0, 'En 508-507 av. J.-C.'],
            ['Le misthos permettait aux plus pauvres de participer.', ['Vrai', 'Faux'], 0, 'Cette indemnité, instaurée sous Périclès, rendait la fonction accessible.'],
            ['Les stratèges athéniens étaient…', ['Élus', 'Tirés au sort', 'Héréditaires', 'Nommés par l’oracle'], 0, 'La compétence militaire justifiait l’élection plutôt que le tirage au sort.'],
            ['La démocratie athénienne était directe.', ['Vrai', 'Faux'], 0, 'Les citoyens votaient eux-mêmes, sans représentants.'],
            ['Qu’est-ce qu’un métèque ?', ['Un étranger libre installé dans la cité', 'Un esclave', 'Un magistrat', 'Un citoyen pauvre'], 0, 'Il paie l’impôt et sert à l’armée sans être citoyen.'],
          ],
        },
        {
          titre: 'Théâtre et philosophie',
          lecon: {
            titre: 'Deux inventions grecques majeures',
            cours: `Le théâtre et la philosophie naissent dans la même cité, à la même époque, et posent les mêmes questions autrement.

## Le théâtre
Né des fêtes de **Dionysos**, il se joue en plein jour, dans un théâtre à ciel ouvert, devant des milliers de citoyens. La **tragédie** met en scène la chute d'un héros pris dans un destin qui le dépasse (Eschyle, Sophocle, Euripide) ; la **comédie** raille la vie politique (Aristophane).

## Les notions clés de la tragédie
L'**hybris** (démesure) attire la **némésis** (châtiment) ; la **catharsis** est la purgation des passions que le spectateur éprouve. Le **chœur** commente l'action et fait le lien avec le public.

## La philosophie
**Socrate** (470-399) n'écrit rien : il interroge (*maïeutique*) et meurt condamné par la cité. **Platon**, son disciple, fonde l'Académie et écrit les *Dialogues*. **Aristote**, disciple de Platon, fonde le Lycée et classe l'ensemble des savoirs.

## Une même exigence
Théâtre et philosophie partagent une question : comment vivre juste dans une cité imparfaite ? L'un la met en scène, l'autre l'argumente.`,
          },
          questions: [
            ['De quelles fêtes le théâtre grec est-il né ?', ['Les fêtes de Dionysos', 'Les fêtes d’Apollon', 'Les Panathénées', 'Les jeux olympiques'], 0, 'Les Grandes Dionysies athéniennes.'],
            ['Que désigne l’hybris ?', ['La démesure de l’homme', 'La purification du spectateur', 'Le chœur', 'Le destin'], 0, 'Elle attire la némésis, le châtiment divin.'],
            ['La catharsis désigne la purgation des passions chez le spectateur.', ['Vrai', 'Faux'], 0, 'Aristote la théorise dans la *Poétique*.'],
            ['Qui n’a laissé aucun écrit de sa main ?', ['Socrate', 'Platon', 'Aristote', 'Sophocle'], 0, 'On le connaît par Platon et Xénophon.'],
            ['Aristophane est un auteur de comédies.', ['Vrai', 'Faux'], 0, 'Il raille les politiques et les intellectuels de son temps.'],
            ['Quelle école Aristote a-t-il fondée ?', ['Le Lycée', 'L’Académie', 'Le Portique', 'Le Jardin'], 0, 'L’Académie est celle de Platon.'],
            ['Le chœur, dans la tragédie, commente l’action.', ['Vrai', 'Faux'], 0, 'Il fait le lien entre la scène et les spectateurs.'],
            ['Socrate est mort…', ['Condamné par la cité d’Athènes', 'Au combat', 'En exil', 'De vieillesse'], 0, 'Accusé d’impiété et de corruption de la jeunesse, en 399 av. J.-C.'],
          ],
        },
      ],
    },
  ],
}
