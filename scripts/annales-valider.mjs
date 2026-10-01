// Relit une ou plusieurs annales corrigées (contenu/annales/*.json) sans lancer
// la suite de tests : structure, blocs connus, formules KaTeX lisibles, PDF du
// sujet présent. C'est l'outil des rédacteurs ; le test Vitest
// (lib/annales-corrigees/contenu.test.ts) refait les mêmes contrôles en CI.
//
//   node scripts/annales-valider.mjs                     → tout le dossier
//   node scripts/annales-valider.mjs contenu/annales/x.json …

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import path from 'node:path'
import katex from 'katex'

const RACINE = path.resolve(import.meta.dirname, '..')
const DOSSIER = path.join(RACINE, 'contenu', 'annales')
const SUJETS = path.join(RACINE, 'assets-sources', 'annales', 'sujets')

const MATIERES = ['philosophie', 'hlp', 'hggsp', 'ses', 'maths', 'physique-chimie', 'svt', 'nsi', 'francais', 'histoire-geo']
const NATURES = ['dissertation', 'explication', 'commentaire', 'etude', 'essai', 'interpretation', 'composee', 'exercice']
const LANGAGES = ['python', 'sql', 'texte']

function formulesDuTexte(t) {
  // `$…$` en ligne ; un `\$` échappé n'ouvre rien.
  const out = []
  const re = /(?<!\\)\$([^$]+?)(?<!\\)\$/g
  let m
  while ((m = re.exec(t))) out.push(m[1])
  return out
}

function verifierTex(tex, ou, erreurs) {
  try {
    katex.renderToString(tex, { throwOnError: true, strict: 'ignore' })
  } catch (e) {
    erreurs.push(`${ou} : formule illisible « ${tex} » (${String(e.message).split('\n')[0]})`)
  }
}

function verifierTexte(t, ou, erreurs) {
  if (typeof t !== 'string' || t.trim() === '') return erreurs.push(`${ou} : texte vide`)
  const dollars = (t.match(/(?<!\\)\$/g) || []).length
  if (dollars % 2) erreurs.push(`${ou} : nombre impair de $`)
  if (/<[a-z/][^>]*>/i.test(t)) erreurs.push(`${ou} : HTML interdit`)
  for (const f of formulesDuTexte(t)) verifierTex(f, ou, erreurs)
}

function verifierBlocs(blocs, ou, erreurs, dansQuestion = false) {
  if (!Array.isArray(blocs) || blocs.length === 0) return erreurs.push(`${ou} : aucun bloc`)
  blocs.forEach((b, i) => {
    const o = `${ou} › bloc ${i + 1} (${b?.type})`
    switch (b?.type) {
      case 'titre':
      case 'texte':
      case 'astuce':
      case 'piege':
      case 'attendu':
      case 'reponse':
        verifierTexte(b.texte, o, erreurs)
        break
      case 'citation':
        verifierTexte(b.texte, o, erreurs)
        break
      case 'liste':
        if (!Array.isArray(b.items) || b.items.length === 0) erreurs.push(`${o} : liste vide`)
        else b.items.forEach((it, j) => verifierTexte(it, `${o} › item ${j + 1}`, erreurs))
        break
      case 'formule':
        if (!b.tex) erreurs.push(`${o} : tex vide`)
        else verifierTex(b.tex, o, erreurs)
        break
      case 'code':
        if (!LANGAGES.includes(b.langage)) erreurs.push(`${o} : langage inconnu`)
        if (!b.code) erreurs.push(`${o} : code vide`)
        break
      case 'tableau':
        if (!Array.isArray(b.entetes) || !Array.isArray(b.lignes)) erreurs.push(`${o} : tableau mal formé`)
        else b.lignes.forEach((l, j) => {
          if (!Array.isArray(l) || l.length !== b.entetes.length) erreurs.push(`${o} › ligne ${j + 1} : ${l?.length} cellules pour ${b.entetes.length} colonnes`)
          else l.forEach((c) => typeof c === 'string' && c && verifierTexte(c, `${o} › ligne ${j + 1}`, erreurs))
        })
        break
      case 'question':
        if (dansQuestion) erreurs.push(`${o} : question dans une question`)
        if (!b.numero) erreurs.push(`${o} : numero manquant`)
        verifierTexte(b.intitule, `${o} › intitulé`, erreurs)
        verifierBlocs(b.blocs, `${o} [${b.numero}]`, erreurs, true)
        break
      default:
        erreurs.push(`${o} : type de bloc inconnu`)
    }
  })
}

