'use client'

import { useRef, useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowUp,
  BookMarked,
  ChevronDown,
  FileText,
  Gem,
  ImagePlus,
  Plus,
  Sparkles,
  WandSparkles,
  X,
} from 'lucide-react'
import marcelTete from '@/public/images/nav/marcel.webp'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'
import { acheterJetons } from '@/app/marcel/actions'
import { rangerDansCarnet } from '@/app/marcel/conversations-actions'
import {
  GEMMES_PAR_PACK,
  JETONS_PAR_PACK,
  etatDemande,
  manqueGemmes,
  peutAcheter,
} from '@/lib/coach/jetons'
import { MODES } from '@/lib/coach/outils'
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
  jetons,
  gemmes,
  matieres,
  matiereParDefaut,
  vision,
}: {
  tier: Tier
  utilisesAujourdhui: number
  jetons: number
  gemmes: number
  /** Les matières suivies — celles que Marcel sait coacher. */
  matieres: MatiereOption[]
  /** Celle de la mission du jour : l'élève n'a rien à choisir dans le cas normal. */
  matiereParDefaut: string | null
  /** Un modèle capable de LIRE une photo est-il branché ? (lib/coach/ia-vision) */
  vision: boolean
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
  } = useCoachFil()

  const [texte, setTexte] = useState('')
  const [matiere, setMatiere] = useState<string>(matiereParDefaut ?? '')
  const [menu, setMenu] = useState(false)
  const [amorces, setAmorces] = useState(false)
  const [piece, setPiece] = useState<PieceJointe | null>(null)
  const [range, setRange] = useState(false)
  const [solde, setSolde] = useState({
    jetons,
    gemmes,
    utilises: utilisesAujourdhui,
  })
  const [pending, start] = useTransition()
  const champ = useRef<HTMLTextAreaElement>(null)
  const fichierImage = useRef<HTMLInputElement>(null)
  const fichierTexte = useRef<HTMLInputElement>(null)

  const spec = MODES[mode]
  const etat = etatDemande({
    tier,
    utilisesAujourdhui: solde.utilises,
    jetons: solde.jetons,
  })
  const occupeOuPending = occupe || pending

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
      (res) => {
        if (res.ok) {
          // Un ordre « range ça dans mon carnet » ne passe par aucun modèle : le
          // serveur le dit (`gratuit`), et le compteur ne bouge pas.
          if (res.gratuit) return
          setSolde((s) => ({
            ...s,
            utilises: s.utilises + 1,
            // Au-delà du quota, c'est un jeton qui a payé.
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
        } else if (res.quota) {
          toast('Tes questions du jour sont passées.', 'error')
          setSolde((s) => ({ ...s, utilises: s.utilises + 1 }))
        } else if (res.unavailable) {
          toast('Marcel ne peut pas répondre pour le moment.', 'error')
        } else {
          toast('Marcel n’a pas réussi à répondre. Réessaie.', 'error')
        }
      },
    )
  }

  const ranger = () => {
    if (!filId) return
    sfx.tap()
    start(async () => {
      const res = await rangerDansCarnet(filId)
      if (res.ok) {
        setRange(true)
        toast(`C’est dans ton carnet, dans « ${res.cours} ».`, 'success')
      } else if (res.vide) {
        toast('Il n’y a rien à ranger pour l’instant.', 'error')
      } else {
        toast('Je n’ai pas réussi à écrire dans ton carnet.', 'error')
      }
    })
  }

  const acheter = () => {
    sfx.tap()
    start(async () => {
      const res = await acheterJetons(1)
      if (res.ok) {
        setSolde((s) => ({
          ...s,
          jetons: s.jetons + JETONS_PAR_PACK,
          gemmes: Math.max(0, s.gemmes - GEMMES_PAR_PACK),
        }))
        toast(`+${JETONS_PAR_PACK} jetons pour Marcel !`, 'success')
      } else if (res.noGems) {
        toast(manqueGemmes(solde.gemmes) ?? 'Pas assez de gemmes.', 'error')
      } else {
        toast('Achat impossible pour le moment.', 'error')
      }
    })
  }

  return (
    <section className="mt-4" data-teinte={spec.teinte}>
      <h2 className="sr-only">Demander à Marcel</h2>

      {/* LE FIL. `aria-live` annonce la réponse sans déplacer le focus —
          l'élève peut enchaîner sans revenir chercher le champ. */}
      {(messages.length > 0 || occupe) && (
        <div className="mb-3 space-y-2.5" aria-live="polite">
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

          {occupe && (
            <p className="text-muted-foreground ml-10 text-[13px] font-bold">
              Marcel réfléchit…
            </p>
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
              {range ? 'Rangé dans ton carnet' : 'Ranger dans mon carnet'}
            </button>
          )}
        </div>
      )}

      {etat.possible ? (
        <>
          <div className="bg-card rounded-[26px] p-3 shadow-[inset_0_0_0_1.5px_color-mix(in_oklch,var(--foreground),transparent_90%),0_14px_26px_-22px_rgba(36,48,79,.9)]">
            <div className="flex items-center justify-between gap-2">
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
                {etat.restantes > 0
                  ? `${etat.restantes} restantes`
                  : `${solde.jetons} jetons`}
              </span>
            </div>

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
              className="placeholder:text-muted-foreground/70 mt-2 min-h-[7.5rem] w-full resize-none bg-transparent px-1.5 text-[15px] font-semibold outline-none"
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

            <div className="flex items-center justify-between">
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

              <button
                type="button"
                onClick={soumettre}
                disabled={
                  occupeOuPending ||
                  (texte.trim().length === 0 && piece === null)
                }
                aria-label="Envoyer à Marcel"
                className="bg-primary text-primary-foreground grid size-12 place-items-center rounded-full shadow-[0_3px_0_color-mix(in_oklch,var(--primary),black_28%)] transition active:translate-y-px disabled:opacity-40 disabled:shadow-none"
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
          <p className="text-muted-foreground mt-2.5 flex items-start justify-center gap-1.5 px-3 text-center text-[11px] leading-snug font-semibold">
            <Sparkles aria-hidden="true" className="mt-px size-3.5 shrink-0" />
            <span>
              {etat.message} Marcel est un coach IA : il donne un indice, jamais
              la réponse toute faite — vérifie ce qui compte.
            </span>
          </p>
        </>
      ) : (
        // Le mur : deux sorties, jamais une. Et l'une des deux fait grandir
        // Studuel (les gemmes se gagnent en invitant).
        <div className="bg-card rounded-[26px] p-4 text-center shadow-[inset_0_0_0_1.5px_color-mix(in_oklch,var(--foreground),transparent_90%),0_14px_26px_-22px_rgba(36,48,79,.9)]">
          <p className="font-heading text-[15px] font-extrabold">
            {etat.message}
          </p>

          {etat.source !== 'plafond' && (
            <div className="mt-3 space-y-2">
              <button
                type="button"
                onClick={acheter}
                disabled={pending || !peutAcheter(solde.gemmes)}
                className={cn(
                  'flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-3 text-[13px] font-extrabold transition active:translate-y-px',
                  peutAcheter(solde.gemmes)
                    ? 'bg-highlight text-foreground shadow-[0_4px_0_color-mix(in_oklch,var(--highlight),black_25%)]'
                    : 'bg-foreground/8 text-muted-foreground',
                )}
              >
                <Gem aria-hidden="true" className="size-4" />
                {JETONS_PAR_PACK} jetons · {GEMMES_PAR_PACK} gemmes
              </button>

              <p className="text-muted-foreground text-[11px] font-semibold">
                {manqueGemmes(solde.gemmes) ??
                  'Les gemmes se gagnent en invitant des amis.'}
              </p>

              <Link
                href="/tresor"
                className="text-primary flex min-h-11 items-center justify-center gap-1.5 text-xs font-extrabold underline-offset-4 hover:underline"
              >
                <Sparkles aria-hidden="true" className="size-3.5" />
                Ou passer Studuel+ et ne plus y penser
              </Link>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
