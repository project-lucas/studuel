import Link from 'next/link'
import { notFound } from 'next/navigation'
import 'katex/dist/katex.min.css'
import { ANNALES_CORRIGEES } from '@/lib/annales-corrigees/registre'
import { annalesParAnnee, lieuDe } from '@/lib/annales-corrigees/apercu'
import { estMatiereAnnale } from '@/lib/annales-corrigees/matieres'
import { examYearFor } from '@/lib/annales'
import AnnalesPanel from '@/components/reviser/AnnalesPanel'
import EcranAnnale from '@/components/annales/EcranAnnale'
import LecteurPdf from '@/components/annales/LecteurPdf'
import { pdfSujet } from '@/lib/annales-corrigees/apercu'

export const dynamic = 'force-dynamic'

// L'APERÇU DES ANNALES CORRIGÉES — en développement seulement, sans compte.
//
//   /dev/annales                          → la liste de toutes les annales
//   /dev/annales?matiere=svt&niveau=Tle   → l'onglet Annales d'une matière
//   /dev/annales?id=<id>[&partie=<id>]    → l'écran d'une annale
//   /dev/annales?id=<id>&sujet=1          → le lecteur du sujet

export default async function DevAnnales({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; partie?: string; matiere?: string; niveau?: string; sujet?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { id, partie, matiere, niveau, sujet } = await searchParams

  if (id) {
    const annale = ANNALES_CORRIGEES.find((a) => a.id === id)
    if (!annale || !estMatiereAnnale(annale.matiere)) notFound()
    if (sujet) return <LecteurPdf src={pdfSujet(annale.id)} titre={annale.titre} />
    return <EcranAnnale annale={annale} subject={annale.matiere} partie={partie ?? null} />
  }

  if (matiere) {
    const grade = niveau ?? 'Tle'
    const exam = examYearFor(grade)
    if (!exam) notFound()
    return (
      <AnnalesPanel
        subject={{ slug: matiere, name: matiere }}
        exam={exam}
        papers={[]}
        annales={annalesParAnnee(ANNALES_CORRIGEES, matiere, grade)}
      />
    )
  }

  return (
    <ul className="mx-auto flex max-w-2xl flex-col gap-1 text-sm">
      {ANNALES_CORRIGEES.map((a) => (
        <li key={a.id}>
          <Link className="font-bold text-primary underline" href={`/dev/annales?id=${a.id}`}>
            {a.titre} · {lieuDe(a)}
          </Link>{' '}
          <span className="text-muted-foreground">({a.parties.length} parties)</span>
        </li>
      ))}
    </ul>
  )
}
