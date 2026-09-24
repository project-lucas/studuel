import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import type { Subject } from '@/lib/types'

// LE DOSSIER D'UNE MATIÈRE OÙ UN GARDIEN EST SORTI.
//
// Ce que ce fichier garde ne se voit qu'à l'assemblage : la carte prend
// l'écarlate, la pastille NOMME le gardien, et elle égrène le temps qu'il reste
// avant qu'il ne se recouche. Le calcul (`gardiensSortis`) est testé à part,
// pur ; ici on vérifie qu'il arrive bien à l'écran — et qu'il en repart quand
// la fenêtre se referme sous les yeux de l'élève.

// Le routeur Next n'est pas monté dans un rendu de test : la grille s'en sert
// pour précharger les dossiers (PrechargeurDossiers, et le doigt qui se pose).
vi.mock('next/navigation', () => ({
  useRouter: () => ({ prefetch: vi.fn(), push: vi.fn() }),
  usePathname: () => '/reviser',
}))
// `press` compris : « Terminé » et « Choisir mes matières » sont des `Button`,
// qui jouent le clic eux-mêmes. Sans lui dans le mock, le clic jette et le
// mode ne se referme jamais — le symptôme ressemble à un bug d'interface.
vi.mock('@/lib/sounds', () => ({ sfx: { tap: vi.fn() }, press: vi.fn() }))
vi.mock('@/lib/toast', () => ({ toast: vi.fn() }))
const saveMatieresPrioritaires = vi.fn<(slugs: string[]) => Promise<void>>(
  async () => {},
)
vi.mock('@/app/reviser/actions', () => ({
  saveSelectedSubjects: vi.fn(),
  saveMatieresPrioritaires: (slugs: string[]) =>
    saveMatieresPrioritaires(slugs),
}))
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode
    href: string
  }) => <a href={href}>{children}</a>,
}))

import SubjectsHome from '@/components/SubjectsHome'

const ANGLAIS: Subject = {
  id: 's1',
  name: 'Anglais',
  slug: 'anglais',
  color: 'blue',
  levels: ['3e'],
} as unknown as Subject

const MAINTENANT = Date.UTC(2026, 8, 1, 12, 0, 0)
const MINUTE = 60 * 1000

const rendre = (gardiens = {}) =>
  render(
    <SubjectsHome
      subjects={[ANGLAIS]}
      selected={['anglais']}
      prioritaires={[]}
      grade="3e"
      progressBySlug={{ anglais: 40 }}
      gardiens={gardiens}
    />,
  )

/** La carte de la matière — c'est elle qui porte (ou non) l'écarlate. */
const carte = () => {
  const el = screen.getByText('Anglais').closest('.rev-card')
  if (!el) throw new Error('carte introuvable')
  return el
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(MAINTENANT)
})

afterEach(() => {
  vi.useRealTimers()
})

describe('le dossier d’un gardien sorti', () => {
  it('reste blanc quand aucun gardien n’est sorti', () => {
    rendre()
    expect(carte().className).not.toContain('traque-eclair')
    expect(screen.queryByText(/Big Ben/)).not.toBeInTheDocument()
  })

  it('passe à l’écarlate et NOMME le gardien', () => {
    rendre({ anglais: { boss: 'Big Ben', endsAt: MAINTENANT + 38 * MINUTE } })
    expect(carte().className).toContain('traque-eclair')
    expect(screen.getByText('Big Ben')).toBeInTheDocument()
    // La couleur ne porte jamais seule : le lecteur d'écran l'entend aussi.
    expect(screen.getByText('Gardien sorti :')).toBeInTheDocument()
  })

  it('égrène le temps qu’il reste avant qu’il se recouche', () => {
    // Le dossier écarlate disait qu'il se passait quelque chose, pas qu'il y
    // avait URGENCE. Un gardien ne reste sorti qu'une heure.
    rendre({ anglais: { boss: 'Big Ben', endsAt: MAINTENANT + 38 * MINUTE } })
    expect(screen.getByText(/38 min/)).toBeInTheDocument()
  })

  it('RESTE ÉCARLATE TOUTE L’HEURE, jusqu’à la dernière minute', () => {
    // LA RÈGLE : un gardien sorti tient une heure pleine sur le dossier de sa
    // matière, parce que c'est le temps que l'élève a pour l'affronter. On la
    // vérifie ICI, à l'écran, et pas seulement dans le calcul : le dossier
    // dépend aussi de l'horloge du client, qui pourrait l'éteindre trop tôt.
    for (const restant of [59, 30, 15, 1]) {
      const { unmount } = rendre({
        anglais: { boss: 'Big Ben', endsAt: MAINTENANT + restant * MINUTE },
      })
      expect(carte().className, `à ${restant} min de la fin`).toContain(
        'traque-eclair',
      )
      unmount()
    }
  })

  it('S’ÉTEINT quand la fenêtre se referme sous les yeux de l’élève', () => {
    // La page est rendue une fois ; la fenêtre, elle, court. Sans garde-fou, le
    // dossier resterait écarlate au-dessus d'un combat que le serveur
    // refuserait — une promesse en l'air.
    rendre({ anglais: { boss: 'Big Ben', endsAt: MAINTENANT - MINUTE } })
    expect(carte().className).not.toContain('traque-eclair')
    expect(screen.queryByText('Big Ben')).not.toBeInTheDocument()
  })

  it('appelle l’œil par un halo, jamais par la seule couleur', () => {
    rendre({ anglais: { boss: 'Big Ben', endsAt: MAINTENANT + 38 * MINUTE } })
    const pastille = screen.getByText('Big Ben').closest('span')?.parentElement
    expect(pastille?.className).toContain('gardien-pouls')
  })
})

