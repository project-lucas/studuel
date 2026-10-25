import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { COOKIE_CANAL, doitMarquerPlay, estCanalPlay, sansPrixEuros } from './canal'

describe('doitMarquerPlay', () => {
  it('reconnaît le paramètre de lancement de l’app Android', () => {
    expect(doitMarquerPlay('?canal=play', '')).toBe(true)
    expect(doitMarquerPlay('?x=1&canal=play', '')).toBe(true)
  })

  it('reconnaît le référent posé par Chrome dans l’app Android', () => {
    expect(doitMarquerPlay('', 'android-app://app.studuel/')).toBe(true)
  })

  it('ne marque pas le site ouvert normalement', () => {
    expect(doitMarquerPlay('', '')).toBe(false)
    expect(doitMarquerPlay('?canal=playground', 'https://google.com/')).toBe(false)
  })
})

describe('estCanalPlay', () => {
  it('ne dit oui qu’à la valeur exacte', () => {
    expect(estCanalPlay('play')).toBe(true)
    expect(estCanalPlay(undefined)).toBe(false)
    expect(estCanalPlay('web')).toBe(false)
  })
})

describe('sansPrixEuros', () => {
  it('retire le prix en euros sans toucher au reste ni à l’original', () => {
    const catalogue = [{ id: 'a', prixEuros: 4.99, prixGemmes: 200 }]
    expect(sansPrixEuros(catalogue)).toEqual([{ id: 'a', prixEuros: null, prixGemmes: 200 }])
    expect(catalogue[0].prixEuros).toBe(4.99)
  })
})

describe('l’écran de lancement statique', () => {
  // public/lancement.html ne peut rien importer : il RECOPIE la règle.
  const html = readFileSync('public/lancement.html', 'utf8')

  it('pose le cookie du canal sous le même nom', () => {
    expect(html).toContain(`${COOKIE_CANAL}=play`)
  })

  it('reconnaît les deux mêmes signaux', () => {
    expect(html).toContain('canal=play')
    expect(html).toContain('android-app://')
  })
})
