// « J'ÉVALUE MON NIVEAU EN ORTHOGRAPHE » — le test de positionnement.
//
// Neuf phrases à trou, une règle chacune, et une quatrième porte à chaque
// question : « Je ne sais pas. »
//
// POURQUOI CETTE PORTE EXISTE, et pourquoi elle vaut tout le reste. Un test de
// positionnement qui force à choisir mesure la CHANCE autant que le niveau : sur
// trois options, un élève qui ignore tout décroche un tiers des points et
// repart avec un niveau surévalué — donc un entraînement calibré trop haut,
// qu'il abandonnera. « Je ne sais pas » sépare les deux populations que le
// pourcentage seul confond :
//
//   une ERREUR       = une croyance fausse. L'élève a une règle en tête, la
//                      mauvaise. Il faut la déloger — c'est le plus dur.
//   un JE-NE-SAIS-PAS = un trou. Il n'y a rien à déloger, seulement à poser.
//
// Les deux comptent zéro au score, et c'est voulu : le score dit le niveau. Mais
// le bilan les distingue, parce qu'ils n'appellent pas le même travail.
//
// LE TEST NE MONTE PAS EN DIFFICULTÉ. Les paliers sont entrelacés (voir l'ordre
// de `QUESTIONS`) : une rampe croissante annonce à l'élève qu'il décroche dès
// qu'il sèche deux fois de suite, et il répond n'importe quoi pour en finir.
// Alterné, il ne peut pas lire sa propre courbe.
//
// AUCUNE CORRECTION EN COURS DE ROUTE — le score et les règles à travailler
// n'arrivent qu'à la fin. Corriger question par question apprendrait pendant la
// mesure, et une mesure qui modifie ce qu'elle mesure ne mesure plus rien.
// (C'est déjà la doctrine de l'examen blanc, cf. `ExamBlancPlayer`.)

/** Les trois paliers de règles, du plus courant au plus pointu. */
export const PALIERS = ['fondamentaux', 'confirme', 'expert'] as const
export type Palier = (typeof PALIERS)[number]

/** Le nom affiché d'un palier. */
export const PALIER_LABEL: Record<Palier, string> = {
  fondamentaux: 'Les fondamentaux',
  confirme: 'Niveau confirmé',
  expert: 'Niveau expert',
}

/** Le trou dans la phrase. Le composant le remplace par un champ dessiné. */
export const TROU = '___'

export type QuestionNiveau = {
  id: string
  palier: Palier
  /** La règle mise à l'épreuve — c'est elle qu'on rend à l'élève à la fin. */
  regle: string
  /** La phrase à compléter, trou compris. */
  phrase: string
  /** Les propositions, SANS « Je ne sais pas » : la vue l'ajoute toujours. */
  options: string[]
  /** Index de la bonne proposition dans `options`. */
  correct: number
  /** Le moyen de retenir, montré au bilan et seulement là. */
  astuce: string
}

/**
 * Les neuf questions.
 *
 * Les RÈGLES sont celles du test de référence du domaine (pronom « leur »,
 * locution « au vu de », cédille, impératif d'« avoir », redoublement dans
 * « appeler », nom composé « ayant droit », accord de l'adjectif de couleur,
 * « mille / cent / vingt », participe passé des verbes pronominaux) : une règle
 * de grammaire n'appartient à personne. Les PHRASES qui les portent sont
 * écrites ici — et écrites pour NOTRE public. « Au vu des résultats, il faut
 * investir davantage » est du français d'entreprise ; un 4e n'a jamais vu cette
 * phrase et sèche sur le décor, pas sur la règle.
 */
