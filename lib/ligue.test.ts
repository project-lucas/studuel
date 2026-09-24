import { describe, expect, it, vi } from 'vitest'
import {
  ECHELON_MAX,
  NB_ECHELONS,
  TAILLE_GROUPE,
  changeDeRang,
  classer,
  echelon,
  finDeSemaine,
  gemmesDeFinDeSemaine,
  libelleFin,
  lireEtatLigue,
  lundiUTC,
  mouvement,
  mouvementDuBilan,
  nbPromus,
  nbRelegues,
  railLigue,
  regleDeLaSemaine,
  zoneDe,
  recitBilan,
  classerAmis,
  amiDevant,
  doitProposerInvitation,
  lignesGainsBilan,
  nombreFr,
  multiplicateurXp,
  libelleMultiplicateur,
  xpAvecMultiplicateur,
  calculerCoffre,
  niveauCoffre,
  contenuCoffre,
  progressionCoffre,
  tronconsCoffre,
  lireOuvertureCoffre,
  gainsOuverture,
  annoncerCoffrePret,
  coffrePretEnAttente,
  ecouterCoffrePret,
  COFFRE_NIVEAUX,
  annoncerBilanLigue,
  bilanLigueEnAttente,
  ecouterBilanLigue,
  type BilanLigue,
  type JoueurAmi,
} from './ligue'

describe('les échelons', () => {
  it('vont de Bronze 4 à Maître, 4 divisions par rang sauf le sommet', () => {
    expect(NB_ECHELONS).toBe(21)
    expect(echelon(0).nom).toBe('Bronze 4')
    expect(echelon(3).nom).toBe('Bronze 1')
    expect(echelon(4).nom).toBe('Argent 4')
    expect(echelon(19).nom).toBe('Diamant 1')
    expect(echelon(ECHELON_MAX).nom).toBe('Maître')
    expect(echelon(ECHELON_MAX).division).toBeNull()
  })

  it('bornent un index hors de l’échelle', () => {
    expect(echelon(-3).index).toBe(0)
    expect(echelon(99).index).toBe(ECHELON_MAX)
    expect(echelon(Number.NaN).index).toBe(0)
  })
})

describe('qui monte, qui descend', () => {
  it('7 montent et 5 descendent dans un groupe plein, comme Duolingo', () => {
    expect(nbPromus(TAILLE_GROUPE, 5)).toBe(7)
    expect(nbRelegues(TAILLE_GROUPE, 5)).toBe(5)
  })

  it('reste proportionnel dans un petit groupe, et seul on ne bouge pas', () => {
    expect(nbPromus(10, 5)).toBe(2)
    expect(nbRelegues(10, 5)).toBe(1)
    expect(nbPromus(2, 5)).toBe(1)
    expect(nbPromus(1, 5)).toBe(0)
    expect(nbRelegues(1, 5)).toBe(0)
  })

  it('personne ne monte au-dessus de Maître, personne ne descend sous Bronze 4', () => {
    expect(nbPromus(30, ECHELON_MAX)).toBe(0)
    expect(nbRelegues(30, 0)).toBe(0)
  })

  it('décide du mouvement : il faut de l’XP pour monter', () => {
    expect(mouvement({ rang: 1, taille: 30, echelon: 2, xp: 400 })).toBe('promu')
    expect(mouvement({ rang: 1, taille: 30, echelon: 2, xp: 0 })).toBe('maintenu')
    expect(mouvement({ rang: 15, taille: 30, echelon: 2, xp: 90 })).toBe('maintenu')
    expect(mouvement({ rang: 30, taille: 30, echelon: 2, xp: 5 })).toBe('relegue')
    expect(mouvement({ rang: 30, taille: 30, echelon: 0, xp: 0 })).toBe('maintenu')
  })

  it('pose les zones de la liste', () => {
    expect(zoneDe(7, 7, 5, 30)).toBe('promotion')
    expect(zoneDe(8, 7, 5, 30)).toBe('neutre')
    expect(zoneDe(26, 7, 5, 30)).toBe('relegation')
    expect(zoneDe(25, 7, 5, 30)).toBe('neutre')
  })
})

