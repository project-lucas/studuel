// Éducation musicale — 6e → Terminale.
// Cycle 3 (6e), cycle 4 (5e-4e-3e), lycée (2de-1re-Tle, option).

export default {
  slug: 'musique',
  nom: 'Musique',
  blocs: [
    {
      niveaux: ['6e'],
      chapitres: [
        {
          titre: 'Les paramètres du son',
          lecon: {
            titre: 'Hauteur, durée, intensité, timbre',
            cours: `Tout son musical se décrit avec quatre paramètres. Les nommer, c’est pouvoir parler précisément de ce qu’on entend.

## Les quatre paramètres
| Le paramètre | Ce qu’il décrit | Son vocabulaire |
| La **hauteur** | Aigu ou grave | La **fréquence**, en hertz (Hz) |
| La **durée** | Long ou court | Ronde, blanche, noire, croche |
| L’**intensité** | Le volume | *piano*, *forte* |
| Le **timbre** | La « couleur » du son | Les **harmoniques** |

## La hauteur
~ Fréquence élevée → son aigu · fréquence basse → son grave

= Le la du diapason est à 440 Hz

## La durée
Les **figures de note** codent les durées.

~ Ronde → blanche → noire → croche

!> Chaque figure vaut **la moitié** de la précédente. Ce n’est pas une liste à apprendre : c’est une division par deux à chaque fois.

## L’intensité
| La nuance | Ce qu’elle veut dire |
| ***piano*** | Doux |
| ***mezzo forte*** | Moyennement fort |
| ***forte*** | Fort |
| ***fortissimo*** | Très fort |

| Le mouvement | Ce qu’il fait |
| Le ***crescendo*** | L’intensité **augmente** progressivement |
| Le ***decrescendo*** | Elle **diminue** |

## Le timbre
> C’est le timbre qui permet de distinguer une **flûte** d’un **violon** jouant **exactement la même note**. Il vient des harmoniques produites par l’instrument.`,
          },
          questions: [
            ['Quel paramètre distingue un son aigu d’un son grave ?', ['La hauteur', 'L’intensité', 'La durée', 'Le timbre'], 0, 'Elle dépend de la fréquence, mesurée en hertz.'],
            ['Le timbre permet de reconnaître l’instrument qui joue.', ['Vrai', 'Faux'], 0, 'C’est la couleur du son, due aux harmoniques.'],
            ['Que signifie « forte » sur une partition ?', ['Jouer fort', 'Jouer doucement', 'Jouer vite', 'Jouer lentement'], 0, 'Son contraire est « piano ».'],
            ['Quelle est la fréquence du la du diapason ?', ['440 Hz', '220 Hz', '880 Hz', '100 Hz'], 0, 'C’est la référence d’accord internationale.'],
            ['Un crescendo signifie que le son diminue progressivement.', ['Vrai', 'Faux'], 1, 'C’est l’inverse : le crescendo augmente l’intensité.'],
            ['Quelle figure de note dure le plus longtemps ?', ['La ronde', 'La noire', 'La croche', 'La blanche'], 0, 'Ronde, blanche, noire, croche : chacune vaut la moitié de la précédente.'],
            ['Une flûte et un violon jouant la même note produisent le même son.', ['Vrai', 'Faux'], 1, 'La hauteur est identique, le timbre diffère.'],
            ['Combien de paramètres décrivent un son musical ?', ['4', '2', '3', '6'], 0, 'Hauteur, durée, intensité, timbre.'],
          ],
        },
        {
          titre: 'La voix et les familles d’instruments',
          lecon: {
            titre: 'Qui produit le son ?',
            cours: `Un orchestre se lit d’abord par familles. Ce qui les distingue, c’est la façon dont naît le son.

## Les cordes
| La famille | Comment le son naît | Ses instruments |
| **Frottées** | L’archet | Violon, alto, violoncelle, contrebasse |
| **Pincées** | Le doigt | Harpe, guitare |
| **Frappées** | Un marteau | Piano |

~ Violon (le plus aigu) → alto → violoncelle → contrebasse (la plus grave)

## Les vents
| La famille | Comment le son naît | Ses instruments |
| Les **bois** | Une **anche** ou un souffle sur un biseau | Flûte, clarinette, hautbois, basson, saxophone |
| Les **cuivres** | La **vibration des lèvres** | Trompette, cor, trombone, tuba |

!> Le **saxophone** est classé dans les **bois**, **malgré son métal** : ce n’est pas la matière qui classe un instrument, c’est la façon dont le son est produit.

## Les percussions
| Le type | Ce qu’il produit | Ses instruments |
| **Déterminées** | Une **hauteur précise** | Xylophone, timbales |
| **Indéterminées** | Pas de hauteur définie | Caisse claire, cymbales, triangle |

## La voix
| Les voix de femmes | Les voix d’hommes |
| Soprano | Ténor |
| Mezzo-soprano | Baryton |
| Alto | Basse |

Le chœur peut être ***a cappella*** — sans accompagnement — ou accompagné.`,
          },
          questions: [
            ['À quelle famille appartient le saxophone ?', ['Les bois', 'Les cuivres', 'Les cordes', 'Les percussions'], 0, 'Le son naît d’une anche, ce qui le classe dans les bois malgré son métal.'],
            ['Quel est l’instrument le plus grave des cordes frottées ?', ['La contrebasse', 'Le violon', 'L’alto', 'Le violoncelle'], 0, 'Du plus aigu au plus grave : violon, alto, violoncelle, contrebasse.'],
            ['Le piano est un instrument à cordes frappées.', ['Vrai', 'Faux'], 0, 'Des marteaux frappent les cordes, d’où son classement.'],
            ['Quelle voix de femme est la plus aiguë ?', ['Soprano', 'Alto', 'Mezzo-soprano', 'Ténor'], 0, 'Soprano, mezzo-soprano, alto, de la plus aiguë à la plus grave.'],
            ['Une percussion « déterminée » produit une hauteur précise.', ['Vrai', 'Faux'], 0, 'Le xylophone et les timbales en sont des exemples.'],
            ['Que signifie chanter « a cappella » ?', ['Sans accompagnement instrumental', 'Avec un orchestre', 'En soliste', 'En play-back'], 0, 'Littéralement « à la chapelle ».'],
            ['Chez les cuivres, le son naît…', ['De la vibration des lèvres', 'D’une anche', 'D’une corde', 'D’une membrane'], 0, 'C’est le critère qui sépare cuivres et bois.'],
            ['La harpe est un instrument à cordes pincées.', ['Vrai', 'Faux'], 0, 'Comme la guitare.'],
          ],
        },
        {
          titre: 'Rythme, pulsation et tempo',
          lecon: {
            titre: 'Ce qui met la musique en mouvement',
            cours: `Pulsation, tempo, rythme : trois notions qu’on confond souvent, et qu’il faut distinguer.

## La pulsation
Le **battement régulier** sous-jacent, celui qu’on tape du pied.

!> Elle **ne s’entend pas toujours**, mais on la **sent** : c’est la grille sur laquelle tout se place.

## Le tempo
La **vitesse** de cette pulsation, en battements par minute (bpm).

| L’indication italienne | Sa vitesse |
| ***largo*** | Très lent |
| ***adagio*** | Lent |
| ***andante*** | Allant |
| ***allegro*** | Vif |
| ***presto*** | Très rapide |

## Le rythme
L’organisation des durées **par-dessus** la pulsation : les notes longues et courtes qui dessinent une figure reconnaissable.

> Deux morceaux au **même tempo** peuvent avoir des **rythmes très différents**. C’est ce qui distingue les deux notions.

## La mesure
Les pulsations se groupent en **mesures**.

| La mesure | Ce qu’elle donne |
| À **2 temps** | La marche |
| À **3 temps** | La **valse** |
| À **4 temps** | La plus courante |

!> Le **premier temps** est le **temps fort**. C’est lui qu’on cherche quand on veut « retrouver la mesure ».

~ La pulsation (le battement) → le tempo (sa vitesse) → le rythme (ce qu’on pose dessus) → la mesure (comment on la groupe)`,
          },
          questions: [
            ['Qu’est-ce que la pulsation ?', ['Le battement régulier sous-jacent', 'La vitesse de la musique', 'L’organisation des durées', 'La hauteur des notes'], 0, 'C’est ce qu’on tape du pied.'],
            ['Le tempo se mesure en battements par minute.', ['Vrai', 'Faux'], 0, 'On l’exprime en bpm, ou par une indication italienne.'],
            ['Que signifie « allegro » ?', ['Vif', 'Très lent', 'Lent', 'Moyennement lent'], 0, 'Entre andante et presto.'],
            ['Une valse est une danse à combien de temps ?', ['3 temps', '2 temps', '4 temps', '6 temps'], 0, 'Le premier temps est marqué, les deux autres légers.'],
            ['Deux morceaux au même tempo ont forcément le même rythme.', ['Vrai', 'Faux'], 1, 'Le tempo est la vitesse, le rythme l’organisation des durées.'],
            ['Quelle indication signifie « très lent » ?', ['Largo', 'Presto', 'Allegro', 'Andante'], 0, 'C’est l’un des tempos les plus lents.'],
            ['Dans une mesure, le premier temps est le temps fort.', ['Vrai', 'Faux'], 0, 'Il donne l’appui de la mesure.'],
            ['La mesure la plus courante en musique occidentale est à…', ['4 temps', '3 temps', '5 temps', '7 temps'], 0, 'La mesure à 4/4 domine largement.'],
          ],
        },
      ],
    },
    {
      niveaux: ['5e', '4e', '3e'],
      chapitres: [
        {
          titre: 'Les grandes périodes de l’histoire de la musique',
          lecon: {
            titre: 'Du Moyen Âge à aujourd’hui',
            cours: `Situer une œuvre dans le temps, c'est déjà comprendre pourquoi elle sonne ainsi.

## Les grandes périodes
| La période | Ses dates | Son trait dominant | Ses figures |
| **Moyen Âge** | Jusqu'au XVe | Le **chant grégorien** : monodique, en latin, sans accompagnement | — |
| **Renaissance** | XVe-XVIe | La **polyphonie** : plusieurs voix indépendantes superposées | — |
| **Baroque** | 1600-1750 | Basse continue, ornementation, naissance de l'**opéra** | **Bach**, **Vivaldi**, **Haendel**, Monteverdi |
| **Classique** | 1750-1820 | L'**équilibre** et la clarté | **Mozart**, **Haydn**, le premier **Beethoven** |
| **Romantique** | 1820-1900 | L'**expression du sentiment**, l'ampleur | **Chopin**, **Berlioz**, **Wagner** |
| **XXe siècle** | — | La **rupture avec la tonalité** | **Debussy**, **Stravinsky**, Schoenberg |
| Musiques **actuelles** | Depuis 1900 | L'enregistrement change tout | Jazz, rock, électronique, rap |

## Le Baroque
| L'innovation | Ce qu'elle apporte |
| L'**opéra** | Le théâtre chanté |
| La **fugue** | L'écriture savante de l'imitation |
| Le **concerto** | L'opposition soliste et orchestre |

## Le XXe siècle et après
> La **technologie** devient un instrument à part entière : studio, synthétiseur, échantillonneur, ordinateur.`,
          },
          questions: [
            ['Le chant grégorien est…', ['Monodique et en latin', 'Polyphonique et en français', 'Accompagné à l’orgue', 'Chanté à deux voix'], 0, 'Une seule ligne mélodique, sans accompagnement.'],
            ['À quelle période appartient Jean-Sébastien Bach ?', ['Le baroque', 'Le classicisme', 'Le romantisme', 'La Renaissance'], 0, 'Le baroque s’étend environ de 1600 à 1750, année de sa mort.'],
            ['La polyphonie superpose plusieurs voix indépendantes.', ['Vrai', 'Faux'], 0, 'Elle se développe surtout à la Renaissance.'],
            ['Qui a composé *Les Quatre Saisons* ?', ['Vivaldi', 'Mozart', 'Bach', 'Chopin'], 0, 'Quatre concertos pour violon, emblématiques du baroque.'],
            ['Mozart est un compositeur romantique.', ['Vrai', 'Faux'], 1, 'Il appartient à la période classique (1750-1820).'],
            ['Quelle période cherche avant tout l’expression du sentiment ?', ['Le romantisme', 'Le classicisme', 'Le baroque', 'La Renaissance'], 0, 'D’où l’ampleur orchestrale et la liberté formelle.'],
            ['Quel compositeur est associé à la rupture avec la tonalité au XXe siècle ?', ['Debussy', 'Haydn', 'Haendel', 'Monteverdi'], 0, 'Avec Stravinsky et Schoenberg, il ouvre le langage musical moderne.'],
            ['L’opéra naît à la période baroque.', ['Vrai', 'Faux'], 0, 'Monteverdi en est l’une des figures fondatrices.'],
          ],
        },
        {
          titre: 'Forme et structure d’une œuvre',
          lecon: {
            titre: 'Comment une musique est construite',
            cours: `Écouter, c'est repérer ce qui revient et ce qui change.

## Les formes simples
| La forme | Son principe | Où on la trouve |
| **Strophique** | Le même thème, des paroles différentes | La chanson à couplets |
| **AABA** | Trois fois le thème, un pont au milieu | Chanson et jazz |
| **Couplet-refrain** | L'alternance la plus familière | La chanson populaire |

## Le rondo
Un thème principal **A** revient entre des épisodes contrastés :

**A – B – A – C – A**

> La forme est fondée sur le **retour**.

## Le thème et variations
| L'élément | Ce qui se passe |
| Le **thème** | Il est d'abord exposé simplement |
| Les **variations** | Changement de rythme, d'harmonie, de mode, d'instrumentation |
| Le fil | Le thème reste **reconnaissable** sous ses déguisements |

## Le canon et la fugue
| La forme | Son principe |
| Le **canon** | Une voix imite **exactement** une autre, à distance — *Frère Jacques* |
| La **fugue** | Elle développe cette imitation de façon savante : un **sujet**, une **réponse**, des **épisodes** |`,
          },
          questions: [
            ['Quelle est la structure d’un rondo ?', ['A-B-A-C-A', 'A-A-B-A', 'A-B-C-D', 'A-B'], 0, 'Le thème principal revient entre des épisodes contrastés.'],
            ['Dans un canon, une voix imite exactement une autre à distance.', ['Vrai', 'Faux'], 0, '*Frère Jacques* en est l’exemple le plus connu.'],
            ['Qu’est-ce qu’une forme strophique ?', ['Le même thème avec des paroles différentes', 'Un thème qui ne revient jamais', 'Une improvisation', 'Une œuvre sans structure'], 0, 'C’est la chanson à couplets.'],
            ['Dans un thème et variations, le thème…', ['Est transformé mais reste reconnaissable', 'Disparaît après la première fois', 'N’est jamais exposé', 'Est joué à l’identique'], 0, 'Rythme, harmonie, mode, instrumentation changent.'],
            ['La fugue repose sur l’imitation entre les voix.', ['Vrai', 'Faux'], 0, 'Sujet, réponse et épisodes s’y répondent.'],
            ['Quelle forme est très répandue dans le jazz et la chanson ?', ['AABA', 'ABCD', 'ABABCB', 'AAAA'], 0, 'Trente-deux mesures en quatre sections de huit.'],
            ['Repérer une forme, c’est repérer ce qui revient et ce qui change.', ['Vrai', 'Faux'], 0, 'C’est le geste d’écoute fondamental.'],
            ['Le refrain est la partie qui…', ['Revient identique entre les couplets', 'Change à chaque fois', 'Ouvre seulement la chanson', 'Est instrumentale'], 0, 'Sa répétition en fait le point d’ancrage.'],
          ],
        },
        {
          titre: 'Musique et société',
          lecon: {
            titre: 'La musique dit quelque chose du monde',
            cours: `Une musique n'existe jamais hors de son contexte.

## Musique et engagement
| La musique | Ce qu'elle porte |
| Le **blues** | Né de l'esclavage et de la ségrégation |
| La **chanson engagée** française | La contestation politique |
| Le **rap** | La parole des quartiers |
| Les **hymnes** de mouvements sociaux | La cohésion d'une lutte |

> La musique donne une **voix collective**.

## Musique et pouvoir
| Le procédé | Son but |
| La **censure** | Faire taire |
| Les **musiques officielles** | Célébrer le régime |
| Les artistes **interdits** | Effacer une opposition |
| L'**hymne national** | Fabriquer de l'unité |

## Musique et image
| Le rapport à l'image | Son effet |
| La musique **anticipe** | Elle prévient d'un danger |
| Elle **contredit** | Une valse sur une scène violente |
| Elle **soutient** | Elle amplifie l'émotion visible |
| Le *leitmotiv* | Un thème associé à un personnage |

## L'industrie musicale aujourd'hui
| L'étape | Sa transformation |
| L'**enregistrement** | Il fige et diffuse |
| Le **streaming** | Il rend tout disponible |
| Les **algorithmes** de recommandation | Ils décident de ce qu'on écoute |
| Le **droit d'auteur** | Il rémunère la création |

> La façon dont on découvre la musique a changé plus vite que la musique elle-même.`,
          },
          questions: [
            ['Le blues est né…', ['De l’expérience de l’esclavage et de la ségrégation', 'Dans les cours européennes', 'Au XXIe siècle', 'De la musique baroque'], 0, 'Il puise dans les chants de travail et les spirituals.'],
            ['Un leitmotiv associe un thème musical à un personnage ou une idée.', ['Vrai', 'Faux'], 0, 'Wagner l’a systématisé ; le cinéma s’en sert constamment.'],
            ['Au cinéma, une musique peut contredire l’image.', ['Vrai', 'Faux'], 0, 'Une musique douce sur une scène violente crée un effet de décalage.'],
            ['Le droit d’auteur sert à…', ['Rémunérer les créateurs de l’œuvre', 'Interdire l’écoute', 'Fixer le prix des concerts', 'Classer les musiques'], 0, 'Il protège l’auteur et organise sa rémunération.'],
            ['Les régimes autoritaires se sont souvent désintéressés de la musique.', ['Vrai', 'Faux'], 1, 'Ils l’ont au contraire censurée ou instrumentalisée.'],
            ['Quelle fonction remplit un hymne national ?', ['Fabriquer un sentiment d’unité', 'Divertir', 'Enseigner le solfège', 'Vendre des disques'], 0, 'C’est un symbole collectif.'],
            ['Le streaming a modifié surtout…', ['La façon de découvrir et diffuser la musique', 'La théorie musicale', 'Les instruments', 'Le solfège'], 0, 'La recommandation algorithmique oriente désormais l’écoute.'],
            ['Le rap est apparu comme une parole venue des quartiers populaires.', ['Vrai', 'Faux'], 0, 'Né dans le Bronx des années 1970, il s’est diffusé mondialement.'],
          ],
        },
      ],
    },
    {
      niveaux: ['2de', '1re', 'Tle'],
      chapitres: [
        {
          titre: 'Langage musical et analyse',
          lecon: {
            titre: 'Tonalité, mode et harmonie',
            cours: `Analyser, ce n’est pas juger : c’est **nommer ce qui produit l’effet ressenti**. Quatre outils suffisent — la tonalité, l’accord, la cadence, la texture.

## Tonalité et modes
Le système **tonal** organise les sons autour d’une note centrale, la **tonique**. Tout le reste s’entend par rapport à elle.

| Mode | Ce qu’on perçoit | Réserve |
| Majeur | Lumineux, ouvert | Perception culturelle, pas naturelle |
| Mineur | Sombre, tendu | Idem : une berceuse mineure n’est pas triste partout |
| Modal | Ni l’un ni l’autre : une autre échelle | Grégorien, musiques traditionnelles, jazz modal |

## L’accord et la cadence
Un **accord** superpose au moins trois sons. La **cadence** est la formule qui conclut une phrase — c’est elle qui dit à l’oreille si c’est fini.

| Cadence | Le mouvement | L’effet |
| Parfaite | Dominante → tonique | Achèvement, la phrase se ferme |
| Suspensive | On s’arrête sur la dominante | Attente, la phrase reste ouverte |
| Rompue | Dominante → autre degré | Surprise, l’attente est déjouée |

## La texture
| Texture | Combien de lignes | Exemple |
| Monodie | Une seule | Chant grégorien |
| Homophonie | Une mélodie accompagnée | Chanson, choral |
| Polyphonie | Plusieurs, indépendantes | Fugue, motet |
| Hétérophonie | Une seule, en variantes simultanées | Musiques traditionnelles |

## Analyser une œuvre
Repérer la forme, la texture, l’instrumentation, le tempo, le mode — puis, surtout, repérer ce qui **change**.

> C’est au moment de la rupture que l’intention du compositeur se lit le mieux : un changement de texture ou de mode est toujours un geste, jamais un hasard.`,
          },
          questions: [
            ['Qu’est-ce que la tonique ?', ['La note centrale autour de laquelle s’organise la tonalité', 'La note la plus aiguë', 'Le premier instrument', 'La note finale d’une gamme chromatique'], 0, 'Tout le système tonal gravite autour d’elle.'],
            ['La cadence parfaite enchaîne…', ['La dominante puis la tonique', 'La tonique puis la dominante', 'Deux accords identiques', 'Une note et un silence'], 0, 'C’est la formule de conclusion la plus stable.'],
            ['L’homophonie désigne une mélodie accompagnée.', ['Vrai', 'Faux'], 0, 'À distinguer de la polyphonie, où les lignes sont indépendantes.'],
            ['Un accord comporte au minimum…', ['Trois sons', 'Deux sons', 'Quatre sons', 'Cinq sons'], 0, 'Deux sons forment un intervalle, trois un accord.'],
            ['L’association majeur = joyeux, mineur = triste est une perception culturelle.', ['Vrai', 'Faux'], 0, 'Elle est très forte dans la musique occidentale, mais n’a rien d’universel.'],
            ['Qu’est-ce que l’hétérophonie ?', ['Des variantes simultanées d’une même ligne', 'Une seule ligne mélodique', 'Deux mélodies opposées', 'Une absence de mélodie'], 0, 'On la trouve dans de nombreuses musiques traditionnelles.'],
            ['Le jazz modal repose sur le système tonal classique.', ['Vrai', 'Faux'], 1, 'Il s’appuie sur des modes, avec moins de changements d’accords.'],
            ['Dans une analyse, le moment le plus révélateur est souvent…', ['Celui où quelque chose change', 'Le tout début', 'La dernière note', 'Le passage le plus fort'], 0, 'La rupture révèle l’intention.'],
          ],
        },
        {
          titre: 'Création et technologies',
          lecon: {
            titre: 'Composer avec les machines',
            cours: `Depuis un siècle, la technologie n’accompagne plus la musique : elle la **compose**. Chaque outil déplace la frontière entre jouer et fabriquer.

## Un siècle en cinq étapes
| Date | L’outil | Ce qu’il change |
| Années 1900 | Microphone et disque | L’œuvre devient un objet qu’on possède |
| 1948 | Musique concrète (Schaeffer) | Le son enregistré du réel devient matériau |
| Années 1950 | Le multipiste | Le studio devient un instrument |
| 1983 | La norme MIDI | Les machines dialoguent entre elles |
| Aujourd’hui | Échantillonnage, IA générative | La question de l’auteur se rouvre |

## De l’enregistrement au studio
Le microphone, le disque puis le multipiste transforment le statut de l’œuvre : la **version enregistrée devient la référence**, alors qu’elle n’était au départ qu’une trace d’une exécution parmi d’autres.

## Musique concrète et électroacoustique
**Pierre Schaeffer** (1948) compose à partir de sons enregistrés du réel — une porte, un train : c’est la **musique concrète**. L’**électroacoustique** élargit ensuite le matériau à tout son possible, y compris entièrement synthétique.

## Le synthétiseur et le MIDI
Le synthétiseur **fabrique** le son, par trois grandes voies : additive (on empile des harmoniques), soustractive (on filtre un son riche), FM (on module une fréquence par une autre).

> **MIDI ne transporte pas de son.** Il transporte des instructions — quelle note, quelle intensité, quelle durée. C’est pourquoi un même fichier MIDI sonne autrement d’une machine à l’autre.

## Aujourd’hui
Séquenceurs, échantillonnage, auto-tune, intelligence artificielle générative : chaque outil déplace un peu plus la frontière entre l’interprétation et la fabrication — et repose la question de ce qu’est un **auteur**.`,
          },
          questions: [
            ['Qui est à l’origine de la musique concrète ?', ['Pierre Schaeffer', 'Claude Debussy', 'Igor Stravinsky', 'Karlheinz Stockhausen'], 0, 'À partir de 1948, il compose avec des sons enregistrés du réel.'],
            ['Le MIDI transporte du son.', ['Vrai', 'Faux'], 1, 'Il transporte des instructions : note, intensité, durée.'],
            ['En quelle année la norme MIDI est-elle apparue ?', ['1983', '1948', '1995', '2001'], 0, 'Elle a permis aux machines de différentes marques de dialoguer.'],
            ['Qu’est-ce que l’échantillonnage (sampling) ?', ['Réutiliser un extrait sonore enregistré', 'Écrire une partition', 'Accorder un instrument', 'Amplifier un son'], 0, 'Il est au cœur du hip-hop et des musiques électroniques.'],
            ['Le studio d’enregistrement peut être considéré comme un instrument.', ['Vrai', 'Faux'], 0, 'Montage, effets, superpositions : il façonne l’œuvre elle-même.'],
            ['Un synthétiseur soustractif fonctionne en…', ['Filtrant un son riche en harmoniques', 'Additionnant des sinusoïdes', 'Enregistrant des sons réels', 'Frappant une corde'], 0, 'On part d’un signal riche et on retire des fréquences.'],
            ['L’enregistrement a fait de la version enregistrée la référence de l’œuvre.', ['Vrai', 'Faux'], 0, 'Un renversement complet : la trace est devenue le modèle.'],
            ['L’IA générative pose surtout la question…', ['De ce qu’est un auteur', 'Du tempo', 'De l’accord des instruments', 'De la durée des concerts'], 0, 'Elle interroge la création et le droit d’auteur.'],
          ],
        },
        {
          titre: 'Interpréter et écouter',
          lecon: {
            titre: 'Le geste de l’interprète et l’oreille de l’auditeur',
            cours: `Entre la partition et l’auditeur, il y a un interprète — et une écoute. Ni l’un ni l’autre n’est passif.

## L’interprétation
Une même partition donne des résultats très différents selon ce que l’interprète décide. Il ne « restitue » pas : il **choisit**.

| Le choix | Ce qu’il change à l’écoute |
| Le tempo | L’énergie, la respiration de la phrase |
| Les nuances | Le relief, ce qui passe au premier plan |
| Le phrasé | Le sens : où la phrase respire, où elle s’enchaîne |
| L’instrument | La couleur, l’équilibre, la puissance |

## Les pratiques d’époque
Le mouvement de la musique **historiquement informée**, à partir des années 1960, rejoue le répertoire ancien avec les moyens de son temps : diapason plus bas, cordes en boyau, effectifs réduits, articulation plus légère. Le même Bach y devient méconnaissable — et c’est le but : montrer que « la » version fidèle n’existe pas.

## Écouter activement
Écouter, ce n’est pas subir : c’est anticiper, comparer, repérer. Une écoute active se prépare et se raconte.

1. **Avant** : que vais-je chercher ? Un instrument, une forme, un retour de thème ?
2. **Pendant** : repérer les **retours** (ce qui revient) et les **ruptures** (ce qui casse).
3. **Après** : dire ce qu’on a entendu, avec des mots d’analyse, pas seulement de goût.

> Comparer deux interprétations du même passage est le raccourci le plus efficace : ce qui diffère entre les deux, c’est exactement ce que l’interprète décide.

## Le concert et le direct
Le direct ajoute l’incertitude, le corps, l’acoustique du lieu et le public. Aucun enregistrement ne reproduit ce que fait une salle qui écoute ensemble — le silence d’un public attentif fait partie de l’œuvre entendue.`,
          },
          questions: [
            ['Deux interprétations d’une même partition peuvent différer fortement.', ['Vrai', 'Faux'], 0, 'Tempo, nuances, phrasé, instruments : l’interprète décide.'],
            ['Que cherche la musique « historiquement informée » ?', ['Rejouer avec les instruments et techniques de l’époque', 'Moderniser les œuvres anciennes', 'Composer à la manière ancienne', 'Supprimer les partitions'], 0, 'Diapason plus bas, cordes en boyau, effectifs réduits.'],
            ['Qu’apporte le concert par rapport à l’enregistrement ?', ['L’incertitude, le lieu et la présence du public', 'Une meilleure fidélité sonore', 'Une durée plus courte', 'Une partition plus juste'], 0, 'L’acoustique et l’écoute collective en font un autre objet.'],
            ['Une écoute active se prépare avant l’écoute.', ['Vrai', 'Faux'], 0, 'Savoir ce qu’on cherche transforme ce qu’on entend.'],
            ['Le phrasé désigne…', ['La manière de relier et respirer les notes', 'La vitesse d’exécution', 'Le volume sonore', 'La hauteur des notes'], 0, 'C’est l’un des principaux leviers de l’interprète.'],
            ['L’interprète se contente de restituer fidèlement la partition.', ['Vrai', 'Faux'], 1, 'La partition sous-détermine largement le résultat sonore.'],
            ['Le diapason ancien était généralement…', ['Plus bas qu’aujourd’hui', 'Plus haut', 'Identique', 'Inexistant'], 0, 'D’où une couleur sonore différente dans les interprétations baroques.'],
            ['Raconter ce qu’on a entendu fait partie de l’écoute active.', ['Vrai', 'Faux'], 0, 'La verbalisation fixe et affine la perception.'],
          ],
        },
      ],
    },
  ],
}
