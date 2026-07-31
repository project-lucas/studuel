import { cache } from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from './server'

// -----------------------------------------------------------------------------
// L'utilisateur courant, LOCALEMENT et UNE SEULE FOIS par requête.
//
// Deux gaspillages réglés ici :
//
// 1. `supabase.auth.getUser()` part sur le RÉSEAU vers le serveur d'auth à
//    chaque appel (~30 ms depuis Paris, davantage depuis une région lointaine).
//    `getClaims()` vérifie la SIGNATURE du jeton en local (WebCrypto) : le
//    projet signe en ES256 (clés asymétriques), donc zéro aller-retour. Le
//    trousseau public (JWKS) est mis en cache dans un global du module par
//    @supabase/auth-js — il n'est donc téléchargé qu'une fois par instance,
//    pas une fois par requête.
//
//    Contre la FALSIFICATION, même niveau de sécurité : la signature est
//    vérifiée cryptographiquement, exactement comme le fait Postgres pour
//    appliquer les policies RLS. Un jeton forgé est rejeté ici comme côté base.
//
//    ⚠️ UN écart assumé, à connaître : `getClaims()` ne détecte PAS une
//    RÉVOCATION en cours de vie du jeton (compte banni, supprimé, « déconnecté
//    de partout »). Il valide `exp` + signature en local sans consulter l'état
//    de session côté serveur — là où `getUser()` faisait l'aller-retour qui
//    l'aurait vu. Un jeton déjà émis reste donc valide jusqu'à son expiration
//    naturelle (~1 h). Pas d'escalade de privilège pour autant : les
//    autorisations sensibles (`is_admin`, `subscription_tier`) sont relues
//    FRAÎCHEMENT en base à chaque requête (RLS), jamais déduites d'une claim
//    figée. Le résidu est une continuité d'accès d'au plus une heure.
//
// 2. Le layout, le bandeau du haut et la page appelaient CHACUN `getUser()` :
//    3 appels pour une seule navigation. `cache()` de React mémoïse par
//    requête serveur — le premier appelant paie, les suivants lisent.
//
// Le retour imite la forme de `User` sur les champs réellement consommés dans
// l'app (`id`, `email`, `user_metadata`) : les appelants n'ont rien à changer.
// -----------------------------------------------------------------------------

export type CurrentUser = Pick<User, 'id' | 'email' | 'user_metadata'>

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  if (error || !data?.claims?.sub) return null

  const claims = data.claims
  return {
    id: claims.sub,
    email: claims.email,
    user_metadata: claims.user_metadata ?? {},
  }
})

// Client Supabase + utilisateur en un seul `await`, pour les pages qui font
// systématiquement les deux. Le client est bon marché à construire ; c'est le
// `await` en série qui coûte, et il disparaît ici.
export const getServerAuth = cache(async () => {
  const [supabase, user] = await Promise.all([createClient(), getCurrentUser()])
  return { supabase, user }
})
