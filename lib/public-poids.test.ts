import { readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC = path.join(ROOT, 'public')

// -----------------------------------------------------------------------------
// LE GARDE-FOU DE `public/` (31/08/2026).
//
// CE QUI S'EST PASSÉ. Les générateurs d'images (scripts/*.mjs) déposaient leurs
// SOURCES 4K dans `public/`, à côté des webp qu'elles produisent. Le dossier a
// atteint 285 Mo pour 9 Mo réellement servis : 276 Mo de masters PNG que Next
// exposait publiquement, puisqu'il sert `public/` tel quel.
//
// Le dépôt était protégé — mais par SEPT règles `.gitignore` écrites une par
// une, au fil des lots. C'est une protection qui se périme : le huitième
// générateur oublie sa ligne, et 20 Mo partent en production sans que rien ne
// le signale. Le masquage traitait le symptôme (le dépôt) et pas la cause (des
// sources rangées dans un dossier servi).
//
// LA RÈGLE, DONC : `public/` ne contient que ce qui est SERVI. Les sources
// vivent dans `assets-sources/`. Ce test le vérifie sur deux plans — aucun
// fichier lourd, et aucun PNG hors des deux icônes PWA — pour que l'oubli soit
// rouge en CI plutôt que découvert sur une facture de bande passante.
// -----------------------------------------------------------------------------

/** Un fichier servi qui dépasse ça est presque sûrement une source oubliée. */
const POIDS_MAX_KO = 600

/**
 * Les seuls PNG légitimes : les icônes PWA, référencées par `app/manifest.ts`.
 * Tout le reste de l'app est en webp — un PNG qui apparaît ailleurs est une
 * source qui a échappé au rangement.
 */
const PNG_AUTORISES = new Set(['icons/icon-192.png', 'icons/icon-512.png'])

type Fichier = { chemin: string; ko: number }

function fichiersDe(dir: string, base = ''): Fichier[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const abs = path.join(dir, e.name)
    // Chemin relatif à `public/`, toujours en séparateurs POSIX : le message
    // d'erreur doit être copiable tel quel, y compris depuis Windows.
    const rel = base ? `${base}/${e.name}` : e.name
    if (e.isDirectory()) return fichiersDe(abs, rel)
    return [{ chemin: rel, ko: Math.round(statSync(abs).size / 1024) }]
  })
}

describe('poids de public/', () => {
  const fichiers = fichiersDe(PUBLIC)

  it('ne sert aucun fichier de plus de 600 ko', () => {
    const lourds = fichiers
      .filter((f) => f.ko > POIDS_MAX_KO)
      .sort((a, b) => b.ko - a.ko)
      .map((f) => `${f.chemin} (${f.ko} ko)`)

    // Le message porte la marche à suivre : sans elle, le prochain à croiser
    // ce test le contournera en montant le seuil, ce qui rouvre exactement la
    // porte qu'il ferme.
    expect(
      lourds,
      lourds.length === 0
        ? ''
        : `Fichier(s) trop lourd(s) dans public/ :\n  ${lourds.join('\n  ')}\n` +
            `\nSi c'est une SOURCE de générateur : range-la dans assets-sources/` +
            ` et fais pointer le script dessus (voir scripts/serie-quizz.mjs).` +
            `\nSi elle est vraiment SERVIE : convertis-la en webp.`,
    ).toEqual([])
  })

  it('ne contient pas de PNG hors des deux icônes PWA', () => {
    const intrus = fichiers
      .filter((f) => f.chemin.toLowerCase().endsWith('.png'))
      .filter((f) => !PNG_AUTORISES.has(f.chemin))
      .map((f) => `${f.chemin} (${f.ko} ko)`)

    expect(
      intrus,
      intrus.length === 0
        ? ''
        : `PNG inattendu(s) dans public/ :\n  ${intrus.join('\n  ')}\n` +
            `\nL'app sert du webp. Un PNG ici est presque toujours une source` +
            ` de générateur : range-la dans assets-sources/.`,
    ).toEqual([])
  })

  it('garde public/ sous 20 Mo au total', () => {
    const totalMo = fichiers.reduce((s, f) => s + f.ko, 0) / 1024
    expect(
      Math.round(totalMo),
      `public/ pèse ${totalMo.toFixed(1)} Mo. Ce dossier part en entier dans` +
        ` chaque déploiement : il ne doit contenir que ce qui est servi.`,
    ).toBeLessThanOrEqual(20)
  })
})
