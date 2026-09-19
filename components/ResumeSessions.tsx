'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { ArrowRight, Timer, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'
import { deleteControle } from '@/app/reviser/prep-actions'
import { subjectVignette } from '@/lib/subject-style'
import SubjectIcon from '@/components/SubjectIcon'
import type { MissionKind } from '@/lib/mission'
import type { ExamHeroUrgency } from '@/lib/next-exam'
import type { Subject } from '@/lib/types'

export type ResumeItem = {
  subject: Subject
  chapterId: string
  chapterTitle: string
  /** Ce que la session EST : préparer un contrôle, reprendre, découvrir. */
  kind: MissionKind
  /** Progression du chapitre (0..1) — null pour une session de contrôle. */
  progress: number | null
  minutes: number
  /**
   * L'échéance du contrôle (« Contrôle demain » + ton d'urgence), non nulle
   * UNIQUEMENT sur `kind === 'controle'`. C'est elle qui remonte sur l'arène de
   * l'accueil l'urgence que `pickMission` calcule déjà.
   */
  urgency: ExamHeroUrgency | null
  /**
   * Les séances de révision du plan de ce contrôle (`derivePlanView`), non
   * nulles UNIQUEMENT sur `kind === 'controle'` : c'est ce que comptent les
   * bâtons verts de la carte.
   */
  prep: { done: number; total: number; missed: number } | null
  /**
   * Les jours qui restent avant un contrôle DATÉ (0 = aujourd'hui), null sans
   * date ou hors contrôle : c'est le compte à rebours posé à droite de la
   * carte, là où l'œil va après le titre.
   */
  daysLeft: number | null
  /**
   * L'identifiant du contrôle (table `controles`), non nul UNIQUEMENT sur
   * `kind === 'controle'` : c'est lui que supprime la croix de l'angle quand
   * l'élève s'est trompé de matière, de chapitre ou de date.
   */
  controleId?: string | null
}

/** Le compte à rebours, tel qu'il s'écrit dans la case : « J-5 », « J-0 ». */
export function joursLabel(daysLeft: number): string {
  return `J-${Math.max(0, daysLeft)}`
}

// Le mot qui dit l'état de la session, dans la pastille de la carte de tête.
// Un contrôle parle d'échéance, une découverte de nouveauté, une reprise de
// chemin parcouru — jamais « 0 % », qui n'a de sens pour aucun des trois.
function leadTag(item: ResumeItem): string {
  if (item.kind === 'controle') {
    return item.urgency?.label ?? 'Contrôle à venir'
  }
  if (item.kind === 'decouverte') return 'Nouveau chapitre'
  return `${Math.round((item.progress ?? 0) * 100)} % fait`
}

// Le geste attendu, écrit sur la carte plutôt que deviné à la flèche.
function leadAction(kind: MissionKind): string {
  if (kind === 'controle') return 'Préparer'
  if (kind === 'decouverte') return 'Découvrir'
  return 'Reprendre'
}

/**
 * LA CARTE DE TÊTE — le point focal de l'accueil Réviser.
 *
 * L'écran proposait deux cartes blanches jumelles, dans la même robe que les
 * quinze cartes matières juste en dessous : rien n'y était plus important que
 * rien. Pire, la session de préparation d'un contrôle — la seule raison
 * impérieuse d'ouvrir cet écran un dimanche soir — s'y affichait en « 0 % fait »,
 * parce que la page jetait en route le `kind` et le `countdown` que
 * `pickMission` avait pourtant calculés.
 *
 * Cette carte-ci est VIOLETTE, pleine largeur, et seule de son rang : sur un
 * écran de cartes blanches, c'est le seul bloc plein de la colonne, donc le
 * premier lu. Le violet est le rôle « action » de la DA — et cette carte EST
 * l'action que l'app recommande. Elle passe devant le bouton « + Contrôle »,
 * qui était jusqu'ici le seul objet coloré de l'écran : annoncer un contrôle est
 * une tâche d'intendance, pas ce qu'un élève vient faire.
 *
 * Le corail n'apparaît QUE sur une échéance imminente (≤ 2 jours, décision de
 * `examHeroUrgency`) : une alerte permanente n'alerte plus.
 */
