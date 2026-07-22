'use client'

import type { AvatarConfig } from '@/lib/avatar'
import {
  CATEGORY_LABELS,
  catalogByCategory,
  itemState,
  type AvatarItem,
  type AvatarItemCategory,
  type ItemState,
} from '@/lib/avatar-studio'
import ItemTile from '@/components/avatar/ItemTile'

// -----------------------------------------------------------------------------
// Grille d'un onglet du vestiaire : une section titrée par catégorie (l'onglet
// Corps en empile trois : peau, coiffure, couleur), vignettes en 3 colonnes.
// -----------------------------------------------------------------------------

export default function ItemGrid({
  categories,
  catalog,
  config,
  ownedIds,
  onTap,
}: {
  categories: readonly AvatarItemCategory[]
  catalog: readonly AvatarItem[]
  config: AvatarConfig
  ownedIds: ReadonlySet<string>
  onTap: (item: AvatarItem, state: ItemState) => void
}) {
  const sections = categories
    .map((category) => ({ category, items: catalogByCategory(catalog, category) }))
    .filter((s) => s.items.length > 0)

  if (sections.length === 0) {
    return (
      <p className="rounded-2xl bg-white/70 px-4 py-8 text-center text-sm font-semibold text-muted-foreground">
        Rien à essayer ici pour l&apos;instant — reviens bientôt !
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {sections.map(({ category, items }) => (
        <section key={category} aria-label={CATEGORY_LABELS[category]}>
          {/* Un seul groupe dans l'onglet : le titre serait redondant. */}
          {sections.length > 1 ? (
            <h3 className="mb-2 text-xs font-extrabold tracking-wide text-muted-foreground uppercase">
              {CATEGORY_LABELS[category]}
            </h3>
          ) : null}
          <div className="grid grid-cols-3 gap-2.5">
            {items.map((item) => (
              <ItemTile
                key={item.id}
                item={item}
                state={itemState(item, config, ownedIds)}
                config={config}
                onTap={onTap}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
