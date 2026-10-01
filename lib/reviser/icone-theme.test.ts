import { describe, expect, test } from 'vitest'
import {
  ICONES_THEME,
  cleDeTitre,
  iconeDeMatiere,
  iconeDuTheme,
  sansPrefixe,
} from './icone-theme'

describe('cleDeTitre', () => {
  test('retire accents, casse, ponctuation et ligatures', () => {
    expect(cleDeTitre('L’Être humain : cœur & nœuds')).toBe('l etre humain coeur noeuds')
  })
})

describe('sansPrefixe', () => {
  test('retire le mot qui range le chapitre, pas celui qui le nomme', () => {
    expect(sansPrefixe(cleDeTitre('Mathématiques — Analyse'))).toBe('analyse')
    expect(sansPrefixe(cleDeTitre('Droit — Thème 5 : Quel est le rôle du contrat ?'))).toBe(
      'quel est le role du contrat',
    )
    expect(sansPrefixe(cleDeTitre('Enseignement spécifique — Mercatique (marketing)'))).toBe(
      'mercatique marketing',
    )
  })

  test('laisse seul un titre qui n’est QUE ce mot', () => {
    expect(sansPrefixe(cleDeTitre('Mathématiques'))).toBe('mathematiques')
  })
})

describe('iconeDuTheme — les thèmes réels du programme', () => {
  // Chaque ligne est un thème tel qu'il est écrit en base (relevé du 01/10/2026).
  test.each([
    ['maths', 'Nombres et calculs', 'Calculator'],
    ['maths', 'Organisation et gestion de données – Fonctions', 'ChartLine'],
    ['maths', 'Espace et géométrie', 'Triangle'],
    ['maths', 'Algorithmique et programmation', 'Code'],
    ['maths', 'Grandeurs et mesures', 'Ruler'],
    ['maths', 'Statistiques et probabilités', 'Dices'],
    ['maths', 'La proportionnalité', 'Percent'],
    ['maths-expertes', 'Graphes et matrices', 'Network'],
    ['anglais', 'Les temps', 'Clock'],
    ['espagnol', 'Le groupe nominal', 'Tag'],
    ['allemand', 'Voyages et migrations', 'Plane'],
    ['histoire-geo', 'La Seconde Guerre mondiale', 'Swords'],
    ['histoire-geo', 'Les régimes totalitaires', 'ShieldAlert'],
    ['histoire-geo', 'Mers et océans au cœur de la mondialisation', 'Waves'],
    ['histoire-geo', 'Habiter une métropole', 'Building2'],
    ['histoire-geo', 'L’Empire romain dans le monde antique', 'Landmark'],
    ['svt', 'La dynamique interne de la Terre', 'Mountain'],
    ['svt', 'Le climat et la météorologie', 'CloudSun'],
    ['svt', 'Transmission, variation et expression du patrimoine génétique', 'Dna'],
    ['svt', 'La parenté des êtres vivants', 'ListTree'],
    ['physique-chimie', 'Les circuits électriques', 'CircuitBoard'],
    ['physique-chimie', 'Les transformations chimiques', 'FlaskConical'],
    ['physique-chimie', 'Mouvements et interactions', 'Rocket'],
    ['physique-chimie-maths', 'Mathématiques — Géométrie dans le plan', 'Triangle'],
    ['physique-chimie-maths', 'Physique-chimie — Énergie', 'Zap'],
    ['francais', 'La poésie du XIXe au XXIe siècle', 'Feather'],
    ['francais', 'Le théâtre du XVIIe siècle au XXIe siècle', 'Drama'],
    ['francais', 'Fiches de lecture', 'Library'],
    ['ses', 'Comment lutter contre le chômage ?', 'UserSearch'],
    ['ses', 'Comment se forment les prix sur un marché ?', 'Store'],
    ['nsi', 'Bases de données', 'Database'],
    ['snt', 'Cartographier', 'Map'],
    ['technologie', 'Les matériaux', 'Layers'],
    ['emc', 'Respecter autrui', 'HeartHandshake'],
  ] as const)('%s · « %s » → %s', (slug, theme, attendu) => {
    expect(iconeDuTheme(slug, theme)).toBe(attendu)
  })

  test('une épreuve est une épreuve, dans toutes les matières', () => {
    expect(iconeDuTheme('maths', 'Réussir le brevet')).toBe('GraduationCap')
    expect(iconeDuTheme('maths', 'Épreuve anticipée de mathématiques')).toBe('GraduationCap')
    expect(iconeDuTheme('hlp', 'Méthode de l’épreuve')).toBe('GraduationCap')
    expect(iconeDuTheme('droit-economie', 'L’épreuve du baccalauréat')).toBe('GraduationCap')
  })

  test('« à l’épreuve de » n’est pas un examen', () => {
    expect(
      iconeDuTheme(
        'emc',
        'Les valeurs et les principes de la République à l’épreuve de la cohésion sociale',
      ),
    ).toBe('Flag')
  })

  test('un thème inconnu garde le pictogramme de sa matière', () => {
    expect(iconeDuTheme('maths', 'Un thème que personne n’a prévu')).toBe(iconeDeMatiere('maths'))
    expect(iconeDuTheme('svt', 'Zzz')).toBe('Leaf')
    expect(iconeDuTheme('matiere-inconnue', 'Zzz')).toBe('BookOpen')
  })

  test('ne rend que des noms déclarés (le composant les connaît tous)', () => {
    const connus = new Set<string>(ICONES_THEME)
    for (const [slug, theme] of [
      ['maths', 'Analyse'],
      ['si', 'Cinématique'],
      ['biotechnologies', '2 – Cultiver des micro-organismes'],
      ['sport', 'Le corps à l’effort'],
      ['musique', 'La musique, l’homme et la société'],
    ] as const) {
      expect(connus.has(iconeDuTheme(slug, theme))).toBe(true)
    }
  })
})
