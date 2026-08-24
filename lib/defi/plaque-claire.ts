// LE FOND DES DEUX FLANCS de la barre d'action — logique pure.
//
// CE QUI A ÉTÉ ESSAYÉ, ET POURQUOI ON EN EST LÀ.
//
// Les plaques ont d'abord été VIOLET PROFOND, comme le décor : les
// illustrations, toutes peintes pour un fond clair, s'y noyaient. Elles ont
// alors reçu un médaillon crème — mais l'œil comptait trois épaisseurs (cadre,
// disque, dessin) et le disque volait la moitié de la plaque au dessin.
//
// La plaque est donc passée au CLAIR, d'un seul ton. Restait un défaut : trois
// objets clairs de rang égal, et le bouton doré perdait son autorité. On a
// voulu la lui rendre en ASSOMBRISSANT les flancs d'un cran. C'était le
// mauvais levier, et la mesure le dit :
//
//   crème de la charte  45°  12 % de saturation  98 % de clarté
//   après assombrissement 44°  13 %                82 %   ← kaki
//   or du bouton DUEL   39°  84 %                92 %
//
// Baisser la clarté d'une couleur PEU SATURÉE ne la rend pas « plus profonde »,
// elle la salit : on obtient du kaki, qui n'existe nulle part dans la charte.
// Et les trois plaques partageaient la même TEINTE (39-47°) : la rangée entière
// était jaune, seule la saturation les distinguait.
//
// LE BON LEVIER EST LA TEINTE, PAS LA CLARTÉ. Les flancs prennent une pierre
// VIOLETTE très claire — le violet de marque délavé de blanc. Elle est à 226°
// de l'or : le contraste ne repose plus sur une nuance de jaune mais sur une
// opposition franche, chaud contre froid, exactement la structure de Clash
// Royale (plaques de pierre froide, bouton doré chaud). Elle reste assez claire
// (89-97 %) pour que les illustrations gardent le fond pour lequel elles ont
// été peintes, et assez peu saturée (5-12 %) pour ne jamais rivaliser avec les
// 84 % de l'or.
//
// LA COULEUR EST DÉRIVÉE DU TOKEN, jamais écrite en dur : si le violet de
// marque change, les flancs suivent. C'est la règle de la charte, et c'est ici
// la seule façon de garantir que la pierre reste parente du décor.

/** Part de blanc mêlée au violet de marque, en HAUT de la plaque. */
export const PLAQUE_BLANC_HAUT = 88

/**
 * Part de blanc en BAS. L'écart avec le haut fait tout le relief : c'est lui
 * que le biseau de `.arena-plate` vient souligner. Trop faible, la plaque
 * s'aplatit ; trop fort, elle se creuse et le dessin a l'air d'y tomber.
 */
export const PLAQUE_BLANC_BAS = 72

/**
 * Le dégradé de fond d'une plaque claire, prêt pour `style={{ background }}`.
 *
 * `color-mix` en oklch et non en sRGB : délaver en sRGB déplace la teinte
 * (le violet vire au bleu lavande), là où l'oklch ne touche qu'à la clarté et
 * au chroma perçus. C'est déjà la façon dont l'app fabrique le socle de ses
 * boutons.
 */
export function plaqueClaire(): string {
  return [
    'linear-gradient(180deg,',
    `color-mix(in oklch, var(--primary), white ${PLAQUE_BLANC_HAUT}%) 0%,`,
    `color-mix(in oklch, var(--primary), white ${PLAQUE_BLANC_BAS}%) 100%)`,
  ].join(' ')
}
