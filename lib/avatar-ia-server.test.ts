import { createHmac } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { signerImage } from './avatar-ia-server'

describe('la signature d’un avatar dessiné', () => {
  it('est le HMAC-SHA256 de « job.image » — le calcul que refait avatar_ia_terminer', () => {
    const job = '0f8b3c2a-1d2e-4f5a-8b6c-7d8e9f0a1b2c'
    const image = Buffer.from('une image').toString('base64')
    const secret = 's'.repeat(40)
    expect(signerImage(job, image, secret)).toBe(
      createHmac('sha256', secret).update(`${job}.${image}`).digest('hex'),
    )
    // une autre image, un autre job : une autre signature
    expect(signerImage(job, 'autre', secret)).not.toBe(signerImage(job, image, secret))
  })
})
