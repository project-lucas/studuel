// -----------------------------------------------------------------------------
// LA TYPOGRAPHIE FRANÇAISE D'UN TEXTE VENU DE LA BASE.
//
// Les cours sont écrits avec des espaces ordinaires avant « : ; ! ? » et à
// l'intérieur des guillemets. Sur un téléphone, le navigateur coupe alors la
// ligne juste avant la ponctuation : « Épicure, Épictète, Diogène / : les
// écoles de sagesse » (capture du 29/09/2026). L'espace insécable interdit
// cette coupure. Espace insécable ordinaire (U+00A0) et non fine (U+202F) :
// c'est celle que l'app emploie déjà (lib/ligue.ts), et toutes les polices
// l'ont.
// -----------------------------------------------------------------------------

const NB = ' '

export function typographie(texte: string): string {
  return texte
    .replace(/ ([:;!?»])/g, `${NB}$1`)
    .replace(/« /g, `«${NB}`)
}
