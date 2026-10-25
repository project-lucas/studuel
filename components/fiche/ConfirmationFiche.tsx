'use client'

import { useState, useTransition } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { AnimatePresence, useReducedMotion } from 'framer-motion'
import SheetShell from '@/components/defi/SheetShell'
import { Button } from '@/components/ui/button'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import { PRIX_FICHE, TITRE_CONFIRMATION, soldeEcrin } from '@/lib/fiche-ecrin'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import s from './EcrinFiche.module.css'

export type ReponseDeblocage = { ok: boolean; message: string }

/**
 * LA CONFIRMATION DE LA DÉPENSE — un pop-up de la famille des tanières
 * (`SheetShell` format popup : la grande carte crème centrée), à la place de
 * la feuille blanche d'avant (Lucas : « je n'aime pas du tout, il faut être
 * plus cohérent avec l'app »). La même fiche roulée, « Dépenser 30 gemmes ? »,
 * le solde après, « Débloquer » en or, « Pas maintenant » en ghost.
 *
 * Elle ne se ferme d'elle-même qu'au succès RÉEL ; sinon elle dit l'erreur et
 * reste ouverte, pas de fausse impression.
 */
export default function ConfirmationFiche({
  titre,
  image,
  gems,
  debloquer,
  onSucces,
  onFermer,
}: {
  titre: string
  image: string
  gems: number
  debloquer: () => Promise<ReponseDeblocage>
  onSucces: () => void
  onFermer: () => void
}) {
  const reduce = useReducedMotion()
  const [pending, start] = useTransition()
  const [erreur, setErreur] = useState<string | null>(null)
  const solde = soldeEcrin(gems)

  const confirmer = () => {
    if (pending) return
    sfx.tap()
    setErreur(null)
    start(async () => {
      const r = await debloquer()
      if (r.ok) {
        onSucces()
        return
      }
      setErreur(r.message)
    })
  }

  const fermer = () => {
    if (pending) return
    onFermer()
  }

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      <SheetShell
        label={TITRE_CONFIRMATION}
        reduce={reduce}
        onClose={fermer}
        format="popup"
        header={<h2 className="font-heading flex-1 text-lg leading-tight font-extrabold">{TITRE_CONFIRMATION}</h2>}
      >
        <div className={s.confirmation}>
          <span className={s.confirmationObjet} aria-hidden="true">
            <Image src={image} alt="" width={256} height={256} unoptimized loading="eager" className={s.image} />
          </span>
          <p className={s.confirmationTitre}>{titre}</p>
          <p className={s.confirmationPhrase}>
            Elle sera à toi pour toujours — même si tu n’as plus de gemmes plus tard.
          </p>

          <dl className={s.compte}>
            <div>
              <dt>Coût</dt>
              <dd>
                {PRIX_FICHE}
                <CristalIcon className="size-4" />
              </dd>
            </div>
            <div>
              <dt>Après</dt>
              <dd>
                {solde.apres}
                <CristalIcon className="size-4" />
              </dd>
            </div>
          </dl>

          {erreur ? (
            <p className="text-destructive text-sm font-bold" role="alert">
              {erreur}
            </p>
          ) : null}

          <button
            type="button"
            onClick={confirmer}
            disabled={pending}
            className={cn('olympe-gold olympe-press', s.boutonOr, 'w-full')}
          >
            {pending ? 'Déblocage…' : 'Débloquer'}
            {pending ? null : (
              <span className={s.prix}>
                {PRIX_FICHE}
                <CristalIcon className="size-5" />
              </span>
            )}
          </button>
          <Button variant="ghost" size="lg" className="w-full" onClick={fermer} disabled={pending}>
            Pas maintenant
          </Button>
        </div>
      </SheetShell>
    </AnimatePresence>,
    document.body,
  )
}
