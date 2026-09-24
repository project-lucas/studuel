import Link from 'next/link'
import { after } from 'next/server'
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
import EcranMoi from '@/components/moi/EcranMoi'
import { fetchMyPalmares } from '@/lib/palmares/palmares-server'
import { parseGradeStandings } from '@/lib/percentile'
import { standingNational } from '@/lib/moi/classement'
import { normalizeRanking } from '@/lib/clan'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { readRowTolerant } from '@/lib/profile-read'
import { isPremiumTier } from '@/lib/gems'
import type { Tier } from '@/lib/subscription'
import { isMissingSchemaObject } from '@/lib/schema-fallback'
import { toDayKey, computeStreak } from '@/lib/streak'
import { fetchJoursActifs } from '@/lib/jours-actifs'
import {
  getGradeChaptersCached,
  getLessonChapterPairsCached,
  getQuizLessonPairsCached,
  getSubjectsCached,
} from '@/lib/catalog'
import { matieresRevisees } from '@/lib/moi/matieres-revisees'
import { lireRevisionsParQuiz } from '@/lib/moi/matieres-revisees-server'
import { chapterState } from '@/lib/mastery'
import { getChapterMastery } from '@/lib/mastery-server'
import { getChapitresVus } from '@/lib/chapitres-vus'
import { getProfileData } from '@/app/defi/profile-actions'
import { fetchGems } from '@/lib/gems-access'
import { lireGelsSerie } from '@/lib/boutique/boosts-server'
import {
  bilanCouronnes,
  couronnes,
  type MatiereACouronner,
} from '@/lib/moi/couronnes'
import { appliquerValidationsAuto, lireActiviteDuJour } from '@/lib/moi/journal'
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
import type { ChapitreProgression } from '@/lib/progression'
import { GRADE_LEVELS, type GradeLevel, type Subject } from '@/lib/types'
import { GRADE_FULL_LABELS } from '@/lib/grades'
import type { Habit, HabitLog, CommuteSlot } from '@/lib/types'


