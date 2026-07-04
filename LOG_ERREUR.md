# LOG ERREUR — Session autonome du 2026-07-04

> ✅ **RÉSOLU (2026-07-04)** : les scripts SQL ont été exécutés dans Supabase.
> Vérifié : tables créées, seed présent, RLS active (contenu premium bloqué
> pour les non-abonnés), catalogue et quiz fonctionnels sur /test.

## 🔴 Blocage : la base Supabase est vide (aucune table créée)

**Constat.** Test de connexion à l'API REST Supabase (`fzwcfmwanivtkxsfpsct.supabase.co`)
avec la clé publishable :

```
GET /rest/v1/courses  → PGRST205 "Could not find the table 'public.courses'"
GET /rest/v1/quizzes  → PGRST205 "Could not find the table 'public.quizzes'"
GET /rest/v1/profiles → PGRST205 "Could not find the table 'public.profiles'"
```

Le script `supabase/schema.sql` (généré à l'étape 1) **n'a pas encore été exécuté**
dans le projet Supabase. Je ne peux pas l'appliquer moi-même : je n'ai ni le mot de
passe base de données ni la clé `service_role` (choix Option A — c'est très bien ainsi).

**✅ Action à faire à ton retour (2 minutes) :**
1. Ouvre **Supabase Dashboard → SQL Editor → New query**.
2. Colle et exécute **`supabase/schema.sql`** (tables du PRD + RLS).
3. Colle et exécute **`supabase/002_quizzes.sql`** (module Test : `quizzes`,
   `quiz_questions`, RLS + 3 quiz de démo, dont 1 gratuit).
4. Recharge http://localhost:3001/test — le catalogue doit apparaître.

Les deux scripts sont idempotents (réexécutables sans erreur).

## 🟠 Non bloquant, à savoir

- **Pas d'authentification implémentée** : tout visiteur est traité comme non
  connecté → seuls les quiz `is_free` sont jouables ; les quiz premium
  apparaissent verrouillés 🔒 avec un message « Offre 1 ». La logique
  d'abonnement (PRD) est appliquée **à deux niveaux** : côté serveur Next
  (`lib/subscription.ts`) et côté base (policy RLS sur `quiz_questions`).
  Prochaine étape naturelle : pages login/signup Supabase Auth.
- **v1 du quiz** : la correction se fait côté client (les bonnes réponses sont
  incluses dans les données envoyées au navigateur). Acceptable pour des quiz
  d'entraînement ; à durcir si un jour les tests deviennent notés/certifiants.
- L'app reste **entièrement fonctionnelle sans la base** : la page Test affiche
  un état d'erreur explicite au lieu de planter.

## ✅ Travail réalisé pendant la session (aucune autre erreur)

- `PRD.md` sauvegardé à la racine (contenu collé en chat + annexe des décisions).
- `supabase/002_quizzes.sql` : tables + RLS + seed (3 quiz, 10 questions).
- `lib/subscription.ts` (tiers + gating Offre 1), `lib/types.ts`.
- `/test` : catalogue dynamique depuis Supabase, groupé par matière, badges 🔒.
- `/test/[id]` : session de quiz (QCM + Vrai/Faux), correction immédiate,
  explication, score final, bouton recommencer.
- Vérifié : typecheck TS ✅, routes HTTP 200 ✅ (états d'erreur propres tant que
  la base n'est pas initialisée).
