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
- **Design system « crème & violet » (façon Duolingo)** : le monde visuel de l'onboarding `/bienvenue` étendu à toute l'app via les tokens sémantiques dans `:root` (globals.css). Fond **crème** `--background`, encre marine douce `--foreground`, **violet** `primary` = action/marque, **jaune solaire** `highlight`/`accent` = progression/récompense/XP, corail `destructive` = alertes, flamme ambre→orange = série uniquement. Typo **Nunito** (corps) + **Baloo 2** (titres). Utiliser les rôles sémantiques, **pas de couleurs hex en dur** hors flamme. Mondes scoping toujours en place : `.rev-*` (Réviser) et `.moi-*` (Moi) déjà violet+crème, `.onb-*` (onboarding), arène Défi : décor final « colisée doré » (`.arena-finale`) sur repli violet profond (`.defi-arena-bg`, voile violet en bas de `.arena-finale-veil`). Le mode sombre est neutralisé (`<html class="light">`). **Deux dérogations, assumées** : (1) sur l'arène `/defi`, la rangée de combat met le CTA **Duel 90 s en or** (`.olympe-gold`) entre deux tuiles sombres (`.arena-flank`) — sur un décor entièrement violet, le violet ne ressort pas, l'or si. Partout ailleurs l'or reste la couleur du gain. (2) le **tableau Progrès** de Marcel (`components/marcel/ProgresPanel.tsx`) juge la maîtrise au **feu tricolore** `success` → `warning` → `destructive` (vert/orange/rouge), et non violet/jaune : sur un écran de bilan, le jaune de la récompense se lisait comme une alarme de plus à côté du corail, et « acquis » en violet ne se distinguait pas de l'action. Ce sont des rôles existants de la DA, pas des couleurs inventées ; le violet y reste réservé aux boutons d'action (« +12 % »). Limité à ce tableau — les couronnes de Réviser gardent le violet.
- **Les outils de Marcel ont chacun leur teinte** (`data-teinte` + `.outil-*` dans globals.css) : le rail de `/marcel` mélange des modes du champ (fiche · rose, exercice · bleu, flashcards · vert) et des pages (mission · violet, méthode · indigo, oral · ambre, entraînement · corail, progrès · turquoise). **La couleur y est une IDENTITÉ, pas un rôle** — elle ne touche que l'icône, sa pastille et le liseré de la carte ; tous les boutons d'action restent violets. Huit cartes violettes ne se distinguaient pas les unes des autres, et il fallait relire chaque titre à chaque fois. C'est une dérogation étroite et documentée, comme l'or de l'arène et le feu tricolore du tableau Progrès : elle ne s'étend pas aux fonds, aux textes ni aux boutons.
- **Un dossier de matière ne montre que son programme** : les chapitres officiels en cartes (`chapters.theme`), leurs fiches dessous, rien à côté — ni axe culturel isolé, ni fiche de synthèse maison, ni chapitre hérité d'un vieux seed. Le design de référence et la marche à suivre sont dans `docs/template-matiere.md`.
- **Le duel classé est une COURSE** (`/defi/programme/[matiere]`, `components/duel/*`, logique pure dans `lib/duel/*`) : deux barres qui se remplissent à 1 000 points, la première pleine gagne, 90 s max, une question dorée (×2) par course, le rival répond EN MÊME TEMPS (ligne de temps rejouée). L'adversaire est un **vrai élève du même niveau rejoué** (table `duel_replays`, migration 351) et, à défaut, un **robot du banc** (`lib/duel/bots.ts`, 24 rivaux à tempérament, toujours marqués « IA », jamais d'établissement réel). Le serveur (`app/defi/duel-course-actions.ts`) refabrique le rival depuis la graine ou la base et n'accorde les trophées que sur SON verdict — les points ne sont jamais stockés, seuls les pas le sont. Le choix de matière (roulette + bouton DUEL, trophées par matière × jeu) ne change pas. La course est en plein écran (`lib/quiz-chrome`) et sonne « cuivre » ; ses sons propres vivent dans `lib/duel/audio.ts` (`duelSfx`).
- **Les onglets sont préchargés par `components/PrechargeurOnglets.tsx`, un par un** (règle dans `lib/precharge-onglets.ts`, mesures et protocole dans `docs/latence.md`). Ne jamais remettre `prefetch` sur les liens d'onglet ni `router.prefetch` dans SwipeTabs : en rafale, l'app se sature elle-même (503). Et un module `lib/*.ts` importé par un composant client n'importe ni `lib/catalog` ni `lib/supabase/*` — sinon supabase-js (57 Ko) part dans le bundle : scinder en `*-server.ts` (ex. `lib/mastery-server.ts`).
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
- `docs/template-matiere.md` — **le template d'une matière** : le design de l'onglet Programme (chapitres du programme en cartes, fiches dessous), son contrat de données et la marche à suivre pour y ranger une matière de plus
- `docs/nano-banana-prompts.md` — prompts de génération des visuels (arènes, vignettes)
