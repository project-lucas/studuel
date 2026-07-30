import { describe, expect, it } from 'vitest'
import { bossById, bossForSubject } from '@/lib/bosses'
import {
  apparitionAlive,
  apparitionMessage,
  apparitionOf,
  attemptLabel,
  chasseOfDay,
  countdownLabel,
  crossedPalier,
  dayBossCards,
  emptyGauge,
  featuredCard,
  feedChapters,
  gaugePercent,
  gaugeRatio,
  gaugeStatus,
  gemsAfterCap,
  gemsForVictory,
  isEnChasse,
  isRattrapage,
  nextChasseDay,
  normalizeGauge,
  noxUnlocked,
  palierOf,
  pointsFor,
  pointsMissing,
  poolChapters,
  readyCount,
  remainingMs,
  restantLabel,
  sortCards,
  teaseLabel,
  traqueCard,
  weekdayIndex,
  windowEndMs,
  NOX_GEMS,
  TRAQUE_APRES_DEFAITE,
  TRAQUE_BANDEAU_MAX,
  TRAQUE_CHAPTERS_KEPT,
  TRAQUE_FENETRE_MS,
  TRAQUE_GEMS,
  TRAQUE_GEMS_WEEK_CAP,
  TRAQUE_POINTS,
  TRAQUE_POOL_CHAPTERS,
  TRAQUE_SEUIL,
  type TraqueGauge,
} from '@/lib/traque'

// 2026-07-27 est un LUNDI (référence des tests de calendrier du projet).
const LUNDI = '2026-07-27'
const MARDI = '2026-07-28'
const MERCREDI = '2026-07-29'
const SAMEDI = '2026-08-01'
const DIMANCHE = '2026-08-02'

const DELTA = bossById('delta')!
const GRAMMATORK = bossById('grammatork')!
const IMPERATOR = bossById('imperator')!

describe('barème', () => {
  it('additionne les points de chaque geste', () => {
    expect(pointsFor({ carte: 3 })).toBe(12)
    expect(pointsFor({ bonne_reponse: 5, lecon: 1 })).toBe(25)
    expect(pointsFor({ quiz_chapitre: 2, carte: 1 })).toBe(54)
  })

  it('ignore les valeurs absurdes plutôt que de créditer du vide', () => {
    expect(pointsFor({})).toBe(0)
    expect(pointsFor({ carte: -4 })).toBe(0)
    expect(pointsFor({ carte: Number.NaN })).toBe(0)
    expect(pointsFor({ carte: 1.9 })).toBe(TRAQUE_POINTS.carte)
  })

  it('atteint le seuil en ~20 min de travail réel (25 cartes)', () => {
    expect(pointsFor({ carte: 25 })).toBe(TRAQUE_SEUIL)
  })
})

describe('avancement de la jauge', () => {
  it('borne le ratio entre 0 et 1', () => {
    expect(gaugeRatio(-10)).toBe(0)
    expect(gaugeRatio(50)).toBe(0.5)
    expect(gaugeRatio(500)).toBe(1)
  })

  it('donne un pourcentage entier', () => {
    expect(gaugePercent(0)).toBe(0)
    expect(gaugePercent(82)).toBe(82)
    expect(gaugePercent(140)).toBe(100)
  })

  it('découpe la montée en dix paliers', () => {
    expect(palierOf(0)).toBe(0)
    expect(palierOf(19)).toBe(1)
    expect(palierOf(100)).toBe(10)
  })

  it('signale le franchissement de palier, pas la simple montée', () => {
    expect(crossedPalier(18, 19)).toBe(false)
    expect(crossedPalier(18, 22)).toBe(true)
  })

  it('compte ce qui manque en points', () => {
    expect(pointsMissing(80)).toBe(20)
    expect(pointsMissing(120)).toBe(0)
  })
})

describe('libellés — jamais un pourcentage nu', () => {
  it('traduit le reste à faire en gestes concrets', () => {
    expect(restantLabel(80)).toBe('5 cartes de plus')
    expect(restantLabel(97)).toBe('1 carte de plus')
    expect(restantLabel(100)).toBe('Prêt à sortir !')
  })

  it('nomme le boss dans la phrase de taquinerie', () => {
    expect(teaseLabel('Delta', 80)).toBe(
      'Delta est à 5 cartes de sortir de sa tanière.',
    )
    expect(teaseLabel('Delta', 100)).toBe('Delta est prêt à sortir !')
  })

  it('annonce l’apparition façon message éclair', () => {
    expect(apparitionMessage(DELTA)).toBe('Delta a surgi de sa tanière !')
  })

  it('met en forme le compte à rebours', () => {
    expect(countdownLabel(0)).toBe("moins d'une minute")
    expect(countdownLabel(42 * 60_000)).toBe('42 min')
    expect(countdownLabel(60 * 60_000)).toBe('1 h')
    expect(countdownLabel(62 * 60_000)).toBe('1 h 02')
  })
})

