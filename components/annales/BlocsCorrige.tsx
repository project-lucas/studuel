import { CircleCheck, Lightbulb, Target, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Bloc } from '@/lib/annales-corrigees/types'
import TexteCorrige, { formuleHtml } from '@/components/annales/TexteCorrige'

/**
 * Le corrigé, bloc par bloc (composant SERVEUR, cf. TexteCorrige).
 *
 * LES ENCADRÉS PARLENT LES RÔLES DE LA DA, pas des couleurs inventées :
 *  · « Le conseil Studuel » — lavande (`secondary`), l'icône violette : c'est
 *    de la méthode, la voix de l'app ;
 *  · « Le piège » — corail (`destructive`) : une alerte ;
 *  · « Ce que le correcteur attend » — jaune pâle (`accent`) : ce sont des
 *    POINTS, et le jaune est la couleur du gain ;
 *  · la réponse — cerclée de violet, sur la carte blanche.
 */
export default function BlocsCorrige({ blocs }: { blocs: readonly Bloc[] }) {
  return (
    <div className="flex flex-col gap-3.5">
      {blocs.map((b, i) => (
        <BlocCorrige key={i} bloc={b} />
      ))}
    </div>
  )
}

function Encadre({
  icone,
  titre,
  className,
  children,
}: {
  icone: ReactNode
  titre: string
  className: string
  children: ReactNode
}) {
  return (
    <aside className={`rounded-2xl px-4 py-3 ${className}`}>
      <p className="mb-1 flex items-center gap-1.5 text-[11px] font-extrabold tracking-wide uppercase">
        {icone}
        {titre}
      </p>
      <p className="text-[14.5px] leading-relaxed text-foreground">{children}</p>
    </aside>
  )
}

function BlocCorrige({ bloc }: { bloc: Bloc }) {
  switch (bloc.type) {
    case 'titre':
      return (
        <h3 className="font-heading mt-3 text-lg leading-snug font-extrabold text-foreground first:mt-0">
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
        <Liste
          className={`flex flex-col gap-1.5 pl-5 text-[15px] leading-relaxed text-foreground/90 ${
            bloc.ordonnee ? 'list-decimal marker:font-extrabold marker:text-primary' : 'list-disc marker:text-primary'
          }`}
        >
          {bloc.items.map((it, i) => (
            <li key={i} className="pl-1">
              <TexteCorrige texte={it} />
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
          // tient le plus souvent en 390 px.
          className="-mx-1 overflow-x-auto overflow-y-hidden px-1 py-0.5 text-[0.9em] text-foreground [&_.katex-display]:my-1.5"
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
        <div className="-mx-1 overflow-x-auto px-1">
          <table className="w-full border-separate border-spacing-0 overflow-hidden rounded-xl border text-left text-[13.5px]">
            <thead className="bg-secondary text-primary">
              <tr>
                {bloc.entetes.map((e, i) => (
                  <th key={i} className="px-3 py-2 font-extrabold">
                    <TexteCorrige texte={e} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-card">
              {bloc.lignes.map((l, i) => (
                <tr key={i}>
                  {l.map((c, j) => (
                    <td key={j} className="border-t px-3 py-2 align-top">
                      {c ? <TexteCorrige texte={c} /> : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'citation':
      return (
        <blockquote className="border-l-4 border-primary/35 py-0.5 pl-4">
          <p className="font-serif text-[15px] leading-relaxed text-foreground/90 italic">
            <TexteCorrige texte={bloc.texte} />
          </p>
          {bloc.source ? (
            <footer className="mt-1 text-xs font-bold text-muted-foreground">— {bloc.source}</footer>
          ) : null}
        </blockquote>
      )
    case 'astuce':
      return (
        <Encadre
          icone={<Lightbulb className="size-3.5" aria-hidden="true" />}
          titre="Le conseil Studuel"
          className="bg-secondary text-primary"
        >
          <TexteCorrige texte={bloc.texte} />
        </Encadre>
      )
    case 'piege':
      return (
        <Encadre
          icone={<TriangleAlert className="size-3.5" aria-hidden="true" />}
          titre="Le piège"
          className="bg-destructive/10 text-destructive"
        >
          <TexteCorrige texte={bloc.texte} />
        </Encadre>
      )
    case 'attendu':
      return (
        <Encadre
          icone={<Target className="size-3.5" aria-hidden="true" />}
          titre="Ce que le correcteur attend"
          className="bg-accent text-[color-mix(in_oklch,var(--highlight),black_45%)]"
        >
          <TexteCorrige texte={bloc.texte} />
        </Encadre>
      )
    case 'reponse':
      return (
        <div className="flex gap-2.5 rounded-2xl border-2 border-primary/30 bg-card px-4 py-3">
          <CircleCheck className="mt-0.5 size-4.5 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-[15px] leading-relaxed font-semibold text-foreground">
            <TexteCorrige texte={bloc.texte} />
          </p>
        </div>
      )
    case 'question':
      return (
        <section className="carte mt-1 overflow-hidden">
          <header className="flex items-start gap-3 border-b bg-secondary/40 px-4 py-3">
            <span className="font-heading flex h-7 min-w-7 shrink-0 items-center justify-center rounded-full bg-primary px-2 text-sm font-extrabold text-primary-foreground">
              {bloc.numero}
            </span>
            <p className="min-w-0 flex-1 pt-0.5 text-[14.5px] leading-snug font-bold text-foreground">
              <TexteCorrige texte={bloc.intitule} />
            </p>
            {bloc.points ? (
              <span className="shrink-0 pt-1 text-[11px] font-extrabold text-muted-foreground">
                {String(bloc.points).replace('.', ',')} pt{bloc.points > 1 ? 's' : ''}
              </span>
            ) : null}
          </header>
          <div className="px-4 py-3.5">
            <BlocsCorrige blocs={bloc.blocs} />
          </div>
        </section>
      )
  }
}
