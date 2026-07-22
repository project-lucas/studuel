import { describe, it, expect } from 'vitest'
import { BookOpen } from 'lucide-react'
import {
  subjectIcon,
  subjectTheme,
  subjectDecor,
  subjectVignette,
  subjectPastel,
  subjectInitials,
  type SubjectTheme,
} from '@/lib/subject-style'

describe('subjectIcon', () => {
  it('rend une icône dédiée pour une matière connue', () => {
    // Maths a sa propre icône, distincte du repli.
    expect(subjectIcon('maths')).not.toBe(BookOpen)
  })

  it('repli sur BookOpen pour un slug inconnu', () => {
    expect(subjectIcon('matiere-fantome')).toBe(BookOpen)
  })
})

describe('subjectTheme', () => {
  const KEYS: (keyof SubjectTheme)[] = [
    'header',
    'tile',
    'chip',
    'bar',
    'stroke',
    'arena',
    'edge',
  ]

  it('repli sur le thème bleu pour une couleur inconnue', () => {
    expect(subjectTheme('couleur-inconnue')).toBe(subjectTheme('blue'))
  })

  it('rend un thème distinct pour une couleur connue', () => {
    const red = subjectTheme('red')
    expect(red).not.toBe(subjectTheme('blue'))
    expect(red.bar).toContain('rose')
  })

  it('tout thème connu renseigne les 7 rôles (aucune classe vide)', () => {
    for (const color of ['blue', 'red', 'green', 'purple', 'yellow', 'slate']) {
      const theme = subjectTheme(color)
      for (const key of KEYS) {
        expect(theme[key], `${color}.${key}`).toBeTruthy()
      }
    }
  })
})

describe('subjectDecor', () => {
  it('undefined tant qu’aucun décor de header n’est fourni', () => {
    // Plus aucun décor listé : les headers matière retombent sur le fond
    // coloré (arena-tile). Le repli undefined doit tenir pour tout slug.
    expect(subjectDecor('maths')).toBeUndefined()
    expect(subjectDecor('philosophie')).toBeUndefined()
  })
})

describe('subjectPastel', () => {
  it('rend le fond pastel d’une couleur connue', () => {
    expect(subjectPastel('purple')).toBe('#EFE7FB')
    expect(subjectPastel('blue')).toBe('#DFEBFF')
  })

  it('repli crème pour une couleur inconnue', () => {
    expect(subjectPastel('couleur-fantome')).toBe('#FBF3DC')
  })
})

describe('subjectInitials', () => {
  it('rend le sigle dédié des matières connues', () => {
    expect(subjectInitials('histoire-geo')).toBe('HG')
    expect(subjectInitials('maths')).toBe('MA')
    expect(subjectInitials('physique-chimie')).toBe('PC')
    expect(subjectInitials('svt')).toBe('SVT')
    expect(subjectInitials('philosophie')).toBe('PH')
    expect(subjectInitials('anglais')).toBe('AN')
    expect(subjectInitials('enseignement-scientifique')).toBe('ES')
    expect(subjectInitials('nsi')).toBe('NSI')
    expect(subjectInitials('ses')).toBe('SES')
    // Sigle officiel à 5 lettres, seul au-delà de 4 — rendu en police réduite.
    expect(subjectInitials('hggsp')).toBe('HGGSP')
  })

  it('les autres sigles dédiés tiennent en 4 caractères maximum', () => {
    for (const slug of ['technologie', 'sport', 'allemand', 'espagnol']) {
      expect(subjectInitials(slug).length, slug).toBeLessThanOrEqual(4)
    }
  })

  it('dérive les initiales du nom pour un slug inconnu', () => {
    expect(subjectInitials('matiere-fantome', 'Sciences économiques')).toBe('SÉ')
    expect(subjectInitials('matiere-fantome', 'Histoire des arts')).toBe('HA')
  })

  it('repli sur le slug quand le nom manque, plafonné à 4 caractères', () => {
    expect(subjectInitials('option-theatre-expression-dramatique')).toBe('OTED')
    expect(subjectInitials('chinois')).toBe('CH')
  })
})

describe('subjectVignette', () => {
  it('rend le chemin de vignette d’un slug listé', () => {
    expect(subjectVignette('anglais')).toBe(
      '/images/matieres/vignettes/anglais.webp',
    )
  })

  it('undefined pour un slug sans vignette générée', () => {
    // Maths expertes n'a pas (encore) d'illustration dédiée → repli médaillon.
    expect(subjectVignette('maths-expertes')).toBeUndefined()
  })
})
