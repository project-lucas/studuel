// Navigation clavier d'un groupe d'onglets (motif ARIA « tabs ») — logique pure.
//
// Plusieurs écrans de l'app portent `role="tablist"` / `role="tab"` sans le
// clavier qui va avec. Or ces rôles sont une PROMESSE faite au lecteur d'écran :
// il annonce « onglet 2 sur 5 » et l'élève tente les flèches — qui ne font rien.
// Un motif à moitié posé est plus trompeur que pas de motif du tout.
//
// Le motif attendu : flèches gauche/droite pour changer d'onglet (avec
// bouclage), Origine/Fin pour aller aux extrémités.

// Index de l'onglet visé par une touche, ou `null` si la touche ne nous
// concerne pas (l'appelant laisse alors filer l'événement).
export function nextTabIndex(
  key: string,
  current: number,
  count: number,
): number | null {
  if (count <= 0) return null

  switch (key) {
    case 'ArrowRight':
    case 'ArrowDown':
      return (current + 1) % count
    case 'ArrowLeft':
    case 'ArrowUp':
      return (current - 1 + count) % count
    case 'Home':
      return 0
    case 'End':
      return count - 1
    default:
      return null
  }
}
