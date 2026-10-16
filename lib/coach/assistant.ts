// -----------------------------------------------------------------------------
// L'ASSISTANT DU COACH — la logique pure (16/10/2026).
//
// Lucas : « les automatisations via la clé API de Claude pour m'aider dans la
// gestion de dizaines, voire cent élèves ». Quatre travaux :
//   le TRI DU MATIN   — qui contacter aujourd'hui, pourquoi, et quoi lui dire ;
//   le BILAN          — la semaine d'un élève, rédigée pour lui ou ses parents ;
//   le BROUILLON      — un message (relance, félicitations, avant un contrôle…) ;
//   le RÉSUMÉ         — un long fil de messagerie en quelques lignes.
// Claude ne reçoit JAMAIS un nom : les élèves deviennent « E1 », « E2 »… et
// l'app remet les prénoms au retour. Rien ne part sans que le coach relise :
// l'assistant propose, le coach envoie. Sans réseau, testé.
// -----------------------------------------------------------------------------

import type { LigneJugee } from '@/lib/coach/statut'
import type { FicheEntree, Objectif, Avancee, Semaine } from '@/lib/coach/suivi'

/** Un élève pseudonymisé : ce que Claude voit pour le tri. */
export type EleveAnonyme = {
  code: string
  classe: string | null
  statut: string
  raisons: string[]
  derniereActiviteJours: number | null
  minutes7: number
  minutesMoy4s: number
  joursActifs7: number
  quiz7: number
  matiereFaible: string | null
  scoreFaiblePct: number | null
  scoreGlobalPct: number | null
  arriveDepuisJours: number
  objectif: string | null
  nonLus: number
}

const JOUR_MS = 86_400_000
const jours = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / JOUR_MS)

/** Les élèves sans leur nom, et la table pour retrouver le prénom. */
export function pseudonymiser(
  lignes: readonly (LigneJugee & { objectif?: string | null; nonLus?: number })[],
  aujourdhui: string,
): { eleves: EleveAnonyme[]; table: Map<string, { eleveId: string; prenom: string }> } {
  const table = new Map<string, { eleveId: string; prenom: string }>()
  const eleves = lignes.map((l, i) => {
    const code = `E${i + 1}`
    table.set(code, { eleveId: l.eleveId, prenom: l.prenom })
    return {
      code,
      classe: l.classe,
      statut: l.statut,
      // Une raison ne contient jamais de nom (lib/coach/statut).
      raisons: l.raisons,
      derniereActiviteJours: l.derniereActivite ? jours(l.derniereActivite, aujourdhui) : null,
      minutes7: Math.round(l.secondes7 / 60),
      minutesMoy4s: Math.round(l.secondes4s / 4 / 60),
      joursActifs7: l.joursActifs7,
      quiz7: l.sessions7,
      matiereFaible: l.matiereFaible,
      scoreFaiblePct: l.ratioFaible === null ? null : Math.round(l.ratioFaible * 100),
      scoreGlobalPct: l.ratioGlobal === null ? null : Math.round(l.ratioGlobal * 100),
      arriveDepuisJours: jours(l.rattacheLe, aujourdhui),
      objectif: l.objectif ?? null,
      nonLus: l.nonLus ?? 0,
    }
  })
  return { eleves, table }
}

/** Remplace « E12 » par le prénom dans un texte rendu par Claude (sur des mots entiers). */
export function remettrePrenoms(texte: string, table: ReadonlyMap<string, { prenom: string }>): string {
  return texte.replace(/\bE(\d{1,4})\b/g, (m) => table.get(m)?.prenom ?? m)
}

// --------------------------------------------------------------- le tri ---
export const CONSIGNE_TRI = `Tu es l'assistant d'un coach scolaire qui suit des élèves de la 6e à la terminale sur l'application Studuel (révisions, quiz, jeux). Chaque élève est désigné par un code (E1, E2…) : n'invente jamais de nom.

À partir des données de la semaine, choisis les élèves que le coach doit contacter AUJOURD'HUI, par ordre d'urgence (au plus 10). Un élève inactif depuis longtemps, en forte baisse, ou qui a écrit sans réponse passe en premier ; un élève qui progresse nettement mérite aussi un mot (félicitations), mais après les urgences. Pour chacun : la raison en une phrase factuelle (chiffres à l'appui), l'action conseillée, et un message court et chaleureux que le coach pourrait envoyer tel quel (tutoiement, 2 phrases au plus, aucun reproche, une proposition concrète). Termine par une synthèse du groupe en 2 phrases. Écris en français.`