describe('le classement', () => {
  it('trie à l’XP, puis au premier arrivé, puis à l’identifiant', () => {
    const tries = classer([
      { id: 'c', xp: 50, rejointLe: '2026-09-21T10:00:00Z' },
      { id: 'a', xp: 90, rejointLe: '2026-09-22T10:00:00Z' },
      { id: 'b', xp: 50, rejointLe: '2026-09-21T09:00:00Z' },
      { id: 'd', xp: 50, rejointLe: '2026-09-21T09:00:00Z' },
    ])
    expect(tries.map((m) => [m.id, m.rang])).toEqual([
      ['a', 1],
      ['b', 2],
      ['d', 3],
      ['c', 4],
    ])
  })
})

describe('les gemmes de fin de semaine', () => {
  it('paient la montée d’une division, davantage le passage de rang', () => {
    expect(gemmesDeFinDeSemaine({ avant: 1, apres: 2, rang: 5, xp: 100 })).toBe(10)
    expect(gemmesDeFinDeSemaine({ avant: 3, apres: 4, rang: 5, xp: 100 })).toBe(25)
  })

  it('ajoutent le podium, jamais sans XP', () => {
    expect(gemmesDeFinDeSemaine({ avant: 1, apres: 2, rang: 1, xp: 100 })).toBe(25)
    expect(gemmesDeFinDeSemaine({ avant: 1, apres: 1, rang: 3, xp: 100 })).toBe(5)
    expect(gemmesDeFinDeSemaine({ avant: 1, apres: 1, rang: 1, xp: 0 })).toBe(0)
    expect(gemmesDeFinDeSemaine({ avant: 2, apres: 1, rang: 30, xp: 0 })).toBe(0)
  })
})

describe('la semaine', () => {
  it('commence le lundi à minuit UTC', () => {
    expect(lundiUTC(new Date('2026-09-24T15:00:00Z'))).toBe('2026-09-21')
    expect(lundiUTC(new Date('2026-09-21T00:00:00Z'))).toBe('2026-09-21')
    expect(lundiUTC(new Date('2026-09-20T23:59:59Z'))).toBe('2026-09-14')
    expect(finDeSemaine(new Date('2026-09-24T15:00:00Z')).toISOString()).toBe('2026-09-28T00:00:00.000Z')
  })

  it('dit le temps qui reste, sans jamais afficher un compte négatif', () => {
    const j = 24 * 3600_000
    expect(libelleFin(3 * j + 5 * 3600_000)).toBe('3\u00a0j 5\u00a0h')
    expect(libelleFin(5 * 3600_000 + 12 * 60_000)).toBe('5\u00a0h 12\u00a0min')
    expect(libelleFin(12 * 60_000)).toBe('12\u00a0min')
    expect(libelleFin(-5)).toBe('moins d’une minute')
  })
})

describe('la lecture de ligue_etat', () => {
  const brut = {
    semaine: '2026-09-21',
    fin: '2026-09-28T00:00:00+00:00',
    echelon: 2,
    inscrit: true,
    groupe: [
      { cle: 'r:g:1', id: null, nom: 'Léa', portrait: '', xp: 120, rang: 2, robot: true, moi: false },
      { cle: 'u:a', id: 'a', nom: 'Alice', portrait: 'renard', xp: 200, rang: 1, robot: false, moi: true },
      { nom: 'sans clé' },
    ],
    xp_semaine: 200,
    nb_amis: 3,
    amis: [{ id: 'f1', xp: '40', echelon: 99 }, { xp: 5 }],
    bilan: {
      semaine: '2026-09-14', echelon_avant: 1, echelon_apres: 2, rang: 3, taille: 30, xp: 400,
      gemmes: 15, nb_amis: 3, bonus_xp: 120, niveau_avant: 7, niveau_apres: 8, gemmes_niveau: 15,
    },
  }

  it('relit, trie et borne ce que rend le serveur', () => {
    const e = lireEtatLigue(brut)!
    expect(e.groupe.map((m) => m.nom)).toEqual(['Alice', 'Léa'])
    expect(e.groupe[1].robot).toBe(true)
    expect(e.amis).toEqual([{ id: 'f1', xp: 40, echelon: ECHELON_MAX }])
    expect(e.bilan?.bonusXp).toBe(120)
    expect(e.bilan && mouvementDuBilan(e.bilan)).toBe('promu')
    expect(e.inscrit).toBe(true)
  })

  it('refuse une réponse illisible, et ne se dit pas inscrit sans groupe', () => {
    expect(lireEtatLigue(null)).toBeNull()
    expect(lireEtatLigue({ semaine: '2026-09-21' })).toBeNull()
    expect(lireEtatLigue({ ...brut, groupe: [] })?.inscrit).toBe(false)
  })
})

