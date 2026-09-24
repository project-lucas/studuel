import SubjectIcon from '@/components/SubjectIcon'
import { subjectVignette } from '@/lib/subject-style'

/**
 * LE MÉDAILLON DE LA MATIÈRE — son illustration, la même que sur sa carte de
 * l'accueil Réviser, posée sur une plaque blanche de 64 px.
 *
 * Depuis l'audit du 23/09/2026, c'est LUI qui porte l'identité de la matière
 * dans un en-tête : plus de bandeau coloré derrière le titre, le fond est le
 * mur crème de toute l'app. L'élève reconnaît son dossier à son dessin, pas à
 * un aplat bleu ou vert — et pas à un pictogramme de trait que trois langues
 * partageaient. Le repli (matière sans vignette) garde l'icône Lucide, en
 * violet sur la même plaque.
 */
export default function MedaillonMatiere({ slug }: { slug: string }) {
  const vignette = subjectVignette(slug)
  return (
    <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-card shadow-sm">
      {vignette ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={vignette}
          alt=""
          aria-hidden="true"
          width={320}
          height={320}
          // Le héros de l'écran : rien à différer, il est déjà à l'image.
          className="size-13 object-contain"
        />
      ) : (
        <SubjectIcon
          slug={slug}
          className="size-7 text-primary"
          strokeWidth={2.25}
          aria-hidden="true"
        />
      )}
    </span>
  )
}
