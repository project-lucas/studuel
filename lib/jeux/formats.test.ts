import { describe, it, expect } from 'vitest'
import { SALONS } from '@/lib/jeux/catalog'
import { idsWithPool, poolKind } from '@/lib/jeux/pools'
import {
  GAME_FORMATS,
  MIN_WAVE_SECONDS,
  announcedSteps,
  formatTeaser,
  gameFormat,
  poolSizeFor,
  waveSeconds,
} from '@/lib/jeux/formats'

const formats = Object.values(GAME_FORMATS)

const implementedIds = SALONS.flatMap((s) =>
  s.games.filter((g) => g.implemented).map((g) => g.id),
)

describe('cohérence catalogue ↔ formats', () => {
  it('donne un format à chaque jeu jouable', () => {
    for (const id of implementedIds) {
      expect(gameFormat(id), `format manquant pour ${id}`).not.toBeNull()
    }
  })

  it("n'invente pas de format pour un jeu inexistant", () => {
    for (const id of Object.keys(GAME_FORMATS)) {
      expect(implementedIds, `format orphelin : ${id}`).toContain(id)
    }
  })

  it('reste aligné sur les registres de banques (QCM et tableaux)', () => {
    expect(Object.keys(GAME_FORMATS).sort()).toEqual(idsWithPool().sort())
  })

  it('rend null sur un id inconnu', () => {
    expect(gameFormat('jeu-fantome')).toBeNull()
  })
})

describe('identité des formats', () => {
  it('donne une robe distincte à chaque jeu', () => {
    const themes = formats.map((f) => f.theme)
    expect(new Set(themes).size).toBe(themes.length)
  })

  it('ne fait jamais jouer deux jeux d’une même matière sur la même mécanique', () => {
    for (const salon of SALONS) {
      const mechanics = salon.games
        .filter((g) => g.implemented)
        .map((g) => gameFormat(g.id)?.params.mechanic)
      expect(
        new Set(mechanics).size,
        `${salon.subject} sert deux fois la même mécanique`,
      ).toBe(mechanics.length)
    }
  })

  it('ne sert jamais deux fois exactement le même réglage', () => {
    // Deux jeux peuvent partager une mécanique (le catalogue est plus large que
    // cinq familles) — mais jamais avec le MÊME tempo, sinon on retombe sur le
    // copier-coller que ce fichier existe pour supprimer.
    const fingerprints = formats.map((f) => JSON.stringify(f.params))
    expect(new Set(fingerprints).size).toBe(fingerprints.length)
  })

  it('couvre les six mécaniques (aucune famille morte)', () => {
    const used = new Set(formats.map((f) => f.params.mechanic))
    expect(used).toEqual(
      new Set([
        'sprint',
        'vies',
        'paliers',
        'expedition',
        'ascension',
        'ordre',
      ]),
    )
  })

  it('écrit un lexique complet et non générique', () => {
    for (const f of formats) {
      const l = f.lexicon
      for (const [key, value] of Object.entries(l)) {
        expect(value.length, `${f.id}.${key} vide`).toBeGreaterThan(2)
      }
      // Le vocabulaire du duel générique ne doit plus apparaître nulle part.
      expect(l.step).not.toBe('manche')
      expect(l.steps).not.toBe('manches')
    }
  })

  it('annonce une règle courte et lisible', () => {
    for (const f of formats) {
      expect(f.rule.length, `${f.id} : règle trop courte`).toBeGreaterThan(30)
      expect(f.rule.length, `${f.id} : règle trop longue`).toBeLessThan(140)
    }
  })
})