describe('les textes et le rail', () => {
  it('dit la règle de la semaine', () => {
    expect(regleDeLaSemaine(0)).toBe('Les 7 premiers montent en Bronze 3')
    expect(regleDeLaSemaine(3)).toBe('Les 7 premiers montent en Argent 4')
    expect(regleDeLaSemaine(ECHELON_MAX)).toMatch(/sommet/)
  })

  it('sait quand un bilan change de rang', () => {
    expect(changeDeRang({ echelonAvant: 3, echelonApres: 4 })).toBe(true)
    expect(changeDeRang({ echelonAvant: 1, echelonApres: 2 })).toBe(false)
  })

  it('pose le rail des six rangs', () => {
    expect(railLigue(5).map((r) => r.etat)).toEqual([
      'passee',
      'courante',
      'verrouillee',
      'verrouillee',
      'verrouillee',
      'verrouillee',
    ])
  })
})

describe('les mots de l’UI', () => {
  it('groupe les milliers avec l’espace fine insécable', () => {
    expect(nombreFr(87)).toBe('87')
    expect(nombreFr(1180)).toBe('1 180')
    expect(nombreFr(1234567)).toBe('1 234 567')
    expect(nombreFr(-4)).toBe('0')
  })

  const bilan = (avant: number, apres: number, rang: number): BilanLigue => ({
    semaine: '2026-09-14',
    echelonAvant: avant,
    echelonApres: apres,
    rang,
    taille: 30,
    xp: 400,
    gemmes: 0,
    nbAmis: 0,
    bonusXp: 0,
    niveauAvant: null,
    niveauApres: null,
    gemmesNiveau: 0,
    gemmesTirelire: 0,
    tirelireAmis: 0,
    coffreNiveau: 0,
  })

  it('raconte une montée de division, puis un nouveau rang', () => {
    const division = recitBilan(bilan(0, 1, 2))
    expect(division).toMatchObject({ mouvement: 'promu', nouveauRang: false, titre: 'Promotion\u00a0!' })
    expect(division.phrase).toBe('2e sur 30 la semaine dernière\u00a0: tu montes en Bronze 3.')
    const rang = recitBilan(bilan(3, 4, 1))
    expect(rang).toMatchObject({ nouveauRang: true, titre: 'Bienvenue en Argent\u00a0!' })
    expect(rang.phrase).toContain('1re sur 30')
  })

  it('raconte un maintien et une descente sans accabler', () => {
    expect(recitBilan(bilan(2, 2, 12))).toMatchObject({
      mouvement: 'maintenu',
      titre: 'Tu restes en Bronze 2',
      phrase: '12e sur 30 la semaine dernière. Finis dans les 7 premiers pour monter.',
    })
    const descente = recitBilan(bilan(5, 4, 29))
    expect(descente).toMatchObject({ mouvement: 'relegue', titre: 'Retour en Argent 4' })
    expect(descente.phrase).toContain('Une bonne semaine suffit pour remonter')
    expect(recitBilan(bilan(20, 20, 3)).phrase).toContain('au sommet')
  })
})

describe('le classement des amis', () => {
  const j = (id: string, xp: number, moi = false): JoueurAmi => ({
    id,
    nom: id,
    portrait: '',
    xp,
    echelon: 0,
    moi,
  })

  it('classe à l’XP de la semaine, ma ligne après un ami à égalité', () => {
    const lignes = classerAmis([j('moi', 50, true), j('Léa', 80), j('Rayan', 50)])
    expect(lignes.map((l) => [l.id, l.rang])).toEqual([
      ['Léa', 1],
      ['Rayan', 2],
      ['moi', 3],
    ])
    expect(amiDevant(lignes)?.id).toBe('Rayan')
  })

  it('n’a pas de cible quand je mène ou que je suis seul', () => {
    expect(amiDevant(classerAmis([j('moi', 90, true), j('Léa', 80)]))).toBeNull()
    expect(amiDevant(classerAmis([j('moi', 0, true)]))).toBeNull()
  })
})

