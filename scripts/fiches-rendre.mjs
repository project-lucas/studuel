// LES FICHES DE RÉVISION — le rendu.
//
// Une fiche est UNE page A4 composée (texte, formules, figures) par ce script
// depuis sa description JSON, et illustrée par une image générée (facultative).
// C'est la forme validée par Lucas le 13/10/2026 (« texte composé +
// illustration générée », maquette B) contre la fiche entière peinte par
// l'IA, qui se trompait à chaque essai (docs/fiches-mvp.md).
//
//   node scripts/fiches-rendre.mjs                    toutes les fiches écrites
//   node scripts/fiches-rendre.mjs 3e maths           une matière
//   node scripts/fiches-rendre.mjs 3e maths thales    une fiche (le slug)
//   --html                                            le HTML seul, sans capture
//
// Sources : contenu/fiches/<niveau>/<matière>.json (l'index : chapitre, titre,
// thème, palier, slug) et contenu/fiches/<niveau>/<matière>/<slug>.json (le
// contenu : accroche, blocs par rangée, illustration). Le format des blocs est
// décrit dans docs/fiches-revision.md.
//
// Sorties (fiches-out/, hors git) : <niveau>/<matière>/<slug>.html, .png (2×,
// 1588 × 2246) et .pdf (A4, sans marge). Le script MESURE le débordement :
// une fiche dont un bloc passe sous le pied est signalée — on la raccourcit,
// jamais on ne la laisse se couper.

import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const RACINE = path.resolve(import.meta.dirname, '..')
const SOURCES = path.join(RACINE, 'contenu', 'fiches')
const SORTIE = path.join(RACINE, 'fiches-out')
const GABARIT = fs.readFileSync(path.join(RACINE, 'scripts', 'fiches', 'gabarit.css'), 'utf8')
const MARCEL = path.join(RACINE, 'assets-sources', 'fiches', 'gabarit-pdf', 'marcel.png')
const CHROME =
  process.env.FICHES_CHROME ??
  path.join(process.env.LOCALAPPDATA ?? '', 'ms-playwright', 'chromium_headless_shell-1234', 'chrome-headless-shell-win64', 'chrome-headless-shell.exe')

/** La hauteur sous laquelle rien ne doit passer : le pied de page commence là. */
const BAS_UTILE = 1123 - 48

export const MATIERES = {
  maths: 'Maths', francais: 'Français', 'histoire-geo': 'Histoire-géo', emc: 'EMC', 'physique-chimie': 'Physique-chimie',
  svt: 'SVT', technologie: 'Technologie', philosophie: 'Philosophie', hggsp: 'HGGSP', hlp: 'HLP', ses: 'SES', nsi: 'NSI',
  'maths-complementaires': 'Maths compl.', 'maths-expertes': 'Maths expertes',
  // Le reste du catalogue (chantier « toutes les fiches », 13/10/2026) : le nom court qui tient dans le coin de la page.
  anglais: 'Anglais', espagnol: 'Espagnol', allemand: 'Allemand', latin: 'Latin', grec: 'Grec', 'llcer-anglais': 'LLCER anglais',
  snt: 'SNT', 'enseignement-scientifique': 'Ens. scientifique', 'arts-plastiques': 'Arts plastiques', musique: 'Musique', sport: 'EPS',
  'histoire-geo-techno': 'Histoire-géo', 'philosophie-techno': 'Philosophie', 'maths-techno': 'Maths',
  si: 'Sciences de l’ingénieur', i2d: 'I2D', 'ingenierie-dd': 'I2D', 'innovation-technologique': 'Innovation techno.',
  'physique-chimie-maths': 'Physique-chimie', 'physique-chimie-sante': 'Physique-chimie', spcl: 'SPCL',
  'biochimie-biologie': 'Biochimie-biologie', 'biochimie-biologie-biotechnologie': 'Biochimie-biologie', biotechnologies: 'Biotechnologies',
  'biologie-physiopathologie': 'Biologie-physiopathologie', 'chimie-biologie-physiopathologie': 'Chimie-biologie', 'sciences-sanitaires-sociales': 'ST2S',
  'droit-economie': 'Droit-économie', management: 'Management', 'management-sgn': 'Management', 'sciences-gestion-numerique': 'Sciences de gestion',
}
export const EPREUVES = { brevet: '★ Tombe au brevet', bac: '★ Tombe au bac', 'bac-1re': '★ Bac de 1re', oral: '★ Tombe à l’oral', socle: '★ Socle de 2de' }

