// -----------------------------------------------------------------------------
// LA RELECTURE DU CONTENU ÉCRIT — rien n'entre en base sans passer ici.
//
// Un exercice est écrit à la main (ou par un agent) dans un fichier JSON. Ce
// qui peut y être faux ne se voit pas à l'œil : une réponse qui pointe une
// option inexistante, un trou de trop, une carte qui cite une région
// inconnue, une chaîne dont un lien part dans le vide. En classe, ces fautes
// font un élève déclaré faux alors qu'il avait juste — exactement la « peur »
// que ce cahier doit faire tomber.
//
// `validerFichier` rend la liste des fautes, chacune avec son chemin
// (« 6e/maths · exercice 4 · question 2 : … »). lib/exercices/contenu.test.ts
// la passe sur TOUS les fichiers de contenu/exercices : un fichier fautif fait
// rougir la suite, et le script de migration refuse de l'écrire.
// -----------------------------------------------------------------------------

import { CODES_FONDS } from './cartes/codes'
import { lieu } from './cartes/lieux'
import { normaliser } from './normaliser'
import {
  CATEGORIES_SCRATCH,
  COMPETENCES,
  COMPOSANTS,
  FONDS_CARTE,
  TEINTES,
  type BlocScratch,
  type Document,
  type ExerciceSource,
  type FichierExercices,
  type QuestionSource,
} from './types'
import { ciblesEcrites } from './zones'

export type Faute = { chemin: string; message: string }

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const ID = /^[A-Za-z0-9_-]{1,40}$/
const MOTIFS = ['plein', 'clair', 'hachures', 'points', 'aucun']

/** Nombre de questions permis selon les étoiles : l'exercice 1 reste court. */
export const QUESTIONS_PAR_ETOILES: Record<1 | 2 | 3, [number, number]> = {
  1: [2, 4],
  2: [3, 5],
  3: [3, 6],
}

class Relecteur {
  fautes: Faute[] = []
  constructor(private base: string) {}
  faute(chemin: string, message: string) {
    this.fautes.push({ chemin: `${this.base}${chemin ? ` · ${chemin}` : ''}`, message })
  }
  texte(chemin: string, v: unknown, min: number, max: number, nom: string) {
    if (typeof v !== 'string' || v.trim().length < min) this.faute(chemin, `${nom} manquant ou trop court`)
    else if (v.length > max) this.faute(chemin, `${nom} trop long (${v.length} > ${max})`)
  }
  nombre(chemin: string, v: unknown, nom: string): v is number {
    if (typeof v !== 'number' || !Number.isFinite(v)) {
      this.faute(chemin, `${nom} doit être un nombre`)
      return false
    }
    return true
  }
  teinte(chemin: string, t: unknown) {
    if (t !== undefined && !TEINTES.includes(t as never)) this.faute(chemin, `teinte inconnue « ${String(t)} »`)
  }
  motif(chemin: string, m: unknown) {
    if (m !== undefined && !MOTIFS.includes(m as string)) this.faute(chemin, `motif inconnu « ${String(m)} »`)
  }
  uniques(chemin: string, ids: (string | undefined)[], nom: string) {
    const vus = new Set<string>()
    for (const id of ids) {
      if (id === undefined) continue
      if (!ID.test(id)) this.faute(chemin, `${nom} « ${id} » : lettres, chiffres, - et _ seulement`)
      if (vus.has(id)) this.faute(chemin, `${nom} « ${id} » en double`)
      vus.add(id)
    }
  }
}

// ------------------------------------------------------------- documents

