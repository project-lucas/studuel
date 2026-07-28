import { redirect } from 'next/navigation'

// L'ancien Coffre a fusionné dans l'onglet Trésor (volet « Boutique ») : cette
// route ne sert plus qu'à rediriger les anciens liens/favoris. Les capsules
// (/coffre/[capsule]) restent servies à leur adresse.
export default function CoffrePage() {
  redirect('/tresor')
}
