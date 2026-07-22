import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { normalizeAvatarConfig } from '@/lib/avatar'
import { fallbackCatalog, normalizeCatalog } from '@/lib/avatar-studio'
import { workLevel } from '@/lib/work-level'
import AvatarStudio from '@/components/avatar/AvatarStudio'

export const metadata = { title: 'Mon vestiaire — Studuel' }
export const dynamic = 'force-dynamic'

// Le vestiaire (/moi/avatar) : écran plein d'expression de l'élève, ouvert en
// tapant son avatar sur l'onglet Moi. Le serveur réclame d'abord les
// déblocages mérités (claim_avatar_unlocks évalue série/niveau/questions EN
// BASE), puis charge catalogue + possessions + profil. Si la migration 189
// n'est pas passée, tout dégrade proprement : catalogue de repli gratuit.
export default async function AvatarStudioPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Conditions remplies → items crédités AVANT la lecture des possessions.
  // RPC absente (189 pas passée) : on ignore, le repli gratuit prend le relais.
  await supabase.rpc('claim_avatar_unlocks')

  const [
    { data: profile },
    { data: statsRow },
    { data: avatarRow },
    { data: itemRows },
    { data: ownedRows },
  ] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle(),
    // work_seconds (014) + coins (018) : isolés, comme sur /moi.
    supabase
      .from('profiles')
      .select('work_seconds, coins')
      .eq('id', user.id)
      .maybeSingle(),
    supabase.from('profiles').select('avatar').eq('id', user.id).maybeSingle(),
    supabase
      .from('avatar_items')
      .select('id, category, name, asset_key, price, unlock_condition, rarity, sort'),
    supabase.from('user_avatar_items').select('item_id').eq('user_id', user.id),
  ])

  const dbCatalog = normalizeCatalog(itemRows)
  const catalog = dbCatalog.length > 0 ? dbCatalog : fallbackCatalog()
  const ownedIds = (ownedRows ?? []).map((r) => String(r.item_id))

  const firstName = String(profile?.full_name ?? '').split(' ')[0] || 'Élève'
  const level = workLevel(Number(statsRow?.work_seconds ?? 0) || 0)
  const coins = Number(statsRow?.coins ?? 0) || 0
  const config = normalizeAvatarConfig(avatarRow?.avatar)

  return (
    <AvatarStudio
      initialConfig={config}
      catalog={catalog}
      initialOwnedIds={ownedIds}
      initialCoins={coins}
      name={firstName}
      levelLabel={`Niveau ${level.level} · ${level.title}`}
    />
  )
}
