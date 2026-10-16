import { describe, expect, it } from 'vitest'
import {
  avertissementFil,
  filDepuis,
  filtrerFils,
  fusionnerMessages,
  horodatageListe,
  jourParis,
  libelleJour,
  messageDepuis,
  messageErreurBase,
  rangerMessages,
  titreFil,
  totalNonLus,
  verifierCorps,
  verifierPiece,
  type Fil,
  type Message,
} from './fil'

const base = {
  id: 'f1', type: 'eleve', coach_id: 'c', coach_prenom: 'Lucas', eleve_id: 'e', eleve_prenom: 'Léa',
  eleve_classe: '3e', parent_prenom: 'Mme Martin', consentement: 'parent_app', mon_role: 'coach',
  cree_le: '2026-10-16T08:00:00Z', dernier_message_le: null, dernier_extrait: null,
  dernier_auteur_moi: false, non_lus: 2, peut_ecrire: true, signalements: 0,
}
const fil = (p: Partial<Record<string, unknown>> = {}): Fil => filDepuis({ ...base, ...p })

function msg(id: string, auteur: string, creeLe: string): Message {
  return messageDepuis({ id, auteur_id: auteur, auteur_prenom: auteur, auteur_role: 'eleve', corps: id, cree_le: creeLe })
}

describe('filDepuis', () => {
  it('normalise une ligne et borne les valeurs', () => {
    const f = filDepuis({ ...base, type: 'bizarre', non_lus: -3, consentement: 'x' })
    expect(f.type).toBe('eleve')
    expect(f.nonLus).toBe(0)
    expect(f.consentement).toBeNull()
  })
})

describe('titreFil', () => {
  it('le coach voit l’élève, le parent, le trio', () => {
    expect(titreFil(fil())).toBe('Léa')
    expect(titreFil(fil({ type: 'parent' }))).toBe('Mme Martin (parent de Léa)')
    expect(titreFil(fil({ type: 'trio' }))).toBe('Léa et Mme Martin')
  })
  it('l’élève voit son coach', () => {
    expect(titreFil(fil({ mon_role: 'eleve' }))).toBe('Lucas')
    expect(titreFil(fil({ mon_role: 'eleve', type: 'trio' }))).toBe('Lucas, toi et Mme Martin')
  })
  it('le parent voit le coach de son enfant', () => {
    expect(titreFil(fil({ mon_role: 'parent', type: 'parent' }))).toBe('Lucas · coach de Léa')
  })
  it('l’admin en supervision lit comme le coach', () => {
    expect(titreFil(fil({ mon_role: null }))).toBe('Léa')
  })
})

describe('avertissementFil', () => {
  it('dit à l’élève que son parent sait', () => {
    expect(avertissementFil(fil({ mon_role: 'eleve' }))).toContain('Ton parent sait')
  })
  it('rappelle au coach que tout est archivé', () => {
    expect(avertissementFil(fil())).toContain('archivé')
  })
})

describe('les jours', () => {
  it('jourParis passe minuit à l’heure de Paris', () => {
    // 23 h 30 UTC le 15 = 1 h 30 le 16 à Paris (heure d'été).
    expect(jourParis('2026-10-15T23:30:00Z')).toBe('2026-10-16')
  })
  it('libelleJour', () => {
    expect(libelleJour('2026-10-16', '2026-10-16')).toBe('Aujourd’hui')
    expect(libelleJour('2026-10-15', '2026-10-16')).toBe('Hier')
    expect(libelleJour('2026-10-13', '2026-10-16')).toBe('mardi')
    expect(libelleJour('2026-10-05', '2026-10-16')).toBe('lundi 5 octobre')
    expect(libelleJour('2025-03-03', '2026-10-16')).toBe('3 mars 2025')
  })
  it('horodatageListe', () => {
    const maintenant = new Date('2026-10-16T12:00:00Z')
    expect(horodatageListe('2026-10-16T08:05:00Z', maintenant)).toBe('10:05')
    expect(horodatageListe('2026-10-15T08:05:00Z', maintenant)).toBe('Hier')
    expect(horodatageListe('2026-10-01T08:05:00Z', maintenant)).toBe('01/10')
    expect(horodatageListe(null, maintenant)).toBe('')
  })
})

describe('rangerMessages', () => {
  it('sépare les jours et colle les messages proches d’un même auteur', () => {
    const blocs = rangerMessages(
      [
        msg('c', 'Tom', '2026-10-16T09:03:00Z'),
        msg('a', 'Léa', '2026-10-15T09:00:00Z'),
        msg('b', 'Léa', '2026-10-16T09:00:00Z'),
        msg('d', 'Tom', '2026-10-16T09:20:00Z'),
        msg('e', 'Tom', '2026-10-16T09:22:00Z'),
      ],
      '2026-10-16',
    )
    expect(blocs.map((b) => (b.type === 'jour' ? b.libelle : b.messages?.map((m) => m.id).join('')))).toEqual([
      'Hier', 'a', 'Aujourd’hui', 'b', 'c', 'de',
    ])
  })
})

describe('fusionnerMessages', () => {
  it('sans doublon, le plus récent d’abord', () => {
    const a = msg('a', 'x', '2026-10-16T09:00:00Z')
    const b = msg('b', 'x', '2026-10-16T09:01:00Z')
    expect(fusionnerMessages([a], [b, a]).map((m) => m.id)).toEqual(['b', 'a'])
  })
})

describe('verifierCorps', () => {
  it('refuse le vide sans pièce, l’accepte avec', () => {
    expect(verifierCorps('   ', false).ok).toBe(false)
    expect(verifierCorps('   ', true)).toEqual({ ok: true, corps: '' })
  })
  it('refuse au-delà de 4000 caractères', () => {
    expect(verifierCorps('x'.repeat(4001), false).ok).toBe(false)
  })
})

describe('verifierPiece', () => {
  it('accepte photo et PDF, refuse le reste et le trop lourd', () => {
    expect(verifierPiece({ type: 'image/jpeg', size: 10, name: 'a.jpg' })).toEqual({ ok: true, type: 'image', extension: 'jpg' })
    expect(verifierPiece({ type: 'application/pdf', size: 10, name: 'a.pdf' })).toEqual({ ok: true, type: 'pdf', extension: 'pdf' })
    expect(verifierPiece({ type: 'video/mp4', size: 10, name: 'a.mp4' }).ok).toBe(false)
    expect(verifierPiece({ type: 'image/png', size: 9 * 1024 * 1024, name: 'a.png' }).ok).toBe(false)
  })
})

describe('messageErreurBase', () => {
  it('traduit les erreurs de la 587', () => {
    expect(messageErreurBase('ERROR: consentement')).toContain('consentement')
    expect(messageErreurBase('lien_rompu')).toContain('lecture seule')
    expect(messageErreurBase(undefined)).toContain('Réessaie')
  })
})

describe('liste des fils', () => {
  it('total des non-lus (pas ceux de la supervision)', () => {
    expect(totalNonLus([fil(), fil({ id: 'f2', non_lus: 3, mon_role: null })])).toBe(2)
  })
  it('filtre sans accent et par sorte', () => {
    const fils = [fil(), fil({ id: 'f2', eleve_prenom: 'Tom', type: 'trio' })]
    expect(filtrerFils(fils, 'lea', null).map((f) => f.id)).toEqual(['f1'])
    expect(filtrerFils(fils, '', 'trio').map((f) => f.id)).toEqual(['f2'])
  })
})
