import Image from 'next/image'

/**
 * Vitrine du personnage (haut de l'onglet Défi) — inspirée de l'écran d'accueil
 * de Brawl Stars : un fond doré en « soleil » (rayons en éventail qui tournent
 * lentement) avec le personnage du joueur planté au centre, en idle (respiration
 * + léger balancement). Purement CSS pour l'animation → composant serveur.
 *
 * `skin` prépare la suite : chaque skin est un visuel de mascotte dans
 * `/images/mascotte`. On changera de skin sans toucher à la vitrine.
 */

/** Catalogue des skins jouables (clé stable → fichier + libellé). */
export const MASCOT_SKINS = {
  classique: { file: 'flamme-3-rayonnante.webp', label: 'Flamme classique' },
  braise: { file: 'flamme-0-braise.webp', label: 'Petite braise' },
  brasier: { file: 'flamme-4-brasier.webp', label: 'Grand brasier' },
  legendaire: { file: 'flamme-5-legendaire.webp', label: 'Flamme légendaire' },
  fete: { file: 'flamme-celebration.webp', label: 'En fête' },
} as const

export type MascotSkin = keyof typeof MASCOT_SKINS

interface DefiHeroProps {
  /** Skin affiché. Défaut : la flamme classique. */
  skin?: MascotSkin
  /** Nom de l'arène courante, affiché en plaque sous le perso. */
  arenaName?: string
  /** Icône de l'arène courante. */
  arenaIcon?: string
}

export default function DefiHero({
  skin = 'classique',
  arenaName,
  arenaIcon,
}: DefiHeroProps) {
  const mascot = MASCOT_SKINS[skin] ?? MASCOT_SKINS.classique

  return (
    <section
      className="defi2-hero relative grid place-items-center overflow-hidden px-4 pt-6 pb-5"
      aria-label="Ton personnage"
    >
      {/* Rayons dorés en éventail, en rotation très lente derrière le perso. */}
      <span aria-hidden="true" className="defi2-hero-rays" />
      {/* Halo doux qui détache le perso des rayons. */}
      <span aria-hidden="true" className="defi2-hero-glow" />

      {/* Le personnage : grand, centré, en idle. Ombre au sol qui respire. */}
      <div className="relative flex flex-col items-center">
        <Image
          src={`/images/mascotte/${mascot.file}`}
          alt={mascot.label}
          width={220}
          height={280}
          priority
          className="defi2-hero-char relative z-10 h-auto w-44 object-contain sm:w-48"
        />
        <span aria-hidden="true" className="defi2-hero-floor" />
      </div>

      {/* Plaque d'arène, comme le bandeau de rang dans Brawl Stars : pastille
          de verre sombre posée sur l'or de la vitrine. */}
      {arenaName ? (
        <div className="relative z-10 mt-2 flex items-center gap-2 rounded-full border border-white/15 bg-[oklch(0.2_0.04_300)]/85 px-4 py-1.5 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.6)] backdrop-blur-sm">
          {arenaIcon ? (
            <span className="text-base leading-none" aria-hidden>
              {arenaIcon}
            </span>
          ) : null}
          <span className="font-heading text-sm font-extrabold tracking-wide text-white">
            {arenaName}
          </span>
        </div>
      ) : null}
    </section>
  )
}
