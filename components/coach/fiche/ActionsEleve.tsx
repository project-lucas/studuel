'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, MessageCircle, Users } from 'lucide-react'
import { ouvrirFilAction } from '@/app/coach/messages/actions'
import type { TypeFil } from '@/lib/messagerie/fil'

/** Les trois portes de conversation d'une fiche : l'élève, le parent, les deux. */
export default function ActionsEleve({ eleveId, prenom, parentLie }: { eleveId: string; prenom: string; parentLie: boolean }) {
  const router = useRouter()
  const [consentement, setConsentement] = useState<'papier' | 'majeur' | null>(null)
  const [demande, setDemande] = useState(false)
  const [erreur, setErreur] = useState<string | null>(null)
  const [enCours, demarrer] = useTransition()

  const ouvrir = (type: TypeFil) => {
    setErreur(null)
    if (type === 'eleve' && !parentLie && !consentement) return setDemande(true)
    demarrer(async () => {
      const r = await ouvrirFilAction(eleveId, type, type === 'eleve' && !parentLie ? consentement : null)
      if (!r.ok) return setErreur(r.erreur)
      router.push(`/coach/messages?fil=${r.id}`)
    })
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex flex-wrap justify-end gap-2">
        <button type="button" onClick={() => ouvrir('eleve')} disabled={enCours} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground disabled:opacity-50">
          {enCours ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <MessageCircle className="size-4" aria-hidden="true" />}
          Écrire à {prenom}
        </button>
        <button type="button" onClick={() => ouvrir('parent')} disabled={enCours || !parentLie} title={parentLie ? undefined : 'Aucun parent lié dans l’app'} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-secondary px-4 text-sm font-bold text-primary disabled:opacity-40">
          Au parent
        </button>
        <button type="button" onClick={() => ouvrir('trio')} disabled={enCours || !parentLie} title={parentLie ? undefined : 'Aucun parent lié dans l’app'} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-secondary px-4 text-sm font-bold text-primary disabled:opacity-40">
          <Users className="size-4" aria-hidden="true" /> Élève + parent
        </button>
      </div>
      {demande ? (
        <div className="flex flex-wrap items-center justify-end gap-3 rounded-2xl bg-(--warning)/10 px-3 py-2 text-xs font-bold">
          <span>Aucun parent lié dans l’app :</span>
          {(['papier', 'majeur'] as const).map((c) => (
            <label key={c} className="flex items-center gap-1.5">
              <input type="radio" name="consentement-fiche" checked={consentement === c} onChange={() => setConsentement(c)} className="accent-primary" />
              {c === 'papier' ? 'consentement écrit recueilli' : 'élève majeur'}
            </label>
          ))}
          <button type="button" disabled={!consentement} onClick={() => ouvrir('eleve')} className="h-8 rounded-full bg-primary px-3 text-primary-foreground disabled:opacity-40">
            Ouvrir
          </button>
        </div>
      ) : null}
      {erreur ? <p className="text-xs font-bold text-(--destructive)">{erreur}</p> : null}
    </div>
  )
}
