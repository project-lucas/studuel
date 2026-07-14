import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

// Garde d'intégrité du contenu des quiz (migrations SQL). Ce n'est pas de la
// logique pure mais l'invariant est critique : un QCM avec une option en double,
// un correct_index hors bornes, un mauvais nombre d'options ou un id de question
// dupliqué (qui provoquerait un écrasement silencieux à l'exécution) est un bug
// visible par l'élève ou une perte de contenu. On scanne les migrations
// `supabase/*quiz*.sql` à chaque `npm test` pour qu'aucun ajout futur ne
// réintroduise ce type de défaut.

const SUPABASE_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'supabase',
)

// SQL échappe l'apostrophe en '' ; dans une chaîne JSON entre guillemets doubles
// l'apostrophe est littérale → on désescape '' -> ' avant de lire le tableau.
// La fin du tableau est ]' (crochet JSON + guillemet SQL) : un ] interne d'option
// maths comme "[0;1]" est suivi d'un " et n'est donc jamais confondu.
const OPTS_RE = /'(mcq|true_false)'\s*,\s*'(\[[\s\S]*?\])'\s*,\s*(\d+)/g
// Ligne de quiz_question du gabarit : (id::uuid, quiz_id::uuid, …). On ne
// capture que les lignes qui portent ce préfixe à deux uuid (contenu 030→078).
const QUESTION_ID_RE =
  /\(\s*'([0-9a-fA-F-]{36})'::uuid\s*,\s*'[0-9a-fA-F-]{36}'::uuid\s*,[\s\S]*?'(?:mcq|true_false)'/g

type Issue = { file: string; problem: string; options: string }

function quizFiles(): string[] {
  return readdirSync(SUPABASE_DIR).filter(
    (f) => f.endsWith('.sql') && /quiz/i.test(f),
  )
}

// Passe A — anomalies d'options (couverture maximale : toutes les questions).
function scanOptions(): { total: number; issues: Issue[] } {
  let total = 0
  const issues: Issue[] = []
  for (const file of quizFiles()) {
    const raw = readFileSync(path.join(SUPABASE_DIR, file), 'utf8').replaceAll("''", "'")
    let m: RegExpExecArray | null
    OPTS_RE.lastIndex = 0
    while ((m = OPTS_RE.exec(raw)) !== null) {
      total++
      const kind = m[1]
      const ci = Number(m[3])
      let opts: unknown
      try {
        opts = JSON.parse(m[2])
      } catch {
        issues.push({ file, problem: 'options JSON illisibles', options: m[2] })
        continue
      }
      if (!Array.isArray(opts) || opts.some((o) => typeof o !== 'string')) {
        issues.push({ file, problem: 'options non-textuelles', options: m[2] })
        continue
      }
      const norm = opts.map((o) => (o as string).trim().toLowerCase())
      const dups = [...new Set(norm.filter((o, i) => norm.indexOf(o) !== i))]
      if (dups.length) issues.push({ file, problem: `option en double: ${dups.join(' / ')}`, options: m[2] })
      if (ci < 0 || ci >= opts.length) issues.push({ file, problem: `correct_index=${ci} hors bornes (0..${opts.length - 1})`, options: m[2] })
      if (kind === 'true_false' && opts.length !== 2) issues.push({ file, problem: `true_false avec ${opts.length} options`, options: m[2] })
      if (kind === 'mcq' && opts.length < 3) issues.push({ file, problem: `mcq avec ${opts.length} options`, options: m[2] })
      if (norm.some((o) => o === '')) issues.push({ file, problem: 'option vide', options: m[2] })
    }
  }
  return { total, issues }
}

// Passe B — unicité des ids de question (préfixe UUID neuf par fichier). Un id
// dupliqué entre deux migrations ferait s'écraser les INSERT idempotents.
function scanDuplicateIds(): string[] {
  const seen = new Set<string>()
  const duplicates: string[] = []
  for (const file of quizFiles()) {
    const raw = readFileSync(path.join(SUPABASE_DIR, file), 'utf8')
    let m: RegExpExecArray | null
    QUESTION_ID_RE.lastIndex = 0
    while ((m = QUESTION_ID_RE.exec(raw)) !== null) {
      const id = m[1]
      if (seen.has(id)) duplicates.push(id)
      else seen.add(id)
    }
  }
  return duplicates
}

describe('contenu des quiz (migrations supabase)', () => {
  const { total, issues } = scanOptions()
  const duplicateIds = scanDuplicateIds()

  it('scanne bien les questions des migrations (le parseur fonctionne)', () => {
    // Garde-fou contre une dérive de format qui rendrait le scan silencieux.
    expect(total).toBeGreaterThan(700)
  })

  it("n'a aucune anomalie (option en double, index hors bornes, mauvais compte)", () => {
    const report = issues.map((i) => `  [${i.file}] ${i.problem} → ${i.options}`).join('\n')
    expect(issues, `Anomalies de contenu détectées :\n${report}`).toEqual([])
  })

  it('a des ids de question uniques (pas de collision entre migrations)', () => {
    expect(
      duplicateIds,
      `Ids de question dupliqués (écrasement silencieux à l'exécution) :\n  ${[...new Set(duplicateIds)].join('\n  ')}`,
    ).toEqual([])
  })
})
