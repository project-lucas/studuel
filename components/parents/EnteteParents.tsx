import Link from 'next/link'
import { LogOut, Settings } from 'lucide-react'
import { signOut } from '@/app/login/actions'
import { GRID_PATTERN } from '@/lib/subject-style'

/**
 * L'en-tête de l'espace parents — SON chrome, puisque celui de l'élève n'y
 * est plus (cf. `estEspaceParents` dans lib/quiz-chrome).
 *
 * Il tient en une ligne : le logo-mot, le compte, la déconnexion. Puis le
 * héros violet : le prénom du parent, et le résumé de la semaine en une
 * phrase (« 2 enfants suivis · dernière activité hier ») — la réponse la plus
 * courte possible à « tout va bien ? », avant même de faire défiler.
 */
export default function EnteteParents({
  prenom,
  sousTitre,
}: {
  prenom: string | null
  /** La phrase de résumé, déjà composée par la page. */
  sousTitre: string
}) {
  return (
    <header className="bg-primary text-primary-foreground relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={GRID_PATTERN}
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-2xl px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] md:px-8">
        <nav
          aria-label="Compte parent"
          className="flex items-center justify-between gap-3"
        >
          <span className="font-heading text-lg font-extrabold tracking-tight">
            studuel
            <span className="ml-1.5 rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-bold tracking-wide uppercase">
              parents
            </span>
          </span>
          <span className="flex items-center gap-1">
            <Link
              href="/compte"
              className="flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-primary-foreground/90 hover:bg-white/10"
            >
              <Settings className="size-4" aria-hidden="true" />
              Mon compte
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-primary-foreground/90 hover:bg-white/10"
              >
                <LogOut className="size-4" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">Se déconnecter</span>
              </button>
            </form>
          </span>
        </nav>

        <div className="pt-6 pb-8 md:pt-8 md:pb-10">
          <h1 className="font-heading text-3xl font-extrabold text-balance">
            {prenom ? `Bonjour ${prenom}` : 'Suivi de vos enfants'}
          </h1>
          <p className="mt-2 max-w-prose text-sm opacity-90">{sousTitre}</p>
        </div>
      </div>
    </header>
  )
}
