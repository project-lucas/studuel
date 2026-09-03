// Remonté à chaque navigation (contrairement au layout) : transition de page.
//
// Un simple fondu, et court. Elle était un fondu + glissement de 300 ms : avec
// des onglets préchargés qui s'ouvrent en quelques dizaines de millisecondes,
// c'est l'animation elle-même qui devenait l'attente — trois dixièmes de
// seconde pendant lesquels la page suivante se cherche. Duolingo change
// d'onglet sans cérémonie ; on garde juste assez de fondu pour que le
// remplacement ne claque pas. Respecte prefers-reduced-motion (désactivé
// globalement dans globals.css).
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-in fade-in duration-150">{children}</div>
}
