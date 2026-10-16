import Link from 'next/link'
import { Crown, FileText } from 'lucide-react'
import EnTetePage from '@/components/reviser/EnTetePage'
import { Button } from '@/components/ui/button'
import { ANNALES_GRATUITES_PAR_MATIERE } from '@/lib/studuel-plus/formule'

/**
 * UNE ANNALE DONT LE CORRIGÉ EST RÉSERVÉ À STUDUEL+ (15/10/2026, Lucas :
 * « 2 annales corrigées par matière pour le freemium, beaucoup plus pour
 * Studuel+ »). Jamais un mur nu : le SUJET officiel reste ouvert (c'est un
 * document public), les deux annales offertes sont à un geste, et Studuel+ dit
 * ce qu'il ajoute.
 */
export default function AnnaleReservee({
  titre,
  lieu,
  sujetHref,
  annalesHref,
}: {
  titre: string
  lieu: string
  sujetHref: string
  annalesHref: string
}) {
  return (
    <div className="pb-10">
      <EnTetePage retour={{ fallback: annalesHref }} titre={titre} sousTitre={lieu} />
      <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-4">
        <section className="carte p-5 text-center">
          <span className="bg-secondary mx-auto grid size-14 place-items-center rounded-2xl">
            <Crown aria-hidden="true" className="fill-highlight text-accent-foreground size-7" />
          </span>
          <h2 className="font-heading mt-3 text-xl font-extrabold">Le corrigé est avec Studuel+</h2>
          <p className="text-muted-foreground mt-1.5 text-sm font-semibold text-balance">
            Tu as {ANNALES_GRATUITES_PAR_MATIERE} annales corrigées offertes dans cette matière. Avec Studuel+, tu les as
            toutes : chaque sujet tombé, corrigé partie par partie, avec les pièges et les points qui comptent.
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <Button asChild size="xl" className="w-full">
              <Link href="/plus">
                <Crown aria-hidden="true" />
                Découvrir Studuel+
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full">
              <Link href={annalesHref}>Mes annales offertes</Link>
            </Button>
          </div>
        </section>

        <Link href={sujetHref} className="carte flex items-center gap-3 p-4 transition active:translate-y-px">
          <span className="bg-secondary text-primary grid size-11 shrink-0 place-items-center rounded-2xl">
            <FileText aria-hidden="true" className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="font-heading block text-[15px] font-extrabold">Le sujet officiel</span>
            <span className="text-muted-foreground block text-xs font-semibold">Ouvert à tous : lis-le, entraîne-toi</span>
          </span>
        </Link>
      </div>
    </div>
  )
}
