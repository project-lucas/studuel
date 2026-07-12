'use client'

import { useState } from 'react'
import { Gift, Lock, Check, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  type ShopItem,
  type CollectItem,
  type ChestReward,
  type Rarity,
  drawChestReward,
  RARITY_LABEL,
} from '@/lib/tresor'
import { openDailyChest, buyShopItem } from '@/app/tresor/actions'

// Couleurs de rareté — élément de jeu, une teinte par palier.
const RARITY_STYLE: Record<Rarity, string> = {
  commune: 'ring-foreground/10 text-muted-foreground',
  rare: 'ring-primary/40 text-primary',
  épique: 'ring-violet-400/50 text-violet-500 dark:text-violet-400',
  légendaire: 'ring-highlight/60 text-highlight',
}

// ------------------------------------------------------------- Coffre du jour
function DailyChest({
  alreadyOpened,
  onOpen,
}: {
  alreadyOpened: boolean
  onOpen: () => Promise<ChestReward | null>
}) {
  const [phase, setPhase] = useState<'closed' | 'opening' | 'opened' | 'done'>(
    alreadyOpened ? 'done' : 'closed',
  )
  const [reward, setReward] = useState<ChestReward | null>(null)

  const open = async () => {
    if (phase !== 'closed') return
    setPhase('opening')
    sfx.flip()
    // Le tirage (serveur) et le suspense (700 ms) courent en parallèle.
    const [r] = await Promise.all([
      onOpen(),
      new Promise((resolve) => setTimeout(resolve, 700)),
    ])
    if (!r) {
      setPhase('done') // déjà ouvert (autre onglet) ou indisponible
      return
    }
    setReward(r)
    setPhase('opened')
    sfx.treasure()
  }

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-5 text-center text-primary-foreground shadow-sm">
      <div className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(circle_at_50%_0,white,transparent_60%)]" />
      <p className="font-heading relative text-sm font-bold tracking-wide uppercase text-primary-foreground/80">
        Coffre du jour
      </p>

      {phase === 'opened' && reward ? (
        <div className="relative flex flex-col items-center gap-2 py-2">
          <span className="animate-in zoom-in text-6xl duration-500">
            {reward.emoji}
          </span>
          <p className="font-heading text-xl font-bold">{reward.label}</p>
          <p className="text-sm text-primary-foreground/75">
            Reviens demain pour le prochain 🎁
          </p>
        </div>
      ) : phase === 'done' ? (
        <div className="relative flex flex-col items-center gap-2 py-2">
          <span className="text-6xl" aria-hidden="true">
            ✨
          </span>
          <p className="font-heading text-lg font-bold">
            Coffre du jour déjà ouvert
          </p>
          <p className="text-sm text-primary-foreground/75">
            Reviens demain pour le prochain 🎁
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={open}
          disabled={phase === 'opening'}
          aria-label="Ouvrir le coffre du jour"
          className="relative flex w-full flex-col items-center gap-2 py-2"
        >
          <span
            className={cn(
              'text-6xl transition-transform',
              phase === 'closed' && 'chest-wobble hover:scale-105',
              phase === 'opening' && 'animate-bounce',
            )}
          >
            🎁
          </span>
          <span className="font-heading text-lg font-bold">
            {phase === 'opening' ? 'Ouverture…' : 'Touche pour ouvrir'}
          </span>
          <span className="text-xs text-primary-foreground/70">
            Une récompense t’attend, chaque jour.
          </span>
        </button>
      )}
    </section>
  )
}

// -------------------------------------------------------------------- Boutique
function ShopCard({
  item,
  coins,
  onBuy,
}: {
  item: ShopItem
  coins: number
  onBuy: (item: ShopItem) => void
}) {
  const affordable = coins >= item.price
  return (
    <div className="flex flex-col rounded-2xl bg-card p-3 ring-1 ring-foreground/10">
      <div className="mb-2 flex items-start gap-2">
        <span className="text-3xl" aria-hidden="true">
          {item.emoji}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold">{item.name}</p>
          <p className="text-xs leading-snug text-muted-foreground">
            {item.desc}
          </p>
        </div>
      </div>
      {item.owned ? (
        <Button
          size="sm"
          variant="outline"
          disabled
          className="mt-auto rounded-full"
        >
          <Check className="size-4" /> Obtenu
        </Button>
      ) : (
        <Button
          size="sm"
          variant={affordable ? 'default' : 'outline'}
          disabled={!affordable}
          className="mt-auto rounded-full"
          onClick={() => onBuy(item)}
        >
          <span className="font-mono font-bold tabular-nums">🪙 {item.price}</span>
        </Button>
      )}
    </div>
  )
}

