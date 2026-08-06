import Link from 'next/link'
import { CircleUser } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/PageHeader'
import WorldBackdrop from '@/components/WorldBackdrop'
import PanneauIdentite from '@/components/moi/PanneauIdentite'
import HistoriqueTravail from '@/components/moi/HistoriqueTravail'
import MatiereDuMomentCard from '@/components/moi/MatiereDuMomentCard'
import HabitudesCard, { type LeverState } from '@/components/moi/HabitudesCard'
import AjouterMoyennes from '@/components/moi/SaisieMoyennes'
import TrajectoryCard from '@/components/moi/TrajectoryCard'
import StandingLine from '@/components/StandingLine'
import { parseGradeStandings } from '@/lib/percentile'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { readRowTolerant } from '@/lib/profile-read'
import { isMissingSchemaObject } from '@/lib/schema-fallback'
import { toDayKey, activityCutoff, computeStreak } from '@/lib/streak'
import { getGradeChaptersCached, getSubjectsCached } from '@/lib/catalog'
import { getChapterMastery, chapterState } from '@/lib/mastery'
import { getChapitresVus } from '@/lib/chapitres-vus'
import { getReviewItems, countsBySubject, reviewQueue } from '@/lib/srs'
import { couvertureFor, type ChapitreCouvert } from '@/lib/coach/couverture'
import { matiereDuMoment } from '@/lib/moi/matiere-du-moment'
import { appliquerValidationsAuto } from '@/lib/moi/journal'
import {
  formatDuree,
  libelleCetteSemaine,
  phraseRythme,
  rythmeHebdo,
  JOURS_HISTORIQUE,
  type JourTravail,
} from '@/lib/moi/temps'
import { bilanMoyenne, formatMoyenne, phraseDelta } from '@/lib/moi/moyenne'
import { PLANIFIER_CATALOG_ID } from '@/lib/habits'
import {
  DRIVER_WINDOW_DAYS,
  LEVERS,
  computeCapacite,
  computeDriverScores,
  computePlafond,
} from '@/lib/capacite-drivers'
import { normalizeGradeList, trimestreOf, trimestreSummaries } from '@/lib/notes'
import {
  computeBacTrajectory,
  mergeTermAverages,
  normalizeTermGrades,
} from '@/lib/trajectoire-bac'
import { avatarDataUri, normalizeAvatarConfig } from '@/lib/avatar'
import { workLevel } from '@/lib/work-level'
import { bilanHabitudes, meilleureSerie } from '@/lib/moi/habitudes'
import { GRADE_LEVELS, type GradeLevel, type Subject } from '@/lib/types'
import type { Habit, HabitLog, CommuteSlot } from '@/lib/types'

export const metadata = { title: 'Moi — Studuel' }
export const dynamic = 'force-dynamic'

// Les colonnes du profil que cet écran affiche, toutes migrations confondues.
type MoiProfileRow = {
  full_name: string | null
  grade_level: string | null
  selected_subjects: unknown
  commute_slots: unknown
  capacity_quiz: unknown
  work_seconds: number | null
  avatar: unknown
}

// Libellés des classes pour la pill d'identité (le slug court sinon).
const GRADE_LABELS: Partial<Record<GradeLevel, string>> = {
  '2de': 'Seconde',
  '1re': 'Première',
  Tle: 'Terminale',
}

// Fenêtre du journal de travail : la plus large des portées de l'historique
// (un an). Les lignes de `work_daily` sont deux colonnes et n'existent que les
// jours travaillés — une année tient dans quelques kilo-octets, et le sélecteur
// de période change alors de lunette SANS aller-retour serveur.

