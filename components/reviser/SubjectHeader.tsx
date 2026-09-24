import EnTetePage from '@/components/reviser/EnTetePage'
import MedaillonMatiere from '@/components/reviser/MedaillonMatiere'
import type { SubjectProgress } from '@/lib/subject-template'

// Header de la page matière : retour, médaillon + nom (depuis la base), niveau,
// progression globale « X/Y fiches » + barre, l'écusson du gardien au bout de
// la ligne du titre, puis la rangée d'onglets.
//
// PLUS DE BANDEAU COLORÉ (audit du 23/09/2026) : l'aplat de la matière — bleu
// Maths, vert SVT, orange Histoire-Géo — prenait tout l'en-tête, et l'or ou le
// violet n'y avaient plus de place. L'identité de la matière tient désormais
// au MÉDAILLON ; le fond est le mur crème de toute l'app, et la recette de
// l'en-tête est celle de toutes les pages de Réviser (`EnTetePage`).
//
// Il portait aussi le solde de gemmes et la série : c'était un doublon du
// bandeau du haut, retiré le 2026-08-28. Un solde ne se dit qu'à un seul
// endroit.
export default function SubjectHeader({
  subject,
  grade,
  progress,
  standing = null,
  gardien = null,
  unit = 'chapitre',
  discipline = null,
  children,
}: {
  subject: { slug: string; name: string; color: string }
  grade: string
  progress: SubjectProgress
  /**
   * Place de l'élève dans cette matière parmi son niveau (« Top 8 % des 3e »).
   * `null` tant qu'il n'a pas passé assez de quiz pour être classé, ou que la
   * cohorte de la matière est trop petite pour qu'un pourcentage soit honnête.
   */
  standing?: React.ReactNode
  /**
   * L'écusson du gardien de la matière (anneau de traque), au bout de la ligne
   * du titre (Lucas, 17/09/2026 : « l'icône boss doit aller là »). Sa jauge se
   * remplit avec le travail de la page, elle doit se lire sans changer d'onglet.
   * `null` quand la traque est illisible.
   */
  gardien?: React.ReactNode
  /**
   * Le mot qui nomme une ligne du programme — « chapitre » à plat, « fiche »
   * quand la matière est rangée sous les chapitres du programme, où le mot
   * « chapitre » appartient alors aux quatre en-têtes de la liste (`chapterUnit`).
   */
  unit?: 'chapitre' | 'fiche'
  /**
   * Discipline ouverte (« Géographie ») dans une matière qui en réunit deux :
   * la ligne de programme dit alors ce que la barre compte, sans quoi elle
   * annoncerait le dossier entier au-dessus d'une demi-liste.
   */
  discipline?: string | null
  children?: React.ReactNode // barre d'onglets, sous la barre de progression
}) {
  return (
    <EnTetePage
      retour={{ fallback: '/reviser', label: 'Retour aux matières' }}
      titre={subject.name}
      medaillon={<MedaillonMatiere slug={subject.slug} />}
      sousTitre={
        <>
          {discipline ?? 'Programme'} de {grade} · {progress.done}/{progress.total}{' '}
          {unit}s
          {/* Sous la ligne de programme, qui dit où l'élève en est DANS la
              matière : celle-ci dit où il se situe PAR RAPPORT aux autres.
              Deux informations différentes, d'où deux lignes. */}
          {standing}
        </>
      }
      fin={gardien}
    >
      {/* Barre de progression globale de la matière : piste grise, jaune
          solaire pour ce qui est fait — l'or est la couleur du gain. */}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label={`${discipline ?? subject.name} — ${progress.done} ${unit}s sur ${progress.total}, ${progress.pct}% travaillé`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress.pct}
      >
        <div
          className="bar-fill h-full rounded-full bg-highlight transition-all"
          style={{ width: `${progress.pct}%` }}
        />
      </div>

      {children ? <div className="mt-4">{children}</div> : null}
    </EnTetePage>
  )
}
