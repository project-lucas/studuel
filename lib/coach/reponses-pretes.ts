// -----------------------------------------------------------------------------
// LES RÉPONSES TOUTES PRÊTES DE MARCEL — le gros travail fait EN AMONT
// (15/10/2026, Lucas : « voir si un gros travail peut être fait en amont pour
// économiser leur utilisation une fois l'abonnement pris »).
//
// Une bonne part des questions qu'on pose à un prof ne dépend ni du cours ni de
// l'élève : comment réviser un contrôle, comment apprendre une leçon, comment
// gérer le stress, comment s'y prendre pour une dissertation. Les faire écrire
// par le modèle à chaque fois, c'est payer mille fois la même page. Elles sont
// donc écrites ICI, une fois, par nous — relues, justes, dans la voix de Marcel
// — et servies GRATUITEMENT : aucune porte, aucun crédit, aucun appel.
//
// LA PRÉCISION PASSE AVANT LE RAPPEL. Une question précise (« comment réviser
// mon contrôle sur les fractions ») ne doit PAS recevoir la page générale : elle
// part au modèle. D'où trois verrous : seulement le mode « question », seulement
// une question courte (≤ 90 caractères), et des mots-clés qui doivent TOUS être
// là — puis aucun mot de contenu en trop (« fractions » fait sortir).
//
// Logique PURE et testée.
// -----------------------------------------------------------------------------

import { searchKey } from '@/lib/subject-template'

/** Au-delà, la question est assez précise pour mériter le modèle. */
export const LONGUEUR_MAX = 90

/**
 * Un motif : une liste de GROUPES ; chaque groupe doit être présent (un de ses
 * mots suffit). Un mot préfixé par `=` doit être exact (« comment » ne doit
 * pas attraper « commentaire ») ; sinon il vaut comme RACINE (« revis » attrape
 * réviser, révision, révisions).
 */
type Motif = readonly (readonly string[])[]

export type ReponsePrete = {
  id: string
  motifs: readonly Motif[]
  reponse: string
}

/**
 * Les mots qu'une question générale peut contenir sans devenir précise. Tout
 * autre mot de plus de trois lettres (un nom de chapitre, une notion) fait
 * partir la question au modèle.
 */
const MOTS_NEUTRES = new Set(
  (
    'comment quoi pourquoi quand faire fais faut dois peux peut veux aide aider conseil conseils astuce astuces ' +
    'methode methodes bien mieux plus vite rapidement efficace efficacement facilement meilleur meilleure ' +
    'mon mes ma ton tes ta une des les pour avec sans dans sur avant apres est suis etre avoir ai as quel quelle quels quelles ' +
    'prof marcel stp svp merci bonjour salut moi toi vraiment trop tres jamais toujours souvent ' +
    'arrive arriver reussir reussis apprendre retenir reviser revision revisions controle controles interro interros ' +
    'evaluation evaluations examen examens lecon lecons cours fiche fiches organiser organise organisation planning ' +
    'semaine semaines jour jours soir matin temps heure heures minutes stress stresse stressee angoisse angoissee panique ' +
    'peur concentrer concentre concentration distrait distraite telephone portable motivation motive motivee flemme envie ' +
    'memoriser memoire dates date dissertation dissertations commentaire commentaires texte textes brevet bac grand oral ' +
    'francais francaise nuit blanche toute dormir sommeil developpement construit commencer debut debuter rien tout faire ' +
    'bonne bon bons bonnes emploi planifier planifie preparer prepare prepares apprends apprend memorise memoriser ' +
    'travail travailler devoir devoirs eval tiktok reseaux arrete arreter galere galerer stresser vais'
  ).split(' '),
)

function mots(question: string): string[] {
  return searchKey(question).split(' ').filter(Boolean)
}

function present(tokens: readonly string[], mot: string): boolean {
  if (mot.startsWith('=')) return tokens.includes(mot.slice(1))
  if (mot.includes(' ')) return ` ${tokens.join(' ')} `.includes(` ${mot} `)
  return tokens.some((t) => t.startsWith(mot))
}

function correspond(tokens: readonly string[], motif: Motif): boolean {
  return motif.every((groupe) => groupe.some((m) => present(tokens, m)))
}

const REVISER = ['revis', 'prepar']
const CONTROLE = ['control', 'interro', 'evaluation', '=eval', '=ds']

