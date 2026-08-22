import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChapterList from '@/components/reviser/ChapterList'
import { SEARCH_MIN_CHAPTERS, type ChapterRow } from '@/lib/subject-template'

// LA LISTE DU PROGRAMME, RANGÉE SOUS SES CHAPITRES.
//
// Ce que ces tests gardent :
//   1. le numéro affiché est celui du chapitre DU PROGRAMME — il compte les
//      groupes titrés, et un groupe sans titre n'en consomme pas. C'est le
//      défaut vu le 19/08/2026 : « Le groupe nominal », premier chapitre
//      d'anglais Tle, s'annonçait « Chapitre 2 » parce qu'un groupe fantôme le
//      précédait ;
//   2. dans un groupe titré, la ligne est une FICHE : elle porte son titre nu
//      et son rang DANS le chapitre, pas « Chapitre 20 · … » ;
//   3. sans aucun thème en base, rien ne change de l'affichage à plat d'avant.

const row = (
  id: string,
  title: string,
  theme: string | null,
  position: number,
): ChapterRow => ({
  id,
  position,
  title,
  status: 'non_commence',
  crowns: 0,
  href: `/reviser/anglais/${id}`,
  examHint: null,
  minutes: null,
  theme,
  discipline: null,
})

const anglais = [
  row('a', 'Les déterminants', 'Le groupe nominal', 1),
  row('b', 'Exprimer une quantité', 'Le groupe nominal', 2),
  row('c', 'Les auxiliaires modaux', 'Le groupe verbal', 3),
  row('d', 'Les questions', 'La phrase', 4),
]

describe('ChapterList', () => {
  it('numérote les chapitres du programme dans l’ordre', () => {
    render(
      <ChapterList
        chapters={anglais}
        resume={null}
        subjectSlug="anglais"
        subjectName="Anglais"
        grade="Terminale"
      />,
    )
    expect(screen.getByText('Chapitre 1')).toBeTruthy()
    expect(screen.getByText('Chapitre 2')).toBeTruthy()
    expect(screen.getByText('Chapitre 3')).toBeTruthy()
    expect(screen.queryByText('Chapitre 4')).toBeNull()
  })

  it('un groupe sans titre ne consomme pas de numéro', () => {
    render(
      <ChapterList
        chapters={[row('z', 'Un chapitre non rangé', null, 0), ...anglais]}
        resume={null}
        subjectSlug="anglais"
        subjectName="Anglais"
        grade="Terminale"
      />,
    )
    // Le groupe fantôme est bien là (il ne disparaît pas en silence)…
    expect(screen.getByText('Autres chapitres')).toBeTruthy()
    // … mais le premier chapitre du programme reste le chapitre 1.
    const nominal = screen.getByText('Le groupe nominal').closest('button')
    expect(within(nominal as HTMLElement).getByText('Chapitre 1')).toBeTruthy()
  })

  it('compte les lignes d’un chapitre en fiches, pas en chapitres', () => {
    render(
      <ChapterList
        chapters={anglais}
        resume={null}
        subjectSlug="anglais"
        subjectName="Anglais"
        grade="Terminale"
      />,
    )
    const nominal = screen.getByText('Le groupe nominal').closest('button')
    expect(within(nominal as HTMLElement).getByText('0/2 fiches')).toBeTruthy()
  })

  it('une fiche porte son titre nu, sans « Chapitre N · »', () => {
    render(
      <ChapterList
        chapters={anglais}
        resume={null}
        subjectSlug="anglais"
        subjectName="Anglais"
        grade="Terminale"
      />,
    )
    expect(screen.getByText('Les déterminants')).toBeTruthy()
    expect(screen.queryByText(/Chapitre 1 · Les déterminants/)).toBeNull()
  })

  it('sans thème en base, la liste reste plate et garde ses numéros', () => {
    render(
      <ChapterList
        chapters={[
          row('a', 'Nombres et calculs', null, 1),
          row('b', 'Géométrie', null, 2),
        ]}
        resume={null}
        subjectSlug="anglais"
        subjectName="Maths"
        grade="6e"
      />,
    )
    expect(screen.queryByText('Autres chapitres')).toBeNull()
    expect(screen.getByText(/Chapitre 1 · Nombres et calculs/)).toBeTruthy()
  })

  // La philosophie n'a pas d'ordre : ses notions se traitent dans celui que
  // choisit le professeur. « Chapitre 8 · Le devoir » laisserait croire à une
  // progression, et volerait la vedette à la notion — cf. `chaptersAreNumbered`.
  it('une matière sans ordre imposé ne numérote pas ses lignes', () => {
    render(
      <ChapterList
        chapters={[
          row('a', 'La conscience', null, 1),
          row('b', 'L’inconscient', null, 2),
        ]}
        resume={null}
        subjectSlug="anglais"
        subjectName="Philosophie"
        grade="Terminale"
        numbered={false}
      />,
    )
    expect(screen.getByText('La conscience')).toBeTruthy()
    expect(screen.queryByText(/Chapitre 1 · La conscience/)).toBeNull()
    expect(screen.queryByText(/Chapitre 2 · /)).toBeNull()
  })
})

