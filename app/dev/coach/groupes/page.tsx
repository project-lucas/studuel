import { notFound } from 'next/navigation'
import GroupesPanel from '@/components/coach/GroupesPanel'

export const dynamic = 'force-dynamic'

// L'APERÇU DES GROUPES ET DE LEURS CODES — développement seulement, sans base
// (les boutons appellent les vraies actions : sans migration, elles répondent
// par une erreur lisible).
export default function ApercuGroupesPage() {
  if (process.env.NODE_ENV === 'production') notFound()
  return (
    <div className="mx-auto w-full max-w-6xl">
      <h1 className="font-heading mb-4 text-3xl font-extrabold">Groupes et codes — aperçu</h1>
      <GroupesPanel
        groupes={[
          { id: 'g-u15', nom: 'U15', categorie: 'U15', code: 'K7PM3QZD', creeLe: '2026-09-02', archiveLe: null, membres: 24 },
          { id: 'g-u17', nom: 'U17', categorie: 'U17', code: 'TX4WRN8B', creeLe: '2026-09-02', archiveLe: null, membres: 24 },
          { id: 'g-u18', nom: 'U18', categorie: 'U18', code: 'H2VD9SKF', creeLe: '2026-09-15', archiveLe: null, membres: 24 },
          { id: 'g-old', nom: 'U13 2025', categorie: 'U13', code: 'ZZZZZZZZ', creeLe: '2025-09-01', archiveLe: '2026-07-01', membres: 0 },
        ]}
      />
    </div>
  )
}
