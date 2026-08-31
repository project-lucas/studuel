// EPS — Collège (6e, 5e, 4e, 3e) : LE PROGRAMME COMMUN (8 fiches).
//
// LE DÉFAUT. L'EPS n'avait que TROIS chapitres au collège — trois en 6e, trois
// partagés par la 5e, la 4e et la 3e. Trois fiches pour quatre années.
//
// ⚠️ UN SEUL MODULE POUR LES QUATRE NIVEAUX, et c'est le programme qui le
// permet. Contrairement à l'histoire-géo ou aux maths, l'EPS ne change pas de
// découpage entre le cycle 3 et le cycle 4 : ce sont les MÊMES QUATRE CHAMPS
// D'APPRENTISSAGE de la 6e à la 3e, ce qui varie étant le niveau d'exigence
// dans la pratique — donc précisément ce qui ne se révise pas sur écran.
// C'est le seul module du dépôt à couvrir les quatre niveaux du collège d'un
// bloc, et cette exception est justifiée par le BO, pas par la commodité.
//
// ⚠️ CE QU'UNE APP PEUT ENSEIGNER EN EPS, ET CE QU'ELLE NE PEUT PAS. Une
// matière pratique ne s'apprend pas devant un téléphone : personne n'apprend à
// nager en lisant. Ce module ne prétend donc pas remplacer le cours. Il couvre
// ce qui est RÉELLEMENT évaluable à l'écrit et utile à l'élève : les règles,
// les rôles sociaux (arbitre, observateur, coach), la connaissance du corps à
// l'effort, l'échauffement, la sécurité, l'hygiène de vie. C'est aussi ce sur
// quoi portent les évaluations théoriques quand il y en a.
//
// CE QUE L'ÉLÈVE DOIT VOIR — les 3 chapitres et leurs 8 fiches :
//   1. Les champs d'apprentissage        (2)
//   2. Le corps à l'effort                (3)
//   3. Les rôles, les règles, la sécurité (3)
//
// ⚠️ Ne JAMAIS générer avec `--slugs sport` : toujours `--modules sport-college`.

