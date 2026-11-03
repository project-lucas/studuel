'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ChoixHeros from '@/components/heros/ChoixHeros'
import { isHerosKey, type HerosKey } from '@/lib/heros/eleves'

export default function ApercuChoixHeros({ initial }: { initial?: string }) {
  const router = useRouter()
  const [choisi, setChoisi] = useState<HerosKey | null>(isHerosKey(initial) ? initial : null)
  return (
    <div className="fixed inset-0 z-[60] flex flex-col">
      <ChoixHeros choisi={choisi} onChoisir={setChoisi} onConfirmer={() => router.back()} onRetour={() => router.back()} />
    </div>
  )
}
