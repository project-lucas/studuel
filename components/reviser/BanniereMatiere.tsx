'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, Crown } from 'lucide-react'
import BackButton from '@/components/BackButton'
import SubjectIcon from '@/components/SubjectIcon'
import Attente from '@/components/reviser/Attente'
import MarcelTete from '@/components/reviser/MarcelTete'
import XpIcon from '@/components/ui/XpIcon'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { subjectVignette } from '@/lib/subject-style'
import { teinteMatiere } from '@/lib/reviser/teinte'
import type { Reprise } from '@/lib/reviser/programme'
import { minutesLabel, type SubjectProgress } from '@/lib/subject-template'
import s from './BanniereMatiere.module.css'

/** Au-delà, le nom ne tient plus sur une ligne à côté de l'objet. */
const NOM_COURT = 9
const NOM_MOYEN = 15

function tailleDuNom(nom: string): 'court' | 'moyen' | 'long' {
  if (nom.length <= NOM_COURT) return 'court'
  return nom.length <= NOM_MOYEN ? 'moyen' : 'long'
}

/**
 * LA BANNIÈRE DE LA MATIÈRE — l'en-tête de son dossier (05/10/2026).
 *
 * Elle remplace `SubjectHeader` (médaillon, titre, barre grise sur le mur
 * crème) : Lucas trouvait la zone « plate », et l'a voulue accueillante. Une
 * plaque à la teinte de la matière, son objet qui en sort, et tout ce qui se
 * lit d'un coup d'œil :
 *
 *   [retour] Nom de la matière                      (l'objet)
 *            Programme de 1re · Top 8 % des 1re
 *   [===== barre d'or : 3/19 fiches =====] [gardien] [Marcel]
 *   [ REPRENDRE · FICHE 4 · ~8 MIN                       (→) ]
 *   [ Titre de la fiche            ⚡ +110 XP à gagner       ]
 *
 * LE BOUTON MÈNE DROIT AU CONTENU : le cours de la fiche, ou son quiz si le
 * cours est lu (`ChapterRow.suite`). Il ouvrait la fiche dans la liste, d'où il
 * fallait encore attendre ses supports puis toucher « Cours ». C'est le seul
 * lien préchargé de la page — un seul, donc pas de rafale.
 *
 * Un seul H1 par page : c'est lui.
 */
export default function BanniereMatiere({
  subject,
  grade,
  rayon = null,
  unit,
  progress,
  jauge,
  standing = null,
  gardien = null,
  reprise,
}: {
  subject: { slug: string; name: string; color: string }
  grade: string
  /** Le rayon ouvert (« Géographie »), quand la matière en a plusieurs. */
  rayon?: string | null
  unit: 'chapitre' | 'fiche'
  progress: SubjectProgress
  /** Le remplissage de la barre (0 → 100), sur la courbe d'encouragement. */
  jauge: number
  /** La place de l'élève dans la matière (« Top 8 % des 3e »), s'il y en a une. */
  standing?: ReactNode
  /** L'écusson du gardien, déjà rendu (`GardienBadge`). */
  gardien?: ReactNode
  /** La fiche à reprendre ; `null` quand tout est terminé (ou qu'il n'y a rien). */
  reprise: Reprise | null
}) {
  const vignette = subjectVignette(subject.slug)
  const compte = `${progress.done}/${progress.total} ${unit}s`
  const termine = progress.total > 0 && progress.done >= progress.total

  return (
    <header className={s.banniere} data-teinte={teinteMatiere(subject.slug, subject.color)}>
      <span className={s.fond} aria-hidden="true" />
      {vignette ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={vignette}
          alt=""
          aria-hidden="true"
          width={320}
          height={320}
          // Le héros de l'écran : il est déjà en cache (c'est la vignette de la
          // carte de l'accueil), rien à différer.
          fetchPriority="high"
          className={s.heros}
        />
      ) : (
        <span className={s.herosIcone} aria-hidden="true">
          <SubjectIcon slug={subject.slug} className="size-9" strokeWidth={2.25} />
        </span>
      )}

      <div className={s.ligne1}>
        <BackButton
          fallback="/reviser"
          label="Retour aux matières"
          className={cn('relative', s.retour, s.cible)}
        />
        <h1 className={s.titre} data-taille={tailleDuNom(subject.name)}>
          {subject.name}
        </h1>
      </div>
      <div className={s.sous}>
        {rayon ?? 'Programme'} de {grade}
        {standing}
      </div>

      <div className={s.ligne3}>
        <div
          className={s.barre}
          role="progressbar"
          aria-label={`${rayon ?? subject.name} — ${progress.done} ${unit}s sur ${progress.total}, ${progress.pct}% travaillé`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress.pct}
        >
          <span className={s.plein} style={{ width: `${jauge}%` }} />
          <span className={s.compte}>{compte}</span>
        </div>
        {gardien ? <span className={s.tete}>{gardien}</span> : null}
        <MarcelTete matiere={subject.slug} />
      </div>

      {reprise ? (
        <Link
          href={reprise.fiche.suite?.href ?? reprise.fiche.href}
          onClick={() => sfx.tap()}
          className={s.cta}
        >
          <span className={s.ctaQuoi}>
            <span className={s.ctaSur}>
              {[
                reprise.libelle,
                reprise.rang !== null ? `Fiche ${reprise.rang}` : null,
                reprise.fiche.minutes !== null ? minutesLabel(reprise.fiche.minutes) : null,
              ]
                .filter(Boolean)
                .join(' · ')}
            </span>
            <span className={s.ctaTitre}>{reprise.fiche.title}</span>
            {reprise.fiche.xpRestant > 0 ? (
              <span className={s.gain}>
                <XpIcon className="size-3.5" />+{reprise.fiche.xpRestant} XP à gagner
              </span>
            ) : null}
          </span>
          <Attente className={s.fleche}>
            <ArrowRight className="size-6" strokeWidth={3} aria-hidden="true" />
          </Attente>
        </Link>
      ) : termine ? (
        <p className={cn(s.cta, s.fini)}>
          <Crown className="size-5 fill-highlight text-highlight" aria-hidden="true" />
          Programme terminé
        </p>
      ) : null}
    </header>
  )
}
