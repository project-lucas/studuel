import { redirect } from 'next/navigation'

// L'ancien catalogue /test est remplacé par le parcours /reviser
// (matières → chapitres → leçons). Les sessions de quiz restent sur /test/[id].
export default function TestPage() {
  redirect('/reviser')
}
