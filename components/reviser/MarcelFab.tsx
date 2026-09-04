'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { sfx } from '@/lib/sounds'
import marcelTete from '@/public/images/nav/marcel.webp'

/** Après le dernier événement de défilement, le temps avant que la tête revienne. */
const REPOS_APRES_DEFILEMENT_MS = 320

/**
 * LA TÊTE SE CACHE PENDANT LE DÉFILEMENT.
 *
 * Fixée en bas à droite, elle est posée EXACTEMENT dans la colonne des « + »
 * des fiches du programme : en descendant la liste sur un téléphone, elle en
 * couvrait un sur trois — le bouton qu'on vient chercher, caché par le coach
 * qu'on n'a pas appelé. Pendant qu'on fait défiler, on lit la liste, on
 * n'appelle pas Marcel ; la tête glisse sous le bord et revient dès que le
 * doigt s'arrête, comme la barre collante du header. À l'arrêt, elle ne
 * recouvre plus qu'une ligne, que le pouce déplace d'un geste.
 *
 * L'écouteur est posé en CAPTURE sur le document : il entend aussi les zones
 * qui défilent à l'intérieur de la page (une feuille, un panneau), pas
 * seulement la fenêtre.
 */
function useCacheAuDefilement(): boolean {
  const [cache, setCache] = useState(false)
  useEffect(() => {
    let minuteur: ReturnType<typeof setTimeout> | undefined
    const surDefilement = () => {
      setCache(true)
      if (minuteur) clearTimeout(minuteur)
      minuteur = setTimeout(() => setCache(false), REPOS_APRES_DEFILEMENT_MS)
    }
    document.addEventListener('scroll', surDefilement, {
      capture: true,
      passive: true,
    })
    return () => {
      if (minuteur) clearTimeout(minuteur)
      document.removeEventListener('scroll', surDefilement, { capture: true })
    }
  }, [])
  return cache
}

/**
 * LA PORTE DE MARCEL — sa tête, posée en bas à droite de Réviser.
 *
 * Marcel avait un onglet, le sixième, entre Réviser et Défi. Six destinations à
 * trancher en bas d'écran, c'est une de trop : la barre se lisait comme un menu
 * plutôt que comme cinq lieux. Le coach se rejoint donc par son VISAGE, à
 * l'endroit exact où l'élève travaille — cohérent avec la doctrine « Marcel
 * oriente, Réviser exécute » : on part de Réviser pour lui demander quoi faire,
 * et son point du jour renvoie dans Réviser pour le faire.
 *
 * C'est un vrai lien (`<Link>`), pas un bouton qui pousse une route : appui long,
 * ouverture dans un onglet et préchargement de Next fonctionnent comme partout.
 *
 * Le dessin est le MÊME fichier que l'ancienne icône d'onglet
 * (`public/images/nav/marcel.webp`) : l'élève qui connaissait le visage dans la
 * barre le retrouve ici, et il n'y a pas deux têtes de Marcel à tenir à jour.
 * Il arrive avec un cinquième de marges et d'étincelles autour du personnage —
 * c'est ce qu'il faut à une icône d'onglet, c'est trop pour un médaillon : posé
 * tel quel, le visage n'occupait qu'un tiers du disque. `.coach-fab-tete`
 * l'agrandit et le recentre sur le regard, le disque rogne le reste.
 *
 * Le matériau (cerne violet, socle, enfoncement, halo de focus) vit dans
 * `globals.css` sous `.coach-fab` : cerne et socle écrivent la même propriété
 * CSS, les empiler en utilitaires faisait disparaître l'un ou l'autre.
 *
 * 64 px : bien au-delà de la cible tactile de 44 px, et c'est voulu qu'il soit
 * plus gros qu'un « + » ordinaire — c'est un personnage qu'on appelle, pas une
 * commande.
 *
 * `bottom-24` sur mobile = au-dessus de la barre d'onglets (56 px + la marge
 * sûre du bas), la même hauteur que le « + » du carnet — les deux ne coexistent
 * jamais, chacun vivant dans son volet (le volet inactif est `hidden`, donc
 * retiré du rendu, `fixed` compris).
 *
 * Sur une page de matière, la tête emmène chez Marcel AVEC la matière
 * (`/marcel?matiere=<slug>`) : ses modes fiche · exercice · flashcards
 * s'ouvrent alors sur le bon programme, sans que l'élève ait à le redire.
 */
export default function MarcelFab({ matiere }: { matiere?: string }) {
  const href = matiere
    ? `/marcel?matiere=${encodeURIComponent(matiere)}`
    : '/marcel'
  const cache = useCacheAuDefilement()
  return (
    <Link
      href={href}
      onClick={() => sfx.tap()}
      aria-label="Demander à Marcel, ton coach"
      title="Marcel, ton coach"
      // `data-cache` : la glissade sous le bord vit dans globals.css avec le
      // reste du matériau du bouton (`.coach-fab[data-cache='true']`).
      data-cache={cache ? 'true' : 'false'}
      className="coach-fab bg-card fixed right-4 bottom-24 z-40 flex size-16 items-center justify-center overflow-hidden rounded-full md:bottom-8"
    >
      {/* Enveloppe : elle porte le frétillement du survol. S'il vivait sur
          l'image, son `transform` écraserait l'agrandissement de la tête, qui
          reviendrait brutalement à sa taille d'icône le temps de l'animation. */}
      <span className="wiggle-on-hover block size-full">
        <Image
          src={marcelTete}
          alt=""
          aria-hidden="true"
          // 192 = trois fois la case servie : le dessin est agrandi de 40 % à
          // l'affichage, il faut les pixels pour suivre sur un écran dense.
          width={192}
          height={192}
          className="coach-fab-tete size-full object-contain"
        />
      </span>
    </Link>
  )
}
