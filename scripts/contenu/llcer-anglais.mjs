// LLCER Anglais — Langues, littératures et cultures étrangères (spé 1re, Tle).
// Thématiques du programme : 1re « Imaginaires » ; Tle « Expression et
// construction de soi » / « Voyages, territoires, frontières ».
// Les énoncés sont en français, les contenus portent sur les œuvres et la
// langue anglaises : c'est ce que demande l'épreuve écrite (synthèse en
// anglais, mais connaissances culturelles précises).

export default {
  slug: 'llcer-anglais',
  nom: 'LLCER Anglais',
  blocs: [
    {
      niveaux: ['1re'],
      chapitres: [
        {
          titre: 'Imaginaires : le gothique et le fantastique',
          lecon: {
            titre: 'From Gothic to Science Fiction',
            cours: `Le roman gothique anglais invente une grammaire de la peur dont notre culture vit encore — du film d’horreur à la science-fiction.

## The Gothic novel
Né avec *The Castle of Otranto* d’**Horace Walpole** (1764), le genre installe des motifs qui se reconnaissent au premier regard.

| Motif | Ce qu’il produit |
| Le château, le souterrain | L’espace clos dont on ne sort pas |
| Le portrait animé | Le passé qui revient |
| Le manuscrit retrouvé | Un récit dont on ne peut vérifier l’origine |
| La malédiction familiale | La faute qui se transmet |

**Ann Radcliffe** y ajoute le **suspense** et l’explication rationnelle finale : la peur y est un effet, pas une croyance.

## Frankenstein
**Mary Shelley**, *Frankenstein, or The Modern Prometheus* (1818), déplace la peur : le monstre n’est plus surnaturel, il est **fabriqué par la science**.

> Le roman pose une question toujours actuelle : le créateur est-il responsable de sa créature ? Le monstre de Shelley ne naît pas mauvais — il le devient d’être abandonné.

## Doubles and monsters
| Œuvre | Auteur, date | Ce que le monstre révèle |
| *Dr Jekyll and Mr Hyde* | Stevenson, 1886 | La face cachée de la respectabilité victorienne |
| *The Picture of Dorian Gray* | Wilde, 1890 | Le portrait vieillit à la place de l’homme |
| *Dracula* | Bram Stoker, 1897 | Peur de l’étranger, de la contagion et du désir |

## Key vocabulary
*uncanny* (inquiétante étrangeté), *dread* (effroi), *haunted* (hanté), *supernatural*, *foreshadowing* (annonce d’un événement futur), *unreliable narrator* (narrateur non fiable).`,
          },
          questions: [
            ['Qui a écrit *Frankenstein* ?', ['Mary Shelley', 'Bram Stoker', 'Emily Brontë', 'Ann Radcliffe'], 0, 'Publié en 1818, sous-titré *The Modern Prometheus*.'],
            ['*The Castle of Otranto* est considéré comme le premier roman gothique.', ['Vrai', 'Faux'], 0, 'Horace Walpole, 1764.'],
            ['Dans *Frankenstein*, le monstre est d’origine…', ['Scientifique', 'Surnaturelle', 'Divine', 'Onirique'], 0, 'C’est ce déplacement qui fonde la science-fiction moderne.'],
            ['Qui a écrit *The Picture of Dorian Gray* ?', ['Oscar Wilde', 'Robert Louis Stevenson', 'Charles Dickens', 'Bram Stoker'], 0, 'Publié en 1890.'],
            ['Le terme « unreliable narrator » désigne un narrateur digne de confiance.', ['Vrai', 'Faux'], 1, 'C’est au contraire un narrateur dont le récit ne peut être cru sans réserve.'],
            ['Que signifie « foreshadowing » ?', ['L’annonce discrète d’un événement à venir', 'Un retour en arrière', 'Une description', 'Un dialogue'], 0, 'Procédé central du suspense.'],
            ['*Dracula* a été publié en 1897 par Bram Stoker.', ['Vrai', 'Faux'], 0, 'Roman épistolaire mêlant peur de l’étranger et de la contagion.'],
            ['Le thème du double est central dans…', ['*Dr Jekyll and Mr Hyde*', '*Robinson Crusoe*', '*Pride and Prejudice*', '*Oliver Twist*'], 0, 'Stevenson, 1886.'],
          ],
        },
        {
          titre: 'Rencontres et société victorienne',
          lecon: {
            titre: 'Love, class and money in the 19th century',
            cours: `Le roman anglais du XIXe siècle raconte des mariages — et derrière eux, une **économie**. Lire ces romans sans voir l’argent, c’est n’en lire que la moitié.

## Jane Austen
*Pride and Prejudice* (1813) s’ouvre sur une ironie devenue célèbre : une vérité universellement reconnue veut qu’un célibataire pourvu d’une belle fortune doive chercher une épouse.

Le mariage y est un **marché** autant qu’un sentiment, et l’ironie du narrateur en est l’instrument critique : elle dit le contraire de ce qu’elle affirme, et laisse au lecteur le soin de conclure.

## The Brontë sisters
| Œuvre | Autrice, date | Ce qu’elle brise |
| *Jane Eyre* | Charlotte, 1847 | Une héroïne pauvre exige d’être traitée en égale |
| *Wuthering Heights* | Emily, 1847 | La linéarité du récit, et la morale du désir |

## Dickens and social criticism
| Roman | Ce qu’il met en accusation |
| *Oliver Twist* | Les workhouses et le sort des orphelins |
| *Hard Times* | La ville industrielle et l’utilitarisme |
| *Great Expectations* | L’argent qui fabrique un gentleman |

> Publiés en **feuilletons**, ces romans touchent un public immense et pèsent réellement sur l’opinion : la forme de publication fait partie de l’efficacité politique du texte.

## Key notions
*social class*, *gentry*, *inheritance* (héritage), *entail* (substitution successorale qui prive les filles), *irony*, *free indirect speech* (discours indirect libre), *serialisation*.`,
          },
          questions: [
            ['Qui a écrit *Pride and Prejudice* ?', ['Jane Austen', 'Charlotte Brontë', 'George Eliot', 'Virginia Woolf'], 0, 'Publié en 1813.'],
            ['*Jane Eyre* et *Wuthering Heights* ont été publiés la même année.', ['Vrai', 'Faux'], 0, 'Tous deux en 1847, par Charlotte et Emily Brontë.'],
            ['Les romans de Dickens ont d’abord paru…', ['En feuilletons', 'En volume unique', 'Au théâtre', 'À titre posthume'], 0, 'La publication sérielle explique leurs rebondissements réguliers.'],
            ['Que dénonce Dickens dans *Oliver Twist* ?', ['La misère et le sort des enfants pauvres', 'La monarchie', 'La colonisation', 'La religion'], 0, 'Workhouses, criminalité, indifférence sociale.'],
            ['Le mariage chez Austen relève uniquement du sentiment.', ['Vrai', 'Faux'], 1, 'Il engage aussi la fortune, le rang et l’héritage.'],
            ['Que désigne le « free indirect speech » ?', ['Le discours indirect libre', 'Un dialogue rapporté', 'Un monologue intérieur', 'Une citation'], 0, 'Austen en est l’une des grandes praticiennes.'],
            ['*Wuthering Heights* suit une narration linéaire et simple.', ['Vrai', 'Faux'], 1, 'Le récit est enchâssé et non chronologique.'],
            ['Le mot « inheritance » signifie…', ['Héritage', 'Mariage', 'Rente', 'Dot'], 0, 'Question centrale du roman anglais du XIXe siècle.'],
          ],
        },
        {
          titre: 'Méthode : commenter un texte en anglais',
          lecon: {
            titre: 'Analysing a text and writing an essay',
            cours: `L’épreuve valorise autant la **langue** que la **méthode** — et la méthode se réduit à trois questions posées dans l’ordre.

## Reading the text
Avant d’écrire une ligne, repérer cinq choses :

| Ce qu’on repère | Les possibilités |
| *Genre* | Extract of a novel, poem, article, speech |
| *Narrator* | First person, third person, omniscient |
| *Setting* | Time and place |
| *Tone* | Ironic, nostalgic, satirical, detached |
| *Structure* | Où se trouve le turning point |

## Building an analysis
| Étape | La question | Ce qu’on y met |
| **What** | Que dit le texte ? | Le contenu, brièvement |
| **How** | Par quels moyens ? | Lexical field, imagery, rhythm, contrast |
| **Why** | Pour quel effet ? | L’intention et ce qu’elle produit sur le lecteur |

> Sauter le **how**, c’est faire un résumé. C’est l’erreur la plus fréquente, et celle qui plafonne le plus vite une copie.

## Useful phrases
*The text deals with…* · *The author suggests that…* · *This is emphasised by…* · *In contrast with…* · *It could be argued that…* · *This echoes…* · *To sum up…*

## Common mistakes
| L’erreur | Ce qu’il faut faire |
| Traduire mot à mot depuis le français | Penser directement en anglais, quitte à simplifier |
| Confondre *author* et *narrator* | Le narrateur est une construction de l’auteur |
| Raconter l’extrait | L’analyser : what, how, why |
| Oublier de citer | Une citation exacte, courte, entre guillemets |`,
          },
          questions: [
            ['Quels sont les trois temps d’une analyse de texte ?', ['What, how, why', 'Who, where, when', 'Read, write, check', 'Introduction, plan, conclusion'], 0, 'Sauter le « how » revient à faire un résumé.'],
            ['Confondre « author » et « narrator » est une erreur d’analyse.', ['Vrai', 'Faux'], 0, 'Le narrateur est une construction du texte, pas l’auteur réel.'],
            ['Que désigne le « setting » d’un texte ?', ['Le cadre spatio-temporel', 'Le ton', 'Le narrateur', 'Le genre'], 0, 'Time and place.'],
            ['Une citation peut être approximative si l’idée est juste.', ['Vrai', 'Faux'], 1, 'Elle doit être exacte, courte et entre guillemets.'],
            ['L’expression « It could be argued that… » sert à…', ['Introduire une thèse nuancée', 'Conclure', 'Citer', 'Résumer'], 0, 'Elle marque la prise de distance argumentative.'],
            ['Que désigne un « lexical field » ?', ['Un champ lexical', 'Un registre de langue', 'Un temps verbal', 'Une figure de style'], 0, 'Son repérage nourrit le « how ».'],
            ['Traduire mot à mot depuis le français est une erreur fréquente.', ['Vrai', 'Faux'], 0, 'Elle produit des tournures non idiomatiques immédiatement repérées.'],
            ['Le « turning point » d’un texte désigne…', ['Le moment de bascule', 'La dernière phrase', 'Le titre', 'Le narrateur'], 0, 'Le repérer structure toute l’analyse.'],
          ],
        },
      ],
    },
    {
      niveaux: ['Tle'],
      chapitres: [
        {
          titre: 'Expression et construction de soi',
          lecon: {
            titre: 'Voices, identity and the self',
            cours: `Écrire « je » en anglais, c’est aussi revendiquer une place. Le chapitre suit cette voix depuis la fondation américaine jusqu’aux tribunes contemporaines.

## The American self
| Auteur | Œuvre | Ce qu’il fonde |
| **Walt Whitman** | *Song of Myself* (1855) | Une voix qui embrasse la nation entière |
| **Emerson** | *Self-Reliance* (1841) | Compter sur soi comme principe |
| **Thoreau** | *Walden* (1854) | Se retirer pour se retrouver |

Le rêve américain se dit d’abord à la première personne — et c’est ce qui rend possible sa contestation, elle aussi personnelle.

## Voices from the margins
| Auteur | Œuvre | L’enjeu |
| **Langston Hughes** | *Harlem Renaissance*, années 1920 | Une voix littéraire pour l’Amérique noire |
| **Zora Neale Hurston** | *Their Eyes Were Watching God* (1937) | La langue vernaculaire comme littérature |
| **Maya Angelou** | *I Know Why the Caged Bird Sings* (1969) | Le récit de soi comme survie |
| **Toni Morrison** | *Beloved* (1987), Nobel 1993 | La mémoire de l’esclavage, portée par un roman |

> Chez ces auteurs, le récit de soi n’est pas un genre intime : c’est un **acte politique**. Dire « je » quand on vous a refusé ce droit, c’est déjà une prise de position.

## Speeches that shaped history
| Discours | Date | Les procédés à repérer |
| **Martin Luther King**, *I Have a Dream* | 1963 | Anaphore, rythme du prêche, appel aux textes fondateurs |
| **Barack Obama**, discours de campagne | 2008 | Récit personnel adossé au récit national |
| **Malala Yousafzai**, à l’ONU | 2013 | Le témoignage comme autorité |

## Key notions
*identity*, *self-reliance*, *coming of age*, *empowerment*, *voice*, *memoir*, *testimony*, et le *double consciousness* de **W. E. B. Du Bois** — se voir toujours à travers le regard de l’autre.`,
          },
          questions: [
            ['Qui a écrit *Song of Myself* ?', ['Walt Whitman', 'Ralph Waldo Emerson', 'Henry David Thoreau', 'Langston Hughes'], 0, 'Publié en 1855 dans *Leaves of Grass*.'],
            ['*Walden* est une œuvre de Thoreau.', ['Vrai', 'Faux'], 0, 'Publiée en 1854, récit d’une retraite volontaire dans les bois.'],
            ['La Harlem Renaissance est un mouvement…', ['Littéraire et artistique afro-américain des années 1920', 'Un courant britannique du XIXe siècle', 'Un mouvement politique des années 1960', 'Une école de peinture'], 0, 'Langston Hughes en est une figure majeure.'],
            ['Qui a prononcé le discours *I Have a Dream* ?', ['Martin Luther King', 'Malcolm X', 'Barack Obama', 'W. E. B. Du Bois'], 0, 'En 1963, lors de la marche sur Washington.'],
            ['Toni Morrison a reçu le prix Nobel de littérature.', ['Vrai', 'Faux'], 0, 'En 1993 ; *Beloved* est publié en 1987.'],
            ['Que désigne la « double consciousness » de Du Bois ?', ['Le fait de se voir à travers le regard d’une société qui vous exclut', 'Le bilinguisme', 'La schizophrénie', 'La mémoire collective'], 0, 'Concept formulé dans *The Souls of Black Folk* (1903).'],
            ['« Coming of age » désigne un récit d’apprentissage.', ['Vrai', 'Faux'], 0, 'Le passage à l’âge adulte, très présent dans le récit de soi.'],
            ['Le « self-reliance » d’Emerson signifie…', ['Compter sur ses propres forces', 'S’en remettre à l’État', 'Suivre la tradition', 'Vivre en communauté'], 0, 'Un pilier de l’imaginaire américain.'],
          ],
        },
        {
          titre: 'Voyages, territoires, frontières',
          lecon: {
            titre: 'Migration, empire and borders',
            cours: `Le monde anglophone s’est construit par **déplacements** — choisis ou imposés. Le chapitre suit ces trois mouvements : l’empire, la migration, la frontière.

## Empire and colonisation
À son apogée, l’Empire britannique couvre un **quart des terres émergées** : *the sun never sets on the British Empire*. La littérature postcoloniale réécrit ce récit depuis l’autre rive.

| Auteur | Œuvre | Le déplacement du regard |
| **Chinua Achebe** | *Things Fall Apart* (1958) | L’arrivée des colons vue du village igbo |
| **Salman Rushdie** | *Midnight’s Children* (1981) | L’indépendance indienne racontée de l’intérieur |
| **Jhumpa Lahiri** | *The Namesake* (2003) | La deuxième génération, entre deux appartenances |

## Migration to America
**Ellis Island** accueille plus de **12 millions** de migrants entre 1892 et 1954. Deux métaphores s’affrontent pour dire ce que devient le migrant :

| Métaphore | Ce qu’elle affirme | Ce qu’elle suppose |
| *Melting pot* | Tout fond dans un alliage commun | L’assimilation est la condition d’entrée |
| *Salad bowl* | Chacun garde sa saveur dans le plat | La différence n’empêche pas l’appartenance |

## Borders today
| Frontière | Ce qu’elle cristallise |
| Le mur mexicain | La frontière comme dispositif physique et politique |
| Le Brexit et la frontière irlandaise | Une frontière invisible redevenue un problème |
| La génération *Windrush* | Des citoyens britanniques rendus illégaux rétroactivement |

> Une frontière n’est pas seulement une ligne : c’est un **dispositif juridique** et un **imaginaire**. C’est pourquoi elle peut se déplacer sans que la carte change.

## Key vocabulary
*settler* (colon), *exile*, *diaspora*, *homeland*, *belonging* (appartenance), *uprooting* (déracinement), *melting pot*, *border*, *citizenship*.`,
          },
          questions: [
            ['Qui a écrit *Things Fall Apart* ?', ['Chinua Achebe', 'Salman Rushdie', 'Jhumpa Lahiri', 'Joseph Conrad'], 0, 'Publié en 1958, il raconte la colonisation vue de l’intérieur igbo.'],
            ['Ellis Island a été le principal point d’entrée des migrants aux États-Unis.', ['Vrai', 'Faux'], 0, 'Plus de 12 millions de personnes entre 1892 et 1954.'],
            ['Que désigne l’image du « salad bowl » ?', ['Une société où chaque culture garde son identité', 'L’assimilation complète', 'La fermeture des frontières', 'Le retour au pays'], 0, 'Elle s’oppose à celle du melting pot.'],
            ['Que signifie « belonging » ?', ['L’appartenance', 'Le départ', 'La possession matérielle', 'La nostalgie'], 0, 'Notion centrale des littératures de la migration.'],
            ['La littérature postcoloniale réécrit le récit impérial depuis le point de vue des colonisés.', ['Vrai', 'Faux'], 0, 'C’est sa démarche fondatrice.'],
            ['Que désigne une diaspora ?', ['La dispersion d’une population hors de son territoire d’origine', 'Une frontière fermée', 'Un traité commercial', 'Une langue créole'], 0, 'Elle maintient un lien avec la homeland.'],
            ['Le Brexit a reposé la question de la frontière irlandaise.', ['Vrai', 'Faux'], 0, 'Une frontière terrestre entre l’UE et le Royaume-Uni.'],
            ['« Uprooting » signifie…', ['Déracinement', 'Enracinement', 'Voyage d’agrément', 'Naturalisation'], 0, 'Le terme dit la violence du départ contraint.'],
          ],
        },
        {
          titre: 'L’épreuve de LLCER en terminale',
          lecon: {
            titre: 'Written and oral exams',
            cours: `Connaître le format de l’épreuve fait partie de la préparation : la moitié des points perdus vient d’une consigne mal lue, pas d’une langue insuffisante.

## Les deux épreuves
| | Écrit | Oral |
| Durée | 3 h 30 | 20 minutes |
| Première partie | **Synthèse** en anglais d’un dossier de trois documents (environ 500 mots) | Présentation d’un **dossier personnel** |
| Seconde partie | **Traduction** ou **transposition** d’un court passage | Entretien avec le jury |

> La synthèse n’est pas un résumé successif des trois documents : il faut dégager une **problématique commune** et les faire dialoguer. Un devoir en trois blocs « document 1, document 2, document 3 » est hors sujet, même bien écrit.

## Ce qui distingue une bonne copie
| Critère | Ce que le jury regarde |
| La problématique | Elle **tient** du début à la fin, elle n’est pas décorative |
| Les connecteurs | *however*, *whereas*, *therefore*, *insofar as* — variés et justes |
| La langue | Correcte avant d’être brillante : une phrase simple et juste vaut mieux |
| Les exemples | Précis plutôt que nombreux |

## Préparer efficacement
1. Tenir **une fiche par œuvre** : auteur, date, contexte, deux citations, un enjeu.
2. Lire régulièrement en anglais, même court — la régularité bat l’intensité.
3. S’entraîner à écrire **500 mots en temps limité** : c’est un exercice de rythme autant que de langue.
4. Préparer l’oral en se faisant poser des questions imprévues : le jury évalue la réaction, pas la récitation.`,
          },
          questions: [
            ['Combien de temps dure l’épreuve écrite de LLCER en terminale ?', ['3h30', '2 heures', '4 heures', '5 heures'], 0, 'Synthèse en anglais puis traduction ou transposition.'],
            ['La synthèse doit résumer les documents l’un après l’autre.', ['Vrai', 'Faux'], 1, 'Elle doit les faire dialoguer autour d’une problématique commune.'],
            ['Quelle est la longueur attendue de la synthèse ?', ['Environ 500 mots', '200 mots', '1000 mots', '150 mots'], 0, 'D’où l’importance de s’entraîner en temps limité.'],
            ['L’oral repose sur un dossier personnel de documents étudiés.', ['Vrai', 'Faux'], 0, 'Présentation puis entretien, sur 20 minutes.'],
            ['Le connecteur « whereas » exprime…', ['Une opposition', 'Une conséquence', 'Une addition', 'Une cause'], 0, 'Comme *while* dans son emploi contrastif.'],
            ['Ce qui compte le plus dans une copie, c’est…', ['Une problématique qui tient tout le devoir', 'Le nombre de références', 'La longueur', 'Le vocabulaire rare'], 0, 'Des exemples précis valent mieux que nombreux.'],
            ['Une fiche par œuvre est une méthode de révision efficace.', ['Vrai', 'Faux'], 0, 'Auteur, date, contexte, deux citations, un enjeu.'],
            ['Le connecteur « therefore » introduit…', ['Une conséquence', 'Une opposition', 'Une concession', 'Un exemple'], 0, 'Équivalent de « donc ».'],
          ],
        },
      ],
    },
  ],
}
