'use client'

import { useRef, useState, useSyncExternalStore, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  FileText,
  FolderPlus,
  Pencil,
  Play,
  Plus,
  Settings2,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import BackButton from '@/components/BackButton'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'
import {
  normalizeCourseColor,
  normalizeCourseIcon,
  QUESTION_TYPES,
  TYPE_LABEL,
  type CourseChapter,
  type CourseQuestionType,
} from '@/lib/carnet-cours'
import { tronquerPourIa } from '@/lib/carnet/pdf-texte'
import {
  createChapter,
  createQuestion,
  updateCourse,
} from '@/app/carnet/cours/actions'
import BottomSheet from '@/components/carnet/BottomSheet'
import CourseLook from '@/components/carnet/CourseLook'
import DossiersDuCours from '@/components/carnet/DossiersDuCours'
import GenerationIaSheet from '@/components/carnet/GenerationIaSheet'
import { lireTextePdf } from '@/components/carnet/lirePdf'
import PlanningCours from '@/components/carnet/PlanningCours'
import ReglagesRevision, {
  type CourseReglages,
  type MatiereChoix,
} from '@/components/carnet/ReglagesRevision'
import type { Plan } from '@/lib/carnet/planning'
import SessionOptionsSheet, {
  type EtiquetteChoix,
} from '@/components/carnet/SessionOptionsSheet'
import { COURSE_ICON, COURSE_TINT, TYPE_ICON } from '@/components/carnet/style'
import { hrefRayon } from '@/lib/bibliotheque'
import type { CourseHeader, CourseQuestionRow } from '@/components/carnet/types'

// -----------------------------------------------------------------------------
// L'ÉCRAN D'UN DOSSIER DU CARNET — UN SEUL BLOC, COMME WOOFLASH.
//
// Repris de zéro le 10/09/2026 (Lucas : « tout doit être dans un bloc, pas de
// séparation » ; « épure le tout, on repart de zéro ici » ; puis « comme
// Wooflash »). Au-dessus, la flèche « Mon carnet » ; puis UNE carte blanche
// posée sur le fond crème, et tout est dedans :
//   1. le titre et l'icône, tous deux CUSTOM : on touche l'icône pour changer
//      icône et couleur, on touche le titre pour le réécrire ; le ▶ n'apparaît
//      que quand des cartes sont prêtes ;
//   2. « CHAPITRES & QUESTIONS », le compte, et LE + À CÔTÉ, qui ouvre
//      « Créer du contenu » : créer une question, générer des questions avec
//      l'IA, créer un chapitre, insérer un PDF (lu dans le navigateur, son
//      texte part à l'IA comme un cours collé — `components/carnet/lirePdf`) ;
//   3. les chapitres, une ligne chacun, leurs questions dessous ; le + d'un
//      chapitre ouvre la même feuille, ciblée sur lui.
//
// Ce qui a disparu de cet écran ce jour-là : la carte d'en-tête et sa ligne
// d'introduction, les quatre onglets (Contenu / Résultats / Planning /
// Paramètres), les deux gros boutons du dossier vide, l'icône statistiques,
// la recherche, l'arbre à poignées et menus ⋮ (`CourseTree`), le + flottant,
// la saisie « plusieurs cartes d'un coup » (`SaisieRapide`). Les statistiques
// n'ont plus d'écran.
//
// STUDUEL, 15/09/2026 : les RÉGLAGES DE RÉVISION (plafonds, tolérance, date du
// contrôle, matière — 315/316) et le PLANNING du dossier (353) ne sont pas
// perdus pour autant : ils vivent dans UNE feuille du bas, « Réglages de
// révision », ouverte par l'engrenage à côté du ▶ — ou d'emblée avec
// `?reglages=1`, le lien que propose le ⋯ d'un dossier depuis le carnet.
// -----------------------------------------------------------------------------

export default function CourseScreen({
  course,
  chapters,
  questions,
  etiquettes = [],
  photoDisponible = false,
  reglages,
  matieres,
  plans,
  cartesParChapitre,
  today,
}: {
  course: CourseHeader
  chapters: CourseChapter[]
  questions: CourseQuestionRow[]
  /** Les étiquettes de l'élève, proposées comme portée de session. */
  etiquettes?: EtiquetteChoix[]
  /** Un lecteur d'images est branché côté serveur (voir la page). */
  photoDisponible?: boolean
  /** Les réglages de révision du cours (315/316) et les matières du catalogue. */
  reglages: CourseReglages
  matieres: MatiereChoix[]
  /** Les rendez-vous du planning (353), et le poids de chaque chapitre. */
  plans: Plan[]
  cartesParChapitre: Record<string, number>
  /** Clé de jour UTC d'aujourd'hui. */
  today: string
}) {
  const router = useRouter()
  const params = useSearchParams()
  const [pending, startTransition] = useTransition()

  // Le titre et l'allure.
  const [titreEnSaisie, setTitreEnSaisie] = useState(false)
  const [titreBrouillon, setTitreBrouillon] = useState(course.title)
  const [allureOuverte, setAllureOuverte] = useState(false)

  // Le chapitre qui vient d'être créé se nomme tout de suite.
  const [renommerId, setRenommerId] = useState<string | null>(null)

  // « Créer du contenu » : dans quel chapitre (null = le dossier), et par quelle porte.
  const [ajoutDans, setAjoutDans] = useState<string | null>(null)
  const [ajoutOuvert, setAjoutOuvert] = useState(false)
  const [typeOuvert, setTypeOuvert] = useState(false)
  // `?ia=1` : le dossier vient d'être créé depuis le carnet avec l'IA — la
  // feuille de génération s'ouvre d'emblée, sur le dossier entier.
  const [iaOuverte, setIaOuverte] = useState(params.get('ia') === '1')
  // Le texte d'un PDF lu dans le navigateur, remis à la feuille IA.
  const [textePdf, setTextePdf] = useState<string | undefined>(undefined)
  const [lecturePdf, setLecturePdf] = useState(false)
  const pdfRef = useRef<HTMLInputElement | null>(null)

  const [reviserOuvert, setReviserOuvert] = useState(false)
  // `?reglages=1` : on arrive du ⋯ d'un dossier — la feuille des réglages
  // s'ouvre d'emblée.
  const [reglagesOuverts, setReglagesOuverts] = useState(
    params.get('reglages') === '1',
  )
  // Les feuilles demandées par l'URL (`?ia=1`, `?reglages=1`) ne s'ouvrent
  // qu'APRÈS l'hydratation : une feuille montante ne rend rien côté serveur
  // (pas de `document`), et l'ouvrir dès le premier rendu client faisait
  // diverger le HTML — React rejouait toute la page. Le magasin externe rend
  // `false` au serveur et pendant l'hydratation, `true` ensuite.
  const hydrate = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  const Icone = COURSE_ICON[normalizeCourseIcon(course.icon)]
  const teinte = COURSE_TINT[normalizeCourseColor(course.color)]
  const cartesPretes = questions.filter((q) => q.ready).length

  const validerTitre = () => {
    setTitreEnSaisie(false)
    const titre = titreBrouillon.trim()
    if (titre.length === 0 || titre === course.title) {
      setTitreBrouillon(course.title)
      return
    }
    startTransition(async () => {
      const r = await updateCourse(course.id, { title: titre })
      if (!r.ok) toast('Le titre n’a pas pu être enregistré.', 'error')
      router.refresh()
    })
  }

  const creerChapitre = () => {
    if (pending) return
    setAjoutOuvert(false)
    startTransition(async () => {
      const r = await createChapter(course.id, null)
      if (!r.ok || !r.id) {
        toast('Le chapitre n’a pas pu être créé.', 'error')
        return
      }
      setRenommerId(r.id)
      router.refresh()
    })
  }

  const ouvrirAjout = (chapterId: string) => {
    sfx.tap()
    setAjoutDans(chapterId)
    setAjoutOuvert(true)
  }

  const creerQuestion = (type: CourseQuestionType) => {
    if (pending) return
    setTypeOuvert(false)
    startTransition(async () => {
      const r = await createQuestion(course.id, ajoutDans, type)
      if (!r.ok || !r.id) {
        toast('La question n’a pas pu être créée.', 'error')
        return
      }
      router.push(`/carnet/cours/${course.id}/question/${r.id}`)
    })
  }

  const ouvrirIa = (texte?: string) => {
    setAjoutOuvert(false)
    setTextePdf(texte)
    setIaOuverte(true)
  }
  /** Le + d'un dossier : « Créer du contenu » ciblé sur lui. */

  /** « Insérer un PDF » : le fichier est lu ici, seul son texte part à l'IA. */
  const insererPdf = async (file: File | undefined) => {
    if (!file || lecturePdf) return
    setLecturePdf(true)
    try {
      const brut = await lireTextePdf(file)
      if (brut.trim().length === 0) {
        toast(
          'Ce PDF ne contient pas de texte lisible. Prends la page en photo.',
          'error',
        )
        return
      }
      const { texte, tronque } = tronquerPourIa(brut)
      if (tronque) toast('Le PDF est long : seul le début sera lu.')
      ouvrirIa(texte)
    } catch (e) {
      toast(
        e instanceof Error && e.message === 'pdf-trop-lourd'
          ? 'Ce PDF est trop lourd.'
          : 'Ce PDF n’a pas pu être lu.',
        'error',
      )
    } finally {
      setLecturePdf(false)
      if (pdfRef.current) pdfRef.current.value = ''
    }
  }

  const cibleAjout = chapters.find((c) => c.id === ajoutDans)?.title ?? null

  return (
    <div className="relative mx-auto w-full max-w-md pb-24">
      {/* 0. Le retour : la pastille ronde blanche de toute l'app, au-dessus
          du bloc (audit du 23/09/2026 : dix recettes de retour, une seule
          reste). Le titre, lui, reste DANS le bloc : il s'y renomme. */}
      <div className="mb-3">
        <BackButton fallback={hrefRayon('dossiers')} label="Retour à ma bibliothèque" />
      </div>
      {/* LE BLOC : tout le dossier, posé sur le fond crème. */}
      <section
        aria-busy={pending || lecturePdf}
        className="carte p-4"
      >

        {/* 1. Le titre et l'icône. */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              sfx.tap()
              setAllureOuverte(true)
            }}
            aria-haspopup="dialog"
            aria-label="Changer l’icône et la couleur"
            className={cn(
              'relative flex size-14 shrink-0 cursor-pointer items-center justify-center rounded-2xl transition active:scale-95',
              teinte,
            )}
          >
            <Icone className="size-7" strokeWidth={2.2} aria-hidden="true" />
            <span
              aria-hidden="true"
              className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full bg-white text-primary shadow-sm ring-1 ring-black/5"
            >
              <Pencil className="size-3" strokeWidth={2.6} />
            </span>
          </button>

          <div className="min-w-0 flex-1">
            {titreEnSaisie ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  validerTitre()
                }}
              >
                <input
                  autoFocus
                  value={titreBrouillon}
                  onChange={(e) => setTitreBrouillon(e.target.value)}
                  onFocus={(e) => e.currentTarget.select()}
                  onBlur={validerTitre}
                  maxLength={120}
                  aria-label="Titre du dossier"
                  className="font-heading w-full rounded-xl border border-primary/40 bg-white px-2 py-1 text-lg font-extrabold text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
              </form>
            ) : (
              <button
                type="button"
                onClick={() => {
                  sfx.tap()
                  setTitreBrouillon(course.title)
                  setTitreEnSaisie(true)
                }}
                aria-label={`Renommer ${course.title}`}
                className="group flex w-full cursor-pointer items-center gap-1.5 text-left"
              >
                <h1 className="font-heading line-clamp-2 min-w-0 text-xl leading-snug font-extrabold text-foreground">
                  {course.title}
                </h1>
                <Pencil
                  className="size-3.5 shrink-0 text-muted-foreground/60 group-hover:text-primary"
                  aria-hidden="true"
                />
              </button>
            )}
            <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
              {cartesPretes === 0
                ? 'Aucune carte prête'
                : `${cartesPretes} carte${cartesPretes > 1 ? 's' : ''} prête${cartesPretes > 1 ? 's' : ''}`}
            </p>
          </div>

          {/* L'engrenage : les réglages de révision et le planning, en feuille. */}
          <button
            type="button"
            onClick={() => {
              sfx.tap()
              setReglagesOuverts(true)
            }}
            aria-haspopup="dialog"
            aria-label="Réglages de révision"
            title="Réglages de révision"
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition hover:bg-muted active:scale-90"
          >
            <Settings2
              className="size-4"
              strokeWidth={2.4}
              aria-hidden="true"
            />
          </button>

          {cartesPretes > 0 ? (
            <button
              type="button"
              onClick={() => {
                sfx.tap()
                setReviserOuvert(true)
              }}
              aria-haspopup="dialog"
              aria-label="Réviser ce dossier"
              className="flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition active:scale-90"
            >
              <Play
                className="size-5 fill-current"
                strokeWidth={2.6}
                aria-hidden="true"
              />
            </button>
          ) : null}
        </div>

        {/* 2. « Chapitres & Questions », le compte, et « Ajouter un dossier ».
            Le + de CHAQUE dossier, lui, crée du contenu dedans. */}
        <div className="mt-5 mb-1 flex items-center gap-2">
          <h2 className="font-heading min-w-0 text-base font-extrabold text-foreground">
            Chapitres &amp; Questions
          </h2>
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-extrabold text-primary tabular-nums">
            {questions.length}
          </span>
          {/* L'icône seule, collée au titre : le dossier avec un + dedans. */}
          <button
            type="button"
            disabled={pending || lecturePdf}
            onClick={() => {
              sfx.tap()
              creerChapitre()
            }}
            aria-label="Ajouter un dossier"
            title="Ajouter un dossier"
            className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition active:scale-90 disabled:opacity-60"
          >
            <FolderPlus
              className="size-4"
              strokeWidth={2.4}
              aria-hidden="true"
            />
          </button>
        </div>

        {/* 3. Les chapitres et leurs questions. */}
        <DossiersDuCours
          courseId={course.id}
          chapters={chapters}
          questions={questions}
          renommerId={renommerId}
          onRenommerFin={() => setRenommerId(null)}
          onAjouter={ouvrirAjout}
        />
      </section>

      {/* Le PDF : un champ caché, déclenché depuis « Créer du contenu ». */}
      <input
        ref={pdfRef}
        type="file"
        accept="application/pdf,.pdf"
        onChange={(e) => void insererPdf(e.target.files?.[0])}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />

      {/* Icône et couleur. */}
      <BottomSheet
        open={allureOuverte}
        onClose={() => setAllureOuverte(false)}
        title="Icône et couleur"
      >
        <CourseLook
          icon={course.icon}
          color={course.color}
          disabled={pending}
          onPatch={(p) => {
            if (pending) return
            startTransition(async () => {
              await updateCourse(course.id, p)
              router.refresh()
            })
          }}
        />
      </BottomSheet>

      {/* Réglages de révision (315/316) et planning (353), dans une seule feuille. */}
      <BottomSheet
        open={reglagesOuverts && hydrate}
        onClose={() => setReglagesOuverts(false)}
        title="Réglages de révision"
      >
        <div className="flex flex-col gap-5">
          <ReglagesRevision reglages={reglages} matieres={matieres} />
          <div className="border-t border-black/5" aria-hidden="true" />
          <PlanningCours
            courseId={course.id}
            chapters={chapters}
            plans={plans}
            examOn={reglages.examOn}
            cartesParChapitre={cartesParChapitre}
            today={today}
          />
        </div>
      </BottomSheet>

      {/* Réviser : tout le dossier, un chapitre, une étiquette. */}
      <SessionOptionsSheet
        courseId={course.id}
        chapters={chapters}
        etiquettes={etiquettes}
        open={reviserOuvert}
        onClose={() => setReviserOuvert(false)}
      />

      {/* « Créer du contenu » — la feuille du +, comme Wooflash. */}
      <BottomSheet
        open={ajoutOuvert}
        onClose={() => setAjoutOuvert(false)}
        title={cibleAjout ? `Créer dans « ${cibleAjout} »` : 'Créer du contenu'}
      >
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              sfx.tap()
              setAjoutOuvert(false)
              setTypeOuvert(true)
            }}
            className="font-heading flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-sm font-extrabold text-primary-foreground shadow-sm"
          >
            <Plus className="size-5" strokeWidth={2.6} aria-hidden="true" />
            Créer une question
          </button>
          <button
            type="button"
            onClick={() => {
              sfx.tap()
              ouvrirIa(undefined)
            }}
            className="font-heading flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-highlight/25 px-4 py-3.5 text-sm font-extrabold text-foreground ring-1 ring-highlight/50"
          >
            <Sparkles className="size-4" strokeWidth={2.4} aria-hidden="true" />
            Générer des questions avec l’IA
          </button>
          <button
            type="button"
            disabled={lecturePdf}
            onClick={() => {
              sfx.tap()
              setAjoutOuvert(false)
              pdfRef.current?.click()
            }}
            className="font-heading flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-muted/60 px-4 py-3.5 text-sm font-extrabold text-foreground hover:bg-muted disabled:opacity-60"
          >
            <FileText className="size-4" strokeWidth={2.4} aria-hidden="true" />
            {lecturePdf ? 'Lecture du PDF…' : 'Insérer un PDF'}
          </button>
        </div>
      </BottomSheet>

      {/* Le type de la question. */}
      <BottomSheet
        open={typeOuvert}
        onClose={() => setTypeOuvert(false)}
        title="Quel type de question ?"
      >
        <ul className="flex flex-col gap-1.5">
          {QUESTION_TYPES.map((type) => {
            const IconeType = TYPE_ICON[type]
            return (
              <li key={type}>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => {
                    sfx.tap()
                    creerQuestion(type)
                  }}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-2xl bg-muted/60 px-4 py-3 text-left text-sm font-bold text-foreground hover:bg-muted disabled:opacity-60"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <IconeType
                      className="size-4"
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />
                  </span>
                  {TYPE_LABEL[type]}
                </button>
              </li>
            )
          })}
        </ul>
      </BottomSheet>

      {/* Génération IA — formulaire ET écran de validation. Le texte d'un PDF
          y arrive prérempli, comme un cours collé. */}
      <GenerationIaSheet
        courseId={course.id}
        chapterId={ajoutDans}
        photoDisponible={photoDisponible}
        texteInitial={textePdf}
        origineInitiale={textePdf !== undefined ? 'pdf' : 'texte'}
        open={iaOuverte && hydrate}
        onClose={() => {
          setIaOuverte(false)
          setTextePdf(undefined)
        }}
      />
    </div>
  )
}
