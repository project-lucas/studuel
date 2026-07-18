// Helpers de tirage partagés par les banques de jeux de salon (lib/jeux).
// Fisher-Yates piloté par un PRNG fourni (jamais Math.random) : le tirage d'un
// duel doit être DÉTERMINISTE — même graine, même partie, donc testable et
// stable si le composant client se re-render.
export function shuffleWith<T>(rng: () => number, arr: readonly T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Un entier de [min, max] inclus, tiré du PRNG.
export function intBetween(rng: () => number, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1))
}

// Choisit `n` valeurs distinctes d'une liste de candidats (dédupliqués), dans
// l'ordre mélangé — sert à composer 3 leurres sans doublon. Renvoie moins de
// `n` éléments si les candidats distincts ne suffisent pas.
export function pickDistinct<T>(
  rng: () => number,
  candidates: readonly T[],
  n: number,
): T[] {
  const unique = candidates.filter((v, i, all) => all.indexOf(v) === i)
  return shuffleWith(rng, unique).slice(0, n)
}
