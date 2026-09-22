// Régénère le registre des lots de l'encyclopédie
// (lib/encyclopedie/contenu/index.ts) à partir des fichiers présents.
//
// Le registre est du code ORDINAIRE, lisible et versionné — ce script ne fait
// que lui épargner la copie à la main de quarante imports, et surtout le lot
// oublié : un fichier écrit mais jamais branché n'aurait fait manquer « que »
// douze fiches, en silence. Le test `contenu.test.ts` refuse d'ailleurs cet
// état-là (« branche tous les lots écrits dans le registre »).
//
//   node scripts/encyclopedie-registre.mjs
//
// Tout ce qui est au-dessus du marqueur est conservé tel quel.

import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const DOSSIER = 'lib/encyclopedie/contenu'
const MARQUEUR = '// <<< LOTS — ce bloc est régénéré par scripts/encyclopedie-registre.mjs'

const fichiers = readdirSync(DOSSIER)
  .filter((nom) => nom.endsWith('.ts') && nom !== 'index.ts')
  .sort()

const lots = []
for (const fichier of fichiers) {
  const source = readFileSync(join(DOSSIER, fichier), 'utf8')
  const trouve = source.match(/export const ([A-Z0-9_]+)\s*:\s*(Personnage|Evenement)\[\]/)
  if (!trouve) {
    console.warn(`⚠ ${fichier} : aucun « export const NOM: Personnage[] » trouvé, ignoré.`)
    continue
  }
  lots.push({
    fichier: fichier.replace(/\.ts$/, ''),
    constante: trouve[1],
    genre: trouve[2],
    ids: [...source.matchAll(/^\s{4}id: '([a-z0-9-]+)',$/gm)].map((m) => m[1]),
    periode: source.match(/periode: '([a-z-]+)'/)?.[1] ?? '?',
  })
}

const personnages = lots.filter((lot) => lot.genre === 'Personnage')
const evenements = lots.filter((lot) => lot.genre === 'Evenement')

const bloc = [
  MARQUEUR,
  ...lots.map((lot) => `import { ${lot.constante} } from './${lot.fichier}'`),
  '',
  '/** Les portraits, lot par lot, dans l’ordre des fichiers. */',
  `const LOTS_PERSONNAGES: Personnage[][] = [`,
  ...personnages.map((lot) => `  ${lot.constante},`),
  `]`,
  '',
  '/** Les événements, lot par lot, dans l’ordre des fichiers. */',
  `const LOTS_EVENEMENTS: Evenement[][] = [`,
  ...evenements.map((lot) => `  ${lot.constante},`),
  `]`,
].join('\n')

const chemin = join(DOSSIER, 'index.ts')
const actuel = readFileSync(chemin, 'utf8')
const coupe = actuel.indexOf(MARQUEUR)
if (coupe < 0) {
  console.error(`Marqueur absent de ${chemin} — rien n'a été écrit.`)
  process.exit(1)
}
const fin = actuel.indexOf('export const PERSONNAGES')
writeFileSync(chemin, `${actuel.slice(0, coupe)}${bloc}\n\n${actuel.slice(fin)}`)

console.log(
  `Registre régénéré : ${personnages.length} lots de personnages, ${evenements.length} lots d'événements.`,
)

// -----------------------------------------------------------------------------
// LE SOMMAIRE (docs/encyclopedie-sommaire.md), régénéré lui aussi.
//
// Il sert à UNE chose : donner à qui écrit une fiche la liste des identifiants
// vers lesquels il a le droit de renvoyer (`lies`). Une liste tenue à la main
// aurait menti au bout de trois lots — et un renvoi vers un identifiant qui
// n'existe pas fait échouer `npm test`.
// -----------------------------------------------------------------------------

const total = lots.reduce((n, lot) => n + lot.ids.length, 0)
const sections = (genre, titre) =>
  [
    `## ${titre}`,
    '',
    ...lots
      .filter((lot) => lot.genre === genre)
      .flatMap((lot) => [
        `### \`${lot.fichier}.ts\` — ${lot.ids.length} fiches (période \`${lot.periode}\`)`,
        lot.ids.map((id) => `\`${id}\``).join(' · '),
        '',
      ]),
  ].join('\n')

writeFileSync(
  'docs/encyclopedie-sommaire.md',
  [
    '# L’Encyclopédie — le sommaire',
    '',
    '> **Fichier régénéré** par `node scripts/encyclopedie-registre.mjs`.',
    '> Ne pas le modifier à la main : il est l’inventaire de ce qui existe',
    '> vraiment dans `lib/encyclopedie/contenu/`.',
    '',
    `**${total} fiches** — ${personnages.reduce((n, l) => n + l.ids.length, 0)} personnages,`,
    `${evenements.reduce((n, l) => n + l.ids.length, 0)} événements.`,
    '',
    'Il sert à deux choses : donner les identifiants vers lesquels une fiche a le',
    'droit de renvoyer (`lies` — un renvoi vers le vide fait échouer `npm test`),',
    'et dire d’un coup d’œil ce qui est écrit. Le guide de rédaction est dans',
    '[`encyclopedie.md`](encyclopedie.md).',
    '',
    '---',
    '',
    sections('Personnage', 'Personnages'),
    '---',
    '',
    sections('Evenement', 'Événements'),
  ].join('\n'),
)
console.log(`Sommaire régénéré : ${total} fiches.`)
