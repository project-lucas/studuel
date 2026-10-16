import { notFound } from 'next/navigation'
import DemanderMarcel from '@/components/marcel/DemanderMarcel'
import { CoachFilProvider } from '@/components/marcel/CoachFil'
import CoachEntete from '@/components/marcel/CoachEntete'
import { construireProfil } from '@/lib/coach/profil-eleve'
import { remarquesDe } from '@/lib/coach/remarques'
import { CREDITS_MENSUELS } from '@/lib/coach/credits'
import type { Tier } from '@/lib/subscription'

export const dynamic = 'force-dynamic'

// L'APERÇU DE MARCEL — en développement seulement, sans base ni compte.
//
//   /dev/marcel                  un abonné éveillé, « Marcel a remarqué »
//   /dev/marcel?etat=fatigue     il bâille (12 crédits, aucune recharge)
//   /dev/marcel?etat=endormi     il dort jusqu'au 1er, « Recharger Marcel »
//   /dev/marcel?etat=repos       le plafond du jour (50 appels)
//   /dev/marcel?etat=gratuit     le gratuit découvre Studuel+
//   /dev/marcel?remarques=0      sans remarque (le champ seul)
// Envoyer une question appelle la vraie action : sans session, elle refuse.
const ETATS: Record<string, { tier: Tier; depenses: number; jetons: number; utilises: number }> = {
  eveille: { tier: 'tier1', depenses: 57, jetons: 0, utilises: 3 },
  fatigue: { tier: 'tier1', depenses: CREDITS_MENSUELS - 12, jetons: 0, utilises: 3 },
  endormi: { tier: 'tier1', depenses: CREDITS_MENSUELS, jetons: 0, utilises: 3 },
  repos: { tier: 'tier1', depenses: 20, jetons: 0, utilises: 50 },
  gratuit: { tier: 'free', depenses: 0, jetons: 0, utilises: 0 },
}

export default async function ApercuMarcel({
  searchParams,
}: {
  searchParams: Promise<{ etat?: string; remarques?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { etat = 'eveille', remarques = '1' } = await searchParams
  const e = ETATS[etat] ?? ETATS.eveille

  const profil = construireProfil({
    classe: '3e',
    aujourdhui: '2026-10-15',
    objectifMinutes: 20,
    serie: 4,
    controles: [{ matiere: 'Mathématiques', date: '2026-10-18', chapitres: ['Les fractions'] }],
    chapitres: [
      { titre: 'Les fractions', matiere: 'Mathématiques', etat: 'fragile', valeur: 0.3 },
      { titre: 'Les puissances', matiere: 'Mathématiques', etat: 'fragile', valeur: 0.4 },
    ],
    examen: { nom: 'Le brevet', jours: 252 },
  })
  const liste = remarques === '0' ? [] : remarquesDe(profil, (m) => (m === 'Mathématiques' ? 'maths' : null))

  return (
    <div className="px-4 pt-2">
      <CoachFilProvider>
        <div className="flex h-[calc(100dvh-10.5rem)] min-h-[26rem] flex-col">
          <CoachEntete salut="Salut !" bulle="Ton contrôle de maths approche : on s’y met ?" />
          <DemanderMarcel
            tier={e.tier}
            utilisesAujourdhui={e.utilises}
            depensesMois={e.depenses}
            jetons={e.jetons}
            remarques={liste}
            matieres={[{ slug: 'maths', name: 'Mathématiques' }]}
            matiereParDefaut="maths"
            vision={false}
          />
        </div>
      </CoachFilProvider>
    </div>
  )
}
