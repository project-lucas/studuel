import { notFound } from 'next/navigation'
import EcranExamen from '@/components/examen/EcranExamen'
import { examenDe, joursAvantExamen, objectifsDeLaSemaine, phaseDe } from '@/lib/examen/parcours'
import { annalesDeLExamen } from '@/lib/examen/annales-examen'
import { ANNALES_CORRIGEES } from '@/lib/annales-corrigees/registre'
import { toDayKey } from '@/lib/streak'

export const dynamic = 'force-dynamic'

// L'APERÇU DU MODE EXAMEN — en développement seulement, sans base ni compte.
//
//   /dev/examen                  un abonné de 3e, aujourd'hui
//   /dev/examen?classe=1re       le bac de français (écrit, oral, maths anticipées)
//   /dev/examen?classe=Tle       le bac (philosophie, spécialités, Grand oral)
//   /dev/examen?classe=4e        une classe sans examen
//   /dev/examen?premium=0        le plan de la semaine sous couronne
//   /dev/examen?jours=30         une autre phase (200, 100, 30, 3)
export default async function ApercuExamen({
  searchParams,
}: {
  searchParams: Promise<{ classe?: string; premium?: string; jours?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { classe = '3e', premium = '1', jours: joursBrut } = await searchParams
  const examen = examenDe(classe)
  if (!examen) return <EcranExamen examen={null} jours={0} premium={premium !== '0'} objectifs={[]} annales={[]} />

  const jours = joursBrut !== undefined ? Number(joursBrut) || 0 : joursAvantExamen(examen, toDayKey(new Date()))
  const slugs = new Set(examen.epreuves.flatMap((e) => (e.matiere ? [e.matiere] : [])))
  return (
    <EcranExamen
      examen={examen}
      jours={jours}
      premium={premium !== '0'}
      objectifs={objectifsDeLaSemaine(examen, phaseDe(jours), { pointsFaibles: 3, aCommencer: 12, matierePrincipale: null })}
      annales={annalesDeLExamen(ANNALES_CORRIGEES, examen.id, slugs)}
    />
  )
}
