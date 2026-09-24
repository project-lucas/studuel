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

  // Une carte blanche, comme le reste de l'onglet Amis — elle a été un panneau
  // vert à elle, avec des boutons blancs à l'encre verte : une couleur d'état
  // en fond d'action, et une famille de boutons de plus. Sur le blanc, le
  // violet plein va au geste principal, le contour et le fantôme au reste.
  return (
    <div className="flex w-full flex-col items-center gap-4 rounded-3xl bg-card p-6 text-center text-foreground shadow-sm ring-1 ring-black/5">
      {result?.ok ? (
        <PartyPopper className="size-10 text-highlight" aria-hidden="true" />
      ) : (
        <UserPlus className="size-10 text-primary" aria-hidden="true" />
      )}

      <h1 className="font-heading text-3xl font-extrabold">
        {result?.ok
          ? result.message
          : name
            ? `Deviens ami avec ${name} !`
            : 'Ajouter un ami'}
      </h1>

      {result ? (
        <>
          {!result.ok ? (
            <p className="text-sm font-semibold text-muted-foreground">
              {result.message}
            </p>
          ) : null}
          <div className="flex w-full flex-col gap-2">
            <Button asChild size="lg" className="w-full">
              <Link href="/amis">Voir mes amis</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/defi">Retour au Défi</Link>
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm font-semibold text-muted-foreground">
            Tu as scanné le code{' '}
            <span className="font-mono font-bold tracking-widest">{code}</span>.
            Un tap et vous êtes amis — classements, duels et défis en commun !
          </p>
          <Button size="lg" onClick={add} disabled={pending} className="w-full">
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
