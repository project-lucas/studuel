'use client'

import { useState } from 'react'
import { Gamepad2 } from 'lucide-react'
import ModeTicket from '@/components/defi/ModeTicket'
import SubjectGames from '@/components/reviser/SubjectGames'
import NiveauOrthographe from '@/components/francais/NiveauOrthographe'
import NiveauOrthographeCarte from '@/components/francais/NiveauOrthographeCarte'
import { billetDictee } from '@/lib/reviser/billets-matiere'

/**
 * Le slug de la matière qui porte le test de niveau en orthographe.
 *
 * Une constante et non un `subject.slug === 'francais'` semé dans le JSX : le
 * jour où l'anglais aura le sien, c'est ici qu'on regardera.
 */
const MATIERE_TEST_NIVEAU = 'francais'

/**
 * L'onglet « Mode de jeu » : les jeux de l'arène de la matière. Le GARDIEN a
 * quitté ce panneau le 01/11/2026 pour sa propre porte, « Boss »
 * (components/reviser/GardienMatiere).
 *
 * Ce qui s'y trouvait dessous — la liste de tous les chapitres avec leurs
 * pastilles Cours / Quiz / Flashcards / Carte mentale / Défi — a été retiré :
 * c'était le PROGRAMME redit une deuxième fois, plus long que les modes de jeu
 * eux-mêmes, et un dossier à deux disciplines (histoire-géo) l'affichait même
 * sans filtre. Ces formats se trouvent là où on choisit quoi travailler : dans
 * le chapitre, sur l'onglet Programme.
 */
export default function TrainingPanel({
  subject,
  premium = false,
}: {
  subject: { slug: string; name: string }
  /** Abonné Studuel+ : tous les jeux de la matière s'ouvrent. */
  premium?: boolean
}) {
  // Le test de niveau prend le panneau entier, comme le combat de boss : neuf
  // questions sans correction ne se lisent pas dans une carte de trois lignes.
  const [testNiveau, setTestNiveau] = useState(false)
  if (testNiveau) {
    return <NiveauOrthographe onClose={() => setTestNiveau(false)} />
  }

  const estFrancais = subject.slug === MATIERE_TEST_NIVEAU

  return (
    <>
      {/* LE TEST DE NIVEAU, AU-DESSUS DES MODES DE JEU (Lucas, 12/10/2026 :
          « évaluer son niveau devra être placé au-dessus des modes de jeu —
          l'idée est valable pour les autres matières ») : ce n'est pas un jeu,
          c'est la mesure qui dit lesquels valent la peine. Seul le français a
          le sien pour l'instant ; les autres matières prendront la même place. */}
      {estFrancais ? <NiveauOrthographeCarte onOpen={() => setTestNiveau(true)} /> : null}

      <section aria-labelledby="jeux-matiere" className="mt-4">
        <p className="text-sm font-semibold text-muted-foreground">Jeux de l’Arène</p>
        <h2 id="jeux-matiere" className="titre-section mt-0.5 flex items-center gap-2">
          <Gamepad2 className="size-5 shrink-0 text-primary" aria-hidden="true" />
          Modes de jeu · {subject.name}
        </h2>

        <div className="mt-3 flex flex-col gap-3">
          {/* LA DICTÉE EN BILLET, français seulement (Lucas, 12/10/2026 :
              « c'est un mode important ») — une carte grisée « bientôt » dans
              les autres dossiers serait une porte qui ne s'ouvre pas. */}
          {estFrancais ? <ModeTicket ticket={billetDictee()} /> : null}

          <SubjectGames subject={subject} premium={premium} enTete={false} />
        </div>
      </section>
    </>
  )
}
