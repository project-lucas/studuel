import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import SubjectTemplate from '@/components/reviser/SubjectTemplate'
import { amorcerCahier, viderCahiers } from '@/components/reviser/useCahierMatiere'
import { construireCahierMatiere } from '@/lib/exercices/cahier-matiere'
import {
  subjectProgress,
  type ChapterRow,
  type SubjectProgress,
  type SubjectTemplateData,
} from '@/lib/subject-template'

// Les supports d'une fiche se lisent par la route /api/reviser/supports
// (12/10/2026) : une réponse vide suffit au dossier.
vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => [] })))

const router = { push: vi.fn(), prefetch: vi.fn(), back: vi.fn() }
vi.mock('next/navigation', () => ({
  useRouter: () => router,
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
  href: `/reviser/francais/${id}`,
  examHint: null,
  minutes: 8,
  theme,
  discipline: null,
  aQuiz: true,
  quizTeste: false,
  xpRestant: 140,
  suite: { genre: 'cours', label: 'Cours', href: `/reviser/francais/${id}/lecon/cours` },
  ...over,
})

const dossier = (
  chapters: ChapterRow[],
  over: Partial<SubjectTemplateData> = {},
): SubjectTemplateData => {
  const parRayon: Record<string, SubjectProgress> = {}
  for (const c of chapters) {
    if (!c.discipline) continue
    parRayon[c.discipline] = subjectProgress(
      chapters.filter((x) => x.discipline === c.discipline).map((x) => x.value),
    )
  }
  return {
    subject: { slug: 'francais', name: 'Français', color: 'red' },
    premium: false,
    grade: '1re',
    gradeLevel: '1re',
    standing: null,
    progress: subjectProgress(chapters.map((c) => c.value)),
    progressByDiscipline: parRayon,
    resume: null,
    examOnTop: false,
    weakCount: 0,
    chapters,
    bossPool: [],
    gardien: null,
    papers: [],
    annalesCorrigees: [],
    cahier: { total: 6 },
    themeOuvert: null,
    ...over,
  }
}

const simple = [
  fiche('a', 'Rimbaud, Cahier de Douai', 'La poésie'),
  fiche('b', 'Musset, On ne badine pas avec l’amour', 'Le théâtre'),
]

/** Le français de 1re : deux rayons. */
const rayons = [
  fiche('a', 'Rimbaud, Cahier de Douai', 'La poésie', { discipline: 'programme' }),
  fiche('b', 'Musset, On ne badine pas avec l’amour', 'Le théâtre', { discipline: 'programme' }),
  fiche('c', 'Candide, Voltaire', 'Fiches de lecture', { discipline: 'fiches' }),
]

const porte = (nom: string | RegExp) =>
  within(screen.getByRole('navigation', { name: 'Les portes du dossier' })).getByRole('button', {
    name: nom,
  })

beforeEach(() => {
  window.history.replaceState(null, '', '/reviser/francais')
  window.localStorage.clear()
  viderCahiers()
  router.push.mockClear()
  router.prefetch.mockClear()
  // Sans réseau : une relecture du cahier échoue, ce qui est déjà affiché reste.
  vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 401 })))
  // jsdom n'a pas d'IntersectionObserver : la barre collante reste repliée.
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      observe() {}
      disconnect() {}
    },
  )
})

describe('SubjectTemplate — la bannière', () => {
  it('porte le nom de la matière, son compte exact et sa teinte', () => {
    render(<SubjectTemplate data={dossier(simple)} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Français' })).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: /Français/ })).toHaveTextContent('0/2 fiches')
    expect(screen.getByRole('banner')).toHaveAttribute('data-teinte', 'rose')
  })

  it('« Commencer » mène DROIT au cours de la fiche, sans passer par la liste', () => {
    render(<SubjectTemplate data={dossier(simple)} />)
    const cta = screen.getByRole('link', { name: /Commencer.*Rimbaud, Cahier de Douai/ })
    expect(cta).toHaveAttribute('href', '/reviser/francais/a/lecon/cours')
    expect(cta).toHaveTextContent('+140 XP à gagner')
  })

  it('tout est terminé : plus de bouton, la plaque le dit', () => {
    const finies = simple.map((c) => ({ ...c, status: 'complete' as const, value: 1, crowns: 3 }))
    render(<SubjectTemplate data={dossier(finies)} />)
    expect(screen.getByText('Programme terminé')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Commencer|Reprendre/ })).not.toBeInTheDocument()
  })

  it('Marcel est amarré dans l’en-tête, avec la matière sous le bras', () => {
    render(<SubjectTemplate data={dossier(simple)} />)
    const marcel = within(screen.getByRole('banner')).getByRole('link', {
      name: 'Demander à Marcel, ton coach',
    })
    expect(marcel).toHaveAttribute('href', '/marcel?matiere=francais')
  })
})

