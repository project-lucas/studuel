// LES ERREURS DU NAVIGATEUR, ATTRAPÉES AVANT L'HYDRATATION (Next 16 :
// `instrumentation-client` s'exécute après le HTML, avant React). Tout ce qui
// échappe aux frontières d'erreur de l'app — une promesse rejetée sans catch,
// une exception dans un gestionnaire d'événement, un chunk qui ne charge pas
// après un déploiement — passe ici et part vers `/api/erreurs`.
//
// Léger par construction : deux écouteurs, aucun import lourd (lib/erreurs est
// pur). Next avertit en développement au-delà de 16 ms d'initialisation.

import { noterNavigation, signalerErreur } from '@/lib/erreurs-client'

try {
  window.addEventListener('error', (event) => {
    // `event.error` est l'exception ; à défaut (ressource qui ne charge pas,
    // script d'une autre origine), le message de l'événement.
    signalerErreur(event.error ?? event.message, { ou: 'window.onerror' })
  })
  window.addEventListener('unhandledrejection', (event) => {
    signalerErreur(event.reason, { ou: 'unhandledrejection' })
  })
} catch {
  // Un navigateur sans ces événements : on vit sans.
}

/** Le fil d'Ariane : la dernière navigation, jointe à chaque rapport. */
export function onRouterTransitionStart(url: string): void {
  noterNavigation(url)
}