// LA RECHERCHE DANS LA LISTE.
//
// Ce qu'elle garde : la loupe n'apparaît que sur les rayons où l'on se perd,
// elle déplie la barre, celle-ci retrouve une œuvre à l'accent près, ne
// renumérote rien, et se referme sur la liste entière.

/** Ouvre la barre en touchant la loupe, et rend le champ. */
const ouvrir = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole('button', { name: /Rechercher/ }))
  return screen.getByRole('textbox')
}

const fiches = [
  row('f1', '« Art », Yasmina Reza', 'Fiches de lecture', 1),
  row('f2', '« Le Bateau ivre », Arthur Rimbaud', 'Fiches de lecture', 2),
  row('f3', '« Un cœur simple », Gustave Flaubert', 'Fiches de lecture', 3),
  ...Array.from({ length: SEARCH_MIN_CHAPTERS }, (_, i) =>
    row('x' + i, 'Fiche de remplissage ' + i, 'Fiches de lecture', 4 + i),
  ),
]

describe('ChapterList — recherche', () => {
  it('ne montre pas de loupe sur une liste courte', () => {
    render(
      <ChapterList
        chapters={anglais}
        resume={null}
        subjectSlug="anglais"
        subjectName="Anglais"
        grade="Terminale"
      />,
    )
    expect(screen.queryByRole('button', { name: /Rechercher/ })).toBeNull()
  })

  it('un seul chapitre ne s’annonce pas « Chapitre 1 »', () => {
    render(
      <ChapterList
        chapters={fiches}
        resume={null}
        subjectSlug="anglais"
        subjectName="Français"
        grade="1re"
      />,
    )
    // Le titre du chapitre reste, son numéro s'en va : il n'y a pas de suite
    // à situer, « Chapitre 1 » ne numérote rien.
    expect(screen.getByText('Fiches de lecture')).toBeTruthy()
    expect(screen.queryByText('Chapitre 1')).toBeNull()
  })

  it('la loupe déplie la recherche sans replier le chapitre', async () => {
    const user = userEvent.setup()
    render(
      <ChapterList
        chapters={fiches}
        resume={null}
        subjectSlug="anglais"
        subjectName="Français"
        grade="1re"
      />,
    )
    const entete = screen
      .getByText('Fiches de lecture')
      .closest('button') as HTMLButtonElement
    expect(entete.getAttribute('aria-expanded')).toBe('true')

    await ouvrir(user)

    expect(entete.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByRole('textbox')).toBeTruthy()
  })

  it('déplie la barre DANS le bloc du chapitre, et garde le curseur dedans', async () => {
    const user = userEvent.setup()
    render(
      <ChapterList
        chapters={fiches}
        resume={null}
        subjectSlug="anglais"
        subjectName="Français"
        grade="1re"
      />,
    )
    const champ = await ouvrir(user)
    // Le bloc = la carte qui porte l'en-tête ; la barre doit vivre dedans, pas
    // au-dessus de la liste.
    const bloc = screen.getByText('Fiches de lecture').closest('button')
      ?.parentElement?.parentElement as HTMLElement
    expect(bloc.contains(champ)).toBe(true)

    await user.type(champ, 'rimbaud')
    // Le curseur ne doit pas sauter à la première lettre : la barre vit dans un
    // bloc que la recherche remanie sous elle.
    expect(document.activeElement).toBe(champ)
  })

  it('pas de loupe sur un programme rangé en plusieurs chapitres', () => {
    // L'onglet « Programme » du français : 48 fiches, mais sous cinq chapitres
    // de quatre à six lignes. Le rangement suffit à s'y retrouver.
    const programme = Array.from({ length: SEARCH_MIN_CHAPTERS + 8 }, (_, i) =>
      row('p' + i, 'Fiche ' + i, 'Chapitre ' + ((i % 5) + 1), i + 1),
    )
    render(
      <ChapterList
        chapters={programme}
        resume={null}
        subjectSlug="anglais"
        subjectName="Français"
        grade="1re"
      />,
    )
    expect(screen.queryByRole('button', { name: /Rechercher/ })).toBeNull()
  })

  it('la barre reste repliée tant qu’on n’a pas touché la loupe', async () => {
    const user = userEvent.setup()
    render(
      <ChapterList
        chapters={fiches}
        resume={null}
        subjectSlug="anglais"
        subjectName="Français"
        grade="1re"
      />,
    )
    expect(screen.queryByRole('textbox')).toBeNull()
    await ouvrir(user)
    expect(screen.getByRole('textbox')).toBeTruthy()
  })

  it('filtre les fiches sur un mot du titre', async () => {
    const user = userEvent.setup()
    render(
      <ChapterList
        chapters={fiches}
        resume={null}
        subjectSlug="anglais"
        subjectName="Français"
        grade="1re"
      />,
    )
    await user.type(await ouvrir(user), 'rimbaud')

    expect(screen.getByText('« Le Bateau ivre », Arthur Rimbaud')).toBeTruthy()
    expect(screen.queryByText('« Art », Yasmina Reza')).toBeNull()
    expect(screen.getByText('1 fiche trouvée')).toBeTruthy()
  })

  it('trouve une œuvre sans son accent ni sa ligature', async () => {
    const user = userEvent.setup()
    render(
      <ChapterList
        chapters={fiches}
        resume={null}
        subjectSlug="anglais"
        subjectName="Français"
        grade="1re"
      />,
    )
    await user.type(await ouvrir(user), 'coeur')

    expect(screen.getByText('« Un cœur simple », Gustave Flaubert')).toBeTruthy()
  })

  it('une fiche trouvée garde son rang dans le chapitre', async () => {
    const user = userEvent.setup()
    render(
      <ChapterList
        chapters={fiches}
        resume={null}
        subjectSlug="anglais"
        subjectName="Français"
        grade="1re"
      />,
    )
    await user.type(await ouvrir(user), 'flaubert')

    // La ligne est désormais un BOUTON qui déplie la fiche, plus un lien vers
    // une page de chapitre : les supports se dépliENT dessous.
    const ligne = screen
      .getByText('« Un cœur simple », Gustave Flaubert')
      .closest('button')
    // Troisième fiche du chapitre : elle reste la 3, pas la 1re du résultat.
    expect(within(ligne as HTMLElement).getByText('3')).toBeTruthy()
  })

  it('le dit quand rien ne correspond, puis rend la liste une fois refermée', async () => {
    const user = userEvent.setup()
    render(
      <ChapterList
        chapters={fiches}
        resume={null}
        subjectSlug="anglais"
        subjectName="Français"
        grade="1re"
      />,
    )
    await user.type(await ouvrir(user), 'zzz')
    expect(screen.getByText(/Aucune correspondance/)).toBeTruthy()
    expect(screen.queryByText('« Art », Yasmina Reza')).toBeNull()

    await user.click(screen.getByLabelText('Fermer la recherche'))
    expect(screen.queryByRole('textbox')).toBeNull()
    expect(screen.getByText('« Art », Yasmina Reza')).toBeTruthy()
    expect(screen.queryByText(/Aucune correspondance/)).toBeNull()
  })

  it('Échap referme la barre et rend la liste', async () => {
    const user = userEvent.setup()
    render(
      <ChapterList
        chapters={fiches}
        resume={null}
        subjectSlug="anglais"
        subjectName="Français"
        grade="1re"
      />,
    )
    await user.type(await ouvrir(user), 'rimbaud')
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('textbox')).toBeNull()
    expect(screen.getByText('« Art », Yasmina Reza')).toBeTruthy()
  })
})
