import { beforeEach, describe, expect, it, vi } from 'vitest'

// Le rattachement par code (« J'ai un code », lien d'invitation) : le cookie
// d'abord, le code du brouillon en secours (17/10/2026, entrée des joueurs de
// basket — un cookie perdu faisait naître le compte hors du groupe).

const jar = new Map<string, string>()
const supprimes: string[] = []
const rpc = vi.fn()
let utilisateur: { id: string } | null = { id: 'eleve-1' }

vi.mock('server-only', () => ({}))
vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (nom: string) => (jar.has(nom) ? { value: jar.get(nom) } : undefined),
    delete: (nom: string) => {
      supprimes.push(nom)
      jar.delete(nom)
    },
  }),
}))
vi.mock('@/lib/supabase/server', () => ({ createClient: async () => ({ rpc }) }))
vi.mock('@/lib/supabase/user', () => ({ getCurrentUser: async () => utilisateur }))

const { claimPendingCoachCode } = await import('./coach-claim')

beforeEach(() => {
  jar.clear()
  supprimes.length = 0
  rpc.mockReset()
  rpc.mockResolvedValue({ data: 'ok', error: null })
  utilisateur = { id: 'eleve-1' }
})

describe('claimPendingCoachCode', () => {
  it('rattache avec le code du cookie, puis efface le cookie', async () => {
    jar.set('studuel_coach', 'ABCD2345')
    await claimPendingCoachCode()
    expect(rpc).toHaveBeenCalledWith('rattachement_par_code', { p_code: 'ABCD2345' })
    expect(supprimes).toContain('studuel_coach')
  })

  it('sans cookie, rattache avec le code du brouillon', async () => {
    await claimPendingCoachCode('WXYZ6789')
    expect(rpc).toHaveBeenCalledWith('rattachement_par_code', { p_code: 'WXYZ6789' })
  })

  it('le cookie passe avant le brouillon', async () => {
    jar.set('studuel_coach', 'ABCD2345')
    await claimPendingCoachCode('WXYZ6789')
    expect(rpc).toHaveBeenCalledWith('rattachement_par_code', { p_code: 'ABCD2345' })
  })

  it('ni cookie ni brouillon : rien', async () => {
    await claimPendingCoachCode(null)
    expect(rpc).not.toHaveBeenCalled()
  })

  it('pas encore de session : garde le cookie pour le prochain passage', async () => {
    utilisateur = null
    jar.set('studuel_coach', 'ABCD2345')
    await claimPendingCoachCode()
    expect(rpc).not.toHaveBeenCalled()
    expect(jar.get('studuel_coach')).toBe('ABCD2345')
  })

  it('panne technique : garde le cookie', async () => {
    rpc.mockResolvedValue({ data: null, error: { message: 'réseau' } })
    jar.set('studuel_coach', 'ABCD2345')
    await claimPendingCoachCode()
    expect(jar.get('studuel_coach')).toBe('ABCD2345')
  })

  it('un code de forme invalide est ignoré', async () => {
    await claimPendingCoachCode('trop-court')
    expect(rpc).not.toHaveBeenCalled()
  })
})
