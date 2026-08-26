// Les conseils du coach, écrits — le volet « Conseils » de l'espace parents.
//
// POURQUOI DU TEXTE ET PAS SEULEMENT DES VIDÉOS. Le volet ne contenait qu'une
// liste de vidéos (`parent_videos`, migration 029) et, comme cette table est
// vide en production, il affichait « Les premières vidéos du programme arrivent
// bientôt » — c'est-à-dire RIEN, à un parent venu chercher de l'aide. Une
// promesse ne rend aucun service, et elle en promet une deuxième à chaque
// visite.
//
// Ces fiches sont du contenu réel, disponible dès la première ouverture, sans
// dépendre d'aucune migration ni d'aucun tournage. Les vidéos, quand elles
// existeront, se posent AU-DESSUS : elles enrichissent le volet, elles ne le
// remplissent plus.
//
// POURQUOI EN DUR ET PAS EN BASE. Ces textes sont de la doctrine produit — ils
// disent comment l'app veut qu'on accompagne un élève, exactement comme les
// seuils de `lib/mastery.ts` disent ce qu'est « maîtrisé ». Ils changent à la
// vitesse du code, pas à celle du contenu : les mettre en base ajouterait une
// migration, une RLS et un écran d'admin pour six paragraphes qu'on relit une
// fois par an.
//
// Chaque fiche renvoie à une MÉCANIQUE de l'app (`ancrage`) : un conseil qui
// ne se rattache à rien de visible dans l'application est un conseil que le
// parent ne peut pas appliquer.

export type ConseilTheme = 'Posture' | 'Méthode' | 'Rythme' | 'Notes'

export type Conseil = {
  id: string
  theme: ConseilTheme
  titre: string
  /** La phrase qui doit suffire si le parent ne déplie pas la fiche. */
  resume: string
  /** Le corps, un paragraphe par entrée. */
  corps: readonly string[]
  /** Ce que le conseil recouvre DANS l'app — le pont entre le dire et le faire. */
  ancrage: string
}

