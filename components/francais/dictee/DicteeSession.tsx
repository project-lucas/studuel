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
  Scroll,
  SkipBack,
  SkipForward,
  Volume2,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  corrigerDictee,
  formatNote,
  noteSur20,
  type Correction,
} from '@/lib/francais/dictee/correction'
import {
  SUPPORT_AIDE,
  SUPPORT_LABEL,
  type SupportDictee,
} from '@/lib/francais/dictee/niveaux'
import { enregistrerDictee } from '@/app/reviser/francais/dictee/actions'
import PanneauRecompenses from '@/components/recompenses/PanneauRecompenses'
import { SEUIL_GEMMES } from '@/lib/economie'
import type { Gain } from '@/lib/gains'
import { useLecteurDictee } from '@/components/francais/dictee/LecteurDictee'
import CorrectionDictee from '@/components/francais/dictee/CorrectionDictee'

export type SegmentDictee = {
  position: number
  texte: string
  /** L'enregistrement du morceau DICTÉ (ponctuation dite), s'il existe. */
  audio?: string | null
}

/**
 * LE CONTEXTE de la dictée (01/11/2026, Lucas : « une dictée intéressante est
 * liée à un contexte politique intéressant : on la replace, et cela nous
 * marque ») — l'écran qui ouvre la session, avant la première écoute.
 */
export type ContexteDictee = {
  /** « 25 décembre 1792 ». */
  date: string
  /** « Testament de Louis XVI (extraits, orthographe modernisée) ». */
  source: string
  /** Trois paragraphes au plus : qui, où, pourquoi ces mots. */
  paragraphes: string[]
}

/**
 * Les caractères que le clavier d'un téléphone cache derrière un appui long —
 * le œ de « cœur » et les majuscules accentuées compris.
 */
const ACCENTS = ['é', 'è', 'ê', 'à', 'ç', 'œ', 'ù', 'î', 'ï', 'ô', 'û', 'É', 'À', '«', '»']

