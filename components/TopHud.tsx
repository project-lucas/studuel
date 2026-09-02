'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LogIn } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { CristalIcon, EcuIcon } from '@/components/ui/MonnaieIcon'
import type { UniteGain } from '@/lib/gains'
import { GEM_COST_CHAPTER } from '@/lib/gems'
import { ecouterGains } from '@/lib/hud-gains'
import {
  isHudAccountHidden,
  isHudHidden,
  isHudLevelHidden,
  isHudOverDarkScene,
} from '@/lib/top-hud-routes'
import { cn } from '@/lib/utils'

/** Quelle bulle de monnaie est ouverte, s'il y en a une. */
type OpenPurse = 'ecu' | 'cristal' | null

/**
 * Le bandeau du haut, façon Clash Royale : les infos de jeu que l'élève garde
 * sous les yeux partout — son niveau, ses DEUX monnaies (pièces et gemmes,
 * chacune avec son « + » vers l'endroit où elle se gagne) et l'accès au profil —
 * FLOTTENT au-dessus du fond d'écran de chaque interface. Plus de barre pleine
 * largeur opaque : chaque info est une pastille translucide (backdrop-blur +
 * ombre) posée sur le décor, si bien qu'on voit le fond de l'arène / de l'onglet
 * derrière. Mobile uniquement (`md:hidden`) : sur desktop la sidebar porte déjà
 * l'identité. Les valeurs viennent du serveur (TopHudLoader) ; ce composant ne
 * fait que l'affichage + le masquage sur le parcours d'accueil plein écran.
 */
