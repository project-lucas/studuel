'use server'

import { refresh } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { getUserTierFor } from '@/lib/subscription'
import { isPremiumTier } from '@/lib/gems'
import { configVision } from '@/lib/coach/ia-vision'
import { aiClient, extractJsonObject, quotaOk } from '@/lib/ia-server'
import { DOSSIER, ETAPES, type GenrePiece } from '@/lib/examen/dossier-oral'
import { noteValide } from '@/lib/examen/simulateur'

// LE DOSSIER D'ORAL ET LE SIMULATEUR de l'onglet Examen (migration 585). Ce que
// l'élève écrit n'est jamais cru : bornes et listes fermées ici, puis la RPC
// qui refait les mêmes contrôles en base. Seul l'écran courant change :
// `refresh()`. Le dossier d'oral est un pilier de Studuel+ : chaque écriture
// revérifie l'abonnement, la porte de l'écran ne suffit pas.

export type Resultat = { ok: boolean; erreur?: string }

const GENRES: readonly GenrePiece[] = ['projet', 'texte', 'question']
const UUID = /^[0-9a-f-]{36}$/i
const SLUG = /^[a-z0-9-]{1,40}$/

async function eleveAbonne() {
  const user = await getCurrentUser()
  if (!user) return null
  const supabase = await createClient()
  const tier = await getUserTierFor(supabase, user.id)
  return isPremiumTier(tier) ? { supabase, user } : null
}

const texteBorne = (v: unknown, max = 200): string | null =>
  typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null

export async function ajouterPiece(genre: unknown, titre: unknown, detail: unknown, matiere: unknown): Promise<Resultat> {
  const ctx = await eleveAbonne()
  if (!ctx) return { ok: false, erreur: 'Le dossier d’oral est inclus dans Studuel+.' }
  if (!GENRES.includes(genre as GenrePiece)) return { ok: false }
  const t = texteBorne(titre)
  if (!t) return { ok: false, erreur: 'Écris d’abord son titre.' }
  const { data, error } = await ctx.supabase.rpc('examen_oral_ajouter', {
    p_genre: genre,
    p_titre: t,
    p_detail: texteBorne(detail),
    p_matiere: typeof matiere === 'string' && SLUG.test(matiere) ? matiere : null,
  })
  if (error) {
    console.error('[examen] pièce non ajoutée :', error.message)
    return { ok: false, erreur: 'Je n’ai pas pu l’enregistrer. Réessaie.' }
  }
  if (!data) return { ok: false, erreur: 'Ton dossier est complet.' }
  refresh()
  return { ok: true }
}

export async function modifierPiece(id: unknown, titre: unknown, detail: unknown, matiere: unknown): Promise<Resultat> {
  const ctx = await eleveAbonne()
  if (!ctx || typeof id !== 'string' || !UUID.test(id)) return { ok: false }
  const t = texteBorne(titre)
  if (!t) return { ok: false, erreur: 'Le titre ne peut pas être vide.' }
  const { data, error } = await ctx.supabase.rpc('examen_oral_modifier', {
    p_id: id,
    p_titre: t,
    p_detail: texteBorne(detail),
    p_matiere: typeof matiere === 'string' && SLUG.test(matiere) ? matiere : null,
  })
  if (error) console.error('[examen] pièce non modifiée :', error.message)
  if (data === true) refresh()
  return { ok: data === true }
}

export async function cocherEtape(id: unknown, etape: unknown, fait: unknown): Promise<Resultat> {
  const ctx = await eleveAbonne()
  if (!ctx || typeof id !== 'string' || !UUID.test(id)) return { ok: false }
  const connues = new Set(Object.values(ETAPES).flatMap((e) => e.map((x) => x.id)))
  if (typeof etape !== 'string' || !connues.has(etape)) return { ok: false }
  const { data, error } = await ctx.supabase.rpc('examen_oral_etape', { p_id: id, p_etape: etape, p_fait: fait === true })
  if (error) console.error('[examen] étape non cochée :', error.message)
  if (data === true) refresh()
  return { ok: data === true }
}

export async function retirerPiece(id: unknown): Promise<Resultat> {
  const ctx = await eleveAbonne()
  if (!ctx || typeof id !== 'string' || !UUID.test(id)) return { ok: false }
  const { data, error } = await ctx.supabase.rpc('examen_oral_retirer', { p_id: id })
  if (error) console.error('[examen] pièce non retirée :', error.message)
  if (data === true) refresh()
  return { ok: data === true }
}

/** Un oral blanc commencé avec Marcel : un passage de plus sur la pièce. */
export async function compterPassage(id: unknown): Promise<Resultat> {
  const ctx = await eleveAbonne()
  if (!ctx || typeof id !== 'string' || !UUID.test(id)) return { ok: false }
  const { error } = await ctx.supabase.rpc('examen_oral_passage', { p_id: id })
  if (error) {
    console.error('[examen] passage non compté :', error.message)
    return { ok: false }
  }
  // Le tirage suivant doit savoir que cette pièce a été passée.
  refresh()
  return { ok: true }
}

