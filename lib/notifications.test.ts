import { describe, expect, it } from 'vitest'
import {
  COFFRE_URL,
  SRS_URL,
  STREAK_URL,
  coffreMessage,
  isReminderDue,
  srsMessage,
  streakMessage,
  urlBase64ToUint8Array,
} from './notifications'

describe('srsMessage', () => {
  it('retourne null quand aucune carte due', () => {
    expect(srsMessage(0)).toBeNull()
    expect(srsMessage(-3)).toBeNull()
    expect(srsMessage(Number.NaN)).toBeNull()
  })

  it('accorde le singulier', () => {
    const m = srsMessage(1)
    expect(m?.body).toContain('1 carte à revoir')
    expect(m?.body).not.toContain('cartes')
  })

  it('accorde le pluriel et mentionne la matière', () => {
    const m = srsMessage(8, 'Maths')
    expect(m?.body).toContain('8 cartes')
    expect(m?.body).toContain('en Maths')
    expect(m?.url).toBe(SRS_URL)
    expect(m?.kind).toBe('srs')
  })

  it('omet la matière si absente', () => {
    const m = srsMessage(3, null)
    expect(m?.body).not.toContain('en ')
  })
})

describe('streakMessage', () => {
  it('ne notifie pas si déjà actif aujourd’hui', () => {
    expect(streakMessage(5, true)).toBeNull()
  })

  it('ne notifie pas sans série à perdre', () => {
    expect(streakMessage(0, false)).toBeNull()
  })

  it('notifie quand la série est en danger', () => {
    const m = streakMessage(5, false)
    expect(m?.title).toContain('5 jours')
    expect(m?.url).toBe(STREAK_URL)
    expect(m?.kind).toBe('streak')
  })

  it('emploie un message spécifique pour une série de 1 jour', () => {
    const m = streakMessage(1, false)
    expect(m?.title).toBe('Ne casse pas ta série !')
  })
})

describe('isReminderDue', () => {
  // Les crons Vercel tournent en UTC : c'est le décalage saisonnier qu'on teste.
  it('laisse passer 8h de Paris en HIVER (UTC+1)', () => {
    expect(isReminderDue('srs', new Date('2026-01-15T07:00:00Z'))).toBe(true)
    expect(isReminderDue('srs', new Date('2026-01-15T06:00:00Z'))).toBe(false)
  })

  it('laisse passer 8h de Paris en ÉTÉ (UTC+2)', () => {
    expect(isReminderDue('srs', new Date('2026-07-15T06:00:00Z'))).toBe(true)
    expect(isReminderDue('srs', new Date('2026-07-15T07:00:00Z'))).toBe(false)
  })

  it('vise 19h de Paris pour le rappel de série, dans les deux saisons', () => {
    expect(isReminderDue('streak', new Date('2026-01-15T18:00:00Z'))).toBe(true)
    expect(isReminderDue('streak', new Date('2026-01-15T17:00:00Z'))).toBe(false)
    expect(isReminderDue('streak', new Date('2026-07-15T17:00:00Z'))).toBe(true)
    expect(isReminderDue('streak', new Date('2026-07-15T18:00:00Z'))).toBe(false)
  })

  it('ne confond pas les deux rappels', () => {
    const matin = new Date('2026-07-15T06:00:00Z') // 8h de Paris
    expect(isReminderDue('srs', matin)).toBe(true)
    expect(isReminderDue('streak', matin)).toBe(false)
  })
})

describe('urlBase64ToUint8Array', () => {
  it('décode une clé base64url en octets', () => {
    // "hello" en base64 standard = "aGVsbG8="
    const out = urlBase64ToUint8Array('aGVsbG8')
    expect(Array.from(out)).toEqual([104, 101, 108, 108, 111])
  })

  it('gère les caractères base64url (- et _)', () => {
    // octets [0xFB, 0xFF] → base64 "+/8=" → base64url "-_8"
    const out = urlBase64ToUint8Array('-_8')
    expect(Array.from(out)).toEqual([251, 255])
  })
})

describe('le rappel du coffre d’équipe (migration 379)', () => {
  it('annonce le niveau et le contenu du coffre, et mène à l’onglet Amis', () => {
    const m = coffreMessage(3)
    expect(m).toMatchObject({ kind: 'coffre', title: 'Ton coffre d’équipe est ouvert !', url: COFFRE_URL })
    expect(m?.body).toBe('Niveau 3 : 450 XP et 15 gemmes t’attendent. Viens l’ouvrir !')
  })

  it('ne dit rien d’un coffre vide', () => {
    expect(coffreMessage(0)).toBeNull()
    expect(coffreMessage(Number.NaN)).toBeNull()
  })

  it('ne part que le lundi, à 8h de Paris, dans les deux saisons', () => {
    // lundi 21/09/2026 (été, UTC+2) et lundi 19/01/2026 (hiver, UTC+1)
    expect(isReminderDue('coffre', new Date('2026-09-21T06:30:00Z'))).toBe(true)
    expect(isReminderDue('coffre', new Date('2026-09-21T07:30:00Z'))).toBe(false)
    expect(isReminderDue('coffre', new Date('2026-01-19T07:30:00Z'))).toBe(true)
    // mardi 22/09/2026 à 8h de Paris : pas de coffre
    expect(isReminderDue('coffre', new Date('2026-09-22T06:30:00Z'))).toBe(false)
  })
})
