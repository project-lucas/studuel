import { notFound } from 'next/navigation'
import ApercuTraque, { type EtatApercuTraque } from '@/components/dev/ApercuTraque'

export const dynamic = 'force-dynamic'

// L'APERÇU DU POP-UP DE LA TRAQUE — en développement seulement, sans compte :
// l'enveloppe réelle (grand pop-up crème) et cinq gardiens de démonstration
// (un débusqué, un en chasse aujourd'hui, deux en tanière, un recouché).
//
//   /dev/traque            les cinq gardiens
//   /dev/traque?e=vide     aucun gardien (migration 212 absente, ou pas de matière)
export default async function ApercuTraquePage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { e } = await searchParams
  const etat: EtatApercuTraque = e === 'vide' ? 'vide' : 'defaut'
  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="font-heading text-3xl font-extrabold">La Traque</h1>
      <p className="text-sm text-muted-foreground">
        Le pop-up s&apos;ouvre à l&apos;arrivée ; ferme-le et rouvre-le d&apos;un bouton.
        <code className="ml-1">?e=vide</code> pour l&apos;état sans gardien.
      </p>
      <ApercuTraque etat={etat} />
    </div>
  )
}
