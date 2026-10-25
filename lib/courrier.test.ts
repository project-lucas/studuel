import { describe, expect, it } from 'vitest'
import {
  aRecuperer,
  annoncesNonVues,
  boiteDepuis,
  estNonLue,
  gainsDepuis,
  gainsEnListe,
  ilYA,
  lettreDepuisAnnonce,
  lettreDepuisCourrier,
  lettreDepuisDefi,
  marquerLue,
  marquerRecuperee,
  nonLus,
  nonLusParOnglet,
  ongletDe,
  parOnglet,
  resumeGains,
  sousTitreBoite,
  totalARecuperer,
  toutMarquerLu,
  toutMarquerRecupere,
  trierLettres,
  type Lettre,
} from './courrier'

const MAINTENANT = new Date('2026-10-25T12:00:00Z')
const ID_A = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
const ID_B = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
const ID_C = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc'
const ID_D = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd'
const ID_E = 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee'

const bienvenue = {
  id: ID_A,
  type: 'marcel',
  titre: 'Bienvenue dans ta boîte aux lettres !',
  corps: 'Salut…',
  lien: '/reviser',
  gains: { xp: 50 },
  expediteur: 'Marcel',
  meta: { pose: 'invite' },
  lu_at: null,
  encaisse_at: null,
  created_at: '2026-10-25T10:00:00Z',
  expire_at: null,
}

describe('lettreDepuisCourrier', () => {
  it('relit une lettre de Marcel avec son cadeau et sa pose', () => {
    const l = lettreDepuisCourrier(bienvenue)
    expect(l).not.toBeNull()
    expect(l?.source).toBe('courrier')
    expect(l?.type).toBe('marcel')
    expect(l?.gains).toEqual({ xp: 50, gemmes: 0 })
    expect(l?.visage).toEqual({ genre: 'marcel', pose: 'invite' })
    expect(l?.lue).toBe(false)
    expect(l?.recuperee).toBe(false)
    expect(l?.lien).toBe('/reviser')
  })

  it('rend la pose par défaut quand la méta demande une pose inconnue', () => {
    expect(lettreDepuisCourrier({ ...bienvenue, meta: { pose: 'danse' } })?.visage).toEqual({ genre: 'marcel', pose: 'salut' })
    expect(lettreDepuisCourrier({ ...bienvenue, meta: null })?.visage).toEqual({ genre: 'marcel', pose: 'salut' })
  })

  it('une lettre sans gain est « récupérée » d’office ; une lettre encaissée aussi', () => {
    expect(lettreDepuisCourrier({ ...bienvenue, gains: null })?.recuperee).toBe(true)
    expect(lettreDepuisCourrier({ ...bienvenue, encaisse_at: '2026-10-25T11:00:00Z' })?.recuperee).toBe(true)
  })

  it('refuse ce qui n’a pas la forme d’une lettre', () => {
    expect(lettreDepuisCourrier(null)).toBeNull()
    expect(lettreDepuisCourrier({ ...bienvenue, id: 'pas-un-uuid' })).toBeNull()
    expect(lettreDepuisCourrier({ ...bienvenue, type: 'spam' })).toBeNull()
    expect(lettreDepuisCourrier({ ...bienvenue, titre: '  ' })).toBeNull()
    expect(lettreDepuisCourrier({ ...bienvenue, created_at: 'hier' })).toBeNull()
  })

  it('ne garde qu’un lien INTERNE', () => {
    expect(lettreDepuisCourrier({ ...bienvenue, lien: 'https://evil.example' })?.lien).toBeNull()
    expect(lettreDepuisCourrier({ ...bienvenue, lien: '//evil.example' })?.lien).toBeNull()
    expect(lettreDepuisCourrier({ ...bienvenue, lien: '/defi/jeux/calcul-mental?x=1' })?.lien).toBe('/defi/jeux/calcul-mental?x=1')
  })

  it('une lettre d’ami porte le visage de l’ami (méta `de`, `portrait`)', () => {
    const l = lettreDepuisCourrier({ ...bienvenue, type: 'ami', expediteur: 'Léa', meta: { de: ID_B, portrait: 'renard' } })
    expect(l?.visage).toEqual({ genre: 'joueur', id: ID_B, portrait: 'renard' })
    expect(ongletDe(l!)).toBe('amis')
  })
})

