# Migrations Supabase

Toutes les migrations s'exécutent **à la main**, dans le SQL Editor du dashboard
Supabase, et sont **idempotentes** (réexécutables sans erreur). Aucun outil ne les
lance automatiquement.

## Le rangement (depuis le 19/09/2026)

| Dossier | Ce qu'il contient | Fichiers |
|---|---|---|
| `schema/` | La structure : `schema.sql`, tables, fonctions (RPC), policies RLS, droits, index, correctifs de données | ~150 |
| `contenu/` | Les seeds de contenu : quiz, fiches, cours, chapitres, annales, capsules, exercices | ~225 (95 % du poids) |
| `outils/` | Des requêtes de diagnostic (`_mesurer-perf.sql`), jamais des migrations | 1 |

Le **numéro** reste l'ordre d'exécution, quel que soit le dossier. Une nouvelle
migration prend le numéro suivant et va dans `schema/` ou `contenu/` selon sa nature.
Le nom de fichier est la clé partout (tests miroirs, `lib/sante.ts`, générateur de
lots) : le rangement n'y change rien.

**Le nombre de fichiers n'a aucun effet sur l'app.** La base n'exécute une
migration qu'une fois, quand on la colle ; elle ne relit jamais ce dossier. La
vitesse de l'app dépend des requêtes faites à chaque écran, pas de l'historique.

## Ce qui reste à exécuter en production

**Au 16/10/2026 : la 586 est EXÉCUTÉE en production** (essai annulé puis passage). Pour mémoire — la migration (`schema/586_examen_dossier_garde.sql`, relecture de la 585) : les fonctions d’écriture du dossier d’oral exigent Studuel+ (`rente_abonne`, 580 ; retirer une pièce reste libre), et `examen_oral_passage` compte le passage sans cocher l’étape « oral blanc ». Rejouée deux fois avec la 585 sur PGlite (25 vérifications). Prérequis : 580, 585. Non sondable à la clé anonyme ; contrôle : `select prosrc not like '%"oral": true%' from pg_proc where proname = 'examen_oral_passage';` → true.

**Au 16/10/2026 : la 585 est EXÉCUTÉE en production** (essai annulé puis passage ; contrôles : `examen_oral` et `examen_notes` en place avec RLS, les fonctions ouvertes à `authenticated` et fermées à `anon`, aucune insertion directe ; aucun ancien descriptif à reprendre). Pour mémoire — la migration (`schema/585_examen_dossier.sql`, LE MODE EXAMEN DANS LE BUREAU DE MARCEL, 16/10/2026 — Lucas : « il doit devenir à terme indispensable »). Elle crée `examen_oral` (le dossier d’oral : le projet du brevet, la liste de textes du bac de français — 30 au plus —, les deux questions du Grand oral, chacun avec ses étapes et ses oraux blancs) et `examen_notes` (les notes du simulateur « Ce qu’il te faut en juin »), lisibles par l’élève seul, écrites seulement par `examen_oral_ajouter`, `examen_oral_ajouter_liste`, `examen_oral_modifier`, `examen_oral_etape`, `examen_oral_passage`, `examen_oral_retirer` et `examen_notes_enregistrer` ; elle reprend l’ancien descriptif (`profiles.oral_texts`, 156) pour qui n’a encore aucun texte. Rejouée deux fois sur PGlite (23 vérifications). Sans elle, l’onglet Examen marche mais le dossier d’oral dit « ouvre très bientôt ». Contrôle : `select public.examen_oral_retirer('00000000-0000-0000-0000-000000000000');` → false.

**Au 16/10/2026 : la 584 est EXÉCUTÉE en production** (essai annulé puis passage ; contrôles : les deux tables en place avec RLS, les trois fonctions ouvertes à `authenticated` et fermées à `anon`, aucune écriture directe possible). Pour mémoire — la migration (`schema/584_marcel_carnet.sql`, LE CARNET DE MARCEL, 16/10/2026 — Lucas : « Marcel doit connaître le user, très bien même »). Elle crée `marcel_carnet` (la carte d’identité de la première rencontre : passion, matière préférée, bête noire, objectif, moment de travail — des valeurs de listes fermées) et `marcel_notes` (ce que l’élève a confié, 200 caractères, 30 notes au plus), lisibles par l’élève seul, écrites seulement par `marcel_identite_enregistrer`, `marcel_notes_ajouter` et `marcel_note_effacer`. Sans elle, l’onglet « Toi » du bureau de Marcel ne garde rien ; le reste marche. Idempotente, sans prérequis. Contrôle : `select public.marcel_note_effacer('00000000-0000-0000-0000-000000000000');` → false.

**Au 16/10/2026 : les 579 → 583 sont EXÉCUTÉES en production** (jeton collé par Lucas, `migrer.mjs` du scratchpad de la session 11997909 : pour chacune un essai en transaction annulée puis le passage réel ; la 583 d’abord). Contrôles : déclencheur `profiles_garde_coach` posé, deux couples arts plastiques au catalogue, `rente_gemmes` · `recharges_marcel` (3 recharges) · `marcel_usage` · `prepa_sup_interet` en place avec RLS, `rente_recolter` ouverte à `authenticated` et fermée à `anon`, `unlock_chapter_with_gem` qui ne regarde plus l’abonnement. Sonde : « Rien à coller ».

