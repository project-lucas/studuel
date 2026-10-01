// INGÉNIERIE, INNOVATION ET DÉVELOPPEMENT DURABLE (2I2D) — TERMINALE STI2D
// (spécialité de 12 h, avec un enseignement spécifique au choix : AC, EE, ITEC
// ou SIN). Matière propre à la voie technologique.
//
// SOURCE : programme d’innovation technologique et d’ingénierie et
// développement durable de première et d’ingénierie, innovation et
// développement durable de terminale STI2D (annexe 1, arrêté du 17/01/2019,
// BO spécial n° 1 du 22/01/2019). 2I2D fusionne IT et I2D et ajoute des
// connaissances propres à chaque enseignement spécifique. L’axe de chaque fiche
// est la rubrique du programme qui la coiffe ; les quatre enseignements
// spécifiques ont chacun leur fiche, sous l’axe « Enseignement spécifique … ».
//
// ÉPREUVES (session 2026 et suivantes, note de service du 10/06/2025 publiée
// au BO n° 35 du 18/09/2025, présentation IGÉSR du 24/06/2025) : une épreuve
// ÉCRITE de 3 h 30 (2 h 30 de tronc commun + 1 h sur l’enseignement
// spécifique, coefficient 9) et une épreuve PRATIQUE de 2 h (concevoir, simuler,
// expérimenter : compétences CO5.8, CO6.5, CO7.6, coefficient 7). Le projet de
// 72 h nourrit l’épreuve pratique et le Grand oral. Avant 2026 : un écrit de
// 4 h, coefficient 16. Deux fiches méthode en fin de module.
//
// PAS DE LATEX : formules en texte, lignes « = » pour les formules à retenir.

