import { describe, expect, it } from 'vitest'
import { bossForSubject } from '@/lib/bosses'
import { emptyGauge, type TraqueGauge } from '@/lib/traque'
import { gardiensSortis } from '@/lib/traque-server'

// LES GARDIENS QUI COLORENT UN DOSSIER, sur l'accueil Réviser.
//
// La composition seule est testée ici : `gardiensSortis` est pure, les jauges
// lui sont données. Ce qu'elle garde par rapport au plateau de l'arène est tout
// l'objet de ce fichier — deux règles justes là-bas et fausses ici.

const HEURE = 60 * 60 * 1000
const MAINTENANT = Date.UTC(2026, 8, 1, 12, 0, 0)

/**
 * Une jauge dont le gardien est sorti il y a `ilYA` millisecondes.
 *
 * ⚠️ `debusqueAt` est une CHAÎNE ISO, pas un instant en millisecondes : la
 * colonne vient de Postgres et `windowEndMs` la lit avec `Date.parse`. Un
 * nombre y donne `NaN`, donc « pas de fenêtre », donc aucun gardien — un
 * fixture faux qui aurait fait passer ces tests pour un défaut du code.
 */
const sortie = (nom: string, ilYA = 0): TraqueGauge => ({
  ...emptyGauge(bossForSubject(nom).id),
  debusqueAt: new Date(MAINTENANT - ilYA).toISOString(),
})

const matieres = (...noms: string[]) =>
  noms.map((n) => ({ name: n, slug: n.toLowerCase().replace(/[^a-z]+/g, '-') }))

const carte = (gauges: TraqueGauge[]) =>
  new Map(gauges.map((g) => [g.bossId, g]))

describe('les gardiens sortis', () => {
  it('rend la FIN de la fenêtre, pas le temps restant', () => {
    // Un « il reste 38 min » calculé au rendu serveur se périme à la seconde
    // suivante. Le client repart de cette borne et l'égrène lui-même — même
    // geste que la bannière de l'arène.
    const g = gardiensSortis(
      carte([sortie('Anglais', 20 * 60 * 1000)]),
      matieres('Anglais'),
      MAINTENANT,
    )
    expect(g.anglais?.endsAt).toBe(MAINTENANT - 20 * 60 * 1000 + HEURE)
  })

  it('ne rend RIEN quand aucun n’est sorti', () => {
    expect(gardiensSortis(new Map(), matieres('Anglais'), MAINTENANT)).toEqual({})
  })

  it('nomme le gardien de la matière où il est sorti', () => {
    const g = gardiensSortis(
      carte([sortie('Anglais')]),
      matieres('Anglais', 'Espagnol'),
      MAINTENANT,
    )
    expect(g).toEqual({
      anglais: { boss: 'Big Ben', endsAt: MAINTENANT + HEURE },
    })
  })

  it('LE GARDE TOUTE L’HEURE, minute par minute', () => {
    // LA RÈGLE, ET ELLE N'A PAS D'EXCEPTION : un gardien sorti reste sur le
    // dossier de sa matière pendant UNE HEURE PLEINE, parce que c'est le temps
    // que l'élève a pour l'affronter. Rien ne doit l'écourter.
    for (const minutes of [0, 1, 15, 30, 45, 59]) {
      const g = gardiensSortis(
        carte([sortie('Anglais', minutes * 60 * 1000)]),
        matieres('Anglais'),
        MAINTENANT,
      )
      expect(g.anglais?.boss, `à ${minutes} min`).toBe('Big Ben')
    }
    // À la seconde près : présent à 59 min 59 s, parti à 60 min.
    const juste = gardiensSortis(
      carte([sortie('Anglais', HEURE - 1000)]),
      matieres('Anglais'),
      MAINTENANT,
    )
    expect(juste.anglais?.boss).toBe('Big Ben')
    const fini = gardiensSortis(
      carte([sortie('Anglais', HEURE)]),
      matieres('Anglais'),
      MAINTENANT,
    )
    expect(fini).toEqual({})
  })

  it('tient l’heure pour TOUS les gardiens, sans exception', () => {
    // « Peu importe le boss qui apparaît » : celui d'une matière ordinaire,
    // celui que deux matières partagent, et le filet de sécurité Nox.
    const g = gardiensSortis(
      carte([sortie('Anglais', 30 * 60 * 1000), sortie('EMC', 30 * 60 * 1000), sortie('Physique-Chimie', 30 * 60 * 1000)]),
      matieres('Anglais', 'EMC', 'Physique-Chimie', 'Chimie'),
      MAINTENANT,
    )
    expect(Object.keys(g).sort()).toEqual([
      'anglais',
      'chimie',
      'emc',
      'physique-chimie',
    ])
  })

  it('l’oublie dès que sa fenêtre est passée', () => {
    // La fenêtre dure une heure : deux heures plus tard, le dossier redevient
    // blanc. Colorer un dossier pour un combat que le serveur refuserait serait
    // une promesse en l'air.
    const g = gardiensSortis(
      carte([sortie('Anglais', 2 * HEURE)]),
      matieres('Anglais'),
      MAINTENANT,
    )
    expect(g).toEqual({})
  })

  it('ALLUME LES DEUX matières qui partagent un gardien', () => {
    // Physique-Chimie et Chimie ont le même boss, donc la MÊME jauge : réviser
    // l'une ou l'autre la nourrit. Le plateau de l'arène n'en garde qu'une pour
    // ne pas afficher deux fois la même carte — ici, la seconde resterait
    // blanche alors que son gardien est bel et bien sorti.
    const g = gardiensSortis(
      carte([sortie('Physique-Chimie')]),
      matieres('Physique-Chimie', 'Chimie'),
      MAINTENANT,
    )
    expect(Object.keys(g).sort()).toEqual(['chimie', 'physique-chimie'])
  })

  it('N’ÉCARTE PAS les matières qui retombent sur Nox', () => {
    // Le plateau de l'arène les écarte, à raison : Nox est le filet de
    // sécurité, et dix matières sous Nox y feraient dix fois la même carte.
    // Mais la page de CES matières leur montre bien un gardien
    // (`fetchGardienCard`) : un dossier resté blanc pendant que sa propre page
    // affiche un boss se lirait comme un bug.
    expect(bossForSubject('EMC').id).toBe('nox')
    const g = gardiensSortis(carte([sortie('EMC')]), matieres('EMC'), MAINTENANT)
    expect(g.emc?.boss).toBe('Nox')
  })

  it('encaisse des jauges illisibles sans rien colorer', () => {
    // Migration 212 pas exécutée : `fetchGauges` rend null. L'accueil ne doit
    // pas tomber pour une décoration.
    expect(gardiensSortis(null, matieres('Anglais'), MAINTENANT)).toEqual({})
  })
})
