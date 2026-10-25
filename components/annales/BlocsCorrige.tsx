import { Check, Lightbulb, Star, X } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Bloc } from '@/lib/annales-corrigees/types'
import TexteCorrige, { formuleHtml } from '@/components/annales/TexteCorrige'

/**
 * Le corrigé, bloc par bloc (composant SERVEUR, cf. TexteCorrige), DANS LA
 * ROBE DES FICHES DE RÉVISION (corrige.css, 25/10/2026) :
 *  · un intertitre est un RUBAN penché (violet, cerné d'encre) ;
 *  · une question est une CARTE cernée d'encre sur son socle, le numéro en
 *    pastille violette ;
 *  · « Le conseil Studuel » est un POST-IT lavande scotché — la voix de l'app ;
 *  · « Le piège » une carte corail, la croix en pastille — une alerte ;
 *  · « Ce que le correcteur attend » une carte jaune, étoile au ruban — ce
 *    sont des POINTS, et le jaune est la couleur du gain ;
 *  · la réponse à retenir : cerclée d'un pointillé violet, la coche verte.
 * Les rôles de la DA, pas des couleurs inventées.
 */
export default function BlocsCorrige({ blocs, feuille = false }: { blocs: readonly Bloc[]; feuille?: boolean }) {
  if (!feuille) {
    return (
      <div className="flex flex-col gap-3.5">
        {blocs.map((b, i) => (
          <BlocCorrige key={i} bloc={b} />
        ))}
      </div>
    )
  }
  // AU NIVEAU DE LA PARTIE, le texte libre (analyse, plan, parties rédigées)
  // se pose sur une FEUILLE blanche cernée d'encre plutôt qu'à même le mur
  // quadrillé — c'est la page de la fiche ; chaque question garde sa carte.
  // Une suite de blocs sans question = une feuille.
  const groupes: { cle: number; blocs: Bloc[] }[] = []
  blocs.forEach((b, i) => {
    const dernier = groupes.at(-1)
    if (b.type === 'question') groupes.push({ cle: i, blocs: [b] })
    else if (dernier && dernier.blocs[0]?.type !== 'question') dernier.blocs.push(b)
    else groupes.push({ cle: i, blocs: [b] })
  })
  return (
    <div className="flex flex-col gap-4">
      {groupes.map((g) =>
        g.blocs[0]?.type === 'question' ? (
          <BlocCorrige key={g.cle} bloc={g.blocs[0]} />
        ) : (
          <div key={g.cle} className="corrige-carte px-3.5 py-4">
            <BlocsCorrige blocs={g.blocs} />
          </div>
        ),
      )}
    </div>
  )
}

/** Une carte coiffée d'un ruban dans son coin : piège, attendu. */
function CarteRubanee({
  teinte,
  ruban,
  icone,
  children,
}: {
  teinte: 'jaune' | 'corail' | 'vert' | 'lavande'
  ruban: string
  icone?: ReactNode
  children: ReactNode
}) {
  return (
    <aside className="corrige-carte corrige-carte--rubanee px-3.5 pb-3" data-teinte={teinte}>
      <span className="corrige-ruban corrige-ruban--coin" data-teinte={teinte}>
        {ruban}
      </span>
      <div className="flex items-start gap-2.5">
        {icone}
        <p className="min-w-0 flex-1 text-[14.5px] leading-relaxed text-foreground">{children}</p>
      </div>
    </aside>
  )
}

