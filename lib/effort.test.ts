import { describe, it, expect } from 'vitest'
import {
  buildEffort,
  dureeLabel,
  radarAxes,
  type EffortInput,
} from '@/lib/effort'
import { weightsForGrade, weightsAreComparable } from '@/lib/exam-weights'

// LE DIAGRAMME D'EFFORT.
//
// Ce que ces tests gardent, dans l'ordre de ce qui casserait le plus :
//   1. une matière d'ÉPREUVE jamais travaillée apparaît quand même, à zéro —
//      c'est précisément ce que l'élève doit voir ;
//   2. le verdict compare une PART à un POIDS, jamais deux nombres bruts ;
//   3. on ne parle qu'au-delà d'un écart significatif : pas de sapin de Noël ;
//   4. les trois régimes (brevet, bac de français, niveau sans épreuve) ;
//   5. l'échelle est COMMUNE à toutes les lignes — sans quoi les barres ne se
//      comparent plus entre elles.

const CATALOGUE = [
  { slug: 'maths', name: 'Maths' },
  { slug: 'francais', name: 'Français' },
  { slug: 'histoire-geo', name: 'Histoire-Géo' },
  { slug: 'svt', name: 'SVT' },
  { slug: 'physique-chimie', name: 'Physique-Chimie' },
  { slug: 'anglais', name: 'Anglais' },
]

const brevet = weightsForGrade('3e')

/** Raccourci : n questions dans une matière. */
const q = (slug: string, questions: number): EffortInput => ({
  slug,
  questions,
  lessons: 0,
})

describe('buildEffort — le cas nominal du brevet', () => {
  const diag = buildEffort({
    // 200 questions de maths, 20 de français : le déséquilibre de l'énoncé.
    effort: [q('maths', 200), q('francais', 20), q('anglais', 40)],
    subjects: CATALOGUE,
    weights: brevet,
  })

  it('sépare les matières de l’épreuve du reste', () => {
    expect(diag.exam.map((r) => r.slug)).toContain('maths')
    expect(diag.autres.map((r) => r.slug)).toEqual(['anglais'])
  })

  it('fait apparaître une matière d’épreuve JAMAIS travaillée, à zéro', () => {
    // SVT n'a pas une seule question jouée : elle doit être là quand même.
    const svt = diag.exam.find((r) => r.slug === 'svt')
    expect(svt).toBeDefined()
    expect(svt?.minutes).toBe(0)
    expect(svt?.share).toBe(0)
  })

  it('trie chaque bloc par effort décroissant', () => {
    const minutes = diag.exam.map((r) => r.minutes)
    expect([...minutes].sort((a, b) => b - a)).toEqual(minutes)
  })

  it('juge sur l’écart part/poids, et nomme le manque avant l’excès', () => {
    const maths = diag.exam.find((r) => r.slug === 'maths')
    const francais = diag.exam.find((r) => r.slug === 'francais')
    expect(maths?.verdict).toBe('trop')
    expect(francais?.verdict).toBe('a_rattraper')
    // La phrase parle du FRANÇAIS : un manque appelle un geste, un excès non.
    expect(diag.phrase).toMatch(/^Français pèse/)
  })

  it('se tait quand l’écart n’est pas significatif', () => {
    // Réparti à peu près comme le barème : personne ne doit être épinglé.
    const equilibre = buildEffort({
      effort: [
        q('francais', 100),
        q('maths', 100),
        q('histoire-geo', 50),
        q('svt', 25),
        q('physique-chimie', 25),
      ],
      subjects: CATALOGUE,
      weights: brevet,
    })
    expect(equilibre.exam.every((r) => r.verdict === null)).toBe(true)
    expect(equilibre.phrase).toMatch(/bien réparti/)
  })
})

describe('buildEffort — les régimes', () => {
  it('brevet : plusieurs matières, donc comparaison', () => {
    const d = buildEffort({
      effort: [q('maths', 10)],
      subjects: CATALOGUE,
      weights: brevet,
    })
    expect(d.regime).toBe('comparaison')
    expect(d.exam.find((r) => r.slug === 'maths')?.weight).toBeCloseTo(1 / 3, 3)
  })

  it('1re : UNE seule matière à l’épreuve — aucun poids, aucun verdict', () => {
    // Comparer une part à un poids de 100 % dirait à tout élève de 1re qu'il
    // ne travaille pas assez le français, quoi qu'il fasse.
    const poids = weightsForGrade('1re')
    expect(weightsAreComparable(poids)).toBe(false)
    const d = buildEffort({
      effort: [q('francais', 10), q('maths', 200)],
      subjects: CATALOGUE,
      weights: poids,
    })
    expect(d.regime).toBe('part')
    expect(d.exam.every((r) => r.weight === null)).toBe(true)
    expect(d.exam.every((r) => r.verdict === null)).toBe(true)
    expect(d.phrase).toBeNull()
  })

  it('niveau sans épreuve : un seul bloc, aucun repère', () => {
    const d = buildEffort({
      effort: [q('maths', 10), q('anglais', 20)],
      subjects: CATALOGUE,
      weights: weightsForGrade('5e'),
    })
    expect(d.regime).toBe('simple')
    expect(d.exam).toEqual([])
    // TOUTES les matières suivies ont leur ligne, travaillées ou non : une
    // matière absente du travail est précisément ce que l'élève doit voir.
    expect(d.autres).toHaveLength(CATALOGUE.length)
    expect(d.autres.filter((r) => r.minutes === 0)).toHaveLength(
      CATALOGUE.length - 2,
    )
    expect(d.phrase).toBeNull()
  })
})

