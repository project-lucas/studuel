'use client'

import { useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpen, ListChecks } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import { subjectVignette } from '@/lib/subject-style'
import { UNITES, boucleARappeler, plusQue, type BoucleARappeler } from '@/lib/boucle-ouverte'
import {
  brouillonARappeler,
  copieEncoreValable,
  estFrais,
  hrefReprise,
  plusRecent,
  type BrouillonQuiz,
} from '@/lib/quiz-brouillon'
import { stockBrouillons, stockCloses } from '@/lib/quiz-brouillon-local'
import { lectureARappeler, pourcentLu } from '@/lib/lecture-entamee'
import { stockLectures } from '@/lib/lecture-entamee-local'

/**
 * « TU T'ÉTAIS ARRÊTÉ LÀ » — la boucle ouverte sur l'accueil Réviser (effet
 * Zeigarnik, 28/10/2026).
 *
 * UNE carte : la plus récente entre la manche de quiz inachevée (navigateur,
 * ou base pour une manche commencée ailleurs — migration 604) et le cours
 * entamé (navigateur). Deux rappels côte à côte feraient une liste de retards
 * (`boucleARappeler`). Rien du tout quand il n'y a pas de boucle ouverte : on
 * ne fabrique pas de « en cours » à zéro.
 *
 * Une carte BLANCHE (`.carte`) cerclée de violet, sous la carte violette de la
 * recommandation : l'app y dit ce qu'elle conseille, cette carte-ci dit ce que
 * l'élève avait lui-même commencé. Le reste s'écrit par ce qui MANQUE dès la
 * moitié franchie (« Plus que 4 questions »), sinon par le compte exact.
 *
 * Île cliente : les stocks du navigateur ne se lisent qu'ici, sans requête —
 * et comme l'onglet reste monté, la manche qu'on vient de quitter apparaît
 * sans rien relire.
 */
export default function BoucleOuverte({
  brouillonServeur = null,
}: {
  brouillonServeur?: BrouillonQuiz | null
}) {
  const brouillons = useSyncExternalStore(
    stockBrouillons.abonner,
    stockBrouillons.lire,
    stockBrouillons.serveur,
  )
  const closes = useSyncExternalStore(stockCloses.abonner, stockCloses.lire, stockCloses.serveur)
  const lectures = useSyncExternalStore(
    stockLectures.abonner,
    stockLectures.lire,
    stockLectures.serveur,
  )
  const [maintenant] = useState(() => Date.now())

  const copie = copieEncoreValable(brouillonServeur, closes)
  const brouillon = plusRecent(
    brouillonARappeler(brouillons, maintenant),
    copie && estFrais(copie, maintenant) ? copie : null,
  )
  const boucle = boucleARappeler(brouillon, lectureARappeler(lectures, maintenant))
  if (!boucle) return null

  return (
    <section aria-labelledby="boucle-ouverte-titre">
      <h2 id="boucle-ouverte-titre" className="titre-section mb-2 px-1">
        Tu t’étais arrêté là
      </h2>
      <CarteBoucle boucle={boucle} />
    </section>
  )
}

type Vue = {
  href: string
  titre: string
  matiere: string | null
  slug: string | null
  /** La phrase de l'état : « Plus que 4 questions », « Lu à 60 % ». */
  etat: string
  /** Le compte exact, à droite (« 6/10 », « 60 % »). */
  compte: string
  part: number
  action: string
  icone: 'quiz' | 'cours'
}

/** Ce que la carte dit, selon la boucle. Exporté pour l'aperçu `/dev/boucle`. */
export function vueDeBoucle(boucle: BoucleARappeler): Vue {
  if (boucle.genre === 'quiz') {
    const b = boucle.brouillon
    const fait = b.choix.length
    const total = b.questionIds.length
    return {
      href: hrefReprise(b.quizId),
      titre: b.titre,
      matiere: b.matiere,
      slug: b.subjectSlug,
      etat:
        plusQue(fait, total, UNITES.question) ??
        `${fait} question${fait > 1 ? 's' : ''} sur ${total}`,
      compte: `${fait}/${total}`,
      part: total > 0 ? fait / total : 0,
      action: 'Finir le quiz',
      icone: 'quiz',
    }
  }
  const l = boucle.lecture
  const pct = pourcentLu(l.part)
  return {
    href: l.href,
    titre: l.titre,
    matiere: l.matiere,
    slug: l.subjectSlug,
    etat: `Cours lu à ${pct} %`,
    compte: `${pct} %`,
    part: l.part,
    action: 'Reprendre la lecture',
    icone: 'cours',
  }
}

export function CarteBoucle({ boucle }: { boucle: BoucleARappeler }) {
  const vue = vueDeBoucle(boucle)
  const vignette = vue.slug ? subjectVignette(vue.slug) : undefined
  const Icone = vue.icone === 'quiz' ? ListChecks : BookOpen

  return (
    <Link
      href={vue.href}
      onClick={() => sfx.tap()}
      aria-label={`${vue.action} : ${vue.titre}${vue.matiere ? `, ${vue.matiere}` : ''} — ${vue.etat}`}
      className="carte group flex items-center gap-3.5 p-3.5 ring-2 ring-primary/25 transition-transform hover:-translate-y-0.5 active:scale-[0.99]"
    >
      <span aria-hidden="true" className="relative grid size-14 shrink-0 place-items-center">
        {vignette ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={vignette}
            alt=""
            width={320}
            height={320}
            className="pointer-events-none size-14 select-none object-contain"
          />
        ) : (
          <span className="grid size-14 place-items-center rounded-2xl bg-secondary" />
        )}
        <span className="absolute -right-1 -bottom-1 grid size-6 place-items-center rounded-full bg-primary text-primary-foreground ring-2 ring-card">
          <Icone className="size-3.5" strokeWidth={2.8} />
        </span>
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="font-heading line-clamp-2 text-base leading-tight font-extrabold text-balance text-foreground">
          {vue.titre}
        </span>
        <span className="flex items-center justify-between gap-2 text-[11px] font-bold">
          <span className="min-w-0 truncate text-primary">{vue.etat}</span>
          <span className="shrink-0 text-muted-foreground tabular-nums">{vue.compte}</span>
        </span>
        <span
          aria-hidden="true"
          className="block h-2 w-full overflow-hidden rounded-full bg-primary/12"
        >
          <span
            className="block h-full origin-left rounded-full bg-primary"
            style={{ transform: `scaleX(${Math.max(0, Math.min(1, vue.part))})` }}
          />
        </span>
      </span>

      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-[inset_0_-3px_0_rgba(0,0,0,0.18)]"
      >
        <ArrowRight className="size-5" strokeWidth={2.8} />
      </span>
    </Link>
  )
}
