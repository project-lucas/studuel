import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import LessonRichContent from './LessonRichContent'

// -----------------------------------------------------------------------------
// LA FEUILLE DE COURS — l'assemblage, là où `lib/lesson-markdown` ne voit rien.
//
// Le module de découpe est testé à part et sait reconnaître une alerte d'une
// idée clé. Ce qu'il ne peut pas dire, c'est ce que le composant en fait : que
// l'alerte sort bien en corail et l'idée clé en or, que des jalons contigus
// forment UNE frise et non quatre, et qu'un tableau interrompt la liste en
// cours au lieu de s'y ajouter. Ce sont ces coutures-là qui cassent.
// -----------------------------------------------------------------------------

describe('LessonRichContent — les blocs du collège', () => {
  it('sépare l’alerte de l’idée clé, à l’écran', () => {
    // Les deux se ressemblent en markdown (`!> ` et `> `). S'ils se
    // ressemblaient aussi à l'écran, un élève de sixième ne saurait pas lequel
    // est le piège — c'est toute la raison d'être du marqueur.
    const { container } = render(
      <LessonRichContent content={'> À retenir.\n\n!> Le piège.'} />,
    )
    const idee = container.querySelector('.idee-cle')
    const piege = container.querySelector('.piege')
    expect(idee?.textContent).toContain('À retenir.')
    expect(piege?.textContent).toContain('Le piège.')
    expect(idee?.className).toContain('border-highlight')
    expect(piege?.className).toContain('border-destructive')
  })

  it('assemble les jalons contigus en UNE seule frise', () => {
    const { container } = render(
      <LessonRichContent
        content={
          '@ 1789 — Prise de la Bastille\n@ 1792 — La République\n\n@ 1804 — L’Empire'
        }
      />,
    )
    const frises = container.querySelectorAll('.frise')
    // Deux frises : les deux premiers jalons sont contigus, le troisième est
    // séparé par une ligne vide — donc une autre chronologie.
    expect(frises).toHaveLength(2)
    expect(frises[0].querySelectorAll('li')).toHaveLength(2)
    expect(frises[1].querySelectorAll('li')).toHaveLength(1)
    expect(screen.getByText('1789')).toBeInTheDocument()
    expect(screen.getByText('Prise de la Bastille')).toBeInTheDocument()
  })

  it('peint la chaîne en maillons, flèches comprises', () => {
    const { container } = render(
      <LessonRichContent content={'~ Évaporation → Condensation → Pluie'} />,
    )
    const chaine = container.querySelector('.chaine')
    expect(chaine).not.toBeNull()
    expect(screen.getByText('Évaporation')).toBeInTheDocument()
    expect(screen.getByText('Pluie')).toBeInTheDocument()
    // Deux flèches pour trois maillons, jamais une de plus.
    expect(chaine?.textContent?.split('→')).toHaveLength(3)
  })

  it('laisse la prose fléchée en paragraphe', () => {
    // Sans le marqueur `~ `, « 3,47 → 3,5 » reste une phrase. 154 lignes du
    // dépôt en dépendent.
    const { container } = render(
      <LessonRichContent content={'On arrondit : 3,47 → 3,5.'} />,
    )
    expect(container.querySelector('.chaine')).toBeNull()
    expect(container.querySelector('p')?.textContent).toContain('3,47 → 3,5.')
  })

  it('détache la formule au centre', () => {
    const { container } = render(
      <LessonRichContent content={'= Aire = Longueur × largeur'} />,
    )
    const formule = container.querySelector('.formule')
    expect(formule?.textContent).toBe('Aire = Longueur × largeur')
    expect(formule?.className).toContain('text-center')
  })

  it('rend encore les blocs d’origine — tableau, étapes, puces, titres', () => {
    // Les quatre marqueurs neufs s'insèrent dans une chaîne de `else if` : une
    // erreur d'ordre y ferait disparaître un bloc ancien sans bruit.
    const { container } = render(
      <LessonRichContent
        content={[
          '## Une section',
          '| Le mot | Son sens |',
          '| **kein** | Aucun |',
          '1. Première étape',
          '2. Deuxième étape',
          '- une puce',
          'Un paragraphe avec du *gras* et du **fort**.',
        ].join('\n')}
      />,
    )
    expect(container.querySelector('h3')?.textContent).toContain('Une section')
    expect(container.querySelectorAll('table')).toHaveLength(1)
    expect(container.querySelectorAll('th')).toHaveLength(2)
    expect(container.querySelectorAll('ol > li')).toHaveLength(2)
    expect(container.querySelectorAll('ul > li')).toHaveLength(1)
    const gras = [...container.querySelectorAll('strong')].map((e) => e.textContent)
    expect(gras).toEqual(['kein', 'fort'])
    expect(container.querySelector('em')?.textContent).toBe('gras')
  })
})
