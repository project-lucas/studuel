import type { SupabaseClient } from '@supabase/supabase-js'
import { chapterState } from '@/lib/mastery'
import { getChapterMastery } from '@/lib/mastery-server'
import { getGradeChaptersCached, getSubjectsCached } from '@/lib/catalog'
import { rowsToControles, type ControleRow } from '@/lib/prep-plan'
import { readRowTolerant } from '@/lib/profile-read'
import { computeStreak, toDayKey } from '@/lib/streak'
import { fetchJoursActifs } from '@/lib/jours-actifs'
import { examenDe, joursAvantExamen } from '@/lib/examen/parcours'
import { construireIndex, type IndexFiches } from '@/lib/reviser/recherche-globale'
import type { Subject } from '@/lib/types'
import { construireProfil, type ChapitreProfil, type DonneesProfil, type ProfilEleve } from './profil-eleve'

// CE QUE MARCEL SAIT DE L'ÉLÈVE, CÔTÉ SERVEUR (15/10/2026). La règle est pure
// (./profil-eleve) ; ce module rassemble les données en UNE vague : le profil,
// les contrôles à venir et la maîtrise partent ensemble, le programme de la
// classe et les matières viennent du cache serveur. Lu au moment où l'élève
// pose sa question — en parallèle de la porte des crédits, jamais à la place.

type ProfilRow = { grade_level: string | null; daily_goal_minutes: number | null; selected_subjects: unknown }

/** Les données brutes, déjà triées par matière suivie. Partagées avec l'écran de Marcel. */
export function donneesProfil({
  classe,
  objectifMinutes,
  serie,
  controles,
  chapitres,
  matieres,
  aujourdhui,
}: {
  classe: string | null
  objectifMinutes: number | null
  serie: number
  controles: ReturnType<typeof rowsToControles>
  chapitres: ChapitreProfil[]
  matieres: readonly Pick<Subject, 'slug' | 'name'>[]
  aujourdhui: string
}): DonneesProfil {
  const nomDe = new Map(matieres.map((m) => [m.slug, m.name]))
  const examen = examenDe(classe)
  return {
    classe,
    aujourdhui,
    objectifMinutes,
    serie,
    // La matière par le CATALOGUE seulement : un slug inconnu (écrit à la main
    // dans la ligne) n'entre pas dans la consigne.
    controles: controles.flatMap((c) => {
      const matiere = nomDe.get(c.subject)
      return c.note === null && matiere ? [{ matiere, date: c.date, chapitres: c.chapters.map((x) => x.title) }] : []
    }),
    chapitres,
    examen: examen ? { nom: examen.nom, jours: joursAvantExamen(examen, aujourdhui) } : null,
  }
}

export type LectureProfil = {
  profil: ProfilEleve
  /** Les fiches de la classe, pour reconnaître « fais-moi une fiche sur… ». */
  index: IndexFiches | null
}

export async function lireProfilPourMarcel(supabase: SupabaseClient, userId: string): Promise<LectureProfil | null> {
  try {
    const aujourdhui = toDayKey(new Date())
    const profilP = readRowTolerant<ProfilRow>(supabase, 'profiles', 'id', userId, [
      'grade_level',
      'daily_goal_minutes',
      'selected_subjects',
    ])
    const [profil, matieres, chapitresClasse, maitrise, { data: controleRows }, joursActifs] = await Promise.all([
      profilP,
      getSubjectsCached(),
      profilP.then((p) => (p?.grade_level ? getGradeChaptersCached(p.grade_level) : [])),
      getChapterMastery(supabase, userId),
      supabase
        .from('controles')
        .select('id, subject_slug, chapters, exam_date, grade, note, note_prompted, snooze_date')
        .eq('user_id', userId)
        .gte('exam_date', aujourdhui)
        .returns<ControleRow[]>(),
      fetchJoursActifs(supabase, userId),
    ])

    const choisies = Array.isArray(profil?.selected_subjects) ? (profil.selected_subjects as string[]) : []
    const suivies = choisies.length > 0 ? matieres.filter((m) => choisies.includes(m.id) || choisies.includes(m.slug)) : matieres
    const parId = new Map(suivies.map((m) => [m.id, m]))

    const chapitres: ChapitreProfil[] = []
    for (const c of chapitresClasse) {
      const m = parId.get(c.subject_id)
      if (!m) continue
      const p = maitrise.get(c.id)
      chapitres.push({ titre: c.title, matiere: m.name, etat: chapterState(p), valeur: p?.value ?? 0 })
    }

    // Les titres des chapitres d'un contrôle viennent du CATALOGUE, jamais de la
    // ligne : `controles.chapters` s'écrit par une RPC qu'un élève peut appeler
    // à la main, et ce texte part dans la consigne du modèle. Un chapitre
    // inconnu du programme de la classe est simplement ignoré.
    const titreOfficiel = new Map(chapitresClasse.map((c) => [c.id, c.title]))
    const controles = rowsToControles(controleRows ?? [], []).map((c) => ({
      ...c,
      chapters: c.chapters.flatMap((ch) => {
        const titre = titreOfficiel.get(ch.id)
        return titre ? [{ id: ch.id, title: titre }] : []
      }),
    }))

    const donnees = donneesProfil({
      classe: profil?.grade_level ?? null,
      objectifMinutes: profil?.daily_goal_minutes ?? null,
      serie: computeStreak(joursActifs, new Date()),
      controles,
      chapitres,
      matieres,
      aujourdhui,
    })

    return {
      profil: construireProfil(donnees),
      index: chapitresClasse.length > 0 ? construireIndex(suivies, chapitresClasse) : null,
    }
  } catch (err) {
    // Le profil n'est qu'un plus : sans lui, Marcel répond comme avant.
    console.error('[marcel] profil illisible :', err instanceof Error ? err.message : 'inconnu')
    return null
  }
}
