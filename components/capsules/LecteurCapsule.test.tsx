import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { migrationSql } from '@/lib/migrations-lecture'
import { lireContenu, type Capsule, type ContenuCapsule } from '@/lib/capsules'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn(), refresh: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/carnet/capsules/sommeil',
}))
vi.mock('@/lib/sounds', () => ({
  press: vi.fn(),
  sfx: { tap: vi.fn(), correct: vi.fn(), wrong: vi.fn(), complete: vi.fn(), back: vi.fn() },
}))
const ouvrirCapsule = vi.fn<(id: string) => Promise<void>>(async () => {})
const terminerCapsule = vi.fn<(id: string) => Promise<{ ok: true; badge: string; nouveau: boolean }>>(
  async () => ({ ok: true, badge: 'Pro du sommeil', nouveau: true }),
)
vi.mock('@/app/carnet/capsules/actions', () => ({
  ouvrirCapsule: (id: string) => ouvrirCapsule(id),
  terminerCapsule: (id: string) => terminerCapsule(id),
}))

import LecteurCapsule from '@/components/capsules/LecteurCapsule'

// Le VRAI contenu de la capsule « sommeil » (migration 367), lu par le vrai
// lecteur de l'app : le test joue ce qu'un élève jouera.
const LIGNE = /\('([a-z0-9-]+)',\s*'(cours|fiche|quiz|outil)',\s*'([^']*)',\s*\$j\$([\s\S]*?)\$j\$::jsonb\)/g
function contenuDe(id: string): ContenuCapsule {
  const lignes = [...migrationSql('367_capsules_contenu.sql').matchAll(LIGNE)]
    .filter((m) => m[1] === id)
    .map((m) => ({ type: m[2], titre: m[3], contenu: JSON.parse(m[4]) }))
  const contenu = lireContenu(lignes)
  if (!contenu) throw new Error(`contenu illisible : ${id}`)
  return contenu
}

const sommeil: Capsule = {
  id: 'sommeil',
  theme: 'bien-etre',
  titre: 'Le sommeil, ton super-pouvoir',
  accroche: '',
  emoji: '😴',
  teinte: 'ocean',
  prixGemmes: 60,
  prixEuros: null,
  dureeMin: 10,
  auProgramme: [],
  badge: 'Pro du sommeil',
  ordre: 10,
}
const contenu = contenuDe('sommeil')

function jouerLeQuiz(juste: boolean) {
  fireEvent.click(screen.getByRole('tab', { name: /quiz/i }))
  for (const [i, q] of contenu.quiz.contenu.questions.entries()) {
    const choix = juste ? q.bonne : (q.bonne + 1) % q.choix.length
    fireEvent.click(screen.getByRole('button', { name: new RegExp(escape(q.choix[choix])) }))
    const dernier = i === contenu.quiz.contenu.questions.length - 1
    fireEvent.click(screen.getByRole('button', { name: dernier ? 'Voir mon score' : 'Question suivante' }))
  }
}

function escape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

beforeEach(() => {
  ouvrirCapsule.mockClear()
  terminerCapsule.mockClear()
})

describe('le lecteur d’une capsule', () => {
  it('éteint la pastille à la première ouverture, et seulement à la première', () => {
    const { unmount } = render(
      <LecteurCapsule capsule={sommeil} contenu={contenu} dejaOuverte={false} terminee={false} />,
    )
    expect(ouvrirCapsule).toHaveBeenCalledWith('sommeil')
    unmount()
    ouvrirCapsule.mockClear()
    render(<LecteurCapsule capsule={sommeil} contenu={contenu} dejaOuverte terminee={false} />)
    expect(ouvrirCapsule).not.toHaveBeenCalled()
  })

  it('ouvre sur le cours, puis mène à la fiche et sa phrase à retenir', () => {
    render(<LecteurCapsule capsule={sommeil} contenu={contenu} dejaOuverte terminee={false} />)
    expect(screen.getByText(contenu.cours.contenu.sections[0].titre)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Voir la fiche récap' }))
    expect(screen.getByText(contenu.fiche.contenu.aRetenir)).toBeInTheDocument()
  })

  it('termine la capsule et annonce le badge quand le quiz est réussi', async () => {
    render(<LecteurCapsule capsule={sommeil} contenu={contenu} dejaOuverte terminee={false} />)
    jouerLeQuiz(true)
    expect(screen.getByText('8/8')).toBeInTheDocument()
    expect(screen.getByText('Capsule terminée !')).toBeInTheDocument()
    await waitFor(() => expect(terminerCapsule).toHaveBeenCalledWith('sommeil'))
    expect(await screen.findByText(/Badge « Pro du sommeil » débloqué/)).toBeInTheDocument()
  })

  it('ne termine rien sous le seuil, et propose de retenter', () => {
    render(<LecteurCapsule capsule={sommeil} contenu={contenu} dejaOuverte terminee={false} />)
    jouerLeQuiz(false)
    expect(screen.getByText('0/8')).toBeInTheDocument()
    expect(screen.getByText(/Il faut 5 bonnes réponses sur 8/)).toBeInTheDocument()
    expect(terminerCapsule).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: /Refaire le quiz/ }))
    expect(screen.getByText('1/8')).toBeInTheDocument()
  })

  it('calcule les heures de coucher dans l’outil', () => {
    render(<LecteurCapsule capsule={sommeil} contenu={contenu} dejaOuverte terminee={false} />)
    fireEvent.click(screen.getByRole('tab', { name: /outil/i }))
    expect(screen.getByText('21:45')).toBeInTheDocument()
    expect(screen.getByText('23:15')).toBeInTheDocument()
  })

  it('dit qu’une capsule sans contenu lisible est en préparation', () => {
    render(<LecteurCapsule capsule={sommeil} contenu={null} dejaOuverte terminee={false} />)
    expect(screen.getByText(/en préparation/)).toBeInTheDocument()
  })

  it('tient les six capsules de lancement jusqu’à leur outil', () => {
    for (const id of ['sommeil', 'nutrition', 'stress', 'methode', 'argent', 'orientation']) {
      const { unmount } = render(
        <LecteurCapsule capsule={{ ...sommeil, id }} contenu={contenuDe(id)} dejaOuverte terminee={false} />,
      )
      fireEvent.click(screen.getByRole('tab', { name: /outil/i }))
      expect(screen.getByRole('tabpanel')).toBeInTheDocument()
      unmount()
    }
  })
})
