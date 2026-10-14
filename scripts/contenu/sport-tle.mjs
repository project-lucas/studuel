// SPORT — Tle : « PERFORMER » (10 fiches). La matière Sport refaite en
// CULTURE SPORTIVE (14/10/2026, Lucas : « on va s'écarter [du programme], on
// doit apporter l'histoire du sport notamment de la France, les fondamentaux
// du sport : hypertrophie, force, endurance, récupération, anti-blessure »).
// Le cadrage, le programme des 40 fiches et les règles de ton sont dans
// docs/CADRAGE-SPORT.md.
//
// Axes : performer (4), le sport dans la société (4), l’évaluation au baccalauréat (2, dont « Le bac d’EPS » gardé tel quel).
//
// ⚠️ Ne JAMAIS générer avec `--slugs sport` : toujours `--modules sport-tle`.

import { createHash } from 'node:crypto'

const NIVEAUX = ['Tle']

// L'identifiant d'un chapitre, tel que le calcule scripts/seed-contenu.mjs
// (clé `sport|<niveau>|<titre>`, espace de noms fixe) : le ménage en a besoin
// pour ne supprimer que les chapitres qui ne font PAS partie de ce bloc.
function uuid(cle) {
  const h = createHash('sha1').update(`studuel.contenu.v1:${cle}`).digest('hex')
  return [
    h.slice(0, 8),
    h.slice(8, 12),
    `5${h.slice(13, 16)}`,
    ((parseInt(h.slice(16, 18), 16) & 0x3f) | 0x80).toString(16).padStart(2, '0') + h.slice(18, 20),
    h.slice(20, 32),
  ].join('-')
}

