// EPS — TERMINALE : LE PROGRAMME DU LYCÉE ET LE BAC (10 fiches).
//
// LE DÉFAUT. Sondé le 26/09/2026 (extraction lots/Tle/sport.md) : l’EPS de
// Terminale n’a que TROIS fiches maison, partagées avec la 2de et la 1re
// (bloc 2de-1re-Tle de sport.mjs) — « S’entraîner et planifier »,
// « Alimentation, sommeil et performance », « Sport, société et valeurs » —,
// jamais confrontées au programme. Les cinq champs d’apprentissage du lycée,
// leurs attendus de fin de lycée (AFL), les rôles sociaux, la sécurité et
// surtout la façon dont l’élève est noté au bac n’avaient AUCUNE entrée.
//
// SOURCES : programme d’EPS du lycée général et technologique (BO spécial n° 1
// du 22 janvier 2019) — cinq objectifs généraux, cinq champs d’apprentissage,
// trois AFL par champ ; note de service du 20 février 2026 (BO n° 9 du
// 26 février 2026, NOR MENE2531948N), applicable dès la session 2026, qui
// reprend sans les modifier les référentiels nationaux du CCF (BO n° 17 du
// 28 avril 2022).
//
// ⚠️ CE QU’UNE APP PEUT ENSEIGNER EN EPS : comme sport-college.mjs, ce module
// ne prétend pas remplacer la pratique. Il couvre ce qui se sait et se
// comprend : ce qu’attend chaque champ, comment s’entraîner, se préparer, se
// protéger, tenir un rôle, et comment le bac est noté.
//
// PÉRIMÈTRE : la TERMINALE SEULE, et on AJOUTE. Pas de ménage : les 3 fiches
// existantes restent (positions 1 à 3, sans chapitre de programme), les 10
// neuves partent de la position 4.
//
// ⚠️ Ne JAMAIS générer avec `--slugs sport` : toujours `--modules sport-tle`.

