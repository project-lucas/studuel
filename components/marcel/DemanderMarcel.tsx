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
  Camera,
  ChevronDown,
  Crown,
  FileText,
  FileUp,
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
  estPdf,
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
import { lirePdf } from '@/lib/coach/lire-pdf'
import { replier } from './replie'

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
  const fichierPhoto = useRef<HTMLInputElement>(null)
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

  // Une conversation ouverte replie la tête du bureau : le fil a la place.
  const enConversation = messages.length > 0 || occupe
  useEffect(() => {
    replier('conversation', enConversation)
    return () => replier('conversation', false)
  }, [enConversation])

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

  /** Une entrée du menu du « + » : l'appareil photo, la galerie, un fichier, ou les phrases. */
  const ouvrirEntree = (cle: string) => {
    if (cle === 'photo') fichierPhoto.current?.click()
    else if (cle === 'image') fichierImage.current?.click()
    else if (cle === 'fichier') fichierTexte.current?.click()
    else {
      setMenu(false)
      setAmorces(true)
    }
  }

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
            : estPdf(file)
              ? { type: 'texte', nom: file.name, data: await lirePdf(file) }
              : { type: 'texte', nom: file.name, data: await lireTexte(file) },
        )
      } catch (e) {
        toast(
          e instanceof Error && e.message === 'pdf-sans-texte'
            ? 'Ce PDF est une image : prends plutôt la page en photo.'
            : 'Ce fichier n’a pas pu être lu.',
          'error',
        )
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
    if (champ.current) champ.current.style.height = ''
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
    <section className="relative mt-3 flex min-h-0 flex-1 flex-col" data-teinte={spec.teinte}>
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
          className="min-h-0 flex-1 space-y-2.5 overflow-y-auto overscroll-contain px-0.5 pb-[calc(var(--champ-marcel-h,4.5rem)+2.5rem)] [scrollbar-width:thin]"
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

      {/* LE CHAMP FLOTTE (16/10/2026, Lucas : « cette barre peut prendre la
          largeur », « il faut que ce soit la barre qui survole le reste ») :
          il est posé PAR-DESSUS le bas du bureau ou du fil, sur toute la largeur
          de l'écran ; ce qui défile passe derrière lui et se fond dans le mur.
          Les panneaux et le fil gardent en bas la place de sa hauteur
          (`--champ-marcel-h`, useHauteurChamp). */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 max-md:left-1/2 max-md:w-screen max-md:-translate-x-1/2">
        <div aria-hidden="true" className="from-background/95 h-7 bg-gradient-to-t to-transparent" />
        <div className="bg-background pointer-events-auto px-2 pb-2 md:px-0">
          {etat.possible ? (
            <>
              {/* MARCEL ÉCOUTE (16/10/2026) : la pose dit que le micro est ouvert. */}
              {dictee.ecoute ? (
                <div className="mb-2 flex items-end gap-2 px-1" role="status">
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
                ref={refChamp}
                className="bg-card relative rounded-[24px] p-1.5 shadow-[inset_0_0_0_1.5px_color-mix(in_oklch,var(--foreground),transparent_90%),0_-6px_24px_-14px_rgba(36,48,79,.55)]"
              >
                {/* LE « + » OUVRE TOUT (Lucas : « prendre en photo, importer un
                    fichier, tout ») : une liste au-dessus du champ, et un voile
                    pour la refermer d'un toucher ailleurs. */}
                {menu || amorces ? (
                  <button
                    type="button"
                    aria-label="Fermer"
                    tabIndex={-1}
                    onClick={() => {
                      setMenu(false)
                      setAmorces(false)
                    }}
                    className="fixed inset-0 z-0 cursor-default"
                  />
                ) : null}
                {menu ? (
                  <ul className="bg-card absolute bottom-full left-1 z-10 mb-2 w-[min(19rem,calc(100vw-1.5rem))] rounded-[20px] p-1.5 shadow-[0_18px_40px_-16px_rgba(36,48,79,.6),inset_0_0_0_1.5px_color-mix(in_oklch,var(--foreground),transparent_90%)]">
                    {[
                      // La photo n'est proposée que si un modèle sait la lire.
                      ...(vision
                        ? [
                            { cle: 'photo', Icone: Camera, titre: 'Prendre une photo', detail: 'Ta copie, ton cahier, le tableau' },
                            { cle: 'image', Icone: ImagePlus, titre: 'Choisir une image', detail: 'Dans ta galerie' },
                          ]
                        : []),
                      { cle: 'fichier', Icone: FileUp, titre: 'Importer un fichier', detail: 'Un PDF, un texte' },
                      {
                        cle: 'phrases',
                        Icone: Sparkles,
                        titre: 'Phrases toutes prêtes',
                        detail: 'Pour bien commencer ta demande',
                      },
                    ].map(({ cle, Icone, titre, detail }) => (
                      <li key={cle}>
                        <button
                          type="button"
                          onClick={() => {
                            sfx.tap()
                            ouvrirEntree(cle)
                          }}
                          className="hover:bg-secondary/60 active:bg-secondary flex min-h-12 w-full items-center gap-3 rounded-2xl px-2.5 py-1.5 text-left"
                        >
                          <span className="bg-secondary text-primary grid size-9 shrink-0 place-items-center rounded-full">
                            <Icone aria-hidden="true" className="size-[18px]" strokeWidth={2.4} />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[13.5px] leading-tight font-extrabold">{titre}</span>
                            <span className="text-muted-foreground block text-[11.5px] font-semibold">{detail}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {amorces ? (
                  <ul className="bg-card absolute bottom-full left-1 z-10 mb-2 flex w-[min(21rem,calc(100vw-1.5rem))] flex-wrap gap-1.5 rounded-[20px] p-2.5 shadow-[0_18px_40px_-16px_rgba(36,48,79,.6),inset_0_0_0_1.5px_color-mix(in_oklch,var(--foreground),transparent_90%)]">
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
                          className="bg-secondary/70 min-h-10 rounded-full px-3 text-left text-xs font-extrabold transition active:translate-y-px disabled:opacity-50"
                        >
                          {intention.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {/* LA LIGNE DU HAUT, seulement quand on prépare une demande : le
                    mode armé, la matière et les crédits sur UNE ligne (avant :
                    trois lignes qui couvraient les outils). */}
                {!compact ? (
                  <div className="relative z-[1] flex items-center gap-1.5 px-1 pt-0.5 pb-1.5">
                    {mode !== 'question' ? (
                      <span className="outil-pastille inline-flex min-w-0 shrink items-center gap-1 rounded-full py-1 pr-0.5 pl-2.5 text-[11.5px] font-extrabold">
                        <WandSparkles aria-hidden="true" className="size-3.5 shrink-0" />
                        <span className="truncate">{spec.label}</span>
                        <button
                          type="button"
                          onClick={() => choisirMode('question')}
                          aria-label={`Quitter le mode « ${spec.label} »`}
                          className="grid size-7 shrink-0 place-items-center rounded-full"
                        >
                          <X aria-hidden="true" className="size-3.5" strokeWidth={3} />
                        </button>
                      </span>
                    ) : null}
                    {matieres.length > 0 ? (
                      // La matière n'est pas un réglage caché : Marcel ne répond pas
                      // en histoire comme en maths (cf. lib/coach/regimes).
                      <span className="relative inline-flex min-w-0 shrink items-center">
                        <select
                          aria-label="Préciser une matière"
                          value={matiere}
                          onChange={(e) => setMatiere(e.target.value)}
                          disabled={occupeOuPending}
                          className="border-foreground/12 focus:border-primary max-w-[9.5rem] appearance-none truncate rounded-full border-[1.5px] bg-transparent py-1 pr-6 pl-2.5 text-[11.5px] font-extrabold outline-none disabled:opacity-50"
                        >
                          <option value="">Matière ?</option>
                          {matieres.map((m) => (
                            <option key={m.slug} value={m.slug}>
                              {m.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown aria-hidden="true" className="text-muted-foreground pointer-events-none absolute right-2 size-3.5" />
                      </span>
                    ) : null}
                    <span className="text-primary bg-primary/10 ml-auto shrink-0 rounded-full px-2 py-1 text-[11px] font-extrabold">
                      {etat.restants > 0 ? `${etat.restants} crédits` : `${solde.jetons} en recharge`}
                    </span>
                  </div>
                ) : null}

                {sommeil.etat === 'fatigue' && !compact ? (
                  <p className="bg-secondary mx-1 mb-1.5 flex items-center gap-2 rounded-2xl px-3 py-2 text-[11.5px] font-bold">
                    <Moon aria-hidden="true" className="text-primary size-4 shrink-0" />
                    <span className="min-w-0 flex-1">{sommeil.phrase}</span>
                    <Link href="/tresor#recharges" className="text-primary shrink-0 font-extrabold underline-offset-4 hover:underline">
                      Recharger
                    </Link>
                  </p>
                ) : null}

                {outils}

                {piece ? (
                  <p className="bg-background/70 mx-1 mb-1.5 flex items-center gap-2 rounded-xl p-1.5 text-[12px] font-extrabold">
                    {piece.type === 'image' ? (
                      // Aperçu réel : l'élève vérifie qu'il a joint la BONNE photo.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={piece.data} alt="" className="size-10 shrink-0 rounded-lg object-cover" />
                    ) : (
                      <FileText aria-hidden="true" className="text-primary size-5 shrink-0" />
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
                ) : null}

                {/* LA LIGNE DU CHAMP : « + », la saisie qui grandit avec le texte
                    (cinq lignes au plus), le micro, l'envoi. Toujours une ligne. */}
                <div className="relative z-[1] flex items-end gap-1.5">
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
                      'grid size-11 shrink-0 place-items-center rounded-full border-[1.5px] transition active:translate-y-px',
                      menu ? 'border-primary bg-primary/10 text-primary' : 'border-foreground/12 text-muted-foreground',
                    )}
                  >
                    <Plus aria-hidden="true" className={cn('size-5 transition-transform', menu && 'rotate-45')} strokeWidth={2.4} />
                  </button>

                  <label className="sr-only" htmlFor="marcel-question">
                    Ta demande à Marcel
                  </label>
                  <textarea
                    id="marcel-question"
                    ref={champ}
                    value={texte}
                    onChange={(e) => {
                      setTexte(e.target.value)
                      // La saisie grandit avec le texte, jusqu'à cinq lignes.
                      e.target.style.height = 'auto'
                      e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`
                    }}
                    maxLength={400}
                    disabled={occupeOuPending}
                    placeholder={spec.placeholder}
                    rows={1}
                    // Une consigne longue tient sur UNE ligne, coupée en « … » : sur deux
                    // lignes, la seconde disparaissait sous le bord du champ.
                    className="placeholder:text-muted-foreground/70 placeholder-shown:overflow-hidden placeholder-shown:text-ellipsis placeholder-shown:whitespace-nowrap max-h-32 min-h-11 min-w-0 flex-1 resize-none bg-transparent px-1.5 py-[11px] text-[15px] leading-[1.35] font-semibold outline-none"
                  />

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
                      )}
                    >
                      <Mic aria-hidden="true" className="size-5" strokeWidth={2.4} />
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={soumettre}
                    disabled={occupeOuPending || (texte.trim().length === 0 && piece === null)}
                    aria-label="Envoyer à Marcel"
                    className="bg-primary text-primary-foreground grid size-11 shrink-0 place-items-center rounded-full shadow-[0_3px_0_color-mix(in_oklch,var(--primary),black_28%)] transition active:translate-y-px disabled:opacity-40 disabled:shadow-none"
                  >
                    <ArrowUp aria-hidden="true" className="size-5" strokeWidth={2.6} />
                  </button>
                </div>

                {/* Trois entrées : l'appareil photo (`capture`), la galerie, et
                    les fichiers (PDF et texte). */}
                <input
                  ref={fichierPhoto}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    choisirFichier(e.target.files?.[0])
                    e.target.value = ''
                  }}
                />
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
                  accept=".pdf,.txt,.md,.csv,application/pdf,text/plain,text/markdown,text/csv"
                  className="hidden"
                  onChange={(e) => {
                    choisirFichier(e.target.files?.[0])
                    e.target.value = ''
                  }}
                />
              </div>

              {/* La ligne de bas de page, comme partout où une IA répond — une
                  fois la conversation ouverte seulement : devant le bureau,
                  elle mangeait une ligne pour rien. */}
              <p className={cn('text-muted-foreground mt-1.5 px-3 text-center text-[10.5px] leading-snug font-semibold', messages.length === 0 && 'sr-only')}>
                {etat.message} Marcel donne un indice, jamais la réponse toute faite.
              </p>
            </>
          ) : sommeil.etat === 'abonnement' ? (
            // LE GRATUIT : le champ se voit, verrouillé, et un seul bouton d’or
            // ouvre Studuel+. Aucune recharge n’est montrée.
            <div ref={refChamp} className="px-1">
              {/* Marcel TEND LA MAIN (16/10/2026) : on vend une rencontre, pas un cadenas. */}
              <div className="mb-1.5 flex items-end gap-2" aria-hidden="true">
                <PoseMarcel pose="invite" hauteur={56} className="shrink-0 object-contain" />
                <p className="bg-card mb-1 rounded-2xl px-3 py-1.5 text-[12.5px] leading-snug font-bold">
                  Avec Studuel+, je te réponds pour de vrai — et je retiens ce que tu me dis.
                </p>
              </div>
              <Button asChild size="xl" className="bg-highlight text-foreground hover:bg-highlight/90 w-full font-extrabold">
                <Link href="/plus">
                  <Crown aria-hidden="true" />
                  Débloquer Marcel
                </Link>
              </Button>
            </div>
          ) : (
            // MARCEL DORT (15/10/2026) : la limite atteinte se dit en sommeil,
            // avec son réveil et la recharge qui le réveille tout de suite.
            <div
              ref={refChamp}
              className="bg-card rounded-[24px] p-4 text-center shadow-[inset_0_0_0_1.5px_color-mix(in_oklch,var(--foreground),transparent_90%),0_-6px_24px_-14px_rgba(36,48,79,.55)]"
            >
              {sommeil.etat === 'endormi' || sommeil.etat === 'repos' ? (
                <div className="relative mx-auto mb-1 w-fit" aria-hidden="true">
                  <PoseMarcel pose="dort" hauteur={88} className="object-contain" />
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
                  <p className="text-muted-foreground text-[11px] font-semibold">Une recharge ne s’efface pas à la fin du mois.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
