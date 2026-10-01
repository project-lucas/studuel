// MUSIQUE — TERMINALE : le programme officiel du lycée et le programme
// limitatif de l’année 2026-2027.
//
// CONSTAT (extraction de la base, 26/09/2026) : la musique de terminale tenait
// en TROIS fiches génériques (« Langage musical et analyse », « Création et
// technologies », « Interpréter et écouter »), communes à la 2de, à la 1re et à
// la Tle (bloc `['2de', '1re', 'Tle']` de `musique.mjs`), sans axe du
// programme ; aucune œuvre du programme limitatif n’y figurait, ni l’épreuve.
//
// L’app ne distingue pas l’enseignement de SPÉCIALITÉ de l’enseignement
// OPTIONNEL : il n’y a qu’une matière `musique`. Ce module suit donc le
// programme de SPÉCIALITÉ de terminale (BO spécial n° 8 du 25 juillet 2019 :
// trois champs de questionnement, compétences complémentaires de terminale),
// le seul qui ait une épreuve terminale et un programme limitatif (BO n° 4 du
// 22 janvier 2026, annexe 6), et consacre une fiche au programme
// complémentaire de l’OPTION (même BO, annexe 9 : les musiques vocales des
// territoires ultramarins), qui sert aussi au champ « Mondialisation ».
//
// POURQUOI UN SECOND MODULE : `musique.mjs` est déjà parti dans une migration
// exécutée. Même slug, génération par `--modules musique-tle`. Terminale seule.

