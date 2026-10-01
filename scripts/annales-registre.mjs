// Régénère lib/annales-corrigees/registre.ts : une ligne d'import par corrigé
// de contenu/annales/*.json. À relancer après l'ajout d'une annale (le test
// lib/annales-corrigees/contenu.test.ts refuse un corrigé écrit mais absent du
// registre).
//
//   node scripts/annales-registre.mjs

import { readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const RACINE = path.resolve(import.meta.dirname, '..')
const ids = readdirSync(path.join(RACINE, 'contenu', 'annales'))
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.slice(0, -5))
  .sort()

const nom = (id) => 'a_' + id.replace(/[^a-z0-9]+/g, '_')

const source = `// -----------------------------------------------------------------------------
// LE REGISTRE DES ANNALES CORRIGÉES — fichier GÉNÉRÉ par
// scripts/annales-registre.mjs, ne pas éditer à la main.
//
// ⚠️ SERVEUR SEULEMENT : ce module tire tout le corpus des corrigés. Un
// composant client ne l'importe jamais ; il reçoit des aperçus (apercu.ts).
// (Pas d'import 'server-only' : le paquet n'est pas installé, et le
// processus où Next inspecte les pages dynamiques plantait dessus — la règle
// tient, comme pour le registre de l'encyclopédie, par la relecture.)
// -----------------------------------------------------------------------------

import type { AnnaleCorrigee } from './types'

${ids.map((id) => `import ${nom(id)} from '@/contenu/annales/${id}.json'`).join('\n')}

export const ANNALES_CORRIGEES: readonly AnnaleCorrigee[] = [
${ids.map((id) => `  ${nom(id)},`).join('\n')}
] as unknown as readonly AnnaleCorrigee[]
`

writeFileSync(path.join(RACINE, 'lib', 'annales-corrigees', 'registre.ts'), source)
console.log(`registre : ${ids.length} annale(s)`)
