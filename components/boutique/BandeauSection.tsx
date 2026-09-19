import type { StaticImageData } from 'next/image'
import { cn } from '@/lib/utils'
import plaque from '@/public/images/boutique/banniere/plaque.webp'
import parchemin from '@/public/images/boutique/banniere/parchemin.webp'
import ruban from '@/public/images/boutique/banniere/ruban.webp'
import rubanClair from '@/public/images/boutique/banniere/ruban-clair.webp'
import styles from './BandeauSection.module.css'

/**
 * Le titre de chaque catégorie de la Boutique. UN STYLE PAR CATÉGORIE, pour
 * qu'on les distingue d'un coup d'œil, comme au magasin de Clash Royale qui
 * mêle plaque dorée, parchemin et rubans (Lucas, 18/09/2026 : un même ruban
 * partout était « trop similaire »).
 *
 * Des IMAGES DESSINÉES (générées pour l'app, détourées par
 * scripts/bannieres-boutique.mjs), en import statique : URL à empreinte de
 * contenu, jamais servie depuis un vieux cache. L'image ne porte AUCUN TEXTE :
 * le titre est écrit ici, en Baloo 2, lisible et modifiable. Elle est posée en
 * neuf tranches (BandeauSection.module.css) : ses deux bouts gardent leurs
 * proportions, seul son centre uni s'allonge à la largeur de l'écran (pour le
 * parchemin, une tranche centrale de 2 % seulement).
 */
export type VarianteBandeau = 'plaque' | 'parchemin' | 'ruban' | 'ruban-clair'

const BANDEAUX: Record<VarianteBandeau, { image: StaticImageData; classe: string }> = {
  // Boost : la plaque dorée à pointes, texte brun gravé.
  plaque: { image: plaque, classe: cn(styles.plaque, 'text-2xl') },
  // Capsules : le parchemin entre ses deux rouleaux — seul le cœur du papier
  // s'allonge, le reste garde ses proportions.
  parchemin: { image: parchemin, classe: cn(styles.parchemin, 'text-2xl') },
  // Gemmes : le ruban violet cerclé d'or, queues en V et plis.
  ruban: { image: ruban, classe: cn(styles.ruban, 'text-2xl') },
  // Pour ton profil : le ruban lavande, plus fin, pointes vers l'extérieur.
  'ruban-clair': { image: rubanClair, classe: cn(styles.rubanClair, 'text-xl') },
}

export default function BandeauSection({
  id,
  variante,
  children,
}: {
  id: string
  variante: VarianteBandeau
  children: React.ReactNode
}) {
  const { image, classe } = BANDEAUX[variante]
  return (
    <h2
      id={id}
      className={cn(styles.image, 'font-heading font-extrabold', classe)}
      style={{ ['--bandeau-image' as string]: `url(${image.src})` }}
    >
      {children}
    </h2>
  )
}
