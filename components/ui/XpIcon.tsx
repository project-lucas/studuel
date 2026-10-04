import Image from 'next/image'
import { cn } from '@/lib/utils'

/**
 * L'ÉCLAIR D'XP, UNE SEULE ILLUSTRATION PARTOUT (04/10/2026, Lucas : « tout doit
 * être associé à un gain d'XP avec cet éclair, de la 6e à la Terminale »). Le
 * dessin de la famille de la barre d'onglets (cerne prune, volumes brillants),
 * fabriqué par `node scripts/icone-xp.mjs` : il remplace l'éclair SVG de 2024 et
 * tout pictogramme au trait (`Zap`, étincelle) qui disait « XP ».
 *
 * `eclats` : la version entourée de ses étincelles, pour un grand éclair (fête
 * de niveau, écran de fin) — à moins de ~40 px, elles ne font que des points.
 */
export default function XpIcon({ className, eclats = false }: { className?: string; eclats?: boolean }) {
  return (
    <Image
      src={eclats ? '/images/xp/eclair-eclats.webp' : '/images/xp/eclair.webp'}
      alt=""
      aria-hidden="true"
      width={eclats ? 384 : 128}
      height={eclats ? 384 : 128}
      draggable={false}
      // Déjà un WebP de 5 Ko (25 avec les étincelles), fait pour ces tailles :
      // l'optimiseur d'images n'ajouterait qu'un aller-retour à une icône
      // présente sur tous les écrans.
      unoptimized
      className={cn('inline-block size-4 shrink-0 object-contain', className)}
    />
  )
}
