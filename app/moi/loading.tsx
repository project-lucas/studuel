import { Skeleton } from '@/components/ui/skeleton'

// Squelette calqué sur la composition réelle, y compris ses DÉBORDEMENTS : le
// panneau d'identité et la bande « matière » sortent des marges de la page. Un
// squelette qui ignore ça ferait sauter la mise en page au moment précis où le
// contenu arrive — l'écran bougerait sous le pouce.
export default function MoiLoading() {
  return (
    <div className="flex flex-col">
      <Skeleton className="-mx-4 -mt-2 h-72 rounded-b-[2rem] md:-mx-8 md:rounded-b-[2.5rem]" />
      <Skeleton className="mt-5 h-64 rounded-3xl" />
      <Skeleton className="mt-9 -mx-4 h-52 md:-mx-8 md:rounded-3xl" />
      <Skeleton className="mt-9 h-64 rounded-3xl" />
    </div>
  )
}
