// CE QUE MARCEL SAIT FAIRE — le registre des outils du coach.
//
// L'onglet n'avait qu'un seul geste : poser une question, et recevoir un
// indice. Or un élève devant son cours ne demande pas toujours la même chose —
// il veut tantôt un RÉSUMÉ (« fais-moi une fiche »), tantôt une MÉTHODE sur un
// exercice bloquant, tantôt des CARTES à réviser. Trois demandes, trois formes
// de réponse, trois consignes différentes au modèle : les mélanger dans un seul
// champ donnait des fiches en quatre phrases et des exercices résolus à la
// place de l'élève.
//
// Un MODE est donc : une consigne système, un budget de sortie, une façon de
// rendre le résultat, et une couleur. Tout est décidé ICI, en pur et testé —
// l'action serveur ne fait que l'appliquer, et le rail ne fait que le peindre.
//
// LA COULEUR EST UNE IDENTITÉ, PAS UN RÔLE. La doctrine de la maison réserve le
// violet à l'action et le jaune à la récompense ; elle n'interdit pas de
// DISTINGUER des outils entre eux. La teinte ne colore que l'icône, sa pastille
// et le liseré de la carte : les boutons d'action restent violets partout.

export type Teinte =
  | 'violet'
  | 'rose'
  | 'bleu'
  | 'vert'
  | 'ambre'
  | 'indigo'
  | 'corail'
  | 'turquoise'

/** Les modes du champ — ceux qui appellent le modèle. */
export type ModeCle = 'question' | 'fiche' | 'exercice' | 'flashcards'

export type Mode = {
  cle: ModeCle
  /** Le mot de la carte. */
  label: string
  /** La ligne qui dit ce qu'on obtient. */
  hint: string
  teinte: Teinte
  /** Ce qu'affiche le champ vide dans ce mode. */
  placeholder: string
  /** Ce que Marcel doit faire — ajouté à sa consigne permanente. */
  consigne: string
  /** Budget de sortie : une fiche n'est pas un indice. */
  maxTokens: number
  /** Le mode accepte-t-il une photo ou un fichier ? */
  piece: boolean
  /**
   * Le résultat est-il une LISTE DE CARTES à valider (et non du texte) ? C'est
   * ce qui décide de l'affichage et du bouton « Ajouter au carnet ».
   */
  cartes?: true
}

// Le socle commun, rappelé à chaque mode : c'est la voix de Marcel, et la règle
// qui rend l'app défendable devant un parent — il n'écrit jamais le devoir.
export const CONSIGNE_SOCLE = [
  'Tu es Marcel, le professeur de Studuel. Tu tutoies un élève français de collège ou de lycée.',
  'Tu réponds en français, sans emoji.',
  'RÈGLE ABSOLUE : tu ne donnes JAMAIS la réponse toute faite ni un devoir rédigé.',
  'Si la demande ne concerne pas les cours, tu réponds simplement que tu es là pour le travail scolaire.',
].join(' ')

