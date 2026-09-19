import { redirect } from 'next/navigation'

// Les anciennes capsules vidéo en euros ont laissé place aux capsules de la
// Boutique (migration 366, lues dans le carnet). Cette adresse ne sert plus
// qu'à rediriger les anciens liens vers leur rayon.
export default function AncienneCapsulePage() {
  redirect('/tresor#capsules')
}
