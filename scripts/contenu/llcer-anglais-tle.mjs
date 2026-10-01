// LLCER ANGLAIS — TERMINALE (spécialité) : le programme officiel.
//
// CONSTAT (extraction de la base, 26/09/2026) : la terminale de LLCER anglais
// tenait en TROIS fiches maison (« Expression et construction de soi »,
// « Voyages, territoires, frontières », « L’épreuve de LLCER en terminale »),
// sans axe du programme, et la première des trois thématiques de terminale —
// « Arts et débats d’idées » — n’y figurait pas du tout. Aucune des douze
// œuvres du programme limitatif 2026-2028 n’y était étudiée.
//
// CE MODULE AJOUTE, sans rien retirer : 18 fiches rangées sous les trois
// thématiques du programme (BO spécial n° 8 du 25 juillet 2019) et leurs neuf
// axes, les œuvres du programme limitatif (BO n° 21 du 21 mai 2026, années
// 2026-2027 et 2027-2028) et la méthode des deux parties de l’épreuve (note de
// service de 2020 : écrit de 3 h 30 — synthèse 16 points, traduction ou
// transposition 4 points — et oral de 20 minutes sur dossier personnel).
//
// POURQUOI UN SECOND MODULE plutôt qu’un ajout dans `llcer-anglais.mjs` : ce
// dernier est déjà parti dans une migration exécutée. Deux fichiers, même slug
// — d’où la génération par `--modules llcer-anglais-tle`.

