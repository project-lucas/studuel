'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { ChevronDown, FolderClosed, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  folderStorageKey,
  resolveOpenState,
  type SubjectFolder as Folder,
} from '@/lib/reviser-folders'

const HEADER_CLASS =
  'rev-card flex w-full items-center gap-3 rounded-[1.5rem] bg-white px-4 py-3 text-left'

/**
 * L'en-tête du dossier : un vrai `<button>` quand il y a quelque chose à
 * replier, un simple bloc sinon. On ne se contente pas de désactiver le bouton
 * — un `<button disabled>` sort du parcours clavier sans rien expliquer, alors
 * qu'ici il n'y a tout simplement plus de commande à proposer.
 */
function Header({
  forceOpen,
  isOpen,
  panelId,
  onToggle,
  children,
}: {
  forceOpen: boolean
  isOpen: boolean
  panelId: string
  onToggle: () => void
  children: ReactNode
}) {
  if (forceOpen) {
    return <div className={HEADER_CLASS}>{children}</div>
  }
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls={panelId}
      className={cn(HEADER_CLASS, 'transition hover:bg-white active:translate-y-px')}
    >
      {children}
    </button>
  )
}

function readStored(id: Folder['id']): string | null {
  try {
    return window.localStorage.getItem(folderStorageKey(id))
  } catch {
    return null
  }
}

/**
 * Un DOSSIER de matières sur l'accueil Réviser : un en-tête qu'on touche pour
 * ouvrir ou fermer, et la grille de matières dedans.
 *
 * L'accueil dépliait tout d'un bloc — au collège, une seule grille à rallonge,
 * et l'ajout des matières qui manquaient (EPS, musique, arts, EMC…) l'aurait
 * rendue franchement illisible. Ranger en dossiers laisse l'élève ouvrir ce
 * qu'il vient chercher.
 *
 * Le choix ouvert/fermé est mémorisé par dossier : refermer « Hors programme »
 * à chaque visite serait exactement le défaut qu'on corrige.
 */
export default function SubjectFolder({
  folder,
  children,
  forceOpen = false,
}: {
  folder: Folder
  children: ReactNode
  /**
   * Ouvre le dossier et retire la possibilité de le refermer. Sert au mode
   * « Modifier mes matières » : le choix ouvert/fermé étant mémorisé, un élève
   * qui avait replié « Programme » entrait en édition devant un dossier fermé,
   * donc sans une seule case à cocher, sans rien pour le lui dire.
   */
  forceOpen?: boolean
}) {
  // Le choix mémorisé se lit APRÈS le montage, jamais pendant le rendu :
  // `localStorage` n'existe pas côté serveur, donc le HTML serveur part
  // forcément du défaut du dossier. Lire le stockage au rendu ferait diverger
  // le premier rendu client du HTML serveur — écart d'hydratation à chaque
  // fois que l'élève a déjà ouvert ou fermé un dossier. Même pattern que les
  // records du Blitz et du Chrono.
  const [open, setOpen] = useState(folder.defaultOpen)
  const { id, defaultOpen } = folder
  useEffect(() => {
    // On dépend des deux CHAMPS lus, pas de l'objet `folder` : celui-ci est
    // reconstruit à chaque rendu du parent, donc l'effet se relançait à chaque
    // case cochée pour relire le même stockage.
    const load = () => setOpen(resolveOpenState({ defaultOpen }, readStored(id)))
    load()
  }, [id, defaultOpen])

  const isOpen = forceOpen || open

  const toggle = () => {
    sfx.tap()
    const next = !open
    setOpen(next)
    try {
      window.localStorage.setItem(
        folderStorageKey(folder.id),
        next ? 'open' : 'closed',
      )
    } catch {
      // stockage indisponible (navigation privée) : le dossier reste utilisable,
      // il repartira simplement de son état par défaut à la prochaine visite.
    }
  }

  const panelId = `dossier-${folder.id}`
  const Icon = isOpen ? FolderOpen : FolderClosed

  return (
    <section className="flex flex-col gap-2.5">
      {/* Forcé ouvert : plus rien à déplier, donc plus de bouton du tout. Un
          `aria-expanded` sur un dossier qu'on ne peut pas refermer annoncerait
          une commande qui n'existe plus ; un `<button>` désactivé la ferait
          disparaître du parcours clavier sans explication. On rend alors un
          simple en-tête. */}
      <Header
        forceOpen={forceOpen}
        onToggle={toggle}
        isOpen={isOpen}
        panelId={panelId}
      >
        <span
          aria-hidden="true"
          className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"
        >
          <Icon className="size-5" strokeWidth={2.2} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="font-heading truncate text-base font-extrabold">
              {folder.label}
            </span>
            <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 font-mono text-[11px] font-bold tabular-nums">
              {folder.count}
            </span>
          </span>
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
            {folder.hint}
          </span>
        </span>

        {/* Rien à replier quand le dossier est forcé ouvert : le chevron
            promettrait une bascule qui n'existe plus. */}
        {forceOpen ? null : (
          <ChevronDown
            aria-hidden="true"
            className={cn(
              'size-5 shrink-0 text-muted-foreground transition-transform duration-200',
              isOpen && 'rotate-180',
            )}
          />
        )}
      </Header>

      {/* Fermé : on ne rend pas le contenu du tout. Le masquer en CSS
          garderait des dizaines de cartes (et leurs images) dans le DOM — or
          c'est précisément le poids de la page qu'on cherche à alléger. */}
      {isOpen ? (
        <div id={panelId} className="flex flex-col gap-3">
          {children}
        </div>
      ) : null}
    </section>
  )
}
