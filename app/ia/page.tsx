import { Sparkles } from 'lucide-react'
import PageHeader from '@/components/PageHeader'

export const metadata = { title: 'IA — Studuel' }

// Placeholder : le tuteur IA (GPT-4o) arrivera ici.
export default function IaPage() {
  return (
    <div className="flex min-h-[60vh] flex-col">
      <PageHeader
        title="Ton tuteur IA"
        description="Pose n'importe quelle question de cours, il t'explique simplement."
      />

      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        <span className="text-5xl">✨</span>
        <p className="font-heading text-xl font-bold">Bientôt disponible</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          « Explique-moi le théorème de Pythagore comme si j&apos;avais 10
          ans » — ce genre de questions, il adore.
        </p>
      </div>

      {/* La barre, déjà en place — inactive pour l'instant */}
      <div className="mx-auto flex w-full max-w-xl items-center gap-2 rounded-full border bg-card py-1.5 pr-1.5 pl-4 shadow-lg">
        <Sparkles className="size-4 shrink-0 text-primary" />
        <input
          type="text"
          disabled
          placeholder="Explique-moi… (bientôt)"
          aria-label="Poser une question à l'IA (bientôt disponible)"
          className="h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
    </div>
  )
}