describe('SubjectTemplate — les portes', () => {
  it('Programme · Cahier d’exercices · Jeux · Annales, Programme ouverte, rien sous les noms', () => {
    render(<SubjectTemplate data={dossier(simple)} />)
    const portes = within(
      screen.getByRole('navigation', { name: 'Les portes du dossier' }),
    ).getAllByRole('button')
    expect(portes.map((p) => p.textContent)).toEqual([
      'Programme',
      'Cahier d’exercices (Studuel+)',
      expect.stringMatching(/^Jeux/),
      expect.stringMatching(/^Annales/),
    ])
    expect(porte(/^Programme/)).toHaveAttribute('aria-current', 'page')
  })

  it('une matière sans cahier n’a pas de porte Cahier d’exercices', () => {
    render(<SubjectTemplate data={dossier(simple, { cahier: null })} />)
    expect(
      within(screen.getByRole('navigation', { name: 'Les portes du dossier' })).queryByRole('button', {
        name: /Cahier d’exercices/,
      }),
    ).not.toBeInTheDocument()
  })

  it('un abonné ne voit pas la couronne', () => {
    render(<SubjectTemplate data={dossier(simple, { premium: true })} />)
    expect(porte(/^Cahier d’exercices/)).not.toHaveTextContent('Studuel+')
  })

  it('la porte Cahier d’exercices ouvre le cahier de la matière, avec son marque-page', () => {
    amorcerCahier(
      'francais',
      construireCahierMatiere({
        matiere: 'francais',
        chapitres: simple.map((c) => ({ id: c.id, titre: c.title, theme: c.theme })),
        exercices: simple.flatMap((c) =>
          ([1, 2, 3] as const).map((position) => ({
            id: `${c.id}-${position}`,
            chapitreId: c.id,
            position,
            etoiles: position,
            titre: `Exercice ${position}`,
          })),
        ),
        reussis: new Set(['a-1']),
      }),
    )
    render(<SubjectTemplate data={dossier(simple)} />)
    fireEvent.click(porte(/^Cahier d’exercices/))

    expect(porte(/^Cahier d’exercices/)).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('heading', { name: 'Cahier d’exercices' })).toBeInTheDocument()
    expect(screen.getByText('Ton marque-page · page 2 sur 6')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ouvrir' })).toHaveAttribute(
      'href',
      '/reviser/francais/a/exercice/2',
    )
    const manuels = screen.getByRole('list', { name: 'Les manuels de Français' })
    expect(within(manuels).getAllByRole('link')).toHaveLength(2)
    // L'adresse suit la porte, sans empiler d'historique.
    expect(window.location.search).toBe('?onglet=exercices')
  })

  it('le doigt posé sur Cahier d’exercices lance déjà la lecture du cahier', () => {
    render(<SubjectTemplate data={dossier(simple)} />)
    // (La fiche à reprendre prépare SES supports dès l'affichage : ce n'est
    // pas le cahier.)
    expect(fetch).not.toHaveBeenCalledWith(expect.stringContaining('/api/reviser/cahier'), expect.anything())
    fireEvent.pointerDown(porte(/^Cahier d’exercices/))
    expect(fetch).toHaveBeenCalledWith(
      '/api/reviser/cahier?matiere=francais',
      expect.anything(),
    )
  })

  it('l’adresse rouvre la porte à l’arrivée', () => {
    render(<SubjectTemplate data={dossier(simple)} initialMode="jeu" />)
    expect(porte(/^Jeux/)).toHaveAttribute('aria-current', 'page')
  })
})

describe('SubjectTemplate — les rayons de la porte Programme', () => {
  it('le segment range les rayons ; la bannière compte ceux du rayon ouvert', () => {
    render(<SubjectTemplate data={dossier(rayons)} />)
    const segment = screen.getByRole('navigation', { name: 'Les rayons du cours' })
    expect(within(segment).getAllByRole('button').map((b) => b.textContent)).toEqual([
      'Programme',
      'Fiches',
    ])
    expect(screen.getByRole('progressbar', { name: /Programme/ })).toHaveTextContent('0/2 fiches')

    fireEvent.click(within(segment).getByRole('button', { name: 'Fiches' }))
    expect(screen.getByRole('progressbar', { name: /Fiches/ })).toHaveTextContent('0/1 fiches')
    expect(screen.getByRole('button', { name: 'Déplier — Candide, Voltaire' })).toBeInTheDocument()
    expect(window.location.search).toBe('?onglet=programme%3Afiches')
  })

  it('revenir à Programme rouvre le rayon quitté', () => {
    render(<SubjectTemplate data={dossier(rayons)} initialMode="programme:fiches" />)
    fireEvent.click(porte(/^Jeux/))
    fireEvent.click(porte(/^Programme/))
    expect(screen.getByRole('button', { name: 'Déplier — Candide, Voltaire' })).toBeInTheDocument()
  })

  it('l’encyclopédie est un rayon qui mène à sa page', () => {
    const histoireGeo = dossier(
      [
        fiche('a', 'La Première Guerre mondiale', 'Guerres totales', { discipline: 'histoire' }),
        fiche('b', 'Les aires urbaines', 'La France', { discipline: 'geographie' }),
      ],
      { subject: { slug: 'histoire-geo', name: 'Histoire-Géo', color: 'orange' }, grade: '3e', gradeLevel: '3e' },
    )
    render(<SubjectTemplate data={histoireGeo} />)
    fireEvent.click(
      within(screen.getByRole('navigation', { name: 'Les rayons du cours' })).getByRole('button', {
        name: 'Encyclopédie',
      }),
    )
    expect(router.push).toHaveBeenCalledWith('/reviser/histoire-geo/encyclopedie')
  })

  it('le dernier thème ouvert s’écrit dans l’adresse', () => {
    render(<SubjectTemplate data={dossier(simple)} />)
    fireEvent.click(screen.getByRole('button', { name: /^Le théâtre/ }))
    expect(new URLSearchParams(window.location.search).get('theme')).toBe('Le théâtre')
  })
})
