import { redirect } from 'next/navigation'

// REDIRECTION HÉRITÉE — à ne pas confondre avec une page orpheline.
// Formation a fusionné avec Réviser : les vidéos rejoindront les leçons. Cette
// route n'a AUCUN lien entrant, et c'est justement sa raison d'être : elle
// rattrape les anciennes URL (favoris, liens déjà partagés) au lieu de les
// casser. Ne pas la supprimer lors d'un ménage des orphelines.
export default function FormationPage() {
  redirect('/reviser')
}
