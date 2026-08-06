import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

// L'en-tête d'une sous-page de Marcel : une flèche de retour et le titre.
//
// La barre de cinq filtres servait à DEUX choses à la fois — choisir une vue, et
// revenir de celle où l'on était. En passant au hub, la seconde disparaît : sans
// cette flèche, un élève entré dans « Progrès » n'aurait plus que le bouton du
// navigateur pour retrouver son travail du jour. Depuis que Marcel n'a plus
// d'onglet, c'est encore plus vrai : la barre du bas ne montre aucun onglet
// actif sur ces écrans.
//
// Deux flèches en enfilade, donc, et c'est voulu : celle-ci remonte au point du
// jour, celle de l'accueil (app/marcel/page.tsx) sort vers Réviser. Elles
// portent le MÊME objet — pastille blanche, flèche violette, ombre douce et
// enfoncement au doigt — parce qu'elles font la même chose à deux étages. C'est
// la pastille de retour du carnet (ReviserSpaces), pas un dessin de plus.
//
// Objet, et non glyphe nu : depuis que Marcel n'a plus d'onglet, la flèche est
// la seule sortie de l'écran. Un trait gris posé sur le fond crème se lisait
// comme une décoration ; une pastille qui prend la lumière se lit comme un
// bouton, et son creux au doigt le confirme.
//
// La flèche est un vrai lien vers /marcel, pas un `history.back()` : arrivé
// depuis une notification ou un lien partagé, un retour d'historique sortirait
// de l'app.

export default function VueHeader({ titre }: { titre: string }) {
  return (
    <header className="mb-3 flex items-center gap-2.5">
      <Link
        href="/marcel"
        aria-label="Revenir au point du jour"
        className="bg-card text-primary flex size-10 shrink-0 items-center justify-center rounded-full shadow-sm ring-1 ring-black/5 transition active:translate-y-px active:scale-95"
      >
        <ArrowLeft aria-hidden="true" className="size-5" strokeWidth={2.6} />
      </Link>
      <h1 className="font-heading min-w-0 flex-1 truncate text-[17px] font-extrabold">
        {titre}
      </h1>
    </header>
  )
}
