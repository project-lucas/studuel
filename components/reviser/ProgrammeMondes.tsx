'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ChevronLeft, Crown, ListChecks, Lock, Search, Star, Timer, X } from 'lucide-react'
import PortailFixe from '@/components/PortailFixe'
import CarteReprendre from '@/components/reviser/CarteReprendre'
import ChapterItem from '@/components/reviser/ChapterItem'
import IconeTheme from '@/components/reviser/IconeTheme'
import { useFavorisProgramme } from '@/components/reviser/useFavorisProgramme'
import { useSupportsDeFiche } from '@/components/reviser/useSupportsDeFiche'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { cleDossier } from '@/lib/reviser/favoris'
import { iconeDuTheme, type IconeTheme as NomIcone } from '@/lib/reviser/icone-theme'
import {
  CLE_SANS_THEME,
  estFavori,
  mondesDuProgramme,
  ordonnerMondes,
  repriseDuProgramme,
  type EtatMonde,
  type Monde,
} from '@/lib/reviser/programme'
import {
  accesQuizChapitre,
  chapterQuizHref,
  fichesNumerotees,
  hasChapterQuiz,
  matchChapters,
  phraseAccesQuiz,
  type ChapterRow,
  type ResumeCta,
} from '@/lib/subject-template'

/** Le paramètre d'URL qui porte le thème ouvert (`?theme=Fonctions`). */
const PARAM_THEME = 'theme'

/**
 * La marque posée sur l'entrée d'historique d'un thème ouvert DEPUIS LA GRILLE :
 * la grille est alors juste derrière, et refermer le thème n'est qu'un retour.
 * Elle vit dans `history.state` (Next y recopie ses propres clés), donc elle
 * survit au remontage de la page — au retour d'un cours, par exemple —, là où
 * un `useRef` repartait de zéro et laissait une entrée en double.
 */
const MARQUE_OUVERT_ICI = 'studuelThemeOuvertIci'

function ouvertDepuisLaGrille(): boolean {
  const etat: unknown = window.history.state
  return Boolean(
    etat && typeof etat === 'object' && (etat as Record<string, unknown>)[MARQUE_OUVERT_ICI],
  )
}

/** « 3 fiches », « 1 fiche ». */
const fiches = (n: number) => `${n} fiche${n > 1 ? 's' : ''}`

function compteDuMonde(monde: Monde): string {
  const { done, total } = monde.avancement
  if (monde.etat === 'termine') return `${total}/${fiches(total)} · Terminé`
  return monde.etat === 'entame' ? `${done}/${fiches(total)}` : fiches(total)
}

/**
 * LE PROGRAMME EN GRILLE — les grands thèmes en tuiles, deux par rangée.
 *
 * Maquette « B · Les mondes », choisie par Lucas le 01/10/2026 contre trois
 * autres : tout le programme tient sur un écran, chaque thème porte son
 * pictogramme et son anneau, et la seule plaque violette est la carte
 * « Reprendre ». Elle remplace les plaques violettes empilées (`ChapterList`,
 * qui reste l'écran des listes à plat et des rayons d'un seul bloc).
 *
 * TROIS VUES, une seule à la fois :
 *   · la GRILLE — la carte « Reprendre », puis les tuiles, favoris en tête ;
 *   · UN THÈME — ses fiches, dépliables sur place comme avant ;
 *   · la RECHERCHE — ouverte par la loupe flottante, sur toutes les fiches.
 *
 * LE THÈME OUVERT VIT DANS L'URL (`?theme=`, écrit par `history.pushState`, que
 * Next raccorde à `useSearchParams`) : le bouton retour du téléphone referme le
 * thème au lieu de quitter la matière, et revenir d'un cours rouvre le thème
 * qu'on avait quitté.
 */
