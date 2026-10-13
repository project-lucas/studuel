// LES ERREURS DU SERVEUR (Next 16 : `onRequestError`) — rendu d'un composant
// serveur, route API, Server Action, proxy. Chaque erreur attrapée par Next
// part dans `erreurs_app` (migration 559) avec sa route, son `digest` (le même
// que celui que reçoit `app/error.tsx` côté navigateur : les deux lignes d'un
// même plantage se relient par lui) et, si l'élève est connecté, son
// identifiant — lu dans le cookie de session de la requête.
//
// Doit être AWAITÉ (Next n'attend que ce qu'on lui rend) ; ne lève jamais.

import type { Instrumentation } from 'next'
import { rapportDepuis } from '@/lib/erreurs'
import { clientDepuisEnTeteCookie, enregistrerErreur } from '@/lib/erreurs-server'

export const onRequestError: Instrumentation.onRequestError = async (err, request, context) => {
  try {
    const rapport = rapportDepuis(err, 'serveur', {
      url: request.path,
      contexte: {
        methode: request.method,
        route: context.routePath,
        type: context.routeType,
        rendu: context.renderSource ?? null,
      },
    })
    const enTetes = request.headers
    const cookie = enTetes.cookie
    const navigateur = enTetes['user-agent']
    const supabase = clientDepuisEnTeteCookie(Array.isArray(cookie) ? cookie.join('; ') : cookie)
    await enregistrerErreur(
      supabase,
      rapport,
      Array.isArray(navigateur) ? navigateur.join(' ') : (navigateur ?? null),
    )
  } catch (e) {
    // Dernier recours : les logs du serveur.
    console.error('[erreurs] onRequestError a échoué :', e)
  }
}
