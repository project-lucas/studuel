'use client'

import { useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import { Check, Pencil, CalendarClock, Crown, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { subjectTheme, subjectVignette } from '@/lib/subject-style'
import {
  rankForValue,
  MASTERY_RANK_LABEL,
  type MasteryRank,
} from '@/lib/mastery'
import SubjectIcon from '@/components/SubjectIcon'
import WorldBackdrop from '@/components/WorldBackdrop'
import { sfx } from '@/lib/sounds'
import { useDialogFocus } from '@/lib/use-dialog'
import { toast } from '@/lib/toast'
import { saveSelectedSubjects } from '@/app/reviser/actions'
import type { ExamProximity, SubjectExamHint } from '@/lib/next-exam'
import type { Subject } from '@/lib/types'
import SubjectFolder from '@/components/reviser/SubjectFolder'
import { subjectFolders } from '@/lib/reviser-folders'

// Palette des 3 paliers d'annotation « contrôle qui arrive » sur un dossier :
// vert = de la marge, orange = bientôt, rouge = très proche.
const PROX_STYLE: Record<
  ExamProximity,
  { ring: string; pill: string }
> = {
  far: { ring: 'ring-green-500/70', pill: 'bg-green-600 text-white' },
  soon: { ring: 'ring-amber-500/80', pill: 'bg-amber-500 text-white' },
  imminent: { ring: 'ring-destructive', pill: 'bg-destructive text-white' },
}


// Cote « couronnes » façon Duolingo : à la place du pourcentage (déprimant),
// chaque matière porte 3 emplacements de couronne remplis selon son rang de
// maîtrise (lib/mastery). Diamant et Légendaire gardent 3 couronnes mais
// passent en violet — le prestige au-delà de l'or.
const RANK_CROWNS: Record<MasteryRank, number> = {
  bronze: 1,
  argent: 2,
  or: 3,
  diamant: 3,
  legendaire: 3,
}

const RANK_COLOR: Record<MasteryRank, string> = {
  bronze: 'text-amber-700',
  argent: 'text-slate-400',
  or: 'text-yellow-500',
  diamant: 'text-primary',
  legendaire: 'text-primary',
}

// Rangée de 3 couronnes + libellé du rang (« À découvrir » tant que rien n'est
// commencé). Purement décorative : le texte porte l'information.
function CrownRating({
  rank,
  subjectName,
  showLabel = true,
}: {
  rank: MasteryRank | null
  subjectName: string
  // Sur une carte illustrée, on masque le libellé texte (l'illustration occupe
  // le coin bas-droit) : seules les couronnes restent, la légende de la page
  // explique les rangs. Le rang reste annoncé via l'aria-label.
  showLabel?: boolean
}) {
  const filled = rank ? RANK_CROWNS[rank] : 0
  const color = rank ? RANK_COLOR[rank] : ''
  // « À découvrir » et non « À débloquer » : rien n'est verrouillé ici (ni
  // paywall, ni condition). Le rang est simplement vide tant qu'on n'a pas
  // commencé — « débloquer » promettait une serrure qui n'existe pas.
  const label = rank ? MASTERY_RANK_LABEL[rank] : 'À découvrir'

  return (
    <div
      className="mt-2.5 flex items-center gap-1.5"
      aria-label={`Rang en ${subjectName} : ${label}`}
    >
      <span aria-hidden="true" className="flex items-center gap-0.5">
        {[0, 1, 2].map((i) => (
          <Crown
            key={i}
            strokeWidth={2.2}
            className={cn(
              'size-4',
              i < filled
                ? cn(color, 'fill-current')
                : 'text-muted-foreground/30',
            )}
          />
        ))}
      </span>
      {showLabel ? (
        <span
          aria-hidden="true"
          className={cn(
            'text-xs font-bold',
            rank ? color : 'text-muted-foreground/70',
          )}
        >
          {label}
        </span>
      ) : null}
    </div>
  )
}

// --- Réglages de la carte matière --------------------------------------------
// Les trois valeurs qui décident de la silhouette d'une carte, exposées ici pour
// qu'un ajustement visuel se fasse en UN endroit — pas dans six classes Tailwind
// éparpillées dans le JSX.

// Côté de l'illustration (px). Elle était à 76 px et « flottait » dans le coin ;
// à 100 px elle habite enfin la carte. Elle n'est PAS rognée : les vignettes sont
// des toiles carrées au motif centré, un débordement couperait le sujet en deux.
const ART_PX = 100
// Hauteur minimale de la carte : de quoi loger l'illustration ancrée en bas à
// droite sans écraser le titre ni les couronnes.
const CARD_MIN_PX = 132
// Laisse réservée au texte : l'illustration vit à droite, le titre et les
// couronnes ne dépassent jamais cette largeur — un nom long (« Figures
// historiques ») passe à la ligne au lieu de courir sous l'image.
const TEXT_ZONE = '58%'

// Normalise pour une recherche tolérante aux accents/casse.
function normalizeSearch(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
}

// Recherche sur TOUT le programme : une loupe (posée près de « Tronc commun »)
// qui ouvre un panneau plein écran filtrant les matières du niveau. Tap sur un
// résultat → la page de la matière. Remplace l'ancienne barre visuelle inerte.
function ProgramSearch({ subjects }: { subjects: Subject[] }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  // Le champ porte `autoFocus` : le hook le détecte et ne lui prend pas le
  // focus — il ne fait ici que piéger la tabulation dans le panneau.
  const panel = useRef<HTMLDivElement>(null)
  useDialogFocus(panel, open)

  const q = normalizeSearch(query)
  const results = q
    ? subjects.filter((s) => normalizeSearch(s.name).includes(q))
    : subjects

  return (
    <>
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOpen(true)
        }}
        aria-label="Rechercher dans le programme"
        aria-haspopup="dialog"
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm ring-1 ring-black/5 transition active:translate-y-px"
      >
        <Search className="size-4.5" strokeWidth={2.4} aria-hidden="true" />
      </button>

      {open ? (
        <div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Recherche dans le programme"
          className="fixed inset-0 z-[70] flex flex-col bg-background/95 outline-none backdrop-blur-sm"
        >
          {/* Barre de recherche en haut du panneau. */}
          <div className="flex items-center gap-2 border-b border-black/5 p-3">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-muted/60 px-4 py-2.5">
              <Search
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                placeholder="Chercher une matière…"
                aria-label="Chercher dans le programme"
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-foreground outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                sfx.tap()
                setOpen(false)
              }}
              aria-label="Fermer la recherche"
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted active:scale-90"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          {/* Résultats : les matières du programme, filtrées. */}
          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            {results.length === 0 ? (
              <p className="mt-8 text-center text-sm text-muted-foreground">
                Aucune matière ne correspond à « {query} ».
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {results.map((s) => {
                  const theme = subjectTheme(s.color)
                  return (
                    <li key={s.id}>
                      <Link
                        href={`/reviser/${s.slug}`}
                        onClick={() => {
                          sfx.tap()
                          setOpen(false)
                        }}
                        className="flex items-center gap-3 rounded-2xl bg-white p-2.5 shadow-sm ring-1 ring-black/5 transition active:scale-[0.99]"
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            'arena-tile flex size-10 shrink-0 items-center justify-center rounded-2xl',
                            theme.arena,
                          )}
                        >
                          <SubjectIcon
                            slug={s.slug}
                            className="size-5 text-white"
                            strokeWidth={2.25}
                          />
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm font-bold text-foreground">
                          {s.name}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </>
  )
}

// Carte matière (grille 2 colonnes) : fond crème identique pour toutes, barre
// d'accent colorée au bord gauche, nom en haut à gauche, couronnes en bas à
// gauche, grande illustration ancrée en bas à droite. Si un contrôle est annoncé
// sur la matière, la carte prend un liseré coloré (3 paliers) + une pastille
// compte à rebours — pour repérer d'un coup d'œil que « ça arrive ».
function SubjectRow({
  subject,
  pct,
  editing,
  checked,
  onToggle,
  exam,
  delayMs,
}: {
  subject: Subject
  pct: number
  editing: boolean
  checked: boolean
  onToggle: () => void
  exam?: SubjectExamHint
  delayMs: number
}) {
  const theme = subjectTheme(subject.color)
  const prox = exam ? PROX_STYLE[exam.proximity] : null
  // Illustration dédiée de la matière (toile carrée normalisée) : elle habille
  // la carte hors édition. Quand elle est là, elle remplace le médaillon
  // d'icône — une seule image forte par carte, façon grande app.
  const vignette = subjectVignette(subject.slug)
  const showVignette = !!vignette && !editing
  // Matière sans illustration dédiée (ex. Finances personnelles, seule du dossier
  // culture sans visuel) : on pose son icône AU MÊME endroit et à la même taille
  // qu'une illustration, pour que la carte garde la silhouette des autres (visuel
  // ancré en bas à droite) au lieu du médaillon à gauche qui la faisait dépareiller.
  const showFallbackArt = !vignette && !editing

  const hasArt = showVignette || showFallbackArt

  const inner = (
    <div
      style={{ animationDelay: `${delayMs}ms`, minHeight: `${CARD_MIN_PX}px` }}
      className={cn(
        // Fond crème unique (rev-tile) + barre d'accent de 4 px à gauche à la
        // couleur de la matière : la seule couleur de matière de la carte. Le
        // liseré de contour passe en `ring` — un `border` gris entrerait en
        // conflit avec la couleur de la bordure gauche.
        'pop-in rev-card rev-tile relative flex flex-col justify-between rounded-3xl border-l-4 p-3.5 pl-3 ring-1 ring-black/[0.06] transition-all duration-150 will-change-transform',
        theme.accent,
        prox ? `ring-2 ${prox.ring}` : null,
        !editing &&
          'group-hover:-translate-y-0.5 group-active:translate-y-[2px]',
        editing && 'cursor-pointer',
        editing && !checked && 'opacity-45 grayscale',
      )}
    >
      {/* Pastille « contrôle » : compte à rebours coloré, coin haut-droit. */}
      {exam && prox && !editing ? (
        <span
          className={cn(
            'absolute -top-2 right-2 z-20 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm',
            prox.pill,
          )}
        >
          <CalendarClock className="size-3" aria-hidden="true" />
          {exam.label}
        </span>
      ) : null}

      {/* Illustration de la matière : ancrée en bas à droite, `object-contain`
          pour ne jamais déformer ni rogner le motif, taille identique d'une
          carte à l'autre. Purement décorative — le nom porte le sens. Elle
          passe SOUS le texte (z-0) : le titre reste lisible quoi qu'il arrive. */}
      {showVignette ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={vignette}
          alt=""
          aria-hidden="true"
          width={320}
          height={320}
          loading="lazy"
          style={{ width: `${ART_PX}px`, height: `${ART_PX}px` }}
          className="pointer-events-none absolute right-0 bottom-0 z-0 select-none object-contain drop-shadow-[0_4px_10px_rgba(31,17,71,0.16)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-105"
        />
      ) : showFallbackArt ? (
        // Repli sans illustration : l'icône de la matière au même ancrage (bas
        // droite) et à la MÊME taille — même silhouette que les cartes
        // illustrées, pas de layout à part.
        <span
          aria-hidden="true"
          style={{ width: `${ART_PX}px`, height: `${ART_PX}px` }}
          className={cn(
            'arena-tile pointer-events-none absolute right-1.5 bottom-1.5 z-0 flex items-center justify-center rounded-2xl shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-105',
            theme.arena,
          )}
        >
          <SubjectIcon
            slug={subject.slug}
            className="size-12 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
            strokeWidth={2.25}
          />
        </span>
      ) : null}

      {/* Zone de texte : bornée à la moitié gauche dès qu'un visuel occupe le
          coin bas-droit. Sans cette laisse, un nom long (« Figures historiques
          françaises ») courait par-dessus l'illustration. */}
      <div
        className="relative z-10 flex items-start gap-2.5"
        style={hasArt ? { maxWidth: TEXT_ZONE } : undefined}
      >
        {editing ? (
          <span
            className={cn(
              'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-[11px] transition-colors',
              // Coche de sélection en VERT (validation), pas en jaune : le jaune
              // reste la monnaie/récompense.
              checked
                ? 'border-green-500 bg-green-500 text-white'
                : 'border-muted-foreground/40 bg-muted',
            )}
          >
            {checked ? <Check className="size-3" /> : null}
          </span>
        ) : null}
        <p className="font-heading min-w-0 flex-1 text-[15px] leading-tight font-bold text-balance">
          {subject.name}
        </p>
      </div>

      {/* Les couronnes restent en bas à GAUCHE, au-dessus de l'illustration. */}
      <div className="relative z-10 w-fit">
        {/* Les couronnes portent le rang ; le libellé texte est masqué sur la
            carte (un visuel occupe déjà le coin), la légende de la page l'explique
            et l'aria-label l'annonce. Uniforme désormais sur TOUTES les cartes. */}
        <CrownRating
          rank={rankForValue(pct / 100)}
          subjectName={subject.name}
          showLabel={false}
        />
      </div>
    </div>
  )

  if (editing) {
    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-label={subject.name}
        onClick={onToggle}
        className="group block w-full text-left"
      >
        {inner}
      </button>
    )
  }
  return (
    <Link
      href={`/reviser/${subject.slug}`}
      onClick={() => sfx.tap()}
      className="group block"
      aria-label={
        exam
          ? `${subject.name} — contrôle ${exam.label}`
          : subject.name
      }
    >
      {inner}
    </Link>
  )
}

// Accueil Réviser : fond crème pleine page + la liste des matières. L'ancienne
// carte d'identité violette (avatar, salutation, classe, stats) a été retirée
// pour que l'action du jour (carte « Ta semaine ») soit au-dessus du pli : la
// classe vit sur Moi, XP/trophées sur le HUD et le Défi, série + objectif ont
// rejoint la carte « Ta semaine ».
export default function SubjectsHome({
  subjects,
  selected,
  grade,
  progressBySlug,
  examBySubject = {},
  topSlot,
  carnetSlot,
}: {
  subjects: Subject[]
  selected: string[] | null
  // Toujours nécessaire au regroupement des matières par dossier (tronc commun
  // vs spécialités), même si la puce « Classe de … » a disparu de cet écran.
  grade: string
  progressBySlug: Record<string, number>
  examBySubject?: Record<string, SubjectExamHint>
  // Blocs insérés au-dessus de la grille des matières (série/semaine, contrôles,
  // reprise…) — rendus côté serveur et passés en enfant.
  topSlot?: React.ReactNode
  // L'entrée « Mon carnet » (bouton-icône rond), rendue collée à la loupe du
  // bandeau « Ton programme » — rendue côté serveur et passée en enfant.
  carnetSlot?: React.ReactNode
}) {
  const [editing, setEditing] = useState(false)
  const [picked, setPicked] = useState<Set<string>>(
    () => new Set(selected ?? subjects.map((s) => s.slug)),
  )
  const [pending, startTransition] = useTransition()

  // Les matières « culture » (hors-programme, hors-niveau) vivent dans leur
  // propre dossier et ne font pas partie de la sélection de matières (ni du
  // mode édition).
  const cultureSubjects = subjects.filter((s) => s.category === 'culture')
  const selectable = subjects.filter((s) => s.category !== 'culture')
  const visible = editing
    ? selectable
    : selectable.filter((s) => picked.has(s.slug))

  const toggle = (slug: string) =>
    setPicked((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })

  const finishEditing = () =>
    startTransition(async () => {
      try {
        await saveSelectedSubjects([...picked])
      } catch {
        toast('Sélection non enregistrée — réessaie.', 'error')
        return
      }
      toast('Matières enregistrées ✓')
      setEditing(false)
    })

  // En édition, on ne montre QUE le dossier Programme : la culture générale
  // n'est pas sélectionnable, un dossier qu'on ne peut pas modifier n'a rien à
  // faire dans un écran de modification.
  const folders = subjectFolders({
    programmeSubjects: visible,
    cultureSubjects: editing ? [] : cultureSubjects,
    grade,
  })

  // Décalage d'apparition continu d'une carte à l'autre, tous groupes confondus.
  let cardIndex = 0

  return (
    <section aria-label="Ton programme">
      {/* Fond crème pleine page, derrière tout le contenu de l'onglet. */}
      <WorldBackdrop className="rev-bg" />

      {/* Plus de carte d'identité : les blocs d'action (série/semaine,
          contrôles, reprise) arrivent directement, puis la grille des matières. */}
      <div className="relative flex flex-col gap-4 sm:px-1">
        {topSlot ? <div className="flex flex-col gap-4">{topSlot}</div> : null}

        {/* La loupe reste au-dessus des dossiers : elle cherche dans TOUT le
            programme, y compris ce qui est replié — sinon fermer un dossier
            reviendrait à cacher son contenu de la recherche. Le crayon
            (édition des matières) vit DANS le dossier Programme, le seul qu'il
            modifie : en haut, il se confondait avec l'icône de « Mon carnet ». */}
        <div className="flex items-center justify-between gap-2 px-1">
          {/* « Ton programme » et non « Mes matières » : ce dernier nomme déjà
              l'onglet actif tout en haut, la répétition brouillait le repère. */}
          <h2 className="font-heading text-sm font-bold text-foreground">
            Ton programme
          </h2>
          {/* Le carnet vit ici, collé à la loupe : deux commandes flottantes
              de même robe, au lieu d'une tuile pleine largeur sous le pli. */}
          <div className="flex items-center gap-2">
            {carnetSlot}
            <ProgramSearch subjects={subjects} />
          </div>
        </div>

        {/* On teste le dossier PROGRAMME, pas le nombre de dossiers : la culture
            générale reste visible même quand l'élève n'a plus aucune matière
            sélectionnée, et compter les dossiers ferait alors disparaître le
            seul message qui lui dit comment se réinscrire. Le bouton entre
            directement en édition : le crayon vivant désormais dans le dossier
            Programme, il n'existe plus quand le dossier a disparu. */}
        {!folders.some((f) => f.id === 'programme') ? (
          <div className="rev-card flex flex-col items-start gap-3 rounded-[1.75rem] bg-white p-5">
            <p className="text-sm text-muted-foreground">
              Aucune matière sélectionnée.
            </p>
            <button
              type="button"
              onClick={() => {
                sfx.tap()
                setEditing(true)
              }}
              className="font-heading flex min-h-9 items-center gap-1.5 rounded-full bg-primary px-3.5 text-xs font-bold text-primary-foreground shadow-sm transition active:translate-y-px"
            >
              <Pencil className="size-3.5" strokeWidth={2.4} aria-hidden="true" />
              Choisir mes matières
            </button>
          </div>
        ) : null}

        {folders.map((folder) => (
            // En édition, le dossier reste ouvert de force : le choix
            // ouvert/fermé étant mémorisé, un élève qui l'avait replié entrait
            // en édition devant un dossier fermé, donc sans une seule case.
            <SubjectFolder
              key={folder.id}
              folder={folder}
              progressBySlug={progressBySlug}
              forceOpen={editing}
            >
              {/* Le crayon vit ici, dans le seul dossier qu'il modifie. En
                  édition, la rangée devient consigne + « Terminé ». */}
              {folder.id === 'programme' ? (
                editing ? (
                  <div className="flex items-center justify-between gap-3 px-1">
                    <p className="min-w-0 text-sm text-muted-foreground">
                      Touche une matière pour l&apos;ajouter ou la retirer.
                    </p>
                    <button
                      type="button"
                      onClick={finishEditing}
                      disabled={pending}
                      className="font-heading flex min-h-9 shrink-0 items-center gap-1.5 rounded-full bg-primary px-3 text-xs font-bold text-primary-foreground shadow-sm transition active:translate-y-px disabled:opacity-60"
                    >
                      <Check className="size-3.5" aria-hidden="true" />
                      {pending ? 'Enregistrement…' : 'Terminé'}
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-end px-1">
                    <button
                      type="button"
                      onClick={() => {
                        sfx.tap()
                        setEditing(true)
                      }}
                      className="font-heading flex min-h-9 items-center gap-1.5 rounded-full bg-white px-3 text-xs font-bold text-primary shadow-sm ring-1 ring-black/5 transition active:translate-y-px"
                    >
                      <Pencil
                        className="size-3.5"
                        strokeWidth={2.4}
                        aria-hidden="true"
                      />
                      Modifier mes matières
                    </button>
                  </div>
                )
              ) : null}
              {folder.groups.map(({ label, items }) => (
                <section key={label ?? 'tout'} className="flex flex-col gap-2.5">
                  {label ? (
                    <h3 className="font-heading px-1 text-xs font-bold tracking-wide text-muted-foreground uppercase">
                      {label}
                    </h3>
                  ) : null}
                  <div className="grid grid-cols-2 gap-3">
                    {items.map((s) => {
                      // La culture générale n'entre pas dans la sélection : ses
                      // cartes restent inertes même en mode édition.
                      const isCulture = folder.id === 'hors-programme'
                      return (
                        <SubjectRow
                          key={s.id}
                          subject={s}
                          pct={progressBySlug[s.slug] ?? 0}
                          editing={editing && !isCulture}
                          checked={isCulture ? true : picked.has(s.slug)}
                          onToggle={() => {
                            if (!isCulture) toggle(s.slug)
                          }}
                          exam={examBySubject[s.slug]}
                          delayMs={cardIndex++ * 40}
                        />
                      )
                    })}
                  </div>
                </section>
              ))}
            </SubjectFolder>
        ))}

        {/* Légende des rangs de couronnes, comme sur la maquette. */}
        {!editing ? (
          <div
            aria-hidden="true"
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-1 pb-1"
          >
            {(['bronze', 'argent', 'or', 'diamant'] as const).map((rank) => (
              <span
                key={rank}
                className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground"
              >
                <Crown
                  strokeWidth={2.2}
                  className={cn('size-3.5 fill-current', RANK_COLOR[rank])}
                />
                {MASTERY_RANK_LABEL[rank]}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
