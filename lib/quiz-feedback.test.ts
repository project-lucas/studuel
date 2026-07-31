import { describe, it, expect } from 'vitest'
import {
  feedbackTitle,
  reactionRank,
  reactionSrc,
  REACTION_MAX,
  REACTION_SANS_FAUTE,
  SOUTIEN_DES,
} from './quiz-feedback'
import { COMBO_FIRE, COMBO_HOT, COMBO_UNSTOPPABLE } from './juice'

describe('feedbackTitle', () => {
  it('donne toujours la même phrase pour une question donnée', () => {
    // Sinon le texte changerait à chaque rendu de React, sous les yeux de
    // l'élève, pendant qu'il lit.
    const a = feedbackTitle(true, 1, 'question-42')
    const b = feedbackTitle(true, 1, 'question-42')

    expect(a).toBe(b)
  })

  it('fête la série dès qu’elle vaut quelque chose', () => {
    expect(feedbackTitle(true, COMBO_FIRE, 'q')).toBe(`Imparable ×${COMBO_FIRE} !`)
  })

  it('ne fête jamais une série sur une mauvaise réponse', () => {
    expect(feedbackTitle(false, COMBO_FIRE, 'q')).not.toContain('Imparable')
  })

  it('sépare les phrases de réussite et d’échec', () => {
    const seeds = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
    const bravos = new Set(seeds.map((s) => feedbackTitle(true, 1, s)))
    const rates = new Set(seeds.map((s) => feedbackTitle(false, 0, s)))

    for (const r of rates) expect(bravos.has(r)).toBe(false)
  })

  it('cesse de commenter l’échec quand l’élève coule', () => {
    // Le dessin continue sa blague (la calvitie), le texte passe la main : à ce
    // stade l'élève ne rate plus par distraction, l'enfoncer le ferait décrocher.
    const seeds = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
    const rates = new Set(seeds.map((s) => feedbackTitle(false, 1, s)))
    const soutiens = seeds.map((s) => feedbackTitle(false, SOUTIEN_DES, s))

    for (const s of soutiens) expect(rates.has(s)).toBe(false)
  })
})

describe('reactionRank — quelle illustration pour quelle série', () => {
  it('reste dans les 5 illustrations qui existent', () => {
    for (const good of [true, false]) {
      for (const run of [0, 1, 2, 5, 9, 40, 1000]) {
        const rank = reactionRank(good, run)
        expect(rank).toBeGreaterThanOrEqual(1)
        expect(rank).toBeLessThanOrEqual(REACTION_MAX)
      }
    }
  })

  it('démarre au rang 1, même sur une série incohérente', () => {
    // `run` vaut au minimum 1 : on vient forcément de répondre.
    expect(reactionRank(true, 1)).toBe(1)
    expect(reactionRank(true, 0)).toBe(1)
    expect(reactionRank(false, 1)).toBe(1)
    expect(reactionRank(false, -3)).toBe(1)
  })

  it('suit les paliers de juice.ts côté bonnes réponses', () => {
    expect(reactionRank(true, COMBO_HOT)).toBe(2)
    expect(reactionRank(true, COMBO_FIRE)).toBe(3)
    expect(reactionRank(true, COMBO_UNSTOPPABLE)).toBe(4)
    expect(reactionRank(true, REACTION_SANS_FAUTE)).toBe(5)
  })

  it('ne monte jamais d’un rang trop tôt', () => {
    expect(reactionRank(true, COMBO_HOT - 1)).toBe(1)
    expect(reactionRank(true, COMBO_FIRE - 1)).toBe(2)
    expect(reactionRank(true, COMBO_UNSTOPPABLE - 1)).toBe(3)
    expect(reactionRank(true, REACTION_SANS_FAUTE - 1)).toBe(4)
  })

  it('garde le rang 5 rare côté bonnes réponses', () => {
    // Une extase vue à chaque quiz ne récompense plus rien : il faut le
    // sans-faute, pas une bonne série.
    expect(reactionRank(true, COMBO_UNSTOPPABLE)).toBeLessThan(REACTION_MAX)
  })

  it('avance d’un cran par erreur — la calvitie est progressive', () => {
    // Sauter un cran casserait le gag : chaque erreur doit coûter une mèche.
    for (let n = 1; n <= REACTION_MAX; n += 1) {
      expect(reactionRank(false, n)).toBe(n)
    }
  })

  it('plafonne au rang 5 et n’enfonce pas davantage', () => {
    expect(reactionRank(false, REACTION_MAX + 1)).toBe(REACTION_MAX)
    expect(reactionRank(false, 99)).toBe(REACTION_MAX)
  })

  it('monte plus vite dans l’échec que dans la réussite', () => {
    // L'asymétrie est voulue : la récompense se mérite, le gag doit se voir
    // vite. Les deux échelles partent ensemble (rangs 1 et 2 au même moment),
    // puis celle des bonnes réponses s'étire.
    for (let run = 1; run <= 12; run += 1) {
      expect(reactionRank(false, run)).toBeGreaterThanOrEqual(reactionRank(true, run))
    }
    for (const run of [3, 4, 5, 6]) {
      expect(reactionRank(false, run)).toBeGreaterThan(reactionRank(true, run))
    }
  })
})

describe('reactionSrc', () => {
  it('pointe le bon fichier selon le sens et le rang', () => {
    expect(reactionSrc(true, 1)).toBe('/images/mascotte/reaction-bonne-1.webp')
    expect(reactionSrc(false, REACTION_MAX)).toBe('/images/mascotte/reaction-mauvaise-5.webp')
  })

  it('ne produit que des chemins existants', () => {
    const attendus = new Set<string>()
    for (const sens of ['bonne', 'mauvaise']) {
      for (let n = 1; n <= REACTION_MAX; n += 1) {
        attendus.add(`/images/mascotte/reaction-${sens}-${n}.webp`)
      }
    }
    for (const good of [true, false]) {
      for (let run = 0; run < 30; run += 1) {
        expect(attendus.has(reactionSrc(good, run))).toBe(true)
      }
    }
  })
})
