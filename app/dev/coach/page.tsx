import { notFound } from 'next/navigation'
import TableauCoach from '@/components/coach/TableauCoach'
import { juger, type LigneCoach } from '@/lib/coach/statut'

export const dynamic = 'force-dynamic'

// L'APERÇU DU TABLEAU DU COACH — développement seulement, sans compte ni base :
// 72 joueurs de démonstration dans trois groupes, tirés d'une graine fixe.
//
//   /dev/coach            le tableau
//   /dev/coach?e=vide     aucun élève
const PRENOMS = ['Léa', 'Noa', 'Sofiane', 'Inès', 'Malo', 'Awa', 'Hugo', 'Jade', 'Rayan', 'Lina', 'Théo', 'Zoé', 'Ilyes', 'Camille', 'Adam', 'Manon', 'Gabriel', 'Nour', 'Tom', 'Louna', 'Sacha', 'Yasmine', 'Mathis', 'Nina']
const GROUPES = [
  { id: 'g-u15', nom: 'U15', categorie: 'U15' },
  { id: 'g-u17', nom: 'U17', categorie: 'U17' },
  { id: 'g-u18', nom: 'U18', categorie: 'U18' },
]
const CLASSES = ['3e', '2de', '1re', 'Tle']
const MATIERES = ['Maths', 'Français', 'Histoire-Géo', 'Anglais', 'SVT', 'Physique-Chimie']

function graine(n: number) {
  let s = n * 2654435761
  return () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return ((s >>> 0) % 10_000) / 10_000
  }
}

function jour(decalage: number, aujourdhui: string): string {
  const d = new Date(`${aujourdhui}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() - decalage)
  return d.toISOString().slice(0, 10)
}

function lignesDemo(aujourdhui: string): LigneCoach[] {
  return Array.from({ length: 72 }, (_, i) => {
    const r = graine(i + 7)
    const g = GROUPES[i % 3]
    const profil = r()
    // 55 % réguliers, 20 % en baisse, 15 % décrochés, 10 % nouveaux.
    const jours = profil < 0.55 ? 3 + Math.floor(r() * 5) : profil < 0.75 ? 1 + Math.floor(r() * 2) : 0
    const inactif = profil >= 0.75 && profil < 0.9 ? 7 + Math.floor(r() * 20) : jours > 0 ? Math.floor(r() * 2) : 3 + Math.floor(r() * 3)
    const nouveau = profil >= 0.9
    const secondes7 = jours * (600 + Math.floor(r() * 1800))
    const secondes4s = profil < 0.55 ? secondes7 * 4 : profil < 0.75 ? secondes7 * 9 : Math.floor(r() * 4) * 1800
    const ratio = 0.3 + r() * 0.6
    return {
      eleveId: `00000000-0000-4000-8000-${String(i + 1).padStart(12, '0')}`,
      prenom: `${PRENOMS[i % PRENOMS.length]} ${String.fromCharCode(65 + (i % 26))}.`,
      pseudo: r() > 0.6 ? `${PRENOMS[i % PRENOMS.length].toLowerCase()}${i}` : null,
      classe: CLASSES[Math.floor(r() * CLASSES.length)],
      groupeId: g.id,
      groupe: g.nom,
      categorie: g.categorie,
      rattacheLe: jour(nouveau ? Math.floor(r() * 6) : 10 + Math.floor(r() * 120), aujourdhui),
      derniereActivite: profil >= 0.75 && profil < 0.9 && r() < 0.2 ? null : jour(inactif, aujourdhui),
      secondes7,
      secondes4s,
      joursActifs7: jours,
      sessions7: jours * 2,
      matiereFaible: r() < 0.85 ? MATIERES[Math.floor(r() * MATIERES.length)] : null,
      ratioFaible: ratio,
      ratioGlobal: Math.min(1, ratio + 0.2),
      quizTotal: 5 + Math.floor(r() * 80),
    }
  })
}

export default async function ApercuCoachPage({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { e } = await searchParams
  const aujourdhui = new Date().toISOString().slice(0, 10)
  const lignes = e === 'vide' ? [] : lignesDemo(aujourdhui)
  return (
    <div className="mx-auto w-full max-w-6xl">
      <h1 className="font-heading mb-4 text-3xl font-extrabold">Coach Studuel — aperçu</h1>
      <TableauCoach lignes={juger(lignes, aujourdhui)} groupes={GROUPES} aujourdhui={aujourdhui} />
    </div>
  )
}
