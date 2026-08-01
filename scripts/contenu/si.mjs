// SI — Sciences de l'ingénieur (spécialité 1re et Tle).
// Programme structuré autour de la démarche de l'ingénieur : analyser un
// système, le modéliser, le simuler, le réaliser, l'expérimenter.
//
// ⚠️ NOTATION : le rendu des leçons ne gère pas le LaTeX. Les formules sont
// écrites en texte lisible (P = U × I, ω en rad/s).

export default {
  slug: 'si',
  nom: 'Sciences de l’ingénieur',
  blocs: [
    {
      niveaux: ['1re'],
      chapitres: [
        {
          titre: 'Analyser un système',
          lecon: {
            titre: 'Besoin, fonctions et chaînes',
            cours: `L'ingénieur ne commence pas par une solution : il commence par un **besoin**.

## Le cahier des charges
Il exprime le besoin en **fonctions de service**, chacune assortie de **critères**, de **niveaux** et de **flexibilité**. Exemple : « permettre le déplacement d'une personne » — critère : autonomie ; niveau : 40 km ; flexibilité : ± 5 km. Sans critère chiffré, une fonction n'est pas vérifiable.

## Les écarts
Toute la démarche SI se lit dans trois écarts : entre le **cahier des charges** et le **modèle** (l'hypothèse est-elle valable ?), entre le **modèle** et le **réel** (la simulation prédit-elle bien ?), entre le **réel** et le **cahier des charges** (le produit répond-il au besoin ?).

## La chaîne d'information
**Acquérir** (capteurs) → **traiter** (microcontrôleur, calculateur) → **communiquer** (bus, réseau, IHM). Elle décide.

## La chaîne d'énergie
**Alimenter** (batterie, secteur) → **distribuer** (relais, variateur, hacheur) → **convertir** (moteur, vérin) → **transmettre** (réducteur, courroie, engrenage) → **agir**. Elle exécute. Ces deux chaînes se croisent : l'information commande l'énergie, l'énergie renvoie de l'information par les capteurs.`,
          },
          questions: [
            ['Quelles sont les étapes de la chaîne d’énergie ?', ['Alimenter, distribuer, convertir, transmettre, agir', 'Acquérir, traiter, communiquer', 'Analyser, modéliser, valider', 'Mesurer, comparer, corriger'], 0, 'La chaîne d’information, elle, acquiert, traite et communique.'],
            ['Un capteur appartient à la chaîne d’information.', ['Vrai', 'Faux'], 0, 'Il réalise la fonction « acquérir ».'],
            ['Dans un cahier des charges, une fonction de service doit être assortie de…', ['Critères, niveaux et flexibilité', 'Un prix', 'Un fournisseur', 'Un délai seulement'], 0, 'Sans critère chiffré, elle n’est pas vérifiable.'],
            ['La démarche SI s’appuie sur l’analyse de trois écarts.', ['Vrai', 'Faux'], 0, 'Cahier des charges / modèle / réel, comparés deux à deux.'],
            ['Un moteur électrique réalise la fonction…', ['Convertir', 'Transmettre', 'Distribuer', 'Acquérir'], 0, 'Il convertit l’énergie électrique en énergie mécanique.'],
            ['Un réducteur réalise la fonction « transmettre ».', ['Vrai', 'Faux'], 0, 'Il adapte vitesse et couple entre le moteur et l’effecteur.'],
            ['L’écart entre le modèle et le réel sert à…', ['Valider la pertinence de la simulation', 'Fixer le prix', 'Choisir le fournisseur', 'Rédiger la notice'], 0, 'Il mesure la qualité des hypothèses de modélisation.'],
            ['Un variateur de vitesse relève de la fonction « distribuer ».', ['Vrai', 'Faux'], 0, 'Il module l’énergie envoyée au convertisseur.'],
          ],
        },
        {
          titre: 'Énergie et mécanique',
          lecon: {
            titre: 'Puissance, rendement et mouvement',
            cours: `Un système ne crée pas d'énergie : il en convertit, avec des pertes.

## Puissance et énergie
En électricité : P = U × I (watts, volts, ampères). En mécanique de rotation : P = C × ω, où C est le couple en newton-mètre et ω la vitesse angulaire en radians par seconde. L'énergie est la puissance intégrée dans le temps : E = P × t.

## Le rendement
η = puissance utile / puissance absorbée. Il est **toujours inférieur à 1** : les pertes se font en chaleur (effet Joule), en frottement, en bruit. Les rendements se **multiplient** en cascade : trois éléments à 0,9 donnent 0,73 au total.

## Statique et dynamique
Un solide est en équilibre si la somme des forces **et** la somme des moments sont nulles. En dynamique, le principe fondamental relie la résultante des forces à l'accélération : somme des forces = m × a.

## Transmission de mouvement
**Engrenages** (rapport = nombre de dents), **poulies-courroie** (rapport = diamètres), **vis-écrou** (transforme rotation en translation), **bielle-manivelle**. Réduire la vitesse **augmente** le couple d'autant : c'est le même produit P = C × ω qui se conserve, aux pertes près.`,
          },
          questions: [
            ['Quelle est la relation entre puissance, couple et vitesse angulaire ?', ['P = C × ω', 'P = C / ω', 'P = C + ω', 'P = C × ω²'], 0, 'Avec C en N·m et ω en rad/s.'],
            ['Le rendement d’un système réel peut dépasser 1.', ['Vrai', 'Faux'], 1, 'Il y a toujours des pertes : chaleur, frottement, bruit.'],
            ['Trois éléments de rendement 0,9 en cascade donnent un rendement global de…', ['0,73 environ', '0,9', '2,7', '0,3'], 0, 'Les rendements se multiplient : 0,9³ ≈ 0,729.'],
            ['En électricité, la puissance vaut…', ['U × I', 'U / I', 'U + I', 'U² × I'], 0, 'En courant continu, P = U × I.'],
            ['Un réducteur augmente le couple en diminuant la vitesse.', ['Vrai', 'Faux'], 0, 'Le produit couple × vitesse se conserve, aux pertes près.'],
            ['Un solide est en équilibre lorsque…', ['La somme des forces et celle des moments sont nulles', 'Sa vitesse est nulle', 'Sa masse est faible', 'Aucune force ne s’applique'], 0, 'Un solide en mouvement rectiligne uniforme est aussi en équilibre.'],
            ['Le système vis-écrou transforme une rotation en translation.', ['Vrai', 'Faux'], 0, 'C’est son usage principal, par exemple dans les axes de machines.'],
            ['Pour un engrenage, le rapport de transmission dépend…', ['Du nombre de dents', 'De la matière', 'De la couleur', 'De la température'], 0, 'Comme le rapport des diamètres pour les poulies.'],
          ],
        },
        {
          titre: 'Information, capteurs et programmation',
          lecon: {
            titre: 'Du signal physique à la décision',
            cours: `Un système intelligent perçoit, décide, agit — et recommence.

## Les capteurs
Un capteur transforme une grandeur physique en signal exploitable. **TOR** (tout ou rien : fin de course, bouton), **analogique** (température, luminosité, pression), **numérique** (bus I2C, SPI). Ses caractéristiques : étendue de mesure, **sensibilité**, **précision**, **temps de réponse**.

## La conversion analogique-numérique
Le CAN échantillonne et quantifie. Sur n bits, on dispose de 2 puissance n niveaux : 10 bits donnent 1024 niveaux. Le théorème de Shannon impose une fréquence d'échantillonnage **au moins double** de la fréquence maximale du signal, sinon le signal est irrémédiablement déformé.

## L'algorithme et le programme
Variables, conditions, boucles, fonctions. Un système embarqué exécute typiquement une **boucle infinie** : lire les entrées, calculer, écrire les sorties. L'algorithme se décrit avant d'être codé — organigramme, pseudo-code ou diagramme d'états.

## Les diagrammes d'états
Un état, des transitions, des conditions de franchissement. C'est l'outil le plus adapté pour décrire un système séquentiel : un portail (fermé, en ouverture, ouvert, en fermeture) se modélise en quatre états.`,
          },
          questions: [
            ['Un capteur TOR délivre…', ['Deux états possibles seulement', 'Une valeur continue', 'Une trame numérique', 'Une image'], 0, 'Tout ou rien : un fin de course, un bouton.'],
            ['Combien de niveaux offre une conversion sur 10 bits ?', ['1024', '100', '512', '2048'], 0, '2 puissance 10.'],
            ['Le théorème de Shannon impose d’échantillonner au moins au double de la fréquence maximale du signal.', ['Vrai', 'Faux'], 0, 'Sinon le signal reconstruit est faux.'],
            ['Que mesure la sensibilité d’un capteur ?', ['La variation de sortie pour une variation d’entrée donnée', 'Sa durée de vie', 'Son prix', 'Sa taille'], 0, 'À distinguer de la précision.'],
            ['Un système embarqué exécute souvent une boucle infinie.', ['Vrai', 'Faux'], 0, 'Lire les entrées, calculer, écrire les sorties, recommencer.'],
            ['Quel outil décrit le mieux un système séquentiel ?', ['Le diagramme d’états', 'Le schéma cinématique', 'Le diagramme des exigences', 'La nomenclature'], 0, 'États, transitions, conditions de franchissement.'],
            ['Le temps de réponse d’un capteur est sans importance en régulation.', ['Vrai', 'Faux'], 1, 'Un capteur trop lent déstabilise la boucle de régulation.'],
            ['Un capteur de température analogique délivre…', ['Un signal continu proportionnel à la grandeur', 'Un signal binaire', 'Une trame I2C', 'Une impulsion unique'], 0, 'Il doit ensuite être numérisé par un CAN.'],
          ],
        },
      ],
    },
    {
      niveaux: ['Tle'],
      chapitres: [
        {
          titre: 'Systèmes asservis',
          lecon: {
            titre: 'Boucle fermée, précision, stabilité',
            cours: `Asservir, c'est corriger en permanence l'écart entre ce qu'on veut et ce qu'on obtient.

## Boucle ouverte, boucle fermée
En **boucle ouverte**, la commande est envoyée sans vérification : une perturbation fausse le résultat. En **boucle fermée**, un capteur mesure la sortie, un comparateur calcule l'**erreur** (consigne − mesure), et le correcteur agit sur cette erreur.

## Les trois performances
**Stabilité** (le système converge au lieu d'osciller), **précision** (erreur statique faible), **rapidité** (temps de réponse court). Elles sont **antagonistes** : gagner en rapidité dégrade souvent la stabilité. Régler un asservissement, c'est arbitrer.

## Le correcteur PID
**P** (proportionnel) : réagit à l'erreur présente — augmente la rapidité, laisse une erreur statique. **I** (intégral) : accumule l'erreur passée — annule l'erreur statique, ralentit et déstabilise. **D** (dérivé) : anticipe la variation — amortit les oscillations, amplifie le bruit.

## Lire une réponse indicielle
Sur la réponse à un échelon, on lit le **temps de réponse à 5 %**, le **dépassement** (en % de la valeur finale) et l'**erreur statique** (écart résiduel). Ces trois lectures suffisent à diagnostiquer un réglage.`,
          },
          questions: [
            ['Que calcule le comparateur d’un système asservi ?', ['L’erreur entre la consigne et la mesure', 'La puissance consommée', 'Le rendement', 'La vitesse maximale'], 0, 'C’est cette erreur que le correcteur traite.'],
            ['Quelles sont les trois performances d’un asservissement ?', ['Stabilité, précision, rapidité', 'Puissance, couple, vitesse', 'Coût, poids, taille', 'Fiabilité, sécurité, confort'], 0, 'Elles sont largement antagonistes.'],
            ['L’action intégrale permet d’annuler l’erreur statique.', ['Vrai', 'Faux'], 0, 'Elle accumule l’erreur jusqu’à la faire disparaître, au prix de la rapidité.'],
            ['Quelle action du PID amortit les oscillations mais amplifie le bruit ?', ['L’action dérivée', 'L’action proportionnelle', 'L’action intégrale', 'Aucune'], 0, 'Elle réagit à la vitesse de variation de l’erreur.'],
            ['En boucle ouverte, une perturbation est automatiquement corrigée.', ['Vrai', 'Faux'], 1, 'Sans mesure de la sortie, le système ne sait pas qu’il dévie.'],
            ['Le dépassement se lit sur…', ['La réponse indicielle', 'Le diagramme d’états', 'La nomenclature', 'Le schéma électrique'], 0, 'Avec le temps de réponse à 5 % et l’erreur statique.'],
            ['Augmenter le gain proportionnel améliore toujours le système.', ['Vrai', 'Faux'], 1, 'Il accélère mais peut rendre le système oscillant, voire instable.'],
            ['Un correcteur agit à partir de…', ['L’erreur', 'La consigne seule', 'La mesure seule', 'La puissance disponible'], 0, 'C’est la différence consigne − mesure qui pilote la correction.'],
          ],
        },
        {
          titre: 'Modélisation et simulation',
          lecon: {
            titre: 'Prédire avant de fabriquer',
            cours: `Simuler coûte mille fois moins cher que se tromper en production.

## Pourquoi modéliser
Un modèle est une **représentation simplifiée** destinée à répondre à une question précise. Il n'est jamais « vrai » : il est **valide dans un domaine**. Un modèle de frottement sec suffit pour dimensionner un frein, pas pour prévoir son usure.

## Les modèles multiphysiques
Un même système associe mécanique, électrique, thermique, informatique. Les logiciels de simulation multiphysique permettent de coupler ces domaines et de voir, par exemple, comment l'échauffement d'un moteur dégrade son couple.

## La validation
On compare la **simulation** aux **mesures expérimentales**. Un écart n'invalide pas nécessairement le modèle : il faut d'abord se demander si l'hypothèse écartée (frottements négligés, inertie du capteur, jeu mécanique) explique l'écart observé.

## Les diagrammes SysML
**Diagramme des exigences** (ce que le système doit faire), **de définition de blocs** (de quoi il est fait), **de blocs internes** (comment les blocs échangent), **d'états** et **de séquence** (comment il se comporte dans le temps).`,
          },
          questions: [
            ['Un modèle est…', ['Une représentation simplifiée valide dans un domaine donné', 'Une copie exacte du réel', 'Un prototype', 'Un plan de fabrication'], 0, 'Il répond à une question précise, pas à toutes.'],
            ['Un écart entre simulation et mesure invalide forcément le modèle.', ['Vrai', 'Faux'], 1, 'Il faut d’abord examiner les hypothèses simplificatrices retenues.'],
            ['Quel diagramme SysML décrit ce que le système doit faire ?', ['Le diagramme des exigences', 'Le diagramme de blocs internes', 'Le diagramme d’états', 'Le diagramme de séquence'], 0, 'Il traduit le cahier des charges.'],
            ['Une simulation multiphysique couple plusieurs domaines.', ['Vrai', 'Faux'], 0, 'Mécanique, électrique, thermique, informatique.'],
            ['Le diagramme de blocs internes décrit…', ['Les échanges entre les composants', 'La liste des exigences', 'Le comportement temporel', 'Le coût'], 0, 'Flux d’énergie, de matière et d’information.'],
            ['Simuler permet de réduire le coût des erreurs de conception.', ['Vrai', 'Faux'], 0, 'C’est sa justification économique principale.'],
            ['Négliger les frottements dans un modèle est…', ['Une hypothèse à assumer et à vérifier', 'Toujours interdit', 'Sans conséquence', 'Une erreur de calcul'], 0, 'Toute simplification doit être explicite.'],
            ['Le diagramme de séquence décrit le comportement dans le temps.', ['Vrai', 'Faux'], 0, 'Il montre l’ordre des échanges entre acteurs et composants.'],
          ],
        },
        {
          titre: 'Projet et démarche d’ingénieur',
          lecon: {
            titre: 'Conduire un projet jusqu’au prototype',
            cours: `L'épreuve de projet évalue une **démarche**, pas seulement un objet qui fonctionne.

## Les étapes
Analyse du besoin → recherche de solutions → choix argumenté → conception détaillée → réalisation → essais → validation. Chaque étape produit un livrable, et chaque choix se justifie par un critère du cahier des charges.

## Le choix de solutions
Un tableau de comparaison croise les solutions candidates avec des critères **pondérés**. L'intérêt n'est pas le score final mais la **traçabilité** : on sait pourquoi telle solution a été écartée.

## L'expérimentation
Un protocole d'essai précise : la grandeur mesurée, le moyen de mesure, les conditions, le nombre de répétitions. Une mesure unique ne prouve rien ; une mesure sans incertitude annoncée n'est pas exploitable.

## Le développement durable
Analyse du cycle de vie : extraction, fabrication, transport, usage, fin de vie. Un système économe à l'usage mais coûteux à produire peut avoir un bilan global défavorable — l'ingénieur doit raisonner sur tout le cycle, pas sur la seule phase visible.`,
          },
          questions: [
            ['Dans un tableau de choix de solutions, l’essentiel est…', ['La traçabilité des critères de décision', 'Le score final', 'Le nombre de solutions', 'La rapidité du choix'], 0, 'On doit pouvoir expliquer pourquoi une solution a été écartée.'],
            ['Une mesure unique suffit à valider un système.', ['Vrai', 'Faux'], 1, 'Il faut des répétitions et une incertitude annoncée.'],
            ['Que comprend une analyse du cycle de vie ?', ['De l’extraction des matières à la fin de vie', 'La seule phase d’usage', 'La seule fabrication', 'Le transport uniquement'], 0, 'Le bilan global peut contredire l’intuition.'],
            ['Un protocole d’essai doit préciser les conditions de mesure.', ['Vrai', 'Faux'], 0, 'Grandeur, moyen, conditions, répétitions.'],
            ['Quelle est la première étape d’un projet d’ingénieur ?', ['L’analyse du besoin', 'La réalisation', 'Le choix du matériau', 'L’essai'], 0, 'Commencer par la solution est l’erreur la plus coûteuse.'],
            ['Un système économe à l’usage a forcément un bon bilan environnemental.', ['Vrai', 'Faux'], 1, 'Sa fabrication peut peser plus lourd que ses économies d’usage.'],
            ['Chaque choix de conception doit se justifier par…', ['Un critère du cahier des charges', 'L’avis du groupe', 'La disponibilité en magasin', 'L’esthétique'], 0, 'C’est ce qui rend la démarche défendable.'],
            ['La validation vient après les essais.', ['Vrai', 'Faux'], 0, 'Elle confronte les résultats d’essai aux exigences initiales.'],
          ],
        },
      ],
    },
  ],
}
