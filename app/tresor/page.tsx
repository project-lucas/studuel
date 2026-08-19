import TabHeader from '@/components/TabHeader'
import TresorSpaces from '@/components/TresorSpaces'
import PremiumHome from '@/components/PremiumHome'
import TresorHome from '@/components/TresorHome'
import CapsulesShelf from '@/components/CapsulesShelf'
import RankShowcase from '@/components/tresor/RankShowcase'
import {
  buildSubjectLadders,
  type SubjectLadder,
} from '@/lib/subject-rank'
import { getSubjectPeaks } from '@/lib/subject-rank-server'
import { unlockedSubjectSlugs } from '@/lib/subject-unlock'
import { getChapterMastery } from '@/lib/mastery'
import { getGradeChaptersCached, getSubjectsCached } from '@/lib/catalog'
import { buildRoster } from '@/lib/defi/roster'
import type { GameTrophyRow } from '@/lib/trophy-road'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { getUserTier } from '@/lib/subscription'
import { toDayKey } from '@/lib/streak'
import { fetchGems } from '@/lib/gems-access'
import { STARTING_GEMS } from '@/lib/gems'
import {
  getMockShop,
  getMockCollection,
  shopWithOwnership,
  collectionWithUnlocks,
  MOCK_COINS,
} from '@/lib/tresor'

export const metadata = { title: 'Boutique — Studuel' }
export const dynamic = 'force-dynamic'

// L'onglet Boutique fusionne les deux économies, chacune dans son volet :
// « Objets » = les PIÈCES uniquement (coffre du jour en tête, rayons de
// boosts, compagnons & collection, fonds & skins), « Studuel+ » = les EUROS
// (capsules vidéo du coach en tête, puis les abonnements). Connecté : données
// réelles (018_tresor.sql). Visiteur — ou migration pas encore passée — : démo.
export default async function TresorPage() {
  const supabase = await createClient()
  const user = await getCurrentUser()

  let live = false
  let coins = MOCK_COINS
  let gems = STARTING_GEMS
  let shop = getMockShop()
  let collection = getMockCollection()
  let chestOpened = false
  // LA VITRINE DE RANG : tous les blasons de l'élève, matière par matière.
  // Vide pour le visiteur — il n'a pas de rangs à exposer.
  let ladders: SubjectLadder[] = []

  // L'abonnement se résout en parallèle des données boutique (attendu en bas).
  const tierPromise = getUserTier()

  if (user) {
    const [
      { data: profile, error },
      { data: purchases },
      { data: unlocks },
      { data: chest },
      gemsBalance,
      gameTrophyRes,
      subjectPeaks,
      quizMastery,
      gradeRes,
      catalogSubjects,
    ] = await Promise.all([
      supabase.from('profiles').select('coins').eq('id', user.id).maybeSingle(),
      supabase.from('shop_purchases').select('item_id').eq('user_id', user.id),
      supabase
        .from('collection_unlocks')
        .select('item_id')
        .eq('user_id', user.id),
      supabase
        .from('chest_opens')
        .select('date')
        .eq('user_id', user.id)
        .eq('date', toDayKey(new Date()))
        .maybeSingle(),
      // Gemmes (migration 183) : le helper a son propre repli.
      fetchGems(supabase, user.id),
      // LA VITRINE DE RANG. Quatre lectures de plus, toutes dans LA MÊME vague
      // que la boutique : elles ne dépendent d'aucune des autres, les
      // enchaîner aurait ajouté un aller-retour au chargement de l'onglet.
      // Deux d'entre elles sont servies par le cache serveur (donc gratuites).
      supabase
        .from('game_trophies')
        .select('subject_slug, game_id, trophies')
        .eq('user_id', user.id),
      getSubjectPeaks(supabase, user.id),
      getChapterMastery(supabase, user.id),
      supabase
        .from('profiles')
        .select('grade_level')
        .eq('id', user.id)
        .maybeSingle(),
      getSubjectsCached(),
    ])

    gems = gemsBalance

    // Les compteurs par (matière × jeu), revalidés : tant que la 238 n'est pas
    // passée, `data` est null et la vitrine s'affiche à zéro plutôt que de
    // disparaître — on montre ce qu'il y a à gagner.
    const trophyRows: GameTrophyRow[] = (
      Array.isArray(gameTrophyRes?.data) ? gameTrophyRes.data : []
    ).flatMap((row) => {
      const subject = row?.subject_slug
      const gameId = row?.game_id
      const value = Number(row?.trophies)
      if (!subject || !gameId || !Number.isFinite(value)) return []
      return [{ subject: String(subject), gameId: String(gameId), trophies: value }]
    })

    const grade = gradeRes?.data?.grade_level ?? null
    const gradeChapters = grade ? await getGradeChaptersCached(grade) : []
    const slugBySubjectId = new Map(catalogSubjects.map((s) => [s.id, s.slug]))

    ladders = buildSubjectLadders({
      // Le roster est LA liste des matières qui portent des trophées : la
      // vitrine et l'arène doivent proposer exactement les mêmes, sinon une
      // matière apparaîtrait ici sans avoir de porte pour aller la jouer.
      subjects: buildRoster(new Map()).map((entry) => ({
        subject: entry.subject,
        slug: entry.slug,
        emoji: entry.emoji,
      })),
      rows: trophyRows,
      peaks: subjectPeaks,
      unlockedSlugs: unlockedSubjectSlugs(
        quizMastery,
        gradeChapters.flatMap((chapter) => {
          const slug = slugBySubjectId.get(chapter.subject_id)
          return slug ? [{ chapterId: chapter.id, subjectSlug: slug }] : []
        }),
      ),
    })
    if (error) {
      // Migration 018 pas encore exécutée : la page reste visitable en démo.
      console.error('[tresor] données indisponibles (migration 018 ?):', error.message)
    } else {
      live = true
      const n = Number(profile?.coins)
      coins = Number.isFinite(n) ? n : 0
      shop = shopWithOwnership(
        new Set((purchases ?? []).map((p) => String(p.item_id))),
      )
      collection = collectionWithUnlocks(
        new Set((unlocks ?? []).map((u) => String(u.item_id))),
      )
      chestOpened = Boolean(chest)
    }
  }

  const tier = await tierPromise

  return (
    <div>
      <TabHeader
        title="Boutique"
        subtitle="Ton coffre du jour, tes pièces, et tout ce qu’elles ouvrent."
      />
      <TresorSpaces
        boutique={
          <div className="flex flex-col gap-8">
            <TresorHome
              live={live}
              initialCoins={coins}
              gems={gems}
              shop={shop}
              collection={collection}
              chestOpened={chestOpened}
            />
            {/* Les rangs sous les objets, et pas au-dessus : l'onglet reste une
                boutique. La vitrine est là parce que c'est déjà l'écran où l'on
                regarde ce qu'on possède — un rang par matière en fait partie. */}
            <RankShowcase ladders={ladders} />
          </div>
        }
        premium={
          <div className="flex flex-col gap-8">
            {/* Les capsules du coach passent DEVANT les cartes d'abonnement :
                on montre ce qu'on achète avant de montrer ce que ça coûte.
                Une page qui s'ouvre sur trois tarifs demande de décider ; une
                page qui s'ouvre sur le contenu donne d'abord envie. */}
            <CapsulesShelf />
            <PremiumHome currentTier={tier} />
          </div>
        }
      />
    </div>
  )
}
