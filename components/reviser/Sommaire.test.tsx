import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import Sommaire from '@/components/reviser/Sommaire'
import type { ChapterRow } from '@/lib/subject-template'

// Déplier une fiche demande ses supports au serveur : ici, personne ne répond.
vi.mock('@/app/reviser/[subject]/supports-actions', () => ({
  chapterSupports: vi.fn(async () => []),
}))

const prefetch = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ prefetch }),
}))

const fiche = (
  id: string,
  title: string,
  theme: string | null,
  over: Partial<ChapterRow> = {},
): ChapterRow => ({
  id,
  position: 1,
  title,
  status: 'non_commence',
  value: 0,
  crowns: 0,
  href: `/reviser/maths/${id}`,
  examHint: null,
  minutes: 6,
  theme,
  discipline: null,
  aQuiz: true,
  quizTeste: false,
  xpRestant: 135,
  suite: { genre: 'cours', label: 'Cours', href: `/reviser/maths/${id}/lecon/cours` },
  ...over,
})

const maths = [
  fiche('a', 'Les puissances', 'Nombres et calculs', {
    status: 'complete',
    value: 1,
    crowns: 3,
    xpRestant: 0,
    suite: { genre: 'revoir', label: 'Revoir', href: '/reviser/maths/a/lecon/cours' },
  }),
  fiche('b', 'Les fonctions affines', 'Fonctions', {
    status: 'en_cours',
    value: 0.5,
    crowns: 1,
    xpRestant: 100,
    suite: { genre: 'quiz', label: 'Quiz', href: '/test/quiz-b' },
  }),
  fiche('c', 'Les probabilités', 'Fonctions'),
  fiche('d', 'Utiliser le théorème de Thalès', 'Espace et géométrie'),
  fiche('e', 'Triangles semblables', 'Espace et géométrie'),
]

const rendre = (
  chapters: ChapterRow[] = maths,
  props: Partial<React.ComponentProps<typeof Sommaire>> = {},
) =>
  render(
    <Sommaire
      chapters={chapters}
      resume={null}
      subjectSlug="maths"
      subjectName="Maths"
      grade="3e"
      {...props}
    />,
  )

/** Les titres des thèmes, dans l'ordre de l'écran. */
const themes = () =>
  screen
    .getAllByRole('button', { expanded: undefined })
    .filter((b) => b.getAttribute('aria-controls')?.startsWith('theme-'))
    .map((b) => b.textContent)
const theme = (titre: string) =>
  screen
    .getAllByRole('button')
    .find((b) => b.getAttribute('aria-controls')?.startsWith('theme-') && b.textContent?.includes(titre))!

beforeEach(() => {
  window.localStorage.clear()
  prefetch.mockClear()
})

describe('Sommaire — les fiches se lisent tout de suite', () => {
  it('le thème de la fiche à reprendre est déjà ouvert, les autres fermés', () => {
    rendre()
    expect(theme('Fonctions')).toHaveAttribute('aria-expanded', 'true')
    expect(theme('Nombres et calculs')).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText('Les fonctions affines')).toBeInTheDocument()
    expect(screen.queryByText('Les puissances')).not.toBeInTheDocument()
  })

  it('chaque fiche porte un lien DIRECT vers sa suite : son cours, ou son quiz', () => {
    rendre()
    expect(screen.getByRole('link', { name: 'Quiz — Les fonctions affines' })).toHaveAttribute(
      'href',
      '/test/quiz-b',
    )
    expect(screen.getByRole('link', { name: 'Cours — Les probabilités' })).toHaveAttribute(
      'href',
      '/reviser/maths/c/lecon/cours',
    )
  })

  it('la fiche à reprendre porte la plaque pleine, et dit ce qu’elle rapporte', () => {
    rendre()
    expect(screen.getByRole('link', { name: 'Quiz — Les fonctions affines' })).toHaveAttribute(
      'data-suite',
    )
    expect(screen.getByRole('link', { name: 'Cours — Les probabilités' })).not.toHaveAttribute(
      'data-suite',
    )
    expect(screen.getByText('+100 XP')).toBeInTheDocument()
  })

  it('une fiche sans leçon n’a pas de bouton', () => {
    rendre([fiche('a', 'Vide', 'T1', { suite: null }), fiche('b', 'Pleine', 'T2')])
    expect(screen.queryByRole('link', { name: /Vide/ })).not.toBeInTheDocument()
  })

  it('le doigt posé sur un bouton précharge SA page, et aucune autre', () => {
    rendre()
    expect(prefetch).not.toHaveBeenCalled()
    fireEvent.pointerDown(screen.getByRole('link', { name: 'Cours — Les probabilités' }))
    expect(prefetch).toHaveBeenCalledTimes(1)
    expect(prefetch).toHaveBeenCalledWith('/reviser/maths/c/lecon/cours')
  })
})

