# Prompt de démarrage — Scolaria, application de suivi et coaching scolaire

> À coller tel quel dans une session Claude Code ouverte dans le NOUVEAU dossier (vide).

---

Tu démarres une nouvelle application, **Scolaria**, dans ce dossier vide. C'est la version **coaching** de Studuel, l'app de soutien scolaire gamifiée qui vit dans `C:\Users\potier\Documents\scolaria-app` (Next.js 16 App Router, React 19, Supabase avec auth + Postgres + RLS, Tailwind CSS 4, Vitest, interface entièrement en français). Lis d'abord son `CLAUDE.md`, son `AGENTS.md` et `docs/template-matiere.md` : toutes les conventions de Studuel s'appliquent ici, sauf ce que ce prompt change. Le nom « Scolaria » remplace « Studuel » partout dans l'interface, le manifest et les métadonnées.

## 1. Le produit

Studuel est B2C : l'élève joue seul contre les autres. Scolaria est une app de **coaching** : un **coach scolaire humain** (l'utilisateur de ce dépôt, pour commencer) suit des élèves (6e → Terminale), pose leur planning de la semaine, fixe leurs habitudes, lit ce qu'ils font et ajuste. L'élève ouvre l'app chaque jour pour voir sa semaine, réviser, cocher ses habitudes et faire son check-in du soir. Les parents lisent le journal du coach.

**Trois interfaces, et seulement trois** : l'app de l'élève (mobile, 5 onglets), l'interface du coach (web, bureau), l'interface des parents (lecture). C'est le périmètre. Les établissements scolaires (organisations, classes, plusieurs référents) viendront peut-être plus tard : **ne les construis pas**, mais modélise le lien coach ↔ élève dans une table de liaison (`coach_eleves`) et non dans une colonne de `profiles`, pour qu'une couche « organisation » puisse se poser dessus sans tout casser.

Le cœur du produit est une boucle : **le coach pose le plan → l'élève l'exécute et se raconte chaque soir → les données remontent au coach → il ajuste.** Tout ce qui ne sert pas cette boucle est retiré.

**On enlève tout le PvP et toute l'économie** : pas de duel, pas de trophées, pas de ligues, pas de clans, pas de boss ni de gardiens, pas de boutique, pas de gemmes ni d'écus, pas de saison ni de Pass. L'XP reste comme mesure de l'acquis (elle mesure ce qui est appris, pas ce qui est joué), la série (flamme) reste, la mascotte et le feedback façon Duolingo restent.

## 2. Ce qu'on copie de Studuel

Étape 0, avant toute chose : **copie le dépôt Studuel dans ce dossier** (tout sauf `.git`, `node_modules`, `.next`, `graphify-out`, `_ASSOCIE`, `.env*`), puis `git init` propre. On part du code existant, on ne réécrit rien qui marche. Réutilise tel quel :