/**
 * LES BÂTONS DE RÉVISION — un par séance du plan de préparation, vert dès
 * qu'elle est faite.
 *
 * L'app planifie déjà 1 à 3 séances espacées avant un contrôle
 * (`lib/prep-plan`), et les compte : « 1/3 ». Mais ce compte ne vivait que dans
 * l'écran de préparation. Sur la carte de tête — le seul bloc que l'élève lit
 * vraiment — la révision espacée était invisible, donc elle ne récompensait
 * rien. Trois bâtons dont deux verts disent d'un coup d'œil ce qu'un « 1/3 »
 * enfoui ne dit jamais : tu es revenu deux fois sur ce chapitre, il t'en reste
 * une, et plus tu y reviens mieux ça tient.
 *
 * Une séance manquée (jour passé, non faite) reste un bâton VIDE, pas rouge :
 * elle n'est pas perdue, elle est encore à faire — l'écran de préparation la
 * replanifie sur aujourd'hui.
 */
function PrepBars({ prep }: { prep: ResumeItem['prep'] }) {
  if (!prep || prep.total === 0) return null

  return (
    <span
      className="mt-1 flex items-center gap-1.5"
      role="img"
      aria-label={`${prep.done} révision${prep.done > 1 ? 's' : ''} sur ${prep.total} avant le contrôle`}
    >
      <span className="flex items-center gap-1" aria-hidden="true">
        {Array.from({ length: prep.total }, (_, i) => (
          <span
            key={i}
            className={cn(
              'h-1.5 w-5 rounded-full transition-colors',
              i < prep.done ? 'bg-success' : 'bg-white/25',
            )}
          />
        ))}
      </span>
      <span
        aria-hidden="true"
        className="text-[10px] font-extrabold text-primary-foreground/70 tabular-nums"
      >
        {prep.done}/{prep.total} révisions
      </span>
    </span>
  )
}

// Le délai après lequel la croix « armée » redevient une simple croix.
const CROIX_DESARMEE_MS = 4000

/**
 * LA CROIX DE L'ANGLE — « je me suis trompé ». Un contrôle annoncé sur la
 * mauvaise matière, le mauvais chapitre ou la mauvaise date restait là jusqu'à
 * sa date : aucun geste de l'accueil ne permettait de le retirer (Lucas,
 * 16/09). Deux taps, pas un : le premier arme la croix (elle se déplie en
 * « Retirer ? »), le second supprime. Une croix seule, à côté d'une carte qui
 * se clique en entier, se touche trop facilement par erreur — et un contrôle
 * effacé emporte son plan de révision avec lui. Elle se désarme seule au bout
 * de quelques secondes.
 */
function CroixControle({
  controleId,
  titre,
}: {
  controleId: string
  titre: string
}) {
  const router = useRouter()
  const [armee, setArmee] = useState(false)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    if (!armee) return
    const t = setTimeout(() => setArmee(false), CROIX_DESARMEE_MS)
    return () => clearTimeout(t)
  }, [armee])

  function onClick() {
    if (pending) return
    sfx.tap()
    if (!armee) {
      setArmee(true)
      return
    }
    startTransition(async () => {
      const res = await deleteControle(controleId)
      if (res.ok) {
        toast('Contrôle retiré')
        router.refresh()
      } else {
        toast('Impossible de retirer ce contrôle pour le moment.', 'error')
        setArmee(false)
      }
    })
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-label={
        armee
          ? `Confirmer : retirer le contrôle ${titre}`
          : `Retirer le contrôle ${titre} (je me suis trompé)`
      }
      aria-pressed={armee}
      className={cn(
        'absolute -top-1.5 -right-1.5 z-10 flex min-h-8 items-center gap-1 rounded-full border-2 border-background text-[11px] font-extrabold shadow-sm transition active:scale-95',
        armee
          ? 'bg-destructive px-2.5 text-white'
          : 'size-8 justify-center bg-white text-muted-foreground hover:text-destructive',
        pending && 'opacity-60',
      )}
    >
      <X className="size-4 shrink-0" strokeWidth={3} aria-hidden="true" />
      {armee ? (pending ? 'Retrait…' : 'Retirer ?') : null}
    </button>
  )
}

