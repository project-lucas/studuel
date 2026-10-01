import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import ProgrammeMondes from '@/components/reviser/ProgrammeMondes'
import { CLE_FAVORIS } from '@/lib/reviser/favoris'
import type { ChapterRow } from '@/lib/subject-template'

// Déplier une fiche demande ses supports au serveur : ici, personne ne répond.
vi.mock('@/app/reviser/[subject]/supports-actions', () => ({
  chapterSupports: vi.fn(async () => []),
}))

// Next raccorde `history.pushState` à `useSearchParams` ; dans un test, on lit
// simplement l'adresse courante à chaque rendu.
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(window.location.search),
}))

const fiche = (
  id: string,
  title: string,
  theme: string,
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
  ...over,
})

const maths = [
  fiche('a', 'Les puissances', 'Nombres et calculs', { status: 'complete', value: 1, crowns: 3, xpRestant: 0 }),
  fiche('b', 'Les fonctions affines', 'Fonctions', { status: 'en_cours', value: 0.5, crowns: 1, xpRestant: 100 }),
  fiche('c', 'Les probabilités', 'Fonctions'),
  fiche('d', 'Utiliser le théorème de Thalès', 'Espace et géométrie'),
  fiche('e', 'Triangles semblables', 'Espace et géométrie'),
]

const rendre = (chapters: ChapterRow[] = maths) =>
  render(
    <ProgrammeMondes
      chapters={chapters}
      resume={null}
      subjectSlug="maths"
      subjectName="Maths"
      grade="3e"
    />,
  )

const titresDesTuiles = () =>
  [...document.querySelectorAll('[data-etat] .font-heading')].map((e) => e.textContent)

beforeEach(() => {
  window.history.replaceState(null, '', '/reviser/maths')
  window.localStorage.clear()
  Element.prototype.scrollIntoView = vi.fn()
})
afterEach(cleanup)

describe('ProgrammeMondes — la grille', () => {
  it('une tuile par grand thème, dans l’ordre du programme', () => {
    rendre()
    expect(titresDesTuiles()).toEqual(['Nombres et calculs', 'Fonctions', 'Espace et géométrie'])
  })

  it('dit le compte exact de chaque thème', () => {
    rendre()
    const tuile = (titre: string) =>
      screen.getByText(titre).closest('[data-etat]') as HTMLElement
    expect(within(tuile('Nombres et calculs')).getByText('1/1 fiche · Terminé')).toBeTruthy()
    expect(within(tuile('Fonctions')).getByText('0/2 fiches')).toBeTruthy()
    expect(within(tuile('Espace et géométrie')).getByText('2 fiches')).toBeTruthy()
  })

  it('la carte Reprendre annonce l’XP qui reste sur la fiche', () => {
    rendre()
    const carte = screen.getByText('Les fonctions affines').closest('button') as HTMLElement
    expect(within(carte).getByText(/Reprendre · Fiche 1/)).toBeTruthy()
    expect(within(carte).getByText('+100 XP à gagner')).toBeTruthy()
  })

  it('toucher une tuile ouvre son thème dans l’adresse', () => {
    rendre()
    fireEvent.click(screen.getByText('Espace et géométrie'))
    expect(new URLSearchParams(window.location.search).get('theme')).toBe('Espace et géométrie')
    // L'entrée d'historique est marquée : la grille est juste derrière, le
    // chevron n'aura qu'à revenir en arrière — même après un remontage.
    expect((window.history.state as Record<string, unknown>).studuelThemeOuvertIci).toBe(true)
  })
})

