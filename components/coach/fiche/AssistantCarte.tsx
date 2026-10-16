'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, RefreshCw, Send, Sparkles } from 'lucide-react'
import { bilanAction, brouillonAction, envoyerDansFilAction } from '@/app/coach/eleves/actions'
import { INTENTIONS, type DestinataireBilan, type IntentionBrouillon } from '@/lib/coach/assistant'
import { cn } from '@/lib/utils'

/**
 * L'ASSISTANT (Claude) SUR LA FICHE D'UN ÉLÈVE : le bilan de la semaine pour
 * l'élève ou ses parents, ou un brouillon de message selon une intention. Le
 * texte est MODIFIABLE et ne part que si le coach l'envoie (dans le bon fil,
 * ouvert au besoin). Claude ne reçoit ni le nom, ni l'identifiant de l'élève.
 */
export default function AssistantCarte({ eleveId, prenom, parentLie }: { eleveId: string; prenom: string; parentLie: boolean }) {
  const router = useRouter()
  const [travail, setTravail] = useState<'bilan' | 'brouillon'>('bilan')
  const [dest, setDest] = useState<DestinataireBilan>('eleve')
  const [intention, setIntention] = useState<IntentionBrouillon>('relance')
  const [consigne, setConsigne] = useState('')
  const [texte, setTexte] = useState('')
  const [erreur, setErreur] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [enCours, demarrer] = useTransition()

  const generer = (regenerer = false) => {
    setErreur(null)
    setInfo(null)
    demarrer(async () => {
      const r = travail === 'bilan' ? await bilanAction(eleveId, dest, regenerer) : await brouillonAction(eleveId, intention, consigne, dest)
      if (!r.ok) return setErreur(r.erreur)
      setTexte(r.texte)
    })
  }

  const envoyer = () => {
    setErreur(null)
    demarrer(async () => {
      const r = await envoyerDansFilAction(eleveId, dest === 'parent' ? 'parent' : 'eleve', texte)
      if (!r.ok) return setErreur(r.erreur)
      setInfo('Envoyé dans le fil.')
      setTexte('')
      router.push(`/coach/messages?fil=${r.filId}`)
    })
  }

  return (
    <section className="carte p-5" aria-labelledby="assistant">
      <div className="flex items-center gap-2">
        <Sparkles className="size-5 text-primary" aria-hidden="true" />
        <h2 id="assistant" className="titre-section flex-1">Assistant</h2>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-bold text-muted-foreground">Claude</span>
      </div>

      <div className="mt-3 flex gap-1.5" role="group" aria-label="Travail">
        {(['bilan', 'brouillon'] as const).map((t) => (
          <button key={t} type="button" aria-pressed={travail === t} onClick={() => setTravail(t)} className={cn('h-8 rounded-full px-3 text-xs font-bold', travail === t ? 'bg-primary text-primary-foreground' : 'bg-secondary')}>
            {t === 'bilan' ? 'Bilan de la semaine' : 'Brouillon de message'}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs font-bold" role="group" aria-label="Destinataire">
        Pour :
        {(['eleve', 'parent'] as const).map((d) => (
          <button
            key={d}
            type="button"
            disabled={d === 'parent' && !parentLie}
            aria-pressed={dest === d}
            onClick={() => setDest(d)}
            className={cn('h-8 rounded-full px-3 disabled:opacity-40', dest === d ? 'bg-foreground text-background' : 'bg-secondary')}
            title={d === 'parent' && !parentLie ? 'Aucun parent lié dans l’app' : undefined}
          >
            {d === 'eleve' ? prenom : 'ses parents'}
          </button>
        ))}
      </div>

      {travail === 'brouillon' ? (
        <div className="mt-3 flex flex-col gap-2">
          <div className="flex flex-wrap gap-1.5">
            {INTENTIONS.map((i) => (
              <button key={i.id} type="button" aria-pressed={intention === i.id} onClick={() => setIntention(i.id)} className={cn('h-8 rounded-full px-3 text-xs font-bold', intention === i.id ? 'bg-secondary ring-2 ring-primary' : 'bg-secondary')}>
                {i.libelle}
              </button>
            ))}
          </div>
          <input value={consigne} onChange={(e) => setConsigne(e.target.value)} maxLength={600} placeholder="Précision (facultatif) : il a raté l’entraînement mardi…" className="h-9 rounded-lg border bg-background px-3 text-sm" />
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => generer(false)}
        disabled={enCours}
        className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground disabled:opacity-50"
      >
        {enCours ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Sparkles className="size-4" aria-hidden="true" />}
        {travail === 'bilan' ? 'Rédiger le bilan' : 'Rédiger le brouillon'}
      </button>

      {texte ? (
        <div className="mt-3 flex flex-col gap-2">
          <textarea value={texte} onChange={(e) => setTexte(e.target.value)} rows={8} className="rounded-xl border bg-background px-3 py-2 text-sm leading-relaxed outline-none focus:border-primary" aria-label="Texte proposé" />
          <div className="flex gap-2">
            {travail === 'bilan' ? (
              <button type="button" onClick={() => generer(true)} disabled={enCours} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-secondary px-3 text-xs font-bold text-primary">
                <RefreshCw className="size-3.5" aria-hidden="true" /> Autre version
              </button>
            ) : null}
            <button type="button" onClick={envoyer} disabled={enCours || !texte.trim()} className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground disabled:opacity-50">
              <Send className="size-4" aria-hidden="true" /> Envoyer {dest === 'parent' ? 'aux parents' : `à ${prenom}`}
            </button>
          </div>
        </div>
      ) : null}
      {erreur ? <p className="mt-2 text-xs font-bold text-(--destructive)" role="alert">{erreur}</p> : null}
      {info ? <p className="mt-2 text-xs font-bold text-(--success)" role="status">{info}</p> : null}
      <p className="mt-3 text-[11px] font-semibold text-muted-foreground">Claude reçoit les chiffres de l’élève, jamais son nom. Relis toujours avant d’envoyer.</p>
    </section>
  )
}
