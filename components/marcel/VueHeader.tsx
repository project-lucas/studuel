import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

// L'en-tête d'une sous-page de Marcel : une flèche de retour et le titre.
//
// La barre de cinq filtres servait à DEUX choses à la fois — choisir une vue, et
// revenir de celle où l'on était. En passant au hub, la seconde disparaît : sans
// cette flèche, un élève entré dans « Progrès » n'aurait plus que le bouton du
// navigateur (ou l'onglet Marcel de la barre du bas, qui ne se relit pas comme
// un retour) pour retrouver son travail du jour.
//
// La flèche est un vrai lien vers /marcel, pas un `history.back()` : arrivé
// depuis une notification ou un lien partagé, un retour d'historique sortirait
// de l'app.

export default function VueHeader({ titre }: { titre: string }) {
  return (
    <header className="mb-3 flex items-center gap-1">
      <Link
        href="/marcel"
        aria-label="Revenir au point du jour"
        className="text-muted-foreground -ml-2 flex size-11 shrink-0 items-center justify-center rounded-full transition-colors active:bg-foreground/8"
      >
        <ArrowLeft aria-hidden="true" className="size-5" strokeWidth={2.4} />
      </Link>
      <h1 className="font-heading min-w-0 flex-1 truncate text-[17px] font-extrabold">
        {titre}
      </h1>
    </header>
  )
}
