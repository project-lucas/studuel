import { describe, expect, it } from 'vitest'
import { EnvoiEchoue, envoyerAvecRelances } from '@/lib/duel/envoi'

const sansAttente = { attendre: async () => {}, pauses: [10, 20] }

describe('l’envoi de la fin d’une course', () => {
  it('rend la réponse du premier essai réussi', async () => {
    let essais = 0
    const r = await envoyerAvecRelances(async () => {
      essais++
      return 'ok'
    }, sansAttente)
    expect(r).toBe('ok')
    expect(essais).toBe(1)
  })

  it('réessaie après une panne passagère', async () => {
    let essais = 0
    const r = await envoyerAvecRelances(async () => {
      essais++
      if (essais < 3) throw new Error('réseau muet')
      return 'enfin'
    }, sansAttente)
    expect(r).toBe('enfin')
    expect(essais).toBe(3)
  })

  it('abandonne après trois essais et remonte la dernière erreur', async () => {
    let essais = 0
    await expect(
      envoyerAvecRelances(async () => {
        essais++
        throw new Error(`essai ${essais}`)
      }, sansAttente),
    ).rejects.toThrow('essai 3')
    expect(essais).toBe(3)
  })

  it('ne réessaie pas un refus définitif du serveur', async () => {
    let essais = 0
    await expect(
      envoyerAvecRelances(async () => {
        essais++
        throw new EnvoiEchoue('Réponse 401', true)
      }, sansAttente),
    ).rejects.toThrow('401')
    expect(essais).toBe(1)
  })

  it('interrompt un essai resté sans réponse', async () => {
    let interrompu = false
    await expect(
      envoyerAvecRelances(
        (signal) =>
          new Promise((_, reject) => {
            signal.addEventListener('abort', () => {
              interrompu = true
              reject(new Error('interrompu'))
            })
          }),
        { ...sansAttente, pauses: [], delaiMaxMs: 5 },
      ),
    ).rejects.toThrow('interrompu')
    expect(interrompu).toBe(true)
  })
})
