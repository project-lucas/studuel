import { readFileSync } from 'node:fs'
import { describe, it, expect } from 'vitest'
import {
  PILIERS,
  quizReussi,
  type QuestKind,
  type QuetesDuJour,
  BONUS_STEP_ID,
  aEncaisser,
  coffreDuJourPret,
  coffreOuvrable,
  journeeBouclee,
  prochaineAEncaisser,
  queteServie,
  quetesAAnnoncer,
  QUEST_CATALOG,
  QUETES_RETIREES,
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
  it('a des identifiants uniques, et aucun parmi les retirées', () => {
    const ids = QUEST_CATALOG.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.filter((id) => QUETES_RETIREES.includes(id))).toEqual([])
  })

  it('est le trio minimal plus « Se connecter » : une quête par geste, la version la plus courte', () => {
    for (const pilier of PILIERS) {
      expect(QUEST_CATALOG.filter((q) => q.pilier === pilier)).toHaveLength(1)
    }
    expect(QUEST_CATALOG.map((q) => [q.id, q.goal])).toEqual([
      ['connexion1', 1],
      ['lecon1', 1],
      ['reponses10', 10],
      ['partie1', 1],
    ])
    // La connexion est la plus petite des récompenses : elle ne demande rien.
    const connexion = QUEST_CATALOG.find((q) => q.id === 'connexion1')!
    for (const q of QUEST_CATALOG) expect(q.xp).toBeGreaterThanOrEqual(connexion.xp)
  })

  // Garde-fou du 03/10/2026 : quatre quêtes comptaient des choses que rien
  // n'alimentait. Chaque type de quête a SON compteur, dans un fichier qui
  // appelle advanceQuests avec le champ d'événement correspondant — et la
  // lecture (13/10/2026) avance DANS la réponse, pas en différé.
  it("ne tire que des quêtes qu'un compteur fait avancer", () => {
    const compteurs: Record<QuestKind, [fichier: string, champ: string][]> = {
      connexion: [['app/api/quetes/route.ts', 'connexions:']],
      lecon: [['app/reviser/actions.ts', 'lecons:']],
      reponse: [
        ['app/test/actions.ts', 'reponses:'],
        ['app/reviser/actions.ts', 'reponses:'],
        ['app/defi/actions.ts', 'reponses:'],
        ['lib/duel/fin-course-server.ts', 'reponses:'],
      ],
      partie: [
        ['app/defi/actions.ts', 'parties:'],
        ['lib/duel/fin-course-server.ts', 'parties:'],
      ],
    }
    for (const q of QUEST_CATALOG) {
      for (const [fichier, champ] of compteurs[q.kind]) {
        const source = readFileSync(fichier, 'utf8')
        expect(source, `${q.id} : ${fichier} ne fait pas avancer les quêtes`).toMatch(/advanceQuests|avancerQuetesApres/)
        expect(source, `${q.id} : ${fichier} ne compte pas « ${champ} »`).toContain(champ)
      }
    }
    // La lecture s'enregistre dans la réponse de completeLesson, pas après.
    const lecon = readFileSync('app/reviser/actions.ts', 'utf8')
    expect(lecon).toMatch(/advanceQuests\(supabase, user\.id, \{ lecons: 1 \}\)/)
  })

  it('a des objectifs atteignables en une session', () => {
    for (const q of QUEST_CATALOG) {
      expect(q.goal).toBeGreaterThan(0)
      expect(q.goal).toBeLessThanOrEqual(10)
    }
  })
})

