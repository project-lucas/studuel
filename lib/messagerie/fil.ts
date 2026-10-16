// -----------------------------------------------------------------------------
// LA MESSAGERIE — la logique pure (16/10/2026, migration 587).
//
// Les fils coach ↔ élève, coach ↔ parent et le trio, façon WhatsApp : les
// lignes de la base normalisées, le titre d'un fil vu par chacun, les messages
// rangés par jour (« Aujourd'hui », « Hier », « lundi 12 octobre ») et regroupés
// par auteur, les erreurs de la base dites en français. Sans réseau, testé.
// -----------------------------------------------------------------------------

export type TypeFil = 'eleve' | 'parent' | 'trio'
export type RoleFil = 'coach' | 'eleve' | 'parent'
export type Consentement = 'parent_app' | 'papier' | 'majeur'

export type Fil = {
  id: string
  type: TypeFil
  coachId: string
  coachPrenom: string
  eleveId: string
  elevePrenom: string
  eleveClasse: string | null
  parentPrenom: string | null
  consentement: Consentement | null
  /** Mon rôle dans le fil ; null quand l'admin le lit en supervision. */
  monRole: RoleFil | null
  creeLe: string
  dernierMessageLe: string | null
  dernierExtrait: string | null
  dernierAuteurMoi: boolean
  nonLus: number
  peutEcrire: boolean
  signalements: number
}

export type Message = {
  id: string
  auteurId: string | null
  auteurPrenom: string
  auteurRole: RoleFil | null
  corps: string
  pieceChemin: string | null
  pieceNom: string | null
  pieceType: 'image' | 'pdf' | null
  creeLe: string
  /** Côté client : un message en cours d'envoi (optimiste). */
  enEnvoi?: boolean
  /** Côté client : l'envoi a échoué. */
  echec?: boolean
}

const TYPES: readonly TypeFil[] = ['eleve', 'parent', 'trio']
const ROLES: readonly RoleFil[] = ['coach', 'eleve', 'parent']
const CONSENTEMENTS: readonly Consentement[] = ['parent_app', 'papier', 'majeur']

const texte = (v: unknown): string => (typeof v === 'string' ? v : '')
const texteOuNull = (v: unknown): string | null => (typeof v === 'string' && v.length > 0 ? v : null)
function parmi<T extends string>(v: unknown, liste: readonly T[]): T | null {
  return typeof v === 'string' && (liste as readonly string[]).includes(v) ? (v as T) : null
}

export function filDepuis(r: Record<string, unknown>): Fil {
  return {
    id: texte(r.id),
    type: parmi(r.type, TYPES) ?? 'eleve',
    coachId: texte(r.coach_id),
    coachPrenom: texte(r.coach_prenom) || 'Coach',
    eleveId: texte(r.eleve_id),
    elevePrenom: texte(r.eleve_prenom) || 'Élève',
    eleveClasse: texteOuNull(r.eleve_classe),
    parentPrenom: texteOuNull(r.parent_prenom),
    consentement: parmi(r.consentement, CONSENTEMENTS),
    monRole: parmi(r.mon_role, ROLES),
    creeLe: texte(r.cree_le),
    dernierMessageLe: texteOuNull(r.dernier_message_le),
    dernierExtrait: texteOuNull(r.dernier_extrait),
    dernierAuteurMoi: r.dernier_auteur_moi === true,
    nonLus: Math.max(0, Number(r.non_lus ?? 0) || 0),
    peutEcrire: r.peut_ecrire === true,
    signalements: Math.max(0, Number(r.signalements ?? 0) || 0),
  }
}

export function messageDepuis(r: Record<string, unknown>): Message {
  return {
    id: texte(r.id),
    auteurId: texteOuNull(r.auteur_id),
    auteurPrenom: texte(r.auteur_prenom) || 'Ancien membre',
    auteurRole: parmi(r.auteur_role, ROLES),
    corps: texte(r.corps),
    pieceChemin: texteOuNull(r.piece_chemin),
    pieceNom: texteOuNull(r.piece_nom),
    pieceType: parmi(r.piece_type, ['image', 'pdf'] as const),
    creeLe: texte(r.cree_le),
  }
}

/** Le titre d'un fil : ce que JE vois en tête (le coach voit l'élève, l'élève voit son coach). */
export function titreFil(f: Fil): string {
  const vu = f.monRole ?? 'coach'
  if (vu === 'coach') {
    if (f.type === 'eleve') return f.elevePrenom
    if (f.type === 'parent') return f.parentPrenom ? `${f.parentPrenom} (parent de ${f.elevePrenom})` : `Parent de ${f.elevePrenom}`
    return `${f.elevePrenom} et ${f.parentPrenom ?? 'son parent'}`
  }
  if (vu === 'eleve') return f.type === 'trio' ? `${f.coachPrenom}, toi et ${f.parentPrenom ?? 'ton parent'}` : f.coachPrenom
  // Le parent.
  return f.type === 'trio' ? `${f.coachPrenom}, ${f.elevePrenom} et vous` : `${f.coachPrenom} · coach de ${f.elevePrenom}`
}

