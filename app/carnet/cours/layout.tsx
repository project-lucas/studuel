import WorldBackdrop from '@/components/WorldBackdrop'

// Tous les écrans d'un cours du carnet (le cours, une question, sa session
// « Réviser », « à revoir ») posent le même papier quadrillé que les onglets :
// un cours ouvert depuis le carnet ne doit pas changer de table sous les pieds
// de l'élève. Le fond vit ici, une fois, plutôt que dans chaque page — le
// squelette de chargement en profite aussi.
export default function CoursCarnetLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WorldBackdrop className="tab-bg" />
      {children}
    </>
  )
}
