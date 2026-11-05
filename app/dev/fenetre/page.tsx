import { notFound } from 'next/navigation'
import WorldBackdrop from '@/components/WorldBackdrop'
import FenetreVivante from '@/components/defi/FenetreVivante'

export const dynamic = 'force-dynamic'

// L'APERÇU DE LA FENÊTRE VIVANTE — en développement seulement, sans compte.
//
// Le fond d'écran pressenti pour l'onglet Défi : l'école vue de la fenêtre de
// la chambre (lib/arena-fenetre.ts, components/defi/FenetreVivante.tsx). Rien
// n'est branché sur /defi tant que Lucas n'a pas validé ce modèle.
//
//   /dev/fenetre            le fond, sous un faux HUD (plaques du bord, rangée de combat)
//   /dev/fenetre?hud=0      le fond seul
//   /dev/fenetre?fige=1     le fond figé (ce que voit un élève en « mouvement réduit »)
export default async function ApercuFenetrePage({
  searchParams,
}: {
  searchParams: Promise<{ hud?: string; fige?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { hud, fige } = await searchParams
  return (
    <>
      <WorldBackdrop className="">
        <FenetreVivante anime={fige !== '1'} />
      </WorldBackdrop>
      <div className="min-h-dvh" />
      {hud === '0' ? null : <FauxHud />}
    </>
  )
}

/**
 * Les plaques de l'arène, à leur place, sans rien derrière : pour juger la
 * lisibilité. Cotes en styles en ligne (les vraies : bandeau de 76 px, rangée
 * de combat de 92 px posée 92 px au-dessus du bas) — rien ici ne doit dépendre
 * d'une classe utilitaire neuve.
 */
function FauxHud() {
  const plaque = 'arena-plate arena-plate--clair'
  const centre = { display: 'grid', placeItems: 'center', fontWeight: 800 } as const
  const rond = (taille: number) => ({ ...centre, width: taille, height: taille, fontSize: 10 })
  return (
    <div
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 10, margin: '0 auto', maxWidth: 448, pointerEvents: 'none' }}
    >
      <div style={{ position: 'absolute', top: 92, left: 12, display: 'grid', gap: 12 }}>
        {['Quêtes', 'Boss', 'Amis'].map((nom) => (
          <div key={nom} className={plaque} style={rond(56)}>
            {nom}
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', top: 92, right: 12, display: 'grid', gap: 12, justifyItems: 'end' }}>
        <div className={plaque} style={{ ...rond(44), fontSize: 18 }}>
          ≡
        </div>
        <div className={plaque} style={{ ...centre, height: 44, padding: '0 16px', fontSize: 12 }}>
          Classement
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 'calc(5.75rem + env(safe-area-inset-bottom))',
          height: 92,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div className={plaque} style={{ ...rond(72), flexShrink: 0, fontSize: 11 }}>
          Maths
        </div>
        <div
          className="arena-plate arena-plate--gold font-heading"
          style={{ ...centre, flex: 1, fontSize: 24, color: '#4a2a6a' }}
        >
          DUEL
        </div>
        <div className={plaque} style={{ ...rond(72), flexShrink: 0, fontSize: 11 }}>
          Modes
        </div>
      </div>
    </div>
  )
}
