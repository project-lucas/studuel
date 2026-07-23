import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { GRADE_LEVELS, HORS_NIVEAU, type SubjectCategory } from '@/lib/types'
import { hasSubjectIcon, hasSubjectTheme } from '@/lib/subject-style'
import { subjectFolders } from '@/lib/reviser-folders'

// Garde du CATALOGUE DES MATIÈRES.
//
// Une matière n'apparaît dans une classe que si `subjects.levels` contient ce
// niveau. C'est exactement ce qui a fait disparaître Sport de la 6e : la
// migration existait, le niveau était bon, mais rien ne le vérifiait. Ce test
// rejoue les migrations `subjects` dans l'ordre et contrôle le catalogue final :
// chaque classe propose assez de matières, et chaque matière est affichable
// (icône, thème de couleur, catégorie connue).
//
// Il ne remplace pas l'exécution des migrations en base — il garantit que le
// SQL écrit dit bien ce qu'on croit qu'il dit.

const SUPABASE_DIR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'supabase',
)

type Row = {
  slug: string
  name: string
  color: string
  category: SubjectCategory
  levels: string[]
}

// Une ligne de VALUES : (slug, name, icon, color, category, '{niveaux}'[, fixed_level])
const ROW = new RegExp(
  String.raw`\(\s*'([a-z0-9-]+)'\s*,\s*'((?:[^']|'')*)'\s*,\s*'[^']*'\s*,` +
    String.raw`\s*'([a-z_]+)'\s*,\s*'([a-z_]+)'\s*,\s*'\{([^}]*)\}'`,
  'g',
)

const parseLevels = (raw: string): string[] =>
  raw
    .split(',')
    .map((l) => l.trim())
    .filter(Boolean)