export default {
  slug: 'llcer-anglais',
  nom: 'LLCER Anglais',

  titreMigration: 'LLCER ANGLAIS Tle — LES TROIS THÉMATIQUES, LES ŒUVRES AU PROGRAMME ET LA MÉTHODE',

  motif: `La spécialité LLCER anglais de terminale n’avait que 3 fiches maison,
sans axe du programme ; la thématique « Arts et débats d’idées » manquait
entièrement et aucune œuvre du programme limitatif 2026-2028 n’était étudiée.
Cette migration AJOUTE 18 fiches rangées sous les trois thématiques officielles
(« Arts et débats d’idées », « Expression et construction de soi »,
« Voyages, territoires, frontières ») et une entrée « Méthodes de l’épreuve »
(synthèse, traduction ou transposition, dossier de l’oral, vocabulaire de
l’analyse). Les trois fiches existantes sont conservées.`,

  blocs: [
    {
      niveaux: ['Tle'],
      positionDepart: 4,
      chapitres: [
        // ─────────────────────────── ARTS ET DÉBATS D’IDÉES ───────────────────────────
        {
          titre: 'Art et contestation : quand l’œuvre dénonce',
          axe: 'Arts et débats d’idées',
          lecon: {
            titre: 'Protest, satire and the committed work',
            cours: `Une chanson, un roman, une gravure peuvent faire bouger une société plus sûrement qu’un discours. C’est le premier axe de la thématique « Arts et débats d’idées » : **l’art qui conteste**.

## Satire : faire rire pour faire honte
La satire attaque un vice en le rendant ridicule. Sa grande arme est l’**ironie** : dire le contraire de ce qu’on pense, en comptant sur le lecteur pour rétablir le sens.

| Œuvre | Auteur, date | Ce qu’elle vise |
| *A Modest Proposal* | Jonathan Swift, 1729 | La misère irlandaise : il « propose » froidement de manger les enfants des pauvres |
| *Gin Lane* (gravure) | William Hogarth, 1751 | Les ravages de l’alcool dans les quartiers pauvres de Londres |
| *Animal Farm* | George Orwell, 1945 | La révolution russe trahie : « All animals are equal, but some animals are more equal than others » |

> L’ironie de Swift fonctionne parce qu’elle est **impassible** : le narrateur calcule, chiffre, argumente, et c’est ce calme qui rend l’horreur visible.

## Le roman à visée sociale
Au XIXe et au XXe siècle, le roman devient une enquête.

| Œuvre | Auteur, date | Ce qu’elle révèle |
| *Uncle Tom’s Cabin* | Harriet Beecher Stowe, 1852 | L’esclavage vu de l’intérieur ; le livre pèse dans le débat abolitionniste |
| *Hard Times* | Charles Dickens, 1854 | La ville industrielle et une école qui ne veut que des « facts » |
| *The Jungle* | Upton Sinclair, 1906 | Les abattoirs de Chicago ; le scandale mène à une loi sur l’hygiène alimentaire |
| *The Grapes of Wrath* | John Steinbeck, 1939 | L’exode des fermiers ruinés vers la Californie |

## La chanson engagée
| Chanson | Interprète, date | Le combat |
| *Strange Fruit* | Billie Holiday, 1939 | Les lynchages dans le Sud : les « fruits étranges » sont des corps pendus |
| *Mississippi Goddam* | Nina Simone, 1964 | La colère après les assassinats du mouvement des droits civiques |
| *Blowin’ in the Wind* | Bob Dylan, 1963 | Des questions sans réponse sur la guerre et la liberté |

Bob Dylan reçoit le **prix Nobel de littérature en 2016** : la chanson est reconnue comme une forme poétique à part entière.

## L’art de la rue
**Banksy**, artiste britannique anonyme, peint au pochoir sur les murs (le mur de séparation en Cisjordanie, les rues de Bristol et de Londres). Le mur devient un support de **dénonciation** que personne n’a commandé.

## Méthode : analyser une œuvre engagée
1. **La cible** : qui ou quoi est dénoncé ?
2. **Le procédé** : ironie, exagération, pathos, symbole.
3. **Le destinataire** : qui l’œuvre veut-elle convaincre ?
4. **L’effet** : a-t-elle changé quelque chose (loi, opinion, scandale) ?

## Key vocabulary
| Anglais | Français |
| to denounce, to condemn | dénoncer, condamner |
| a protest song | une chanson engagée |
| satire, satirical | la satire, satirique |
| to raise awareness | sensibiliser |
| committed / engaged art | l’art engagé |`,
          },
          questions: [
            ['Dans *A Modest Proposal* (1729), que « propose » Swift pour régler la misère irlandaise ?', ['Une réforme agraire', 'L’émigration vers l’Amérique', 'Que les riches mangent les enfants des pauvres', 'Une taxe sur les propriétaires anglais'], 2, 'La proposition monstrueuse, exposée sur un ton calme, est le cœur de l’ironie satirique.'],
            ['Quelle chanson de Billie Holiday (1939) dénonce les lynchages dans le Sud des États-Unis ?', ['*Strange Fruit*', '*Summertime*', '*Blowin’ in the Wind*', '*Mississippi Goddam*'], 0, 'Les « fruits étranges » sont les corps des victimes pendus aux arbres.'],
            ['Quelle phrase célèbre vient d’*Animal Farm* ?', ['« Big Brother is watching you »', '« All animals are equal, but some animals are more equal than others »', '« I have a dream »', '« To be or not to be »'], 1, 'Orwell (1945) montre comment une révolution se retourne contre son idéal d’égalité.'],
            ['*The Jungle* d’Upton Sinclair (1906) révèle les conditions de travail…', ['Des mines de charbon galloises', 'Des plantations de coton', 'Des usines textiles de Manchester', 'Des abattoirs de Chicago'], 3, 'Le scandale conduit à une loi fédérale sur l’hygiène des aliments.'],
            ['Bob Dylan a reçu le prix Nobel de littérature en 2016.', ['Vrai', 'Faux'], 0, 'Le jury a reconnu la chanson comme une forme de poésie.'],
            ['Quel procédé repose sur le fait de dire le contraire de ce qu’on pense ?', ['L’hyperbole', 'La métaphore', 'L’ironie', 'L’allitération'], 2, 'L’ironie compte sur le lecteur pour rétablir le vrai sens.'],
            ['Quel roman de 1852 a pesé dans le débat sur l’abolition de l’esclavage ?', ['*Uncle Tom’s Cabin*', '*Hard Times*', '*The Grapes of Wrath*', '*Great Expectations*'], 0, 'Harriet Beecher Stowe y montre l’esclavage de l’intérieur.'],
            ['Dans *Hard Times* (1854), Dickens critique une école qui ne veut enseigner que…', ['La religion', 'Les « facts »', 'Le latin', 'La musique'], 1, 'Le roman attaque l’utilitarisme de la ville industrielle.'],
            ['Que dénonce Hogarth dans sa gravure *Gin Lane* (1751) ?', ['La guerre contre la France', 'La monarchie', 'Les ravages de l’alcool chez les pauvres', 'La traite négrière'], 2, 'La gravure montre un quartier londonien détruit par le gin.'],
            ['Comment traduire « to raise awareness » ?', ['Élever le niveau', 'Sensibiliser', 'Se réveiller', 'Protester'], 1, 'Expression très utile dans une synthèse sur l’art engagé.'],
            ['Banksy est un artiste de rue dont l’identité est publiquement connue.', ['Vrai', 'Faux'], 1, 'Il reste anonyme : son œuvre parle sans que son auteur apparaisse.'],
            ['*The Grapes of Wrath* (1939) raconte…', ['La ruée vers l’or', 'La guerre de Sécession', 'La vie à Harlem', 'L’exode des fermiers ruinés vers la Californie'], 3, 'Steinbeck suit la famille Joad pendant la Grande Dépression.'],
          ],
        },
        {
          titre: 'L’art qui fait débat : scandales et censure',
          axe: 'Arts et débats d’idées',
          lecon: {
            titre: 'Banned, tried and shredded: art on trial',
            cours: `Certaines œuvres ne dénoncent rien et déclenchent pourtant des procès. Le deuxième axe, « L’art qui fait débat », pose la question : **qui décide de ce que l’art a le droit de montrer ?**

## Les grands procès littéraires
| Œuvre | Date | Ce qui s’est passé |
| Oscar Wilde | 1895 | Condamné à deux ans de travaux forcés pour « grossière indécence » (son homosexualité) ; ses textes sont lus au procès |
| *Ulysses*, James Joyce | 1922 | Interdit aux États-Unis ; en **1933**, le juge Woolsey le déclare non obscène |
| *Howl*, Allen Ginsberg | 1956 | Procès pour obscénité en 1957 à San Francisco ; l’éditeur est acquitté |
| *Lady Chatterley’s Lover*, D. H. Lawrence | 1928 | L’éditeur Penguin est acquitté en **1960** : le livre se vend à des millions d’exemplaires |
| *The Satanic Verses*, Salman Rushdie | 1988 | Une fatwa appelle à tuer l’auteur (1989) ; il vit des années sous protection |

> Chaque procès pose la même question : l’œuvre a-t-elle une **valeur littéraire** qui justifie ce qu’elle montre ? C’est l’argument qui sauve *Ulysses* et *Lady Chatterley*.

## Le cinéma sous contrôle
Le **Code Hays** (appliqué de **1934 à 1968**) interdit à Hollywood de montrer le crime impuni, la nudité ou certains sujets. Les cinéastes apprennent à **suggérer** : un fondu enchaîné remplace une scène. Il est remplacé par le système de classement par âge.

## L’art et la société de consommation
Le **pop art** fait débat parce qu’il semble célébrer ce qu’il montre.
| Œuvre | Artiste, date | La question posée |
| *Campbell’s Soup Cans* | Andy Warhol, 1962 | Une boîte de soupe peut-elle être de l’art ? |
| *Fountain* | Marcel Duchamp, 1917 (refusé au salon des Indépendants de New York) | Un urinoir signé devient-il une œuvre parce que l’artiste le décide ? |
| *Girl with Balloon* | Banksy, toile de 2006, détruite en 2018 | L’œuvre s’autodétruit en partie juste après sa vente aux enchères, et gagne en valeur |

## Les arguments du débat
| Pour limiter | Pour protéger |
| Protéger la jeunesse | La liberté d’expression (1er amendement aux États-Unis) |
| Respecter les croyances | L’art doit pouvoir choquer pour faire penser |
| L’ordre public | Le censeur d’hier paraît ridicule demain |

## Méthode : entrer dans une polémique
1. **Situer** l’œuvre et le moment du scandale.
2. **Identifier les camps** : qui s’indigne, qui défend, au nom de quoi ?
3. **Distinguer** l’œuvre de sa réception : ce qu’elle montre, ce qu’on lui reproche.
4. **Conclure en nuançant** : les critères changent avec les époques.

## Key vocabulary
| Anglais | Français |
| to ban, a ban | interdire, une interdiction |
| censorship | la censure |
| obscenity trial | un procès pour obscénité |
| freedom of speech | la liberté d’expression |
| controversial | controversé |
| to spark a debate | déclencher un débat |`,
          },
          questions: [
            ['En quelle année un juge américain déclare-t-il *Ulysses* de Joyce non obscène ?', ['1922', '1945', '1933', '1960'], 2, 'Le juge Woolsey lève l’interdiction en 1933.'],
            ['Quel éditeur est acquitté en 1960 dans le procès de *Lady Chatterley’s Lover* ?', ['Faber', 'Oxford University Press', 'Macmillan', 'Penguin'], 3, 'Le procès reconnaît la valeur littéraire du roman de D. H. Lawrence.'],
            ['Quel poème d’Allen Ginsberg a donné lieu à un procès pour obscénité en 1957 ?', ['*Howl*', '*The Waste Land*', '*Song of Myself*', '*Daddy*'], 0, 'L’éditeur, à San Francisco, est acquitté.'],
            ['Le Code Hays encadrait…', ['La presse écrite britannique', 'Le contenu des films hollywoodiens', 'La radio publique', 'L’édition de poésie'], 1, 'Appliqué de 1934 à 1968, il pousse les cinéastes à suggérer plutôt qu’à montrer.'],
            ['Salman Rushdie a été visé par une fatwa après la publication de *The Satanic Verses*.', ['Vrai', 'Faux'], 0, 'La fatwa de 1989 l’oblige à vivre des années sous protection.'],
            ['Quel artiste a peint les *Campbell’s Soup Cans* (1962) ?', ['Roy Lichtenstein', 'Banksy', 'Jackson Pollock', 'Andy Warhol'], 3, 'Le pop art interroge la frontière entre art et produit de consommation.'],
            ['Pourquoi Oscar Wilde est-il condamné en 1895 ?', ['Pour « grossière indécence », c’est-à-dire son homosexualité', 'Pour trahison', 'Pour avoir publié un pamphlet contre la reine', 'Pour escroquerie'], 0, 'Il est condamné à deux ans de travaux forcés.'],
            ['Quel argument a sauvé *Ulysses* et *Lady Chatterley* devant les juges ?', ['Leur succès commercial', 'Leur valeur littéraire', 'L’âge de leurs auteurs', 'Leur caractère religieux'], 1, 'La valeur artistique justifiait ce que les livres montraient.'],
            ['Que se passe-t-il en 2018 avec *Girl with Balloon* de Banksy ?', ['Elle est volée', 'Elle est interdite', 'Elle s’autodétruit en partie juste après sa vente', 'Elle est repeinte par la ville'], 2, 'Le geste, censé critiquer le marché de l’art, fait monter sa valeur.'],
            ['Comment dit-on « la liberté d’expression » en anglais ?', ['Freedom of speech', 'Free will', 'Speech therapy', 'Liberty of press'], 0, 'Aux États-Unis, elle est garantie par le premier amendement.'],
            ['Le Code Hays est toujours appliqué aujourd’hui à Hollywood.', ['Vrai', 'Faux'], 1, 'Il est abandonné en 1968 au profit du classement des films par âge.'],
            ['Que signifie « to spark a debate » ?', ['Clore un débat', 'Perdre un débat', 'Arbitrer un débat', 'Déclencher un débat'], 3, 'To spark : faire jaillir une étincelle.'],
          ],
        },
        {
          titre: 'L’art du débat : rhétorique et grands discours',
          axe: 'Arts et débats d’idées',
          lecon: {
            titre: 'The art of persuasion: from Lincoln to 12 Angry Men',
            cours: `Convaincre est un art qui s’apprend. Le troisième axe de la thématique, « L’art du débat », étudie les **discours, les plaidoiries et les joutes** qui ont fait bouger le monde anglophone.

## Les trois leviers d’Aristote
| Levier | Ce qu’il mobilise | Exemple |
| **Ethos** | La crédibilité de l’orateur | « As a mother, as a doctor… » |
| **Pathos** | Les émotions du public | Une histoire personnelle bouleversante |
| **Logos** | La logique, les faits | Des chiffres, un raisonnement |

## Des discours qui ont fait l’histoire
| Discours | Orateur, date | La formule |
| *Ain’t I a Woman?* | Sojourner Truth, 1851 | Une ancienne esclave réclame les droits des femmes noires |
| *Gettysburg Address* | Abraham Lincoln, 1863 | « government of the people, by the people, for the people » |
| *We shall fight on the beaches* | Winston Churchill, 1940 | L’anaphore de « we shall fight » |
| Discours d’investiture | John F. Kennedy, 1961 | « Ask not what your country can do for you — ask what you can do for your country » |
| *I Have a Dream* | Martin Luther King, 1963 | Le rêve répété huit fois |

## Les figures de la persuasion
| Figure | Définition | Exemple |
| **Anaphora** | Répéter un mot en tête de phrase | « We shall fight… we shall fight… » |
| **Tricolon** | Une série de trois | « of the people, by the people, for the people » |
| **Chiasmus** | Structure croisée A-B / B-A | « Ask not what your country… ask what you… for your country » |
| **Rhetorical question** | Question sans réponse attendue | « Ain’t I a woman? » |

## Shakespeare, maître du retournement
Dans *Julius Caesar* (vers 1599), Marc Antoine commence par « Friends, Romans, countrymen, lend me your ears » et répète que Brutus est « an honourable man » jusqu’à ce que la phrase signifie son contraire : la foule se retourne.

## Œuvre au programme : *12 Angry Men* (Sidney Lumet, 1957)
Douze jurés, **une seule pièce**, une chaleur étouffante. Un jeune homme est accusé de meurtre ; au premier vote, **onze** votent coupable. Le juré n° 8 (Henry Fonda) ne dit pas qu’il est innocent : il dit qu’il a **un doute raisonnable** (« reasonable doubt »). Il retourne les autres un à un, à force d’arguments et de questions.

> Le film montre que le débat n’est pas un combat de voix fortes : c’est l’**écoute** et le **doute** qui l’emportent, et que les préjugés des jurés pèsent autant que les preuves.

Le huis clos filmé (caméra qui se rapproche peu à peu, plafond qui semble descendre) traduit la pression qui monte.

## Méthode : analyser un discours
1. **Contexte** : qui parle, à qui, quand, pourquoi ?
2. **Structure** : introduction, arguments, climax, appel final.
3. **Procédés** : ethos, pathos, logos et figures.
4. **Effet** : ce que le discours a changé.

## Key vocabulary
| Anglais | Français |
| to persuade, to convince | persuader, convaincre |
| a speech, to deliver a speech | un discours, prononcer un discours |
| a jury, a juror | un jury, un juré |
| reasonable doubt | le doute raisonnable |
| to sway | faire basculer (une opinion) |`,
          },
          questions: [
            ['Quel levier d’Aristote repose sur la crédibilité de l’orateur ?', ['Le pathos', 'L’ethos', 'Le logos', 'Le kairos'], 1, 'Ethos : on écoute l’orateur parce qu’on lui fait confiance.'],
            ['Qui a prononcé le *Gettysburg Address* en 1863 ?', ['George Washington', 'Frederick Douglass', 'Abraham Lincoln', 'Thomas Jefferson'], 2, 'Il y définit la démocratie par un tricolon célèbre.'],
            ['« Of the people, by the people, for the people » est un exemple de…', ['Tricolon', 'Chiasme', 'Oxymore', 'Question rhétorique'], 0, 'Une série de trois éléments, rythmée et facile à retenir.'],
            ['La phrase de Kennedy « Ask not what your country can do for you — ask what you can do for your country » repose sur…', ['Une anaphore', 'Une litote', 'Un euphémisme', 'Un chiasme'], 3, 'Les termes s’inversent : A-B / B-A.'],
            ['Dans *12 Angry Men*, combien de jurés votent « coupable » au premier vote ?', ['Six', 'Onze', 'Douze', 'Neuf'], 1, 'Seul le juré n° 8 refuse de voter coupable sans discussion.'],
            ['Quel acteur joue le juré n° 8 dans le film de Sidney Lumet ?', ['Henry Fonda', 'Marlon Brando', 'James Stewart', 'Gregory Peck'], 0, 'Il incarne le doute raisonnable face aux certitudes.'],
            ['Le juré n° 8 affirme dès le début que l’accusé est innocent.', ['Vrai', 'Faux'], 1, 'Il dit seulement qu’il a un doute raisonnable et veut en parler.'],
            ['Quelle oratrice pose la question « Ain’t I a Woman? » en 1851 ?', ['Harriet Tubman', 'Rosa Parks', 'Sojourner Truth', 'Maya Angelou'], 2, 'Ancienne esclave, elle réclame les droits des femmes noires.'],
            ['Dans *Julius Caesar*, Marc Antoine répète que Brutus est « an honourable man » pour…', ['Le défendre sincèrement', 'Retourner la foule contre lui par l’ironie', 'Annoncer sa mort', 'Demander sa grâce'], 1, 'À force de répétition, la phrase finit par signifier son contraire.'],
            ['Le discours de Churchill de 1940 est célèbre pour l’anaphore de « we shall fight ».', ['Vrai', 'Faux'], 0, 'La répétition en tête de phrase martèle la détermination.'],
            ['Que signifie « reasonable doubt » ?', ['Une erreur judiciaire', 'Un témoin douteux', 'Une preuve irréfutable', 'Le doute raisonnable'], 3, 'Principe clé : on ne condamne pas s’il subsiste un doute raisonnable.'],
            ['Quelle est la particularité de mise en scène de *12 Angry Men* ?', ['Un huis clos presque entièrement dans une seule pièce', 'Des flash-backs sur le crime', 'Un tournage en couleurs dans plusieurs villes', 'Une voix off omniprésente'], 0, 'La caméra se rapproche peu à peu : la pression monte.'],
          ],
        },
        {
          titre: 'The Handmaid’s Tale et la dystopie',
          axe: 'Arts et débats d’idées',
          lecon: {
            titre: 'Dystopia as a warning: Atwood and her ancestors',
            cours: `La dystopie imagine une société invivable pour mieux avertir la nôtre. *The Handmaid’s Tale* (**Margaret Atwood**, **1985**), au programme limitatif, en est l’exemple le plus débattu aujourd’hui.

## Une tradition anglophone
| Œuvre | Auteur, date | La menace imaginée |
| *Brave New World* | Aldous Huxley, 1932 | Le bonheur imposé par le conditionnement et la drogue (le *soma*) |
| *Nineteen Eighty-Four* | George Orwell, 1949 | La surveillance totale (Big Brother) et la langue appauvrie (Newspeak) |
| *Fahrenheit 451* | Ray Bradbury, 1953 | Les livres brûlés par des pompiers |
| *The Handmaid’s Tale* | Margaret Atwood, 1985 | Le contrôle du corps des femmes par un régime religieux |

## L’histoire
Dans un futur proche, les États-Unis sont devenus la **République de Gilead**, théocratie fondée sur une lecture littérale de la Bible. La natalité s’est effondrée ; les femmes fertiles deviennent des **Handmaids** (servantes), vêtues de rouge, affectées à un **Commander** pour lui donner un enfant.

La narratrice s’appelle **Offred** — « Of Fred », celle qui appartient à Fred : même son nom lui a été retiré. Elle vit chez le Commandant et son épouse, **Serena Joy**, ancienne chanteuse qui défendait le retour des femmes au foyer.

| Personnage | Rôle |
| Offred | La narratrice, qui se souvient de sa vie d’avant (son mari Luke, sa fille) |
| Moira | Son amie rebelle, qui tente de s’évader |
| Ofglen | Sa compagne de courses, membre du réseau de résistance **Mayday** |
| Nick | Le chauffeur, avec qui Offred noue une liaison |

## Une écriture de la mémoire
Le récit est fragmenté, au présent, entrecoupé de souvenirs. Offred **se raconte pour survivre** : « Nolite te bastardes carborundorum », phrase de latin de cuisine gravée par une servante précédente, devient son mot de passe intérieur (« ne laisse pas les salauds t’écraser »).

Le roman se clôt sur des **Historical Notes** : en **2195**, lors d’un colloque universitaire, des historiens commentent le récit d’Offred, retrouvé sur des cassettes… avec une légèreté qui glace.

> Atwood l’a souvent répété : elle n’a rien mis dans le livre qui ne soit **déjà arrivé quelque part** dans l’histoire humaine. La dystopie n’invente pas, elle **rassemble**.

## Pourquoi le livre fait débat
Il est régulièrement retiré de bibliothèques scolaires américaines ; le costume rouge des servantes est devenu un **symbole de manifestation** pour les droits des femmes. Atwood lui donne une suite, *The Testaments* (2019).

## Méthode : lire une dystopie
1. **Repérer le point de départ réel** : ce qui, dans notre monde, est poussé à l’extrême.
2. **Étudier le pouvoir** : surveillance, langue, corps, religion.
3. **Suivre la résistance** : mémoire, mots, amour, réseau.
4. **Relier au présent** : pourquoi relit-on ce livre aujourd’hui ?

## Key vocabulary
| Anglais | Français |
| a dystopia, dystopian | une dystopie, dystopique |
| a regime, totalitarian | un régime, totalitaire |
| surveillance | la surveillance |
| to be stripped of one’s rights | être privé de ses droits |
| a warning | un avertissement |`,
          },
          questions: [
            ['Qui a écrit *The Handmaid’s Tale* (1985) ?', ['Doris Lessing', 'Toni Morrison', 'Margaret Atwood', 'Ursula K. Le Guin'], 2, 'Romancière canadienne, elle en publie la suite en 2019.'],
            ['Comment s’appelle le régime qui a remplacé les États-Unis dans le roman ?', ['Oceania', 'Gilead', 'Panem', 'Airstrip One'], 1, 'Gilead est une théocratie fondée sur une lecture littérale de la Bible.'],
            ['Que signifie le nom « Offred » ?', ['« Celle qui appartient à Fred »', '« Offerte en rouge »', '« Celle qui a fui »', '« Libérée »'], 0, 'Of Fred : même son nom lui a été retiré.'],
            ['Quel roman d’Orwell invente Big Brother et la Newspeak ?', ['*Animal Farm*', '*Brave New World*', '*Fahrenheit 451*', '*Nineteen Eighty-Four*'], 3, 'Publié en 1949, il imagine une surveillance totale.'],
            ['Dans *Fahrenheit 451*, les pompiers…', ['Brûlent les livres', 'Éteignent les incendies de forêt', 'Surveillent les écrans', 'Gardent les frontières'], 0, 'Ray Bradbury, 1953 : 451 °F est la température à laquelle le papier brûle.'],
            ['Comment s’appelle le réseau de résistance dans le roman d’Atwood ?', ['Mayday', 'Underground', 'Freedom', 'Red Cross'], 0, 'Ofglen, la compagne de courses d’Offred, en fait partie.'],
            ['Le roman s’achève sur un colloque d’historiens en 2195.', ['Vrai', 'Faux'], 0, 'Les « Historical Notes » commentent le récit avec une légèreté glaçante.'],
            ['Qui est Serena Joy ?', ['L’amie rebelle d’Offred', 'Une servante évadée', 'L’épouse du Commandant', 'La fille d’Offred'], 2, 'Ancienne chanteuse, elle militait pour le retour des femmes au foyer.'],
            ['Que dit Atwood de l’invention de son roman ?', ['Tout y est imaginaire', 'Rien n’y est arrivé nulle part avant', 'Elle s’est inspirée d’un rêve', 'Rien n’y figure qui ne soit déjà arrivé quelque part'], 3, 'La dystopie rassemble des faits réels, elle ne les invente pas.'],
            ['Dans *Brave New World* (1932), la population est maintenue heureuse par…', ['La peur de la guerre', 'Le conditionnement et une drogue, le soma', 'La prière obligatoire', 'Des écrans dans chaque maison'], 1, 'Huxley imagine un bonheur imposé, pas une terreur.'],
            ['Comment traduire « to be stripped of one’s rights » ?', ['Défendre ses droits', 'Céder ses droits', 'Être privé de ses droits', 'Réclamer ses droits'], 2, 'To strip : dépouiller.'],
            ['Le costume rouge des servantes est devenu un symbole de manifestation.', ['Vrai', 'Faux'], 0, 'Des militantes le portent pour défendre les droits des femmes.'],
          ],
        },

        // ─────────────────────── EXPRESSION ET CONSTRUCTION DE SOI ───────────────────────
        {
          titre: 'L’expression des émotions : du sonnet à The Piano',
          axe: 'Expression et construction de soi',
          lecon: {
            titre: 'Feelings in words, and feelings without words',
            cours: `Comment dire ce qu’on ressent ? L’axe « L’expression des émotions » suit cette question du sonnet élisabéthain au cinéma de **Jane Campion**, dont *The Piano* (1993) est au programme.

## Le sonnet : l’amour mis en forme
Les **Sonnets** de **Shakespeare** (publiés en **1609**) comptent 154 poèmes de 14 vers : trois quatrains et un **distique final** (couplet) qui retourne ou résume l’idée.

« Shall I compare thee to a summer’s day? » (Sonnet 18) : l’été passe, mais le poème, lui, rendra la personne aimée éternelle.

## Le romantisme : l’émotion comme source
En **1798**, **Wordsworth** et **Coleridge** publient les *Lyrical Ballads*. Dans la préface de 1800, Wordsworth définit la poésie comme « **the spontaneous overflow of powerful feelings** », une émotion « recollected in tranquillity » : ressentie d’abord, puis reprise à distance.

| Poète | Œuvre | L’émotion |
| William Wordsworth | « I Wandered Lonely as a Cloud » (1807) | La joie de la nature revenue en mémoire |
| John Keats | Les odes de 1819 | La beauté et la mort mêlées |
| Emily Dickinson (1830-1886) | « Hope is the thing with feathers » | L’émotion en images brèves et tirets |
| Sylvia Plath | *Ariel* (1965, posthume) | La poésie **confessionnelle** : le moi le plus intime |

## *The Piano* : l’émotion sans parole
**Jane Campion**, Néo-Zélandaise, remporte la **Palme d’or à Cannes en 1993** — première réalisatrice à la recevoir.

Au milieu du XIXe siècle, **Ada McGrath** (Holly Hunter), Écossaise **muette** depuis l’enfance, est envoyée avec sa fille **Flora** en Nouvelle-Zélande pour épouser un colon, **Stewart**. Son piano reste sur la plage. **Baines**, un voisin qui vit parmi les Maoris, l’obtient de Stewart en échange de terres et propose un marché : Ada pourra le regagner, touche après touche, en échange de leçons… qui deviennent une relation.

| Ce qui parle à la place des mots | Comment |
| Le **piano** | La musique de Michael Nyman est la voix d’Ada |
| Les **mains** | Elle signe, joue, écrit sur une touche |
| Le **paysage** | Boue, forêt, mer : un monde qui étouffe ou libère |
| Le **regard de Flora** | L’enfant traduit, puis trahit |

> Chez Campion, le silence n’est pas un manque : c’est un **choix**. Ada refuse de parler à un monde qui ne l’écoute pas, et le piano lui rend une voix qu’elle ne doit à personne.

## Méthode : analyser l’expression d’une émotion
1. **Nommer** l’émotion avec précision (grief, longing, rage, awe).
2. **Repérer ce qui la porte** : rythme, images, silence, musique, cadrage.
3. **Distinguer** l’émotion vécue et l’émotion mise en forme.
4. **Mesurer l’effet** sur le lecteur ou le spectateur.

## Key vocabulary
| Anglais | Français |
| grief | le chagrin, le deuil |
| longing, yearning | le désir, la nostalgie |
| to convey an emotion | transmettre une émotion |
| mute, speechless | muet, sans voix |
| a close-up | un gros plan |`,
          },
          questions: [
            ['Combien de vers compte un sonnet shakespearien ?', ['12', '16', '10', '14'], 3, 'Trois quatrains et un distique final.'],
            ['Quel vers ouvre le Sonnet 18 de Shakespeare ?', ['« To be or not to be »', '« Shall I compare thee to a summer’s day? »', '« I wandered lonely as a cloud »', '« Hope is the thing with feathers »'], 1, 'Le poème promet l’éternité à la personne aimée.'],
            ['Wordsworth définit la poésie comme « the spontaneous overflow of powerful feelings ».', ['Vrai', 'Faux'], 0, 'Dans la préface des *Lyrical Ballads* (1800).'],
            ['Avec qui Wordsworth publie-t-il les *Lyrical Ballads* en 1798 ?', ['Coleridge', 'Byron', 'Keats', 'Shelley'], 0, 'Ce recueil est considéré comme l’acte de naissance du romantisme anglais.'],
            ['Dans *The Piano*, pourquoi Ada ne parle-t-elle pas ?', ['Elle ne parle pas anglais', 'Elle a fait vœu de silence religieux', 'Elle est muette depuis l’enfance', 'Elle a perdu la voix pendant le voyage'], 2, 'Le piano devient sa voix.'],
            ['Qui a réalisé *The Piano* (1993) ?', ['Sofia Coppola', 'Jane Campion', 'Kathryn Bigelow', 'Greta Gerwig'], 1, 'Elle est la première réalisatrice à recevoir la Palme d’or.'],
            ['Dans quel pays se déroule *The Piano* ?', ['En Écosse', 'En Australie', 'Au Canada', 'En Nouvelle-Zélande'], 3, 'Ada y est envoyée pour épouser un colon, Stewart.'],
            ['La poésie de Sylvia Plath est dite « confessionnelle ».', ['Vrai', 'Faux'], 0, 'Elle expose le moi le plus intime, comme Robert Lowell.'],
            ['Qui obtient le piano d’Ada contre des terres et lui propose un marché ?', ['Stewart', 'Baines', 'Flora', 'Son père'], 1, 'Ada regagne le piano touche après touche, en échange de leçons.'],
            ['Comment traduire « grief » ?', ['Le chagrin, le deuil', 'La colère', 'La honte', 'La joie'], 0, 'À ne pas confondre avec le français « grief » (reproche).'],
            ['Quel compositeur signe la musique de *The Piano* ?', ['John Williams', 'Hans Zimmer', 'Michael Nyman', 'Philip Glass'], 2, 'Sa musique tient lieu de voix au personnage d’Ada.'],
            ['Que signifie « to convey an emotion » ?', ['Cacher une émotion', 'Maîtriser une émotion', 'Exagérer une émotion', 'Transmettre une émotion'], 3, 'To convey : transmettre, communiquer.'],
          ],
        },
        {
          titre: 'Mise en scène de soi : masques et rôles',
          axe: 'Expression et construction de soi',
          lecon: {
            titre: 'All the world’s a stage: Much Ado About Nothing and beyond',
            cours: `« All the world’s a stage, and all the men and women merely players » (**Shakespeare**, *As You Like It*). L’axe « Mise en scène de soi » demande : **qui sommes-nous quand nous jouons un rôle** — et en jouons-nous jamais aucun ?

## Se raconter pour exister
| Œuvre | Auteur, date | Le soi mis en scène |
| *The Autobiography* | Benjamin Franklin (écrite de 1771 à 1790) | Le self-made man qui s’est construit lui-même |
| *Narrative of the Life of Frederick Douglass* | Frederick Douglass, 1845 | L’esclave qui apprend à lire et conquiert son « je » |
| *I Know Why the Caged Bird Sings* | Maya Angelou, 1969 | Une enfance noire dans le Sud ségrégationniste |

## Le masque et le double
| Œuvre | Auteur, date | Le jeu |
| « My Last Duchess » | Robert Browning, 1842 | **Monologue dramatique** : un duc se trahit en parlant |
| *The Importance of Being Earnest* | Oscar Wilde, 1895 | Deux héros s’inventent un double pour échapper aux convenances |

Le sociologue **Erving Goffman** (*The Presentation of Self in Everyday Life*, 1956) décrit la vie sociale comme un théâtre : chacun a une **scène** et des **coulisses**. Les réseaux sociaux prolongent l’idée : en 2013, le dictionnaire d’Oxford fait de « selfie » son mot de l’année.

## Œuvre au programme : *Much Ado About Nothing* (Kenneth Branagh, 1993)
Branagh adapte la comédie de **Shakespeare** (vers 1598) et la tourne en Toscane, en plein soleil. Il y joue **Benedick** ; **Emma Thompson** joue **Beatrice**.

| Personnage | Son masque |
| Beatrice et Benedick | Ils se livrent une « **merry war** » de mots d’esprit pour cacher qu’ils s’aiment |
| Claudio et Hero | Le jeune couple, que la calomnie va briser |
| Don John | Le frère jaloux qui monte une fausse mise en scène pour salir Hero |
| Dogberry | Le chef de la garde, ridicule, qui découvre pourtant la vérité |

Toute la pièce repose sur des **mises en scène** :
1. Un **bal masqué** où chacun parle derrière un masque.
2. Deux scènes d’**espionnage arrangé** (« gulling scenes ») : les amis de Benedick, puis ceux de Beatrice, font exprès d’être entendus pour les convaincre qu’ils sont aimés.
3. Une **fausse preuve** : Don John fait croire que Hero est infidèle.
4. Une **fausse mort** : Hero se fait passer pour morte pour être lavée de l’accusation.

> Le titre joue sur *nothing* et *noting* (prononcés presque pareil au temps de Shakespeare) : épier, remarquer, prendre note. Tout le monde s’observe — et se trompe sur ce qu’il voit.

## Méthode : étudier une mise en scène de soi
1. **Qui parle, et devant qui ?** Le public change le rôle.
2. **Écart** entre ce que le personnage montre et ce qu’il est.
3. **Moment où le masque tombe** : aveu, crise, révélation.
4. **Regard de l’auteur** : moquerie, tendresse, critique ?

## Key vocabulary
| Anglais | Français |
| to put on a mask | porter un masque |
| wit, witty | l’esprit, spirituel |
| to eavesdrop | écouter aux portes |
| slander | la calomnie |
| self-image | l’image de soi |`,
          },
          questions: [
            ['Qui joue Beatrice dans *Much Ado About Nothing* de Kenneth Branagh ?', ['Kate Winslet', 'Helena Bonham Carter', 'Emma Thompson', 'Judi Dench'], 2, 'Branagh joue lui-même Benedick.'],
            ['Comment Shakespeare qualifie-t-il la joute entre Beatrice et Benedick ?', ['A merry war', 'A cold war', 'A love game', 'A civil war'], 0, 'Une guerre joyeuse de mots d’esprit qui cache un amour.'],
            ['Quel personnage monte une fausse preuve pour salir Hero ?', ['Dogberry', 'Don Pedro', 'Claudio', 'Don John'], 3, 'Le frère jaloux fait croire à l’infidélité de Hero.'],
            ['Sur quel jeu de mots repose le titre *Much Ado About Nothing* ?', ['Nothing / nodding', 'Nothing / noting', 'Ado / adieu', 'Much / match'], 1, '« Noting » : épier, remarquer — tout le monde s’observe dans la pièce.'],
            ['Dans la pièce, Hero se fait passer pour morte afin d’être lavée de l’accusation.', ['Vrai', 'Faux'], 0, 'La fausse mort est une dernière mise en scène, qui rétablit la vérité.'],
            ['Qu’est-ce qu’un monologue dramatique, comme « My Last Duchess » de Browning ?', ['Un dialogue entre deux amants', 'Un poème où un personnage parle et se trahit devant un auditeur muet', 'Une tirade de tragédie grecque', 'Un sonnet en vers libres'], 1, 'Le duc révèle sans le vouloir qu’il a fait disparaître sa femme.'],
            ['Quel sociologue décrit la vie sociale comme un théâtre avec scène et coulisses ?', ['Erving Goffman', 'Max Weber', 'Pierre Bourdieu', 'Émile Durkheim'], 0, '*The Presentation of Self in Everyday Life*, 1956.'],
            ['Dans *The Importance of Being Earnest* (1895), les héros…', ['Écrivent leurs mémoires', 'Partent en guerre', 'S’inventent un double pour échapper aux convenances', 'Se déguisent en femmes'], 2, 'Oscar Wilde se moque de la respectabilité victorienne.'],
            ['*Narrative of the Life of Frederick Douglass* est un récit autobiographique d’esclave.', ['Vrai', 'Faux'], 0, 'Publié en 1845, il montre comment apprendre à lire libère le « je ».'],
            ['Que signifie « to eavesdrop » ?', ['Calomnier', 'Se déguiser', 'Mentir', 'Écouter aux portes'], 3, 'Les « gulling scenes » reposent sur des conversations écoutées exprès.'],
            ['Dans quelle région Branagh tourne-t-il son film ?', ['En Écosse', 'En Toscane', 'En Andalousie', 'En Provence'], 1, 'Le soleil italien donne à la comédie son éclat.'],
            ['Quel personnage, ridicule chef de la garde, découvre pourtant la vérité ?', ['Benedick', 'Leonato', 'Dogberry', 'Borachio'], 2, 'Ironie shakespearienne : le plus sot démasque le complot.'],
          ],
        },
        {
          titre: 'Initiation, apprentissage : le roman de formation',
          axe: 'Expression et construction de soi',
          lecon: {
            titre: 'Coming of age: from Great Expectations to Boyhood',
            cours: `Grandir, c’est perdre des illusions et gagner un regard. L’axe « Initiation, apprentissage » s’appuie sur le **Bildungsroman** (roman de formation) et sur une œuvre au programme : *Boyhood* de **J. M. Coetzee**.

## Le Bildungsroman anglophone
| Œuvre | Auteur, date | Ce que le héros apprend |
| *Jane Eyre* | Charlotte Brontë, 1847 | Une orpheline conquiert son indépendance : « I am no bird; and no net ensnares me » |
| *Great Expectations* | Charles Dickens, 1861 | Pip, devenu gentleman, découvre que son bienfaiteur est un ancien forçat : la vraie valeur n’est pas le rang |
| *A Portrait of the Artist as a Young Man* | James Joyce, 1916 | Stephen Dedalus s’arrache à l’Irlande et à l’Église pour devenir écrivain |
| *The Catcher in the Rye* | J. D. Salinger, 1951 | Holden Caulfield refuse le monde « phony » des adultes |
| *To Kill a Mockingbird* | Harper Lee, 1960 | Scout découvre le racisme de son village à travers le procès défendu par son père |

## Les étapes de l’initiation
1. **Le départ** : quitter la famille, le village, l’enfance.
2. **Les épreuves** : humiliation, injustice, amour déçu.
3. **L’épiphanie** : un moment de révélation (le mot est de Joyce).
4. **Le retour** ou le nouveau regard : le héros voit ce qu’il ne voyait pas.

## Œuvre au programme : *Boyhood: Scenes from Provincial Life* (J. M. Coetzee, 1997)
**John Maxwell Coetzee**, Sud-Africain né en **1940** au Cap, **prix Nobel de littérature en 2003**, raconte son enfance dans les années 1940-1950, quand la famille s’installe à **Worcester**, petite ville de province près du Cap.

| Particularité | Effet |
| Récit à la **troisième personne** (« he ») | Une autobiographie qui refuse le « je » et tient l’enfant à distance |
| Au **présent** | Pas de sagesse d’adulte : on reste dans l’instant de l’enfant |
| Entre deux langues | Famille anglophone chez les Afrikaners, l’enfant n’appartient pleinement à aucun camp |
| Secrets | À l’école, il se déclare **catholique** au hasard, et doit ensuite tenir ce mensonge |

L’enfant aime sa mère d’un amour qui l’étouffe, méprise son père, et devine sans les nommer la violence de la ségrégation qui s’organise autour de lui (l’apartheid est instauré en **1948**).

> *Boyhood* inverse le roman de formation : l’enfant n’apprend pas à trouver sa place, il apprend qu’il **n’en a pas** — et c’est de ce décalage que naîtra l’écrivain. Le livre forme une trilogie avec *Youth* (2002) et *Summertime* (2009).

## Méthode : repérer l’initiation dans un texte
1. **Situation de départ** : l’innocence, les certitudes du héros.
2. **Élément déclencheur** : la rencontre, le choc.
3. **Transformation** : ce qu’il sait à la fin qu’il ne savait pas.
4. **Point de vue** : le narrateur adulte juge-t-il l’enfant qu’il était ?

## Key vocabulary
| Anglais | Français |
| coming of age | le passage à l’âge adulte |
| a turning point | un tournant |
| innocence, loss of innocence | l’innocence, sa perte |
| to grow up | grandir |
| an epiphany | une révélation soudaine |`,
          },
          questions: [
            ['Que désigne le mot « Bildungsroman » ?', ['Un roman épistolaire', 'Un roman historique', 'Un roman de formation', 'Un roman policier'], 2, 'Le héros y grandit à travers une suite d’épreuves.'],
            ['Dans *Great Expectations*, qui est en réalité le bienfaiteur de Pip ?', ['Miss Havisham', 'Un ancien forçat', 'Son oncle', 'Joe Gargery'], 1, 'Pip apprend que la vraie valeur n’est pas le rang social.'],
            ['Qui a écrit *The Catcher in the Rye* (1951) ?', ['J. D. Salinger', 'Jack Kerouac', 'John Steinbeck', 'F. Scott Fitzgerald'], 0, 'Holden Caulfield y rejette le monde « phony » des adultes.'],
            ['En quelle personne *Boyhood* de Coetzee est-il écrit ?', ['Première personne', 'Deuxième personne', 'Première personne du pluriel', 'Troisième personne'], 3, 'Une autobiographie qui refuse le « je » et tient l’enfant à distance.'],
            ['*Boyhood* est écrit au présent.', ['Vrai', 'Faux'], 0, 'On reste dans l’instant de l’enfant, sans sagesse d’adulte.'],
            ['Dans quelle ville de province la famille du jeune Coetzee s’installe-t-elle ?', ['Johannesburg', 'Worcester', 'Durban', 'Pretoria'], 1, 'Une petite ville près du Cap, dans les années 1940-1950.'],
            ['Quelle religion l’enfant déclare-t-il au hasard à l’école ?', ['Catholique', 'Juive', 'Protestante', 'Musulmane'], 0, 'Il doit ensuite tenir ce mensonge.'],
            ['En quelle année J. M. Coetzee a-t-il reçu le prix Nobel de littérature ?', ['1993', '2016', '2003', '1987'], 2, 'Écrivain sud-africain né en 1940 au Cap.'],
            ['Qui a popularisé en littérature le mot « épiphanie » (révélation soudaine) ?', ['Charles Dickens', 'James Joyce', 'Harper Lee', 'Charlotte Brontë'], 1, 'Dans l’œuvre de Joyce, un détail banal révèle soudain une vérité.'],
            ['Dans *To Kill a Mockingbird*, Scout découvre le racisme de son village grâce au procès défendu par son père.', ['Vrai', 'Faux'], 0, 'Harper Lee, 1960 : Atticus Finch défend un homme noir accusé à tort.'],
            ['Quelle héroïne déclare « I am no bird; and no net ensnares me » ?', ['Elizabeth Bennet', 'Scout Finch', 'Offred', 'Jane Eyre'], 3, 'Charlotte Brontë, 1847 : une orpheline revendique son indépendance.'],
            ['Que signifie « a turning point » ?', ['Un tournant', 'Un point de vue', 'Un demi-tour', 'Un point final'], 0, 'Le moment où la trajectoire du personnage change.'],
          ],
        },
        {
          titre: 'Pride and Prejudice : se tromper pour se connaître',
          axe: 'Expression et construction de soi',
          lecon: {
            titre: 'First impressions: Jane Austen’s school of judgement',
            cours: `« It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. » La première phrase de *Pride and Prejudice* (**Jane Austen**, **1813**), au programme limitatif, est déjà une leçon d’ironie.

## Le monde du roman
L’Angleterre de la **gentry** rurale, au début du XIXe siècle. Les **Bennet** ont cinq filles et pas de fils : la propriété de **Longbourn** reviendra à un cousin (c’est l’**entail**). Pour les filles, un bon mariage est une question de survie.

| Personnage | Ce qu’il représente |
| **Elizabeth Bennet** | L’esprit vif, le jugement rapide… et faillible |
| **Mr Darcy** | Le riche propriétaire de **Pemberley**, jugé orgueilleux |
| Jane Bennet et Mr Bingley | La douceur, l’amour empêché par les convenances |
| Mr Wickham | Le séducteur charmant, menteur |
| Mr Collins | Le cousin pasteur, servile et ridicule |
| Charlotte Lucas | L’amie qui épouse Collins par raison : « I am not romantic » |
| Lady Catherine de Bourgh | L’aristocratie arrogante |
| Lydia Bennet | La plus jeune, qui s’enfuit avec Wickham |

## L’intrigue en quatre temps
1. **La mauvaise première impression** : au bal, Darcy juge Elizabeth « tolerable ». Elle ne l’oubliera pas.
2. **La première demande** : Darcy se déclare… en insistant sur l’infériorité de sa famille. Elle refuse avec éclat.
3. **La lettre** : Darcy lui révèle la vérité sur Wickham. Elizabeth relit et comprend : « **Till this moment I never knew myself.** »
4. **La réparation** : Darcy sauve l’honneur des Bennet après la fuite de Lydia, sans le dire. Seconde demande, acceptée.

> Le titre de travail d’Austen était *First Impressions*. L’orgueil (Darcy) et le préjugé (Elizabeth) sont partagés : chacun doit corriger **son propre regard**. C’est un roman d’**apprentissage du jugement**.

## L’art d’Austen
| Procédé | Effet |
| **Ironie** du narrateur | La première phrase dit en réalité que ce sont les familles qui cherchent un riche mari |
| **Discours indirect libre** | On entend les pensées d’Elizabeth sans guillemets, avec ses erreurs |
| **Dialogues** vifs | Le caractère se révèle dans la réplique |
| Satire sociale | Collins et Lady Catherine sont ridicules par leurs propres mots |

## Pourquoi c’est au programme
Le roman interroge l’**expression et la construction de soi** : comment se forme un jugement, comment on change d’avis, quelle liberté a une femme sans fortune. Il dialogue aussi avec la joute amoureuse de Beatrice et Benedick (*Much Ado About Nothing*).

## Key vocabulary
| Anglais | Français |
| pride | l’orgueil, la fierté |
| prejudice | le préjugé |
| to misjudge someone | mal juger quelqu’un |
| a proposal, to propose | une demande en mariage, demander en mariage |
| an estate | un domaine |
| free indirect speech | le discours indirect libre |`,
          },
          questions: [
            ['En quelle année paraît *Pride and Prejudice* ?', ['1847', '1813', '1789', '1861'], 1, 'Jane Austen le publie sous la Régence.'],
            ['Quel était le titre de travail du roman ?', ['*Sense and Sensibility*', '*Longbourn*', '*First Impressions*', '*The Bennet Sisters*'], 2, 'Tout le roman corrige une première impression.'],
            ['Comment s’appelle le domaine de Mr Darcy ?', ['Pemberley', 'Longbourn', 'Netherfield', 'Rosings'], 0, 'Sa visite change le regard d’Elizabeth.'],
            ['Qui épouse Mr Collins « par raison » ?', ['Jane Bennet', 'Lydia Bennet', 'Elizabeth Bennet', 'Charlotte Lucas'], 3, '« I am not romantic » : elle cherche la sécurité.'],
            ['Quelle phrase prononce Elizabeth après avoir lu la lettre de Darcy ?', ['« Till this moment I never knew myself »', '« Reader, I married him »', '« I am no bird »', '« All the world’s a stage »'], 0, 'Le moment de la prise de conscience : elle s’est trompée.'],
            ['Lors de la première demande, Darcy insiste sur l’infériorité de la famille d’Elizabeth.', ['Vrai', 'Faux'], 0, 'C’est pourquoi elle refuse avec éclat.'],
            ['Avec qui Lydia Bennet s’enfuit-elle ?', ['Mr Bingley', 'Mr Collins', 'Mr Wickham', 'Colonel Fitzwilliam'], 2, 'Darcy sauve discrètement l’honneur de la famille.'],
            ['Quel procédé permet d’entendre les pensées d’Elizabeth sans guillemets ?', ['Le monologue dramatique', 'Le discours indirect libre', 'Le récit enchâssé', 'Le flash-back'], 1, 'On partage ses pensées, y compris ses erreurs.'],
            ['L’orgueil appartient seulement à Darcy et le préjugé seulement à Elizabeth.', ['Vrai', 'Faux'], 1, 'Les deux défauts sont partagés : chacun doit corriger son regard.'],
            ['Pourquoi la propriété des Bennet reviendra-t-elle à un cousin ?', ['Mr Bennet est ruiné', 'Parce que les filles ne peuvent en hériter (l’entail)', 'Parce que Mrs Bennet l’a vendue', 'Parce qu’elle appartient à Lady Catherine'], 1, 'D’où l’urgence de marier les cinq filles.'],
            ['Que signifie « prejudice » ?', ['Le préjudice', 'La fierté', 'La prudence', 'Le préjugé'], 3, 'Faux ami : « préjudice » se dit « harm » ou « damage ».'],
            ['La première phrase du roman (« It is a truth universally acknowledged… ») est…', ['Ironique', 'Tragique', 'Religieuse', 'Scientifique'], 0, 'Ce sont surtout les familles qui cherchent un riche mari.'],
          ],
        },

        // ─────────────────────── VOYAGES, TERRITOIRES, FRONTIÈRES ───────────────────────
        {
          titre: 'Exploration et aventure : partir vers l’Ouest',
          axe: 'Voyages, territoires, frontières',
          lecon: {
            titre: 'Go West: from Crusoe to Moon Palace',
            cours: `Le voyage est la grande forme du récit anglophone : on part pour découvrir un territoire, et l’on découvre surtout **qui l’on est**. C’est l’axe « Exploration et aventure », éclairé par *Moon Palace* (**Paul Auster**, **1989**), au programme.

## Le récit d’aventure britannique
| Œuvre | Auteur, date | Le voyage |
| *Robinson Crusoe* | Daniel Defoe, 1719 | Le naufragé qui reconstruit la civilisation seul sur une île |
| *Gulliver’s Travels* | Jonathan Swift, 1726 | Des voyages imaginaires qui font la satire de l’Angleterre |
| *Heart of Darkness* | Joseph Conrad, 1899 | Marlow remonte le fleuve Congo vers Kurtz : l’aventure coloniale tourne au cauchemar |

## L’Amérique et la Frontière
| Repère | Date | Ce qu’il fonde |
| L’expédition **Lewis et Clark** | 1804-1806 | La traversée du continent jusqu’au Pacifique |
| La thèse de la **Frontier** (Frederick Jackson Turner) | 1893 | L’identité américaine forgée par la conquête de l’Ouest |
| *The Call of the Wild*, Jack London | 1903 | L’appel de la nature sauvage (le Grand Nord) |
| *On the Road*, Jack Kerouac | 1957 | La **Beat Generation** traverse l’Amérique en voiture |

> Aux États-Unis, « aller vers l’Ouest » est un mythe fondateur : la **Frontier** était la ligne mouvante entre le territoire colonisé et ce qu’on appelait la « wilderness » — une conquête qui s’est faite au prix de la dépossession des peuples amérindiens.

## Œuvre au programme : *Moon Palace* (Paul Auster, 1989)
Le narrateur, **Marco Stanley Fogg**, porte un nom d’explorateurs : **Marco** Polo, Henry Morton **Stanley**, Phileas **Fogg** (*Le Tour du monde en quatre-vingts jours*). Orphelin, il étudie à Columbia, à New York, à la fin des années 1960.

1. **La chute** : son oncle Victor meurt ; Marco vend un à un les livres hérités, puis vit sans argent dans **Central Park**.
2. **La rencontre** : il devient le lecteur d’un vieil homme aveugle et tyrannique, **Thomas Effing**, qui lui raconte sa jeunesse de peintre partie dans le **désert de l’Ouest** (l’Utah).
3. **La révélation** : par Effing, Marco découvre le fils de celui-ci, **Solomon Barber**… qui se révèle être son propre père.
4. **Le départ** : seul, Marco traverse le pays à pied jusqu’à la **côte Pacifique**, où il regarde la lune se lever.

Le roman se passe au moment où l’homme marche sur la **Lune** (juillet **1969**) : la dernière frontière, et le titre vient du nom d’un restaurant chinois de Manhattan.

| Motif | Sens |
| La Lune | L’ailleurs, le rêve, la solitude |
| Le hasard | Les coïncidences qui relient les trois générations |
| Le désert de l’Ouest | L’épreuve où l’on se perd pour se trouver |

## Méthode : analyser un récit de voyage
1. **Motif du départ** : fuite, quête, nécessité ?
2. **Espace traversé** : ouvert ou clos, réel ou symbolique.
3. **Rencontres et épreuves** : ce qu’elles transforment.
4. **Retour** ou non-retour : ce que le voyageur a appris.

## Key vocabulary
| Anglais | Français |
| a quest | une quête |
| the wilderness | la nature sauvage |
| to set out, to set off | se mettre en route |
| the Frontier | la Frontière (limite de la colonisation de l’Ouest) |
| a castaway | un naufragé |`,
          },
          questions: [
            ['Qui a écrit *Moon Palace* (1989) ?', ['Jack Kerouac', 'Paul Auster', 'Don DeLillo', 'Cormac McCarthy'], 1, 'Un roman de la quête des origines, de New York au Pacifique.'],
            ['Le nom de Marco Stanley Fogg rend hommage à…', ['Trois explorateurs ou voyageurs', 'Trois présidents américains', 'Trois peintres', 'Trois écrivains new-yorkais'], 0, 'Marco Polo, Henry Morton Stanley et Phileas Fogg.'],
            ['Où Marco vit-il sans argent après avoir vendu ses livres ?', ['Dans le métro', 'Dans un motel du Nevada', 'Dans Central Park', 'À Brooklyn Bridge'], 2, 'La chute précède la rencontre avec Thomas Effing.'],
            ['Qui se révèle être le père de Marco ?', ['Thomas Effing', 'Oncle Victor', 'Kitty Wu', 'Solomon Barber'], 3, 'Le hasard relie trois générations d’hommes.'],
            ['Quel événement de juillet 1969 sert de toile de fond à *Moon Palace* ?', ['Le festival de Woodstock', 'Les premiers pas de l’homme sur la Lune', 'L’assassinat de Kennedy', 'La fin de la guerre du Viêt Nam'], 1, 'La Lune est la dernière frontière de l’aventure.'],
            ['Quelle expédition a traversé le continent américain jusqu’au Pacifique de 1804 à 1806 ?', ['Lewis et Clark', 'Cook', 'Hudson', 'Magellan'], 0, 'Commandée par le président Jefferson.'],
            ['Qui a formulé en 1893 la thèse de la Frontier ?', ['Mark Twain', 'Walt Whitman', 'Frederick Jackson Turner', 'Theodore Roosevelt'], 2, 'L’identité américaine serait née de la conquête de l’Ouest.'],
            ['Dans *Heart of Darkness* (1899), Marlow remonte le fleuve Congo à la recherche de Kurtz.', ['Vrai', 'Faux'], 0, 'Conrad montre l’aventure coloniale tourner au cauchemar.'],
            ['Quel roman de 1957 est emblématique de la Beat Generation ?', ['*The Great Gatsby*', '*The Catcher in the Rye*', '*The Grapes of Wrath*', '*On the Road*'], 3, 'Jack Kerouac traverse l’Amérique en voiture.'],
            ['*Robinson Crusoe* a été écrit par Jonathan Swift.', ['Vrai', 'Faux'], 1, 'C’est Daniel Defoe (1719) ; Swift a écrit *Gulliver’s Travels* (1726).'],
            ['Que signifie « the wilderness » ?', ['La nature sauvage', 'La sagesse', 'La solitude', 'La tempête'], 0, 'Mot clé du mythe de l’Ouest américain.'],
            ['D’où vient le titre *Moon Palace* ?', ['D’un tableau de Thomas Effing', 'D’un poème de Marco', 'Du nom d’un restaurant chinois de Manhattan', 'D’un hôtel de l’Utah'], 2, 'L’enseigne lumineuse devient pour Marco un signe du destin.'],
          ],
        },
        {
          titre: 'Ancrage et héritage : racines et mémoire',
          axe: 'Voyages, territoires, frontières',
          lecon: {
            titre: 'Roots, land and memory: Killers of the Flower Moon',
            cours: `Voyager, c’est aussi savoir d’où l’on vient. L’axe « Ancrage et héritage » interroge le lien à une **terre**, à une **langue**, à des **ancêtres** — et ce qui arrive quand on en est dépossédé. Le film *Killers of the Flower Moon* (**Martin Scorsese**, **2023**) est au programme.

## Écrire ses racines
| Œuvre | Auteur, date | L’héritage |
| « Digging » | Seamus Heaney, 1966 | Le poète irlandais creuse avec sa plume comme son père et son grand-père creusaient la terre |
| *Roots* | Alex Haley, 1976 | Un Afro-Américain remonte sa lignée jusqu’à un ancêtre enlevé en Afrique |
| *Beloved* | Toni Morrison, 1987 | La mémoire de l’esclavage revient hanter une famille |
| *Things Fall Apart* | Chinua Achebe, 1958 | Une société igbo avant et pendant l’arrivée des colons |

> Heaney, prix Nobel en 1995 : « Between my finger and my thumb / The squat pen rests. / I’ll dig with it. » L’héritage n’est pas imité, il est **transformé**.

## Les nations amérindiennes : la terre perdue
Au XIXe siècle, les nations amérindiennes sont repoussées vers des **réserves** ; l’**Indian Removal Act** de **1830** mène à la « **Trail of Tears** » (la Piste des larmes). Pour ces peuples, la terre n’est pas une marchandise mais un lien sacré aux ancêtres.

## Œuvre au programme : *Killers of the Flower Moon* (Martin Scorsese, 2023)
Adapté du livre-enquête de **David Grann** (2017), le film raconte le « **Reign of Terror** » des années **1920** dans l’**Oklahoma**.

| Élément | Ce qu’il faut savoir |
| La nation **Osage** | Chassée vers une terre aride, elle y découvre du **pétrole** et devient l’un des peuples les plus riches du monde |
| Les **headrights** | Les droits sur les revenus du pétrole se transmettent par héritage |
| **Mollie Burkhart** (Lily Gladstone) | Femme osage dont la famille est assassinée un à un |
| **Ernest Burkhart** (Leonardo DiCaprio) | Son mari, blanc, qui participe au complot |
| **William Hale** (Robert De Niro) | L’oncle d’Ernest, notable « ami des Osage », qui orchestre les meurtres |
| Le **Bureau of Investigation** | L’ancêtre du FBI enquête : une de ses premières grandes affaires |

Le mécanisme est glaçant : **épouser**, puis **tuer**, pour **hériter**. Le film ne cache pas le rôle des Blancs ordinaires (médecins, notaires, tuteurs légaux imposés aux Osage).

Scorsese choisit de raconter l’histoire du point de vue d’Ernest et de Mollie, pas de l’enquêteur ; à la fin, il apparaît lui-même dans une émission de radio qui raconte l’affaire comme un divertissement — une manière de s’interroger sur **qui a le droit de raconter** cette histoire.

## Méthode : étudier un héritage dans un document
1. **Quelle terre, quelle langue, quelle mémoire** sont en jeu ?
2. **Qui transmet, qui reçoit, qui est dépossédé ?**
3. **Comment l’œuvre répare** : témoigner, nommer les morts, donner la parole.
4. **Quel point de vue** : de l’intérieur ou de l’extérieur de la communauté ?

## Key vocabulary
| Anglais | Français |
| heritage, legacy | l’héritage, le patrimoine |
| ancestors | les ancêtres |
| to inherit, an heir | hériter, un héritier |
| a reservation | une réserve (amérindienne) |
| to dispossess | déposséder |
| Native Americans, First Nations | les Amérindiens, les Premières Nations |`,
          },
          questions: [
            ['Qui a réalisé *Killers of the Flower Moon* (2023) ?', ['Steven Spielberg', 'Martin Scorsese', 'Clint Eastwood', 'Quentin Tarantino'], 1, 'Adapté du livre-enquête de David Grann (2017).'],
            ['Quelle nation amérindienne est au cœur du film ?', ['Les Cherokee', 'Les Sioux', 'Les Osage', 'Les Navajo'], 2, 'Elle découvre du pétrole sous sa terre, en Oklahoma.'],
            ['Pourquoi les Osage sont-ils devenus très riches dans les années 1920 ?', ['Grâce au pétrole découvert sur leur terre', 'Grâce à l’or de Californie', 'Grâce au commerce de fourrures', 'Grâce aux casinos'], 0, 'Les droits sur le pétrole (headrights) se transmettaient par héritage.'],
            ['Quel est le mécanisme des meurtres dans le film ?', ['Voler les puits de nuit', 'Épouser, puis tuer, pour hériter', 'Truquer des élections', 'Incendier les réserves'], 1, 'D’où le rôle d’Ernest, le mari de Mollie.'],
            ['Qui orchestre les meurtres sous l’apparence d’un « ami des Osage » ?', ['Ernest Burkhart', 'Tom White', 'Mollie Burkhart', 'William Hale'], 3, 'Joué par Robert De Niro.'],
            ['Le Bureau of Investigation, qui enquête sur l’affaire, est l’ancêtre du FBI.', ['Vrai', 'Faux'], 0, 'L’affaire osage est l’une de ses premières grandes enquêtes.'],
            ['Dans « Digging » (1966), avec quoi Seamus Heaney dit-il qu’il va creuser ?', ['Une bêche', 'Ses mains', 'Sa plume', 'Une charrue'], 2, 'Il prolonge le travail de son père et de son grand-père par l’écriture.'],
            ['Que raconte *Roots* d’Alex Haley (1976) ?', ['La conquête de l’Ouest', 'La recherche d’une lignée jusqu’à un ancêtre enlevé en Afrique', 'La guerre d’indépendance', 'L’histoire des Osage'], 1, 'Un livre qui a bouleversé la mémoire afro-américaine.'],
            ['Quelle loi de 1830 a conduit à la « Trail of Tears » ?', ['Le Homestead Act', 'Le Civil Rights Act', 'Le Dawes Act', 'L’Indian Removal Act'], 3, 'Des nations entières sont déportées vers l’ouest du Mississippi.'],
            ['Qui a écrit *Things Fall Apart* (1958) ?', ['Chinua Achebe', 'Wole Soyinka', 'Ngũgĩ wa Thiong’o', 'J. M. Coetzee'], 0, 'Le roman montre une société igbo face à l’arrivée des colons.'],
            ['Scorsese raconte l’histoire du point de vue de l’enquêteur du FBI.', ['Vrai', 'Faux'], 1, 'Il choisit le point de vue d’Ernest et de Mollie.'],
            ['Comment traduire « to inherit » ?', ['Habiter', 'Hériter', 'Hésiter', 'Déshériter'], 1, 'L’héritier se dit « an heir ».'],
          ],
        },
        {
          titre: 'Migration et exil : Brooklyn, entre deux rives',
          axe: 'Voyages, territoires, frontières',
          lecon: {
            titre: 'Leaving home: Ellis Island, Windrush and Brooklyn',
            cours: `Partir pour vivre mieux, et découvrir qu’on ne sera plus jamais tout à fait d’ici ni de là-bas : c’est le cœur de l’axe « Migration et exil ». *Brooklyn* (**Colm Tóibín**, **2009**) est au programme.

## Repères historiques
| Événement | Date | Ce qu’il faut savoir |
| La **Grande Famine** irlandaise | 1845-1852 | Environ un million de morts, plus d’un million d’émigrants, surtout vers les États-Unis |
| « The New Colossus », Emma Lazarus | 1883 | Le poème gravé sur le socle de la statue de la Liberté : « Give me your tired, your poor, / Your huddled masses yearning to breathe free » |
| **Ellis Island** | 1892-1954 | La porte d’entrée des immigrants à New York |
| L’**Empire Windrush** | 1948 | Le navire amène des Caribéens au Royaume-Uni : la « Windrush generation » |
| *The Lonely Londoners*, Sam Selvon | 1956 | Le Londres des immigrés caribéens, dans leur langue |

## Œuvre au programme : *Brooklyn* (Colm Tóibín, 2009)
Au début des années **1950**, **Eilis Lacey** vit à **Enniscorthy**, petite ville d’Irlande sans travail. Sa sœur aînée **Rose** et un prêtre, **Father Flood**, organisent son départ pour **Brooklyn**.

1. **La traversée et le mal du pays** : la solitude, les lettres, le **homesickness** qui la paralyse.
2. **L’installation** : une pension de jeunes filles, un emploi de vendeuse, des cours du soir de comptabilité.
3. **L’amour** : **Tony**, jeune plombier italo-américain ; ils se marient en secret.
4. **Le retour** : la mort de Rose la rappelle en Irlande. On la courtise (**Jim Farrell**), on la voit enfin comme quelqu’un.
5. **Le choix** : une commère, **Miss Kelly**, découvre son mariage. Eilis repart pour Brooklyn.

> Le roman montre que l’exil n’est pas un seul départ mais **deux** : on quitte son pays, puis, au retour, on découvre qu’on a changé. Eilis devient elle-même en apprenant à **choisir** — jusque-là, les autres choisissaient pour elle.

L’écriture est sobre, presque sans commentaire : les émotions d’Eilis se lisent dans les gestes et les silences. Le roman a été adapté au cinéma en 2015 (Saoirse Ronan).

## Parler de l’exil
| Mot | Nuance |
| **emigrant / immigrant** | Celui qui part / celui qui arrive : le même, vu des deux rives |
| **exile** | Départ contraint, sans retour possible |
| **refugee** | Personne qui fuit un danger, protégée par le droit international |
| **diaspora** | Communauté dispersée hors de sa terre d’origine |

## Méthode : étudier un récit de migration
1. **Pourquoi partir** : pauvreté, persécution, ambition, famille ?
2. **Le passage** : la traversée, la frontière, l’administration.
3. **L’arrivée** : langue, travail, communauté, rejet.
4. **L’identité** : double appartenance, retour impossible ou choisi.

## Key vocabulary
| Anglais | Français |
| homesickness | le mal du pays |
| to settle (in) | s’installer |
| to be torn between | être déchiré entre |
| a newcomer | un nouveau venu |
| to fit in | s’intégrer, trouver sa place |`,
          },
          questions: [
            ['Qui a écrit *Brooklyn* (2009) ?', ['Roddy Doyle', 'Colm Tóibín', 'Seamus Heaney', 'Sally Rooney'], 1, 'Romancier irlandais, né à Enniscorthy comme son héroïne.'],
            ['Comment s’appelle l’héroïne de *Brooklyn* ?', ['Eilis Lacey', 'Rose Flood', 'Mollie Burkhart', 'Ifemelu'], 0, 'Elle quitte l’Irlande au début des années 1950.'],
            ['Qui organise le départ d’Eilis pour Brooklyn ?', ['Tony et sa famille', 'Miss Kelly', 'Sa sœur Rose et Father Flood', 'Jim Farrell'], 2, 'Jusque-là, ce sont les autres qui choisissent pour elle.'],
            ['Quel est le métier de Tony ?', ['Policier', 'Docker', 'Comptable', 'Plombier'], 3, 'Jeune Italo-Américain, il épouse Eilis en secret.'],
            ['Pourquoi Eilis revient-elle en Irlande ?', ['La mort de sa sœur Rose', 'Un mariage arrangé', 'Un licenciement', 'Une expulsion'], 0, 'Le retour la confronte à ce qu’elle est devenue.'],
            ['À la fin du roman, Eilis reste définitivement en Irlande.', ['Vrai', 'Faux'], 1, 'Démasquée par Miss Kelly, elle repart pour Brooklyn.'],
            ['Que signifie « homesickness » ?', ['La maladie contractée en voyage', 'Le mal du pays', 'La peur de la maison', 'La fatigue du retour'], 1, 'Il paralyse Eilis pendant ses premiers mois à Brooklyn.'],
            ['Quel poème est gravé sur le socle de la statue de la Liberté ?', ['« The New Colossus »', '« Song of Myself »', '« O Captain! My Captain! »', '« America the Beautiful »'], 0, 'Emma Lazarus, 1883 : « Give me your tired, your poor… »'],
            ['Pendant quelles années Ellis Island a-t-elle accueilli les immigrants ?', ['1776-1812', '1920-1990', '1848-1865', '1892-1954'], 3, 'La porte d’entrée de millions d’immigrants à New York.'],
            ['Que désigne la « Windrush generation » ?', ['Les Irlandais partis après la Famine', 'Les soldats britanniques de 1945', 'Les Caribéens venus au Royaume-Uni à partir de 1948', 'Les pionniers de l’Ouest'], 2, 'Du nom du navire Empire Windrush, arrivé en 1948.'],
            ['La Grande Famine irlandaise a eu lieu de 1845 à 1852.', ['Vrai', 'Faux'], 0, 'Elle provoque un million de morts et une émigration massive.'],
            ['Comment traduire « to be torn between two countries » ?', ['Être déchiré entre deux pays', 'Être expulsé de deux pays', 'Être né dans deux pays', 'Voyager entre deux pays'], 0, 'Expression clé pour parler de double appartenance.'],
          ],
        },
        {
          titre: 'Americanah : race, retour et appartenance',
          axe: 'Voyages, territoires, frontières',
          lecon: {
            titre: 'Becoming Black in America: Adichie’s Americanah',
            cours: `« I came from a country where race was not an issue ; I did not think of myself as black and I only became black when I came to America. » Ainsi parle l’héroïne d’*Americanah* (**Chimamanda Ngozi Adichie**, **2013**), au programme limitatif.

## L’autrice
**Chimamanda Ngozi Adichie**, née en **1977** au Nigeria, écrivaine igbo installée entre Lagos et les États-Unis. Ses conférences sont célèbres : *The Danger of a Single Story* (**2009**), sur le danger de réduire un peuple à une seule histoire, et *We Should All Be Feminists* (2012).

## L’histoire
| Partie | Ce qui se passe |
| Lagos | **Ifemelu** et **Obinze** s’aiment au lycée ; les grèves bloquent les universités nigérianes |
| Les États-Unis | Ifemelu part étudier à Philadelphie ; pauvreté, humiliation, puis réussite |
| Londres | Obinze, privé de visa américain, vit **sans papiers** en Angleterre et finit expulsé |
| Le retour | Treize ans plus tard, Ifemelu rentre à Lagos ; Obinze est devenu riche et marié |

## Le blog d’Ifemelu
Aux États-Unis, Ifemelu tient un blog au titre ironique : *Raceteenth or Various Observations About American Blacks (Those Formerly Known as Negroes) by a Non-American Black*. Elle y décrit la race comme une **construction sociale** qu’elle a dû apprendre.

> Le roman sépare deux expériences qu’on confond souvent : être **Africain** aux États-Unis et être **Afro-Américain**. Ifemelu découvre une identité qu’on lui assigne de l’extérieur.

## Le titre
« **Americanah** » est, au Nigeria, un surnom moqueur pour celui qui revient des États-Unis avec des manières américaines — un accent forcé, des goûts nouveaux. Ifemelu redoute d’en être une, et s’interroge : **peut-on rentrer chez soi** quand on a changé ?

## Les grands thèmes
| Thème | Où on le lit |
| Les **cheveux** | Le roman s’ouvre dans un salon de tressage : lisser ou garder ses cheveux naturels, c’est un choix politique |
| La **langue** | Ifemelu abandonne puis reprend son accent américain |
| La **classe** | Réussite, argent et privilèges de la nouvelle élite de Lagos |
| L’**amour** | Le fil entre Ifemelu et Obinze, qui résiste aux continents |

## *Americanah* et *Brooklyn*
Les deux romans suivent une jeune femme partie seule pour l’Amérique, déchirée entre deux rives. Mais Eilis (années 1950) s’intègre dans une communauté blanche et catholique, tandis qu’Ifemelu (années 1990-2000) découvre que sa **couleur de peau** définit sa place. Comparer les deux est un excellent exercice de synthèse.

## Méthode : croiser migration et identité
1. **L’identité avant le départ** : comment le personnage se voyait.
2. **L’identité assignée** : ce que le pays d’accueil voit en lui.
3. **Les stratégies** : s’adapter, résister, écrire.
4. **Le retour** : ce qui a changé, en soi et dans le pays quitté.

## Key vocabulary
| Anglais | Français |
| race as a social construct | la race comme construction sociale |
| to be undocumented | être sans papiers |
| to be deported | être expulsé |
| a stereotype | un stéréotype |
| to belong, belonging | appartenir, l’appartenance |`,
          },
          questions: [
            ['Qui a écrit *Americanah* (2013) ?', ['Chinua Achebe', 'Zadie Smith', 'Chimamanda Ngozi Adichie', 'Toni Morrison'], 2, 'Écrivaine nigériane née en 1977.'],
            ['Comment s’appellent les deux amoureux du roman ?', ['Ifemelu et Obinze', 'Eilis et Tony', 'Estha et Rahel', 'Mollie et Ernest'], 0, 'Leur histoire traverse Lagos, l’Amérique et Londres.'],
            ['Dans quel pays Obinze vit-il sans papiers avant d’être expulsé ?', ['Les États-Unis', 'Le Canada', 'L’Afrique du Sud', 'Le Royaume-Uni'], 3, 'Privé de visa américain, il tente sa chance à Londres.'],
            ['Que désigne le mot « Americanah » au Nigeria ?', ['Un étudiant américain au Nigeria', 'Celui qui revient des États-Unis avec des manières américaines', 'Un plat typique de Lagos', 'Un visa de travail'], 1, 'Un surnom moqueur qu’Ifemelu redoute de mériter.'],
            ['Quelle conférence d’Adichie (2009) met en garde contre le fait de réduire un peuple à un seul récit ?', ['*We Should All Be Feminists*', '*I Have a Dream*', '*The Danger of a Single Story*', '*A Room of One’s Own*'], 2, 'Une seule histoire crée des stéréotypes.'],
            ['Ifemelu raconte qu’elle n’est « devenue noire » qu’en arrivant en Amérique.', ['Vrai', 'Faux'], 0, 'Au Nigeria, la race n’était pas une catégorie qui la définissait.'],
            ['Où s’ouvre le roman ?', ['Dans un avion', 'Dans un salon de tressage', 'Dans une université', 'Dans un bureau d’immigration'], 1, 'Les cheveux sont un fil politique de tout le roman.'],
            ['Par quel moyen Ifemelu analyse-t-elle la race aux États-Unis ?', ['Un blog', 'Un journal intime', 'Un podcast', 'Des lettres à Obinze'], 0, 'Son blog au titre ironique la fait connaître.'],
            ['Quelle différence le roman met-il en évidence ?', ['Entre Anglais et Américains', 'Entre riches et pauvres de Lagos seulement', 'Entre Irlandais et Italiens', 'Entre être Africain et être Afro-Américain aux États-Unis'], 3, 'Deux expériences qu’on confond souvent.'],
            ['À la fin, Ifemelu reste définitivement aux États-Unis.', ['Vrai', 'Faux'], 1, 'Elle rentre à Lagos après treize ans et y retrouve Obinze.'],
            ['Comment traduire « to be undocumented » ?', ['Être sans papiers', 'Être mal informé', 'Être illettré', 'Être anonyme'], 0, 'C’est la situation d’Obinze à Londres.'],
            ['Quel sens donner à « belonging » ?', ['La possession', 'L’appartenance', 'Le bagage', 'La nostalgie'], 1, 'Mot clé des œuvres sur la migration.'],
          ],
        },
        {
          titre: 'The God of Small Things : les frontières invisibles',
          axe: 'Voyages, territoires, frontières',
          lecon: {
            titre: 'Love Laws and the legacy of Empire',
            cours: `Certaines frontières ne figurent sur aucune carte : celles de la **caste**, de la classe, de la religion. *The God of Small Things* (**Arundhati Roy**, **1997**), au programme, raconte ce qui arrive à ceux qui les franchissent.

## L’Inde après l’Empire
| Repère | Date | Ce qu’il faut savoir |
| Le **British Raj** | 1858-1947 | L’Inde gouvernée directement par la Couronne britannique |
| L’**indépendance** et la **Partition** | 1947 | L’Inde et le Pakistan se séparent ; violences et déplacements de millions de personnes |
| *Midnight’s Children*, Salman Rushdie | 1981 | Des enfants nés à minuit le jour de l’indépendance ; prix Booker |
| *The God of Small Things* | 1997 | **Prix Booker 1997**, premier roman d’Arundhati Roy |

## Le roman
**Ayemenem**, au **Kerala** (sud-ouest de l’Inde), dans une famille **chrétienne syrienne** qui tient une fabrique de conserves, *Paradise Pickles & Preserves*.

| Personnage | Son rôle |
| **Estha** et **Rahel** | Des jumeaux de sept ans, séparés après le drame, réunis à trente et un ans |
| **Ammu** | Leur mère, divorcée, donc sans statut dans la famille |
| **Velutha** | Un menuisier **intouchable** (paravan), talentueux, qu’Ammu aime |
| **Sophie Mol** | La cousine anglaise venue en visite, qui se noie |
| Baby Kochamma | La grand-tante rancunière qui déclenche la catastrophe |

Le récit circule entre **1969** (le drame) et **1993** (le retour de Rahel), par fragments, sans ordre chronologique : on connaît l’issue dès le début, on apprend **comment** peu à peu.

## Les « Love Laws »
Le cœur du roman : les lois qui disent « **who should be loved, and how. And how much.** » Ammu et Velutha les enfreignent : une femme de caste haute et un intouchable. La punition sera d’une violence extrême, avec la complicité de la police et même du Parti communiste local.

> Le titre oppose les « Big Things » (l’Histoire, la caste, la politique) aux « **Small Things** » (un geste, un regard, une nuit). Velutha est le dieu des petites choses : les grandes finissent par l’écraser.

## Une langue d’enfant
Roy écrit à hauteur des jumeaux : mots coupés ou collés (« Later », « Bus Stop »), majuscules inattendues (« Things Can Change in a Day »), mots lus à l’envers. L’anglais de l’ancien colonisateur est **réinventé** : c’est un geste postcolonial.

## Méthode : lire une frontière invisible
1. **Nommer la frontière** : caste, classe, genre, religion, langue.
2. **Qui la franchit, et pourquoi ?**
3. **Qui la garde** : famille, institution, police, parti ?
4. **Comment la forme** (fragments, langue) traduit la blessure.

## Key vocabulary
| Anglais | Français |
| caste, an untouchable | la caste, un intouchable |
| the Partition | la Partition (Inde-Pakistan, 1947) |
| postcolonial | postcolonial |
| to transgress | transgresser |
| a taboo | un tabou |`,
          },
          questions: [
            ['Qui a écrit *The God of Small Things* (1997) ?', ['Salman Rushdie', 'Arundhati Roy', 'Kiran Desai', 'Jhumpa Lahiri'], 1, 'C’est son premier roman, couronné par le prix Booker.'],
            ['Dans quel État de l’Inde se déroule le roman ?', ['Le Kerala', 'Le Bengale', 'Le Pendjab', 'Le Rajasthan'], 0, 'À Ayemenem, dans une famille chrétienne syrienne.'],
            ['Qui est Velutha ?', ['Le père des jumeaux', 'Un policier', 'Un menuisier intouchable qu’Ammu aime', 'Le cousin anglais'], 2, 'Il est le « dieu des petites choses ».'],
            ['Que disent les « Love Laws » ?', ['Qui doit se marier avant trente ans', 'Comment célébrer un mariage', 'Qui peut hériter de la maison', 'Qui doit être aimé, comment, et combien'], 3, 'Ammu et Velutha les enfreignent en s’aimant malgré la caste.'],
            ['Comment s’appellent les jumeaux du roman ?', ['Estha et Rahel', 'Ifemelu et Obinze', 'Sophie et Ammu', 'Chacko et Baby'], 0, 'Séparés après le drame, ils se retrouvent à trente et un ans.'],
            ['Le roman suit un ordre strictement chronologique.', ['Vrai', 'Faux'], 1, 'Il circule entre 1969 et 1993, par fragments.'],
            ['Que devient Sophie Mol, la cousine anglaise ?', ['Elle épouse Chacko', 'Elle se noie', 'Elle rentre en Angleterre', 'Elle devient religieuse'], 1, 'Sa noyade déclenche la catastrophe.'],
            ['En quelle année ont lieu l’indépendance de l’Inde et la Partition ?', ['1919', '1965', '1857', '1947'], 3, 'L’Inde et le Pakistan se séparent dans la violence.'],
            ['Quel roman de Salman Rushdie (1981) suit des enfants nés à l’heure de l’indépendance ?', ['*The Satanic Verses*', '*Midnight’s Children*', '*A Passage to India*', '*Shame*'], 1, 'Il a reçu le prix Booker.'],
            ['Que désignent les « Small Things » du titre ?', ['Les objets de la fabrique', 'Les enfants seulement', 'Les gestes et moments intimes, face aux grandes forces de l’Histoire', 'Les petits villages du Kerala'], 2, 'Les « Big Things » finissent par écraser les petites.'],
            ['Arundhati Roy réinvente la langue anglaise avec des mots coupés, collés ou lus à l’envers.', ['Vrai', 'Faux'], 0, 'Un geste postcolonial : l’anglais de l’ancien colonisateur est réapproprié.'],
            ['Comment traduire « to transgress » ?', ['Transmettre', 'Transformer', 'Traverser un pont', 'Transgresser'], 3, 'Franchir une limite interdite.'],
          ],
        },
        {
          titre: 'The Caretaker : la pièce comme territoire',
          axe: 'Voyages, territoires, frontières',
          lecon: {
            titre: 'Pinter’s room: menace, silence and power',
            cours: `Un territoire peut tenir dans une seule pièce encombrée. *The Caretaker* (**Harold Pinter**, créée à Londres en **1960**), au programme, montre trois hommes qui se disputent un lieu — et une place.

## Harold Pinter
Dramaturge britannique (1930-2008), **prix Nobel de littérature en 2005**. *The Caretaker* est son premier grand succès.

## La situation
Une chambre en désordre, dans une maison de l’ouest de Londres. Un vieux seau pend au plafond pour recueillir une fuite.

| Personnage | Ce qu’il veut |
| **Aston** | L’aîné, calme, lent ; il bricole et rêve de construire un **abri de jardin** (a shed) |
| **Mick** | Son frère cadet, propriétaire de la maison, imprévisible, ironique |
| **Davies** | Un vagabond qu’Aston recueille ; il se fait aussi appeler **Bernard Jenkins** |

## L’intrigue
1. Aston ramène chez lui Davies, sauvé d’une bagarre, et lui offre un lit.
2. Mick surgit, menace Davies, puis lui propose d’être le **gardien** (the caretaker) de la maison. Aston lui fait la même offre.
3. Davies tente de **monter les frères l’un contre l’autre** pour garder sa place.
4. À la fin de l’acte II, Aston raconte dans un long monologue son internement et les **électrochocs** qu’il a subis.
5. Les deux frères se retrouvent ; Davies, qui a trop joué, est **chassé**.

## Les papiers de Sidcup
Davies répète qu’il doit aller à **Sidcup** récupérer ses papiers d’identité, confiés à quelqu’un « il y a quinze ans ». Il n’y va jamais : il attend qu’il fasse beau, qu’on lui trouve de bonnes chaussures. Sidcup est l’horizon qui ne se rejoint pas, **l’identité qu’on ne prouve pas**.

## L’art de Pinter
| Procédé | Effet |
| La **comedy of menace** (expression du critique Irving Wardle) | On rit, mais une menace flotte sans qu’on sache d’où elle vient |
| Les **pauses** et **silences** indiqués par l’auteur | Ce qu’on ne dit pas pèse plus que ce qu’on dit |
| Les **répétitions** et les dialogues absurdes | Le langage sert à se défendre ou à dominer, pas à communiquer |
| Le **passé invérifiable** | Aucun personnage ne peut prouver ce qu’il raconte |

> Dans *The Caretaker*, la chambre est un **territoire** : qui y dort, qui en a la clé, qui peut y rester. Les rapports de force se jouent au mot près — et celui qui n’a pas de lieu à lui finit dehors.

L’adjectif « **Pinteresque** » est entré dans la langue anglaise pour désigner ce climat de menace diffuse, de silences lourds et de dialogues en apparence banals.

## Méthode : analyser une scène de théâtre
1. **L’espace** : décor, objets, entrées et sorties.
2. **Le rapport de force** : qui domine, qui cède, à quel moment ça bascule ?
3. **Le non-dit** : pauses, silences, sous-entendus.
4. **L’effet sur le spectateur** : rire, malaise, pitié.

## Key vocabulary
| Anglais | Français |
| a tramp | un vagabond |
| a caretaker | un gardien, un concierge |
| menace, menacing | la menace, menaçant |
| a pause, a silence | une pause, un silence |
| a power struggle | un rapport de force |`,
          },
          questions: [
            ['Qui a écrit *The Caretaker* (1960) ?', ['Samuel Beckett', 'Tom Stoppard', 'John Osborne', 'Harold Pinter'], 3, 'Dramaturge britannique, prix Nobel de littérature en 2005.'],
            ['Combien de personnages compte *The Caretaker* ?', ['Deux', 'Trois', 'Cinq', 'Sept'], 1, 'Aston, Mick et Davies.'],
            ['Quel faux nom Davies utilise-t-il ?', ['Bernard Jenkins', 'John Smith', 'Jim Farrell', 'Tom White'], 0, 'Son identité reste impossible à vérifier.'],
            ['Où Davies dit-il devoir aller chercher ses papiers ?', ['À Brighton', 'À Liverpool', 'À Sidcup', 'À Dublin'], 2, 'Il n’y va jamais : l’identité qu’on ne prouve pas.'],
            ['Que rêve de construire Aston ?', ['Une maison de campagne', 'Un abri de jardin', 'Un bateau', 'Une boutique'], 1, 'The shed : un projet qui ne se réalise jamais.'],
            ['Dans son monologue de la fin de l’acte II, Aston raconte les électrochocs qu’il a subis.', ['Vrai', 'Faux'], 0, 'Un moment rare de confidence dans la pièce.'],
            ['Que désigne l’expression « comedy of menace » ?', ['Une comédie musicale', 'Une tragédie en vers', 'Une farce sans enjeu', 'Une comédie où plane une menace diffuse'], 3, 'L’expression est du critique Irving Wardle.'],
            ['Comment se termine la pièce pour Davies ?', ['Il devient gardien de la maison', 'Il est chassé par les deux frères', 'Il part à Sidcup', 'Il épouse la voisine'], 1, 'Il a voulu monter les frères l’un contre l’autre.'],
            ['Chez Pinter, les pauses et silences sont indiqués par l’auteur et comptent autant que les répliques.', ['Vrai', 'Faux'], 0, 'Le non-dit pèse plus que ce qui est dit.'],
            ['Que désigne l’adjectif « Pinteresque » ?', ['Un décor luxueux', 'Un climat de menace diffuse et de silences lourds', 'Un style poétique en vers', 'Un humour purement burlesque'], 1, 'Le mot est entré dans la langue anglaise.'],
            ['Qui est le propriétaire de la maison ?', ['Mick', 'Aston', 'Davies', 'Un voisin absent'], 0, 'Le frère cadet, imprévisible et ironique.'],
            ['Que signifie « a power struggle » ?', ['Une coupure de courant', 'Une lutte des classes', 'Un rapport de force', 'Un effort physique'], 2, 'Toute la pièce est un combat pour une place.'],
          ],
        },

        // ─────────────────────────── MÉTHODES DE L’ÉPREUVE ───────────────────────────
        {
          titre: 'Réussir la synthèse de documents',
          axe: 'Méthodes de l’épreuve',
          lecon: {
            titre: 'Writing a synthesis, step by step',
            cours: `La synthèse est le cœur de l’épreuve écrite de LLCER : **16 points sur 20**, à rédiger **en anglais**, en **environ 500 mots**. C’est un exercice de mise en relation, pas de résumé.

## Le format de l’écrit (3 h 30)
| Partie | Tâche | Points |
| 1 | Synthèse d’un dossier de **trois ou quatre documents** (textes littéraires, articles, image), guidée par **deux ou trois consignes** | 16 |
| 2 | **Traduction** vers le français d’un passage d’environ 500 signes **ou transposition** en français des idées d’un texte | 4 |

Le dossier renvoie à une thématique et à un axe du programme ; il peut contenir un extrait d’une œuvre au programme limitatif.

## Ce qu’on attend
> Une synthèse **croise** les documents : elle ne les présente pas l’un après l’autre. Chaque paragraphe répond à une idée et fait dialoguer au moins deux documents.

| À faire | À éviter |
| Répondre aux consignes, dans l’ordre | Commenter chaque document séparément |
| Citer brièvement, entre guillemets, en indiquant la source | Recopier de longs passages |
| Utiliser des connecteurs logiques | Donner son opinion hors de propos |
| Rester dans les 500 mots environ | Réciter un cours sans lien avec le dossier |

## La méthode en six étapes
1. **Lire les consignes** avant les documents : elles disent ce qu’il faut chercher.
2. **Identifier chaque document** : nature, auteur, date, point de vue (tableau au brouillon).
3. **Surligner** les idées qui répondent à chaque consigne, avec une couleur par consigne.
4. **Trouver les liens** : échos, oppositions, évolutions entre documents.
5. **Bâtir le plan** : une introduction qui présente le dossier et sa problématique, une partie par consigne, une conclusion qui ouvre.
6. **Rédiger et relire** : accords, temps, prépositions, orthographe.

## Exemple travaillé
Consigne : *« Show how the documents present the experience of arriving in a new country. »*

« While Eilis, in Colm Tóibín’s *Brooklyn* (doc. A), experiences homesickness as a silent paralysis, the Windrush migrants photographed in 1948 (doc. B) appear confident, dressed in their Sunday best. **Yet** both documents suggest that the first days abroad are a time of vulnerability, **as** the newspaper article (doc. C) makes clear. »

Deux documents sont mis en relation dès la première phrase, un troisième nuance.

## Les connecteurs indispensables
| Fonction | Connecteurs |
| Ajouter | moreover, furthermore, in addition |
| Opposer | whereas, while, however, on the other hand |
| Concéder | although, even though, admittedly |
| Conclure | therefore, thus, all in all |
| Comparer | similarly, likewise, in the same way |

## Les pièges classiques
1. Oublier une consigne : la synthèse est incomplète.
2. Paraphraser sans analyser : on attend le **sens** du document.
3. Mal identifier le point de vue (ironie, narrateur non fiable).
4. Oublier de nommer les documents (doc. A, doc. B…) : le correcteur doit voir les liens.

## Key vocabulary
| Anglais | Français |
| both documents | les deux documents |
| to echo | faire écho à |
| to shed light on | éclairer |
| to highlight | souligner |
| in contrast to | par contraste avec |`,
          },
          questions: [
            ['Sur combien de points la synthèse est-elle notée à l’écrit de LLCER ?', ['10', '12', '16', '20'], 2, 'La traduction ou transposition vaut les 4 points restants.'],
            ['Quelle longueur vise la synthèse ?', ['Environ 150 mots', 'Environ 500 mots', 'Environ 1 000 mots', 'Au moins 2 pages'], 1, 'Il faut rester dans ces bornes : c’est aussi une compétence évaluée.'],
            ['Combien de temps dure l’épreuve écrite de LLCER en terminale ?', ['3 h 30', '2 heures', '4 heures', '1 h 30'], 0, 'Synthèse et traduction/transposition dans le même temps.'],
            ['Une bonne synthèse présente les documents l’un après l’autre.', ['Vrai', 'Faux'], 1, 'Elle les croise : chaque paragraphe fait dialoguer plusieurs documents.'],
            ['Que faut-il lire en premier ?', ['Le document le plus long', 'Le document iconographique', 'Les sources', 'Les consignes'], 3, 'Elles disent ce qu’il faut chercher dans le dossier.'],
            ['Combien de documents compte généralement le dossier ?', ['Trois ou quatre', 'Un seul', 'Six à huit', 'Dix'], 0, 'Textes littéraires, articles, parfois une image.'],
            ['Quel connecteur exprime une concession ?', ['Therefore', 'Moreover', 'Although', 'Similarly'], 2, 'Although : bien que.'],
            ['Quel connecteur sert à comparer deux documents semblables ?', ['However', 'Likewise', 'Thus', 'Whereas'], 1, 'Likewise : de même.'],
            ['Dans une synthèse, il faut citer brièvement et indiquer la source du document.', ['Vrai', 'Faux'], 0, 'Doc. A, doc. B… : le correcteur doit voir les liens.'],
            ['Que signifie « to shed light on » ?', ['Éteindre', 'Éclairer, mettre en lumière', 'Cacher', 'Contredire'], 1, 'Très utile pour montrer qu’un document en éclaire un autre.'],
            ['Quel est le rôle de l’introduction d’une synthèse ?', ['Donner son avis personnel', 'Résumer le premier document', 'Réciter le cours', 'Présenter le dossier et sa problématique'], 3, 'Elle annonce l’enjeu commun aux documents.'],
            ['Quelle erreur coûte le plus cher ?', ['Utiliser « moreover »', 'Oublier de répondre à une consigne', 'Écrire une conclusion courte', 'Citer un document entre guillemets'], 1, 'La synthèse est guidée par les consignes : en oublier une la rend incomplète.'],
          ],
        },
        {
          titre: 'Traduire ou transposer un passage',
          axe: 'Méthodes de l’épreuve',
          lecon: {
            titre: 'From English into French: translation and transposition',
            cours: `La seconde partie de l’écrit vaut **4 points** et se fait **en français**. Le sujet propose soit une **traduction**, soit une **transposition** : il faut savoir faire les deux.

## Deux exercices différents
| | Traduction | Transposition |
| Quoi ? | Un passage d’environ **500 signes** tiré d’un texte du dossier | Rendre compte **en français** des idées principales d’un texte (ou d’un passage) |
| Ce qu’on attend | La fidélité au sens **et** au ton, dans un français correct | La compréhension fine et la clarté de la reformulation |
| Le piège | Le mot à mot | La paraphrase anglaise traduite |

## Traduire : la méthode
1. **Lire tout le texte** pour saisir le contexte, le narrateur, le ton.
2. **Repérer les difficultés** : temps, expressions figées, jeux de mots.
3. **Traduire le sens, pas les mots** : une phrase anglaise peut devenir deux phrases françaises.
4. **Relire en français seul**, comme si l’anglais n’existait pas : la phrase doit sonner juste.
5. **Vérifier** qu’aucun mot n’a été oublié ni ajouté.

## Les pièges grammaticaux
| Anglais | Piège | Solution |
| Le **prétérit** (« She walked ») | Le passé composé partout | Passé simple ou imparfait dans un récit littéraire |
| Le **present perfect** (« I have lived here for ten years ») | Le passé | « J’habite ici depuis dix ans » (présent français) |
| Le **passif** (« He was given a book ») | Calque maladroit | « On lui donna un livre » |
| La **forme en -ing** (« She came running ») | « Elle vint courant » | « Elle arriva en courant » |
| Les **verbes à particule** (« to tiptoe out ») | Oublier la particule | « sortir sur la pointe des pieds » (chassé-croisé) |

## Les faux amis
| Anglais | Veut dire | Et non |
| actually | en fait | actuellement (currently) |
| eventually | finalement | éventuellement (possibly) |
| sensible | raisonnable | sensible (sensitive) |
| library | bibliothèque | librairie (bookshop) |
| to pretend | faire semblant | prétendre (to claim) |
| deception | la tromperie | la déception (disappointment) |

> Le **chassé-croisé** est la marque d’une bonne traduction : « He swam across the river » devient « Il traversa la rivière à la nage ». L’anglais met le mouvement dans la particule, le français dans le verbe.

!> Traduire « actually » par « actuellement » est l’erreur la plus fréquente des copies : le correcteur la repère au premier coup d’œil.

## Transposer : la méthode
1. Relever les **idées principales** et leur enchaînement.
2. Les reformuler **avec ses propres mots**, en français, sans citer.
3. Garder le **point de vue** du texte (ironie, critique, émotion) sans le déformer.
4. Rester concis : on rend compte, on ne commente pas.

## Exemple
« I have never been back since. » → « Je n’y suis jamais retourné depuis. » Le present perfect exprime un bilan qui touche au présent ; le passé composé français convient ici, car il n’y a pas de durée qui continue.

## Key vocabulary
| Anglais | Français |
| a false friend | un faux ami |
| a phrasal verb | un verbe à particule |
| to render | rendre (un sens, un ton) |
| literal translation | la traduction littérale |
| an idiom | une expression idiomatique |`,
          },
          questions: [
            ['Combien de points vaut la traduction ou transposition ?', ['2', '4', '8', '16'], 1, 'La synthèse vaut les 16 autres points.'],
            ['Dans quelle langue rédige-t-on la traduction ou la transposition ?', ['En français', 'En anglais', 'Au choix', 'Dans les deux langues'], 0, 'On passe de l’anglais au français.'],
            ['Comment traduire « I have lived here for ten years » ?', ['J’ai vécu ici pendant dix ans', 'Je vivrai ici dix ans', 'J’habite ici depuis dix ans', 'J’avais habité ici dix ans'], 2, 'Le present perfect + for exprime une durée qui continue : présent en français.'],
            ['Que signifie « actually » ?', ['Actuellement', 'Activement', 'Exactement', 'En fait'], 3, 'Actuellement se dit « currently ».'],
            ['Que signifie « eventually » ?', ['Éventuellement', 'Finalement', 'Évidemment', 'Occasionnellement'], 1, 'Éventuellement se dit « possibly ».'],
            ['Comment traduire « He swam across the river » ?', ['Il traversa la rivière à la nage', 'Il nagea à travers la rivière', 'Il nageait la rivière', 'Il nagea contre la rivière'], 0, 'Chassé-croisé : le mouvement passe dans le verbe français.'],
            ['Une transposition consiste à traduire le texte mot à mot.', ['Vrai', 'Faux'], 1, 'Elle rend compte des idées principales, avec ses propres mots.'],
            ['Quelle longueur fait environ le passage à traduire ?', ['50 signes', '5 000 signes', '500 signes', '2 pages'], 2, 'Un passage court, qui demande de la précision.'],
            ['Dans un récit littéraire, le prétérit anglais se traduit souvent par…', ['Le futur', 'Le passé simple ou l’imparfait', 'Le présent uniquement', 'Le conditionnel'], 1, 'Le passé composé partout alourdit un texte littéraire.'],
            ['« Library » signifie « librairie ».', ['Vrai', 'Faux'], 1, 'Library = bibliothèque ; librairie = bookshop.'],
            ['Que signifie « to pretend » ?', ['Prétendre', 'Présenter', 'Préférer', 'Faire semblant'], 3, 'Prétendre (affirmer) se dit « to claim ».'],
            ['Quelle est la dernière étape d’une bonne traduction ?', ['Relire le français seul, pour qu’il sonne juste', 'Relire l’anglais', 'Compter les mots', 'Ajouter des explications'], 0, 'La traduction doit se lire comme un texte français.'],
          ],
        },
        {
          titre: 'L’oral : le dossier personnel et les œuvres au programme',
          axe: 'Méthodes de l’épreuve',
          lecon: {
            titre: 'Your personal portfolio and the 2026-2028 set works',
            cours: `L’oral de LLCER compte pour **la moitié de la note** de l’épreuve. Il dure **20 minutes, sans temps de préparation**, et repose sur un **dossier personnel** que tu construis toute l’année.

## Le déroulement
| Temps | Ce que tu fais |
| **10 minutes** au plus | Tu présentes ton dossier en anglais : tu justifies le choix des documents et tu en exprimes la **logique** |
| **10 minutes** | Tu échanges avec l’examinateur, qui te fait approfondir, préciser, défendre |

## Le dossier personnel
Il réunit des documents en lien avec les thématiques étudiées. Pour la LLCER anglais, il comporte **au moins quatre documents** (quatre à six), dont :
- **au moins une des œuvres intégrales** étudiées en classe (un extrait) ;
- des **textes littéraires** ;
- **au plus deux œuvres d’art visuel** (tableau, affiche, extrait de film, photographie…) ;
- éventuellement un document d’une autre nature (article, discours…).

Tous les documents viennent du **monde anglophone**. Le dossier doit porter **une problématique** : c’est elle qui en fait un tout, pas une collection.

## Le programme limitatif 2026-2027 et 2027-2028
Chaque année, la classe étudie **trois œuvres intégrales** (deux œuvres littéraires et une œuvre filmique), **une par thématique**, choisies par le professeur dans cette liste (BO n° 21 du 21 mai 2026).

| Œuvres littéraires | Auteur, date |
| *Americanah* | Chimamanda Ngozi Adichie, 2013 |
| *The Handmaid’s Tale* | Margaret Atwood, 1985 |
| *Pride and Prejudice* | Jane Austen, 1813 |
| *Moon Palace* | Paul Auster, 1989 |
| *Boyhood: Scenes from Provincial Life* | J. M. Coetzee, 1997 |
| *The Caretaker* | Harold Pinter, 1960 |
| *The God of Small Things* | Arundhati Roy, 1997 |
| *Brooklyn* | Colm Tóibín, 2009 |

| Œuvres filmiques | Réalisateur, date |
| *Much Ado About Nothing* | Kenneth Branagh, 1993 |
| *The Piano* | Jane Campion, 1993 |
| *12 Angry Men* | Sidney Lumet, 1957 |
| *Killers of the Flower Moon* | Martin Scorsese, 2023 |

## Construire son dossier : la méthode
1. **Choisir une question** qui t’intéresse vraiment, rattachée à un axe (par exemple : « How can silence be a form of expression? »).
2. **Partir de l’œuvre intégrale** et chercher des documents qui la prolongent, la contredisent, l’éclairent.
3. **Varier** les époques, les genres, les supports.
4. **Préparer l’enchaînement** : pourquoi ce document après celui-là ?
5. **S’entraîner à voix haute**, sans lire : l’examinateur évalue la parole en continu **et** l’interaction.

> Exemple de dossier sur l’axe « L’expression des émotions » : un extrait de *The Piano* (la scène des touches), le Sonnet 18 de Shakespeare, un poème d’Emily Dickinson, une photographie de Dorothea Lange, un article sur la langue des signes. Problématique : **what do we say when words fail?**

## Le niveau attendu
B2 visé en fin de terminale, et C1 pour certaines compétences : une langue riche, nuancée, et des références culturelles précises.

## Key vocabulary
| Anglais | Français |
| my portfolio | mon dossier |
| to account for a choice | justifier un choix |
| to draw a parallel | établir un parallèle |
| to build on | s’appuyer sur, prolonger |
| a set work | une œuvre au programme |`,
          },
          questions: [
            ['Combien de temps dure l’oral de LLCER en terminale ?', ['10 minutes', '30 minutes', '45 minutes', '20 minutes'], 3, '10 minutes de présentation au plus, puis un échange.'],
            ['Dispose-t-on d’un temps de préparation avant l’oral ?', ['Oui, 30 minutes', 'Non, aucun', 'Oui, 1 heure', 'Oui, 10 minutes'], 1, 'On s’appuie sur le dossier préparé pendant l’année.'],
            ['Combien de documents au moins compte le dossier personnel en LLCER anglais ?', ['Quatre', 'Deux', 'Dix', 'Un'], 0, 'Quatre à six, dont au moins un extrait d’une œuvre intégrale.'],
            ['Combien d’œuvres d’art visuel au plus le dossier peut-il contenir ?', ['Aucune', 'Une', 'Quatre', 'Deux'], 3, 'Tableau, affiche, extrait de film, photographie…'],
            ['Combien d’œuvres intégrales la classe étudie-t-elle en terminale ?', ['Une', 'Trois', 'Six', 'Douze'], 1, 'Deux littéraires et une filmique, une par thématique.'],
            ['Laquelle de ces œuvres est au programme limitatif 2026-2028 ?', ['*The Great Gatsby*', '*Jane Eyre*', '*Brooklyn*', '*1984*'], 2, 'Le roman de Colm Tóibín (2009) figure parmi les huit œuvres littéraires.'],
            ['Quel film de Sidney Lumet figure au programme ?', ['*12 Angry Men*', '*Network*', '*Serpico*', '*Dog Day Afternoon*'], 0, 'Un huis clos de 1957 sur le doute raisonnable.'],
            ['Le dossier personnel peut contenir des documents sans lien avec le monde anglophone.', ['Vrai', 'Faux'], 1, 'Tous les documents viennent du monde anglophone.'],
            ['Qu’est-ce qui fait l’unité du dossier ?', ['Une problématique', 'Un seul auteur', 'Une même époque', 'Un même genre'], 0, 'C’est elle qui en fait un tout, pas une collection.'],
            ['Quel niveau est visé en fin de terminale ?', ['A2', 'B1', 'B2, et C1 pour certaines compétences', 'C2'], 2, 'Une langue riche, nuancée, avec des références précises.'],
            ['*Killers of the Flower Moon* est une œuvre littéraire du programme.', ['Vrai', 'Faux'], 1, 'C’est une œuvre filmique (Martin Scorsese, 2023).'],
            ['Que signifie « to draw a parallel » ?', ['Dessiner une ligne', 'Tracer une frontière', 'Faire un plan', 'Établir un parallèle'], 3, 'Indispensable pour relier les documents du dossier.'],
          ],
        },
        {
          titre: 'Le vocabulaire de l’analyse : texte, image, film',
          axe: 'Méthodes de l’épreuve',
          lecon: {
            titre: 'The toolbox: literary, visual and film analysis',
            cours: `Analyser en anglais demande des mots précis. Cette fiche rassemble le vocabulaire qui sert à la synthèse comme à l’oral, pour les **textes**, les **images** et les **films**.

## Le texte : genres et formes
| Anglais | Français |
| a novel, a short story | un roman, une nouvelle |
| a play, a playwright | une pièce, un dramaturge |
| a poem, a stanza, a line | un poème, une strophe, un vers |
| an essay, a speech | un essai, un discours |
| an excerpt, an extract | un extrait |

## La narration
| Anglais | Français |
| a first-person / third-person narrator | un narrateur à la 1re / 3e personne |
| an omniscient narrator | un narrateur omniscient |
| an unreliable narrator | un narrateur non fiable |
| free indirect speech | le discours indirect libre |
| a flashback / a flash-forward | un retour en arrière / une anticipation |
| the plot, the setting | l’intrigue, le cadre |

## Les figures de style
| Anglais | Définition | Exemple |
| a simile | comparaison avec *like* ou *as* | « lonely as a cloud » |
| a metaphor | comparaison sans outil | « Hope is the thing with feathers » |
| irony | dire le contraire de ce qu’on pense | *A Modest Proposal* |
| an oxymoron | deux termes opposés | « sweet sorrow » |
| alliteration | répétition de consonnes | « the fair breeze blew, the white foam flew » |
| understatement | la litote | « It’s a bit chilly » par −20 °C |

## L’image
| Anglais | Français |
| in the foreground / background | au premier plan / à l’arrière-plan |
| on the left / right-hand side | à gauche / à droite |
| in the top / bottom corner | dans le coin supérieur / inférieur |
| a caption | une légende |
| a cartoon, a caricature | un dessin humoristique, une caricature |

## Le film
| Anglais | Français |
| a shot, a close-up, a long shot | un plan, un gros plan, un plan d’ensemble |
| a high-angle / low-angle shot | une plongée / une contre-plongée |
| a tracking shot | un travelling |
| the soundtrack, a voice-over | la bande-son, une voix off |
| lighting, framing | l’éclairage, le cadrage |
| a sequence, a scene | une séquence, une scène |

> Une contre-plongée (**low-angle shot**) grandit le personnage ; une plongée (**high-angle shot**) l’écrase. Dans *12 Angry Men*, Lumet abaisse peu à peu la caméra : les murs et le plafond semblent se refermer sur les jurés.

## Méthode : décrire avant d’interpréter
1. **Identifier** le document : nature, auteur, date, source.
2. **Décrire** précisément avec le vocabulaire technique.
3. **Interpréter** : ce que le procédé produit (« this suggests… », « this conveys… »).
4. **Relier** au thème et aux autres documents.

## Les verbes de l’analyse
| Anglais | Français |
| to suggest, to imply | suggérer, laisser entendre |
| to convey | transmettre |
| to emphasize, to stress | souligner, insister sur |
| to depict, to portray | dépeindre, représenter |
| to contrast with | contraster avec |`,
          },
          questions: [
            ['Comment dit-on « une strophe » en anglais ?', ['A verse', 'A stanza', 'A line', 'A rhyme'], 1, 'A line désigne un vers ; a stanza, une strophe.'],
            ['Quelle figure compare avec « like » ou « as » ?', ['A metaphor', 'An oxymoron', 'A simile', 'An alliteration'], 2, '« Lonely as a cloud » (Wordsworth).'],
            ['Que désigne « a low-angle shot » ?', ['Une contre-plongée', 'Une plongée', 'Un gros plan', 'Un travelling'], 0, 'La caméra filme d’en bas : le personnage paraît grand.'],
            ['« Sweet sorrow » est un exemple d’oxymore.', ['Vrai', 'Faux'], 0, 'Deux termes opposés rapprochés (*Romeo and Juliet*).'],
            ['Comment traduire « in the foreground » ?', ['À l’arrière-plan', 'Au centre', 'En haut', 'Au premier plan'], 3, 'Son contraire : in the background.'],
            ['Que signifie « a caption » ?', ['Une capture', 'Une légende', 'Un chapitre', 'Un titre de film'], 1, 'Le texte qui accompagne une image.'],
            ['Qu’est-ce qu’un « unreliable narrator » ?', ['Un narrateur omniscient', 'Un narrateur absent', 'Un narrateur dont on ne peut croire le récit sans réserve', 'Un narrateur à la deuxième personne'], 2, 'Le lecteur doit reconstruire la vérité.'],
            ['Que désigne « a tracking shot » ?', ['Un plan fixe', 'Un travelling', 'Un fondu', 'Un contrechamp'], 1, 'La caméra se déplace pour suivre l’action.'],
            ['« A playwright » est un auteur de pièces de théâtre.', ['Vrai', 'Faux'], 0, 'Wright : artisan, celui qui fabrique.'],
            ['Quel verbe signifie « dépeindre, représenter » ?', ['To imply', 'To stress', 'To convey', 'To depict'], 3, 'Aussi : to portray.'],
            ['Qu’est-ce que l’understatement ?', ['L’exagération', 'La litote : dire moins pour suggérer plus', 'La répétition', 'La question rhétorique'], 1, '« It’s a bit chilly » par −20 °C.'],
            ['Quelle est la première étape de l’analyse d’un document ?', ['Donner son avis', 'Interpréter les symboles', 'Identifier sa nature, son auteur, sa date et sa source', 'Le comparer aux autres'], 2, 'On décrit et on situe avant d’interpréter.'],
          ],
        },
      ],
    },
  ],
}
