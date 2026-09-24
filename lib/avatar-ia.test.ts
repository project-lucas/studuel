import { describe, expect, it } from 'vitest'
import {
  DEMANDE_MAX,
  estAvatarIa,
  idAvatarIa,
  messageRefus,
  nettoyerDemande,
  promptAvatar,
  refusDemande,
  srcAvatarIa,
} from './avatar-ia'

const ID = '0f8b3c2a-1d2e-4f5a-8b6c-7d8e9f0a1b2c'

describe('l’identifiant d’un avatar généré', () => {
  it('reconnaît ia:<uuid> et rien d’autre', () => {
    expect(estAvatarIa(`ia:${ID}`)).toBe(true)
    expect(idAvatarIa(`ia:${ID}`)).toBe(ID)
    expect(estAvatarIa('7')).toBe(false)
    expect(estAvatarIa(`ia:${ID}/../x`)).toBe(false)
    expect(estAvatarIa('ia:pas-un-uuid')).toBe(false)
    expect(idAvatarIa(null)).toBeNull()
    expect(srcAvatarIa(ID)).toBe(`/api/avatar-ia/${ID}`)
  })
})

describe('la demande de l’élève', () => {
  it('est nettoyée et bornée', () => {
    expect(nettoyerDemande('  un   renard\n ninja  ')).toBe('un renard ninja')
    expect(nettoyerDemande('x'.repeat(300))).toHaveLength(DEMANDE_MAX)
  })

  it('accepte un personnage ordinaire, y compris une épée de chevalier', () => {
    expect(refusDemande('une chevalière avec une épée')).toBeNull()
    expect(refusDemande('un astronaute dans les nuages')).toBeNull()
  })

  it('refuse ce qu’on ne dessine pas pour un élève, sans piéger les mots voisins', () => {
    expect(refusDemande('un zombie plein de sang')).toBe('interdite')
    expect(refusDemande('une fille SEXY')).toBe('interdite')
    expect(refusDemande('un pirate avec un pistolet')).toBe('interdite')
    expect(refusDemande('un soldat nazi')).toBe('interdite')
    // « nu » est interdit, pas « nuage » ni « menu »
    expect(refusDemande('un menu de nuages')).toBeNull()
  })

  it('refuse le trop court et le trop long', () => {
    expect(refusDemande('ok')).toBe('courte')
    expect(refusDemande('a'.repeat(DEMANDE_MAX + 5))).toBe('longue')
    expect(messageRefus('interdite')).toMatch(/Marcel ne dessine pas ça/)
  })
})

describe('le prompt envoyé au modèle', () => {
  it('cite la demande dans un cadre fixe : portrait, style de l’app, pas de texte, adapté aux élèves', () => {
    const p = promptAvatar('un renard "ninja"')
    expect(p).toContain("«un renard 'ninja'»")
    expect(p).toMatch(/head and shoulders/)
    expect(p).toMatch(/No text/)
    expect(p).toMatch(/aged 11 to 18/)
  })
})
