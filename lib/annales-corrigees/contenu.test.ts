import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
// Le validateur est celui des rédacteurs (node scripts/annales-valider.mjs) :
// un seul jeu de règles, en CI comme à l'écriture.
import { validerAnnale } from '../../scripts/annales-valider.mjs'

const RACINE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const DOSSIER = path.join(RACINE, 'contenu', 'annales')
const fichiers = existsSync(DOSSIER) ? readdirSync(DOSSIER).filter((f) => f.endsWith('.json')) : []

describe('contenu/annales', () => {
  it.each(fichiers)('%s passe le validateur', (f) => {
    const annale = JSON.parse(readFileSync(path.join(DOSSIER, f), 'utf8'))
    expect(validerAnnale(annale, f)).toEqual([])
  })

  it.each(fichiers)('%s a son sujet habillé dans public/annales', (f) => {
    // Sans lui, le bouton « Lire le sujet » mènerait à une 404 :
    // node scripts/annales-sujets.mjs <id>
    expect(existsSync(path.join(RACINE, 'public', 'annales', f.replace('.json', '.pdf')))).toBe(true)
  })

  it('chaque corrigé écrit est au registre', () => {
    const registre = readFileSync(path.join(RACINE, 'lib', 'annales-corrigees', 'registre.ts'), 'utf8')
    const absents = fichiers.filter((f) => !registre.includes(`@/contenu/annales/${f}'`))
    // node scripts/annales-registre.mjs
    expect(absents).toEqual([])
  })
})