export default function ProgrammeMondes({
  chapters,
  resume,
  subjectSlug,
  subjectName,
  grade,
}: {
  chapters: ChapterRow[]
  /** La fiche de la dernière session de révision, si l’élève en a une. */
  resume: ResumeCta | null
  subjectSlug: string
  subjectName: string
  grade: string
}) {
  const params = useSearchParams()
  const cleOuverte = params.get(PARAM_THEME)
  const mondes = useMemo(() => mondesDuProgramme(chapters), [chapters])
  const ouvert = cleOuverte ? (mondes.find((m) => m.cle === cleOuverte) ?? null) : null

  const [choix, basculerFavori] = useFavorisProgramme(cleDossier(subjectSlug, grade))
  const ordonnes = useMemo(() => ordonnerMondes(mondes, choix), [mondes, choix])
  const reprise = useMemo(() => repriseDuProgramme(chapters, resume), [chapters, resume])
  const { fiche, supports, chargement, basculer, ouvrir, fermer } =
    useSupportsDeFiche(subjectSlug)

  const [recherche, setRecherche] = useState(false)
  const [query, setQuery] = useState('')

  const haut = useRef<HTMLDivElement>(null)
  // La fiche à amener à l'écran une fois son thème rendu.
  const aMontrer = useRef<string | null>(null)
  const premierRendu = useRef(true)

  // Changer de vue ramène en haut du panneau — ou sur la fiche visée. Rien au
  // premier rendu d'une grille : la page vient de s'ouvrir, elle ne bouge pas.
  useEffect(() => {
    const arrivee = premierRendu.current
    premierRendu.current = false
    if (arrivee && !cleOuverte) return
    const id = aMontrer.current
    aMontrer.current = null
    const cible = id ? document.getElementById(`ligne-${id}`) : haut.current
    cible?.scrollIntoView({ block: id ? 'center' : 'start' })
  }, [cleOuverte])

  const ouvrirMonde = (cle: string, ficheId?: string) => {
    const suite = new URLSearchParams(params.toString())
    suite.set(PARAM_THEME, cle)
    const url = `?${suite.toString()}`
    if (cleOuverte === null) {
      // Depuis la grille : une entrée de plus, marquée — le retour la referme.
      window.history.pushState({ [MARQUE_OUVERT_ICI]: true }, '', url)
    } else {
      // D'un thème à un autre (par la recherche) : on REMPLACE l'entrée, sans
      // en empiler une. Le chevron ramène à la grille, pas au thème d'avant.
      window.history.replaceState(window.history.state, '', url)
    }
    setRecherche(false)
    setQuery('')
    if (ficheId) {
      aMontrer.current = ficheId
      ouvrir(ficheId)
    } else {
      fermer()
    }
  }

  const fermerMonde = () => {
    fermer()
    if (ouvertDepuisLaGrille()) {
      window.history.back()
      return
    }
    // Arrivé sur le thème par un lien : il n'y a pas de grille derrière, on
    // transforme l'entrée courante.
    const suite = new URLSearchParams(params.toString())
    suite.delete(PARAM_THEME)
    const reste = suite.toString()
    window.history.replaceState(null, '', reste ? `?${reste}` : window.location.pathname)
  }

  const basculerRecherche = () => {
    sfx.tap()
    setQuery('')
    // Une fiche restée dépliée dans la vue quittée mettrait les résultats en
    // retrait (le projecteur est sur elle) : on repart sans rien d'ouvert.
    fermer()
    setRecherche((v) => !v)
    haut.current?.scrollIntoView({ block: 'start' })
  }

  const icone = (monde: Monde): NomIcone =>
    monde.cle === CLE_SANS_THEME ? 'BookOpen' : iconeDuTheme(subjectSlug, monde.titre)

  /** Les fiches d'un thème, dépliables sur place (une seule à la fois). */
  const lignes = (rows: ChapterRow[], monde: Monde) => (
    <ul className="flex flex-col gap-3">
      {rows.map((chapter) => (
        <li
          key={chapter.id}
          id={`ligne-${chapter.id}`}
          className={cn(
            'transition-opacity duration-200',
            fiche !== null && chapter.id !== fiche ? 'opacity-50' : null,
          )}
        >
          <ChapterItem
            chapter={chapter}
            rank={
              monde.cle === CLE_SANS_THEME
                ? null
                : monde.fiches.findIndex((f) => f.id === chapter.id) + 1
            }
            numerote={fichesNumerotees(subjectSlug)}
            resumeLabel={resume?.chapterId === chapter.id ? resume.label : null}
            open={fiche === chapter.id}
            supports={supports[chapter.id] ?? null}
            loading={chargement === chapter.id}
            onToggle={() => basculer(chapter.id)}
          />
        </li>
      ))}
    </ul>
  )

  return (
    <div ref={haut} className="scroll-mt-28">
      {recherche ? (
        <Recherche
          query={query}
          onQuery={setQuery}
          onFermer={basculerRecherche}
          subjectName={subjectName}
          groupes={mondes
            .map((monde) => ({ monde, trouvees: matchChapters(monde.fiches, query) }))
            .filter((g) => query.trim().length > 0 && g.trouvees.length > 0)}
          icone={icone}
          onOuvrirMonde={(cle) => ouvrirMonde(cle)}
          lignes={lignes}
        />
      ) : ouvert ? (
        <section aria-label={ouvert.titre}>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                sfx.tap()
                fermerMonde()
              }}
              aria-label="Tous les chapitres"
              className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full bg-card shadow-carte transition-transform active:scale-95"
            >
              <ChevronLeft className="size-5" strokeWidth={3} aria-hidden="true" />
            </button>
            <AnneauMonde jauge={ouvert.jauge} etat={ouvert.etat} nom={icone(ouvert)} taille={56} />
            <div className="min-w-0 flex-1">
              <h2 className="titre-section">{ouvert.titre}</h2>
              <p className="text-xs font-semibold text-muted-foreground">
                {compteDuMonde(ouvert)}
                {ouvert.controle ? ` · ${ouvert.controle.label}` : null}
              </p>
            </div>
            <BoutonFavori
              titre={ouvert.titre}
              favori={estFavori(ouvert, choix)}
              onBasculer={() => basculerFavori(ouvert)}
            />
          </div>

          <QuizDuTheme monde={ouvert} subjectSlug={subjectSlug} />

          <div className="mt-4">{lignes(ouvert.fiches, ouvert)}</div>
        </section>
      ) : (
        <>
          {reprise ? (
            <CarteReprendre
              reprise={reprise}
              onReprendre={() => ouvrirMonde(reprise.cle, reprise.fiche.id)}
            />
          ) : null}
          <ul
            aria-label={`Les chapitres de ${subjectName}`}
            className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3', reprise ? 'mt-3' : null)}
          >
            {ordonnes.map((monde) => (
              <li key={monde.cle}>
                <TuileMonde
                  monde={monde}
                  nom={icone(monde)}
                  favori={estFavori(monde, choix)}
                  enCours={monde.etat === 'entame' && reprise?.cle === monde.cle}
                  onOuvrir={() => {
                    sfx.tap()
                    ouvrirMonde(monde.cle)
                  }}
                  onFavori={() => basculerFavori(monde)}
                />
              </li>
            ))}
          </ul>
        </>
      )}

      {/* LA LOUPE FLOTTANTE, juste au-dessus de la tête de Marcel : « un icône
          flottant loupe pour que l'élève puisse chercher le chapitre qu'il
          cherche directement » (Lucas, 01/10/2026). Le portail la garde collée
          à l'écran, comme Marcel. */}
      <PortailFixe>
        <button
          type="button"
          onClick={basculerRecherche}
          aria-label={recherche ? 'Fermer la recherche' : `Chercher un chapitre en ${subjectName}`}
          aria-pressed={recherche}
          className={cn(
            'fixed right-6 bottom-[10.75rem] z-40 grid size-12 cursor-pointer place-items-center rounded-full shadow-carte ring-1 ring-black/5 transition-transform active:scale-95 md:bottom-[6.75rem]',
            recherche ? 'bg-primary text-primary-foreground' : 'bg-card text-primary',
          )}
        >
          {recherche ? (
            <X className="size-5" strokeWidth={3} aria-hidden="true" />
          ) : (
            <Search className="size-5" strokeWidth={3} aria-hidden="true" />
          )}
        </button>
      </PortailFixe>
    </div>
  )
}