export const QUESTIONS: QuestionNiveau[] = [
  {
    id: 'leur-pronom',
    palier: 'confirme',
    regle: 'Le pronom « leur » ne prend jamais de -s',
    phrase: `Préviens-${TROU} que le contrôle est reporté.`,
    options: ['leurs', 'leur'],
    correct: 1,
    astuce:
      'Ici « leur » remplace « à eux » : c’est un pronom, il est invariable. Il ne prend un -s que devant un nom (« leurs cahiers »).',
  },
  {
    id: 'au-vu-de',
    palier: 'expert',
    regle: 'La locution « au vu de » reste au singulier',
    phrase: `${TROU} de tes progrès, tu peux viser plus haut.`,
    options: ['Au vu', 'Aux vues', 'Aux vus'],
    correct: 0,
    astuce:
      '« Au vu de » est une locution figée : elle ne s’accorde jamais avec ce qui suit, même au pluriel.',
  },
  {
    id: 'cedille',
    palier: 'fondamentaux',
    regle: 'La cédille devant a, o, u',
    phrase: `Je suis ${TROU} par ma note de maths.`,
    options: ['décu', 'déçu', 'dessus'],
    correct: 1,
    astuce:
      'Le c se prononce [s] devant e et i seulement. Devant a, o, u il lui faut une cédille : déçu, garçon, reçu.',
  },
  {
    id: 'imperatif-avoir',
    palier: 'confirme',
    regle: 'L’impératif du verbe « avoir »',
    phrase: `${TROU} confiance en toi le jour de l’oral.`,
    options: ['Aies', 'Aie', 'Ais'],
    correct: 1,
    astuce:
      'À l’impératif, « avoir » fait aie, ayons, ayez — sans -s. Le -s de « aies » appartient au subjonctif (« que tu aies »).',
  },
  {
    id: 'appeler',
    palier: 'fondamentaux',
    regle: 'Le redoublement du l dans « appeler »',
    phrase: `Je l’${TROU} dès que j’ai fini mes devoirs.`,
    options: ['appele', 'apelle', 'appelle'],
    correct: 2,
    astuce:
      'Deux p partout, et deux l quand on entend [ɛ] : j’appelle, nous appelons. Si tu entends « el », double le l.',
  },
  {
    id: 'ayants-droit',
    palier: 'expert',
    regle: 'Le pluriel du nom composé « ayant droit »',
    phrase: `Seuls les ${TROU} peuvent utiliser cette photo.`,
    options: ['ayants droit', 'ayant-droit', 'ayants-droit'],
    correct: 0,
    astuce:
      'Ce sont des personnes « ayant un droit » : seul le participe se met au pluriel, et il n’y a pas de trait d’union.',
  },
  {
    id: 'adjectif-couleur',
    palier: 'fondamentaux',
    regle: 'L’accord de l’adjectif de couleur',
    phrase: `Peux-tu me prêter tes chaussettes ${TROU}, s’il te plaît ?`,
    options: ['noir', 'noire', 'noires'],
    correct: 2,
    astuce:
      'Un adjectif de couleur simple s’accorde avec son nom : « chaussettes » est féminin pluriel, donc « noires ».',
  },
  {
    id: 'mille-cent-vingt',
    palier: 'confirme',
    regle: '« mille » invariable, « cent » et « vingt » sous condition',
    phrase: `Le voyage a coûté trois ${TROU} deux ${TROU} quatre-${TROU} euros.`,
    options: [
      'mille – cents – vingts',
      'milles – cent – vingt',
      'mille – cent – vingts',
    ],
    correct: 2,
    astuce:
      '« mille » ne varie jamais. « cent » et « vingt » prennent un -s multipliés ET en fin de nombre : ici « cent » est suivi de « quatre-vingts », donc pas de -s ; « vingts » termine, donc -s.',
  },
  {
    id: 'pronominaux',
    palier: 'expert',
    regle: 'Le participe passé des verbes pronominaux',
    phrase: `Elles se sont ${TROU} de répondre.`,
    options: ['permis', 'permises', 'permies'],
    correct: 0,
    astuce:
      'Elles ont permis quoi ? « de répondre », placé APRÈS. Le complément ne précède pas le verbe : pas d’accord. « se » est ici complément second (permettre à soi).',
  },
]

