import { describe, expect, it } from 'vitest'
import {
  HAUTEUR_MIN_PCT,
  challengerDe,
  classerAmisPar,
  couronneDe,
  detailJoueur,
  hauteursDesColonnes,
  libelleMouvement,
  libelleValeur,
  lireClassementAmis,
  phraseDuClassement,
  type AmiClasse,
} from './classement-amis'

const joueur = (over: Partial<AmiClasse> & { id: string }): AmiClasse => ({
  nom: over.id,
  portrait: '',
  moi: false,
  trophees: 0,
  tropheesSemaine: 0,
  secondesSemaine: 0,
  secondes: 0,
  ...over,
})

const moi = joueur({ id: 'moi', nom: 'Sacha', moi: true, trophees: 120, tropheesSemaine: 8, secondesSemaine: 1800 })
const lea = joueur({ id: 'lea', nom: 'Léa', trophees: 300, tropheesSemaine: 12, secondesSemaine: 7800 })
const rayan = joueur({ id: 'rayan', nom: 'Rayan', trophees: 40, tropheesSemaine: 30, secondesSemaine: 9000 })

describe('lireClassementAmis', () => {
  it('relit les lignes de la fonction, nombres en texte compris', () => {
    const lus = lireClassementAmis([
      { id: 'a', nom: 'Léa', portrait: '5', moi: false, trophees: 300, trophees_semaine: '8', secondes: 72000, secondes_semaine: 3600 },
      { id: 'b', nom: 'Sacha', portrait: '', moi: true, trophees: 120, trophees_semaine: -4, secondes: 0, secondes_semaine: 0 },
    ])
    expect(lus).toEqual([
      { id: 'a', nom: 'Léa', portrait: '5', moi: false, trophees: 300, tropheesSemaine: 8, secondes: 72000, secondesSemaine: 3600 },
      { id: 'b', nom: 'Sacha', portrait: '', moi: true, trophees: 120, tropheesSemaine: -4, secondes: 0, secondesSemaine: 0 },
    ])
  })

  it('écarte ce qui n’est pas une ligne et répare ce qui manque', () => {
    expect(lireClassementAmis(null)).toEqual([])
    expect(lireClassementAmis({ id: 'a' })).toEqual([])
    const [seul] = lireClassementAmis(['texte', { nom: 'sans id' }, { id: 'a', nom: '  ', secondes_semaine: -50 }])
    expect(seul).toMatchObject({ id: 'a', nom: 'Élève', moi: false, trophees: 0, secondesSemaine: 0 })
    expect(lireClassementAmis(['texte', { nom: 'sans id' }])).toEqual([])
  })
})

describe('classerAmisPar', () => {
  it('classe aux trophées, puis au temps de la semaine', () => {
    expect(classerAmisPar([moi, lea, rayan], 'trophees').map((j) => j.id)).toEqual(['lea', 'moi', 'rayan'])
    expect(classerAmisPar([moi, lea, rayan], 'temps').map((j) => j.id)).toEqual(['rayan', 'lea', 'moi'])
  })

  it('à égalité, l’ami passe devant moi : il faut le dépasser', () => {
    const egal = joueur({ id: 'zoe', nom: 'Zoé', trophees: 120 })
    const classes = classerAmisPar([moi, egal], 'trophees')
    expect(classes.map((j) => j.id)).toEqual(['zoe', 'moi'])
    expect(classes.map((j) => j.rang)).toEqual([1, 2])
  })

  it('ne mute pas la liste reçue', () => {
    const liste = [moi, lea]
    classerAmisPar(liste, 'trophees')
    expect(liste.map((j) => j.id)).toEqual(['moi', 'lea'])
  })
})

describe('couronneDe', () => {
  it('va au n° 1 de la mesure affichée', () => {
    expect(couronneDe(classerAmisPar([moi, lea, rayan], 'trophees'), 'trophees')).toBe('lea')
    expect(couronneDe(classerAmisPar([moi, lea, rayan], 'temps'), 'temps')).toBe('rayan')
  })

  it('ne couronne pas une colonne à zéro', () => {
    const a = joueur({ id: 'a' })
    const b = joueur({ id: 'b', moi: true })
    expect(couronneDe(classerAmisPar([a, b], 'temps'), 'temps')).toBeNull()
  })
})