describe('l’invitation de la semaine', () => {
  const base = { nbAmis: 2, bilanEnAttente: false, semaine: '2026-09-21', derniereSemaineVue: null }

  it('s’ouvre une fois par semaine', () => {
    expect(doitProposerInvitation(base)).toBe(true)
    expect(doitProposerInvitation({ ...base, derniereSemaineVue: '2026-09-21' })).toBe(false)
    expect(doitProposerInvitation({ ...base, derniereSemaineVue: '2026-09-14' })).toBe(true)
  })

  it('se tait quand le bonus est plein ou qu’un bilan attend', () => {
    expect(doitProposerInvitation({ ...base, nbAmis: 10 })).toBe(false)
    expect(doitProposerInvitation({ ...base, bilanEnAttente: true })).toBe(false)
  })
})

describe('les gains de fin de semaine', () => {
  const bilan = (patch: Partial<BilanLigue>): BilanLigue => ({
    semaine: '2026-09-14',
    echelonAvant: 3,
    echelonApres: 4,
    rang: 2,
    taille: 30,
    xp: 600,
    gemmes: 35,
    nbAmis: 3,
    bonusXp: 180,
    niveauAvant: 7,
    niveauApres: 8,
    gemmesNiveau: 15,
    gemmesTirelire: 0,
    tirelireAmis: 0,
    coffreNiveau: 0,
    ...patch,
  })

  it('détaille la montée de rang, le podium, le bonus et le niveau', () => {
    expect(lignesGainsBilan(bilan({}))).toEqual([
      { cle: 'montee', libelle: 'Nouveau rang\u00a0: Argent', montant: 25, unite: 'gemme' },
      { cle: 'podium', libelle: 'Podium\u00a0: 2e place', montant: 10, unite: 'gemme' },
      { cle: 'tirelire', libelle: 'Tirelire d’amis', montant: 180, unite: 'xp' },
      { cle: 'niveau', libelle: 'Niveau 7 → 8', montant: 15, unite: 'gemme' },
    ])
  })

  it('se range derrière le total du serveur quand le détail ne tombe pas juste', () => {
    const lignes = lignesGainsBilan(bilan({ gemmes: 40, bonusXp: 0, niveauApres: 7 }))
    expect(lignes).toEqual([{ cle: 'gemmes', libelle: 'Gemmes de la semaine', montant: 40, unite: 'gemme' }])
  })

  it('ne montre rien après une semaine sans gain', () => {
    expect(
      lignesGainsBilan(
        bilan({ echelonAvant: 2, echelonApres: 2, rang: 14, gemmes: 0, bonusXp: 0, niveauApres: 7 }),
      ),
    ).toEqual([])
  })
})

describe('le signal « un bilan attend »', () => {
  it('retient l’annonce pour qui monte après, et prévient qui écoute', () => {
    const memoire = new Map<string, string>()
    vi.stubGlobal('window', new EventTarget())
    vi.stubGlobal('sessionStorage', {
      getItem: (k: string) => memoire.get(k) ?? null,
      setItem: (k: string, v: string) => void memoire.set(k, v),
    })
    vi.stubGlobal('CustomEvent', class extends Event {
      detail: unknown
      constructor(type: string, init?: { detail?: unknown }) {
        super(type)
        this.detail = init?.detail
      }
    })
    try {
      const recus: boolean[] = []
      const arreter = ecouterBilanLigue((b) => recus.push(b))
      expect(bilanLigueEnAttente()).toBe(false)
      annoncerBilanLigue(true)
      expect(bilanLigueEnAttente()).toBe(true)
      annoncerBilanLigue(false)
      arreter()
      annoncerBilanLigue(true)
      expect(recus).toEqual([true, false])
      expect(bilanLigueEnAttente()).toBe(true)
    } finally {
      vi.unstubAllGlobals()
    }
  })
})