// L'ÉTOILE SUR CHAQUE DOSSIER DE MATIÈRE (15/09/2026).
//
// Ce qui se garde ici : chaque carte porte une étoile, un tap la remplit et
// fait passer la matière EN TÊTE, un filet la sépare des autres, et le choix
// part en base. L'ordre (`separerPrioritaires`) est testé à part, pur.
const MATHS: Subject = {
  id: 's2',
  name: 'Maths',
  slug: 'maths',
  color: 'purple',
  levels: ['3e'],
} as unknown as Subject

describe('l’étoile des matières prioritaires', () => {
  it('hors du mode « prioriser », les cartes sont des liens nus — pas de loupe, une étoile dans la barre', () => {
    render(
      <SubjectsHome
        subjects={[ANGLAIS, MATHS]}
        selected={['anglais', 'maths']}
        prioritaires={[]}
        grade="3e"
        progressBySlug={{}}
      />,
    )
    expect(
      screen.getByRole('button', { name: 'Prioriser mes matières' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Rechercher dans le programme' }),
    ).toBeNull()
    expect(screen.queryByRole('checkbox')).toBeNull()
    expect(document.querySelector('hr')).toBeNull()
  })

  it('en mode « prioriser », un tap sur la carte l’étoile, la met en tête, pose le filet et enregistre', async () => {
    const { container } = render(
      <SubjectsHome
        subjects={[ANGLAIS, MATHS]}
        selected={['anglais', 'maths']}
        prioritaires={[]}
        grade="3e"
        progressBySlug={{}}
      />,
    )
    act(() => {
      screen.getByRole('button', { name: 'Prioriser mes matières' }).click()
    })
    expect(
      screen.getByRole('checkbox', { name: 'Maths : prioritaire' }),
    ).toHaveAttribute('aria-checked', 'false')
    act(() => {
      screen.getByRole('checkbox', { name: 'Maths : prioritaire' }).click()
    })
    expect(
      screen.getByRole('checkbox', { name: 'Maths : prioritaire' }),
    ).toHaveAttribute('aria-checked', 'true')
    // Maths passe DEVANT Anglais, et un filet les sépare.
    const noms = [...container.querySelectorAll('.rev-card')].map((c) =>
      c.textContent?.slice(0, 7),
    )
    expect(noms[0]).toContain('Maths')
    expect(noms[1]).toContain('Anglais')
    expect(container.querySelector('hr')).not.toBeNull()
    await act(async () => {
      await Promise.resolve()
    })
    expect(saveMatieresPrioritaires).toHaveBeenCalledWith(['maths'])
    // « Terminé » referme le mode : les cartes redeviennent des liens.
    act(() => {
      screen.getByRole('button', { name: 'Terminé' }).click()
    })
    expect(screen.queryByRole('checkbox')).toBeNull()
    expect(screen.getByRole('link', { name: /Maths/ })).toBeInTheDocument()
  })

  it('les matières déjà étoilées en base arrivent en tête', () => {
    const { container } = render(
      <SubjectsHome
        subjects={[ANGLAIS, MATHS]}
        selected={['anglais', 'maths']}
        prioritaires={['maths']}
        grade="3e"
        progressBySlug={{}}
      />,
    )
    const noms = [...container.querySelectorAll('.rev-card')].map(
      (c) => c.textContent ?? '',
    )
    expect(noms[0]).toContain('Maths')
    expect(container.querySelector('hr')).not.toBeNull()
  })
})
