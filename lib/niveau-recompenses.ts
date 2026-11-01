import { decouvertesAuNiveau } from '@/lib/decouverte/catalogue'
import { CADRES, imageCadre, libelleCadre } from '@/lib/moi/cadre-profil'
import { walletLevelInfo, xpForLevel } from '@/lib/wallet'

// -----------------------------------------------------------------------------
// CE QU'UN NIVEAU FRANCHI RAPPORTE (29/10/2026, Lucas sur la fête de niveau :
// « on ne voit pas les récompenses du gain de niveau »).
//
// Un niveau ne verse plus de gemme depuis la 557 (lib/niveaux), mais il n'est
// pas vide pour autant : il ouvre des écrans (le catalogue des découvertes),
// il habille la photo d'un nouveau CADRE (lib/moi/cadre-profil, le bronze au
// niveau 2, l'argent au 6…) et, jusqu'au niveau 10, il donne un nouveau
// TITRE (lib/wallet). La fête les montre en CARTES, comme ce que le serveur
// verse — le coffre de palier, lui, garde sa cérémonie à part (CoffrePalier).
// Cumulé quand plusieurs niveaux sont franchis d'un coup. Pur et testé.
// -----------------------------------------------------------------------------

export type GainDeNiveau =
  | {
      type: 'decouverte'
      cle: string
      nom: string
      phrase: string
      dessin: string | null
      /** La page, avec `?decouvrir=` pour lancer son mini-tour. */
      href: string
    }
  | { type: 'cadre'; cle: string; nom: string; image: string | null }
  | { type: 'titre'; cle: string; nom: string }

/** Le titre porté à un niveau (« Apprenti », « Régulier »…). */
export function titreDuNiveau(niveau: number): string {
  return walletLevelInfo(xpForLevel(Math.max(1, Math.floor(niveau)))).title
}

/**
 * Tout ce que les niveaux franchis (de `depuis` exclu à `niveau` inclus)
 * rapportent : les écrans ouverts d'abord, puis le cadre, puis le titre — un
 * seul cadre et un seul titre, les derniers gagnés, même après un grand saut.
 */
export function gainsDuPassage(depuis: number, niveau: number): GainDeNiveau[] {
  const de = Math.max(1, Math.floor(depuis))
  const a = Math.floor(niveau)
  if (!Number.isFinite(de) || !Number.isFinite(a) || a <= de) return []

  const gains: GainDeNiveau[] = []
  for (let n = de + 1; n <= a; n += 1) {
    for (const d of decouvertesAuNiveau(n)) {
      gains.push({ type: 'decouverte', cle: d.cle, nom: d.nom, phrase: d.phrase, dessin: d.dessin, href: `${d.href}?decouvrir=${d.cle}` })
    }
  }

  const cadre = [...CADRES].reverse().find((c) => c.niveau > de && c.niveau <= a)
  if (cadre) gains.push({ type: 'cadre', cle: `cadre-${cadre.id}`, nom: libelleCadre(cadre), image: imageCadre(cadre) })

  const titre = titreDuNiveau(a)
  if (titre !== titreDuNiveau(de)) gains.push({ type: 'titre', cle: `titre-${a}`, nom: titre })

  return gains
}
