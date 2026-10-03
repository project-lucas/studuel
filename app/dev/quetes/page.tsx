import { notFound } from 'next/navigation'
import ApercuQuetes from './ApercuQuetes'

export const dynamic = 'force-dynamic'

// L'APERÇU DES QUÊTES DU JOUR — en développement seulement.
//
// La pastille du bandeau et la feuille des quêtes
// (components/quetes) sur trois quêtes d'exemple, sans base ni compte. Les
// boutons « Encaisser » appellent la vraie action : sans session, elle refuse
// et la feuille relit l'état.
//
//   /dev/quetes                   une finie, une entamée, une à zéro
//   /dev/quetes?e=toutes          les trois finies, le coffre à ouvrir
//   /dev/quetes?e=payees          tout encaissé, le coffre ouvert
//   /dev/quetes?feuille=1         la feuille déjà ouverte
export default async function ApercuQuetesPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string; feuille?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { e = 'mixte', feuille } = await searchParams
  return <ApercuQuetes e={e} feuille={feuille === '1'} />
}
