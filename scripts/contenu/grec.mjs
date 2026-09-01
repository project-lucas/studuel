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
            cours: `Tout commence par l’alphabet : 24 lettres, dont une bonne moitié se reconnaissent au premier coup d’œil parce qu’elles servent déjà en mathématiques et en physique.

## Les 24 lettres
α (alpha), β (bêta), γ (gamma), δ (delta), ε (epsilon), ζ (zêta), η (êta), θ (thêta), ι (iota), κ (kappa), λ (lambda), μ (mu), ν (nu), ξ (xi), ο (omicron), π (pi), ρ (rhô), σ ou ς (sigma), τ (tau), υ (upsilon), φ (phi), χ (khi), ψ (psi), ω (oméga).

## Les pièges de lecture
| La lettre | On croit lire | Elle note en fait |
| η (êta) | un n | un **E long** |
| ν (nu) | un v | un **N** |
| ρ (rhô) | un p | un **R** |
| χ (khi) | un x | un **KH** |
| ω (oméga) | un w | un **O long** |

## Les voyelles longues et brèves
| Son | Voyelle brève | Voyelle longue |
| E | **ε** (epsilon) | **η** (êta) |
| O | **ο** (omicron) | **ω** (oméga) |

C’est une distinction de **durée**, pas de timbre — et elle commande toute la métrique de la poésie grecque.

## Les esprits
Toute voyelle initiale porte obligatoirement un esprit.

| Esprit | Signe | Prononciation | Trace en français |
| Doux | ᾿ | Rien | ἀ- privatif : *athée*, *amoral* |
| Rude | ῾ | Une aspiration, un « h » | ἱστορία → *histoire* ; ἵππος → *hippodrome* |

> L’esprit rude est un cadeau : c’est lui qui explique tous les « h » du vocabulaire savant français. Un mot grec sans « h » en français avait un esprit doux.

## Le sigma final
La lettre sigma s’écrit **σ** à l’intérieur du mot et **ς** en fin de mot : λόγος. C’est la seule lettre grecque à changer de forme selon sa position.`,
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
            cours: `Apprendre le grec, c’est d’abord comprendre le français qu’on parle déjà. Un mot savant sur deux se décompose — et se devine sans dictionnaire.

## Les racines les plus fréquentes
| Racine grecque | Sens | Mots français |
| ἄνθρωπος (anthrôpos) | l’homme | anthropologie, philanthrope |
| λόγος (logos) | parole, science | biologie, dialogue |
| γράφειν (graphein) | écrire | graphique, orthographe |
| φιλεῖν (philein) | aimer | philosophie, cinéphile |
| πόλις (polis) | la cité | politique, métropole |
| βίος (bios) | la vie | biologie, antibiotique |

## Les préfixes
| Préfixe | Sens | Exemple |
| ἀ- privatif | sans | athée, amoral |
| anti- | contre | antidote, antithèse |
| hyper- | au-dessus | hypermarché, hypertension |
| hypo- | en dessous | hypothèse, hypoglycémie |
| péri- | autour | périmètre, périphérie |
| syn- / sym- | avec | synthèse, symétrie |
| dia- | à travers | diagonale, diamètre |
| méta- | au-delà | métamorphose, métaphore |

## Le vocabulaire savant
| Racine | Sens | Domaine |
| cardio- | cœur | cardiologie |
| derm- | peau | dermatologie |
| hémat- | sang | hématome |
| néphr- | rein | néphrologie |
| pneum- | poumon | pneumonie |
| psych- | âme | psychologie |

## Décomposer pour comprendre
> Un mot savant se lit comme une addition. *Chronologie* = χρόνος (temps) + λόγος (discours). *Démocratie* = δῆμος (peuple) + κράτος (pouvoir). *Hippopotame* = ἵππος (cheval) + ποταμός (fleuve) : le « cheval du fleuve ».`,
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
            cours: `La mythologie n’est pas un recueil d’histoires : c’est la manière dont les Grecs pensaient le monde — l’origine des saisons, du feu, du malheur.

## Les douze Olympiens
| Divinité | Son domaine |
| **Zeus** | Roi des dieux, la foudre |
| **Héra** | Le mariage |
| **Poséidon** | Les mers |
| **Athéna** | La sagesse, la guerre stratégique |
| **Apollon** | La lumière, les arts |
| **Artémis** | La chasse |
| **Arès** | La guerre brutale |
| **Aphrodite** | L’amour |
| **Héphaïstos** | La forge |
| **Hermès** | Le messager, les voyageurs |
| **Déméter** | Les moissons |
| **Hestia** ou **Dionysos** | Le foyer, ou le vin, selon les listes |

**Hadès** règne aux Enfers : il n’est pas compté parmi les Olympiens, parce qu’il ne siège pas sur l’Olympe.

## Les grands héros
| Héros | Son exploit |
| **Héraclès** | Les douze travaux |
| **Thésée** | Le Minotaure et le labyrinthe |
| **Persée** | Méduse et son regard qui pétrifie |
| **Achille** | La guerre de Troie, et son talon |
| **Ulysse** | Dix ans pour rentrer chez lui |

## Les récits fondateurs
L’*Iliade* raconte quelques semaines de la guerre de Troie ; l’*Odyssée*, le retour d’Ulysse. Tous deux sont attribués à **Homère** (VIIIe siècle av. J.-C.).

## Le mythe comme explication
| Le mythe | Ce qu’il explique |
| L’enlèvement de **Perséphone** | Le retour des saisons |
| Le vol de **Prométhée** | La possession du feu par les hommes |
| La boîte de **Pandore** | L’origine des malheurs humains |

> Le mythe donne une forme narrative à ce qui n’a pas encore d’explication. Il ne s’oppose pas au savoir : il occupe la place que le savoir n’a pas encore prise.`,
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
            cours: `Le grec, comme le latin, marque la fonction du mot par sa **terminaison**. L’ordre des mots devient dès lors très libre : ce n’est pas la place qui indique la fonction, c’est la finale.

## Les cinq cas
| Cas | Sa fonction principale | En français |
| Nominatif | Sujet, attribut | *le maître* parle |
| Vocatif | Interpellation | ô *maître* ! |
| Accusatif | COD, direction | je vois *le maître* |
| Génitif | Complément du nom, origine | le livre *du maître* |
| Datif | COI, moyen, lieu | je parle *au maître* |

## Les deux premières déclinaisons
| Déclinaison | Type | Exemple au nominatif | Au génitif |
| 1re | Féminins en -η ou -α | ἡ τιμή (l’honneur) | τῆς τιμῆς |
| 1re | Quelques masculins en -ης | ὁ πολίτης (le citoyen) | τοῦ πολίτου |
| 2e | Masculins en -ος | ὁ λόγος (la parole) | τοῦ λόγου |
| 2e | Neutres en -ον | τὸ δῶρον (le don) | τοῦ δώρου |

## La règle du neutre
> Au neutre, **nominatif et accusatif sont toujours identiques** — dans toute la langue, sans exception. C’est le repère le plus rentable : une forme neutre ambiguë se tranche par le sens, jamais par la terminaison.

## L’article, votre meilleur allié
ὁ / ἡ / τό se décline lui aussi, et accompagne presque toujours le nom. Devant un mot inconnu, c’est **sa terminaison à lui** qui donne le cas : lire l’article avant le nom fait gagner la moitié du travail de version.`,
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
            cours: `Athènes n’a pas seulement inventé le mot : elle a inventé une pratique — avec ses limites, qu’il faut énoncer aussi précisément que ses institutions.

## La polis
La cité grecque associe une **ville**, un **territoire** et une **communauté de citoyens**. Elle est indépendante : le monde grec est un monde de cités rivales, jamais un État unifié. C’est ce morcellement qui rend possible l’expérimentation politique.

## Les réformes fondatrices
| Date | Le réformateur | Ce qu’il apporte |
| 594 av. J.-C. | **Solon** | Abolit l’esclavage pour dettes, classe les citoyens par la richesse |
| 508-507 av. J.-C. | **Clisthène** | Réorganise le corps civique par dèmes, fonde l’*isonomie* |
| Ve siècle | **Périclès** | Instaure le *misthos*, qui permet aux pauvres de siéger |

## Les institutions
| Institution | Qui y siège | Ce qu’elle fait |
| L’**Ecclésia** | Tous les citoyens | Vote les lois et la guerre |
| La **Boulè** | 500 membres tirés au sort | Prépare les décisions |
| L’**Héliée** | Jurés tirés au sort | Juge : c’est le tribunal populaire |
| Les **stratèges** | Dix, élus et rééligibles | Commandent l’armée — les seuls élus |

## Les limites
| Sur environ 250 000 habitants | Statut | Droits politiques |
| ~40 000 | Citoyens (hommes, nés de deux parents athéniens) | Tous |
| Les femmes | Filles et épouses de citoyens | Aucun |
| Les métèques | Étrangers libres, souvent commerçants | Aucun |
| Les esclaves | Non libres | Aucun |

> Une démocratie **directe** et **restreinte** : les deux mots comptent autant l’un que l’autre. Directe, parce que le citoyen vote lui-même ; restreinte, parce qu’un habitant sur six seulement est citoyen.`,
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
            cours: `Le théâtre et la philosophie naissent dans la même cité, à la même époque, et posent la même question : comment vivre juste dans une cité imparfaite ? L’un la met en scène, l’autre l’argumente.

## Le théâtre
Né des fêtes de **Dionysos**, il se joue en plein jour, à ciel ouvert, devant des milliers de citoyens — c’est une institution civique, pas un loisir.

| Genre | Ce qu’il met en scène | Auteurs |
| Tragédie | La chute d’un héros pris dans un destin qui le dépasse | Eschyle, Sophocle, Euripide |
| Comédie | La vie politique de la cité, raillée sans ménagement | Aristophane |

## Les notions clés de la tragédie
| Notion | Ce qu’elle désigne |
| L’**hybris** | La démesure : le héros franchit la limite humaine |
| La **némésis** | Le châtiment que l’hybris appelle |
| La **catharsis** | La purgation des passions éprouvée par le spectateur |
| Le **chœur** | Il commente l’action et fait le lien avec le public |

> L’enchaînement hybris → némésis n’est pas une morale plaquée : c’est la mécanique même de la tragédie. Le héros n’est pas puni parce qu’il est méchant, mais parce qu’il a dépassé sa mesure.

## La philosophie
| Philosophe | Dates | Ce qu’il laisse |
| **Socrate** | 470-399 av. J.-C. | N’écrit rien : il interroge (*maïeutique*), et meurt condamné par la cité |
| **Platon** | Disciple de Socrate | Fonde l’Académie, écrit les *Dialogues* |
| **Aristote** | Disciple de Platon | Fonde le Lycée, classe l’ensemble des savoirs |

## Une même exigence
Le théâtre montre l’homme aux prises avec la démesure ; la philosophie cherche la règle qui l’en préserve. Les deux supposent une cité où l’on peut, publiquement, mettre en question ce qui va de soi.`,
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