**Au 14/10/2026 soir : la 576 est EXÉCUTÉE en production** (jeton collé par Lucas, `executer-schema.mjs` du scratchpad de la session d68c343f, même méthode que le Sport du matin : essai en transaction annulée, passage, rejeu, mesure — Coach Turbo disponible le vendredi et pas le mercredi, plafond 40, `traque_credit` du jour même, `traque_victoire` qui paie des gemmes, aucune `traque_defier`). Rien ne reste à exécuter. Pour mémoire — la migration (`schema/576_traque_rarete_gemmes.sql`, LA RARETÉ DES GARDIENS ET LEURS GEMMES, 14/10/2026 — Lucas : « il faut faire comme Genshin Impact, créer la rareté : tous les boss ne sont pas disponibles chaque jour, certains le lundi, d'autres le mardi, et le week-end chacun est disponible ; eux permettent de gagner des gemmes », puis « la barre de progression se réinitialise à 0h00, pas de boss rempli à l'avance, il doit travailler le jour J où le boss est dispo »). Ce qu'elle change : `traque_en_chasse(boss, jour)` devient la DISPONIBILITÉ — un jour de semaine par gardien pour les seize du catalogue (lundi delta · imperator · nova, mardi grammatork · plasma · fiscus, mercredi chronos · bigben · sphinx, jeudi mitochondrix · eltoro · mecatron, vendredi kaiser-fang · krach · coach-turbo · bugzilla), le week-end tous, Nox le dimanche seulement (jusqu'ici ce n'était qu'un bonus ×2 d'XP) ; `traque_credit` ne crédite la jauge QUE si le gardien est disponible ce jour-là (sinon rien ne bouge, `en_chasse: false`), et LA REMET À ZÉRO AU PREMIER CRÉDIT D'UN NOUVEAU JOUR (`day_key` ≠ aujourd'hui → points 0 ; une fenêtre de combat encore ouverte survit à minuit, une fenêtre passée la veille ne « repart pas de la moitié » : la nuit a tout effacé) ; `traque_victoire` verse une XP FIXE (30 · 45 · 60 par rang, Nox 90 — plus de ×2, puisqu'on ne combat qu'un gardien disponible) ET des GEMMES (5 · 8 · 10 par rang, Nox 20), dans un plafond de 40 par semaine (`traque_gems_week_cap`, lundi UTC ; source `traque_win` de `gem_events`, clé boss + instant de sortie : une sortie ne paie jamais deux fois ; `capped` dit si le plafond a rogné). Un brouillon du même jour avait une RPC `traque_defier` et des états « prêt / attente » (jauge pleine qui attendait son jour) : abandonnés sur la consigne « pas de boss rempli à l'avance » — la migration la DROP si jamais elle existait. Idempotente (CREATE OR REPLACE), prérequis 212 · 213 · 557. REJOUÉE DEUX FOIS SUR PGLITE (banc `rejeu-576-v2.mjs` du scratchpad de la session d68c343f : jour off → aucun crédit, pas de sortie ; jour on → sortie au seuil, victoire 30 XP + 5 gemmes, jamais deux fois ; remise à zéro la nuit ; fenêtre vivante à minuit gardée ; fenêtre passée la veille → zéro, passée le jour même → la moitié ; plafond 40 ; plafond du jour 150 ; calendrier ; anonyme). Miroirs TS testés : `lib/traque.ts` (calendrier, `pointsDuJour`, barèmes), `lib/economie.ts`, `lib/bosses-mirror.test.ts` (relit le SQL). Contrôle après exécution : `select public.traque_en_chasse('coach-turbo', date '2026-10-16'), public.traque_gems_week_cap();` → true, 40. Non sondable (les fonctions existent depuis la 212).

**Au 14/10/2026 soir : la 577 est EXÉCUTÉE en production** (même méthode ; mesure : `connexion1` à 10 XP au catalogue, `quest_claim` à quatre identifiants, le coffre dès que toutes les quêtes demandées sont finies — l'app en ligne, qui en demande trois, continue d'ouvrir son coffre). Pour mémoire — la migration (`schema/577_quete_connexion.sql`, LA MISSION « SE CONNECTER », 14/10/2026 — Lucas : « autre mission journalière : se connecter, facile, rapide et gain de récompenses »). `quest_catalog()` gagne `connexion1` (objectif 1, 10 XP) en TÊTE des quatre quêtes du jour (miroir de `lib/quests.QUEST_CATALOG`, dans le même ordre), et `quest_claim` est recopiée de la 557 avec QUATRE identifiants acceptés et le coffre du jour (100 XP) quand TOUTES les quêtes demandées sont finies (trois pour l'app d'avant le déploiement, quatre pour la nouvelle : elle peut donc passer AVANT le déploiement). La quête se boucle toute seule : la route GET `/api/quetes`, que le bandeau relit au lancement, appelle `advanceQuests({ connexions: 1 })` au premier passage du jour (une écriture par jour). ⚠️ Sans elle, une fois le code déployé, LE COFFRE DU JOUR NE S'OUVRE PLUS (l'app envoie quatre identifiants, l'ancienne `quest_claim` en refuse plus de trois) : l'exécuter AVANT le déploiement. REJOUÉE DEUX FOIS SUR PGLITE (banc `rejeu-577.mjs` du scratchpad de la session d68c343f : catalogue, `quest_save_progress` de la 205 qui garde `connexion1`, encaissement partiel 40 XP sans coffre, journée bouclée 60 + 100, ré-encaissement à zéro, trois identifiants finis payés avec le coffre (l'app d'avant), deux finies sur trois sans coffre, cinq refusés, anonyme). Contrôle : `select * from public.quest_catalog() where id = 'connexion1';` → `connexion1 1 10 0`.

**Au 14/10/2026 soir : la 578 est EXÉCUTÉE en production** (même méthode ; mesure : 5 couples Musique/Sport dans `game_catalog`, 3 modes dans `mode_catalog`). Pour mémoire — la migration (`schema/578_jeux_musique_sport.sql`, LES JEUX DE MUSIQUE ET DE SPORT, 14/10/2026 — Lucas : « trouve-moi des modes de jeu pour le sport, la musique », « un mode sur les instruments, un mode qui a composé », « pour le sport un mode proche de l'anatomie, notamment sur les muscles »). Deux INSERT idempotents : `game_catalog` (la liste blanche d'`apply_game_trophies`, 238) reçoit `musique` × (classe-instrument, qui-a-compose, programme) et `sport` × (muscles-express, programme) ; `mode_catalog` (le palmarès, 352/355) reçoit les trois jeux aux bornes communes (30 000 points, 1 ms par point). Sans elle, les jeux se jouent mais leurs trophées sont refusés et leurs scores ne se classent pas. Rejouée deux fois sur PGlite (`rejeu-578.mjs`). Les miroirs TS (`lib/trophy-catalog.test.ts`, `lib/palmares/epreuves.test.ts`) relisent la 238 ∪ 578 et la 355 ∪ 578. Contrôle : `select * from public.game_catalog where subject_slug in ('musique', 'sport');` → 5 lignes. « Classe-moi le sport », écrit puis retiré le même jour (Lucas), n'y figure pas.

**Au 14/10/2026 : les 565 → 575 sont EXÉCUTÉES en production** (par l'API de gestion avec le jeton collé par Lucas : pour chacune un essai en transaction annulée, le passage réel, puis un rejeu de la 565 et de la 575 ; mesure finale : 70 chapitres, 70 leçons, 70 quiz, 823 questions, 210 exercices, 210 contrôles, zéro quiz orphelin, `subjects.levels` avec `1re` ; `npm run sonde` voit les 565 → 568, les 569 → 575 sont non sondables par conception). **Les 70 fiches PDF et leurs pages floutées sont DÉPOSÉES** dans Storage le même jour (clé service lue par l'API de gestion, jamais écrite) : vérifié par `storage.objects`, 70 + 70. Rien ne reste à exécuter. Pour mémoire — LA MATIÈRE SPORT REFAITE EN CULTURE SPORTIVE (Lucas : « on refait donc tout le sport en entier » ; cadrage, programme et règles de ton dans `docs/CADRAGE-SPORT.md`). **565 → 568**, les quatre blocs de cours (`contenu/565_sport_6e_5e.sql`, `566_sport_4e_3e.sql`, `567_sport_2de_1re.sql`, `568_sport_tle.sql`) : 70 chapitres (10 par niveau, 6e → Tle), 70 leçons, 70 quiz, 823 questions — la banque de Coach Turbo. Chaque bloc fait d'abord le MÉNAGE de ses niveaux : les anciens chapitres d'EPS dont l'identifiant n'est pas dans le bloc partent (cascade sur leçons, questions, cahier, contrôles, déblocages ; les QUIZ sont supprimés explicitement parce que `quizzes.lesson_id` est en ON DELETE SET NULL ; `review_items` à la main), le bac d'EPS de Tle garde son identifiant, et **la 567 rouvre la 1re générale** (`subjects.levels`, que la 278 avait retirée). **569 → 575**, le cahier d'exercices (30 exercices ★/★★/★★★) et les contrôles blancs (30 sujets, trois niveaux) de chaque niveau — 6e, 5e, 4e, 3e, 2de, 1re, Tle —, chacune APRÈS la migration de cours de son niveau (une ligne dont le chapitre manque est sautée). Les onze ont été REJOUÉES DEUX FOIS SUR PGLITE (banc `rejeu-sport.mjs` du scratchpad de la session d68c343f) : idempotence, cascades, matière témoin intacte, déblocages du bac conservés, zéro quiz orphelin, 210 exercices avec leurs clés et 210 contrôles. **Après exécution** : déposer les 70 fiches PDF (`SUPABASE_SERVICE_ROLE_KEY=… node scripts/fiches-deposer.mjs <niveau> sport` pour les sept niveaux) ; les PDF des 51 anciens chapitres restent dans le bucket, orphelins et sans porte.

**La sonde et le ménage du Sport (14/10/2026 soir).** Après les 565 → 568, `npm run sonde` réclamait « À COLLER : 216 → 339 » : les deux sondes visaient des chapitres de Sport que le ménage a retirés à dessein. Les coller aurait RECRÉÉ les anciens chapitres (21 pour la 216, 32 pour la 339 : `ON CONFLICT (id) DO NOTHING` sur un id absent, c'est une insertion) à côté de la culture sportive. La 216 est reciblée sur un chapitre d'EMC (« La justice en France », 5e — sa part EMC vit toujours) et ne doit pas être rejouée telle quelle ; la 339 est marquée **remplacée** (`remplaceePar` dans `lib/sante.ts`, `['remplacee', …]` dans la sonde CLI) : la sonde l'affiche « ∅ … NE PAS REJOUER », `/admin/sante` « remplacée — ne pas rejouer », et le générateur ne l'embarque jamais. Mesuré le même soir à la clé anon : 70 des 72 sondes par identifiant de chapitre étaient en place, les deux manquantes étaient celles-là.

**Au 13/10/2026 soir : la 564 est EXÉCUTÉE en production** (essai annulé, passage, rejeu ; `quest_catalog()` rend `lecon1 1 30 0 · reponses10 10 30 0 · partie1 1 30 0`). Rien ne reste à exécuter. Pour mémoire, **la 564** (`schema/564_quetes_trio_minimal.sql`, LE TRIO MINIMAL DES QUÊTES DU JOUR, 13/10/2026 — Lucas : « faciles, inciter à travailler, vérifiables sans erreur ») : `quest_catalog()` réécrite — `lecon1` (lire 1 cours, la lecture compte toute seule), `reponses10` (répondre à 10 questions, justes ou non), `partie1` (faire 1 partie) —, les variantes dures passant aux quêtes retirées. Prérequis : 205, 555, 557. Sans elle, « Lire 1 cours » avance mais les deux autres restent à zéro (`quest_save_progress` ignore un id hors catalogue).

**Au 13/10/2026 soir : les 562 et 563 sont EXÉCUTÉES en production** (par l'API de gestion avec le jeton collé par Lucas : essai en transaction annulée, passage réel, rejeu ; droits contrôlés — `anon` n'exécute ni `fiche_pdf_acces`, ni `ligue_ma_place`, ni `ligue_echelon_du_rival` ; `fiche_pdf_acces` rend `false` sans session et pour un chapitre fermé, `true` pour le chapitre déverrouillé de l'élève simulé). Les 260 PDF et leurs aperçus sont déposés dans Storage le même soir. Rien ne reste à exécuter. Pour mémoire, **la 563** (`schema/563_fiches_pdf_storage.sql`, LES FICHES DE RÉVISION EN PDF, 13/10/2026) : le bucket privé `fiches` (un objet par chapitre, `<chapter_id>.pdf`, 260 fiches du MVP), le bucket public `fiches-apercus` (l'illustration de chaque fiche en 360 px, pour la vendre), et `fiche_pdf_acces(p_nom)` — les trois portes de la 184 (administrateur, abonnement, chapitre déverrouillé en gemmes par `unlock_chapter_with_gem`), sur lesquelles s'appuie la policy de lecture du bucket : l'app signe l'URL avec la session de l'élève. Les fichiers se déposent ensuite avec `SUPABASE_SERVICE_ROLE_KEY=… node scripts/fiches-deposer.mjs` (depuis `fiches-out/`, hors git). Prérequis : 028, 183, 184. Sans elle, rien ne casse : la page Fiche vend et débloque comme avant, mais « Ouvrir la fiche » ne peut pas servir le PDF.

**La 562 reste À EXÉCUTER** (`schema/562_ligue_echelon_de.sql`, LA DIVISION DE LIGUE PARTOUT, 13/10/2026 — « une seule échelle, la division, gagnée à l'XP de la semaine » : les trophées ne sont plus un rang). Trois fonctions SECURITY DEFINER : `ligue_echelon_du_rival(p_replay)` (l'échelon de l'auteur d'une trace de `duel_replays` : la bannière de rang du rival sur l'écran de fin de duel), `ligue_ma_place()` (mon échelon, ma place et la taille de mon groupe en une lecture légère : « Ma ligue » du Classement de l'arène, la fiche de profil, la page de garde de Moi) et `fiche_joueur` (558) réécrite pour rendre aussi `echelon`. Prérequis : 351, 376, 558. Sans elle, rien ne casse : le rang se lit « Bronze 4 » sans place, un rival rejoué n'a pas d'étiquette, un robot prend la mienne.

**Au 13/10/2026 soir : la 561 est EXÉCUTÉE en production** (`schema/561_bascule_studuel_plus_test.sql` : `basculer_studuel_plus_test()`, un compte coach ou admin bascule SON abonnement entre gratuit et Studuel+, journalisé dans `subscription_grants` en source `test` — le bouton « Activer Studuel+ (compte coach) » de Mon compte ; essai annulé, passage, rejeu, anon refusé). Un seul compte porte ainsi les trois casquettes de Lucas : l'app élève, l'espace parents (`/parents` ne refuse que `'eleve'`) et l'espace coach (`est_coach()`), plus Studuel+ à la demande. Rien ne reste à exécuter.

**Au 13/10/2026 : les 558, 559 et 560 sont EXÉCUTÉES en production** (par l'API de gestion avec le jeton collé par Lucas : essai en transaction annulée, passage réel, second passage, droits contrôlés — anon ne lit ni le tableau du coach ni la fonction interne, anon signale une erreur et lit l'aperçu d'un code ; `npm run sonde` : « Rien à coller »). Le compte `potierlucas77@gmail.com` a reçu `profile_type = 'coach'` (il n'est pas admin ; `potierlucas77360@gmail.com` l'est). Rien ne reste à exécuter. Pour mémoire, **la 560** (`schema/560_coaching.sql`, LA COUCHE COACHING, v1). Elle étend `profiles.profile_type` à `'coach'` (la contrainte 048 est remplacée), crée `coach_groupes` (un groupe par coach : nom, catégorie, code à 8 caractères de l'alphabet du code ami, régénérable, archivable) et `coach_membres` (le rattachement d'un élève à un groupe, un seul actif par élève, révocable par l'élève ou le coach), les RPC du coach (`coach_creer_groupe`, `coach_renommer_groupe`, `coach_regenerer_code`, `coach_archiver_groupe`, `coach_retirer_eleve`, `coach_mes_groupes`, `coach_tableau` — une seule lecture pour tous les élèves : dernière activité, temps 7 j et 4 semaines, jours actifs, quiz, matière la plus faible —, `coach_fiche_eleve`) et de l'élève (`coach_code_apercu`, ouverte à `anon` parce que l'onboarding est public, `rattachement_par_code`, `mon_rattachement`, `rattachement_quitter`) ; `child_dashboard` (319) est refactorisée : son corps devient `eleve_tableau_de_bord` (inappelable directement) et deux portes le servent, parent et coach — même JSON. Un coach = `profile_type = 'coach'` ou un admin. Rejouée deux fois sur PGlite, 40 scénarios verts (création et droits, aperçu anonyme, rattachement et changement de groupe, tableau et agrégats, fiche, RLS, retirer / régénérer / archiver / quitter). Prérequis : 028, 044, 048, 084, 192, 200, 319. Sans elle, rien ne casse : « J'ai un code » répond « code inconnu », `/coach` dit que la migration manque, l'espace parents garde son `child_dashboard` d'avant.

**La 559 est exécutée le 13/10/2026** (voir ci-dessus). Pour mémoire, la 559 (`schema/559_erreurs_app.sql`, LA REMONTÉE DES ERREURS). La 559 crée la table `erreurs_app` (une ligne par plantage, navigateur ou serveur : message, nom, pile, page, `digest` de Next, contexte, navigateur, élève) et la RPC `erreur_signaler`, seule porte d'écriture (SECURITY DEFINER, ouverte à `anon` et `authenticated` — l'onboarding est public —, bornée à 60 lignes par élève par 10 minutes et 2 000 par heure, ménage à 30 jours au passage) ; lecture et suppression réservées à l'admin (`is_admin()`), sur `/admin/erreurs`. Prérequis : 028. Sans elle, rien ne casse : les pages d'erreur s'affichent, les rapports sont seulement perdus (journalisés sur la sortie du serveur).

