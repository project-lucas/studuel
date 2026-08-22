'use client'

import type { ReactNode } from 'react'

/**
 * La classe de largeur des deux flancs (92 px, 76 px sous 360 px — cf. CSS).
 *
 * Exportée parce que TROIS composants doivent tomber sur le même chiffre : les
 * deux plaques de flanc (Modes, Matière) et les deux cales invisibles qui
 * calent la ligne d'information sur la largeur exacte du bouton COMBAT. Écrite
 * trois fois à la main, elle aurait dérivé au premier réglage, et la ligne
 * d'info aurait cessé d'être alignée sur ce qu'elle documente.
 */
export const FLANK_CLASS = 'arena-plate-flank shrink-0'

/**
 * LA BARRE D'ACTION DE L'ARÈNE — la ligne d'information, puis les trois plaques.
 *
 * Tout ce qui est ici est de la GÉOMÉTRIE, et elle vit dans un seul fichier :
 * la hauteur fixe (92 px), l'espacement (12 px), la marge latérale, et les deux
 * cales qui donnent à la ligne du haut la largeur du bouton du milieu. Les trois
 * plaques ne connaissent qu'une chose de la barre — la classe de largeur des
 * flancs — et rien de leur voisinage.
 *
 * POURQUOI LA LIGNE D'INFO EST DEHORS. Le bouton COMBAT portait avant sa
 * matière et sa jauge de clan à l'intérieur : trois messages sur un objet dont
 * le rôle est de recevoir un pouce. Un bouton d'action ne se lit pas, il se
 * frappe. Sortie au-dessus, l'information reste à 8 px de là — donc toujours
 * rattachée au bouton — mais elle cesse de disputer sa surface à la seule chose
 * qu'il doit dire.
 *
 * LA MARGE LATÉRALE : `px-1` et non `px-4`. La coquille de la page pose déjà
 * 12 px (`px-3` sur `app/defi/page.tsx`) ; les 4 px d'ici les portent à 16 px du
 * bord de l'écran. Ajouter 16 px pleins ici aurait décalé la barre de 28 px et
 * désaligné les plaques de tout le HUD au-dessus.
 *
 * PAS DE SECOND `env(safe-area-inset-bottom)` : la coquille de la page réserve
 * déjà `4.75rem + env(safe-area-inset-bottom)` sous ce bloc (la barre d'onglets
 * et l'encoche basse). Le redemander ici aurait creusé un vide sous la barre.
 */
export default function ArenaActionBar({
  meta,
  left,
  center,
  right,
}: {
  /** La ligne d'information, calée sur la largeur du bouton du centre. */
  meta: ReactNode
  left: ReactNode
  center: ReactNode
  right: ReactNode
}) {
  return (
    <div className="px-1">
      <div className="flex items-end gap-3">
        <span className={FLANK_CLASS} aria-hidden="true" />
        <div className="min-w-0 flex-1">{meta}</div>
        <span className={FLANK_CLASS} aria-hidden="true" />
      </div>

      {/* `items-stretch` + hauteur fixe : les trois plaques partagent la même
          ligne de base ET le même sommet. C'est la condition pour que leurs
          trois ombres portées se lisent comme une seule élévation. */}
      <div className="mt-2 flex h-[92px] items-stretch gap-3">
        {left}
        {center}
        {right}
      </div>
    </div>
  )
}
