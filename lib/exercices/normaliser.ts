// -----------------------------------------------------------------------------
// LA NORMALISATION D'UNE RÉPONSE ÉCRITE — miroir EXACT de la fonction SQL
// `exercice_normaliser` (migration 372).
//
// Une réponse tapée (« la Loire », « LOIRE », « Loïre ») se compare APRÈS
// normalisation : minuscules, sans accents, sans ponctuation, espaces
// resserrés. Le serveur est seul juge (la clé ne quitte jamais la base) : si
// cette fonction et la sienne divergeaient, l'aperçu du contenu et la
// correction réelle ne diraient pas la même chose. Les deux sont écrites pas à
// pas, dans le même ordre, avec la même table de caractères — et
// lib/exercices/normaliser.test.ts épingle les cas qui ont fait diverger des
// implémentations « équivalentes » (majuscules accentuées, ligatures, tirets).
// -----------------------------------------------------------------------------

/** Les caractères accentués et leur lettre de base — la même table qu'en SQL. */
export const ACCENTS_DE = 'àáâãäåèéêëìíîïòóôõöùúûüýÿçñÀÁÂÃÄÅÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝŸÇÑ'
export const ACCENTS_VERS = 'aaaaaaeeeeiiiiooooouuuuyycnaaaaaaeeeeiiiiooooouuuuyycn'

const TABLE = new Map<string, string>(
  [...ACCENTS_DE].map((c, i) => [c, ACCENTS_VERS[i]] as const),
)

/**
 * « Là, c'est  l'ÉTÉ ! » → « la c est l ete ».
 *
 * Étapes (identiques en SQL) : ligatures, accents, minuscules, tout ce qui
 * n'est ni lettre ni chiffre devient espace, espaces resserrés, bords rognés.
 */
export function normaliser(s: string): string {
  const ligatures = s
    .replace(/œ/g, 'oe')
    .replace(/Œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .replace(/Æ/g, 'ae')
    .replace(/ß/g, 'ss')
  let sansAccents = ''
  for (const c of ligatures) sansAccents += TABLE.get(c) ?? c
  return sansAccents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/**
 * Lit un nombre tapé à la française : « 12,5 », « 1 200 », « -3 », « 3/4 ».
 * `null` si ce n'est pas un nombre.
 */
export function lireNombre(saisie: string): number | null {
  const s = saisie
    .trim()
    .replace(/\s/g, '')
    .replace(/−/g, '-')
    .replace(',', '.')
  if (s === '') return null
  const fraction = /^(-?\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)$/.exec(s)
  if (fraction) {
    const d = Number(fraction[2])
    if (d === 0) return null
    return Number(fraction[1]) / d
  }
  if (!/^-?\d+(?:\.\d+)?$/.test(s) && !/^-?\.\d+$/.test(s)) return null
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

/** « 12.5 » → « 12,5 » ; entiers sans décimale, pas plus de 4 décimales. */
export function formaterNombre(n: number): string {
  const arrondi = Math.round(n * 10_000) / 10_000
  const [entier, decimales] = String(Math.abs(arrondi)).split('.')
  // L'espace fine insécable des milliers (« 12 500 »), à partir de cinq
  // chiffres seulement : un nombre de quatre chiffres est souvent une année.
  const groupes =
    entier.length > 4 ? entier.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : entier
  return `${arrondi < 0 ? '−' : ''}${groupes}${decimales ? `,${decimales}` : ''}`
}
