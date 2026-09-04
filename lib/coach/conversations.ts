// LES CONVERSATIONS AVEC MARCEL — la logique pure.
//
// Jusqu'ici, une question à Marcel ne laissait aucune trace : la réponse
// s'affichait, et disparaissait au rechargement. L'élève ne pouvait ni la
// retrouver, ni enchaîner (« explique autrement » n'avait aucun « quoi »).
//
// Ce module tient les règles de ce fil, sans toucher ni à la base ni à React :
// comment un fil se NOMME, ce qu'on en renvoie au modèle, et comment on
// retrouve le dernier échange (celui qu'on range dans le carnet).
//
// DEUX BORNES, décidées ici et nulle part ailleurs :
//   • le CONTEXTE renvoyé au modèle est de deux tours, pas trente. Marcel doit
//     pouvoir répondre à « explique autrement » sans qu'un fil de trente
//     messages se repaie trente fois — c'est la doctrine de coût de l'onglet
//     (cf. app/marcel/actions.ts), assouplie juste assez pour que le fil ait un
//     sens ;
//   • chaque message renvoyé est TRONQUÉ : un contexte ne sert qu'à rappeler de
//     quoi on parle, pas à réexpédier un cours entier.

import { MOIS_FR } from '@/lib/time'

export const MAX_TITRE_LEN = 60
/** Question de l'élève — même borne que l'appel au modèle. */
export const MAX_QUESTION_LEN = 400
/**
 * Réponse de Marcel. Quatre phrases suffisaient tant qu'il ne rendait que des
 * indices ; une FICHE en fait dix fois plus. On s'aligne donc sur la contrainte
 * de la base (migration 349 : 4 000 caractères par message) plutôt que de
 * tronquer au milieu d'une puce ce que l'élève vient de payer.
 */
export const MAX_REPONSE_LEN = 4_000
/** Nombre de tours (élève + Marcel) rappelés au modèle. */
export const CONTEXTE_TOURS = 2
/** Longueur d'un message rappelé au modèle. */
export const CONTEXTE_MESSAGE_LEN = 300

export type RoleMessage = 'eleve' | 'marcel'

export type Message = {
  id: string
  role: RoleMessage
  texte: string
}

/** Une ligne de la liste d'historique — jamais les messages, juste l'étiquette. */
export type ConversationResume = {
  id: string
  titre: string
  /** Dernière activité, en ISO — l'affichage relatif se fait côté composant. */
  maj: string
}

/**
 * Le titre d'un fil neuf : sa première question, coupée proprement.
 *
 * Pas de titre demandé à l'élève (il ne le donnerait pas) et pas de titre
 * inventé par le modèle (ça se paierait à chaque fil). La première question
 * dit déjà de quoi on parle — c'est ce que font tous les fils de discussion.
 */
export function titreAuto(question: string): string {
  const propre = question.replace(/\s+/g, ' ').trim()
  if (propre.length === 0) return 'Nouvelle question'
  if (propre.length <= MAX_TITRE_LEN) return propre

  // Coupe au dernier espace pour ne pas trancher un mot en deux ; si le premier
  // mot fait déjà toute la longueur, on coupe net.
  const coupe = propre.slice(0, MAX_TITRE_LEN)
  const espace = coupe.lastIndexOf(' ')
  const base = espace > MAX_TITRE_LEN / 2 ? coupe.slice(0, espace) : coupe
  return `${base.replace(/[\s,;:.!?]+$/, '')}…`
}

/**
 * Le titre saisi à la main (renommage). `null` = refus : on ne remplace pas un
 * titre existant par du vide.
 */
export function nettoyerTitre(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const propre = raw.replace(/\s+/g, ' ').trim().slice(0, MAX_TITRE_LEN)
  return propre.length > 0 ? propre : null
}

/**
 * Ce qu'on rappelle au modèle : les derniers tours, dans l'ordre, tronqués.
 *
 * On compte en TOURS et non en messages pour ne jamais couper un échange en
 * deux — un « explique autrement » sans la question d'avant ne veut rien dire.
 */
export function contexteFor(
  messages: readonly Message[],
  tours: number = CONTEXTE_TOURS,
): { role: RoleMessage; texte: string }[] {
  const garde = Math.max(0, Math.floor(tours)) * 2
  if (garde === 0) return []

  const derniers = messages.slice(-garde)
  // Un contexte qui commence par une réponse de Marcel est un demi-tour : on
  // laisse tomber cette première ligne plutôt que de rappeler une réponse
  // orpheline.
  const debut = derniers.findIndex((m) => m.role === 'eleve')
  const utiles = debut <= 0 ? derniers : derniers.slice(debut)

  return utiles.map((m) => ({
    role: m.role,
    texte: m.texte.slice(0, CONTEXTE_MESSAGE_LEN),
  }))
}

/**
 * Quand ce fil a-t-il parlé pour la dernière fois ? « Aujourd'hui », « Hier »,
 * « Il y a 3 jours », puis la date.
 *
 * Une heure exacte ne dit rien dans un historique (« 14:32 » de quel jour ?) et
 * une date sèche non plus quand c'est de ce matin. Les jours sont comptés en
 * clés UTC, comme partout dans l'app (cf. lib/time, lib/streak).
 */
export function quandDit(maj: string, maintenant: Date = new Date()): string {
  const date = new Date(maj)
  if (Number.isNaN(date.getTime())) return ''

  const jour = (d: Date) =>
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  const jours = Math.round((jour(maintenant) - jour(date)) / 86_400_000)

  // Un fil « du futur » (horloge décalée) se dit aujourd'hui plutôt que
  // « il y a -1 jour ».
  if (jours <= 0) return 'Aujourd’hui'
  if (jours === 1) return 'Hier'
  if (jours < 7) return `Il y a ${jours} jours`
  return `${date.getUTCDate()} ${MOIS_FR[date.getUTCMonth()]}`
}

/**
 * Le dernier échange complet du fil — la question de l'élève et la réponse
 * qu'elle a reçue. C'est le « ça » de « envoie ça dans mon carnet ».
 *
 * On remonte depuis la fin : la dernière réponse de Marcel, puis la question
 * qui la précède immédiatement. `null` si le fil n'a pas encore d'échange
 * complet — auquel cas il n'y a rien à ranger, et il faut le dire.
 */
export function dernierEchange(
  messages: readonly Message[],
): { question: string; reponse: string } | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role !== 'marcel') continue
    for (let j = i - 1; j >= 0; j--) {
      if (messages[j].role !== 'eleve') continue
      const question = messages[j].texte.trim()
      const reponse = messages[i].texte.trim()
      if (question.length === 0 || reponse.length === 0) return null
      return { question, reponse }
    }
    return null
  }
  return null
}
