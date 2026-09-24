import JaugeCapacite from '@/components/moi/JaugeCapacite'
import CatalogueHabitudes, {
  type LigneHabitude,
} from '@/components/moi/CatalogueHabitudes'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { readRowTolerant } from '@/lib/profile-read'
import { toDayKey } from '@/lib/streak'
import { PLANIFIER_CATALOG_ID } from '@/lib/habits'
import { appliquerValidationsAuto, lireActiviteDuJour } from '@/lib/moi/journal'
import {
  DRIVER_WINDOW_DAYS,
  computeCapacite,
  computeDriverScores,
  computePlafond,
} from '@/lib/capacite-drivers'
import {
  bilanHabitudes,
  verdictHabitudes,
  FENETRE_JOURS,
} from '@/lib/moi/habitudes'
import type { CommuteSlot, Habit, HabitLog } from '@/lib/types'
import EnTetePage from '@/components/reviser/EnTetePage'

export const metadata = { title: 'Mes habitudes — Studuel' }
export const dynamic = 'force-dynamic'

type ProfilRow = {
  commute_slots: unknown
  capacity_quiz: unknown
}

type CatalogRow = {
  id: string
  title: string
  icon: string
  rationale: string
}

// -----------------------------------------------------------------------------
// /moi/habitudes — LA PAGE QUI SENSIBILISE.
//
// L'onglet Moi montre l'état des habitudes ; c'est ICI qu'on en change. Trois
// choses n'existaient nulle part dans l'app avant cette page :
//
// 1. LE CATALOGUE. Seize habitudes vivent en base (migrations 010, 012, 187) et
//    l'élève ne pouvait en activer que quatre — celles de la rangée de leviers,
//    activées à la volée par un tap. Les douze autres (sport, lecture profonde,
//    téléphone hors de la chambre, cartable la veille…) étaient inatteignables.
//
// 2. LE « POURQUOI ». Chaque habitude porte son argument scientifique dans
//    `habit_catalog.rationale`, écrit à la main, et il n'était affiché sur aucun
//    écran. C'est pourtant lui qui fait changer un comportement — pas la case.
//
// 3. LA CAPACITÉ, à sa place. Elle ouvrait l'onglet Moi en annonçant « 8 » sur
//    « 95 possible ». Ici, entourée des habitudes qui la produisent, elle
//    redevient un cadran de réglage.
//
// La fenêtre des logs couvre le plus large des deux besoins (28 jours pour la
// régularité, 14 pour les drivers) : une seule requête sert les deux.
// -----------------------------------------------------------------------------

const FENETRE_LOGS = Math.max(FENETRE_JOURS, DRIVER_WINDOW_DAYS)

export default async function HabitudesPage() {
  const [supabase, user] = await Promise.all([createClient(), getCurrentUser()])

  if (!user) {
    return (
      <div>
        <RetourHeader />
        <p className="text-sm text-muted-foreground">
          Connecte-toi pour choisir tes habitudes.
        </p>
      </div>
    )
  }

  const today = toDayKey(new Date())
  const depuis = new Date()
  depuis.setUTCDate(depuis.getUTCDate() - (FENETRE_LOGS - 1))

  // UNE SEULE VAGUE : le catalogue, les habitudes suivies et le journal
  // partent ensemble ; les sessions du JOUR suivent les habitudes, et ne sont
  // lues que si l'une d'elles se coche toute seule aujourd'hui (avant le
  // 19/09/2026 : quatre tables d'activité lues sur 400 jours).
  const habitsP = supabase
    .from('habits')
    .select('id, catalog_id, target, created_at, habit_catalog(*)')
    .order('created_at', { ascending: true })
    .returns<Habit[]>()
    .then(({ data }) => data ?? [])
  const [
    profil,
    { data: catalogue },
    activeHabits,
    { data: storedLogs },
    activiteDuJour,
  ] = await Promise.all([
    readRowTolerant<ProfilRow>(supabase, 'profiles', 'id', user.id, [
      'commute_slots',
      'capacity_quiz',
    ]),
    supabase
      .from('habit_catalog')
      .select('id, title, icon, rationale')
      .returns<CatalogRow[]>(),
    habitsP,
    supabase
      .from('habit_logs')
      .select('id, habit_id, date, completed, auto_validated')
      .gte('date', toDayKey(depuis))
      .returns<HabitLog[]>(),
    habitsP.then((habits) => lireActiviteDuJour(supabase, user.id, habits, today)),
  ])

  const commuteSlots: CommuteSlot[] = Array.isArray(profil?.commute_slots)
    ? (profil.commute_slots as CommuteSlot[])
    : []

  // Même validation automatique que sur /moi : sans elle, la révision du jour
  // s'afficherait cochée là-bas et vide ici, pour la même journée.
  const logs = appliquerValidationsAuto(supabase, user.id, {
    habits: activeHabits,
    storedLogs: storedLogs ?? [],
    commuteSlots,
    activite: activiteDuJour,
    today,
  })

  // --- Capacité : mêmes fonctions que l'onglet, à sa vraie place --------------
  const quiz = profil?.capacity_quiz as { score?: unknown } | null
  const quizScore =
    typeof quiz?.score === 'number' ? Math.round(quiz.score) : null
  const drivers = computeDriverScores(activeHabits, logs, today)
  const capacite = computeCapacite(drivers, quizScore)
  const plafond = computePlafond(drivers, capacite)

  // --- Le catalogue, augmenté de l'état de chaque habitude suivie -------------
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
  const bilanParHabitId = new Map(bilans.map((b) => [b.id, b]))
  const habitParCatalog = new Map(activeHabits.map((h) => [h.catalog_id, h]))

  const lignes: LigneHabitude[] = (catalogue ?? []).map((c) => {
    const habit = habitParCatalog.get(c.id)
    const bilan = habit ? bilanParHabitId.get(habit.id) : undefined
    return {
      catalogId: c.id,
      titre: c.title,
      icone: c.icon,
      raison: c.rationale,
      suivie: habit !== undefined,
      fixe: c.id === PLANIFIER_CATALOG_ID,
      aujourdhui: bilan?.aujourdhui ?? false,
      serie: bilan?.serie ?? 0,
      regularite: bilan?.regularite ?? 0,
      semaine: bilan?.semaine ?? Array<boolean>(7).fill(false),
      historique: bilan?.historique ?? Array<boolean>(FENETRE_JOURS).fill(false),
    }
  })
  // Les suivies d'abord (série la plus longue en tête), puis le catalogue dans
  // l'ordre de la base — qui est celui des migrations, donc stable.
  lignes.sort((a, b) => Number(b.suivie) - Number(a.suivie) || b.serie - a.serie)

  return (
    <div>
      <RetourHeader />

      <div className="flex flex-col gap-4">
        <JaugeCapacite
          capacite={capacite}
          plafond={plafond}
          drivers={drivers}
        />
        <CatalogueHabitudes
          lignes={lignes}
          today={today}
          jourAujourdhui={new Date(`${today}T00:00:00.000Z`).getUTCDay()}
          verdict={verdictHabitudes(bilans).phrase}
        />
      </div>
    </div>
  )
}

// L'en-tête de retour : la recette unique de l'app (EnTetePage, audit du
// 23/09/2026). Sa pastille pousse /moi quand il n'y a pas d'historique — arrivé
// depuis une notification, on ne sort donc pas de l'app.
function RetourHeader() {
  return (
    <EnTetePage
      retour={{ fallback: '/moi', label: 'Revenir à mon profil' }}
      titre="Mes habitudes"
      className="mb-3"
    />
  )
}
