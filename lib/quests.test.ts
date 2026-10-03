import { readFileSync } from 'node:fs'
import { describe, it, expect } from 'vitest'
import {
  PILIERS,
  contexteQuetes,
  quizReussi,
  type QuestKind,
  type QuetesDuJour,
  BONUS_STEP_ID,
  aEncaisser,
  coffreDuJourPret,
  queteServie,
  quetesAAnnoncer,
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
  libelleRenouvellement,
  minutesAvantMinuitUtc,
} from './quests'

const DAY = '2026-07-25'
const USER = 'user-abc'

describe('catalogue', () => {
  it('a des identifiants uniques', () => {
    const ids = QUEST_CATALOG.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('a au moins une quête par geste, sans le cahier', () => {
    for (const pilier of PILIERS) {
      expect(QUEST_CATALOG.filter((q) => q.pilier === pilier && !q.cahier).length).toBeGreaterThan(0)
    }
  })

  // Garde-fou du 03/10/2026 : quatre quêtes comptaient des choses que rien
  // n'alimentait. Chaque type de quête a SON compteur, dans un fichier qui
  // appelle advanceQuests avec le champ d'événement correspondant.
  it("ne tire que des quêtes qu'un compteur fait avancer", () => {
    const compteurs: Record<QuestKind, [fichier: string, champ: string]> = {
      lecon: ['app/reviser/actions.ts', 'lecons:'],
      quiz: ['app/test/actions.ts', 'quiz:'],
      quiz_reussi: ['app/test/actions.ts', 'quizReussis:'],
      correct: ['lib/duel/fin-course-server.ts', 'correct:'],
      exercice: ['app/reviser/[subject]/[chapter]/exercice/cahier-actions.ts', 'exercicesReussis:'],
      duel_play: ['lib/duel/fin-course-server.ts', 'duelsPlayed:'],
      duel_win: ['lib/duel/fin-course-server.ts', 'duelsWon:'],
      partie: ['app/defi/actions.ts', 'parties:'],
    }
    for (const q of QUEST_CATALOG) {
      const [fichier, champ] = compteurs[q.kind]
      const source = readFileSync(fichier, 'utf8')
      expect(source, `${q.id} : ${fichier} ne fait pas avancer les quêtes`).toMatch(/advanceQuests|avancerQuetesApres/)
      expect(source, `${q.id} : ${fichier} ne compte pas « ${champ} »`).toContain(champ)
    }
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

  it('donne une quête par geste : apprendre, se tester, jouer', () => {
    expect(dailyQuests(DAY, USER).map((q) => q.pilier)).toEqual(['apprendre', 'tester', 'jouer'])
  })

  it('ne tire le cahier que pour un abonné dont la classe en a un', () => {
    const jours = Array.from({ length: 200 }, (_, i) =>
      new Date(Date.UTC(2026, 0, 1) + i * 86_400_000).toISOString().slice(0, 10),
    )
    const sans = jours.flatMap((d) => dailyQuests(d, USER))
    expect(sans.some((q) => q.cahier)).toBe(false)
    const avec = jours.flatMap((d) => dailyQuests(d, USER, { cahier: true }))
    expect(avec.some((q) => q.cahier)).toBe(true)
  })

  it('ouvre le cahier aux seuls abonnés de 3e, 1re et Terminale', () => {
    expect(contexteQuetes(true, '3e').cahier).toBe(true)
    expect(contexteQuetes(true, 'Tle').cahier).toBe(true)
    expect(contexteQuetes(false, '3e').cahier).toBe(false)
    expect(contexteQuetes(true, '5e').cahier).toBe(false)
    expect(contexteQuetes(true, null).cahier).toBe(false)
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
  const def = QUEST_CATALOG.find((q) => q.id === 'partie2')!

  it('rend une quête vierge', () => {
    const v = questView(def, {})
    expect(v.current).toBe(0)
    expect(v.done).toBe(false)
    expect(v.ratio).toBe(0)
    expect(v.label).toBe('0/2')
  })

  it('borne l’affichage à l’objectif', () => {
    const v = questView(def, { partie2: 12 })
    expect(v.current).toBe(2)
    expect(v.ratio).toBe(1)
    expect(v.done).toBe(true)
    expect(v.label).toBe('2/2')
  })

  it('ignore une progression illisible', () => {
    expect(questView(def, { partie2: Number.NaN }).current).toBe(0)
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
    const d = deltaFor({ duelsPlayed: 1, duelsWon: 1, correct: 9 })
    expect(d.duel_play).toBe(1)
    expect(d.duel_win).toBe(1)
    expect(d.correct).toBe(9)
  })

  it('traduit un cours, un quiz réussi, un exercice et une partie', () => {
    const d = deltaFor({ lecons: 1, quiz: 1, quizReussis: 1, exercicesReussis: 1, parties: 1 })
    expect(d.lecon).toBe(1)
    expect(d.quiz).toBe(1)
    expect(d.quiz_reussi).toBe(1)
    expect(d.exercice).toBe(1)
    expect(d.partie).toBe(1)
  })

  it('ignore les valeurs absurdes', () => {
    const d = deltaFor({ correct: -5, duelsWon: Number.NaN })
    expect(d.correct).toBe(0)
    expect(d.duel_win).toBe(0)
  })
})

describe('quizReussi', () => {
  it('réussit à partir de 80 %', () => {
    expect(quizReussi(8, 10)).toBe(true)
    expect(quizReussi(4, 5)).toBe(true)
    expect(quizReussi(7, 10)).toBe(false)
    expect(quizReussi(0, 0)).toBe(false)
  })
})

describe('applyEvent', () => {
  it('ne modifie pas la progression reçue', () => {
    const before = Object.freeze({})
    const after = applyEvent(DAY, USER, before, { duelsPlayed: 1, lecons: 1, parties: 1 })
    expect(after).not.toBe(before)
    expect(before).toEqual({})
  })

  it('cumule les quêtes de comptage', () => {
    const jour = Array.from({ length: 60 }, (_, i) =>
      new Date(Date.UTC(2026, 0, 1) + i * 86_400_000).toISOString().slice(0, 10),
    ).find((d) => dailyQuests(d, USER).some((q) => q.kind === 'correct'))!
    const quete = dailyQuests(jour, USER).find((q) => q.kind === 'correct')!
    let p = applyEvent(jour, USER, {}, { correct: 10 })
    p = applyEvent(jour, USER, p, { correct: 10 })
    expect(p[quete.id]).toBe(20)
  })

  it('n’avance que les quêtes réellement tirées ce jour-là', () => {
    const tirees = new Set(dailyQuests(DAY, USER).map((q) => q.id))
    const p = applyEvent(DAY, USER, {}, { duelsPlayed: 5, correct: 40, lecons: 3, quiz: 2, parties: 4 })
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
    expect(normalizeProgress({ lecon2: 2, correct20: 7 })).toEqual({
      lecon2: 2,
      correct20: 7,
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

describe('le renouvellement des quêtes', () => {
  it('compte les minutes avant minuit UTC, la minute en cours comprise', () => {
    expect(minutesAvantMinuitUtc(Date.UTC(2026, 8, 22, 18, 48))).toBe(312)
    expect(minutesAvantMinuitUtc(Date.UTC(2026, 8, 22, 23, 59, 30))).toBe(1)
    expect(minutesAvantMinuitUtc(Date.UTC(2026, 8, 22, 0, 0, 0))).toBe(1440)
  })

  it('écrit la pastille du jour', () => {
    expect(libelleRenouvellement(null)).toBe('Nouvelles quêtes chaque jour')
    expect(libelleRenouvellement(8)).toBe('Nouvelles quêtes dans 8 min')
    expect(libelleRenouvellement(312)).toBe('Nouvelles quêtes dans 5 h 12')
    expect(libelleRenouvellement(120)).toBe('Nouvelles quêtes dans 2 h')
  })
})

describe('ce que le navigateur reçoit', () => {
  const vues = (avancement: Record<string, number>) =>
    ['lecon1', 'quiz80', 'partie2'].map((id) => queteServie(questView(QUEST_CATALOG.find((q) => q.id === id)!, avancement)))
  const etat = (avancement: Record<string, number>, encaissees: string[] = []): QuetesDuJour => ({
    jour: DAY,
    quetes: vues(avancement),
    encaissees,
  })

  it('aplatit une quête sans perdre son geste ni sa destination', () => {
    const [cours] = vues({ lecon1: 1 })
    expect(cours).toMatchObject({ id: 'lecon1', pilier: 'apprendre', href: '/reviser', done: true, current: 1, goal: 1 })
  })

  it('ne propose d’encaisser que ce qui est fini et pas encore payé', () => {
    expect(aEncaisser(etat({ lecon1: 1, partie2: 1 })).map((q) => q.id)).toEqual(['lecon1'])
    expect(aEncaisser(etat({ lecon1: 1 }, ['lecon1']))).toEqual([])
  })

  it('ouvre le coffre du jour quand les trois sont finies, une seule fois', () => {
    const toutes = { lecon1: 1, quiz80: 1, partie2: 2 }
    expect(coffreDuJourPret(etat({ lecon1: 1 }))).toBe(false)
    expect(coffreDuJourPret(etat(toutes))).toBe(true)
    expect(coffreDuJourPret(etat(toutes, [BONUS_STEP_ID]))).toBe(false)
  })

  it('n’annonce une quête finie qu’une fois, et jamais une quête encaissée', () => {
    const e = etat({ lecon1: 1, quiz80: 1 })
    expect(quetesAAnnoncer(e, []).map((q) => q.id)).toEqual(['lecon1', 'quiz80'])
    expect(quetesAAnnoncer(e, ['lecon1']).map((q) => q.id)).toEqual(['quiz80'])
    expect(quetesAAnnoncer(etat({ lecon1: 1 }, ['lecon1']), [])).toEqual([])
  })
})
