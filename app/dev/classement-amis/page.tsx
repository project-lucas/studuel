import { notFound } from 'next/navigation'
import ClassementAmis from '@/components/moi/ClassementAmis'
import type { AmiClasse } from '@/lib/moi/classement-amis'

export const dynamic = 'force-dynamic'

// L'APERÇU DU CLASSEMENT ENTRE AMIS — en développement seulement.
//
// Le bloc « Toi et tes amis » de l'onglet Progrès de Moi, sans compte, dans
// plusieurs cas. La relecture périodique reste muette ici : sans session, la
// route `/api/classement-amis` répond 401 et le bloc garde ce qu'il a.
//
//   /dev/classement-amis

const ami = (
  id: string,
  nom: string,
  portrait: string,
  trophees: number,
  tropheesSemaine: number,
  minutesSemaine: number,
  moi = false,
): AmiClasse => ({
  id,
  nom,
  portrait,
  moi,
  trophees,
  tropheesSemaine,
  secondesSemaine: minutesSemaine * 60,
  secondes: minutesSemaine * 60 * 12,
})

const MOI = ami('moi', 'Sacha', '7', 128, 8, 95, true)

const QUATRE: AmiClasse[] = [
  MOI,
  ami('lea', 'Léa', '5', 312, 12, 130),
  ami('rayan', 'Rayan', '3', 46, 30, 210),
  ami('ines', 'Inès', '9', 90, -6, 20),
]

const NEUF: AmiClasse[] = [
  ...QUATRE,
  ami('malo', 'Malo', '4', 205, 4, 62),
  ami('jade', 'Jade', '6', 180, 0, 0),
  ami('noa', 'Noa', '8', 64, 9, 48),
  ami('lina', 'Lina', '10', 22, 2, 15),
  ami('tom', 'Tom', '11', 5, 5, 8),
]

const CAS: { titre: string; joueurs: AmiClasse[]; complet: boolean }[] = [
  { titre: 'Quatre joueurs', joueurs: QUATRE, complet: true },
  { titre: 'Neuf joueurs (la rangée défile)', joueurs: NEUF, complet: true },
  { titre: 'Sans ami', joueurs: [MOI], complet: true },
  { titre: 'Migration 465 absente', joueurs: [MOI], complet: false },
  {
    titre: 'Personne n’a encore rien fait',
    joueurs: [ami('moi', 'Sacha', '7', 0, 0, 0, true), ami('lea', 'Léa', '5', 0, 0, 0)],
    complet: true,
  },
]

export default function ApercuClassementAmis() {
  if (process.env.NODE_ENV === 'production') notFound()
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 pb-16">
      {CAS.map((cas) => (
        <div key={cas.titre}>
          <p className="surtitre mb-2">{cas.titre}</p>
          <ClassementAmis joueurs={cas.joueurs} complet={cas.complet} />
        </div>
      ))}
    </div>
  )
}