export const REPONSES_PRETES: readonly ReponsePrete[] = [
  {
    id: 'reviser-controle',
    motifs: [[REVISER, CONTROLE]],
    reponse: [
      '## La méthode en trois temps',
      '- J-5 : relis le cours une fois, puis fais le quiz de chaque chapitre du contrôle.',
      '- J-3 : reprends seulement ce que tu as raté, avec la fiche, puis refais le quiz.',
      '- J-1 : une dernière série de questions, et au lit tôt.',
      '## Le piège',
      '- Relire dix fois sans se tester donne l’impression de savoir. Se tester, c’est ce qui fait retenir.',
      'Ajoute ton contrôle dans Réviser : je te prépare les séances jour par jour. Il porte sur quels chapitres ?',
    ].join('\n'),
  },
  {
    id: 'apprendre-lecon',
    motifs: [[['apprend', 'retenir', 'memoris'], ['lecon', 'cours', 'par coeur']]],
    reponse: [
      '## Apprendre une leçon, vraiment',
      '- Lis-la une fois en entier, sans rien noter, pour comprendre de quoi elle parle.',
      '- Cache-la et écris de mémoire ce dont tu te souviens : les trous te disent quoi relire.',
      '- Le lendemain, recommence sans regarder. Puis trois jours plus tard.',
      'C’est la répétition espacée : c’est exactement ce que fait ta file « À revoir ». Tu veux que je t’interroge sur une leçon ?',
    ].join('\n'),
  },
  {
    id: 'faire-fiche',
    motifs: [[['=comment', 'method', 'conseil'], ['=fiche', '=fiches']], [['faire', 'fais', 'ecrire'], ['=une', '=des', '=mes', '=ma'], ['=fiche', '=fiches'], ['=bonne', 'bien']]],
    reponse: [
      '## Une bonne fiche tient sur une page',
      '- Un titre, puis trois à cinq parties : les idées du cours, pas ses phrases.',
      '- Seulement ce qu’il faut RETENIR : définitions, dates, formules, exemples types.',
      '- Une case « pièges » : ce que tu confonds toujours.',
      '- Écris-la à la main ou de mémoire : c’est en la faisant qu’on apprend.',
      'Studuel a déjà une fiche pour chaque chapitre. Tu veux que je te dise par où commencer la tienne ?',
    ].join('\n'),
  },
  {
    id: 'organiser',
    motifs: [[['organis', 'planning', 'emploi du temps', 'planifi'], REVISER.concat(['travail', 'devoir'])]],
    reponse: [
      '## S’organiser sans y passer des heures',
      '- Un créneau fixe par jour, même court : 20 minutes tous les jours valent mieux que 3 heures le dimanche.',
      '- Commence par ce qui tombe le plus tôt (les contrôles), puis ce qui est le plus fragile.',
      '- Une seule matière par séance, téléphone dans une autre pièce.',
      'Ta mission du jour fait déjà ce tri pour toi. Tu as des contrôles dans les jours qui viennent ?',
    ].join('\n'),
  },
  {
    id: 'concentration',
    motifs: [[['concentr', 'distrait', 'telephone', 'portable', 'tiktok']]],
    reponse: [
      '## Rester concentré',
      '- Téléphone hors de la pièce, ou en mode avion : le simple fait de le voir coûte de l’attention.',
      '- Travaille 25 minutes, puis 5 minutes de pause. Recommence.',
      '- Commence par la tâche la plus courte : se lancer est le plus dur.',
      'On fait un essai maintenant ? Choisis un chapitre et je t’interroge pendant 10 minutes.',
    ].join('\n'),
  },
  {
    id: 'stress',
    motifs: [[['stress', 'angoiss', 'panique', '=peur']]],
    reponse: [
      '## Le stress avant une épreuve',
      '- C’est normal, et un peu de stress aide à se concentrer.',
      '- Ce qui le fait baisser le plus : s’être entraîné dans les conditions de l’épreuve. On sait alors à quoi s’attendre.',
      '- Le jour J : respire lentement, quatre secondes pour inspirer, six pour expirer, trois fois.',
      '- Commence par l’exercice que tu sais faire.',
      'Si le stress t’empêche de dormir ou de manger, parles-en à un adulte de confiance. Tu veux qu’on fasse une épreuve blanche ensemble ?',
    ].join('\n'),
  },
  {
    id: 'dates',
    motifs: [[['retenir', 'memoris', 'apprend'], ['=dates', '=date']]],
    reponse: [
      '## Retenir des dates',
      '- Accroche chaque date à une image ou à une histoire : une date seule ne tient pas.',
      '- Range-les sur une frise : on retient mieux un ordre qu’une liste.',
      '- Peu à la fois : cinq dates par jour, revues le lendemain.',
      'Le jeu « Frise folle » de l’arène t’entraîne exactement à ça. Tu as quelles dates à apprendre ?',
    ].join('\n'),
  },
  {
    id: 'dissertation',
    motifs: [[['=comment', 'method', 'conseil', 'faire', 'reussir', 'plan'], ['dissertation']]],
    reponse: [
      '## La dissertation, étape par étape',
      '- Analyse le sujet : chaque mot compte, cherche ce qui pose problème.',
      '- Formule la problématique : une vraie question, pas le sujet recopié.',
      '- Fais un plan en deux ou trois parties qui répondent à la question, avec un exemple précis par argument.',
      '- Rédige l’introduction et la conclusion en dernier… mais garde-leur du temps.',
      'Donne-moi ton sujet : je t’aide à trouver la problématique, sans écrire ta copie.',
    ].join('\n'),
  },
  {
    id: 'commentaire',
    motifs: [[['=comment', 'method', 'conseil', 'faire', 'reussir', 'plan'], ['commentaire']]],
    reponse: [
      '## Le commentaire de texte',
      '- Lis le texte trois fois : la première pour comprendre, puis crayon en main.',
      '- Repère ce qui est singulier : le genre, le registre, les procédés qui reviennent.',
      '- Trouve ton projet de lecture : ce que le texte cherche à faire, et comment.',
      '- Deux ou trois axes, chacun appuyé sur des citations analysées — jamais une citation sans commentaire.',
      'Envoie-moi ton texte : on cherche ensemble le projet de lecture.',
    ].join('\n'),
  },
  {
    id: 'motivation',
    motifs: [[['motiv', 'flemme', 'envie de rien', 'pas envie']]],
    reponse: [
      '## Quand on n’a pas envie',
      '- Ne te demande pas de travailler une heure : demande-toi cinq minutes. Le plus dur, c’est de commencer.',
      '- Une petite victoire par jour : un quiz réussi, une flamme gardée.',
      '- Note pourquoi tu travailles : une note, une orientation, la fierté de comprendre.',
      'Ta quête du jour prend moins de cinq minutes. On commence par elle ?',
    ].join('\n'),
  },
  {
    id: 'grand-oral',
    motifs: [[['grand oral']]],
    reponse: [
      '## Le Grand oral (session 2027)',
      '- Vingt minutes de préparation, puis deux temps de dix minutes : ta présentation debout, puis l’échange avec le jury.',
      '- Choisis une question qui t’intéresse vraiment, liée à tes spécialités.',
      '- Entraîne-toi à voix haute, chronomètre en main, devant quelqu’un.',
      'Ouvre le mode examen pour voir ton chemin jusqu’au jour J. Tu as déjà tes deux questions ?',
    ].join('\n'),
  },
  {
    id: 'brevet',
    motifs: [[REVISER.concat(['=comment', 'reussir']), ['brevet']]],
    reponse: [
      '## Préparer le brevet',
      '- Jusqu’en février : revoir chaque chapitre une fois, quiz compris.',
      '- De mars à mai : un sujet tombé par semaine, chronométré, puis le corrigé.',
      '- En juin : les épreuves blanches et l’oral, seulement tes points faibles.',
      'Le mode examen te dit où tu en es et quoi faire cette semaine. On regarde ensemble ?',
    ].join('\n'),
  },
  {
    id: 'nuit-blanche',
    motifs: [[['nuit blanche', 'toute la nuit', 'reviser la nuit']]],
    reponse: [
      '## Réviser la nuit : mauvaise affaire',
      '- C’est pendant le sommeil que le cerveau range ce que tu as appris dans la journée.',
      '- Une nuit blanche fait perdre plus qu’elle ne fait gagner : attention, mémoire et calme.',
      '- La veille : une relecture courte de tes fiches, puis au lit.',
      'Tu as une épreuve demain ? Dis-moi laquelle, je te donne le plan de la soirée.',
    ].join('\n'),
  },
]

/**
 * La réponse toute prête qui convient, ou `null` (la question part au modèle).
 */
export function reponsePrete(question: string, mode: string): ReponsePrete | null {
  if (mode !== 'question') return null
  const propre = question.trim()
  if (propre.length === 0 || propre.length > LONGUEUR_MAX) return null
  const tokens = mots(propre)

  // Un mot de CONTENU (un nom de chapitre, une notion) rend la question précise.
  const precis = tokens.some((t) => t.length > 3 && !MOTS_NEUTRES.has(t) && !/^\d+$/.test(t))
  if (precis) return null

  return REPONSES_PRETES.find((r) => r.motifs.some((m) => correspond(tokens, m))) ?? null
}
