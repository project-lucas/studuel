'use client'

import { useCallback, useMemo, useState, useTransition } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'
import ChapterItem from '@/components/reviser/ChapterItem'
import ChapterProgressRing from '@/components/reviser/ChapterProgressRing'
import { chapterSupports } from '@/app/reviser/[subject]/supports-actions'
import { cn } from '@/lib/utils'
import {
  SEARCH_MIN_CHAPTERS,
  chapterUnit,
  groupChaptersByTheme,
  matchChapters,
  openGroupIndex,
  type ChapterRow,
  type ResumeCta,
  type SupportChip,
} from '@/lib/subject-template'

// Liste des chapitres de la matière, rangée par axe du programme quand la base
// porte des thèmes (migration 234) : 28 lignes à plat, personne ne les relit.
// Chaque section est repliable ; celle du chapitre à reprendre s'ouvre à
// l'arrivée, les autres restent fermées — l'élève voit le programme en entier
// et sa place dedans, en un écran.
//
// Sans thème en base, un seul groupe implicite : la liste à plat d'avant.
//
// Quand la matière tient dans UN SEUL bloc de plus de `SEARCH_MIN_CHAPTERS`
// lignes, cet unique en-tête porte une LOUPE, et la barre se déplie DANS le
// bloc, sous le titre : les 260 fiches de lecture du français ne se parcourent
// pas, elles se cherchent. Un programme rangé en chapitres n'en a pas — cf.
// `cherchable`.
//
// Le pliage est tenu en état React plutôt qu'en `<details>` natif : la barre
// vit à l'intérieur du bloc, et il ne faut pas qu'un repli du navigateur (que
// React ne voit pas) puisse l'escamoter — ni qu'un remontage lui vole le
// curseur à la première lettre tapée.
export default function ChapterList({
  chapters,
  resume,
  subjectSlug,
  subjectName,
  grade,
  numbered = true,
}: {
  chapters: ChapterRow[]
  /** Le chapitre mis en avant (« Reprendre » / « Commencer »), s'il en reste. */
  resume: ResumeCta | null
  /** Slug de la matière — les supports d'une fiche se demandent par lui. */
  subjectSlug: string
  subjectName: string
  grade: string
  /**
   * Faux quand la matière n'a pas d'ordre imposé (`chaptersAreNumbered`) : ses
   * lignes portent leur titre nu. Sans effet sur une liste rangée par thème,
   * qui ne numérote déjà plus ses fiches.
   */
  numbered?: boolean
}) {
  const [query, setQuery] = useState('')
  // La barre est REPLIÉE par défaut, réduite à sa loupe : déployée en
  // permanence, elle poussait le programme d'une ligne entière chez tout le
  // monde, y compris chez ceux qui viennent lire la liste et pas la fouiller.
  const [ouvert, setOuvert] = useState(false)
  // Les blocs que l'élève a lui-même pliés ou dépliés, par clé de groupe. Ce
  // qui n'y est pas suit la règle par défaut (seul le chapitre à reprendre est
  // ouvert à l'arrivée).
  const [deplies, setDeplies] = useState<Record<string, boolean>>({})
  // LE CHAPITRE QUE L'ÉLÈVE VIENT D'OUVRIR, s'il y en a un. Distinct de
  // `deplies` : plusieurs blocs peuvent rester dépliés, mais un seul est celui
  // qu'on vient de désigner du doigt — c'est lui qui tient le projecteur.
  // Nul à l'arrivée : la page ne s'ouvre pas déjà atténuée sous prétexte que le
  // chapitre à reprendre est déplié par défaut.
  const [chapitre, setChapitre] = useState<string | null>(null)

  // LA FICHE DÉPLIÉE, et ses supports.
  //
  // UNE SEULE À LA FOIS : sur trente-six fiches, laisser tout ouvert ferait une
  // page à rallonge où l'on perdrait la ligne qu'on vient d'ouvrir. Ouvrir une
  // fiche referme la précédente — c'est aussi ce qui rend le geste réversible
  // sans y penser.
  const [fiche, setFiche] = useState<string | null>(null)
  // Les supports déjà chargés, gardés pour la session : replier puis rouvrir
  // une fiche ne redemande rien au serveur.
  const [supports, setSupports] = useState<Record<string, SupportChip[]>>({})
  const [chargement, setChargement] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  const basculer = useCallback(
    (id: string) => {
      if (fiche === id) {
        setFiche(null)
        return
      }
      setFiche(id)
      if (supports[id]) return
      setChargement(id)
      startTransition(async () => {
        const chips = await chapterSupports(subjectSlug, id)
        setSupports((s) => ({ ...s, [id]: chips }))
        setChargement((c) => (c === id ? null : c))
      })
    },
    [fiche, supports, subjectSlug],
  )

  // Plier / déplier un chapitre. Déplier le met SOUS LE PROJECTEUR (les autres
  // blocs reculent) ; le replier rend la page à tout le monde.
  const basculerChapitre = useCallback((cle: string, deplie: boolean) => {
    setDeplies((d) => ({ ...d, [cle]: !deplie }))
    setChapitre((c) => (deplie ? (c === cle ? null : c) : cle))
  }, [])

  // Les groupes de RÉFÉRENCE : ceux du programme entier, recherche ou pas.
  // C'est d'eux que viennent le numéro du chapitre et le rang d'une fiche — une
  // fiche trouvée par la recherche garde le sien (« 137 »), elle ne redevient
  // pas « 1 » parce qu'elle arrive en tête des résultats.
  const entiers = useMemo(() => groupChaptersByTheme(chapters), [chapters])

  // Le numéro affiché compte les chapitres du PROGRAMME, donc les seuls groupes
  // qui en portent un : un groupe sans titre (des chapitres que la base n'a pas
  // rangés) ne consomme pas de numéro, sans quoi « Le groupe nominal », premier
  // chapitre du programme, s'annoncerait « Chapitre 2 » parce qu'il vient
  // derrière lui. Calculé d'un bloc AVANT le rendu — un compteur incrémenté
  // dans le `map` serait une mutation pendant le rendu.
  const reperes = useMemo(() => {
    const numeroParTheme = new Map<string, number>()
    const rangParFiche = new Map<string, number>()
    let numero = 0
    for (const groupe of entiers) {
      if (!groupe.theme) continue
      numeroParTheme.set(groupe.theme, ++numero)
      groupe.chapters.forEach((c, i) => rangParFiche.set(c.id, i + 1))
    }
    return { numeroParTheme, rangParFiche }
  }, [entiers])

  const cherche = query.trim().length > 0
  // Chaque groupe garde sa place et son identité, filtré chez lui : la
  // recherche ne rebat pas les cartes, elle vide des blocs.
  const filtres = useMemo(
    () =>
      entiers.map((g) => ({
        theme: g.theme,
        chapters: cherche ? matchChapters(g.chapters, query) : g.chapters,
      })),
    [entiers, cherche, query],
  )
  const resultats = useMemo(() => filtres.flatMap((g) => g.chapters), [filtres])

  if (chapters.length === 0) {
    return (
      <p className="mt-6 text-sm text-muted-foreground">
        Le programme de {subjectName} en {grade} arrive bientôt.
      </p>
    )
  }

  const unit = chapterUnit(chapters)
  const quoi = unit === 'fiche' ? 'une fiche' : 'un chapitre'
  // LA LOUPE NE SORT QUE SUR UN TAS, jamais sur un programme rangé. L'onglet
  // « Programme » du français aligne 48 fiches, mais sous CINQ chapitres de
  // quatre à six lignes : le rangement EST la navigation, on descend au
  // chapitre puis on lit ses fiches, il n'y a rien à fouiller. L'onglet
  // « Fiches », lui, est un seul bloc de 260 œuvres qu'on vient chercher une
  // par une. D'où la règle : un seul bloc, et assez de lignes pour s'y perdre.
  const cherchable =
    chapters.length >= SEARCH_MIN_CHAPTERS && entiers.length === 1

  // Les blocs montrés : ceux qui ont au moins une ligne — plus celui qui porte
  // la barre, toujours, tant qu'elle est ouverte : une recherche sans résultat
  // ne doit pas escamoter le champ sous les doigts de celui qui tape dedans.
  const groups = filtres.filter(
    (g, i) => g.chapters.length > 0 || (cherchable && ouvert && i === 0),
  )
  const defaut = openGroupIndex(groups, resume)
  const cleDe = (g: { theme: string | null }, i: number) =>
    g.theme ?? `sans-theme-${i}`

  const fermer = () => {
    setQuery('')
    setOuvert(false)
  }

  // `ranged` : la liste est rangée sous les chapitres du programme. Les lignes
  // n'y sont plus des chapitres mais des FICHES, numérotées dans leur chapitre
  // (1, 2, 3…) et non dans la matière — sans quoi « Chapitre 2 · Le groupe
  // verbal » s'ouvrirait sur une fiche numérotée 4.
  // LE PROJECTEUR. Dès qu'on déplie quelque chose, tout le reste de la liste
  // recule d'un cran — au chapitre comme à la fiche, c'est le même geste et la
  // même réponse : ouvrir un chapitre efface les autres chapitres, ouvrir une
  // fiche efface en plus les fiches voisines. Ce qu'on vient de déplier tient
  // la page.
  //
  // Ce n'est PAS une désactivation : rien n'est mis hors d'atteinte, on peut
  // taper directement un autre chapitre pour y sauter. L'atténuation reste
  // douce (la moitié) pour que les titres restent lisibles — un contenu qu'on
  // peut encore atteindre doit rester déchiffrable.
  //
  // Sous recherche, personne ne recule : les résultats sont éparpillés dans
  // plusieurs blocs, et en atténuer certains reviendrait à cacher une partie de
  // ce qu'on vient de trouver.
  const focus = fiche !== null
  const focusChapitre = cherche ? null : chapitre
  const EFFACE = 'opacity-50'

  const list = (rows: ChapterRow[], ranged: boolean) => (
    <ul className="flex flex-col gap-3">
      {rows.map((chapter) => (
        <li
          key={chapter.id}
          className={cn(
            'transition-opacity duration-200',
            focus && chapter.id !== fiche ? EFFACE : null,
          )}
        >
          <ChapterItem
            chapter={chapter}
            rank={ranged ? (reperes.rangParFiche.get(chapter.id) ?? null) : null}
            numbered={numbered}
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

  // Le bouton de l'en-tête : loupe au repos, loupe ALLUMÉE (violet, la couleur
  // de l'action) quand la barre est dépliée — un seul bouton pour les deux
  // sens, à la même place, qui ne saute pas d'un état à l'autre.
  const bouton = (
    <button
      type="button"
      onClick={() => (ouvert ? fermer() : setOuvert(true))}
      aria-label={ouvert ? 'Fermer la recherche' : `Rechercher ${quoi} en ${subjectName}`}
      aria-expanded={ouvert}
      className={cn(
        'flex size-9 shrink-0 items-center justify-center rounded-full border shadow-sm transition-colors active:scale-95',
        ouvert
          ? 'border-transparent bg-primary text-primary-foreground'
          : 'bg-card text-muted-foreground hover:text-foreground',
      )}
    >
      <Search className="size-4.5" aria-hidden="true" />
    </button>
  )

  // La barre, telle qu'elle se déplie DANS le bloc, sous son titre.
  const barre = (
    <div className="rev-search-in relative mt-2">
      <Search
        className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        // Échap referme, comme partout ailleurs.
        onKeyDown={(e) => {
          if (e.key === 'Escape') fermer()
        }}
        placeholder={`Rechercher ${quoi}…`}
        aria-label={`Rechercher ${quoi} en ${subjectName}`}
        autoComplete="off"
        spellCheck={false}
        // La barre s'ouvre sous le doigt : le clavier doit être là sans un
        // deuxième tap.
        autoFocus
        className="h-11 w-full rounded-xl border bg-card pr-11 pl-10.5 text-sm font-semibold shadow-sm outline-none placeholder:font-medium placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/40"
      />
      {cherche ? (
        <button
          type="button"
          // Sans ça, le champ perdrait le focus au `mousedown` et le clic
          // arriverait sur un bouton déjà déplacé.
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setQuery('')}
          aria-label="Effacer la recherche"
          className="absolute top-1/2 right-1.5 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  )

  // Ce que la recherche a trouvé, dit à voix haute : sans ce compte, une liste
  // filtrée ressemble à un dossier qui aurait perdu son contenu.
  const bilan = cherche ? (
    <p
      className="mt-2 px-1 text-xs font-semibold text-muted-foreground"
      role="status"
      aria-live="polite"
    >
      {resultats.length === 0
        ? `Aucune correspondance pour « ${query.trim()} »`
        : `${resultats.length} ${unit}${resultats.length > 1 ? 's' : ''} trouvée${resultats.length > 1 ? 's' : ''}`}
    </p>
  ) : null

  // Un seul groupe anonyme : pas de section, pas de pliage, pas d'en-tête où
  // poser la loupe — elle prend sa ligne, à droite, et la barre se déplie
  // dessous.
  if (entiers.length === 1 && entiers[0].theme === null) {
    return (
      <div>
        {cherchable ? (
          <div className="mt-4">
            <div className="flex justify-end">{bouton}</div>
            {ouvert ? barre : null}
            {bilan}
          </div>
        ) : null}
        {resultats.length > 0 ? (
          <div className="mt-4">{list(resultats, false)}</div>
        ) : null}
      </div>
    )
  }

  // « CHAPITRE 1 » au-dessus d'un titre quand la matière n'a QU'UN chapitre —
  // le rayon des fiches de lecture du français — ne numérote rien : il n'y a
  // pas de chapitre 2. C'est une ligne de plus à lire pour zéro information.
  // Le numéro revient dès qu'il y a une suite à situer.
  const numerote = entiers.filter((g) => g.theme).length > 1

  return (
    <div className="mt-4 flex flex-col gap-3">
      {groups.map((group, i) => {
        const cle = cleDe(group, i)
        const porteLaBarre = cherchable && ouvert && i === 0
        // Une recherche ouvre tous les blocs : cacher un résultat derrière un
        // pli, c'est ne pas l'avoir trouvé. Le bloc qui porte la barre s'ouvre
        // aussi, sinon elle se déplierait dans le vide.
        const deplie =
          cherche || porteLaBarre || (deplies[cle] ?? i === defaut)
        const done = group.chapters.filter((c) => c.status === 'complete').length
        // Le chapitre EN AVANT garde sa netteté : il dit OÙ l'on est. Les
        // autres reculent avec leur en-tête, sinon quatre titres en gras
        // continueraient de tirer l'œil pendant qu'on travaille.
        //
        // Une fiche ouverte l'emporte sur le dernier chapitre déplié : c'est
        // elle qu'on est en train de lire, et son chapitre d'accueil n'est pas
        // forcément celui qu'on a ouvert en dernier.
        const abriteLaFiche = group.chapters.some((c) => c.id === fiche)
        const enAvant = focus ? abriteLaFiche : cle === focusChapitre
        const efface = (focus || focusChapitre !== null) && !enAvant
        return (
          <div
            key={cle}
            className={cn(
              'rounded-2xl border bg-card/60 px-3 py-2 transition-opacity duration-200',
              deplie ? 'pb-3' : null,
              efface ? EFFACE : null,
            )}
          >
            <div className="flex items-center gap-2">
              {/* Le titre plie et déplie le bloc. La loupe est son VOISIN, pas
                  son enfant : un bouton dans un bouton n'existe pas, et deux
                  actions dans la même cible se marchent dessus. */}
              <button
                type="button"
                onClick={() => basculerChapitre(cle, deplie)}
                aria-expanded={deplie}
                aria-controls={`bloc-${cle}`}
                className="min-w-0 flex-1 cursor-pointer py-1.5 text-left"
              >
                <span className="block min-w-0">
                  {/* Le groupe EST le chapitre du programme : c'est lui qui porte
                      le numéro que l'élève lit sur le cahier de son professeur. */}
                  {group.theme && numerote ? (
                    <span className="text-primary block text-xs font-extrabold tracking-wide uppercase">
                      Chapitre {reperes.numeroParTheme.get(group.theme) ?? 0}
                    </span>
                  ) : null}
                  <span className="font-heading block font-bold text-balance">
                    {group.theme ?? 'Autres chapitres'}
                  </span>
                  {/* Sous recherche, le compte porte sur ce qui est MONTRÉ :
                      « 0/3 fiches » sur trois résultats parlerait d'un autre
                      chapitre que celui qu'on a sous les yeux. Et le bloc qui
                      porte la barre sans avoir de résultat ne compte rien du
                      tout : « 0 fiche » sous le titre, alors que le bilan
                      juste dessous annonce les trouvailles des autres blocs,
                      se lit comme un échec. */}
                  {cherche && group.chapters.length === 0 ? null : (
                    <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                      {cherche ? '' : `${done}/`}
                      {group.chapters.length}{' '}
                      {group.theme ? 'fiche' : 'chapitre'}
                      {group.chapters.length > 1 ? 's' : ''}
                    </span>
                  )}
                </span>
              </button>
              {/* L'ANNEAU D'AVANCEMENT du chapitre, dans l'espace vide à
                  droite du titre. Pas sous recherche : `group.chapters` n'y
                  contient que les résultats, et un anneau qui compterait les
                  trouvailles parlerait d'un autre chapitre que celui affiché —
                  c'est exactement pour ça que le compte texte s'efface aussi. */}
              {cherche ? null : (
                <ChapterProgressRing
                  done={done}
                  total={group.chapters.length}
                />
              )}
              {/* La loupe ne sort que sur un bloc unique (`cherchable`) : elle
                  cherche dans toute la liste, et posée sur l'un des cinq
                  chapitres d'un programme, elle laisserait croire qu'elle ne
                  fouille que celui-là. */}
              {cherchable && i === 0 ? bouton : null}
              {/* Le chevron reste à l'extrême droite, la place où on le
                  cherche. C'est le JUMEAU visuel du titre : même action, et
                  invisible pour les lecteurs d'écran, qui ne doivent pas
                  s'entendre annoncer deux fois le même pli. */}
              <button
                type="button"
                aria-hidden="true"
                tabIndex={-1}
                onClick={() => basculerChapitre(cle, deplie)}
                className="-mr-1 flex size-8 shrink-0 items-center justify-center rounded-full"
              >
                <ChevronDown
                  className={cn(
                    'size-5 text-muted-foreground transition-transform',
                    deplie ? 'rotate-180' : null,
                  )}
                />
              </button>
            </div>

            {porteLaBarre ? barre : null}
            {porteLaBarre ? bilan : null}

            {deplie ? (
              <div id={`bloc-${cle}`} className="mt-2">
                {list(group.chapters, group.theme !== null)}
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
