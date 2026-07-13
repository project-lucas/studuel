'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Pencil } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import type { AvatarConfig } from '@/lib/avatar'

// L'éditeur (et donc DiceBear) n'est chargé que lorsqu'on l'ouvre : le rendu du
// bandeau reste léger, l'avatar affiché est un data-URI pré-calculé côté serveur.
const AvatarEditor = dynamic(() => import('@/components/AvatarEditor'), {
  ssr: false,
})

// Avatar cliquable du bandeau Moi : l'image pré-rendue + un bouton crayon qui
// ouvre « Crée ton avatar ». Le halo est géré par le parent (MoiHeader).
export default function AvatarBadge({
  uri,
  config,
}: {
  uri: string
  config: AvatarConfig
}) {
  const [editing, setEditing] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setEditing(true)
        }}
        aria-label="Personnaliser mon avatar"
        className="group relative block rounded-full transition-transform active:scale-95"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={uri}
          alt="Mon avatar"
          className="size-24 rounded-full bg-white shadow-md ring-4 ring-white"
        />
        <span className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border-2 border-white bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-110">
          <Pencil className="size-3.5" strokeWidth={2.6} aria-hidden="true" />
        </span>
      </button>

      {editing ? (
        <AvatarEditor initial={config} onClose={() => setEditing(false)} />
      ) : null}
    </>
  )
}
