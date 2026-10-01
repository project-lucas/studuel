// Recopie les contrôles blancs et le cahier d'exercices d'une fiche sur ses
// JUMELLES : les fiches qui portent le même titre, dans la même matière, à un
// autre niveau.
//
//   node scripts/copier-fiches-jumelles.mjs <index.json>
//
// POURQUOI. Plusieurs matières servent LA MÊME fiche à plusieurs niveaux : les
// langues du lycée (les 24 fiches de langue de l'anglais en 2de, 1re et Tle),
// l'allemand de la 3e à la Tle, les options (latin, grec, arts, musique). Un
// sujet s'accroche à un IDENTIFIANT de chapitre ; sans copie, seule la
// première des jumelles aurait ses exercices, et l'élève de Terminale
// trouverait une tuile vide sur une fiche que son camarade de 2de a remplie.
//
// L'index (JSON) liste les chapitres : [{ niveau, slug, id, titre }, …] — celui
// que produit l'extraction de la base. Pour chaque fichier de
// contenu/controles/<niveau>/ et contenu/exercices/<niveau>/, chaque sujet
// dont la fiche a des jumelles est recopié dans
// contenu/<controles|exercices>/<niveau-jumelle>/<matiere>.jumelles.json, avec
// l'identifiant de la jumelle. Une jumelle qui a déjà ses propres sujets
// (écrits pour elle) n'est pas écrasée. Idempotent : les fichiers .jumelles
// sont réécrits à chaque passage.

import { readFileSync, readdirSync, writeFileSync, existsSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'

const index = JSON.parse(readFileSync(process.argv[2], 'utf8'))
const parCle = new Map()
for (const c of index) {
  const cle = `${c.slug}|${c.titre}`
  if (!parCle.has(cle)) parCle.set(cle, [])
  parCle.get(cle).push(c)
}
const parId = new Map(index.map((c) => [c.id, c]))

for (const [dossier, champ] of [['controles', 'sujets'], ['exercices', 'exercices']]) {
  const racine = join(process.cwd(), 'contenu', dossier)
  if (!existsSync(racine)) continue
  const niveaux = readdirSync(racine).filter((n) => !['demo'].includes(n))
  // Les fiches qui ont déjà leurs propres sujets, et les fichiers de jumelles d'avant.
  const servies = new Set()
  const sources = []
  for (const niveau of niveaux) {
    for (const f of readdirSync(join(racine, niveau)).filter((x) => x.endsWith('.json'))) {
      const chemin = join(racine, niveau, f)
      if (f.endsWith('.jumelles.json')) {
        unlinkSync(chemin)
        continue
      }
      const fichier = JSON.parse(readFileSync(chemin, 'utf8'))
      for (const s of fichier[champ]) servies.add(s.chapitre)
      sources.push(fichier)
    }
  }
  const sorties = new Map() // `${niveau}/${matiere}` → { niveau, matiere, [champ]: [] }
  let n = 0
  // Une jumelle ne reçoit les sujets que d'UNE source (la première rencontrée) :
  // deux sources la rempliraient deux fois.
  const source = new Map() // id de la jumelle → id de la fiche dont elle copie
  for (const fichier of sources) {
    for (const s of fichier[champ]) {
      const c = parId.get(s.chapitre)
      if (!c) continue
      for (const jumelle of parCle.get(`${c.slug}|${c.titre}`) ?? []) {
        if (jumelle.id === c.id || servies.has(jumelle.id)) continue
        if (!source.has(jumelle.id)) source.set(jumelle.id, c.id)
        if (source.get(jumelle.id) !== c.id) continue
        const cle = `${jumelle.niveau}/${fichier.matiere}`
        if (!sorties.has(cle)) sorties.set(cle, { niveau: jumelle.niveau, matiere: fichier.matiere, [champ]: [] })
        sorties.get(cle)[champ].push({ ...s, chapitre: jumelle.id })
        n++
      }
    }
  }
  for (const [cle, contenu] of sorties) {
    const [niveau] = cle.split('/')
    writeFileSync(
      join(racine, niveau, `${contenu.matiere}.jumelles.json`),
      JSON.stringify(contenu, null, 2) + '\n',
    )
  }
  console.error(`${dossier} : ${n} sujets recopiés sur des fiches jumelles (${sorties.size} fichiers)`)
}
