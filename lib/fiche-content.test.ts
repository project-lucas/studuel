import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

// Garde d'intégrité des fiches de révision (migrations SQL). Les fiches sont du
// markdown en dollar-quoting ($md$…$md$) dans lessons.revision_sheet. Défauts
// visibles par l'élève : bloc $md$ non fermé (contenu tronqué à l'exécution),
// fiche vide/stub, ou entité HTML encodée qui n'aurait pas dû rester dans le
// markdown. On scanne `supabase/*fiche*.sql` à chaque `npm test`.

const SUPABASE_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'supabase',
)

// Séquences qui ne doivent jamais apparaître dans du markdown écrit à la main :
// l'auteur écrit « & », « < », « > » directement, pas leur forme encodée.
const HTML_ENTITIES = ['&amp;', '&lt;', '&gt;', '&quot;', '&#39;', '&nbsp;']
const MIN_BODY = 20 // en-dessous = stub, pas une vraie fiche

type Issue = { file: string; problem: string; sample?: string }

function scanFiches(): { totalBlocks: number; issues: Issue[] } {
  const files = readdirSync(SUPABASE_DIR).filter(
    (f) => f.endsWith('.sql') && /fiche/i.test(f),
  )
  let totalBlocks = 0
  const issues: Issue[] = []

  for (const file of files) {
    const raw = readFileSync(path.join(SUPABASE_DIR, file), 'utf8')
    // Le header de migration mentionne « $md$…$md$ » en commentaire : on retire
    // les lignes de commentaire SQL avant de compter/extraire les blocs.
    const code = raw
      .split('\n')
      .filter((l) => !l.trimStart().startsWith('--'))
      .join('\n')

    const delims = (code.match(/\$md\$/g) ?? []).length
    if (delims % 2 !== 0) {
      issues.push({ file, problem: `nombre de $md$ impair (${delims}) — bloc non fermé` })
    }

    const re = /\$md\$([\s\S]*?)\$md\$/g
    let m: RegExpExecArray | null
    while ((m = re.exec(code)) !== null) {
      totalBlocks++
      const body = m[1].trim()
      if (body.length < MIN_BODY) {
        issues.push({ file, problem: `fiche quasi-vide (${body.length} car.)`, sample: body.slice(0, 40) })
      }
      for (const e of HTML_ENTITIES) {
        if (body.includes(e)) {
          const at = body.indexOf(e)
          issues.push({ file, problem: `entité HTML « ${e} » dans le markdown`, sample: body.slice(Math.max(0, at - 15), at + 15) })
        }
      }
    }
  }
  return { totalBlocks, issues }
}

describe('contenu des fiches de révision (migrations supabase)', () => {
  const { totalBlocks, issues } = scanFiches()

  it('scanne bien les blocs $md$ (le parseur fonctionne)', () => {
    expect(totalBlocks).toBeGreaterThan(200)
  })

  it("n'a aucune anomalie ($md$ non fermé, fiche vide, entité HTML)", () => {
    const report = issues
      .map((i) => `  [${i.file}] ${i.problem}${i.sample ? ` → …${i.sample}…` : ''}`)
      .join('\n')
    expect(issues, `Anomalies de contenu détectées :\n${report}`).toEqual([])
  })
})
