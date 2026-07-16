'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { addFriendMessage, type AddFriendStatus } from '@/lib/social'

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