export default {
  slug: 'i2d',
  nom: 'Ingénierie, innovation et développement durable',

  titreMigration: 'INGÉNIERIE, INNOVATION ET DÉVELOPPEMENT DURABLE Tle STI2D — LE PROGRAMME OFFICIEL (16 fiches)',

  motif: `Matière neuve de la voie technologique (Tle STI2D). Seize fiches rangées sous
les rubriques du programme officiel (BO spécial n° 1 du 22/01/2019, annexe 1) :
dix fiches de tronc commun (besoin et exigences, éco-conception, convertisseurs,
stockage, mécanique, résistance des matériaux, bilan énergétique, acquisition et
traitement de l'information, réseaux, asservissement), une fiche par
enseignement spécifique (AC, EE, ITEC, SIN), et deux fiches méthode : l'épreuve
écrite (3 h 30) et l'épreuve pratique avec le projet (2 h), format de la
session 2026.`,

  blocs: [
    {
      niveaux: ['Tle'],
      positionDepart: 1,
      chapitres: [
        // ---- 1 ---------------------------------------------------------------
        {
          titre: 'Analyse du besoin et exigences',
          axe: 'Outils de l’ingénierie système',
          lecon: {
            titre: 'Du besoin de l’usager aux exigences vérifiables',
            cours: `À l’épreuve comme en projet, tout commence par la lecture d’un **cahier des charges** exprimé en SysML. Savoir en extraire l’information utile est la première compétence attendue.

## Du besoin au système
~ Besoin → Cas d’utilisation → Exigences → Architecture → Constituants
| L’étape | La question | Le diagramme |
| **Besoin initial, mission** | À quoi sert le produit, pour qui ? | Texte, contexte |
| **Cas d’utilisation** | Quels services pour quels acteurs ? | uc |
| **Exigences** | Quelles performances vérifiables ? | req |
| **Architecture** | Quels blocs, quels flux ? | bdd, ibd |
| **Comportement** | Quels états, quels échanges ? | stm, sd |

## Lire un diagramme d’exigences
Chaque exigence a un **identifiant**, un **texte** et souvent un **critère chiffré**. Les relations utiles :
| La relation | Sens |
| **contient** (containment) | Une exigence se décompose en sous-exigences |
| **dérive de** (deriveReqt) | Une exigence technique découle d’une exigence de plus haut niveau |
| **satisfait** (satisfy) | Un bloc répond à une exigence |
| **vérifie** (verify) | Un essai ou une simulation contrôle une exigence |
| **raffine** (refine) | Un élément précise une exigence |

## L’IVVQ
| Le terme | Définition |
| **Intégration** | Assembler les constituants, sur site si possible |
| **Vérification** | Chaque constituant respecte-t-il sa spécification ? |
| **Validation** | Le système répond-il au besoin de l’usager ? |
| **Qualification** | Quelles sont les performances réelles du système produit ? |
> On **vérifie** par rapport aux **spécifications**, on **valide** par rapport au **besoin**.

## Exemple travaillé : une station de recharge de vélos
Exigence 1 « Recharger un vélo », décomposée en :
| Id | Texte | Critère |
| 1.1 | Recharger une batterie de 500 Wh | En moins de 4 h |
| 1.2 | Fonctionner hors réseau | Autonomie solaire de 3 jours |
| 1.3 | Protéger l’usager | Aucune partie sous tension accessible |
Vérification de 1.1 : un chargeur de 150 W de rendement 0,9 fournit 135 W à la batterie. Durée : 500 / 135 ≈ **3,7 h** < 4 h : l’exigence est **satisfaite**, avec une faible marge. Un chargeur de 120 W donnerait 500 / 108 ≈ 4,6 h : **non conforme**.

## Parties prenantes et contexte
Le besoin ne vient pas que de l’usager : **mainteneur**, **gestionnaire**, **réglementation** (normes électriques, accessibilité), **environnement** (intempéries, vandalisme) imposent aussi des exigences. Oublier une partie prenante, c’est oublier une exigence.

## À l’épreuve
Les questions typiques : « Relever l’exigence qui… », « Justifier que la solution satisfait l’exigence 1.2 », « Compléter le diagramme ibd ». La réponse attendue cite **l’identifiant** et compare une **valeur calculée** au **critère**.`,
          },
          questions: [
            ['Quel diagramme SysML présente les performances vérifiables attendues ?', ['sd', 'uc', 'req', 'bdd'], 2, 'Le diagramme d’exigences donne identifiant, texte et critère.'],
            ['Que signifie la relation « satisfy » dans un diagramme d’exigences ?', ['Un bloc répond à l’exigence', 'L’exigence est décomposée', 'L’exigence est supprimée', 'Un essai contrôle l’exigence'], 0, 'Elle relie un constituant à l’exigence qu’il satisfait.'],
            ['Quelle relation indique qu’un essai contrôle une exigence ?', ['contains', 'satisfy', 'refine', 'verify'], 3, 'Un cas de test ou une simulation vérifie l’exigence.'],
            ['On vérifie un constituant par rapport…', ['au besoin de l’usager', 'à sa spécification', 'au prix de vente', 'au planning'], 1, 'On valide le système par rapport au besoin.'],
            ['Un chargeur de 150 W de rendement 0,9 fournit à la batterie…', ['135 W', '150 W', '166 W', '90 W'], 0, '150 × 0,9 = 135 W.'],
            ['Combien de temps pour charger 500 Wh sous 135 W ?', ['Environ 2,7 h', 'Environ 3,7 h', 'Environ 4,6 h', 'Environ 6,8 h'], 1, '500 / 135 ≈ 3,7 h.'],
            ['Avec un chargeur de 120 W (rendement 0,9), l’exigence « moins de 4 h » est-elle satisfaite ?', ['Impossible à dire', 'Oui, largement', 'Oui, de justesse', 'Non : environ 4,6 h'], 3, '120 × 0,9 = 108 W ; 500 / 108 ≈ 4,6 h.'],
            ['Que désigne la qualification d’un système ?', ['La mesure de ses performances réelles une fois produit', 'Son prix', 'Son marketing', 'Son dessin'], 0, 'C’est la dernière lettre de l’IVVQ.'],
            ['La réglementation fait partie des parties prenantes à considérer.', ['Vrai', 'Faux'], 0, 'Normes électriques et accessibilité imposent des exigences.'],
            ['Quelle relation relie une exigence technique à l’exigence de haut niveau dont elle découle ?', ['satisfy', 'allocate', 'deriveReqt', 'verify'], 2, 'Elle « dérive » de l’exigence parente.'],
            ['À l’épreuve, que doit contenir une réponse « justifier que l’exigence est satisfaite » ?', ['Un dessin uniquement', 'La liste des composants', 'Une opinion', 'L’identifiant, une valeur calculée et sa comparaison au critère'], 3, 'On compare un résultat chiffré au critère de l’exigence.'],
            ['Une exigence sans critère chiffré est facilement vérifiable.', ['Vrai', 'Faux'], 1, 'Sans critère, on ne peut ni vérifier ni valider.'],
          ],
        },
        // ---- 2 ---------------------------------------------------------------
        {
          titre: 'Éco-conception et analyse de cycle de vie',
          axe: 'Approche environnementale',
          lecon: {
            titre: 'Chiffrer l’impact pour mieux le réduire',
            cours: `En terminale, l’éco-conception devient **quantitative** : on chiffre l’impact de chaque phase du cycle de vie, on compare des solutions, et l’on justifie un choix par des nombres.

## L’analyse de cycle de vie (ACV)
Normalisée (ISO 14040 et 14044), elle se déroule en quatre temps :
1. **Objectif et champ** : quelle **unité fonctionnelle** ? (« éclairer 10 m² à 300 lux pendant 10 ans »)
2. **Inventaire** : matières, énergie, transports, rejets à chaque phase.
3. **Évaluation des impacts** : climat (kg éq. CO2), eau, ressources, toxicité.
4. **Interprétation** : quelle phase et quel choix pèsent le plus ?

> Comparer deux produits n’a de sens que pour la **même unité fonctionnelle** : on compare des services rendus, pas des objets.

## Exemple travaillé : ampoule LED contre halogène
Unité fonctionnelle : 800 lumens pendant 10 000 h.
| | Halogène 53 W | LED 8 W |
| Nombre d’ampoules (durée de vie 2 000 h / 10 000 h) | 5 | 1 |
| Énergie consommée | 53 × 10 000 = 530 kWh | 8 × 10 000 = 80 kWh |
| Émissions de l’usage (60 g CO2/kWh, mix français) | 31,8 kg | 4,8 kg |
| Fabrication (ordre de grandeur) | 5 × 0,5 = 2,5 kg | 2 kg |
| **Total** | **≈ 34 kg éq. CO2** | **≈ 7 kg éq. CO2** |
La LED divise l’impact par près de **5** ; l’usage domine dans les deux cas. Avec un mix électrique très carboné (500 g/kWh), l’écart en valeur absolue serait bien plus grand.

## Les indicateurs à connaître
| L’indicateur | Unité |
| Réchauffement climatique | kg éq. CO2 |
| Énergie primaire consommée | MJ ou kWh |
| Épuisement des ressources | kg éq. antimoine |
| Consommation d’eau | m³ |

## Labels et réglementation
- **RE2020** (bâtiments neufs) : limite la consommation d’énergie et l’empreinte carbone sur le cycle de vie.
- **Étiquette énergie** (appareils), **indice de réparabilité** (sur 10), **écolabel européen**.
- **Bâtiment passif**, **HQE** : labels de performance du bâtiment.

## Leviers et arbitrages
| Le levier | Exemple | Point de vigilance |
| Alléger | Remplacer l’acier par l’aluminium | L’aluminium primaire coûte plus d’énergie à produire |
| Allonger la durée de vie | Pièces vissées, pièces détachées | Coût de fabrication un peu plus élevé |
| Améliorer l’efficacité à l’usage | Moteur à haut rendement, veille | Électronique supplémentaire |
| Prévoir la fin de vie | Monomatériau, marquage des plastiques | Contraintes de conception |

> Un choix d’éco-conception se **justifie par un calcul** et par la phase qu’il améliore — jamais par une impression.

## L’apport de l’information
Une commande intelligente (détecteur de présence, régulation, programmation horaire) améliore souvent l’efficacité globale plus que le changement d’un composant. C’est l’approche **pluritechnologique** du programme : matière, énergie **et** information.`,
          },
          questions: [
            ['Qu’est-ce que l’unité fonctionnelle d’une ACV ?', ['L’unité de masse', 'Le nombre de pièces', 'Le service rendu, quantifié, qui sert de base de comparaison', 'Le prix unitaire'], 2, 'On compare des services rendus, pas des objets.'],
            ['Combien d’énergie consomme une ampoule de 53 W pendant 10 000 h ?', ['53 kWh', '530 kWh', '5 300 kWh', '5,3 kWh'], 1, '53 × 10 000 = 530 000 Wh = 530 kWh.'],
            ['Avec 60 g de CO2 par kWh, 80 kWh émettent…', ['0,48 kg', '4,8 kg', '48 kg', '480 kg'], 1, '80 × 60 = 4 800 g = 4,8 kg.'],
            ['Sur 10 000 h, une LED de 8 W émet environ 4,8 kg de CO2 pour son électricité et 2 kg pour sa fabrication. Quelle phase domine son impact ?', ['Le transport', 'L’usage', 'La fin de vie', 'La fabrication'], 1, 'L’électricité consommée pèse bien plus que la fabrication.', 'Dans l’exemple, quelle phase domine l’impact des deux ampoules ?'],
            ['Combien d’halogènes de 2 000 h faut-il pour 10 000 h d’éclairage ?', ['2', '5', '10', '20'], 1, '10 000 / 2 000 = 5.'],
            ['En quelle unité exprime-t-on l’impact sur le réchauffement climatique ?', ['kg éq. CO2', 'm³', 'kg éq. antimoine', 'kWh'], 0, 'Tous les gaz à effet de serre sont convertis en équivalent CO2.'],
            ['Quelle réglementation encadre l’empreinte carbone des bâtiments neufs ?', ['La norme USB', 'Le Code de la route', 'La RE2020', 'Le RGPD'], 2, 'Elle raisonne sur le cycle de vie du bâtiment.'],
            ['Comparer deux produits sans même unité fonctionnelle a du sens.', ['Vrai', 'Faux'], 1, 'Il faut comparer le même service rendu.'],
            ['Pourquoi remplacer l’acier par de l’aluminium n’est-il pas toujours gagnant ?', ['L’aluminium primaire demande beaucoup d’énergie à produire', 'L’aluminium ne se recycle pas', 'L’aluminium rouille', 'L’aluminium est plus lourd'], 0, 'Le gain à l’usage doit compenser le surcoût de fabrication.'],
            ['Quelles normes encadrent l’ACV ?', ['NF C 15-100', 'IEEE 802.11', 'ISO 9001', 'ISO 14040 et 14044'], 3, 'Ce sont les normes de l’analyse de cycle de vie.'],
            ['Un choix d’éco-conception se justifie…', ['par une impression', 'par un calcul et la phase qu’il améliore', 'par la couleur du produit', 'par la mode'], 1, 'On chiffre l’impact avant et après.'],
            ['Une commande intelligente peut améliorer l’efficacité globale plus qu’un changement de composant.', ['Vrai', 'Faux'], 0, 'N’utiliser l’énergie que quand c’est utile est un levier puissant.'],
          ],
        },
        // ---- 3 ---------------------------------------------------------------
        {
          titre: 'Convertisseurs et modulation de puissance',
          axe: 'Approche fonctionnelle et structurelle des chaînes de puissance',
          lecon: {
            titre: 'Doser l’énergie électrique',
            cours: `Entre la source et l’actionneur, l’énergie électrique doit être **mise en forme** : redressée, ondulée, abaissée, réglée. C’est le rôle des **convertisseurs statiques**, construits autour d’interrupteurs électroniques (transistors, diodes).

## Les quatre familles
| Le convertisseur | Conversion | Exemple d’usage |
| **Redresseur** | AC → DC | Chargeur, alimentation d’appareil |
| **Hacheur** | DC → DC (réglable) | Variateur de moteur à courant continu, trottinette |
| **Onduleur** | DC → AC (fréquence réglable) | Panneaux solaires sur le réseau, moteur de voiture électrique |
| **Gradateur** | AC → AC (valeur efficace réglable) | Variateur de lumière, démarreur progressif |

On distingue la **modulation** (commandée : on règle la puissance transmise) de l’**adaptation** (non commandée : transformateur, redresseur à diodes).

## La modulation par largeur d’impulsion (MLI)
Un transistor commute très vite entre **passant** et **bloqué**. La tension de sortie est un créneau de période T, à l’état haut pendant une durée t_on.
= Rapport cyclique α = t_on / T (entre 0 et 1)
= Tension moyenne en sortie d’un hacheur : U moy = α × U alim
En faisant varier α, on règle la tension moyenne, donc la vitesse d’un moteur ou la luminosité d’une LED. Comme le transistor est soit bloqué (pas de courant), soit saturé (presque pas de tension), il dissipe très peu : le rendement dépasse souvent **95 %**.

## Exemple travaillé : hacheur de moteur
Batterie 24 V, moteur à courant continu. On veut 18 V moyens.
α = 18 / 24 = **0,75**. À une fréquence de découpage de 20 kHz, T = 1 / 20 000 = 50 µs, donc t_on = 0,75 × 50 = **37,5 µs**.
La fréquence de 20 kHz est choisie au-dessus de l’audible (pas de sifflement) et assez haute pour que l’inductance du moteur lisse le courant.

## Le pont en H : deux sens de rotation
Quatre interrupteurs disposés en H autour du moteur : en fermant les diagonales T1-T4 ou T2-T3, on inverse le sens du courant, donc le **sens de rotation**. Il permet aussi le **freinage** (et la récupération d’énergie si la source l’accepte).

## L’onduleur et le moteur synchrone ou asynchrone
L’onduleur fabrique une tension alternative dont on règle **la fréquence et l’amplitude**. Or la vitesse d’un moteur alternatif dépend de la fréquence :
= Vitesse de synchronisme (tr/min) = 60 × f / p
(f en Hz, p nombre de paires de pôles). Un moteur à 2 paires de pôles alimenté en 50 Hz tourne à 60 × 50 / 2 = **1 500 tr/min** ; à 25 Hz, 750 tr/min.

## Réversibilité
| Le convertisseur | Réversible ? |
| Redresseur à diodes | Non |
| Hacheur 4 quadrants, onduleur | Oui : ils renvoient l’énergie de freinage vers la batterie ou le réseau |
> La réversibilité des convertisseurs est la clé du **freinage récupératif** : 10 à 25 % d’autonomie gagnée en ville pour un véhicule électrique.`,
          },
          questions: [
            ['Quel convertisseur transforme du continu en alternatif ?', ['Le hacheur', 'L’onduleur', 'Le gradateur', 'Le redresseur'], 1, 'Il alimente par exemple le moteur d’une voiture électrique.'],
            ['Qu’est-ce que le rapport cyclique α ?', ['La fréquence', 'La tension maximale', 'T / t_on', 't_on / T'], 3, 'Il est compris entre 0 et 1.'],
            ['Un hacheur alimenté en 24 V avec α = 0,5 fournit en moyenne…', ['6 V', '12 V', '24 V', '48 V'], 1, 'U moy = α × U alim = 0,5 × 24 = 12 V.'],
            ['Quel α faut-il pour obtenir 18 V moyens à partir de 24 V ?', ['0,25', '0,50', '0,75', '1,33'], 2, '18 / 24 = 0,75.'],
            ['Quelle est la période d’un signal de 20 kHz ?', ['5 µs', '20 µs', '50 µs', '500 µs'], 2, 'T = 1 / 20 000 = 50 µs.'],
            ['Pourquoi un hacheur a-t-il un excellent rendement ?', ['Ses transistors sont soit bloqués, soit saturés', 'Il n’a pas de composants', 'Il chauffe beaucoup', 'Il fonctionne sans courant'], 0, 'Dans les deux états, le produit U × I dans le transistor est très faible.'],
            ['À quoi sert un pont en H ?', ['À stocker l’énergie', 'À redresser le courant', 'À inverser le sens de rotation d’un moteur', 'À mesurer la vitesse'], 2, 'On inverse le sens du courant dans le moteur.'],
            ['Vitesse de synchronisme d’un moteur à 2 paires de pôles en 50 Hz ?', ['750 tr/min', '1 500 tr/min', '3 000 tr/min', '6 000 tr/min'], 1, '60 × 50 / 2 = 1 500 tr/min.'],
            ['Un redresseur à diodes est réversible.', ['Vrai', 'Faux'], 1, 'Les diodes ne laissent passer le courant que dans un sens.'],
            ['Quel convertisseur règle la luminosité d’une lampe sur le secteur alternatif ?', ['L’onduleur', 'Le hacheur', 'Le redresseur', 'Le gradateur'], 3, 'Il règle la valeur efficace d’une tension alternative.'],
            ['Pourquoi choisir une fréquence de découpage de 20 kHz ?', ['Par tradition', 'Pour que le moteur siffle', 'Au-dessus de l’audible, et pour lisser le courant', 'Pour réduire la tension'], 2, 'L’inductance du moteur lisse d’autant mieux que la fréquence est haute.'],
            ['Le freinage récupératif repose sur la réversibilité des convertisseurs.', ['Vrai', 'Faux'], 0, 'L’énergie de freinage retourne vers la batterie.'],
          ],
        },
        // ---- 4 ---------------------------------------------------------------
        {
          titre: 'Le stockage de l’énergie',
          axe: 'Approche fonctionnelle et structurelle des chaînes de puissance',
          lecon: {
            titre: 'Mettre l’énergie de côté pour plus tard',
            cours: `Les énergies renouvelables sont **intermittentes**, les véhicules doivent être **autonomes** : stocker l’énergie est devenu central. Chaque technologie répond à un compromis entre **quantité** stockée, **puissance** disponible, **durée de vie** et **coût**.

## Les formes de stockage
| La forme | Technologie | Principe |
| **Chimique** | Batterie lithium-ion, plomb, hydrogène | Réaction d’oxydoréduction réversible, ou combustible |
| **Électrostatique** | Condensateur, supercondensateur | Charges accumulées sur des électrodes |
| **Mécanique** | Volant d’inertie, STEP (barrage de pompage), air comprimé | Énergie cinétique ou potentielle |
| **Thermique** | Ballon d’eau chaude, sels fondus, matériau à changement de phase | Chaleur sensible ou latente |

## Caractériser une batterie
| La grandeur | Unité | Sens |
| **Tension nominale** | V | Tension moyenne en décharge |
| **Capacité** | Ah | Charge électrique disponible |
| **Énergie stockée** | Wh | E = U × Q |
| **Énergie massique** | Wh/kg | Énergie par kilo : autonomie à masse donnée |
| **Puissance massique** | W/kg | Aptitude à fournir vite l’énergie |
| **Nombre de cycles** | — | Durée de vie en charges-décharges |
| **Profondeur de décharge** | % | Part de la capacité qu’on s’autorise à utiliser |

## Ordres de grandeur
| La technologie | Énergie massique | Puissance massique |
| Plomb | 30 à 40 Wh/kg | Moyenne |
| Lithium-ion | 150 à 250 Wh/kg | Bonne |
| Supercondensateur | 5 à 10 Wh/kg | Très élevée |
| Hydrogène (avec réservoir) | ≈ 1 000 à 1 500 Wh/kg de système | Limitée par la pile à combustible |
> Batterie = beaucoup d’**énergie** ; supercondensateur = beaucoup de **puissance** d’un coup. On les associe souvent.

## Associer des cellules
- En **série** : les tensions s’additionnent, la capacité reste celle d’une cellule.
- En **parallèle** : les capacités s’additionnent, la tension reste celle d’une cellule.
Exemple : des cellules de 3,6 V et 3 Ah. Un pack « 10S3P » (10 en série, 3 en parallèle) donne 10 × 3,6 = **36 V** et 3 × 3 = **9 Ah**, soit 36 × 9 = **324 Wh** avec 30 cellules.

## Exemple travaillé : dimensionner une batterie
Un robot consomme 60 W en moyenne pendant 4 h. Énergie nécessaire : 60 × 4 = 240 Wh. On ne décharge qu’à 80 % pour préserver la batterie : énergie à installer = 240 / 0,8 = **300 Wh**. En 24 V : Q = 300 / 24 = **12,5 Ah**. En lithium-ion à 180 Wh/kg, la masse est d’environ 300 / 180 ≈ **1,7 kg** ; en plomb à 35 Wh/kg, **8,6 kg**.

## Le stockage thermique
= Q = m × c × ΔT (chaleur sensible)
Un ballon de 200 L d’eau (c = 4 185 J/(kg·°C)) chauffé de 15 à 60 °C stocke 200 × 4 185 × 45 ≈ 37,7 MJ, soit environ **10,5 kWh**. En pilotant le chauffage aux heures de production solaire ou creuses, le ballon devient une « batterie » de chaleur.

## Le système de gestion
Une batterie lithium est toujours associée à un **BMS** (battery management system) : il surveille tensions, courants et températures de chaque cellule, équilibre les charges et coupe en cas de danger. C’est la chaîne d’information au service de la chaîne de puissance.`,
          },
          questions: [
            ['Quelle grandeur exprime l’énergie par kilogramme d’une batterie ?', ['La capacité', 'L’énergie massique', 'La tension nominale', 'Le nombre de cycles'], 1, 'Elle se mesure en Wh/kg et conditionne l’autonomie.'],
            ['Quel stockage fournit le plus de puissance d’un coup ?', ['Le supercondensateur', 'Le ballon d’eau chaude', 'L’hydrogène', 'La batterie au plomb'], 0, 'Sa puissance massique est très élevée, mais son énergie massique faible.'],
            ['Quelle énergie stocke une batterie de 12 V et 50 Ah ?', ['62 Wh', '600 Wh', '4,2 Wh', '6 kWh'], 1, 'E = U × Q = 12 × 50 = 600 Wh.'],
            ['En série, que devient la tension de plusieurs cellules ?', ['Elle s’annule', 'Elle reste la même', 'Elle s’additionne', 'Elle se divise'], 2, 'La capacité, elle, reste celle d’une cellule.'],
            ['Un pack 10S3P de cellules 3,6 V / 3 Ah donne…', ['36 V et 9 Ah', '10,8 V et 30 Ah', '36 V et 3 Ah', '108 V et 9 Ah'], 0, '10 en série : 36 V ; 3 en parallèle : 9 Ah.'],
            ['Un robot de 60 W fonctionne 4 h avec une décharge limitée à 80 %. Énergie à installer ?', ['240 Wh', '192 Wh', '300 Wh', '480 Wh'], 2, '240 / 0,8 = 300 Wh.'],
            ['300 Wh sous 24 V correspondent à une capacité de…', ['7,2 Ah', '12,5 Ah', '24 Ah', '72 Ah'], 1, 'Q = 300 / 24 = 12,5 Ah.'],
            ['Quelle est l’énergie massique typique d’une batterie lithium-ion ?', ['5 à 10 Wh/kg', '30 à 40 Wh/kg', '150 à 250 Wh/kg', '5 000 Wh/kg'], 2, 'C’est ce qui en fait la batterie des véhicules électriques.'],
            ['Une STEP (barrage de pompage) stocke l’énergie sous forme…', ['mécanique (potentielle)', 'thermique', 'chimique', 'électrostatique'], 0, 'On remonte l’eau quand l’électricité abonde.'],
            ['Quel est le rôle d’un BMS ?', ['Convertir en alternatif', 'Refroidir le moteur', 'Augmenter la tension', 'Surveiller et protéger les cellules d’une batterie'], 3, 'Il équilibre les cellules et coupe en cas de danger.'],
            ['Chauffer 200 L d’eau de 15 à 60 °C stocke environ…', ['1 kWh', '10,5 kWh', '105 kWh', '37,7 kWh'], 1, '200 × 4 185 × 45 ≈ 37,7 MJ ≈ 10,5 kWh.'],
            ['On associe souvent batterie et supercondensateur pour combiner énergie et puissance.', ['Vrai', 'Faux'], 0, 'La batterie fournit l’énergie, le supercondensateur les pointes de puissance.'],
          ],
        },
        // ---- 5 ---------------------------------------------------------------
        {
          titre: 'Transmission de puissance : cinématique et dynamique',
          axe: 'Comportement mécanique des produits',
          lecon: {
            titre: 'Vitesses, couples et puissance dans un mécanisme',
            cours: `Entre le moteur et l’effecteur, la puissance mécanique est **transmise** et **adaptée** : on échange de la vitesse contre du couple. Savoir calculer ce compromis est un classique de l’épreuve.

## Rotation et translation
= v = R × ω (v en m/s, R en m, ω en rad/s)
= ω = 2π × N / 60 (N en tr/min)
Une roue de rayon 0,3 m tournant à 10 rad/s avance à 3 m/s.

## Le rapport de transmission
= k = ω sortie / ω entrée
| Le transmetteur | Rapport |
| Engrenage (deux roues dentées) | k = Z entrée / Z sortie (Z : nombre de dents) |
| Poulies-courroie | k = D entrée / D sortie |
| Train d’engrenages | k = produit des rapports de chaque étage |
| Vis-écrou | v = pas × N / 60 (translation) |
| Pignon-crémaillère | v = R pignon × ω |
Un **réducteur** a k < 1 : il réduit la vitesse et augmente le couple.

## Puissance et couple
= P = C × ω
Si le rendement du transmetteur est η : P sortie = η × P entrée, donc
= C sortie = η × C entrée / k

## Exemple travaillé : un treuil
Moteur : 1 500 tr/min, 0,5 kW. Réducteur à deux étages : 12/48 puis 15/60. Tambour de rayon 0,1 m. Rendement du réducteur 0,9.
1. ω moteur = 2π × 1 500 / 60 ≈ **157 rad/s**.
2. k = (12/48) × (15/60) = 0,25 × 0,25 = **1/16**.
3. ω tambour = 157 / 16 ≈ **9,8 rad/s** ; vitesse du câble v = 0,1 × 9,8 ≈ **0,98 m/s**.
4. P tambour = 0,9 × 500 = **450 W** ; C tambour = 450 / 9,8 ≈ **46 N·m**.
5. Force dans le câble : F = C / R = 46 / 0,1 = **460 N**, soit une masse d’environ 46 kg levée à vitesse constante.

## La dynamique : démarrer et freiner
Pour accélérer, il faut un effort **supérieur** à celui du régime établi.
= En translation : ΣF = m × a
= En rotation : ΣC = J × dω/dt (J : moment d’inertie en kg·m²)
Au démarrage, le moteur doit fournir le couple résistant **plus** le couple d’accélération. C’est souvent ce cas qui dimensionne le moteur.

Exemple : un chariot de 200 kg doit atteindre 1 m/s en 2 s. a = 1 / 2 = 0,5 m/s² ; force d’accélération = 200 × 0,5 = **100 N**, à ajouter aux 60 N de résistance au roulement : 160 N au démarrage contre 60 N en régime établi.

## Liaisons et loi entrée-sortie
Pour un mécanisme de transformation de mouvement (bielle-manivelle, came), la relation entre entrée et sortie n’est pas constante. On l’obtient par une construction géométrique ou une **simulation** qui trace la loi entrée-sortie, à comparer au cahier des charges.

> À l’épreuve, écris toujours la formule, puis l’application numérique avec les unités, puis la comparaison au critère.`,
          },
          questions: [
            ['Convertir 1 500 tr/min en rad/s donne environ…', ['25 rad/s', '157 rad/s', '1 500 rad/s', '9 425 rad/s'], 1, 'ω = 2π × 1 500 / 60 ≈ 157 rad/s.'],
            ['Une roue de rayon 0,3 m tourne à 10 rad/s. Vitesse du véhicule ?', ['0,3 m/s', '3 m/s', '30 m/s', '33 m/s'], 1, 'v = R × ω = 0,3 × 10 = 3 m/s.'],
            ['Rapport d’un engrenage de 12 dents menant une roue de 48 dents ?', ['4', '0,25', '0,5', '36'], 1, 'k = Z entrée / Z sortie = 12 / 48 = 0,25.'],
            ['Rapport global de deux étages de rapport 0,25 chacun ?', ['0,5', '0,125', '0,0625', '0,25'], 2, 'On multiplie : 0,25 × 0,25 = 1/16 = 0,0625.'],
            ['Un réducteur…', ['augmente la vitesse et le couple', 'réduit la vitesse et augmente le couple', 'réduit le couple et la vitesse', 'ne change rien'], 1, 'Il échange de la vitesse contre du couple, aux pertes près.'],
            ['Un tambour reçoit 450 W à 9 rad/s. Quel couple ?', ['40,5 N·m', '50 N·m', '4 050 N·m', '0,02 N·m'], 1, 'C = P / ω = 450 / 9 = 50 N·m.'],
            ['Un couple de 46 N·m sur un tambour de rayon 0,1 m produit dans le câble une force de…', ['4,6 N', '46 N', '460 N', '4 600 N'], 2, 'F = C / R = 46 / 0,1 = 460 N.'],
            ['La puissance est conservée à travers un réducteur réel.', ['Vrai', 'Faux'], 1, 'Une partie se perd en frottements : P sortie = η × P entrée.'],
            ['Quelle relation régit l’accélération en translation ?', ['v = R × ω', 'ΣF = m × a', 'P = U × I', 'E = m × c × ΔT'], 1, 'C’est le principe fondamental de la dynamique.'],
            ['Un chariot de 200 kg accélère à 0,5 m/s². Force d’accélération ?', ['40 N', '100 N', '400 N', '200,5 N'], 1, 'F = m × a = 200 × 0,5 = 100 N.'],
            ['Pourquoi le démarrage dimensionne-t-il souvent le moteur ?', ['Parce que le moteur est froid', 'Parce que la tension est plus basse', 'Parce qu’il n’y a pas de frottement', 'Parce qu’il faut vaincre la résistance plus fournir l’accélération'], 3, 'Le couple demandé y est le plus élevé.'],
            ['Dans une transmission poulies-courroie, le rapport vaut…', ['D entrée / D sortie', 'Z entrée × Z sortie', 'Toujours 1', 'D sortie / D entrée'], 0, 'La vitesse linéaire de la courroie est la même sur les deux poulies.'],
          ],
        },
        // ---- 6 ---------------------------------------------------------------
        {
          titre: 'Résistance des matériaux et dimensionnement',
          axe: 'Comportement mécanique des produits',
          lecon: {
            titre: 'Dimensionner pour ne pas rompre ni trop fléchir',
            cours: `Une pièce bien conçue doit **résister** (ne pas céder) et rester assez **rigide** (ne pas trop se déformer). La résistance des matériaux (RdM) fournit les outils pour le vérifier.

## Contrainte et déformation
= Contrainte normale : σ = N / S (MPa si N en N et S en mm²)
= Déformation : ε = ΔL / L0 (sans unité)
= Loi de Hooke (domaine élastique) : σ = E × ε
E : module d’Young (acier 210 000 MPa, aluminium 70 000 MPa, bois 10 000 MPa, béton 30 000 MPa).

## Exemple travaillé : un tirant
Un tirant en acier de 2 m, section 100 mm², supporte 15 kN.
- σ = 15 000 / 100 = **150 MPa**.
- ε = σ / E = 150 / 210 000 ≈ 7,1 × 10⁻⁴.
- Allongement : ΔL = ε × L0 = 7,1 × 10⁻⁴ × 2 000 ≈ **1,4 mm**.
- Acier S235 : Re = 235 MPa. Coefficient de sécurité obtenu : s = 235 / 150 ≈ **1,6**.
Si le cahier des charges exige s ≥ 2, il faut σ ≤ 117,5 MPa, donc S ≥ 15 000 / 117,5 ≈ **128 mm²**.

## Les sollicitations simples
| La sollicitation | Effort | Exemple |
| Traction / compression | Effort normal N | Tirant, poteau |
| Flexion | Moment fléchissant | Poutre, plancher, étagère |
| Torsion | Moment de torsion | Arbre de transmission |
| Cisaillement | Effort tranchant | Rivet, axe de chape |

## La flexion, la plus fréquente
Une poutre chargée se courbe : la fibre supérieure est **comprimée**, la fibre inférieure **tendue**, la fibre du milieu (fibre neutre) ne change pas de longueur. La contrainte est maximale sur les fibres extrêmes.
> À quantité de matière égale, une section haute (poutre en I, tube) résiste bien mieux en flexion qu’une section pleine et plate : on place la matière **loin de la fibre neutre**. C’est pourquoi les poutres sont en I et les cadres de vélo en tube.

La **flèche** (déplacement vertical maximal) doit rester sous une limite (souvent portée / 300 à portée / 500 dans le bâtiment).

## Flambement
Une pièce **élancée** en compression (poteau fin, tige de vérin sortie) peut se dérober latéralement bien avant d’atteindre Re : c’est le **flambement**. On le prévient en raccourcissant la pièce ou en augmentant sa section.

## La simulation par éléments finis
Pour une forme réelle, le logiciel :
1. **maille** la pièce en petits éléments ;
2. applique le **matériau**, les **liaisons** (encastrements, appuis) et les **chargements** ;
3. calcule **contraintes** (souvent la contrainte de Von Mises) et **déplacements**.
On lit la contrainte maximale, on la compare à Re / s, on regarde la déformée. Attention aux **concentrations de contraintes** (angles vifs, trous) : un congé de raccordement les réduit fortement.

## Comparer et optimiser
Une étude de cas type : on compare deux géométries ou deux matériaux à masse égale, ou l’on allège une pièce en retirant la matière peu sollicitée (zones bleues), tout en gardant s ≥ valeur exigée.`,
          },
          questions: [
            ['Que vaut la contrainte dans un tirant de 100 mm² soumis à 15 kN ?', ['15 MPa', '150 MPa', '1 500 MPa', '0,15 MPa'], 1, 'σ = 15 000 / 100 = 150 MPa.'],
            ['Quelle loi relie contrainte et déformation dans le domaine élastique ?', ['La loi de Fourier', 'La loi d’Ohm', 'La loi de Hooke', 'La loi de Joule'], 2, 'La loi de Hooke s’écrit σ = E × ε : la contrainte est proportionnelle à la déformation, et E est le module de Young du matériau.'],
            ['Quel est le module d’Young approximatif de l’acier ?', ['70 000 MPa', '210 000 MPa', '10 000 MPa', '2 100 MPa'], 1, 'L’aluminium est trois fois moins rigide.'],
            ['Avec Re = 235 MPa et σ = 150 MPa, le coefficient de sécurité vaut environ…', ['0,64', '1,6', '2,35', '85'], 1, 's = Re / σ = 235 / 150 ≈ 1,57.'],
            ['Pour s ≥ 2 avec l’acier S235, la contrainte doit rester sous…', ['235 MPa', '117,5 MPa', '470 MPa', '150 MPa'], 1, 'Re / s = 235 / 2 = 117,5 MPa.'],
            ['Un arbre de transmission est principalement sollicité en…', ['compression', 'traction', 'flexion', 'torsion'], 3, 'Il transmet un couple.'],
            ['Dans une poutre en flexion, où la contrainte est-elle maximale ?', ['Nulle part', 'Sur la fibre neutre', 'Sur les fibres extrêmes', 'Au milieu de la section'], 2, 'Les fibres éloignées de la fibre neutre sont les plus tendues ou comprimées.'],
            ['Pourquoi les poutres sont-elles souvent en I ?', ['Pour l’esthétique', 'Pour placer la matière loin de la fibre neutre', 'Pour réduire la rigidité', 'Pour faciliter la corrosion'], 1, 'À masse égale, la section résiste bien mieux en flexion.'],
            ['Qu’est-ce que le flambement ?', ['Une instabilité latérale d’une pièce élancée comprimée', 'Un échauffement', 'Une corrosion', 'Une rupture par torsion'], 0, 'Elle peut survenir bien avant d’atteindre Re.'],
            ['Un congé de raccordement réduit les concentrations de contraintes.', ['Vrai', 'Faux'], 0, 'Les angles vifs concentrent les contraintes.'],
            ['Quel est l’allongement d’un tirant de 2 000 mm avec ε = 7 × 10⁻⁴ ?', ['0,14 mm', '1,4 mm', '14 mm', '140 mm'], 1, 'ΔL = ε × L0 = 7 × 10⁻⁴ × 2 000 = 1,4 mm.'],
            ['Dans une simulation par éléments finis, que doit-on définir en plus du maillage ?', ['Le planning', 'Uniquement la couleur', 'Le matériau, les liaisons et les chargements', 'Le prix'], 2, 'Sans eux, le calcul n’a pas de sens.'],
          ],
        },
        // ---- 7 ---------------------------------------------------------------
        {
          titre: 'Bilan énergétique et rendement global',
          axe: 'Comportement énergétique des produits',
          lecon: {
            titre: 'De la source à l’effecteur, chaque watt compte',
            cours: `Faire le **bilan énergétique** d’un produit, c’est suivre l’énergie de la source à l’effecteur, étage par étage, et localiser les pertes. C’est une question presque certaine à l’épreuve écrite.

## Les outils
= E = P × t
= η = P utile / P absorbée
= η global = η1 × η2 × … × ηn
= Pertes = P absorbée − P utile

## Les puissances selon les domaines
| Domaine | Effort × flux |
| Électrique continu | P = U × I |
| Électrique alternatif | P = U × I × cos φ (puissance active) |
| Mécanique en rotation | P = C × ω |
| Mécanique en translation | P = F × v |
| Hydraulique | P = Δp × Qv |
| Thermique | Φ (W), ou E = m × c × ΔT |

## Exemple travaillé : un ascenseur
Cabine chargée de 800 kg montée de 12 m en 15 s, contrepoids de 600 kg.
1. Masse nette à lever : 800 − 600 = 200 kg.
2. Énergie utile : m × g × h = 200 × 9,81 × 12 ≈ **23,5 kJ**.
3. Puissance utile : 23 500 / 15 ≈ **1,57 kW**.
4. Chaîne : variateur (0,96) → moteur (0,88) → réducteur (0,70, roue et vis sans fin) → poulie (0,97).
5. η global = 0,96 × 0,88 × 0,70 × 0,97 ≈ **0,57**.
6. Puissance absorbée au réseau : 1,57 / 0,57 ≈ **2,75 kW** ; pertes ≈ 1,2 kW, dont plus de la moitié dans le réducteur.
> L’étage de plus faible rendement est la cible : un réducteur à engrenages hélicoïdaux (0,95) ferait passer η global à 0,78.

## Le régime transitoire et le régime établi
Les constituants ont un **comportement temporel** : un moteur met du temps à atteindre sa vitesse, un bâtiment à se réchauffer, un condensateur à se charger. On distingue :
| La phase | Ce qu’on observe |
| **Transitoire** | Les grandeurs varient (démarrage, freinage) |
| **Établi** (permanent) | Les grandeurs sont stables |
L’énergie d’une phase variable se calcule comme l’**aire sous la courbe** P(t) : sur une montée linéaire de 0 à 2 kW en 4 s, E = ½ × 2 000 × 4 = **4 kJ**.

## Optimiser les échanges d’énergie
1. Réduire les pertes : meilleurs rendements, isolation, lubrification.
2. **Récupérer** : freinage récupératif, récupération de chaleur (VMC double flux).
3. **Piloter** : faire fonctionner chaque constituant au plus près de son rendement maximal ; couper ce qui ne sert pas.
4. **Stocker** pour décaler dans le temps (heures creuses, production solaire).

## Mesurer pour conclure
Le bilan se fait **sur des mesures** : wattmètre en entrée, couplemètre et tachymètre en sortie, ou capteurs de température et de débit pour le thermique. On compare ensuite rendement mesuré et rendement annoncé : l’écart renseigne sur l’état du produit ou la justesse du modèle.`,
          },
          questions: [
            ['Quelle est l’énergie potentielle gagnée par 200 kg levés de 12 m (g = 9,81) ?', ['2,4 kJ', '23,5 kJ', '235 kJ', '2 400 J'], 1, 'm × g × h = 200 × 9,81 × 12 ≈ 23 544 J.'],
            ['23 500 J fournis en 15 s correspondent à une puissance de…', ['352 kW', '1,57 kW', '15,7 kW', '157 W'], 1, 'P = E / t = 23 500 / 15 ≈ 1 567 W.'],
            ['Que vaut à peu près 0,96 × 0,88 × 0,70 × 0,97 ?', ['0,97', '0,78', '0,57', '0,35'], 2, 'Le produit donne environ 0,574.'],
            ['Pour 1,57 kW utiles avec η global = 0,57, la puissance absorbée vaut…', ['0,9 kW', '1,57 kW', '2,75 kW', '3,5 kW'], 2, '1,57 / 0,57 ≈ 2,75 kW.'],
            ['Quel étage faut-il améliorer en priorité dans l’ascenseur ?', ['Le réducteur roue et vis sans fin', 'La poulie', 'Le variateur', 'Le moteur'], 0, 'Son rendement de 0,70 est le plus faible.'],
            ['En alternatif, la puissance active vaut…', ['U / I', 'U × I × sin φ', 'U × I', 'U × I × cos φ'], 3, 'Le facteur cos φ tient compte du déphasage.'],
            ['Comment calcule-t-on l’énergie lorsque la puissance varie dans le temps ?', ['P maximale × durée', 'Aire sous la courbe P(t)', 'P moyenne × 2', 'Impossible'], 1, 'L’énergie est l’intégrale de la puissance.'],
            ['Puissance montant linéairement de 0 à 2 kW en 4 s. Énergie ?', ['2 kJ', '4 kJ', '8 kJ', '0,5 kJ'], 1, 'Aire du triangle : ½ × 2 000 × 4 = 4 000 J.'],
            ['Le contrepoids d’un ascenseur réduit l’énergie nécessaire pour monter la cabine.', ['Vrai', 'Faux'], 0, 'Seule la différence de masse est à lever.'],
            ['Une VMC double flux améliore l’efficacité en…', ['chauffant plus fort', 'récupérant la chaleur de l’air extrait', 'supprimant la ventilation', 'augmentant le débit'], 1, 'L’air entrant est préchauffé par l’air sortant.'],
            ['En régime établi, les grandeurs du système…', ['sont nulles', 'oscillent toujours', 'varient fortement', 'sont stables'], 3, 'Le transitoire correspond aux phases de démarrage ou de freinage.'],
            ['Quels appareils mesurent la puissance mécanique en sortie d’un moteur ?', ['Un couplemètre et un tachymètre', 'Un thermomètre', 'Un sonomètre', 'Un voltmètre seul'], 0, 'P = C × ω : il faut le couple et la vitesse.'],
          ],
        },
        // ---- 8 ---------------------------------------------------------------
        {
          titre: 'Acquisition, conversion et traitement de l’information',
          axe: 'Approche fonctionnelle et structurelle d’une chaîne d’information',
          lecon: {
            titre: 'Du phénomène physique au nombre traité',
            cours: `Pour piloter un produit, il faut **mesurer** : transformer un phénomène physique en un nombre que le programme peut traiter, avec une précision adaptée au besoin.

## La chaîne d’acquisition
~ Grandeur physique → Capteur → Conditionnement → CAN → Traitement numérique
| L’étage | Rôle |
| **Capteur** | Traduire la grandeur (température, force, position) en signal électrique |
| **Conditionnement** | Amplifier, filtrer (passe-bas), décaler pour utiliser toute la plage du CAN |
| **CAN** | Transformer la tension en nombre entier |
| **Traitement** | Convertir en unité physique, comparer, décider |

## Caractéristiques d’un capteur
Étendue de mesure, **sensibilité** (pente de la caractéristique), **résolution**, **précision**, **linéarité**, temps de réponse. On tient compte des **grandeurs d’influence** : un capteur de force peut dériver avec la température.

## Le CAN
= Quantum : q = pleine échelle / 2 puissance n
= Nombre obtenu : N = partie entière de (U / q)
= Tension reconstituée : U ≈ N × q

## Exemple travaillé : mesurer un niveau d’eau
Un capteur de pression donne 0,5 V pour une cuve vide et 4,5 V pour 2 m d’eau (caractéristique linéaire). CAN 12 bits, pleine échelle 5 V.
1. Sensibilité : (4,5 − 0,5) / 2 = **2 V/m**.
2. Quantum : 5 / 4 096 ≈ **1,22 mV**.
3. Résolution en hauteur : 1,22 mV ÷ 2 V/m ≈ 0,61 mm : **largement suffisant**.
4. Le programme lit N = 2 048. U = 2 048 × 1,22 mV ≈ 2,5 V. Hauteur : (2,5 − 0,5) / 2 = **1 m**.
Avec un CAN 8 bits, q ≈ 19,5 mV et la résolution tomberait à environ 1 cm.

## Le filtrage
Un filtre **passe-bas du premier ordre** (résistance + condensateur) laisse passer les basses fréquences et atténue les hautes :
= Fréquence de coupure : fc = 1 / (2π × R × C)
Avec R = 10 kΩ et C = 1 µF : fc = 1 / (2π × 10 000 × 0,000 001) ≈ **16 Hz**. Un niveau d’eau varie lentement ; le bruit à 50 Hz du secteur est atténué.
Le filtrage peut aussi être **numérique** : moyenne glissante sur les dernières mesures.

## Échantillonnage
Le CAN mesure à intervalles réguliers Te (fréquence fe = 1 / Te). Il faut échantillonner **assez vite** : au moins deux fois la plus haute fréquence utile du signal (théorème de Shannon). Trop lent, le signal reconstruit est faux ; inutilement rapide, on gaspille mémoire et calcul.

## Traitement : attention aux effets de bord
- Un entier sur 8 bits déborde au-delà de 255 ; sur 16 bits signé, au-delà de 32 767.
- Une division entière perd la partie décimale : 7 / 2 donne 3.
- Le temps de calcul compte dans un système temps réel.
> Le choix du type de variable (entier, flottant, taille) fait partie de la conception.

## Restituer l’information
L’information est ensuite **communiquée** : afficheur, voyant, son, écran tactile (IHM), ou envoi vers un serveur. Une bonne IHM donne l’information utile, au bon moment, sans ambiguïté.`,
          },
          questions: [
            ['Quel est le quantum d’un CAN 12 bits de pleine échelle 5 V ?', ['1,22 mV', '19,5 mV', '4,9 mV', '0,12 mV'], 0, '5 / 4 096 ≈ 1,22 mV.'],
            ['Capteur : 0,5 V à vide, 4,5 V pour 2 m. Sensibilité ?', ['1 V/m', '2 V/m', '2,25 V/m', '4 V/m'], 1, '(4,5 − 0,5) / 2 = 2 V/m.'],
            ['Avec ce capteur, quelle hauteur correspond à 2,5 V ?', ['0,5 m', '1 m', '1,25 m', '2 m'], 1, '(2,5 − 0,5) / 2 = 1 m.'],
            ['Quelle est la fréquence de coupure d’un filtre RC avec R = 10 kΩ et C = 1 µF ?', ['1,6 Hz', '16 Hz', '160 Hz', '10 kHz'], 1, 'fc = 1 / (2π × 0,01) ≈ 16 Hz.'],
            ['Un filtre passe-bas…', ['supprime la composante continue', 'atténue les basses fréquences', 'atténue les hautes fréquences', 'amplifie tout'], 2, 'Il garde la mesure lente et enlève le bruit rapide.'],
            ['Selon Shannon, la fréquence d’échantillonnage doit être au moins…', ['dix fois plus faible', 'quelconque', 'égale à la fréquence du signal', 'deux fois la plus haute fréquence utile'], 3, 'Sinon le signal reconstruit est faux.'],
            ['En division entière, que donne 7 / 2 ?', ['3,5', '3', '4', '2'], 1, 'La partie décimale est perdue.'],
            ['Quelle est la valeur maximale d’un entier 16 bits signé ?', ['255', '32 767', '65 535', '1 024'], 1, 'Il va de −32 768 à 32 767.'],
            ['Qu’est-ce qu’une grandeur d’influence ?', ['Le résultat affiché', 'La grandeur mesurée', 'Une grandeur qui perturbe la mesure, comme la température', 'La tension d’alimentation du CAN'], 2, 'Elle fait dériver la mesure du capteur.'],
            ['Passer d’un CAN 12 bits à un CAN 8 bits améliore la résolution.', ['Vrai', 'Faux'], 1, 'Moins de bits, quantum plus grand : résolution dégradée.'],
            ['Quel étage adapte le signal du capteur à la plage du CAN ?', ['Le traitement', 'Le conditionnement', 'L’IHM', 'Le serveur'], 1, 'Il amplifie, filtre et décale le signal.'],
            ['Une moyenne glissante sur les dernières mesures est un filtrage numérique.', ['Vrai', 'Faux'], 0, 'Elle lisse le signal comme un passe-bas.'],
          ],
        },
        // ---- 9 ---------------------------------------------------------------
        {
          titre: 'Réseaux, protocoles et objets connectés',
          axe: 'Comportement informationnel des produits',
          lecon: {
            titre: 'Faire dialoguer les constituants et les produits',
            cours: `Un produit moderne est un **objet communicant** : ses constituants dialoguent sur des bus, et le produit lui-même échange avec un réseau. Comprendre ces échanges permet de choisir une architecture et d’analyser un dysfonctionnement.

## Les bus de terrain et liaisons série
| La liaison | Fils | Usage typique |
| **UART** (série asynchrone) | TX, RX (+ masse) | Module GPS, Bluetooth, console |
| **I2C** | SDA (données), SCL (horloge) | Capteurs sur une carte, plusieurs esclaves adressés |
| **SPI** | 4 fils (MOSI, MISO, SCK, CS) | Écrans, cartes mémoire, débit élevé |
| **CAN** (bus automobile) | Paire différentielle | Véhicules, robustesse aux perturbations |
Une trame série comporte en général un bit de **start**, les **données**, parfois une **parité**, un bit de **stop**. Le **débit** s’exprime en bit/s (bauds).

## Les réseaux sans fil pour l’Internet des objets
| La technologie | Portée | Débit | Consommation |
| **Bluetooth Low Energy** | ~10 m | Moyen | Très faible |
| **Wi-Fi** | ~50 m | Élevé | Élevée |
| **LoRa, Sigfox** (LPWAN) | Plusieurs km | Très faible | Très faible |
| **4G/5G** | Réseau opérateur | Élevé | Élevée |
> Un capteur sur batterie qui envoie une mesure par heure choisit un réseau **basse consommation longue portée**, pas le Wi-Fi.

## Adressage IPv4
Une adresse IPv4 : 4 octets, par exemple 192.168.10.37 avec le masque 255.255.255.0 (noté /24).
= Adresse réseau = adresse IP ET masque (octet par octet)
Ici : réseau **192.168.10.0**, adresse de diffusion 192.168.10.255, machines de .1 à .254 : **254 adresses** utilisables.
Deux équipements communiquent directement s’ils ont la **même adresse réseau** ; sinon, ils passent par la **passerelle** (routeur).

## Exemple travaillé : un dysfonctionnement
Un automate a l’adresse 192.168.1.20/24, sa supervision 192.168.2.5/24, sans routeur entre eux. Réseaux : 192.168.1.0 et 192.168.2.0, **différents** : ils ne peuvent pas communiquer. Solution : placer la supervision en 192.168.1.x (x libre, différent de 20) ou configurer une passerelle.

## Protocoles et modèle TCP/IP
| La couche | Protocoles |
| Application | HTTP(S), MQTT (objets connectés), Modbus TCP |
| Transport | TCP (fiable, avec accusés de réception), UDP (rapide, sans garantie) |
| Internet | IP |
| Accès réseau | Ethernet, Wi-Fi |
**MQTT** fonctionne par **publication / abonnement** : un capteur publie « serre/temperature = 23,5 » sur un serveur (broker) ; tous les abonnés à ce sujet reçoivent la valeur.

## Architecture client-serveur et sécurité
Le produit (client) envoie ses données à un serveur web ou à une base de données, consultés depuis une application. Sécuriser, c’est : mots de passe robustes et non par défaut, chiffrement (HTTPS, TLS), mises à jour, **séparation** du réseau des objets et du réseau principal.`,
          },
          questions: [
            ['Combien de fils de signal utilise le bus I2C ?', ['1', '2 (SDA et SCL)', '4', '8'], 1, 'Données et horloge, plus la masse.'],
            ['Quel réseau choisir pour un capteur sur batterie envoyant une mesure par heure à plusieurs km ?', ['LoRa ou Sigfox', 'Ethernet', 'USB', 'Wi-Fi'], 0, 'Longue portée et très basse consommation.'],
            ['Quelle est l’adresse réseau de 192.168.10.37/24 ?', ['192.168.10.37', '192.168.10.0', '192.168.0.0', '192.168.10.255'], 1, 'Le masque /24 garde les trois premiers octets.'],
            ['Combien d’adresses de machines sont utilisables dans un réseau /24 ?', ['256', '255', '254', '24'], 2, 'On retire l’adresse réseau et l’adresse de diffusion.'],
            ['192.168.1.20/24 et 192.168.2.5/24 peuvent communiquer sans routeur.', ['Vrai', 'Faux'], 1, 'Leurs adresses réseau (192.168.1.0 et 192.168.2.0) diffèrent.'],
            ['Quel protocole de transport garantit la bonne réception des données ?', ['MQTT', 'UDP', 'TCP', 'IP'], 2, 'TCP utilise des accusés de réception.'],
            ['Comment fonctionne MQTT ?', ['Par publication et abonnement via un broker', 'Par diffusion radio FM', 'Par courrier électronique', 'Par appel téléphonique'], 0, 'Les abonnés à un sujet reçoivent les valeurs publiées.'],
            ['Que contient en général une trame série UART ?', ['Une adresse IP', 'Un fichier compressé', 'Seulement les données', 'Un bit de start, les données, éventuellement une parité, un bit de stop'], 3, 'Les bits de start et stop délimitent chaque caractère.'],
            ['Quel bus est utilisé dans l’automobile pour sa robustesse ?', ['I2C', 'Le bus CAN', 'UART', 'SPI'], 1, 'Sa paire différentielle résiste aux perturbations.'],
            ['Quelle mesure améliore la sécurité d’un objet connecté ?', ['Garder le mot de passe par défaut', 'Chiffrer les échanges et séparer le réseau des objets', 'Désactiver les mises à jour', 'Publier son adresse IP'], 1, 'Chiffrement, mises à jour et segmentation réduisent les risques.'],
            ['Quel équipement permet à deux réseaux IP différents de communiquer ?', ['Un CAN', 'Un filtre', 'Un capteur', 'Une passerelle (routeur)'], 3, 'Il achemine les paquets entre réseaux.'],
            ['Le bus SPI offre en général un débit plus élevé que l’I2C.', ['Vrai', 'Faux'], 0, 'Il est utilisé pour les écrans et cartes mémoire.'],
          ],
        },
        // ---- 10 --------------------------------------------------------------
        {
          titre: 'Asservissement et régulation',
          axe: 'Comportement informationnel des produits',
          lecon: {
            titre: 'Mesurer, comparer, corriger',
            cours: `Un four doit tenir sa température, un drone son altitude, un chauffage la consigne du salon — malgré les **perturbations**. C’est le rôle de la **boucle fermée**.

## Structure d’un système asservi
~ Consigne → Comparateur → Correcteur → Préactionneur → Actionneur → Processus → Capteur → retour au comparateur
| L’élément | Rôle |
| **Consigne** | Valeur voulue (21 °C) |
| **Capteur** | Mesure la grandeur réglée |
| **Comparateur** | Calcule l’écart : ε = consigne − mesure |
| **Correcteur** | Élabore la commande à partir de l’écart |
| **Actionneur** | Agit sur le processus (radiateur, moteur) |
| **Perturbation** | Ce qui dérange (fenêtre ouverte, vent, charge) |
On parle de **régulation** quand la consigne est fixe et qu’on lutte contre les perturbations, d’**asservissement** quand la sortie doit suivre une consigne qui change.

## Les critères de performance
| Le critère | Question | Mesure |
| **Stabilité** | Le système converge-t-il, sans osciller sans fin ? | Allure de la réponse |
| **Précision** | L’écart final est-il nul ou faible ? | Erreur statique |
| **Rapidité** | Atteint-il vite la consigne ? | Temps de réponse à 5 % |
| **Dépassement** | Dépasse-t-il la consigne ? | Dépassement en % |

## Les correcteurs
| Le correcteur | Principe | Effet |
| **Tout ou rien** (TOR) | Marche si mesure < consigne − hystérésis, arrêt au-dessus | Simple, oscille autour de la consigne |
| **Proportionnel** (P) | Commande = Kp × ε | Plus Kp est grand, plus c’est rapide, mais risque d’oscillation ; une erreur statique subsiste souvent |
| **Intégral** (I) | Ajoute la somme des écarts passés | Annule l’erreur statique, mais ralentit |
| **Dérivé** (D) | Réagit à la vitesse de variation de l’écart | Amortit, anticipe |
Le correcteur **PID** combine les trois ; on le règle par simulation puis par essais.

## Exemple travaillé : thermostat TOR avec hystérésis
Consigne 20 °C, hystérésis ± 0,5 °C. Le chauffage s’allume quand T < 19,5 °C et s’éteint quand T > 20,5 °C. La température oscille entre environ 19,5 et 20,5 °C. Sans hystérésis, le relais claquerait sans cesse autour de 20 °C et s’userait.

## Lire une réponse indicielle
On applique un échelon de consigne (de 0 à 100 tr/min) et on observe la sortie :
- La vitesse monte à 108 tr/min puis se stabilise à 98 tr/min.
- **Dépassement** : (108 − 98) / 98 ≈ 10 %.
- **Erreur statique** : 100 − 98 = 2 tr/min, soit 2 %.
- **Temps de réponse à 5 %** : instant après lequel la sortie reste entre 93,1 et 102,9 tr/min (± 5 % de la variation totale, ici de 0 à 98 tr/min, autour de la valeur finale).
> Il y a toujours un **compromis rapidité / stabilité** : pousser le gain accélère la réponse mais la rend plus oscillante.

## Où intervient la chaîne d’information ?
Le correcteur est aujourd’hui un **programme** dans un microcontrôleur : il lit le capteur à chaque période d’échantillonnage, calcule l’écart, puis la commande (souvent un rapport cyclique MLI envoyé au hacheur).`,
          },
          questions: [
            ['Quel élément calcule l’écart entre consigne et mesure ?', ['Le comparateur', 'L’actionneur', 'Le processus', 'Le capteur'], 0, 'ε = consigne − mesure.'],
            ['Une fenêtre ouverte dans une pièce chauffée est pour la régulation…', ['le capteur', 'la consigne', 'une perturbation', 'le correcteur'], 2, 'La boucle fermée doit la compenser.'],
            ['Quel correcteur annule l’erreur statique ?', ['Le tout ou rien', 'Aucun', 'Le proportionnel seul', 'L’intégral'], 3, 'Il accumule les écarts passés jusqu’à les annuler.'],
            ['Augmenter le gain proportionnel rend en général le système…', ['inactif', 'plus lent et plus stable', 'plus rapide mais plus oscillant', 'plus précis sans contrepartie'], 2, 'C’est le compromis rapidité / stabilité.'],
            ['Thermostat de consigne 20 °C avec hystérésis ± 0,5 °C : quand le chauffage s’allume-t-il ?', ['À 20 °C', 'Sous 19,5 °C', 'Au-dessus de 20,5 °C', 'À 19 °C'], 1, 'Il s’éteint au-dessus de 20,5 °C.'],
            ['À quoi sert l’hystérésis d’un thermostat TOR ?', ['À éviter que le relais commute sans cesse', 'À supprimer le capteur', 'À annuler les perturbations', 'À augmenter la température'], 0, 'Elle crée un écart entre seuil d’allumage et d’extinction.'],
            ['Sortie finale 98 pour une consigne de 100 : erreur statique ?', ['0 %', '2 %', '8 %', '10 %'], 1, '100 − 98 = 2, soit 2 %.'],
            ['Pic à 108 et valeur finale 98 : dépassement ?', ['8 %', '10 % environ', '18 %', '2 %'], 1, '(108 − 98) / 98 ≈ 10 %.'],
            ['Quelle différence entre régulation et asservissement ?', ['L’asservissement est en boucle ouverte', 'Aucune', 'Régulation : consigne fixe ; asservissement : la sortie suit une consigne variable', 'La régulation n’a pas de capteur'], 2, 'Les deux sont des boucles fermées.'],
            ['Le temps de réponse à 5 % est l’instant après lequel la sortie reste à ± 5 % de sa variation totale autour de sa valeur finale.', ['Vrai', 'Faux'], 0, 'Il mesure la rapidité du système.'],
            ['Que signifie PID ?', ['Proportionnel, intégral, dérivé', 'Programme, interface, donnée', 'Pression, inertie, débit', 'Puissance, intensité, durée'], 0, 'Le correcteur combine les trois actions.'],
            ['Dans un système numérique, le correcteur est souvent…', ['une résistance chauffante', 'une vanne manuelle', 'un ressort', 'un programme dans un microcontrôleur'], 3, 'Il calcule la commande à chaque période d’échantillonnage.'],
          ],
        },
        // ---- 11 --------------------------------------------------------------
        {
          titre: 'Architecture et construction',
          axe: 'Enseignement spécifique architecture et construction (AC)',
          lecon: {
            titre: 'Concevoir des bâtiments et des ouvrages durables',
            cours: `L’enseignement spécifique **architecture et construction** (AC) étudie les bâtiments et les ouvrages de travaux publics : comment ils tiennent, comment ils protègent leurs occupants, et comment ils s’intègrent dans un territoire en consommant le moins possible.

## Le projet de construction
| La phase | Contenu |
| Programme | Besoin du maître d’ouvrage, contraintes du site (PLU, sol, orientation) |
| Esquisse, APS, APD | Solutions architecturales de plus en plus précises |
| Permis de construire | Autorisation administrative |
| Consultation, exécution | Choix des entreprises, chantier |
| Réception, exploitation | Livraison, maintenance, fin de vie |
La **maquette numérique BIM** est partagée par tous les acteurs.

## Comment un bâtiment tient : la descente de charges
Les charges (poids propre, occupants, neige, vent) descendent par les **porteurs horizontaux** (planchers, poutres) vers les **porteurs verticaux** (poteaux, voiles), puis vers les **fondations** et le **sol**.
~ Plancher → Poutre → Poteau → Fondation → Sol
| Les fondations | Usage |
| **Superficielles** (semelles filantes, isolées, radier) | Bon sol peu profond |
| **Profondes** (pieux, micropieux) | Sol porteur profond |
Les ouvrages de soutènement (murs, parois moulées, terre armée) retiennent les terres.

Exemple : un poteau reprend 300 kN et le sol admet 0,2 MPa. Surface de semelle nécessaire : 300 000 / 0,2 = 1 500 000 mm², soit **1,5 m²** (semelle de 1,25 × 1,25 m environ).

## L’enveloppe et le confort
| Le confort | Grandeur | Solution |
| Thermique | Résistance thermique R, déperditions | Isolation, menuiseries performantes |
| Acoustique | Isolement en dB | Masse, désolidarisation |
| Visuel | Éclairement en lux, facteur de lumière du jour | Baies bien orientées |
| Qualité de l’air | Renouvellement | VMC simple ou double flux |

= Résistance thermique d’une couche : R = e / λ (m²·K/W)
= Flux à travers une paroi : Φ = S × ΔT / R total
Exemple : mur de 20 m², béton 20 cm (λ = 2) et laine de bois 16 cm (λ = 0,04). R = 0,20/2 + 0,16/0,04 = 0,1 + 4 = **4,1 m²·K/W**. Pour ΔT = 20 °C : Φ = 20 × 20 / 4,1 ≈ **98 W**. Sans isolant, Φ = 20 × 20 / 0,1 = **4 000 W** !

## La conception bioclimatique
1. **Orienter** : grandes baies au sud, peu au nord.
2. **Capter** le soleil l’hiver, s’en **protéger** l’été (casquettes, brise-soleil, végétation caduque).
3. **Stocker** la chaleur dans une masse (inertie thermique).
4. **Ventiler** naturellement l’été (ventilation traversante, nocturne).
5. **Isoler** et supprimer les **ponts thermiques**.
La **RE2020** fixe des seuils de besoin bioclimatique (Bbio), de consommation et d’empreinte carbone sur le cycle de vie : les matériaux biosourcés (bois, paille) y sont avantagés.

## Les matériaux de construction
| Le matériau | Atout | Limite |
| Béton armé | Résiste en compression, l’acier en traction | Forte empreinte carbone du ciment |
| Acier | Grandes portées, préfabrication | Sensible au feu, énergivore |
| Bois (lamellé-collé, CLT) | Léger, biosourcé, stocke le carbone | Protection contre l’humidité et le feu |
| Terre crue, paille | Très faible impact | Mise en œuvre spécifique |`,
          },
          questions: [
            ['Dans quel ordre les charges descendent-elles dans un bâtiment ?', ['Sol → fondation → poteau → plancher', 'Plancher → poutre → poteau → fondation → sol', 'Poteau → plancher → sol → fondation', 'Fondation → poutre → plancher → sol'], 1, 'Des porteurs horizontaux aux porteurs verticaux, puis au sol.'],
            ['Quand utilise-t-on des fondations profondes ?', ['Quand le bon sol est en surface', 'Quand le sol porteur est profond', 'Toujours', 'Jamais pour une maison'], 1, 'Pieux et micropieux vont chercher le bon sol en profondeur.'],
            ['Un poteau de 300 kN sur un sol admettant 0,2 MPa demande une semelle de…', ['0,15 m²', '1,5 m²', '15 m²', '60 m²'], 1, '300 000 / 0,2 = 1 500 000 mm² = 1,5 m².'],
            ['Quelle est la résistance thermique de 16 cm de laine de bois (λ = 0,04) ?', ['0,64 m²·K/W', '4 m²·K/W', '6,4 m²·K/W', '0,4 m²·K/W'], 1, 'R = e / λ = 0,16 / 0,04 = 4.'],
            ['Flux à travers 20 m² de mur de R = 4,1 pour ΔT = 20 °C ?', ['≈ 98 W', '≈ 400 W', '≈ 1 640 W', '≈ 16 W'], 0, 'Φ = 20 × 20 / 4,1 ≈ 98 W.'],
            ['Où placer les grandes baies en conception bioclimatique (hémisphère nord) ?', ['À l’ouest uniquement', 'Nulle part', 'Au nord', 'Au sud'], 3, 'Elles captent le soleil d’hiver, bas sur l’horizon.'],
            ['Dans le béton armé, quel matériau reprend la traction ?', ['L’acier', 'Le sable', 'L’eau', 'Le béton'], 0, 'Le béton résiste bien en compression, mal en traction.'],
            ['Quelle réglementation fixe le Bbio et l’empreinte carbone des bâtiments neufs ?', ['La norme ISO 9001', 'La RT 1974', 'La RE2020', 'Le PLU'], 2, 'Elle raisonne sur tout le cycle de vie.'],
            ['Qu’est-ce qu’un pont thermique ?', ['Un type de fondation', 'Un matériau isolant', 'Un pont chauffé', 'Une zone où l’isolation est interrompue et la chaleur fuit'], 3, 'Jonctions de planchers et de murs, par exemple.'],
            ['L’inertie thermique aide à lisser les variations de température.', ['Vrai', 'Faux'], 0, 'Une masse stocke la chaleur et la restitue plus tard.'],
            ['Pourquoi le bois est-il avantagé par la RE2020 ?', ['Il ne demande aucune protection', 'Il est incombustible', 'Il est biosourcé et stocke du carbone', 'Il est plus lourd'], 2, 'Son empreinte carbone sur le cycle de vie est faible.'],
            ['Quel outil partage la maquette 3D d’un bâtiment entre tous les acteurs ?', ['Le PID', 'Le BIM', 'Le PLU', 'Le CAN'], 1, 'Building Information Modeling.'],
          ],
        },
        // ---- 12 --------------------------------------------------------------
        {
          titre: 'Énergies et environnement',
          axe: 'Enseignement spécifique énergies et environnement (EE)',
          lecon: {
            titre: 'Produire, distribuer et gérer l’énergie intelligemment',
            cours: `L’enseignement spécifique **énergies et environnement** (EE) s’intéresse à la performance énergétique : comment produire, transporter, stocker et gérer l’énergie, du micro-générateur d’un capteur autonome jusqu’au réseau électrique d’un territoire.

## Le réseau électrique
~ Production → Transport (400 kV, 225 kV) → Distribution (20 kV, puis 400/230 V) → Consommateurs
On transporte en **haute tension** pour réduire les pertes : à puissance égale, le courant est plus faible, et les pertes par effet Joule (R × I²) chutent. Les **transformateurs** changent de niveau de tension.
Le réseau doit à chaque instant **équilibrer production et consommation** ; sinon, la fréquence (50 Hz) dérive.

## Les réseaux intelligents (smart grids)
L’information s’ajoute à l’énergie : compteurs communicants, pilotage des usages (recharge des véhicules aux heures creuses, effacement), prévision de production solaire et éolienne. La **production décentralisée** (toitures photovoltaïques) et l’**autoconsommation collective** transforment chaque bâtiment en producteur.

## Produire : quelques technologies
| La source | Grandeur clé |
| Photovoltaïque | Puissance crête (Wc) ; production annuelle ≈ 1 000 à 1 400 kWh par kWc en France |
| Éolien | P proportionnelle au cube de la vitesse du vent |
| Hydraulique | P = ρ × g × Qv × h × η |
| Cogénération | Produit électricité et chaleur à la fois |

## Exemple travaillé : une toiture solaire
18 panneaux de 400 Wc, soit **7,2 kWc**, dans une région à 1 200 kWh/kWc/an : production ≈ 7,2 × 1 200 = **8 640 kWh/an**. Le foyer consomme 6 000 kWh/an, dont 40 % pendant les heures de production. Autoconsommation : 0,4 × 6 000 = 2 400 kWh ; le reste de la production, 6 240 kWh, est injecté sur le réseau. Piloter le ballon d’eau chaude et le lave-linge aux heures solaires augmente l’autoconsommation.

## La pompe à chaleur
Elle prélève la chaleur de l’air, du sol ou de l’eau et la « remonte » dans le logement grâce à un compresseur.
= COP = chaleur fournie / énergie électrique consommée
Avec un COP de 3,5, 1 kWh électrique fournit 3,5 kWh de chaleur, dont 2,5 kWh pris gratuitement à l’environnement. Le COP baisse quand l’écart de température entre la source et le logement augmente (grand froid).

## Les micro-énergies
Un capteur autonome peut récupérer quelques milliwatts : mini-panneau solaire, vibrations (piézoélectrique), écart de température (effet Seebeck). Il faut alors concevoir une électronique **ultra-sobre** : mise en veille, mesures espacées, radio basse consommation.

## Gérer l’énergie dans un bâtiment
- **Régulation** du chauffage par pièce, programmation horaire.
- **Récupération** : VMC double flux (rendement 70 à 90 %), récupération sur eaux grises.
- **Mesure** : sous-comptage pour savoir où part l’énergie.
- **Stockage** : ballon d’eau chaude piloté, batterie domestique.
> Une gestion intelligente n’ajoute pas d’énergie : elle évite d’en gaspiller.`,
          },
          questions: [
            ['Pourquoi transporte-t-on l’électricité en haute tension ?', ['Pour réduire le courant et donc les pertes par effet Joule', 'Pour changer la fréquence', 'Par sécurité pour les usagers', 'Pour augmenter le courant'], 0, 'À puissance égale, I diminue et R × I² chute.'],
            ['Que se passe-t-il si production et consommation ne sont plus équilibrées ?', ['Les câbles s’allongent', 'Rien', 'La fréquence du réseau dérive', 'La tension devient continue'], 2, 'L’équilibre instantané est vital pour le réseau.'],
            ['7,2 kWc produisant 1 200 kWh par kWc et par an donnent…', ['864 kWh', '8 640 kWh', '86 400 kWh', '7 200 kWh'], 1, '7,2 × 1 200 = 8 640 kWh/an.'],
            ['Qu’est-ce que le COP d’une pompe à chaleur ?', ['Le rapport chaleur fournie / électricité consommée', 'Sa puissance électrique', 'Sa température de sortie', 'Son coût'], 0, 'Un COP de 3,5 fournit 3,5 kWh de chaleur par kWh électrique.'],
            ['Avec un COP de 3,5, quelle part de la chaleur vient de l’environnement pour 1 kWh électrique ?', ['1 kWh', '2,5 kWh', '3,5 kWh', '0,5 kWh'], 1, '3,5 − 1 = 2,5 kWh pris à l’air, au sol ou à l’eau.'],
            ['Le COP d’une pompe à chaleur air-eau augmente par grand froid.', ['Vrai', 'Faux'], 1, 'Il baisse quand l’écart de température augmente.'],
            ['La puissance d’une éolienne est proportionnelle…', ['à la racine de la vitesse', 'à la vitesse du vent', 'au carré de la vitesse', 'au cube de la vitesse du vent'], 3, 'Doubler la vitesse multiplie la puissance par huit.'],
            ['Qu’apporte un smart grid par rapport à un réseau classique ?', ['Plus de câbles', 'La communication et le pilotage des usages et productions', 'Une tension plus haute', 'La suppression des transformateurs'], 1, 'L’information s’ajoute à l’énergie.'],
            ['Quel effet permet de produire de l’électricité à partir d’un écart de température ?', ['Effet Joule', 'Effet Seebeck', 'Effet photoélectrique', 'Effet Doppler'], 1, 'C’est le principe des thermogénérateurs.'],
            ['Comment augmenter l’autoconsommation d’une toiture solaire ?', ['Débrancher les panneaux', 'Augmenter la consommation totale', 'Consommer la nuit', 'Faire fonctionner les appareils pendant les heures de production'], 3, 'Ballon d’eau chaude et lave-linge pilotés aux heures solaires.'],
            ['Quel appareil change le niveau de tension sur le réseau alternatif ?', ['Le transformateur', 'Le hacheur', 'Le redresseur', 'L’onduleur'], 0, 'Il élève ou abaisse la tension alternative.'],
            ['Une gestion intelligente de l’énergie évite surtout de la gaspiller.', ['Vrai', 'Faux'], 0, 'Elle n’en produit pas, elle en économise.'],
          ],
        },
        // ---- 13 --------------------------------------------------------------
        {
          titre: 'Innovation technologique et éco-conception',
          axe: 'Enseignement spécifique innovation technologique et éco-conception (ITEC)',
          lecon: {
            titre: 'Concevoir une pièce : forme, matériau, procédé',
            cours: `L’enseignement spécifique **innovation technologique et éco-conception** (ITEC) porte sur la **structure matérielle** des produits : définir la forme d’une pièce, choisir son matériau et son procédé, concevoir des mécanismes, en visant la compétitivité et un faible impact environnemental.

## Le triangle forme – matériau – procédé
On ne choisit jamais l’un sans les deux autres :
| Le choix | Il influence |
| **Matériau** | Les procédés possibles, la masse, le coût, le recyclage |
| **Procédé** | Les formes réalisables, les épaisseurs, les tolérances, le coût selon la quantité |
| **Forme** | La résistance, la fonction, l’esthétique |
> Une pièce injectée en plastique n’a pas la même forme qu’une pièce usinée en aluminium, même si elle remplit la même fonction.

## Les grandes familles de procédés
| Le procédé | Principe | Série économique | Règles de forme |
| **Moulage** (fonderie, injection plastique) | Matière liquide dans un moule | Grande série (moule coûteux) | Épaisseurs constantes, dépouilles, congés |
| **Usinage** (tournage, fraisage) | Enlèvement de matière | Unité à moyenne série | Accessibilité de l’outil, rayons d’outil |
| **Déformation** (emboutissage, pliage, forgeage) | Mise en forme à l’état solide | Grande série | Rayons de pliage, épaisseur constante |
| **Fabrication additive** | Ajout couche par couche | Unité, petite série, formes complexes | Supports, orientation, surplombs |
| **Découpe** (laser, jet d’eau, poinçonnage) | Contours dans une tôle | Toutes | Pièces planes |

## Exemple travaillé : choisir un procédé
Un boîtier de capteur à produire à 50 000 exemplaires par an.
| Procédé | Coût fixe | Coût par pièce | Coût total pour 50 000 |
| Impression 3D | 0 € | 6 € | 300 000 € |
| Usinage | 2 000 € | 9 € | 452 000 € |
| Injection plastique | 25 000 € (moule) | 0,80 € | 65 000 € |
L’injection s’impose en grande série. Le seuil de rentabilité face à l’impression 3D : 25 000 + 0,8 × n = 6 × n, soit n ≈ **4 800 pièces**. En dessous, l’impression 3D est moins chère.

## Concevoir en CAO pour le procédé
Pour une pièce injectée : **épaisseur constante** (sinon retassures), **dépouilles** de 1 à 2° pour démouler, **congés** partout, **nervures** pour rigidifier sans épaissir. La maquette numérique permet de simuler le remplissage du moule et de vérifier la résistance.

## Les solutions constructives mécaniques
| La fonction | Solutions |
| Guidage en rotation | Coussinets (bagues de frottement), roulements à billes |
| Guidage en translation | Glissières, rails à billes |
| Transmission | Engrenages, poulies-courroie, chaînes |
| Transformation de mouvement | Vis-écrou, pignon-crémaillère, bielle-manivelle, came |
| Assemblage | Démontable (vis, clips) ou permanent (soudure, collage, rivet) |
| Étanchéité | Joints toriques, joints à lèvre |
Pour l’éco-conception, on préfère des assemblages **démontables** et des pièces **monomatériau**.

## Innover
Intégration de fonctions (une pièce plastique avec charnière intégrée et clips), allègement par **optimisation topologique** (le logiciel retire la matière inutile), matériaux biosourcés ou recyclés, conception pour la réparation. Chaque innovation se **justifie** par un gain chiffré : masse, coût, nombre de pièces, impact.`,
          },
          questions: [
            ['Quels sont les trois choix interdépendants de la conception d’une pièce ?', ['Coût, délai, qualité', 'Couleur, prix, marque', 'Forme, matériau, procédé', 'Moteur, capteur, réseau'], 2, 'On ne choisit jamais l’un sans les deux autres.'],
            ['Quel procédé convient à une grande série de pièces plastiques ?', ['L’usinage unitaire', 'La découpe laser', 'L’impression 3D', 'L’injection plastique'], 3, 'Le moule est cher, mais la pièce revient très peu cher.'],
            ['Pourquoi prévoir des dépouilles sur une pièce moulée ?', ['Pour la colorer', 'Pour l’esthétique', 'Pour pouvoir la démouler', 'Pour l’alourdir'], 2, 'Une légère inclinaison des parois facilite l’extraction.'],
            ['Une épaisseur non constante sur une pièce injectée provoque…', ['une couleur plus vive', 'des retassures', 'une meilleure résistance', 'un démoulage plus facile'], 1, 'Les zones épaisses refroidissent mal et se creusent.'],
            ['Coût total de 50 000 pièces injectées (moule 25 000 €, 0,80 € la pièce) ?', ['40 000 €', '65 000 €', '25 800 €', '400 000 €'], 1, '25 000 + 0,80 × 50 000 = 65 000 €.'],
            ['Seuil de rentabilité entre impression 3D (6 €) et injection (25 000 € + 0,80 €) ?', ['Environ 4 800 pièces', 'Environ 48 000 pièces', 'Jamais', 'Environ 480 pièces'], 0, '25 000 / (6 − 0,8) ≈ 4 808.'],
            ['L’usinage est un procédé…', ['de déformation', 'additif', 'par enlèvement de matière', 'de moulage'], 2, 'Tournage et fraisage enlèvent des copeaux.'],
            ['Quel composant réalise un guidage en rotation à faible frottement ?', ['Un roulement à billes', 'Une crémaillère', 'Un rivet', 'Un joint torique'], 0, 'Les billes roulent au lieu de glisser.'],
            ['Pour l’éco-conception, quel assemblage préférer ?', ['Soudure systématique', 'Surmoulage de métal dans le plastique', 'Collage de matériaux différents', 'Assemblage démontable'], 3, 'Il facilite réparation et tri en fin de vie.'],
            ['Qu’est-ce que l’optimisation topologique ?', ['Choisir une couleur', 'Retirer par calcul la matière inutile d’une pièce', 'Dessiner un plan de ville', 'Planifier la production'], 1, 'Elle allège la pièce tout en gardant sa résistance.'],
            ['Les nervures rigidifient une pièce plastique sans l’épaissir.', ['Vrai', 'Faux'], 0, 'Elles évitent les zones épaisses sources de défauts.'],
            ['La fabrication additive est surtout rentable pour…', ['les très grandes séries', 'l’unité, les petites séries et les formes complexes', 'les pièces planes', 'les tôles'], 1, 'Elle n’a pas de coût d’outillage, mais un coût par pièce élevé.'],
          ],
        },
        // ---- 14 --------------------------------------------------------------
        {
          titre: 'Systèmes d’information et numérique',
          axe: 'Enseignement spécifique systèmes d’information et numérique (SIN)',
          lecon: {
            titre: 'Concevoir la partie numérique d’un produit communicant',
            cours: `L’enseignement spécifique **systèmes d’information et numérique** (SIN) étudie comment le traitement numérique de l’information pilote les produits et optimise leurs usages : cartes programmables, capteurs, interfaces, réseaux et logiciels.

## L’architecture matérielle
| Le composant | Usage |
| **Microcontrôleur** (carte type Arduino, ESP32) | Piloter des entrées-sorties en temps réel, faible consommation |
| **Nano-ordinateur** (type Raspberry Pi) | Système d’exploitation, serveur web, caméra, calculs lourds |
| **Objet connecté** | Carte + capteurs + module radio, relié à un serveur |
| **Modules radio** | Wi-Fi, Bluetooth, LoRa, selon portée, débit et consommation |
Les entrées-sorties : **numériques** (TOR : bouton, LED), **analogiques** (CAN), **MLI** (moteur, LED dimmable), **bus** (I2C, SPI, UART).

## L’architecture logicielle
| L’élément | Rôle |
| **Programme principal** | Initialisation, puis boucle infinie |
| **Fonctions / procédures** | Traitements réutilisables (lire_capteur, envoyer_mesure) |
| **Bibliothèques** | Code fourni pour un capteur ou un protocole |
| **Interruptions** | Traiter un événement urgent immédiatement |
| **Variables** | Nom, type (entier, flottant, booléen, chaîne), portée |
Les langages du programme sont **Python** et **C++**. Une bonne pratique : noms explicites, commentaires utiles, fonctions courtes.

## Exemple travaillé : une serre connectée
Cahier des charges : maintenir l’humidité du sol entre 40 et 60 %, envoyer les mesures toutes les 10 minutes.
| Ligne | Code (pseudo-code) |
| 1 | initialiser capteur, pompe, wifi |
| 2 | derniere_envoi ← 0 |
| 3 | tant que vrai : |
| 4 | h ← lire_humidite() |
| 5 | si h < 40 alors pompe ← MARCHE |
| 6 | si h > 60 alors pompe ← ARRET |
| 7 | si temps() − derniere_envoi ≥ 600 alors publier("serre/humidite", h) ; derniere_envoi ← temps() |
Les lignes 5 et 6 forment une régulation **tout ou rien avec hystérésis** (entre 40 et 60 %, on ne change rien). La ligne 7 évite l’instruction « attendre 600 s » qui bloquerait la régulation pendant dix minutes.

## Décrire et simuler le comportement
Diagrammes d’**états** (modes Auto / Manuel / Défaut), de **séquence** (dialogue carte – serveur – application), d’**activité** (algorithme). La simulation permet de tester la logique avant de câbler.

## Mettre au point
- **Débogage** : exécution pas à pas, points d’arrêt, affichage des variables sur la console série.
- **Tests unitaires** d’une fonction avec des valeurs connues (h = 39, 40, 61).
- **Vérification des effets de bord** : dépassement de capacité, temps de traitement, mémoire.

## Les interfaces homme-machine
Constituants visuels (écran, LED), sonores (buzzer), tactiles (dalle, boutons) ; interfaces hybrides (application smartphone). L’IHM doit rendre l’état du système **lisible** et les commandes **sûres**.

## Sécurité et données
Objets connectés = surface d’attaque. On change les identifiants par défaut, on chiffre (HTTPS, TLS), on met à jour les logiciels, on ne collecte que les **données nécessaires** (RGPD).`,
          },
          questions: [
            ['Quel composant choisir pour héberger un serveur web avec caméra ?', ['Un capteur de température', 'Un relais', 'Un microcontrôleur simple', 'Un nano-ordinateur'], 3, 'Il dispose d’un système d’exploitation et de plus de puissance.'],
            ['Quelle sortie permet de faire varier la vitesse d’un moteur à courant continu ?', ['Une sortie MLI', 'Une entrée analogique', 'Un bus I2C', 'Une sortie TOR'], 0, 'Le rapport cyclique règle la tension moyenne.'],
            ['Quels langages cite le programme de SIN ?', ['HTML uniquement', 'Scratch uniquement', 'Python et C++', 'Cobol et Fortran'], 2, 'Ce sont les langages de référence.'],
            ['Dans la serre, que se passe-t-il pour une humidité de 50 % ?', ['Le programme s’arrête', 'La pompe démarre', 'La pompe s’arrête', 'On ne change rien'], 3, 'Entre 40 et 60 %, l’état de la pompe est conservé : c’est l’hystérésis.'],
            ['Pourquoi éviter « attendre 600 s » dans la boucle principale ?', ['Cela coupe le wifi', 'Cela consomme trop de mémoire', 'Cela bloquerait la régulation pendant dix minutes', 'C’est interdit en Python'], 2, 'On compare plutôt le temps écoulé depuis le dernier envoi.'],
            ['À quoi sert une interruption ?', ['À arrêter définitivement le programme', 'À traiter immédiatement un événement urgent', 'À ralentir la boucle', 'À compiler le code'], 1, 'Le programme principal reprend ensuite.'],
            ['Qu’est-ce qu’un point d’arrêt en débogage ?', ['Un endroit où l’exécution s’interrompt pour inspecter les variables', 'Une fin de programme', 'Un bouton d’urgence', 'Une panne'], 0, 'On observe l’état du programme à cet instant.'],
            ['Quelles valeurs tester pour la règle « si h < 40 » ?', ['Aucune', 'Uniquement 50', '39, 40 et 41 autour du seuil', 'Uniquement 0'], 2, 'On teste juste en dessous, au seuil et au-dessus.'],
            ['Le RGPD impose de ne collecter que les données nécessaires.', ['Vrai', 'Faux'], 0, 'C’est le principe de minimisation des données.'],
            ['Quel diagramme décrit les modes Auto, Manuel et Défaut d’un système ?', ['Le diagramme d’états', 'Le diagramme de blocs', 'Le diagramme de Sankey', 'Le diagramme de Gantt'], 0, 'Chaque mode est un état.'],
            ['Pourquoi utiliser des bibliothèques ?', ['Pour éviter de tester', 'Pour chiffrer les données', 'Pour rendre le code plus lent', 'Pour réutiliser du code éprouvé (capteur, protocole)'], 3, 'Elles évitent de réécrire ce qui existe déjà.'],
            ['Garder les identifiants par défaut d’un objet connecté est sans risque.', ['Vrai', 'Faux'], 1, 'Ils sont connus et exploités par les attaquants.'],
          ],
        },
        // ---- 15 --------------------------------------------------------------
        {
          titre: 'Méthode : l’épreuve écrite de 2I2D',
          axe: 'Les épreuves du baccalauréat',
          lecon: {
            titre: 'Réussir l’écrit de 3 h 30',
            cours: `Depuis la session 2026, la spécialité 2I2D est évaluée par **deux épreuves** : un écrit et une épreuve pratique. Cette fiche prépare l’écrit.

## Le format
| L’élément | Ce qu’il faut savoir |
| **Durée** | 3 h 30 : environ 2 h 30 de **tronc commun**, puis 1 h sur ton **enseignement spécifique** (AC, EE, ITEC ou SIN) |
| **Coefficient** | 9 (l’épreuve pratique compte coefficient 7) |
| **Support** | L’étude d’un ou deux **produits réels** (système, ouvrage), avec un dossier technique et des documents réponses |
| **Compétences** | Analyser, modéliser, justifier des choix, dans l’approche matière – énergie – information |
Avant 2026, l’écrit durait 4 h (3/4 tronc commun, 1/4 spécifique). Les annales restent un excellent entraînement.

## Comment est construit un sujet
Une **mise en situation** présente le produit et une **problématique** (« Comment réduire la consommation de ce bâtiment ? »). Puis des parties d’une dizaine de questions, souvent **indépendantes** : tu peux sauter une question bloquante. Un **dossier technique** (DT) et des **documents ressources** (DR) donnent les données ; des **documents réponses** sont à rendre avec la copie.

## Les questions qui reviennent
| Le type | Ce qu’on attend |
| Relever une exigence, un constituant | L’identifiant, la valeur, la référence du document |
| Compléter un diagramme (ibd, chaîne de puissance, Sankey) | Les bons noms et la nature des flux |
| Calculer (puissance, rendement, énergie, contrainte, quantum) | Formule, application numérique, unité |
| Justifier un choix | Comparaison chiffrée à un critère du cahier des charges |
| Interpréter une simulation ou une courbe | Lecture précise, écart, conclusion |
| Conclure sur la problématique | Réponse argumentée qui reprend les résultats |

## Rédiger un calcul qui rapporte tous les points
1. **La formule littérale** : P = C × ω.
2. **L’application numérique** avec les unités : P = 12 × 157.
3. **Le résultat** avec unité et chiffres significatifs raisonnables : P ≈ 1,9 kW.
4. **La phrase de conclusion** : « 1,9 kW < 2,2 kW du moteur : le moteur convient. »
!> Erreur classique : oublier de convertir (tr/min en rad/s, mm² en m², Wh en J, kW en W). Pose les unités à chaque étape.

## Gérer le temps
| Étape | Temps conseillé |
| Lire la mise en situation et survoler tout le sujet | 10 à 15 min, pris sur les 2 h 30 du tronc commun |
| Tronc commun | le reste, environ 2 h 15 |
| Enseignement spécifique | 1 h, relecture comprise |
| Relecture, documents réponses | 5 à 10 min, pris sur la dernière heure |
Numérote clairement tes réponses, rends **tous** les documents réponses, même incomplets.

## Exemple de question et de réponse
Question : « Vérifier que la batterie de 48 V – 20 Ah permet 3 h de fonctionnement pour une consommation moyenne de 280 W. »
Réponse : énergie stockée E = U × Q = 48 × 20 = 960 Wh. Énergie nécessaire = 280 × 3 = 840 Wh. 960 Wh > 840 Wh : l’exigence est **satisfaite** (marge d’environ 14 %), sous réserve de ne pas décharger complètement la batterie.
> Un résultat seul rapporte peu ; un résultat **comparé** au critère, avec une conclusion, rapporte tout.

## Réviser efficacement
Refais des annales en temps limité, fabrique une fiche de formules par domaine (énergie, mécanique, information), et entraîne-toi à lire vite un diagramme SysML.`,
          },
          questions: [
            ['Quelle est la durée de l’écrit de 2I2D à partir de la session 2026 ?', ['2 h', '3 h', '3 h 30', '4 h'], 2, 'Environ 2 h 30 de tronc commun et 1 h d’enseignement spécifique.'],
            ['Quel est le coefficient de l’écrit de 2I2D depuis 2026 ?', ['7', '9', '16', '5'], 1, 'L’épreuve pratique compte coefficient 7.'],
            ['Combien de temps environ est consacré à l’enseignement spécifique à l’écrit ?', ['15 min', '1 h', '2 h 30', '3 h'], 1, 'Le reste porte sur le tronc commun.'],
            ['Que faut-il écrire en premier dans un calcul ?', ['Le résultat', 'La formule littérale', 'La conclusion', 'Le nom du document'], 1, 'Puis l’application numérique, le résultat avec unité et la conclusion.'],
            ['Quelle énergie stocke une batterie de 48 V et 20 Ah ?', ['68 Wh', '960 Wh', '480 Wh', '9,6 kWh'], 1, 'E = U × Q = 48 × 20 = 960 Wh.'],
            ['Une consommation de 280 W pendant 3 h représente…', ['93 Wh', '283 Wh', '840 Wh', '8 400 Wh'], 2, '280 × 3 = 840 Wh.'],
            ['Les questions d’une partie sont souvent indépendantes : on peut sauter une question bloquante.', ['Vrai', 'Faux'], 0, 'Il vaut mieux avancer et revenir ensuite.'],
            ['Que faut-il faire des documents réponses ?', ['Les garder', 'Les rendre tous avec la copie, même incomplets', 'Les recopier au propre sur la copie', 'Les rendre seulement s’ils sont complets'], 1, 'Un document réponse oublié, ce sont des points perdus.'],
            ['Quelle est l’erreur classique dans les calculs ?', ['Faire une phrase de conclusion', 'Utiliser la calculatrice', 'Écrire trop de formules', 'Oublier une conversion d’unités'], 3, 'tr/min en rad/s, Wh en J, kW en W…'],
            ['Que contient une réponse « justifier un choix » ?', ['Une comparaison chiffrée à un critère du cahier des charges', 'Un dessin', 'La définition du produit', 'Une opinion personnelle'], 0, 'On compare un résultat au critère attendu.'],
            ['Combien de temps consacrer à la lecture initiale du sujet ?', ['2 h', 'Aucun', '10 à 15 min', '1 h'], 2, 'Survoler tout le sujet évite les mauvaises surprises.'],
            ['Avant 2026, l’écrit de 2I2D durait 4 h.', ['Vrai', 'Faux'], 0, 'Avec 3/4 des questions en tronc commun et 1/4 en spécifique.'],
          ],
        },
        // ---- 16 --------------------------------------------------------------
        {
          titre: 'Méthode : l’épreuve pratique et le projet',
          axe: 'Les épreuves du baccalauréat',
          lecon: {
            titre: 'Concevoir, simuler, expérimenter en 2 heures',
            cours: `Nouvelle depuis la session 2026, l’**épreuve pratique** de 2I2D évalue ce que tu sais **faire** au laboratoire, sur un produit réel. Elle s’appuie sur tout ce que tu as pratiqué en activités et en projet.

## Le format
| L’élément | Ce qu’il faut savoir |
| **Durée** | 2 h |
| **Coefficient** | 7 |
| **Lieu** | Un laboratoire de 2I2D, si possible dans ton établissement |
| **Examinateur** | Un professeur de ton enseignement spécifique, qui ne t’a pas eu en classe dans l’année ; au plus trois candidats évalués en même temps |
| **Support** | Tout ou partie d’un produit : ouvrage, maquette, système ou sous-système |
| **Note** | Sur 20, avec un commentaire qualitatif |

## Les trois compétences évaluées
| La compétence | Ce que tu fais |
| **Concevoir** (CO5.8) | Proposer, choisir, modifier : une solution constructive (AC), le paramétrage d’une chaîne d’énergie (EE), une pièce en modeleur 3D (ITEC), un algorithme et un programme (SIN) |
| **Simuler** (CO6.5) | Lancer ou paramétrer une simulation, interpréter les résultats, conclure sur la performance |
| **Expérimenter** (CO7.6) | Mettre en œuvre un protocole, mesurer, comparer |

## La structure du sujet
1. **Découverte** du produit et de la problématique technique (souvent une **reconception** : améliorer une performance ou modifier une fonctionnalité).
2. **Conception**.
3. **Simulation**.
4. **Expérimentation**.
Les parties 2 à 4 peuvent venir dans n’importe quel ordre et ne sont pas forcément équilibrées.

## Bien se comporter pendant l’épreuve
- **Lis** tout le sujet avant de toucher au matériel.
- **Sécurité** d’abord : câblage hors tension, vérification avant mise sous tension, arrêt d’urgence repéré.
- **Explique** à l’examinateur ce que tu fais et pourquoi : il évalue ta démarche, pas seulement tes résultats.
- **Note** tes mesures dans un tableau, avec unités.
- Si un appareil ne répond pas comme prévu, **dis-le** et propose une hypothèse : c’est une compétence.
> Une mesure qui contredit la simulation n’est pas un échec : c’est l’occasion d’expliquer l’écart.

## Exemple (SIN)
Problématique : « Le portail doit s’arrêter en moins de 0,5 s après détection d’un obstacle. »
- Concevoir : modifier le programme pour traiter la cellule par **interruption** au lieu de la lire à chaque tour de boucle.
- Simuler : vérifier le diagramme d’états en simulation.
- Expérimenter : mesurer le temps de réaction avec un chronogramme (0,08 s mesuré), conclure : **conforme**.

## Le projet de 72 heures
En terminale, tu mènes en équipe un **projet pluritechnologique** d’environ 72 heures (conception, amélioration ou optimisation d’un produit), qui mobilise obligatoirement **matière, énergie et information**. Il nourrit l’épreuve pratique (tu y as pratiqué concevoir, simuler, expérimenter) et le **Grand oral**, que tu peux adosser à une question issue de ton projet.

## Pour le Grand oral
Choisis une question précise, liée à un vrai choix technique de ton projet ; appuie-toi sur un chiffre, une mesure, un schéma ; montre les compromis (coût, performance, environnement). Le jury attend un raisonnement, pas une récitation.`,
          },
          questions: [
            ['Quelle est la durée de l’épreuve pratique de 2I2D ?', ['1 h', '2 h', '3 h 30', '4 h'], 1, 'Elle se déroule dans un laboratoire de 2I2D.'],
            ['Quel est son coefficient ?', ['5', '7', '9', '16'], 1, 'L’écrit compte coefficient 9.'],
            ['Quelles sont les trois compétences évaluées à l’épreuve pratique ?', ['Dessiner, peindre, sculpter', 'Vendre, acheter, livrer', 'Lire, écrire, compter', 'Concevoir, simuler, expérimenter'], 3, 'Ce sont les compétences CO5.8, CO6.5 et CO7.6.'],
            ['Qui évalue le candidat ?', ['Un jury de parents', 'Son propre professeur de l’année', 'Un professeur de l’enseignement spécifique qui ne l’a pas eu en classe', 'Un inspecteur uniquement'], 2, 'L’examinateur ne peut pas évaluer un élève qu’il a eu dans l’année.'],
            ['Combien de candidats un examinateur évalue-t-il au plus en même temps ?', ['Un', 'Trois', 'Dix', 'Toute la classe'], 1, 'La note de service fixe ce maximum.'],
            ['En ITEC, la compétence « concevoir » consiste souvent à…', ['définir une pièce avec un modeleur numérique', 'paramétrer un onduleur', 'calculer une descente de charges', 'écrire un programme'], 0, 'Formes et dimensions à partir des contraintes fonctionnelles.'],
            ['Une mesure qui contredit la simulation est un échec de l’épreuve.', ['Vrai', 'Faux'], 1, 'Expliquer l’écart est une compétence valorisée.'],
            ['Que faire avant de toucher au matériel ?', ['Appeler l’examinateur pour la réponse', 'Mettre sous tension', 'Lire tout le sujet', 'Démonter le système'], 2, 'On comprend la problématique avant d’agir.'],
            ['Quelle est la durée indicative du projet de terminale ?', ['36 h', '72 h', '12 h', '150 h'], 1, 'Il mobilise matière, énergie et information.'],
            ['Un portail doit s’arrêter en moins de 0,5 s dès qu’un obstacle est détecté. Pourquoi traiter la cellule par interruption ?', ['Pour réagir immédiatement à l’obstacle', 'Pour ralentir le portail', 'Pour changer de langage', 'Pour économiser de la mémoire'], 0, 'On n’attend plus le tour de boucle suivant.', 'Dans l’exemple SIN, pourquoi traiter la cellule par interruption ?'],
            ['Un temps de réaction mesuré de 0,08 s pour une exigence de 0,5 s est…', ['impossible', 'à ignorer', 'non conforme', 'conforme'], 3, '0,08 s < 0,5 s.'],
            ['Le Grand oral peut s’appuyer sur une question issue du projet de 2I2D.', ['Vrai', 'Faux'], 0, 'Le projet fournit un raisonnement technique concret.'],
          ],
        },
      ],
    },
  ],
}
