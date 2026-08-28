import { describe, expect, it } from 'vitest'
import {
  VARS_SANTE,
  resumeParPortee,
  varsManquantes,
  verdictsEnv,
  type VarSante,
} from './sante-env'

const NOMS = VARS_SANTE.map((v) => v.nom)

describe('VARS_SANTE — le catalogue', () => {
  it('ne contient aucun doublon', () => {
    expect(new Set(NOMS).size).toBe(NOMS.length)
  })

  it('ne surveille QUE des variables dont l’absence est silencieuse', () => {
    // On n'y met pas l'URL ni la clé Supabase : sans elles l'app ne démarre
    // pas, leur absence se voit tout de suite. Ce catalogue est fait pour ce
    // qui s'éteint SANS BRUIT — l'y noyer sous l'évident le rendrait inutile.
    expect(NOMS).not.toContain('NEXT_PUBLIC_SUPABASE_URL')
    expect(NOMS).not.toContain('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  })

  it('seules les variables `NEXT_PUBLIC_` sont de portée client', () => {
    // La convention Next.js est aussi une règle de sécurité : une variable
    // sans ce préfixe ne DOIT pas être annoncée comme lisible côté client, et
    // une variable avec ce préfixe est publique par construction — la ranger
    // en « serveur » laisserait croire qu'elle est secrète.
    for (const v of VARS_SANTE) {
      expect(v.portee === 'client', v.nom).toBe(v.nom.startsWith('NEXT_PUBLIC_'))
    }
  })

  it('chaque entrée dit ce que l’utilisateur voit quand elle manque', () => {
    for (const v of VARS_SANTE) {
      expect(v.siAbsente.length, v.nom).toBeGreaterThan(40)
      expect(v.feature.length, v.nom).toBeGreaterThan(10)
    }
  })

  it('couvre la paire VAPID ENTIÈRE, pas seulement la publique', () => {
    // Une paire à moitié posée est un état pire qu'une paire absente : elle
    // donne l'impression que la configuration a été faite.
    expect(NOMS).toContain('VAPID_PUBLIC_KEY')
    expect(NOMS).toContain('VAPID_PRIVATE_KEY')
    expect(NOMS).toContain('NEXT_PUBLIC_VAPID_PUBLIC_KEY')
  })
})

describe('verdictsEnv', () => {
  const vars: VarSante[] = [
    { nom: 'A', portee: 'serveur', feature: 'f', siAbsente: 's' },
    { nom: 'B', portee: 'serveur', feature: 'f', siAbsente: 's', facultative: true },
  ]

  it('distingue posée, manquante, et manquante-mais-facultative', () => {
    const v = verdictsEnv(new Set(['A']), vars)
    expect(v.get('A')).toBe('posee')
    expect(v.get('B')).toBe('manquante-facultative')

    const rien = verdictsEnv(new Set(), vars)
    expect(rien.get('A')).toBe('manquante')
    expect(rien.get('B')).toBe('manquante-facultative')
  })

  it('ne compte comme panne que les variables NON facultatives', () => {
    const manquantes = varsManquantes(verdictsEnv(new Set(), vars), vars)
    expect(manquantes.map((v) => v.nom)).toEqual(['A'])
  })

  it('ignore un nom présent qui n’est pas au catalogue', () => {
    const v = verdictsEnv(new Set(['A', 'INCONNUE']), vars)
    expect(v.size).toBe(2)
  })

  it('rend un verdict pour CHAQUE variable du catalogue', () => {
    expect(verdictsEnv(new Set(), VARS_SANTE).size).toBe(VARS_SANTE.length)
  })
})

describe('resumeParPortee', () => {
  it('compte posées et manquantes par portée', () => {
    const vars: VarSante[] = [
      { nom: 'NEXT_PUBLIC_X', portee: 'client', feature: 'f', siAbsente: 's' },
      { nom: 'S1', portee: 'serveur', feature: 'f', siAbsente: 's' },
      { nom: 'S2', portee: 'serveur', feature: 'f', siAbsente: 's' },
    ]
    const r = resumeParPortee(verdictsEnv(new Set(['S1']), vars), vars)
    expect(r).toEqual([
      { portee: 'client', posees: 0, manquantes: 1 },
      { portee: 'serveur', posees: 1, manquantes: 1 },
    ])
  })

  it('omet une portée sans aucune variable', () => {
    const r = resumeParPortee(verdictsEnv(new Set(), VARS_SANTE))
    expect(r.some((x) => x.portee === 'github')).toBe(false)
  })
})
