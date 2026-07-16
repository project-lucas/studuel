'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Loader2, PartyPopper, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { addFriendByQr } from '@/app/amis/actions'

type Props = {
  /** Code ami scanné (déjà validé et normalisé par la page). */
  code: string
  /** Prénom derrière le code (friend_preview), si la migration 163 est là. */
  name: string | null
}

/**
 * L'atterrissage du QR code ami (/amis/ajouter/<code>) : une confirmation en
 * un tap — le scan vaut rencontre, le tap crée l'amitié directement
 * (add_friend_qr). Le bouton évite qu'une simple ouverture de lien (préchargement,
 * lien forgé) ne modifie la liste d'amis à l'insu de l'élève.
 */
export default function FriendAddCard({ code, name }: Props) {
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(
    null,
  )
  const [pending, startTransition] = useTransition()

  const add = () => {
    startTransition(async () => {
      setResult(await addFriendByQr(code))
    })
  }

  return (
    <div className="flex w-full flex-col items-center gap-4 rounded-3xl border border-[oklch(0.75_0.12_150)]/50 bg-gradient-to-b from-[oklch(0.6_0.15_150)] to-[oklch(0.48_0.14_152)] p-6 text-center shadow-[0_20px_45px_-18px_oklch(0.45_0.14_152)]">
      {result?.ok ? (
        <PartyPopper className="size-10 text-highlight" aria-hidden="true" />
      ) : (
        <UserPlus className="size-10 text-white" aria-hidden="true" />
      )}

      <h1 className="font-heading text-2xl font-extrabold text-white">
        {result?.ok
          ? result.message
          : name
            ? `Deviens ami avec ${name} !`
            : 'Ajouter un ami'}
      </h1>

      {result ? (
        <>
          {!result.ok ? (
            <p className="text-sm font-semibold text-white/90">
              {result.message}
            </p>
          ) : null}
          <div className="flex w-full flex-col gap-2">
            <Button
              asChild
              className="w-full bg-white text-[oklch(0.35_0.12_152)] hover:bg-white/90"
            >
              <Link href="/amis">Voir mes amis</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="w-full text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/defi">Retour au Défi</Link>
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm font-semibold text-white/90">
            Tu as scanné le code{' '}
            <span className="font-mono font-bold tracking-widest">{code}</span>.
            Un tap et vous êtes amis — classements, duels et défis en commun !
          </p>
          <Button
            onClick={add}
            disabled={pending}
            className="w-full bg-white text-[oklch(0.35_0.12_152)] hover:bg-white/90"
          >
            {pending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : null}
            Devenir amis
          </Button>
        </>
      )}
    </div>
  )
}
