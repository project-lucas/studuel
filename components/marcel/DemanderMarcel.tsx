'use client'

import { useEffect, useRef, useState, useTransition, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BatteryCharging,
  BookMarked,
  ChevronDown,
  Crown,
  FileText,
  ImagePlus,
  Mic,
  Square,
  Moon,
  Plus,
  Sparkles,
  WandSparkles,
  X,
} from 'lucide-react'
import marcelTete from '@/public/images/nav/marcel.webp'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'
import { rangerDansCarnet } from '@/app/marcel/conversations-actions'
import { etatDemande } from '@/lib/coach/jetons'
import { creditsMensuels } from '@/lib/coach/credits'
import { sommeilDe } from '@/lib/coach/sommeil'
import type { DemandeResult } from '@/app/marcel/actions'
import type { Remarque } from '@/lib/coach/remarques'
import { MODES, MODE_PAR_DEFAUT } from '@/lib/coach/outils'
import {
  lireTexte,
  reduireImage,
  refusFichier,
  TYPES_IMAGE,
  type PieceJointe,
} from '@/lib/coach/piece-jointe'
import type { Tier } from '@/lib/subscription'
import { useCoachFil } from './CoachFil'
import CartesProposees from './CartesProposees'
import ReponseMarcel from './ReponseMarcel'
import PoseMarcel from './PoseMarcel'
import { useDictee } from './useDictee'
import { useHauteurChamp } from './useHauteurChamp'

// LE FIL ET LE CHAMP — la moitié basse de l'écran du coach.
//
// C'est la seule chose de l'onglet qui coûte de l'argent, et elle ferme la
// page, volontairement : Marcel est d'abord un repère de méthode.
//
// Le bloc occupe VOLONTAIREMENT le bas de l'écran. Un champ de deux lignes posé
// au milieu du crème se lisait comme une note de bas de page ; ici, c'est
// l'endroit où l'on parle, et il en a la taille. Le fil s'empile au-dessus, la
// dernière réponse touchant le champ — on lit vers le bas, on répond en bas.
//
// LE « + » OUVRE TROIS PORTES, et c'est le geste qui manquait le plus :
//   • une PHOTO — parce que le cours d'un élève, c'est une photo de son cahier,
//     et un exercice bloquant, une photo du manuel ;
//   • un FICHIER TEXTE — le cours tapé, collé depuis l'ordinateur ;
//   • des PHRASES TOUTES PRÊTES — pour celui qui ne sait pas quoi écrire.
// Le PDF est refusé avec une consigne utile plutôt qu'avalé puis illisible.
//
// « DANS MON CARNET » a deux portes, une seule écriture : le bouton sous la
// réponse, et la phrase (« envoie ça dans mon carnet »), reconnue côté serveur.

const INTENTIONS = [
  {
    key: 'compris',
    label: 'Je n’ai pas compris',
    amorce: 'Je n’ai pas compris ce point de mon cours : ',
  },
  {
    key: 'autrement',
    label: 'Explique autrement',
    amorce: 'Explique-moi autrement, plus simplement : ',
  },
  {
    key: 'methode',
    label: 'La méthode, pas la réponse',
    amorce: 'Donne-moi la méthode, pas la réponse, pour : ',
  },
  {
    key: 'interroge',
    label: 'Interroge-moi',
    amorce: 'Pose-moi une question difficile sur : ',
  },
] as const

export type MatiereOption = { slug: string; name: string }