export default {
  slug: 'sport',
  nom: 'Sport',

  titreMigration: 'EPS Tle — LE PROGRAMME DU LYCÉE ET LE BAC (10 fiches)',

  motif: `CONSTAT (extraction du 26/09/2026) : l'EPS de Terminale n'avait que TROIS
fiches maison, partagées avec la 2de et la 1re — « S'entraîner et planifier »,
« Alimentation, sommeil et performance », « Sport, société et valeurs » —,
jamais confrontées au programme d'EPS du lycée (BO spécial n° 1 du 22 janvier
2019). Les cinq champs d'apprentissage, les attendus de fin de lycée, les rôles
sociaux, la sécurité et les règles du bac en contrôle en cours de formation
(note de service du 20 février 2026) n'avaient aucune entrée.

Cette migration AJOUTE 10 fiches, au niveau Tle seulement, rangées sous les
objectifs généraux du programme, à partir de la position 4. Elle ne retire rien.`,

  blocs: [
    {
      niveaux: ['Tle'],
      positionDepart: 4,
      chapitres: [
        // ---- Les champs d’apprentissage ------------------------------------
        {
          titre: 'Les cinq champs d’apprentissage du lycée',
          axe: 'Les champs d’apprentissage',
          lecon: {
            titre: 'Ce qu’on apprend, selon l’activité',
            cours: `Au lycée, l’EPS ne se découpe pas en sports mais en **champs d’apprentissage** : des familles d’activités qui font apprendre la même chose. Le basket et le badminton n’ont presque rien en commun sur le terrain, mais tous deux t’apprennent à gagner un affrontement.

## Les cinq champs
| Champ | Intitulé du programme | Exemples d’activités |
| **CA1** | Réaliser une performance motrice maximale, mesurable à une échéance donnée | Courses, sauts, lancers, natation de vitesse |
| **CA2** | Adapter son déplacement à des environnements variés et/ou incertains | Escalade, course d’orientation, sauvetage aquatique |
| **CA3** | Réaliser une prestation corporelle destinée à être vue et appréciée | Danse, acrosport, gymnastique, arts du cirque |
| **CA4** | Conduire et maîtriser un affrontement individuel ou collectif | Sports collectifs, badminton, tennis de table, sports de combat |
| **CA5** | Réaliser et orienter son activité physique pour développer ses ressources et s’entretenir | Course en durée, musculation, step, natation en durée |

> Le CA5 est propre au lycée : on n’y cherche pas à battre quelqu’un, mais à se transformer soi-même selon un objectif qu’on a choisi.

## Les cinq objectifs généraux
Tous les champs servent les cinq objectifs du programme :
1. **Développer sa motricité.**
2. **Savoir se préparer et s’entraîner.**
3. **Exercer sa responsabilité** individuelle et au sein d’un collectif.
4. **Construire durablement sa santé.**
5. **Accéder au patrimoine culturel** que représentent les pratiques physiques, sportives et artistiques.

## Trois attendus par champ
Dans chaque champ, le programme fixe trois **attendus de fin de lycée** (AFL). Ils ont toujours la même logique :

| Attendu | Ce qu’il vise | Exemple en CA1 |
| **AFL1** | Agir : la motricité, la performance, l’efficacité | Produire sa meilleure performance avec une technique efficace |
| **AFL2** | Se préparer, s’entraîner, analyser | Tenir un carnet d’entraînement et ajuster ses choix |
| **AFL3** | Tenir des rôles, vivre avec les autres | Chronométrer, juger, être partenaire d’entraînement |

## Exemple : une même classe, trois champs
Au cours de l’année de Terminale, une classe peut pratiquer du demi-fond (CA1), de l’acrosport (CA3) et du volley-ball (CA4). Pour chaque activité, l’élève sait qu’on attend de lui une motricité efficace (AFL1), une préparation réfléchie (AFL2) et un rôle bien tenu (AFL3). C’est aussi ainsi que se construit l’ensemble d’épreuves du bac, dans trois champs différents.`,
          },
          questions: [
            ['Combien de champs d’apprentissage compte le programme d’EPS du lycée ?', ['Trois', 'Quatre', 'Cinq', 'Six'], 2, 'Le cinquième, orienté vers l’entretien de soi, est propre au lycée.'],
            ['La course d’orientation relève du champ…', ['CA2 : adapter son déplacement à des environnements variés ou incertains', 'CA1 : performance maximale', 'CA3 : prestation vue et appréciée', 'CA4 : affrontement'], 0, 'On y lit un milieu qu’on ne connaît pas d’avance.'],
            ['Quel champ regroupe la danse et l’acrosport ?', ['CA1', 'CA4', 'CA5', 'CA3'], 3, 'La prestation y est destinée à être vue et appréciée.'],
            ['Le badminton relève du champ CA4.', ['Vrai', 'Faux'], 0, 'C’est un affrontement individuel, où l’on cherche à gagner le rapport de force.'],
            ['Que vise le champ CA5 ?', ['Battre un adversaire', 'Développer ses ressources et s’entretenir selon un objectif choisi', 'Réaliser un spectacle', 'Parcourir un milieu inconnu'], 1, 'On s’y transforme soi-même, sans chercher à battre quelqu’un.'],
            ['Combien d’attendus de fin de lycée (AFL) le programme fixe-t-il par champ ?', ['Un', 'Deux', 'Quatre', 'Trois'], 3, 'AFL1, AFL2 et AFL3.'],
            ['Sur quoi porte principalement l’AFL1 ?', ['La motricité et l’efficacité dans l’action', 'Les rôles sociaux', 'L’alimentation', 'Le règlement intérieur'], 0, 'C’est l’attendu « agir » : la performance, la technique, la tactique.'],
            ['Que vise l’AFL3 ?', ['La vitesse maximale', 'La souplesse', 'Les rôles et la vie avec les autres', 'Le choix de la tenue'], 2, 'Juger, arbitrer, observer, être partenaire.'],
            ['Lequel de ces objectifs figure parmi les cinq objectifs généraux du programme ?', ['Gagner une médaille', 'Construire durablement sa santé', 'Devenir professionnel', 'Pratiquer un seul sport'], 1, 'Les autres : motricité, entraînement, responsabilité, patrimoine culturel.'],
            ['Le sprint et le lancer de javelot appartiennent au CA1.', ['Vrai', 'Faux'], 0, 'On y cherche une performance maximale mesurée.'],
            ['Pourquoi le programme regroupe-t-il les activités en champs ?', ['Parce que les activités d’un même champ font apprendre la même chose', 'Pour réduire le nombre de terrains', 'Pour des raisons de coût', 'Parce que chaque champ correspond à une fédération'], 0, 'Basket et badminton apprennent tous deux à conduire un affrontement.'],
            ['La musculation pratiquée pour se développer selon un objectif personnel relève du…', ['CA1', 'CA3', 'CA4', 'CA5'], 3, 'On y oriente son activité pour développer ses ressources.'],
          ],
        },
        {
          titre: 'Réaliser sa meilleure performance (CA1)',
          axe: 'Les champs d’apprentissage',
          lecon: {
            titre: 'Vitesse utile, technique et filières',
            cours: `Courir, sauter, lancer, nager vite : dans le CA1, la performance est mesurée au chronomètre ou au mètre, à une date fixée. Mais on n’y évalue pas que le chiffre : on évalue aussi la façon de l’obtenir.

## Ce que l’on attend
Le référentiel national formule ainsi l’AFL1 du CA1 : **s’engager pour produire une performance maximale à l’aide de techniques efficaces, en gérant les efforts musculaires et respiratoires nécessaires et en faisant le meilleur compromis entre l’accroissement de vitesse d’exécution et de précision.**

> Aller plus vite ne sert à rien si le geste se dégrade : c’est tout le sens du « compromis entre vitesse et précision ».

## La vitesse utile
Le référentiel parle de **vitesse utile** : la vitesse la plus élevée que tu peux maîtriser **sans dégrader** ta coordination, ta respiration ou ton équilibre.

| Situation | Ce qui se passe |
| Trop lent | Les actions propulsives se juxtaposent, la vitesse se perd |
| Trop vite | La vitesse désorganise le geste : appuis mal placés, élan perdu |
| Vitesse utile | Les actions sont coordonnées et continues : la vitesse se crée et se conserve |

## Performance et indice technique
Au bac, l’AFL1 du CA1 est noté sur 12 points, en deux éléments :

| Élément | Points | Ce qui est mesuré |
| La performance maximale | 6 | Tes meilleures performances, sur un barème de l’établissement, avec un seuil médian national |
| L’efficacité technique | 6 | Un **indice technique** fait d’indicateurs chiffrés |

Exemples d’indices techniques : l’écart entre ton temps sur le plat et ton temps sur les haies, l’écart entre la somme des temps individuels et le temps du relais, le nombre de coups de bras en natation.

## Choisir la bonne filière d’effort
| Effort | Filière surtout sollicitée | Ce qu’il faut gérer |
| Moins de 10 s (sprint, saut, lancer) | Anaérobie alactique | Une récupération complète entre les essais |
| De 10 s à 2 min environ (400 m, 100 m nage) | Anaérobie lactique | La répartition de l’effort, pour ne pas s’effondrer à la fin |
| Au-delà | Aérobie | L’allure régulière |

## La méthode pour un jour d’épreuve
1. S’échauffer spécifiquement, jusqu’à des gestes proches de l’intensité de l’épreuve.
2. Répartir intelligemment ses essais (quand le règlement le permet, on peut choisir l’élan, le type de départ, le nombre d’essais).
3. Récupérer vraiment entre deux essais maximaux : plusieurs minutes pour un effort bref et intense.
4. Viser d’abord un essai sûr, puis un essai plus risqué.

## Exemple travaillé
Un élève court le 50 m plat en 7,4 s et le 50 m haies en 8,6 s. Son écart est de 1,2 s. S’il améliore son franchissement et passe à 8,3 s sur les haies, l’écart tombe à 0,9 s : son **indice technique** progresse, même si son temps sur le plat n’a pas bougé.`,
          },
          questions: [
            ['Qu’appelle-t-on la vitesse utile ?', ['La vitesse maximale absolue', 'La vitesse la plus élevée que l’on maîtrise sans dégrader son geste', 'La vitesse moyenne d’une classe', 'La vitesse de récupération'], 1, 'Au-delà, la vitesse désorganise la coordination.'],
            ['Sur combien de points est noté l’AFL1 d’une épreuve de bac ?', ['12', '8', '20', '6'], 0, 'Les 8 autres points vont à l’AFL2 et à l’AFL3.'],
            ['En CA1, l’AFL1 croise la performance avec…', ['La tenue vestimentaire', 'Le nombre de spectateurs', 'L’efficacité technique mesurée par un indice', 'La note de l’an passé'], 2, 'Deux éléments, 6 points chacun.'],
            ['Quelle filière domine lors d’un effort de moins de 10 secondes ?', ['Aérobie', 'Anaérobie lactique', 'Aucune', 'Anaérobie alactique'], 3, 'Elle fournit une énergie immédiate mais très brève.'],
            ['Aller le plus vite possible garantit toujours la meilleure performance.', ['Vrai', 'Faux'], 1, 'Trop de vitesse dégrade le geste : on cherche un compromis vitesse-précision.'],
            ['Quel exemple est un indicateur d’indice technique ?', ['L’écart entre le temps sur le plat et le temps sur les haies', 'La couleur des pointes', 'La taille de l’élève', 'Le nombre de spectateurs'], 0, 'Il révèle ce que le franchissement coûte en vitesse.'],
            ['Pourquoi récupérer plusieurs minutes entre deux essais de saut ?', ['Pour refroidir les muscles', 'Pour reconstituer l’énergie de la filière alactique', 'Pour allonger l’épreuve', 'Ce n’est pas utile'], 1, 'Sans récupération, l’essai suivant sera moins explosif.'],
            ['Sur un 400 m, que faut-il surtout gérer ?', ['Le départ uniquement', 'La répartition de l’effort', 'La couleur du couloir', 'Rien, il suffit de sprinter'], 1, 'La filière lactique s’épuise : partir trop vite fait s’effondrer à la fin.'],
            ['Un écart plat-haies qui passe de 1,2 s à 0,9 s signifie que…', ['Le temps sur le plat a baissé', 'L’élève a fait une faute', 'L’efficacité technique a progressé', 'La performance a baissé'], 2, 'Le franchissement coûte moins de vitesse.'],
            ['En CA1, l’élève peut faire certains choix, comme le type de départ ou d’élan.', ['Vrai', 'Faux'], 0, 'Le référentiel prévoit des choix possibles pour l’AFL1.'],
            ['Quelle stratégie d’essais est conseillée ?', ['Tout miser sur un essai très risqué dès le début', 'Faire un seul essai', 'Ne pas s’échauffer pour garder de l’énergie', 'Assurer d’abord un essai sûr, puis tenter plus'], 3, 'Une première marque sûre libère pour la suite.'],
            ['Comment est fixé le barème de la performance maximale ?', ['Par l’élève lui-même', 'Par l’établissement, autour d’un seuil médian national', 'Par tirage au sort', 'Par la fédération sportive'], 1, 'Le seuil médian (3 points sur 6) est national, le reste du barème est construit par l’établissement.'],
          ],
        },
        {
          titre: 'S’adapter à un milieu incertain (CA2)',
          axe: 'Les champs d’apprentissage',
          lecon: {
            titre: 'Lire le milieu, choisir, s’engager en sécurité',
            cours: `Dans le CA2, le terrain n’est jamais le même : une voie d’escalade inconnue, une forêt, un plan d’eau. La réussite dépend de ta capacité à **lire le milieu**, à **choisir** un itinéraire à ta mesure et à t’y engager **en sécurité**.

## Ce qui caractérise le champ
| Élément | Ce qu’il demande |
| Un milieu incertain | Anticiper, prélever des informations, ajuster en route |
| Un itinéraire choisi | Estimer sa difficulté et ses propres ressources |
| Un risque réel | Respecter des règles de sécurité non négociables |

> Dans ce champ, bien réussir, c’est choisir un défi à la hauteur de ses moyens : trop facile, on n’apprend rien ; trop dur, on se met en danger.

## En escalade : la chaîne de sécurité
1. **S’encorder** : le grimpeur s’attache au pontet de son baudrier avec un **nœud en huit** tressé, suivi d’un nœud d’arrêt.
2. **Vérifier mutuellement** avant chaque départ : baudrier bien serré, nœud complet, système d’assurage bien installé, mousqueton verrouillé.
3. **Assurer** : l’assureur garde toujours une main sur le brin libre de la corde et suit la progression sans laisser de mou excessif.
4. **Communiquer** : on convient des consignes (« prêt ? », « vas-y », « sec », « descends »).
5. **Contre-assurer** si nécessaire : un troisième élève tient le brin libre derrière l’assureur.

!> On ne grimpe jamais sans la vérification croisée. La plupart des accidents viennent d’un nœud mal terminé ou d’un baudrier mal fermé, pas de la difficulté de la voie.

## En course d’orientation : lire la carte
| Geste | Ce qu’il permet |
| **Orienter la carte** | Faire coïncider le nord de la carte avec le nord réel, avec la boussole ou les éléments du terrain |
| **Lire la légende** | Reconnaître les couleurs : jaune = zone découverte, blanc = forêt facile à traverser, vert = végétation plus dense, bleu = eau, marron = relief |
| **Repérer des lignes directrices** | Suivre un chemin, une clôture, un ruisseau pour ne pas se perdre |
| **Choisir un point d’attaque** | Un élément facile à trouver près du poste, d’où l’on termine avec précision |

## Les choix dans l’épreuve
Le CA2 laisse une grande part de décision à l’élève : choix de la voie ou du parcours, de l’itinéraire entre deux postes, du moment où l’on renonce. Savoir **renoncer** fait partie de la compétence.

## Exemple travaillé
Entre deux balises, le trajet direct traverse 300 m de forêt dense (vert foncé) ; le détour par le chemin fait 500 m. En forêt dense, on avance très lentement et on perd facilement la direction. Le chemin, plus long, est souvent plus **rapide** et plus **sûr** : c’est une ligne directrice. Bon choix : le chemin, puis un point d’attaque proche de la balise.`,
          },
          questions: [
            ['Quel nœud utilise-t-on pour s’encorder en escalade ?', ['Le nœud plat', 'Le nœud de chaise simple', 'Le nœud en huit tressé', 'Le nœud de cravate'], 2, 'Il est suivi d’un nœud d’arrêt, et vérifié avant chaque départ.'],
            ['Que doit faire l’assureur en permanence ?', ['Garder une main sur le brin libre de la corde', 'Regarder les autres cordées', 'Lâcher la corde quand le grimpeur est haut', 'Tirer très fort sur la corde'], 0, 'C’est le brin libre qui permet de bloquer une chute.'],
            ['La vérification mutuelle avant de grimper peut être supprimée si l’on est pressé.', ['Vrai', 'Faux'], 1, 'Elle est non négociable : la plupart des accidents viennent d’un oubli.'],
            ['Que signifie orienter sa carte ?', ['La plier correctement', 'Écrire son nom dessus', 'La colorier', 'Faire coïncider le nord de la carte et le nord réel'], 3, 'On lit alors le terrain dans le même sens que la carte.'],
            ['Sur une carte de course d’orientation, le bleu représente…', ['La forêt dense', 'L’eau', 'Le relief', 'Les routes'], 1, 'Le vert indique la végétation dense, le marron le relief.'],
            ['Qu’est-ce qu’une ligne directrice ?', ['Un élément linéaire facile à suivre : chemin, clôture, ruisseau', 'Le trait d’arrivée', 'La consigne du professeur', 'Une zone interdite'], 0, 'Elle permet d’avancer vite sans se perdre.'],
            ['Pourquoi un détour par un chemin peut-il être plus rapide qu’un trajet direct en forêt dense ?', ['Parce que le chemin est toujours plus court', 'Parce qu’il est interdit de traverser la forêt', 'Parce qu’on avance plus vite et qu’on se perd moins', 'Parce que les balises sont sur les chemins'], 2, 'La distance ne fait pas tout : la vitesse de progression compte.'],
            ['Que fait le contre-assureur ?', ['Il grimpe à côté', 'Il chronomètre', 'Il juge la voie', 'Il tient le brin libre derrière l’assureur'], 3, 'Il ajoute une sécurité, surtout quand l’assureur débute.'],
            ['En CA2, savoir renoncer fait partie de la compétence.', ['Vrai', 'Faux'], 0, 'Choisir un défi à sa mesure inclut de savoir s’arrêter.'],
            ['Qu’est-ce qu’un point d’attaque ?', ['Le départ de la course', 'Un élément facile à trouver près du poste, d’où l’on termine avec précision', 'Le poste le plus difficile', 'Un raccourci interdit'], 1, 'On y arrive vite, puis on termine lentement et précisément.'],
            ['Qu’est-ce qui caractérise le CA2 ?', ['Un adversaire direct', 'Un public qui juge', 'Un milieu variable ou incertain à lire', 'Une performance au chronomètre sur piste'], 2, 'Le milieu change : il faut prélever des informations et s’adapter.'],
            ['Que dit un grimpeur qui veut que l’assureur retienne la corde tendue ?', ['« Vas-y »', '« Sec »', '« Prêt »', '« Du mou »'], 1, 'On convient des consignes avant de partir.'],
          ],
        },
        {
          titre: 'Composer une prestation jugée (CA3)',
          axe: 'Les champs d’apprentissage',
          lecon: {
            titre: 'Créer, présenter, apprécier',
            cours: `Dans le CA3, on ne gagne pas contre quelqu’un : on crée une **prestation** — un enchaînement de gymnastique, une chorégraphie, une pyramide d’acrosport — qui sera **vue et appréciée** par des juges et des spectateurs. Elle se construit comme une œuvre, et se juge sur des critères connus d’avance.

## Deux familles d’activités
| Famille | Ce qui compte | Exemples |
| Activités **acrobatiques** | La difficulté des éléments et la qualité de leur exécution | Gymnastique, acrosport |
| Activités **artistiques** | L’intention, l’originalité, l’émotion transmise | Danse, arts du cirque |

## Ce qu’on juge
| Critère | Question que se pose le juge |
| Difficulté | Quels éléments sont présentés, et de quelle valeur ? |
| Exécution | Sont-ils réalisés avec amplitude, maîtrise, stabilité ? |
| Composition | L’enchaînement est-il construit, varié, bien relié ? |
| Interprétation | La prestation porte-t-elle une intention, un propos ? |

> Mieux vaut un élément plus simple parfaitement maîtrisé qu’un élément difficile raté : une chute ou un déséquilibre coûte souvent plus que la difficulté ne rapporte.

## Les procédés de composition
| Procédé | Ce qu’il produit |
| **Unisson** | Tous font le même geste en même temps |
| **Canon** | Le même geste, décalé dans le temps d’un danseur à l’autre |
| **Cascade** | Un geste qui se propage rapidement d’un danseur au suivant |
| **Contraste** | Opposer vitesse et lenteur, haut et bas, fort et doux |
| **Répétition** | Reprendre un motif pour le rendre lisible |
| **Accumulation** | Ajouter un geste à chaque reprise de la phrase |

## La sécurité : la parade
En gymnastique et en acrosport, la **parade** protège le pratiquant : le pareur se place près de la zone de risque, les mains prêtes à accompagner ou retenir, sans gêner l’exécution. En acrosport, on monte et on descend d’une pyramide **en passant par des appuis sûrs** (bassin, épaules), jamais sur le dos ou les reins du porteur.

!> Le porteur garde le dos plat et les appuis stables ; le voltigeur ne saute jamais d’une position haute.

## La méthode pour composer
1. Choisir une **intention** ou un fil conducteur.
2. Sélectionner des éléments **maîtrisés**, dont quelques-uns de difficulté plus élevée.
3. Les relier par des **liaisons** fluides et utiliser l’espace (directions, niveaux).
4. Employer au moins deux **procédés de composition**.
5. Répéter devant un **observateur** qui note ce qui se voit — et ce qui ne se voit pas.

## Exemple
Un groupe de quatre compose une pyramide d’acrosport. Plutôt que tenter une figure à trois étages mal stabilisée, il présente deux pyramides à deux étages tenues trois secondes chacune, reliées par une cascade de roulades et un passage à l’unisson : la difficulté est moindre, mais l’exécution et la composition rapportent davantage.`,
          },
          questions: [
            ['Que désigne le canon en composition ?', ['Tous font le même geste en même temps', 'Le même geste réalisé avec un décalage d’un pratiquant à l’autre', 'Un geste très puissant', 'Un arrêt de la musique'], 1, 'L’unisson, lui, fait tout faire en même temps.'],
            ['Quel critère évalue l’amplitude et la maîtrise d’un élément ?', ['La difficulté', 'La composition', 'L’exécution', 'L’originalité'], 2, 'La difficulté mesure la valeur de l’élément, l’exécution sa qualité.'],
            ['Mieux vaut un élément simple parfaitement maîtrisé qu’un élément difficile raté.', ['Vrai', 'Faux'], 0, 'Une chute ou un déséquilibre coûte souvent plus que la difficulté ne rapporte.'],
            ['En acrosport, sur quelles parties du porteur le voltigeur prend-il appui ?', ['Le milieu du dos', 'Les reins', 'La nuque', 'Le bassin et les épaules'], 3, 'Ce sont des appuis solides, au-dessus des os.'],
            ['Quel est le rôle du pareur ?', ['Accompagner ou retenir le pratiquant dans la zone de risque', 'Noter la prestation', 'Choisir la musique', 'Chronométrer'], 0, 'Il est prêt à intervenir sans gêner l’exécution.'],
            ['Que produit l’accumulation ?', ['Un arrêt total', 'Une phrase qui s’enrichit d’un geste à chaque reprise', 'Un geste unique', 'Un décalage temporel'], 1, 'Elle rend la construction visible au spectateur.'],
            ['Le CA3 se caractérise par…', ['Un adversaire direct', 'Une performance mesurée au mètre', 'Un milieu incertain', 'Une prestation destinée à être vue et appréciée'], 3, 'Elle est jugée sur des critères connus d’avance.'],
            ['Le voltigeur peut sauter depuis le haut d’une pyramide pour en descendre.', ['Vrai', 'Faux'], 1, 'On descend par des appuis sûrs, jamais en sautant d’une position haute.'],
            ['Opposer lenteur et vitesse dans une chorégraphie relève du procédé de…', ['Contraste', 'Canon', 'Unisson', 'Répétition'], 0, 'Le contraste rend chaque partie plus lisible.'],
            ['Qu’apporte un observateur pendant les répétitions ?', ['Il remplace le juge le jour de l’épreuve', 'Il décide de la musique', 'Il rend compte de ce qui se voit réellement', 'Il porte le voltigeur'], 2, 'Ce que l’on croit montrer n’est pas toujours ce qui se voit.'],
            ['Dans les activités artistiques, quel critère pèse particulièrement ?', ['La vitesse maximale', 'L’intention et l’interprétation', 'Le nombre de points marqués', 'La distance parcourue'], 1, 'On y juge ce que la prestation transmet.'],
            ['Quelle première étape pour composer une prestation ?', ['Choisir la tenue', 'Tenter l’élément le plus difficile', 'Apprendre le règlement d’un autre sport', 'Choisir une intention ou un fil conducteur'], 3, 'Tout le reste s’organise autour d’elle.'],
          ],
        },
        {
          titre: 'S’affronter : lire le rapport de force (CA4)',
          axe: 'Les champs d’apprentissage',
          lecon: {
            titre: 'Tactique, stratégie et choix',
            cours: `Un match n’est pas une suite de gestes : c’est un **rapport de force** qui bascule d’un camp à l’autre. Dans le CA4, on apprend à le lire, puis à le faire pencher en sa faveur.

## Le rapport de force
À chaque instant, l’un des deux camps a l’avantage : il est mieux placé, plus nombreux près du but, plus rapide dans l’échange. Gagner, c’est **créer** un déséquilibre et **l’exploiter**, tout en empêchant l’adversaire de faire de même.

| Situation | Ce qu’on cherche |
| En attaque | Créer un déséquilibre : espace libre, surnombre, adversaire déplacé |
| En défense | Retrouver l’équilibre : se replacer, fermer l’espace, gêner |
| Au moment où l’on perd ou gagne la balle | Changer de rôle **plus vite** que l’adversaire |

## Stratégie et tactique
| | Stratégie | Tactique |
| Quand | **Avant** le match ou entre deux sets | **Pendant** le jeu, dans l’instant |
| Quoi | Un plan fondé sur les forces et faiblesses des deux camps | Une décision adaptée à la situation présente |
| Exemple au badminton | « Je vais jouer sur son revers, qu’il maîtrise mal » | « Il est en fond de court : je joue un amorti » |

> La stratégie se prépare, la tactique s’improvise — mais une bonne tactique naît d’une situation que l’on a appris à reconnaître.

## Les principes qui se retrouvent partout
1. **Jouer dans l’espace libre** : là où l’adversaire n’est pas.
2. **Varier** : trajectoires, rythmes, zones, pour ne pas être lisible.
3. **Se replacer** après chaque action.
4. **Prélever des informations** avant de recevoir : où sont les partenaires, les adversaires, les espaces ?

## L’évaluation : efficacité et choix
En CA4, l’AFL1 s’évalue en situation de match : on croise le **gain des rencontres** et l’**efficacité** des choix tactiques et techniques. Un joueur qui perd de peu contre plus fort peut montrer plus de qualités qu’un joueur qui gagne facilement contre plus faible.

## Les rôles autour du match
Arbitre, coach, observateur, marqueur : ils font partie de l’apprentissage (AFL3). Un **observateur** relève par exemple les points gagnés et perdus selon la zone du terrain : ces chiffres nourrissent la stratégie du set suivant.

## Exemple travaillé
Au tennis de table, l’observateur note : sur 10 points perdus, 7 le sont sur des balles longues dans le revers. Stratégie pour le set suivant : se placer légèrement à gauche pour attaquer en coup droit, et servir court pour empêcher l’adversaire d’ouvrir le jeu. Pendant l’échange, la tactique reste de jouer loin de l’adversaire dès qu’il est déplacé.`,
          },
          questions: [
            ['Quelle est la différence entre stratégie et tactique ?', ['Aucune, ce sont deux synonymes', 'La stratégie se prépare avant ; la tactique se décide pendant le jeu', 'La tactique concerne seulement les sports collectifs', 'La stratégie est décidée par l’arbitre'], 1, 'Le plan d’abord, la décision de l’instant ensuite.'],
            ['En attaque, que cherche-t-on à créer ?', ['Un déséquilibre en sa faveur', 'Un équilibre parfait', 'Une pause', 'Un contact avec l’arbitre'], 0, 'Espace libre, surnombre, adversaire déplacé.'],
            ['« Je vais jouer sur son revers, qu’il maîtrise mal » relève de…', ['La tactique', 'L’arbitrage', 'La stratégie', 'L’échauffement'], 2, 'C’est un plan établi à partir des faiblesses de l’adversaire.'],
            ['Que faut-il faire au moment où l’on perd la balle ?', ['S’arrêter et protester', 'Attendre que le jeu se calme', 'Regarder le tableau d’affichage', 'Changer de rôle plus vite que l’adversaire'], 3, 'Le passage de l’attaque à la défense est un moment décisif.'],
            ['Jouer toujours la même trajectoire rend un joueur difficile à lire.', ['Vrai', 'Faux'], 1, 'C’est l’inverse : varier rend le jeu imprévisible.'],
            ['Que signifie « jouer dans l’espace libre » ?', ['Viser là où l’adversaire n’est pas', 'Jouer sans filet', 'Jouer seul', 'Viser le centre du terrain'], 0, 'C’est le principe commun à tous les affrontements.'],
            ['En CA4, l’AFL1 s’évalue…', ['Par un écrit sur le règlement', 'Par une performance au chronomètre', 'En situation de match', 'Par une chorégraphie'], 2, 'On croise le gain des rencontres et l’efficacité des choix.'],
            ['Quel relevé d’un observateur est utile à la stratégie ?', ['La couleur des maillots', 'Le nombre de spectateurs', 'La météo', 'Les points perdus selon la zone du terrain'], 3, 'Il montre où l’adversaire fait mal.'],
            ['Un joueur qui perd de peu contre plus fort peut montrer de grandes qualités.', ['Vrai', 'Faux'], 0, 'L’évaluation regarde aussi l’efficacité des choix, pas seulement le score.'],
            ['Que doit faire un défenseur pour rétablir l’équilibre ?', ['Rester immobile', 'Se replacer et fermer l’espace', 'Quitter le terrain', 'Attaquer seul'], 1, 'Retrouver l’équilibre, c’est d’abord se replacer.'],
            ['Pourquoi prélever des informations avant de recevoir la balle ?', ['Pour gagner du temps et choisir la meilleure option', 'Pour ralentir le jeu', 'Pour parler à l’arbitre', 'Ce n’est pas utile'], 0, 'Celui qui sait déjà où jouer agit plus vite.'],
            ['Au tennis de table, 7 points sur 10 sont perdus sur des balles longues dans le revers. Quelle stratégie en tirer ?', ['Ne rien changer', 'Jouer uniquement en revers', 'Se décaler pour attaquer davantage en coup droit', 'Abandonner le set'], 2, 'On protège la zone faible repérée par l’observateur.'],
          ],
        },
        // ---- Savoir se préparer et s’entraîner ----------------------------
        {
          titre: 'Concevoir son projet d’entraînement (CA5)',
          axe: 'Savoir se préparer et s’entraîner',
          lecon: {
            titre: 'Un mobile, des indicateurs, un carnet',
            cours: `Le CA5 renverse la logique habituelle : ce n’est pas le professeur qui fixe le but, c’est toi. Tu choisis ce que tu veux développer, tu construis tes séances, et tu les ajustes à partir de ce que tu ressens et mesures.

## Choisir un mobile
Le **mobile** est la raison pour laquelle tu t’entraînes. Il oriente tout le reste.

| Mobile | Ce qu’on cherche | Exemple de pratique |
| Développer son endurance | Tenir un effort plus longtemps | Course en durée, natation en durée |
| Développer sa force ou sa puissance | Être plus fort, plus explosif | Musculation |
| Entretenir sa forme, se détendre | Se sentir mieux, récupérer | Step, yoga, course à allure modérée |

## Régler l’intensité
Plusieurs repères permettent de savoir si l’on travaille dans la bonne zone :
1. **La fréquence cardiaque** : la FC maximale se mesure par un test, ou s’estime par 220 − âge.
2. **La fréquence cardiaque de réserve** (méthode de Karvonen) : FC cible = FC repos + % × (FC max − FC repos). Elle tient compte de ta propre condition.
3. **Le ressenti de l’effort**, sur une échelle de 0 (repos) à 10 (épuisement) : simple et étonnamment fiable.
4. **Le test de la parole** : si tu peux encore parler, tu es dans une zone d’endurance.

## Les paramètres, en musculation
| Mobile | Charge | Répétitions | Récupération |
| Endurance musculaire | Légère | Nombreuses (15 et plus) | Courte |
| Volume musculaire | Moyenne à lourde | Environ 8 à 12 | Moyenne |
| Force | Lourde | Peu nombreuses | Longue |

!> La qualité du geste passe avant la charge : dos gainé, amplitude contrôlée, respiration maîtrisée. Une charge qui déforme le mouvement est une charge trop lourde.

## Le carnet d’entraînement
Il est au cœur de l’AFL2 : on y écrit **avant** ce qu’on prévoit, **après** ce qu’on a fait et ressenti, et **ce qu’on change** la fois suivante. Sans trace écrite, on ne peut ni progresser méthodiquement, ni montrer ses choix.

> Un bon carnet ne dit pas seulement « j’ai couru 30 minutes » : il dit pourquoi, à quelle intensité, comment ça s’est passé, et ce que tu en conclus.

## Exemple travaillé
Léa, 17 ans, FC de repos 60 bpm, FC max mesurée 200 bpm, veut améliorer son endurance à 70 % de sa FC de réserve.
- FC de réserve : 200 − 60 = 140 bpm.
- FC cible : 60 + 0,7 × 140 = **158 bpm**.
- Séance : 3 × 10 min à 158 bpm environ, 2 min de marche entre chaque bloc.
- Carnet : « ressenti 6/10, bloc 3 plus difficile ; la prochaine fois, même séance, puis passer à 3 × 12 min si ressenti ≤ 6 ».`,
          },
          questions: [
            ['Qu’appelle-t-on le mobile en CA5 ?', ['Le téléphone utilisé pour chronométrer', 'La raison pour laquelle on s’entraîne', 'Le lieu d’entraînement', 'Le partenaire de séance'], 1, 'Il oriente le choix des exercices et des intensités.'],
            ['Comment calcule-t-on une FC cible par la méthode de Karvonen ?', ['FC repos + % × (FC max − FC repos)', 'FC max × 2', '220 + âge', 'FC repos − FC max'], 0, 'Elle tient compte de la fréquence cardiaque de repos de chacun.'],
            ['FC repos 70 bpm, FC max 190 bpm : quelle est la FC cible à 50 % de la réserve ?', ['95 bpm', '120 bpm', '130 bpm', '140 bpm'], 2, '70 + 0,5 × 120 = 130 bpm.'],
            ['Pour développer la force maximale en musculation, on travaille…', ['Des charges légères et beaucoup de répétitions', 'Sans récupération', 'Uniquement en étirement', 'Des charges lourdes et peu de répétitions, avec une longue récupération'], 3, 'L’endurance musculaire, elle, se travaille avec des charges légères et de nombreuses répétitions.'],
            ['Si tu peux encore parler en courant, tu es probablement dans une zone d’endurance.', ['Vrai', 'Faux'], 0, 'C’est le test de la parole, simple et utile sur le terrain.'],
            ['Que doit contenir un bon carnet d’entraînement ?', ['Uniquement la durée de la séance', 'Le prévu, le réalisé, le ressenti et ce qu’on change', 'Les résultats des autres élèves', 'Une liste de courses'], 1, 'Il sert à ajuster, et à montrer ses choix pour l’AFL2.'],
            ['En musculation, la charge passe avant la qualité du geste.', ['Vrai', 'Faux'], 1, 'Une charge qui déforme le mouvement expose à la blessure.'],
            ['Sur une échelle de ressenti de 0 à 10, que signifie 10 ?', ['Le repos complet', 'Un échauffement léger', 'Une allure de conversation', 'L’épuisement'], 3, 'Cette échelle est un repère simple et fiable pour régler l’intensité.'],
            ['Quelle formule donne une estimation rapide de la FC maximale ?', ['220 − âge', '180 + âge', 'Poids × 2', 'FC repos × 3'], 0, 'Un test à l’effort donne une valeur plus juste.'],
            ['Quel mobile correspond au travail de 15 répétitions et plus avec une charge légère ?', ['La force maximale', 'La puissance explosive', 'L’endurance musculaire', 'La souplesse'], 2, 'Beaucoup de répétitions, peu de charge, récupération courte.'],
            ['Qui fixe le mobile en CA5 ?', ['L’arbitre', 'L’élève lui-même', 'Le club sportif', 'Personne'], 1, 'C’est la spécificité de ce champ : on s’entraîne pour soi.'],
            ['Après une séance ressentie à 9/10, que conclure dans le carnet ?', ['Augmenter aussitôt la charge', 'Supprimer toute récupération', 'Ne rien noter', 'Maintenir ou alléger la séance suivante'], 3, 'Un effort très dur annonce une charge à stabiliser avant de progresser.'],
          ],
        },
        // ---- Construire durablement sa santé ------------------------------
        {
          titre: 'Préparer et récupérer : échauffement et retour au calme',
          axe: 'Construire durablement sa santé',
          lecon: {
            titre: 'Avant, après : ce qui protège et fait progresser',
            cours: `L’échauffement et la récupération ne sont pas des formalités avant et après « le vrai travail ». Ils font partie de la séance : le premier te protège et te rend performant, la seconde transforme l’effort en progrès.

## Pourquoi s’échauffer
| Effet | Ce qui change dans le corps |
| Température musculaire | Elle monte : les muscles sont plus souples et plus rapides |
| Cœur et respiration | La fréquence cardiaque et le débit respiratoire augmentent progressivement |
| Articulations | Elles sont mieux lubrifiées |
| Système nerveux | La coordination et la vigilance s’améliorent |
| Mental | On se concentre sur l’activité |

## Construire un échauffement
1. **Général** : une activité modérée qui mobilise tout le corps (course lente, corde), environ 5 à 10 minutes.
2. **Articulaire** : mobiliser chevilles, genoux, hanches, épaules, nuque, en amplitude croissante.
3. **Spécifique** : reprendre les gestes de l’activité, de plus en plus vite et fort (gammes athlétiques, frappes, passes).
4. **Proche de l’intensité** de l’épreuve à la fin, quelques minutes avant de commencer.

> Un bon échauffement est **progressif**, **complet** et **adapté** à l’activité : on ne s’échauffe pas pour un sprint comme pour une séance de yoga.

!> Avant un effort explosif, les étirements longs et statiques sont déconseillés : ils peuvent diminuer temporairement la force et la vitesse. On leur préfère des mouvements dynamiques.

## Le retour au calme
Après l’effort, on ne s’arrête pas brutalement : quelques minutes d’activité légère (marche, footing lent) aident le cœur à ralentir progressivement et favorisent la récupération.

## La récupération
| Levier | Pourquoi |
| **Récupération active** | Une activité très légère entretient la circulation sanguine |
| **Hydratation** | Compenser l’eau perdue par la sueur |
| **Alimentation** | Recharger les réserves d’énergie et réparer les muscles |
| **Sommeil** | C’est pendant la nuit que l’organisme répare et se renforce |
| **Étirements doux** | À distance de l’effort, pour entretenir l’amplitude |

## Entre deux efforts
La récupération entre deux répétitions dépend de la filière sollicitée : quelques minutes après un sprint maximal, beaucoup moins pour un effort d’endurance à allure modérée.

## Exemple travaillé
Avant une épreuve de volley-ball :
- 6 min de course et de déplacements variés (pas chassés, courses arrière).
- 4 min de mobilisation des épaules, poignets, chevilles et genoux.
- 8 min de manchettes et de touches à deux, puis d’attaques et de services, de plus en plus appuyés.
- 2 min de jeu réduit à pleine intensité.

Après le match : 5 min de marche et de footing lent, boisson, collation, et étirements doux le soir.`,
          },
          questions: [
            ['Quel est l’ordre logique d’un échauffement ?', ['Spécifique, puis général, puis articulaire', 'Général, articulaire, puis spécifique', 'Uniquement des étirements', 'Articulaire seulement'], 1, 'On part d’un effort modéré global vers les gestes de l’activité.'],
            ['Quel effet a l’échauffement sur les muscles ?', ['Il augmente leur température et leur souplesse', 'Il les refroidit', 'Il les fatigue définitivement', 'Aucun'], 0, 'Un muscle chaud est plus souple et plus rapide.'],
            ['Avant un sprint, les étirements longs et statiques sont…', ['Indispensables', 'Obligatoires au bac', 'Déconseillés, car ils peuvent réduire temporairement la force et la vitesse', 'Sans aucun effet'], 2, 'On leur préfère des mouvements dynamiques.'],
            ['Pourquoi ne pas s’arrêter brutalement après un effort intense ?', ['Pour gagner des points', 'Pour prolonger la séance', 'Parce que c’est le règlement', 'Pour aider le cœur à ralentir progressivement et récupérer'], 3, 'Quelques minutes d’activité légère favorisent la récupération.'],
            ['Un échauffement doit être adapté à l’activité pratiquée.', ['Vrai', 'Faux'], 0, 'On ne se prépare pas pour un sprint comme pour une séance de yoga.'],
            ['Quand l’organisme répare-t-il et se renforce-t-il surtout ?', ['Pendant l’échauffement', 'Pendant le sommeil', 'Pendant l’effort maximal', 'Pendant le trajet'], 1, 'Le sommeil est un temps fort de la récupération.'],
            ['Qu’est-ce que la récupération active ?', ['Une activité très légère après l’effort', 'Un deuxième match', 'Un sprint final', 'Un jeûne'], 0, 'Elle entretient la circulation sanguine.'],
            ['Que doit contenir la partie spécifique de l’échauffement ?', ['Des jeux de société', 'Une sieste', 'Les gestes de l’activité, de plus en plus intenses', 'Uniquement de la marche'], 2, 'On rapproche peu à peu l’intensité de celle de l’épreuve.'],
            ['Après un sprint maximal, la récupération entre deux répétitions doit être…', ['Nulle', 'De quelques secondes', 'De plusieurs heures', 'De quelques minutes'], 3, 'La filière alactique a besoin de temps pour se reconstituer.'],
            ['L’échauffement n’a aucun effet sur la concentration.', ['Vrai', 'Faux'], 1, 'Il prépare aussi mentalement à l’activité.'],
            ['À quoi sert l’hydratation après l’effort ?', ['À compenser l’eau perdue par la sueur', 'À refroidir le terrain', 'À augmenter le poids', 'À rien'], 0, 'On boit avant, pendant et après l’effort.'],
            ['Quand placer des étirements doux et prolongés ?', ['Juste avant un sprint', 'Pendant un match', 'À distance de l’effort', 'Jamais'], 2, 'Ils entretiennent l’amplitude sans gêner la performance.'],
          ],
        },
        {
          titre: 'Prévenir les blessures et pratiquer en sécurité',
          axe: 'Construire durablement sa santé',
          lecon: {
            titre: 'Anticiper, réagir, alerter',
            cours: `Pratiquer longtemps, c’est d’abord ne pas se blesser. La plupart des blessures en EPS se préviennent ; les autres demandent de savoir réagir vite et bien.

## Sécurité passive, sécurité active
| | Sécurité passive | Sécurité active |
| Ce que c’est | Le matériel et l’organisation qui protègent | Les comportements de chacun |
| Exemples | Tapis, casque, baudrier, zones balisées | Échauffement, parade, respect des consignes, vérifications |

> Le meilleur matériel ne protège pas celui qui ne respecte pas les consignes. La sécurité active est la responsabilité de chacun, pour soi et pour les autres.

## Les causes fréquentes de blessure
1. Un **échauffement** absent ou bâclé.
2. La **fatigue** : les accidents surviennent souvent en fin de séance.
3. Une **charge** qui augmente trop vite.
4. Un **geste technique** mal maîtrisé.
5. Un **matériel** inadapté (chaussures, protections).
6. Le **non-respect des règles**, notamment en sport de combat et en sport collectif.

## Les blessures courantes et les bons réflexes
| Blessure | Ce qui se passe | Réflexe |
| **Entorse** (souvent à la cheville) | Un ligament est étiré ou déchiré | Arrêter, appliquer du froid, surélever, faire examiner |
| **Crampe** | Une contraction involontaire et douloureuse | Étirer doucement le muscle, s’hydrater |
| **Contracture, élongation** | Une lésion musculaire plus ou moins grave | Arrêter l’effort, froid, avis médical si la douleur persiste |
| **Tendinite** | Une inflammation du tendon, souvent par surmenage | Repos relatif, avis médical |

!> **Choc à la tête** : au moindre signe (maux de tête, vertiges, confusion, nausée, troubles de la vision), l’élève **arrête immédiatement** l’activité et ne la reprend pas le jour même. On prévient un adulte ; une commotion cérébrale peut passer inaperçue.

## Si un accident survient
1. **Protéger** : sécuriser la zone (arrêter le jeu, écarter le danger).
2. **Alerter** : prévenir le professeur, qui déclenche les secours si nécessaire (15, 18 ou 112).
3. **Secourir** : selon sa formation, et sans déplacer une personne qui pourrait être blessée au dos ou à la nuque.

## Se connaître pour se protéger
Signaler une douleur, une fatigue inhabituelle, un traitement, une gêne : ce n’est pas se plaindre, c’est permettre au professeur d’adapter la séance. Une **inaptitude** partielle ne dispense pas de tout : elle permet souvent une pratique adaptée.

## Exemple
Pendant un match de handball, un élève se tord la cheville. Il ne « court pas pour la chauffer » : il s’arrête, on applique du froid, il garde le pied surélevé, et il consulte si la douleur ou le gonflement persistent. Reprendre trop tôt une entorse mal soignée expose à la récidive.`,
          },
          questions: [
            ['Lequel de ces éléments relève de la sécurité passive ?', ['Le respect des consignes', 'La parade', 'Le tapis de réception', 'L’échauffement'], 2, 'La sécurité passive, c’est le matériel et l’aménagement.'],
            ['Que faire en cas de choc à la tête avec vertiges ou maux de tête ?', ['Arrêter immédiatement et ne pas reprendre le jour même', 'Continuer si la douleur est supportable', 'Boire une boisson énergisante', 'Faire des étirements'], 0, 'Une commotion cérébrale peut passer inaperçue et s’aggraver.'],
            ['Quel est le premier réflexe après une entorse de cheville ?', ['Courir pour la chauffer', 'Masser vigoureusement', 'Appliquer de la chaleur', 'Arrêter, appliquer du froid et surélever'], 3, 'Puis faire examiner si la douleur ou le gonflement persistent.'],
            ['Les accidents surviennent souvent en fin de séance, à cause de la fatigue.', ['Vrai', 'Faux'], 0, 'La fatigue dégrade la vigilance et la qualité du geste.'],
            ['Qu’est-ce qu’une entorse ?', ['Une fracture de l’os', 'Un étirement ou une déchirure de ligament', 'Une crampe', 'Une inflammation de la peau'], 1, 'Elle touche souvent la cheville.'],
            ['Quelle est la bonne réaction face à une crampe ?', ['Étirer doucement le muscle et s’hydrater', 'Frapper le muscle', 'Continuer au même rythme', 'Appliquer de la chaleur intense'], 0, 'La crampe est une contraction involontaire.'],
            ['Dans quel ordre agir face à un accident ?', ['Secourir, alerter, protéger', 'Alerter, protéger, secourir', 'Protéger, alerter, secourir', 'Attendre, puis alerter'], 2, 'On sécurise d’abord pour éviter un sur-accident.'],
            ['Faut-il déplacer une personne qui pourrait être blessée à la nuque ?', ['Oui, pour la mettre à l’ombre', 'Oui, pour qu’elle se relève', 'Oui, pour libérer le terrain', 'Non, sauf danger immédiat'], 3, 'Un déplacement peut aggraver une lésion de la colonne.'],
            ['Signaler une douleur au professeur, c’est se plaindre inutilement.', ['Vrai', 'Faux'], 1, 'Cela lui permet d’adapter la séance et d’éviter une blessure.'],
            ['Qu’est-ce qu’une tendinite ?', ['Une inflammation du tendon souvent liée au surmenage', 'Une entorse', 'Une crampe passagère', 'Un choc à la tête'], 0, 'Elle impose un repos relatif et un avis médical.'],
            ['Quel numéro d’urgence européen peut-on composer ?', ['17', '112', '3919', '36 15'], 1, 'Le 15 (SAMU) et le 18 (pompiers) fonctionnent aussi en France.'],
            ['Une inaptitude partielle…', ['Dispense forcément de toute activité', 'N’a aucune conséquence', 'Permet souvent une pratique adaptée', 'Interdit de venir en cours'], 2, 'L’enseignant adapte la pratique à ce que l’élève peut faire.'],
          ],
        },
        // ---- Exercer sa responsabilité ------------------------------------
        {
          titre: 'Tenir un rôle social : l’AFL3',
          axe: 'Exercer sa responsabilité',
          lecon: {
            titre: 'Arbitrer, juger, observer, assurer',
            cours: `En EPS, on n’est pas seulement pratiquant. Arbitre, juge, observateur, coach, assureur, chronométreur : ces rôles font fonctionner le groupe, et au bac, ils sont évalués dans l’**AFL3**.

## Ce que dit le référentiel
Dans le CA1, l’AFL3 est formulé ainsi : **choisir et assumer les rôles qui permettent un fonctionnement collectif solidaire**. Dans tous les champs, l’élève est évalué dans **au moins un rôle** qu’il a choisi parmi **au moins deux** propositions de l’équipe EPS.

## Les rôles et ce qu’ils demandent
| Rôle | Ce qu’il faut savoir faire | Champ où on le trouve souvent |
| **Arbitre** | Connaître le règlement, l’appliquer, le faire respecter | CA4 |
| **Juge** | Apprécier une prestation selon des critères connus | CA3 |
| **Observateur** | Relever des informations fiables et les transmettre | Tous |
| **Coach** | Aider un partenaire à analyser et à ajuster | CA4, CA5 |
| **Assureur**, pareur | Garantir la sécurité du pratiquant | CA2, CA3 |
| **Chronométreur**, starter | Mesurer avec précision, faire respecter le départ | CA1 |

> Un rôle bien tenu ne se voit presque pas : un bon arbitre ne fait pas le match, il permet qu’il se joue.

## Les quatre degrés de l’engagement
Le référentiel national décrit quatre degrés, du moins au plus abouti :

| Degré | Nom | Ce qu’on observe |
| 1 | **Engagement subi** | Connaît partiellement le règlement et l’applique mal ; informations prélevées et transmises au hasard |
| 2 | **Engagement aléatoire** | Connaît et applique le règlement, mais ne le fait pas respecter ; informations partiellement transmises |
| 3 | **Engagement fonctionnel** | Connaît le règlement, l’applique et le fait respecter dans son rôle ; informations prélevées et transmises |
| 4 | **Engagement solidaire** | Fait tout cela et **aide les autres** à tenir leurs rôles |

## Bien tenir un rôle : la méthode
1. **Connaître** le règlement ou les critères avant la séance.
2. **Se placer** là où l’on voit le mieux (arbitre près de l’action, juge face à la prestation).
3. **Décider** clairement : un coup de sifflet net, un geste lisible, une note justifiée.
4. **Communiquer** : expliquer une décision calmement, transmettre une observation utile.
5. **Rester impartial**, y compris avec ses amis.

## Le poids de l’AFL3 au bac
Les AFL2 et AFL3 se partagent 8 points, selon une répartition que l’élève choisit : 4/4, 6/2 ou 2/6. Un élève qui s’investit beaucoup dans l’arbitrage peut donc donner plus de poids à l’AFL3.

## Exemple
En volley-ball, un observateur remplit une fiche : pour chaque attaque de son partenaire, il note la zone visée et le résultat. À la fin du set, il ne dit pas « tu joues mal » mais « 5 attaques sur 7 sont allées sur le joueur du centre : vise les côtés ». C’est un engagement **solidaire** : il aide l’autre à progresser.`,
          },
          questions: [
            ['Dans combien de rôles au moins l’élève est-il évalué pour l’AFL3 ?', ['Aucun', 'Un', 'Trois', 'Tous les rôles possibles'], 1, 'Un rôle choisi parmi au moins deux proposés par l’équipe EPS.'],
            ['Quel degré correspond à un élève qui applique le règlement, le fait respecter et aide les autres dans leurs rôles ?', ['Engagement subi', 'Engagement aléatoire', 'Engagement fonctionnel', 'Engagement solidaire'], 3, 'C’est le degré 4, le plus abouti.'],
            ['Un élève connaît et applique le règlement mais ne le fait pas respecter. Son engagement est…', ['Aléatoire', 'Solidaire', 'Fonctionnel', 'Subi'], 0, 'C’est le degré 2.'],
            ['Quel rôle garantit la sécurité d’un grimpeur ?', ['Le juge', 'Le chronométreur', 'L’assureur', 'Le starter'], 2, 'On le trouve surtout dans le CA2.'],
            ['Comment se répartissent les 8 points des AFL2 et AFL3 au bac ?', ['Toujours 4 et 4', 'Au choix de l’élève : 4/4, 6/2 ou 2/6', 'Au choix du professeur uniquement', 'Tout sur l’AFL3'], 1, 'L’élève choisit la répartition parmi ces trois possibilités.'],
            ['Un bon arbitre doit rester impartial, même avec ses amis.', ['Vrai', 'Faux'], 0, 'L’impartialité fait la légitimité de ses décisions.'],
            ['Que fait un observateur ?', ['Il relève des informations fiables et les transmet', 'Il joue à la place d’un partenaire', 'Il fixe la note finale', 'Il choisit la musique'], 0, 'Ses relevés nourrissent l’analyse du pratiquant.'],
            ['Où se place un arbitre pour bien décider ?', ['Le plus loin possible', 'Dans les tribunes', 'Là où il voit le mieux l’action', 'Derrière le banc'], 2, 'Une bonne décision commence par un bon placement.'],
            ['Quelle remarque d’observateur est la plus utile ?', ['« Tu joues mal »', '« Fais mieux »', '« C’est nul »', '« 5 attaques sur 7 sont allées au centre : vise les côtés »'], 3, 'Une donnée précise et un conseil concret font progresser.'],
            ['Le juge apprécie une prestation selon des critères connus d’avance.', ['Vrai', 'Faux'], 0, 'C’est le rôle typique du CA3.'],
            ['Que demande l’engagement fonctionnel ?', ['Connaître le règlement seulement en partie', 'Connaître, appliquer et faire respecter le règlement dans son rôle', 'Ne rien transmettre', 'Jouer à la place des autres'], 1, 'C’est le degré 3 : les informations sont prélevées et transmises.'],
            ['Quel rôle trouve-t-on surtout dans le CA1 ?', ['Le pareur en acrosport', 'L’arbitre de match', 'Le coach de danse', 'Le chronométreur'], 3, 'La performance y est mesurée au temps ou à la distance.'],
          ],
        },
        // ---- L’évaluation au baccalauréat ---------------------------------
        {
          titre: 'Le bac d’EPS : épreuves, AFL et barème',
          axe: 'L’évaluation au baccalauréat',
          lecon: {
            titre: 'Trois épreuves, trois champs, une moyenne',
            cours: `L’EPS compte au baccalauréat, et elle se joue presque entièrement pendant l’année de Terminale. Connaître les règles, c’est savoir où sont les points — et quels choix tu peux faire.

## Le cadre
Les règles sont fixées par la note de service du 20 février 2026 (BO n° 9 du 26 février 2026), applicable dès la session 2026 ; les référentiels nationaux d’évaluation, eux, n’ont pas changé.

| Élément | Ce qu’il faut savoir |
| Mode d’évaluation | Le **contrôle en cours de formation** (CCF), pendant l’année de Terminale, pour les élèves des lycées publics et privés sous contrat |
| Nombre d’épreuves | **Trois**, sur trois activités distinctes |
| Champs | Trois **champs d’apprentissage différents** |
| Activités | Au moins **deux** issues de la liste nationale ; la troisième peut venir de la liste académique ou d’une activité propre à l’établissement |
| Notation | Chaque épreuve est notée sur 20 ; la note finale est la **moyenne des trois**, arrondie au point entier après harmonisation |
| Évaluateurs | Deux enseignants d’EPS de l’établissement (**co-évaluation**), dont celui de la classe |
| Coefficient | **6** au baccalauréat |

## Une épreuve, trois attendus
| Attendu | Points | Quand il est évalué |
| **AFL1** : agir, performer, être efficace | **12** | Le jour de l’épreuve |
| **AFL2** : s’entraîner, se préparer, analyser | 8 points partagés avec l’AFL3 | Au fil de la séquence, finalisé le jour de l’épreuve |
| **AFL3** : tenir des rôles | (partagés avec l’AFL2) | Au fil de la séquence, finalisé le jour de l’épreuve |

Pour les AFL2 et AFL3, **tu choisis la répartition** des 8 points :

| Choix | AFL2 | AFL3 |
| Équilibré | 4 | 4 |
| Priorité à l’entraînement | 6 | 2 |
| Priorité aux rôles | 2 | 6 |

> L’AFL2 et l’AFL3 se gagnent **pendant la séquence**, pas le jour de l’épreuve seulement : un carnet tenu régulièrement et un rôle assumé à chaque séance valent des points.

## Les règles qui piègent
!> Une absence **non justifiée** à une épreuve vaut **0** à cette épreuve (non éliminatoire, mais il fait chuter la moyenne).

- Une blessure ou un problème de santé temporaire, attesté, ouvre droit à une **épreuve adaptée ou différée**.
- L’évaluation ne peut jamais reposer sur les seuls AFL2 et AFL3, même en cas d’inaptitude partielle : il y a toujours une part d’action motrice, adaptée si besoin.
- Les candidats individuels et ceux du Cned passent un **examen ponctuel terminal**, sur deux activités.

## Et au-delà de l’enseignement commun
Certains lycées proposent un **enseignement optionnel d’EPS**, qui approfondit la pratique et la réflexion sur les activités, et la spécialité **« Éducation physique, pratiques et culture sportives »** (EPPCS), qui a ses propres épreuves. Renseigne-toi auprès de ton lycée : l’offre varie d’un établissement à l’autre.

## Exemple de calcul
Un élève obtient 14/20 en demi-fond (CA1), 16/20 en acrosport (CA3) et 12/20 en badminton (CA4).
- Moyenne : (14 + 16 + 12) / 3 = **14/20**.
- En badminton, il avait choisi 6 points pour l’AFL3 (arbitrage) et 2 pour l’AFL2 : son arbitrage régulier tout au long de la séquence a limité l’effet d’une rencontre ratée le jour de l’épreuve.`,
          },
          questions: [
            ['Combien d’épreuves compte le contrôle en cours de formation d’EPS au bac ?', ['Une', 'Deux', 'Trois', 'Cinq'], 2, 'Trois épreuves, sur trois activités distinctes.'],
            ['Les trois épreuves doivent relever…', ['Du même champ d’apprentissage', 'De trois champs d’apprentissage différents', 'Uniquement des sports collectifs', 'De deux champs au choix'], 1, 'C’est une obligation fixée par la note de service.'],
            ['Sur combien de points est noté l’AFL1 dans chaque épreuve ?', ['12', '8', '6', '20'], 0, 'Les AFL2 et AFL3 se partagent les 8 points restants.'],
            ['Laquelle de ces répartitions AFL2 / AFL3 est possible ?', ['8 / 0', '5 / 3', '0 / 8', '6 / 2'], 3, 'Les trois choix sont 4/4, 6/2 et 2/6.'],
            ['Quel est le coefficient de l’EPS au baccalauréat ?', ['2', '6', '10', '16'], 1, 'L’EPS pèse autant qu’une matière importante du tronc commun.'],
            ['Une absence non justifiée à une épreuve entraîne…', ['Un 0 à cette épreuve, non éliminatoire', 'L’élimination du bac', 'Une simple remarque', 'Le report automatique de l’épreuve'], 0, 'Elle fait chuter la moyenne des trois épreuves.'],
            ['Combien d’activités au moins doivent venir de la liste nationale ?', ['Aucune', 'Une', 'Deux', 'Trois'], 2, 'La troisième peut venir de la liste académique ou de l’établissement.'],
            ['L’AFL2 et l’AFL3 s’évaluent uniquement le jour de l’épreuve.', ['Vrai', 'Faux'], 1, 'Ils s’évaluent au fil de la séquence et sont finalisés le jour de l’épreuve.'],
            ['Qui évalue les épreuves du CCF ?', ['Un jury extérieur uniquement', 'L’élève lui-même', 'Le chef d’établissement seul', 'Deux enseignants d’EPS, dont celui de la classe'], 3, 'C’est le principe de la co-évaluation.'],
            ['Un élève obtient 15, 13 et 11. Sa note finale d’EPS vaut…', ['11/20', '13/20', '15/20', '39/20'], 1, '(15 + 13 + 11) / 3 = 13.'],
            ['Un candidat individuel passe l’EPS en examen ponctuel sur deux activités.', ['Vrai', 'Faux'], 0, 'Le CCF concerne les élèves scolarisés en lycée public ou privé sous contrat.'],
            ['En cas de blessure temporaire attestée, que prévoit l’établissement ?', ['Un 0 automatique', 'Une dispense définitive de l’EPS', 'Une épreuve adaptée ou différée', 'Rien du tout'], 2, 'La blessure doit être authentifiée par l’autorité médicale scolaire.'],
          ],
        },
      ],
    },
  ],
}
