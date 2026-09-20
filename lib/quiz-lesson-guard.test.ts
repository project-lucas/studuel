import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { cheminMigration, nomsDesMigrations } from '@/lib/migrations-lecture'

// Un INSERT dont la liste de colonnes de public.quizzes contient lesson_id :
// le quiz est rattaché à une leçon (modèle 025+), pas au seul chapitre (002/004).
const ATTACH_LESSON = /INSERT INTO public\.quizzes\s*\([^)]*\blesson_id\b[^)]*\)/i
// La clause anti-doublon : un NOT EXISTS sur quizzes comparant lesson_id à l.id.
const DEDUP_GUARD = /NOT EXISTS[\s\S]*?lesson_id\s*=\s*l\.id/i

function attachLessonSeeds(): { file: string; guarded: boolean }[] {
  return nomsDesMigrations()
    .filter((f) => f.endsWith('.sql'))
    .map((file) => ({
      file,
      raw: readFileSync(cheminMigration(file), 'utf8'),
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
