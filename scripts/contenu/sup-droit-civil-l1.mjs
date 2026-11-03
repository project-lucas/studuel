// DROIT CIVIL — L1 DROIT (premier module de contenu universitaire de Studuel).
// Matière `droit-civil` (migration 606, lib/superieur/cursus.ts), classe « L1 droit ».
// Les onze chapitres suivent EXACTEMENT `programme.L1` de cursus.ts : un titre
// modifié là-bas doit l’être ici (le titre est la clé du chapitre en base).
//
// Semestre 1 : introduction au droit et droit des personnes (chapitres 1 à 7).
// Semestre 2 : droit de la famille (chapitres 8 à 11).
//
// Droit à jour de 2026 : ordonnance du 10 février 2016 (preuve, art. 1353 s.),
// loi du 18 novembre 2016 (divorce par acte d’avocats), loi du 23 mars 2019
// (divorce sans phase de conciliation depuis le 1er janvier 2021, majeurs
// protégés), loi du 2 mars 2022 (choix du nom), loi bioéthique du 2 août 2021
// (PMA pour toutes, reconnaissance conjointe anticipée), loi du 10 juillet 2019
// (violences éducatives). Les questions de fait sont à relire par un juriste.

const brut = {
  slug: 'droit-civil',
  nom: 'Droit civil',

  titreMigration: 'DROIT CIVIL L1 — INTRODUCTION AU DROIT, PERSONNES ET FAMILLE (11 chapitres)',

  motif: `Premier module de contenu UNIVERSITAIRE : la matière droit-civil de la
licence de droit, première année (migration 606 pour la matière, classe « L1 droit »).

Cette migration installe les 11 chapitres du programme de L1, rangés par semestre
(semestre 1 : introduction au droit et droit des personnes ; semestre 2 : droit de
la famille). Chaque chapitre : une leçon rédigée au niveau licence, avec un cas
pratique résolu en syllogisme, et 12 questions.`,

  blocs: [
    {
      niveaux: ['L1 droit'],
      positionDepart: 1,
      chapitres: [
        // ---------------------------------------------------------------- 1
        {
          titre: 'Introduction au droit : la règle de droit',
          axe: 'Semestre 1 — Introduction au droit et droit des personnes',
          lecon: {
            titre: 'Qu’est-ce qu’une règle de droit ?',
            cours: `Le **droit objectif** est l’ensemble des règles qui organisent la vie en société et dont le respect est garanti par la contrainte de l’État. Le **droit subjectif**, lui, est la prérogative qu’une règle reconnaît à une personne : le droit de propriété, le droit d’obtenir le paiement d’une créance. Le droit objectif est la règle ; le droit subjectif est ce que la règle me donne.

## Les caractères de la règle de droit
Une règle de droit se reconnaît à cinq traits.

| Caractère | Signification | Illustration |
| Générale | Elle vise une catégorie de personnes, pas un individu | Tout conducteur doit respecter la limitation de vitesse |
| Abstraite | Elle prévoit une situation type, pas un cas particulier | « Celui qui cause un dommage doit le réparer » |
| Permanente | Elle dure jusqu’à son abrogation | Le Code civil de 1804 est toujours en vigueur |
| Obligatoire | Nul ne peut s’y soustraire à sa guise | On ne choisit pas d’obéir ou non |
| Sanctionnée | L’État peut contraindre à la respecter | Dommages et intérêts, amende, exécution forcée |

La sanction distingue la règle de droit de la règle morale ou religieuse : seule la première est assortie d’une contrainte étatique. Les deux se recoupent pourtant souvent (ne pas tuer, ne pas voler) et le droit s’inspire de la morale sans s’y confondre.

## Droit public et droit privé
Le **droit privé** régit les rapports entre particuliers (droit civil, droit commercial, droit du travail). Le **droit public** régit l’organisation de l’État et ses rapports avec les particuliers (droit constitutionnel, droit administratif). Le droit civil est le « droit commun » du droit privé : il fournit les règles générales qui s’appliquent à défaut de règle spéciale.

## Règles impératives et règles supplétives
Une règle **impérative** s’impose : on ne peut y déroger. L’**article 6 du Code civil** interdit de déroger par des conventions particulières aux lois qui intéressent l’ordre public et les bonnes mœurs. Une règle **supplétive** ne s’applique qu’à défaut de volonté contraire des parties : les époux peuvent par exemple écarter le régime légal de la communauté réduite aux acquêts en choisissant un autre régime.

## L’application de la loi dans le temps et le rôle du juge
Selon l’**article 2 du Code civil**, la loi ne dispose que pour l’avenir : elle n’a point d’effet rétroactif. Le principe est de valeur législative en matière civile, le législateur pouvant y déroger. Quant au juge, l’**article 4** lui interdit de refuser de juger sous prétexte du silence, de l’obscurité ou de l’insuffisance de la loi, sous peine de déni de justice. L’**article 5** lui défend de statuer par voie de disposition générale et réglementaire : il tranche un litige, il ne légifère pas.

> Une règle de droit est générale, abstraite et obligatoire, et sa violation est sanctionnée par l’État ; le droit objectif est la règle, le droit subjectif la prérogative qu’elle confère.

## Les droits subjectifs
On classe les droits subjectifs en droits **patrimoniaux** (évaluables en argent : droits réels comme la propriété, droits personnels ou créances) et **extrapatrimoniaux** (attachés à la personne : droit au respect de la vie privée, droit au nom). Les premiers sont en principe cessibles et transmissibles ; les seconds sont hors commerce.

## Exemple travaillé
Une loi nouvelle, entrée en vigueur le 1er mars, interdit un type de clause dans les contrats de location. Un bailleur soutient que la clause qu’il avait insérée dans un bail signé en janvier est donc nulle. A-t-il raison ?
Majeure : la loi ne dispose que pour l’avenir et n’a pas d’effet rétroactif (article 2 du Code civil), sauf disposition contraire expresse et sous réserve des lois impératives d’application immédiate aux effets futurs d’un contrat en cours.
Mineure : le bail a été conclu en janvier, avant l’entrée en vigueur de la loi, et rien n’indique que la loi soit rétroactive.
Conclusion : la clause, valable à sa conclusion, n’est pas atteinte par la loi nouvelle ; le bailleur a tort.`,
          },
          questions: [
            ['Quel caractère distingue la règle de droit de la règle morale ?', ['Sa généralité', 'Son caractère abstrait', 'Sa sanction par la contrainte étatique', 'Son origine ancienne'], 2, 'Seule la règle de droit est assortie d’une sanction que l’État peut imposer par la contrainte.'],
            ['Le droit subjectif est…', ['L’ensemble des lois en vigueur', 'Une prérogative reconnue à une personne par le droit objectif', 'Le droit appliqué par un juge subjectif', 'Une règle morale'], 1, 'Le droit objectif est la règle ; le droit subjectif est la prérogative que cette règle confère (propriété, créance).'],
            ['Une règle supplétive s’applique même si les parties ont prévu autre chose.', ['Vrai', 'Faux'], 1, 'Une règle supplétive ne s’applique qu’à défaut de volonté contraire des parties ; c’est la règle impérative qui s’impose.'],
            ['Quel article du Code civil interdit de déroger par convention aux lois d’ordre public ?', ['L’article 1er', 'L’article 2', 'L’article 6', 'L’article 1240'], 2, 'L’article 6 interdit de déroger par des conventions particulières aux lois qui intéressent l’ordre public et les bonnes mœurs.'],
            ['Le juge peut refuser de trancher un litige quand la loi est silencieuse.', ['Vrai', 'Faux'], 1, 'L’article 4 du Code civil l’interdit : le juge qui refuse de juger commet un déni de justice.'],
            ['Selon l’article 2 du Code civil, la loi…', ['Dispose pour l’avenir et n’a pas d’effet rétroactif', 'S’applique toujours aux situations passées', 'Ne s’applique qu’aux contrats', 'Peut être écartée par le juge'], 0, 'La non-rétroactivité est le principe : la loi nouvelle ne remet pas en cause les situations juridiques déjà constituées.'],
            ['Laquelle de ces branches relève du droit privé ?', ['Le droit administratif', 'Le droit constitutionnel', 'Le droit des finances publiques', 'Le droit civil'], 3, 'Le droit civil règle les rapports entre particuliers : c’est le droit commun du droit privé.'],
            ['Que signifie le caractère « abstrait » de la règle de droit ?', ['Elle est difficile à comprendre', 'Elle prévoit une situation type et non un cas particulier', 'Elle n’est pas écrite', 'Elle n’est jamais sanctionnée'], 1, 'La règle est conçue pour une hypothèse-type, applicable à toutes les situations qui y correspondent.'],
            ['Le droit de propriété est un droit…', ['Extrapatrimonial', 'Patrimonial', 'Public', 'Sans valeur économique'], 1, 'Évaluable en argent, la propriété est un droit réel patrimonial.'],
            ['Que fait l’article 5 du Code civil ?', ['Il oblige le juge à juger', 'Il interdit au juge de statuer par voie de disposition générale et réglementaire', 'Il fixe la majorité', 'Il définit le contrat'], 1, 'Le juge tranche un cas d’espèce ; il ne peut édicter de règle générale à la façon d’un législateur (arrêt de règlement interdit).'],
            ['Le droit au respect de la vie privée est un droit…', ['Réel', 'De créance', 'Extrapatrimonial', 'Public'], 2, 'Attaché à la personne et non évaluable en argent, il est extrapatrimonial et hors commerce.'],
            ['Pourquoi dit-on que le droit civil est le « droit commun » du droit privé ?', ['Parce qu’il est le plus ancien de tous les droits', 'Parce qu’il fournit les règles générales applicables à défaut de règle spéciale', 'Parce qu’il est connu de tous', 'Parce qu’il s’applique seulement aux citoyens ordinaires'], 1, 'Les branches spéciales (commercial, travail) dérogent au droit civil ; à défaut de dérogation, c’est lui qui s’applique.'],
          ],
        },

        // ---------------------------------------------------------------- 2
        {
          titre: 'Les sources du droit et la hiérarchie des normes',
          axe: 'Semestre 1 — Introduction au droit et droit des personnes',
          lecon: {
            titre: 'D’où vient la règle de droit, et laquelle l’emporte ?',
            cours: `Les **sources du droit** sont les procédés par lesquels naissent les règles de droit. En droit français, on distingue les sources internes (Constitution, loi, règlement, jurisprudence, coutume) et les sources supranationales (traités internationaux, droit de l’Union européenne, Convention européenne des droits de l’homme). Ces règles ne sont pas toutes de même rang : elles forment une **hiérarchie des normes** (pyramide de Kelsen), où chaque norme tire sa validité de celle qui lui est supérieure.

## La Constitution et le bloc de constitutionnalité
Au sommet de l’ordre interne, la **Constitution du 4 octobre 1958**. Le Conseil constitutionnel y a rattaché un **bloc de constitutionnalité** : le texte de 1958, la Déclaration des droits de l’homme et du citoyen de 1789, le Préambule de la Constitution de 1946 et la Charte de l’environnement de 2004. Une loi contraire à ce bloc peut être censurée.

## Traités et droit de l’Union européenne
L’**article 55 de la Constitution** donne aux traités régulièrement ratifiés une autorité supérieure à celle des lois, sous réserve de leur application par l’autre partie (réciprocité). Le droit de l’Union a lui-même la primauté sur le droit national : les **règlements** sont directement applicables, tandis que les **directives** doivent être transposées par chaque État. La Cour de cassation (chambre mixte, 24 mai 1975, Jacques Vabre) et le Conseil d’État (20 octobre 1989, Nicolo) ont admis qu’un juge peut écarter une loi, même postérieure, contraire à un traité : c’est le **contrôle de conventionnalité**. Le Conseil d’État maintient en revanche la supériorité de la Constitution sur les traités dans l’ordre interne (arrêt Sarran, 30 octobre 1998).

## La loi et le règlement
La loi est votée par le Parlement ; son domaine est fixé par l’**article 34 de la Constitution** (droits civiques, état et capacité des personnes, régimes matrimoniaux, successions…). Tout le reste relève du pouvoir réglementaire (article 37) : décrets du Président de la République ou du Premier ministre, arrêtés des ministres et des préfets. Le règlement est inférieur à la loi : un décret contraire à la loi est illégal et peut être annulé par le juge administratif (recours pour excès de pouvoir). Le Gouvernement peut aussi, sur habilitation, prendre des ordonnances (article 38) ; elles deviennent des actes de valeur législative une fois ratifiées.

| Rang | Norme | Qui la fait ? |
| 1 | Constitution (bloc de constitutionnalité) | Pouvoir constituant |
| 2 | Traités et droit de l’Union | États, institutions européennes |
| 3 | Loi | Parlement |
| 4 | Règlement | Gouvernement, administration |

## Les sources non écrites
La **jurisprudence** est l’ensemble des décisions des juridictions. Elle n’est pas formellement une source du droit (le juge ne peut statuer par voie générale), mais, par la répétition de ses solutions, notamment celles de la Cour de cassation, elle précise et comble la loi. La coutume est une pratique ancienne ressentie comme obligatoire ; elle est en recul, mais subsiste en droit commercial. La doctrine (écrits des universitaires) n’a aucune force obligatoire, mais elle influence juges et législateurs.

## Le contrôle de constitutionnalité
Le Conseil constitutionnel contrôle les lois avant leur promulgation (contrôle a priori) et, depuis 2010, sur renvoi d’une juridiction, après leur promulgation grâce à la **question prioritaire de constitutionnalité** (article 61-1).

> La norme inférieure doit respecter la norme supérieure : Constitution, puis traités, puis lois, puis règlements ; la jurisprudence en précise l’application.

## Exemple travaillé
Un décret ajoute une obligation que la loi ne prévoit pas et prive un citoyen d’un droit que cette loi lui accorde. Le citoyen peut-il obtenir qu’on écarte ce décret ?
Majeure : un règlement doit respecter la loi, norme supérieure ; un acte réglementaire contraire à la loi est illégal.
Mineure : le décret retire un droit que la loi accorde expressément.
Conclusion : le décret est illégal ; le citoyen peut demander son annulation au juge administratif par un recours pour excès de pouvoir, ou en exciper de l’illégalité devant tout juge saisi du litige.`,
          },
          questions: [
            ['Quelle est la norme la plus élevée de l’ordre juridique interne ?', ['La loi', 'Le règlement', 'Le traité', 'La Constitution'], 3, 'La Constitution (et le bloc de constitutionnalité) est au sommet de la hiérarchie des normes internes.'],
            ['Quel texte ne fait PAS partie du bloc de constitutionnalité ?', ['La Déclaration de 1789', 'Le Préambule de 1946', 'Le Code civil de 1804', 'La Charte de l’environnement de 2004'], 2, 'Le Code civil est une loi ordinaire ; il n’a pas valeur constitutionnelle.'],
            ['Une directive européenne est directement applicable sans transposition.', ['Vrai', 'Faux'], 1, 'C’est le règlement qui est directement applicable ; la directive doit être transposée par les États.'],
            ['L’article 55 de la Constitution donne aux traités une autorité…', ['Inférieure à la loi', 'Égale à celle de la Constitution', 'Supérieure à celle des lois, sous réserve de réciprocité', 'Nulle sans vote du Parlement'], 2, 'Les traités ratifiés ont une autorité supérieure à celle des lois, sous condition de réciprocité.'],
            ['Qu’est-ce que le contrôle de conventionnalité ?', ['Le contrôle de la loi par rapport à la Constitution', 'Le contrôle de la loi par rapport aux traités', 'Le contrôle d’un contrat par le notaire', 'Le contrôle de la coutume'], 1, 'Le juge écarte la loi contraire à un traité (arrêts Jacques Vabre, 1975, et Nicolo, 1989).'],
            ['Quel article de la Constitution fixe le domaine de la loi ?', ['L’article 34', 'L’article 37', 'L’article 55', 'L’article 61-1'], 0, 'L’article 34 énumère les matières réservées à la loi ; le reste est réglementaire (article 37).'],
            ['Un décret contraire à la loi est…', ['Valable car plus récent', 'Illégal et annulable par le juge administratif', 'Inconstitutionnel et annulé par le Conseil constitutionnel', 'Une source de jurisprudence'], 1, 'Le règlement est inférieur à la loi ; sa contrariété à la loi se sanctionne par un recours pour excès de pouvoir.'],
            ['La jurisprudence est formellement une source obligatoire du droit civil.', ['Vrai', 'Faux'], 1, 'L’article 5 interdit les arrêts de règlement ; la jurisprudence n’a pas de force obligatoire formelle, même si elle est très influente.'],
            ['Que permet la QPC (article 61-1 de la Constitution) ?', ['De contester un décret devant le juge pénal', 'De faire contrôler, après promulgation, la conformité d’une loi aux droits garantis par la Constitution', 'De saisir directement la Cour de justice de l’Union', 'De modifier la Constitution'], 1, 'Sur renvoi d’une juridiction, le Conseil constitutionnel peut abroger une loi portant atteinte aux droits et libertés constitutionnels.'],
            ['Quelle est la place du règlement dans la hiérarchie ?', ['Au-dessus de la loi', 'Au même niveau que la Constitution', 'En dessous de la loi', 'Hors hiérarchie'], 2, 'Le règlement est inférieur à la loi (et aux normes supérieures).'],
            ['Une pratique ancienne ressentie comme obligatoire est…', ['Une ordonnance', 'Une coutume', 'Une directive', 'Une circulaire'], 1, 'La coutume suppose un usage répété et la conviction qu’il est obligatoire ; elle subsiste surtout en droit commercial.'],
            ['Les ordonnances de l’article 38 sont prises par…', ['Le Parlement', 'Le Conseil constitutionnel', 'Le Gouvernement, sur habilitation du Parlement', 'La Cour de cassation'], 2, 'Le Gouvernement peut légiférer dans le domaine de la loi, pour une durée limitée, après autorisation du Parlement.'],
          ],
        },

        // ---------------------------------------------------------------- 3
        {
          titre: 'La preuve des droits',
          axe: 'Semestre 1 — Introduction au droit et droit des personnes',
          lecon: {
            titre: 'Prouver un droit : charge, objet et modes de preuve',
            cours: `Avoir un droit ne suffit pas : encore faut-il pouvoir le prouver. Un droit contesté et non prouvé est, en pratique, un droit qui n’existe pas. La preuve est réglée, depuis l’ordonnance du 10 février 2016 (entrée en vigueur le 1er octobre 2016), par les articles 1353 et suivants du Code civil, et, pour la procédure, par l’article 9 du Code de procédure civile.

## La charge de la preuve
Selon l’**article 1353** du Code civil, celui qui réclame l’exécution d’une obligation doit la prouver ; réciproquement, celui qui se prétend libéré doit justifier le paiement ou le fait qui a produit l’extinction de son obligation. On résume : **le demandeur prouve** ce qu’il avance, puis le défendeur prouve ce qu’il oppose. Un créancier prouve donc l’existence de la dette ; le débiteur prouve qu’il l’a payée.

## L’objet de la preuve : acte ou fait juridique
La distinction fondamentale est celle de l’**acte juridique** (manifestation de volonté destinée à produire des effets de droit : un contrat, un testament) et du fait juridique (événement auquel la loi attache des effets, volontaire ou non : un accident, une naissance, un dommage).

| | Acte juridique | Fait juridique |
| Exemple | Un contrat de vente | Un accident de la circulation |
| Régime | Preuve réglementée | Preuve libre (art. 1358) |
| Moyens | Écrit exigé au-delà d’un seuil | Tous moyens : témoins, photos, expertise |

Au-delà de **1 500 euros** (seuil fixé par décret), un acte juridique doit être prouvé par écrit (**article 1359**). En dessous, ou entre commerçants (preuve libre en matière commerciale), on peut recourir à d’autres moyens. L’écrit n’est pas toujours possible : en cas d’impossibilité matérielle ou morale de se procurer un écrit, la preuve redevient libre.

## Les modes de preuve
- L’écrit : l’**acte authentique**, reçu par un officier public (notaire, commissaire de justice), fait foi jusqu’à inscription de faux ; l’acte sous signature privée suppose la signature des parties. L’**écrit électronique** a la même force probante que l’écrit papier si l’auteur est identifié et si l’intégrité est garantie (article 1366).
- Le témoignage, admissible pour les faits ou lorsque la preuve est libre ;
- La présomption, conséquence que la loi ou le juge tire d’un fait connu pour un fait inconnu : elle est simple (preuve contraire possible) ou **irréfragable** (aucune preuve contraire) ;
- L’aveu (article 1383), déclaration par laquelle une personne reconnaît pour vrai un fait de nature à produire contre elle des conséquences juridiques ;
- Le serment, décisoire ou supplétoire.

## Les règles à ne pas oublier
**Nul ne peut se constituer de preuve à soi-même** (article 1363) : un courrier rédigé par vous seul ne prouve pas votre créance. Le **commencement de preuve par écrit** (article 1362) est un écrit émanant de celui qu’on veut opposer, qui rend vraisemblable le fait allégué ; il permet de le compléter par témoins ou présomptions. Enfin, la preuve doit être **loyale** : une preuve obtenue par un procédé déloyal (enregistrement clandestin, stratagème) est en principe irrecevable, même si, à titre exceptionnel, la jurisprudence admet qu’un juge l’examine lorsqu’elle est indispensable à l’exercice du droit à la preuve et proportionnée.

> Celui qui réclame l’exécution d’une obligation la prouve ; les faits se prouvent par tous moyens, les actes au-delà de 1 500 euros par écrit.

## Exemple travaillé
Une personne prête 3 000 euros à un ami, sans écrit, et réclame le remboursement. Peut-elle prouver le prêt par témoins ?
Majeure : un acte juridique portant sur une somme supérieure au seuil fixé par décret (1 500 euros) doit être prouvé par écrit (article 1359) et nul ne peut se constituer de preuve à soi-même (article 1363).
Mineure : le prêt de 3 000 euros est un acte juridique supérieur au seuil ; il n’existe aucun écrit.
Conclusion : la preuve testimoniale seule est irrecevable ; elle ne le serait pas s’il existait un commencement de preuve par écrit (par exemple un message de l’emprunteur reconnaissant la dette).`,
          },
          questions: [
            ['Qui supporte en principe la charge de la preuve ?', ['Toujours le défendeur', 'Celui qui réclame l’exécution d’une obligation', 'Le juge', 'Le ministère public'], 1, 'L’article 1353 : celui qui réclame l’exécution d’une obligation doit la prouver.'],
            ['Un accident de la circulation est…', ['Un acte juridique', 'Un fait juridique, prouvable par tous moyens', 'Un acte authentique', 'Un aveu'], 1, 'C’est un événement : la preuve en est libre (témoins, photos, constat).'],
            ['Au-delà de quel seuil un acte juridique doit-il être prouvé par écrit ?', ['150 euros', '500 euros', '1 500 euros', '15 000 euros'], 2, 'Le seuil, fixé par décret, est de 1 500 euros (article 1359).'],
            ['Nul ne peut se constituer de preuve à soi-même.', ['Vrai', 'Faux'], 0, 'Article 1363 : un écrit établi par une seule partie, à son profit, ne prouve pas contre l’autre.'],
            ['L’acte authentique fait foi…', ['Jusqu’à preuve contraire par témoins', 'Jusqu’à inscription de faux', 'Pendant un an', 'Seulement entre les parties'], 1, 'L’acte authentique, établi par un officier public, ne peut être contesté que par la procédure d’inscription de faux.'],
            ['Une présomption irréfragable…', ['Admet la preuve contraire', 'N’admet aucune preuve contraire', 'Doit être écrite', 'N’existe qu’en droit pénal'], 1, 'Elle est péremptoire : la preuve contraire est exclue, à la différence de la présomption simple.'],
            ['Quel texte réforme le droit de la preuve en 2016 ?', ['La loi du 4 mars 2002', 'L’ordonnance du 10 février 2016', 'La loi du 23 mars 2019', 'La loi du 2 août 2021'], 1, 'L’ordonnance du 10 février 2016 a réécrit les articles 1353 et suivants du Code civil.'],
            ['Un message électronique peut avoir la même force probante qu’un écrit papier.', ['Vrai', 'Faux'], 0, 'Si son auteur est identifiable et son intégrité garantie (article 1366).'],
            ['Qu’est-ce qu’un commencement de preuve par écrit ?', ['Un écrit émanant de celui à qui on l’oppose et rendant vraisemblable le fait allégué', 'Une preuve établie par l’huissier', 'Un témoignage écrit', 'Un reçu de paiement'], 0, 'Il rend vraisemblable le fait et autorise à le compléter par témoins ou présomptions (article 1362).'],
            ['Un contrat de vente de 5 000 euros entre deux particuliers peut en principe être prouvé uniquement par témoins.', ['Vrai', 'Faux'], 1, 'Au-delà de 1 500 euros, l’écrit est exigé, sauf impossibilité ou commencement de preuve par écrit.'],
            ['L’article 9 du Code de procédure civile dispose que…', ['Chaque partie doit prouver les faits nécessaires au succès de sa prétention', 'Le juge doit rechercher seul la vérité', 'Toute preuve illégale est admise', 'Seul l’écrit est recevable'], 0, 'Il incombe à chaque partie de prouver conformément à la loi les faits nécessaires au succès de sa prétention.'],
            ['Que désigne l’aveu en matière civile ?', ['La déclaration du juge', 'La déclaration par laquelle une partie reconnaît pour vrai un fait qui peut lui nuire', 'Un témoignage anonyme', 'Un acte sous signature privée'], 1, 'L’aveu est la reconnaissance, par une partie, d’un fait de nature à produire contre elle des conséquences juridiques.'],
          ],
        },

        // ---------------------------------------------------------------- 4
        {
          titre: 'Les personnes physiques : la personnalité juridique',
          axe: 'Semestre 1 — Introduction au droit et droit des personnes',
          lecon: {
            titre: 'Être une personne en droit : naissance, fin et droits de la personnalité',
            cours: `La **personnalité juridique** est l’aptitude à être titulaire de droits et assujetti à des obligations. Les êtres humains sont des **personnes physiques** ; tout être humain, sans exception, a la personnalité juridique : l’esclavage et la mort civile n’existent plus en droit français.

## Le début de la personnalité
En principe, la personnalité juridique commence à la **naissance**, à condition que l’enfant naisse **vivant et viable**. Une exception, qui tient à l’adage **infans conceptus pro nato habetur quoties de commodis ejus agitur** (l’enfant conçu est considéré comme né chaque fois que son intérêt l’exige) : l’**article 906 du Code civil** permet de recevoir une donation ou un legs dès lors qu’on est **conçu**, à condition de naître viable. L’embryon n’est cependant pas une personne juridique ; il bénéficie du respect dû à l’être humain dès le commencement de sa vie (article 16).

## La fin de la personnalité
La personnalité s’éteint à la **mort**, constatée par un médecin. Le droit organise le sort des personnes dont le décès n’est pas certain : l’**absence** (disparition inquiétante, article 112 et suivants) puis, après jugement, la déclaration d’absence ou de décès. Lorsque plusieurs personnes meurent dans le même événement sans qu’on sache laquelle est décédée la première, on parle de **commorientes** : aucune ne succède à l’autre.

## Capacité de jouissance et capacité d’exercice
- La **capacité de jouissance** est l’aptitude à être titulaire de droits. Elle appartient à toute personne et ne peut être retirée en bloc.
- La **capacité d’exercice** est l’aptitude à exercer soi-même ses droits. Elle peut être limitée : les **incapables** (mineurs, majeurs protégés) sont protégés et représentés ou assistés.

## Les droits de la personnalité
Chacun possède des droits attachés à sa personne : droit au respect de la vie privée (**article 9**), droit à l’image, droit à l’honneur, droit au nom, présomption d’innocence (article 9-1). Ces droits sont **extrapatrimoniaux** : ils ne se vendent pas, ne se prescrivent pas et ne se transmettent pas par succession (l’action en réparation, elle, peut être exercée dans certaines limites).

## Le corps humain
Le Code civil protège le corps (articles 16 et suivants, issus des lois de bioéthique de 1994).

| Principe | Contenu |
| Primauté de la personne (art. 16) | La loi assure le respect de l’être humain dès le commencement de sa vie |
| Inviolabilité du corps (art. 16-1) | Le corps humain est inviolable |
| Non-patrimonialité (art. 16-1) | Le corps, ses éléments et ses produits ne peuvent faire l’objet d’un droit patrimonial |
| Consentement (art. 16-3) | Aucune atteinte au corps sans consentement, sauf nécessité médicale |
| Gestation pour autrui (art. 16-7) | Toute convention de procréation ou de gestation pour le compte d’autrui est nulle |

Le don d’organes est gratuit ; l’eugénisme et le clonage reproductif sont interdits.

> Toute personne physique a la personnalité juridique de sa naissance (vivant et viable) à sa mort ; ses droits de la personnalité et son corps sont hors commerce.

## Exemple travaillé
Un testateur lègue un appartement à l’enfant que sa nièce porte, alors conçu. Il meurt le mois suivant ; l’enfant naît vivant et viable quelques mois plus tard. Le legs est-il valable ?
Majeure : pour recevoir par testament, il suffit d’être conçu à l’époque du décès du testateur, le legs n’ayant d’effet que si l’enfant naît viable (article 906).
Mineure : l’enfant était conçu au décès du testateur et il naît vivant et viable.
Conclusion : le legs est valable ; l’enfant en est titulaire, représenté par ses parents.`,
          },
          questions: [
            ['À quel moment commence en principe la personnalité juridique ?', ['À la conception', 'À la naissance, si l’enfant naît vivant et viable', 'À la majorité', 'À l’inscription sur le livret de famille'], 1, 'Le principe est la naissance vivant et viable ; l’enfant conçu est seulement considéré comme né quand son intérêt l’exige.'],
            ['Que permet l’article 906 du Code civil ?', ['De déshériter un enfant', 'À une personne conçue de recevoir une donation ou un legs, sous réserve de naître viable', 'De vendre ses organes', 'De changer de nom'], 1, 'Il applique l’adage infans conceptus : il suffit d’être conçu, à condition de naître viable.'],
            ['La personnalité juridique peut être retirée à un condamné.', ['Vrai', 'Faux'], 1, 'La mort civile a disparu : tout être humain a la personnalité juridique et la capacité de jouissance.'],
            ['La capacité d’exercice est…', ['L’aptitude à être titulaire de droits', 'L’aptitude à exercer soi-même ses droits', 'L’aptitude à voter', 'Le droit de travailler'], 1, 'Elle peut être limitée pour protéger certaines personnes (mineurs, majeurs protégés), contrairement à la capacité de jouissance.'],
            ['Que dit l’article 16-1 du Code civil ?', ['Le corps humain est inviolable et ne peut faire l’objet d’un droit patrimonial', 'Le corps appartient à la famille', 'Le corps peut être vendu en cas de nécessité', 'Le corps relève de la compétence du maire'], 0, 'Principes d’inviolabilité, d’indisponibilité et de non-patrimonialité du corps humain.'],
            ['Une convention de gestation pour le compte d’autrui est…', ['Valable si elle est gratuite', 'Valable si un notaire l’a reçue', 'Nulle', 'Valable avec l’accord des deux familles'], 2, 'L’article 16-7 prononce la nullité de toute convention de procréation ou de gestation pour le compte d’autrui.'],
            ['Les droits de la personnalité sont…', ['Patrimoniaux et cessibles', 'Extrapatrimoniaux', 'Réels', 'Réservés aux majeurs'], 1, 'Attachés à la personne, ils ne s’achètent ni ne se vendent.'],
            ['Que sont des « commorientes » ?', ['Des personnes mortes dans le même événement sans qu’on sache qui est mort le premier', 'Des héritiers réservataires', 'Des tuteurs', 'Des époux séparés de biens'], 0, 'Aucune ne succède à l’autre lorsqu’on ignore l’ordre des décès.'],
            ['Le droit au respect de la vie privée est consacré par…', ['L’article 9 du Code civil', 'L’article 1er', 'L’article 1103', 'L’article 544'], 0, 'L’article 9 : chacun a droit au respect de sa vie privée.'],
            ['Un embryon est une personne juridique titulaire de tous les droits.', ['Vrai', 'Faux'], 1, 'Il bénéficie du respect de l’être humain dès le commencement de sa vie, mais n’est pas une personne juridique.'],
            ['Le consentement est exigé avant toute atteinte à l’intégrité du corps, sauf…', ['Si un parent y consent pour un majeur', 'En cas de nécessité médicale pour la personne, lorsqu’elle ne peut consentir', 'Si le médecin le décide seul', 'Jamais, il n’y a pas d’exception'], 1, 'L’article 16-3 admet l’atteinte en cas de nécessité médicale pour la personne, lorsque son consentement ne peut être recueilli.'],
            ['L’absence d’une personne (art. 112 s.) vise…', ['Une personne dont on n’a plus de nouvelles et dont l’existence est incertaine', 'Un salarié non présent à son poste', 'Un témoin qui ne comparaît pas', 'Une personne en détention'], 0, 'La personne a cessé de paraître au lieu de son domicile sans nouvelles ; la loi organise la protection de ses intérêts puis la déclaration d’absence ou de décès.'],
          ],
        },
        // ---------------------------------------------------------------- 5
        {
          titre: 'L’état civil : nom, domicile, actes',
          axe: 'Semestre 1 — Introduction au droit et droit des personnes',
          lecon: {
            titre: 'Identifier une personne : nom, prénoms, domicile, sexe et actes',
            cours: `L’état civil (ou état des personnes) désigne l’ensemble des éléments qui identifient une personne et la situent dans la société : son nom, ses prénoms, son domicile, son sexe, sa filiation, sa situation familiale. Il a trois caractères : il est **d’ordre public** (on ne dispose pas librement de son état), indivisible (on ne peut avoir un état différent selon les domaines) et **indisponible** (on ne peut ni le vendre ni y renoncer).

## Le nom
Le nom de famille identifie la personne et marque son appartenance familiale. Il obéit au principe d’**immutabilité** : on ne change pas de nom à sa guise, sauf cas prévus par la loi. Le nom de l’enfant dépend de sa filiation : lorsque la filiation est établie à l’égard des deux parents, ils peuvent choisir de lui donner le nom de l’un, de l’autre, ou leurs deux noms accolés, dans l’ordre qu’ils choisissent et dans la limite d’un nom de famille chacun.

La **loi du 2 mars 2022** relative au choix du nom issu de la filiation (en vigueur depuis le 1er juillet 2022) a assoupli ce régime : toute personne majeure peut, **une fois dans sa vie**, demander à l’officier de l’état civil, par simple déclaration, à porter le nom de son autre parent en l’ajoutant au sien ou en s’y substituant. Elle a aussi facilité le **nom d’usage** : celui dont on se sert dans la vie sociale (ajout, ou substitution du nom d’un autre parent), qui ne figure pas dans les actes d’état civil et ne modifie pas le nom officiel. Hors de ces cas, un changement de nom exige un motif légitime, apprécié dans le cadre d’une procédure administrative (décret).

## Les prénoms
Les prénoms sont choisis par les parents et déclarés à l’officier de l’état civil. Si le prénom est contraire à l’intérêt de l’enfant (ridicule, grotesque, ou de nature à lui nuire), l’officier d’état civil en avise le procureur de la République, qui peut saisir le juge aux affaires familiales. Depuis la loi du 18 novembre 2016, un changement de prénom se demande à l’officier de l’état civil, sur justification d’un intérêt légitime.

## Le domicile
Le **domicile** est le lieu du principal établissement d’une personne (article 102). Il se distingue de la résidence (lieu où l’on vit de fait, même provisoirement). On distingue aussi le **domicile légal** (celui que la loi impose : le mineur non émancipé est domicilié chez ses parents) et le **domicile élu** (choisi pour l’exécution d’un acte, par exemple chez son avocat ou son notaire). Le domicile détermine notamment le tribunal territorialement compétent.

## Le sexe à l’état civil
Depuis la loi du 18 novembre 2016, toute personne majeure ou mineure émancipée qui démontre que la mention de son sexe ne correspond pas à son apparence et à son comportement social peut en demander la modification, devant le tribunal judiciaire, **sans avoir à justifier d’un traitement médical** ni d’une opération.

## Les actes de l’état civil
Les **actes d’état civil** constatent les événements qui rythment la vie d’une personne : naissance, mariage, décès. L’acte de naissance est dressé sur déclaration dans les cinq jours de l’accouchement. Ils sont authentiques : établis par un officier public, ils font foi jusqu’à inscription de faux. Chaque acte peut recevoir des **mentions marginales** (reconnaissance, mariage, divorce) qui le mettent à jour. On en délivre des copies intégrales (à tout intéressé dans certains cas) ou des extraits. Une erreur matérielle se rectifie par décision de justice, ou, pour les erreurs purement matérielles, sur décision du procureur de la République.

| Élément | Règle essentielle |
| Nom | Immuable ; changement par motif légitime ou procédures spéciales (2022) |
| Prénom | Choix des parents ; changement par déclaration en mairie |
| Domicile | Lieu du principal établissement (art. 102) |
| Actes | Authentiques ; mentions marginales ; rectification judiciaire |

> L’état civil est d’ordre public, indisponible et indivisible ; il se prouve par des actes authentiques que seule la justice peut rectifier.

## Exemple travaillé
Madame Durand, majeure, souhaite porter le nom de sa mère, Martin, en l’ajoutant au sien. Doit-elle saisir un juge ?
Majeure : depuis la loi du 2 mars 2022, toute personne majeure peut, par déclaration à l’officier de l’état civil, ajouter à son nom celui de son autre parent, une fois dans sa vie.
Mineure : Madame Durand est majeure et n’a jamais fait cette démarche.
Conclusion : elle n’a pas à saisir un juge ; une déclaration à l’officier de l’état civil suffit.`,
          },
          questions: [
            ['Que signifie que l’état des personnes est indisponible ?', ['On ne peut ni le vendre ni y renoncer', 'Il n’est pas accessible au public', 'Il est réservé aux majeurs', 'Il est toujours modifiable'], 0, 'L’indisponibilité interdit de céder son état ou d’y renoncer par contrat.'],
            ['Quel texte a permis en 2022 à toute personne majeure d’ajouter ou de substituer à son nom celui de son autre parent, une fois dans sa vie ?', ['La loi du 2 mars 2022', 'La loi du 4 mars 2002', 'La loi du 17 mai 2013', 'La loi du 23 mars 2019'], 0, 'La loi du 2 mars 2022 relative au choix du nom issu de la filiation, en vigueur depuis le 1er juillet 2022.'],
            ['Le nom d’usage figure sur l’acte de naissance et remplace le nom de famille.', ['Vrai', 'Faux'], 1, 'Le nom d’usage est un nom de la vie sociale ; il ne modifie pas le nom officiel porté dans les actes d’état civil.'],
            ['Le domicile est, selon l’article 102 du Code civil…', ['Le lieu où l’on est né', 'Le lieu du principal établissement', 'Toute résidence secondaire', 'Le lieu de travail'], 1, 'Le domicile est le lieu où la personne a son principal établissement ; la résidence est le lieu de séjour de fait.'],
            ['Le mineur non émancipé a pour domicile légal…', ['Celui de son école', 'Celui de ses parents', 'Celui de son choix', 'Celui de son juge des enfants'], 1, 'Le mineur non émancipé est domicilié chez ses parents.'],
            ['Quelle est la différence entre domicile et résidence ?', ['Aucune', 'Le domicile est le principal établissement, la résidence est le lieu où l’on vit de fait', 'La résidence est toujours à l’étranger', 'Le domicile ne concerne que les entreprises'], 1, 'La résidence est une situation de fait ; le domicile, une notion juridique.'],
            ['Les actes d’état civil sont des actes…', ['Sous signature privée', 'Authentiques', 'De la jurisprudence', 'Sans force probante'], 1, 'Ils sont établis par un officier public et font foi jusqu’à inscription de faux.'],
            ['Depuis la loi du 18 novembre 2016, le changement de la mention du sexe à l’état civil exige une opération chirurgicale.', ['Vrai', 'Faux'], 1, 'La loi ne l’exige pas : la personne doit démontrer que la mention ne correspond pas à son apparence et à son comportement social.'],
            ['Que sont les mentions marginales ?', ['Les erreurs de l’officier d’état civil', 'Les mises à jour portées en marge d’un acte (mariage, divorce, reconnaissance)', 'Des sanctions pénales', 'Les noms d’usage'], 1, 'Elles mettent à jour l’acte d’état civil sans en créer un nouveau.'],
            ['Le changement de prénom se fait aujourd’hui…', ['Uniquement devant le Conseil d’État', 'Par décret', 'Par déclaration à l’officier de l’état civil, sur justification d’un intérêt légitime', 'Librement par simple lettre à l’employeur'], 2, 'La loi du 18 novembre 2016 a déjudiciarisé la procédure : la demande se fait en mairie.'],
            ['Un domicile élu est…', ['Le domicile légal d’un majeur protégé', 'Un domicile choisi pour l’exécution d’un acte', 'Le lieu de naissance', 'Un domicile fiscal'], 1, 'Par exemple, on élit domicile chez son avocat ou chez le notaire pour les besoins d’un acte ou d’une instance.'],
            ['Selon le principe d’immutabilité du nom…', ['Le nom ne peut jamais changer', 'On ne change pas de nom à sa guise : il faut un motif légitime ou une procédure prévue par la loi', 'Le nom change à la majorité', 'Le nom est choisi à 18 ans'], 1, 'Le nom est stable ; les exceptions sont limitativement prévues (motif légitime, loi de 2022, adoption, etc.).'],
          ],
        },

        // ---------------------------------------------------------------- 6
        {
          titre: 'Les incapacités : mineurs et majeurs protégés',
          axe: 'Semestre 1 — Introduction au droit et droit des personnes',
          lecon: {
            titre: 'Protéger ceux qui ne peuvent agir seuls : mineurs et majeurs protégés',
            cours: `Une incapacité est une limitation de la capacité d’exercice, instituée pour protéger la personne (ou, rarement, pour sanctionner). L’incapable a la capacité de jouissance (il est titulaire de droits) mais ne peut pas toujours les exercer seul : il est **représenté** (quelqu’un agit à sa place) ou **assisté** (quelqu’un l’accompagne dans l’acte).

## Le mineur
Est mineure toute personne qui n’a pas atteint l’âge de **dix-huit ans** (article 414 : la majorité est fixée à 18 ans accomplis). Le mineur est en principe incapable d’exercice : il agit par l’intermédiaire de ses représentants légaux, ses parents (administration légale, article 382 et suivants), ou, à défaut, un tuteur. Les actes accomplis par le mineur sans représentation sont en principe nuls (nullité relative), mais une exception majeure existe : les **actes de la vie courante**, autorisés par la loi ou l’usage et conclus à des conditions normales, sont valables (article 1148). Un mineur peut ainsi acheter un ticket de bus ou une baguette.

## L’émancipation
Le mineur peut être **émancipé** dès l’âge de **seize ans**, par décision du juge des tutelles, sur demande de ses parents ou de l’un d’eux, lorsque de justes motifs le justifient (article 413-2). Il devient alors capable comme un majeur pour les actes de la vie civile, mais il reste mineur pour d’autres domaines : il ne peut pas se marier avant 18 ans, et l’exercice du commerce est subordonné à une autorisation du juge des tutelles.

## Les majeurs protégés
Un majeur dont les facultés sont altérées peut bénéficier d’une mesure de protection. L’**article 425** pose la condition : l’impossibilité de pourvoir seul à ses intérêts en raison d’une altération (médicalement constatée) de ses facultés mentales ou corporelles de nature à empêcher l’expression de sa volonté. Les principes directeurs sont ceux de **nécessité, de subsidiarité et de proportionnalité** (article 428) : la mesure n’est ordonnée que si elle est nécessaire, si une mesure moins contraignante ne suffit pas, et elle doit être individualisée.

| Mesure | Nature | Pour qui ? |
| Sauvegarde de justice | Protection temporaire et légère, sans représentation générale | Altération temporaire ou attente d’une mesure plus durable |
| Curatelle | Assistance : le curateur assiste la personne pour les actes graves | Personne ayant besoin d’être conseillée ou contrôlée de manière continue |
| Tutelle | Représentation : le tuteur agit à la place de la personne | Personne devant être représentée de manière continue |
| Habilitation familiale | Représentation par un proche, sans juge permanent | Famille en mesure de protéger la personne |
| Mandat de protection future | Mesure **anticipée**, choisie en toute conscience | Toute personne souhaitant organiser sa protection |

L’**habilitation familiale** (ordonnance du 15 octobre 2015) permet à un proche (ascendant, descendant, frère ou sœur, conjoint, partenaire, concubin) d’être habilité par le juge à représenter la personne, sans la lourdeur d’une tutelle. Le **mandat de protection future** permet à chacun de désigner à l’avance la personne qui s’occupera de lui.

## La réforme de 2019
La **loi du 23 mars 2019** (programmation et réforme pour la justice) a modernisé ce droit : elle a supprimé la possibilité pour le juge de priver de son droit de vote une personne sous tutelle, et a libéré le mariage et le PACS des majeurs protégés de l’autorisation du juge (la personne chargée de la protection est simplement informée, et peut s’y opposer) ; dans l’instance en divorce, le majeur en tutelle est désormais représenté par son tuteur sans autorisation préalable, tout en maintenant un contrôle pour les actes les plus graves. Elle a aussi simplifié la procédure et le contrôle des comptes.

> Mineurs et majeurs protégés sont protégés par la représentation ou l’assistance ; toute mesure de protection est nécessaire, subsidiaire et proportionnée.

## Exemple travaillé
Léa, 17 ans, non émancipée, vend seule sa moto d’occasion 2 000 euros. Ses parents veulent faire annuler la vente. Peuvent-ils y parvenir ?
Majeure : le mineur non émancipé est incapable d’exercice ; ses actes ne sont valables que s’ils sont des actes de la vie courante conclus à des conditions normales, sinon ils sont annulables pour incapacité.
Mineure : la vente d’une moto 2 000 euros n’est pas un acte courant ; Léa a agi seule, sans ses représentants.
Conclusion : l’acte est annulable (nullité relative) à la demande des parents, représentants légaux de Léa.`,
          },
          questions: [
            ['À quel âge est-on majeur en droit civil français ?', ['16 ans', '18 ans', '21 ans', '25 ans'], 1, 'L’article 414 fixe la majorité à 18 ans accomplis.'],
            ['Quel est l’âge minimum de l’émancipation ?', ['14 ans', '15 ans', '16 ans', '17 ans'], 2, 'Le mineur peut être émancipé dès 16 ans par le juge des tutelles (article 413-2).'],
            ['Un mineur non émancipé peut valablement conclure un acte de la vie courante à des conditions normales.', ['Vrai', 'Faux'], 0, 'Article 1148 : les actes courants autorisés par la loi ou l’usage sont valables même accomplis seuls.'],
            ['Quelle mesure de protection fonctionne par REPRÉSENTATION ?', ['La curatelle simple', 'La tutelle', 'La sauvegarde de justice', 'Le mandat de protection future uniquement'], 1, 'Dans la tutelle, le tuteur agit à la place de la personne protégée ; dans la curatelle, il l’assiste.'],
            ['Dans la curatelle, le curateur…', ['Représente la personne pour tous les actes', 'Assiste la personne pour les actes les plus graves', 'N’a aucun pouvoir', 'Décide à sa place du lieu de résidence'], 1, 'La personne en curatelle agit seule pour les actes courants et est assistée pour les actes importants.'],
            ['Quels sont les principes directeurs de toute mesure de protection ?', ['Rapidité, secret, gratuité', 'Nécessité, subsidiarité, proportionnalité', 'Autorité, discipline, sanction', 'Famille, patrimoine, état'], 1, 'Article 428 : la mesure est ordonnée si elle est nécessaire, et seulement si une mesure moins contraignante ne suffit pas.'],
            ['Qu’est-ce que le mandat de protection future ?', ['Une mesure décidée par le juge sans le consentement de l’intéressé', 'Une mesure anticipée par laquelle une personne désigne à l’avance qui s’occupera d’elle', 'Une tutelle pour les mineurs', 'Un contrat de travail'], 1, 'Chacun peut organiser sa propre protection pour le cas où il ne pourrait plus pourvoir seul à ses intérêts.'],
            ['La loi du 23 mars 2019 a permis…', ['De retirer le droit de vote à toute personne sous tutelle', 'De supprimer la privation du droit de vote des personnes sous tutelle', 'D’abaisser la majorité à 16 ans', 'De supprimer la tutelle'], 1, 'Le juge ne peut plus priver du droit de vote les personnes sous tutelle.'],
            ['Un mineur émancipé est capable comme un majeur, mais ne peut se marier avant 18 ans.', ['Vrai', 'Faux'], 0, 'L’émancipation donne la capacité civile, pas l’âge du mariage ; l’exercice du commerce suppose une autorisation du juge.'],
            ['L’habilitation familiale permet…', ['À un proche d’être habilité à représenter un parent vulnérable, sans tutelle', 'De déshériter un incapable', 'D’émanciper un enfant', 'De dissoudre un mariage'], 0, 'Issue de l’ordonnance du 15 octobre 2015, elle permet à un proche de représenter la personne sous contrôle limité du juge.'],
            ['Quelle sanction frappe en principe l’acte accompli seul par un mineur hors vie courante ?', ['L’inexistence', 'La nullité relative', 'Une amende civile', 'Aucune, l’acte est valable'], 1, 'La nullité est relative : seul l’incapable protégé (ou son représentant) peut l’invoquer.'],
            ['Quelle condition essentielle justifie l’ouverture d’une mesure de protection d’un majeur ?', ['Une altération médicalement constatée des facultés, empêchant de pourvoir seul à ses intérêts', 'Avoir plus de 70 ans', 'Avoir des dettes', 'Une décision du maire'], 0, 'Article 425 : altération des facultés mentales ou corporelles de nature à empêcher l’expression de la volonté, constatée médicalement.'],
          ],
        },

        // ---------------------------------------------------------------- 7
        {
          titre: 'Les personnes morales',
          axe: 'Semestre 1 — Introduction au droit et droit des personnes',
          lecon: {
            titre: 'Les groupements dotés de la personnalité juridique',
            cours: `Une **personne morale** est un groupement de personnes ou de biens doté de la **personnalité juridique** : il est lui-même titulaire de droits et d’obligations, distinct des membres qui le composent. C’est la personne morale, et non ses associés, qui contracte, possède, agit en justice et endosse les dettes.

## Les grandes catégories
On distingue les personnes morales de droit public (l’État, les collectivités territoriales, les établissements publics) et celles de droit privé.

| Catégorie | Exemples | But |
| Sociétés | SARL, SAS, société anonyme | Partager les bénéfices ou profiter de l’économie réalisée |
| Associations | Association loi du 1er juillet 1901 | But autre que le partage des bénéfices |
| Syndicats | Syndicats de salariés (loi du 21 mars 1884) | Défense d’intérêts professionnels |
| Fondations, GIE | Fondation, groupement d’intérêt économique | Mission d’intérêt général ou coopération |

La **société** est définie par l’**article 1832 du Code civil** : elle est instituée par deux ou plusieurs personnes (ou, dans les cas prévus par la loi, par une seule) qui conviennent d’affecter à une entreprise commune des biens ou leur industrie en vue de partager le bénéfice ou de profiter de l’économie qui pourra en résulter. Elle suppose des **apports**, la **recherche d’un bénéfice** et l’**affectio societatis** (la volonté de collaborer sur un pied d’égalité). L’**association**, définie par l’article 1er de la loi de 1901, est la convention par laquelle deux ou plusieurs personnes mettent en commun, d’une façon permanente, leurs connaissances ou leur activité dans un but autre que de partager des bénéfices.

## Comment naît la personnalité morale ?
Elle s’acquiert selon le type de groupement : la société jouit de la personnalité morale à compter de son **immatriculation au registre du commerce et des sociétés** (article 1842) ; l’association est capable de contracter dès sa **déclaration en préfecture** et sa publication au Journal officiel (pour la pleine capacité). La jurisprudence reconnaît aussi la personnalité morale à tout groupement doté d’une possibilité d’expression collective pour la défense d’intérêts licites (Cass. civ. 2e, 28 janvier 1954, comité d’établissement de Saint-Chamond).

## Les attributs de la personnalité morale
- un nom (dénomination, raison sociale) ;
- un siège social, équivalent du domicile ;
- une nationalité ;
- un patrimoine propre, distinct de celui des membres ;
- la capacité d’agir en justice ;
- des **organes** (gérant, président, conseil d’administration, assemblée générale) qui l’expriment, car la personne morale n’a pas de volonté propre.

La capacité de la personne morale est limitée par le **principe de spécialité** : elle ne peut agir que dans les limites de son objet, tel qu’il est défini par ses statuts, sauf pour les actes qui en sont l’accessoire.

## Conséquences : le patrimoine séparé
Parce que la personne morale a un patrimoine propre, les créanciers de la société ne peuvent poursuivre les associés d’une SARL ou d’une société anonyme sur leurs biens personnels : leur responsabilité est limitée à leurs apports. La contrepartie est le contrôle des dirigeants, qui engagent leur responsabilité en cas de faute de gestion.

## La fin de la personnalité morale
La personne morale disparaît par **dissolution** (arrivée du terme, réalisation de l’objet, décision des associés, décision judiciaire), suivie de la liquidation (paiement des dettes, répartition du solde).

> La personne morale est un sujet de droit distinct de ses membres, avec son nom, son siège, son patrimoine et ses organes, dans la limite de son objet.

## Exemple travaillé
Une SARL ne peut pas payer son fournisseur. Celui-ci poursuit l’un des associés sur ses biens personnels. L’associé doit-il payer ?
Majeure : la personne morale a un patrimoine distinct de celui de ses membres, et les associés d’une SARL ne répondent des dettes sociales que dans la limite de leurs apports.
Mineure : la dette est celle de la SARL, l’associé a déjà versé ses apports et n’a pas cautionné la dette.
Conclusion : le fournisseur ne peut saisir les biens personnels de l’associé ; il doit agir contre la société.`,
          },
          questions: [
            ['Qu’est-ce qu’une personne morale ?', ['Une personne respectueuse de la morale', 'Un groupement doté de la personnalité juridique', 'Un mineur protégé', 'Un fonctionnaire'], 1, 'Elle est titulaire de droits et d’obligations, distincts de ceux de ses membres.'],
            ['Laquelle de ces entités est une personne morale de droit public ?', ['Une SARL', 'Une association loi 1901', 'Une commune', 'Une SAS'], 2, 'Les collectivités territoriales (communes, départements, régions) sont des personnes morales de droit public.'],
            ['Une association a pour but de partager des bénéfices entre ses membres.', ['Vrai', 'Faux'], 1, 'Au contraire : l’article 1er de la loi de 1901 exige un but autre que le partage de bénéfices.'],
            ['La société a la personnalité morale à compter…', ['De la signature des statuts', 'De son immatriculation au RCS', 'De la première assemblée', 'De son premier bilan'], 1, 'L’article 1842 : les sociétés jouissent de la personnalité morale à compter de leur immatriculation.'],
            ['L’article 1832 du Code civil définit…', ['L’association', 'Le contrat', 'La société', 'La propriété'], 2, 'La société suppose des apports, un projet commun et le partage des bénéfices ou des économies.'],
            ['Qu’est-ce que l’affectio societatis ?', ['Le capital minimal', 'La volonté des associés de collaborer à égalité à l’entreprise commune', 'Le siège de la société', 'La dissolution de la société'], 1, 'C’est l’un des éléments constitutifs du contrat de société avec les apports et la participation aux résultats.'],
            ['Le principe de spécialité signifie que la personne morale…', ['Peut tout faire', 'Ne peut agir que dans les limites de son objet', 'Ne peut pas agir en justice', 'N’a pas de patrimoine'], 1, 'Sa capacité est limitée à son objet défini par les statuts, sauf actes accessoires.'],
            ['Les associés d’une SARL répondent des dettes de la société sur tous leurs biens personnels.', ['Vrai', 'Faux'], 1, 'Leur responsabilité est limitée aux apports : le patrimoine de la société est distinct du leur.'],
            ['Un syndicat de salariés relève de la loi…', ['Du 1er juillet 1901', 'Du 21 mars 1884', 'Du 17 mai 2013', 'Du 2 août 2021'], 1, 'La loi du 21 mars 1884 a reconnu la liberté syndicale.'],
            ['La personne morale exprime sa volonté par…', ['Ses clients', 'Ses organes (gérant, président, assemblée…)', 'Le juge', 'Ses créanciers'], 1, 'Dépourvue de volonté propre, elle agit par l’intermédiaire de ses organes.'],
            ['Quel est l’attribut de la personne morale équivalent du domicile ?', ['Le nom', 'Le siège social', 'La nationalité', 'L’objet social'], 1, 'Le siège social est le lieu de son principal établissement.'],
            ['La personne morale prend fin par…', ['La mort de son dirigeant', 'La dissolution suivie de la liquidation', 'La majorité de ses associés', 'Le changement de nom'], 1, 'Après dissolution, la liquidation règle les dettes et répartit le solde.'],
          ],
        },

        // ---------------------------------------------------------------- 8
        {
          titre: 'Le couple : mariage, PACS, concubinage',
          axe: 'Semestre 2 — Droit de la famille',
          lecon: {
            titre: 'Trois façons de vivre en couple : mariage, PACS et concubinage',
            cours: `Le droit français reconnaît trois formes de vie de couple, qui n’offrent ni les mêmes droits ni les mêmes devoirs : le mariage, le pacte civil de solidarité (PACS) et le concubinage.

## Le mariage
Depuis la **loi du 17 mai 2013**, le mariage est contracté par deux personnes de sexe différent ou de même sexe (article 143). Ses conditions de fond sont les suivantes : un **âge minimal de dix-huit ans** (article 144), un **consentement** libre de chacun des époux (article 146), l’absence de bigamie (article 147) et d’inceste (articles 161 et suivants). La condition de forme est la célébration publique par l’officier de l’état civil, à la mairie, après publication des bans.

Les époux se doivent mutuellement **respect, fidélité, secours et assistance** (article 212) et s’obligent à une communauté de vie (article 215). Ils contribuent aux charges du mariage selon leurs facultés (article 214). Chacun a le pouvoir de passer seul les contrats qui ont pour objet l’entretien du ménage ou l’éducation des enfants, et l’autre époux est alors solidairement tenu de la dette (article 220), sauf dépenses manifestement excessives. Le logement de la famille est protégé : aucun époux ne peut en disposer seul (article 215, alinéa 3).

Les rapports patrimoniaux sont régis par le régime matrimonial. À défaut de contrat de mariage, les époux sont soumis au régime légal de la **communauté réduite aux acquêts** : les biens acquis pendant le mariage sont communs, les biens possédés avant ou reçus par donation ou succession restent propres. Ils peuvent choisir la séparation de biens, la participation aux acquêts ou la communauté universelle, devant notaire. Depuis la loi du 23 mars 2019, ils peuvent changer de régime par un acte notarié, sans attendre un délai de deux ans, l’homologation du juge n’étant plus nécessaire dans la plupart des cas.

## Le PACS
Le **PACS** est un contrat conclu par deux personnes physiques majeures, de sexe différent ou de même sexe, pour organiser leur vie commune (**article 515-1**, issu de la loi du 15 novembre 1999). Il est enregistré par déclaration conjointe devant l’officier de l’état civil (ou le notaire). Les partenaires s’apportent une **aide matérielle et une assistance réciproques** (article 515-4) et sont solidaires des dettes contractées pour les besoins de la vie courante. En l’absence de choix contraire, le régime est celui de la **séparation des patrimoines** (article 515-5). Le PACS prend fin par déclaration conjointe, décision unilatérale signifiée à l’autre, mariage ou décès d’un des partenaires.

## Le concubinage
Le concubinage est défini par l’**article 515-8** comme une union de fait, caractérisée par une vie commune présentant un caractère de stabilité et de continuité, entre deux personnes de sexe différent ou de même sexe qui vivent en couple. Il ne crée par lui-même aucun devoir entre concubins ; sa rupture est libre, sauf abus ou faute dommageable.

| | Mariage | PACS | Concubinage |
| Formalité | Célébration en mairie | Enregistrement | Aucune |
| Devoirs | Fidélité, secours, assistance | Aide matérielle, assistance | Aucun |
| Dettes ménagères | Solidarité | Solidarité | Aucune |
| Héritage légal | Oui, le conjoint | Non (testament) | Non (testament) |
| Rupture | Divorce | Déclaration ou signification | Libre |

> Le mariage est le plus protecteur, le PACS un contrat souple de vie commune, le concubinage une simple situation de fait.

## Exemple travaillé
Deux concubins vivent ensemble depuis dix ans ; l’un décède sans testament. Son compagnon peut-il hériter ?
Majeure : le concubin n’a pas la qualité d’héritier légal ; seuls les parents proches et le conjoint survivant (marié) succèdent, sauf testament.
Mineure : les deux compagnons n’étaient ni mariés ni pacsés et il n’y a pas de testament.
Conclusion : le concubin survivant n’hérite pas ; il aurait fallu un testament, voire un mariage.`,
          },
          questions: [
            ['Quelle loi a ouvert le mariage aux couples de même sexe ?', ['La loi du 15 novembre 1999', 'La loi du 17 mai 2013', 'La loi du 4 mars 2002', 'La loi du 23 mars 2019'], 1, 'La loi du 17 mai 2013 a ouvert le mariage aux personnes de même sexe (article 143 du Code civil).'],
            ['Quel est l’âge minimal pour se marier ?', ['15 ans', '16 ans', '18 ans', '21 ans'], 2, 'L’article 144 impose dix-huit ans révolus.'],
            ['Les époux se doivent fidélité, secours et assistance.', ['Vrai', 'Faux'], 0, 'Article 212 : respect, fidélité, secours, assistance.'],
            ['Quel est le régime matrimonial légal ?', ['La séparation de biens', 'La communauté universelle', 'La communauté réduite aux acquêts', 'La participation aux acquêts'], 2, 'À défaut de contrat de mariage, les époux relèvent de la communauté réduite aux acquêts.'],
            ['Qu’organise l’article 220 du Code civil ?', ['Le divorce', 'La solidarité des époux pour les dettes ménagères', 'Le PACS', 'La filiation'], 1, 'Un époux peut engager le ménage par les dettes d’entretien du ménage ou d’éducation des enfants.'],
            ['Un PACS peut être conclu par un mineur émancipé.', ['Vrai', 'Faux'], 1, 'Les deux partenaires doivent être majeurs (article 515-1).'],
            ['Le régime légal du PACS est…', ['La communauté', 'La séparation des patrimoines', 'La participation aux acquêts', 'La communauté universelle'], 1, 'Chaque partenaire reste propriétaire de ses biens, sauf convention contraire (article 515-5).'],
            ['Le concubinage est défini à…', ['L’article 143', 'L’article 515-1', 'L’article 515-8', 'L’article 220'], 2, 'L’article 515-8 : une union de fait, avec vie commune stable et continue.'],
            ['Le concubin survivant est héritier légal de son compagnon.', ['Vrai', 'Faux'], 1, 'Il n’hérite que s’il y a un testament ; ni le PACS ni le concubinage ne créent de vocation successorale légale.'],
            ['Comment se rompt un PACS ?', ['Par déclaration conjointe ou décision unilatérale signifiée', 'Par un divorce devant le juge', 'Il ne peut jamais se rompre', 'Par la volonté du maire'], 0, 'Le PACS se dissout par déclaration conjointe, décision unilatérale, mariage ou décès.'],
            ['Que protège l’article 215, alinéa 3, du Code civil ?', ['Le nom du conjoint', 'Le logement de la famille', 'La fidélité', 'L’héritage'], 1, 'Aucun époux ne peut, seul, disposer des droits par lesquels est assuré le logement de la famille.'],
            ['Depuis la loi du 23 mars 2019, le changement de régime matrimonial…', ['Est interdit', 'Exige toujours deux ans et le juge', 'Peut se faire par acte notarié sans condition de délai', 'Se fait au tribunal'], 2, 'Le délai de deux ans a été supprimé, et l’homologation judiciaire n’est plus obligatoire sauf opposition ou enfants mineurs.'],
          ],
        },
        // ---------------------------------------------------------------- 9
        {
          titre: 'Le divorce',
          axe: 'Semestre 2 — Droit de la famille',
          lecon: {
            titre: 'Les quatre cas de divorce et leurs effets',
            cours: `Le divorce est la dissolution du mariage du vivant des deux époux. Il se distingue de la séparation de corps, qui relâche le lien conjugal (fin du devoir de cohabitation) sans le rompre, et de l’annulation du mariage, qui sanctionne un vice originel. Le droit du divorce a été profondément remanié par la loi du 18 novembre 2016 (divorce par acte d’avocats) et par la **loi du 23 mars 2019**, entrée en application le 1er janvier 2021.

## Les quatre cas de divorce
L’**article 229** du Code civil énumère quatre cas.

| Cas | Principe | Procédure |
| Consentement mutuel | Les époux sont d’accord sur le principe et sur toutes les conséquences | Convention rédigée par **acte sous signature privée contresigné par avocats**, déposée au rang des minutes d’un notaire (**article 229-1**) ; pas de juge |
| Acceptation du principe de la rupture | Les époux acceptent la rupture sans considération des faits | Devant le juge aux affaires familiales |
| Altération définitive du lien conjugal | Cessation de la communauté de vie depuis **un an** (art. 238) | Devant le juge |
| Faute | Violations graves ou renouvelées des devoirs et obligations du mariage rendant intolérable le maintien de la vie commune (art. 242) | Devant le juge |

Depuis le 1er janvier 2017, le divorce par consentement mutuel peut ne pas passer devant un juge. Le juge reste compétent dans deux situations : lorsqu’un enfant mineur demande à être entendu par le juge, et lorsque l’un des époux est placé sous un régime de protection (tutelle, curatelle). Le divorce est alors définitif dès le dépôt de la convention chez le notaire, qui lui confère date certaine et force exécutoire.

## La procédure contentieuse depuis 2021
La réforme de 2019 a **supprimé la phase de conciliation** préalable. La procédure s’ouvre désormais par une **assignation** devant le **juge aux affaires familiales** du tribunal judiciaire. Le demandeur n’est plus obligé d’indiquer le fondement de sa demande dans l’assignation ; les époux peuvent aussi présenter une demande conjointe. Une audience d’orientation et sur mesures provisoires permet au juge de statuer sur les mesures provisoires (résidence, pension, logement) et d’organiser la suite de la procédure. Le délai d’un an de séparation de l’article 238 s’apprécie en principe à la date de la demande (ou, lorsque la demande ne précise pas de motif, au prononcé du divorce).

## Les effets du divorce
- Entre les époux : le divorce met fin au devoir de fidélité et de secours. Le jugement prend effet dans les rapports patrimoniaux à la date de la **demande en divorce** (le juge peut, à la demande de l’un, reporter ces effets à la date de la cessation de la cohabitation et de la collaboration). Chacun perd en principe l’usage du nom de l’autre (article 264), sauf accord ou autorisation du juge.
- **La prestation compensatoire** (**article 270**) : elle vise à compenser la **disparité** que la rupture du mariage crée dans les conditions de vie respectives des époux. Elle prend en principe la forme d’un **capital**, exceptionnellement d’une rente viagère.
- Les enfants : le divorce est sans incidence sur l’autorité parentale, qui reste exercée conjointement. Il se règle aussi la résidence de l’enfant (chez l’un ou en alternance) et la contribution à son entretien (pension alimentaire).
- Le régime matrimonial : liquidation et partage des biens communs, sous la direction d’un notaire.
- Les dommages et intérêts : possibles pour les conséquences d’une particulière gravité (article 266) ou sur le fondement de la responsabilité civile en cas de faute.

> Il existe quatre cas de divorce ; sans conciliation depuis 2021, la procédure s’ouvre par assignation, tandis que le divorce par consentement mutuel se fait par acte d’avocats, sans juge.

## Exemple travaillé
Deux époux, sans enfant, sont d’accord sur tout : partage des biens, absence de prestation compensatoire. Doivent-ils plaider devant le juge ?
Majeure : le divorce par consentement mutuel est constaté par un acte sous signature privée contresigné par avocats et déposé chez un notaire (article 229-1), sans intervention du juge, sauf demande d’audition d’un enfant mineur ou protection de l’un des époux.
Mineure : les deux époux sont d’accord, sont majeurs capables, et n’ont pas d’enfant.
Conclusion : ils divorcent sans juge, par acte d’avocats déposé chez le notaire.`,
          },
          questions: [
            ['Combien de cas de divorce l’article 229 du Code civil énumère-t-il ?', ['Deux', 'Trois', 'Quatre', 'Cinq'], 2, 'Consentement mutuel, acceptation du principe de la rupture, altération définitive du lien conjugal, faute.'],
            ['Depuis le 1er janvier 2017, le divorce par consentement mutuel peut être conclu…', ['Devant le maire', 'Par acte sous signature privée contresigné par avocats, déposé chez un notaire', 'Seulement par le juge', 'Par simple lettre à l’autre époux'], 1, 'C’est la déjudiciarisation instituée par la loi du 18 novembre 2016 (article 229-1).'],
            ['Dans le divorce par consentement mutuel par acte d’avocats, un juge intervient toujours.', ['Vrai', 'Faux'], 1, 'Il n’intervient pas, sauf si un enfant mineur demande à être entendu ou si un époux est sous régime de protection.'],
            ['La phase de conciliation préalable au divorce contentieux a été supprimée…', ['En 2004', 'Le 1er janvier 2021', 'En 2013', 'Elle existe toujours'], 1, 'La loi du 23 mars 2019 a supprimé la tentative de conciliation et simplifié l’introduction de l’instance depuis le 1er janvier 2021.'],
            ['Quel est le délai de séparation nécessaire pour établir l’altération définitive du lien conjugal ?', ['Six mois', 'Un an', 'Deux ans', 'Cinq ans'], 1, 'Depuis la réforme de 2019, la cessation de la communauté de vie depuis un an (article 238).'],
            ['Dans quel cas le divorce pour faute est-il possible ?', ['Dès qu’un époux est mécontent', 'En cas de violations graves ou renouvelées des devoirs du mariage rendant intolérable le maintien de la vie commune', 'Si les époux n’ont pas d’enfant', 'Seulement après dix ans de mariage'], 1, 'L’article 242 pose cette double exigence : gravité ou répétition, et caractère intolérable du maintien de la vie commune.'],
            ['La prestation compensatoire a pour but de…', ['Sanctionner l’époux fautif', 'Compenser la disparité des conditions de vie créée par la rupture', 'Financer l’avocat', 'Partager les dettes'], 1, 'Article 270 : elle compense la disparité que la rupture du mariage crée dans les conditions de vie respectives.'],
            ['La prestation compensatoire prend en principe la forme…', ['D’une rente viagère', 'D’un capital', 'D’une pension mensuelle', 'D’un usufruit'], 1, 'Le capital est la règle ; la rente viagère est exceptionnelle.'],
            ['Le divorce met fin à l’autorité parentale conjointe sur les enfants.', ['Vrai', 'Faux'], 1, 'Elle subsiste : la séparation des parents est sans incidence sur les règles de son exercice.'],
            ['Quel juge est compétent pour le divorce contentieux ?', ['Le juge d’instruction', 'Le juge aux affaires familiales', 'Le juge des enfants', 'Le juge de l’exécution'], 1, 'Le JAF, au sein du tribunal judiciaire, statue sur le divorce et ses conséquences.'],
            ['La procédure contentieuse de divorce débute désormais par…', ['Une requête devant le maire', 'Une assignation ou une requête conjointe', 'Une tentative de conciliation obligatoire', 'Une plainte pénale'], 1, 'Depuis 2021, plus de requête initiale ni de conciliation : l’instance s’ouvre par assignation, ou par requête conjointe.'],
            ['À quelle date le divorce prend-il effet, en principe, dans les rapports patrimoniaux entre époux ?', ['À la date de la demande en divorce', 'À la date de la célébration du mariage', 'À la date de la majorité des enfants', 'À la date de la liquidation'], 0, 'Le jugement prend effet à la date de la demande, avec possibilité de report à la date de cessation de la cohabitation et de la collaboration.'],
          ],
        },

        // ---------------------------------------------------------------- 10
        {
          titre: 'La filiation',
          axe: 'Semestre 2 — Droit de la famille',
          lecon: {
            titre: 'Établir, contester et faire reconnaître un lien de filiation',
            cours: `La filiation est le lien juridique qui unit un enfant à un parent. Depuis l’ordonnance du 4 juillet 2005, tous les enfants dont la filiation est légalement établie ont les mêmes droits et les mêmes devoirs dans leurs rapports avec leurs père et mère (**article 310**) : la distinction entre enfant légitime et naturel a disparu.

## Les types de filiation
Le Code civil distingue la filiation biologique (charnelle), la filiation adoptive et, depuis 2021, la filiation issue de l’assistance médicale à la procréation avec tiers donneur.

## Établir la filiation à l’égard de la mère
Elle résulte de la **désignation de la mère dans l’acte de naissance** (**article 311-25**). Aucune démarche n’est nécessaire ; la mère n’a donc pas besoin de reconnaître son enfant pour être sa mère légale. L’accouchement dit « sous X » (article 326) est une dérogation reconnue : la mère peut demander que le secret de son admission et de son identité soit préservé.

## Établir la filiation à l’égard du père
Elle peut s’établir de plusieurs façons.
- La présomption de paternité (article 312) : l’enfant conçu ou né pendant le mariage a pour père le mari de sa mère.
- La reconnaissance (article 316) : déclaration volontaire du père (ou de la mère) devant l’officier de l’état civil ou un notaire, avant ou après la naissance.
- La possession d’état : faisceau de faits publics, paisibles et continus qui révèlent le lien (l’enfant porte le nom, est traité comme tel, est reconnu par l’entourage). Constatée par un acte de notoriété, elle établit la filiation.
- L’action en recherche : action judiciaire en établissement de la filiation, notamment par expertise biologique.

## La PMA et la loi du 2 août 2021
La **loi bioéthique du 2 août 2021** a ouvert l’assistance médicale à la procréation à toutes les femmes : couples de femmes et femmes non mariées seules (et non plus aux seuls couples hétérosexuels infertiles). Pour un couple de femmes, la filiation à l’égard de la femme qui n’accouche pas s’établit par la **reconnaissance conjointe anticipée**, faite devant notaire avant l’AMP (**article 342-11**) et remise à l’officier de l’état civil au moment de la déclaration de naissance. La loi a aussi créé un droit d’accès aux origines : l’enfant majeur né d’un don peut accéder à l’identité du donneur, qui doit y consentir au moment du don. La **gestation pour autrui** reste interdite (article 16-7).

## L’adoption
**L’adoption plénière** crée une filiation qui remplace la filiation d’origine : elle est irrévocable et concerne en principe les enfants de moins de quinze ans. **L’adoption simple** s’ajoute à la filiation d’origine, que l’adopté conserve ; elle est révocable pour motifs graves. La loi du 21 février 2022 a réformé l’adoption, notamment en l’ouvrant aux couples non mariés.

## Contestation et prescription
La filiation légalement établie peut être contestée dans certaines limites : l’action se prescrit par **dix ans** à compter du jour où la personne a été privée de l’état qu’elle réclame, ou a commencé à jouir de l’état qui lui est contesté (**article 321**). Lorsque la possession d’état est conforme au titre et a duré au moins cinq ans, seuls l’enfant, l’un de ses parents ou celui qui se prétend le parent véritable peuvent agir (article 333). La preuve biologique est de droit en matière de filiation, sauf motif légitime de ne pas y procéder.

| Moyen | Qui ? | Condition |
| Désignation dans l’acte de naissance | Mère | Accouchement |
| Présomption | Père, époux de la mère | Mariage |
| Reconnaissance | Père ou mère | Volonté libre |
| Possession d’état | Tout parent | Faits continus, constatés |
| Reconnaissance conjointe anticipée | Femme qui n’accouche pas | AMP avec tiers donneur, devant notaire |

> La filiation s’établit par la loi (désignation, présomption), la volonté (reconnaissance, adoption) ou les faits (possession d’état) ; tous les enfants sont égaux en droits.

## Exemple travaillé
Un homme non marié veut reconnaître l’enfant né de sa compagne, sans lien légal préexistant. Quelle démarche accomplir ?
Majeure : en dehors du mariage, la filiation paternelle s’établit par une reconnaissance volontaire faite devant l’officier de l’état civil ou un notaire (article 316), avant ou après la naissance.
Mineure : l’homme n’est pas marié avec la mère et souhaite être le père juridique de l’enfant.
Conclusion : il doit effectuer une reconnaissance ; la filiation sera établie à son égard avec les effets qui s’y attachent.`,
          },
          questions: [
            ['Que prévoit l’article 310 du Code civil ?', ['L’égalité de tous les enfants dans leurs rapports avec leurs parents', 'La majorité à 18 ans', 'La présomption de paternité', 'Le droit au nom d’usage'], 0, 'Tous les enfants dont la filiation est légalement établie ont les mêmes droits et devoirs.'],
            ['Comment s’établit la filiation maternelle de principe ?', ['Par une reconnaissance obligatoire', 'Par la désignation de la mère dans l’acte de naissance', 'Par une expertise biologique', 'Par décision du juge'], 1, 'Article 311-25 : la filiation est établie à l’égard de la mère par sa désignation dans l’acte de naissance.'],
            ['La présomption de paternité s’applique à l’enfant né pendant le mariage de sa mère.', ['Vrai', 'Faux'], 0, 'Article 312 : l’enfant conçu ou né pendant le mariage a pour père le mari.'],
            ['La reconnaissance d’un enfant peut être faite…', ['Seulement après sa naissance', 'Avant ou après la naissance, devant un officier d’état civil ou un notaire', 'Uniquement par le juge', 'Seulement par la mère'], 1, 'La reconnaissance prénatale est possible.'],
            ['Qu’est-ce que la possession d’état ?', ['Un titre de propriété', 'Un faisceau de faits publics et continus révélant le lien de filiation', 'Un acte notarié', 'Un jugement'], 1, 'Nom porté, traitement comme enfant, reconnaissance par l’entourage.'],
            ['Quelle loi a ouvert la PMA à toutes les femmes ?', ['La loi du 4 mars 2002', 'La loi du 17 mai 2013', 'La loi du 2 août 2021', 'La loi du 2 mars 2022'], 2, 'La loi bioéthique du 2 août 2021 a ouvert l’AMP aux couples de femmes et aux femmes seules.'],
            ['Dans un couple de femmes ayant recours à une PMA, la filiation envers la femme qui n’accouche pas s’établit par…', ['L’adoption forcée', 'La reconnaissance conjointe anticipée devant notaire', 'La présomption de paternité', 'Un test génétique'], 1, 'Article 342-11 : consentement et reconnaissance conjointe anticipée devant notaire avant la PMA.'],
            ['La gestation pour autrui est autorisée en France depuis la loi bioéthique de 2021.', ['Vrai', 'Faux'], 1, 'Elle reste interdite : toute convention de gestation pour le compte d’autrui est nulle (article 16-7).'],
            ['L’adoption plénière…', ['S’ajoute à la filiation d’origine', 'Remplace la filiation d’origine et est irrévocable', 'N’existe pas en France', 'Est réservée aux majeurs'], 1, 'Elle substitue une nouvelle filiation à celle d’origine, de façon irrévocable.'],
            ['Quelle est la prescription de droit commun des actions relatives à la filiation (art. 321) ?', ['Un an', 'Cinq ans', 'Dix ans', 'Trente ans'], 2, 'L’action se prescrit par dix ans à compter du jour où la personne a été privée de l’état qu’elle réclame ou a commencé à jouir de l’état qu’on lui conteste.'],
            ['Dans l’adoption simple…', ['L’adopté perd tous ses liens avec sa famille d’origine', 'L’adopté conserve ses liens avec sa famille d’origine', 'L’adoption est interdite aux couples', 'L’adopté change forcément de nationalité'], 1, 'Elle ajoute une filiation sans effacer l’existante.'],
            ['Qu’est-ce que l’accouchement « sous X » ?', ['Un accouchement à l’étranger', 'Un accouchement où la mère demande que le secret de son identité soit préservé', 'Une adoption', 'Un accouchement à domicile'], 1, 'L’article 326 : lors de l’accouchement, la mère peut demander que le secret de son admission et de son identité soit préservé.'],
          ],
        },

        // ---------------------------------------------------------------- 11
        {
          titre: 'L’autorité parentale',
          axe: 'Semestre 2 — Droit de la famille',
          lecon: {
            titre: 'Les droits et devoirs des parents envers leur enfant',
            cours: `L’autorité parentale est, selon l’**article 371-1** du Code civil, un ensemble de droits et de devoirs ayant pour finalité l’**intérêt de l’enfant**. Elle appartient aux parents jusqu’à la majorité ou l’émancipation de l’enfant, pour le protéger dans sa sécurité, sa santé et sa moralité, assurer son éducation et permettre son développement, dans le respect dû à sa personne. Le mot clé est intérêt de l’enfant : l’autorité parentale n’est pas un pouvoir mais une fonction, au service de l’enfant.

## Une autorité exercée en commun
Depuis la loi du 4 mars 2002, l’autorité parentale est **exercée en commun** par les deux parents (article 372), qu’ils soient mariés, pacsés, concubins ou séparés. La séparation des parents est sans incidence sur les règles de dévolution de l’exercice de l’autorité parentale (article 373-2) : chacun maintient des relations personnelles avec l’enfant et respecte les liens de l’autre.

À l’égard des tiers de bonne foi, chaque parent est réputé agir avec l’accord de l’autre lorsqu’il fait seul un **acte usuel** de l’autorité parentale (article 372-2) : inscrire l’enfant à une activité, l’emmener chez le médecin pour des soins courants. Les décisions **importantes** (changement d’établissement scolaire, opération non urgente, changement de religion, déménagement susceptible d’affecter les droits de l’autre) requièrent l’accord des deux parents.

## Le contenu de l’autorité parentale
- Le devoir de protection et d’éducation : santé, scolarité, moralité, surveillance.
- Le droit de garde et le choix de la résidence : la résidence de l’enfant peut être fixée chez l’un des parents ou en **alternance** (article 373-2-9).
- La contribution à l’entretien et à l’éducation (article 371-2) : chacun contribue selon ses ressources, par une **pension alimentaire** lorsque l’enfant ne vit pas avec lui, et cette obligation peut subsister après la majorité tant que l’enfant n’est pas autonome.
- L’administration légale (article 382 et suivants) : les parents gèrent les biens de l’enfant mineur, avec contrôle du juge des tutelles pour les actes graves de disposition.
- Le droit de l’enfant d’être entendu par le juge dans les procédures qui le concernent (article 388-1).

## L’autorité parentale sans violences
La **loi du 10 juillet 2019** a ajouté à l’article 371-1 : l’autorité parentale s’exerce sans violences physiques ou psychologiques. Les violences éducatives dites « ordinaires » n’ont donc aucune justification légale, et le droit de correction n’existe plus.

## Quand les choses se compliquent
Lorsque les parents sont séparés, le juge aux affaires familiales fixe la résidence de l’enfant et les modalités de son entretien. Il peut confier l’exercice de l’autorité parentale à un seul parent (**exercice unilatéral**) si l’intérêt de l’enfant l’exige (article 373-2-1) ; l’autre parent conserve alors un droit de visite et d’hébergement, sauf motifs graves, ainsi qu’un droit de surveillance. En cas de danger pour l’enfant (santé, sécurité, moralité, éducation compromise), le **juge des enfants** peut ordonner une mesure d’assistance éducative (article 375). Dans les cas les plus graves (condamnation pour crime ou délit commis sur l’enfant, par exemple), le **retrait de l’autorité parentale** peut être prononcé (articles 378 et suivants). Les parents peuvent aussi déléguer l’exercice de l’autorité, volontairement ou par décision judiciaire.

| Acte | Qui décide ? | Exemple |
| Acte usuel | Un seul parent suffit | Rendez-vous chez le médecin pour un rhume |
| Acte important | Accord des deux parents | Changement d’école, opération non urgente |

> L’autorité parentale est exercée en commun, dans l’intérêt de l’enfant et sans violences ; la séparation des parents n’en change pas le principe.

## Exemple travaillé
Après leur séparation, un père décide seul d’inscrire son fils dans un autre collège, éloigné du domicile de la mère. La mère s’y oppose. L’inscription est-elle valable ?
Majeure : l’autorité parentale est exercée en commun et le choix de l’établissement scolaire est un acte important, qui requiert l’accord des deux parents ; à défaut, le juge aux affaires familiales tranche.
Mineure : le père a agi seul, sans l’accord de la mère, pour un changement d’établissement.
Conclusion : l’inscription n’est pas régulière ; la mère peut saisir le juge aux affaires familiales pour la faire écarter.`,
          },
          questions: [
            ['Quelle est la finalité de l’autorité parentale selon l’article 371-1 ?', ['L’intérêt de l’enfant', 'L’autorité des parents', 'La protection du patrimoine familial', 'L’éducation religieuse'], 0, 'C’est un ensemble de droits et de devoirs ayant pour finalité l’intérêt de l’enfant.'],
            ['Jusqu’à quand l’autorité parentale dure-t-elle ?', ['12 ans', '16 ans', 'La majorité ou l’émancipation de l’enfant', '25 ans'], 2, 'Elle appartient aux parents jusqu’à la majorité ou l’émancipation.'],
            ['Après une séparation, l’autorité parentale reste en principe exercée conjointement.', ['Vrai', 'Faux'], 0, 'Article 373-2 : la séparation est sans incidence sur les règles de dévolution de l’exercice.'],
            ['Quelle loi a posé le principe de l’exercice conjoint de l’autorité parentale ?', ['La loi du 4 mars 2002', 'La loi du 17 mai 2013', 'La loi du 23 mars 2019', 'La loi du 2 mars 2022'], 0, 'La loi du 4 mars 2002 relative à l’autorité parentale a consacré la coparentalité.'],
            ['À l’égard des tiers de bonne foi, un parent qui fait seul un acte usuel est réputé…', ['Agir sans autorisation', 'Agir avec l’accord de l’autre parent', 'Commettre une faute', 'Agir en tant que tuteur'], 1, 'Article 372-2 : présomption d’accord de l’autre parent pour les actes usuels.'],
            ['Lequel de ces actes est un acte important ?', ['Un rendez-vous pour un rhume', 'Le changement d’établissement scolaire', 'L’achat de fournitures', 'Un rendez-vous chez le coiffeur'], 1, 'Un changement d’école requiert l’accord des deux parents.'],
            ['Que dit l’article 371-1 depuis la loi du 10 juillet 2019 ?', ['L’autorité parentale s’exerce sans violences physiques ou psychologiques', 'Le droit de correction est maintenu', 'Les parents peuvent corriger raisonnablement', 'L’enfant est exclu des décisions'], 0, 'Les violences éducatives ordinaires sont écartées par la loi du 10 juillet 2019.'],
            ['La résidence alternée est impossible en droit français.', ['Vrai', 'Faux'], 1, 'Le juge peut fixer la résidence en alternance ou chez l’un des parents (article 373-2-9).'],
            ['Quel juge ordonne une mesure d’assistance éducative lorsque l’enfant est en danger ?', ['Le juge d’instruction', 'Le juge des enfants', 'Le juge de l’exécution', 'Le juge des libertés'], 1, 'Article 375 : le juge des enfants intervient pour les mineurs en danger.'],
            ['La contribution à l’entretien et à l’éducation de l’enfant peut-elle survivre à sa majorité ?', ['Jamais', 'Oui, tant que l’enfant n’est pas en mesure de subvenir à ses besoins', 'Seulement jusqu’à 21 ans', 'Seulement si l’enfant est étudiant boursier'], 1, 'L’obligation subsiste après la majorité tant que l’enfant n’est pas autonome (article 371-2).'],
            ['Dans quel cas le retrait de l’autorité parentale peut-il être prononcé ?', ['En cas de divorce', 'En cas de simple désaccord éducatif', 'En cas de condamnation pour crime ou délit commis sur l’enfant', 'En cas de déménagement'], 2, 'Les articles 378 et suivants prévoient le retrait pour des faits graves.'],
            ['Que gèrent les parents au titre de l’administration légale ?', ['Les biens de l’enfant mineur', 'Les biens du ménage', 'Les biens de leurs propres parents', 'Les biens de l’État'], 0, 'Les parents administrent le patrimoine de leur enfant mineur, avec contrôle du juge des tutelles pour les actes graves.'],
          ],
        },
      ],
    },
  ],
}

// Les bonnes réponses des QCM à quatre options sont réparties par une rotation
// déterministe (position de la question + rang du chapitre) : la source garde la
// lecture naturelle, le quiz sert des positions variées. Les UUID de questions ne
// dépendent ni des options ni de leur ordre. Les vrai/faux restent inchangés.
const melange = (module) => ({
  ...module,
  blocs: module.blocs.map((bloc) => ({
    ...bloc,
    chapitres: bloc.chapitres.map((ch, c) => ({
      ...ch,
      questions: ch.questions.map(([texte, options, bonne, explication, cle], j) => {
        if (options.length !== 4) return [texte, options, bonne, explication, cle].filter((x) => x !== undefined)
        const decalage = (j * 3 + c) % 4
        const tourne = options.map((_, i) => options[(i - decalage + 4) % 4])
        const q = [texte, tourne, (bonne + decalage) % 4, explication]
        if (cle !== undefined) q.push(cle)
        return q
      }),
    })),
  })),
})

export default melange(brut)