- l'auth Supabase, `proxy.ts`, les clients `lib/supabase/*`, l'onboarding `/bienvenue` (réduit : plus d'écran sur les défis) ;
- **le catalogue complet** (matières, chapitres, fiches, quiz, questions) et toutes ses migrations de contenu ; le moteur de questions Leitner, la maîtrise (`lib/mastery*`), `lib/postgrest-pages.ts` (`toutLire`, plafond PostgREST de 1 000 lignes) ;
- l'onglet **Réviser** en entier (`app/reviser`, `components/reviser`, `components/carnet`, examen blanc, cours) ;
- le **carnet** type Wooflash (`lib/carnet/*`, `lib/carnet-cours.ts`, planning par dossier, `PlanSheet`, `PlanningSemaine`, planning à rebours avant un contrôle) ;
- les **habitudes** (`lib/habits.ts`, `app/habitude`, jours + heure + auto-validation) et `lib/trajet.ts` ;
- **Marcel** (`app/marcel`, `components/marcel`, ses 8 modes et leurs teintes) ;
- l'onglet **Moi** (profil, couronnes par matière, capacité) sans la vitrine PvP ;
- l'**espace parents** (`app/parents`, `lib/parents*`) ;
- `components/PrechargeurOnglets.tsx` et `lib/precharge-onglets.ts` (préchargement un par un, jamais de `prefetch` sur les liens d'onglet) ;
- le design system entier (`globals.css`, tokens, `.rev-*`, `.moi-*`, `.onb-*`, `.outil-*`), Nunito + Baloo 2, la mascotte, les illustrations de matières et d'onglets.

**Supprime** : `app/defi`, `app/amis`, `app/tresor`, `app/coffre`, `app/parrain`, `components/defi`, `components/duel`, `components/jeux`, `components/palmares`, `components/AmisHome.tsx`, `components/TresorHome.tsx`, `components/BossMode.tsx` et les autres modes d'arène, `lib/duel`, `lib/defi-modes*`, `lib/bosses*`, `lib/saison*`, `lib/rank*`, `lib/tresor*`, `lib/jeux`, `lib/palmares`, `lib/geo`, les images de boss et d'arène dans `public/images`. Après suppression, `npm run typecheck`, `npm run lint` et `npm test` doivent passer : nettoie chaque import cassé, ne laisse pas de code mort.

## 3. La navigation de l'élève : 5 onglets

Même barre que Studuel (5 onglets, le central plus grand), même préchargement un par un. De gauche à droite :

1. **Réviser** (`/reviser`) — identique à Studuel. Un seul ajout : les chapitres marqués **prioritaires par le coach** remontent en tête du dossier de matière avec une pastille.
2. **Carnet** (`/carnet`) — le Wooflash propre à l'élève : ses cours importés ou saisis, ses cartes, sa révision espacée, ses stats par cours. Le coach peut y déposer un cours ou des cartes, et voir ce qui a réellement été révisé.
3. **Semaine** (`/semaine`, **onglet central**, remplace Défi) — la vue de la semaine : créneaux de révision posés par le coach (chapitre + mode : fiche, quiz, flashcards), habitudes du jour à cocher, rendez-vous de coaching, contrôles à venir avec planning à rebours. En bas, le **check-in du soir** en 30 secondes : heure de coucher, qualité de sommeil (3 niveaux), repas (petit-déj oui/non, repas équilibré oui/non), sport (minutes), écran (tranche), humeur (5 visages). C'est l'écran d'accueil après connexion.
4. **Marcel** (`/marcel`) — le coach IA, mêmes modes. Il **connaît le planning et les consignes du coach humain** (injectés dans son contexte) et **rend compte au coach** de chaque échange (résumé stocké, lisible dans l'espace coach). Marcel travaille entre deux séances, le coach pilote.
5. **Moi** (`/moi`) — profil, maîtrise par matière, capacité, **tendances santé sur 4 semaines croisées avec les résultats** (« tes meilleures semaines de quiz sont celles où tu dors 8 h »), bilans de séance écrits par le coach, objectifs du trimestre.

## 4. L'espace coach (`/coach`, web, hors nav élève)

C'est ce qui n'existe pas dans Studuel et qui fait le produit. Rôle `coach` sur `profiles`, table `coach_eleves` (coach ↔ élève, avec RLS : un coach ne lit que SES élèves, un élève ne lit que lui-même). Écrans :

- **Vue globale** (`/coach`) — TOUS ses élèves sur un seul écran, en tableau dense : nom, classe, révisions de la semaine (faites / prévues), dernier check-in, sommeil moyen, prochain contrôle, alertes. Triés par urgence, les alertes en tête (trois nuits courtes, une semaine sans révision, un contrôle dans 5 jours sans planning, check-in manqué 3 jours de suite). Filtres par classe et par alerte. C'est l'écran d'accueil du coach.
- **Ajout d'élèves par lot** (`/coach/ajouter`) — le coach peut ajouter **une dizaine d'élèves d'un coup** : un champ texte où il colle une liste (prénom, nom, classe, email de l'élève, email d'un parent, une ligne par élève) ou un import CSV, avec aperçu et correction avant validation. Chaque élève reçoit une **invitation par email** (compte créé à la première connexion, rattaché au coach par `coach_eleves`) et chaque parent reçoit son lien. Un code d'invitation à 6 caractères sert de repli si l'email n'arrive pas. Jamais de création de compte un par un obligatoire.
- **Tableau de bord d'un élève** (`/coach/[eleve]`) — la semaine : révisions faites / manquées, scores, maîtrise par matière, check-ins (sommeil, repas, sport, écran, humeur), résumés des échanges avec Marcel.
- **Planning éditable** (`/coach/[eleve]/planning`) — le coach pose les créneaux (jour, heure, chapitre, mode, durée), fixe les habitudes et leurs jours, marque des chapitres prioritaires, dépose un cours ou des cartes dans le carnet. Réutilise la logique de `lib/carnet/planning.ts` avec un champ `auteur` (élève ou coach) ; ce que le coach pose, l'élève le voit dans Semaine sans pouvoir l'effacer, seulement le cocher.
- **Journal de séance** (`/coach/[eleve]/seances`) — notes après chaque rendez-vous, objectifs, bilan **envoyé aux parents** en un clic.
- **Consignes à Marcel** — un champ texte par élève, injecté dans le contexte de Marcel.

## 4 bis. L'interface des parents (`/parents`)

L'**espace parents** existant de Studuel est repris et recentré, en **lecture seule** : le journal de séance du coach, les objectifs du trimestre, la semaine de l'élève (révisions faites / prévues, sans le détail des scores question par question), les tendances santé sur 4 semaines (courbes, sans le détail des check-ins jour par jour) et un **bilan hebdomadaire par email** le dimanche soir. Pas de messagerie en V1. Un parent est rattaché à un élève par l'invitation du coach ou par un code que l'élève lui donne depuis `/compte` ; deux parents possibles par élève.

## 5. Le suivi santé : déclaratif, corrélé, consenti

Sommeil, alimentation, activité et écran pèsent sur l'attention et la mémorisation, c'est l'argument pour les parents. Trois règles non négociables :

- **Déclaratif et léger** : un seul check-in du soir, jamais de calories ni de balance. Le taux de réponse fait la valeur de la donnée ; l'app remercie et n'insiste jamais.
- **Corrélé, jamais diagnostiqué** : l'app montre des corrélations avec les résultats de l'élève, elle ne parle ni d'hormones, ni de santé, ni de trouble, et ne donne aucun conseil médical. Le coach interprète, l'app mesure.
- **Consentement explicite** : ce sont des données de santé de mineurs, sensibles au sens du RGPD. Case dédiée et distincte à l'inscription (table `consentements`), visibles du coach et des parents uniquement, jamais dans un classement, exportables et supprimables depuis `/compte`.

Logique pure dans `lib/sante-eleve/*` (check-ins, moyennes glissantes, corrélations, alertes), testée.

## 6. Direction artistique : la même que Studuel

Même monde **crème & violet** façon Duolingo, piloté par les tokens de `:root` : fond crème, encre marine, **violet = action et marque**, **jaune solaire = progression et récompense**, corail = alerte, flamme ambre → orange réservée à la série. Typo Nunito (corps) + Baloo 2 (titres). **Aucune couleur hex en dur** hors flamme. Mode sombre neutralisé (`<html class="light">`).

Ce qui change : les dérogations liées à l'arène (l'or du Duel, le colisée) disparaissent avec elle. L'onglet central **Semaine** prend la place du Défi avec la même importance visuelle, en violet, jamais en or. Le feu tricolore du tableau Progrès de Marcel et les teintes d'identité des outils de Marcel restent. L'espace coach reprend les mêmes tokens en version « bureau » (plus dense, tableaux, mais même palette et mêmes typos).

## 7. Conventions (rappel, inchangées)

- Logique métier **pure et testée dans `lib/`**, les pages et Server Actions orchestrent seulement.
- Un module `lib/*.ts` importé par un composant client n'importe ni `lib/catalog` ni `lib/supabase/*` (scinder en `*-server.ts`).
- **Sécurité par RLS**, clé anonyme seulement côté serveur, chaque nouvelle table livre ses policies dans sa migration. Attention particulière ici : coach, élève, parent sont trois rôles distincts, chaque policy doit le refléter.
- Migrations **idempotentes, numérotées, exécutées à la main** dans le SQL Editor (limite ~1 Mo par exécution). Garde les migrations copiées de Studuel telles quelles dans `supabase/` : l'utilisateur les rejouera lui-même, plus tard, par copier-coller sur un nouveau projet Supabase (les tables PvP inutiles ne gênent pas). **Ne bloque jamais sur l'absence de base** : le code tolère les tables manquantes comme Studuel le fait déjà, et tu écris les nouvelles migrations sans attendre qu'elles soient exécutées. Les migrations propres au coaching démarrent à **400**. Tiens à jour un fichier `supabase/A-EXECUTER.md` qui liste, dans l'ordre, tout ce que l'utilisateur devra coller le jour venu.
- Le nouveau projet Supabase devra être créé en **région Union européenne** (données de mineurs) : rappelle-le dans `A-EXECUTER.md`.
- Dates : jours en clés UTC `YYYY-MM-DD`, semaine commence lundi (index 0), heures élève en Europe/Paris, helpers dans `lib/time.ts`.
- Interface **100 % en français**.
- Pas de commit sans demande explicite.

## 8. Ordre de travail

Livre dans cet ordre, en vérifiant `typecheck` + `lint` + `test` à chaque étape, et fais un récap en français à la fin de chacune :

1. Copie du dépôt, renommage en Scolaria, suppression du PvP et de l'économie, nav à 5 onglets avec Semaine au centre (page vide mais stylée), tout vert. Création de `supabase/A-EXECUTER.md` avec l'ordre des migrations existantes à rejouer.
2. Onglet Semaine : créneaux + habitudes + contrôles à venir, puis check-in du soir (migration 400 : `checkins`, `consentements`).
3. Interface coach : rôle, `coach_eleves`, vue globale, ajout d'élèves par lot avec invitations (migration 401), tableau de bord d'un élève, planning éditable (migration 402), journal de séance (migration 403).
4. Interface parents : lecture du journal, de la semaine et des tendances, rattachement par invitation ou code, bilan hebdomadaire par email.
5. Marcel branché sur les consignes et le planning du coach, résumés d'échanges remontés (migration 404).
6. Moi : tendances santé × résultats ; Réviser : chapitres prioritaires ; alertes de la vue globale.
7. Passe DA : cohérence crème & violet sur les nouveaux écrans, mobile élève, bureau coach, parents.

Commence par l'étape 1. Avant de coder, dis en quelques lignes ce que tu vas faire.
