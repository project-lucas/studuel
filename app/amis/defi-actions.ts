'use server'

import { cookies } from 'next/headers'
import { after } from 'next/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import webpush from 'web-push'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import {
  COOKIE_DEFI,
  COOKIE_DEFI_SECONDES,
  MODE_PAR_DEFAUT,
  encoderDefi,
  lireDefi,
  messageDefi,
} from '@/lib/amis/defi-ami'
import { isEpreuveId, type EpreuveId } from '@/lib/palmares/epreuves'
import { lireFicheJoueur, type FicheJoueur } from '@/lib/amis/fiche-joueur'

// -----------------------------------------------------------------------------
// DÉFIER UN AMI (05/10/2026, migration 558) — le parcours est décrit dans
// lib/amis/defi-ami.ts. Chaque action rend `{ ok: false }` sans bruit quand la
// 558 n'est pas en base : le bouton dit alors que le défi arrive bientôt.
// -----------------------------------------------------------------------------

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

type Resultat = { ok: true; duelId: string } | { ok: false; raison: 'absent' | 'refus' }

/**
 * 1. Toucher un ami : le duel est créé (mode par défaut, changé à l'étape
 * suivante) et l'ami est prévenu par une notification — après la réponse,
 * l'écran n'attend pas l'envoi.
 */
export async function inviterAmiAuDefi(amiId: string): Promise<Resultat> {
  if (!UUID.test(amiId ?? '')) return { ok: false, raison: 'refus' }
  const user = await getCurrentUser()
  if (!user) return { ok: false, raison: 'refus' }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('creer_defi_ami', { p_ami: amiId, p_mode: MODE_PAR_DEFAUT })
  if (error) {
    if (error.code !== 'PGRST202') console.error('[amis] défi non créé:', error.message)
    return { ok: false, raison: error.code === 'PGRST202' ? 'absent' : 'refus' }
  }
  if (!data) return { ok: false, raison: 'refus' }
  const duelId = String(data)
  after(() => notifierAmi(duelId, user.id))
  return { ok: true, duelId }
}

/**
 * 2. Choisir le mode : le duel passe sur ce mode (tant que personne n'a joué)
 * et le cookie du défi en cours est posé — c'est lui que la fin de partie lit.
 */
export async function choisirModeDuDefi(amiId: string, mode: string): Promise<Resultat> {
  if (!UUID.test(amiId ?? '') || !isEpreuveId(mode)) return { ok: false, raison: 'refus' }
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('creer_defi_ami', { p_ami: amiId, p_mode: mode })
  if (error || !data) return { ok: false, raison: error?.code === 'PGRST202' ? 'absent' : 'refus' }
  await poserCookie(String(data), mode)
  return { ok: true, duelId: String(data) }
}

/** L'ami défié relève le défi : même mode, même cookie. */
export async function releverDefi(duelId: string): Promise<{ ok: boolean; mode?: EpreuveId }> {
  if (!UUID.test(duelId ?? '')) return { ok: false }
  const supabase = await createClient()
  const { data } = await supabase
    .from('duels')
    .select('id, mode_id, opponent_score')
    .eq('id', duelId)
    .maybeSingle()
  const mode = data?.mode_id
  if (!data || data.opponent_score !== null || !isEpreuveId(mode)) return { ok: false }
  await poserCookie(duelId, mode)
  return { ok: true, mode }
}

async function poserCookie(duelId: string, mode: EpreuveId): Promise<void> {
  const jar = await cookies()
  jar.set(COOKIE_DEFI, encoderDefi(duelId, mode), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COOKIE_DEFI_SECONDES,
  })
}

/**
 * 4. Appelé par la fin de partie (recordModeScore) : si un défi court sur CE
 * mode, le score y est déposé, une fois, puis le cookie est effacé.
 */
export async function deposerScoreDuDefi(mode: EpreuveId, score: number): Promise<void> {
  const jar = await cookies()
  const defi = lireDefi(jar.get(COOKIE_DEFI)?.value)
  if (!defi || defi.mode !== mode) return
  jar.delete(COOKIE_DEFI)
  const supabase = await createClient()
  const { error } = await supabase.rpc('submit_duel_score', {
    p_duel: defi.duelId,
    p_score: Math.max(0, Math.floor(score)),
  })
  if (error) console.error('[amis] score du défi non déposé:', error.message)
}

/**
 * La notification de l'ami défié. La RPC (rôle service seulement) vérifie que
 * le duel est bien celui du lanceur, frais, et pas encore notifié.
 */
async function notifierAmi(duelId: string, lanceurId: string): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const vapidPublic = process.env.VAPID_PUBLIC_KEY
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY
  if (!url || !serviceKey || !vapidPublic || !vapidPrivate) return

  const admin = createAdmin(url, serviceKey, { auth: { persistSession: false } })
  const { data, error } = await admin.rpc('defi_ami_cibles_push', { p_duel: duelId, p_lanceur: lanceurId })
  if (error || !Array.isArray(data) || data.length === 0) return

  webpush.setVapidDetails(process.env.VAPID_SUBJECT ?? 'mailto:contact@studuel.app', vapidPublic, vapidPrivate)
  await Promise.all(
    data.map(async (t: { endpoint: string; p256dh: string; auth: string; lanceur: string }) => {
      try {
        await webpush.sendNotification(
          { endpoint: t.endpoint, keys: { p256dh: t.p256dh, auth: t.auth } },
          JSON.stringify(messageDefi(t.lanceur)),
        )
      } catch (err: unknown) {
        const code = err && typeof err === 'object' && 'statusCode' in err ? (err as { statusCode?: number }).statusCode : undefined
        if (code === 404 || code === 410) {
          await admin.from('push_subscriptions').delete().eq('endpoint', t.endpoint)
        } else {
          console.error('[amis] notification du défi:', code ?? err)
        }
      }
    }),
  )
}

/**
 * La fiche d'un ami ou d'un membre de ma ligue (`fiche_joueur`, 558). La base
 * refuse tout autre élève ; `absent` tant que la migration n'est pas passée.
 */
export async function lireFicheJoueurAction(id: string): Promise<FicheJoueur | 'absent' | null> {
  if (!UUID.test(id ?? '')) return null
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('fiche_joueur', { p_user: id })
  if (error) return error.code === 'PGRST202' ? 'absent' : null
  return lireFicheJoueur(data)
}
