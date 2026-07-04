import { redirect } from 'next/navigation'

// La racine ouvre le Défi : LE geste quotidien.
export default function Home() {
  redirect('/defi')
}