export default {
  slug: 'sport',
  nom: 'Sport',

  titreMigration: 'EPS COLLÈGE — LE PROGRAMME COMMUN AUX QUATRE NIVEAUX (8 fiches)',

  motif: `CONSTAT : l'EPS n'avait que TROIS chapitres au collège — trois en 6e, trois
partagés par la 5e, la 4e et la 3e — soit trois fiches pour quatre années.
Cette migration installe 8 fiches sous 3 chapitres, sur les QUATRE niveaux, et
retire les chapitres génériques.
UN SEUL MODULE POUR QUATRE NIVEAUX : contrairement aux autres matières, l'EPS ne
change pas de découpage entre le cycle 3 et le cycle 4 — ce sont les mêmes quatre
champs d'apprentissage de la 6e à la 3e, ce qui varie étant le niveau d'exigence
dans la PRATIQUE, donc précisément ce qui ne se révise pas sur écran.
PÉRIMÈTRE ASSUMÉ : ce module ne prétend pas remplacer le cours. Une matière
pratique ne s'apprend pas devant un téléphone. Il couvre ce qui est réellement
évaluable à l'écrit et utile — règles, rôles sociaux, corps à l'effort,
échauffement, sécurité, hygiène de vie.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) porte le chapitre du programme, et
l'INSERT l'écrit pour les 8 fiches × 4 niveaux. Elle est REPRISE ici en ADD
COLUMN IF NOT EXISTS parce qu'on ne peut pas garantir que la 234 soit passée.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters et ne l'a rendu que colonne par colonne.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les chapitres hérités partent, sur les QUATRE niveaux du collège.

LE REPÈRE EST theme IS NULL, PAS LE TITRE : les 8 fiches neuves portent leur
chapitre de programme dès l'INSERT, les anciennes n'en ont aucun. Le ménage
tourne AVANT les insertions et ne peut donc jamais mordre sur les neuves.
LE FILTRE DE NIVEAU BORNE AU COLLÈGE : 6e, 5e, 4e et 3e — pas le lycée, dont les
trois fiches d'EPS relèvent d'un autre programme et ne sont pas traitées ici. Un
IN (...) trop large les effacerait sans rien mettre à la place.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'sport'
   AND c.level IN ('6e', '5e', '4e', '3e')
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'sport'
   AND c.level IN ('6e', '5e', '4e', '3e')
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'sport'
   AND c.level IN ('6e', '5e', '4e', '3e')
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['6e', '5e', '4e', '3e'],
      chapitres: [
        // --- Chapitre 1 : Les champs d'apprentissage ---
        {
          titre: 'Les quatre champs d’apprentissage',
          axe: 'Les champs d’apprentissage',
          lecon: {
            titre: 'Ce qu’on apprend en EPS, et pourquoi',
            cours: `## Une matière organisée en quatre champs
Le programme d’EPS n’est pas une liste de sports : c’est **quatre familles de problèmes** à résoudre. Chaque activité pratiquée sert à en travailler un.

## Champ 1 — Produire une performance mesurée
Courir, sauter, lancer, nager vite ou longtemps. Le problème : **se dépasser** et **mesurer** son progrès.
Activités : athlétisme, natation de vitesse, demi-fond.

## Champ 2 — Adapter son déplacement à des environnements variés
Se déplacer dans un milieu **incertain** : hauteur, eau profonde, nature.
Activités : escalade, course d’orientation, sauvetage aquatique, VTT.
Le problème : **gérer sa sécurité** et lire un environnement qui change.

## Champ 3 — S’exprimer devant les autres par une prestation artistique
Créer, répéter, présenter à un public.
Activités : danse, acrosport, arts du cirque, gymnastique.
Le problème : **assumer un regard** et construire une intention.

## Champ 4 — Conduire et maîtriser un affrontement
Face à un adversaire, seul ou en équipe.
Activités : sports collectifs (hand, basket, foot, volley), raquettes (badminton, tennis de table), combat (judo, lutte).
Le problème : **décider vite** dans un rapport de force.

> Chaque cycle d’EPS de l’année couvre normalement les quatre champs. Ce n’est pas une collection de sports : c’est un parcours pensé pour rencontrer quatre types de difficultés.

## Ce qui est évalué
Pas seulement la performance : aussi la **progression**, la **méthode**, la capacité à tenir un **rôle** (arbitre, observateur, coach) et le **respect** des règles et des autres.

## L’AS
L’**association sportive** du collège prolonge l’EPS le mercredi. Elle est ouverte à tous, pas seulement aux meilleurs, et permet de découvrir des activités absentes des cours.`,
          },
          questions: [
            ['Combien de champs d’apprentissage compte le programme d’EPS ?', ['Quatre', 'Deux', 'Six', 'Trois'], 0, 'Ce sont quatre familles de problèmes à résoudre.'],
            ['Quel champ concerne l’athlétisme et la natation de vitesse ?', ['Produire une performance mesurée', 'Adapter son déplacement', 'S’exprimer devant les autres', 'Conduire un affrontement'], 0, 'Il s’agit de se dépasser et de mesurer son progrès.'],
            ['À quel champ appartient l’escalade ?', ['Adapter son déplacement à des environnements variés', 'Produire une performance mesurée', 'S’exprimer devant les autres', 'Conduire un affrontement'], 0, 'Le milieu y est incertain.'],
            ['Quel champ regroupe la danse et l’acrosport ?', ['S’exprimer devant les autres par une prestation artistique', 'Produire une performance', 'Conduire un affrontement', 'Adapter son déplacement'], 0, 'Créer, répéter, présenter à un public.'],
            ['À quel champ appartiennent le badminton et le handball ?', ['Conduire et maîtriser un affrontement', 'Produire une performance mesurée', 'S’exprimer devant les autres', 'Adapter son déplacement'], 0, 'Il faut décider vite dans un rapport de force.'],
            ['Qu’évalue-t-on en EPS ?', ['La progression, la méthode, les rôles tenus et le respect, pas seulement la performance', 'Uniquement le chronomètre', 'Uniquement la force', 'La présence seule'], 0, 'La performance n’est qu’un critère parmi d’autres.'],
            ['Qu’est-ce que l’AS du collège ?', ['L’association sportive, ouverte à tous le mercredi', 'Une compétition réservée aux meilleurs', 'Un examen', 'Une note de fin d’année'], 0, 'Elle permet de découvrir d’autres activités.'],
            ['Le programme d’EPS est une liste de sports à pratiquer.', ['Vrai', 'Faux'], 1, 'C’est un parcours organisé autour de quatre types de problèmes.'],
          ],
        },
        {
          titre: 'Progresser : méthode et objectifs',
          axe: 'Les champs d’apprentissage',
          lecon: {
            titre: 'Comment on devient meilleur, vraiment',
            cours: `## Le progrès n’est pas le talent
En EPS comme ailleurs, on progresse par la **répétition organisée**, pas par des dons. Ce qui distingue les élèves qui progressent, ce n’est pas leur niveau de départ : c’est leur **méthode**.

## Un objectif utile
Un bon objectif est **précis**, **mesurable** et **atteignable** : « courir 8 minutes sans m’arrêter » vaut mieux que « être meilleur en sport ». On peut le vérifier, donc constater le progrès.

## Se situer avant de progresser
On mesure d’abord où l’on en est — un temps, une distance, un nombre de passes réussies. Sans cette mesure de départ, aucun progrès n’est visible, et un progrès invisible décourage.

> Ce qui se mesure se travaille. Ce qui ne se mesure pas se subit.

## La régularité bat l’intensité
Trois séances de 20 minutes par semaine font davantage progresser qu’une séance de deux heures. Le corps s’adapte **entre** les séances, pas pendant : c’est la **surcompensation**.

## Le rôle de l’erreur
Rater fait partie de l’apprentissage moteur. Un geste s’automatise après des centaines de répétitions, dont beaucoup d’échecs. L’élève qui refuse de rater refuse d’apprendre.

## Observer pour apprendre
Regarder un camarade, être observé, se filmer : voir le geste de l’extérieur corrige plus vite que la sensation seule, qui trompe souvent.

## Le carnet de suivi
Noter ses performances, ses ressentis et ses objectifs transforme une suite de séances en **progression consciente**. C'est le même principe que la révision espacée dans les autres matières.`,
          },
          questions: [
            ['Qu’est-ce qui distingue un élève qui progresse ?', ['Sa méthode, pas son niveau de départ', 'Son talent naturel', 'Sa taille', 'Sa force initiale'], 0, 'On progresse par la répétition organisée.'],
            ['Qu’est-ce qu’un bon objectif ?', ['Précis, mesurable et atteignable', 'Ambitieux et vague', 'Fixé par le professeur seul', 'Le plus élevé possible'], 0, '« Courir 8 minutes sans m’arrêter ».'],
            ['Pourquoi mesurer son niveau de départ ?', ['Sans mesure initiale, le progrès reste invisible', 'Pour se comparer aux autres', 'Pour être noté', 'Ce n’est pas utile'], 0, 'Un progrès invisible décourage.'],
            ['Qu’est-ce qui fait le plus progresser ?', ['Trois séances courtes par semaine', 'Une seule longue séance', 'L’intensité maximale à chaque fois', 'Le repos complet'], 0, 'Le corps s’adapte entre les séances.'],
            ['Qu’est-ce que la surcompensation ?', ['L’adaptation du corps entre les séances', 'Un excès d’entraînement', 'Une blessure', 'Un échauffement long'], 0, 'C’est pourquoi la régularité prime.'],
            ['Quel est le rôle de l’erreur dans l’apprentissage moteur ?', ['Elle en fait partie : un geste s’automatise après de nombreux échecs', 'Elle doit être évitée', 'Elle prouve un manque de talent', 'Elle n’a aucun rôle'], 0, 'Refuser de rater, c’est refuser d’apprendre.'],
            ['Pourquoi se filmer ou se faire observer ?', ['Voir le geste de l’extérieur corrige plus vite que la sensation', 'Pour se comparer', 'Pour être noté', 'Pour le plaisir'], 0, 'La sensation interne trompe souvent.'],
            ['On progresse surtout grâce à des dispositions naturelles.', ['Vrai', 'Faux'], 1, 'C’est la méthode et la régularité qui font la différence.'],
          ],
        },

        // --- Chapitre 2 : Le corps à l'effort ---
        {
          titre: 'L’échauffement',
          axe: 'Le corps à l’effort',
          lecon: {
            titre: 'Préparer le corps avant de lui demander',
            cours: `## Pourquoi s’échauffer
L’échauffement prépare le corps à l’effort et **réduit le risque de blessure**. Il n’est pas une formalité que l’on abrège quand on est pressé : c’est la partie de la séance qui protège toutes les autres.

## Ce qu’il produit dans le corps
- La **température** musculaire monte de 1 à 2 °C : le muscle devient plus **élastique**, donc moins exposé au claquage.
- Le **cœur** accélère progressivement et envoie plus de sang aux muscles.
- Les **articulations** produisent du liquide synovial, qui les lubrifie.
- La **vigilance** et la coordination s’améliorent : on réagit plus vite.

## Les trois temps
1. **Général** : 5 à 10 minutes d’activité douce et continue — trottiner, sautiller — pour élever le rythme cardiaque.
2. **Articulaire** : mobiliser chaque articulation, de la nuque aux chevilles, par des rotations lentes.
3. **Spécifique** : reproduire les gestes de l’activité à venir, de plus en plus vite — passes avant un match, mouvements de bras avant la natation.

## Progressif, toujours
On va du **lent vers le rapide**, du **général vers le spécifique**, du **petit vers le grand**. Un échauffement qui commence par un sprint n’échauffe rien : il blesse.

> Un muscle froid a la souplesse d’un élastique sorti du réfrigérateur. C’est exactement ce qui se déchire.

## Les étirements
Les étirements longs et statiques n’ont **pas** leur place avant l’effort : ils diminuent temporairement la force et n’empêchent pas les blessures. On les réserve au **retour au calme**, après.

## Le retour au calme
5 minutes d’activité douce en fin de séance font redescendre le rythme cardiaque et facilitent la récupération.`,
          },
          questions: [
            ['À quoi sert principalement l’échauffement ?', ['Préparer le corps à l’effort et réduire le risque de blessure', 'Fatiguer avant l’effort', 'Gagner du temps', 'Impressionner l’adversaire'], 0, 'C’est la partie qui protège toutes les autres.'],
            ['De combien la température musculaire monte-t-elle ?', ['De 1 à 2 °C', 'De 10 °C', 'Elle ne change pas', 'De 5 °C'], 0, 'Le muscle devient plus élastique.'],
            ['Quels sont les trois temps de l’échauffement ?', ['Général, articulaire, spécifique', 'Étirements, sprint, repos', 'Course, saut, lancer', 'Léger, moyen, intense'], 0, 'Du général vers le spécifique.'],
            ['Combien de temps dure l’échauffement général ?', ['5 à 10 minutes', '30 secondes', '30 minutes', '1 minute'], 0, 'Activité douce et continue.'],
            ['Quand faut-il faire les étirements longs ?', ['Après l’effort, au retour au calme', 'Avant l’effort', 'Pendant l’effort', 'Jamais'], 0, 'Avant, ils diminuent temporairement la force.'],
            ['Dans quel sens progresse un échauffement ?', ['Du lent vers le rapide et du général vers le spécifique', 'Du rapide vers le lent', 'Peu importe l’ordre', 'Du spécifique vers le général'], 0, 'Commencer par un sprint blesse.'],
            ['À quoi sert le retour au calme ?', ['Faire redescendre le rythme cardiaque et faciliter la récupération', 'Gagner des points', 'Rien de particulier', 'Se réchauffer'], 0, 'Environ 5 minutes d’activité douce.'],
            ['Les étirements avant l’effort préviennent les blessures.', ['Vrai', 'Faux'], 1, 'Les étirements statiques avant l’effort diminuent la force sans protéger.'],
          ],
        },
        {
          titre: 'L’effort, le souffle et le cœur',
          axe: 'Le corps à l’effort',
          lecon: {
            titre: 'Ce qui se passe quand on court',
            cours: `## La réponse immédiate
Pendant un effort, les muscles réclament plus de **dioxygène** et de **nutriments**. Le corps répond :
- le **rythme cardiaque** augmente (de ~70 à 150-190 battements par minute) ;
- la **respiration** s’accélère et s’amplifie ;
- la **température** monte, d’où la **transpiration**, qui refroidit ;
- le sang est redistribué en priorité vers les **muscles actifs**.

Un cœur qui accélère à l’effort n’est pas un cœur en difficulté : c’est un cœur qui livre plus vite.

## Les deux régimes
- **Aérobie** : effort modéré et long, le dioxygène suffit. On peut parler en courant. C’est le régime de l’endurance.
- **Anaérobie** : effort intense et bref, le dioxygène ne suffit plus. Le corps produit de l’énergie autrement et **accumule de l’acide lactique** — d’où les jambes qui brûlent et l’essoufflement rapide.

## La fréquence cardiaque maximale
Une estimation simple : **FCmax ≈ 220 − âge**. À 13 ans, environ 207. L’endurance se travaille entre **60 et 75 %** de cette valeur — soit une allure où l’on peut encore parler.

> Le test le plus fiable ne demande aucun matériel : si vous pouvez tenir une conversation en courant, vous êtes en endurance. Si vous ne pouvez plus parler, vous êtes au-delà.

## Les effets à long terme
Un entraînement régulier fait baisser le rythme cardiaque **au repos**, augmente le volume de sang envoyé à chaque battement, renforce les muscles et les os, améliore le sommeil et l’humeur.

## Les signaux d’alerte
Douleur vive, vertiges, nausée, point de côté persistant, essoufflement anormal : on s’arrête et on prévient l’enseignant. La douleur n’est pas un signe de courage, c’est une information.

## L’hydratation
On boit **avant, pendant et après**. La soif apparaît quand la déshydratation a déjà commencé : elle est un retardataire, pas un avertisseur.`,
          },
          questions: [
            ['Que réclament les muscles pendant l’effort ?', ['Plus de dioxygène et de nutriments', 'Moins de sang', 'Du dioxyde de carbone', 'Du repos immédiat'], 0, 'Le cœur et la respiration s’accélèrent pour les fournir.'],
            ['Qu’est-ce que le régime aérobie ?', ['Un effort modéré et long où le dioxygène suffit', 'Un sprint', 'Un effort sans respiration', 'Un effort au repos'], 0, 'On peut parler en courant.'],
            ['Que produit le corps en anaérobie ?', ['De l’acide lactique', 'Du dioxygène', 'De l’eau seulement', 'Du glucose'], 0, 'D’où les jambes qui brûlent.'],
            ['Comment estimer sa fréquence cardiaque maximale ?', ['220 moins l’âge', '200 plus l’âge', 'Le double du pouls au repos', '150 pour tout le monde'], 0, 'À 13 ans, environ 207.'],
            ['À quelle intensité travaille-t-on l’endurance ?', ['Entre 60 et 75 % de la FCmax', 'À 100 %', 'À 30 %', 'Peu importe'], 0, 'Une allure où l’on peut encore parler.'],
            ['Quel effet l’entraînement régulier a-t-il au repos ?', ['Il fait baisser le rythme cardiaque', 'Il l’augmente', 'Il ne change rien', 'Il augmente la température'], 0, 'Le cœur envoie plus de sang à chaque battement.'],
            ['Quand faut-il boire ?', ['Avant, pendant et après l’effort', 'Seulement après', 'Seulement quand on a soif', 'Le moins possible'], 0, 'La soif apparaît quand la déshydratation a commencé.'],
            ['Une douleur vive pendant l’effort doit être surmontée par courage.', ['Vrai', 'Faux'], 1, 'C’est une information : on s’arrête et on prévient.'],
          ],
        },
        {
          titre: 'Hygiène de vie : sommeil, alimentation, écrans',
          axe: 'Le corps à l’effort',
          lecon: {
            titre: 'Ce qui se joue en dehors du terrain',
            cours: `## Le sommeil
Un adolescent a besoin de **8 à 10 heures** par nuit. Le sommeil n’est pas du temps perdu : c’est pendant qu’il dort que le corps **répare** ses muscles, sécrète l’hormone de croissance et **consolide** les apprentissages — moteurs comme scolaires.
Dormir après avoir appris un geste améliore mesurablement son exécution le lendemain.

## Les écrans et le sommeil
La **lumière bleue** retarde la sécrétion de mélatonine, l’hormone qui déclenche l’endormissement. Un écran dans l’heure qui précède le coucher décale l’endormissement et raccourcit la nuit — et la nuit raccourcie se paie le lendemain, en concentration comme en performance.

## L’alimentation
- Les **glucides complexes** (pâtes, riz, pain, légumes secs) sont le carburant de l’effort.
- Les **protéines** (viande, poisson, œufs, légumineuses) réparent le muscle.
- Les **fruits et légumes** apportent vitamines et minéraux.
- L’**eau** est la seule boisson indispensable.

Le **petit-déjeuner** compte : venir en cours d’EPS à jeun expose au malaise.

## Ce qui est vendu comme utile et ne l’est pas
Boissons énergisantes, compléments protéinés, produits « performance » : inutiles à cet âge, parfois dangereux. Un adolescent qui mange varié n’a besoin d’aucun complément.

> À 13 ans, le principal facteur de performance n’est ni la protéine ni la boisson : c’est le sommeil.

## L’activité physique quotidienne
L’OMS recommande **au moins 60 minutes** d’activité physique par jour pour les 5-17 ans. Marcher, prendre l’escalier, faire du vélo comptent : il ne s’agit pas de sport encadré, mais de mouvement.

## La sédentarité
Rester assis longtemps est un risque **distinct** du manque de sport : on peut faire de l’EPS et être sédentaire le reste du temps. Se lever et bouger quelques minutes chaque heure compte réellement.`,
          },
          questions: [
            ['De combien d’heures de sommeil un adolescent a-t-il besoin ?', ['8 à 10 heures', '5 à 6 heures', '12 heures', '7 heures maximum'], 0, 'C’est pendant le sommeil que le corps répare et consolide.'],
            ['Que fait le corps pendant le sommeil ?', ['Il répare les muscles et consolide les apprentissages', 'Il ne fait rien', 'Il brûle des calories seulement', 'Il digère uniquement'], 0, 'Y compris les apprentissages moteurs.'],
            ['Pourquoi les écrans nuisent-ils au sommeil ?', ['La lumière bleue retarde la sécrétion de mélatonine', 'Ils chauffent la pièce', 'Ils font du bruit', 'Ils fatiguent les yeux seulement'], 0, 'L’endormissement est décalé.'],
            ['Quel nutriment est le carburant principal de l’effort ?', ['Les glucides complexes', 'Les lipides', 'Les protéines', 'Les vitamines'], 0, 'Pâtes, riz, pain, légumes secs.'],
            ['Quelle est la seule boisson indispensable ?', ['L’eau', 'Les boissons énergisantes', 'Le jus de fruit', 'Le lait'], 0, 'Les boissons énergisantes sont inutiles et parfois dangereuses.'],
            ['Combien de minutes d’activité par jour l’OMS recommande-t-elle aux 5-17 ans ?', ['Au moins 60 minutes', '15 minutes', '30 minutes', '2 heures'], 0, 'Marcher et faire du vélo comptent.'],
            ['La sédentarité est-elle compensée par une séance de sport ?', ['Non, c’est un risque distinct du manque de sport', 'Oui, entièrement', 'Oui, si la séance est longue', 'La question ne se pose pas'], 0, 'Se lever quelques minutes chaque heure compte.'],
            ['Un adolescent sportif a besoin de compléments protéinés.', ['Vrai', 'Faux'], 1, 'Une alimentation variée suffit ; à cet âge, le premier facteur est le sommeil.'],
          ],
        },

        // --- Chapitre 3 : Les rôles, les règles, la sécurité ---
        {
          titre: 'Les rôles sociaux : arbitre, observateur, coach',
          axe: 'Les rôles, les règles, la sécurité',
          lecon: {
            titre: 'On n’est pas seulement joueur',
            cours: `## Pourquoi des rôles
En EPS, on ne fait pas que pratiquer : on **arbitre**, on **observe**, on **conseille**, on **organise**. Ces rôles sont évalués au même titre que la performance, et pour une bonne raison — ils demandent de comprendre l’activité, pas seulement de la subir.

## L’arbitre
Il fait appliquer la règle. Cela suppose de la **connaître**, de **décider vite**, et d’**assumer** une décision contestée. Un arbitre qui hésite perd le match.
Il apprend aussi ce qu’on ressent quand on est contesté — ce qui change durablement la façon de jouer ensuite.

## L’observateur
Il relève des données précises : nombre de passes réussies, temps de possession, zones de tir, appuis. Ces relevés servent au camarade à **voir** ce qu’il ne sent pas.
Observer demande un **critère** : « il a bien joué » ne sert à rien ; « 7 passes sur 10 réussies » se travaille.

## Le coach
Il conseille, encourage, propose une stratégie. Un bon conseil est **précis** et **positif** : « place-toi plus haut » plutôt que « tu joues mal ».

## L’organisateur
Installer et ranger le matériel, tenir un score, gérer un chronomètre, constituer des équipes équilibrées. Sans lui, la séance n’a pas lieu.

> Tenir un rôle, c’est passer du statut de participant à celui de responsable. C’est ce qui distingue un groupe d’élèves d’une classe qui travaille.

## Ce que ça apporte hors du gymnase
Décider sous pression, formuler un retour utile, accepter une décision qu’on juge injuste, organiser un groupe : ce sont des compétences qui servent partout, et l’EPS est l’un des rares endroits où on les pratique vraiment.

## Le respect de celui qui tient le rôle
Contester systématiquement l’arbitre — élève ou adulte — désorganise la séance et rend le rôle intenable. On peut demander une explication ; on n’insulte pas.`,
          },
          questions: [
            ['Pourquoi les rôles sont-ils évalués en EPS ?', ['Ils demandent de comprendre l’activité, pas seulement de la subir', 'Pour occuper les élèves dispensés', 'Pour gagner du temps', 'Ils ne sont pas évalués'], 0, 'Au même titre que la performance.'],
            ['Que suppose le rôle d’arbitre ?', ['Connaître la règle, décider vite et assumer la contestation', 'Être le meilleur joueur', 'Être le plus âgé', 'Rester silencieux'], 0, 'Un arbitre qui hésite perd le match.'],
            ['Que fait l’observateur ?', ['Il relève des données précises et chiffrées', 'Il donne son avis général', 'Il arbitre', 'Il ne fait rien'], 0, '« 7 passes sur 10 » se travaille, « il a bien joué » non.'],
            ['Qu’est-ce qu’un bon conseil de coach ?', ['Précis et positif : « place-toi plus haut »', 'Général : « joue mieux »', 'Négatif mais franc', 'Silencieux'], 0, 'Le conseil doit être actionnable.'],
            ['Que fait l’organisateur ?', ['Il installe le matériel, tient le score, équilibre les équipes', 'Il joue en premier', 'Il note les élèves', 'Il choisit l’activité'], 0, 'Sans lui, la séance n’a pas lieu.'],
            ['Qu’apprend-on en arbitrant ?', ['Ce qu’on ressent quand on est contesté', 'À courir plus vite', 'À marquer plus de points', 'Rien de particulier'], 0, 'Cela change durablement la façon de jouer.'],
            ['Quelles compétences transférables les rôles développent-ils ?', ['Décider sous pression, formuler un retour, organiser un groupe', 'La vitesse de course', 'La force musculaire', 'La souplesse'], 0, 'Elles servent bien au-delà du gymnase.'],
            ['Contester systématiquement l’arbitre fait partie du jeu.', ['Vrai', 'Faux'], 1, 'Cela désorganise la séance et rend le rôle intenable.'],
          ],
        },
        {
          titre: 'Les règles et le fair-play',
          axe: 'Les rôles, les règles, la sécurité',
          lecon: {
            titre: 'Ce qui rend le jeu possible',
            cours: `## La règle n’empêche pas, elle permet
Sans règle commune, il n’y a pas de match : il y a une bagarre. La règle **crée** le jeu en fixant ce qui compte, ce qui est interdit et comment on gagne. C’est pourquoi la contester en permanence revient à détruire ce à quoi on veut jouer.

## Trois familles de règles
- Les règles de **but** : comment on marque et comment on gagne.
- Les règles d’**espace et de temps** : terrain, zones, durée.
- Les règles de **sécurité** : contacts autorisés ou non, matériel obligatoire.

## Le fair-play
C’est respecter la règle **et** l’adversaire, même quand rien ne nous y oblige : reconnaître une faute que l’arbitre n’a pas vue, ne pas humilier un adversaire dominé, aider un joueur à terre, serrer la main à la fin.

> Le fair-play commence exactement là où finit la surveillance. Respecter la règle quand l’arbitre regarde, c’est de l’obéissance ; la respecter quand il ne regarde pas, c’est du fair-play.

## La victoire et la défaite
Gagner sans mépriser, perdre sans accuser. Chercher une excuse — l’arbitre, le terrain, les autres — empêche d’identifier ce qu’il y avait à corriger : le mauvais perdant se prive du principal bénéfice de la défaite.

## La triche
Elle peut faire gagner un match et fait perdre l’essentiel : une victoire obtenue en trichant ne prouve rien, pas même à celui qui triche.

## Le dopage
Utiliser des substances interdites pour améliorer sa performance est **interdit** et **dangereux** : effets sur le cœur, les hormones, le psychisme. Les contrôles existent à tous les niveaux, et les sanctions vont jusqu’à l’exclusion des compétitions.

## Les valeurs olympiques
**Excellence** (donner son meilleur), **amitié**, **respect**. Elles résument ce que l’EPS cherche à transmettre au-delà des performances.`,
          },
          questions: [
            ['À quoi sert la règle dans un sport ?', ['Elle crée le jeu en fixant ce qui compte', 'Elle empêche de jouer librement', 'Elle avantage les plus forts', 'Elle sert à punir'], 0, 'Sans règle commune, il n’y a pas de match.'],
            ['Qu’est-ce que le fair-play ?', ['Respecter la règle et l’adversaire même sans y être obligé', 'Gagner à tout prix', 'Obéir à l’arbitre', 'Ne jamais protester'], 0, 'Il commence là où finit la surveillance.'],
            ['Quelles sont les trois familles de règles ?', ['Règles de but, d’espace et de temps, de sécurité', 'Règles écrites, orales, tacites', 'Règles d’attaque, de défense, de repos', 'Règles simples, moyennes, complexes'], 0, 'Chacune joue un rôle différent.'],
            ['Que perd le mauvais perdant ?', ['La possibilité d’identifier ce qu’il y avait à corriger', 'Des points', 'Le respect de l’arbitre', 'Rien'], 0, 'Chercher une excuse empêche de progresser.'],
            ['Que prouve une victoire obtenue en trichant ?', ['Rien, pas même à celui qui triche', 'Qu’on est le meilleur', 'Qu’on est malin', 'Que la règle est mauvaise'], 0, 'Elle fait gagner un match et perdre l’essentiel.'],
            ['Pourquoi le dopage est-il interdit ?', ['Il fausse la compétition et met la santé en danger', 'Il coûte cher', 'Il est difficile à obtenir', 'Il ne fonctionne pas'], 0, 'Effets sur le cœur, les hormones, le psychisme.'],
            ['Quelles sont les trois valeurs olympiques ?', ['Excellence, amitié, respect', 'Force, vitesse, endurance', 'Victoire, gloire, argent', 'Discipline, silence, obéissance'], 0, 'Elles dépassent la performance.'],
            ['Respecter la règle uniquement quand l’arbitre regarde, c’est du fair-play.', ['Vrai', 'Faux'], 1, 'C’est de l’obéissance ; le fair-play commence quand personne ne surveille.'],
          ],
        },
        {
          titre: 'La sécurité et les premiers secours',
          axe: 'Les rôles, les règles, la sécurité',
          lecon: {
            titre: 'Prévenir, et savoir quoi faire',
            cours: `## Prévenir d’abord
La plupart des accidents en EPS sont évitables. Les règles de base :
- une **tenue adaptée** : chaussures de sport lacées, vêtements qui ne gênent pas ;
- **pas de bijoux** — bagues, colliers, montres, piercings : ils accrochent et blessent ;
- **cheveux attachés**, lunettes sécurisées ;
- **échauffement** systématique ;
- **matériel vérifié** : tapis en place, agrès stables, terrain dégagé ;
- **respect des consignes** : elles existent parce qu’un accident a déjà eu lieu.

## Les règles propres à chaque activité
Parade en gymnastique, assurage en escalade, zone de lancer dégagée en athlétisme, contacts interdits en sport de combat hors situation prévue. Elles ne sont pas négociables.

> Une consigne de sécurité n’est presque jamais une précaution théorique : c’est la trace d’un accident réel qu’on ne veut pas revoir.

## Reconnaître une blessure
- **Entorse** : articulation tordue, douleur, gonflement.
- **Claquage** : douleur musculaire brutale en plein effort.
- **Fracture** : douleur intense, déformation, impossibilité de bouger.
- **Malaise** : pâleur, sueurs, vertiges.

## Le protocole RICE
Pour une entorse ou un choc : **Repos**, **Ice** (glace 15-20 min, jamais à même la peau), **Compression**, **Élévation**. Puis avis médical.

## Alerter
1. **Protéger** : supprimer le danger, sans se mettre en danger soi-même.
2. **Alerter** : **15** (SAMU), **18** (pompiers), **112** (numéro européen), **114** (par SMS).
3. **Secourir** dans la limite de ce qu’on sait faire.

Au téléphone : le lieu précis, ce qui s’est passé, l’état de la victime — et **ne jamais raccrocher le premier**.

## Le PSC1
La formation **Prévention et secours civiques de niveau 1** s’obtient dès le collège : position latérale de sécurité, massage cardiaque, défibrillateur. Elle sauve des vies bien au-delà du gymnase.`,
          },
          questions: [
            ['Pourquoi retire-t-on les bijoux avant une séance ?', ['Ils accrochent et blessent', 'Ils font du bruit', 'Ils ralentissent', 'C’est une tradition'], 0, 'Bagues, colliers, montres, piercings.'],
            ['Que signale une consigne de sécurité ?', ['La trace d’un accident réel qu’on ne veut pas revoir', 'Une précaution théorique', 'Une contrainte administrative', 'Une préférence du professeur'], 0, 'Elles ne sont pas négociables.'],
            ['Qu’est-ce qu’un claquage ?', ['Une douleur musculaire brutale en plein effort', 'Une articulation tordue', 'Un os cassé', 'Un vertige'], 0, 'L’entorse concerne l’articulation.'],
            ['Que signifie le protocole RICE ?', ['Repos, glace, compression, élévation', 'Repos, immobilité, chaleur, examen', 'Respirer, isoler, calmer, évacuer', 'Rien de précis'], 0, 'La glace jamais à même la peau.'],
            ['Quel est l’ordre des gestes en cas d’accident ?', ['Protéger, alerter, secourir', 'Secourir, alerter, protéger', 'Alerter, protéger, secourir', 'Appeler les parents d’abord'], 0, 'Sans se mettre soi-même en danger.'],
            ['Quel numéro appeler pour une urgence médicale ?', ['Le 15', 'Le 17', 'Le 114', 'Le 119'], 0, 'Le 112 fonctionne partout en Europe.'],
            ['Qu’apprend-on au PSC1 ?', ['Position latérale de sécurité, massage cardiaque, défibrillateur', 'Les règles du basket', 'L’échauffement', 'La natation'], 0, 'Elle s’obtient dès le collège.'],
            ['Au téléphone avec les secours, on peut raccrocher dès qu’on a donné l’adresse.', ['Vrai', 'Faux'], 1, 'On ne raccroche jamais le premier.'],
          ],
        },
      ],
    },
  ],
}