/** Réponse de l'élève : l'index choisi, ou `null` pour « Je ne sais pas ». */
export type Reponse = number | null

export type ScorePalier = { bonnes: number; total: number }

export type Bilan = {
  score: number
  total: number
  /** Le pourcentage affiché, arrondi à l'entier. */
  pourcentage: number
  parPalier: Record<Palier, ScorePalier>
  /** Le palier atteint, ou `null` quand même les fondamentaux ne tiennent pas. */
  niveau: Palier | null
  /** Les règles ratées, dans l'ordre du test — le programme de travail. */
  aTravailler: QuestionNiveau[]
  /** Les « Je ne sais pas » : des trous, pas des croyances fausses. */
  sansReponse: number
}

/**
 * Le seuil de validation d'un palier : 2 bonnes réponses sur 3.
 *
 * Pas 3 sur 3 : une seule étourderie ferait retomber un élève solide deux crans
 * plus bas, et le test se retournerait contre lui. Pas 1 sur 3 non plus : sur
 * trois propositions, une seule bonne réponse ne prouve rien de plus que la
 * chance — c'est le calcul même qui a fait naître le « Je ne sais pas ».
 */
export const SEUIL_PALIER = 2

/**
 * Le bilan d'un test terminé.
 *
 * Le niveau est CUMULATIF : on ne peut pas être « expert » en sautant les
 * fondamentaux. Un élève qui devine deux règles pointues mais écrit « décu »
 * n'est pas expert, il est chanceux — et le lui dire l'enverrait travailler des
 * accords de participe pendant qu'il perd des points sur des cédilles.
 */
export function bilanDe(reponses: readonly Reponse[]): Bilan {
  const parPalier = Object.fromEntries(
    PALIERS.map((p) => [p, { bonnes: 0, total: 0 }]),
  ) as Record<Palier, ScorePalier>

  let score = 0
  let sansReponse = 0
  const aTravailler: QuestionNiveau[] = []

  QUESTIONS.forEach((q, i) => {
    const donnee = reponses[i] ?? null
    parPalier[q.palier].total += 1
    if (donnee === q.correct) {
      score += 1
      parPalier[q.palier].bonnes += 1
      return
    }
    if (donnee === null) sansReponse += 1
    aTravailler.push(q)
  })

  // Cumulatif : on s'arrête au premier palier qui ne tient pas.
  let niveau: Palier | null = null
  for (const p of PALIERS) {
    if (parPalier[p].bonnes < SEUIL_PALIER) break
    niveau = p
  }

  return {
    score,
    total: QUESTIONS.length,
    pourcentage: Math.round((score / QUESTIONS.length) * 100),
    parPalier,
    niveau,
    aTravailler,
    sansReponse,
  }
}

/** Le mot de la fin, réglé sur le palier atteint. */
export function verdictNiveau(bilan: Bilan): { titre: string; message: string } {
  if (bilan.niveau === 'expert')
    return {
      titre: 'Orthographe solide',
      message:
        'Tu tiens les règles que la plupart des adultes ratent. Garde la main : ce sont celles qui se perdent le plus vite.',
    }
  if (bilan.niveau === 'confirme')
    return {
      titre: 'Bonnes bases',
      message:
        'Les règles courantes sont acquises. Il reste les pièges de fin de phrase — accords et nombres.',
    }
  if (bilan.niveau === 'fondamentaux')
    return {
      titre: 'Les bases tiennent',
      message:
        'Tu écris juste sur les règles du quotidien. Le palier suivant se joue sur les pronoms et les accords.',
    }
  return {
    titre: 'On part des bases',
    message:
      'Rien d’inquiétant : ce sont les règles les plus fréquentes, donc celles qui rapportent le plus vite.',
  }
}
