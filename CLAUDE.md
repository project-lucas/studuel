@AGENTS.md

# Scolaria — guide agent

Application de soutien scolaire gamifiée (6e → Terminale), interface **entièrement en français**. Next.js 16 App Router + React 19 + Supabase (auth, Postgres, RLS) + Tailwind CSS 4.

## Commandes

```bash
npm run dev        # serveur de dev (localhost:3000)
npm run build      # build de production
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
npm test           # Vitest (tests unitaires de lib/)
```

## Architecture

- `app/` — pages App Router. Onglets principaux : `amis`, `reviser`, `defi` (central), `moi`, `tresor` ; plus `test` (sessions de quiz), `onboarding`, `login`, `compte`, `studio`, `parents` (espace parents : programme de vidéos du coach) et `admin` (studio de contenu, gardé par `is_admin`). Les mutations passent par des Server Actions (`actions.ts` à côté de la page). `app/api/` pour les rares routes API, `app/auth/callback` pour le retour d'auth Supabase.
- `components/` — composants React clients ; primitives dans `components/ui/` (shadcn/radix).
- `lib/` — **toute la logique métier est pure et testable ici** (srs, streak, xp, mastery, defi-modes, bosses, compagnon, tresor, capacity, habits, trajet…), chaque module avec son `*.test.ts` à côté. Clients Supabase dans `lib/supabase/` (`server.ts` / `client.ts`).
- `supabase/` — migrations SQL numérotées (`schema.sql`, `002_…` → `029_…`, plus les seeds de contenu `030+`), **exécutées à la main** dans le SQL Editor du dashboard, jamais par un outil. Elles doivent rester idempotentes.
- `proxy.ts` — rafraîchit la session Supabase avant chaque rendu (remplace le middleware).

## Règles du projet

- **Logique métier dans `lib/`, pas dans les composants** : fonctions pures + tests Vitest. Les pages/actions ne font qu'orchestrer.
- **Sécurité par RLS** : le serveur n'utilise que la clé anonyme Supabase. Toute nouvelle table doit avoir ses policies RLS dans sa migration.
- **Nouvelle migration = nouveau fichier numéroté idempotent** dans `supabase/` (ne jamais modifier une migration déjà exécutée) ; signaler à l'utilisateur qu'il doit l'exécuter à la main.
- **Dates** : jours = clés UTC `YYYY-MM-DD`, semaine commence lundi (index 0). Heures « élève » (créneaux de trajet) en Europe/Paris. Helpers dans `lib/time.ts`.
- **UI en français** uniquement (textes, labels, messages d'erreur).
- **Design system « Toque & Gland »** : couleurs par rôle sémantique via les tokens Tailwind/CSS existants (marine `primary` = action/marque, orange `highlight`/`accent` = progression/récompense, flamme ambre→orange = série uniquement, palette `.rev-*` sur Réviser) — pas de couleurs hex en dur hors flamme, pas d'orange comme couleur d'action.
- Pas de commit sans demande explicite de l'utilisateur.

## Navigation du code (graphify — par défaut)

Un graphe de connaissances du projet vit dans `graphify-out/` (code + docs). **Avant de fouiller le code pour une question d'architecture** (« où est géré X », « qui appelle Y », « qu'est-ce qui dépend de Z »), **interroge le graphe** au lieu de lire/grep des dizaines de fichiers — c'est plus rapide et ça économise des tokens :

```powershell
& (Get-Content graphify-out\.graphify_python) -m graphify query "ta question"
```

- Le graphe **se rafraîchit tout seul après chaque commit** (hook `post-commit`, code uniquement, **zéro token**). Reconstruire à la main : `graphify update .` (code seul, gratuit) ou `/graphify` (complet, ré-inclut les docs).
- Graphe **local** (dans `.gitignore`). Après un nouveau clone, réinstaller les hooks : `graphify hook install`. S'il manque, le construire une fois avec `/graphify`.

## Références

- `PRD.md` — vision produit
- `README.md` — mise en route
- `docs/nano-banana-prompts.md` — prompts de génération des visuels (arènes, vignettes)
