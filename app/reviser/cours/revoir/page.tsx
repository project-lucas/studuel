import { redirect } from 'next/navigation'
import ReviewSession, {
  type PlayableQuestion,
} from '@/components/carnet/ReviewSession'
import WorkTimer from '@/components/WorkTimer'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import {
  isQuestionReady,
  isQuestionType,
  normalizeQuestionContent,
} from '@/lib/carnet-cours'
import {
  composerFile,
  etatInitial,
  grainsDuJour,
} from '@/lib/carnet/planification'
import { chargerTousLesEtats } from '@/lib/carnet/etats-server'
import { toDayKey } from '@/lib/streak'

export const metadata = { title: 'À revoir — Studuel' }
export const dynamic = 'force-dynamic'

/**
 * La session « À revoir aujourd'hui » du carnet : les cartes dues de TOUS les
 * cours, en une seule file. C'est la cible du héros du carnet — l'app a choisi
 * la session, l'élève n'a qu'à jouer.
 *
 * Le plafond est ici GLOBAL (et non par cours) : c'est la file de toute la
 * journée, celle qui devient un mur quand on revient après deux semaines. Sans
 * borne, elle affiche trois cents cartes et l'élève referme l'app.
 */
export const PLAFOND_REVOIR = { nouvelles: 20, revisions: 120 }

export default async function CarnetRevoirPage() {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const nowIso = new Date().toISOString()

  const [{ data: questionRows }, etats] = await Promise.all([
    // La RLS limite déjà aux cours de l'élève ; borne large par sécurité.
    supabase
      .from('carnet_questions')
      .select('id, course_id, type, content')
      .limit(2_000),
    // Les états remplacent la relecture des 4 000 dernières tentatives : ce
    // qui est dû se LIT, il ne se recalcule plus à chaque affichage.
    chargerTousLesEtats(supabase, user.id, nowIso),
  ])

  // Questions jouables (brouillons exclus), avec leur contenu normalisé.
  const jouables = (questionRows ?? []).flatMap((r) => {
    if (!isQuestionType(r.type)) return []
    const content = normalizeQuestionContent(r.type, r.content)
    if (!isQuestionReady(r.type, content)) return []
    return [{ id: String(r.id), type: r.type, content }]
  })

  const ordre = composerFile(
    jouables.map((q) => ({
      id: q.id,
      state: etats.get(q.id) ?? etatInitial(nowIso),
    })),
    PLAFOND_REVOIR,
    nowIso,
    grainsDuJour(jouables.map((q) => q.id), toDayKey(new Date())),
  )

  const parId = new Map(jouables.map((q) => [q.id, q]))
  const queue: PlayableQuestion[] = ordre.flatMap((qid) => {
    const q = parId.get(qid)
    return q ? [{ id: q.id, type: q.type, content: q.content }] : []
  })

  return (
    <>
      {/* Réviser son carnet est du travail : le chrono compte ces minutes. */}
      <WorkTimer />
      <ReviewSession
        courseId={null}
        chapterId={null}
        courseTitle="Mon carnet"
        scopeLabel="À revoir aujourd’hui"
        questions={queue}
        backHref="/reviser?espace=carnet"
        backLabel="Retour au carnet"
      />
    </>
  )
}