function LeadCard({ item }: { item: ResumeItem }) {
  const vignette = subjectVignette(item.subject.slug)
  const tag = leadTag(item)
  const coral = item.kind === 'controle' && item.urgency?.tone === 'coral'

  return (
    <li className="relative min-w-0">
      {item.kind === 'controle' && item.controleId ? (
        <CroixControle controleId={item.controleId} titre={item.chapterTitle} />
      ) : null}
      <Link
        href={`/reviser/${item.subject.slug}/${item.chapterId}`}
        onClick={() => sfx.tap()}
        // « sans date » n'est dit qu'ici et dans la case J-? : dans la pastille,
        // il faisait passer le mot sur deux lignes.
        aria-label={`${leadAction(item.kind)} : ${item.chapterTitle}, ${item.subject.name} — ${tag}${
          item.kind === 'controle' && item.daysLeft === null ? ' (sans date)' : ''
        }, ${item.minutes} minutes`}
        // `rev-appel` : un halo violet s'écarte lentement de la carte (3,2 s).
        // C'est LA recommandation de l'écran — la réponse à « qu'est-ce que je
        // fais maintenant ? » — et elle n'était qu'une carte violette parmi des
        // cartes blanches : distincte, mais silencieuse. Elle a porté un temps
        // le reflet de lumière `attract-sheen--soft` (le balayage de Clash
        // Royale) en plus du halo ; retiré le 16/09 (Lucas : « la bande qui
        // s'arrête au milieu du bloc, c'est bof — garde les ombres »). Le halo
        // reste seul : il désigne la carte par son pourtour, sans rien poser
        // sur son contenu, et il ne se dispute pas le `transform` du survol.
        className="rev-card rev-appel group flex items-center gap-3.5 rounded-[1.75rem] bg-primary p-3.5 text-primary-foreground ring-1 ring-black/5 transition-transform hover:-translate-y-0.5 active:scale-[0.99]"
      >
        {/* La vignette peinte de la matière, en grand : à cette taille elle
            identifie la session avant même la lecture du titre.

            Sur un CONTRÔLE, elle frémit toutes les cinq secondes (`.rev-vibre`,
            globals.css) : c'est la seule carte de l'écran qui porte une
            échéance, et rien d'autre ne l'en distinguait au premier coup d'œil.
            Le conteneur porte la secousse, l'image garde son grossissement au
            survol — deux animations de `transform` sur un même élément se
            chassent l'une l'autre. */}
        <span
          aria-hidden="true"
          className={cn(
            'grid size-14 shrink-0 place-items-center',
            item.kind === 'controle' && 'rev-vibre',
          )}
        >
          {vignette ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={vignette}
              alt=""
              width={320}
              height={320}
              className="pointer-events-none size-14 select-none object-contain transition-transform duration-200 group-hover:scale-105"
            />
          ) : (
            <span className="grid size-14 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/20">
              <SubjectIcon
                slug={item.subject.slug}
                className="size-7 text-primary-foreground"
                strokeWidth={2.25}
              />
            </span>
          )}
        </span>

        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span
            className={cn(
              'w-fit rounded-full px-2 py-0.5 text-[10px] font-extrabold',
              coral
                ? 'bg-destructive text-white'
                : 'bg-white/18 text-primary-foreground ring-1 ring-white/25',
            )}
          >
            {tag}
          </span>

          <span className="font-heading line-clamp-2 text-base leading-tight font-extrabold text-balance">
            {item.chapterTitle}
          </span>

          <span className="flex items-center gap-2 text-[11px] font-bold text-primary-foreground/75">
            <span className="min-w-0 truncate">{item.subject.name}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex shrink-0 items-center gap-1">
              <Timer className="size-3" aria-hidden="true" />
              {item.minutes} min
            </span>
          </span>

          <PrepBars prep={item.prep} />
        </span>

        {/* LES JOURS QUI RESTENT, en case, à droite du titre : « J-5 » en
            grand, « jours » dessous. La pastille du haut le dit déjà en toutes
            lettres (« Contrôle dans 5 jours »), mais un compte à rebours se
            LIT comme un chiffre, pas comme une phrase — c'est lui qui grimpe
            de carte en carte quand on en a plusieurs. Corail sur une échéance
            imminente, comme la pastille. Muet pour le lecteur d'écran : le
            `aria-label` du lien porte déjà l'échéance. */}
        {item.daysLeft !== null ? (
          <span
            aria-hidden="true"
            className={cn(
              'flex shrink-0 flex-col items-center justify-center rounded-2xl px-2.5 py-1.5 ring-1',
              coral
                ? 'bg-destructive text-white ring-white/20'
                : 'bg-white/15 text-primary-foreground ring-white/25',
            )}
          >
            <span className="font-heading text-xl leading-none font-extrabold tabular-nums">
              {joursLabel(item.daysLeft)}
            </span>
            <span className="mt-0.5 text-[9px] leading-none font-extrabold tracking-wide uppercase opacity-80">
              {item.daysLeft === 0
                ? "auj."
                : item.daysLeft === 1
                  ? 'jour'
                  : 'jours'}
            </span>
          </span>
        ) : item.kind === 'controle' ? (
          /* UN CONTRÔLE SANS DATE (créé avant que la date soit obligatoire,
             17/09/2026) : la case reste, et dit ce qui manque. La croix de
             l'angle retire la carte ; on le recrée alors avec sa date. */
          <span
            aria-hidden="true"
            className="flex shrink-0 flex-col items-center justify-center rounded-2xl bg-white/15 px-2.5 py-1.5 text-primary-foreground ring-1 ring-white/25"
          >
            <span className="font-heading text-xl leading-none font-extrabold">
              J-?
            </span>
            <span className="mt-0.5 text-[9px] leading-none font-extrabold tracking-wide uppercase opacity-80">
              sans date
            </span>
          </span>
        ) : null}

        {/* La flèche AVANCE en continu (`rev-fleche`) : le second mouvement de
            la carte, celui qui dit « vas-y ». */}
        <ArrowRight
          aria-hidden="true"
          className="rev-fleche size-5 shrink-0"
          strokeWidth={2.6}
        />
      </Link>
    </li>
  )
}

