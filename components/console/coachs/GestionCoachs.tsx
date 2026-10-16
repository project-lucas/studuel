'use client'

import { useState, useTransition } from 'react'
import { Loader2, UserMinus, UserPlus } from 'lucide-react'
import { nommerCoachAction, retirerCoachAction } from '@/app/admin/coachs/actions'
import { cn } from '@/lib/utils'

export type CoachLigne = {
  id: string
  prenom: string | null
  email: string | null
  admin: boolean
  groupes: number
  eleves: number
  inactifs7: number
  messages7: number
  filsEnAttente: number
  derniereConnexion: string | null
}

/**
 * LA GESTION DES COACHS (Lucas : « rapide, pas besoin de s'y attarder, je suis
 * seul pour l'instant ») : nommer par e-mail, voir la charge et l'activité de
 * chacun, retirer le rôle. Une seule page.
 */
export default function GestionCoachs({ coachs, moi }: { coachs: CoachLigne[]; moi: string }) {
  const [email, setEmail] = useState('')
  const [retour, setRetour] = useState<{ ok: boolean; message: string } | null>(null)
  const [confirmer, setConfirmer] = useState<string | null>(null)
  const [enCours, demarrer] = useTransition()

  return (
    <div className="flex flex-col gap-5">
      <section className="carte p-5">
        <h2 className="titre-section">Nommer un coach</h2>
        <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
          La personne crée d’abord son compte Studuel (comme un élève), puis tu saisis son e-mail ici. Elle crée ensuite ses groupes et partage leur code.
        </p>
        <form
          className="mt-3 flex flex-wrap gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            demarrer(async () => {
              const r = await nommerCoachAction(email)
              setRetour(r)
              if (r.ok) setEmail('')
            })
          }}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="coach@exemple.fr"
            aria-label="E-mail du futur coach"
            className="h-11 min-w-64 flex-1 rounded-full border bg-background px-4 text-sm outline-none focus:border-primary"
          />
          <button type="submit" disabled={enCours || !email.trim()} className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground disabled:opacity-50">
            {enCours ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <UserPlus className="size-4" aria-hidden="true" />}
            Nommer coach
          </button>
        </form>
        {retour ? <p className={cn('mt-2 text-sm font-bold', retour.ok ? 'text-(--success)' : 'text-(--destructive)')}>{retour.message}</p> : null}
      </section>

      <section className="carte overflow-x-auto p-0">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b text-left text-xs font-extrabold tracking-wide text-muted-foreground uppercase">
              <th className="px-5 py-3">Coach</th>
              <th className="px-3 py-3 text-right">Groupes</th>
              <th className="px-3 py-3 text-right">Élèves</th>
              <th className="px-3 py-3 text-right">Inactifs · 7 j</th>
              <th className="px-3 py-3 text-right">Messages · 7 j</th>
              <th className="px-3 py-3 text-right">Fils en attente</th>
              <th className="px-3 py-3">Dernière connexion</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {coachs.map((c) => (
              <tr key={c.id} className="border-b border-primary/5 last:border-0">
                <td className="px-5 py-3">
                  <span className="block font-extrabold">
                    {c.prenom ?? 'Sans nom'}
                    {c.admin ? <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold text-primary">admin</span> : null}
                  </span>
                  <span className="block text-xs font-semibold text-muted-foreground">{c.email}</span>
                </td>
                <td className="px-3 py-3 text-right font-heading font-extrabold tabular-nums">{c.groupes}</td>
                <td className="px-3 py-3 text-right font-heading font-extrabold tabular-nums">{c.eleves}</td>
                <td className={cn('px-3 py-3 text-right font-heading font-extrabold tabular-nums', c.eleves && c.inactifs7 / c.eleves > 0.3 ? 'text-(--destructive)' : '')}>
                  {c.inactifs7}
                  {c.eleves ? <span className="ml-1 text-xs font-semibold text-muted-foreground">({Math.round((c.inactifs7 / c.eleves) * 100)} %)</span> : null}
                </td>
                <td className="px-3 py-3 text-right font-heading font-extrabold tabular-nums">{c.messages7}</td>
                <td className={cn('px-3 py-3 text-right font-heading font-extrabold tabular-nums', c.filsEnAttente > 0 && 'text-(--warning)')}>{c.filsEnAttente}</td>
                <td className="px-3 py-3 text-xs font-semibold text-muted-foreground">
                  {c.derniereConnexion ? new Date(c.derniereConnexion).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }) : 'jamais'}
                </td>
                <td className="px-5 py-3 text-right">
                  {!c.admin && c.id !== moi ? (
                    confirmer === c.id ? (
                      <span className="inline-flex items-center gap-2">
                        <button type="button" onClick={() => setConfirmer(null)} className="text-xs font-bold">
                          Annuler
                        </button>
                        <button
                          type="button"
                          onClick={() => demarrer(async () => void (await retirerCoachAction(c.id), setConfirmer(null)))}
                          className="h-8 rounded-full bg-(--destructive) px-3 text-xs font-bold text-white"
                        >
                          Confirmer
                        </button>
                      </span>
                    ) : (
                      <button type="button" onClick={() => setConfirmer(c.id)} className="inline-flex h-8 items-center gap-1 rounded-full px-3 text-xs font-bold text-muted-foreground hover:bg-secondary" title="Le compte redevient élève, ses groupes sont archivés">
                        <UserMinus className="size-3.5" aria-hidden="true" /> Retirer
                      </button>
                    )
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <p className="text-xs font-semibold text-muted-foreground">
        « Fils en attente » : conversations dont le dernier message vient de l’élève ou du parent et a plus de 24 h. Retirer un coach archive ses groupes (leurs codes cessent de marcher) ; ses fils restent lisibles dans Supervision.
      </p>
    </div>
  )
}
