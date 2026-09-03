import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
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
vi.mock('@/lib/sounds', () => ({ sfx: { tap: vi.fn() } }))
vi.mock('@/lib/toast', () => ({ toast: vi.fn() }))
vi.mock('@/app/reviser/actions', () => ({ saveSelectedSubjects: vi.fn() }))
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
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
