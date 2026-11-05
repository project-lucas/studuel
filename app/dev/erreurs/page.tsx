import { notFound } from 'next/navigation'
import CarteErreurs from '@/components/reviser/CarteErreurs'
import ReviewPlayer, { type ReviewPlayItem } from '@/components/ReviewPlayer'

export const dynamic = 'force-dynamic'

// L'APERÇU DE « MES ERREURS » (05/11/2026) — en développement seulement, sans
// base ni compte.
//
//   /dev/erreurs              la session : trois erreurs à venger, une carte
//                             (finir la session appelle l'action serveur :
//                             sans compte, « Session non enregistrée »)
//   /dev/erreurs?vue=carte    les trois états de la carte de l'accueil Réviser
//   /dev/erreurs?vue=vide     la session sans rien à revoir

const ITEMS: ReviewPlayItem[] = [
  {
    kind: 'question',
    id: 'dev-1',
    subject: 'Anglais',
    inRevanche: true,
    prompt: 'Comment traduit-on « les jouets des enfants » ?',
    options: ['the childs’ toys', 'the childrens’ toys', 'the children’s toys', 'the children toys'],
    correctIndex: 2,
    explanation: '*Children* est un pluriel irrégulier, sans -s : on ajoute donc ’s, comme pour un singulier.',
  },
  {
    kind: 'question',
    id: 'dev-2',
    subject: 'Anglais',
    inRevanche: true,
    prompt: 'Quel est le prétérit de « to bring » ?',
    options: ['bringed', 'brought', 'brang', 'bought'],
    correctIndex: 1,
    explanation: 'Bring, brought, brought — à ne pas confondre avec buy, bought, bought.',
  },
  {
    kind: 'card',
    id: 'dev-3',
    subject: 'Anglais',
    inRevanche: false,
    front: 'to borrow',
    back: 'emprunter',
  },
  {
    kind: 'question',
    id: 'dev-4',
    subject: 'Anglais',
    inRevanche: true,
    prompt: '« I have lived here ___ 2019. »',
    options: ['for', 'since', 'during', 'ago'],
    correctIndex: 1,
    explanation: 'Since + un point de départ (2019) ; for + une durée (six years).',
  },
]

export default async function ApercuErreursPage({
  searchParams,
}: {
  searchParams: Promise<{ vue?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { vue } = await searchParams
  if (vue === 'carte') {
    return (
      <div className="mx-auto flex max-w-md flex-col gap-3 pt-3">
        <CarteErreurs compte={{ aVenger: 10, aRevoir: 4 }} />
        <CarteErreurs compte={{ aVenger: 1, aRevoir: 0 }} />
        <CarteErreurs compte={{ aVenger: 0, aRevoir: 7 }} />
      </div>
    )
  }
  return <ReviewPlayer items={vue === 'vide' ? [] : ITEMS} titre="Mes erreurs · Anglais" />
}
