'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { createPortal } from 'react-dom'
import { ArrowRight, Check, Copy, UserPlus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import FriendQrButton from '@/components/FriendQrButton'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { addFriendByCode } from '@/app/amis/actions'
import { useDialogFocus } from '@/lib/use-dialog'
import { useSortieAnimee } from '@/components/useSortieAnimee'
import ParrainageCard from '@/components/ParrainageCard'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import { REFERRAL_GEM_REWARD, type ReferralSummary } from '@/lib/gems'
import { useFermeAuMasquage } from '@/components/useFermeAuMasquage'

/**
 * « Ajouter un ami » de l'onglet Amis : ouvre une modale avec tout le
 * nécessaire — mon QR à faire scanner, mon code à copier, et le champ
 * « code d'un ami ». Quatre déclencheurs possibles : le rond du header
 * (`icon`, défaut), le gros bouton violet sous le classement (`cta` — il a été
 * vert, une couleur d'état posée sur une action), ou la pastille « Ajouter »
 * de la rangée stories (`story`), ou le bouton D'ANGLE du classement des amis
 * (`coin`). Un seul libellé partout : « Ajouter un ami ».
 *
 * LE BOUTON D'ANGLE (Lucas, 17/09/2026 : « le bloc inviter un ami est trop
 * bas, il faut l'intégrer dans le bloc classement des amis, dans l'angle, avec
 * une icône qui donne envie de cliquer »). La carte de parrainage vivait sous
 * le classement, à un écran de là. Elle entre dans CETTE fenêtre : un seul
 * endroit pour faire venir un ami, qu'on ait un lien à partager (et des gemmes
 * à gagner) ou le code d'un ami à saisir. Le bouton porte le gain en pastille
 * dorée, et se trémousse de temps en temps (`.invite-coin`).
 */
export default function FriendAddButton({
  myFriendCode,
  variant = 'icon',
  referral = null,
}: {
  myFriendCode: string
  variant?: 'icon' | 'cta' | 'story' | 'coin'
  /** Où en sont mes invitations — la fenêtre de la variante `coin` l'affiche. */
  referral?: ReferralSummary | null
}) {
  const avecParrainage = variant === 'coin' && referral !== null
  const [open, setOpen] = useState(false)
  useFermeAuMasquage(setOpen, false)
  const panel = useRef<HTMLDivElement>(null)
  useDialogFocus(panel, open)
  const [copied, setCopied] = useState(false)
  const [copyFailed, setCopyFailed] = useState(false)
  const [code, setCode] = useState('')
  const [feedback, setFeedback] = useState<{
    ok: boolean
    message: string
  } | null>(null)
  const [isAdding, startAdding] = useTransition()
  // Reste montée le temps de l'animation de sortie (CSS, sans framer-motion).
  const { monte, etat, onAnimationEnd } = useSortieAnimee(open)

  // Fermeture au clavier (Échap), comme les autres modales de l'app.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const copyCode = async () => {
    if (!myFriendCode) return
    try {
      await navigator.clipboard.writeText(myFriendCode)
      setCopyFailed(false)
      setCopied(true)
      sfx.tap()
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // Presse-papiers indisponible (contexte non sécurisé, permission…) :
      // on le dit au lieu de laisser un tap sans effet.
      setCopyFailed(true)
    }
  }

  const submitCode = (e: React.FormEvent) => {
    e.preventDefault()
    const value = code.trim()
    if (!value || isAdding) return
    sfx.tap()
    startAdding(async () => {
      const res = await addFriendByCode(value)
      setFeedback(res)
      if (res.ok) setCode('')
    })
  }

  return (
    <>
      {variant === 'cta' ? (
        <Button
          type="button"
          size="lg"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          className="w-full"
        >
          <UserPlus strokeWidth={2.8} aria-hidden="true" />
          Ajouter un ami
        </Button>
      ) : variant === 'coin' ? (
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setOpen(true)
          }}
          aria-haspopup="dialog"
          aria-label={`Ajouter un ami — +${REFERRAL_GEM_REWARD} gemmes chacun`}
          className="invite-coin relative mr-1 flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_4px_0_color-mix(in_oklch,var(--primary),black_28%)] transition active:translate-y-[3px] active:shadow-none"
        >
          <UserPlus className="size-5" strokeWidth={2.6} aria-hidden="true" />
          {/* Le gain en pastille : « +30 » puis le CRISTAL ILLUSTRÉ, le même
              objet que le bandeau et la carte de profil (Lucas, 18/09/2026) —
              l'icône au trait ne se reconnaissait pas comme la monnaie. */}
          <span
            aria-hidden="true"
            className="font-heading absolute -top-2.5 -right-2 flex items-center gap-0.5 rounded-full bg-highlight py-0.5 pr-1 pl-1.5 text-[11px] leading-none font-extrabold text-foreground shadow-sm ring-2 ring-card"
          >
            +{REFERRAL_GEM_REWARD}
            <CristalIcon className="-my-1 size-4" />
          </span>
        </button>
      ) : variant === 'story' ? (
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setOpen(true)
          }}
          aria-haspopup="dialog"
          aria-label="Ajouter un ami"
          className="flex w-16 shrink-0 cursor-pointer flex-col items-center gap-1"
        >
          <span
            aria-hidden="true"
            className="flex size-13 items-center justify-center rounded-full border-2 border-dashed border-primary/40 text-xl text-primary"
          >
            ＋
          </span>
          <span className="text-[11px] font-bold text-foreground">Ajouter</span>
          <span className="-mt-1 text-[10px] font-semibold text-transparent">
            ·
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setOpen(true)
          }}
          aria-haspopup="dialog"
          aria-label="Ajouter un ami"
          className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition active:scale-95"
        >
          <UserPlus className="size-5" strokeWidth={2.4} aria-hidden="true" />
        </button>
      )}

      {typeof document !== 'undefined'
        ? createPortal(
            monte ? (
              <div
                data-etat={etat}
                className="modale-voile fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
                role="dialog"
                aria-modal="true"
                aria-label="Ajouter un ami"
                onClick={() => setOpen(false)}
              >
                <div
                  ref={panel}
                  data-etat={etat}
                  onAnimationEnd={onAnimationEnd}
                  className="modale-panneau flex max-h-[90svh] w-full max-w-sm flex-col gap-3 overflow-y-auto overscroll-contain rounded-3xl bg-card p-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-foreground/10 outline-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2">
                    {avecParrainage ? (
                      // La carte de parrainage porte son propre titre : ici
                      // il ne reste que la croix, et le nom pour le lecteur.
                      <h2 className="sr-only">Ajouter un ami</h2>
                    ) : (
                      <>
                        <UserPlus
                          className="size-5 shrink-0 text-primary"
                          strokeWidth={2.4}
                          aria-hidden="true"
                        />
                        <h2 className="font-heading min-w-0 flex-1 truncate text-lg font-extrabold">
                          Ajouter un ami
                        </h2>
                      </>
                    )}
                    {avecParrainage ? <span className="flex-1" /> : null}
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      aria-label="Fermer"
                      className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted active:scale-90"
                    >
                      <X
                        className="size-5"
                        strokeWidth={2.4}
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  {avecParrainage && referral ? (
                    <>
                      {/* Resserrée sous la croix de fermeture. */}
                      <div className="-mt-4">
                        <ParrainageCard
                          nu
                          myFriendCode={myFriendCode}
                          summary={referral}
                        />
                      </div>
                      <div className="surtitre mt-1 flex items-center gap-2">
                        <span className="h-px flex-1 bg-border" />
                        Ton ami est à côté ?
                        <span className="h-px flex-1 bg-border" />
                      </div>
                    </>
                  ) : null}

                  <p className="text-sm text-muted-foreground">
                    Fais scanner ton QR code : vous devenez amis direct. Par
                    code, ton ami reçoit une demande à accepter.
                  </p>

                  {/* Mon QR à faire scanner — quiconque le scanne devient mon ami. */}
                  {myFriendCode ? (
                    <FriendQrButton friendCode={myFriendCode} />
                  ) : null}

                  {/* Le code se copie déjà dans la carte de parrainage. */}
                  {avecParrainage ? null : (
                    <button
                      type="button"
                      onClick={copyCode}
                      disabled={!myFriendCode}
                      aria-label={
                        myFriendCode
                          ? `Copier ton code ${myFriendCode}`
                          : 'Code indisponible'
                      }
                      className="flex items-center justify-between gap-2 rounded-full border bg-muted/50 px-4 py-2 font-mono text-sm font-bold transition-colors hover:bg-muted disabled:opacity-60"
                    >
                      {myFriendCode || '——————'}
                      {copied ? (
                        <Check className="size-4 text-success" />
                      ) : (
                        <Copy className="size-4 text-muted-foreground" />
                      )}
                    </button>
                  )}
                  {copyFailed ? (
                    <p role="status" className="px-1 text-xs text-destructive">
                      Copie impossible sur cet appareil — recopie ton code à la
                      main.
                    </p>
                  ) : null}

                  <form
                    className="flex items-center gap-2"
                    onSubmit={submitCode}
                  >
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => {
                        setCode(e.target.value.toUpperCase())
                        if (feedback) setFeedback(null)
                      }}
                      maxLength={10}
                      autoCapitalize="characters"
                      autoComplete="off"
                      placeholder="Code d’un ami…"
                      aria-label="Entrer le code d’un ami"
                      className="h-10 min-w-0 flex-1 rounded-full border bg-card px-4 font-mono text-sm tracking-wide uppercase outline-none placeholder:font-sans placeholder:normal-case placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40"
                    />
                    <Button
                      type="submit"
                      className="rounded-full"
                      disabled={isAdding || code.trim().length === 0}
                    >
                      {isAdding ? (
                        'Envoi…'
                      ) : (
                        <>
                          Ajouter <ArrowRight className="size-4" />
                        </>
                      )}
                    </Button>
                  </form>
                  {feedback ? (
                    <p
                      role="status"
                      aria-live="polite"
                      className={cn(
                        'px-1 text-sm font-medium',
                        feedback.ok ? 'text-success' : 'text-destructive',
                      )}
                    >
                      {feedback.message}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null,
            document.body,
          )
        : null}
    </>
  )
}
