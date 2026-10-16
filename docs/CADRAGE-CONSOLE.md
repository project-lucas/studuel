# La console Studuel — coach et admin (16/10/2026)

Lucas : « prendre de l'avance sur mon espace coach […] des coachs que je recruterai, qui suivront x ou y élèves, moi aussi, mais qui suit l'admin ; il me faut un espace riche et dense ». Puis : « une icône messagerie pour envoyer des messages à tous mes users — mes coachés, les freemium, ou tout le monde », « des sondages de temps en temps », « tous les chantiers côté coach et admin d'abord pour le PC ».

## Deux espaces (16/10/2026)

Lucas : « Studuel c’est l’app ; Scolaria c’est le coaching scolaire qui utilise l’app Studuel ». La barre latérale a un sélecteur en tête :

- **Scolaria · le coaching** — Suivi (Élèves, Messages, Assistant IA) · Organisation (Groupes et codes, Coachs, Supervision) ; un coach non admin a aussi « Message à mes élèves ».
- **Studuel · l’app** (admin) — Pilotage (Vue d’ensemble, Rétention, Usage des écrans) · Contenu (Studio de contenu, À corriger) · Communication (Annonces et sondages) · Business (Abonnements, Coût de Marcel, Vidéos parents) · Technique (Santé, Erreurs).

Source unique : `lib/console/nav.ts` (`espacesConsole`, `espaceActif`).

## Ce qui est livré

| Chantier | Où | Migration |
|---|---|---|
| **La console** : une coque PC (barre latérale Coaching / Administration, tiroir sur téléphone), l'icône messagerie et ses non-lus en haut à droite | `components/console/ConsoleShell.tsx`, `lib/console/nav.ts` | — |
| **La messagerie** façon WhatsApp : coach ↔ élève, coach ↔ parent, élève + parent ; en direct (Realtime), photos et PDF, signalement, notification push | `/coach/messages`, `/messages` (élève, parent), `components/messagerie/*`, `lib/messagerie/*` | 587 |
| **La diffusion et les sondages** : un message ou un sondage à un public (mes coachés, un groupe ; gratuits, Studuel+, élèves, parents, tout le monde, par classe), fenêtre au lancement de l'app, push, portée et résultats | `/coach/diffusion`, `components/console/diffusion/*`, `components/annonces/AnnoncesVeille.tsx`, `lib/annonces/*` | 588 |
| **Les insights** : audience, activité, usage de chaque fonctionnalité (source d'XP), matières, jeux, Marcel, heures, achats, et les CONSTATS en phrases | `/admin/insights`, `lib/insights/*` | 589 |
| **À traiter** : questions les plus ratées (taux d'échec), quiz aux scores bas, chapitres jamais ouverts, erreurs de la semaine | `/admin/contenu` | 589 |
| **Le journal d'usage** : écrans vus, temps passé, recherches sans résultat, appareils — rien de personnel | `/admin/usage`, `lib/evenements*.ts`, `/api/evenements` | 590 |
| **Le suivi coach** : fiche d'entrée (point de départ), notes privées, objectif de la semaine (vu par l'élève), activité sur 8 semaines, actions groupées du tableau (écrire, objectif) | `/coach`, `/coach/eleves/[id]`, `components/coach/fiche/*`, `lib/coach/suivi*.ts` | 591 |
| **L'assistant IA (Claude)** : le tri du matin, le bilan de la semaine, les brouillons, le résumé d'un fil — Claude Sonnet 5.5, sorties validées par schéma, repli serveur en cas de refus | `/coach/assistant`, `lib/coach/assistant.ts`, `lib/coach/claude-server.ts` | 591 (cache) |
| **Les coachs** (admin) : nommer par e-mail, charge, inactifs, messages, fils en attente, retirer | `/admin/coachs` | 591 |
| **La supervision** (admin) : tous les fils en lecture, signalements à traiter | `/admin/supervision` | 587 |

## Les garde-fous (des adultes écrivent à des mineurs)

- Seul un coach (ou l'admin) **ouvre** un fil ; l'élève et le parent répondent.
- Un fil coach ↔ élève exige un **consentement** : parent lié dans l'app (automatique), sinon « consentement écrit recueilli » ou « élève majeur » coché par le coach — **tracé dans le fil**.
- **Rien ne s'efface** (ni fil, ni message, pas même par son auteur) ; **l'admin lit tout** ; **tout membre peut signaler** un message.
- Le **parent sait** qu'un fil existe entre le coach et son enfant (page `/messages`), sans en lire le contenu.
- Un coach dont l'élève quitte le groupe garde l'archive mais **ne peut plus écrire**.
- **Claude ne reçoit jamais un nom** : les élèves deviennent E1, E2… ; le prénom revient côté app (`[Prénom]`). Rien ne part sans que le coach relise.

## À faire par Lucas

1. **Exécuter 587 → 591** (dans l'ordre ; la 591 a besoin de la 587).
2. **Poser `ANTHROPIC_API_KEY`** sur Vercel (et dans `.env.local`) : sans elle, l'assistant dit qu'il n'est pas branché, tout le reste marche.
3. Vérifier que **Realtime** est actif sur le projet Supabase (la 587 ajoute `messages` à la publication `supabase_realtime`).

## Ce qui reste ouvert

- Les messages vocaux dans la messagerie.
- Un e-mail de consentement aux parents hors app (aujourd'hui : case cochée et tracée).
- Les seuils de statut réglables par coach, et le tri du matin envoyé tout seul chaque matin (cron + push au coach).
- L'aperçu `/dev/console` (sans compte) ne couvre pas la messagerie, qui lit la base en direct.

## La revue de sécurité du 16/10/2026 (aucun point critique, dix durcissements faits)

Un faux parent ne compte plus (seul un compte `profile_type = 'parent'` est parent d'un fil) ; un parent délié et un coach retiré perdent aussitôt l'accès à leurs fils ; « majeur » est refusé avant la terminale ; les fils sans parent lié sont listés dans Supervision ; le lien d'une annonce refuse `//site` ; un sondage anonyme ne rend ni la classe ni l'heure ; une fiche d'entrée par coach ; 80 travaux d'IA par coach et par jour, et les prénoms masqués dans les textes envoyés à Claude ; la notification push ne montre jamais le contenu d'un message ; le journal d'usage est borné par adresse IP.

**Reste hors chantier, à décider** : `link_child_by_code` (migration 044) laisse n'importe quel compte se lier comme « parent » à un élève dont il connaît le code ami. La messagerie l'ignore désormais, mais l'espace parents (`child_dashboard`) le lit encore : exiger `profile_type = 'parent'` (et idéalement la confirmation de l'enfant) dans une prochaine migration.
