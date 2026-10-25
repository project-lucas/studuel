import { describe, expect, it } from 'vitest'
import { assetLinks, empreintesDepuis } from './twa'

const E1 = Array.from({ length: 32 }, () => 'AB').join(':')
const E2 = Array.from({ length: 32 }, () => '0f').join(':')

describe('empreintesDepuis', () => {
  it('lit plusieurs empreintes séparées par des virgules, en majuscules', () => {
    expect(empreintesDepuis(` ${E1} , ${E2}`)).toEqual([E1, E2.toUpperCase()])
  })

  it('écarte une empreinte mal formée et une variable absente', () => {
    expect(empreintesDepuis('AB:CD')).toEqual([])
    expect(empreintesDepuis(undefined)).toEqual([])
  })
})

describe('assetLinks', () => {
  it('déclare le paquet et ses empreintes', () => {
    expect(assetLinks('app.studuel', [E1])).toEqual([
      {
        relation: ['delegate_permission/common.handle_all_urls'],
        target: { namespace: 'android_app', package_name: 'app.studuel', sha256_cert_fingerprints: [E1] },
      },
    ])
  })

  it('reste vide sans paquet valide ou sans empreinte', () => {
    expect(assetLinks(undefined, [E1])).toEqual([])
    expect(assetLinks('Studuel', [E1])).toEqual([])
    expect(assetLinks('app.studuel', [])).toEqual([])
  })
})