export const CONSEILS: readonly Conseil[] = [
  {
    id: 'sans-faire-a-sa-place',
    theme: 'Posture',
    titre: 'Accompagner sans faire à sa place',
    resume:
      'Votre rôle est de tenir le cadre, pas de donner la réponse — c’est en cherchant que votre enfant apprend.',
    corps: [
      'Quand un exercice bloque, la tentation est d’expliquer. Mais la mémoire ne retient pas ce qu’elle a écouté : elle retient ce qu’elle a eu du mal à retrouver. Un élève à qui l’on donne la réponse aura la sensation d’avoir compris, et sera incapable de refaire l’exercice seul le lendemain.',
      'Trois questions valent mieux qu’une explication : « qu’est-ce que tu as déjà essayé ? », « qu’est-ce qui ressemble à un exercice que tu sais faire ? », « de quoi tu as besoin pour avancer ? ». Elles laissent l’effort du côté de l’élève, qui est le seul endroit où il produit quelque chose.',
      'Si le blocage dure vraiment, mieux vaut passer à autre chose et y revenir le lendemain que d’arracher une réponse dans l’agacement. Une séance qui finit mal coûte plus cher que l’exercice qu’elle n’a pas résolu.',
    ],
    ancrage:
      'Dans l’app, une question ratée revient d’elle-même quelques jours plus tard : votre enfant aura une deuxième chance de la trouver seul.',
  },
  {
    id: 'courbe-de-l-oubli',
    theme: 'Méthode',
    titre: 'Pourquoi réviser en plusieurs fois bat la veille au soir',
    resume:
      'On oublie environ la moitié de ce qu’on apprend en quelques jours — sauf si on y revient au bon moment.',
    corps: [
      'Une heure de révision la veille d’un contrôle et quatre fois quinze minutes réparties sur deux semaines ne coûtent pas le même effort, et ne donnent surtout pas le même résultat. La première produit une note ; la seconde produit une connaissance qui tiendra jusqu’au bac.',
      'La raison est mécanique : chaque fois qu’on retrouve une information qu’on était en train d’oublier, on la réancre plus profondément. Réviser quelque chose qu’on sait encore parfaitement ne sert presque à rien — c’est l’effort de rappel qui compte, pas la relecture.',
      'Concrètement, cela veut dire qu’une session courte et régulière vaut mieux qu’une longue et rare. C’est aussi la meilleure nouvelle à donner à un enfant qui trouve que « réviser prend trop de temps ».',
    ],
    ancrage:
      'C’est le moteur de l’app : elle décide toute seule quelle notion doit revenir quel jour, en fonction de ce que votre enfant a réussi ou raté.',
  },
  {
    id: 'la-serie',
    theme: 'Rythme',
    titre: 'Encourager la série plutôt que la note',
    resume:
      'La régularité est le seul levier sur lequel votre enfant a une prise directe. La note, non.',
    corps: [
      'Féliciter un 17 revient à féliciter un résultat — que l’élève ne contrôle qu’en partie, et qui dépend aussi du sujet, de la fatigue, du barème. Féliciter cinq jours travaillés d’affilée, c’est féliciter un comportement, que l’élève peut refuser ou reproduire à volonté.',
      'C’est un déplacement discret, mais il change tout chez un enfant qui se croit « nul en maths » : la série est une preuve visible qu’il est capable de tenir quelque chose, indépendamment de ce que dit son bulletin.',
      'Le corollaire vaut aussi : une série cassée n’est pas une faute. Elle se relance le lendemain, et le dire à voix haute évite qu’un jour manqué devienne une semaine manquée.',
    ],
    ancrage:
      'La flamme visible en haut de l’écran de votre enfant compte ses jours d’affilée — elle est le chiffre qu’il regarde le plus.',
  },
  {
    id: 'mauvaise-note',
    theme: 'Notes',
    titre: 'Que faire d’une mauvaise note',
    resume:
      'Une note dit ce qui n’est pas su, pas qui est mauvais. La question utile est « qu’est-ce qui a manqué ? ».',
    corps: [
      'Le premier réflexe à éviter est le commentaire global — « tu n’as pas assez travaillé », « tu es distrait ». Il porte sur la personne, il n’indique aucune action, et il est très souvent inexact : beaucoup d’élèves qui ratent un contrôle ont travaillé, mais ont travaillé la mauvaise chose ou de la mauvaise façon.',
      'La question qui fait avancer est plus étroite : sur quelles questions les points sont-ils partis ? Est-ce que c’était le cours qui manquait, la méthode, ou le temps ? Un contrôle raté correctement analysé vaut plus qu’un contrôle réussi de justesse.',
      'Enfin, une mauvaise note est un événement daté. Elle mérite une réaction le jour même et pas trois semaines de rappels : au-delà, ce n’est plus de la correction, c’est de la punition.',
    ],
    ancrage:
      'Le suivi par matière de cet écran vous montre où les points partent réellement — et distingue une matière fragile d’une simple mauvaise journée.',
  },
  {
    id: 'preparer-un-controle',
    theme: 'Méthode',
    titre: 'Préparer un contrôle en trois passages',
    resume:
      'Une préparation utile ne commence pas la veille et ne consiste pas à relire.',
    corps: [
      'Premier passage, une semaine avant : lire le cours et repérer ce qui n’est pas clair. C’est le seul moment où relire sert à quelque chose — pour cartographier, pas pour apprendre.',
      'Deuxième passage, trois ou quatre jours avant : se tester à froid, sans le cours sous les yeux. C’est inconfortable, et c’est exactement ce qui fait la différence : les trous qui apparaissent là sont ceux qui seraient apparus le jour du contrôle.',
      'Troisième passage, la veille : ne reprendre QUE les trous du deuxième passage, puis s’arrêter. Réviser tard le soir ce qui est déjà su enlève du sommeil sans rien ajouter.',
    ],
    ancrage:
      'Quand votre enfant déclare un contrôle dans l’app, elle lui découpe elle-même ces passages en sessions courtes, jour par jour — et vous les voyez dans « Contrôles à venir ».',
  },
  {
    id: 'ecrans-et-devoirs',
    theme: 'Rythme',
    titre: 'Le téléphone, l’app et le temps d’écran',
    resume:
      'Ce n’est pas l’écran qui coûte cher à l’attention, c’est l’interruption. Vingt minutes sans notification valent une heure hachée.',
    corps: [
      'Se remettre dans un exercice après une interruption prend plusieurs minutes. Un travail d’une heure coupé cinq fois ne produit donc pas une heure de travail, mais une trentaine de minutes réelles et beaucoup de fatigue.',
      'La règle la plus simple à tenir n’est pas une limite de durée, mais une règle de lieu : le téléphone ailleurs que sur la table pendant la session. Elle se négocie mieux qu’une interdiction, parce qu’elle a une fin claire.',
      'Utiliser une application pour réviser peut brouiller ce message. Il vaut la peine de le dire explicitement : ce temps-là n’est pas du temps d’écran de loisir, il est du temps de travail — et il se protège comme tel.',
    ],
    ancrage:
      'Le compteur « Moyenne par jour travaillé » de cet écran mesure du temps réellement passé sur les révisions, pas du temps passé l’app ouverte.',
  },
]

// Les thèmes présents, dans l'ordre où ils apparaissent — pour les filtres de
// l'écran, sans les redéclarer à la main (une liste en dur finirait par
// mentionner un thème qu'aucune fiche ne porte, ou en oublier un).
export function conseilThemes(
  conseils: readonly Conseil[] = CONSEILS,
): ConseilTheme[] {
  const vus: ConseilTheme[] = []
  for (const c of conseils) if (!vus.includes(c.theme)) vus.push(c.theme)
  return vus
}
