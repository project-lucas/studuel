import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import BossSheet from './BossSheet'
import { bossById, FALLBACK_BOSS } from '@/lib/bosses'
import type { TraqueCard } from '@/lib/traque'

// LA TRAQUE EN TANIÈRES (13/10/2026, maquette « B » choisie par Lucas), puis
// L'AFFICHE du gardien (25/10/2026, « Le jeu vivant » § C).
//
// Ce que ces tests gardent :
//   1. chaque gardien est posé sur SA SCÈNE, et son nom se lit toujours (plus
//      de « ??? » : l'étiquette le disait déjà) ;
//   2. la tanière du jour est un AVIS DE RECHERCHE : bandeau « Recherché »,
//      « Il part dans … », trois gestes cochés par la jauge avec un « Aller »
//      vers Réviser filtré sur la matière, la récompense en or ;
//   3. le gardien débusqué se cercle d'or, compte ses minutes et propose
//      « Défier » — sans gestes, c'est fait ; les autres renvoient RÉVISER ;
//   4. celui du jour reste en lumière ; depuis la 576, un gardien INDISPONIBLE
//      (pas son jour) est une ombre barrée d'un ruban, sans jauge ni affiche,
//      et dit quand il revient ;
//   5. le premier bloc est le gardien le plus proche d'être défié (le débusqué,
//      sinon le pourcentage le plus haut) — « pour éviter le scrolling » ;
//   6. sans gardien, l'invitation à réviser.

vi.mock('@/lib/sounds', () => ({
  sfx: { tap: vi.fn() },
}))
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...rest
  }: {
    children: React.ReactNode
    href: string
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    fill,
    ...reste
  }: { src: string; alt: string; fill?: boolean } & React.ImgHTMLAttributes<HTMLImageElement>) => {
    void fill
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...reste} />
  },
}))

function carte(
  bossId: string,
  subject: string,
  subjectSlug: string,
  points: number,
  extra: Partial<TraqueCard> = {},
): TraqueCard {
  const boss = bossById(bossId) ?? FALLBACK_BOSS
  const percent = Math.min(100, points)
  return {
    boss,
    subject,
    subjectSlug,
    status: 'traque',
    points,
    ratio: percent / 100,
    percent,
    rank: 1,
    attempts: 0,
    enChasse: false,
    backOn: 'mercredi',
    remainingMs: 0,
    endsAt: null,
    hint: '',
    xp: 30,
    gemmes: 5,
    ...extra,
  }
}

const nox = () =>
  carte('nox', "l'Ombre du Bulletin", '', 0, {
    status: 'indisponible',
    enChasse: false,
    backOn: 'dimanche',
    hint: 'Revient dimanche',
    xp: 90,
    gemmes: 20,
  })
const atlas = () => carte('chronos', 'HGGSP', 'hggsp', 50, { enChasse: true, backOn: null })
const plasma = () => carte('plasma', 'Physique-Chimie', 'physique-chimie', 20, { enChasse: true, backOn: null })
const grammatork = () =>
  carte('grammatork', 'Français', 'francais', 100, {
    status: 'debusque',
    rank: 2,
    remainingMs: 42 * 60_000,
    endsAt: Date.now() + 42 * 60_000,
    backOn: null,
    xp: 60,
  })

// La scène est la première image de la carte (l'éclair d'XP en est une autre).
const scene = (article: HTMLElement) =>
  within(article).getAllByRole('presentation', { hidden: true })[0]
const gestes = (article: HTMLElement) => within(article).getByRole('list', { name: /Trois gestes/ })

