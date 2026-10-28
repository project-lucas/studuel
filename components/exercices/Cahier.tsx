'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check, ChevronRight, Crown, FileText, Lock, Star } from 'lucide-react'
import cahierIcone from '@/public/images/supports/cahier.webp'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import type { LigneCahier } from '@/lib/exercices/cahier-server'
import { COMPETENCES } from '@/lib/exercices/types'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import ChoixNiveau from './ChoixNiveau'
import s from './manuel.module.css'

/**
 * LE CAHIER DU CHAPITRE — trois exercices, du plus doux au plus corsé, et un
 * seul à l'écran à la fois (26/10/2026, Lucas : « sur les exercices par niveau
 * (étoiles), je préfère que tu les présentes comme lorsque l'on présente le
 * contrôle blanc, c'est plus clair et compréhensible »). La liste verticale
 * reliée par un chemin pointillé est partie : en tête, une plaque sombre façon
 * jeu mobile (les trois étoiles à décrocher, les gemmes en jeu — « plus simple
 * ou plus jeu vidéo mobile »), puis le choix du niveau ★ / ★★ / ★★★ sur le
 * même gabarit que le contrôle blanc (`ChoixNiveau`), et la carte de
 * l'exercice choisi. Un niveau verrouillé se choisit quand même : sa carte
 * dit ce qu'il faut réussir pour l'ouvrir.
 *
 * Au bout du chemin, le contrôle blanc (la copie notée sur 20 par l'IA, 360)
 * et, quand le manuel du thème continue, le chapitre suivant — à la place du
 * sommaire du manuel, retiré le même jour (Lucas : « renvoyer simplement au
 * chapitre ou exercice suivant »).
 */
