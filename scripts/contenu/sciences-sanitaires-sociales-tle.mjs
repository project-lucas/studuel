// SCIENCES ET TECHNIQUES SANITAIRES ET SOCIALES — TERMINALE ST2S.
//
// Programme officiel : annexe 2 de l'arrêté du 19/07/2019, BO spécial n° 8 du
// 25 juillet 2019 (« Programme de sciences et techniques sanitaires et sociales
// de terminale ST2S »). Pôle thématique : un seul module en terminale,
// « Politiques, dispositifs de santé publique et d'action sociale », en deux
// questions — « Quelles politiques et quels dispositifs de santé publique pour
// répondre aux besoins de santé ? » et « Quelles politiques sociales et quels
// dispositifs d'action sociale pour favoriser le bien-être des individus et des
// groupes ainsi que la cohésion sociale ? ». Pôle méthodologique : la démarche
// de projet (« Comment les organisations sanitaires et sociales mettent-elles
// en place un plan d'action… ? »). Chaque fiche porte en `axe` la question du
// programme qui la coiffe.
//
// Épreuve écrite (note de service n° 2020-013, version consolidée d'août
// 2024) : 3 heures, sur 20 — « mobilisation des connaissances » (6 points, une
// ou deux questions sans document) et « développement s'appuyant sur un dossier
// documentaire » (14 points, cinq documents au plus). D'où la fiche méthode.
//
// Les modules de première (santé, bien-être et cohésion sociale ; protection
// sociale ; modes d'intervention) sont dans sciences-sanitaires-sociales-1re.mjs :
// ces fiches s'y adossent sans les répéter (les définitions de la santé, des
// indicateurs, des types de prévention et des branches de la Sécurité sociale
// y sont déjà).
//
// Données institutionnelles vérifiées en septembre 2026 (France Travail depuis
// le 1er janvier 2024, inscription des allocataires du RSA depuis le 1er janvier
// 2025, branche autonomie gérée par la CNSA depuis 2021, IVG inscrite dans la
// Constitution en 2024 — hors de cette matière).

