import { notFound } from 'next/navigation'
import Banc from './Banc'

export const dynamic = 'force-dynamic'

// L'APERÇU DE L'ENTRÉE EN COMBAT ET DES SONS (05/11/2026) — en développement
// seulement. Un bouton par geste : l'entrée au flash blanc (vers les aperçus
// du combat), les trois musiques, la vague de tics, le coffre.

export default function Page() {
  if (process.env.NODE_ENV === 'production') notFound()
  return <Banc />
}
