import WorldBackdrop from '@/components/WorldBackdrop'
import ArenaBackdrop from '@/components/ArenaBackdrop'

// Décor de l'Arène : l'académie flottante, en SIX variantes qui suivent l'heure
// de l'élève (aube → nuit, voir lib/arena-background.ts). Remplace le colisée
// doré statique : la scène du bas est volontairement vide, c'est le podium du
// personnage. ArenaBackdrop gère le timer, le fondu et le préchargement.
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