describe('paramètres jouables', () => {
  it('garde des réglages positifs et sensés', () => {
    for (const f of formats) {
      const p = f.params
      if (p.mechanic === 'sprint') {
        expect(p.sprint.seconds).toBeGreaterThanOrEqual(20)
        expect(p.sprint.fastMs).toBeGreaterThan(500)
      }
      if (p.mechanic === 'vies') {
        expect(p.vies.lives).toBeGreaterThanOrEqual(1)
        expect(p.vies.target).toBeGreaterThan(p.vies.lives)
      }
      if (p.mechanic === 'paliers') {
        expect(p.paliers.waves).toBeGreaterThanOrEqual(2)
        expect(p.paliers.waveSize).toBeGreaterThanOrEqual(3)
        expect(p.paliers.lives).toBeGreaterThanOrEqual(1)
      }
      if (p.mechanic === 'expedition') {
        expect(p.expedition.stops).toBeGreaterThanOrEqual(5)
        expect(p.expedition.questionSeconds).toBeGreaterThanOrEqual(5)
      }
      if (p.mechanic === 'ascension') {
        expect(p.ascension.floors).toBeGreaterThanOrEqual(5)
        expect(p.ascension.fall).toBeGreaterThanOrEqual(1)
      }
    }
  })

  it('ne descend jamais le chrono de vague sous le plancher jouable', () => {
    for (const f of formats) {
      if (f.params.mechanic !== 'paliers') continue
      const p = f.params.paliers
      for (let i = 0; i < p.waves; i++) {
        expect(waveSeconds(p, i)).toBeGreaterThanOrEqual(MIN_WAVE_SECONDS)
      }
      // …et le chrono se resserre bien d'une vague à l'autre.
      expect(waveSeconds(p, 1)).toBeLessThan(waveSeconds(p, 0))
    }
  })
})

describe('promesse du billet', () => {
  it('annonce la règle plutôt qu’un « Jouer » interchangeable', () => {
    expect(formatTeaser(GAME_FORMATS.capitales)).toBe('8 escales')
    expect(formatTeaser(GAME_FORMATS['traduction-flash'])).toBe('45 s chrono')
    expect(formatTeaser(GAME_FORMATS['faux-amis'])).toBe('2 vies · 10 pièges')
    expect(formatTeaser(GAME_FORMATS['suite-logique'])).toBe('10 étages')
    expect(formatTeaser(GAME_FORMATS['calcul-mental'])).toBe('4 régimes')
  })

  it('donne un jeton court et non vide à chaque jeu', () => {
    for (const f of formats) {
      const teaser = formatTeaser(f)
      expect(teaser.length, `${f.id} vide`).toBeGreaterThan(3)
      expect(teaser.length, `${f.id} trop long pour un jeton`).toBeLessThan(26)
    }
  })

  it('ne sert pas le même jeton à deux jeux de la même matière', () => {
    for (const salon of SALONS) {
      const teasers = salon.games
        .filter((g) => g.implemented)
        .map((g) => formatTeaser(gameFormat(g.id)!))
      expect(new Set(teasers).size, salon.subject).toBe(teasers.length)
    }
  })
})

describe('annonces et dimensionnement', () => {
  it('annonce un nombre d’étapes pour les formats à parcours', () => {
    expect(announcedSteps(GAME_FORMATS.capitales)).toBe(8)
    expect(announcedSteps(GAME_FORMATS['calcul-mental'])).toBe(4)
    expect(announcedSteps(GAME_FORMATS['suite-logique'])).toBe(10)
    expect(announcedSteps(GAME_FORMATS['traduction-flash'])).toBeNull()
  })

  it('prépare assez de matière pour ne jamais se répéter en partie', () => {
    // L'unité dépend de la FORME de la banque : des QUESTIONS pour les QCM, des
    // TABLEAUX pour la remise en ordre, des TIRAGES pour le compte est bon —
    // un tableau ou un tirage valent chacun plusieurs interactions.
    const FLOOR = { qcm: 12, ordre: 4, compte: 5, zones: 8 } as const
    for (const f of formats) {
      const kind = poolKind(f.id)
      expect(kind, `${f.id} sans banque`).not.toBeNull()
      expect(poolSizeFor(f), `${f.id}`).toBeGreaterThanOrEqual(FLOOR[kind!])
    }
    // Une expédition de 8 escales n'a pas besoin de 60 questions.
    expect(poolSizeFor(GAME_FORMATS.capitales)).toBeLessThan(20)
  })

  it('prépare au moins autant d’étapes que la partie peut en boucler', () => {
    for (const f of formats) {
      if (f.params.mechanic === 'ordre') {
        const { boards } = f.params.ordre
        if (boards !== null) expect(poolSizeFor(f)).toBeGreaterThanOrEqual(boards)
      }
      // Une expédition doit pouvoir servir toutes ses escales sans recycler.
      if (f.params.mechanic === 'expedition') {
        expect(poolSizeFor(f)).toBeGreaterThanOrEqual(f.params.expedition.stops)
      }
    }
  })
})
