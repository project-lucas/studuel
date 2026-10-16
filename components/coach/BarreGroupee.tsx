'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, MessageSquare, Target, X } from 'lucide-react'
import { envoyerGroupeAction, fixerObjectifAction } from '@/app/coach/actions'
import { OBJECTIFS_TYPES } from '@/lib/coach/suivi'
import { cn } from '@/lib/utils'

/**
 * LES ACTIONS GROUPÉES (16/10/2026) : dès qu'un élève est coché, une barre
 * apparaît en bas — « Écrire » (le même message dans le fil de chacun) et
 * « Objectif » (l'objectif de la semaine pour tous). Pensé pour l'ordinateur :
 * cocher vingt élèves, écrire, envoyer.
 */
export default function BarreGroupee({
  selection,
  prenoms,
  sansParent,
  onVider,
}: {
  selection: string[]
  prenoms: Record<string, string>
  /** Combien, dans la sélection, n'ont pas de parent lié (consentement à cocher). */
  sansParent: number
  onVider: () => void
}) {
  const router = useRouter()
  const [panneau, setPanneau] = useState<'message' | 'objectif' | null>(null)
  const [texte, setTexte] = useState('')
  const [consentement, setConsentement] = useState<'papier' | 'majeur' | null>(null)
  const [obj, setObj] = useState({ minutes: 120, jours: 4, quiz: 6, message: '' })
  const [retour, setRetour] = useState<{ ok: boolean; texte: string } | null>(null)
  const [enCours, demarrer] = useTransition()

  if (selection.length === 0) return null
  const noms = selection.map((id) => prenoms[id]).filter(Boolean)

  const envoyer = () =>
    demarrer(async () => {
      const r = await envoyerGroupeAction(selection, texte, consentement)
      if (!r.ok) return setRetour({ ok: false, texte: r.erreur })
      setRetour({
        ok: true,
        texte: `Envoyé à ${r.envoyes} élève${r.envoyes > 1 ? 's' : ''}${r.sansConsentement ? ` · ${r.sansConsentement} sans consentement, non envoyé${r.sansConsentement > 1 ? 's' : ''}` : ''}.`,
      })
      setTexte('')
      setPanneau(null)
      router.refresh()
    })

  const fixer = () =>
    demarrer(async () => {
      const r = await fixerObjectifAction(selection, { ...obj, message: obj.message.trim() || null })
      if (!r.ok) return setRetour({ ok: false, texte: r.erreur })
      setRetour({ ok: true, texte: `Objectif fixé pour ${r.fixes} élève${r.fixes > 1 ? 's' : ''}.` })
      setPanneau(null)
      router.refresh()
    })

  return (
    <div className="fixed right-0 bottom-4 left-0 z-30 px-4 lg:left-64">
      <div className="mx-auto max-w-4xl rounded-2xl bg-foreground p-3 text-background shadow-2xl">
        {panneau === 'message' ? (
          <div className="mb-3 flex flex-col gap-2">
            <textarea
              value={texte}
              onChange={(e) => setTexte(e.target.value)}
              rows={3}
              maxLength={4000}
              autoFocus
              placeholder="Le message, envoyé dans le fil de chaque élève…"
              className="w-full rounded-xl bg-background px-3 py-2 text-sm text-foreground"
            />
            {sansParent > 0 ? (
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
                <span>{sansParent} sans parent lié dans l’app :</span>
                {(['papier', 'majeur'] as const).map((c) => (
                  <label key={c} className="flex items-center gap-1.5">
                    <input type="radio" name="consentement-groupe" checked={consentement === c} onChange={() => setConsentement(c)} className="accent-primary" />
                    {c === 'papier' ? 'consentement écrit recueilli' : 'majeurs'}
                  </label>
                ))}
                <label className="flex items-center gap-1.5">
                  <input type="radio" name="consentement-groupe" checked={consentement === null} onChange={() => setConsentement(null)} className="accent-primary" />
                  ne pas leur écrire
                </label>
              </div>
            ) : null}
          </div>
        ) : null}
        {panneau === 'objectif' ? (
          <div className="mb-3 flex flex-col gap-2 text-sm">
            <div className="flex flex-wrap gap-1.5">
              {OBJECTIFS_TYPES.map((o) => (
                <button
                  key={o.libelle}
                  type="button"
                  onClick={() => setObj((x) => ({ ...x, minutes: o.minutes, jours: o.jours, quiz: o.quiz }))}
                  className={cn('h-8 rounded-full px-3 text-xs font-bold', obj.minutes === o.minutes && obj.jours === o.jours ? 'bg-primary text-primary-foreground' : 'bg-background/15')}
                >
                  {o.libelle}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {([['minutes', 'min', 3000], ['jours', 'jours', 7], ['quiz', 'quiz', 200]] as const).map(([cle, lib, max]) => (
                <label key={cle} className="flex items-center gap-1.5 font-bold">
                  <input
                    type="number"
                    min={0}
                    max={max}
                    value={obj[cle]}
                    onChange={(e) => setObj((x) => ({ ...x, [cle]: Number(e.target.value) }))}
                    className="h-9 w-20 rounded-lg bg-background px-2 text-foreground"
                  />
                  {lib}
                </label>
              ))}
              <input
                value={obj.message}
                onChange={(e) => setObj((x) => ({ ...x, message: e.target.value }))}
                maxLength={280}
                placeholder="Un mot d’encouragement (facultatif)"
                className="h-9 min-w-48 flex-1 rounded-lg bg-background px-3 text-foreground"
              />
            </div>
          </div>
        ) : null}
        <div className="flex flex-wrap items-center gap-2">
          <p className="min-w-0 flex-1 truncate text-sm font-bold">
            {selection.length} sélectionné{selection.length > 1 ? 's' : ''} : {noms.slice(0, 4).join(', ')}
            {noms.length > 4 ? '…' : ''}
          </p>
          {panneau === null ? (
            <>
              <button type="button" onClick={() => setPanneau('message')} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground">
                <MessageSquare className="size-4" aria-hidden="true" /> Écrire
              </button>
              <button type="button" onClick={() => setPanneau('objectif')} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-background/15 px-4 text-sm font-bold">
                <Target className="size-4" aria-hidden="true" /> Objectif
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => setPanneau(null)} className="h-10 rounded-full px-4 text-sm font-bold">
                Annuler
              </button>
              <button
                type="button"
                disabled={enCours || (panneau === 'message' && !texte.trim())}
                onClick={panneau === 'message' ? envoyer : fixer}
                className="inline-flex h-10 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground disabled:opacity-50"
              >
                {enCours ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
                {panneau === 'message' ? 'Envoyer' : 'Fixer l’objectif'}
              </button>
            </>
          )}
          <button type="button" onClick={onVider} className="grid size-10 place-items-center rounded-full hover:bg-background/15" aria-label="Vider la sélection">
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        {retour ? (
          <p className={cn('mt-2 text-xs font-bold', retour.ok ? 'text-(--success)' : 'text-(--destructive)')} role="status">
            {retour.texte}
          </p>
        ) : null}
      </div>
    </div>
  )
}
