import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TOUR_STEPS } from '@/lib/tour'
import CarnetButton from './CarnetButton'

// -----------------------------------------------------------------------------
// LE BOUTON DU CARNET, ET SA CIBLE DE TOUR.
//
// Ce bouton a déjà déménagé trois fois : tuile pleine largeur en bas de page,
// puis bouton-icône rond dans la rangée de commandes, puis bouton libellé sur
// la ligne du titre. À chaque déménagement, `data-tour="carnet-switch"` doit
// suivre — c'est la cible de l'étape « Mon carnet » du tour guidé.
//
// L'oublier ne casse RIEN de visible : `nextAvailableStep` ne trouve pas la
// cible, considère l'étape hors écran et la SAUTE. Le tour continue, une étape
// plus court, et personne ne s'en aperçoit. D'où ce test.
// -----------------------------------------------------------------------------

describe('CarnetButton', () => {
  it('porte la cible du tour guidé, où qu’il déménage', () => {
    const { container } = render(
      <CarnetButton coursesCount={3} questionsCount={42} />,
    )
    // La cible existe bien dans le tour : le test ne garde pas une chaîne morte.
    expect(TOUR_STEPS.some((s) => s.target === 'carnet-switch')).toBe(true)
    expect(container.querySelector('[data-tour="carnet-switch"]')).not.toBeNull()
  })

  it('se lit — le libellé est écrit, pas seulement dessiné', () => {
    // Tout l'objet du changement : l'icône seule ne disait pas ce qu'elle
    // ouvrait.
    render(<CarnetButton coursesCount={3} questionsCount={42} />)
    expect(screen.getByText('Mon carnet')).toBeInTheDocument()
  })

  it('garde le résumé pour les lecteurs d’écran', () => {
    // Le compte ne s'affiche pas — le bouton doit garder la même largeur avec
    // zéro ou quarante cours —, mais il ne doit pas être perdu pour autant.
    const { rerender } = render(
      <CarnetButton coursesCount={3} questionsCount={42} />,
    )
    expect(
      screen.getByRole('button', { name: 'Mon carnet — 3 cours · 42 questions' }),
    ).toBeInTheDocument()

    rerender(<CarnetButton coursesCount={0} questionsCount={0} />)
    expect(
      screen.getByRole('button', {
        name: 'Mon carnet — Crée tes cours et révise-les.',
      }),
    ).toBeInTheDocument()
  })
})
