// Remonté à chaque navigation (contrairement au layout) : transition de page
// douce — fondu + léger glissement vers le haut. Respecte prefers-reduced-motion
// (désactivé globalement dans globals.css).
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      {children}
    </div>
  )
}
