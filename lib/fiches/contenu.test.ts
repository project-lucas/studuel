import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
// Le rendu est celui des rédacteurs (node scripts/fiches-rendre.mjs) : composer
// le HTML d'une fiche ici, sans Chromium, attrape un bloc inconnu ou un champ
// manquant avant qu'il ne casse la production des PDF.
import { EPREUVES, MATIERES, html, listerFiches } from '../../scripts/fiches-rendre.mjs'
import { registre, texteDuRegistre } from '../../scripts/fiches-registre.mjs'

const RACINE = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const SOURCES = path.join(RACINE, 'contenu', 'fiches')

/** Le MVP de docs/fiches-mvp.md : 260 fiches, par niveau. */
const ATTENDU: Record<string, number> = { '3e': 97, '2de': 12, '1re': 54, Tle: 97 }

const fiches = listerFiches()
const noms = fiches.map((f) => `${f.niveau}/${f.matiere}/${f.index.slug}`)

/** Toutes les entrées des index, qu'elles aient un contenu ou non. */
function entreesDesIndex() {
  const resultat: { niveau: string; matiere: string; entree: Record<string, unknown> }[] = []
  for (const niveau of readdirSync(SOURCES)) {
    const dossier = path.join(SOURCES, niveau)
    for (const f of readdirSync(dossier).filter((f) => f.endsWith('.json'))) {
      const index = JSON.parse(readFileSync(path.join(dossier, f), 'utf8'))
      for (const entree of index.fiches) resultat.push({ niveau, matiere: f.replace(/\.json$/, ''), entree })
    }
  }
  return resultat
}

describe('contenu/fiches', () => {
  it('chaque fiche de l’index a son contenu, et le compte est celui du MVP', () => {
    const entrees = entreesDesIndex()
    const sansContenu = entrees.filter(({ niveau, matiere, entree }) => !existsSync(path.join(SOURCES, niveau, matiere, `${entree.slug}.json`)))
    expect(sansContenu.map((e) => `${e.niveau}/${e.matiere}/${e.entree.slug}`)).toEqual([])
    const parNiveau: Record<string, number> = {}
    for (const f of fiches) parNiveau[f.niveau] = (parNiveau[f.niveau] ?? 0) + 1
    expect(parNiveau).toEqual(ATTENDU)
  })

  it('le registre lu par l’app est à jour', () => {
    // node scripts/fiches-registre.mjs
    const fichier = readFileSync(path.join(RACINE, 'lib', 'fiches', 'registre.ts'), 'utf8')
    expect(fichier).toBe(texteDuRegistre(registre()))
  })

  it('un chapitre n’a qu’une fiche, et chaque matière est connue du rendu', () => {
    const chapitres = fiches.map((f) => f.index.chapitre)
    expect(new Set(chapitres).size).toBe(chapitres.length)
    expect(new Set(fiches.map((f) => f.matiere).filter((m) => !(m in MATIERES)))).toEqual(new Set())
  })

  it.each(noms)('%s se compose, tient son contrat et a son illustration', (nom) => {
    const f = fiches[noms.indexOf(nom)]
    const { index, fiche } = f
    expect(index.chapitre).toMatch(/^[0-9a-f-]{36}$/)
    expect(index.slug).toMatch(/^[a-z0-9-]+$/)
    expect(['P1', 'P2']).toContain(index.palier)
    if (fiche.epreuve !== undefined) expect(Object.keys(EPREUVES)).toContain(fiche.epreuve)
    // Un surlignage qui ne retrouve pas son mot dans le titre disparaît sans bruit.
    const titre = fiche.titre ?? index.titre
    if (fiche.titreSurligne) expect(titre).toContain(fiche.titreSurligne)
    // Trois questions et leurs réponses, numérotées, toujours en pied.
    const blocs = (fiche.rangs ?? []).flatMap((r: { blocs: { type: string }[] }) => r.blocs)
    const tests = blocs.filter((b: { type: string }) => b.type === 'test') as { questions: string[]; reponses: string }[]
    expect(tests).toHaveLength(1)
    expect(tests[0].questions).toHaveLength(3)
    for (const n of ['1)', '2)', '3)']) expect(tests[0].reponses).toContain(n)
    // L'illustration livrée : sans elle, la fiche se rendrait avec Marcel (un repli, pas la forme vendue).
    expect(fiche.illustration?.fichier, 'illustration.fichier').toBeTruthy()
    expect(existsSync(path.join(RACINE, fiche.illustration.fichier)), fiche.illustration.fichier).toBe(true)
    // Le rendu : aucun bloc inconnu, aucun balisage resté en clair dans le corps
    // (un « == » collé à un mot est une marque ratée ; « n == 0 » et « <b>==</b> » de NSI sont du code).
    const corps = html(f).replace(/<style>[\s\S]*?<\/style>|<script>[\s\S]*?<\/script>/g, '')
    expect(corps).not.toMatch(/\*\*|~~|\[\[|\]\]|==[\p{L}\d(]|[\p{L}\d)]==|\{[^{}<>]*\/[^{}<>]*\}/u)
  })
})