describe('challengerDe — la meilleure semaine', () => {
  it('celui qui a le plus travaillé ET gagné de trophées', () => {
    // Rayan : le plus de temps et le plus de trophées gagnés, bien que dernier au total.
    expect(challengerDe([moi, lea, rayan])).toBe('rayan')
  })

  it('pèse les deux : beaucoup de travail sans trophée ne suffit pas toujours', () => {
    const bucheur = joueur({ id: 'bucheur', secondesSemaine: 6000, tropheesSemaine: 0 })
    const complet = joueur({ id: 'complet', secondesSemaine: 5000, tropheesSemaine: 20 })
    expect(challengerDe([bucheur, complet])).toBe('complet')
  })

  it('une semaine perdante vaut zéro, pas moins', () => {
    const perdant = joueur({ id: 'perdant', tropheesSemaine: -40, secondesSemaine: 600 })
    const absent = joueur({ id: 'absent' })
    expect(challengerDe([perdant, absent])).toBe('perdant')
  })

  it('personne quand rien n’a été fait, ni quand on est seul', () => {
    expect(challengerDe([joueur({ id: 'a' }), joueur({ id: 'b' })])).toBeNull()
    expect(challengerDe([moi])).toBeNull()
  })

  it('à égalité parfaite, l’ami avant moi', () => {
    const a = joueur({ id: 'a', moi: true, secondesSemaine: 600, tropheesSemaine: 5 })
    const b = joueur({ id: 'b', secondesSemaine: 600, tropheesSemaine: 5 })
    expect(challengerDe([a, b])).toBe('b')
  })
})

describe('hauteursDesColonnes', () => {
  it('la plus haute fait 100, les autres suivent, la plus petite reste visible', () => {
    const classes = classerAmisPar([lea, moi, joueur({ id: 'petit', trophees: 3 })], 'trophees')
    expect(hauteursDesColonnes(classes, 'trophees')).toEqual([100, 40, HAUTEUR_MIN_PCT])
  })

  it('une colonne à zéro reste à zéro', () => {
    const classes = classerAmisPar([lea, joueur({ id: 'rien' })], 'temps')
    expect(hauteursDesColonnes(classes, 'temps')).toEqual([100, 0])
    expect(hauteursDesColonnes([joueur({ id: 'a' })], 'temps')).toEqual([0])
  })
})

describe('les mots', () => {
  it('écrit la valeur du chapiteau', () => {
    expect(libelleValeur(joueur({ id: 'a', trophees: 1280 }), 'trophees')).toBe('1 280')
    expect(libelleValeur(lea, 'temps')).toBe('2 h 10')
    expect(libelleValeur(joueur({ id: 'a' }), 'temps')).toBe('0 min')
  })

  it('écrit le mouvement de la semaine', () => {
    expect(libelleMouvement(12)).toBe('+12')
    expect(libelleMouvement(-4)).toBe('−4')
    expect(libelleMouvement(0)).toBe('0')
  })

  it('dit le détail d’une colonne', () => {
    expect(detailJoueur(lea)).toBe('Léa · 300 trophées (+12 cette semaine) · 2 h 10 de travail cette semaine')
    expect(detailJoueur(moi)).toContain('Toi · 120 trophées (+8 cette semaine)')
  })
})

describe('phraseDuClassement', () => {
  it('dit ce qu’il manque pour passer devant', () => {
    const trophees = classerAmisPar([moi, lea, rayan], 'trophees')
    expect(phraseDuClassement(trophees, 'trophees')).toBe('Encore 181 trophées pour passer devant Léa.')
    const temps = classerAmisPar([moi, lea, rayan], 'temps')
    expect(phraseDuClassement(temps, 'temps')).toBe('Encore 1 h 40 de travail pour passer devant Léa.')
  })

  it('félicite celui qui mène, et pousse quand personne n’a marqué', () => {
    const tete = classerAmisPar([{ ...moi, trophees: 999 }, lea], 'trophees')
    expect(phraseDuClassement(tete, 'trophees')).toBe('Tu mènes aux trophées. Garde ta place.')
    const rien = classerAmisPar([joueur({ id: 'm', moi: true }), joueur({ id: 'a' })], 'temps')
    expect(phraseDuClassement(rien, 'temps')).toBe('Personne n’a encore marqué : prends la tête.')
  })

  it('un écart de moins d’une minute ne s’écrit pas « 0 min »', () => {
    const proche = classerAmisPar(
      [joueur({ id: 'm', nom: 'Moi', moi: true, secondesSemaine: 600 }), joueur({ id: 'a', nom: 'Léa', secondesSemaine: 630 })],
      'temps',
    )
    expect(phraseDuClassement(proche, 'temps')).toBe('Léa est juste devant toi : une minute de travail suffit.')
  })

  it('seul : une invitation', () => {
    expect(phraseDuClassement(classerAmisPar([moi], 'trophees'), 'trophees')).toBe('Ajoute un ami pour vous mesurer.')
  })
})
