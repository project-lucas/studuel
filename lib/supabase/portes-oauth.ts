import { unstable_cache } from 'next/cache'
import {
  AUCUNE_PORTE_OAUTH,
  portesOAuthDepuisSettings,
  type PortesOAuth,
} from '@/lib/auth-portes'

// Les fournisseurs OAuth activés côté Supabase, lus à la SOURCE. Le point
// `/auth/v1/settings` est public (clé anon), identique pour tout le monde, et
// ne change qu'à la main dans le tableau de bord : en cache 10 min, il coûte
// une requête par instance et par dizaine de minutes, pas une par visiteur.
//
// Pourquoi pas une variable d'environnement (`NEXT_PUBLIC_AUTH_GOOGLE=1`) ?
// Parce qu'elle pourrait mentir à son tour : activée sans que le fournisseur
// le soit, on retrouverait le bouton mort qu'on vient d'enlever. Ici la
// vérité vient de la configuration qui fait foi au moment du clic.
//
// En cas de panne ou de délai, TOUT FERMÉ : l'e-mail reste, et il marche.

const PORTES_TTL_SECONDS = 600
const DELAI_MS = 2500

export const getPortesOAuthCached = unstable_cache(
  async (): Promise<PortesOAuth> => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const cle = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !cle) return AUCUNE_PORTE_OAUTH
    try {
      const res = await fetch(`${url}/auth/v1/settings`, {
        headers: { apikey: cle },
        signal: AbortSignal.timeout(DELAI_MS),
        cache: 'no-store',
      })
      if (!res.ok) return AUCUNE_PORTE_OAUTH
      return portesOAuthDepuisSettings(await res.json())
    } catch (e) {
      console.error('[auth] fournisseurs OAuth illisibles :', e)
      return AUCUNE_PORTE_OAUTH
    }
  },
  ['portes-oauth'],
  { revalidate: PORTES_TTL_SECONDS, tags: ['auth-settings'] },
)
