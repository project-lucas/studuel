// -----------------------------------------------------------------------------
// L'ENVOI DE LA FIN D'UNE COURSE — patient, mais pas indéfiniment.
//
// Sur un téléphone, la fin d'une course part souvent au pire moment : métro,
// bascule wifi → 4G, écran qui se verrouille. Avant le 19/09/2026 l'envoi
// n'avait ni délai ni relance : une requête sans réponse laissait « Le serveur
// compte les trophées… » à l'écran, et un échec affichait « tes trophées
// apparaîtront au prochain chargement » — ce qui était faux, rien n'était écrit.
//
// Ici : chaque essai a un délai maximal (il est INTERROMPU au-delà, pas
// seulement oublié), et on réessaie deux fois, en laissant au réseau le temps de
// revenir. C'est sans risque : la course porte son identifiant, et le serveur
// ne paie jamais deux fois le même (migration 374).
// -----------------------------------------------------------------------------

/** Au-delà, un essai est abandonné (et la requête interrompue). */
export const DELAI_MAX_REPONSE_MS = 12_000

/** Les pauses avant chaque nouvel essai : trois essais en tout. */
export const PAUSES_ENTRE_ESSAIS_MS: readonly number[] = [1_500, 4_000]

export class EnvoiEchoue extends Error {
  constructor(
    message: string,
    /** Le serveur a répondu, et c'était un refus : réessayer ne changera rien. */
    readonly definitif = false,
  ) {
    super(message)
    this.name = 'EnvoiEchoue'
  }
}

type Options = {
  delaiMaxMs?: number
  pauses?: readonly number[]
  /** Injecté par les tests ; `setTimeout` sinon. */
  attendre?: (ms: number) => Promise<void>
}

const attendreVraiment = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })

/**
 * Envoie avec délai maximal et relances. `envoyer` reçoit le signal
 * d'interruption de SON essai. Un refus définitif (`EnvoiEchoue` marqué
 * `definitif`) arrête tout de suite ; sinon, la dernière erreur remonte après
 * le dernier essai.
 */
export async function envoyerAvecRelances<T>(
  envoyer: (signal: AbortSignal) => Promise<T>,
  options: Options = {},
): Promise<T> {
  const delaiMax = options.delaiMaxMs ?? DELAI_MAX_REPONSE_MS
  const pauses = options.pauses ?? PAUSES_ENTRE_ESSAIS_MS
  const attendre = options.attendre ?? attendreVraiment
  let derniere: unknown = new EnvoiEchoue('Aucun essai')

  for (let essai = 0; essai <= pauses.length; essai++) {
    if (essai > 0) await attendre(pauses[essai - 1])
    const controle = new AbortController()
    const minuteur = setTimeout(() => controle.abort(), delaiMax)
    try {
      return await envoyer(controle.signal)
    } catch (e) {
      derniere = e
      if (e instanceof EnvoiEchoue && e.definitif) break
    } finally {
      clearTimeout(minuteur)
    }
  }
  throw derniere
}

/**
 * L'appel réel : POST JSON vers une route de l'app. Une réponse 4xx est un
 * refus définitif (session expirée, corps refusé) ; une 5xx ou un réseau muet,
 * une panne passagère qui mérite un autre essai.
 */
export async function posterJson<T>(url: string, corps: unknown, signal: AbortSignal): Promise<T> {
  const reponse = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(corps),
    signal,
    cache: 'no-store',
  })
  if (!reponse.ok) {
    throw new EnvoiEchoue(`Réponse ${reponse.status}`, reponse.status >= 400 && reponse.status < 500)
  }
  return (await reponse.json()) as T
}
