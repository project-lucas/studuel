'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Check,
  Eye,
  Minus,
  Plus,
  RotateCw,
  SkipBack,
  Volume2,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  formatNote,
  type Correction,
} from '@/lib/francais/dictee/correction'
import {
  SUPPORT_AIDE,
  SUPPORT_LABEL,
  type SupportDictee,
} from '@/lib/francais/dictee/niveaux'
import { enregistrerDictee } from '@/app/reviser/francais/dictee/actions'
import { useLecteurDictee } from '@/components/francais/dictee/LecteurDictee'
import CorrectionDictee from '@/components/francais/dictee/CorrectionDictee'

export type SegmentDictee = { position: number; texte: string }

/** Les caractères accentués que le clavier d'un téléphone cache. */
const ACCENTS = ['é', 'è', 'ê', 'à', 'ç', 'î', 'ô', 'û', '«', '»']

type Etape = 'ecoute' | 'support' | 'ecriture' | 'papier' | 'score'

/**
 * LA SESSION DE DICTÉE — cinq temps, un seul composant.
 *
 *   ÉCOUTE   la dictée en entier, avant d'écrire un mot. C'est la méthode, et
 *            l'écran de présentation vient de la conseiller : la sauter ici la
 *            rendrait bavarde pour rien.
 *   SUPPORT  téléphone ou papier. Un élève qui révise le brevet a intérêt à
 *            écrire à la main ; celui qui est dans le bus n'a que son écran.
 *   ÉCRITURE segment par segment, avec les contrôles d'un vrai baladeur :
 *            revenir en arrière, réécouter, et les accents que le clavier cache.
 *   SCORE    la note sur 20, seule, en grand.
 *   CORRECTION la copie mot à mot, puis les explications.
 *
 * La copie est gardée dans UN seul champ, pas un par segment : une dictée est
 * un texte continu, et un élève qui se rend compte au troisième segment qu'il a
 * mal écrit le premier doit pouvoir remonter le corriger.
 */
