'use client'

import { useState, useTransition } from 'react'
import { Loader2, NotebookPen, Trash2 } from 'lucide-react'
import { ajouterNoteAction, effacerNoteAction } from '@/app/coach/eleves/actions'
import type { NoteCoach } from '@/lib/coach/suivi-server'

/** Les notes privées du coach sur un élève, datées. L'élève ne les voit jamais. */
export default function NotesCarte({ eleveId, notes }: { eleveId: string; notes: NoteCoach[] }) {
  const [texte, setTexte] = useState('')
  const [erreur, setErreur] = useState<string | null>(null)
  const [enCours, demarrer] = useTransition()

  return (
    <section className="carte p-5" aria-labelledby="notes-coach">
      <div className="flex items-center gap-2">
        <NotebookPen className="size-5 text-primary" aria-hidden="true" />
        <h2 id="notes-coach" className="titre-section flex-1">Notes privées</h2>
      </div>
      <p className="mt-1 text-xs font-semibold text-muted-foreground">Seuls toi et l’administration les voyez.</p>
      <form
        className="mt-3 flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          if (!texte.trim()) return
          setErreur(null)
          demarrer(async () => {
            const r = await ajouterNoteAction(eleveId, texte)
            if (r.ok) setTexte('')
            else setErreur(r.erreur)
          })
        }}
      >
        <textarea
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          rows={2}
          maxLength={2000}
          placeholder="Appel avec la maman : fatiguée après les matchs…"
          className="rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <button type="submit" disabled={enCours || !texte.trim()} className="inline-flex h-9 items-center gap-1.5 self-end rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground disabled:opacity-40">
          {enCours ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
          Ajouter
        </button>
        {erreur ? <p className="text-xs font-bold text-(--destructive)">{erreur}</p> : null}
      </form>
      <ul className="mt-3 flex max-h-96 flex-col gap-2 overflow-y-auto">
        {notes.length === 0 ? <li className="text-sm text-muted-foreground">Aucune note.</li> : null}
        {notes.map((n) => (
          <li key={n.id} className="group rounded-xl bg-secondary/60 px-3 py-2 text-sm">
            <p className="whitespace-pre-wrap">{n.corps}</p>
            <p className="mt-1 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <span className="flex-1">
                {new Date(n.creeLe).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })}
                {!n.moi && n.auteur ? ` · ${n.auteur}` : ''}
              </span>
              {n.moi ? (
                <button type="button" onClick={() => demarrer(async () => void (await effacerNoteAction(eleveId, n.id)))} className="opacity-0 group-hover:opacity-100 focus:opacity-100" aria-label="Effacer la note">
                  <Trash2 className="size-3.5" aria-hidden="true" />
                </button>
              ) : null}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
