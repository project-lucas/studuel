// EMC — Cycle 4 (5e, 4e, 3e) : LE PROGRAMME COMPLET (10 fiches).
//
// LE DÉFAUT. L'EMC de 5e, 4e et 3e n'avait que TROIS chapitres, partagés par les
// trois niveaux — « Libertés et laïcité », « La justice en France »,
// « Citoyenneté et engagement ». Trois fiches pour trois années.
//
// ⚠️ UN SEUL MODULE POUR TROIS NIVEAUX, et c'est le programme qui le veut. Le BO
// écrit l'EMC par CYCLE : les mêmes notions — liberté, égalité, laïcité, justice,
// citoyenneté, engagement — y sont reprises et approfondies de la 5e à la 3e,
// sans changer de découpage. C'est exactement la raison qui fait partager un
// module à la physique-chimie et aux SVT du cycle 4 (309, 310).
// La 6e, elle, relève du cycle 3 et a son module propre (`emc-6e`).
//
// CE QUE L'ÉLÈVE DOIT VOIR — les 3 chapitres du programme et leurs 10 fiches :
//   1. Respecter autrui                          (3)
//   2. Les valeurs et principes de la République  (4)
//   3. Construire une culture civique             (3)
//
// ⚠️ Ne JAMAIS générer avec `--slugs emc` : toujours `--modules emc-cycle4`.

export default {
  slug: 'emc',
  nom: 'EMC',

  titreMigration: 'EMC CYCLE 4 (5e, 4e, 3e) — LE PROGRAMME COMPLET (10 fiches)',

  motif: `CONSTAT : l'EMC de 5e, 4e et 3e n'avait que TROIS chapitres, les mêmes pour les
trois niveaux, hérités du premier jeu de données. Le lycée a reçu ses programmes
(230, 277, 284), le collège est resté aux seeds d'origine. Un élève qui révisait
les discriminations, la liberté d'expression et ses limites, la laïcité, la
justice des mineurs, le droit de vote, les médias ou la défense ne trouvait
presque RIEN.
Cette migration installe 10 fiches sous les 3 chapitres du programme, sur les
TROIS niveaux du cycle, et retire les 3 chapitres génériques.
UN SEUL MODULE POUR TROIS NIVEAUX : le BO écrit l'EMC par cycle, les mêmes
notions s'y approfondissant de la 5e à la 3e sans changer de découpage — comme
la physique-chimie (309) et les SVT (310) du cycle 4.
PÉRIMÈTRE : 5e, 4e et 3e — la 6e a son propre module (337).`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) porte le chapitre du programme, et
l'INSERT l'écrit pour les 10 fiches × 3 niveaux. Elle est REPRISE ici en ADD
COLUMN IF NOT EXISTS parce qu'on ne peut pas garantir que la 234 soit passée.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters et ne l'a rendu que colonne par colonne.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 3 chapitres hérités partent, sur les TROIS niveaux du cycle 4.

