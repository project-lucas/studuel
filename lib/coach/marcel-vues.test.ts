import { describe, it, expect } from 'vitest'
import {
  MARCEL_ENTREES,
  parseVue,
  titreVue,
  vueHref,
  type MarcelVue,
} from '@/lib/coach/marcel-vues'

describe('parseVue', () => {
  it('accepte les cinq vues secondaires et l’accueil', () => {
    for (const vue of [
      'aujourdhui',
      'mission',
      'methode',
      'oral',
      'entrainement',
      'progres',
    ]) {
      expect(parseVue(vue), vue).toBe(vue)
    }
  })

  it('retombe sur l’accueil pour une valeur inconnue ou absente', () => {
    // Un lien périmé ou bricolé à la main ne doit pas produire d'écran vide :
    // la page a un repli, et c'est celui qui porte le travail du jour.
    expect(parseVue('vue-fantome')).toBe('aujourdhui')
    expect(parseVue(undefined)).toBe('aujourdhui')
    expect(parseVue('')).toBe('aujourdhui')
  })
})

describe('MARCEL_ENTREES', () => {
  it('couvre les cinq vues secondaires, l’accueil exclu', () => {
    // L'accueil N'EST PAS une carte : c'est l'écran du coach lui-même (la
    // salutation, la bulle du diagnostic, le champ). S'il réapparaissait dans le
    // catalogue, le rail proposerait un lien vers l'écran déjà affiché.
    //
    // « La mission du jour » ouvre la liste : c'est la réponse par défaut à
    // « qu'est-ce que je peux faire pour toi ? ».
    expect(MARCEL_ENTREES.map((e) => e.key)).toEqual([
      'mission',
      'methode',
      'oral',
      'entrainement',
      'progres',
    ])
  })

  it('chaque entrée porte un mot court ET sa ligne d’explication', () => {
    // La ligne d'explication est ce qui remplace les cinq filtres muets : sans
    // elle, on retombe sur « Méthode / Progrès » et sur « je ne sais pas où
    // cliquer ».
    for (const entree of MARCEL_ENTREES) {
      expect(entree.label.length, entree.key).toBeGreaterThan(0)
      expect(entree.hint.length, entree.key).toBeGreaterThan(10)
    }
  })
})

describe('titreVue', () => {
  it('rend le titre d’une sous-page', () => {
    expect(titreVue('progres')).toBe('Progrès')
    expect(titreVue('methode')).toBe('Méthode')
    expect(titreVue('mission')).toBe('La mission du jour')
  })

  it('null sur l’accueil — son contenu se présente tout seul', () => {
    expect(titreVue('aujourdhui')).toBeNull()
  })
})

describe('vueHref', () => {
  it('l’accueil est l’onglet nu, sans paramètre', () => {
    expect(vueHref('aujourdhui')).toBe('/marcel')
    expect(vueHref('aujourdhui', 'maths')).toBe('/marcel')
  })

  it('emporte la matière courante d’un écran à l’autre', () => {
    expect(vueHref('methode', 'maths')).toBe('/marcel?vue=methode&matiere=maths')
  })

  it('omet la matière quand il n’y en a pas', () => {
    expect(vueHref('oral', null)).toBe('/marcel?vue=oral')
    expect(vueHref('oral')).toBe('/marcel?vue=oral')
  })

  it('échappe une matière à caractères spéciaux', () => {
    // Les slugs sont propres aujourd'hui, mais un lien construit à la main ne
    // doit pas pouvoir casser la query string.
    expect(vueHref('methode', 'maths&vue=progres')).toBe(
      '/marcel?vue=methode&matiere=maths%26vue%3Dprogres',
    )
  })

  it('tout ce que produit vueHref se relit par parseVue', () => {
    for (const entree of MARCEL_ENTREES) {
      const url = new URL(vueHref(entree.key, 'maths'), 'https://studuel.app')
      const vue: MarcelVue = parseVue(url.searchParams.get('vue') ?? undefined)
      expect(vue, entree.key).toBe(entree.key)
    }
  })
})
