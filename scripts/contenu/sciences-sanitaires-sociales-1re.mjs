// SCIENCES ET TECHNIQUES SANITAIRES ET SOCIALES — PREMIÈRE ST2S.
//
// Programme officiel : annexe 3 de l'arrêté du 17/01/2019, BO spécial n° 1 du
// 22 janvier 2019 (« Programme de sciences et techniques sanitaires et sociales
// de première ST2S »). Pôle thématique en trois modules — Santé, bien-être et
// cohésion sociale · Protection sociale · Modes d'intervention sociale et en
// santé — et pôle méthodologique « Méthodologies appliquées au secteur
// sanitaire et social ». Chaque fiche porte en `axe` le module qui la coiffe.
// Le quatrième module (politiques de santé publique et d'action sociale) est
// celui de la terminale : voir sciences-sanitaires-sociales-tle.mjs.
//
// Matière NEUVE (slug `sciences-sanitaires-sociales`), déclarée pour les
// classes « 1re techno » et « Tle techno » : ce module range au niveau '1re'.
// Données institutionnelles vérifiées en septembre 2026 (France Travail depuis
// le 1er janvier 2024, branche autonomie gérée par la CNSA depuis 2021,
// complémentaire santé solidaire depuis novembre 2019, PUMa depuis 2016).

