import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { Download, PenLine } from 'lucide-react'
import { ANNALES_CORRIGEES } from '@/lib/annales-corrigees/registre'
import { cheminAnnale, lieuDe, pdfSujet, trouverAnnale } from '@/lib/annales-corrigees/apercu'
import { MATIERES_ANNALES, estMatiereAnnale } from '@/lib/annales-corrigees/matieres'
import { titreEpreuve } from '@/lib/annales-corrigees/epreuve'
import { getCurrentUser } from '@/lib/supabase/user'
import EnTetePage from '@/components/reviser/EnTetePage'
import { Button } from '@/components/ui/button'
import LecteurPdf from '@/components/annales/LecteurPdf'

// LE SUJET, LU DANS L'APP : le PDF habillé (couverture Studuel + pages
// officielles), peint page après page par pdf.js. En bas, le chemin du
// corrigé — une fois le sujet composé, c'est là qu'on va.

export const dynamic = 'force-dynamic'

export default async function SujetPage({ params }: { params: Promise<{ subject: string; id: string }> }) {
  const { subject, id } = await params
  const annale = trouverAnnale(ANNALES_CORRIGEES, subject, id)
  if (!annale || !estMatiereAnnale(subject)) notFound()
  if (!(await getCurrentUser())) redirect('/login')

  const titre = titreEpreuve(annale)
  const src = pdfSujet(annale.id)

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 pb-10">
      <EnTetePage
        retour={{ fallback: cheminAnnale(subject, annale.id), label: 'Revenir au corrigé' }}
        titre="Le sujet"
        sousTitre={`${titre} · ${MATIERES_ANNALES[subject].court} · ${lieuDe(annale)}`}
        droite={
          <Button asChild size="icon" variant="outline" aria-label="Télécharger le sujet en PDF">
            <a href={src} download={`${annale.id}-studuel.pdf`}>
              <Download aria-hidden="true" />
            </a>
          </Button>
        }
      />

      <LecteurPdf src={src} titre={`${titre}, ${MATIERES_ANNALES[subject].long}`} />

      <div className="carte flex flex-col items-center gap-3 px-4 py-5 text-center">
        <p className="font-heading text-lg font-extrabold">Tu as composé ?</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Compare ta copie au corrigé Studuel, partie par partie : la méthode, les pièges et ce
          que le correcteur attend.
        </p>
        <Button asChild size="xl" shine>
          <Link href={cheminAnnale(subject, annale.id)}>
            <PenLine aria-hidden="true" />
            Voir le corrigé
          </Link>
        </Button>
      </div>
    </div>
  )
}
