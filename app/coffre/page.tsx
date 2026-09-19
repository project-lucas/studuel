import { redirect } from 'next/navigation'

// L'ancien Coffre a fusionné dans l'onglet Boutique : cette route ne sert plus
// qu'à rediriger les anciens liens/favoris (les anciennes capsules
// /coffre/[capsule] redirigent vers le rayon des capsules).
export default function CoffrePage() {
  redirect('/tresor')
}
