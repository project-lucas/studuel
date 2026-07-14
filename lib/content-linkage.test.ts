import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

// Garde de rattachement du contenu aux chapitres. Les migrations quiz et fiches
// s'attachent à un chapitre par ses clés naturelles (slug matière, niveau, titre
// EXACT du chapitre) contre le seed 008. Une faute de frappe dans le titre = le
// JOIN ne trouve rien = contenu silencieusement absent en base. On vérifie ici
// que chaque référence de chapitre correspond à un chapitre canonique du seed.

const SUPABASE_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'supabase',
)

const unesc = (s: string): string => s.replaceAll("''", "'").trim()
const chapterKey = (slug: string, level: string, title: string): string =>
  `${slug}|${level}|${unesc(title)}`

// Ensemble canonique (slug|niveau|titre) des chapitres, depuis 008_reviser.sql.
// Chaque bloc : (VALUES ('niveau','titre',pos), …) AS v(level, title, pos)
// WHERE s.slug = '<slug>'.
function canonicalChapters(): Set<string> {
  const seed = readFileSync(path.join(SUPABASE_DIR, '008_reviser.sql'), 'utf8')
  const set = new Set<string>()
  const blockRe =
    /\(VALUES([\s\S]*?)\)\s*AS v\(level,\s*title,\s*pos\)\s*WHERE s\.slug = '([^']+)'/g
  let b: RegExpExecArray | null
  while ((b = blockRe.exec(seed)) !== null) {
    const rowRe = /\('([^']*)',\s*'((?:[^']|'')*)',\s*\d+\)/g
    let r: RegExpExecArray | null
    while ((r = rowRe.exec(b[1])) !== null) set.add(chapterKey(b[2], r[1], r[2]))
  }
  return set
}

function filesMatching(pattern: RegExp): string[] {
  return readdirSync(SUPABASE_DIR).filter((f) => f.endsWith('.sql') && pattern.test(f))
}

// Références de chapitre côté fiches : ('slug','niveau','titre', $md$…
function ficheRefs(): { slug: string; level: string; title: string; file: string }[] {
  const refs: { slug: string; level: string; title: string; file: string }[] = []
  for (const file of filesMatching(/fiche/i)) {
    const raw = readFileSync(path.join(SUPABASE_DIR, file), 'utf8')
    const re = /\('([^']+)',\s*'([^']+)',\s*'((?:[^']|'')*)',\s*\$md\$/g
    let m: RegExpExecArray | null
    while ((m = re.exec(raw)) !== null) refs.push({ slug: m[1], level: m[2], title: m[3], file })
  }
  return refs
}

// Références de chapitre côté quiz : bloc AS v(quiz_id, level, title, chapter)
// JOIN … s.slug = '<slug>'. La clé du JOIN est le 4e champ (chapter).
function quizRefs(): { slug: string; level: string; title: string; file: string }[] {
  const refs: { slug: string; level: string; title: string; file: string }[] = []
  const blockRe =
    /\(VALUES([\s\S]*?)\)\s*AS v\(quiz_id, level, title, chapter\)\s*JOIN public\.subjects s ON s\.slug = '([^']+)'/g
  for (const file of filesMatching(/quiz/i)) {
    const raw = readFileSync(path.join(SUPABASE_DIR, file), 'utf8')
    let m: RegExpExecArray | null
    while ((m = blockRe.exec(raw)) !== null) {
      const slug = m[2]
      const rowRe = /\('[0-9a-fA-F-]{36}'::uuid,\s*'([^']+)',\s*'((?:[^']|'')*)',\s*'((?:[^']|'')*)'\)/g
      let r: RegExpExecArray | null
      while ((r = rowRe.exec(m[1])) !== null) refs.push({ slug, level: r[1], title: r[3], file })
    }
  }
  return refs
}

describe('rattachement du contenu aux chapitres (seed 008)', () => {
  const canonical = canonicalChapters()
  const fiches = ficheRefs()
  const quizzes = quizRefs()
  const orphans = (refs: typeof fiches) =>
    refs
      .filter((r) => !canonical.has(chapterKey(r.slug, r.level, r.title)))
      .map((r) => `  [${r.file}] ${r.slug} · ${r.level} · « ${unesc(r.title)} »`)

  it('le seed 008 définit un ensemble de chapitres plausible', () => {
    expect(canonical.size).toBeGreaterThan(200)
  })

  it('chaque fiche référence un chapitre existant (pas de faute de titre)', () => {
    expect(fiches.length).toBeGreaterThan(200)
    const o = orphans(fiches)
    expect(o, `Fiches rattachées à un chapitre inexistant :\n${o.join('\n')}`).toEqual([])
  })

  it('chaque quiz référence un chapitre existant (pas de faute de titre)', () => {
    expect(quizzes.length).toBeGreaterThan(200)
    const o = orphans(quizzes)
    expect(o, `Quiz rattachés à un chapitre inexistant :\n${o.join('\n')}`).toEqual([])
  })
})
