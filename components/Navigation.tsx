'use client'

import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { CircleUser } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { NAV_TABS, type NavIconName } from '@/lib/nav-tabs'
import amisIcone from '@/public/images/nav/amis.webp'
import reviserIcone from '@/public/images/nav/reviser.webp'
import marcelIcone from '@/public/images/nav/marcel.webp'
import defiIcone from '@/public/images/nav/defi.webp'
import moiIcone from '@/public/images/nav/moi.webp'
import tresorIcone from '@/public/images/nav/tresor.webp'
import cadreAvatar from '@/public/images/nav/cadre-avatar.webp'

// Ordre des onglets = ordre de la barre mobile (Défi au centre) et ordre du
// balayage horizontal : les deux lisent NAV_TABS.
const links = NAV_TABS

/**
 * Chaque onglet porte son ILLUSTRATION, du même atelier que l'écu et le cristal
 * du HUD : objet peint, contour marine épais, palette violet et or. Le fichier
 * prend le nom de l'onglet — `lib/nav-tabs.test.ts` verrouille cette égalité,
 * parce que le dossier a déjà porté deux dessins sans rapport sous des noms
 * voisins et que la confusion était garantie.
 *
 * Le lot d'août 2026 nomme chaque onglet par son ENJEU plutôt que par son
 * contenu, et c'est ce qui le rend lisible sans libellé : le trophée dit le
 * classement (et non « deux silhouettes = des amis »), les épées croisées disent
 * l'affrontement (et non « le centre de l'app »), la bourse dit ce qu'on y
 * dépense (et non « un coffre à ouvrir »). Restent le livre de Réviser et le
 * visage de Marcel, qui étaient déjà justes.
 *
 * LES DESSINS SONT IMPORTÉS, PAS DÉSIGNÉS PAR LEUR CHEMIN — et ce n'est pas un
 * détail de style. Un chemin littéral (`/images/nav/amis.webp`) est une URL
 * STABLE : quand on remplace le fichier par un nouveau dessin, l'URL ne bouge
 * pas, et l'optimiseur d'images de Next comme le cache du navigateur continuent
 * de servir l'ANCIEN. On croit alors que l'intégration n'a rien changé. L'import
 * statique donne une URL à empreinte de contenu
 * (`/_next/static/media/amis.<hash>.webp`) : nouveau dessin, nouvelle URL, aucun
 * cache à vider — ni ici, ni chez les élèves qui ont déjà ouvert l'app.
 *
 * Les fichiers restent dans `public/images/nav/` : c'est la convention du dépôt,
 * c'est ce que `scripts/nav-icones.mjs` produit, et c'est ce que le test
 * d'existence de `lib/nav-tabs.test.ts` va vérifier.
 */
const ICONES: Record<NavIconName, StaticImageData> = {
  amis: amisIcone,
  reviser: reviserIcone,
  marcel: marcelIcone,
  defi: defiIcone,
  moi: moiIcone,
  tresor: tresorIcone,
}

/** L'onglet dont le dessin est remplacé par le vrai avatar de l'élève. */
const AVATAR_ICON: NavIconName = 'moi'

/**
 * La couronne de laurier qui entoure l'avatar. Elle n'est pas un décor gratuit :
 * c'est le seul onglet dont le contenu change d'un élève à l'autre, et sans elle
 * un visage nu posé au milieu de cinq objets peints ne fait pas partie de la
 * même famille. Le cadre lui rend le contour marine épais et l'or que les autres
 * portent déjà.
 *
 * Il est fabriqué par `scripts/nav-icones.mjs`, qui l'ÉVIDE (son disque
 * intérieur arrive peint en blanc opaque) et le recentre sur son trou — la
 * couronne pèse plus lourd en bas, son trou n'est donc pas au centre du dessin.
 * Grâce à ce recentrage, le CSS n'a qu'un disque à poser dessous, sans décalage.
 */
const CADRE_AVATAR = cadreAvatar

