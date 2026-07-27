import { describe, it, expect } from 'vitest'
import {
  CROWNS,
  CROWNS_PER_TIER,
  DAILY_CROWN_CAP,
  SEASON_ORIGIN,
  TIER_COUNT,
  cappedCrowns,
  claimableCount,
  countdownLabel,
  crownsFor,
  crownsForTier,
  crownsToNextTier,
  daysLeftInSeason,
  isSeasonEndgame,
  lockedPrestigeCount,
  normalizeSeasonState,
  paceHeadline,
  rewardFor,
  seasonBounds,
  seasonFor,
  seasonKey,
  tierFor,
  tierProgress,
  trackView,
} from './saison'

describe('identité de saison', () => {
  it('dérive la clé du mois', () => {
    expect(seasonKey('2026-07-25')).toBe('2026-07')
    expect(seasonKey('2026-12-01')).toBe('2026-12')
  })

  it('borne la saison au mois calendaire', () => {
    expect(seasonBounds('2026-07')).toEqual({ start: '2026-07-01', end: '2026-07-31' })
    expect(seasonBounds('2026-02')).toEqual({ start: '2026-02-01', end: '2026-02-28' })
    // Année bissextile : février fait 29 jours.
    expect(seasonBounds('2028-02').end).toBe('2028-02-29')
  })

  it('numérote à partir de l’origine et ne recule jamais', () => {
    expect(seasonFor(`${SEASON_ORIGIN}-01`).number).toBe(1)
    expect(seasonFor('2026-08-15').number).toBe(2)
    expect(seasonFor('2027-07-01').number).toBe(13)
  })

  it('donne un thème non vide à toute saison', () => {
    for (let i = 0; i < 24; i++) {
      const s = seasonFor(`2026-${String((i % 12) + 1).padStart(2, '0')}-01`)
      expect(s.name.length).toBeGreaterThan(0)
      expect(s.tagline.length).toBeGreaterThan(0)
    }
  })

  it('fait tourner les thèmes sans jamais casser la numérotation', () => {
    const a = seasonFor('2026-07-01')
    const b = seasonFor('2027-01-01') // 6 mois plus tard = tour complet
    expect(b.name).toBe(a.name)
    expect(b.number).not.toBe(a.number)
  })
})

describe('daysLeftInSeason', () => {
  it('compte aujourd’hui compris', () => {
    expect(daysLeftInSeason('2026-07-31')).toBe(1)
    expect(daysLeftInSeason('2026-07-30')).toBe(2)
    expect(daysLeftInSeason('2026-07-01')).toBe(31)
  })

  it('ne descend jamais à zéro', () => {
    expect(daysLeftInSeason('2026-02-28')).toBeGreaterThan(0)
  })
})

describe('countdownLabel & isSeasonEndgame', () => {
  it('durcit le ton en fin de saison', () => {
    expect(countdownLabel('2026-07-31')).toContain('Dernier jour')
    expect(countdownLabel('2026-07-29')).toBe('Plus que 3 jours')
    expect(countdownLabel('2026-07-01')).toBe('31 jours restants')
  })

  it('déclare la fin de saison à trois jours', () => {
    expect(isSeasonEndgame('2026-07-29')).toBe(true)
    expect(isSeasonEndgame('2026-07-28')).toBe(false)
  })
})

describe('couronnes', () => {
  it('récompense la victoire en plus de la participation', () => {
    expect(crownsFor('duel_win')).toBeGreaterThan(0)
    expect(crownsFor('duel_play')).toBeGreaterThan(0)
  })

  it('rend la session de préparation la plus rentable des activités courtes', () => {
    expect(CROWNS.session_prepa).toBeGreaterThan(CROWNS.duel_play)
    expect(CROWNS.session_prepa).toBeGreaterThan(CROWNS.quest_done)
  })

  it('écrête au plafond quotidien', () => {
    expect(cappedCrowns(0, 100)).toBe(100)
    expect(cappedCrowns(DAILY_CROWN_CAP - 10, 100)).toBe(10)
    expect(cappedCrowns(DAILY_CROWN_CAP, 100)).toBe(0)
    expect(cappedCrowns(-5, -5)).toBe(0)
  })
})

describe('paliers', () => {
  it('commence au palier 1 sans aucune couronne', () => {
    expect(tierFor(0)).toBe(1)
    expect(crownsForTier(1)).toBe(0)
  })

  it('monte d’un palier tous les CROWNS_PER_TIER', () => {
    expect(tierFor(CROWNS_PER_TIER - 1)).toBe(1)
    expect(tierFor(CROWNS_PER_TIER)).toBe(2)
    expect(tierFor(CROWNS_PER_TIER * 3)).toBe(4)
  })

  it('plafonne au dernier palier', () => {
    expect(tierFor(CROWNS_PER_TIER * 999)).toBe(TIER_COUNT)
  })

  it('calcule un avancement borné dans le palier', () => {
    expect(tierProgress(0)).toBe(0)
    expect(tierProgress(CROWNS_PER_TIER / 2)).toBe(0.5)
    expect(tierProgress(CROWNS_PER_TIER * 999)).toBe(1)
  })

  it('annonce ce qu’il reste avant le palier suivant', () => {
    expect(crownsToNextTier(0)).toBe(CROWNS_PER_TIER)
    expect(crownsToNextTier(CROWNS_PER_TIER - 20)).toBe(20)
    expect(crownsToNextTier(CROWNS_PER_TIER * 999)).toBe(0)
  })

  it('encaisse une valeur incohérente', () => {
    expect(tierFor(-500)).toBe(1)
    expect(tierFor(Number.NaN)).toBe(1)
  })

  it('reste finissable dans un mois au plafond quotidien', () => {
    // Garde-fou de game design : la piste complète doit rester atteignable en
    // 28 jours sans jouer au-delà du plafond, sinon elle décourage au lieu de
    // motiver.
    expect(crownsForTier(TIER_COUNT)).toBeLessThanOrEqual(DAILY_CROWN_CAP * 28)
  })
})

