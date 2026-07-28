// Setup des tests de composants (projet « composants », environnement jsdom).
// Étend `expect` avec les matchers DOM (toBeInTheDocument, toHaveTextContent…)
// et nettoie le DOM entre deux tests — sans globals Vitest, l'auto-cleanup de
// testing-library ne s'enregistre pas, on le fait donc explicitement.
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})
