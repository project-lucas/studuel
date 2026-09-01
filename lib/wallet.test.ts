import { describe, expect, it } from 'vitest'
import {
  GEM_AWARDS,
  XP_AWARDS,
  couronneSource,
  isStreakMilestone,
  levelFromXp,
  nextStreak,
  paliersFranchis,
  walletLevelInfo,
  xpChip,
  xpForLevel,
  xpPourCouronnes,
} from './wallet'

describe('barème XP — l’XP mesure l’acquis, pas le clic', () => {
  it('nomme la source de chaque palier de couronne', () => {
    expect(couronneSource(1)).toBe('couronne1')
    expect(couronneSource(2)).toBe('couronne2')
    expect(couronneSource(3)).toBe('couronne3')
  })

  it('PAYE TOUS LES PALIERS d’un chapitre franchi d’un coup', () => {
    // LE test du chantier. Un seul quiz peut faire passer un chapitre de 0 à
    // 3 couronnes : il doit payer les trois (30 + 40 + 60), pas seulement le
    // dernier. Ne payer que le dernier pénaliserait l’élève qui réussit du
    // premier coup — exactement celui qu’on veut récompenser.
    expect(paliersFranchis(0, 3)).toEqual([1, 2, 3])
    expect(xpPourCouronnes(0, 3)).toBe(
      XP_AWARDS.couronne1 + XP_AWARDS.couronne2 + XP_AWARDS.couronne3,
    )
  })

  it('ne paye QUE les paliers neufs', () => {
    expect(paliersFranchis(1, 3)).toEqual([2, 3])
    expect(xpPourCouronnes(1, 3)).toBe(
      XP_AWARDS.couronne2 + XP_AWARDS.couronne3,
    )
  })

  it('ne rend RIEN quand le chapitre redescend', () => {
    // L’XP ne redescend jamais : c’est ce qui la rend lisible comme un CV.
    expect(paliersFranchis(3, 1)).toEqual([])
    expect(xpPourCouronnes(3, 0)).toBe(0)
  })

  it('borne les entrées absurdes au lieu de partir en vrille', () => {
    expect(paliersFranchis(-5, 99)).toEqual([1, 2, 3])
    expect(paliersFranchis(0, 0)).toEqual([])
  })

  it('monte avec la difficulté du palier', () => {
    // Une 3e couronne vaut plus qu’une 1re : le dernier tiers est le plus dur.
    expect(XP_AWARDS.couronne1).toBeLessThan(XP_AWARDS.couronne2)
    expect(XP_AWARDS.couronne2).toBeLessThan(XP_AWARDS.couronne3)
  })

  it('paye la leçon et la carte au même petit tarif', () => {
    // Ce sont les deux acquisitions unitaires : elles doivent se valoir, sinon
    // l’élève arbitre entre lire et réviser sur le prix plutôt que sur l’utilité.
    expect(XP_AWARDS.lecon).toBe(XP_AWARDS.carte)
  })
})

describe('niveaux (100 XP × niveau)', () => {
  it('cumule les paliers : 0, 100, 300, 600, 1000…', () => {
    expect(xpForLevel(1)).toBe(0)
    expect(xpForLevel(2)).toBe(100)
    expect(xpForLevel(3)).toBe(300)
    expect(xpForLevel(4)).toBe(600)
    expect(xpForLevel(5)).toBe(1000)
  })

  it('retrouve le niveau depuis le total, bornes comprises', () => {
    expect(levelFromXp(0)).toBe(1)
    expect(levelFromXp(99)).toBe(1)
    expect(levelFromXp(100)).toBe(2)
    expect(levelFromXp(299)).toBe(2)
    expect(levelFromXp(300)).toBe(3)
    expect(levelFromXp(600)).toBe(4)
    expect(levelFromXp(-5)).toBe(1)
  })

  it('inverse xpForLevel sur une large plage', () => {
    for (let level = 1; level <= 60; level++) {
      expect(levelFromXp(xpForLevel(level))).toBe(level)
      expect(levelFromXp(xpForLevel(level + 1) - 1)).toBe(level)
    }
  })

  it('décrit la progression vers le prochain palier', () => {
    const info = walletLevelInfo(150)
    expect(info.level).toBe(2)
    expect(info.nextAt).toBe(300)
    expect(info.progress).toBeCloseTo(0.25)
    expect(info.title).toBe('Apprenti 🌱')
  })

  it('garde le dernier titre au-delà des paliers connus', () => {
    expect(walletLevelInfo(xpForLevel(25)).title).toBe('Légende 👑')
  })
})

describe('série stockée', () => {
  it('démarre à 1 le premier jour', () => {
    expect(nextStreak({ streakDays: 0, lastActivityDate: null }, '2026-07-21'))
      .toEqual({ streakDays: 1, lastActivityDate: '2026-07-21' })
  })

  it("ne bouge pas deux activités le même jour", () => {
    const prev = { streakDays: 3, lastActivityDate: '2026-07-21' }
    expect(nextStreak(prev, '2026-07-21')).toBe(prev)
  })

  it('prolonge la série le lendemain, y compris à cheval sur un mois', () => {
    expect(
      nextStreak({ streakDays: 3, lastActivityDate: '2026-07-20' }, '2026-07-21')
        .streakDays,
    ).toBe(4)
    expect(
      nextStreak({ streakDays: 6, lastActivityDate: '2026-06-30' }, '2026-07-01')
        .streakDays,
    ).toBe(7)
  })

  it('repart à 1 après un jour manqué', () => {
    expect(
      nextStreak({ streakDays: 9, lastActivityDate: '2026-07-18' }, '2026-07-21')
        .streakDays,
    ).toBe(1)
  })

  it('récompense chaque palier de 7 jours, et seulement lui', () => {
    expect(isStreakMilestone(6)).toBe(false)
    expect(isStreakMilestone(7)).toBe(true)
    expect(isStreakMilestone(8)).toBe(false)
    expect(isStreakMilestone(14)).toBe(true)
    expect(isStreakMilestone(0)).toBe(false)
  })
})

describe('gemmes de jeu', () => {
  it('garde des montants rares et jalonnés (échelle ×30)', () => {
    expect(GEM_AWARDS).toEqual({
      chapterCrowns: 30,
      streak7: 20,
      defiWin: 10,
      levelUp: 15,
    })
  })
})

describe('libellés', () => {
  it('affiche la promesse « +20 XP »', () => {
    expect(xpChip(20)).toBe('+20 XP')
    expect(xpChip(-3)).toBe('+0 XP')
  })
})