LE REPÈRE EST theme IS NULL, PAS LE TITRE : les 10 fiches neuves portent leur
chapitre de programme dès l'INSERT, les 3 anciennes n'en ont aucun. Le ménage
tourne AVANT les insertions et ne peut donc jamais mordre sur les neuves.
LE FILTRE DE NIVEAU EST UNE LISTE, ET C'EST LE POINT DÉLICAT de ce module : il
doit couvrir 5e, 4e ET 3e — les trois niveaux que le bloc alimente — sans
déborder sur la 6e (module 337) ni sur le lycée (230, 277, 284), qui ont leurs
propres programmes. Un IN (...) mal borné effacerait un travail déjà livré.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'emc'
   AND c.level IN ('5e', '4e', '3e')
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'emc'
   AND c.level IN ('5e', '4e', '3e')
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'emc'
   AND c.level IN ('5e', '4e', '3e')
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['5e', '4e', '3e'],
      chapitres: [
        // --- Chapitre 1 : Respecter autrui ---
        {
          titre: 'Les discriminations et la loi',
          axe: 'Respecter autrui',
          lecon: {
            titre: 'Quand la différence de traitement devient un délit',
            cours: `## La définition juridique
Une **discrimination** est une différence de traitement **défavorable**, fondée sur un **critère interdit par la loi**, dans un domaine que la loi protège — emploi, logement, école, santé, accès à un service.

## Les critères interdits
La loi française en compte plus de **vingt**, parmi lesquels : l’**origine**, le **sexe**, l’**âge**, le **handicap**, la **religion**, l’**orientation sexuelle**, l’**état de santé**, l’apparence physique, la situation de famille, les opinions politiques, l’appartenance syndicale, le lieu de résidence.

## Ce qui n’en est pas une
Toute différence n’est pas une discrimination. Refuser un emploi à quelqu’un qui n’a pas les compétences requises est légitime : le critère est **pertinent**. Le refuser à cause de son nom ne l’est pas.

## Directe et indirecte
- **Directe** : la différence est explicite — « on ne loue pas à des étudiants ».
- **Indirecte** : une règle apparemment neutre défavorise en fait un groupe — un critère de taille minimale sans lien avec le poste écarte surtout les femmes.

## Les sanctions
La discrimination est un **délit** : jusqu’à **3 ans de prison et 45 000 € d’amende**, davantage pour un service public.

> Le droit ne demande pas ce que la personne a voulu faire, mais ce qu’elle a fait. On peut discriminer sans se penser raciste ou sexiste — le résultat suffit à qualifier l’acte.

## Comment agir
- Le **Défenseur des droits**, autorité indépendante, peut être saisi **gratuitement** par toute personne.
- Le **testing** — comparer deux candidatures identiques sauf sur un critère — est une preuve admise par la justice.
- Associations, inspection du travail, plainte.

## À l’école
Refuser à un élève une sortie, un stage ou un rôle à cause de son origine, de sa religion ou de son handicap est une discrimination, et le droit s’y applique comme ailleurs.`,
          },
          questions: [
            ['Qu’est-ce qu’une discrimination au sens de la loi ?', ['Une différence de traitement défavorable fondée sur un critère interdit', 'Toute différence entre personnes', 'Une insulte', 'Une opinion'], 0, 'Dans un domaine protégé par la loi.'],
            ['Combien de critères de discrimination la loi française reconnaît-elle ?', ['Plus de vingt', 'Trois', 'Cinq', 'Dix'], 0, 'Origine, sexe, âge, handicap, religion, orientation sexuelle…'],
            ['Quelle différence de traitement n’est PAS une discrimination ?', ['Refuser un emploi à quelqu’un qui n’a pas les compétences requises', 'Refuser un logement à cause du nom', 'Refuser un stage à cause de la religion', 'Refuser un poste à cause de l’âge'], 0, 'Le critère doit être pertinent.'],
            ['Qu’est-ce qu’une discrimination indirecte ?', ['Une règle neutre en apparence qui défavorise en fait un groupe', 'Une discrimination explicite', 'Une insulte détournée', 'Une erreur administrative'], 0, 'Un critère de taille sans lien avec le poste, par exemple.'],
            ['Quelle peine encourt une discrimination ?', ['Jusqu’à 3 ans de prison et 45 000 € d’amende', 'Un avertissement', 'Aucune', 'Une simple amende de 100 €'], 0, 'Davantage pour un service public.'],
            ['Quelle autorité peut être saisie gratuitement ?', ['Le Défenseur des droits', 'Le Conseil constitutionnel', 'Le Sénat', 'La Cour des comptes'], 0, 'C’est une autorité indépendante.'],
            ['Qu’est-ce que le testing ?', ['Comparer deux candidatures identiques sauf sur un critère', 'Un entretien d’embauche', 'Un test de compétences', 'Un sondage'], 0, 'C’est une preuve admise par la justice.'],
            ['Il faut avoir eu l’intention de discriminer pour être condamné.', ['Vrai', 'Faux'], 1, 'Le droit regarde le résultat, pas l’intention.'],
          ],
        },
        {
          titre: 'La liberté d’expression et ses limites',
          axe: 'Respecter autrui',
          lecon: {
            titre: 'Tout dire n’est pas tout permettre',
            cours: `## Le principe
La **liberté d’expression** est garantie par la **Déclaration de 1789** (article 11) et par la loi du **29 juillet 1881** sur la liberté de la presse. Elle permet de penser, dire, écrire, publier, critiquer — y compris le pouvoir, les religions et les idées.

## Ce qu’elle protège vraiment
Elle ne protège pas seulement ce qui plaît. Une opinion consensuelle n’a besoin d’aucune protection : la liberté d’expression existe précisément pour ce qui **dérange**, choque ou heurte.

## Les limites, qui sont des délits
La loi ne punit pas les opinions, mais des **actes de parole** qui portent atteinte à autrui :
- l’**injure** et la **diffamation** (affirmer un fait faux qui porte atteinte à l’honneur) ;
- la **provocation à la haine** ou à la violence en raison de l’origine, la religion, le sexe, l’orientation sexuelle, le handicap ;
- l’**apologie du terrorisme** ;
- la **négation de crimes contre l’humanité** ;
- le **harcèlement** et les **menaces**.

> On peut critiquer une religion, une idée, un parti — c’est protégé. On ne peut pas appeler à s’en prendre à des **personnes** — c’est un délit. La frontière n’est pas entre le poli et l’impoli : elle est entre l’idée et la personne.

## En ligne
La loi s’applique **exactement de la même façon** sur internet. Un message posté est un écrit public : il est traçable par l’adresse IP, et le fait d’être derrière un pseudonyme ne protège de rien.

## Le droit à l’image et la vie privée
Photographier ou filmer quelqu’un et diffuser l’image **sans son accord** est interdit, même si l’image n’est pas insultante.

## La responsabilité
Publier, partager, retweeter, c’est **diffuser**. Le partage d’un contenu illicite engage aussi celui qui partage.`,
          },
          questions: [
            ['Quels textes garantissent la liberté d’expression en France ?', ['La Déclaration de 1789 et la loi de 1881', 'La Constitution de 1958 seule', 'Le Code civil', 'La loi de 1905'], 0, 'Article 11 de la Déclaration.'],
            ['Quelle est la limite essentielle de la liberté d’expression ?', ['On peut critiquer une idée, pas appeler à s’en prendre à des personnes', 'On ne peut rien critiquer', 'On peut tout dire', 'Il faut rester poli'], 0, 'La frontière est entre l’idée et la personne.'],
            ['Qu’est-ce que la diffamation ?', ['Affirmer un fait faux portant atteinte à l’honneur', 'Une insulte', 'Une critique', 'Une opinion politique'], 0, 'C’est un délit distinct de l’injure.'],
            ['La loi s’applique-t-elle de la même façon sur internet ?', ['Oui, exactement de la même façon', 'Non, internet est un espace libre', 'Seulement sur les réseaux français', 'Uniquement pour les majeurs'], 0, 'Le pseudonyme ne protège de rien.'],
            ['Peut-on diffuser la photo de quelqu’un sans son accord ?', ['Non, même si l’image n’est pas insultante', 'Oui si elle est flatteuse', 'Oui entre amis', 'Oui si on l’a prise soi-même'], 0, 'C’est le droit à l’image.'],
            ['Partager un contenu illicite engage-t-il celui qui partage ?', ['Oui, partager c’est diffuser', 'Non, seul l’auteur est responsable', 'Seulement si on le commente', 'Seulement si on l’a créé'], 0, 'Le partage est un acte de diffusion.'],
            ['Pourquoi la liberté d’expression protège-t-elle surtout ce qui dérange ?', ['Une opinion consensuelle n’a besoin d’aucune protection', 'Parce que la loi aime la provocation', 'Pour favoriser les journalistes', 'C’est un hasard historique'], 0, 'C’est le sens même de cette liberté.'],
            ['Critiquer une religion est un délit en France.', ['Vrai', 'Faux'], 1, 'Critiquer une idée est protégé ; appeler à la haine contre des personnes est un délit.'],
          ],
        },
        {
          titre: 'Le respect de la vie privée et l’identité numérique',
          axe: 'Respecter autrui',
          lecon: {
            titre: 'Ce que le réseau garde de vous',
            cours: `## Le droit
L’**article 9 du Code civil** protège la vie privée : « Chacun a droit au respect de sa vie privée. » Il couvre le domicile, la santé, la vie sentimentale, les convictions, l’image.

## L’identité numérique
C’est l’ensemble des traces qu’on laisse en ligne : ce qu’on **publie** volontairement, mais aussi ce que **d’autres publient** sur nous, et ce que les services **enregistrent** sans qu’on le voie — recherches, position, temps passé, achats.

## Les traces qu’on ne choisit pas
Un site connaît l’adresse IP, l’appareil, l’heure, la page d’où l’on vient. Les **cookies** suivent la navigation d’un site à l’autre pour construire un **profil publicitaire**. C’est le modèle économique de la plupart des services « gratuits ».

> Quand un service est gratuit, ce n’est pas un cadeau : ce qui est vendu, c’est l’attention et le profil de l’utilisateur.

## Le RGPD
Le **Règlement général sur la protection des données** (2018) donne des droits à chacun : savoir quelles données sont détenues, y **accéder**, les **corriger**, les **effacer** (droit à l’oubli), s’opposer à leur usage. En France, la **CNIL** veille à leur application et peut être saisie.

## L’âge
Le consentement autonome au traitement des données est fixé à **15 ans** en France ; en dessous, l’accord d’un parent est requis.

## La permanence
Ce qui est publié est **copiable** et **archivé**. Supprimer un message ne supprime pas les captures d’écran qu’il a produites. Une publication de collège peut ressortir dix ans plus tard, devant un employeur.

## Les réflexes
Réglages de confidentialité, mots de passe distincts, réfléchir avant de publier une photo d’autrui, ne jamais diffuser une image intime — c’est un délit lourdement puni.`,
          },
          questions: [
            ['Quel article protège la vie privée en France ?', ['L’article 9 du Code civil', 'L’article 1 de la Constitution', 'La loi de 1881', 'La loi de 1905'], 0, '« Chacun a droit au respect de sa vie privée. »'],
            ['Qu’est-ce que l’identité numérique ?', ['L’ensemble des traces laissées en ligne, volontaires ou non', 'Le pseudonyme choisi', 'La carte d’identité scannée', 'L’adresse e-mail'], 0, 'Y compris ce que d’autres publient sur nous.'],
            ['À quoi servent les cookies publicitaires ?', ['À suivre la navigation pour construire un profil', 'À accélérer le site', 'À sécuriser le mot de passe', 'À traduire les pages'], 0, 'C’est le modèle économique des services « gratuits ».'],
            ['Que garantit le RGPD ?', ['Accéder à ses données, les corriger, les effacer, s’y opposer', 'La gratuité des services', 'L’anonymat total', 'La suppression des publicités'], 0, 'En vigueur depuis 2018.'],
            ['Quelle autorité veille à la protection des données en France ?', ['La CNIL', 'Le Défenseur des droits', 'Le Conseil constitutionnel', 'L’ARCOM'], 0, 'Elle peut être saisie par toute personne.'],
            ['À quel âge peut-on consentir seul au traitement de ses données ?', ['15 ans', '13 ans', '18 ans', '16 ans'], 0, 'En dessous, l’accord d’un parent est requis.'],
            ['Supprimer une publication la fait-elle disparaître ?', ['Non : elle a pu être copiée et archivée', 'Oui, définitivement', 'Oui après 30 jours', 'Oui si on est mineur'], 0, 'Les captures d’écran subsistent.'],
            ['Un service gratuit ne coûte rien à l’utilisateur.', ['Vrai', 'Faux'], 1, 'Ce qui est vendu, c’est son attention et son profil.'],
          ],
        },

        // --- Chapitre 2 : Les valeurs et principes de la République ---
        {
          titre: 'La laïcité en France',
          axe: 'Les valeurs et principes de la République',
          lecon: {
            titre: 'Un principe d’organisation, pas une croyance',
            cours: `## Les trois piliers
1. La **liberté de conscience** : croire, ne pas croire, changer, pratiquer ou non.
2. La **séparation** de l’État et des religions : l’État ne reconnaît, ne salarie ni ne subventionne aucun culte.
3. L’**égalité** de tous les citoyens devant la loi, quelle que soit leur croyance.

## La loi de 1905
La **séparation des Églises et de l’État** en pose les termes. Elle garantit **à la fois** le libre exercice des cultes **et** la neutralité de l’État : ce sont les deux faces du même texte, et on en oublie souvent la première.

## Ce que la laïcité n’est pas
- Ce n’est pas l’**athéisme** d’État : l’État n’a pas d’opinion sur Dieu.
- Ce n’est pas l’effacement des religions de l’espace public : on peut porter un signe religieux dans la rue, exprimer sa foi, se réunir.
- Ce n’est pas une exception française honteuse : c’est un mode d’organisation qui vise l’égalité.

> La laïcité ne protège pas la République **contre** les religions. Elle protège chaque croyant du pouvoir des autres croyances — et l’incroyant de toutes.

## Où s’applique la neutralité
- Les **agents publics** — enseignants, policiers, employés de mairie — sont neutres **dans l’exercice de leurs fonctions**. Pas dans leur vie privée.
- Les **usagers** d’un service public sont libres, sauf exception prévue par la loi.

## Le cas de l’école publique
La loi du **15 mars 2004** interdit les signes religieux **ostensibles** aux élèves des écoles, collèges et lycées publics. Elle ne s’applique ni à l’université, ni à la rue, ni aux établissements privés sous contrat.

## Les exceptions territoriales
En **Alsace-Moselle**, allemandes en 1905, le **Concordat** est toujours en vigueur : certains cultes y sont reconnus et des enseignements religieux organisés. La laïcité française n’est donc pas parfaitement uniforme.`,
          },
          questions: [
            ['Quels sont les trois piliers de la laïcité ?', ['Liberté de conscience, séparation État-religions, égalité devant la loi', 'Interdiction, neutralité, sanction', 'Athéisme, tolérance, silence', 'Foi, tradition, ordre'], 0, 'Ils tiennent ensemble.'],
            ['Que garantit la loi de 1905 ?', ['À la fois la neutralité de l’État et le libre exercice des cultes', 'Uniquement la neutralité de l’État', 'L’interdiction des religions', 'Le financement des cultes'], 0, 'On oublie souvent la seconde face du texte.'],
            ['La laïcité est-elle l’athéisme d’État ?', ['Non : l’État n’a pas d’opinion sur Dieu', 'Oui', 'Oui depuis 2004', 'Cela dépend des régions'], 0, 'Il ne combat ni n’impose aucune croyance.'],
            ['Qui est tenu à la neutralité religieuse ?', ['Les agents publics dans l’exercice de leurs fonctions', 'Tous les citoyens partout', 'Les élèves dans la rue', 'Les commerçants'], 0, 'Pas dans leur vie privée.'],
            ['Où s’applique la loi du 15 mars 2004 ?', ['Écoles, collèges et lycées publics', 'Partout dans l’espace public', 'À l’université aussi', 'Dans les entreprises'], 0, 'Elle ne concerne ni la rue ni l’université.'],
            ['Quelle région connaît un régime particulier ?', ['L’Alsace-Moselle, sous Concordat', 'La Corse', 'La Bretagne', 'La Guyane seule'], 0, 'Elle était allemande en 1905.'],
            ['Que protège la laïcité, au fond ?', ['Chaque croyant du pouvoir des autres croyances, et l’incroyant de toutes', 'La République contre les religions', 'Les religions contre l’État', 'Les traditions nationales'], 0, 'C’est un principe d’égalité.'],
            ['On ne peut pas porter de signe religieux dans la rue en France.', ['Vrai', 'Faux'], 1, 'C’est autorisé : la loi de 2004 ne vise que les élèves des établissements publics.'],
          ],
        },
        {
          titre: 'La justice en France',
          axe: 'Les valeurs et principes de la République',
          lecon: {
            titre: 'Qui juge, comment, et avec quelles garanties',
            cours: `## Deux ordres de juridiction
- L’ordre **judiciaire** juge les litiges entre personnes et les infractions.
- L’ordre **administratif** juge les litiges entre les citoyens et l’**administration** (tribunal administratif, Conseil d’État).

## Le civil et le pénal
- Le **civil** tranche un conflit entre particuliers : divorce, dette, voisinage. Il n’y a pas de « coupable », mais un litige à régler.
- Le **pénal** sanctionne une infraction contre la société. Trois degrés :
  | infraction | tribunal | exemple |
  |---|---|---|
  | **contravention** | tribunal de police | excès de vitesse |
  | **délit** | tribunal correctionnel | vol, discrimination |
  | **crime** | cour d’assises / cour criminelle | meurtre, viol |

## Les grands principes
- La **présomption d’innocence** : on est innocent jusqu’à condamnation définitive.
- Les **droits de la défense** : être informé, assisté d’un avocat, se taire.
- Le **contradictoire** : chaque partie connaît et discute les preuves de l’autre.
- La **publicité** des débats, sauf exceptions.
- Le **double degré de juridiction** : le droit de faire **appel**.
- La **gratuité** de la justice et l’**aide juridictionnelle** pour les plus modestes.

> La présomption d’innocence n’est pas une politesse : elle est ce qui oblige l’accusation à prouver, plutôt que l’accusé à se disculper.

## La justice des mineurs
Elle est **spécifique**. Le **juge des enfants** privilégie l’**éducatif** sur le répressif. La responsabilité pénale suppose le **discernement** ; à partir de **13 ans**, une peine est possible, mais elle est atténuée — c’est l’**excuse de minorité**. À l’audience, les débats ne sont pas publics.

## Les acteurs
Le **juge** tranche, le **procureur** représente la société et poursuit, l’**avocat** défend, le **greffier** consigne. Les **jurés** — citoyens tirés au sort — siègent en cour d’assises.`,
          },
          questions: [
            ['Quels sont les deux ordres de juridiction ?', ['Judiciaire et administratif', 'Civil et pénal', 'Local et national', 'Public et privé'], 0, 'L’administratif juge les litiges avec l’administration.'],
            ['Quelle juridiction juge un délit ?', ['Le tribunal correctionnel', 'Le tribunal de police', 'La cour d’assises', 'Le tribunal administratif'], 0, 'Vol, discrimination.'],
            ['Que signifie la présomption d’innocence ?', ['On est innocent jusqu’à condamnation définitive', 'On doit prouver son innocence', 'Le juge choisit', 'Elle ne vaut que pour les mineurs'], 0, 'Elle oblige l’accusation à prouver.'],
            ['Qu’est-ce que le principe du contradictoire ?', ['Chaque partie connaît et discute les preuves de l’autre', 'Le juge contredit l’accusé', 'Les débats sont secrets', 'On peut faire appel'], 0, 'C’est une garantie du procès équitable.'],
            ['À partir de quel âge une peine est-elle possible pour un mineur ?', ['13 ans, avec une peine atténuée', '10 ans', '16 ans', '18 ans'], 0, 'C’est l’excuse de minorité.'],
            ['Qui privilégie l’éducatif dans la justice des mineurs ?', ['Le juge des enfants', 'Le procureur', 'Le greffier', 'Les jurés'], 0, 'Les débats n’y sont pas publics.'],
            ['Qui représente la société et engage les poursuites ?', ['Le procureur', 'L’avocat', 'Le greffier', 'Le juré'], 0, 'Le juge, lui, tranche.'],
            ['La justice civile désigne un coupable.', ['Vrai', 'Faux'], 1, 'Elle tranche un litige ; c’est le pénal qui sanctionne une infraction.'],
          ],
        },
        {
          titre: 'La citoyenneté française et européenne',
          axe: 'Les valeurs et principes de la République',
          lecon: {
            titre: 'Ce qu’être citoyen veut dire',
            cours: `## Nationalité et citoyenneté
La **nationalité** est le lien juridique avec un État. La **citoyenneté** ajoute la participation à la vie politique : voter, être élu, exercer certaines fonctions.

## Comment on devient français
- par **filiation** : au moins un parent français ;
- par **naissance et résidence** : né en France de parents étrangers, on devient français à 18 ans sous condition de résidence — c’est le **droit du sol**, dans sa forme française ;
- par **naturalisation** : après plusieurs années de résidence, un examen de langue et de connaissance des valeurs ;
- par **mariage**, sous conditions.

## Les droits du citoyen
- **politiques** : voter, être élu, adhérer à un parti ;
- **civils** : liberté d’expression, de circulation, de propriété, de réunion ;
- **sociaux** : éducation, santé, protection sociale.

## Les devoirs
Respecter la loi, **payer l’impôt**, être juré si l’on est tiré au sort, participer à la **Journée défense et citoyenneté**, se faire recenser à 16 ans.

> Les droits ne sont pas la contrepartie des devoirs : ils existent d’abord. Mais aucun ne tiendrait si personne ne remplissait les seconds — l’école, l’hôpital et la justice sont payés par l’impôt.

## La citoyenneté européenne
Tout ressortissant d’un État membre de l’**Union européenne** est aussi **citoyen européen**. Elle **s’ajoute** à la citoyenneté nationale, elle ne la remplace pas. Elle donne :
- la **libre circulation** et le droit de s’installer dans un autre État membre ;
- le droit de voter et d’être candidat aux élections **municipales** et **européennes** dans le pays où l’on réside ;
- la **protection consulaire** de n’importe quel État membre hors d’Europe ;
- le droit de pétition devant le Parlement européen.

## Le recensement et la JDC
À **16 ans**, le recensement est obligatoire ; il ouvre la **Journée défense et citoyenneté**, elle-même nécessaire pour s’inscrire au baccalauréat ou au permis de conduire.`,
          },
          questions: [
            ['Quelle différence entre nationalité et citoyenneté ?', ['La citoyenneté ajoute la participation à la vie politique', 'Aucune', 'La nationalité s’acquiert à 18 ans', 'La citoyenneté est européenne uniquement'], 0, 'Voter, être élu, exercer certaines fonctions.'],
            ['Comment devient-on français par le droit du sol ?', ['Né en France de parents étrangers, on le devient à 18 ans sous condition de résidence', 'Dès la naissance automatiquement', 'Par simple demande', 'À 13 ans'], 0, 'C’est la forme française du droit du sol.'],
            ['Quel devoir accompagne le tirage au sort ?', ['Être juré en cour d’assises', 'Voter', 'Payer une taxe', 'Servir dans l’armée'], 0, 'C’est une obligation civique.'],
            ['La citoyenneté européenne remplace-t-elle la citoyenneté nationale ?', ['Non, elle s’y ajoute', 'Oui', 'Elle la remplace après 5 ans', 'Elle est facultative'], 0, 'Elle est conditionnée à la nationalité d’un État membre.'],
            ['À quelles élections un citoyen européen peut-il voter dans son pays de résidence ?', ['Municipales et européennes', 'Présidentielle et législatives', 'Toutes', 'Aucune'], 0, 'Même s’il n’a pas la nationalité de ce pays.'],
            ['Que doit-on faire à 16 ans ?', ['Se faire recenser', 'Voter', 'Payer l’impôt', 'Choisir sa nationalité'], 0, 'Cela ouvre la Journée défense et citoyenneté.'],
            ['À quoi sert l’attestation de la JDC ?', ['Elle est nécessaire pour s’inscrire au bac ou au permis', 'À voter', 'À obtenir une carte d’identité', 'À rien d’administratif'], 0, 'C’est une pièce demandée.'],
            ['Les droits du citoyen sont la contrepartie de ses devoirs.', ['Vrai', 'Faux'], 1, 'Ils existent d’abord — mais rien ne tiendrait si les devoirs n’étaient pas remplis.'],
          ],
        },
        {
          titre: 'Voter : le droit de vote et les élections',
          axe: 'Les valeurs et principes de la République',
          lecon: {
            titre: 'Le geste qui fonde la démocratie',
            cours: `## Les caractères du vote
Le suffrage est **universel** (tous les citoyens majeurs), **égal** (une personne, une voix), **secret** (l’isoloir et l’enveloppe, depuis 1913) et **libre** (aucune pression).

## Les conditions
Être **français** (sauf municipales et européennes, ouvertes aux citoyens de l’UE résidents), avoir **18 ans**, être **inscrit** sur les listes électorales, jouir de ses droits civiques.

## Une conquête lente
1848 : suffrage universel **masculin**. **1944** : droit de vote des **femmes**, exercé pour la première fois en 1945. **1974** : majorité abaissée de 21 à **18 ans**. Rien de tout cela n’a été spontané.

## Les principales élections
| élection | on élit | durée |
|---|---|---|
| présidentielle | le président de la République | 5 ans |
| législatives | les députés | 5 ans |
| municipales | le conseil municipal, qui élit le maire | 6 ans |
| départementales / régionales | les conseillers | 6 ans |
| européennes | les députés européens | 5 ans |

## Les modes de scrutin
- **Majoritaire** : celui qui a le plus de voix l’emporte. Dégage des majorités nettes, mais laisse des voix sans représentation.
- **Proportionnel** : les sièges sont répartis selon les scores. Représente mieux la diversité, rend les majorités plus difficiles.
Aucun n’est neutre : le mode de scrutin **fabrique** une part du résultat.

## L’abstention
Ne pas voter est un droit, mais ce n’est pas un vote : le résultat est calculé sur les **suffrages exprimés**. Le **vote blanc** — enveloppe vide — est décompté séparément depuis 2014, sans entrer dans les exprimés. Le **vote nul** est un bulletin abîmé ou raturé.

> S’abstenir ne bloque rien : cela laisse simplement d’autres décider à sa place, avec un poids relatif plus grand.`,
          },
          questions: [
            ['Quels sont les quatre caractères du suffrage ?', ['Universel, égal, secret et libre', 'Public, censitaire, direct, obligatoire', 'Universel, indirect, payant, libre', 'Secret, masculin, égal, direct'], 0, 'Le secret est garanti par l’isoloir depuis 1913.'],
            ['Quand les femmes ont-elles obtenu le droit de vote en France ?', ['En 1944', 'En 1848', 'En 1918', 'En 1974'], 0, 'Exercé pour la première fois en 1945.'],
            ['Quand la majorité est-elle passée à 18 ans ?', ['En 1974', 'En 1944', 'En 1848', 'En 1958'], 0, 'Elle était auparavant à 21 ans.'],
            ['Qui les Français élisent-ils aux municipales ?', ['Le conseil municipal, qui élit ensuite le maire', 'Directement le maire', 'Le préfet', 'Le député'], 0, 'Le mandat est de 6 ans.'],
            ['Quelle est la caractéristique du scrutin proportionnel ?', ['Il répartit les sièges selon les scores', 'Le premier emporte tout', 'Il désigne un seul élu', 'Il est réservé aux européennes'], 0, 'Il représente mieux la diversité mais complique les majorités.'],
            ['Le vote blanc entre-t-il dans les suffrages exprimés ?', ['Non, il est décompté séparément depuis 2014', 'Oui', 'Il est interdit', 'Il compte comme une abstention'], 0, 'Le vote nul est un bulletin abîmé.'],
            ['Quelles élections sont ouvertes aux citoyens de l’UE résidant en France ?', ['Municipales et européennes', 'Présidentielle', 'Législatives', 'Toutes'], 0, 'Ils y votent sans être français.'],
            ['Le mode de scrutin est un détail technique sans effet sur le résultat.', ['Vrai', 'Faux'], 1, 'Il fabrique une part du résultat : aucun n’est neutre.'],
          ],
        },

        // --- Chapitre 3 : Construire une culture civique ---
        {
          titre: 'S’informer : médias, sources et esprit critique',
          axe: 'Construire une culture civique',
          lecon: {
            titre: 'Vérifier avant de croire, et avant de partager',
            cours: `## L’information et le reste
Une **information** est un fait **vérifié**, **sourcé**, **daté**, publié par quelqu’un qui en assume la responsabilité. Ce n’est ni une opinion, ni une rumeur, ni une publicité.

## Qui produit l’information
Le **journaliste** enquête, recoupe **au moins deux sources indépendantes**, et signe. Il engage la responsabilité de son média. Un compte anonyme qui relaie ne fait rien de tout cela.

## Les infox
Une **infox** (*fake news*) est une fausse information **diffusée volontairement**. Elle circule vite parce qu’elle est **faite pour** : elle vise l’émotion — la peur, la colère, l’indignation — et l’émotion fait partager avant de réfléchir.

> Un contenu qui vous met immédiatement en colère mérite une vérification immédiate. C’est précisément l’effet recherché.

## Les cinq questions à se poser
1. **Qui** publie ? Le site est-il identifiable (mentions légales) ?
2. **Quand** ? Une vraie photo peut illustrer un faux propos si elle a dix ans.
3. **D’où** vient l’info ? Remonte-t-on à une source première ?
4. **D’autres médias** sérieux la reprennent-ils ?
5. **Pourquoi** me la montre-t-on ? Qui a intérêt à ce que j’y croie ?

## Les outils
Recherche d’**image inversée**, sites de **fact-checking**, consultation des mentions légales, comparaison de plusieurs médias.

## La bulle de filtre
Les algorithmes montrent ce qui **retient** l’attention, donc ce qui ressemble à ce qu’on a déjà aimé. On finit par ne voir que ce qui confirme ses idées : c’est la **bulle de filtre**. En sortir demande d’aller chercher volontairement d’autres sources.

## La responsabilité
Partager une infox, même de bonne foi, c’est la diffuser. Le premier réflexe utile n’est pas de démentir : c’est de **ne pas relayer**.`,
          },
          questions: [
            ['Qu’est-ce qu’une information au sens journalistique ?', ['Un fait vérifié, sourcé, daté et assumé', 'Une opinion partagée', 'Un message viral', 'Une publicité'], 0, 'Le journaliste recoupe au moins deux sources indépendantes.'],
            ['Qu’est-ce qu’une infox ?', ['Une fausse information diffusée volontairement', 'Une erreur de journaliste', 'Une opinion minoritaire', 'Un article payant'], 0, 'Elle vise l’émotion pour se propager.'],
            ['Pourquoi les infox circulent-elles vite ?', ['Elles visent l’émotion, qui fait partager avant de réfléchir', 'Elles sont bien écrites', 'Elles sont gratuites', 'Elles sont courtes'], 0, 'Peur, colère, indignation.'],
            ['Quelle question faut-il se poser devant une information ?', ['Qui publie, quand, d’où elle vient, qui la reprend, à qui elle profite', 'Est-elle amusante ?', 'A-t-elle beaucoup de partages ?', 'Est-elle récente seulement ?'], 0, 'Le nombre de partages ne prouve rien.'],
            ['Quel outil permet de vérifier une photo ?', ['La recherche d’image inversée', 'Le correcteur orthographique', 'Le traducteur', 'Le comptage de partages'], 0, 'Une vraie photo peut illustrer un faux propos.'],
            ['Qu’est-ce que la bulle de filtre ?', ['Les algorithmes ne montrent que ce qui confirme nos idées', 'Un filtre anti-spam', 'Un réglage de confidentialité', 'Un logiciel de tri'], 0, 'En sortir demande d’aller chercher d’autres sources.'],
            ['Quel est le premier réflexe utile face à une infox ?', ['Ne pas la relayer', 'La démentir publiquement', 'La signaler à la police', 'La partager en commentant'], 0, 'Partager, même pour démentir, la diffuse.'],
            ['Un grand nombre de partages est un gage de fiabilité.', ['Vrai', 'Faux'], 1, 'Les infox sont précisément conçues pour être très partagées.'],
          ],
        },
        {
          titre: 'L’engagement et la solidarité',
          axe: 'Construire une culture civique',
          lecon: {
            titre: 'Faire quelque chose du monde où l’on vit',
            cours: `## Les formes de l’engagement
- **Associatif** : bénévolat dans une association loi 1901 — social, sportif, culturel, humanitaire, environnemental.
- **Syndical** : défendre des droits collectifs au travail.
- **Politique** : parti, campagne, mandat.
- **Citoyen** : pétition, manifestation, boycott, participation à un conseil de quartier.
- **Scolaire** : délégué, éco-délégué, CVC, association sportive, journal du collège.
- **Service civique** : à partir de **16 ans**, une mission d’intérêt général indemnisée, de 6 à 12 mois.

## La solidarité organisée
La France a bâti un système où le risque est **mutualisé** : la **Sécurité sociale** (1945), l’assurance chômage, les retraites, les aides au logement. Chacun cotise selon ses moyens et reçoit selon ses besoins.
Ce n’est pas de la charité : c’est un **droit**, financé par les cotisations et l’impôt.

> Payer l’impôt est un acte de solidarité, même quand on ne le vit pas ainsi : c’est ce qui paie l’école qu’on fréquente et l’hôpital qu’on espère ne pas fréquenter.

## La solidarité de proximité
Associations d’aide alimentaire, maraudes, aide aux devoirs, visites aux personnes isolées, dons du sang. Elles complètent le système public là où il n’atteint pas.

## Le bénévolat en France
Environ **20 millions** de personnes donnent du temps à une association. C’est l’une des formes d’engagement les plus répandues, et la plus accessible avant 18 ans.

## Ce que l’engagement demande
Du **temps**, de la **régularité**, et l’acceptation que les résultats soient lents et partagés. On ne s’engage pas pour être remercié.

## Et à l’échelle du monde
ONG, aide au développement, action humanitaire. Les **17 objectifs de développement durable** de l’ONU (2015) fixent un cap commun à l’horizon 2030.`,
          },
          questions: [
            ['À partir de quel âge peut-on faire un service civique ?', ['16 ans', '18 ans', '14 ans', '21 ans'], 0, 'Une mission d’intérêt général de 6 à 12 mois, indemnisée.'],
            ['En quelle année la Sécurité sociale est-elle créée ?', ['1945', '1905', '1968', '1981'], 0, 'Elle mutualise le risque.'],
            ['Comment fonctionne la solidarité organisée ?', ['Chacun cotise selon ses moyens et reçoit selon ses besoins', 'Chacun reçoit ce qu’il a versé', 'Elle repose sur les dons', 'Elle est réservée aux plus pauvres'], 0, 'C’est un droit, pas de la charité.'],
            ['Combien de personnes sont bénévoles en France ?', ['Environ 20 millions', 'Environ 1 million', 'Environ 5 millions', 'Environ 40 millions'], 0, 'C’est la forme d’engagement la plus répandue.'],
            ['Quelle forme d’engagement est accessible au collège ?', ['Délégué, éco-délégué, CVC, association sportive', 'Mandat politique', 'Syndicat', 'Service civique'], 0, 'On n’attend pas 18 ans pour agir.'],
            ['Qu’est-ce qu’une association loi 1901 ?', ['Un groupement à but non lucratif', 'Une entreprise', 'Un service de l’État', 'Un parti politique'], 0, 'Le bénévolat n’y est pas rémunéré.'],
            ['Que fixent les 17 objectifs de développement durable de l’ONU ?', ['Un cap commun à l’horizon 2030', 'Les frontières mondiales', 'Le budget de l’ONU', 'Les règles du commerce'], 0, 'Adoptés en 2015.'],
            ['Payer l’impôt n’a rien à voir avec la solidarité.', ['Vrai', 'Faux'], 1, 'C’est ce qui finance l’école, l’hôpital et la justice.'],
          ],
        },
        {
          titre: 'La défense et la sécurité nationale',
          axe: 'Construire une culture civique',
          lecon: {
            titre: 'Qui protège, et contre quoi',
            cours: `## La défense, une affaire de tous
Depuis la suspension du **service militaire** en 1997, la défense repose sur une **armée professionnelle** — mais elle reste une affaire nationale : c’est le sens du **parcours de citoyenneté**.

## Le parcours de citoyenneté
1. L’**enseignement de défense**, au collège et au lycée.
2. Le **recensement** obligatoire à **16 ans**, en mairie ou en ligne.
3. La **Journée défense et citoyenneté** (JDC), entre 16 et 18 ans. Son attestation est exigée pour s’inscrire au **baccalauréat**, au **permis de conduire** et aux concours publics.

## Les armées
**Terre**, **Marine nationale**, **Armée de l’air et de l’espace**, plus la **Gendarmerie nationale**. Leurs missions : protéger le territoire et la population, défendre les intérêts français, participer à des opérations internationales, secourir en cas de catastrophe.

## Une défense élargie
La défense ne se limite plus au militaire. Elle couvre aussi :
- la **cyberdéfense** : protéger réseaux, hôpitaux, administrations des attaques informatiques ;
- la **sécurité civile** : pompiers, secours, gestion des crises et catastrophes ;
- la **sécurité économique** et l’approvisionnement (énergie, santé, alimentation) ;
- la **lutte antiterroriste**.

> Une attaque contre un hôpital n’a plus besoin d’une armée : un logiciel suffit. C’est pourquoi la défense s’est déplacée vers des terrains sans frontière.

## Les cadres collectifs
- L’**OTAN** : alliance militaire fondée en 1949 ; une attaque contre un membre engage les autres.
- L’**Union européenne** développe une politique de sécurité et de défense commune.
- L’**ONU** mène des opérations de maintien de la paix, les « casques bleus ».

## S’engager
Réserve opérationnelle, cadets de la défense, préparations militaires, service civique, sapeur-pompier volontaire : plusieurs voies existent avant et après 18 ans.`,
          },
          questions: [
            ['Quand le service militaire a-t-il été suspendu ?', ['En 1997', 'En 1981', 'En 2001', 'En 1945'], 0, 'La défense repose depuis sur une armée professionnelle.'],
            ['Quelles sont les trois étapes du parcours de citoyenneté ?', ['Enseignement de défense, recensement à 16 ans, JDC', 'Service militaire, réserve, engagement', 'Vote, impôt, jury', 'Bac, permis, concours'], 0, 'La JDC a lieu entre 16 et 18 ans.'],
            ['À quoi sert l’attestation de JDC ?', ['S’inscrire au bac, au permis et aux concours publics', 'Voter', 'Obtenir une carte d’identité', 'Rien d’obligatoire'], 0, 'Elle est exigée pour ces démarches.'],
            ['Quelles sont les armées françaises ?', ['Terre, Marine, Air et espace, plus la Gendarmerie', 'Terre et Marine seulement', 'Terre, Air, Police', 'Marine et Gendarmerie'], 0, 'Elles ont des missions variées.'],
            ['Qu’est-ce que la cyberdéfense ?', ['La protection des réseaux et administrations contre les attaques informatiques', 'La surveillance des citoyens', 'Un logiciel antivirus', 'La censure d’internet'], 0, 'La défense s’est déplacée vers des terrains sans frontière.'],
            ['Qu’est-ce que l’OTAN ?', ['Une alliance militaire où une attaque contre un membre engage les autres', 'Une organisation humanitaire', 'Une agence de l’ONU', 'Un traité commercial'], 0, 'Fondée en 1949.'],
            ['Comment appelle-t-on les forces de maintien de la paix de l’ONU ?', ['Les casques bleus', 'Les bérets verts', 'La légion', 'La garde républicaine'], 0, 'Elles interviennent sous mandat de l’ONU.'],
            ['La défense nationale ne concerne que les militaires.', ['Vrai', 'Faux'], 1, 'Cyberdéfense, sécurité civile et approvisionnement en font partie.'],
          ],
        },
      ],
    },
  ],
}
