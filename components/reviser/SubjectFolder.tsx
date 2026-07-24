'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { ChevronDown, FolderClosed, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { subjectPastel } from '@/lib/subject-style'
import {
  folderCountLabel,
  folderProgress,
  folderStorageKey,
  folderSubjects,
  resolveOpenState,
  type SubjectFolder as Folder,
} from '@/lib/reviser-folders'

// Nombre de « papiers » qui dépassent derrière un dossier fermé : un aperçu
// coloré de son contenu (2–3 feuilles) sans la rangée de mini-icônes illisibles
// d'avant.
const PAPERS_MAX = 3

function readStored(id: Folder['id']): string | null {
  try {
    return window.localStorage.getItem(folderStorageKey(id))
  } catch {
    return null
  }
}

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
  const cls = 'flex w-full items-center gap-3.5 px-4 py-3.5 text-left'
  if (forceOpen) {
    return <div className={cls}>{children}</div>
  }
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls={panelId}
      className={cn(cls, 'transition active:translate-y-px')}
    >
      {children}
    </button>
  )
}

/**
 * Les « papiers qui dépassent » derrière un dossier fermé : 2–3 feuilles
 * arrondies, aux teintes des premières matières, qui pointent de 8 px au-dessus
 * du haut de la carte et s'éventent légèrement. Purement décoratif — elles
 * disent « il y a des choses là-dedans » sans la rangée d'icônes d'avant. Elles
 * disparaissent quand le dossier s'ouvre : le contenu réel prend le relais.
 */
function Papers({ colors }: { colors: string[] }) {
  const n = colors.length
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0">
      {colors.map((color, i) => {
        // Éventail symétrique : la feuille du milieu reste droite, les autres
        // se décalent et pivotent de part et d'autre.
        const spread = i - (n - 1) / 2
        return (
          <span
            key={i}
            className="absolute inset-x-6 -top-2 h-14 rounded-2xl ring-1 ring-black/[0.06] shadow-sm"
            style={{
              backgroundColor: subjectPastel(color),
              transform: `translateX(${spread * 14}px) rotate(${spread * 3}deg)`,
            }}
          />
        )
      })}
    </span>
  )
}

/**
 * Un DOSSIER de matières sur l'accueil Réviser : une carte-dossier qu'on touche
 * pour ouvrir ou fermer, et la grille de matières qui vient s'y rattacher.
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
  progressBySlug = {},
  forceOpen = false,
}: {
  folder: Folder
  children: ReactNode
  /**
   * Avancement par matière (0–100), pour la jauge de l'en-tête. Le dossier
   * fermé annonçait un simple comptage : « 6 matières » ne dit pas si elles
   * sont faites. Optionnel — sans lui, la carte n'affiche pas de barre.
   */
  progressBySlug?: Record<string, number>
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
    // Le même « tap » discret que sur une carte matière : ouvrir un dossier est
    // un geste de navigation ordinaire, pas un événement à sonoriser comme
    // l'entrée dans un mode de jeu.
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
  const subjects = folderSubjects(folder)
  const pct = folderProgress(folder, progressBySlug)
  // Le hors-programme est du bonus : il prend la teinte « récompense » (jaune)
  // pour se distinguer du programme (violet = l'action attendue) sans avoir à
  // le répéter en toutes lettres.
  const isBonus = folder.id === 'hors-programme'

  // Un « papier » par matière, dans l'ordre affiché, teinté de sa couleur —
  // limité aux premières pour que l'éventail reste lisible.
  const paperColors = subjects.slice(0, PAPERS_MAX).map((s) => s.color)

  return (
    // `isolate` : les papiers (z auto) restent derrière la carte (z-10) sans
    // remonter par-dessus d'autres blocs de la page.
    <section className="relative isolate">
      {/* Fermé seulement : les feuilles colorées qui dépassent derrière la
          carte. Ouvert, le contenu réel prend leur place. */}
      {!isOpen && paperColors.length > 0 ? <Papers colors={paperColors} /> : null}

      {/* Carte-dossier + zone rattachée : un seul bloc arrondi. Ouvert, un voile
          teinté (5 %) et un liseré englobent l'en-tête ET la grille pour qu'ils
          se lisent comme un ensemble continu. */}
      <div
        className={cn(
          'rev-card relative z-10 overflow-hidden rounded-[1.75rem] bg-white transition-colors duration-200',
          isOpen &&
            (isBonus
              ? 'bg-highlight/[0.05] ring-1 ring-highlight/25'
              : 'bg-primary/[0.05] ring-1 ring-primary/15'),
        )}
      >
        <Header
          forceOpen={forceOpen}
          onToggle={toggle}
          isOpen={isOpen}
          panelId={panelId}
        >
          {/* Grande icône dossier (56 px) : fermée ou ouverte selon l'état. */}
          <span
            aria-hidden="true"
            className={cn(
              'grid size-14 shrink-0 place-items-center rounded-2xl text-white shadow-sm',
              isBonus
                ? 'bg-gradient-to-br from-highlight to-[color:color-mix(in_oklch,var(--highlight),black_18%)] text-foreground'
                : 'bg-gradient-to-br from-primary to-[color:color-mix(in_oklch,var(--primary),black_22%)]',
            )}
          >
            <Icon className="size-7" strokeWidth={2.2} />
          </span>

          <span className="flex min-w-0 flex-1 flex-col gap-1.5">
            {/* Titre + pastille du nombre de matières. */}
            <span className="flex items-center gap-2">
              <span className="font-heading truncate text-base font-extrabold">
                {folder.label}
              </span>
              <span
                className={cn(
                  'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums',
                  isBonus
                    ? 'bg-highlight/30 text-foreground'
                    : 'bg-primary/12 text-primary',
                )}
              >
                {folderCountLabel(folder)}
              </span>
            </span>

            {/* Sous-titre : à quoi sert le dossier. */}
            <span className="truncate text-xs text-muted-foreground">
              {folder.hint}
            </span>

            {/* Barre de progression pleine largeur, le % à droite de la barre. */}
            {pct !== null ? (
              <span className="mt-0.5 flex items-center gap-2.5">
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <span
                    className={cn(
                      'block h-full rounded-full transition-[width] duration-500',
                      isBonus ? 'bg-highlight' : 'bg-primary',
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </span>
                <span className="shrink-0 font-mono text-xs font-bold text-muted-foreground tabular-nums">
                  {pct} %
                </span>
              </span>
            ) : null}
          </span>

          {/* Rien à replier quand le dossier est forcé ouvert : le chevron
              promettrait une bascule qui n'existe plus. */}
          {forceOpen ? null : (
            <ChevronDown
              aria-hidden="true"
              className={cn(
                'size-5 shrink-0 self-center text-muted-foreground transition-transform duration-200',
                isOpen && 'rotate-180',
              )}
            />
          )}
        </Header>

        {/* Fermé : on ne rend pas le contenu du tout. Le masquer en CSS
            garderait des dizaines de cartes (et leurs images) dans le DOM — or
            c'est précisément le poids de la page qu'on cherche à alléger.
            Ouvert : la zone se déplie (fondu + glissé), rattachée à la carte. */}
        {isOpen ? (
          <div
            id={panelId}
            className="folder-zone-in flex flex-col gap-3 px-3 pt-1 pb-3.5"
          >
            {children}
          </div>
        ) : null}
      </div>
    </section>
  )
}
