'use client'

import { useState } from 'react'
import Colonnes from '@/components/console/kit/Colonnes'
import { cn } from '@/lib/utils'

type Jour = { jour: string; inscrits: number; actifs: number; minutes: number; quiz: number }
const MESURES = [
  { cle: 'actifs', libelle: 'Élèves actifs' },
  { cle: 'minutes', libelle: 'Minutes de travail' },
  { cle: 'quiz', libelle: 'Quiz joués' },
  { cle: 'inscrits', libelle: 'Inscriptions' },
] as const

/** L'activité jour par jour, une mesure à la fois (jamais deux échelles sur un graphique). */
export default function ActiviteJours({ jours }: { jours: Jour[] }) {
  const [mesure, setMesure] = useState<(typeof MESURES)[number]['cle']>('actifs')
  const libelle = (j: string) => new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', timeZone: 'UTC' }).format(new Date(`${j}T12:00:00Z`))
  const pas = Math.max(1, Math.ceil(jours.length / 10))
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-1.5" role="group" aria-label="Mesure">
        {MESURES.map((m) => (
          <button key={m.cle} type="button" aria-pressed={mesure === m.cle} onClick={() => setMesure(m.cle)} className={cn('h-8 rounded-full px-3 text-xs font-bold', mesure === m.cle ? 'bg-primary text-primary-foreground' : 'bg-secondary')}>
            {m.libelle}
          </button>
        ))}
      </div>
      <Colonnes
        titre={MESURES.find((m) => m.cle === mesure)?.libelle ?? ''}
        donnees={jours.map((j) => ({ cle: j.jour, valeur: j[mesure], etiquette: libelle(j.jour) }))}
        etiquettesTous={pas}
        hauteur={200}
      />
    </div>
  )
}