describe('buildEffort — les bords', () => {
  it('aucun travail : pas de division par zéro, pas de verdict', () => {
    const d = buildEffort({ effort: [], subjects: CATALOGUE, weights: brevet })
    expect(d.totalMinutes).toBe(0)
    expect(d.exam).toHaveLength(5)
    expect(d.exam.every((r) => r.share === 0 && r.verdict === null)).toBe(true)
  })

  it('UNE seule matière travaillée : aucun verdict', () => {
    // Sa part vaut 1 par construction — en tirer « tu en fais trop » serait
    // reprocher à un élève d'avoir commencé quelque part.
    const d = buildEffort({
      effort: [q('maths', 50)],
      subjects: CATALOGUE,
      weights: brevet,
    })
    expect(d.exam.every((r) => r.verdict === null)).toBe(true)
  })

  it('une matière hors catalogue garde son slug comme nom', () => {
    const d = buildEffort({
      effort: [q('matiere-fantome', 10)],
      subjects: CATALOGUE,
      weights: {},
    })
    // Elle est en tête : c'est la seule travaillée, le tri est par effort.
    expect(d.autres[0].name).toBe('matiere-fantome')
  })
})

describe('buildEffort — l’échelle des pistes', () => {
  it('est COMMUNE, et couvre la plus grande des parts comme des poids', () => {
    const d = buildEffort({
      effort: [q('maths', 200), q('francais', 20)],
      subjects: CATALOGUE,
      weights: brevet,
    })
    const maxShare = Math.max(...d.exam.map((r) => r.share))
    const maxWeight = Math.max(...d.exam.map((r) => r.weight ?? 0))
    expect(d.scale).toBeGreaterThanOrEqual(maxShare)
    expect(d.scale).toBeGreaterThanOrEqual(maxWeight)
  })

  it('COLLE à la plus grande valeur, pour que la branche dominante touche le bord', () => {
    // Vingt matières travaillées à égalité : chacune vaut 1/26 avec les six du
    // catalogue à zéro. Une échelle figée à 25 % réduirait la toile à une tache
    // au centre d'anneaux vides — c'est ce qui se voyait à dix-sept branches.
    const d = buildEffort({
      effort: Array.from({ length: 20 }, (_, i) => q(`m${i}`, 10)),
      subjects: CATALOGUE,
      weights: {},
    })
    const maxShare = Math.max(...d.autres.map((r) => r.share))
    expect(d.scale).toBeGreaterThanOrEqual(maxShare)
    expect(d.scale).toBeLessThan(maxShare + 0.05)
  })
})

describe('dureeLabel', () => {
  it('écrit les minutes sous l’heure, les heures au-delà', () => {
    expect(dureeLabel(0)).toBe('0 min')
    expect(dureeLabel(25)).toBe('25 min')
    expect(dureeLabel(60)).toBe('1 h')
    expect(dureeLabel(160)).toBe('2 h 40')
    expect(dureeLabel(125)).toBe('2 h 05')
  })
})

