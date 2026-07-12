import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig } from 'vitest/config'

const root = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    // Même alias que tsconfig : '@/…' → racine du projet.
    alias: { '@': root },
  },
  test: {
    include: ['lib/**/*.test.ts'],
  },
})