describe('fenêtre de combat — une heure', () => {
  const debusque = (iso: string): TraqueGauge => ({
    ...emptyGauge('delta'),
    points: TRAQUE_SEUIL,
    debusqueAt: iso,
  })
  const T0 = Date.parse('2026-07-27T18:00:00.000Z')

  it('rôde tant que la jauge n’est pas pleine', () => {
    expect(gaugeStatus(emptyGauge('delta'), T0)).toBe('traque')
    expect(windowEndMs(emptyGauge('delta'))).toBeNull()
  })

  it('reste défiable pendant une heure exactement', () => {
    const g = debusque('2026-07-27T18:00:00.000Z')
    expect(gaugeStatus(g, T0 + 59 * 60_000)).toBe('debusque')
    expect(gaugeStatus(g, T0 + TRAQUE_FENETRE_MS)).toBe('expire')
    expect(remainingMs(g, T0 + 15 * 60_000)).toBe(45 * 60_000)
    expect(remainingMs(g, T0 + 2 * TRAQUE_FENETRE_MS)).toBe(0)
  })

  it('ignore une date de débusquage illisible plutôt que de planter', () => {
    const g = debusque('pas-une-date')
    expect(windowEndMs(g)).toBeNull()
    expect(gaugeStatus(g, T0)).toBe('traque')
  })
})

describe('chapitres nourris — le pool du combat', () => {
  it('garde les plus récents en tête et déduplique', () => {
    expect(poolChapters(['a', 'b', 'a', 'c'], 3)).toEqual(['a', 'b', 'c'])
  })

  it('borne le pool du combat', () => {
    const many = Array.from({ length: 20 }, (_, i) => `c${i}`)
    expect(poolChapters(many)).toHaveLength(TRAQUE_POOL_CHAPTERS)
  })

  it('fait passer le chapitre fraîchement travaillé devant', () => {
    expect(feedChapters(['a', 'b'], ['c'])).toEqual(['c', 'a', 'b'])
    // Retravailler un chapitre le remonte au lieu de le dupliquer.
    expect(feedChapters(['a', 'b'], ['b'])).toEqual(['b', 'a'])
  })

  it('ne laisse jamais la liste enfler sans fin', () => {
    const many = Array.from({ length: 30 }, (_, i) => `c${i}`)
    expect(feedChapters(many, ['neuf'])).toHaveLength(TRAQUE_CHAPTERS_KEPT)
  })
})

describe('calendrier de la chasse', () => {
  it('place lundi en index 0 (convention du projet)', () => {
    expect(weekdayIndex(LUNDI)).toBe(0)
    expect(weekdayIndex(DIMANCHE)).toBe(6)
  })

  it('donne le bonus aux deux boss du jour, pas aux autres', () => {
    expect(isEnChasse('delta', LUNDI)).toBe(true)
    expect(isEnChasse('imperator', LUNDI)).toBe(true)
    expect(isEnChasse('grammatork', LUNDI)).toBe(false)
    expect(isEnChasse('grammatork', MARDI)).toBe(true)
  })

  it('ouvre la chasse à TOUS le week-end (rattrapage)', () => {
    expect(isRattrapage(SAMEDI)).toBe(true)
    expect(isEnChasse('grammatork', SAMEDI)).toBe(true)
    expect(isEnChasse('bigben', DIMANCHE)).toBe(true)
  })

  it('mêle chaque jour une scientifique et une littéraire ou une langue', () => {
    const mercredi = chasseOfDay(MERCREDI).map((b) => b.id)
    expect(mercredi).toEqual(['chronos', 'bigben'])
    // Le week-end, la liste est vide : c'est « tout le monde », pas « personne ».
    expect(chasseOfDay(SAMEDI)).toEqual([])
  })

  it('dit quand le boss revient en chasse', () => {
    expect(nextChasseDay('delta', LUNDI)).toBeNull()
    expect(nextChasseDay('bigben', LUNDI)).toBe('mercredi')
    expect(nextChasseDay('delta', MARDI)).toBe('samedi')
  })

  it('n’adresse jamais un id inconnu au calendrier', () => {
    expect(isEnChasse('inconnu', LUNDI)).toBe(false)
    expect(nextChasseDay('inconnu', LUNDI)).toBe('samedi')
  })
})

