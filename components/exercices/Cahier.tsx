import Link from 'next/link'
import { Check, ChevronRight, Crown, FileText, Lock } from 'lucide-react'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import type { LigneCahier } from '@/lib/exercices/cahier-server'
import { COMPETENCES } from '@/lib/exercices/types'
import { cn } from '@/lib/utils'
import { Etoiles } from './Etoiles'
import s from './manuel.module.css'

/**
 * LE SOMMAIRE DU CAHIER — les trois exercices du chapitre, du plus doux au
 * plus corsé, reliés par un chemin pointillé. Le premier est ouvert, chacun
 * des suivants s'ouvre quand le précédent est réussi. Chaque carte annonce ses
 * étoiles (la difficulté), sa compétence, et ce qu'elle rapporte en gemmes.
 *
 * Au bout du chemin, le contrôle blanc (la copie notée sur 20 par l'IA, 360) :
 * la dernière marche, pour qui veut s'entraîner « comme en classe ».
 */
export default function Cahier({
  lignes,
  base,
  premium,
  controle,
}: {
  lignes: LigneCahier[]
  /** /reviser/<matière>/<chapitre>/exercice */
  base: string
  premium: boolean
  /** Le contrôle blanc est-il proposé au bout du chemin ? */
  controle: boolean
}) {
  const reussis = lignes.filter((l) => l.etat === 'reussi').length
  const gemmesEnJeu = lignes.filter((l) => l.etat !== 'reussi').reduce((n, l) => n + l.gemmes, 0)
  const tousReussis = reussis === lignes.length

  return (
    <div className={cn(s.manuel, 'mx-auto flex w-full max-w-xl flex-col gap-4')}>
      <section className="flex items-center gap-3 rounded-3xl bg-[var(--card)] p-4 shadow-[0_0_0_1.5px_var(--border)]">
        <div className="min-w-0 flex-1">
          <p className="font-heading text-lg leading-tight font-extrabold">Ton cahier d’exercices</p>
          <p className="mt-0.5 text-[0.85rem] leading-snug text-[var(--muted-foreground)]">
            {tousReussis
              ? 'Tout est réussi. Bravo ! Tu peux refaire chaque exercice quand tu veux.'
              : 'Des documents à observer, des problèmes à résoudre. Chaque exercice réussi ouvre le suivant.'}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="font-heading text-2xl leading-none font-extrabold tabular-nums">
            {reussis}
            <span className="text-base text-[var(--muted-foreground)]">/{lignes.length}</span>
          </span>
          {gemmesEnJeu > 0 ? (
            <span className={s.recompense} title="Gemmes encore à gagner">
              <CristalIcon className="size-4" /> {gemmesEnJeu}
            </span>
          ) : null}
        </div>
      </section>

      <ol className="relative flex flex-col gap-3.5">
        <span className={s.chemin} aria-hidden="true" />
        {lignes.map((l, i) => {
          const precedent = lignes[i - 1]
          return (
            <li key={l.id} className="relative">
              <CarteExercice ligne={l} href={`${base}/${l.position}`} premium={premium} precedent={precedent?.position ?? null} />
            </li>
          )
        })}
        {controle ? (
          <li className="relative">
            <Link
              href={`${base}/controle`}
              className={cn(s.carteExo, 'flex items-center gap-3 p-3.5 transition active:scale-[0.99]', !tousReussis && 'opacity-80')}
            >
              <span className={cn(s.numero, '!bg-[var(--primary)] !shadow-[0_3px_0_color-mix(in_oklch,var(--primary),black_30%)]')} aria-hidden="true">
                <FileText className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="surtitre block">Pour aller plus loin</span>
                <span className="font-heading block text-[1.05rem] leading-tight font-extrabold">Le contrôle blanc</span>
                <span className="block text-[0.8rem] text-[var(--muted-foreground)]">Une copie à rédiger, notée sur 20 par le prof IA.</span>
              </span>
              <ChevronRight className="size-5 shrink-0 text-[var(--muted-foreground)]" aria-hidden="true" />
            </Link>
          </li>
        ) : null}
      </ol>
    </div>
  )
}

