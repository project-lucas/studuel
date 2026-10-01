'use client'

import { useState } from 'react'
import ChoixMatieres from '@/components/welcome/ChoixMatieres'
import { titreAChoisir } from '@/lib/programme-classes'
import type { Subject } from '@/lib/types'
import { defaultSelectedForGrade, sectionsMatieres } from '@/lib/welcome'

export default function Apercu({ subjects, classe }: { subjects: Subject[]; classe: string }) {
  const [choisies, setChoisies] = useState<string[]>(() => defaultSelectedForGrade(subjects, classe))
  const { obligatoires, aChoisir } = sectionsMatieres(subjects, classe)
  return (
    <div className="onb min-h-dvh px-4 py-6" style={{ background: 'var(--onb-cream)' }}>
      <div className="mx-auto max-w-md">
        <h1 className="font-heading text-2xl font-extrabold" style={{ color: 'var(--onb-ink)' }}>
          Tes matières · {classe}
        </h1>
        <ChoixMatieres
          obligatoires={obligatoires}
          aChoisir={aChoisir}
          titreAChoisir={titreAChoisir(classe)}
          selected={choisies}
          onToggle={(slug) =>
            setChoisies((c) => (c.includes(slug) ? c.filter((s) => s !== slug) : [...c, slug]))
          }
        />
      </div>
    </div>
  )
}
