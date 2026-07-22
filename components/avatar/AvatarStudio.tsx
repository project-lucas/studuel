'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { AvatarConfig } from '@/lib/avatar'
import {
  STUDIO_TABS,
  applyItem,
  unlockLabel,
  type AvatarItem,
  type ItemState,
  type StudioTabId,
} from '@/lib/avatar-studio'
import {
  equipAvatarItemAction,
  purchaseAvatarItemAction,
} from '@/app/moi/avatar/actions'
import AvatarPreview from '@/components/avatar/AvatarPreview'
import ItemGrid from '@/components/avatar/ItemGrid'
import PurchaseModal from '@/components/avatar/PurchaseModal'
import ConfettiRain from '@/components/ConfettiRain'
import CoinIcon from '@/components/ui/CoinIcon'
import { useTablist } from '@/components/useTablist'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'

// -----------------------------------------------------------------------------
// Le vestiaire — écran plein dédié à l'identité visuelle de l'élève. Zone
// haute : aperçu vivant (bannière + avatar + prénom/niveau) qui « pop » à
// chaque équipement. Zone basse : les onglets du catalogue. Tout le catalogue
// est visible, y compris les items verrouillés avec leur condition : c'est la
// roadmap de motivation.
//
// L'équipement est OPTIMISTE (application instantanée, revert si le serveur
// refuse) ; l'achat passe par la modale puis la RPC au prix autoritatif.
// `data-no-swipe` : le geste d'onglets globaux (SwipeTabs) n'a rien à faire ici.
// -----------------------------------------------------------------------------

// Durée de la pluie de confettis après un achat (décorative, courte).
const CONFETTI_MS = 1800

export default function AvatarStudio({
  initialConfig,
  catalog,
  initialOwnedIds,
  initialCoins,
  name,
  levelLabel,
}: {
  initialConfig: AvatarConfig
  catalog: readonly AvatarItem[]
  initialOwnedIds: readonly string[]
  initialCoins: number
  name: string
  levelLabel: string
}) {
  const [config, setConfig] = useState(initialConfig)
  const [ownedIds, setOwnedIds] = useState<ReadonlySet<string>>(
    () => new Set(initialOwnedIds),
  )
  const [coins, setCoins] = useState(initialCoins)
  const [popKey, setPopKey] = useState(0)
  const [activeTab, setActiveTab] = useState<StudioTabId>(STUDIO_TABS[0].id)
  const [buying, setBuying] = useState<AvatarItem | null>(null)
  const [celebrating, setCelebrating] = useState(false)
  const [pending, startTransition] = useTransition()
  const confettiTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tabs = useTablist(STUDIO_TABS.length, (i) => setActiveTab(STUDIO_TABS[i].id))

  useEffect(
    () => () => {
      if (confettiTimer.current) clearTimeout(confettiTimer.current)
    },
    [],
  )

  const active = STUDIO_TABS.find((t) => t.id === activeTab) ?? STUDIO_TABS[0]

  // Applique l'item en local (pop immédiat) puis confirme côté serveur ; si le
  // serveur refuse (item non possédé, session expirée…), on revient en arrière.
  const equip = (item: AvatarItem) => {
    sfx.tap()
    const prev = config
    const next = applyItem(prev, item)
    setConfig(next)
    setPopKey((k) => k + 1)
    startTransition(async () => {
      const { ok } = await equipAvatarItemAction(item.id)
      if (!ok) {
        setConfig(prev)
        toast('Impossible d’équiper cet objet pour le moment.', 'error')
      }
    })
  }

  const onTapItem = (item: AvatarItem, state: ItemState) => {
    if (state === 'locked') {
      sfx.tap()
      if (item.unlock) toast(`À débloquer : ${unlockLabel(item.unlock)}`)
      return
    }
    if (state === 'buyable') {
      sfx.tap()
      setBuying(item)
      return
    }
    // Possédé, ou équipé (re-tap sur un équipement porté = le retirer).
    if (state === 'owned' || item.category === 'equipment') equip(item)
  }

  const confirmPurchase = () => {
    const item = buying
    if (!item) return
    startTransition(async () => {
      const result = await purchaseAvatarItemAction(item.id)
      setCoins(result.coins)
      if (!result.bought) {
        toast('Achat impossible — réessaie dans un instant.', 'error')
        return
      }
      setOwnedIds((prev) => new Set([...prev, item.id]))
      setConfig((prev) => applyItem(prev, item))
      setPopKey((k) => k + 1)
      setBuying(null)
      sfx.tap()
      setCelebrating(true)
      if (confettiTimer.current) clearTimeout(confettiTimer.current)
      confettiTimer.current = setTimeout(() => setCelebrating(false), CONFETTI_MS)
    })
  }

  return (
    <div
      data-no-swipe
      className="fixed inset-0 z-50 flex flex-col bg-background"
      aria-label="Mon vestiaire"
    >
      {/* --- Zone haute fixe : l'aperçu vivant (~40 % de l'écran) ------------ */}
      <div className="relative h-[40dvh] shrink-0">
        <AvatarPreview
          config={config}
          name={name}
          levelLabel={levelLabel}
          popKey={popKey}
        />
        {celebrating ? <ConfettiRain /> : null}

        {/* Retour + solde, par-dessus la bannière. */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <Link
            href="/moi"
            aria-label="Retour à Moi"
            className="flex size-10 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md transition active:scale-90"
          >
            <ArrowLeft className="size-5" strokeWidth={2.6} aria-hidden="true" />
          </Link>
          <span className="flex items-center gap-1.5 rounded-full bg-highlight px-3 py-1.5 text-sm font-extrabold text-foreground shadow-md tabular-nums">
            <CoinIcon className="size-4" />
            {coins}
          </span>
        </div>
      </div>

      {/* --- Zone basse : onglets + grille scrollable ------------------------- */}
      <div className="flex min-h-0 flex-1 flex-col">
        <div
          role="tablist"
          aria-label="Catégories du vestiaire"
          className="flex shrink-0 gap-1.5 overflow-x-auto border-b border-border bg-background px-3 py-2.5"
        >
          {STUDIO_TABS.map((t, i) => {
            const selected = t.id === activeTab
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`vestiaire-tab-${t.id}`}
                aria-selected={selected}
                aria-controls="vestiaire-panel"
                {...tabs.props(i, selected)}
                onClick={() => {
                  sfx.tap()
                  setActiveTab(t.id)
                }}
                className={cn(
                  'shrink-0 rounded-full px-3.5 py-1.5 text-sm font-bold transition-colors',
                  selected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground',
                )}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        <div
          id="vestiaire-panel"
          role="tabpanel"
          aria-labelledby={`vestiaire-tab-${active.id}`}
          className="min-h-0 flex-1 overflow-y-auto px-4 py-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
        >
          <ItemGrid
            categories={active.categories}
            catalog={catalog}
            config={config}
            ownedIds={ownedIds}
            onTap={onTapItem}
          />
        </div>
      </div>

      {buying ? (
        <PurchaseModal
          item={buying}
          coins={coins}
          pending={pending}
          onConfirm={confirmPurchase}
          onClose={() => setBuying(null)}
        />
      ) : null}
    </div>
  )
}
