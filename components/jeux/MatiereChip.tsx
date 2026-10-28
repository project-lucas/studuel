import Image from 'next/image'

/**
 * LA PUCE DE LA MATIÈRE dans l'en-tête d'un mode de jeu (26/10/2026, Lucas :
 * « les icônes du mode de jeu à gauche et de la matière à droite doivent être
 * changées — nous avons les icônes, les illustrations ») : la vignette du
 * dossier de la matière (la même que dans Réviser) sur une pilule blanche, et
 * son nom. Sans vignette, l'emoji du salon, comme avant. Posée dans
 * `headerRight` de ModeStage par la carte des paliers et les trois tables.
 */
export default function MatiereChip({
  nom,
  vignette,
  emoji,
}: {
  nom: string
  /** La vignette du dossier de la matière (Réviser), ou null. */
  vignette: string | null
  emoji?: string
}) {
  return (
    <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-card py-1 pr-2.5 pl-1 text-[11px] font-extrabold text-foreground shadow-sm ring-1 ring-black/5">
      {vignette ? (
        <Image src={vignette} alt="" aria-hidden="true" width={48} height={48} className="size-6 object-contain" />
      ) : emoji ? (
        <span aria-hidden="true" className="grid size-6 place-items-center text-sm">
          {emoji}
        </span>
      ) : null}
      {nom}
    </span>
  )
}
