import { notFound } from 'next/navigation'
import ApercuChoixHeros from './Apercu'

export const dynamic = 'force-dynamic'

// L'APERÇU DU CHOIX DU HÉROS (31/10/2026) — en développement seulement,
// connecté ou non. Dans l'app, l'écran se joue à l'étape `avatar` de
// /bienvenue, qui renvoie un élève connecté vers l'app.
export default function ApercuChoixHerosPage() {
  if (process.env.NODE_ENV === 'production') notFound()
  return <ApercuChoixHeros />
}
