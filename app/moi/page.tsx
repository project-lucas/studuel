// L'onglet vit dans la mise en page racine (`app/layout.tsx`, construit dès
// l'ouverture et gardé vivant — voir `./onglet.tsx`) : cette page ne porte que
// le titre. Elle reste une vraie route, pour que `/moi` existe et que la
// barre d'onglets y navigue.
export const metadata = { title: 'Moi — Studuel' }

export default function PageMoi() {
  return null
}
