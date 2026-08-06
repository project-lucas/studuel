import { describe, it, expect } from 'vitest'
import {
  QUEST_CATALOG,
  QUESTS_PER_DAY,
  ALL_DONE_XP,
  ALL_DONE_GEMS,
  dailyQuests,
  questView,
  questViews,
  allDone,
  doneCount,
  questsHeadline,
  deltaFor,
  applyEvent,
  questsReward,
  normalizeProgress,
} from './quests'

const DAY = '2026-07-25'
const USER = 'user-abc'

describe('catalogue', () => {
  it('a des identifiants uniques', () => {
    const ids = QUEST_CATALOG.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('a au moins une quête par palier', () => {
    for (const tier of ['facile', 'moyenne', 'exigeante'] as const) {
      expect(QUEST_CATALOG.filter((q) => q.tier === tier).length).toBeGreaterThan(0)
    }
  })

  it('récompense davantage les quêtes exigeantes', () => {
    const facile = QUEST_CATALOG.filter((q) => q.tier === 'facile')
    const exigeante = QUEST_CATALOG.filter((q) => q.tier === 'exigeante')
    const max = Math.max(...facile.map((q) => q.xp))
    const min = Math.min(...exigeante.map((q) => q.xp))
    expect(min).toBeGreaterThan(max)
  })

  it('a des objectifs atteignables en une session', () => {
    for (const q of QUEST_CATALOG) {
      expect(q.goal).toBeGreaterThan(0)
      expect(q.goal).toBeLessThanOrEqual(50)
    }
  })
})

describe('dailyQuests', () => {
  it('en tire exactement trois', () => {
    expect(dailyQuests(DAY, USER)).toHaveLength(QUESTS_PER_DAY)
  })

  it('est déterministe : même jour, même élève, mêmes quêtes', () => {
    expect(dailyQuests(DAY, USER)).toEqual(dailyQuests(DAY, USER))
  })

  it('change de quêtes le lendemain', () => {
    const a = dailyQuests(DAY, USER).map((q) => q.id).join()
    const b = dailyQuests('2026-07-26', USER).map((q) => q.id).join()
    expect(b).not.toBe(a)
  })

  it('donne un palier facile, un moyen et un exigeant', () => {
    expect(dailyQuests(DAY, USER).map((q) => q.tier)).toEqual([
      'facile',
      'moyenne',
      'exigeante',
    ])
  })

  it('reste dans le catalogue sur de nombreux jours', () => {
    const ids = new Set(QUEST_CATALOG.map((q) => q.id))
    for (let i = 0; i < 120; i++) {
      const day = new Date(Date.UTC(2026, 0, 1) + i * 86_400_000)
        .toISOString()
        .slice(0, 10)
      for (const q of dailyQuests(day, USER)) expect(ids.has(q.id)).toBe(true)
    }
  })
})

describe('questView', () => {
  const def = QUEST_CATALOG.find((q) => q.id === 'duel3')!

  it('rend une quête vierge', () => {
    const v = questView(def, {})
    expect(v.current).toBe(0)
    expect(v.done).toBe(false)
    expect(v.ratio).toBe(0)
    expect(v.label).toBe('0/3')
  })

  it('borne l’affichage à l’objectif', () => {
    const v = questView(def, { duel3: 12 })
    expect(v.current).toBe(3)
    expect(v.ratio).toBe(1)
    expect(v.done).toBe(true)
    expect(v.label).toBe('3/3')
  })

  it('ignore une progression illisible', () => {
    expect(questView(def, { duel3: Number.NaN }).current).toBe(0)
  })
})

describe('agrégats', () => {
  it('compte les quêtes terminées', () => {
    const quests = dailyQuests(DAY, USER)
    const progress = { [quests[0].id]: quests[0].goal }
    const views = questViews(DAY, USER, progress)
    expect(doneCount(views)).toBe(1)
    expect(allDone(views)).toBe(false)
  })

  it('détecte la journée bouclée', () => {
    const quests = dailyQuests(DAY, USER)
    const progress = Object.fromEntries(quests.map((q) => [q.id, q.goal]))
    expect(allDone(questViews(DAY, USER, progress))).toBe(true)
  })

  it('ne déclare pas bouclée une liste vide', () => {
    expect(allDone([])).toBe(false)
  })
})

describe('questsHeadline', () => {
  it('annonce le prochain geste à faire', () => {
    const views = questViews(DAY, USER, {})
    expect(questsHeadline(views)).toBe(views[0].def.label)
  })

  it('félicite quand tout est fait', () => {
    const quests = dailyQuests(DAY, USER)
    const progress = Object.fromEntries(quests.map((q) => [q.id, q.goal]))
    expect(questsHeadline(questViews(DAY, USER, progress))).toContain('bouclée')
  })
})

describe('deltaFor', () => {
  it('traduit un duel gagné', () => {
    const d = deltaFor({ duelsPlayed: 1, duelsWon: 1, correct: 9, bestCombo: 4 })
    expect(d.add.duel_play).toBe(1)
    expect(d.add.duel_win).toBe(1)
    expect(d.add.correct).toBe(9)
    expect(d.max.combo).toBe(4)
  })

  it('dédoublonne les chapitres travaillés', () => {
    expect(deltaFor({ chapterIds: ['a', 'b', 'a'] }).add.chapter).toBe(2)
  })

  it('ignore les valeurs absurdes', () => {
    const d = deltaFor({ correct: -5, duelsWon: Number.NaN })
    expect(d.add.correct).toBe(0)
    expect(d.add.duel_win).toBe(0)
  })
})

describe('applyEvent', () => {
  it('ne modifie pas la progression reçue', () => {
    const before = Object.freeze({})
    const after = applyEvent(DAY, USER, before, { duelsPlayed: 1 })
    expect(after).not.toBe(before)
    expect(before).toEqual({})
  })

  it('cumule les quêtes de comptage', () => {
    let p = applyEvent(DAY, USER, {}, { correct: 10 })
    p = applyEvent(DAY, USER, p, { correct: 10 })
    const views = questViews(DAY, USER, p)
    const correctView = views.find((v) => v.def.kind === 'correct')
    if (correctView) expect(p[correctView.def.id]).toBe(20)
  })

  it('garde le RECORD pour les quêtes de série, jamais la somme', () => {
    // Un jour dont on sait qu'il tire une quête de série.
    const day = Array.from({ length: 60 }, (_, i) =>
      new Date(Date.UTC(2026, 0, 1) + i * 86_400_000).toISOString().slice(0, 10),
    ).find((d) => dailyQuests(d, USER).some((q) => q.kind === 'combo'))
    expect(day).toBeDefined()
    const quest = dailyQuests(day!, USER).find((q) => q.kind === 'combo')!

    let p = applyEvent(day!, USER, {}, { bestCombo: 5 })
    expect(p[quest.id]).toBe(5)
    p = applyEvent(day!, USER, p, { bestCombo: 3 })
    expect(p[quest.id]).toBe(5) // une série ne s'additionne pas
    p = applyEvent(day!, USER, p, { bestCombo: 9 })
    expect(p[quest.id]).toBe(9)
  })

  it('n’avance que les quêtes réellement tirées ce jour-là', () => {
    const tirees = new Set(dailyQuests(DAY, USER).map((q) => q.id))
    const p = applyEvent(DAY, USER, {}, { duelsPlayed: 5, correct: 40, revisions: 30 })
    for (const id of Object.keys(p)) expect(tirees.has(id)).toBe(true)
  })

  it('laisse la progression intacte quand rien ne s’est passé', () => {
    expect(applyEvent(DAY, USER, { x: 1 }, {})).toEqual({ x: 1 })
  })
})

describe('questsReward', () => {
  it('ne verse rien tant que rien n’est terminé', () => {
    expect(questsReward(questViews(DAY, USER, {}))).toEqual({ xp: 0, gems: 0 })
  })

  it('ajoute le bonus de journée complète', () => {
    const quests = dailyQuests(DAY, USER)
    const progress = Object.fromEntries(quests.map((q) => [q.id, q.goal]))
    const reward = questsReward(questViews(DAY, USER, progress))
    const somme = quests.reduce((s, q) => s + q.xp, 0)
    expect(reward.xp).toBe(somme + ALL_DONE_XP)
    expect(reward.gems).toBe(
      quests.reduce((s, q) => s + q.gems, 0) + ALL_DONE_GEMS,
    )
  })

  it('vaut plus que la somme des quêtes prises isolément', () => {
    const quests = dailyQuests(DAY, USER)
    const toutes = Object.fromEntries(quests.map((q) => [q.id, q.goal]))
    const deux = Object.fromEntries(quests.slice(0, 2).map((q) => [q.id, q.goal]))
    const complet = questsReward(questViews(DAY, USER, toutes)).xp
    const partiel = questsReward(questViews(DAY, USER, deux)).xp
    expect(complet - partiel).toBeGreaterThan(quests[2].xp)
  })
})

describe('normalizeProgress', () => {
  it('lit un objet valide', () => {
    expect(normalizeProgress({ duel3: 2, correct10: 7 })).toEqual({
      duel3: 2,
      correct10: 7,
    })
  })

  it('écarte les valeurs non numériques, nulles ou négatives', () => {
    expect(normalizeProgress({ a: 'x', b: -1, c: 0, d: 3.7 })).toEqual({ d: 3 })
  })

  it('survit à une donnée corrompue', () => {
    expect(normalizeProgress(null)).toEqual({})
    expect(normalizeProgress([1, 2])).toEqual({})
    expect(normalizeProgress('nope')).toEqual({})
  })
})
