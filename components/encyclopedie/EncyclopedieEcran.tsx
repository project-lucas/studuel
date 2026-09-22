'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Shuffle, SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import type { Apercu } from '@/lib/encyclopedie/apercu'
import { comptes, filtrer, indexer, periodesPresentes } from '@/lib/encyclopedie/recherche'
import {
  PERIODES,
  PERIODE_LABELS_COURTS,
  teinteDe,
  type Niveau,
  type Periode,
  type Volet,
} from '@/lib/encyclopedie/types'
import { hrefFiche } from '@/lib/encyclopedie/matieres'
import CarteApercu from './CarteApercu'
import { useLues } from './useLues'
import styles from './Encyclopedie.module.css'

/**
 * LA GRILLE DES CARTES — et son `grid-cols-1`, qui n'est pas décoratif.
 *
 * Sans lui, la colonne implicite est une piste `auto` : elle se dimensionne sur
 * le MAX-CONTENT de la carte, c'est-à-dire sur la citation écrite d'un seul
 * tenant. Les cartes passaient à plus de 430 px de large sur un écran de 390,
 * et le texte se faisait couper à droite SANS que la page défile — le corps
 * masque le débordement, donc rien ne se voyait ni au défilement ni dans le
 * `scrollWidth`. `grid-cols-1` pose `minmax(0, 1fr)` et rend la colonne à la
 * largeur de l'écran. Mesuré au protocole DevTools, pas deviné.
 */
const GRILLE = 'grid grid-cols-1 gap-2 sm:grid-cols-2'

const VOLETS: { cle: Volet; label: string; emoji: string }[] = [
  { cle: 'personnages', label: 'Personnages', emoji: '👤' },
  { cle: 'evenements', label: 'Événements', emoji: '📜' },
]

