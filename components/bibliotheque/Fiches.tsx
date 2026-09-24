'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, FileText, Sparkles } from 'lucide-react'
import SubjectIcon from '@/components/SubjectIcon'
import IconeRayon from '@/components/bibliotheque/IconesRayons'
import PucesFiltre from '@/components/bibliotheque/PucesFiltre'
import { Invitation, LienSuite } from '@/components/bibliotheque/Invitation'
import { fichesParMatiere, matieresDesFiches, type FicheAchetee } from '@/lib/bibliotheque'
import { sfx } from '@/lib/sounds'
import { subjectVignette } from '@/lib/subject-style'
import { cn } from '@/lib/utils'

// -----------------------------------------------------------------------------
// LES FICHES DE RÉVISION ACHETÉES — un chapitre débloqué en gemmes (183) : sa
// Fiche s'ouvre d'ici, sans refaire le chemin matière → chapitre. Une fiche
// porte l'identité de sa MATIÈRE (sa vignette, jamais un fond coloré : la règle
// du 23/09/2026), le titre de son chapitre et, dessous, sa matière ou le
// chapitre du programme qui la range.
// -----------------------------------------------------------------------------

/** La vignette de la matière sur sa plaque blanche (le médaillon, en petit). */
function Vignette({ slug, className }: { slug: string; className?: string }) {
  const vignette = subjectVignette(slug)
  return vignette ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={vignette}
      alt=""
      aria-hidden="true"
      width={320}
      height={320}
      loading="lazy"
      className={cn('object-contain', className)}
    />
  ) : (
    <SubjectIcon slug={slug} className="size-7 text-primary" strokeWidth={2.25} aria-hidden="true" />
  )
}

/** Une fiche dans le rayon Fiches : une ligne, sous le titre de sa matière. */
function LigneFiche({ fiche }: { fiche: FicheAchetee }) {
  return (
    <li>
      <Link
        href={fiche.href}
        onClick={() => sfx.tap()}
        className="carte flex items-center gap-3 p-2.5 transition active:scale-[0.99]"
      >
        {/* Le dessin de l'onglet Fiches, celui de la tuile « Fiche » du chapitre. */}
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary">
          <IconeRayon rayon="fiches" className="size-8" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="font-heading line-clamp-2 text-sm leading-tight font-extrabold">{fiche.titre}</span>
          <span className="block truncate text-[11px] font-semibold text-muted-foreground">
            {fiche.theme ?? 'Fiche de révision'}
          </span>
        </span>
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      </Link>
    </li>
  )
}

/**
 * Le rayon vide. Un abonné n'a rien à acheter : ses fiches sont toutes
 * ouvertes, dans chaque chapitre — on le lui dit au lieu de l'inviter à payer.
 */
function InvitationFiches({ premium }: { premium: boolean }) {
  return premium ? (
    <Invitation
      href="/reviser"
      icone={FileText}
      titre="Toutes tes fiches sont ouvertes"
      texte="Avec Studuel+, chaque chapitre te donne sa fiche : touche « Fiche » dans Réviser."
    />
  ) : (
    <Invitation
      href="/reviser"
      icone={Sparkles}
      titre="Débloque ta première fiche"
      texte="Dans un chapitre de Réviser, touche « Fiche » : elle est à toi pour toujours, et elle se range ici."
    />
  )
}

/** Le rayon Fiches : une puce par matière, puis les fiches rangées par matière. */
export function RayonFiches({ fiches, premium }: { fiches: FicheAchetee[]; premium: boolean }) {
  const [matiere, setMatiere] = useState<string | null>(null)

  if (fiches.length === 0) return <InvitationFiches premium={premium} />

  const groupes = fichesParMatiere(fiches, matiere)
  return (
    <div className="flex flex-col gap-4">
      <PucesFiltre
        label="Matière"
        tout="Toutes"
        puces={matieresDesFiches(fiches)}
        actif={matiere}
        onChange={setMatiere}
      />
      {groupes.map((g) => (
        <section key={g.matiere.slug} aria-labelledby={`fiches-${g.matiere.slug}`}>
          <div className="mb-2 flex items-center gap-2.5 px-1">
            <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl border bg-card shadow-sm">
              <Vignette slug={g.matiere.slug} className="size-7" />
            </span>
            <h2 id={`fiches-${g.matiere.slug}`} className="titre-section min-w-0 flex-1 truncate">
              {g.matiere.nom} <span className="text-muted-foreground tabular-nums">· {g.fiches.length}</span>
            </h2>
          </div>
          <ul className="flex flex-col gap-2">
            {g.fiches.map((f) => (
              <LigneFiche key={f.chapitreId} fiche={f} />
            ))}
          </ul>
        </section>
      ))}
      {premium ? null : <LienSuite href="/reviser">Débloquer une autre fiche</LienSuite>}
    </div>
  )
}