function migrationFiles(): string[] {
  return readdirSync(SUPABASE_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort()
}

/**
 * Rejoue les migrations et renvoie l'état final de la table `subjects`.
 * Gère les INSERT ... VALUES et les UPDATE ... SET levels/category.
 */
function buildCatalogue(): Map<string, Row> {
  const rows = new Map<string, Row>()

  for (const file of migrationFiles()) {
    const sql = readFileSync(path.join(SUPABASE_DIR, file), 'utf8')
    if (!sql.includes('public.subjects')) continue

    // --- INSERT : on ne lit que les blocs qui visent bien `subjects`.
    for (const block of sql.split(/INSERT\s+INTO\s+/i).slice(1)) {
      if (!/^public\.subjects\s*\(/i.test(block)) continue
      const values = block.split(/\bON\s+CONFLICT\b/i)[0]
      for (const m of values.matchAll(ROW)) {
        const [, slug, name, color, category, levels] = m
        rows.set(slug, {
          slug,
          name: name.replaceAll("''", "'"),
          color,
          category: category as SubjectCategory,
          levels: parseLevels(levels),
        })
      }
    }

    // --- UPDATE ... SET levels = '{…}' [, category = '…'] WHERE slug …
    const UPDATE =
      /UPDATE\s+public\.subjects\s+SET\s+([\s\S]*?)\s+WHERE\s+slug\s+(IN\s*\(([^)]*)\)|=\s*'([a-z0-9-]+)')/gi
    for (const m of sql.matchAll(UPDATE)) {
      const [, setClause, , inList, single] = m
      const targets = single
        ? [single]
        : [...(inList ?? '').matchAll(/'([a-z0-9-]+)'/g)].map((x) => x[1])
      const levels = setClause.match(/levels\s*=\s*'\{([^}]*)\}'/i)?.[1]
      const category = setClause.match(/category\s*=\s*'([a-z_]+)'/i)?.[1]
      for (const slug of targets) {
        const row = rows.get(slug)
        if (!row) continue
        rows.set(slug, {
          ...row,
          levels: levels !== undefined ? parseLevels(levels) : row.levels,
          category: (category ?? row.category) as SubjectCategory,
        })
      }
    }

    // --- DELETE FROM public.subjects ... WHERE ... slug = '…'
    // La 190 éclate le dossier « Culture générale » en matières séparées puis
    // supprime la coquille vide. Sans ce cas, le catalogue simulé garderait un
    // dossier mort que la base n'a plus — et les comptes seraient faux.
    const DELETE =
      /DELETE\s+FROM\s+public\.subjects[\s\S]*?WHERE[\s\S]*?slug\s*=\s*'([a-z0-9-]+)'/gi
    for (const m of sql.matchAll(DELETE)) rows.delete(m[1])
  }

  return rows
}

const catalogue = buildCatalogue()
const all = [...catalogue.values()]
const programme = all.filter((s) => s.category !== 'culture')

describe('le parseur de migrations lit bien quelque chose', () => {
  it('retrouve les matières historiques du seed', () => {
    for (const slug of ['maths', 'francais', 'histoire-geo', 'svt']) {
      expect(catalogue.get(slug), slug).toBeDefined()
    }
    expect(all.length).toBeGreaterThan(20)
  })

  it('applique les DELETE (le dossier « Culture générale » a été éclaté)', () => {
    // La 190 le remplace par Économie, Fiscalité, Entrepreneuriat… puis le
    // supprime. S'il survivait au parseur, le dossier Hors programme
    // afficherait une matière vide de plus.
    expect(catalogue.get('culture-generale')).toBeUndefined()
    expect(catalogue.get('economie')?.category).toBe('culture')
  })

  it('applique bien les UPDATE de niveaux (pas seulement les INSERT)', () => {
    // La 193 étend l'espagnol au lycée : si les UPDATE étaient ignorés, ce test
    // verrait encore les niveaux du seed 008 (5e→3e) et passerait à côté.
    expect(catalogue.get('espagnol')?.levels).toContain('Tle')
    expect(catalogue.get('technologie')?.levels).toContain('6e')
  })
})

describe('chaque classe a un programme complet', () => {
  for (const grade of GRADE_LEVELS) {
    it(`${grade} propose au moins 10 matières au programme`, () => {
      const ofLevel = programme.filter((s) => s.levels.includes(grade))
      expect(
        ofLevel.length,
        `${grade} : ${ofLevel.map((s) => s.slug).join(', ')}`,
      ).toBeGreaterThanOrEqual(10)
    })
  }

  it('donne à chaque classe les fondamentaux qu’un élève attend', () => {
    // Le cas exact remonté : « je clique sur 6e, il n'y a pas sport ».
    const socle = ['francais', 'maths', 'histoire-geo', 'anglais', 'svt', 'sport', 'emc']
    for (const grade of GRADE_LEVELS) {
      for (const slug of socle) {
        // Le français s'arrête en 1re (philosophie prend le relais en Tle).
        if (slug === 'francais' && grade === 'Tle') continue
        expect(
          catalogue.get(slug)?.levels,
          `« ${slug} » absent de la classe ${grade}`,
        ).toContain(grade)
      }
    }
  })

  it('ouvre les arts et la musique à toutes les classes', () => {
    for (const slug of ['arts-plastiques', 'musique']) {
      expect(catalogue.get(slug)?.levels).toEqual([...GRADE_LEVELS])
    }
  })

  it('garde les matières de lycée hors du collège', () => {
    for (const slug of ['philosophie', 'ses', 'nsi', 'hggsp', 'snt', 'hlp', 'si']) {
      const levels = catalogue.get(slug)?.levels ?? []
      expect(levels, slug).not.toContain('6e')
      expect(levels, slug).not.toContain('3e')
    }
  })
})

describe('chaque matière est affichable', () => {
  it('n’utilise que des niveaux connus', () => {
    for (const s of all) {
      for (const level of s.levels) {
        expect(
          [...GRADE_LEVELS, HORS_NIVEAU] as string[],
          `${s.slug} : niveau « ${level} » inconnu`,
        ).toContain(level)
      }
      expect(s.levels.length, `${s.slug} sans niveau`).toBeGreaterThan(0)
    }
  })

  it('n’utilise que des catégories connues', () => {
    const known: SubjectCategory[] = [
      'college',
      'tronc_commun',
      'specialite',
      'option',
      'culture',
    ]
    for (const s of all) expect(known, s.slug).toContain(s.category)
  })

  it('a une couleur qui correspond à un thème réel', () => {
    // Une couleur inconnue retombe EN SILENCE sur le bleu : la matière
    // s'affiche simplement dans la mauvaise teinte, sans rien signaler.
    for (const s of all) {
      expect(hasSubjectTheme(s.color), `${s.slug} : couleur « ${s.color} »`).toBe(
        true,
      )
    }
  })

  it('a son icône, jamais le repli générique', () => {
    for (const s of all) {
      expect(hasSubjectIcon(s.slug), `${s.slug} sans icône`).toBe(true)
    }
  })
})

describe('rangement en dossiers', () => {
  it('range toutes les matières de chaque classe, sans doublon ni perte', () => {
    for (const grade of GRADE_LEVELS) {
      const ofLevel = all.filter((s) => s.levels.includes(grade))
      const folders = subjectFolders({
        programmeSubjects: ofLevel
          .filter((s) => s.category !== 'culture')
          .map(asSubject),
        cultureSubjects: ofLevel
          .filter((s) => s.category === 'culture')
          .map(asSubject),
        grade,
      })
      const shown = folders.flatMap((f) => f.groups.flatMap((g) => g.items))
      expect(shown.length, `${grade} : matières perdues`).toBe(ofLevel.length)
      expect(new Set(shown.map((s) => s.slug)).size).toBe(ofLevel.length)
    }
  })

  it('donne bien deux dossiers à chaque classe', () => {
    for (const grade of GRADE_LEVELS) {
      const ofLevel = all.filter((s) => s.levels.includes(grade))
      const folders = subjectFolders({
        programmeSubjects: ofLevel
          .filter((s) => s.category !== 'culture')
          .map(asSubject),
        cultureSubjects: ofLevel
          .filter((s) => s.category === 'culture')
          .map(asSubject),
        grade,
      })
      expect(folders.map((f) => f.id), grade).toEqual([
        'programme',
        'hors-programme',
      ])
    }
  })
})

// Les lignes parsées n'ont pas d'`id` : on en fabrique un depuis le slug pour
// nourrir la logique de dossiers, qui l'utilise pour repérer les orphelines.
function asSubject(r: Row) {
  return {
    id: r.slug,
    slug: r.slug,
    name: r.name,
    icon: '📘',
    color: r.color,
    category: r.category,
    levels: r.levels,
  }
}