// -----------------------------------------------------------------------------
// L'ONGLET MOI — le miroir, en un seul scroll.
//
// CE QUI A CHANGÉ, ET POURQUOI (refonte du 2026-08-06).
//
// 1. PLUS D'ONGLET DANS L'ONGLET. « Ma progression » / « Mes habitudes »
//    cachaient la moitié de l'écran derrière un clic que personne ne faisait.
//    Tout tient dans un scroll ; le détail des habitudes a sa page (/moi/habitudes).
//
// 2. LA CAPACITÉ N'OUVRE PLUS L'ÉCRAN. « Capacité 8 · plafond 95 » avec trois
//    drivers à 0 % était la première chose qu'un élève lisait sur l'onglet qui
//    porte son nom : une note basse, sur une échelle qu'il ne pouvait relier à
//    rien de ce qu'il avait fait. Le calcul est INTACT — il nourrit toujours la
//    trajectoire au bac — mais son affichage a déménagé auprès des habitudes qui
//    le produisent.
//
// 3. CE QUE L'ÉLÈVE A FAIT EST ENFIN À L'ÉCRAN. Sa série, son temps de travail
//    cumulé, sa moyenne générale : les trois seuls chiffres qu'il reconnaît
//    comme siens, et dont deux ne redescendent jamais. Les données existaient
//    toutes (`work_seconds` 014, `work_daily` 084, `school_grades` 167).
//
// 4. L'ÉCRAN DÉSIGNE UNE MATIÈRE. Pas un tableau — celui de Marcel existe déjà.
//    Un nom, une raison en faits, un bouton.
//
// 5. LA TRAJECTOIRE NE BLOQUE PLUS RIEN. Elle ne s'affiche que s'il y a des
//    notes ; sinon la saisie vit dans la tuile « moyenne », à côté de deux
//    preuves déjà pleines.
//
// PERFORMANCE. Deux vagues, pas plus : le profil ne peut pas attendre (le
// niveau conditionne la lecture du programme), tout le reste part avec lui.
// -----------------------------------------------------------------------------
export default async function MoiPage() {
  const supabase = await createClient()
  const user = await getCurrentUser()

  if (!user) {
    return (
      <div>
        <PageHeader
          title="Moi"
          description="Ton travail, tes chiffres, tes habitudes."
        />
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CircleUser className="size-4" /> Connecte-toi pour voir ton
              miroir
            </CardTitle>
            <CardDescription>
              Ta série, ton temps de travail, ta moyenne et les habitudes qui
              les font monter.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link href="/login">Se connecter</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const today = toDayKey(new Date())
  const depuisDrivers = new Date()
  depuisDrivers.setUTCDate(depuisDrivers.getUTCDate() - (DRIVER_WINDOW_DAYS - 1))
  const depuisRythme = new Date()
  depuisRythme.setUTCDate(depuisRythme.getUTCDate() - (JOURS_HISTORIQUE - 1))

  const [
    profile,
    { data: habits },
    { data: tests },
    { data: studies },
    { data: lessonsDone },
    { data: challenges },
    { data: gradeRows },
    { data: termRows, error: termError },
    { data: storedLogs },
    { data: workDays, error: workError },
    { data: standingsRow },
    subjects,
    mastery,
    chapitresVus,
    reviewItems,
  ] = await Promise.all([
    readRowTolerant<MoiProfileRow>(supabase, 'profiles', 'id', user.id, [
      'full_name',
      'grade_level',
      'selected_subjects',
      'commute_slots',
      'capacity_quiz',
      // work_seconds (014), avatar (082) : `readRowTolerant` retire tout seul
      // les colonnes que le schéma ne connaîtrait pas encore.
      'work_seconds',
      'avatar',
    ]),
    supabase
      .from('habits')
      .select('id, catalog_id, target, created_at, habit_catalog(*)')
      .order('created_at', { ascending: true })
      .returns<Habit[]>(),
    supabase
      .from('test_sessions')
      .select('created_at')
      .eq('user_id', user.id)
      .gte('created_at', activityCutoff()),
    supabase
      .from('study_sessions')
      .select('created_at')
      .eq('user_id', user.id)
      .gte('created_at', activityCutoff()),
    supabase
      .from('lesson_completions')
      .select('created_at')
      .eq('user_id', user.id)
      .gte('created_at', activityCutoff()),
    supabase
      .from('challenge_sessions')
      .select('created_at')
      .eq('user_id', user.id)
      .gte('created_at', activityCutoff()),
    supabase
      .from('school_grades')
      .select('id, subject, label, score, out_of, coefficient, date')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(300),
    // termError → saisie masquée si la 187 n'est pas passée.
    supabase
      .from('term_grades')
      .select('school_year, term, average')
      .eq('user_id', user.id),
    supabase
      .from('habit_logs')
      .select('id, habit_id, date, completed, auto_validated')
      .gte('date', toDayKey(depuisDrivers))
      .returns<HabitLog[]>(),
    // Le journal quotidien du temps de travail (084). Absent tant que la
    // migration n'est pas passée : le graphique de rythme reste alors plat, le
    // CUMUL (work_seconds, 014) continue de s'afficher.
    supabase
      .from('work_daily')
      .select('day, seconds')
      .eq('user_id', user.id)
      .gte('day', toDayKey(depuisRythme))
      .returns<JourTravail[]>(),
    // Place de l'élève dans sa cohorte (223) : RPC SECURITY DEFINER, jamais une
    // jointure — la RLS de `profiles` ne laisserait voir que sa propre ligne.
    supabase.rpc('my_grade_standings'),
    // --- Ce qu'il faut pour DÉSIGNER une matière -------------------------------
    // Le catalogue est en cache serveur (identique pour tous), la maîtrise et
    // les chapitres déclarés sont personnels. Aucun de ces quatre n'a besoin du
    // niveau : ils partent donc dans la même vague que le reste.
    getSubjectsCached(),
    getChapterMastery(supabase, user.id),
    getChapitresVus(supabase, user.id),
    getReviewItems(supabase, user.id),
    // Mission fixe pour tous : « Planifier ma semaine ». Idempotente, et son
    // résultat ne sert à personne — d'où sa place EN DERNIER, hors du
    // déstructurage.
    //
    // Elle était jusqu'ici glissée AVANT la RPC de classement, alors que le
    // déstructurage ne comptait pas de nom pour elle : `standingsRow` recevait
    // donc le retour (vide) de l'upsert, et le vrai classement partait à la
    // poubelle. La ligne « Tu travailles plus que 96 % des Terminale » ne
    // pouvait pas s'afficher sur cet onglet — silencieusement, puisque
    // `parseGradeStandings` avale ce qu'elle ne comprend pas.
    supabase.from('habits').upsert(
      { user_id: user.id, catalog_id: PLANIFIER_CATALOG_ID, target: {} },
      { onConflict: 'user_id,catalog_id', ignoreDuplicates: true },
    ),
  ])

  const grade = profile?.grade_level ?? null
  // Seule lecture qui ne pouvait pas partir avec les autres : elle a besoin du
  // niveau. Mise en cache serveur (5 min, partagée par toute la classe), donc
  // cette seconde vague ne coûte presque jamais un aller-retour réseau.
  const levelChapters = grade ? await getGradeChaptersCached(grade) : []

  const commuteSlots: CommuteSlot[] = Array.isArray(profile?.commute_slots)
    ? (profile.commute_slots as CommuteSlot[])
    : []

  const activeHabits = habits ?? []
  const logs = appliquerValidationsAuto(supabase, user.id, {
    habits: activeHabits,
    storedLogs: storedLogs ?? [],
    commuteSlots,
    activite: {
      tests: tests ?? [],
      studies: studies ?? [],
      lessons: lessonsDone ?? [],
      challenges: challenges ?? [],
    },
    today,
  })

  // --- Preuve n°1 : la série -----------------------------------------------
  // Calculée depuis les mêmes journées d'activité que Marcel et le bandeau du
  // haut (lib/streak), à partir de listes DÉJÀ chargées : aucune requête de plus.
  const joursActifs = new Set(
    [
      ...(tests ?? []),
      ...(studies ?? []),
      ...(lessonsDone ?? []),
      ...(challenges ?? []),
    ].map((row) => String(row.created_at).slice(0, 10)),
  )
  const serie = computeStreak(joursActifs)
  const record = meilleureSerie(joursActifs)

  // --- Preuve n°2 : le temps de travail ------------------------------------
  // Le CUMUL vient de `profiles.work_seconds` (014) ; le RYTHME du journal
  // quotidien `work_daily` (084). Si cette dernière n'est pas exécutée, on ne
  // dessine PAS un graphique plat : il annoncerait « tu n'as pas encore
  // travaillé » à un élève assidu, alors que le cumul à côté dit le contraire.
  // Mieux vaut une carte absente qu'une carte qui ment (cf. lib/sante.ts, le
  // mode de panne n°1 du projet est l'échec silencieux).
  const secondesTotal = Number(profile?.work_seconds ?? 0) || 0
  const rythmeDisponible = !isMissingSchemaObject(workError)
  const semaines = rythmeHebdo(workDays ?? [], today)

  // --- Preuve n°3 : la moyenne ---------------------------------------------
  const schoolGrades = normalizeGradeList(gradeRows ?? [])
  const summaries = trimestreSummaries(schoolGrades, today)
  const schoolYear = trimestreOf(today)?.year ?? new Date().getUTCFullYear()
  const manualTerms = normalizeTermGrades(termRows ?? [], schoolYear)
  const terms = mergeTermAverages(summaries, manualTerms)
  const moyenne = bilanMoyenne(terms)

  // --- Capacité : plus affichée ici, mais elle nourrit la trajectoire --------
  const quiz = profile?.capacity_quiz as { score?: unknown } | null
  const quizScore =
    typeof quiz?.score === 'number' ? Math.round(quiz.score) : null
  const drivers = computeDriverScores(activeHabits, logs, today)
  const capacite = computeCapacite(drivers, quizScore)
  const plafond = computePlafond(drivers, capacite)
  const trajectory = computeBacTrajectory(terms, capacite, plafond)

  // --- La matière du moment -------------------------------------------------
  // Mêmes règles que Réviser et Marcel, à la lettre : matières suivies, puis
  // chapitres du niveau, puis la définition unique du pourcentage.
  const selected = Array.isArray(profile?.selected_subjects)
    ? (profile.selected_subjects as string[])
    : []
  const suivies: Subject[] =
    selected.length > 0
      ? subjects.filter((s) => selected.includes(s.id) || selected.includes(s.slug))
      : subjects
  const parId = new Map(suivies.map((s) => [s.id, s]))

  const chapitresCouverts: ChapitreCouvert[] = []
  for (const chapitre of levelChapters) {
    const matiere = parId.get(chapitre.subject_id)
    if (!matiere) continue
    const progress = mastery.get(chapitre.id)
    chapitresCouverts.push({
      chapterId: chapitre.id,
      chapterTitle: chapitre.title,
      subjectSlug: matiere.slug,
      subjectName: matiere.name,
      state: chapterState(progress),
      value: progress?.value ?? 0,
      vuEnCours: chapitresVus.has(chapitre.id),
    })
  }
  const cartesParMatiere = countsBySubject(reviewQueue(reviewItems, today))
  const cible = matiereDuMoment(couvertureFor(chapitresCouverts), cartesParMatiere)

  // --- Les leviers du jour --------------------------------------------------
  const habitByCatalog = new Map(activeHabits.map((h) => [h.catalog_id, h.id]))
  const faitAujourdhui = new Set(
    logs.filter((l) => l.completed && l.date === today).map((l) => l.habit_id),
  )
  const levers: LeverState[] = LEVERS.map((l) => {
    const habitId = habitByCatalog.get(l.catalogId)
    return {
      catalogId: l.catalogId,
      label: l.label,
      driverKey: l.driverKey,
      doneToday: habitId !== undefined && faitAujourdhui.has(habitId),
    }
  })

  // --- Le résumé des habitudes ---------------------------------------------
  // Aucune requête de plus : `activeHabits` et `logs` sont déjà en main.
  const bilans = bilanHabitudes(
    activeHabits.map((h) => ({
      id: h.id,
      catalogId: h.catalog_id,
      titre: h.habit_catalog?.title ?? 'Habitude',
      icone: h.habit_catalog?.icon ?? '✅',
      raison: h.habit_catalog?.rationale ?? '',
    })),
    logs,
    today,
  )

  // --- Identité -------------------------------------------------------------
  const firstName = String(profile?.full_name ?? '').split(' ')[0] || 'Élève'
  const gradeLevel: GradeLevel | null = GRADE_LEVELS.includes(
    grade as GradeLevel,
  )
    ? (grade as GradeLevel)
    : null
  const gradeLabel = gradeLevel ? (GRADE_LABELS[gradeLevel] ?? gradeLevel) : null
  const level = workLevel(secondesTotal)
  const standings = parseGradeStandings(standingsRow)
  const avatarConfig = normalizeAvatarConfig(profile?.avatar)

  return (
    <div>
      <WorldBackdrop className="moi-bg" />

      {/* LE RYTHME DE LA PAGE. Les blocs ne sont plus séparés par un écart
          unique : le panneau et la carte du rythme se touchent presque (même
          sujet — moi, mon travail), la bande « matière » prend beaucoup d'air
          avant elle parce qu'elle est le geste de l'écran, et la trajectoire
          reprend l'écart courant. Un espacement constant entre six blocs, c'est
          une liste ; un espacement qui varie, c'est une lecture. */}
      <div className="flex flex-col">
        <PanneauIdentite
          titre="Moi"
          sousTitre="Ton travail, tes chiffres, tes habitudes."
          name={firstName}
          gradeLabel={gradeLabel}
          avatarUri={avatarDataUri(avatarConfig, 240)}
          equipment={avatarConfig.equipment}
          level={level}
          // « Tu travailles plus que 96 % des 3e ». Sur cet onglet la mesure est
          // l'ASSIDUITÉ et pas les trophées : /moi est le miroir du travail
          // fourni, pas de la compétition.
          standing={
            <StandingLine
              standing={standings.assiduite}
              grade={standings.grade ?? gradeLevel}
              className="text-white/90"
            />
          }
          serie={serie}
          record={record}
          temps={formatDuree(secondesTotal)}
          tempsTendance={libelleCetteSemaine(semaines)}
          moyenne={formatMoyenne(moyenne)}
          moyenneTendance={phraseDelta(moyenne)}
          saisieMoyenne={
            <AjouterMoyennes terms={terms} disabled={Boolean(termError)} />
          }
        />

        {rythmeDisponible ? (
          <div className="mt-5">
            <HistoriqueTravail
              jours={workDays ?? []}
              today={today}
              phrase={phraseRythme(semaines)}
            />
          </div>
        ) : null}

        {/* Sans chapitre commencé, on n'invente pas de cible — et on ne pose pas
            non plus un bloc vide pour le dire : la bande disparaît. */}
        {cible ? (
          <div className="mt-9">
            <MatiereDuMomentCard matiere={cible} />
          </div>
        ) : null}

        <div className="mt-9">
          <HabitudesCard levers={levers} today={today} bilans={bilans} />
        </div>

        {/* La trajectoire ne s'affiche QUE s'il y a de quoi projeter. Sans
            notes, elle occupait un tiers de l'écran pour demander une saisie —
            ce bouton vit maintenant dans le panneau, à la place du chiffre. */}
        {trajectory.hasData ? (
          <div className="mt-5">
            <TrajectoryCard
              trajectory={trajectory}
              needsMigration={Boolean(termError)}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
