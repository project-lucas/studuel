import ArenaBackdrop from '@/components/ArenaBackdrop'
import WorldBackdrop from '@/components/WorldBackdrop'

// Décor de l'Arène : le colisée couvre tout l'écran de l'onglet Défi
// (accueil, défi du jour, modes de jeu), derrière le contenu et les barres.
// L'image suit l'heure de l'élève (5 variantes, fondu au changement de plage)
// et le ciel vit (nuages, oiseaux) — voir ArenaBackdrop/ArenaSky.
// Porté sur <body> (WorldBackdrop) pour ne jamais être rogné par le conteneur
// de balayage — sinon, bordures blanches autour de l'arène.
export default function DefiLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <WorldBackdrop className="defi-arena-bg">
        <ArenaBackdrop />
      </WorldBackdrop>
      {children}
    </>
  )
}
