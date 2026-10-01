import { isMissingSchemaObject } from '@/lib/schema-fallback'
import { lireClassementAmis, type AmiClasse } from '@/lib/moi/classement-amis'

// -----------------------------------------------------------------------------
// Le classement entre amis, lu en base par `classement_amis()` (migration 465).
// Séparé de lib/moi/classement-amis.ts, qui reste pur.
//
// La page Moi lance l'appel dans sa VAGUE de lectures et donne ici la réponse :
// ce module ne fait que décider quoi en montrer.
//
// TANT QUE LA 465 N'EST PAS EXÉCUTÉE (ou si la lecture échoue), l'écran ne
// reste pas vide et ne ment pas : il montre la SEULE colonne de l'élève, avec
// ses propres chiffres — que la page connaît déjà —, et dit que le classement
// de ses amis arrive (`complet: false`).
// -----------------------------------------------------------------------------

export type ClassementAmisLu = {
  joueurs: AmiClasse[]
  /** false : la fonction manque, on ne voit que soi. */
  complet: boolean
}

type ReponseRpc = {
  data: unknown
  error: { message: string; code?: string } | null
}

export function resoudreClassementAmis(
  reponse: ReponseRpc,
  /** Ma ligne, bâtie avec ce que la page sait déjà de moi. */
  repli: AmiClasse,
): ClassementAmisLu {
  if (reponse.error) {
    if (!isMissingSchemaObject(reponse.error)) {
      console.error('[moi] classement des amis illisible :', reponse.error.message)
    }
    return { joueurs: [repli], complet: false }
  }
  const joueurs = lireClassementAmis(reponse.data)
  // La fonction rend toujours l'appelant ; une réponse sans lui est une réponse
  // qu'on ne sait pas lire.
  return joueurs.some((j) => j.moi)
    ? { joueurs, complet: true }
    : { joueurs: [repli], complet: false }
}
