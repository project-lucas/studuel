'use client'

import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, type ReactNode } from 'react'
import { CircleUser } from 'lucide-react'
import { cn } from '@/lib/utils'
import { estChromeMasque } from '@/lib/quiz-chrome'
import { sfx } from '@/lib/sounds'
import { NAV_TABS, cheminAffiche, type NavIconName, type OngletVise } from '@/lib/nav-tabs'
import { prechargerOnglet } from '@/components/PrechargeurOnglets'
import amisIcone from '@/public/images/nav/amis.webp'
import reviserIcone from '@/public/images/nav/reviser.webp'
import defiIcone from '@/public/images/nav/defi.webp'
import moiIcone from '@/public/images/nav/moi.webp'
import tresorIcone from '@/public/images/nav/tresor.webp'

// Ordre des onglets = ordre de la barre mobile (Défi au centre), lu dans
// NAV_TABS. Ces liens sont la SEULE façon de changer d'onglet : le balayage
// horizontal a été retiré le 18/09/2026.
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
 * dépense (et non « un coffre à ouvrir »). Reste le livre de Réviser, qui était
 * déjà juste.
 *
 * Le visage de Marcel a quitté cette table avec son onglet : il vit désormais
 * dans le bouton flottant de Réviser, qui importe le même fichier.
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
  defi: defiIcone,
  moi: moiIcone,
  tresor: tresorIcone,
}

/** L'onglet dont le dessin est remplacé par le vrai avatar de l'élève. */
const AVATAR_ICON: NavIconName = 'moi'

/*
 * PLUS DE COURONNE DE LAURIER AUTOUR DE L'AVATAR (16/09/2026). Le cadre existait
 * pour qu'un visage DiceBear nu, sans contour, ne dépare pas au milieu de quatre
 * objets peints. Depuis que l'élève choisit un BLASON (lib/portraits), son
 * illustration porte déjà son propre écu, son cerne et son or : la couronne
 * par-dessus faisait deux cadres l'un dans l'autre, et le disque qui rognait
 * l'écu au visage ne montrait plus l'illustration choisie. Lucas a tranché : on
 * laisse le personnage, tel que l'élève l'a choisi, remplir la case comme les
 * autres icônes. Le fichier `cadre-avatar.webp` et sa fabrication dans
 * `scripts/nav-icones.mjs` restent là, inutilisés, si un jour on y revient.
 */