// ---------------------------------------------------------------- le balisage
// Un mini-langage dans les chaînes du JSON, pour ne pas écrire de HTML :
//   **gras**   ==surligné==   __violet__   ~~à la main~~   {num/dén} fraction
//   [[entouré]] (résultat cerclé)   \n saut de ligne   le HTML passe tel quel.
export function md(s) {
  if (s === undefined || s === null) return ''
  return String(s)
    // Les polices de la fiche n'ont ni la flèche combinante des vecteurs (u⃗) ni ⟺ : la flèche devient une
    // coiffe CSS (.vec), l'équivalence un ⇔ que les polices de repli connaissent.
    .replace(/([A-Za-z0-9]{1,3}['’]?)⃗/g, '<span class="vec">$1</span>')
    .replace(/⟺/g, '⇔')
    .replace(/\{([^{}/]+)\/([^{}]+)\}/g, '<span class="frac"><span>$1</span><span>$2</span></span>')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    // Un « = » seul reste permis dans le surligné (==aire = 4==), seul le double ferme la marque.
    .replace(/==((?:[^=]|=(?!=))+)==/g, '<mark>$1</mark>')
    .replace(/__([^_]+)__/g, '<b class="v">$1</b>')
    .replace(/~~([^~]+)~~/g, '<span class="main">$1</span>')
    .replace(/\[\[([^\]]+)\]\]/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
}

const CROIX = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"></path></svg>'
const COCHE = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>'
const FLECHE = '<svg class="fleche" viewBox="0 0 44 30" fill="none" stroke="#2b2350" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3,15 H38 M27,5 L39,15 L27,25"></path></svg>'
const FLECHE_NOTE = '<svg viewBox="0 0 62 46" fill="none" stroke="#7a3fe0" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M58,40 C40,42 16,34 10,10"></path><path d="M2,20 L10,8 L21,17"></path></svg>'

const ruban = (b) => (b.numero === undefined || b.numero === null ? '' : `<span class="ruban"><b>${b.numero}</b>${md(b.titre)}</span>`)
const carte = (b, classes, interieur, teinte = b.teinte) =>
  `<article class="carte ${classes}"${teinte ? ` data-teinte="${teinte}"` : ''}>${ruban(b)}${interieur}</article>`

const BLOCS = {
  figures: (b) => {
    const n = b.figures.length
    const figs = b.figures
      .map((f) => `<figure>${f.svg.replace(/⃗/g, '')}<figcaption>${md(f.legende)}${f.sous ? `<small>${md(f.sous)}</small>` : ''}</figcaption></figure>`)
      .join('')
    const legende = b.legende ? `<div class="legende">${b.legende.jeton ? `<span class="jeton">${md(b.legende.jeton)}</span>` : ''}<span>${md(b.legende.texte)}</span></div>` : ''
    return carte(b, '', `<div class="figures" style="grid-template-columns: repeat(${b.colonnes ?? n}, 1fr)">${figs}</div>${legende}`)
  },
  formule: (b) => {
    const lignes = (b.lignes ?? [])
      .map((l) => `<div class="egalite${b.taille === 'mini' ? ' mini' : b.petite ? ' petite' : ''}">${md(l).replace(/ = /g, '<span class="egal">=</span>').replace(/ ⟹ /g, '<span class="egal">⟹</span>')}</div>`)
      .join('')
    const regle = b.regle ? `<p class="regle">${md(b.regle)}</p>` : ''
    const note = b.note ? `<div class="note">${FLECHE_NOTE}<span class="main">${md(b.note)}</span></div>` : ''
    return carte(b, 'formule', lignes + regle + note, b.teinte ?? 'jaune')
  },
  etapes: (b) => {
    const cols = b.etapes.map(() => '1fr').join(' auto ')
    const etapes = b.etapes
      .map((e, i) => `<div class="etape"><span class="num">${i + 1}</span><div><strong>${md(e.titre)}</strong><p>${md(e.texte)}</p></div></div>`)
      .join(FLECHE)
    return carte(b, '', `<div class="etapes" style="grid-template-columns: ${cols}">${etapes}</div>`)
  },
  postit: (b) =>
    `<article class="postit"><h3>${md(b.titre ?? 'Exemple résolu')}</h3>` +
    (b.donnees ? `<p class="donnees">${md(b.donnees)}</p>` : '') +
    (b.calcul ? `<div class="calcul">${md(b.calcul)}${b.aparte ? `<small>${md(b.aparte)}</small>` : ''}</div>` : '') +
    (b.resultat ? `<p class="resultat">${md(b.resultat)}</p>` : '') +
    '</article>',
  verdicts: (b) =>
    carte(
      b,
      '',
      `<div class="verdicts"><div class="verdict oui"><span class="pastille">${COCHE}</span><div><small>${md(b.oui.titre)}</small><p>${md(b.oui.texte)}</p></div></div>` +
        `<div class="verdict non"><span class="pastille">${CROIX}</span><div><small>${md(b.non.titre)}</small><p>${md(b.non.texte)}</p></div></div></div>` +
        (b.essai ? `<div class="essai"><span class="main">${md(b.essai.titre ?? 'Essai')}</span><p>${md(b.essai.texte)}</p></div>` : ''),
    ),
  copie: (b) =>
    carte(
      { numero: b.numero ?? '★', titre: b.titre ?? 'Sur ta copie' },
      'copie',
      `<div class="lignes">${b.lignes.map((l, i) => `<div class="ligne"><span class="rang-n">${i + 1}</span><p>${md(l.texte)}</p>${l.quoi ? `<span class="quoi">${md(l.quoi)}</span>` : ''}</div>`).join('')}</div>` +
        (b.pied ? `<p class="pied-carte">${md(b.pied)}</p>` : ''),
      b.teinte ?? 'jaune',
    ),
  pieges: (b) =>
    carte(
      { numero: b.numero ?? '!', titre: b.titre ?? 'Les pièges' },
      'pieges',
      `<ul>${b.items.map((t) => `<li><span class="croix">${CROIX}</span><span>${md(t)}</span></li>`).join('')}</ul>`,
      'corail',
    ),
  test: (b) =>
    carte(
      { numero: b.numero ?? '?', titre: b.titre ?? 'Je me teste' },
      'test',
      `<ol style="grid-template-columns: repeat(${b.colonnes ?? b.questions.length}, 1fr)">${b.questions.map((q, i) => `<li><span>${i + 1}</span><p>${md(q)}</p></li>`).join('')}</ol>` +
        `<span class="reponses">Réponses&nbsp;: ${md(b.reponses)}</span>`,
      'lavande',
    ),
  texte: (b) => carte(b, 'texte', b.paragraphes.map((p) => `<p>${md(p)}</p>`).join('')),
  liste: (b) =>
    carte(b, `liste${b.deux ? ' deux' : ''}`, `<ul>${b.items.map((it) => `<li><span>${it.titre ? `<strong>${md(it.titre)}</strong> ` : ''}${md(it.texte)}</span></li>`).join('')}</ul>`),
  definitions: (b) =>
    carte(b, 'definitions', `<dl>${b.items.map((it) => `<div><dt>${md(it.terme)}</dt><dd>${md(it.definition)}</dd></div>`).join('')}</dl>`),
  tableau: (b) =>
    carte(
      b,
      'tableau',
      `<table><thead><tr>${b.entetes.map((e) => `<th>${md(e)}</th>`).join('')}</tr></thead><tbody>${b.lignes.map((l) => `<tr>${l.map((c) => `<td>${md(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`,
    ),
  frise: (b) =>
    carte(b, `frise${b.horizontale ? ' horizontale' : ''}`, `<ol>${b.etapes.map((e) => `<li><b class="date">${md(e.date)}</b>${md(e.texte)}</li>`).join('')}</ol>`),
  cartes: (b) =>
    carte(b, 'cartes', `<div class="cartes" style="grid-template-columns: repeat(${b.colonnes ?? 2}, 1fr)">${b.cartes.map((c) => `<div class="mini"><strong>${md(c.titre)}</strong>${md(c.texte)}</div>`).join('')}</div>`),
  citation: (b) => carte(b, 'citation', `<blockquote class="citation">« ${md(b.texte)} »${b.auteur ? `<footer>— ${md(b.auteur)}</footer>` : ''}</blockquote>`, b.teinte ?? 'lavande'),
}

function rendreBloc(b) {
  const f = BLOCS[b.type]
  if (!f) throw new Error(`bloc inconnu : ${b.type}`)
  return f(b)
}

/** Le HTML d'une fiche. */
export function html({ niveau, matiere, index, fiche }) {
  const illu = fiche.illustration?.fichier ? path.join(RACINE, fiche.illustration.fichier) : null
  const avecIllu = illu && fs.existsSync(illu)
  const rangs = (fiche.rangs ?? [])
    .map((r) => {
      const cols = r.colonnes ?? r.blocs.map(() => '1fr').join(' ')
      return `<section class="rang" style="grid-template-columns: ${cols}">${r.blocs.map(rendreBloc).join('')}</section>`
    })
    .join('')
  // Le titre AFFICHÉ peut être plus court que le titre du chapitre (« Pythagore
  // et sa réciproque » pour « Le théorème de Pythagore et sa réciproque ») :
  // sur une ligne, il laisse sa place au contenu.
  const titreAffiche = fiche.titre ?? index.titre
  const titre = fiche.titreSurligne && titreAffiche.includes(fiche.titreSurligne)
    ? titreAffiche.replace(fiche.titreSurligne, `<span class="surligne">${fiche.titreSurligne}</span>`)
    : titreAffiche
  const epreuve = fiche.epreuve && EPREUVES[fiche.epreuve] ? `<span class="brevet">${EPREUVES[fiche.epreuve]}</span>` : ''
  const marcel = !avecIllu && fiche.marcel ? `<div class="bulle">${md(fiche.marcel)}</div><img class="marcel" src="${fichierUrl(MARCEL)}" alt="">` : ''
  const illustration = avecIllu ? `<img class="illu" src="${fichierUrl(illu)}" alt="">` : ''
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Fiche de révision — ${index.titre} (${niveau})</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Caveat:wght@600;700&family=Nunito:wght@600;700;800;900&display=swap" rel="stylesheet">
<style>
${GABARIT}
</style>
</head>
<body>
<main class="fiche"${avecIllu ? ' data-illu' : marcel ? ' data-marcel' : ''}>
  <div class="scotch"></div>
  <header>
    <div class="etiquettes">
      <span class="pilule">${(MATIERES[matiere] ?? matiere).toUpperCase()} · ${niveau}</span>
      ${epreuve}
      <span class="mention">Fiche de révision</span>
    </div>
    <h1>${titre}</h1>
    ${fiche.accroche ? `<p class="accroche">${md(fiche.accroche)}</p>` : ''}
  </header>
  <div class="corps">
${rangs}
  </div>
  <footer class="pied">
    <span class="marque">Studuel</span>
    ${fiche.bonus ? `<span class="bonus">${md(fiche.bonus)}</span>` : ''}
    <span class="rayon">${md(index.theme ?? '')}</span>
  </footer>
  ${marcel}
  ${illustration}
</main>
<script>
  // Mesure du débordement : le bas du bloc le plus bas, rapporté au haut de la fiche.
  document.fonts.ready.then(() => {
    const fiche = document.querySelector('.fiche').getBoundingClientRect()
    let bas = 0
    for (const el of document.querySelectorAll('.corps .rang > *')) bas = Math.max(bas, el.getBoundingClientRect().bottom - fiche.top)
    document.documentElement.dataset.bas = String(Math.round(bas))
    document.documentElement.dataset.deborde = String(Math.max(0, Math.round(bas - ${BAS_UTILE})))
  })
</script>
</body>
</html>
`
}

const fichierUrl = (p) => 'file:///' + p.replace(/\\/g, '/')

function chrome(args) {
  const r = spawnSync(CHROME, ['--headless', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=6000', ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  if (r.error) throw r.error
  return r
}

/** Rend une fiche : HTML, mesure, PNG et PDF. Rend le débordement (0 = rien). */
export function rendre({ niveau, matiere, index, fiche, htmlSeulement = false }) {
  const dossier = path.join(SORTIE, niveau, matiere)
  fs.mkdirSync(dossier, { recursive: true })
  const base = path.join(dossier, index.slug)
  fs.writeFileSync(base + '.html', html({ niveau, matiere, index, fiche }))
  if (htmlSeulement) return { deborde: null }
  const url = fichierUrl(base + '.html')
  const dom = chrome(['--dump-dom', url]).stdout
  const deborde = Number(dom.match(/data-deborde="(\d+)"/)?.[1] ?? -1)
  const bas = Number(dom.match(/data-bas="(\d+)"/)?.[1] ?? -1)
  chrome(['--force-device-scale-factor=2', '--window-size=794,1123', `--screenshot=${base}.png`, url])
  chrome(['--no-pdf-header-footer', `--print-to-pdf=${base}.pdf`, url])
  return { deborde, bas }
}

/** Les fiches à rendre : l'index de chaque matière, et le contenu de celles qui en ont un. */
export function listerFiches({ niveau, matiere, slug } = {}) {
  const resultat = []
  for (const niv of fs.readdirSync(SOURCES)) {
    if (niveau && niv !== niveau) continue
    const dossier = path.join(SOURCES, niv)
    if (!fs.statSync(dossier).isDirectory()) continue
    for (const f of fs.readdirSync(dossier)) {
      if (!f.endsWith('.json')) continue
      const mat = f.replace(/\.json$/, '')
      if (matiere && mat !== matiere) continue
      const index = JSON.parse(fs.readFileSync(path.join(dossier, f), 'utf8'))
      for (const entree of index.fiches) {
        if (slug && entree.slug !== slug) continue
        const contenu = path.join(dossier, mat, entree.slug + '.json')
        if (!fs.existsSync(contenu)) continue
        resultat.push({ niveau: niv, matiere: mat, index: entree, fiche: JSON.parse(fs.readFileSync(contenu, 'utf8')) })
      }
    }
  }
  return resultat
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('--'))
  const htmlSeulement = process.argv.includes('--html')
  const [niveau, matiere, slug] = args
  const fiches = listerFiches({ niveau, matiere, slug })
  if (fiches.length === 0) {
    console.log('Aucune fiche écrite pour', [niveau, matiere, slug].filter(Boolean).join(' / ') || 'tout')
    process.exit(1)
  }
  let debordements = 0
  for (const f of fiches) {
    const { deborde, bas } = rendre({ ...f, htmlSeulement })
    const etat = deborde === null ? 'html' : deborde > 0 ? `DÉBORDE de ${deborde} px` : `ok (bas à ${bas} px)`
    if (deborde > 0) debordements += 1
    console.log(`${f.niveau}/${f.matiere}/${f.index.slug}  ${etat}`)
  }
  console.log(`${fiches.length} fiche(s), ${debordements} débordement(s)`)
  process.exit(debordements > 0 ? 2 : 0)
}
