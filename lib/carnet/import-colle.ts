// -----------------------------------------------------------------------------
// L'IMPORT PAR COLLAGE — de « j'ai déjà mes cartes ailleurs » à « elles sont
// dans Studuel », en un aller-retour.
//
// Le carnet n'avait AUCUNE porte d'entrée en masse : ni CSV, ni collage, ni
// Anki, ni Quizlet. Une question = une page = un aller-retour serveur. Écrire
// vingt flashcards demandait vingt navigations, et un élève qui avait déjà sa
// liste (dans ses notes, dans un tableur, chez un concurrent) ne pouvait pas
// l'apporter. C'est LA raison pour laquelle les cours restent vides.
//
// Ce module lit du texte collé et en tire des cartes. Il devine tout seul le
// séparateur, parce que demander « quel séparateur utilises-tu ? » à un élève
// de 4e, c'est perdre l'élève avant la première carte.
//
// Pur et testable : aucune écriture, aucun accès réseau. L'appelant montre
// l'aperçu, l'élève valide, PUIS on écrit.
// -----------------------------------------------------------------------------

/** Une carte lue dans le texte collé. */
export type CarteImportee = {
  recto: string
  verso: string
}

/** Ce qui n'a pas pu être lu, pour le dire à l'élève ligne par ligne. */
export type LigneRejetee = {
  /** Numéro de ligne dans le texte collé (à partir de 1). */
  ligne: number
  texte: string
  raison: 'une-seule-colonne' | 'vide' | 'doublon' | 'trop-long'
}

export type ResultatImport = {
  cartes: CarteImportee[]
  rejets: LigneRejetee[]
  /** Le séparateur retenu, pour l'afficher (« colonnes séparées par : ⇥ »). */
  separateur: Separateur
}

/** Les séparateurs reconnus, du plus fiable au plus ambigu. */
export type Separateur = 'tabulation' | 'point-virgule' | 'virgule' | 'tiret'

export const SEPARATEUR_LABEL: Record<Separateur, string> = {
  tabulation: 'tabulation',
  'point-virgule': 'point-virgule',
  virgule: 'virgule',
  tiret: 'tiret',
}

const MOTIF: Record<Separateur, RegExp> = {
  tabulation: /\t/,
  'point-virgule': /;/,
  virgule: /,/,
  // Un tiret ENTOURÉ D'ESPACES : « dog - chien ». Sans les espaces, on
  // couperait « rez-de-chaussée » en deux.
  tiret: /\s+[-–—]\s+/,
}

/** Bornes — au-delà, ce n'est plus une carte, c'est un paragraphe. */
export const MAX_FACE = 1_000
export const MAX_CARTES_IMPORT = 300
/** Lignes lues au maximum : un collage géant ne doit pas figer l'écran. */
export const MAX_LIGNES = 2_000

/**
 * Devine le séparateur du texte : celui qui découpe le PLUS DE LIGNES en
 * exactement deux morceaux non vides.
 *
 * On ne prend pas « le premier trouvé » : une liste de vocabulaire séparée par
 * des tabulations contient souvent des virgules DANS les définitions (« chien,
 * animal domestique »). Compter les lignes bien découpées départage sans se
 * tromper, et l'ordre des candidats tranche les égalités en faveur du plus
 * fiable.
 */
export function devinerSeparateur(lignes: readonly string[]): Separateur {
  const candidats: Separateur[] = [
    'tabulation',
    'point-virgule',
    'tiret',
    'virgule',
  ]
  let meilleur: Separateur = 'tabulation'
  let meilleurScore = -1

  for (const sep of candidats) {
    let score = 0
    for (const ligne of lignes) {
      const parts = decouper(ligne, sep)
      if (parts.length === 2 && parts[0].length > 0 && parts[1].length > 0) {
        score++
      }
    }
    if (score > meilleurScore) {
      meilleurScore = score
      meilleur = sep
    }
  }
  return meilleur
}

/**
 * Découpe une ligne au premier séparateur seulement : tout ce qui suit est le
 * verso. « to run ; courir ; filer » donne « to run » / « courir ; filer », et
 * non trois colonnes dont on jetterait la troisième.
 */
