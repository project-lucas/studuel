// Squelette de l'onglet Marcel.
//
// La page lit le profil, la maîtrise, les chapitres du niveau, les contrôles et
// l'historique d'activité : c'est l'un des écrans les plus lourds de l'app.
// Sans squelette, le hero apparaît vide puis saute — et c'est justement l'écran
// qui doit inspirer le calme.
//
// Les blocs reprennent les hauteurs RÉELLES du rendu final (hero + séance), pour
// qu'aucune ligne ne se déplace à l'arrivée des données.

export default function MarcelLoading() {
  return (
    <div className="px-4 pt-2 pb-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Marcel regarde ton travail…</span>

      <div className="mx-0.5 mt-1 mb-2 flex items-center justify-between">
        <span className="bg-foreground/10 h-4 w-36 animate-pulse rounded-full" />
        <span className="bg-foreground/10 h-6 w-20 animate-pulse rounded-full" />
      </div>

      {/* Le filtre des fonctions */}
      <div className="mb-3 flex gap-1.5">
        <span className="bg-foreground/10 h-11 flex-1 animate-pulse rounded-xl" />
        <span className="bg-foreground/6 h-11 flex-1 animate-pulse rounded-xl" />
      </div>

      {/* Le point du jour */}
      <div className="bg-primary/85 relative h-[232px] animate-pulse overflow-hidden rounded-3xl p-4">
        <div className="flex items-start gap-3">
          <span className="size-[74px] shrink-0 rounded-full bg-white/20" />
          <div className="flex-1 space-y-2 pt-1">
            <span className="block h-2.5 w-32 rounded-full bg-white/30" />
            <span className="block h-4 w-full rounded-full bg-white/25" />
            <span className="block h-4 w-4/5 rounded-full bg-white/25" />
          </div>
        </div>
        <span className="mt-6 block h-12 w-full rounded-2xl bg-white/70" />
      </div>

      {/* La séance */}
      <div className="mt-3">
        <div className="mx-0.5 mb-1.5 flex items-center justify-between">
          <span className="bg-foreground/10 h-4 w-40 animate-pulse rounded-full" />
          <span className="bg-foreground/10 h-3 w-12 animate-pulse rounded-full" />
        </div>
        <div className="bg-card space-y-3 rounded-[20px] p-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="bg-foreground/10 size-8 shrink-0 animate-pulse rounded-xl" />
              <span className="flex-1 space-y-1.5">
                <span className="bg-foreground/10 block h-3.5 w-2/3 animate-pulse rounded-full" />
                <span className="bg-foreground/6 block h-3 w-1/2 animate-pulse rounded-full" />
              </span>
              <span className="bg-foreground/10 h-6 w-12 animate-pulse rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
