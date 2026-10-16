'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MessageSquarePlus, MessagesSquare, Search, ShieldAlert } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { filDepuis, filtrerFils, horodatageListe, LIBELLE_TYPE, titreFil, type Fil, type TypeFil } from '@/lib/messagerie/fil'
import { cn } from '@/lib/utils'
import FilConversation, { Avatar, type ModeMessagerie } from './FilConversation'
import NouvelleConversation, { type EleveChoix } from './NouvelleConversation'

/**
 * LA MESSAGERIE (16/10/2026, migration 587) — façon WhatsApp :
 *   ordinateur : la liste des fils à gauche, le fil ouvert à droite ;
 *   téléphone  : la liste, puis le fil en plein écran (retour = la liste).
 * Le fil ouvert vit dans l'adresse (`?fil=`), la liste se relit à chaque
 * message (direct Supabase) et toutes les 30 s par sécurité.
 */
export default function Messagerie({
  filsInitiaux,
  moi,
  mode,
  eleves = [],
  hauteur = 'calc(100dvh - 4rem)',
  resumer,
  ouvrirFil,
}: {
  filsInitiaux: Fil[]
  moi: string
  mode: ModeMessagerie
  /** Coach : les élèves avec qui ouvrir un fil. */
  eleves?: EleveChoix[]
  hauteur?: string
  resumer?: (conversationId: string) => Promise<{ ok: true; texte: string } | { ok: false; erreur: string }>
  ouvrirFil?: (eleveId: string, type: TypeFil, consentement: 'papier' | 'majeur' | null) => Promise<{ ok: true; id: string } | { ok: false; erreur: string }>
}) {
  const supabase = useMemo(() => createClient(), [])
  const router = useRouter()
  const params = useSearchParams()
  const [fils, setFils] = useState<Fil[]>(filsInitiaux)
  const [recherche, setRecherche] = useState('')
  const [type, setType] = useState<TypeFil | null>(null)
  const [nouveau, setNouveau] = useState(params.get('nouveau') === '1')
  const actifId = params.get('fil')
  const actif = fils.find((f) => f.id === actifId) ?? null
  const minuterie = useRef<ReturnType<typeof setTimeout> | null>(null)

  const relire = useCallback(() => {
    if (minuterie.current) clearTimeout(minuterie.current)
    minuterie.current = setTimeout(() => {
      supabase.rpc('messagerie_fils', { p_tous: mode === 'supervision' }).then(({ data, error }) => {
        if (!error && Array.isArray(data)) setFils(data.map((r) => filDepuis(r as Record<string, unknown>)))
      })
    }, 400)
  }, [supabase, mode])

  useEffect(() => {
    // Tout nouveau message lisible (la RLS filtre) relit la liste.
    const canal = supabase
      .channel('fils-liste')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages_fil' }, () => relire())
      .subscribe()
    const id = setInterval(relire, 30_000)
    return () => {
      clearInterval(id)
      void supabase.removeChannel(canal)
    }
  }, [supabase, relire])

  const choisir = (id: string | null) => {
    const q = new URLSearchParams(params.toString())
    q.delete('nouveau')
    if (id) q.set('fil', id)
    else q.delete('fil')
    router.replace(`?${q.toString()}`, { scroll: false })
    if (id) setFils((a) => a.map((f) => (f.id === id ? { ...f, nonLus: 0 } : f)))
  }

  const visibles = filtrerFils(fils, recherche, type)
  const maintenant = new Date()
  const filtresTypes: (TypeFil | null)[] = [null, 'eleve', 'parent', 'trio']

  return (
    <div className="grid overflow-hidden rounded-carte bg-card shadow-carte ring-1 ring-black/5 md:grid-cols-[22rem_1fr]" style={{ height: hauteur }}>
      {/* La liste des fils. */}
      <aside className={cn('flex min-h-0 flex-col border-r border-primary/10', actif || nouveau ? 'hidden md:flex' : 'flex')}>
        <div className="flex flex-col gap-2 border-b border-primary/10 p-3">
          <div className="flex items-center gap-2">
            <h1 className="font-heading flex-1 text-lg font-extrabold">{mode === 'supervision' ? 'Tous les fils' : 'Conversations'}</h1>
            {mode === 'coach' && ouvrirFil ? (
              <button
                type="button"
                onClick={() => {
                  setNouveau(true)
                  choisir(null)
                }}
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-3 text-sm font-bold text-primary-foreground"
              >
                <MessageSquarePlus className="size-4" aria-hidden="true" />
                Nouveau
              </button>
            ) : null}
          </div>
          <label className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Chercher un prénom…"
              aria-label="Chercher une conversation"
              className="h-10 w-full rounded-full border bg-background pr-3 pl-9 text-sm font-semibold outline-none focus:border-primary"
            />
          </label>
          {mode !== 'utilisateur' ? (
            <div className="flex flex-wrap gap-1" role="group" aria-label="Sorte de fil">
              {filtresTypes.map((t) => (
                <button
                  key={t ?? 'tous'}
                  type="button"
                  aria-pressed={type === t}
                  onClick={() => setType(t)}
                  className={cn('h-8 rounded-full px-3 text-xs font-bold', type === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground/80')}
                >
                  {t ? LIBELLE_TYPE[t] : 'Tous'}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <ul className="min-h-0 flex-1 overflow-y-auto">
          {visibles.length === 0 ? (
            <li className="px-4 py-10 text-center text-sm font-semibold text-muted-foreground">
              {fils.length === 0
                ? mode === 'coach'
                  ? 'Aucune conversation. Ouvre la première avec « Nouveau ».'
                  : 'Aucune conversation pour l’instant.'
                : 'Personne ne correspond.'}
            </li>
          ) : (
            visibles.map((f) => (
              <li key={f.id}>
                <button
                  type="button"
                  onClick={() => {
                    setNouveau(false)
                    choisir(f.id)
                  }}
                  aria-current={f.id === actifId ? 'true' : undefined}
                  className={cn(
                    'flex w-full items-center gap-3 border-b border-primary/5 px-3 py-3 text-left transition-colors',
                    f.id === actifId ? 'bg-secondary' : 'hover:bg-secondary/50',
                  )}
                >
                  <Avatar nom={titreFil(f)} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="font-heading flex-1 truncate text-[15px] font-extrabold">{titreFil(f)}</span>
                      <span className={cn('shrink-0 text-xs font-bold', f.nonLus > 0 ? 'text-primary' : 'text-muted-foreground')}>
                        {horodatageListe(f.dernierMessageLe ?? f.creeLe, maintenant)}
                      </span>
                    </span>
                    <span className="mt-0.5 flex items-center gap-2">
                      <span className="flex-1 truncate text-sm text-muted-foreground">
                        {f.dernierExtrait ? `${f.dernierAuteurMoi ? 'Toi : ' : ''}${f.dernierExtrait}` : LIBELLE_TYPE[f.type]}
                      </span>
                      {f.signalements > 0 ? <ShieldAlert className="size-4 text-(--destructive)" aria-label="Signalement à traiter" /> : null}
                      {f.nonLus > 0 && f.monRole ? (
                        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-extrabold text-primary-foreground tabular-nums">
                          {f.nonLus}
                        </span>
                      ) : null}
                    </span>
                    {mode === 'supervision' ? (
                      <span className="mt-0.5 block truncate text-xs font-semibold text-muted-foreground">Coach : {f.coachPrenom}</span>
                    ) : null}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </aside>

      {/* Le fil ouvert. */}
      <div className={cn('min-h-0', actif || nouveau ? 'flex flex-col' : 'hidden md:flex md:flex-col')}>
        {nouveau && ouvrirFil ? (
          <NouvelleConversation
            eleves={eleves}
            ouvrirFil={ouvrirFil}
            onAnnuler={() => setNouveau(false)}
            onOuvert={(id) => {
              setNouveau(false)
              relire()
              choisir(id)
              router.refresh()
            }}
          />
        ) : actif ? (
          <FilConversation key={actif.id} fil={actif} moi={moi} mode={mode} onRetour={() => choisir(null)} onActivite={relire} resumer={resumer} />
        ) : (
          <div className="grid h-full place-items-center p-8 text-center">
            <div>
              <MessagesSquare className="mx-auto size-12 text-primary/40" aria-hidden="true" />
              <p className="font-heading mt-3 text-lg font-extrabold">Choisis une conversation</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {mode === 'coach' ? 'Ou ouvre-en une avec un élève, un parent, ou les deux.' : 'Elle s’affichera ici.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
