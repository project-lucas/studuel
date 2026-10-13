import Link from 'next/link'
import { notFound } from 'next/navigation'
import BoutonsPepin from '@/components/dev/BoutonsPepin'

export const dynamic = 'force-dynamic'

// L'APERÇU DES FILETS D'ERREUR — en développement seulement.
//
//   /dev/erreur            les boutons qui plantent (frontière, window.onerror,
//                          promesse rejetée) ; chaque plantage part dans
//                          erreurs_app si la 559 est exécutée
//   /dev/erreur?e=plante   la page plante AU SERVEUR → app/error.tsx, avec son
//                          digest (et la ligne « serveur » d'instrumentation.ts)
//   /dev/erreur?e=404      notFound() → app/not-found.tsx
export default async function ApercuErreurPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { e } = await searchParams
  if (e === 'plante') throw new Error('Pépin de démonstration au serveur (/dev/erreur?e=plante)')
  if (e === '404') notFound()

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="font-heading text-3xl font-extrabold">Les filets d’erreur</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Chaque plantage d’ici est remonté dans <code>erreurs_app</code> (migration 559) et se lit sur{' '}
          <Link href="/admin/erreurs" className="text-primary underline underline-offset-4">
            /admin/erreurs
          </Link>
          .
        </p>
      </header>
      <section className="carte space-y-3 p-4">
        <h2 className="titre-section">Dans le navigateur</h2>
        <BoutonsPepin />
      </section>
      <section className="carte space-y-3 p-4">
        <h2 className="titre-section">Au serveur</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>
            <Link href="/dev/erreur?e=plante" className="text-primary underline underline-offset-4">
              La page plante au serveur
            </Link>{' '}
            → <code>app/error.tsx</code>
          </li>
          <li>
            <Link href="/dev/erreur?e=404" className="text-primary underline underline-offset-4">
              La page n’existe pas
            </Link>{' '}
            → <code>app/not-found.tsx</code>
          </li>
          <li>
            <a href="/une-adresse-qui-nexiste-pas" className="text-primary underline underline-offset-4">
              Une adresse inconnue
            </a>{' '}
            → <code>app/not-found.tsx</code> aussi
          </li>
        </ul>
      </section>
    </div>
  )
}
