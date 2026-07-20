// Pluie de confettis, purement décorative (CSS `.confetti-piece`).
//
// Extraite de PalierCelebration pour être réutilisable : les écrans de fin de
// session la méritent autant qu'un passage de palier. Aucun état, aucun effet —
// à poser dans un conteneur `relative`. Positions et délais dérivés de l'index
// (jamais Math.random au rendu : ce serait une divergence d'hydratation).
export default function ConfettiRain() {
  const colors = ['bg-primary', 'bg-highlight', 'bg-chart-2', 'bg-chart-4']
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 32 }, (_, i) => (
        <span
          key={i}
          className={`confetti-piece ${colors[i % colors.length]}`}
          style={{
            left: `${(i * 31 + 7) % 100}%`,
            animationDelay: `${(i % 8) * 0.24}s`,
            animationDuration: `${2.2 + (i % 5) * 0.4}s`,
          }}
        />
      ))}
    </div>
  )
}
