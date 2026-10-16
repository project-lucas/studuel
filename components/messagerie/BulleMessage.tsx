'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, FileText, Flag, Loader2, MoreHorizontal } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { heure, type Message } from '@/lib/messagerie/fil'
import { cn } from '@/lib/utils'

/** Une pièce jointe : l'URL signée (1 h) n'est demandée qu'à l'affichage. */
function Piece({ m, mien }: { m: Message; mien: boolean }) {
  const [url, setUrl] = useState<string | null>(null)
  const [erreur, setErreur] = useState(false)

  useEffect(() => {
    if (!m.pieceChemin || m.enEnvoi) return
    let vivant = true
    createClient()
      .storage.from('messagerie')
      .createSignedUrl(m.pieceChemin, 3600)
      .then(({ data, error }) => {
        if (!vivant) return
        if (error || !data) setErreur(true)
        else setUrl(data.signedUrl)
      })
    return () => {
      vivant = false
    }
  }, [m.pieceChemin, m.enEnvoi])

  if (erreur) return <p className="text-xs font-semibold opacity-70">Pièce jointe indisponible</p>
  if (m.pieceType === 'image') {
    return url ? (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
        {/* eslint-disable-next-line @next/next/no-img-element -- URL signée temporaire, hors de l'optimiseur */}
        <img src={url} alt={m.pieceNom ?? 'Photo'} className="max-h-72 w-full max-w-xs rounded-xl object-cover" />
      </a>
    ) : (
      <div className="grid h-40 w-56 place-items-center rounded-xl bg-black/5">
        <Loader2 className="size-5 animate-spin opacity-60" aria-hidden="true" />
      </div>
    )
  }
  return (
    <a
      href={url ?? undefined}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold', mien ? 'bg-white/15' : 'bg-secondary')}
    >
      <FileText className="size-5 shrink-0" aria-hidden="true" />
      <span className="truncate">{m.pieceNom ?? 'Document PDF'}</span>
    </a>
  )
}

/**
 * Une bulle : la mienne à droite en violet, celle des autres à gauche en blanc.
 * Les messages d'un même auteur à moins de 5 minutes se suivent sans répéter
 * son nom (lib/messagerie/fil : rangerMessages).
 */
export default function BulleMessage({
  m,
  mien,
  premier,
  peutSignaler,
  onSignaler,
}: {
  m: Message
  mien: boolean
  premier: boolean
  peutSignaler: boolean
  onSignaler: (m: Message) => void
}) {
  const [menu, setMenu] = useState(false)
  return (
    <div className={cn('group flex items-end gap-1', mien ? 'justify-end' : 'justify-start')}>
      {!mien && peutSignaler ? (
        <div className="order-2 self-center">
          <button
            type="button"
            onClick={() => setMenu((x) => !x)}
            aria-label="Options du message"
            className="grid size-7 place-items-center rounded-full text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
          >
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </button>
          {menu ? (
            <button
              type="button"
              onClick={() => {
                setMenu(false)
                onSignaler(m)
              }}
              className="ml-1 inline-flex items-center gap-1 rounded-full bg-card px-2.5 py-1 text-xs font-bold text-(--destructive) shadow ring-1 ring-black/5"
            >
              <Flag className="size-3.5" aria-hidden="true" />
              Signaler
            </button>
          ) : null}
        </div>
      ) : null}
      <div
        className={cn(
          'max-w-[min(32rem,82%)] rounded-2xl px-3.5 py-2 text-[15px] leading-snug shadow-sm',
          mien ? 'bg-primary text-primary-foreground' : 'bg-card ring-1 ring-black/5',
          mien ? (premier ? 'rounded-br-md' : '') : premier ? 'rounded-bl-md' : '',
          m.enEnvoi && 'opacity-70',
          m.echec && 'ring-2 ring-(--destructive)',
        )}
      >
        {m.pieceChemin ? (
          <div className={cn(m.corps ? 'mb-1.5' : '')}>
            <Piece m={m} mien={mien} />
          </div>
        ) : null}
        {m.corps ? <p className="break-words whitespace-pre-wrap">{m.corps}</p> : null}
        <p className={cn('mt-0.5 flex items-center justify-end gap-1 text-[11px] font-semibold', mien ? 'text-primary-foreground/75' : 'text-muted-foreground')}>
          {m.echec ? (
            <>
              <AlertCircle className="size-3" aria-hidden="true" /> Non envoyé
            </>
          ) : m.enEnvoi ? (
            'Envoi…'
          ) : (
            heure(m.creeLe)
          )}
        </p>
      </div>
    </div>
  )
}
