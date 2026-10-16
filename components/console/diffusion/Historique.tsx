'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Archive, BarChart3, ClipboardList, Megaphone } from 'lucide-react'
import { etatAnnonce, libelleSegment, tauxReponse, type AnnonceAuteur } from '@/lib/annonces/annonces'
import { archiverAnnonceAction } from '@/app/coach/diffusion/actions'
import { cn } from '@/lib/utils'

const ETAT: Record<string, { libelle: string; classe: string }> = {
  active: { libelle: 'En cours', classe: 'bg-(--success)/15 text-(--success)' },
  expiree: { libelle: 'Terminée', classe: 'bg-secondary text-muted-foreground' },
  archivee: { libelle: 'Retirée', classe: 'bg-secondary text-muted-foreground' },
}

function date(iso: string): string {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '' : new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' }).format(d)
}

/** L'historique des envois : la portée de chacun (vus, fermés, clics, réponses). */
export default function Historique({ annonces, admin }: { annonces: AnnonceAuteur[]; admin: boolean }) {
  const router = useRouter()
  const [enCours, demarrer] = useTransition()
  const maintenant = new Date()

  if (annonces.length === 0) {
    return <p className="carte p-6 text-sm font-semibold text-muted-foreground">Aucun envoi pour l’instant.</p>
  }

  return (
    <div className="carte overflow-x-auto p-0">
      <table className="w-full min-w-[760px] text-sm">
        <thead>
          <tr className="border-b text-left text-xs font-extrabold tracking-wide text-muted-foreground uppercase">
            <th className="px-4 py-3">Envoi</th>
            <th className="px-3 py-3">Public</th>
            <th className="px-3 py-3 text-right">Vus</th>
            <th className="px-3 py-3 text-right">Clics / réponses</th>
            <th className="px-3 py-3">État</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {annonces.map((a) => {
            const etat = etatAnnonce(a, maintenant)
            return (
              <tr key={a.id} className="border-b border-primary/5 align-middle last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                      {a.type === 'sondage' ? <ClipboardList className="size-4" aria-hidden="true" /> : <Megaphone className="size-4" aria-hidden="true" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-extrabold">{a.titre}</span>
                      <span className="block text-xs font-semibold text-muted-foreground">
                        {date(a.creeLe)}
                        {admin && !a.moi && a.auteur ? ` · par ${a.auteur}` : ''}
                        {a.push ? (a.pushEnvoyeLe ? ' · notifié' : ' · notification en attente') : ''}
                      </span>
                    </span>
                  </div>
                </td>
                <td className="px-3 py-3 font-semibold">
                  {a.segment === 'groupe' && a.groupe ? `Groupe ${a.groupe}` : libelleSegment(a.segment)}
                  {a.classes.length ? <span className="block text-xs text-muted-foreground">{a.classes.join(', ')}</span> : null}
                </td>
                <td className="px-3 py-3 text-right font-heading font-extrabold tabular-nums">{a.vues}</td>
                <td className="px-3 py-3 text-right tabular-nums">
                  {a.type === 'sondage' ? (
                    <span className="font-heading font-extrabold">
                      {a.reponses} <span className="text-xs font-bold text-muted-foreground">({tauxReponse(a)} %)</span>
                    </span>
                  ) : (
                    <span className="font-heading font-extrabold">{a.clics}</span>
                  )}
                </td>
                <td className="px-3 py-3">
                  <span className={cn('rounded-full px-2.5 py-1 text-xs font-bold', ETAT[etat].classe)}>{ETAT[etat].libelle}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    {a.type === 'sondage' ? (
                      <Link href={`/coach/diffusion?annonce=${a.id}`} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-secondary px-3 text-xs font-bold text-primary">
                        <BarChart3 className="size-4" aria-hidden="true" /> Résultats
                      </Link>
                    ) : null}
                    {etat === 'active' && (a.moi || admin) ? (
                      <button
                        type="button"
                        disabled={enCours}
                        onClick={() => demarrer(async () => {
                          await archiverAnnonceAction(a.id)
                          router.refresh()
                        })}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-bold text-muted-foreground hover:bg-secondary"
                        title="Retirer : il ne s’affichera plus"
                      >
                        <Archive className="size-4" aria-hidden="true" /> Retirer
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