**La 558 est exécutée le 13/10/2026** (voir ci-dessus). Pour mémoire, la 558 (`schema/558_amis_competition_defis.sql`, LES AMIS EN COMPÉTITION). Elle étend `classement_amis()` (l'XP et l'XP de la semaine : la « course » du carnet de Moi), donne aux duels entre amis un MODE DE JEU (`duels.mode_id`, borne de `total` portée à 100 000, un duel par ami et par jour au lieu d'un seul en tout — `create_duel` réécrite sur le nouvel index), crée `creer_defi_ami`, `defis_recus`, `defi_ami_cibles_push` (rôle service seulement : la notification de l'ami défié) et `fiche_joueur` (le résumé d'un ami ou d'un membre de la ligue). Rejouée deux fois sur PGlite, 16 scénarios verts (création, mode inconnu, pas ami, borne, défis reçus, une seule notification, fiche refusée à un inconnu et ouverte à la ligue, droits). À exécuter APRÈS la 557 ; sans elle, rien ne casse : le bouton Défier dit « arrive très bientôt », la course ne montre que les trophées et la fiche d'un joueur ne s'ouvre pas. La notification push demande `SUPABASE_SERVICE_ROLE_KEY` et les clés VAPID côté serveur (déjà posées pour les rappels).

**Au 04/10/2026 soir : la 557 est EXÉCUTÉE en production** (par l'API, après essai en transaction annulée, deux passages ; droits, RLS, gel à 20 gemmes et gemmes du cahier vérifiés). Rien ne reste à exécuter. Pour mémoire, **la 557** (`schema/557_economie_xp_partout.sql`, L'XP PARTOUT ET LES GEMMES RARES — barème dans `lib/economie.ts`). Elle crée `xp_activite` (l'XP de chaque activité, plafond par jour), `epreuve_recompenser` et `annale_commencer` (dictée, contrôle blanc, examen blanc, annale : XP et gemmes au-dessus d'un seuil, 40 par semaine au plus), les tables `xp_activite_jour` et `annales_travail`, et réécrit douze fonctions pour arrêter les gemmes faciles (niveau, série, quêtes, étoiles, coffre d'équipe, clan, Traque, chapitre à trois couronnes ; ligue ramenée au seul nouveau rang ; coffre de palier à 10), et remet le GEL DE SÉRIE au Marché à 20 gemmes. Rejouée deux fois sur PGlite, 50 scénarios verts (barème, plafonds, clés, épreuves et paliers de gemmes, plafond hebdomadaire, droits). À exécuter APRÈS la 556 ; sans elle, rien ne casse (les nouveaux appels échouent en silence journalisé, l'ancienne économie continue). ⚠️ Un seed de cahier (`contenu/4xx_exercices_*`) rejoué APRÈS elle remettrait les gemmes 5 / 10 / 15 : régénérer d'abord par `scripts/exercices-sql.ts` (il écrit désormais 0 / 0 / 5).

