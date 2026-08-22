'use client'

import type { AvatarConfig, FreeAvatarFieldKey } from '@/lib/avatar'
import {
  CATEGORY_LABELS,
  catalogByCategory,
  itemState,
  type AvatarItem,
  type AvatarItemCategory,
  type ItemState,
} from '@/lib/avatar-studio'
import ItemTile from '@/components/avatar/ItemTile'
import FreeFieldRow from '@/components/avatar/FreeFieldRow'

// -----------------------------------------------------------------------------
// Grille d'un onglet du vestiaire : une section titrée par groupe, vignettes en
// 3 colonnes. Un onglet mêle deux natures de groupes, et l'écran ne les
// distingue pas visuellement — c'est voulu :
//
//   • les CATÉGORIES du catalogue (peau, coiffure, couleur, haut, objet,
//     bannière), avec prix et cadenas, servies par la base ;
//   • les CHAMPS LIBRES (expression, lunettes, barbe, fond), sans prix, servis
//     par la liste fermée de lib/avatar.
//
// L'élève n'a pas à connaître cette frontière : il règle son visage, et
// certaines options coûtent des pièces. Les libres passent en premier dans
// l'onglet, parce que « à quoi je ressemble » précède « qu'est-ce que je porte ».
// -----------------------------------------------------------------------------

export default function ItemGrid({
  categories,
  freeFields,
  catalog,
  config,
  ownedIds,
  onTap,
  onPickFree,
}: {
  categories: readonly AvatarItemCategory[]
  freeFields: readonly FreeAvatarFieldKey[]
  catalog: readonly AvatarItem[]
  config: AvatarConfig
  ownedIds: ReadonlySet<string>
  onTap: (item: AvatarItem, state: ItemState) => void
  onPickFree: (field: FreeAvatarFieldKey, value: string) => void
}) {
  const sections = categories
    .map((category) => ({ category, items: catalogByCategory(catalog, category) }))
    .filter((s) => s.items.length > 0)

  const groupCount = sections.length + freeFields.length

  if (groupCount === 0) {
    return (
      <p className="rounded-2xl bg-white/70 px-4 py-8 text-center text-sm font-semibold text-muted-foreground">
        Rien à essayer ici pour l&apos;instant — reviens bientôt !
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {freeFields.map((field) => (
        <FreeFieldRow
          key={field}
          field={field}
          config={config}
          withTitle={groupCount > 1}
          onPick={onPickFree}
        />
      ))}

      {sections.map(({ category, items }) => (
        <section key={category} aria-label={CATEGORY_LABELS[category]}>
          {/* Un seul groupe dans l'onglet : le titre serait redondant. */}
          {groupCount > 1 ? (
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
