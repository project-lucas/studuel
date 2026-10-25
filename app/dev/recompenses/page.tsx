import { notFound } from 'next/navigation'
import type { Gain, UniteGain } from '@/lib/gains'
import ApercuRecompenses from './Apercu'

export const dynamic = 'force-dynamic'

// L'APERÇU DU RUBAN DE RÉCOMPENSES — en développement seulement.
//
// Dans l'app, le ruban s'ouvre quand un coffre, un gardien ou une annale a
// VERSÉ quelque chose. Ici, on le rejoue à volonté, avec une fausse barre de
// niveau et un faux compteur de gemmes pour cibles :
//
//   /dev/recompenses                          40 XP et 5 gemmes
//   /dev/recompenses?gains=xp:100             l'XP seule
//   /dev/recompenses?gains=xp:40,gemme:5      ce qu'on veut
//   /dev/recompenses?auto=1                   ouvert dès l'arrivée (captures)
//   /dev/recompenses?sous=Coffre%20d’équipe   une ligne sous le ruban
const UNITES: readonly UniteGain[] = ['xp', 'gemme', 'couronne', 'trophee']

function lireGains(brut: string | undefined): Gain[] {
  const gains: Gain[] = []
  for (const part of (brut ?? 'xp:40,gemme:5').split(',')) {
    const [unite, montant] = part.split(':')
    const n = Math.floor(Number(montant))
    if (UNITES.includes(unite as UniteGain) && Number.isFinite(n) && n > 0) {
      gains.push({ unite: unite as UniteGain, montant: n })
    }
  }
  return gains
}

export default async function ApercuRecompensesPage({
  searchParams,
}: {
  searchParams: Promise<{ gains?: string; auto?: string; sous?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const q = await searchParams
  return <ApercuRecompenses gains={lireGains(q.gains)} auto={q.auto === '1'} sousTitre={q.sous ?? null} />
}