export default function DemanderMarcel({
  tier,
  utilisesAujourdhui,
  depensesMois,
  jetons,
  remarques = [],
  matieres,
  matiereParDefaut,
  vision,
  outils,
  bureau,
}: {
  tier: Tier
  utilisesAujourdhui: number
  /** Crédits dépensés ce mois-ci (migration 378). */
  depensesMois: number
  jetons: number
  /** « Marcel a remarqué » : montré tant que le fil est vide (lib/coach/remarques). */
  remarques?: Remarque[]
  /** Les matières suivies — celles que Marcel sait coacher. */
  matieres: MatiereOption[]
  /** Celle de la mission du jour : l'élève n'a rien à choisir dans le cas normal. */
  matiereParDefaut: string | null
  /** Un modèle capable de LIRE une photo est-il branché ? (lib/coach/ia-vision) */
  vision: boolean
  /**
   * Une rangée posée DANS la
   * carte du champ, au-dessus de la saisie (22/09/2026 : elle vivait en rail
   * de cartes entre le personnage et le champ, et prenait un tiers de l'écran).
   */
  outils?: ReactNode
  /**
   * LE BUREAU (16/10/2026) : les onglets Aujourd’hui · Radar · Toi · Outils,
   * montrés tant qu’aucune conversation n’est ouverte. Il prend la place de
   * « Marcel a remarqué », qui vit désormais dans l’onglet Radar.
   */
  bureau?: ReactNode
}) {
  const {
    id: filId,
    messages,
    cartes,
    occupe,
    envoyer,
    rangeable,
    mode,
    choisirMode,
    lien,
    relance,
    proposition,
    nouveau,
  } = useCoachFil()

  const [texte, setTexte] = useState('')
  const [matiere, setMatiere] = useState<string>(matiereParDefaut ?? '')
  const [menu, setMenu] = useState(false)
  const [amorces, setAmorces] = useState(false)
  const [piece, setPiece] = useState<PieceJointe | null>(null)
  const [range, setRange] = useState(false)
  const [solde, setSolde] = useState({
    jetons,
    utilises: utilisesAujourdhui,
    depenses: depensesMois,
  })
  const [pending, start] = useTransition()
  const champ = useRef<HTMLTextAreaElement>(null)
  // Le bouton des quêtes se pose AU-DESSUS du champ du bureau (useHauteurChamp).
  const refChamp = useHauteurChamp()
  // Dicter sa question : le texte s'ajoute au champ, l'élève relit et envoie.
  const dictee = useDictee((dit) => setTexte((avant) => (avant ? `${avant} ${dit}` : dit)))
  const fichierImage = useRef<HTMLInputElement>(null)
  const fichierTexte = useRef<HTMLInputElement>(null)

  // Un outil du bureau propose une phrase (ou rien, pour armer un mode) : le
  // champ la recopie et prend le focus. C’est l’élève qui envoie.
  // L’état suit la proposition PENDANT le rendu (pas dans un effet) : le
  // focus, lui, est un effet de bord du DOM.
  const [propositionVue, setPropositionVue] = useState(0)
  if (proposition && proposition.n !== propositionVue) {
    setPropositionVue(proposition.n)
    setTexte(proposition.texte)
  }
  useEffect(() => {
    if (proposition) champ.current?.focus()
  }, [proposition])

  // Le bureau ouvert, le champ se fait petit : les onglets ont besoin de la
  // place. Il reprend sa hauteur dès qu’on écrit ou qu’une conversation s’ouvre.
  // Un outil armé ou une pièce jointe : l’élève va écrire, le champ reprend sa taille.
  const compact =
    Boolean(bureau) && messages.length === 0 && !occupe && texte.length === 0 && mode === MODE_PAR_DEFAUT && piece === null

  const spec = MODES[mode]
  const etat = etatDemande({
    tier,
    utilisesAujourdhui: solde.utilises,
    depensesMois: solde.depenses,
    jetons: solde.jetons,
  })
  const occupeOuPending = occupe || pending
  // MARCEL DORT (15/10/2026) : la limite atteinte se dit en sommeil, avec son
  // réveil (le 1er du mois) et la recharge qui le réveille tout de suite.
  const sommeil = sommeilDe(etat, creditsMensuels(tier), new Date())

  const choisirFichier = (file: File | undefined) => {
    if (!file) return
    const refus = refusFichier(file)
    if (refus) {
      toast(refus.erreur, 'error')
      return
    }
    setMenu(false)
    start(async () => {
      try {
        const estImage =
          TYPES_IMAGE.includes(file.type.toLowerCase()) ||
          file.type.startsWith('image/')
        setPiece(
          estImage
            ? { type: 'image', nom: file.name, data: await reduireImage(file) }
            : { type: 'texte', nom: file.name, data: await lireTexte(file) },
        )
      } catch {
        toast('Ce fichier n’a pas pu être lu.', 'error')
      }
    })
  }

  const soumettre = () => {
    if (occupeOuPending) return
    if (texte.trim().length === 0 && !piece) return
    sfx.tap()
    setMenu(false)
    setAmorces(false)
    setRange(false)
    const question = texte
    const jointe = piece
    setTexte('')
    setPiece(null)

    void envoyer(question, matiere === '' ? null : matiere, jointe).then(
      (res) => traiter(res, question, jointe),
    )
  }

  /** L'élève insiste : la fiche du catalogue ne lui suffit pas, le modèle écrit la sienne. */
  const insister = () => {
    if (occupeOuPending || !relance) return
    sfx.tap()
    void envoyer(relance.texte, relance.matiere, null, true).then((res) => traiter(res, relance.texte, null))
  }

  const traiter = (res: DemandeResult, question: string, jointe: PieceJointe | null) => {
        if (res.ok) {
          // Un ordre « range ça dans mon carnet » ne passe par aucun modèle : le
          // serveur le dit (`gratuit`), et le compteur ne bouge pas.
          if (res.gratuit) return
          setSolde((s) => ({
            ...s,
            utilises: s.utilises + 1,
            // Un crédit du mois, ou — au-delà — un jeton.
            depenses: etat.source === 'credit' ? s.depenses + 1 : s.depenses,
            jetons:
              etat.source === 'jeton' ? Math.max(0, s.jetons - 1) : s.jetons,
          }))
          return
        }

        // La demande est rendue au champ : l'élève ne la retape pas.
        setTexte(question)
        setPiece(jointe)

        if (res.erreur) {
          toast(res.erreur, 'error')
        } else if (res.plafond) {
          toast(
            'Tu as beaucoup travaillé aujourd’hui. On reprend demain.',
            'error',
          )
          setSolde((s) => ({ ...s, utilises: s.utilises + 1 }))
        } else if (res.abonnement) {
          toast('Marcel fait partie de Studuel+.', 'error')
        } else if (res.quota) {
          toast('Marcel s’est endormi : tes crédits sont passés.', 'error')
          setSolde((s) => ({ ...s, utilises: s.utilises + 1 }))
        } else if (res.unavailable) {
          toast('Marcel ne peut pas répondre pour le moment.', 'error')
        } else {
          toast('Marcel n’a pas réussi à répondre. Réessaie.', 'error')
        }
  }

  const ranger = () => {
    if (!filId) return
    sfx.tap()
    start(async () => {
      const res = await rangerDansCarnet(filId)
      if (res.ok) {
        setRange(true)
        toast(`C’est dans ta bibliothèque, dans « ${res.cours} ».`, 'success')
      } else if (res.vide) {
        toast('Il n’y a rien à ranger pour l’instant.', 'error')
      } else {
        toast('Je n’ai pas réussi à écrire dans ta bibliothèque.', 'error')
      }
    })
  }

  return (
    <section className="mt-3 flex min-h-0 flex-1 flex-col" data-teinte={spec.teinte}>
      <h2 className="sr-only">Demander à Marcel</h2>

      {/* LE FIL. `aria-live` annonce la réponse sans déplacer le focus —
          l'élève peut enchaîner sans revenir chercher le champ. Il défile
          dans SA boîte (la page, elle, ne bouge pas) : l'écran de Marcel tient
          en une vue, le champ toujours en bas. */}
      {/* MARCEL A REMARQUÉ (15/10/2026, Lucas : « que l'on pense pour eux,
          avant eux ») : avant la première question, ce qu'il a vu dans le
          travail de l'élève, chaque remarque avec son geste et, quand c'est
          utile, la question toute prête à lui poser (elle remplit le champ ;
          c'est l'élève qui l'envoie). Gratuit : rien n'a été demandé au modèle. */}
      {messages.length === 0 && !occupe && bureau ? bureau : null}

      {(messages.length > 0 || occupe) && bureau ? (
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            nouveau()
          }}
          className="text-primary mb-1.5 inline-flex min-h-9 items-center gap-1 self-start px-1 text-[12.5px] font-extrabold"
        >
          <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={2.6} />
          Revenir au bureau
        </button>
      ) : null}

      {!bureau && messages.length === 0 && !occupe && remarques.length > 0 && (
        <section aria-labelledby="marcel-remarque" className="mb-3 min-h-0 flex-1 overflow-y-auto overscroll-contain px-0.5">
          <h3 id="marcel-remarque" className="surtitre text-muted-foreground mb-1.5 px-1">
            Marcel a remarqué
          </h3>
          <ul className="space-y-2">
            {remarques.map((r) => (
              <li key={r.id} className="carte p-3">
                <p className="text-[13px] leading-snug font-bold">{r.texte}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Button asChild size="sm" className="rounded-full">
                    <Link href={r.action.href}>
                      {r.action.label}
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </Button>
                  {r.question && etat.possible ? (
                    <button
                      type="button"
                      onClick={() => {
                        sfx.tap()
                        setTexte(r.question ?? '')
                        champ.current?.focus()
                      }}
                      className="text-primary min-h-9 px-1.5 text-[11.5px] font-extrabold underline-offset-4 hover:underline"
                    >
                      Lui demander
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(messages.length > 0 || occupe) && (
        <div
          className="mb-3 min-h-0 flex-1 space-y-2.5 overflow-y-auto overscroll-contain px-0.5 [scrollbar-width:thin]"
          aria-live="polite"
        >
          {messages.map((message) =>
            message.role === 'eleve' ? (
              <p
                key={message.id}
                className="bg-primary/12 ml-auto max-w-[85%] rounded-[18px] rounded-br-md px-3.5 py-2.5 text-[13.5px] leading-relaxed font-semibold"
              >
                {message.texte}
              </p>
            ) : (
              <div key={message.id} className="flex items-start gap-2.5">
                <Image
                  src={marcelTete}
                  alt=""
                  aria-hidden="true"
                  width={72}
                  height={72}
                  className="size-8 shrink-0 rounded-full object-contain"
                />
                {/* La réponse est mise en page (titres, sections, puces) par
                    ReponseMarcel : une fiche affichée en texte brut montrerait
                    ses dièses et ses tirets. */}
                <div className="bg-card max-w-[85%] rounded-[18px] rounded-bl-md p-3 shadow-[inset_0_0_0_1.5px_color-mix(in_oklch,var(--foreground),transparent_90%)]">
                  <ReponseMarcel texte={message.texte} />
                </div>
              </div>
            ),
          )}

          {/* Pendant qu’il répond, Marcel LIT (16/10/2026) : la pose rend
              l’attente vivante, là où un texte gris se lisait comme une panne. */}
          {occupe && (
            <div className="flex items-end gap-2">
              <PoseMarcel pose="lit" hauteur={64} className="shrink-0 object-contain" />
              <p className="text-muted-foreground mb-2 text-[13px] font-bold">Marcel lit ta demande…</p>
            </div>
          )}

          {/* LA FICHE EXISTE DÉJÀ : Marcel l'a reconnue sans le modèle. Un
              bouton pour l'ouvrir, et une sortie pour qui veut la sienne. */}
          {lien && !occupe && (
            <div className="ml-10 flex flex-wrap items-center gap-2">
              <Button asChild size="sm" className="rounded-full">
                <Link href={lien.href}>
                  {lien.label}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              {relance ? (
                <button
                  type="button"
                  onClick={insister}
                  disabled={occupeOuPending || !etat.possible}
                  className="text-primary min-h-9 px-2 text-[11.5px] font-extrabold underline-offset-4 hover:underline disabled:opacity-50"
                >
                  Écris-moi la mienne · 1 crédit
                </button>
              ) : null}
            </div>
          )}

          {cartes && cartes.length > 0 && !occupe && (
            <CartesProposees key={cartes[0].recto} cartes={cartes} />
          )}

          {/* La porte visible du carnet. Elle ne s'affiche qu'une fois qu'il y a
              quelque chose à ranger — un bouton qui ne peut rien faire ne doit
              pas exister. Les cartes ont leur propre bouton. */}
          {rangeable && !occupe && !cartes && (
            <button
              type="button"
              onClick={ranger}
              disabled={pending || range}
              className={cn(
                'ml-10 inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-[11.5px] font-extrabold transition active:translate-y-px',
                range
                  ? 'bg-success/12 text-success'
                  : 'bg-card text-primary shadow-[inset_0_0_0_1.5px_color-mix(in_oklch,var(--primary),transparent_78%)]',
              )}
            >
              <BookMarked aria-hidden="true" className="size-3.5" />
              {range ? 'Rangé dans ta bibliothèque' : 'Ranger dans ma bibliothèque'}
            </button>
          )}
        </div>
      )}

      {etat.possible ? (
        <>
          {/* MARCEL ÉCOUTE (16/10/2026) : la pose dit que le micro est ouvert. */}
          {dictee.ecoute ? (
            <div className="mb-2 flex shrink-0 items-end gap-2" role="status">
              <PoseMarcel pose="ecoute" hauteur={64} className="shrink-0 object-contain" />
              <p className="bg-card mb-1.5 flex-1 rounded-2xl px-3 py-2 text-[12.5px] leading-snug font-bold">Je t’écoute… parle, puis touche Stop.</p>
              <button
                type="button"
                onClick={dictee.arreter}
                className="bg-destructive/10 text-destructive mb-1.5 inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-[12px] font-extrabold"
              >
                <Square aria-hidden="true" className="size-3.5" fill="currentColor" strokeWidth={0} />
                Stop
              </button>
            </div>
          ) : null}
          <div
            ref={bureau ? refChamp : undefined}
            className={cn(
              'bg-card mt-auto shrink-0 rounded-[26px] p-3 shadow-[inset_0_0_0_1.5px_color-mix(in_oklch,var(--foreground),transparent_90%),0_14px_26px_-22px_rgba(36,48,79,.9)]',
              // Compact : le « + », la saisie et l’envoi sur une seule ligne.
              compact && 'flex flex-wrap items-center gap-x-2',
            )}
          >
            <div className={cn('flex w-full items-center justify-between gap-2', compact && 'hidden')}>
              {/* La matière n'est pas un réglage caché : Marcel ne répond pas en
                  histoire comme en maths (cf. lib/coach/regimes), et c'est ce
                  menu qui le lui dit. Prérempli sur la mission du jour. */}
              {matieres.length > 0 ? (
                <span className="relative inline-flex items-center">
                  <select
                    aria-label="Préciser une matière"
                    value={matiere}
                    onChange={(e) => setMatiere(e.target.value)}
                    disabled={occupeOuPending}
                    className="border-foreground/12 focus:border-primary appearance-none rounded-full border-[1.5px] bg-transparent py-1.5 pr-7 pl-3.5 text-xs font-extrabold outline-none disabled:opacity-50"
                  >
                    <option value="">Préciser une matière</option>
                    {matieres.map((m) => (
                      <option key={m.slug} value={m.slug}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    aria-hidden="true"
                    className="text-muted-foreground pointer-events-none absolute right-2.5 size-3.5"
                  />
                </span>
              ) : (
                <span />
              )}

              <span className="text-primary bg-primary/10 rounded-full px-2.5 py-1 text-[11px] font-extrabold">
                {etat.restants > 0
                  ? `${etat.restants} crédits`
                  : `${solde.jetons} en recharge`}
              </span>
            </div>

            {sommeil.etat === 'fatigue' && (
              <p className="bg-secondary mt-2 flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-[11.5px] font-bold">
                <Moon aria-hidden="true" className="text-primary size-4 shrink-0" />
                <span className="min-w-0 flex-1">{sommeil.phrase}</span>
                <Link href="/tresor#recharges" className="text-primary shrink-0 font-extrabold underline-offset-4 hover:underline">
                  Recharger
                </Link>
              </p>
            )}

            {/* Ce que Marcel sait faire — dans le champ, là où l'on décide ce
                qu'on demande. */}
            {outils}

            {/* Le mode armé se voit DANS le champ, à sa couleur : sinon on tape
                une question ordinaire et on reçoit une fiche sans comprendre
                pourquoi. La croix rend le champ à son usage normal. */}
            {mode !== 'question' && (
              <p className="outil-pastille mt-2 inline-flex items-center gap-1.5 rounded-full py-1 pr-1 pl-3 text-[11.5px] font-extrabold">
                <WandSparkles aria-hidden="true" className="size-3.5" />
                {spec.label}
                <button
                  type="button"
                  onClick={() => choisirMode('question')}
                  aria-label={`Quitter le mode « ${spec.label} »`}
                  className="grid size-6 place-items-center rounded-full"
                >
                  <X aria-hidden="true" className="size-3.5" strokeWidth={3} />
                </button>
              </p>
            )}

            {piece && (
              <p className="bg-background/70 mt-2 flex items-center gap-2 rounded-xl p-2 text-[12px] font-extrabold">
                {piece.type === 'image' ? (
                  // Aperçu réel : l'élève vérifie qu'il a joint la BONNE photo,
                  // et qu'elle est lisible, avant de payer une question.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={piece.data}
                    alt=""
                    className="size-10 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <FileText
                    aria-hidden="true"
                    className="text-primary size-5 shrink-0"
                  />
                )}
                <span className="min-w-0 flex-1 truncate">{piece.nom}</span>
                <button
                  type="button"
                  onClick={() => setPiece(null)}
                  aria-label="Retirer la pièce jointe"
                  className="text-muted-foreground grid size-8 shrink-0 place-items-center rounded-lg"
                >
                  <X aria-hidden="true" className="size-4" />
                </button>
              </p>
            )}

            <label className="sr-only" htmlFor="marcel-question">
              Ta demande à Marcel
            </label>
            <textarea
              id="marcel-question"
              ref={champ}
              value={texte}
              onChange={(e) => setTexte(e.target.value)}
              maxLength={400}
              disabled={occupeOuPending}
              placeholder={spec.placeholder}
              rows={compact ? 1 : 2}
              className={cn(
                'placeholder:text-muted-foreground/70 mt-2 w-full resize-none bg-transparent px-1.5 text-[15px] font-semibold outline-none',
                compact ? 'order-2 mt-0 min-h-[1.75rem] min-w-0 flex-1 basis-0' : 'min-h-[4.25rem]',
              )}
            />

            {menu && (
              <ul className="mb-1 flex flex-wrap gap-1.5">
                {/* La photo n'est proposée que si un modèle sait la lire. */}
                {vision ? (
                  <li>
                    <button
                      type="button"
                      onClick={() => fichierImage.current?.click()}
                      className="bg-background/70 flex min-h-9 items-center gap-1.5 rounded-full px-3 text-xs font-extrabold shadow-[0_2px_0_rgba(36,48,79,.09)] transition active:translate-y-px"
                    >
                      <ImagePlus aria-hidden="true" className="size-3.5" />
                      Une photo
                    </button>
                  </li>
                ) : null}
                <li>
                  <button
                    type="button"
                    onClick={() => fichierTexte.current?.click()}
                    className="bg-background/70 flex min-h-9 items-center gap-1.5 rounded-full px-3 text-xs font-extrabold shadow-[0_2px_0_rgba(36,48,79,.09)] transition active:translate-y-px"
                  >
                    <FileText aria-hidden="true" className="size-3.5" />
                    Un fichier texte
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setAmorces((v) => !v)
                      setMenu(false)
                    }}
                    className="bg-background/70 flex min-h-9 items-center gap-1.5 rounded-full px-3 text-xs font-extrabold shadow-[0_2px_0_rgba(36,48,79,.09)] transition active:translate-y-px"
                  >
                    <Sparkles aria-hidden="true" className="size-3.5" />
                    Phrases toutes prêtes
                  </button>
                </li>
              </ul>
            )}

            {amorces && (
              <ul className="mb-1 flex flex-wrap gap-1.5">
                {INTENTIONS.map((intention) => (
                  <li key={intention.key}>
                    <button
                      type="button"
                      disabled={occupeOuPending}
                      onClick={() => {
                        setTexte(intention.amorce)
                        setAmorces(false)
                        champ.current?.focus()
                      }}
                      className="bg-background/70 min-h-9 rounded-full px-3 text-left text-xs font-extrabold shadow-[0_2px_0_rgba(36,48,79,.09)] transition active:translate-y-px disabled:opacity-50"
                    >
                      {intention.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className={compact ? 'contents' : 'flex items-center justify-between'}>
              <button
                type="button"
                onClick={() => {
                  sfx.tap()
                  setMenu((v) => !v)
                  setAmorces(false)
                }}
                aria-expanded={menu}
                aria-label="Joindre une photo, un fichier, ou une phrase toute prête"
                className={cn(
                  'grid size-11 place-items-center rounded-full border-[1.5px] transition active:translate-y-px',
                  compact && 'order-1',
                  menu
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-foreground/12 text-muted-foreground',
                )}
              >
                <Plus
                  aria-hidden="true"
                  className={cn(
                    'size-5 transition-transform',
                    menu && 'rotate-45',
                  )}
                  strokeWidth={2.4}
                />
              </button>

              {dictee.possible ? (
                <button
                  type="button"
                  onClick={dictee.ecoute ? dictee.arreter : dictee.demarrer}
                  disabled={occupeOuPending}
                  aria-pressed={dictee.ecoute}
                  aria-label={dictee.ecoute ? 'Arrêter la dictée' : 'Dicter ma question'}
                  className={cn(
                    'grid size-11 shrink-0 place-items-center rounded-full transition active:translate-y-px disabled:opacity-40',
                    dictee.ecoute ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-primary',
                    compact ? 'order-3' : 'ml-auto mr-2',
                  )}
                >
                  <Mic aria-hidden="true" className="size-5" strokeWidth={2.4} />
                </button>
              ) : null}
              <button
                type="button"
                onClick={soumettre}
                disabled={
                  occupeOuPending ||
                  (texte.trim().length === 0 && piece === null)
                }
                aria-label="Envoyer à Marcel"
                className={cn(
                  'bg-primary text-primary-foreground grid size-12 place-items-center rounded-full shadow-[0_3px_0_color-mix(in_oklch,var(--primary),black_28%)] transition active:translate-y-px disabled:opacity-40 disabled:shadow-none',
                  compact && 'order-4 size-11',
                )}
              >
                <ArrowUp
                  aria-hidden="true"
                  className="size-5"
                  strokeWidth={2.6}
                />
              </button>
            </div>

            {/* Deux entrées séparées : `capture` propose l'appareil photo sur
                mobile, et l'accept d'un fichier texte n'a rien à faire dans la
                même boîte de dialogue. */}
            <input
              ref={fichierImage}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                choisirFichier(e.target.files?.[0])
                e.target.value = ''
              }}
            />
            <input
              ref={fichierTexte}
              type="file"
              accept=".txt,.md,.csv,text/plain,text/markdown,text/csv"
              className="hidden"
              onChange={(e) => {
                choisirFichier(e.target.files?.[0])
                e.target.value = ''
              }}
            />
          </div>

          {/* La ligne de bas de page, comme partout où une IA répond : elle dit
              ce qu'est Marcel, et ce qu'il faut en faire. Elle porte aussi le
              compteur du jour en clair. */}
          <p className={cn('text-muted-foreground mt-2.5 flex items-start justify-center gap-1.5 px-3 text-center text-[11px] leading-snug font-semibold', compact && 'sr-only')}>
            <Sparkles aria-hidden="true" className="mt-px size-3.5 shrink-0" />
            <span>
              {etat.message} Marcel est un coach IA : il donne un indice, jamais
              la réponse toute faite — vérifie ce qui compte.
            </span>
          </p>
        </>
      ) : sommeil.etat === 'abonnement' ? (
        // LE GRATUIT (16/10/2026, Lucas : « le bouton de Marcel doit être
        // visible pour le freemium, avec une ou deux fonctionnalités offertes ;
        // on bloque les autres pour convaincre de passer au payant »). Le champ
        // se voit, verrouillé, et un seul bouton d’or ouvre Studuel+. Aucune
        // recharge n’est montrée : elles sont réservées aux abonnés.
        <div ref={bureau ? refChamp : undefined} className="mt-auto shrink-0">
          {/* Marcel TEND LA MAIN (16/10/2026) : on vend une rencontre, pas un cadenas. */}
          <div className="mb-1.5 flex items-end gap-2" aria-hidden="true">
            <PoseMarcel pose="invite" hauteur={56} className="shrink-0 object-contain" />
            <p className="bg-card mb-1 rounded-2xl px-3 py-1.5 text-[12.5px] leading-snug font-bold">
              Avec Studuel+, je te réponds pour de vrai — et je retiens ce que tu me dis.
            </p>
          </div>
          {/* Plus de faux champ grisé : le bouton d’or dit déjà ce qui est fermé, et
              la place revient aux onglets (16/10/2026). */}
          <Button asChild size="xl" className="bg-highlight text-foreground hover:bg-highlight/90 mt-2 w-full font-extrabold">
            <Link href="/plus">
              <Crown aria-hidden="true" />
              Débloquer Marcel
            </Link>
          </Button>
          <p className="text-muted-foreground mt-1.5 text-center text-[11px] font-semibold">
            Ta journée et ton radar restent offerts.
          </p>
        </div>
      ) : (
        // MARCEL DORT (15/10/2026, Lucas : « Marcel doit dormir, il se
        // réveillera dans X jours, avec en boutique la possibilité de le
        // recharger »). Jamais « quota » ni « interdit » : il a beaucoup
        // travaillé. Le gratuit, lui, découvre Studuel+. L'ILLUSTRATION de
        // Marcel endormi viendra plus tard : la tête de Marcel, un peu éteinte.
        <div className="bg-card mt-auto rounded-[26px] p-4 text-center shadow-[inset_0_0_0_1.5px_color-mix(in_oklch,var(--foreground),transparent_90%),0_14px_26px_-22px_rgba(36,48,79,.9)]">
          {sommeil.etat === 'endormi' || sommeil.etat === 'repos' ? (
            <div className="relative mx-auto mb-1 w-fit" aria-hidden="true">
              <PoseMarcel pose="dort" hauteur={104} className="object-contain" />
              <span className="font-heading text-primary absolute top-0 -right-3 text-lg font-extrabold">
                z<span className="text-sm">z</span>
              </span>
            </div>
          ) : null}
          <p className="font-heading text-[16px] font-extrabold">{sommeil.titre}</p>
          <p className="text-muted-foreground mt-1 text-[12.5px] font-semibold text-balance">{sommeil.phrase}</p>


          {sommeil.recharger && (
            <div className="mt-3 space-y-1.5">
              <Button asChild size="lg" className="w-full">
                <Link href="/tresor#recharges">
                  <BatteryCharging aria-hidden="true" />
                  Recharger Marcel
                </Link>
              </Button>
              <p className="text-muted-foreground text-[11px] font-semibold">
                Une recharge ne s’efface pas à la fin du mois.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
