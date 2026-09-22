import { segmenterInline } from '@/lib/lesson-markdown'

// Le texte d'un bloc de fiche : `**gras**` sur le terme à retenir, `*italique*`
// sur les titres d'œuvres et les mots latins. Rien d'autre — pas de markdown
// libre, pas de HTML : le corpus est écrit par nous, dans un sous-ensemble
// fermé (cf. docs/encyclopedie.md).
//
// La DÉCOUPE est celle de `lib/lesson-markdown`, déjà utilisée par les cours et
// déjà testée : deux moteurs d'italique dans la même app finiraient par ne plus
// se comporter pareil, et c'est exactement le genre d'écart qu'on ne voit
// jamais en relecture.
export default function TexteRiche({ texte }: { texte: string }) {
  return (
    <>
      {segmenterInline(texte).map((fragment, i) => {
        if (fragment.type === 'gras') {
          // Le TERME à retenir : pleine encre sur un corps plus clair. C'est le
          // contraste qui le désigne, pas une couleur de plus.
          return (
            <strong key={i} className="font-bold text-foreground">
              {fragment.valeur}
            </strong>
          )
        }
        if (fragment.type === 'italique') {
          return (
            <em key={i} className="text-foreground italic">
              {fragment.valeur}
            </em>
          )
        }
        return <span key={i}>{fragment.valeur}</span>
      })}
    </>
  )
}
