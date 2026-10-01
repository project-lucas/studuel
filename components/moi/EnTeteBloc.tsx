import type { ReactNode } from 'react'

// -----------------------------------------------------------------------------
// L'EN-TÊTE D'UN BLOC DE MOI — une seule recette pour tous (chantier
// d'homogénéité du 24/09/2026). Les blocs de Moi avaient trois en-têtes : un
// titre nu (Classement), un titre coiffé d'une pastille à pictogramme au trait
// et d'un sous-titre en petites capitales (Matières, Couronnes, Badges,
// Palmarès), un titre suivi d'un sous-titre gris (Trajectoire). Il n'en reste
// qu'un : le titre de section Baloo 2 (`.titre-section`), puis une phrase
// grise en casse de phrase — les petites capitales (`.surtitre`) ne servent
// qu'au sourcil d'un H1 ou à un petit label, jamais à un titre de section.
// Un gain ou un compteur peut se poser à droite (`aDroite`).
// -----------------------------------------------------------------------------

export default function EnTeteBloc({
  titre,
  id,
  sousTitre,
  aDroite,
  niveau = 2,
}: {
  titre: ReactNode
  id?: string
  sousTitre?: ReactNode
  aDroite?: ReactNode
  niveau?: 2 | 3
}) {
  const Titre = niveau === 2 ? 'h2' : 'h3'
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <Titre id={id} className="titre-section">
          {titre}
        </Titre>
        {sousTitre ? <p className="mt-0.5 text-sm font-semibold text-muted-foreground">{sousTitre}</p> : null}
      </div>
      {aDroite}
    </div>
  )
}
