import { redirect } from 'next/navigation'

// La racine renvoie vers le premier onglet de la navigation.
export default function Home() {
  redirect('/formation')
}
