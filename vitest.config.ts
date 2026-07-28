import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig } from 'vitest/config'

const root = path.dirname(fileURLToPath(import.meta.url))
// Même alias que tsconfig : '@/…' → racine du projet.
const alias = { '@': root }

// Deux projets pour ne pas ralentir (ni polluer) la suite existante :
//   · « lib »        — logique pure, environnement node (1500+ tests rapides) ;
//   · « composants »  — tests d'ASSEMBLAGE des players/écrans, environnement
//     jsdom (@testing-library/react). C'est là que vivent les défauts que les
//     tests de lib/ ne voient pas : XP affichée ≠ versée, écran de fin qui ment,
//     double-tap qui désaligne les choix. `npm test` reste UNE commande verte.
export default defineConfig({
  resolve: { alias },
  test: {
    projects: [
      {
        resolve: { alias },
        test: {
          name: 'lib',
          include: ['lib/**/*.test.ts'],
          environment: 'node',
        },
      },
      {
        resolve: { alias },
        test: {
          name: 'composants',
          include: ['components/**/*.test.tsx', 'app/**/*.test.tsx'],
          environment: 'jsdom',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
    ],
  },
})