export const MODES: Record<ModeCle, Mode> = {
  question: {
    cle: 'question',
    label: 'Poser une question',
    hint: 'Un indice, jamais la réponse',
    teinte: 'violet',
    placeholder: 'Demander à Marcel',
    consigne: [
      'Tu réponds en 4 phrases maximum, sans liste.',
      'Tu donnes un indice, puis la première étape, et tu rends la main à l’élève.',
      'Tu finis par une question courte qui remet l’élève au travail.',
    ].join(' '),
    maxTokens: 320,
    piece: true,
  },

  fiche: {
    cle: 'fiche',
    label: 'Faire une fiche',
    hint: 'Ton cours résumé en une page',
    teinte: 'rose',
    placeholder: 'Le chapitre à résumer (ou joins ton cours)',
    // Le format est IMPOSÉ : sans lui, le modèle rend un paragraphe, et une
    // fiche qui ne se survole pas n'est pas une fiche.
    consigne: [
      'Tu écris une FICHE DE RÉVISION, en français, structurée et brève.',
      'Format imposé, sans autre texte autour :',
      'une ligne « # » avec le titre du chapitre ;',
      'puis 3 à 5 sections « ## » ;',
      'sous chaque section, 2 à 4 puces « - » de UNE phrase.',
      'Termine par une section « ## À ne pas confondre » avec 1 ou 2 pièges classiques.',
      'Tu écris ce qu’il faut RETENIR, pas un cours : des définitions, des dates, des formules, des repères.',
    ].join(' '),
    maxTokens: 900,
    piece: true,
  },

  exercice: {
    cle: 'exercice',
    label: 'Résoudre un exo',
    hint: 'La méthode, étape par étape',
    teinte: 'bleu',
    placeholder: 'Écris ton énoncé, ou prends-le en photo',
    // C'est le mode le plus tentant à détourner (« fais mon devoir ») : la
    // consigne le dit trois fois, et la dernière étape reste à l'élève.
    consigne: [
      'L’élève te donne un énoncé d’exercice.',
      'Tu ne le résous PAS à sa place et tu ne donnes AUCUN résultat final.',
      'Tu réponds en trois temps, courts :',
      '1) « Ce qu’on te demande » — reformule l’énoncé en une phrase ;',
      '2) « La méthode » — 2 à 4 étapes numérotées, chacune en une phrase, avec la propriété ou la formule à utiliser ;',
      '3) « À toi » — la première étape à faire maintenant, sous forme de question.',
      'Si l’énoncé est illisible ou incomplet, tu le dis et tu demandes ce qui manque.',
    ].join(' '),
    maxTokens: 700,
    piece: true,
  },

  flashcards: {
    cle: 'flashcards',
    label: 'Des flashcards',
    hint: 'Des cartes à réviser, dans ton carnet',
    teinte: 'vert',
    placeholder: 'Le chapitre à transformer en cartes',
    consigne: [
      'Tu fabriques des cartes de révision (recto / verso) pour un élève français.',
      'Réponds UNIQUEMENT avec un tableau JSON, sans texte autour :',
      '[{"recto":"question courte","verso":"réponse courte"}]',
      'Entre 6 et 10 cartes. Le recto est une question ou un terme ; le verso tient en une phrase.',
      'Des faits vérifiables : définitions, dates, formules, vocabulaire. Jamais d’opinion.',
    ].join(' '),
    maxTokens: 1_200,
    piece: true,
    cartes: true,
  },
}

export const MODE_PAR_DEFAUT: ModeCle = 'question'

/** Normalise ce qui arrive du client — un mode inconnu retombe sur la question. */
export function parseMode(raw: unknown): ModeCle {
  return typeof raw === 'string' && raw in MODES
    ? (raw as ModeCle)
    : MODE_PAR_DEFAUT
}

/**
 * La consigne système complète d'un mode. `methode` est la phrase du régime de
 * la matière (lib/coach/regimes) : c'est elle qui fait que Marcel ne répond pas
 * en histoire comme en maths, et elle est écrite d'avance, donc gratuite.
 */
export function consigneFor(mode: ModeCle, methode: string | null): string {
  const parts = [CONSIGNE_SOCLE, MODES[mode].consigne]
  if (methode) parts.push(`Méthode de cette matière : ${methode}`)
  return parts.join(' ')
}

// --- Les outils qui sont des PAGES -------------------------------------------
// Ils ne coûtent rien : ce sont des écrans déjà calculés (la mission, la
// méthode, l'oral, l'entraînement, les progrès). Ils vivent dans le même rail
// que les modes parce que, du point de vue de l'élève, c'est une seule question
// — « qu'est-ce que Marcel peut faire pour moi ? ».
export const TEINTE_VUE: Record<string, Teinte> = {
  mission: 'violet',
  oral: 'ambre',
  methode: 'indigo',
  entrainement: 'corail',
  progres: 'turquoise',
}
