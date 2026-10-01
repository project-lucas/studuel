// -----------------------------------------------------------------------------
// LES SUJETS D'ANNALES, HABILLÉS AUX COULEURS DE STUDUEL.
//
//   node scripts/annales-sujets.mjs            → tous les sujets
//   node scripts/annales-sujets.mjs <id> …     → seulement ceux-là
//
// Source : assets-sources/annales/sujets/<id>.pdf — le sujet OFFICIEL du
// ministère, tel quel. Sortie : public/annales/<id>.pdf.
//
// CE QUE LE SCRIPT CHANGE, ET CE QU'IL NE TOUCHE PAS. Le contenu du sujet est
// reproduit SANS MODIFICATION : chaque page officielle est posée, réduite de
// quelques pour cent, dans un cadre Studuel (bandeau en tête, pagination en
// pied). Devant, une page de COUVERTURE : la matière, la session, la durée, le
// coefficient, ce que l'épreuve demande et où trouver le corrigé dans l'app.
// Les métadonnées viennent du corrigé (contenu/annales/<id>.json) ; tant qu'il
// n'est pas écrit, l'identifiant suffit à une couverture sobre.
//
// Polices : Baloo 2 (titres) et Nunito (texte), les deux polices de l'app, en
// TTF statiques dans assets-sources/annales/polices/ (Google Fonts, OFL),
// réduites au latin par pyftsubset (*.latin.ttf) et embarquées ENTIÈRES : le
// sous-ensemble de fontkit perdait la plupart des glyphes de Baloo 2.
// -----------------------------------------------------------------------------

import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import path from 'node:path'
import { PDFDocument, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import sharp from 'sharp'

const RACINE = path.resolve(import.meta.dirname, '..')
const SOURCES = path.join(RACINE, 'assets-sources', 'annales', 'sujets')
const POLICES = path.join(RACINE, 'assets-sources', 'annales', 'polices')
const CORRIGES = path.join(RACINE, 'contenu', 'annales')
const SORTIE = path.join(RACINE, 'public', 'annales')

// Copie de lib/annales-corrigees/matieres.ts (un .mjs ne lit pas le TS).
const MATIERES = {
  philosophie: { long: 'Philosophie', vignette: 'philosophie' },
  hlp: { long: 'Humanités, littérature et philosophie', vignette: 'philosophie' },
  hggsp: { long: 'Histoire-géographie, géopolitique et sciences politiques', vignette: 'hggsp' },
  ses: { long: 'Sciences économiques et sociales', vignette: 'ses' },
  maths: { long: 'Mathématiques', vignette: 'maths' },
  'physique-chimie': { long: 'Physique-chimie', vignette: 'physique-chimie' },
  svt: { long: 'Sciences de la vie et de la Terre', vignette: 'svt' },
  nsi: { long: 'Numérique et sciences informatiques', vignette: 'nsi' },
  francais: { long: 'Français', vignette: 'francais' },
  'histoire-geo': { long: 'Histoire-géographie et enseignement moral et civique', vignette: 'histoire-geo' },
}

// Les couleurs de la DA (app/globals.css, :root).
const hex = (h) => rgb(parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255)
const C = {
  creme: hex('#ede7d6'),
  cremeClair: hex('#f7f3e9'),
  encre: hex('#24304f'),
  gris: hex('#8f8a78'),
  bord: hex('#e2dac6'),
  violet: hex('#7a3fe0'),
  violetProfond: hex('#4b1fa3'),
  lavande: hex('#eee7fc'),
  or: hex('#f5b722'),
  orPale: hex('#fdecc7'),
  blanc: rgb(1, 1, 1),
}

const A4 = [595.28, 841.89]

/** Chemin SVG d'un rectangle arrondi, origine en haut à gauche (repère SVG de pdf-lib). */
function rectArrondi(w, h, r) {
  return `M ${r} 0 H ${w - r} Q ${w} 0 ${w} ${r} V ${h - r} Q ${w} ${h} ${w - r} ${h} H ${r} Q 0 ${h} 0 ${h - r} V ${r} Q 0 0 ${r} 0 Z`
}

/** Pose un rectangle arrondi dont (x, y) est le coin BAS gauche, en points PDF. */
function carte(page, x, y, w, h, r, opts) {
  page.drawSvgPath(rectArrondi(w, h, r), { x, y: y + h, ...opts })
}

function couper(texte, police, taille, largeur) {
  const lignes = []
  for (const para of String(texte).split('\n')) {
    let ligne = ''
    for (const mot of para.split(/\s+/).filter(Boolean)) {
      const essai = ligne ? `${ligne} ${mot}` : mot
      if (police.widthOfTextAtSize(essai, taille) <= largeur) ligne = essai
      else {
        if (ligne) lignes.push(ligne)
        ligne = mot
      }
    }
    lignes.push(ligne)
  }
  return lignes
}

// LE LaTeX DES RÉSUMÉS, EN TEXTE LISIBLE. Dans l'app, `$f(x) = x^2$` passe par
// KaTeX ; sur la couverture, il s'imprimait tel quel, dollars et antislashs
// compris. Les polices réduites au latin n'ont que ², ³, ¹, × et · : le reste
// s'écrit en toutes lettres ou entre parenthèses (e^(-x), u(n+1)).
const EXPOSANTS = { 1: '¹', 2: '²', 3: '³' }
// Un terme de fraction n'a besoin de parenthèses que s'il est composé.
const groupe = (t) => (/[\s+\-]/.test(t.trim()) ? `(${t.trim()})` : t.trim())
function sansLatex(s) {
  if (!s || !s.includes('$')) return s
  return s.replace(/\$([^$]+)\$/g, (_, m) => {
    let t = m
      .replace(/\\left|\\right|\\displaystyle/g, '')
      .replace(/\\mathrm\{([^}]*)\}|\\text\{([^}]*)\}|\\mathbb\{([^}]*)\}/g, (_, a, b, c) => a ?? b ?? c)
      .replace(/\\widehat\{([^}]*)\}/g, 'l’angle $1')
      .replace(/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, (_, a, b) => `${groupe(a)}/${groupe(b)}`)
      .replace(/\\sqrt\{([^{}]*)\}/g, 'racine de ($1)')
      .replace(/\\infty/g, 'infini')
      .replace(/\\times/g, '×')
      .replace(/\\cdot/g, '·')
      .replace(/\\leq?/g, '<=')
      .replace(/\\geq?/g, '>=')
      .replace(/\\neq/g, '≠')
      .replace(/\\pi/g, 'pi')
      .replace(/\\ln/g, 'ln')
      .replace(/\\[,;:! ]/g, ' ')
      .replace(/\{,\}/g, ',')
      .replace(/_\{([^{}]*)\}|_(\w)/g, (_, a, b) => `(${a ?? b})`)
    // Les exposants : les plus intérieurs d'abord (e^{x^2}).
    for (let i = 0; i < 3; i++)
      t = t.replace(/\^\{([^{}]*)\}|\^(\w)/g, (_, a, b) => {
        const e = a ?? b
        return EXPOSANTS[e] ?? `^(${e})`
      })
    return t
      .replace(/\\([a-zA-Z]+)/g, '$1')
      .replace(/[{}]/g, '')
      .replace(/;(?=\S)/g, '; ')
      .replace(/\s+/g, ' ')
      .trim()
  })
}