function decouper(ligne: string, sep: Separateur): string[] {
  const motif = MOTIF[sep]
  const m = motif.exec(ligne)
  if (!m || m.index === undefined) return [ligne.trim()]
  return [
    ligne.slice(0, m.index).trim(),
    ligne.slice(m.index + m[0].length).trim(),
  ]
}

/** Retire les guillemets d'une cellule de CSV (« "chien" » → « chien »). */
function sansGuillemets(s: string): string {
  const t = s.trim()
  if (t.length >= 2 && t.startsWith('"') && t.endsWith('"')) {
    return t.slice(1, -1).replace(/""/g, '"').trim()
  }
  return t
}

/**
 * Lit le texte collé et en tire des cartes.
 *
 * `separateurImpose` permet à l'élève de corriger la devinette depuis l'aperçu
 * (« non, ce sont des points-virgules ») sans avoir à retoucher son texte.
 */
export function lireCollage(
  texte: string,
  separateurImpose?: Separateur,
): ResultatImport {
  const lignes = String(texte ?? '')
    .split(/\r?\n/)
    .slice(0, MAX_LIGNES)

  const utiles = lignes.filter((l) => l.trim().length > 0)
  const separateur = separateurImpose ?? devinerSeparateur(utiles)

  const cartes: CarteImportee[] = []
  const rejets: LigneRejetee[] = []
  // Clé de dédoublonnage sur le RECTO seul : deux définitions différentes du
  // même mot sont presque toujours un copier-coller raté, pas deux cartes.
  const vus = new Set<string>()

  for (let i = 0; i < lignes.length; i++) {
    const brute = lignes[i]
    const numero = i + 1
    if (brute.trim().length === 0) continue // ligne vide : silencieuse, normale

    const parts = decouper(brute, separateur).map(sansGuillemets)
    if (parts.length < 2 || parts[1].length === 0) {
      rejets.push({
        ligne: numero,
        texte: brute.trim(),
        raison: 'une-seule-colonne',
      })
      continue
    }

    const recto = parts[0]
    const verso = parts[1]
    if (recto.length === 0) {
      rejets.push({ ligne: numero, texte: brute.trim(), raison: 'vide' })
      continue
    }
    if (recto.length > MAX_FACE || verso.length > MAX_FACE) {
      rejets.push({ ligne: numero, texte: brute.trim(), raison: 'trop-long' })
      continue
    }

    const cle = recto.toLowerCase()
    if (vus.has(cle)) {
      rejets.push({ ligne: numero, texte: brute.trim(), raison: 'doublon' })
      continue
    }
    vus.add(cle)

    if (cartes.length >= MAX_CARTES_IMPORT) {
      rejets.push({ ligne: numero, texte: brute.trim(), raison: 'trop-long' })
      continue
    }
    cartes.push({ recto, verso })
  }

  return { cartes, rejets, separateur }
}

/** Le message montré pour une ligne rejetée. */
export const RAISON_LABEL: Record<LigneRejetee['raison'], string> = {
  'une-seule-colonne': 'pas de deuxième colonne',
  vide: 'recto vide',
  doublon: 'déjà présent plus haut',
  'trop-long': 'trop long (ou au-delà de la limite)',
}

/**
 * Nettoie une liste de cartes saisies À LA MAIN (mode rafale) : on jette les
 * lignes à moitié remplies plutôt que de créer des brouillons invisibles que
 * l'élève découvrirait plus tard dans son cours.
 */
export function nettoyerSaisie(
  brutes: readonly { recto: string; verso: string }[],
): CarteImportee[] {
  const vus = new Set<string>()
  const cartes: CarteImportee[] = []
  for (const b of brutes) {
    const recto = String(b?.recto ?? '')
      .trim()
      .slice(0, MAX_FACE)
    const verso = String(b?.verso ?? '')
      .trim()
      .slice(0, MAX_FACE)
    if (recto.length === 0 || verso.length === 0) continue
    const cle = recto.toLowerCase()
    if (vus.has(cle)) continue
    vus.add(cle)
    cartes.push({ recto, verso })
    if (cartes.length >= MAX_CARTES_IMPORT) break
  }
  return cartes
}
