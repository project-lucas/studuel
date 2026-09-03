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
import CouronnesMatieres from '@/components/moi/CouronnesMatieres'
import CouronnesRangee from '@/components/moi/CouronnesRangee'
import MesChiffres from '@/components/moi/MesChiffres'
import HistoriqueTravail from '@/components/moi/HistoriqueTravail'
import TuileMoyenne from '@/components/moi/TuileMoyenne'
import TrajectoryCard from '@/components/moi/TrajectoryCard'
import EffortParMatiere from '@/components/moi/EffortParMatiere'
import StandingLine from '@/components/StandingLine'
import { parseGradeStandings } from '@/lib/percentile'
import { buildEffort } from '@/lib/effort'
import { weightsForGrade } from '@/lib/exam-weights'
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
  libelleCetteSemaine,
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

/**
 * FENÊTRE DU DIAGRAMME D'EFFORT, en jours.
 *
 * Trente, et pas le cumul depuis l'inscription : un total « depuis toujours »
 * ment sur le présent. Un élève qui a bachoté les maths en septembre passerait
 * pour un matheux jusqu'en juin, alors que le diagramme est là pour dire ce
 * qu'il fait EN CE MOMENT — c'est la seule lecture sur laquelle il peut agir.
 */
const EFFORT_JOURS = 30

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
    { data: effortRows, error: effortError },
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
    // L'EFFORT PAR MATIÈRE (325) : l'agrégat descend en base, comme la maîtrise
    // (321). `test_sessions` est la table qui grossit le plus vite du projet —
    // en lire les lignes pour n'en tirer qu'une somme par matière la ferait
    // transférer entière à chaque ouverture de /moi.
    //
    // TOLÉRÉE, et l'erreur est GARDÉE : tant que la 325 n'est pas exécutée,
    // PostgREST répond « function does not exist », et la carte disparaît au
    // lieu d'annoncer « tu n'as rien travaillé » à un élève assidu. C'est le
    // mode de panne n°1 du projet (cf. lib/sante.ts) : mieux vaut une carte
    // absente qu'une carte qui ment.
    supabase.rpc('effort_by_subject', { p_days: EFFORT_JOURS }),
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

  // --- Preuve n°4 : OÙ va le travail ---------------------------------------
  // Le diagramme ne dit pas « combien » (la carte de joueur le fait déjà) mais
  // « au bon endroit ou non ». Il compare, ligne par ligne, la part de travail
  // reçue par une matière au poids qu'elle a à l'épreuve — l'écart entre les
  // deux est tout son propos (cf. lib/effort.ts).
  //
  // La carte disparaît si la 325 n'est pas passée : `effortError` porte alors
  // « function does not exist », et un diagramme à zéro contredirait le cumul
  // affiché juste au-dessus.
  const effortDisponible = !isMissingSchemaObject(effortError)
  const matieresDuDiagramme =
    selected.length > 0
      ? suivies
      : suivies.filter((s) => s.levels.includes(profile?.grade_level ?? ''))


  // LA MOYENNE PAR MATIÈRE, sur 20, pondérée par les coefficients saisis. C'est
  // la troisième dimension du diagramme, et celle qui lui donne son tranchant :
  // le travail dit un CHOIX, la moyenne dit un BESOIN. Les notes sont déjà
  // lues plus haut pour la moyenne générale (`schoolGrades`) — aucune requête
  // de plus, seulement un regroupement par slug.
  const parMoyenne = new Map<string, { points: number; coef: number }>()
  for (const g of schoolGrades) {
    if (!(g.outOf > 0) || !(g.coefficient > 0)) continue
    const cumul = parMoyenne.get(g.subject) ?? { points: 0, coef: 0 }
    // Ramené sur 20 : un contrôle sur 40 et une interro sur 10 ne se moyennent
    // pas tels quels.
    cumul.points += (g.score / g.outOf) * 20 * g.coefficient
    cumul.coef += g.coefficient
    parMoyenne.set(g.subject, cumul)
  }
  const moyennesParMatiere: Record<string, number | null> = {}
  for (const [slug, { points, coef }] of parMoyenne) {
    if (coef > 0) moyennesParMatiere[slug] = points / coef
  }

  const effort = buildEffort({
    // ⚠️ La RPC nomme sa colonne `subject_slug`, pas `slug` — lire `r.slug`
    // rendait `undefined`, et le diagramme affichait une matière nommée
    // « undefined ». Le mapping se fait ICI, une fois.
    effort: (
      (effortRows ?? []) as {
        subject_slug: string
        questions: number
        lessons: number
      }[]
    ).map((r) => ({
      slug: String(r.subject_slug),
      questions: Number(r.questions) || 0,
      lessons: Number(r.lessons) || 0,
    })),
    // TOUTES SES MATIÈRES ONT UNE BRANCHE, travaillées ou non — une matière
    // qu'il suit sans jamais l'ouvrir est ce que la toile doit lui montrer.
    //
    // Le périmètre est BORNÉ ici, et il doit l'être : `suivies` vaut le
    // catalogue ENTIER quand l'élève n'a coché aucune matière à l'onboarding
    // (une trentaine), ce qui dessinerait une toile illisible dont presque
    // toutes les branches seraient à zéro. Sans choix explicite, on retombe
    // donc sur les matières de SA CLASSE.
    subjects: matieresDuDiagramme.map((s) => ({ slug: s.slug, name: s.name })),
    // Les poids viennent du NIVEAU, et les spécialités des matières suivies :
    // en terminale, c'est le profil de l'élève qui dit laquelle pèse 16.
    weights: weightsForGrade(profile?.grade_level ?? '', suivies),
    moyennes: moyennesParMatiere,
  })
  const level = workLevel(secondesTotal)
  const standings = parseGradeStandings(standingsRow)

  return (
    <div>
      <WorldBackdrop className="tab-bg" />

      {/* LE RYTHME DE LA PAGE. La carte porte tout ce qui dit QUI EST cet élève
          et CE QU'IL A GAGNÉ ; le rythme et les habitudes reprennent ensuite
          l'écart courant. Un espacement constant entre cinq blocs, c'est une
          liste ; un espacement qui varie, c'est une lecture.

          Il y a deux blocs de moins qu'avant : « Mes chiffres » a rejoint la
          carte en pied de celle-ci (components/moi/MesChiffres.tsx), et « Mes
          couronnes » s'est replié dans l'étagère de la carte, derrière le ⋮
          (components/moi/CouronnesRangee.tsx). */}
      <div className="flex flex-col">
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
            // L'étagère : un emplacement par matière suivie, vide tant que la
            // couronne n'est pas gagnée. Rendue ici (côté serveur) et passée en
            // nœud — la carte, elle, est un composant client. Elle porte
            // maintenant le DÉTAIL en enfant : le ⋮ au bout de la rangée le
            // déroule sur place, il n'y a plus de bloc « Mes couronnes » sous
            // la carte.
            couronnes={
              <CouronnesRangee liste={listeCouronnes} bilan={bilan}>
                <CouronnesMatieres liste={listeCouronnes} bilan={bilan} />
              </CouronnesRangee>
            }
            // « Tu travailles plus que 96 % des 3e ». Sur cet onglet la mesure
            // est l'ASSIDUITÉ et pas les trophées : /moi est le miroir du
            // travail fourni, l'arène a déjà le classement de la compétition.
            standing={
              <StandingLine
                standing={standings.assiduite}
                grade={standings.grade ?? gradeLevel}
                className="text-white/90"
              />
            }
            // LE PIED DE LA CARTE. « Mes chiffres » n'est plus une section :
            // il est devenu la plaque de statistiques de la carte de joueur.
            // Passé en nœud (et non importé par la carte) pour qu'il reste
            // rendu côté serveur — il n'a aucun état client.
            chiffres={
              <MesChiffres
                serie={serie}
                record={record}
                temps={formatDuree(secondesTotal)}
                tempsTendance={libelleCetteSemaine(semaines)}
                // LA TUILE DES NOTES, entière et cliente : c'est la seule
                // cellule du bloc qui ouvre quelque chose (la saisie des
                // moyennes de trimestre), et la seule qui change de nature
                // selon qu'une moyenne est connue ou non.
                tuileMoyenne={
                  <TuileMoyenne
                    bilan={moyenne}
                    terms={terms}
                    disabled={Boolean(termError)}
                  />
                }
                arene={{
                  duels: profilJeu.summary.gamesPlayed,
                  victoires:
                    profilJeu.summary.gamesPlayed > 0
                      ? profilJeu.summary.winRateLabel
                      : null,
                  trophees: profilJeu.summary.trophies,
                  recordTrophees: profilJeu.summary.bestTrophies,
                  meilleureSerie: profilJeu.summary.bestStreak,
                }}
              />
            }
          />
        ) : null}

        {/* OÙ VA LE TRAVAIL — juste après la carte, et AVANT le rythme.
            L'ordre est le raisonnement : la carte dit ce que l'élève a gagné,
            ce bloc dit s'il le gagne au bon endroit, le rythme dit à quelle
            cadence. Le « où » avant le « quand » : c'est sur le premier qu'il
            peut agir dès aujourd'hui. */}
        {effortDisponible ? (
          <div className="mt-7">
            <EffortParMatiere diagram={effort} jours={EFFORT_JOURS} />
          </div>
        ) : null}

        {rythmeDisponible ? (
          <div className="mt-7">
            <HistoriqueTravail
              jours={workDays ?? []}
              today={today}
              phrase={phraseRythme(semaines)}
            />
          </div>
        ) : null}

        {/* La trajectoire ne s'affiche QUE s'il y a de quoi projeter. Sans
            notes, elle occupait un tiers de l'écran pour demander une saisie —
            ce bouton vit maintenant dans le bloc des chiffres. */}
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