// Le titre de couverture : l'épreuve anticipée n'est plus seulement celle de
// français — les maths ont la leur depuis la session 2026.
function titreCouverture(examen, matiere, annee) {
  if (examen === 'brevet') return `Brevet ${annee}`
  if (examen === 'bac-anticipe')
    return matiere === 'francais' ? `Bac de français ${annee}` : `Épreuve anticipée ${annee}`
  return `Bac ${annee}`
}

function metaDe(id) {
  const f = path.join(CORRIGES, `${id}.json`)
  if (existsSync(f)) {
    const a = JSON.parse(readFileSync(f, 'utf8'))
    return {
      matiere: a.matiere,
      titre: titreCouverture(a.examen, a.matiere, a.annee),
      brevet: a.examen === 'brevet',
      centre: a.jour ? `${a.centre} · jour ${a.jour}` : a.centre,
      dureeMin: a.dureeMin,
      coefficient: a.coefficient,
      code: a.code,
      consigne: sansLatex(a.consigne),
      parties: a.parties.map((p) => ({ titre: p.titre, enonce: sansLatex(p.enonce) })),
    }
  }
  // Repli : l'identifiant dit la matière et l'année.
  const matiere = Object.keys(MATIERES).find((m) => id.startsWith(m + '-'))
  const annee = id.slice(matiere.length + 1, matiere.length + 5)
  return {
    matiere,
    titre: matiere === 'francais' ? `Bac de français ${annee}` : `Bac ${annee}`,
    centre: '',
    dureeMin: null,
    coefficient: null,
    code: '',
    consigne: '',
    parties: [],
  }
}

