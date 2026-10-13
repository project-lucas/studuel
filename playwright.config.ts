import { defineConfig, devices } from '@playwright/test'

// LE SMOKE TEST DE BOUT EN BOUT (12/10/2026) — `npm run e2e`.
//
// Un seul parcours, celui qu'un élève fait le soir d'un contrôle : j'ouvre
// Réviser, une matière, un cours, un quiz, puis les autres onglets — et les
// pages publiques (accueil, connexion, hors-ligne, page introuvable, la route
// des erreurs). Il ne remplace pas les 5 000 tests unitaires : il vérifie que
// l'app ASSEMBLÉE répond, à la largeur d'un téléphone.
//
//   npm run e2e                                  contre le serveur de dev
//   E2E_BASE_URL=https://… npm run e2e           contre la production
//   E2E_EMAIL=… E2E_PASSWORD=… npm run e2e       avec le parcours connecté
//
// Sans identifiants, le parcours connecté est SAUTÉ (pas en échec) : les
// pages publiques se testent toujours.
const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:3000'

export default defineConfig({
  testDir: 'e2e',
  timeout: 90_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL,
    locale: 'fr-FR',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    // L'app se joue à la verticale, sur un téléphone.
    { name: 'telephone', use: { ...devices['Pixel 7'] } },
  ],
  // Contre le serveur de dev : on réutilise celui qui tourne, sinon on le
  // lance. Contre une autre adresse, rien à lancer.
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:3000/hors-ligne.html',
        reuseExistingServer: true,
        timeout: 180_000,
      },
})