export default {
  slug: 'sciences-sanitaires-sociales',
  nom: 'Sciences et techniques sanitaires et sociales',

  titreMigration: 'STSS 1re ST2S — le programme officiel (16 fiches)',

  motif: `La série ST2S n'avait aucun contenu de sciences et techniques sanitaires et
sociales. Cette migration installe, pour la première, 15 fiches qui suivent les
trois modules du pôle thématique (santé, bien-être et cohésion sociale ;
protection sociale ; modes d'intervention sociale et en santé) et le pôle
méthodologique du programme officiel (BO spécial n° 1 du 22 janvier 2019), et
une fiche méthode, 12 questions chacune.`,

  blocs: [
    {
      niveaux: ['1re'],
      positionDepart: 1,
      chapitres: [
        // ──────────────── SANTÉ, BIEN-ÊTRE ET COHÉSION SOCIALE ────────────────
        {
          titre: 'Qu’est-ce que la santé ?',
          axe: 'Santé, bien-être et cohésion sociale',
          lecon: {
            titre: 'De la santé des individus à la santé de la population',
            cours: `« Être en bonne santé » ne veut pas dire la même chose pour un sportif, une personne âgée ou un médecin de santé publique. La santé est une notion **relative**, qui a changé au fil de l'histoire et qui se pense à l'échelle d'une personne comme d'une population.

## Plusieurs approches de la santé
| L'approche | Ce qu'elle dit de la santé |
| **Biomédicale** | L'absence de maladie, de lésion ou de symptôme ; la santé se constate par l'examen médical |
| **Globale** (OMS) | Un état complet de bien-être physique, mental et social |
| **Subjective** | Ce que la personne ressent : on peut se sentir bien avec une maladie chronique équilibrée |
| **Fonctionnelle** | La capacité à accomplir ses activités, à s'adapter à son environnement |

La **définition de l'Organisation mondiale de la santé** figure dans le préambule de sa Constitution, adoptée en 1946 : « La santé est un état de complet bien-être physique, mental et social, et ne consiste pas seulement en une absence de maladie ou d'infirmité. »

> Elle a élargi la santé au-delà du médical, mais on lui reproche d'être un idéal jamais atteint. La **charte d'Ottawa** (1986) y voit plutôt une **ressource** de la vie quotidienne.

## La relativité de la santé
La santé dépend :
- de la **culture** et de l'époque (la grossesse, la vieillesse, certaines conduites ont été considérées tantôt comme normales, tantôt comme des problèmes de santé) ;
- du **groupe social** (le rapport au corps et à la douleur diffère selon les milieux) ;
- de l'**âge** et des attentes de chacun.

## Santé individuelle, santé collective
| La notion | Ce qu'elle désigne | Qui s'en occupe |
| **Santé individuelle** | L'état de santé d'une personne | La personne, les soignants |
| **Santé collective** (des populations) | L'état de santé d'un groupe, mesuré par des indicateurs | Les pouvoirs publics, la santé publique |

## La santé publique
La santé publique s'intéresse à la santé des **populations**. Selon la définition classique de Winslow (1920), c'est « la science et l'art de prévenir les maladies, de prolonger la vie et de promouvoir la santé » grâce à des **efforts collectifs** organisés.

Elle combine :
1. la **mesure** de l'état de santé (épidémiologie, indicateurs) ;
2. l'identification des **problèmes** et de leurs déterminants ;
3. des **actions** collectives : prévention, promotion de la santé, organisation des soins, veille sanitaire.

## Les préoccupations de santé publique
Aujourd'hui en France : les **maladies chroniques** (cancers, maladies cardio-vasculaires, diabète), le **vieillissement** de la population, la **santé mentale**, les **inégalités sociales et territoriales** de santé, les addictions (tabac, alcool), les risques liés à l'environnement et les épidémies.

> Une question de santé devient une préoccupation publique quand elle touche beaucoup de personnes, qu'elle est grave, coûteuse, évitable, et qu'elle est **perçue** comme un problème par la société.`,
          },
          questions: [
            ['Quelle définition de la santé l’OMS a-t-elle adoptée en 1946 ?', ['L’absence de maladie', 'Un état de complet bien-être physique, mental et social', 'La capacité à travailler', 'Le silence des organes'], 1, 'Elle ne se limite pas à l’absence de maladie ou d’infirmité.'],
            ['Quelle approche définit la santé comme l’absence de maladie ou de lésion ?', ['L’approche globale', 'L’approche biomédicale', 'L’approche subjective', 'L’approche sociale'], 1, 'C’est la vision médicale classique, centrée sur la maladie.'],
            ['Que signifie la relativité de la santé ?', ['La santé est la même pour tous', 'La perception de la santé varie selon la culture, l’époque, le groupe social', 'La santé ne dépend que de la génétique', 'La santé n’existe pas'], 1, 'Ce qui est considéré comme sain change selon les sociétés et les personnes.'],
            ['La santé publique s’intéresse avant tout :', ['À un patient particulier', 'À la santé des populations', 'Aux seuls hôpitaux', 'Aux maladies rares uniquement'], 1, 'Elle mesure, analyse et agit collectivement.'],
            ['Quel document de 1986 présente la santé comme une ressource de la vie quotidienne ?', ['La Déclaration des droits de l’homme', 'La charte d’Ottawa', 'Le serment d’Hippocrate', 'Le Code de la route'], 1, 'Elle fonde la promotion de la santé.'],
            ['Une personne diabétique bien équilibrée peut se sentir en bonne santé.', ['Vrai', 'Faux'], 0, 'C’est l’approche subjective : la santé ressentie ne se confond pas avec l’absence de maladie.'],
            ['Quelle critique adresse-t-on à la définition de l’OMS ?', ['Elle est trop médicale', 'Elle décrit un idéal difficile à atteindre', 'Elle oublie le bien-être social', 'Elle ne concerne que les enfants'], 1, 'Un « complet » bien-être est rarement atteint.'],
            ['Lequel est une préoccupation actuelle de santé publique en France ?', ['La peste', 'Le vieillissement et les maladies chroniques', 'La lèpre', 'Le scorbut'], 1, 'Cancers, maladies cardio-vasculaires et diabète pèsent lourd dans la mortalité et les dépenses.'],
            ['Que désigne la santé collective ?', ['L’état de santé d’un groupe, mesuré par des indicateurs', 'La santé d’un seul patient', 'Le bien-être ressenti par une personne', 'Le budget de l’hôpital'], 0, 'On la mesure par l’espérance de vie, la mortalité, la morbidité…'],
            ['Selon Winslow, la santé publique est « la science et l’art » de :', ['Guérir chaque malade', 'Prévenir les maladies, prolonger la vie et promouvoir la santé par des efforts collectifs', 'Construire des hôpitaux', 'Former des médecins'], 1, 'L’accent est mis sur l’action organisée de la collectivité.'],
            ['Quelle approche de la santé insiste sur la capacité à accomplir ses activités ?', ['Biomédicale', 'Fonctionnelle', 'Épidémiologique', 'Juridique'], 1, 'Elle intéresse particulièrement le handicap et le vieillissement.'],
            ['Une question de santé devient une préoccupation publique seulement si elle est très coûteuse.', ['Vrai', 'Faux'], 1, 'Comptent aussi sa fréquence, sa gravité, son caractère évitable et la perception sociale.'],
          ],
        },
        {
          titre: 'Bien-être, socialisation et cohésion sociale',
          axe: 'Santé, bien-être et cohésion sociale',
          lecon: {
            titre: 'Des liens sociaux à la cohésion sociale',
            cours: `On ne naît pas membre d'une société, on le devient. Par la socialisation, chacun apprend les règles du groupe, tisse des liens et trouve sa place : c'est ce qui fait tenir une société ensemble.

## Le bien-être
Le **bien-être** est une construction **dynamique** : il associe des éléments objectifs (revenus, logement, santé, emploi) et subjectifs (satisfaction, sentiment d'être reconnu, de compter pour les autres). Il se construit et se défait tout au long de la vie.

## La socialisation
La **socialisation** est le processus par lequel une personne **intériorise** les normes et les valeurs de la société et construit son **identité sociale**.

| Le type | Le moment | Les instances |
| **Primaire** | L'enfance | **Famille**, école, pairs |
| **Secondaire** | Tout au long de la vie | Travail, associations, médias, groupes d'amis, institutions |

| La notion | La définition | Exemple |
| **Valeur** | Idéal auquel un groupe adhère | La solidarité, l'égalité |
| **Norme** | Règle de conduite qui découle des valeurs | Céder sa place à une personne âgée |
| **Fait social** | Manière d'agir ou de penser collective, qui s'impose aux individus | Le mariage, le taux de suicide |

> Les normes sociales influencent la santé : habitudes alimentaires, rapport au sport, consommation d'alcool ou de tabac sont apprises dans les groupes d'appartenance.

## Groupes sociaux et stratification
Un **groupe social** réunit des personnes qui ont des relations, des objectifs ou des caractéristiques communes et qui ont conscience d'y appartenir (famille, classe, équipe). Leur **dynamique** évolue : les membres s'influencent, des rôles se distribuent.

La **stratification sociale** est la division de la société en groupes hiérarchisés selon le revenu, le diplôme, la profession, le prestige (en France, on utilise souvent les catégories socioprofessionnelles de l'INSEE).

## Les liens sociaux
Le sociologue Serge Paugam distingue quatre types de liens, qui apportent **protection** et **reconnaissance** :

| Le lien | Il unit… |
| **De filiation** | Parents et enfants |
| **De participation élective** | Amis, couple, proches choisis |
| **De participation organique** | Les membres d'un même monde du travail, de l'école |
| **De citoyenneté** | Les membres d'une même nation, égaux en droits |

## Intégration et cohésion sociale
L'**intégration sociale** désigne la place qu'une personne occupe dans la société : elle est intégrée quand elle participe à la vie collective et partage ses normes. La **cohésion sociale** est la capacité de la société à assurer le bien-être de tous ses membres, à **réduire les disparités** et à éviter la marginalisation.

**Facteurs de cohésion** : l'emploi, l'école, la protection sociale, les services publics, la vie associative, la mixité sociale.
**Facteurs de fragilisation** : chômage, pauvreté, isolement, discriminations, ségrégation territoriale.`,
          },
          questions: [
            ['Qu’est-ce que la socialisation ?', ['L’inscription à la Sécurité sociale', 'Le processus par lequel on intériorise les normes et valeurs de la société', 'L’adhésion à un parti politique', 'Le fait de se faire des amis en ligne'], 1, 'Elle construit l’identité sociale de la personne.'],
            ['Quelle est la principale instance de socialisation primaire ?', ['L’entreprise', 'La famille', 'Le syndicat', 'Le conseil municipal'], 1, 'Pendant l’enfance, la famille transmet les premières normes.'],
            ['Quelle est la différence entre une valeur et une norme ?', ['Aucune', 'La valeur est un idéal, la norme une règle de conduite qui en découle', 'La norme est un idéal, la valeur une règle', 'La valeur est une loi écrite'], 1, 'La valeur « respect » se traduit par des normes concrètes comme dire bonjour.'],
            ['Le lien de citoyenneté unit :', ['Les parents et les enfants', 'Les amis', 'Les membres d’une même nation, égaux en droits', 'Les collègues de travail'], 2, 'C’est l’un des quatre liens distingués par Serge Paugam.'],
            ['Quel lien unit les membres d’un même monde du travail ?', ['Le lien de filiation', 'Le lien de participation élective', 'Le lien de participation organique', 'Le lien de citoyenneté'], 2, 'Il apporte reconnaissance par le travail et protection par l’emploi.'],
            ['Qu’est-ce que la cohésion sociale ?', ['L’obéissance aux lois', 'La capacité d’une société à assurer le bien-être de tous et à éviter la marginalisation', 'L’uniformité des opinions', 'La richesse d’un pays'], 1, 'Elle repose sur la réduction des disparités et la participation de tous.'],
            ['La socialisation s’arrête à la fin de l’enfance.', ['Vrai', 'Faux'], 1, 'La socialisation secondaire se poursuit toute la vie : travail, associations, médias.'],
            ['Lequel est un facteur de fragilisation de la cohésion sociale ?', ['La vie associative', 'Le chômage de longue durée', 'L’école', 'La protection sociale'], 1, 'Il affaiblit les liens de participation organique et peut conduire à l’isolement.'],
            ['Comment les normes sociales influencent-elles la santé ?', ['Elles n’ont aucun effet', 'Les habitudes de vie (alimentation, sport, tabac) sont apprises dans les groupes', 'Elles ne concernent que la politesse', 'Elles déterminent le groupe sanguin'], 1, 'Les comportements de santé sont en partie des comportements sociaux.'],
            ['Qu’est-ce que la stratification sociale ?', ['La division de la société en groupes hiérarchisés', 'L’organisation des cours au lycée', 'La géologie des sols', 'La hiérarchie des hôpitaux'], 0, 'Revenu, diplôme, profession et prestige hiérarchisent les groupes.'],
            ['Le bien-être associe des éléments objectifs et subjectifs.', ['Vrai', 'Faux'], 0, 'Revenus et logement d’une part, satisfaction et reconnaissance d’autre part.'],
            ['Quel exemple relève d’un lien de participation élective ?', ['La relation entre un père et sa fille', 'Une amitié choisie', 'Le fait d’être électeur', 'La relation entre un salarié et son entreprise'], 1, 'Ce sont les liens que l’on choisit : amis, couple, proches.'],
          ],
        },
        {
          titre: 'Mesurer l’état de santé : les indicateurs',
          axe: 'Santé, bien-être et cohésion sociale',
          lecon: {
            titre: 'Des chiffres pour connaître la santé d’une population',
            cours: `Pour savoir si une population est en bonne santé, si elle va mieux qu'hier ou moins bien que sa voisine, il faut la **mesurer**. C'est le rôle des **indicateurs**, et de l'**épidémiologie**, qui étudie la fréquence et la répartition des problèmes de santé.

## Qu'est-ce qu'un indicateur ?
Un **indicateur** est une donnée chiffrée, construite selon une méthode stable, qui renseigne sur un phénomène et permet des **comparaisons** dans le temps et dans l'espace. Il s'exprime le plus souvent en **taux** (pour 100, pour 1 000, pour 100 000) pour tenir compte de la taille de la population.

## Les indicateurs démographiques et de mortalité
| L'indicateur | Son calcul |
| **Taux brut de natalité** | Naissances vivantes de l'année / population moyenne × 1 000 |
| **Taux brut de mortalité** | Décès de l'année / population moyenne × 1 000 |
| **Taux de mortalité infantile** | Décès d'enfants de moins d'un an / naissances vivantes × 1 000 |
| **Taux de mortalité prématurée** | Décès avant 65 ans rapportés à la population de moins de 65 ans |
| **Espérance de vie à la naissance** | Nombre moyen d'années que vivrait une génération soumise toute sa vie aux conditions de mortalité de l'année |

En France, au milieu des années 2020, l'espérance de vie à la naissance est d'environ 85 ans et demi pour les femmes et 80 ans pour les hommes ; la mortalité infantile est d'environ 4 ‰.

## Les indicateurs de morbidité
La **morbidité** désigne les maladies présentes dans une population.

| L'indicateur | Ce qu'il mesure |
| **Incidence** | Nombre de **nouveaux cas** apparus pendant une période donnée |
| **Prévalence** | Nombre de cas **existants** à un moment donné (anciens et nouveaux) |

> Une maladie chronique qu'on sait soigner sans guérir (diabète) a une prévalence qui augmente même si son incidence est stable : on vit plus longtemps avec elle.

## Les indicateurs composites
Un indicateur **composite** combine plusieurs dimensions :
- l'**espérance de vie sans incapacité** (EVSI) : les années que l'on peut espérer vivre sans être limité dans ses activités ; elle associe mortalité et santé fonctionnelle ;
- l'**indice de développement humain** (IDH) : santé (espérance de vie), éducation et niveau de vie.

## Comparer avec prudence
Le **taux brut de mortalité** dépend de la structure par âge : une population âgée a un taux brut élevé même si elle est en bonne santé. Pour comparer deux territoires, on utilise un **taux standardisé** (comparatif), calculé comme si les deux populations avaient la même structure par âge.

## Les producteurs de données
| Le producteur | Ce qu'il fournit |
| **INSEE** | Démographie : naissances, décès, espérance de vie |
| **DREES** (ministère) | Santé, protection sociale, établissements |
| **Santé publique France** | Surveillance épidémiologique, alertes |
| **Inserm (CépiDc)** | Causes médicales de décès |
| **Observatoires régionaux de santé** | Données par région et territoire |
| **OMS, Eurostat** | Comparaisons internationales |

> Un indicateur ne dit jamais tout : il faut en croiser plusieurs, connaître sa source et sa méthode, et se demander ce qu'il ne mesure pas.`,
          },
          questions: [
            ['Comment calcule-t-on le taux de mortalité infantile ?', ['Décès de moins d’un an / population totale × 1 000', 'Décès de moins d’un an / naissances vivantes × 1 000', 'Naissances / décès × 100', 'Décès avant 65 ans / population × 1 000'], 1, 'On rapporte les décès d’enfants de moins d’un an aux naissances vivantes de l’année.'],
            ['Qu’est-ce que l’incidence d’une maladie ?', ['Le nombre de cas existants à un moment donné', 'Le nombre de nouveaux cas apparus pendant une période', 'Le nombre de décès dus à la maladie', 'Le coût de la maladie'], 1, 'La prévalence, elle, compte tous les cas existants.'],
            ['Pourquoi la prévalence du diabète augmente-t-elle même à incidence stable ?', ['Parce qu’on en guérit plus vite', 'Parce que les malades vivent plus longtemps avec la maladie', 'Parce que les tests sont faux', 'Parce que la population diminue'], 1, 'Les cas s’accumulent : on les soigne sans les guérir.'],
            ['Quelle est l’espérance de vie à la naissance des femmes en France au milieu des années 2020, environ ?', ['75 ans', '80 ans', '85 ans et demi', '95 ans'], 2, 'Celle des hommes est d’environ 80 ans.'],
            ['Qu’est-ce qu’un indicateur composite ?', ['Un indicateur qui combine plusieurs dimensions', 'Un indicateur faux', 'Un taux pour 1 000', 'Une donnée brute sans calcul'], 0, 'L’IDH combine santé, éducation et niveau de vie.'],
            ['Que mesure l’espérance de vie sans incapacité ?', ['Le nombre d’années vécues à l’hôpital', 'Les années que l’on peut espérer vivre sans limitation dans ses activités', 'L’espérance de vie des personnes handicapées', 'L’âge moyen de la retraite'], 1, 'Elle associe durée de vie et qualité de vie.'],
            ['Pourquoi utilise-t-on un taux standardisé pour comparer deux régions ?', ['Pour gonfler les chiffres', 'Pour neutraliser l’effet des différences de structure par âge', 'Parce que le taux brut est interdit', 'Pour compter les naissances'], 1, 'Une région âgée aurait sinon toujours une mortalité plus élevée.'],
            ['Quel organisme produit les données démographiques officielles en France ?', ['L’INSEE', 'L’Urssaf', 'La CAF', 'L’Unédic'], 0, 'Naissances, décès, espérance de vie : l’INSEE publie chaque année un bilan démographique.'],
            ['Santé publique France assure la surveillance épidémiologique.', ['Vrai', 'Faux'], 0, 'Elle suit les épidémies, lance les alertes et diffuse les données.'],
            ['Que désigne la morbidité ?', ['Le nombre de décès', 'Les maladies présentes dans une population', 'La natalité', 'Le nombre de médecins'], 1, 'Elle se mesure par l’incidence et la prévalence.'],
            ['À quel âge fixe-t-on en France le seuil de la mortalité prématurée ?', ['1 an', '18 ans', '65 ans', '85 ans'], 2, 'Une grande part de ces décès est considérée comme évitable.'],
            ['Un seul indicateur suffit à décrire l’état de santé d’une population.', ['Vrai', 'Faux'], 1, 'Chaque indicateur éclaire une dimension : il faut les croiser.'],
          ],
        },
        {
          titre: 'Inégalités sociales et territoriales de santé et de bien-être',
          axe: 'Santé, bien-être et cohésion sociale',
          lecon: {
            titre: 'Contrastes, disparités et gradient social',
            cours: `En France, un homme parmi les 5 % les plus aisés vit en moyenne environ 13 ans de plus qu'un homme parmi les 5 % les plus modestes. Les indicateurs ne décrivent pas seulement une population : ils révèlent des **inégalités**.

## Disparité ou inégalité ?
| La notion | Le sens |
| **Disparité** | Une différence constatée entre groupes ou territoires (par exemple entre hommes et femmes) |
| **Inégalité** | Une différence **socialement construite**, qui désavantage systématiquement certains groupes et que l'on pourrait réduire : elle est jugée **injuste** |

## Le gradient social de santé
Les inégalités de santé ne séparent pas seulement les plus pauvres du reste de la population : l'état de santé s'améliore **à chaque échelon** de la hiérarchie sociale. C'est le **gradient social** de santé.

| L'indicateur | Ce que montrent les données françaises |
| **Espérance de vie** | Écart d'environ 13 ans chez les hommes entre les 5 % les plus aisés et les 5 % les plus modestes (INSEE) |
| **Espérance de vie à 35 ans** | Plus élevée chez les cadres que chez les ouvriers |
| **Maladies chroniques**, obésité, santé bucco-dentaire | Plus fréquentes dans les milieux modestes |
| **Renoncement aux soins** | Plus fréquent chez les personnes à faibles revenus |

## Les inégalités territoriales
L'état de santé varie selon les **territoires** : régions du Nord et du Nord-Est à la mortalité plus élevée, outre-mer (mortalité infantile plus forte), quartiers prioritaires de la politique de la ville, zones rurales isolées. Les **déserts médicaux** (manque de médecins accessibles) accentuent ces écarts.

## Mesurer le bien-être et la cohésion sociale
| L'indicateur | Sa définition |
| **Taux de pauvreté monétaire** | Part de la population vivant sous le **seuil de pauvreté**, fixé à **60 % du niveau de vie médian** |
| **Niveau de vie médian** | Niveau de vie qui partage la population en deux moitiés |
| **Taux de chômage** | Part des chômeurs dans la population active |
| **Rapport interdécile** D9/D1 | Combien de fois le niveau de vie plancher des 10 % les plus aisés dépasse le niveau de vie plafond des 10 % les plus modestes |
| **Taux de privation matérielle et sociale** | Part des personnes qui ne peuvent pas s'offrir plusieurs éléments de la vie courante (chauffage, repas, vacances) |

D'après l'INSEE, le taux de pauvreté monétaire concerne environ **15 % de la population**, soit plus de 9 millions de personnes, au milieu des années 2020.

## Porter un regard critique
1. **La source** : qui produit l'indicateur, avec quelle méthode ?
2. **La définition** : la pauvreté « monétaire » ignore le patrimoine, les aides en nature, le ressenti.
3. **La comparaison** : les définitions sont-elles les mêmes d'un pays ou d'une année à l'autre ?
4. **La complémentarité** : pour décrire la pauvreté, on croise pauvreté monétaire, privation matérielle et pauvreté ressentie.

> Un bon diagnostic combine plusieurs indicateurs, montre les écarts entre groupes et entre territoires, et cherche leurs causes.`,
          },
          questions: [
            ['Qu’est-ce qu’une inégalité sociale de santé ?', ['Toute différence biologique entre personnes', 'Une différence de santé socialement construite, systématique et évitable', 'Une maladie génétique', 'Une différence de taille'], 1, 'Elle est jugée injuste parce qu’elle pourrait être réduite.'],
            ['Que désigne le gradient social de santé ?', ['Seuls les plus pauvres sont en mauvaise santé', 'L’état de santé s’améliore à chaque échelon de la hiérarchie sociale', 'La santé ne dépend pas du milieu social', 'Les riches sont toujours malades'], 1, 'Chaque catégorie a une santé meilleure que celle qui est juste en dessous.'],
            ['Où est fixé le seuil de pauvreté monétaire en France ?', ['À 50 % du revenu moyen', 'À 60 % du niveau de vie médian', 'Au SMIC', 'Au RSA'], 1, 'C’est la convention retenue par l’INSEE et Eurostat.'],
            ['Quel est l’écart d’espérance de vie entre les 5 % d’hommes les plus aisés et les 5 % les plus modestes ?', ['Environ 2 ans', 'Environ 13 ans', 'Environ 30 ans', 'Aucun écart'], 1, 'C’est l’une des mesures les plus frappantes du gradient social.'],
            ['Qu’est-ce que le niveau de vie médian ?', ['La moyenne des revenus', 'Le niveau de vie qui partage la population en deux moitiés', 'Le revenu minimum légal', 'Le revenu des 10 % les plus riches'], 1, 'La moitié de la population a un niveau de vie inférieur, l’autre moitié supérieur.'],
            ['Quelle part de la population française vit sous le seuil de pauvreté monétaire, environ ?', ['2 %', '15 %', '40 %', '60 %'], 1, 'Plus de 9 millions de personnes, selon l’INSEE.'],
            ['Qu’est-ce qu’un désert médical ?', ['Une région sans hôpital militaire', 'Un territoire où l’accès aux médecins est insuffisant', 'Une zone sans pharmacie de garde uniquement', 'Un hôpital sans patient'], 1, 'Il accentue les inégalités territoriales de santé.'],
            ['Une disparité est toujours une inégalité.', ['Vrai', 'Faux'], 1, 'Une disparité est une différence constatée ; elle devient inégalité quand elle est socialement construite et injuste.'],
            ['Que mesure le rapport interdécile D9/D1 ?', ['Le taux de chômage', 'L’écart entre les niveaux de vie des plus aisés et des plus modestes', 'La mortalité infantile', 'Le nombre de médecins'], 1, 'Plus il est élevé, plus les niveaux de vie sont inégaux.'],
            ['Pourquoi le taux de pauvreté monétaire doit-il être complété par d’autres indicateurs ?', ['Parce qu’il est illégal', 'Parce qu’il ignore le patrimoine, les aides en nature et le ressenti', 'Parce qu’il ne concerne que les enfants', 'Parce qu’il est toujours faux'], 1, 'On le croise avec la privation matérielle et sociale.'],
            ['Le renoncement aux soins est plus fréquent chez les personnes à faibles revenus.', ['Vrai', 'Faux'], 0, 'Le coût, la distance et le manque d’information freinent l’accès aux soins.'],
            ['Quel indicateur mesure la part des personnes qui ne peuvent s’offrir des éléments de la vie courante ?', ['Le taux de natalité', 'Le taux de privation matérielle et sociale', 'Le PIB', 'L’IMC'], 1, 'Il complète la mesure monétaire de la pauvreté.'],
          ],
        },
        {
          titre: 'Les déterminants de la santé',
          axe: 'Santé, bien-être et cohésion sociale',
          lecon: {
            titre: 'Une articulation de facteurs',
            cours: `Pourquoi une personne tombe-t-elle malade et pas une autre ? Les gènes et le système de soins n'expliquent qu'une partie de la réponse. L'état de santé résulte d'une **articulation de déterminants** individuels, sociaux et environnementaux.

## Déterminant, facteur de risque, facteur de protection
| La notion | La définition | Exemple |
| **Déterminant de santé** | Facteur qui influence l'état de santé, positivement ou négativement | Le revenu, le logement |
| **Facteur de risque** | Élément qui **augmente** la probabilité d'une maladie | Le tabac pour le cancer du poumon |
| **Facteur de protection** | Élément qui la **diminue** | L'activité physique pour les maladies cardio-vasculaires |

## Le modèle de Lalonde (1974)
Le rapport du ministre canadien Marc Lalonde regroupe les déterminants en **quatre champs** :
1. la **biologie humaine** (hérédité, âge, sexe) ;
2. l'**environnement** (physique et social) ;
3. les **habitudes de vie** (alimentation, tabac, alcool, activité physique) ;
4. l'**organisation des soins** de santé.

> Il a montré que l'essentiel des dépenses allait aux soins, alors que les autres champs pèsent davantage sur la santé.

## Le modèle de Dahlgren et Whitehead (1991)
Ce modèle « arc-en-ciel » représente les déterminants en **couches** autour de l'individu :

| La couche | Les déterminants |
| **Centre** | Âge, sexe, facteurs héréditaires (non modifiables) |
| **Mode de vie personnel** | Alimentation, tabac, alcool, activité physique |
| **Réseaux sociaux et communautaires** | Famille, amis, voisinage, soutien social |
| **Conditions de vie et de travail** | Éducation, emploi, conditions de travail, logement, eau et assainissement, alimentation disponible, services de santé |
| **Conditions socio-économiques, culturelles et environnementales générales** | Contexte économique, politique, culturel, environnement |

## Les déterminants sociaux et environnementaux
Les **déterminants sociaux** (revenu, diplôme, emploi, logement, conditions de travail, soutien social) expliquent en grande partie le **gradient social** de santé. Les **déterminants environnementaux** (qualité de l'air, bruit, habitat insalubre, pollution des sols et de l'eau) pèsent aussi : la pollution de l'air aux particules fines est responsable de dizaines de milliers de décès prématurés par an en France selon Santé publique France.

## Des déterminants qui interagissent
Les déterminants ne s'additionnent pas simplement : ils **se renforcent**.

Exemple travaillé, l'obésité :
- un **faible revenu** limite l'accès aux fruits et légumes ;
- un logement dans un quartier sans espaces verts ni équipements sportifs réduit l'**activité physique** ;
- des horaires de travail décalés perturbent l'alimentation et le sommeil ;
- une moindre **éducation à la santé** rend les messages de prévention moins accessibles.

> Agir sur un seul déterminant (conseiller de manger mieux) a peu d'effet si l'on n'agit pas aussi sur les conditions de vie. C'est tout l'enjeu de la promotion de la santé.`,
          },
          questions: [
            ['Qu’est-ce qu’un déterminant de santé ?', ['Un médicament', 'Un facteur qui influence l’état de santé', 'Un professionnel de santé', 'Une maladie'], 1, 'Il peut agir positivement ou négativement.'],
            ['Lequel est un facteur de protection ?', ['Le tabagisme', 'L’activité physique régulière', 'La sédentarité', 'La pollution de l’air'], 1, 'Elle diminue le risque de maladies cardio-vasculaires, de diabète, de certains cancers.'],
            ['Combien de champs de déterminants distingue le modèle de Lalonde ?', ['2', '3', '4', '6'], 2, 'Biologie humaine, environnement, habitudes de vie et organisation des soins.'],
            ['Dans le modèle de Dahlgren et Whitehead, que trouve-t-on au centre ?', ['Le système de soins', 'L’âge, le sexe et les facteurs héréditaires', 'Le contexte économique général', 'Le logement'], 1, 'Ce sont les déterminants non modifiables.'],
            ['Lequel est un déterminant social de santé ?', ['Le groupe sanguin', 'Le niveau de diplôme', 'La couleur des yeux', 'L’âge'], 1, 'Le diplôme influence l’emploi, le revenu et les comportements de santé.'],
            ['Que montre le rapport Lalonde de 1974 ?', ['Que les soins expliquent toute la santé', 'Que l’essentiel des dépenses va aux soins alors que d’autres champs pèsent davantage', 'Que la génétique ne compte pas', 'Que la santé est un droit'], 1, 'Il a encouragé la prévention et l’action sur les modes de vie.'],
            ['La pollution de l’air est un déterminant environnemental de santé.', ['Vrai', 'Faux'], 0, 'Les particules fines provoquent chaque année de nombreux décès prématurés.'],
            ['Dans quelle couche du modèle arc-en-ciel se trouve le soutien de la famille et des amis ?', ['Le mode de vie personnel', 'Les réseaux sociaux et communautaires', 'Le centre', 'Les conditions générales'], 1, 'Le soutien social protège la santé, en particulier la santé mentale.'],
            ['Pourquoi dit-on que les déterminants interagissent ?', ['Parce qu’ils sont indépendants', 'Parce qu’ils se renforcent : faible revenu, logement, travail et comportements se combinent', 'Parce qu’un seul suffit à tout expliquer', 'Parce qu’ils changent chaque jour'], 1, 'Agir sur un seul déterminant a donc un effet limité.'],
            ['Un facteur de risque rend la maladie certaine.', ['Vrai', 'Faux'], 1, 'Il en augmente seulement la probabilité.'],
            ['Lequel est un déterminant non modifiable ?', ['Le tabagisme', 'L’âge', 'Le logement', 'L’alimentation'], 1, 'On ne peut agir ni sur l’âge, ni sur le sexe, ni sur l’hérédité.'],
            ['Dans quelle couche du modèle arc-en-ciel classer les conditions de travail ?', ['Le centre', 'Le mode de vie personnel', 'Les conditions de vie et de travail', 'Les réseaux sociaux'], 2, 'Avec l’éducation, l’emploi, le logement et l’accès aux services.'],
          ],
        },
        {
          titre: 'L’émergence d’un problème de santé publique',
          axe: 'Santé, bien-être et cohésion sociale',
          lecon: {
            titre: 'De la préoccupation à la crise sanitaire',
            cours: `Certaines questions de santé restent longtemps invisibles, puis deviennent soudain une affaire nationale. La reconnaissance d'un problème de santé publique n'est pas seulement médicale : elle est aussi **sociale** et **politique**.

## Les notions clés
| La notion | La définition |
| **Préoccupation** | Question de santé qui inquiète une partie de la population ou des professionnels |
| **Risque** | Probabilité qu'un danger provoque un dommage |
| **Risque sanitaire** | Risque qui menace la santé d'une population (produit, épidémie, environnement) |
| **Alerte sanitaire** | Signal, repéré par la veille, qui annonce une menace et appelle une réaction rapide |
| **Crise sanitaire** | Situation où un événement de santé dépasse les capacités habituelles de réponse, avec une forte dimension médiatique et politique |
| **Problème de santé publique** | Question de santé reconnue par la collectivité comme appelant une action publique |

## Les critères de reconnaissance
Un problème de santé est reconnu comme problème de santé publique quand plusieurs critères se combinent :
1. **l'ampleur** : il touche beaucoup de personnes (incidence, prévalence) ;
2. **la gravité** : décès, handicaps, souffrances ;
3. **le coût** pour la société ;
4. **la possibilité d'agir** : il est évitable ou traitable ;
5. **la perception sociale** : il est jugé inacceptable par l'opinion.

## La place de l'épidémiologie
L'**épidémiologie** étudie la fréquence des maladies, leur répartition et leurs facteurs. Elle **objective** le problème : elle mesure, repère un excès de cas, identifie des facteurs de risque. Mais elle ne suffit pas : un problème bien mesuré peut rester ignoré tant qu'il n'est pas porté par des **acteurs**.

## Les dimensions sociales
Des acteurs font émerger le problème : **associations de patients** et de victimes, professionnels de santé, chercheurs, **médias**, lanceurs d'alerte, élus. Leur mobilisation met la question à l'**agenda politique**.

## Des exemples
| L'événement | Ce qu'il a changé |
| **Affaire du sang contaminé** (années 1980) : des hémophiles et transfusés contaminés par le VIH | Naissance de la **sécurité sanitaire** moderne, agences indépendantes |
| **Canicule d'août 2003** : environ 15 000 décès en excès, surtout de personnes âgées isolées | Plan canicule, registres des personnes vulnérables, journée de solidarité |
| **Affaire du Mediator** (révélée en 2009-2010), grâce à la pneumologue Irène Frachon | Loi de 2011 sur la sécurité du médicament, création de l'**ANSM** |
| **Covid-19** (à partir de 2020) | Crise sanitaire mondiale : confinements, vaccination de masse, renforcement de la veille |

## Les composantes d'une crise sanitaire
Une crise associe un **événement sanitaire** (épidémie, accident, produit dangereux), une **incertitude** scientifique, une **pression médiatique**, une **mise en cause** des autorités et des décisions à prendre dans l'**urgence**.

> Chaque crise laisse une trace : de nouvelles lois, de nouvelles agences, de nouveaux dispositifs de veille.`,
          },
          questions: [
            ['Qu’est-ce qu’une alerte sanitaire ?', ['Un bilan annuel de santé', 'Un signal annonçant une menace et appelant une réaction rapide', 'Une campagne de publicité', 'Une loi de santé'], 1, 'Elle est repérée par les systèmes de veille, comme Santé publique France.'],
            ['Lequel n’est pas un critère de reconnaissance d’un problème de santé publique ?', ['L’ampleur', 'La gravité', 'La couleur du logo de la campagne', 'La perception sociale'], 2, 'Ampleur, gravité, coût, possibilité d’agir et perception sociale comptent.'],
            ['Quel rôle joue l’épidémiologie dans la reconnaissance d’un problème ?', ['Elle le rend invisible', 'Elle objective le problème en mesurant fréquence et facteurs de risque', 'Elle vote les lois', 'Elle soigne les malades'], 1, 'Mais la mesure seule ne suffit pas : il faut des acteurs pour porter le problème.'],
            ['Combien de décès en excès la canicule d’août 2003 a-t-elle provoqués en France, environ ?', ['150', '1 500', '15 000', '150 000'], 2, 'Elle a conduit à créer le plan canicule.'],
            ['Quelle agence est née de l’affaire du Mediator ?', ['L’ANSM', 'La CAF', 'L’INSEE', 'France Travail'], 0, 'L’Agence nationale de sécurité du médicament et des produits de santé a été créée par la loi de 2011.'],
            ['Quelle affaire des années 1980 est à l’origine de la sécurité sanitaire moderne ?', ['La canicule', 'Le sang contaminé', 'Le Covid-19', 'La vache folle uniquement'], 1, 'Des hémophiles et transfusés ont été contaminés par le VIH.'],
            ['Un problème de santé bien mesuré est toujours reconnu immédiatement par la collectivité.', ['Vrai', 'Faux'], 1, 'Il faut qu’il soit porté par des acteurs et mis à l’agenda politique.'],
            ['Qui a joué un rôle de lanceuse d’alerte dans l’affaire du Mediator ?', ['Simone Veil', 'Irène Frachon', 'Marie Curie', 'Olympe de Gouges'], 1, 'Cette pneumologue a documenté les atteintes des valves cardiaques.'],
            ['Qu’est-ce qu’un risque ?', ['Un dommage certain', 'La probabilité qu’un danger provoque un dommage', 'Une maladie contagieuse', 'Un médicament'], 1, 'Le danger est la source ; le risque, la probabilité qu’elle nuise.'],
            ['Laquelle est une composante d’une crise sanitaire ?', ['L’absence de médias', 'L’incertitude scientifique et la pression médiatique', 'Une situation parfaitement maîtrisée', 'L’absence de décision'], 1, 'S’y ajoutent l’urgence et la mise en cause des autorités.'],
            ['Quels acteurs peuvent faire émerger un problème de santé ?', ['Uniquement le gouvernement', 'Associations, médecins, chercheurs, médias, élus', 'Uniquement les médecins', 'Personne : il émerge seul'], 1, 'Leur mobilisation met la question à l’agenda.'],
            ['Chaque crise sanitaire laisse souvent de nouvelles lois ou de nouvelles agences.', ['Vrai', 'Faux'], 0, 'Sang contaminé, canicule, Mediator : chaque crise a transformé le système.'],
          ],
        },
        {
          titre: 'Précarité, pauvreté, exclusion : l’émergence d’un problème social',
          axe: 'Santé, bien-être et cohésion sociale',
          lecon: {
            titre: 'Des inégalités multiples aux ruptures',
            cours: `Le sans-abrisme, le mal-logement, l'isolement des personnes âgées : ces situations existent souvent depuis longtemps avant d'être reconnues comme des **problèmes sociaux** appelant une action de la collectivité.

## Trois notions à distinguer
| La notion | La définition |
| **Précarité** | L'**absence d'une ou plusieurs sécurités** (emploi, revenu, logement, santé) qui permettent d'assumer ses responsabilités et de jouir de ses droits. Selon Joseph Wresinski (1987), elle peut conduire à la grande pauvreté quand elle touche plusieurs domaines, devient durable et compromet les chances de reconquérir ses droits |
| **Pauvreté** | L'insuffisance de **ressources** ; la pauvreté **monétaire** désigne un niveau de vie inférieur à 60 % du niveau de vie médian |
| **Exclusion** | La **rupture des liens sociaux** et la mise à l'écart de la vie sociale (emploi, logement, relations, citoyenneté) |

> La précarité est une **fragilité**, la pauvreté un **manque**, l'exclusion une **rupture**.

## L'exclusion est un processus
On ne devient pas exclu d'un coup : l'exclusion résulte d'un **enchaînement de ruptures** (perte d'emploi, séparation, perte du logement, maladie, isolement) qui s'alimentent entre elles.

Le sociologue Robert Castel décrit un continuum entre trois zones :
| La zone | La situation |
| **Intégration** | Emploi stable et liens solides |
| **Vulnérabilité** | Emploi précaire, liens fragiles |
| **Désaffiliation** | Absence de travail et isolement social |

Serge Paugam parle de **disqualification sociale** : le parcours mène de la **fragilité** à la **dépendance** envers les aides, puis à la **rupture**.

## Des inégalités multiples qui fragilisent la cohésion
Les inégalités de revenus, de patrimoine, d'éducation, de logement, de santé et les **inégalités territoriales** (quartiers relégués, zones rurales isolées) se cumulent. Quand une partie de la population ne peut plus participer à la vie commune, la **cohésion sociale** est fragilisée.

## Comment un problème social est-il reconnu ?
Une situation devient un **problème social** quand elle est jugée **anormale** et **inacceptable** et qu'on attend de la collectivité qu'elle agisse.

1. **Une situation objective** : des personnes vivent à la rue, des familles sont mal logées.
2. **Une mobilisation** : associations (l'appel de l'abbé Pierre en 1954, les Restos du cœur fondés en 1985), travailleurs sociaux, chercheurs, médias, citoyens.
3. **Une mise à l'agenda** : les pouvoirs publics s'en saisissent.
4. **Une réponse** : loi, dispositif, prestation.

| L'exemple | La réponse publique |
| Grande pauvreté, rapport Wresinski (1987) | Revenu minimum d'insertion (**RMI**) en 1988, devenu **RSA** en 2009 |
| Montée de l'exclusion dans les années 1990 | **Loi d'orientation relative à la lutte contre les exclusions** (1998) |
| Mal-logement, mobilisation des associations (2006-2007) | **Droit au logement opposable** (DALO, 2007) |

> Un problème social est donc une **construction** : il suppose une situation réelle, des acteurs qui la dénoncent et une collectivité qui la reconnaît.`,
          },
          questions: [
            ['Comment définit-on la précarité selon Joseph Wresinski ?', ['L’absence d’une ou plusieurs sécurités permettant d’assumer ses responsabilités et de jouir de ses droits', 'Le fait de vivre sous le seuil de pauvreté', 'La rupture totale des liens sociaux', 'Le fait d’être au chômage'], 0, 'Cumulée et durable, elle peut conduire à la grande pauvreté.'],
            ['Qu’est-ce que l’exclusion ?', ['Un revenu faible', 'La rupture des liens sociaux et la mise à l’écart de la vie sociale', 'Un contrat de travail court', 'Un déménagement'], 1, 'La précarité est une fragilité, la pauvreté un manque, l’exclusion une rupture.'],
            ['Pourquoi dit-on que l’exclusion est un processus ?', ['Parce qu’elle arrive d’un coup', 'Parce qu’elle résulte d’un enchaînement de ruptures qui s’alimentent', 'Parce qu’elle est décidée par un juge', 'Parce qu’elle ne dure jamais'], 1, 'Perte d’emploi, séparation, perte du logement, isolement peuvent s’enchaîner.'],
            ['Quelles sont les trois zones décrites par Robert Castel ?', ['Riche, moyenne, pauvre', 'Intégration, vulnérabilité, désaffiliation', 'Ville, banlieue, campagne', 'Enfance, âge adulte, vieillesse'], 1, 'Elles combinent la situation d’emploi et la solidité des liens.'],
            ['Quelle prestation a remplacé le RMI en 2009 ?', ['L’APA', 'Le RSA', 'La PCH', 'L’ASPA'], 1, 'Le revenu de solidarité active.'],
            ['En quelle année le RMI a-t-il été créé ?', ['1945', '1988', '2009', '2016'], 1, 'Il faisait suite au rapport Wresinski sur la grande pauvreté.'],
            ['Quelle loi de 2007 reconnaît un droit au logement pouvant être invoqué en justice ?', ['La loi DALO', 'La loi Veil', 'La loi Kouchner', 'La loi Evin'], 0, 'Le droit au logement opposable, obtenu après la mobilisation des associations.'],
            ['Un problème social existe dès qu’une situation difficile existe, même si personne ne la dénonce.', ['Vrai', 'Faux'], 1, 'Il faut une mobilisation et une reconnaissance par la collectivité.'],
            ['Quel sociologue parle de « disqualification sociale » ?', ['Émile Durkheim', 'Serge Paugam', 'Pierre Laroque', 'Marc Lalonde'], 1, 'Il décrit un parcours de la fragilité à la dépendance puis à la rupture.'],
            ['Quelle association a été fondée par Coluche en 1985 ?', ['Emmaüs', 'Les Restos du cœur', 'ATD Quart Monde', 'La Croix-Rouge'], 1, 'Elle a contribué à rendre visible la pauvreté alimentaire.'],
            ['En quelle année la loi d’orientation relative à la lutte contre les exclusions a-t-elle été votée ?', ['1975', '1988', '1998', '2016'], 2, 'Elle affirme l’accès de tous aux droits fondamentaux.'],
            ['Les inégalités territoriales peuvent fragiliser la cohésion sociale.', ['Vrai', 'Faux'], 0, 'Quartiers relégués et zones rurales isolées cumulent souvent les difficultés.'],
          ],
        },
        // ──────────────────────── PROTECTION SOCIALE ────────────────────────
        {
          titre: 'Du risque social à la protection sociale',
          axe: 'Protection sociale',
          lecon: {
            titre: 'Un projet de société, construit dans l’histoire',
            cours: `Tomber malade, perdre son emploi, vieillir, élever des enfants : ces événements réduisent les revenus ou augmentent les dépenses. La **protection sociale** organise la solidarité pour y faire face ; elle participe à l'**accès aux droits** de chacun.

## Les risques sociaux
Un **risque social** est un événement qui peut entraîner une **baisse de revenus** ou une **hausse des dépenses** pour une personne ou une famille.

| Le risque | Exemples de prestations |
| **Santé** : maladie, maternité, invalidité, accident du travail et maladie professionnelle | Remboursement des soins, indemnités journalières, pension d'invalidité |
| **Vieillesse et survie** | Pensions de retraite, pension de réversion |
| **Famille** | Allocations familiales, prestations d'accueil du jeune enfant |
| **Emploi** | Allocation chômage, aide à la formation |
| **Logement** | Aides personnelles au logement |
| **Pauvreté, exclusion** | RSA, minima sociaux |
| **Perte d'autonomie** | APA (personnes âgées), PCH (handicap) |

## Protection individuelle et collective
Avant l'État-providence, on se protégeait par la **prévoyance individuelle** (épargne, assurance privée), la **famille** ou la **charité**. La protection **collective** repose sur la **solidarité** organisée : chacun contribue selon ses moyens et reçoit selon ses besoins ou ses droits.

## Deux modèles historiques
| Le modèle | Son origine | Ses principes |
| **Bismarckien** (assurance) | Allemagne, années 1880 | Protection liée au **travail**, financée par des **cotisations** sur les salaires, prestations proportionnelles aux revenus, gérée par les partenaires sociaux |
| **Beveridgien** (universel) | Royaume-Uni, rapport Beveridge de 1942 | Protection de **tous les citoyens**, financée par l'**impôt**, prestations **uniformes**, gérée par l'État ; les « trois U » : universalité, uniformité, unicité |

Le système français est **mixte** : d'origine bismarckienne, il a intégré des éléments beveridgiens (universalité, financement par l'impôt).

## Les grandes étapes en France
@ 1898 — Loi sur les accidents du travail : l'employeur est responsable
@ 1928-1930 — Lois sur les assurances sociales pour les salariés modestes
@ 1945 — Ordonnances des 4 et 19 octobre : création de la **Sécurité sociale** (Pierre Laroque, Ambroise Croizat)
@ 1958 — Création de l'assurance chômage (Unédic)
@ 1988 — Revenu minimum d'insertion (RMI)
@ 1991 — Création de la contribution sociale généralisée (CSG)
@ 1999 — Couverture maladie universelle (CMU), en vigueur en 2000
@ 2009 — Revenu de solidarité active (RSA)
@ 2016 — Protection universelle maladie (PUMa)
@ 2021 — Cinquième branche de la Sécurité sociale : l'autonomie

## Les droits sociaux
Les **droits sociaux** (droit à la santé, à la protection, au travail, au logement) sont inscrits dans le **Préambule de la Constitution de 1946** : la Nation « garantit à tous, notamment à l'enfant, à la mère et aux vieux travailleurs, la protection de la santé, la sécurité matérielle, le repos et les loisirs ». Encore faut-il y **accéder** : le **non-recours** (ne pas demander une aide à laquelle on a droit, par méconnaissance, complexité ou crainte d'être stigmatisé) touche une part importante des ayants droit, par exemple au RSA.`,
          },
          questions: [
            ['Qu’est-ce qu’un risque social ?', ['Un danger pour l’environnement', 'Un événement qui peut réduire les revenus ou augmenter les dépenses', 'Une maladie contagieuse uniquement', 'Un risque financier en Bourse'], 1, 'Maladie, vieillesse, chômage, charges de famille en sont des exemples.'],
            ['Quel est le principe du modèle bismarckien ?', ['Une protection financée par l’impôt pour tous les citoyens', 'Une protection liée au travail, financée par des cotisations', 'Une protection uniquement privée', 'L’absence de protection'], 1, 'Né en Allemagne dans les années 1880, c’est une logique d’assurance.'],
            ['Que désignent les « trois U » de Beveridge ?', ['Utilité, unité, urgence', 'Universalité, uniformité, unicité', 'Union, usage, usure', 'Urbanisme, université, usine'], 1, 'Tous couverts, prestations identiques, une seule organisation.'],
            ['En quelle année la Sécurité sociale a-t-elle été créée en France ?', ['1898', '1945', '1968', '1988'], 1, 'Par les ordonnances des 4 et 19 octobre 1945.'],
            ['Quelle est la cinquième branche de la Sécurité sociale, créée en 2021 ?', ['La branche chômage', 'La branche autonomie', 'La branche logement', 'La branche éducation'], 1, 'Elle couvre la perte d’autonomie des personnes âgées et handicapées.'],
            ['Le système français de protection sociale est :', ['Purement bismarckien', 'Purement beveridgien', 'Mixte', 'Entièrement privé'], 2, 'D’origine assurantielle, il a intégré universalité et financement fiscal.'],
            ['Qu’est-ce que le non-recours ?', ['Le refus d’une aide par l’administration', 'Le fait de ne pas demander une aide à laquelle on a droit', 'Une fraude aux prestations', 'Un recours devant le juge'], 1, 'Méconnaissance, complexité et crainte de la stigmatisation l’expliquent.'],
            ['Quel texte garantit à tous la protection de la santé et la sécurité matérielle ?', ['Le Code civil de 1804', 'Le Préambule de la Constitution de 1946', 'La loi de 1898', 'Le traité de Rome'], 1, 'Il fait partie du bloc de constitutionnalité.'],
            ['Quelle loi de 1898 fonde la protection contre les accidents du travail ?', ['Une loi qui rend l’employeur responsable des accidents du travail', 'La loi sur les allocations familiales', 'La loi sur la retraite à 60 ans', 'La loi sur le RSA'], 0, 'Elle instaure une responsabilité sans faute de l’employeur.'],
            ['La protection universelle maladie (PUMa) date de 2016.', ['Vrai', 'Faux'], 0, 'Elle garantit la prise en charge des frais de santé à toute personne qui travaille ou réside de façon stable et régulière en France.'],
            ['Quel prélèvement créé en 1991 finance la protection sociale sur l’ensemble des revenus ?', ['La TVA', 'La CSG', 'L’impôt sur les sociétés', 'La taxe foncière'], 1, 'La contribution sociale généralisée a fiscalisé une partie du financement.'],
            ['Avant la protection collective, on faisait face aux risques par :', ['La prévoyance individuelle, la famille et la charité', 'La Sécurité sociale', 'Le RSA', 'La PUMa'], 0, 'La protection collective organise la solidarité à l’échelle de la société.'],
          ],
        },
        {
          titre: 'Assurance, assistance, protection universelle',
          axe: 'Protection sociale',
          lecon: {
            titre: 'Les principes et les techniques de la protection sociale',
            cours: `Un salarié malade touche des indemnités journalières parce qu'il a cotisé ; une personne sans ressources perçoit le RSA parce qu'elle en a besoin ; tout parent reçoit des allocations familiales à partir du deuxième enfant. Trois logiques différentes, qui coexistent.

## Trois techniques
| Le critère | Assurance sociale | Assistance (aide sociale) | Protection universelle |
| **Qui est couvert ?** | Les personnes qui ont **cotisé** (travailleurs et leurs ayants droit) | Les personnes **dans le besoin**, sous **conditions de ressources** | **Tous** les résidents, sans condition d'activité |
| **Financement** | **Cotisations sociales** sur les revenus d'activité | **Impôt** | Impôt et contributions (CSG) |
| **Contrepartie** | Oui : droit ouvert par les cotisations (logique **contributive**) | Non : logique **non contributive** | Non |
| **Montant** | Souvent proportionnel aux revenus antérieurs | Complète les ressources jusqu'à un minimum | Souvent forfaitaire |
| **Exemples** | Retraite de base, indemnités journalières, allocation chômage | RSA, allocation de solidarité aux personnes âgées (ASPA), aide sociale à l'hébergement | Allocations familiales, PUMa |

> Le principe d'**assurance** repose sur la **mutualisation** du risque entre cotisants ; celui d'**assistance**, sur la **solidarité** envers les plus démunis ; celui d'**universalité**, sur la **citoyenneté** ou la résidence.

## Les prestations sociales
| Le type | La définition | Exemple |
| **En espèces** | Versement d'argent | Pension de retraite, allocation, indemnité journalière |
| **En nature** | Prise en charge d'un bien ou d'un service | Remboursement de soins, place en crèche, aide à domicile |

On distingue aussi les prestations **sous conditions de ressources** (RSA, aides au logement) et celles qui ne le sont pas (remboursement des soins).

## L'universalité de l'assurance maladie
Depuis la **protection universelle maladie** (PUMa, 2016), toute personne qui **travaille** ou qui **réside en France de manière stable et régulière** a droit à la prise en charge de ses frais de santé, sans avoir à justifier d'une activité professionnelle. Pour les personnes aux faibles ressources, la **complémentaire santé solidaire** (C2S, depuis 2019) prend en charge la part que l'assurance maladie ne rembourse pas, gratuitement ou pour une participation limitée selon les revenus.

## Le financement de la protection sociale
| La ressource | Sa logique |
| **Cotisations sociales** (salariales et patronales) | Assurance |
| **CSG**, CRDS et autres impôts affectés | Solidarité, universalité |
| **Contributions publiques** (budget de l'État et des collectivités) | Assistance |

La part des cotisations a diminué au profit de la CSG et des impôts : c'est la **fiscalisation** du financement, qui accompagne l'universalisation des droits.

> Les dépenses de protection sociale représentent environ un tiers de la richesse produite chaque année en France, l'un des niveaux les plus élevés d'Europe. La santé et la vieillesse en sont les deux premiers postes.`,
          },
          questions: [
            ['Quelle technique de protection sociale repose sur des cotisations ouvrant des droits ?', ['L’assistance', 'L’assurance sociale', 'La charité', 'L’épargne individuelle'], 1, 'C’est une logique contributive : on reçoit parce qu’on a cotisé.'],
            ['Le RSA relève de quelle logique ?', ['L’assurance', 'L’assistance', 'La prévoyance privée', 'L’épargne salariale'], 1, 'Il est versé sous condition de ressources, sans cotisation préalable.'],
            ['Comment l’assistance est-elle principalement financée ?', ['Par les cotisations salariales', 'Par l’impôt', 'Par les mutuelles', 'Par les dons uniquement'], 1, 'Elle exprime la solidarité nationale envers les plus démunis.'],
            ['Laquelle est une prestation en nature ?', ['Une pension de retraite', 'Le remboursement de soins', 'L’allocation chômage', 'Les indemnités journalières'], 1, 'Elle prend en charge un bien ou un service.'],
            ['Que garantit la protection universelle maladie ?', ['Une retraite à tous', 'La prise en charge des frais de santé à toute personne qui travaille ou réside de façon stable et régulière en France', 'Un revenu minimum', 'Une mutuelle gratuite pour tous'], 1, 'Elle a supprimé la condition d’activité professionnelle.'],
            ['Qu’est-ce que la complémentaire santé solidaire (C2S) ?', ['Une mutuelle privée obligatoire', 'Une prise en charge de la part non remboursée par l’assurance maladie pour les personnes aux faibles ressources', 'Une aide au logement', 'Une allocation familiale'], 1, 'Gratuite ou à participation limitée selon les revenus.'],
            ['Les allocations familiales sont versées sans condition d’activité professionnelle.', ['Vrai', 'Faux'], 0, 'Elles relèvent d’une logique universelle, même si leur montant est modulé selon les revenus depuis 2015.'],
            ['Qu’est-ce que la fiscalisation du financement de la protection sociale ?', ['La suppression des impôts', 'La part croissante des impôts (dont la CSG) au détriment des cotisations', 'La hausse des cotisations patronales', 'Le financement par les mutuelles'], 1, 'Elle accompagne l’universalisation des droits.'],
            ['Quel est le principe de l’assurance sociale ?', ['La mutualisation du risque entre cotisants', 'L’aide aux plus démunis sans contrepartie', 'L’épargne personnelle', 'La charité religieuse'], 0, 'Les cotisations de tous financent les prestations de ceux qui subissent le risque.'],
            ['Quelle part de la richesse nationale les dépenses de protection sociale représentent-elles environ ?', ['5 %', 'Un tiers', 'Les trois quarts', '100 %'], 1, 'Santé et vieillesse en sont les deux premiers postes.'],
            ['Une prestation d’assistance est versée sans condition de ressources.', ['Vrai', 'Faux'], 1, 'L’assistance est justement soumise à des conditions de ressources.'],
            ['Quel est l’exemple d’une prestation d’assurance proportionnelle aux revenus antérieurs ?', ['Le RSA', 'La pension de retraite de base', 'L’ASPA', 'L’aide sociale à l’hébergement'], 1, 'Son montant dépend des salaires et des durées de cotisation.'],
          ],
        },
        {
          titre: 'L’organisation du système de protection sociale',
          axe: 'Protection sociale',
          lecon: {
            titre: 'Une pluralité de dispositifs et d’acteurs',
            cours: `Derrière la carte Vitale, il y a une organisation complexe : une Sécurité sociale en plusieurs régimes et branches, des organismes complémentaires, une assurance chômage à part et une aide sociale gérée surtout par les départements.

## Les composantes du système
| La composante | Ce qu'elle couvre | Qui la gère |
| **Sécurité sociale** (régimes de base) | Maladie, AT-MP, vieillesse, famille, autonomie | Caisses nationales et locales |
| **Régimes complémentaires obligatoires** | Retraite complémentaire | Agirc-Arrco pour les salariés du privé |
| **Assurance chômage** | Perte d'emploi | **Unédic** (gestion paritaire) ; les allocations sont versées par **France Travail** (ex-Pôle emploi, depuis le 1er janvier 2024) |
| **Protection complémentaire santé** (facultative, mais collective et obligatoire pour les salariés du privé depuis 2016) | Part des soins non remboursée | Mutuelles, institutions de prévoyance, sociétés d'assurance |
| **Aide sociale** | Personnes en difficulté | **Départements** surtout, communes (CCAS), État |

## Le régime général et ses branches
Le **régime général** couvre la très grande majorité de la population (salariés du privé et, depuis 2020, travailleurs indépendants). À côté existent le **régime agricole** (MSA) et des **régimes spéciaux**.

| La branche | La caisse nationale | Le réseau local |
| **Maladie** et **accidents du travail-maladies professionnelles** | CNAM (Caisse nationale de l'assurance maladie) | CPAM |
| **Vieillesse** | CNAV | Carsat |
| **Famille** | CNAF | CAF |
| **Autonomie** (depuis 2021) | CNSA | Départements, maisons départementales des personnes handicapées |
| **Recouvrement** (collecte des cotisations) | Urssaf Caisse nationale | Urssaf |

## Complémentaire, supplémentaire, subsidiaire
| Le caractère | Le sens | Exemple |
| **Complémentaire** | Couvre ce que le régime de base ne rembourse pas | La mutuelle rembourse le **ticket modérateur** |
| **Supplémentaire** | Couvre au-delà du tarif de base, pour des prestations en plus | Dépassements d'honoraires, chambre particulière |
| **Subsidiaire** | N'intervient **qu'en dernier recours**, quand les autres solutions (revenus, famille, autres droits) sont épuisées | L'**aide sociale**, qui peut mettre en jeu l'**obligation alimentaire** des enfants envers leurs parents |

## Exemple travaillé : une consultation chez le médecin traitant
Pour une consultation de généraliste à 30 € dans le parcours de soins :
1. l'assurance maladie rembourse **70 %** du tarif, soit 21 €, moins une **participation forfaitaire** de 2 € restant à la charge du patient : 19 € ;
2. la complémentaire santé rembourse le **ticket modérateur**, les **30 %** restants : 9 € ;
3. il reste au patient la participation forfaitaire de 2 €, que la complémentaire ne peut pas prendre en charge.

> L'assurance maladie et la complémentaire sont **complémentaires** : l'une couvre la base, l'autre une partie du reste.

## L'aide sociale
L'**aide sociale** est une obligation de la collectivité envers les personnes qui ne peuvent faire face à leurs besoins. Le **département** en est le chef de file : RSA, aide sociale à l'enfance (ASE), allocation personnalisée d'autonomie (APA), prestation de compensation du handicap (PCH). Les communes interviennent par leur **centre communal d'action sociale** (CCAS).`,
          },
          questions: [
            ['Quelle caisse locale gère l’assurance maladie ?', ['La CAF', 'La CPAM', 'La Carsat', 'L’Urssaf'], 1, 'La caisse primaire d’assurance maladie rembourse les soins et verse les indemnités journalières.'],
            ['Quel organisme verse les prestations familiales ?', ['La CPAM', 'La CAF', 'France Travail', 'La MSA uniquement'], 1, 'Les caisses d’allocations familiales dépendent de la CNAF.'],
            ['Quel organisme collecte les cotisations sociales ?', ['L’Urssaf', 'La CAF', 'La CNSA', 'L’INSEE'], 0, 'La branche recouvrement est pilotée par l’Urssaf Caisse nationale.'],
            ['Quelle caisse nationale gère la branche autonomie ?', ['La CNAV', 'La CNSA', 'La CNAF', 'L’Unédic'], 1, 'La Caisse nationale de solidarité pour l’autonomie gère la cinquième branche depuis 2021.'],
            ['Quel organisme verse les allocations chômage depuis le 1er janvier 2024 ?', ['Pôle emploi', 'France Travail', 'La CAF', 'La CPAM'], 1, 'Pôle emploi est devenu France Travail ; l’Unédic gère l’assurance chômage.'],
            ['Qu’est-ce que le ticket modérateur ?', ['Le prix d’une mutuelle', 'La part des dépenses de santé qui reste après le remboursement de l’assurance maladie', 'Une amende pour retard', 'Le tarif d’une consultation'], 1, 'La complémentaire santé le prend en charge en tout ou partie.'],
            ['Que signifie le caractère subsidiaire de l’aide sociale ?', ['Elle intervient en premier', 'Elle n’intervient qu’en dernier recours', 'Elle est facultative pour la collectivité', 'Elle est financée par les mutuelles'], 1, 'On mobilise d’abord les revenus, la famille et les autres droits.'],
            ['Quelle collectivité est chef de file de l’aide sociale ?', ['La commune', 'Le département', 'La région', 'L’Europe'], 1, 'Elle gère le RSA, l’ASE, l’APA et la PCH.'],
            ['Pour une consultation à 30 € remboursée à 70 %, combien rembourse l’assurance maladie avant déduction de la participation forfaitaire ?', ['9 €', '21 €', '30 €', '28 €'], 1, '70 % de 30 € = 21 € ; la participation forfaitaire de 2 € en est ensuite déduite.'],
            ['La participation forfaitaire peut être remboursée par la complémentaire santé.', ['Vrai', 'Faux'], 1, 'Elle reste à la charge du patient.'],
            ['Quel exemple illustre une couverture supplémentaire ?', ['Le remboursement du ticket modérateur', 'La prise en charge de dépassements d’honoraires ou d’une chambre particulière', 'Le RSA', 'Les allocations familiales'], 1, 'Elle va au-delà du tarif de base.'],
            ['Quels organismes proposent des complémentaires santé ?', ['Les CAF', 'Les mutuelles, institutions de prévoyance et sociétés d’assurance', 'Les Urssaf', 'Les mairies uniquement'], 1, 'Ce sont les trois familles d’organismes complémentaires.'],
          ],
        },
        // ──────────────── MODES D'INTERVENTION SOCIALE ET EN SANTÉ ────────────────
        {
          titre: 'L’action en santé : prévention, promotion, éducation',
          axe: 'Modes d’intervention sociale et en santé',
          lecon: {
            titre: 'Agir sur les déterminants pour garantir la santé',
            cours: `Soigner un malade, vacciner un enfant, taxer le tabac, aménager une piste cyclable : ce sont toutes des **actions en santé**, mais elles n'agissent pas au même moment ni sur les mêmes déterminants.

## Les modes d'intervention en santé
| Le mode | Son objectif | Exemple |
| **Veille et sécurité sanitaire** | Surveiller, détecter les menaces, protéger la population des risques | Surveillance de la grippe, retrait d'un produit dangereux |
| **Promotion de la santé** | Donner aux populations les moyens d'améliorer leur santé, en agissant sur l'**environnement** et les **conditions de vie** | Cantine scolaire équilibrée, espaces verts, politique du logement |
| **Éducation pour la santé** | Aider chacun à acquérir connaissances et compétences pour faire des choix favorables à sa santé | Atelier sur le sommeil au lycée |
| **Prévention** | Éviter l'apparition, l'aggravation ou la récidive d'une maladie | Vaccination, dépistage |
| **Restauration de la santé** | Soigner, réadapter, réinsérer | Hospitalisation, rééducation |

## Les trois niveaux de prévention (OMS)
| Le niveau | L'objectif | Exemples |
| **Primaire** | Empêcher l'**apparition** de la maladie : réduire l'**incidence** | Vaccination, port du préservatif, lutte contre le tabagisme |
| **Secondaire** | Détecter tôt pour limiter l'évolution : réduire la **prévalence** | **Dépistage** organisé du cancer du sein, du côlon, du col de l'utérus |
| **Tertiaire** | Limiter les **complications**, les **récidives** et les séquelles | Rééducation après un AVC, éducation thérapeutique du patient diabétique |

## La promotion de la santé : la charte d'Ottawa (1986)
La charte définit la promotion de la santé comme « le processus qui confère aux populations les moyens d'assurer un plus grand contrôle sur leur propre santé ». Elle propose **cinq axes** :
1. élaborer une **politique publique saine** ;
2. créer des **milieux favorables** ;
3. renforcer l'**action communautaire** ;
4. acquérir des **aptitudes individuelles** ;
5. **réorienter les services** de santé vers la prévention.

> La prévention vise une **maladie** ; la promotion de la santé vise la **santé globale** et ses déterminants.

## Relier l'action à la question de santé
Pour analyser une action de santé, pose-toi ces questions :
1. **Quel problème** vise-t-elle, et quels **déterminants** ?
2. **Quel public** : toute la population, un groupe à risque, des patients ?
3. **Quel mode** d'intervention et quel **niveau** de prévention ?
4. **Quels acteurs** la portent et la financent ?
5. **Quelle place** laisse-t-elle aux personnes concernées ?

## Le parcours de santé
Le **parcours de santé** désigne l'ensemble des étapes d'une personne dans le système : prévention, soins de ville, hôpital, médico-social, retour à domicile. Il doit être **coordonné** pour éviter les ruptures ; le **médecin traitant**, instauré en 2004, en est le pivot.

La protection sociale y contribue : elle rembourse la vaccination, prend en charge à 100 % le dépistage organisé du cancer du sein et les soins des affections de longue durée (ALD).`,
          },
          questions: [
            ['La vaccination relève de quel niveau de prévention ?', ['Primaire', 'Secondaire', 'Tertiaire', 'Aucun'], 0, 'Elle empêche l’apparition de la maladie et réduit l’incidence.'],
            ['Le dépistage organisé du cancer du sein relève de la prévention :', ['Primaire', 'Secondaire', 'Tertiaire', 'Quaternaire'], 1, 'Il détecte la maladie tôt pour limiter son évolution.'],
            ['La rééducation après un AVC relève de la prévention :', ['Primaire', 'Secondaire', 'Tertiaire', 'Universelle'], 2, 'Elle limite les séquelles et les complications.'],
            ['Quel est l’objectif de la prévention primaire ?', ['Réduire la prévalence', 'Réduire l’incidence', 'Réduire les séquelles', 'Augmenter les soins'], 1, 'Elle agit avant l’apparition de la maladie.'],
            ['Combien d’axes la charte d’Ottawa propose-t-elle ?', ['3', '4', '5', '10'], 2, 'Politique publique saine, milieux favorables, action communautaire, aptitudes individuelles, réorientation des services.'],
            ['Qu’est-ce que l’éducation pour la santé ?', ['Former des médecins', 'Aider chacun à acquérir connaissances et compétences pour des choix favorables à sa santé', 'Soigner les maladies', 'Construire des hôpitaux'], 1, 'Elle vise l’autonomie de la personne face à sa santé.'],
            ['Quelle est la différence entre prévention et promotion de la santé ?', ['Aucune', 'La prévention vise une maladie, la promotion vise la santé globale et ses déterminants', 'La promotion ne concerne que l’hôpital', 'La prévention est toujours individuelle'], 1, 'La promotion agit sur l’environnement et les conditions de vie.'],
            ['Créer des espaces verts et des pistes cyclables relève de la promotion de la santé.', ['Vrai', 'Faux'], 0, 'C’est l’axe « créer des milieux favorables » de la charte d’Ottawa.'],
            ['Depuis quelle année le médecin traitant est-il le pivot du parcours de soins ?', ['1945', '1998', '2004', '2020'], 2, 'La réforme de l’assurance maladie de 2004 a instauré le parcours de soins coordonnés.'],
            ['La veille sanitaire a pour rôle de :', ['Soigner les patients', 'Surveiller et détecter les menaces pour la santé', 'Rembourser les soins', 'Former les infirmiers'], 1, 'Santé publique France en est l’acteur principal.'],
            ['L’éducation thérapeutique d’un patient diabétique relève de la prévention tertiaire.', ['Vrai', 'Faux'], 0, 'Elle vise à éviter les complications d’une maladie déjà installée.'],
            ['Qu’est-ce que la restauration de la santé ?', ['La rénovation des hôpitaux', 'Les soins, la réadaptation et la réinsertion', 'La vaccination', 'La collecte des cotisations'], 1, 'C’est le mode curatif de l’action en santé.'],
          ],
        },
        {
          titre: 'Les acteurs en santé et les droits de la personne',
          axe: 'Modes d’intervention sociale et en santé',
          lecon: {
            titre: 'Qui agit, et avec quelle place pour le patient ?',
            cours: `Une action de santé mobilise toujours plusieurs acteurs, du ministère au médecin de famille. Et depuis 2002, la personne soignée n'est plus seulement un patient qui reçoit : elle a des **droits** et participe aux décisions qui la concernent.

## La diversité des acteurs
| Le niveau | Les acteurs | Leur rôle |
| **International** | OMS, Union européenne | Recommandations, coordination, alertes |
| **National** | Ministère chargé de la santé, agences (Santé publique France, Haute Autorité de santé, ANSM), Assurance maladie | Définir la politique, réguler, évaluer, financer |
| **Régional** | **Agences régionales de santé** (ARS, créées en 2010) | Piloter la santé dans la région : organisation des soins, prévention, autorisation des établissements |
| **Local** | Départements (protection maternelle et infantile), communes, établissements de santé, professionnels libéraux | Mettre en œuvre au plus près des habitants |
| **Société civile** | **Associations** de patients et d'usagers, mutuelles | Informer, accompagner, défendre, représenter |

## Les professionnels de santé
Médecins, infirmiers, pharmaciens, sages-femmes, kinésithérapeutes, aides-soignants… Ils interviennent en **ville** (cabinets, maisons et centres de santé), à l'**hôpital** et dans le **médico-social** (établissements pour personnes âgées ou handicapées). Le travail en **équipe pluriprofessionnelle** se développe (maisons de santé, communautés professionnelles territoriales de santé).

## Les droits de la personne malade
La **loi du 4 mars 2002** relative aux droits des malades et à la qualité du système de santé (dite loi Kouchner) les a rassemblés :

| Le droit | Ce qu'il garantit |
| **Information** | Être informé de son état de santé, des traitements, de leurs risques |
| **Consentement** | Aucun acte sans consentement **libre et éclairé**, qui peut être retiré à tout moment |
| **Accès au dossier médical** | Consulter directement son dossier |
| **Secret professionnel** | Le respect de la vie privée et du secret médical |
| **Personne de confiance** | Désigner un proche qui accompagne et peut être consulté |
| **Dignité et non-discrimination** | Être soigné sans distinction, avec respect |
| **Soulagement de la douleur** | Recevoir des soins visant à soulager sa douleur |

Depuis la loi **Leonetti** (2005), on peut rédiger des **directives anticipées** sur sa fin de vie ; la loi **Claeys-Leonetti** (2016) les rend contraignantes pour le médecin.

## La démocratie sanitaire
La loi de 2002 a aussi fait entrer les **usagers** dans le système : des **représentants des usagers** siègent dans les établissements (commission des usagers) et dans les instances de santé. On parle de **démocratie sanitaire**.

## La participation de la personne
Une action de santé est plus efficace quand les personnes concernées y **participent** : elles expriment leurs besoins, contribuent à la conception de l'action, l'évaluent. Exemples : les **patients experts** qui animent des ateliers d'éducation thérapeutique, la **santé communautaire** où des habitants d'un quartier identifient eux-mêmes leurs priorités.

> Passer du patient « objet de soins » au patient « acteur de sa santé » : c'est le fil des réformes depuis 2002.`,
          },
          questions: [
            ['Quels organismes pilotent la santé au niveau régional ?', ['Les CAF', 'Les agences régionales de santé (ARS)', 'Les Urssaf', 'Les mairies'], 1, 'Créées en 2010, elles organisent l’offre de soins et la prévention dans chaque région.'],
            ['Quelle loi de 2002 rassemble les droits des malades ?', ['La loi Evin', 'La loi du 4 mars 2002, dite loi Kouchner', 'La loi Veil', 'La loi DALO'], 1, 'Elle porte sur les droits des malades et la qualité du système de santé.'],
            ['Que signifie un consentement « libre et éclairé » ?', ['Donné sous la pression du médecin', 'Donné sans contrainte, après une information claire', 'Donné par écrit uniquement', 'Donné par la famille à la place du patient'], 1, 'Il peut être retiré à tout moment.'],
            ['Quel est le rôle de la personne de confiance ?', ['Payer les soins', 'Accompagner le patient et être consultée s’il ne peut plus exprimer sa volonté', 'Remplacer le médecin', 'Signer les ordonnances'], 1, 'Le patient la désigne librement.'],
            ['Un patient peut accéder directement à son dossier médical.', ['Vrai', 'Faux'], 0, 'C’est un droit reconnu par la loi du 4 mars 2002.'],
            ['Quelle loi de 2016 rend les directives anticipées sur la fin de vie contraignantes pour le médecin ?', ['La loi Claeys-Leonetti', 'La loi Kouchner', 'La loi HPST', 'La loi Veil'], 0, 'Les directives anticipées s’imposent au médecin, sauf exceptions prévues par la loi.'],
            ['Qu’est-ce que la démocratie sanitaire ?', ['L’élection des médecins', 'La participation des usagers aux instances et décisions du système de santé', 'La gratuité totale des soins', 'Le vote des lois de santé par référendum'], 1, 'Des représentants des usagers siègent dans les établissements et instances.'],
            ['Quelle agence nationale évalue les médicaments, les actes et la qualité des soins ?', ['La Haute Autorité de santé', 'La CNAF', 'France Travail', 'L’INSEE'], 0, 'La HAS émet des recommandations et certifie les établissements.'],
            ['Lequel est un acteur de la société civile en santé ?', ['Une association de patients', 'Le ministère de la santé', 'L’ARS', 'L’Assurance maladie'], 0, 'Les associations informent, accompagnent et représentent les usagers.'],
            ['Qu’est-ce qu’un patient expert ?', ['Un médecin spécialiste', 'Un patient qui, fort de son expérience de la maladie, aide d’autres patients', 'Un juge des tutelles', 'Un pharmacien'], 1, 'Il participe par exemple à l’éducation thérapeutique.'],
            ['Le secret médical peut être levé librement par le médecin pour informer l’employeur.', ['Vrai', 'Faux'], 1, 'Le secret professionnel protège la vie privée du patient ; ses exceptions sont strictement prévues par la loi.'],
            ['Quelle collectivité gère la protection maternelle et infantile (PMI) ?', ['La commune', 'Le département', 'La région', 'L’État directement'], 1, 'La PMI suit la santé des femmes enceintes et des jeunes enfants.'],
          ],
        },
        {
          titre: 'L’intervention sociale',
          axe: 'Modes d’intervention sociale et en santé',
          lecon: {
            titre: 'Accompagner les personnes et agir sur les problèmes sociaux',
            cours: `Une famille menacée d'expulsion, un jeune sans qualification, une personne âgée isolée : l'**intervention sociale** part d'un **diagnostic** et cherche, avec la personne, à restaurer son autonomie et sa place dans la société.

## Les objectifs de l'intervention sociale
- **Insertion** : permettre à une personne d'accéder à l'emploi, au logement, à la formation, de retrouver sa place.
- **Autonomie** : rendre la personne capable d'agir par elle-même.
- **Protection** : des personnes vulnérables (enfants en danger, majeurs protégés).
- **Lutte contre les exclusions** et **réduction des inégalités**.
- **Cohésion sociale** et développement des territoires.

## Le diagnostic social
Avant d'agir, on établit un **diagnostic** : un état des lieux de la situation d'une personne, d'un groupe ou d'un territoire (ressources, difficultés, besoins, potentialités). Il s'appuie sur des données, des entretiens, l'observation. Pour un territoire, on parle de **diagnostic de territoire**.

## Des modes d'intervention variés
| Le mode | La cible | Exemple |
| **Accompagnement social individuel** | Une personne ou une famille | Un assistant de service social aide une famille à gérer son budget et à ouvrir ses droits |
| **Intervention collective** (action de groupe) | Un groupe qui partage une difficulté | Atelier collectif de recherche d'emploi |
| **Développement social local** (DSL) | Un **territoire** et ses habitants | Les habitants, les associations et la mairie créent ensemble un jardin partagé ou une épicerie solidaire |

> Le **développement social local** mobilise les ressources du territoire et fait des habitants des **acteurs**, pas seulement des bénéficiaires.

## La diversité des acteurs
| Le niveau | Les acteurs |
| **État** | Définit les politiques (ministère), les préfectures et services déconcentrés les mettent en œuvre |
| **Département** | **Chef de file de l'action sociale** : RSA, aide sociale à l'enfance, personnes âgées et handicapées |
| **Commune** | **CCAS** (obligatoire dans les communes de 1 500 habitants et plus) : aides d'urgence, domiciliation, analyse des besoins sociaux |
| **Organismes de protection sociale** | CAF, caisses de retraite, CPAM (action sociale) |
| **Associations** | Restos du cœur, Secours populaire, Emmaüs, Croix-Rouge, ATD Quart Monde… |

Les **professionnels** : assistant de service social, éducateur spécialisé, conseiller en économie sociale et familiale, moniteur-éducateur, technicien de l'intervention sociale et familiale, et de nombreux bénévoles.

## Les droits de la personne accompagnée
La **loi du 2 janvier 2002** rénovant l'action sociale et médico-sociale place l'usager **au centre** : respect de sa dignité, de son intimité, libre choix des prestations, participation au projet qui le concerne. Elle impose des outils dans les établissements et services :

| L'outil | Son rôle |
| **Livret d'accueil** et **charte des droits et libertés** | Informer la personne de ses droits |
| **Contrat de séjour** ou document individuel de prise en charge | Formaliser l'accompagnement |
| **Projet personnalisé** | Définir avec la personne ses objectifs |
| **Conseil de la vie sociale** | Faire participer les usagers au fonctionnement de l'établissement |
| **Règlement de fonctionnement**, **personne qualifiée** | Fixer les règles communes, permettre un recours |

## La protection sociale contre l'exclusion
La protection sociale joue un rôle central dans la lutte contre l'exclusion : **minima sociaux** (RSA, ASPA, allocation aux adultes handicapés), aides au logement, complémentaire santé solidaire, action sociale des CAF. Elle réduit fortement le taux de pauvreté : sans les prestations sociales, il serait nettement plus élevé.`,
          },
          questions: [
            ['Qu’est-ce que le diagnostic social ?', ['Un examen médical', 'Un état des lieux des ressources, difficultés et besoins d’une personne ou d’un territoire', 'Une décision de justice', 'Une prestation en espèces'], 1, 'Il précède toute intervention sociale.'],
            ['Quelle collectivité est chef de file de l’action sociale ?', ['La région', 'Le département', 'La commune', 'L’Union européenne'], 1, 'Elle gère le RSA, l’ASE, l’aide aux personnes âgées et handicapées.'],
            ['Qu’est-ce que le développement social local ?', ['Une aide individuelle d’urgence', 'Une démarche qui mobilise les ressources d’un territoire et fait des habitants des acteurs', 'Une subvention européenne', 'Une construction de logements sociaux uniquement'], 1, 'L’intervention vise le territoire dans son ensemble.'],
            ['Dans quelles communes le CCAS est-il obligatoire ?', ['Toutes les communes', 'Les communes de 1 500 habitants et plus', 'Les villes de plus de 100 000 habitants', 'Aucune'], 1, 'En dessous, la commune peut exercer ces missions directement ou via un centre intercommunal.'],
            ['Quelle loi de 2002 place l’usager au centre de l’action sociale et médico-sociale ?', ['La loi du 4 mars 2002', 'La loi du 2 janvier 2002', 'La loi DALO', 'La loi de 1975'], 1, 'Elle impose livret d’accueil, contrat de séjour, conseil de la vie sociale…'],
            ['À quoi sert le conseil de la vie sociale ?', ['À juger les usagers', 'À faire participer les usagers au fonctionnement de l’établissement', 'À recruter le personnel', 'À fixer les prix'], 1, 'C’est un outil de participation prévu par la loi de 2002.'],
            ['Un assistant de service social qui aide une famille à gérer son budget pratique :', ['Un accompagnement social individuel', 'Un développement social local', 'Une action de veille sanitaire', 'Une prévention tertiaire'], 0, 'L’intervention porte sur une personne ou une famille.'],
            ['L’insertion vise à permettre à une personne de retrouver sa place dans la société.', ['Vrai', 'Faux'], 0, 'Par l’emploi, le logement, la formation, les liens sociaux.'],
            ['Lequel est un minimum social ?', ['La pension de retraite de base', 'L’allocation aux adultes handicapés (AAH)', 'Le salaire minimum', 'Les indemnités journalières'], 1, 'Comme le RSA et l’ASPA, elle garantit un revenu minimum.'],
            ['Quel outil formalise les objectifs définis avec la personne accompagnée ?', ['Le projet personnalisé', 'Le bulletin de salaire', 'La carte Vitale', 'Le permis de conduire'], 0, 'Il est construit avec la personne et révisé régulièrement.'],
            ['Les prestations sociales n’ont aucun effet sur le taux de pauvreté.', ['Vrai', 'Faux'], 1, 'Elles le réduisent fortement : sans elles, il serait nettement plus élevé.'],
            ['Quel professionnel du social est spécialiste du budget et de la vie quotidienne des familles ?', ['Le conseiller en économie sociale et familiale', 'Le kinésithérapeute', 'Le pharmacien', 'Le notaire'], 0, 'Il accompagne sur le budget, le logement, l’alimentation.'],
          ],
        },
        // ──────────────────────── PÔLE MÉTHODOLOGIQUE ────────────────────────
        {
          titre: 'La recherche documentaire dans le domaine sanitaire et social',
          axe: 'Méthodologies appliquées au secteur sanitaire et social',
          lecon: {
            titre: 'Trouver, trier et citer des sources fiables',
            cours: `Avant toute étude, on cherche ce qui a déjà été écrit sur le sujet. En santé et en social, les sources sont nombreuses, de qualité très inégale : savoir chercher et trier est une compétence de base, pour le bac comme pour les études supérieures.

## Les étapes de la recherche
1. **Questionner le sujet** : délimiter le thème avec le QQOQCP (qui, quoi, où, quand, comment, pourquoi) et formuler une question précise.
2. **Choisir les mots-clés** et leurs synonymes.
3. **Construire des requêtes** avec les opérateurs : **ET** (les deux mots, résultats plus précis), **OU** (l'un ou l'autre, résultats plus larges), **SAUF** (exclure un mot), les guillemets pour une expression exacte.
4. **Collecter** dans des bases adaptées.
5. **Évaluer** chaque source.
6. **Synthétiser** et **citer** les références.

## Les types de sources
| Le type | Exemples |
| **Statistiques publiques** | INSEE, DREES, Santé publique France, Assurance maladie |
| **Textes officiels** | Légifrance (lois, décrets), Bulletin officiel |
| **Rapports** | Cour des comptes, Haut Conseil de la santé publique, Défenseur des droits |
| **Études scientifiques** | Articles de revues (bases Cairn, Persée, HAL) |
| **Information grand public** | service-public.fr, sites des caisses, presse |
| **Sources associatives** | Rapports de la Fondation pour le logement des défavorisés, du Secours catholique |

Une **source primaire** est un document original (une enquête, une loi) ; une **source secondaire** en fait la présentation ou l'analyse (un article de presse sur l'enquête).

## Évaluer la fiabilité d'une source
| Le critère | La question à se poser |
| **Auteur** | Qui a écrit ? Est-il compétent, identifiable ? |
| **Producteur** | Organisme public, scientifique, associatif, commercial ? |
| **Date** | L'information est-elle à jour ? |
| **Objectivité** | Le document informe-t-il ou cherche-t-il à convaincre, à vendre ? |
| **Références** | Les données sont-elles sourcées et vérifiables ? |
| **Qualité** | Méthode exposée, données précises, cohérence avec d'autres sources |

> Un chiffre sans source n'est pas une donnée : c'est une affirmation. Croise toujours au moins deux sources.

## Constituer et structurer un corpus
Le **corpus documentaire** est l'ensemble des documents retenus pour une étude. On le structure par **thèmes** ou par **sous-questions**, en notant pour chaque document l'idée principale et les données utiles.

## Citer ses sources
- Un ouvrage : NOM Prénom, *Titre*, éditeur, année.
- Un site : organisme, titre de la page, adresse, **date de consultation**.
- Une statistique : producteur, titre de l'étude, année des données.

## L'apport de la recherche documentaire
Elle évite de refaire ce qui existe, apporte des données de **comparaison**, aide à formuler des **hypothèses** et à choisir une **méthode** d'étude.`,
          },
          questions: [
            ['Quel opérateur de recherche élargit les résultats ?', ['ET', 'OU', 'SAUF', 'Les guillemets'], 1, 'OU cherche l’un ou l’autre des mots : plus de résultats.'],
            ['Quel opérateur rend une recherche plus précise en exigeant les deux mots ?', ['ET', 'OU', 'SAUF', 'Aucun'], 0, 'Les résultats doivent contenir les deux termes.'],
            ['Quel site publie les textes officiels (lois, décrets) ?', ['Légifrance', 'Wikipédia', 'Un blog de santé', 'Un forum'], 0, 'C’est le service public de diffusion du droit.'],
            ['Qu’est-ce qu’une source primaire ?', ['Un résumé d’article', 'Un document original, comme une enquête ou une loi', 'Un avis sur un forum', 'Une publicité'], 1, 'Une source secondaire en fait la présentation ou l’analyse.'],
            ['Lequel est un critère de fiabilité d’une source ?', ['Sa mise en page colorée', 'L’identification de l’auteur et la présence de références', 'Son nombre de partages', 'Sa longueur'], 1, 'Auteur, producteur, date, objectivité et références comptent.'],
            ['Que signifie QQOQCP ?', ['Qui, quoi, où, quand, comment, pourquoi', 'Quantité, qualité, origine, quantité, coût, prix', 'Questionnaire, quota, observation, question, corpus, projet', 'Aucun sens'], 0, 'Ces questions aident à délimiter un sujet.'],
            ['Pour une source en ligne, il faut indiquer la date de consultation.', ['Vrai', 'Faux'], 0, 'Le contenu d’une page peut changer.'],
            ['Quel producteur publie les statistiques sur la santé et la protection sociale pour le ministère ?', ['La DREES', 'La SNCF', 'Météo-France', 'L’Urssaf'], 0, 'La direction de la recherche, des études, de l’évaluation et des statistiques.'],
            ['Qu’est-ce qu’un corpus documentaire ?', ['Un seul livre', 'L’ensemble des documents retenus pour une étude', 'Un questionnaire', 'Un tableau de chiffres'], 1, 'On le structure par thèmes ou sous-questions.'],
            ['Un chiffre trouvé sur un réseau social sans source peut être utilisé tel quel.', ['Vrai', 'Faux'], 1, 'Sans source vérifiable, ce n’est qu’une affirmation.'],
            ['Pourquoi faire une recherche documentaire avant une étude ?', ['Pour recopier une étude existante', 'Pour éviter de refaire l’existant, comparer et formuler des hypothèses', 'Pour allonger le rapport', 'Ce n’est pas utile'], 1, 'C’est un préalable à toute étude.'],
            ['Quel critère interroge un document qui cherche à vendre un produit ?', ['La date', 'L’objectivité', 'La longueur', 'La police de caractères'], 1, 'Un document commercial cherche à convaincre plutôt qu’à informer.'],
          ],
        },
        {
          titre: 'La démarche d’étude : méthodes, échantillon, éthique',
          axe: 'Méthodologies appliquées au secteur sanitaire et social',
          lecon: {
            titre: 'L’étude au service de l’action',
            cours: `Avant de lancer une action de prévention au lycée ou d'ouvrir une épicerie solidaire, il faut connaître la population et ses besoins. L'**étude** produit cette connaissance ; elle sert aussi à **évaluer** une action après coup.

## Les étapes d'une démarche d'étude
1. **La commande ou le besoin** : qui demande l'étude, pourquoi, dans quel contexte institutionnel ?
2. **L'objet d'étude** et la **question** de départ.
3. Les **hypothèses** : réponses provisoires à vérifier.
4. Le **protocole** : population, échantillon, méthode, outils, calendrier.
5. Le **recueil** des données.
6. Le **traitement** et l'**analyse**.
7. Le **rapport** d'étude, sa **présentation** et sa **diffusion**, avec des propositions d'action.

## Deux familles de méthodes, complémentaires
| Le critère | Méthode quantitative | Méthode qualitative |
| **Objectif** | **Mesurer**, compter, comparer | **Comprendre** le sens, les représentations, les vécus |
| **Outils** | **Questionnaire** à questions fermées, exploitation de statistiques | **Entretien** (directif, semi-directif, libre), **observation**, groupe de discussion |
| **Échantillon** | Grand, si possible **représentatif** | Petit, choisi pour sa diversité |
| **Résultats** | Chiffres, pourcentages, graphiques | Citations, typologies, analyse de contenu |

> On combine souvent les deux : un questionnaire pour mesurer l'ampleur d'un phénomène, des entretiens pour en comprendre les raisons.

## Les outils de recueil
- **Questionnaire** : questions **fermées** (réponses proposées, faciles à traiter) ou **ouvertes** (réponse libre) ; on le **teste** auprès de quelques personnes avant de le diffuser.
- **Entretien semi-directif** : une **grille d'entretien** liste les thèmes à aborder, mais la personne s'exprime librement.
- **Observation** : on relève des comportements dans leur contexte, avec une grille.

## L'échantillon
On interroge rarement toute la **population** : on choisit un **échantillon**. Pour que les résultats puissent être généralisés, il doit être **représentatif**.

| La méthode | Le principe |
| **Aléatoire** | Chaque personne a la même chance d'être tirée au sort |
| **Par quotas** | L'échantillon reproduit la structure de la population (âge, sexe, catégorie sociale) |

## Traiter les données
On calcule des **effectifs**, des **pourcentages**, des **moyennes**, on croise des variables (par exemple la consommation de tabac selon le sexe), on représente les résultats par des **tableaux** et **graphiques** adaptés (secteurs pour une répartition, barres pour comparer, courbe pour une évolution), souvent avec un **tableur**.

## Éthique et réglementation
Les données de santé et les données sociales sont **sensibles**. Une étude doit respecter :
- le **consentement** libre et éclairé des participants ;
- l'**anonymat** ou la pseudonymisation, la **confidentialité** ;
- le **règlement général sur la protection des données** (RGPD, 2018), sous le contrôle de la **CNIL** : ne collecter que les données nécessaires, informer les personnes de leurs droits ;
- pour les recherches impliquant la personne humaine, l'avis d'un **comité de protection des personnes**.`,
          },
          questions: [
            ['Quel est l’objectif d’une méthode quantitative ?', ['Comprendre le vécu des personnes', 'Mesurer, compter et comparer', 'Raconter une histoire', 'Observer un seul individu'], 1, 'Elle produit des chiffres, des pourcentages, des graphiques.'],
            ['Quel outil est typique d’une méthode qualitative ?', ['Le questionnaire à questions fermées', 'L’entretien semi-directif', 'Le tableau statistique de l’INSEE', 'Le recensement'], 1, 'Une grille liste les thèmes, mais la personne s’exprime librement.'],
            ['Qu’est-ce qu’une hypothèse dans une étude ?', ['Une conclusion certaine', 'Une réponse provisoire à vérifier', 'Un outil de recueil', 'Une source documentaire'], 1, 'L’étude la confirme ou l’infirme.'],
            ['Qu’est-ce qu’un échantillon représentatif ?', ['Un groupe choisi au hasard sans règle', 'Un groupe qui reproduit les caractéristiques de la population étudiée', 'Tous les habitants d’un pays', 'Les amis de l’enquêteur'], 1, 'Il permet de généraliser les résultats.'],
            ['Quel est le principe de la méthode des quotas ?', ['Tirer les personnes au sort', 'Reproduire dans l’échantillon la structure de la population (âge, sexe…)', 'Interroger uniquement des volontaires', 'Interroger une seule personne'], 1, 'C’est la méthode la plus utilisée par les instituts de sondage.'],
            ['Pourquoi teste-t-on un questionnaire avant de le diffuser ?', ['Pour gagner du temps', 'Pour vérifier que les questions sont comprises et pertinentes', 'Pour connaître les réponses à l’avance', 'Ce n’est pas utile'], 1, 'Une question mal comprise fausse tous les résultats.'],
            ['Quel organisme contrôle le respect de la protection des données personnelles en France ?', ['La CNIL', 'La CAF', 'L’ARS', 'La HAS'], 0, 'Elle veille à l’application du RGPD.'],
            ['Les données de santé sont des données sensibles.', ['Vrai', 'Faux'], 0, 'Elles bénéficient d’une protection renforcée.'],
            ['Quel graphique convient pour représenter une évolution dans le temps ?', ['Un diagramme en secteurs', 'Une courbe', 'Un tableau de noms', 'Une carte mentale'], 1, 'Les secteurs montrent une répartition, les barres des comparaisons.'],
            ['Pourquoi combine-t-on souvent méthodes quantitatives et qualitatives ?', ['Pour doubler le coût', 'Pour mesurer l’ampleur d’un phénomène et en comprendre les raisons', 'Parce que la loi l’impose', 'Pour éviter l’analyse'], 1, 'Les deux approches sont complémentaires.'],
            ['Une étude peut publier le nom des personnes interrogées sans leur accord.', ['Vrai', 'Faux'], 1, 'Anonymat, confidentialité et consentement sont des exigences éthiques.'],
            ['Quelle est la première étape d’une démarche d’étude ?', ['Le traitement des données', 'L’analyse de la commande ou du besoin', 'La rédaction du rapport', 'La diffusion'], 1, 'Il faut savoir qui demande l’étude, pourquoi et dans quel contexte.'],
          ],
        },
        // ──────────────────────── MÉTHODE ────────────────────────
        {
          titre: 'Méthode : analyser un document sanitaire et social',
          axe: 'Méthodologie',
          lecon: {
            titre: 'Lire les chiffres, construire une argumentation',
            cours: `En première, les sciences et techniques sanitaires et sociales sont évaluées en **contrôle continu** ; en terminale, la spécialité est évaluée par une **épreuve écrite de 3 heures** (coefficient 16) qui porte sur les programmes de **première et de terminale**, avec une question de mobilisation des connaissances (6 points) et une analyse de documents (14 points). Les méthodes de cette fiche servent dès maintenant.

## Lire un document statistique
1. **Identifier** : titre, source, date, champ (qui est concerné, où), unité.
2. **Lire une donnée** en phrase complète : « Selon l'INSEE, en 2023, 15 % des personnes… ».
3. **Dégager** la tendance générale, puis les **écarts** (entre groupes, territoires, années).
4. **Expliquer** avec le cours (déterminants, inégalités, protection sociale).

## Calculer pour comparer
| Le calcul | La formule | Exemple |
| **Taux d'évolution** | (valeur d'arrivée − valeur de départ) / valeur de départ × 100 | De 200 à 250 : (250 − 200) / 200 × 100 = + 25 % |
| **Coefficient multiplicateur** | valeur d'arrivée / valeur de départ | 250 / 200 = 1,25 |
| **Part** | partie / total × 100 | 30 sur 120 = 25 % |
| **Écart en points** | différence entre deux pourcentages | De 12 % à 15 % : + 3 points (et non + 3 %) |

> Ne confonds pas « + 3 points » (écart entre deux pourcentages) et « + 25 % » (taux d'évolution).

## Analyser un texte
Repère l'**auteur** et sa position (chercheur, institution, association, journaliste), l'**idée principale**, les **arguments**, et relie-les aux notions du programme.

## Répondre à une question de connaissances
1. **Définir** les notions du sujet.
2. **Organiser** la réponse en paragraphes (une idée par paragraphe).
3. **Illustrer** chaque idée par un exemple précis (dispositif, loi, acteur, chiffre).

## Construire une argumentation à partir de documents
1. **Analyser le sujet** : mots-clés, verbe de consigne (présenter, expliquer, analyser, montrer).
2. **Classer** les informations des documents selon les idées à développer.
3. **Rédiger** : une courte introduction qui pose le sujet, des paragraphes « **idée → document cité → explication** », une conclusion qui répond.
4. **Mobiliser le cours** : les documents ne suffisent pas, on attend tes connaissances.

## Les erreurs à éviter
| L'erreur | Le bon réflexe |
| Paraphraser le document | Expliquer ce qu'il montre et pourquoi |
| Citer un chiffre sans source ni date | « Selon la DREES, en 2022… » |
| Oublier les définitions | Définir chaque notion clé du sujet |
| Confondre les acteurs | CAF ≠ CPAM ≠ France Travail ≠ département |
| Écrire une liste | Rédiger des phrases liées par des connecteurs |`,
          },
          questions: [
            ['Comment l’épreuve écrite de STSS de terminale est-elle organisée ?', ['Un oral de 20 minutes', 'Une question de connaissances (6 points) et une analyse de documents (14 points), en 3 heures', 'Un QCM de 1 heure', 'Un dossier à rendre en première'], 1, 'Elle porte sur les programmes de première et de terminale.'],
            ['Une valeur passe de 200 à 250. Quel est le taux d’évolution ?', ['+ 50 %', '+ 25 %', '+ 20 %', '+ 125 %'], 1, '(250 − 200) / 200 × 100 = 25 %.'],
            ['Un taux passe de 12 % à 15 %. Comment qualifier l’écart ?', ['+ 3 %', '+ 3 points', '+ 15 %', '+ 25 points'], 1, 'L’écart entre deux pourcentages s’exprime en points ; le taux d’évolution serait + 25 %.'],
            ['Quelle est la première chose à identifier dans un document statistique ?', ['La couleur du graphique', 'Le titre, la source, la date, le champ et l’unité', 'Le nombre de pages', 'Le nom du professeur'], 1, 'Sans eux, on ne peut pas lire correctement les données.'],
            ['30 personnes sur 120 déclarent renoncer aux soins. Quelle part cela représente-t-il ?', ['4 %', '25 %', '30 %', '40 %'], 1, '30 / 120 × 100 = 25 %.'],
            ['Paraphraser un document suffit à l’analyser.', ['Vrai', 'Faux'], 1, 'Il faut expliquer ce qu’il montre et le relier au cours.'],
            ['Quelle structure de paragraphe est attendue dans une argumentation ?', ['Idée, document cité, explication', 'Chiffre seul', 'Liste de mots-clés', 'Citation sans commentaire'], 0, 'Chaque paragraphe développe une idée appuyée et expliquée.'],
            ['Comment calcule-t-on un coefficient multiplicateur ?', ['Valeur d’arrivée / valeur de départ', 'Valeur de départ − valeur d’arrivée', 'Valeur d’arrivée × 100', 'Valeur de départ / 100'], 0, 'Un coefficient de 1,25 correspond à une hausse de 25 %.'],
            ['Dans une réponse de connaissances, que faut-il faire en premier ?', ['Donner un exemple', 'Définir les notions du sujet', 'Conclure', 'Citer un document'], 1, 'Les définitions montrent la maîtrise du vocabulaire du programme.'],
            ['Comment la spécialité STSS de première est-elle évaluée ?', ['Par l’épreuve écrite de terminale uniquement, sans rien en première', 'En contrôle continu en première, puis par l’épreuve écrite de terminale qui reprend les deux années', 'Par un oral en fin de première', 'Elle n’est pas évaluée'], 1, 'Les notions de première sont aussi au programme de l’épreuve de terminale.'],
            ['Quelle formulation d’une donnée est correcte ?', ['« Il y a beaucoup de pauvres. »', '« Selon l’INSEE, en 2023, environ 15 % de la population vit sous le seuil de pauvreté. »', '« Les chiffres montrent des choses. »', '« 15. »'], 1, 'Une donnée bien citée a une source, une date, une unité et un champ.'],
            ['Quel est le coefficient de l’épreuve de STSS au bac ST2S ?', ['2', '6', '16', '20'], 2, 'C’est l’une des deux épreuves de spécialité, au coefficient 16 chacune.'],
          ],
        },
      ],
    },
  ],
}
