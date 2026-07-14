import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

// Garde d'unicité quiz ↔ leçon. Le hub de leçon lit LE quiz d'une leçon en
// `.maybeSingle()` : si deux quiz partageaient le même lesson_id, la requête
// lèverait une erreur (« multiple rows ») pour de vrais élèves. Les migrations
// de seed qui rattachent un quiz à une leçon (INSERT ... quizzes(..., lesson_id)
// SELECT ... FROM lessons l) DOIVENT donc porter la clause anti-doublon
//   WHERE NOT EXISTS (SELECT 1 FROM public.quizzes q WHERE q.lesson_id = l.id)
// pour rester rejouables sans créer de second quiz sur la même leçon.
// Cette garde échoue si une future migration oublie ce garde-fou.

const SUPABASE_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'supabase',
)

// Un INSERT dont la liste de colonnes de public.quizzes contient lesson_id :
// le quiz est rattaché à une leçon (modèle 025+), pas au seul chapitre (002/004).
const ATTACH_LESSON = /INSERT INTO public\.quizzes\s*\([^)]*\blesson_id\b[^)]*\)/i
// La clause anti-doublon : un NOT EXISTS sur quizzes comparant lesson_id à l.id.
const DEDUP_GUARD = /NOT EXISTS[\s\S]*?lesson_id\s*=\s*l\.id/i

function attachLessonSeeds(): { file: string; guarded: boolean }[] {
  return readdirSync(SUPABASE_DIR)
    .filter((f) => f.endsWith('.sql'))
    .map((file) => ({
      file,
      raw: readFileSync(path.join(SUPABASE_DIR, file), 'utf8'),
    }))
    .filter(({ raw }) => ATTACH_LESSON.test(raw))
    .map(({ file, raw }) => ({ file, guarded: DEDUP_GUARD.test(raw) }))
}

describe('unicité quiz ↔ leçon (garde anti-doublon des seeds)', () => {
  const seeds = attachLessonSeeds()

  it('détecte bien les migrations qui rattachent un quiz à une leçon', () => {
    // Filet de sécurité : si le détecteur ne matche plus rien, la garde
    // deviendrait un test vide qui passe toujours.
    expect(seeds.length).toBeGreaterThan(15)
  })

  it('chaque seed quiz-leçon porte la clause anti-doublon (rejouable)', () => {
    const missing = seeds.filter((s) => !s.guarded).map((s) => `  ${s.file}`)
    expect(
      missing,
      `Migrations quiz rattachées à une leçon SANS garde anti-doublon ` +
        `(WHERE NOT EXISTS … lesson_id = l.id) — un rejeu créerait un 2e quiz ` +
        `sur la leçon et casserait le .maybeSingle() du hub :\n${missing.join('\n')}`,
    ).toEqual([])
  })
})
