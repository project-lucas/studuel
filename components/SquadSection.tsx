'use client'

import { useOptimistic, useState, useTransition } from 'react'
import { Star, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MAX_SQUAD_SIZE, squadSlotsLeft } from '@/lib/gems'
import type { Friend } from '@/lib/social'
import {
  addFriendToSquad,
  removeFriendFromSquad,
} from '@/app/amis/actions'

// « Mon groupe » — le cercle intime, distinct de la liste des relations.
//
// Deux cercles, volontairement : on VEUT que l'élève ajoute le plus de monde
// possible (chaque relation nourrit le parrainage et les classements), mais on
// ne veut pas que sa liste de vrais copains soit noyée par des inconnus croisés
// dans un tournoi. D'où cette sélection à la main, plafonnée à 10.
//
// Elle est PRIVÉE et unilatérale : personne ne sait s'il figure dans le groupe
// d'un autre. Pas de demande, pas de refus, personne de blessé — c'est ce qui
// rend le geste sans conséquence sociale, donc effectivement utilisé.
export default function SquadSection({
  friends,
  squadIds,
  squadName,
}: {
  friends: Friend[]
  squadIds: string[]
  squadName: string | null
}) {
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  // La composition du groupe reste la propriété du SERVEUR (`squadIds`) : on ne
  // la recopie pas dans un état local. `useOptimistic` superpose la bascule en
  // cours par-dessus, et retombe tout seul sur la vérité serveur à la fin de la
  // transition.
  //
  // Ce choix corrige deux pièges d'une bascule optimiste écrite à la main :
  //   • le retour en arrière ne peut plus écraser une AUTRE bascule lancée
  //     entre-temps (rien n'empêche d'étoiler B pendant que A est en vol), car
  //     chaque mise à jour se calcule à partir de l'état courant, pas d'un
  //     instantané capturé dans la fermeture ;
  //   • l'affichage ne peut plus diverger durablement de la base : chaque
  //     revalidatePath('/amis') — y compris ceux déclenchés par les actions
  //     voisines (accepter une demande, retirer un ami…) — redescend la vraie
  //     liste, là où un useState initialisé une seule fois l'aurait ignorée
  //     jusqu'au prochain rechargement complet.
  const [ids, applyOptimistic] = useOptimistic(
    squadIds,
    (current: string[], toggled: string) =>
      current.includes(toggled)
        ? current.filter((id) => id !== toggled)
        : [...current, toggled],
  )

  const slotsLeft = squadSlotsLeft(ids.length)

  function toggle(friend: Friend) {
    const inSquad = ids.includes(friend.id)
    setError(null)

    startTransition(async () => {
      setPendingId(friend.id)
      applyOptimistic(friend.id)

      // Le retrait ne renvoie pas de message (il n'échoue que sur panne) ;
      // l'ajout, si : « groupe plein » ou « il faut d'abord être amis » sont
      // des refus que l'élève doit pouvoir comprendre. En cas d'échec on se
      // contente d'afficher la raison : l'étoile revient d'elle-même à son état
      // serveur quand la transition se termine, sans rollback manuel.
      if (inSquad) {
        const { ok } = await removeFriendFromSquad(friend.id)
        if (!ok) setError('Impossible pour le moment. Réessaie.')
      } else {
        const { ok, message } = await addFriendToSquad(friend.id)
        if (!ok) setError(message)
      }
      setPendingId(null)
    })
  }

  if (friends.length === 0) return null

  return (
    <section>
      <h2 className="font-heading mb-1 flex items-center gap-2 text-lg font-semibold">
        <Users className="text-muted-foreground size-4" aria-hidden="true" />
        {squadName ?? 'Mon groupe'}
      </h2>
      <p className="text-muted-foreground mb-3 text-xs">
        Choisis tes proches parmi tes amis ({ids.length}/{MAX_SQUAD_SIZE}).
        Personne n&apos;est prévenu — c&apos;est ta liste, elle reste privée.
      </p>

      <ul className="bg-card ring-foreground/10 overflow-hidden rounded-2xl ring-1">
        {friends.map((friend) => {
          const inSquad = ids.includes(friend.id)
          // Groupe plein : on grise l'ajout mais jamais le retrait, sinon
          // l'élève se retrouve enfermé dans une composition qu'il ne peut
          // plus modifier.
          const blocked = !inSquad && slotsLeft === 0

          return (
            <li
              key={friend.id}
              className="flex items-center gap-3 border-b px-3 py-2.5 last:border-b-0"
            >
              <span className="text-xl" aria-hidden="true">
                {friend.emoji}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium">
                {friend.name}
              </span>

              <button
                type="button"
                onClick={() => toggle(friend)}
                disabled={blocked || pendingId === friend.id}
                aria-pressed={inSquad}
                aria-label={
                  inSquad
                    ? `Retirer ${friend.name} de ton groupe`
                    : `Ajouter ${friend.name} à ton groupe`
                }
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors',
                  inSquad
                    ? 'border-highlight bg-highlight text-foreground'
                    : 'text-muted-foreground hover:bg-accent/40',
                  blocked && 'cursor-not-allowed opacity-40',
                )}
              >
                <Star
                  className="size-4"
                  fill={inSquad ? 'currentColor' : 'none'}
                  aria-hidden="true"
                />
              </button>
            </li>
          )
        })}
      </ul>

      {error ? (
        <p className="text-destructive mt-2 px-1 text-xs font-medium" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  )
}
