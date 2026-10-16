// LA TÊTE DU BUREAU SE REPLIE (16/10/2026, Lucas : « observe la partie du haut
// et du bas… cela manque d'ergonomie »). Le décor peint fait 240 px : sur un
// téléphone, il laissait moins de 330 px aux panneaux. Dès qu'on fait défiler
// un panneau, ou qu'une conversation s'ouvre, la tête se replie en une bande
// (le décor, le retour, l'historique) et rend ~170 px au contenu ; elle revient
// quand on remonte en haut.
//
// Deux sources peuvent la replier (le défilement d'un panneau, le fil d'une
// conversation) : la classe `marcel-replie` sur <html> reste tant que l'une
// d'elles le demande. Le style vit dans EnTeteBureau (`[html.marcel-replie_&]`).

const CLASSE = 'marcel-replie'
const sources = new Set<string>()

export function replier(source: string, oui: boolean): void {
  if (typeof document === 'undefined') return
  if (oui) sources.add(source)
  else sources.delete(source)
  document.documentElement.classList.toggle(CLASSE, sources.size > 0)
}

/**
 * Le verdict du défilement, avec une hystérésis : on ne replie que si le
 * contenu dépasse assez pour RESTER défilable une fois la tête repliée (sinon
 * le navigateur ramènerait le défilement à zéro, la tête reviendrait, et ainsi
 * de suite), et on ne déplie qu'en haut de la liste.
 */
export function verdictDefilement(
  replie: boolean,
  m: { haut: number; depassement: number },
  gainTete: number,
): boolean {
  if (!replie) return m.haut > 24 && m.depassement > gainTete + 48
  return m.haut > 4
}