export type ElementTri = { code: string; urgence: 'haute' | 'moyenne' | 'basse'; raison: string; action: string; message: string }
export type ResultatTri = { synthese: string; eleves: ElementTri[] }

/** Le message utilisateur du tri : les données, en JSON compact. */
export function donneesTri(eleves: readonly EleveAnonyme[], aujourdhui: string): string {
  return `Date : ${aujourdhui}. ${eleves.length} élèves.\n${JSON.stringify(eleves)}`
}

/** Le tri prêt à afficher : prénoms remis, codes inconnus écartés, au plus 10. */
export function trierAvecPrenoms(
  r: ResultatTri,
  table: ReadonlyMap<string, { eleveId: string; prenom: string }>,
): { synthese: string; eleves: (ElementTri & { eleveId: string; prenom: string })[] } {
  const vus = new Set<string>()
  const eleves = r.eleves
    .filter((e) => table.has(e.code) && !vus.has(e.code) && vus.add(e.code))
    .slice(0, 10)
    .map((e) => {
      const ref = table.get(e.code)!
      return {
        ...e,
        eleveId: ref.eleveId,
        prenom: ref.prenom,
        raison: remettrePrenoms(e.raison, table),
        action: remettrePrenoms(e.action, table),
        message: remettrePrenoms(e.message, table),
      }
    })
  return { synthese: remettrePrenoms(r.synthese, table), eleves }
}

// --------------------------------------------------------------- le bilan ---
export type DestinataireBilan = 'eleve' | 'parent'

export const CONSIGNE_BILAN = `Tu es l'assistant d'un coach scolaire sur l'application Studuel. Rédige le bilan de la semaine d'un élève, que le coach relira avant de l'envoyer. Appuie-toi UNIQUEMENT sur les données fournies (n'invente ni note, ni chapitre, ni événement). Structure : ce qui va bien (avec un chiffre), ce qui doit progresser (avec un chiffre), et deux actions concrètes pour la semaine qui vient. 120 mots au plus, ton chaleureux et précis, sans jargon. L'élève s'appelle « [Prénom] » : écris exactement « [Prénom] » là où son prénom doit apparaître.`

export function donneesBilan(p: {
  destinataire: DestinataireBilan
  classe: string | null
  semaines: readonly Semaine[]
  avancee: Avancee
  objectif: Objectif | null
  matieres: readonly { subject: string; ratio: number; attempts: number }[]
  fiche: FicheEntree | null
  controles: readonly { matiere: string; date: string }[]
}): string {
  const lignes = [
    `Destinataire : ${p.destinataire === 'parent' ? 'ses parents (vouvoiement)' : 'l’élève lui-même (tutoiement)'}.`,
    `Classe : ${p.classe ?? 'non renseignée'}.`,
    `Cette semaine (depuis lundi) : ${p.avancee.minutes} min de travail, ${p.avancee.jours} jours actifs, ${p.avancee.quiz} quiz.`,
    p.objectif
      ? `Objectif fixé par le coach : ${[p.objectif.minutes ? `${p.objectif.minutes} min` : null, p.objectif.jours ? `${p.objectif.jours} jours` : null, p.objectif.quiz ? `${p.objectif.quiz} quiz` : null].filter(Boolean).join(', ')}.`
      : 'Pas d’objectif fixé cette semaine.',
    `Huit dernières semaines (minutes) : ${p.semaines.map((s) => s.minutes).join(', ')}.`,
    p.matieres.length
      ? `Scores moyens aux quiz par matière : ${p.matieres.map((m) => `${m.subject} ${Math.round(m.ratio * 100)} % (${m.attempts} quiz)`).join(' ; ')}.`
      : 'Pas encore de quiz.',
    p.controles.length ? `Contrôles à venir : ${p.controles.map((c) => `${c.matiere} le ${c.date}`).join(' ; ')}.` : '',
    p.fiche?.objectif ? `Objectif de l’élève (fiche d’entrée) : ${p.fiche.objectif}.` : '',
    p.fiche?.pointsFaibles ? `Points faibles déclarés : ${p.fiche.pointsFaibles}.` : '',
  ]
  return lignes.filter(Boolean).join('\n')
}

