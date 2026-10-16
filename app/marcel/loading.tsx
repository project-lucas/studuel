// Squelette du bureau de Marcel (16/10/2026).
//
// La page lit le profil, la maîtrise, les chapitres du niveau, les contrôles,
// l'historique d'activité et le carnet de Marcel : c'est l'un des écrans les
// plus lourds de l'app. Le squelette reprend la FORME et les HAUTEURS du rendu
// final — la bande peinte du bureau (184 px), la barre des quatre onglets, la
// séance et son gros bouton, le champ en bas — pour qu'aucune ligne ne se
// déplace à l'arrivée des données.

export default function MarcelLoading() {
  return (
    <div className="px-4" aria-busy="true" aria-live="polite">
      <span className="sr-only">Marcel prépare ton bureau…</span>
      <div className="flex h-[calc(100dvh-4.5rem)] min-h-[26rem] flex-col md:h-auto md:min-h-0">
        {/* La bande du bureau, peinte, bord à bord et sous l'encoche : un aplat chaud le temps qu'elle arrive. */}
        <div className="relative h-[calc(15rem+env(safe-area-inset-top))] shrink-0 animate-pulse max-md:left-1/2 max-md:w-screen max-md:-translate-x-1/2 md:mt-2 md:h-[240px] bg-[color-mix(in_oklch,var(--highlight),var(--background)_75%)] md:mx-0 md:rounded-[28px]">
          <span className="bg-card/80 absolute top-[calc(0.75rem+env(safe-area-inset-top))] left-4 size-10 rounded-full" />
          <span className="bg-card/80 absolute top-[calc(0.75rem+env(safe-area-inset-top))] right-4 size-10 rounded-full" />
          <span className="bg-card/60 absolute bottom-5 left-5 h-[140px] w-[88px] rounded-[40%]" />
          <span className="bg-card/90 absolute right-4 bottom-12 left-[136px] h-14 rounded-2xl" />
        </div>

        <div className="bg-secondary mt-0 grid h-12 shrink-0 grid-cols-4 gap-1 rounded-2xl p-1">
          <span className="bg-card rounded-xl" />
        </div>

        <div className="bg-card mt-2.5 rounded-[1.5rem] p-3.5">
          <div className="flex items-center justify-between">
            <span className="bg-foreground/10 h-4 w-36 animate-pulse rounded-full" />
            <span className="bg-foreground/8 h-7 w-28 animate-pulse rounded-full" />
          </div>
          <span className="bg-primary/70 mt-2.5 block h-16 animate-pulse rounded-[20px]" />
          {[0, 1].map((i) => (
            <div key={i} className="mt-3 flex items-center gap-2.5">
              <span className="bg-foreground/10 size-7 shrink-0 animate-pulse rounded-full" />
              <span className="flex-1 space-y-1.5">
                <span className="bg-foreground/10 block h-3.5 w-2/3 animate-pulse rounded-full" />
                <span className="bg-foreground/6 block h-3 w-1/2 animate-pulse rounded-full" />
              </span>
            </div>
          ))}
        </div>

        <div className="bg-card mt-auto flex h-[62px] shrink-0 items-center gap-2 rounded-[26px] px-3">
          <span className="bg-foreground/8 size-11 rounded-full" />
          <span className="bg-foreground/8 h-4 flex-1 rounded-full" />
          <span className="bg-primary/40 size-11 rounded-full" />
        </div>
      </div>
    </div>
  )
}