describe('le signal « un coffre attend »', () => {
  it('retient l’annonce et prévient qui écoute', () => {
    const memoire = new Map<string, string>()
    vi.stubGlobal('window', new EventTarget())
    vi.stubGlobal('sessionStorage', {
      getItem: (k: string) => memoire.get(k) ?? null,
      setItem: (k: string, v: string) => void memoire.set(k, v),
    })
    vi.stubGlobal('CustomEvent', class extends Event {
      detail: unknown
      constructor(type: string, init?: { detail?: unknown }) {
        super(type)
        this.detail = init?.detail
      }
    })
    try {
      const recus: boolean[] = []
      const arreter = ecouterCoffrePret((b) => recus.push(b))
      expect(coffrePretEnAttente()).toBe(false)
      annoncerCoffrePret(true)
      expect(coffrePretEnAttente()).toBe(true)
      annoncerCoffrePret(false)
      arreter()
      expect(recus).toEqual([true, false])
      // le bilan et le coffre ont chacun leur mémoire
      expect(bilanLigueEnAttente()).toBe(false)
    } finally {
      vi.unstubAllGlobals()
    }
  })
})

describe('le coffre d’équipe', () => {
  it('rejoue le scénario vérifié sur Postgres (miroir de ligue_coffre)', () => {
    // 50 XP à moi, douze amis de 10 à 120 XP : les 10 meilleurs comptent (30 → 120)
    const douze = Array.from({ length: 12 }, (_, i) => (i + 1) * 10)
    expect(calculerCoffre(50, douze)).toEqual({ partAmis: 750, points: 800 })
    // mon XP et celle de mes amis comptent à 100 %
    expect(calculerCoffre(200, [100])).toEqual({ partAmis: 100, points: 300 })
    expect(calculerCoffre(-5, [])).toEqual({ partAmis: 0, points: 0 })
  })

  it('suit les niveaux de la migration 379', () => {
    expect(COFFRE_NIVEAUX.map((n) => [n.niveau, n.seuil, n.xp, n.gemmes])).toEqual([
      [1, 100, 100, 5],
      [2, 250, 250, 10],
      [3, 450, 450, 15],
      [4, 700, 700, 25],
      [5, 1000, 1000, 40],
    ])
  })

  it('monte de niveau aux seuils exacts', () => {
    expect([0, 99, 100, 249, 250, 450, 700, 999, 1000, 5000].map(niveauCoffre)).toEqual([
      0, 0, 1, 1, 2, 3, 4, 4, 5, 5,
    ])
    expect(contenuCoffre(0)).toBeNull()
    expect(contenuCoffre(3)).toMatchObject({ xp: 450, gemmes: 15 })
  })

  it('dit le chemin vers le niveau suivant', () => {
    expect(progressionCoffre(320)).toMatchObject({ niveau: 2, reste: 130 })
    expect(progressionCoffre(320).suivant?.niveau).toBe(3)
    expect(progressionCoffre(320).part).toBeCloseTo(70 / 200)
    expect(progressionCoffre(0)).toMatchObject({ niveau: 0, part: 0, reste: 100 })
    expect(progressionCoffre(1200)).toEqual({ niveau: 5, suivant: null, part: 1, reste: 0 })
  })

  it('remplit la jauge tronçon par tronçon', () => {
    expect(tronconsCoffre(320)).toEqual([1, 1, 70 / 200, 0, 0])
    expect(tronconsCoffre(0)).toEqual([0, 0, 0, 0, 0])
    expect(tronconsCoffre(9999)).toEqual([1, 1, 1, 1, 1])
  })

  it('relit le coffre et les coffres prêts que rend ligue_etat', () => {
    const e = lireEtatLigue({
      semaine: '2026-09-21',
      fin: '2026-09-28T00:00:00+00:00',
      echelon: 0,
      inscrit: false,
      groupe: [],
      coffre: { xp_moi: 200, nb_amis: 3, part_amis: 120, points: 320, niveau: 2 },
      coffres_prets: [
        { semaine: '2026-09-14', niveau: 3, points: 500, xp: 450, gemmes: 15 },
        { semaine: '2026-09-07', niveau: 1, points: 120, xp: 100, gemmes: 5 },
        { semaine: '2026-08-31', niveau: 0 },
        'x',
      ],
    })
    expect(e?.coffre).toEqual({ xpMoi: 200, nbAmis: 3, partAmis: 120, points: 320 })
    expect(e?.coffresPrets.map((c) => [c.semaine, c.niveau])).toEqual([
      ['2026-09-07', 1],
      ['2026-09-14', 3],
    ])
    const avant379 = lireEtatLigue({ semaine: '2026-09-21', fin: '2026-09-28T00:00:00+00:00' })
    expect(avant379?.coffre).toBeNull()
    expect(avant379?.coffresPrets).toEqual([])
  })

  it('relit l’ouverture d’un coffre et ses gains', () => {
    const o = lireOuvertureCoffre({
      ok: true,
      semaine: '2026-09-14',
      niveau: 2,
      xp: 250,
      gemmes: 10,
      niveau_avant: 1,
      niveau_apres: 3,
      gemmes_niveau: 30,
    })
    expect(o).toMatchObject({ ok: true, niveau: 2, xp: 250, gemmes: 10, niveauAvant: 1, niveauApres: 3 })
    if (!o.ok) throw new Error('ouverture attendue')
    expect(gainsOuverture(o)).toEqual([
      { unite: 'xp', montant: 250 },
      { unite: 'gemme', montant: 40 },
    ])
    expect(lireOuvertureCoffre({ ok: false, raison: 'deja_ouvert' })).toEqual({ ok: false, raison: 'deja_ouvert' })
    expect(lireOuvertureCoffre({ ok: false, raison: 'autre' })).toEqual({ ok: false, raison: 'erreur' })
    expect(lireOuvertureCoffre(null)).toEqual({ ok: false, raison: 'erreur' })
  })

  it('garde les lignes de la tirelire des semaines passées dans le bilan', () => {
    const lignes = lignesGainsBilan({
      semaine: '2026-09-14',
      echelonAvant: 2,
      echelonApres: 2,
      rang: 12,
      taille: 30,
      xp: 900,
      gemmes: 0,
      nbAmis: 3,
      bonusXp: 410,
      niveauAvant: null,
      niveauApres: null,
      gemmesNiveau: 0,
      gemmesTirelire: 15,
      tirelireAmis: 140,
      coffreNiveau: 0,
    })
    expect(lignes).toEqual([
      { cle: 'tirelire', libelle: 'Tirelire d’amis', montant: 410, unite: 'xp' },
      { cle: 'paliers', libelle: 'Paliers de la tirelire', montant: 15, unite: 'gemme' },
    ])
  })
})