/**
 * L'ANNEAU D'UN THÈME : le pictogramme sur son disque, la jauge autour.
 *
 * La jauge suit la courbe d'encouragement (`lib/reviser/programme`) : elle se
 * remplit dès la première fiche ouverte. Violette en marche — c'est le thème
 * qu'on travaille —, or une fois le thème terminé, avec la couronne.
 */
function AnneauMonde({
  jauge,
  etat,
  nom,
  taille = 76,
}: {
  jauge: number
  etat: EtatMonde
  nom: NomIcone
  taille?: number
}) {
  const epaisseur = taille >= 70 ? 7 : 6
  const rayon = (taille - epaisseur) / 2
  const tour = 2 * Math.PI * rayon
  const termine = etat === 'termine'
  return (
    <span
      aria-hidden="true"
      className="relative grid shrink-0 place-items-center"
      style={{ width: taille, height: taille }}
    >
      <svg
        viewBox={`0 0 ${taille} ${taille}`}
        width={taille}
        height={taille}
        className="absolute inset-0 -rotate-90"
      >
        <circle
          cx={taille / 2}
          cy={taille / 2}
          r={rayon}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={epaisseur}
        />
        <circle
          cx={taille / 2}
          cy={taille / 2}
          r={rayon}
          fill="none"
          stroke={termine ? 'var(--highlight)' : 'var(--primary)'}
          strokeWidth={epaisseur}
          strokeLinecap="round"
          strokeDasharray={tour}
          strokeDashoffset={tour * (1 - jauge / 100)}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <span
        className={cn(
          'grid place-items-center rounded-full',
          termine ? 'bg-accent text-foreground' : 'bg-secondary text-primary',
        )}
        style={{ width: taille - 2 * epaisseur - 6, height: taille - 2 * epaisseur - 6 }}
      >
        <IconeTheme nom={nom} className={taille >= 70 ? 'size-7' : 'size-5'} />
      </span>
      {termine ? (
        <span className="absolute -top-1 -right-1 grid size-6 place-items-center rounded-full bg-highlight text-foreground ring-2 ring-card">
          <Crown className="size-3.5 fill-current" strokeWidth={2.25} />
        </span>
      ) : null}
    </span>
  )
}