const chapitres = [
  // ---- Performer ------------------------------------------------------------
  {
    titre: 'Planifier une saison : périodisation et pic de forme',
    axe: 'Performer',
    lecon: {
      titre: 'Dessiner sa saison à rebours',
      cours: `Un nageur vise les championnats de France en avril. En septembre, il nage déjà beaucoup, sans jamais s’épuiser ; en mars, il nage moins, mais plus vite ; le jour J, il est frais. Rien de tout cela n’est un hasard : sa saison a été **dessinée à rebours**, de la date qui compte jusqu’à aujourd’hui.

## Trois échelles de temps
Un entraîneur découpe l’année comme un calendrier emboîté.

| Cycle | Durée | Rôle |
| **Macrocycle** | la saison entière | aller vers l’objectif principal |
| **Mésocycle** | 3 à 6 semaines | développer une qualité (endurance, force, vitesse) |
| **Microcycle** | la semaine | répartir les séances dures et les séances légères |

## Les quatre périodes
Dans les années 1960, le Soviétique Lev Matveïev a décrit un schéma resté célèbre : la **périodisation**. Il découpe la saison en quatre périodes.

| Période | Ce qu’on y fait |
| **Préparation générale** | beaucoup de volume, des exercices variés, on bâtit le moteur |
| **Préparation spécifique** | le travail se rapproche du sport pratiqué, l’intensité monte |
| **Compétition** | on affûte, on vise les échéances, le volume baisse |
| **Transition** | repos actif, on souffle et on se refait une santé |

> Une saison réussie ne se résume pas à « s’entraîner plus » : elle organise le moment où l’on travaille dur et le moment où l’on récupère.

## Charge et décharge
Le corps progresse quand il encaisse une charge puis récupère. D’où la règle courante de **trois semaines dures pour une semaine légère** : la semaine de décharge laisse la surcompensation se faire. Sauter la décharge, c’est empiler de la fatigue sans la transformer en progrès.

## L’affûtage : arriver frais le jour J
Avant l’objectif, on lève le pied. L’**affûtage** dure **1 à 3 semaines** : on réduit le volume d’environ **40 à 60 %** tout en **gardant l’intensité**. Le corps efface la fatigue mais garde ses acquis. Garder l’intensité est essentiel : si l’on baisse tout, on perd la fraîcheur des gestes rapides.

!> Un pic de forme ne se tient que **quelques semaines**. Personne ne peut être au sommet toute l’année : viser trois objectifs majeurs sur une saison, c’est souvent en rater deux.

## Une autre manière : les blocs
Le chercheur Vladimir Issurin a proposé la **périodisation par blocs** : plutôt que de tout travailler en même temps, on concentre l’entraînement sur une seule qualité à la fois pendant quelques semaines, puis on enchaîne.

## Ta saison à toi : sport et bac
Tu n’as pas qu’un objectif sportif : tu as aussi un **calendrier scolaire**. Les épreuves du bac, les devoirs surveillés, les vacances pèsent sur ton sommeil et ton énergie. Un bon plan place les semaines les plus dures loin des périodes de révision intense, et prévoit une décharge au moment des examens.

| Étape pour dessiner sa saison | Question à se poser |
| 1. Fixer l’objectif | quelle est ma date clé ? |
| 2. Remonter le temps | combien de semaines ai-je devant moi ? |
| 3. Poser les repos | où mettre mes décharges et ma transition ? |
| 4. Ajuster | mes examens tombent-ils en pleine charge ? |

## À retenir
- La saison se découpe en macrocycle, mésocycles et microcycles, avec quatre périodes : générale, spécifique, compétition, transition.
- On alterne charge et décharge (environ trois semaines dures pour une légère) et on affûte 1 à 3 semaines avant l’objectif.
- Un pic de forme dure quelques semaines : on dessine sa saison à rebours, en tenant compte du calendrier scolaire.`,
    },
    questions: [
      ['Comment appelle-t-on la saison entière dans le découpage d’un entraîneur ?', ['Le macrocycle', 'Le mésocycle', 'Le microcycle', 'La transition'], 0, 'Le macrocycle est le grand cycle de la saison ; le mésocycle dure 3 à 6 semaines et le microcycle une semaine.'],
      ['Combien de temps dure en général un mésocycle ?', ['De 3 à 6 semaines', 'Un seul jour', 'Un an et demi', 'Dix minutes'], 0, 'Le mésocycle, de 3 à 6 semaines, sert à développer une qualité précise comme l’endurance ou la force.'],
      ['Quelle période de la saison vise surtout à bâtir le moteur avec beaucoup de volume ?', ['La préparation générale', 'La compétition', 'La transition', 'L’affûtage'], 0, 'C’est en préparation générale qu’on accumule du volume et des exercices variés avant de se rapprocher du sport pratiqué.'],
      ['Que fait-on pendant la période de transition ?', ['On se repose activement et on récupère', 'On s’entraîne au maximum', 'On passe tous les tests', 'On change de sport définitivement'], 0, 'La transition suit la saison : repos actif pour se refaire une santé avant de repartir.'],
      ['Qu’est-ce que la surcompensation permet dans la règle des « trois semaines dures, une légère » ?', ['Transformer la fatigue en progrès pendant la semaine de décharge', 'Gagner plus de poids', 'Éviter tout repos', 'Supprimer les courbatures à vie'], 0, 'La semaine légère laisse le corps réparer et dépasser son niveau de départ ; sans elle, la fatigue s’empile.'],
      ['Pendant l’affûtage, que fait-on du volume et de l’intensité ?', ['On baisse le volume en gardant l’intensité', 'On baisse les deux au maximum', 'On monte le volume et on baisse l’intensité', 'On ne change rien'], 0, 'On réduit le volume de 40 à 60 % mais on garde l’intensité : le corps se rafraîchit sans perdre ses acquis.'],
      ['L’affûtage dure en général plusieurs mois avant la compétition.', ['Vrai', 'Faux'], 1, 'Il dure 1 à 3 semaines : bien plus long, on perdrait le bénéfice de l’entraînement.'],
      ['Un sportif peut rester à son pic de forme toute l’année.', ['Vrai', 'Faux'], 1, 'Un pic de forme ne se tient que quelques semaines : il faut le viser pour les objectifs principaux.'],
      ['À quelle époque Matveïev a-t-il décrit sa périodisation ?', ['Dans les années 1960', 'Au XIXe siècle', 'En 2010', 'Dans les années 1920'], 0, 'Lev Matveïev a proposé son schéma en quatre périodes dans les années 1960.'],
      ['Que propose la périodisation par blocs défendue par Vladimir Issurin ?', ['Concentrer l’entraînement sur une qualité à la fois pendant quelques semaines', 'Travailler toutes les qualités chaque jour', 'Supprimer les semaines de repos', 'S’entraîner seulement avant l’objectif'], 0, 'Plutôt que de tout mélanger, on met un bloc d’entraînement sur une seule qualité, puis on passe à la suivante.'],
      ['Pourquoi tenir compte du calendrier du bac dans sa saison sportive ?', ['Parce que les examens pèsent sur le sommeil et l’énergie', 'Parce que le bac impose des séances', 'Parce que la fatigue disparaît pendant les révisions', 'Parce que les entraîneurs l’exigent'], 0, 'Les semaines dures doivent éviter les périodes de révision intense, et une décharge se place au moment des examens.'],
      ['Par quoi commence-t-on pour dessiner sa saison ?', ['Par la date de l’objectif principal, puis on remonte le temps', 'Par la dernière séance de l’année', 'Par l’achat du matériel', 'Par le choix de la tenue'], 0, 'On fixe la date clé, on compte les semaines disponibles, puis on place les repos : la saison se dessine à rebours.'],
    ],
  },
  {
    titre: 'Mesurer et analyser : fréquence cardiaque, VMA, tests et carnet',
    axe: 'Performer',
    lecon: {
      titre: 'Du chiffre à la décision',
      cours: `Une montre au poignet affiche 168 pulsations par minute. Bien ou mal ? Le chiffre seul ne dit rien : tout dépend de ta fréquence cardiaque maximale, de ton niveau de forme et de ce que tu veux travailler. **Mesurer**, c’est facile ; **interpréter**, c’est le vrai travail.

## Les repères du cœur
| Repère | Ce que c’est |
| **FC de repos** | les battements par minute au calme, au réveil : elle baisse avec l’entraînement |
| **FC max** | le maximum que ton cœur peut atteindre à l’effort |
| **FC de réserve** | FC max − FC de repos : la marge dont tu disposes |

Pour viser une intensité, on utilise la **formule de Karvonen** : **FC cible = FC repos + % × (FC max − FC repos)**. Exemple : avec une FC de repos de 60 et une FC max de 200, viser 70 % donne 60 + 0,7 × 140 = **158**.

## Les zones d’intensité
On range l’effort en cinq zones, de 1 (très facile, récupération) à 5 (maximal, quelques minutes au plus). Les zones basses construisent l’endurance, les hautes développent la puissance. Un piège fréquent : s’entraîner toujours « au milieu », ni assez facile pour récupérer, ni assez dur pour progresser.

## Les tests de terrain
Le laboratoire n’est pas nécessaire : des tests simples donnent une bonne idée de ta forme.

| Test | Ce qu’il mesure |
| **Navette 20 m de Léger** | l’endurance, en allers-retours de plus en plus rapides |
| **VAMEVAL** | la vitesse maximale aérobie (VMA) sur piste |
| **Léger-Boucher** | la VMA en courant par paliers |
| **Cooper (12 min)** | la distance parcourue en 12 minutes, reflet de l’endurance |
| **30-15 IFT** | la capacité à enchaîner des courses avec changements de direction |

La **VMA** est la vitesse à laquelle ton organisme consomme le plus d’oxygène : c’est la référence pour régler tes allures en course.

## Mesurer le ressenti
Les chiffres ne disent pas tout. L’**échelle de perception de l’effort de Borg** (RPE, de 1 à 10) demande simplement : « À quel point c’était dur ? » La **charge de séance** se calcule alors : **RPE × durée en minutes** (méthode de Foster). Une séance de 60 minutes à 7 donne 420 unités. En comparant la charge de la semaine en cours à celle des semaines précédentes (le **ratio aigu/chronique**), on repère les hausses trop brutales qui exposent à la blessure.

> Mesurer, c’est relever des chiffres ; interpréter, c’est se demander ce qu’ils signifient pour la séance de demain.

## Montres, capteurs et variabilité
Les montres GPS et les capteurs cardiaques enregistrent distance, allure et pulsations. La **variabilité cardiaque** mesurée au réveil renseigne sur la fatigue du système nerveux. Ces outils aident, mais ils se trompent parfois : ils ne remplacent ni tes sensations, ni ton bon sens.

## Le carnet d’entraînement
Le carnet est l’outil le plus puissant, et il est gratuit. Tu y notes la date, la séance, la durée, le RPE, ton sommeil et ton humeur. C’est aussi ce que l’**AFL2** du bac d’EPS évalue : savoir s’entraîner, analyser et ajuster.

!> Une semaine de carnet commentée vaut mieux que dix pages de chiffres sans réflexion : à chaque ligne, écris ce que tu changes la prochaine fois.

## À retenir
- On cible une intensité avec la FC de réserve (Karvonen) et on la situe dans une zone de 1 à 5.
- Les tests de terrain (Léger, VAMEVAL, Cooper, 30-15 IFT) mesurent la forme ; le RPE multiplié par la durée donne la charge de séance.
- Mesurer ne suffit pas : le carnet sert à interpréter les chiffres et à décider.`,
    },
    questions: [
      ['Que désigne la fréquence cardiaque de réserve ?', ['La différence entre la FC max et la FC de repos', 'La FC au réveil', 'La FC moyenne d’un match', 'Le total des battements dans une journée'], 0, 'FC de réserve = FC max − FC de repos : c’est la marge de travail du cœur.'],
      ['Avec une FC de repos de 60, une FC max de 200 et une cible à 70 %, quelle est la FC cible selon Karvonen ?', ['158', '140', '170', '130'], 0, '60 + 0,7 × (200 − 60) = 60 + 98 = 158.'],
      ['Que mesure surtout le test de Cooper ?', ['La distance parcourue en 12 minutes', 'La force maximale', 'La souplesse', 'La précision de tir'], 0, 'Le test de Cooper compte la distance faite en 12 minutes, reflet de l’endurance.'],
      ['Quel test enchaîne des courses avec changements de direction ?', ['Le 30-15 IFT', 'Le test de Cooper', 'Le test de la chandelle', 'Le saut en longueur'], 0, 'Le 30-15 IFT évalue la capacité à répéter des courses avec changements de direction.'],
      ['Que signifie VMA ?', ['Vitesse maximale aérobie', 'Volume moyen d’allure', 'Variation musculaire active', 'Vitesse maximale absolue'], 0, 'La VMA est la vitesse à laquelle l’organisme consomme le plus d’oxygène ; elle sert à régler les allures.'],
      ['Comment calcule-t-on la charge d’une séance selon Foster ?', ['RPE × durée de la séance', 'FC max × durée', 'Distance ÷ temps', 'Poids × répétitions'], 0, 'On multiplie la perception de l’effort (RPE) par la durée en minutes : 60 min à 7 donnent 420.'],
      ['L’échelle de Borg (RPE) va de 1 à 10 et mesure le ressenti de l’effort.', ['Vrai', 'Faux'], 0, 'Elle demande simplement à quel point la séance a été dure, de 1 (très facile) à 10 (maximal).'],
      ['Un ratio aigu/chronique très élevé signale…', ['une hausse brutale de charge qui expose à la blessure', 'un excellent état de forme', 'une séance trop facile', 'un manque de sommeil uniquement'], 0, 'Comparer la charge de la semaine à celle des semaines précédentes permet de repérer les montées trop rapides.'],
      ['Mesurer et interpréter, c’est la même chose.', ['Vrai', 'Faux'], 1, 'Mesurer, c’est relever des chiffres ; interpréter, c’est comprendre ce qu’ils signifient et décider de la suite.'],
      ['Que peut-on noter dans un carnet d’entraînement ?', ['La séance, la durée, le RPE, le sommeil et l’humeur', 'Uniquement le score des matchs', 'Seulement le poids soulevé', 'Rien : il vaut mieux se fier à sa mémoire'], 0, 'Plus le carnet est complet, plus on peut analyser et ajuster ses séances.'],
      ['Quel attendu du bac d’EPS évalue notamment le carnet d’entraînement ?', ['L’AFL2', 'L’AFL1', 'Aucun', 'L’AFL4'], 0, 'L’AFL2 évalue la capacité à s’entraîner, à analyser et à ajuster, le carnet en étant la trace.'],
      ['La variabilité cardiaque au réveil renseigne surtout sur…', ['la fatigue du système nerveux', 'la taille du cœur', 'la souplesse', 'la vitesse maximale'], 0, 'Elle reflète l’état de récupération : une variabilité basse peut signaler de la fatigue.'],
    ],
  },
  {
    titre: 'Le mental : stress, concentration, routines',
    axe: 'Performer',
    lecon: {
      titre: 'La minute avant le départ',
      cours: `Sur la ligne de départ, les mains sont moites, le cœur bat vite, les pensées s’emballent. Certains en font une arme, d’autres se paralysent. La différence n’est pas dans le corps : elle est dans la **préparation mentale**, qui s’apprend comme un geste technique.

## Le stress n’est pas l’ennemi
Face à un enjeu, le corps libère de l’**adrénaline** et du **cortisol** : le cœur accélère, la respiration s’emballe, les muscles se tendent. C’est une réponse normale, faite pour mobiliser. Le problème n’est pas d’être stressé, c’est de l’être **trop** ou **pas assez**.

## La courbe en U inversé
La loi de **Yerkes-Dodson** dit que la performance monte avec l’activation, puis redescend quand elle est excessive.

| Niveau d’activation | Effet sur la performance |
| Trop bas | on est mou, on manque d’envie |
| **Optimal** | concentration, énergie, précision |
| Trop haut | tension, gestes crispés, erreurs |

> L’objectif n’est pas de supprimer le stress, mais de trouver ton niveau d’activation optimal, qui varie selon le sport et la personne.

## Se calmer par le souffle
La respiration est l’un des rares leviers directs sur le stress. La **cohérence cardiaque** consiste à respirer environ **6 fois par minute**, pendant **5 minutes** : inspirer 5 secondes, expirer 5 secondes. Elle apaise le rythme du cœur et aide à retrouver du calme avant l’effort.

## Les routines et l’imagerie
Les champions répètent les mêmes gestes avant l’action : c’est la **routine d’avant-performance**. Rafael Nadal, avant chaque service, enchaîne toujours les mêmes gestes avec sa raquette et ses vêtements. La routine ancre l’attention et évite de laisser les pensées vagabonder.

L’**imagerie mentale** consiste à se voir réussir en pensée, en détail. Le nageur Michael Phelps visualisait ses courses du départ à l’arrivée, y compris les imprévus.

## Fixer le bon objectif
Les objectifs **SMART** sont Spécifiques, Mesurables, Atteignables, Réalistes et définis dans le Temps. Mieux encore : privilégier des objectifs de **processus** (« garder mon dos droit », « regarder ma cible ») plutôt que de **résultat** (« gagner »), car le processus dépend de toi, pas de l’adversaire.

!> Le **dialogue interne** compte : « Je vais rater » installe l’échec, « Une action à la fois » aide à rester présent. On peut s’entraîner à choisir ses mots.

## Craquer sous pression
Le **choke**, c’est la contre-performance sous pression, quand on se met à surveiller son propre geste au lieu de lui faire confiance. Garder l’attention sur la cible et sur une consigne simple aide à l’éviter. La **concentration** est aussi une question d’attention : large pour lire le jeu, étroite pour exécuter un geste précis.

## Le mental, c’est aussi la santé
La gymnaste **Simone Biles** s’est retirée de plusieurs finales aux Jeux de Tokyo en 2021 pour protéger sa santé mentale, ouvrant un large débat sur le bien-être des athlètes. Demander de l’aide est une force.

## Ton Grand oral
Le Grand oral est une performance : stress, souffle, routine, imagerie, objectif de processus. Les mêmes outils s’appliquent.

## À retenir
- Le stress est normal ; la performance est la meilleure à un niveau d’activation optimal (courbe en U inversé).
- Souffle (cohérence cardiaque), routine, imagerie mentale et objectifs de processus se travaillent.
- La santé mentale fait partie de la performance, et ces outils servent aussi au Grand oral.`,
    },
    questions: [
      ['Quelles hormones sont libérées face à un enjeu stressant ?', ['L’adrénaline et le cortisol', 'L’insuline et la leptine', 'La mélatonine et la thyroxine', 'Le calcium et le fer'], 0, 'Adrénaline et cortisol mobilisent le corps : cœur plus rapide, muscles tendus.'],
      ['Que dit la courbe de Yerkes-Dodson ?', ['La performance est maximale à un niveau d’activation intermédiaire', 'Plus on est stressé, mieux on performe', 'Le stress n’a aucun effet', 'La performance baisse toujours avec l’activation'], 0, 'La courbe est en U inversé : trop peu ou trop d’activation dégrade la performance.'],
      ['Combien de respirations par minute vise la cohérence cardiaque ?', ['Environ 6', 'Environ 20', 'Environ 40', 'Environ 2'], 0, 'On respire environ 6 fois par minute, pendant 5 minutes, en inspirant puis expirant 5 secondes.'],
      ['Combien de temps dure en général une séance de cohérence cardiaque ?', ['5 minutes', '10 secondes', '2 heures', '1 jour'], 0, 'Cinq minutes à six respirations par minute suffisent pour apaiser le rythme du cœur.'],
      ['Que fait un athlète avec une routine d’avant-performance ?', ['Il répète les mêmes gestes pour ancrer son attention', 'Il évite de penser à son sport', 'Il change de rituel à chaque fois', 'Il saute l’échauffement'], 0, 'Comme Nadal avant un service, la routine stabilise l’attention et limite les pensées parasites.'],
      ['Qu’est-ce que l’imagerie mentale ?', ['Se voir réussir en pensée, en détail', 'Regarder des photos de son adversaire', 'Dessiner son équipement', 'Comparer ses résultats'], 0, 'On visualise l’action du début à la fin, comme Michael Phelps le faisait pour ses courses.'],
      ['Lequel est un objectif de processus ?', ['Garder le dos droit pendant la course', 'Gagner la médaille d’or', 'Battre le record du monde', 'Finir devant son rival'], 0, 'Un objectif de processus dépend de toi ; un objectif de résultat dépend aussi des autres.'],
      ['Que signifie le « T » de SMART ?', ['Défini dans le Temps', 'Très difficile', 'Technique', 'Toujours gagnant'], 0, 'Un objectif SMART a une échéance : Spécifique, Mesurable, Atteignable, Réaliste, Temporel.'],
      ['Le stress est toujours mauvais pour la performance.', ['Vrai', 'Faux'], 1, 'Un stress modéré mobilise ; il nuit seulement s’il est trop faible ou trop fort.'],
      ['Le « choke » désigne…', ['une contre-performance sous pression', 'un type d’échauffement', 'une technique de respiration', 'un exercice de force'], 0, 'On surveille son geste au lieu de lui faire confiance, et la performance s’effondre.'],
      ['Pourquoi Simone Biles s’est-elle retirée de plusieurs finales aux Jeux de Tokyo en 2021 ?', ['Pour protéger sa santé mentale', 'Parce qu’elle était blessée au genou', 'Parce qu’elle avait perdu ses qualifications', 'Parce que le règlement l’exigeait'], 0, 'Son geste a ouvert un débat sur la santé mentale des athlètes.'],
      ['Les outils du mental peuvent aussi servir pour le Grand oral.', ['Vrai', 'Faux'], 0, 'Le Grand oral est une performance sous enjeu : souffle, routine et imagerie s’y appliquent.'],
    ],
  },
  {
    titre: 'Surentraînement et récupération',
    axe: 'Performer',
    lecon: {
      titre: 'Quand trop de sport fait reculer',
      cours: `Léo, 17 ans, s’entraîne six fois par semaine. En février, ses chronos stagnent ; en mars, ils reculent. Il dort mal, il est irritable, il enchaîne les rhumes. Il se dit qu’il n’en fait pas assez et ajoute une séance. C’est exactement le contraire de ce qu’il faudrait.

## Trois états à distinguer
| État | Durée de la fatigue | Que faire |
| **Fatigue normale** | quelques heures à un jour | dormir, manger, reprendre |
| **Surmenage** | quelques jours | alléger quelques jours |
| **Surentraînement** | des semaines, voire des mois | arrêt ou forte baisse de charge, avis médical |

La fatigue normale est le signe d’un travail utile. Le surentraînement, lui, est un vrai déséquilibre.

## Les signes d’alerte
- une performance qui **baisse malgré le travail** ;
- une **FC de repos élevée** au réveil ;
- un sommeil perturbé ;
- de l’irritabilité, de l’anxiété, une humeur plus sombre ;
- des **infections à répétition** ;
- une **perte d’appétit**.

!> Un seul signe ne prouve rien, mais plusieurs ensemble doivent faire lever le pied et en parler à un médecin ou à un entraîneur.

## Pourquoi ça arrive
Le surentraînement vient d’un déséquilibre entre la charge et la récupération :
- une charge qui **monte trop vite** ;
- l’absence de **semaine de décharge** ;
- un **manque de sommeil** ;
- le **stress scolaire** et les examens, qui s’ajoutent à la fatigue sportive.

> On progresse pendant la récupération, pas pendant l’effort : l’effort lance le signal, le repos fabrique le progrès.

## Le meilleur remède : prévenir
La prévention repose sur la **planification** (décharges prévues, charge qui monte progressivement) et le **carnet** : si la FC de repos grimpe, que le sommeil se dégrade et que le RPE augmente à séance égale, on adapte avant de craquer.

## Bien récupérer
| Levier | Ce qu’il apporte |
| **Sommeil** | le plus puissant : 9 h et plus pour un athlète adolescent |
| **Nutrition** | glucides et protéines pour refaire les stocks |
| **Récupération active** | marche, vélo léger, étirements doux |
| **Massage, compression** | effet modeste, surtout du confort |
| **Bain froid** | soulage, mais peut freiner la prise de muscle si on le fait systématiquement |

## Le sommeil, champion de la récupération
Une étude de l’université Stanford a fait dormir des basketteurs environ **10 heures par nuit** : leurs sprints et leurs lancers francs se sont améliorés. Dormir est un entraînement invisible.

## Les écrans
La lumière des écrans le soir retarde l’endormissement. Poser le téléphone une heure avant de dormir aide à gagner en profondeur de sommeil, donc en récupération.

## Le journal d’un sportif qui en fait trop
Imagine-toi relire le carnet de Léo : FC de repos passée de 55 à 65 en trois semaines, sommeil de six heures, RPE à 9 pour des séances habituellement à 6. Les chiffres racontaient l’histoire avant qu’il ne la sente. Le carnet est un lanceur d’alerte.

## À retenir
- Fatigue normale, surmenage, surentraînement : la durée et les signes changent la réaction à avoir.
- Le surentraînement vient d’un déséquilibre entre charge et récupération ; le carnet et la planification le préviennent.
- Le sommeil est le premier outil de récupération, devant massages et bains froids.`,
    },
    questions: [
      ['Quelle est la durée typique de la fatigue en cas de surentraînement ?', ['Des semaines, voire des mois', 'Quelques minutes', 'Une demi-journée', 'Une seule nuit'], 0, 'Le surentraînement est un déséquilibre durable, contrairement à la fatigue normale qui disparaît après un bon repos.'],
      ['Lequel de ces signes peut alerter sur un surentraînement ?', ['Une FC de repos élevée au réveil', 'Une envie de manger plus de fruits', 'Un meilleur sommeil', 'Une forme meilleure chaque semaine'], 0, 'Une FC de repos qui monte, avec une performance qui baisse, est un signal classique.'],
      ['Qu’est-ce qui peut causer un surentraînement ?', ['Une charge qui monte trop vite sans décharge', 'Une semaine de repos complet', 'Un bon sommeil', 'Des séances variées'], 0, 'Sans décharge ni récupération, la fatigue s’accumule au lieu de se transformer en progrès.'],
      ['On progresse surtout pendant l’effort, pas pendant le repos.', ['Vrai', 'Faux'], 1, 'L’effort lance le signal ; c’est la récupération qui fabrique le progrès.'],
      ['Quelle durée de sommeil recommande-t-on à un athlète adolescent ?', ['9 heures ou plus', '4 heures', '6 heures', 'Peu importe'], 0, 'Le sommeil est le premier levier de récupération, et un athlète adolescent en a besoin d’au moins 9 heures.'],
      ['Que montre l’étude de Stanford sur des basketteurs ?', ['Dormir environ 10 heures améliore sprints et lancers francs', 'Dormir moins améliore la vitesse', 'Le sommeil n’a aucun effet', 'Les lancers francs empirent après une nuit longue'], 0, 'Les joueurs qui dormaient environ 10 heures ont amélioré leurs sprints et leurs lancers francs.'],
      ['Que fait un bain froid pris systématiquement après chaque séance de musculation ?', ['Il soulage mais peut freiner la prise de muscle', 'Il double la prise de muscle', 'Il supprime tout besoin de sommeil', 'Il remplace l’échauffement'], 0, 'Le bain froid calme la douleur, mais le prendre à chaque fois peut atténuer le signal d’adaptation.'],
      ['Le massage et la compression ont un effet…', ['modeste, surtout de confort', 'décisif sur la performance', 'dangereux pour le cœur', 'identique à une nuit de sommeil'], 0, 'Leur effet est modeste : ils aident à se sentir mieux sans remplacer sommeil et nutrition.'],
      ['Comment prévient-on le surentraînement ?', ['Par la planification et un carnet qui permet d’alléger à temps', 'En ajoutant une séance par semaine', 'En supprimant tous les repos', 'En s’entraînant à jeun'], 0, 'Des décharges prévues et un carnet qui alerte sur les signaux évitent d’arriver au bout du rouleau.'],
      ['Pourquoi éviter les écrans juste avant de dormir ?', ['Leur lumière retarde l’endormissement', 'Ils fatiguent les muscles', 'Ils font grossir', 'Ils empêchent la digestion'], 0, 'Moins de sommeil de qualité, c’est moins de récupération.'],
      ['Le stress scolaire peut contribuer au surentraînement.', ['Vrai', 'Faux'], 0, 'Le corps additionne toutes les fatigues : examens, sommeil écourté et séances de sport.'],
      ['Léo voit ses chronos reculer et ajoute une séance. Quelle est la meilleure réaction ?', ['Alléger, dormir davantage et en parler', 'Ajouter encore des séances', 'Supprimer l’échauffement', 'Ne plus manger de glucides'], 0, 'Une performance qui baisse malgré le travail doit faire lever le pied, pas en rajouter.'],
    ],
  },
  // ---- Le sport dans la société ---------------------------------------------
  {
    titre: 'Sport et santé publique : sédentarité et sport sur ordonnance',
    axe: 'Le sport dans la société',
    lecon: {
      titre: 'Un chiffre, une ordonnance',
      cours: `Voici un chiffre qui devrait t’arrêter : selon l’ANSES, en 2020, **deux tiers des 11-17 ans** présentent en France un risque sanitaire préoccupant, par trop d’écrans et pas assez d’activité physique. Le sport n’est pas qu’un loisir : c’est aussi une question de **santé publique**.

## Ce que recommande l’OMS
L’Organisation mondiale de la santé fixe des repères simples.

| Public | Recommandation |
| Enfants et jeunes de 5 à 17 ans | **60 minutes par jour** d’activité modérée à soutenue |
| Adultes | **150 à 300 minutes par semaine** d’activité modérée |

> Bouger un peu vaut mieux que ne pas bouger du tout, et bouger plus apporte encore davantage.

## Sédentarité et inactivité : deux problèmes distincts
On confond souvent les deux.
- L’**inactivité physique**, c’est ne pas atteindre les niveaux d’activité recommandés.
- La **sédentarité**, c’est le **temps passé assis ou allongé** en étant éveillé : devant un écran, en classe, dans les transports.

On peut faire une heure de sport et rester sédentaire le reste de la journée : **les deux comptent**. L’OMS range l’inactivité physique parmi les **premiers facteurs de risque de mortalité** dans le monde.

## Des bénéfices à tous les âges
| Domaine | Ce que le sport change |
| Cœur et vaisseaux | tension plus basse, cœur plus efficace |
| Poids | moins de risque de surpoids |
| Diabète | meilleur contrôle du sucre dans le sang |
| Santé mentale | moins d’anxiété et de symptômes dépressifs |
| Sommeil | endormissement plus facile et sommeil plus profond |

## Le sport sur ordonnance
Et si ton médecin te prescrivait… du sport ? C’est possible. La **loi de 2016**, en vigueur depuis **2017**, permet à un médecin de prescrire de l’**activité physique adaptée** aux personnes atteintes d’une maladie de longue durée. Le dispositif a été **élargi en 2022**. L’activité est adaptée à l’état de santé de chacun, encadrée par des professionnels.

Les **Maisons Sport-Santé**, créées à partir de **2019**, accueillent ceux qui veulent se remettre au sport avec un accompagnement : on y est orienté, conseillé et suivi.

!> « Adaptée » ne veut pas dire « allégée pour rien » : la séance est dosée pour que la personne progresse sans se mettre en danger.

## Et à l’école ?
L’État a lancé en **2022** les **30 minutes d’activité physique quotidienne** à l’école primaire. L’activité physique a aussi été déclarée **grande cause nationale en 2024**, année des Jeux de Paris. L’idée : faire du mouvement un réflexe, pas une corvée.

## Un chiffre, une action
Si tu passes huit heures par jour assis entre cours, transports et écrans, tes 60 minutes d’activité n’effacent pas tout. Pour réduire la sédentarité : te lever à chaque pause, marcher pour tes trajets, couper le téléphone plus tôt le soir.

## À retenir
- L’OMS recommande 60 minutes par jour de 5 à 17 ans et 150 à 300 minutes par semaine chez l’adulte.
- Sédentarité (temps assis) et inactivité (pas assez d’activité) sont deux risques distincts, tous deux nocifs.
- Sport sur ordonnance (loi de 2016, élargi en 2022) et Maisons Sport-Santé (2019) mettent le sport au service de la santé.`,
    },
    questions: [
      ['Combien de minutes par jour l’OMS recommande-t-elle aux 5-17 ans ?', ['60 minutes', '10 minutes', '5 minutes', '3 heures'], 0, 'L’OMS recommande 60 minutes d’activité modérée à soutenue chaque jour pour les jeunes.'],
      ['Quelle recommandation hebdomadaire vaut pour les adultes ?', ['150 à 300 minutes', '15 minutes', '600 minutes', 'Aucune'], 0, 'L’OMS vise 150 à 300 minutes d’activité modérée par semaine chez l’adulte.'],
      ['Que désigne la sédentarité ?', ['Le temps passé assis ou allongé éveillé', 'Le fait de pratiquer un sport de salon', 'Le manque de sommeil', 'Une maladie du cœur'], 0, 'La sédentarité, c’est le temps passé assis ; elle se distingue de l’inactivité physique.'],
      ['Faire une heure de sport suffit à annuler les effets d’une journée entière passée assise.', ['Vrai', 'Faux'], 1, 'Sédentarité et inactivité sont deux risques distincts : on peut faire du sport et rester trop assis le reste du temps.'],
      ['Selon l’ANSES (2020), quelle part des 11-17 ans présente un risque sanitaire préoccupant en France ?', ['Deux tiers', 'Un sur dix', 'Aucun', 'Tous'], 0, 'Trop d’écrans et pas assez d’activité : deux tiers des 11-17 ans sont concernés.'],
      ['Que permet la loi de 2016, en vigueur en 2017 ?', ['Qu’un médecin prescrive de l’activité physique adaptée', 'D’interdire le sport aux malades', 'De supprimer l’EPS', 'De financer les Jeux'], 0, 'C’est le « sport sur ordonnance » : l’activité physique adaptée devient une prescription médicale.'],
      ['Que sont les Maisons Sport-Santé, créées à partir de 2019 ?', ['Des lieux qui accompagnent le retour à la pratique sportive', 'Des hôpitaux de sport', 'Des clubs de haut niveau', 'Des écoles spécialisées'], 0, 'Elles orientent et conseillent ceux qui veulent se remettre à l’activité physique, avec un suivi.'],
      ['Depuis 2022, que prévoit l’école primaire en matière d’activité physique ?', ['30 minutes d’activité physique quotidienne', 'Une heure de sport par mois', 'La suppression de la récréation', 'Un examen de sport'], 0, 'Les 30 minutes quotidiennes visent à faire du mouvement un réflexe dès le plus jeune âge.'],
      ['Quelle année a vu l’activité physique déclarée grande cause nationale ?', ['2024', '1995', '2030', '1968'], 0, 'En 2024, année des Jeux de Paris, l’activité physique a été déclarée grande cause nationale.'],
      ['Où l’OMS classe-t-elle l’inactivité physique parmi les facteurs de risque de mortalité ?', ['Parmi les premiers', 'Tout en bas', 'Elle ne la classe pas', 'Après la météo'], 0, 'L’inactivité physique figure parmi les premiers facteurs de risque de mortalité dans le monde.'],
      ['Le sport sur ordonnance, c’est de l’activité physique adaptée à l’état de santé de chacun.', ['Vrai', 'Faux'], 0, 'L’activité est dosée et encadrée pour permettre de progresser sans danger.'],
    ],
  },
  {
    titre: 'Le sport comme fait social',
    axe: 'Le sport dans la société',
    lecon: {
      titre: 'Le stade comme miroir',
      cours: `Un soir de match, un stade entier chante le même hymne. Quelques rangs plus haut, des supporters brandissent des écharpes. Dehors, des familles regardent l’écran. Le sport n’est pas seulement un geste : c’est un **miroir de la société**, avec ses fiertés, ses inégalités, ses tensions.

## Le sport comme institution
Les sociologues étudient le sport comme une **institution** (avec ses règles, ses fédérations), une **économie** (billetterie, droits télé, équipementiers) et un **discours** (les valeurs qu’on lui attribue : effort, mérite, dépassement).

## Elias : canaliser la violence
Le sociologue **Norbert Elias** a décrit un « **processus de civilisation** » : au fil des siècles, la violence a été peu à peu contrôlée. Le sport en est une illustration. Un match de rugby est violent, mais **réglementé**, encadré par un arbitre : on se bat sans se blesser gravement. Le sport canalise la violence.

## Bourdieu : des sports de classes ?
En **1978**, **Pierre Bourdieu** a montré que les pratiques sportives se distribuent selon les **classes sociales**.

| Plutôt lié aux classes aisées | Plutôt lié aux classes populaires |
| golf, tennis, équitation | boxe, football |

Le choix d’un sport dit quelque chose du milieu : coût, lieux de pratique, codes. Cette lecture est ancienne et discutée : les pratiques ont évolué, mais elle donne une grille pour comprendre.

## Identité et nation
Le sport fabrique du **collectif**. Les **hymnes** chantés avant le coup d’envoi, le **haka** des All Blacks néo-zélandais, les **deux étoiles** sur le maillot des Bleus après les titres de champion du monde (1998 et 2018) : ce sont des signes d’appartenance.

## Supporters et violence
Les supporters donnent au sport son ambiance. Les **ultras** organisent chants et animations ; une minorité dérape. Deux drames ont marqué l’histoire : le **Heysel** (**1985**, Belgique) et **Hillsborough** (**1989**, Angleterre), qui ont conduit à renforcer la sécurité dans les stades.

> Le stade est un espace où la société se montre telle qu’elle est : solidaire, fière, mais aussi inégale et parfois violente.

## Inclusion : handisport et égalité
Les **Jeux paralympiques** sont nés de la compétition de **Stoke Mandeville** en **1948**, pour des blessés de guerre, et la première édition officielle a eu lieu à **Rome en 1960**. Le sport peut aussi faire progresser l’égalité entre femmes et hommes, même si les femmes ont longtemps été exclues de nombreuses disciplines.

!> En 2023-2024, le port du **hijab** en compétition a nourri un débat sur la **laïcité** et l’égalité d’accès au sport, avec des positions différentes selon les fédérations et les institutions.

## L’olympisme, idéal et vitrine
L’idéal olympique parle de paix et de fraternité ; les Jeux sont aussi une **vitrine** politique et économique. Le **dopage** apparaît alors comme un symptôme de la pression à gagner.

## Sport et environnement
Fabriquer de la **neige artificielle** pour les stations, multiplier les **déplacements** pour les compétitions : le sport laisse une empreinte écologique, et pose la question de son avenir.

## À retenir
- Le sport est une institution, une économie et un discours : il reflète la société.
- Elias y voit la violence canalisée, Bourdieu des pratiques liées aux classes sociales (1978).
- Identité, supporters, inclusion paralympique, laïcité et environnement montrent un sport au cœur des débats.`,
    },
    questions: [
      ['Quel sociologue parle d’un « processus de civilisation » où le sport canalise la violence ?', ['Norbert Elias', 'Pierre Bourdieu', 'Émile Durkheim', 'Pierre de Coubertin'], 0, 'Elias montre que la violence est peu à peu contrôlée, le sport en étant une forme réglementée.'],
      ['En quelle année Pierre Bourdieu a-t-il publié son analyse des sports et des classes sociales ?', ['1978', '1898', '1948', '2008'], 0, 'En 1978, il a montré que les pratiques sportives varient selon l’origine sociale.'],
      ['Selon Bourdieu, quels sports sont plutôt associés aux classes aisées ?', ['Golf, tennis, équitation', 'Boxe, football', 'Lutte, pétanque', 'Aucun sport'], 0, 'Golf, tennis et équitation sont classiquement associés aux classes aisées, boxe et football aux classes populaires.'],
      ['Le haka est…', ['une danse rituelle des All Blacks avant les matchs', 'un type de ballon', 'une règle de hors-jeu', 'un trophée'], 0, 'Le haka des All Blacks néo-zélandais est un signe d’identité collective.'],
      ['Que représentent les deux étoiles sur le maillot des Bleus ?', ['Les deux titres de champion du monde (1998 et 2018)', 'Deux Jeux olympiques', 'Deux Coupes d’Europe', 'Deux sélectionneurs'], 0, 'Elles rappellent les deux victoires en Coupe du monde, en 1998 et en 2018.'],
      ['Quels drames de stade ont marqué 1985 et 1989 ?', ['Heysel et Hillsborough', 'Wembley et Maracanã', 'Roland-Garros et Bercy', 'Munich et Montréal'], 0, 'Le Heysel (1985) et Hillsborough (1989) ont poussé à renforcer la sécurité des stades.'],
      ['D’où sont nés les Jeux paralympiques ?', ['De la compétition de Stoke Mandeville en 1948', 'D’un congrès à Paris en 1900', 'Des Jeux de Rome en 1896', 'D’un match de rugby en 1920'], 0, 'Elle réunissait des blessés de guerre ; la première édition officielle a eu lieu à Rome en 1960.'],
      ['Où a eu lieu la première édition officielle des Jeux paralympiques ?', ['À Rome, en 1960', 'À Paris, en 1924', 'À Londres, en 1908', 'À Tokyo, en 2021'], 0, 'Rome a accueilli les premiers Jeux paralympiques officiels en 1960.'],
      ['Le sport reste étranger aux débats politiques et sociaux.', ['Vrai', 'Faux'], 1, 'Laïcité, égalité femmes-hommes, environnement, violence : le sport est au cœur de nombreux débats.'],
      ['Le dopage peut être vu comme un symptôme de…', ['la pression à gagner', 'la baisse du nombre de pratiquants', 'la fermeture des stades', 'l’absence d’arbitres'], 0, 'Quand l’enjeu devient énorme, certains sont tentés de tricher : le dopage révèle cette pression.'],
      ['Les sociologues étudient le sport comme institution, économie et discours.', ['Vrai', 'Faux'], 0, 'Fédérations et règles, argent et médias, valeurs attribuées au sport : trois façons de le lire.'],
      ['Quel est l’impact environnemental évoqué dans le sport ?', ['La neige artificielle et les déplacements', 'Le bruit des chaussures', 'La couleur des maillots', 'Le nombre de spectateurs'], 0, 'Produire de la neige artificielle et multiplier les voyages laisse une empreinte écologique.'],
    ],
  },
  {
    titre: 'L’olympisme : valeurs, Paris 2024 et l’héritage',
    axe: 'Le sport dans la société',
    lecon: {
      titre: 'Qu’est-ce qui reste quand la flamme s’éteint ?',
      cours: `Le 26 juillet 2024, la cérémonie d’ouverture des Jeux de Paris ne se tient pas dans un stade, mais sur la Seine. Quelques semaines plus tard, la flamme s’éteint. Mais que reste-t-il d’un tel événement ? C’est la grande question de l’**héritage olympique**.

## La Charte et les valeurs
La **Charte olympique** est le texte qui fixe les principes du mouvement olympique. Trois valeurs en forment le cœur.

| Valeur | Ce qu’elle dit |
| **Excellence** | donner le meilleur de soi, pas seulement gagner |
| **Amitié** | rapprocher des peuples par le sport |
| **Respect** | respecter les règles, les adversaires, soi-même |

La **trêve olympique**, appuyée par une résolution de l’ONU, appelle à suspendre les conflits pendant les Jeux. Son application reste incertaine, mais l’idée est puissante.

## L’Agenda 2020 : des Jeux moins chers
Face à des Jeux de plus en plus coûteux, le CIO a adopté l’**Agenda 2020** : des Jeux **moins chers**, qui **réutilisent des sites existants** plutôt que de tout construire.

## Paris 2024 en chiffres
| Donnée | Valeur |
| Sites existants ou temporaires | environ **95 %** |
| Athlètes | environ **10 500** |
| Parité | autant de places pour les femmes que pour les hommes |
| Billetterie paralympique | un **record** de ventes |

> Un bon héritage se prépare avant les Jeux : on ne construit que ce dont on se servira ensuite.

## L’héritage concret
- **La Seine** : après de gros travaux, la baignade y est de nouveau possible, rendue au public en **2025**.
- **Le village olympique** : devenu un **quartier de logements** à Saint-Denis, Saint-Ouen et L’Île-Saint-Denis.
- **Le centre aquatique de Saint-Denis**, ouvert aux habitants et aux clubs.
- Des **piscines** de quartier créées ou rénovées.

## Les controverses
Un événement de cette taille suscite aussi des critiques.
- Le **coût** et la question de qui paie.
- Les mesures de **sécurité**, très lourdes.
- Les **délogements** de personnes vivant en précarité signalés avant les Jeux.

!> Savoir citer les bénéfices ET les critiques est la marque d’une réflexion solide, au bac comme au Grand oral.

## La suite
Après Paris, les prochains rendez-vous sont **Milan-Cortina 2026** (Jeux d’hiver), **Los Angeles 2028** et les **Alpes françaises 2030** (Jeux d’hiver). Chaque ville devra faire sa propre réponse à la question de l’héritage.

## Ton avis compte
Si tu devais juger les Jeux de Paris, quels critères retiendrais-tu ? Le coût, les valeurs, les équipements laissés aux habitants, l’image du pays ? Aucune réponse n’est unique, mais chacune doit s’appuyer sur des faits.

## À retenir
- Les trois valeurs olympiques sont l’excellence, l’amitié et le respect ; la trêve olympique appelle à suspendre les conflits.
- Paris 2024 : environ 95 % de sites existants ou temporaires, environ 10 500 athlètes, la parité et un record de billetterie paralympique.
- L’héritage (Seine, village, centre aquatique, piscines) s’accompagne de controverses sur le coût, la sécurité et les délogements.`,
    },
    questions: [
      ['Quelles sont les trois valeurs olympiques ?', ['Excellence, amitié, respect', 'Force, vitesse, endurance', 'Gloire, argent, victoire', 'Patrie, honneur, courage'], 0, 'La Charte olympique place l’excellence, l’amitié et le respect au cœur du mouvement.'],
      ['Que demande la trêve olympique ?', ['Suspendre les conflits pendant les Jeux', 'Arrêter le championnat de football', 'Supprimer les médailles', 'Interdire les spectateurs'], 0, 'Appuyée par une résolution de l’ONU, la trêve invite à suspendre les conflits pendant les Jeux.'],
      ['Quel est l’objectif de l’Agenda 2020 du CIO ?', ['Des Jeux moins chers qui réutilisent des sites existants', 'Construire plus de stades neufs', 'Doubler le nombre d’épreuves', 'Supprimer les Jeux d’hiver'], 0, 'Face aux coûts, le CIO a voulu limiter les constructions nouvelles.'],
      ['Quelle part approximative des sites de Paris 2024 était existante ou temporaire ?', ['95 %', '10 %', '50 %', '0 %'], 0, 'Environ 95 % des sites étaient existants ou temporaires, ce qui limitait les constructions.'],
      ['Combien d’athlètes ont participé à Paris 2024 environ ?', ['10 500', '500', '2 000', '50 000'], 0, 'Environ 10 500 athlètes ont pris part aux Jeux, à parité entre femmes et hommes.'],
      ['Que montre la billetterie paralympique de Paris 2024 ?', ['Un record de ventes', 'Un échec complet', 'Aucune vente', 'Une gratuité'], 0, 'La billetterie paralympique a battu un record.'],
      ['Où le village olympique est-il devenu un quartier de logements ?', ['À Saint-Denis, Saint-Ouen et L’Île-Saint-Denis', 'À Marseille', 'À Bordeaux', 'À Lille'], 0, 'Le village a été conçu pour devenir un quartier après les Jeux.'],
      ['Qu’est-ce qui a été rendu à la baignade en 2025 ?', ['La Seine', 'Le canal du Midi', 'Le Rhin', 'La Loire'], 0, 'Après de lourds travaux, la baignade dans la Seine est de nouveau possible.'],
      ['Les Jeux olympiques ne suscitent jamais aucune critique.', ['Vrai', 'Faux'], 1, 'Coût, sécurité et délogements ont suscité des controverses autour de Paris 2024.'],
      ['Quelle ville accueillera les Jeux d’été de 2028 ?', ['Los Angeles', 'Londres', 'Tokyo', 'Sydney'], 0, 'Los Angeles organise les Jeux d’été de 2028.'],
      ['Les Jeux d’hiver de 2030 sont prévus dans les Alpes françaises.', ['Vrai', 'Faux'], 0, 'Après Milan-Cortina en 2026, les Alpes françaises sont les hôtes de 2030.'],
      ['Pourquoi dit-on qu’un bon héritage se prépare avant les Jeux ?', ['Parce qu’on ne construit que ce dont on se servira ensuite', 'Parce que les Jeux sont gratuits', 'Parce qu’il faut éviter tout spectateur', 'Parce que l’héritage est toujours automatique'], 0, 'Penser l’usage après l’événement évite les équipements inutiles et coûteux.'],
    ],
  },
  {
    titre: 'Les métiers du sport et la filière STAPS',
    axe: 'Le sport dans la société',
    lecon: {
      titre: 'Cinq portraits de métiers',
      cours: `Inès veut vivre du sport sans forcément être championne. Elle hésite entre professeure d’EPS, préparatrice physique et organisatrice d’événements. Bonne nouvelle : le sport, c’est aussi un **vaste secteur d’emploi**. Il suffit de trouver la bonne porte.

## STAPS : la grande filière
**STAPS** signifie sciences et techniques des activités physiques et sportives. La licence STAPS se décline en **cinq mentions** :

| Mention | Pour quoi faire |
| **Entraînement sportif** | devenir entraîneur, préparateur physique |
| **Activité physique adaptée et santé** | accompagner des personnes malades, âgées, handicapées |
| **Éducation et motricité** | enseigner, former |
| **Management du sport** | gérer clubs, événements, structures |
| **Ergonomie du sport et performance motrice** | analyser le geste, concevoir le matériel |

Sur Parcoursup, les attentes portent sur trois champs : les **sciences** (biologie, physique), l’**expression** (écrit, oral) et la **pratique** sportive. Il ne suffit donc pas d’être sportif.

## Portrait 1 : professeur d’EPS
On passe par un **master MEEF**, puis on prépare le **CAPEPS**, le concours qui mène au métier.

## Portrait 2 : entraîneur
Le ministère des Sports délivre des diplômes : le **BPJEPS**, le **DEJEPS** et le **DESJEPS**, de plus en plus élevés, pour animer, entraîner et diriger.

## Portrait 3 : kinésithérapeute
Soigner et rééduquer. L’accès passe par différentes voies selon les universités (**PASS**, **LAS**, ou une première année de STAPS dans certains cas) : il faut vérifier auprès de l’établissement visé.

> Chaque métier a son diplôme : commence par le métier qui t’attire, puis remonte vers la formation.

## Portrait 4 : préparateur physique et analyste de données
Le **préparateur physique** construit la condition physique des sportifs. L’**analyste de données** exploite les chiffres (GPS, capteurs, statistiques) pour éclairer les décisions de l’entraîneur : un métier qui monte.

## Portrait 5 : organisateur d’événements, journaliste, industrie
- **Organisateur d’événements** : coordonne logistique, sécurité, communication.
- **Journaliste sportif** : raconte, analyse, filme.
- **Industrie** : les équipementiers conçoivent chaussures, maillots, matériel.

## Sportif de haut niveau : un statut, des aménagements
Un jeune sportif de haut niveau peut bénéficier d’**aménagements scolaires** (horaires, examens, soutien) pour concilier études et entraînements. Les pôles et sections permettent de ne pas sacrifier l’un à l’autre.

## Un secteur qui emploie
Le sport représente en France **plusieurs centaines de milliers d’emplois** : enseignement, clubs, salles de sport, événementiel, industrie, médias.

!> Beaucoup de métiers exigent un diplôme précis : vérifie toujours les conditions d’accès sur le site officiel de la formation avant de te décider.

## Choisir pour toi
Pose-toi trois questions : qu’est-ce que j’aime faire ? avec qui ? dans quel cadre (terrain, bureau, hôpital) ? Les réponses orienteront ta formation.

## À retenir
- La licence STAPS compte cinq mentions et attend des sciences, de l’expression et de la pratique.
- Professeur d’EPS (master MEEF et CAPEPS), entraîneur (BPJEPS, DEJEPS, DESJEPS), préparateur, analyste, organisateur… : les portes sont nombreuses.
- Les sportifs de haut niveau bénéficient d’aménagements scolaires ; le secteur emploie plusieurs centaines de milliers de personnes.`,
    },
    questions: [
      ['Que signifie STAPS ?', ['Sciences et techniques des activités physiques et sportives', 'Sport, théâtre, arts, philosophie et santé', 'Stages techniques d’athlétisme et de sport', 'Sciences, technologies, arts, pratique et sport'], 0, 'STAPS regroupe les formations universitaires consacrées aux activités physiques et sportives.'],
      ['Combien de mentions compte la licence STAPS ?', ['Cinq', 'Deux', 'Douze', 'Une seule'], 0, 'Entraînement, activité physique adaptée et santé, éducation et motricité, management, ergonomie : cinq mentions.'],
      ['Quelle mention convient à qui veut gérer un club ou un événement ?', ['Management du sport', 'Entraînement sportif', 'Éducation et motricité', 'Ergonomie du sport'], 0, 'Management du sport forme aux métiers de la gestion des structures et événements.'],
      ['Quels trois champs les attentes Parcoursup pour STAPS mettent-elles en avant ?', ['Sciences, expression, pratique', 'Chant, cuisine, dessin', 'Droit, commerce, langues', 'Danse, théâtre, musique'], 0, 'Il faut des bases scientifiques, savoir s’exprimer et avoir une pratique sportive.'],
      ['Par quel concours devient-on professeur d’EPS ?', ['Le CAPEPS', 'Le BAFA', 'Le brevet', 'Le permis'], 0, 'Après un master MEEF, le CAPEPS ouvre l’accès au métier d’enseignant d’EPS.'],
      ['Quel diplôme du ministère des Sports permet notamment d’animer et d’entraîner, avant le DEJEPS ?', ['Le BPJEPS', 'Le DESJEPS', 'Le CAP', 'Le DUT'], 0, 'Le BPJEPS précède le DEJEPS puis le DESJEPS dans les diplômes pour animer, entraîner et diriger.'],
      ['L’accès aux études de kinésithérapie est identique partout.', ['Vrai', 'Faux'], 1, 'Selon les universités, on passe par PASS, LAS ou parfois une première année de STAPS : il faut vérifier auprès de l’établissement.'],
      ['Que fait un analyste de données dans le sport ?', ['Il exploite les chiffres pour éclairer les décisions de l’entraîneur', 'Il arbitre les matchs', 'Il soigne les blessés', 'Il fabrique les ballons'], 0, 'GPS, capteurs et statistiques sont analysés pour guider l’entraînement.'],
      ['Que peut obtenir un jeune sportif de haut niveau pour ses études ?', ['Des aménagements scolaires', 'Une dispense de bac', 'La suppression des examens', 'Un diplôme automatique'], 0, 'Horaires, examens, soutien : on adapte la scolarité sans la sacrifier.'],
      ['Le sport représente en France…', ['plusieurs centaines de milliers d’emplois', 'moins de cent emplois', 'aucun emploi', 'seulement des bénévoles'], 0, 'Enseignement, clubs, événementiel, industrie, médias : le secteur emploie beaucoup de monde.'],
      ['Pour travailler dans le sport, il faut forcément être champion.', ['Vrai', 'Faux'], 1, 'Il existe de nombreux métiers autour du sport, du management à la santé en passant par l’industrie.'],
      ['Quelle bonne méthode pour choisir sa formation ?', ['Partir du métier qui attire puis remonter vers la formation', 'Choisir au hasard', 'Suivre uniquement ses amis', 'Ignorer les conditions d’accès'], 0, 'Chaque métier a son diplôme : on identifie d’abord ce qu’on veut faire.'],
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
  {
    titre: 'L’option EPS et la spécialité EPPCS',
    axe: 'L’évaluation au baccalauréat',
    lecon: {
      titre: 'Est-ce pour moi ?',
      cours: `Tu aimes le sport, mais pas seulement pour y jouer : tu voudrais comprendre comment le corps s’entraîne, pourquoi le sport fascine, ce qu’il dit de la société. Le lycée t’offre justement deux chemins pour aller plus loin que l’EPS commune : l’**option EPS** et la **spécialité EPPCS**. Reste à savoir lequel te convient.

## L’option EPS : plus de pratique, plus de réflexion
L’**enseignement optionnel d’EPS** s’étend de la 2de à la Tle, à raison de **3 heures par semaine**, selon un programme de **2019**. Son but : **approfondir la pratique** et **réfléchir sur le sport**. Elle compte en **contrôle continu**.

| Élément | Option EPS |
| Durée | de la 2de à la Tle |
| Horaire | 3 heures par semaine |
| Ce qu’on y fait | pratiquer davantage et réfléchir sur le sport |
| Évaluation | contrôle continu |

## La spécialité EPPCS : une vraie matière de culture sportive
La spécialité **« Éducation physique, pratiques et culture sportives »**, ou **EPPCS**, a été créée en **2021**. C’est une spécialité à part entière, qu’on choisit en 1re parmi les autres.

| Élément | EPPCS |
| Horaire en 1re | 4 heures par semaine |
| Horaire en Tle | 6 heures par semaine |
| Épreuve terminale | un écrit et une partie pratique |

> L’option approfondit ta pratique ; la spécialité en fait une discipline de culture, avec des sciences, de l’histoire, de la sociologie et des projets.

## Ce qu’on y apprend
En EPPCS, on étudie :
- les **sciences du sport** : physiologie, entraînement, biomécanique ;
- l’**histoire** du sport et de ses grandes évolutions ;
- la **sociologie** : le sport dans la société, les inégalités, les identités ;
- un **projet collectif** qui mêle pratique et réflexion.

Tu retrouves, en plus structuré, une grande partie de ce que ces fiches abordent : périodisation, récupération, olympisme, santé publique.

## Pour qui ?
L’EPPCS s’adresse à celles et ceux qui aiment **à la fois** pratiquer et réfléchir, et qui visent souvent des études comme **STAPS**, kinésithérapie, éducation, management du sport. Ce n’est pas un cours de sport en plus : il y a de l’**écrit**, des notions à maîtriser.

!> Choisir EPPCS, c’est accepter de travailler comme dans une matière théorique : prends le temps de consulter le programme officiel et de demander conseil à tes professeurs d’EPS.

## Les structures autour du sport au lycée
- Les **sections sportives scolaires** permettent de s’entraîner davantage pendant les heures de classe.
- Les **pôles espoirs** accueillent des jeunes à fort potentiel.
- Le **sport-études** organise une scolarité adaptée aux entraînements.
- Les **aménagements pour sportif de haut niveau** (horaires, examens) existent pour concilier études et carrière.

## Et le Grand oral ?
Avec l’EPPCS, tu peux choisir une spécialité sportive comme point d’appui pour ton **Grand oral** : un sujet sur la récupération, l’olympisme ou la santé publique devient un terrain naturel.

## Se poser les bonnes questions
Aimes-tu écrire autant que courir ? Veux-tu travailler en projet avec d’autres ? Vises-tu des études liées au sport ? Si tu réponds oui, l’EPPCS mérite ton attention. Sinon, l’option EPS ou la seule EPS commune peuvent déjà t’apporter beaucoup.

## À retenir
- L’option EPS (3 h par semaine de la 2de à la Tle, programme 2019) approfondit la pratique et la réflexion, et compte en contrôle continu.
- La spécialité EPPCS (créée en 2021, 4 h en 1re, 6 h en Tle) associe sciences du sport, histoire, sociologie et projet, avec écrit et pratique.
- Sections sportives, pôles espoirs, sport-études et aménagements aident à concilier études et haut niveau.`,
    },
    questions: [
      ['Combien d’heures par semaine compte l’enseignement optionnel d’EPS ?', ['3 heures', '1 heure', '10 heures', '30 minutes'], 0, 'L’option EPS représente 3 heures par semaine, de la 2de à la Tle.'],
      ['Comment l’option EPS est-elle évaluée au bac ?', ['En contrôle continu', 'Par un oral final uniquement', 'Elle n’est pas évaluée', 'Par un écrit de quatre heures'], 0, 'L’option EPS compte en contrôle continu.'],
      ['En quelle année a été créée la spécialité EPPCS ?', ['2021', '1998', '2005', '2030'], 0, 'La spécialité « Éducation physique, pratiques et culture sportives » date de 2021.'],
      ['Que signifie EPPCS ?', ['Éducation physique, pratiques et culture sportives', 'Éducation populaire pour les clubs sportifs', 'Entraînement, performance, préparation et compétition sportive', 'Équipement physique, pédagogie et conseil sportif'], 0, 'EPPCS désigne la spécialité mêlant pratique et culture du sport.'],
      ['Combien d’heures par semaine compte l’EPPCS en terminale ?', ['6 heures', '1 heure', '20 heures', '2 heures'], 0, 'La spécialité compte 4 heures en 1re et 6 heures en Tle.'],
      ['Que comprend l’épreuve terminale d’EPPCS ?', ['Un écrit et une partie pratique', 'Un écrit seulement', 'Un oral seulement', 'Aucune épreuve'], 0, 'Elle associe un écrit et une partie pratique.'],
      ['Que trouve-t-on dans le programme de l’EPPCS ?', ['Sciences du sport, histoire, sociologie, projet collectif', 'Uniquement du football', 'Seulement des règles', 'Rien de théorique'], 0, 'L’EPPCS mêle pratique, culture et réflexion : sciences, histoire, sociologie et projet.'],
      ['L’EPPCS est un cours de sport supplémentaire sans aucun écrit.', ['Vrai', 'Faux'], 1, 'Il y a de l’écrit et des notions à maîtriser, comme dans une matière théorique.'],
      ['À quelles études l’EPPCS peut-elle préparer ?', ['STAPS, kinésithérapie, éducation, management du sport', 'Uniquement la médecine', 'Uniquement le droit', 'Aucune étude'], 0, 'Elle s’adresse souvent à ceux qui visent un métier lié au sport.'],
      ['Que permettent les sections sportives scolaires ?', ['S’entraîner davantage pendant la scolarité', 'Supprimer les cours', 'Quitter le lycée', 'Éviter les examens'], 0, 'Elles proposent plus d’entraînement sur le temps scolaire.'],
      ['Les pôles espoirs accueillent des jeunes à fort potentiel sportif.', ['Vrai', 'Faux'], 0, 'Ils réunissent des jeunes prometteurs avec un entraînement structuré et une scolarité adaptée.'],
      ['Comment l’EPPCS peut-elle aider pour le Grand oral ?', ['Elle fournit des sujets sportifs solides, comme la récupération ou l’olympisme', 'Elle dispense de le passer', 'Elle impose le sujet', 'Elle supprime le jury'], 0, 'Les notions travaillées servent de terrain pour construire un Grand oral argumenté.'],
    ],
  },
]

// Les identifiants des chapitres de CE bloc, sur ses deux niveaux : tout
// chapitre de Sport de ces niveaux qui n'en fait pas partie est un chapitre de
// l'ancienne matière, et part.
const ids = NIVEAUX.flatMap((niveau) => chapitres.map((ch) => uuid(`sport|${niveau}|${ch.titre}`)))
const listeIds = ids.map((id) => `'${id}'::uuid`).join(', ')
const listeNiveaux = NIVEAUX.map((n) => `'${n}'`).join(', ')

export default {
  slug: 'sport',
  nom: 'Sport',

  titreMigration: 'SPORT Tle — « PERFORMER », LA CULTURE SPORTIVE (10 fiches)',

  motif: `LA MATIÈRE SPORT EST REFAITE EN CULTURE SPORTIVE (14/10/2026, Lucas :
« on va s'écarter du programme : l'histoire du sport, notamment de la France,
les fondamentaux — hypertrophie, force, endurance, récupération, anti-blessure »).
Les 8 fiches du programme officiel (champs d'apprentissage, rôles sociaux…),
identiques de la 6e à la 3e, n'intéressaient personne : rien à réviser pour un
écrit, et la langue de l'institution. Cadrage : docs/CADRAGE-SPORT.md.
Ce bloc installe 10 fiches sur Tle, et retire les
anciens chapitres de Sport de ce(s) niveau(x) (cascade : leçons, quiz,
questions, cahier, contrôles, déblocages).`,

  menage: [
    {
      raison: `Les anciens chapitres de Sport (Tle) partent — TOUS ceux dont
l'identifiant n'est pas dans ce bloc. Le ménage tourne AVANT les insertions ;
un rejeu ne touche donc jamais aux 10 fiches neuves (ni aux progrès des élèves
dessus). Les niveaux sont bornés à Tle : chaque bloc de la nouvelle
matière fait son propre ménage sur ses niveaux. La cascade (ON DELETE CASCADE
sur chapters) emporte leçons, quiz, questions, exercices, contrôles et
déblocages ; review_items n'a pas de clé étrangère et se vide à la main, et
les QUIZ se suppriment EXPLICITEMENT avant les chapitres : quizzes.lesson_id est en
ON DELETE SET NULL, pas en cascade — sans ce DELETE, les anciens quiz et leurs
questions resteraient orphelins et continueraient de nourrir Coach Turbo
(défaut trouvé au rejeu PGlite du 14/10/2026).`,
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
   AND c.level IN (${listeNiveaux})
   AND c.id NOT IN (${listeIds});

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'sport'
   AND c.level IN (${listeNiveaux})
   AND c.id NOT IN (${listeIds});

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'sport'
   AND c.level IN (${listeNiveaux})
   AND c.id NOT IN (${listeIds});`,
    },
  ],

  blocs: [
    {
      niveaux: NIVEAUX,
      chapitres,
    },
  ],
}