/**
 * « On commence par ça » — la réponse de l'écran à « qu'est-ce que je fais
 * maintenant ? », en tête de l'accueil Réviser, juste sous la série.
 *
 * UNE carte, et une seule. Le rail horizontal en proposait quatre, la rangée
 * jumelle deux à égalité, et la version d'après gardait encore une « session
 * suivante » en rangée fine sous la carte violette. À chaque fois le même
 * défaut : l'écran rendait à l'élève le choix qu'il est censé lui épargner, et
 * la seconde ligne — un chapitre « Nouveau · 5 min » tiré du classement —
 * n'était la réponse à aucune question qu'il se posait. Le titre promet une
 * recommandation : elle doit être seule pour en être une.
 *
 * UNE EXCEPTION, ET UNE SEULE : LES CONTRÔLES. Quand l'élève en a annoncé
 * plusieurs, chacun a sa carte, empilées — celle du haut est le contrôle qui
 * tombe en premier (les sans-date en dernier, cf. `activeControlesSorted`), et
 * les suivantes descendent avec leur compte à rebours. Ce n'est pas un choix
 * qu'on lui rend : ce sont des échéances qu'il a lui-même posées, et en cacher
 * une derrière l'autre reviendrait à lui faire oublier un contrôle.
 */
export function cartesAMontrer(items: ResumeItem[]): ResumeItem[] {
  const controles = items.filter((i) => i.kind === 'controle')
  if (controles.length > 0) return controles
  return items.slice(0, 1)
}

export default function ResumeSessions({ items }: { items: ResumeItem[] }) {
  const cartes = cartesAMontrer(items)
  if (cartes.length === 0) return null
  // Le titre dit ce que sont les cartes : des contrôles annoncés (« révise
  // pour ton prochain contrôle ici », Lucas, 16/09) ou, sans contrôle, la
  // reprise recommandée par l'app.
  const titre = cartes.some((c) => c.kind === 'controle')
    ? 'Révise pour ton prochain contrôle ici'
    : 'On commence par ça'

  return (
    <section aria-label="Reprendre une session">
      <h2 className="font-heading mb-2 px-1 text-sm font-bold tracking-wide text-muted-foreground uppercase">
        {titre}
      </h2>

      <ul className="flex flex-col gap-2">
        {cartes.map((item) => (
          <LeadCard key={`${item.subject.slug}-${item.chapterId}`} item={item} />
        ))}
      </ul>
    </section>
  )
}