// --------------------------------------------------------------- le brouillon ---
export type IntentionBrouillon = 'relance' | 'felicitations' | 'controle' | 'objectif' | 'libre'

export const INTENTIONS: { id: IntentionBrouillon; libelle: string; consigne: string }[] = [
  { id: 'relance', libelle: 'Relancer', consigne: 'Relance un élève qui décroche, sans culpabiliser : propose un petit pas concret pour aujourd’hui.' },
  { id: 'felicitations', libelle: 'Féliciter', consigne: 'Félicite l’élève pour un progrès précis tiré des données, et donne-lui envie de continuer.' },
  { id: 'controle', libelle: 'Avant un contrôle', consigne: 'Prépare l’élève à son prochain contrôle : un plan simple en trois temps d’ici la date.' },
  { id: 'objectif', libelle: 'Annoncer l’objectif', consigne: 'Annonce l’objectif de la semaine et explique pourquoi il est atteignable.' },
  { id: 'libre', libelle: 'Libre', consigne: 'Suis exactement la consigne du coach.' },
]

export const CONSIGNE_BROUILLON = `Tu rédiges un message qu'un coach scolaire enverra, après relecture, sur la messagerie de l'application Studuel. 60 mots au plus, ton chaleureux et direct, aucune formule creuse. L'élève s'appelle « [Prénom] » : écris exactement « [Prénom] » là où son prénom doit apparaître. N'invente aucun fait absent des données.`

/** Remplace le jeton [Prénom] par le vrai prénom (côté app, jamais envoyé à Claude). */
export function avecPrenom(texte: string, prenom: string): string {
  return texte.replace(/\[Pr[ée]nom\]/g, prenom)
}

// --------------------------------------------------------------- le résumé ---
export const CONSIGNE_RESUME = `Résume un fil de messagerie entre un coach scolaire et un élève (ou ses parents), pour que le coach reprenne le fil vite : 3 à 5 puces factuelles (demandes, engagements, sujets en suspens), puis « À faire » : la prochaine action du coach. Les participants sont nommés COACH, ÉLÈVE et PARENT : garde ces mots. Français, 90 mots au plus.`

/** Le fil, sans noms, prêt pour Claude (les 80 derniers messages, bornés). */
export function filPourResume(messages: readonly { auteurRole: string | null; corps: string; creeLe: string; pieceType: string | null }[]): string {
  const ROLE: Record<string, string> = { coach: 'COACH', eleve: 'ÉLÈVE', parent: 'PARENT' }
  return [...messages]
    .sort((a, b) => a.creeLe.localeCompare(b.creeLe))
    .slice(-80)
    .map((m) => `${m.creeLe.slice(0, 16).replace('T', ' ')} ${ROLE[m.auteurRole ?? ''] ?? 'AUTRE'} : ${m.corps.slice(0, 600) || (m.pieceType === 'image' ? '[photo]' : '[document]')}`)
    .join('\n')
}

/** La clé du cache d'un travail (un tri par jour, un bilan par élève et par jour). */
export function cleCache(travail: 'tri' | 'bilan', jour: string, suffixe = ''): string {
  return `${travail}:${jour}${suffixe ? `:${suffixe}` : ''}`
}

/**
 * Masque des prénoms connus dans un texte libre avant qu'il parte chez Claude
 * (un message, une remarque de la fiche d'entrée peuvent en contenir). Mots
 * entiers, sans tenir compte de la casse ; les prénoms de moins de 3 lettres
 * sont laissés (trop de faux positifs).
 */
export function masquerNoms(texte: string, noms: readonly (string | null | undefined)[], remplacement = '[Prénom]'): string {
  let out = texte
  const uniques = [...new Set(noms.map((n) => (n ?? '').trim()).filter((n) => n.length >= 3))].sort((a, b) => b.length - a.length)
  for (const nom of uniques) {
    const echappe = nom.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    out = out.replace(new RegExp(`(?<![\\p{L}\\p{N}])${echappe}(?![\\p{L}\\p{N}])`, 'giu'), remplacement)
  }
  return out
}
