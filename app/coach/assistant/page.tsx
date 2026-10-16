import TriDuMatin from '@/components/coach/TriDuMatin'
import { claudeConfigure } from '@/lib/coach/claude-server'
import { lireTriDuJour } from './actions'

export const dynamic = 'force-dynamic'

// L'ASSISTANT IA DU COACH (Claude) : le tri du matin. Les bilans et brouillons
// vivent sur la fiche de chaque élève, le résumé d'un fil dans la messagerie.
export default async function AssistantPage() {
  const tri = await lireTriDuJour()
  return <TriDuMatin initial={tri} cleConfiguree={claudeConfigure()} />
}
