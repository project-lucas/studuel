'use client'

import { useState } from 'react'
import MarcelParle, { type MarcelPose } from './MarcelParle'
import OnbButton from './OnbButton'
import { sfx } from '@/lib/sounds'

// LE TUTO (13/10/2026, Lucas : « un tuto de bien meilleure qualité », puis
// « tout doit être tourné via des illustrations de Marcel, inspire-toi de
// Duolingo sans le côté question ») : trois diapos où MARCEL présente l'app —
// une pose, sa bulle, les points, « Suivant » — et « Passer » pour qui sait
// déjà. Pas de question : l'onboarding n'en pose plus.
const DIAPOS: { pose: MarcelPose; titre: string; texte: string }[] = [
  { pose: 'jeu', titre: 'Tes cours deviennent un jeu', texte: 'Des quiz, de l’XP, des gemmes. Tu progresses sans t’en rendre compte.' },
  { pose: 'trophee', titre: 'Défie tes amis', texte: 'Des duels de 90 secondes sur ton programme, et une ligue chaque semaine.' },
  { pose: 'plan', titre: 'Et moi, je te coache', texte: 'Un plan pour chaque contrôle, des quêtes chaque jour, un coup de pouce quand ça coince.' },
]

export default function TutoStep({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0)
  const diapo = DIAPOS[index]
  const derniere = index === DIAPOS.length - 1

  function suivant() {
    sfx.tap()
    if (derniere) onDone()
    else setIndex((i) => i + 1)
  }

  return (
    <div className="flex flex-1 flex-col">
      <div key={index} className="flex flex-1 flex-col justify-center pt-6" aria-live="polite">
        <MarcelParle grand pose={diapo.pose} titre={diapo.titre} sous={diapo.texte} />
      </div>

      <div className="mt-auto pt-5">
        <div className="mb-4 flex items-center justify-center gap-1.5" aria-label={`Diapo ${index + 1} sur ${DIAPOS.length}`}>
          {DIAPOS.map((d, i) => (
            <span
              key={d.titre}
              aria-hidden="true"
              className="h-2 rounded-full transition-[width,background-color] duration-200"
              style={{ width: i === index ? 22 : 8, background: i === index ? 'var(--onb-pp)' : 'var(--onb-line-d)' }}
            />
          ))}
        </div>
        <OnbButton onClick={suivant}>{derniere ? 'Je commence' : 'Suivant'}</OnbButton>
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            onDone()
          }}
          className={`mt-2 min-h-11 w-full text-[13px] font-extrabold ${derniere ? 'invisible' : ''}`}
          style={{ color: 'var(--onb-mut)' }}
        >
          Passer
        </button>
      </div>
    </div>
  )
}
