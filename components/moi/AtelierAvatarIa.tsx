'use client'

import { useEffect, useRef, useState, useTransition, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, Paintbrush, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSortieAnimee } from '@/components/useSortieAnimee'
import { useDialogFocus } from '@/lib/use-dialog'
import { DEMANDE_MAX, IDEES_AVATAR, messageRefus, refusDemande } from '@/lib/avatar-ia'
import { COUT_AVATAR } from '@/lib/coach/credits'
import { garderAvatarIa, ouvrirAtelierAvatar, type AtelierAvatar } from '@/app/moi/avatar-ia-actions'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import marcelTete from '@/public/images/nav/marcel.webp'

// -----------------------------------------------------------------------------
// « MARCEL DESSINE TON AVATAR » (Lucas, 24/09/2026 : « quand l'élève clique sur
// son avatar, il a la suggestion de faire un prompt à Marcel pour changer le
// rendu ; cela consomme ses crédits, autant de fois que ses crédits mensuels
// le permettent »). Nano Banana (Gemini 2.5 Flash Image), migration 378.
//
// La feuille s'ouvre au toucher de l'avatar, dans l'onglet Moi : un champ, des
// idées à toucher, ce que ça coûte ; puis Marcel dessine (une dizaine de
// secondes), et l'élève garde le dessin ou recommence. Ses anciens dessins se
// reprennent sans rien dépenser. Le vestiaire reste à un tap. Le gratuit voit
// ce que Studuel+ lui ouvrirait.
// -----------------------------------------------------------------------------

type Etape =
  | { cle: 'saisie' }
  | { cle: 'dessin' }
  | { cle: 'resultat'; id: string; src: string }

type Refus = 'connexion' | 'demande' | 'abonnement' | 'credits' | 'plafond' | 'indisponible' | 'bloque' | 'panne'

const MESSAGES: Record<Refus, string> = {
  connexion: 'Reconnecte-toi pour demander un avatar à Marcel.',
  demande: 'Dis-en un peu plus à Marcel : quel personnage veux-tu ?',
  abonnement: 'L’avatar dessiné fait partie de Studuel+.',
  credits: `Il te faut ${COUT_AVATAR} crédits : ils reviennent le 1er du mois.`,
  plafond: 'Marcel a assez dessiné pour aujourd’hui. Reviens demain !',
  indisponible: 'Marcel ne peut pas dessiner pour l’instant. Réessaie plus tard.',
  bloque: 'Marcel ne peut pas dessiner ça. Essaie un autre personnage : tes crédits te sont rendus.',
  panne: 'Marcel n’a pas réussi à dessiner. Réessaie : tes crédits te sont rendus.',
}

const sAbonner = () => () => {}

