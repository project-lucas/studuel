'use client'

import { useEffect, useState } from 'react'
import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Vrai tant que le Boost XP court. Le serveur ne transmet qu'un boost EN COURS
 * (lireFinBoostXp) ; ici, on le fait disparaître à l'échéance sans attendre un
 * rechargement. On retient l'échéance déjà passée plutôt qu'un booléen : un
 * nouvel achat apporte une autre échéance, et le badge revient de lui-même.
 */
function useBoostEnCours(jusqua: string | null): boolean {
  const [echu, setEchu] = useState<string | null>(null)
  useEffect(() => {
    if (jusqua === null) return
    const reste = Date.parse(jusqua) - Date.now()
    if (!Number.isFinite(reste)) return
    // setTimeout plafonne à ~24,8 jours : un boost en dure deux heures.
    const id = window.setTimeout(() => setEchu(jusqua), Math.max(0, reste))
    return () => window.clearTimeout(id)
  }, [jusqua])
  return jusqua !== null && echu !== jusqua
}

/**
 * « ×2 XP » — le Boost XP du Marché qui court (Lucas, 19/09/2026 : « le x2 exp
 * doit apparaître ici une fois acheté »). Posé contre le NIVEAU, parce que
 * c'est l'XP qu'il double : dans le bandeau du haut et sur la carte du joueur
 * de l'arène. Dans la teinte du boost au Marché (ambre), comme sa carte. Il
 * s'efface seul à l'échéance.
 */
export default function BadgeBoostXp({
  jusqua,
  className,
}: {
  /** Fin du boost en cours (ISO), ou null. */
  jusqua: string | null
  className?: string
}) {
  const actif = useBoostEnCours(jusqua)
  if (!actif) return null
  return (
    <span
      data-teinte="ambre"
      title="Boost XP actif : toute l’XP compte double"
      className={cn(
        'font-heading inline-flex shrink-0 items-center gap-px rounded-full bg-[color:var(--outil)] px-1.5 py-[3px] text-[9px] leading-none font-extrabold tracking-normal text-white normal-case shadow-sm ring-1 ring-white/70',
        className,
      )}
    >
      <Zap className="size-2.5 fill-current" aria-hidden="true" />
      ×2 XP
      <span className="sr-only"> : Boost XP actif</span>
    </span>
  )
}