export default function Navigation({
  userLabel,
  // Pastille d'appel de la Boutique (façon Clash Royale), rendue côté SERVEUR
  // par le layout sous <Suspense> : la barre s'affiche tout de suite, la
  // pastille se pose quand la réponse arrive. `null` quand la vitrine de la
  // semaine a déjà été vue.
  boutiqueBadge = null,
  // Avatar de l'élève pour l'onglet Moi, streamé par le layout selon la même
  // discipline. `null` (déconnecté, panne, ou réponse pas encore arrivée) :
  // on retombe sur le buste dessiné, qui est de la même famille que les cinq
  // autres icônes — le repli ne se remarque pas.
  avatarSlot = null,
  // Pastille de l'onglet Amis : un bilan de ligue attend d'être joué
  // (components/amis/ligue/NavAmisBadge). `null` pour un visiteur.
  amisBadge = null,
}: {
  userLabel: string | null
  boutiqueBadge?: ReactNode
  amisBadge?: ReactNode
  avatarSlot?: ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  // L'ONGLET TOUCHÉ, AFFICHÉ TOUT DE SUITE (`cheminAffiche`, lib/nav-tabs) : la
  // plaque part vers lui au toucher, sans attendre que le nouvel écran soit
  // construit. Remis à zéro dès que l'URL change — un ajustement d'état pendant
  // le rendu, comme React le recommande, et non un effet.
  const [vise, setVise] = useState<OngletVise | null>(null)
  const [cheminVu, setCheminVu] = useState(pathname)
  if (cheminVu !== pathname) {
    setCheminVu(pathname)
    setVise(null)
  }
  const affiche = cheminAffiche(pathname, vise)

  // Routes sans chrome : parcours d'accueil (façon Duolingo) ET sessions plein
  // écran (quiz, dictée). Le verdict est pris ICI, sur `usePathname()`, et non
  // dans le layout racine : celui-ci est serveur et n'est pas re-rendu lors
  // d'une navigation client, si bien qu'un quiz ouvert depuis un `<Link>`
  // gardait la barre d'onglets — laquelle recouvrait le bouton « Valider ».
  if (estChromeMasque(pathname)) return null

  const isActive = (path: string) =>
    affiche === path || affiche.startsWith(`${path}/`)

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
          porte une plaque violette, s'agrandit et affiche son mot dessous.
          Plus d'orbe central : le Défi est un onglet comme les autres, c'est
          la sélection qui parle. */}
      {/* OPAQUE, SANS FLOU (18/09/2026). Le `backdrop-blur` refloutait tout ce
          qui défile dessous, à CHAQUE image du défilement : sur un téléphone
          modeste, c'est ce qui faisait saccader les longues pages (la
          Boutique) et parfois clignoter la barre. Le socle crème est plein,
          et la barre vit sur sa propre couche (`.tab-bar`, globals.css). */}
      <nav className="tab-bar fixed inset-x-0 bottom-0 z-50 border-t pb-[env(safe-area-inset-bottom)] md:hidden">
        {/* PAS d'`overflow-hidden` : l'icône active DÉBORDE au-dessus du
            liseré or, comme les haches de « Combattre » chez Clash Royale —
            c'est le geste qui fait sortir l'onglet du socle. La plaque, elle,
            reste dans la barre (`inset-block: 0`). 64 px de haut : le dessin
            agrandi, lifté de 10 px, et le mot (13 px, noir) en bas de case. */}
        <ul className="relative flex h-16 items-stretch">
          {/* Plaque violette qui suit l'onglet actif — elle GLISSE d'un onglet
              à l'autre (une seule plaque animée, pas cinq fondus). Elle occupe la
              cellule entière ; le retrait visuel est dessiné par ::before. */}
          {activeIndex >= 0 && (
            <span
              aria-hidden="true"
              className="tab-plate"
              style={{
                width: `${100 / links.length}%`,
                // Le glissement par `transform` : le compositeur le joue seul,
                // même pendant que le nouvel onglet se construit. `left`
                // recalculait la mise en page à chaque image.
                transform: `translateX(${activeIndex * 100}%)`,
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
              <li key={path} className="tab-cell relative z-10 flex-1">
                <Link
                  href={path}
                  // PAS DE PRÉCHARGEMENT PAR LE LIEN. Chaque onglet est une
                  // page entièrement dynamique qui coûte de dix à quinze
                  // requêtes Supabase : laisser les cinq liens précharger dès
                  // leur entrée dans le champ revenait à faire calculer toute
                  // l'app au serveur d'un coup — en production, /tresor rendu
                  // quatre fois et /defi trois fois en une seconde, et des 503.
                  // Le préchargement existe toujours, mais il est PILOTÉ :
                  // `PrechargeurOnglets` (layout) demande les onglets un par
                  // un, une fois la page peinte, et les garde frais ; ici, le
                  // doigt qui se pose relance juste celui qu'il vise, au cas
                  // où son entrée a expiré — sans coût quand elle est fraîche.
                  prefetch={false}
                  // Le défilement des onglets est l'affaire d'OngletsVivants (chaque
                  // onglet garde le sien). Celui de Next mesurait le nouvel écran
                  // à chaque navigation : une mise en page forcée, 22 ms au
                  // processeur ×4, pour rien.
                  scroll={false}
                  onPointerDown={() => prechargerOnglet(router, path)}
                  onClick={() => {
                    sfx.tap()
                    // L'onglet déjà à l'écran : on remonte en haut, comme toute
                    // appli mobile (chaque onglet garde sinon son défilement,
                    // components/OngletsVivants).
                    if (isActive(path)) {
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                      return
                    }
                    setVise({ cible: path, depuis: pathname })
                    // Filet : une navigation qui n'aboutit pas (garde de
                    // sortie, réseau coupé) ne laisse pas la barre mentir.
                    window.setTimeout(
                      () => setVise((v) => (v?.cible === path ? null : v)),
                      5000,
                    )
                  }}
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
                        'relative',
                        // 44 px au repos, 57 une fois actif (× 1,3) et lifté
                        // de 10 px : le dessin sort du socle par le haut, le
                        // mot (13 px) reste en bas de la case.
                        'flex items-center justify-center transition-transform duration-200',
                        // Le BLASON DE L'ÉLÈVE est un peu plus grand que les
                        // quatre objets (48 px au lieu de 44, Lucas, 16/09/2026) :
                        // c'est un écu avec un visage dedans, et à 44 px le
                        // visage ne se voyait pas assez. Seulement lui — les
                        // autres dessins remplissent déjà leur case.
                        icon === AVATAR_ICON ? 'size-12' : 'size-11',
                        active
                          ? // L'agrandissement ET le débordement, c'est LE
                            // signal de sélection : l'icône enfle d'un tiers
                            // et monte au-dessus du liseré or. Elle est aussi
                            // la seule à porter ses pleines couleurs.
                            'scale-[1.3] -translate-y-2.5 drop-shadow-[0_3px_3px_rgba(40,20,80,0.25)]'
                          : // Les illustrations portent leurs propres couleurs :
                            // pour que l'onglet actif ressorte, ce sont les
                            // AUTRES qui reculent — désaturées et atténuées,
                            // façon Clash Royale (Lucas, 16/09/2026 : plus
                            // ternes qu'avant, 60 % / saturation 40 %). Le
                            // contour marine épais des dessins tient le 3:1.
                            'opacity-60 saturate-[0.4]',
                      )}
                    >
                      {icon === AVATAR_ICON ? (
                        // Le personnage choisi par l'élève — streamé par le
                        // layout, ou le buste dessiné en repli — occupe TOUTE la
                        // case, sans cadre ni disque : c'est `NavAvatarLoader`
                        // qui décide de sa forme (écu entier, ou rond pour un
                        // avatar DiceBear).
                        (slot ?? (
                          <Image
                            src={ICONES[icon]}
                            alt=""
                            aria-hidden="true"
                            width={80}
                            height={80}
                            priority
                            className="size-full object-contain"
                          />
                        ))
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
                          // ces cinq vignettes ne doivent pas arriver en retard.
                          priority
                          className="size-full object-contain"
                        />
                      )}
                    </span>
                    {icon === 'tresor' ? boutiqueBadge : null}
                    {icon === 'amis' ? amisBadge : null}
                  </span>
                  {/* LE MOT SOUS L'ONGLET ACTIF, et lui seul — le geste de
                      Clash Royale (Lucas, 16/09/2026). Les quatre autres
                      restent des dessins muets ; celui qu'on a choisi
                      s'agrandit ET se nomme. Ce mot remplace le titre que
                      chaque onglet portait en haut de page : on sait où l'on
                      est en regardant la barre, la page peut commencer tout de
                      suite par son contenu. Les onglets inactifs gardent leur
                      `aria-label` : un lecteur d'écran les nomme tous. */}
                  {active ? (
                    <span
                      aria-hidden="true"
                      className="font-heading mt-1 text-[13px] leading-none font-extrabold text-foreground"
                    >
                      {name}
                    </span>
                  ) : null}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Desktop : sidebar sticky */}
      <nav className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-8 border-r bg-card p-5 md:flex">
        <Link href="/" className="font-heading px-3 text-2xl font-extrabold">
          Studuel
        </Link>

        <ul className="flex flex-col gap-1">
          {links.map(({ name, path, icon, center }) => {
            const active = isActive(path)

            return (
              <li key={path}>
                <Link
                  href={path}
                  prefetch={false}
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
                      mobile : la sidebar affiche déjà les mots. */}
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