**Au 04/10/2026 matin : rien.** La **555** (`schema/555_quetes_trois_gestes.sql`, le catalogue SQL des quêtes du jour autour des trois gestes) et la **556** (`schema/556_niveau_paliers.sql`, les coffres de palier de niveau) sont passées par l'API de gestion, chacune essayée d'abord dans une transaction annulée, puis contrôlée : `quest_catalog()` rend 20 quêtes, `niveau_palier_reclamer` existe, ouverte à `authenticated`, fermée à `anon`. La 466 (corrections de cours du cahier) est bien appliquée : les fragments fautifs ne sont plus en base.

**Plus tôt le 03/10/2026 : rien.** Les 466 → 554 (corrections de cours et cahier de toutes les classes) sont passées par l’API de gestion et contrôlées : 8 841 exercices, les 2 947 chapitres de classe ont chacun leurs trois exercices et leurs clés. **Au 01/10/2026 dans la nuit : rien.** La **465** (`schema/465_classement_amis.sql`)
est passée la dernière : `classement_amis()`, qui sert le bloc « Toi et tes
amis » de l'onglet Moi — trophées et temps de travail de la semaine, pour
l'élève et ses amis acceptés. Essayée sur PGlite (rejeu double, périmètre,
droits), puis en production dans une transaction annulée, puis exécutée deux
fois (API de gestion) et contrôlée : la fonction existe, `SECURITY DEFINER`,
exécutable par `authenticated`, refusée à `anon`, et un élève n'y voit que son
cercle ; la sonde la marque ✓. ⚠️ La production n'avait ce soir-là **aucune
amitié** (9 profils) : le chemin « avec amis » n'a pu être vérifié que sur
PGlite. La 381 (`revision_par_quiz`) n'est plus appelée par l'app depuis que ce
bloc a remplacé « Tes matières » ; elle peut rester en base.

