'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Gift, Lock } from 'lucide-react'
import { CristalIcon, EcuIcon } from '@/components/ui/MonnaieIcon'
import CoinIcon from '@/components/ui/CoinIcon'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'
import {
  coinsManquants,
  issueAchat,
  messageAchat,
  prochainArticle,
} from '@/lib/tresor-achat'
import {
  type ShopItem,
  type CollectItem,
  type ChestReward,
  type Rarity,
  drawChestReward,
  RARITY_LABEL,
} from '@/lib/tresor'
import { PERSO_CATALOG } from '@/lib/coffre'
import { GEM_COST_CHAPTER } from '@/lib/gems'
import { openDailyChest, buyShopItem } from '@/app/tresor/actions'
import { CHEST_OPENED_EVENT } from '@/components/NavChestBadge'

// Couleurs de rareté — élément de jeu, une teinte par palier.
const RARITY_STYLE: Record<Rarity, string> = {
  commune: 'ring-foreground/10 text-muted-foreground',
  rare: 'ring-primary/40 text-primary',
  épique: 'ring-violet-400/50 text-violet-500 dark:text-violet-400',
  légendaire: 'ring-highlight/60 text-highlight',
}

// Issue d'une ouverture : la récompense, « déjà ouvert aujourd'hui », ou panne.
type ChestOutcome =
  | { status: 'opened'; reward: ChestReward }
  | { status: 'already' }
  | { status: 'error' }

// ------------------------------------------------------------- Coffre du jour
// LE bloc de tête de la Boutique : la raison de revenir chaque jour passe
// AVANT les rayons — prêt → gros CTA jaune ; déjà ouvert → rendez-vous demain.
function DailyChest({
  alreadyOpened,
  onOpen,
}: {
  alreadyOpened: boolean
  onOpen: () => Promise<ChestOutcome>
}) {
  const [phase, setPhase] = useState<'closed' | 'opening' | 'opened' | 'done'>(
    alreadyOpened ? 'done' : 'closed',
  )
  const [reward, setReward] = useState<ChestReward | null>(null)
  const [failed, setFailed] = useState(false)

  const open = async () => {
    if (phase !== 'closed') return
    setFailed(false)
    setPhase('opening')
    sfx.flip()
    // Le tirage (serveur) et le suspense (700 ms) courent en parallèle.
    const [outcome] = await Promise.all([
      onOpen(),
      new Promise((resolve) => setTimeout(resolve, 700)),
    ])
    if (outcome.status === 'already') {
      setPhase('done') // déjà ouvert aujourd'hui (autre onglet)
      window.dispatchEvent(new Event(CHEST_OPENED_EVENT))
      return
    }
    if (outcome.status === 'error') {
      // Panne réseau/serveur : on ne prétend pas « déjà ouvert », on réarme.
      setFailed(true)
      setPhase('closed')
      return
    }
    setReward(outcome.reward)
    setPhase('opened')
    sfx.treasure()
    window.dispatchEvent(new Event(CHEST_OPENED_EVENT))
  }

  return (
    <section
      aria-label="Coffre du jour"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-[color-mix(in_oklch,var(--primary),black_25%)] p-5 text-center text-primary-foreground shadow-sm"
    >
      <div className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(circle_at_50%_0,white,transparent_60%)]" />

      {phase === 'opened' && reward ? (
        <div className="relative flex flex-col items-center gap-1.5 py-2">
          <span className="animate-in zoom-in text-6xl duration-500">
            {reward.emoji}
          </span>
          <p className="font-heading text-xl font-extrabold">{reward.label}</p>
          <p className="text-sm text-primary-foreground/75">
            Reviens demain pour le prochain 🎁
          </p>
        </div>
      ) : phase === 'done' ? (
        <div className="relative flex flex-col items-center gap-1.5 py-2">
          <span className="text-6xl" aria-hidden="true">
            ✨
          </span>
          <p className="font-heading text-lg font-extrabold">
            Coffre du jour déjà ouvert
          </p>
          <p className="text-sm text-primary-foreground/75">
            Le prochain t’attend demain matin 🎁
          </p>
        </div>
      ) : (
        <div className="relative flex flex-col items-center gap-1">
          <span
            className={cn(
              'text-6xl transition-transform',
              phase === 'closed' && 'chest-wobble',
              phase === 'opening' && 'animate-bounce',
            )}
            aria-hidden="true"
          >
            🎁
          </span>
          <p className="font-heading text-xl leading-tight font-extrabold">
            Ton coffre du jour est prêt !
          </p>
          <p className="text-xs text-primary-foreground/75">
            {failed
              ? 'Petit souci — réessaie dans un instant.'
              : 'Pièces garanties · surprise possible'}
          </p>
          <button
            type="button"
            onClick={open}
            disabled={phase === 'opening'}
            className="font-heading mt-2.5 w-full cursor-pointer rounded-full bg-highlight px-4 py-3 text-base font-extrabold text-foreground shadow-[0_4px_0_color-mix(in_oklch,var(--highlight),black_25%)] transition active:translate-y-px active:shadow-none disabled:opacity-70"
          >
            {phase === 'opening' ? 'Ouverture…' : 'Ouvrir le coffre'}
          </button>
        </div>
      )}
    </section>
  )
}

