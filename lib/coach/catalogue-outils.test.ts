import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { FAMILLES, OUTILS, outilsDe } from './catalogue-outils'
import { MODES } from './outils'
import { parseVue } from './marcel-vues'
import { parseOnglet } from './bureau'

describe('le catalogue des outils de Marcel', () => {
  it('compte vingt-quatre outils, six par famille', () => {
    expect(OUTILS).toHaveLength(24)
    for (const f of FAMILLES) expect(outilsDe(f.id), f.id).toHaveLength(6)
  })

  it('n’a ni identifiant ni libellé en double', () => {
    expect(new Set(OUTILS.map((o) => o.id)).size).toBe(OUTILS.length)
    expect(new Set(OUTILS.map((o) => o.label)).size).toBe(OUTILS.length)
  })

  it('chaque outil a son dessin sur le disque', () => {
    for (const o of OUTILS) {
      expect(fs.existsSync(path.join(process.cwd(), 'public', o.image)), `${o.id} : ${o.image}`).toBe(true)
    }
  })

  it('chaque outil dit en QUELQUES mots ce qu’on obtient (un bloc carré)', () => {
    for (const o of OUTILS) {
      expect(o.mots.length, o.id).toBeGreaterThan(5)
      expect(o.mots.length, o.id).toBeLessThanOrEqual(28)
      expect(o.label.length, o.id).toBeLessThanOrEqual(20)
    }
  })

  it('chaque mode visé existe dans le champ', () => {
    for (const o of OUTILS) {
      if (o.cible.type === 'mode') expect(MODES[o.cible.mode], o.id).toBeDefined()
    }
  })

  it('chaque page visée existe : une vue de Marcel ou une route de l’app', () => {
    for (const o of OUTILS) {
      if (o.cible.type !== 'page') continue
      const url = new URL(o.cible.href, 'https://studuel.test')
      if (url.pathname === '/marcel' && url.searchParams.has('onglet')) {
        // Un onglet du bureau (« Mode examen » → l’onglet Examen).
        expect(parseOnglet(url.searchParams.get('onglet')), o.id).toBe(url.searchParams.get('onglet'))
      } else if (url.pathname === '/marcel') {
        expect(parseVue(url.searchParams.get('vue') ?? undefined), o.id).toBe(url.searchParams.get('vue'))
      } else {
        const dossier = path.join(process.cwd(), 'app', ...url.pathname.split('/').filter(Boolean))
        expect(fs.existsSync(path.join(dossier, 'page.tsx')), o.id).toBe(true)
      }
    }
  })
})
