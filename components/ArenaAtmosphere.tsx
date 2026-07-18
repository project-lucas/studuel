'use client'

/**
 * Atmosphère vivante de l'Arène (onglet Défi), montée PAR-DESSUS le décor peint
 * (voir app/defi/layout.tsx → ArenaBackdrop). Rallume et fait respirer la scène :
 *
 * - les deux braseros violets au sol vacillent (halos qui palpitent) ;
 * - les torches dorées de part et d'autre de l'escalier vacillent aussi ;
 * - de fines braises montent des braseros ;
 * - des feuilles de laurier tombent en diagonale et tanguent — la présence du
 *   vent demandée.
 *
 * Purement décoratif : style + animations dans globals.css (`.arena-*`), qui
 * respecte prefers-reduced-motion (flammes figées, braises et feuilles masquées).
 */

// Feuille de laurier stylisée (nervure + limbe), réutilisée pour toutes les
// feuilles ; la couleur reprend le vert-olive doré des lauriers de l'illustration.
function Leaf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 22" fill="none" aria-hidden="true" className={className}>
      <path
        d="M8 1C3 5 1.5 12 8 21C14.5 12 13 5 8 1Z"
        fill="#9db363"
        stroke="#6f8a3c"
        strokeWidth="1"
      />
      <path d="M8 3.5V19" stroke="#6f8a3c" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  )
}

export default function ArenaAtmosphere() {
  return (
    <div aria-hidden="true" className="arena-atmos">
      {/* Braseros violets (bas gauche / bas droite). */}
      <span className="arena-flame arena-flame--violet arena-flame--vl" />
      <span className="arena-flame arena-flame--violet arena-flame--vr" />
      {/* Torches dorées de l'escalier (gauche / droite). */}
      <span className="arena-flame arena-flame--gold arena-flame--gl" />
      <span className="arena-flame arena-flame--gold arena-flame--gr" />

      {/* Braises qui montent des braseros violets. */}
      <span
        className="arena-mote"
        style={{ left: '9%', top: '78%', ['--mote-drift' as string]: '10px' }}
      />
      <span
        className="arena-mote"
        style={{
          left: '10%',
          top: '79%',
          ['--mote-drift' as string]: '-6px',
          animationDelay: '-1.7s',
        }}
      />
      <span
        className="arena-mote"
        style={{ left: '88%', top: '78%', ['--mote-drift' as string]: '-9px', animationDelay: '-0.8s' }}
      />
      <span
        className="arena-mote"
        style={{ left: '89%', top: '79%', ['--mote-drift' as string]: '7px', animationDelay: '-2.5s' }}
      />

      {/* Feuilles au vent (dérive diagonale + tangage). */}
      <span className="arena-leaf arena-leaf--1">
        <Leaf />
      </span>
      <span className="arena-leaf arena-leaf--2">
        <Leaf />
      </span>
      <span className="arena-leaf arena-leaf--3">
        <Leaf />
      </span>
      <span className="arena-leaf arena-leaf--4">
        <Leaf />
      </span>
    </div>
  )
}