describe('le multiplicateur d’XP (miroir de xp_avec_bonus, migration 380)', () => {
  it('ajoute 0,1 par ami, jusqu’à ×2,0 à dix amis, et la potion double le tout', () => {
    expect(multiplicateurXp(0, false)).toBe(1)
    expect(multiplicateurXp(3, false)).toBeCloseTo(1.3)
    expect(multiplicateurXp(10, false)).toBe(2)
    expect(multiplicateurXp(25, false)).toBe(2)
    expect(multiplicateurXp(3, true)).toBeCloseTo(2.6)
    expect(multiplicateurXp(12, true)).toBe(4)
    expect(multiplicateurXp(-2, false)).toBe(1)
  })

  it('s’écrit avec une décimale, à la française', () => {
    expect(libelleMultiplicateur(1)).toBe('×1,0')
    expect(libelleMultiplicateur(multiplicateurXp(3, false))).toBe('×1,3')
    expect(libelleMultiplicateur(multiplicateurXp(3, true))).toBe('×2,6')
    expect(libelleMultiplicateur(4)).toBe('×4,0')
  })

  it('rejoue le barème vérifié sur Postgres (20 XP)', () => {
    const cas: [number, boolean, number][] = [
      [0, false, 20],
      [1, false, 22],
      [3, false, 26],
      [10, false, 40],
      [12, false, 40],
      [3, true, 52],
      [10, true, 80],
      [0, true, 40],
    ]
    for (const [amis, potion, attendu] of cas) expect(xpAvecMultiplicateur(20, amis, potion)).toBe(attendu)
  })

  it('arrondit avant la potion, et laisse les montants nuls ou négatifs', () => {
    expect(xpAvecMultiplicateur(5, 1, false)).toBe(6)
    expect(xpAvecMultiplicateur(5, 3, false)).toBe(7)
    expect(xpAvecMultiplicateur(1000, 12, true)).toBe(4000)
    expect(xpAvecMultiplicateur(450, 3, false)).toBe(585)
    expect(xpAvecMultiplicateur(0, 5, true)).toBe(0)
    expect(xpAvecMultiplicateur(-7, 5, true)).toBe(-7)
  })
})
