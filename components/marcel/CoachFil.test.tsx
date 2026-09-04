import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import type { DemandeResult } from '@/app/marcel/actions'

// LE FIL — ce qui se passe entre le moment où l'élève appuie sur la flèche et
// celui où Marcel répond.
//
// Deux défauts possibles, et ils se voient tous les deux à l'écran :
//   · la question qui n'apparaît PAS tout de suite (on tape, tout disparaît, et
//     il ne se passe rien pendant trois secondes : on croit avoir raté le
//     bouton, et on renvoie) ;
//   · la question qui RESTE alors que le serveur a refusé (quota épuisé, panne)
//     — elle se lit alors comme un message perdu, sans réponse, pour toujours.

const demanderAMarcel = vi.fn<(...args: unknown[]) => Promise<DemandeResult>>()
const chargerConversation = vi.fn()

vi.mock('@/app/marcel/actions', () => ({
  demanderAMarcel: (...args: unknown[]) => demanderAMarcel(...args),
}))
vi.mock('@/app/marcel/conversations-actions', () => ({
  chargerConversation: (...args: unknown[]) => chargerConversation(...args),
}))

import { CoachFilProvider, useCoachFil } from '@/components/marcel/CoachFil'

function Sonde() {
  const { id, messages, envoyer, rangeable } = useCoachFil()
  return (
    <div>
      <button type="button" onClick={() => void envoyer('Les fractions ?', 'maths')}>
        envoyer
      </button>
      <ul data-testid="fil">
        {messages.map((m) => (
          <li key={m.id}>{`${m.role} · ${m.texte}`}</li>
        ))}
      </ul>
      <p data-testid="id">{id ?? 'aucun'}</p>
      <p data-testid="rangeable">{rangeable ? 'oui' : 'non'}</p>
    </div>
  )
}

const lignes = () =>
  [...screen.getByTestId('fil').querySelectorAll('li')].map((li) => li.textContent)

beforeEach(() => {
  vi.clearAllMocks()
})

describe('le fil du coach', () => {
  it('affiche la question AVANT la réponse, puis la réponse', async () => {
    let repondre: (res: DemandeResult) => void = () => {}
    demanderAMarcel.mockReturnValue(
      new Promise<DemandeResult>((resolve) => {
        repondre = resolve
      }),
    )

    render(
      <CoachFilProvider>
        <Sonde />
      </CoachFilProvider>,
    )

    await act(async () => {
      screen.getByText('envoyer').click()
    })

    // Le serveur n'a pas encore répondu : la question est déjà là.
    expect(lignes()).toEqual(['eleve · Les fractions ?'])

    await act(async () => {
      repondre({
        ok: true,
        reponse: 'Commence par le dénominateur.',
        conversationId: 'fil-1',
        titre: 'Les fractions ?',
      })
    })

    expect(lignes()).toEqual([
      'eleve · Les fractions ?',
      'marcel · Commence par le dénominateur.',
    ])
    expect(screen.getByTestId('id').textContent).toBe('fil-1')
    // Le fil a un échange complet : il y a quelque chose à ranger dans le carnet.
    expect(screen.getByTestId('rangeable').textContent).toBe('oui')
  })

  it('retire la question quand le serveur refuse', async () => {
    demanderAMarcel.mockResolvedValue({ ok: false, quota: true })

    render(
      <CoachFilProvider>
        <Sonde />
      </CoachFilProvider>,
    )

    await act(async () => {
      screen.getByText('envoyer').click()
    })

    expect(lignes()).toEqual([])
    expect(screen.getByTestId('id').textContent).toBe('aucun')
  })

  it('rattache la deuxième question au fil ouvert par la première', async () => {
    demanderAMarcel.mockResolvedValue({
      ok: true,
      reponse: 'Commence par le dénominateur.',
      conversationId: 'fil-1',
    })

    render(
      <CoachFilProvider>
        <Sonde />
      </CoachFilProvider>,
    )

    await act(async () => {
      screen.getByText('envoyer').click()
    })
    await act(async () => {
      screen.getByText('envoyer').click()
    })

    // Sans ce rattachement, chaque question ouvrirait un fil neuf : l'historique
    // se remplirait de lignes d'un seul message, et « explique autrement »
    // n'aurait toujours aucun « quoi ».
    expect(demanderAMarcel).toHaveBeenNthCalledWith(1, 'Les fractions ?', 'maths', null, {
      mode: 'question',
      piece: null,
    })
    expect(demanderAMarcel).toHaveBeenNthCalledWith(
      2,
      'Les fractions ?',
      'maths',
      'fil-1',
      { mode: 'question', piece: null },
    )
  })

  it('ne garde pas une réponse vide (fil sans rien à ranger)', async () => {
    demanderAMarcel.mockResolvedValue({ ok: true, conversationId: 'fil-1' })

    render(
      <CoachFilProvider>
        <Sonde />
      </CoachFilProvider>,
    )

    await act(async () => {
      screen.getByText('envoyer').click()
    })

    expect(lignes()).toEqual([])
    expect(screen.getByTestId('rangeable').textContent).toBe('non')
  })
})
