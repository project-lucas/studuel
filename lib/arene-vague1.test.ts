import { describe, expect, it } from 'vitest'
import { mapAreneAccueil } from './arene-vague1'

const TODAY = '2026-08-26'

describe('mapAreneAccueil — le JSON de la 322 vers les formes de la page', () => {
  it('enveloppe les lectures brutes dans la forme { data } que la page attend', () => {
    // La page lit `natRes.data`, `friendsRes.data`… — la forme que rendait
    // PostgREST. Le regroupement ne doit pas obliger à réécrire les 500 lignes
    // qui consomment ces variables.
    const r = mapAreneAccueil(
      {
        national: { rank: 12 },
        friends_trophies: [{ id: 'a' }],
        friends_live: [],
        league: { tier: 'or' },
        ranked_matches: [{ id: 'm1' }],
        friends_overview: [{ id: 'f' }],
        game_trophies: [{ subject_slug: 'maths' }],
      },
      TODAY,
    )
    expect(r.natRes.data).toEqual({ rank: 12 })
    expect(r.friendsRes.data).toEqual([{ id: 'a' }])
    expect(r.leagueRes.data).toEqual({ tier: 'or' })
    expect(r.matchesRes.data).toEqual([{ id: 'm1' }])
    expect(r.overviewRes.data).toEqual([{ id: 'f' }])
    expect(r.gameTrophyRes.data).toEqual([{ subject_slug: 'maths' }])
  })

  it('rend `data: null` pour un morceau que la base n’a pas pu servir', () => {
    // Une clé à `null` signale une migration absente pour CE morceau — la 238
    // pour les trophées, la 162 pour le tournoi. C'est exactement le
    // `data: null` que la page tolère déjà, morceau par morceau.
    const r = mapAreneAccueil({ game_trophies: null, national: null }, TODAY)
    expect(r.gameTrophyRes.data).toBeNull()
    expect(r.natRes.data).toBeNull()
  })

  it('lit le cycle scolaire calculé en base', () => {
    expect(mapAreneAccueil({ level: 'primaire' }, TODAY).level).toBe('primaire')
  })

  it('rend un profil vide plutôt qu’undefined quand la lecture a échoué', () => {
    // La page fait `profile.profile_type === 'parent'` sans garde : un
    // `undefined` y jetterait au lieu d’afficher une arène dégradée.
    expect(mapAreneAccueil({ profile: null }, TODAY).profile).toEqual({})
    expect(mapAreneAccueil({}, TODAY).profile).toEqual({})
  })

  it('indexe les jauges de traque par boss', () => {
    const r = mapAreneAccueil(
      {
        gauges: [
          { boss_id: 'pythagore', points: 40, chapters: [], victories: 1 },
          { boss_id: 'newton', points: 10, chapters: [], victories: 0 },
        ],
      },
      TODAY,
    )
    expect(r.gaugesRes?.size).toBe(2)
    expect(r.gaugesRes?.get('pythagore')?.points).toBe(40)
  })

  it('distingue « pas de jauge » (carte vide) de « migration absente » (null)', () => {
    // La nuance compte : une carte vide veut dire « aucun gardien débusqué »,
    // `null` veut dire « la traque n'existe pas encore sur cette base ». Les
    // confondre afficherait une traque morte comme une traque vierge.
    expect(mapAreneAccueil({ gauges: [] }, TODAY).gaugesRes?.size).toBe(0)
    expect(mapAreneAccueil({ gauges: null }, TODAY).gaugesRes).toBeNull()
  })

  it('normalise la semaine de clan et la saison, et garde `null` tel quel', () => {
    const vide = mapAreneAccueil(
      { clan_week: null, clan_week_prev: null, season: null },
      TODAY,
    )
    expect(vide.weekRes).toBeNull()
    expect(vide.lastWeekRes).toBeNull()
    expect(vide.seasonRes).toBeNull()
  })

  it('ne traite « déjà encaissé » comme vrai que sur un vrai true', () => {
    // `null` (migration absente) ne doit pas se lire « déjà encaissé » : ça
    // priverait l'élève de sa récompense de clan sans rien lui dire.
    expect(mapAreneAccueil({ clan_week_claimed: true }, TODAY).alreadyClaimed).toBe(true)
    expect(mapAreneAccueil({ clan_week_claimed: null }, TODAY).alreadyClaimed).toBe(false)
    expect(mapAreneAccueil({}, TODAY).alreadyClaimed).toBe(false)
  })

  it('lit les pics par matière et ignore les lignes illisibles', () => {
    const r = mapAreneAccueil(
      {
        subject_peaks: [
          { subject_slug: 'maths', peak: 1200 },
          { subject_slug: 'svt', peak: 'plouf' },
          { subject_slug: null, peak: 900 },
          null,
        ],
      },
      TODAY,
    )
    expect([...r.subjectPeaks.entries()]).toEqual([['maths', 1200]])
  })

  it('rend une file « À revoir » vide plutôt qu’undefined', () => {
    expect(mapAreneAccueil({ review_items: null }, TODAY).reviews).toEqual([])
    expect(mapAreneAccueil({}, TODAY).reviews).toEqual([])
  })

  it('survit à un payload entièrement vide', () => {
    const r = mapAreneAccueil({}, TODAY)
    expect(r.profile).toEqual({})
    expect(r.reviews).toEqual([])
    expect(r.subjectPeaks.size).toBe(0)
    expect(r.natRes.data).toBeNull()
  })
})
