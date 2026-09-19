import { Skeleton } from '@/components/ui/skeleton'

// Squelette d'un cours du carnet : le lien de retour, puis LE bloc unique
// (titre et icône, sous-dossiers) — l'écran repris de zéro le 10/09/2026.
export default function CoursCarnetLoading() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-5 w-28 rounded-full" />
      <Skeleton className="h-72 rounded-[1.75rem]" />
    </div>
  )
}
