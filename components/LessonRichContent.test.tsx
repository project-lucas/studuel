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

  it('garde un bloc de code tel quel, indentation comprise', () => {
    // Un programme Python perd son sens sans son indentation, et ses lignes
    // (« - 1 », « 1. », « | ») ne doivent pas devenir des puces ou un tableau.
    const { container } = render(
      <LessonRichContent
        content={[
          'Voici la fonction :',
          '```python',
          'def somme(t):',
          '    s = 0',
          '    for x in t:',
          '        s = s + x',
          '',
          '    return s  # - pas une puce',
          '```',
          'Et après.',
        ].join('\n')}
      />,
    )
    const code = container.querySelector('pre.code')
    expect(code?.textContent).toBe(
      'def somme(t):\n    s = 0\n    for x in t:\n        s = s + x\n\n    return s  # - pas une puce',
    )
    expect(container.querySelectorAll('ul')).toHaveLength(0)
    expect(container.querySelectorAll('p')).toHaveLength(2)
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

describe('LessonRichContent — les emphases imbriquées', () => {
  // Relevé du 29/09/2026 sur les 2 969 leçons : 31 lignes, dans 27 cours,
  // imbriquent le gras et l'italique (un titre d'œuvre en gras, un mot anglais
  // dans une règle en gras). Le rendu d'une seule passe les affichait avec des
  // astérisques parasites : « **querelle du *Cid*** » sortait « querelle du *Cid* ».
  const rendu = (texte: string) => render(<LessonRichContent content={texte} />).container

  it('rend ***x*** en gras italique, sans astérisque', () => {
    const c = rendu('Le mot ***homework*** est indénombrable.')
    expect(c.textContent).not.toContain('*')
    expect(c.querySelector('strong em, em strong')?.textContent).toBe('homework')
  })

  it('garde l’italique à l’intérieur d’un gras qui finit par lui', () => {
    const c = rendu('après la **querelle du *Cid*** (1637)')
    expect(c.textContent).toBe('après la querelle du Cid (1637)')
    expect(c.querySelector('strong')?.textContent).toBe('querelle du Cid')
    expect(c.querySelector('strong em')?.textContent).toBe('Cid')
  })

  it('garde le gras à l’intérieur d’un italique qui finit par lui', () => {
    const c = rendu('*I can **swim*** — jamais « can to swim »')
    expect(c.textContent).toBe('I can swim — jamais « can to swim »')
    expect(c.querySelector('em strong')?.textContent).toBe('swim')
  })

  it('lit plusieurs italiques dans un même gras', () => {
    const c = rendu('**Jamais de *will* ni de *would* après *if***.')
    expect(c.textContent).toBe('Jamais de will ni de would après if.')
    expect([...c.querySelectorAll('strong em')].map((e) => e.textContent)).toEqual(['will', 'would', 'if'])
  })

  it('laisse une astérisque isolée telle quelle', () => {
    const c = rendu('On tape =250+15*A2 dans la cellule.')
    expect(c.textContent).toBe('On tape =250+15*A2 dans la cellule.')
    expect(c.querySelector('em, strong')).toBeNull()
  })
})

describe('LessonRichContent — la typographie française', () => {
  it('interdit la coupure avant les deux-points, dans un titre comme dans le texte', () => {
    const c = render(<LessonRichContent content={'## Le bonheur : but de la vie\n\nLa Pax Romana (« paix romaine ») dure **deux siècles** : un âge d’or.'} />).container
    expect(c.querySelector('h3')?.textContent).toContain('bonheur : but')
    expect(c.querySelector('p')?.textContent).toContain('« paix romaine »')
    expect(c.querySelector('p')?.textContent).toContain('siècles : un')
  })
})

describe('LessonRichContent — le titre de troisième rang', () => {
  it('rend « ### » en intertitre, sans les dièses', () => {
    const c = render(<LessonRichContent content={'## La méthode\n\n### L’équivalence\n\nUn paragraphe.'} />).container
    expect(c.textContent).not.toContain('#')
    expect(c.querySelector('h4')?.textContent).toContain('L’équivalence')
  })
})
