// Décor de l'Arène : le fond d'écran couvre tout l'écran de l'onglet Défi
// (accueil, défi du jour, modes de jeu), derrière le contenu et les barres.
export default function DefiLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 bg-[url('/images/defi/fond-ecran.webp')] bg-cover bg-center"
      />
      {children}
    </>
  )
}
