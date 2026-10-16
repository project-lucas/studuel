'use client'

import { useMemo, useState, useTransition } from 'react'
import { ArrowLeft, Check, Loader2, Search } from 'lucide-react'
import { LIBELLE_TYPE, sansAccent, type TypeFil } from '@/lib/messagerie/fil'
import { cn } from '@/lib/utils'
import { Avatar } from './FilConversation'

export type EleveChoix = { id: string; prenom: string; classe: string | null; groupe: string; parentLie: boolean }

/**
 * OUVRIR UN FIL (coach) : l'élève, puis la sorte de fil — élève, parent, ou les
 * deux. Sans parent lié dans l'app, un fil élève exige que le coach coche le
 * consentement (écrit recueilli, ou élève majeur) : c'est tracé dans le fil.
 */
export default function NouvelleConversation({
  eleves,
  ouvrirFil,
  onAnnuler,
  onOuvert,
}: {
  eleves: EleveChoix[]
  ouvrirFil: (eleveId: string, type: TypeFil, consentement: 'papier' | 'majeur' | null) => Promise<{ ok: true; id: string } | { ok: false; erreur: string }>
  onAnnuler: () => void
  onOuvert: (id: string) => void
}) {
  const [recherche, setRecherche] = useState('')
  const [choisi, setChoisi] = useState<EleveChoix | null>(null)
  const [type, setType] = useState<TypeFil>('eleve')
  const [consentement, setConsentement] = useState<'papier' | 'majeur' | null>(null)
  const [erreur, setErreur] = useState<string | null>(null)
  const [enCours, demarrer] = useTransition()

  const visibles = useMemo(() => {
    const q = sansAccent(recherche.trim())
    return eleves.filter((e) => !q || sansAccent(`${e.prenom} ${e.classe ?? ''} ${e.groupe}`).includes(q)).slice(0, 200)
  }, [eleves, recherche])

  const besoinConsentement = choisi !== null && !choisi.parentLie && type === 'eleve'

  const valider = () => {
    if (!choisi) return
    setErreur(null)
    demarrer(async () => {
      const r = await ouvrirFil(choisi.id, type, besoinConsentement ? consentement : null)
      if (r.ok) onOuvert(r.id)
      else setErreur(r.erreur)
    })
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-center gap-3 border-b border-primary/10 px-4 py-3">
        <button type="button" onClick={onAnnuler} className="grid size-10 place-items-center rounded-full hover:bg-secondary" aria-label="Annuler">
          <ArrowLeft className="size-5" aria-hidden="true" />
        </button>
        <h2 className="font-heading text-base font-extrabold">Nouvelle conversation</h2>
      </header>

      <div className="grid min-h-0 flex-1 gap-0 md:grid-cols-2">
        {/* 1. L'élève. */}
        <div className="flex min-h-0 flex-col border-primary/10 md:border-r">
          <p className="surtitre px-4 pt-4">1 · L’élève</p>
          <label className="relative mx-4 mt-2">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Prénom, classe, groupe…"
              aria-label="Chercher un élève"
              className="h-10 w-full rounded-full border bg-background pr-3 pl-9 text-sm font-semibold outline-none focus:border-primary"
            />
          </label>
          <ul className="mt-2 min-h-0 flex-1 overflow-y-auto pb-2">
            {visibles.length === 0 ? (
              <li className="px-4 py-6 text-sm font-semibold text-muted-foreground">
                {eleves.length === 0 ? 'Aucun élève dans tes groupes pour l’instant.' : 'Personne ne correspond.'}
              </li>
            ) : (
              visibles.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setChoisi(e)
                      setConsentement(null)
                      if (!e.parentLie) setType('eleve')
                    }}
                    aria-pressed={choisi?.id === e.id}
                    className={cn('flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-secondary/60', choisi?.id === e.id && 'bg-secondary')}
                  >
                    <Avatar nom={e.prenom} petit />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-extrabold">{e.prenom}</span>
                      <span className="block truncate text-xs font-semibold text-muted-foreground">
                        {[e.classe, e.groupe].filter(Boolean).join(' · ')}
                        {e.parentLie ? ' · parent lié' : ''}
                      </span>
                    </span>
                    {choisi?.id === e.id ? <Check className="size-4 text-primary" aria-hidden="true" /> : null}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* 2. La sorte de fil. */}
        <div className="flex flex-col gap-4 overflow-y-auto p-4">
          <p className="surtitre">2 · Avec qui</p>
          {(['eleve', 'parent', 'trio'] as const).map((t) => {
            const impossible = t !== 'eleve' && choisi !== null && !choisi.parentLie
            return (
              <button
                key={t}
                type="button"
                disabled={!choisi || impossible}
                onClick={() => setType(t)}
                aria-pressed={type === t}
                className={cn(
                  'rounded-2xl p-3 text-left ring-1 transition-colors disabled:opacity-40',
                  type === t ? 'bg-secondary ring-primary' : 'ring-primary/15 hover:bg-secondary/50',
                )}
              >
                <span className="block text-sm font-extrabold">{LIBELLE_TYPE[t]}</span>
                <span className="block text-xs font-semibold text-muted-foreground">
                  {t === 'eleve'
                    ? 'Toi et l’élève.'
                    : t === 'parent'
                      ? impossible
                        ? 'Aucun parent lié dans l’app.'
                        : 'Toi et son parent.'
                      : impossible
                        ? 'Aucun parent lié dans l’app.'
                        : 'Toi, l’élève et son parent, dans le même fil.'}
                </span>
              </button>
            )
          })}

          {besoinConsentement ? (
            <fieldset className="rounded-2xl bg-(--warning)/10 p-3">
              <legend className="sr-only">Consentement</legend>
              <p className="text-sm font-extrabold">Aucun parent n’est lié à {choisi?.prenom} dans l’app</p>
              <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
                Pour écrire à un mineur, il faut l’accord de ses parents. Ce choix est enregistré dans le fil.
              </p>
              {(['papier', 'majeur'] as const).map((c) => (
                <label key={c} className="mt-2 flex cursor-pointer items-center gap-2 text-sm font-bold">
                  <input type="radio" name="consentement" checked={consentement === c} onChange={() => setConsentement(c)} className="accent-primary" />
                  {c === 'papier' ? 'J’ai le consentement écrit des parents' : 'L’élève est majeur'}
                </label>
              ))}
            </fieldset>
          ) : null}

          {erreur ? <p className="text-sm font-bold text-(--destructive)" role="alert">{erreur}</p> : null}

          <button
            type="button"
            onClick={valider}
            disabled={!choisi || enCours || (besoinConsentement && !consentement)}
            className="font-heading mt-auto inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-extrabold text-primary-foreground disabled:opacity-40"
          >
            {enCours ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
            Ouvrir la conversation
          </button>
        </div>
      </div>
    </div>
  )
}
