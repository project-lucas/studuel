import Link from 'next/link'
import { Library, ArrowLeft } from 'lucide-react'
import BackButton from '@/components/BackButton'

export const metadata = { title: 'Bibliothèque — Studuel' }

// Stub — le studio complet (onglets Fiches/Quiz/Flashcards + création) arrive
// dans une prochaine étape. La tuile « Voir ma bibliothèque » pointe déjà ici
// pour ne pas laisser de lien mort.
export default function BibliothequePage() {
  return (
    <div className="mx-auto w-full max-w-xl">
      <BackButton fallback="/reviser" label="Retour aux révisions" />

      <div className="mt-6 rounded-3xl bg-card p-8 text-center shadow-sm ring-1 ring-black/5">
        <span className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <Library className="size-8" strokeWidth={2} aria-hidden="true" />
        </span>
        <h1 className="font-heading mt-4 text-2xl font-bold">Ta bibliothèque</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Bientôt : retrouve et crée tes fiches, quiz et flashcards, tout au même
          endroit.
        </p>
        <Link
          href="/reviser"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
        >
          <ArrowLeft className="size-4" /> Retour aux révisions
        </Link>
      </div>
    </div>
  )
}