describe('ProgrammeMondes — les favoris', () => {
  it('l’étoile épingle le thème en tête et s’en souvient', () => {
    rendre()
    fireEvent.click(screen.getByRole('button', { name: 'Mettre « Espace et géométrie » en favori' }))
    expect(titresDesTuiles()[0]).toBe('Espace et géométrie')
    expect(JSON.parse(window.localStorage.getItem(CLE_FAVORIS) as string)).toEqual({
      'maths|3e': { 'Espace et géométrie': true },
    })
  })

  it('un contrôle annoncé met son thème en favori d’office', () => {
    rendre(
      maths.map((c) =>
        c.id === 'd'
          ? { ...c, examHint: { label: 'Contrôle dans 3 jours', proximity: 'soon' as const } }
          : c,
      ),
    )
    expect(titresDesTuiles()[0]).toBe('Espace et géométrie')
    expect(
      screen.getByRole('button', { name: 'Retirer « Espace et géométrie » des favoris' }),
    ).toBeTruthy()
    // … et l'élève reste libre de l'enlever.
    fireEvent.click(
      screen.getByRole('button', { name: 'Retirer « Espace et géométrie » des favoris' }),
    )
    expect(titresDesTuiles()[0]).toBe('Nombres et calculs')
  })

  it('l’étoile répond même quand le navigateur refuse d’écrire', () => {
    // Navigation privée, stockage plein : le choix ne tiendra pas jusqu'à la
    // prochaine visite, mais l'étoile ne doit pas rester morte sous le doigt.
    const ecrire = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    rendre()
    fireEvent.click(screen.getByRole('button', { name: 'Mettre « Espace et géométrie » en favori' }))
    expect(titresDesTuiles()[0]).toBe('Espace et géométrie')
    expect(window.localStorage.getItem(CLE_FAVORIS)).toBeNull()

    // Le stockage revient : l'écriture suivante repart du disque (et rend la
    // mémoire de secours aux tests suivants).
    ecrire.mockRestore()
    fireEvent.click(screen.getByRole('button', { name: 'Retirer « Espace et géométrie » des favoris' }))
    expect(titresDesTuiles()[0]).toBe('Nombres et calculs')
    expect(window.localStorage.getItem(CLE_FAVORIS)).not.toBeNull()
  })
})

describe('ProgrammeMondes — un thème ouvert', () => {
  it('montre ses fiches, et le quiz du chapitre fermé dit ce qui manque', () => {
    window.history.replaceState(null, '', '/reviser/maths?theme=Fonctions')
    rendre()
    expect(screen.getByRole('heading', { name: 'Fonctions' })).toBeTruthy()
    expect(screen.getByText('Les fonctions affines')).toBeTruthy()
    expect(screen.getByText('Les probabilités')).toBeTruthy()
    expect(screen.queryByText('Utiliser le théorème de Thalès')).toBeNull()
    expect(screen.getByText(/Encore 2 fiches à tester/)).toBeTruthy()
  })

  it('ouvert par un lien : le chevron retire le thème de l’adresse, sans revenir en arrière', () => {
    window.history.replaceState(null, '', '/reviser/maths?theme=Fonctions&onglet=programme')
    const retour = vi.spyOn(window.history, 'back')
    rendre()
    fireEvent.click(screen.getByRole('button', { name: 'Tous les chapitres' }))
    expect(retour).not.toHaveBeenCalled()
    expect(window.location.search).toBe('?onglet=programme')
    retour.mockRestore()
  })

  it('ouvert depuis la grille : le chevron revient simplement en arrière', () => {
    window.history.replaceState(
      { studuelThemeOuvertIci: true },
      '',
      '/reviser/maths?theme=Fonctions',
    )
    const retour = vi.spyOn(window.history, 'back').mockImplementation(() => {})
    rendre()
    fireEvent.click(screen.getByRole('button', { name: 'Tous les chapitres' }))
    expect(retour).toHaveBeenCalledTimes(1)
    retour.mockRestore()
  })

  it('un thème inconnu dans l’adresse retombe sur la grille', () => {
    window.history.replaceState(null, '', '/reviser/maths?theme=Inconnu')
    rendre()
    expect(titresDesTuiles()).toHaveLength(3)
  })
})

describe('ProgrammeMondes — la recherche', () => {
  it('la loupe cherche dans toutes les fiches, rangées sous leur thème', () => {
    rendre()
    fireEvent.click(screen.getByRole('button', { name: 'Chercher un chapitre en Maths' }))
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'thales' } })
    expect(screen.getByText('1 fiche trouvée')).toBeTruthy()
    expect(screen.getByText('Utiliser le théorème de Thalès')).toBeTruthy()
    expect(screen.queryByText('Les probabilités')).toBeNull()
  })
})
