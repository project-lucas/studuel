'use client'

import type { ReactNode } from 'react'

/**
 * La classe de largeur des deux flancs (92 px, 76 px sous 360 px — cf. CSS).
 *
 * Exportée parce que TROIS composants doivent tomber sur le même chiffre : les
 * deux plaques de flanc (Modes, Matière) et le rideau de recherche
 * d'adversaire, qui pose « Annuler » sur l'empreinte exacte du bouton central.
 * Écrite trois fois à la main, elle aurait dérivé au premier réglage.
 */
export const FLANK_CLASS = 'arena-plate-flank shrink-0'

/**
 * LA BARRE D'ACTION DE L'ARÈNE — la ligne d'information, puis les trois plaques.
 *
 * Tout ce qui est ici est de la GÉOMÉTRIE, et elle vit dans un seul fichier :
 * la hauteur fixe (92 px), l'espacement (12 px) et la marge latérale. Les trois
 * plaques ne connaissent qu'une chose de la barre — la classe de largeur des
 * flancs — et rien de leur voisinage.
 *
 * LA LIGNE D'INFORMATION A DISPARU. Elle vivait 8 px au-dessus des plaques et
 * portait la matière, la jauge de clan et son échéance — tout ce que le bouton
 * central avait dû rendre pour ne garder qu'un mot. Mais posée là, elle
 * flottait entre le socle du personnage et la barre, et son fond sombre la
 * faisait ressembler à un quatrième bouton juste au-dessus des trois vrais.
 * La matière est rentrée DANS le bouton, en second rang sous le mot ; la jauge
 * de clan n'est plus affichée sur cet écran (elle reste dans l'`aria-label` du
 * bouton et sur la feuille des modes).
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
  left,
  center,
  right,
}: {
  left: ReactNode
  center: ReactNode
  right: ReactNode
}) {
  return (
    <div className="px-1">
      {/* `items-stretch` + hauteur fixe : les trois plaques partagent la même
          ligne de base ET le même sommet. C'est la condition pour que leurs
          trois ombres portées se lisent comme une seule élévation. */}
      <div className="flex h-[92px] items-stretch gap-3">
        {left}
        {center}
        {right}
      </div>
    </div>
  )
}
