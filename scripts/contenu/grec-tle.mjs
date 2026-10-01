// Grec ancien — TERMINALE : le programme réel (option LCA et spécialité LLCA).
//
// MÊME SLUG que `grec.mjs` (`grec`), d'où la génération par
// `--modules grec-tle` : la 218, qui pose le grec de la 3e à la Terminale,
// est déjà exécutée et ne doit pas être régénérée.
//
// Sources officielles :
// - programme de l'enseignement de spécialité LLCA, classe terminale
//   (BO spécial n° 8 du 25 juillet 2019) : « L'homme, le monde, le destin »,
//   « Croire, savoir, douter », « Méditerranée : présence des mondes
//   antiques » ; langue : adjectifs type ἡδύς, pronoms réfléchis, optatif
//   présent et aoriste, accusatif de relation, éventuel, souhait, potentiel ;
// - programme de l'enseignement optionnel LCA, classe terminale (même BO) :
//   « Leçons de sagesse antique », « Comprendre le monde », « Inventer,
//   créer, fabriquer, produire », « Méditerranée » ; langue : troisième
//   déclinaison, comparatifs irréguliers, aoriste moyen et passif,
//   subjonctif, trois emplois de αὐτός, but, conséquence, négations ;
// - programme limitatif 2026-2027 et 2027-2028 (BO n° 11 du 12 mars 2026,
//   MENE2605298N) : Lucien, « Histoires vraies », et Italo Calvino, « Le
//   Baron perché », dans « L'homme, le monde, le destin » — sous-ensemble
//   « Le grand théâtre du monde : vérité et illusion » ;
// - définition de l'épreuve écrite (note de service 2020-028, version
//   consolidée 2024).
//
// Positions : les 3 fiches maison de la 218 occupent 1→3 ; ce bloc démarre à 4.

