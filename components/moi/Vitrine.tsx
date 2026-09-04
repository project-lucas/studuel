import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import CouronneArt from '@/components/moi/CouronneArt'
import {
  chapitresPourTier,
  phraseProchaineCouronne,
  type BilanCouronnes,
  type Couronne,
} from '@/lib/moi/couronnes'
import { cn } from '@/lib/utils'

// -----------------------------------------------------------------------------
// LA VITRINE DES COURONNES — une médaille par matière.
//
// L'étagère d'avant alignait des couronnes de 20 px dans la bannière, avec le
// détail replié derrière un ⋮. Ici chaque matière a sa médaille en relief :
// gagnée (le métal), à venir (un anneau de progression avec le compte des
// chapitres), ou vide (un disque en pointillé — la case existe, c'est une
// information que l'élève a le droit d'avoir sous les yeux).
//
// LA PROCHAINE EST NOMMÉE ET MENÉE. `bilanCouronnes` désigne la matière la plus
// proche de son prochain métal : elle porte son anneau, et la ligne d'action
// sous la grille dit ce qu'il reste (« 2 chapitres de maths → bronze ») avec un
// bouton qui ouvre le dossier. Une vitrine qui ne mène nulle part est un
// musée ; celle-ci est une liste de courses.
// -----------------------------------------------------------------------------

function Medaille({ c, prochaine }: { c: Couronne; prochaine: boolean }) {
  const gagnee = c.tier !== 'aucune'
  // L'anneau de la prochaine : ce qu'il reste vers le prochain métal, sur le
  // nombre de chapitres qu'il coûte au total.
  const objectif = c.prochain ? chapitresPourTier(c.prochain.tier, c.total) : c.total
  const part = objectif > 0 ? Math.min(1, c.acquis / objectif) : 0
  return (
    <li className="flex flex-col items-center gap-1.5 text-center">
      <span
        className={cn(
          'relative flex size-[54px] items-center justify-center rounded-full',
          gagnee && !prochaine && `moi-medaille moi-medaille--${c.tier}`,
          prochaine && 'moi-medaille--prochaine',
          !gagnee && !prochaine && 'border-2 border-dashed border-border bg-transparent',
        )}
        style={prochaine ? { ['--part' as string]: `${Math.round(part * 100)}%` } : undefined}
        aria-hidden="true"
      >
        {prochaine ? (
          <span className="font-heading absolute inset-[5px] flex items-center justify-center rounded-full bg-card text-[12px] font-extrabold text-foreground tabular-nums">
            {c.acquis}/{objectif}
          </span>
        ) : (
          <CouronneArt tier={c.tier} className={cn('w-6', !gagnee && 'opacity-40')} />
        )}
      </span>
      <span
        className={cn(
          'w-full truncate text-[10.5px] font-extrabold',
          gagnee || prochaine ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        {c.subjectName}
      </span>
    </li>
  )
}

export default function Vitrine({
  liste,
  bilan,
}: {
  liste: readonly Couronne[]
  bilan: BilanCouronnes
}) {
  if (liste.length === 0) return null
  const prochaine = bilan.prochaine
  const phrase = phraseProchaineCouronne(prochaine)
  const sousTitre =
    bilan.gagnees === 0
      ? 'Aucune encore — la première est la plus proche'
      : `${bilan.gagnees} obtenue${bilan.gagnees > 1 ? 's' : ''} sur ${bilan.matieres}`

  return (
    <section aria-label="Tes couronnes" className="moi-bloc rounded-[22px] p-4">
      <h2 className="font-heading text-base leading-tight font-extrabold">Tes couronnes</h2>
      <p className="moi-sourcil mt-0.5">{sousTitre}</p>
      <ul role="list" className="mt-3 grid grid-cols-4 gap-x-2 gap-y-3">
        {liste.map((c) => (
          <Medaille key={c.subjectId} c={c} prochaine={prochaine?.subjectId === c.subjectId} />
        ))}
      </ul>
      {prochaine && phrase ? (
        <Link
          href={`/reviser/${prochaine.subjectSlug}`}
          className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-secondary px-3 py-2.5 text-[12.5px] font-extrabold text-foreground transition active:scale-[0.99]"
        >
          <span className="min-w-0 truncate">{phrase}</span>
          <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-primary px-3 py-1.5 text-[12px] text-primary-foreground shadow-[0_3px_0_color-mix(in_oklch,var(--primary),black_25%)]">
            Réviser
            <ChevronRight className="size-3.5" strokeWidth={3} aria-hidden="true" />
          </span>
        </Link>
      ) : null}
    </section>
  )
}
