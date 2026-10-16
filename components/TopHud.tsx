'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogIn } from 'lucide-react'
import BadgeBoostXp, { useBoostEnCours } from '@/components/BadgeBoostXp'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import XpIcon from '@/components/ui/XpIcon'
import FeteNiveau, { CoffresPalier } from '@/components/niveau/FeteNiveau'
import { gemmesPalier, prochainPalier } from '@/lib/niveaux'
import type { UniteGain } from '@/lib/gains'
import { ecouterGains } from '@/lib/hud-gains'
import { AMIS_MAX, libelleMultiplicateur, multiplicateurXp } from '@/lib/ligue'
import { PORTRAIT_FACE_CROP } from '@/lib/portraits'
import type { AvatarAffiche } from '@/lib/avatar-affiche'
import {
  isHudAccountHidden,
  isHudHidden,
  isHudOverDarkScene,
} from '@/lib/top-hud-routes'
import { cadreDeRang, divisionRomaine, PLAQUE_CADRE_Y, TROU_CADRE } from '@/lib/rang-visuel'
import type { RankTierId } from '@/lib/rank'
import s from './TopHud.module.css'
import { cn } from '@/lib/utils'
import { compteCourt } from '@/lib/compte-court'

/** Quelle bulle est ouverte, s'il y en a une : le niveau, les gemmes ou le multiplicateur d'XP. */
type OpenPurse = 'niveau' | 'cristal' | 'multiplicateur' | null

/** L'XP de l'élève dans son niveau : de quoi dire ce qu'il reste à gagner. */
export type XpHud = {
  /** XP cumulée. */
  actuel: number
  /** XP où commence le niveau atteint. */
  plancher: number
  /** XP où commence le niveau suivant (null : dernier niveau). */
  prochain: number | null
}

/**
 * L'avatar de l'élève, déjà résolu par le serveur (lib/avatar-affiche) : le
 * bandeau n'embarque pas DiceBear, il n'importe que le type.
 */
export type AvatarHud = AvatarAffiche

/** Le rang de ligue de l'élève, tel que le bandeau le dessine. */
export type RangHud = {
  rang: RankTierId
  /** 4 → 1 ; null au sommet (Maître). */
  division: number | null
  /** « Argent II ». */
  nom: string
}

/**
 * Le bandeau du haut, façon Clash Royale : les infos de jeu que l'élève garde
 * sous les yeux partout — son niveau, sa monnaie (les gemmes ; plus de pièces
 * depuis le 16/09/2026) et l'accès au profil —
 * FLOTTENT au-dessus du fond d'écran de chaque interface. Plus de barre pleine
 * largeur opaque : chaque info est une pastille translucide (backdrop-blur +
 * ombre) posée sur le décor, si bien qu'on voit le fond de l'arène / de l'onglet
 * derrière. Mobile uniquement (`md:hidden`) : sur desktop la sidebar porte déjà
 * l'identité. Les valeurs viennent du serveur (TopHudLoader) ; ce composant ne
 * fait que l'affichage + le masquage sur le parcours d'accueil plein écran.
 */
