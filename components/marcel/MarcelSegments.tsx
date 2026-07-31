import Link from 'next/link'
import { cn } from '@/lib/utils'

// Le filtre des fonctions de Marcel. Il fait plusieurs métiers ; sans ce
// sélecteur l'onglet devient un rouleau infini, et un prof qui déroule tout d'un
// coup n'est pas un repère.
//
// Des LIENS, pas un état client : la vue vit dans l'URL (`?vue=methode`), donc
// elle se partage, revient avec le bouton retour, et la page reste un composant
// serveur — aucun JavaScript envoyé pour changer d'onglet.

export type MarcelVue = 'aujourdhui' | 'methode' | 'entrainement' | 'progres'

export const MARCEL_VUES: { key: MarcelVue; label: string }[] = [
  { key: 'aujourdhui', label: 'Aujourd’hui' },
  { key: 'methode', label: 'Méthode' },
  { key: 'entrainement', label: 'S’entraîner' },
  { key: 'progres', label: 'Progrès' },
]

/** Normalise le paramètre d'URL (valeur inconnue → l'accueil). */
export function parseVue(raw: string | undefined): MarcelVue {
  return MARCEL_VUES.some((v) => v.key === raw) ? (raw as MarcelVue) : 'aujourdhui'
}

export default function MarcelSegments({
  vue,
  matiere,
}: {
  vue: MarcelVue
  /** Matière courante, conservée d'un onglet à l'autre. */
  matiere?: string | null
}) {
  return (
    <nav aria-label="Les fonctions de Marcel" className="mb-3 flex gap-1.5">
      {MARCEL_VUES.map(({ key, label }) => {
        const active = key === vue
        const query = new URLSearchParams({ vue: key })
        if (matiere) query.set('matiere', matiere)

        return (
          <Link
            key={key}
            href={`/marcel?${query.toString()}`}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'font-heading flex min-h-11 flex-1 items-center justify-center rounded-xl px-3 text-[11.5px] font-extrabold transition-colors',
              active
                ? 'bg-primary text-primary-foreground shadow-[0_3px_0_color-mix(in_oklch,var(--primary),black_28%)]'
                : 'bg-foreground/6 text-muted-foreground hover:bg-foreground/10',
            )}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