export async function enregistrerNotes(brut: unknown): Promise<Resultat> {
  const user = await getCurrentUser()
  if (!user || !brut || typeof brut !== 'object') return { ok: false }
  const o = brut as Record<string, unknown>
  const note = (k: string) => (noteValide(o[k]) ? Math.round((o[k] as number) * 100) / 100 : null)
  const supabase = await createClient()
  const { error } = await supabase.rpc('examen_notes_enregistrer', {
    p_notes: {
      voie: o.voie === 'technologique' ? 'technologique' : 'generale',
      controleContinu: note('controleContinu'),
      francaisEcrit: note('francaisEcrit'),
      francaisOral: note('francaisOral'),
      mathsAnticipees: note('mathsAnticipees'),
    },
  })
  if (error) {
    console.error('[examen] notes non enregistrées :', error.message)
    return { ok: false }
  }
  return { ok: true }
}

// ------------------------------------------------ la photo du descriptif

const MAX_IMAGE_LEN = 4_000_000

const DESCRIPTIF_SYSTEM = `Tu lis la photo du DESCRIPTIF de l'oral du bac de français d'un élève : la liste des textes étudiés dans l'année.
Réponds UNIQUEMENT par un objet JSON : {"textes": [{"titre": "...", "detail": "..."}]}.
- "titre" : le titre du texte ou de l'extrait (ex. « Demain, dès l'aube », « Acte I, scène 1 »), 120 caractères au plus.
- "detail" : l'auteur et l'œuvre (ex. « Hugo, Les Contemplations »), 120 caractères au plus, ou "" si absent.
Garde l'ordre de la liste. N'invente rien : un texte illisible est ignoré. Ignore les titres de parties, les objets d'étude et les œuvres intégrales lues en entier.
Si la photo n'est pas un descriptif, réponds {"textes": []}.`

export type ResultatDescriptif = Resultat & { ajoutes?: number }

/** « Ma liste en photo » : Marcel lit le descriptif et range les textes dans le dossier. */
export async function lireDescriptif(dataUrl: unknown): Promise<ResultatDescriptif> {
  const ctx = await eleveAbonne()
  if (!ctx) return { ok: false, erreur: 'La lecture du descriptif est incluse dans Studuel+.' }
  const url = typeof dataUrl === 'string' ? dataUrl : ''
  // Une data URL d'image, et rien d'autre : une URL http ferait de l'action un relais.
  if (!/^data:image\/(png|jpe?g|webp);base64,/.test(url) || url.length > MAX_IMAGE_LEN) {
    return { ok: false, erreur: 'Cette image ne passe pas. Reprends la photo.' }
  }
  const vision = configVision()
  if (!vision) return { ok: false, erreur: 'La lecture de photo n’est pas encore ouverte. Ajoute tes textes à la main.' }
  if (!(await quotaOk(ctx.supabase, 'generation'))) {
    return { ok: false, erreur: 'Tu as beaucoup demandé aujourd’hui : réessaie demain.' }
  }
  const client = await aiClient(vision)
  if (!client) return { ok: false, erreur: 'La lecture de photo n’est pas disponible.' }

  let textes: { titre: string; detail: string }[] = []
  try {
    const r = await client.chat.completions.create({
      model: vision.model,
      max_tokens: 3_000,
      messages: [
        { role: 'system', content: DESCRIPTIF_SYSTEM },
        {
          role: 'user',
          content: [
            { type: 'text' as const, text: 'Voici la photo de mon descriptif.' },
            { type: 'image_url' as const, image_url: { url } },
          ],
        },
      ],
    })
    const objet = extractJsonObject(r.choices[0]?.message?.content ?? '')
    const brut = Array.isArray(objet?.textes) ? (objet.textes as unknown[]) : []
    textes = brut
      .map((x) => (x && typeof x === 'object' ? (x as Record<string, unknown>) : {}))
      .map((x) => ({ titre: texteBorne(x.titre, 120) ?? '', detail: texteBorne(x.detail, 120) ?? '' }))
      .filter((x) => x.titre)
      .slice(0, DOSSIER['bac-francais'].max)
  } catch (error) {
    // Le message SEUL : l'objet d'erreur du SDK porte la photo de l'élève.
    console.error('[examen] descriptif illisible :', error instanceof Error ? error.message : 'inconnu')
    return { ok: false, erreur: 'Je n’ai pas réussi à lire la photo. Réessaie, bien à plat et éclairée.' }
  }
  if (textes.length === 0) return { ok: false, erreur: 'Je n’ai trouvé aucun texte sur cette photo.' }

  const { data, error } = await ctx.supabase.rpc('examen_oral_ajouter_liste', { p_textes: textes })
  if (error) {
    console.error('[examen] textes non ajoutés :', error.message)
    return { ok: false, erreur: 'Je n’ai pas pu ranger tes textes. Réessaie.' }
  }
  refresh()
  return { ok: true, ajoutes: typeof data === 'number' ? data : 0 }
}
