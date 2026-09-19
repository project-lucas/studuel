import type { ReactNode } from 'react'
import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'
import { tailleTitrePack } from '@/lib/boutique/packs-gemmes'
import { cn } from '@/lib/utils'
import styles from './CarteMagasin.module.css'

/**
 * La teinte d'un article : la couleur de sa carte, son IDENTITÉ (la palette
 * `data-teinte` des outils de Marcel, globals.css). Violet pour les gemmes,
 * ambre pour le boost XP, bleu pour le boost trophées, rose pour la fiche.
 */
export type TeinteMagasin = 'violet' | 'ambre' | 'bleu' | 'rose'

/**
 * L'illustration d'un article, en import statique (URL à empreinte de
 * contenu). Des objets détourés, posés sur le bord bas de leur carré.
 * `largeur` : la boîte de l'image, en % de l'écrin — les images ne remplissent
 * pas leur carré pareil, cette largeur ramène chaque objet aux deux tiers de
 * l'écrin, comme au magasin de Clash Royale.
 */
export type IllustrationMagasin = { image: StaticImageData; largeur: number }

/**
 * L'écrin d'un article : l'étiquette en haut (la quantité d'un pack, « ×2 ·
 * 2 h » d'un boost), l'objet posé au sol dessous, avec SON ombre : la même
 * image, passée au noir, aplatie et couchée vers l'arrière-gauche depuis sa
 * base (`ombrePortee`), plus une petite ellipse sombre qui le pose au sol.
 * Sans illustration, le `repli` est dessiné dans la même boîte.
 *
 * L'écrin est son propre conteneur (`@container`) : l'étiquette et l'objet se
 * règlent en % de SA largeur, si bien qu'il garde ses proportions dans la
 * carte (79 px au modèle) comme en grand dans une feuille d'achat. Étiquette :
 * chiffres de 12 px centrés à 13 px du haut ; objet posé à 9 % du bas.
 */
export function EcrinMagasin({
  etiquette,
  teinte,
  illustration,
  repli,
  className,
}: {
  etiquette: string
  teinte: TeinteMagasin
  illustration?: IllustrationMagasin
  repli?: ReactNode
  className?: string
}) {
  const largeur = illustration?.largeur ?? 70
  return (
    <span
      data-teinte={teinte}
      className={cn(styles.ecrin, '@container relative block aspect-[79/97] overflow-hidden', className)}
    >
      <span
        className={cn(
          styles.encre,
          styles.etiquette,
          'font-heading absolute inset-x-0 top-[17.3cqw] z-10 -translate-y-1/2 text-center text-[24cqw] leading-none font-extrabold whitespace-nowrap tabular-nums [--trait:0.16em]',
        )}
      >
        {etiquette}
      </span>
      <span
        aria-hidden="true"
        className={cn(styles.ombre, 'absolute bottom-[6.5%] left-1/2 h-[7%] -translate-x-1/2')}
        style={{ width: `${largeur * 0.78}%` }}
      />
      <span
        aria-hidden="true"
        className="absolute bottom-[9%] left-1/2 aspect-square -translate-x-1/2"
        style={{ width: `${largeur}%` }}
      >
        {illustration ? (
          <>
            <Image
              src={illustration.image}
              alt=""
              fill
              sizes="(max-width: 640px) 22vw, 160px"
              loading="eager"
              className={cn(styles.ombrePortee, 'object-contain')}
            />
            <Image
              src={illustration.image}
              alt=""
              fill
              sizes="(max-width: 640px) 22vw, 160px"
              loading="eager"
              className="object-contain"
            />
          </>
        ) : (
          repli
        )}
      </span>
    </span>
  )
}

type Action =
  | { href: string; onClick?: () => void }
  | { href?: undefined; onClick: () => void }

/**
 * LA CARTE DU MAGASIN — le gabarit du magasin de Clash Royale, relevé au pixel
 * sur une carte de 111 px (Lucas, 18/09/2026) et reporté en % de la carte
 * (cqw) : carte 111 × 216, nom centré à 21 px, écrin de 79 × 97 posé à 54 px,
 * bas (prix) centré à 185 px, épaisseur de 9 px en bas. Commune aux packs de
 * gemmes et aux boosts du Marché ; seule la teinte change.
 *
 * Un bouton (achat dans une feuille) ou un lien (`href`). Le nom tient
 * toujours sur une ligne : il se resserre s'il est long (tailleTitrePack).
 */
export default function CarteMagasin({
  titre,
  etiquette,
  teinte,
  illustration,
  repli,
  bas,
  ariaLabel,
  ...action
}: {
  titre: string
  etiquette: string
  teinte: TeinteMagasin
  illustration?: IllustrationMagasin
  repli?: ReactNode
  /** Le bas de la carte : le prix, ou l'état d'un boost en cours. */
  bas: ReactNode
  ariaLabel: string
} & Action) {
  const classe = cn(
    styles.carte,
    'relative block aspect-[111/216] w-full cursor-pointer transition-transform active:translate-y-0.5',
  )
  const contenu = (
    <>
      <span
        className={cn(
          styles.encre,
          'font-heading absolute inset-x-0 top-[18.9cqw] z-10 -translate-y-1/2 text-center leading-none font-extrabold whitespace-nowrap [--trait:0.18em]',
        )}
        style={{ fontSize: `${tailleTitrePack(titre)}cqw` }}
      >
        {titre}
      </span>
      <EcrinMagasin
        etiquette={etiquette}
        teinte={teinte}
        illustration={illustration}
        repli={repli}
        className="absolute top-[48.6cqw] left-1/2 w-[71.2%] -translate-x-1/2"
      />
      <span
        className={cn(
          styles.encre,
          'font-heading absolute inset-x-0 top-[167cqw] z-10 flex -translate-y-1/2 items-center justify-center gap-[2cqw] text-[23.4cqw] leading-none font-extrabold whitespace-nowrap tabular-nums [--trait:0.12em]',
        )}
      >
        {bas}
      </span>
    </>
  )

  return (
    <div className="@container flex w-full">
      {action.href !== undefined ? (
        <Link
          href={action.href}
          onClick={action.onClick}
          aria-label={ariaLabel}
          data-teinte={teinte}
          className={classe}
        >
          {contenu}
        </Link>
      ) : (
        <button
          type="button"
          aria-haspopup="dialog"
          aria-label={ariaLabel}
          onClick={action.onClick}
          data-teinte={teinte}
          className={classe}
        >
          {contenu}
        </button>
      )}
    </div>
  )
}

/** Le bas d'une carte d'article DÉJÀ À L'ÉLÈVE — un boost qui court (le temps
 *  qu'il reste), un bouclier en réserve (« Prêt ») : une pastille verte à la
 *  place du prix. `lecteur` précède le texte pour les lecteurs d'écran. */
export function EnCours({ texte, lecteur }: { texte: string; lecteur: string }) {
  return (
    <span className={cn(styles.enCours, 'text-[10.5cqw]')}>
      <span className="sr-only">{lecteur} </span>
      {texte}
    </span>
  )
}
