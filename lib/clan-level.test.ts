import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { GRADE_CYCLES, cycleOf } from './grades'
import { schoolLevelForGrade } from './clan'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

// -----------------------------------------------------------------------------
// LE MIROIR SQL DU CYCLE SCOLAIRE.
//
// La migration 322 (`arene_accueil`) dérive le cycle de l'élève EN SQL, pour
// supprimer un aller-retour : la page devait auparavant lire le profil, en
// tirer le cycle en JavaScript, puis repartir chercher `clan_ranking` et
// `school_tournament_standings`. La base a le profil sous la main, elle peut
// faire les deux d'un coup — à condition de connaître la même règle.
//
// D'où ce test. Le cycle décide du CLASSEMENT dans lequel un élève apparaît :
// une divergence entre les deux implémentations rangerait, par exemple, tous
// les écoliers du primaire dans le classement du collège. Silencieusement —
// aucune erreur, aucun log, juste un classement faux. C'est exactement le
// genre de bug que ce projet paie cher, et il a failli être introduit ici :
// la première version du CASE écrivait les classes du primaire en minuscules
// et repliait l'inconnu sur `lycee` au lieu de `college`.
// -----------------------------------------------------------------------------

const SQL = readFileSync(
  path.join(ROOT, 'supabase', '322_arene_accueil.sql'),
  'utf8',
)

/** Les classes listées dans une branche `IN (…)` du CASE de la 322. */
function branche(cycle: 'primaire' | 'lycee'): string[] {
  const motif = new RegExp(
    `IN \\(([^)]*)\\)[\\s\\S]{0,40}?THEN '${cycle}'`,
    'i',
  )
  const m = SQL.match(motif)
  if (!m) return []
  return [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1])
}

describe('le CASE de la 322 est le miroir de cycleOf', () => {
  it('liste EXACTEMENT les classes du primaire', () => {
    const attendu = GRADE_CYCLES.find((c) => c.id === 'primaire')!.grades
    expect(branche('primaire').sort()).toEqual([...attendu].sort())
  })

  it('liste EXACTEMENT les classes du lycée, voie techno comprise', () => {
    const attendu = GRADE_CYCLES.find((c) => c.id === 'lycee')!.grades
    expect(branche('lycee').sort()).toEqual([...attendu].sort())
  })

  it('replie sur « college » et non sur NULL ni sur « lycee »', () => {
    // Le collège n'a PAS sa propre branche : il est le repli. C'est voulu — il
    // couvre à la fois ses quatre classes, la classe inconnue et la classe
    // absente, exactement comme `cycleOf`.
    expect(SQL).toMatch(/ELSE 'college'/)
    expect(cycleOf(null)).toBe('college')
    expect(cycleOf(undefined)).toBe('college')
    expect(cycleOf('classe qui n’existe pas')).toBe('college')
    for (const g of GRADE_CYCLES.find((c) => c.id === 'college')!.grades) {
      expect(branche('primaire')).not.toContain(g)
      expect(branche('lycee')).not.toContain(g)
    }
  })

  it('rogne les espaces des deux côtés', () => {
    // `cycleOf` fait `grade.trim()` ; le SQL doit faire `btrim`, sinon un
    // « 3e » enregistré avec une espace parasite tomberait dans le repli.
    expect(SQL).toMatch(/btrim\(v_grade\)/)
    expect(cycleOf('  CM1  ')).toBe('primaire')
  })

  it('couvre TOUTES les classes du catalogue, sans trou ni doublon', () => {
    // Si une classe est ajoutée à GRADE_CYCLES sans être ajoutée au SQL, elle
    // tomberait dans le repli « college » sans que rien ne le signale. Ce test
    // est le signal.
    const auSql = new Set([...branche('primaire'), ...branche('lycee')])
    for (const cycle of GRADE_CYCLES) {
      for (const g of cycle.grades) {
        const attendu = cycle.id !== 'college'
        expect(auSql.has(g), `${g} (${cycle.id})`).toBe(attendu)
      }
    }
  })

  it('schoolLevelForGrade et cycleOf ne font qu’un', () => {
    // `schoolLevelForGrade` délègue à `cycleOf`. Le jour où l'une des deux
    // diverge, c'est ici qu'on l'apprend.
    for (const cycle of GRADE_CYCLES) {
      for (const g of cycle.grades) {
        expect(schoolLevelForGrade(g)).toBe(cycleOf(g))
        expect(schoolLevelForGrade(g)).toBe(cycle.id)
      }
    }
  })
})