export default {
  slug: 'grec',
  nom: 'Grec',

  titreMigration: 'GREC Tle — LE PROGRAMME DE TERMINALE (OPTION ET SPÉCIALITÉ LLCA)',

  motif: `CONSTAT : le grec de Terminale n'avait que 3 fiches maison, écrites pour
les trois niveaux du lycée à la fois (déclinaison, démocratie athénienne,
théâtre et philosophie), et jamais confrontées au programme. Rien sur les
objets d'étude de Terminale (« L'homme, le monde, le destin », « Croire,
savoir, douter », « Méditerranée : présence des mondes antiques », ni sur ceux
de l'option), rien sur les œuvres du programme limitatif 2026-2028 (Lucien,
Histoires vraies ; Italo Calvino, Le Baron perché), rien sur la langue propre à
la Terminale (optatif, potentiel, éventuel…) ni sur l'épreuve écrite.
Cette migration AJOUTE 15 fiches derrière les 3 existantes, qui restent en place.`,

  blocs: [
    {
      niveaux: ['Tle'],
      // 1→3 : les fiches lycée de la 218. 4→18 : ce bloc.
      positionDepart: 4,
      chapitres: [
        // ===== L'homme, le monde, le destin ================================
        {
          titre: 'Hésiode et les Moires : naissance du monde, fil du destin',
          axe: 'L’homme, le monde, le destin',
          lecon: {
            titre: 'Genèse et cosmogonies grecques',
            cours: `Avant les philosophes, les Grecs ont raconté l’origine du monde comme une **histoire de famille** : des dieux naissent, s’unissent, se détrônent, jusqu’à ce que Zeus impose un ordre durable.

## La Théogonie d’Hésiode
Vers 700 av. J.-C., le poète béotien Hésiode écrit la *Théogonie*, « la naissance des dieux ». Le premier mot du récit est resté célèbre : Ἤτοι μὲν πρώτιστα Χάος γένετ᾽, « donc, tout au commencement, fut Chaos ». Le Chaos n’est pas le désordre : c’est la **béance**, le vide ouvert (le mot vient d’un verbe qui signifie « bâiller »).

| Génération | Les dieux | L’événement |
| Les origines | Chaos, Gaïa (la Terre), Tartare, Éros | Le monde s’ouvre ; Éros pousse à l’union |
| Les Ouranides | Ouranos (le Ciel) et Gaïa | Ouranos enferme ses enfants dans la Terre |
| Les Titans | Cronos et Rhéa | Cronos mutile son père avec une faucille, puis dévore ses propres enfants |
| Les Olympiens | Zeus et ses frères et sœurs | Rhéa sauve Zeus en donnant une pierre à Cronos ; Zeus vainc les Titans |

> La cosmogonie grecque va du **désordre violent à l’ordre juste** : le règne de Zeus, c’est l’équilibre enfin trouvé entre les forces du monde.

## Prométhée et Pandore
Dans la *Théogonie* et *Les Travaux et les Jours*, Hésiode raconte comment le Titan Prométhée vole le feu pour les hommes. Zeus se venge en leur envoyant **Pandore**, la première femme, qui ouvre la jarre d’où s’échappent les maux ; seule l’Espérance reste au fond. Hésiode décrit aussi les **races** successives de l’humanité : or, argent, bronze, héros, fer — la nôtre, vouée à la peine.

## Le kosmos, un monde ordonné
Le mot κόσμος signifie à la fois **l’ordre** et **la parure** : le monde est beau parce qu’il est rangé. D’où « cosmos » et « cosmétique ». Chez Platon, dans le *Timée*, un **démiurge** (δημιουργός, l’artisan) façonne le monde en contemplant un modèle parfait.

## Les Moires et la nécessité
| Moire | Son rôle | Ce que dit son nom |
| Clotho | Elle file la vie | « la fileuse » |
| Lachésis | Elle attribue le lot de chacun | « le sort » |
| Atropos | Elle coupe le fil | « l’inflexible » (ἄτροπος, qu’on ne détourne pas) |

Le mot μοῖρα signifie d’abord **la part** : le destin, c’est la portion de vie qui revient à chacun. Au-dessus encore, Ἀνάγκη, la **Nécessité**, à laquelle, dit un proverbe grec, même les dieux ne résistent pas.

## Exemple travaillé : lire le premier vers
Χάος γένετ᾽ : Χάος, nominatif neutre, sujet ; γένετ᾽ pour ἐγένετο, aoriste de γίγνομαι, « naître, devenir ». Mot à mot : « Chaos naquit ». Traduction : **« Au tout début, il y eut Chaos. »** L’aoriste raconte un événement unique, posé une fois pour toutes.`,
          },
          questions: [
            ['Quelle œuvre d’Hésiode raconte la naissance des dieux ?', ['L’Odyssée', 'La Théogonie', 'Le Timée', 'Les Argonautiques'], 1, 'Theogonia signifie « naissance des dieux » ; elle date d’environ 700 av. J.-C.'],
            ['Chez Hésiode, que désigne d’abord Chaos ?', ['La béance, le vide ouvert', 'Le désordre et la guerre', 'Le dieu de la mer', 'Le feu primitif'], 0, 'Le mot se rattache à un verbe qui signifie « bâiller » : Chaos est l’ouverture initiale.'],
            ['Quel Titan dévore ses propres enfants ?', ['Prométhée', 'Ouranos', 'Atlas', 'Cronos'], 3, 'Cronos craint d’être détrôné ; Rhéa sauve Zeus en lui donnant une pierre à avaler.'],
            ['Que reste-t-il au fond de la jarre de Pandore ?', ['La mort', 'La maladie', 'L’Espérance', 'Le feu'], 2, 'Tous les maux s’échappent ; seule l’Espérance reste dans la jarre.'],
            ['Le mot kosmos signifie à la fois l’ordre et la parure.', ['Vrai', 'Faux'], 0, 'D’où « cosmos » et « cosmétique » : le monde est beau parce qu’il est ordonné.'],
            ['Qui, chez Platon, façonne le monde d’après un modèle parfait ?', ['Le démiurge', 'Éros', 'Atropos', 'Gaïa'], 0, 'Dans le Timée, le démiurge, l’artisan divin, fabrique le monde.'],
            ['Quelle Moire coupe le fil de la vie ?', ['Clotho', 'Lachésis', 'Atropos', 'Anankè'], 2, 'Atropos, « l’inflexible », coupe le fil que Clotho a filé.'],
            ['Que signifie d’abord le mot moira ?', ['La mort', 'La part, le lot', 'La colère', 'Le fil'], 1, 'Le destin est la part de vie qui revient à chacun.'],
            ['Quelle est la race humaine actuelle selon Hésiode ?', ['La race d’or', 'La race des héros', 'La race de bronze', 'La race de fer'], 3, 'Hésiode vit dans la race de fer, vouée au travail et à la peine.'],
            ['Dans Χάος γένετ᾽, γένετ᾽ est un aoriste de γίγνομαι.', ['Vrai', 'Faux'], 0, 'L’aoriste raconte un événement unique : « Chaos naquit ».'],
            ['Que vole Prométhée pour les hommes ?', ['Le feu', 'L’ambroisie', 'La foudre', 'L’écriture'], 0, 'Zeus s’en venge en envoyant Pandore aux hommes.'],
            ['Que désigne Anankè ?', ['L’Amour', 'La Nécessité', 'La Justice', 'La Nuit'], 1, 'Anankè, la Nécessité, s’impose même aux dieux.'],
          ],
        },
        {
          titre: 'Delphes, la Pythie et les oracles ambigus',
          axe: 'L’homme, le monde, le destin',
          lecon: {
            titre: 'Les voix du destin : oracles, prophéties et rêves',
            cours: `Pour un Grec, l’avenir n’est pas muet : les dieux le disent. Mais ils le disent **à demi-mot**, et tout le drame est dans l’interprétation.

## Delphes, nombril du monde
Au pied du Parnasse, le sanctuaire d’**Apollon** passait pour le centre de la Terre : une pierre sacrée, l’**omphalos** (le nombril), le marquait. La **Pythie**, assise sur un trépied, rendait les oracles du dieu ; des prêtres mettaient ses paroles en forme. Sur le temple, deux maximes :
| Maxime | Traduction | Sens |
| Γνῶθι σεαυτόν | Connais-toi toi-même | Sache que tu n’es qu’un homme, pas un dieu |
| Μηδὲν ἄγαν | Rien de trop | Garde la mesure, fuis l’excès |

Apollon avait un surnom éloquent : Λοξίας, « l’Oblique ». Ses réponses ne mentent pas, elles **tournent autour** de la vérité.

## Trois oracles célèbres
1. **Crésus**, roi de Lydie, demande s’il doit attaquer les Perses. Réponse : s’il le fait, il détruira un grand empire. Il attaque… et détruit le sien (Hérodote, livre I).
2. **Les Athéniens**, en 480 av. J.-C., face à l’invasion perse, reçoivent l’ordre de se fier au « rempart de bois ». Thémistocle y voit les navires : ce sera la victoire de **Salamine** (Hérodote, livre VII).
3. **Chéréphon**, ami de Socrate, demande si quelqu’un est plus sage que Socrate. Réponse : personne. Socrate comprend qu’il est le plus sage parce qu’il **sait qu’il ne sait pas** (Platon, *Apologie de Socrate*).

> Un oracle n’est jamais faux : c’est celui qui l’écoute qui se trompe. L’erreur vient de l’orgueil qui choisit le sens qui l’arrange.

## Les autres voix
| Voix | Qui | Ce qu’il faut retenir |
| Dodone | Zeus | On interprète le bruissement d’un chêne sacré |
| Les devins (μάντεις) | Tirésias, Calchas | Tirésias, aveugle, voit la vérité qu’Œdipe refuse |
| Cassandre | Fille de Priam | Apollon lui donne la prophétie, puis la condamne à ne jamais être crue |
| Les songes | Envoyés par les dieux | Dans l’*Odyssée*, Pénélope distingue la porte de corne (songes vrais) et la porte d’ivoire (songes trompeurs) |

Dans l’*Iliade* (chant II), Zeus envoie même à Agamemnon un songe **trompeur** qui le pousse à l’attaque.

## Vocabulaire et étymologie
| Grec | Sens | Héritiers |
| μάντις | le devin | -mancie : cartomancie, nécromancie |
| χρησμός | la réponse de l’oracle | chresmologue |
| ὄνειρος | le rêve | onirique |
| προφήτης | celui qui parle à la place (du dieu) | prophète |
| Πυθία | la prêtresse d’Apollon Pythien | pythie, python |

## Exemple travaillé
Γνῶθι σεαυτόν : γνῶθι, impératif aoriste de γιγνώσκω, « connaître » ; σεαυτόν, pronom réfléchi de la 2e personne à l’accusatif. **« Connais-toi toi-même »** — non pas « explore ta personnalité », mais « souviens-toi que tu es mortel ».`,
          },
          questions: [
            ['Quel dieu parle par la bouche de la Pythie ?', ['Zeus', 'Apollon', 'Hermès', 'Dionysos'], 1, 'Delphes est le sanctuaire d’Apollon Pythien.'],
            ['Que marquait l’omphalos de Delphes ?', ['Le tombeau d’un héros', 'Le trésor d’Athènes', 'Le centre, le nombril du monde', 'L’entrée des Enfers'], 2, 'Omphalos signifie « nombril » : Delphes passait pour le centre de la Terre.'],
            ['Que signifie Μηδὲν ἄγαν ?', ['Rien de trop', 'Rien n’est vrai', 'Connais-toi toi-même', 'Tout passe'], 0, 'La maxime rappelle la mesure grecque, contraire de l’hybris.'],
            ['Que détruit Crésus en attaquant les Perses ?', ['Babylone', 'Athènes', 'L’empire perse', 'Son propre empire'], 3, 'L’oracle disait vrai : un grand empire fut détruit, celui de Crésus.'],
            ['Comment Thémistocle interprète-t-il le « rempart de bois » ?', ['Comme la flotte athénienne', 'Comme les murs de l’Acropole', 'Comme une forêt sacrée', 'Comme le cheval de Troie'], 0, 'Il y voit les navires : la victoire de Salamine en 480 lui donne raison.'],
            ['Pourquoi Socrate est-il le plus sage selon l’oracle ?', ['Parce qu’il sait tout', 'Parce qu’il sait qu’il ne sait pas', 'Parce qu’il est prêtre', 'Parce qu’il a voyagé'], 1, 'Sa sagesse est de connaître les limites de son savoir.'],
            ['Quel surnom porte Apollon, dont les oracles sont ambigus ?', ['Phébus', 'Loxias, l’Oblique', 'Musagète', 'Sauroctone'], 1, 'Loxias signifie « l’Oblique » : ses réponses tournent autour de la vérité.'],
            ['À Dodone, on interprétait le bruissement d’un chêne sacré de Zeus.', ['Vrai', 'Faux'], 0, 'Dodone, en Épire, est le plus ancien oracle de Zeus.'],
            ['De quoi Cassandre est-elle punie par Apollon ?', ['De ne plus voir', 'De ne jamais être crue', 'De perdre la parole', 'De devenir folle'], 1, 'Elle prédit la chute de Troie sans que personne ne la croie.'],
            ['Par quelle porte passent les songes vrais selon Pénélope ?', ['La porte d’ivoire', 'La porte d’or', 'La porte de bronze', 'La porte de corne'], 3, 'Dans l’Odyssée, la corne laisse passer les songes vrais, l’ivoire les trompeurs.'],
            ['Quel mot français vient de ὄνειρος, le rêve ?', ['Onéreux', 'Onirique', 'Honneur', 'Oracle'], 1, 'Onirique qualifie ce qui relève du rêve.'],
            ['Dans Γνῶθι σεαυτόν, σεαυτόν est un pronom réfléchi.', ['Vrai', 'Faux'], 0, 'C’est le réfléchi de la 2e personne à l’accusatif : « toi-même ».'],
          ],
        },
        {
          titre: 'Atrides et Labdacides : les familles maudites',
          axe: 'L’homme, le monde, le destin',
          lecon: {
            titre: 'Mythe et théâtre : héros et familles maudites',
            cours: `Dans la tragédie grecque, on n’hérite pas seulement d’un nom : on hérite d’une **faute**. Deux familles concentrent cette mécanique, et le théâtre moderne n’a jamais cessé d’y revenir.

## Les Atrides : le crime appelle le crime
~ Tantale → Pélops → Atrée et Thyeste → Agamemnon et Ménélas → Oreste et Électre
1. **Atrée**, pour se venger de son frère Thyeste, lui sert ses propres enfants à manger.
2. **Agamemnon**, fils d’Atrée, sacrifie sa fille **Iphigénie** à Aulis pour obtenir les vents qui mèneront la flotte à Troie.
3. **Clytemnestre**, son épouse, le tue à son retour.
4. **Oreste**, leur fils, venge son père en tuant sa mère, puis est poursuivi par les Érinyes.
5. À Athènes, un tribunal, l’**Aréopage**, présidé par Athéna, l’acquitte : la vengeance familiale cède la place à la **justice de la cité**.

C’est le sujet de l’*Orestie* d’**Eschyle** (458 av. J.-C.), la seule trilogie tragique conservée : *Agamemnon*, *Les Choéphores*, *Les Euménides*.

## Les Labdacides : la malédiction de Thèbes
| Personnage | Son destin |
| **Laïos** | Averti par l’oracle que son fils le tuera, il fait exposer l’enfant |
| **Œdipe** | Sauvé, il tue sans le savoir son père à un carrefour, résout l’énigme de la Sphinx, épouse la reine Jocaste, sa mère |
| **Étéocle et Polynice** | Les fils d’Œdipe s’entretuent pour le trône de Thèbes |
| **Antigone** | Elle enterre Polynice malgré l’interdit du roi Créon, et le paie de sa vie |

**Sophocle** en tire *Œdipe roi* et *Antigone* (vers 441 av. J.-C.). Dans *Œdipe roi*, le héros mène lui-même l’enquête qui le perd : plus il cherche la vérité, plus il se rapproche de sa chute.

> Œdipe est à la fois **innocent et coupable** : il n’a pas voulu son crime, mais il l’a commis. C’est ce paradoxe qui fait la tragédie.

## Les mots de la tragédie
| Grec | Sens | Rôle |
| ἄτη | l’égarement envoyé par les dieux | aveugle le héros |
| ὕβρις | la démesure | appelle le châtiment |
| ἁμαρτία | l’erreur, la faute tragique | selon Aristote, le héros tombe par une erreur, non par méchanceté |
| μίασμα | la souillure | le meurtre contamine toute la cité : la peste de Thèbes |
| ἀναγνώρισις | la reconnaissance | le moment où le héros découvre la vérité |
| περιπέτεια | le retournement | le bonheur bascule dans le malheur |

## Le mythe réécrit au XXe siècle
| Pièce moderne | Auteur | Ce qu’elle fait du mythe |
| *La Machine infernale* (1934) | Cocteau | Les dieux ont monté une machine pour broyer un homme |
| *Électre* (1937) | Giraudoux | La pureté d’Électre détruit tout autour d’elle |
| *Les Mouches* (1943) | Sartre | Oreste revendique son acte : l’homme est libre |
| *Antigone* (1944) | Anouilh | Jouée sous l’Occupation, elle oppose le « non » de la jeune fille à la raison d’État |

## Méthode pour le commentaire
Repère dans le texte grec ou traduit les mots du **destin** (μοῖρα, δαίμων), de la **faute** et du **regard** (voir, savoir, aveuglement) : chez Sophocle, voir et savoir viennent de la même racine (οἶδα, « je sais », est de la famille d’εἶδον, « je vis » : savoir, c’est avoir vu).`,
          },
          questions: [
            ['Qui sacrifie Iphigénie à Aulis ?', ['Ménélas', 'Agamemnon', 'Achille', 'Atrée'], 1, 'Agamemnon sacrifie sa fille pour obtenir des vents favorables vers Troie.'],
            ['Quelle est la seule trilogie tragique grecque conservée ?', ['L’Orestie d’Eschyle', 'La trilogie thébaine de Sophocle', 'Les Troyennes d’Euripide', 'Les Perses'], 0, 'L’Orestie (458 av. J.-C.) comprend Agamemnon, Les Choéphores et Les Euménides.'],
            ['Quel tribunal acquitte Oreste dans Les Euménides ?', ['L’Héliée', 'La Boulè', 'L’Ecclésia', 'L’Aréopage'], 3, 'Athéna préside l’Aréopage : la justice de la cité remplace la vengeance.'],
            ['Qui Œdipe tue-t-il à un carrefour sans le savoir ?', ['Créon', 'Laïos, son père', 'Tirésias', 'Polynice'], 1, 'L’oracle s’accomplit : Œdipe tue son père sans le reconnaître.'],
            ['Pourquoi Antigone désobéit-elle à Créon ?', ['Pour prendre le trône', 'Pour sauver Œdipe', 'Pour enterrer son frère Polynice', 'Pour épouser Hémon'], 2, 'Elle place la loi des dieux, qui ordonne d’ensevelir les morts, au-dessus de l’édit du roi.'],
            ['Que désigne l’hamartia selon Aristote ?', ['L’erreur qui fait tomber le héros', 'Le chœur', 'La souillure', 'Le décor'], 0, 'Le héros tragique ne tombe pas par méchanceté, mais par une erreur.'],
            ['Que désigne le mot miasma ?', ['Le retournement', 'La démesure', 'La reconnaissance', 'La souillure'], 3, 'Le meurtre de Laïos souille Thèbes : c’est la cause de la peste au début d’Œdipe roi.'],
            ['Œdipe mène lui-même l’enquête qui le perd.', ['Vrai', 'Faux'], 0, 'Plus il cherche le coupable, plus il se découvre lui-même.'],
            ['Quelle pièce de Jean Anouilh, jouée en 1944, reprend un mythe des Labdacides ?', ['Électre', 'Antigone', 'Les Mouches', 'Médée'], 1, 'Sous l’Occupation, Antigone oppose le refus d’une jeune fille à la raison d’État.'],
            ['Dans Les Mouches de Sartre, qui revendique son acte au nom de la liberté ?', ['Agamemnon', 'Égisthe', 'Électre', 'Oreste'], 3, 'L’Oreste de Sartre assume son meurtre : l’homme est libre face aux dieux.'],
            ['Que désigne l’anagnorisis ?', ['Le chant du chœur', 'La reconnaissance de la vérité par le héros', 'Le sacrifice', 'L’exil'], 1, 'C’est le moment où le héros découvre qui il est ou ce qu’il a fait.'],
            ['Atrée et Thyeste sont les fils de Laïos.', ['Vrai', 'Faux'], 1, 'Ce sont les fils de Pélops ; Laïos appartient aux Labdacides, à Thèbes.'],
          ],
        },
        {
          titre: 'Lucien, Histoires vraies : le mensonge qui dit vrai',
          axe: 'L’homme, le monde, le destin',
          lecon: {
            titre: 'L’œuvre antique au programme 2026-2028',
            cours: `Un narrateur qui annonce d’emblée qu’il va mentir, un voyage sur la Lune, une guerre entre le Soleil et la Lune, un équipage avalé par une baleine : les *Histoires vraies* de Lucien, œuvre antique au programme de la spécialité pour 2026-2028, sont le premier récit de voyage imaginaire assumé de la littérature européenne.

## Lucien de Samosate
Né vers 120 ap. J.-C. à Samosate, sur l’Euphrate (actuelle Turquie), Lucien est un **Syrien** qui a appris le grec et l’écrit à la perfection, dans la langue attique classique. Il appartient à l’époque de la **Seconde Sophistique**, où l’on voyage de ville en ville pour donner des conférences brillantes. Ses dialogues se moquent des philosophes, des dieux, des charlatans et des historiens menteurs.

## Le pacte du menteur
Dans le prologue, Lucien dénonce les voyageurs et historiens qui ont raconté des merveilles invraisemblables comme si elles étaient vraies — il vise Ctésias, Iambule, et même l’Ulysse d’Homère, maître des récits fabuleux chez les Phéaciens. Lui fera l’inverse : ἓν γὰρ δὴ τοῦτο ἀληθεύσω λέγων ὅτι ψεύδομαι, **« la seule chose vraie que je dirai, c’est que je mens »**.

> Le titre est donc un paradoxe : des histoires **vraies** parce qu’elles s’avouent fausses. Le mensonge avoué devient plus honnête que la vérité prétendue.

## Le voyage, en quelques étapes
1. Parti des Colonnes d’Héraclès (Gibraltar) avec cinquante compagnons, le narrateur franchit l’Océan et découvre une île où coule un fleuve de vin et où les vignes sont des femmes.
2. Un tourbillon soulève le navire et le porte en sept jours jusqu’à **la Lune**, habitée.
3. Il y assiste à la guerre entre **Endymion**, roi de la Lune, et **Phaéthon**, roi du Soleil, pour la colonisation de l’étoile du Matin ; les cavaliers montent des « hippogypes », des vautours géants.
4. Chez les Sélénites, les enfants naissent… du mollet des hommes ; un miroir posé sur un puits permet de voir toute la Terre.
5. De retour sur la mer, le navire est avalé par une **baleine** longue de mille cinq cents stades ; l’équipage y vit plus d’un an et demi.
6. Sur l’**Île des Bienheureux**, il rencontre les héros et les sages ; **Homère** lui confie qu’il est babylonien et s’appelait Tigrane ; Ulysse lui remet en secret une lettre pour Calypso.
7. Le récit s’interrompt en promettant une suite… qui n’a jamais existé : un dernier mensonge.

## Vérité et illusion : le sous-ensemble du programme
Le programme inscrit l’œuvre dans « Le grand théâtre du monde : vérité et illusion ». Lucien pose une question d’une étonnante modernité : **à quoi reconnaît-on un récit vrai ?** Ses fantaisies précises, chiffrées, pleines de témoins, imitent les procédés des historiens pour en montrer la fragilité.

| Procédé de Lucien | Ce qu’il vise |
| Chiffres exacts (stades, jours) | L’apparence de précision des historiens |
| « J’ai vu de mes yeux » | L’autorité du témoin oculaire |
| Parodie d’Homère | La confiance aveugle dans les autorités |
| Monde lunaire à l’envers | Nos mœurs vues de loin, relativisées |

## Mots grecs clés
| Grec | Sens | Héritier |
| ἀληθής | vrai (a- privatif + λήθη, l’oubli : ce qui n’est pas caché) | — |
| ψεῦδος | le mensonge | pseudonyme |
| διήγημα | le récit | — |
| θαῦμα | la merveille | thaumaturge |
| σελήνη | la Lune | sélénite |

La vérité grecque, ἀλήθεια, c’est littéralement **le non-oubli**, ce qui sort de l’ombre : Lucien joue avec cette idée en racontant des choses que personne n’a jamais vues.`,
          },
          questions: [
            ['Quelle est la « seule chose vraie » que Lucien annonce dans son prologue ?', ['Qu’il a vu la Lune', 'Qu’il ment', 'Qu’Homère a menti', 'Qu’il est Syrien'], 1, '« Ἓν τοῦτο ἀληθεύσω λέγων ὅτι ψεύδομαι » : la seule vérité est l’aveu du mensonge.'],
            ['De quelle ville Lucien est-il originaire ?', ['Athènes', 'Alexandrie', 'Samosate', 'Syracuse'], 2, 'Samosate, sur l’Euphrate, en Syrie romaine (actuelle Turquie).'],
            ['À quelle époque littéraire Lucien appartient-il ?', ['La Seconde Sophistique', 'L’époque archaïque', 'Le siècle de Périclès', 'L’époque byzantine'], 0, 'Au IIe siècle ap. J.-C., les orateurs grecs donnent des conférences de ville en ville.'],
            ['D’où part le voyage des Histoires vraies ?', ['Du Pirée', 'De Troie', 'De Samosate', 'Des Colonnes d’Héraclès'], 3, 'Le narrateur franchit Gibraltar pour explorer l’Océan inconnu.'],
            ['Qui sont les rois en guerre dans l’épisode lunaire ?', ['Zeus et Cronos', 'Endymion et Phaéthon', 'Apollon et Artémis', 'Hélios et Poséidon'], 1, 'Endymion, roi de la Lune, affronte Phaéthon, roi du Soleil, pour l’étoile du Matin.'],
            ['Où l’équipage vit-il plus d’un an et demi ?', ['Dans le ventre d’une baleine', 'Sur la Lune', 'Dans une grotte', 'Sur l’Île des Bienheureux'], 0, 'Le navire est avalé par une baleine longue de 1 500 stades.'],
            ['Selon Homère rencontré sur l’Île des Bienheureux, quelle est sa vraie origine ?', ['Il est athénien', 'Il est crétois', 'Il est égyptien', 'Il est babylonien'], 3, 'Homère affirme s’appeler Tigrane et être babylonien : Lucien se moque des querelles savantes.'],
            ['Les Histoires vraies sont une parodie des récits de voyage merveilleux.', ['Vrai', 'Faux'], 0, 'Lucien vise Ctésias, Iambule et l’Ulysse d’Homère.'],
            ['Quel mot grec signifie « le mensonge » ?', ['Ἀλήθεια', 'Θαῦμα', 'Ψεῦδος', 'Διήγημα'], 2, 'Ψεῦδος a donné pseudonyme, faux nom.'],
            ['Dans quel sous-ensemble du programme l’œuvre s’inscrit-elle ?', ['Magie et pratiques magiques', 'Le grand théâtre du monde : vérité et illusion', 'Maîtres et disciples', 'Genèse et cosmogonies'], 1, 'Le programme limitatif la place dans « L’homme, le monde, le destin ».'],
            ['Que signifie littéralement ἀλήθεια ?', ['Le non-oubli, ce qui n’est pas caché', 'La lumière', 'L’exactitude', 'La parole'], 0, 'A- privatif + λήθη, l’oubli : la vérité est ce qui sort de l’ombre.'],
            ['Le récit de Lucien s’achève sur une suite réellement écrite.', ['Vrai', 'Faux'], 1, 'Il promet une suite qui n’a jamais existé : c’est un dernier mensonge.'],
          ],
        },
        {
          titre: 'Lucien et Calvino : voir le monde de loin',
          axe: 'L’homme, le monde, le destin',
          lecon: {
            titre: 'Lecture croisée des deux œuvres du programme limitatif',
            cours: `L’un monte dans la Lune, l’autre dans un arbre. Lucien et Italo Calvino inventent deux héros qui **prennent de la hauteur** pour mieux voir le monde — sans jamais cesser de s’y mêler.

## Italo Calvino et Le Baron perché
Italo Calvino (1923-1985), écrivain italien né à Cuba et grandi à San Remo, publie *Il barone rampante* en 1957 ; le livre est le deuxième volet de sa trilogie *Nos ancêtres*, avec *Le Vicomte pourfendu* et *Le Chevalier inexistant*.
Le **15 juin 1767**, à Ombrosa, en Ligurie, Côme (Cosimo) Piovasco di Rondò, douze ans, refuse un plat d’escargots, grimpe dans une yeuse du jardin familial et jure de ne plus jamais redescendre. Il tient parole : il vit toute sa vie dans les arbres, chasse, lit les philosophes des Lumières, aime la belle Viola, participe aux événements de son temps et rencontre même Napoléon. Vieux, il disparaît en s’accrochant à l’ancre d’une montgolfière qui passe au-dessus de la mer. Le récit est fait par son frère cadet, **Biagio**, resté à terre.
Son épitaphe résume le livre : « Vécut dans les arbres. Aima toujours la terre. Monta au ciel. »

## Deux regards d’en haut
| | Lucien, *Histoires vraies* | Calvino, *Le Baron perché* |
| L’élévation | Un tourbillon porte le navire jusqu’à la Lune | Un enfant monte dans un arbre |
| Le narrateur | Le voyageur lui-même, qui avoue mentir | Le frère resté au sol, témoin fidèle |
| Le monde découvert | Des mondes à l’envers, fantastiques | Le même monde, vu d’un autre point de vue |
| La cible | Les historiens, Homère, les philosophes | La société d’Ancien Régime, les révolutions, les illusions |
| Le rapport au réel | La fiction avouée démasque les faux récits | Un seul écart, et tout le réel devient étrange |

> Le mouvement commun : **s’écarter pour voir juste**. Côme ne quitte pas la terre, il la regarde à la bonne distance ; le voyageur de Lucien ne décrit la Lune que pour nous faire voir nos propres mœurs.

## Le theatrum mundi, vu d’en haut
Lucien a pratiqué ce regard ailleurs : dans *Icaroménippe*, le philosophe Ménippe s’envole et voit les hommes s’agiter comme des fourmis ; dans *Charon*, le passeur des morts contemple les vivants depuis une montagne. Vus de haut, les ambitions et les guerres paraissent un **spectacle dérisoire**. Calvino en fait un choix de vie : Côme reste engagé — il aide, combat, écrit — mais à sa manière, du haut de ses branches.

## Pistes pour l’essai
1. **Vérité et illusion** : Lucien prévient qu’il ment ; Biagio avoue qu’il ne sait plus toujours distinguer ce qu’il a vu de ce que son frère lui a raconté.
2. **Distance et engagement** : se retirer du monde ou le voir mieux pour y agir ?
3. **Le voyage** : immense chez Lucien, minuscule chez Calvino (quelques kilomètres d’arbres), mais aussi dépaysant.
4. **Le rire** : parodie savante chez Lucien, fantaisie ironique chez Calvino ; dans les deux cas, le rire sert la pensée.

## Méthode : un paragraphe de confrontation
1. Une idée, formulée en une phrase.
2. Un passage de Lucien, avec un mot grec traduit (ψεῦδος, θαῦμα, σελήνη…).
3. Un passage de Calvino.
4. Ce qui les rapproche, puis ce qui les sépare, et ce que la confrontation fait voir.`,
          },
          questions: [
            ['Quelle œuvre moderne accompagne Lucien au programme limitatif ?', ['Le Petit Prince', 'Le Baron perché', 'Les Villes invisibles', 'Vingt mille lieues sous les mers'], 1, 'Le programme 2026-2028 associe Lucien et Italo Calvino, Le Baron perché.'],
            ['Pourquoi Côme monte-t-il dans l’arbre ?', ['Pour fuir un incendie', 'Pour attraper un oiseau', 'Il refuse un plat d’escargots', 'Il est puni par son père'], 2, 'Le 15 juin 1767, il refuse les escargots et jure de ne plus redescendre.'],
            ['Qui raconte l’histoire de Côme ?', ['Côme lui-même', 'Viola', 'Napoléon', 'Son frère Biagio'], 3, 'Biagio, resté à terre, est le narrateur.'],
            ['Quand Italo Calvino publie-t-il Le Baron perché ?', ['En 1957', 'En 1767', 'En 1923', 'En 1985'], 0, 'Le livre paraît en 1957 ; il forme avec deux autres romans la trilogie Nos ancêtres.'],
            ['Côme redescend sur terre à la fin de sa vie.', ['Vrai', 'Faux'], 1, 'Il ne touche jamais le sol : il disparaît accroché à l’ancre d’une montgolfière.'],
            ['Que dit l’épitaphe de Côme ?', ['Vécut dans les arbres. Aima toujours la terre. Monta au ciel.', 'Ici repose un baron', 'Il ne descendit jamais', 'Il aima la liberté'], 0, 'Trois phrases qui résument le paradoxe : loin de la terre, mais attaché à elle.'],
            ['Dans Icaroménippe de Lucien, à quoi ressemblent les hommes vus d’en haut ?', ['À des géants', 'À des dieux', 'À des fourmis', 'À des oiseaux'], 2, 'Vus du ciel, leurs agitations paraissent dérisoires.'],
            ['Quel mouvement commun rapproche les deux œuvres ?', ['S’écarter pour voir juste', 'Fuir la guerre', 'Chercher un trésor', 'Retrouver sa famille'], 0, 'La distance permet de regarder le monde autrement, sans cesser d’y prendre part.'],
            ['Quel personnage historique Côme rencontre-t-il ?', ['Louis XIV', 'César', 'Voltaire', 'Napoléon'], 3, 'Calvino imagine une rencontre avec Napoléon, qui envie la liberté du baron.'],
            ['Côme reste engagé dans les affaires de son temps malgré sa vie dans les arbres.', ['Vrai', 'Faux'], 0, 'Il aide, combat, lit et écrit : la hauteur n’est pas une fuite.'],
            ['Dans Charon de Lucien, qui contemple les vivants depuis une montagne ?', ['Hermès seul', 'Le passeur des morts', 'Ménippe', 'Zeus'], 1, 'Charon, guidé par Hermès, découvre la vanité des ambitions humaines.'],
            ['Dans quelle région se trouve Ombrosa, le domaine de Côme ?', ['En Toscane', 'En Sicile', 'En Ligurie', 'En Vénétie'], 2, 'Ombrosa est une localité imaginaire de la côte ligure.'],
          ],
        },

        // ===== Croire, savoir, douter =======================================
        {
          titre: 'Circé, Médée, Simaitha : la magie grecque',
          axe: 'Croire, savoir, douter',
          lecon: {
            titre: 'Magie et pratiques magiques',
            cours: `La magie grecque a deux visages : celui des magiciennes de légende, redoutables et fascinantes, et celui, plus modeste, des gens ordinaires qui gravent une malédiction sur une lame de plomb.

## Les magiciennes de la littérature
| Magicienne | Œuvre | Son pouvoir |
| **Circé** | Homère, *Odyssée*, chant X | Change les compagnons d’Ulysse en porcs ; Hermès donne à Ulysse une herbe protectrice, le **moly** |
| **Médée** | Apollonios de Rhodes, *Argonautiques* ; Euripide, *Médée* (431 av. J.-C.) | Aide Jason à conquérir la Toison d’or, puis, trahie, tue ses rivaux et ses propres enfants |
| **Simaitha** | Théocrite, *Idylle* II, *Les Magiciennes* | Jeune femme abandonnée qui tente, la nuit, de faire revenir son amant |

Chez Théocrite (IIIe siècle av. J.-C.), Simaitha fait tourner une petite roue magique, l’**iynx**, et répète un refrain : « Iynx, attire vers ma maison cet homme qui est le mien. » La magie n’est ici qu’un **amour désespéré** : le poème est touchant autant qu’inquiétant.

## Les pratiques réelles
1. **Les tablettes de défixion** (καταδεσμοί, « liens ») : lames de plomb gravées, roulées, percées d’un clou et déposées dans une tombe ; on y « lie » la langue d’un adversaire au tribunal, les jambes d’un concurrent à la course, le cœur d’une personne aimée.
2. **Les papyrus magiques grecs**, trouvés en Égypte et datés de l’époque romaine, livrent de véritables recettes : formules, noms divins étranges, dessins, ingrédients.
3. **Les amulettes** protègent du mauvais œil ; les **figurines percées** envoûtent à distance.
4. **Hécate**, déesse des carrefours, de la nuit et des spectres, est la patronne des magiciennes ; la Thessalie passe pour leur terre d’élection.

> La magie promet de **contraindre** les puissances invisibles par la formule exacte ; la religion civique, elle, se contente de les **prier**.

## Pharmakon : remède ou poison ?
Le mot φάρμακον désigne à la fois la drogue qui soigne, le poison qui tue et le charme magique. Platon, dans le *Phèdre*, l’applique même à l’écriture : aide pour la mémoire, ou poison qui la détruit ? Ce double sens dit l’essentiel : la même puissance peut sauver ou perdre.

## Vocabulaire et étymologie
| Grec | Sens | Héritiers |
| μάγος | mage, prêtre perse | magie, magicien |
| φάρμακον | remède, poison, charme | pharmacie, pharmacologie |
| καταδεσμός | lien magique | — |
| ἐπῳδή | incantation (chant sur) | épode |
| Ἑκάτη | Hécate | — |

## Magie et savoir rationnel
Au même moment, les médecins hippocratiques dénoncent les « purificateurs » et « charlatans » qui prétendent guérir par des incantations : dans le traité *De la maladie sacrée*, l’épilepsie n’est pas plus divine que les autres maladies, elle a une **cause naturelle**. Croire, savoir, douter : les trois attitudes coexistent dans la même cité.`,
          },
          questions: [
            ['En quoi Circé change-t-elle les compagnons d’Ulysse ?', ['En loups', 'En porcs', 'En pierres', 'En oiseaux'], 1, 'Au chant X de l’Odyssée, Circé les transforme en porcs.'],
            ['Quelle herbe protège Ulysse contre Circé ?', ['Le moly', 'L’ambroisie', 'Le lotus', 'La ciguë'], 0, 'Hermès donne à Ulysse le moly, qui rend le charme de Circé inefficace.'],
            ['Qui est l’auteur de la tragédie Médée, jouée en 431 av. J.-C. ?', ['Eschyle', 'Sophocle', 'Aristophane', 'Euripide'], 3, 'Euripide y montre Médée, trahie par Jason, qui tue ses enfants.'],
            ['Que fait tourner Simaitha chez Théocrite ?', ['Un fuseau', 'Un iynx, une roue magique', 'Une toupie de plomb', 'Une meule'], 1, 'L’iynx doit attirer l’amant infidèle vers sa maison.'],
            ['Que signifie le mot grec καταδεσμός ?', ['Un lien, une ligature', 'Une prière', 'Une offrande', 'Un chant'], 0, 'La tablette de défixion « lie » la personne visée.'],
            ['Quelle déesse est la patronne des magiciennes ?', ['Artémis', 'Athéna', 'Hécate', 'Déméter'], 2, 'Hécate règne sur les carrefours, la nuit et les spectres.'],
            ['Le mot pharmakon peut désigner à la fois un remède et un poison.', ['Vrai', 'Faux'], 0, 'C’est aussi le charme magique : la même puissance peut sauver ou perdre.'],
            ['À quoi Platon applique-t-il le mot pharmakon dans le Phèdre ?', ['À la peinture', 'À la musique', 'Au vin', 'À l’écriture'], 3, 'L’écriture est-elle un remède pour la mémoire ou un poison qui la détruit ?'],
            ['Où les papyrus magiques grecs ont-ils été trouvés ?', ['En Grèce', 'En Égypte', 'En Sicile', 'En Gaule'], 1, 'Le climat sec de l’Égypte a conservé ces recueils de formules.'],
            ['Que soutient le traité hippocratique De la maladie sacrée ?', ['Que l’épilepsie est envoyée par les dieux', 'Que seuls les mages peuvent la guérir', 'Que l’épilepsie a une cause naturelle', 'Que la maladie est une punition'], 2, 'Elle n’est pas plus divine que les autres maladies : le médecin cherche sa cause.'],
            ['D’où vient le mot magie ?', ['Du grec μάγος, prêtre perse', 'Du latin magnus', 'De l’égyptien', 'Du nom de Médée'], 0, 'Les mages étaient les prêtres des Perses.'],
            ['La magie cherche à prier les dieux sans prétendre les contraindre.', ['Vrai', 'Faux'], 1, 'C’est l’inverse : la magie prétend contraindre par la formule exacte.'],
          ],
        },
        {
          titre: 'Du muthos au logos : la naissance de la raison',
          axe: 'Croire, savoir, douter',
          lecon: {
            titre: 'Présocratiques, médecins, historiens et savants',
            cours: `Au VIe siècle av. J.-C., sur les côtes d’Ionie, des hommes cessent d’expliquer le monde par les caprices des dieux et cherchent **un principe**. On a appelé ce passage le « passage du *muthos* au *logos* » — du récit à la raison.

## Les présocratiques et la question de l’origine
Leur question : quelle est l’ἀρχή, le **principe** (à la fois origine et commandement) de toutes choses ?
| Penseur | Cité | Sa réponse |
| **Thalès** | Milet | L’eau ; il aurait prédit une éclipse en 585 av. J.-C. |
| **Anaximandre** | Milet | L’ἄπειρον, l’illimité |
| **Anaximène** | Milet | L’air, qui se condense ou se raréfie |
| **Pythagore** | Samos, puis Crotone | Le nombre : le monde est harmonie mathématique |
| **Héraclite** | Éphèse | Le feu et le devenir : tout s’écoule, on ne se baigne jamais deux fois dans le même fleuve |
| **Parménide** | Élée | L’être est, le non-être n’est pas : le changement est une illusion |
| **Empédocle** | Agrigente | Quatre racines — eau, air, terre, feu — unies par l’Amour, séparées par la Haine |
| **Démocrite** | Abdère | Les atomes (ἄτομος, « insécable ») et le vide |

**Xénophane** va jusqu’à critiquer les dieux d’Homère : si les bœufs avaient des mains, ils représenteraient les dieux sous forme de bœufs.

## La médecine d’Hippocrate
**Hippocrate de Cos** (Ve siècle av. J.-C.) et son école observent le malade, notent les symptômes, cherchent des causes naturelles. Le *Corpus hippocratique* expose la théorie des **quatre humeurs** — sang, phlegme, bile jaune, bile noire —, dont l’équilibre fait la santé. Le mot « mélancolie » (bile noire) en est l’héritier.

## L’histoire, une enquête
**Hérodote**, « père de l’histoire », intitule son œuvre ἱστορίη, « enquête ». **Thucydide**, historien de la guerre du Péloponnèse, va plus loin : il écarte le merveilleux, recoupe les témoignages et veut écrire une « acquisition pour toujours » (κτῆμα ἐς αἰεί).

## Les savants d’Alexandrie
| Savant | Siècle av. J.-C. | Découverte |
| **Euclide** | IIIe | Les *Éléments*, fondement de la géométrie |
| **Aristarque de Samos** | IIIe | La Terre tourne autour du Soleil |
| **Ératosthène** | IIIe | Mesure la circonférence de la Terre (environ 252 000 stades) grâce à l’ombre à Syène et à Alexandrie |
| **Archimède** | IIIe | Poussée des liquides (« Eurêka ! »), levier ; tué au siège de Syracuse en 212 |

La **machine d’Anticythère**, retrouvée en 1901 dans une épave, est un calculateur astronomique à engrenages : la preuve que ce savoir s’incarnait aussi dans des objets.

> Muthos et logos ne se succèdent pas d’un coup : Platon lui-même invente des mythes pour dire ce que le raisonnement ne suffit pas à exprimer. La raison grecque **doute**, mais elle continue de raconter.

## Mots clés
| Grec | Sens | Héritiers |
| μῦθος | le récit, la parole | mythe |
| λόγος | la parole raisonnée, la raison, le calcul | logique, -logie |
| φύσις | la nature | physique |
| ἀρχή | le principe, le commencement | archaïque, archéologie |
| ἱστορία | l’enquête | histoire |`,
          },
          questions: [
            ['Que cherchent les présocratiques ?', ['La volonté des dieux', 'L’archè, le principe de toutes choses', 'La meilleure constitution', 'Le salut de l’âme'], 1, 'Ils cherchent un principe naturel, à la fois origine et fondement du monde.'],
            ['Quel est le principe selon Thalès de Milet ?', ['L’eau', 'Le feu', 'Le nombre', 'L’air'], 0, 'Thalès fait de l’eau le principe de toutes choses.'],
            ['Quel philosophe affirme qu’on ne se baigne jamais deux fois dans le même fleuve ?', ['Parménide', 'Démocrite', 'Héraclite', 'Thalès'], 2, 'Pour Héraclite d’Éphèse, tout s’écoule et devient.'],
            ['Que signifie ἄτομος ?', ['Minuscule', 'Invisible', 'Éternel', 'Insécable'], 3, 'A- privatif + τέμνω, couper : ce qu’on ne peut pas diviser.'],
            ['Quelles sont les quatre racines d’Empédocle ?', ['Eau, air, terre, feu', 'Sang, phlegme, bile jaune, bile noire', 'Nombre, forme, mouvement, repos', 'Être, non-être, vide, plein'], 0, 'Elles sont unies par l’Amour et séparées par la Haine.'],
            ['Selon Hippocrate, la santé dépend de l’équilibre des quatre humeurs.', ['Vrai', 'Faux'], 0, 'Sang, phlegme, bile jaune et bile noire doivent rester en équilibre.'],
            ['Quel mot français vient de « bile noire » ?', ['Colère', 'Mélancolie', 'Flegme', 'Sanguin'], 1, 'Μέλαινα χολή, la bile noire, a donné mélancolie.'],
            ['Que signifie le mot historiè chez Hérodote ?', ['Le récit merveilleux', 'La chronique royale', 'La mémoire', 'L’enquête'], 3, 'L’histoire commence comme une enquête sur les causes des guerres médiques.'],
            ['Qui a mesuré la circonférence de la Terre ?', ['Euclide', 'Archimède', 'Ératosthène', 'Thalès'], 2, 'Ératosthène compare l’ombre à Syène et à Alexandrie et trouve environ 252 000 stades.'],
            ['Quel savant a soutenu que la Terre tourne autour du Soleil ?', ['Aristarque de Samos', 'Pythagore', 'Anaximène', 'Hippocrate'], 0, 'Au IIIe siècle av. J.-C., bien avant Copernic.'],
            ['Xénophane critique la façon dont Homère représente les dieux.', ['Vrai', 'Faux'], 0, 'Si les bœufs avaient des mains, ils peindraient des dieux-bœufs : les hommes font les dieux à leur image.'],
            ['Que veut écrire Thucydide ?', ['Un récit plaisant pour un concours', 'Une acquisition pour toujours', 'Un éloge d’Athènes', 'Un recueil d’oracles'], 1, 'Κτῆμα ἐς αἰεί : une œuvre utile à tous ceux qui voudront comprendre.'],
          ],
        },
        {
          titre: 'Maîtres et disciples : de Socrate à Alexandre',
          axe: 'Croire, savoir, douter',
          lecon: {
            titre: 'Transmettre le savoir en Grèce ancienne',
            cours: `En Grèce, le savoir ne se lit pas d’abord dans les livres : il se **transmet de personne à personne**, dans un dialogue, une promenade, une amitié. Une chaîne de maîtres et de disciples va de Socrate à Alexandre le Grand.

## La chaîne la plus célèbre
~ Socrate → Platon → Aristote → Alexandre le Grand
| Maître | Dates | Son école | Son disciple |
| **Socrate** | 470-399 av. J.-C. | Aucune : la rue, l’agora, les gymnases | Platon, Xénophon, Alcibiade |
| **Platon** | vers 428-348 | L’**Académie** (vers 387), dans le jardin du héros Akadémos | Aristote, pendant vingt ans |
| **Aristote** | 384-322 | Le **Lycée** (335) : on y discute en marchant, d’où les « péripatéticiens » | Alexandre, dont il est le précepteur à partir de 343 |

## Socrate, le maître qui ne sait rien
Socrate n’écrit rien et prétend ne rien savoir. Il interroge, pousse son interlocuteur à la contradiction (l’**ironie**, εἰρωνεία, « interrogation feinte »), puis l’aide à trouver en lui-même la vérité : c’est la **maïeutique**, l’art d’accoucher les esprits — sa mère était sage-femme. Dans le *Ménon*, Platon le montre faisant découvrir à un jeune esclave, par de simples questions, comment doubler la surface d’un carré.
En 399, il est condamné à boire la ciguë pour **impiété** et **corruption de la jeunesse**. Il refuse de s’évader : le *Phédon* raconte ses dernières heures.

## Les sophistes, maîtres payants
Protagoras, Gorgias et les autres **sophistes** enseignent contre salaire l’art de persuader. Protagoras affirme : « l’homme est la mesure de toutes choses ». Platon les accuse de préférer le vraisemblable au vrai ; ils ont pourtant inventé l’enseignement supérieur.

## Les écoles et leur fidélité
| École | Fondateur | Lieu | Ce qu’on y transmet |
| Pythagoriciens | Pythagore | Crotone | Un mode de vie et des secrets ; la formule αὐτὸς ἔφα, « lui-même l’a dit » |
| Le Jardin | Épicure | Athènes | L’amitié et la sagesse du plaisir mesuré |
| Le Portique | Zénon | Athènes | La vertu stoïcienne |

> La relation maître-disciple n’est pas la soumission : Aristote critique Platon, et on lui prête ce mot : « Ami de Platon, mais plus encore ami de la vérité. »

## L’école au quotidien
Le **pédagogue** (παιδαγωγός) n’était pas le professeur, mais l’esclave qui **conduisait l’enfant** (παῖς + ἄγω) chez ses maîtres : le grammatiste pour les lettres, le cithariste pour la musique, le pédotribe pour la gymnastique. L’idéal d’éducation complète s’appelle la **paideia**.

## Étymologie
| Grec | Sens | Héritiers |
| σχολή | le loisir | école, scolaire : étudier, c’est avoir du temps libre |
| μαθητής | celui qui apprend | mathématiques (ce qu’on apprend) |
| διδάσκαλος | le maître | didactique |
| μαιεία | l’art de la sage-femme | maïeutique |
| ἀκαδημία | le jardin d’Akadémos | académie |`,
          },
          questions: [
            ['Quelle école Platon fonde-t-il vers 387 av. J.-C. ?', ['Le Lycée', 'Le Jardin', 'L’Académie', 'Le Portique'], 2, 'L’Académie tire son nom du jardin du héros Akadémos.'],
            ['De qui Aristote est-il le précepteur ?', ['Périclès', 'Alexandre le Grand', 'Alcibiade', 'Philippe de Macédoine'], 1, 'À partir de 343, Aristote éduque le jeune Alexandre, fils de Philippe.'],
            ['Pourquoi appelle-t-on les disciples d’Aristote les péripatéticiens ?', ['Ils discutaient en marchant', 'Ils voyageaient sans cesse', 'Ils vivaient à la campagne', 'Ils étaient militaires'], 0, 'Le verbe περιπατεῖν signifie se promener : on discutait en marchant au Lycée.'],
            ['Qu’est-ce que la maïeutique ?', ['L’art de convaincre les foules', 'L’art de la mémoire', 'L’art de chanter', 'L’art d’accoucher les esprits'], 3, 'Socrate aide son interlocuteur à trouver la vérité en lui-même.'],
            ['De quoi Socrate est-il accusé en 399 ?', ['De trahison', 'De vol', 'D’impiété et de corruption de la jeunesse', 'De tyrannie'], 2, 'Condamné, il boit la ciguë et refuse de s’évader.'],
            ['Socrate a laissé de nombreux écrits.', ['Vrai', 'Faux'], 1, 'Il n’a rien écrit : on le connaît par Platon et Xénophon.'],
            ['Quelle formule résume la pensée de Protagoras ?', ['L’homme est la mesure de toutes choses', 'Connais-toi toi-même', 'Tout s’écoule', 'Je sais que je ne sais rien'], 0, 'Pour ce sophiste, la vérité est relative à celui qui juge.'],
            ['Que faisait le pédagogue dans la Grèce ancienne ?', ['Il enseignait la philosophie', 'Il conduisait l’enfant chez ses maîtres', 'Il dirigeait l’école', 'Il enseignait la gymnastique'], 1, 'Παῖς + ἄγω : l’esclave qui conduit l’enfant.'],
            ['Que signifiait σχολή, qui a donné « école » ?', ['Le travail', 'La salle', 'Le loisir', 'La discipline'], 2, 'Étudier, c’était avoir du temps libre, loin du travail nécessaire.'],
            ['Dans le Ménon, que découvre le jeune esclave interrogé par Socrate ?', ['La valeur de pi', 'Le théorème de Thalès', 'La distance de la Lune', 'Comment doubler la surface d’un carré'], 3, 'Par de simples questions, il trouve qu’il faut construire le carré sur la diagonale.'],
            ['Aristote a critiqué certaines idées de son maître Platon.', ['Vrai', 'Faux'], 0, 'On lui prête le mot : « Ami de Platon, mais plus encore ami de la vérité. »'],
            ['Quel mot français vient de μαθητής, celui qui apprend ?', ['Méthode', 'Mathématiques', 'Mythe', 'Marathon'], 1, 'Les mathématiques sont, littéralement, ce qu’on apprend.'],
          ],
        },
        {
          titre: 'Mystères d’Éleusis et Paul à l’Aréopage',
          axe: 'Croire, savoir, douter',
          lecon: {
            titre: 'Polythéismes et monothéismes dans le monde grec',
            cours: `La religion grecque n’a ni livre sacré ni dogme : elle est faite de rites, de fêtes et de récits. Pourtant, c’est **en grec** que le christianisme s’est d’abord écrit et répandu.

## La religion de la cité
Les douze **Olympiens** sont honorés par des **sacrifices** (θυσία) et des fêtes civiques, comme les Panathénées d’Athènes, en l’honneur d’Athéna. Ce qui compte, c’est le geste accompli correctement, au nom de toute la cité ; la piété (εὐσέβεια) est le respect des rites et des dieux de la cité. Ne pas les honorer, c’est l’**impiété** (ἀσέβεια) : l’accusation portée contre Socrate.

## Les cultes à mystères
À côté du culte public, des cultes réservés aux **initiés** (μύσται) promettent un sort meilleur après la mort.
| Culte | Divinités | Ce qu’on sait |
| **Mystères d’Éleusis** | Déméter et sa fille Perséphone (Korè) | Initiation annuelle près d’Athènes ; le secret a été si bien gardé qu’on ignore ce qui était montré |
| **Orphisme** | Orphée, Dionysos | L’âme, immortelle, est prisonnière du corps ; des lamelles d’or guident le mort |
| **Culte de Dionysos** | Dionysos | L’extase, la transe des bacchantes (Euripide, *Les Bacchantes*) |
| **Asclépios** à Épidaure | Le dieu médecin | Le malade dort dans le sanctuaire et reçoit en songe un remède |

Le mythe d’Éleusis explique les saisons : Hadès enlève Perséphone ; Déméter, en deuil, laisse la terre stérile ; la jeune fille revient chaque printemps auprès de sa mère.

## Le grec, langue de la Bible
1. **La Septante** (IIIe-IIe siècle av. J.-C.) : à Alexandrie, la Bible hébraïque est traduite en grec pour les Juifs de langue grecque.
2. **Le Nouveau Testament** est écrit en grec commun, la κοινή. L’Évangile de Jean commence : Ἐν ἀρχῇ ἦν ὁ λόγος, « au commencement était le Verbe » — le λόγος des philosophes devient le nom du Christ.
3. **Paul à Athènes** (*Actes des Apôtres*, 17) : devant l’Aréopage, il dit avoir vu un autel dédié Ἀγνώστῳ θεῷ, « au dieu inconnu », et annonce ce dieu aux Athéniens. Certains se moquent quand il parle de résurrection ; quelques-uns le suivent.

> Le christianisme emprunte à la culture grecque sa langue, ses concepts (λόγος, ψυχή) et sa rhétorique ; mais son Dieu unique, qui se révèle et exige l’exclusivité, rompt avec le polythéisme civique.

## Des mots grecs devenus chrétiens
| Grec | Sens premier | Sens chrétien |
| ἐκκλησία | l’assemblée des citoyens | l’Église |
| εὐαγγέλιον | la bonne nouvelle | l’Évangile |
| ἄγγελος | le messager | l’ange |
| Χριστός | celui qui a reçu l’onction | le Christ (traduction de « Messie ») |
| βάπτισμα | l’immersion | le baptême |
| ἐπίσκοπος | le surveillant | l’évêque |

Les premiers chrétiens dessinaient un poisson, ἰχθύς : ses lettres sont les initiales de « Jésus-Christ, Fils de Dieu, Sauveur ».

## La fin du paganisme
L’empereur **Julien** (361-363), élevé dans la culture grecque, tente de restaurer les anciens cultes — les chrétiens l’appelleront « l’Apostat ». À la fin du IVe siècle, Théodose interdit les sacrifices païens. Le philosophe **Plotin** (IIIe siècle), avec son Un d’où tout émane, avait entre-temps offert au monothéisme un langage philosophique.`,
          },
          questions: [
            ['Quelles divinités honore-t-on aux mystères d’Éleusis ?', ['Apollon et Artémis', 'Déméter et Perséphone', 'Zeus et Héra', 'Dionysos et Ariane'], 1, 'Les mystères d’Éleusis célèbrent la mère et la fille, et le retour de la vie.'],
            ['Que signifie le mot grec μύσται ?', ['Les initiés', 'Les prêtres', 'Les devins', 'Les pèlerins'], 0, 'Les mystes sont les initiés aux mystères ; d’où « mystère ».'],
            ['Quelle accusation fut portée contre Socrate ?', ['L’hybris', 'L’ostracisme', 'La trahison', 'L’asébeia, l’impiété'], 3, 'L’ἀσέβεια est le manque de respect envers les dieux de la cité.'],
            ['Qu’est-ce que la Septante ?', ['Un concile', 'Le Nouveau Testament', 'La traduction grecque de la Bible hébraïque', 'Un recueil d’hymnes orphiques'], 2, 'Réalisée à Alexandrie, elle permet aux Juifs de langue grecque de lire l’Écriture.'],
            ['Dans quelle langue le Nouveau Testament a-t-il été écrit ?', ['En hébreu', 'En latin', 'En araméen', 'En grec'], 3, 'Il est écrit en koinè, le grec commun de la Méditerranée orientale.'],
            ['Que signifie Ἐν ἀρχῇ ἦν ὁ λόγος ?', ['Au commencement était le Verbe', 'Au début était la lumière', 'Le principe est la raison', 'La parole est éternelle'], 0, 'C’est le début de l’Évangile de Jean.'],
            ['À quel dieu est dédié l’autel dont parle Paul à Athènes ?', ['À Zeus', 'Au dieu inconnu', 'À Athéna', 'Au dieu des Juifs'], 1, 'Paul s’appuie sur l’autel « au dieu inconnu » pour annoncer son Dieu.'],
            ['Le mot ἐκκλησία désignait d’abord l’assemblée des citoyens.', ['Vrai', 'Faux'], 0, 'L’Ecclésia athénienne est devenue le nom de l’Église chrétienne.'],
            ['Que signifie ἄγγελος ?', ['Le saint', 'Le prophète', 'Le messager', 'L’ailé'], 2, 'L’ange est d’abord un messager.'],
            ['Quel empereur tente de restaurer les cultes païens au IVe siècle ?', ['Constantin', 'Théodose', 'Hadrien', 'Julien'], 3, 'Julien, dit l’Apostat, règne de 361 à 363.'],
            ['Que dessinaient les premiers chrétiens pour se reconnaître ?', ['Une colombe', 'Un poisson', 'Un agneau', 'Une croix de Malte'], 1, 'ἰχθύς : initiales de « Jésus-Christ, Fils de Dieu, Sauveur ».'],
            ['La religion grecque traditionnelle repose sur un livre sacré unique.', ['Vrai', 'Faux'], 1, 'Elle n’a ni livre sacré ni dogme : ce sont des rites, des fêtes et des récits.'],
          ],
        },

        // ===== Enseignement optionnel ======================================
        {
          titre: 'Épicure, Épictète, Diogène : les écoles de sagesse',
          axe: 'Leçons de sagesse antique',
          lecon: {
            titre: 'Comment vivre heureux selon les Grecs',
            cours: `Après Socrate, les philosophes grecs posent tous la même question : **comment vivre heureux** dans un monde qu’on ne maîtrise pas ? Leurs réponses, nées à Athènes entre le IVe et le IIIe siècle av. J.-C., n’ont jamais cessé d’être lues.

## Le bonheur, but de la vie
Tous visent l’εὐδαιμονία, le bonheur (littéralement : avoir un bon *daimôn*). Mais chacun propose son chemin.
| École | Fondateur | Le bonheur, c’est… | Sa formule |
| Cynisme | Diogène de Sinope | Vivre selon la nature, sans besoins | Rejeter les conventions |
| Épicurisme | Épicure (341-270) | L’ἀταραξία, l’absence de trouble | Le plaisir mesuré |
| Stoïcisme | Zénon de Citium (vers 300) | La vertu, l’accord avec la raison | Distinguer ce qui dépend de nous |
| Aristotélisme | Aristote | L’exercice de la vertu, au juste milieu (μεσότης) | Ni lâche ni téméraire : courageux |

## Diogène, le philosophe-chien
Diogène vit dans une jarre (πίθος), mendie, provoque. On raconte qu’il se promenait en plein jour avec une lanterne en disant : « Je cherche un homme. » Quand Alexandre le Grand lui demande ce qu’il désire, il répond : « Ôte-toi de mon soleil. » Le mot **cynique** vient de κύων, le chien : Diogène vivait comme lui, sans honte ni besoins.

## Épicure et le quadruple remède
Dans son **Jardin**, Épicure accueille amis, femmes et esclaves. Sa *Lettre à Ménécée* résume le **tetrapharmakos**, le quadruple remède :
1. Les dieux ne sont pas à craindre.
2. La mort n’est rien pour nous : quand elle est là, nous ne sommes plus.
3. Le bien est facile à obtenir.
4. Le mal est facile à supporter.
Il distingue les désirs **naturels et nécessaires** (manger, boire, l’amitié), les désirs naturels non nécessaires (les mets raffinés), et les désirs **vains** (la gloire, la richesse), à fuir.

> L’épicurien n’est pas un jouisseur : du pain, de l’eau, des amis, et l’esprit tranquille, voilà le vrai plaisir.

## Épictète et ce qui dépend de nous
Esclave affranchi, **Épictète** (vers 50-130 ap. J.-C.) enseigne le stoïcisme ; son disciple Arrien rédige le *Manuel*, qui commence ainsi : Τῶν ὄντων τὰ μέν ἐστιν ἐφ᾽ ἡμῖν, τὰ δὲ οὐκ ἐφ᾽ ἡμῖν — « Parmi les choses, les unes dépendent de nous, les autres n’en dépendent pas. »
| Dépend de nous | Ne dépend pas de nous |
| Nos jugements, nos désirs, nos actions | Le corps, la richesse, la réputation, le pouvoir |
Le malheur vient de vouloir ce qui ne dépend pas de nous. L’empereur **Marc Aurèle** écrira plus tard ses *Pensées pour moi-même*… en grec.

## Figures de sages
| Sage | Ce qu’on retient |
| Pythagore | Une communauté, un régime de vie, l’âme qui migre |
| Socrate | « Nul n’est méchant volontairement » : le mal est une ignorance |
| Diogène | La liberté par le dénuement |
| Épictète | La liberté intérieure, même dans l’esclavage |

## Vocabulaire
εὐδαιμονία (bonheur), ἀταραξία (absence de trouble : ataraxie), ἀπάθεια (absence de passion : apathie, au sens premier), ἀρετή (excellence, vertu), σοφία (sagesse, d’où philosophie : l’amour de la sagesse).`,
          },
          questions: [
            ['Que signifie ἀταραξία, but de l’épicurisme ?', ['L’absence de trouble', 'L’absence de désir', 'La vertu', 'La gloire'], 0, 'L’ataraxie est la tranquillité de l’âme.'],
            ['D’où vient le mot cynique ?', ['De κύων, le chien', 'De Cynthie', 'De κινεῖν, bouger', 'De κενός, vide'], 0, 'Diogène vivait comme un chien, sans honte ni besoins.'],
            ['Que répond Diogène à Alexandre qui lui demande ce qu’il désire ?', ['Une maison', 'Ta sagesse', 'Rien', 'Ôte-toi de mon soleil'], 3, 'Le philosophe montre qu’il n’a besoin de rien, pas même d’un roi.'],
            ['Comment s’appelle l’école d’Épicure ?', ['Le Portique', 'Le Jardin', 'Le Lycée', 'L’Académie'], 1, 'Épicure y accueille amis, femmes et esclaves.'],
            ['Selon le quadruple remède, la mort n’est rien pour nous.', ['Vrai', 'Faux'], 0, 'Quand elle est là, nous ne sommes plus : il n’y a rien à craindre.'],
            ['Quel désir est naturel et nécessaire selon Épicure ?', ['La gloire', 'La richesse', 'Boire quand on a soif', 'Les mets raffinés'], 2, 'Les désirs vains, comme la gloire et la richesse, sont à fuir.'],
            ['Que distingue Épictète au début du Manuel ?', ['Le corps et l’âme', 'Ce qui dépend de nous et ce qui n’en dépend pas', 'Les dieux et les hommes', 'Le plaisir et la douleur'], 1, 'Le malheur vient de vouloir ce qui ne dépend pas de nous.'],
            ['Quelle était la condition d’Épictète avant d’enseigner ?', ['Roi', 'Soldat', 'Prêtre', 'Esclave'], 3, 'Esclave affranchi, il fait de la liberté intérieure le cœur de sa sagesse.'],
            ['Dans quelle langue Marc Aurèle a-t-il écrit ses Pensées ?', ['En latin', 'En grec', 'En araméen', 'En étrusque'], 1, 'L’empereur romain philosophe écrit en grec, langue de la philosophie.'],
            ['Pour Épicure, le vrai plaisir consiste à accumuler les jouissances.', ['Vrai', 'Faux'], 1, 'C’est un plaisir mesuré : du pain, de l’eau, des amis, l’esprit tranquille.'],
            ['Qui a fondé le stoïcisme ?', ['Épictète', 'Diogène', 'Zénon de Citium', 'Aristote'], 2, 'Zénon enseignait sous le Portique peint, la Stoa, vers 300 av. J.-C.'],
            ['Que signifie le mot philosophie ?', ['La science de la nature', 'L’amour de la sagesse', 'L’art de parler', 'La connaissance de soi'], 1, 'Φιλία, l’amour, et σοφία, la sagesse.'],
          ],
        },

        // ===== Méditerranée : présence des mondes antiques =================
        {
          titre: 'Alexandrie, Pergame, Delphes : la Méditerranée grecque',
          axe: 'Méditerranée : présence des mondes antiques',
          lecon: {
            titre: 'Sites, cités, lieux de savoir et héritage de l’art grec',
            cours: `Les Grecs n’ont jamais formé un seul État, mais ils ont semé des cités sur tout le pourtour de la Méditerranée. Platon les comparait à des **grenouilles autour d’une mare**.

## La colonisation grecque
Du VIIIe au VIe siècle av. J.-C., manque de terres et goût du commerce poussent les cités grecques à fonder des colonies (ἀποικίαι).
@ 733 av. J.-C. — fondation de Syracuse, en Sicile, par Corinthe
@ vers 660 av. J.-C. — fondation de Byzance, sur le Bosphore
@ vers 600 av. J.-C. — fondation de Massalia (Marseille) par les Phocéens
@ 331 av. J.-C. — Alexandre fonde Alexandrie, en Égypte

L’Italie du Sud et la Sicile deviennent la **Grande-Grèce** : les temples doriques de Paestum ou la vallée des Temples d’Agrigente comptent parmi les mieux conservés du monde grec.

## Les grands sites
| Site | Pays actuel | Ce qu’il faut savoir |
| **Athènes**, l’Acropole | Grèce | Parthénon (447-432 av. J.-C.), sous Périclès, décor sculpté dirigé par Phidias |
| **Delphes** | Grèce | Sanctuaire d’Apollon, commun à tous les Grecs |
| **Olympie** | Grèce | Jeux en l’honneur de Zeus, tous les quatre ans |
| **Knossos** | Crète | Palais minoen, fouillé par Arthur Evans à partir de 1900 |
| **Éphèse** | Turquie | Temple d’Artémis, l’une des Sept Merveilles |
| **Pergame** | Turquie | Bibliothèque célèbre ; son grand autel est aujourd’hui à Berlin |

## Lieux de culture et figures du savoir
**Alexandrie**, fondée par Alexandre, devient sous les **Ptolémées** la capitale du savoir. Le **Mouseion** (« lieu des Muses », d’où musée) accueille des savants nourris par le roi ; la **Bibliothèque** veut rassembler tous les livres du monde, et l’on raconte que les navires en escale devaient laisser copier leurs rouleaux. Euclide, Ératosthène et bien d’autres y travaillent. Le **Phare**, sur l’île de Pharos, est une des Sept Merveilles — et a donné son nom à tous les phares.

Pergame, rivale d’Alexandrie, aurait développé le **parchemin** (*pergamena*, « peau de Pergame ») quand l’Égypte lui refusa le papyrus.

> Le patrimoine grec est **partagé** entre des pays qui ne parlent plus grec : Turquie, Italie, Égypte, Libye, France. Il est aussi disputé : la Grèce réclame les marbres du Parthénon conservés au British Museum depuis le début du XIXe siècle.

## L’art grec et ses héritiers
| Époque | Œuvre | Ce qu’elle invente |
| Archaïque | Les *kouroi* | Le corps nu du jeune homme, debout, pied gauche en avant |
| Classique | Le *Doryphore* de Polyclète | Le *contrapposto* : poids du corps sur une jambe, équilibre vivant |
| Hellénistique | La *Victoire de Samothrace*, la *Vénus de Milo* (Louvre) | Le mouvement, le drapé, l’émotion |

Les trois **ordres** architecturaux — dorique, ionique, corinthien — organisent encore les façades des opéras, des banques et des palais de justice.

## Méthode : situer un site
Pour chaque site : **pays actuel**, **époque**, **fonction** (sanctuaire, cité, palais, bibliothèque), **un monument** précis, et **un enjeu d’aujourd’hui** (tourisme, restitution, conservation).`,
          },
          questions: [
            ['À quoi Platon comparait-il les Grecs installés autour de la Méditerranée ?', ['À des fourmis', 'À des grenouilles autour d’une mare', 'À des abeilles', 'À des oiseaux migrateurs'], 1, 'L’image dit la dispersion des cités grecques sur les rivages.'],
            ['Quelle ville française est une colonie grecque fondée par les Phocéens ?', ['Lyon', 'Nîmes', 'Marseille', 'Bordeaux'], 2, 'Massalia est fondée vers 600 av. J.-C.'],
            ['Qui fonde Alexandrie en 331 av. J.-C. ?', ['Alexandre le Grand', 'Ptolémée Ier', 'Périclès', 'César'], 0, 'La ville porte son nom ; les Ptolémées en font la capitale du savoir.'],
            ['Que signifie Mouseion, d’où vient « musée » ?', ['Le trésor', 'La salle de lecture', 'Le lieu des Muses', 'La maison du roi'], 2, 'Le Mouseion d’Alexandrie accueillait des savants nourris par le roi.'],
            ['Quel matériau d’écriture porte le nom de Pergame ?', ['Le papyrus', 'Le parchemin', 'La tablette de cire', 'Le papier'], 1, 'Pergamena : la « peau de Pergame ».'],
            ['Où se trouve aujourd’hui le grand autel de Pergame ?', ['À Berlin', 'À Athènes', 'À Istanbul', 'À Londres'], 0, 'Il a été transporté et remonté dans un musée berlinois.'],
            ['Quand le Parthénon est-il construit ?', ['Vers 700 av. J.-C.', 'En 331 av. J.-C.', 'En 146 av. J.-C.', 'Entre 447 et 432 av. J.-C.'], 3, 'Sous Périclès, avec un décor sculpté dirigé par Phidias.'],
            ['Le Phare d’Alexandrie était l’une des Sept Merveilles du monde.', ['Vrai', 'Faux'], 0, 'Construit sur l’île de Pharos, il a donné son nom à tous les phares.'],
            ['Qu’invente le Doryphore de Polyclète ?', ['Le drapé mouillé', 'Le contrapposto', 'La perspective', 'Le portrait réaliste'], 1, 'Le poids sur une jambe donne au corps un équilibre vivant.'],
            ['Où sont conservées la Victoire de Samothrace et la Vénus de Milo ?', ['Au British Museum', 'Au Vatican', 'Au musée d’Athènes', 'Au Louvre'], 3, 'Ces deux chefs-d’œuvre hellénistiques sont au Louvre.'],
            ['Knossos est un palais minoen de Crète.', ['Vrai', 'Faux'], 0, 'Arthur Evans l’a fouillé à partir de 1900.'],
            ['Quel ensemble de cités grecques porte le nom de Grande-Grèce ?', ['Les cités d’Asie Mineure', 'L’Italie du Sud et la Sicile', 'Les îles de l’Égée', 'L’Égypte grecque'], 1, 'Paestum, Syracuse, Agrigente en sont les grands sites.'],
          ],
        },

        // ===== Étude de la langue ===========================================
        {
          titre: 'Troisième déclinaison, αὐτός et aoriste passif',
          axe: 'Étude de la langue',
          lecon: {
            titre: 'La langue de l’option en Terminale',
            cours: `Le programme de Terminale complète la morphologie : la troisième déclinaison, les comparatifs irréguliers, l’aoriste moyen et passif, le subjonctif. Autant de formes qui reviennent à chaque ligne des textes.

## La troisième déclinaison
Le **génitif singulier** donne le radical : on le cherche toujours au dictionnaire.
| Nominatif | Génitif | Sens | Type |
| ὁ φύλαξ | τοῦ φύλακος | le gardien | radical en consonne |
| ἡ πόλις | τῆς πόλεως | la cité | thème en -ι |
| ὁ βασιλεύς | τοῦ βασιλέως | le roi | thème en -ευ |
| τὸ γένος | τοῦ γένους | la race, le genre | neutre en -ος |

| Cas | πόλις | βασιλεύς |
| Nominatif | πόλις | βασιλεύς |
| Accusatif | πόλιν | βασιλέα |
| Génitif | πόλεως | βασιλέως |
| Datif | πόλει | βασιλεῖ |

!> τὸ γένος est un **neutre de la 3e déclinaison**, pas un masculin de la 2e comme λόγος : son génitif est γένους.

## Les comparatifs irréguliers
| Adjectif | Comparatif | Superlatif |
| ἀγαθός (bon) | ἀμείνων, βελτίων, κρείττων | ἄριστος, βέλτιστος, κράτιστος |
| κακός (mauvais) | κακίων, χείρων | κάκιστος, χείριστος |
| μέγας (grand) | μείζων | μέγιστος |
| πολύς (nombreux) | πλείων | πλεῖστος |
D’ἄριστος vient l’**aristocratie**, le pouvoir des meilleurs.

## Les trois emplois de αὐτός
| Emploi | Position | Exemple | Sens |
| Pronom personnel | cas obliques, seul | ὁρῶ αὐτόν | je le vois |
| « Lui-même » | hors du groupe article-nom | αὐτὸς ὁ βασιλεύς | le roi lui-même |
| « Le même » | entre l’article et le nom | ὁ αὐτὸς βασιλεύς | le même roi |

## Aoriste moyen et passif
| Forme | λύω (délier) |
| Aoriste moyen | ἐλυσάμην (je me déliai), infinitif λύσασθαι |
| Aoriste passif | ἐλύθην (je fus délié), infinitif λυθῆναι |
| Participe aoriste passif | λυθείς, λυθεῖσα, λυθέν |
Repère : le suffixe **-θη-** signale le passif ; l’aoriste **moyen**, lui, n’en a pas : thématique, il fait λαβέσθαι (de λαμβάνω).

## Le subjonctif, le but, la conséquence
Le subjonctif se reconnaît à ses **voyelles longues** : λύω, λύῃς, λύῃ, λύωμεν, λύητε, λύωσι.
| Proposition | Conjonction | Mode |
| But | ἵνα, ὅπως | subjonctif (après un présent) |
| Conséquence réelle | ὥστε | indicatif |
| Conséquence possible | ὥστε | infinitif |

## Aspect et négation
L’**aoriste** voit l’action comme un point, le **présent** comme une durée : ce n’est pas d’abord une question d’époque. Quant aux négations : **οὐ** nie un fait, **μή** une volonté, une hypothèse, un but (avec le subjonctif, l’impératif, l’infinitif).

## Le temps
Accusatif de **durée** (τρεῖς ἡμέρας, pendant trois jours), génitif d’**époque** (νυκτός, de nuit), datif de **date** (τῇ ὑστεραίᾳ, le lendemain).`,
          },
          questions: [
            ['Quel est le génitif de πόλις ?', ['Πόλου', 'Πόλεως', 'Πόλει', 'Πόλιν'], 1, 'Πόλις, πόλεως : thème en -ι de la 3e déclinaison.'],
            ['Quel est le génitif de τὸ γένος ?', ['Τοῦ γένου', 'Τοῦ γενοῦ', 'Τοῦ γένους', 'Τῆς γένης'], 2, 'C’est un neutre de la 3e déclinaison, génitif γένους.'],
            ['Quel superlatif correspond à ἀγαθός ?', ['Ἄριστος', 'Μέγιστος', 'Κάκιστος', 'Πλεῖστος'], 0, 'D’ἄριστος vient l’aristocratie, le pouvoir des meilleurs.'],
            ['Que signifie ὁ αὐτὸς βασιλεύς ?', ['Le roi lui-même', 'Je le vois, le roi', 'Son roi', 'Le même roi'], 3, 'Entre l’article et le nom, αὐτός signifie « le même ».'],
            ['Que signifie αὐτὸς ὁ βασιλεύς ?', ['Le roi lui-même', 'Le même roi', 'Un autre roi', 'Le roi le voit'], 0, 'Hors du groupe article-nom, αὐτός a le sens intensif : « lui-même ».'],
            ['Quel suffixe signale l’aoriste passif ?', ['-σα-', '-θη-', '-ου-', '-κ-'], 1, 'Ἐλύθην, λυθῆναι, λυθείς : le -θη- est la marque du passif.'],
            ['Le subjonctif grec se reconnaît à ses voyelles longues.', ['Vrai', 'Faux'], 0, 'Λύωμεν, λύητε : l’allongement de la voyelle signale le subjonctif.'],
            ['Quelle conjonction introduit le but ?', ['Ὥστε', 'Ἐπεί', 'Ἵνα', 'Ὅτι'], 2, 'Ἵνα (ou ὅπως) + subjonctif exprime le but.'],
            ['Ὥστε + infinitif exprime…', ['Une conséquence réelle', 'Une cause', 'Un but', 'Une conséquence possible'], 3, 'Avec l’indicatif, la conséquence est réelle ; avec l’infinitif, possible.'],
            ['Quelle négation nie une volonté ou une hypothèse ?', ['Οὐ', 'Μή', 'Οὐδέ', 'Οὐκέτι'], 1, 'Οὐ nie un fait ; μή s’emploie avec le subjonctif, l’impératif, l’infinitif.'],
            ['Νυκτός signifie « de nuit » : c’est un génitif d’époque.', ['Vrai', 'Faux'], 0, 'Le génitif situe l’action dans une période : de nuit.'],
            ['Qu’exprime avant tout l’aoriste, par opposition au présent ?', ['Le passé lointain', 'L’action vue comme un point', 'L’action répétée', 'Le futur proche'], 1, 'C’est l’aspect : l’aoriste voit l’action globalement, le présent dans sa durée.'],
          ],
        },
        {
          titre: 'Optatif, potentiel et éventuel : les modes du possible',
          axe: 'Étude de la langue',
          lecon: {
            titre: 'La langue propre à la spécialité de Terminale',
            cours: `Le grec possède un mode que le français a perdu : l’**optatif**, le mode du souhait et du possible. Avec lui, la spécialité ajoute quelques tournures qui permettent de lire les tragiques et Platon avec finesse.

## L’optatif : les formes
Il se reconnaît à la présence d’un **-ι-** entre le radical et la terminaison.
| Personne | Présent | Aoriste sigmatique | Aoriste thématique |
| 1re sing. | λύοιμι | λύσαιμι | λάβοιμι |
| 2e sing. | λύοις | λύσαις (λύσειας) | λάβοις |
| 3e sing. | λύοι | λύσαι (λύσειε) | λάβοι |
| 1re plur. | λύοιμεν | λύσαιμεν | λάβοιμεν |
| 2e plur. | λύοιτε | λύσαιτε | λάβοιτε |
| 3e plur. | λύοιεν | λύσαιεν (λύσειαν) | λάβοιεν |
Repères : **-οι-** au présent et à l’aoriste thématique, **-αι-** à l’aoriste sigmatique.

## Trois emplois à reconnaître
| Emploi | Construction | Exemple | Traduction |
| Le souhait | optatif seul, ou εἴθε / εἰ γάρ + optatif ; négation μή | ὦ παῖ, γένοιο πατρὸς εὐτυχέστερος | « Mon enfant, puisses-tu être plus heureux que ton père ! » |
| Le potentiel | optatif + ἄν ; négation οὐ | ἡδέως ἂν ἀκούσαιμι | « J’écouterais volontiers » |
| L’éventuel | ἐάν, ὅταν, ὃς ἄν + subjonctif | ἐὰν ἔλθῃ, ὄψεται | « S’il vient, il verra » |

Le souhait est la plainte d’Ajax, chez Sophocle, à son fils avant de mourir.

> Le petit mot **ἄν** est la clé : avec l’optatif, il fait un **potentiel** (« je pourrais, je ferais ») ; avec le subjonctif, il fait un **éventuel** (« si jamais », « chaque fois que »).

## L’éventuel dans les subordonnées
Il exprime ce qui peut arriver dans l’avenir, ou ce qui se répète.
1. **Hypothétique** : ἐάν (contraction de εἰ + ἄν) + subjonctif, « si jamais ».
2. **Temporelle** : ὅταν (ὅτε + ἄν) + subjonctif, « lorsque, chaque fois que ».
3. **Relative** : ὃς ἄν + subjonctif, « quiconque ».

## Les pronoms réfléchis
Ils n’ont **pas de nominatif** : ils renvoient au sujet.
| Personne | Accusatif singulier | Sens |
| 1re | ἐμαυτόν | moi-même |
| 2e | σεαυτόν | toi-même |
| 3e | ἑαυτόν (αὑτόν) | lui-même, soi-même |
Γνῶθι σεαυτόν : « connais-toi toi-même ».

## L’accusatif de relation
Il précise **sous quel rapport** une qualité est vraie. Homère appelle Achille πόδας ὠκύς, « rapide quant aux pieds », c’est-à-dire **aux pieds rapides**. De même : ἀλγεῖ τὴν κεφαλήν, « il a mal à la tête ».

## Les adjectifs en -ύς
Le type ἡδύς, ἡδεῖα, ἡδύ (doux, agréable), génitif ἡδέος, se décline comme la 3e déclinaison au masculin et au neutre, comme la 1re au féminin. Autres : ταχύς (rapide : tachycardie), βαθύς (profond : bathyscaphe), βραχύς (court), εὐρύς (large).

## Exemple travaillé
ὦ παῖ, γένοιο πατρὸς εὐτυχέστερος : γένοιο, optatif aoriste de γίγνομαι, 2e personne : **souhait** ; πατρός, génitif de comparaison ; εὐτυχέστερος, comparatif de εὐτυχής. Traduction : **« Ô mon enfant, puisses-tu être plus heureux que ton père. »**`,
          },
          questions: [
            ['Quelle voyelle caractérise l’optatif ?', ['Un -η-', 'Un -ω- long', 'Un -ι-', 'Un -ε- bref'], 2, 'Λύοιμι, λύσαιμι : le -ι- entre radical et terminaison signale l’optatif.'],
            ['Quelle est la 1re personne de l’optatif aoriste sigmatique de λύω ?', ['Λύσαιμι', 'Λύοιμι', 'Ἔλυσα', 'Λύσω'], 0, 'Le -αι- est la marque de l’optatif aoriste sigmatique.'],
            ['Que marque l’optatif accompagné de ἄν ?', ['Le souhait', 'L’éventuel', 'Le passé', 'Le potentiel'], 3, 'Ἡδέως ἂν ἀκούσαιμι : « j’écouterais volontiers ».'],
            ['Que signifie ὦ παῖ, γένοιο πατρὸς εὐτυχέστερος ?', ['Mon enfant, tu seras plus heureux que ton père', 'Mon enfant, puisses-tu être plus heureux que ton père', 'Mon enfant, ton père était heureux', 'Mon enfant, sois digne de ton père'], 1, 'L’optatif seul exprime le souhait : c’est Ajax chez Sophocle.'],
            ['Quelle construction exprime l’éventuel ?', ['Ἄν + optatif', 'Εἴθε + optatif', 'Ἐάν + subjonctif', 'Εἰ + indicatif imparfait'], 2, 'Ἐάν, ὅταν, ὃς ἄν + subjonctif : « si jamais », « chaque fois que », « quiconque ».'],
            ['Ὅταν est la contraction de ὅτε + ἄν.', ['Vrai', 'Faux'], 0, 'Avec le subjonctif, il signifie « lorsque, chaque fois que ».'],
            ['Quelle négation accompagne le souhait ?', ['Μή', 'Οὐ', 'Οὐκ', 'Οὐδαμῶς'], 0, 'Le souhait est une volonté : on le nie par μή.'],
            ['Que signifie πόδας ὠκὺς Ἀχιλλεύς ?', ['Achille qui court à pied', 'Achille aux pieds blessés', 'Achille rapide comme le vent', 'Achille aux pieds rapides'], 3, 'Πόδας est un accusatif de relation : rapide quant aux pieds.'],
            ['Les pronoms réfléchis grecs ont un nominatif.', ['Vrai', 'Faux'], 1, 'Ils renvoient au sujet et n’existent qu’aux cas obliques.'],
            ['Quel est le pronom réfléchi de la 1re personne à l’accusatif ?', ['Σεαυτόν', 'Ἐμαυτόν', 'Ἑαυτόν', 'Αὐτόν'], 1, 'Ἐμαυτόν signifie « moi-même ».'],
            ['Quel mot français vient de ταχύς, rapide ?', ['Tactique', 'Taxe', 'Tachycardie', 'Technique'], 2, 'La tachycardie est un cœur qui bat trop vite.'],
            ['Dans ἀλγεῖ τὴν κεφαλήν, quelle est la fonction de τὴν κεφαλήν ?', ['Accusatif de relation', 'Complément d’objet direct', 'Accusatif de durée', 'Sujet'], 0, '« Il a mal quant à la tête » : il a mal à la tête.'],
          ],
        },
        {
          titre: 'Racines grecques et mots-concepts',
          axe: 'Étude de la langue',
          lecon: {
            titre: 'Du grec ancien au français d’aujourd’hui',
            cours: `Plus de la moitié du vocabulaire savant du français vient du grec. Connaître une trentaine de racines, c’est comprendre des milliers de mots — et répondre à la **question de lexique** de l’épreuve.

## Les racines les plus rentables
| Racine | Sens | Exemples |
| λόγος (-logie) | parole, raison, étude | biologie, logique, dialogue |
| δῆμος (démo-) | le peuple | démocratie, démographie, épidémie |
| κράτος (-cratie) | le pouvoir | aristocratie, bureaucratie |
| ἀρχή (-archie) | commandement, origine | monarchie, anarchie, archéologie |
| γράφω (-graphie) | écrire | géographie, autographe |
| χρόνος (chrono-) | le temps | chronologie, anachronisme |
| βίος (bio-) | la vie | biographie, antibiotique |
| ψυχή (psych-) | le souffle, l’âme | psychologie, psychiatrie |
| θεός (théo-) | dieu | théologie, athée, enthousiasme |
| φόβος (-phobie) | la peur, la fuite | claustrophobie, xénophobie |
| ἄνθρωπος (anthropo-) | l’être humain | anthropologie, philanthrope |
| πόλις (poli-) | la cité | politique, métropole |

## Les préfixes
| Préfixe | Sens | Exemples |
| ἀ-, ἀν- (privatif) | sans | athée, anarchie, atome, anonyme |
| ὑπέρ | au-dessus, excès | hypertension, hyperbole |
| ὑπό | au-dessous | hypothèse, hypoglycémie |
| σύν, συμ- | avec | synthèse, sympathie, symphonie |
| τῆλε | loin | téléphone, télescope |
| αὐτός | soi-même | autonome, automobile, autographe |

## Des mots qui ont une histoire
| Mot | Origine | Ce qu’il disait d’abord |
| école | σχολή | le loisir, le temps libre |
| idiot | ἰδιώτης | le simple particulier, qui ne se mêle pas des affaires de la cité |
| tragédie | τράγος + ᾠδή | le « chant du bouc », sans doute lié aux fêtes de Dionysos |
| enthousiasme | ἔνθεος | le fait d’avoir un dieu en soi |
| panique | Πάν | la terreur soudaine envoyée par le dieu Pan |
| nostalgie | νόστος + ἄλγος | la douleur du retour ; mot forgé en 1688 par un médecin suisse, Johannes Hofer |
| musée | Μουσεῖον | le lieu des Muses |
| bible | βιβλία | les livres, de Byblos, port du papyrus |

> Un seul exemple suffit à mesurer l’héritage : **démocratie**, δῆμος + κράτος, « le pouvoir du peuple ». Le mot et la chose sont nés ensemble à Athènes.

## Les mots-concepts de l’épreuve
La question de lexique porte sur une **notion clé** du texte. Les plus probables pour le programme :
| Grec | Sens | À ne pas confondre avec |
| λόγος | parole, raison, récit argumenté | μῦθος, le récit traditionnel |
| ψεῦδος | le mensonge, l’erreur, la fiction | ἀλήθεια, la vérité (le non-caché) |
| κόσμος | l’ordre, le monde, la parure | χάος, la béance |
| μοῖρα | la part, le destin | τύχη, la fortune, le hasard |
| φύσις | la nature | νόμος, la loi, la convention |
| ἄνθρωπος | l’être humain | ἀνήρ, l’homme mâle, le héros |

## Méthode : la question de lexique
1. Donne le **sens premier** et l’étymologie.
2. Relève les **occurrences** du mot dans le texte grec : il peut changer de nuance.
3. Explique le **sens en contexte**, et ce qu’il apporte à l’interprétation.
4. **Ouvre** : un héritier français, l’équivalent latin (λόγος et *ratio*, φύσις et *natura*, ἄνθρωπος et *homo*), ou un usage moderne.`,
          },
          questions: [
            ['Que signifie la racine grecque κράτος ?', ['Le peuple', 'Le pouvoir', 'La cité', 'Le temps'], 1, 'D’où démocratie, aristocratie, bureaucratie.'],
            ['Que désignait d’abord le mot σχολή, qui a donné « école » ?', ['Le loisir', 'La leçon', 'Le maître', 'La salle'], 0, 'Étudier, c’était profiter de son temps libre.'],
            ['Qu’était d’abord un ἰδιώτης ?', ['Un fou', 'Un esclave', 'Un étranger', 'Un simple particulier'], 3, 'Celui qui ne se mêle pas des affaires de la cité, par opposition au citoyen actif.'],
            ['De quels mots est formé « nostalgie » ?', ['Νόστος, le retour, et ἄλγος, la douleur', 'Νύξ, la nuit, et ἄλγος', 'Νόμος, la loi, et λόγος', 'Νέος, nouveau, et γῆ'], 0, 'La nostalgie est la douleur du retour ; le mot date de 1688.'],
            ['Quel mot contient l’α privatif ?', ['Archéologie', 'Anthropologie', 'Athée', 'Astronomie'], 2, 'A- privatif + θεός : sans dieu.'],
            ['Que signifie le préfixe τῆλε ?', ['Proche', 'Loin', 'Rapide', 'Voir'], 1, 'Téléphone : la voix de loin ; télescope : regarder loin.'],
            ['Le mot « panique » vient du dieu Pan.', ['Vrai', 'Faux'], 0, 'On lui attribuait les terreurs soudaines qui saisissent les troupeaux et les armées.'],
            ['Que signifie étymologiquement « enthousiasme » ?', ['La joie', 'L’énergie', 'L’amour', 'Le fait d’avoir un dieu en soi'], 3, 'Ἔνθεος : habité par un dieu.'],
            ['Quel mot grec s’oppose à φύσις, la nature ?', ['Νόμος, la loi, la convention', 'Κόσμος', 'Λόγος', 'Βίος'], 0, 'Les sophistes opposaient ce qui est par nature et ce qui est par convention.'],
            ['Quel est l’équivalent latin de λόγος au sens de raison ?', ['Natura', 'Ratio', 'Homo', 'Fatum'], 1, 'Λόγος, la parole raisonnée, correspond à ratio.'],
            ['Quelle racine signifie « le souffle, l’âme » ?', ['Βίος', 'Χρόνος', 'Ψυχή', 'Δῆμος'], 2, 'Ψυχή a donné psychologie et psychiatrie.'],
            ['Ἀνήρ et ἄνθρωπος ont exactement le même sens.', ['Vrai', 'Faux'], 1, 'Ἄνθρωπος désigne l’être humain ; ἀνήρ, l’homme mâle, souvent le héros.'],
          ],
        },

        // ===== L'épreuve =====================================================
        {
          titre: 'L’épreuve de LLCA grec : traduire et écrire l’essai',
          axe: 'Épreuve écrite et orale',
          lecon: {
            titre: 'Méthode de traduction et d’interprétation',
            cours: `L’épreuve écrite de spécialité dure **4 heures**, avec un dictionnaire grec-français (le Bailly, en général). Pour 2026-2028, le texte grec est tiré des *Histoires vraies* de Lucien, et l’œuvre moderne est *Le Baron perché* de Calvino.

## Le sujet, pièce par pièce
| Partie | Question | Points |
| 1. Étude de la langue | Traduction d’environ 90 mots de l’œuvre antique | 6 |
| | Un fait de langue : identifier (1 pt) et interpréter (1 pt) | 2 |
| | Une notion clé du lexique, expliquée en contexte | 2 |
| 2. Compréhension et interprétation | Un essai organisé sur les trois textes du corpus | 10 |

Le corpus associe le texte grec (300 mots au plus, avec sa traduction, sauf le passage à traduire), un extrait de l’œuvre moderne, et un court texte antique donné en traduction. Les questions de langue et de lexique ne portent jamais sur le passage à traduire.

## Traduire le grec en sept étapes
1. **Lis le chapeau et la traduction fournie** autour du passage : qui parle, où en est le récit ?
2. **Repère les verbes conjugués**, puis délimite les propositions.
3. **Lis l’article avant le nom** : il donne le cas, le genre et le nombre, même quand la terminaison du nom est inconnue.
4. **Repère les participes** : le grec les aime, et un participe se traduit souvent par une subordonnée (« alors que », « parce que », « bien que »).
5. **Traduis les particules** : μέν… δέ (d’un côté… de l’autre), γάρ (car), οὖν (donc), ἀλλά (mais), καί (et, aussi, même).
6. **Cherche au dictionnaire** la forme d’entrée : première personne du présent pour un verbe, nominatif et génitif pour un nom. Pense aux **aoristes irréguliers** (εἶπον, de λέγω ; εἶδον, de ὁράω ; ἦλθον, de ἔρχομαι).
7. **Rédige, puis relis** : exactitude d’abord, élégance ensuite.

> L’**esprit rude** (ʽ) se prononce comme un h : ἡμέρα se cherche à la lettre η, mais se lit « hèméra » — d’où « éphémère », ce qui ne dure qu’un jour.

!> Ne traduis pas un aoriste par un passé simple systématiquement : dans une subordonnée ou à l’infinitif, l’aoriste indique l’**aspect**, pas l’époque.

## Le fait de langue et le lexique
Pour le fait de langue : **identifie** (mode, temps, voix, cas, fonction), puis **interprète** (qu’apporte cet optatif, ce participe, cet accusatif de relation au sens du passage ?). Pour le lexique : sens premier, occurrences, sens en contexte, ouverture — chez Lucien, ψεῦδος, ἀλήθεια ou θαῦμα sont des candidats sérieux.

## L’essai
1. **Analyse la question** : ses mots clés et la tension qu’elle contient.
2. **Problématise** sans recopier la question.
3. **Deux ou trois parties** qui progressent ; chaque paragraphe confronte au moins deux des trois textes.
4. **Mobilise tes connaissances** : les deux œuvres, les objets d’étude, ton portfolio, tes lectures.
5. **Cite le grec** avec parcimonie, toujours traduit.

| Défaut fréquent | Remède |
| Résumer les textes | Analyser : comment, pourquoi |
| Oublier Calvino | Au moins un exemple du *Baron perché* par partie |
| Plaquer un cours | Partir des textes du corpus |

## L’oral de contrôle
Vingt minutes de préparation : un passage d’une vingtaine de lignes de Lucien à commenter en lien avec Calvino, et 25 mots au plus à traduire en proposant ta propre traduction. Puis dix minutes d’exposé, lecture du grec comprise, et dix minutes d’entretien.`,
          },
          questions: [
            ['Quel dictionnaire est autorisé à l’épreuve de grec ?', ['Aucun', 'Un dictionnaire grec-français', 'Un dictionnaire de français', 'Une grammaire grecque'], 1, 'Seul un dictionnaire grec-français (le Bailly, en général) est autorisé.'],
            ['Combien de points vaut la traduction ?', ['10', '2', '6', '4'], 2, 'La traduction d’environ 90 mots vaut 6 points sur 20.'],
            ['Quelle œuvre grecque fournit le texte de l’épreuve pour 2026-2028 ?', ['Les Histoires vraies de Lucien', 'L’Odyssée', 'Œdipe roi', 'La République'], 0, 'Le programme limitatif associe Lucien et Calvino.'],
            ['Pourquoi lire l’article avant le nom ?', ['Parce qu’il est plus court', 'Parce qu’il porte l’accent', 'Parce qu’il est toujours au nominatif', 'Parce qu’il donne le cas, le genre et le nombre'], 3, 'Même quand le nom est inconnu, sa forme à lui renseigne.'],
            ['Que signifie la particule γάρ ?', ['Donc', 'Car', 'Mais', 'Et'], 1, 'Γάρ introduit une explication ; οὖν une conséquence.'],
            ['De quel verbe εἶπον est-il l’aoriste ?', ['Λέγω', 'Ὁράω', 'Ἔρχομαι', 'Εἰμί'], 0, 'Εἶπον, « je dis », sert d’aoriste à λέγω.'],
            ['Un participe grec se traduit souvent par une subordonnée.', ['Vrai', 'Faux'], 0, 'Selon le sens : temporelle, causale, concessive…'],
            ['Comment se prononce l’esprit rude ?', ['Comme un s', 'Il ne se prononce pas', 'Comme un r roulé', 'Comme un h'], 3, 'Ἡμέρα se lit « hèméra » : d’où éphémère.'],
            ['Les questions de langue et de lexique peuvent porter sur le passage à traduire.', ['Vrai', 'Faux'], 1, 'La définition de l’épreuve l’exclut expressément.'],
            ['Dans l’essai, que faut-il faire dans chaque paragraphe ?', ['Résumer un seul texte', 'Confronter au moins deux textes du corpus', 'Citer uniquement le grec', 'Raconter la vie de Lucien'], 1, 'La confrontation est au cœur de l’essai.'],
            ['Dans une subordonnée, qu’indique l’aoriste avant tout ?', ['Le futur', 'Le passé lointain', 'L’aspect', 'La politesse'], 2, 'Hors de l’indicatif, l’aoriste marque l’aspect ponctuel, pas l’époque.'],
            ['Combien de temps dure l’exposé à l’oral de contrôle ?', ['Dix minutes', 'Cinq minutes', 'Vingt minutes', 'Trente minutes'], 0, 'Dix minutes d’exposé, puis dix minutes d’entretien, après vingt minutes de préparation.'],
          ],
        },
      ],
    },
  ],
}
