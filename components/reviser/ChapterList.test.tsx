import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChapterList from '@/components/reviser/ChapterList'
import { SEARCH_MIN_CHAPTERS, type ChapterRow } from '@/lib/subject-template'

// LA LISTE DU PROGRAMME, RANGÉE SOUS SES CHAPITRES.
//
// Ce que ces tests gardent :
//   1. AUCUN chapitre ne s'annonce « Chapitre N » — ni en surtitre du groupe,
//      ni en préfixe du titre sur une liste à plat. Le numéro promettait un
//      ordre que le professeur ne suit pas, et volait la place du titre ;
//   2. dans un groupe titré, la ligne est une FICHE : elle porte son titre nu
//      et son rang DANS le chapitre ;
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
  it('n’annonce AUCUN numéro de chapitre', () => {
    render(
      <ChapterList
        chapters={anglais}
        resume={null}
        subjectSlug="anglais"
        subjectName="Anglais"
        grade="Terminale"
      />,
    )
    // Les titres du programme sont là…
    expect(screen.getByText('Le groupe nominal')).toBeTruthy()
    expect(screen.getByText('Le groupe verbal')).toBeTruthy()
    // … et rien ne les numérote.
    expect(screen.queryByText(/^Chapitre \d/)).toBeNull()
  })

  it('un groupe sans titre ne disparaît pas en silence', () => {
    render(
      <ChapterList
        chapters={[row('z', 'Un chapitre non rangé', null, 0), ...anglais]}
        resume={null}
        subjectSlug="anglais"
        subjectName="Anglais"
        grade="Terminale"
      />,
    )
    // Les chapitres que la base n'a pas rangés gardent leur bloc à eux.
    expect(screen.getByText('Autres chapitres')).toBeTruthy()
    expect(screen.getByText('Le groupe nominal')).toBeTruthy()
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

  it('sans thème en base, la liste reste plate — et sans numéro', () => {
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
    expect(screen.getByText('Nombres et calculs')).toBeTruthy()
    expect(screen.queryByText(/Chapitre 1 · /)).toBeNull()
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

  it('un chapitre unique porte son titre, sans numéro', () => {
    render(
      <ChapterList
        chapters={fiches}
        resume={null}
        subjectSlug="anglais"
        subjectName="Français"
        grade="1re"
      />,
    )
    expect(screen.getByText('Fiches de lecture')).toBeTruthy()
    expect(screen.queryByText(/^Chapitre \d/)).toBeNull()
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
    // Le rang est un NOMBRE PEINT depuis `components/reviser/numeros.ts` : il
    // ne s'assertait plus par son texte, mais par le dessin choisi.
    const rang = within(ligne as HTMLElement).getByRole('presentation', {
      hidden: true,
    })
    expect(rang.getAttribute('src')).toContain('/3.webp')
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

// LE PROJECTEUR, AU NIVEAU DU CHAPITRE.
//
// Ce qu'il garde : déplier un chapitre efface les autres, exactement comme
// ouvrir une fiche efface ses voisines — un seul geste, une seule réponse. Et
// il ne s'allume que sur un clic : la page ne s'ouvre pas déjà atténuée sous
// prétexte qu'un chapitre est déplié par défaut.

const EFFACE = 'opacity-50'

/** Le bloc d'un chapitre, atteint par son titre. */
const bloc = (titre: string) =>
  screen.getByText(titre).closest('[class*="bg-card/60"]') as HTMLElement

const rendre = () =>
  render(
    <ChapterList
      chapters={anglais}
      resume={null}
      subjectSlug="anglais"
      subjectName="Anglais"
      grade="Terminale"
    />,
  )

describe('ChapterList — le projecteur sur le chapitre', () => {
  it('n’efface rien à l’arrivée', () => {
    rendre()
    expect(bloc('Le groupe nominal').className).not.toContain(EFFACE)
    expect(bloc('Le groupe verbal').className).not.toContain(EFFACE)
    expect(bloc('La phrase').className).not.toContain(EFFACE)
  })

  it('déplier un chapitre efface les autres', async () => {
    const user = userEvent.setup()
    rendre()
    await user.click(screen.getByText('Le groupe verbal'))
    expect(bloc('Le groupe verbal').className).not.toContain(EFFACE)
    expect(bloc('Le groupe nominal').className).toContain(EFFACE)
    expect(bloc('La phrase').className).toContain(EFFACE)
  })

  it('le replier rend la page à tout le monde', async () => {
    const user = userEvent.setup()
    rendre()
    await user.click(screen.getByText('Le groupe verbal'))
    await user.click(screen.getByText('Le groupe verbal'))
    expect(bloc('Le groupe nominal').className).not.toContain(EFFACE)
    expect(bloc('Le groupe verbal').className).not.toContain(EFFACE)
    expect(bloc('La phrase').className).not.toContain(EFFACE)
  })

  it('le projecteur passe au dernier chapitre ouvert', async () => {
    const user = userEvent.setup()
    rendre()
    await user.click(screen.getByText('Le groupe verbal'))
    await user.click(screen.getByText('La phrase'))
    expect(bloc('La phrase').className).not.toContain(EFFACE)
    expect(bloc('Le groupe verbal').className).toContain(EFFACE)
  })
})