describe('Sommaire — les thèmes', () => {
  it('un thème s’ouvre SUR PLACE, sans refermer les autres', () => {
    const onTheme = vi.fn()
    rendre(maths, { onTheme })
    fireEvent.click(theme('Espace et géométrie'))
    expect(theme('Espace et géométrie')).toHaveAttribute('aria-expanded', 'true')
    expect(theme('Fonctions')).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Triangles semblables')).toBeInTheDocument()
    expect(onTheme).toHaveBeenLastCalledWith('Espace et géométrie')
  })

  it('le replier le dit à la page', () => {
    const onTheme = vi.fn()
    rendre(maths, { onTheme })
    fireEvent.click(theme('Fonctions'))
    expect(theme('Fonctions')).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('Les fonctions affines')).not.toBeInTheDocument()
    expect(onTheme).toHaveBeenLastCalledWith(null)
  })

  it('le thème demandé par l’adresse est ouvert à l’arrivée', () => {
    rendre(maths, { themeOuvert: 'Espace et géométrie' })
    expect(theme('Espace et géométrie')).toHaveAttribute('aria-expanded', 'true')
    expect(theme('Fonctions')).toHaveAttribute('aria-expanded', 'false')
  })

  it('un contrôle annoncé fait passer son thème en tête, ouvert et cerclé', () => {
    rendre(
      maths.map((c) =>
        c.id === 'd'
          ? { ...c, examHint: { label: 'Contrôle dans 3 jours', proximity: 'soon' as const } }
          : c,
      ),
    )
    expect(themes()[0]).toContain('Espace et géométrie')
    expect(theme('Espace et géométrie')).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('region', { name: 'Espace et géométrie' })).toHaveAttribute('data-presse')
    expect(screen.getAllByText(/Contrôle dans 3 jours/).length).toBeGreaterThan(0)
  })

  it('l’étoile épingle un thème en tête, et s’en souvient', () => {
    const { unmount } = rendre()
    fireEvent.click(screen.getByRole('button', { name: 'Mettre « Espace et géométrie » en favori' }))
    expect(themes()[0]).toContain('Espace et géométrie')
    unmount()
    rendre()
    expect(themes()[0]).toContain('Espace et géométrie')
  })

  it('le titre d’un thème n’est jamais coupé, si long soit-il', () => {
    const long = 'Vivre en société, participer à la société — Dénoncer les travers de la société'
    rendre([fiche('a', 'Fiche', long), fiche('b', 'Autre', 'Second thème')])
    expect(screen.getByText(long)).toBeInTheDocument()
  })

  it('le quiz du chapitre dit ce qu’il reste à tester tant qu’il est fermé', () => {
    rendre()
    expect(screen.getByText(/Encore 2 fiches à tester/)).toBeInTheDocument()
  })

  it('il s’ouvre quand chaque fiche a été testée', () => {
    rendre(maths.map((c) => ({ ...c, quizTeste: true })))
    expect(screen.getByRole('link', { name: 'Quiz du chapitre' })).toHaveAttribute(
      'href',
      expect.stringContaining('/reviser/examen-blanc'),
    )
  })
})

