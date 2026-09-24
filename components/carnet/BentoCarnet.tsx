'use client'

import Link from 'next/link'
import { useMemo, useState, useTransition } from 'react'
import { ChevronRight, Eye, EyeOff, Layers, Play, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'
import { epinglerCours } from '@/app/carnet/actions'
import { deleteCourse } from '@/app/carnet/cours/actions'
import ProgressRing from '@/components/ProgressRing'
import CarnetFab from '@/components/carnet/CarnetFab'
import CarteCours from '@/components/carnet/CarteCours'
import CreateCourseSheet from '@/components/carnet/CreateCourseSheet'
import OptionsCoursSheet from '@/components/carnet/OptionsCoursSheet'
import { COURSE_ICON, COURSE_TINT } from '@/components/carnet/style'
import { normalizeCourseColor, normalizeCourseIcon } from '@/lib/carnet-cours'
import {
  ORDRES,
  ORDRE_LABEL,
  parametresSession,
  type PreferencesCarnet,
} from '@/lib/carnet/preferences'
import {
  objectifDuJour,
  separerFavoris,
  trierCours,
  type CoursCarnet,
  type ObjectifDuJour,
} from '@/lib/carnet/priorite'
import {
  libelleDerniereSeance,
  suggestionCarnet,
  type Suggestion,
} from '@/lib/carnet/suggestion'

// -----------------------------------------------------------------------------
// LE CARNET EN BENTO — tout l'onglet sur un écran, sans empilement.
//
// Refonte du 08/09/2026 (Lucas : « je ne veux pas de succession de blocs à la
// verticale, ça fait amateur ; il faut le côté répétition espacée, lui proposer
// le cours prioritaire ; pouvoir personnaliser au maximum »).
//
// De haut en bas, et c'est tout (10/09/2026) :
//   1. LA BARRE D'OUTILS, une ligne : l'ordre des dossiers, A → Z ou Récents
//      (« Urgence » en est parti le 10/09/2026 — Lucas : « supprime urgence »,
//      l'urgence ne sert plus qu'à la suggestion). Le ⚙ du titre (la feuille
//      « Personnaliser mon carnet », `PersonnaliserCarnetSheet`) a été retiré
//      le même jour (« supprime icone tout en haut à droite ») : les autres
//      préférences (objectif, grille/liste, brouillons, session par défaut)
//      restent lues en base mais n'ont plus d'écran de réglage. Le bouton
//      grille/liste et le bouton « IA » étaient déjà partis (« supprime ») :
//      l'IA s'ouvre par le + comme tout cours. LA RECHERCHE (un champ, les pastilles de
//      couleur, `lib/carnet/filtre`) a suivi le même jour — Lucas : « cela
//      fait beaucoup en filtrage, vaut mieux supprimer tout ceci ». Ce qui
//      reste pour alléger l'écran : L'ŒIL sur « Mes autres dossiers », qui
//      cache d'un tap tout ce qui n'est pas favori ;
//   2. LA SUGGESTION, un seul bloc, juste au-dessus des dossiers — plus près
//      du pouce que sous le titre — qui répond à « qu'est-ce que je fais
//      maintenant ? » : reprendre le cours de la DERNIÈRE SÉANCE (▶,
//      l'objectif du jour en anneau), remplir un dossier vide (« Coller mon
//      cours » ouvre l'IA dessus), ou créer le premier. La règle est pure :
//      `lib/carnet/suggestion`. Il a remplacé DEUX blocs héros (« 12 cartes à
//      revoir » / « En premier ») qui doublaient le + et se contredisaient ;
//   3. LES DOSSIERS, en grille ou en liste selon l'élève — en grille, la
//      même rangée que les dossiers de matière de Réviser. Les FAVORIS
//      (l'étoile de chaque dossier) passent en tête, un filet les sépare des
//      autres ; les cours vides (brouillons) sont dans la grille, marqués
//      « à remplir » ; les archivés ferment la marche, estompés.
// Le + flottant (CarnetFab) est LE SEUL bouton de création, et il ouvre LA
// SEULE feuille « Nouveau dossier » — tenue ici, parce qu'elle a besoin des
// dossiers existants (doublons) et des matières de Réviser.
// Les rangées repliées « Brouillons » et « Archives » ont disparu le
// 10/09/2026 (Lucas : « supprime ») : un dossier est un dossier, il est dans
// la grille ou il n'est nulle part.
// « Ma semaine » (le planning du carnet) a quitté l'écran : l'onglet Semaine
// est LE calendrier de l'élève, il n'en faut pas un deuxième ici.
//
// L'ÉTAT EST LOCAL ET OPTIMISTE : préférences et dossiers vivent dans ce
// composant, chaque geste les met à jour tout de suite, les Server Actions
// écrivent derrière et le prochain rendu serveur fait foi.
//
// STUDUEL (15/09/2026) : le carnet n'est pas un onglet de la barre mais une
// page ouverte depuis Réviser (« Mon carnet », sur la ligne du titre) — d'où
// la flèche retour à côté du titre. Et « À revoir aujourd'hui » (la session
// transverse, `/carnet/cours/revoir`) est reliée ICI, sous la suggestion, dès
// que des cartes sont dues dans AU MOINS DEUX dossiers : la suggestion ne
// reprend qu'un cours, ce lien joue tout ce qui est dû d'un coup.
//
// MA BIBLIOTHÈQUE (24/09/2026) : le carnet est devenu le rayon « Dossiers » de
// la bibliothèque, à côté des capsules et des fiches achetées. L'en-tête et le
// filtre sont tenus par `components/bibliotheque/Bibliotheque`, qui garde ce
// composant monté (caché) quand un autre rayon s'affiche.
// -----------------------------------------------------------------------------

export default function BentoCarnet({
  cours: coursInitiaux,
  prefs: prefsInitiales,
  revuesAujourdhui,
  aujourdhui,
}: {
  cours: CoursCarnet[]
  prefs: PreferencesCarnet
  /** Cartes revues aujourd'hui, tous dossiers confondus. */
  revuesAujourdhui: number
  aujourdhui: string
}) {
  const [cours, setCours] = useState(coursInitiaux)
  const [prefs, setPrefs] = useState(prefsInitiales)
  const [creer, setCreer] = useState(false)
  const [optionsDe, setOptionsDe] = useState<string | null>(null)
  const [, startTransition] = useTransition()
  /** L'œil : les dossiers non favoris se montrent (défaut) ou se cachent. */
  const [autresVisibles, setAutresVisibles] = useState(true)

  const modifierCours = (id: string, patch: Partial<CoursCarnet>) =>
    setCours((liste) =>
      liste.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    )

  const params = parametresSession(prefs.sessionDefaut)
  const hrefRevision = (id: string) => `/carnet/cours/${id}/reviser${params}`

  const { favoris, autres } = useMemo(() => {
    const tries = trierCours(cours, prefs.ordre)
    // Les cours vides ne s'affichent que si l'élève le veut (⚙ → « Brouillons
    // visibles ») ; la suggestion, elle, se calcule sur tout le carnet.
    const visibles = tries.filter(
      (c) => c.archive || c.questionCount > 0 || prefs.afficherBrouillons,
    )
    const groupes = separerFavoris(visibles.filter((c) => !c.archive))
    return {
      favoris: groupes.favoris,
      // Les archivés ferment la marche : visibles, estompés, jamais devant.
      autres: [...groupes.autres, ...visibles.filter((c) => c.archive)],
    }
  }, [cours, prefs.ordre, prefs.afficherBrouillons])

  /** L'étoile d'un dossier : favori ou non, tout de suite à l'écran. */
  const basculerFavori = (c: CoursCarnet) => {
    sfx.tap()
    const favori = !c.epingle
    modifierCours(c.id, { epingle: favori })
    startTransition(async () => {
      const r = await epinglerCours(c.id, favori)
      if (!r.ok) {
        modifierCours(c.id, { epingle: !favori })
        toast(r.message ?? 'Réessaie dans un instant.', 'error')
      }
    })
  }

  /**
   * Supprimer un dossier (⋯ → « Supprimer ce dossier », confirmé dans la
   * feuille). Optimiste : il disparaît tout de suite ; s'il ne part pas en
   * base, il revient et un toast le dit.
   */
  const supprimerCours = (id: string) => {
    const dossier = cours.find((c) => c.id === id)
    if (!dossier) return
    setOptionsDe(null)
    setCours((liste) => liste.filter((c) => c.id !== id))
    startTransition(async () => {
      const r = await deleteCourse(id)
      if (r.ok) {
        toast('Dossier supprimé')
      } else {
        setCours((liste) => [dossier, ...liste])
        toast('Suppression impossible. Réessaie dans un instant.', 'error')
      }
    })
  }

  const objectif = objectifDuJour(revuesAujourdhui, prefs.objectifCartes)
  // Les cartes dues, tous dossiers (non archivés) confondus, et dans combien.
  const duesEnTout = cours.reduce(
    (acc, c) =>
      c.archive || c.dueCount === 0
        ? acc
        : { cartes: acc.cartes + c.dueCount, dossiers: acc.dossiers + 1 },
    { cartes: 0, dossiers: 0 },
  )
  // La suggestion se calcule sur TOUT le carnet, jamais sur ce que le filtre montre.
  const suggestion = suggestionCarnet(cours, aujourdhui)
  const ouvrirCreation = () => {
    sfx.open()
    setCreer(true)
  }
  const coursOptions = cours.find((c) => c.id === optionsDe) ?? null

  // L'en-tête, le filtre de la bibliothèque, les capsules et les fiches vivent
  // dans `Bibliotheque` (24/09/2026) : ce composant n'est plus que le rayon
  // Dossiers.
  return (
    <>
      {/* --- 1. La barre d'outils ------------------------------------------ */}
      <div className="flex items-center gap-1.5">
        <div
          className="flex min-w-0 flex-1 gap-0.5 rounded-full bg-muted/60 p-0.5"
          role="radiogroup"
          aria-label="Ordre des dossiers"
        >
          {ORDRES.map((o) => (
            <button
              key={o}
              type="button"
              role="radio"
              aria-checked={prefs.ordre === o}
              onClick={() => {
                sfx.tap()
                setPrefs((p) => ({ ...p, ordre: o }))
              }}
              className={cn(
                'min-w-0 flex-1 truncate rounded-full py-1.5 text-[11.5px] font-extrabold transition-colors',
                prefs.ordre === o
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-muted-foreground',
              )}
            >
              {ORDRE_LABEL[o]}
            </button>
          ))}
        </div>
      </div>

      {/* --- 2. La suggestion, SOUS la barre d'outils (10/09/2026) ---------
          Lucas : « le bloc A→Z / récents en haut, reprendre au-dessus
          des favoris, plus proche du doigt ». */}
      <BlocSuggestion
        suggestion={suggestion}
        objectif={objectif}
        aujourdhui={aujourdhui}
        hrefRevision={hrefRevision}
        onCreer={ouvrirCreation}
      />
      {duesEnTout.dossiers >= 2 ? (
        <Link
          href="/carnet/cours/revoir"
          onClick={() => sfx.tap()}
          className="carte flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-extrabold text-foreground transition active:scale-[0.99]"
        >
          <Layers
            className="size-4 shrink-0 text-primary"
            strokeWidth={2.6}
            aria-hidden="true"
          />
          <span className="min-w-0 flex-1 truncate">
            Tout revoir aujourd’hui
            <span className="block text-[11px] font-semibold text-muted-foreground tabular-nums">
              {duesEnTout.cartes} carte{duesEnTout.cartes > 1 ? 's' : ''} dues
              dans {duesEnTout.dossiers} dossiers
            </span>
          </span>
          <ChevronRight
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        </Link>
      ) : null}

      {/* --- 3. Les dossiers ----------------------------------------------- */}
      {/* Carnet vide : la suggestion en tête dit déjà « Crée ton premier
          dossier » — pas de second message ici. */}
      {cours.length === 0 ? null : favoris.length + autres.length === 0 ? (
        <p className="rounded-2xl bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
          Tes cours sont vides et cachés — remplis-en un, ou rends les
          brouillons visibles (⚙).
        </p>
      ) : (
        <>
          {/* Les deux groupes portent chacun leur libellé EN TÊTE — petites
              capitales muted — et un filet les sépare (10/09/2026). Un trait
              nu se lisait comme un trou ; nommé, le vide devient un choix.
              Libellés décoratifs : les listes ont déjà le leur en
              `aria-label`. Un seul groupe à l'écran = pas de libellé, rien
              à distinguer. */}
          {favoris.length > 0 && autres.length > 0 ? (
            <LibelleGroupe>Mes favoris</LibelleGroupe>
          ) : null}
          {favoris.length > 0 ? (
            <ListeDossiers
              label="Mes dossiers favoris"
              cours={favoris}
              affichage={prefs.affichage}
              hrefRevision={hrefRevision}
              onOptions={setOptionsDe}
              onFavori={basculerFavori}
            />
          ) : null}
          {favoris.length > 0 && autres.length > 0 ? (
            <>
              <hr className="mx-4 my-1 border-black/10" aria-hidden="true" />
              {/* L'ŒIL (10/09/2026) : cache ou montre tout ce qui n'est pas
                  favori. L'élève garde ses trois dossiers du moment sous les
                  yeux, le reste attend derrière. Choix de session, pas de
                  préférence en base : au retour, tout se montre. */}
              <div className="flex items-center justify-between gap-2">
                <LibelleGroupe>
                  {autresVisibles
                    ? 'Mes autres dossiers'
                    : `${autres.length} autre${autres.length > 1 ? 's' : ''} dossier${autres.length > 1 ? 's' : ''} caché${autres.length > 1 ? 's' : ''}`}
                </LibelleGroupe>
                <button
                  type="button"
                  aria-pressed={!autresVisibles}
                  aria-label={
                    autresVisibles
                      ? 'Cacher mes autres dossiers'
                      : 'Montrer mes autres dossiers'
                  }
                  onClick={() => {
                    sfx.tap()
                    setAutresVisibles((v) => !v)
                  }}
                  className={cn(
                    'mr-1 flex size-8 shrink-0 items-center justify-center rounded-full ring-1 transition active:scale-90',
                    autresVisibles
                      ? 'bg-card text-muted-foreground ring-black/[0.06]'
                      : 'bg-primary/10 text-primary ring-primary/30',
                  )}
                >
                  {autresVisibles ? (
                    <Eye
                      className="size-4"
                      strokeWidth={2.4}
                      aria-hidden="true"
                    />
                  ) : (
                    <EyeOff
                      className="size-4"
                      strokeWidth={2.4}
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>
            </>
          ) : null}
          {autres.length > 0 && (autresVisibles || favoris.length === 0) ? (
            <ListeDossiers
              label={
                favoris.length > 0 ? 'Mes autres dossiers' : 'Mes dossiers'
              }
              cours={autres}
              affichage={prefs.affichage}
              hrefRevision={hrefRevision}
              onOptions={setOptionsDe}
              onFavori={basculerFavori}
            />
          ) : null}
        </>
      )}

      {/* --- Le + flottant et les feuilles ---------------------------------- */}
      <CarnetFab onCreer={ouvrirCreation} />
      <OptionsCoursSheet
        cours={coursOptions}
        onClose={() => setOptionsDe(null)}
        onChange={modifierCours}
        onDelete={supprimerCours}
      />
      <CreateCourseSheet
        open={creer}
        onClose={() => setCreer(false)}
        cours={cours}
      />
    </>
  )
}

// -----------------------------------------------------------------------------
// LA SUGGESTION — un bloc, trois états (`lib/carnet/suggestion`).
//   · REPRENDRE : violet, la vignette du cours, « n cartes · ~m min · raison »,
//     l'anneau de l'objectif du jour à droite, ▶ au bout. Toute la carte lance
//     la révision ;
//   · REMPLIR : jaune (« À remplir », la pastille des brouillons), « Ton
//     dossier X attend ses questions », et UN bouton : « Coller mon cours »,
//     qui ouvre le cours avec la feuille de l'IA déjà ouverte (`?ia=1`) ;
//   · CRÉER : violet, « Crée ton premier dossier », ouvre la feuille.
// -----------------------------------------------------------------------------

function BlocSuggestion({
  suggestion,
  objectif,
  aujourdhui,
  hrefRevision,
  onCreer,
}: {
  suggestion: Suggestion
  objectif: ObjectifDuJour
  aujourdhui: string
  hrefRevision: (id: string) => string
  onCreer: () => void
}) {
  if (suggestion.type === 'creer') {
    return (
      <button
        type="button"
        onClick={onCreer}
        aria-haspopup="dialog"
        className="carnet-hero flex items-center gap-3 rounded-carte bg-primary p-3 text-left text-primary-foreground transition active:scale-[0.98]"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/16 text-xl">
          ✨
        </span>
        <span className="min-w-0 flex-1">
          <span className="font-heading block text-[15px] leading-tight font-extrabold">
            Crée ton premier dossier
          </span>
          <span className="mt-0.5 block text-[11px] leading-tight text-primary-foreground/80">
            Un dossier par cours. Colle ton cours, l’IA rédige les questions, tu
            valides.
          </span>
        </span>
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-highlight text-foreground shadow-sm"
          aria-hidden="true"
        >
          <Sparkles className="size-4" strokeWidth={2.6} />
        </span>
      </button>
    )
  }

  const { cours } = suggestion
  const Icone = COURSE_ICON[normalizeCourseIcon(cours.icon)]
  const teinte = COURSE_TINT[normalizeCourseColor(cours.color)]

  if (suggestion.type === 'remplir') {
    return (
      <div className="carnet-hero flex items-center gap-3 rounded-carte bg-highlight/30 p-3 ring-1 ring-highlight/50">
        <span
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white',
            teinte,
          )}
          aria-hidden="true"
        >
          <Icone className="size-5" strokeWidth={2.2} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[10px] font-extrabold tracking-wide text-foreground/60 uppercase">
            À remplir
          </span>
          <span className="font-heading line-clamp-2 text-[14px] leading-tight font-extrabold text-foreground">
            Ton dossier « {cours.title} » attend ses questions
          </span>
        </span>
        <Link
          href={`/carnet/cours/${cours.id}?ia=1`}
          onClick={() => sfx.tap()}
          className="btn-chunky flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-3 py-2 text-xs font-extrabold text-primary-foreground"
        >
          <Sparkles className="size-3.5" strokeWidth={2.6} aria-hidden="true" />
          Coller mon cours
        </Link>
      </div>
    )
  }

  const { cartes, minutes, raison, derniereSeance } = suggestion
  // « dernière séance hier » dit d'où l'on repart ; sinon, la raison du choix.
  const complement = libelleDerniereSeance(derniereSeance, aujourdhui) ?? raison
  return (
    <Link
      href={hrefRevision(cours.id)}
      onClick={() => sfx.tap()}
      aria-label={`Reprendre ${cours.title} : ${cartes} carte${cartes > 1 ? 's' : ''}, environ ${minutes} minute${minutes > 1 ? 's' : ''}, ${complement}. Lancer la révision.`}
      className="carnet-hero relative flex items-center gap-3 rounded-carte bg-primary p-3 pr-2.5 text-primary-foreground transition active:scale-[0.98]"
    >
      <span
        className={cn(
          'flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white',
          teinte,
        )}
        aria-hidden="true"
      >
        <Icone className="size-5" strokeWidth={2.2} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-extrabold tracking-wide text-primary-foreground/70 uppercase">
          Reprendre
        </span>
        <span className="font-heading line-clamp-2 text-[14px] leading-tight font-extrabold">
          {cours.title}
        </span>
        <span className="mt-0.5 block truncate text-[11px] leading-tight font-semibold text-primary-foreground/80 tabular-nums">
          {cartes} carte{cartes > 1 ? 's' : ''} · environ {minutes} min ·{' '}
          {complement}
        </span>
      </span>
      {/* L'objectif du jour, en anneau : c'est ici que le compte du jour se lit. */}
      <ProgressRing
        value={objectif.pct / 100}
        size={44}
        strokeWidth={5}
        trackClassName="stroke-white/25"
        fillClassName={objectif.atteint ? 'stroke-highlight' : 'stroke-white'}
        label={`Objectif du jour : ${objectif.fait} sur ${objectif.total} cartes`}
      >
        <span className="text-[10px] font-extrabold tabular-nums">
          {Math.min(objectif.fait, objectif.total)}/{objectif.total}
        </span>
      </ProgressRing>
      {/* Le ▶, plus gros que les autres pastilles : c'est LA cible du pouce. */}
      <span
        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-highlight text-foreground shadow-sm"
        aria-hidden="true"
      >
        <Play className="size-4 fill-current" />
      </span>
    </Link>
  )
}

/** Le libellé d'un groupe de dossiers, sur le filet : petites capitales muted. */
function LibelleGroupe({ children }: { children: string }) {
  return (
    <span
      aria-hidden="true"
      className="px-4 text-[10.5px] font-extrabold tracking-[0.08em] text-muted-foreground uppercase"
    >
      {children}
    </span>
  )
}

function ListeDossiers({
  label,
  cours,
  affichage,
  hrefRevision,
  onOptions,
  onFavori,
}: {
  label: string
  cours: CoursCarnet[]
  affichage: PreferencesCarnet['affichage']
  hrefRevision: (id: string) => string
  onOptions: (id: string) => void
  onFavori: (c: CoursCarnet) => void
}) {
  return (
    <ul
      className={cn(
        affichage === 'grille'
          ? 'grid grid-cols-2 gap-2.5'
          : 'flex flex-col gap-1.5',
      )}
      aria-label={label}
    >
      {cours.map((c) => (
        <CarteCours
          key={c.id}
          cours={c}
          affichage={affichage}
          hrefRevision={hrefRevision(c.id)}
          onOptions={() => onOptions(c.id)}
          onFavori={() => onFavori(c)}
        />
      ))}
    </ul>
  )
}