describe('Nox — le boss du dimanche', () => {
  it('n’ouvre que le dimanche, et seulement après trois victoires', () => {
    expect(noxUnlocked(3, DIMANCHE)).toBe(true)
    expect(noxUnlocked(2, DIMANCHE)).toBe(false)
    expect(noxUnlocked(5, SAMEDI)).toBe(false)
  })
})

describe('récompenses', () => {
  it('paie plus cher les rangs élevés', () => {
    expect(gemsForVictory(1, false)).toBe(TRAQUE_GEMS[1])
    expect(gemsForVictory(3, false)).toBe(TRAQUE_GEMS[3])
  })

  it('double la mise pour le boss en chasse du jour', () => {
    expect(gemsForVictory(2, true)).toBe(TRAQUE_GEMS[2] * 2)
  })

  it('verse un chapitre entier pour Nox, sans doubler', () => {
    expect(gemsForVictory(1, true, true)).toBe(NOX_GEMS)
  })

  it('respecte le plafond hebdomadaire — l’inflation tuerait Studuel+', () => {
    expect(gemsAfterCap(20, 0)).toBe(20)
    expect(gemsAfterCap(20, TRAQUE_GEMS_WEEK_CAP - 5)).toBe(5)
    expect(gemsAfterCap(20, TRAQUE_GEMS_WEEK_CAP)).toBe(0)
    expect(gemsAfterCap(20, 999)).toBe(0)
  })
})

describe('cartes de la feuille Boss', () => {
  const T0 = Date.parse('2026-07-27T18:00:00.000Z')
  const card = (g: Partial<TraqueGauge>, boss = DELTA, day = LUNDI) =>
    traqueCard({ ...emptyGauge(boss.id), ...g }, boss, 'Maths', day, T0)

  it('affiche l’avancement et ce qu’il reste à faire', () => {
    const c = card({ points: 80 })
    expect(c.status).toBe('traque')
    expect(c.percent).toBe(80)
    expect(c.hint).toBe('Delta est à 5 cartes de sortir de sa tanière.')
  })

  it('bascule sur le compte à rebours dès que le boss est sorti', () => {
    const c = card({
      points: TRAQUE_SEUIL,
      debusqueAt: '2026-07-27T17:45:00.000Z',
    })
    expect(c.status).toBe('debusque')
    expect(c.hint).toBe('Il disparaît dans 45 min')
  })

  it('redescend la jauge à la moitié quand la fenêtre est passée', () => {
    const c = card({
      points: TRAQUE_SEUIL,
      debusqueAt: '2026-07-27T10:00:00.000Z',
    })
    expect(c.status).toBe('expire')
    expect(c.points).toBe(TRAQUE_APRES_DEFAITE)
  })

  it('monte le boss en rang à chaque victoire, jusqu’au rang III', () => {
    expect(card({ victories: 0 }).rank).toBe(1)
    expect(card({ victories: 2 }).rank).toBe(3)
    expect(card({ victories: 9 }).rank).toBe(3)
  })

  it('annonce les gemmes en jeu, bonus du jour compris', () => {
    expect(card({}).gems).toBe(TRAQUE_GEMS[1] * 2) // Delta chasse le lundi
    expect(card({}, GRAMMATORK).gems).toBe(TRAQUE_GEMS[1])
    expect(card({}, GRAMMATORK).backOn).toBe('mardi')
  })
})

describe('tri et mise en avant', () => {
  const T0 = Date.parse('2026-07-27T18:00:00.000Z')
  const make = (
    boss = DELTA,
    points = 0,
    debusqueAt: string | null = null,
  ) =>
    traqueCard(
      { ...emptyGauge(boss.id), points, debusqueAt },
      boss,
      'Maths',
      LUNDI,
      T0,
    )

  it('met ce qui se joue MAINTENANT en tête, puis les jauges les plus pleines', () => {
    const sorted = sortCards([
      make(DELTA, 40),
      make(GRAMMATORK, TRAQUE_SEUIL, '2026-07-27T17:30:00.000Z'),
      make(DELTA, 90),
    ])
    expect(sorted[0].boss.id).toBe('grammatork')
    expect(sorted[1].points).toBe(90)
  })

  it('compte les boss sortis pour la pastille de la tuile', () => {
    expect(
      readyCount([
        make(DELTA, 40),
        make(GRAMMATORK, TRAQUE_SEUIL, '2026-07-27T17:30:00.000Z'),
      ]),
    ).toBe(1)
  })

  it('met en avant celui dont la fenêtre se referme le plus tôt', () => {
    const urgent = make(DELTA, TRAQUE_SEUIL, '2026-07-27T17:50:00.000Z')
    const tranquille = make(
      GRAMMATORK,
      TRAQUE_SEUIL,
      '2026-07-27T17:59:00.000Z',
    )
    expect(featuredCard([tranquille, urgent])?.boss.id).toBe('delta')
    expect(featuredCard([make(DELTA, 40)])).toBeNull()
  })
})

