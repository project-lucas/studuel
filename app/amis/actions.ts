'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { addFriendMessage, type AddFriendStatus } from '@/lib/social'
import { addToSquad, removeFromSquad } from '@/lib/gems-access'
import { MAX_SQUAD_SIZE } from '@/lib/gems'

// Statuts renvoyés par la fonction SQL add_friend_by_code (migration 019).
const ADD_STATUSES: readonly AddFriendStatus[] = [
  'sent',
  'already',
  'self',
  'not_found',
]

// Un code ami fait 6 caractères (A-Z sans 0/O/1/I/L, 2-9) — on tolère 4→10
// pour laisser passer d'éventuelles variantes, la fonction SQL tranche.
const CODE_RE = /^[A-Z0-9]{4,10}$/
// Les identifiants d'amis viennent de nos propres données (UUID). On valide
// avant de les injecter dans un filtre PostgREST (`.or(...)`).
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Ajoute un ami par son code. Retourne { ok, message } prêt à afficher.
export async function addFriendByCode(
  code: string,
): Promise<{ ok: boolean; message: string }> {
  const clean = (code ?? '').trim().toUpperCase()
  if (!CODE_RE.test(clean)) return addFriendMessage('not_found')

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('add_friend_by_code', {
    p_code: clean,
  })
  if (error) return addFriendMessage('error')

  const status: AddFriendStatus = ADD_STATUSES.includes(data as AddFriendStatus)
    ? (data as AddFriendStatus)
    : 'error'
  revalidatePath('/amis')
  return addFriendMessage(status)
}

// Renomme le groupe d'amis (« squad ») — migration 176. Écrit sur MON profil
// (profiles.squad_name), borné à 40 caractères. La règle « seul le leader peut
// renommer » est une mécanique de jeu portée par l'UI ; côté données, chacun ne
// touche que son propre profil (RLS owner-only + GRANT colonne), donc rien à
// sécuriser de plus ici. Renvoie le nom retenu (ou null si effacé/invalide).
const MAX_SQUAD_LEN = 40

export async function renameSquad(
  name: string,
): Promise<{ ok: boolean; name: string | null }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, name: null }

  // Nettoyage : on retire les retours à la ligne / caractères de contrôle,
  // on rogne et on borne. Une chaîne vide efface le nom (retour au défaut).
  const clean = String(name ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .trim()
    .slice(0, MAX_SQUAD_LEN)
  const value = clean.length > 0 ? clean : null

  const { error } = await supabase
    .from('profiles')
    .update({ squad_name: value })
    .eq('id', user.id)
  if (error) {
    console.error('[amis] renommage du groupe impossible:', error.message)
    return { ok: false, name: null }
  }
  revalidatePath('/amis')
  return { ok: true, name: value }
}

// Statuts renvoyés par add_friend_qr (migration 163) — amitié instantanée.
const QR_STATUSES: readonly AddFriendStatus[] = [
  'added',
  'already',
  'self',
  'not_found',
]

// Ajoute un ami par scan de QR code : amitié acceptée DIRECTEMENT (les deux
// téléphones sont côte à côte, le scan vaut consentement mutuel). Si la
// migration 163 n'est pas encore passée (RPC absente), on se replie sur la
// demande classique add_friend_by_code — l'élève reçoit alors une demande.
export async function addFriendByQr(
  code: string,
): Promise<{ ok: boolean; message: string }> {
  const clean = (code ?? '').trim().toUpperCase()
  if (!CODE_RE.test(clean)) return addFriendMessage('not_found')

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('add_friend_qr', {
    p_code: clean,
  })
  if (error) return addFriendByCode(clean)

  const status: AddFriendStatus = QR_STATUSES.includes(data as AddFriendStatus)
    ? (data as AddFriendStatus)
    : 'error'
  revalidatePath('/amis')
  return addFriendMessage(status)
}

// Accepte une demande d'ami reçue (fonction accept_friend, SECURITY DEFINER).
export async function acceptFriend(
  requesterId: string,
): Promise<{ ok: boolean }> {
  if (!UUID_RE.test(requesterId ?? '')) return { ok: false }

  const supabase = await createClient()
  const { error } = await supabase.rpc('accept_friend', {
    p_requester: requesterId,
  })
  if (error) return { ok: false }
  revalidatePath('/amis')
  return { ok: true }
}

