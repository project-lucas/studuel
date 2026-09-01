// EMC — Enseignement moral et civique, 6e → Terminale.
// Programme écrit par cycle : cycle 3 (6e), cycle 4 (5e-4e-3e), lycée (2de-Tle).

export default {
  slug: 'emc',
  nom: 'EMC',
  blocs: [
    {
      niveaux: ['6e'],
      chapitres: [
        {
          titre: 'Le respect d’autrui',
          lecon: {
            titre: 'Vivre ensemble au collège',
            cours: `Au collège, on ne choisit pas ses camarades : on apprend à vivre avec eux. C'est tout l'objet du **respect d'autrui**.

## Respecter, ce n'est pas être d'accord
Respecter quelqu'un, c'est reconnaître qu'il a la même valeur que soi, même quand on n'aime pas ses idées, son style ou sa façon d'être. On peut être en désaccord et rester respectueux : c'est même la base de la discussion.

## Les discriminations
Traiter quelqu'un moins bien à cause de son origine, de sa religion, de son handicap, de son sexe ou de son apparence, c'est une **discrimination**. La loi française l'interdit et la punit.

## Le harcèlement
Le harcèlement, ce sont des propos ou des comportements **répétés** qui blessent. Il n'est jamais la faute de la victime. Trois réflexes : en parler à un adulte, garder les preuves, ne pas rester seul. Le numéro 3018 est gratuit et confidentiel.

## Le rôle du témoin
Le témoin n'est jamais neutre : se taire, c'est laisser faire. Sans se mettre en danger, il peut soutenir la victime et prévenir un adulte.`,
          },
          questions: [
            ['Respecter quelqu’un, c’est…', ['Reconnaître qu’il a la même valeur que soi', 'Être d’accord avec lui', 'Devenir son ami', 'Ne jamais lui parler'], 0, 'Le respect n’exige pas l’accord : on peut être en désaccord et rester respectueux.'],
            ['Qu’est-ce qu’une discrimination ?', ['Traiter quelqu’un moins bien pour ce qu’il est', 'Une punition scolaire', 'Un désaccord d’opinion', 'Une règle du règlement intérieur'], 0, 'Origine, religion, handicap, sexe, apparence : la loi interdit ces différences de traitement.'],
            ['Ce qui caractérise le harcèlement, c’est la répétition.', ['Vrai', 'Faux'], 0, 'Un propos isolé blesse ; c’est la répétition qui fait le harcèlement.'],
            ['Quel numéro appeler en cas de harcèlement scolaire ?', ['3018', '15', '112', '3939'], 0, 'Le 3018 est le numéro national, gratuit, confidentiel, contre les violences numériques et le harcèlement.'],
            ['Le harcèlement est toujours un peu la faute de la victime.', ['Vrai', 'Faux'], 1, 'Jamais. La responsabilité est entièrement du côté de celui qui harcèle.'],
            ['Que peut faire un témoin de harcèlement ?', ['Soutenir la victime et prévenir un adulte', 'Rire pour ne pas être visé', 'Filmer la scène', 'Ne rien faire, ça ne le regarde pas'], 0, 'Le témoin n’est jamais neutre : se taire, c’est laisser faire.'],
            ['Le règlement intérieur du collège…', ['S’applique à tous les élèves et adultes', 'Ne concerne que les élèves punis', 'Est facultatif', 'Change chaque semaine'], 0, 'C’est la règle commune de l’établissement, connue de tous.'],
            ['On peut être en désaccord avec quelqu’un tout en le respectant.', ['Vrai', 'Faux'], 0, 'C’est exactement ce qui permet de discuter au lieu de se battre.'],
          ],
        },
        {
          titre: 'Les symboles de la République',
          lecon: {
            titre: 'Liberté, Égalité, Fraternité',
            cours: `La République française se reconnaît à ses **symboles** et se résume dans sa devise.

## La devise
**Liberté** : faire ses choix, dans les limites de la loi. **Égalité** : les mêmes droits pour tous, sans distinction. **Fraternité** : le lien qui fait qu'on se doit assistance entre citoyens.

## Les symboles
Le **drapeau tricolore** (bleu, blanc, rouge), la **Marseillaise** (hymne national, écrit par Rouget de Lisle en 1792), **Marianne** (le visage de la République), le **14 juillet** (fête nationale) et le **coq gaulois**.

## Une République indivisible, laïque, démocratique et sociale
C'est l'article 1 de la Constitution. **Indivisible** : une seule loi partout. **Laïque** : l'État ne favorise aucune religion. **Démocratique** : le pouvoir vient du peuple. **Sociale** : elle protège les plus fragiles.

## Où voit-on la République ?
Sur les frontons des mairies et des écoles, sur les papiers officiels, sur les timbres et les pièces de monnaie.`,
          },
          questions: [
            ['Quelle est la devise de la République française ?', ['Liberté, Égalité, Fraternité', 'Union, Force, Travail', 'Honneur, Patrie, Valeur', 'Paix, Travail, Patrie'], 0, 'Elle est inscrite sur les frontons des mairies et des écoles.'],
            ['Qui est Marianne ?', ['La représentation allégorique de la République', 'Une reine de France', 'La première présidente', 'L’auteure de la Marseillaise'], 0, 'Son buste est présent dans toutes les mairies.'],
            ['La Marseillaise est l’hymne national français.', ['Vrai', 'Faux'], 0, 'Écrite par Rouget de Lisle en 1792, elle devient hymne national en 1795.'],
            ['Que signifie « la République est laïque » ?', ['L’État ne favorise aucune religion', 'Les religions sont interdites', 'Seul le catholicisme est reconnu', 'Chacun doit avoir une religion'], 0, 'La laïcité garantit la liberté de croire ou de ne pas croire.'],
            ['Quelle est la date de la fête nationale ?', ['Le 14 juillet', 'Le 8 mai', 'Le 11 novembre', 'Le 1er mai'], 0, 'Elle commémore la prise de la Bastille (1789) et la Fête de la Fédération (1790).'],
            ['« Indivisible » signifie que la loi est la même partout en France.', ['Vrai', 'Faux'], 0, 'C’est l’article 1 de la Constitution.'],
            ['Que veut dire l’égalité en République ?', ['Les mêmes droits pour tous', 'Tout le monde gagne pareil', 'Tout le monde pense pareil', 'Personne ne travaille'], 0, 'L’égalité est celle des droits, pas celle des situations.'],
            ['Quelles sont les couleurs du drapeau français ?', ['Bleu, blanc, rouge', 'Bleu, blanc, vert', 'Rouge, blanc, noir', 'Bleu, jaune, rouge'], 0, 'Le bleu et le rouge sont les couleurs de Paris, le blanc celle de la royauté.'],
          ],
        },
        {
          titre: 'Droits et devoirs de l’élève',
          lecon: {
            titre: 'Être élève, c’est déjà être citoyen',
            cours: `Le collège est un lieu où l'on apprend à exercer des droits et à assumer des devoirs.

## Les droits de l'élève
Droit à l'**éducation** (l'école est obligatoire de 3 à 16 ans), droit d'être **protégé**, droit d'**exprimer son opinion**, droit d'être **représenté** par des délégués élus.

## Les devoirs de l'élève
Assiduité (venir et être à l'heure), travail, respect des personnes et des locaux, respect du règlement intérieur.

## Les délégués
Chaque classe élit deux délégués **au suffrage direct et à bulletin secret**. Ils portent la parole de la classe au conseil de classe. C'est un premier apprentissage du vote.

## Les instances du collège
Le **conseil de classe** examine la scolarité de chaque élève. Le **conseil d'administration** décide du fonctionnement de l'établissement. Le **CVC** (conseil de la vie collégienne) permet aux élèves de proposer des projets.`,
          },
          questions: [
            ['Jusqu’à quel âge l’instruction est-elle obligatoire en France ?', ['16 ans', '14 ans', '18 ans', '15 ans'], 0, 'Elle est obligatoire de 3 à 16 ans, puis une formation est obligatoire jusqu’à 18 ans.'],
            ['Comment sont désignés les délégués de classe ?', ['Élus par les élèves à bulletin secret', 'Désignés par le professeur principal', 'Tirés au sort', 'Choisis par le principal'], 0, 'C’est un vote, premier apprentissage de la démocratie.'],
            ['L’assiduité est un devoir de l’élève.', ['Vrai', 'Faux'], 0, 'Venir en cours et être à l’heure fait partie des obligations.'],
            ['Que fait le conseil de classe ?', ['Il examine la scolarité de chaque élève', 'Il vote le budget du collège', 'Il élit le principal', 'Il note les professeurs'], 0, 'Il réunit professeurs, délégués élèves et parents.'],
            ['Le droit d’exprimer son opinion permet d’insulter un camarade.', ['Vrai', 'Faux'], 1, 'La liberté d’expression s’arrête là où commencent l’injure et la diffamation.'],
            ['À quoi sert le CVC ?', ['À permettre aux élèves de proposer des projets', 'À sanctionner les élèves', 'À recruter les professeurs', 'À noter la cantine'], 0, 'Le conseil de la vie collégienne est une instance de participation des élèves.'],
            ['Le règlement intérieur est…', ['Un contrat commun à tout l’établissement', 'Une liste de punitions', 'Une loi votée au Parlement', 'Un document réservé aux professeurs'], 0, 'Il est présenté et signé en début d’année.'],
            ['Un droit va toujours de pair avec un devoir.', ['Vrai', 'Faux'], 0, 'Le droit d’être respecté implique le devoir de respecter.'],
          ],
        },
      ],
    },
    {
      niveaux: ['5e', '4e', '3e'],
      chapitres: [
        {
          titre: 'Libertés et laïcité',
          lecon: {
            titre: 'Les libertés fondamentales et la laïcité',
            cours: `La République garantit des libertés fondamentales, et la laïcité est la condition qui permet à toutes de coexister.

## Les grandes libertés
| La liberté | Ce qu'elle permet |
| De **conscience** | Croire, ou ne pas croire |
| D'**expression** | Dire et publier ce que l'on pense |
| De **réunion** | Se rassembler |
| D'**association** | Créer un groupe organisé |
| De la **presse** | Informer librement |
| D'**aller et venir** | Se déplacer |

Elles sont inscrites dans la **Déclaration des droits de l'homme et du citoyen de 1789** et dans la Constitution.

## Aucune liberté n'est illimitée
> « La liberté consiste à pouvoir faire tout ce qui ne nuit pas à autrui. » — article 4 de la DDHC.

| Ce qui n'est pas une opinion | Ce que c'est |
| L'**injure** | Un délit |
| La **diffamation** | Un délit |
| L'appel à la **haine** | Un délit |
| L'**apologie du terrorisme** | Un délit |

## La laïcité
Posée par la **loi de 1905** de séparation des Églises et de l'État.

| Le pilier | Son contenu |
| La **liberté de conscience** | Chacun croit ou ne croit pas |
| La **séparation** | L'État ne finance ni ne salarie aucun culte |
| L'**égalité** | Tous égaux devant la loi, quelles que soient leurs convictions |

## La laïcité à l'école
La **loi de 2004** interdit le port de signes religieux **ostensibles** dans les écoles, collèges et lycées publics.

> L'école doit rester un espace **neutre** où l'on apprend, pas un lieu de pression.`,
          },
          questions: [
            ['Quelle loi fonde la laïcité en France ?', ['La loi de 1905', 'La loi de 1789', 'La loi de 1958', 'La loi de 2004'], 0, 'La loi du 9 décembre 1905 sépare les Églises et l’État.'],
            ['La laïcité signifie que les religions sont interdites.', ['Vrai', 'Faux'], 1, 'Elle garantit au contraire la liberté de croire ou de ne pas croire.'],
            ['Selon l’article 4 de la DDHC, la liberté consiste à…', ['Faire tout ce qui ne nuit pas à autrui', 'Faire absolument tout', 'Obéir au chef de l’État', 'Suivre sa religion'], 0, 'La limite de ma liberté, c’est la liberté de l’autre.'],
            ['La diffamation est-elle protégée par la liberté d’expression ?', ['Non, c’est un délit', 'Oui, toujours', 'Oui, sur internet', 'Oui, entre amis'], 0, 'Injure, diffamation, incitation à la haine : ce sont des délits, pas des opinions.'],
            ['L’État français salarie-t-il les ministres du culte ?', ['Non, il ne finance ni ne salarie aucun culte', 'Oui, tous', 'Oui, seulement les prêtres', 'Oui, en Corse'], 0, 'C’est l’article 2 de la loi de 1905.'],
            ['La loi de 2004 concerne…', ['Les signes religieux ostensibles à l’école publique', 'Le port du casque à vélo', 'Le vote des femmes', 'La durée du travail'], 0, 'Elle s’applique aux écoles, collèges et lycées publics.'],
            ['La liberté de conscience inclut le droit de ne croire en rien.', ['Vrai', 'Faux'], 0, 'Croire, ne pas croire, changer de croyance : tout est protégé.'],
            ['Quel texte de 1789 énonce les libertés fondamentales ?', ['La Déclaration des droits de l’homme et du citoyen', 'La Constitution de la Ve République', 'Le Code civil', 'Le traité de Rome'], 0, 'Elle a valeur constitutionnelle aujourd’hui encore.'],
          ],
        },
        {
          titre: 'La justice en France',
          lecon: {
            titre: 'Comment fonctionne la justice',
            cours: `La justice tranche les conflits et sanctionne les infractions, selon des règles connues d'avance.

## Deux grandes justices
| La justice | Ce qu'elle traite | Un exemple |
| **Civile** | Les conflits entre particuliers | Un loyer impayé, un divorce |
| **Pénale** | Les infractions, et leur punition | Un vol, des violences |

## Les trois niveaux d'infraction
| L'infraction | Sa gravité | Le tribunal |
| La **contravention** | La moins grave | Le tribunal de **police** |
| Le **délit** | Vol, violences | Le tribunal **correctionnel** |
| Le **crime** | Meurtre, viol | La **cour d'assises**, avec un jury populaire |

## Les grands principes
| Le principe | Ce qu'il garantit |
| La **présomption d'innocence** | On est innocent tant qu'on n'est pas jugé coupable |
| Le droit à un **avocat** | Personne n'est seul face à la justice |
| Le droit de faire **appel** | Une décision peut être réexaminée |
| Un procès **public** et **contradictoire** | Chacun peut répondre à ce qui lui est reproché |

## La justice des mineurs
| Le point | Sa règle |
| Sa priorité | L'**éducation** plutôt que la punition |
| Son juge | Le **juge des enfants**, qui suit le mineur |
| L'âge de la responsabilité pénale | Dès **13 ans**, avec des peines réduites |`,
          },
          questions: [
            ['Quelle juridiction juge les crimes ?', ['La cour d’assises', 'Le tribunal de police', 'Le tribunal correctionnel', 'Le conseil de prud’hommes'], 0, 'Elle comprend un jury populaire tiré au sort.'],
            ['Un vol est un…', ['Délit', 'Crime', 'Contravention', 'Litige civil'], 0, 'Les délits sont jugés au tribunal correctionnel.'],
            ['La présomption d’innocence signifie qu’on est innocent tant qu’on n’a pas été jugé coupable.', ['Vrai', 'Faux'], 0, 'C’est un principe fondamental de tout procès équitable.'],
            ['La justice civile sert à…', ['Régler les conflits entre particuliers', 'Punir les crimes', 'Voter les lois', 'Contrôler la police'], 0, 'Divorce, loyers, contrats : elle tranche sans punir.'],
            ['À partir de quel âge un mineur peut-il être pénalement responsable ?', ['13 ans', '10 ans', '16 ans', '18 ans'], 0, 'En dessous, seules des mesures éducatives sont possibles.'],
            ['Faire appel, c’est demander que l’affaire soit rejugée.', ['Vrai', 'Faux'], 0, 'C’est un droit : une autre juridiction réexamine l’affaire.'],
            ['La justice des mineurs privilégie…', ['L’éducation sur la punition', 'La prison systématique', 'L’amende', 'Le renvoi de l’école'], 0, 'C’est le principe posé par l’ordonnance de 1945, repris par le code de la justice pénale des mineurs.'],
            ['Un procès contradictoire, c’est un procès où…', ['Chaque partie peut répondre à l’autre', 'Le juge décide seul sans écouter', 'Il n’y a pas d’avocat', 'Le public est interdit'], 0, 'Le contradictoire garantit l’équité du débat.'],
          ],
        },
        {
          titre: 'Citoyenneté et engagement',
          lecon: {
            titre: 'Être citoyen français et européen',
            cours: `La citoyenneté n'est pas seulement un statut : c'est une pratique.

## Nationalité et citoyenneté
| Le terme | Ce qu'il désigne |
| La **nationalité** | Un lien juridique avec un État |
| La **citoyenneté** | Elle y ajoute des **droits politiques** : voter, être élu |

| La voie d'accès à la nationalité | Son principe |
| Le **droit du sang** | Par filiation |
| Le **droit du sol** | Naissance et résidence en France |
| La **naturalisation** | Par décision, sous conditions |

## Le droit de vote
| Son caractère | Ce qu'il signifie |
| **Universel** | Tous les majeurs |
| **Égal** | Une personne, une voix |
| **Secret** | Personne ne sait pour qui l'on vote |

Voter à 18 ans suppose d'être **inscrit sur les listes électorales**. Les citoyens de l'Union européenne votent en France aux **municipales** et aux **européennes**.

## Les devoirs du citoyen
| Le devoir | Son contenu |
| Respecter la **loi** | La même pour tous |
| Payer l'**impôt** | Il finance les services publics |
| Être **juré** | Si l'on est tiré au sort |
| La **JDC** | Après le recensement à 16 ans |

## S'engager avant 18 ans
| L'engagement | Son âge |
| Délégué de classe | Dès la 6e |
| Association | À tout âge |
| **Service civique** | Dès **16 ans** |
| Sapeur-pompier volontaire | Dès 16 ans, comme jeune sapeur-pompier |

> La démocratie tient aussi à ceux qui s'engagent **entre** deux élections.`,
          },
          questions: [
            ['À quel âge se fait le recensement citoyen ?', ['16 ans', '15 ans', '18 ans', '14 ans'], 0, 'Il ouvre la voie à la Journée défense et citoyenneté.'],
            ['Le vote en France est secret et égal.', ['Vrai', 'Faux'], 0, 'Une personne, une voix, dans un isoloir : ce sont deux garanties distinctes.'],
            ['Le droit du sol permet de devenir français…', ['Par la naissance et la résidence en France', 'Par le mariage uniquement', 'Par les parents uniquement', 'Par examen'], 0, 'Le droit du sang, lui, passe par la nationalité des parents.'],
            ['Un citoyen européen non français peut voter en France…', ['Aux élections municipales et européennes', 'À toutes les élections', 'À aucune élection', 'À l’élection présidentielle'], 0, 'C’est une conséquence de la citoyenneté européenne.'],
            ['Payer l’impôt est un devoir du citoyen.', ['Vrai', 'Faux'], 0, 'L’article 13 de la DDHC prévoit une contribution commune, répartie selon les facultés de chacun.'],
            ['Le service civique est accessible dès…', ['16 ans', '18 ans', '21 ans', '25 ans'], 0, 'Il permet un engagement de plusieurs mois d’intérêt général.'],
            ['Être juré d’assises est…', ['Un devoir quand on est tiré au sort', 'Un métier', 'Un choix libre', 'Réservé aux avocats'], 0, 'Le jury populaire est tiré au sort sur les listes électorales.'],
            ['La citoyenneté se limite au fait de voter.', ['Vrai', 'Faux'], 1, 'Associations, bénévolat, délégation : l’engagement compte autant que le bulletin.'],
          ],
        },
      ],
    },
    {
      niveaux: ['2de', '1re', 'Tle'],
      chapitres: [
        {
          titre: 'La liberté d’expression et ses limites',
          lecon: {
            titre: 'Jusqu’où va la liberté d’expression ?',
            cours: `La liberté d’expression est une liberté fondamentale — et une liberté encadrée. Toute la matière du chapitre tient dans une seule question : où passe la ligne entre l’opinion et l’infraction ?

## Un socle juridique
Trois textes fondent le régime français, et tous les trois disent la même chose : la parole est libre AVANT, la sanction vient APRÈS, et seulement pour des abus définis par la loi.

| Texte | Date | Ce qu’il pose |
| Article 11 de la DDHC | 1789 | La libre communication des pensées est un droit précieux |
| Loi sur la liberté de la presse | 29 juillet 1881 | Pas de censure préalable, mais une liste fermée de délits |
| Article 10 de la CEDH | 1950 | La liberté d’expression et ses restrictions nécessaires |

> La censure préalable est interdite : c’est le **juge**, jamais l’administration, qui sanctionne un abus — et toujours après la publication.

## Ce que la loi interdit
Ces cinq abus ne sont pas des opinions minoritaires ou choquantes : ce sont des **infractions** définies par le code pénal.

| Infraction | Ce qu’elle vise |
| Diffamation | Imputer un fait précis qui porte atteinte à l’honneur |
| Injure | Une expression outrageante sans imputation de fait |
| Incitation à la haine | Provoquer à la haine raciale, religieuse ou sexuelle |
| Apologie du terrorisme | Présenter un acte terroriste comme légitime |
| Négationnisme | Contester l’existence de crimes contre l’humanité |

## Le test à appliquer
Devant un propos, la question n’est jamais « est-ce que je suis d’accord ? » mais :

1. Est-ce un **jugement** sur des idées, une œuvre, une politique ? → c’est une opinion, elle est libre, même blessante.
2. Est-ce un **fait précis et vérifiable** imputé à quelqu’un, qui l’atteint dans son honneur ? → diffamation possible.
3. Est-ce un **appel** à s’en prendre à un groupe pour ce qu’il est ? → incitation à la haine, l’infraction est constituée.

## Le cas du numérique
En ligne, la portée change tout : un message atteint des milliers de personnes en quelques heures et laisse une trace durable et indexée. La loi s’y applique **intégralement** — publier n’est pas discuter. Le **cyberharcèlement** est un délit aggravé, y compris quand chaque message pris isolément semble anodin : c’est la répétition, ou la meute, qui constitue l’infraction.

## Le débat démocratique
Une démocratie suppose que l’on puisse critiquer le pouvoir, caricaturer, se tromper. Restreindre la parole au nom du confort de chacun reviendrait à supprimer le désaccord, c’est-à-dire la politique elle-même.`,
          },
          questions: [
            ['Quelle loi fondatrice encadre la liberté de la presse en France ?', ['La loi du 29 juillet 1881', 'La loi de 1905', 'La loi de 2004', 'La loi de 1958'], 0, 'Elle pose la liberté de publier et définit les abus punissables.'],
            ['La diffamation consiste à…', ['Imputer un fait portant atteinte à l’honneur', 'Exprimer une opinion politique', 'Critiquer un film', 'Publier une caricature'], 0, 'C’est l’allégation d’un fait précis, pas un jugement de valeur.'],
            ['La censure préalable des publications est interdite en France.', ['Vrai', 'Faux'], 0, 'La sanction intervient après publication, et par le juge.'],
            ['L’apologie du terrorisme est…', ['Un délit', 'Une opinion protégée', 'Une contravention', 'Une liberté fondamentale'], 0, 'Elle est réprimée par le code pénal, y compris en ligne.'],
            ['Sur internet, la loi française sur l’expression ne s’applique pas.', ['Vrai', 'Faux'], 1, 'Elle s’applique intégralement, avec des circonstances aggravantes en ligne.'],
            ['Quel article de la DDHC proclame la libre communication des pensées ?', ['L’article 11', 'L’article 1', 'L’article 4', 'L’article 13'], 0, '« La libre communication des pensées et des opinions est un des droits les plus précieux de l’homme. »'],
            ['Critiquer publiquement un ministre est…', ['Licite : c’est le débat démocratique', 'Un délit d’offense', 'Interdit en période électorale', 'Réservé aux journalistes'], 0, 'La critique du pouvoir est au cœur de la liberté d’expression.'],
            ['Le cyberharcèlement est puni plus sévèrement que le harcèlement simple.', ['Vrai', 'Faux'], 0, 'La diffusion en ligne constitue une circonstance aggravante.'],
          ],
        },
        {
          titre: 'Démocratie et État de droit',
          lecon: {
            titre: 'Ce qui fait tenir une démocratie',
            cours: `Une démocratie ne se réduit pas au vote : une majorité élue qui pourrait tout faire ne serait pas une démocratie. Ce qui la tient, c’est l’**État de droit** — l’idée que le pouvoir lui-même obéit à des règles.

## La séparation des pouvoirs
Montesquieu, *De l’esprit des lois* (1748) : aucun des trois pouvoirs ne doit absorber les autres.

| Pouvoir | Qui l’exerce | Ce qu’il fait |
| Législatif | Le Parlement | Vote la loi et le budget |
| Exécutif | Président et gouvernement | Applique la loi, conduit la politique |
| Judiciaire | Les juges | Fait respecter la loi, tranche les litiges |

## La hiérarchie des normes
Une norme ne vaut que si elle respecte celles du dessus. La pyramide se lit du sommet vers la base :

1. La **Constitution** (1958) et le bloc de constitutionnalité — DDHC comprise.
2. Les **traités internationaux** ratifiés, dont le droit de l’Union européenne.
3. La **loi**, votée par le Parlement.
4. Les **règlements** : décrets, arrêtés, pris par l’exécutif.

> Le **Conseil constitutionnel** vérifie qu’une loi respecte la Constitution — et depuis 2010, il peut le faire même APRÈS son entrée en vigueur, sur renvoi d’un justiciable : c’est la question prioritaire de constitutionnalité.

## Les contre-pouvoirs
Ils n’appartiennent à aucun des trois pouvoirs, et c’est précisément leur fonction : rendre le pouvoir contestable.

| Contre-pouvoir | Ce qu’il rend possible |
| Presse indépendante | Révéler ce que le pouvoir tait |
| Justice indépendante | Juger sans consigne de l’exécutif |
| Associations et syndicats | Organiser la contestation collective |
| Autorités indépendantes | Défenseur des droits, CNIL : contrôler l’administration |

## Les fragilités
Abstention, défiance, désinformation, concentration des médias entre quelques mains : aucune de ces menaces ne se présente comme un coup d’État. La démocratie ne s’effondre pas, elle s’érode — elle n’est jamais acquise, elle s’entretient.`,
          },
          questions: [
            ['Qui a théorisé la séparation des pouvoirs ?', ['Montesquieu', 'Rousseau', 'Voltaire', 'Napoléon'], 0, 'Dans *De l’esprit des lois*, en 1748.'],
            ['Quel organe vérifie la conformité d’une loi à la Constitution ?', ['Le Conseil constitutionnel', 'Le Conseil d’État', 'La Cour de cassation', 'Le Sénat'], 0, 'Il peut être saisi avant promulgation, ou après via une QPC.'],
            ['La Constitution est la norme la plus élevée du droit français.', ['Vrai', 'Faux'], 0, 'C’est le sommet de la hiérarchie des normes.'],
            ['Le pouvoir législatif appartient…', ['Au Parlement', 'Au Président', 'Aux juges', 'Aux préfets'], 0, 'Assemblée nationale et Sénat votent la loi.'],
            ['Que signifie « QPC » ?', ['Question prioritaire de constitutionnalité', 'Quorum parlementaire commun', 'Question posée au Conseil', 'Quote-part constitutionnelle'], 0, 'Depuis 2010, tout justiciable peut contester une loi déjà en vigueur.'],
            ['Une presse indépendante est un contre-pouvoir.', ['Vrai', 'Faux'], 0, 'Elle informe et contrôle : sans elle, l’exécutif n’est pas surveillé.'],
            ['L’État de droit implique que…', ['Le pouvoir lui-même est soumis à la loi', 'La loi ne s’applique qu’aux citoyens', 'Les juges font la loi', 'La majorité peut tout'], 0, 'C’est la différence entre démocratie et pouvoir de la majorité sans limite.'],
            ['La CNIL protège…', ['Les données personnelles', 'La liberté de culte', 'Le droit de grève', 'Le patrimoine'], 0, 'C’est une autorité administrative indépendante.'],
          ],
        },
        {
          titre: 'Enjeux du numérique et de l’information',
          lecon: {
            titre: 'S’informer et se protéger en ligne',
            cours: `Le numérique a fait de chaque citoyen trois choses à la fois : un lecteur, un auteur, et une **donnée**. Les trois demandent des réflexes différents.

## Les données personnelles
Le **RGPD** (2018) ne se contente pas d’interdire : il donne cinq droits que l’on peut exercer, gratuitement, auprès de n’importe quelle plateforme.

| Droit | Ce que je peux exiger |
| Information | Savoir quelles données sont collectées, et pourquoi |
| Accès | Obtenir une copie de tout ce qui est détenu sur moi |
| Rectification | Faire corriger une donnée fausse |
| Effacement | Le droit à l’oubli : faire supprimer mes données |
| Opposition | Refuser un traitement, dont la prospection |

En France, la **CNIL** veille à leur application et peut sanctionner — les amendes se comptent en centaines de millions d’euros.

## L’économie de l’attention
Les plateformes ne vendent pas un service : elles vendent du **temps de cerveau** à des annonceurs. Leurs algorithmes mettent donc en avant ce qui fait réagir, pas ce qui est vrai — l’indignation retient mieux que la nuance. D’où les **bulles de filtre** : chacun finit par voir un monde qui confirme ce qu’il pense déjà, et croit que tout le monde pense comme lui.

> Une information qui provoque une émotion forte est un signal d’**alerte**, pas une preuve. C’est même souvent le signe qu’elle a été fabriquée pour circuler.

## Vérifier une information
Quatre réflexes, dans cet ordre, avant tout partage :

1. Identifier la **source** : qui publie, avec quel intérêt, sous quelle responsabilité ?
2. Chercher la **date** : une information vraie mais ancienne, ressortie hors contexte, est une désinformation.
3. Croiser avec **deux autres médias** indépendants du premier.
4. Faire une **recherche d’image inversée** : la photo illustre-t-elle vraiment cet événement ?

## Identité numérique
Ce qu’on publie laisse une trace durable, indexée et consultable — par un recruteur comme par n’importe qui. Le **droit à l’image** protège chacun : publier la photo d’une personne identifiable sans son accord est une atteinte à la vie privée, même si la photo est flatteuse et même entre amis.`,
          },
          questions: [
            ['Que garantit le RGPD ?', ['Des droits sur ses données personnelles', 'La gratuité d’internet', 'La liberté de la presse', 'Le droit d’auteur'], 0, 'Information, accès, rectification, effacement, opposition.'],
            ['Quelle autorité veille aux données personnelles en France ?', ['La CNIL', 'L’ARCOM', 'Le CSA', 'L’INSEE'], 0, 'Commission nationale de l’informatique et des libertés.'],
            ['Une information partagée par beaucoup de comptes est forcément vraie.', ['Vrai', 'Faux'], 1, 'La viralité mesure l’émotion suscitée, pas la véracité.'],
            ['Qu’est-ce qu’une bulle de filtre ?', ['Un environnement d’infos qui confirme nos opinions', 'Un antivirus', 'Un filtre photo', 'Un mode de paiement'], 0, 'Les algorithmes personnalisent le flux et enferment.'],
            ['Publier la photo d’un camarade sans son accord…', ['Porte atteinte à son droit à l’image', 'Est autorisé si elle est drôle', 'Est autorisé entre amis', 'Est autorisé après 24 h'], 0, 'Le droit à l’image découle du droit au respect de la vie privée.'],
            ['La recherche d’image inversée sert à vérifier l’origine d’une photo.', ['Vrai', 'Faux'], 0, 'Elle révèle souvent qu’une image ancienne est réutilisée hors contexte.'],
            ['Le premier réflexe face à une information choquante est…', ['De chercher sa source et sa date', 'De la partager vite', 'De la commenter', 'De la croire'], 0, 'L’émotion forte est justement le levier des fausses informations.'],
            ['Le droit à l’oubli permet de demander l’effacement de données.', ['Vrai', 'Faux'], 0, 'Il est prévu par le RGPD, sous conditions.'],
          ],
        },
      ],
    },
  ],
}
