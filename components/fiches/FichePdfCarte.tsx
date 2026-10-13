import Image from 'next/image'
import type { FichePdf } from '@/lib/fiches/pdf'

/**
 * L'APERÇU D'UNE FICHE PDF, posé sous le paywall de `UnlockChapterCard` — ce
 * qu'on achète : l'illustration, le titre et l'accroche sont gratuits, c'est
 * le PDF qui est payant, et il n'est ni chargé ni signé ici. Une fois le
 * chapitre débloqué, la page Fiche ne montre plus cette carte : la fiche
 * elle-même, lue dans l'app par `LecteurPdf`.
 */
export default function FichePdfCarte({
  fiche,
  apercu,
}: {
  fiche: FichePdf
  /** L'adresse publique de l'illustration (bucket `fiches-apercus`). */
  apercu: string
}) {
  return (
    <article className="carte min-h-[21rem] p-5 opacity-40 select-none sm:p-6">
      <div className="flex items-start gap-4">
        <div className="min-w-0 flex-1">
          <p className="surtitre">Fiche de révision · {fiche.niveau}</p>
          <h2 className="font-heading mt-1 text-2xl font-extrabold leading-tight text-balance">{fiche.titreAffiche}</h2>
          {fiche.accroche ? <p className="text-primary mt-1 font-semibold">{fiche.accroche}</p> : null}
          <p className="text-muted-foreground mt-3 text-sm">
            Une page A4 à lire dans l’app ou à imprimer&nbsp;: l’essentiel, la méthode, un exemple résolu, ce qu’on
            écrit sur la copie, les pièges, et trois questions pour se tester.
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
    </article>
  )
}