function CarteExercice({
  ligne: l,
  href,
  premium,
  precedent,
}: {
  ligne: LigneCahier
  href: string
  premium: boolean
  precedent: number | null
}) {
  const verrouille = l.etat === 'verrouille' || !premium
  const reussi = l.etat === 'reussi'
  const contenu = (
    <>
      <div className="flex items-start gap-3">
        <span
          className={cn(
            s.numero,
            reussi && '!bg-[var(--success)] !shadow-[0_3px_0_color-mix(in_oklch,var(--success),black_30%)]',
            verrouille && '!bg-[color-mix(in_oklch,var(--foreground),white_55%)] !shadow-none',
          )}
          aria-hidden="true"
        >
          {reussi ? <Check className="size-5" strokeWidth={3.2} /> : verrouille ? <Lock className="size-4" strokeWidth={2.6} /> : l.position}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <Etoiles n={l.etoiles} />
            <span className="surtitre">{COMPETENCES[l.competence] ?? ''}</span>
          </div>
          <p className={cn('font-heading mt-0.5 text-[1.12rem] leading-tight font-extrabold text-balance', verrouille && 'text-[var(--muted-foreground)]')}>
            <span className="sr-only">Exercice {l.position} : </span>
            {l.titre}
          </p>
        </div>
        <span className={cn(s.recompense, 'shrink-0', (reussi || verrouille) && 'opacity-60 grayscale')} aria-label={`${l.gemmes} gemmes`}>
          <CristalIcon className="size-4" />+{l.gemmes}
        </span>
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-2 pl-[3rem]">
        {reussi ? (
          <span className="flex flex-wrap items-center gap-1.5">
            <span className={cn(s.sceau, 'bg-[color-mix(in_oklch,var(--success),white_84%)] text-[color-mix(in_oklch,var(--success),black_25%)]')}>
              <Check className="size-3" strokeWidth={3.4} /> Réussi · {l.resultat?.meilleurScore ?? 0}/{l.resultat?.max ?? 0}
            </span>
            {l.resultat?.parfait ? (
              <span className={cn(s.sceau, 'bg-[color-mix(in_oklch,var(--highlight),white_72%)] text-[color-mix(in_oklch,var(--highlight),black_55%)]')}>
                <Crown className="size-3" /> Sans faute
              </span>
            ) : null}
          </span>
        ) : verrouille ? (
          <span className="text-[0.8rem] font-semibold text-[var(--muted-foreground)]">
            {!premium ? 'Avec Studuel+' : precedent ? `Réussis l’exercice ${precedent} pour l’ouvrir` : 'Bientôt ouvert'}
          </span>
        ) : (
          <span className="text-[0.8rem] font-semibold text-[var(--muted-foreground)]">
            {l.nbQuestions} question{l.nbQuestions > 1 ? 's' : ''}
            {l.resultat ? ` · meilleur essai ${l.resultat.meilleurScore}/${l.resultat.max}` : ''}
          </span>
        )}
        {!verrouille ? (
          <span
            className={cn(
              'inline-flex shrink-0 items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-extrabold',
              reussi ? 'bg-[var(--muted)] text-[var(--foreground)]' : 'bg-[var(--primary)] text-white shadow-[0_3px_0_color-mix(in_oklch,var(--primary),black_30%)]',
            )}
          >
            {reussi ? 'Refaire' : l.resultat ? 'Réessayer' : 'Commencer'}
            <ChevronRight className="size-4" aria-hidden="true" />
          </span>
        ) : null}
      </div>
    </>
  )

  if (verrouille)
    return (
      <div className={cn(s.carteExo, s.carteExoVerrouillee, 'p-3.5')} aria-disabled="true">
        {contenu}
      </div>
    )
  return (
    <Link href={href} className={cn(s.carteExo, 'block p-3.5 transition hover:-translate-y-0.5 active:scale-[0.99]')}>
      {contenu}
    </Link>
  )
}