describe('bandeau des gardiens du jour (arène)', () => {
  const T0 = Date.parse('2026-07-27T18:00:00.000Z')
  // Lundi : Delta (Maths) et Imperator (Latin) sont en chasse, pas Grammatork.
  const make = (
    boss = DELTA,
    points = 0,
    debusqueAt: string | null = null,
  ) =>
    traqueCard(
      { ...emptyGauge(boss.id), points, debusqueAt },
      boss,
      'Maths',
      LUNDI,
      T0,
    )

  it('montre les gardiens EN CHASSE avant les autres, même moins avancés', () => {
    const cards = dayBossCards([make(GRAMMATORK, 90), make(DELTA, 20)])
    expect(cards.map((c) => c.boss.id)).toEqual(['delta', 'grammatork'])
  })

  it('ne dépasse jamais la place disponible sur l’écran d’arène', () => {
    const cards = dayBossCards([
      make(DELTA, 20),
      make(IMPERATOR, 30),
      make(GRAMMATORK, 90),
    ])
    expect(cards).toHaveLength(TRAQUE_BANDEAU_MAX)
    expect(cards.map((c) => c.boss.id)).toEqual(['imperator', 'delta'])
  })

  it('écarte le gardien déjà annoncé en grand par le message éclair', () => {
    const sorti = make(DELTA, TRAQUE_SEUIL, '2026-07-27T17:30:00.000Z')
    const cards = dayBossCards([sorti, make(GRAMMATORK, 40)], 2, 'delta')
    expect(cards.map((c) => c.boss.id)).toEqual(['grammatork'])
  })

  it('ne rend rien quand il n’y a pas de place ou pas de jauge', () => {
    expect(dayBossCards([make(DELTA, 20)], 0)).toEqual([])
    expect(dayBossCards([])).toEqual([])
  })
})

// La règle du jeu tient en une phrase : le gardien sort pour UNE HEURE, et
// cette heure appartient à l'élève. Perdre ne la lui reprend pas (migration
// 213) — c'est ce que ces tests verrouillent.
describe('la défaite ne referme pas la fenêtre', () => {
  const T0 = Date.parse('2026-07-27T18:00:00.000Z')
  const sorti = (attempts: number): TraqueGauge => ({
    ...emptyGauge(DELTA.id),
    points: TRAQUE_SEUIL,
    attempts,
    debusqueAt: '2026-07-27T17:30:00.000Z',
  })

  it('laisse le gardien défiable après deux combats perdus', () => {
    const card = traqueCard(sorti(2), DELTA, 'Maths', LUNDI, T0)
    expect(card.status).toBe('debusque')
    expect(card.percent).toBe(100)
    expect(card.attempts).toBe(2)
    expect(card.remainingMs).toBe(30 * 60_000)
  })

  it('ne solde la jauge qu’à l’expiration de l’heure', () => {
    const card = traqueCard(sorti(2), DELTA, 'Maths', LUNDI, T0 + TRAQUE_FENETRE_MS)
    expect(card.status).toBe('expire')
    expect(card.points).toBe(TRAQUE_APRES_DEFAITE)
    // Compteur d'essais remis à zéro avec la fenêtre : la prochaine sortie
    // repart d'un « 1er essai ».
    expect(card.attempts).toBe(0)
  })

  it('change le message éclair quand il est déjà retenté', () => {
    expect(apparitionMessage(DELTA)).toContain('a surgi')
    expect(apparitionMessage(DELTA, 1)).toContain('t’attend toujours')
  })

  it('numérote les essais à partir de 1', () => {
    expect(attemptLabel(0)).toBe('1er essai')
    expect(attemptLabel(2)).toBe('3e essai')
    expect(attemptLabel(-4)).toBe('1er essai')
  })
})