describe('gainsDepuis / gainsEnListe / resumeGains', () => {
  it('normalise et refuse le vide', () => {
    expect(gainsDepuis({ xp: 20, gemmes: 5 })).toEqual({ xp: 20, gemmes: 5 })
    expect(gainsDepuis({ xp: '30' })).toEqual({ xp: 30, gemmes: 0 })
    expect(gainsDepuis({ xp: 0, gemmes: 0 })).toBeNull()
    expect(gainsDepuis({ ecus: 5 })).toBeNull()
    expect(gainsDepuis(null)).toBeNull()
    expect(gainsDepuis({ xp: -5 })).toBeNull()
  })

  it('met les gains sous la forme du vol', () => {
    expect(gainsEnListe({ xp: 20, gemmes: 5 })).toEqual([
      { unite: 'xp', montant: 20 },
      { unite: 'gemme', montant: 5 },
    ])
    expect(gainsEnListe({ xp: 50, gemmes: 0 })).toEqual([{ unite: 'xp', montant: 50 }])
    expect(gainsEnListe(null)).toEqual([])
  })

  it('résume en français', () => {
    expect(resumeGains({ xp: 50, gemmes: 0 })).toBe('50 XP')
    expect(resumeGains({ xp: 20, gemmes: 5 })).toBe('20 XP et 5 gemmes')
    expect(resumeGains({ xp: 0, gemmes: 1 })).toBe('1 gemme')
    expect(resumeGains(null)).toBe('')
  })
})

describe('lettreDepuisAnnonce', () => {
  const annonce = {
    id: ID_C,
    titre: 'Le Musée est ouvert',
    corps: 'Va voir !',
    lien: '/defi',
    lien_libelle: 'Y aller',
    auteur: 'Lucas',
    auteur_coach: false,
    cree_le: '2026-10-24T09:00:00Z',
    vue_le: null,
    fermee_le: null,
  }

  it('une diffusion de l’équipe devient une nouveauté', () => {
    const l = lettreDepuisAnnonce(annonce)
    expect(l?.source).toBe('annonce')
    expect(l?.type).toBe('nouveaute')
    expect(l?.expediteur).toBe('L’équipe Studuel')
    expect(l?.visage).toEqual({ genre: 'studuel' })
    expect(l?.lienLibelle).toBe('Y aller')
    expect(l?.lue).toBe(false)
    expect(l?.gains).toBeNull()
    expect(l?.recuperee).toBe(true)
    expect(ongletDe(l!)).toBe('marcel')
  })

  it('une diffusion du coach va dans l’onglet Coach, vue = lue', () => {
    const l = lettreDepuisAnnonce({ ...annonce, auteur: 'Coach Karim', auteur_coach: true, vue_le: '2026-10-24T10:00:00Z' })
    expect(l?.type).toBe('coach')
    expect(l?.expediteur).toBe('Coach Karim')
    expect(l?.lue).toBe(true)
    expect(ongletDe(l!)).toBe('coach')
  })

  it('refuse une diffusion sans identifiant ni titre', () => {
    expect(lettreDepuisAnnonce({ ...annonce, id: '12' })).toBeNull()
    expect(lettreDepuisAnnonce({ ...annonce, titre: '' })).toBeNull()
  })
})

describe('lettreDepuisDefi', () => {
  const defi = { id: ID_D, de: ID_B, nom: 'Léa', portrait: 'renard', mode: 'calcul-mental', son_score: 12, le: '2026-10-25T08:00:00Z' }

  it('« Léa te défie ! », à relever sur le mode choisi, sept jours', () => {
    const l = lettreDepuisDefi(defi)
    expect(l?.source).toBe('defi')
    expect(l?.type).toBe('ami')
    expect(l?.titre).toBe('Léa te défie !')
    expect(l?.corps).toContain('son score : 12')
    expect(l?.lien).toBe('/defi/jeux/calcul-mental')
    expect(l?.lienLibelle).toBe('Relever')
    expect(l?.visage).toEqual({ genre: 'joueur', id: ID_B, portrait: 'renard' })
    expect(l?.defi).toEqual({ mode: 'calcul-mental', sonScore: 12 })
    expect(l?.expireLe).toBe('2026-11-01T08:00:00.000Z')
    expect(l?.lue).toBe(false)
  })

  it('sans score, « à toi de jouer » ; sans mode, vers l’onglet Amis', () => {
    expect(lettreDepuisDefi({ ...defi, son_score: null })?.corps).toContain('à toi de jouer')
    const sansMode = lettreDepuisDefi({ ...defi, mode: '' })
    expect(sansMode?.lien).toBe('/amis')
    expect(sansMode?.defi).toEqual({ mode: null, sonScore: 12 })
  })

  it('refuse un défi mal formé', () => {
    expect(lettreDepuisDefi({ ...defi, id: 'x' })).toBeNull()
    expect(lettreDepuisDefi(null)).toBeNull()
  })
})