describe('Sommaire — une fiche se déplie', () => {
  it('toucher la ligne montre ses supports, sans quitter la liste', async () => {
    rendre()
    const ligne = screen.getByRole('button', { name: /Les probabilités/ })
    expect(ligne).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(ligne)
    expect(ligne).toHaveAttribute('aria-expanded', 'true')
    expect(await screen.findByText('Cette fiche n’a pas encore de contenu.')).toBeInTheDocument()
  })
})

describe('Sommaire — la recherche amarrée', () => {
  const beaucoup = Array.from({ length: 9 }, (_, i) =>
    fiche(`f${i}`, i === 7 ? 'Le théorème de Pythagore' : `Fiche numéro ${i}`, i < 5 ? 'Thème un' : 'Thème deux', {
      position: i + 1,
    }),
  )

  it('sous huit fiches, il n’y a rien à chercher', () => {
    rendre()
    expect(screen.queryByRole('button', { name: /Chercher/ })).not.toBeInTheDocument()
  })

  it('sans rayons, la rangée entière est le champ', () => {
    rendre(beaucoup)
    fireEvent.click(screen.getByRole('button', { name: 'Chercher une fiche…' }))
    expect(screen.getByRole('textbox', { name: 'Chercher dans Maths' })).toHaveFocus()
  })

  it('avec des rayons, la loupe est à côté d’eux', () => {
    rendre(beaucoup, { rayons: <nav aria-label="Les rayons du cours">rayons</nav> })
    expect(screen.getByRole('navigation', { name: 'Les rayons du cours' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Chercher dans Maths' })).toBeInTheDocument()
  })

  it('elle trouve une fiche fermée dans son thème, la nomme et garde son bouton', () => {
    rendre(beaucoup)
    fireEvent.click(screen.getByRole('button', { name: 'Chercher une fiche…' }))
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'pythagore' } })
    expect(screen.getByRole('status')).toHaveTextContent('1 fiche trouvée')
    const resultats = screen.getByRole('region', { name: 'Résultats de la recherche' })
    expect(within(resultats).getByText('Le théorème de Pythagore')).toBeInTheDocument()
    expect(within(resultats).getByText('Thème deux')).toBeInTheDocument()
    expect(
      within(resultats).getByRole('link', { name: 'Cours — Le théorème de Pythagore' }),
    ).toHaveAttribute('href', '/reviser/maths/f7/lecon/cours')
  })

  it('rien trouvé : elle le dit ; fermée : le sommaire revient', () => {
    rendre(beaucoup)
    fireEvent.click(screen.getByRole('button', { name: 'Chercher une fiche…' }))
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'zzz' } })
    expect(screen.getByRole('status')).toHaveTextContent('Rien pour « zzz »')
    fireEvent.click(screen.getByRole('button', { name: 'Fermer la recherche' }))
    expect(theme('Thème un')).toBeInTheDocument()
  })
})

describe('Sommaire — un programme qui n’est pas rangé', () => {
  const notions = ['La conscience', 'Le bonheur', 'La liberté'].map((titre, i) =>
    fiche(`n${i}`, titre, null, { position: i + 1 }),
  )

  it('une liste à plat : la même ligne, le même bouton, pas de thème à ouvrir', () => {
    rendre(notions)
    expect(screen.getByText('Le bonheur')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Cours — Le bonheur' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /favori/ })).not.toBeInTheDocument()
  })

  it('les fiches sont numérotées… sauf en philosophie, dont les notions n’ont pas d’ordre', () => {
    const { unmount } = rendre(notions)
    expect(screen.getByRole('button', { name: /La liberté/ })).toHaveTextContent('3')
    unmount()
    rendre(notions, { subjectSlug: 'philosophie' })
    expect(screen.getByRole('button', { name: /La liberté/ })).not.toHaveTextContent('3')
  })

  it('un programme vide le dit', () => {
    rendre([])
    expect(screen.getByText('Le programme de Maths en 3e arrive bientôt.')).toBeInTheDocument()
  })
})
