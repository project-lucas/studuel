import { notFound } from 'next/navigation'
import BoutonRythme from '@/components/moi/BoutonRythme'
import MatieresRevisees from '@/components/moi/MatieresRevisees'
import type { MatiereRevisee } from '@/lib/moi/matieres-revisees'
import { phraseRythme, rythmeHebdo } from '@/lib/moi/temps'

export const dynamic = 'force-dynamic'

// L'APERÇU DU RÉCAP DES MATIÈRES DE L'ONGLET MOI — en développement seulement.
//
// Le bouton du rythme sur le fond de la carte de profil (il ouvre les huit
// semaines dans une feuille), puis le bloc « Tes matières » avec cinq
// matières, neuf (la rangée défile de côté) et aucune.
//
//   /dev/matieres

const CINQ: MatiereRevisee[] = [
  { subjectId: 'm', slug: 'maths', nom: 'Mathématiques', questions: 240, seances: 18 },
  { subjectId: 'f', slug: 'francais', nom: 'Français', questions: 180, seances: 14 },
  { subjectId: 'h', slug: 'histoire-geo', nom: 'Histoire-Géographie', questions: 95, seances: 8 },
  { subjectId: 's', slug: 'svt', nom: 'SVT', questions: 40, seances: 4 },
  { subjectId: 'a', slug: 'anglais', nom: 'Anglais', questions: 12, seances: 1 },
]

const NEUF: MatiereRevisee[] = [
  ...CINQ,
  { subjectId: 'p', slug: 'physique-chimie', nom: 'Physique-Chimie', questions: 10, seances: 1 },
  { subjectId: 'e', slug: 'espagnol', nom: 'Espagnol', questions: 8, seances: 1 },
  { subjectId: 't', slug: 'technologie', nom: 'Technologie', questions: 6, seances: 1 },
  { subjectId: 'c', slug: 'emc', nom: 'EMC', questions: 5, seances: 1 },
]

export default function ApercuMatieresPage() {
  if (process.env.NODE_ENV === 'production') notFound()
  const maintenant = new Date()
  const today = maintenant.toISOString().slice(0, 10)
  const jours = Array.from({ length: 40 }, (_, i) => {
    const d = new Date(maintenant.getTime() - i * 86_400_000)
    return { day: d.toISOString().slice(0, 10), seconds: (i * 7919) % 2400 }
  })
  const semaines = rythmeHebdo(jours, today)
  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 px-4 pt-6 pb-28">
      <h1 className="sr-only">Aperçu du récap des matières</h1>
      <div className="moi-carte rounded-carte px-4 pt-3 pb-10 text-white">
        <div className="flex items-center gap-1.5">
          <BoutonRythme semaines={semaines} phrase={phraseRythme(semaines)} />
          <span className="flex-1" />
          <span className="text-xs font-bold opacity-70">(gemmes · réglages)</span>
        </div>
      </div>
      <MatieresRevisees matieres={CINQ} />
      <MatieresRevisees matieres={NEUF} />
      <MatieresRevisees matieres={[]} />
    </div>
  )
}
