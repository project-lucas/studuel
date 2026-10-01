import katex from 'katex'
import { lireTexte } from '@/lib/annales-corrigees/texte'

/**
 * Le texte courant d'un corrigé : gras, italique, code et formules KaTeX.
 *
 * Composant SERVEUR : KaTeX tourne à la génération de la page et n'entre
 * jamais dans le paquet du navigateur — l'élève ne reçoit que du HTML et la
 * feuille de style de KaTeX. Le contenu est le nôtre (contenu/annales, relu par
 * le validateur) : `dangerouslySetInnerHTML` n'y reçoit que la sortie de KaTeX,
 * jamais un texte brut.
 */
export function formuleHtml(tex: string, display = false): string {
  return katex.renderToString(tex, {
    displayMode: display,
    throwOnError: false,
    strict: 'ignore',
    output: 'html',
  })
}

export default function TexteCorrige({ texte }: { texte: string }) {
  return (
    <>
      {lireTexte(texte).map((s, i) => {
        if (s.type === 'formule') {
          return <span key={i} dangerouslySetInnerHTML={{ __html: formuleHtml(s.valeur) }} />
        }
        if (s.type === 'code') {
          return (
            <code key={i} className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-[0.9em] text-primary">
              {s.valeur}
            </code>
          )
        }
        let n: React.ReactNode = s.valeur
        if (s.italique) n = <em>{n}</em>
        if (s.gras) n = <strong className="font-extrabold">{n}</strong>
        return <span key={i}>{n}</span>
      })}
    </>
  )
}
