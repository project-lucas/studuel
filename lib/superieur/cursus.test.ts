import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { GRADE_LEVELS } from '@/lib/types'
import { GRADE_CYCLES, GRADE_FULL_LABELS, cycleOf } from '@/lib/grades'
import { PROGRAMME_PAR_CLASSE } from '@/lib/programme-classes'
import { hasSubjectIcon, hasSubjectVignette } from '@/lib/subject-style'
import { ALL_BOSSES, bossById, bossForSubject } from '@/lib/bosses'
import { isEnChasse } from '@/lib/traque'
import {
  CLASSES_SUP,
  CURSUS,
  MATIERES_SUP,
  classeSup,
  classesDeMatiere,
  estClasseSup,
  infoClasseSup,
  matieresDeClasse,
  nomClasseSup,
} from '@/lib/superieur/cursus'

const ROOT = path.join(__dirname, '..', '..')

describe('les classes du supérieur', () => {
  it('redonnent exactement la fin de GRADE_LEVELS, dans le même ordre', () => {
    const debut = GRADE_LEVELS.indexOf('Tle techno') + 1
    expect([...GRADE_LEVELS.slice(debut)]).toEqual([...CLASSES_SUP])
  })

  it('forment le cycle « superieur »', () => {
    const cycle = GRADE_CYCLES.find((c) => c.id === 'superieur')
    expect(cycle?.grades).toEqual(CLASSES_SUP)
    for (const c of CLASSES_SUP) expect(cycleOf(c)).toBe('superieur')
  })

  it('s’écrivent comme on les dit', () => {
    expect(classeSup(CURSUS.find((c) => c.id === 'droit')!, 'L1')).toBe('L1 droit')
    expect(classeSup(CURSUS.find((c) => c.id === 'sante')!, 'PASS')).toBe('PASS')
    expect(nomClasseSup('L2 droit')).toBe('L2 Droit')
    expect(GRADE_FULL_LABELS['L1 droit']).toBe('L1 Droit')
  })

  it('sont reconnues, et rien d’autre', () => {
    expect(estClasseSup('L3 psycho')).toBe(true)
    expect(estClasseSup('Tle')).toBe(false)
    expect(infoClasseSup('L2 eco')?.cursus.id).toBe('eco')
    expect(infoClasseSup('L2 eco')?.annee).toBe('L2')
  })
})

describe('les matières du supérieur', () => {
  it('ont des slugs uniques, en kebab-case', () => {
    const slugs = MATIERES_SUP.map((m) => m.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  })

  it('chaque année de chaque cursus a des matières', () => {
    for (const c of CURSUS) {
      for (const a of c.annees) {
        expect(matieresDeClasse(classeSup(c, a)).length, `${c.id} ${a}`).toBeGreaterThan(2)
      }
    }
  })

  it('chaque matière a un programme pour chacune de ses années, et rien d’autre', () => {
    for (const c of CURSUS) {
      for (const m of c.matieres) {
        for (const a of m.annees) {
          expect(c.annees, `${m.slug} ${a}`).toContain(a)
          expect(m.programme[a]?.length ?? 0, `${m.slug} ${a}`).toBeGreaterThanOrEqual(2)
        }
        expect(Object.keys(m.programme).sort()).toEqual([...m.annees].sort())
      }
    }
  })

  it('le programme d’une classe coche toutes ses matières par défaut', () => {
    for (const classe of CLASSES_SUP) {
      const p = PROGRAMME_PAR_CLASSE[classe as keyof typeof PROGRAMME_PAR_CLASSE]
      expect(p.aChoisir).toEqual([])
      expect([...p.obligatoires].sort()).toEqual(
        [...matieresDeClasse(classe)].sort(),
      )
    }
  })

  it('chaque matière a sa vignette peinte et son icône de trait', () => {
    for (const m of MATIERES_SUP) {
      expect(hasSubjectVignette(m.slug), m.slug).toBe(true)
      expect(hasSubjectIcon(m.slug), m.slug).toBe(true)
      const fichier = path.join(ROOT, 'public', 'images', 'matieres', 'vignettes', `${m.slug}.webp`)
      expect(existsSync(fichier), fichier).toBe(true)
    }
  })

  it('la migration 606 déclare chaque matière avec ses classes exactes', () => {
    const sql = readFileSync(
      path.join(ROOT, 'supabase', 'schema', '606_matieres_superieur.sql'),
      'utf8',
    )
    for (const m of MATIERES_SUP) {
      const niveaux = `'{${classesDeMatiere(m.slug)
        .map((c) => `"${c}"`)
        .join(',')}}'`
      expect(sql, m.slug).toContain(`('${m.slug}', `)
      expect(sql, m.slug).toContain(niveaux)
    }
  })
})

describe('les gardiens du supérieur', () => {
  it('un gardien par secteur garde chaque matière, par son nom comme par son slug', () => {
    for (const c of CURSUS) {
      expect(bossById(c.gardien), c.id).toBeDefined()
      for (const m of c.matieres) {
        expect(bossForSubject(m.nom).id, m.nom).toBe(c.gardien)
        expect(bossForSubject(m.slug).id, m.slug).toBe(c.gardien)
      }
    }
  })

  it('les noms des matières du lycée gardent leur prof', () => {
    expect(bossForSubject('Histoire-géographie').id).toBe('chronos')
    expect(bossForSubject('Physique-chimie').id).toBe('plasma')
    expect(bossForSubject('SVT').id).toBe('mitochondrix')
  })

  it('les nouveaux gardiens restent hors de la rotation du boss de la semaine', () => {
    const rotation = ALL_BOSSES.map((b) => b.id)
    for (const id of ['themistor', 'asclepion', 'psyche']) expect(rotation).not.toContain(id)
  })

  it('chaque gardien a son jour de semaine', () => {
    // 2026-11-03 mardi, 04 mercredi, 05 jeudi.
    expect(isEnChasse('themistor', '2026-11-03')).toBe(true)
    expect(isEnChasse('psyche', '2026-11-04')).toBe(true)
    expect(isEnChasse('asclepion', '2026-11-05')).toBe(true)
    expect(isEnChasse('themistor', '2026-11-05')).toBe(false)
  })
})
