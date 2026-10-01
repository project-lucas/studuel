export default {
  slug: 'si',
  titreMigration: 'QUESTIONS EN PLUS — SCIENCES DE L’INGÉNIEUR Tle',
  motif: `Quatre questions de plus par quiz : huit suffisaient pour se tester une fois, pas pour réviser sur plusieurs semaines.`,
  chapitres: [
    {
      niveau: 'Tle',
      titre: 'Systèmes asservis',
      questions: [
        ['Lequel de ces exemples fonctionne en boucle fermée ?', ['Un four réglé sur une durée', 'Un four réglé sur une température', 'Un grille-pain à minuterie', 'Un arrosage programmé à heure fixe'], 1, 'Le four réglé sur une température mesure la sortie par un capteur et corrige l’écart : c’est une boucle fermée.'],
        ['Comment se calcule l’erreur au comparateur ?', ['Mesure − consigne', 'Consigne × mesure', 'Consigne − mesure', 'Consigne + perturbation'], 2, 'Le comparateur soustrait la mesure à la consigne ; le correcteur agit ensuite sur cette erreur.'],
        ['Sur une réponse indicielle, on observe une erreur statique persistante. Quel correcteur est probablement en cause ?', ['Un correcteur purement proportionnel', 'Un correcteur à action intégrale trop marquée', 'Un correcteur dérivé seul', 'Aucun : c’est impossible en boucle fermée'], 0, 'L’action proportionnelle laisse une erreur statique ; seule l’action intégrale peut l’annuler.'],
        ['Que mesure-t-on avec le « temps de réponse à 5 % » ?', ['La stabilité', 'La précision', 'Le dépassement', 'La rapidité'], 3, 'C’est le temps au bout duquel la sortie reste à moins de 5 % de sa valeur finale : il mesure la rapidité.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Modélisation et simulation',
      questions: [
        ['Quel diagramme SysML décrit de quoi le système est fait ?', ['Le diagramme des exigences', 'Le diagramme de définition de blocs', 'Le diagramme de séquence', 'Le diagramme d’états'], 1, 'Le diagramme de définition de blocs décrit la composition du système ; celui de blocs internes, les échanges entre ses blocs.'],
        ['La réponse mesurée est plus lente que la simulation. Quelle hypothèse interroger d’abord ?', ['Le temps de réponse du capteur uniquement', 'Une erreur de l’appareil de mesure', 'Une inertie ou un jeu mécanique négligés', 'Des frottements surestimés'], 2, 'Une réponse plus lente que prévu signale souvent une inertie ou un jeu que le modèle avait écartés.'],
        ['Face à un modèle, quelle est la première question à poser selon le cours ?', ['Pour quelle question a-t-il été construit ?', 'Est-il parfaitement juste ?', 'Combien de temps dure le calcul ?', 'Quel logiciel l’a produit ?'], 0, 'Un modèle n’est jamais « vrai » : il est valide dans un domaine, celui de la question à laquelle il répond.'],
        ['Dans un moteur, quel couplage relie les domaines thermique et mécanique ?', ['Le correcteur compense la dérive', 'Le courant absorbé fixe la tension', 'Le capteur retarde la mesure', 'L’échauffement dégrade le couple'], 3, 'C’est ce couplage entre domaines qui produit les surprises, d’où l’intérêt d’une simulation multiphysique.'],
      ],
    },
    {
      niveau: 'Tle',
      titre: 'Projet et démarche d’ingénieur',
      questions: [
        ['Dans un tableau de choix de solutions, comment sont les critères ?', ['Tirés au sort', 'Pondérés', 'Tous de même poids obligatoirement', 'Choisis après le résultat'], 1, 'Les critères pondérés reflètent l’importance relative des exigences du cahier des charges.'],
        ['Une mesure donnée sans incertitude est…', ['Un chiffre, pas un résultat exploitable', 'Toujours exacte', 'Suffisante si l’appareil est neuf', 'Plus précise qu’une série de mesures'], 0, 'Le moyen de mesure porte sa propre incertitude : sans elle, on ne peut rien conclure.'],
        ['Combien de phases l’analyse du cycle de vie d’un produit couvre-t-elle ?', ['Deux', 'Trois', 'Quatre', 'Cinq'], 3, 'Extraction, fabrication, transport, usage et fin de vie : l’ingénieur raisonne sur tout le cycle.', 'Combien de phases couvre l’analyse du cycle de vie dans le cours ?'],
        ['Que doit produire chaque étape d’un projet ?', ['Un prototype', 'Un score', 'Un livrable', 'Une mesure'], 2, 'Chaque étape laisse une trace écrite, ce qui rend la démarche évaluable et traçable.'],
      ],
    },
  ],
}
