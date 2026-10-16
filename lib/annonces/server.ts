import 'server-only'

import { createClient } from '@/lib/supabase/server'
import { clientService, envoyerPushs } from '@/lib/push-envoi'
import { annonceAuteurDepuis, type AnnonceAuteur, type Question, type ReponseBrute } from '@/lib/annonces/annonces'

/** Mes annonces (toutes pour l'admin), ou null sans la migration 588. */
export async function lireAnnoncesAuteur(): Promise<AnnonceAuteur[] | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('annonces_auteur', { p_limite: 150 })
  if (error) return null
  return (Array.isArray(data) ? data : []).map((r) => annonceAuteurDepuis(r as Record<string, unknown>))
}

export async function lireResultats(id: string): Promise<{ questions: Question[]; anonyme: boolean; reponses: ReponseBrute[] } | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('sondage_resultats', { p_annonce: id })
  if (error || !data || typeof data !== 'object') return null
  const d = data as { questions?: unknown; anonyme?: boolean; reponses?: unknown }
  const questions = Array.isArray(d.questions)
    ? (d.questions as Record<string, unknown>[]).map((q) => ({
        id: String(q.id ?? ''),
        type: q.type as Question['type'],
        libelle: String(q.libelle ?? ''),
        options: Array.isArray(q.options) ? q.options.map(String) : undefined,
      }))
    : []
  const reponses = Array.isArray(d.reponses)
    ? (d.reponses as Record<string, unknown>[]).map((r) => ({
        reponses: (r.reponses ?? {}) as Record<string, unknown>,
        creeLe: String(r.cree_le ?? ''),
        prenom: typeof r.prenom === 'string' ? r.prenom : null,
        classe: typeof r.classe === 'string' ? r.classe : null,
      }))
    : []
  return { questions, anonyme: d.anonyme === true, reponses }
}

/** La notification push d'une annonce tout juste publiée (une seule fois, vérifié en base). */
export async function notifierAnnonce(id: string): Promise<number> {
  const admin = clientService()
  if (!admin) return 0
  const { data, error } = await admin.rpc('annonce_cibles_push', { p_annonce: id })
  if (error || !Array.isArray(data) || data.length === 0) return 0
  return envoyerPushs(
    admin,
    data.map((r) => {
      const t = r as { endpoint: string; p256dh: string; auth: string; titre: string; type: string }
      return {
        appareil: { endpoint: t.endpoint, p256dh: t.p256dh, auth: t.auth },
        message: {
          kind: `annonce-${id}`,
          title: t.type === 'sondage' ? 'Un sondage pour toi' : 'Studuel',
          body: t.titre,
          url: '/',
        },
      }
    }),
  )
}
