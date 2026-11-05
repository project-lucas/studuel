'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import ReglagesSon from '@/components/ui/ReglagesSon'
import { lancerEntreeCombat } from '@/lib/entree-combat'
import { demanderMusique, type Piste } from '@/lib/musique'
import { sfx } from '@/lib/sounds'

export default function Banc() {
  const [piste, setPiste] = useState<Piste | null>(null)
  useEffect(() => (piste ? demanderMusique(piste, { boucle: piste !== 'victoire' }) : undefined), [piste])

  const vague = () => {
    for (let i = 0; i < 10; i++) window.setTimeout(() => sfx.perle(i), i * 110)
  }
  const coffre = () => {
    sfx.coffreTremble()
    window.setTimeout(() => sfx.treasure(), 900)
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3 px-4 py-6">
      <h1 className="font-heading text-2xl font-extrabold">Entrée en combat et sons</h1>
      <p className="surtitre text-muted-foreground">L’entrée au flash blanc</p>
      <Button size="xl" onClick={() => lancerEntreeCombat('/dev/combat-boss')}>Affronter un gardien</Button>
      <Button size="xl" variant="secondary" onClick={() => lancerEntreeCombat('/dev/course-heros')}>
        Duel classé
      </Button>

      <p className="surtitre text-muted-foreground mt-3">Les musiques</p>
      <div className="grid grid-cols-2 gap-2">
        {(['arene', 'combat', 'victoire'] as const).map((p) => (
          <Button key={p} variant={piste === p ? 'default' : 'outline'} onClick={() => setPiste(p)}>
            {p === 'arene' ? 'Arène' : p === 'combat' ? 'Combat' : 'Victoire'}
          </Button>
        ))}
        <Button variant="outline" onClick={() => setPiste(null)}>Silence</Button>
      </div>

      <p className="surtitre text-muted-foreground mt-3">Les récompenses</p>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={vague}>Vague d’éclairs</Button>
        <Button variant="outline" onClick={coffre}>Coffre</Button>
        <Button variant="outline" onClick={() => sfx.scintillement()}>Scintillement</Button>
        <Button variant="outline" onClick={() => sfx.piece()}>Gemme</Button>
        <Button variant="outline" onClick={() => sfx.impact(false)}>Coup</Button>
        <Button variant="outline" onClick={() => sfx.impact(true)}>Critique</Button>
      </div>

      <p className="surtitre text-muted-foreground mt-3">Réglages</p>
      <ReglagesSon />
    </div>
  )
}
