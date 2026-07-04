import { redirect } from 'next/navigation'

// Formation a fusionné avec Réviser : les vidéos rejoindront les leçons.
export default function FormationPage() {
  redirect('/reviser')
}