function BlocCorrige({ bloc }: { bloc: Bloc }) {
  switch (bloc.type) {
    case 'titre':
      return (
        <h3 className="corrige-ruban corrige-ruban--fil self-start">
          <TexteCorrige texte={bloc.texte} />
        </h3>
      )
    case 'texte':
      return (
        <p className="text-[15px] leading-relaxed text-foreground/90">
          <TexteCorrige texte={bloc.texte} />
        </p>
      )
    case 'liste': {
      const Liste = bloc.ordonnee ? 'ol' : 'ul'
      return (
        <Liste className={`corrige-liste text-[14.5px] leading-relaxed text-foreground/90 ${bloc.ordonnee ? 'corrige-liste--ordonnee' : ''}`}>
          {bloc.items.map((it, i) => (
            <li key={i}>
              <span>
                <TexteCorrige texte={it} />
              </span>
            </li>
          ))}
        </Liste>
      )
    }
    case 'formule':
      return (
        <div
          // Une équation longue défile de côté plutôt que d'être coupée par la
          // carte ; un cran plus petite que le KaTeX par défaut (1,21 em), elle
          // tient le plus souvent en 390 px. Sur une plaque lavande : c'est
          // l'« égalité » encadrée d'une fiche de maths.
          className="overflow-x-auto overflow-y-hidden rounded-xl bg-secondary/60 px-3 py-1.5 text-[0.92em] text-foreground [&_.katex-display]:my-1.5"
          dangerouslySetInnerHTML={{ __html: formuleHtml(bloc.tex, true) }}
        />
      )
    case 'code':
      return (
        <pre className="carte-sombre overflow-x-auto rounded-2xl p-3.5 font-mono text-[12.5px] leading-relaxed">
          <code>{bloc.code}</code>
        </pre>
      )
    case 'tableau':
      return (
        <div className="corrige-carte overflow-hidden">
          <div className="overflow-x-auto">
            <table className="corrige-tableau">
              <thead>
                <tr>
                  {bloc.entetes.map((e, i) => (
                    <th key={i}>
                      <TexteCorrige texte={e} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bloc.lignes.map((l, i) => (
                  <tr key={i}>
                    {l.map((c, j) => (
                      <td key={j}>{c ? <TexteCorrige texte={c} /> : null}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    case 'citation':
      return (
        <blockquote className="corrige-citation">
          <TexteCorrige texte={bloc.texte} />
          {bloc.source ? (
            <footer className="mt-1.5 font-sans text-xs font-extrabold text-muted-foreground">— {bloc.source}</footer>
          ) : null}
        </blockquote>
      )
    case 'astuce':
      return (
        <aside className="corrige-postit">
          <h4 className="flex items-center gap-1.5">
            <Lightbulb className="size-4.5 shrink-0" strokeWidth={2.4} aria-hidden="true" />
            Le conseil Studuel
          </h4>
          <p className="mt-2 text-[14.5px] leading-relaxed text-foreground">
            <TexteCorrige texte={bloc.texte} />
          </p>
        </aside>
      )
    case 'piege':
      return (
        <CarteRubanee
          teinte="corail"
          ruban="Le piège"
          icone={
            <span className="corrige-croix mt-0.5" aria-hidden="true">
              <X className="size-3.5" strokeWidth={3.2} />
            </span>
          }
        >
          <TexteCorrige texte={bloc.texte} />
        </CarteRubanee>
      )
    case 'attendu':
      return (
        <CarteRubanee
          teinte="jaune"
          ruban="★ Ce que le correcteur attend"
          icone={<Star className="mt-1 size-4 shrink-0 fill-highlight text-foreground" strokeWidth={2.2} aria-hidden="true" />}
        >
          <TexteCorrige texte={bloc.texte} />
        </CarteRubanee>
      )
    case 'reponse':
      return (
        <div className="corrige-reponse">
          <span className="corrige-pastille corrige-pastille--ok" aria-hidden="true">
            <Check className="size-4" strokeWidth={3.2} />
          </span>
          <p className="min-w-0 flex-1 pt-0.5 text-[15px] leading-relaxed font-semibold text-foreground">
            <TexteCorrige texte={bloc.texte} surligne />
          </p>
        </div>
      )
    case 'question':
      return (
        <section className="corrige-carte mt-1 px-3.5 py-3.5">
          <header className="flex items-start gap-3">
            <span className={`corrige-num mt-0.5 ${bloc.numero.length > 2 ? 'corrige-num--large' : ''}`}>{bloc.numero}</span>
            <p className="font-heading min-w-0 flex-1 pt-1 text-[15px] leading-snug font-extrabold text-foreground">
              <TexteCorrige texte={bloc.intitule} />
            </p>
            {bloc.points ? (
              <span className="shrink-0 rounded-full bg-secondary px-2 py-1 text-[11px] font-extrabold text-secondary-foreground">
                {String(bloc.points).replace('.', ',')} pt{bloc.points > 1 ? 's' : ''}
              </span>
            ) : null}
          </header>
          <div className="mt-3.5 border-t-2 border-dashed border-primary/20 pt-3.5">
            <BlocsCorrige blocs={bloc.blocs} />
          </div>
        </section>
      )
  }
}