export default function Cahier({
  lignes,
  base,
  premium,
  controle,
  chapitreSuivant = null,
}: {
  lignes: LigneCahier[]
  /** /reviser/<matière>/<chapitre>/exercice */
  base: string
  premium: boolean
  /** Le contrôle blanc est-il proposé au bout du chemin ? */
  controle: boolean
  /** Le chapitre suivant du manuel du thème, s'il y en a un. */
  chapitreSuivant?: { titre: string; href: string } | null
}) {
  const reussis = lignes.filter((l) => l.etat === 'reussi').length
  const gemmesEnJeu = lignes.filter((l) => l.etat !== 'reussi').reduce((n, l) => n + l.gemmes, 0)
  const tousReussis = reussis === lignes.length

  // Le niveau ouvert en premier : celui qui attend l'élève (le premier non
  // réussi et non verrouillé), ou le premier du cahier quand tout est fait.
  const [position, setPosition] = useState<number>(
    () => (lignes.find((l) => l.etat === 'ouvert') ?? lignes[0]).position,
  )
  const choisie = lignes.find((l) => l.position === position) ?? lignes[0]

  return (
    <div className={cn(s.manuel, 'mx-auto flex w-full max-w-xl flex-col gap-3')}>
      <EnTeteCahier lignes={lignes} reussis={reussis} gemmesEnJeu={gemmesEnJeu} tousReussis={tousReussis} />

      <ChoixNiveau
        label="Niveau de l’exercice"
        valeur={position}
        options={lignes.map((l) => ({
          valeur: l.position,
          etoiles: l.etoiles,
          libelle: libelleNiveau(l.etoiles),
          etat: premium ? l.etat : 'verrouille',
        }))}
        onChoisir={(p) => {
          if (p === position) return
          sfx.tap()
          setPosition(p)
        }}
      />

      <CarteExercice
        key={choisie.id}
        ligne={choisie}
        href={`${base}/${choisie.position}`}
        premium={premium}
        precedent={lignes.find((l) => l.position === choisie.position - 1)?.position ?? null}
      />

      {controle ? (
        <Link
          href={`${base}/controle`}
          onClick={() => sfx.tap()}
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
      ) : null}

      {chapitreSuivant ? (
        <Link
          href={chapitreSuivant.href}
          onClick={() => sfx.tap()}
          className={cn(s.carteExo, 'flex items-center gap-3 p-3.5 transition active:scale-[0.99]')}
        >
          <span className="min-w-0 flex-1">
            <span className="surtitre block">Chapitre suivant</span>
            <span className="font-heading block text-[1.05rem] leading-tight font-extrabold text-balance">{chapitreSuivant.titre}</span>
          </span>
          <ArrowRight className="size-5 shrink-0 text-[var(--primary)]" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  )
}

/** ★ Facile, ★★ Moyen, ★★★ Difficile — les mêmes mots que le contrôle blanc. */
function libelleNiveau(etoiles: 1 | 2 | 3): string {
  return etoiles === 1 ? 'Facile' : etoiles === 2 ? 'Moyen' : 'Difficile'
}

/**
 * LA PLAQUE DU CAHIER — sombre, façon écran de niveau d'un jeu mobile : le
 * cahier dessiné, le titre, les trois étoiles à décrocher (une par exercice
 * réussi, en or) et ce que le reste rapporte en gemmes. Rien d'autre : la
 * règle « chaque exercice réussi ouvre le suivant » se lit sur la carte d'un
 * niveau verrouillé, pas dans un paragraphe.
 */
function EnTeteCahier({
  lignes,
  reussis,
  gemmesEnJeu,
  tousReussis,
}: {
  lignes: LigneCahier[]
  reussis: number
  gemmesEnJeu: number
  tousReussis: boolean
}) {
  return (
    <section className="carte-sombre relative flex items-center gap-3 overflow-hidden p-3 pr-3.5">
      {/* Deux disques pâles pour la profondeur, posés une fois (pas d'animation). */}
      <span aria-hidden="true" className="pointer-events-none absolute -top-10 -right-6 size-32 rounded-full bg-white/8" />
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-12 left-16 size-24 rounded-full bg-white/5" />
      <Image
        src={cahierIcone}
        alt=""
        sizes="60px"
        className="relative h-auto w-[3.75rem] shrink-0 drop-shadow-[0_6px_8px_rgba(0,0,0,0.35)]"
      />
      <div className="relative min-w-0 flex-1">
        <p className="font-heading text-lg leading-tight font-extrabold">Cahier d’exercices</p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <span
            className="flex items-center gap-1"
            role="img"
            aria-label={`${reussis} exercice${reussis > 1 ? 's' : ''} réussi${reussis > 1 ? 's' : ''} sur ${lignes.length}`}
          >
            {lignes.map((l) => (
              <span
                key={l.id}
                className={cn(
                  'grid size-6 place-items-center rounded-full',
                  l.etat === 'reussi'
                    ? 'bg-highlight text-foreground shadow-[0_2px_0_color-mix(in_oklch,var(--highlight),black_30%)]'
                    : 'bg-white/12 text-white/40',
                )}
              >
                <Star className="size-3.5" fill="currentColor" strokeWidth={0} aria-hidden="true" />
              </span>
            ))}
          </span>
          <span aria-hidden="true" className="ml-0.5 font-mono text-sm font-extrabold tabular-nums">
            {reussis}
            <span className="opacity-60">/{lignes.length}</span>
          </span>
        </div>
      </div>
      {tousReussis ? (
        <span className="relative flex shrink-0 items-center gap-1 rounded-full bg-success px-2.5 py-1 text-xs font-extrabold text-white shadow-sm">
          <Check className="size-3.5" strokeWidth={3.5} aria-hidden="true" /> Terminé
        </span>
      ) : gemmesEnJeu > 0 ? (
        <span
          className="relative flex shrink-0 items-center gap-1 rounded-full bg-white py-1 pr-2.5 pl-1.5 text-sm font-extrabold text-foreground shadow-sm"
          aria-label={`${gemmesEnJeu} gemmes à gagner`}
        >
          <CristalIcon className="size-4" /> {gemmesEnJeu}
        </span>
      ) : null}
    </section>
  )
}

/** La carte de l'exercice choisi : ce qu'il demande, ce qu'il rapporte, et par où y entrer. */
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
          <span className="surtitre block">{COMPETENCES[l.competence] ?? ''}</span>
          <p className={cn('font-heading mt-0.5 text-[1.12rem] leading-tight font-extrabold text-balance', verrouille && 'text-[var(--muted-foreground)]')}>
            <span className="sr-only">Exercice {l.position} : </span>
            {l.titre}
          </p>
        </div>
        <span className={cn(s.recompense, 'shrink-0', (reussi || verrouille) && 'opacity-60 grayscale')} aria-label={`${l.gemmes} gemmes`}>
          <CristalIcon className="size-4" />+{l.gemmes}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 pl-[3rem]">
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
    <Link href={href} onClick={() => sfx.tap()} className={cn(s.carteExo, 'block p-3.5 transition hover:-translate-y-0.5 active:scale-[0.99]')}>
      {contenu}
    </Link>
  )
}
