import Image from 'next/image'
import { Download, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { hrefFichePdf, type FichePdf } from '@/lib/fiches/pdf'

/**
 * LA FICHE PDF D'UN CHAPITRE, sur la page Fiche — l'objet qu'on vend, puis
 * qu'on ouvre.
 *
 * Fermée (`ouverte` à false), la carte est l'APERÇU posé sous le paywall de
 * `UnlockChapterCard` : l'illustration, le titre et l'accroche sont gratuits —
 * c'est le PDF qui est payant, et il n'est pas chargé. Ouverte, elle porte les
 * deux gestes : lire la fiche (un nouvel onglet, le lecteur PDF du téléphone)
 * ou l'enregistrer. Les deux passent par `/api/fiches/<chapitre>`, qui signe
 * l'adresse avec la session de l'élève.
 */
export default function FichePdfCarte({
  fiche,
  chapitreId,
  apercu,
  ouverte,
}: {
  fiche: FichePdf
  chapitreId: string
  /** L'adresse publique de l'illustration (bucket `fiches-apercus`). */
  apercu: string
  ouverte: boolean
}) {
  return (
    <article className={`carte p-5 sm:p-6 ${ouverte ? '' : 'min-h-[21rem] opacity-40 select-none'}`}>
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <p className="surtitre">Fiche de révision · {fiche.niveau}</p>
          <h2 className="font-heading mt-1 text-2xl font-extrabold leading-tight text-balance">{fiche.titreAffiche}</h2>
          {fiche.accroche ? <p className="text-primary mt-1 font-semibold">{fiche.accroche}</p> : null}
          <p className="text-muted-foreground mt-3 text-sm">
            Une page A4 à lire ou à imprimer&nbsp;: l’essentiel, la méthode, un exemple résolu, ce qu’on écrit sur la
            copie, les pièges, et trois questions pour se tester.
          </p>
        </div>
        {/* L'illustration de la fiche, telle qu'elle est posée en haut à droite
            de la page : servie depuis le bucket public, en 360 px. */}
        <Image
          src={apercu}
          alt=""
          aria-hidden="true"
          width={120}
          height={90}
          unoptimized
          className="w-24 shrink-0 object-contain drop-shadow-md sm:w-28"
        />
      </div>

      {ouverte ? (
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button asChild size="xl" shine className="flex-1 rounded-full">
            <a href={hrefFichePdf(chapitreId)} target="_blank" rel="noopener noreferrer">
              <FileText className="size-5" aria-hidden="true" />
              Ouvrir la fiche
            </a>
          </Button>
          <Button asChild variant="outline" size="xl" className="flex-1 rounded-full">
            <a href={hrefFichePdf(chapitreId, { telecharger: true })}>
              <Download className="size-5" aria-hidden="true" />
              Télécharger
            </a>
          </Button>
        </div>
      ) : null}
    </article>
  )
}