describe('buildEffort — les moyennes, la troisième dimension', () => {
  it('une matière sous 10 est « en retard », même hors épreuve', () => {
    // Le cas de l'énoncé : 6/20 en physique-chimie. Ce fait prime sur toute
    // considération de répartition — c'est le seul qui appelle un geste
    // immédiat, et il vaut à tous les niveaux.
    const d = buildEffort({
      effort: [q('maths', 200), q('physique-chimie', 10)],
      subjects: CATALOGUE,
      weights: {},
      moyennes: { 'physique-chimie': 6, maths: 15 },
    })
    const pc = d.autres.find((r) => r.slug === 'physique-chimie')
    expect(pc?.verdict).toBe('en_retard')
    expect(pc?.moyenne).toBe(6)
    expect(d.autres.find((r) => r.slug === 'maths')?.verdict).toBeNull()
  })

  it('le retard remonte EN TÊTE de son bloc, avant le plus gros effort', () => {
    const d = buildEffort({
      effort: [q('maths', 200), q('physique-chimie', 10)],
      subjects: CATALOGUE,
      weights: {},
      moyennes: { 'physique-chimie': 6 },
    })
    expect(d.autres[0].slug).toBe('physique-chimie')
  })

  it('la phrase nomme le retard AVANT tout écart de répartition', () => {
    const d = buildEffort({
      effort: [q('maths', 200), q('francais', 5), q('physique-chimie', 5)],
      subjects: CATALOGUE,
      weights: brevet,
      moyennes: { 'physique-chimie': 6 },
    })
    expect(d.phrase).toMatch(/^Physique-Chimie : 6\/20/)
  })

  it('une matière NOTÉE entre dans le diagramme même sans travail', () => {
    // Une matière à 6/20 jamais rouverte est exactement ce qu'il faut voir.
    const d = buildEffort({
      effort: [q('maths', 50)],
      subjects: CATALOGUE,
      weights: {},
      moyennes: { 'physique-chimie': 6 },
    })
    const pc = d.autres.find((r) => r.slug === 'physique-chimie')
    expect(pc).toBeDefined()
    expect(pc?.minutes).toBe(0)
    expect(pc?.verdict).toBe('en_retard')
  })

  it('le seuil est STRICT : 10 pile n’est pas un retard', () => {
    const d = buildEffort({
      effort: [q('maths', 10), q('anglais', 10)],
      subjects: CATALOGUE,
      weights: {},
      moyennes: { maths: 10, anglais: 9.9 },
    })
    expect(d.autres.find((r) => r.slug === 'maths')?.verdict).toBeNull()
    expect(d.autres.find((r) => r.slug === 'anglais')?.verdict).toBe('en_retard')
  })

  it('sans note saisie, le diagramme est celui du travail seul', () => {
    const d = buildEffort({
      effort: [q('maths', 200), q('francais', 5)],
      subjects: CATALOGUE,
      weights: brevet,
    })
    expect(d.exam.every((r) => r.moyenne === null)).toBe(true)
    expect(d.exam.some((r) => r.verdict === 'en_retard')).toBe(false)
  })
})

describe('radarAxes — la sélection des axes', () => {
  it('met l’épreuve d’abord, dans un ordre qui ne dépend PAS de l’élève', () => {
    // L'aire d'un radar change si l'on permute deux axes : elle ne mesure donc
    // rien. L'ordre est figé sur le BARÈME (poids décroissant) pour que la
    // forme reste la même d'une semaine à l'autre — « ma forme ».
    const d = buildEffort({
      effort: [q('svt', 500), q('francais', 1)],
      subjects: CATALOGUE,
      weights: brevet,
    })
    const axes = radarAxes(d).map((r) => r.slug)
    // Français et maths pèsent 100 : ils ouvrent la toile malgré 1 question.
    expect(axes.slice(0, 2).sort()).toEqual(['francais', 'maths'])
    expect(axes).toHaveLength(CATALOGUE.length)
  })

  it('fait monter un RETARD hors épreuve sur la toile', () => {
    // C'est la découverte que cet écran existe pour provoquer : elle ne doit
    // pas finir dans la liste du dessous.
    const d = buildEffort({
      effort: [q('anglais', 300)],
      subjects: CATALOGUE,
      weights: { francais: 100, maths: 100, 'histoire-geo': 50 },
      moyennes: { 'physique-chimie': 6 },
    })
    expect(radarAxes(d).map((r) => r.slug)).toContain('physique-chimie')
  })

  it('porte TOUTES les matières de l’élève, sans plafond', () => {
    // Le bloc promet à l'élève de voir ses matières d'un coup : en renvoyer une
    // partie dans une liste dessous trahirait la promesse. La lisibilité se
    // règle dans le dessin (police et noms adaptés au nombre de branches), pas
    // en amputant les données.
    const d = buildEffort({
      effort: Array.from({ length: 12 }, (_, i) => q(`m${i}`, 10 * (i + 1))),
      subjects: CATALOGUE,
      weights: {},
    })
    // Douze matières travaillées + les six suivies : dix-huit branches.
    expect(radarAxes(d)).toHaveLength(12 + CATALOGUE.length)
  })

  it('rend un tableau VIDE sous trois axes : deux points ne font pas un polygone', () => {
    // Un élève qui ne suit que deux matières (ou un profil incomplet) : pas de
    // toile, l'appelant retombe sur les barres, qui n'ont pas ce plancher.
    const d = buildEffort({
      effort: [q('maths', 10), q('anglais', 10)],
      subjects: [
        { slug: 'maths', name: 'Maths' },
        { slug: 'anglais', name: 'Anglais' },
      ],
      weights: {},
    })
    expect(radarAxes(d)).toEqual([])
  })
})
