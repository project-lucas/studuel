'use client'

import IconeRayon from '@/components/bibliotheque/IconesRayons'
import { cn } from '@/lib/utils'
import { RAYONS, type Rayon } from '@/lib/bibliotheque'

/**
 * LE FILTRE DE TÊTE de « Ma bibliothèque » : Dossiers · Capsules · Fiches, trois
 * onglets ILLUSTRÉS qui tiennent la largeur (Lucas, 24/09/2026 : « enlève le
 * filtre Tout ; trouve les icônes appropriées pour les illustrer »). La recette
 * des onglets d'un dossier de matière (`ModeTabs`) : l'actif en violet plein,
 * les autres blancs à liseré. L'illustration est posée À NU, sans jeton blanc
 * autour (Lucas : « enlève la délimitation de l'illustration ») : son trait
 * prune la détache du violet de l'onglet actif.
 *
 * TAILLE (« agrandis un peu les filtres ») : 46 px de haut, dessin de 30 px,
 * texte à 15 px. Mesuré : sur 390 px, chaque onglet a ~115 px et « Capsules »
 * en gras en prend 64 — tout tient. Sous 380 px, le texte repasse à 14 px pour
 * ne pas tronquer « Capsules ».
 *
 * Pas de compte sur les onglets (un libellé tronqué ne se lit pas) : il reste
 * dans l'`aria-label`.
 */
export default function FiltresRayons({
  rayon,
  comptes,
  onChange,
}: {
  rayon: Rayon
  comptes: Record<Rayon, number>
  onChange: (rayon: Rayon) => void
}) {
  return (
    <div role="radiogroup" aria-label="Ranger ma bibliothèque" className="flex items-stretch gap-1.5">
      {RAYONS.map((r) => {
        const actif = r.id === rayon
        return (
          <button
            key={r.id}
            type="button"
            role="radio"
            aria-checked={actif}
            aria-label={`${r.label} (${comptes[r.id]})`}
            onClick={() => onChange(r.id)}
            className={cn(
              'flex min-w-0 flex-1 items-center justify-center gap-1 rounded-full py-2 pr-2.5 pl-1.5 text-[15px] transition-colors max-[380px]:text-sm',
              actif
                ? 'bg-primary font-bold text-primary-foreground shadow-sm'
                : 'border bg-card font-semibold text-foreground hover:bg-muted',
            )}
          >
            <IconeRayon rayon={r.id} className="size-7.5 shrink-0" />
            <span className="truncate">{r.label}</span>
          </button>
        )
      })}
    </div>
  )
}