export default function DicteeSession({
  dicteeId,
  titre,
  segments,
  retourHref,
}: {
  dicteeId: string
  titre: string
  segments: SegmentDictee[]
  retourHref: string
}) {
  const router = useRouter()
  const { etat, supporte, lire, couper } = useLecteurDictee()
  const [etape, setEtape] = useState<Etape>('ecoute')
  const [indexSegment, setIndexSegment] = useState(0)
  const [copie, setCopie] = useState('')
  const [erreursPapier, setErreursPapier] = useState(0)
  const [resultat, setResultat] = useState<{
    note: number
    correction: Correction | null
  } | null>(null)
  const [voirCorrection, setVoirCorrection] = useState(false)
  const [pending, startTransition] = useTransition()
  const zoneRef = useRef<HTMLTextAreaElement | null>(null)

  const texteEntier = segments.map((s) => s.texte).join(' ')
  const segment = segments[indexSegment]
  const dernierSegment = indexSegment + 1 >= segments.length

  // La voix se tait dès qu'on change d'étape : sans ça, la lecture intégrale
  // continue par-dessus l'écran d'écriture.
  useEffect(() => {
    couper()
  }, [etape, couper])

  const inserer = (caractere: string) => {
    const zone = zoneRef.current
    if (!zone) return
    const debut = zone.selectionStart ?? copie.length
    const fin = zone.selectionEnd ?? debut
    const suivant = copie.slice(0, debut) + caractere + copie.slice(fin)
    setCopie(suivant)
    // Le curseur repart APRÈS le caractère inséré : sans ce report, il
    // retomberait au début et l'élève écrirait sa phrase à l'envers.
    window.setTimeout(() => {
      zone.focus()
      zone.setSelectionRange(debut + caractere.length, debut + caractere.length)
    }, 0)
  }

  const terminer = (support: SupportDictee) => {
    if (pending) return
    sfx.tap()
    startTransition(async () => {
      const res = await enregistrerDictee(
        dicteeId,
        support,
        support === 'papier' ? '' : copie,
        erreursPapier,
      )
      setResultat({ note: res.note, correction: res.correction })
      setEtape('score')
      sfx.complete()
    })
  }

  // ------------------------------------------------------------------ écoute
  if (etape === 'ecoute') {
    return (
      <div className="flex min-h-svh flex-col bg-[color-mix(in_oklab,var(--foreground),black_8%)] px-5 py-4 text-white">
        <div className="mx-auto flex w-full max-w-xl flex-1 flex-col">
          <button
            type="button"
            onClick={() => router.push(retourHref)}
            aria-label="Quitter la dictée"
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white text-foreground shadow-sm"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </button>

          <h1 className="font-heading mt-6 text-center text-2xl font-extrabold text-balance">
            {titre}
          </h1>

          <div className="flex flex-1 flex-col items-center justify-center gap-8">
            {/* L'ONDE — elle bat pendant la lecture, elle dort sinon. C'est le
                seul signe que la voix est bien partie : sur un téléphone en
                silencieux, rien d'autre ne le dirait. */}
            <div className="flex h-28 items-center gap-2" aria-hidden="true">
              {[0.5, 0.75, 1, 0.65, 0.9, 0.55].map((h, i) => (
                <span
                  key={i}
                  className={cn(
                    'w-3 rounded-full bg-white transition-all duration-300',
                    etat === 'lecture' && 'animate-pulse',
                  )}
                  style={{
                    height: `${h * 100}%`,
                    animationDelay: `${i * 90}ms`,
                  }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                sfx.tap()
                lire(texteEntier)
              }}
              aria-label="Écouter la dictée en entier"
              className="flex size-14 cursor-pointer items-center justify-center rounded-full bg-white/15 text-white transition active:scale-95"
            >
              <RotateCw className="size-6" strokeWidth={2.4} aria-hidden="true" />
            </button>

            {!supporte ? (
              <p className="max-w-xs text-center text-sm opacity-80">
                Ton navigateur ne sait pas lire à voix haute. Tu peux quand même
                faire la dictée : le texte s’affichera à la correction.
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => {
              sfx.tap()
              setEtape('support')
            }}
            className="quiz-plaque h-14 w-full text-lg font-extrabold text-white [--plaque-bas:color-mix(in_oklab,var(--success),black_14%)] [--plaque-bord:color-mix(in_oklab,var(--success),black_50%)] [--plaque-haut:color-mix(in_oklab,var(--success),white_14%)]"
          >
            Commencer à écrire
          </button>
        </div>
      </div>
    )
  }

  // ----------------------------------------------------------------- support
  if (etape === 'support') {
    return (
      <div className="flex min-h-svh flex-col px-5 py-4">
        <div className="mx-auto w-full max-w-xl">
          <button
            type="button"
            onClick={() => setEtape('ecoute')}
            aria-label="Revenir à l’écoute"
            className="flex size-10 cursor-pointer items-center justify-center rounded-full text-foreground"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </button>

          <h1 className="font-heading mt-6 text-center text-3xl leading-tight font-extrabold text-balance text-foreground">
            Comment souhaites-tu faire cette dictée&nbsp;?
          </h1>

          <ul className="mt-10 flex flex-col gap-4">
            {(['telephone', 'papier'] as SupportDictee[]).map((s) => (
              <li key={s} className="relative">
                {s === 'telephone' ? (
                  <span className="absolute -top-3 right-4 z-10 rounded-full bg-success px-3 py-1 text-xs font-extrabold text-white">
                    Recommandé
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    sfx.tap()
                    setEtape(s === 'papier' ? 'papier' : 'ecriture')
                  }}
                  className={cn(
                    'w-full cursor-pointer rounded-3xl border-2 bg-card p-5 text-left transition active:translate-y-px',
                    s === 'telephone'
                      ? 'border-success'
                      : 'border-black/10',
                  )}
                >
                  <span className="font-heading block text-lg font-extrabold text-foreground">
                    {SUPPORT_LABEL[s]}
                  </span>
                  <span className="mt-1 block text-sm leading-snug text-muted-foreground">
                    {SUPPORT_AIDE[s]}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  // ------------------------------------------------------------------ papier
  if (etape === 'papier') {
    return (
      <div className="flex min-h-svh flex-col px-5 py-4">
        <div className="mx-auto flex w-full max-w-xl flex-1 flex-col">
          <button
            type="button"
            onClick={() => setEtape('support')}
            aria-label="Changer de support"
            className="flex size-10 cursor-pointer items-center justify-center rounded-full text-foreground"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </button>

          <h1 className="font-heading mt-6 text-2xl font-extrabold text-balance text-foreground">
            Combien d’erreurs as-tu faites&nbsp;?
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Écoute chaque morceau, écris sur ta feuille, puis compare avec la
            correction et compte tes erreurs.
          </p>

          {/* Les segments, réécoutables un par un — même sur papier, l'élève a
              besoin du baladeur. */}
          <ul className="mt-5 flex flex-col gap-1.5">
            {segments.map((s, i) => (
              <li key={s.position}>
                <button
                  type="button"
                  onClick={() => {
                    sfx.tap()
                    lire(s.texte)
                  }}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border-2 border-black/10 bg-card px-4 py-3 text-left"
                >
                  <Volume2
                    className="size-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-bold text-foreground">
                    Morceau {i + 1}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setErreursPapier((n) => Math.max(0, n - 1))}
              aria-label="Une erreur de moins"
              className="flex size-12 cursor-pointer items-center justify-center rounded-full border-2 border-black/10 bg-card"
            >
              <Minus className="size-5" aria-hidden="true" />
            </button>
            <span className="font-heading w-20 text-center text-4xl font-extrabold text-foreground tabular-nums">
              {erreursPapier}
            </span>
            <button
              type="button"
              onClick={() => setErreursPapier((n) => n + 1)}
              aria-label="Une erreur de plus"
              className="flex size-12 cursor-pointer items-center justify-center rounded-full border-2 border-black/10 bg-card"
            >
              <Plus className="size-5" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1" aria-hidden="true" />

          <button
            type="button"
            disabled={pending}
            onClick={() => terminer('papier')}
            className="quiz-plaque h-14 w-full text-lg font-extrabold text-white disabled:opacity-60 [--plaque-bas:color-mix(in_oklab,var(--success),black_14%)] [--plaque-bord:color-mix(in_oklab,var(--success),black_50%)] [--plaque-haut:color-mix(in_oklab,var(--success),white_14%)]"
          >
            {pending ? 'Correction…' : 'Voir mon score'}
          </button>
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------------- écriture
  if (etape === 'ecriture') {
    return (
      <div className="flex min-h-svh flex-col px-4 py-3">
        <div className="mx-auto flex w-full max-w-xl flex-1 flex-col">
          {/* La progression par SEGMENT, et la sortie. */}
          <div className="flex shrink-0 items-center gap-3">
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={segments.length}
              aria-valuenow={indexSegment + 1}
              aria-label={`Morceau ${indexSegment + 1} sur ${segments.length}`}
              className="h-4 min-w-0 flex-1 overflow-hidden rounded-full bg-black/12 ring-1 ring-black/5 ring-inset"
            >
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300"
                style={{
                  width: `${((indexSegment + 1) / segments.length) * 100}%`,
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => router.push(retourHref)}
              aria-label="Quitter la dictée"
              className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <textarea
            ref={zoneRef}
            value={copie}
            onChange={(e) => setCopie(e.target.value)}
            placeholder="Commence à écrire ici…"
            aria-label="Ta dictée"
            // `autoCorrect`/`spellCheck` COUPÉS : la moitié de l'exercice est
            // l'orthographe. Laisser le téléphone corriger, c'est noter le
            // clavier à la place de l'élève.
            autoCorrect="off"
            autoCapitalize="sentences"
            spellCheck={false}
            className="mt-3 min-h-64 flex-1 resize-none rounded-3xl border-2 border-primary/30 bg-card p-4 text-base leading-relaxed text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-primary/60"
          />

          {/* LE BALADEUR : revenir, réécouter, les accents, et la suite. */}
          <div className="mt-3 flex shrink-0 items-center gap-2">
            <button
              type="button"
              disabled={indexSegment === 0}
              onClick={() => {
                sfx.tap()
                setIndexSegment((i) => Math.max(0, i - 1))
              }}
              aria-label="Morceau précédent"
              className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground disabled:opacity-30"
            >
              <SkipBack className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => {
                sfx.tap()
                if (segment) lire(segment.texte)
              }}
              aria-label="Réécouter ce morceau"
              className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-foreground"
            >
              <Volume2 className="size-5" aria-hidden="true" />
            </button>

            {/* Les accents que le clavier d'un téléphone cache derrière un appui
                long : sur une dictée, les chercher coûte plus cher que de les
                écrire. */}
            <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
              {ACCENTS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => inserer(c)}
                  aria-label={`Insérer ${c}`}
                  className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-muted text-sm font-bold text-foreground"
                >
                  {c}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={pending}
              onClick={() => {
                sfx.tap()
                if (dernierSegment) terminer('telephone')
                else setIndexSegment((i) => i + 1)
              }}
              className="quiz-plaque h-11 shrink-0 gap-1.5 px-4 text-sm font-extrabold text-white disabled:opacity-60 [--plaque-bas:color-mix(in_oklab,var(--primary),black_12%)] [--plaque-bord:color-mix(in_oklab,var(--primary),black_44%)] [--plaque-haut:color-mix(in_oklab,var(--primary),white_12%)]"
            >
              <Check className="size-4" aria-hidden="true" />
              {dernierSegment ? 'Terminer' : 'Suivant'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------------- score
  const note = resultat?.note ?? 0
  return (
    <>
      <div className="flex min-h-svh flex-col bg-[color-mix(in_oklab,var(--foreground),black_8%)] px-5 py-6 text-white">
        <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center">
          <p className="text-5xl" aria-hidden="true">
            {note >= 15 ? '🏆' : note >= 10 ? '💪' : '📚'}
          </p>
          <p className="mt-4 text-2xl font-semibold">Ton score :</p>
          <p className="font-heading mt-1 text-7xl font-extrabold tabular-nums">
            {formatNote(note)} / 20
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-xl flex-col gap-2.5">
          {resultat?.correction ? (
            <button
              type="button"
              onClick={() => {
                sfx.tap()
                setVoirCorrection(true)
              }}
              className="quiz-plaque h-14 w-full gap-2 text-lg font-extrabold text-foreground [--plaque-bas:color-mix(in_oklab,var(--card),black_6%)] [--plaque-bord:color-mix(in_oklab,var(--card),black_30%)] [--plaque-haut:var(--card)]"
            >
              Voir la correction
              <Eye className="size-5" aria-hidden="true" />
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => router.push(retourHref)}
            className="h-12 w-full cursor-pointer rounded-full text-sm font-extrabold text-white/70 transition hover:text-white"
          >
            Retour aux dictées
          </button>
        </div>
      </div>

      {voirCorrection && resultat?.correction ? (
        <CorrectionDictee
          correction={resultat.correction}
          onFermer={() => setVoirCorrection(false)}
        />
      ) : null}
    </>
  )
}