// ------------------------------------------------------------------ Collection
function CollectionGrid({ items }: { items: CollectItem[] }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map((c) => (
        <div
          key={c.id}
          title={c.unlocked ? `${c.name} · ${RARITY_LABEL[c.rarity]}` : 'À débloquer'}
          className={cn(
            'flex aspect-square flex-col items-center justify-center gap-0.5 rounded-2xl bg-card p-1 text-center ring-1',
            c.unlocked ? RARITY_STYLE[c.rarity] : 'ring-foreground/10',
          )}
        >
          {c.unlocked ? (
            <>
              <span className="text-2xl" aria-hidden="true">
                {c.emoji}
              </span>
              <span className="w-full truncate text-[10px] font-semibold text-foreground">
                {c.name}
              </span>
            </>
          ) : (
            <Lock className="size-5 text-muted-foreground/40" aria-label="À débloquer" />
          )}
        </div>
      ))}
    </div>
  )
}

// ------------------------------------------------------------------------ Page
// live = connecté et branché Supabase ; sinon, démo locale (visiteur).
export default function TresorHome({
  live,
  initialCoins,
  shop,
  collection,
  chestOpened,
}: {
  live: boolean
  initialCoins: number
  shop: ShopItem[]
  collection: CollectItem[]
  chestOpened: boolean
}) {
  const [coins, setCoins] = useState(initialCoins)
  const [items, setItems] = useState(shop)
  const [cards, setCards] = useState(collection)
  const [flash, setFlash] = useState(false)

  const setBalance = (next: number) => {
    setCoins(next)
    setFlash(true)
    setTimeout(() => setFlash(false), 600)
  }

  const markOwned = (itemId: string) =>
    setItems((list) =>
      list.map((i) => (i.id === itemId ? { ...i, owned: true } : i)),
    )

  // Ouverture du coffre : tirage serveur en mode live, local en démo.
  const openChest = async (): Promise<ChestReward | null> => {
    if (!live) {
      const r = drawChestReward()
      if (r.kind === 'coins') setBalance(coins + r.amount)
      return r
    }
    const res = await openDailyChest().catch(() => null)
    if (!res || !res.opened || !res.reward) return null
    setBalance(res.coins)
    const itemId = res.reward.kind === 'sticker' ? res.reward.itemId : undefined
    if (itemId) {
      setCards((list) =>
        list.map((c) => (c.id === itemId ? { ...c, unlocked: true } : c)),
      )
    }
    return res.reward
  }

  const onBuy = async (item: ShopItem) => {
    if (coins < item.price) return
    sfx.coin()
    if (!live) {
      setBalance(coins - item.price)
      markOwned(item.id)
      return
    }
    const res = await buyShopItem(item.id).catch(() => null)
    if (res?.bought) {
      setBalance(res.coins)
      markOwned(item.id)
    }
  }

  const unlockedCount = cards.filter((c) => c.unlocked).length

  return (
    <div className="flex flex-col gap-6">
      {/* Solde de pièces. */}
      <section className="flex items-center justify-between rounded-2xl bg-card p-4 ring-1 ring-foreground/10">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">
            🪙
          </span>
          <div>
            <p
              className={cn(
                'font-heading text-2xl font-bold tabular-nums transition-colors',
                flash && 'text-highlight',
              )}
            >
              {coins}
            </p>
            <p className="text-xs text-muted-foreground">pièces</p>
          </div>
        </div>
        <p className="max-w-40 text-right text-xs text-muted-foreground">
          {live
            ? 'Gagne des pièces en ouvrant ton coffre chaque jour.'
            : 'Aperçu — connecte-toi pour ton vrai trésor.'}
        </p>
      </section>

      <DailyChest alreadyOpened={chestOpened} onOpen={openChest} />

      {/* Boutique. */}
      <section>
        <h2 className="font-heading mb-2 flex items-center gap-2 text-sm font-bold tracking-wide text-muted-foreground uppercase">
          <Sparkles className="size-4 text-primary" strokeWidth={2.4} /> Boutique
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {items.map((item) => (
            <ShopCard key={item.id} item={item} coins={coins} onBuy={onBuy} />
          ))}
        </div>
      </section>

      {/* Collection. */}
      <section>
        <h2 className="font-heading mb-2 flex items-center justify-between text-sm font-bold tracking-wide text-muted-foreground uppercase">
          <span className="flex items-center gap-2">
            <Gift className="size-4 text-primary" strokeWidth={2.4} /> Collection
          </span>
          <span className="font-mono text-xs tabular-nums text-foreground">
            {unlockedCount}/{cards.length}
          </span>
        </h2>
        <CollectionGrid items={cards} />
        <p className="mt-2 px-1 text-[11px] text-muted-foreground">
          Débloque des cartes de savants en ouvrant des coffres, jour après
          jour.
        </p>
      </section>
    </div>
  )
}
