import { redirect } from 'next/navigation'

// REDIRECTION HÉRITÉE — à ne pas confondre avec une page orpheline.
// L'onglet Habitude est devenu « Moi » : capacité, habitudes, trajectoire au
// bac, leviers. Aucun lien entrant PAR CONSTRUCTION : cette route ne sert qu'à
// rattraper les anciennes URL (favoris, liens déjà partagés). Ne pas la
// supprimer lors d'un ménage des orphelines.
export default function HabitudePage() {
  redirect('/moi')
}
