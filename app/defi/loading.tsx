import { Skeleton } from '@/components/ui/skeleton'

// Squelette du Défi : l'écran d'arène (orbes sur les bords, centre, coffres, CTA).
export default function DefiLoading() {
  return (
    <div className="-mx-4 -mt-16 -mb-24 flex h-dvh flex-col overflow-hidden px-3 pt-14 pb-[calc(4.75rem+env(safe-area-inset-bottom))] md:mx-0 md:-my-10 md:pt-4 md:pb-4">
      <div className="mx-auto flex h-full w-full max-w-md flex-col gap-3">
        <Skeleton className="mx-auto h-8 w-56 rounded-full bg-white/10" />

        {/* Scène : colonnes d'orbes + centre. */}
        <div className="relative min-h-0 flex-1">
          <div className="absolute top-1 left-0 flex flex-col gap-4">
            <Skeleton className="size-14 rounded-full bg-white/10" />
            <Skeleton className="size-14 rounded-full bg-white/10" />
            <Skeleton className="size-14 rounded-full bg-white/10" />
          </div>
          <div className="absolute top-1 right-0 flex flex-col gap-4">
            <Skeleton className="size-14 rounded-full bg-white/10" />
            <Skeleton className="size-14 rounded-full bg-white/10" />
            <Skeleton className="size-14 rounded-full bg-white/10" />
          </div>
          <div className="flex h-full flex-col items-center justify-center gap-3 px-16">
            <Skeleton className="h-28 w-28 rounded-full bg-white/10" />
            <Skeleton className="h-7 w-36 rounded-full bg-white/10" />
            <Skeleton className="h-9 w-24 rounded-2xl bg-white/10" />
            <Skeleton className="h-3 w-full max-w-60 rounded-full bg-white/10" />
          </div>
        </div>

        {/* Coffres + CTA. */}
        <div className="grid grid-cols-4 gap-2.5">
          <Skeleton className="aspect-square rounded-[18px] bg-white/10" />
          <Skeleton className="aspect-square rounded-[18px] bg-white/10" />
          <Skeleton className="aspect-square rounded-[18px] bg-white/10" />
          <Skeleton className="aspect-square rounded-[18px] bg-white/10" />
        </div>
        <Skeleton className="h-16 w-full rounded-2xl bg-white/10" />
      </div>
    </div>
  )
}
