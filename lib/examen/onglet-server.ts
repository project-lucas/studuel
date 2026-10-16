import 'server-only'
import type { SupabaseClient } from '@supabase/supabase-js'
import { readRowTolerant } from '@/lib/profile-read'
import { isMissingSchemaObject } from '@/lib/schema-fallback'
import { getGradeChaptersCached, getSubjectsCached } from '@/lib/catalog'
import { getChapterMastery } from '@/lib/mastery-server'
import { chapterState, type ChapterMastery } from '@/lib/mastery'
import { examsForProfile } from '@/lib/exams'
import { toDayKey } from '@/lib/streak'
import { lundiUTC } from '@/lib/ligue'
import { ANNALES_CORRIGEES } from '@/lib/annales-corrigees/registre'
import { estMatiereAnnale, MATIERES_ANNALES } from '@/lib/annales-corrigees/matieres'
import { niveauDesAnnales } from './annales-examen'
import { examenDe, joursAvantExamen, phaseDe, type Examen, type Phase } from './parcours'
import { normaliserDossier, type Piece } from './dossier-oral'
import type { NotesAcquises } from './simulateur'
import {
  epreuvesDeLEleve,
  estJourJProche,
  gestesDeLaSemaine,
  matieresDeLEpreuve,
  partOral,
  preparationGlobale,
  vueEpreuve,
  type CompteursSemaine,
  type EpreuveVue,
  type Geste,
  type Specialite,
} from './onglet'

// LA LECTURE de l'onglet Examen du bureau de Marcel (16/10/2026). UNE vague :
// le profil, le catalogue (cache), la maîtrise, les sujets tombés travaillés,
// le dossier d'oral (585), les notes du simulateur (585) et ce que l'élève a
// fait depuis lundi ; les chapitres du niveau se lisent dès que le profil est
// là. Toutes les règles sont dans ./onglet, ./dossier-oral et ./simulateur.
//
// Tolérant à l'absence de la 585 : le dossier dit alors qu'il n'est pas encore
// ouvert (`dossierDisponible: false`), le reste de l'onglet vit sans lui.

export type SujetsTombes = { matiere: string; nom: string; total: number; faits: number }

export type OngletExamenVue = {
  examen: Pick<Examen, 'id' | 'nom' | 'periode'>
  jours: number
  phase: Phase
  /** De 0 à 1. */
  preparation: number
  epreuves: EpreuveVue[]
  gestes: Geste[]
  dossierDisponible: boolean
  pieces: Piece[]
  sujets: SujetsTombes[]
  /** Les notes du simulateur (terminale seulement). */
  notes: NotesAcquises | null
  specialites: Specialite[]
  jourJ: boolean
}

type LigneNotes = {
  voie: string | null
  controle_continu: number | string | null
  francais_ecrit: number | string | null
  francais_oral: number | string | null
  maths_anticipees: number | string | null
}

const nombre = (v: unknown): number | null => {
  const n = typeof v === 'string' ? Number(v) : v
  return typeof n === 'number' && Number.isFinite(n) ? n : null
}