describe('rewardFor', () => {
  it('donne quelque chose à CHAQUE palier de la voie libre', () => {
    for (let t = 1; t <= TIER_COUNT; t++) {
      expect(rewardFor(t, 'libre').amount).toBeGreaterThan(0)
    }
  })

  it('rend la voie prestige plus généreuse', () => {
    expect(rewardFor(3, 'prestige').amount).toBeGreaterThan(
      rewardFor(3, 'libre').amount,
    )
  })

  it('réserve les titres à la voie prestige, tous les 5 paliers', () => {
    expect(rewardFor(5, 'prestige').kind).toBe('titre')
    expect(rewardFor(5, 'prestige').title).toBeTruthy()
    expect(rewardFor(6, 'prestige').kind).toBe('gemmes')
    for (let t = 1; t <= TIER_COUNT; t++) {
      expect(rewardFor(t, 'libre').kind).not.toBe('titre')
    }
  })

  it('borne un palier hors piste', () => {
    expect(rewardFor(0, 'libre')).toEqual(rewardFor(1, 'libre'))
    expect(rewardFor(999, 'libre')).toEqual(rewardFor(TIER_COUNT, 'libre'))
  })
})

describe('trackView', () => {
  it('marque atteints les paliers sous le palier courant', () => {
    const views = trackView(CROWNS_PER_TIER * 3, new Set(), false)
    expect(views[3].reached).toBe(true) // palier 4
    expect(views[4].reached).toBe(false) // palier 5
  })

  it('n’ouvre la voie prestige qu’avec le Pass', () => {
    const sans = trackView(CROWNS_PER_TIER * 3, new Set(), false)
    const avec = trackView(CROWNS_PER_TIER * 3, new Set(), true)
    expect(sans[0].libreClaimable).toBe(true)
    expect(sans[0].prestigeClaimable).toBe(false)
    expect(avec[0].prestigeClaimable).toBe(true)
  })

  it('ne propose jamais deux fois la même récompense', () => {
    const claimed = new Set(['libre:1', 'prestige:1'])
    const views = trackView(CROWNS_PER_TIER * 3, claimed, true)
    expect(views[0].libreClaimable).toBe(false)
    expect(views[0].prestigeClaimable).toBe(false)
    expect(views[1].libreClaimable).toBe(true)
  })

  it('couvre toute la piste', () => {
    expect(trackView(0, new Set(), false)).toHaveLength(TIER_COUNT)
  })
})

describe('claimableCount & lockedPrestigeCount', () => {
  it('compte les paliers à encaisser', () => {
    const views = trackView(CROWNS_PER_TIER * 2, new Set(['libre:1']), false)
    expect(claimableCount(views)).toBe(2) // paliers 2 et 3 côté libre
  })

  it('chiffre honnêtement ce que le Pass débloquerait — des paliers DÉJÀ gagnés', () => {
    expect(lockedPrestigeCount(CROWNS_PER_TIER * 4, false)).toBe(5)
    expect(lockedPrestigeCount(CROWNS_PER_TIER * 4, true)).toBe(0)
  })
})

describe('paceHeadline', () => {
  it('donne un rythme en duels par jour', () => {
    const line = paceHeadline(0, '2026-07-01')
    expect(line).toContain('Palier 1/30')
    expect(line).toContain('duel')
  })

  it('félicite une piste terminée', () => {
    expect(paceHeadline(CROWNS_PER_TIER * TIER_COUNT, '2026-07-10')).toContain(
      'terminée',
    )
  })

  it('reste honnête quand la piste n’est plus finissable', () => {
    // Dernier jour, tout reste à faire : on ne promet pas l'impossible.
    expect(paceHeadline(0, '2026-07-31')).toContain('plus atteignable')
  })
})

describe('normalizeSeasonState', () => {
  it('lit une réponse complète', () => {
    const s = normalizeSeasonState(
      {
        season_key: '2026-07',
        crowns: 900,
        has_pass: true,
        claimed: [
          { lane: 'libre', tier: 1 },
          { lane: 'prestige', tier: 2 },
        ],
      },
      '2026-07-25',
    )
    expect(s.season.number).toBe(1)
    expect(s.crowns).toBe(900)
    expect(s.hasPass).toBe(true)
    expect(s.claimed.has('libre:1')).toBe(true)
    expect(s.claimed.has('prestige:2')).toBe(true)
  })

  it('survit à une réponse vide', () => {
    const s = normalizeSeasonState(null, '2026-07-25')
    expect(s.crowns).toBe(0)
    expect(s.hasPass).toBe(false)
    expect(s.claimed.size).toBe(0)
    expect(s.season.key).toBe('2026-07')
  })

  it('écarte les réclamations illisibles et n’accepte pas de négatif', () => {
    const s = normalizeSeasonState(
      { crowns: -50, claimed: [{ lane: 'libre' }, { tier: 0 }, 'nope'] },
      '2026-07-25',
    )
    expect(s.crowns).toBe(0)
    expect(s.claimed.size).toBe(0)
  })
})
