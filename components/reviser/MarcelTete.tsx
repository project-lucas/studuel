'use client'

import Image from 'next/image'
import Link from 'next/link'
import { sfx } from '@/lib/sounds'
import marcelTete from '@/public/images/nav/marcel.webp'
import s from './BanniereMatiere.module.css'

/**
 * MARCEL, AMARRÉ dans l'en-tête du dossier de matière (05/10/2026).
 *
 * Sur l'accueil Réviser, sa tête flotte en bas à droite (`MarcelFab`). Dans un
 * dossier, ce coin est celui des boutons de fiche : deux disques flottants
 * (la loupe au-dessus de Marcel) recouvraient la colonne de droite, et Lucas
 * l'a pris pour ce que c'était — un défaut. Ici plus rien ne flotte sur le
 * contenu : Marcel se range dans la bannière, puis dans la barre collante dès
 * qu'on descend. Il reste à un toucher, partout dans la page.
 *
 * Même dessin et même adresse que le bouton flottant : la tête emmène chez
 * Marcel AVEC la matière (`/marcel?matiere=<slug>`).
 */
export default function MarcelTete({
  matiere,
  taille = 'md',
}: {
  matiere: string
  /** `md` dans la bannière, `sm` dans la barre collante. */
  taille?: 'sm' | 'md'
}) {
  return (
    <Link
      href={`/marcel?matiere=${encodeURIComponent(matiere)}`}
      // Un seul lien de ce genre par écran visible : pas de rafale à craindre,
      // mais Marcel n'est pas la suite probable — on ne le précharge pas.
      prefetch={false}
      onClick={() => sfx.tap()}
      aria-label="Demander à Marcel, ton coach"
      title="Marcel, ton coach"
      data-taille={taille}
      className={s.marcel}
    >
      <span className={s.marcelTete}>
        <Image
          src={marcelTete}
          alt=""
          aria-hidden="true"
          width={120}
          height={120}
          // Le dessin arrive avec un cinquième de marges : `.coach-fab-tete`
          // (globals.css) l'agrandit et le recentre sur le regard.
          className={`coach-fab-tete ${s.marcelImage}`}
        />
      </span>
    </Link>
  )
}
