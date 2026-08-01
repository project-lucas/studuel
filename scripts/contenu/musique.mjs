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
            cours: `Tout son musical se décrit avec quatre paramètres. Les nommer, c'est pouvoir parler précisément de ce qu'on entend.

## La hauteur
Un son est **aigu** ou **grave** selon sa fréquence, mesurée en hertz (Hz). Plus la fréquence est élevée, plus le son est aigu. Le la du diapason est à 440 Hz.

## La durée
Un son est long ou court. En notation, les figures de note codent ces durées : ronde, blanche, noire, croche — chacune vaut la moitié de la précédente.

## L'intensité
C'est le volume : **piano** (doux), **forte** (fort), avec les nuances intermédiaires (mezzo forte, fortissimo). Le **crescendo** augmente progressivement l'intensité, le **decrescendo** la diminue.

## Le timbre
C'est la « couleur » du son : ce qui permet de distinguer une flûte d'un violon jouant exactement la même note. Le timbre vient des harmoniques produites par l'instrument.`,
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
            cours: `Un orchestre se lit d'abord par familles.

## Les cordes
**Frottées** (violon, alto, violoncelle, contrebasse), **pincées** (harpe, guitare), **frappées** (piano). Le violon est le plus aigu de la famille frottée, la contrebasse la plus grave.

## Les vents
**Bois** : flûte, clarinette, hautbois, basson, saxophone (classé bois malgré son métal, car le son naît d'une anche). **Cuivres** : trompette, cor, trombone, tuba, où le son naît de la vibration des lèvres.

## Les percussions
**Déterminées** (elles produisent une hauteur précise : xylophone, timbales) ou **indéterminées** (caisse claire, cymbales, triangle).

## La voix
Voix de femmes : soprano, mezzo-soprano, alto. Voix d'hommes : ténor, baryton, basse. Le chœur peut être **a cappella** (sans accompagnement) ou accompagné.`,
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
            cours: `Trois notions qu'on confond souvent, et qu'il faut distinguer.

## La pulsation
C'est le battement régulier sous-jacent, celui qu'on tape du pied. Elle ne s'entend pas toujours, mais on la sent : c'est la grille sur laquelle tout se place.

## Le tempo
C'est la **vitesse** de cette pulsation, en battements par minute (bpm). Les indications italiennes traditionnelles : *largo* (très lent), *adagio* (lent), *andante* (allant), *allegro* (vif), *presto* (très rapide).

## Le rythme
C'est l'organisation des durées **par-dessus** la pulsation : les notes longues et courtes qui dessinent une figure reconnaissable. Deux morceaux au même tempo peuvent avoir des rythmes très différents.

## La mesure
Les pulsations se groupent en mesures : à **2 temps**, **3 temps** (la valse) ou **4 temps** (le plus courant). Le premier temps est le temps fort.`,
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

## Moyen Âge et Renaissance
Le **chant grégorien** (monodique, en latin, sans accompagnement) domine le Moyen Âge. La Renaissance développe la **polyphonie** : plusieurs voix indépendantes superposées.

## Baroque (1600-1750)
Naissance de l'**opéra** (Monteverdi), de la fugue et du concerto. Basse continue et ornementation. Figures : **Bach**, **Vivaldi**, **Haendel**.

## Classique (1750-1820) et romantique (1820-1900)
Le classicisme cherche l'équilibre et la clarté : **Mozart**, **Haydn**, le premier **Beethoven**. Le romantisme cherche l'expression du sentiment et l'ampleur : **Chopin**, **Berlioz**, **Wagner**.

## XXe siècle et musiques actuelles
Rupture avec la tonalité (**Debussy**, **Stravinsky**, Schoenberg), puis explosion des musiques enregistrées : jazz, rock, musiques électroniques, rap. La technologie devient un instrument à part entière.`,
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
**Forme strophique** : le même thème avec des paroles différentes (la chanson à couplets). **Forme AABA** : très répandue dans la chanson et le jazz. **Refrain-couplet** : l'alternance la plus familière.

## Le rondo
Un thème principal A revient entre des épisodes contrastés : **A-B-A-C-A**. La forme est fondée sur le retour.

## Le thème et variations
Un thème est exposé puis transformé : changement de rythme, d'harmonie, de mode, d'instrumentation. Le thème reste reconnaissable sous ses déguisements.

## Le canon et la fugue
Dans le **canon**, une voix imite exactement une autre à distance (*Frère Jacques*). La **fugue** développe cette imitation de façon savante, avec un sujet, une réponse et des épisodes.`,
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
Chanson de révolte et musique de contestation : le blues né de l'esclavage et de la ségrégation, la chanson engagée française, le rap comme parole des quartiers, les hymnes de mouvements sociaux. La musique donne une voix collective.

