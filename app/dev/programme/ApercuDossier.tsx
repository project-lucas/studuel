'use client'

import { useState } from 'react'
import SubjectTemplate from '@/components/reviser/SubjectTemplate'
import { amorcerCahier } from '@/components/reviser/useCahierMatiere'
import type { CahierMatiere } from '@/lib/exercices/cahier-matiere'
import type { SubjectTemplateData } from '@/lib/subject-template'

/**
 * Le dossier de matière en aperçu (développement seulement) : le vrai gabarit,
 * et un cahier d'exercices déposé d'avance dans le magasin du navigateur — sans
 * compte, la route du cahier répond 401 et la porte « Exercices » n'aurait
 * rien à montrer.
 */
export default function ApercuDossier({
  data,
  initialMode,
  cahier,
}: {
  data: SubjectTemplateData
  initialMode?: string
  cahier: CahierMatiere | null
}) {
  // Avant le premier rendu du panneau, une seule fois.
  useState(() => {
    if (cahier) amorcerCahier(data.subject.slug, cahier)
    return null
  })
  return <SubjectTemplate data={data} initialMode={initialMode} />
}