export default function Navigation({
  userLabel,
  // Pastille d'appel du Coffre (façon Clash Royale), rendue côté SERVEUR par le
  // layout sous <Suspense> : la barre s'affiche tout de suite, la pastille se
  // pose quand la réponse arrive. `null` quand il n'y a rien à récupérer.
  chestBadge = null,
  // Avatar de l'élève pour l'onglet Moi, streamé par le layout selon la même
  // discipline. `null` (déconnecté, panne, ou réponse pas encore arrivée) :
  // on retombe sur le buste dessiné, qui est de la même famille que les cinq
  // autres icônes — le repli ne se remarque pas.
  avatarSlot = null,
}: {
  userLabel: string | null
  chestBadge?: ReactNode
  avatarSlot?: ReactNode
}) {
  const pathname = usePathname()

  // Parcours d'accueil plein écran (façon Duolingo) : aucune barre de nav.
  if (pathname === '/bienvenue' || pathname.startsWith('/bienvenue/')) return null

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`)

  // Halo violet unique qui « voyage » vers l'onglet actif (barre mobile) : sa
  // position horizontale se dérive de l'index actif, le CSS anime le glissement.
  const activeIndex = links.findIndex(({ path }) => isActive(path))

  const accountHref = userLabel ? '/compte' : '/login'
  const accountActive = isActive('/compte') || isActive('/login')

  return (
    <>
      {/* La barre du haut sur mobile (pièces + niveau + compte) est portée par
          TopHud (bandeau de jeu, toujours visible), rendu par le layout. */}

      {/* Barre d'onglets fixée en bas — modèle Clash Royale : tous les onglets
          sont de simples icônes sur le socle crème, SEUL l'onglet sélectionné
          porte une plaque violette et affiche son mot. Plus d'orbe central : le
          Défi est un onglet comme les autres, c'est la sélection qui parle. */}
      <nav className="tab-bar fixed inset-x-0 bottom-0 z-50 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        {/* `overflow-hidden` = garde-fou : la plaque ne peut pas déborder
            au-dessus du liseré doré de la barre. */}
        <ul className="relative flex h-14 items-stretch overflow-hidden">
          {/* Plaque violette qui suit l'onglet actif — elle GLISSE d'un onglet
              à l'autre (une seule plaque animée, pas six fondus). Elle occupe la
              cellule entière ; le retrait visuel est dessiné par ::before. */}
          {activeIndex >= 0 && (
            <span
              aria-hidden="true"
              className="tab-plate"
              style={{
                left: `${(activeIndex / links.length) * 100}%`,
                width: `${100 / links.length}%`,
              }}
            />
          )}
          {links.map(({ name, path, icon }) => {
            const active = isActive(path)
            // Le layout confie l'onglet Moi à son chargeur d'avatar. Celui-ci
            // rend TOUJOURS quelque chose (l'avatar, ou le buste dessiné en
            // repli) : la barre n'a donc aucun repli à gérer ici, et ne prend
            // le dessin par défaut que si le slot n'est pas fourni du tout —
            // hors du layout, dans un test, un récit d'histoire.
            const slot = icon === AVATAR_ICON ? avatarSlot : null

            return (
              <li key={path} className="relative z-10 flex-1">
                <Link
                  href={path}
                  onClick={() => sfx.tap()}
                  aria-label={name}
                  aria-current={active ? 'page' : undefined}
                  data-tour={`tab-${path.slice(1)}`}
                  className="flex h-full flex-col items-center justify-center transition-transform active:scale-95"
                >
                  {/* Boîte au plus juste autour du dessin : la pastille du
                      coffre se cale sur le COIN de l'icône, pas sur la zone
                      tactile. */}
                  <span className="relative flex">
                    <span
                      className={cn(
                        // `relative` : cette case est le repère de la couronne
                        // de laurier, qui se pose PAR-DESSUS l'avatar.
                        'relative',
                        // Centrage par le conteneur, et pas par une marge sur
                        // l'enfant : l'avatar n'occupe que 58 % de sa case (le
                        // diamètre du trou de la couronne) et un `margin: auto`
                        // ne centre pas verticalement un bloc — il restait
                        // collé en haut.
                        // 40 px : la place rendue par le libellé est partie
                        // ici. C'est la taille maximale qui tienne dans la
                        // barre une fois l'onglet actif agrandi — 40 × 1,2 = 48
                        // dans 56 px de haut, soit 4 px d'air de chaque côté.
                        // Au-delà, `overflow-hidden` raboterait le dessin.
                        'flex size-10 items-center justify-center transition-transform duration-200',
                        active
                          ? // L'agrandissement, c'est LE signal de sélection :
                            // l'icône enfle d'un cinquième sur sa plaque. Elle
                            // est aussi la seule à porter ses pleines couleurs.
                            // Le facteur a baissé (1,25 → 1,2) en même temps
                            // que la taille de repos montait : c'est l'écart
                            // ABSOLU entre les deux états qui se voit, et il
                            // est resté le même.
                            'scale-[1.2]'
                          : // Les illustrations portent leurs propres couleurs :
                            // pour que l'onglet actif ressorte, ce sont les
                            // AUTRES qui reculent — désaturées et atténuées,
                            // façon Clash Royale. Le contour marine épais des
                            // dessins tient largement le 3:1 même à 70 %.
                            'opacity-70 saturate-[0.55]',
                      )}
                    >
                      {icon === AVATAR_ICON ? (
                        <>
                          {/* Le visage — l'avatar streamé par le layout, ou le
                              buste dessiné en repli — rogné en disque à la
                              taille du trou de la couronne. */}
                          <span className="nav-cadre-disque">
                            {slot ?? (
                              <Image
                                src={ICONES[icon]}
                                alt=""
                                aria-hidden="true"
                                width={80}
                                height={80}
                                priority
                                className="size-full object-contain"
                              />
                            )}
                          </span>
                          <Image
                            src={CADRE_AVATAR}
                            alt=""
                            aria-hidden="true"
                            width={80}
                            height={80}
                            priority
                            className="nav-cadre-bague"
                          />
                        </>
                      ) : (
                        <Image
                          src={ICONES[icon]}
                          alt=""
                          aria-hidden="true"
                          // 80 = deux fois la case servie ; Next en tire aussi
                          // un 160 pour les écrans à densité triple.
                          width={80}
                          height={80}
                          // La barre est le premier chrome visible de l'app :
                          // ces six vignettes ne doivent pas arriver en retard.
                          priority
                          className="size-full object-contain"
                        />
                      )}
                    </span>
                    {icon === 'tresor' ? chestBadge : null}
                  </span>
                  {/* PAS de mot sous l'icône. Le dessin doit se suffire — c'est
                      tout l'intérêt d'être passé du trait à l'illustration, et
                      la place rendue par le libellé part dans la taille du
                      dessin. La sélection reste dite par la plaque violette et
                      par l'agrandissement, deux signaux qui ne sont pas du
                      texte.

                      L'accessibilité ne perd rien : l'`aria-label` du lien
                      porte le nom de l'onglet et `aria-current` sa sélection.
                      Un lecteur d'écran annonce donc exactement ce qu'il
                      annonçait avec le mot affiché. */}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Desktop : sidebar sticky */}
      <nav className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-8 border-r bg-card p-5 md:flex">
        <Link href="/" className="font-heading px-3 text-2xl font-bold">
          Studuel
        </Link>

        <ul className="flex flex-col gap-1">
          {links.map(({ name, path, icon, center }) => {
            const active = isActive(path)

            return (
              <li key={path}>
                <Link
                  href={path}
                  onClick={() => sfx.tap()}
                  aria-current={active ? 'page' : undefined}
                  data-tour={`tab-${path.slice(1)}`}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-foreground/70 hover:bg-accent hover:text-accent-foreground',
                    center && !active && 'font-bold text-primary',
                  )}
                >
                  {/* Ici la pastille active est un aplat violet PLEIN, et les
                      illustrations gardent leurs couleurs : le livre violet de
                      Réviser s'y noierait. D'où le disque clair glissé dessous,
                      qui rend à chaque dessin le fond crème pour lequel il a
                      été peint. L'avatar de l'élève, lui, reste sur la barre
                      mobile : la sidebar affiche déjà les mots, personne n'y
                      confond Marcel et Moi. */}
                  <span
                    className={cn(
                      'flex size-6 shrink-0 items-center justify-center rounded-full transition-colors',
                      active && 'bg-primary-foreground',
                    )}
                  >
                    <Image
                      src={ICONES[icon]}
                      alt=""
                      aria-hidden="true"
                      width={48}
                      height={48}
                      className="size-5 object-contain"
                    />
                  </span>
                  {name}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Compte, en bas de la sidebar */}
        <div className="mt-auto border-t pt-4">
          <Link
            href={accountHref}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              accountActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-foreground/70 hover:bg-accent hover:text-accent-foreground',
            )}
          >
            <CircleUser className="size-4 shrink-0" />
            <span className="truncate">{userLabel ?? 'Se connecter'}</span>
          </Link>
        </div>
      </nav>
    </>
  )
}