## Musique et pouvoir
Les régimes autoritaires ont toujours cherché à contrôler la musique : censure, musiques officielles, artistes interdits. À l'inverse, un hymne national fabrique de l'unité.

## Musique et image
Au cinéma, la musique **anticipe** (elle prévient d'un danger), **contredit** (une valse sur une scène violente) ou **soutient** l'image. Le *leitmotiv* associe un thème à un personnage.

## L'industrie musicale aujourd'hui
Enregistrement, diffusion, streaming, algorithmes de recommandation : la façon dont on découvre la musique a changé plus vite que la musique elle-même. Le droit d'auteur rémunère la création.`,
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
            cours: `Analyser, c'est nommer ce qui produit l'effet ressenti.

## Tonalité et modes
Le système **tonal** organise les sons autour d'une note centrale, la tonique. Le mode **majeur** est perçu comme lumineux, le **mineur** comme sombre — perception culturelle plus que naturelle. Les musiques modales (grégorien, musiques traditionnelles, jazz modal) reposent sur d'autres échelles.

## L'accord et la cadence
Un **accord** superpose au moins trois sons. La **cadence** est la formule qui conclut une phrase : la cadence parfaite (dominante → tonique) donne un sentiment d'achèvement, la cadence suspensive laisse en attente.

## La texture
**Monodie** (une seule ligne), **homophonie** (une mélodie accompagnée), **polyphonie** (plusieurs lignes indépendantes), **hétérophonie** (variantes simultanées d'une même ligne).

## Analyser une œuvre
Repérer la forme, la texture, l'instrumentation, le tempo, le mode, et surtout ce qui **change** : c'est au moment de la rupture que l'intention du compositeur se lit le mieux.`,
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
            cours: `Depuis un siècle, la technologie n'accompagne plus la musique : elle la compose.

## De l'enregistrement au studio
Le microphone, le disque puis le multipiste transforment l'œuvre : le studio devient un instrument, et la version enregistrée devient la référence, alors qu'elle n'était au départ qu'une trace.

## Musique concrète et électroacoustique
**Pierre Schaeffer** (1948) compose à partir de sons enregistrés du réel : c'est la musique concrète. L'électroacoustique élargit le matériau à tout son possible, y compris synthétique.

## Le synthétiseur et le MIDI
Le synthétiseur fabrique le son (additif, soustractif, FM). La norme **MIDI** (1983) permet aux machines de dialoguer : elle transporte des instructions (quelle note, quelle intensité), pas du son.

## Aujourd'hui
Séquenceurs, échantillonnage, auto-tune, intelligence artificielle générative : chaque outil déplace la frontière entre interprétation et fabrication, et pose la question de ce qu'est un auteur.`,
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
            cours: `Entre la partition et l'auditeur, il y a un interprète — et une écoute.

## L'interprétation
Une même partition donne des résultats très différents selon le tempo choisi, les nuances, le phrasé, l'instrument d'époque ou moderne. L'interprète ne « restitue » pas : il décide.

## Les pratiques d'époque
Le mouvement de la musique historiquement informée (à partir des années 1960) rejoue le répertoire ancien avec les instruments et les techniques de son temps : diapason plus bas, cordes en boyau, effectifs réduits.

## Écouter activement
Écouter, ce n'est pas subir : c'est anticiper, comparer, repérer les retours et les ruptures. Une écoute active se prépare (que vais-je chercher ?) et se raconte après (qu'ai-je entendu ?).

## Le concert et le direct
Le direct ajoute l'incertitude, le corps, l'acoustique du lieu et le public. Aucun enregistrement ne reproduit exactement ce que fait une salle qui écoute ensemble.`,
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