function lettre(sur: Partial<Lettre> & { id: string }): Lettre {
  return {
    source: 'courrier',
    type: 'marcel',
    titre: 'Un mot',
    corps: '',
    lien: null,
    lienLibelle: null,
    gains: null,
    expediteur: 'Marcel',
    visage: { genre: 'marcel', pose: 'salut' },
    lue: true,
    recuperee: true,
    recueLe: '2026-10-20T10:00:00Z',
    expireLe: null,
    defi: null,
    ...sur,
  }
}

const CADEAU = lettre({ id: ID_A, type: 'cadeau', gains: { xp: 20, gemmes: 5 }, lue: true, recuperee: false, recueLe: '2026-10-21T10:00:00Z' })
const NON_LUE = lettre({ id: ID_B, lue: false, recueLe: '2026-10-25T11:00:00Z' })
const LUE_RECENTE = lettre({ id: ID_C, lue: true, recueLe: '2026-10-25T11:30:00Z' })
const COACH = lettre({ id: ID_D, source: 'annonce', type: 'coach', visage: { genre: 'coach' }, lue: false, recueLe: '2026-10-23T10:00:00Z' })
const DEFI = lettre({
  id: ID_E,
  source: 'defi',
  type: 'ami',
  visage: { genre: 'joueur', id: ID_B, portrait: '' },
  lue: false,
  recueLe: '2026-10-22T10:00:00Z',
  expireLe: '2026-10-29T10:00:00Z',
  defi: { mode: 'blitz', sonScore: 800 },
})

describe('nonLus / estNonLue', () => {
  it('compte les non-lues ET les cadeaux pas récupérés, comme courrier_non_lus', () => {
    expect(estNonLue(CADEAU, MAINTENANT)).toBe(true)
    expect(estNonLue(NON_LUE, MAINTENANT)).toBe(true)
    expect(estNonLue(LUE_RECENTE, MAINTENANT)).toBe(false)
    expect(nonLus([CADEAU, NON_LUE, LUE_RECENTE, COACH, DEFI], MAINTENANT)).toBe(4)
  })

  it('une lettre expirée ne compte plus', () => {
    expect(estNonLue({ ...CADEAU, expireLe: '2026-10-24T00:00:00Z' }, MAINTENANT)).toBe(false)
    expect(estNonLue({ ...DEFI, expireLe: '2026-10-24T00:00:00Z' }, MAINTENANT)).toBe(false)
  })

  it('par onglet', () => {
    expect(nonLusParOnglet([CADEAU, NON_LUE, LUE_RECENTE, COACH, DEFI], MAINTENANT)).toEqual({ tout: 4, marcel: 2, amis: 1, coach: 1 })
  })
})

describe('trierLettres', () => {
  it('cadeaux et défis d’abord, puis les non-lues, puis les lues ; les plus récentes en tête de chaque groupe', () => {
    const ordre = trierLettres([LUE_RECENTE, NON_LUE, COACH, CADEAU, DEFI], MAINTENANT).map((l) => l.id)
    expect(ordre).toEqual([ID_E, ID_A, ID_B, ID_D, ID_C])
  })

  it('un cadeau expiré redescend avec les lues', () => {
    const expire = { ...CADEAU, expireLe: '2026-10-24T00:00:00Z' }
    expect(trierLettres([expire, NON_LUE], MAINTENANT).map((l) => l.id)).toEqual([ID_B, ID_A])
  })

  it('ne modifie pas le tableau reçu', () => {
    const source = [LUE_RECENTE, NON_LUE]
    trierLettres(source, MAINTENANT)
    expect(source.map((l) => l.id)).toEqual([ID_C, ID_B])
  })
})

describe('parOnglet / ongletDe', () => {
  it('Tout rend tout ; Marcel prend Marcel, les cadeaux et les nouveautés', () => {
    const toutes = [CADEAU, NON_LUE, COACH, DEFI, lettre({ id: ID_C, type: 'nouveaute', visage: { genre: 'studuel' } })]
    expect(parOnglet(toutes, 'tout')).toHaveLength(5)
    expect(parOnglet(toutes, 'marcel').map((l) => l.id)).toEqual([ID_A, ID_B, ID_C])
    expect(parOnglet(toutes, 'amis').map((l) => l.id)).toEqual([ID_E])
    expect(parOnglet(toutes, 'coach').map((l) => l.id)).toEqual([ID_D])
  })
})