**Avant la 465 : rien non plus.** Mesuré en SQL (API de gestion), et non plus à la seule
clé anon : les 212 fonctions de la base sont identiques à leur dernière
définition dans les migrations, aucune policy n'appelle `auth.uid()` à nu,
aucune table n'est sans RLS, et les migrations « non sondables » (194 → 362,
340 → 350, 365) ont été contrôlées une à une. Ce qui suit est l'historique.

Mesuré par la sonde (`npm run sonde`, lecture seule, clé anon) le **22/09/2026**
(inchangé depuis le 19/09) :

**14 migrations absentes** : 353 · 354 · 355 · 363 · 364 · 366 · 367 · 368 · 369 ·
370 · 371 · 372 · 373 · 374 — dont deux de **performance** (354 : comptes du
catalogue en base ; 374 : fin de course en une transaction, Realtime par clé
primaire, index en double retirés) sur lesquelles le code tourne en mode
dégradé tant qu'elles dorment. Puis la **375** (ménage du schéma, audit du 22/09 :
`docs/audit-migrations.md`). Elles sont rassemblées, dans l'ordre, en **un seul
fichier** à coller, qui se termine par le filet RLS de la 320
(`SELECT public.optimiser_policies_rls();`) :

```bash
node _ASSOCIE/genere-a-executer.mjs   # sonde la base, écrit _ASSOCIE/a-executer.sql
```

