// GÉNÉRÉ par `node scripts/cadres-profil.mjs` — ne pas éditer à la main.
//
// La fenêtre de chaque cadre de profil (lib/moi/cadre-profil), en % du carré
// de l'image : la photo se pose là, DERRIÈRE le cadre.

export type FenetreCadre = { left: number; top: number; width: number; height: number }

export const FENETRES_CADRES: Record<string, FenetreCadre> = {
  bronze: { left: 25.63, top: 26.23, width: 49.22, height: 47.91 },
  argent: { left: 25.53, top: 26.03, width: 49.22, height: 48.24 },
  or: { left: 25.63, top: 26.23, width: 49.22, height: 47.91 },
  platine: { left: 25.59, top: 25.96, width: 49.22, height: 48.23 },
  diamant: { left: 25.56, top: 25.66, width: 49.22, height: 48.89 },
  emeraude: { left: 25.55, top: 25.4, width: 49.22, height: 49.55 },
  rubis: { left: 25.61, top: 25.66, width: 49.22, height: 48.89 },
  legende: { left: 25.58, top: 25.47, width: 49.22, height: 49.55 },
}