export default {
  slug: 'sciences-sanitaires-sociales',
  nom: 'Sciences et techniques sanitaires et sociales',

  titreMigration: 'STSS Tle ST2S — le programme officiel (16 fiches)',

  motif: `La terminale ST2S n'avait aucun contenu de sciences et techniques sanitaires
et sociales. Cette migration installe 16 fiches qui suivent le module
« Politiques, dispositifs de santé publique et d'action sociale » (ses deux
questions : politiques de santé, politiques sociales), le pôle méthodologique
(la démarche de projet) du programme officiel (BO spécial n° 8 du 25 juillet
2019), et une fiche méthode de l'épreuve écrite, 12 questions chacune.`,

  blocs: [
    {
      niveaux: ['Tle'],
      positionDepart: 1,
      chapitres: [
        // ──────────────── POLITIQUES DE SANTÉ PUBLIQUE ────────────────
        {
          titre: 'L’histoire de la politique de santé',
          axe: 'Politiques et dispositifs de santé publique',
          lecon: {
            titre: 'De l’hygiène publique à la stratégie nationale de santé',
            cours: `La politique de santé n'est pas tombée du ciel : elle s'est construite par couches successives, chaque époque répondant aux problèmes de santé qu'elle rencontrait. Comprendre cette histoire, c'est comprendre pourquoi le système français est organisé comme il l'est.

## Qu'est-ce qu'une politique de santé ?
Une **politique de santé** est l'ensemble des choix et des actions des pouvoirs publics pour améliorer l'état de santé de la population : fixer des **priorités**, organiser l'**offre de soins**, financer, prévenir, protéger. En France, le Code de la santé publique confie cette responsabilité à l'**État**.

> Une politique de santé vise à agir sur les **déterminants de santé** (comportements, conditions de vie, environnement, accès aux soins), pas seulement à soigner les malades.

## Les grandes étapes
@ 1902 — Loi relative à la protection de la santé publique : vaccination contre la variole obligatoire, déclaration de certaines maladies, bureaux d'hygiène
@ 1920 — Premier ministère de l'Hygiène, de l'Assistance et de la Prévention sociales
@ 1945 — Ordonnances créant la Sécurité sociale : l'accès aux soins devient un droit financé collectivement
@ 1958 — Ordonnances Debré : création des centres hospitaliers universitaires (CHU)
@ 1970 — Loi hospitalière : service public hospitalier et carte sanitaire
@ 1996 — Ordonnances Juppé : le Parlement vote chaque année la loi de financement de la Sécurité sociale et l'ONDAM
@ 2002 — Loi du 4 mars (loi Kouchner) sur les droits des malades et la démocratie sanitaire
@ 2004 — Loi du 9 août relative à la politique de santé publique : l'État fixe des objectifs pluriannuels ; création du médecin traitant (loi du 13 août)
@ 2009 — Loi HPST (hôpital, patients, santé, territoires) : création des agences régionales de santé, installées en 2010
@ 2016 — Loi de modernisation de notre système de santé : stratégie nationale de santé, Santé publique France, groupements hospitaliers de territoire
@ 2019 — Loi relative à l'organisation et à la transformation du système de santé : fin du numerus clausus, hôpitaux de proximité, espace numérique de santé

## Des objectifs qui changent avec les problèmes
| L'époque | Le problème dominant | La réponse |
| XIXe – début XXe siècle | Épidémies, maladies infectieuses, insalubrité | **Hygiénisme** : eau potable, égouts, vaccination, isolement |
| 1945 – années 1970 | Inégal accès aux soins | Sécurité sociale, construction d'hôpitaux, formation de médecins |
| Années 1980 – 1990 | Hausse rapide des dépenses | **Maîtrise des dépenses** : budgets, ONDAM, planification |
| Depuis les années 2000 | Maladies chroniques, vieillissement, inégalités | **Santé publique** : prévention, qualité, droits des patients, parcours, territoires |

Ce passage des maladies infectieuses aux maladies chroniques s'appelle la **transition épidémiologique**. Il explique que la politique de santé ne se limite plus à l'hôpital : elle doit coordonner des soignants de ville, du médico-social, des collectivités.

## Les tendances actuelles
1. **Territorialiser** : adapter les réponses aux besoins de chaque territoire (ARS, projets régionaux).
2. **Décloisonner** : relier la ville, l'hôpital et le médico-social autour du **parcours** du patient.
3. **Prévenir** plutôt que seulement guérir.
4. **Associer les usagers** aux décisions (démocratie sanitaire).
5. **Numériser** : dossier médical partagé intégré à Mon espace santé, téléconsultation.

!> Ne confonds pas politique de santé et politique de soins : la première englobe la seconde, et inclut la prévention, l'environnement, l'éducation pour la santé.

## Exemple : le tabac
La lutte contre le tabagisme montre l'empilement des outils : **loi Évin** (1991, interdiction de la publicité et du tabac dans les lieux collectifs), interdiction de fumer dans les lieux publics (2007), **paquet neutre** (loi de 2016), hausses de prix, remboursement des substituts nicotiniques, opération **Mois sans tabac** chaque novembre depuis 2016.`,
          },
          questions: [
            ['Quelle loi a créé les agences régionales de santé ?', ['La loi HPST de 2009', 'La loi Kouchner de 2002', 'La loi Évin de 1991', 'Les ordonnances de 1945'], 0, 'La loi « hôpital, patients, santé, territoires » les a créées ; elles sont installées depuis 2010.'],
            ['Quel courant du XIXe siècle a lutté contre les épidémies par l’eau potable, les égouts et la vaccination ?', ['Le libéralisme', 'L’hygiénisme', 'Le taylorisme', 'Le mutualisme'], 1, 'L’hygiénisme répondait aux maladies infectieuses liées à l’insalubrité.'],
            ['Depuis les ordonnances Juppé de 1996, le Parlement vote chaque année :', ['Le budget des hôpitaux privés', 'Le numerus clausus', 'La loi de financement de la Sécurité sociale et l’ONDAM', 'La liste des maladies à déclaration obligatoire'], 2, 'L’ONDAM fixe l’objectif national de dépenses d’assurance maladie.'],
            ['Qu’appelle-t-on la transition épidémiologique ?', ['La hausse du nombre de médecins', 'La fermeture des hôpitaux', 'L’apparition de la Sécurité sociale', 'Le passage d’une prédominance des maladies infectieuses à celle des maladies chroniques'], 3, 'Elle explique le recentrage des politiques sur la prévention et le suivi au long cours.'],
            ['La loi du 4 mars 2002 porte principalement sur :', ['Les droits des malades et la démocratie sanitaire', 'Le tabac', 'Le financement des hôpitaux', 'La vaccination obligatoire'], 0, 'Elle est souvent appelée loi Kouchner.'],
            ['Quelle loi de 2016 a créé Santé publique France et les groupements hospitaliers de territoire ?', ['La loi HPST', 'La loi de modernisation de notre système de santé', 'La loi Évin', 'La loi Veil'], 1, 'Elle a aussi instauré la stratégie nationale de santé et le paquet neutre du tabac.'],
            ['Une politique de santé se limite à l’organisation des soins hospitaliers.', ['Vrai', 'Faux'], 1, 'Elle inclut la prévention, l’éducation pour la santé, l’environnement et la coordination des acteurs.'],
            ['Quelle loi de 1902 a rendu obligatoire la vaccination contre la variole ?', ['La loi Évin', 'La loi hospitalière', 'La loi relative à la protection de la santé publique', 'La loi HPST'], 2, 'C’est la première grande loi de santé publique française.'],
            ['Dans les années 1980-1990, la politique de santé s’est surtout préoccupée :', ['De construire les premiers hôpitaux', 'De lutter contre la peste', 'De supprimer la Sécurité sociale', 'De maîtriser la hausse des dépenses'], 3, 'Budgets, planification et ONDAM datent de cette période.'],
            ['Que signifie « décloisonner » le système de santé ?', ['Relier la ville, l’hôpital et le médico-social autour du parcours du patient', 'Supprimer les hôpitaux', 'Séparer strictement les professions', 'Privatiser les soins'], 0, 'Le patient atteint de maladie chronique passe d’un acteur à l’autre : il faut les coordonner.'],
            ['Quelle mesure de la loi de 2019 concerne la formation des médecins ?', ['La création du médecin traitant', 'La fin du numerus clausus', 'La création des CHU', 'L’interdiction de fumer'], 1, 'Le numerus clausus, instauré en 1971, limitait le nombre d’étudiants admis en deuxième année.'],
            ['La loi Évin de 1991 vise principalement :', ['Les droits des patients', 'La vaccination', 'Le tabac et l’alcool', 'La tarification hospitalière'], 2, 'Elle encadre la publicité pour l’alcool et le tabac et interdisait déjà de fumer dans les lieux collectifs.'],
          ],
        },
        {
          titre: 'Élaborer une politique de santé, du local au mondial',
          axe: 'Politiques et dispositifs de santé publique',
          lecon: {
            titre: 'Des besoins aux priorités, à chaque échelon',
            cours: `Une politique de santé naît d'un constat (un problème fréquent, grave, évitable), passe par des arbitrages entre priorités et se décline de l'échelon mondial jusqu'à la commune. Pour la présenter, il faut toujours la situer dans son **contexte**.

## Le processus d'élaboration
~ Constat (données épidémiologiques) → Mise sur l'agenda → Fixation de priorités et d'objectifs → Choix des moyens et du financement → Mise en œuvre sur les territoires → Évaluation
1. **Observer** : les indicateurs (mortalité, morbidité, recours aux soins) révèlent les besoins de santé.
2. **Mettre sur l'agenda** : un problème devient prioritaire sous la pression des données, des associations, des médias ou d'une crise.
3. **Décider** : le Gouvernement et le Parlement fixent les priorités (lois, stratégie nationale de santé, plans).
4. **Mettre en œuvre** : les agences régionales de santé déclinent la politique dans chaque région.
5. **Évaluer** : le Haut Conseil de la santé publique et la Cour des comptes jugent les résultats.

> La politique de santé distingue le **besoin** de santé (ce qui est nécessaire, établi par les professionnels), la **demande** (ce que la population exprime) et l'**offre** (ce qui est disponible).

## Les échelons territoriaux
| L'échelon | Les acteurs | Les outils |
| **Mondial** | Organisation mondiale de la santé (OMS, créée en 1948, siège à Genève) | Recommandations, Règlement sanitaire international, programmes de vaccination, accord sur les pandémies adopté en 2025 |
| **Européen** | Union européenne : Commission, Parlement ; agences (EMA pour les médicaments, ECDC pour les maladies) | Traités, **règlements** (applicables directement) et **directives** (à transposer), programme « L'UE pour la santé » |
| **National** | Parlement, Gouvernement, ministère chargé de la santé, agences nationales | Lois, décrets, **stratégie nationale de santé**, plans nationaux (cancer, santé mentale…) |
| **Régional** | Agence régionale de santé (ARS) | **Projet régional de santé** (PRS) |
| **Local** | Communes, départements, professionnels, associations | **Contrats locaux de santé**, actions de terrain |

!> En santé, l'Union européenne a surtout une compétence d'**appui** : l'organisation et le financement des soins restent de la responsabilité des États. Elle agit fortement, en revanche, sur le médicament, la sécurité sanitaire et les menaces transfrontalières.

## Au niveau national : la stratégie nationale de santé
Instaurée par la loi de 2016, la **stratégie nationale de santé** (SNS) fixe le cadre de la politique de santé pour plusieurs années : prévention et promotion de la santé, lutte contre les inégalités sociales et territoriales, qualité et pertinence des soins, innovation. Elle est déclinée en **plans** thématiques et dans les projets régionaux.

## Au niveau régional : le projet régional de santé
Chaque ARS arrête un **PRS** qui comprend :
- un **cadre d'orientation stratégique** à dix ans ;
- un **schéma régional de santé** à cinq ans (besoins, offre de soins, prévention, médico-social) ;
- un **programme régional d'accès à la prévention et aux soins des plus démunis** (PRAPS).

## Au niveau local : le contrat local de santé
Signé entre l'ARS et une collectivité (commune, intercommunalité), le **contrat local de santé** adapte les priorités aux besoins d'un territoire : accès aux soins dans un quartier, prévention des addictions, santé des jeunes.

## Exemple travaillé : présenter une politique de santé dans son contexte
Pour la santé mentale : **contexte** (hausse des troubles anxieux et dépressifs chez les jeunes après 2020, psychiatrie saturée) → **priorité** nationale (santé mentale déclarée « grande cause nationale » en 2025) → **mesures** (séances de psychologue remboursées, repérage précoce, numéro national de prévention du suicide 3114) → **déclinaison** régionale dans les PRS → **évaluation** des résultats.`,
          },
          questions: [
            ['Quel organisme élabore le projet régional de santé ?', ['Le conseil départemental', 'L’agence régionale de santé', 'L’OMS', 'La caisse d’allocations familiales'], 1, 'L’ARS décline la politique nationale dans sa région.'],
            ['Quelle est la différence entre un règlement et une directive européens ?', ['Aucune', 'La directive s’applique directement, le règlement doit être transposé', 'Le règlement s’applique directement, la directive doit être transposée en droit national', 'Seule la directive est obligatoire'], 2, 'Le règlement vaut loi dans tous les États membres dès son entrée en vigueur.'],
            ['Que comprend le projet régional de santé ?', ['Le seul budget des hôpitaux', 'La liste des médecins de la région', 'Le calendrier vaccinal', 'Un cadre d’orientation stratégique, un schéma régional de santé et un PRAPS'], 3, 'Le PRAPS vise l’accès à la prévention et aux soins des plus démunis.'],
            ['Quel outil adapte les priorités de santé aux besoins d’une commune ou d’une intercommunalité ?', ['Le contrat local de santé', 'Le Règlement sanitaire international', 'La loi de financement de la Sécurité sociale', 'La carte Vitale'], 0, 'Il est signé entre l’ARS et la collectivité.'],
            ['L’OMS a été créée en :', ['1902', '1945', '1948', '1996'], 2, 'Son siège est à Genève ; elle compte presque tous les États du monde.'],
            ['Le besoin de santé est ce que la population exprime spontanément.', ['Vrai', 'Faux'], 1, 'Ce que la population exprime est la demande ; le besoin est établi à partir de critères de santé.'],
            ['Quelle agence européenne évalue les médicaments ?', ['L’ECDC', 'L’EMA', 'L’ANSM', 'La HAS'], 1, 'L’Agence européenne des médicaments ; l’ECDC s’occupe de la prévention des maladies.'],
            ['Quelle loi a instauré la stratégie nationale de santé ?', ['La loi de 1902', 'La loi Évin', 'La loi de 2016 de modernisation de notre système de santé', 'La loi HPST'], 2, 'La SNS fixe le cadre pluriannuel de la politique de santé.'],
            ['Dans l’organisation des soins, l’Union européenne a surtout une compétence :', ['Exclusive', 'Nulle', 'Supérieure à celle des États', 'D’appui'], 3, 'Les États organisent et financent leurs systèmes de soins ; l’UE agit sur le médicament et les menaces transfrontalières.'],
            ['Qui évalue les politiques de santé publique en France ?', ['Le Haut Conseil de la santé publique', 'La caisse d’allocations familiales', 'Le conseil de la vie sociale', 'L’OMS seule'], 0, 'La Cour des comptes y contribue aussi.'],
            ['Quelle est la première étape de l’élaboration d’une politique de santé ?', ['Le financement', 'Le constat, fondé sur des données', 'L’évaluation', 'La communication'], 1, 'Les indicateurs révèlent les besoins et permettent de fixer des priorités.'],
            ['Quelle mesure relève de la politique de santé mentale récente ?', ['Le paquet neutre', 'La vaccination contre la variole', 'Le numéro national de prévention du suicide 3114', 'La carte sanitaire de 1970'], 2, 'Il répond jour et nuit aux personnes en détresse et à leurs proches.'],
          ],
        },
        {
          titre: 'La démocratie sanitaire',
          axe: 'Politiques et dispositifs de santé publique',
          lecon: {
            titre: 'Associer les usagers aux décisions de santé',
            cours: `Pendant longtemps, la santé a été l'affaire des seuls médecins et de l'administration. La **démocratie sanitaire** fait entrer les usagers, les associations et les élus dans les décisions : ceux qui vivent le système ont leur mot à dire sur son fonctionnement.

## Définition
La démocratie sanitaire est une démarche qui vise à **associer l'ensemble des acteurs** du système de santé — professionnels, usagers, élus, financeurs — à l'élaboration et à la mise en œuvre de la politique de santé, dans un esprit de **dialogue et de concertation**.

> Elle a deux faces : des **droits individuels** pour chaque patient, et une **participation collective** des usagers aux instances.

## Une construction historique
@ 1980 — Les associations de malades du sida bousculent la relation médecin-patient et exigent d'être informées et entendues
@ 1996 — Premiers représentants des usagers dans les conseils d'administration des hôpitaux
@ 1998 — États généraux de la santé : les citoyens sont consultés
@ 2002 — Loi du 4 mars relative aux droits des malades et à la qualité du système de santé
@ 2016 — Création de France Assos Santé (installée en 2017) et des commissions des usagers dans les établissements

## Les droits individuels (loi de 2002)
- Droit à l'**information** sur son état de santé et au **consentement libre et éclairé** ;
- **Accès direct** à son dossier médical ;
- Désignation d'une **personne de confiance** ;
- Respect de la dignité, de la vie privée et du **secret médical** ;
- Droit de rédiger des **directives anticipées** sur sa fin de vie (loi Leonetti de 2005, renforcée par la loi Claeys-Leonetti de 2016).

## La participation collective : les instances
| L'échelon | L'instance | Son rôle |
| **National** | Conférence nationale de santé | Donne des avis sur la politique de santé, organise le débat public |
| **Régional** | Conférence régionale de la santé et de l'autonomie (CRSA) | Donne son avis sur le projet régional de santé |
| **Territorial** | Conseil territorial de santé | Participe au diagnostic et au suivi des actions sur un territoire |
| **Établissement** | Commission des usagers | Examine les plaintes, propose des améliorations de la qualité et de l'accueil |

Les **représentants des usagers** y siègent. Ils sont membres d'**associations agréées** et formés. **France Assos Santé** fédère ces associations au niveau national.

## Pourquoi la démocratie sanitaire ?
1. Les décisions sont mieux **adaptées** aux besoins réels.
2. Elles sont mieux **acceptées**, donc mieux appliquées.
3. Le patient devient **acteur** de sa santé (éducation thérapeutique, patients-partenaires).
4. Elle renforce la **qualité** et la **sécurité** des soins, en faisant remonter les dysfonctionnements.

!> Les limites existent : représentants peu nombreux et parfois peu connus, instances consultatives dont les avis ne s'imposent pas, participation faible des publics les plus éloignés du système de santé.

## Exemple
Lors d'une crise sanitaire, un **débat public** organisé par la Conférence nationale de santé, ou les consultations citoyennes sur la vaccination, permettent de recueillir l'avis de la population avant de décider. Dans un hôpital, une plainte examinée par la commission des usagers peut conduire à revoir l'accueil aux urgences.`,
          },
          questions: [
            ['Qu’est-ce que la démocratie sanitaire ?', ['Le vote des médecins', 'L’élection du ministre de la santé', 'L’association de tous les acteurs, dont les usagers, aux décisions de santé', 'La gratuité des soins'], 2, 'Elle combine droits individuels et participation collective.'],
            ['Quelle instance donne son avis sur le projet régional de santé ?', ['La commission des usagers', 'Le conseil de la vie sociale', 'La caisse primaire', 'La conférence régionale de la santé et de l’autonomie'], 3, 'La CRSA réunit usagers, professionnels, élus et financeurs.'],
            ['Dans un hôpital, qui examine les plaintes des patients ?', ['La commission des usagers', 'Le conseil territorial de santé', 'L’OMS', 'Le Parlement'], 0, 'Elle propose des améliorations de la qualité et de l’accueil.'],
            ['Quelle loi a posé les droits des malades en 2002 ?', ['La loi Évin', 'La loi du 4 mars 2002', 'La loi HPST', 'La loi Leonetti'], 1, 'Information, consentement, accès au dossier, personne de confiance…'],
            ['Quelle association fédère au niveau national les associations d’usagers du système de santé ?', ['Les Restos du cœur', 'La Croix-Rouge', 'France Assos Santé', 'L’Ordre des médecins'], 2, 'Elle a été créée par la loi de 2016.'],
            ['Les avis des instances de démocratie sanitaire s’imposent toujours au ministre.', ['Vrai', 'Faux'], 1, 'Elles sont consultatives : c’est l’une de leurs limites.'],
            ['Quelle épidémie a fait émerger la mobilisation des associations de malades dans les années 1980 ?', ['La grippe', 'La tuberculose', 'La rougeole', 'Le sida'], 3, 'Elles ont revendiqué information et participation aux décisions.'],
            ['Les directives anticipées permettent de :', ['Exprimer ses volontés sur sa fin de vie', 'Choisir son médecin traitant', 'Refuser la Sécurité sociale', 'Désigner un héritier'], 0, 'Elles sont prévues par la loi Leonetti de 2005, renforcée en 2016.'],
            ['Quel est un intérêt de la démocratie sanitaire ?', ['Réduire le nombre de soignants', 'Des décisions mieux adaptées et mieux acceptées', 'Supprimer les agences', 'Éviter tout débat'], 1, 'Ceux qui vivent le système en connaissent les défaillances.'],
            ['Pour siéger comme représentant des usagers, il faut être membre :', ['D’un parti politique', 'Du personnel de l’hôpital', 'D’une association agréée', 'D’une mutuelle'], 2, 'Les associations agréées désignent des représentants formés.'],
            ['Quelle instance nationale organise le débat public sur la politique de santé ?', ['La commission des usagers', 'La MDPH', 'Le CCAS', 'La Conférence nationale de santé'], 3, 'Elle rend des avis au ministre.'],
            ['Le consentement libre et éclairé fait partie des droits collectifs des usagers.', ['Vrai', 'Faux'], 1, 'C’est un droit individuel de chaque patient.'],
          ],
        },
        {
          titre: 'Le système de santé : composantes et gouvernance',
          axe: 'Politiques et dispositifs de santé publique',
          lecon: {
            titre: 'Qui pilote, qui expertise, qui agit ?',
            cours: `Le système de santé réunit tout ce qui contribue à la santé de la population : les soins, bien sûr, mais aussi la prévention, la sécurité sanitaire, la formation, la recherche. Sa **gouvernance** désigne la façon dont il est piloté et dont les décisions se partagent.

## Système de santé et système de soins
| La notion | Ce qu'elle recouvre |
| **Système de santé** | L'ensemble des organisations, des institutions et des ressources qui visent à améliorer la santé : prévention, soins, sécurité sanitaire, recherche, formation |
| **Système de soins** | La partie qui produit les soins : professionnels de ville, établissements, pharmacies, transports sanitaires |

> Le système de soins est une **composante** du système de santé. On peut améliorer la santé sans soigner : par l'eau potable, la sécurité routière, l'éducation.

## Les composantes du système de santé
1. **Les pouvoirs publics** qui décident : Parlement (lois, financement), Gouvernement et ministère chargé de la santé, notamment la **Direction générale de la santé** (DGS) et la direction générale de l'offre de soins.
2. **Les agences sanitaires**, qui apportent expertise et exécution.
3. **Les financeurs** : assurance maladie, organismes complémentaires, État, ménages.
4. **Les offreurs** : professionnels et établissements de santé, secteur médico-social.
5. **Les usagers** et leurs représentants.

## Les agences sanitaires nationales
| L'agence | Son rôle principal |
| **Santé publique France** | Surveiller l'état de santé, alerter, prévenir, promouvoir la santé, répondre aux crises |
| **Haute Autorité de santé** (HAS) | Évaluer les médicaments et les actes, émettre des recommandations, certifier les établissements |
| **Agence nationale de sécurité du médicament** (ANSM) | Autoriser et surveiller les médicaments et dispositifs médicaux |
| **Anses** | Sécurité sanitaire de l'alimentation, de l'environnement et du travail |
| **Agence de la biomédecine** | Greffes, dons d'organes et de gamètes, procréation, génétique |
| **Institut national du cancer** (INCa) | Coordonner la lutte contre les cancers |
| **Établissement français du sang** | Collecte et distribution du sang |

!> La HAS est une **autorité publique indépendante** ; l'ANSM a remplacé en 2012 l'Afssaps après l'affaire du Mediator.

## La gouvernance
- **Au niveau national**, l'État définit la politique et le Parlement vote la loi de financement de la Sécurité sociale.
- **Au niveau régional**, les **18 agences régionales de santé** pilotent l'offre de soins, la prévention et le médico-social : autorisations d'ouverture, contrôle des établissements, veille sanitaire, projet régional de santé.
- **L'assurance maladie** (Caisse nationale et caisses primaires) gère les remboursements et négocie avec les professionnels libéraux des **conventions** qui fixent leurs tarifs.

Cette gouvernance est dite **partagée** : État, assurance maladie, collectivités et professionnels ont chacun une part du pouvoir, ce qui rend la **coordination** indispensable.

## Exemple : un nouveau médicament
~ Autorisation de mise sur le marché (EMA ou ANSM) → Évaluation du service médical rendu (HAS) → Fixation du prix (comité économique des produits de santé) et du taux de remboursement (assurance maladie) → Surveillance après commercialisation (ANSM, pharmacovigilance)

Un seul produit mobilise ainsi quatre acteurs différents : c'est la gouvernance en action.`,
          },
          questions: [
            ['Quelle différence y a-t-il entre système de santé et système de soins ?', ['Aucune', 'Le système de santé est une composante du système de soins', 'Le système de soins ne concerne que la prévention', 'Le système de soins est une composante du système de santé'], 3, 'Le système de santé inclut aussi la prévention, la sécurité sanitaire, la recherche.'],
            ['Quelle agence surveille l’état de santé de la population et alerte les pouvoirs publics ?', ['Santé publique France', 'La HAS', 'L’Agence de la biomédecine', 'L’EFS'], 0, 'Elle a été créée en 2016 par regroupement de plusieurs agences.'],
            ['Quelle agence autorise et surveille les médicaments en France ?', ['L’Anses', 'L’ANSM', 'La CNAF', 'L’INCa'], 1, 'Elle a remplacé l’Afssaps en 2012.'],
            ['Quelle institution certifie les établissements de santé et émet des recommandations de bonne pratique ?', ['Santé publique France', 'Le conseil départemental', 'La Haute Autorité de santé', 'La DREES'], 2, 'La HAS est une autorité publique indépendante.'],
            ['Combien y a-t-il d’agences régionales de santé ?', ['13', '18', '22', '101'], 1, '13 en métropole et 5 outre-mer.'],
            ['Quelle agence est compétente pour les greffes et les dons d’organes ?', ['L’ANSM', 'L’Anses', 'Santé publique France', 'L’Agence de la biomédecine'], 3, 'Elle s’occupe aussi de procréation et de génétique.'],
            ['Pourquoi dit-on que la gouvernance du système de santé est partagée ?', ['Parce que l’État, l’assurance maladie, les collectivités et les professionnels se partagent le pouvoir', 'Parce qu’un seul acteur décide', 'Parce que les patients votent le budget', 'Parce que l’OMS gère le système français'], 0, 'Cela rend la coordination indispensable.'],
            ['L’assurance maladie négocie avec les professionnels libéraux :', ['Leur diplôme', 'Des conventions qui fixent leurs tarifs', 'Leur lieu d’installation obligatoire', 'Leur temps de travail'], 1, 'Ces conventions encadrent aussi certaines missions de prévention.'],
            ['On peut améliorer la santé d’une population sans passer par le système de soins.', ['Vrai', 'Faux'], 0, 'Eau potable, sécurité routière ou éducation agissent sur les déterminants de santé.'],
            ['Quelle agence est chargée de la sécurité sanitaire de l’alimentation et de l’environnement ?', ['L’ANSM', 'L’EFS', 'L’Anses', 'La HAS'], 2, 'Agence nationale de sécurité sanitaire de l’alimentation, de l’environnement et du travail.'],
            ['Qui évalue le service médical rendu d’un médicament avant son remboursement ?', ['L’ANSM', 'L’INCa', 'L’Agence de la biomédecine', 'La HAS'], 3, 'Cet avis conditionne le taux de remboursement.'],
            ['Quelle direction du ministère prépare la politique de santé publique ?', ['La Direction générale de la santé', 'La Direction générale des finances publiques', 'La caisse d’allocations familiales', 'La préfecture de police'], 0, 'La DGS coordonne aussi la réponse aux alertes sanitaires.'],
          ],
        },
        {
          titre: 'Le financement du système de santé et les comptes de la santé',
          axe: 'Politiques et dispositifs de santé publique',
          lecon: {
            titre: 'Qui paie la santé, et combien ?',
            cours: `La santé coûte cher, et la question « qui paie ? » est au cœur de la politique de santé. Les **comptes de la santé**, publiés chaque année par la DREES (le service statistique du ministère), permettent de mesurer la dépense et de savoir qui la finance.

## Les agrégats des comptes de la santé
| L'agrégat | Ce qu'il mesure |
| **Consommation de soins et de biens médicaux** (CSBM) | La valeur des soins hospitaliers, des soins de ville, des médicaments, des transports sanitaires et des autres biens médicaux (optique, prothèses…) consommés dans l'année |
| **Dépense courante de santé au sens international** (DCSi) | La CSBM plus les soins de longue durée, la prévention, la gouvernance : l'indicateur qui sert aux comparaisons entre pays |

= Ordre de grandeur au milieu des années 2020 : une CSBM de l'ordre de 250 milliards d'euros ; une DCSi d'environ 12 % du PIB
Les **soins hospitaliers** représentent près de la **moitié** de la CSBM.

## Qui finance la CSBM ?
| Le financeur | Sa part (ordre de grandeur) |
| **Sécurité sociale** (assurance maladie) | Environ 80 % |
| **Organismes complémentaires** (mutuelles, sociétés d'assurance, institutions de prévoyance) | Environ 12 % |
| **Ménages** (reste à charge) | Environ 7 à 8 % |
| **État et collectivités** (aide médicale de l'État, par exemple) | Environ 1 à 2 % |

> Le **reste à charge** des ménages français est l'un des plus faibles des pays riches : c'est un facteur d'accès aux soins.

## D'où vient l'argent de l'assurance maladie ?
1. Les **cotisations sociales** sur les salaires ;
2. La **contribution sociale généralisée** (CSG), prélevée sur presque tous les revenus ;
3. Des **impôts et taxes** affectés (taxes sur le tabac et l'alcool, par exemple).

## La régulation des dépenses
- Chaque automne, le Parlement vote la **loi de financement de la Sécurité sociale** (LFSS), qui fixe l'**ONDAM** (objectif national de dépenses d'assurance maladie), réparti entre soins de ville, établissements de santé et médico-social.
- Les **hôpitaux** sont financés en grande partie selon leur activité (**tarification à l'activité**, T2A, depuis 2004), complétée par des dotations pour certaines missions.
- Les **professionnels libéraux** sont payés surtout à l'acte, selon des tarifs conventionnels, avec une part croissante de forfaits et de rémunération sur objectifs de santé publique.
- Les **patients** participent : ticket modérateur, participation forfaitaire, franchises médicales, forfait journalier hospitalier.

!> Ne confonds pas « dépenses de santé » et « dépenses de l'assurance maladie » : la première inclut aussi ce que paient les complémentaires et les ménages.

## Pourquoi la dépense augmente-t-elle ?
- **Vieillissement** de la population et maladies chroniques ;
- **Progrès techniques** (nouveaux médicaments, imagerie, chirurgie) souvent coûteux ;
- Hausse de la **demande** de soins et du niveau de vie.

## Exemple : lire un chiffre des comptes
« La part de la Sécurité sociale dans la CSBM est d'environ 80 % » se lit : *sur 100 euros de soins et de biens médicaux consommés, environ 80 euros sont pris en charge par la Sécurité sociale.*`,
          },
          questions: [
            ['Que mesure la consommation de soins et de biens médicaux (CSBM) ?', ['La valeur des soins et biens médicaux consommés dans l’année', 'Le budget de l’État', 'Le nombre de médecins', 'Les cotisations sociales'], 0, 'Soins hospitaliers, soins de ville, médicaments, transports et autres biens médicaux.'],
            ['Quel financeur prend en charge la plus grande part de la CSBM ?', ['Les ménages', 'La Sécurité sociale', 'Les organismes complémentaires', 'L’État'], 1, 'Environ 80 % de la CSBM.'],
            ['Que signifie ONDAM ?', ['Office national des dépenses de l’assurance maladie', 'Organisation nationale des médecins', 'Objectif national de dépenses d’assurance maladie', 'Ordonnance nationale de diagnostic médical'], 2, 'Il est voté chaque année dans la loi de financement de la Sécurité sociale.'],
            ['Quel indicateur sert aux comparaisons internationales de dépenses de santé ?', ['La CSBM', 'L’ONDAM', 'Le reste à charge', 'La DCSi'], 3, 'La dépense courante de santé au sens international.'],
            ['Quel poste représente près de la moitié de la CSBM ?', ['Les soins hospitaliers', 'Les médicaments', 'Les transports sanitaires', 'L’optique'], 0, 'L’hôpital est le premier poste de dépense.'],
            ['Quelle ressource de l’assurance maladie est prélevée sur presque tous les revenus ?', ['La TVA', 'La CSG', 'Le forfait journalier', 'L’impôt sur les sociétés'], 1, 'La contribution sociale généralisée existe depuis 1991.'],
            ['Depuis 2004, les hôpitaux sont financés en grande partie :', ['Par un budget global fixe', 'Par les patients seuls', 'Selon leur activité (T2A)', 'Par l’OMS'], 2, 'La tarification à l’activité est complétée par des dotations.'],
            ['Le reste à charge des ménages en France est l’un des plus faibles des pays riches.', ['Vrai', 'Faux'], 0, 'Il représente environ 7 à 8 % de la CSBM.'],
            ['Lequel N’EST PAS une participation du patient ?', ['Le ticket modérateur', 'La franchise médicale', 'Le forfait journalier hospitalier', 'La tarification à l’activité'], 3, 'La T2A est un mode de financement des hôpitaux.'],
            ['Qui publie chaque année les comptes de la santé ?', ['La DREES', 'L’INSEE seul', 'L’OMS', 'La CAF'], 0, 'C’est le service statistique des ministères sanitaires et sociaux.'],
            ['Quel facteur explique la hausse des dépenses de santé ?', ['La baisse du nombre de personnes âgées', 'Le vieillissement et les maladies chroniques', 'La disparition des médicaments', 'La fin des progrès techniques'], 1, 'Le progrès technique et la demande de soins y contribuent aussi.'],
            ['Dépenses de santé et dépenses de l’assurance maladie désignent la même chose.', ['Vrai', 'Faux'], 1, 'Les dépenses de santé incluent aussi ce que paient les complémentaires et les ménages.'],
          ],
        },
        {
          titre: 'La veille et la sécurité sanitaires',
          axe: 'Politiques et dispositifs de santé publique',
          lecon: {
            titre: 'Repérer tôt, alerter vite, agir juste',
            cours: `Une épidémie qui démarre, un lot de médicaments défectueux, une intoxication collective : plus on repère tôt un danger, plus on protège la population. C'est le rôle du **système de veille sanitaire**.

## Définitions
| La notion | La définition |
| **Veille sanitaire** | La collecte, l'analyse et l'interprétation **continues** de données de santé pour détecter au plus tôt tout événement menaçant la santé de la population |
| **Surveillance** | Le suivi régulier de l'évolution d'un phénomène (une maladie, un indicateur) dans le temps |
| **Alerte** | Le signal transmis aux autorités quand un risque est identifié, pour déclencher une réponse |
| **Sécurité sanitaire** | L'ensemble des mesures pour protéger la population contre les risques liés aux produits, aux soins, à l'environnement |

~ Signal → Vérification → Évaluation du risque → Alerte → Réponse (mesures) → Retour d'expérience

## Les acteurs
- **Santé publique France** : surveillance de l'état de santé, investigation, alerte ; elle dispose de cellules en région et gère la **réserve sanitaire**.
- Les **agences régionales de santé** reçoivent les signalements (point focal régional) et prennent les premières mesures.
- Le **ministère chargé de la santé** (Direction générale de la santé) décide des mesures nationales.
- Les **professionnels** de santé et les laboratoires, qui déclarent.
- Au-delà : le **Centre européen de prévention et de contrôle des maladies** (ECDC) et l'**OMS**, qui applique le **Règlement sanitaire international**.

## Les outils de la veille
1. Les **maladies à déclaration obligatoire** (une trentaine : tuberculose, rougeole, légionellose, méningite à méningocoque, VIH, toxi-infection alimentaire collective…) : le médecin ou le biologiste **signale** sans délai à l'ARS, puis **notifie** de façon anonymisée à Santé publique France.
2. Les **réseaux de surveillance** : médecins généralistes du réseau Sentinelles (syndromes grippaux, diarrhées), passages aux urgences, analyse des **eaux usées**, registres des cancers.
3. Les **vigilances**, qui surveillent les effets indésirables des produits de santé :

| La vigilance | Ce qu'elle surveille |
| **Pharmacovigilance** | Les médicaments |
| **Matériovigilance** | Les dispositifs médicaux (prothèses, pompes…) |
| **Hémovigilance** | Les transfusions sanguines |
| **Toxicovigilance** | Les intoxications (centres antipoison) |
| **Addictovigilance** | L'abus et la dépendance aux substances |

> Tout citoyen peut déclarer un effet indésirable sur le **portail de signalement des événements sanitaires indésirables** : la veille repose aussi sur la population.

## Les principes de la sécurité sanitaire
- **Précaution** : face à un risque grave dont l'existence n'est pas encore scientifiquement établie, on agit sans attendre la certitude (principe inscrit dans la Charte de l'environnement, 2005).
- **Prévention** : on réduit un risque connu.
- **Transparence** et **traçabilité** des produits (lots de médicaments, dons de sang).

!> La veille n'est pas la prévention : elle **détecte** et **alerte** ; la prévention agit ensuite sur les causes.

## Exemple : une toxi-infection alimentaire collective
Plusieurs élèves d'une cantine sont malades après le déjeuner (signal) → le médecin scolaire déclare à l'ARS → l'ARS et Santé publique France enquêtent (repas commun, analyses des aliments témoins) → la cuisine est fermée ou le lot retiré (réponse) → les procédures d'hygiène sont revues (retour d'expérience).`,
          },
          questions: [
            ['Qu’est-ce que la veille sanitaire ?', ['Le travail de nuit des soignants', 'La collecte et l’analyse continues de données pour détecter les menaces pour la santé', 'La vaccination obligatoire', 'Le remboursement des soins'], 1, 'Elle vise une détection précoce pour alerter.'],
            ['À qui le médecin signale-t-il d’abord une maladie à déclaration obligatoire ?', ['À la mairie', 'À l’OMS', 'À l’agence régionale de santé', 'À la CAF'], 2, 'Puis il notifie de façon anonymisée à Santé publique France.'],
            ['Quelle vigilance surveille les effets indésirables des médicaments ?', ['L’hémovigilance', 'La matériovigilance', 'La toxicovigilance', 'La pharmacovigilance'], 3, 'Elle est pilotée par l’ANSM avec des centres régionaux.'],
            ['Quelle vigilance concerne les transfusions sanguines ?', ['L’hémovigilance', 'La pharmacovigilance', 'L’addictovigilance', 'La nutrivigilance'], 0, 'Du donneur au receveur, chaque produit sanguin est tracé.'],
            ['Le principe de précaution consiste à :', ['Attendre une preuve certaine avant d’agir', 'Agir face à un risque grave même sans certitude scientifique', 'Supprimer tout risque', 'Informer seulement les médecins'], 1, 'Il est inscrit dans la Charte de l’environnement de 2005.'],
            ['Quel réseau de médecins généralistes surveille notamment les syndromes grippaux ?', ['Le réseau des CCAS', 'La réserve sanitaire', 'Le réseau Sentinelles', 'Les conseils territoriaux de santé'], 2, 'Il estime chaque semaine l’activité de plusieurs maladies.'],
            ['Quel texte international encadre la coopération mondiale face aux menaces sanitaires ?', ['La charte d’Ottawa', 'La loi Évin', 'Le traité de Rome', 'Le Règlement sanitaire international'], 3, 'Il est appliqué sous l’égide de l’OMS.'],
            ['La veille sanitaire agit directement sur les causes des maladies.', ['Vrai', 'Faux'], 1, 'Elle détecte et alerte ; la prévention agit ensuite sur les causes.'],
            ['Quelle agence gère la réserve sanitaire ?', ['Santé publique France', 'La HAS', 'L’EFS', 'L’Anses'], 0, 'Des professionnels volontaires mobilisables en cas de crise.'],
            ['Un citoyen peut-il déclarer un effet indésirable d’un médicament ?', ['Non, seuls les médecins le peuvent', 'Oui, sur le portail de signalement des événements sanitaires indésirables', 'Seulement par courrier au ministre', 'Seulement à l’étranger'], 1, 'Patients et associations peuvent déclarer directement.'],
            ['Dans quel ordre se déroule la réponse à une menace sanitaire ?', ['Alerte → signal → vérification', 'Réponse → signal → alerte', 'Signal → vérification → évaluation → alerte → réponse', 'Évaluation → réponse → signal'], 2, 'On vérifie un signal avant d’alerter et d’agir.'],
            ['Quel outil récent permet de suivre la circulation d’un virus dans une ville sans tester les habitants ?', ['Le recensement', 'La carte Vitale', 'Le contrat local de santé', 'L’analyse des eaux usées'], 3, 'Elle a été développée pendant l’épidémie de Covid-19.'],
          ],
        },
        {
          titre: 'Le système de soins et l’offre de soins',
          axe: 'Politiques et dispositifs de santé publique',
          lecon: {
            titre: 'Diversité et complémentarité des acteurs du soin',
            cours: `Du cabinet du médecin généraliste au service de réanimation d'un CHU, l'**offre de soins** est très variée. Sa force tient à la **complémentarité** de ses acteurs ; sa faiblesse, à leur cloisonnement.

## Offre et demande de soins
- L'**offre de soins** désigne l'ensemble des professionnels, des établissements et des services qui produisent des soins.
- La **demande de soins** est le recours exprimé par la population.
Les pouvoirs publics cherchent à ajuster l'offre aux **besoins** du territoire.

## Les soins de ville (ambulatoires)
| Les acteurs | Les exemples |
| **Professions médicales** | Médecins généralistes et spécialistes, chirurgiens-dentistes, sages-femmes |
| **Pharmaciens** | Officines : délivrance, conseil, vaccination, dépistage |
| **Auxiliaires médicaux** | Infirmiers, masseurs-kinésithérapeutes, orthophonistes, orthoptistes, pédicures-podologues… |
| **Structures d'exercice coordonné** | **Maisons de santé pluriprofessionnelles**, **centres de santé** (médecins salariés) |

Les **communautés professionnelles territoriales de santé** (CPTS), créées en 2016, rassemblent les professionnels d'un territoire autour d'un projet commun : accès à un médecin traitant, soins non programmés, prévention.

## Les établissements de santé
| Le statut | Exemples | Particularités |
| **Publics** | Centres hospitaliers, **CHU** (soins, enseignement, recherche) | Service public hospitalier, accueil de tous 24 h sur 24 |
| **Privés à but non lucratif** | Établissements de santé privés d'intérêt collectif (ESPIC), centres de lutte contre le cancer | Participent au service public |
| **Privés à but lucratif** | Cliniques | Nombreuses en chirurgie |

Depuis 2016, les hôpitaux publics d'un même territoire sont regroupés en **groupements hospitaliers de territoire** (GHT), autour d'un **projet médical partagé**. Les **hôpitaux de proximité** (loi de 2019) assurent les soins de premier recours avec la médecine de ville.

## Le secteur médico-social
Établissements pour personnes âgées dépendantes (EHPAD), services de soins infirmiers à domicile, établissements pour personnes handicapées : ils accompagnent au long cours et prennent le relais des soins aigus. Ils relèvent eux aussi de l'ARS (souvent avec le département).

## Premier, deuxième, troisième recours
~ Premier recours (médecin traitant, pharmacien, infirmier) → Deuxième recours (spécialiste, hôpital général) → Troisième recours (CHU, centres de référence pour les cas complexes)

> La **complémentarité** consiste à ce que chaque acteur fasse ce qu'il sait faire le mieux, au bon niveau : un patient n'a pas besoin d'un CHU pour une angine, ni d'un généraliste seul pour une greffe.

!> L'offre de soins est inégalement répartie : les **déserts médicaux** touchent des zones rurales comme des quartiers urbains, et des spécialités entières (psychiatrie, pédiatrie).

## Exemple : montrer la complémentarité sur un territoire
Une personne âgée diabétique est suivie par son **médecin traitant**, reçoit la visite d'une **infirmière libérale** pour ses injections, est hospitalisée au **centre hospitalier** pour une plaie du pied, puis rentre chez elle avec un **service de soins à domicile**. La CPTS du secteur organise les échanges entre eux.`,
          },
          questions: [
            ['Quelles sont les trois missions d’un CHU ?', ['Soins, publicité, commerce', 'Prévention, police, justice', 'Soins, enseignement, recherche', 'Hébergement, restauration, loisirs'], 2, 'Il est lié à une faculté de médecine.'],
            ['Que regroupe une communauté professionnelle territoriale de santé (CPTS) ?', ['Des hôpitaux d’une même région', 'Les caisses d’assurance maladie', 'Les associations d’usagers', 'Les professionnels de santé d’un territoire autour d’un projet commun'], 3, 'Créées en 2016, elles améliorent l’accès aux soins et la coordination.'],
            ['Un établissement de santé privé d’intérêt collectif (ESPIC) est :', ['Privé à but non lucratif', 'Privé à but lucratif', 'Public', 'Une maison de santé'], 0, 'Il participe au service public hospitalier.'],
            ['Que sont les groupements hospitaliers de territoire (GHT) ?', ['Des cliniques privées', 'Des regroupements d’hôpitaux publics autour d’un projet médical partagé', 'Des maisons de retraite', 'Des centres de vaccination'], 1, 'Ils existent depuis la loi de 2016.'],
            ['Quel professionnel relève du premier recours ?', ['Le chirurgien cardiaque d’un CHU', 'Le centre de référence des maladies rares', 'Le médecin traitant', 'Le service de réanimation'], 2, 'Le premier recours est la porte d’entrée dans le système de soins.'],
            ['Dans un centre de santé, les médecins sont en général :', ['Libéraux payés à l’acte', 'Bénévoles', 'Fonctionnaires de l’OMS', 'Salariés'], 3, 'C’est une différence avec la maison de santé, où exercent des libéraux.'],
            ['Les déserts médicaux ne concernent que les zones rurales.', ['Vrai', 'Faux'], 1, 'Certains quartiers urbains et certaines spécialités sont aussi touchés.'],
            ['Un EHPAD relève :', ['Du secteur médico-social', 'Des soins de ville', 'Du troisième recours', 'De la médecine du travail'], 0, 'Il accueille des personnes âgées dépendantes.'],
            ['Que signifie la complémentarité des acteurs du système de soins ?', ['Tous font la même chose', 'Chacun intervient au bon niveau, en lien avec les autres', 'L’hôpital remplace la médecine de ville', 'Le patient choisit toujours le CHU'], 1, 'Elle permet la continuité et la pertinence des soins.'],
            ['Quelle loi a créé les hôpitaux de proximité ?', ['La loi de 1970', 'La loi de 2002', 'La loi de 2019', 'La loi de 1902'], 2, 'Ils assurent le premier recours en lien avec la médecine de ville.'],
            ['Lequel est un auxiliaire médical ?', ['Le pharmacien', 'Le chirurgien-dentiste', 'La sage-femme', 'L’infirmier'], 3, 'Sages-femmes et chirurgiens-dentistes sont des professions médicales.'],
            ['Qu’est-ce que l’offre de soins ?', ['L’ensemble des professionnels, établissements et services qui produisent des soins', 'Le recours exprimé par la population', 'Le budget de la Sécurité sociale', 'Les remboursements'], 0, 'La demande est le recours exprimé par la population.'],
          ],
        },
        {
          titre: 'Parcours de soins, permanence des soins et place de la personne',
          axe: 'Politiques et dispositifs de santé publique',
          lecon: {
            titre: 'Être soigné au bon endroit, au bon moment',
            cours: `Le patient d'aujourd'hui souffre souvent de maladies chroniques : il passe par de nombreux professionnels pendant des années. D'où l'idée de **parcours** : organiser ses soins comme un chemin cohérent, plutôt qu'une suite de consultations isolées.

## Le parcours de soins coordonnés
Mis en place en 2005 (loi du 13 août 2004), il repose sur le **médecin traitant**, que chaque assuré de 16 ans et plus déclare à l'assurance maladie.
- Le médecin traitant **coordonne** : il suit le patient, l'oriente vers les spécialistes, tient à jour son dossier.
- Hors parcours, le patient est **moins bien remboursé** (30 % au lieu de 70 % du tarif de base pour une consultation).
- Certains spécialistes restent en **accès direct** : gynécologue, ophtalmologue, psychiatre (jusqu'à 25 ans), dentiste.

> Parcours de **soins** : la trajectoire médicale. Parcours de **santé** : il inclut aussi la prévention et le médico-social. Parcours de **vie** : il englobe le logement, le travail, la vie sociale.

## Les outils de la coordination
| L'outil | Son rôle |
| **Mon espace santé** (depuis 2022) | Espace numérique personnel qui contient le **dossier médical partagé**, une messagerie sécurisée avec les soignants |
| **Protocoles de soins** en affection de longue durée | Le médecin traitant établit le plan de soins pris en charge à 100 % |
| **Dispositifs d'appui à la coordination** | Aident les professionnels face aux situations complexes |
| **Éducation thérapeutique du patient** | Rendre le malade chronique autonome dans la gestion de sa maladie |

## La permanence des soins
La **permanence des soins** garantit l'accès à un médecin **aux heures où les cabinets sont fermés** : nuits, week-ends, jours fériés.
| La permanence | L'organisation |
| **Ambulatoire** | Médecins de garde, maisons médicales de garde ; accès après **régulation** téléphonique |
| **En établissement** | Gardes et astreintes des hôpitaux et cliniques pour les patients qui ont besoin d'une hospitalisation |

La **régulation** médicale, par le **15** (SAMU) ou le **116 117**, oriente le patient vers la bonne réponse : conseil, médecin de garde, urgences, ambulance. Le **service d'accès aux soins** associe SAMU et médecins libéraux pour répondre aux besoins de soins non programmés.

!> La permanence des soins n'est pas l'urgence vitale : aller aux urgences pour un rhume engorge les services et retarde la prise en charge des cas graves.

## La place de la personne dans le système de soins
1. **Usager-acteur** : informé, il consent, il choisit son médecin, il participe aux décisions (décision médicale partagée).
2. **Titulaire de droits** (loi de 2002) : information, accès au dossier, personne de confiance.
3. **Représentée collectivement** par des associations (démocratie sanitaire).
4. **Au centre du parcours** : les professionnels se coordonnent autour d'elle.

## Exemple : un parcours d'insuffisance cardiaque
~ Médecin traitant (repérage de l'essoufflement) → Cardiologue (diagnostic, traitement) → Hospitalisation si décompensation → Retour à domicile avec suivi infirmier et télésurveillance → Éducation thérapeutique (poids, sel, signes d'alerte)`,
          },
          questions: [
            ['Qui coordonne le parcours de soins d’un assuré ?', ['Le pharmacien', 'L’infirmier scolaire', 'La CAF', 'Le médecin traitant'], 3, 'Chaque assuré de 16 ans et plus le déclare à l’assurance maladie.'],
            ['Que se passe-t-il pour un patient qui consulte hors du parcours de soins coordonnés ?', ['Il est moins bien remboursé', 'Il n’est pas soigné', 'Il paie une amende', 'Il perd sa carte Vitale'], 0, 'Le remboursement passe de 70 % à 30 % du tarif de base.'],
            ['Lequel de ces spécialistes est en accès direct ?', ['Le cardiologue', 'Le gynécologue', 'Le dermatologue', 'Le rhumatologue'], 1, 'Gynécologue, ophtalmologue, dentiste et psychiatre (jusqu’à 25 ans) sont en accès direct.'],
            ['Qu’est-ce que la permanence des soins ?', ['L’hospitalisation de longue durée', 'Le travail de nuit des pharmaciens seulement', 'L’accès à un médecin aux heures de fermeture des cabinets', 'La vaccination permanente'], 2, 'Nuits, week-ends et jours fériés.'],
            ['Quel numéro permet la régulation médicale ?', ['Le 17', 'Le 18 seulement', 'Le 3114', 'Le 15'], 3, 'Le SAMU oriente vers la réponse adaptée ; le 116 117 existe aussi pour la permanence des soins.'],
            ['Que contient Mon espace santé ?', ['Le dossier médical partagé et une messagerie sécurisée', 'Le compte bancaire', 'Le bulletin scolaire', 'Le dossier de retraite'], 0, 'Il a été ouvert à tous en 2022.'],
            ['Le parcours de santé est plus large que le parcours de soins.', ['Vrai', 'Faux'], 0, 'Il inclut la prévention et le médico-social.'],
            ['À quoi sert l’éducation thérapeutique du patient ?', ['À former les médecins', 'À rendre le malade chronique autonome dans la gestion de sa maladie', 'À remplacer les médicaments', 'À choisir une mutuelle'], 1, 'Elle améliore le suivi du traitement et la qualité de vie.'],
            ['La permanence des soins est destinée avant tout aux urgences vitales.', ['Vrai', 'Faux'], 1, 'Elle répond aux besoins de soins non programmés ; l’urgence vitale relève du SAMU et des urgences.'],
            ['Quel dispositif associe SAMU et médecins libéraux pour les soins non programmés ?', ['La commission des usagers', 'Le PRAPS', 'Le service d’accès aux soins', 'La CPAM'], 2, 'Il évite des passages inutiles aux urgences.'],
            ['Pourquoi a-t-on développé la notion de parcours ?', ['Pour supprimer les hôpitaux', 'Pour réduire le nombre de médecins', 'Pour interdire l’accès direct', 'Parce que les patients chroniques voient de nombreux professionnels pendant longtemps'], 3, 'Il faut coordonner une trajectoire au long cours.'],
            ['Quelle loi a créé le médecin traitant ?', ['La loi du 13 août 2004', 'La loi Évin', 'La loi de 1945', 'La loi HPST'], 0, 'Le dispositif est entré en vigueur en 2005.'],
          ],
        },
        {
          titre: 'Inégalités de santé et accès aux soins',
          axe: 'Politiques et dispositifs de santé publique',
          lecon: {
            titre: 'La protection sociale dans le système de soins',
            cours: `En France, un cadre vit en moyenne plusieurs années de plus qu'un ouvrier, et l'accès à un médecin dépend du lieu où l'on habite. Réduire ces inégalités est un objectif affiché de la politique de santé ; la **protection sociale** en est l'outil principal.

## Les obstacles à l'accès aux soins
| L'obstacle | Exemples |
| **Financier** | Dépassements d'honoraires, reste à charge sur l'optique ou le dentaire, absence de complémentaire |
| **Géographique** | Déserts médicaux, éloignement des hôpitaux, délais de rendez-vous |
| **Administratif** | Méconnaissance des droits, démarches complexes, **non-recours** |
| **Culturel et social** | Barrière de la langue, faible littératie en santé, renoncement par peur ou par priorité donnée à d'autres besoins |

Le **renoncement aux soins** pour raisons financières touche d'abord les personnes aux revenus modestes, sans complémentaire.

## La place de la protection sociale dans le système de soins
~ Soin → Tarif de base → Remboursement de l'assurance maladie (obligatoire) → Complément de l'organisme complémentaire → Reste à charge du patient
1. L'**assurance maladie obligatoire** rembourse une part du tarif de base (par exemple 70 % d'une consultation dans le parcours).
2. La **complémentaire santé** prend en charge tout ou partie du reste (ticket modérateur, forfaits).
3. Le **tiers payant** évite l'avance des frais.
4. Les **affections de longue durée** (diabète, cancer…) sont prises en charge à 100 % du tarif de base pour les soins liés à la maladie.

## Les dispositifs d'accès aux soins
| Le dispositif | Pour qui | Ce qu'il apporte |
| **Protection universelle maladie** (PUMa, 2016) | Toute personne qui travaille ou réside en France de façon stable et régulière | La prise en charge des frais de santé |
| **Complémentaire santé solidaire** (C2S, 2019) | Les personnes aux ressources modestes | Une complémentaire gratuite ou à moins d'un euro par jour, sans dépassement d'honoraires |
| **Aide médicale de l'État** (AME) | Les étrangers en situation irrégulière résidant en France depuis plus de trois mois, sous condition de ressources | La prise en charge des soins, financée par l'État |
| **Permanences d'accès aux soins de santé** (PASS) | Les personnes en précarité | Consultations et soins à l'hôpital, accompagnement pour ouvrir les droits |
| **100 % santé** | Tous les assurés ayant un contrat responsable | Lunettes, prothèses dentaires et aides auditives sans reste à charge sur une sélection d'équipements |

Depuis 2016, les employeurs du privé doivent proposer une **complémentaire santé collective** à leurs salariés et en financer au moins la moitié.

## Agir sur la répartition de l'offre
- Aides à l'installation dans les **zones sous-denses** ;
- **Maisons de santé** et **centres de santé** ;
- **Téléconsultation** remboursée ;
- Délégation de tâches (infirmiers en pratique avancée, pharmaciens qui vaccinent) ;
- **PRAPS** régionaux et **contrats locaux de santé**.

> L'**universalisme proportionné** consiste à agir pour tous, mais avec une intensité qui augmente avec le niveau de désavantage : c'est la façon d'aplanir le **gradient social** de santé.

!> Un droit ouvert n'est pas un droit utilisé : une partie des personnes éligibles à la C2S ne la demande pas. Le **non-recours** est un enjeu majeur.

## Exemple
Une famille aux revenus modestes renonce aux lunettes de son enfant. Avec la **C2S** (demandée en ligne ou en caisse) et une offre **100 % santé**, les lunettes sont prises en charge sans reste à charge. Le frein n'était pas le soin, mais l'information : d'où le rôle des travailleurs sociaux et des PASS.`,
          },
          questions: [
            ['Qu’est-ce que la complémentaire santé solidaire (C2S) ?', ['Une complémentaire gratuite ou à moins d’un euro par jour pour les personnes aux ressources modestes', 'Une mutuelle réservée aux fonctionnaires', 'Une aide au logement', 'Une assurance obligatoire pour les étudiants'], 0, 'Elle existe depuis 2019.'],
            ['À qui s’adresse l’aide médicale de l’État ?', ['À tous les retraités', 'Aux étrangers en situation irrégulière résidant en France depuis plus de trois mois, sous condition de ressources', 'Aux fonctionnaires', 'Aux enfants de moins de 6 ans'], 1, 'Elle est financée par l’État.'],
            ['Que garantit la protection universelle maladie (PUMa) ?', ['Un revenu minimum', 'Une place en EHPAD', 'La prise en charge des frais de santé de toute personne qui travaille ou réside en France de façon stable et régulière', 'La gratuité totale des soins'], 2, 'Elle a remplacé la CMU de base en 2016.'],
            ['Où trouve-t-on les permanences d’accès aux soins de santé (PASS) ?', ['À la mairie', 'À la CAF', 'À l’école', 'À l’hôpital'], 3, 'Elles soignent et aident à ouvrir les droits.'],
            ['Quel obstacle à l’accès aux soins est géographique ?', ['Les déserts médicaux', 'Le reste à charge', 'La barrière de la langue', 'Le non-recours'], 0, 'L’offre de soins est inégalement répartie.'],
            ['Qu’est-ce que le non-recours ?', ['Le refus de soigner', 'Le fait de ne pas utiliser un droit auquel on est éligible', 'L’absence d’hôpital', 'Le refus d’une mutuelle'], 1, 'Méconnaissance, complexité ou crainte de stigmatisation l’expliquent.'],
            ['Le dispositif 100 % santé concerne :', ['Les consultations de généraliste', 'Les hospitalisations', 'Les lunettes, les prothèses dentaires et les aides auditives', 'Les médicaments contre le cancer'], 2, 'Une sélection d’équipements est sans reste à charge.'],
            ['Les soins liés à une affection de longue durée sont pris en charge à 100 % du tarif de base.', ['Vrai', 'Faux'], 0, 'C’est le cas du diabète ou du cancer, par exemple.'],
            ['Que désigne l’universalisme proportionné ?', ['Agir seulement pour les plus pauvres', 'Donner la même chose à tous', 'Supprimer les aides', 'Agir pour tous avec une intensité croissante selon le désavantage'], 3, 'C’est la réponse au gradient social de santé.'],
            ['Depuis 2016, les employeurs du privé doivent :', ['Proposer une complémentaire santé collective et en financer au moins la moitié', 'Soigner leurs salariés', 'Payer le reste à charge', 'Choisir le médecin traitant'], 0, 'C’est la généralisation de la complémentaire d’entreprise.'],
            ['Quelle mesure agit sur la répartition de l’offre de soins ?', ['La hausse du ticket modérateur', 'Les aides à l’installation en zone sous-dense', 'La suppression du tiers payant', 'La fermeture des centres de santé'], 1, 'Maisons de santé et téléconsultation y contribuent aussi.'],
            ['Le tiers payant permet au patient :', ['De choisir son hôpital', 'D’obtenir un arrêt de travail', 'De ne pas avancer les frais', 'De ne pas déclarer de médecin traitant'], 2, 'Le professionnel est payé directement par l’assurance maladie et la complémentaire.'],
          ],
        },
        {
          titre: 'Analyser une action de prévention ou de promotion de la santé',
          axe: 'Politiques et dispositifs de santé publique',
          lecon: {
            titre: 'Des dispositifs sur un territoire',
            cours: `En première, tu as appris à distinguer prévention, promotion et éducation pour la santé. En terminale, il s'agit d'**analyser** une intervention réelle : ses objectifs, ses acteurs, ses méthodes, et ce qu'elle produit.

## Une grille d'analyse
| La question | Ce qu'on cherche |
| **Quel problème ?** | Le problème de santé, sa fréquence, sa gravité, ses déterminants |
| **Quelle politique ?** | Le plan ou la stratégie dans lequel l'action s'inscrit |
| **Quel public ?** | Population générale, groupe à risque, personnes malades |
| **Quel type d'action ?** | Prévention primaire, secondaire ou tertiaire ; promotion de la santé ; éducation pour la santé |
| **Quelle stratégie ?** | Information, dépistage, vaccination, réglementation, environnement favorable, renforcement des compétences |
| **Quels acteurs et financeurs ?** | État, ARS, assurance maladie, collectivités, associations, professionnels |
| **Quels résultats ?** | Indicateurs de participation, d'évolution des comportements, de l'état de santé |

> La **promotion de la santé** (charte d'Ottawa, 1986) agit sur l'environnement et donne aux personnes les moyens d'agir ; la **prévention** vise une maladie ou un risque précis.

## Exemple 1 : les dépistages organisés des cancers
| Le dépistage | Le public | Le test |
| **Cancer du sein** | Femmes de 50 à 74 ans | Mammographie tous les deux ans |
| **Cancer colorectal** | Femmes et hommes de 50 à 74 ans | Test immunologique de recherche de sang dans les selles, tous les deux ans |
| **Cancer du col de l'utérus** | Femmes de 25 à 65 ans | Examen cytologique (25-29 ans), puis test HPV tous les cinq ans à partir de 30 ans |

C'est de la **prévention secondaire** : dépister tôt pour mieux guérir. Pilotage national (INCa, ministère), mise en œuvre par des centres régionaux, invitation par courrier, prise en charge à 100 % par l'assurance maladie.
!> Le taux de participation reste insuffisant (moins de la moitié des personnes invitées pour le dépistage du cancer colorectal) : un dépistage n'est efficace que s'il est suivi.

## Exemple 2 : Mois sans tabac
Chaque novembre depuis 2016, Santé publique France et l'assurance maladie invitent les fumeurs à arrêter **ensemble** pendant trente jours : kit d'aide, application, ligne Tabac info service (39 89), mobilisation des pharmacies et des entreprises. C'est une action de **prévention primaire**, fondée sur le **marketing social** et l'effet de groupe.

## Exemple 3 : la vaccination contre les papillomavirus au collège
Depuis 2023, une campagne propose la vaccination contre les HPV aux élèves de cinquième, filles et garçons, dans les collèges. Stratégie : aller **vers** le public plutôt qu'attendre qu'il consulte, pour réduire les inégalités de couverture vaccinale.

## Les rendez-vous de prévention
Depuis 2024, des **bilans de prévention** gratuits sont proposés à quatre âges clés de la vie (18-25, 45-50, 60-65 et 70-75 ans) : alimentation, activité physique, addictions, santé mentale, dépistages.

## Évaluer une action
1. **Indicateurs de moyens** : budget, nombre de professionnels mobilisés.
2. **Indicateurs de processus** : nombre de personnes touchées, taux de participation.
3. **Indicateurs de résultats** : évolution des comportements, de l'incidence, de la mortalité.
~ Réaliser l'action → Mesurer la participation → Mesurer l'effet sur les comportements → Mesurer l'effet sur la santé (à long terme)`,
          },
          questions: [
            ['Le dépistage organisé du cancer du sein concerne :', ['Les femmes de 25 à 65 ans', 'Les femmes de 50 à 74 ans', 'Toutes les femmes dès 18 ans', 'Les hommes et les femmes de 50 à 74 ans'], 1, 'Une mammographie est proposée tous les deux ans.'],
            ['Un dépistage organisé relève de quel type de prévention ?', ['Primaire', 'Tertiaire', 'Secondaire', 'Aucune'], 2, 'Il détecte la maladie à un stade précoce.'],
            ['Quel test est utilisé pour le dépistage organisé du cancer colorectal ?', ['Une coloscopie pour tous', 'Une prise de sang', 'Une radiographie', 'Un test immunologique de recherche de sang dans les selles'], 3, 'Il est proposé tous les deux ans de 50 à 74 ans.'],
            ['Mois sans tabac a lieu chaque année en :', ['Novembre', 'Janvier', 'Mai', 'Juillet'], 0, 'Depuis 2016, les fumeurs sont invités à arrêter ensemble pendant trente jours.'],
            ['Mois sans tabac est une action de prévention :', ['Secondaire', 'Primaire', 'Tertiaire', 'Palliative'], 1, 'Elle agit sur un facteur de risque avant l’apparition de la maladie.'],
            ['Pourquoi vaccine-t-on contre les HPV directement dans les collèges ?', ['Parce que c’est obligatoire', 'Parce que les médecins refusent de vacciner', 'Pour aller vers le public et réduire les inégalités de couverture vaccinale', 'Pour vacciner les parents'], 2, 'C’est une stratégie d’« aller vers ».'],
            ['Le taux de participation à un dépistage est un indicateur de :', ['Moyens', 'Résultats sur la mortalité', 'Financement', 'Processus'], 3, 'Il mesure la façon dont l’action touche son public.'],
            ['La promotion de la santé agit sur l’environnement et donne aux personnes les moyens d’agir.', ['Vrai', 'Faux'], 0, 'C’est l’esprit de la charte d’Ottawa de 1986.'],
            ['À partir de 30 ans, le dépistage du cancer du col de l’utérus repose sur :', ['Un test HPV tous les cinq ans', 'Une mammographie', 'Une coloscopie', 'Une échographie annuelle'], 0, 'Entre 25 et 29 ans, on réalise un examen cytologique.'],
            ['Quel numéro correspond à Tabac info service ?', ['39 89', '3114', '115', '119'], 0, 'Des tabacologues y accompagnent l’arrêt.'],
            ['Lequel est un indicateur de résultat d’une action contre le tabac ?', ['Le budget de la campagne', 'La baisse de la prévalence du tabagisme', 'Le nombre d’affiches imprimées', 'Le nombre de réunions'], 1, 'Il mesure l’effet sur les comportements.'],
            ['Les bilans de prévention gratuits créés en 2024 sont proposés :', ['Chaque année à tous', 'Seulement aux enfants', 'À quatre âges clés de la vie', 'Seulement aux fumeurs'], 2, '18-25, 45-50, 60-65 et 70-75 ans.'],
          ],
        },
        // ──────────────── POLITIQUES SOCIALES ────────────────
        {
          titre: 'L’histoire des politiques sociales',
          axe: 'Politiques sociales et action sociale',
          lecon: {
            titre: 'De la charité à la solidarité nationale',
            cours: `Aider les plus fragiles a longtemps été une affaire de charité privée. Peu à peu, la société a reconnu un **devoir collectif** envers ses membres : c'est la naissance des **politiques sociales**.

## Qu'est-ce qu'une politique sociale ?
Une **politique sociale** est l'ensemble des interventions des pouvoirs publics qui visent à améliorer les conditions de vie, à **réduire les inégalités** et à renforcer la **cohésion sociale** : emploi, logement, famille, handicap, vieillesse, lutte contre la pauvreté.

## Les grandes étapes
@ 1656 — L'Hôpital général de Paris enferme mendiants et vagabonds : l'assistance est surtout charité et contrôle
@ 1790 — Le Comité de mendicité de la Révolution affirme que l'assistance est un devoir de la nation
@ 1893 — Loi sur l'assistance médicale gratuite, suivie des lois de 1904 (enfance) et 1905 (vieillards, infirmes, incurables)
@ 1945 — Création de la Sécurité sociale : la protection devient un droit lié au travail
@ 1953 — L'assistance devient l'**aide sociale**, avec des droits définis par la loi
@ 1975 — Lois sur les personnes handicapées et sur les institutions sociales et médico-sociales
@ 1982 — Lois de décentralisation : l'aide sociale est largement confiée aux départements
@ 1988 — Création du revenu minimum d'insertion (RMI)
@ 1998 — Loi d'orientation relative à la lutte contre les exclusions
@ 2002 — Loi du 2 janvier rénovant l'action sociale et médico-sociale : droits des usagers des établissements
@ 2005 — Loi du 11 février pour l'égalité des droits et des chances des personnes handicapées : création des MDPH
@ 2009 — Le revenu de solidarité active (RSA) remplace le RMI
@ 2021 — La branche autonomie de la Sécurité sociale, créée en 2020, est gérée par la CNSA
@ 2024 — France Travail remplace Pôle emploi ; depuis 2025, les allocataires du RSA y sont inscrits et accompagnés

## Trois logiques qui se sont succédé
| La logique | L'idée | Exemple |
| **Charité, assistance** | Aide morale ou religieuse, discrétionnaire, souvent conditionnée | Hôpital général, bureaux de bienfaisance |
| **Assurance** | Des droits ouverts par des cotisations | Sécurité sociale de 1945 |
| **Solidarité nationale, insertion** | Des droits pour tous, financés par l'impôt, avec un accompagnement | RMI, RSA, allocations pour le handicap |

> Le passage de l'assistance à l'**aide sociale** marque un changement profond : l'aide n'est plus une faveur, c'est un **droit** que l'on peut faire valoir.

## L'évolution de la place de l'usager
- Hier **assisté**, objet de l'aide ;
- puis **bénéficiaire** de droits ;
- aujourd'hui **usager-acteur** : il signe un contrat (projet personnalisé, contrat d'engagement), il est consulté (conseil de la vie sociale), il **participe** à l'élaboration des politiques (conseils de personnes accompagnées).

!> Les lois de 2002 et 2005 marquent ce tournant : la personne n'est plus « prise en charge », elle est **accompagnée** dans son propre projet.

## Exemple : la politique du handicap
En 1975, la loi organise des établissements et des allocations ; en 2005, la loi pose le droit à **compensation** (prestation de compensation du handicap), l'**accessibilité** et la **participation** : on passe d'une logique de protection à une logique de citoyenneté.`,
          },
          questions: [
            ['Qu’est-ce qu’une politique sociale ?', ['Une action humanitaire privée', 'Une politique de santé', 'L’ensemble des interventions publiques pour améliorer les conditions de vie et renforcer la cohésion sociale', 'Un programme électoral'], 2, 'Elle couvre l’emploi, le logement, la famille, le handicap, la pauvreté…'],
            ['Quelle institution de 1945 a fait de la protection un droit lié au travail ?', ['L’Hôpital général', 'Le RMI', 'La MDPH', 'La Sécurité sociale'], 3, 'Elle repose sur la logique d’assurance et les cotisations.'],
            ['En quelle année le RMI a-t-il été créé ?', ['1945', '1975', '1988', '2009'], 2, 'Il a été remplacé par le RSA en 2009.'],
            ['Quelle loi a rénové l’action sociale et médico-sociale en posant les droits des usagers des établissements ?', ['La loi du 2 janvier 2002', 'La loi du 11 février 2005', 'La loi de 1893', 'La loi HPST'], 0, 'Livret d’accueil, charte, contrat de séjour, conseil de la vie sociale…'],
            ['Quelle loi a créé les maisons départementales des personnes handicapées ?', ['La loi de 1975', 'La loi du 11 février 2005', 'La loi de 1998', 'La loi de 1988'], 1, 'Elle pose aussi le droit à compensation et l’accessibilité.'],
            ['Que change le passage de l’assistance à l’aide sociale ?', ['L’aide devient une faveur', 'L’aide disparaît', 'L’aide devient un droit défini par la loi', 'L’aide est réservée aux salariés'], 2, 'On peut la faire valoir, et contester un refus.'],
            ['Les lois de décentralisation de 1982 ont confié une grande part de l’aide sociale :', ['Aux communes seules', 'À l’Union européenne', 'Aux associations', 'Aux départements'], 3, 'Le département est devenu le principal acteur de l’aide sociale.'],
            ['Depuis 2025, les allocataires du RSA sont inscrits et accompagnés par :', ['France Travail', 'La MDPH', 'La CNSA', 'L’hôpital'], 0, 'France Travail a remplacé Pôle emploi le 1er janvier 2024.'],
            ['La logique de charité ouvre des droits que l’on peut faire valoir en justice.', ['Vrai', 'Faux'], 1, 'Elle est discrétionnaire : c’est l’aide sociale qui ouvre des droits.'],
            ['Quel organisme gère la branche autonomie depuis 2021 ?', ['La CNAF', 'La CNSA', 'La CNAM', 'L’URSSAF'], 1, 'La Caisse nationale de solidarité pour l’autonomie.'],
            ['Comment a évolué la place de l’usager dans les politiques sociales ?', ['D’acteur à simple assisté', 'Elle n’a pas changé', 'D’assisté à usager-acteur qui participe', 'Il a été exclu des décisions'], 2, 'Contrats, projets personnalisés et instances de participation en témoignent.'],
            ['Quelle loi de 1998 porte sur la lutte contre les exclusions ?', ['La loi Évin', 'La loi de modernisation de 2016', 'La loi sur l’assistance médicale gratuite', 'La loi d’orientation relative à la lutte contre les exclusions'], 3, 'Elle a notamment créé les PASS et renforcé l’accès aux droits.'],
          ],
        },
        {
          titre: 'Du problème social à la politique sociale',
          axe: 'Politiques sociales et action sociale',
          lecon: {
            titre: 'Comment naît et se caractérise une politique sociale',
            cours: `Un problème social n'existe pas « naturellement » : il faut qu'une situation soit **perçue** comme intolérable et qu'elle soit **portée** jusqu'aux décideurs. La politique sociale est la réponse organisée à ce problème.

## De la situation au problème social
1. Une **situation** touche un groupe (pauvreté des familles monoparentales, isolement des personnes âgées, jeunes sans emploi ni formation).
2. Elle est **rendue visible** : chiffres (INSEE, DREES), enquêtes, médias, travailleurs sociaux.
3. Des **acteurs la portent** : associations, syndicats, élus, personnes concernées.
4. Elle est **mise sur l'agenda politique**.
5. Une **politique** est décidée, puis traduite en **dispositifs**.

> Un événement peut accélérer la mise sur l'agenda : la **canicule de 2003** (environ 15 000 décès en excès) a fait de l'isolement des personnes âgées un problème public, d'où la création de la CNSA et de la journée de solidarité.

## Les caractéristiques des politiques sociales
| Le critère | Les deux pôles |
| **Le public** | **Catégorielles** (un public : familles, personnes handicapées, personnes âgées, jeunes) ou **transversales** (un problème qui traverse les publics : exclusion, logement, politique de la ville) |
| **Le fondement** | **Assurance** (cotisations, droits contributifs) ou **assistance / solidarité** (besoin, financement par l'impôt) |
| **L'accès** | **Universelles** (pour tous : allocations familiales) ou **sélectives** (sous condition de ressources : RSA) |
| **La nature de l'aide** | **Prestations en espèces** (allocations) ou **en nature** (hébergement, accompagnement, soins) |
| **Le caractère** | **Légales** (obligatoires, fixées par la loi : RSA, APA) ou **facultatives** (décidées localement : aides d'un CCAS) |

## Les principes de l'aide sociale légale
- **Subsidiarité** : elle intervient après les autres ressources, dont la solidarité familiale (**obligation alimentaire** entre parents et enfants) ;
- **Personnalisation** : l'aide est adaptée à la situation de chacun ;
- Caractère d'**avance** : certaines aides peuvent être récupérées, par exemple sur la succession ;
- **Territorialité** : c'est la collectivité du domicile de secours qui paie.

## Les objectifs des politiques sociales
| L'objectif | Exemple de dispositif |
| **Garantir un revenu minimum** | RSA, allocation aux adultes handicapés, minimum vieillesse |
| **Compenser une charge** | Allocations familiales, prestation de compensation du handicap |
| **Favoriser l'insertion** | Accompagnement vers l'emploi, contrat d'engagement jeune |
| **Protéger** | Aide sociale à l'enfance, protection juridique des majeurs |
| **Soutenir l'autonomie** | Allocation personnalisée d'autonomie (APA) |

!> Une politique sociale ne se résume pas à distribuer de l'argent : l'**accompagnement** (logement, emploi, santé, lien social) est souvent décisif.

## Exemple travaillé : présenter une politique au regard d'un problème
**Problème** : près de 10 millions de personnes vivent sous le seuil de pauvreté (60 % du revenu médian), soit environ 15 % de la population en 2023 selon l'INSEE ; les familles monoparentales et les jeunes sont surreprésentés.
**Politique** : stratégies nationales de lutte contre la pauvreté (2018, puis pacte des solidarités de 2023).
**Dispositifs** : RSA et accompagnement, repas à un euro dans les restaurants universitaires, petits-déjeuners à l'école, service public de la petite enfance.
**Caractéristiques** : politique transversale, sélective, de solidarité, combinant prestations en espèces et en nature.`,
          },
          questions: [
            ['Qu’est-ce qu’une politique sociale catégorielle ?', ['Une politique pour tous', 'Une politique sans financement', 'Une politique européenne', 'Une politique qui vise un public particulier'], 3, 'Par exemple la politique en faveur des personnes âgées.'],
            ['Une aide sociale légale est :', ['Obligatoire et fixée par la loi', 'Décidée librement par chaque commune', 'Réservée aux associations', 'Toujours versée par l’Europe'], 0, 'RSA, APA ou aide sociale à l’enfance en sont des exemples.'],
            ['Que signifie le principe de subsidiarité de l’aide sociale ?', ['Elle est versée avant tout autre revenu', 'Elle intervient après les autres ressources, dont la solidarité familiale', 'Elle est réservée aux salariés', 'Elle ne peut jamais être récupérée'], 1, 'L’obligation alimentaire familiale passe d’abord.'],
            ['Quel événement a fait de l’isolement des personnes âgées un problème public en 2003 ?', ['Une épidémie de grippe', 'Une crise financière', 'La canicule', 'Une grève'], 2, 'Elle a provoqué environ 15 000 décès en excès.'],
            ['Une prestation sous condition de ressources est dite :', ['Universelle', 'Contributive', 'Facultative', 'Sélective'], 3, 'Le RSA en est un exemple.'],
            ['Quelle est la différence entre prestation en espèces et prestation en nature ?', ['L’une verse de l’argent, l’autre fournit un service ou un bien', 'Aucune', 'L’une est légale, l’autre facultative', 'L’une est européenne, l’autre nationale'], 0, 'Une place d’hébergement est une prestation en nature.'],
            ['La politique de la ville est une politique :', ['Catégorielle', 'Transversale', 'Assurantielle', 'Médicale'], 1, 'Elle traite un ensemble de problèmes sur des quartiers prioritaires.'],
            ['Un problème social existe dès qu’une situation difficile touche des personnes.', ['Vrai', 'Faux'], 1, 'Il faut qu’elle soit perçue, portée et mise sur l’agenda.'],
            ['Le seuil de pauvreté monétaire en France est fixé à :', ['50 % du revenu moyen', '100 % du SMIC', '60 % du revenu médian', '40 % du revenu médian'], 2, 'Environ 15 % de la population vivait sous ce seuil en 2023.'],
            ['Quel dispositif vise à soutenir l’autonomie des personnes âgées ?', ['Le RSA', 'L’allocation de rentrée scolaire', 'Le contrat d’engagement jeune', 'L’allocation personnalisée d’autonomie'], 3, 'Elle est versée par le département.'],
            ['Qui peut contribuer à rendre visible une situation sociale ?', ['Les statistiques, les médias, les associations et les travailleurs sociaux', 'Seulement le Président', 'Personne', 'Seulement les tribunaux'], 0, 'La visibilité est la première étape vers la mise sur l’agenda.'],
            ['Une aide facultative d’un CCAS relève d’une politique :', ['Légale et nationale', 'Décidée localement', 'Européenne', 'Assurantielle'], 1, 'Chaque commune fixe ses aides facultatives.'],
          ],
        },
        {
          titre: 'L’action sociale : acteurs, territoires et financement',
          axe: 'Politiques sociales et action sociale',
          lecon: {
            titre: 'Qui fait quoi, et avec quel argent ?',
            cours: `Une politique sociale décidée à Paris n'a d'effet que si quelqu'un, sur le terrain, accueille, instruit, accompagne. L'**action sociale** est ce passage de la décision à l'intervention auprès des personnes.

## Définition
L'**action sociale** regroupe l'ensemble des interventions, légales ou facultatives, qui visent à **prévenir** les difficultés, à **promouvoir l'autonomie** et la protection des personnes, et à favoriser la **cohésion sociale**. Elle est plus large que l'**aide sociale** (les prestations légales), car elle inclut l'accompagnement et la prévention.

## Les acteurs publics
| L'acteur | Ses compétences |
| **État** | Définit les politiques, fixe le RSA et l'allocation aux adultes handicapés, finance l'hébergement d'urgence ; au niveau local, préfet et directions de l'emploi, du travail et des solidarités |
| **Département** | **Chef de file** de l'action sociale depuis 2004 : aide sociale à l'enfance, protection maternelle et infantile, RSA, APA, prestation de compensation du handicap, MDPH |
| **Commune** | **Centre communal d'action sociale** (CCAS) : aides facultatives, domiciliation, instruction des demandes, **analyse des besoins sociaux** obligatoire |
| **Région** | Formation des travailleurs sociaux |
| **Organismes de Sécurité sociale** | Action sociale des CAF (crèches, centres sociaux), de l'assurance retraite, de la MSA ; CNSA pour l'autonomie |

## Les acteurs privés
- **Associations** (loi de 1901) : elles gèrent une grande partie des établissements sociaux et médico-sociaux et des actions de terrain (Restos du cœur, Secours populaire, Croix-Rouge, Emmaüs…).
- **Fondations**, mutuelles, entreprises de l'économie sociale et solidaire.

> Le **partenariat** et la **contractualisation** sont la règle : l'État, le département et les associations signent des conventions, des contrats pluriannuels, répondent à des appels à projets.

## Territoire d'action sociale
Le département découpe souvent son territoire en **circonscriptions** ou **maisons des solidarités**, où travaillent assistants de service social, éducateurs, puéricultrices. Le territoire est le lieu du **diagnostic** et de la coordination des acteurs.

## Une pluralité de financements
| La source | Exemple |
| **Départements** | Impôts locaux, droits de mutation, dotations de l'État, concours de la CNSA pour l'APA et la PCH |
| **État** | Hébergement d'urgence, crédits de la politique de la ville |
| **Sécurité sociale** | Branche famille (action sociale des CAF), branche autonomie |
| **Communes** | Budget du CCAS |
| **Union européenne** | **Fonds social européen plus** (FSE+) pour l'insertion |
| **Dons et mécénat** | Associations caritatives |
| **Usagers** | Participation selon les ressources (hébergement en EHPAD) |

!> Ne confonds pas le **payeur** et l'**opérateur** : le RSA est financé et décidé par le département, mais versé par la **CAF** ou la **MSA**.

## La décentralisation, une force et une limite
- **Force** : décisions proches du terrain, adaptées aux besoins locaux.
- **Limite** : inégalités entre départements, dont les ressources et les choix diffèrent ; difficulté à financer des dépenses qui augmentent (RSA, autonomie).

## Exemple : une famille en difficulté
Un assistant de service social de la **maison des solidarités** (département) accompagne une mère seule : ouverture du RSA (versé par la CAF), orientation vers **France Travail**, place en crèche à vocation d'insertion (financée avec la CAF), aide alimentaire d'une **association**, secours d'urgence du **CCAS**. Cinq acteurs, un seul accompagnement : c'est la **complémentarité** de l'action sociale.`,
          },
          questions: [
            ['Quel acteur est le chef de file de l’action sociale ?', ['Le département', 'L’État', 'La région', 'La commune'], 0, 'La loi du 13 août 2004 lui a confié ce rôle.'],
            ['Quelle est la différence entre aide sociale et action sociale ?', ['Aucune', 'L’action sociale est plus large : elle inclut accompagnement et prévention', 'L’aide sociale est plus large', 'L’aide sociale est facultative'], 1, 'L’aide sociale désigne les prestations légales.'],
            ['Qu’est-ce que le CCAS ?', ['Une caisse de Sécurité sociale', 'Un hôpital', 'Le centre communal d’action sociale', 'Une association privée'], 2, 'Il gère les aides facultatives de la commune et réalise l’analyse des besoins sociaux.'],
            ['Qui verse le RSA à l’allocataire ?', ['Le département directement', 'La mairie', 'L’ARS', 'La CAF ou la MSA'], 3, 'Le département finance et décide ; la CAF ou la MSA versent.'],
            ['Quel fonds européen finance des actions d’insertion ?', ['Le FSE+', 'La BCE', 'Le FMI', 'L’ONDAM'], 0, 'Le Fonds social européen plus.'],
            ['Laquelle de ces missions relève du département ?', ['La formation des travailleurs sociaux', 'L’aide sociale à l’enfance', 'L’hébergement d’urgence', 'La délivrance des passeports'], 1, 'Il gère aussi la PMI, le RSA, l’APA et la PCH.'],
            ['La région est chargée :', ['Du RSA', 'De l’aide sociale à l’enfance', 'De la formation des travailleurs sociaux', 'Des CCAS'], 2, 'Elle finance et organise les formations sociales.'],
            ['Les associations gèrent une grande partie des établissements sociaux et médico-sociaux.', ['Vrai', 'Faux'], 0, 'Elles sont des partenaires essentiels des pouvoirs publics.'],
            ['Quelle limite présente la décentralisation de l’action sociale ?', ['Des décisions trop éloignées du terrain', 'L’absence totale de financement', 'L’interdiction des associations', 'Des inégalités entre départements'], 3, 'Ressources et choix diffèrent d’un département à l’autre.'],
            ['Qui finance l’hébergement d’urgence ?', ['Principalement l’État', 'Uniquement les communes', 'Les mutuelles', 'L’OMS'], 0, 'C’est une compétence de l’État.'],
            ['Que désigne la contractualisation dans l’action sociale ?', ['Le contrat de travail des usagers', 'La signature de conventions et contrats entre financeurs et opérateurs', 'L’achat de médicaments', 'La fin des partenariats'], 1, 'Conventions, contrats pluriannuels et appels à projets en sont les formes.'],
            ['Les CAF mènent aussi une action sociale, par exemple :', ['En délivrant des ordonnances', 'En gérant les hôpitaux', 'En finançant crèches et centres sociaux', 'En contrôlant les médicaments'], 2, 'C’est l’action sociale de la branche famille.'],
          ],
        },
        {
          titre: 'Diagnostic social et dispositifs de lutte contre l’exclusion',
          axe: 'Politiques sociales et action sociale',
          lecon: {
            titre: 'Analyser un dispositif s’inscrivant dans une politique sociale',
            cours: `Le programme demande d'étudier au moins un dispositif de lutte contre l'exclusion. Avant de concevoir un dispositif, il faut connaître les besoins : c'est le rôle du **diagnostic**.

## Le diagnostic des besoins sociaux
Un **diagnostic** est une photographie argumentée d'un territoire : qui y vit, quels problèmes, quelles ressources, quels manques.
~ Recueil de données (INSEE, CAF, services sociaux, enquêtes) → Analyse des besoins → Repérage de l'offre existante → Écart entre besoins et réponses → Priorités d'action
- Les **CCAS** doivent réaliser une **analyse des besoins sociaux** (ABS) dans l'année qui suit le renouvellement du conseil municipal.
- Le diagnostic est **partagé** quand il associe habitants, associations et professionnels.

> Sans diagnostic, un dispositif risque de répondre à un besoin qui n'existe pas, ou d'en oublier un qui est réel.

## Une grille pour analyser un dispositif
| La rubrique | Les questions |
| **Politique de rattachement** | Dans quelle politique s'inscrit-il ? Quel texte le fonde ? |
| **Périmètre** | Quelle **population** ? Quelles **missions** ? Quels **objectifs** ? |
| **Modalités d'intervention** | Accueil, hébergement, allocation, accompagnement individuel ou collectif ? Intervient-on **auprès** des personnes ou **avec** elles ? |
| **Acteurs** | Qui pilote, qui met en œuvre, avec quels **partenaires** ? Comment les habitants participent-ils ? |
| **Cadre et financement** | Qui finance ? Quel cadre juridique ? |

## Dispositif 1 : le revenu de solidarité active (RSA)
- **Politique** : lutte contre la pauvreté et insertion.
- **Public** : personnes de 25 ans et plus (ou plus jeunes avec enfant à charge, ou ayant assez travaillé) aux ressources très faibles.
- **Double volet** : une **allocation** qui complète les ressources jusqu'à un montant forfaitaire, et un **accompagnement** vers l'insertion.
- **Depuis 2025** : inscription à France Travail et **contrat d'engagement** fixant un plan d'action, avec en principe au moins quinze heures d'activité par semaine (formation, stage, démarches), adaptées à la situation.
- **Acteurs** : département (décision, financement), CAF ou MSA (versement), France Travail et services sociaux (accompagnement).

## Dispositif 2 : l'hébergement et le logement
- **Numéro 115** et **services intégrés d'accueil et d'orientation** (SIAO, 2010) : une porte d'entrée unique par département pour orienter les personnes sans abri.
- **Centres d'hébergement et de réinsertion sociale** (CHRS) : hébergement et accompagnement global.
- **Maraudes**, accueils de jour, **domiciliation** (une adresse pour recevoir son courrier et accéder à ses droits).
- **Logement d'abord** (depuis 2018) : proposer directement un logement accompagné plutôt qu'un parcours par étapes d'hébergement.
- **Droit au logement opposable** (loi DALO, 2007) : un recours si l'on n'obtient pas de logement.

## Des interventions complémentaires
| Le niveau | Exemple |
| **Individuel** | Accompagnement d'un allocataire par un référent |
| **Collectif** | Atelier cuisine à petit budget, groupe de recherche d'emploi |
| **Communautaire** | Projet porté par les habitants d'un quartier avec un centre social |

!> Analyser un dispositif, ce n'est pas seulement le décrire : il faut montrer ses **effets** (sortie de la rue, retour à l'emploi) et ses **limites** (non-recours, manque de places, saturation du 115).

## Exemple de conclusion d'analyse
Le SIAO améliore la **coordination** (une seule porte d'entrée, une vision des places disponibles), mais il ne crée pas de places : sans offre suffisante de logements sociaux, l'orientation bute sur la pénurie. D'où l'intérêt de politiques **transversales** qui relient hébergement, logement, emploi et santé.`,
          },
          questions: [
            ['Quel organisme doit réaliser une analyse des besoins sociaux ?', ['L’ARS', 'Le CCAS', 'La CNSA', 'L’hôpital'], 1, 'Dans l’année qui suit le renouvellement du conseil municipal.'],
            ['Quelle est la première étape d’un diagnostic des besoins sociaux ?', ['Le financement', 'L’évaluation', 'Le recueil de données', 'La communication'], 2, 'Données de l’INSEE, de la CAF, des services sociaux, enquêtes…'],
            ['Quels sont les deux volets du RSA ?', ['Un logement et une voiture', 'Une bourse et une formation obligatoire', 'Une retraite et une mutuelle', 'Une allocation et un accompagnement vers l’insertion'], 3, 'L’allocation complète les ressources ; l’accompagnement vise l’insertion.'],
            ['À quel numéro appelle-t-on pour un hébergement d’urgence ?', ['Le 115', 'Le 15', 'Le 119', 'Le 3114'], 0, 'Il est géré par le SIAO du département.'],
            ['Que signifie SIAO ?', ['Système international d’aide aux orphelins', 'Service intégré d’accueil et d’orientation', 'Service d’insertion des adultes âgés', 'Syndicat des infirmiers et aides-soignants'], 1, 'Une porte d’entrée unique pour orienter les personnes sans abri.'],
            ['Quel est le principe du « Logement d’abord » ?', ['Passer par toutes les étapes d’hébergement avant un logement', 'Construire uniquement des centres d’hébergement', 'Proposer directement un logement accompagné', 'Supprimer l’accompagnement'], 2, 'Le logement est le point de départ de l’insertion, non sa récompense.'],
            ['La loi DALO de 2007 permet :', ['Un revenu minimum', 'Une place en crèche', 'Un emploi garanti', 'Un recours si l’on n’obtient pas de logement'], 3, 'Droit au logement opposable.'],
            ['Un diagnostic partagé associe habitants, associations et professionnels.', ['Vrai', 'Faux'], 0, 'Il prend en compte des points de vue différents sur les besoins.'],
            ['Qu’est-ce que la domiciliation ?', ['Une adresse pour recevoir son courrier et accéder à ses droits', 'Un logement gratuit', 'Une aide au déménagement', 'Un contrat de location'], 0, 'Sans adresse, de nombreux droits sont impossibles à ouvrir.'],
            ['Depuis 2025, l’allocataire du RSA signe :', ['Un contrat de travail', 'Un contrat d’engagement avec un plan d’action', 'Un bail', 'Un contrat de mariage'], 1, 'Il prévoit en principe au moins quinze heures d’activité par semaine, adaptées à sa situation.'],
            ['Quelle limite peut-on relever pour le SIAO ?', ['Il ne coordonne rien', 'Il est réservé aux salariés', 'Il oriente mais ne crée pas de places', 'Il est payant'], 2, 'La pénurie de places et de logements bloque l’orientation.'],
            ['Un atelier cuisine à petit budget dans un centre social est une intervention :', ['Individuelle', 'Judiciaire', 'Hospitalière', 'Collective'], 3, 'Elle réunit un groupe autour d’un objectif commun.'],
          ],
        },
        // ──────────────── MÉTHODOLOGIES ────────────────
        {
          titre: 'La démarche de projet en santé-social',
          axe: 'Méthodologies appliquées au secteur sanitaire et social',
          lecon: {
            titre: 'Du diagnostic à l’évaluation',
            cours: `Une maison de santé qui veut réduire le tabagisme de ses patients, un CCAS qui veut rompre l'isolement des aînés : dans les deux cas, on ne se lance pas au hasard. On conduit un **projet**, avec des étapes, des acteurs et des critères de réussite.

## Les spécificités d'un projet en santé-social
- Il part d'un **besoin** d'une population, repéré par un **diagnostic** ;
- Il s'inscrit dans un **cadre juridique et politique** (plan national, projet régional de santé, contrat local de santé) ;
- Il associe la **population cible** ;
- Il respecte une **déontologie** et une **éthique** (confidentialité, consentement, non-stigmatisation) ;
- Il réunit des **partenaires** aux logiques différentes.

## Les quatre phases de la démarche de projet
~ Étude (diagnostic) → Conception du plan d'actions → Mise en œuvre → Évaluation
| La phase | Ce qu'on fait | Les outils |
| **1. Étude** | Analyser la situation, les besoins, les ressources, choisir une priorité | Données statistiques, enquête, entretiens, diagnostic partagé |
| **2. Conception** | Fixer les **objectifs**, choisir les actions, les moyens, le calendrier, le budget, les partenaires | Arbre des objectifs, planning (diagramme de Gantt), budget prévisionnel |
| **3. Mise en œuvre** | Réaliser les actions, coordonner, ajuster | Comité de pilotage, comité technique, tableaux de bord |
| **4. Évaluation** | Mesurer les résultats, tirer des enseignements | **Critères** et **indicateurs**, questionnaires, bilan |

## Des objectifs bien construits
| Le niveau | Exemple (projet contre l'isolement des aînés) |
| **Objectif général** | Réduire l'isolement social des personnes de plus de 75 ans de la commune |
| **Objectif spécifique** | Augmenter la participation des aînés isolés à des activités collectives |
| **Objectif opérationnel** | Organiser deux ateliers par semaine au centre social d'ici juin, avec un transport accompagné |

> Un bon objectif est **précis**, **mesurable**, **réaliste** et **daté** : sinon, on ne peut pas l'évaluer.

## Critères et indicateurs
- Un **critère** est la qualité que l'on juge : pertinence (répond-on au besoin ?), cohérence, **efficacité** (atteint-on les objectifs ?), **efficience** (à quel coût ?), impact.
- Un **indicateur** est la donnée qui mesure le critère : nombre de participants, taux de satisfaction, part des aînés ayant rejoint une activité régulière.

!> L'évaluation se prépare **dès la conception** : on fixe les indicateurs avant de commencer, et on recueille les données tout au long du projet.

## Les acteurs et leurs rôles
| L'acteur | Son rôle |
| **Porteur de projet** | Pilote et assume la responsabilité |
| **Comité de pilotage** | Décide des grandes orientations, valide les étapes |
| **Partenaires** | Apportent compétences, moyens, financement |
| **Financeurs** | ARS, collectivités, CAF, fondations (souvent par appel à projets) |
| **Population cible** | Exprime ses besoins, participe aux actions et à l'évaluation |

## Les contraintes
Budget, temps, disponibilité des partenaires, cadre réglementaire (protection des données personnelles), adhésion du public.

## La valorisation
Rendre compte des résultats (rapport, présentation aux financeurs, articles), les **partager** pour que d'autres s'en inspirent, et décider de **pérenniser**, d'ajuster ou d'arrêter l'action.`,
          },
          questions: [
            ['Quelles sont les quatre phases de la démarche de projet ?', ['Financement, publicité, vente, bilan', 'Diagnostic, soin, guérison, sortie', 'Étude, conception, mise en œuvre, évaluation', 'Idée, vote, loi, décret'], 2, 'C’est l’ordre prévu par le programme.'],
            ['Sur quoi repose la phase d’étude ?', ['Sur le budget final', 'Sur la valorisation', 'Sur la communication', 'Sur le diagnostic de la situation et des besoins'], 3, 'Elle permet de choisir une priorité fondée.'],
            ['Qu’est-ce qu’un indicateur ?', ['Une donnée qui mesure un critère', 'La qualité que l’on juge', 'Le chef de projet', 'Le financeur'], 0, 'Par exemple le nombre de participants mesure la participation.'],
            ['L’efficience compare :', ['Les résultats et les besoins', 'Les résultats obtenus et les moyens utilisés', 'Les objectifs et le calendrier', 'Les partenaires entre eux'], 1, 'Elle répond à la question : à quel coût ?'],
            ['Quel objectif est opérationnel ?', ['Améliorer la santé des jeunes', 'Réduire l’isolement des aînés', 'Organiser deux ateliers par semaine au centre social d’ici juin', 'Promouvoir le bien-être'], 2, 'Il est précis, mesurable et daté.'],
            ['Qui valide les grandes étapes d’un projet ?', ['Le public seul', 'Le journaliste', 'Le fournisseur', 'Le comité de pilotage'], 3, 'Il décide des orientations ; le comité technique met en œuvre.'],
            ['L’évaluation se prépare seulement à la fin du projet.', ['Vrai', 'Faux'], 1, 'Les indicateurs se fixent dès la conception.'],
            ['Quel outil sert à planifier les actions dans le temps ?', ['Le diagramme de Gantt', 'L’antibiogramme', 'La pyramide des âges', 'Le caryotype'], 0, 'Il visualise les tâches et leur durée.'],
            ['Quelle est une spécificité d’un projet en santé-social ?', ['Il ignore la population cible', 'Il associe la population cible et respecte une éthique', 'Il n’a pas de cadre juridique', 'Il est toujours individuel'], 1, 'Confidentialité, consentement et non-stigmatisation sont essentiels.'],
            ['Que signifie évaluer la pertinence d’un projet ?', ['Calculer son coût', 'Compter les réunions', 'Vérifier qu’il répond bien au besoin identifié', 'Vérifier l’orthographe du rapport'], 2, 'Un projet efficace mais hors sujet n’est pas pertinent.'],
            ['Qu’appelle-t-on la valorisation d’un projet ?', ['Son financement initial', 'Sa suppression', 'Son diagnostic', 'La diffusion et le partage de ses résultats'], 3, 'Elle permet aussi de décider de pérenniser l’action.'],
            ['Laquelle est une contrainte fréquente d’un projet ?', ['Le budget limité', 'L’absence de besoins', 'L’interdiction d’évaluer', 'L’absence de public'], 0, 'Temps, partenaires et cadre réglementaire en sont d’autres.'],
          ],
        },
        {
          titre: 'Méthode : réussir l’épreuve écrite de STSS',
          axe: 'Méthodologie',
          lecon: {
            titre: 'Mobiliser ses connaissances, exploiter un dossier',
            cours: `L'épreuve écrite de sciences et techniques sanitaires et sociales dure **3 heures** et compte énormément dans le baccalauréat (coefficient 16). Elle porte sur le programme de terminale et peut mobiliser celui de première.

## La structure de l'épreuve
| La partie | Le barème | Le contenu |
| **Mobilisation des connaissances** | **6 points** | Une ou deux questions **sans document**, sur des thèmes différents du programme |
| **Développement s'appuyant sur un dossier documentaire** | **14 points** | Un questionnement, un dossier de **cinq documents au plus** (textes, graphiques, tableaux statistiques), cinq pages au plus |

= Répartition conseillée : environ 45 minutes pour la première partie, 2 heures 15 pour la seconde, dont 10 minutes de relecture

## Première partie : mobiliser ses connaissances
1. **Repère le verbe** de la consigne : définir, présenter, expliquer, montrer, illustrer.
2. **Définis** les notions clés dès le début.
3. **Structure** : une courte introduction, deux ou trois idées en paragraphes, chacune illustrée par un **exemple précis** (un dispositif, une loi, une institution, un chiffre).
4. Pas de hors-sujet ni de récitation : chaque phrase doit répondre à la question.

## Seconde partie : exploiter le dossier
~ Analyser le sujet → Lire les documents → Construire un plan → Rédiger l'introduction → Développer → Conclure
1. **Analyse le sujet** : souligne les mots clés, délimite le champ (qui ? où ? quand ?), reformule la question en problématique.
2. **Lis chaque document** en notant : nature, source, date, idée principale, et le chiffre le plus parlant.
3. **Classe les informations** par idée, pas par document : un plan « document 1, document 2… » est pénalisé.
4. **Rédige** une introduction (contexte, définitions, problématique, annonce du plan), un développement en parties, une conclusion qui répond clairement à la question.

> Chaque argument suit la règle **idée → preuve tirée d'un document (citée : « document 3 ») → connaissance personnelle qui explique ou complète**.

## Lire les chiffres sans erreur
| L'outil | Le calcul | La phrase de lecture |
| **Pourcentage de répartition** | partie ÷ total × 100 | « En 2023, sur 100 personnes…, x… » |
| **Taux de variation** | (valeur d'arrivée − valeur de départ) ÷ valeur de départ × 100 | « … a augmenté de x % entre … et … » |
| **Écart en points** | différence entre deux pourcentages | « Le taux est passé de 12 % à 15 %, soit une hausse de 3 points » |
| **Coefficient multiplicateur** | valeur d'arrivée ÷ valeur de départ | « … a été multiplié par 1,5 » |

!> Ne confonds pas une hausse de 3 **points** (de 12 % à 15 %) et une hausse de 3 **%** : ici, le taux a augmenté de 25 %.

## Exemple : de la question au plan
**Sujet** : « Montrer que les dispositifs d'accès aux soins contribuent à réduire les inégalités de santé. »
- **Définitions** : inégalités sociales de santé, accès aux soins, dispositif.
- **Partie 1** : des obstacles financiers levés (PUMa, C2S, 100 % santé, tiers payant), avec un document sur le renoncement aux soins.
- **Partie 2** : des obstacles géographiques et sociaux atténués (maisons de santé, PASS, « aller vers »).
- **Partie 3** (nuance) : des limites (non-recours, déserts médicaux persistants) qui appellent d'autres politiques sur les déterminants.

## Les pièges à éviter
- Paraphraser les documents sans les expliquer ;
- Oublier les connaissances personnelles (le correcteur les attend) ;
- Oublier de **répondre** à la question en conclusion ;
- Écrire des chiffres sans unité, sans date ou sans source.`,
          },
          questions: [
            ['Combien de temps dure l’épreuve écrite de STSS ?', ['2 heures', '4 heures', '1 heure 30', '3 heures'], 3, 'Elle est notée sur 20 points.'],
            ['Combien de points vaut la partie « mobilisation des connaissances » ?', ['4', '6', '10', '14'], 1, 'Elle comprend une ou deux questions sans document.'],
            ['Combien de documents au plus comporte le dossier de la seconde partie ?', ['Cinq', 'Trois', 'Huit', 'Dix'], 0, 'Cinq documents sur cinq pages au plus.'],
            ['Quel plan est à éviter dans la seconde partie ?', ['Un plan thématique', 'Un plan document par document', 'Un plan en deux parties', 'Un plan en trois parties'], 1, 'Il faut classer les informations par idée.'],
            ['Un taux passe de 12 % à 15 %. De combien a-t-il augmenté ?', ['3 %', '15 points', '3 points, soit une hausse de 25 %', '12 %'], 2, 'L’écart est de 3 points ; (15 − 12) ÷ 12 × 100 = 25 %.'],
            ['Comment calcule-t-on un taux de variation ?', ['(départ − arrivée) ÷ arrivée × 100', 'arrivée × départ', 'arrivée ÷ 100', '(arrivée − départ) ÷ départ × 100'], 3, 'On rapporte l’évolution à la valeur de départ.'],
            ['Quelle règle suit un bon argument ?', ['Idée → preuve tirée d’un document → connaissance personnelle', 'Document → recopie → conclusion', 'Opinion → émotion → conclusion', 'Chiffre → chiffre → chiffre'], 0, 'Les connaissances expliquent et complètent les documents.'],
            ['Dans la première partie, il faut s’appuyer sur des documents fournis.', ['Vrai', 'Faux'], 1, 'Elle est sans document : on mobilise ses connaissances.'],
            ['Que doit contenir l’introduction de la seconde partie ?', ['La conclusion', 'Le contexte, les définitions, la problématique et l’annonce du plan', 'La liste des documents recopiés', 'Une opinion personnelle'], 1, 'Elle pose le cadre de la réponse.'],
            ['Quel est l’ordre conseillé pour traiter le dossier ?', ['Rédiger puis lire les documents', 'Conclure puis introduire', 'Analyser le sujet, lire les documents, construire un plan, rédiger', 'Lire uniquement le premier document'], 2, 'La réflexion précède la rédaction.'],
            ['Une grandeur passe de 40 à 60. Quel est le coefficient multiplicateur ?', ['0,5', '1,5', '2', '20'], 1, 'On divise la valeur d’arrivée par la valeur de départ : 60 ÷ 40 = 1,5, soit une hausse de 50 %.'],
            ['Que doit faire la conclusion ?', ['Ouvrir sur un sujet sans rapport', 'Recopier l’introduction', 'Lister les documents', 'Répondre clairement à la question posée'], 3, 'Une ouverture est possible, mais après la réponse.'],
          ],
        },
      ],
    },
  ],
}