puis coller `_ASSOCIE/a-executer.sql` en entier (Ctrl+A) → Run.

**Écrites depuis cette mesure**, dans l'ordre : 376 (ligue de la semaine) · 377
(tirelire d'amis) · 378 (crédits de Marcel, avatar dessiné) · **379 (coffre
d'équipe, qui remplace la tirelire : à coller APRÈS la 378)** · **380
(multiplicateur de gains d'XP : +0,1 par ami, ×2 sous potion ; APRÈS la 379)** ·
**381 (révision par quiz, pour le récap des matières de l'onglet Moi ; APRÈS la
380)**.
`npm run sonde` dit lesquelles manquent encore ; le générateur ci-dessus les
rassemble.

**Ensuite, `contenu/365_exercices_6e.sql`** : le catalogue d'exercices de 6e
dépend de la 364 (colonnes `difficulte` et `origine`). Sa sonde est impossible à la
clé anon, mais la 364 étant absente, la 365 n'a pas pu tourner.

Les migrations marquées `?` par la sonde (CREATE OR REPLACE, tables réservées aux
comptes connectés) sont invisibles à la clé anon **par conception**. Ce n'est pas
un retard ; ne les rejouer que si une voisine échoue.

## Le chantier « contenu 3e → Tle » : 382 → 420 (écrites les 26 et 28-29/09/2026)

Trente-neuf fichiers, **à coller dans l'ordre des numéros, un par un**. Tous sont
idempotents et ont été rejoués deux fois de suite sur un Postgres embarqué qui
reproduit le catalogue de production du 26/09 (1 672 fiches) : aucune erreur,
aucune fiche introuvable, la seconde passe ne change rien.

| N° | Ce que c'est | Dépend de |
|---|---|---|
| 382 | Rangement : anciens programmes du français 1re, rayons Langue/Culture, thèmes manquants | — |
| 383 (`schema/`) | Les 19 matières de la voie technologique | — |
| 384 | Anciennes fiches des options de Tle rattachées à leur chapitre | — |
| 385 → 387 | 243 fiches neuves de la voie générale (maths 3e/1re, œuvres du bac 2027, langues du lycée, options de Tle) | 382 |
| 388 → 392 | 386 fiches de la voie technologique (tronc commun, STMG, STI2D, STL, ST2S) | **383** |
| 393 → 397 | 6 168 questions de plus : les quiz passent de 8 à 12 questions (16 questions fausses corrigées) | — |
| 398 → 399 | 432 cours allongés ou corrigés | — |
| 400 → 419 | 6 123 sujets de contrôle blanc (3 par fiche, de la 3e à la Tle) | 364, **385 → 392** |
| 420 | 127 erreurs de cours et de quiz corrigées (remplacements ciblés, sources corrigées aussi) | 385 → 399 |

Les fichiers font de 450 à 760 Ko (les 341, 342 et 365, déjà passées, en
faisaient autant). `_ASSOCIE/genere-a-executer.mjs` n'en embarque qu'une partie :
382, 384 et 393 → 420 ne sont pas sondables à la clé anon. Les coller à la main.
Sources : `scripts/contenu/`, `scripts/complements/`, `contenu/controles/` ;
régénération : `scripts/seed-contenu.mjs --modules …`,
`scripts/seed-complements.mjs`, `scripts/controles-sql.ts`, `scripts/corrections-sql.mjs` (commande exacte dans
l'en-tête de chaque fichier).

## La suite : 421 → 430 (écrites les 29 et 30/09/2026), EXÉCUTÉES le 01/10/2026

382 → 420 sont passées en production le 29/09. Ces dix fichiers, rejoués deux
fois sur le catalogue de production du 29/09 (2 952 fiches), sont passés le
01/10/2026 par l'API de gestion (22 morceaux, aucune erreur) et ont été
vérifiés en SQL : 35 590 questions, 7 536 sujets de contrôle hors 6e, 51
exercices de cahier, aucune correction des 422 et 425 introuvable. **Toutes
les fiches du programme ont 12 questions** ; il ne reste sous ce seuil que les
22 fiches de culture générale de niveau « tous » (économie, entrepreneuriat,
figures historiques, finances personnelles, fiscalité), à 10 questions, qui
n'étaient pas dans le chantier.

Le même jour, la **365** (402 sujets de contrôle blanc de 6e) s'est révélée
absente — aucun sujet de 6e au catalogue — et a été exécutée : 402 sujets,
134 fiches sur 134.

| N° | Ce que c'est | Dépend de |
|---|---|---|
| 421 | Cahier d'exercices de 6e, première vague (51 exercices) | 372 |
| 422 | 19 cours mal affichés (tableaux collés, 12 programmes devenus des blocs de code) | — |
| 423 | 1 040 questions de plus, les 260 fiches de lecture de 1re | — |
| 424 | 944 questions de plus, fiches jumelles du collège | — |
| 425 | 17 erreurs de cours corrigées, dont une consigne de sécurité dangereuse en technologie 6e | — |
| 426 | 1 124 questions de plus, collège 5e et 4e | — |
| 427 | 504 questions de plus, 6e | — |
| 428 | 408 sujets de contrôle blanc, 5e | 364 |
| 429 | 225 sujets de contrôle blanc, 4e | 364 |
| 430 | 780 sujets de contrôle blanc, les 260 fiches de lecture de 1re (1,8 Mo : **découper** avec `_ASSOCIE/decoupe-migrations.mjs`, l'éditeur SQL tronque les gros collages) | 364 |

## Le cahier d'exercices de 3e, 1re et Tle : 431 → 455 (générées et EXÉCUTÉES le 01/10/2026)

Vingt-cinq fichiers, 2 199 exercices (3e 309, 1re 93, Tle 1 797), générés par
`scripts/exercices-sql.ts` depuis `contenu/exercices/` (commande exacte dans
l'en-tête de chaque fichier). Chaque fichier reste **sous ~300 Ko** : il crée
une table temporaire puis la verse, donc `_ASSOCIE/decoupe-migrations.mjs` ne
peut pas le couper — une matière trop lourde se partage avec `--fichiers`
(l'histoire-géo de Tle : 439 et 440). L'ordre entre eux est indifférent ;
prérequis : la 372.

Avant de passer, chaque fichier a été essayé sur la production dans une
transaction annulée (`BEGIN … ROLLBACK`). Après : 2 250 exercices en base
(les 51 de 6e compris), autant de clés, 9 060 questions ; le juge SQL
(`exercice_juger`) accepte la bonne réponse de chacune et refuse une réponse
vide ; un second passage ne change rien ; un élève de 3e ouvre l'exercice 1
d'un chapitre et trouve le 2 verrouillé.

| N° | Fichier | Exercices | Matières |
|---|---|---|---|
| 431 | `431_exercices_3e_1.sql` | 54 | français |
| 432 | `432_exercices_3e_2.sql` | 78 | histoire-géo |
| 433 | `433_exercices_3e_3.sql` | 84 | maths |
| 434 | `434_exercices_3e_4.sql` | 93 | physique-chimie |
| 435 | `435_exercices_1re.sql` | 93 | français |
| 436 | `436_exercices_tle_1.sql` | 75 | allemand, anglais |
| 437 | `437_exercices_tle_2.sql` | 99 | espagnol, LLCER anglais |
| 438 | `438_exercices_tle_3.sql` | 90 | grec, latin |
| 439 | `439_exercices_tle_4.sql` | 99 | histoire-géo (lots k154, k155, k156) |
| 440 | `440_exercices_tle_5.sql` | 60 | histoire-géo (lots k157, k158) |
| 441 | `441_exercices_tle_6.sql` | 108 | EMC, HGGSP |
| 442 | `442_exercices_tle_7.sql` | 87 | histoire-géo et philosophie de la voie techno |
| 443 | `443_exercices_tle_8.sql` | 99 | HLP, musique |
| 444 | `444_exercices_tle_9.sql` | 87 | philosophie, EPS |
| 445 | `445_exercices_tle_10.sql` | 93 | maths, maths expertes |
| 446 | `446_exercices_tle_11.sql` | 90 | maths complémentaires, maths de la voie techno |
| 447 | `447_exercices_tle_12.sql` | 93 | physique-chimie |
| 448 | `448_exercices_tle_13.sql` | 96 | I2D, physique-chimie et maths (STI2D, STL) |
| 449 | `449_exercices_tle_14.sql` | 66 | SVT |
| 450 | `450_exercices_tle_15.sql` | 108 | enseignement scientifique, NSI |
| 451 | `451_exercices_tle_16.sql` | 93 | SES |
| 452 | `452_exercices_tle_17.sql` | 96 | droit et économie, management (STMG) |
| 453 | `453_exercices_tle_18.sql` | 66 | sciences de l'ingénieur |
| 454 | `454_exercices_tle_19.sql` | 96 | biochimie-biologie-biotechnologie, SPCL (STL) |
| 455 | `455_exercices_tle_20.sql` | 96 | chimie-biologie-physiopathologie, sciences sanitaires et sociales (ST2S) |

Reste hors base : les 162 exercices de 5e écrits dans `contenu/exercices/5e/`.

## « Tout impeccable de la 3e à la Terminale » : 456 → 464 (écrites et EXÉCUTÉES le 01/10/2026)

Audit complet des quatre niveaux le même jour (2 301 fiches, 27 618 questions,
6 903 sujets de contrôle) : chaque fiche a son cours, son quiz à 12 questions
et ses trois contrôles ; aucun défaut de rendu dans les cours. Ce que l'audit
a trouvé, et ce qui le corrige :

| N° | Ce que c'est |
|---|---|
| 456 | 48 passages périmés ou inexacts dans les cours, les quiz ET les corrigés de contrôle : ASEAN à onze, zone euro à 21, 44 PMA, Grand oral de la session 2027 (deux temps, coefficient 8), ordonnance du 21 avril 1944 (CFLN), ODD, web au domaine public en 1993, majorité à 18 ans, Arctique, 8 milliards |
| 457 | Cahier de 3e, retouche : l'exercice sur l'ordonnance de 1944 (lot `histoire-geo.k012` reversé) |
| 458 | Cahier de Tle, retouche : les exercices de SI sur le Grand oral (lot `si.k195` reversé) |
| 459 | 73 explications de quiz d'un mot (« Symbole N. ») réécrites en une ou deux phrases |
| 460 | 23 questions qui renvoyaient à « l'exemple de la fiche » portent maintenant leurs données |
| 461 → 463 | Cahier de 3e, suite : SVT (93 exercices), EMC (30), technologie (69) — toutes les matières des épreuves écrites du brevet ont leur cahier (501 exercices en 3e, 2 442 en base) |
| 464 | 24 passages de fiches jumelles écrits pour un autre niveau : « au bac » lu en 3e et en 5e (allemand, espagnol), « du brevet » lu au lycée (anglais, espagnol) |

`scripts/corrections-sql.mjs` sait désormais corriger trois choses de plus :
`controle` (un fragment dans les sujets de contrôle du catalogue), `reponse`
(une option entière d'une question nommée) et `explication_de` (l'explication
d'une question nommée). Sans ces champs, il régénère les 420 et 425 à
l'identique. Les sources (`scripts/contenu`, `scripts/complements`,
`contenu/controles`, `contenu/exercices`) portent les mêmes corrections, et
une question reformulée garde son identifiant (clé d'origine en 5e élément).

## Le cahier pour toutes les classes : 466 → 554 (générées le 02/10/2026, EXÉCUTÉES le 03/10/2026)

Toutes les classes et toutes les matières ont leur cahier : 2 947 chapitres sur 2 952
ont leurs trois exercices (★ ★★ ★★★) ; les cinq restants sont les chapitres « tous
niveaux » (fiscalité, économie…). 166 lots écrits et relus, plus 545 fiches jumelles
recopiées (`contenu/exercices/<niveau>/<matière>.jumelles*.json`). Chaque fichier
est sous 300 Ko (table temporaire : il ne se découpe pas après coup).

| N° | Ce que c'est |
|---|---|
| 466 | 22 erreurs de cours relevées par les rédacteurs du cahier, vérifiées à une source (cours, quiz, contrôles) |
| 467 → 471 | Cahier de 6e (5 fichiers) |
| 472 → 481 | Cahier de 5e (10 fichiers) |
| 482 → 493 | Cahier de 4e (12 fichiers) |
| 494 → 498 | Cahier de 3e (5 fichiers) |
| 499 → 512 | Cahier de 2de (14 fichiers) |
| 513 → 548 | Cahier de 1re (36 fichiers) |
| 549 → 554 | Cahier de Tle (6 fichiers) |

Ordre : la 466 d'abord, puis 467 → 554 dans l'ordre ; toutes demandent la 372.
Elles mettent à jour sans doublon les exercices déjà en base (identifiant dérivé
du chapitre et de la position).

## Pourquoi ne pas « tout fusionner en un fichier » ?

Une migration exécutée ne se modifie jamais (règle du projet), et les fichiers ne
décrivent pas exactement la production. Les policies ont été réécrites en base
(208, 320), des contenus ont été corrigés depuis l'admin, et certains seeds n'ont
jamais tourné. Un vrai point de départ unique (« baseline ») se fabrique à partir
d'un `pg_dump --schema-only` de la production, pas en recollant ces fichiers.
C'est faisable le jour où l'on voudra recréer un projet Supabase de zéro.