// -------------------------------------------------------------------- Rayons
// L'en-tête d'un rayon : petite étiquette majuscule + aparté optionnel.
function ShelfTitle({
  children,
  aside,
}: {
  children: React.ReactNode
  aside?: React.ReactNode
}) {
  return (
    <div className="flex items-end justify-between px-1">
      <h2 className="font-heading text-xs font-extrabold tracking-widest text-muted-foreground uppercase">
        {children}
      </h2>
      {aside}
    </div>
  )
}

// Une carte de rayon : l'article en vignette verticale, prix TOUJOURS visible.
//
// L'EFFET est affiché sous le nom. Il existait depuis toujours dans le
// catalogue (`ShopItem.desc`, lib/tresor) mais n'était rendu nulle part : la
// carte disait « Gel de série · 120 » et laissait un élève de 4e deviner ce
// qu'il achetait. Un prix sans promesse ne se compare à rien, et rien ne se
// vendait. `min-h` sur les deux lignes de texte pour que les cartes d'un même
// rayon gardent leur bouton aligné, quelle que soit la longueur du libellé.
function ShelfCard({
  item,
  coins,
  onBuy,
}: {
  item: ShopItem
  coins: number
  onBuy: (item: ShopItem) => void
}) {
  const affordable = coins >= item.price
  const manque = coinsManquants(coins, item.price)
  return (
    <div className="flex w-40 shrink-0 snap-start flex-col items-center rounded-2xl bg-card p-3 text-center ring-1 ring-foreground/10">
      <span className="text-3xl" aria-hidden="true">
        {item.emoji}
      </span>
      <p className="font-heading mt-1 line-clamp-2 min-h-8 text-xs leading-tight font-extrabold text-foreground">
        {item.name}
      </p>
      <p className="mt-0.5 line-clamp-3 min-h-11 text-[11px] leading-snug font-medium text-muted-foreground">
        {item.desc}
      </p>
      {item.owned ? (
        <span className="mt-2 flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 text-xs font-bold text-muted-foreground">
          <Check className="size-3.5" aria-hidden="true" /> Obtenu
        </span>
      ) : (
        <>
          <button
            type="button"
            disabled={!affordable}
            onClick={() => onBuy(item)}
            aria-label={
              affordable
                ? `Acheter ${item.name} pour ${item.price} pièces`
                : `${item.name} coûte ${item.price} pièces — il t’en manque ${manque}`
            }
            className={cn(
              'mt-2 flex items-center gap-1 rounded-full px-3 py-1.5 font-mono text-xs font-extrabold tabular-nums transition active:translate-y-px',
              affordable
                ? 'bg-primary/10 text-primary hover:bg-primary/15 cursor-pointer'
                : 'bg-muted text-muted-foreground/70',
            )}
          >
            <CoinIcon className="size-3.5" strokeWidth={2.2} /> {item.price}
          </button>
          {/* CE QUI MANQUE, écrit noir sur blanc. Un bouton gris désactivé ne
              dit rien : ni de combien on est loin, ni si on est loin. Le
              chiffre transforme un mur en objectif — et la ligne est TOUJOURS
              réservée (min-h) pour que les cartes d'un même rayon gardent la
              même hauteur. */}
          <span className="mt-1 min-h-3.5 text-[10px] leading-none font-bold text-muted-foreground/80">
            {affordable ? '' : `il t’en manque ${manque}`}
          </span>
        </>
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

// La vitrine : tes dernières cartes en grand + le « prochain » en pointillés —
// l'écran dit « voilà ce qui t'attend » au lieu d'aligner 23 cadenas gris.
function CollectionShowcase({ cards }: { cards: CollectItem[] }) {
  const [showAll, setShowAll] = useState(false)
  const unlocked = cards.filter((c) => c.unlocked)
  const nextLocked = cards.find((c) => !c.unlocked && !c.exclusive)
  const featured = unlocked.slice(-2)

  return (
    <section aria-label="Compagnons et collection" className="flex flex-col gap-2">
      <ShelfTitle
        aside={
          <button
            type="button"
            onClick={() => {
              sfx.tap()
              setShowAll((v) => !v)
            }}
            className="cursor-pointer text-xs font-bold text-primary"
          >
            {showAll ? 'Réduire ‹' : `Voir tout (${unlocked.length}/${cards.length}) ›`}
          </button>
        }
      >
        🐾 Compagnons & collection
      </ShelfTitle>

      {showAll ? (
        <CollectionGrid items={cards} />
      ) : (
        <div className="flex gap-2.5">
          {featured.length === 0 ? (
            <div className="flex flex-1 items-center gap-2 rounded-2xl bg-card px-3 py-4 ring-1 ring-foreground/10">
              <Gift className="size-4 shrink-0 text-primary" aria-hidden="true" />
              <p className="text-xs font-semibold text-muted-foreground">
                Ta première carte de savant sortira d’un coffre du jour.
              </p>
            </div>
          ) : (
            featured.map((c) => (
              <div
                key={c.id}
                className={cn(
                  'flex flex-1 flex-col items-center rounded-2xl bg-card px-2 py-3 text-center ring-1',
                  RARITY_STYLE[c.rarity],
                )}
              >
                <span className="text-3xl" aria-hidden="true">
                  {c.emoji}
                </span>
                <span className="mt-1 w-full truncate text-[11px] font-bold text-foreground">
                  {c.name}
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground">
                  à toi · {RARITY_LABEL[c.rarity]}
                </span>
              </div>
            ))
          )}
          {nextLocked ? (
            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-foreground/15 px-2 py-3 text-center">
              <span className="text-3xl opacity-60 grayscale" aria-hidden="true">
                {nextLocked.emoji}
              </span>
              <span className="mt-1 text-[11px] font-bold text-muted-foreground">
                Prochain
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground">
                dans un coffre 🎁
              </span>
            </div>
          ) : null}
        </div>
      )}
    </section>
  )
}

// ------------------------------------------------------------------------ Page
// live = connecté et branché Supabase ; sinon, démo locale (visiteur).
export default function TresorHome({
  live,
  initialCoins,
  gems,
  shop,
  collection,
  chestOpened,
}: {
  live: boolean
  initialCoins: number
  /** Solde de gemmes (migration 183) — affiché une seule fois, ici. */
  gems: number
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
  const openChest = async (): Promise<ChestOutcome> => {
    if (!live) {
      const r = drawChestReward()
      if (r.kind === 'coins') setBalance(coins + r.amount)
      return { status: 'opened', reward: r }
    }
    const res = await openDailyChest().catch(() => null)
    if (!res || res.status === 'error') return { status: 'error' }
    if (res.status === 'already') return { status: 'already' }
    if (!res.reward) return { status: 'error' }
    setBalance(res.coins)
    const itemId = res.reward.kind === 'sticker' ? res.reward.itemId : undefined
    if (itemId) {
      setCards((list) =>
        list.map((c) => (c.id === itemId ? { ...c, unlocked: true } : c)),
      )
    }
    return { status: 'opened', reward: res.reward }
  }

  // L'achat, et surtout CE QU'ON EN DIT.
  //
  // Le refus était muet : le serveur pouvait très bien répondre « non »
  // (bourse réellement vide, article déjà pris dans un autre onglet, RPC en
  // panne) et l'écran ne bougeait pas d'un pixel. Un élève qui tape un bouton
  // qui ne fait rien n'en déduit pas « refusé », il en déduit « cassé ».
  //
  // On resynchronise AUSSI la bourse sur chaque réponse du serveur, y compris
  // sur un refus : c'est justement quand le client s'est trompé de solde qu'il
  // a le plus besoin du vrai.
  const onBuy = async (item: ShopItem) => {
    if (!live) {
      // Démo (visiteur) : la bourse est locale, on ne ment pas sur le refus.
      if (coins < item.price) {
        toast(
          messageAchat('trop-cher', item.name, coinsManquants(coins, item.price))
            .texte,
          'error',
        )
        return
      }
      sfx.coin()
      setBalance(coins - item.price)
      markOwned(item.id)
      toast(messageAchat('achete', item.name).texte)
      return
    }

    const res = await buyShopItem(item.id).catch(() => null)
    if (res && Number.isFinite(res.coins)) setBalance(res.coins)

    const issue = issueAchat({
      reponse: res,
      prix: item.price,
      possedeDeja: Boolean(item.owned),
    })
    if (issue === 'achete') {
      sfx.coin()
      markOwned(item.id)
    } else if (issue === 'deja') {
      markOwned(item.id)
    }

    const { texte, ton } = messageAchat(
      issue,
      item.name,
      coinsManquants(res?.coins ?? coins, item.price),
    )
    toast(texte, ton)
  }

  // Le cap : ce qu'il peut s'offrir tout de suite, ou ce qu'il vise ensuite.
  const cap = prochainArticle(items, coins)

  const boosts = items.filter((i) => i.kind === 'boost' || i.kind === 'flamme')
  const companions = items.filter(
    (i) => i.kind === 'compagnon' || i.kind === 'avatar',
  )

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6">
      {/* LES DEUX SOLDES, chacun avec CE QU'IL ACHÈTE.
          Ils tenaient dans une seule pilule « 🪙 635 · 💎 60 », deux nombres
          collés sans un mot : rien ne disait laquelle des deux monnaies servait
          à quoi — et comme aucun article de cette page ne coûte de gemmes, le
          cristal ressemblait à un compteur décoratif. Une carte par monnaie,
          avec sa règle en une ligne : les pièces habillent, les gemmes ouvrent
          du contenu. C'est aussi ce qui rend le prix d'un rayon lisible : on
          sait dans quelle monnaie il est libellé. */}
      <div className="-mb-2 flex flex-col gap-2">
        <p className="px-1 text-xs font-semibold text-muted-foreground">
          {live ? 'Ton trésor' : 'Aperçu — connecte-toi pour ton vrai trésor.'}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {/* Le SOLDE : les monnaies y sont des objets qu'on regarde, donc
              illustrées. Ailleurs sur la page (les PRIX, dans les lignes de
              texte et sur les boutons teintés), elles restent des signes
              monochromes qui prennent la couleur du texte. */}
          <div
            className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm ring-1 ring-black/5"
            aria-label={`${coins} pièces — la monnaie de la boutique`}
          >
            <EcuIcon className="size-7 shrink-0" />
            <span className="min-w-0">
              <span
                className={cn(
                  'block font-mono text-sm leading-none font-extrabold tabular-nums transition-colors',
                  flash && 'text-highlight',
                )}
              >
                {coins}
              </span>
              <span className="block truncate text-[10px] font-semibold text-muted-foreground">
                pièces · tout ici
              </span>
            </span>
          </div>
          <Link
            href="/parrain"
            onClick={() => sfx.tap()}
            className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm ring-1 ring-black/5 transition active:scale-[0.99]"
            aria-label={`${gems} gemmes — elles ouvrent les supports écrits d’un chapitre, ${GEM_COST_CHAPTER} par chapitre. Toucher pour en gagner.`}
          >
            <CristalIcon className="size-7 shrink-0" />
            <span className="min-w-0">
              <span className="block font-mono text-sm leading-none font-extrabold tabular-nums">
                {gems}
              </span>
              <span className="block truncate text-[10px] font-semibold text-muted-foreground">
                gemmes · {GEM_COST_CHAPTER}/chapitre
              </span>
            </span>
          </Link>
        </div>

        {/* LE CAP. Une boutique dont tous les prix dépassent la bourse est un
            musée : l'élève ne sait ni ce qui est à sa portée, ni ce qu'il vise.
            Une ligne suffit à répondre aux deux — et, quand il est court, à
            dire où l'on remplit la bourse. Le coffre du jour est juste dessous,
            c'est donc le rappel le moins coûteux à suivre. */}
        {cap ? (
          <p className="px-1 text-xs font-medium text-muted-foreground">
            {cap.accessible ? (
              <>
                Tu peux t’offrir{' '}
                <span className="font-bold text-foreground">
                  {cap.article.name}
                </span>{' '}
                dès maintenant.
              </>
            ) : (
              <>
                Encore{' '}
                <span className="font-bold text-foreground tabular-nums">
                  {coinsManquants(coins, cap.article.price)} pièces
                </span>{' '}
                pour {cap.article.name} — le coffre du jour et les quêtes du
                Défi en donnent.
              </>
            )}
          </p>
        ) : null}
      </div>

      {/* 1. Le coffre du jour, en tête : la boucle quotidienne d'abord. */}
      <DailyChest alreadyOpened={chestOpened} onOpen={openChest} />

      {/* 2. Rayon Boosts : prix visibles, défilement horizontal. */}
      <section aria-label="Boosts" className="flex flex-col gap-2">
        <ShelfTitle>⚡ Boosts</ShelfTitle>
        <div className="-mx-4 flex snap-x gap-2.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {boosts.map((item) => (
            <ShelfCard key={item.id} item={item} coins={coins} onBuy={onBuy} />
          ))}
        </div>
      </section>

      {/* 3. Compagnons & collection : la vitrine (le prochain, pas 23 cadenas). */}
      <CollectionShowcase cards={cards} />
      {companions.length > 0 ? (
        <div className="-mx-4 -mt-3 flex snap-x gap-2.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {companions.map((item) => (
            <ShelfCard key={item.id} item={item} coins={coins} onBuy={onBuy} />
          ))}
        </div>
      ) : null}

      {/* 4. Rayon Fonds & skins (lib/coffre) — VITRINE, et rien d'autre.
             Ce rayon n'a jamais eu de caisse : aucun de ses articles n'est
             branché sur `buy_shop_item`, et aucun ne change quoi que ce soit à
             l'écran une fois « acheté ». Il affichait pourtant une pastille de
             prix identique à celle des vrais rayons — un bouton qui ne répond
             pas, ce qui est pire que pas de bouton du tout. On garde le rayon
             (les prix donnent un cap à qui économise) mais on dit ce qu'il
             est : un aperçu. Le jour où la caisse existe, la pastille redevient
             un `ShelfCard`. */}
      <section aria-label="Fonds et skins" className="flex flex-col gap-2">
        <ShelfTitle
          aside={
            <span className="text-[11px] font-bold text-muted-foreground">
              aperçu
            </span>
          }
        >
          🎨 Fonds & skins
        </ShelfTitle>
        <p className="-mt-1 px-1 text-[11px] font-medium text-muted-foreground">
          Pas encore en rayon — les prix sont là pour que tu saches quoi mettre
          de côté.
        </p>
        <div className="-mx-4 flex snap-x gap-2.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {PERSO_CATALOG.map((p) => (
            <div
              key={p.id}
              className="flex w-40 shrink-0 snap-start flex-col items-center rounded-2xl bg-card p-3 text-center ring-1 ring-foreground/10"
            >
              <span className="text-3xl" aria-hidden="true">
                {p.emoji}
              </span>
              <p className="font-heading mt-1 line-clamp-2 min-h-8 text-xs leading-tight font-extrabold text-foreground">
                {p.name}
              </p>
              {/* Même règle que les autres rayons : l'effet avant le prix. */}
              <p className="mt-0.5 line-clamp-3 min-h-11 text-[11px] leading-snug font-medium text-muted-foreground">
                {p.desc}
              </p>
              {/* Pas de pastille teintée « prête à taper » : le prix se lit
                  comme une étiquette de vitrine, pas comme une caisse. */}
              <span className="mt-2 flex items-center gap-1 rounded-full bg-muted px-3 py-1.5 font-mono text-xs font-extrabold tabular-nums text-muted-foreground">
                {p.available ? (
                  <>
                    <CoinIcon className="size-3.5" strokeWidth={2.2} />{' '}
                    {p.priceCoins}
                  </>
                ) : (
                  <>
                    <Lock className="size-3" aria-hidden="true" /> Bientôt
                  </>
                )}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Le renvoi « les capsules du coach ont déménagé » a été RETIRÉ. Il
          annonçait un déménagement vieux de plusieurs versions, en bas d'une
          page déjà longue, et c'était le seul bloc du volet à ne rien vendre.
          Les capsules ouvrent maintenant le volet Studuel+, qui est à un tap
          en haut de l'écran : ce panneau n'avait plus rien à apprendre. */}
    </div>
  )
}
