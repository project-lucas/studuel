'use client'

import Link from 'next/link'
import { ChevronRight, FileText, GraduationCap } from 'lucide-react'
import { sfx } from '@/lib/sounds'
import type { ExamYear } from '@/lib/annales'

/**
 * Onglet « Annales » : réservé aux années qui finissent sur une épreuve
 * nationale (3e, 1re, Tle). Pour ces élèves, le programme n'est pas une fin en
 * soi — c'est une préparation, et l'écran doit le dire.
 *
 * ⚠️ Les SUJETS OFFICIELS ne sont pas encore en base : aucune table ne les
 * porte. Cet onglet propose donc ce qui existe vraiment — l'épreuve blanche de
 * la matière, en conditions réelles — et annonce le reste sans promettre de
 * date. Le jour où les sujets arrivent (migration + seed, comme les contenus
 * de `scripts/contenu/`), ils se rangent sous le second titre.
 */
export default function AnnalesPanel({
  subject,
  exam,
}: {
  subject: { slug: string; name: string }
  exam: ExamYear
}) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <section aria-labelledby="epreuve-blanche">
        <h2 id="epreuve-blanche" className="font-heading text-lg font-bold">
          T’entraîner dans les conditions
        </h2>
        <p className="mt-0.5 mb-3 text-sm text-muted-foreground">
          Cette année se termine par {exam.label}. L’épreuve blanche de{' '}
          {subject.name} te met dans le temps et le format réels, et te rend un
          bilan chapitre par chapitre.
        </p>
        <Link
          href={`/reviser/examen-blanc?subject=${subject.slug}`}
          onClick={() => sfx.tap()}
          className="group flex items-center gap-3 rounded-2xl border-b-4 border-b-black/25 bg-gradient-to-r from-primary to-[color-mix(in_oklch,var(--primary),black_18%)] p-3.5 text-white shadow-md transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-[2px] active:border-b-2"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <GraduationCap
              className="size-5.5"
              strokeWidth={2.2}
              aria-hidden="true"
            />
          </span>
          <span className="min-w-0 flex-1">
            <span className="font-heading block text-sm leading-tight font-bold">
              Épreuve blanche de {subject.name}
            </span>
            <span className="mt-0.5 block text-[11px] font-semibold text-white/75">
              Conditions réelles · bilan chapitre par chapitre
            </span>
          </span>
          <ChevronRight
            className="size-5 shrink-0 text-white/70 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </section>

      <section aria-labelledby="sujets-officiels">
        <h2 id="sujets-officiels" className="font-heading text-lg font-bold">
          Sujets tombés au {exam.short.toLowerCase()}
        </h2>
        <div className="mt-3 flex flex-col items-center gap-2 rounded-2xl border border-dashed bg-card/50 px-4 py-8 text-center">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FileText className="size-6" aria-hidden="true" />
          </span>
          <p className="font-heading font-bold">Pas encore de sujet ici</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Les annales de {subject.name} ne sont pas encore dans l’app. En
            attendant, l’épreuve blanche ci-dessus se joue sur tout le
            programme de l’année.
          </p>
        </div>
      </section>
    </div>
  )
}
