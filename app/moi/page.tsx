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
import CarteProfil from '@/components/moi/CarteProfil'
import Classement from '@/components/moi/Classement'
import Preuves from '@/components/moi/Preuves'
import TuileMoyenne from '@/components/moi/TuileMoyenne'
import Vitrine from '@/components/moi/Vitrine'
import RythmeBarres from '@/components/moi/RythmeBarres'
import TrajectoryCard from '@/components/moi/TrajectoryCard'
import { parseGradeStandings } from '@/lib/percentile'
import { axesSecondaires } from '@/lib/moi/classement'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { readRowTolerant } from '@/lib/profile-read'
import { isMissingSchemaObject } from '@/lib/schema-fallback'
import { toDayKey, activityCutoff, computeStreak } from '@/lib/streak'
import { getGradeChaptersCached, getSubjectsCached } from '@/lib/catalog'
import { chapterState } from '@/lib/mastery'
import { getChapterMastery } from '@/lib/mastery-server'
import { getChapitresVus } from '@/lib/chapitres-vus'
import { getProfileData } from '@/app/defi/profile-actions'
import {
  bilanCouronnes,
  couronnes,
  type MatiereACouronner,
} from '@/lib/moi/couronnes'
import { appliquerValidationsAuto } from '@/lib/moi/journal'
import {
  formatDuree,
  phraseRythme,
  rythmeHebdo,
  JOURS_HISTORIQUE,
  type JourTravail,
} from '@/lib/moi/temps'
import { bilanMoyenne } from '@/lib/moi/moyenne'
import { PLANIFIER_CATALOG_ID } from '@/lib/habits'
import {
  DRIVER_WINDOW_DAYS,
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
import { workLevel } from '@/lib/work-level'
import { meilleureSerie } from '@/lib/moi/habitudes'
import type { ChapitreProgression } from '@/lib/progression'
import { GRADE_LEVELS, type GradeLevel, type Subject } from '@/lib/types'
import { GRADE_FULL_LABELS } from '@/lib/grades'
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

// Libellés des classes pour la pastille d'identité. La table vivait ICI, ne
// couvrait que 2de/1re/Tle et retombait sur le slug pour le reste — « 6e »
// s'affichait tel quel, et « 1re techno » se serait affiché « 1re techno ».
// Une seule liste désormais, à côté des classes qu'elle nomme (lib/grades).

// -----------------------------------------------------------------------------
// L'ONGLET MOI — LA CARTE DE JOUEUR.
//
// CE QUI A CHANGÉ, ET POURQUOI (refonte du 2026-08-19).
//
// 1. L'ONGLET DEVIENT LE PROFIL. Son icône est le visage de l'élève, c'est le
//    seul onglet dont l'icône change d'un élève à l'autre — et il ne contenait
//    pas son profil. Bannière, badges, pseudo, école, blason de rang, stats de
//    duel : tout existait déjà, enfermé dans une modale de `/defi`. Une modale
//    n'a pas d'URL, pas de retour arrière, pas de partage ; personne n'y va
//    « pour voir ». Ça vit ici maintenant (`CarteProfil`), et `/compte` est
//    enfin accessible d'un geste, par l'engrenage de la carte.
//
// 2. UN SEUL NIVEAU. L'écran affichait « Assidu · niveau 5 » avec sa barre, à
//    trois centimètres du bandeau du haut qui affiche « Niveau 6 · 93 % » :
//    même mot, même forme, deux échelles sans rapport. Le rang de travail garde
//    son TITRE et perd son numéro.
//
// 3. LES COURONNES. Une par matière, du bronze au diamant, décernées sur les
//    chapitres RÉELLEMENT MAÎTRISÉS du programme de l'année
//    (`lib/moi/couronnes`, logique pure, aucune migration). C'est la seule vue
//    transversale de l'app : Réviser voit une matière à la fois, Marcel voit les
//    chapitres, l'arène voit les trophées — personne ne voyait l'élève.
//
// 4. « REPRENDS ANGLAIS » A ÉTÉ SUPPRIMÉ. Cette bande répondait à « par quoi je
//    commence ? », question que l'arène, Marcel et Réviser posent déjà chacun à
//    leur manière. Le profil répond à l'autre : « qu'est-ce que j'ai accompli ? »
//    La liste des couronnes prend sa place, et mène aux mêmes matières.
//
// 5. LES CHIFFRES SONT RÉUNIS. Les trois preuves (série, temps, moyenne) et les
//    stats d'arène (parties, victoires, trophées) étaient à deux écrans l'un de
//    l'autre. Un seul bloc, deux rangées : ce qui ne redescend jamais au-dessus,
//    ce qui se gagne et se perd en dessous.
//
// PERFORMANCE. Deux vagues, comme avant : le profil ne peut pas attendre (le
// niveau conditionne la lecture du programme), tout le reste part avec lui.
// `getProfileData` (la carte de joueur) rejoint la première vague ; la file SRS,
// qui ne servait qu'à désigner la matière du moment, a disparu avec elle.
//
// REFONTE DU 2026-09-03 (Lucas : « les blocs sont bas de gamme »). Cinq blocs,
// dans cet ordre, et pas un de plus :
//   1. LA CARTE DE JOUEUR, devenue un objet (violet radial, anneau d'or, trois
//      compteurs en verre, un reflet holographique à l'ouverture).
//   2. « TON CLASSEMENT » — le « top X % » passe de 11 px sous le pseudo à
//      46 px en tête de bloc, avec la foule animée ; les trois mesures réunies,
//      jamais fondues en une (lib/moi/classement, lib/percentile).
//   3. LES TROIS PREUVES en tuiles (série · temps · moyenne).
//   4. LA VITRINE DES COURONNES, la prochaine nommée et menée.
//   5. LE RYTHME en barres, l'objectif en pointillé.
// Ont quitté l'écran : la plaque de six chiffres (les stats d'arène ont
// l'arène), l'étagère et son ⋮, le diagramme d'effort en toile (et sa RPC
// `effort_by_subject` : une requête de moins), l'historique 30 jours (redit par
// le rythme). La trajectoire bac reste, seulement quand des notes existent.
// -----------------------------------------------------------------------------
export default async function MoiPage() {
  const supabase = await createClient()
  const user = await getCurrentUser()

  if (!user) {
    return (
      <div>
        <PageHeader
          title="Moi"
          description="Ton profil, tes couronnes, tes chiffres."
        />
        <Card className="mx-auto w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CircleUser className="size-4" /> Connecte-toi pour voir ton profil
            </CardTitle>
            <CardDescription>
              Ta carte de joueur, tes couronnes par matière, ta série, ton temps
              de travail et tes habitudes.
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
    profilJeu,
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
    // La carte de joueur : pseudo, bannière, badges, blason, école, stats de
    // duel. Une seule porte (la même que la modale de /defi utilisait) plutôt
    // que huit lectures recopiées ici — le jour où le profil gagne un champ,
    // les deux écrans l'ont.
    getProfileData(),
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
    // --- Ce qu'il faut pour DÉCERNER les couronnes ---------------------------
    // Le catalogue est en cache serveur (identique pour tous), la maîtrise et
    // les chapitres déclarés sont personnels. Aucun des trois n'a besoin du
    // niveau : ils partent donc dans la même vague que le reste.
    getSubjectsCached(),
    getChapterMastery(supabase, user.id),
    getChapitresVus(supabase, user.id),
    // Mission fixe pour tous : « Planifier ma semaine ». Idempotente, et son
    // résultat ne sert à personne — d'où sa place EN DERNIER, hors du
    // déstructurage.
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

  // --- Les couronnes --------------------------------------------------------
  // Mêmes règles de périmètre que Réviser et Marcel, à la lettre : matières
  // suivies, puis chapitres du niveau. Ce qui change, c'est le COMPTE : une
  // couronne se décerne sur les chapitres maîtrisés du programme ENTIER, quand
  // le pourcentage de Réviser porte sur les chapitres commencés (cf. le
  // commentaire d'en-tête de lib/moi/couronnes.ts).
  const selected = Array.isArray(profile?.selected_subjects)
    ? (profile.selected_subjects as string[])
    : []
  const suivies: Subject[] =
    selected.length > 0
      ? subjects.filter((s) => selected.includes(s.id) || selected.includes(s.slug))
      : subjects
  const parId = new Map(suivies.map((s) => [s.id, s]))

  const parMatiere = new Map<string, MatiereACouronner & { chapitres: ChapitreProgression[] }>()
  for (const chapitre of levelChapters) {
    const matiere = parId.get(chapitre.subject_id)
    if (!matiere) continue
    let entree = parMatiere.get(matiere.id)
    if (!entree) {
      entree = {
        subjectId: matiere.id,
        subjectSlug: matiere.slug,
        subjectName: matiere.name,
        chapitres: [],
      }
      parMatiere.set(matiere.id, entree)
    }
    const progress = mastery.get(chapitre.id)
    entree.chapitres.push({
      value: progress?.value ?? 0,
      state: chapterState(progress),
      vuEnCours: chapitresVus.has(chapitre.id),
    })
  }
  const listeCouronnes = couronnes([...parMatiere.values()])
  const bilan = bilanCouronnes(listeCouronnes)

  // ⚠️ LA CARTE « MES HABITUDES » A QUITTÉ CET ONGLET, et avec elle les deux
  // calculs qui ne servaient qu'à son affichage : les LEVIERS du jour (fait /
  // pas fait, par catalogue) et le BILAN par habitude. Ils ne coûtaient aucune
  // requête — `activeHabits` et `logs` sont lus de toute façon pour la
  // trajectoire — mais les garder aurait laissé du code mort à maintenir.
  //
  // Les habitudes elles-mêmes ne disparaissent pas : /moi/habitudes reste leur
  // écran, entier, et les mêmes `activeHabits` continuent d'alimenter les
  // moteurs de capacité et de plafond ci-dessus.

  // --- Identité -------------------------------------------------------------
  const gradeLevel: GradeLevel | null = GRADE_LEVELS.includes(
    grade as GradeLevel,
  )
    ? (grade as GradeLevel)
    : null
  const gradeLabel = gradeLevel ? GRADE_FULL_LABELS[gradeLevel] : null

  const level = workLevel(secondesTotal)
  const standings = parseGradeStandings(standingsRow)
  // Les deux autres mesures sous l'assiduité : l'arène et la meilleure matière.
  const axes = axesSecondaires(standings)
  const initiale = (profilJeu?.displayName ?? profile?.full_name ?? 'M')
    .trim()
    .charAt(0)
    .toUpperCase()

  return (
    <div>
      <WorldBackdrop className="tab-bg" />

      {/* CINQ BLOCS, UN SEUL ESPACEMENT : la carte (qui je suis), le classement
          (où je suis), les preuves (ce que j'ai fait), la vitrine (ce que j'ai
          gagné), le rythme (à quelle cadence). Chacun est un objet posé sur le
          crème, aucun n'est un titre suivi d'une liste. */}
      <div className="flex flex-col gap-4">
        {profilJeu ? (
          <CarteProfil
            data={{
              displayName: profilJeu.displayName,
              gamertag: profilJeu.gamertag,
              gradeLabel,
              schoolName: profilJeu.schoolName,
              avatar: profilJeu.avatar,
              profileBanner: profilJeu.profileBanner,
              availableBanners: profilJeu.availableBanners,
              rank: profilJeu.summary.rank,
              level: profilJeu.summary.level,
              badges: profilJeu.badges,
              equippedBadgeIds: profilJeu.equippedBadgeIds,
            }}
            workTitle={level.title}
            // Les trois compteurs en verre : ce que l'élève montre. La série
            // et le temps reviennent en tuiles dessous avec leur détail ; les
            // trophées n'ont que cette place ici — l'arène a le reste.
            compteurs={[
              { valeur: `${serie} j`, legende: 'série' },
              { valeur: formatDuree(secondesTotal), legende: 'de travail' },
              {
                valeur: profilJeu.summary.trophies.toLocaleString('fr-FR'),
                legende: 'trophées',
              },
            ]}
          />
        ) : null}

        {/* « Tu es dans le top 8 % des 5e ». Sur cet onglet la mesure en grand
            est l'ASSIDUITÉ : /moi est le miroir du travail fourni, l'arène a
            déjà le classement de la compétition — il passe ici en seconde
            ligne, avec la meilleure matière. */}
        <Classement
          principal={standings.assiduite}
          grade={standings.grade ?? gradeLevel}
          secondaires={axes}
          initiale={initiale}
        />

        <Preuves
          serie={serie}
          record={record}
          secondesTotal={secondesTotal}
          semaines={semaines}
          // LA TUILE DES NOTES, entière et cliente : la seule qui ouvre
          // quelque chose (la saisie des moyennes de trimestre).
          tuileMoyenne={
            <TuileMoyenne bilan={moyenne} terms={terms} disabled={Boolean(termError)} />
          }
        />

        <Vitrine liste={listeCouronnes} bilan={bilan} />

        {rythmeDisponible ? (
          <RythmeBarres semaines={semaines} phrase={phraseRythme(semaines)} />
        ) : null}

        {/* La trajectoire ne s'affiche QUE s'il y a de quoi projeter. Sans
            notes, elle occupait un tiers de l'écran pour demander une saisie —
            ce bouton vit dans la tuile des notes. */}
        {trajectory.hasData ? (
          <TrajectoryCard trajectory={trajectory} needsMigration={Boolean(termError)} />
        ) : null}
      </div>
    </div>
  )
}