export default function AtelierAvatarIa({
  open,
  onClose,
  abonne,
  initial = null,
}: {
  open: boolean
  onClose: () => void
  /** Studuel+ : sinon, l'atelier montre ce qu'il ouvrirait. */
  abonne: boolean
  /** Aperçu de développement (/dev/avatar-ia) : l'atelier déjà chargé. */
  initial?: AtelierAvatar | null
}) {
  const router = useRouter()
  const panneau = useRef<HTMLDivElement>(null)
  const { monte, etat, onAnimationEnd } = useSortieAnimee(open)
  // Rien au rendu serveur ni à l'hydratation : un portail ouvert d'emblée
  // ne correspondrait à rien côté serveur.
  const client = useSyncExternalStore(sAbonner, () => true, () => false)
  useDialogFocus(panneau, open)
  const [atelier, setAtelier] = useState<AtelierAvatar | null>(initial)
  const [demande, setDemande] = useState('')
  const [etape, setEtape] = useState<Etape>({ cle: 'saisie' })
  const [erreur, setErreur] = useState<string | null>(null)
  const [garde, setGarde] = useState<string | null>(null)
  const [pending, start] = useTransition()

  // L'atelier se charge à l'ouverture (crédits, anciens dessins) : l'onglet
  // Moi n'en paie rien tant qu'on ne touche pas l'avatar.
  useEffect(() => {
    if (!open || !abonne || initial) return
    let vivant = true
    void ouvrirAtelierAvatar().then((a) => {
      if (vivant) setAtelier(a)
    })
    return () => {
      vivant = false
    }
  }, [open, abonne, initial])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && etape.cle !== 'dessin') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, etape.cle])

  if (!monte || !client) return null

  const restants = atelier?.credits?.restants ?? null
  const assez = restants === null || restants >= COUT_AVATAR
  const refus = refusDemande(demande)

  const fermer = () => {
    if (etape.cle === 'dessin') return
    sfx.tap()
    onClose()
  }

  const dessiner = async () => {
    if (refus) {
      setErreur(messageRefus(refus))
      return
    }
    setErreur(null)
    setEtape({ cle: 'dessin' })
    try {
      const r = await fetch('/api/avatar-ia', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ demande }),
      })
      const json = (await r.json().catch(() => null)) as
        | { ok: true; id: string; src: string }
        | { ok: false; raison: Refus; message?: string }
        | null
      if (json && json.ok) {
        sfx.levelUp()
        setEtape({ cle: 'resultat', id: json.id, src: json.src })
        setAtelier((a) =>
          a
            ? {
                ...a,
                credits: a.credits ? { ...a.credits, restants: Math.max(0, a.credits.restants - COUT_AVATAR) } : null,
                avatars: [{ id: json.id, src: json.src, demande }, ...a.avatars].slice(0, 12),
              }
            : a,
        )
        return
      }
      setErreur(json?.message ?? MESSAGES[json?.raison ?? 'panne'])
      setEtape({ cle: 'saisie' })
    } catch {
      setErreur(MESSAGES.panne)
      setEtape({ cle: 'saisie' })
    }
  }

  const garder = (id: string) => {
    start(async () => {
      const r = await garderAvatarIa(id)
      if (r.ok) {
        sfx.correct()
        setGarde(id)
        // L'avatar se voit partout (bandeau, onglet Moi, ligue) : on relit.
        router.refresh()
      } else {
        setErreur('Ton avatar n’a pas pu être gardé. Réessaie.')
      }
    })
  }

  return createPortal(
    <div
      data-etat={etat}
      className="modale-voile fixed inset-0 z-50 flex items-end justify-center bg-black/55 p-4 sm:items-center"
      onClick={fermer}
    >
      <div
        ref={panneau}
        role="dialog"
        aria-modal="true"
        aria-labelledby="atelier-avatar-titre"
        data-etat={etat}
        onAnimationEnd={onAnimationEnd}
        onClick={(e) => e.stopPropagation()}
        className="modale-panneau relative flex max-h-[92svh] w-full max-w-sm flex-col gap-3 overflow-y-auto overscroll-contain rounded-3xl bg-card px-5 pt-5 pb-5 text-foreground shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-foreground/10 outline-none"
      >
        <button
          type="button"
          onClick={fermer}
          aria-label="Fermer"
          disabled={etape.cle === 'dessin'}
          className="absolute top-3 right-3 grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted active:scale-90 disabled:opacity-40"
        >
          <X className="size-5" strokeWidth={2.4} aria-hidden="true" />
        </button>

        <div className="flex items-center gap-3 pr-8">
          <Image src={marcelTete} alt="" aria-hidden="true" width={112} height={112} className="size-14 shrink-0 select-none object-contain" />
          <div className="min-w-0">
            <h2 id="atelier-avatar-titre" className="font-heading text-xl leading-tight font-extrabold">
              Marcel dessine ton avatar
            </h2>
            <p className="text-sm font-semibold text-muted-foreground">Décris le personnage que tu veux être.</p>
          </div>
        </div>

        {!abonne ? (
          <div className="flex flex-col gap-3 rounded-2xl bg-highlight/12 p-4 text-center ring-1 ring-highlight/35">
            <p className="text-sm font-semibold text-balance">
              L’avatar dessiné fait partie de <strong className="font-extrabold">Studuel+</strong>&nbsp;: 200 crédits par
              mois pour Marcel, et {COUT_AVATAR} crédits un avatar.
            </p>
            <Button asChild size="lg" className="w-full">
              <Link href="/tresor">
                <Sparkles aria-hidden="true" />
                Découvrir Studuel+
              </Link>
            </Button>
          </div>
        ) : atelier && !atelier.disponible ? (
          // Migration 378 pas encore passée : on le dit, sans formulaire mort.
          <p className="rounded-2xl bg-muted/60 p-4 text-center text-sm font-semibold text-muted-foreground">
            Bientôt&nbsp;: Marcel apprend à dessiner. Reviens dans quelques jours&nbsp;!
          </p>
        ) : etape.cle === 'dessin' ? (
          // MARCEL DESSINE : un disque qui respire (opacité seule) le temps du dessin.
          <div role="status" className="flex flex-col items-center gap-3 py-6 text-center">
            <span className="grid size-40 place-items-center rounded-full bg-primary/10 ring-4 ring-primary/20 motion-safe:animate-pulse">
              <Paintbrush className="size-12 text-primary" strokeWidth={2} aria-hidden="true" />
            </span>
            <p className="font-heading text-lg font-extrabold">Marcel dessine…</p>
            <p className="text-sm font-semibold text-muted-foreground">Une dizaine de secondes.</p>
          </div>
        ) : etape.cle === 'resultat' ? (
          <div className="flex flex-col items-center gap-3 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={etape.src}
              alt={`Ton avatar : ${demande}`}
              className="size-48 rounded-full object-cover shadow-[0_12px_28px_-12px_rgba(0,0,0,.5)] ring-4 ring-highlight"
            />
            {garde === etape.id ? (
              <p role="status" className="flex items-center gap-1.5 text-sm font-extrabold text-success">
                <Check className="size-4" strokeWidth={3} aria-hidden="true" /> C’est ton nouvel avatar&nbsp;!
              </p>
            ) : (
              <Button type="button" size="xl" shine className="w-full" disabled={pending} onClick={() => garder(etape.id)}>
                Garder cet avatar
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => {
                setEtape({ cle: 'saisie' })
                setGarde(null)
              }}
            >
              Demander un autre dessin
            </Button>
          </div>
        ) : (
          <>
            <label className="flex flex-col gap-1.5">
              <span className="sr-only">Le personnage que tu veux</span>
              <textarea
                value={demande}
                onChange={(e) => {
                  setDemande(e.target.value.slice(0, DEMANDE_MAX))
                  if (erreur) setErreur(null)
                }}
                rows={3}
                maxLength={DEMANDE_MAX}
                placeholder="Ex. : une astronaute avec un casque doré, qui sourit"
                className="w-full resize-none rounded-2xl border-[1.5px] border-foreground/12 bg-background/60 p-3 text-sm font-semibold outline-none focus:border-primary"
              />
              <span className="self-end text-[11px] font-bold text-muted-foreground tabular-nums">
                {demande.length}/{DEMANDE_MAX}
              </span>
            </label>

            {/* Des idées à toucher, pour qui ne sait pas quoi demander. */}
            <div className="flex flex-wrap gap-1.5">
              {IDEES_AVATAR.map((idee) => (
                <button
                  key={idee}
                  type="button"
                  onClick={() => {
                    sfx.tap()
                    setDemande(idee)
                    setErreur(null)
                  }}
                  className="rounded-full bg-primary/8 px-3 py-1.5 text-xs font-bold text-primary ring-1 ring-primary/20 transition active:scale-95"
                >
                  {idee}
                </button>
              ))}
            </div>

            {erreur ? (
              <p role="alert" className="rounded-2xl bg-destructive/10 p-2.5 text-sm font-semibold text-destructive">
                {erreur}
              </p>
            ) : null}

            <Button type="button" size="xl" shine className="w-full" disabled={!assez || demande.trim().length === 0} onClick={dessiner}>
              <Paintbrush aria-hidden="true" />
              Dessiner mon avatar
            </Button>
            <p className="-mt-1 text-center text-xs font-semibold text-muted-foreground">
              {COUT_AVATAR} crédits
              {restants !== null ? ` · il t’en reste ${restants} ce mois-ci` : ''}
            </p>

            {/* MES CRÉATIONS : les reprendre ne coûte rien. */}
            {atelier && atelier.avatars.length > 0 ? (
              <div>
                <p className="mb-1.5 text-xs font-extrabold text-muted-foreground">Mes créations</p>
                <div className="flex flex-wrap gap-2">
                  {atelier.avatars.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => garder(a.id)}
                      disabled={pending}
                      aria-label={`Reprendre l’avatar : ${a.demande}`}
                      className={cn(
                        'relative size-14 overflow-hidden rounded-full ring-2 transition active:scale-95',
                        garde === a.id ? 'ring-success' : 'ring-foreground/10',
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={a.src} alt="" className="size-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </>
        )}

        <Link
          href="/moi/avatar"
          onClick={() => {
            sfx.tap()
            onClose()
          }}
          className="font-heading mt-1 flex min-h-11 items-center justify-center text-sm font-extrabold text-primary"
        >
          Ou compose-le toi-même au vestiaire
        </Link>
      </div>
    </div>,
    document.body,
  )
}