/** La ligne grise sous le titre : la sorte de fil. */
export function sousTitreFil(f: Fil): string {
  if (f.type === 'eleve') return f.eleveClasse ? `Fil élève · ${f.eleveClasse}` : 'Fil élève'
  if (f.type === 'parent') return 'Fil parent'
  return 'Élève et parent'
}

export const LIBELLE_TYPE: Record<TypeFil, string> = {
  eleve: 'Élève',
  parent: 'Parent',
  trio: 'Élève + parent',
}

export const LIBELLE_CONSENTEMENT: Record<Consentement, string> = {
  parent_app: 'Parent lié dans l’app',
  papier: 'Consentement écrit recueilli',
  majeur: 'Élève majeur',
}

/** La phrase de transparence affichée en tête d'un fil, pour l'élève et le parent. */
export function avertissementFil(f: Fil): string {
  if (f.monRole === 'coach') return 'Ce fil est archivé : rien ne s’efface, l’administration de Studuel peut le relire.'
  if (f.type === 'eleve' && f.consentement === 'parent_app')
    return 'Ton parent sait que ce fil existe. Tout reste archivé : si un message te gêne, signale-le.'
  return 'Tout reste archivé. Si un message te gêne, signale-le (appui long ou ⋯ sur le message).'
}

// --------------------------------------------------------------- l'heure ---
const FUSEAU = 'Europe/Paris'

/** « 14:05 » à l'heure de Paris. */
export function heure(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: FUSEAU }).format(d)
}

/** La clé de jour à Paris, `YYYY-MM-DD`. */
export function jourParis(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  // en-CA donne AAAA-MM-JJ.
  return new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: FUSEAU }).format(d)
}

const JOUR_MS = 86_400_000
function ecartJours(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / JOUR_MS)
}

/** « Aujourd'hui », « Hier », « mardi », « lundi 12 octobre », « 3 mars 2025 ». */
export function libelleJour(jour: string, aujourdhui: string): string {
  const ecart = ecartJours(jour, aujourdhui)
  if (ecart === 0) return 'Aujourd’hui'
  if (ecart === 1) return 'Hier'
  const d = new Date(`${jour}T12:00:00Z`)
  if (ecart > 1 && ecart < 7) return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', timeZone: 'UTC' }).format(d)
  const memeAnnee = jour.slice(0, 4) === aujourdhui.slice(0, 4)
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: memeAnnee ? 'long' : undefined,
    day: 'numeric',
    month: 'long',
    year: memeAnnee ? undefined : 'numeric',
    timeZone: 'UTC',
  }).format(d)
}

/** L'heure courte d'une ligne de la liste des fils : « 14:05 », « Hier », « lun. », « 12/10 ». */
export function horodatageListe(iso: string | null, maintenant: Date): string {
  if (!iso) return ''
  const jour = jourParis(iso)
  const auj = jourParis(maintenant.toISOString())
  const ecart = ecartJours(jour, auj)
  if (ecart <= 0) return heure(iso)
  if (ecart === 1) return 'Hier'
  const d = new Date(`${jour}T12:00:00Z`)
  if (ecart < 7) return new Intl.DateTimeFormat('fr-FR', { weekday: 'short', timeZone: 'UTC' }).format(d)
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' }).format(d)
}

export type BlocMessages = {
  /** Un séparateur de jour, ou un groupe de messages consécutifs d'un même auteur. */
  type: 'jour' | 'groupe'
  cle: string
  libelle?: string
  auteurId?: string | null
  auteurPrenom?: string
  auteurRole?: RoleFil | null
  messages?: Message[]
}

/** Écart au-delà duquel deux messages du même auteur ne se collent plus. */
const COLLE_MS = 5 * 60_000

/**
 * Les messages (dans n'importe quel ordre) rangés pour l'affichage, du plus
 * ancien au plus récent : un séparateur par jour, et les messages d'un même
 * auteur à moins de 5 minutes d'intervalle collés dans un même groupe.
 */
