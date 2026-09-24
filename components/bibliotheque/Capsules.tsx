'use client'

import { useState } from 'react'
import { Check, Sparkles } from 'lucide-react'
import BlocCapsule from '@/components/capsules/BlocCapsule'
import PucesFiltre from '@/components/bibliotheque/PucesFiltre'
import { Invitation, LienSuite } from '@/components/bibliotheque/Invitation'
import { filtrerCapsules, themesDesCapsules, type CapsuleRangee } from '@/lib/bibliotheque'
import { sfx } from '@/lib/sounds'

// -----------------------------------------------------------------------------
// LES CAPSULES ACHETÉES dans la Boutique (366), rangées dans la bibliothèque
// (ex-étagère « Mes capsules » en tête du carnet, Lucas, 18/09/2026). Les
// jamais ouvertes d'abord, marquées « Nouveau » : ce sont elles que la pastille
// du bouton « Ma bibliothèque » signale (`etagereCarnet`, lib/capsules).
// Depuis le 24/09/2026, le MÊME bloc que dans la Boutique (BlocCapsule, façon
// offre de Clash Royale), pleine largeur, les uns sous les autres : on retrouve
// chez soi la capsule telle qu'on l'a achetée.
// -----------------------------------------------------------------------------

/**
 * Une capsule de la bibliothèque : le bloc, un ruban d'état sur sa scène
 * (« Nouveau », « Terminée ») et, au pied du panneau, l'action.
 */
function CapsuleRangeeBloc({ capsule, achat, prioritaire }: CapsuleRangee & { prioritaire: boolean }) {
  const nouvelle = achat.ouverteLe === null
  const terminee = achat.termineeLe !== null
  return (
    <BlocCapsule
      capsule={capsule}
      href={`/carnet/capsules/${capsule.id}`}
      onClick={() => sfx.tap()}
      premiereImagePrioritaire={prioritaire}
      ariaLabel={`${capsule.titre}${nouvelle ? ' — nouvelle' : terminee ? ' — terminée' : ''}. Ouvrir.`}
      badge={
        nouvelle ? (
          <span className="rounded-full bg-destructive px-2 py-0.5 text-[10px] font-extrabold text-white shadow-sm">
            Nouveau
          </span>
        ) : terminee ? (
          <span className="flex items-center gap-0.5 rounded-full bg-card px-2 py-0.5 text-[10px] font-extrabold text-primary shadow-sm">
            <Check className="size-3" strokeWidth={3} aria-hidden="true" /> Terminée
          </span>
        ) : null
      }
      pied={
        <span className="block rounded-lg bg-primary py-1.5 text-center text-xs font-extrabold text-primary-foreground shadow-sm">
          {nouvelle ? 'Ouvrir' : terminee ? 'Revoir' : 'Reprendre'}
        </span>
      }
    />
  )
}

/**
 * Le rayon vide. Sans catalogue (la 367, qui pose le contenu, n'est pas
 * passée partout), il n'y a rien à acheter : on l'annonce sans lien.
 */
function InvitationCapsules({ disponibles }: { disponibles: boolean }) {
  if (!disponibles) {
    return (
      <p className="carte px-4 py-3 text-sm font-semibold text-muted-foreground">
        Les premières capsules arrivent très bientôt dans la Boutique.
      </p>
    )
  }
  return (
    <Invitation
      href="/tresor#capsules"
      icone={Sparkles}
      titre="Débloque ta première capsule"
      texte="Sommeil, argent, orientation… des mini-formations à gagner avec tes gemmes."
    />
  )
}

/** Le rayon Capsules : une puce par thème, puis les capsules en blocs, les unes sous les autres. */
export function RayonCapsules({
  etagere,
  disponibles,
}: {
  etagere: CapsuleRangee[]
  /** Le catalogue de la Boutique a-t-il des capsules ? */
  disponibles: boolean
}) {
  const [theme, setTheme] = useState<string | null>(null)

  if (etagere.length === 0) return <InvitationCapsules disponibles={disponibles} />

  return (
    <div className="flex flex-col gap-3">
      <PucesFiltre
        label="Thème"
        tout="Toutes"
        puces={themesDesCapsules(etagere)}
        actif={theme}
        onChange={setTheme}
      />
      <ul className="mx-auto flex w-full max-w-xl flex-col gap-4" aria-label="Mes capsules">
        {filtrerCapsules(etagere, theme).map((e, index) => (
          <li key={e.capsule.id}>
            <CapsuleRangeeBloc {...e} prioritaire={index === 0} />
          </li>
        ))}
      </ul>
      {disponibles ? <LienSuite href="/tresor#capsules">Découvrir d’autres capsules</LienSuite> : null}
    </div>
  )
}