type Etape = 'contexte' | 'ecoute' | 'support' | 'ecriture' | 'papier' | 'score'

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
  audioIntegral = null,
  contexte = null,
  apercu = false,
}: {
  dicteeId: string
  titre: string
  segments: SegmentDictee[]
  retourHref: string
  /** L'enregistrement de la lecture d'une traite. */
  audioIntegral?: string | null
  /** L'écran d'ouverture : la date, la source, l'histoire de ces mots. */
  contexte?: ContexteDictee | null
  /**
   * APERÇU (pages /dev) : la copie se corrige ici, rien n'est envoyé ni
   * enregistré — même règle que la démo, sans compte.
   */
  apercu?: boolean
}) {
  const router = useRouter()
  const { etat, supporte, lire, couper } = useLecteurDictee()
  const [etape, setEtape] = useState<Etape>(contexte ? 'contexte' : 'ecoute')
  const [indexSegment, setIndexSegment] = useState(0)
  const [copie, setCopie] = useState('')
  const [erreursPapier, setErreursPapier] = useState(0)
  const [resultat, setResultat] = useState<{
    note: number
    correction: Correction | null
    gains: Gain[]
    support: SupportDictee
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

  // LE MORCEAU SE DICTE TOUT SEUL quand on arrive dessus (Suivant, Précédent,
  // ou l'entrée dans l'écriture) : c'est ce que fait un professeur. « Réécouter »
  // le rejoue à la demande.
  useEffect(() => {
    if (etape !== 'ecriture' || !segment) return
    lire(segment.texte, segment.audio)
  }, [etape, segment, lire])

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

  // Pas de `sfx.tap()` ici : les deux boutons qui l'appellent sont des `Button`,
  // qui jouent déjà le clic.
  const terminer = (support: SupportDictee) => {
    if (pending) return
    if (apercu) {
      // L'aperçu corrige ici, avec la même fonction que le serveur.
      const correction = corrigerDictee(texteEntier, support === 'papier' ? '' : copie)
      const note =
        support === 'papier'
          ? noteSur20({
              motsAttendus: correction.motsAttendus,
              motsJustes: correction.motsAttendus - Math.min(erreursPapier, correction.motsAttendus),
            })
          : noteSur20(correction)
      setResultat({ note, correction, gains: [], support })
      setEtape('score')
      sfx.complete()
      return
    }
    startTransition(async () => {
      const res = await enregistrerDictee(
        dicteeId,
        support,
        support === 'papier' ? '' : copie,
        erreursPapier,
      )
      setResultat({ note: res.note, correction: res.correction, gains: res.gains, support })
      setEtape('score')
      sfx.complete()
    })
  }

  // ---------------------------------------------------------------- contexte
  if (etape === 'contexte' && contexte) {
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

          <p className="mt-6 flex items-center gap-2 text-sm font-extrabold tracking-wide text-highlight uppercase">
            <Scroll className="size-4" aria-hidden="true" />
            {contexte.date}
          </p>
          <h1 className="font-heading mt-1 text-3xl leading-tight font-extrabold text-balance">
            {titre}
          </h1>

          {/* L'HISTOIRE DE CES MOTS : on les écrit mieux quand on sait qui les
              a dits, et pourquoi. */}
          <div className="mt-5 flex flex-col gap-3 text-[0.98rem] leading-relaxed text-white/90">
            {contexte.paragraphes.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="mt-4 text-xs font-semibold text-white/55">{contexte.source}</p>

          <div className="flex-1" aria-hidden="true" />

          <Button type="button" size="xl" onClick={() => setEtape('ecoute')} className="mt-6 w-full">
            Écouter la dictée
          </Button>
        </div>
      </div>
    )
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
                lire(texteEntier, audioIntegral)
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

          {/* Violet, pas vert : le vert est un verdict, et on n'a encore rien
              écrit. */}
          <Button type="button" size="xl" onClick={() => setEtape('support')} className="w-full">
            Commencer à écrire
          </Button>
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
                    lire(s.texte, s.audio)
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

          <Button
            type="button"
            size="xl"
            disabled={pending}
            onClick={() => terminer('papier')}
            className="w-full"
          >
            {pending ? 'Correction…' : 'Voir mon score'}
          </Button>
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

          {/* LE BALADEUR (01/11/2026, « le mode doit être carré ») : une rangée
              lisible au pouce — revenir, RÉÉCOUTER en grand avec le numéro du
              morceau, avancer —, les accents dessous, puis l'action. Le morceau
              se dicte tout seul quand on arrive dessus. */}
          <div className="mt-3 flex shrink-0 items-center justify-between gap-2 rounded-3xl bg-card p-2 shadow-sm">
            <button
              type="button"
              disabled={indexSegment === 0}
              onClick={() => {
                sfx.tap()
                setIndexSegment((i) => Math.max(0, i - 1))
              }}
              aria-label="Morceau précédent"
              className="flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-muted text-foreground transition active:scale-95 disabled:opacity-30"
            >
              <SkipBack className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => {
                sfx.tap()
                if (segment) lire(segment.texte, segment.audio)
              }}
              aria-label={`Réécouter le morceau ${indexSegment + 1} sur ${segments.length}`}
              className="flex h-12 min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary/10 px-4 font-heading font-extrabold text-primary transition active:scale-95"
            >
              <Volume2
                className={cn('size-5 shrink-0', etat === 'lecture' && 'animate-pulse')}
                aria-hidden="true"
              />
              Réécouter
              <span className="text-sm font-bold text-primary/70 tabular-nums">
                {indexSegment + 1}/{segments.length}
              </span>
            </button>
            <button
              type="button"
              disabled={dernierSegment}
              onClick={() => {
                sfx.tap()
                setIndexSegment((i) => Math.min(segments.length - 1, i + 1))
              }}
              aria-label="Morceau suivant"
              className="flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-muted text-foreground transition active:scale-95 disabled:opacity-30"
            >
              <SkipForward className="size-5" aria-hidden="true" />
            </button>
          </div>

          {/* Les accents que le clavier d'un téléphone cache derrière un appui
              long : sur une dictée, les chercher coûte plus cher que de les
              écrire. */}
          <div className="mt-2 flex shrink-0 gap-1 overflow-x-auto pb-1">
            {ACCENTS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => inserer(c)}
                aria-label={`Insérer ${c}`}
                className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-muted text-base font-bold text-foreground"
              >
                {c}
              </button>
            ))}
          </div>

          {/* L'action : le morceau suivant, et au dernier, CORRIGER. */}
          <Button
            type="button"
            size="xl"
            disabled={pending}
            onClick={() => {
              if (dernierSegment) terminer('telephone')
              else setIndexSegment((i) => i + 1)
            }}
            className="mt-2 w-full shrink-0"
          >
            <Check aria-hidden="true" />
            {pending ? 'Correction…' : dernierSegment ? 'Corriger' : 'Morceau suivant'}
          </Button>
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
          {/* Une dictée est une ÉPREUVE (557) : l'XP suit la note, et dès
              16/20 sur le téléphone elle rapporte des gemmes — c'est l'une
              des rares portes vers elles, on le dit. */}
          <PanneauRecompenses
            gains={resultat?.gains ?? []}
            titre="Gagné"
            className="mt-6 w-full max-w-xs bg-card text-foreground"
          />
          {resultat && resultat.support === 'telephone' && note < SEUIL_GEMMES.dictee ? (
            <p className="mt-3 max-w-xs text-center text-sm font-semibold text-white/75">
              Dès {SEUIL_GEMMES.dictee}/20, une dictée écrite ici rapporte des gemmes.
            </p>
          ) : null}
        </div>

        <div className="mx-auto flex w-full max-w-xl flex-col gap-2.5">
          {resultat?.correction ? (
            <Button
              type="button"
              size="xl"
              onClick={() => setVoirCorrection(true)}
              className="w-full"
            >
              Voir la correction
              <Eye aria-hidden="true" />
            </Button>
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
