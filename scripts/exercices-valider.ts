// -----------------------------------------------------------------------------
// RELIRE UN FICHIER DU CAHIER D'EXERCICES, tout de suite.
//
//   node node_modules/jiti/lib/jiti-cli.mjs scripts/exercices-valider.ts contenu/exercices/6e/maths.2.json
//
// La même relecture que lib/exercices/contenu.test.ts, sur UN fichier, avec des
// messages lisibles : fautes de forme (validateur), puis chaque clé rejouée —
// la bonne réponse doit être jugée juste. Sort en code 1 s'il reste une faute.
// -----------------------------------------------------------------------------

import fs from 'node:fs'
import { compilerExercice } from '../lib/exercices/compiler'
import { juger } from '../lib/exercices/juger'
import type { Cle, FichierExercices, Reponse } from '../lib/exercices/types'
import { validerFichier } from '../lib/exercices/valider'

function bonneReponse(cle: Cle): Reponse {
  switch (cle.type) {
    case 'choix':
    case 'zone':
    case 'ordre':
      return { ids: cle.ids }
    case 'nombre':
      return { valeur: cle.valeur }
    case 'texte':
      return { texte: cle.acceptes[0] }
    case 'association':
      return { paires: cle.paires }
    case 'categories':
      return { items: cle.items }
    case 'trous':
      return { trous: cle.trous.map((t) => t[0]) }
  }
}

const chemin = process.argv[2]
if (!chemin) {
  console.error('Usage : exercices-valider.ts <fichier.json>')
  process.exit(1)
}

let fichier: FichierExercices
try {
  fichier = JSON.parse(fs.readFileSync(chemin, 'utf8')) as FichierExercices
} catch (e) {
  console.error(`JSON illisible : ${e instanceof Error ? e.message : String(e)}`)
  process.exit(1)
}

const fautes = validerFichier(fichier, chemin).map((f) => `${f.chemin} : ${f.message}`)
fichier.exercices?.forEach((ex, n) => {
  try {
    const { cles } = compilerExercice(ex)
    cles.forEach((c, i) => {
      if (!juger(c.cle, bonneReponse(c.cle)).juste) fautes.push(`exercice ${n + 1} · question ${i + 1} : la bonne réponse est jugée fausse`)
    })
  } catch (e) {
    fautes.push(`exercice ${n + 1} : ne se compile pas (${e instanceof Error ? e.message : String(e)})`)
  }
})

if (fautes.length) {
  for (const f of fautes) console.log(`✗ ${f}`)
  console.log(`\n${fautes.length} faute(s).`)
  process.exit(1)
}
const parEtoiles = [1, 2, 3].map((e) => fichier.exercices.filter((x) => x.etoiles === e).length)
console.log(`OK — ${fichier.exercices.length} exercices (★ ${parEtoiles[0]} · ★★ ${parEtoiles[1]} · ★★★ ${parEtoiles[2]}), aucune faute.`)
