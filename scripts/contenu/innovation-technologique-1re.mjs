// INNOVATION TECHNOLOGIQUE — PREMIÈRE STI2D (spécialité de 3 h, abandonnée en
// fin de première). Matière propre à la voie technologique : un élève de la
// voie générale ne la voit jamais.
//
// SOURCE : programme d’innovation technologique et d’ingénierie et
// développement durable de première STI2D (annexe 1, arrêté du 17/01/2019,
// BO spécial n° 1 du 22/01/2019). Le programme est commun à IT, I2D et 2I2D :
// ses « connaissances associées » sont rangées en six chapitres (principes de
// conception et développement durable, approche fonctionnelle et structurelle,
// approche comportementale, éco-conception, solutions constructives,
// prototypage). IT en retient la part « créativité, design, innovation » ;
// l’axe de chaque fiche est la rubrique du programme qui la coiffe.
//
// ÉVALUATION : IT est évaluée en CONTRÔLE CONTINU (coefficient 8), sur les
// objectifs O2, O4, O5 et O7, notamment à travers le projet de 36 heures de fin
// de première. D’où la fiche méthode finale.
//
// PAS DE LATEX : formules en texte.

export default {
  slug: 'innovation-technologique',
  nom: 'Innovation technologique',

  titreMigration: 'INNOVATION TECHNOLOGIQUE 1re STI2D — LE PROGRAMME OFFICIEL (11 fiches)',

  motif: `Matière neuve de la voie technologique (1re STI2D). Onze fiches rangées
sous les rubriques du programme officiel (BO spécial n° 1 du 22/01/2019,
annexe 1) : démarche de projet, communication technique, approche design,
compétitivité et propriété industrielle, créativité, approche environnementale,
maquette numérique, prototypage — et une fiche méthode sur le projet de fin de
première, évalué en contrôle continu.`,

  blocs: [
    {
      niveaux: ['1re'],
      positionDepart: 1,
      chapitres: [
        // ---- 1 ---------------------------------------------------------------
        {
          titre: 'Le projet industriel : phases, acteurs et planning',
          axe: 'La démarche de projet',
          lecon: {
            titre: 'Mener un projet de l’idée au produit',
            cours: `Un projet, c’est un effort unique, limité dans le temps, pour créer un produit qui répond à un besoin. En STI2D, tu vas en vivre un en fin de première : autant savoir comment il s’organise.

## Les acteurs
| L’acteur | Son rôle |
| **Maître d’ouvrage** (MOA) | Le client : il exprime le besoin, fixe le budget et reçoit l’ouvrage |
| **Maître d’œuvre** (MOE) | Il conçoit la réponse et dirige sa réalisation |
| **Entreprises** | Elles réalisent (fabrication, chantier, développement) |
| **Contrôleurs, coordonnateurs** | Ils vérifient la conformité, la sécurité, le respect des règles |

> Le maître d’ouvrage dit **quoi** et **pour combien** ; le maître d’œuvre dit **comment**.

## Les phases d’un projet industriel
1. **Marketing et expression du besoin** : qui est l’utilisateur, que lui manque-t-il ?
2. **Pré-conception** : recherche de principes de solution.
3. **Conception détaillée et pré-industrialisation** : choix des composants, plans, prototypes.
4. **Industrialisation** : définir comment produire en série.
5. **Vie du produit** : usage, maintenance, puis fin de vie.

Chaque phase se termine par un **jalon** : une **revue de projet** où l’on décide de continuer, de corriger ou d’arrêter. Dans le bâtiment, on parle d’études d’esquisse, d’**APS** (avant-projet sommaire), d’**APD** (avant-projet définitif), puis de consultation des entreprises et d’exécution.

## Planifier : le diagramme de Gantt
Chaque tâche a une **durée** et des **antériorités** (les tâches qui doivent être finies avant elle). Le diagramme de Gantt les place sur une échelle de temps.

Le **chemin critique** est la suite de tâches dont le moindre retard retarde tout le projet. Sa durée totale est la **durée minimale** du projet.

## Exemple travaillé
| Tâche | Durée | Antériorité |
| A : cahier des charges | 2 j | — |
| B : recherche de solutions | 3 j | A |
| C : commande des composants | 4 j | A |
| D : prototype | 5 j | B et C |

Deux chemins mènent à D : A → B (2 + 3 = 5 j) et A → C (2 + 4 = 6 j). D ne peut démarrer qu’au jour 6. Durée du projet : 6 + 5 = **11 jours**. Le chemin critique est **A → C → D**. La tâche B dispose d’une **marge** de 1 jour : elle peut glisser d’un jour sans retarder la fin.

## Suivre et clore
- **Coût et budget** : on compare en continu le dépensé au prévu.
- **Bilan d’expérience** : à la fin, on note ce qui a marché et ce qui a coincé, pour le prochain projet.
- **Contexte réglementaire** : normes, sécurité, accessibilité, environnement s’imposent dès la conception.`,
          },
          questions: [
            ['Qui exprime le besoin et finance le projet ?', ['Le sous-traitant', 'Le maître d’œuvre', 'Le maître d’ouvrage', 'Le contrôleur technique'], 2, 'Le maître d’ouvrage est le client : il dit quoi et pour combien.'],
            ['Quel est le rôle du maître d’œuvre ?', ['Concevoir la réponse et diriger sa réalisation', 'Rédiger le besoin initial', 'Payer les entreprises', 'Contrôler la sécurité du chantier'], 0, 'Il traduit le besoin du maître d’ouvrage en solution, puis en suit la réalisation.'],
            ['Qu’est-ce qu’un jalon ?', ['Un outil de dessin', 'Une ligne du budget', 'Une tâche de très longue durée', 'Un point de décision qui clôt une phase'], 3, 'À chaque jalon, une revue de projet décide de poursuivre, corriger ou arrêter.'],
            ['Qu’appelle-t-on chemin critique ?', ['Les tâches confiées au chef de projet', 'La suite de tâches dont tout retard retarde la fin du projet', 'Les tâches les plus coûteuses', 'Les tâches les plus dangereuses'], 1, 'Sa durée totale donne la durée minimale du projet.'],
            ['A (2 j) puis B (3 j) et C (4 j) en parallèle après A, puis D (5 j) après B et C. Durée minimale ?', ['11 jours', '14 jours', '9 jours', '10 jours'], 0, 'D démarre après la plus longue branche : 2 + 4 = 6 j, puis 6 + 5 = 11 j.'],
            ['Dans cet exemple, quelle marge a la tâche B ?', ['0 jour', '2 jours', '1 jour', '3 jours'], 2, 'La branche A → B dure 5 j contre 6 j pour A → C : B peut glisser d’un jour.'],
            ['Que représente un diagramme de Gantt ?', ['Les flux d’énergie d’un produit', 'Les tâches d’un projet placées sur une échelle de temps', 'La structure d’un système', 'Les coûts de chaque pièce'], 1, 'Chaque tâche y est une barre, positionnée selon ses antériorités.'],
            ['Une tâche du chemin critique possède une marge nulle.', ['Vrai', 'Faux'], 0, 'Par définition, elle ne peut pas glisser sans retarder la fin du projet.'],
            ['Dans le bâtiment, que signifie APD ?', ['Accord pour démolition', 'Appel public de devis', 'Analyse préalable des données', 'Avant-projet définitif'], 3, 'L’avant-projet définitif suit l’avant-projet sommaire (APS).'],
            ['Quelle phase définit comment produire le produit en série ?', ['L’industrialisation', 'La fin de vie', 'Le marketing', 'La pré-conception'], 0, 'L’industrialisation choisit procédés, outillages et organisation de la production.'],
            ['À quoi sert le bilan d’expérience en fin de projet ?', ['À dessiner la maquette numérique', 'À fixer le prix de vente', 'À tirer les leçons pour les projets suivants', 'À déposer un brevet'], 2, 'Il capitalise ce qui a marché et ce qui a posé problème.'],
            ['Les réglementations ne s’appliquent qu’une fois le produit fabriqué.', ['Vrai', 'Faux'], 1, 'Normes et règles de sécurité s’imposent dès la conception : les ignorer oblige à tout reprendre.'],
          ],
        },
        // ---- 2 ---------------------------------------------------------------
        {
          titre: 'La communication technique',
          axe: 'La démarche de projet',
          lecon: {
            titre: 'Choisir le bon outil pour transmettre une idée',
            cours: `Une bonne idée mal expliquée ne sert à rien. En projet, tu dois sans cesse décrire une idée, un principe ou une solution à des interlocuteurs variés : ton équipe, ton professeur, un client, un jury.

## Les outils et leur usage
| L’outil | Ce qu’il montre bien | Pour qui |
| **Croquis à main levée** | Une forme, un principe, en quelques secondes | L’équipe, en séance de créativité |
| **Carte mentale** | Des idées organisées autour d’un thème central | Toi et ton équipe, pour explorer |
| **Schéma non normalisé** | Un fonctionnement simplifié | Un public non spécialiste |
| **Organigramme** | Un enchaînement d’étapes ou de décisions | Programmeurs, techniciens |
| **Diagramme SysML** | Les exigences, la structure et le comportement d’un système | Ingénieurs |
| **Maquette numérique, rendu** | L’aspect final, les volumes | Client, jury |
| **Prototype, maquette physique** | L’objet réel, à manipuler | Tout le monde |

> Le bon outil dépend de deux choses : **ce que tu veux transmettre** et **à qui tu t’adresses**.

## Le croquis : penser avec la main
Un croquis n’a pas besoin d’être beau : il doit être **lisible**. Quelques règles :
1. Commence par les grands volumes, puis ajoute les détails.
2. Utilise la perspective pour un objet, la vue de face pour un mécanisme.
3. Annote : flèches, noms des pièces, cotes principales.

## La carte mentale
Au centre, le sujet (« rangement de vélo en ville »). Autour, des branches : usagers, contraintes, matériaux, énergie, sécurité. Chaque branche se ramifie. Elle sert à **ne rien oublier** et à **voir des liens** entre idées.

## Travailler à plusieurs
| L’outil collaboratif | Ce qu’il permet |
| **Cloud** (espace partagé) | Travailler sur les mêmes fichiers, à jour pour tous |
| **PLM** (gestion du cycle de vie du produit) | Centraliser plans, versions, nomenclatures d’un produit industriel |
| **BIM** (maquette numérique du bâtiment) | Partager une maquette 3D unique entre architecte, ingénieurs et entreprises |

## Exemple
Ton équipe conçoit une lampe solaire. Pour présenter le principe au jury, un schéma simple « panneau → batterie → carte → LED » avec des flèches d’énergie vaut mieux qu’un schéma électrique détaillé. Pour le programmeur, un organigramme « si luminosité faible alors allumer » est plus utile.

## Présenter à l’oral
- Une idée par diapositive, un visuel par idée.
- Justifie tes choix : « nous avons choisi… parce que… ».
- Le programme demande de savoir le faire aussi, en partie, en **langue étrangère**.`,
          },
          questions: [
            ['Quel outil convient le mieux pour explorer toutes les idées autour d’un thème ?', ['Le schéma électrique normalisé', 'La nomenclature', 'Le diagramme de Gantt', 'La carte mentale'], 3, 'Elle organise les idées en branches autour du sujet central.'],
            ['De quoi dépend le choix d’un outil de communication technique ?', ['Du budget du projet', 'Uniquement du logiciel disponible', 'Du contenu à transmettre et de l’interlocuteur', 'De la couleur du produit'], 2, 'On ne présente pas un principe de la même façon à un client et à un technicien.'],
            ['Qu’est-ce qu’un organigramme ?', ['Un plan de bâtiment', 'Une représentation d’un enchaînement d’étapes ou de décisions', 'Un rendu réaliste du produit', 'Une liste des pièces'], 1, 'Il est très utilisé pour décrire un algorithme.'],
            ['Que signifie BIM dans le bâtiment ?', ['Une maquette numérique partagée entre les acteurs', 'Un type de béton', 'Un bureau d’inspection', 'Une norme de sécurité incendie'], 0, 'Architecte, ingénieurs et entreprises travaillent sur la même maquette 3D.'],
            ['À quoi sert un outil PLM ?', ['À imprimer en 3D', 'À simuler un circuit électrique', 'À centraliser plans, versions et nomenclatures d’un produit', 'À mesurer une température'], 2, 'PLM signifie gestion du cycle de vie du produit.'],
            ['Un croquis de recherche doit avant tout être parfaitement esthétique.', ['Vrai', 'Faux'], 1, 'Il doit être lisible et annoté ; sa beauté est secondaire.'],
            ['Pour présenter un principe à un jury non spécialiste, que privilégies-tu ?', ['Un schéma simple avec les flux principaux', 'Un tableau de cotes', 'Un schéma électrique complet', 'Un listing du programme'], 0, 'Un schéma non normalisé fait comprendre l’essentiel rapidement.'],
            ['Quel outil décrit exigences, structure et comportement d’un système pour des ingénieurs ?', ['Le croquis', 'Le diaporama', 'La carte mentale', 'Le langage SysML'], 3, 'SysML est un langage de diagrammes normalisé pour les systèmes.'],
            ['Par quoi commence-t-on un croquis ?', ['Par les détails', 'Par les grands volumes', 'Par les couleurs', 'Par les cotes'], 1, 'On pose d’abord la silhouette, puis on détaille.'],
            ['Quel avantage principal apporte un espace cloud partagé ?', ['Il remplace le cahier des charges', 'Chacun travaille sur des fichiers à jour', 'Il rend le produit moins cher', 'Il supprime les réunions'], 1, 'Tout le monde accède à la même version des documents.'],
            ['Pourquoi fabriquer une maquette physique en plus de la maquette numérique ?', ['Pour déposer une marque', 'Pour éviter d’écrire un cahier des charges', 'Parce que le logiciel l’exige', 'Pour manipuler l’objet réel et le faire comprendre à tous'], 3, 'L’objet en main révèle des problèmes d’usage invisibles à l’écran.'],
            ['Le programme demande de savoir présenter une démarche en partie en langue étrangère.', ['Vrai', 'Faux'], 0, 'La compétence CO4.3 inclut la présentation dans une langue étrangère.'],
          ],
        },
        // ---- 3 ---------------------------------------------------------------
        {
          titre: 'Le design : forme, fonction et usage',
          axe: 'Approche design et architecturale des produits',
          lecon: {
            titre: 'Pourquoi un objet a-t-il cette forme ?',
            cours: `Le design ne consiste pas à « faire joli ». C’est une démarche qui relie la **fonction** d’un objet, sa **forme**, sa **fabrication** et son **usage**, dans un contexte culturel donné.

## Les deux fonctions d’un produit
| La fonction | Ce qu’elle apporte | Exemple : une montre |
| **Utilitaire** | Le service rendu, mesurable | Donner l’heure |
| **Symbolique** (ou d’estime) | Ce que l’objet dit de son propriétaire | Luxe, sport, élégance |

> Deux produits qui rendent le même service peuvent se vendre à des prix très différents : c’est la part symbolique.

## Les formes ont une histoire
| L’époque | Ce qui guide la forme |
| **Arts and Crafts** (fin XIXe) | Retour à l’artisanat face à l’industrie |
| **Bauhaus** (1919-1933) | Formes simples, adaptées à la production en série : « la forme suit la fonction » |
| **Streamline** (années 1930) | Profils aérodynamiques, même sur des objets immobiles |
| **Design radical, pop** (années 1960-1970) | Couleurs vives, plastiques, remise en cause des codes |
| **Éco-design** (aujourd’hui) | Sobriété de matière, réparabilité, durée de vie |

Chaque objet est donc le reflet de son époque : ses **techniques** (le plastique injecté a permis des formes nouvelles), son **économie**, ses **valeurs**.

## Analyser un produit en designer
1. **Le contexte** : pour qui, où, quand, à quel prix ? Quel segment de marché, quelle cible ?
2. **La relation fonction – solution technique – forme** : la forme est-elle imposée par la fonction, par le procédé de fabrication, par l’image voulue ?
3. **L’usage** : comment l’objet est-il pris en main, rangé, entretenu ?
4. **L’environnement** : quels matériaux, quelle durée de vie, quel recyclage ?

## Exemple travaillé : la chaise monobloc en plastique
- **Fonction** : s’asseoir, s’empiler, supporter les intempéries.
- **Procédé** : injection plastique en une seule pièce → formes arrondies, épaisseur constante, pas d’assemblage.
- **Forme** : les pieds évasés permettent l’empilement.
- **Contexte** : produit bon marché, diffusé mondialement.
- **Limite** : image « banale », matière fossile, faible réparabilité.

> Ici, la forme découle à la fois de la fonction (empiler) et du procédé (injecter).

## Le designer et l’ingénieur
Le designer apporte le regard sur l’usage, la perception, l’émotion ; l’ingénieur apporte la faisabilité, le dimensionnement, le coût. En STI2D, tu apprends à **tenir les deux points de vue**, le « pourquoi » comme le « comment ».`,
          },
          questions: [
            ['Qu’est-ce que la fonction symbolique d’un produit ?', ['Ce que l’objet dit de son propriétaire', 'Sa résistance mécanique', 'Son mode de fabrication', 'Le service mesurable qu’il rend'], 0, 'Elle explique qu’un même service se vende à des prix très différents.'],
            ['Quel mouvement a popularisé l’idée que « la forme suit la fonction » ?', ['Le design pop', 'L’Art nouveau', 'Le Bauhaus', 'Le Streamline'], 2, 'L’école du Bauhaus cherchait des formes simples adaptées à la série.'],
            ['Le design se résume à rendre un objet joli.', ['Vrai', 'Faux'], 1, 'Il relie fonction, forme, fabrication et usage dans un contexte.'],
            ['Pourquoi une chaise monobloc a-t-elle des formes arrondies et une épaisseur régulière ?', ['Parce qu’elle est en bois', 'Pour respecter une norme de couleur', 'Pour des raisons purement décoratives', 'À cause du procédé d’injection plastique'], 3, 'Le moulage par injection impose épaisseurs constantes et angles arrondis.'],
            ['Quel style des années 1930 dessinait des profils aérodynamiques, même sur des objets immobiles ?', ['Le Bauhaus', 'L’éco-design', 'Le Streamline', 'Le design radical'], 2, 'Il traduisait la fascination pour la vitesse.'],
            ['Donner l’heure est, pour une montre, sa fonction…', ['esthétique', 'utilitaire', 'symbolique', 'contrainte'], 1, 'La fonction utilitaire est le service rendu, mesurable.'],
            ['Que cherche en priorité l’éco-design actuel ?', ['La sobriété de matière, la réparabilité et la durée de vie', 'Des formes aérodynamiques', 'Des couleurs vives', 'Multiplier les matériaux'], 0, 'Il intègre l’impact environnemental dès le dessin.'],
            ['Dans l’analyse d’un produit, qu’appelle-t-on la cible ?', ['Le matériau principal', 'Le procédé de fabrication', 'Le public auquel le produit est destiné', 'Le prix de revient'], 2, 'Le segment de marché et la cible orientent tous les choix.'],
            ['Qu’apporte l’ingénieur face au designer ?', ['La faisabilité, le dimensionnement et le coût', 'Uniquement le choix des couleurs', 'La publicité', 'L’émotion et la perception'], 0, 'Les deux regards sont complémentaires.'],
            ['Quelle innovation technique a permis de nouvelles formes au XXe siècle ?', ['Le tissage manuel', 'La forge', 'La taille de pierre', 'Le plastique injecté'], 3, 'Il autorise des formes complexes en une seule pièce.'],
            ['Un objet est le reflet des techniques, de l’économie et des valeurs de son époque.', ['Vrai', 'Faux'], 0, 'C’est pourquoi l’étude historique des formes fait partie du programme.'],
            ['Qu’est-ce qui ne fait PAS partie de l’analyse d’un produit en designer ?', ['L’impact environnemental', 'Le cours de la bourse de l’entreprise', 'Le contexte d’usage', 'La relation fonction – forme'], 1, 'On analyse contexte, relation fonction-forme, usage et environnement.'],
          ],
        },
        // ---- 4 ---------------------------------------------------------------
        {
          titre: 'Ergonomie et expérience utilisateur',
          axe: 'Approche design et architecturale des produits',
          lecon: {
            titre: 'Concevoir pour l’humain qui utilise le produit',
            cours: `Un produit techniquement parfait mais pénible à utiliser est un échec. L’**ergonomie** étudie la relation entre l’humain et le produit pour qu’elle soit confortable, efficace et sûre.

## Les trois objectifs de l’ergonomie
| L’objectif | La question à se poser | Exemple |
| **Confort** | L’usage est-il agréable, sans fatigue ? | Poignée d’outil adaptée à la main |
| **Efficacité** | L’utilisateur atteint-il son but vite et sans erreur ? | Bouton principal visible et unique |
| **Sécurité** | L’usage peut-il blesser ou mettre en danger ? | Arrêt d’urgence rouge, facile d’accès |

> On conçoit pour la **diversité** des utilisateurs : grands et petits, droitiers et gauchers, jeunes et âgés, personnes en situation de handicap.

## Mesurer l’humain : l’anthropométrie
On utilise des tables de dimensions du corps (hauteur des yeux, longueur de main…). Un produit est souvent dimensionné pour couvrir **du 5e au 95e centile** de la population : seuls les 5 % les plus petits et les 5 % les plus grands sont hors de la plage.

## Le design d’interaction
Il concerne tout ce que l’utilisateur touche, voit, entend : boutons, écrans, sons, vibrations. Quelques principes :
1. **Visibilité** : les commandes utiles sont visibles.
2. **Retour d’information** (*feedback*) : chaque action produit une réponse (un clic, une LED, un son).
3. **Cohérence** : mêmes gestes pour mêmes effets.
4. **Prévention des erreurs** : rendre impossible la mauvaise manœuvre (détrompeur d’une prise HDMI, ou prise USB-C rendue réversible, par exemple).

## L’expérience utilisateur (UX)
L’expérience utilisateur englobe **tout le parcours** : découvrir le produit, le déballer, l’installer, l’utiliser, l’entretenir, s’en séparer. On l’étudie avec :
| L’outil | Ce qu’il apporte |
| **Persona** | Un utilisateur type fictif mais réaliste (âge, habitudes, besoins) |
| **Scénario d’usage** | Le déroulé pas à pas d’une utilisation |
| **Test utilisateur** | Observer de vrais utilisateurs sur un prototype |

## Exemple travaillé : une borne de recharge de trottinettes
- **Persona** : Inès, 16 ans, pressée, smartphone en main.
- **Scénario** : elle arrive, repère la borne libre, présente son téléphone, branche, part.
- **Problèmes relevés en test** : la prise est trop basse (inconfort), aucun voyant n’indique la charge (pas de *feedback*), le câble traîne au sol (sécurité).
- **Améliorations** : prise à 90 cm, voyant vert/orange, enrouleur.

> Observer un utilisateur réel apprend plus que dix réunions entre concepteurs.`,
          },
          questions: [
            ['Quels sont les trois objectifs de l’ergonomie ?', ['Vitesse, puissance, rendement', 'Confort, efficacité, sécurité', 'Coût, délai, qualité', 'Forme, couleur, matière'], 1, 'Ils décrivent une bonne relation entre l’humain et le produit.'],
            ['Que signifie dimensionner un produit du 5e au 95e centile ?', ['Il est conçu pour les enfants', 'Il pèse entre 5 et 95 kg', 'Il convient à 5 % de la population', 'Il couvre 90 % de la population, sans les extrêmes'], 3, 'Seuls les 5 % les plus petits et les 5 % les plus grands sont hors plage.'],
            ['Qu’est-ce qu’un persona ?', ['Un utilisateur type fictif mais réaliste', 'Un client réel interviewé', 'Un logiciel de CAO', 'Une norme de sécurité'], 0, 'Il aide l’équipe à garder en tête pour qui elle conçoit.'],
            ['Un voyant qui s’allume quand la charge démarre illustre le principe de…', ['cohérence', 'visibilité', 'retour d’information', 'anthropométrie'], 2, 'Chaque action doit produire une réponse perceptible.'],
            ['L’expérience utilisateur ne concerne que l’instant où l’on utilise le produit.', ['Vrai', 'Faux'], 1, 'Elle couvre tout le parcours, de la découverte à la fin de vie.'],
            ['Un détrompeur qui empêche de brancher une prise à l’envers applique le principe de…', ['retour d’information', 'fonction symbolique', 'confort', 'prévention des erreurs'], 3, 'On rend la mauvaise manœuvre impossible.'],
            ['Quel outil consiste à observer de vrais utilisateurs sur un prototype ?', ['L’analyse de la valeur', 'Le brainstorming', 'Le test utilisateur', 'Le diagramme de Gantt'], 2, 'Il révèle des difficultés que les concepteurs ne voient pas.'],
            ['Une poignée d’outil adaptée à la forme de la main relève surtout du…', ['recyclage', 'confort', 'coût', 'marketing'], 1, 'Elle limite la fatigue et les douleurs.'],
            ['Qu’est-ce que l’anthropométrie ?', ['La mesure des dimensions du corps humain', 'La planification des tâches', 'Le calcul des coûts', 'L’étude des matériaux'], 0, 'Ses tables servent à dimensionner les produits.'],
            ['Pourquoi concevoir en pensant à la diversité des utilisateurs ?', ['Pour augmenter le prix', 'Parce que la loi interdit les produits simples', 'Pour que le produit soit utilisable par le plus grand nombre', 'Pour réduire le nombre de pièces'], 2, 'Âge, taille, latéralité, handicap : tous doivent pouvoir s’en servir.'],
            ['Sur une borne de recharge, le câble traîne au sol. Quelle amélioration répond à ce problème de sécurité ?', ['L’enrouleur de câble', 'Le paiement par téléphone', 'Le voyant vert/orange', 'La prise à 90 cm'], 0, 'Le câble au sol faisait trébucher : l’enrouleur le supprime.', 'Dans l’exemple de la borne, quelle amélioration répond au problème de sécurité ?'],
            ['Un scénario d’usage décrit pas à pas une utilisation du produit.', ['Vrai', 'Faux'], 0, 'Il permet de repérer chaque moment où l’utilisateur peut bloquer.'],
          ],
        },
        // ---- 5 ---------------------------------------------------------------
        {
          titre: 'Innovation et propriété industrielle',
          axe: 'Compétitivité des produits',
          lecon: {
            titre: 'Innover, puis protéger son innovation',
            cours: `Innover, ce n’est pas seulement inventer : c’est faire **adopter** une nouveauté par le marché. Et une innovation qui rapporte doit être **protégée**, sinon les concurrents la copient.

## Les types d’innovation
| Le type | Ce qui change | Exemple |
| **De produit** | L’objet lui-même | Le smartphone tactile |
| **De procédé** | La façon de fabriquer | L’impression 3D métal |
| **De marketing** | La façon de vendre ou de présenter | La location de vélos en libre-service |
| **D’organisation** | La façon de travailler | Le travail collaboratif en BIM |

Selon son ampleur :
| L’ampleur | Définition |
| **Incrémentale** | Amélioration progressive d’un produit existant (une batterie qui tient 10 % de plus) |
| **De rupture** | Changement radical qui rend l’ancien obsolète (l’ampoule LED face à l’incandescence) |

> Invention ≠ innovation : une invention devient innovation quand elle trouve ses utilisateurs.

## Chercher avant d’inventer : les bases de brevets
Avant de concevoir, on consulte les bases de brevets (INPI, Espacenet). Elles servent à :
1. ne pas **réinventer** une solution qui existe déjà ;
2. retracer l’**évolution technique** d’un produit ;
3. vérifier qu’on ne **contrefait** pas un brevet en vigueur.

## Protéger : trois outils pour trois aspects
| L’outil | Ce qu’il protège | Durée maximale en France |
| **Brevet d’invention** | La solution **technique** (nouvelle, inventive, applicable industriellement) | 20 ans |
| **Dessin et modèle** | L’**apparence** (forme, couleur, texture) | 25 ans (par tranches de 5 ans) |
| **Marque** | Le **nom**, le logo | 10 ans, renouvelable sans limite |

En France, ces titres se déposent à l’**INPI**. En échange de la protection, le brevet est **publié** : tout le monde peut le lire, mais pas l’exploiter sans licence.

## Exemple travaillé
Une équipe invente une gourde qui filtre l’eau grâce à une cartouche clipsable, avec une forme en goutte et le nom « Aquaclip ».
- Le système de cartouche clipsable → **brevet** (s’il est nouveau et inventif).
- La forme en goutte → **dessin et modèle**.
- Le nom Aquaclip → **marque**.

## Normes et labels
- Une **norme** est un document de référence, souvent volontaire, qui fixe des règles communes (dimensions, sécurité, méthodes d’essai). Elle facilite la compatibilité : toutes les prises USB-C se branchent partout.
- Un **label** atteste une performance : bâtiment passif, HQE, label énergie-carbone. Il valorise le produit auprès des clients.`,
          },
          questions: [
            ['Quelle différence entre invention et innovation ?', ['L’invention est toujours brevetée', 'L’innovation ne concerne que les procédés', 'Aucune', 'L’innovation est une invention adoptée par le marché'], 3, 'Une invention sans utilisateurs reste une invention.'],
            ['Que protège un brevet d’invention ?', ['L’apparence du produit', 'Une solution technique', 'Le prix de vente', 'Le nom du produit'], 1, 'La forme relève du dessin et modèle, le nom de la marque.'],
            ['Quelle est la durée maximale d’un brevet en France ?', ['5 ans', '10 ans', '20 ans', '50 ans'], 2, 'Au-delà, l’invention tombe dans le domaine public.'],
            ['La forme originale d’une gourde se protège par…', ['un brevet', 'un dessin et modèle', 'une norme', 'un label'], 1, 'Le dessin et modèle protège l’apparence.'],
            ['Où dépose-t-on un brevet en France ?', ['Au ministère de l’Industrie', 'À l’AFNOR', 'À la mairie', 'À l’INPI'], 3, 'L’Institut national de la propriété industrielle délivre les titres.'],
            ['L’ampoule LED remplaçant l’incandescence est une innovation…', ['de rupture', 'd’organisation', 'incrémentale', 'de marketing'], 0, 'Elle a rendu l’ancienne technologie obsolète.'],
            ['Une batterie qui tient 10 % de plus que la précédente est une innovation incrémentale.', ['Vrai', 'Faux'], 0, 'C’est une amélioration progressive d’un produit existant.'],
            ['Pourquoi consulter les bases de brevets avant de concevoir ?', ['Pour choisir la couleur', 'Pour copier les solutions', 'Pour éviter de réinventer et de contrefaire', 'Pour fixer le prix'], 2, 'On y retrouve aussi l’évolution technique d’un produit.'],
            ['Une marque déposée peut être renouvelée…', ['tous les 50 ans', 'une seule fois', 'jamais', 'sans limite, tous les 10 ans'], 3, 'Tant qu’on renouvelle, le nom reste protégé.'],
            ['Qu’est-ce qu’une norme ?', ['Une publicité', 'Une loi pénale', 'Un document de référence qui fixe des règles communes', 'Un brevet public'], 2, 'Elle garantit compatibilité et sécurité, souvent sur base volontaire.'],
            ['Un brevet reste secret pendant toute sa durée.', ['Vrai', 'Faux'], 1, 'Il est publié : c’est la contrepartie de la protection.'],
            ['Le libre-service de vélos en ville relève plutôt d’une innovation…', ['de procédé', 'de marketing (manière de proposer le service)', 'de rupture technique', 'de matériau'], 1, 'Le vélo existe ; c’est la manière de le proposer qui change.'],
          ],
        },
        // ---- 6 ---------------------------------------------------------------
        {
          titre: 'Le compromis fonction, coût, besoin',
          axe: 'Compétitivité des produits',
          lecon: {
            titre: 'Payer le juste prix pour le juste service',
            cours: `Un produit compétitif rend le **service attendu** au **coût le plus bas possible**, avec un **impact environnemental** maîtrisé. Tout l’art de l’ingénieur est de trouver le bon compromis.

## Besoin réel et besoin induit
| Le besoin | Définition | Exemple |
| **Réel** | Ce dont l’utilisateur a vraiment besoin | Se déplacer 5 km par jour |
| **Induit** | Créé par la publicité ou la mode | Changer de modèle chaque année |

> Répondre au besoin réel évite de payer — et de fabriquer — des fonctions inutiles.

## L’analyse de la valeur
La **valeur** d’un produit, pour l’utilisateur, se mesure par le rapport :

**Valeur = satisfaction du besoin / coût**

On l’augmente de deux façons : mieux satisfaire le besoin à coût égal, ou garder la même satisfaction pour moins cher. La démarche :
1. Lister les **fonctions** du produit.
2. Estimer le **coût** de chaque fonction (quelles pièces, quel temps de fabrication y contribuent).
3. Estimer l’**importance** de chaque fonction pour l’utilisateur.
4. Repérer les fonctions **trop chères** pour ce qu’elles apportent, et les retravailler.

## Exemple travaillé : une lampe de bureau à 40 €
| Fonction | Coût | Importance pour l’utilisateur |
| Éclairer la zone de travail | 14 € (35 %) | 50 % |
| S’orienter | 10 € (25 %) | 25 % |
| Tenir stable | 4 € (10 %) | 15 % |
| Plaire (aspect) | 12 € (30 %) | 10 % |

La fonction « plaire » coûte 30 % du prix pour 10 % de l’importance : c’est là qu’il faut chercher des économies (finition plus simple, moins de pièces décoratives). À l’inverse, « éclairer » est plutôt sous-dotée : une meilleure LED augmenterait la valeur.

## Les trois relations à comparer
| La relation | La question |
| **Fonction / coût / besoin** | Chaque fonction mérite-t-elle ce qu’elle coûte ? |
| **Fonction / coût / réalisation** | Quel procédé de fabrication rend cette fonction au moindre coût ? |
| **Fonction / impact environnemental** | Quel impact chaque fonction engendre-t-elle (matière, énergie, fin de vie) ? |

## Complexité, efficacité, coût
Ajouter une fonction (un écran, une connexion) augmente la **complexité** : plus de pièces, plus de pannes possibles, plus d’énergie. L’**intégration de fonctions** (une seule pièce qui en fait deux) réduit souvent coût et complexité. On compare les solutions **les unes par rapport aux autres**, à l’aide de bases de données de coûts.`,
          },
          questions: [
            ['Comment définit-on la valeur d’un produit en analyse de la valeur ?', ['Satisfaction du besoin divisée par le coût', 'Coût multiplié par la quantité', 'Nombre de fonctions', 'Prix de vente moins coût'], 0, 'On l’augmente en satisfaisant mieux, ou en dépensant moins.'],
            ['Changer de téléphone chaque année pour suivre la mode répond à un besoin…', ['fonctionnel', 'réel', 'induit', 'contraint'], 2, 'Il est créé par la publicité ou la mode.'],
            ['Sur une lampe, « plaire » coûte 30 % du prix pour 10 % de l’importance, « éclairer » 35 % pour 50 %. Quelle fonction est trop chère par rapport à son importance ?', ['Plaire', 'Éclairer', 'S’orienter', 'Tenir stable'], 0, 'Elle coûte 30 % pour 10 % d’importance.', 'Dans l’exemple de la lampe, quelle fonction est trop chère par rapport à son importance ?'],
            ['Quelle fonction de la lampe mériterait plus de moyens ?', ['S’orienter', 'Aucune', 'Plaire', 'Éclairer'], 3, '35 % du coût pour 50 % de l’importance : elle est sous-dotée.'],
            ['Le coût de « s’orienter » vaut 10 € sur 40 €. Quel pourcentage ?', ['10 %', '20 %', '25 %', '40 %'], 2, '10 / 40 = 0,25, soit 25 %.'],
            ['Ajouter des fonctions augmente toujours la valeur d’un produit.', ['Vrai', 'Faux'], 1, 'Cela augmente coût et complexité : utile seulement si le besoin le justifie.'],
            ['Qu’est-ce que l’intégration de fonctions ?', ['Séparer chaque fonction dans une pièce', 'Faire assurer plusieurs fonctions par une même pièce', 'Ajouter un logiciel', 'Multiplier les fournisseurs'], 1, 'Elle réduit souvent le nombre de pièces et le coût.'],
            ['Quelle relation interroge le procédé de fabrication ?', ['Fonction / coût / besoin', 'Fonction / coût / réalisation', 'Fonction / impact environnemental', 'Fonction / marque'], 1, 'On cherche le procédé qui réalise la fonction au moindre coût.'],
            ['Comment compare-t-on des solutions en analyse de compromis ?', ['Au hasard', 'Uniquement par l’avis du client', 'Par des valeurs absolues isolées', 'Par comparaison relative, avec des bases de données de coûts'], 3, 'Le programme insiste sur les analyses relatives entre solutions.'],
            ['Quelle est la première étape de l’analyse de la valeur ?', ['Lister les fonctions du produit', 'Choisir le matériau', 'Déposer un brevet', 'Baisser le prix'], 0, 'On raisonne par fonction, pas par pièce.'],
            ['Un produit compétitif tient aussi compte de son impact environnemental.', ['Vrai', 'Faux'], 0, 'La relation fonction / impact environnemental fait partie du programme.'],
            ['Pourquoi répondre au besoin réel plutôt qu’induit ?', ['Pour multiplier les pièces', 'Pour vendre plus cher', 'Pour éviter de fabriquer et payer des fonctions inutiles', 'Pour allonger les délais'], 2, 'C’est plus économique et plus sobre en ressources.'],
          ],
        },
        // ---- 7 ---------------------------------------------------------------
        {
          titre: 'Les méthodes de créativité',
          axe: 'Créativité et innovation technologique',
          lecon: {
            titre: 'Produire beaucoup d’idées, puis choisir',
            cours: `La créativité n’est pas un don réservé à quelques-uns : c’est une **méthode**. Elle se pratique en groupe et suit une règle d’or : d’abord **diverger**, ensuite **converger**.

## Diverger puis converger
| La phase | Ce qu’on fait | Ce qui est interdit |
| **Divergence** | Produire le plus d’idées possible, même farfelues | Critiquer, juger |
| **Convergence** | Trier, regrouper, évaluer, choisir | Rouvrir sans fin la liste |

> Juger trop tôt tue les idées fragiles… dont sortent souvent les meilleures.

## Les méthodes non rationnelles (intuitives)
| La méthode | Principe |
| **Brainstorming** | En groupe, chacun lance des idées ; la quantité prime, on rebondit sur celles des autres |
| **Carte mentale** | On ramifie un thème central en sous-thèmes |
| **Analogie** | On cherche comment un autre domaine a résolu un problème proche |
| **Biomimétisme** | On s’inspire du vivant : la bardane a inspiré le velcro, le martin-pêcheur le nez du TGV japonais |

## Les méthodes rationnelles
Elles s’appuient sur l’observation que les inventions suivent des **lois d’évolution**.
1. **Identifier une contradiction** : on veut améliorer un paramètre, mais cela en dégrade un autre. Exemple : un casque doit être **solide** (donc épais) et **léger** (donc fin).
2. **Appliquer un principe d’innovation** issu de l’analyse de milliers de brevets (méthode TRIZ) : segmenter, utiliser une structure alvéolaire, changer de matériau, rendre une pièce mobile…
3. Résultat pour le casque : une coque fine et rigide sur une mousse alvéolaire qui absorbe les chocs.

Quelques **lois d’évolution** des systèmes : ils deviennent plus **légers**, plus **intégrés**, plus **automatisés**, plus **dynamiques** (pièces fixes qui deviennent mobiles ou réglables).

## Intégrer les fonctions et transférer les technologies
- **Intégration de fonctions** : une seule pièce en fait plusieurs. La coque d’un smartphone sert d’enveloppe, de structure et d’antenne.
- **Transfert de technologie** : une solution d’un domaine est reprise ailleurs. Le GPS militaire est passé dans les voitures, les matériaux composites de l’aéronautique dans les vélos.

## Exemple : organiser une séance
1. Formuler le problème en question ouverte : « Comment ranger dix vélos sur 5 m² ? »
2. 15 minutes de brainstorming, un secrétaire note tout.
3. Regroupement des idées par familles (suspendre, empiler, plier, faire tourner).
4. Évaluation avec un tableau multicritère (coût, encombrement, facilité d’usage).
5. Choix argumenté d’une ou deux pistes à approfondir.`,
          },
          questions: [
            ['Quelle règle s’applique pendant la phase de divergence ?', ['On calcule les coûts', 'On limite le nombre d’idées', 'On choisit la meilleure idée', 'On ne juge pas les idées'], 3, 'La critique est réservée à la convergence.'],
            ['Le velcro, inspiré de la bardane, est un exemple de…', ['normalisation', 'brainstorming', 'biomimétisme', 'marketing'], 2, 'On s’inspire des solutions du vivant.'],
            ['Dans un brainstorming, qu’est-ce qui prime ?', ['La qualité de chaque idée', 'La quantité d’idées', 'L’avis du chef', 'Le coût'], 1, 'Plus il y a d’idées, plus on a de chances d’en trouver une bonne.'],
            ['Qu’est-ce qu’une contradiction technique ?', ['Améliorer un paramètre en dégrade un autre', 'Une erreur de calcul', 'Une norme non respectée', 'Un désaccord entre membres de l’équipe'], 0, 'Solide mais léger, puissant mais économe : ce sont des contradictions.'],
            ['Sur quoi reposent les principes d’innovation de la méthode TRIZ ?', ['Sur la mode', 'Sur le hasard', 'Sur l’analyse de très nombreux brevets', 'Sur les sondages clients'], 2, 'Les mêmes principes reviennent dans des domaines très différents.'],
            ['La coque d’un smartphone qui sert aussi d’antenne illustre…', ['l’intégration de fonctions', 'une innovation de marketing', 'une analogie', 'un transfert de technologie'], 0, 'Une même pièce assure plusieurs fonctions.'],
            ['Le passage du GPS militaire aux voitures est un…', ['biomimétisme', 'besoin induit', 'brevet', 'transfert de technologie'], 3, 'Une technologie change de domaine d’application.'],
            ['Laquelle est une loi d’évolution des systèmes techniques ?', ['Ils deviennent plus lourds', 'Ils deviennent plus intégrés et automatisés', 'Ils perdent des fonctions', 'Ils deviennent moins fiables'], 1, 'Allègement, intégration, automatisation, dynamisation reviennent sans cesse.'],
            ['Comment formuler le problème au début d’une séance ?', ['Par une solution imposée', 'Par une question ouverte', 'Par un budget', 'Par un planning'], 1, 'Une question ouverte laisse la place à toutes les pistes.'],
            ['La créativité est une méthode qui se travaille, pas seulement un don.', ['Vrai', 'Faux'], 0, 'Des méthodes structurées permettent à tout groupe d’être créatif.'],
            ['Quel outil sert à choisir entre les pistes en phase de convergence ?', ['Le brainstorming', 'La carte mentale', 'Le croquis', 'Le tableau multicritère'], 3, 'On note chaque piste sur des critères pondérés.'],
            ['Pour un casque solide et léger, quelle solution applique le principe « structure alvéolaire » ?', ['Une coque fine sur une mousse alvéolaire', 'Un casque en verre', 'Supprimer la coque', 'Une coque en acier épais'], 0, 'La mousse alvéolaire absorbe les chocs en pesant peu.'],
          ],
        },
        // ---- 8 ---------------------------------------------------------------
        {
          titre: 'Cycle de vie et éco-conception',
          axe: 'Approche environnementale',
          lecon: {
            titre: 'Réduire l’impact d’un produit dès sa conception',
            cours: `Environ 80 % de l’impact environnemental d’un produit est fixé dès sa **conception**. D’où l’idée de l’**éco-conception** : prendre en compte l’environnement dès le premier croquis, sur **tout le cycle de vie**.

## Les cinq phases du cycle de vie
| La phase | Ce qu’elle consomme ou rejette |
| **Extraction des matières premières** | Minerais, pétrole, eau, énergie |
| **Fabrication** | Énergie, chutes, rejets |
| **Transport et distribution** | Carburant, emballages |
| **Utilisation** | Énergie, consommables, entretien |
| **Fin de vie** | Déchets, recyclage, valorisation |

> On raisonne « du berceau à la tombe », et idéalement « du berceau au berceau » : la matière d’un produit en fin de vie devient celle d’un nouveau produit.

## L’analyse de cycle de vie (ACV)
L’ACV mesure les impacts d’un produit sur **plusieurs critères** à la fois : changement climatique (en kg équivalent CO2), consommation d’eau, épuisement des ressources, pollution de l’air et de l’eau. Elle évite les **transferts de pollution** : réduire un impact en en aggravant un autre.

## Exemple travaillé : bouilloire électrique
| Phase | Part de l’impact climatique |
| Matières | 8 % |
| Fabrication | 5 % |
| Transport | 2 % |
| Utilisation (électricité) | 83 % |
| Fin de vie | 2 % |

Conclusion : l’essentiel se joue à l’**utilisation**. La meilleure piste n’est pas un plastique « vert », mais une bouilloire qui chauffe **juste la quantité d’eau voulue** (graduation visible, petite contenance minimale) et une bonne **isolation** pour garder l’eau chaude.

> Il faut d’abord repérer la phase qui pèse le plus, puis agir sur elle.

## Les leviers de l’éco-conception
1. **Moins de matière** : optimiser les formes et les masses.
2. **Des matériaux mieux choisis** : recyclés, recyclables, peu énergivores, locaux.
3. **Une fabrication sobre** : moins de chutes, moins d’énergie.
4. **Un transport réduit** : produit compact, emballage minimal, production proche.
5. **Un usage économe** : efficacité énergétique, mise en veille, consommables réduits.
6. **Une fin de vie prévue** : démontage facile, matériaux identifiés, peu d’assemblages collés.
7. **Une durée de vie longue** : robustesse, réparabilité, pièces détachées disponibles.

## Les ressources ont un coût
Coût relatif, disponibilité et impact environnemental des matériaux varient beaucoup : l’aluminium recyclé demande environ **95 % d’énergie en moins** que l’aluminium primaire. Choisir un matériau, c’est aussi choisir son histoire et son avenir.`,
          },
          questions: [
            ['Quelle part de l’impact environnemental d’un produit se décide à la conception ?', ['Environ 10 %', 'Environ 30 %', 'Environ 80 %', '100 %'], 2, 'D’où l’intérêt d’agir dès les premiers choix.'],
            ['Combien de grandes phases compte le cycle de vie d’un produit ?', ['Dix', 'Deux', 'Trois', 'Cinq'], 3, 'Extraction, fabrication, transport, utilisation, fin de vie.'],
            ['Pour la bouilloire, quelle phase pèse le plus sur le climat ?', ['La fabrication', 'Le transport', 'L’utilisation', 'La fin de vie'], 2, '83 % de l’impact vient de l’électricité consommée.'],
            ['Quelle est donc la meilleure piste d’amélioration pour la bouilloire ?', ['Changer la couleur', 'Chauffer juste la quantité d’eau utile', 'Réduire l’emballage uniquement', 'Utiliser un plastique plus brillant'], 1, 'On agit d’abord sur la phase qui pèse le plus.'],
            ['Que mesure une analyse de cycle de vie ?', ['Les impacts environnementaux sur plusieurs critères', 'La durée de fabrication', 'Le nombre de pièces', 'Le prix de vente'], 0, 'Climat, eau, ressources, pollution sont évalués ensemble.'],
            ['Qu’est-ce qu’un transfert de pollution ?', ['Exporter des produits', 'Déplacer une usine', 'Réduire un impact en en aggravant un autre', 'Recycler un déchet'], 2, 'L’ACV multicritère sert justement à l’éviter.'],
            ['Quel levier facilite le recyclage en fin de vie ?', ['Un démontage facile et des matériaux identifiés', 'Augmenter la masse', 'Coller toutes les pièces', 'Mélanger les matériaux'], 0, 'Des matériaux séparables et repérés se trient mieux.'],
            ['L’aluminium recyclé demande beaucoup moins d’énergie que l’aluminium primaire.', ['Vrai', 'Faux'], 0, 'Environ 95 % d’énergie en moins.'],
            ['En quelle unité exprime-t-on l’impact sur le changement climatique ?', ['En litres', 'En euros', 'En kilowatts', 'En kg équivalent CO2'], 3, 'On convertit tous les gaz à effet de serre en équivalent CO2.'],
            ['Que signifie « du berceau au berceau » ?', ['Le produit est fabriqué pour les bébés', 'La matière en fin de vie redevient matière première', 'Le produit dure une vie humaine', 'Le produit est jetable'], 1, 'C’est l’idéal d’une économie circulaire.'],
            ['Allonger la durée de vie d’un produit réduit son impact global.', ['Vrai', 'Faux'], 0, 'Les impacts de fabrication sont répartis sur plus d’années d’usage.'],
            ['Lequel N’est PAS un levier d’éco-conception ?', ['Rendre le produit réparable', 'Multiplier les emballages', 'Améliorer l’efficacité énergétique', 'Réduire la masse'], 1, 'L’emballage doit au contraire être minimal.'],
          ],
        },
        // ---- 9 ---------------------------------------------------------------
        {
          titre: 'La maquette numérique',
          axe: 'Outils de représentation du réel',
          lecon: {
            titre: 'Concevoir en 3D avant de fabriquer',
            cours: `La **maquette numérique** est le modèle 3D d’un produit, construit avec un logiciel de CAO (conception assistée par ordinateur). Elle permet de voir, vérifier et modifier le produit **avant** d’en fabriquer la moindre pièce.

## Construire une pièce
1. **L’esquisse** : un dessin 2D sur un plan (rectangle, cercle, lignes).
2. **Les contraintes** : on fixe les **cotes** (longueurs, diamètres) et les **relations géométriques** (parallèle, perpendiculaire, tangent, coïncident). Une esquisse est **totalement contrainte** quand plus rien ne peut bouger.
3. **Les fonctions volumiques** : on transforme l’esquisse en volume.
| La fonction | Ce qu’elle fait |
| **Extrusion** | Pousse l’esquisse dans l’épaisseur |
| **Révolution** | Fait tourner l’esquisse autour d’un axe |
| **Enlèvement de matière** | Creuse, perce |
| **Congé, chanfrein** | Arrondit ou casse une arête |
| **Répétition** | Copie une forme en ligne ou en cercle |

4. **L’arbre de construction** garde l’historique : modifier une cote de l’esquisse met toute la pièce à jour. C’est la **conception paramétrée**.

> Une esquisse bien contrainte, c’est une pièce facile à modifier.

## Construire un assemblage
On importe les pièces et on les positionne par des **contraintes d’assemblage** : coaxialité (deux axes confondus), contact plan sur plan, coïncidence. Les pièces qui restent mobiles permettent de **simuler le mouvement** du mécanisme.

## Exploiter la maquette
| L’usage | Ce qu’il vérifie ou produit |
| **Détection d’interférences** | Deux pièces qui se chevauchent : erreur de conception |
| **Propriétés physiques** | Masse, volume, centre de gravité (le matériau est attribué) |
| **Mise en plan** | Dessin 2D coté pour la fabrication |
| **Rendu réaliste** | Images pour présenter le produit |
| **Export** | Fichier pour impression 3D ou usinage |
| **Simulation** | Mouvements, efforts, écoulements |

## Exemple travaillé
Une équipe modélise un support de smartphone : une plaque de 80 × 60 mm, extrudée de 4 mm, avec une encoche. Le test d’assemblage montre que le téléphone de 9 mm d’épaisseur n’entre pas dans l’encoche de 8 mm. On modifie **une seule cote** dans l’esquisse (8 → 10 mm pour laisser du jeu) : la pièce, l’assemblage et la mise en plan se mettent à jour. L’erreur a coûté trente secondes, au lieu d’une impression ratée.

## Maquette numérique et jumeau numérique
Le **jumeau numérique** va plus loin : c’est une représentation virtuelle **dynamique** d’un produit réel, qui reproduit son comportement et peut être alimentée par ses capteurs. En première, tu apprends surtout à **modifier** une maquette existante et à l’exploiter.`,
          },
          questions: [
            ['Que signifie CAO ?', ['Calcul analogique optimisé', 'Contrôle après opération', 'Commande automatique d’outils', 'Conception assistée par ordinateur'], 3, 'Les logiciels de CAO servent à construire la maquette numérique.'],
            ['Par quoi commence la modélisation d’une pièce ?', ['Par une esquisse 2D', 'Par l’assemblage', 'Par la mise en plan', 'Par le rendu'], 0, 'L’esquisse est ensuite transformée en volume.'],
            ['Quelle fonction fait tourner une esquisse autour d’un axe ?', ['Extrusion', 'Chanfrein', 'Révolution', 'Répétition'], 2, 'Elle sert aux pièces cylindriques : axes, poulies, bouteilles.'],
            ['Quand une esquisse est-elle totalement contrainte ?', ['Quand elle comporte un cercle', 'Quand elle est extrudée', 'Quand elle est colorée', 'Quand plus aucun élément ne peut bouger'], 3, 'Cotes et relations fixent entièrement sa géométrie.'],
            ['Que permet l’arbre de construction ?', ['De calculer le prix', 'De choisir le matériau', 'De modifier une cote et mettre à jour toute la pièce', 'D’imprimer la pièce'], 2, 'C’est le principe de la conception paramétrée.'],
            ['À quoi sert la détection d’interférences dans un assemblage ?', ['À planifier le projet', 'À repérer deux pièces qui se chevauchent', 'À calculer la masse', 'À produire un rendu'], 1, 'Un chevauchement est une erreur de conception.'],
            ['Quelle contrainte d’assemblage aligne deux axes ?', ['La coaxialité', 'Le congé', 'L’extrusion', 'Le contact plan'], 0, 'Deux axes confondus : un arbre dans un alésage, par exemple.'],
            ['Pour obtenir la masse d’une pièce, il faut lui attribuer un matériau.', ['Vrai', 'Faux'], 0, 'Le logiciel multiplie le volume par la masse volumique.'],
            ['Qu’est-ce que la mise en plan ?', ['Une simulation de chute', 'Un planning', 'Un dessin 2D coté destiné à la fabrication', 'Une vue 3D colorée'], 2, 'Elle est tirée automatiquement de la maquette.'],
            ['Pourquoi donner 10 mm à l’encoche d’un support prévu pour un téléphone de 9 mm d’épaisseur ?', ['Pour laisser un jeu permettant l’insertion', 'Pour l’esthétique', 'Parce que 10 est un nombre rond', 'Pour gagner de la matière'], 0, 'Une encoche exactement à la cote serait trop serrée.', 'Dans l’exemple, pourquoi porter l’encoche à 10 mm pour un téléphone de 9 mm ?'],
            ['Qu’est-ce qui distingue un jumeau numérique d’une simple maquette ?', ['Il n’a pas de volume', 'Il remplace le produit réel', 'Il est en papier', 'Il est dynamique et reproduit le comportement du produit réel'], 3, 'Il peut être alimenté par les données des capteurs du produit.'],
            ['Arrondir une arête vive se fait avec un…', ['esquisse', 'congé', 'perçage', 'révolution'], 1, 'Le chanfrein, lui, casse l’arête par un plan incliné.'],
          ],
        },
        // ---- 10 --------------------------------------------------------------
        {
          titre: 'Le prototypage rapide',
          axe: 'Prototypage et expérimentations',
          lecon: {
            titre: 'Fabriquer vite pour tester tôt',
            cours: `Un **prototype** est une première réalisation du produit, destinée à être **testée**. Le prototypage rapide permet de passer en quelques heures du fichier numérique à l’objet réel, et donc de **se tromper tôt et pas cher**.

## Maquette ou prototype ?
| L’objet | Ce qu’il sert à vérifier |
| **Maquette d’aspect** | Formes, proportions, couleurs, prise en main |
| **Maquette fonctionnelle** | Un principe de fonctionnement, sans l’aspect final |
| **Prototype** | Le produit presque complet, pour valider les performances |

## Les principaux procédés
| Le procédé | Principe | Atouts | Limites |
| **Impression 3D par dépôt de fil** (FDM) | Une buse dépose du plastique fondu couche par couche | Peu coûteux, formes complexes | Lent, pièces moins résistantes entre les couches |
| **Impression 3D résine** (stéréolithographie) | Un faisceau lumineux durcit une résine liquide couche par couche | Grande finesse de détail | Résine à manipuler avec précaution |
| **Découpe laser** | Un laser découpe ou grave une plaque | Rapide, précis, bois, carton, acrylique | Pièces planes (à assembler) |
| **Fraisage à commande numérique** | Un outil rotatif enlève de la matière | Matériaux variés, bonne précision | Formes limitées par l’accès de l’outil |
| **Coulage en résine** dans un moule silicone | On reproduit une pièce imprimée en petite série | Plusieurs exemplaires | Préparation du moule |

> Les procédés **additifs** ajoutent de la matière (impression 3D) ; les procédés **soustractifs** en enlèvent (découpe, fraisage).

## Du fichier à la pièce : l’impression 3D
1. **Exporter** la maquette au format maillé (STL).
2. **Trancher** avec un logiciel qui découpe la pièce en couches et génère le parcours de la buse (G-code).
3. **Régler** : hauteur de couche (0,1 à 0,3 mm), remplissage (15 à 30 % suffit souvent), supports pour les parties en surplomb.
4. **Imprimer**, puis retirer supports et défauts.

## Exemple travaillé
Une pièce de 30 cm³ imprimée en PLA (masse volumique 1,24 g/cm³) avec 20 % de remplissage et des parois pleines consomme environ 15 g de fil au lieu de 37 g pour une pièce pleine. À 25 € le kilo, le coût matière est d’environ **0,40 €**.

## Tester le prototype
Un prototype ne vaut que par les **essais** qu’on lui fait subir :
1. Définir ce que l’on veut vérifier (une exigence du cahier des charges).
2. Écrire un **protocole** : conditions, mesures, nombre d’essais.
3. Mesurer, puis **comparer** au cahier des charges.
4. Conclure : conforme, ou à modifier.

La prise en compte de la **sécurité** (lunettes, capot fermé sur la découpeuse laser, ventilation) fait partie du travail.`,
          },
          questions: [
            ['L’impression 3D est un procédé…', ['soustractif', 'additif', 'de moulage', 'de forgeage'], 1, 'Elle ajoute de la matière couche par couche.'],
            ['Quel procédé convient le mieux pour découper rapidement des pièces planes en bois ou en acrylique ?', ['Le coulage', 'Le fraisage 5 axes', 'L’impression résine', 'La découpe laser'], 3, 'Les pièces planes s’assemblent ensuite.'],
            ['Quel format de fichier exporte-t-on pour l’impression 3D ?', ['STL', 'MP3', 'PDF', 'TXT'], 0, 'Le format STL décrit la surface par des triangles.'],
            ['Que fait le logiciel de tranchage ?', ['Il calcule le prix de vente', 'Il dessine la pièce', 'Il découpe la pièce en couches et génère le parcours de la buse', 'Il peint la pièce'], 2, 'Il produit le G-code lu par l’imprimante.'],
            ['À quoi servent les supports en impression 3D ?', ['À renforcer le fil', 'À refroidir la buse', 'À colorer la pièce', 'À soutenir les parties en surplomb'], 3, 'Ils sont retirés après impression.'],
            ['Une maquette d’aspect sert surtout à vérifier…', ['le rendement', 'les performances électriques', 'les formes, proportions et prise en main', 'la résistance mécanique'], 2, 'Elle ne fonctionne pas forcément.'],
            ['Le fraisage à commande numérique est un procédé soustractif.', ['Vrai', 'Faux'], 0, 'Un outil rotatif enlève de la matière au brut.'],
            ['Pourquoi réduire le taux de remplissage d’une pièce imprimée ?', ['Pour la rendre plus lourde', 'Pour économiser matière et temps', 'Pour la rendre transparente', 'Pour changer de matériau'], 1, 'Un remplissage de 15 à 30 % suffit souvent.'],
            ['Quelle est la masse d’une pièce pleine de 30 cm³ en PLA (1,24 g/cm³) ?', ['24 g', '30 g', '37 g environ', '124 g'], 2, '30 × 1,24 = 37,2 g.'],
            ['Quelle est la première étape d’un essai sur prototype ?', ['Définir ce que l’on veut vérifier', 'Peindre le prototype', 'Déposer un brevet', 'Mesurer au hasard'], 0, 'On part d’une exigence du cahier des charges.'],
            ['Quel procédé permet de reproduire une pièce imprimée en petite série ?', ['La mise en plan', 'La découpe laser', 'Le coulage en résine dans un moule silicone', 'Le tranchage'], 2, 'Le moule silicone est pris sur la pièce imprimée.'],
            ['Un prototype n’a de valeur que par les essais qu’on lui fait subir.', ['Vrai', 'Faux'], 0, 'Fabriquer sans tester ne valide rien.'],
          ],
        },
        // ---- 11 --------------------------------------------------------------
        {
          titre: 'Méthode : le projet de fin de première et son évaluation',
          axe: 'Le projet et l’évaluation',
          lecon: {
            titre: 'Réussir le projet de 36 heures',
            cours: `En fin de première, tu mènes en équipe un **projet d’environ 36 heures** : imaginer et matérialiser tout ou partie d’une solution originale pour répondre à un besoin. Il peut prendre la forme d’un **défi** commun à la classe ou à l’établissement.

## Comment l’innovation technologique est évaluée
L’innovation technologique s’**arrête en fin de première** (elle fusionne ensuite avec I2D dans la spécialité 2I2D de terminale). Elle est donc évaluée en **contrôle continu**, avec un **coefficient 8** au baccalauréat. Les compétences visées sont :
| L’objectif | Ce qu’on attend de toi |
| **O2** | Identifier les éléments qui influencent le développement d’un produit (cahier des charges, compétitivité) |
| **O4** | Communiquer une idée, un principe, une solution, y compris en langue étrangère |
| **O5** | Imaginer une solution en menant une démarche de projet |
| **O7** | Expérimenter et réaliser un prototype ou une maquette |
S’y ajoute la **maîtrise de l’expression orale**.

## Les étapes du projet
1. **S’approprier le besoin** : reformuler le problème, identifier l’utilisateur et le contexte, lire ou compléter le cahier des charges.
2. **Explorer** : recherche d’existant (produits, brevets), séance de créativité.
3. **Choisir** : tableau multicritère, justification écrite.
4. **Concevoir** : croquis, maquette numérique, choix des matériaux et des composants.
5. **Réaliser** : prototype ou maquette par prototypage rapide.
6. **Tester** : protocole, mesures, comparaison au cahier des charges.
7. **Présenter** : revue de projet finale, à l’oral.

## Les outils qui font la différence
- **Le planning** (Gantt) posé dès le début, et **tenu à jour**.
- **Le carnet de bord** : chaque séance, ce qui a été fait, par qui, les décisions et leurs raisons.
- **La répartition des rôles**, sans laisser personne de côté : chacun doit pouvoir expliquer l’ensemble du projet.

> Le jury n’évalue pas seulement l’objet : il évalue ta **démarche** et ta capacité à **justifier tes choix**.

## Réussir la présentation orale
| À faire | À éviter |
| Annoncer le besoin et la problématique en une phrase | Commencer par les détails techniques |
| Montrer le prototype, le faire fonctionner | Cacher ce qui ne marche pas |
| Justifier chaque choix : « nous avons retenu…, car… » | « On a fait comme ça » |
| Présenter les résultats des essais et les écarts | Affirmer sans mesure |
| Proposer des améliorations | Conclure par « voilà » |

## Exemple de problématique bien formulée
« Comment permettre à une personne âgée de savoir, sans se déplacer, si la porte d’entrée est bien fermée ? » Elle précise **l’utilisateur**, le **besoin** et laisse **ouvertes** les solutions — capteur, application, voyant lumineux.

> Un prototype imparfait mais testé, analysé et amélioré vaut mieux qu’un bel objet jamais mesuré.`,
          },
          questions: [
            ['Quelle est la durée indicative du projet de fin de première ?', ['Environ 36 heures', '72 heures', '100 heures', '6 heures'], 0, 'Le projet de terminale, lui, dure 72 heures.'],
            ['Comment l’innovation technologique est-elle évaluée au baccalauréat ?', ['Par le grand oral uniquement', 'Elle n’est pas évaluée', 'Par une épreuve écrite de 4 h', 'En contrôle continu'], 3, 'La spécialité s’arrête en fin de première.'],
            ['Quel est son coefficient au baccalauréat ?', ['2', '5', '8', '16'], 2, 'Comme toute spécialité abandonnée en fin de première.'],
            ['Que devient l’innovation technologique en terminale ?', ['Elle disparaît sans suite', 'Elle fusionne avec I2D dans la spécialité 2I2D', 'Elle devient une option facultative', 'Elle est remplacée par la physique'], 1, 'I2D et IT forment en terminale « ingénierie, innovation et développement durable ».'],
            ['À quoi sert le carnet de bord ?', ['À noter les absences', 'À garder la trace de ce qui a été fait et des décisions', 'À remplacer le prototype', 'À calculer la note'], 1, 'Il montre la démarche au jury.'],
            ['Que doit préciser une bonne problématique ?', ['Le prix du prototype', 'Le nom du logiciel', 'La solution retenue', 'L’utilisateur et le besoin, en laissant les solutions ouvertes'], 3, 'Imposer une solution dès la question fermerait la recherche.'],
            ['Pendant l’oral, que faire de ce qui ne fonctionne pas ?', ['L’analyser et proposer une amélioration', 'Accuser un camarade', 'N’en rien dire', 'Le cacher'], 0, 'Analyser un écart est une compétence évaluée.'],
            ['Le jury évalue uniquement la qualité de l’objet final.', ['Vrai', 'Faux'], 1, 'Il évalue surtout la démarche et la justification des choix.'],
            ['Quel objectif correspond à « expérimenter et réaliser un prototype » ?', ['O4', 'O5', 'O7', 'O2'], 2, 'O7 : expérimenter et réaliser des prototypes ou des maquettes.'],
            ['Quelle phrase justifie correctement un choix ?', ['« C’était plus joli. »', '« Le professeur l’a dit. »', '« On a fait comme ça. »', '« Nous avons retenu l’aluminium car il est léger et recyclable. »'], 3, 'Un choix se justifie par des critères du cahier des charges.'],
            ['Quand faut-il poser le planning du projet ?', ['Seulement si le projet prend du retard', 'À la fin', 'Dès le début, puis le tenir à jour', 'Jamais'], 2, 'Un planning non tenu à jour ne sert à rien.'],
            ['L’objectif O4 comprend la communication en langue étrangère.', ['Vrai', 'Faux'], 0, 'Communiquer une idée ou une solution, y compris en langue étrangère.'],
          ],
        },
      ],
    },
  ],
}
