import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { compilerExercice } from '@/lib/exercices/compiler'
import type { ExerciceSource } from '@/lib/exercices/types'

// Le joueur du cahier, ASSEMBLÉ : on joue un exercice de bout en bout avec le
// moteur de démonstration (les mêmes règles que la base : deux essais, 2 points
// puis 1, réussi à la moitié) et on vérifie que l'écran dit la vérité — coup de
// pouce au premier raté, correction au second, bilan exact, gains annoncés.

vi.mock('@/lib/sounds', () => ({
  sfx: { tap: vi.fn(), correct: vi.fn(), wrong: vi.fn(), complete: vi.fn() },
  press: vi.fn(),
}))
vi.mock('@/app/reviser/[subject]/[chapter]/exercice/cahier-actions', () => ({
  commencerExercice: vi.fn(),
  verifierReponse: vi.fn(),
  terminerExercice: vi.fn(),
}))
vi.mock('next/link', () => ({
  default: ({ children, href, ...rest }: React.ComponentProps<'a'> & { href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))
vi.mock('@/components/recompenses/PanneauRecompenses', () => ({
  default: ({ gains }: { gains: { unite: string; montant: number }[] }) => (
    <p>Gains : {gains.map((g) => `${g.montant} ${g.unite}`).join(', ')}</p>
  ),
}))
vi.mock('@/components/ConfettiRain', () => ({ default: () => null }))

import ApercuJoueur from './ApercuJoueur'

const EXERCICE: ExerciceSource = {
  chapitre: '00000000-0000-4000-8000-0000000000aa',
  position: 1,
  etoiles: 1,
  titre: 'Le goûter de la classe',
  competence: 'calculer',
  situation: 'La classe prépare un goûter.',
  documents: [{ id: 'd', type: 'tableau', colonnes: ['Produit', 'Prix'], lignes: [['Jus', '2 €']] }],
  questions: [
    {
      type: 'choix',
      enonce: 'Combien coûte le jus ?',
      options: ['1 €', '2 €', '3 €'],
      reponse: 1,
      ordreFixe: true,
      aide: 'Lis la ligne « Jus ».',
      explication: 'Le jus coûte **2 €**.',
    },
    { type: 'nombre', enonce: 'Et deux jus ?', reponse: 4, unite: '€', aide: 'Double le prix.', explication: '2 × 2 = **4 €**.' },
  ],
}

function monter() {
  const { public: pub, cles } = compilerExercice(EXERCICE)
  render(
    <ApercuJoueur
      exercice={{ id: 'x', position: 1, etoiles: 1, gemmes: 5, xp: 20, contenu: pub }}
      cles={cles}
      retour="/cahier"
      suivant="/cahier/2"
    />,
  )
}

describe('Joueur — un exercice du cahier joué de bout en bout', () => {
  it('coup de pouce au premier raté, correction au second, bilan exact', async () => {
    const u = userEvent.setup()
    monter()
    const q1 = await screen.findByRole('article', { name: 'Question 1' })

    // Premier essai faux : le coup de pouce, pas la réponse.
    await u.click(within(q1).getByRole('button', { name: /1 €/ }))
    await u.click(within(q1).getByRole('button', { name: /Vérifier/ }))
    expect(await within(q1).findByText(/Pas tout à fait/)).toBeTruthy()
    expect(within(q1).getByText(/Lis la ligne/)).toBeTruthy()
    expect(within(q1).queryByText(/Le jus coûte/)).toBeNull()

    // Second essai juste : 1 point, et l'explication.
    await u.click(within(q1).getByRole('button', { name: /2 €/ }))
    await u.click(within(q1).getByRole('button', { name: /Réessayer/ }))
    expect(await within(q1).findByText(/Bien rattrapé/)).toBeTruthy()

    // Question 2 juste du premier coup (virgule ou nombre entier : 4).
    const q2 = screen.getByRole('article', { name: 'Question 2' })
    await u.type(within(q2).getByRole('textbox'), '4')
    await u.click(within(q2).getByRole('button', { name: /Vérifier/ }))
    expect(await within(q2).findByText(/Bravo/)).toBeTruthy()

    // Bilan : 1 + 2 = 3 points sur 4, réussi, les gains du barème ★.
    expect(await screen.findByText(/3 points sur 4/)).toBeTruthy()
    expect(screen.getByText(/Exercice réussi/)).toBeTruthy()
    expect(screen.getByText(/Gains : 5 gemme, 20 xp/)).toBeTruthy()
    expect(screen.getByRole('link', { name: /Exercice suivant/ }).getAttribute('href')).toBe('/cahier/2')
  })

  it('un échec propose de recommencer, sans gains ni exercice suivant', async () => {
    const u = userEvent.setup()
    monter()
    const q1 = await screen.findByRole('article', { name: 'Question 1' })
    // Deux réponses fausses différentes (retoucher la même option la décocherait).
    for (const [option, bouton, attendu] of [
      [/3 €/, /Vérifier/, /Pas tout à fait/],
      [/1 €/, /Réessayer/, /bonne réponse/],
    ] as const) {
      await u.click(within(q1).getByRole('button', { name: option }))
      await u.click(within(q1).getByRole('button', { name: bouton }))
      await within(q1).findByText(attendu)
    }
    const q2 = screen.getByRole('article', { name: 'Question 2' })
    for (const [bouton, attendu] of [[/Vérifier/, /Pas tout à fait/], [/Réessayer/, /bonne réponse/]] as const) {
      await u.clear(within(q2).getByRole('textbox'))
      await u.type(within(q2).getByRole('textbox'), '5')
      await u.click(within(q2).getByRole('button', { name: bouton }))
      await within(q2).findByText(attendu)
    }
    expect(await screen.findByText(/0 point sur 4/)).toBeTruthy()
    expect(screen.getByRole('button', { name: /Recommencer/ })).toBeTruthy()
    expect(screen.queryByText(/Gains/)).toBeNull()
    expect(screen.queryByRole('link', { name: /Exercice suivant/ })).toBeNull()
  })
})
