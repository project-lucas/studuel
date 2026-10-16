'use server'

import { after } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { ficheEntreeVersPayload, type FicheEntree } from '@/lib/coach/suivi'
import { lireDetail, lireFicheEntree, prendreJetonIA } from '@/lib/coach/suivi-server'
import { lireFiche } from '@/lib/coach/server'
import { messageErreurBase, type TypeFil } from '@/lib/messagerie/fil'
import { notifierMessage } from '@/lib/messagerie/server'
import {
  avecPrenom,
  cleCache,
  CONSIGNE_BILAN,
  CONSIGNE_BROUILLON,
  donneesBilan,
  INTENTIONS,
  masquerNoms,
  type DestinataireBilan,
  type IntentionBrouillon,
} from '@/lib/coach/assistant'
import { demanderTexte } from '@/lib/coach/claude-server'

/**
 * LES GESTES DE LA FICHE D'UN ÉLÈVE (16/10/2026, migrations 587 et 591).
 * Chaque RPC revérifie en base que le coach suit l'élève.
 */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
type R = { ok: true } | { ok: false; erreur: string }

export async function enregistrerFicheEntreeAction(eleveId: string, fiche: FicheEntree): Promise<R> {
  if (!UUID.test(eleveId)) return { ok: false, erreur: 'Demande invalide.' }
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('coach_fiche_entree_enregistrer', { p_eleve: eleveId, p: ficheEntreeVersPayload(fiche) })
  if (error || data !== true) return { ok: false, erreur: 'La fiche n’a pas été enregistrée.' }
  revalidatePath(`/coach/eleves/${eleveId}`)
  return { ok: true }
}

export async function ajouterNoteAction(eleveId: string, corps: string): Promise<R> {
  if (!UUID.test(eleveId) || !corps.trim()) return { ok: false, erreur: 'Écris la note.' }
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('coach_note_ajouter', { p_eleve: eleveId, p_corps: corps.slice(0, 2000) })
  if (error || data == null) return { ok: false, erreur: 'La note n’a pas été enregistrée.' }
  revalidatePath(`/coach/eleves/${eleveId}`)
  return { ok: true }
}

export async function effacerNoteAction(eleveId: string, noteId: number): Promise<R> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('coach_note_effacer', { p_id: noteId })
  if (error || data !== true) return { ok: false, erreur: 'La note n’a pas été effacée.' }
  revalidatePath(`/coach/eleves/${eleveId}`)
  return { ok: true }
}

/** Ouvre le fil (au besoin) et y dépose un texte — l'assistant propose, le coach envoie. */
export async function envoyerDansFilAction(
  eleveId: string,
  type: TypeFil,
  texte: string,
  consentement: 'papier' | 'majeur' | null = null,
): Promise<{ ok: true; filId: string } | { ok: false; erreur: string }> {
  if (!UUID.test(eleveId) || !texte.trim()) return { ok: false, erreur: 'Rien à envoyer.' }
  const supabase = await createClient()
  const fil = await supabase.rpc('messagerie_ouvrir', { p_eleve: eleveId, p_type: type, p_consentement: consentement, p_parent: null })
  if (fil.error || typeof fil.data !== 'string') return { ok: false, erreur: messageErreurBase(fil.error?.message) }
  const msg = await supabase.rpc('message_envoyer', { p_conv: fil.data, p_corps: texte.trim().slice(0, 4000), p_piece_chemin: null, p_piece_nom: null, p_piece_type: null })
  if (msg.error || !msg.data) return { ok: false, erreur: messageErreurBase(msg.error?.message) }
  const user = await getCurrentUser()
  const id = (msg.data as { id?: string }).id
  if (user && id) after(() => notifierMessage(id, user.id, '/coach/messages', '/messages').then(() => undefined))
  return { ok: true, filId: fil.data }
}

async function donnees(eleveId: string, destinataire: DestinataireBilan): Promise<{ texte: string; prenom: string } | null> {
  const [fiche, detail, entree] = await Promise.all([lireFiche(eleveId), lireDetail(eleveId), lireFicheEntree(eleveId)])
  if (!fiche || !detail) return null
  const prenom = fiche.full_name?.split(' ')[0] ?? 'ton élève'
  return {
    prenom,
    // Les champs libres (fiche d'entrée) peuvent contenir son prénom : masqué.
    texte: masquerNoms(donneesBilan({
      destinataire,
      classe: fiche.grade_level,
      semaines: detail.semaines,
      avancee: detail.avancee,
      objectif: detail.objectif,
      matieres: fiche.per_subject,
      fiche: entree,
      controles: fiche.controles.map((c) => ({ matiere: c.subject_slug.replace(/-/g, ' '), date: c.exam_date })),
    }), [fiche.full_name, prenom]),
  }
}

/** Le bilan de la semaine, rédigé par Claude (un par élève, destinataire et jour : gardé en cache). */
export async function bilanAction(
  eleveId: string,
  destinataire: DestinataireBilan,
  regenerer = false,
): Promise<{ ok: true; texte: string } | { ok: false; erreur: string }> {
  if (!UUID.test(eleveId) || (destinataire !== 'eleve' && destinataire !== 'parent')) return { ok: false, erreur: 'Demande invalide.' }
  const supabase = await createClient()
  const cle = cleCache('bilan', new Date().toISOString().slice(0, 10), `${eleveId}:${destinataire}`)
  const d = await donnees(eleveId, destinataire)
  if (!d) return { ok: false, erreur: 'Données de l’élève indisponibles.' }
  if (!regenerer) {
    const { data } = await supabase.rpc('coach_assistant_lire', { p_cle: cle })
    const t = (data as { contenu?: { texte?: string } } | null)?.contenu?.texte
    if (t) return { ok: true, texte: avecPrenom(t, d.prenom) }
  }
  const refus = await prendreJetonIA()
  if (refus) return { ok: false, erreur: refus }
  const r = await demanderTexte(CONSIGNE_BILAN, d.texte, 2000)
  if (!r.ok) return r
  await supabase.rpc('coach_assistant_ecrire', { p_cle: cle, p_contenu: { texte: r.valeur } })
  return { ok: true, texte: avecPrenom(r.valeur, d.prenom) }
}

/** Un brouillon de message selon une intention (relance, félicitations…). */
export async function brouillonAction(
  eleveId: string,
  intention: IntentionBrouillon,
  consigne: string,
  destinataire: DestinataireBilan,
): Promise<{ ok: true; texte: string } | { ok: false; erreur: string }> {
  const i = INTENTIONS.find((x) => x.id === intention)
  if (!UUID.test(eleveId) || !i) return { ok: false, erreur: 'Demande invalide.' }
  const d = await donnees(eleveId, destinataire)
  if (!d) return { ok: false, erreur: 'Données de l’élève indisponibles.' }
  const libre = masquerNoms(consigne.trim().slice(0, 600), [d.prenom])
  const refus = await prendreJetonIA()
  if (refus) return { ok: false, erreur: refus }
  const r = await demanderTexte(
    CONSIGNE_BROUILLON,
    `Intention : ${i.consigne}${libre ? `\nConsigne du coach : ${libre}` : ''}\n\nDonnées :\n${d.texte}`,
    1200,
  )
  return r.ok ? { ok: true, texte: avecPrenom(r.valeur, d.prenom) } : r
}
