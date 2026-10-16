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

/**
 * Les modes du champ — ceux qui appellent le modèle. Les quatre premiers sont
 * les historiques ; les suivants sont les OUTILS du bureau (16/10/2026,
 * lib/coach/catalogue-outils) : chacun n'est qu'une consigne de plus, donc un
 * outil coûte une demande, comme une question.
 */
export type ModeCle =
  | 'question'
  | 'fiche'
  | 'exercice'
  | 'flashcards'
  | 'resume'
  | 'explique'
  | 'interroge'
  | 'exos'
  | 'copie'
  | 'schema'
  | 'traduis'
  | 'definition'
  | 'carte'
  | 'plan'
  | 'planning'
  | 'calcul'
  | 'redaction'
  | 'langue'
  | 'expose'

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
    hint: 'Des cartes à réviser, dans ta bibliothèque',
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

  // --- LES OUTILS DU BUREAU (16/10/2026) ------------------------------------
  // Une teinte par FAMILLE du catalogue (Comprendre indigo, Réviser rose,
  // S'entraîner ambre, Corriger corail) : à vingt outils, une teinte chacun ne
  // se reconnaîtrait plus. La règle absolue du socle tient pour tous.

  resume: {
    cle: 'resume',
    label: 'Résume mon cours',
    hint: 'L’essentiel de ton cours en dix lignes',
    teinte: 'indigo',
    placeholder: 'Colle ton cours, ou prends-le en photo',
    consigne: [
      'L’élève te donne son cours. Tu en fais un RÉSUMÉ fidèle, à son niveau, en 10 lignes au plus.',
      'Format : une phrase qui dit de quoi parle le cours, puis 4 à 6 puces « - » d’une phrase avec les idées clés, dans l’ordre du cours.',
      'Tu n’ajoutes rien qui ne soit pas dans le cours. Si le texte est illisible ou trop court, tu le dis.',
    ].join(' '),
    maxTokens: 700,
    piece: true,
  },

  explique: {
    cle: 'explique',
    label: 'Explique-moi',
    hint: 'Une notion, à ton niveau, avec un exemple',
    teinte: 'indigo',
    placeholder: 'La notion que tu ne comprends pas',
    consigne: [
      'Tu expliques UNE notion à l’élève, à son niveau de classe, en 6 phrases au plus.',
      'D’abord l’idée en une phrase simple, puis un exemple concret de la vie de tous les jours (tiré de ses passions si tu les connais), puis le piège classique.',
      'Tu finis par une petite question pour vérifier qu’il a compris.',
    ].join(' '),
    maxTokens: 450,
    piece: false,
  },







  interroge: {
    cle: 'interroge',
    label: 'Interroge-moi',
    hint: 'Une question à la fois, corrigée',
    teinte: 'ambre',
    placeholder: 'Le chapitre sur lequel t’interroger',
    consigne: [
      'Tu INTERROGES l’élève comme un prof à l’oral, UNE question à la fois.',
      'Si son message est une réponse à ta question précédente, tu dis d’abord si c’est juste (et pourquoi, en une phrase), puis tu poses la question suivante.',
      'Sinon, tu poses la première question sur le chapitre demandé. Jamais plus d’une question par message.',
    ].join(' '),
    maxTokens: 300,
    piece: false,
  },

  exos: {
    cle: 'exos',
    label: 'Exos sur mesure',
    hint: 'Trois exercices, du plus facile au plus dur',
    teinte: 'ambre',
    placeholder: 'Le chapitre à travailler',
    consigne: [
      'Tu écris 3 exercices courts sur le chapitre, numérotés et gradués : facile, moyen, difficile.',
      'Tu ne donnes PAS les solutions : tu finis par « Envoie-moi tes réponses, je corrige ».',
    ].join(' '),
    maxTokens: 800,
    piece: false,
  },

  copie: {
    cle: 'copie',
    label: 'Corrige ma copie',
    hint: 'Une photo de ta copie, relue avec toi',
    teinte: 'corail',
    placeholder: 'Prends ta copie en photo',
    consigne: [
      'L’élève t’envoie sa copie ou son devoir. Tu le CORRIGES sans jamais le réécrire.',
      'En trois temps : « Ce qui est réussi » (2 points), « Ce qui coûte des points » (3 erreurs au plus, chacune avec la règle à appliquer), « À faire maintenant » (une correction qu’il fait lui-même).',
      'Tu ne donnes pas de note chiffrée.',
    ].join(' '),
    maxTokens: 900,
    piece: true,
  },




  schema: {
    cle: 'schema',
    label: 'Explique ce schéma',
    hint: 'Une photo de schéma, lue avec toi',
    teinte: 'indigo',
    placeholder: 'Prends le schéma en photo',
    consigne: [
      'L’élève t’envoie un schéma, une carte, un graphique ou un document.',
      'Tu dis d’abord ce que c’est en une phrase, puis tu le lis en 3 à 5 points numérotés (ce qu’on voit, ce que ça montre).',
      'Tu finis par la question qu’un prof poserait sur ce document.',
    ].join(' '),
    maxTokens: 500,
    piece: true,
  },

  traduis: {
    cle: 'traduis',
    label: 'Traduis et explique',
    hint: 'Une phrase en langue, comprise mot à mot',
    teinte: 'indigo',
    placeholder: 'La phrase à comprendre',
    consigne: [
      'L’élève te donne une phrase en langue étrangère (ou en français à traduire).',
      'Tu donnes le sens en français, puis tu expliques les 2 ou 3 points de grammaire ou de vocabulaire qui la rendent difficile.',
      'Tu n’écris pas de devoir de traduction entier : au-delà de trois phrases, tu expliques la première et tu lui laisses la suite.',
    ].join(' '),
    maxTokens: 500,
    piece: true,
  },

  definition: {
    cle: 'definition',
    label: 'Le mot juste',
    hint: 'Une définition claire, à recopier',
    teinte: 'indigo',
    placeholder: 'Le mot ou l’expression',
    consigne: [
      'Tu donnes la définition du mot ou de l’expression, telle qu’on l’attend dans une copie, en 2 phrases.',
      'Puis un exemple d’emploi, et le mot avec lequel on le confond souvent.',
    ].join(' '),
    maxTokens: 300,
    piece: false,
  },

  carte: {
    cle: 'carte',
    label: 'Carte mentale',
    hint: 'Ton chapitre en branches',
    teinte: 'rose',
    placeholder: 'Le chapitre à mettre en carte',
    consigne: [
      'Tu fais une CARTE MENTALE du chapitre, en texte, sans autre texte autour.',
      'Format imposé : une ligne « # » avec le thème central, puis 3 à 5 lignes « ## » pour les branches, et sous chacune 2 à 4 puces « - » de quelques mots (pas des phrases).',
    ].join(' '),
    maxTokens: 700,
    piece: true,
  },

  plan: {
    cle: 'plan',
    label: 'Plan pour mon contrôle',
    hint: 'Jour par jour jusqu’au contrôle',
    teinte: 'rose',
    placeholder: 'Ton contrôle : matière, date, chapitres',
    consigne: [
      'L’élève prépare un contrôle. Tu fais un PLAN DE RÉVISION jour par jour jusqu’à la date.',
      'Chaque jour : une ligne « - Jour : quoi faire (durée) », 15 minutes au plus par jour en semaine.',
      'La veille : une révision courte, jamais du nouveau. Le jour J : 5 questions éclair le matin.',
      'Si la date ou les chapitres manquent, tu les demandes avant de faire le plan.',
    ].join(' '),
    maxTokens: 700,
    piece: false,
  },

  planning: {
    cle: 'planning',
    label: 'Planning de la semaine',
    hint: 'Tes soirées organisées, sans y passer la nuit',
    teinte: 'rose',
    placeholder: 'Tes contrôles et devoirs de la semaine',
    consigne: [
      'Tu organises la semaine de l’élève : un jour par ligne « - Jour : … », du lundi au dimanche.',
      'Au plus 30 minutes par soir en semaine, les tâches les plus urgentes d’abord, une soirée libre.',
      'Tu finis par une phrase d’encouragement simple, sans emoji.',
    ].join(' '),
    maxTokens: 700,
    piece: false,
  },

  calcul: {
    cle: 'calcul',
    label: 'Mon calcul pas à pas',
    hint: 'Il trouve où ton calcul déraille',
    teinte: 'corail',
    placeholder: 'Ton calcul, ligne par ligne (ou en photo)',
    consigne: [
      'L’élève te donne SON calcul. Tu le relis ligne par ligne et tu trouves la PREMIÈRE erreur.',
      'Tu dis à quelle ligne elle est et quelle règle n’a pas été respectée, sans écrire la suite du calcul.',
      'Si tout est juste, tu le dis et tu félicites en une phrase.',
    ].join(' '),
    maxTokens: 500,
    piece: true,
  },

  redaction: {
    cle: 'redaction',
    label: 'Ma rédaction',
    hint: 'Ton texte relu : idées, plan, langue',
    teinte: 'corail',
    placeholder: 'Colle ta rédaction, ou prends-la en photo',
    consigne: [
      'L’élève te donne une rédaction, un paragraphe argumenté ou une dissertation. Tu ne la réécris JAMAIS.',
      'Tu donnes un retour en trois points : les idées et le plan, la langue (2 erreurs récurrentes avec la règle), et la piste qui ferait gagner le plus de points.',
    ].join(' '),
    maxTokens: 900,
    piece: true,
  },

  langue: {
    cle: 'langue',
    label: 'Mes langues',
    hint: 'Tes phrases en langue, corrigées et expliquées',
    teinte: 'corail',
    placeholder: 'Tes phrases en anglais, espagnol, allemand…',
    consigne: [
      'L’élève écrit en langue étrangère. Tu repères ses erreurs (5 au plus), chacune avec la règle en une phrase en français.',
      'Tu ne réécris pas tout le texte : tu montres la forme correcte seulement pour les erreurs relevées.',
    ].join(' '),
    maxTokens: 600,
    piece: true,
  },

  expose: {
    cle: 'expose',
    label: 'Mon exposé',
    hint: 'Ton plan d’exposé ou d’oral, relu',
    teinte: 'corail',
    placeholder: 'Le sujet et ton plan',
    consigne: [
      'L’élève prépare un exposé ou un oral. Tu relis son plan : ce qui tient, ce qui manque, ce qui est hors sujet.',
      'Puis 3 conseils pour le dire à l’oral (accroche, transitions, conclusion). Tu n’écris pas l’exposé à sa place.',
    ].join(' '),
    maxTokens: 800,
    piece: true,
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