// Les colonnes du profil que cet écran affiche, toutes migrations confondues.
type MoiProfileRow = {
  full_name: string | null
  grade_level: string | null
  selected_subjects: unknown
  commute_slots: unknown
  capacity_quiz: unknown
  work_seconds: number | null
  avatar: unknown
  subscription_tier: string | null
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
//      46 px en tête de bloc, avec la foule animée ; deux filtres (temps de
//      travail, trophées en national), jamais fondus en un chiffre
//      (lib/moi/classement, lib/percentile).
//   3. LES TROIS PREUVES en tuiles (série · temps · moyenne).
//   4. LA VITRINE DES COURONNES, la prochaine nommée et menée.
//   5. LE RYTHME en barres, l'objectif en pointillé.
// Ont quitté l'écran : la plaque de six chiffres (les stats d'arène ont
// l'arène), l'étagère et son ⋮, le diagramme d'effort en toile (et sa RPC
// `effort_by_subject` : une requête de moins), l'historique 30 jours (redit par
// le rythme). La trajectoire bac reste, seulement quand des notes existent.
//
// REFONTE DU 2026-09-17 (Lucas : « on s'y perd, c'est désagréable »). Sous
// une carte compactée, TROIS ONGLETS collés en haut — Progrès · Collection ·
// Palmarès — au lieu de six blocs empilés ; les badges ont leur étagère, les
// jeux par matière sont repliés. La mise en page vit dans
// components/moi/EcranMoi ; cette page ne fait que lire et calculer.
// -----------------------------------------------------------------------------
/**
 * L'ONGLET MOI, construit dès l'ouverture de l'app et gardé vivant,
 * comme les écrans de Clash Royale : il est rendu par la mise en page racine
 * (`app/layout.tsx`, via `components/OngletsVivants`), jamais par une page —
 * `app/moi/page.tsx` ne porte que le titre. Voir `lib/nav-tabs`
 * (`ongletVivant`) et `docs/latence.md`.
 */
export default async function OngletMoi() {
  const [supabase, user] = await Promise.all([createClient(), getCurrentUser()])

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

  // UNE VAGUE (19/09/2026, chantier latence). Ce qui dépend d'une autre
  // lecture y est CHAÎNÉ au lieu d'attendre toute la vague :
  //   · le programme du niveau part dès que le profil arrive (cache serveur) ;
  //   · les sessions du JOUR ne sont lues qu'une fois les habitudes connues, et
  //     seulement si l'une d'elles se coche toute seule aujourd'hui.
  // La série vient de `jours_actifs()` (une RPC, au plus 400 dates) : avant,
  // quatre tables d'activité étaient lues sur 400 jours à chaque ouverture.
  // La place dans le niveau (`my_grade_standings`) n'est plus demandée deux
  // fois : la carte de joueur la rapporte déjà.
  const profileP = readRowTolerant<MoiProfileRow>(supabase, 'profiles', 'id', user.id, [
    'full_name',
    'grade_level',
    'selected_subjects',
    'commute_slots',
    'capacity_quiz',
    // work_seconds (014), avatar (082) : `readRowTolerant` retire tout seul
    // les colonnes que le schéma ne connaîtrait pas encore.
    'work_seconds',
    'avatar',
    // L'avatar dessiné par Marcel est réservé à Studuel+ (migration 378).
    'subscription_tier',
  ])
  const habitsP = supabase
    .from('habits')
    .select('id, catalog_id, target, created_at, habit_catalog(*)')
    .order('created_at', { ascending: true })
    .returns<Habit[]>()
    .then(({ data }) => data ?? [])

  const [
    profile,
    profilJeu,
    activeHabits,
    activiteDuJour,
    joursActifs,
    levelChapters,
    { data: gradeRows },
    { data: termRows, error: termError },
    { data: storedLogs },
    { data: workDays, error: workError },
    { data: nationalRow },
    palmaresLignes,
    subjects,
    mastery,
    chapitresVus,
    revisions,
    quizLeconPaires,
    leconChapitrePaires,
    gems,
    gelsSerie,
  ] = await Promise.all([
    profileP,
    // La carte de joueur : pseudo, bannière, badges, blason, école, stats de
    // duel. Une seule porte (la même que la modale de /defi utilisait) plutôt
    // que huit lectures recopiées ici — le jour où le profil gagne un champ,
    // les deux écrans l'ont.
    getProfileData(),
    habitsP,
    habitsP.then((habits) => lireActiviteDuJour(supabase, user.id, habits, today)),
    fetchJoursActifs(supabase, user.id),
    // Le programme du niveau : cache serveur (5 min, partagé par toute la
    // classe), lancé dès que le profil donne la classe.
    profileP.then((p) => (p?.grade_level ? getGradeChaptersCached(p.grade_level) : [])),
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
    // Ma place NATIONALE aux trophées (166) : le même classement que l'arène
    // (Défi → Classements). Le filtre « Trophées » du bloc Ton classement.
    supabase.rpc('national_ranking'),
    // Mon palmarès des modes de l'Arène (352) : records, places de la semaine.
    // Tolérant : vide tant que la migration dort ou que rien n'a été joué.
    fetchMyPalmares(supabase),
    // --- Ce qu'il faut pour DÉCERNER les couronnes ---------------------------
    // Le catalogue est en cache serveur (identique pour tous), la maîtrise et
    // les chapitres déclarés sont personnels. Aucun des trois n'a besoin du
    // niveau : ils partent donc dans la même vague que le reste.
    getSubjectsCached(),
    getChapterMastery(supabase, user.id),
    getChapitresVus(supabase, user.id),
    // Les matières que je révise le plus (381) : les questions travaillées par
    // quiz, et la charpente (en cache) qui rattache chaque quiz à sa matière.
    lireRevisionsParQuiz(supabase, user.id),
    getQuizLessonPairsCached(),
    getLessonChapterPairsCached(),
    // Les gemmes, dans leur lecture tolérante (lib/gems-access) : la carte
    // porte désormais les deux monnaies en haut à droite, là où le bandeau les
    // met sur les autres onglets — cet onglet n'a pas de bandeau.
    fetchGems(supabase, user.id),
    // Les gels de série achetés en boutique (368) : les jours qu'ils ont
    // pontés comptent dans la flamme, comme dans le bandeau du haut.
    lireGelsSerie(supabase, user.id),
  ])

  // Mission fixe pour tous : « Planifier ma semaine ». Idempotente, et son
  // résultat ne sert à personne : écrite APRÈS la réponse, l'élève ne l'attend
  // plus.
  after(async () => {
    const { error } = await supabase.from('habits').upsert(
      { user_id: user.id, catalog_id: PLANIFIER_CATALOG_ID, target: {} },
      { onConflict: 'user_id,catalog_id', ignoreDuplicates: true },
    )
    if (error) console.error('[moi] mission « Planifier » non posée :', error.message)
  })

  const grade = profile?.grade_level ?? null

  const commuteSlots: CommuteSlot[] = Array.isArray(profile?.commute_slots)
    ? (profile.commute_slots as CommuteSlot[])
    : []

  const logs = appliquerValidationsAuto(supabase, user.id, {
    habits: activeHabits,
    storedLogs: storedLogs ?? [],
    commuteSlots,
    activite: activiteDuJour,
    today,
  })

  // --- Preuve n°1 : la série -----------------------------------------------
  // Les mêmes journées d'activité que Réviser, Marcel et le bandeau du haut
  // (`jours_actifs()`, carnet compris).
  const serie = computeStreak(joursActifs, new Date(), gelsSerie)

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

  // --- Les matières révisées ------------------------------------------------
  // Même périmètre que les couronnes : les chapitres du niveau, dans les
  // matières suivies.
  const matieres = matieresRevisees({
    revisions,
    quizLecon: new Map(quizLeconPaires),
    leconChapitre: new Map(leconChapitrePaires),
    chapitreMatiere: new Map(
      levelChapters.flatMap((c) => (parId.has(c.subject_id) ? [[c.id, c.subject_id] as [string, string]] : [])),
    ),
    matieres: suivies,
  })
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
  const standings = profilJeu?.standings ?? parseGradeStandings(null)
  // Le filtre « Trophées » : ma place nationale, pas celle de mon niveau.
  const nationalTrophees = standingNational(
    nationalRow ? normalizeRanking(nationalRow) : null,
    profilJeu?.summary.trophies ?? 0,
  )
  const initiale = (profilJeu?.displayName ?? profile?.full_name ?? 'M')
    .trim()
    .charAt(0)
    .toUpperCase()

  return (
    <div>
      {/* LA CARTE, puis TROIS ONGLETS (Progrès · Collection · Palmarès) —
          refonte du 17/09/2026, détaillée dans components/moi/EcranMoi. */}
      <EcranMoi
        carte={
          profilJeu
            ? {
                data: {
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
                },
                workTitle: level.title,
                gemmes: gems,
                abonne: isPremiumTier((profile?.subscription_tier ?? 'free') as Tier),
                // Les pastilles en verre — ce qui ne redescend jamais (série,
                // temps) et ce que l'arène a donné (trophées).
                compteurs: [
                  { valeur: `${serie} j`, legende: 'série' },
                  {
                    valeur: secondesTotal > 0 ? formatDuree(secondesTotal) : '0 min',
                    legende: 'travail',
                  },
                  {
                    valeur: profilJeu.summary.trophies.toLocaleString('fr-FR'),
                    legende: 'trophées',
                  },
                ],
              }
            : null
        }
        notes={{ bilan: moyenne, terms, indisponible: Boolean(termError) }}
        classement={{
          mesures: { travail: standings.assiduite, trophees: nationalTrophees },
          grade: standings.grade ?? gradeLevel,
          initiale,
        }}
        palmares={{
          lignes: palmaresLignes,
          duels: profilJeu
            ? {
                played: profilJeu.summary.gamesPlayed,
                wins: profilJeu.summary.wins,
                trophies: profilJeu.summary.trophies,
                bestTrophies: profilJeu.summary.bestTrophies,
              }
            : null,
        }}
        couronnes={{ liste: listeCouronnes, bilan }}
        matieres={matieres}
        rythme={
          rythmeDisponible
            ? { semaines, phrase: phraseRythme(semaines) }
            : null
        }
        // La trajectoire ne s'affiche QUE s'il y a de quoi projeter : sans
        // notes, le bouton d'ajout vit dans la tuile des notes.
        trajectoire={
          trajectory.hasData
            ? { trajectory, needsMigration: Boolean(termError) }
            : null
        }
      />
    </div>
  )
}