// L'ÉCRAN DE L'ENCYCLOPÉDIE : deux volets, une barre de recherche, des filtres
// par période, et la liste.
//
// TOUT SE FAIT ICI, SANS RÉSEAU. Le serveur a envoyé les aperçus (un nom, des
// dates, une citation, des clés de recherche déjà normalisées : ~250 octets
// par fiche) ; filtrer et chercher sont deux boucles sur un tableau en
// mémoire. C'est ce qui permet de filtrer À CHAQUE TOUCHE sans « chargement… »,
// et c'est ce qui fait qu'on ose taper. Le corpus complet, lui, ne descend
// jamais dans le navigateur : il est lu par la page de la fiche, côté serveur.
export default function EncyclopedieEcran({
  slug,
  apercus,
  niveauEleve,
  voletInitial = 'personnages',
}: {
  slug: string
  apercus: Apercu[]
  /** La classe de l'élève, pour le filtre « Mon programme ». */
  niveauEleve: Niveau | null
  /**
   * Le volet ouvert à l'arrivée (`?volet=evenements`). L'écran n'écrit JAMAIS
   * dans l'URL en retour : synchroniser une barre de recherche avec l'adresse
   * relance le routeur à chaque touche, et c'est exactement ce que cet écran
   * s'interdit (tout se fait en mémoire, sans réseau).
   */
  voletInitial?: Volet
}) {
  const router = useRouter()
  const [volet, setVolet] = useState<Volet>(voletInitial)
  const [requete, setRequete] = useState('')
  const [periode, setPeriode] = useState<Periode | null>(null)
  const [monProgramme, setMonProgramme] = useState(false)
  // Les fiches déjà ouvertes vivent dans le navigateur, donc hors de React :
  // elles arrivent par `useSyncExternalStore` (cf. `useLues`), avec un
  // instantané vide au rendu serveur — aucune divergence d'hydratation à
  // reprocher, et la coche apparaît dès que le stockage répond.
  const lues = useLues()

  // L'index complet : les mots invisibles envoyés par le serveur, recollés à
  // ceux que la carte affiche (cf. `indexer`). Une fois, à l'ouverture.
  const index = useMemo(() => indexer(apercus), [apercus])
  const total = useMemo(() => comptes(apercus), [apercus])
  const periodesDuVolet = useMemo(
    () => periodesPresentes(apercus, volet, PERIODES),
    [apercus, volet],
  )
  const resultats = useMemo(
    () =>
      filtrer(index, {
        volet,
        periode,
        niveau: monProgramme ? niveauEleve : null,
        requete,
      }),
    [index, volet, periode, monProgramme, niveauEleve, requete],
  )
  // Ce que l'AUTRE volet aurait trouvé : sans cette ligne, chercher « bastille »
  // dans les personnages donne « aucun résultat » alors que la fiche existe à
  // deux centimètres de là, dans les événements.
  const ailleurs = useMemo(() => {
    if (resultats.length > 0 || requete.trim().length === 0) return 0
    const autre: Volet = volet === 'personnages' ? 'evenements' : 'personnages'
    return filtrer(index, { volet: autre, requete }).length
  }, [index, resultats.length, requete, volet])

  const changerVolet = (cible: Volet) => {
    if (cible === volet) return
    sfx.tap()
    setVolet(cible)
    // La période retenue n'existe pas forcément dans l'autre volet : on la
    // relâche plutôt que d'ouvrir une liste vide sur un filtre invisible.
    setPeriode(null)
  }

  return (
    <div>
      {/* LES DEUX VOLETS. Un segment, pas deux onglets de plus : la page en a
          déjà quatre en haut, et ceux-ci ne changent pas de page — ils
          changent ce qu'on regarde. */}
      {/* `role="group"` + `aria-pressed`, et NON `tablist`/`tab` : un onglet
          ARIA promet un panneau associé et une navigation aux flèches, que ce
          segment n'offre pas. Deux boutons à deux états, annoncés comme tels,
          disent la vérité au lecteur d'écran. */}
      <div
        role="group"
        aria-label="Volets de l’encyclopédie"
        className="flex gap-1.5 rounded-full bg-muted p-1.5"
      >
        {VOLETS.map((onglet) => {
          const actif = onglet.cle === volet
          return (
            <button
              key={onglet.cle}
              type="button"
              aria-pressed={actif}
              onClick={() => changerVolet(onglet.cle)}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm transition-colors',
                actif
                  ? 'bg-primary font-extrabold text-primary-foreground shadow-sm'
                  : 'font-semibold text-muted-foreground hover:bg-background/60',
              )}
            >
              <span aria-hidden="true">{onglet.emoji}</span>
              <span className="truncate">{onglet.label}</span>
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[0.65rem] font-bold tabular-nums',
                  actif ? 'bg-white/20' : 'bg-background text-muted-foreground',
                )}
              >
                {total[onglet.cle]}
              </span>
            </button>
          )
        })}
      </div>

      {/* LA BARRE DE RECHERCHE. Collante, et OPAQUE : un fond flouté fixe se
          recalcule à chaque image du défilement — la Boutique l'a payé en
          saccades, on ne le refait pas. */}
      <div className="sticky top-14 z-20 -mx-4 mt-3 bg-background px-4 pt-2 pb-2.5 md:top-0 md:-mx-8 md:px-8">
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={requete}
            onChange={(event) => setRequete(event.target.value)}
            placeholder="Un nom, une date, une phrase célèbre…"
            aria-label="Chercher dans l’encyclopédie"
            className="h-11 w-full rounded-full border border-border bg-card pr-10 pl-10 text-sm font-medium text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/20 [&::-webkit-search-cancel-button]:hidden"
          />
          {requete ? (
            <button
              type="button"
              onClick={() => setRequete('')}
              aria-label="Effacer la recherche"
              className="absolute top-1/2 right-2.5 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        {/* LES PÉRIODES. Une rangée qui défile, avec la gommette de la teinte
            devant chaque nom : le filtre enseigne le code couleur que les
            cartes utilisent ensuite. */}
        <div className="-mx-4 mt-2 flex gap-1.5 overflow-x-auto px-4 pb-0.5 [scrollbar-width:none] md:-mx-8 md:px-8 [&::-webkit-scrollbar]:hidden">
          <PuceFiltre actif={periode === null} onSelect={() => setPeriode(null)}>
            Toutes
          </PuceFiltre>
          {periodesDuVolet.map((cle) => (
            <PuceFiltre
              key={cle}
              actif={periode === cle}
              teinte={cle}
              onSelect={() => setPeriode(periode === cle ? null : cle)}
            >
              {PERIODE_LABELS_COURTS[cle]}
            </PuceFiltre>
          ))}
          {niveauEleve ? (
            <PuceFiltre
              actif={monProgramme}
              icone
              onSelect={() => setMonProgramme(!monProgramme)}
            >
              Ma classe ({niveauEleve})
            </PuceFiltre>
          ) : null}
        </div>
      </div>

      <div className="mt-1 mb-2 flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-xs font-semibold text-muted-foreground">
          {resultats.length === 0
            ? 'Aucune fiche'
            : `${resultats.length} fiche${resultats.length > 1 ? 's' : ''}`}
          {periode ? ` · ${PERIODE_LABELS_COURTS[periode]}` : ''}
          {requete.trim() ? ` · « ${requete.trim()} »` : ''}
        </p>
        {/* AU HASARD. Le geste propre aux encyclopédies : on n'y entre pas
            toujours en sachant ce qu'on cherche. Le tirage se fait parmi ce
            qui est AFFICHÉ — filtrer sur le Moyen Âge puis tirer au sort doit
            donner une fiche du Moyen Âge, sinon le filtre a menti. */}
        {resultats.length > 1 ? (
          <button
            type="button"
            onClick={() => {
              sfx.tap()
              const tire = resultats[Math.floor(Math.random() * resultats.length)]
              router.push(hrefFiche(slug, tire.id))
            }}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <Shuffle className="size-3.5" aria-hidden="true" />
            Au hasard
          </button>
        ) : null}
      </div>

      {resultats.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/60 px-5 py-8 text-center">
          <p className="font-heading text-base font-extrabold text-foreground">
            Rien trouvé ici
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Essaie un nom de famille, un lieu, une date — ou trois mots d’une
            phrase célèbre.
          </p>
          {/* UN FILTRE OUBLIÉ EST UN PIÈGE. Chercher « Napoléon » avec la
              période « Antiquité » encore allumée donne « rien trouvé », et
              rien à l'écran ne dit pourquoi — la rangée de filtres est deux
              centimètres plus haut, mais on ne la regarde plus. Le bouton le
              dit et le défait d'un geste. */}
          {periode || monProgramme ? (
            <button
              type="button"
              onClick={() => {
                sfx.tap()
                setPeriode(null)
                setMonProgramme(false)
              }}
              className="mt-3 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
            >
              Chercher dans toutes les fiches
            </button>
          ) : ailleurs > 0 ? (
            <button
              type="button"
              onClick={() => changerVolet(volet === 'personnages' ? 'evenements' : 'personnages')}
              className="mt-3 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
            >
              {ailleurs} résultat{ailleurs > 1 ? 's' : ''} dans{' '}
              {volet === 'personnages' ? 'les événements' : 'les personnages'}
            </button>
          ) : null}
        </div>
      ) : (
        <div className={GRILLE}>
          {resultats.map((apercu) => (
            <CarteApercu
              key={apercu.id}
              apercu={apercu}
              slug={slug}
              lue={lues.has(apercu.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Une puce de filtre. Active, elle est VIOLETTE — dans cet écran le violet est
 * la couleur de ce qui se clique et de ce qui est choisi ; la teinte de la
 * période reste une simple gommette, une identité, jamais un état.
 */
function PuceFiltre({
  actif,
  teinte,
  icone = false,
  onSelect,
  children,
}: {
  actif: boolean
  teinte?: Periode
  icone?: boolean
  onSelect: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={actif}
      data-teinte={teinte ? teinteDe(teinte) : undefined}
      onClick={() => {
        sfx.tap()
        onSelect()
      }}
      className={cn(
        'flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs whitespace-nowrap transition-colors',
        actif
          ? 'border-primary bg-primary font-extrabold text-primary-foreground'
          : 'border-border bg-card font-semibold text-muted-foreground hover:border-primary/40 hover:text-foreground',
      )}
    >
      {icone ? (
        <SlidersHorizontal className="size-3.5" aria-hidden="true" />
      ) : teinte ? (
        <span
          aria-hidden="true"
          className={cn(
            styles.gommette,
            'size-2 rounded-full',
            actif ? 'opacity-0' : null,
          )}
        />
      ) : null}
      {children}
    </button>
  )
}
