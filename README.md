# Scolaria

Application de soutien scolaire (6e → Terminale) : cours, quiz, révision espacée (SRS), examens blancs, modes de jeu compétitifs, coaching et suivi du temps de travail. Next.js 16 (App Router) + Supabase (auth, base, RLS), Tailwind CSS 4.

## Démarrer

```bash
npm install
npm run dev
```

L'app tourne sur [http://localhost:3000](http://localhost:3000).

Variables d'environnement attendues (`.env.local`) :

```
NEXT_PUBLIC_SUPABASE_URL=…
NEXT_PUBLIC_SUPABASE_ANON_KEY=…
OPENAI_API_KEY=…   # optionnel — génération de planning (app/planning)
```

## Base de données (Supabase)

Les migrations vivent dans `supabase/` et s'exécutent **à la main** dans le SQL Editor du dashboard Supabase, dans l'ordre (`schema.sql`, puis `002_…` → `024_…`). Elles sont toutes idempotentes : réexécutables sans erreur.

La sécurité repose sur les policies RLS définies dans ces fichiers — le serveur Next n'utilise que la clé anonyme.

## Scripts

| Commande            | Rôle                          |
| ------------------- | ----------------------------- |
| `npm run dev`       | serveur de développement      |
| `npm run build`     | build de production           |
| `npm run start`     | sert le build de production   |
| `npm run lint`      | ESLint                        |
| `npm run typecheck` | vérification TypeScript       |
| `npm test`          | tests unitaires (Vitest)      |

## L'app en bref

Navigation à cinq onglets :

- **Amis** — social : ligue, duels, duels fantômes contre de vrais joueurs
- **Réviser** — cours par matière/chapitre/leçon, flashcards, quiz, file « À revoir » (SRS J+1 → J+35), examen blanc avec bilan par chapitre
- **Défi** (onglet central) — 5 modes de jeu : Duel (BO3), Blitz, Chrono, Survie, Boss (rangs I → III par matière), mode du jour ×2 XP, boss de la semaine
- **Moi** — série (streak), missions du jour, compagnon tamagotchi, badges, temps de travail, calendrier de discipline
- **Trésor** — coffre quotidien, boutique, collection, récompense de connexion journalière

## Organisation

- `app/` — pages (App Router) : `reviser`, `defi`, `moi`, `amis`, `tresor`, `test`, `onboarding`, `login`, `compte`… + `app/api/` (routes API) et `app/auth/callback` (retour d'auth Supabase)
- `components/` — composants React (UI de base dans `components/ui/`)
- `lib/` — logique métier **pure et testable** (SRS, streak, XP, modes de défi, boss, compagnon, trésor…) + clients Supabase dans `lib/supabase/`
- `supabase/` — migrations SQL numérotées
- `docs/` — documents de travail (prompts de génération d'images…)
- `proxy.ts` — rafraîchit la session Supabase avant chaque rendu (ex-middleware)

Chaque module de `lib/` a son fichier de test à côté (`*.test.ts`, Vitest).

Conventions : les jours sont des clés UTC `YYYY-MM-DD` (lundi = 0) ; les heures « élève » (créneaux de trajet) sont interprétées en Europe/Paris ; l'interface est entièrement en français.

Voir `PRD.md` pour le produit et `CLAUDE.md` / `AGENTS.md` pour les consignes destinées aux agents.
