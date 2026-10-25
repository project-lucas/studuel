import { notFound } from 'next/navigation'
import ApercuTraque, { type EtatApercuTraque } from '@/components/dev/ApercuTraque'

export const dynamic = 'force-dynamic'

// Lu ICI, côté serveur : une fonction exportée d'un module `'use client'`
// n'est qu'une référence client pour la page, pas une fonction à appeler.
const ETATS: readonly EtatApercuTraque[] = ['defaut', 'debusque', 'chasse', 'indisponible', 'expire', 'vide']
const etatDe = (e: string | undefined): EtatApercuTraque =>
  (ETATS as readonly string[]).includes(e ?? '') ? (e as EtatApercuTraque) : 'defaut'

// L'APERÇU DU POP-UP DE LA TRAQUE — en développement seulement, sans compte :
// l'enveloppe réelle (grand pop-up crème) et des gardiens de démonstration,
// chacun dans un état de l'AFFICHE (25/10/2026).
//
//   /dev/traque                 tous les états à la suite
//   /dev/traque?e=debusque      sorti de sa tanière : « Débusqué ! », 42 min, Défier en or
//   /dev/traque?e=chasse        en chasse à 40 % : « Recherché », il part à la fin du jour, les gestes
//   /dev/traque?e=indisponible  pas son jour : le ruban, « Revient jeudi »
//   /dev/traque?e=expire        recouché plus tôt : la jauge repart de la moitié
//   /dev/traque?e=vide          aucun gardien (migration 212 absente, ou pas de matière)
export default async function ApercuTraquePage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { e } = await searchParams
  const etat = etatDe(e)
  return (
    <div className="mx-auto max-w-md space-y-4">
      <h1 className="font-heading text-3xl font-extrabold">La Traque</h1>
      <p className="text-sm text-muted-foreground">
        Le pop-up s&apos;ouvre à l&apos;arrivée ; ferme-le et rouvre-le d&apos;un bouton.
        <code className="ml-1">?e=debusque</code>, <code>chasse</code>, <code>indisponible</code>,{' '}
        <code>expire</code> ou <code>vide</code> pour un seul état.
      </p>
      <ApercuTraque etat={etat} />
    </div>
  )
}
