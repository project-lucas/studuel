// Décor de l'Arène : le fond d'écran couvre tout l'écran de l'onglet Défi
// (accueil, défi du jour, modes de jeu), derrière le contenu et les barres.
export default function DefiLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div
        aria-hidden="true"
        className="defi-arena-bg fixed inset-0 -z-10"
      />
      {children}
    </>
  )
}
