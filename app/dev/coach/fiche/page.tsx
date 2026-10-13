import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import FicheEleve from '@/components/coach/FicheEleve'
import { statutEleve, type LigneCoach } from '@/lib/coach/statut'
import type { FicheEleve as Fiche } from '@/lib/coach/server'

export const dynamic = 'force-dynamic'

// L'APERÇU DE LA FICHE D'UN JOUEUR — développement seulement, sans base.
//
//   /dev/coach/fiche            un joueur en baisse
//   /dev/coach/fiche?e=rouge    un décroché
//   /dev/coach/fiche?e=vert     un régulier
function jour(decalage: number, aujourdhui: string): string {
  const d = new Date(`${aujourdhui}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() - decalage)
  return d.toISOString().slice(0, 10)
}

function lundi(decalage: number, aujourdhui: string): string {
  const d = new Date(`${aujourdhui}T00:00:00Z`)
  const iso = (d.getUTCDay() + 6) % 7
  d.setUTCDate(d.getUTCDate() - iso - decalage * 7)
  return d.toISOString().slice(0, 10)
}

export default async function ApercuFichePage({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { e } = await searchParams
  const aujourdhui = new Date().toISOString().slice(0, 10)
  const etat = e === 'rouge' ? 'rouge' : e === 'vert' ? 'vert' : 'orange'

  const ligne: LigneCoach = {
    eleveId: '00000000-0000-4000-8000-000000000001',
    prenom: 'Sofiane B.',
    pseudo: 'sof_basket',
    classe: '2de',
    groupeId: 'g-u17',
    groupe: 'U17',
    categorie: 'U17',
    rattacheLe: jour(41, aujourdhui),
    derniereActivite: etat === 'rouge' ? jour(11, aujourdhui) : jour(1, aujourdhui),
    secondes7: etat === 'rouge' ? 0 : etat === 'vert' ? 4 * 1800 : 20 * 60,
    secondes4s: 4 * 3600,
    joursActifs7: etat === 'rouge' ? 0 : etat === 'vert' ? 4 : 1,
    sessions7: etat === 'rouge' ? 0 : etat === 'vert' ? 6 : 2,
    matiereFaible: 'Maths',
    ratioFaible: 0.42,
    ratioGlobal: 0.63,
    quizTotal: 38,
  }
  const semaines = etat === 'rouge' ? [3600, 2700, 600, 0] : etat === 'vert' ? [3000, 3600, 4200, 7200] : [4200, 3900, 3300, 1200]
  const fiche: Fiche = {
    full_name: 'Sofiane B.',
    grade_level: '2de',
    work_seconds: 61_200,
    week_seconds: ligne.secondes7,
    week_active_days: ligne.joursActifs7,
    active_days: [],
    sessions_total: 38,
    sessions_7: ligne.sessions7,
    avg_ratio: 0.63,
    per_subject: [
      { subject: 'Maths', ratio: 0.42, attempts: 11 },
      { subject: 'Physique-Chimie', ratio: 0.55, attempts: 6 },
      { subject: 'Français', ratio: 0.68, attempts: 9 },
      { subject: 'Histoire-Géo', ratio: 0.74, attempts: 7 },
      { subject: 'Anglais', ratio: 0.81, attempts: 5 },
    ],
    weeks: semaines.map((s, i) => ({ start: lundi(3 - i, aujourdhui), seconds: s, active_days: Math.min(7, Math.ceil(s / 1500)) })),
    controles: [
      { id: 1, subject_slug: 'maths', chapters: [], exam_date: jour(-4, aujourdhui) },
      { id: 2, subject_slug: 'physique-chimie', chapters: [], exam_date: jour(-9, aujourdhui) },
    ],
    last_activity: ligne.derniereActivite,
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <Link href="/dev/coach" className="inline-flex w-fit items-center gap-1.5 text-sm font-bold text-muted-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Tableau
      </Link>
      <FicheEleve fiche={fiche} ligne={ligne} verdict={statutEleve(ligne, aujourdhui)} aujourdhui={aujourdhui} />
    </div>
  )
}
