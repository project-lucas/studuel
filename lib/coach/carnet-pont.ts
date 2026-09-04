import type { SupabaseClient } from '@supabase/supabase-js'
import { creerCartesEnLot } from '@/app/reviser/cours/actions'
import { COURS_MARCEL, carteDepuis } from './vers-carnet'

// LE PONT MARCEL → CARNET. Un échange devient une carte, dans un cours qui
// porte le nom du coach.
//
// On ne réécrit PAS l'insertion : `creerCartesEnLot` (le carnet) fait déjà le
// travail — nettoyage identique à celui de l'aperçu montré à l'élève,
// normalisation du contenu, position, revalidation des écrans du carnet. Deux
// chemins d'écriture pour la même table finiraient par diverger ; celui-ci
// n'existe donc pas.
//
// Le cours d'accueil est créé À LA DEMANDE, jamais d'avance : un élève qui ne
// parle pas à Marcel n'a pas à trouver un dossier vide dans son carnet.

export type RangementCarnet = {
  courseId: string
  cours: string
  /** Nombre de cartes réellement écrites (1 pour un échange rangé à la main). */
  ajoutees?: number
}

/**
 * Le cours « Avec Marcel » de cet élève — retrouvé par son titre, créé s'il
 * manque. `null` si le carnet est inaccessible (migration 186 absente).
 */
async function coursDAccueil(
  supabase: SupabaseClient,
  userId: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from('carnet_courses')
    .select('id')
    .eq('owner_id', userId)
    .eq('title', COURS_MARCEL)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('[marcel] carnet illisible:', error.message)
    return null
  }
  if (data) return String(data.id)

  const { data: cree, error: erreurCreation } = await supabase
    .from('carnet_courses')
    .insert({
      owner_id: userId,
      title: COURS_MARCEL,
      description: 'Ce que Marcel t’a expliqué, à revoir.',
    })
    .select('id')
    .single()

  if (erreurCreation || !cree) {
    console.error(
      '[marcel] cours du carnet impossible à créer:',
      erreurCreation?.message,
    )
    return null
  }
  return String(cree.id)
}

/**
 * Range un échange dans le carnet. `null` quand il n'y a rien à ranger ou que
 * le carnet refuse — l'appelant le DIT à l'élève au lieu de prétendre.
 */
export async function rangerEchange(
  supabase: SupabaseClient,
  userId: string,
  echange: { question: string; reponse: string },
): Promise<RangementCarnet | null> {
  const carte = carteDepuis(echange.question, echange.reponse)
  if (!carte) return null
  return rangerCartes(supabase, userId, [carte])
}

/**
 * Range un LOT de cartes — celles que Marcel vient de fabriquer et que l'élève
 * a relues. Même destination et même écriture qu'un échange rangé à la main :
 * le cours « Avec Marcel », et `creerCartesEnLot`.
 */
export async function rangerCartes(
  supabase: SupabaseClient,
  userId: string,
  cartes: readonly { recto: string; verso: string }[],
): Promise<RangementCarnet | null> {
  if (cartes.length === 0) return null

  const courseId = await coursDAccueil(supabase, userId)
  if (!courseId) return null

  const res = await creerCartesEnLot(courseId, null, cartes)
  if (!res.ok || res.created === 0) return null

  return { courseId, cours: COURS_MARCEL, ajoutees: res.created }
}
