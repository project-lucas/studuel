import { redirect } from 'next/navigation'

// L'onglet Habitude est devenu « Moi » : score de structure, habitudes,
// corrélation structure/notes, records et badges.
export default function HabitudePage() {
  redirect('/moi')
}
