import EnTetePage from '@/components/reviser/EnTetePage'
import MedaillonMatiere from '@/components/reviser/MedaillonMatiere'

// L'EN-TÊTE DE L'ENCYCLOPÉDIE — le même monde que le dossier de matière :
// la recette commune de Réviser (`EnTetePage`), le médaillon de la matière,
// et la rangée d'onglets du dossier dessous. Plus d'aplat orange derrière le
// titre (audit du 23/09/2026) : le fond est le mur crème de toute l'app.
//
// Ce n'est pas `SubjectHeader` : celui-là porte une barre de PROGRESSION, et
// l'encyclopédie n'a rien à mesurer. Elle ne donne ni XP, ni gemmes, ni
// couronnes ; on la lit par curiosité, et une jauge à 0 % en tête d'un rayon de
// lecture serait un reproche pour rien.
//
// À la place, la ligne dit ce qu'il y a dedans : « 150 personnages ·
// 115 événements ». C'est une invitation, pas une note.
export default function EnteteRayon({
  subject,
  grade,
  personnages,
  evenements,
  children,
}: {
  subject: { slug: string; name: string; color: string }
  grade: string
  personnages: number
  evenements: number
  /** La barre d'onglets du dossier. */
  children?: React.ReactNode
}) {
  return (
    <EnTetePage
      retour={{ fallback: `/reviser/${subject.slug}`, label: 'Retour au dossier' }}
      titre="Encyclopédie"
      medaillon={<MedaillonMatiere slug={subject.slug} />}
      sousTitre={
        <>
          {personnages} personnages · {evenements} événements
          <span className="block text-xs">
            {subject.name} · {grade}
          </span>
        </>
      }
    >
      {children}
    </EnTetePage>
  )
}
