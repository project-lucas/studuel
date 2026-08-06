'use client'

import { Gamepad2 } from 'lucide-react'
import ModeTicket from '@/components/defi/ModeTicket'
import { useRecords } from '@/lib/jeux/use-records'
import { salonSubjectFor, subjectGameTickets } from '@/lib/defi/modes-catalog'

/**
 * Les JEUX de la matière, dans l'onglet Défis de son dossier — exactement les
 * billets de la feuille « Modes de jeu » de l'arène, illustrations et format
 * compris.
 *
 * Pourquoi ici : les jeux d'une matière ne se trouvaient QUE dans l'arène, au
 * bout d'une roulette qu'il fallait faire tourner jusqu'à sa matière. L'élève
 * qui révise le français est déjà dans le dossier Français — c'est là que le
 * duel d'orthographe doit lui être proposé. Chaque billet annonce son record
 * personnel : le chiffre à battre.
 *
 * Une matière sans salon (EMC, Sport…) ne rend RIEN : mieux vaut pas de section
 * qu'une section vide qui promet des jeux inexistants.
 */
export default function SubjectGames({
  subject,
}: {
  subject: { slug: string; name: string }
}) {
  const salon = salonSubjectFor(subject)
  const tickets = salon ? subjectGameTickets(salon) : []
  const records = useRecords(
    tickets.flatMap((t) => (t.recordKey ? [t.recordKey] : [])),
  )

  if (tickets.length === 0) return null

  return (
    <section aria-labelledby="jeux-matiere" className="mt-4">
      <p className="text-sm font-semibold text-muted-foreground">
        Jeux de l’Arène
      </p>
      <h2
        id="jeux-matiere"
        className="font-heading mt-0.5 flex items-center gap-2 text-lg font-bold text-balance"
      >
        <Gamepad2 className="size-5 shrink-0 text-primary" aria-hidden="true" />
        Modes de jeu · {subject.name}
      </h2>

      <div className="mt-3 flex flex-col gap-3">
        {tickets.map((t) => (
          <ModeTicket
            key={t.id}
            ticket={t}
            record={records && t.recordKey ? (records[t.recordKey] ?? 0) : null}
          />
        ))}
      </div>
    </section>
  )
}