// Lance un duel contre un ami accepté (fonction create_duel : exige l'amitié,
// 1 duel/jour par challenger via contrainte unique). Retourne l'id ou null.
export async function createDuel(
  opponentId: string,
  subject: string,
): Promise<{ id: string | null }> {
  if (!UUID_RE.test(opponentId ?? '')) return { id: null }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('create_duel', {
    p_opponent: opponentId,
    p_subject: (subject ?? 'Duel').slice(0, 80),
  })
  if (error || !data) return { id: null }
  revalidatePath('/amis')
  return { id: String(data) }
}

// Dépose son score sur un duel (fonction submit_duel_score : une fois par camp,
// borné à [0, total] côté SQL). Appelé par le Défi à la fin de la partie.
export async function submitDuelScore(
  duelId: string,
  score: number,
): Promise<{ ok: boolean }> {
  if (!UUID_RE.test(duelId ?? '') || !Number.isFinite(score)) {
    return { ok: false }
  }
  const supabase = await createClient()
  const { error } = await supabase.rpc('submit_duel_score', {
    p_duel: duelId,
    p_score: Math.max(0, Math.floor(score)),
  })
  if (error) return { ok: false }
  revalidatePath('/amis')
  return { ok: true }
}

// Retire un ami, ou annule/refuse une demande. La policy friendships_delete_own
// n'autorise à supprimer que ses propres lignes → cibler l'autre partie suffit,
// la RLS garantit qu'aucune ligne étrangère n'est touchée.
export async function removeFriend(
  friendId: string,
): Promise<{ ok: boolean }> {
  if (!UUID_RE.test(friendId ?? '')) return { ok: false }

  const supabase = await createClient()
  const { error } = await supabase
    .from('friendships')
    .delete()
    .or(`requester_id.eq.${friendId},addressee_id.eq.${friendId}`)
  if (error) return { ok: false }
  revalidatePath('/amis')
  return { ok: true }
}

// -----------------------------------------------------------------------------
// Squad — le cercle intime, distinct des relations (migration 183).
//
// Ajouter quelqu'un crée une RELATION : elle compte pour le parrainage, les
// classements et les duels, et on veut qu'il y en ait beaucoup. Le SQUAD est un
// sous-ensemble choisi à la main, plafonné à MAX_SQUAD_SIZE. Sans cette
// séparation, accepter un inconnu pour gagner une gemme polluerait le
// classement entre vrais copains — et les élèves cesseraient d'ajouter, ce qui
// tuerait précisément le levier viral qu'on cherche à créer.
//
// La composition est PRIVÉE et unilatérale : personne ne sait s'il figure dans
// le squad d'un autre, donc il n'y a rien à refuser et personne à blesser.
// -----------------------------------------------------------------------------

const SQUAD_MESSAGES: Record<string, string> = {
  added: 'Ajouté à ton groupe.',
  already: 'Il est déjà dans ton groupe.',
  full: `Ton groupe est complet (${MAX_SQUAD_SIZE} maximum).`,
  not_friend: 'Il faut d’abord être amis.',
  self: 'Tu es déjà dans ton propre groupe !',
  error: 'Impossible pour le moment. Réessaie.',
}

export async function addFriendToSquad(
  memberId: string,
): Promise<{ ok: boolean; message: string }> {
  if (!UUID_RE.test(memberId ?? '')) {
    return { ok: false, message: SQUAD_MESSAGES.error }
  }

  const supabase = await createClient()
  const result = await addToSquad(supabase, memberId)
  if (result === 'added' || result === 'already') revalidatePath('/amis')

  return {
    ok: result === 'added' || result === 'already',
    message: SQUAD_MESSAGES[result] ?? SQUAD_MESSAGES.error,
  }
}

export async function removeFriendFromSquad(
  memberId: string,
): Promise<{ ok: boolean }> {
  if (!UUID_RE.test(memberId ?? '')) return { ok: false }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false }

  const ok = await removeFromSquad(supabase, user.id, memberId)
  if (ok) revalidatePath('/amis')
  return { ok }
}
