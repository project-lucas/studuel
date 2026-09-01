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
            cours: `L’ingénieur ne commence pas par une solution : il commence par un **besoin**. Tout le reste en découle, et se vérifie par rapport à lui.

## Le cahier des charges
Il exprime le besoin en **fonctions de service**, chacune assortie de trois éléments — sans lesquels la fonction n’est pas vérifiable.

| Élément | Ce qu’il précise | Exemple |
| La fonction | Ce que le système doit permettre | Permettre le déplacement d’une personne |
| Le critère | Sur quoi on la mesure | L’autonomie |
| Le niveau | La valeur attendue | 40 km |
| La flexibilité | La tolérance admise | ± 5 km |

> Une fonction sans critère chiffré n’est pas une exigence : c’est une intention. Elle ne pourra ni être validée, ni être contestée.

## Les trois écarts
Toute la démarche SI se lit dans trois écarts, et chacun pose une question différente.

| Écart | Entre quoi et quoi | La question posée |
| **Écart 1** | Cahier des charges et modèle | L’hypothèse retenue est-elle valable ? |
| **Écart 2** | Modèle et réel | La simulation prédit-elle bien ? |
| **Écart 3** | Réel et cahier des charges | Le produit répond-il au besoin ? |

## Les deux chaînes
| | Chaîne d’information | Chaîne d’énergie |
| Ce qu’elle fait | Elle **décide** | Elle **exécute** |
| Ses maillons | Acquérir → traiter → communiquer | Alimenter → distribuer → convertir → transmettre → agir |
| Ses composants | Capteurs, microcontrôleur, bus, IHM | Batterie, variateur, moteur, réducteur |

Les deux chaînes se croisent : l’**information commande l’énergie**, et l’énergie renvoie de l’information par les capteurs. C’est cette boucle qui fait un système, et non la simple juxtaposition des deux.`,
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
            cours: `Un système ne crée pas d’énergie : il en **convertit**, avec des pertes. Toute l’étude consiste à suivre cette conversion et à chiffrer ce qui se perd.

## Puissance et énergie
| Domaine | Formule | Unités |
| Électrique | P = U × I | watts, volts, ampères |
| Mécanique de rotation | P = C × ω | watts, newton-mètres, radians par seconde |
| Énergie | E = P × t | joules, watts, secondes |

## Le rendement
η = puissance utile / puissance absorbée.

> Il est **toujours inférieur à 1** : les pertes partent en chaleur (effet Joule), en frottement, en bruit. Et surtout, les rendements se **multiplient** en cascade — trois éléments à 0,9 chacun donnent 0,9 × 0,9 × 0,9 = **0,73** au total, pas 0,9.

| Nombre d’éléments à 0,9 | Rendement global |
| 1 | 0,90 |
| 2 | 0,81 |
| 3 | 0,73 |
| 5 | 0,59 |

## Statique et dynamique
| Situation | La condition | Ce qu’elle donne |
| **Statique** | Somme des forces nulle **et** somme des moments nulle | L’équilibre |
| **Dynamique** | Somme des forces = m × a | L’accélération |

Les deux conditions de la statique sont nécessaires : un solide peut avoir une résultante nulle et tourner malgré tout.

## Transmission de mouvement
| Système | Rapport de transmission | Ce qu’il fait |
| Engrenages | Nombre de dents | Rotation vers rotation |
| Poulies-courroie | Diamètres | Rotation vers rotation, à distance |
| Vis-écrou | Pas de la vis | Rotation vers **translation** |
| Bielle-manivelle | Géométrie | Rotation vers translation alternée |

> Réduire la vitesse **augmente le couple** d’autant : c’est le même produit P = C × ω qui se conserve, aux pertes près. Un réducteur ne crée pas de force, il échange de la vitesse contre du couple.`,
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
            cours: `Un système intelligent perçoit, décide, agit — et recommence. Trois maillons, chacun avec ses limites propres.

## Les capteurs
Un capteur transforme une grandeur physique en signal exploitable.

| Type | Ce qu’il rend | Exemples |
| **TOR** (tout ou rien) | Deux états seulement | Fin de course, bouton, détecteur |
| **Analogique** | Une tension continue | Température, luminosité, pression |
| **Numérique** | Une valeur codée sur un bus | Capteurs I2C, SPI |

Ses caractéristiques : étendue de mesure, **sensibilité**, **précision**, **temps de réponse**. Un capteur trop lent fausse un asservissement rapide même s’il est parfaitement précis.

## La conversion analogique-numérique
Le CAN **échantillonne** (dans le temps) et **quantifie** (en amplitude).

| Résolution | Nombre de niveaux |
| 8 bits | 256 |
| 10 bits | 1 024 |
| 12 bits | 4 096 |

> Le théorème de **Shannon** impose une fréquence d’échantillonnage **au moins double** de la fréquence maximale du signal. En dessous, le signal n’est pas seulement dégradé : il est **irrémédiablement déformé**, et aucun traitement ultérieur ne le récupère.

## L’algorithme et le programme
Un système embarqué exécute typiquement une **boucle infinie** :

1. **Lire** les entrées (capteurs).
2. **Calculer** l’action à mener.
3. **Écrire** les sorties (actionneurs).
4. Recommencer.

L’algorithme se décrit **avant** d’être codé — organigramme, pseudo-code ou diagramme d’états.

## Les diagrammes d’états
Un état, des transitions, des conditions de franchissement : c’est l’outil le plus adapté aux systèmes **séquentiels**. Un portail se modélise ainsi en quatre états — fermé, en ouverture, ouvert, en fermeture — et chaque transition porte sa condition.`,
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
            cours: `Asservir, c’est corriger en permanence l’écart entre ce qu’on veut et ce qu’on obtient. Tout le chapitre tient dans cette boucle et dans les compromis qu’elle impose.

## Boucle ouverte, boucle fermée
| | Boucle ouverte | Boucle fermée |
| Ce qui se passe | La commande part sans vérification | Un capteur mesure la sortie |
| Face à une perturbation | Le résultat est faussé | L’erreur est mesurée et corrigée |
| L’organe clé | Aucun | Le **comparateur** : erreur = consigne − mesure |
| Exemple | Un four réglé sur une durée | Un four réglé sur une température |

## Les trois performances
| Performance | Ce qu’on mesure |
| **Stabilité** | Le système converge au lieu d’osciller |
| **Précision** | L’erreur statique est faible |
| **Rapidité** | Le temps de réponse est court |

> Ces trois performances sont **antagonistes** : gagner en rapidité dégrade presque toujours la stabilité. Régler un asservissement n’est pas optimiser, c’est **arbitrer**.

## Le correcteur PID
| Action | Sur quoi elle agit | Ce qu’elle apporte | Ce qu’elle coûte |
| **P** proportionnel | L’erreur présente | Rapidité | Laisse une erreur statique |
| **I** intégral | L’erreur passée accumulée | Annule l’erreur statique | Ralentit, déstabilise |
| **D** dérivé | La variation de l’erreur | Amortit les oscillations | Amplifie le bruit |

## Lire une réponse indicielle
Sur la réponse à un échelon, trois lectures suffisent à diagnostiquer un réglage :

1. Le **temps de réponse à 5 %** : le système est-il assez rapide ?
2. Le **dépassement**, en pourcentage de la valeur finale : est-il stable ?
3. L’**erreur statique** : l’écart résiduel une fois stabilisé.

Un fort dépassement avec une erreur statique nulle signale un intégral trop marqué ; une erreur statique persistante, un correcteur purement proportionnel.`,
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
            cours: `Simuler coûte mille fois moins cher que se tromper en production. Encore faut-il savoir ce qu’un modèle peut dire — et ce qu’il ne dira jamais.

## Pourquoi modéliser
Un modèle est une **représentation simplifiée** destinée à répondre à une question précise.

> Un modèle n’est jamais « vrai » : il est **valide dans un domaine**. Un modèle de frottement sec suffit pour dimensionner un frein, pas pour prévoir son usure. La première question devant un modèle n’est donc pas « est-il juste ? » mais « pour quelle question a-t-il été construit ? ».

## Les modèles multiphysiques
Un même système associe plusieurs domaines, et c’est leur **couplage** qui produit les surprises.

| Domaine | Ce qu’il décrit | Exemple de couplage |
| Mécanique | Efforts, mouvements | Le couple disponible sur l’arbre |
| Électrique | Courants, tensions | Le courant absorbé par le moteur |
| Thermique | Échauffements | L’échauffement dégrade le couple |
| Informatique | Lois de commande | Le correcteur compense la dérive |

## La validation
On compare la **simulation** aux **mesures expérimentales**. Un écart n’invalide pas nécessairement le modèle : il faut d’abord chercher l’hypothèse écartée qui l’explique.

| L’écart observé | L’hypothèse à interroger |
| Réponse plus lente que prévu | Inertie ou jeu mécanique négligés |
| Amplitude plus faible | Frottements négligés |
| Retard constant | Temps de réponse du capteur |

## Les diagrammes SysML
| Diagramme | Ce qu’il décrit |
| Des exigences | Ce que le système **doit** faire |
| De définition de blocs | De quoi il **est fait** |
| De blocs internes | Comment les blocs **échangent** |
| D’états | Dans quels états il peut se trouver |
| De séquence | Comment il se comporte **dans le temps** |`,
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
            cours: `L’épreuve de projet évalue une **démarche**, pas seulement un objet qui fonctionne. Un prototype réussi sans justification vaut moins qu’un prototype imparfait dont chaque choix est tracé.

## Les étapes
1. **Analyser le besoin** : à quoi le système doit-il répondre, et pour qui ?
2. **Rechercher des solutions** : plusieurs, et vraiment différentes.
3. **Choisir**, en argumentant sur les critères du cahier des charges.
4. **Concevoir** en détail : dimensionnement, matériaux, interfaces.
5. **Réaliser** le prototype.
6. **Essayer**, selon un protocole écrit à l’avance.
7. **Valider** : le besoin de l’étape 1 est-il satisfait ?

Chaque étape produit un **livrable**, et chaque choix se justifie par un critère.

## Le choix de solutions
Un tableau de comparaison croise les solutions candidates avec des critères **pondérés**.

> L’intérêt du tableau n’est pas le score final — qu’on peut toujours faire dire ce qu’on veut — mais la **traçabilité** : on sait, six mois plus tard, pourquoi telle solution a été écartée.

## L’expérimentation
Un protocole d’essai précise quatre choses :

| Ce qu’il précise | Pourquoi |
| La grandeur mesurée | Pour savoir ce qu’on compare |
| Le moyen de mesure | Il porte sa propre incertitude |
| Les conditions | Température, charge, alimentation |
| Le nombre de répétitions | Une mesure unique ne prouve rien |

Une mesure sans incertitude annoncée n’est pas exploitable : c’est un chiffre, pas un résultat.

## Le développement durable
L’**analyse du cycle de vie** couvre cinq phases : extraction, fabrication, transport, usage, fin de vie.

> Un système économe à l’usage mais coûteux à produire peut avoir un bilan global défavorable. L’ingénieur raisonne sur **tout** le cycle, jamais sur la seule phase visible par l’utilisateur.`,
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
