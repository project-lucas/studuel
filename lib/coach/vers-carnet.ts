// « ENVOIE ÇA DANS MON CARNET » — le pont entre Marcel et le carnet.
//
// Marcel explique, le carnet fait réviser. Les deux existaient sans se
// connaître : une bonne explication du coach mourait dans son fil, alors que
// l'élève a, à deux écrans de là, un moteur de révision qui la lui aurait
// remise en mémoire à J+1, J+3, J+7.
//
// La phrase suffit. L'élève écrit « envoie ça dans mon carnet » et le dernier
// échange devient une CARTE (recto : sa question, verso : la réponse de
// Marcel). Aucun appel au modèle : l'intention est reconnue ici, en pur, et le
// texte est déjà écrit — donc rien à payer, et rien à décompter du quota.
//
// La reconnaissance est volontairement EXIGEANTE : il faut le mot « carnet » ET
// un verbe qui range. « C'est quoi un carnet de bord ? » reste une question
// pour le modèle ; « mets ça dans mon carnet » est un ordre.

/** Le cours d'accueil, créé à la demande dans le carnet de l'élève. */
export const COURS_MARCEL = 'Avec Marcel'

/** Recto : la question. Assez pour une face de carte, pas un paragraphe. */
export const MAX_RECTO_LEN = 300
/** Verso : la réponse de Marcel, qui tient en quatre phrases. */
export const MAX_VERSO_LEN = 1_000

/**
 * Sans accents, en minuscules, apostrophes redressées — « Envoie ÇA »,
 * « envoie ca » et « n’envoie » s'écrivent tous de la même façon ici.
 *
 * L'apostrophe typographique n'est pas un détail : c'est celle que produisent
 * les claviers de téléphone, donc celle que l'élève tape réellement. Sans ce
 * redressement, « n’envoie pas » passait à côté du garde-fou de négation.
 */
function aplati(texte: string): string {
  return texte
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’‘‛`´]/g, "'")
    .toLowerCase()
}

// Les verbes qui RANGENT. « copie », « colle » et « note » y sont : ce sont les
// mots que les élèves emploient réellement.
const VERBES =
  /\b(envoi|envoie|envoyer|envoies|met|mets|mettre|ajout|ajoute|ajouter|range|ranger|garde|garder|enregistre|enregistrer|sauvegarde|sauvegarder|note|noter|copie|copier|colle|coller|stocke|stocker|classe|classer)\b/

/**
 * L'élève demande-t-il de ranger l'échange dans son carnet ?
 *
 * Deux conditions, jamais une seule : le mot « carnet » et un verbe de
 * rangement. Sans le verbe, on a une question SUR le carnet ; sans le mot, on a
 * un ordre sur autre chose.
 */
export function veutCarnet(texte: unknown): boolean {
  if (typeof texte !== 'string') return false
  const plat = aplati(texte)
  if (!/\bcarnet\b/.test(plat)) return false
  if (!VERBES.test(plat)) return false

  // « ne mets pas ça dans mon carnet » : la négation renverse l'ordre, et une
  // erreur ici écrirait dans les données de l'élève contre son gré.
  return !/\b(?:ne|n')\s*\S+\s+pas\b/.test(plat)
}

/**
 * La carte fabriquée à partir d'un échange. `null` quand il n'y a rien à
 * ranger — on ne crée pas une carte vide pour faire plaisir.
 */
export function carteDepuis(
  question: string,
  reponse: string,
): { recto: string; verso: string } | null {
  const recto = question.replace(/\s+/g, ' ').trim().slice(0, MAX_RECTO_LEN)
  const verso = reponse.trim().slice(0, MAX_VERSO_LEN)
  if (recto.length === 0 || verso.length === 0) return null
  return { recto, verso }
}
