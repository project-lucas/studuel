import { notFound } from 'next/navigation'
import DemoDuelHeros from './DemoDuelHeros'

export const dynamic = 'force-dynamic'

// L'APERÇU DU DUEL DES HÉROS — en développement et sur les PRÉVERSIONS Vercel
// (pour le juger sur téléphone hors du Wi-Fi), jamais en production, sans compte.
// Un duel jouable avec le Templier contre un robot : l'arène façon Pokémon,
// l'attaque fétiche, le K.O., la cinématique de victoire et le rayon des
// cinématiques à acheter. Rien n'est écrit en base.
//
//   /dev/duel-heros
export default function ApercuDuelHeros() {
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV !== 'preview') notFound()
  return <DemoDuelHeros />
}