describe('BossSheet — les tanières', () => {
  it('pose chaque gardien sur sa scène, nom lisible, en avis de recherche', () => {
    render(<BossSheet cards={[atlas()]} />)
    const article = screen.getByRole('article')
    expect(within(article).getByText('Atlas')).toBeTruthy()
    expect(scene(article).getAttribute('src')).toBe('/images/boss/atlas-scene.webp')
    // Le bandeau parchemin, le rang tamponné, le compte à rebours du jour.
    expect(within(article).getByText('Recherché')).toBeTruthy()
    expect(within(article).getByText('aujourd’hui seulement')).toBeTruthy()
    expect(within(article).getByText('Rang I')).toBeTruthy()
    expect(within(article).getByText(/Il part dans/)).toBeTruthy()
    expect(within(article).getByRole('progressbar').getAttribute('aria-valuenow')).toBe('50')
    // Il rôde, et c'est son jour : en pleine lumière, pas encore défiable.
    expect(article.hasAttribute('data-ombre')).toBe(false)
    expect(article.hasAttribute('data-libre')).toBe(false)
    expect(within(article).getByRole('link', { name: 'Réviser HGGSP →' }).getAttribute('href')).toBe(
      '/reviser/hggsp',
    )
    expect(within(article).queryByText(/Indisponible/)).toBeNull()
    // La bannière ne porte que le nom : ni épithète ni matière sur la scène.
    expect(within(article).queryByText(/Cartographe Fantôme/)).toBeNull()
  })

  it('les trois gestes : cochés par la jauge, un « Aller » vers Réviser filtré pour ce qui reste', () => {
    render(<BossSheet cards={[atlas()]} />)
    const article = screen.getByRole('article')
    const liste = gestes(article)
    const lignes = within(liste).getAllByRole('listitem')
    expect(lignes.map((l) => l.textContent)).toEqual([
      'Lire 1 cours — fait+15',
      'Finir 1 quiz — fait+25',
      'Réviser 13 cartes+52Aller',
    ])
    // À 50 %, cours et quiz sont tenus pour faits : plus de bouton ; il reste les cartes.
    expect(within(liste).queryByRole('link', { name: 'Lire 1 cours : aller' })).toBeNull()
    expect(within(liste).getByRole('link', { name: 'Réviser 13 cartes : aller' }).getAttribute('href')).toBe(
      '/reviser/revoir?matiere=hggsp',
    )
  })

  it('à 20 %, le cours est coché, le quiz et les cartes attendent avec leur bouton', () => {
    render(<BossSheet cards={[plasma()]} />)
    const liste = gestes(screen.getByRole('article'))
    expect(within(liste).getByRole('link', { name: 'Finir 1 quiz : aller' }).getAttribute('href')).toBe(
      '/reviser/physique-chimie',
    )
    expect(within(liste).getByRole('link', { name: 'Réviser 15 cartes : aller' }).getAttribute('href')).toBe(
      '/reviser/revoir?matiere=physique-chimie',
    )
    expect(within(liste).getAllByRole('link')).toHaveLength(2)
  })

  it('un gardien débusqué : cerclé d’or, « Débusqué », ses minutes, « Défier » — plus de gestes', () => {
    render(<BossSheet cards={[grammatork()]} />)
    const article = screen.getByRole('article')
    expect(article.hasAttribute('data-libre')).toBe(true)
    expect(article.hasAttribute('data-ombre')).toBe(false)
    expect(within(article).getByText('Débusqué')).toBeTruthy()
    expect(within(article).getByText('à abattre maintenant')).toBeTruthy()
    expect(within(article).getByText('Rang II')).toBeTruthy()
    expect(within(article).getByText(/Il disparaît dans 42 min/)).toBeTruthy()
    expect(within(article).queryByRole('list', { name: /Trois gestes/ })).toBeNull()
    expect(
      within(article).getByRole('link', { name: 'Défier Grammatork' }).getAttribute('href'),
    ).toBe('/defi/traque/grammatork')
    expect(within(article).getByLabelText('60 XP et 5 gemmes en cas de victoire')).toBeTruthy()
  })

  it('un gardien INDISPONIBLE (pas son jour) : ruban sur la scène, ombre, ni jauge ni affiche, revient tel jour', () => {
    render(
      <BossSheet
        cards={[
          carte('grammatork', 'Français', 'francais', 0, {
            status: 'indisponible',
            enChasse: false,
            backOn: 'mardi',
            hint: 'Revient mardi',
          }),
        ]}
      />,
    )
    const article = screen.getByRole('article')
    expect(article.hasAttribute('data-libre')).toBe(false)
    expect(article.hasAttribute('data-ombre')).toBe(true)
    expect(article.hasAttribute('data-repos')).toBe(true)
    expect(within(article).getByText('Indisponible aujourd’hui')).toBeTruthy()
    expect(within(article).getByText(/Revient mardi/)).toBeTruthy()
    expect(within(article).queryByText('Recherché')).toBeNull()
    expect(within(article).queryByText(/Il part dans/)).toBeNull()
    expect(within(article).queryByRole('progressbar')).toBeNull()
    expect(within(article).queryByRole('list', { name: /Trois gestes/ })).toBeNull()
    expect(within(article).queryByRole('link', { name: /Défier/ })).toBeNull()
    expect(within(article).getByRole('link', { name: 'Réviser Français →' })).toBeTruthy()
    // Le gain s'éteint avec lui.
    expect(within(article).getByLabelText('30 XP et 5 gemmes en cas de victoire').hasAttribute('data-or')).toBe(false)
  })

  it('le gardien du jour reste en pleine lumière, son gain en or et en grand', () => {
    render(<BossSheet cards={[plasma()]} />)
    const article = screen.getByRole('article')
    expect(article.hasAttribute('data-ombre')).toBe(false)
    expect(article.hasAttribute('data-repos')).toBe(false)
    expect(within(article).queryByText(/Indisponible/)).toBeNull()
    // Le gain est doré ce jour-là, et dit ses deux unités.
    const gains = within(article).getByLabelText('30 XP et 5 gemmes en cas de victoire')
    expect(gains.hasAttribute('data-or')).toBe(true)
    expect(gains.textContent).toBe('Récompense30XP5gemmes')
  })

  it('un gardien recouché sous les yeux de l’élève : le dit, et renvoie réviser', () => {
    render(
      <BossSheet
        cards={[
          carte('bigben', 'Anglais', 'anglais', 100, {
            status: 'debusque',
            remainingMs: 0,
            endsAt: Date.now() - 60_000,
          }),
        ]}
      />,
    )
    const article = screen.getByRole('article')
    expect(article.hasAttribute('data-libre')).toBe(false)
    expect(within(article).getByText(/s’est recouché — sa jauge repart de la moitié/)).toBeTruthy()
    expect(within(article).queryByRole('list', { name: /Trois gestes/ })).toBeNull()
    expect(within(article).getByRole('link', { name: 'Réviser Anglais →' })).toBeTruthy()
  })

  it('recouché plus tôt dans la journée : encore recherché, la jauge à la moitié, les gestes qui restent', () => {
    render(
      <BossSheet
        cards={[
          carte('bigben', 'Anglais', 'anglais', 50, { status: 'expire', enChasse: true, backOn: null }),
        ]}
      />,
    )
    const article = screen.getByRole('article')
    expect(within(article).getByText('Recherché')).toBeTruthy()
    expect(within(article).getByText(/s’est recouché — sa jauge repart de la moitié/)).toBeTruthy()
    expect(within(article).getByRole('progressbar').getAttribute('aria-valuenow')).toBe('50')
    expect(within(gestes(article)).getByRole('link', { name: 'Réviser 13 cartes : aller' })).toBeTruthy()
    expect(within(article).getByLabelText('30 XP et 5 gemmes en cas de victoire').hasAttribute('data-or')).toBe(true)
  })

  it('range le gardien le plus proche d’être défié en premier', () => {
    render(<BossSheet cards={[atlas(), plasma(), nox(), grammatork()]} />)
    const noms = screen
      .getAllByRole('article')
      .map((a) => within(a).getByRole('heading', { level: 3 }).textContent)
    // Le sorti, puis les gardiens du jour par jauge, puis l'indisponible en queue.
    expect(noms).toEqual(['Grammatork', 'Atlas', 'Dr Plasma', 'Nox'])
  })

  it('sans gardien, invite à réviser', () => {
    render(<BossSheet cards={[]} />)
    expect(screen.getByText('Aucun gardien en vue')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Aller réviser' }).getAttribute('href')).toBe('/reviser')
  })
})
