// DROIT ET ÉCONOMIE — Terminale technologique (série STMG). Matière NEUVE de la
// voie technologique : un élève de la voie générale ne la voit jamais (cf.
// BRIEF-techno : `contentLevelFor` range la « Tle techno » au niveau 'Tle').
//
// PROGRAMME : BO spécial n° 8 du 25 juillet 2019 (programme de droit et
// économie de terminale STMG), en vigueur. Il prolonge celui de 1re (droit :
// thèmes 1 à 4, économie : thèmes 1 à 5) et garde sa numérotation :
//   Droit    — thèmes 5 (contrat), 6 (responsabilité), 7 (travail salarié),
//              8 (entreprendre)
//   Économie — thèmes 6 (État), 7 (emploi et chômage), 8 (commerce
//              international), 9 (croissance et développement durable)
// Quinze fiches de programme, plus une fiche MÉTHODE de l’épreuve écrite
// (note de service MENE2622652N du 11/09/2026, BO spécial n° 4, applicable à
// compter de la session 2027 : 4 heures, une partie juridique et une partie
// économique indépendantes, chacune sur 10 points).
//
// DROIT À JOUR 2026 : le programme de 2019 cite encore la « déclaration
// d’insaisissabilité » et le « patrimoine d’affectation » (EIRL). Depuis la
// loi du 14 février 2022, l’entrepreneur individuel a de plein droit deux
// patrimoines séparés : la fiche 8 enseigne le droit en vigueur et présente
// ces anciens outils comme l’histoire de cette protection.
//
// PAS DE RAYON : droit et économie partagent l’onglet « Programme ». Pour deux
// onglets, il faudrait des libellés `droit` / `economie` dans
// DISCIPLINE_LABELS (lib/subject-template.ts).

