import { describe, expect, it } from 'vitest'
import { isMissingSchemaObject } from './schema-fallback'

describe('isMissingSchemaObject', () => {
  it('reconnaît une RPC pas encore créée', () => {
    expect(isMissingSchemaObject({ code: 'PGRST202' })).toBe(true)
    expect(isMissingSchemaObject({ code: '42883' })).toBe(true)
  })

  it('reconnaît une colonne pas encore créée', () => {
    expect(isMissingSchemaObject({ code: '42703' })).toBe(true)
    expect(isMissingSchemaObject({ code: 'PGRST204' })).toBe(true)
  })

  it('REFUSE de se replier sur un refus de droit', () => {
    // Le cas qui compte : `REVOKE SELECT` sur la colonne payante. S'y replier
    // rouvrirait la porte que les migrations 182 et 185 ont fermée.
    expect(isMissingSchemaObject({ code: '42501' })).toBe(false)
  })

  it('refuse toute autre erreur (panne, réseau, code absent)', () => {
    expect(isMissingSchemaObject({ code: '08006' })).toBe(false)
    expect(isMissingSchemaObject({ code: 'PGRST301' })).toBe(false)
    expect(isMissingSchemaObject({ code: '' })).toBe(false)
    expect(isMissingSchemaObject({})).toBe(false)
    expect(isMissingSchemaObject(null)).toBe(false)
    expect(isMissingSchemaObject(undefined)).toBe(false)
  })
})
