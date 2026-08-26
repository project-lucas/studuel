import { CalendarDays } from 'lucide-react'
import type { ControleView } from '@/lib/parents-suivi'

/**
 * L'agenda : les contrôles que l'enfant a déclarés dans l'app.
 *
 * POURQUOI C'EST LE BLOC LE PLUS IMPORTANT DE L'ÉCRAN. C'est la seule
 * information réellement ACTIONNABLE du suivi : un temps de travail se
 * constate, un contrôle jeudi se prépare. Elle existait en base depuis la
 * migration 203 — déclarée par l'élève lui-même depuis Réviser — et le parent
 * ne la voyait nulle part, alors qu'elle était à une jointure de là.
 *
 * Le compte à rebours s'écrit en mots (« Demain », « Dans 3 jours ») et non en
 * « J-1 » : le parent n'est pas dans le jeu, il n'a pas à en apprendre la
 * notation. Un contrôle à deux jours ou moins passe en corail — même seuil
 * d'imminence que l'écran de l'élève, pour que la même échéance devienne
 * urgente le même jour des deux côtés.
 *
 * ÉTAT VIDE. Aucun contrôle déclaré n'est pas une anomalie : c'est le cas
 * normal en début de trimestre. On l'écrit, et on dit d'où viennent ces
 * échéances — sans quoi un parent croirait que l'app a perdu l'information.
 */
export default function ControlesAVenir({
  controles,
  childName,
}: {
  controles: ControleView[]
  childName: string
}) {
  return (
    <section className="mb-5">
      <h4 className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
        Contrôles à venir
      </h4>

      {controles.length === 0 ? (
        <p className="text-muted-foreground rounded-xl border border-dashed p-3.5 text-sm">
          Aucun contrôle déclaré pour le moment. {childName} les saisit
          lui-même depuis l’onglet <span className="font-medium">Réviser</span> —
          l’app lui prépare alors ses sessions de révision jour par jour.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {controles.map((c) => (
            <li
              key={c.id}
              className={`flex items-center gap-3 rounded-xl border p-3 ${
                c.imminent
                  ? 'border-destructive/35 bg-destructive/[0.04]'
                  : 'bg-background'
              }`}
            >
              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                  c.imminent
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-primary/10 text-primary'
                }`}
              >
                <CalendarDays className="size-4" strokeWidth={2.4} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">
                  {c.subjectName}
                </span>
                <span className="text-muted-foreground block truncate text-xs">
                  {c.chaptersLabel}
                </span>
              </span>
              <span
                className={`shrink-0 text-xs font-bold ${
                  c.imminent ? 'text-destructive' : 'text-muted-foreground'
                }`}
              >
                {c.countdown}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