export default {
  slug: 'musique',
  nom: 'Musique',

  titreMigration: 'MUSIQUE Tle — CHAMPS DE QUESTIONNEMENT, PROGRAMME LIMITATIF 2026-2027 ET ÉPREUVE',

  motif: `La musique de terminale n’avait que 3 fiches génériques partagées avec la
2de et la 1re, sans axe du programme ; ni les œuvres du programme limitatif
2026-2027 (Porgy and Bess par Armstrong et Fitzgerald, l’Allegro assai de
C. P. E. Bach, les partitions-images de l’Ars nova et de l’Ars subtilior), ni
l’épreuve (écrit de 3 h 30 en trois exercices, oral de 30 minutes) n’y
figuraient. Cette migration AJOUTE 12 fiches rangées sous les trois champs de
questionnement du programme, le programme limitatif et l’épreuve. Les trois
fiches existantes sont conservées.`,

  blocs: [
    {
      niveaux: ['Tle'],
      positionDepart: 4,
      chapitres: [
        // ─────────────────────────── PROGRAMME LIMITATIF 2026-2027 ───────────────────────────
        {
          titre: 'Porgy and Bess par Louis Armstrong et Ella Fitzgerald',
          axe: 'Programme limitatif 2026-2027',
          lecon: {
            titre: 'Un opéra de 1935 devenu disque de jazz en 1958',
            cours: `Deux géants du jazz reprennent un opéra américain : c’est la partie **renouvelée** du programme limitatif 2026-2027. L’œuvre à connaître est le disque *Porgy and Bess* de **Louis Armstrong** et **Ella Fitzgerald**, paru chez **Verve Records** en **1958**, dont cinq titres sont au programme.

## Les cinq titres au programme
1. **Ouverture**
2. **Summertime**
3. **I Got Plenty O’ Nuttin’**
4. **It Ain’t Necessarily So**
5. **Oh Lawd, I’m on My Way!**

## L’opéra d’origine
@ 1925 — *Porgy*, roman de DuBose Heyward
@ 1935 — Création de l’opéra *Porgy and Bess* de George Gershwin à New York
@ 1958 — Le disque d’Armstrong et Fitzgerald chez Verve

**George Gershwin** (1898-1937) compose la musique ; le livret est de **DuBose Heyward**, les paroles de Heyward et d’**Ira Gershwin**, frère du compositeur. Gershwin parle d’un « **folk opera** » : un opéra nourri de spirituals, de blues et de jazz, chanté par une distribution afro-américaine.

L’action se passe à **Catfish Row**, quartier noir de **Charleston** (Caroline du Sud). **Porgy**, mendiant infirme, aime **Bess**, que se disputent le violent **Crown** et **Sportin’ Life**, trafiquant de drogue.

| Titre | Dans l’opéra | Ce qu’il faut entendre |
| *Summertime* | Berceuse chantée par **Clara** à son bébé, au début de l’acte I | Tempo lent, mode mineur, couleur de blues : une douceur inquiète |
| *I Got Plenty O’ Nuttin’* | **Porgy** se dit heureux de ne rien posséder | Chanson légère, rythme dansant, accompagnement façon banjo |
| *It Ain’t Necessarily So* | **Sportin’ Life** se moque des histoires de la Bible, au pique-nique | Ironie, rythme syncopé, dialogue soliste-chœur |
| *Oh Lawd, I’m on My Way!* | **Finale** : Porgy part pour New York retrouver Bess | Élan d’un spiritual, marche vers l’ailleurs |

## Le disque de 1958
Le producteur **Norman Granz** réunit les deux chanteurs, qui ont déjà enregistré ensemble. Les arrangements et la direction sont confiés à **Russell Garcia**, pour un **grand orchestre** avec cordes, auquel s’ajoute la **section rythmique** du jazz.

| Élément | Ce qu’il change par rapport à l’opéra |
| Deux voix seulement | Les deux chanteurs se partagent des rôles d’hommes, de femmes et de chœur : la distribution ne compte plus |
| Le **timbre** | La voix rocailleuse et le **vibrato** large d’Armstrong, la voix claire, souple et juste de Fitzgerald |
| La **trompette** d’Armstrong | Elle répond au chant, comme une seconde voix |
| Le **swing** et la liberté rythmique | Les chanteurs placent les mots légèrement avant ou après le temps |
| L’orchestre | Des couleurs symphoniques (cordes, bois) au service de chansons |

> Ce disque n’est pas une « version abrégée » de l’opéra : c’est une **recréation**. Des airs écrits pour la scène deviennent des **standards** de jazz, interprétés par des voix qui ont leur propre style. C’est exactement la thématique « Authenticité vs recréation ».

## Pistes d’étude
1. **Comparer** une version d’opéra (voix lyrique, grand orchestre) et la version du disque.
2. **Écouter** d’autres reprises de *Summertime* (c’est l’une des chansons les plus enregistrées au monde).
3. **Situer** : l’opéra de Gershwin, écrit par un compositeur blanc sur une communauté noire, a suscité des débats ; ses héritiers ont exigé qu’il soit chanté par des interprètes noirs.

## Vocabulaire
| Mot | Sens |
| Berceuse | Chanson pour endormir un enfant, souvent balancée et lente |
| Spiritual | Chant religieux afro-américain né dans l’esclavage |
| Standard | Chanson reprise par de nombreux musiciens de jazz |
| Scat | Improvisation vocale sur des syllabes sans sens |`,
          },
          questions: [
            ['Chez quel label paraît le disque *Porgy and Bess* d’Armstrong et Fitzgerald ?', ['Blue Note', 'Columbia', 'Verve Records', 'Motown'], 2, 'Le producteur Norman Granz dirigeait le label Verve.'],
            ['Qui a composé l’opéra *Porgy and Bess* ?', ['George Gershwin', 'Duke Ellington', 'Leonard Bernstein', 'Cole Porter'], 0, 'Créé à New York en 1935.'],
            ['Dans l’opéra, qui chante *Summertime* ?', ['Bess', 'Porgy', 'Sportin’ Life', 'Clara, à son bébé'], 3, 'C’est une berceuse au début de l’acte I.'],
            ['Quel personnage se moque des histoires de la Bible dans *It Ain’t Necessarily So* ?', ['Crown', 'Sportin’ Life', 'Porgy', 'Serena'], 1, 'Le trafiquant ironique, au pique-nique de la communauté.'],
            ['*Oh Lawd, I’m on My Way!* est le finale de l’opéra.', ['Vrai', 'Faux'], 0, 'Porgy part pour New York retrouver Bess.'],
            ['Où se passe l’action de *Porgy and Bess* ?', ['À Harlem', 'À Catfish Row, à Charleston', 'À La Nouvelle-Orléans', 'À Chicago'], 1, 'Un quartier noir de Caroline du Sud.'],
            ['Qui signe les arrangements et la direction du disque de 1958 ?', ['Norman Granz', 'Quincy Jones', 'Russell Garcia', 'Nelson Riddle'], 2, 'Granz produit, Garcia arrange et dirige le grand orchestre.'],
            ['Quelle expression Gershwin emploie-t-il pour son œuvre ?', ['« Folk opera »', '« Musical comedy »', '« Jazz suite »', '« Opera seria »'], 0, 'Un opéra nourri de spirituals, de blues et de jazz.'],
            ['Dans *I Got Plenty O’ Nuttin’*, Porgy se dit…', ['Désespéré d’avoir perdu Bess', 'Heureux de ne rien posséder', 'Jaloux de Crown', 'Prêt à partir'], 1, 'Une chanson légère et dansante.'],
            ['Sur le disque, les deux chanteurs respectent strictement la distribution de l’opéra.', ['Vrai', 'Faux'], 1, 'Ils se partagent des rôles d’hommes, de femmes et de chœur : c’est une recréation.'],
            ['Qu’est-ce qu’un « standard » de jazz ?', ['Une chanson reprise par de nombreux musiciens de jazz', 'Un tempo de référence', 'Un instrument de la section rythmique', 'Un disque vendu à un million d’exemplaires'], 0, '*Summertime* en est l’un des plus célèbres.'],
            ['Quel élément du disque ne vient PAS de l’opéra d’origine ?', ['La mélodie de *Summertime*', 'Les paroles d’Ira Gershwin', 'Le finale', 'La trompette d’Armstrong qui répond au chant'], 3, 'Elle fait partie de la recréation jazz.'],
          ],
        },
        {
          titre: 'C. P. E. Bach : l’Allegro assai du Concerto pour violoncelle Wq 172',
          axe: 'Programme limitatif 2026-2027',
          lecon: {
            titre: 'Entre baroque et classicisme : le style sensible',
            cours: `Deuxième œuvre du programme limitatif : l’« **Allegro assai** », dernier mouvement du **Concerto pour violoncelle en la majeur, Wq 172**, de **Carl Philipp Emanuel Bach**. Une musique écrite au moment où le baroque cède la place au style classique.

## Le compositeur
**Carl Philipp Emanuel Bach** (1714-1788) est le deuxième fils survivant de **Jean-Sébastien Bach**.

@ 1740 — Claveciniste de la cour de **Frédéric II de Prusse**, à Berlin (et Potsdam)
@ 1753 — Publication de son *Essai sur la vraie manière de jouer des instruments à clavier* ; vers la même époque, les trois concertos pour violoncelle
@ 1768 — Il succède à **Telemann** comme directeur de la musique à **Hambourg**

Le sigle **Wq** renvoie au catalogue de ses œuvres établi par Alfred **Wotquenne** (1905).

## Une œuvre, trois versions
Ce concerto existe en trois versions : pour **violoncelle**, pour **clavecin** et pour **flûte**. Le compositeur réutilise sa musique selon les solistes disponibles, pratique courante à son époque.

## L’Empfindsamkeit, le « style sensible »
| Style | Ce qui le caractérise |
| Baroque tardif (J.-S. Bach) | Une énergie continue, un **Affekt** unique par mouvement, le contrepoint, la **basse continue** |
| **Empfindsamer Stil** (C. P. E. Bach) | Des **contrastes soudains** de nuance et de caractère, des surprises harmoniques, des silences, une expression personnelle |
| Style classique (Haydn, Mozart) | Des phrases symétriques, une mélodie accompagnée claire, des formes équilibrées |

> C. P. E. Bach fait le **pont** : il garde la basse continue et la forme à ritournelle du concerto baroque, mais y met des changements d’humeur brusques qui annoncent Haydn.

## Le concerto : la forme à ritournelle
Le concerto de soliste repose sur l’alternance entre l’orchestre (**tutti**) et le soliste (**solo**).

~ Ritournelle (tutti) → épisode soliste → ritournelle abrégée, dans un autre ton → épisode soliste → ritournelle finale

| Élément | Rôle |
| La **ritournelle** | Le thème de l’orchestre, qui revient, parfois écourté et **modulé** |
| Les **épisodes solistes** | Le violoncelle déploie traits rapides, arpèges, passages virtuoses |
| La **modulation** | Les retours de ritournelle passent par des tonalités voisines avant de revenir en la majeur |
| L’effectif | Orchestre à cordes et basse continue (clavecin et basses) |

## Ce qu’il faut entendre dans l’Allegro assai
1. Un **tempo très rapide** (*assai* : « très ») et une énergie de finale.
2. Le **dialogue** tutti / solo, que l’on repère à la différence de masse sonore.
3. La **virtuosité** du violoncelle, qui parcourt tout son registre, du grave à l’aigu.
4. Des **contrastes** de nuances (*forte* / *piano*) typiques du style sensible.

## Pistes d’étude
- **Comparer** les versions pour violoncelle, clavecin et flûte : même musique, autre timbre.
- **Comparer** une interprétation sur instruments d’époque (cordes en boyau, diapason plus bas) et sur instruments modernes.
- **Relier** à la thématique « Variants et invariants du langage musical ».`,
          },
          questions: [
            ['Quel est le lien de parenté entre C. P. E. Bach et Jean-Sébastien Bach ?', ['Son frère', 'Son fils', 'Son neveu', 'Son élève sans parenté'], 1, 'Il est le deuxième fils survivant de J.-S. Bach.'],
            ['Pour quel souverain C. P. E. Bach a-t-il été claveciniste à Berlin ?', ['Frédéric II de Prusse', 'Louis XV', 'Marie-Thérèse d’Autriche', 'George II'], 0, 'Il sert à sa cour à partir de 1740.'],
            ['Que signifie « assai » dans « Allegro assai » ?', ['Modérément', 'Un peu', 'Très', 'En chantant'], 2, 'Allegro assai : très rapide.'],
            ['Que désigne le sigle « Wq » ?', ['Le numéro d’opus choisi par le compositeur', 'La tonalité', 'Le nom de l’éditeur', 'Le catalogue établi par Alfred Wotquenne'], 3, 'Publié en 1905.'],
            ['Ce concerto existe aussi en version pour clavecin et pour flûte.', ['Vrai', 'Faux'], 0, 'Le compositeur adapte sa musique aux solistes disponibles.'],
            ['Comment s’appelle le style de C. P. E. Bach, fait de contrastes soudains ?', ['Le style galant français', 'L’Empfindsamkeit, le style sensible', 'Le romantisme', 'L’Ars nova'], 1, 'Il annonce les surprises de Haydn.'],
            ['Dans la forme à ritournelle, que désigne la ritournelle ?', ['Le thème de l’orchestre qui revient', 'La cadence improvisée du soliste', 'Le mouvement lent', 'Le dernier accord'], 0, 'Elle revient, parfois abrégée et dans d’autres tonalités.'],
            ['Quel terme désigne l’ensemble de l’orchestre qui joue ?', ['Solo', 'Ripieno solo', 'Tutti', 'Basso'], 2, 'Le concerto alterne tutti et solo.'],
            ['L’Allegro assai est le premier mouvement du concerto.', ['Vrai', 'Faux'], 1, 'C’est le dernier mouvement, le finale.'],
            ['Quelle ville accueille C. P. E. Bach en 1768, où il succède à Telemann ?', ['Leipzig', 'Vienne', 'Dresde', 'Hambourg'], 3, 'Il y dirige la musique jusqu’à sa mort en 1788.'],
            ['Quel élément baroque C. P. E. Bach garde-t-il dans ce concerto ?', ['La basse continue', 'Le piano-forte moderne', 'La forme sonate développée', 'L’orchestre symphonique à vents'], 0, 'Clavecin et basses soutiennent l’harmonie.'],
            ['En quelle tonalité est écrit le Concerto pour violoncelle Wq 172 ?', ['Ré mineur', 'Sol majeur', 'La majeur', 'Si bémol majeur'], 2, 'La ritournelle finale revient toujours au ton principal.'],
          ],
        },
        {
          titre: 'Écritures, formes, graphismes : la partition devient image',
          axe: 'Programme limitatif 2026-2027',
          lecon: {
            titre: 'Machaut, Ciconia, Senleches, Cordier : le jeu de l’écrit',
            cours: `Le programme limitatif propose une série intitulée « **Écritures, formes, graphismes** » : quatre pièces de la fin du Moyen Âge où **la manière d’écrire la musique fait partie de l’œuvre**.

## Les quatre pièces au programme
| Compositeur | Œuvre | Le jeu d’écriture |
| **Guillaume de Machaut** (vers 1300-1377) | *Ma fin est mon commencement* | Une pièce qui se lit **à l’endroit et à l’envers** |
| **Johannes Ciconia** (vers 1370-1412) | *Le Ray au soleyl* | Un **canon** : une seule ligne écrite, chantée par trois voix à des vitesses différentes |
| **Jacob Senleches** (fin du XIVe siècle) | *La Harpe de Mélodie* | La partition est dessinée **en forme de harpe**, les portées sont ses cordes |
| **Baude Cordier** (vers 1400) | *Tout par compas suy composés* | La partition est écrite **en cercle** (« compas » : le compas du dessinateur) |

## Le contexte : Ars nova et Ars subtilior
@ vers 1320 — L’**Ars nova** (Philippe de Vitry) : une notation nouvelle qui permet des rythmes plus fins
@ 1377 — Mort de Machaut, grand maître de l’Ars nova
@ vers 1370-1420 — L’**Ars subtilior** (« art plus subtil ») dans les cours d’Avignon, de Foix, d’Aragon, de Milan

L’Ars subtilior pousse la complexité très loin : **syncopes**, rythmes superposés, notes **rouges** qui changent la valeur des durées. Beaucoup de ces pièces sont conservées dans le **Codex de Chantilly**.

## Machaut : « Ma fin est mon commencement »
Ce **rondeau** à trois voix dit ce qu’il fait. Une des voix, lue **à rebours**, donne une autre voix ; la ligne de **ténor** est un **palindrome** : sa seconde moitié est la première lue à l’envers.

> Le texte (« ma fin est mon commencement et mon commencement ma fin ») est à la fois le **titre**, la **règle de lecture** et le **sens** de la pièce. L’écriture est une énigme que les chanteurs doivent résoudre.

## Ciconia : le canon de proportions
*Le Ray au soleyl* (« le rayon du soleil ») est un **canon** : une seule mélodie écrite, que trois voix chantent **en même temps à des vitesses différentes**, selon des rapports de durée (proportions). Le soleil rayonnant était l’emblème des Visconti, seigneurs de Milan.

## Senleches et Cordier : voir la musique
| Œuvre | La forme dessinée | Pourquoi |
| *La Harpe de Mélodie* | Une harpe | La musique parle de la harpe, instrument de David et de l’harmonie |
| *Tout par compas suy composés* | Un cercle | Le **canon** tourne sans fin, comme le cercle ; le texte vante la composition « au compas » |

Baude Cordier a aussi écrit une chanson dont la partition dessine un **cœur**, *Belle, bonne, sage*.

## Ce que ces pièces nous apprennent
1. **La partition n’est pas neutre** : elle peut être un jeu, une énigme, une image.
2. **Forme et écriture sont liées** : le canon « tourne », le palindrome « se replie ».
3. **La musique savante médiévale** est un art de cour raffiné, destiné à des connaisseurs.
4. Ces pièces dialoguent avec des démarches bien plus récentes : les **partitions graphiques** du XXe siècle (John Cage, Cathy Berberian) ou le musicogramme.

## Vocabulaire
| Mot | Sens |
| Canon | Une même mélodie reprise en décalé par plusieurs voix |
| Rondeau | Forme poétique et musicale à refrain |
| Palindrome | Ce qui se lit pareil dans les deux sens |
| Rétrograde | Une mélodie jouée de la dernière note à la première |
| Ténor (médiéval) | La voix qui « tient » la structure, souvent en valeurs longues |`,
          },
          questions: [
            ['Quel compositeur a écrit *Ma fin est mon commencement* ?', ['Baude Cordier', 'Guillaume de Machaut', 'Johannes Ciconia', 'Josquin des Prés'], 1, 'Maître de l’Ars nova, mort en 1377.'],
            ['Quelle forme dessine la partition de *La Harpe de Mélodie* ?', ['Une harpe', 'Un cœur', 'Un cercle', 'Une étoile'], 0, 'Les portées y sont les cordes de l’instrument.'],
            ['Pourquoi *Tout par compas suy composés* est-il écrit en cercle ?', ['Pour économiser du parchemin', 'Parce que c’est une danse en ronde', 'Pour le lire à l’envers', 'Parce que le canon tourne sans fin, comme le cercle'], 3, '« Compas » renvoie au compas du dessinateur.'],
            ['Qu’est-ce qu’un canon ?', ['Une pièce pour un seul instrument', 'Une même mélodie reprise en décalé par plusieurs voix', 'Un chant sans paroles', 'Une danse de cour'], 1, '*Le Ray au soleyl* de Ciconia en est un.'],
            ['Dans *Le Ray au soleyl*, les trois voix chantent la même ligne à des vitesses différentes.', ['Vrai', 'Faux'], 0, 'C’est un canon de proportions.'],
            ['Que signifie « Ars subtilior » ?', ['Art nouveau', 'Art ancien', 'Art plus subtil', 'Art sacré'], 2, 'Un courant raffiné de la fin du XIVe siècle.'],
            ['Dans quel manuscrit sont conservées beaucoup de pièces de l’Ars subtilior ?', ['Le Codex de Chantilly', 'Les Carmina Burana', 'Le Graduel romain', 'Le Livre vermeil'], 0, 'Il est conservé au musée Condé.'],
            ['Qu’est-ce qu’un palindrome ?', ['Une note tenue longtemps', 'Une pièce à refrain', 'Un accord dissonant', 'Ce qui se lit pareil dans les deux sens'], 3, 'La ligne de ténor de Machaut en est un.'],
            ['Quelle chanson de Baude Cordier est écrite en forme de cœur ?', ['*Ma fin est mon commencement*', '*Belle, bonne, sage*', '*Le Ray au soleyl*', '*La Harpe de Mélodie*'], 1, 'L’image dit le sujet : une chanson d’amour.'],
            ['Qui est associé à l’Ars nova vers 1320 ?', ['Pérotin', 'Monteverdi', 'Philippe de Vitry', 'Hildegarde de Bingen'], 2, 'Il fixe une notation nouvelle des rythmes.'],
            ['Dans l’Ars subtilior, des notes rouges peuvent changer la valeur des durées.', ['Vrai', 'Faux'], 0, 'La couleur fait partie de la notation.'],
            ['Que désigne une mélodie « rétrograde » ?', ['Une mélodie jouée à l’octave', 'Une mélodie plus lente', 'Une mélodie jouée de la dernière note à la première', 'Une mélodie sans rythme'], 2, 'C’est le principe de *Ma fin est mon commencement*.'],
          ],
        },

        // ─────────────────────── LE SON, LA MUSIQUE, L’ESPACE ET LE TEMPS ───────────────────────
        {
          titre: 'Les formes musicales : organiser le temps',
          axe: 'Le son, la musique, l’espace et le temps',
          lecon: {
            titre: 'Répéter, contraster, varier : les principes du discours musical',
            cours: `La musique est un **art du temps** : elle ne se voit pas d’un coup, elle se déroule. Pour que l’auditeur s’y retrouve, les compositeurs l’organisent en **formes**. Deux thématiques du programme en parlent : « La musique, un art du temps » et « La forme : principes et éléments du discours musical ».

## Trois principes
| Principe | Ce qu’il produit | Exemple |
| La **répétition** | La mémoire, le repère | Un refrain qui revient |
| Le **contraste** | La surprise, la relance | Un couplet différent, un changement de tempo |
| La **variation** | La reconnaissance et la nouveauté à la fois | Un thème orné, harmonisé autrement |

> Presque toutes les formes combinent ces trois principes. Analyser une forme, c’est repérer **ce qui revient** et **ce qui change**.

## Les formes à connaître
| Forme | Schéma | Où on la trouve |
| **Couplet-refrain** | A (couplet) · R · B · R | La chanson, du Moyen Âge à la pop |
| **Rondeau** | R · A · R · B · R | Chez Machaut (poésie), chez Couperin, dans le rondo classique |
| **Ritournelle** | Tutti · solo · tutti · solo · tutti | Le concerto baroque (Vivaldi, C. P. E. Bach) |
| **Forme ABA** (lied, da capo) | A · B · A | L’aria baroque, le menuet et son trio |
| **Thème et variations** | A · A1 · A2 · A3… | Les *Variations Goldberg* de Bach |
| **Forme sonate** | Exposition · développement · réexposition | Le premier mouvement des sonates et symphonies classiques |
| **Blues de 12 mesures** | Une grille de trois accords qui tourne | Le blues, le rock, le jazz |
| **Forme AABA** | Quatre phrases de 8 mesures (32 mesures) | Les chansons de Broadway et les standards de jazz |

## La forme sonate en détail
~ Exposition (thème 1 au ton principal → thème 2 dans un ton voisin) → développement (thèmes fragmentés, modulations) → réexposition (les deux thèmes au ton principal)

C’est la grande forme de **Haydn, Mozart et Beethoven** : un drame de tonalités qui s’éloignent puis se réconcilient.

## Le temps musical
| Notion | Définition |
| **Pulsation** | Le battement régulier qu’on marque du pied |
| **Tempo** | La vitesse de la pulsation (en battements par minute) |
| **Mesure** | Le regroupement des temps : binaire (2, 4) ou ternaire (3, 6/8) |
| **Temps lisse** | Sans pulsation perceptible (certaines musiques contemporaines, le chant grégorien) |
| **Ostinato** | Un motif répété obstinément, qui fige le temps |

## Méthode : repérer la forme à l’écoute
1. **Compter** les grandes sections et **nommer** chacune par une lettre (A, B, A’…).
2. **Noter** ce qui marque les frontières : cadence, silence, changement d’instrument.
3. **Comparer** les retours : identiques, variés, écourtés ?
4. **Dessiner** un **musicogramme** : une frise où l’on figure les sections, les instruments et les nuances.

!> Ne confonds pas **forme** et **genre** : la symphonie est un genre, la forme sonate est la manière dont est construit son premier mouvement.`,
          },
          questions: [
            ['Quels sont les trois grands principes qui organisent une forme musicale ?', ['Hauteur, durée, intensité', 'Répétition, contraste, variation', 'Mélodie, harmonie, rythme', 'Tutti, solo, cadence'], 1, 'Analyser une forme, c’est repérer ce qui revient et ce qui change.'],
            ['Quel est le schéma d’un rondeau ?', ['R · A · R · B · R', 'A · B · C · D', 'A · A · B · A', 'Exposition · développement · réexposition'], 0, 'Le refrain revient entre des couplets différents.'],
            ['Quelles sont les trois parties de la forme sonate ?', ['Prélude, fugue, coda', 'Couplet, refrain, pont', 'Exposition, développement, réexposition', 'Tutti, solo, tutti'], 2, 'La grande forme de Haydn, Mozart et Beethoven.'],
            ['Dans la réexposition de la forme sonate, les deux thèmes sont au ton principal.', ['Vrai', 'Faux'], 0, 'Les tonalités qui s’étaient éloignées se réconcilient.'],
            ['Combien de mesures compte la grille classique du blues ?', ['8', '16', '32', '12'], 3, 'Une grille de trois accords qui tourne.'],
            ['Quelle forme alterne tutti et solo dans le concerto baroque ?', ['La forme sonate', 'La forme à ritournelle', 'Le blues', 'Le thème et variations'], 1, 'C’est la forme de l’Allegro assai de C. P. E. Bach.'],
            ['Qu’est-ce qu’un ostinato ?', ['Un changement de tempo', 'Une cadence finale', 'Un motif répété obstinément', 'Une improvisation libre'], 2, 'Il donne une impression de temps figé.'],
            ['Une mesure à 6/8 est…', ['Binaire', 'Ternaire', 'Libre', 'Irrégulière'], 1, 'Chaque temps s’y divise en trois.'],
            ['La symphonie est une forme, au même titre que la forme sonate.', ['Vrai', 'Faux'], 1, 'La symphonie est un genre ; la forme sonate est la construction de son premier mouvement.'],
            ['Qu’est-ce qu’un musicogramme ?', ['Une frise qui représente les sections, les instruments et les nuances d’une œuvre', 'Un appareil qui mesure le son', 'Une partition pour orchestre', 'Un enregistrement'], 0, 'Un outil précieux pour l’épreuve écrite.'],
            ['Quelle forme regroupe quatre phrases de 8 mesures (AABA) ?', ['Le rondo classique', 'Le blues', 'La chanson de Broadway, reprise dans les standards de jazz', 'Le canon'], 2, '32 mesures au total.'],
            ['Que désigne le « tempo » ?', ['La hauteur d’une note', 'Le nombre de musiciens', 'La durée totale de l’œuvre', 'La vitesse de la pulsation'], 3, 'On l’exprime en battements par minute.'],
          ],
        },
        {
          titre: 'Le vocabulaire de l’analyse auditive',
          axe: 'Le son, la musique, l’espace et le temps',
          lecon: {
            titre: 'Nommer ce qu’on entend, avec précision',
            cours: `L’épreuve écrite évalue ta capacité à **décrire avec un vocabulaire adapté** ce que tu entends. Cette fiche rassemble les mots à maîtriser, rangés par paramètre.

## La texture : comment les voix s’organisent
| Terme | Définition |
| **Monodie** | Une seule ligne mélodique, sans accompagnement (le chant grégorien) |
| **Bourdon** | Une note tenue sous la mélodie (la cornemuse) |
| **Homophonie** | Toutes les voix avancent en même temps, en accords |
| **Mélodie accompagnée** | Une voix principale, soutenue par des accords |
| **Polyphonie**, **contrepoint** | Plusieurs lignes indépendantes superposées |
| **Imitation**, **canon** | Une voix reprend ce qu’une autre vient de jouer |
| **Hétérophonie** | Plusieurs variantes simultanées d’une même mélodie |

## Mélodie et harmonie
| Terme | Définition |
| **Conjoint / disjoint** | Mouvement par degrés voisins / par sauts |
| **Ambitus** | L’écart entre la note la plus grave et la plus aiguë |
| **Mode majeur / mineur** | Deux couleurs de gamme |
| **Cadence** | L’enchaînement d’accords qui ponctue une phrase |
| **Modulation** | Le passage d’une tonalité à une autre |
| **Dissonance** | Un intervalle ou un accord tendu, qui appelle une résolution |
| **Chromatisme** | L’usage des demi-tons successifs |

## Rythme et temps
| Terme | Définition |
| **Syncope** | Un son attaqué sur un temps faible et prolongé sur le temps fort |
| **Contretemps** | Un son placé entre les temps, le temps étant un silence |
| **Swing** | La manière de jouer les croches de façon inégale, typique du jazz |
| **Rubato** | Une liberté de tempo, qui étire et rattrape |
| **Accelerando / ritardando** | Accélérer / ralentir |

## Timbre et interprétation
| Terme | Définition |
| **Tessiture** | L’étendue d’une voix : soprano, alto, ténor, basse |
| **Vibrato** | L’ondulation de la hauteur d’un son tenu |
| **Pizzicato** | Les cordes pincées avec le doigt |
| **Arco** | Les cordes jouées avec l’archet |
| **Sourdine** | Un accessoire qui voile le son (cuivres, cordes) |
| **Nuances** | *piano*, *mezzo forte*, *forte*, *crescendo*, *decrescendo* |

## Le vocabulaire du jazz
| Terme | Définition |
| **Chorus** | Un tour de grille improvisé par un soliste |
| **Scat** | L’improvisation vocale sur des syllabes sans sens |
| **Walking bass** | Une contrebasse qui « marche », une note par temps |
| **Riff** | Une courte formule répétée par une section |
| **Break** | Un arrêt de l’accompagnement, pendant lequel un soliste joue seul |
| **Blue note** | Une note abaissée, entre majeur et mineur, héritée du blues |

> Un bon relevé ne se contente pas de nommer : il **situe** (« à partir de la deuxième diffusion », « au retour du refrain ») et il **relie** (ce procédé produit tel effet).

## Méthode : prendre des notes à l’écoute
1. **Première écoute** : impressions générales, effectif, caractère.
2. **Écoutes suivantes** : un paramètre à la fois (forme, texture, rythme, timbre).
3. **Minutage** : note où se passent les événements.
4. **Rédige** en phrases, du plus général au plus précis.`,
          },
          questions: [
            ['Comment appelle-t-on une seule ligne mélodique sans accompagnement ?', ['Homophonie', 'Monodie', 'Polyphonie', 'Hétérophonie'], 1, 'Le chant grégorien en est l’exemple type.'],
            ['Qu’est-ce qu’une syncope ?', ['Un silence sur le temps fort', 'Un son attaqué sur un temps faible et prolongé sur le temps fort', 'Une accélération du tempo', 'Une note très aiguë'], 1, 'Elle crée un déséquilibre rythmique.'],
            ['Que désigne le « pizzicato » ?', ['Les cordes jouées avec l’archet', 'Une note tenue', 'Les cordes pincées avec le doigt', 'Un son voilé par une sourdine'], 2, 'Son contraire : arco.'],
            ['Qu’est-ce que le « scat » ?', ['Une improvisation vocale sur des syllabes sans sens', 'Un solo de batterie', 'Une ligne de basse', 'Un chœur religieux'], 0, 'Ella Fitzgerald en est une virtuose.'],
            ['La walking bass joue généralement une note par temps.', ['Vrai', 'Faux'], 0, 'La contrebasse « marche » régulièrement.'],
            ['Que désigne l’« ambitus » d’une mélodie ?', ['Sa vitesse', 'Son caractère', 'Sa tonalité', 'L’écart entre sa note la plus grave et sa note la plus aiguë'], 3, 'Un ambitus large donne souvent une impression d’élan.'],
            ['Plusieurs lignes indépendantes superposées forment…', ['Une monodie', 'Un bourdon', 'Une polyphonie', 'Un unisson'], 2, 'On parle aussi de contrepoint.'],
            ['Qu’est-ce qu’une modulation ?', ['Le passage d’une tonalité à une autre', 'Un changement de nuance', 'Un changement d’instrument', 'Une variation de tempo'], 0, 'Elle relance l’intérêt en changeant de couleur.'],
            ['Le rubato est un tempo strictement régulier.', ['Vrai', 'Faux'], 1, 'C’est au contraire une liberté qui étire et rattrape le temps.'],
            ['Qu’est-ce qu’une « blue note » ?', ['Une note très aiguë', 'Une note jouée à la trompette bouchée', 'La première note d’un blues', 'Une note abaissée, entre majeur et mineur'], 3, 'Un héritage du blues.'],
            ['Que désigne un « chorus » en jazz ?', ['Un chœur d’accompagnement', 'Un tour de grille improvisé par un soliste', 'Le refrain chanté par le public', 'La coda'], 1, 'Les solistes se succèdent chorus après chorus.'],
            ['Dans une bonne description, il faut aussi situer les événements dans le temps.', ['Vrai', 'Faux'], 0, 'Minuter permet de rendre l’analyse vérifiable.'],
          ],
        },

        // ─────────────────────── LA MUSIQUE, L’HOMME ET LA SOCIÉTÉ ───────────────────────
        {
          titre: 'Droit, économie et métiers de la musique',
          axe: 'La musique, l’homme et la société',
          lecon: {
            titre: 'Qui gagne quoi quand une musique est jouée ?',
            cours: `En terminale, le programme ajoute une compétence : **situer sa pratique et ses goûts dans le contexte économique, social et professionnel** de la musique. Le troisième exercice de l’écrit porte souvent sur ces questions.

## Le droit d’auteur
Une œuvre musicale appartient à ses **auteurs** : le **compositeur** (la musique) et le **parolier** (le texte).
| Droit | Ce qu’il protège |
| **Droit moral** | Le nom de l’auteur et le respect de l’œuvre ; il ne s’achète pas et ne s’éteint pas |
| **Droits patrimoniaux** | La rémunération à chaque reproduction ou diffusion publique |
| **Durée** | En France, toute la vie de l’auteur, puis **70 ans** après sa mort |

Après ce délai, l’œuvre entre dans le **domaine public** : chacun peut la jouer et l’enregistrer librement (mais pas l’enregistrement d’un autre).

## L’histoire de la SACEM
@ 1847 — Au café-concert Les Ambassadeurs, à Paris, le compositeur Ernest Bourget refuse de payer son verre : on joue sa musique sans le payer, lui
@ 1851 — Création de la **SACEM** (Société des auteurs, compositeurs et éditeurs de musique)
@ 1985 — La loi crée les **droits voisins**, pour les **interprètes** et les **producteurs**

La SACEM **collecte** les droits auprès des radios, salles, commerces, plateformes, et les **répartit** entre auteurs, compositeurs et éditeurs.

## Qui touche quoi ?
| Acteur | Son rôle | Sa rémunération |
| Auteur, compositeur | Crée l’œuvre | Droits d’auteur |
| Éditeur | Promeut et exploite l’œuvre | Une part des droits d’auteur |
| Interprète | Joue ou chante | Cachets, droits voisins |
| Producteur (label) | Finance l’enregistrement | Vente et diffusion des enregistrements, droits voisins |

## L’économie d’aujourd’hui
1. Le **streaming** est devenu la première source de revenus de la musique enregistrée.
2. Les plateformes versent l’argent des abonnements **au prorata des écoutes** : les artistes les plus écoutés reçoivent la plus grande part, même d’un abonné qui ne les écoute jamais. Un modèle « **centré sur l’utilisateur** » est parfois proposé pour corriger cela.
3. Pour beaucoup d’artistes, le **spectacle vivant** (concerts, festivals) rapporte plus que les enregistrements.
4. En France, les artistes et techniciens du spectacle peuvent relever du régime des **intermittents du spectacle** (assurance chômage adaptée à des contrats courts).

> Écouter une musique gratuitement ne veut pas dire qu’elle ne coûte rien : quelqu’un paie toujours, par un abonnement, une publicité ou une subvention. Se demander **qui** paie, c’est comprendre comment vit la musique.

## Les métiers de la musique
| Famille | Exemples |
| Créer | Compositeur, arrangeur, parolier, beatmaker |
| Interpréter | Musicien d’orchestre, chanteur, choriste, DJ |
| Techniques | Ingénieur du son, régisseur, éclairagiste, luthier |
| Diffuser | Producteur, éditeur, programmateur de salle, tourneur, attaché de presse |
| Transmettre | Professeur, médiateur culturel, musicothérapeute |

Ils s’apprennent au **conservatoire**, à l’**université** (musicologie), dans des écoles d’ingénieurs du son ou de management culturel.

!> Le droit d’auteur protège une **œuvre**, pas une idée ni un style : on peut composer « à la manière de », pas recopier une mélodie.`,
          },
          questions: [
            ['Que signifie le sigle SACEM ?', ['Syndicat des artistes et chanteurs de musique', 'Société des auteurs, compositeurs et éditeurs de musique', 'Service d’aide à la création musicale', 'Société des amis du chant et de la musique'], 1, 'Créée en 1851, la SACEM collecte les droits d’auteur et les reverse aux auteurs, aux compositeurs et aux éditeurs.'],
            ['Combien de temps après la mort de l’auteur une œuvre reste-t-elle protégée en France ?', ['20 ans', '50 ans', '100 ans', '70 ans'], 3, 'Elle entre ensuite dans le domaine public.'],
            ['Le droit moral de l’auteur peut être vendu à un producteur.', ['Vrai', 'Faux'], 1, 'Il est inaliénable : il ne s’achète pas et ne s’éteint pas.'],
            ['À qui profitent les droits voisins créés en 1985 ?', ['Aux interprètes et aux producteurs', 'Aux auteurs seulement', 'Aux salles de concert', 'Aux radios'], 0, 'Ils sont « voisins » du droit d’auteur.'],
            ['Quelle anecdote de 1847 est à l’origine de la SACEM ?', ['Un procès contre un éditeur', 'Un concert annulé', 'Un compositeur qui refuse de payer son verre dans un café qui joue sa musique', 'Un disque piraté'], 2, 'Ernest Bourget, au café-concert Les Ambassadeurs.'],
            ['Quelle est aujourd’hui la première source de revenus de la musique enregistrée ?', ['Le CD', 'Le vinyle', 'La radio', 'Le streaming'], 3, 'Les abonnements et la publicité des plateformes.'],
            ['Comment les plateformes répartissent-elles le plus souvent l’argent des abonnements ?', ['À parts égales entre tous les artistes', 'Au prorata des écoutes totales', 'Selon l’âge des artistes', 'Selon le vote des abonnés'], 1, 'Les plus écoutés reçoivent la plus grande part.'],
            ['Qu’est-ce que le domaine public ?', ['L’ensemble des œuvres qu’on peut jouer et enregistrer librement', 'Les œuvres jouées dans la rue', 'Les chansons diffusées à la radio publique', 'Les œuvres achetées par l’État'], 0, 'Une fois les droits patrimoniaux éteints.'],
            ['Le droit d’auteur protège un style musical.', ['Vrai', 'Faux'], 1, 'Il protège une œuvre, pas une idée ni un style.'],
            ['Quel professionnel fabrique et répare les instruments à cordes ?', ['Le régisseur', 'Le tourneur', 'Le luthier', 'Le programmateur'], 2, 'Un métier d’artisan d’art.'],
            ['Quel acteur finance l’enregistrement d’un disque ?', ['L’éditeur', 'Le producteur', 'La SACEM', 'Le parolier'], 1, 'Il touche les revenus des enregistrements.'],
            ['Que désigne en France le régime des intermittents du spectacle ?', ['Un statut d’étudiant en musique', 'Une aide à l’achat d’instruments', 'Un impôt sur les concerts', 'Une assurance chômage adaptée aux contrats courts des artistes et techniciens'], 3, 'Il tient compte de la discontinuité de leur travail.'],
          ],
        },
        {
          titre: 'Musique vivante, musique enregistrée',
          axe: 'La musique, l’homme et la société',
          lecon: {
            titre: 'Du phonographe au streaming : ce que l’enregistrement a changé',
            cours: `Pendant des millénaires, entendre une musique voulait dire être **là**, au moment où quelqu’un la jouait. L’enregistrement a tout changé. La thématique « **Musique vivante vs musique enregistrée** » et celle des « **Supports de la musique** » interrogent ce basculement.

## Une histoire des supports
@ 1877 — Thomas Edison invente le **phonographe** (cylindre)
@ 1887 — Emile Berliner invente le **gramophone** et le disque plat
@ 1948 — Le **microsillon 33 tours** : un disque long (LP), l’« album »
@ 1963 — La **cassette audio** : on enregistre et on emporte sa musique
@ 1982 — Le **disque compact** (CD) : le son numérique
@ années 1990 — Le fichier **MP3** : la musique se dématérialise
@ années 2000-2010 — Le **streaming** : on n’achète plus un disque, on accède à un catalogue

## Ce que l’enregistrement change
| Avant | Après |
| La musique est un **événement** unique | La musique devient un **objet** reproductible |
| Il faut aller au concert | On écoute seul, partout, en boucle |
| L’interprétation disparaît avec le concert | On peut **comparer** les interprétations sur un siècle |
| Le compositeur écrit pour la salle | Le **studio** devient un instrument (montage, superpositions) |

> Le philosophe **Walter Benjamin** (1935) parle de la perte de l’« **aura** » : l’œuvre reproduite en série perd le caractère unique de sa présence, ici et maintenant. Mais la reproduction la rend aussi accessible à tous.

## Deux choix radicaux
| Artiste | Le choix | Pourquoi |
| **Glenn Gould**, pianiste | Arrête les concerts en **1964** pour ne plus jouer qu’en studio | Il veut une interprétation parfaite, construite, sans le trac ni les toux de la salle |
| **Les Beatles** | Arrêtent de tourner en **1966** ; *Sgt. Pepper’s* (1967) est un disque de studio | Leurs chansons deviennent impossibles à jouer sur scène telles quelles |

## Pourquoi le concert résiste
1. **La présence** : le corps des musiciens, le son dans la salle, l’imprévu.
2. **Le partage** : un public qui vibre ensemble ; le concert est un rite social.
3. **L’économie** : pour beaucoup d’artistes, la scène rapporte davantage que les enregistrements.
4. **L’authenticité** : on vient vérifier que « c’est vraiment eux ».

## Le studio, un instrument
Le **multipiste** permet d’enregistrer chaque instrument séparément, de superposer les prises, de corriger. Des genres entiers naissent du studio : la **musique concrète** de **Pierre Schaeffer** (1948), qui compose avec des sons enregistrés, puis la musique électronique, le hip-hop et le **sample** (échantillon d’un disque existant réutilisé).

## Pistes pour une problématique
- Un enregistrement de concert (« live ») est-il encore de la musique vivante ?
- La musique enregistrée a-t-elle changé la **manière de composer** ?
- Le streaming a-t-il changé la **durée** des chansons, la place de l’album ?

!> Ne confonds pas **support** (le disque, le fichier) et **œuvre** : une même œuvre peut exister sur mille supports et dans mille interprétations.`,
          },
          questions: [
            ['Qui invente le phonographe en 1877 ?', ['Emile Berliner', 'Thomas Edison', 'Pierre Schaeffer', 'Alexander Graham Bell'], 1, 'Le son est gravé sur un cylindre.'],
            ['Quel support apparaît en 1948 et donne naissance à l’album ?', ['Le microsillon 33 tours', 'Le 78 tours', 'La cassette', 'Le CD'], 0, 'Un disque long (LP) de plusieurs chansons.'],
            ['En quelle année apparaît le disque compact (CD) ?', ['1963', '1948', '1995', '1982'], 3, 'Le son devient numérique.'],
            ['Quel pianiste abandonne les concerts en 1964 pour le studio ?', ['Vladimir Horowitz', 'Arthur Rubinstein', 'Glenn Gould', 'Martha Argerich'], 2, 'Il veut une interprétation construite, sans les aléas de la salle.'],
            ['Les Beatles ont arrêté de tourner en 1966.', ['Vrai', 'Faux'], 0, '*Sgt. Pepper’s* (1967) est une œuvre de studio.'],
            ['Quel philosophe parle de la perte de l’« aura » de l’œuvre reproduite ?', ['Theodor Adorno', 'Walter Benjamin', 'Jean-Paul Sartre', 'Friedrich Nietzsche'], 1, 'Dans un essai de 1935.'],
            ['Qui fonde la musique concrète en 1948 ?', ['Pierre Boulez', 'Karlheinz Stockhausen', 'John Cage', 'Pierre Schaeffer'], 3, 'Il compose avec des sons enregistrés.'],
            ['Qu’est-ce qu’un sample ?', ['Un échantillon d’un enregistrement existant réutilisé dans une nouvelle œuvre', 'Un instrument électronique', 'Une partition simplifiée', 'Un concert gratuit'], 0, 'Procédé central du hip-hop.'],
            ['Que permet l’enregistrement multipiste ?', ['D’enregistrer plus vite', 'D’enregistrer chaque instrument séparément et de superposer les prises', 'De supprimer le studio', 'De jouer en direct à la radio'], 1, 'Le studio devient un instrument.'],
            ['Un support et une œuvre, c’est la même chose.', ['Vrai', 'Faux'], 1, 'Une même œuvre peut exister sur de multiples supports.'],
            ['Quel avantage le concert garde-t-il sur l’enregistrement ?', ['Un son toujours parfait', 'Un prix plus bas', 'La présence et le partage d’un moment unique', 'La possibilité de réécouter'], 2, 'C’est un rite social.'],
            ['Qui invente le gramophone et le disque plat en 1887 ?', ['Emile Berliner', 'Thomas Edison', 'Louis Lumière', 'Nikola Tesla'], 0, 'Le disque plat remplace peu à peu le cylindre.'],
          ],
        },

        // ─────────────── CULTURE MUSICALE ET ARTISTIQUE DANS L’HISTOIRE ET LA GÉOGRAPHIE ───────────────
        {
          titre: 'Repères d’histoire de la musique occidentale',
          axe: 'Culture musicale et artistique dans l’histoire et la géographie',
          lecon: {
            titre: 'Du chant grégorien au hip-hop : situer une œuvre inconnue',
            cours: `L’un des attendus de terminale : **situer une œuvre inconnue dans le temps et l’espace**, par rapport aux grands courants depuis le Moyen Âge. Il faut donc des repères solides — et savoir **les entendre**.

## Les grandes périodes
| Période | Dates | Ce qu’on entend | Compositeurs |
| **Moyen Âge** | jusqu’à 1450 | Monodie (chant grégorien), puis premières polyphonies ; Ars nova | Hildegarde de Bingen, Pérotin, Machaut |
| **Renaissance** | 1450-1600 | Polyphonie vocale fluide, imitation entre les voix | Josquin des Prés, Palestrina, Janequin |
| **Baroque** | 1600-1750 | Basse continue, contrastes, ornements, naissance de l’opéra | Monteverdi, Lully, Vivaldi, J.-S. Bach, Haendel |
| **Classique** | 1750-1820 | Mélodie accompagnée claire, phrases symétriques, forme sonate | Haydn, Mozart, Beethoven (début) |
| **Romantique** | XIXe siècle | Expression du moi, grands orchestres, harmonies chromatiques | Schubert, Chopin, Berlioz, Wagner, Verdi |
| **XXe et XXIe siècles** | depuis 1900 | Éclatement des langages : atonalité, rythmes nouveaux, électronique | Debussy, Stravinsky, Schoenberg, Messiaen, Reich |

## Quelques dates-clés
@ 1607 — *L’Orfeo* de Monteverdi, l’un des premiers opéras
@ 1722 — *Le Clavier bien tempéré* de J.-S. Bach
@ 1824 — La Neuvième Symphonie de Beethoven, avec chœur final
@ 1913 — *Le Sacre du printemps* de Stravinsky fait scandale à Paris
@ vers 1923 — Schoenberg fixe le **dodécaphonisme** (série de douze sons)
@ 1948 — La **musique concrète** de Pierre Schaeffer
@ années 1960 — Le **minimalisme** américain (Steve Reich, Philip Glass)

## Le jazz et les musiques actuelles
| Courant | Époque | Repère |
| **Blues**, **ragtime** | fin XIXe - début XXe | Le Sud des États-Unis |
| Jazz **Nouvelle-Orléans** | années 1910-1920 | Louis Armstrong |
| **Swing**, big bands | années 1930 | Duke Ellington, Count Basie ; Ella Fitzgerald débute |
| **Bebop** | années 1940 | Charlie Parker, Dizzy Gillespie |
| **Rock’n’roll** | années 1950 | Elvis Presley, Chuck Berry |
| **Hip-hop** | années 1970 | Le Bronx, à New York |

## Méthode : situer une œuvre à l’écoute
1. **L’effectif** : voix seules ? basse continue (clavecin) ? grand orchestre ? synthétiseurs ?
2. **Le langage** : modal, tonal, chromatique, atonal ?
3. **Le rythme** : souple (grégorien), moteur (baroque), régulier et carré (classique), libre ou complexe (XXe) ?
4. **L’expression** : un seul affect par mouvement (baroque) ou des contrastes et des élans personnels (romantique) ?
5. **Conclure prudemment** : « probablement baroque, par la présence d’une basse continue et d’un rythme moteur ».

> Une datation n’est jamais une devinette : c’est une **hypothèse argumentée** à partir d’indices entendus.

!> Les dates de période sont des repères, pas des frontières : C. P. E. Bach écrit en 1753, entre baroque et classique, avec des traits des deux.`,
          },
          questions: [
            ['Quelle période s’étend environ de 1600 à 1750 ?', ['La Renaissance', 'Le classicisme', 'Le baroque', 'Le romantisme'], 2, 'Elle commence avec la naissance de l’opéra.'],
            ['Quel élément permet souvent de reconnaître la musique baroque ?', ['La basse continue', 'Le synthétiseur', 'La série de douze sons', 'Le grand orchestre romantique'], 0, 'Un clavecin et des basses soutiennent l’harmonie.'],
            ['Quel opéra de Monteverdi (1607) est l’un des premiers de l’histoire ?', ['*Don Giovanni*', '*L’Orfeo*', '*Carmen*', '*Didon et Énée*'], 1, 'Créé à Mantoue.'],
            ['Quelle œuvre fait scandale à Paris en 1913 ?', ['*Le Sacre du printemps*', '*Le Boléro*', '*La Mer*', '*Pierrot lunaire*'], 0, 'Le ballet de Stravinsky bouleverse le rythme.'],
            ['Qui fixe le dodécaphonisme vers 1923 ?', ['Claude Debussy', 'Igor Stravinsky', 'Olivier Messiaen', 'Arnold Schoenberg'], 3, 'Une série qui utilise les douze sons de la gamme chromatique.'],
            ['Haydn et Mozart appartiennent à la période classique.', ['Vrai', 'Faux'], 0, 'Entre 1750 et 1820 environ.'],
            ['Quel courant du jazz naît dans les années 1940 avec Charlie Parker ?', ['Le swing', 'Le bebop', 'Le ragtime', 'Le free jazz'], 1, 'Tempos rapides, harmonies complexes.'],
            ['Où naît le hip-hop dans les années 1970 ?', ['À Chicago', 'À Detroit', 'Dans le Bronx, à New York', 'À Londres'], 2, 'DJ, MC, danse et graffiti.'],
            ['Quels compositeurs sont associés au minimalisme américain ?', ['Steve Reich et Philip Glass', 'Chopin et Liszt', 'Lully et Rameau', 'Berlioz et Wagner'], 0, 'Des motifs répétés qui évoluent lentement.'],
            ['Le chant grégorien est une polyphonie.', ['Vrai', 'Faux'], 1, 'C’est une monodie : une seule ligne mélodique.'],
            ['Quelle symphonie de Beethoven se termine par un chœur ?', ['La Cinquième', 'La Pastorale', 'L’Héroïque', 'La Neuvième'], 3, 'Créée en 1824, sur l’« Ode à la joie ».'],
            ['Comment présenter la datation d’une œuvre inconnue ?', ['Comme une certitude', 'Comme une hypothèse argumentée à partir d’indices entendus', 'Sans justification', 'En citant le compositeur au hasard'], 1, 'Effectif, langage, rythme et expression sont les indices.'],
          ],
        },
        {
          titre: 'Authenticité et recréation : rejouer la musique d’hier',
          axe: 'Culture musicale et artistique dans l’histoire et la géographie',
          lecon: {
            titre: 'Instruments d’époque, reprises et arrangements',
            cours: `Faut-il jouer une œuvre **comme à son époque**, ou la **réinventer** ? La thématique « **Authenticité vs recréation** » traverse tout le programme limitatif : C. P. E. Bach sur instruments anciens ou modernes, Gershwin à l’opéra ou en jazz.

## Le mouvement « baroqueux »
À partir des années 1950, des musiciens veulent retrouver le son des musiques anciennes : c’est l’**interprétation historiquement informée**.
| Musicien | Repère |
| **Nikolaus Harnoncourt** | Fonde le Concentus Musicus de Vienne en 1953 |
| **Gustav Leonhardt** | Claveciniste et chef néerlandais, pionnier du répertoire de Bach |
| **William Christie** | Fonde Les Arts Florissants en 1979 et fait renaître l’opéra baroque français |

| Choix | Sur instruments d’époque | Sur instruments modernes |
| Les cordes | En **boyau**, son plus doux et plus grainé | En métal ou synthétique, son plus puissant |
| Le diapason | Souvent plus bas (la à **415 Hz** pour le baroque) | La à 440 Hz |
| Le vibrato | Utilisé comme un ornement | Continu |
| L’effectif | Petit, proche des sources | Parfois plus fourni |

> L’« authenticité » est une **quête**, jamais un résultat garanti : on ne sait pas exactement comment on jouait en 1753, et l’oreille d’un auditeur d’aujourd’hui n’est plus celle d’alors. L’interprétation historiquement informée est donc elle aussi un **choix artistique**.

## Recréer : reprise, arrangement, adaptation
| Pratique | Définition | Exemple |
| **Reprise** (cover) | Un autre interprète s’approprie une chanson | *Summertime*, repris des milliers de fois |
| **Arrangement** | On réécrit l’accompagnement, l’effectif, l’harmonie | Russell Garcia arrange Gershwin pour Armstrong et Fitzgerald |
| **Transcription** | On adapte une œuvre à d’autres instruments | Le concerto Wq 172 en version flûte ou clavecin |
| **Sample** | On réutilise un fragment d’enregistrement | Le hip-hop, la musique électronique |
| **Pastiche** | On compose « à la manière de » | Un exercice de création au lycée |

## Qu’est-ce qui reste « l’œuvre » ?
1. **La mélodie et l’harmonie** : ce qu’on reconnaît immédiatement.
2. **La forme** : l’ordre des parties.
3. **Le texte**, pour une chanson.
4. **Le timbre et le style**, qui changent le plus d’une version à l’autre.

## Le cas Porgy and Bess
L’opéra de Gershwin pose une double question d’authenticité : un compositeur **blanc** qui écrit un « folk opera » sur une communauté **noire**, puis des interprètes de jazz qui s’approprient l’œuvre. Les héritiers des Gershwin ont exigé que l’opéra soit chanté par des interprètes noirs. Le disque de 1958 rend en quelque sorte la musique au jazz dont elle s’inspirait.

## Méthode : commenter deux versions d’une même œuvre
1. **Identifier ce qui reste** (mélodie, forme, texte).
2. **Relever ce qui change** (tempo, effectif, timbre, langage, durée).
3. **Interpréter** : quel projet artistique guide chaque version ?
4. **Évaluer** sans hiérarchiser : chaque version éclaire l’œuvre autrement.`,
          },
          questions: [
            ['Que désigne l’« interprétation historiquement informée » ?', ['Jouer une œuvre en tenant compte des instruments et des pratiques de son époque', 'Jouer une œuvre avec des instruments électroniques', 'Raconter l’histoire de l’œuvre avant de la jouer', 'Jouer uniquement des œuvres du XXe siècle'], 0, 'Le mouvement dit « baroqueux ».'],
            ['Qui fonde Les Arts Florissants en 1979 ?', ['Nikolaus Harnoncourt', 'William Christie', 'Gustav Leonhardt', 'Pierre Boulez'], 1, 'Il fait renaître l’opéra baroque français.'],
            ['Quel diapason est souvent utilisé pour la musique baroque sur instruments d’époque ?', ['La à 440 Hz', 'La à 466 Hz', 'La à 415 Hz', 'La à 500 Hz'], 2, 'Un son plus bas que le diapason moderne.'],
            ['Sur les instruments d’époque, les cordes sont en…', ['Métal', 'Nylon', 'Soie', 'Boyau'], 3, 'Un son plus doux et plus grainé.'],
            ['L’interprétation historiquement informée garantit de jouer exactement comme en 1753.', ['Vrai', 'Faux'], 1, 'C’est une quête et un choix artistique : on ne connaît pas tout des pratiques anciennes.'],
            ['Qu’est-ce qu’un arrangement ?', ['La réécriture de l’accompagnement, de l’effectif ou de l’harmonie d’une œuvre', 'Un contrat entre éditeur et auteur', 'Le classement des pistes d’un album', 'Une œuvre entièrement nouvelle'], 0, 'Russell Garcia arrange Gershwin pour le disque de 1958.'],
            ['Qu’est-ce qu’un pastiche ?', ['Une copie illégale', 'Une œuvre composée « à la manière de »', 'Un enregistrement public', 'Une œuvre inachevée'], 1, 'Un exercice fréquent de création au lycée.'],
            ['Adapter une œuvre à d’autres instruments, c’est faire une…', ['Modulation', 'Improvisation', 'Transcription', 'Cadence'], 2, 'Le Wq 172 existe pour violoncelle, flûte et clavecin.'],
            ['Qui fonde le Concentus Musicus de Vienne en 1953 ?', ['Nikolaus Harnoncourt', 'Herbert von Karajan', 'William Christie', 'Jordi Savall'], 0, 'Un pionnier des instruments d’époque.'],
            ['Quel paramètre change généralement le plus d’une version à une autre ?', ['Le texte', 'La forme', 'La mélodie', 'Le timbre et le style'], 3, 'La mélodie et la forme permettent de reconnaître l’œuvre.'],
            ['Les héritiers des Gershwin ont exigé que *Porgy and Bess* soit chanté par des interprètes noirs.', ['Vrai', 'Faux'], 0, 'Une exigence liée à l’identité même de l’œuvre.'],
            ['Face à deux versions d’une œuvre, quelle attitude est attendue ?', ['Désigner la meilleure', 'Comparer et interpréter chaque projet artistique, sans hiérarchiser', 'Préférer toujours la plus ancienne', 'Préférer toujours la plus célèbre'], 1, 'Chaque version éclaire l’œuvre autrement.'],
          ],
        },
        {
          titre: 'Mondialisation et musiques des territoires ultramarins',
          axe: 'Culture musicale et artistique dans l’histoire et la géographie',
          lecon: {
            titre: 'Maloya, himene, musiques antillaises : mémoire et métissage',
            cours: `La thématique « **Mondialisation culturelle : diversité, relativité et nouvelles esthétiques** » invite à écouter les musiques du monde sans les réduire au folklore. Les élèves de l’**option musique** étudient en 2026-2027 un corpus consacré aux **pratiques vocales des territoires ultramarins** : c’est un excellent terrain.

## Le corpus de l’option (programme complémentaire 2026-2027)
| Territoire | Œuvre traditionnelle ou ancienne | Œuvre récente |
| **Antilles** | Eugène Mona, *Ti Milo* (1978) | Admiral T, *Ti Milo* (2011) |
| **Polynésie** | *Himéné tarava* (1989) | *Haka Enana* (2010) |
| **La Réunion** | Danyel Waro, *Laviyon* (1994) | Wati Watia Zorey Band, *Rest’ là Maloya* (2016) |

Chaque paire rapproche une forme ancrée dans une tradition et une recréation contemporaine : c’est la question **ancrage historique / présence contemporaine**.

## Trois traditions vocales
| Musique | Origine | Ce qu’on entend |
| Le **maloya** (La Réunion) | Chants des esclaves et engagés, venus d’Afrique et de Madagascar | Chant **responsorial** (un soliste, un chœur qui répond), percussions (le roulèr), le hochet **kayamb** |
| Les **himene** (Polynésie) | Rencontre des chants polynésiens et des cantiques protestants des missionnaires | Polyphonie chorale puissante, voix qui tiennent un **bourdon** et voix aiguës ornées |
| Les musiques **antillaises** (bèlè, gwoka) | Héritage africain des esclaves, en créole | Tambours, chant responsorial, danse |

> Le maloya a longtemps été **interdit ou méprisé** ; il a été inscrit au patrimoine culturel immatériel de l’**UNESCO** en **2009**. Le **gwoka** de Guadeloupe l’a été en **2014**. Chanter en créole, c’est affirmer une **mémoire** et une **identité**.

## Mondialisation : trois mouvements
1. **L’uniformisation** : la même pop mondiale partout, portée par les plateformes.
2. **Le métissage** : des musiques qui se rencontrent et créent des esthétiques nouvelles (maloya électrique, dancehall créole).
3. **La revendication** : des musiques locales qui s’affirment face au reste du monde et circulent grâce à lui.

## La relativité des oreilles
Ce qui nous paraît « faux » ou « étrange » vient souvent de nos habitudes : d’autres cultures utilisent d’autres **échelles**, d’autres **rythmes**, d’autres **timbres** vocaux. L’ethnomusicologie apprend à décrire ces musiques **selon leurs propres règles**.

## Méthode : comparer une version traditionnelle et une recréation
1. **L’effectif** : voix et percussions acoustiques, ou instruments électriques, machines ?
2. **La langue** et le texte : ce qui est transmis, ce qui est actualisé.
3. **La forme** : le chant responsorial est-il gardé ?
4. **La fonction** : rituel, deuil, fête, contestation, scène, disque ?

## Vocabulaire
| Mot | Sens |
| Responsorial | Un soliste chante, un chœur lui répond |
| Kayamb | Hochet en radeau de tiges, rempli de graines (La Réunion) |
| Créole | Langue née de la rencontre des langues dans les colonies |
| Ethnomusicologie | L’étude des musiques dans leur culture |`,
          },
          questions: [
            ['De quel territoire le maloya est-il originaire ?', ['La Martinique', 'La Réunion', 'Tahiti', 'La Guyane'], 1, 'Chants des esclaves et engagés venus d’Afrique et de Madagascar.'],
            ['En quelle année le maloya est-il inscrit au patrimoine immatériel de l’UNESCO ?', ['2014', '1994', '2009', '2020'], 2, 'Le gwoka de Guadeloupe l’a été en 2014.'],
            ['Qu’est-ce qu’un chant responsorial ?', ['Un soliste chante, un chœur lui répond', 'Tous chantent à l’unisson', 'Une voix seule sans accompagnement', 'Deux chœurs en canon'], 0, 'C’est la forme du maloya, du bèlè ou du gwoka.'],
            ['Qu’est-ce que le kayamb ?', ['Un tambour sur cadre', 'Une flûte en bambou', 'Une guitare à quatre cordes', 'Un hochet en radeau de tiges rempli de graines'], 3, 'Instrument emblématique du maloya.'],
            ['Les himene de Polynésie sont nés de la rencontre des chants polynésiens et des cantiques protestants.', ['Vrai', 'Faux'], 0, 'Apportés par les missionnaires au XIXe siècle.'],
            ['Quel artiste réunionnais interprète *Laviyon* (1994) ?', ['Admiral T', 'Eugène Mona', 'Danyel Waro', 'Kassav’'], 2, 'Une grande voix du maloya.'],
            ['Quelle œuvre antillaise de 1978 figure au corpus de l’option ?', ['*Ti Milo* d’Eugène Mona', '*Zouk la sé sèl médikaman nou ni*', '*Haka Enana*', '*Rest’ là Maloya*'], 0, 'Reprise par Admiral T en 2011.'],
            ['Que désigne le « métissage » musical ?', ['La disparition des musiques locales', 'L’interdiction d’un genre', 'La rencontre de musiques qui crée des esthétiques nouvelles', 'Une musique jouée à l’unisson'], 2, 'Par exemple le maloya électrique.'],
            ['Qu’étudie l’ethnomusicologie ?', ['L’acoustique des salles', 'Les musiques dans leur culture et selon leurs propres règles', 'Le droit des musiciens', 'La lutherie'], 1, 'Elle évite de juger une musique avec des critères qui ne sont pas les siens.'],
            ['Le maloya a toujours été encouragé par les autorités.', ['Vrai', 'Faux'], 1, 'Il a longtemps été interdit ou méprisé.'],
            ['Quelle question relie les paires d’œuvres du corpus de l’option ?', ['Le prix des disques', 'La virtuosité instrumentale', 'Ancrage historique et présence contemporaine', 'La musique de film'], 2, 'Une forme traditionnelle face à sa recréation.'],
            ['Dans les himene, certaines voix tiennent une note grave prolongée appelée…', ['Un ostinato', 'Un riff', 'Une syncope', 'Un bourdon'], 3, 'Les voix aiguës s’y ornent au-dessus.'],
          ],
        },

        // ─────────────────────────── L’ÉPREUVE DE SPÉCIALITÉ ───────────────────────────
        {
          titre: 'L’écrit du bac de musique : trois exercices',
          axe: 'L’épreuve de spécialité',
          lecon: {
            titre: 'Décrire, comparer, commenter : la partie écrite (3 h 30)',
            cours: `L’épreuve de spécialité musique compte une **partie écrite** et une **partie orale**, chacune pour **la moitié de la note** sur 20. L’écrit dure **3 h 30** et comprend **trois exercices indépendants** ; les deux premiers reposent sur l’**écoute répétée** d’extraits enregistrés, selon un plan de diffusion donné par le sujet.

## Les trois exercices
| Exercice | Ce qu’on te demande | Durée |
| **1. Description** | Décrire un **bref extrait** d’une œuvre **hors programme**, identifiée par le sujet | 30 à 45 minutes |
| **2. Commentaire comparé** | Comparer **deux extraits** identifiés, dont **un du programme limitatif** ; l’extrait hors programme est accompagné de sa **partition** ou d’une représentation graphique | 1 h 45 à 2 h 15 |
| **3. Commentaire de documents** | Rédiger un bref commentaire d’un ou plusieurs **documents sur la vie musicale contemporaine** (article, interview, étude), en réponse à une question | 45 minutes à 1 heure |

## Exercice 1 : décrire, pas commenter
On attend une **description objective** du langage musical : effectif, forme, texture, rythme, mélodie, nuances. Tu peux t’appuyer sur un **schéma** (un musicogramme) et ajouter de **brefs relevés sur portée**.

!> L’erreur classique : donner ses impressions (« c’est joyeux ») sans les appuyer sur des faits musicaux. Une impression n’a de valeur que si tu dis **ce qui la produit**.

## Exercice 2 : le commentaire comparé
C’est le cœur de l’épreuve. Les œuvres étant **identifiées**, il ne s’agit pas de deviner d’où elles viennent, mais d’**analyser** et de **comparer**.
1. **Écouter** plusieurs fois et prendre des notes par paramètre.
2. **Utiliser la partition** pour **confirmer** ce que tu as entendu, pas pour remplacer l’écoute.
3. **Suivre les entrées d’analyse** proposées par le sujet, et en ajouter si elles sont pertinentes.
4. **Construire** : introduction (présentation des deux extraits et de l’enjeu), parties **thématiques** (et non « extrait A puis extrait B »), conclusion.
5. **Enrichir** de références : autres œuvres, contexte, thématiques du programme.

> Un commentaire comparé réussi fait apparaître **ressemblances et différences** à l’intérieur de chaque partie : « Dans les deux extraits, le tempo est vif ; mais là où Bach fait dialoguer tutti et soliste, Garcia fait répondre la trompette à la voix. »

## Exercice 3 : la vie musicale d’aujourd’hui
Les documents portent sur la sociologie ou l’économie de la musique : streaming, concerts, droits, pratiques des jeunes, métiers. Tu dois **répondre à la question posée**, et **relier** ton commentaire à **au moins un champ de questionnement** du programme.

## Gérer ses 3 h 30
~ Exercice 1 (environ 40 min) → exercice 2 (environ 2 h) → exercice 3 (environ 50 min)

Les durées sont fixées par le sujet dans les fourchettes : respecte-les, car les diffusions sont programmées.

## Les points qui font la différence
1. Un **vocabulaire précis** (voir la fiche d’analyse auditive).
2. Des **repères temporels** (« à la deuxième diffusion », « à 1’20 »).
3. Une **connaissance fine** des œuvres du programme limitatif.
4. Une **écriture claire** : phrases complètes, paragraphes, connecteurs.`,
          },
          questions: [
            ['Combien de temps dure la partie écrite de l’épreuve de spécialité musique ?', ['2 heures', '3 h 30', '4 heures', '1 h 30'], 1, 'Elle comprend trois exercices indépendants.'],
            ['Combien d’exercices compte l’écrit ?', ['Deux', 'Quatre', 'Trois', 'Un seul'], 2, 'Description, commentaire comparé, commentaire de documents.'],
            ['Sur quoi porte le premier exercice ?', ['La description d’un bref extrait hors programme, identifié par le sujet', 'Une dissertation', 'Un commentaire de partition sans écoute', 'Une question de cours'], 0, 'On attend une description objective du langage musical.'],
            ['Dans le commentaire comparé, l’un des deux extraits vient du programme limitatif.', ['Vrai', 'Faux'], 0, 'L’autre est hors programme et accompagné de sa partition.'],
            ['Quel exercice est le plus long ?', ['La description', 'Le commentaire de documents', 'Ils ont tous la même durée', 'Le commentaire comparé'], 3, 'Entre 1 h 45 et 2 h 15.'],
            ['À quoi doit servir la partition dans le commentaire comparé ?', ['À remplacer l’écoute', 'À confirmer et approfondir ce qu’on a entendu', 'À recopier des mesures entières', 'À deviner le compositeur'], 1, 'On n’attend pas un lecteur chevronné, mais un usage ciblé.'],
            ['Sur quoi portent les documents du troisième exercice ?', ['L’histoire du Moyen Âge', 'La biographie d’un compositeur', 'La vie musicale contemporaine', 'La théorie de l’harmonie'], 2, 'Articles, interviews, études de sociologie ou d’économie.'],
            ['Le troisième exercice doit être relié à au moins un champ de questionnement du programme.', ['Vrai', 'Faux'], 0, 'C’est une attente explicite de l’épreuve.'],
            ['Comment organiser un commentaire comparé ?', ['Un extrait puis l’autre', 'Par parties thématiques où les deux extraits sont comparés', 'Par ordre chronologique d’écoute seulement', 'En une seule liste de remarques'], 1, 'Ressemblances et différences à l’intérieur de chaque partie.'],
            ['Quelle part de la note globale représente l’écrit ?', ['Un quart', 'Les trois quarts', 'La totalité', 'La moitié'], 3, 'L’oral compte pour l’autre moitié.'],
            ['Dans l’exercice 1, on peut s’appuyer sur un musicogramme.', ['Vrai', 'Faux'], 0, 'Et ajouter de brefs relevés sur portée.'],
            ['Quelle est l’erreur classique de l’exercice de description ?', ['Utiliser un vocabulaire technique', 'Minuter les événements', 'Donner des impressions sans les appuyer sur des faits musicaux', 'Faire un schéma'], 2, 'Une impression ne vaut que si on dit ce qui la produit.'],
          ],
        },
        {
          titre: 'L’oral du bac de musique : interpréter sa création',
          axe: 'L’épreuve de spécialité',
          lecon: {
            titre: 'Une création collective, un exposé, un entretien (30 minutes)',
            cours: `La partie orale de l’épreuve de spécialité compte pour **la moitié de la note**. Elle dure **30 minutes, sans préparation**, et évalue ta **pratique musicale** au service d’un projet.

## Le déroulement
| Temps | Ce que tu fais |
| **Interprétation et exposé** : 15 minutes au plus | Tu interprètes une **création collective** élaborée pendant l’année de terminale, et tu exposes ta démarche (avant ou après l’interprétation) |
| **Entretien** : le temps restant | Le jury t’interroge sur ton projet, ton interprétation, tes références, ton année |

## L’interprétation
- Tu joues ou chantes une **création collective** réalisée en classe pendant l’année.
- Tu peux être accompagné par d’autres **élèves du lycée**, en priorité ceux de la spécialité ; un groupe modeste est conseillé (**5 élèves au plus**, toi compris), pour que ton rôle reste visible.
- **Aucun accompagnement enregistré** n’est admis.
- Tu remets au jury une **représentation graphique** de la pièce (partition, musicogramme…) : elle sert à l’entretien, elle **n’est pas évaluée**.

## L’exposé
Tu présentes :
1. La **démarche** : conception, élaboration, réalisation ; choix, renoncements, difficultés.
2. Les **références** et **influences** : les œuvres qui t’ont inspiré.
3. Les **techniques** mobilisées.
4. Les **liens** avec **au moins une œuvre du programme limitatif** et **au moins un champ de questionnement**.

> Exemple : une création sur une grille de blues, avec une voix qui improvise en scat et une ritournelle instrumentale qui revient. Lien avec *Porgy and Bess* (voix et trompette en dialogue) et avec l’*Allegro assai* de C. P. E. Bach (alternance tutti-solo) ; champ « Le son, la musique, l’espace et le temps » (la forme).

## L’entretien
Même si l’interprétation est **collective**, l’exposé et l’entretien sont **individuels**. Le jury s’appuie sur la création, la représentation graphique et le **document de synthèse**. Tu peux illustrer tes réponses en **chantant** ou en **jouant** un passage.

## Le document de synthèse
Un document **papier** de **deux pages au plus**, visé par ton professeur et ton chef d’établissement, **transmis au jury quinze jours avant** l’épreuve. Il présente :
- les œuvres **étudiées, écoutées, jouées et créées** dans l’année ;
- les **thématiques** et **problématiques** travaillées ;
- les autres activités liées à la spécialité (chorale, orchestre, concerts, projets).

## Et le grand oral ?
C’est une épreuve **distincte** (20 minutes). En terminale, le programme prévoit une **quatrième thématique**, choisie par chaque élève **en lien avec son autre spécialité** et travaillée en projet : elle peut nourrir une question du grand oral.

## Méthode : préparer son oral
1. **Répète** la création jusqu’à la jouer sans effort, pour avoir l’esprit libre.
2. **Rédige** ta démarche en quelques idées fortes, sans texte à lire.
3. **Prépare** deux ou trois liens précis avec le programme limitatif.
4. **Entraîne-toi** à répondre aux questions : « pourquoi ce choix ? », « qu’aurais-tu fait autrement ? ».

!> L’oral ne juge pas la conformité de l’interprétation à la partition : la musique vivante peut s’en éloigner. Il juge ta **compréhension** de ce que tu as créé.`,
          },
          questions: [
            ['Combien de temps dure la partie orale de l’épreuve de spécialité musique ?', ['30 minutes', '20 minutes', '1 heure', '15 minutes'], 0, 'Sans temps de préparation.'],
            ['Que présente le candidat pendant l’oral ?', ['Un morceau imposé par le jury', 'Une création collective élaborée pendant l’année de terminale', 'Un exposé sans musique', 'Un enregistrement réalisé chez lui'], 1, 'Il l’interprète, puis expose sa démarche.'],
            ['Un accompagnement enregistré est-il autorisé ?', ['Oui, sans limite', 'Oui, pour les instruments absents', 'Oui, s’il est fait en studio', 'Non, aucun'], 3, 'Seuls des élèves du lycée peuvent accompagner le candidat.'],
            ['Combien d’élèves au plus sont conseillés dans le groupe, candidat compris ?', ['Deux', 'Dix', 'Cinq', 'Toute la classe'], 2, 'Pour que le rôle du candidat reste visible.'],
            ['La représentation graphique remise au jury est évaluée.', ['Vrai', 'Faux'], 1, 'Elle sert de support à l’entretien, elle n’est pas notée.'],
            ['L’exposé doit établir un lien avec au moins une œuvre du programme limitatif.', ['Vrai', 'Faux'], 0, 'Et avec au moins un champ de questionnement.'],
            ['Quelle longueur maximale a le document de synthèse ?', ['Une page', 'Deux pages', 'Cinq pages', 'Dix pages'], 1, 'Sur papier, visé par le professeur et le chef d’établissement.'],
            ['Quand le document de synthèse est-il transmis au jury ?', ['Le jour même', 'Après l’épreuve', 'Quinze jours avant l’épreuve', 'Un an avant'], 2, 'Le jury peut ainsi préparer l’entretien.'],
            ['Si l’interprétation est collective, l’entretien l’est aussi.', ['Vrai', 'Faux'], 1, 'L’exposé et l’entretien sont toujours individuels.'],
            ['Combien de temps au plus durent l’interprétation et l’exposé ensemble ?', ['5 minutes', '30 minutes', '25 minutes', '15 minutes'], 3, 'L’entretien occupe le temps restant.'],
            ['Quelle est en terminale la « quatrième thématique » ?', ['Une thématique choisie par l’élève en lien avec son autre spécialité, travaillée en projet', 'Une thématique imposée par le ministère', 'La thématique de l’option', 'Une thématique réservée au grand oral de philosophie'], 0, 'Elle peut nourrir une question du grand oral.'],
            ['Que juge avant tout l’oral ?', ['La conformité exacte à la partition', 'Le nombre de musiciens', 'La compréhension par le candidat de ce qu’il a créé', 'La durée de la pièce'], 2, 'La musique vivante peut s’éloigner de la partition.'],
          ],
        },
      ],
    },
  ],
}
