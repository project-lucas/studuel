'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Check, Loader2, RefreshCw, Send, Sparkles } from 'lucide-react'
import { trierAction, type TriPret } from '@/app/coach/assistant/actions'
import { envoyerDansFilAction } from '@/app/coach/eleves/actions'
import { cn } from '@/lib/utils'

const URGENCE = {
  haute: { libelle: 'Urgent', classe: 'bg-(--destructive)/10 text-(--destructive)' },
  moyenne: { libelle: 'À voir', classe: 'bg-(--warning)/15 text-(--warning)' },
  basse: { libelle: 'Bonne nouvelle', classe: 'bg-(--success)/15 text-(--success)' },
} as const

/**
 * LE TRI DU MATIN : la liste des élèves à contacter aujourd'hui, chacun avec sa
 * raison, l'action conseillée et un message prêt (modifiable) qui part dans
 * son fil en un clic.
 */
export default function TriDuMatin({ initial, cleConfiguree }: { initial: TriPret | null; cleConfiguree: boolean }) {
  const [tri, setTri] = useState<TriPret | null>(initial)
  const [erreur, setErreur] = useState<string | null>(null)
  const [enCours, demarrer] = useTransition()

  const lancer = (relancer: boolean) => {
    setErreur(null)
    demarrer(async () => {
      const r = await trierAction(relancer)
      if (!r.ok) return setErreur(r.erreur)
      setTri(r.tri)
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <section className="carte flex flex-wrap items-center gap-4 p-5">
        <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary">
          <Sparkles className="size-6" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="font-heading text-2xl font-extrabold">Le tri du matin</h1>
          <p className="text-sm text-muted-foreground">
            Claude lit les chiffres de tous tes élèves (sans leurs noms) et te dit qui contacter aujourd’hui, pourquoi, et quoi leur écrire.
          </p>
        </div>
        <button
          type="button"
          onClick={() => lancer(tri !== null)}
          disabled={enCours || !cleConfiguree}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 font-bold text-primary-foreground disabled:opacity-50"
        >
          {enCours ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : tri ? <RefreshCw className="size-4" aria-hidden="true" /> : <Sparkles className="size-4" aria-hidden="true" />}
          {tri ? 'Refaire le tri' : 'Faire le tri'}
        </button>
      </section>

      {!cleConfiguree ? (
        <p className="carte p-4 text-sm font-semibold text-(--warning)">
          L’assistant n’est pas branché : ajoute la variable <code>ANTHROPIC_API_KEY</code> sur Vercel (et dans <code>.env.local</code>).
        </p>
      ) : null}
      {erreur ? <p className="carte p-4 text-sm font-bold text-(--destructive)" role="alert">{erreur}</p> : null}
      {enCours && !tri ? <p className="carte p-6 text-center text-sm font-semibold text-muted-foreground">Claude lit les données… (une vingtaine de secondes)</p> : null}

      {tri ? (
        <>
          <section className="carte p-5">
            <p className="surtitre">Synthèse · {tri.total} élèves · {new Date(tri.creeLe).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Paris' })}</p>
            <p className="mt-1 text-[15px]">{tri.synthese}</p>
          </section>
          {tri.eleves.length === 0 ? (
            <p className="carte p-6 text-sm text-muted-foreground">Personne à contacter en priorité aujourd’hui.</p>
          ) : (
            <ol className="grid gap-3 lg:grid-cols-2">
              {tri.eleves.map((e, i) => (
                <CarteTri key={e.eleveId} rang={i + 1} e={e} />
              ))}
            </ol>
          )}
        </>
      ) : null}
    </div>
  )
}

function CarteTri({ rang, e }: { rang: number; e: TriPret['eleves'][number] }) {
  const [message, setMessage] = useState(e.message)
  const [etat, setEtat] = useState<'saisie' | 'envoye' | 'erreur'>('saisie')
  const [erreur, setErreur] = useState<string | null>(null)
  const [enCours, demarrer] = useTransition()
  const u = URGENCE[e.urgence]

  return (
    <li className="carte flex flex-col gap-3 p-5">
      <div className="flex items-start gap-3">
        <span className="font-heading grid size-9 shrink-0 place-items-center rounded-full bg-secondary font-extrabold text-primary">{rang}</span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/coach/eleves/${e.eleveId}`} className="font-heading text-lg font-extrabold hover:text-primary">
              {e.prenom}
            </Link>
            <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-bold', u.classe)}>{u.libelle}</span>
          </div>
          <p className="mt-1 text-sm">{e.raison}</p>
          <p className="mt-1 text-sm font-bold text-primary">→ {e.action}</p>
        </div>
      </div>
      <textarea value={message} onChange={(x) => setMessage(x.target.value)} rows={3} maxLength={4000} className="rounded-xl border bg-background px-3 py-2 text-sm" aria-label={`Message pour ${e.prenom}`} />
      <div className="flex items-center gap-2">
        {erreur ? <p className="flex-1 text-xs font-bold text-(--destructive)">{erreur}</p> : <span className="flex-1" />}
        {etat === 'envoye' ? (
          <span className="inline-flex items-center gap-1 text-sm font-bold text-(--success)">
            <Check className="size-4" aria-hidden="true" /> Envoyé
          </span>
        ) : (
          <button
            type="button"
            disabled={enCours || !message.trim()}
            onClick={() =>
              demarrer(async () => {
                const r = await envoyerDansFilAction(e.eleveId, 'eleve', message)
                if (r.ok) setEtat('envoye')
                else {
                  setEtat('erreur')
                  setErreur(r.erreur)
                }
              })
            }
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground disabled:opacity-50"
          >
            {enCours ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}
            Envoyer à {e.prenom}
          </button>
        )}
      </div>
    </li>
  )
}
