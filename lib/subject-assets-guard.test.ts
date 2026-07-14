import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

// Garde des assets de matière. `subject-style.ts` liste des slugs de vignettes
// et des chemins de décors ; `subjectVignette`/`subjectDecor` renvoient un
// chemin d'image SANS vérifier que le fichier existe. Un slug ajouté sans son
// image = image cassée pour l'élève, silencieuse. On vérifie ici que chaque
// asset référencé dans le code existe bien dans public/.

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = readFileSync(path.join(ROOT, 'lib', 'subject-style.ts'), 'utf8')
const publicPath = (webPath: string): string =>
  path.join(ROOT, 'public', webPath.replace(/^\//, ''))

// Slugs de VIGNETTE_SLUGS = [ '...', '...' ] → public/images/matieres/vignettes/<slug>.webp
function vignetteSlugs(): string[] {
  const block = source.match(/const VIGNETTE_SLUGS[\s\S]*?=\s*\[([\s\S]*?)\]/)
  if (!block) return []
  return [...block[1].matchAll(/'([^']+)'/g)].map((m) => m[1])
}

// Chemins de SUBJECT_DECORS = { slug: '/images/...' }
function decorPaths(): string[] {
  const block = source.match(/const SUBJECT_DECORS[^{]*\{([\s\S]*?)\}/)
  if (!block) return []
  return [...block[1].matchAll(/'(\/[^']+)'/g)].map((m) => m[1])
}

describe('assets de matière référencés par subject-style', () => {
  it('parse bien la liste des vignettes', () => {
    expect(vignetteSlugs().length).toBeGreaterThan(0)
  })

  it('chaque vignette listée a son image dans public/', () => {
    const missing = vignetteSlugs()
      .map((slug) => `/images/matieres/vignettes/${slug}.webp`)
      .filter((web) => !existsSync(publicPath(web)))
    expect(missing, `Vignettes listées sans fichier :\n${missing.join('\n')}`).toEqual(
      [],
    )
  })

  it('chaque décor de matière a son image dans public/', () => {
    const missing = decorPaths().filter((web) => !existsSync(publicPath(web)))
    expect(missing, `Décors listés sans fichier :\n${missing.join('\n')}`).toEqual([])
  })
})