/** L'étoile d'un thème : pleine et dorée quand il est épinglé en tête de la grille. */
function BoutonFavori({
  titre,
  favori,
  onBasculer,
  className,
}: {
  titre: string
  favori: boolean
  onBasculer: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={() => {
        sfx.tap()
        onBasculer()
      }}
      aria-pressed={favori}
      aria-label={favori ? `Retirer « ${titre} » des favoris` : `Mettre « ${titre} » en favori`}
      className={cn(
        'grid size-9 shrink-0 cursor-pointer place-items-center rounded-full transition-transform active:scale-90',
        className,
      )}
    >
      <Star
        className={cn(
          'size-5 transition-colors',
          favori ? 'fill-highlight text-highlight' : 'text-foreground/25',
        )}
        strokeWidth={2.5}
        aria-hidden="true"
      />
    </button>
  )
}

/**
 * UNE TUILE DE LA GRILLE. Le corps entier ouvre le thème ; l'étoile est son
 * VOISIN, pas son enfant — un bouton dans un bouton n'existe pas.
 *
 * Le ruban du coin dit ce qui presse : le contrôle annoncé d'abord (c'est lui
 * qui a épinglé le thème d'office), sinon « En cours » sur le thème de la
 * fiche à reprendre.
 */
function TuileMonde({
  monde,
  nom,
  favori,
  enCours,
  onOuvrir,
  onFavori,
}: {
  monde: Monde
  nom: NomIcone
  favori: boolean
  enCours: boolean
  onOuvrir: () => void
  onFavori: () => void
}) {
  const controle = monde.controle
  return (
    <div
      data-etat={monde.etat}
      className={cn(
        'carte relative h-full',
        controle || enCours ? 'ring-2 ring-highlight' : null,
      )}
    >
      <button
        type="button"
        onClick={onOuvrir}
        className="flex h-full w-full cursor-pointer flex-col items-center rounded-carte px-3 pt-8 pb-2.5 text-center transition-transform active:scale-[0.98]"
      >
        <AnneauMonde jauge={monde.jauge} etat={monde.etat} nom={nom} taille={70} />
        <span className="font-heading mt-2 line-clamp-3 text-[15px] leading-tight font-extrabold text-balance">
          {monde.titre}
        </span>
        <span
          className={cn(
            'mt-auto pt-1.5 text-xs font-semibold tabular-nums',
            monde.etat === 'termine' ? 'text-success' : 'text-muted-foreground',
          )}
        >
          {compteDuMonde(monde)}
        </span>
      </button>

      {controle ? (
        <span
          className={cn(
            'pointer-events-none absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-extrabold',
            controle.proximity === 'imminent'
              ? 'bg-destructive text-white'
              : 'bg-highlight text-foreground',
          )}
        >
          <Timer className="size-3" aria-hidden="true" />
          {/* « Contrôle dans 3 jours » ne tient pas à côté de l'étoile sur une
              demi-largeur : le minuteur dit « contrôle », le texte dit quand. */}
          <span className="sr-only">Contrôle </span>
          {controle.label.replace(/^Contrôle\s+/i, '')}
        </span>
      ) : enCours ? (
        <span className="pointer-events-none absolute top-2.5 left-2.5 rounded-full bg-accent px-2 py-0.5 text-[10px] font-extrabold text-accent-foreground">
          En cours
        </span>
      ) : null}

      <BoutonFavori
        titre={monde.titre}
        favori={favori}
        onBasculer={onFavori}
        className="absolute top-1 right-1"
      />
    </div>
  )
}