describe('dailyQuests', () => {
  it('en tire exactement quatre', () => {
    expect(dailyQuests(DAY, USER)).toHaveLength(QUESTS_PER_DAY)
  })

  it('est déterministe : même jour, même élève, mêmes quêtes', () => {
    expect(dailyQuests(DAY, USER)).toEqual(dailyQuests(DAY, USER))
  })

  it('donne une quête par geste : revenir, apprendre, se tester, jouer', () => {
    expect(dailyQuests(DAY, USER).map((q) => q.pilier)).toEqual(['revenir', 'apprendre', 'tester', 'jouer'])
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
  const def = QUEST_CATALOG.find((q) => q.id === 'reponses10')!

  it('rend une quête vierge', () => {
    const v = questView(def, {})
    expect(v.current).toBe(0)
    expect(v.done).toBe(false)
    expect(v.ratio).toBe(0)
    expect(v.label).toBe('0/10')
  })

  it('borne l’affichage à l’objectif', () => {
    const v = questView(def, { reponses10: 12 })
    expect(v.current).toBe(10)
    expect(v.ratio).toBe(1)
    expect(v.done).toBe(true)
    expect(v.label).toBe('10/10')
  })

  it('ignore une progression illisible', () => {
    expect(questView(def, { reponses10: Number.NaN }).current).toBe(0)
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
  it('traduit un cours, des réponses et une partie', () => {
    const d = deltaFor({ lecons: 1, reponses: 7, parties: 1 })
    expect(d.lecon).toBe(1)
    expect(d.reponse).toBe(7)
    expect(d.partie).toBe(1)
    expect(d.connexion).toBe(0)
  })

  it('traduit un passage dans l’app (la mission « Se connecter », 577)', () => {
    expect(deltaFor({ connexions: 1 }).connexion).toBe(1)
    expect(applyEvent(DAY, USER, {}, { connexions: 1 }).connexion1).toBe(1)
  })

  it('ignore les valeurs absurdes', () => {
    const d = deltaFor({ reponses: -5, parties: Number.NaN })
    expect(d.reponse).toBe(0)
    expect(d.partie).toBe(0)
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
    const after = applyEvent(DAY, USER, before, { lecons: 1, parties: 1 })
    expect(after).not.toBe(before)
    expect(before).toEqual({})
  })

  it('cumule les questions répondues, justes ou non', () => {
    let p = applyEvent(DAY, USER, {}, { reponses: 4 })
    p = applyEvent(DAY, USER, p, { reponses: 6 })
    expect(p.reponses10).toBe(10)
  })

  it('n’avance que les quêtes réellement tirées ce jour-là', () => {
    const tirees = new Set(dailyQuests(DAY, USER).map((q) => q.id))
    const p = applyEvent(DAY, USER, {}, { reponses: 40, lecons: 3, parties: 4 })
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
    expect(normalizeProgress({ lecon1: 1, reponses10: 7 })).toEqual({
      lecon1: 1,
      reponses10: 7,
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
    ['lecon1', 'reponses10', 'partie1'].map((id) => queteServie(questView(QUEST_CATALOG.find((q) => q.id === id)!, avancement)))
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
    expect(aEncaisser(etat({ lecon1: 1, reponses10: 4 })).map((q) => q.id)).toEqual(['lecon1'])
    expect(aEncaisser(etat({ lecon1: 1 }, ['lecon1']))).toEqual([])
  })

  it('ouvre le coffre du jour quand les trois sont finies, une seule fois', () => {
    const toutes = { lecon1: 1, reponses10: 10, partie1: 1 }
    expect(coffreDuJourPret(etat({ lecon1: 1 }))).toBe(false)
    expect(coffreDuJourPret(etat(toutes))).toBe(true)
    expect(coffreDuJourPret(etat(toutes, [BONUS_STEP_ID]))).toBe(false)
  })

  it('fait encaisser les quêtes UNE À UNE, puis seulement ouvrir le coffre', () => {
    const toutes = { lecon1: 1, reponses10: 10, partie1: 1 }
    // Toutes finies, aucune encaissée : la pièce appelle sur la première, le coffre attend.
    expect(prochaineAEncaisser(etat(toutes))?.id).toBe('lecon1')
    expect(coffreOuvrable(etat(toutes))).toBe(false)
    // Une encaissée : la suivante appelle.
    expect(prochaineAEncaisser(etat(toutes, ['lecon1']))?.id).toBe('reponses10')
    // En vol (26/10/2026) : une quête dont l'encaissement est parti ne bloque plus la suivante.
    expect(prochaineAEncaisser(etat(toutes), new Set(['lecon1']))?.id).toBe('reponses10')
    expect(coffreOuvrable(etat(toutes, ['lecon1', 'reponses10']))).toBe(false)
    // Les trois encaissées : plus de pièce, le coffre s'ouvre — une seule fois.
    const payees = ['lecon1', 'reponses10', 'partie1']
    expect(prochaineAEncaisser(etat(toutes, payees))).toBeNull()
    expect(coffreOuvrable(etat(toutes, payees))).toBe(true)
    expect(coffreOuvrable(etat(toutes, [...payees, BONUS_STEP_ID]))).toBe(false)
    // Une quête pas finie : jamais de coffre, même si les autres sont payées.
    expect(coffreOuvrable(etat({ lecon1: 1, reponses10: 10 }, ['lecon1', 'reponses10']))).toBe(false)
  })

  it('boucle la journée quand tout est encaissé, coffre compris — le bouton flottant s’en va', () => {
    const toutes = { lecon1: 1, reponses10: 10, partie1: 1 }
    const payees = ['lecon1', 'reponses10', 'partie1']
    // Rien de fait, ou des quêtes finies pas encore payées : il reste à faire.
    expect(journeeBouclee(etat({}))).toBe(false)
    expect(journeeBouclee(etat(toutes))).toBe(false)
    // Tout payé mais le coffre fermé : il reste le coffre.
    expect(journeeBouclee(etat(toutes, payees))).toBe(false)
    // Tout payé, coffre ouvert : la journée est bouclée.
    expect(journeeBouclee(etat(toutes, [...payees, BONUS_STEP_ID]))).toBe(true)
    // Sans quêtes servies, rien n’est bouclé (le bouton ne s’affiche pas non plus).
    expect(journeeBouclee({ jour: DAY, quetes: [], encaissees: [] })).toBe(false)
  })

  it('n’annonce une quête finie qu’une fois, et jamais une quête encaissée', () => {
    const e = etat({ lecon1: 1, reponses10: 10 })
    expect(quetesAAnnoncer(e, []).map((q) => q.id)).toEqual(['lecon1', 'reponses10'])
    expect(quetesAAnnoncer(e, ['lecon1']).map((q) => q.id)).toEqual(['reponses10'])
    expect(quetesAAnnoncer(etat({ lecon1: 1 }, ['lecon1']), [])).toEqual([])
  })
})