export default function TopHud({
  gems,
  level,
  levelTitle,
  progress,
  userLabel,
  boostXpJusqua = null,
  avatar = null,
  nbAmis = null,
  xp = null,
  paliersOuverts = [],
  rang = null,
}: {
  /** Solde de gemmes, ou null pour un visiteur non connecté. */
  gems: number | null
  /** Niveau (1..10), ou null pour un visiteur. */
  level: number | null
  levelTitle: string | null
  /** Progression vers le niveau suivant (0..1). */
  progress: number
  userLabel: string | null
  /**
   * Fin du Boost XP du Marché qui court (ISO), ou null. Tant qu'il court,
   * l'écusson porte « ×2 XP » (Lucas, 19/09/2026 : « le x2 exp doit apparaître
   * ici une fois acheté »).
   */
  boostXpJusqua?: string | null
  /** L'avatar de l'élève, dans le disque de l'écusson ; null : le numéro de niveau. */
  avatar?: AvatarHud | null
  /**
   * Amis acceptés, qui règlent le multiplicateur d'XP (lib/ligue, migration
   * 380 : +0,1 par ami, 10 au plus). null : inconnu, il ne s'affiche pas.
   */
  nbAmis?: number | null
  /** L'XP dans le niveau, pour la bulle « Encore N XP » ; null : inconnue. */
  xp?: XpHud | null
  /** Les coffres de palier de niveau déjà ouverts (556). */
  paliersOuverts?: number[]
  /**
   * Le rang de ligue (lib/ligue : Bronze IV → Maître), qui choisit l'anneau
   * autour de l'avatar ; null : inconnu, l'avatar garde un anneau blanc.
   */
  rang?: RangHud | null
}) {
  const pathname = usePathname()
  // La bulle d'explication d'une monnaie (façon Brawl Stars). Une seule ouverte
  // à la fois : taper l'autre monnaie bascule, taper ailleurs referme. On
  // mémorise l'écran d'ouverture pour DÉDUIRE la fermeture au changement de
  // page (plutôt qu'un effet qui remettrait l'état à zéro après coup).
  const [opened, setOpened] = useState<{ purse: OpenPurse; path: string }>({
    purse: null,
    path: pathname,
  })
  const openPurse = opened.path === pathname ? opened.purse : null
  const pursesRef = useRef<HTMLDivElement>(null)
  // Le multiplicateur vit dans le bloc de niveau, loin de la bourse : sa boîte
  // est surveillée elle aussi par la fermeture au tap extérieur.
  const multiplicateurRef = useRef<HTMLSpanElement>(null)
  // Le bloc de niveau (titre + barre) ouvre SA bulle : « Encore N XP ».
  const niveauRef = useRef<HTMLDivElement>(null)
  // L'écusson encaisse les jetons d'XP : il ne porte pas de nombre, donc il n'a
  // rien à incrémenter — seul le sursaut dit que quelque chose est arrivé. La
  // barre, elle, se remplira au rafraîchissement qui suit la volée.
  //
  // ⚠️ APPELÉ ICI, AVANT le `return null` du parcours plein écran : un hook
  // placé après un retour anticipé ne s'exécute pas à tous les rendus.
  // La base est l'XP cumulée (et non plus le niveau) : chaque éclair qui tombe
  // fait AVANCER LA BARRE, jeton après jeton, comme chez Clash Royale.
  const { ref: encaisseXpRef, delta: xpGagnee } = useEncaissement('xp', xp?.actuel ?? level)

  const togglePurse = (purse: Exclude<OpenPurse, null>) =>
    setOpened({ purse: openPurse === purse ? null : purse, path: pathname })
  const closePurse = () => setOpened({ purse: null, path: pathname })

  // Fermeture au tap extérieur / Échap. Les écouteurs ne sont posés QUE quand
  // une bulle est ouverte : le bandeau est monté sur toutes les pages.
  useEffect(() => {
    if (!openPurse) return

    const closeOnOutside = (event: PointerEvent) => {
      const cible = event.target as Node
      if (
        !pursesRef.current?.contains(cible) &&
        !multiplicateurRef.current?.contains(cible) &&
        !niveauRef.current?.contains(cible)
      )
        closePurse()
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePurse()
    }

    document.addEventListener('pointerdown', closeOnOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
    // `closePurse` se reconstruit à chaque rendu ; ce qui compte pour poser ou
    // retirer les écouteurs, c'est l'ouverture et l'écran courant.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openPurse, pathname])

  // Parcours d'accueil plein écran (façon Duolingo) : aucun bandeau. Garde
  // indispensable même si le serveur filtre déjà : en navigation CLIENT, le
  // layout racine n'est pas re-rendu, donc ce composant reste monté.
  //
  // ⚠️ SAUF POUR UN ÉLÈVE CONNECTÉ : le bandeau reste alors monté, rangé
  // au-dessus de l'écran (`data-hud-dissimule`). Une fin de quiz y fait voler
  // ses éclairs et ses gemmes ; il descend le temps de la volée
  // (`html.hud-volee`, posée par RecompensesProvider) puis remonte.
  const dissimule = isHudHidden(pathname)
  if (dissimule && level === null) {
    return null
  }

  const accountHref = userLabel ? '/compte' : '/login'
  const accountActive = pathname === '/compte' || pathname.startsWith('/login')
  const connected = level !== null
  // La barre suit l'XP encaissée pendant la volée ; elle plafonne à 100 % —
  // la fête de niveau prend le relais au rafraîchissement qui suit.
  const pct =
    xp && xp.prochain !== null && xp.prochain > xp.plancher
      ? Math.min(
          100,
          Math.round(((xp.actuel + xpGagnee - xp.plancher) / (xp.prochain - xp.plancher)) * 100),
        )
      : Math.round(progress * 100)
  // Scène sombre (arène) : les pastilles prennent le verre de nuit du HUD de
  // jeu au lieu du crème des onglets clairs. Un seul matériau par écran.
  // L'arène elle-même porte la gélule lavande, comme les onglets clairs
  // (03/10/2026) : seules ses salles de jeu gardent le verre de nuit.
  const dark = isHudOverDarkScene(pathname) && pathname !== '/defi'
  // L'engrenage a quitté le bandeau : pour un élève connecté, les réglages ne
  // vivent plus qu'à UN endroit, la carte de profil de l'onglet Moi. Le
  // visiteur, lui, garde la case — chez lui ce n'est pas un engrenage mais un
  // « Se connecter ». Voir lib/top-hud-routes.
  const accountHidden = isHudAccountHidden(pathname, connected)
  // Le fond commun des pastilles : verre de nuit sur l'arène, GÉLULE LAVANDE
  // ailleurs (maquette « D · Lavande douce », choisie par Lucas le 03/10/2026 :
  // « le fond blanc, la police, cela ne me convient pas »). Plein, sans flou
  // (18/09/2026) : le flou se recalculait à chaque image du défilement.
  const pillSurface = dark ? 'olympe-glass' : 'bg-secondary hud-gelule'
  // UN SEUL ÉCUSSON (Lucas, 17/09/2026 : « le bloc gemme doit aller à côté de
  // la flamme série »). Niveau, série et cristaux tiennent dans la même
  // pastille, séparés par des filets ; le bord droit de la bande est libre —
  // Réviser y pose sa puce de classe. Sur l'arène, le bandeau entier se
  // masque (la carte du joueur porte tout), donc plus de bande « fusionnée ».

  // LA GÉLULE (15/10/2026, maquette « D · Gélule premium » choisie par Lucas,
  // version sans série ni quêtes — TopHud.module.css) : l'avatar dans l'anneau
  // de son rang de ligue, « Niveau 8 » et sa barre (« 152 / 800 XP » dedans),
  // le multiplicateur dans sa case, les gemmes et leur « + ». La série vit dans
  // Réviser, les quêtes dans components/quetes/BoutonQuetesFlottant. Le
  // bandeau ne capte pas les taps : seule la gélule est cliquable.
  const dansNiveau =
    xp && xp.prochain !== null && xp.prochain > xp.plancher
      ? {
          fait: Math.max(0, xp.actuel + xpGagnee - xp.plancher),
          pas: xp.prochain - xp.plancher,
        }
      : null
  const photo = avatar ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={avatar.src}
      alt=""
      className={avatar.visage ? 'absolute max-w-none object-contain' : undefined}
      style={avatar.visage ? PORTRAIT_FACE_CROP : undefined}
    />
  ) : null
  return (
    // Sur un mode de jeu, le bandeau s'efface dès qu'on défile et revient en
    // haut de page (`html.hud-replie`, posée par components/useHudAuDefilement).
    <header
      data-hud-dissimule={dissimule ? '' : undefined}
      aria-hidden={dissimule ? true : undefined}
      className={cn(
        // `[html.hud-volee_&]:z-[80]` : le temps d'une volée de récompenses,
        // le bandeau passe DEVANT le voile d'une feuille (z-70) — la barre de
        // niveau qu'on remplit doit se voir, pas s'assombrir.
        'pointer-events-none fixed inset-x-0 top-0 z-50 flex h-[4.75rem] items-end gap-2 pb-2.5 px-3 pl-4 transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none md:hidden [html.hud-replie_&]:-translate-y-full [html.hud-replie_&]:opacity-0 [html.hud-volee_&]:z-[80]',
        dissimule &&
          'invisible -translate-y-[130%] opacity-0 duration-300 [html.hud-volee_&]:visible [html.hud-volee_&]:translate-y-0 [html.hud-volee_&]:opacity-100 [&_*]:pointer-events-none!',
      )}
    >
      {connected ? (
        <>
          {dissimule ? null : <FeteNiveau level={level} levelTitle={levelTitle} paliersOuverts={paliersOuverts} xp={xp} />}

          {/* LA GÉLULE (15/10/2026) : l'avatar dans l'anneau de son rang qui
              en déborde, le niveau et sa barre, le multiplicateur dans sa
              case, les gemmes. */}
          <div className={s.gelule}>
            {/* L'AVATAR DANS L'ANNEAU DE SON RANG — le métal dit le rang de
                ligue, la plaque du bas sa division en chiffres romains. Le
                toucher ouvre le vestiaire : « les élèves vont cliquer dessus,
                c'est certain ». */}
            <Link
              href="/moi/avatar"
              aria-label={`${rang ? `Rang ${rang.nom}` : `Niveau ${level}`} — personnaliser mon avatar`}
              title={rang?.nom ?? levelTitle ?? undefined}
              className={s.rang}
            >
              <span
                className={cn(s.photo, !rang && s.sansRang)}
                style={rang ? { width: `${TROU_CADRE * 100}%`, height: `${TROU_CADRE * 100}%` } : undefined}
              >
                {photo ?? <span className={s.niveauSeul}>{level}</span>}
              </span>
              {rang ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cadreDeRang(rang.rang, rang.division)} alt="" className={s.cadre} />
                  {rang.division !== null ? (
                    <span aria-hidden="true" className={s.division} style={{ top: `${PLAQUE_CADRE_Y * 100}%` }}>
                      {divisionRomaine(rang.division)}
                    </span>
                  ) : null}
                </>
              ) : null}
              {/* LE BOOST XP QUI COURT, en étiquette sur le haut de l'avatar. */}
              <BadgeBoostXp
                jusqua={boostXpJusqua}
                className="absolute top-0 left-1/2 z-[4] -translate-x-1/2 px-1 text-[8px] whitespace-nowrap"
              />
            </Link>

            {/* LE NIVEAU ET SA BARRE : « Niveau 8 », puis l'XP qui se remplit,
                « 152 / 800 XP » écrit dedans. C'est la cible des éclairs : chaque
                jeton qui tombe la fait avancer. Le toucher ouvre sa bulle. */}
            <div
              ref={(el) => {
                niveauRef.current = el
                encaisseXpRef.current = el
              }}
              data-hud-cible="xp"
              className={s.niveau}
            >
              <button
                type="button"
                onClick={() => togglePurse('niveau')}
                aria-expanded={openPurse === 'niveau'}
                aria-controls="bourse-niveau"
                aria-label={`Niveau ${level} : ce qu’il reste pour le niveau ${level + 1}`}
                className={s.niveauBouton}
              >
                <span aria-hidden="true" className={s.titre}>
                  Niveau {level}
                </span>
                <span
                  className={s.barre}
                  role="progressbar"
                  aria-label={`Progression vers le niveau ${level + 1}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={pct}
                >
                  <span className={cn(s.remplissage, xpGagnee > 0 && 'hud-barre-lueur')} style={{ width: `${pct}%` }} />
                  <span aria-hidden="true" className={s.chiffresBarre}>
                    {dansNiveau
                      ? `${dansNiveau.fait.toLocaleString('fr-FR')} / ${dansNiveau.pas.toLocaleString('fr-FR')} XP`
                      : xp
                        ? 'Niveau max'
                        : `${pct} %`}
                  </span>
                </span>
              </button>
              {xpGagnee > 0 ? (
                <span
                  key={xpGagnee}
                  className={cn(
                    s.gain,
                    'hud-gain-xp font-heading rounded-full bg-highlight px-1.5 py-0.5 text-[11px] leading-none font-extrabold text-foreground tabular-nums',
                  )}
                >
                  +{xpGagnee}
                </span>
              ) : null}
              {openPurse === 'niveau' ? (
                <BulleHud
                  id="bourse-niveau"
                  titre={`Niveau ${level}${levelTitle ? ` · ${levelTitle}` : ''}`}
                  titreClassName={dark ? 'text-highlight' : 'text-primary'}
                  dark={dark}
                  pointeClassName="left-8"
                >
                  <BulleNiveau level={level} pct={pct} xp={xp} dark={dark} paliersOuverts={paliersOuverts} />
                </BulleHud>
              ) : null}
            </div>

            {/* LE MULTIPLICATEUR D'XP, dans SA case : ce qu'il vaut, et au
                toucher comment le faire monter. */}
            {nbAmis !== null ? (
              <>
                <span aria-hidden="true" className={s.filet} />
                <span ref={multiplicateurRef} className={s.mult}>
                  <MultiplicateurPill
                    nbAmis={nbAmis}
                    boostXpJusqua={boostXpJusqua}
                    open={openPurse === 'multiplicateur'}
                    onToggle={() => togglePurse('multiplicateur')}
                    dark={dark}
                  />
                </span>
              </>
            ) : null}

            {/* LES GEMMES : le solde ouvre sa bulle (à quoi elles servent), le
                « + » mène à la Boutique. */}
            {gems !== null ? (
              <>
                <span aria-hidden="true" className={s.filet} />
                <div ref={pursesRef} className={s.gemmes}>
                  <GemmesPill
                    value={gems}
                    open={openPurse === 'cristal'}
                    onToggle={() => togglePurse('cristal')}
                    dark={dark}
                  />
                </div>
              </>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <Link
            href="/"
            className={cn('pointer-events-auto font-heading rounded-full px-3 py-1.5 text-lg font-extrabold', pillSurface)}
          >
            Studuel
          </Link>
          {/* Le visiteur : « Se connecter », au bord droit. */}
          {accountHidden ? null : (
            <Link
              href={accountHref}
              aria-label="Se connecter"
              title="Se connecter"
              className={cn(
                'pointer-events-auto ml-auto flex size-11 shrink-0 items-center justify-center rounded-full transition active:scale-95',
                accountActive && 'ring-2 ring-highlight',
                dark ? 'text-[#faf6ef]' : 'text-foreground',
              )}
            >
              <LogIn className="size-6" strokeWidth={2.1} aria-hidden="true" />
            </Link>
          )}
        </>
      )}
    </header>
  )
}

/**
 * LE COMPTEUR QUI ENCAISSE — la moitié « arrivée » du geste de Clash Royale.
 *
 * Chaque jeton qui atterrit sur cette pastille crie son montant (un événement
 * de fenêtre, cf. lib/hud-gains) ; on l'ajoute au solde du serveur et la
 * pastille sursaute. Le solde ne saute donc pas d'un coup : il s'égrène au
 * rythme de la pluie, ce qui est TOUT l'effet — un compteur qui monte d'un
 * bloc ne se distingue pas d'un rechargement de page.
 *
 * ⚠️ POURQUOI UN ÉVÉNEMENT ET PAS UN ÉTAT REACT. Le vol est monté autour du
 * CONTENU de la page, ce bandeau à côté, dans le layout : le seul ancêtre
 * commun est la racine. Y faire remonter le compteur re-rendrait toute
 * l'application à chaque jeton — soit une douzaine de rendus complets par
 * récompense. Ici, seule la pastille concernée se re-rend.
 *
 * ⚠️ LE DELTA S'EFFACE QUAND LE SERVEUR PARLE. Le rafraîchissement qui suit la
 * volée rapporte un solde qui contient DÉJÀ ces jetons : garder le delta les
 * compterait deux fois. C'est aussi le filet de sécurité de tout l'édifice —
 * si l'optimisme et la base divergent pour une raison quelconque, la base
 * gagne, sans à-coup et sans que personne ait à s'en occuper.
 */
function useEncaissement(unite: UniteGain, valeurServeur: number | null) {
  // Le delta est stocké AVEC le solde serveur sur lequel il a été posé. C'est
  // ce couple qui permet de l'oublier par simple DÉRIVATION : dès que le
  // serveur renvoie un autre solde, celui-ci contient déjà les jetons, et le
  // delta cesse d'exister sans qu'aucun effet n'ait à le remettre à zéro.
  // (Un `useEffect` qui appellerait `setDelta(0)` déclencherait un rendu en
  // cascade à chaque rafraîchissement — et le lint du projet l'interdit.)
  const [encaisse, setEncaisse] = useState<{ base: number | null; delta: number }>(
    { base: valeurServeur, delta: 0 },
  )
  const ref = useRef<HTMLDivElement>(null)
  const delta = encaisse.base === valeurServeur ? encaisse.delta : 0

  useEffect(
    () =>
      ecouterGains((detail) => {
        if (detail.unite !== unite) return
        setEncaisse((prec) => ({
          base: valeurServeur,
          delta: (prec.base === valeurServeur ? prec.delta : 0) + detail.montant,
        }))

        const el = ref.current
        if (!el) return
        // Rejouer une animation CSS impose un reflow ENTRE le retrait et la
        // repose de la classe : sans lui le navigateur regroupe les deux
        // écritures, ne voit aucun changement, et ne rejoue rien.
        el.classList.remove('hud-encaisse')
        void el.getBoundingClientRect().width
        el.classList.add('hud-encaisse')
      }),
    [unite, valeurServeur],
  )

  return { delta, ref }
}

/**
 * LES GEMMES, au bout de la gélule : la gemme, le solde, le « + ». Deux gestes
 * distincts — c'est le partage de Brawl Stars :
 *   • le solde : un bouton qui déplie une bulle expliquant à quoi elles servent
 *     (un compteur qu'on ne comprend pas ne motive rien) ;
 *   • le « + » : le lien vers la Boutique, qui fait du compteur une PORTE.
 */
function GemmesPill({
  value,
  open,
  onToggle,
  dark,
}: {
  value: number
  open: boolean
  onToggle: () => void
  /** Scène sombre (salles de l'arène) : la bulle prend le verre de nuit. */
  dark: boolean
}) {
  const { delta, ref } = useEncaissement('gemme', value)
  // Le solde AFFICHÉ = celui du serveur + ce que les jetons ont déjà déposé.
  // Il redevient le solde du serveur seul dès que celui-ci se met à jour.
  const affiche = value + delta
  const nameClassName = dark ? 'text-[#c9b4ff]' : 'text-primary'

  return (
    <>
      <div ref={ref} data-hud-cible="gemme" className="flex items-center gap-[3px]">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls="bourse-gemmes"
          aria-label={`${affiche} gemmes — à quoi elles servent`}
          className={s.gemmesBouton}
        >
          <CristalIcon className={s.gemmesIcone} />
          <span className={s.gemmesChiffre}>{compteCourt(affiche)}</span>
        </button>
        <Link href="/tresor#gemmes" aria-label="Obtenir des gemmes" className={s.plus}>
          +
        </Link>
      </div>

      {open ? (
        <BulleHud
          id="bourse-gemmes"
          titre="Gemmes"
          titreClassName={nameClassName}
          dark={dark}
          pointeClassName="right-10"
          aDroite
        >
          {/* Deux phrases (Lucas, 03/10/2026 : « une bulle avec beaucoup trop
              de texte, et elle s'affiche à gauche »). */}
          <p>
            Elles ouvrent les fiches et les capsules. Elles se gagnent rarement&nbsp;: une dictée, un contrôle
            blanc ou une annale réussis.
          </p>
          <Link
            href="/tresor#gemmes"
            className={cn('font-heading mt-2 inline-flex min-h-11 items-center gap-1 text-xs font-extrabold', nameClassName)}
          >
            Obtenir des gemmes →
          </Link>
        </BulleHud>
      ) : null}
    </>
  )
}

/**
 * Ce que dit la bulle du niveau : où l'on en est en XP, et ce qu'il reste à
 * gagner. Une barre de 0 % n'est pas une panne : c'est un niveau tout juste
 * atteint, et la bulle le dit en chiffres.
 */
function BulleNiveau({
  level,
  pct,
  xp,
  dark,
  paliersOuverts,
}: {
  level: number
  pct: number
  xp: XpHud | null
  dark: boolean
  paliersOuverts: number[]
}) {
  const palier = prochainPalier(level)
  const piedPalier = (
    <>
      <p className="mt-1.5">
        Tout ce que tu travailles rapporte de l’XP&nbsp;: cours, quiz, révisions, dictées, jeux.
        Au niveau {palier}, un coffre de <strong>{gemmesPalier(palier)} gemmes</strong>.
      </p>
      <div className="mt-2">
        <CoffresPalier niveau={level} ouverts={paliersOuverts} />
      </div>
    </>
  )
  if (!xp || xp.prochain === null) {
    return (
      <>
        <p>{xp ? 'Tu as atteint le dernier niveau.' : `${pct} % du chemin vers le niveau ${level + 1}.`}</p>
        {piedPalier}
      </>
    )
  }
  const reste = Math.max(0, xp.prochain - xp.actuel)
  const fait = Math.max(0, xp.actuel - xp.plancher)
  const pas = Math.max(1, xp.prochain - xp.plancher)
  return (
    <>
      <p className="font-heading flex items-center gap-1 text-base font-extrabold">
        <XpIcon className="size-4" />
        <span className={dark ? 'text-[#faf6ef]' : 'hud-encre'}>
          Encore {reste.toLocaleString('fr-FR')} XP
        </span>
      </p>
      <p>pour passer au niveau {level + 1}.</p>
      <p className="mt-1.5 tabular-nums">
        {fait.toLocaleString('fr-FR')} / {pas.toLocaleString('fr-FR')} XP dans ce niveau
      </p>
      {piedPalier}
    </>
  )
}

/**
 * La bulle d'explication d'une pastille du bandeau (façon Brawl Stars) :
 * ancrée sous l'ÉCUSSON (l'ancêtre positionné), calée à son bord gauche pour
 * rester dans l'écran, la pointe sous la pastille qui l'a ouverte. Elle sort
 * du flux (absolute) pour ne jamais pousser la bande.
 */
function BulleHud({
  id,
  titre,
  titreClassName,
  dark,
  pointeClassName,
  aDroite = false,
  children,
}: {
  id: string
  titre: string
  titreClassName: string
  dark: boolean
  pointeClassName: string
  /** Calée au bord droit de l'écusson plutôt qu'au gauche. */
  aDroite?: boolean
  children: ReactNode
}) {
  return (
    <div
      id={id}
      className={cn(
        'absolute top-full z-10 mt-2 w-60 rounded-2xl p-3 text-left font-sans text-xs leading-relaxed shadow-xl',
        aDroite ? 'right-0' : 'left-0',
        dark
          ? 'olympe-glass olympe-glass--sculpte text-[#ece5f7]'
          : 'bg-card text-foreground/80 ring-1 ring-black/10 backdrop-blur-md',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'absolute -top-1 size-2.5 rotate-45 rounded-[2px]',
          pointeClassName,
          // La pointe doit être OPAQUE (elle sort du verre, donc du flou) et
          // reprendre le ton du HAUT de la bulle, où le voile clair de
          // `.olympe-glass` est le plus fort — d'où le violet éclairci.
          dark ? 'bg-[oklch(0.31_0.055_300)]' : 'bg-card',
        )}
      />
      <p className={cn('font-heading mb-1 text-sm font-extrabold', titreClassName)}>{titre}</p>
      {children}
    </div>
  )
}

/**
 * LE MULTIPLICATEUR D'XP, dans sa case entre la barre de niveau et la flamme :
 * « ⚡ ×1,3 », tout simple (Lucas, 24/09/2026, puis 13/10/2026 : « sa case à
 * gauche de la flamme »). Toute l'XP versée est multipliée par ce nombre —
 * +0,1 par ami (10 au plus), ×2 tant que la potion d'XP court (lib/ligue,
 * `multiplicateurXp` ; migration 380). Doré quand la potion court. Le tap
 * déplie la bulle : ce que c'est, et les deux façons de le faire monter.
 */
function MultiplicateurPill({
  nbAmis,
  boostXpJusqua,
  open,
  onToggle,
  dark,
}: {
  nbAmis: number
  boostXpJusqua: string | null
  open: boolean
  onToggle: () => void
  dark: boolean
}) {
  const potion = useBoostEnCours(boostXpJusqua)
  const amis = Math.min(AMIS_MAX, Math.max(0, nbAmis))
  const libelle = libelleMultiplicateur(multiplicateurXp(amis, potion))
  const libelleAmis = libelleMultiplicateur(multiplicateurXp(amis, false))
  const titreClassName = dark ? 'text-highlight' : 'text-primary'
  const lienClassName = cn('font-heading inline-flex min-h-11 items-center gap-1 text-xs font-extrabold', titreClassName)
  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="bourse-multiplicateur"
        aria-label={`Multiplicateur d’XP ${libelle} — à quoi il sert`}
        className={s.multBouton}
      >
        <span className={s.multCase} data-potion={potion ? '' : undefined}>
          <XpIcon className="size-4" />
          {libelle}
        </span>
      </button>
      {open ? (
        <BulleHud
          id="bourse-multiplicateur"
          titre={`Multiplicateur d’XP ${libelle}`}
          titreClassName={titreClassName}
          dark={dark}
          aDroite
          pointeClassName="right-4"
        >
          <p>Toute l’XP que tu gagnes est multipliée par ce nombre. Deux façons de le faire monter&nbsp;:</p>
          <ul className="mt-1.5 flex flex-col gap-1">
            <li>
              <strong>Tes amis</strong>&nbsp;: +0,1 par ami, jusqu’à ×2,0 à {AMIS_MAX}&nbsp;amis
              {amis > 0 ? ` (tu en as ${amis} : ${libelleAmis})` : ''}.
            </li>
            <li>
              <strong>La potion d’XP</strong>&nbsp;: elle double tout pendant 2&nbsp;h
              {potion ? ' — elle est active.' : '.'}
            </li>
          </ul>
          <div className="mt-1 flex flex-wrap gap-x-4">
            <Link href="/amis" className={lienClassName}>
              Ajouter un ami →
            </Link>
            <Link href="/tresor#marche" className={lienClassName}>
              Potion d’XP →
            </Link>
          </div>
        </BulleHud>
      ) : null}
    </>
  )
}

