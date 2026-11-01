'use client'

import { useEffect, useState } from 'react'
import StandingLine from '@/components/StandingLine'
import { parseGradeStandings, type GradeStandings } from '@/lib/percentile'

// Une lecture pour toutes les matières, gardée trente secondes : ouvrir dix
// dossiers d'affilée ne coûte qu'un appel, et la place gagnée en jouant se voit
// au retour dans le dossier (la 605 calcule l'élève en direct, Lucas : « s'il
// bat son classement mais ne le voit pas, il va croire que ça bugue »).
const DUREE_MEMOIRE_MS = 30 * 1000
let memoire: { promesse: Promise<GradeStandings | null>; depuis: number } | null = null

function lireClassement(): Promise<GradeStandings | null> {
  if (memoire && Date.now() - memoire.depuis < DUREE_MEMOIRE_MS) return memoire.promesse
  const promesse = fetch('/api/classement-niveau')
    .then(async (r) => (r.status === 200 ? parseGradeStandings((await r.json()).classement) : null))
    .catch(() => null)
  memoire = { promesse, depuis: Date.now() }
  // Un échec ne se garde pas : la prochaine ouverture retentera.
  promesse.then((v) => {
    if (v === null) memoire = null
  })
  return promesse
}

/**
 * LA PLACE DE L'ÉLÈVE DANS LA MATIÈRE (« Top 10 % des 3e »), lue APRÈS
 * l'ouverture du dossier (cf. `app/api/classement-niveau`). Tant qu'elle n'est
 * pas arrivée, ou s'il n'y a rien d'honnête à annoncer, rien ne s'affiche.
 */
export default function PlaceDansLaMatiere({
  matiere,
  grade,
  className,
}: {
  /** Nom affichable de la matière (« Anglais »), celui sur lequel agrège la RPC. */
  matiere: string
  grade: string | null
  className?: string
}) {
  const [classement, setClassement] = useState<GradeStandings | null>(null)

  useEffect(() => {
    let vivant = true
    lireClassement().then((c) => {
      if (vivant) setClassement(c)
    })
    return () => {
      vivant = false
    }
  }, [])

  const standing = classement?.maitrise.find((m) => m.subject === matiere)?.standing
  if (!standing) return null
  return <StandingLine standing={standing} grade={classement?.grade ?? grade} className={className} />
}
