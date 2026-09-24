// L'onglet vit dans la mise en page racine (`app/layout.tsx`, construit dès
// l'ouverture et gardé vivant — voir `./onglet.tsx`) : cette page ne porte que
// le titre. Elle reste une vraie route, pour que `/reviser` existe et que la
// barre d'onglets y navigue.
export const metadata = { title: 'Réviser — Studuel' }

export default function PageReviser() {
  return null
}