export default {
  slug: 'droit-economie',
  nom: 'Droit et économie',

  titreMigration: 'DROIT ET ÉCONOMIE Tle STMG — LE PROGRAMME OFFICIEL (16 fiches)',

  motif: `Matière neuve de la voie technologique (série STMG, classe de Tle) :
le droit et l'économie de terminale n'avaient aucune fiche. Ce module installe
le programme officiel (BO spécial n° 8 du 25 juillet 2019) — les thèmes 5 à 8 de
droit et 6 à 9 d'économie — en quinze fiches, plus une fiche de méthode de
l'épreuve écrite de 4 heures (note de service du 11 septembre 2026, session
2027). Le droit est présenté à jour : réforme des contrats de 2016, statut de
l'entrepreneur individuel de 2022.`,

  blocs: [
    {
      niveaux: ['Tle'],
      positionDepart: 1,
      chapitres: [
        // ---- Droit — Thème 5 : Quel est le rôle du contrat ? --------------
        {
          titre: 'La formation du contrat',
          axe: 'Droit — Thème 5 : Quel est le rôle du contrat ?',
          lecon: {
            titre: 'Un accord de volontés qui fait naître des obligations',
            cours: `Acheter une baguette, s’abonner à une plateforme de streaming, signer un bail : tu passes des contrats sans y penser. Le droit, lui, y pense pour toi : il fixe à quelles conditions un contrat est **valable**, et ce qui arrive quand il ne l’est pas.

## Définition et vocabulaire
Selon l’**article 1101 du Code civil**, le contrat est « un accord de volontés entre deux ou plusieurs personnes destiné à **créer, modifier, transmettre ou éteindre des obligations** ».
| Terme | Sens |
| **Parties** | Les personnes qui concluent le contrat |
| **Créancier** | Celui à qui l’on doit une prestation |
| **Débiteur** | Celui qui doit l’exécuter |
| **Consommateur** | Personne physique qui agit hors de son activité professionnelle |
| **Professionnel** | Personne qui agit pour son activité (commerciale, libérale…) |

## Les quatre grands principes
1. **Liberté contractuelle** (art. 1102) : chacun est libre de contracter ou non, de choisir son cocontractant et le contenu du contrat, dans le respect de l’ordre public.
2. **Force obligatoire** (art. 1103) : le contrat « tient lieu de loi » à ceux qui l’ont fait.
3. **Effet relatif** : le contrat ne crée d’obligations qu’entre les parties, pas pour les tiers.
4. **Bonne foi** (art. 1104) : les contrats se négocient, se forment et s’exécutent de bonne foi.

## La rencontre de l’offre et de l’acceptation
Le contrat se forme par la rencontre d’une **offre** (proposition ferme et précise) et d’une **acceptation** (accord pur et simple). Avant, le droit impose une **obligation d’information** : la partie qui connaît une information déterminante pour l’autre doit la lui donner (art. 1112-1). Le professionnel doit en plus **conseiller** dans certains métiers.

## Les conditions de validité (art. 1128)
| Condition | Contenu |
| **Consentement** | Libre et éclairé, sans **vice** : erreur, dol (tromperie), violence |
| **Capacité** | Pouvoir contracter (un mineur non émancipé est en principe incapable) |
| **Contenu licite et certain** | Une prestation possible, déterminée, conforme à l’ordre public |

## La sanction : la nullité
Un contrat qui ne respecte pas ces conditions est **nul** : il est anéanti comme s’il n’avait jamais existé (restitutions).
| | Nullité **relative** | Nullité **absolue** |
| Protège | Un **intérêt privé** (une partie) | L’**intérêt général** |
| Qui peut agir ? | La seule partie protégée | Toute personne justifiant d’un intérêt, le ministère public |
| Exemples | Vice du consentement, incapacité | Objet illicite, contraire à l’ordre public |
L’action se prescrit en principe par **cinq ans**.

## Protéger le cyberconsommateur
Pour un contrat conclu **à distance** ou **hors établissement**, le consommateur dispose d’un **droit de rétractation de 14 jours**, sans motif ni pénalité. Les **clauses abusives** (qui créent un déséquilibre significatif au détriment du consommateur) sont **réputées non écrites**.

> Le contrat est un outil de liberté, mais une liberté encadrée : sans consentement libre, capacité et contenu licite, il n’y a pas de contrat valable.

## Obligation de moyens, obligation de résultat
- **Moyens** : le débiteur promet de tout faire pour atteindre le but (le médecin).
- **Résultat** : il promet le résultat lui-même (le transporteur qui doit livrer).

## Exemple travaillé
Faits : Inès, 17 ans, achète seule un scooter à 3 000 € ; ses parents veulent annuler.
- Problème de droit : un mineur non émancipé peut-il conclure seul un contrat de cette importance ?
- Règle : le mineur est en principe incapable ; seuls les actes courants autorisés par l’usage lui sont permis ; l’acte excédant sa capacité encourt la **nullité relative**.
- Application : un achat de 3 000 € n’est pas un acte courant de la vie d’une lycéenne.
- Solution : les parents, représentants légaux, peuvent demander la nullité ; le vendeur rend le prix, Inès rend le scooter.`,
          },
          questions: [
            ['Selon le Code civil, le contrat est…', ['Un acte unilatéral du juge', 'Un accord de volontés destiné à créer, modifier, transmettre ou éteindre des obligations', 'Une loi votée par le Parlement', 'Une décision de l’administration'], 1, 'C’est la définition de l’article 1101 du Code civil.'],
            ['Quelles sont les trois conditions de validité d’un contrat ?', ['Consentement, capacité, contenu licite et certain', 'Écrit, signature, témoin', 'Prix, date, lieu', 'Offre, publicité, facture'], 0, 'L’article 1128 du Code civil les énumère.'],
            ['Le dol est…', ['Une erreur sur le prix', 'Une tromperie destinée à obtenir le consentement de l’autre partie', 'Une violence physique uniquement', 'Un retard de paiement'], 1, 'C’est un vice du consentement, sanctionné par la nullité relative.'],
            ['Qui peut demander la nullité relative ?', ['N’importe qui', 'Seulement la partie que la règle protège', 'Seulement le ministère public', 'Seulement le juge d’office'], 1, 'Elle protège un intérêt privé : seule la partie protégée peut agir.'],
            ['Un contrat dont l’objet est contraire à l’ordre public est frappé de…', ['Nullité relative', 'Nullité absolue', 'Résiliation', 'Rétractation'], 1, 'L’intérêt général est en jeu : toute personne intéressée peut agir.'],
            ['Combien de jours dure le droit de rétractation pour un achat à distance ?', ['7 jours', '10 jours', '14 jours', '30 jours'], 2, 'Le consommateur peut revenir sur son engagement sans motif pendant 14 jours.'],
            ['Une clause abusive est réputée non écrite.', ['Vrai', 'Faux'], 0, 'Elle est effacée du contrat, qui continue de s’appliquer sans elle.'],
            ['Le principe de force obligatoire signifie que…', ['Le contrat tient lieu de loi à ceux qui l’ont fait', 'Le juge peut toujours modifier le contrat', 'Le contrat s’impose aux tiers', 'Le contrat doit être signé devant notaire'], 0, 'Les parties doivent exécuter ce à quoi elles se sont engagées.'],
            ['Un transporteur qui s’engage à livrer un colis intact est tenu d’une obligation…', ['De moyens', 'De résultat', 'Morale', 'Facultative'], 1, 'Il promet le résultat lui-même : s’il échoue, sa responsabilité est engagée sauf cause étrangère.'],
            ['Qu’impose l’obligation d’information précontractuelle ?', ['De tout révéler sur sa vie privée', 'De communiquer à l’autre partie une information déterminante qu’on connaît', 'De publier le contrat', 'De faire relire le contrat par un avocat'], 1, 'L’article 1112-1 du Code civil l’impose depuis 2016.'],
            ['L’effet relatif du contrat signifie qu’il ne crée d’obligations qu’entre les parties.', ['Vrai', 'Faux'], 0, 'Les tiers ne peuvent être ni créanciers ni débiteurs d’un contrat qu’ils n’ont pas conclu.'],
            ['Quelle est la conséquence d’une nullité ?', ['Le contrat continue mais le prix baisse', 'Le contrat est anéanti comme s’il n’avait jamais existé', 'Le contrat est suspendu un mois', 'Seule une clause disparaît'], 1, 'Les parties se restituent ce qu’elles ont reçu.'],
          ],
        },
        {
          titre: 'L’exécution du contrat et ses sanctions',
          axe: 'Droit — Thème 5 : Quel est le rôle du contrat ?',
          lecon: {
            titre: 'Quand l’autre ne tient pas parole',
            cours: `Un contrat valablement formé **oblige** les parties. Mais que faire quand le vendeur ne livre pas, quand le client ne paie pas, quand l’artisan bâcle le chantier ? Le Code civil donne au créancier une boîte à outils graduée.

## Le principe : exécuter
Le contrat légalement formé contraint chaque partie à exécuter ses obligations, **de bonne foi**, dans les délais prévus. L’**inexécution** peut être totale, partielle ou tardive.

## Étape préalable : la mise en demeure
Avant d’agir, le créancier adresse en général au débiteur une **mise en demeure** : une interpellation suffisamment claire (souvent par lettre recommandée avec accusé de réception) qui le somme d’exécuter dans un délai. Elle prouve le retard et fait courir des intérêts.

## Les sanctions de l’inexécution (art. 1217 du Code civil)
| Sanction | Principe | Exemple |
| **Exception d’inexécution** | Refuser ou suspendre sa propre prestation tant que l’autre n’exécute pas la sienne | Le client ne paie pas le solde tant que les travaux ne sont pas finis |
| **Exécution forcée en nature** | Obtenir la prestation promise elle-même | Contraindre le vendeur à livrer |
| **Réduction du prix** | Accepter une exécution imparfaite contre un prix diminué | Une cuisine livrée avec un défaut mineur |
| **Résolution** | Anéantir le contrat pour une inexécution suffisamment grave | Annuler la commande jamais livrée |
| **Dommages et intérêts** | Réparer le préjudice causé par l’inexécution | Indemniser le manque à gagner |
Ces sanctions peuvent se **cumuler** si elles sont compatibles (résolution + dommages et intérêts).

## L’exception d’inexécution
Elle est propre aux **contrats synallagmatiques** (chaque partie est à la fois créancière et débitrice). Elle doit rester **proportionnée** : on ne suspend pas tout pour un petit manquement.

## Résolution et résiliation
- La **résolution** anéantit le contrat ; elle peut résulter d’une **clause résolutoire**, d’une **notification** du créancier en cas d’inexécution grave, ou d’une décision du **juge**.
- La **résiliation** met fin, **pour l’avenir**, à un contrat à exécution successive (un abonnement, un bail) : les prestations passées restent acquises.

## Les clauses qui organisent l’inexécution
| Clause | Rôle |
| **Clause pénale** | Fixe d’avance l’indemnité due en cas d’inexécution ; le juge peut la réduire si elle est manifestement excessive (ou l’augmenter si elle est dérisoire) |
| **Clause résolutoire** | Prévoit la résolution automatique en cas de manquement désigné |
| **Clause abusive** | Dans un contrat avec un consommateur, clause qui crée un déséquilibre significatif : réputée non écrite |

> Le créancier choisit la sanction la plus adaptée, mais toujours en commençant par laisser au débiteur une chance d’exécuter.

## Exemple travaillé
Faits : la SARL Déco commande 200 chaises à un fabricant pour le 1er mars ; le 20 mars, rien n’est livré. Déco a versé un acompte de 30 %.
- Qualification : contrat de vente, synallagmatique ; inexécution (retard) du vendeur.
- Problème de droit : de quels moyens dispose l’acheteur face à un vendeur qui ne livre pas ?
- Règle : art. 1217 ; mise en demeure préalable ; résolution possible si l’inexécution est suffisamment grave ; dommages et intérêts pour le préjudice.
- Application : Déco met le fabricant en demeure de livrer sous huit jours. À défaut, le retard compromet l’ouverture de son restaurant : l’inexécution est grave.
- Solution : Déco peut notifier la résolution, récupérer son acompte et demander des dommages et intérêts pour le préjudice subi.`,
          },
          questions: [
            ['À quoi sert la mise en demeure ?', ['À annuler immédiatement le contrat', 'À sommer le débiteur d’exécuter dans un délai', 'À saisir la police', 'À modifier le prix'], 1, 'Elle constate le retard et donne une dernière chance au débiteur.'],
            ['Refuser de payer tant que l’autre partie n’a pas livré, c’est…', ['La résolution', 'L’exception d’inexécution', 'La clause pénale', 'La rétractation'], 1, 'On suspend sa propre prestation tant que l’autre n’exécute pas la sienne.'],
            ['L’exception d’inexécution s’applique aux contrats…', ['Unilatéraux', 'Synallagmatiques', 'Nuls', 'Administratifs uniquement'], 1, 'Chaque partie y est créancière et débitrice de l’autre.'],
            ['La résolution d’un contrat…', ['Le prolonge', 'L’anéantit', 'Le suspend un mois', 'Le transmet à un tiers'], 1, 'C’est la sanction la plus radicale, réservée aux inexécutions graves.'],
            ['Mettre fin pour l’avenir à un abonnement, c’est…', ['Une résiliation', 'Une résolution rétroactive', 'Une nullité absolue', 'Une exécution forcée'], 0, 'La résiliation ne remet pas en cause les prestations passées.'],
            ['Que permet la clause pénale ?', ['D’envoyer le débiteur en prison', 'De fixer d’avance l’indemnité due en cas d’inexécution', 'D’interdire toute action en justice', 'De rendre le contrat gratuit'], 1, 'Le juge peut la réviser si elle est manifestement excessive ou dérisoire.'],
            ['Le créancier peut accepter une exécution imparfaite contre une réduction du prix.', ['Vrai', 'Faux'], 0, 'La réduction du prix figure parmi les sanctions de l’article 1217.'],
            ['Quel article du Code civil liste les sanctions de l’inexécution ?', ['Article 1101', 'Article 1217', 'Article 1240', 'Article 1832'], 1, 'Il énumère exception d’inexécution, exécution forcée, réduction du prix, résolution et dommages et intérêts.'],
            ['Résolution et dommages et intérêts peuvent se cumuler.', ['Vrai', 'Faux'], 0, 'Les sanctions compatibles se cumulent : on anéantit le contrat et on répare le préjudice.'],
            ['Obtenir du vendeur qu’il livre la chose promise, c’est…', ['L’exécution forcée en nature', 'La réduction du prix', 'La résiliation', 'L’exception d’inexécution'], 0, 'Le créancier obtient la prestation elle-même, sauf impossibilité ou coût manifestement disproportionné.'],
            ['Une clause qui prévoit la fin automatique du contrat en cas de manquement désigné est une clause…', ['Pénale', 'Résolutoire', 'Abusive', 'De non-concurrence'], 1, 'Elle organise la résolution sans passer par le juge.'],
            ['L’exception d’inexécution doit être…', ['Proportionnée au manquement', 'Toujours totale', 'Autorisée par le juge avant usage', 'Réservée aux consommateurs'], 0, 'On ne suspend pas toute sa prestation pour un manquement minime.'],
          ],
        },

        // ---- Droit — Thème 6 : Qu’est-ce qu’être responsable ? ------------
        {
          titre: 'Le dommage réparable',
          axe: 'Droit — Thème 6 : Qu’est-ce qu’être responsable ?',
          lecon: {
            titre: 'Réparer plutôt que punir',
            cours: `Un ballon traverse la vitre du voisin, un cycliste renverse un piéton, une usine pollue une rivière. Dans chaque cas une question se pose : **qui va réparer ?** C’est l’objet de la **responsabilité civile**, qu’il ne faut pas confondre avec la responsabilité pénale.

## Responsabilité civile et responsabilité pénale
| | Responsabilité **civile** | Responsabilité **pénale** |
| But | **Réparer** le dommage de la victime | **Sanctionner** un comportement interdit par la loi |
| Sanction | Dommages et intérêts versés à la victime | Amende, prison, travail d’intérêt général |
| Qui agit ? | La victime | Le ministère public (procureur), la victime peut se constituer partie civile |
| Juridiction | Juridictions civiles | Tribunal de police, tribunal correctionnel, cour d’assises (ou cour criminelle départementale) |
Un même fait peut engager les deux : le chauffard ivre est puni (pénal) **et** doit indemniser (civil).

## Le dommage, condition première
Sans **dommage**, pas de responsabilité civile. Le dommage est l’atteinte portée à un droit ou à un intérêt ; le **préjudice** en est la conséquence indemnisable.
| Type | Exemples |
| **Matériel** (patrimonial) | Voiture endommagée, perte de revenus, frais |
| **Corporel** | Blessure, invalidité, et ses suites (frais médicaux, souffrances) |
| **Moral** (extrapatrimonial) | Souffrance psychologique, perte d’un proche, atteinte à l’honneur |

## Les caractères du préjudice réparable
1. **Certain** : il existe réellement (actuel, ou futur mais inévitable). La **perte de chance** sérieuse est réparable.
2. **Personnel** : c’est la victime (ou ses proches par ricochet) qui le subit.
3. **Direct** : il découle directement du fait reproché.
4. **Légitime** : il porte sur un intérêt juridiquement protégé.

## La réparation
Le principe est la **réparation intégrale** : replacer la victime dans la situation où elle serait sans le dommage, « tout le préjudice, mais rien que le préjudice ». Elle se fait en **nature** (réparer la vitre) ou, le plus souvent, **par équivalent** (des dommages et intérêts).

## Le préjudice écologique
Depuis la loi du 8 août 2016, le Code civil (art. 1246 et suivants) oblige toute personne responsable d’un **préjudice écologique** à le réparer : une atteinte **non négligeable** aux éléments ou aux fonctions des **écosystèmes**, même si aucune personne n’en souffre directement. La réparation se fait **par priorité en nature** (restaurer le milieu). L’État, des collectivités ou des associations de protection de l’environnement peuvent agir.

## Le rôle de l’assurance
Beaucoup de dommages sont pris en charge par un **assureur** : Sécurité sociale, complémentaire santé, assurance de biens, assurance de **responsabilité civile** (obligatoire pour un véhicule), fonds de garantie quand le responsable est inconnu ou insolvable. Le mécanisme : chaque assuré verse une **prime** ; l’assureur **mutualise** les risques et indemnise ceux qui subissent un sinistre, puis se retourne parfois contre le responsable.

> La responsabilité civile regarde la victime ; la responsabilité pénale regarde la société.

## Exemple travaillé
Faits : Hugo, en trottinette, heurte Mme Roux, qui se casse le poignet, rate un concours de recrutement prévu le lendemain et vit mal l’accident.
- Préjudices : **corporel** (fracture, frais médicaux), **matériel** (arrêt de travail), **moral** (souffrance), **perte de chance** sérieuse de réussir le concours.
- Caractères : certains, personnels, directs, légitimes.
- Réparation : dommages et intérêts, souvent versés par l’assureur de responsabilité civile d’Hugo.`,
          },
          questions: [
            ['Quel est le but de la responsabilité civile ?', ['Punir le coupable', 'Réparer le dommage de la victime', 'Protéger l’ordre public', 'Collecter des amendes'], 1, 'La responsabilité pénale sanctionne, la responsabilité civile répare.'],
            ['Une amende et une peine de prison relèvent de la responsabilité…', ['Civile', 'Pénale', 'Contractuelle', 'Administrative uniquement'], 1, 'Ce sont des sanctions prononcées au nom de la société.'],
            ['La perte d’un proche cause un préjudice…', ['Matériel', 'Moral', 'Écologique', 'Fiscal'], 1, 'C’est un préjudice extrapatrimonial.'],
            ['Lequel n’est PAS un caractère du préjudice réparable ?', ['Certain', 'Direct', 'Personnel', 'Hypothétique'], 3, 'Un préjudice purement hypothétique n’est pas réparable ; il doit être certain.'],
            ['Un même fait peut engager à la fois la responsabilité civile et la responsabilité pénale.', ['Vrai', 'Faux'], 0, 'Le conducteur ivre qui blesse quelqu’un est puni et doit réparer.'],
            ['Qu’est-ce que le préjudice écologique ?', ['Un préjudice subi par un agriculteur uniquement', 'Une atteinte non négligeable aux éléments ou aux fonctions des écosystèmes', 'Une amende pour pollution', 'Une taxe carbone'], 1, 'Il est réparable même si aucune personne n’en souffre directement (art. 1246 C. civ.).'],
            ['Comment se répare en priorité le préjudice écologique ?', ['En nature, en restaurant le milieu', 'Par une peine de prison', 'Par des excuses publiques', 'Il n’est pas réparable'], 0, 'Les dommages et intérêts ne viennent qu’à défaut de réparation en nature.'],
            ['Le principe de réparation intégrale signifie…', ['Réparer tout le préjudice, mais rien que le préjudice', 'Réparer le double du préjudice', 'Réparer seulement le préjudice moral', 'Laisser le juge fixer une somme forfaitaire'], 0, 'La victime est replacée dans la situation où elle serait sans le dommage.'],
            ['Qui déclenche l’action pénale ?', ['L’assureur', 'Le ministère public (procureur)', 'Le notaire', 'La banque'], 1, 'La victime peut s’y associer en se constituant partie civile.'],
            ['Comment fonctionne l’assurance ?', ['Elle mutualise les risques grâce aux primes versées par tous les assurés', 'Elle punit les responsables', 'Elle rembourse les primes chaque année', 'Elle remplace le juge pénal'], 0, 'Les primes de tous financent l’indemnisation de ceux qui subissent un sinistre.'],
            ['Une perte de chance sérieuse peut être réparée.', ['Vrai', 'Faux'], 0, 'On répare la probabilité perdue d’obtenir un avantage (réussir un concours, par exemple).'],
            ['Des frais médicaux et une perte de salaire après un accident sont des préjudices…', ['Patrimoniaux (matériels)', 'Moraux', 'Écologiques', 'Esthétiques uniquement'], 0, 'Ils ont une traduction directe en argent.'],
          ],
        },
        {
          titre: 'Les régimes de responsabilité et l’exonération',
          axe: 'Droit — Thème 6 : Qu’est-ce qu’être responsable ?',
          lecon: {
            titre: 'Qualifier la situation pour trouver le bon régime',
            cours: `Pour être indemnisée, la victime doit prouver trois éléments : un **fait générateur**, un **dommage** et un **lien de causalité** entre les deux. Mais la preuve à apporter dépend du **régime** applicable. Tout l’art consiste à **qualifier** la situation.

## La démarche : du plus spécial au plus général
1. Existe-t-il un **régime spécial** ? (accident du travail, accident de la circulation, produit défectueux, préjudice écologique)
2. Sinon, le dommage est-il né de l’**exécution d’un contrat** ? → responsabilité **contractuelle**.
3. Sinon → responsabilité **extracontractuelle** (délictuelle).

## Les régimes spéciaux
| Régime | Principe |
| **Accident du travail** | Accident survenu par le fait ou à l’occasion du travail : présumé professionnel, indemnisé par la Sécurité sociale de façon **forfaitaire**, sans avoir à prouver une faute de l’employeur |
| **Accident de la circulation** (loi Badinter, 5 juillet 1985) | Dès qu’un **véhicule terrestre à moteur** est **impliqué**, les victimes sont indemnisées ; le piéton ou le passager ne se voit opposer que sa faute inexcusable, cause exclusive de l’accident (sauf victimes très protégées) |
| **Produits défectueux** (art. 1245 et s. C. civ.) | Le **producteur** répond, **sans faute**, du dommage causé par un produit qui n’offre pas la sécurité qu’on peut légitimement attendre |

## La responsabilité contractuelle
Si le dommage résulte de l’**inexécution** d’un contrat, la victime invoque le contrat.
- Obligation de **moyens** : la victime doit prouver que le débiteur n’a pas tout mis en œuvre.
- Obligation de **résultat** : le seul fait que le résultat n’est pas atteint suffit.
- Le juge a dégagé des **obligations de sécurité** (transporteur de personnes, organisateur d’activité).
- Une **clause limitative ou exonératoire** de responsabilité est possible, mais écartée en cas de faute lourde ou si elle vide l’obligation essentielle de sa substance, et interdite contre un consommateur si elle est abusive.

## La responsabilité extracontractuelle
| Fait générateur | Règle | Ce que la victime prouve |
| **Fait personnel** (art. 1240 et 1241) | « Tout fait quelconque de l’homme qui cause à autrui un dommage oblige celui par la faute duquel il est arrivé à le réparer » ; imprudence et négligence comprises | La **faute**, le dommage, le lien |
| **Fait des choses** (art. 1242 al. 1) | Le **gardien** (usage, direction, contrôle) répond de la chose | Le rôle actif de la chose |
| **Fait d’autrui** | Les **parents** répondent de leur enfant mineur ; le **commettant** (employeur) de son préposé | Le fait dommageable de l’enfant ou du salarié |
| **Fait des animaux** (art. 1243) | Le propriétaire ou celui qui s’en sert | L’intervention de l’animal |
| **Ruine des bâtiments** (art. 1244) | Le propriétaire, si la ruine vient d’un défaut d’entretien ou d’un vice de construction | La ruine et sa cause |

## Les moyens d’exonération
Le responsable peut échapper, en tout ou partie, à sa responsabilité en prouvant une **cause étrangère** :
1. la **force majeure** : un événement **extérieur**, **imprévisible** et **irrésistible** (exonération totale) ;
2. la **faute de la victime** (exonération partielle, ou totale si elle présente les caractères de la force majeure) ;
3. le **fait d’un tiers** (même logique).

> Pas de réparation sans les trois maillons : fait générateur, dommage, lien de causalité. La cause étrangère casse le lien.

## Exemple travaillé
Faits : lors d’une tempête annoncée depuis trois jours, une tuile mal fixée tombe du toit de M. Martin sur la voiture de Mme Lopez.
- Régime : pas de contrat, pas de régime spécial → **extracontractuelle**. La chute d’un élément du bâtiment dû à un défaut d’entretien relève de la **ruine du bâtiment** (ou du fait des choses).
- Exonération : M. Martin invoque la force majeure. Mais la tempête était **prévisible** (annoncée) et la tuile **mal fixée** : ni imprévisible ni irrésistible.
- Solution : M. Martin (et son assureur) doit réparer le dommage de Mme Lopez.`,
          },
          questions: [
            ['Quels sont les trois éléments que la victime doit établir ?', ['Un fait générateur, un dommage, un lien de causalité', 'Un contrat, une facture, un témoin', 'Une plainte, un avocat, un jugement', 'Une faute pénale, une amende, une peine'], 0, 'Ce sont les trois maillons de toute responsabilité civile.'],
            ['Quel texte régit les accidents de la circulation ?', ['La loi Badinter du 5 juillet 1985', 'La loi PACTE de 2019', 'Le RGPD', 'La loi Macron de 2015'], 0, 'Elle facilite l’indemnisation dès qu’un véhicule terrestre à moteur est impliqué.'],
            ['Le producteur d’un produit défectueux est responsable…', ['Seulement s’il a commis une faute prouvée', 'Même sans faute', 'Jamais', 'Seulement devant le juge pénal'], 1, 'C’est une responsabilité sans faute (art. 1245 et s. du Code civil).'],
            ['Un accident survenu à l’occasion du travail est indemnisé…', ['Par la Sécurité sociale, de façon forfaitaire', 'Uniquement par le salarié lui-même', 'Par le tribunal correctionnel', 'Jamais'], 0, 'L’accident est présumé professionnel ; la victime n’a pas à prouver une faute.'],
            ['Quel article pose la responsabilité du fait personnel ?', ['Article 1101', 'Article 1240', 'Article 1832', 'Article 1128'], 1, '« Tout fait quelconque de l’homme qui cause à autrui un dommage oblige celui par la faute duquel il est arrivé à le réparer. »'],
            ['Le gardien d’une chose est celui qui en a…', ['La propriété uniquement', 'L’usage, la direction et le contrôle', 'La facture', 'L’assurance'], 1, 'C’est un pouvoir de fait sur la chose, pas forcément la propriété.'],
            ['Les parents répondent des dommages causés par leur enfant mineur.', ['Vrai', 'Faux'], 0, 'C’est un cas de responsabilité du fait d’autrui (art. 1242 du Code civil).'],
            ['Quels sont les caractères de la force majeure ?', ['Extérieure, imprévisible, irrésistible', 'Rare, coûteuse, lointaine', 'Naturelle, soudaine, bruyante', 'Prévisible, évitable, interne'], 0, 'Ces trois caractères cumulés exonèrent totalement le responsable.'],
            ['Quel régime appliquer à un dommage né de l’inexécution d’un contrat ?', ['La responsabilité extracontractuelle', 'La responsabilité contractuelle', 'La responsabilité pénale', 'Aucun régime'], 1, 'On invoque alors le contrat ; le fait personnel ne s’applique pas entre cocontractants pour l’inexécution.'],
            ['Un employeur répond du dommage causé par son salarié dans ses fonctions en tant que…', ['Gardien', 'Commettant', 'Producteur', 'Propriétaire d’animal'], 1, 'Le commettant répond de son préposé.'],
            ['Une tempête annoncée plusieurs jours à l’avance constitue toujours un cas de force majeure.', ['Vrai', 'Faux'], 1, 'Elle n’est pas imprévisible : la force majeure n’est pas caractérisée.'],
            ['La faute de la victime peut…', ['Augmenter l’indemnisation', 'Exonérer partiellement le responsable', 'Rendre le contrat nul', 'Transformer le dommage en préjudice écologique'], 1, 'Elle réduit l’indemnisation, voire l’exclut si elle a les caractères de la force majeure.'],
          ],
        },

        // ---- Droit — Thème 7 : Comment le droit encadre-t-il le travail salarié ?
        {
          titre: 'Le contrat de travail et le CDI',
          axe: 'Droit — Thème 7 : Comment le droit encadre-t-il le travail salarié ?',
          lecon: {
            titre: 'Travailler sous l’autorité d’un autre, avec des protections',
            cours: `Le droit du travail est né au XIXe siècle de la nécessité de **protéger les salariés**, partie faible face à l’employeur. Il relève de l’**ordre public de protection** : on peut y déroger en faveur du salarié, pas contre lui. Son point d’entrée est le **contrat de travail**.

## Les trois éléments du contrat de travail
Le contrat de travail est la convention par laquelle une personne s’engage à fournir une **prestation de travail**, sous la **subordination** d’une autre, moyennant une **rémunération**.
| Élément | Contenu |
| **Prestation de travail** | Une activité réelle |
| **Rémunération** | Un salaire, en argent ou en nature |
| **Lien de subordination** | Le pouvoir de l’employeur de **donner des ordres**, d’en **contrôler** l’exécution et de **sanctionner** les manquements |
Le lien de subordination est le **critère décisif**. Le juge requalifie la relation selon les faits, quel que soit le nom donné au contrat.

## Contrat de travail ou contrat d’entreprise ?
| | Contrat de **travail** | Contrat d’**entreprise** (prestation de service) |
| Relation | Salarié / employeur | Prestataire indépendant / client |
| Subordination | **Oui** | **Non** : le prestataire organise librement son travail |
| Exemple | Le plombier salarié d’une entreprise | Le plombier artisan appelé par un particulier |

## Les pouvoirs de l’employeur
1. **Pouvoir de direction** : organiser le travail, donner des consignes.
2. **Pouvoir réglementaire** : édicter le **règlement intérieur** (obligatoire dès **50 salariés**) sur l’hygiène, la sécurité et la discipline.
3. **Pouvoir disciplinaire** : sanctionner une faute (avertissement, mise à pied, licenciement), selon une procédure.

## Les sources : loi et négociation collective
Le contrat de travail s’inscrit dans un ensemble de normes : Code du travail, **conventions** et **accords collectifs** négociés par les **partenaires sociaux** (syndicats de salariés, organisations patronales). Depuis les ordonnances de 2017, l’**accord d’entreprise** prime sur l’accord de branche dans de nombreux domaines (sauf ceux réservés à la branche, comme les salaires minima).

## Le CDI, contrat de droit commun
Le **contrat à durée indéterminée** est la forme normale de la relation de travail. Ses clauses **générales** : fonctions et qualification, lieu de travail, durée et horaires, rémunération, **période d’essai**.
| Période d’essai maximale (CDI) | Durée initiale |
| Ouvriers et employés | 2 mois |
| Agents de maîtrise et techniciens | 3 mois |
| Cadres | 4 mois |
Elle peut être renouvelée une fois si un accord de branche le prévoit et si le contrat le stipule.

## Les clauses spécifiques
| Clause | Condition de validité |
| **Mobilité** | Zone géographique définie précisément ; mise en œuvre de bonne foi |
| **Non-concurrence** | Protéger un intérêt légitime de l’entreprise, limitée dans le **temps** et l’**espace**, tenant compte de l’emploi, avec une **contrepartie financière** |
| **Télétravail** | Organisé par accord collectif, charte ou accord individuel ; volontariat |

> C’est la subordination, et non l’étiquette posée sur le contrat, qui fait le salarié.

## Exemple travaillé
Faits : une plateforme de livraison impose à Karim ses horaires, le géolocalise en permanence et le « déconnecte » s’il refuse trop de courses ; il est officiellement auto-entrepreneur.
- Problème de droit : Karim peut-il obtenir la requalification en contrat de travail ?
- Règle : le contrat de travail se caractérise par un lien de subordination (ordres, contrôle, sanction), apprécié selon les faits.
- Application : horaires imposés (ordres), géolocalisation (contrôle), déconnexion (sanction).
- Solution : le conseil de prud’hommes peut requalifier la relation en contrat de travail, avec les droits qui en découlent.`,
          },
          questions: [
            ['Quel est le critère décisif du contrat de travail ?', ['Le versement d’un salaire en espèces', 'Le lien de subordination', 'La signature devant notaire', 'La durée de plus d’un an'], 1, 'Ordres, contrôle et sanction caractérisent la subordination.'],
            ['Le lien de subordination suppose que l’employeur puisse…', ['Donner des ordres, en contrôler l’exécution et sanctionner les manquements', 'Fixer le prix des produits', 'Choisir les clients du salarié hors travail', 'Imposer le lieu de vacances'], 0, 'C’est la définition retenue par la jurisprudence.'],
            ['Un artisan qui répare la chaudière d’un particulier est lié par…', ['Un contrat de travail', 'Un contrat d’entreprise', 'Un contrat de mission d’intérim', 'Une convention collective'], 1, 'Il organise librement son travail : pas de subordination.'],
            ['À partir de combien de salariés le règlement intérieur est-il obligatoire ?', ['11', '20', '50', '250'], 2, 'Il fixe les règles d’hygiène, de sécurité et de discipline.'],
            ['Le juge peut requalifier en contrat de travail une relation présentée comme indépendante.', ['Vrai', 'Faux'], 0, 'Il s’attache aux conditions réelles d’exercice, pas au nom du contrat.'],
            ['Quelle est la durée maximale initiale de la période d’essai d’un cadre en CDI ?', ['1 mois', '2 mois', '3 mois', '4 mois'], 3, 'Deux mois pour les employés, trois pour les agents de maîtrise, quatre pour les cadres.'],
            ['Laquelle est une condition de validité de la clause de non-concurrence ?', ['Une contrepartie financière', 'L’absence de limite dans le temps', 'L’accord du client', 'Son application à tous les métiers du monde'], 0, 'Elle doit aussi être limitée dans le temps et l’espace et protéger un intérêt légitime.'],
            ['Le pouvoir disciplinaire permet à l’employeur de…', ['Sanctionner une faute du salarié', 'Fixer le montant du SMIC', 'Modifier la loi', 'Juger un litige'], 0, 'Avertissement, mise à pied, licenciement : dans le respect d’une procédure.'],
            ['Le contrat de droit commun de la relation de travail est…', ['Le CDD', 'Le CDI', 'Le contrat d’intérim', 'Le contrat saisonnier'], 1, 'Les autres contrats sont des exceptions encadrées.'],
            ['Qui négocie les conventions collectives ?', ['Les partenaires sociaux', 'Le seul employeur', 'Le conseil de prud’hommes', 'Le préfet'], 0, 'Syndicats de salariés et organisations d’employeurs.'],
            ['Une clause de mobilité valable doit définir précisément sa zone géographique.', ['Vrai', 'Faux'], 0, 'L’employeur ne peut pas l’étendre unilatéralement.'],
            ['Dans quel sens peut-on déroger à l’ordre public de protection ?', ['Contre le salarié', 'En faveur du salarié', 'Dans les deux sens librement', 'Jamais'], 1, 'Le droit du travail fixe un minimum de protection qu’on peut améliorer.'],
          ],
        },
        {
          titre: 'Les autres contrats de travail et la rupture',
          axe: 'Droit — Thème 7 : Comment le droit encadre-t-il le travail salarié ?',
          lecon: {
            titre: 'Des contrats pour les besoins temporaires, des règles pour se séparer',
            cours: `Le CDI est la règle, mais l’activité de certaines entreprises est saisonnière, liée à un chantier ou à un pic temporaire. Le législateur a donc créé des contrats **adaptés**, strictement encadrés. Et quand la relation de travail prend fin, le droit veille surtout aux ruptures voulues par l’**employeur**.

## Les autres formes de contrat de travail
| Contrat | Principe | Avantages / inconvénients |
| **CDD** | Contrat **écrit**, pour un motif précis et temporaire (remplacement d’un salarié absent, accroissement temporaire d’activité, emploi saisonnier) ; durée maximale en général **18 mois**, renouvellements compris ; **indemnité de fin de contrat** de 10 % en principe | Souplesse pour l’employeur ; précarité pour le salarié |
| **CDI de chantier ou d’opération** | CDI conclu pour la durée d’un chantier ou d’un projet ; il prend fin à son achèvement | Adapté au BTP ou aux projets ; fin prévisible mais date incertaine |
| **Contrat saisonnier** | CDD pour des tâches qui se répètent chaque année (vendanges, saison touristique) | Pas d’indemnité de précarité en principe |
| **Travail temporaire (intérim)** | Relation **tripartite** : l’agence (employeur) conclut un **contrat de mission** avec l’intérimaire et un **contrat de mise à disposition** avec l’entreprise utilisatrice | Réactivité ; indemnité de fin de mission pour l’intérimaire |
Un CDD conclu hors des cas autorisés, ou pour pourvoir durablement un emploi permanent, peut être **requalifié en CDI**.

## Les modes de rupture du CDI
1. **La démission** : décision du **salarié**, qui doit être **claire et non équivoque** ; un **préavis** est en général dû. Elle n’ouvre pas droit, en principe, à l’allocation chômage.
2. **Le départ à la retraite**.
3. **Le licenciement** : décision de l’**employeur**, très encadrée.
4. **La rupture conventionnelle individuelle** : accord des deux parties, **homologué** par l’administration du travail, avec un délai de rétractation de **15 jours calendaires** ; le salarié perçoit une indemnité et peut toucher le chômage.
5. **La rupture conventionnelle collective** : départs **volontaires** prévus par un **accord collectif** validé par l’administration.

## Le licenciement pour motif personnel
Il repose sur la personne du salarié (faute, insuffisance professionnelle). Il exige :
- une **cause réelle et sérieuse** : des faits **exacts**, **objectifs** et suffisamment **graves** ;
- une **procédure** : convocation à un **entretien préalable**, entretien (le salarié peut être assisté), puis **notification** par lettre recommandée qui énonce les motifs, au moins deux jours ouvrables après l’entretien.
Sans cause réelle et sérieuse, le licenciement est **abusif** : le conseil de prud’hommes accorde une indemnité encadrée par un **barème** (plancher et plafond selon l’ancienneté).

## Le licenciement pour motif économique
Il ne tient **pas à la personne** du salarié : suppression ou transformation d’emploi, ou modification refusée d’un élément essentiel du contrat, **consécutives** notamment à des **difficultés économiques**, des **mutations technologiques**, une **réorganisation** nécessaire à la sauvegarde de la compétitivité, ou la **cessation d’activité**.

> Le salarié peut partir librement ; l’employeur, lui, doit toujours justifier et respecter une procédure.

## Exemple travaillé
Faits : Lucie, vendeuse en CDI, arrive trois fois en retard de dix minutes en un an. Son employeur lui envoie directement une lettre de licenciement.
- Problème de droit : ce licenciement est-il régulier et justifié ?
- Règles : cause réelle et sérieuse ; procédure avec entretien préalable.
- Application : trois retards légers en un an ne sont pas une faute suffisamment grave ; l’entretien préalable n’a pas eu lieu.
- Solution : licenciement sans cause réelle et sérieuse et irrégulier ; Lucie peut saisir le conseil de prud’hommes pour obtenir une indemnité.`,
          },
          questions: [
            ['Quelle est la durée maximale habituelle d’un CDD, renouvellements compris ?', ['6 mois', '12 mois', '18 mois', '36 mois'], 2, 'Sauf exceptions prévues par la loi ou un accord de branche.'],
            ['Lequel est un motif autorisé de recours au CDD ?', ['Pourvoir durablement un emploi permanent', 'Remplacer un salarié absent', 'Éviter de payer des cotisations', 'Tester un candidat pendant trois ans'], 1, 'Le CDD ne peut servir qu’à des besoins temporaires précisément énumérés.'],
            ['Combien de parties compte la relation de travail temporaire (intérim) ?', ['Deux', 'Trois', 'Quatre', 'Une seule'], 1, 'L’agence, l’intérimaire et l’entreprise utilisatrice.'],
            ['Un CDD conclu hors des cas autorisés peut être requalifié en CDI.', ['Vrai', 'Faux'], 0, 'C’est la sanction du recours abusif au contrat précaire.'],
            ['Qu’exige une démission ?', ['Une volonté claire et non équivoque du salarié', 'L’accord de l’inspection du travail', 'Un jugement', 'Une faute de l’employeur'], 0, 'Une démission donnée sous le coup de la colère peut être contestée.'],
            ['Un licenciement pour motif personnel doit reposer sur…', ['Une cause réelle et sérieuse', 'L’humeur de l’employeur', 'Une baisse du chiffre d’affaires de la concurrence', 'Un simple désaccord politique'], 0, 'Faits exacts, objectifs et suffisamment graves.'],
            ['Quelle étape précède obligatoirement la notification d’un licenciement pour motif personnel ?', ['Un entretien préalable', 'Un vote des salariés', 'Un procès pénal', 'Une annonce publique'], 0, 'Le salarié y est convoqué et peut se faire assister.'],
            ['La rupture conventionnelle individuelle repose sur…', ['La seule décision de l’employeur', 'L’accord des deux parties, homologué par l’administration', 'Une faute grave du salarié', 'Une décision du juge'], 1, 'Un délai de rétractation de 15 jours calendaires protège chacun.'],
            ['Un licenciement pour motif économique est lié…', ['À la personne du salarié', 'À des causes non inhérentes à la personne du salarié (difficultés, mutations technologiques…)', 'À un retard du salarié', 'À une maladie du salarié'], 1, 'Il découle d’une suppression, transformation d’emploi ou modification refusée du contrat.'],
            ['Que sanctionne le barème appliqué par les prud’hommes ?', ['Le licenciement sans cause réelle et sérieuse', 'La démission', 'Le départ en retraite', 'La période d’essai'], 0, 'Il encadre l’indemnité selon l’ancienneté du salarié.'],
            ['Le CDI de chantier prend fin…', ['Au bout de 18 mois obligatoirement', 'À l’achèvement du chantier ou de l’opération', 'À la volonté du client', 'Jamais'], 1, 'Sa fin est prévisible, mais sa date exacte ne l’est pas.'],
            ['La démission ouvre en principe droit à l’allocation chômage.', ['Vrai', 'Faux'], 1, 'Sauf cas de démission légitime ou de projet de reconversion reconnu.'],
          ],
        },
        {
          titre: 'Les libertés du salarié',
          axe: 'Droit — Thème 7 : Comment le droit encadre-t-il le travail salarié ?',
          lecon: {
            titre: 'Un citoyen dans l’entreprise',
            cours: `Signer un contrat de travail ne fait pas perdre ses libertés de citoyen. Le salarié garde sa liberté d’expression, sa vie privée, sa liberté syndicale et le droit de grève. Mais ces libertés s’**articulent** avec les besoins de l’entreprise.

## Le principe : des restrictions justifiées et proportionnées
L’article **L. 1121-1 du Code du travail** pose la règle : nul ne peut apporter aux droits des personnes et aux libertés individuelles et collectives des restrictions qui ne seraient **pas justifiées par la nature de la tâche** à accomplir ni **proportionnées au but recherché**.
Exemple : imposer une tenue de sécurité sur un chantier est justifié ; interdire toute barbe à un comptable ne l’est pas.

## La liberté d’expression et le devoir de loyauté
- Le salarié peut **s’exprimer**, dans et hors de l’entreprise, y compris pour critiquer son employeur.
- Limite : l’**abus**, c’est-à-dire des propos **injurieux**, **diffamatoires** ou **excessifs**.
- Il est tenu d’un **devoir de loyauté** : ne pas dénigrer publiquement l’entreprise, ne pas la concurrencer, respecter la confidentialité.
- Les **lanceurs d’alerte** qui signalent de bonne foi certaines violations graves sont protégés contre les représailles.

## Le respect de la vie privée
- La vie personnelle du salarié ne regarde pas l’employeur : un fait de la vie privée ne peut pas, en principe, justifier une sanction, sauf s’il crée un **trouble caractérisé** dans l’entreprise ou manque à une obligation du contrat.
- Les **messages identifiés comme personnels**, même sur l’ordinateur professionnel, sont protégés par le **secret des correspondances**.
- Les dispositifs de **surveillance** (caméras, géolocalisation) doivent être justifiés, proportionnés et portés à la connaissance des salariés ; le RGPD s’applique.

## Les libertés collectives
### Le droit de grève
La **grève** est une **cessation collective et concertée du travail** en vue d’appuyer des **revendications professionnelles**.
| Point | Règle |
| Préavis | Pas de préavis dans le secteur privé ; **5 jours** dans les services publics |
| Salaire | Il n’est pas versé pour le temps de grève |
| Sanction | Interdite, sauf **faute lourde** du salarié gréviste |
| Grève illicite | Grève perlée (ralentir le travail), revendications purement politiques, occupation bloquante |

### La liberté syndicale
Chacun est libre d’adhérer ou non à un syndicat ; aucune discrimination n’est permise pour ce motif.

## Les représentants du personnel
| Institution | Seuil | Mission essentielle |
| **Comité social et économique (CSE)** | Entreprises d’au moins **11 salariés** | Élu : porte les réclamations, est informé et consulté sur la marche de l’entreprise ; attributions économiques élargies à partir de 50 salariés |
| **Délégué syndical** | Entreprises d’au moins **50 salariés** | Désigné par un syndicat représentatif : **négocie** les accords d’entreprise |

> Dans l’entreprise, la liberté est le principe et la restriction l’exception, qui doit se justifier.

## Exemple travaillé
Faits : un salarié publie sur un réseau social public : « Mon patron est un escroc qui vole ses clients », sans aucune preuve.
- Problème de droit : ce propos relève-t-il de la liberté d’expression ou d’un abus ?
- Règle : la liberté d’expression du salarié est protégée, sauf abus (propos injurieux, diffamatoires, excessifs).
- Application : l’accusation publique et non prouvée d’escroquerie est diffamatoire.
- Solution : abus de la liberté d’expression, qui peut justifier une sanction disciplinaire.`,
          },
          questions: [
            ['Selon l’article L. 1121-1 du Code du travail, les restrictions aux libertés des salariés doivent être…', ['Justifiées par la nature de la tâche et proportionnées au but recherché', 'Décidées par le seul client', 'Votées par le Parlement à chaque fois', 'Illimitées'], 0, 'La liberté est le principe, la restriction l’exception justifiée.'],
            ['Quand la liberté d’expression d’un salarié devient-elle un abus ?', ['Dès qu’il critique l’entreprise', 'Quand ses propos sont injurieux, diffamatoires ou excessifs', 'Quand il parle à un collègue', 'Jamais'], 1, 'La critique est permise, l’abus ne l’est pas.'],
            ['Comment définit-on la grève ?', ['Un ralentissement volontaire du travail', 'Une cessation collective et concertée du travail pour des revendications professionnelles', 'Une absence individuelle injustifiée', 'Une manifestation politique quelconque'], 1, 'La grève perlée (ralentissement) n’est pas une grève licite.'],
            ['Dans le secteur privé, un préavis de grève est obligatoire.', ['Vrai', 'Faux'], 1, 'Le préavis de 5 jours ne concerne que les services publics.'],
            ['Un gréviste peut être licencié pour avoir fait grève…', ['Toujours', 'Seulement en cas de faute lourde', 'S’il est en CDD', 'Si la grève dure plus d’un jour'], 1, 'Faire grève est un droit constitutionnel ; seule la faute lourde permet une sanction.'],
            ['À partir de combien de salariés un CSE doit-il être mis en place ?', ['5', '11', '50', '300'], 1, 'L’effectif d’au moins 11 salariés doit être atteint pendant 12 mois consécutifs.'],
            ['Quel est le rôle essentiel du délégué syndical ?', ['Négocier les accords d’entreprise', 'Juger les litiges', 'Fixer les prix', 'Diriger l’entreprise'], 0, 'Il est désigné par un syndicat représentatif, dans les entreprises d’au moins 50 salariés.'],
            ['Un message identifié comme « personnel » sur l’ordinateur professionnel…', ['Peut être librement lu par l’employeur', 'Est protégé par le secret des correspondances', 'Appartient au client', 'Doit être publié'], 1, 'L’employeur ne peut pas l’ouvrir hors de la présence du salarié ou de circonstances particulières.'],
            ['Le devoir de loyauté interdit notamment au salarié de…', ['Critiquer poliment un choix de gestion', 'Concurrencer son employeur pendant son contrat', 'Adhérer à un syndicat', 'Prendre ses congés'], 1, 'Il doit exécuter son contrat de bonne foi.'],
            ['Chacun est libre d’adhérer ou non à un syndicat.', ['Vrai', 'Faux'], 0, 'C’est la liberté syndicale ; aucune discrimination n’est permise pour ce motif.'],
            ['Pendant une grève, le salaire…', ['Est versé intégralement', 'N’est pas versé pour le temps de grève', 'Est doublé', 'Est versé par l’État'], 1, 'La retenue doit être proportionnelle à la durée de l’arrêt de travail.'],
            ['Une caméra de surveillance au poste de travail doit être…', ['Cachée aux salariés', 'Justifiée, proportionnée et portée à la connaissance des salariés', 'Installée dans les vestiaires', 'Reliée à un réseau social'], 1, 'Le RGPD et le Code du travail encadrent la surveillance.'],
          ],
        },

        // ---- Droit — Thème 8 : Dans quel cadre et comment entreprendre ? ---
        {
          titre: 'L’entreprise individuelle',
          axe: 'Droit — Thème 8 : Dans quel cadre et comment entreprendre ?',
          lecon: {
            titre: 'Entreprendre seul, sans tout risquer',
            cours: `La **liberté d’entreprendre** permet à chacun de lancer son activité. La forme la plus simple et la plus ancienne est l’**entreprise individuelle** : l’entrepreneur exerce en son nom propre, **sans créer de personne morale**. Toute la question est celle du **risque** : que se passe-t-il pour ses biens personnels si l’activité échoue ?

## L’entreprise individuelle : pas de nouvelle personne
Dans l’entreprise individuelle, il n’y a **qu’une personne juridique** : l’entrepreneur lui-même. Pas de capital à apporter, pas de statuts : les formalités sont légères.

## Le principe historique : l’unicité du patrimoine
Selon la théorie classique (Aubry et Rau, XIXe siècle), une personne n’a qu’**un seul patrimoine**. Conséquence ancienne : l’entrepreneur individuel répondait des **dettes professionnelles** sur **tous ses biens**, y compris sa maison. Un échec pouvait ruiner la famille.

## Une protection construite pas à pas
@ 2003 — la **déclaration d’insaisissabilité** permet de protéger, par acte notarié, sa résidence principale contre les créanciers professionnels
@ 2010 — l’**EIRL** crée un **patrimoine d’affectation** : l’entrepreneur déclare les biens affectés à son activité
@ 2015 — la **résidence principale** devient **insaisissable de plein droit** par les créanciers professionnels
@ 2022 — la loi du 14 février crée le **statut unique de l’entrepreneur individuel** : séparation **automatique** des patrimoines ; l’EIRL est fermée aux nouvelles créations

## Le droit en vigueur : deux patrimoines, de plein droit
Depuis le **15 mai 2022**, tout entrepreneur individuel a :
| Patrimoine **professionnel** | Patrimoine **personnel** |
| Les biens **utiles à l’activité** (outils, stock, local, clientèle) | Tous les autres biens (logement, épargne personnelle…) |
| Seul gage des **créanciers professionnels** | Seul gage des créanciers personnels (sauf insuffisance) |
Exceptions : l’entrepreneur peut **renoncer** à cette protection au profit d’un créancier (souvent une banque qui l’exige) ; certaines dettes fiscales et sociales, et les cas de **fraude** ou de manquements graves, permettent de saisir le patrimoine personnel.

> Aujourd’hui, entreprendre seul ne signifie plus risquer sa maison : la séparation des patrimoines est automatique.

## Micro-entrepreneur : un régime, pas une forme juridique
Le **micro-entrepreneur** (ex-auto-entrepreneur) est un entrepreneur individuel qui bénéficie d’un **régime simplifié** de calcul des cotisations et de l’impôt, sous des plafonds de chiffre d’affaires. Juridiquement, c’est une entreprise individuelle comme les autres.

## Limites de l’entreprise individuelle
- Difficile d’**associer** d’autres personnes ou de lever des capitaux.
- L’entrepreneur reste **seul décideur** et seul responsable de la gestion.
- Pour grandir ou s’associer, il peut créer une **société**, par exemple une **EURL** ou une **SASU** (société avec un associé unique, dotée de la personnalité morale).

## Exemple travaillé
Faits : Nadia, graphiste en entreprise individuelle depuis 2023, doit 25 000 € à un fournisseur de matériel. Son activité s’arrête. Le fournisseur veut saisir son appartement personnel.
- Problème de droit : un créancier professionnel peut-il saisir les biens personnels d’un entrepreneur individuel ?
- Règle : depuis le 15 mai 2022, les créanciers professionnels n’ont pour gage que le patrimoine professionnel, sauf renonciation ou fraude.
- Application : Nadia n’a signé aucune renonciation ; il n’y a pas de fraude ; son appartement relève du patrimoine personnel.
- Solution : le fournisseur ne peut saisir que les biens professionnels de Nadia.`,
          },
          questions: [
            ['L’entreprise individuelle crée-t-elle une nouvelle personne juridique ?', ['Oui, une personne morale', 'Non, l’entrepreneur exerce en son nom propre', 'Oui, mais seulement au-delà de 10 salariés', 'Oui, une association'], 1, 'Il n’y a qu’une personne : l’entrepreneur lui-même.'],
            ['Que disait la théorie classique de l’unicité du patrimoine ?', ['Une personne a plusieurs patrimoines', 'Une personne n’a qu’un seul patrimoine', 'Le patrimoine appartient à l’État', 'Le patrimoine se limite aux biens immobiliers'], 1, 'D’où, autrefois, la saisie possible de tous les biens de l’entrepreneur.'],
            ['Depuis quand la séparation des patrimoines de l’entrepreneur individuel est-elle automatique ?', ['2003', '2010', 'Le 15 mai 2022', '2026'], 2, 'C’est l’effet de la loi du 14 février 2022.'],
            ['Quel est désormais le gage des créanciers professionnels d’un entrepreneur individuel ?', ['Tous ses biens', 'Son patrimoine professionnel', 'Uniquement sa résidence principale', 'Les biens de ses parents'], 1, 'Sauf renonciation de l’entrepreneur, fraude ou certaines dettes fiscales et sociales.'],
            ['L’EIRL peut encore être choisie pour une nouvelle création d’entreprise.', ['Vrai', 'Faux'], 1, 'Elle est fermée aux nouvelles créations depuis février 2022 : le statut unique l’a rendue inutile.'],
            ['Qu’était le patrimoine d’affectation de l’EIRL ?', ['Un patrimoine dédié à l’activité professionnelle, distinct du patrimoine personnel', 'Un compte épargne', 'Une société commerciale', 'Une assurance'], 0, 'C’était l’étape qui a préparé la séparation automatique de 2022.'],
            ['Depuis 2015, la résidence principale de l’entrepreneur individuel est…', ['Saisissable par tous', 'Insaisissable de plein droit par ses créanciers professionnels', 'Propriété de la banque', 'Obligatoirement louée'], 1, 'La loi Macron a rendu automatique ce que la déclaration notariée permettait depuis 2003.'],
            ['Le micro-entrepreneur est…', ['Une forme de société', 'Un entrepreneur individuel qui bénéficie d’un régime fiscal et social simplifié', 'Un salarié', 'Un fonctionnaire'], 1, 'C’est un régime, pas une forme juridique distincte.'],
            ['Un entrepreneur individuel peut renoncer à la protection de son patrimoine personnel au profit d’un créancier.', ['Vrai', 'Faux'], 0, 'Une banque l’exige parfois pour accorder un prêt.'],
            ['Quelle est une limite de l’entreprise individuelle ?', ['Des formalités de création très lourdes', 'La difficulté d’associer d’autres personnes et de lever des capitaux', 'L’obligation d’avoir 50 salariés', 'L’interdiction de vendre'], 1, 'Pour s’associer, il faut passer en société.'],
            ['Quelle forme permet d’entreprendre seul avec une personne morale distincte ?', ['L’association', 'L’EURL ou la SASU', 'Le CDI', 'La franchise'], 1, 'Ce sont des sociétés à associé unique.'],
            ['Qu’a permis la déclaration d’insaisissabilité créée en 2003 ?', ['De protéger par acte notarié sa résidence principale contre les créanciers professionnels', 'De ne pas payer d’impôt', 'De créer une société sans capital', 'D’embaucher sans contrat'], 0, 'C’est la première étape de la protection de l’entrepreneur individuel.'],
          ],
        },
        {
          titre: 'La société commerciale et la coopérative',
          axe: 'Droit — Thème 8 : Dans quel cadre et comment entreprendre ?',
          lecon: {
            titre: 'S’associer pour entreprendre',
            cours: `Pour entreprendre à plusieurs, réunir des capitaux et limiter son risque, on crée une **société**. Elle naît d’un **contrat**, mais devient une **personne morale** distincte des associés.

## Le contrat de société (art. 1832 du Code civil)
« La société est instituée par **deux ou plusieurs personnes** qui conviennent par un contrat d’**affecter à une entreprise commune** des biens ou leur industrie en vue de **partager le bénéfice** ou de profiter de l’**économie** qui pourra en résulter. Elle peut être instituée, dans les cas prévus par la loi, par l’acte de volonté d’**une seule personne**. Les associés s’engagent à **contribuer aux pertes**. »
Trois éléments en découlent :
| Élément | Signification |
| **Les apports** | Chaque associé apporte quelque chose |
| **L’affectio societatis** | La volonté de collaborer sur un pied d’égalité à l’entreprise commune |
| **Le partage des résultats** | Bénéfices ou économies à partager, et pertes à supporter |

## Les apports
| Type d’apport | Exemple | Contrepartie |
| **En numéraire** | De l’argent | Des parts ou actions |
| **En nature** | Un local, une machine, un fonds de commerce | Des parts ou actions |
| **En industrie** | Son travail, son savoir-faire (possible dans certaines sociétés, comme la SARL et la SAS) | Des parts qui ne concourent pas au capital |
Les bénéfices sont en principe répartis **au prorata** des apports.

## La personnalité morale et la limitation de responsabilité
Une fois **immatriculée** au registre du commerce et des sociétés (RCS), la société a la **personnalité morale** : un nom (dénomination sociale), un siège, un patrimoine propre. Dans les sociétés les plus courantes (SARL, SAS, SA), la responsabilité des associés est **limitée à leurs apports** : ils peuvent perdre ce qu’ils ont apporté, pas davantage.

## Les formes courantes
| Forme | Associés | Dirigeant |
| **SARL** (EURL si un seul associé) | 1 à 100 | Un ou plusieurs **gérants** |
| **SAS** (SASU si un seul associé) | 1 ou plus | Un **président** ; grande liberté des statuts |
| **SA** | 2 au moins (7 si cotée) | Conseil d’administration et directeur général, ou directoire |

## Les organes de décision
- Les **organes de gestion** (gérant, président, directeur général) gèrent au quotidien et représentent la société.
- Les **organes délibératifs** (assemblée générale des associés) prennent les grandes décisions : approbation des comptes, affectation du résultat, modification des statuts, nomination des dirigeants.

## La société coopérative (SCOP)
Dans une **société coopérative et participative** (SCOP), les **salariés** sont les associés majoritaires : ils détiennent au moins **51 % du capital** et **65 % des droits de vote**. Son **éthique** repose sur :
1. la **démocratie** : « une personne, une voix », quel que soit le capital détenu ;
2. le **partage** des résultats : une part pour les salariés, une part pour les **réserves impartageables** qui renforcent l’entreprise, une part limitée pour le capital ;
3. la **pérennité** de l’emploi plutôt que la rémunération maximale du capital.

> Dans une société de capitaux, le pouvoir suit l’argent apporté ; dans une coopérative, il suit les personnes.

## Exemple travaillé
Faits : Léo apporte 20 000 € et Sarah un local estimé à 30 000 € ; ils créent une SAS de restauration. La première année, la SAS dégage 10 000 € de bénéfice distribuable ; la deuxième, elle fait faillite avec 80 000 € de dettes.
- Apports : Léo en numéraire (40 %), Sarah en nature (60 %).
- Bénéfice partagé au prorata : Léo 4 000 €, Sarah 6 000 €.
- Faillite : responsabilité limitée aux apports ; les créanciers ne peuvent pas saisir les biens personnels des associés (sauf garanties personnelles données ou faute de gestion).`,
          },
          questions: [
            ['Quel article du Code civil définit le contrat de société ?', ['Article 1101', 'Article 1240', 'Article 1832', 'Article 544'], 2, 'Il pose les apports, l’entreprise commune, le partage des résultats et la contribution aux pertes.'],
            ['Qu’est-ce que l’affectio societatis ?', ['La volonté des associés de collaborer sur un pied d’égalité à l’entreprise commune', 'Le montant du capital', 'Le nom de la société', 'La liste des clients'], 0, 'Sans cette volonté commune, il n’y a pas de société.'],
            ['Apporter un local à une société, c’est un apport…', ['En numéraire', 'En nature', 'En industrie', 'Fictif'], 1, 'Un bien autre que de l’argent : apport en nature.'],
            ['Apporter son savoir-faire et son travail, c’est un apport…', ['En nature', 'En numéraire', 'En industrie', 'En compte courant'], 2, 'Il ne concourt pas au capital social.'],
            ['Quand une société acquiert-elle la personnalité morale ?', ['À la signature d’un devis', 'À son immatriculation au registre du commerce et des sociétés', 'Au premier bénéfice', 'Au premier salarié embauché'], 1, 'Elle a alors un nom, un siège et un patrimoine propres.'],
            ['Dans une SARL, la responsabilité des associés est limitée à leurs apports.', ['Vrai', 'Faux'], 0, 'Ils ne perdent au plus que ce qu’ils ont apporté.'],
            ['Deux associés ont apporté respectivement 30 % et 70 % du capital. Le bénéfice distribué est de 20 000 €. Combien reçoit le premier ?', ['3 000 €', '6 000 €', '10 000 €', '14 000 €'], 1, 'Au prorata des apports : 20 000 × 30 % = 6 000 €.'],
            ['Quel est le dirigeant d’une SAS ?', ['Un gérant', 'Un président', 'Un maire', 'Un commissaire aux comptes'], 1, 'La SARL a un gérant, la SAS un président.'],
            ['Quel organe approuve les comptes et décide de l’affectation du résultat ?', ['Le gérant seul', 'L’assemblée générale des associés', 'Le comité social et économique', 'Le client principal'], 1, 'C’est l’organe délibératif de la société.'],
            ['Dans une SCOP, les salariés détiennent au moins…', ['10 % du capital', '51 % du capital', '100 % des droits de vote', '5 % des droits de vote'], 1, 'Et au moins 65 % des droits de vote.'],
            ['Quel principe de vote s’applique dans une coopérative ?', ['Une action, une voix', 'Une personne, une voix', 'Le fondateur décide seul', 'Le vote est interdit'], 1, 'Le pouvoir suit les personnes, pas le capital.'],
            ['Une société peut être instituée par une seule personne dans les cas prévus par la loi.', ['Vrai', 'Faux'], 0, 'EURL et SASU en sont les exemples.'],
          ],
        },
        {
          titre: 'Concurrence loyale et partenariats',
          axe: 'Droit — Thème 8 : Dans quel cadre et comment entreprendre ?',
          lecon: {
            titre: 'Se battre à la loyale, s’allier dans les règles',
            cours: `La **liberté du commerce et de l’industrie** (issue du décret d’Allarde de 1791) fonde la **libre concurrence**. Mais cette liberté est encadrée : on peut prendre les clients d’un concurrent, pas par n’importe quel moyen. Et les entreprises qui coopèrent doivent le faire sans fausser le marché.

## La concurrence déloyale
Attirer la clientèle d’un concurrent est **licite** : c’est le jeu normal de la concurrence. Ce qui est sanctionné, ce sont les **moyens déloyaux**.
| Pratique déloyale | Exemple |
| **Dénigrement** | Jeter publiquement le discrédit sur les produits d’un concurrent |
| **Confusion** | Imiter le nom, le logo ou l’emballage pour tromper le client |
| **Désorganisation** | Débaucher massivement le personnel clé, détourner des fichiers clients |
| **Parasitisme** | Profiter sans rien payer des efforts et investissements d’autrui |

## L’action en concurrence déloyale
Elle repose sur la **responsabilité civile extracontractuelle** (art. 1240 du Code civil). Le demandeur doit prouver :
1. une **faute** (l’acte déloyal) ;
2. un **préjudice** (perte de clientèle, atteinte à l’image) ;
3. un **lien de causalité** entre les deux.
Le juge peut accorder des **dommages et intérêts** et ordonner la **cessation** des agissements.

## Les partenariats contractuels
Pour se développer, une entreprise peut contracter avec d’autres entreprises **indépendantes**. Ces contrats se distinguent nettement du contrat de travail : **aucun lien de subordination**.
| Contrat | Principe | Principales obligations |
| **Franchise** | Le **franchiseur** met à disposition sa **marque**, son **savoir-faire** et une **assistance** ; le **franchisé**, commerçant indépendant, exploite l’enseigne | Franchiseur : informer avant la signature (document d’information précontractuelle remis au moins 20 jours avant), transmettre le savoir-faire, assister ; franchisé : payer droit d’entrée et **redevances**, respecter les normes du réseau |
| **Contrat d’entreprise (sous-traitance)** | Le donneur d’ordre confie à un **sous-traitant** la réalisation d’une partie de sa production ou d’un travail | Sous-traitant : exécuter selon le cahier des charges ; donneur d’ordre : payer le prix |

## Ne pas fausser la concurrence
Les accords entre entreprises sont interdits lorsqu’ils conduisent à :
- une **entente illicite** : accord ou action concertée entre entreprises pour fausser la concurrence (fixer ensemble les prix, se répartir les marchés ou les clients) ;
- un **abus de position dominante** : une entreprise qui domine un marché en abuse (prix prédateurs, conditions discriminatoires, refus de vente injustifié). Être dominant n’est pas interdit ; **abuser** l’est.
Ces pratiques sont réprimées par l’**Autorité de la concurrence** (en France) et la **Commission européenne**, avec des amendes pouvant atteindre **10 % du chiffre d’affaires mondial** du groupe concerné.

> La concurrence est libre, mais elle doit rester loyale entre concurrents et ouverte sur le marché.

## Exemple travaillé
Faits : la boulangerie Au Bon Pain, installée depuis vingt ans, voit s’ouvrir en face « Au Bon Pains », avec un logo quasi identique. Plusieurs clients se trompent de boutique.
- Qualification : pratique de **confusion**, acte de concurrence déloyale.
- Règle : art. 1240 : faute, préjudice, lien de causalité.
- Application : faute (imitation du nom et du logo), préjudice (clientèle détournée), lien (les clients se trompent à cause de la ressemblance).
- Solution : Au Bon Pain peut obtenir des dommages et intérêts et la modification de l’enseigne concurrente.`,
          },
          questions: [
            ['Attirer la clientèle d’un concurrent est…', ['Toujours interdit', 'Licite, sauf si l’on utilise des moyens déloyaux', 'Réservé aux entreprises publiques', 'Une infraction pénale'], 1, 'C’est le jeu normal de la concurrence ; seuls les moyens déloyaux sont fautifs.'],
            ['Sur quel fondement repose l’action en concurrence déloyale ?', ['Le contrat de travail', 'La responsabilité civile extracontractuelle (art. 1240)', 'Le droit pénal uniquement', 'Le droit de la famille'], 1, 'Il faut prouver une faute, un préjudice et un lien de causalité.'],
            ['Imiter le logo d’un concurrent pour tromper les clients, c’est…', ['Du dénigrement', 'Une pratique de confusion', 'Du parasitisme autorisé', 'Une franchise'], 1, 'La confusion cherche à faire croire que l’on est le concurrent.'],
            ['Critiquer publiquement et sans fondement les produits d’un concurrent, c’est…', ['Du dénigrement', 'De la sous-traitance', 'Une entente', 'Une publicité comparative licite'], 0, 'Jeter le discrédit sur un concurrent est un acte déloyal.'],
            ['Dans un contrat de franchise, que verse le franchisé ?', ['Un salaire au franchiseur', 'Un droit d’entrée et des redevances', 'Des dividendes obligatoires', 'Rien'], 1, 'En échange de la marque, du savoir-faire et de l’assistance.'],
            ['Le franchisé est un salarié du franchiseur.', ['Vrai', 'Faux'], 1, 'C’est un commerçant indépendant ; il n’y a pas de lien de subordination.'],
            ['Des entreprises qui fixent ensemble leurs prix forment…', ['Un partenariat licite', 'Une entente illicite', 'Une coopérative', 'Une franchise'], 1, 'L’accord fausse la concurrence au détriment des clients.'],
            ['Occuper une position dominante sur un marché est interdit.', ['Vrai', 'Faux'], 1, 'Être dominant est permis ; en abuser est interdit.'],
            ['Quelle autorité française sanctionne les ententes et abus de position dominante ?', ['L’Autorité de la concurrence', 'La CNIL', 'Le conseil de prud’hommes', 'L’INSEE'], 0, 'La Commission européenne intervient aussi à l’échelle de l’Union.'],
            ['Quel plafond d’amende peut frapper une pratique anticoncurrentielle ?', ['1 000 €', '10 % du chiffre d’affaires mondial', '1 % du bénéfice', 'Aucun plafond'], 1, 'Le montant est proportionné à la gravité et à la taille de l’entreprise.'],
            ['Confier la fabrication d’une pièce à une autre entreprise selon un cahier des charges, c’est…', ['La sous-traitance', 'La franchise', 'Le contrat de travail', 'L’entente'], 0, 'C’est un contrat d’entreprise entre donneur d’ordre et sous-traitant.'],
            ['Que peut ordonner le juge saisi d’une action en concurrence déloyale ?', ['Des dommages et intérêts et la cessation des agissements', 'La prison automatique du dirigeant', 'La fermeture de toutes les entreprises du secteur', 'Le rachat forcé du concurrent'], 0, 'Réparer le préjudice et faire cesser le trouble.'],
          ],
        },

        // ---- Économie — Thème 6 : Comment l’État peut-il intervenir ? ------
        {
          titre: 'L’État dans l’économie et les défaillances de marché',
          axe: 'Économie — Thème 6 : Comment l’État peut-il intervenir dans l’économie ?',
          lecon: {
            titre: 'Pourquoi le marché ne suffit pas toujours, et l’État non plus',
            cours: `Faut-il laisser faire le marché ou faire intervenir l’État ? Le débat oppose depuis longtemps les **libéraux**, partisans d’une intervention minimale, et les **interventionnistes**, pour qui l’État doit corriger les insuffisances du marché. Pour trancher, il faut comprendre ce que le marché fait mal… et ce que l’État peut faire mal aussi.

## De l’État gendarme à l’État-providence
| | **État gendarme** | **État-providence** |
| Fonctions | **Régaliennes** : ordre public, justice, défense, prélèvement de l’impôt | Régaliennes **plus** interventions économiques et sociales |
| Idée | Le marché s’autorégule | Le marché a besoin d’être corrigé et complété |
| Période | XIXe siècle | Surtout après 1945 |
L’État moderne combine trois fonctions économiques : **allocation** des ressources (produire ce que le marché ne produit pas), **redistribution** des revenus, **stabilisation** de l’activité.

## Mesurer la place de l’État
= Taux de prélèvements obligatoires = (impôts + cotisations sociales) ÷ PIB × 100
En France, ce taux dépasse largement 40 % du PIB, l’un des plus élevés de l’OCDE. L’État est aussi **employeur**, **actionnaire** d’entreprises publiques ou semi-publiques, et **régulateur** : il a ouvert à la concurrence d’anciens monopoles publics (télécommunications, énergie, transport ferroviaire).

## Déficit public et dette publique
- **Déficit public** (un flux, sur une année) : quand les **dépenses publiques** dépassent les **recettes**.
- **Dette publique** (un stock) : la somme des emprunts accumulés et non remboursés. Chaque déficit **alimente** la dette.
= Solde public = recettes publiques − dépenses publiques

## Les quatre défaillances du marché
| Défaillance | Explication | Réponse de l’État |
| **Asymétrie d’information** | Un acteur en sait plus que l’autre (le vendeur de voiture d’occasion sur ses défauts) | Informer, imposer des labels, des garanties ; autorités comme l’AMF |
| **Concurrence imparfaite** | Monopole, entente : prix trop élevés, quantités trop faibles | **Politique de la concurrence** |
| **Externalités** | L’activité d’un agent affecte les autres sans compensation : **négative** (pollution) ou **positive** (recherche, vaccination) | Taxer ou réglementer les négatives ; subventionner les positives |
| **Biens publics et biens communs** | Bien **public** : **non rival** et **non exclusif** (éclairage public, défense) ; bien **commun** : **rival** mais non exclusif (poissons de l’océan), menacé de surexploitation | Produire les biens publics ; réglementer l’usage des biens communs (quotas de pêche) |

## Les défaillances de l’État
L’intervention publique peut elle aussi échouer : **coût** élevé et prélèvements qui découragent l’activité, **lenteur** des décisions, **mauvaise information** des décideurs, pression des **groupes d’intérêt**, effets pervers imprévus. D’où l’exigence d’**évaluer** les politiques publiques.

> Le marché a ses défaillances, l’État aussi : la question n’est pas « marché ou État ? » mais « quelle intervention, pour quelle défaillance, à quel coût ? ».

## Exemple travaillé
Recettes publiques : 1 500 milliards d’euros ; dépenses publiques : 1 650 milliards ; PIB : 3 000 milliards.
- Solde public = 1 500 − 1 650 = **− 150 milliards** : un déficit.
- Déficit en % du PIB = 150 ÷ 3 000 × 100 = **5 %**.
- Ce déficit s’ajoute à la dette publique de l’année précédente.`,
          },
          questions: [
            ['Quelles sont les fonctions de l’État gendarme ?', ['Uniquement les fonctions régaliennes : ordre public, justice, défense, impôt', 'La protection sociale universelle', 'La planification de toute la production', 'La gestion de toutes les entreprises'], 0, 'L’État-providence y ajoute des interventions économiques et sociales.'],
            ['Comment calcule-t-on le taux de prélèvements obligatoires ?', ['(Impôts + cotisations sociales) ÷ PIB × 100', 'Dépenses publiques − recettes publiques', 'Dette ÷ population', 'Impôts ÷ nombre de contribuables'], 0, 'Il mesure le poids des prélèvements dans la richesse produite.'],
            ['Quelle est la différence entre déficit public et dette publique ?', ['Aucune', 'Le déficit est un flux annuel, la dette un stock accumulé', 'La dette est annuelle, le déficit cumulé', 'Le déficit ne concerne que les communes'], 1, 'Chaque déficit s’ajoute à la dette.'],
            ['La pollution d’une usine qui nuit aux riverains sans compensation est…', ['Une externalité positive', 'Une externalité négative', 'Un bien public', 'Une asymétrie d’information'], 1, 'L’État peut la taxer ou la réglementer.'],
            ['Un bien public est…', ['Rival et exclusif', 'Non rival et non exclusif', 'Produit uniquement par les entreprises', 'Toujours payant'], 1, 'L’éclairage public ou la défense nationale : personne n’en est exclu et l’usage de l’un n’empêche pas celui de l’autre.'],
            ['Les poissons de l’océan sont un exemple de…', ['Bien public', 'Bien commun', 'Bien de luxe', 'Externalité positive'], 1, 'Rivaux mais non exclusifs, ils sont menacés de surexploitation.'],
            ['Le vendeur d’une voiture d’occasion connaît mieux ses défauts que l’acheteur. C’est…', ['Une externalité', 'Une asymétrie d’information', 'Un bien public', 'Un monopole naturel'], 1, 'L’État peut imposer garanties et contrôles techniques.'],
            ['L’intervention de l’État est toujours efficace.', ['Vrai', 'Faux'], 1, 'Coûts, lenteurs, mauvaise information : on parle de défaillances de l’État.'],
            ['Recettes 800 Md€, dépenses 860 Md€, PIB 2 000 Md€. Quel est le déficit en % du PIB ?', ['3 %', '6 %', '30 %', '60 %'], 0, '(860 − 800) ÷ 2 000 × 100 = 3 %.'],
            ['Quelle réponse publique correspond à une externalité positive comme la recherche ?', ['La taxer lourdement', 'La subventionner', 'L’interdire', 'L’ignorer'], 1, 'Sans aide, elle serait produite en quantité insuffisante.'],
            ['Quelle politique répond à la concurrence imparfaite ?', ['La politique de la concurrence', 'La politique familiale', 'La politique culturelle', 'La politique de défense'], 0, 'Elle lutte contre les ententes et les abus de position dominante.'],
            ['La fonction de redistribution de l’État vise à…', ['Corriger la répartition des revenus', 'Produire des armes', 'Fixer le prix de toutes les marchandises', 'Supprimer l’impôt'], 0, 'Avec l’allocation et la stabilisation, c’est l’une des trois fonctions économiques de l’État.'],
          ],
        },
        {
          titre: 'Politiques économiques et politiques sociales',
          axe: 'Économie — Thème 6 : Comment l’État peut-il intervenir dans l’économie ?',
          lecon: {
            titre: 'Stabiliser l’activité, préparer l’avenir, protéger contre les risques',
            cours: `L’économie ne progresse pas en ligne droite : elle connaît des **fluctuations**. L’État, et en Europe l’Union et la Banque centrale européenne, disposent de **politiques économiques** pour les amortir, et de **politiques sociales** pour protéger les personnes et réduire les inégalités.

## Les fluctuations économiques
| Phase | Ce qui se passe |
| **Expansion** | La croissance est forte, le chômage baisse |
| **Récession** | La production recule (au moins deux trimestres de baisse du PIB, selon une convention courante) |
| **Dépression** | Recul profond et durable de la production |
| **Crise** | Retournement brutal de la conjoncture |

## Les politiques conjoncturelles
Elles agissent à **court terme** pour stabiliser l’activité, de façon **contracyclique** (à contre-courant du cycle).
| Politique | Qui la mène ? | Instruments | En cas de ralentissement |
| **Budgétaire** | Chaque État | Dépenses publiques, impôts | **Relance** : plus de dépenses, moins d’impôts (au prix d’un déficit) |
| **Monétaire** | La **BCE** pour la zone euro | Taux d’intérêt directeurs, création monétaire | Baisser les taux pour stimuler le crédit |
On distingue aussi les politiques **de demande** (soutenir la consommation et l’investissement) et **d’offre** (baisser les coûts de production, aider l’innovation, alléger les charges).

## Le cadre européen
- La **politique monétaire** de la zone euro est confiée à la **BCE**, indépendante, dont la priorité est la **stabilité des prix** (objectif d’inflation de **2 %** à moyen terme).
- Les **politiques budgétaires** restent nationales mais **encadrées** : repères de **3 % du PIB** pour le déficit public et **60 % du PIB** pour la dette publique, avec des procédures de surveillance.
- L’intégration vise la coordination des politiques, la convergence des taux d’intérêt et le développement des échanges.

## Les politiques structurelles
Elles agissent sur le **long terme** pour modifier le fonctionnement de l’économie : ouverture à la concurrence d’anciens monopoles, **politique de la concurrence** contre les cartels, soutien à la **recherche** et à l’**innovation**, économie de la connaissance, formation.

## Les politiques sociales
La **protection sociale** couvre les **risques sociaux** : maladie, invalidité, vieillesse, chômage, charges de famille, exclusion.
| Logique | Principe | Financement | Exemple |
| **Assurance** | On est couvert parce qu’on a **cotisé** | Cotisations sociales | Retraite de base, allocation chômage |
| **Assistance** | On est aidé parce qu’on est dans le **besoin** | Impôt | RSA, minimum vieillesse |
| **Universalité** | Tout le monde, sans condition | Impôt | Allocations familiales, protection maladie universelle |
Elle verse des **prestations en espèces** et offre des **services** (hôpital, crèches).

## Redistribution horizontale et verticale
- **Horizontale** : des bien-portants vers les malades, des actifs vers les retraités, des ménages sans enfant vers les familles — face aux **risques**.
- **Verticale** : des plus riches vers les plus pauvres, pour **réduire les inégalités** ; elle passe notamment par des prélèvements **progressifs** (le taux augmente avec le revenu, comme l’impôt sur le revenu) et des prestations sous condition de ressources.

> Stabiliser, préparer l’avenir, protéger : trois missions, trois familles d’outils, et toujours la question de leur financement.

## Exemple travaillé
Un impôt progressif simplifié : 0 % jusqu’à 10 000 €, 20 % de 10 000 à 30 000 €, 40 % au-delà. Pour 50 000 € de revenu :
- 0 + (20 000 × 20 %) + (20 000 × 40 %) = 4 000 + 8 000 = **12 000 €**.
- Taux moyen = 12 000 ÷ 50 000 = **24 %**, inférieur au taux marginal de 40 % : chaque taux ne s’applique qu’à sa tranche.`,
          },
          questions: [
            ['Une politique contracyclique consiste à…', ['Amplifier les fluctuations', 'Agir à contre-courant du cycle pour stabiliser l’activité', 'Ne rien faire', 'Supprimer la monnaie'], 1, 'On relance en période de ralentissement, on freine en surchauffe.'],
            ['Qui mène la politique monétaire de la zone euro ?', ['Chaque gouvernement', 'La Banque centrale européenne', 'Le Parlement européen', 'Le FMI'], 1, 'La BCE est indépendante des gouvernements.'],
            ['Quel est l’objectif d’inflation de la BCE ?', ['0 %', '2 % à moyen terme', '5 %', '10 %'], 1, 'Sa priorité est la stabilité des prix.'],
            ['Quels sont les repères européens pour le déficit et la dette publics ?', ['1 % et 30 % du PIB', '3 % et 60 % du PIB', '5 % et 100 % du PIB', '10 % et 90 % du PIB'], 1, 'Ils encadrent les politiques budgétaires nationales.'],
            ['Augmenter les dépenses publiques en période de ralentissement, c’est une politique…', ['Budgétaire de relance', 'Monétaire restrictive', 'Structurelle de concurrence', 'Sociale d’assistance'], 0, 'Elle soutient la demande, au prix d’un déficit.'],
            ['Une politique qui soutient l’innovation et la recherche sur le long terme est…', ['Conjoncturelle', 'Structurelle', 'Contracyclique', 'De rigueur'], 1, 'Elle modifie durablement le fonctionnement de l’économie.'],
            ['Dans la logique d’assurance, on est couvert parce qu’on a…', ['Des besoins', 'Cotisé', 'Voté', 'Un diplôme'], 1, 'L’assistance, elle, répond au besoin et se finance par l’impôt.'],
            ['Le RSA relève de la logique…', ['D’assurance', 'D’assistance', 'De capitalisation', 'De concurrence'], 1, 'Il est versé sous condition de ressources, financé par l’impôt.'],
            ['La redistribution verticale va…', ['Des bien-portants vers les malades', 'Des plus riches vers les plus pauvres', 'Des retraités vers les actifs', 'Des entreprises vers l’État uniquement'], 1, 'Elle vise à réduire les inégalités de revenus.'],
            ['Un impôt progressif a un taux qui augmente avec le revenu.', ['Vrai', 'Faux'], 0, 'L’impôt sur le revenu en France en est l’exemple.'],
            ['Avec 0 % jusqu’à 10 000 € et 20 % au-delà, quel impôt paie un revenu de 25 000 € ?', ['2 000 €', '3 000 €', '5 000 €', '5 500 €'], 1, '(25 000 − 10 000) × 20 % = 3 000 €.'],
            ['Une récession correspond à…', ['Une forte hausse de la production', 'Un recul de la production', 'Une baisse des prix uniquement', 'Une hausse des impôts'], 1, 'Par convention courante, au moins deux trimestres consécutifs de baisse du PIB.'],
          ],
        },

        // ---- Économie — Thème 7 : Emploi et chômage ------------------------
        {
          titre: 'Emploi et chômage',
          axe: 'Économie — Thème 7 : Quelle est l’influence de l’État sur l’évolution de l’emploi et du chômage ?',
          lecon: {
            titre: 'Mesurer le chômage, comprendre ses causes, agir contre lui',
            cours: `Le chômage est à la fois un **enjeu économique** (des ressources humaines inemployées) et **social** (niveau de vie, exclusion). Pour agir, l’État doit d’abord le **mesurer**, puis en comprendre les **causes**.

## Qui est chômeur ?
Selon le **Bureau international du travail (BIT)**, repris par l’INSEE, un chômeur est une personne en âge de travailler qui remplit **trois conditions** :
1. être **sans emploi** (ne pas avoir travaillé, ne serait-ce qu’une heure, pendant la semaine de référence) ;
2. être **disponible** pour travailler dans les deux semaines ;
3. avoir **cherché activement** un emploi dans le mois précédent (ou en avoir trouvé un qui commence dans moins de trois mois).
Un inscrit à France Travail n’est donc pas forcément chômeur au sens du BIT, et inversement.

## Les indicateurs
| Population | Composition |
| **Population active** | Actifs occupés (en emploi) + chômeurs |
| **Population inactive** | Élèves, étudiants, retraités, personnes au foyer… |
= Taux de chômage = chômeurs ÷ population active × 100
= Taux d’activité = population active ÷ population en âge de travailler (15-64 ans) × 100
= Taux d’emploi = actifs occupés ÷ population en âge de travailler × 100
Le **sous-emploi** regroupe notamment les personnes à temps partiel qui souhaiteraient travailler davantage.

## Offre et demande sur le marché du travail
Attention au vocabulaire, qui s’inverse :
| Sur le marché du travail | Qui ? | Autre nom |
| **Offre de travail** | Les **ménages** qui proposent leur travail | **Demande d’emploi** |
| **Demande de travail** | Les **entreprises** qui ont besoin de main-d’œuvre | **Offre d’emploi** |
La **demande de travail** des entreprises dépend de quatre facteurs : la **demande** pour leurs produits (la **demande anticipée**), la **productivité** du travail, la **substituabilité** entre travail et capital, le **coût du travail**.

## Les formes de chômage
| Forme | Cause |
| **Frictionnel** | Temps de passage d’un emploi à l’autre, même au plein emploi |
| **Conjoncturel** | **Insuffisance de la demande** de biens et services lors d’un ralentissement : les entreprises produisent moins, donc embauchent moins |
| **Structurel** | Durable, lié au fonctionnement du marché du travail : **inadéquation des qualifications**, rigidités, coût du travail élevé pour les moins qualifiés, contraintes légales et conventionnelles |
Le **plein emploi** ne signifie pas zéro chômeur : il subsiste un chômage frictionnel.

## Salaire, négociations et contraintes
Le salaire se fixe par la **négociation** (individuelle, collective) et sous des **contraintes légales et conventionnelles**, comme le **salaire minimum** (SMIC). Débat : le SMIC protège le pouvoir d’achat des salariés modestes, mais un coût du travail trop élevé pourrait freiner l’embauche des moins qualifiés — d’où les **allègements de cotisations** sur les bas salaires.

## Les politiques de l’emploi
| Politiques **actives** | Politiques **passives** |
| Agir sur le fonctionnement du marché du travail pour **créer des emplois** ou **aider à en retrouver** | **Atténuer les conséquences** du chômage |
| Formation, accompagnement, aides à l’embauche, allègements de cotisations, contrats aidés | Indemnisation des chômeurs, (autrefois) préretraites |
Contre le **chômage conjoncturel**, l’État peut **relancer la demande** (dépenses publiques) ; dans la zone euro, la politique monétaire appartient à la BCE.

> Pour bien agir contre le chômage, il faut d’abord savoir s’il est conjoncturel (manque de demande) ou structurel (fonctionnement du marché du travail).

## Exemple travaillé
Un pays compte 40 millions de personnes de 15 à 64 ans, dont 28 millions d’actifs occupés et 2 millions de chômeurs.
- Population active = 28 + 2 = **30 millions**.
- Taux de chômage = 2 ÷ 30 × 100 ≈ **6,7 %**.
- Taux d’activité = 30 ÷ 40 × 100 = **75 %** ; taux d’emploi = 28 ÷ 40 × 100 = **70 %**.`,
          },
          questions: [
            ['Selon le BIT, laquelle n’est PAS une condition pour être chômeur ?', ['Être sans emploi', 'Être disponible pour travailler', 'Chercher activement un emploi', 'Être inscrit sur les listes de France Travail'], 3, 'L’inscription administrative n’entre pas dans la définition du BIT.'],
            ['La population active comprend…', ['Les actifs occupés et les chômeurs', 'Seulement les salariés', 'Les retraités et les étudiants', 'Toute la population'], 0, 'Les inactifs (élèves, retraités…) n’en font pas partie.'],
            ['3 millions de chômeurs et 27 millions d’actifs occupés : quel est le taux de chômage ?', ['3 %', '10 %', '11,1 %', '30 %'], 1, 'Population active = 30 millions ; 3 ÷ 30 × 100 = 10 %.'],
            ['Sur le marché du travail, qui offre du travail ?', ['Les entreprises', 'Les ménages', 'L’État uniquement', 'Les banques'], 1, 'L’offre de travail des ménages correspond à la demande d’emploi.'],
            ['Une offre d’emploi publiée par une entreprise correspond à…', ['Une offre de travail', 'Une demande de travail', 'Une demande d’emploi', 'Un taux d’activité'], 1, 'L’entreprise demande du travail : elle offre un emploi.'],
            ['Le chômage lié à une insuffisance de la demande de biens et services est…', ['Frictionnel', 'Conjoncturel', 'Structurel', 'Volontaire'], 1, 'Quand les ventes baissent, les entreprises embauchent moins.'],
            ['L’inadéquation entre les qualifications des chômeurs et les emplois proposés provoque un chômage…', ['Conjoncturel', 'Structurel', 'Saisonnier uniquement', 'Frictionnel'], 1, 'Il tient au fonctionnement durable du marché du travail.'],
            ['Le plein emploi signifie qu’il n’y a aucun chômeur.', ['Vrai', 'Faux'], 1, 'Un chômage frictionnel subsiste toujours.'],
            ['Financer des formations pour les demandeurs d’emploi relève d’une politique de l’emploi…', ['Active', 'Passive', 'Monétaire', 'Commerciale'], 0, 'Elle agit sur le fonctionnement du marché du travail.'],
            ['L’indemnisation des chômeurs relève d’une politique…', ['Active', 'Passive', 'Structurelle d’offre', 'De la concurrence'], 1, 'Elle atténue les conséquences du chômage.'],
            ['Quel facteur influence la demande de travail des entreprises ?', ['La demande anticipée pour leurs produits', 'La couleur de leur logo', 'Le nombre d’étudiants en philosophie', 'La météo uniquement'], 0, 'Avec la productivité, la substituabilité travail-capital et le coût du travail.'],
            ['Le taux d’emploi rapporte les actifs occupés…', ['À la population active', 'À la population en âge de travailler', 'Aux chômeurs', 'Au PIB'], 1, 'Il mesure la part des 15-64 ans qui ont un emploi.'],
          ],
        },

        // ---- Économie — Thème 8 : Commerce international --------------------
        {
          titre: 'Le commerce international',
          axe: 'Économie — Thème 8 : Comment organiser le commerce international dans un contexte d’ouverture des échanges ?',
          lecon: {
            titre: 'Des produits fabriqués partout, des règles à négocier',
            cours: `Ton téléphone a été conçu dans un pays, ses composants fabriqués dans plusieurs autres, et assemblé ailleurs encore. La **mondialisation** a transformé le commerce : on n’échange plus seulement des produits finis, mais des **morceaux de production**. Encore faut-il des règles pour organiser ces échanges.

## Les transformations du commerce mondial
Trois moteurs : l’**ouverture des frontières** (baisse des droits de douane depuis 1947), la **baisse des coûts de transport** (conteneur) et de **communication** (internet), les **économies d’échelle** (produire en grande quantité pour un marché mondial).
Résultat : la **segmentation** internationale de la production, ou **chaîne de valeur mondiale** : chaque étape est réalisée là où elle est la plus avantageuse (conception, composants, assemblage, commercialisation).
- Les **produits intermédiaires** (composants, pièces) représentent désormais **une grande part** des échanges internationaux, de l’ordre de la moitié.
- Les **produits finis** sont destinés au consommateur final.

## Mesurer les échanges
= Solde de la balance des biens et services = exportations − importations
= Taux de couverture = exportations ÷ importations × 100
Un solde positif est un **excédent**, un solde négatif un **déficit**. Un taux de couverture supérieur à 100 % signifie que les exportations couvrent les importations.

## Les IDE et les firmes multinationales
Un **investissement direct à l’étranger** (IDE) est un investissement par lequel une entreprise crée une filiale à l’étranger ou prend une participation significative (au moins 10 % du capital) dans une entreprise étrangère, avec une influence durable sur sa gestion.
| Motif des IDE | Exemple |
| **Conquérir un marché** (se rapprocher des clients) | Un constructeur automobile produit en Chine pour vendre en Chine |
| **Réduire les coûts** | Délocaliser une production où la main-d’œuvre est moins chère |
| **Accéder à des ressources** | S’implanter près de gisements, de compétences |
Les IDE donnent naissance aux **firmes multinationales** (FMN). Leurs effets sont généralement jugés positifs sur la croissance des pays d’accueil (transferts de technologie, emplois), plus discutés sur l’emploi des pays d’origine.

## Des effets contrastés
Le commerce international apporte des **gains** (baisse des prix, diversité des produits, réduction des inégalités **entre** pays) mais peut **accroître les inégalités au sein** de chaque pays (les emplois peu qualifiés exposés à la concurrence).

## Libre-échange ou protectionnisme ?
| Politiques d’**ouverture** (libre-échange) | Politiques de **protection** |
| Réduire ou supprimer les droits de douane | Imposer ou relever des **droits de douane** |
| Simplifier les procédures douanières | Instaurer des **quotas** (restrictions quantitatives) |
| Harmoniser les normes | Durcir les normes et procédures (**barrières non tarifaires**) |

## L’Organisation mondiale du commerce (OMC)
Créée en **1995** pour succéder au GATT (1947), l’OMC organise des **cycles de négociation** (*rounds*) pour abaisser les droits de douane et les barrières non tarifaires, selon trois principes :
1. la **clause de la nation la plus favorisée** : un avantage accordé à un pays doit l’être à tous les membres ;
2. le **traitement national** : un produit importé ne doit pas être traité moins bien qu’un produit national ;
3. la **réciprocité** des concessions.
Son **Organe de règlement des différends** (ORD) tranche les litiges commerciaux entre États ; son fonctionnement est toutefois affaibli depuis 2019 par le blocage de son organe d’appel.

> Le commerce mondial ne s’organise pas tout seul : il repose sur des règles négociées que les tentations protectionnistes remettent régulièrement en question.

## Exemple travaillé
Un pays exporte 600 milliards d’euros de biens et services et en importe 700 milliards.
- Solde = 600 − 700 = **− 100 milliards** : déficit.
- Taux de couverture = 600 ÷ 700 × 100 ≈ **85,7 %** : les exportations ne couvrent qu’environ 86 % des importations.`,
          },
          questions: [
            ['Qu’appelle-t-on la segmentation internationale de la production ?', ['La fabrication de chaque étape d’un produit dans le pays le plus avantageux', 'L’interdiction d’exporter', 'La production de tout dans un seul pays', 'La division d’un marché en segments de clients'], 0, 'On parle aussi de chaîne de valeur mondiale.'],
            ['Exportations 400 Md€, importations 500 Md€. Quel est le solde de la balance ?', ['+ 100 Md€', '− 100 Md€', '900 Md€', '80 %'], 1, '400 − 500 = − 100 Md€ : un déficit.'],
            ['Exportations 450, importations 500. Quel est le taux de couverture ?', ['50 %', '90 %', '111 %', '950 %'], 1, '450 ÷ 500 × 100 = 90 %.'],
            ['Un IDE suppose une participation d’au moins…', ['1 % du capital', '10 % du capital', '50 % du capital', '100 % du capital'], 1, 'C’est le seuil conventionnel d’une influence durable sur la gestion.'],
            ['Quel est le motif majoritaire des IDE ?', ['Conquérir un marché en se rapprochant des clients', 'Payer plus d’impôts', 'Réduire ses ventes', 'Éviter toute innovation'], 0, 'Réduire les coûts et accéder à des ressources sont les autres motifs.'],
            ['Instaurer des quotas d’importation est une mesure…', ['Libre-échangiste', 'Protectionniste', 'Monétaire', 'Sociale'], 1, 'C’est une restriction quantitative, barrière non tarifaire.'],
            ['En quelle année l’OMC a-t-elle été créée ?', ['1947', '1971', '1995', '2008'], 2, 'Elle a succédé au GATT, signé en 1947.'],
            ['La clause de la nation la plus favorisée signifie que…', ['Un avantage accordé à un pays doit l’être à tous les membres', 'Chaque pays choisit ses pays favoris', 'Le pays le plus riche décide seul', 'Les droits de douane sont interdits'], 0, 'C’est un principe de non-discrimination entre partenaires.'],
            ['Quel est le rôle de l’Organe de règlement des différends ?', ['Fixer les taux de change', 'Trancher les litiges commerciaux entre États', 'Prêter aux pays en difficulté', 'Juger les entreprises pour fraude fiscale'], 1, 'Son fonctionnement est affaibli depuis 2019 par le blocage de l’organe d’appel.'],
            ['Le commerce international peut accroître les inégalités au sein d’un pays.', ['Vrai', 'Faux'], 0, 'Les emplois peu qualifiés sont plus exposés à la concurrence internationale.'],
            ['Des composants électroniques vendus à un assembleur sont des…', ['Produits finis', 'Produits intermédiaires', 'Services non marchands', 'Biens publics'], 1, 'Ils entrent dans la fabrication d’un autre produit.'],
            ['Le principe du traitement national interdit…', ['De traiter un produit importé moins bien qu’un produit national', 'D’exporter', 'De créer des entreprises', 'De signer des accords commerciaux'], 0, 'C’est l’un des trois principes de l’OMC avec la nation la plus favorisée et la réciprocité.'],
          ],
        },

        // ---- Économie — Thème 9 : Croissance et développement durable -------
        {
          titre: 'Croissance soutenable et développement durable',
          axe: 'Économie — Thème 9 : Comment concilier la croissance économique et le développement durable ?',
          lecon: {
            titre: 'Produire plus sans épuiser la planète ni laisser personne de côté',
            cours: `La croissance a permis de réduire massivement la pauvreté dans le monde. Mais elle se heurte à des **limites écologiques**, et elle n’a pas fait disparaître les **inégalités**. Toute la question est de la rendre **soutenable**.

## Croissance et développement durable
- La **croissance économique** est l’augmentation durable de la production, mesurée par la hausse du **PIB en volume**.
- Le **développement durable** est, selon le rapport Brundtland (1987), un développement qui répond aux **besoins du présent** sans compromettre la capacité des **générations futures** à répondre aux leurs. Il a **trois piliers** : **économique**, **social**, **environnemental**.

## Les sources de la croissance
1. L’**accumulation des facteurs** : plus de travail, plus de capital.
2. La hausse de la **productivité globale des facteurs** (PGF) : produire plus avec les mêmes facteurs, grâce au **progrès technique**.
Le progrès technique vient de l’**innovation**, qui est **endogène** : elle est produite par l’investissement en recherche, en éducation, en infrastructures. Les **institutions** comptent aussi : des **droits de propriété** protégés (brevets, contrats respectés) et un **système financier** qui finance les projets incitent à investir et à innover.

## Les limites écologiques
| Ressources **renouvelables** | Ressources **non renouvelables** |
| Se reconstituent à l’échelle humaine : bois, poissons, eau, énergie solaire et éolienne | Stock limité : pétrole, gaz, charbon, minerais |
| Risque : surexploitation si on prélève plus vite qu’elles ne se renouvellent | Risque : épuisement |
S’y ajoutent les **pollutions** et le **dérèglement climatique**, dus notamment aux émissions de gaz à effet de serre.

## Des réponses nouvelles
| Modèle | Principe | Exemple |
| **Économie circulaire** | Réduire, réutiliser, réparer, **recycler** : les déchets deviennent des ressources | Consigne, reconditionnement de téléphones |
| **Économie collaborative** | **Mutualiser** l’usage des biens entre particuliers | Covoiturage, location entre voisins |
| **Économie sociale et solidaire** (ESS) | Des organisations à **utilité sociale**, à **gouvernance démocratique**, à **lucrativité limitée** : associations, coopératives, mutuelles, fondations, entreprises sociales (loi de 2014) | Une coopérative d’énergie renouvelable |

## Pauvreté absolue et pauvreté relative
- La **pauvreté absolue** : ne pas disposer du minimum vital (se nourrir, se loger, se soigner). La Banque mondiale la mesure par un **seuil international** de quelques dollars par jour et par personne. Elle a **fortement reculé** dans le monde depuis 1990, malgré la hausse de la population.
- La **pauvreté relative** : avoir un niveau de vie nettement inférieur à celui de la société où l’on vit. En France et en Europe, le **seuil de pauvreté** est fixé à **60 % du niveau de vie médian**. Elle se **maintient**, et les inégalités ont augmenté dans de nombreux pays.

## Le rôle de l’éducation et de la formation
L’éducation et la formation sont parmi les **premiers moteurs du développement** : elles augmentent le **capital humain**, donc la productivité et les revenus ; elles favorisent la santé, l’insertion, l’innovation ; elles aident à sortir de la pauvreté.

> Une croissance soutenable est une croissance qui s’appuie sur l’innovation et le capital humain plutôt que sur l’épuisement des ressources.

## Exemple travaillé
Dans un pays, le niveau de vie médian est de 24 000 € par an.
- Seuil de pauvreté = 60 % × 24 000 = **14 400 €** par an, soit **1 200 €** par mois.
- Une personne seule disposant de 1 100 € par mois est pauvre au sens **relatif**, même si elle n’est pas pauvre au sens **absolu** (elle dispose du minimum vital).`,
          },
          questions: [
            ['Quelle est la définition du développement durable selon le rapport Brundtland ?', ['Une croissance du PIB d’au moins 3 % par an', 'Un développement qui répond aux besoins du présent sans compromettre ceux des générations futures', 'L’arrêt de toute production', 'Le développement des seules énergies fossiles'], 1, 'Rapport de 1987, il fonde les trois piliers économique, social et environnemental.'],
            ['Le pétrole est une ressource…', ['Renouvelable', 'Non renouvelable', 'Inépuisable', 'Collaborative'], 1, 'Son stock est limité à l’échelle humaine.'],
            ['Dire que l’innovation est endogène, c’est dire qu’elle…', ['Tombe du ciel', 'Est produite par l’investissement en recherche, éducation, infrastructures', 'Vient uniquement de l’étranger', 'Est interdite'], 1, 'Elle résulte des décisions des acteurs économiques.'],
            ['Que mesure la productivité globale des facteurs ?', ['Le nombre d’actifs', 'La part de la croissance non expliquée par la hausse du travail et du capital', 'La production agricole', 'Le déficit public'], 1, 'Elle traduit l’efficacité de la combinaison des facteurs, donc le progrès technique.'],
            ['Le reconditionnement de téléphones usagés relève de…', ['L’économie circulaire', 'La pauvreté absolue', 'Le protectionnisme', 'La politique monétaire'], 0, 'Les produits usagés redeviennent des ressources.'],
            ['Le covoiturage est un exemple d’économie…', ['Circulaire', 'Collaborative', 'Planifiée', 'Souterraine'], 1, 'Elle mutualise l’usage d’un bien entre particuliers.'],
            ['Laquelle n’appartient PAS à l’économie sociale et solidaire ?', ['Une association', 'Une coopérative', 'Une mutuelle', 'Une société cotée qui maximise les dividendes'], 3, 'L’ESS se caractérise par une lucrativité limitée et une gouvernance démocratique.'],
            ['En France, le seuil de pauvreté relative est fixé à…', ['40 % du niveau de vie moyen', '50 % du SMIC', '60 % du niveau de vie médian', '100 % du niveau de vie médian'], 2, 'C’est la convention européenne.'],
            ['Niveau de vie médian : 2 000 € par mois. Quel est le seuil de pauvreté ?', ['1 000 €', '1 200 €', '1 500 €', '2 000 €'], 1, '60 % × 2 000 = 1 200 €.'],
            ['La pauvreté absolue a fortement reculé dans le monde depuis 1990.', ['Vrai', 'Faux'], 0, 'Et ce malgré la forte hausse de la population mondiale.'],
            ['Pourquoi l’éducation est-elle un moteur du développement ?', ['Elle augmente le capital humain, donc la productivité et les revenus', 'Elle réduit le nombre de travailleurs', 'Elle remplace le capital physique', 'Elle supprime les impôts'], 0, 'Elle favorise aussi santé, insertion et innovation.'],
            ['Des droits de propriété bien protégés freinent l’innovation.', ['Vrai', 'Faux'], 1, 'Au contraire, ils incitent à investir et à innover, car l’innovateur peut en tirer profit.'],
          ],
        },

        // ---- Méthode ------------------------------------------------------
        {
          titre: 'Méthode : l’épreuve écrite de droit et économie',
          axe: 'L’épreuve du baccalauréat',
          lecon: {
            titre: 'Deux heures de droit, deux heures d’économie, une méthode pour chacune',
            cours: `L’épreuve écrite de **droit et économie** dure **4 heures**. Elle comporte **deux parties indépendantes** : une **partie juridique** et une **partie économique**, chacune prévue pour **deux heures** (tu restes libre de gérer ton temps). Elle porte sur le programme de terminale ; les notions de 1re peuvent être mobilisées (note de service du 11 septembre 2026, applicable à compter de la session 2027).

## Le barème
| Partie | Points | Dont orthographe et syntaxe |
| **Juridique** | 10 | 1,5 point |
| **Économique** | 10 | 0,5 point |
Chaque partie se présente sous la forme d’un **dossier** de documents accompagné d’un **questionnement**.

## La partie juridique : ce qu’on attend
Tu dois **qualifier** juridiquement une situation, **identifier** la ou les règles applicables, **indiquer** la ou les solutions, **utiliser un vocabulaire juridique** précis, et parfois **expliquer le sens d’une règle** et son évolution.

## La méthode du cas pratique (le syllogisme juridique)
1. **Les faits** : résume les faits utiles, en les **qualifiant** (« M. Durand, salarié », « la SAS Bio, employeur », « un contrat de vente »).
2. **Le problème de droit** : une question **juridique** et **générale**, formulée sans les noms (« Un employeur peut-il licencier un salarié sans entretien préalable ? »).
3. **La règle de droit** (majeure) : énonce la règle et sa source (article, loi, jurisprudence).
4. **L’application** (mineure) : confronte les faits à chaque condition de la règle.
5. **La solution** (conclusion) : réponds clairement à la question posée.

!> Erreur classique : sauter l’application et passer directement de la règle à la conclusion. C’est là que se gagnent la plupart des points.

## Un modèle de rédaction
« En l’espèce, Mme Petit a acheté un aspirateur sur un site internet le 3 mars et souhaite le renvoyer le 10 mars. Le problème de droit est de savoir si un consommateur peut revenir sur un achat conclu à distance. Selon le Code de la consommation, le consommateur dispose d’un délai de rétractation de 14 jours pour un contrat conclu à distance, sans avoir à se justifier. Mme Petit est une consommatrice, le contrat a été conclu à distance et elle agit 7 jours après l’achat, donc dans le délai. Elle peut donc exercer son droit de rétractation et obtenir le remboursement. »

## La partie économique : ce qu’on attend
Tu dois **expliquer** les notions et mécanismes, **interpréter** des données (tableaux, graphiques), **réaliser des calculs** (taux de variation, taux de chômage, solde, part…), et **répondre de façon argumentée** à une question sur un débat actuel.

## Lire un document statistique
1. Identifier la **source**, la **date**, l’**unité** (%, milliards, indice).
2. Faire une **phrase de lecture** avec une donnée : « Selon l’INSEE, en 2025, … ».
3. Dégager la **tendance** générale, puis les exceptions.
= Taux de variation = (valeur d’arrivée − valeur de départ) ÷ valeur de départ × 100

## Répondre à la question argumentée
- Une **introduction** courte : définir les notions, poser la question.
- Un **développement** en deux temps (souvent : arguments en faveur / limites), chaque argument construit en **AEI** : **A**ffirmer une idée, l’**E**xpliquer par un mécanisme, l’**I**llustrer par un document ou un exemple.
- Une **conclusion** qui répond à la question.

## Gérer ses 4 heures
| Temps | Conseil |
| Début | Lis tout le sujet, repère les questions faciles |
| 2 h par partie | Commence par celle où tu es le plus à l’aise |
| 10 dernières minutes | Relis l’orthographe : 2 points sur 20 en dépendent |

> En droit comme en économie, on ne récite pas : on applique une notion à une situation, et on le prouve.`,
          },
          questions: [
            ['Combien de temps dure l’épreuve écrite de droit et économie ?', ['2 heures', '3 heures', '4 heures', '6 heures'], 2, 'Deux parties indépendantes, chacune prévue pour deux heures.'],
            ['Comment se répartissent les points entre les deux parties ?', ['15 en droit, 5 en économie', '10 et 10', '5 en droit, 15 en économie', '20 en droit seulement'], 1, 'Chaque partie est notée sur 10 points.'],
            ['Combien de points de la partie juridique sont dédiés à l’orthographe et à la syntaxe ?', ['0,5', '1', '1,5', '2'], 2, '1,5 point en droit et 0,5 point en économie, soit 2 points sur 20.'],
            ['Quelle est la bonne suite du cas pratique ?', ['Faits, problème de droit, règle, application, solution', 'Solution, règle, faits', 'Règle, solution, faits, problème', 'Problème, solution, faits'], 0, 'C’est le syllogisme juridique : majeure, mineure, conclusion.'],
            ['Un bon problème de droit est formulé…', ['Avec les noms des personnes', 'De façon juridique et générale, sans les noms', 'Sous forme d’affirmation', 'En une seule lettre'], 1, 'Il pose une question de droit abstraite.'],
            ['Quelle est l’erreur classique du cas pratique ?', ['Citer la source de la règle', 'Sauter l’application des faits à la règle', 'Qualifier les parties', 'Conclure'], 1, 'L’application (la mineure) rapporte beaucoup de points.'],
            ['Que signifie la méthode AEI ?', ['Affirmer, Expliquer, Illustrer', 'Analyser, Écrire, Imprimer', 'Argumenter, Évaluer, Ignorer', 'Apprendre, Exposer, Interroger'], 0, 'Chaque argument est affirmé, expliqué par un mécanisme, puis illustré.'],
            ['Une valeur passe de 200 à 250. Quel est le taux de variation ?', ['+ 20 %', '+ 25 %', '+ 50 %', '+ 125 %'], 1, '(250 − 200) ÷ 200 × 100 = 25 %.'],
            ['Les notions du programme de 1re peuvent être mobilisées à l’épreuve.', ['Vrai', 'Faux'], 0, 'L’épreuve porte sur la terminale, mais les notions de 1re restent utiles.'],
            ['Que faut-il identifier en premier dans un document statistique ?', ['La source, la date et l’unité', 'La couleur du graphique', 'Le nombre de lignes', 'Le nom de l’auteur du sujet'], 0, 'Sans unité ni date, on ne peut pas lire correctement la donnée.'],
            ['Les deux parties de l’épreuve doivent être traitées dans l’ordre imposé, en exactement deux heures chacune.', ['Vrai', 'Faux'], 1, 'Le candidat est libre de gérer son temps et de commencer par la partie de son choix.'],
            ['Dans le cas pratique, la « majeure » correspond à…', ['Les faits', 'La règle de droit', 'La solution', 'Le problème de droit'], 1, 'La règle est la majeure, les faits qualifiés la mineure, la solution la conclusion.'],
          ],
        },
      ],
    },
  ],
}
