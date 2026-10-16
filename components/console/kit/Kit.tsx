import Link from 'next/link'
import { cn } from '@/lib/utils'

/** Une tuile de chiffre : le nombre en grand, son libellé, un sous-texte ou une variation. */
export function Tuile({
  libelle,
  valeur,
  sous,
  variation,
  ton,
}: {
  libelle: string
  valeur: string
  sous?: string
  /** « +12 % », « −8 % », « nouveau »… */
  variation?: string | null
  ton?: 'bon' | 'alerte' | null
}) {
  return (
    <div className="carte p-4">
      <p className="text-[11px] font-extrabold tracking-wide text-muted-foreground uppercase">{libelle}</p>
      <p className="font-heading mt-1 text-3xl leading-none font-extrabold tabular-nums">{valeur}</p>
      <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        {variation ? (
          <span className={cn('rounded-full px-1.5 py-0.5 font-bold', ton === 'bon' ? 'bg-(--success)/15 text-(--success)' : ton === 'alerte' ? 'bg-(--destructive)/10 text-(--destructive)' : 'bg-secondary')}>
            {variation}
          </span>
        ) : null}
        {sous}
      </p>
    </div>
  )
}

/** Une section de tableau de bord : un titre, une phrase, le contenu. */
export function Bloc({
  titre,
  aide,
  action,
  children,
  className,
}: {
  titre: string
  aide?: string
  action?: { href: string; libelle: string }
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn('carte p-5', className)}>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="titre-section">{titre}</h2>
          {aide ? <p className="mt-0.5 text-xs font-semibold text-muted-foreground">{aide}</p> : null}
        </div>
        {action ? (
          <Link href={action.href} className="shrink-0 text-xs font-bold text-primary hover:underline">
            {action.libelle} →
          </Link>
        ) : null}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export type LigneBarre = { cle: string; libelle: string; valeur: number; affiche?: string; sous?: string; note?: React.ReactNode }

/**
 * Un classement en barres horizontales (une seule teinte) : le libellé, la
 * barre proportionnelle au plus grand, la valeur écrite à droite. Le texte
 * reste à l'encre, jamais à la couleur de la barre.
 */
export function Barres({ lignes, vide = 'Rien sur la période.', max: maxImpose }: { lignes: LigneBarre[]; vide?: string; max?: number }) {
  if (lignes.length === 0) return <p className="text-sm font-semibold text-muted-foreground">{vide}</p>
  const max = Math.max(1, maxImpose ?? 0, ...lignes.map((l) => l.valeur))
  return (
    <ul className="flex flex-col gap-2.5">
      {lignes.map((l) => (
        <li key={l.cle} title={l.sous}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0 truncate font-bold">{l.libelle}</span>
            <span className="shrink-0 font-heading font-extrabold tabular-nums">
              {l.affiche ?? l.valeur.toLocaleString('fr-FR')}
              {l.note ? <span className="ml-1.5 text-xs font-semibold">{l.note}</span> : null}
            </span>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(l.valeur > 0 ? 2 : 0, (l.valeur / max) * 100)}%` }} />
          </div>
          {l.sous ? <p className="mt-0.5 text-[11px] font-semibold text-muted-foreground">{l.sous}</p> : null}
        </li>
      ))}
    </ul>
  )
}

/** Le choix de la période (?j=), en pastilles. */
export function Periode({ chemin, jours, choix = [7, 30, 90, 365] }: { chemin: string; jours: number; choix?: number[] }) {
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label="Période">
      {choix.map((j) => (
        <Link
          key={j}
          href={`${chemin}?j=${j}`}
          aria-current={j === jours ? 'true' : undefined}
          className={cn('h-9 rounded-full px-3.5 text-sm leading-9 font-bold', j === jours ? 'bg-primary text-primary-foreground' : 'bg-card ring-1 ring-primary/15 hover:bg-secondary')}
        >
          {j === 365 ? '1 an' : `${j} jours`}
        </Link>
      ))}
    </div>
  )
}

export function MigrationAbsente({ fichier, quoi }: { fichier: string; quoi: string }) {
  return (
    <div className="carte p-6">
      <h1 className="titre-section">{quoi} n’est pas encore prêt</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        La migration <code>{fichier}</code> n’est pas exécutée en base.
      </p>
    </div>
  )
}