export function validerAnnale(a, nomFichier) {
  const erreurs = []
  const ou = nomFichier
  if (a.id + '.json' !== nomFichier) erreurs.push(`${ou} : id « ${a.id} » ≠ nom du fichier`)
  if (!MATIERES.includes(a.matiere)) erreurs.push(`${ou} : matiere inconnue « ${a.matiere} »`)
  if (!['Tle', '1re', '3e'].includes(a.niveau)) erreurs.push(`${ou} : niveau`)
  if (!['bac', 'bac-anticipe', 'brevet'].includes(a.examen)) erreurs.push(`${ou} : examen`)
  if (!Number.isInteger(a.annee) || a.annee < 2020) erreurs.push(`${ou} : annee`)
  for (const k of ['centre', 'titre', 'consigne']) if (!a[k]) erreurs.push(`${ou} : ${k} manquant`)
  if (typeof a.code !== 'string') erreurs.push(`${ou} : code doit être une chaîne`)
  if (!(a.jour === null || a.jour === 1 || a.jour === 2)) erreurs.push(`${ou} : jour`)
  if (!(a.dureeMin > 0)) erreurs.push(`${ou} : dureeMin`)
  if (!existsSync(path.join(SUJETS, a.id + '.pdf'))) erreurs.push(`${ou} : pas de sujet ${a.id}.pdf dans assets-sources/annales/sujets/`)
  if (!Array.isArray(a.parties) || a.parties.length === 0) erreurs.push(`${ou} : aucune partie`)
  const ids = new Set()
  for (const p of a.parties ?? []) {
    const o = `${ou} › ${p.id}`
    if (!p.id || ids.has(p.id)) erreurs.push(`${o} : id de partie manquant ou en double`)
    ids.add(p.id)
    if (!p.titre) erreurs.push(`${o} : titre`)
    if (!NATURES.includes(p.nature)) erreurs.push(`${o} : nature inconnue « ${p.nature} »`)
    verifierTexte(p.enonce, `${o} › enonce`, erreurs)
    if (!Array.isArray(p.enBref) || p.enBref.length < 2 || p.enBref.length > 6) erreurs.push(`${o} : enBref doit compter 2 à 6 phrases`)
    else p.enBref.forEach((t, i) => verifierTexte(t, `${o} › enBref ${i + 1}`, erreurs))
    verifierBlocs(p.blocs, o, erreurs)
  }
  return erreurs
}

if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` || process.argv[1]?.endsWith('annales-valider.mjs')) {
  const fichiers = process.argv.slice(2).length
    ? process.argv.slice(2).map((f) => path.resolve(f))
    : existsSync(DOSSIER) ? readdirSync(DOSSIER).filter((f) => f.endsWith('.json')).map((f) => path.join(DOSSIER, f)) : []
  let total = 0
  for (const f of fichiers) {
    let a
    try {
      a = JSON.parse(readFileSync(f, 'utf8'))
    } catch (e) {
      console.log(`✗ ${path.basename(f)} : JSON illisible — ${e.message}`)
      total++
      continue
    }
    const erreurs = validerAnnale(a, path.basename(f))
    const mots = JSON.stringify(a.parties).split(/\s+/).length
    if (erreurs.length) {
      console.log(`✗ ${path.basename(f)} (${erreurs.length} erreur·s)`)
      for (const e of erreurs) console.log('   · ' + e)
    } else console.log(`✓ ${path.basename(f)} — ${a.parties.length} partie(s), ~${mots} mots`)
    total += erreurs.length
  }
  process.exit(total ? 1 : 0)
}
