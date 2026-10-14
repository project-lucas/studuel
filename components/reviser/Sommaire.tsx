'use client'

import { useMemo, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { Check, ChevronDown, Crown, ListChecks, Lock, Plus, Search, Star, Timer, X } from 'lucide-react'
import IconeTheme from '@/components/reviser/IconeTheme'
import SupportChips from '@/components/reviser/SupportChips'
import { useFavorisProgramme } from '@/components/reviser/useFavorisProgramme'
import { useSupportsDeFiche } from '@/components/reviser/useSupportsDeFiche'
import { Button } from '@/components/ui/button'
import XpIcon from '@/components/ui/XpIcon'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { cleDossier } from '@/lib/reviser/favoris'
import { iconeDuTheme, type IconeTheme as NomIcone } from '@/lib/reviser/icone-theme'
import {
  CLE_SANS_THEME,
  afficheEnMondes,
  estFavori,
  mondesDuProgramme,
  ordonnerMondes,
  repriseDuProgramme,
  resumeDuMonde,
  themeOuvertParDefaut,
  type EtatMonde,
  type Monde,
} from '@/lib/reviser/programme'
import {
  CROWN_THRESHOLDS,
  STATUS_LABELS,
  accesQuizChapitre,
  chapterQuizHref,
  chapterUnit,
  fichesNumerotees,
  hasChapterQuiz,
  matchChapters,
  phraseAccesQuiz,
  type ChapterRow,
  type ResumeCta,
  type SupportChip,
} from '@/lib/subject-template'
import s from './Sommaire.module.css'

/** En dessous, la liste se lit d'un regard : pas de recherche à proposer. */
export const SEUIL_RECHERCHE = 8

/**
 * LE SOMMAIRE — le contenu de la porte « Cours » d'un dossier de matière.
 *
 * Il remplace la grille de tuiles du 01/10/2026 (`ProgrammeMondes`) et la liste
 * à plat (`ChapterList`). Lucas, 05/10/2026 : « je ne parle pas que côté design
 * mais côté UX, ce que le user doit avoir rapidement, et ce qui ne fait pas
 * bug ». Ce que la grille coûtait, mesuré dans le code et à l'écran :
 *
 *   · trois gestes et une attente pour atteindre un cours (la tuile, le « + »
 *     de la fiche, ses supports demandés au serveur, « Cours ») ;
 *   · des titres coupés — quatre tuiles sur cinq en français de 3e : une
 *     demi-largeur ne porte pas les intitulés officiels ;
 *   · deux boutons flottants empilés sur la colonne de droite ;
 *   · des tuiles muettes, les titres des fiches un écran plus loin.
 *
 * ICI, LES FICHES SE LISENT TOUT DE SUITE. Les thèmes sont des cartes pleine
 * largeur (un titre officiel y tient en entier) ; celui qu'on travaille est
 * DÉJÀ OUVERT (`themeOuvertParDefaut`) ; chaque fiche est une ligne qui porte
 * SON bouton — un lien, droit vers son cours, puis son quiz (`ChapterRow.suite`,
 * calculé par la page avec ce qu'elle lit déjà). Toucher la ligne déplie les
 * quatre supports, comme avant : ce n'est plus le passage obligé.
 *
 * UN THÈME S'OUVRE SUR PLACE, et plusieurs peuvent rester ouverts : rien ne
 * bouge au-dessus du doigt, et le bouton retour du téléphone quitte le dossier
 * — il n'y a plus d'écran « thème » à refermer, donc plus d'historique à tenir.
 * Le dernier thème ouvert remonte à la page (`onTheme`), qui l'écrit dans
 * l'adresse : revenir d'un cours le rouvre.
 *
 * LA RECHERCHE EST AMARRÉE : la loupe vit à côté des rayons, et la rangée
 * devient le champ. Elle répond à chaque touche, sans réseau.
 *
 * Un programme sans thème (ou d'un seul bloc — les 260 fiches de lecture) est
 * une seule carte de lignes : la même ligne, le même bouton.
 */
export default function Sommaire({
  chapters,
  resume,
  subjectSlug,
  subjectName,
  grade,
  rayons = null,
  themeOuvert = null,
  onTheme,
  avant = null,
}: {
  chapters: ChapterRow[]
  /** La fiche de la dernière session de révision, si l’élève en a une. */
  resume: ResumeCta | null
  subjectSlug: string
  subjectName: string
  grade: string
  /** Le segment des rayons, posé à gauche de la loupe. */
  rayons?: ReactNode
  /** Le thème à ouvrir à l'arrivée (`?theme=`), quand l'élève revient d'une fiche. */
  themeOuvert?: string | null
  /** Le dernier thème ouvert (ou `null` s'il vient d'être refermé). */
  onTheme?: (cle: string | null) => void
  /** Ce qui se pose entre les outils et la liste (« Tes cours » du carnet). */
  avant?: ReactNode
}) {
  const mondes = useMemo(() => mondesDuProgramme(chapters), [chapters])
  const reprise = useMemo(() => repriseDuProgramme(chapters, resume), [chapters, resume])
  const [choix, basculerFavori] = useFavorisProgramme(cleDossier(subjectSlug, grade))
  const ordonnes = useMemo(() => ordonnerMondes(mondes, choix), [mondes, choix])
  // La fiche à reprendre se prépare dès l'affichage ; les autres à l'intention
  // (le doigt se pose) — voir useSupportsDeFiche.
  const { fiche, supports, chargement, basculer, fermer, preparer } = useSupportsDeFiche(
    subjectSlug,
    reprise?.fiche.id ?? null,
  )

  const parDefaut = useMemo(
    () => themeOuvertParDefaut(mondes, reprise?.cle ?? null, themeOuvert),
    [mondes, reprise, themeOuvert],
  )
  // Ce que l'élève a lui-même plié ou déplié ; le reste suit la règle d'arrivée.
  const [plis, setPlis] = useState<Record<string, boolean>>({})
  const [recherche, setRecherche] = useState(false)
  const [query, setQuery] = useState('')

  // Le rang de chaque fiche (la pastille de gauche) : sa place DANS son thème,
  // ou sa position dans la matière quand le programme n'est pas rangé.
  const rangs = useMemo(() => {
    const parFiche = new Map<string, { rang: number; theme: string | null }>()
    for (const monde of mondes) {
      const range = monde.cle !== CLE_SANS_THEME
      monde.fiches.forEach((f, i) =>
        parFiche.set(f.id, { rang: range ? i + 1 : f.position, theme: range ? monde.titre : null }),
      )
    }
    return parFiche
  }, [mondes])

  const cherche = query.trim().length > 0
  const trouvees = useMemo(
    () => (cherche ? matchChapters(chapters, query) : []),
    [chapters, cherche, query],
  )

  if (chapters.length === 0) {
    return (
      <>
        {rayons ? <div className={s.outils}>{rayons}</div> : null}
        {avant}
        <p className="mt-6 text-sm text-muted-foreground">
          Le programme de {subjectName} en {grade} arrive bientôt.
        </p>
      </>
    )
  }

  const unit = chapterUnit(chapters)
  const numerote = fichesNumerotees(subjectSlug)
  const enMondes = afficheEnMondes(chapters)
  const cherchable = chapters.length >= SEUIL_RECHERCHE
  const estOuvert = (cle: string) => plis[cle] ?? cle === parDefaut

  const basculerMonde = (monde: Monde) => {
    sfx.tap()
    const ouvre = !estOuvert(monde.cle)
    setPlis((p) => ({ ...p, [monde.cle]: ouvre }))
    // Replier un thème replie aussi la fiche qu'il abritait.
    if (!ouvre && monde.fiches.some((f) => f.id === fiche)) fermer()
    onTheme?.(ouvre ? monde.cle : null)
  }

  const ouvrirRecherche = () => {
    sfx.tap()
    fermer()
    setRecherche(true)
  }
  const fermerRecherche = () => {
    sfx.tap()
    fermer()
    setQuery('')
    setRecherche(false)
  }

  const lignes = (rows: readonly ChapterRow[], avecTheme = false) => (
    <ul>
      {rows.map((chapter) => {
        const repere = rangs.get(chapter.id)
        return (
          <li key={chapter.id} className={s.ligne}>
            <FicheLigne
              chapter={chapter}
              rang={numerote ? (repere?.rang ?? null) : null}
              ou={avecTheme ? (repere?.theme ?? null) : null}
              estSuite={reprise?.fiche.id === chapter.id}
              ouverte={fiche === chapter.id}
              supports={supports[chapter.id] ?? null}
              chargement={chargement === chapter.id}
              onBasculer={() => {
                sfx.tap()
                basculer(chapter.id)
              }}
              onPreparer={() => preparer(chapter.id)}
            />
          </li>
        )
      })}
    </ul>
  )

  const icone = (monde: Monde): NomIcone =>
    monde.cle === CLE_SANS_THEME ? 'BookOpen' : iconeDuTheme(subjectSlug, monde.titre)

  return (
    <div>
      {recherche ? (
        <div className={s.outils}>
          <div className={s.champ}>
            <Search className="size-5" strokeWidth={3} aria-hidden="true" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') fermerRecherche()
              }}
              placeholder={`Chercher une ${unit === 'fiche' ? 'fiche' : 'notion'}…`}
              aria-label={`Chercher dans ${subjectName}`}
              autoComplete="off"
              spellCheck={false}
              enterKeyHint="search"
              // Le champ s'ouvre sous le doigt : le clavier doit être là sans
              // un deuxième toucher.
              autoFocus
              className={s.saisie}
            />
            <button
              type="button"
              onClick={fermerRecherche}
              aria-label="Fermer la recherche"
              className={s.fermer}
            >
              <X className="size-4" strokeWidth={3} aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : rayons || cherchable ? (
        <div className={s.outils}>
          {rayons}
          {!cherchable ? null : rayons ? (
            <button
              type="button"
              onClick={ouvrirRecherche}
              aria-label={`Chercher dans ${subjectName}`}
              className={s.loupe}
            >
              <Search className="size-5" strokeWidth={3} aria-hidden="true" />
            </button>
          ) : (
            <button type="button" onClick={ouvrirRecherche} className={s.fauxChamp}>
              <Search className="size-5" strokeWidth={3} aria-hidden="true" />
              Chercher une {unit === 'fiche' ? 'fiche' : 'notion'}…
            </button>
          )}
        </div>
      ) : null}

      {avant}

      {recherche ? (
        <>
          <p className={s.bilan} role="status" aria-live="polite">
            {!cherche
              ? 'Tape un mot du titre que tu cherches.'
              : trouvees.length === 0
                ? `Rien pour « ${query.trim()} »`
                : `${trouvees.length} ${unit}${trouvees.length > 1 ? 's' : ''} trouvée${trouvees.length > 1 ? 's' : ''}`}
          </p>
          {trouvees.length > 0 ? (
            <div className={s.liste}>
              <section className={s.monde} aria-label="Résultats de la recherche">
                {lignes(trouvees, true)}
              </section>
            </div>
          ) : null}
        </>
      ) : enMondes ? (
        <ul className={s.liste} aria-label={`Le programme de ${subjectName}`}>
          {ordonnes.map((monde, i) => {
            const ouvert = estOuvert(monde.cle)
            const favori = estFavori(monde, choix)
            const panneau = `theme-${i}`
            return (
              <li key={monde.cle}>
                <section
                  className={s.monde}
                  aria-label={monde.titre}
                  data-ouvert={ouvert ? '' : undefined}
                  data-presse={monde.controle && monde.etat !== 'termine' ? '' : undefined}
                >
                  <div className={s.tete}>
                    <button
                      type="button"
                      onClick={() => basculerMonde(monde)}
                      aria-expanded={ouvert}
                      aria-controls={panneau}
                      className={s.teteCorps}
                    >
                      <AnneauMonde jauge={monde.jauge} etat={monde.etat} nom={icone(monde)} />
                      <span className={s.teteQuoi}>
                        <span className={s.teteTitre}>{monde.titre}</span>
                        <span className={s.teteMeta} data-etat={monde.etat}>
                          {resumeDuMonde(monde)}
                        </span>
                      </span>
                      <ChevronDown
                        className={cn('size-5', s.chevron)}
                        strokeWidth={2.8}
                        aria-hidden="true"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sfx.tap()
                        basculerFavori(monde)
                      }}
                      aria-pressed={favori}
                      aria-label={
                        favori
                          ? `Retirer « ${monde.titre} » des favoris`
                          : `Mettre « ${monde.titre} » en favori`
                      }
                      className={s.etoile}
                    >
                      <Star className="size-5" strokeWidth={2.5} aria-hidden="true" />
                    </button>
                  </div>
                  {ouvert ? (
                    <div id={panneau} className={s.fiches}>
                      {lignes(monde.fiches)}
                      <QuizDuTheme monde={monde} subjectSlug={subjectSlug} />
                    </div>
                  ) : null}
                </section>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className={s.liste}>
          <section className={s.monde} aria-label={`Le programme de ${subjectName}`}>
            {lignes(chapters)}
          </section>
        </div>
      )}
    </div>
  )
}

/**
 * L'ANNEAU D'UN THÈME : son pictogramme sur un disque, la jauge autour. Elle
 * suit la courbe d'encouragement (`lib/reviser/programme`) : violette en
 * marche, or une fois le thème terminé.
 */
function AnneauMonde({ jauge, etat, nom }: { jauge: number; etat: EtatMonde; nom: NomIcone }) {
  const TAILLE = 44
  const EPAISSEUR = 5
  const rayon = (TAILLE - EPAISSEUR) / 2
  const tour = 2 * Math.PI * rayon
  const termine = etat === 'termine'
  return (
    <span className={s.anneau} data-etat={etat} aria-hidden="true">
      <svg viewBox={`0 0 ${TAILLE} ${TAILLE}`} width={TAILLE} height={TAILLE}>
        <circle
          cx={TAILLE / 2}
          cy={TAILLE / 2}
          r={rayon}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={EPAISSEUR}
        />
        {jauge > 0 ? (
          <circle
            cx={TAILLE / 2}
            cy={TAILLE / 2}
            r={rayon}
            fill="none"
            stroke={termine ? 'var(--highlight)' : 'var(--primary)'}
            strokeWidth={EPAISSEUR}
            strokeLinecap="round"
            strokeDasharray={tour}
            strokeDashoffset={tour * (1 - jauge / 100)}
          />
        ) : null}
      </svg>
      <span className={s.anneauRond}>
        {termine ? (
          <Crown className="size-4 fill-current" strokeWidth={2.25} />
        ) : (
          <IconeTheme nom={nom} className="size-[1.0625rem]" />
        )}
      </span>
    </span>
  )
}

/**
 * UNE FICHE DU SOMMAIRE. Deux cibles, côte à côte, jamais l'une dans l'autre :
 * la LIGNE (un bouton) déplie les supports ; le BOUTON de droite (un lien) mène
 * droit à la suite. La fiche à reprendre porte la seule plaque violette pleine.
 */
function FicheLigne({
  chapter,
  rang,
  ou,
  estSuite,
  ouverte,
  supports,
  chargement,
  onBasculer,
  onPreparer,
}: {
  chapter: ChapterRow
  /** Le numéro de la pastille ; `null` en philosophie, dont les notions n'ont pas d'ordre. */
  rang: number | null
  /** Le thème de la fiche, dit sous son titre dans les résultats d'une recherche. */
  ou: string | null
  estSuite: boolean
  ouverte: boolean
  supports: SupportChip[] | null
  chargement: boolean
  onBasculer: () => void
  /** Le doigt se pose : les supports partent se charger avant le tap. */
  onPreparer: () => void
}) {
  const panneau = `fiche-${chapter.id}`
  const commencee = chapter.status !== 'non_commence'

  return (
    <>
      <div className={s.fiche} id={`ligne-${chapter.id}`} data-depliee={ouverte ? '' : undefined}>
        <button
          type="button"
          onPointerDown={onPreparer}
          onClick={onBasculer}
          aria-expanded={ouverte}
          aria-controls={panneau}
          className={s.ficheCorps}
        >
          {chapter.status === 'complete' ? (
            <span className={s.num} data-fait="" aria-hidden="true">
              <Check className="size-4" strokeWidth={3.4} />
            </span>
          ) : rang !== null ? (
            <span className={s.num} data-long={rang > 99 ? '' : undefined} aria-hidden="true">
              {rang}
            </span>
          ) : null}
          <span className={s.ficheQuoi}>
            <span className={s.ficheTitre}>{chapter.title}</span>
            <span className={s.ficheMeta}>
              {chapter.examHint ? (
                <span
                  className={s.controle}
                  data-proche={chapter.examHint.proximity === 'imminent' ? '' : undefined}
                >
                  <Timer className="size-3" aria-hidden="true" />
                  {chapter.examHint.label}
                </span>
              ) : null}
              {ou ? <span className={s.ficheOu}>{ou}</span> : null}
              {/* Les couronnes n'apparaissent qu'une fois la première décrochée :
                  trois couronnes éteintes sur chaque ligne feraient un mur d'échecs. */}
              {chapter.crowns > 0 ? (
                <span
                  className={s.couronnes}
                  role="img"
                  aria-label={`${chapter.crowns} couronne${chapter.crowns > 1 ? 's' : ''} sur ${CROWN_THRESHOLDS.length}`}
                >
                  {CROWN_THRESHOLDS.map((seuil, i) => (
                    <Crown
                      key={seuil}
                      className={cn(
                        'size-3.5',
                        i < chapter.crowns ? 'fill-current' : 'text-foreground/20',
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </span>
              ) : null}
              {/* Plus de « ~3 min » (14/10/2026, Lucas : « ne précise plus le temps »). */}
              {commencee ? <span>{STATUS_LABELS[chapter.status]}</span> : null}
              {estSuite && chapter.xpRestant > 0 ? (
                <span className="inline-flex items-center gap-0.5">
                  <XpIcon className="size-3" />+{chapter.xpRestant} XP
                </span>
              ) : null}
            </span>
          </span>
        </button>
        {/* LE « + » (Lucas, 12/10/2026 : « un bouton qui invite et fait
            comprendre que ces blocs sont dépliables, mais supprime ce texte
            Cours ») : le rond déplie les quatre supports de la fiche et tourne
            en croix quand elle est ouverte. Il remplace la pilule « Cours ·
            Quiz · Revoir » (le mot Cours, répété à chaque ligne, faisait doublon
            avec la porte). La fiche à reprendre garde le seul rond violet plein. */}
        <button
          type="button"
          onPointerDown={onPreparer}
          onClick={onBasculer}
          aria-expanded={ouverte}
          aria-controls={panneau}
          aria-label={`${ouverte ? 'Replier' : 'Déplier'} — ${chapter.title}`}
          data-suite={estSuite ? '' : undefined}
          className={s.plus}
        >
          <span className={s.plusRond} data-ouvert={ouverte ? '' : undefined}>
            <Plus className="size-5" strokeWidth={3} aria-hidden="true" />
          </span>
        </button>
      </div>

      {ouverte ? (
        <div id={panneau} className={cn(s.supports, s.apparait)}>
          {chargement || supports === null ? (
            <SupportsSquelette />
          ) : supports.length === 0 ? (
            <p className="py-2 text-center text-xs font-semibold text-muted-foreground">
              Cette fiche n’a pas encore de contenu.
            </p>
          ) : (
            <SupportChips chips={supports} layout="fiche" label={`Supports de ${chapter.title}`} />
          )}
        </div>
      ) : null}
    </>
  )
}

/**
 * L'attente, à la place exacte des supports : la forme de ce qui arrive, pas
 * un tourniquet — la liste ne saute pas quand les icônes se posent.
 */
function SupportsSquelette() {
  return (
    <div className="grid grid-cols-4 gap-1.5" role="status" aria-label="Chargement des supports">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="flex h-[68px] animate-pulse flex-col items-center justify-center gap-1.5 motion-reduce:animate-none"
        >
          <span className="size-11 rounded-2xl bg-muted" />
          <span className="h-2 w-10 rounded-full bg-muted" />
        </span>
      ))}
    </div>
  )
}

/**
 * LE QUIZ DU CHAPITRE, au pied d'un thème ouvert. Il reprend toutes les fiches
 * d'un coup et s'ouvre quand chacune a été testée une fois : fermé, il le dit
 * en clair au lieu de montrer un bouton mort.
 */
function QuizDuTheme({ monde, subjectSlug }: { monde: Monde; subjectSlug: string }) {
  const theme = monde.cle === CLE_SANS_THEME ? null : monde.cle
  if (!theme || !hasChapterQuiz({ theme, chapters: monde.fiches })) return null
  const acces = accesQuizChapitre(monde.fiches)

  if (acces.debloque) {
    return (
      <div className={s.quizOuvert}>
        <Button asChild size="lg" className="w-full">
          <Link href={chapterQuizHref(subjectSlug, theme)} prefetch={false}>
            <ListChecks aria-hidden="true" />
            Quiz du chapitre
          </Link>
        </Button>
      </div>
    )
  }
  return (
    <p className={s.quizChapitre}>
      <Lock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>
        <strong>Quiz du chapitre</strong>
        {' · '}
        {phraseAccesQuiz(acces)}
      </span>
    </p>
  )
}
