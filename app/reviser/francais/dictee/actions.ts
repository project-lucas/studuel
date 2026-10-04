'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import {
  corrigerDictee,
  noteSur20,
  type Correction,
} from '@/lib/francais/dictee/correction'
import { gainsVerses, recompenserEpreuve } from '@/lib/wallet-server'
import type { Gain } from '@/lib/gains'
import { estDemo, texteAttenduDemo } from '@/lib/francais/dictee/demo'

// Le mode Dictée (migration 318) : enregistrement d'une tentative. La
// correction est refaite CÔTÉ SERVEUR à partir de la copie brute — le client
// affiche déjà un résultat, mais c'est celui-ci qui est écrit.

/** Borne d'une copie : au-delà, ce n'est plus une dictée, c'est un collage. */
const MAX_COPIE = 20_000

export type ResultatDictee = {
  ok: boolean
  note: number
  erreurs: number
  correction: Correction | null
  /** Ce que la dictée a rapporté (557) : son XP et, à 16/20 sur le
   *  téléphone, ses gemmes. Vide pour la démo et en cas d'échec. */
  gains: Gain[]
}

const ECHEC: ResultatDictee = {
  ok: false,
  note: 0,
  erreurs: 0,
  correction: null,
  gains: [],
}

/**
 * Corrige et enregistre une dictée.
 *
 * Le SUPPORT change ce qui est corrigé, pas ce qui est enregistré :
 *   • « telephone » — l'élève a écrit dans l'app, on aligne sa copie ;
 *   • « papier »    — il a écrit sur une feuille et compte lui-même ses fautes.
 *     La copie est alors vide et c'est SON décompte qui fait la note ; on le
 *     borne au nombre de mots du texte, sinon « 999 erreurs » donnerait une
 *     note négative.
 */
export async function enregistrerDictee(
  dicteeId: string,
  support: 'telephone' | 'papier',
  copie: string,
  erreursDeclarees?: number,
): Promise<ResultatDictee> {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user || typeof dicteeId !== 'string') return ECHEC

  // LA DÉMO se corrige comme les autres, mais ne s'écrit nulle part : son
  // identifiant n'est pas un UUID, et la table n'existe peut-être même pas.
  // C'est justement ce qui garantit qu'une note de démonstration ne peut pas se
  // glisser dans l'historique de l'élève.
  const demo = estDemo(dicteeId)

  let attendu: string
  if (demo) {
    attendu = texteAttenduDemo()
  } else {
    // Le texte attendu se recompose depuis les segments — jamais depuis le
    // client, qui pourrait s'envoyer un texte facile à recopier.
    const { data: segments, error } = await supabase
      .from('dictee_segments')
      .select('texte, position')
      .eq('dictee_id', dicteeId)
      .order('position', { ascending: true })
    if (error || !segments || segments.length === 0) return ECHEC
    attendu = segments.map((s) => String(s.texte)).join(' ')
  }
  const propre =
    typeof copie === 'string' ? copie.slice(0, MAX_COPIE) : ''

  const correction = corrigerDictee(attendu, propre)

  let note: number
  let erreurs: number
  if (support === 'papier') {
    // L'élève s'est corrigé lui-même : on lui fait confiance, dans les bornes.
    const declarees = Number(erreursDeclarees)
    erreurs = Number.isFinite(declarees)
      ? Math.max(0, Math.min(correction.motsAttendus, Math.floor(declarees)))
      : 0
    note = noteSur20({
      motsAttendus: correction.motsAttendus,
      motsJustes: correction.motsAttendus - erreurs,
    })
  } else {
    erreurs = correction.erreurs
    note = noteSur20(correction)
  }

  // La démo s'arrête ici : la note et la correction sont rendues, rien n'est
  // écrit, aucune XP n'est versée. Un aperçu ne fait pas progresser.
  if (demo) return { ok: true, note, erreurs, correction, gains: [] }

  const { data: tentative, error: erreurEcriture } = await supabase
    .from('dictee_attempts')
    .insert({
      user_id: user.id,
      dictee_id: dicteeId,
      note,
      erreurs,
      support,
      // Sur papier il n'y a pas de copie à garder : stocker une chaîne vide
      // ferait croire à une copie rendue blanche.
      copie: support === 'papier' ? null : propre,
    })
    .select('id')
    .single<{ id: string }>()
  if (erreurEcriture || !tentative) {
    console.error('[dictee] tentative non enregistrée:', erreurEcriture?.message)
    return { ...ECHEC, note, erreurs, correction }
  }

  // UNE ÉPREUVE (557) : la série avance, l'XP suit la note (10 + 2 par point),
  // et une dictée écrite dans l'app rapporte des gemmes à 16/20, puis 19/20 —
  // le serveur relit la note dans la tentative, pas ici.
  const gains = gainsVerses(await recompenserEpreuve(supabase, 'dictee', tentative.id))

  revalidatePath('/reviser/francais/dictee')
  return { ok: true, note, erreurs, correction, gains }
}
