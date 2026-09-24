'use client'

import { useState } from 'react'
import AtelierAvatarIa from '@/components/moi/AtelierAvatarIa'
import type { AtelierAvatar } from '@/app/moi/avatar-ia-actions'

export default function Apercu({ abonne, initial }: { abonne: boolean; initial: AtelierAvatar | null }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="p-6 pt-24">
      <button type="button" onClick={() => setOpen(true)} className="font-heading text-primary font-extrabold">
        Rouvrir l’atelier
      </button>
      <AtelierAvatarIa open={open} onClose={() => setOpen(false)} abonne={abonne} initial={initial} />
    </div>
  )
}