/**
 * LE QUIZ DU CHAPITRE, dans la vue d'un thème. Il reprend toutes les fiches
 * d'un coup et s'ouvre quand chacune a été testée une fois : fermé, il le dit
 * en clair au lieu de montrer un bouton mort.
 */
function QuizDuTheme({ monde, subjectSlug }: { monde: Monde; subjectSlug: string }) {
  const theme = monde.cle === CLE_SANS_THEME ? null : monde.cle
  if (!theme || !hasChapterQuiz({ theme, chapters: monde.fiches })) return null
  const acces = accesQuizChapitre(monde.fiches)

  if (acces.debloque) {
    return (
      <Button asChild size="lg" className="mt-4 w-full">
        <Link href={chapterQuizHref(subjectSlug, theme)}>
          <ListChecks aria-hidden="true" />
          Quiz du chapitre
        </Link>
      </Button>
    )
  }
  return (
    <p className="mt-4 flex items-start gap-2 rounded-2xl bg-card/70 px-3.5 py-2.5 text-[13px] leading-snug font-semibold text-muted-foreground">
      <Lock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>
        <strong className="text-foreground">Quiz du chapitre</strong>
        {' : '}
        il reprend toutes les fiches d’un coup. {phraseAccesQuiz(acces)}
      </span>
    </p>
  )
}

/** La recherche : un champ, puis les fiches trouvées, rangées sous leur thème. */
function Recherche({
  query,
  onQuery,
  onFermer,
  subjectName,
  groupes,
  icone,
  onOuvrirMonde,
  lignes,
}: {
  query: string
  onQuery: (q: string) => void
  onFermer: () => void
  subjectName: string
  groupes: { monde: Monde; trouvees: ChapterRow[] }[]
  icone: (monde: Monde) => NomIcone
  onOuvrirMonde: (cle: string) => void
  lignes: (rows: ChapterRow[], monde: Monde) => React.ReactNode
}) {
  const cherche = query.trim().length > 0
  const total = groupes.reduce((n, g) => n + g.trouvees.length, 0)
  return (
    <section aria-label={`Recherche en ${subjectName}`}>
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') onFermer()
          }}
          placeholder="Chercher un chapitre, une fiche…"
          aria-label={`Chercher un chapitre en ${subjectName}`}
          autoComplete="off"
          spellCheck={false}
          // La barre s'ouvre sous le doigt : le clavier doit être là sans un
          // deuxième tap.
          autoFocus
          className="h-12 w-full rounded-full border bg-card pr-4 pl-11 text-[15px] font-semibold shadow-carte outline-none placeholder:font-medium placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <p className="mt-3 px-1 text-xs font-semibold text-muted-foreground" role="status" aria-live="polite">
        {!cherche
          ? 'Tape un mot du chapitre ou de la fiche que tu cherches.'
          : total === 0
            ? `Aucune fiche pour « ${query.trim()} »`
            : `${total} fiche${total > 1 ? 's' : ''} trouvée${total > 1 ? 's' : ''}`}
      </p>

      <div className="mt-3 flex flex-col gap-5">
        {groupes.map(({ monde, trouvees }) => (
          <div key={monde.cle}>
            <button
              type="button"
              onClick={() => {
                sfx.tap()
                onOuvrirMonde(monde.cle)
              }}
              className="mb-2 flex w-full cursor-pointer items-center gap-2 text-left"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-secondary text-primary">
                <IconeTheme nom={icone(monde)} className="size-4" />
              </span>
              <span className="titre-section min-w-0 flex-1 text-[15px]">{monde.titre}</span>
            </button>
            {lignes(trouvees, monde)}
          </div>
        ))}
      </div>
    </section>
  )
}