describe('normalisation des lignes de base', () => {
  it('lit une ligne complète', () => {
    expect(
      normalizeGauge({
        boss_id: 'delta',
        points: 42,
        chapters: ['a', 'b'],
        victories: 2,
        attempts: 1,
        debusque_at: '2026-07-27T18:00:00.000Z',
      }),
    ).toEqual({
      bossId: 'delta',
      points: 42,
      chapters: ['a', 'b'],
      victories: 2,
      attempts: 1,
      debusqueAt: '2026-07-27T18:00:00.000Z',
    })
  })

  // La 213 ajoute `attempts` : une base restée en 212 ne la renvoie pas, et la
  // traque doit continuer de fonctionner (compteur à zéro).
  it('tolère une ligne sans compteur d’essais (base en 212)', () => {
    expect(
      normalizeGauge({ boss_id: 'delta', points: 10, victories: 0 })?.attempts,
    ).toBe(0)
  })

  it('refuse ce qui n’est pas une jauge', () => {
    expect(normalizeGauge(null)).toBeNull()
    expect(normalizeGauge({ points: 10 })).toBeNull()
  })

  it('assainit les champs douteux au lieu de les propager', () => {
    const g = normalizeGauge({
      boss_id: 'delta',
      points: -5,
      chapters: ['a', 42, null, 'a'],
      victories: 'trois',
      attempts: -2,
      debusque_at: 7,
    })
    expect(g).toEqual({
      bossId: 'delta',
      points: 0,
      chapters: ['a'],
      victories: 0,
      attempts: 0,
      debusqueAt: null,
    })
  })
})

describe("rideau d'apparition", () => {
  const T = 1_800_000_000_000
  const credit = (
    bossId: string,
    justDebusque: boolean,
    debusqueAt: number | null = T,
  ) => ({ boss: { id: bossId }, subject: 'Maths', justDebusque, debusqueAt })

  it("n'ouvre rien quand aucune jauge n'a débordé", () => {
    expect(apparitionOf([], T)).toBeNull()
    expect(apparitionOf([credit('delta', false)], T)).toBeNull()
  })

  it('ouvre sur le gardien qui vient de sortir', () => {
    expect(apparitionOf([credit('delta', true)], T)).toEqual({
      bossId: 'delta',
      subject: 'Maths',
      endsAt: T + TRAQUE_FENETRE_MS,
    })
  })

  it("n'ouvre qu'UN rideau même si deux jauges débordent", () => {
    const a = apparitionOf(
      [credit('delta', true), credit('grammatork', true)],
      T,
    )
    expect(a?.bossId).toBe('delta')
  })

  it('ignore les jauges créditées qui ne débusquent pas', () => {
    const a = apparitionOf([credit('delta', false), credit('grammatork', true)], T)
    expect(a?.bossId).toBe('grammatork')
  })

  it("retombe sur maintenant quand la base ne rend pas l'heure de sortie", () => {
    const a = apparitionOf([credit('delta', true, null)], T)
    expect(a?.endsAt).toBe(T + TRAQUE_FENETRE_MS)
  })

  it('meurt avec sa fenêtre — un écran de fin laissé ouvert ne promet plus rien', () => {
    const a = apparitionOf([credit('delta', true)], T)!
    expect(apparitionAlive(a, T)).toBe(true)
    expect(apparitionAlive(a, T + TRAQUE_FENETRE_MS - 1)).toBe(true)
    expect(apparitionAlive(a, T + TRAQUE_FENETRE_MS)).toBe(false)
    expect(apparitionAlive(a, T + 2 * TRAQUE_FENETRE_MS)).toBe(false)
  })
})

describe('accord avec le catalogue des boss', () => {
  it('fait chasser des boss qui existent vraiment', () => {
    for (const day of [LUNDI, MARDI, MERCREDI, '2026-07-30', '2026-07-31']) {
      const bosses = chasseOfDay(day)
      expect(bosses).toHaveLength(2)
      for (const b of bosses) expect(bossById(b.id)).toBeDefined()
    }
  })

  it('chasse bien le gardien de la matière annoncée', () => {
    expect(bossForSubject('Mathématiques').id).toBe('delta')
    expect(isEnChasse(bossForSubject('Mathématiques').id, LUNDI)).toBe(true)
    expect(isEnChasse(bossForSubject('Français').id, MARDI)).toBe(true)
    expect(isEnChasse(bossForSubject('Anglais').id, MERCREDI)).toBe(true)
  })
})
