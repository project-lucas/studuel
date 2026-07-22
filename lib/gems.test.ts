import { describe, expect, it } from 'vitest'
import {
  GEM_COST_CHAPTER,
  MAX_SQUAD_SIZE,
  REFERRAL_GEM_CAP,
  REFERRAL_GEM_REWARD,
  STARTING_GEMS,
  canJoinSquad,
  canOpenChapter,
  canSpendGem,
  chapterAccess,
  gemsAfterSpend,
  gemsLabel,
  gemsShortfall,
  missingGemsLabel,
  isPremiumTier,
  isSquadFull,
  referralGemsEarned,
  referralHeadline,
  referralSummary,
  squadSlotsLeft,
  unlockMessage,
} from '@/lib/gems'

const CHAP = 'chapitre-1'

describe('chapterAccess', () => {
  it('ouvre tout aux abonnés sans consommer de gemme', () => {
    expect(chapterAccess('tier1', CHAP, [])).toBe('premium')
    expect(chapterAccess('tier2', CHAP, [])).toBe('premium')
    expect(chapterAccess('tier3', CHAP, [])).toBe('premium')
  })

  it('reconnaît un chapitre déverrouillé à la gemme', () => {
    expect(chapterAccess('free', CHAP, [CHAP])).toBe('unlocked')
    expect(chapterAccess('free', CHAP, new Set([CHAP]))).toBe('unlocked')
  })

  it('laisse fermé un chapitre non déverrouillé', () => {
    expect(chapterAccess('free', CHAP, ['autre'])).toBe('locked')
    expect(chapterAccess('anonymous', CHAP, [])).toBe('locked')
  })

  it('garde les déblocages après la fin de l’abonnement', () => {
    // L'élève avait dépensé une gemme, puis s'est abonné, puis désabonné :
    // le chapitre acheté lui appartient toujours.
    expect(chapterAccess('free', CHAP, [CHAP])).toBe('unlocked')
  })
})

describe('canOpenChapter', () => {
  it('vaut vrai pour premium et déverrouillé, faux sinon', () => {
    expect(canOpenChapter('tier1', CHAP, [])).toBe(true)
    expect(canOpenChapter('free', CHAP, [CHAP])).toBe(true)
    expect(canOpenChapter('free', CHAP, [])).toBe(false)
  })
})

describe('isPremiumTier', () => {
  it('ne compte que les paliers payants', () => {
    expect(isPremiumTier('tier1')).toBe(true)
    expect(isPremiumTier('free')).toBe(false)
    expect(isPremiumTier('anonymous')).toBe(false)
  })
})

describe('canSpendGem', () => {
  it('autorise la dépense sur un chapitre fermé avec assez de gemmes', () => {
    expect(canSpendGem('free', GEM_COST_CHAPTER, CHAP, [])).toBe(true)
    expect(canSpendGem('free', STARTING_GEMS, CHAP, [])).toBe(true)
  })

  it('refuse quand le solde est insuffisant', () => {
    expect(canSpendGem('free', 0, CHAP, [])).toBe(false)
    expect(canSpendGem('free', GEM_COST_CHAPTER - 1, CHAP, [])).toBe(false)
  })

  it('refuse de faire payer deux fois le même chapitre', () => {
    expect(canSpendGem('free', 5, CHAP, [CHAP])).toBe(false)
  })

  it('refuse de faire payer un abonné', () => {
    expect(canSpendGem('tier1', 5, CHAP, [])).toBe(false)
  })
})

describe('gemsAfterSpend', () => {
  it('débite exactement le coût d’un chapitre', () => {
    expect(gemsAfterSpend(GEM_COST_CHAPTER + 3)).toBe(3)
  })

  it('ne descend jamais sous zéro', () => {
    expect(gemsAfterSpend(0)).toBe(0)
    expect(gemsAfterSpend(-4)).toBe(0)
  })
})

describe('gemsShortfall', () => {
  it('compte ce qui manque pour ouvrir un chapitre', () => {
    expect(gemsShortfall(0)).toBe(GEM_COST_CHAPTER)
    expect(gemsShortfall(GEM_COST_CHAPTER)).toBe(0)
    expect(gemsShortfall(GEM_COST_CHAPTER + 4)).toBe(0)
  })

  it('ignore les soldes absurdes', () => {
    expect(gemsShortfall(-3)).toBe(GEM_COST_CHAPTER)
    expect(gemsShortfall(0.9)).toBe(GEM_COST_CHAPTER)
  })
})

describe('missingGemsLabel', () => {
  it('dit combien il manque quand le solde est court', () => {
    expect(missingGemsLabel(0)).toBe(`Il te manque ${GEM_COST_CHAPTER} gemmes`)
    expect(missingGemsLabel(GEM_COST_CHAPTER - 1)).toBe('Il te manque 1 gemme')
  })

  it('se tait quand le solde suffit', () => {
    expect(missingGemsLabel(GEM_COST_CHAPTER)).toBeNull()
    expect(missingGemsLabel(99)).toBeNull()
  })
})