export async function lireOngletExamen(supabase: SupabaseClient, userId: string): Promise<OngletExamenVue | null> {
  const lundi = `${lundiUTC(new Date())}T00:00:00Z`
  const profilP = readRowTolerant<{ grade_level: string | null; selected_subjects: unknown }>(supabase, 'profiles', 'id', userId, [
    'grade_level',
    'selected_subjects',
  ])

  // Hors classe à examen, rien d'autre à lire.
  const classeP = profilP.then((p) => p?.grade_level ?? null)
  const examenP = classeP.then((c) => examenDe(c))

  const [profil, examen, matieres, chapitres, maitrise, annalesRes, dossierRes, notesRes, leconsRes, quizRes, blancsRes] =
    await Promise.all([
      profilP,
      examenP,
      getSubjectsCached(),
      Promise.all([classeP, examenP]).then(([c, e]) => (c && e ? getGradeChaptersCached(c) : [])),
      examenP.then((e) => (e ? getChapterMastery(supabase, userId) : (new Map() as ChapterMastery))),
      examenP.then((e) =>
        e ? supabase.from('annales_travail').select('annale_id, commence_le, termine_le').eq('user_id', userId) : null,
      ),
      examenP.then((e) =>
        e
          ? supabase.from('examen_oral').select('id, genre, titre, detail, matiere, etapes, passages, ordre').eq('user_id', userId)
          : null,
      ),
      examenP.then((e) =>
        e?.id === 'bac'
          ? supabase
              .from('examen_notes')
              .select('voie, controle_continu, francais_ecrit, francais_oral, maths_anticipees')
              .eq('user_id', userId)
              .maybeSingle()
          : null,
      ),
      examenP.then((e) =>
        e
          ? supabase.from('lesson_completions').select('id', { count: 'exact', head: true }).eq('user_id', userId).gte('created_at', lundi)
          : null,
      ),
      examenP.then((e) =>
        e
          ? supabase
              .from('test_sessions')
              .select('id', { count: 'exact', head: true })
              .eq('user_id', userId)
              .not('quiz_id', 'is', null)
              .gte('created_at', lundi)
          : null,
      ),
      // Les épreuves blanches : 40 dernières suffisent à compter par matière.
      examenP.then((e) =>
        e
          ? supabase.from('exam_blanc_sessions').select('report, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(40)
          : null,
      ),
    ])

  if (!examen) return null
  const classe = profil?.grade_level ?? ''
  const jours = joursAvantExamen(examen, toDayKey(new Date()))
  const phase = phaseDe(jours)

  // Les spécialités de terminale (les matières « specialite » choisies).
  const choisies = Array.isArray(profil?.selected_subjects) ? (profil.selected_subjects as string[]) : null
  const specialites: Specialite[] =
    examen.id === 'bac'
      ? examsForProfile(classe, choisies, matieres)
          .filter((x) => x.subject.slug !== 'philosophie')
          .map((x) => ({ slug: x.subject.slug, nom: x.subject.name }))
      : []

  // Le dossier d'oral (585).
  const dossierDisponible = !!dossierRes && !(dossierRes.error && isMissingSchemaObject(dossierRes.error))
  if (dossierRes?.error && !isMissingSchemaObject(dossierRes.error)) {
    console.error('[examen] dossier d’oral illisible :', dossierRes.error.message)
  }
  const genre = examen.id === 'brevet' ? 'projet' : examen.id === 'bac-francais' ? 'texte' : 'question'
  const pieces = normaliserDossier(dossierRes?.data ?? []).filter((p) => p.genre === genre)

  // Les sujets tombés : ceux du niveau, traités par l'élève.
  const niveau = niveauDesAnnales(examen.id)
  const traites = new Set<string>()
  let annalesOuvertes = 0
  let annalesTraitees = 0
  for (const a of annalesRes?.data ?? []) {
    if (a.termine_le) traites.add(a.annale_id)
    if (a.commence_le && a.commence_le >= lundi) annalesOuvertes++
    if (a.termine_le && a.termine_le >= lundi) annalesTraitees++
  }
  const parMatiere = new Map<string, { total: number; faits: number }>()
  for (const a of ANNALES_CORRIGEES) {
    if (a.niveau !== niveau) continue
    const m = parMatiere.get(a.matiere) ?? { total: 0, faits: 0 }
    m.total++
    if (traites.has(a.id)) m.faits++
    parMatiere.set(a.matiere, m)
  }

  // Les épreuves blanches, par matière (le rapport porte le NOM de la matière).
  const nomDe = new Map(matieres.map((m) => [m.slug, m.name]))
  const blancsParNom = new Map<string, number>()
  let blancsSemaine = 0
  for (const s of blancsRes?.data ?? []) {
    if (s.created_at >= lundi) blancsSemaine++
    const noms = new Set<string>()
    for (const r of Array.isArray(s.report) ? (s.report as { subject?: unknown }[]) : []) {
      if (typeof r?.subject === 'string') noms.add(r.subject)
    }
    for (const n of noms) blancsParNom.set(n, (blancsParNom.get(n) ?? 0) + 1)
  }

  // La maîtrise, par matière d'épreuve.
  const idDe = new Map(matieres.map((m) => [m.slug, m.id]))
  const chapitresDe = (slugs: string[]) => {
    const ids = new Set(slugs.map((s) => idDe.get(s)).filter(Boolean))
    return chapitres.filter((c) => ids.has(c.subject_id))
  }

  const epreuvesBrutes = epreuvesDeLEleve(examen, specialites)
  const oral = partOral(examen.id, pieces)
  let pointsFaibles = 0
  let aCommencer = 0
  const vus = new Set<string>()
  const epreuves = epreuvesBrutes.map((e) => {
    const slugs = matieresDeLEpreuve(e)
    const chs = chapitresDe(slugs)
    let somme = 0
    let maitrises = 0
    for (const c of chs) {
      const p = maitrise.get(c.id)
      somme += p?.value ?? 0
      const etat = chapterState(p)
      if (etat === 'maitrise') maitrises++
      if (!vus.has(c.id)) {
        vus.add(c.id)
        if (etat === 'fragile') pointsFaibles++
        if (etat === 'a_commencer') aCommencer++
      }
    }
    const annales = slugs.reduce(
      (acc, s) => {
        const m = parMatiere.get(s)
        return m ? { total: acc.total + m.total, faits: acc.faits + m.faits } : acc
      },
      { total: 0, faits: 0 },
    )
    const blancs = slugs.reduce((s, slug) => s + (blancsParNom.get(nomDe.get(slug) ?? '') ?? 0), 0)
    return vueEpreuve(
      e,
      {
        chapitres: { maitrises, total: chs.length, maitrise: chs.length ? somme / chs.length : 0 },
        annales: { faites: annales.faits, total: annales.total },
        blancs,
      },
      oral,
    )
  })

  const compteurs: CompteursSemaine = {
    lecons: leconsRes?.count ?? 0,
    quiz: quizRes?.count ?? 0,
    annalesOuvertes,
    annalesTraitees,
    blancs: blancsSemaine,
  }
  // La matière principale des gestes : l'épreuve écrite la moins prête.
  const ecrits = epreuves.filter((e) => e.nature === 'ecrit' && e.matiere && e.chapitres)
  const plusFaible = ecrits.length ? ecrits.reduce((a, b) => (b.preparation < a.preparation ? b : a)) : null
  const gestes = gestesDeLaSemaine(examen, phase, { pointsFaibles, aCommencer, matierePrincipale: plusFaible?.matiere ?? null }, compteurs)

  // Les sujets tombés de l'examen : ses matières d'abord.
  const slugsExamen = new Set(epreuves.flatMap((e) => (e.matiere ? [e.matiere] : [])))
  const sujets: SujetsTombes[] = [...parMatiere]
    .filter(([m]) => estMatiereAnnale(m))
    .sort((x, y) => Number(slugsExamen.has(y[0])) - Number(slugsExamen.has(x[0])) || y[1].total - x[1].total)
    .map(([m, v]) => ({ matiere: m, nom: MATIERES_ANNALES[m as keyof typeof MATIERES_ANNALES].court, ...v }))

  let notes: NotesAcquises | null = null
  if (examen.id === 'bac') {
    const l = (notesRes?.data ?? null) as LigneNotes | null
    notes = {
      voie: l?.voie === 'technologique' || classe === 'Tle techno' ? 'technologique' : 'generale',
      controleContinu: nombre(l?.controle_continu),
      francaisEcrit: nombre(l?.francais_ecrit),
      francaisOral: nombre(l?.francais_oral),
      mathsAnticipees: nombre(l?.maths_anticipees),
    }
  }

  return {
    examen: { id: examen.id, nom: examen.nom, periode: examen.periode },
    jours,
    phase,
    preparation: preparationGlobale(epreuves),
    epreuves,
    gestes,
    dossierDisponible,
    pieces,
    sujets,
    notes,
    specialites,
    jourJ: estJourJProche(jours),
  }
}