export function rangerMessages(messages: readonly Message[], aujourdhui: string): BlocMessages[] {
  const tries = [...messages].sort((a, b) => a.creeLe.localeCompare(b.creeLe))
  const blocs: BlocMessages[] = []
  let jourCourant = ''
  let groupe: BlocMessages | null = null
  for (const m of tries) {
    const jour = jourParis(m.creeLe)
    if (jour !== jourCourant) {
      jourCourant = jour
      blocs.push({ type: 'jour', cle: `j-${jour}`, libelle: libelleJour(jour, aujourdhui) })
      groupe = null
    }
    const dernier = groupe?.messages?.[groupe.messages.length - 1]
    const colle =
      groupe !== null &&
      dernier !== undefined &&
      groupe.auteurId === m.auteurId &&
      Date.parse(m.creeLe) - Date.parse(dernier.creeLe) < COLLE_MS
    if (colle && groupe) {
      groupe.messages = [...(groupe.messages ?? []), m]
    } else {
      groupe = {
        type: 'groupe',
        cle: `g-${m.id}`,
        auteurId: m.auteurId,
        auteurPrenom: m.auteurPrenom,
        auteurRole: m.auteurRole,
        messages: [m],
      }
      blocs.push(groupe)
    }
  }
  return blocs
}

/** Fusionne des messages (pages, direct, optimistes) sans doublon, du plus récent au plus ancien. */
export function fusionnerMessages(actuels: readonly Message[], nouveaux: readonly Message[]): Message[] {
  const parId = new Map<string, Message>()
  for (const m of actuels) parId.set(m.id, m)
  for (const m of nouveaux) parId.set(m.id, m)
  return [...parId.values()].sort((a, b) => b.creeLe.localeCompare(a.creeLe))
}

// --------------------------------------------------------------- l'envoi ---
export const CORPS_MAX = 4000

export type VerdictCorps = { ok: true; corps: string } | { ok: false; erreur: string }

export function verifierCorps(brut: string, avecPiece: boolean): VerdictCorps {
  const corps = brut.replace(/\r\n/g, '\n').trim()
  if (corps.length > CORPS_MAX) return { ok: false, erreur: `Ton message est trop long (${corps.length} / ${CORPS_MAX} caractères).` }
  if (corps.length === 0 && !avecPiece) return { ok: false, erreur: 'Écris un message ou joins une photo.' }
  return { ok: true, corps }
}

export const PIECE_MAX_OCTETS = 8 * 1024 * 1024
const MIMES_IMAGE = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

/** La sorte de pièce jointe et son extension, ou une erreur en français. */
export function verifierPiece(
  fichier: { type: string; size: number; name: string },
): { ok: true; type: 'image' | 'pdf'; extension: string } | { ok: false; erreur: string } {
  if (fichier.size > PIECE_MAX_OCTETS) return { ok: false, erreur: 'Le fichier dépasse 8 Mo.' }
  if (fichier.type === 'application/pdf') return { ok: true, type: 'pdf', extension: 'pdf' }
  if (MIMES_IMAGE.includes(fichier.type)) {
    const extension = fichier.type === 'image/jpeg' ? 'jpg' : fichier.type.slice('image/'.length)
    return { ok: true, type: 'image', extension }
  }
  return { ok: false, erreur: 'Seules les photos (JPEG, PNG, WebP, GIF) et les PDF sont acceptés.' }
}

/** Les erreurs levées par la base (587), dites à l'utilisateur. */
export function messageErreurBase(brut: string | undefined | null): string {
  const m = brut ?? ''
  if (m.includes('majeur_improbable')) return 'Cet élève n’est pas en terminale : « majeur » ne peut pas remplacer l’accord de ses parents.'
  if (m.includes('consentement')) return 'Coche le consentement : aucun parent n’est lié à cet élève dans l’app.'
  if (m.includes('sans_parent')) return 'Aucun parent n’est lié à cet élève dans l’app.'
  if (m.includes('eleve_inconnu')) return 'Cet élève n’est pas (ou plus) dans tes groupes.'
  if (m.includes('coach_seulement')) return 'Seul un coach peut ouvrir une conversation.'
  if (m.includes('lien_rompu')) return 'L’élève a quitté le groupe : la conversation est en lecture seule.'
  if (m.includes('trop_vite')) return 'Doucement : trop de messages en une minute.'
  if (m.includes('pas_membre')) return 'Tu ne fais pas partie de cette conversation.'
  if (m.includes('trop_long')) return 'Message trop long.'
  if (m.includes('piece_invalide')) return 'La pièce jointe n’a pas pu être jointe.'
  if (m.includes('vide')) return 'Écris un message ou joins une photo.'
  return 'Le message n’est pas parti. Réessaie.'
}

/** Le total des non-lus d'une liste de fils. */
export function totalNonLus(fils: readonly Fil[]): number {
  return fils.reduce((n, f) => n + (f.monRole ? f.nonLus : 0), 0)
}

/** Filtrer la liste des fils : recherche sans accent sur le titre, et sorte de fil. */
export function filtrerFils(fils: readonly Fil[], recherche: string, type: TypeFil | null): Fil[] {
  const q = sansAccent(recherche.trim())
  return fils.filter(
    (f) =>
      (type === null || f.type === type) &&
      (q === '' || sansAccent(`${titreFil(f)} ${f.elevePrenom} ${f.coachPrenom}`).includes(q)),
  )
}

export function sansAccent(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}
