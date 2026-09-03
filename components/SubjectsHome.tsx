'use client'

import { useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { prechargerOnglet } from '@/components/PrechargeurOnglets'
import PrechargeurDossiers from '@/components/reviser/PrechargeurDossiers'
import { dossiersAPrecharger } from '@/lib/precharge-onglets'
import {
  Check,
  Pencil,
  CalendarClock,
  Crown,
  Search,
  Swords,
  X,
} from 'lucide-react'
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
import { CLOCK_STEP_MS, useClock } from '@/lib/use-clock'
import { countdownLabel } from '@/lib/traque'
import type { GardienSorti } from '@/lib/traque-server'
import { useDialogFocus } from '@/lib/use-dialog'
import { toast } from '@/lib/toast'
import { saveSelectedSubjects } from '@/app/reviser/actions'
import type { ExamProximity, SubjectExamHint } from '@/lib/next-exam'
import type { Subject } from '@/lib/types'
import type { SubjectGroup } from '@/lib/subject-groups'
import { programmeGroups } from '@/lib/subject-groups'

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

// Rangée de 3 couronnes, en petit, sous le nom de la matière. Purement
// décorative : l'aria-label porte l'information (le libellé texte, lui, a
// disparu avec le passage en rangée — il doublait la largeur du bloc).
function CrownRating({
  rank,
  subjectName,
  sombre = false,
}: {
  rank: MasteryRank | null
  subjectName: string
  /**
   * La carte est-elle sur fond SOMBRE (dossier d'un gardien sorti) ?
   *
   * Les couronnes vides sont une encre grise à 25 % : sur le crème d'une carte
   * ordinaire elles se lisent comme des emplacements à remplir, sur l'écarlate
   * elles disparaissent — et « 1 sur 3 » devient « 1 », c'est-à-dire un rang
   * qu'on ne peut plus situer.
   */
  sombre?: boolean
}) {
  const filled = rank ? RANK_CROWNS[rank] : 0
  const color = rank ? RANK_COLOR[rank] : ''
  // « À découvrir » et non « À débloquer » : rien n'est verrouillé ici (ni
  // paywall, ni condition). Le rang est simplement vide tant qu'on n'a pas
  // commencé — « débloquer » promettait une serrure qui n'existe pas.
  const label = rank ? MASTERY_RANK_LABEL[rank] : 'À découvrir'

  return (
    <span
      // `role="img"` : sans rôle, l'`aria-label` d'un span n'est pas exposé, et
      // les couronnes internes étant `aria-hidden`, le rang de maîtrise était
      // muet — dix-huit matières annoncées comme dix-huit liens identiques.
      role="img"
      className="mt-1 flex items-center gap-0.5"
      aria-label={`Rang en ${subjectName} : ${label}`}
    >
      {[0, 1, 2].map((i) => (
        <Crown
          key={i}
          aria-hidden="true"
          strokeWidth={2.4}
          className={cn(
            'size-3.5',
            i < filled
              ? cn(color, 'fill-current')
              : sombre
                ? 'text-white/35'
                : 'text-muted-foreground/25',
          )}
        />
      ))}
    </span>
  )
}

/**
 * Le gardien s'il est ENCORE sorti, sinon rien.
 *
 * La page est rendue une fois ; sa fenêtre, elle, dure une heure et se referme
 * pendant qu'on regarde l'écran. Sans ce filtre, un dossier resterait écarlate
 * avec « moins d'une minute » figé au-dessus d'un combat que le serveur
 * refuserait — la promesse en l'air que la bannière de l'arène évite déjà.
 *
 * `maintenant` vaut `null` au rendu serveur : on s'en tient alors au verdict du
 * serveur, qui vient de le calculer.
 */
function gardienVivant(
  gardien: GardienSorti | undefined,
  maintenant: number | null,
): GardienSorti | null {
  if (!gardien) return null
  if (maintenant !== null && maintenant >= gardien.endsAt) return null
  return gardien
}

// Défaut de `emptySlugs`. Constant de module, et non `new Set()` écrit dans les
// paramètres : un nouvel objet à chaque rendu changerait d'identité sans raison.
const EMPTY_SLUGS: Set<string> = new Set()

// --- Réglages de la carte matière --------------------------------------------
// Côté de l'illustration (px), à gauche du nom. Une VIGNETTE, pas un décor :
// elle doit rester lisible à cette taille — c'est le format d'icône que suit le
// lot de dessins (trait épais, objet unique, aplats).
const ICON_PX = 52

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

// Carte matière (grille 2 colonnes) : une RANGÉE — vignette à gauche, nom à
// droite, couronnes sous le nom. Fond blanc, comme tous les autres blocs de
// l'écran (la barre de série, les sessions à reprendre).
//
// Elle était haute de 132 px : nom en haut à gauche, couronnes en bas, grande
// illustration de 100 px ancrée dans le coin bas-droit. Un joli objet, mais qui
// mangeait un écran entier pour six matières et forçait le nom à vivre dans 58 %
// de la largeur — « Enseignement scientifique » y tenait sur trois lignes. En
// rangée, la même grille en montre le double et le nom retrouve toute la carte.
//
// Si un contrôle est annoncé sur la matière, la carte prend un liseré coloré
// (3 paliers) + une pastille compte à rebours — pour repérer que « ça arrive ».
function SubjectRow({
  subject,
  pct,
  editing,
  checked,
  onToggle,
  exam,
  empty,
  gardien,
  maintenant,
  delayMs,
}: {
  subject: Subject
  pct: number
  editing: boolean
  checked: boolean
  onToggle: () => void
  exam?: SubjectExamHint
  /** Aucun chapitre à ce niveau : la carte l'annonce au lieu de le cacher. */
  empty?: boolean
  /** Le gardien sorti sur cette matière — la carte passe alors à l'écarlate. */
  gardien?: GardienSorti | null
  /** Battement d'horloge, pour égrener le compte à rebours du gardien. */
  maintenant?: number | null
  delayMs: number
}) {
  const router = useRouter()
  const theme = subjectTheme(subject.color)
  const prox = exam ? PROX_STYLE[exam.proximity] : null
  // Illustration dédiée de la matière (toile carrée normalisée). Elle reste
  // visible EN ÉDITION : c'est elle qui identifie la carte, la retirer au moment
  // précis où l'on trie ses matières revenait à trier des noms nus.
  const vignette = subjectVignette(subject.slug)

  const inner = (
    <div
      style={{ animationDelay: `${delayMs}ms` }}
      className={cn(
        // `rounded-[1.75rem]` et non `rounded-3xl` : le MÊME rayon que les blocs
        // du haut (barre de série, « On s'y remet ? », carte « aucune matière »).
        // À 24 px contre 28, l'angle des cartes matières se lisait plus sec que
        // celui du bloc juste au-dessus — deux familles de coins sur un écran
        // qui n'empile que des cartes blanches.
        'pop-in rev-card relative flex min-h-[76px] items-center gap-3 rounded-[1.75rem] p-2.5 transition-all duration-150 will-change-transform',
        // LE DOSSIER D'UN GARDIEN SORTI prend l'écarlate de la bannière
        // d'alerte de l'arène — la même classe, donc le même liseré or et le
        // même éclair qui la balaie. Un dossier rouge au milieu de dossiers
        // blancs se voit sans qu'on le cherche, et il se voit d'assez loin
        // pour qu'une fenêtre d'une heure ne passe pas inaperçue.
        gardien
          ? 'traque-eclair text-white'
          : 'bg-white ring-1 ring-black/[0.06]',
        prox && !gardien ? `ring-2 ${prox.ring}` : null,
        !editing &&
          'group-hover:-translate-y-0.5 group-active:translate-y-[2px]',
        editing && 'cursor-pointer',
        editing && !checked && 'opacity-45 grayscale',
      )}
    >
      {/* Pastille « contrôle » : compte à rebours coloré, coin haut-droit. */}
      {exam && prox && !editing && !gardien ? (
        <span
          className={cn(
            'absolute -top-2 right-2 z-20 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold shadow-sm',
            prox.pill,
          )}
        >
          <CalendarClock className="size-3" aria-hidden="true" />
          {/* « J-1 » seul ne veut rien dire à l'oreille : le mot que l'œil lit
              dans le picto d'agenda, le lecteur d'écran l'obtient ici. */}
          <span className="sr-only">Contrôle </span>
          {exam.label}
        </span>
      ) : null}

      {/* La vignette : `object-contain`, jamais rognée ni déformée, même boîte
          d'une carte à l'autre. Purement décorative — le nom porte le sens. */}
      {vignette ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={vignette}
          alt=""
          aria-hidden="true"
          width={320}
          height={320}
          loading="lazy"
          style={{ width: `${ICON_PX}px`, height: `${ICON_PX}px` }}
          className="pointer-events-none shrink-0 select-none object-contain transition-transform duration-200 group-hover:scale-105"
        />
      ) : (
        // Repli sans illustration (Finances personnelles) : l'icône de la
        // matière dans une tuile colorée, à la MÊME taille — même silhouette de
        // carte, pas de mise en page à part.
        <span
          aria-hidden="true"
          style={{ width: `${ICON_PX}px`, height: `${ICON_PX}px` }}
          className={cn(
            'arena-tile pointer-events-none flex shrink-0 items-center justify-center rounded-2xl shadow-sm transition-transform duration-200 group-hover:scale-105',
            theme.arena,
          )}
        >
          <SubjectIcon
            slug={subject.slug}
            className="size-7 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]"
            strokeWidth={2.25}
          />
        </span>
      )}

      {/* Nom + rang. Deux lignes au maximum : au-delà, la rangée se déformerait
          et la grille perdrait son alignement. */}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="font-heading line-clamp-2 text-[15px] leading-tight font-extrabold text-balance">
          {subject.name}
        </span>
        {/* Matière encore sans chapitre : « Bientôt » à la place des couronnes.
            Les couronnes diraient « rang à découvrir », donc « à toi de jouer »,
            devant une page où il n'y a rien à jouer — la promesse serait fausse.
            Le mot dit que le manque vient de nous, pas de l'élève. */}
        {empty ? (
          <span
            className={cn(
              'mt-1 w-fit rounded-full px-2 py-0.5 text-[10px] font-bold',
              gardien
                ? 'bg-white/20 text-white'
                : 'bg-muted text-muted-foreground',
            )}
          >
            Bientôt
            <span className="sr-only"> — pas encore de chapitre</span>
          </span>
        ) : (
          <span className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
            <CrownRating
              rank={rankForValue(pct / 100)}
              subjectName={subject.name}
              sombre={Boolean(gardien)}
            />

            {/* LE NOM DU GARDIEN, en pastille dorée.
                ⚠️ DANS LE FLUX, ET PAS EN PASTILLE DE COIN. Elle était posée
                en absolu à cheval sur le bord haut de la carte, comme celle des
                contrôles — mais `.traque-eclair` porte `overflow: hidden` (son
                éclair balaie de −120 % à +120 %, il DOIT être découpé), et la
                pastille se retrouvait tranchée net. Sur la ligne des couronnes,
                elle ne dépasse de rien, et elle passe à la ligne toute seule
                sur une carte étroite.

                ⚠️ LA COULEUR NE PORTE JAMAIS SEULE. Un garçon sur douze ne
                distingue pas le rouge, et cet écran s'adresse d'abord à des
                collégiens : un dossier qui ne se signale que par sa teinte ne
                se signale pas pour tout le monde. Le nom dit QUI est sorti — ce
                que la couleur ne peut pas dire de toute façon. */}
            {gardien && !editing ? (
              <span className="gardien-pouls flex min-w-0 items-center gap-1 rounded-full bg-highlight px-1.5 py-0.5 text-[10px] leading-tight font-bold text-[color-mix(in_oklch,var(--highlight),black_58%)]">
                <Swords className="size-2.5 shrink-0" aria-hidden="true" />
                <span className="sr-only">Gardien sorti : </span>
                <span className="truncate">{gardien.boss}</span>
                {/* LE COMPTE À REBOURS. Un gardien ne reste sorti qu'UNE HEURE,
                    et le dossier écarlate ne disait pas qu'il y avait urgence —
                    juste qu'il se passait quelque chose. Le chiffre transforme
                    la couleur en échéance.

                    Il n'apparaît qu'une fois l'horloge du client démarrée : au
                    rendu serveur, `maintenant` vaut null et la valeur calculée
                    là-bas serait périmée à la seconde suivante. */}
                {typeof maintenant === 'number' ? (
                  <span className="shrink-0 tabular-nums opacity-80">
                    · {countdownLabel(gardien.endsAt - maintenant)}
                  </span>
                ) : null}
              </span>
            ) : null}
          </span>
        )}
      </span>

      {/* En édition, la coche prend la place du chevron, à droite : le geste est
          « je coche une ligne », pas « je clique un dossier ». Coche VERTE
          (validation) — le jaune reste la monnaie et la récompense. */}
      {editing ? (
        <span
          className={cn(
            'flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors',
            checked
              ? 'border-green-500 bg-green-500 text-white'
              : 'border-muted-foreground/40 bg-muted',
          )}
        >
          {checked ? <Check className="size-3.5" strokeWidth={3} /> : null}
        </span>
      ) : null}
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
  // Pas d'`aria-label` sur ce lien : il REMPLAÇAIT tout son contenu accessible,
  // et avalait donc au passage le rang de maîtrise et le « Bientôt ». Le nom de
  // la matière est déjà du texte, la pastille de contrôle et les couronnes
  // portent maintenant le leur — le nom accessible se compose tout seul, et il
  // dit enfin l'état de la matière au lieu de son seul intitulé.
  return (
    <Link
      href={`/reviser/${subject.slug}`}
      // Le doigt qui se pose relance le dossier visé, en entier : s'il n'est
      // pas parmi les premiers préchargés (PrechargeurDossiers) ou si son
      // entrée a expiré, on gagne le temps du geste. Sans coût s'il est frais.
      onPointerDown={() => prechargerOnglet(router, `/reviser/${subject.slug}`)}
      onClick={() => sfx.tap()}
      className="group block"
    >
      {inner}
    </Link>
  )
}

// Les blocs de matières, en grille de 2 colonnes. Un titre de groupe n'apparaît
// qu'au lycée (tronc commun / spécialités / options) ; ailleurs la grille est
// unique et n'a pas de titre à porter.
//
// `delayOffset` continue le décalage d'apparition d'un bloc à l'autre : le
// programme part de 0, la culture générale reprend là où il s'est arrêté, pour
// que les cartes se posent en une seule vague et non en deux.
function SubjectGrid({
  groups,
  editing,
  isChecked,
  onToggle,
  progressBySlug,
  examBySubject,
  emptySlugs,
  gardiens,
  maintenant,
  delayOffset = 0,
}: {
  groups: SubjectGroup[]
  editing: boolean
  isChecked: (slug: string) => boolean
  onToggle: (slug: string) => void
  progressBySlug: Record<string, number>
  examBySubject: Record<string, SubjectExamHint>
  emptySlugs: Set<string>
  /** Slug → gardien SORTI. Vide la plupart du temps. */
  gardiens: Record<string, GardienSorti>
  /** Battement d'horloge, ou `null` au rendu serveur. */
  maintenant: number | null
  delayOffset?: number
}) {
  let cardIndex = delayOffset
  return (
    <>
      {groups.map(({ label, items }) => (
        <section key={label ?? 'tout'} className="flex flex-col gap-2.5">
          {label ? (
            <h3 className="font-heading px-1 text-xs font-bold tracking-wide text-muted-foreground uppercase">
              {label}
            </h3>
          ) : null}
          <div className="grid grid-cols-2 gap-3">
            {items.map((s) => (
              <SubjectRow
                key={s.id}
                subject={s}
                pct={progressBySlug[s.slug] ?? 0}
                editing={editing}
                checked={isChecked(s.slug)}
                onToggle={() => onToggle(s.slug)}
                exam={examBySubject[s.slug]}
                empty={emptySlugs.has(s.slug)}
                gardien={gardienVivant(gardiens[s.slug], maintenant)}
                maintenant={maintenant}
                delayMs={cardIndex++ * 40}
              />
            ))}
          </div>
        </section>
      ))}
    </>
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
  emptySlugs = EMPTY_SLUGS,
  gardiens = {},
  topSlot,
}: {
  subjects: Subject[]
  selected: string[] | null
  // Toujours nécessaire au regroupement des matières par dossier (tronc commun
  // vs spécialités), même si la puce « Classe de … » a disparu de cet écran.
  grade: string
  progressBySlug: Record<string, number>
  examBySubject?: Record<string, SubjectExamHint>
  /**
   * Les matières SANS chapitre à ce niveau : leur carte porte « Bientôt ». On
   * les masquait ; chaque classe montre désormais son programme entier, quitte
   * à annoncer ce qui n'est pas encore écrit.
   */
  emptySlugs?: Set<string>
  /**
   * Les matières dont le GARDIEN est sorti, par slug.
   *
   * Un boss débusqué ne se voyait que sur l'arène : l'élève apprenait qu'il
   * rôdait sur un onglet et devait deviner tout seul dans quel dossier aller le
   * chercher, en moins d'une heure. La carte de sa matière prend donc
   * l'écarlate de la bannière d'alerte, ici, sur l'écran où l'on choisit ce
   * qu'on révise.
   */
  gardiens?: Record<string, GardienSorti>
  // Blocs insérés au-dessus de la grille des matières (série/semaine, contrôles,
  // reprise…) — rendus côté serveur et passés en enfant.
  topSlot?: React.ReactNode
}) {
  // UNE horloge pour toute la liste, et pas une par carte : c'est elle qui
  // égrène le compte à rebours des gardiens et qui éteint un dossier dès que sa
  // fenêtre se referme. `null` au rendu serveur — on s'en tient alors au verdict
  // du serveur, qui vient de le calculer.
  const maintenant = useClock(CLOCK_STEP_MS)
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

  // Les matières du programme, directement en grille — plus de dossier à
  // ouvrir pour arriver à sa matière.
  const groups = programmeGroups({ subjects: visible, grade })

  // En édition, on ne montre QUE le programme : la culture générale n'est pas
  // sélectionnable, une grille qu'on ne peut pas modifier n'a rien à faire dans
  // un écran de modification.
  const cultureShown = editing ? [] : cultureSubjects

  const programmeCount = groups.reduce((n, g) => n + g.items.length, 0)

  // « Tes matières » : le nom accessible de TOUT l'écran. Il porte deux grilles
  // — le programme, qui n'a plus de titre visible, et la culture générale, qui
  // garde le sien pour se distinguer de la première.
  return (
    <section aria-label="Tes matières">
      {/* Fond crème pleine page, derrière tout le contenu de l'onglet. */}
      <WorldBackdrop className="tab-bg" />
      {/* Les premiers dossiers de la grille, préchargés en arrière-plan une
          fois les onglets servis — pas en édition, où l'on ne les ouvre pas. */}
      <PrechargeurDossiers
        hrefs={
          editing
            ? []
            : dossiersAPrecharger(groups.flatMap((g) => g.items.map((s) => s.slug)))
        }
      />

      {/* Plus de carte d'identité : les blocs d'action (série/semaine,
          contrôles, reprise) arrivent directement, puis la grille des matières. */}
      <div className="relative flex flex-col gap-4 sm:px-1">
        {topSlot ? <div className="flex flex-col gap-4">{topSlot}</div> : null}

        {/* Les trois commandes de l'écran, alignées à droite : trier mes
            matières (crayon), mon carnet, chercher (loupe). La loupe cherche
            dans TOUT le catalogue, culture générale comprise — elle évite de
            faire défiler quand on sait déjà quelle matière on vient ouvrir.

            Plus de titre « Ton programme » au-dessus de la grille : l'onglet
            actif le dit déjà en haut de l'écran, et une grille de matières se
            reconnaît sans qu'on la nomme. Seule la culture générale garde le
            sien, plus bas — c'est ce qui la distingue du programme. */}
        <div className="flex items-center justify-end gap-2 px-1">
          <div className="flex items-center gap-2">
            {/* Le crayon SEUL : « Modifier mes matières » écrit en toutes
                lettres au-dessus d'une grille qui ne contient que des matières,
                c'était nommer deux fois ce que l'on voit. Le libellé reste dans
                l'aria-label, pour le lecteur d'écran. Il disparaît PENDANT
                l'édition : la sortie se fait par « Terminé », un crayon qui
                resterait là promettrait une seconde façon d'entrer. */}
            {editing ? null : (
              <button
                type="button"
                onClick={() => {
                  sfx.tap()
                  setEditing(true)
                }}
                aria-label="Modifier mes matières"
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm ring-1 ring-black/5 transition active:translate-y-px"
              >
                <Pencil className="size-4.5" strokeWidth={2.4} aria-hidden="true" />
              </button>
            )}
            <ProgramSearch subjects={subjects} />
          </div>
        </div>

        {/* On teste le PROGRAMME, pas l'écran entier : la culture générale
            reste visible même quand l'élève n'a plus aucune matière
            sélectionnée, et compter tout ce qui s'affiche ferait alors
            disparaître le seul message qui lui dit comment se réinscrire. */}
        {programmeCount === 0 ? (
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
        ) : (
          <div className="flex flex-col gap-3">
            {/* En édition seulement : la consigne et la sortie. Le reste du
                temps, la grille suit directement la rangée de commandes. */}
            {editing ? (
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
            ) : null}

            <SubjectGrid
              groups={groups}
              editing={editing}
              isChecked={(slug) => picked.has(slug)}
              onToggle={toggle}
              progressBySlug={progressBySlug}
              examBySubject={examBySubject}
              emptySlugs={emptySlugs}
              gardiens={gardiens}
              maintenant={maintenant}
            />
          </div>
        )}

        {/* La culture générale : même traitement que le programme, un titre et
            sa grille. Elle a perdu son dossier à son tour — un pli de plus pour
            cinq modules, c'était cacher du contenu derrière un geste. Elle
            arrive APRÈS le programme, ce qui suffit à dire qu'elle vient en
            second ; l'indice de droite dit qu'elle est du bonus. */}
        {cultureShown.length > 0 ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-2 px-1">
              <h2 className="font-heading text-sm font-bold text-foreground">
                Culture générale
              </h2>
              <p className="shrink-0 text-[11px] font-semibold text-muted-foreground">
                En bonus, à ton rythme
              </p>
            </div>

            {/* Ses matières n'entrent pas dans la sélection : leurs cartes
                restent des liens, jamais des cases à cocher — même en édition,
                où elles ne s'affichent tout simplement pas. */}
            <SubjectGrid
              groups={[{ label: null, items: cultureShown }]}
              editing={false}
              isChecked={() => true}
              onToggle={() => {}}
              progressBySlug={progressBySlug}
              examBySubject={examBySubject}
              emptySlugs={emptySlugs}
              gardiens={gardiens}
              maintenant={maintenant}
              delayOffset={programmeCount}
            />
          </div>
        ) : null}

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
