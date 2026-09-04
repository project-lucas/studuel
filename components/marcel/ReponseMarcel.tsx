import { lireFiche } from '@/lib/coach/fiche'

// CE QUE MARCEL RÉPOND, MIS EN PAGE.
//
// Une réponse ordinaire est un paragraphe : on l'affiche tel quel. Une FICHE
// arrive structurée (un titre, des sections, des puces) et doit se survoler —
// c'est même la seule raison d'en demander une. Affichée en texte brut, elle
// montrait ses dièses et ses tirets : l'élève voyait la plomberie.
//
// La mise en forme est faite par un module pur et testé (lib/coach/fiche), et
// rien n'est interprété comme du HTML : on rend des blocs typés, peints ici.
// Aucun moteur markdown embarqué pour trois formes.

export default function ReponseMarcel({ texte }: { texte: string }) {
  const blocs = lireFiche(texte)

  return (
    <div className="space-y-1.5">
      {blocs.map((bloc, index) => {
        const cle = `${index}-${bloc.texte.slice(0, 24)}`

        if (bloc.type === 'titre') {
          return (
            <p
              key={cle}
              className="font-heading text-[15px] leading-tight font-extrabold"
            >
              {bloc.texte}
            </p>
          )
        }
        if (bloc.type === 'section') {
          return (
            <p
              key={cle}
              className="outil-encre mt-2 text-[11px] font-extrabold tracking-wide uppercase"
            >
              {bloc.texte}
            </p>
          )
        }
        if (bloc.type === 'puce') {
          return (
            <p key={cle} className="flex gap-1.5 text-[13.5px] leading-snug font-semibold">
              {/* Une puce dessinée, pas le tiret du modèle : elle s'aligne, et
                  le texte qui passe à la ligne reste en retrait. */}
              <span aria-hidden="true" className="outil-encre mt-1.5 shrink-0">
                ▪
              </span>
              <span>{bloc.texte}</span>
            </p>
          )
        }
        return (
          <p key={cle} className="text-[13.5px] leading-relaxed font-semibold">
            {bloc.texte}
          </p>
        )
      })}
    </div>
  )
}