function duree(min) {
  if (!min) return null
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h} h ${String(m).padStart(2, '0')}` : `${h} h`
}

async function polices(doc) {
  doc.registerFontkit(fontkit)
  const lire = (f) => readFileSync(path.join(POLICES, f))
  return {
    titre: await doc.embedFont(lire('Baloo2-ExtraBold.latin.ttf')),
    texte: await doc.embedFont(lire('Nunito-Regular.latin.ttf')),
    gras: await doc.embedFont(lire('Nunito-Bold.latin.ttf')),
    noir: await doc.embedFont(lire('Nunito-ExtraBold.latin.ttf')),
  }
}

async function couverture(doc, P, meta, nbPages) {
  const [W, H] = A4
  const page = doc.addPage(A4)
  const m = MATIERES[meta.matiere]

  // Fond crème, bandeau violet en tête avec ses rayons.
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.creme })
  const hb = 300
  page.drawRectangle({ x: 0, y: H - hb, width: W, height: hb, color: C.violet })
  for (let i = 0; i < 6; i++) {
    const x0 = -120 + i * 150
    page.drawSvgPath(`M ${x0} 0 L ${x0 + 60} 0 L ${x0 + 200} ${hb} L ${x0 + 140} ${hb} Z`, {
      x: 0,
      y: H,
      color: C.blanc,
      opacity: 0.05,
    })
  }
  page.drawRectangle({ x: 0, y: H - hb - 6, width: W, height: 6, color: C.violetProfond })

  // Marque.
  // En JPEG, aplatis : un PNG de 192 px pèserait à lui seul le poids d'une page.
  const icone = await doc.embedJpg(await sharp(path.join(RACINE, 'public', 'icons', 'icon-192.png')).resize(96).jpeg({ quality: 82 }).toBuffer())
  carte(page, 40, H - 92, 50, 50, 12, { color: C.violetProfond })
  page.drawImage(icone, { x: 43, y: H - 89, width: 44, height: 44 })
  page.drawText('Studuel', { x: 102, y: H - 70, size: 26, font: P.titre, color: C.blanc })
  page.drawText(meta.brevet ? 'ANNALES DU BREVET · SUJET OFFICIEL' : 'ANNALES DU BAC · SUJET OFFICIEL', { x: 103, y: H - 86, size: 8.5, font: P.noir, color: C.orPale })

  // Titre.
  page.drawText(meta.titre, { x: 40, y: H - 175, size: 46, font: P.titre, color: C.blanc })
  const lignesMatiere = couper(m.long, P.titre, 24, 330)
  lignesMatiere.forEach((l, i) =>
    page.drawText(l, { x: 42, y: H - 212 - i * 27, size: 24, font: P.titre, color: C.or }),
  )

  // Médaillon de la matière : la vignette du dossier sur plaque blanche.
  const vignette = path.join(RACINE, 'public', 'images', 'matieres', 'vignettes', `${m.vignette}.webp`)
  if (existsSync(vignette)) {
    // Aplatie sur le blanc de la plaque, en JPEG : même rendu, dix fois plus léger.
    const jpg = await sharp(vignette)
      .resize(280, 280, { fit: 'contain', background: '#ffffff' })
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: 82 })
      .toBuffer()
    const img = await doc.embedJpg(jpg)
    const cx = W - 118
    const cy = H - hb + 8
    page.drawCircle({ x: cx + 3, y: cy - 5, size: 88, color: C.violetProfond, opacity: 0.35 })
    page.drawCircle({ x: cx, y: cy, size: 88, color: C.blanc, borderColor: C.bord, borderWidth: 4 })
    page.drawImage(img, { x: cx - 66, y: cy - 66, width: 132, height: 132 })
  }

  // Pastilles : centre, durée, coefficient, code.
  let x = 40
  const yPill = H - hb - 58
  const pastilles = [
    meta.centre,
    duree(meta.dureeMin) && `Durée ${duree(meta.dureeMin)}`,
    meta.coefficient && `Coefficient ${String(meta.coefficient).replace('.', ',')}`,
    `${nbPages} page${nbPages > 1 ? 's' : ''}`,
  ].filter(Boolean)
  for (const t of pastilles) {
    const w = P.gras.widthOfTextAtSize(t, 10.5) + 24
    if (x + w > W - 175) break
    carte(page, x, yPill, w, 24, 12, { color: C.blanc, borderColor: C.bord, borderWidth: 1 })
    page.drawText(t, { x: x + 12, y: yPill + 8, size: 10.5, font: P.gras, color: C.encre })
    x += w + 8
  }

  // Carte « Ce qui t'attend ».
  let y = yPill - 26
  const cw = W - 80
  const lignes = []
  if (meta.consigne) for (const l of couper(meta.consigne, P.texte, 11, cw - 40)) lignes.push({ t: l, p: P.texte, s: 11, c: C.encre, h: 15 })
  const items = meta.parties.map((p) => ({
    titre: p.titre,
    lignes: couper(p.enonce, P.texte, 10.5, cw - 76).slice(0, 4),
  }))
  const hItems = items.reduce((s, it) => s + 16 + it.lignes.length * 14 + 8, 0)
  const hCarte = 58 + lignes.length * 15 + (items.length ? hItems + 6 : 0) + 10
  y -= hCarte
  carte(page, 40, y - 4, cw, hCarte, 20, { color: C.bord })
  carte(page, 40, y, cw, hCarte, 20, { color: C.blanc })
  let yy = y + hCarte - 34
  page.drawText('Ce qui t’attend', { x: 60, y: yy, size: 17, font: P.titre, color: C.encre })
  yy -= 22
  for (const l of lignes) {
    page.drawText(l.t, { x: 60, y: yy, size: l.s, font: l.p, color: l.c })
    yy -= l.h
  }
  yy -= 6
  items.forEach((it, i) => {
    page.drawCircle({ x: 70, y: yy + 4, size: 10, color: C.lavande })
    const n = String(i + 1)
    page.drawText(n, { x: 70 - P.noir.widthOfTextAtSize(n, 10) / 2, y: yy, size: 10, font: P.noir, color: C.violet })
    page.drawText(it.titre, { x: 90, y: yy, size: 11.5, font: P.noir, color: C.encre })
    yy -= 16
    for (const l of it.lignes) {
      page.drawText(l, { x: 90, y: yy, size: 10.5, font: P.texte, color: C.gris })
      yy -= 14
    }
    yy -= 8
  })

  // Encart doré : le corrigé est dans l'app.
  const hOr = 74
  const yOr = Math.max(y - 22 - hOr, 70)
  carte(page, 40, yOr - 4, cw, hOr, 20, { color: hex('#e0a114') })
  carte(page, 40, yOr, cw, hOr, 20, { color: C.or })
  page.drawText('Ton corrigé Studuel t’attend dans l’app', { x: 60, y: yOr + hOr - 30, size: 15, font: P.titre, color: C.encre })
  const chemin = `Réviser › ${meta.matiere === 'francais' ? 'Français' : m.long} › Annales : chaque partie corrigée pas à pas, avec la méthode, les pièges et ce que le correcteur attend.`
  couper(chemin, P.gras, 10, cw - 40).slice(0, 2).forEach((l, i) =>
    page.drawText(l, { x: 60, y: yOr + hOr - 48 - i * 13, size: 10, font: P.gras, color: C.encre }),
  )

  // Mode d'emploi en trois temps, si la place le permet (un sujet à six
  // parties remplit la page à lui seul).
  const hMode = 118
  if (yOr - 26 - hMode > 62) {
    const yMode = 70
    const etapes = [
      ['Mets-toi en conditions', `${duree(meta.dureeMin) ?? 'La durée réelle'}, sans tes cours, un minuteur posé à côté.`],
      ['Compose pour de vrai', 'Brouillon, puis copie au propre : c’est l’entraînement qui compte.'],
      ['Corrige-toi avec Studuel', 'Partie par partie, note ce qui t’a coûté des points.'],
    ]
    page.drawText('Comment t’en servir', { x: 40, y: yMode + hMode - 14, size: 15, font: P.titre, color: C.encre })
    const lw = (cw - 2 * 12) / 3
    etapes.forEach(([titre, texte], i) => {
      const x0 = 40 + i * (lw + 12)
      carte(page, x0, yMode - 3, lw, hMode - 32, 16, { color: C.bord })
      carte(page, x0, yMode, lw, hMode - 32, 16, { color: C.blanc })
      page.drawCircle({ x: x0 + 24, y: yMode + hMode - 58, size: 12, color: C.violet })
      const n = String(i + 1)
      page.drawText(n, { x: x0 + 24 - P.titre.widthOfTextAtSize(n, 13) / 2, y: yMode + hMode - 63, size: 13, font: P.titre, color: C.blanc })
      couper(titre, P.noir, 10.5, lw - 52).slice(0, 2).forEach((l, j) =>
        page.drawText(l, { x: x0 + 44, y: yMode + hMode - 55 - j * 12, size: 10.5, font: P.noir, color: C.encre }),
      )
      couper(texte, P.texte, 9, lw - 28).slice(0, 3).forEach((l, j) =>
        page.drawText(l, { x: x0 + 14, y: yMode + hMode - 88 - j * 11.5, size: 9, font: P.texte, color: C.gris }),
      )
    })
  }

  // Mention de la source.
  const mention = `Sujet officiel du ${meta.brevet ? 'diplôme national du brevet' : 'baccalauréat'}, ministère de l’Éducation nationale${meta.code ? ` (${meta.code})` : ''}, reproduit sans modification de son contenu. Couverture et mise en page : Studuel.`
  couper(mention, P.texte, 8, W - 80).forEach((l, i) =>
    page.drawText(l, { x: 40, y: 40 - i * 10, size: 8, font: P.texte, color: C.gris }),
  )
}

async function habiller(id) {
  const source = await PDFDocument.load(readFileSync(path.join(SOURCES, `${id}.pdf`)), { ignoreEncryption: true })
  const meta = metaDe(id)
  const doc = await PDFDocument.create()
  const P = await polices(doc)
  const nb = source.getPageCount()
  doc.setTitle(`${meta.titre} — ${MATIERES[meta.matiere].long} · Studuel`)
  doc.setAuthor('Ministère de l’Éducation nationale (sujet) · Studuel (mise en page)')
  doc.setCreator('Studuel')
  doc.setProducer('Studuel')

  await couverture(doc, P, meta, nb)

  const pages = await doc.embedPages(source.getPages())
  const enTete = `${meta.titre} · ${MATIERES[meta.matiere].long}${meta.centre ? ` · ${meta.centre}` : ''}`
  pages.forEach((emb, i) => {
    const src = source.getPage(i)
    const { width: W, height: H } = src.getSize()
    const page = doc.addPage([W, H])
    const haut = 34
    const bas = 26
    const cote = 14
    const k = Math.min((W - 2 * cote) / W, (H - haut - bas) / H)
    const w = W * k
    const h = H * k
    page.drawPage(emb, { x: (W - w) / 2, y: bas + (H - haut - bas - h) / 2, width: w, height: h })

    // Bandeau de tête.
    page.drawRectangle({ x: 0, y: H - 5, width: W, height: 5, color: C.violet })
    carte(page, cote, H - 27, 56, 16, 8, { color: C.violet })
    page.drawText('Studuel', { x: cote + 9, y: H - 22.5, size: 9, font: P.titre, color: C.blanc })
    let t = enTete
    while (P.gras.widthOfTextAtSize(t, 8.5) > W - 2 * cote - 160 && t.length > 10) t = t.slice(0, -2)
    if (t !== enTete) t = t.trimEnd() + '…'
    page.drawText(t, { x: cote + 64, y: H - 22, size: 8.5, font: P.gras, color: C.encre })
    const droite = 'Sujet officiel'
    page.drawText(droite, { x: W - cote - P.noir.widthOfTextAtSize(droite, 8.5), y: H - 22, size: 8.5, font: P.noir, color: C.violet })

    // Pied : pagination.
    const pied = `${i + 1} / ${nb}`
    const lw = P.noir.widthOfTextAtSize(pied, 9) + 18
    carte(page, (W - lw) / 2, 6, lw, 15, 7.5, { color: C.lavande })
    page.drawText(pied, { x: (W - lw) / 2 + 9, y: 10, size: 9, font: P.noir, color: C.violet })
    page.drawText('studuel · annales corrigées', { x: cote, y: 10, size: 7.5, font: P.texte, color: C.gris })
  })

  mkdirSync(SORTIE, { recursive: true })
  const octets = await doc.save({ useObjectStreams: true })
  writeFileSync(path.join(SORTIE, `${id}.pdf`), octets)
  return { id, pages: nb, ko: Math.round(octets.length / 1024) }
}

const demandes = process.argv.slice(2)
const ids = demandes.length
  ? demandes
  : readdirSync(SOURCES).filter((f) => f.endsWith('.pdf')).map((f) => f.slice(0, -4))
for (const id of ids) {
  try {
    const r = await habiller(id)
    console.log(`✓ ${r.id} — ${r.pages} p. + couverture, ${r.ko} Ko`)
  } catch (e) {
    console.log(`✗ ${id} : ${e.message}`)
    process.exitCode = 1
  }
}
