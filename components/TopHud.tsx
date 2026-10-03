'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LogIn } from 'lucide-react'
import BadgeBoostXp, { useBoostEnCours } from '@/components/BadgeBoostXp'
import FlammeAnimee from '@/components/FlammeAnimee'
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
  isHudSerieMasquee,
} from '@/lib/top-hud-routes'
import PastilleQuetes from '@/components/quetes/PastilleQuetes'
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
  streak,
  level,
  levelTitle,
  progress,
  userLabel,
  boostXpJusqua = null,
  avatar = null,
  nbAmis = null,
  xp = null,
  paliersOuverts = [],
}: {
  /** Solde de gemmes, ou null pour un visiteur non connecté. */
  gems: number | null
  /**
   * Série en cours, en jours. `null` = inconnue (visiteur, ou base dont la
   * migration 155 n'est pas passée) : la flamme ne s'affiche pas du tout. Zéro,
   * lui, s'affiche — une flamme éteinte est une invitation, une flamme absente
   * n'est rien.
   */
  streak: number | null
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
  const { ref: refXp } = useEncaissement('xp', level)

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
  if (isHudHidden(pathname)) {
    return null
  }

  const accountHref = userLabel ? '/compte' : '/login'
  const accountActive = pathname === '/compte' || pathname.startsWith('/login')
  const connected = level !== null
  const pct = Math.round(progress * 100)
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

  // Le bandeau ne capte plus les taps : seules les pastilles sont cliquables,
  // le reste de la bande laisse passer vers le décor derrière.
  return (
    // Sur un mode de jeu, le bandeau s'efface dès qu'on défile et revient en
    // haut de page (`html.hud-replie`, posée par components/useHudAuDefilement).
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex h-14 items-center gap-2 px-3 transition-[transform,opacity] duration-200 ease-out motion-reduce:transition-none md:hidden [html.hud-replie_&]:-translate-y-full [html.hud-replie_&]:opacity-0">
      {connected ? (
        <>
          <FeteNiveau level={level} levelTitle={levelTitle} paliersOuverts={paliersOuverts} />
          {/* Niveau : écusson de jeu flottant — disque violet ciselé (dégradé,
              reflet haut + liseré or, façon médaillon d'arène en miniature),
              libellé violet marqué, et ruban doré de progression surmonté du
              pourcentage pour rendre l'avancée lisible d'un coup d'œil.
              `relative` : la bulle des cristaux s'ancre sur l'écusson entier,
              pour tenir dans l'écran depuis le bord gauche. */}
          {
            <div
              ref={refXp}
              // La cible du vol des récompenses (cf. lib/gains, UNITES).
              data-hud-cible="xp"
              className={cn(
                'pointer-events-auto relative flex min-w-0 flex-1 items-center gap-2 rounded-full py-1 pl-1',
                gems === null ? 'pr-3' : 'pr-0',
                pillSurface,
              )}
              title={levelTitle ?? undefined}
            >
              {/* L'AVATAR DANS LE DISQUE (Lucas, 24/09/2026 : « à la place du
                  7, place l'avatar, cela fait doublon » avec « NIVEAU 7 »). Le
                  disque garde sa bague d'or ; sans avatar connu, il reprend
                  le numéro de niveau. */}
              <span className="relative shrink-0">
                <span
                  className="font-heading relative flex size-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-primary to-[color-mix(in_oklch,var(--primary),black_24%)] text-sm font-extrabold text-primary-foreground tabular-nums ring-2 ring-highlight/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_5px_rgba(0,0,0,0.3)]"
                  aria-hidden="true"
                >
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatar.src}
                      alt=""
                      className={avatar.visage ? 'absolute max-w-none object-contain' : 'size-full'}
                      style={avatar.visage ? PORTRAIT_FACE_CROP : undefined}
                    />
                  ) : (
                    level
                  )}
                </span>
                {/* LE BOOST XP QUI COURT, en étiquette au pied du disque : collé
                    au niveau, parce que c'est l'XP qu'il double. Il vivait à
                    droite de « NIVEAU 7 » ; depuis que le multiplicateur prend le
                    bout de l'écusson, cette place ne tenait plus — le libellé
                    passait sur deux lignes et le badge mordait la flamme. */}
                <BadgeBoostXp
                  jusqua={boostXpJusqua}
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-1 text-[8px] whitespace-nowrap"
                />
              </span>
              {/* LE NIVEAU, COMME SUR LA MAQUETTE « D » (Lucas, 03/10/2026 :
                  « la barre de niveau était mieux sur la maquette, elle prenait
                  plus de place ; on ne voit pas l'éclair »). Une ligne
                  « Niveau 7 ⚡ ×1,3 » — l'éclair d'XP, puis le multiplicateur
                  qu'on touche pour savoir ce que c'est — et dessous la barre,
                  sur TOUTE la largeur que l'écusson laisse libre. */}
              <div ref={niveauRef} className="flex min-w-0 flex-1 flex-col gap-1 pr-1">
                <div
                  className={cn(
                    'font-heading flex items-center gap-1 text-[13px] leading-none font-extrabold whitespace-nowrap',
                    dark ? 'text-[#faf6ef]' : 'hud-encre',
                  )}
                >
                  {/* « Niveau 7 ⚡ » et la barre ouvrent la bulle du niveau :
                      ce qu'il reste à gagner (Lucas, 03/10/2026 : « si je
                      clique sur la barre d'XP, rien ne s'affiche »). */}
                  <button
                    type="button"
                    onClick={() => togglePurse('niveau')}
                    aria-expanded={openPurse === 'niveau'}
                    aria-controls="bourse-niveau"
                    className="pointer-events-auto -my-2 flex cursor-pointer items-center gap-1 py-2"
                  >
                    Niveau {level}
                    <XpIcon className="size-3.5" />
                  </button>
                  {nbAmis !== null ? (
                    <span ref={multiplicateurRef} className="pointer-events-auto flex shrink-0">
                      <MultiplicateurPill
                        nbAmis={nbAmis}
                        boostXpJusqua={boostXpJusqua}
                        open={openPurse === 'multiplicateur'}
                        onToggle={() => togglePurse('multiplicateur')}
                        dark={dark}
                      />
                    </span>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => togglePurse('niveau')}
                  aria-label={`Niveau ${level} : ce qu’il reste pour le niveau ${level + 1}`}
                  className="pointer-events-auto -my-1.5 block w-full cursor-pointer py-1.5"
                >
                  <span
                    className={cn(
                      'block h-1.5 w-full min-w-10 overflow-hidden rounded-full',
                      dark ? 'bg-black/35 ring-1 ring-white/15' : 'bg-card',
                    )}
                    role="progressbar"
                    aria-label={`Progression vers le niveau ${level + 1}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={pct}
                  >
                    <span
                      className={cn(
                        'block h-full rounded-full transition-[width] duration-500',
                        dark
                          ? 'bg-gradient-to-r from-highlight to-accent shadow-[0_0_6px_color-mix(in_oklch,var(--highlight),transparent_45%)]'
                          : 'bg-primary',
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </span>
                </button>
                {openPurse === 'niveau' ? (
                  <BulleHud
                    id="bourse-niveau"
                    titre={`Niveau ${level}${levelTitle ? ` · ${levelTitle}` : ''}`}
                    titreClassName={dark ? 'text-highlight' : 'text-primary'}
                    dark={dark}
                    pointeClassName="left-24"
                  >
                    <BulleNiveau level={level} pct={pct} xp={xp} dark={dark} paliersOuverts={paliersOuverts} />
                  </BulleHud>
                ) : null}
              </div>

              {/* LA SÉRIE, DANS LE BLOC NIVEAU. Elle avait sa propre pastille,
                  poussée contre le bord droit avec les monnaies. Deux
                  conséquences, l'une visible et l'autre mesurée :

                  · sur l'accueil Réviser, elle DOUBLAIT la carte de série
                    située 120 px plus bas — même fichier d'image, même gris
                    éteint à zéro, même nombre ;
                  · elle coûtait 68 px à une rangée d'objets `shrink-0`, donc
                    à la pastille de niveau, seule élastique du lot. Sur un
                    iPhone 14, celle-ci tombait à 74 px et son libellé
                    « NIVEAU 7 » à 10 px.

                  Niveau et série ne se contredisent pas — l'un dit le chemin
                  parcouru, l'autre la régularité — mais ce sont deux comptes du
                  MÊME élève : ils tiennent dans le même écusson, séparés d'un
                  filet. Le pourcentage a cédé la place : la barre le montre
                  déjà, et un nombre qui répète une barre n'apprend rien.

                  ⚠️ Sur l'arène (/defi), où la pastille de niveau se replie au
                  profit de la carte joueur du décor, la série retrouve sa
                  pastille séparée — sinon elle disparaîtrait de l'écran. */}
              {streak === null || isHudSerieMasquee(pathname) ? null : (
                <span
                  className={cn(
                    'flex shrink-0 items-center gap-1 self-stretch border-l pl-2.5',
                    dark ? 'border-white/15' : 'border-primary/15',
                  )}
                >
                  <FlammeAnimee className="size-7" eteinte={streak === 0} />
                  <span
                    aria-hidden="true"
                    className={cn(
                      'font-heading text-base font-extrabold tabular-nums',
                      streak > 0
                        ? dark
                          ? 'text-highlight'
                          : 'hud-encre'
                        : 'text-muted-foreground',
                    )}
                  >
                    {streak}
                  </span>
                  {/* Le nombre seul ne dit pas de quoi il est le compte : les
                      deux chiffres de l'écusson (niveau, série) se lisent à
                      l'œil par leurs dessins, à l'oreille par ce texte. */}
                  <span className="sr-only">
                    Série : {streak} jour{streak > 1 ? 's' : ''}
                  </span>
                </span>
              )}

              {/* LES CRISTAUX, DANS LE MÊME ÉCUSSON, juste après la flamme. Ils
              avaient leur pastille contre le bord droit : trois comptes du
              même élève dans deux objets, et un bord droit occupé. La bourse
              garde SA boîte (`pursesRef`) : c'est elle que surveille la
              fermeture au tap extérieur. */}
              {/* Les cristaux : la boîte surveillée par la fermeture au tap
                  extérieur (`pursesRef`). */}
              <div ref={pursesRef} className="flex shrink-0 items-center self-stretch">
                {gems !== null ? (
                  <div
                    className={cn(
                      'flex shrink-0 items-center self-stretch border-l',
                      dark ? 'border-white/15' : 'border-primary/15',
                    )}
                  >
                    <ResourcePill
                      unite="gemme"
                      name="Gemmes"
                      nameClassName={dark ? 'text-[#c9b4ff]' : 'text-primary'}
                      // Deux phrases (Lucas, 03/10/2026 : « une bulle avec
                      // beaucoup trop de texte, et elle s'affiche à gauche »).
                      description={<>Elles ouvrent les fiches et les capsules. Tu en gagnes avec les quêtes et tes amis.</>}
                      open={openPurse === 'cristal'}
                      onToggle={() => togglePurse('cristal')}
                      label={(n) => `${n} gemmes — à quoi elles servent`}
                      plusLabel="Obtenir des gemmes"
                      aDroite
                      pointeClassName="right-10"
                      value={gems}
                      icon={<CristalIcon className="size-5" />}
                      dark={dark}
                      className={dark ? 'text-[#d8c9ff]' : 'hud-encre'}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          }
        </>
      ) : (
        <Link
          href="/"
          className={cn(
            'pointer-events-auto font-heading rounded-full px-3 py-1.5 text-lg font-extrabold',
            pillSurface,
          )}
        >
          Studuel
        </Link>
      )}

      {/* Réglages du compte — pastille ronde flottante à l'extrême droite. Ce
          n'est PAS l'entrée « profil de jeu » (avatar, stats, badges) : celle-ci
          est la carte joueur en haut à gauche de l'arène. Pour lever la
          confusion des deux entrées jumelles, on montre ici les RÉGLAGES
          (/compte), pas une silhouette qui se lisait comme un second bouton
          profil. Visiteur non connecté → icône « entrer ».

          L'ENGRENAGE DESSINÉ REMPLACE L'ENGRENAGE LUCIDE (31/08/2026). C'est le
          dernier trait de contour de tout le bandeau : la flamme, les pièces,
          les gemmes et les cinq onglets du bas sont déjà des illustrations. Un
          pictogramme au trait posé au milieu d'eux se lisait comme un élément
          d'une autre application.

          L'ÉTAT ACTIF NE PEUT PLUS PASSER PAR LA COULEUR : une illustration
          porte la sienne. La barre d'onglets résout ça en désaturant les
          onglets inactifs — mais cette convention suppose un GROUPE dont un
          membre est toujours actif. Ce bouton-ci est SEUL, et on n'est presque
          jamais sur /compte : le reprendre tel quel afficherait l'illustration
          délavée en permanence, c'est-à-dire tout le temps sauf une fois. Elle
          garde donc ses pleines couleurs, et l'état actif se marque par un
          anneau — la même bague que porte déjà l'écusson de niveau. */}
      {/* LES QUÊTES DU JOUR (03/10/2026) : le parchemin et « 1/3 », au bord
          droit — sauf sur l'accueil Réviser (la puce de classe y tient le
          bord, les quêtes sont une carte en tête de page) et sur l'arène. */}
      {connected ? (
        <div className="ml-auto flex shrink-0 items-center">
          <PastilleQuetes dark={dark} />
        </div>
      ) : null}

      {accountHidden ? null : (
        <Link
          href={accountHref}
          aria-label={
            userLabel ? `Réglages du compte — ${userLabel}` : 'Se connecter'
          }
          title={userLabel ? 'Réglages du compte' : 'Se connecter'}
          className={cn(
            // PAS DE PASTILLE SOUS L'ILLUSTRATION (31/08/2026). Les deux autres
            // éléments du bandeau (niveau, monnaies) portent un fond de verre
            // parce qu'ils affichent du TEXTE, qui a besoin d'un socle pour
            // rester lisible sur n'importe quel décor. Le dessin, lui, porte son
            // propre contour marine : le disque crème ne le détachait pas, il
            // l'enfermait — on lisait un bouton posé sur un rond blanc, pas une
            // icône. Le rond parti, le dessin peut occuper toute la case.
            'pointer-events-auto flex size-11 shrink-0 items-center justify-center rounded-full transition active:scale-95',
            connected ? '' : 'ml-auto',
            // L'anneau d'écran courant, seule marque qui reste sans pastille.
            // Il ne paraît que sur /compte, donc jamais en même temps que le
            // disque qu'on vient d'enlever. Il marche pour les DEUX contenus —
            // le dessin comme le pictogramme du visiteur — là où une couleur de
            // texte ne pouvait rien sur une illustration.
            accountActive && 'ring-2 ring-highlight',
            // Ne sert plus qu'au pictogramme « entrer » du visiteur : une
            // illustration ne prend pas `currentColor`.
            dark ? 'text-[#faf6ef]' : 'text-foreground',
          )}
        >
          {userLabel ? (
            <Image
              src="/images/defi/icones/reglages-v3.webp"
              alt=""
              aria-hidden="true"
              // 80 = deux fois la case servie (size-10 = 40 px), de quoi rester
              // net sur les écrans à densité double.
              width={80}
              height={80}
              // 40 px de dessin dans 44 px de zone tactile : l'illustration
              // remplit la case (elle en occupait 32 sur 40 tant qu'il fallait
              // laisser voir la pastille), et le lien garde les 44 px qui font
              // la cible minimale au doigt.
              className="size-10 select-none object-contain"
            />
          ) : (
            // Le visiteur garde un pictogramme : « entrer » n'a pas
            // d'illustration, et en inventer une pour ce seul cas ferait un
            // dessin orphelin dans tout le jeu d'icônes.
            <LogIn className="size-6" strokeWidth={2.1} aria-hidden="true" />
          )}
        </Link>
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
 * Une pastille de ressource de la bande du haut. Elle porte DEUX gestes
 * distincts, et c'est voulu — c'est le partage de Brawl Stars :
 *   • à GAUCHE (picto + solde) : un bouton qui déplie une bulle expliquant à
 *     quoi sert la monnaie. Un compteur qu'on ne comprend pas ne motive rien.
 *   • à DROITE (le « + ») : le lien vers la boutique. Il transforme un
 *     compteur passif en PORTE.
 */
function ResourcePill({
  unite,
  name,
  nameClassName,
  description,
  open,
  onToggle,
  label,
  plusLabel,
  value,
  icon,
  dark,
  className,
  pointeClassName = 'right-6',
  aDroite = false,
}: {
  /** L'unité que cette pastille compte — c'est elle qui reçoit les jetons. */
  unite: UniteGain
  /** Le nom de la monnaie, écrit dans SA couleur en tête de la bulle. */
  name: string
  nameClassName: string
  description: ReactNode
  open: boolean
  onToggle: () => void
  /** Construit le libellé à partir du solde AFFICHÉ (jetons compris). */
  label: (affiche: number) => string
  plusLabel: string
  value: number
  icon: ReactNode
  /** Scène sombre (arène) : la bulle prend le verre de nuit. */
  dark: boolean
  /** Robe de la pastille (verre de nuit sur l'arène, crème ailleurs). */
  className: string
  /** Où tombe la pointe de la bulle, depuis le bord droit de l'écusson. */
  pointeClassName?: string
  /** La bulle se cale au bord DROIT de l'écusson, sous la pastille. */
  aDroite?: boolean
}) {
  const panelId = `bourse-${name.toLowerCase()}`
  const { delta, ref } = useEncaissement(unite, value)
  // Le solde AFFICHÉ = celui du serveur + ce que les jetons ont déjà déposé.
  // Il redevient le solde du serveur seul dès que celui-ci se met à jour.
  const affiche = value + delta

  return (
    <div className="pointer-events-auto shrink-0">
      <div
        ref={ref}
        // La cible du vol des récompenses (cf. lib/gains, UNITES).
        data-hud-cible={unite}
        className={cn(
          'font-heading flex min-h-11 items-center rounded-full text-base font-extrabold tabular-nums',
          className,
        )}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={label(affiche)}
          className="flex min-h-11 items-center gap-1.5 rounded-full py-1.5 pr-3.5 pl-3 transition active:scale-95"
        >
          {icon}
          {compteCourt(affiche)}
        </button>
      </div>

      {open ? (
        <BulleHud
          id={panelId}
          titre={name}
          titreClassName={nameClassName}
          dark={dark}
          pointeClassName={pointeClassName}
          aDroite={aDroite}
        >
          <p>{description}</p>
          {/* LE CHEMIN VERS LA BOUTIQUE, en toutes lettres.
              Il était porté par un petit disque « + » collé au compteur : le
              dernier pictogramme de trait du bandeau, et un second objet dans
              une pastille qui n'a qu'une chose à dire — un nombre. Descendu
              ici, il est nommé au lieu d'être deviné, et le compteur redevient
              un compteur. Un tap de plus, pour une action qui n'est pas
              quotidienne. */}
          <Link
            href="/tresor#gemmes"
            className={cn(
              'font-heading mt-2 inline-flex min-h-11 items-center gap-1 text-xs font-extrabold',
              nameClassName,
            )}
          >
            {plusLabel} →
          </Link>
        </BulleHud>
      ) : null}
    </div>
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
        Chaque niveau : <strong>+15 gemmes</strong>. Au niveau {palier}, un coffre de{' '}
        <strong>{gemmesPalier(palier)} gemmes</strong>.
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
 * LE MULTIPLICATEUR D'XP, contre la barre de niveau : « ×1,3 », tout simple
 * (Lucas, 24/09/2026). Toute l'XP versée est multipliée par ce nombre — +0,1
 * par ami (10 au plus), ×2 tant que la potion d'XP court (lib/ligue,
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
        // Petit à l'œil, large au doigt : les marges négatives agrandissent
        // la zone de tap sans pousser la barre.
        className="-my-2 flex cursor-pointer items-center py-2 pl-0.5 transition active:scale-95"
      >
        <span
          className={cn(
            'font-heading rounded-full px-1.5 py-0.5 text-[12px] leading-none font-extrabold tabular-nums',
            potion
              ? 'bg-highlight text-foreground'
              : dark
                ? 'bg-white/15 text-[#faf6ef]'
                : 'px-0 text-primary',
          )}
        >
          {libelle}
        </span>
      </button>
      {open ? (
        <BulleHud
          id="bourse-multiplicateur"
          titre={`Multiplicateur d’XP ${libelle}`}
          titreClassName={titreClassName}
          dark={dark}
          // Sous la pastille : disque 36 + marges + barre 52 + la moitié d'elle.
          pointeClassName="left-[7.5rem]"
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