describe('boiteDepuis', () => {
  it('réunit les trois sources et trie', () => {
    const boite = boiteDepuis({
      lettres: [bienvenue, { mauvaise: true }],
      annonces: [{ id: ID_C, titre: 'Nouveauté', auteur: 'Lucas', auteur_coach: false, cree_le: '2026-10-24T09:00:00Z', vue_le: '2026-10-24T09:30:00Z' }],
      defis: [{ id: ID_D, de: ID_B, nom: 'Léa', portrait: '', mode: 'blitz', son_score: 800, le: '2026-10-25T08:00:00Z' }],
    })
    // Le cadeau (10 h) et le défi (8 h) attendent un geste : en tête, le plus
    // récent d'abord ; la diffusion déjà vue ferme la marche.
    expect(boite.map((l) => [l.id, l.source])).toEqual([
      [ID_A, 'courrier'],
      [ID_D, 'defi'],
      [ID_C, 'annonce'],
    ])
  })

  it('rend une boîte vide sur n’importe quoi', () => {
    expect(boiteDepuis(null)).toEqual([])
    expect(boiteDepuis('x')).toEqual([])
    expect(boiteDepuis({ lettres: 'non' })).toEqual([])
  })
})

describe('les cadeaux', () => {
  it('aRecuperer et le total annoncé', () => {
    const autre = lettre({ id: ID_C, type: 'cadeau', gains: { xp: 10, gemmes: 0 }, recuperee: false })
    expect(aRecuperer([CADEAU, NON_LUE, autre], MAINTENANT).map((l) => l.id)).toEqual([ID_A, ID_C])
    expect(totalARecuperer([CADEAU, NON_LUE, autre], MAINTENANT)).toEqual({ xp: 30, gemmes: 5 })
    expect(totalARecuperer([NON_LUE], MAINTENANT)).toBeNull()
  })

  it('annoncesNonVues ne liste que les diffusions jamais vues', () => {
    expect(annoncesNonVues([CADEAU, COACH, { ...COACH, id: ID_C, lue: true }])).toEqual([ID_D])
  })
})

describe('l’état à l’écran, sans mutation', () => {
  it('marquerLue, marquerRecuperee', () => {
    const avant = [NON_LUE, CADEAU]
    const lues = marquerLue(avant, ID_B)
    expect(lues[0].lue).toBe(true)
    expect(avant[0].lue).toBe(false)
    const recup = marquerRecuperee(lues, ID_A)
    expect(recup[1]).toMatchObject({ lue: true, recuperee: true })
    expect(nonLus(recup, MAINTENANT)).toBe(0)
  })

  it('toutMarquerLu laisse les défis à relever ; toutMarquerRecupere paie les cadeaux', () => {
    const tout = toutMarquerLu([NON_LUE, COACH, DEFI, CADEAU])
    expect(tout.map((l) => l.lue)).toEqual([true, true, false, true])
    expect(nonLus(tout, MAINTENANT)).toBe(2)
    const paye = toutMarquerRecupere(tout, MAINTENANT)
    expect(nonLus(paye, MAINTENANT)).toBe(1)
  })
})

describe('ilYA', () => {
  it('parle comme un élève', () => {
    expect(ilYA('2026-10-25T11:59:30Z', MAINTENANT)).toBe('à l’instant')
    expect(ilYA('2026-10-25T11:55:00Z', MAINTENANT)).toBe('il y a 5 min')
    expect(ilYA('2026-10-25T10:00:00Z', MAINTENANT)).toBe('il y a 2 h')
    expect(ilYA('2026-10-24T08:00:00Z', MAINTENANT)).toBe('hier')
    expect(ilYA('2026-10-22T08:00:00Z', MAINTENANT)).toBe('il y a 3 j')
    expect(ilYA('2026-10-10T08:00:00Z', MAINTENANT)).toBe('il y a 2 sem.')
    expect(ilYA('2026-09-12T08:00:00Z', MAINTENANT)).toBe('12 sept.')
    expect(ilYA('2025-09-12T08:00:00Z', MAINTENANT)).toBe('12 sept. 2025')
  })

  it('une date illisible ou future : « à l’instant »', () => {
    expect(ilYA('hier', MAINTENANT)).toBe('à l’instant')
    expect(ilYA('2026-10-26T08:00:00Z', MAINTENANT)).toBe('à l’instant')
  })
})

describe('sousTitreBoite', () => {
  it('compte ce qui attend', () => {
    expect(sousTitreBoite([CADEAU, NON_LUE, COACH], MAINTENANT)).toBe('3 non lues · 1 cadeau à récupérer')
    expect(sousTitreBoite([NON_LUE], MAINTENANT)).toBe('1 non lue')
    expect(sousTitreBoite([LUE_RECENTE], MAINTENANT)).toBe('Tout est lu')
    expect(sousTitreBoite([], MAINTENANT)).toBe('Rien pour l’instant')
  })
})
