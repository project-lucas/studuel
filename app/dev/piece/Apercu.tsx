'use client'

import { Gamepad2 } from 'lucide-react'
import ModeStage from '@/components/defi/ModeStage'
import ModeHero from '@/components/defi/ModeHero'

const PALIERS = ['Éveil', 'Apprenti', 'Confirmé', 'Expert', 'Maître']

/** La scène d'un mode, son bandeau et cinq cartes factices : de quoi voir la pièce autour. */
export default function ApercuPiece({
  titre,
  sousTitre,
  theme,
  scene,
  matiere,
}: {
  titre: string
  sousTitre?: string
  theme: string
  scene: string | null
  matiere: { nom: string; vignette: string | null } | null
}) {
  return (
    <ModeStage
      title={titre}
      Icon={Gamepad2}
      theme={theme}
      scene={scene}
      onExit={() => window.history.back()}
    >
      <ModeHero scene={scene} titre={titre} sousTitre={sousTitre} matiere={matiere} />
      <div className="mt-4 flex flex-col gap-3">
        {PALIERS.map((palier) => (
          <div
            key={palier}
            className="bg-card rounded-2xl p-4 shadow-sm ring-2 ring-[color:var(--jeu-accent)]/30"
          >
            <p className="font-heading font-extrabold">{palier}</p>
            <p className="text-muted-foreground text-sm">
              Une carte de palier, pour voir la table posée dans sa pièce.
            </p>
          </div>
        ))}
      </div>
    </ModeStage>
  )
}