describe('unlockMessage', () => {
  it('traite déjà-débloqué et abonné comme des succès (rien n’est débité)', () => {
    expect(unlockMessage('already').ok).toBe(true)
    expect(unlockMessage('premium').ok).toBe(true)
    expect(unlockMessage('unlocked').ok).toBe(true)
  })

  it('traite les refus comme des échecs', () => {
    expect(unlockMessage('no_gems').ok).toBe(false)
    expect(unlockMessage('not_found').ok).toBe(false)
    expect(unlockMessage('error').ok).toBe(false)
  })

  it('oriente vers le parrainage quand il manque une gemme', () => {
    expect(unlockMessage('no_gems').message).toMatch(/invite un ami/i)
  })
})

describe('referralGemsEarned', () => {
  it('verse la récompense pleine par filleul activé', () => {
    expect(referralGemsEarned(0)).toBe(0)
    expect(referralGemsEarned(1)).toBe(REFERRAL_GEM_REWARD)
    expect(referralGemsEarned(7)).toBe(7 * REFERRAL_GEM_REWARD)
  })

  it('plafonne pour empêcher le farm de comptes', () => {
    expect(referralGemsEarned(REFERRAL_GEM_CAP + 50)).toBe(REFERRAL_GEM_CAP)
  })

  it('ignore les valeurs absurdes', () => {
    expect(referralGemsEarned(-3)).toBe(0)
    expect(referralGemsEarned(2.9)).toBe(2 * REFERRAL_GEM_REWARD)
  })
})

describe('referralSummary', () => {
  it('sépare les filleuls en attente de ceux qui ont payé', () => {
    const s = referralSummary(4, 2)
    expect(s.pending).toBe(4)
    expect(s.activated).toBe(2)
    expect(s.gemsEarned).toBe(2 * REFERRAL_GEM_REWARD)
    expect(s.gemsRemaining).toBe(REFERRAL_GEM_CAP - 2 * REFERRAL_GEM_REWARD)
    expect(s.capped).toBe(false)
  })

  it('signale le plafond atteint', () => {
    const s = referralSummary(0, REFERRAL_GEM_CAP + 5)
    expect(s.capped).toBe(true)
    expect(s.gemsRemaining).toBe(0)
  })
})

describe('referralHeadline', () => {
  it('appelle à inviter quand rien n’a démarré', () => {
    expect(referralHeadline(referralSummary(0, 0))).toMatch(/invite un ami/i)
  })

  it('explique la condition d’activation quand des filleuls attendent', () => {
    expect(referralHeadline(referralSummary(1, 0))).toMatch(/révision/i)
    expect(referralHeadline(referralSummary(3, 0))).toMatch(/^3 amis/)
  })

  it('félicite quand des gemmes sont tombées', () => {
    expect(referralHeadline(referralSummary(0, 1))).toMatch(
      new RegExp(`${REFERRAL_GEM_REWARD} gemmes`),
    )
    expect(referralHeadline(referralSummary(0, 4))).toMatch(
      new RegExp(`${4 * REFERRAL_GEM_REWARD} gemmes`),
    )
  })

  it('salue le plafond', () => {
    expect(
      referralHeadline(referralSummary(0, REFERRAL_GEM_CAP / REFERRAL_GEM_REWARD)),
    ).toMatch(/maximum/i)
  })
})

describe('squad', () => {
  it('se remplit jusqu’à MAX_SQUAD_SIZE', () => {
    expect(isSquadFull(MAX_SQUAD_SIZE - 1)).toBe(false)
    expect(isSquadFull(MAX_SQUAD_SIZE)).toBe(true)
    expect(squadSlotsLeft(MAX_SQUAD_SIZE - 3)).toBe(3)
    expect(squadSlotsLeft(MAX_SQUAD_SIZE + 9)).toBe(0)
  })

  it('n’accepte qu’une relation, et seulement s’il reste de la place', () => {
    expect(canJoinSquad('relation', 0)).toBe(true)
    expect(canJoinSquad('relation', MAX_SQUAD_SIZE)).toBe(false)
    // Déjà dans le squad : rien à faire.
    expect(canJoinSquad('squad', 0)).toBe(false)
  })
})

describe('gemsLabel', () => {
  it('accorde le pluriel', () => {
    expect(gemsLabel(0)).toBe('0 gemme')
    expect(gemsLabel(1)).toBe('1 gemme')
    expect(gemsLabel(3)).toBe('3 gemmes')
  })

  it('n’affiche jamais de solde négatif', () => {
    expect(gemsLabel(-2)).toBe('0 gemme')
  })
})
