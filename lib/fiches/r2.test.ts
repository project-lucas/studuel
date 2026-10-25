import { describe, expect, it } from 'vitest'
import { configR2, urlObjetR2 } from './r2'

const COMPTE = '0123456789abcdef0123456789abcdef'
const ENV = {
  R2_ACCOUNT_ID: COMPTE,
  R2_ACCESS_KEY_ID: 'cle',
  R2_SECRET_ACCESS_KEY: 'secret',
  R2_BUCKET_FICHES: 'studuel-fiches',
}

describe('configR2', () => {
  it('lit les quatre variables', () => {
    expect(configR2(ENV)).toEqual({ compte: COMPTE, cleId: 'cle', secret: 'secret', bucket: 'studuel-fiches' })
  })

  it('reste null si une variable manque : la route retombe sur Supabase', () => {
    expect(configR2({ ...ENV, R2_SECRET_ACCESS_KEY: undefined })).toBeNull()
    expect(configR2({})).toBeNull()
  })

  it('refuse un identifiant de compte mal formé', () => {
    expect(configR2({ ...ENV, R2_ACCOUNT_ID: 'mon-compte' })).toBeNull()
  })
})

describe('urlObjetR2', () => {
  it('vise l’objet dans le bucket du compte', () => {
    expect(urlObjetR2({ compte: COMPTE, bucket: 'studuel-fiches' }, 'abc.pdf')).toBe(
      `https://${COMPTE}.r2.cloudflarestorage.com/studuel-fiches/abc.pdf`,
    )
  })
})