function marquesBienFormees(r: Relecteur, chemin: string, s: string) {
  const ouvertes = (s.match(/\[\[/g) ?? []).length
  const bonnes = (s.match(/\[\[[A-Za-z0-9_-]+\|[^\]]+\]\]/g) ?? []).length
  if (ouvertes !== bonnes) r.faute(chemin, 'marque de mot mal formée (attendu [[groupe|mots]])')
}

function validerScratch(r: Relecteur, chemin: string, blocs: BlocScratch[], ids: string[], profondeur: number) {
  if (profondeur > 3) r.faute(chemin, 'blocs imbriqués trop profondément')
  blocs.forEach((b, i) => {
    const c = `${chemin} bloc ${i + 1}`
    if (!CATEGORIES_SCRATCH.includes(b.categorie)) r.faute(c, `catégorie Scratch inconnue « ${b.categorie} »`)
    r.texte(c, b.texte, 1, 80, 'texte du bloc')
    if (b.id) ids.push(b.id)
    if (b.interieur) validerScratch(r, c, b.interieur, ids, profondeur + 1)
    if (b.sinon) validerScratch(r, c, b.sinon, ids, profondeur + 1)
  })
}

function validerDocument(r: Relecteur, d: Document, chemin: string) {
  if (d.titre !== undefined) r.texte(chemin, d.titre, 2, 90, 'titre du document')
  if (d.source !== undefined) r.texte(chemin, d.source, 2, 160, 'source')
  switch (d.type) {
    case 'texte': {
      if (!['recit', 'poeme', 'theatre', 'article', 'lettre', 'source', 'consigne'].includes(d.genre))
        r.faute(chemin, `genre de texte inconnu « ${d.genre} »`)
      if (!Array.isArray(d.blocs) || d.blocs.length === 0 || d.blocs.length > 40) r.faute(chemin, '1 à 40 blocs')
      let total = 0
      for (const b of d.blocs ?? []) {
        const t = typeof b === 'string' ? b : 'replique' in b ? b.replique : 'didascalie' in b ? b.didascalie : null
        // Dans un poème, une chaîne vide sépare deux strophes.
        if (d.genre === 'poeme' && t === '') continue
        if (typeof t !== 'string' || !t.trim()) r.faute(chemin, 'bloc vide ou mal formé')
        else {
          total += t.length
          marquesBienFormees(r, chemin, t)
        }
        if (typeof b === 'object' && 'replique' in b) r.texte(chemin, b.personnage, 1, 40, 'personnage')
      }
      if (total > 3500) r.faute(chemin, `texte trop long (${total} caractères > 3500)`)
      break
    }
    case 'tableau': {
      if (!Array.isArray(d.colonnes) || d.colonnes.length < 1 || d.colonnes.length > 7) r.faute(chemin, '1 à 7 colonnes')
      if (!Array.isArray(d.lignes) || d.lignes.length < 1 || d.lignes.length > 14) r.faute(chemin, '1 à 14 lignes')
      d.lignes?.forEach((l, i) => {
        if (!Array.isArray(l) || l.length !== d.colonnes.length)
          r.faute(chemin, `ligne ${i + 1} : ${l?.length ?? 0} cases pour ${d.colonnes.length} colonnes`)
      })
      break
    }
    case 'graphique': {
      if (!['barres', 'barres-h', 'courbe', 'secteurs', 'climat'].includes(d.forme)) r.faute(chemin, `forme inconnue « ${d.forme} »`)
      if (!Array.isArray(d.categories) || d.categories.length < 2 || d.categories.length > 16)
        r.faute(chemin, '2 à 16 catégories')
      if (!Array.isArray(d.series) || d.series.length < 1 || d.series.length > 3) r.faute(chemin, '1 à 3 séries')
      if (d.forme === 'secteurs' && d.series?.length !== 1) r.faute(chemin, 'un diagramme circulaire a UNE série')
      if (d.forme === 'climat' && (d.series?.length !== 2 || d.categories?.length !== 12))
        r.faute(chemin, 'un diagramme climatique a 12 mois et 2 séries (températures puis précipitations)')
      d.series?.forEach((s, i) => {
        r.texte(chemin, s.nom, 1, 60, `nom de la série ${i + 1}`)
        r.teinte(chemin, s.teinte)
        if (!Array.isArray(s.valeurs) || s.valeurs.length !== d.categories.length)
          r.faute(chemin, `série ${i + 1} : ${s.valeurs?.length ?? 0} valeurs pour ${d.categories.length} catégories`)
        s.valeurs?.forEach((v) => {
          if (v !== null && (typeof v !== 'number' || !Number.isFinite(v))) r.faute(chemin, `série ${i + 1} : valeur non numérique`)
          if (d.forme === 'secteurs' && typeof v === 'number' && v < 0) r.faute(chemin, 'secteur négatif')
        })
      })
      if (d.axeY?.min !== undefined && d.axeY?.max !== undefined && d.axeY.min >= d.axeY.max)
        r.faute(chemin, 'axeY : min doit être inférieur à max')
      if (d.axeY?.pas !== undefined && !(d.axeY.pas > 0)) r.faute(chemin, 'axeY : pas positif')
      break
    }
    case 'carte': {
      if (!FONDS_CARTE.includes(d.fond)) {
        r.faute(chemin, `fond de carte inconnu « ${d.fond} »`)
        break
      }
      const codes = CODES_FONDS[d.fond]
      for (const reg of d.regions ?? []) {
        if (!codes.zones[reg.code]) r.faute(chemin, `région / pays inconnu « ${reg.code} » sur le fond ${d.fond}`)
        r.teinte(chemin, reg.teinte)
        r.motif(chemin, reg.motif)
      }
      r.uniques(chemin, [...(d.lieux ?? []).map((l) => l.id), ...(d.aires ?? []).map((a) => a.id), ...(d.traits ?? []).map((t) => t.id)], 'identifiant')
      for (const l of d.lieux ?? []) {
        const connu = l.lieu !== undefined
        if (connu && !lieu(l.lieu as string)) r.faute(chemin, `lieu inconnu du répertoire « ${l.lieu} » (ajouter lon/lat)`)
        if (!connu && (typeof l.lon !== 'number' || typeof l.lat !== 'number'))
          r.faute(chemin, `lieu « ${l.id} » : un « lieu » du répertoire ou lon/lat`)
        if (l.symbole === 'lettre' && !l.lettre) r.faute(chemin, `lieu « ${l.id} » : symbole lettre sans lettre`)
        r.teinte(chemin, l.teinte)
      }
      for (const t of d.traits ?? []) {
        if (!Array.isArray(t.points) || t.points.length < 2) r.faute(chemin, 'un trait a au moins 2 points')
        for (const p of t.points ?? [])
          if (typeof p === 'string' ? !lieu(p) : !(Array.isArray(p) && p.length === 2))
            r.faute(chemin, `trait : point inconnu ${JSON.stringify(p)}`)
        r.teinte(chemin, t.teinte)
      }
      for (const a of d.aires ?? []) {
        if (!Array.isArray(a.contour) || a.contour.length < 3) r.faute(chemin, 'une aire a au moins 3 points')
        r.teinte(chemin, a.teinte)
        r.motif(chemin, a.motif)
      }
      for (const [nom, liste, dispo] of [
        ['fleuve', d.fleuves, codes.fleuves],
        ['relief', d.reliefs, codes.reliefs],
        ['désert', d.deserts, codes.deserts],
      ] as const) {
        if (Array.isArray(liste)) for (const id of liste) if (!dispo.includes(id)) r.faute(chemin, `${nom} inconnu « ${id} » sur le fond ${d.fond}`)
      }
      if (d.cadrage && !(d.cadrage[0] < d.cadrage[2] && d.cadrage[1] < d.cadrage[3]))
        r.faute(chemin, 'cadrage : [lonMin, latMin, lonMax, latMax]')
      for (const l of d.legende ?? []) {
        r.teinte(chemin, l.teinte)
        r.texte(chemin, l.texte, 1, 60, 'texte de légende')
      }
      break
    }
    case 'frise': {
      if (!r.nombre(chemin, d.debut, 'debut') || !r.nombre(chemin, d.fin, 'fin') || !r.nombre(chemin, d.pas, 'pas')) break
      if (d.debut >= d.fin) r.faute(chemin, 'debut < fin')
      if (!(d.pas > 0) || (d.fin - d.debut) / d.pas > 24) r.faute(chemin, 'pas positif, 24 graduations au plus')
      const dans = (v: number) => v >= d.debut && v <= d.fin
      for (const p of d.periodes ?? []) {
        if (!(p.debut < p.fin) || !dans(p.debut) || !dans(p.fin)) r.faute(chemin, `période « ${p.nom} » hors de la frise ou inversée`)
        r.texte(chemin, p.nom, 1, 50, 'nom de période')
        r.teinte(chemin, p.teinte)
      }
      for (const e of d.evenements ?? []) {
        if (!dans(e.date)) r.faute(chemin, `événement « ${e.nom} » hors de la frise`)
        r.texte(chemin, e.nom, 1, 60, "nom d'événement")
        r.teinte(chemin, e.teinte)
      }
      if ((d.evenements ?? []).length > 9) r.faute(chemin, '9 événements au plus (la frise devient illisible)')
      r.uniques(chemin, [...(d.evenements ?? []).map((e) => e.id), ...(d.periodes ?? []).map((p) => p.id)], 'identifiant')
      break
    }
    case 'figure': {
      const c = d.cadre
      if (!c || !(c.xmin < c.xmax && c.ymin < c.ymax) || c.xmax - c.xmin > 40 || c.ymax - c.ymin > 40)
        r.faute(chemin, 'cadre : xmin < xmax, ymin < ymax, 40 unités au plus')
      const points = new Set((d.points ?? []).map((p) => p.id))
      r.uniques(chemin, (d.points ?? []).map((p) => p.id), 'point')
      const ref = (id: string, quoi: string) => {
        if (!points.has(id)) r.faute(chemin, `${quoi} : point inconnu « ${id} »`)
      }
      for (const s of d.segments ?? []) {
        ref(s.de, 'segment')
        ref(s.a, 'segment')
        r.teinte(chemin, s.teinte)
      }
      for (const x of d.droites ?? []) x.par.forEach((p) => ref(p, 'droite'))
      for (const x of d.demiDroites ?? []) [x.origine, x.par].forEach((p) => ref(p, 'demi-droite'))
      for (const x of d.cercles ?? []) {
        ref(x.centre, 'cercle')
        if (!(x.rayon > 0)) r.faute(chemin, 'cercle : rayon positif')
      }
      for (const x of d.angles ?? []) [x.sommet, x.de, x.a].forEach((p) => ref(p, 'angle'))
      for (const x of d.polygones ?? []) {
        if (x.sommets.length < 3) r.faute(chemin, 'un polygone a au moins 3 sommets')
        x.sommets.forEach((p) => ref(p, 'polygone'))
        r.motif(chemin, x.motif)
        r.teinte(chemin, x.teinte)
      }
      r.uniques(
        chemin,
        [d.segments, d.droites, d.demiDroites, d.cercles, d.angles, d.polygones].flatMap((l) => (l ?? []).map((x) => x.id)),
        'identifiant',
      )
      break
    }
    case 'droite': {
      if (!r.nombre(chemin, d.min, 'min') || !r.nombre(chemin, d.max, 'max') || !r.nombre(chemin, d.pas, 'pas')) break
      if (!(d.min < d.max) || !(d.pas > 0) || (d.max - d.min) / d.pas > 20) r.faute(chemin, 'min < max, 20 graduations principales au plus')
      if (d.division !== undefined && (!Number.isInteger(d.division) || d.division < 1 || d.division > 10))
        r.faute(chemin, 'division : un entier de 1 à 10')
      for (const p of d.points ?? []) if (p.valeur < d.min || p.valeur > d.max) r.faute(chemin, `point « ${p.nom} » hors de la droite`)
      r.uniques(chemin, (d.points ?? []).map((p) => p.id), 'point')
      break
    }
    case 'schema': {
      if (!(d.largeur >= 60 && d.largeur <= 800 && d.hauteur >= 40 && d.hauteur <= 800)) r.faute(chemin, 'largeur/hauteur de 60 à 800')
      if (!Array.isArray(d.elements) || d.elements.length === 0 || d.elements.length > 90) r.faute(chemin, '1 à 90 éléments')
      r.uniques(chemin, (d.elements ?? []).map((e) => e.id), 'identifiant')
      for (const e of d.elements ?? []) {
        r.teinte(chemin, e.teinte)
        r.motif(chemin, e.motif)
        if (e.zone && !e.id) r.faute(chemin, 'un élément touchable (zone) a besoin d’un id')
        if (e.forme === 'chemin' && !/^[MmLlHhVvCcSsQqTtAaZz0-9 .,-]+$/.test(e.d)) r.faute(chemin, 'chemin : tracé SVG invalide')
        if (!['rect', 'cercle', 'ellipse', 'ligne', 'polygone', 'chemin', 'texte', 'etiquette', 'emoji'].includes(e.forme))
          r.faute(chemin, `forme inconnue « ${(e as { forme: string }).forme} »`)
      }
      break
    }
    case 'chaine': {
      if (!['ligne', 'colonne', 'cycle'].includes(d.disposition)) r.faute(chemin, `disposition inconnue « ${d.disposition} »`)
      if (!Array.isArray(d.noeuds) || d.noeuds.length < 2 || d.noeuds.length > 10) r.faute(chemin, '2 à 10 nœuds')
      r.uniques(chemin, (d.noeuds ?? []).map((n) => n.id), 'nœud')
      const ids = new Set((d.noeuds ?? []).map((n) => n.id))
      for (const n of d.noeuds ?? []) {
        r.texte(chemin, n.texte, 1, 48, 'texte de nœud')
        r.teinte(chemin, n.teinte)
      }
      const rang = new Map((d.noeuds ?? []).map((n, i) => [n.id, i] as const))
      const n = d.noeuds?.length ?? 0
      for (const l of d.liens ?? []) {
        if (!ids.has(l.de) || !ids.has(l.a)) {
          r.faute(chemin, `lien ${l.de} → ${l.a} : nœud inconnu`)
          continue
        }
        // Une chaîne relie des VOISINS (le premier et le dernier aussi, en
        // cycle) : une toile plus compliquée se dessine en schéma.
        const ecart = Math.abs((rang.get(l.de) as number) - (rang.get(l.a) as number))
        if (ecart !== 1 && !(d.disposition === 'cycle' && ecart === n - 1))
          r.faute(chemin, `lien ${l.de} → ${l.a} : une chaîne ne relie que des nœuds voisins (sinon, un schéma)`)
      }
      break
    }
    case 'fiche': {
      if (!['ticket', 'menu', 'affiche', 'etiquette', 'invitation', 'panneau', 'recette', 'horaires', 'carte-postale'].includes(d.modele))
        r.faute(chemin, `modèle de fiche inconnu « ${d.modele} »`)
      r.texte(chemin, d.entete, 1, 60, 'en-tête')
      if (!Array.isArray(d.lignes) || d.lignes.length === 0 || d.lignes.length > 22) r.faute(chemin, '1 à 22 lignes')
      r.uniques(chemin, (d.lignes ?? []).map((l) => ('separateur' in l ? undefined : l.id)), 'ligne')
      r.teinte(chemin, d.teinte)
      break
    }
    case 'dialogue': {
      if (!['sms', 'bulles'].includes(d.modele)) r.faute(chemin, `modèle de dialogue inconnu « ${d.modele} »`)
      const noms = new Set((d.participants ?? []).map((p) => p.nom))
      if (noms.size === 0 || noms.size > 4 || noms.size !== d.participants.length) r.faute(chemin, '1 à 4 participants aux noms distincts')
      if (!Array.isArray(d.repliques) || d.repliques.length === 0 || d.repliques.length > 18) r.faute(chemin, '1 à 18 répliques')
      for (const rep of d.repliques ?? []) {
        if (!noms.has(rep.qui)) r.faute(chemin, `réplique d’un participant inconnu « ${rep.qui} »`)
        r.texte(chemin, rep.texte, 1, 300, 'réplique')
        marquesBienFormees(r, chemin, rep.texte ?? '')
      }
      break
    }
    case 'scratch': {
      if (!Array.isArray(d.scripts) || d.scripts.length === 0 || d.scripts.length > 3) r.faute(chemin, '1 à 3 scripts')
      const ids: string[] = []
      d.scripts?.forEach((s, i) => validerScratch(r, `${chemin} script ${i + 1}`, s, ids, 0))
      r.uniques(chemin, ids, 'bloc')
      break
    }
    case 'circuit': {
      if (!Array.isArray(d.branches) || d.branches.length === 0 || d.branches.length > 40) r.faute(chemin, '1 à 40 branches')
      r.uniques(chemin, (d.branches ?? []).map((b) => b.id), 'composant')
      for (const b of d.branches ?? []) {
        const ok = (p: unknown) => Array.isArray(p) && p.length === 2 && p.every((v) => typeof v === 'number' && v >= 0 && v <= 20)
        if (!ok(b.de) || !ok(b.a)) {
          r.faute(chemin, 'branche : de et a sont des [x, y] entre 0 et 20')
          continue
        }
        if (b.de[0] !== b.a[0] && b.de[1] !== b.a[1]) r.faute(chemin, `branche ${JSON.stringify(b.de)} → ${JSON.stringify(b.a)} : horizontale ou verticale seulement`)
        if (b.de[0] === b.a[0] && b.de[1] === b.a[1]) r.faute(chemin, 'branche de longueur nulle')
        if (b.composant && !COMPOSANTS.includes(b.composant)) r.faute(chemin, `composant inconnu « ${b.composant} »`)
        if (b.composant && Math.abs(b.a[0] - b.de[0]) + Math.abs(b.a[1] - b.de[1]) < 2) r.faute(chemin, 'une branche avec composant mesure au moins 2 carreaux')
        if (b.id && !b.composant) r.faute(chemin, `« ${b.id} » : seul un composant se touche`)
      }
      break
    }
    case 'horloge':
      if (!Number.isInteger(d.heures) || d.heures < 0 || d.heures > 23 || !Number.isInteger(d.minutes) || d.minutes < 0 || d.minutes > 59)
        r.faute(chemin, 'heures 0–23, minutes 0–59')
      break
    case 'solide':
      for (const k of ['longueur', 'largeur', 'hauteur'] as const)
        if (!(d[k] > 0) || d[k] > 20 || (d.cubes && !Number.isInteger(d[k]))) r.faute(chemin, `${k} : positive, 20 au plus (entière avec les cubes)`)
      break
    default:
      r.faute(chemin, `type de document inconnu « ${(d as { type: string }).type} »`)
  }
}

// ------------------------------------------------------------- questions

function validerQuestion(r: Relecteur, q: QuestionSource, chemin: string, docs: Map<string, Document>) {
  r.texte(chemin, q.enonce, 5, 320, 'énoncé')
  r.texte(chemin, q.explication, 5, 520, 'explication')
  if (q.aide !== undefined) r.texte(chemin, q.aide, 3, 260, 'coup de pouce')
  switch (q.type) {
    case 'choix': {
      if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 6) r.faute(chemin, '2 à 6 options')
      if (new Set(q.options?.map(normaliser)).size !== q.options?.length) r.faute(chemin, 'options en double')
      q.options?.forEach((o) => r.texte(chemin, o, 1, 140, 'option'))
      const rep = Array.isArray(q.reponse) ? q.reponse : [q.reponse]
      if (rep.length === 0 || new Set(rep).size !== rep.length) r.faute(chemin, 'réponse vide ou en double')
      for (const i of rep) if (!Number.isInteger(i) || i < 0 || i >= (q.options?.length ?? 0)) r.faute(chemin, `réponse ${i} : pas d'option à cet indice`)
      break
    }
    case 'nombre':
      r.nombre(chemin, q.reponse, 'réponse')
      if (q.tolerance !== undefined && !(q.tolerance >= 0)) r.faute(chemin, 'tolérance positive')
      if (q.unite !== undefined) r.texte(chemin, q.unite, 1, 16, 'unité')
      break
    case 'texte':
      if (!Array.isArray(q.reponse) || q.reponse.length === 0 || q.reponse.length > 12) r.faute(chemin, '1 à 12 réponses acceptées')
      for (const t of q.reponse ?? []) {
        if (typeof t !== 'string' || !normaliser(t)) r.faute(chemin, 'réponse acceptée vide')
        else if (t.length > 60) r.faute(chemin, `réponse acceptée trop longue « ${t} » (une réponse tapée tient en quelques mots)`)
      }
      break
    case 'zone': {
      const doc = docs.get(q.document)
      if (!doc) {
        r.faute(chemin, `document inconnu « ${q.document} »`)
        break
      }
      const cibles = ciblesEcrites(doc)
      if (!Array.isArray(q.reponse) || q.reponse.length === 0) r.faute(chemin, 'au moins une zone à toucher')
      for (const c of q.reponse ?? []) {
        if (!cibles.has(c)) {
          const piste =
            doc.type === 'carte' && CODES_FONDS[doc.fond]?.zones[c] && !doc.regionsCliquables
              ? ' (ajouter "regionsCliquables": true à la carte)'
              : doc.type === 'schema'
                ? ' (l’élément doit avoir un id et "zone": true)'
                : ''
          r.faute(chemin, `zone « ${c} » introuvable dans ${q.document}${piste}`)
        }
      }
      if (q.portee && (doc.type !== 'texte' || q.portee.some((i) => !Number.isInteger(i) || i < 0 || i >= doc.blocs.length)))
        r.faute(chemin, 'portée : des indices de blocs d’un texte')
      if (doc.type === 'carte' && cibles.size > 0 && (q.reponse ?? []).length > 0 && !doc.regionsCliquables) {
        // Une carte où seuls les lieux se touchent : il faut plus d'un lieu,
        // sinon il n'y a rien à chercher.
        if ((doc.lieux ?? []).length + (doc.aires ?? []).length + (doc.traits ?? []).filter((t) => t.id).length < 2)
          r.faute(chemin, 'une seule zone à toucher : ce n’est pas une question')
      }
      break
    }
    case 'ordre':
      if (!Array.isArray(q.items) || q.items.length < 3 || q.items.length > 7) r.faute(chemin, '3 à 7 étapes')
      if (new Set(q.items?.map(normaliser)).size !== q.items?.length) r.faute(chemin, 'étapes en double')
      q.items?.forEach((t) => r.texte(chemin, t, 1, 120, 'étape'))
      break
    case 'association': {
      if (!Array.isArray(q.paires) || q.paires.length < 2 || q.paires.length > 6) r.faute(chemin, '2 à 6 paires')
      const g = q.paires?.map((p) => normaliser(p[0])) ?? []
      const dr = q.paires?.map((p) => normaliser(p[1])) ?? []
      if (new Set(g).size !== g.length || new Set(dr).size !== dr.length) r.faute(chemin, 'paires en double (chaque côté doit être unique)')
      q.paires?.forEach((p) => {
        r.texte(chemin, p[0], 1, 90, 'élément de gauche')
        r.texte(chemin, p[1], 1, 90, 'élément de droite')
      })
      break
    }
    case 'categories':
      if (!Array.isArray(q.categories) || q.categories.length < 2 || q.categories.length > 4) r.faute(chemin, '2 à 4 catégories')
      if (!Array.isArray(q.items) || q.items.length < 3 || q.items.length > 10) r.faute(chemin, '3 à 10 éléments à ranger')
      if (new Set(q.items?.map((i) => normaliser(i[0]))).size !== q.items?.length) r.faute(chemin, 'éléments en double')
      for (const [t, c] of q.items ?? []) {
        r.texte(chemin, t, 1, 80, 'élément')
        if (!Number.isInteger(c) || c < 0 || c >= (q.categories?.length ?? 0)) r.faute(chemin, `« ${t} » : catégorie ${c} inexistante`)
      }
      break
    case 'trous': {
      const n = (q.texte?.match(/___/g) ?? []).length
      if (n === 0) r.faute(chemin, 'aucun trou (___) dans le texte')
      if (!Array.isArray(q.reponses) || q.reponses.length !== n) r.faute(chemin, `${n} trou(s) mais ${q.reponses?.length ?? 0} réponse(s)`)
      if (n > 8) r.faute(chemin, '8 trous au plus')
      for (const acc of q.reponses ?? []) {
        if (!Array.isArray(acc) || acc.length === 0 || acc.some((a) => typeof a !== 'string' || !normaliser(a)))
          r.faute(chemin, 'chaque trou a au moins une réponse non vide')
      }
      if (q.banque) {
        const banque = new Set(q.banque.map(normaliser))
        for (const acc of q.reponses ?? []) if (acc?.[0] && !banque.has(normaliser(acc[0]))) r.faute(chemin, `la banque ne contient pas « ${acc[0]} »`)
        if (q.banque.length > 12) r.faute(chemin, '12 mots au plus dans la banque')
      }
      break
    }
    default:
      r.faute(chemin, `type de question inconnu « ${(q as { type: string }).type} »`)
  }
}

