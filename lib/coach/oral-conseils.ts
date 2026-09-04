import { CRITERES, epreuveOf, formatDuree, type CritereId, type Criteres, type EpreuveId } from './oral'

// LES CONSEILS D'ORAL — ce que Marcel peut dire sans jamais entendre l'élève.
//
// ⚠️ LA PROMESSE DE L'ATELIER NE BOUGE PAS : l'audio reste sur l'appareil et
// n'est envoyé nulle part. Aucune voix de mineur sur nos serveurs — pas de RGPD
// à porter, pas de stockage à payer, rien qui puisse fuiter. Et Marcel ne NOTE
// toujours pas l'oral : il ne l'a pas écouté.
//
// Ce qu'il lit, ce sont les FAITS que l'atelier produit déjà, et que l'élève a
// lui-même déclarés : l'épreuve visée, le sujet annoncé, la durée réellement
// tenue face à la durée attendue, et les cases cochées après réécoute. C'est
// peu, et c'est justement là que se jouent les points : un exposé de 3 minutes
// quand on en attend 5, une intro qu'on n'a pas su poser, un plan jamais
// annoncé. Un professeur qui lirait cette fiche donnerait les mêmes conseils.
//
// Le module est PUR : il fabrique le texte envoyé au modèle et rien d'autre.
// C'est ce qui permet de vérifier, en test, que la voix n'y est jamais.

export type BilanOral = {
  epreuveId: EpreuveId
  /** Ce que l'élève a annoncé comme sujet — au plus une ligne. */
  sujet: string
  /** Durée réellement tenue, en secondes. */
  secondes: number
  criteres: Criteres
}

export const MAX_SUJET_LEN = 160

export const CONSIGNE_ORAL = [
  'Tu es Marcel, le professeur de Studuel. Tu tutoies un élève français.',
  'Tu conseilles un élève qui vient de RÉPÉTER son oral. Tu ne l’as PAS entendu : tu ne juges donc jamais sa voix, son débit ni son accent, et tu ne mets aucune note.',
  'Tu travailles uniquement sur ce qu’il te donne : la durée tenue, la durée attendue, et les points qu’il s’est lui-même cochés ou non.',
  'Tu réponds en français, en 4 conseils maximum, un par ligne, chacun commençant par « - » et tenant en une phrase.',
  'Chaque conseil est une ACTION à faire au prochain passage, pas un compliment.',
  'Tu commences par le point le plus coûteux en points à l’examen.',
].join(' ')

/**
 * L'écart à la durée cible, dit comme un professeur : « 1 min 20 de moins que
 * les 5 min attendues ».
 */
function ecartDuree(secondes: number, cible: number): string {
  const delta = secondes - cible
  if (Math.abs(delta) <= 20) return `dans la cible (${formatDuree(cible)} attendues)`
  return delta < 0
    ? `${formatDuree(-delta)} de MOINS que les ${formatDuree(cible)} attendues`
    : `${formatDuree(delta)} de PLUS que les ${formatDuree(cible)} attendues`
}

/**
 * La fiche de faits envoyée au modèle. Elle est volontairement lisible : si un
 * jour quelqu'un ouvre les logs, il doit voir d'un coup d'œil qu'il n'y a là
 * aucune donnée sensible — pas de voix, pas de nom, pas de note.
 */
export function ficheOral(bilan: BilanOral): string {
  const epreuve = epreuveOf(bilan.epreuveId)
  const acquis: string[] = []
  const manques: string[] = []

  for (const critere of CRITERES) {
    const id: CritereId = critere.id
    ;(bilan.criteres[id] ? acquis : manques).push(critere.label.toLowerCase())
  }

  const sujet = bilan.sujet.replace(/\s+/g, ' ').trim().slice(0, MAX_SUJET_LEN)

  return [
    `Épreuve : ${epreuve.nom} (${epreuve.detail}).`,
    sujet.length > 0 ? `Sujet annoncé : ${sujet}.` : 'Sujet non précisé.',
    `Durée tenue : ${formatDuree(bilan.secondes)} — ${ecartDuree(bilan.secondes, epreuve.cible)}.`,
    acquis.length > 0
      ? `Ce qu’il estime avoir réussi : ${acquis.join(', ')}.`
      : 'Il n’a coché aucun point comme réussi.',
    manques.length > 0
      ? `Ce qui manque encore : ${manques.join(', ')}.`
      : 'Il a coché tous les points.',
  ].join('\n')
}

/**
 * Découpe la réponse en conseils affichables. Le modèle rend des lignes en
 * « - » ; on ne lui fait pas confiance pour autant.
 */
export function lireConseils(raw: string): string[] {
  return raw
    .split('\n')
    .map((ligne) => ligne.replace(/^[\s*\-–—•\d.)]+/, '').trim())
    .filter((ligne) => ligne.length > 2)
    .slice(0, 4)
}