export default function TopHud({
  coins,
  gems,
  streak,
  level,
  levelTitle,
  progress,
  userLabel,
}: {
  /** Solde de pièces, ou null pour un visiteur non connecté. */
  coins: number | null
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
      if (!pursesRef.current?.contains(event.target as Node)) closePurse()
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
  const connected = coins !== null && level !== null
  const pct = Math.round(progress * 100)
  // Sur l'arène, le niveau est porté par le ProfileChip du HUD : la pastille
  // du bandeau se replie pour ne pas afficher le niveau en double.
  const levelHidden = isHudLevelHidden(pathname)
  // Scène sombre (arène) : les pastilles prennent le verre de nuit du HUD de
  // jeu au lieu du crème des onglets clairs. Un seul matériau par écran.
  const dark = isHudOverDarkScene(pathname)
  // L'engrenage a quitté le bandeau : pour un élève connecté, les réglages ne
  // vivent plus qu'à UN endroit, la carte de profil de l'onglet Moi. Le
  // visiteur, lui, garde la case — chez lui ce n'est pas un engrenage mais un
  // « Se connecter ». Voir lib/top-hud-routes.
  const accountHidden = isHudAccountHidden(pathname, connected)
  // Le fond commun des pastilles : verre de nuit sur l'arène, carte crème
  // ailleurs. Écrit une fois, appliqué aux trois pastilles du bandeau.
  const pillSurface = dark
    ? 'olympe-glass'
    : 'bg-card/85 ring-1 ring-black/5 shadow-lg backdrop-blur-md'

  // Le bandeau ne capte plus les taps : seules les pastilles sont cliquables,
  // le reste de la bande laisse passer vers le décor derrière.
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex h-14 items-center gap-2 px-3 md:hidden">
      {connected ? (
        <>
          {/* Niveau : écusson de jeu flottant — disque violet ciselé (dégradé,
              reflet haut + liseré or, façon médaillon d'arène en miniature),
              libellé violet marqué, et ruban doré de progression surmonté du
              pourcentage pour rendre l'avancée lisible d'un coup d'œil.
              Replié sur /defi (le ProfileChip de l'arène est LA source). */}
          {levelHidden ? null : (
            <div
              ref={refXp}
              // La cible du vol des récompenses (cf. lib/gains, UNITES).
              data-hud-cible="xp"
              className={cn(
                'pointer-events-auto flex min-w-0 items-center gap-2.5 rounded-full py-1 pr-3 pl-1',
                pillSurface,
              )}
              title={levelTitle ?? undefined}
            >
              <span
                className="font-heading flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-primary to-[color-mix(in_oklch,var(--primary),black_24%)] text-sm font-extrabold text-primary-foreground tabular-nums ring-2 ring-highlight/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_5px_rgba(0,0,0,0.3)]"
                aria-hidden="true"
              >
                {level}
              </span>
              <div className="min-w-0">
                <p
                  className={cn(
                    'font-heading text-[10px] leading-none font-extrabold tracking-wide uppercase',
                    dark ? 'text-[#faf6ef]' : 'text-primary',
                  )}
                >
                  Niveau {level}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <div
                    className={cn(
                      'h-2 w-16 overflow-hidden rounded-full',
                      dark
                        ? 'bg-black/35 ring-1 ring-white/15'
                        : 'bg-muted ring-1 ring-black/[0.06]',
                    )}
                    role="progressbar"
                    aria-label={`Progression vers le niveau ${level + 1}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={pct}
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-highlight to-accent shadow-[0_0_6px_color-mix(in_oklch,var(--highlight),transparent_45%)] transition-[width] duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
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
              {streak === null ? null : (
                <span
                  className={cn(
                    'flex shrink-0 items-center gap-1 self-stretch border-l pl-2.5',
                    dark ? 'border-white/15' : 'border-black/[0.07]',
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/serie/flamme.webp"
                    alt=""
                    aria-hidden="true"
                    width={128}
                    height={128}
                    className={cn(
                      'size-7 shrink-0 object-contain',
                      streak > 0 ? 'flame-breathe' : 'opacity-40 grayscale',
                    )}
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      'font-mono text-sm font-extrabold tabular-nums',
                      streak > 0
                        ? dark
                          ? 'text-highlight'
                          : 'text-foreground'
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
            </div>
          )}

          {/* LE GROUPE DE DROITE : la série, puis les deux monnaies. Tout ce
              qui se COMPTE tient ensemble, poussé contre le bord ; la gauche du
              bandeau reste au niveau (et, sur l'arène où le niveau se replie,
              à la carte joueur du décor).

              La série y était d'abord posée à gauche, juste après le niveau —
              elle se superposait à la carte joueur de l'arène, qui occupe cet
              angle et que le bandeau ne connaît pas. Un bandeau flottant ne
              doit rien déposer là où le décor de la page a déjà quelque chose. */}
          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            {/* LA SÉRIE, partout. C'est le geste de Duolingo : la flamme est en
                haut de CHAQUE écran, pas rangée dans l'onglet qui la calcule.
                Une série qu'on ne voit qu'en allant la chercher ne retient
                personne — il faut qu'elle croise le regard sur l'arène, dans la
                boutique, chez les amis. Série à zéro = flamme éteinte
                (désaturée) et non absente : la place reste, à rallumer.

                ELLE N'A PLUS SA PASTILLE QUE SUR L'ARÈNE. Ailleurs, elle est
                passée DANS l'écusson de niveau (plus haut) : deux comptes du
                même élève, un seul objet. Ici, sur /defi, l'écusson se replie au
                profit de la carte joueur du décor — la série y retrouve donc sa
                pastille, sans quoi elle quitterait l'écran. Une seule flamme à
                l'écran dans les deux cas. */}
            {!levelHidden || streak === null ? null : (
              <div
                className={cn(
                  'pointer-events-auto flex h-11 shrink-0 items-center gap-1 rounded-full pr-3 pl-1.5',
                  pillSurface,
                )}
                aria-label={`Série : ${streak} jour${streak > 1 ? 's' : ''}`}
                title={`${streak} jour${streak > 1 ? 's' : ''} de série`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/serie/flamme.webp"
                  alt=""
                  aria-hidden="true"
                  width={128}
                  height={128}
                  className={cn(
                    'size-8 shrink-0 object-contain',
                    streak > 0 ? 'flame-breathe' : 'opacity-40 grayscale',
                  )}
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    'font-mono text-sm font-extrabold tabular-nums',
                    streak > 0
                      ? dark
                        ? 'text-highlight'
                        : 'text-foreground'
                      : 'text-muted-foreground',
                  )}
                >
                  {streak}
                </span>
              </div>
            )}

            {/* LA BANDE DE RESSOURCES, façon Clash Royale : les soldes ne sont
              pas rangés dans une boutique qu'on pense à ouvrir, ils sont sous
              les yeux en permanence. Chaque pastille porte DEUX gestes, comme
              chez Supercell :
                • le solde (à gauche) OUVRE une bulle qui explique la monnaie —
                  un chiffre seul ne dit jamais à quoi il sert ;
                • le « + » (à droite) MÈNE À LA BOUTIQUE, pour les deux monnaies.

              Sur crème, l'écu illustré est doré et ressort du fond clair ; sur
              la scène sombre, la pastille prend le verre de nuit et c'est le
              CHIFFRE qui devient or — l'or dit la valeur, pas le contenant. */}
            {/* La bande des monnaies garde SA propre boîte : c'est elle que
              surveille la fermeture au tap extérieur (`pursesRef`). La flamme
              n'en fait pas partie — elle n'ouvre aucune bulle. */}
            <div ref={pursesRef} className="flex shrink-0 items-center gap-1.5">
              <ResourcePill
                unite="ecu"
                name="Écu"
                nameClassName={
                  dark
                    ? 'text-highlight'
                    : // Sur crème, le jaune solaire pur passerait sous le seuil de
                      // contraste : on le fonce pour le TEXTE seulement — c'est le
                      // même or, lisible.
                      'text-[color-mix(in_oklch,var(--highlight),black_42%)]'
                }
                description={
                  <>
                    La monnaie du style. Tu la gagnes en révisant et en jouant,
                    et tu la dépenses dans la Boutique : tenues, décors et
                    objets pour ton avatar.
                  </>
                }
                open={openPurse === 'ecu'}
                onToggle={() => togglePurse('ecu')}
                label={(n) => `${n} écus — à quoi sert cette monnaie`}
                plusLabel="Obtenir des écus"
                value={coins}
                icon={<EcuIcon className="size-5" />}
                dark={dark}
                className={
                  dark
                    ? 'olympe-glass olympe-glass--sculpte text-highlight'
                    : 'bg-card/90 text-foreground shadow-lg ring-1 ring-black/10 backdrop-blur-md'
                }
              />
              {/* LA MONNAIE QUI CÈDE. Le bandeau ne peut pas tenir, sur un
                téléphone, l'écusson de niveau + la série + DEUX monnaies + les
                réglages : à 390 px on demande environ 100 px de trop. Il faut
                donc que quelque chose s'efface, et c'est le cristal — c'est la
                monnaie secondaire, et elle reste à un tap de là (le « + » de
                l'écu et l'onglet Boutique mènent au même endroit). Le seuil
                (430 px) couvre les téléphones courants ; au-delà, les deux
                monnaies reviennent. */}
              {gems !== null ? (
                <ResourcePill
                  unite="gemme"
                  name="Cristal"
                  nameClassName={dark ? 'text-[#c9b4ff]' : 'text-primary'}
                  description={
                    <>
                      La monnaie du contenu. {GEM_COST_CHAPTER} cristaux ouvrent
                      un chapitre entier — sa carte mentale et ses fiches — pour
                      toujours. Ils se gagnent surtout en invitant tes amis.
                    </>
                  }
                  open={openPurse === 'cristal'}
                  onToggle={() => togglePurse('cristal')}
                  label={(n) => `${n} cristaux — à quoi sert cette monnaie`}
                  plusLabel="Obtenir des cristaux"
                  value={gems}
                  icon={<CristalIcon className="size-5" />}
                  dark={dark}
                  className={cn(
                    'max-[429px]:hidden',
                    dark
                      ? 'olympe-glass text-[#d8c9ff]'
                      : 'bg-card/85 text-primary shadow-lg ring-1 ring-black/5 backdrop-blur-md',
                  )}
                />
              ) : null}
            </div>
          </div>
        </>
      ) : (
        <Link
          href="/"
          className={cn(
            'pointer-events-auto font-heading rounded-full px-3 py-1.5 text-lg font-bold',
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
              src="/images/defi/icones/reglages-v2.webp"
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
}) {
  const panelId = `bourse-${name.toLowerCase()}`
  const { delta, ref } = useEncaissement(unite, value)
  // Le solde AFFICHÉ = celui du serveur + ce que les jetons ont déjà déposé.
  // Il redevient le solde du serveur seul dès que celui-ci se met à jour.
  const affiche = value + delta

  return (
    <div className="pointer-events-auto relative shrink-0">
      <div
        ref={ref}
        // La cible du vol des récompenses (cf. lib/gains, UNITES).
        data-hud-cible={unite}
        className={cn(
          'flex min-h-11 items-center rounded-full font-mono text-sm font-extrabold tabular-nums',
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
          {affiche.toLocaleString('fr-FR')}
        </button>
      </div>

      {/* La bulle : ancrée sous la pastille, avec sa pointe. Elle sort du flux
          (absolute) pour ne jamais pousser la bande de ressources. */}
      {open ? (
        <div
          id={panelId}
          className={cn(
            'absolute top-full right-0 z-10 mt-2 w-60 rounded-2xl p-3 text-left font-sans text-xs leading-relaxed shadow-xl',
            dark
              ? 'olympe-glass olympe-glass--sculpte text-[#ece5f7]'
              : 'bg-card text-foreground/80 ring-1 ring-black/10 backdrop-blur-md',
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              'absolute -top-1 right-6 size-2.5 rotate-45 rounded-[2px]',
              // La pointe doit être OPAQUE (elle sort du verre, donc du flou) et
              // reprendre le ton du HAUT de la bulle, où le voile clair de
              // `.olympe-glass` est le plus fort — d'où le violet éclairci.
              dark ? 'bg-[oklch(0.31_0.055_300)]' : 'bg-card',
            )}
          />
          <p
            className={cn(
              'font-heading mb-1 text-sm font-extrabold',
              nameClassName,
            )}
          >
            {name}
          </p>
          <p>{description}</p>
          {/* LE CHEMIN VERS LA BOUTIQUE, en toutes lettres.
              Il était porté par un petit disque « + » collé au compteur : le
              dernier pictogramme de trait du bandeau, et un second objet dans
              une pastille qui n'a qu'une chose à dire — un nombre. Descendu
              ici, il est nommé au lieu d'être deviné, et le compteur redevient
              un compteur. Un tap de plus, pour une action qui n'est pas
              quotidienne. */}
          <Link
            href="/tresor?volet=boutique"
            className={cn(
              'font-heading mt-2 inline-flex min-h-11 items-center gap-1 text-xs font-extrabold',
              nameClassName,
            )}
          >
            {plusLabel} →
          </Link>
        </div>
      ) : null}
    </div>
  )
}