// ------------------------------------------------------------- exercice

export function validerExercice(ex: ExerciceSource, base = ''): Faute[] {
  const r = new Relecteur(base)
  if (typeof ex.chapitre !== 'string' || !UUID.test(ex.chapitre)) r.faute('', `chapitre : un UUID (reçu « ${ex.chapitre} »)`)
  if (![1, 2, 3].includes(ex.position)) r.faute('', 'position 1, 2 ou 3')
  if (ex.etoiles !== ex.position) r.faute('', `l’exercice ${ex.position} vaut ${ex.position} étoile(s) (reçu ${ex.etoiles})`)
  r.texte('', ex.titre, 3, 70, 'titre')
  if (!Object.prototype.hasOwnProperty.call(COMPETENCES, ex.competence)) r.faute('', `compétence inconnue « ${ex.competence} »`)
  r.texte('', ex.situation, 10, 520, 'mise en situation')

  const docs = new Map<string, Document>()
  if (!Array.isArray(ex.documents) || ex.documents.length < 1 || ex.documents.length > 3) r.faute('', '1 à 3 documents')
  r.uniques('', (ex.documents ?? []).map((d) => d.id), 'document')
  ;(ex.documents ?? []).forEach((d, i) => {
    docs.set(d.id, d)
    validerDocument(r, d, `doc ${i + 1} (${d.type})`)
  })

  const bornes = QUESTIONS_PAR_ETOILES[ex.etoiles] ?? [2, 6]
  const n = ex.questions?.length ?? 0
  if (n < bornes[0] || n > bornes[1]) r.faute('', `${bornes[0]} à ${bornes[1]} questions pour ${ex.etoiles} étoile(s) (reçu ${n})`)
  ;(ex.questions ?? []).forEach((q, i) => validerQuestion(r, q, `question ${i + 1} (${q.type})`, docs))
  return r.fautes
}

export function validerFichier(f: FichierExercices, nom = `${f.niveau}/${f.matiere}`): Faute[] {
  const fautes: Faute[] = []
  if (!Array.isArray(f.exercices)) return [{ chemin: nom, message: 'la liste « exercices » manque' }]
  const places = new Set<string>()
  f.exercices.forEach((ex, i) => {
    fautes.push(...validerExercice(ex, `${nom} · exercice ${i + 1} (${ex.chapitre?.slice(0, 8)}… n°${ex.position})`))
    const place = `${ex.chapitre}:${ex.position}`
    if (places.has(place)) fautes.push({ chemin: `${nom} · exercice ${i + 1}`, message: `deux exercices n°${ex.position} pour le même chapitre` })
    places.add(place)
  })
  return fautes
}
