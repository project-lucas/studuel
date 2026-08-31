// Santé de la base : la carte des migrations en attente et de ce qu'elles
// éteignent, MESURABLE à la clé anon.
//
// Le mode de panne n°1 du projet est l'ÉCHEC SILENCIEUX : le code tolère
// volontairement l'absence de ses migrations (déployer avant d'exécuter ne
// doit rien casser), donc une migration oubliée ne produit aucune erreur —
// les cartes disparaissent, les compteurs tombent à zéro, et personne ne le
// voit. Dix jours de features ont dormi ainsi en juillet 2026.
//
// Ce module est la SOURCE UNIQUE de la sonde : /admin/sante exécute ces
// descripteurs côté serveur, et `_ASSOCIE/sonde-base.mjs` (CLI, hors build TS)
// en tient une copie — le test miroir de lib/sante.test.ts vérifie que la
// copie couvre bien toutes les migrations listées ici.

/** Comment vérifier qu'une migration est passée, avec la clé anon. */
export type Sonde =
  /** La table répond (une relation absente renvoie 42P01). */
  | { type: 'table'; table: string }
  /** La colonne répond (absente : 42703). */
  | { type: 'colonne'; table: string; colonne: string }
  /** Une ligne précise existe (seed : présence de données, pas d'erreur). */
  | { type: 'ligne'; table: string; colonne: string; valeur: string }
  /** La RPC existe (PGRST202 = absente ; tout autre retour = présente). */
  | { type: 'rpc'; fn: string; args: Record<string, unknown> }
  /**
   * La RPC est FERMÉE à la clé anon — la sonde à l'envers, pour les migrations
   * qui ne font que révoquer un droit.
   *
   * Une migration de REVOKE ne crée ni table ni colonne ni fonction : il n'y a
   * rien à observer, et c'est pourquoi la 324 est restée marquée « non
   * sondable » alors même que son effet est parfaitement mesurable. Ce qu'elle
   * change, c'est la RÉPONSE : un appel anonyme qui rendait 200 doit désormais
   * être refusé. On mesure donc une porte qui ne s'ouvre plus.
   */
  | { type: 'rpc-ferme'; fn: string; args: Record<string, unknown> }

export type MigrationSante = {
  /** Numéro de la migration ('188'). */
  id: string
  /** Nom du fichier dans supabase/. */
  fichier: string
  /** La feature qu'elle allume. */
  feature: string
  /** Ce que l'élève (ou l'admin) voit TANT QU'ELLE DORT. */
  siAbsente: string
  /**
   * null = non sondable à la clé anon (CREATE OR REPLACE d'une fonction déjà
   * existante, changement de clé primaire, forme des policies…) : à rejouer
   * par sécurité, le rejeu est idempotent.
   */
  sonde: Sonde | null
  /** Présente = une décision de Lucas est requise AVANT de l'exécuter. */
  decision?: string
}

/**
 * Les migrations en attente au 2026-07-28, dans l'ORDRE D'EXÉCUTION.
 * Une migration confirmée exécutée en prod se RETIRE de cette liste.
 */
export const MIGRATIONS_SANTE: readonly MigrationSante[] = [
  // 187 et 189 ont longtemps manqué à ce catalogue, qui commençait à 188 : leur
  // état réel était donc INCONNU (audit du 31/07/2026). Elles sont sondables,
  // il n'y avait aucune raison de les laisser dehors.
  {
    id: '187',
    fichier: '187_moi_capacite.sql',
    feature: 'Onglet Moi : moyennes trimestrielles saisies + habitude « Questions »',
    siAbsente:
      'La carte « Ta trajectoire au bac » perd son repli : sans note réelle saisie, elle ne peut afficher aucune moyenne, et le levier « Questions » n’existe pas dans le catalogue d’habitudes.',
    sonde: { type: 'table', table: 'term_grades' },
  },
  {
    id: '188',
    fichier: '188_tour_guide.sql',
    feature: 'Tour guidé post-onboarding',
    siAbsente: 'Le tour guidé ne se lance jamais après l’onboarding.',
    sonde: { type: 'colonne', table: 'profiles', colonne: 'tutorial_completed' },
  },
  {
    id: '189',
    fichier: '189_avatar_vestiaire.sql',
    feature: 'Vestiaire d’avatar (catalogue, achats, déblocages)',
    siAbsente:
      '/moi/avatar est vide : aucun item à acheter ni à débloquer, et les deux RPC d’achat/déblocage n’existent pas — l’écran se charge mais ne propose rien.',
    sonde: { type: 'table', table: 'avatar_items' },
  },
  {
    id: '192',
    fichier: '192_economie_progression.sql',
    feature: 'Portefeuille XP / niveaux / gemmes (économie v2)',
    siAbsente:
      'XP et niveau retombent sur l’ancien calcul dérivé ; aucun événement XP n’est enregistré ; gemmes de série et de niveau jamais versées.',
    sonde: { type: 'table', table: 'user_wallet' },
  },
  {
    id: '194',
    fichier: '194_rotation_boss_miroir.sql',
    feature: 'Rotation des boss réalignée (17 boss)',
    siAbsente:
      'Le trophée du boss de la semaine n’est JAMAIS crédité : la rotation SQL (14 boss) désigne un autre boss que l’app (17).',
    sonde: null,
  },
  {
    id: '195',
    fichier: '195_push_send_log.sql',
    feature: 'Journal d’envoi des rappels push',
    siAbsente:
      'Un rejeu du cron re-notifie tout le monde ; aucun envoi n’est journalisé ni rattrapable.',
    sonde: { type: 'table', table: 'push_send_log' },
  },
  {
    id: '196',
    fichier: '196_push_appareil_familial.sql',
    feature: 'Push sur appareil familial (clé endpoint + user)',
    siAbsente:
      'Sur une tablette partagée, le dernier compte connecté écrase l’abonnement push du précédent.',
    sonde: null,
  },
  {
    id: '197',
    fichier: '197_parents_miroir_maitrise.sql',
    feature: 'Maîtrise côté parent = meilleur score (miroir élève)',
    siAbsente:
      'Le parent voit une maîtrise pessimiste (moyenne de TOUTES les tentatives) : 90 % côté élève peut s’afficher « à renforcer » côté parent.',
    sonde: null,
  },
  {
    id: '198',
    fichier: '198_quota_ia_carnet.sql',
    feature: 'Quota quotidien des appels IA du carnet',
    siAbsente:
      '⚠️ LA SEULE QUI COÛTE DE L’ARGENT : la génération IA du carnet est un relais LLM sans quota, rejouable en boucle sur la clé du projet.',
    sonde: { type: 'table', table: 'ai_call_attempts' },
  },
  {
    id: '199',
    fichier: '199_parents_matieres_classe_courante.sql',
    feature: 'Moyennes parent bornées à la classe courante',
    siAbsente:
      'La moyenne par matière côté parent mélange les classes passées (les quiz de 6e pèsent à vie).',
    sonde: null,
  },
  {
    id: '200',
    fichier: '200_profil_defi.sql',
    feature: 'Profil de jeu Défi (pseudo, badges, bannières)',
    siAbsente:
      'La carte de profil de /defi est dégradée : pas de pseudo de jeu, aucun badge attribuable, aucune bannière.',
    sonde: { type: 'colonne', table: 'profiles', colonne: 'gamertag' },
  },
  {
    id: '201',
    fichier: '201_profile_stats.sql',
    feature: 'Stats de la modale de profil',
    siAbsente: 'La modale de profil affiche des stats à zéro.',
    sonde: { type: 'rpc', fn: 'profile_stats', args: {} },
  },
  {
    id: '202',
    fichier: '202_bronze_loss_shield.sql',
    feature: 'Filet de perte Bronze (classé)',
    siAbsente:
      'Un débutant Bronze perd des trophées dès sa première défaite (le filet n’existe pas).',
    sonde: null,
  },
  {
    id: '203',
    fichier: '203_plan_preparation.sql',
    feature: 'Plan de préparation (contrôle-objet-unique)',
    siAbsente:
      'Ajouter un contrôle ne crée AUCUN plan : la carte de préparation de /reviser reste vide.',
    sonde: { type: 'table', table: 'controles' },
  },
  {
    id: '204',
    fichier: '204_clan_hebdo.sql',
    feature: 'Clan hebdo (contributions, classement, coffre)',
    siAbsente:
      'Le clan hebdo est invisible : un duel 90 s ne crédite rien, aucun classement d’écoles, aucun coffre.',
    sonde: { type: 'table', table: 'clan_week_contributions' },
  },
  {
    id: '205',
    fichier: '205_quetes_journalieres.sql',
    feature: 'Quêtes du jour',
    siAbsente:
      'Les quêtes du jour n’enregistrent aucune progression et ne paient jamais.',
    sonde: { type: 'table', table: 'daily_quests' },
  },
  {
    id: '206',
    fichier: '206_retention.sql',
    feature: 'Tableau de rétention D1/D7/D30',
    siAbsente: '/admin/retention affiche « migration non exécutée ».',
    sonde: { type: 'rpc', fn: 'retention_dashboard', args: { p_days: 30 } },
  },
  {
    id: '207',
    fichier: '207_saison_pass.sql',
    feature: 'Saison mensuelle + Pass (piste de récompenses)',
    siAbsente:
      'La piste de saison est vide : aucune couronne créditée, aucun palier réclamable, aucun titre.',
    sonde: { type: 'table', table: 'season_progress' },
  },
  {
    id: '208',
    fichier: '208_perf_rls_initplan.sql',
    feature: 'Perf RLS (auth.uid() en InitPlan, 225 policies)',
    siAbsente:
      'Aucun impact visible — les policies sont réévaluées ligne à ligne (latence qui grandit avec les tables).',
    sonde: null,
  },
  {
    id: '209',
    fichier: '209_reprise_hardening_192_207.sql',
    feature: 'Reprise du durcissement de l’audit (192·200·203·204·205·207)',
    siAbsente:
      'Les correctifs de l’audit e7aca3a ne sont PAS en base (192→207 déjà exécutées quand ils ont été écrits) : l’XP des quêtes/du clan n’est jamais versée au portefeuille, le pseudo de jeu n’a aucune borne SQL, create_controle est inondable.',
    sonde: null,
  },
  {
    id: '210',
    fichier: '210_fix_clan_active_school_grade_level.sql',
    feature: 'Clan : école active lue sur grade_level',
    siAbsente:
      'La carte de clan et les contributions hebdo sont mortes : clan_active_school lit une colonne `grade` qui n’existe pas.',
    sonde: null,
  },
  {
    id: '211',
    fichier: '211_reprise_controles_depuis_upcoming_exams.sql',
    feature: 'Reprise des contrôles hérités (087 → 203)',
    siAbsente:
      'Les contrôles annoncés AVANT la 203 dorment dans profiles.upcoming_exams : ils n’ouvrent aucune carte de préparation sur Réviser (le Défi et les dossiers, eux, les voient déjà — les deux sources sont fusionnées côté code).',
    // Pas de sonde à la clé anon : la 211 ne crée aucun objet, elle recopie des
    // lignes protégées par RLS (on ne voit que les siennes, et l'agent n'a pas
    // de session élève). Rejeu idempotent — un groupe déjà repris est ignoré.
    sonde: null,
  },
  {
    id: '212',
    fichier: '212_traque_boss.sql',
    feature: 'La Traque — boss débusqués en révisant',
    siAbsente:
      'Aucune jauge de traque : le bandeau des gardiens du jour et la tuile Boss de /defi n’apparaissent pas, réviser ne débusque jamais personne.',
    sonde: { type: 'table', table: 'boss_gauges' },
  },
  {
    id: '213',
    fichier: '213_traque_defaite_fenetre.sql',
    feature: 'La Traque : une défaite ne referme plus la fenêtre d’une heure',
    siAbsente:
      'Perdre un combat de traque efface le gardien débusqué et la moitié de la jauge : la promesse « il disparaît dans 1 h » vaut en réalité UN essai. Le compteur de tentatives affiché à l’écran reste à zéro.',
    // La colonne `attempts` est le marqueur : une colonne absente répond 42703
    // même sous RLS « soi uniquement » (zéro ligne ≠ erreur). Le CREATE OR
    // REPLACE de traque_defaite, lui, n'est pas sondable — mais il arrive dans
    // le même fichier, donc la colonne suffit.
    sonde: { type: 'colonne', table: 'boss_gauges', colonne: 'attempts' },
  },
  {
    id: '214',
    fichier: '214_prep_session_une_par_jour.sql',
    feature: 'Plan de prépa : une session cochée par chapitre et par jour',
    siAbsente:
      'Rejouer le même quiz plusieurs fois dans la journée coche toutes les sessions du chapitre d’un coup : le plan passe « terminé » sans aucune répétition espacée (pédagogie contournée, pas de sur-crédit).',
    // CREATE OR REPLACE d'une fonction de la 203 : non sondable à la clé anon.
    sonde: null,
  },
  {
    id: '215',
    fichier: '215_marcel_jetons.sql',
    feature: 'Marcel : quota d’IA et jetons de Prof',
    siAbsente:
      'La porte de « Demander à Marcel » n’existe pas côté serveur : l’action REFUSE tout appel (fail closed), donc aucun coût ne peut fuir — mais la fonction est simplement indisponible pour les élèves.',
    sonde: { type: 'table', table: 'coach_tokens' },
  },
  {
    id: '193',
    fichier: '193_matieres_completes.sql',
    feature: 'Catalogue de matières complet (+6 matières)',
    siAbsente:
      '6 matières du programme officiel absentes du catalogue — MAIS les exécuter aujourd’hui ajoute 6 coquilles vides cliquables (11 matières sans contenu sur 31).',
    sonde: { type: 'ligne', table: 'subjects', colonne: 'slug', valeur: 'snt' },
    decision:
      'Exécutée. La réserve qui l’accompagnait (« +6 coquilles vides ») est levée par les migrations 216 → 219, qui apportent le contenu des 11 matières vides.',
  },
  // --- Contenu des 11 matières vides (généré par scripts/seed-contenu.mjs) ---
  // Découpé en quatre fichiers : l'éditeur SQL de Supabase devient poussif
  // au-delà de ~300 Ko, et un script à moitié collé est pire qu'un script
  // absent. Les quatre sont indépendants et peuvent s'exécuter dans l'ordre.
  {
    id: '216',
    fichier: '216_contenu_emc_sport.sql',
    feature: 'Contenu EMC + Sport (42 chapitres, 336 questions)',
    siAbsente:
      'EMC et Sport restent des coquilles cliquables : l’élève ouvre la matière et voit un programme vide, à tous les niveaux.',
    sonde: { type: 'ligne', table: 'chapters', colonne: 'title', valeur: 'Le respect d’autrui' },
  },
  {
    id: '217',
    fichier: '217_contenu_musique_arts.sql',
    feature: 'Contenu Musique + Arts plastiques (42 chapitres, 336 questions)',
    siAbsente:
      'Musique et Arts plastiques restent des coquilles cliquables, du CM2 au lycée.',
    sonde: { type: 'ligne', table: 'chapters', colonne: 'title', valeur: 'Les paramètres du son' },
  },
  {
    id: '218',
    fichier: '218_contenu_allemand_grec.sql',
    feature: 'Contenu Allemand + Grec (30 chapitres, 240 questions)',
    siAbsente:
      'Allemand (LV2) et Grec restent vides : deux matières choisies à l’inscription qui ne proposent rien.',
    sonde: { type: 'ligne', table: 'chapters', colonne: 'title', valeur: 'Se présenter et saluer' },
  },
  {
    id: '219',
    fichier: '219_contenu_lycee.sql',
    feature: 'Contenu SNT, HLP, LLCER, SI, Maths complémentaires (27 chapitres, 216 questions)',
    siAbsente:
      'Les 5 matières du lycée créées par la 193 restent vides — dont SNT, tronc commun de 2de que TOUS les élèves de seconde ont.',
    sonde: { type: 'ligne', table: 'chapters', colonne: 'title', valeur: 'Internet' },
  },
  {
    id: '220',
    fichier: '220_contenu_espagnol_latin_lycee.sql',
    feature: 'Contenu Espagnol + Latin au LYCÉE (18 chapitres, 144 questions)',
    siAbsente:
      'Espagnol et Latin s’arrêtent en 3e alors que leurs `levels` vont jusqu’en Tle : un lycéen qui les choisit ouvre un programme vide — un trou invisible, puisque la matière, elle, a du contenu au collège.',
    sonde: { type: 'ligne', table: 'chapters', colonne: 'title', valeur: 'Les temps du passé' },
  },
  {
    id: '221',
    fichier: '221_abonnements_v0.sql',
    feature: 'La caisse v0 : demandes d’abonnement + octroi manuel tracé',
    siAbsente:
      'AUCUN compte ne peut devenir payant (subscription_tier n’est écrit par personne), et cliquer « Choisir cette offre » sur Trésor n’enregistre rien — pas même le fait qu’une famille ait voulu payer. Tout le gating premium reste du code mort.',
    sonde: { type: 'table', table: 'subscription_interest' },
    decision:
      'v0 ASSUMÉE : le paiement se fait hors de l’app (virement, lien externe), Lucas accorde ensuite depuis /admin/abonnements. Aucun prestataire n’est choisi à sa place — le jour venu, son webhook appellera `grant_subscription`.',
  },
  {
    id: '222',
    fichier: '222_oral_echelle.sql',
    feature: 'L’échelle de l’oral (4 barreaux) + le barreau 4 sur l’onglet Amis',
    siAbsente:
      'L’atelier d’oral de Marcel s’ouvre mais ne compte rien, et « demander à un ami de m’écouter » est impossible — les deux écrans le disent franchement au lieu de faire semblant. Aucun audio n’est concerné : il ne quitte jamais l’appareil, migration ou pas.',
    sonde: { type: 'table', table: 'oral_sessions' },
  },
  {
    id: '223',
    fichier: '223_percentile_niveau.sql',
    feature:
      'Le classement en pourcentage par niveau (« Top 2 % des 3e ») sur Défi, Moi et les pages matière',
    siAbsente:
      'Les compteurs restent bruts : « 3 000 trophées » sans sa traduction, et aucune ligne de classement sur Moi ni sur les matières. Rien ne casse et rien de faux ne s’affiche — la ligne est simplement absente, par construction (le lecteur retombe sur « aucun classement »).',
    sonde: { type: 'rpc', fn: 'my_grade_standings', args: {} },
    decision:
      'La RPC est SECURITY DEFINER par OBLIGATION : la RLS de `profiles` ne laisse voir à l’élève que sa propre ligne, donc une jointure classerait tout le monde « 1er sur 1 ». Elle ne renvoie que des rangs et des effectifs, jamais un nom.',
  },
  {
    id: '224',
    fichier: '224_chapitres_vus.sql',
    feature:
      'Les chapitres « vus en cours » — le dénominateur des pourcentages de matière',
    siAbsente:
      'Les cases à cocher du tableau Progrès répondent « le suivi des chapitres n’est pas encore ouvert » et rien n’est enregistré. Les pourcentages ne portent alors que sur ce qui a été travaillé DANS l’app : un chapitre fait en classe mais jamais révisé ici reste compté « pas encore vu ». Rien ne casse, rien de faux ne s’affiche — l’app retombe exactement sur son comportement d’avant le 01/08.',
    sonde: { type: 'table', table: 'chapitres_vus' },
    decision:
      'L’élève déclare le PÉRIMÈTRE (ce que le prof a traité), jamais son NIVEAU : la maîtrise reste mesurée par les quiz et les leçons. Sans cette séparation, l’écran deviendrait un formulaire d’auto-évaluation, et le pourcentage ne vaudrait plus rien.',
  },
  {
    id: '225',
    fichier: '225_contenu_philosophie_tle.sql',
    feature:
      'Le programme de philosophie Tle : les 17 notions du bac, la liberté en trois chapitres (19 chapitres, 152 questions)',
    siAbsente:
      'La philosophie garde ses 5 chapitres d’origine, taillés dans un découpage maison (« La conscience et l’inconscient », « La vérité et la raison ») : un élève qui révise « le devoir », « la technique » ou « le temps » — des sujets tombables au bac — ne trouve rien. Rien ne casse : le programme est seulement incomplet, et faussement rassurant.',
    sonde: { type: 'ligne', table: 'chapters', colonne: 'title', valeur: 'Le libre arbitre' },
    decision:
      'La migration SUPPRIME les 5 anciens chapitres au lieu de les compléter : deux d’entre eux portaient exactement le titre d’une notion nouvelle, et `chapters` est UNIQUE(subject_id, level, title) — les garder faisait échouer la migration à mi-parcours. Le contenu perdu est intégralement recouvert par les 19 notions.',
  },
  {
    id: '226',
    fichier: '226_contenu_anglais_grammaire_tle.sql',
    feature:
      'Les 24 fiches de grammaire anglaise en Tle (groupe nominal, groupe verbal, temps, phrase) — 192 questions',
    siAbsente:
      'L’anglais de Terminale n’a que ses 4 axes thématiques : l’app parle des thèmes du bac sans jamais donner l’outil de langue. Un élève bloqué sur le present perfect, les modaux ou le discours indirect ne trouve rien. Rien ne casse — la matière a du contenu, il est seulement incomplet.',
    sonde: { type: 'ligne', table: 'chapters', colonne: 'title', valeur: 'Les auxiliaires modaux' },
    decision:
      'Les 4 axes thématiques déjà en base sont CONSERVÉS (ce sont les axes du programme de LV, ils restent au bac) : la grammaire vient derrière, à partir de la position 5. Rien n’est supprimé, contrairement à la 225.',
  },
  {
    id: '227',
    fichier: '227_contenu_histoire_tle.sql',
    feature:
      'Histoire Tle, chapitres 7 à 11 : le monde depuis 1989, la France de 1974 à 1988, l’Europe et la Ve République (13 chapitres, 104 questions)',
    siAbsente:
      'L’histoire-géo de Terminale s’arrête à la Guerre froide : tout le programme d’après 1989 est absent. Rien ne casse, mais un élève de Tle révise un programme amputé de sa seconde moitié.',
    sonde: { type: 'ligne', table: 'chapters', colonne: 'title', valeur: '1989, une année de bouleversement géopolitique et économique' },
    decision:
      'PARTIELLE ET ASSUMÉE : les chapitres 1 à 6 du programme n’ont pas encore été transmis. Le bloc démarre donc à la position 26, laissant les positions 6 à 25 libres pour eux — un INSERT gardé par ON CONFLICT DO NOTHING ne met jamais à jour la position d’une ligne existante, donc la place se réserve d’avance ou plus du tout.',
  },
  {
    id: '228',
    fichier: '228_contenu_enseignement_scientifique_tle.sql',
    feature:
      'Le programme d’enseignement scientifique Tle : les 16 fiches des 6 chapitres du BO (climat, énergies, vivant) — 128 questions',
    siAbsente:
      'L’enseignement scientifique de Terminale garde ses 4 fiches de synthèse, qui résument tout le programme en quatre cours : un élève qui révise le transport de l’électricité, les modèles démographiques, les cycles de Milankovitch ou la lignée humaine ne trouve rien. Rien ne casse — la matière a du contenu, il est seulement quatre fois trop gros.',
    sonde: { type: 'ligne', table: 'chapters', colonne: 'title', valeur: 'Le transport de l’électricité' },
    decision:
      'La migration SUPPRIME les 4 anciens chapitres, comme la 225 : ce sont des composites que les 16 fiches recouvrent entièrement, et les garder afficherait deux fois le même cours sur la page matière. Le ménage vise les LEÇONS génériques (« L’essentiel du cours » / « Exercices types »), jamais les titres de chapitre, et il est borné au niveau Tle — la Première, bâtie sur le même modèle, n’est pas touchée.',
  },
  {
    id: '229',
    fichier: '229_contenu_geographie_tle.sql',
    feature:
      'Le programme de géographie Tle : mers et océans, dynamiques territoriales, l’UE et la France (20 chapitres, 160 questions)',
    siAbsente:
      'L’histoire-géo de Terminale n’a que DEUX fiches de géographie, deux synthèses (« Mers et océans dans la mondialisation », « L’Union européenne dans la mondialisation »). Un élève qui révise les détroits, la hiérarchie des centres de décision mondiaux, les territoires transfrontaliers ou les recompositions du territoire français ne trouve rien. Rien ne casse : la moitié géographique du programme est simplement absente.',
    sonde: { type: 'ligne', table: 'chapters', colonne: 'title', valeur: 'Les lignes de force du territoire français' },
    decision:
      'Aucune suppression, contrairement à la 228. Les deux fiches de synthèse font pourtant doublon avec les chapitres 1 et 3 — mais elles ont été posées par une migration ancienne, idempotente et REJOUABLE, qui les recréerait au prochain passage : un ménage y serait silencieusement annulé. Le bloc démarre à la position 39, derrière les 13 chapitres d’histoire de la 227.',
  },
  {
    id: '230',
    fichier: '230_contenu_emc_tle.sql',
    feature:
      'Le programme d’EMC Tle « La démocratie » : fondements, élections, laïcité, transparence, engagement (12 chapitres, 96 questions)',
    siAbsente:
      'L’EMC de Terminale n’a que les 3 chapitres du socle lycée, écrits pour la 2de, la 1re et la Tle à la fois. Le programme propre à la Terminale — histoire de la démocratie, modes de scrutin, laïcité, exemplarité des élus, nouvelles formes de participation — est absent. Rien ne casse : la matière a du contenu, mais pas celui de l’année du bac.',
    sonde: { type: 'ligne', table: 'chapters', colonne: 'title', valeur: 'Les élections, outils de la démocratie' },
    decision:
      'Les 3 chapitres du socle lycée RESTENT : ils valent aussi pour la 2de et la 1re, et une suppression côté Tle serait de toute façon annulée au prochain rejeu de la 216, qui est idempotente. Le bloc démarre donc à la position 4.',
  },
  {
    id: '231',
    fichier: '231_contenu_espagnol_tle.sql',
    feature:
      'Espagnol Tle : les 34 fiches des 4 chapitres du programme (la phrase, le groupe nominal, le groupe verbal, les temps) — 272 questions',
    siAbsente:
      'L’espagnol de Terminale garde ses 3 fiches maison, les mêmes qu’en 2de et en 1re. Un élève qui révise la négation, l’enclise des pronoms, cuyo, l’apocope, le subjonctif ou la concordance ne trouve rien. Rien ne casse : la matière a du contenu, mais pas celui de l’année du bac.',
    sonde: { type: 'ligne', table: 'chapters', colonne: 'title', valeur: 'L’apocope' },
    decision:
      'TERMINALE SEULE : le programme transmis est celui de l’année du bac. La migration SUPPRIME 2 des 3 anciens chapitres (« Les temps du passé », « Ser, estar et les tournures essentielles »), que les fiches neuves recouvrent entièrement — ménage visant les LEÇONS (« Pretérito, imperfecto, perfecto », « Deux verbes “être”, et tout change »), jamais les titres de chapitre. Le filtre `level = Tle` protège à la fois le collège (qui a son propre programme) ET la 2de et la 1re, qui gardent leurs 3 fiches puisque rien ne vient les remplacer à ces niveaux. La 3e fiche, « Le monde hispanique aujourd’hui », est CONSERVÉE partout : elle porte les axes culturels du bac, qu’aucune fiche de grammaire ne remplace. Un UPDATE la renvoie en position 90 côté Tle, parce qu’un INSERT ne renumérote jamais une ligne déjà en base.',
  },
  {
    id: '232',
    fichier: '232_contenu_hlp_tle.sql',
    feature:
      'HLP Tle : les 18 fiches des 6 chapitres du programme (éducation, sensibilité, moi, création, violence, limites de l’humain) — 144 questions',
    siAbsente:
      'La spécialité HLP de terminale garde ses 2 fiches de semestre — les titres mêmes du programme servis comme cours. Un élève qui révise l’identité et le genre, la pop culture, Foucault, la conscience écologique ou la bioéthique ne trouve rien. Rien ne casse : tout le programme tient en deux fiches.',
    sonde: { type: 'ligne', table: 'chapters', colonne: 'title', valeur: 'L’histoire de la psychiatrie (Foucault)' },
    decision:
      'La migration SUPPRIME les 2 chapitres de semestre (« La recherche de soi », « L’Humanité en question »), que les 18 fiches recouvrent entièrement. Le ménage vise les LEÇONS, jamais les titres de chapitre, et il est borné au niveau Tle — la Première garde ses 3 chapitres. La fiche « Méthode de l’épreuve » est CONSERVÉE (l’interprétation littéraire et l’essai ne relèvent d’aucune entrée du programme) et renvoyée en position 90 par un UPDATE.',
  },
  {
    id: '233',
    fichier: '233_contenu_svt_tle.sql',
    feature:
      'SVT Tle (spécialité) : les 22 fiches des 7 chapitres du programme (diversité génétique, temps des roches, la plante, climats, système nerveux, contraction musculaire, stress) — 176 questions',
    siAbsente:
      'La SVT de Terminale garde ses 5 chapitres composites, un par chapitre du BO. DEUX chapitres du programme n’ont aucune entrée du tout : « Comportements, mouvement et système nerveux » et « Produire le mouvement ». Un élève qui révise le réflexe myotatique, le sarcomère, la régulation de la glycémie, la chronologie absolue ou les paramètres de Milankovitch ne trouve rien.',
    sonde: { type: 'ligne', table: 'chapters', colonne: 'title', valeur: 'Les réflexes' },
    decision:
      'La migration SUPPRIME les 5 chapitres composites, que les 22 fiches recouvrent entièrement — ménage visant les LEÇONS génériques posées par 008/142 (« L’essentiel du cours », « Exercices types »), jamais les titres de chapitre, et borné au niveau Tle : les six autres niveaux de SVT portent les mêmes leçons et ne bougent pas. ⚠️ CE QUI EST PERDU : les 5 leçons « Exercices types » de la 142 (2 exercices type bac corrigés par chapitre) partent avec leurs chapitres. Elles étaient adossées au découpage composite ; les réécrire fiche par fiche est un chantier à part. ⚠️ La 142 est REJOUABLE : la recoller un jour recréerait le contenu des 5 anciens chapitres — mais pas les chapitres eux-mêmes, qui viennent de la 008 (elle aussi rejouable). Si les deux repassent, les 5 composites reviennent en doublon des 22 fiches.',
  },
  {
    id: '234',
    fichier: '234_chapitre_axe.sql',
    feature:
      'L’axe du programme sur chaque chapitre : la page matière range ses chapitres en sections repliables (les 6 axes d’anglais Tle, les 7 thèmes de SVT) au lieu d’une liste à plat',
    siAbsente:
      'Les chapitres restent affichés à plat, comme aujourd’hui : 28 lignes d’affilée en anglais de Terminale. Rien ne casse (le select de l’axe est isolé et toléré, et `groupChaptersByTheme` retombe sur un groupe unique), mais le regroupement ne s’allumera pour aucune matière tant que la colonne n’existe pas — puis matière par matière, à mesure que les axes seront remplis.',
    sonde: { type: 'colonne', table: 'chapters', colonne: 'theme' },
  },
  {
    id: '236',
    fichier: '236_annales.sql',
    feature:
      'La table `exam_papers` : les annales (une épreuve d’examen d’une session, décrite partie par partie) que l’onglet Annales des 3e, 1re et Tle promettait sans pouvoir les servir',
    siAbsente:
      'L’onglet « Annales » existe pour les trois années à examen, mais n’a rien à montrer : il affiche l’encart « Pas encore d’épreuve ici » sous l’épreuve blanche. Rien ne casse — le select des annales est isolé et toléré, comme celui de l’axe.',
    sonde: { type: 'table', table: 'exam_papers' },
  },
  {
    id: '237',
    fichier: '237_annales_session_2026.sql',
    feature:
      'Les 17 épreuves de la session 2026 (brevet, épreuves anticipées de 1re, bac), avec durée, coefficient, barème partie par partie et les chapitres que chacune mobilise',
    siAbsente:
      'La table des annales reste vide : l’élève de 3e sait que le brevet arrive sans jamais voir à quoi il ressemble — combien de temps, combien de parties, quel barème, quels chapitres tombent où.',
    // NON SONDABLE À LA CLÉ ANON, et ce n'était pas vu. La sonde cherchait ici
    // une LIGNE (une épreuve de la session 2026), mais `exam_papers` (policy de la 236) n'ouvre son SELECT
    // qu'au rôle `authenticated` : à la clé anon la requête réussit et rend
    // TOUJOURS zéro ligne, migration exécutée ou non. La sonde criait donc au
    // loup en permanence — le second visage du bug du 26/08, après le 42501 :
    // là c'était le GRANT qui manquait, ici c'est la policy RLS qui filtre.
    // Une sonde qui ne PEUT pas être vraie doit valoir `null`, pas « éteinte ».
    sonde: null,
    decision:
      'Ce que la migration apporte est la STRUCTURE OFFICIELLE des épreuves, pas les énoncés des sujets tombés : ceux-là demandent un relevé aux sujets officiels, session par session, et viendront dans d’autres fichiers de `scripts/annales/`. Le modèle est prévu pour — les colonnes `session` et `center` distinguent déjà « 2026 » de « 2025 · Amérique du Nord ». ⚠️ LE GRAND ORAL N’Y EST PAS : il vaut coefficient 10 et se prépare sur les DEUX spécialités à la fois, il n’appartient donc à aucune matière alors que `exam_papers` en exige une. Le rattacher arbitrairement à l’une des deux mentirait sur ce qu’il est.',
  },
  {
    id: '238',
    fichier: '238_route_des_trophees.sql',
    feature:
      'La Route des trophées : un compteur de trophées par couple (matière × jeu) sur une courbe par bandes, sa liste blanche `game_catalog`, le journal `game_matches` et la RPC `apply_game_trophies` qui recalcule tout côté serveur',
    siAbsente:
      'Aucune partie de salon ne rapporte de trophée : l’écran de fin affiche l’XP mais pas la ligne « Trophées », et l’espace duel comme la Route affichent des compteurs à zéro. Rien ne casse — l’action retombe sur `null` et la ligne disparaît — mais toute la boucle compétitive est morte.',
    sonde: { type: 'table', table: 'game_trophies' },
    decision:
      'Le barème vit en DEUX exemplaires — `lib/trophy-road.ts` pour l’affichage (annoncer « +10 » avant la partie) et le SQL pour la persistance — parce que le client ne doit jamais décider du gain : `p_won` vient de lui. Le test `lib/trophy-catalog.test.ts` relit le fichier SQL et bloque la dérive entre les deux. La liste blanche `game_catalog` n’est pas décorative : sans elle, un couple (matière, jeu) inventé démarre à 0 trophée, donc dans la bande +10/−0, et le total global — une somme — se gonflerait sans plafond. ⚠️ LA MIGRATION REMET LES TROPHÉES À ZÉRO : l’ancien barème Elo n’est pas convertible en bandes, le pic est donc conservé dans `profiles.legacy_best_trophies` comme trophée d’honneur et la saison repart à neuf. Elle porte aussi le PIC PAR MATIÈRE (`subject_peaks`) et le vivier d’adversaires du duel classé (`subject_ranked_ghosts`), dont dépend le ladder cloisonné par matière (`lib/subject-rank`).',
  },
  {
    id: '239',
    fichier: '239_moteur_questions.sql',
    feature:
      'Le moteur de sélection de questions : `review_items` passe au modèle de Leitner (boîte 1→5, échéance HORODATÉE `due_at`, compteurs de passages, chapitre et niveau dénormalisés) et la vue `question_scope` rattache chaque question à son chapitre, sa matière et son niveau',
    siAbsente:
      'Le jeu « Ton programme » retombe sur son ancien classement par faiblesse de chapitre (jouable, mais sans mémoire : deux parties d’affilée repiochent dans les mêmes quiz) et l’enregistrement des réponses échoue sur des colonnes inconnues — la file « À revoir » et la Revanche cessent d’avancer. Rien ne casse à l’écran ; la répétition espacée, elle, ne progresse plus.',
    sonde: { type: 'colonne', table: 'review_items', colonne: 'due_at' },
    decision:
      'L’échéance passe de DATE à TIMESTAMPTZ, et c’est la raison d’être de la migration : une erreur doit revenir « dans 10 minutes », DANS la même session. Avec une colonne DATE, « maintenant + 10 min » et « aujourd’hui » sont la même valeur — le rappel court était impossible, quel que soit le code au-dessus. `due_date` SURVIT, dérivée de `due_at` par un trigger : elle est la clé de lecture de la file depuis la 021, et un seul écrivain la maintient (même doctrine que `profiles.trophies` en 238). `question_scope` est une VUE et non une table — la donnée existe déjà, la dupliquer créerait une seconde source de vérité à resynchroniser à chaque import de contenu — et elle est en `security_invoker` pour que le gating premium de `quiz_questions` reste en vigueur.',
  },
  {
    id: '240',
    fichier: '240_vestiaire_open_peeps.sql',
    feature:
      'Le catalogue du vestiaire réécrit pour le moteur Open Peeps : 30 coiffures et couvre-chefs (voile, turban, tresses, locks, twists, afro, bantu knots, bonnet, casquette) au lieu de 6, 8 teintes de peau, la tenue devenue couleur de haut',
    siAbsente:
      'Le vestiaire retombe sur son catalogue de repli embarqué (`fallbackCatalog`) : toutes les options s’affichent et se portent, mais GRATUITEMENT — plus de prix, plus de cadenas, plus de déblocages à mériter. L’avatar lui-même se rend correctement (le moteur vit dans lib/avatar.ts, pas en base) ; c’est l’économie du vestiaire qui s’éteint. Rien ne casse à l’écran.',
    // NON SONDABLE À LA CLÉ ANON, et ce n'était pas vu. La sonde cherchait ici
    // une LIGNE (la pièce « hijab »), mais `avatar_items` (policy de la 189) n'ouvre son SELECT
    // qu'au rôle `authenticated` : à la clé anon la requête réussit et rend
    // TOUJOURS zéro ligne, migration exécutée ou non. La sonde criait donc au
    // loup en permanence — le second visage du bug du 26/08, après le 42501 :
    // là c'était le GRANT qui manquait, ici c'est la policy RLS qui filtre.
    // Une sonde qui ne PEUT pas être vraie doit valoir `null`, pas « éteinte ».
    sonde: null,
    decision:
      'Le moteur de rendu passe d’avataaars (22 coiffures, aucune texture de cheveux, ni voile ni tresses) à Open Peeps. Les IDS DES ITEMS NE CHANGENT PAS : un élève qui avait acheté `coif-locks` le possède toujours, seul son `asset_key` est réécrit — `user_avatar_items` n’est jamais touchée, et rien n’est supprimé (on ne rembourse pas en effaçant). CE QUI SE PERD, ET C’EST ASSUMÉ : la coiffure et la couleur de haut de chaque élève repartent du défaut (aucune valeur d’avataaars n’a d’équivalent), tandis que la PEAU et la COULEUR DE CHEVEUX traversent, les palettes ayant été alignées hex pour hex dans lib/avatar.ts. La catégorie `outfit` ne porte plus une coupe de vêtement mais une COULEUR : Open Peeps n’a qu’une silhouette, la variété a déménagé côté coiffures. La catégorie `hair_color` DISPARAÎT — Open Peeps peint la chevelure et les contours du visage d’un même tracé noir, une teinte y serait invisible ; ses sept articles deviennent des coiffures de même prix, ids et possessions inchangés. Le voile, le turban, les tresses et l’afro sont GRATUITS — ce ne sont pas des cosmétiques, ce sont des têtes.',
  },
  {
    id: '241',
    fichier: '241_classes_primaire_et_techno.sql',
    feature:
      'Sept classes de plus : le primaire (CP → CM2) et la voie technologique (1re techno, Tle techno). Le catalogue des matières s’ouvre à ces quatorze classes, et deux matières naissent — « Sciences et technologie » (l’unique science du primaire) et « Grand oral »',
    siAbsente:
      'Les sept classes neuves existent dans l’app — le menu « Ma classe » les propose, un élève peut s’y inscrire — mais AUCUNE matière ne déclare leur niveau. Résultat : un CP, un CM2 ou un 1re techno ouvre Réviser sur une grille VIDE, sans même la mention « Bientôt » (elle suppose une matière à annoncer). Le lycéen de la voie générale et le collégien, eux, ne voient aucune différence. C’est le seul écran cassé, mais il l’est complètement.',
    sonde: {
      type: 'ligne',
      table: 'subjects',
      colonne: 'slug',
      valeur: 'sciences-technologie',
    },
    decision:
      'La voie techno est une CLASSE (« 1re techno »), pas une filière à côté de la classe : c’est ce que demandait la maquette, et ça garde un seul champ à renseigner à l’inscription. Mais son CONTENU n’est pas dupliqué — son tronc commun EST celui de la voie générale, et il reste rangé aux niveaux « 1re » / « Tle ». L’app replie la classe sur son niveau général pour lire les chapitres (`contentLevelFor`, lib/grades.ts) : un 1re techno a donc TOUT le français, l’histoire-géo et les maths de la 1re dès l’exécution de cette migration, sans une ligne de contenu recopiée. Les spécialités technologiques (STMG, STI2D, ST2S…) ne sont PAS déclarées : elles dépendent d’une série que le profil ne demande pas encore, et proposer les spés de la voie générale à un STMG serait pire que ne rien proposer. Le primaire, lui, n’a pas d’alias : son programme lui est propre, ses matières s’affichent « Bientôt » jusqu’à ce que son contenu soit écrit.',
  },
  {
    id: '242',
    fichier: '242_ecole_primaire_clan.sql',
    feature:
      'L’ÉCOLE PRIMAIRE devient un cycle de clan : `schools.level` accepte « primaire », `profiles.primaire_school_id` existe, et les six fonctions qui décidaient du cycle passent de deux branches à trois',
    siAbsente:
      'Un élève du primaire est rattaché à un clan de COLLÈGE : l’app lui demande de chercher SON COLLÈGE, le classe avec des 3e et l’inscrit au tournoi des collèges. Rien ne plante — le `ELSE` des anciennes fonctions envoyait au collège tout ce qui n’était pas le lycée, il continue de répondre. C’est un écran qui ment, pas une erreur. Le collège et le lycée ne voient aucune différence. La lecture du profil, elle, est protégée : `readRowTolerant` réessaie sans la colonne absente (app/defi/profile-actions.ts), donc pseudo, classe et avatar restent affichés.',
    sonde: {
      type: 'colonne',
      table: 'profiles',
      colonne: 'primaire_school_id',
    },
    decision:
      'Un troisième cycle plutôt que ranger le primaire avec le collège : le clan est l’ÉTABLISSEMENT, et une école primaire n’est pas un collège — les mélanger ferait s’affronter des CP et des 3e dans le même classement. `clan_active_school` est réécrite au passage pour DEUX oublis, pas un : le primaire, et la voie technologique (elle lisait `grade_level IN (2de,1re,Tle)`, donc un 1re techno tombait côté collège alors qu’il est au lycée). Les six fonctions sont redéfinies par CREATE OR REPLACE, en repartant de leur dernière version connue (166 pour le tournoi, 210 pour le clan hebdo) : les migrations d’origine ne sont pas modifiées. Côté TypeScript, le ternaire `cycle === college ? … : lycee_school_id` qui traînait à trois endroits devient `activeSchoolId` — c’est ce ternaire, écrit pour deux cycles, qui envoyait un CM1 chercher son lycée.',
  },
  {
    id: '243',
    fichier: '243_anglais_tle_programme_officiel.sql',
    feature:
      'Anglais Tle rendu à son programme : les 4 chapitres hors programme (« Faire société : unité et pluralité », « Environnements en mutation », « Art et débats d’idées », « Innovations et responsabilité ») sont supprimés, et les 24 fiches de langue déjà en base se rangent sous leurs 4 chapitres — Le groupe nominal, Le groupe verbal, Les temps, La phrase',
    siAbsente:
      'L’anglais de Terminale ouvre sur 4 chapitres qui ne sont à aucun programme : ils viennent du tout premier jeu de données (008), qui les donnait pour « les axes du programme de LV » — deux d’entre eux appartiennent en réalité à la spécialité « Anglais, monde contemporain ». L’élève lit donc quatre intitulés absents de son cours avant d’atteindre ses fiches de langue, alignées derrière eux sur 24 lignes à plat.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'theme',
      valeur: 'Le groupe verbal',
    },
    decision:
      'La migration SUPPRIME les 4 chapitres hors programme (leurs leçons partent par cascade) et leurs 4 quiz — `quizzes.lesson_id` étant ON DELETE SET NULL, les quiz survivraient sinon à leur chapitre, orphelins mais toujours tirables par le moteur de questions. Elle REPREND l’ALTER TABLE de la 234 en ADD COLUMN IF NOT EXISTS : 234 n’étant pas jouée en production, sans cette reprise la migration échouerait à mi-parcours, les 4 chapitres déjà supprimés et les fiches pas encore rangées. Les positions des 24 fiches sont RÉÉCRITES UNE À UNE (1 à 24) et non décalées d’un « -4 » : un décalage relatif rejoué décalerait une seconde fois. ⚠️ CE QUI EST PERDU : les cours, fiches de révision, cartes mentales et 12 questions des 4 chapitres supprimés (migrations 043, 067, 141) — tous adossés à des intitulés hors programme.',
  },
  {
    id: '244',
    fichier: '244_espagnol_tle_programme_officiel.sql',
    feature:
      'Espagnol Tle rangé sous les 4 chapitres de son programme (La phrase · Le groupe nominal · Le groupe verbal · Les temps), et la fiche culturelle « Le monde hispanique aujourd’hui » retirée du niveau Tle',
    siAbsente:
      'Les 34 fiches du programme (migration 231) s’affichent à plat, sur 35 lignes d’affilée — la dernière étant une fiche culturelle hors programme renvoyée en fin de liste. L’élève ne retrouve pas les quatre chapitres de son cours, et doit lire les 35 intitulés pour situer le sien.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'theme',
      valeur: 'Le groupe nominal',
    },
    decision:
      'La fiche « Le monde hispanique aujourd’hui » est SUPPRIMÉE côté Terminale (leçon en cascade, plus son quiz et les lignes « À revoir » qui pointaient ses questions) : la 231 l’avait conservée au motif que « les axes du bac ne sont pas de la grammaire », mais une fiche unique qui prétend tenir tous les axes culturels d’une année n’est pas un chapitre du programme — c’est la cinquième ligne qui rouvre le doute sur les quatre autres. Le ménage est borné au niveau Tle : la 2de et la 1re gardent la leur. ⚠️ Le sondage porte sur « Le groupe nominal », un thème que l’anglais (243) porte AUSSI : jouer la 243 seule ferait passer cette ligne au vert à tort. Les deux migrations se collent ensemble.',
  },
  {
    id: '245',
    fichier: '245_contenu_histoire_geo_1re.sql',
    feature:
      'Histoire-Géographie 1re : le programme complet — 43 fiches rangées sous 15 chapitres (6 d’histoire, de la Révolution française à la sortie de la Grande Guerre ; 9 de géographie : métropolisation, espaces productifs, espaces ruraux, France et Chine), 344 questions',
    siAbsente:
      'La Première n’a que CINQ chapitres, hérités du premier jeu de données (« L’Europe face aux révolutions », « La Troisième République », « La Grande Guerre et la fin des empires », « La métropolisation », « Les espaces productifs français »), avec deux leçons génériques chacun. Un élève de 1re qui révise le Second Empire, la question sociale, les sociétés coloniales, les espaces ruraux ou la Chine ne trouve rien : quinze chapitres du programme sur quinze sont absents ou réduits à un titre.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'title',
      valeur: 'Le Second Empire (1852-1870) : un régime autoritaire au vernis démocratique',
    },
    decision:
      'La migration SUPPRIME les 5 chapitres hérités (leçons en cascade, plus leurs 5 quiz et les lignes « À revoir » qui pointaient leurs questions) : deux d’entre eux deviennent des CHAPITRES du programme (« L’Europe face aux révolutions », « La Troisième République »), et les garder ferait deux objets du même nom à deux places différentes — un en-tête de section et une ligne de liste. ⚠️ CE QUI EST PERDU : les 10 leçons génériques (« L’essentiel du cours », « Exercices types ») et les questions de ces 5 quiz, écrites pour un découpage que les 43 fiches recouvrent entièrement. ⚠️ Les DELETE sont bornés aux CINQ TITRES EXACTS : sans cette borne, un rejeu effacerait les quiz des 43 fiches neuves, le ménage tournant avant les insertions à chaque passage. Elle reprend enfin l’ALTER TABLE de la 234, jamais exécutée.',
  },
  {
    id: '246',
    fichier: '246_contenu_histoire_tle_1_6.sql',
    feature:
      'Histoire Tle : les chapitres 1 à 6 du programme (1929 → 1969) — crise de 1929, régimes totalitaires, Seconde Guerre mondiale, ordre bipolaire, guerre froide et décolonisation, France de la IVe et de la Ve République : 20 fiches et 160 questions. La migration range aussi TOUT le dossier sous ses 15 chapitres (11 d’histoire, 4 de géographie) et retire les 5 fiches héritées, dont les 2 doublons de géographie connus depuis la 229',
    siAbsente:
      'L’histoire de Terminale commence à « L’influence de la chute de l’URSS sur l’Europe » : tout ce qui précède 1989 manque, sauf trois fiches génériques héritées du premier jeu de données. Un élève qui révise le nazisme, Vichy, la Shoah, la crise de Cuba ou la guerre d’Algérie ne trouve rien. Et les 33 fiches déjà en base (13 d’histoire, 20 de géographie) restent affichées à plat, sans chapitre.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'title',
      valeur: 'Le modèle nazi : en Allemagne, Hitler et la montée du nazisme',
    },
    decision:
      'La migration SUPPRIME les 5 chapitres hérités du premier jeu de données. Ce n’est pas seulement un choix : la fiche « La Seconde Guerre mondiale » de ce module porte le MÊME TITRE que l’un d’eux, et `chapters` a un UNIQUE(subject_id, level, title) — sans le ménage, l’insertion serait ignorée et sa leçon tomberait sur une clé étrangère absente, migration arrêtée à mi-parcours. ⚠️ LE POINT DÉLICAT est la garde `theme IS NULL` du ménage : celui-ci tourne AVANT les insertions à chaque rejeu, et borner par le titre seul ferait viser, au second passage, la fiche NEUVE qui porte le même titre. Les chapitres hérités n’ont jamais eu d’axe, les fiches de ce module en portent un dès l’INSERT : la garde les sépare. ⚠️ CE QUI EST PERDU : les leçons génériques et les quiz des 5 chapitres supprimés — dont « Mers et océans dans la mondialisation » et « L’Union européenne dans la mondialisation », les deux doublons que la 229 avait signalés et laissés en place. Deux UPDATE posent enfin leur chapitre sur les 13 fiches de la 227 et les 20 de la 229, qui sont antérieures à la colonne `theme`.',
  },
  {
    id: '247',
    fichier: '247_chapitre_discipline.sql',
    feature:
      'La discipline portée par le chapitre (`chapters.discipline`) : « Histoire-Géo » cesse d’être une liste de 15 chapitres et se lit en DEUX onglets, « Histoire » et « Géographie », chacun avec ses chapitres, sa progression et son bouton « Reprendre »',
    siAbsente:
      'Le dossier Histoire-Géo garde un onglet « Programme » unique, où les 15 chapitres se suivent — les 11 d’histoire puis les 4 de géographie en Terminale, 6 puis 9 en Première. L’élève qui révise la géo remonte tout le programme d’histoire pour l’atteindre. Rien ne casse (le select de la discipline est isolé et toléré, et il retombe sur `id, theme` seul), mais le filtre ne s’allume pour aucune matière tant que la colonne n’existe pas.',
    sonde: { type: 'colonne', table: 'chapters', colonne: 'discipline' },
    decision:
      'Une COLONNE et non deux matières : le bulletin, l’emploi du temps et le bac disent « Histoire-Géographie ». Séparer les deux matières dédoublerait la moyenne, le classement, le boss et la vignette pour une distinction qui n’existe qu’À L’INTÉRIEUR du dossier — c’est un problème d’affichage, il se règle à l’affichage. Le remplissage passe par le THÈME (30 lignes) et non par le titre des 96 fiches : chaque chapitre du programme appartient à une discipline et à une seule. PRÉREQUIS 245 et 246 : sans les thèmes qu’elles posent, l’UPDATE ne trouve rien à remplir.',
  },
  {
    id: '248',
    fichier: '248_enseignement_scientifique_tle_chapitres.sql',
    feature:
      'Enseignement scientifique Tle rangé sous les 6 chapitres de son programme (Science climat et société · Le futur des énergies × 2 · Une histoire du vivant × 3)',
    siAbsente:
      'Les 16 fiches du programme (migration 228) s’affichent à plat, sur 16 lignes d’affilée dont plusieurs intitulés longs et jumeaux (« L’énergie électrique au cours des deux derniers siècles : le XIXe siècle », puis « … : le XXe siècle »). L’élève ne retrouve pas les chapitres de son cours et doit lire les seize titres pour situer le sien.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'theme',
      valeur: 'Le futur des énergies : choix de développement et futur climatique',
    },
    decision:
      'Migration d’ÉCRITURE PURE : un seul UPDATE, aucune suppression — les 4 fiches de synthèse héritées du premier jeu de données sont déjà parties avec la 228, et la sonde confirme que le dossier ne contient que les 16 fiches du programme. Le découpage est en SIX chapitres et non en quatre thèmes du BO : « Le futur des énergies » pèse 6 fiches et « Une histoire du vivant » 6 aussi — les laisser d’un bloc rendrait l’en-tête inutile. Le thème 2 se lit donc en deux chapitres (l’électricité ; les choix de développement) et le thème 3 en trois (biodiversité ; théorie de l’évolution ; technologies et vivant), comme dans les manuels ; le « projet expérimental et numérique » du BO n’est pas un chapitre de cours et n’a aucune fiche. Aucune fiche n’est déplacée : l’ordre du BO est conservé, seules les frontières de sections sont posées. La colonne `theme` (234, jamais exécutée) est reprise en ADD COLUMN IF NOT EXISTS avec ses GRANT par colonne, comme dans les 243 à 246.',
  },
  {
    id: '249',
    fichier: '249_contenu_allemand_tle.sql',
    feature:
      'Allemand Tle : le programme officiel — 36 fiches rangées sous 5 chapitres (La phrase · Le groupe nominal · Les groupes prépositionnels · Le groupe verbal · Les temps), 288 questions',
    siAbsente:
      'L’allemand de Terminale n’a que TROIS chapitres, hérités du bloc lycée de la 218 et identiques en 2de, en 1re et en Tle (« Raconter au passé », « Le datif et les prépositions », « L’Allemagne d’aujourd’hui »). Un élève de Terminale qui révise la déclinaison de l’adjectif épithète, le passif, la relative, le subjonctif II, les verbes à préverbe séparable ou le génitif ne trouve rien.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'title',
      valeur: 'L’adjectif épithète et ses déclinaisons',
    },
    decision:
      'TERMINALE SEULE : le programme transmis est celui de l’année du bac. La migration SUPPRIME les 3 chapitres hérités au seul niveau Tle (leçons en cascade, plus leurs quiz et les lignes « À revoir » qui pointaient leurs questions) — deux sont des composites que les fiches neuves recouvrent entièrement (« Raconter au passé » se lit désormais en « Le prétérit » et « Le parfait », « Le datif et les prépositions » en trois fiches du chapitre 3), le troisième est la fiche de civilisation « L’Allemagne d’aujourd’hui », hors programme de langue : même décision que pour « Le monde hispanique aujourd’hui » (244), un dossier de matière ne montre QUE son programme. Le filtre `level = Tle` protège le collège (qui a son propre bloc) ET la 2de et la 1re, qui gardent leurs 3 fiches puisque rien ne vient les remplacer à ces niveaux. ⚠️ CE QUI EST PERDU : les 3 leçons et les 24 questions de ces chapitres, écrites pour un découpage que les 36 fiches recouvrent. ⚠️ La 218 est REJOUABLE : la recoller un jour ferait revenir les 3 anciennes fiches au niveau Tle. Elle reprend enfin l’ALTER TABLE de la 234, jamais exécutée, avec ses GRANT par colonne.',
  },
  {
    id: '250',
    fichier: '250_emc_tle_programme_officiel.sql',
    feature:
      'EMC Tle rangé sous les 2 chapitres de son programme (Fondements et expériences de la démocratie · Repenser et faire vivre la démocratie), et les 3 fiches du socle lycée retirées côté Terminale',
    siAbsente:
      'Les 12 fiches du programme (migration 230) s’affichent à plat, sur 15 lignes d’affilée — les trois premières étant les fiches du socle lycée (« La liberté d’expression et ses limites », « Démocratie et État de droit », « Enjeux du numérique et de l’information »), écrites pour la 2de, la 1re et la Tle à la fois. L’élève ne retrouve pas les deux chapitres de son cours et lit trois intitulés hors programme avant d’arriver au sien.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'theme',
      valeur: 'Fondements et expériences de la démocratie',
    },
    decision:
      'Les 3 fiches du socle sont SUPPRIMÉES au seul niveau Tle (leçons en cascade, plus leurs quiz et les lignes « À revoir » qui pointaient leurs questions) : la 230 les avait conservées et démarrait son bloc à la position 4, au motif qu’un rejeu de la 216 les recréerait — mais trois lignes hors programme en TÊTE de liste rouvrent le doute sur les douze autres, comme les quatre faux axes d’anglais (243) et la fiche culturelle d’espagnol (244). La 2de et la 1re gardent les leurs : elles n’ont pas encore de programme propre. ⚠️ CE QUI EST PERDU : les 3 leçons et les questions de leurs quiz, côté Terminale seulement — le même contenu reste servi en 2de et en 1re. ⚠️ LA 216 EST REJOUABLE : la recoller ferait revenir les trois fiches au niveau Tle. Les positions des 12 fiches sont réécrites une à une (1 à 12) et non décalées d’un « -3 » : un décalage relatif rejoué décalerait une seconde fois.',
  },
  {
    id: '251',
    fichier: '251_svt_tle_chapitres.sql',
    feature:
      'SVT Tle rangée sous les 7 chapitres de son programme (diversité génétique · passé géologique · la plante · climats · système nerveux · contraction musculaire · stress)',
    siAbsente:
      'Les 22 fiches du programme (migration 233) s’affichent à plat, sur 22 lignes d’affilée dont plusieurs intitulés longs et jumeaux (« La chronologie relative : décrypter le temps des roches par l’observation », puis « La chronologie absolue : … par des mesures »). L’élève doit lire les vingt-deux titres pour situer le sien, alors que son cours est écrit en sept chapitres.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'theme',
      valeur: 'De la plante sauvage à la plante domestiquée',
    },
    decision:
      'Migration d’ÉCRITURE PURE : un seul UPDATE, aucune suppression — les 5 fiches composites héritées de 008/142 sont déjà parties avec la 233, et la sonde confirme que le dossier ne contient plus que les 22 fiches du programme. Le découpage est en SEPT chapitres et non en trois thèmes du BO : « Corps humain et santé » pèserait à lui seul 8 fiches, et ce sont les chapitres, pas les thèmes, que l’élève lit sur le cahier de son professeur — même arbitrage que pour l’enseignement scientifique (248). Aucune fiche n’est déplacée : l’ordre du BO est déjà celui de la base, seules les frontières de sections sont posées. La colonne `theme` (234, jamais exécutée) est reprise en ADD COLUMN IF NOT EXISTS avec ses GRANT par colonne, comme dans les 243 à 250.',
  },
  {
    id: '252',
    fichier: '252_contenu_physique_chimie_tle.sql',
    feature:
      'Physique-Chimie Tle (spécialité) : le programme officiel — 31 fiches rangées sous 7 chapitres (composantes d’un système chimique · évolution temporelle · état final · synthèse organique · mouvements et interactions · énergie · ondes et signaux), 248 questions',
    siAbsente:
      'La spécialité physique-chimie de Terminale n’a que CINQ chapitres, taillés dans un découpage maison hérité des migrations 008 et 143 (« Cinétique chimique », « Acides et bases », « Mécanique : lois de Newton », « Ondes lumineuses : diffraction », « Énergie et thermodynamique »), chacun résumant un pan entier du programme en UNE fiche de dix questions. Des chapitres entiers du BO n’ont aucune entrée : radioactivité et décroissance radioactive, piles et électrolyse, équilibre chimique et quotient de réaction, toute la synthèse organique, champ de gravitation et lois de Kepler, écoulement des fluides, premier principe, transferts thermiques, intensité sonore, effet Doppler, interférences, lunette astronomique, photon, condensateur. Sur une spécialité à coefficient 16, l’élève ne trouve rien sur les deux tiers de son année.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'theme',
      valeur: 'Stratégies en synthèse organique',
    },
    decision:
      'TERMINALE SEULE : le ménage est borné au niveau Tle — les six autres niveaux de physique-chimie portent les mêmes leçons génériques (« L’essentiel du cours », « Exercices types ») et ne bougent pas. La migration SUPPRIME les 5 chapitres composites, que les 31 fiches recouvrent (leçons en cascade, plus leurs quiz et les lignes « À revoir » qui pointaient leurs questions) ; le ménage vise les TITRES DE CHAPITRE exacts, aucun d’eux ne portant d’apostrophe — pas de piège typographique ici, contrairement à la 249. Le découpage est en SEPT chapitres et non en quatre thèmes du BO : le premier thème (« Constitution et transformations de la matière ») pèserait à lui seul 15 fiches sur 31, soit la moitié du dossier sous un seul en-tête — même arbitrage que pour l’enseignement scientifique (248) et la SVT (251). ⚠️ CE QUI EST PERDU : les 5 leçons « Exercices types » de la 143 (elles n’ont aucun quiz en base, sondé le 20/08/2026) et les 50 questions des 5 leçons « L’essentiel du cours ». ⚠️ LES 008 ET 143 SONT REJOUABLES : les recoller ferait revenir les 5 composites en doublon des 31 fiches. La colonne `theme` (234, jamais exécutée) est reprise en ADD COLUMN IF NOT EXISTS avec ses GRANT par colonne, comme dans les 243 à 251.',
  },
  {
    id: '253',
    fichier: '253_contenu_ses_tle.sql',
    feature:
      'SES Tle (spécialité) : le programme officiel — 31 fiches rangées sous les 12 chapitres du BO (croissance · commerce international · chômage · crises financières · politiques européennes · structure sociale · École · mobilité sociale · travail et emploi · engagement politique · justice sociale · environnement), 248 questions',
    siAbsente:
      'La spécialité SES de Terminale n’a que QUATRE chapitres, hérités des migrations 008 et 145 (« Croissance et environnement », « Le commerce international », « Les mutations du travail », « La justice sociale »). Sur les douze chapitres du programme, HUIT n’ont aucune entrée : le chômage, les crises financières, les politiques économiques européennes, la structure sociale, l’École, la mobilité sociale, l’engagement politique, l’action publique pour l’environnement. Toute la sociologie, hormis un chapitre sur le travail, est absente — sur une spécialité à coefficient 16 dont l’épreuve dure 4 heures.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'theme',
      valeur: 'Quelle action publique pour l’environnement ?',
    },
    decision:
      'TERMINALE SEULE : le ménage est borné au niveau Tle — la 2de et la 1re portent les mêmes leçons génériques et ne bougent pas. La migration SUPPRIME les 4 chapitres composites, que les 31 fiches recouvrent (leçons en cascade, plus leurs quiz et les lignes « À revoir » qui pointaient leurs questions) ; aucun des quatre titres ne porte d’apostrophe, donc pas de piège typographique ici. Le découpage est en DOUZE chapitres et non en trois parties du BO : « science économique » pèserait à elle seule 14 fiches, et ce sont les questionnements, formulés en question comme le veut la discipline, que l’élève lit sur le cahier de son professeur — même arbitrage que pour l’enseignement scientifique (248), la SVT (251) et la physique-chimie (252). ⚠️ CE QUI EST PERDU : les 4 leçons « Exercices types » de la 145 (aucun quiz en base, sondé le 20/08/2026) et les 40 questions des 4 leçons « L’essentiel du cours ». ⚠️ LES 008 ET 145 SONT REJOUABLES : les recoller ferait revenir les 4 composites en doublon.',
  },
  {
    id: '254',
    fichier: '254_contenu_nsi_tle.sql',
    feature:
      'NSI Tle (spécialité) : le programme officiel — 20 fiches rangées sous 5 chapitres (appareils en réseaux · structures de données · bases de données · génie logiciel · algorithmique), 160 questions',
    siAbsente:
      'La spécialité NSI de Terminale n’a que QUATRE chapitres, hérités des migrations 008 et 146 (« Structures de données », « Bases de données et SQL », « Réseaux et protocoles », « Algorithmique : les graphes »). Des parties entières du BO n’ont AUCUNE entrée : tout le génie logiciel (paradigmes, modularité, tests, mise au point), la programmation orientée objet, les arbres, la programmation dynamique, la recherche de sous-chaîne, la modélisation d’une base de données et le rôle d’un SGBD.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'theme',
      valeur: 'Génie logiciel',
    },
    decision:
      'TERMINALE SEULE : la Première, qui a son propre programme, n’est pas touchée. ⚠️ LE MÉNAGE EST INDISPENSABLE, pas seulement souhaitable : le chapitre neuf « Structures de données » porte EXACTEMENT le titre d’un chapitre existant, et `chapters` est UNIQUE(subject_id, level, title) — sans suppression préalable, l’INSERT tomberait dans son ON CONFLICT DO NOTHING et ses quatre leçons échoueraient sur une clé étrangère absente, la migration s’arrêtant à mi-parcours. ⚠️ CE QUI EST PERDU : les 4 leçons « Exercices types » de la 146 (aucun quiz en base) et les 40 questions des 4 leçons « L’essentiel du cours ». ⚠️ LES 008 ET 146 SONT REJOUABLES. Les cours ne contiennent aucun bloc de code délimité par des accents graves : le contenu est écrit dans des littéraux de gabarit JavaScript, où l’accent grave fermerait la chaîne — les extraits sont donnés en ligne. ⚠️ LES EXTRAITS SQL DES COURS SONT ÉCRITS EN GRAS ET SANS POINT-VIRGULE, à dessein : une première version de cette migration a échoué le 20/08/2026 dans l’éditeur Supabase sur « 42P01 : la relation eleve n’existe pas », alors que le fichier était sain (`node _ASSOCIE/verifie-chaines.mjs` le découpe selon les règles de Postgres — 12 instructions, zéro « eleve » hors chaîne). C’est le seul module du dépôt dont les cours citent de vraies requêtes : écrites en début de ligne avec leur point-virgule, il suffit qu’un maillon de la chaîne rompe le littéral qui porte le cours pour qu’elles deviennent des instructions réelles — et comme elles sont valides, l’erreur désigne une table fantôme au lieu de la vraie cause. L’éditeur jouant le script dans une transaction, un échec n’applique rien.',
  },
  {
    id: '255',
    fichier: '255_contenu_maths_tle.sql',
    feature:
      'Maths Tle : le programme officiel sur les TROIS matières — 19 fiches de spécialité (algèbre et géométrie · analyse · probabilités), 12 de mathématiques expertes (nombres complexes · arithmétique · graphes et matrices) et 11 de mathématiques complémentaires (analyse · probabilités et statistique), 336 questions',
    siAbsente:
      'La spécialité maths de Terminale n’a que CINQ chapitres pour QUINZE sections au BO : manquent EN ENTIER la géométrie dans l’espace, la combinatoire, le raisonnement par récurrence, les limites de suites, la dérivation des composées, les fonctions trigonométriques, le calcul intégral et toute la chaîne probabiliste. C’est l’écart le plus grave du dépôt (audit du 07/08/2026, priorité n° 1) : une spécialité à coefficient 16 et 4 heures d’épreuve, couverte à un tiers. Les deux options ne valent guère mieux : 3 chapitres en expertes, 4 en complémentaires.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'theme',
      valeur: 'Algèbre et géométrie',
    },
    decision:
      'TROIS MATIÈRES, UNE SEULE MIGRATION. La maquette de référence range les 8 chapitres sous un dossier unique « Maths Tle », dont 5 relèvent des options ; l’app sépare `maths`, `maths-expertes` et `maths-complementaires` depuis l’origine, chacune cochable dans « Ma classe ». Les fusionner montrerait à un élève de spécialité seule un programme qu’il ne suit pas, et contredirait la règle « un dossier ne montre QUE son programme » — les fiches d’option restent donc dans leur matière, et le préfixe « Option mathématiques expertes : … » disparaît des en-têtes. ⚠️ LE MÉNAGE EST INDISPENSABLE côté spécialité : deux fiches neuves (« Limites de fonctions », « Primitives et équations différentielles ») portent EXACTEMENT le titre d’un chapitre existant, et le filtre level = Tle est tout aussi nécessaire — `maths` existe sur SEPT niveaux. ⚠️ APOSTROPHE TYPOGRAPHIQUE côté complémentaires : le titre « Suites et modèles d’évolution » porte le U+2019 de la 219 ; écrit droit, le DELETE ne trouverait rien sans rien signaler (piège de la 249). ⚠️ CE QUI EST PERDU : les 12 leçons « Exercices types » des 139 et 149 (aucun quiz en base) et les questions des leçons « L’essentiel du cours ». ⚠️ LES 008, 139 ET 149 SONT REJOUABLES, et la 219 est un fichier GÉNÉRÉ donc rejouable aussi.',
  },
  {
    id: '256',
    fichier: '256_contenu_hggsp_tle.sql',
    feature:
      'HGGSP Tle (spécialité) : le programme officiel — 24 fiches rangées sous les 6 thèmes du BO (nouveaux espaces de conquête · faire la guerre, faire la paix · histoire et mémoires · patrimoine · environnement · enjeu de la connaissance), 192 questions',
    siAbsente:
      'La spécialité HGGSP de Terminale n’a que QUATRE chapitres composites, hérités des migrations 008, 054, 075 et 147 (« Environnement : exploiter, préserver », « Guerres et paix », « L’enjeu de la connaissance », « Le patrimoine »), là où le programme en compte SIX. Deux thèmes entiers n’ont AUCUNE entrée : « De nouveaux espaces de conquête » (droit de la mer, conquête spatiale, câbles sous-marins, stratégie maritime chinoise) et « Histoire et mémoires » (guerre d’Algérie, responsabilités de 1914, génocide des Juifs et des Tsiganes, jugement des crimes de masse au Rwanda et dans les Balkans). Un tiers d’une spécialité à coefficient 16 est hors d’atteinte.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'theme',
      valeur: 'De nouveaux espaces de conquête',
    },
    decision:
      'TERMINALE SEULE : la Première garde ses 4 fiches composites — il lui manque le thème « Analyser les dynamiques des puissances internationales », c’est un chantier à part. Le ménage est donc borné à level = Tle, sans quoi il emporterait les deux leçons génériques du niveau 1re, qui portent les mêmes titres. AUCUNE COLLISION DE TITRE cette fois : les 24 fiches neuves ont été comparées une à une aux 4 chapitres composites, aucune ne reprend leur intitulé — le ménage relève de la règle « un dossier ne montre QUE son programme », pas d’une contrainte d’unicité. La garde `theme IS NULL` rend le rejeu inoffensif : les composites sont antérieures à la 234 et n’ont jamais eu d’axe, les fiches neuves en portent un dès l’INSERT. ⚠️ CE QUI EST PERDU : les 4 leçons « Exercices types » de la 147 (2 exercices type bac corrigés chacune, aucun quiz en base) et les 40 questions des 4 leçons « L’essentiel du cours ». ⚠️ LES 008, 054, 075 ET 147 SONT REJOUABLES : les recoller ferait revenir les 4 fiches composites en doublon.',
  },
  {
    id: '257',
    fichier: '257_hlp_tle_chapitres.sql',
    feature:
      'HLP Tle rangé sous ses 6 chapitres : les 18 fiches de la 232 reçoivent le thème du programme (éducation et émancipation · expressions de la sensibilité · métamorphoses du moi · création, continuités et ruptures · histoire et violence · l’humain et ses limites)',
    siAbsente:
      'La page HLP de Terminale aligne 19 lignes à plat au lieu d’afficher les six chapitres du programme. Les 18 fiches sont pourtant là, dans le bon ordre depuis la 232 : il ne manque que la colonne `theme` qui les coiffe.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'theme',
      valeur: 'Les métamorphoses du moi',
    },
    decision:
      'ÉCRITURE PURE, aucune suppression — c’est le geste de la 248 (enseignement scientifique), pas celui des 243/251/256. LES SIX THÈMES DEVIENNENT LES CHAPITRES, ET NON LES DEUX SEMESTRES : le BO découpe l’année en deux semestres de trois thèmes, mais deux blocs de neuf fiches n’aideraient personne — c’est aussi le découpage de la maquette. ⚠️ LA FICHE « MÉTHODE DE L’ÉPREUVE » RESTE À `theme IS NULL`, délibérément : elle ne relève d’aucune entrée du BO, la 232 l’a renvoyée en position 90, et l’épreuve de la 237 la désigne comme son chapitre de rattachement. Vérifié dans le code avant d’écrire : `groupChaptersByTheme` la rend dans un groupe SANS en-tête à sa place d’apparition, et `ChapterList` ne lui fait pas consommer de numéro — les six chapitres restent numérotés 1 à 6. ⚠️ LES 18 TITRES ONT ÉTÉ EXTRAITS DE LA BASE, PAS RECOPIÉS (apostrophes typographiques et guillemets français de la 232, un fichier généré) : une apostrophe droite ne ferait pas échouer l’UPDATE, elle ne trouverait pas la ligne EN SILENCE — piège de la 249, d’où le filet de fin de fichier.',
  },
  {
    id: '258',
    fichier: '258_contenu_enseignement_scientifique_1re.sql',
    feature:
      'Enseignement scientifique 1re : les 22 fiches du programme rangées sous leurs 5 chapitres (matière · Soleil · Terre · son et musique · mathématiques) — 176 questions',
    siAbsente:
      'L’enseignement scientifique de Première garde ses 4 fiches de synthèse, qui résument tout le programme en quatre cours — et la partie MATHÉMATIQUES, entrée dans la matière à la rentrée 2023 pour les élèves sans spécialité maths, n’existe nulle part. Un élève qui révise les cristaux, la loi de Wien, l’albédo, Ératosthène, la radiochronologie, la gamme tempérée, l’échantillonnage d’un son, le taux d’évolution ou le nombre dérivé ne trouve rien. Rien ne casse : le tiers mathématique du programme est simplement absent.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'theme',
      valeur: 'Son et musique, porteurs d’informations',
    },
    decision:
      'PREMIÈRE SEULE : le ménage est borné à level = 1re — la Terminale de la même matière est déjà rangée (228 + 248) et ne bouge pas. LE MÉNAGE VISE `theme IS NULL`, PAS LES TITRES, et c’est un choix : le chapitre « Le Soleil, source d’énergie » porte en base une apostrophe DROITE (relevé caractère par caractère le 20/08/2026) là où le contenu récent porte l’apostrophe typographique — un DELETE par titre ne trouverait pas la ligne EN SILENCE (piège de la 249) et laisserait une fiche composite en tête du dossier. Le critère « pas de chapitre de programme » vise exactement les mêmes quatre lignes sans dépendre d’un caractère, et il est sûr au rejeu : les 22 fiches neuves portent leur chapitre dès l’INSERT, le ménage tourne avant les insertions. LE DÉCOUPAGE EST CELUI DE LA MAQUETTE : quatre thèmes du BO plus les mathématiques ; le « projet expérimental et numérique » n’est pas un chapitre de cours mais un travail d’année, sans fiche à réviser — même arbitrage qu’en Terminale (248). ⚠️ CE QUI EST PERDU : les 4 leçons « Exercices types » (aucun quiz en base) et les 40 questions des 4 leçons « L’essentiel du cours ». ⚠️ LES 008 ET 142 SONT REJOUABLES : les recoller ferait revenir les 4 composites en doublon.',
  },
  {
    id: '259',
    fichier: '259_contenu_francais_1re.sql',
    feature:
      'Français 1re : les 18 fiches des quatre objets d’étude du bac (poésie, littérature d’idées, roman, théâtre) et les 10 fiches de grammaire du BO — 224 questions, et le dossier passe à trois rayons',
    siAbsente:
      'Le français de Première garde ses 5 fiches composites : AUCUNE œuvre au programme n’a sa fiche — ni les Cahiers de Douai, ni Manon Lescaut, ni La Peau de chagrin, ni Colette, ni Le Menteur. Un élève qui prépare son oral ou sa dissertation ne trouve rien, et la question de grammaire, qui vaut 2 points sur 20 à l’oral, n’a aucune entrée. Rien ne casse : la matière la plus lourde du bac de 1re est simplement vide.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'discipline',
      valeur: 'grammaire',
    },
    decision:
      'LE DOSSIER PREND TROIS RAYONS, et c’est le vrai changement : la colonne `chapters.discipline` (migration 247), jusque-là réservée aux deux disciplines de l’histoire-géo, porte désormais aussi « programme » / « fiches » / « grammaire » pour le français. Le besoin est identique — couper une liste que personne ne parcourt en entier — et le mécanisme aussi (`disciplinesOf` → `modesFor`, testés) : la page rend un onglet par rayon, avec son propre compte et son propre « Reprendre ». Une colonne `section` en doublon n’aurait rien réglé de plus, d’où le choix d’élargir celle qui existe (commentaires mis à jour dans lib/subject-template.ts). LE MÉNAGE VISE `theme IS NULL` : la fiche de synthèse neuve « La poésie du XIXe au XXIe siècle » porte le titre EXACT de l’ancien chapitre composite, et `chapters` est UNIQUE(subject_id, level, title) — sans le ménage joué avant, l’INSERT tomberait dans le ON CONFLICT DO NOTHING et la leçon échouerait sur une clé étrangère absente. PREMIÈRE SEULE : le français existe sur six niveaux, tous bâtis sur le même modèle de cinq composites. ⚠️ CE QUI EST PERDU : les 5 leçons « Exercices types » et les 50 questions des 5 leçons « L’essentiel du cours ». ⚠️ LES 008 ET 142 SONT REJOUABLES.',
  },
  {
    id: '260',
    fichier: '260_contenu_francais_1re_anciens.sql',
    feature:
      'Français 1re : les 30 fiches du chapitre « Anciens programmes » (Phèdre, Figaro, Les Fleurs du mal, Gargantua, Olympe de Gouges…) — 240 questions',
    siAbsente:
      'Le rayon Programme du français s’arrête aux 18 fiches des quatre objets d’étude en cours. Les œuvres des programmes précédents — celles que gardent les descriptifs d’oral, les devoirs et les concours blancs — n’ont pas de fiche.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'theme',
      valeur: 'Anciens programmes',
    },
    decision:
      'SÉPARÉE DE LA 259 POUR UNE RAISON DE TAILLE : les 58 fiches réunies produisaient 339 Ko, au-delà des ~300 Ko que l’éditeur SQL de Supabase tient sans devenir poussif, et un script à moitié collé est pire qu’un script absent. La coupe suit la seule ligne qui ait un sens : les objets d’étude au programme d’un côté, les œuvres sorties du programme de l’autre. ⚠️ ORDRE : LA 259 D’ABORD — c’est elle qui pose les colonnes `theme` et `discipline` et qui fait le ménage ; cette migration n’écrit que des fiches neuves. Les positions démarrent à 19 (`positionDepart`), derrière les 18 fiches des quatre objets d’étude : repartir de 1 mêlerait les deux migrations dans un ordre indéfini, la page matière triant par position.',
  },
  {
    id: '261',
    fichier: '261_contenu_francais_fiches_a.sql',
    feature:
      'Français 1re, rayon « Fiches de lecture » (1/5) : 52 fiches, de « Art » de Yasmina Reza à Cyrano de Bergerac — 312 questions',
    siAbsente:
      'Le troisième rayon du dossier de français reste vide : un élève qui cherche la fiche d’une œuvre précise pour un devoir, une dissertation ou une lecture cursive ne trouve rien. L’onglet « Fiches » n’apparaît même pas, faute de chapitre portant `discipline = fiches`.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'discipline',
      valeur: 'fiches',
    },
    decision:
      'FORMAT COURT ASSUMÉ, différent de celui du rayon Programme : l’histoire, les personnages, ce qu’il faut retenir, une phrase à citer, et six questions — on vient chercher une fiche, on ne la révise pas pour l’oral. LES TITRES PORTENT L’AUTEUR (« Manon Lescaut, abbé Prévost ») comme dans la maquette, ce qui n’est pas décoratif : `chapters` est UNIQUE(subject_id, level, title), et c’est ce qui permet à une même œuvre d’exister dans le rayon Programme (titre nu) et dans le rayon Fiches. CINQ MIGRATIONS (261 → 265) par tranches alphabétiques : réunies, les 260 fiches feraient près d’un mégaoctet, quand l’éditeur SQL de Supabase devient poussif au-delà de ~300 Ko ; chaque tranche pèse ~205 Ko. Les positions se suivent d’un module à l’autre (100 → 359) pour que l’ordre alphabétique de la maquette soit celui de la page. ⚠️ ORDRE : LA 259 D’ABORD (colonnes `theme` et `discipline`, ménage des composites). ⚠️ UNE ŒUVRE DE LA MAQUETTE MANQUE : « Le Gora, Georges Courteline » — aucune œuvre de Courteline ne porte ce titre, erreur d’attribution probable de la source ; écrire la fiche reviendrait à inventer une œuvre.',
  },
  {
    id: '262',
    fichier: '262_contenu_francais_fiches_b.sql',
    feature:
      'Français 1re, fiches de lecture (2/5) : 52 fiches, d’Eugénie Grandet à La Curée — 312 questions',
    siAbsente:
      'Le rayon « Fiches » s’arrête à Cyrano : les œuvres d’Eugénie Grandet à La Curée n’ont pas de fiche.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'title',
      valeur: 'Germinal, Émile Zola',
    },
    decision:
      'Deuxième tranche alphabétique. Positions 152 → 203, derrière celles de la 261. Aucun ménage : il est joué par la 259, à exécuter avant.',
  },
  {
    id: '263',
    fichier: '263_contenu_francais_fiches_c.sql',
    feature:
      'Français 1re, fiches de lecture (3/5) : 52 fiches, de La Ferme des animaux au Tartuffe — 312 questions',
    siAbsente:
      'Le rayon « Fiches » n’a pas les œuvres de La Ferme des animaux au Tartuffe — dont La Peste, Le Cid, Le Père Goriot ou Le Rouge et le Noir.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'title',
      valeur: 'La Peste, Albert Camus',
    },
    decision:
      'Troisième tranche alphabétique. Positions 204 → 255. Aucun ménage : il est joué par la 259, à exécuter avant.',
  },
  {
    id: '264',
    fichier: '264_contenu_francais_fiches_d.sql',
    feature:
      'Français 1re, fiches de lecture (4/5) : 52 fiches, du Voyage d’Urien aux Mémoires d’Hadrien — 312 questions',
    siAbsente:
      'Le rayon « Fiches » n’a pas les œuvres du Voyage d’Urien aux Mémoires d’Hadrien — dont Les Liaisons dangereuses, Les Misérables ou Madame Bovary.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'title',
      valeur: 'Madame Bovary, Gustave Flaubert',
    },
    decision:
      'Quatrième tranche alphabétique. Positions 256 → 307. Aucun ménage : il est joué par la 259, à exécuter avant.',
  },
  {
    id: '265',
    fichier: '265_contenu_francais_fiches_e.sql',
    feature:
      'Français 1re, fiches de lecture (5/5) : 52 fiches, des Mémoires d’outre-tombe à Zazie dans le métro — 312 questions',
    siAbsente:
      'Le rayon « Fiches » s’arrête aux Mémoires d’Hadrien : la fin de l’alphabet manque, dont Rhinocéros, Une Vie, Voyage au bout de la nuit et Zazie dans le métro.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'title',
      valeur: 'Zazie dans le métro, Raymond Queneau',
    },
    decision:
      'Dernière tranche alphabétique. Positions 308 → 359. Aucun ménage : il est joué par la 259, à exécuter avant. Avec elle, le rayon « Fiches » compte 260 fiches et 1 560 questions.',
  },
  {
    id: '266',
    fichier: '266_contenu_anglais_1re_programme.sql',
    feature:
      'Anglais 1re rendu à son programme de LANGUE : les 24 fiches de grammaire rangées sous leurs 4 chapitres (Le groupe nominal · Le groupe verbal · Les temps · La phrase) — 192 questions —, et les 4 axes culturels du seed 008 retirés du niveau 1re',
    siAbsente:
      'L’anglais de Première n’a QUE ses 4 axes culturels — « Identités et échanges », « Espace privé et espace public », « Art et pouvoir », « Citoyenneté et mondes virtuels » — et pas une seule fiche de langue : un élève qui bloque sur le present perfect, les modaux, la voix passive ou le discours indirect ne trouve rien à réviser, alors que la Terminale, elle, est servie depuis la 243.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '6c812d1e-3b57-5c8f-8d6c-edc60516985a',
    },
    decision:
      'SONDE PAR ID, ET NON PAR TITRE OU PAR THÈME : les 24 fiches de 1re portent EXACTEMENT les titres et les chapitres de celles de Terminale (mêmes règles de grammaire), si bien qu’un `eq(title, …)` ou un `eq(theme, …)` répondrait « vivante » grâce à la Terminale seule — un faux vert. L’UUID sondé est celui de la fiche « Les déterminants » DE PREMIÈRE, dérivé de `anglais|1re|Les déterminants` : il n’existe qu’après cette migration. LE CONTENU EST CELUI DE LA TERMINALE, importé et non recopié (`scripts/contenu/anglais-1re.mjs` importe `anglais-tle.mjs`) : les programmes de LV sont écrits pour le CYCLE TERMINAL, la grammaire y est la même, et une correction de règle vaudra pour les deux niveaux. LE MÉNAGE VISE `theme IS NULL` AU NIVEAU 1re, pas les titres : deux des quatre axes portent une apostrophe, et rien ne garantit que la base porte la même que le fichier (piège de la 249) ; le critère « pas de chapitre de programme » vise exactement ces quatre lignes, antérieures à la colonne `theme`, et ne peut jamais mordre sur les 24 fiches neuves, qui en portent un dès l’INSERT. ⚠️ CE QUI EST PERDU : les cours, cartes mentales et quiz des 4 axes de 1re (migrations 043, 067, 132) — mêmes pertes qu’en Terminale avec la 243. ⚠️ LES 008 ET 132 SONT REJOUABLES : les recoller ferait revenir les 4 axes. Si l’on veut un jour leur rendre une place, ce sera un RAYON à eux (`chapters.discipline`, comme le français de 1re), pas la tête du dossier.',
  },
  {
    id: '267',
    fichier: '267_contenu_espagnol_1re_programme.sql',
    feature:
      'Espagnol 1re rendu à son programme de LANGUE : les 34 fiches de grammaire rangées sous leurs 4 chapitres (La phrase · Le groupe nominal · Le groupe verbal · Les temps) — 272 questions —, et les 3 fiches maison du seed 220 retirées du niveau 1re',
    siAbsente:
      'L’espagnol de Première n’a QUE les 3 fiches maison de la migration 220 — « Les temps du passé », « Ser, estar et les tournures essentielles », « Le monde hispanique aujourd’hui » : un élève qui bloque sur la négation, l’enclise des pronoms, cuyo, l’apocope, le subjonctif ou la concordance ne trouve rien à réviser, alors que la Terminale est servie depuis les 231 et 244.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: 'e50c16f0-fd80-5177-b3aa-c857f7ad50a8',
    },
    decision:
      'MÊME MONTAGE QUE LA 266, POUR LA MÊME RAISON : les 34 titres et les 4 chapitres de 1re sont EXACTEMENT ceux de la Terminale, donc un `eq(title, …)` ou un `eq(theme, …)` répondrait « vivante » grâce à la Terminale seule — un faux vert. L’UUID sondé est celui de la fiche « Les questions » DE PREMIÈRE, dérivé de `espagnol|1re|Les questions`. LE CONTENU EST IMPORTÉ, PAS RECOPIÉ (`scripts/contenu/espagnol-1re.mjs` importe `espagnol-tle.mjs`) : les programmes de LV sont écrits pour le CYCLE TERMINAL, la grammaire y est la même, et une correction faite une fois vaut pour les deux niveaux. ⚠️ TROIS MODULES PORTENT LE SLUG `espagnol` (220, 231, 267) : générer avec `--slugs espagnol` les fusionnerait et réécrirait deux migrations déjà exécutées — toujours `--modules espagnol-1re`. LE MÉNAGE VISE `theme IS NULL` AU NIVEAU 1re : « Le monde hispanique aujourd’hui » porte une apostrophe, dont rien ne garantit la forme en base (piège de la 249). LA FICHE CULTURELLE PART AUSSI, comme en Terminale avec la 244 : une fiche unique qui prétend tenir tous les axes d’une année n’est pas un chapitre du programme. ⚠️ LA 220 EST REJOUABLE : la recoller ferait revenir les 3 fiches. La 2de, elle, garde les siennes — le ménage est borné à `level = 1re`.',
  },
  {
    id: '268',
    fichier: '268_contenu_ses_1re_programme.sql',
    feature:
      'SES 1re (spécialité) : les 23 fiches du programme rangées sous leurs 7 chapitres (marché · monnaie et financement · socialisation · liens sociaux · déviance · vote et opinion publique · regards croisés) — 184 questions —, et les 4 fiches composites retirées du niveau 1re',
    siAbsente:
      'La spécialité SES de Première n’a que 4 fiches composites — « Le marché et ses défaillances », « La monnaie et le financement », « Socialisation et groupes sociaux », « L’opinion publique ». La moitié des questionnements du programme n’a aucune entrée : marchés imparfaitement concurrentiels, financement des agents, création monétaire, liens sociaux, déviance et contrôle social, vote, protection sociale, entreprise et gouvernance.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '9d54ed6e-8234-52d8-8672-caa4a6dea667',
    },
    decision:
      'SONDE PAR ID (fiche « Qu’est-ce qu’un marché ? » de 1re, dérivé de `ses|1re|Qu’est-ce qu’un marché ?`) : le titre porte une apostrophe typographique, et une sonde par titre dépendrait de la forme exacte stockée. LE DÉCOUPAGE EST CELUI DE LA MAQUETTE — 7 chapitres, ni les 3 parties du BO (trois en-têtes pour 23 fiches ne rangeraient presque rien) ni les 12 questionnements (des sections d’une seule fiche). ⚠️ LES FICHES « (suite) » DE LA MAQUETTE ONT ÉTÉ RENOMMÉES : la source découpe quatre questionnements longs en deux pages dont la seconde s’appelle « … (suite) » — un titre qui ne dit rien dans une liste de fiches, alors que `chapters` est UNIQUE(subject_id, level, title). Le compte de fiches et l’ordre du programme sont inchangés. LE MÉNAGE VISE `theme IS NULL` AU NIVEAU 1re, pas les titres (« L’opinion publique » porte une apostrophe). ⚠️ CE QUI EST PERDU : les cours et les quiz des 4 fiches composites, adossés à un découpage que les 23 fiches recouvrent. La Terminale a reçu son programme avec la 253, la 2de garde ses fiches.',
  },
  {
    id: '269',
    fichier: '269_contenu_svt_1re_programme.sql',
    feature:
      'SVT 1re (spécialité) : les 21 fiches du programme rangées sous leurs 4 chapitres (patrimoine génétique · dynamique interne de la Terre · enjeux contemporains de la planète · corps humain et santé) — 168 questions —, et les 4 fiches composites retirées du niveau 1re',
    siAbsente:
      'La spécialité SVT de Première n’a que 4 fiches composites — « Expression du patrimoine génétique », « La dynamique interne de la Terre », « Écosystèmes et services », « Variation génétique et santé ». La réplication de l’ADN, la mitose et la méiose, la sismologie, les trois types de frontières de plaques, la cancérisation, l’immunité innée, l’immunité adaptative et la vaccination n’ont aucune entrée : l’essentiel de l’année, et le socle de la Terminale.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: 'de8ed94b-796f-5073-b843-116097058972',
    },
    decision:
      'SONDE PAR ID (fiche « La réplication de l’ADN » de 1re, dérivé de `svt|1re|La réplication de l’ADN`) : le titre porte une apostrophe typographique, et une sonde par titre dépendrait de la forme exacte stockée. LE DÉCOUPAGE EST CELUI DES 4 THÈMES DU BO, qui coïncident ici avec les chapitres du cahier — à la différence des SES, aucun arbitrage n’était nécessaire. ⚠️ POINT À CONNAÎTRE : « La dynamique interne de la Terre » existait en base comme TITRE de fiche et revient ici comme THÈME de sept fiches ; la fiche part, le chapitre reste. LE MÉNAGE VISE `theme IS NULL` AU NIVEAU 1re, jamais les titres (piège de l’apostrophe, cf. 249). ⚠️ CE QUI EST PERDU : les cours et les quiz des 4 fiches composites. Les autres niveaux ne bougent pas : la Terminale a reçu son programme avec la 233, rangée sous ses chapitres par la 251.',
  },
  {
    id: '270',
    fichier: '270_contenu_physique_chimie_1re.sql',
    feature:
      'Physique-chimie 1re (spécialité) : les 22 fiches du programme rangées sous leurs 6 chapitres (mouvements et interactions · lumière, images et couleurs · énergie · constitution et transformations de la matière · structure de la matière · propriétés physico-chimiques) — 176 questions —, et les 5 fiches composites retirées du niveau 1re',
    siAbsente:
      'La spécialité de Première n’a que 5 fiches composites héritées des migrations écrites à la main (037 → 143) — « Suivi d’une transformation chimique », « Structure des entités chimiques », « Mouvement et interactions », « L’énergie mécanique », « Ondes mécaniques ». Le dosage par titrage, la relation de conjugaison, le champ électrique, la représentation de Lewis, l’électronégativité, la nomenclature, la synthèse organique et les combustions n’ont aucune entrée : la moitié du programme, et l’essentiel de ce qui se joue en travaux pratiques.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '4db5d1ee-5647-5dd3-9e48-619d3a3908f6',
    },
    decision:
      'SONDE PAR ID (fiche « La statique des fluides » de 1re, dérivé de `physique-chimie|1re|La statique des fluides`), comme les 266 à 269 : une sonde par titre dépendrait de la forme exacte des apostrophes stockées. LE DÉCOUPAGE EST CELUI DE LA MAQUETTE — 6 chapitres, là où le BO en compte 4 : la maquette scinde la chimie en trois blocs qui suivent les trois moments de l’année (quantité de matière et suivi de réaction · structure et cohésion · chimie organique) et sort l’optique des ondes. Six en-têtes pour 22 fiches rangent mieux que quatre, et c’est ce découpage que l’élève a sur son cahier. ⚠️ PAS DE LATEX dans le contenu : le composant de rendu ne le connaît pas — les formules sont écrites en texte (« p = F / S », « E = U / d »). LE MÉNAGE VISE `theme IS NULL` AU NIVEAU 1re : deux des cinq titres portent une apostrophe. ⚠️ CE QUI EST PERDU : les cours et les quiz des 5 fiches composites. Les six autres niveaux ne bougent pas ; la Terminale a reçu son programme avec la 252.',
  },
  {
    id: '271',
    fichier: '271_contenu_maths_1re.sql',
    feature:
      'Maths 1re (spécialité) : les 11 fiches du programme rangées sous leurs 4 chapitres (algèbre · analyse · géométrie · probabilités et statistiques) — 88 questions —, et les 5 fiches héritées retirées du niveau 1re',
    siAbsente:
      'La spécialité de Première n’a que 5 fiches alignées à plat, sans chapitre — « Suites numériques », « Second degré », « Dérivation », « Produit scalaire », « Probabilités conditionnelles ». La fonction exponentielle, les fonctions trigonométriques, l’étude des variations et des courbes, la géométrie repérée et les variables aléatoires n’ont aucune entrée : cinq des onze fiches du programme, dont l’exponentielle, qui commande toute la Terminale.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: 'e6b74138-8a5a-5b0b-8d07-3e2b40009735',
    },
    decision:
      'SONDE PAR ID (fiche « Fonction exponentielle » de 1re, dérivé de `maths|1re|Fonction exponentielle`) : elle n’existe qu’après cette migration, alors qu’une sonde par thème (« Analyse ») pourrait un jour répondre grâce à un autre niveau. ⚠️ UNE COLLISION DE TITRE VOULUE : la fiche « Dérivation » existe DÉJÀ en base au niveau 1re, sans thème, et revient dans ce module. Le ménage tournant AVANT les insertions, l’ancienne ligne part d’abord et la neuve prend sa place — sans lui, l’INSERT tomberait sur son ON CONFLICT DO NOTHING, la fiche neuve ne serait jamais posée et sa leçon échouerait sur une clé étrangère absente. Au rejeu, la « Dérivation » neuve porte le thème « Analyse » et n’est pas visée par le ménage. ⚠️ PAS DE LATEX : les formules sont écrites en texte (« x² », « √n », « u(n+1) = u(n) × q »), comme dans `maths-tle.mjs`. ⚠️ DEUX MODULES PORTENT LE SLUG `maths` (255 Tle, 271 1re) : toujours `--modules maths-1re`. La Terminale ne bouge pas.',
  },
  {
    id: '272',
    fichier: '272_contenu_si_1re.sql',
    feature:
      'Sciences de l’ingénieur 1re : les 23 fiches du programme rangées sous leurs 6 chapitres (analyse du besoin · statique du solide indéformable · théorie des mécanismes · cinématique · transfert de l’information · électrocinétique) — 184 questions —, et les 3 fiches composites du seed 219 retirées du niveau 1re',
    siAbsente:
      'La spécialité Sciences de l’ingénieur de Première n’a que 3 fiches composites héritées de la migration 219 — « Analyser un système », « Énergie et mécanique », « Information, capteurs et programmation ». Le SysML, la modélisation des actions, le principe fondamental de la statique, la cinématique du point, les opérateurs logiques, l’algèbre de Boole, la simplification des expressions logiques, les réseaux de données et les composants électriques n’ont aucune entrée : tout ce que l’élève manipule en travaux pratiques.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: 'e21baaf4-ca31-5110-8d2b-e4dd335cbafa',
    },
    decision:
      'SONDE PAR ID (fiche « Le SysML » de 1re, dérivé de `si|1re|Le SysML`). LE DÉCOUPAGE EST CELUI DE LA MAQUETTE — 6 chapitres suivant la chaîne du système (le besoin, les actions mécaniques, l’énergie, le mouvement, l’information, le circuit qui la porte). Le programme officiel s’organise, lui, autour de quatre COMPÉTENCES (analyser, modéliser, expérimenter, concevoir) : on ne range pas des fiches sous des verbes. ⚠️ DEUX MODULES PORTENT LE SLUG `si` (219 via `si.mjs`, 272 via `si-1re.mjs`) — mais la 219 est générée par `--modules snt,hlp,llcer-anglais,si,maths-complementaires`, donc par FICHIER : l’ajout ne la touche pas (vérifié identique à l’octet près). ⚠️ LA 219 EST REJOUABLE : la recoller ferait revenir les 3 fiches composites en doublon. LE MÉNAGE VISE `theme IS NULL` AU NIVEAU 1re. La Terminale garde les fiches de la 219, faute de programme écrit pour elle.',
  },
  {
    id: '273',
    fichier: '273_contenu_nsi_1re.sql',
    feature:
      'NSI 1re (spécialité) : les 19 fiches du programme rangées sous leurs 6 chapitres (au cœur de l’ordinateur · l’ordinateur de bureau · réseaux · interagir sur le web · génie logiciel · algorithmique et programmation) — 152 questions —, et les 4 fiches composites retirées du niveau 1re',
    siAbsente:
      'La spécialité NSI de Première n’a que 4 fiches composites — « Types de données et représentation », « Python : bases de la programmation », « Tableaux et dictionnaires », « Le web : HTML, CSS, HTTP ». L’architecture machine, les systèmes d’exploitation, les protocoles réseau, le bit alterné, la complexité, les algorithmes gloutons et l’apprentissage n’ont aucune entrée : la moitié des thèmes du programme, et ceux qui fondent la Terminale.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '53b26f6c-f960-5e34-adc7-f3714b4fff47',
    },
    decision:
      'SONDE PAR ID (fiche « Une machine à calculer : le bit » de 1re). ⚠️ RÈGLE APPRISE SUR LA 254, APPLIQUÉE ICI : jamais d’extrait SQL exécutable dans un cours de NSI — le contenu voyage dans des littéraux SQL échappés, et une rupture de littéral ferait repartir le texte à l’exécution, produisant une erreur qui parle d’une table fantôme. Aucune ligne du module ne commence par un mot-clé SQL nu ; le lexeur `_ASSOCIE/verifie-chaines.mjs` le confirme. ⚠️ UN PIÈGE D’ÉCRITURE RENCONTRÉ ET CORRIGÉ : un backquote dans un cours (« renommer une image en .txt ») rompait le littéral de gabarit JavaScript du module — les extensions et le code s’écrivent désormais entre guillemets français. LE DÉCOUPAGE EST CELUI DE LA MAQUETTE (6 chapitres). LE MÉNAGE VISE `theme IS NULL` AU NIVEAU 1re. La Terminale a reçu son programme avec la 254.',
  },
  {
    id: '274',
    fichier: '274_contenu_hlp_1re.sql',
    feature:
      'HLP 1re : les 19 fiches du programme rangées sous leurs 6 chapitres (l’art de la parole · l’autorité de la parole · les séductions de la parole · découverte du monde · décrire, figurer, imaginer · l’homme et l’animal) — 152 questions —, et les 3 fiches héritées retirées du niveau 1re',
    siAbsente:
      'La spécialité HLP de Première n’a que 3 fiches — « Les pouvoirs de la parole », « Les représentations du monde », « Lire, analyser, écrire ». Les deux premières résument chacune un SEMESTRE entier en une fiche ; la troisième est une fiche de méthode. La rhétorique, le mythe, le discours amoureux, la découverte de l’autre, la perspective, l’encyclopédie et la question animale n’ont aucune entrée propre.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: 'dc33abee-1469-56af-9ba1-7ce5a63ab276',
    },
    decision:
      'SONDE PAR ID (fiche « Qu’est-ce que la rhétorique ? » de 1re) : le titre porte deux apostrophes typographiques, une sonde par titre dépendrait de leur forme exacte en base. ⚠️ TROISIÈME MODULE DU SLUG `hlp` (219 via `hlp.mjs`, 232 via `hlp-tle.mjs`, 274 via `hlp-1re.mjs`) — la 219 étant générée par `--modules snt,hlp,llcer-anglais,si,maths-complementaires`, donc par FICHIER, l’ajout ne la touche pas (vérifié identique à l’octet près, comme la 232). ⚠️ LA FICHE DE MÉTHODE « Lire, analyser, écrire » PART AUSSI : ce n’est pas un chapitre du programme mais un mode d’emploi de l’épreuve, et un dossier de matière ne montre que son programme. Arbitrage différent de la 257, qui avait laissé « Méthode de l’épreuve » HORS chapitre en Terminale parce qu’une annale la visait ; aucune annale ne vise celle de 1re. ⚠️ LA 219 EST REJOUABLE : la recoller ferait revenir les 3 fiches en doublon.',
  },
  {
    id: '275',
    fichier: '275_contenu_hggsp_1re.sql',
    feature:
      'HGGSP 1re : les 25 fiches du programme rangées sous ses 5 thèmes (la démocratie · les puissances internationales · les frontières · s’informer · États et religions) — 200 questions —, et les 4 fiches composites retirées du niveau 1re',
    siAbsente:
      'La spécialité HGGSP de Première n’a que 4 fiches composites, chacune résumant un thème entier du BO, et le thème 2 (les puissances internationales) n’a AUCUNE entrée. Surtout, les JALONS du programme — Athènes, Tocqueville, le Chili de 1973, le Portugal et l’Espagne de 1974-1982, l’Empire ottoman, l’affaire Dreyfus, la sécularisation turque — n’existent nulle part, alors que l’épreuve porte précisément sur eux.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: 'aebabe0c-6a7d-5b05-93fa-a0661d8e1ab8',
    },
    decision:
      'SONDE PAR ID (fiche « Une démocratie directe mais limitée : être citoyen à Athènes au Ve siècle » de 1re) : le titre porte deux-points et apostrophe, une sonde par titre dépendrait de leur forme exacte. LE DÉCOUPAGE EST CELUI DU BO — 5 thèmes, qui sont aussi les 5 chapitres de la maquette : contrairement aux SES (268) et à la physique-chimie (270), aucun arbitrage n’était nécessaire, les intitulés officiels étant ceux du cahier et chaque thème comptant de 3 à 7 fiches. LES FICHES SUIVENT LES JALONS DU PROGRAMME, un par fiche, ce qui est exactement la maille de l’épreuve. LE MÉNAGE VISE `theme IS NULL` AU NIVEAU 1re, jamais les titres composites (deux-points et apostrophes, piège de la 249). ⚠️ DEUX MODULES PORTENT LE SLUG `hggsp` (256 Tle, 275 1re) : toujours `--modules hggsp-1re`. La Terminale ne bouge pas.',
  },
  {
    id: '276',
    fichier: '276_contenu_allemand_1re.sql',
    feature:
      'Allemand 1re : les 36 fiches du programme de langue rangées sous leurs 5 chapitres (la phrase · le groupe nominal · les groupes prépositionnels · le groupe verbal · les temps) — 288 questions —, et les 3 fiches héritées retirées du niveau 1re',
    siAbsente:
      'L’allemand de Première n’a que les 3 fiches du bloc lycée de la 218 — « Raconter au passé », « Le datif et les prépositions », « L’Allemagne d’aujourd’hui » —, les mêmes qu’en 2de et qu’en Terminale avant la 249. La déclinaison de l’adjectif épithète, la place du verbe dans la subordonnée, nicht/kein, le passif, le génitif, les verbes à préverbe séparable et le subjonctif II n’ont aucune entrée.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '72b1d366-a38c-5b17-b988-95c1126e18a3',
    },
    decision:
      'SONDE PAR ID (fiche « Le subjonctif II présent » de 1re). LE CONTENU EST IMPORTÉ DE LA TERMINALE, comme l’anglais (266) et l’espagnol (267) : les programmes de LV sont écrits pour le CYCLE TERMINAL, la grammaire y est la même, et `allemand-1re.mjs` republie les 36 fiches de la 249 sur le niveau 1re sans les recopier — une correction de règle faite une fois vaut pour les deux niveaux. Aucune table d’axes à recopier ici, contrairement à l’anglais et à l’espagnol : `allemand-tle.mjs` porte déjà son chapitre sur chaque fiche. LE MÉNAGE VISE `theme IS NULL` AU NIVEAU 1re et non les titres : « L’Allemagne d’aujourd’hui » porte deux apostrophes typographiques (piège relevé dans la 249), un DELETE par titre pourrait ne rien trouver EN SILENCE. La fiche de civilisation part avec les deux autres — décision de la 249 et de la 244. ⚠️ TROISIÈME MODULE DU SLUG `allemand` (218, 249, 276) : toujours `--modules allemand-1re`. La 2de garde ses 3 fiches. ⚠️ LA 218 EST REJOUABLE : la recoller ferait revenir les 3 fiches au niveau 1re.',
  },
  {
    id: '277',
    fichier: '277_contenu_emc_1re.sql',
    feature:
      'EMC 1re : les 12 fiches du programme « Cohésion et diversité dans une société démocratique » rangées sous ses 2 thèmes (les valeurs et les principes de la République à l’épreuve de la cohésion sociale · la République et la Nation) — 96 questions —, et les 3 fiches du socle lycée retirées du niveau 1re',
    siAbsente:
      'L’EMC de Première n’a que les 3 fiches du socle lycée de la 216 — « La liberté d’expression et ses limites », « Démocratie et État de droit », « Enjeux du numérique et de l’information » —, écrites pour la 2de, la 1re et la Tle à la fois. Deux d’entre elles relèvent, dans le programme de 2024, de la SECONDE. La fraternité, la loi de 1905, la loi Pleven, la décentralisation, le droit du sol et la sécurité nationale n’ont aucune entrée.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '367f457f-4a36-501c-9939-6cda87bc1606',
    },
    decision:
      'SONDE PAR ID (fiche « Laïcité et pluralisme » de 1re). LE TEXTE QUI FAIT FOI EST LE PROGRAMME D’EMC DU BO N° 24 DU 13 JUIN 2024, applicable à TOUS les niveaux à la rentrée 2026-2027 — celle des élèves d’aujourd’hui : la Première y a pour thématique « Cohésion et diversité dans une société démocratique » et pour chapitres ses deux thèmes de 9 heures. LE DÉCOUPAGE 7 + 5 N’AJOUTE RIEN AU PROGRAMME : il sépare en deux fiches révisables ce que le BO écrit en deux contenus d’enseignement sous une même notion (les inégalités sous « solidarité et fraternité », le handicap sous « discriminations et société inclusive »). LES 3 FICHES DU SOCLE PARTENT AU SEUL NIVEAU 1re, décision prise en 250 pour la Terminale ; la 2de les garde, rien ne viendrait les remplacer. LE MÉNAGE VISE `theme IS NULL` (deux des trois titres portent une apostrophe typographique). ⚠️ TROISIÈME MODULE DU SLUG `emc` (216, 230, 277) : toujours `--modules emc-1re`. ⚠️ LA 216 EST REJOUABLE : la recoller ferait revenir les 3 fiches au niveau 1re. ⚠️ CONSÉQUENCE À TRAITER : la Terminale (230 + 250) suit encore le programme de 2019 — le BO de 2024 y installe « La vie démocratique : débat, délibération et prise de décision ».',
  },
  {
    id: '278',
    fichier: '278_matieres_hors_dossier_1re.sql',
    feature:
      'Les dossiers de 1re GÉNÉRALE ne montrent plus que les matières dont l’app tient le programme : EPS, arts plastiques, musique, latin, grec et LLCER anglais quittent ce niveau (les fiches inatteignables du latin, du grec et de LLCER partent avec)',
    siAbsente:
      'La 1re générale affiche six dossiers dont le contenu n’est que 3 fiches passe-partout, identiques de la 6e à la Terminale — le contraire de la règle « un dossier de matière ne montre que son programme ».',
    sonde: null,
    decision:
      '⚠️ EXÉCUTER LA 241 D’ABORD : elle réécrit ENTIÈREMENT le tableau `levels` de l’EPS, des arts plastiques et de la musique ; passée après la 278, elle ramènerait les trois matières en 1re en silence. La 278 refuse de tourner tant que la 241 n’est pas là (garde sur `CP` dans les niveaux de l’histoire-géo). NON SONDABLE À LA CLÉ ANON : cette migration RETIRE des niveaux, aucune sonde d’existence ne le dit — vérifier à la main que `subjects.levels` de `sport` ne contient plus `1re` (mais bien `1re techno`). ⚠️ DEUX FAITS ASSUMÉS, ÉCRITS DANS L’EN-TÊTE DU FICHIER : l’EPS est OBLIGATOIRE en 1re (2 h/sem) et LLCER anglais est une SPÉCIALITÉ de 1re (4 h) — leur retrait est une décision de PRODUIT (on ne révise pas l’EPS, l’app ne tient aucun de ces deux programmes), pas une correction de programme. La 1re TECHNO garde l’EPS, les arts et la musique : sans elles, sa grille — faite du seul tronc commun — tomberait sous les dix matières exigées par `lib/subject-catalogue.test.ts`. Les deux gardes de ce test portent l’exception, commentée. RETOUR EN ARRIÈRE : remettre `1re` dans `levels`, et rejouer 219/220 pour les fiches du latin, du grec et de LLCER.',
  },
  // ---------------------------------------------------------------------------
  // LES 34 SEEDS DE PROGRAMME DU COLLÈGE ET DE LA SECONDE (279 → 312).
  //
  // Ajoutés au catalogue le 26/08/2026, et il était temps : ils en étaient
  // absents depuis leur écriture, donc NI la sonde CLI NI /admin/sante ne les
  // regardaient. Le jour où on les y a mis, sept se sont révélées ÉTEINTES —
  // toute la Cinquième (307 → 312) et la SES de Seconde (280). Un élève de 5e
  // ouvrait donc maths sur 5 chapitres au lieu de 26, anglais sur 5 au lieu de
  // 41, SVT sur 5 au lieu de 31, et personne ne pouvait le savoir : c'est
  // exactement le trou silencieux que ce module existe pour fermer.
  //
  // TOUTES SONDÉES PAR UUID, jamais par titre. « Les questions » (espagnol),
  // « Les noms » (anglais) et « Mélanges et corps purs » (physique-chimie)
  // existent à l'identique sur trois niveaux : un titre ne distingue pas la 5e
  // de la 4e. Les UUID de ces fichiers sont dérivés du CONTENU (SHA-1) — donc
  // stables au rejeu, et propres à une seule migration.
  //
  // Elles sont toutes GÉNÉRÉES par scripts/seed-contenu.mjs, idempotentes
  // (UUID stables + ON CONFLICT DO NOTHING) et autoportantes : chacune pose
  // elle-même en ADD COLUMN IF NOT EXISTS les colonnes dont elle dépend
  // (`chapters.theme` de la 234, `chapters.discipline` de la 247). Aucune ne
  // demande de décision, aucune n'a d'ordre imposé entre elles.
  // ---------------------------------------------------------------------------
  {
    id: '279',
    fichier: '279_contenu_histoire_geo_2de.sql',
    feature:
      'Histoire-géo 2de : les 40 fiches du programme (320 questions) sous 13 chapitres, dans ses deux onglets (Histoire / Géographie)',
    siAbsente:
      'Le dossier Histoire-géo de 2de reste sur les quelques chapitres génériques hérités du premier jeu de données : les 40 fiches du programme (320 questions) manquent, à commencer par « Les grandes périodes de l’histoire ». Les thèmes officiels (Des mobilités humaines généralisées · La Méditerranée antique : les empreintes grecques et romaines…) n’apparaissent nulle part. Le dossier reste aussi sur UN seul rayon : c’est `chapters.discipline` qui le dédouble en Histoire et en Géographie, et sans ces lignes il n’y a rien à dédoubler.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '26155276-3b14-553d-97de-85e5d4e5a28a',
    },
  },
  {
    id: '280',
    fichier: '280_contenu_ses_2de.sql',
    feature:
      'SES 2de : les 23 fiches du programme officiel sous 6 chapitres (184 questions)',
    siAbsente:
      'Le dossier SES de 2de reste sur les quelques chapitres génériques hérités du premier jeu de données : les 23 fiches du programme (184 questions) manquent, à commencer par « Les principes de base de l’économie ». Les thèmes officiels (Comment crée-t-on des richesses et comment les mesure-t-on ? · Comment devenons-nous des acteurs sociaux ?…) n’apparaissent nulle part.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '94c8df39-d7f9-5d49-a14f-2309759f8404',
    },
  },
  {
    id: '281',
    fichier: '281_contenu_snt_2de.sql',
    feature:
      'SNT 2de : les 23 fiches du programme officiel sous 7 chapitres (184 questions)',
    siAbsente:
      'Le dossier SNT de 2de reste sur les quelques chapitres génériques hérités du premier jeu de données : les 23 fiches du programme (184 questions) manquent, à commencer par « Internet : le réseau des réseaux ». Les thèmes officiels (Cartographier · Commander…) n’apparaissent nulle part.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '8c9d248b-fa2d-5956-885f-076c440901c9',
    },
  },
  {
    id: '282',
    fichier: '282_contenu_maths_2de.sql',
    feature:
      'Maths 2de : les 20 fiches du programme officiel sous 4 chapitres (160 questions)',
    siAbsente:
      'Le dossier Maths de 2de reste sur les quelques chapitres génériques hérités du premier jeu de données : les 20 fiches du programme (160 questions) manquent, à commencer par « Ensemble des nombres réels et intervalles ». Les thèmes officiels (Fonctions · Géométrie…) n’apparaissent nulle part.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: 'fab3ca92-b4d6-53e0-b06b-eb3174505645',
    },
  },
  {
    id: '283',
    fichier: '283_contenu_francais_2de.sql',
    feature:
      'Français 2de : les 24 fiches du programme officiel sous 4 chapitres (192 questions)',
    siAbsente:
      'Le dossier Français de 2de reste sur les quelques chapitres génériques hérités du premier jeu de données : les 24 fiches du programme (192 questions) manquent, à commencer par « Repères : de la poésie médiévale aux Lumières ». Les thèmes officiels (La littérature d’idées et la presse du XIXe siècle au XXIe siècle · La poésie du Moyen Âge au XVIIIe siècle…) n’apparaissent nulle part.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '84370f35-aba7-51fd-91e9-cf10e3556e73',
    },
  },
  {
    id: '284',
    fichier: '284_contenu_emc_2de.sql',
    feature:
      'EMC 2de : les 10 fiches du programme officiel sous 3 chapitres (80 questions)',
    siAbsente:
      'Le dossier EMC de 2de reste sur les quelques chapitres génériques hérités du premier jeu de données : les 10 fiches du programme (80 questions) manquent, à commencer par « Qu’est-ce que l’État de droit ? ». Les thèmes officiels (Droit et responsabilité : la protection de l’environnement et la sauvegarde de la biodiversité · Libertés et responsabilité : l’information…) n’apparaissent nulle part.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: 'c3ba5e5b-b29c-50b5-b5cb-9e66d44134ba',
    },
  },
  {
    id: '285',
    fichier: '285_contenu_svt_2de.sql',
    feature:
      'SVT 2de : les 19 fiches du programme officiel sous 6 chapitres (152 questions)',
    siAbsente:
      'Le dossier SVT de 2de reste sur les quelques chapitres génériques hérités du premier jeu de données : les 19 fiches du programme (152 questions) manquent, à commencer par « Les êtres vivants pluricellulaires et la spécialisation des cellules ». Les thèmes officiels (Biodiversité, résultat et étape de l’évolution · Géosciences et compréhension des paysages…) n’apparaissent nulle part.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: 'e505ae5b-c90a-53a9-91b9-e31835363b55',
    },
  },
  {
    id: '286',
    fichier: '286_contenu_anglais_2de.sql',
    feature:
      'Anglais 2de : les 24 fiches du programme de LANGUE (grammaire, conjugaison, lexique) sous 4 chapitres, 192 questions',
    siAbsente:
      'Le dossier Anglais de 2de reste sur les quelques chapitres génériques hérités du premier jeu de données : les 24 fiches du programme (192 questions) manquent, à commencer par « Les déterminants ». Les thèmes officiels (La phrase · Le groupe nominal…) n’apparaissent nulle part. Le dossier garde ses quelques fiches de culture et de civilisation, sans grammaire : un élève qui cherche un point de langue précis avant un contrôle n’a rien à ouvrir.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '16e9c918-98a3-5e99-a22f-d8e693511c64',
    },
  },
  {
    id: '287',
    fichier: '287_contenu_espagnol_2de.sql',
    feature:
      'Espagnol 2de : les 34 fiches du programme de LANGUE (grammaire, conjugaison, lexique) sous 4 chapitres, 272 questions',
    siAbsente:
      'Le dossier Espagnol de 2de reste sur les quelques chapitres génériques hérités du premier jeu de données : les 34 fiches du programme (272 questions) manquent, à commencer par « Les questions ». Les thèmes officiels (La phrase · Le groupe nominal…) n’apparaissent nulle part. Le dossier garde ses quelques fiches de culture et de civilisation, sans grammaire : un élève qui cherche un point de langue précis avant un contrôle n’a rien à ouvrir.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '00c82ee7-60a1-546f-a17c-161399cf400b',
    },
  },
  {
    id: '288',
    fichier: '288_contenu_allemand_2de.sql',
    feature:
      'Allemand 2de : les 36 fiches du programme de LANGUE (grammaire, conjugaison, lexique) sous 5 chapitres, 288 questions',
    siAbsente:
      'Le dossier Allemand de 2de reste sur les quelques chapitres génériques hérités du premier jeu de données : les 36 fiches du programme (288 questions) manquent, à commencer par « La ponctuation ». Les thèmes officiels (La phrase · Le groupe nominal…) n’apparaissent nulle part. Le dossier garde ses quelques fiches de culture et de civilisation, sans grammaire : un élève qui cherche un point de langue précis avant un contrôle n’a rien à ouvrir.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '890d4c78-95a3-54aa-a1ea-179146d5a587',
    },
  },
  {
    id: '289',
    fichier: '289_contenu_physique_chimie_2de.sql',
    feature:
      'Physique-chimie 2de : les 23 fiches du programme officiel sous 4 chapitres (184 questions)',
    siAbsente:
      'Le dossier Physique-chimie de 2de reste sur les quelques chapitres génériques hérités du premier jeu de données : les 23 fiches du programme (184 questions) manquent, à commencer par « Corps purs et mélanges ». Les thèmes officiels (Constitution et transformation de la matière · Mouvements et interactions…) n’apparaissent nulle part.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '0f4c7b7f-4cd7-5f83-a328-7ed3dfa8af40',
    },
  },
  {
    id: '290',
    fichier: '290_contenu_francais_3e.sql',
    feature:
      'Français 3e : les 18 fiches du programme officiel sous 6 chapitres (144 questions)',
    siAbsente:
      'Le dossier Français de 3e reste sur les quelques chapitres génériques hérités du premier jeu de données : les 18 fiches du programme (144 questions) manquent, à commencer par « L’autoportrait ». Les thèmes officiels (Agir sur le monde — Agir dans la cité : individu et pouvoir · Outils d’analyse littéraire…) n’apparaissent nulle part.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '258f7c2b-56fe-5aae-8e30-33ac35f44de1',
    },
  },
  {
    id: '291',
    fichier: '291_contenu_histoire_3e.sql',
    feature:
      'Histoire-géo 3e : les 14 fiches du programme (112 questions) sous 3 chapitres, dans l\'onglet Histoire',
    siAbsente:
      'Le dossier Histoire-géo de 3e reste sur les quelques chapitres génériques hérités du premier jeu de données : les 14 fiches du programme (112 questions) manquent, à commencer par « La Première Guerre mondiale : vers une guerre totale ». Les thèmes officiels (Françaises et Français dans une République repensée · Le monde depuis 1945…) n’apparaissent nulle part.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '6583dbde-d239-5bcb-a891-6ab8836842bd',
    },
  },
  {
    id: '292',
    fichier: '292_contenu_svt_3e.sql',
    feature:
      'SVT 3e : les 31 fiches du programme officiel sous 14 chapitres (248 questions)',
    siAbsente:
      'Le dossier SVT de 3e reste sur les quelques chapitres génériques hérités du premier jeu de données : les 31 fiches du programme (248 questions) manquent, à commencer par « La Terre et le système solaire ». Les thèmes officiels (Alimentation et digestion · Diversité et stabilité génétique des êtres vivants…) n’apparaissent nulle part.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '704037d9-6f2a-5ac4-8824-00e4cff12d6e',
    },
  },
  {
    id: '293',
    fichier: '293_contenu_geographie_3e.sql',
    feature:
      'Histoire-géo 3e : les 12 fiches du programme (96 questions) sous 3 chapitres, dans l\'onglet Géographie',
    siAbsente:
      'Le dossier Histoire-géo de 3e reste sur les quelques chapitres génériques hérités du premier jeu de données : les 12 fiches du programme (96 questions) manquent, à commencer par « Les aires urbaines en France ». Les thèmes officiels (Dynamiques territoriales de la France contemporaine · La France et l’Union européenne…) n’apparaissent nulle part.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '2a360b9e-58d4-5d2c-99aa-1ed25cbbb4c8',
    },
  },
  {
    id: '294',
    fichier: '294_contenu_maths_3e.sql',
    feature:
      'Maths 3e : les 14 fiches du programme officiel sous 3 chapitres (112 questions)',
    siAbsente:
      'Le dossier Maths de 3e reste sur les quelques chapitres génériques hérités du premier jeu de données : les 14 fiches du programme (112 questions) manquent, à commencer par « Puissances d’un nombre et écriture scientifique ». Les thèmes officiels (Espace et géométrie · Nombres et calculs…) n’apparaissent nulle part.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '0f21911f-5b9f-5109-8ad8-c82a8479ea99',
    },
  },
  {
    id: '295',
    fichier: '295_contenu_physique_chimie_3e.sql',
    feature:
      'Physique-chimie 3e : les 31 fiches du programme officiel sous 7 chapitres (248 questions)',
    siAbsente:
      'Le dossier Physique-chimie de 3e reste sur les quelques chapitres génériques hérités du premier jeu de données : les 31 fiches du programme (248 questions) manquent, à commencer par « Mélanges et corps purs ». Les thèmes officiels (Les circuits électriques · Les signaux…) n’apparaissent nulle part.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '3aacaf01-3572-52e7-9ce8-44f95f590b6e',
    },
  },
  {
    id: '296',
    fichier: '296_contenu_technologie_3e.sql',
    feature:
      'Technologie 3e : les 23 fiches du programme officiel sous 8 chapitres (184 questions)',
    siAbsente:
      'Le dossier Technologie de 3e reste sur les quelques chapitres génériques hérités du premier jeu de données : les 23 fiches du programme (184 questions) manquent, à commencer par « Les OST ». Les thèmes officiels (Fabrication/réalisation d’un objet technique · Gérer un projet technique…) n’apparaissent nulle part.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '7b9cf9f2-dd75-52e8-b501-e03af97cdc28',
    },
  },
  {
    id: '297',
    fichier: '297_contenu_espagnol_3e.sql',
    feature:
      'Espagnol 3e : les 34 fiches du programme de LANGUE (grammaire, conjugaison, lexique) sous 4 chapitres, 272 questions',
    siAbsente:
      'Le dossier Espagnol de 3e reste sur les quelques chapitres génériques hérités du premier jeu de données : les 34 fiches du programme (272 questions) manquent, à commencer par « Les questions ». Les thèmes officiels (La phrase · Le groupe nominal…) n’apparaissent nulle part. Le dossier garde ses quelques fiches de culture et de civilisation, sans grammaire : un élève qui cherche un point de langue précis avant un contrôle n’a rien à ouvrir.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '17ff294f-2c5c-50d8-acf6-59ab06a050ab',
    },
  },
  {
    id: '298',
    fichier: '298_contenu_anglais_3e.sql',
    feature:
      'Anglais 3e : les 41 fiches du programme de LANGUE (grammaire, conjugaison, lexique) sous 4 chapitres, 328 questions',
    siAbsente:
      'Le dossier Anglais de 3e reste sur les quelques chapitres génériques hérités du premier jeu de données : les 41 fiches du programme (328 questions) manquent, à commencer par « Les noms ». Les thèmes officiels (La phrase · Le groupe nominal…) n’apparaissent nulle part. Le dossier garde ses quelques fiches de culture et de civilisation, sans grammaire : un élève qui cherche un point de langue précis avant un contrôle n’a rien à ouvrir.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: 'a87e8d79-456a-56fe-9c4c-29ce2316a257',
    },
  },
  {
    id: '299',
    fichier: '299_contenu_allemand_3e.sql',
    feature:
      'Allemand 3e : les 36 fiches du programme de LANGUE (grammaire, conjugaison, lexique) sous 5 chapitres, 288 questions',
    siAbsente:
      'Le dossier Allemand de 3e reste sur les quelques chapitres génériques hérités du premier jeu de données : les 36 fiches du programme (288 questions) manquent, à commencer par « La ponctuation ». Les thèmes officiels (La phrase · Le groupe nominal…) n’apparaissent nulle part. Le dossier garde ses quelques fiches de culture et de civilisation, sans grammaire : un élève qui cherche un point de langue précis avant un contrôle n’a rien à ouvrir.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: 'd4002fe0-91d7-56ae-b36b-981cef0e2b98',
    },
  },
  {
    id: '300',
    fichier: '300_contenu_francais_4e.sql',
    feature:
      'Français 4e : les 18 fiches du programme officiel sous 5 chapitres (144 questions)',
    siAbsente:
      'Le dossier Français de 4e reste sur les quelques chapitres génériques hérités du premier jeu de données : les 18 fiches du programme (144 questions) manquent, à commencer par « La poésie lyrique et amoureuse de l’Antiquité à nos jours ». Les thèmes officiels (Agir sur le monde — Informer, s’informer, déformer ? · Questionnements complémentaires — La ville, lieu de tous les possibles ?…) n’apparaissent nulle part.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: 'a5ca98d8-8b8f-5cfa-b1e9-d855937fa78f',
    },
  },
  {
    id: '301',
    fichier: '301_contenu_maths_4e.sql',
    feature:
      'Maths 4e : les 36 fiches du programme officiel sous 5 chapitres (288 questions)',
    siAbsente:
      'Le dossier Maths de 4e reste sur les quelques chapitres génériques hérités du premier jeu de données : les 36 fiches du programme (288 questions) manquent, à commencer par « Multiplier et diviser des nombres relatifs ». Les thèmes officiels (Cours de l’ancien programme · Espace et géométrie…) n’apparaissent nulle part.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: 'bbc8df26-d175-58d1-affb-8efd8a429819',
    },
  },
  {
    id: '302',
    fichier: '302_contenu_physique_chimie_4e.sql',
    feature:
      'Physique-chimie 4e : les 31 fiches du programme officiel sous 7 chapitres (248 questions)',
    siAbsente:
      'Le dossier Physique-chimie de 4e reste sur les quelques chapitres génériques hérités du premier jeu de données : les 31 fiches du programme (248 questions) manquent, à commencer par « Mélanges et corps purs ». Les thèmes officiels (Les circuits électriques · Les signaux…) n’apparaissent nulle part.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: 'e7ee89b1-0355-514c-b695-7f9784c42cc1',
    },
  },
  {
    id: '303',
    fichier: '303_contenu_svt_4e.sql',
    feature:
      'SVT 4e : les 31 fiches du programme officiel sous 14 chapitres (248 questions)',
    siAbsente:
      'Le dossier SVT de 4e reste sur les quelques chapitres génériques hérités du premier jeu de données : les 31 fiches du programme (248 questions) manquent, à commencer par « La Terre et le système solaire ». Les thèmes officiels (Alimentation et digestion · Diversité et stabilité génétique des êtres vivants…) n’apparaissent nulle part.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '609ba61d-3349-5905-9f12-36f64a2ab0fa',
    },
  },
  {
    id: '304',
    fichier: '304_contenu_anglais_4e.sql',
    feature:
      'Anglais 4e : les 41 fiches du programme de LANGUE (grammaire, conjugaison, lexique) sous 4 chapitres, 328 questions',
    siAbsente:
      'Le dossier Anglais de 4e reste sur les quelques chapitres génériques hérités du premier jeu de données : les 41 fiches du programme (328 questions) manquent, à commencer par « Les noms ». Les thèmes officiels (La phrase · Le groupe nominal…) n’apparaissent nulle part. Le dossier garde ses quelques fiches de culture et de civilisation, sans grammaire : un élève qui cherche un point de langue précis avant un contrôle n’a rien à ouvrir.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '63a4aa8d-ba12-548f-b8be-114e11d012de',
    },
  },
  {
    id: '305',
    fichier: '305_contenu_espagnol_4e.sql',
    feature:
      'Espagnol 4e : les 34 fiches du programme de LANGUE (grammaire, conjugaison, lexique) sous 4 chapitres, 272 questions',
    siAbsente:
      'Le dossier Espagnol de 4e reste sur les quelques chapitres génériques hérités du premier jeu de données : les 34 fiches du programme (272 questions) manquent, à commencer par « Les questions ». Les thèmes officiels (La phrase · Le groupe nominal…) n’apparaissent nulle part. Le dossier garde ses quelques fiches de culture et de civilisation, sans grammaire : un élève qui cherche un point de langue précis avant un contrôle n’a rien à ouvrir.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '8dc9c965-f57b-5d15-9ba5-2b48bb578de9',
    },
  },
  {
    id: '306',
    fichier: '306_contenu_histoire_geo_5e.sql',
    feature:
      'Histoire-géo 5e : les 21 fiches du programme (168 questions) sous 6 chapitres, dans ses deux onglets (Histoire / Géographie)',
    siAbsente:
      'Le dossier Histoire-géo de 5e reste sur les quelques chapitres génériques hérités du premier jeu de données : les 21 fiches du programme (168 questions) manquent, à commencer par « Empire et civilisation arabo-musulmans ». Les thèmes officiels (Chrétientés et islam (VIe-XIIIe siècles), des mondes en contact · Des ressources limitées, à gérer et à renouveler…) n’apparaissent nulle part. Le dossier reste aussi sur UN seul rayon : c’est `chapters.discipline` qui le dédouble en Histoire et en Géographie, et sans ces lignes il n’y a rien à dédoubler.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: 'a84a4b01-c102-5366-ad58-5feb28ac9c50',
    },
  },
  {
    id: '307',
    fichier: '307_contenu_francais_5e.sql',
    feature:
      'Français 5e : les 13 fiches du programme officiel sous 5 chapitres (104 questions)',
    siAbsente:
      'Le dossier Français de 5e reste sur les quelques chapitres génériques hérités du premier jeu de données : les 13 fiches du programme (104 questions) manquent, à commencer par « Les grandes découvertes ». Les thèmes officiels (Agir sur le monde — Héros / héroïnes et héroïsme · Questionnements complémentaires — L’être humain est-il maître de la nature ?…) n’apparaissent nulle part.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '8f784bec-0277-5d05-b70e-7d47fb81e7bc',
    },
  },
  {
    id: '308',
    fichier: '308_contenu_maths_5e.sql',
    feature:
      'Maths 5e : les 26 fiches du programme officiel sous 4 chapitres (208 questions)',
    siAbsente:
      'Le dossier Maths de 5e reste sur les quelques chapitres génériques hérités du premier jeu de données : les 26 fiches du programme (208 questions) manquent, à commencer par « Passer d’une écriture décimale à une écriture fractionnaire ». Les thèmes officiels (Cours de l’ancien programme · Espace et géométrie…) n’apparaissent nulle part.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '5e261956-9f14-5c71-af61-e6c3c4bf7470',
    },
  },
  {
    id: '309',
    fichier: '309_contenu_physique_chimie_5e.sql',
    feature:
      'Physique-chimie 5e : les 31 fiches du programme officiel sous 7 chapitres (248 questions)',
    siAbsente:
      'Le dossier Physique-chimie de 5e reste sur les quelques chapitres génériques hérités du premier jeu de données : les 31 fiches du programme (248 questions) manquent, à commencer par « Mélanges et corps purs ». Les thèmes officiels (Les circuits électriques · Les signaux…) n’apparaissent nulle part.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '8bfc7fdd-cb95-55ad-9c0a-a1734702ab1d',
    },
  },
  {
    id: '310',
    fichier: '310_contenu_svt_5e.sql',
    feature:
      'SVT 5e : les 31 fiches du programme officiel sous 14 chapitres (248 questions)',
    siAbsente:
      'Le dossier SVT de 5e reste sur les quelques chapitres génériques hérités du premier jeu de données : les 31 fiches du programme (248 questions) manquent, à commencer par « La Terre et le système solaire ». Les thèmes officiels (Alimentation et digestion · Diversité et stabilité génétique des êtres vivants…) n’apparaissent nulle part.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '0cee6f77-031d-5b08-90df-57494e474572',
    },
  },
  {
    id: '311',
    fichier: '311_contenu_anglais_5e.sql',
    feature:
      'Anglais 5e : les 41 fiches du programme de LANGUE (grammaire, conjugaison, lexique) sous 4 chapitres, 328 questions',
    siAbsente:
      'Le dossier Anglais de 5e reste sur les quelques chapitres génériques hérités du premier jeu de données : les 41 fiches du programme (328 questions) manquent, à commencer par « Les noms ». Les thèmes officiels (La phrase · Le groupe nominal…) n’apparaissent nulle part. Le dossier garde ses quelques fiches de culture et de civilisation, sans grammaire : un élève qui cherche un point de langue précis avant un contrôle n’a rien à ouvrir.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '95f5a069-6fbd-5984-a10f-853c99fba68a',
    },
  },
  {
    id: '312',
    fichier: '312_contenu_espagnol_5e.sql',
    feature:
      'Espagnol 5e : les 34 fiches du programme de LANGUE (grammaire, conjugaison, lexique) sous 4 chapitres, 272 questions',
    siAbsente:
      'Le dossier Espagnol de 5e reste sur les quelques chapitres génériques hérités du premier jeu de données : les 34 fiches du programme (272 questions) manquent, à commencer par « Les questions ». Les thèmes officiels (La phrase · Le groupe nominal…) n’apparaissent nulle part. Le dossier garde ses quelques fiches de culture et de civilisation, sans grammaire : un élève qui cherche un point de langue précis avant un contrôle n’a rien à ouvrir.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '4b107bff-cc5f-50d3-8c67-6a9e54606d90',
    },
  },
  {
    id: '313',
    fichier: '313_temps_paliers_jeux.sql',
    feature:
      'Temps de bouclage d’un palier de jeu et classement de rapidité (« Top 5 % des joueurs »)',
    siAbsente:
      'La carte d’un jeu affiche le chrono gardé en local mais AUCUN pourcentage : le classement demande la distribution de tous les joueurs, elle n’existe nulle part ailleurs. Le reste de l’échelle de paliers (étoiles, déblocage, records de score) marche sans elle — l’appel est toléré, jamais bloquant.',
    sonde: { type: 'table', table: 'game_palier_times' },
    decision:
      'À exécuter après la 312. Dépend de `game_catalog` (238) : la RPC `record_palier_time` refuse tout jeu absent du catalogue, sans quoi un client fabriquerait des `game_id` inédits pour se classer premier d’un jeu dont il serait le seul joueur.',
  },
  {
    id: '314',
    fichier: '314_cote_ultime.sql',
    feature:
      'Épreuve ultime : cote de maîtrise (absolue, tous âges confondus) et classements mondial + par classe',
    siAbsente:
      'L’épreuve ultime se joue et affiche le niveau atteint, mais AUCUNE cote ni classement : ce sont les seuls chiffres qui demandent la distribution de tous les joueurs. Sans elle, un élève ne peut pas se comparer hors de sa classe — la raison d’être de cette épreuve.',
    sonde: { type: 'table', table: 'game_ultime_cotes' },
    decision:
      'À exécuter après la 313. Dépend de `game_catalog` (238) et de `profiles.grade_level` (classement par classe). La formule de la cote (100 + 60 × moyenne des 3 meilleurs niveaux) est un MIROIR de lib/jeux/ultime.coteFor : toute évolution doit toucher les deux, comme lib/trophy-road.ts ↔ apply_game_trophies.',
  },
  {
    id: '315',
    fichier: '315_carnet_moteur_v2.sql',
    feature:
      'Le moteur de révision v2 de Mon carnet : état par carte (échéance, aisance, rechutes, sangsues), plafonds quotidiens par cours, tolérance orthographique et sessions reprenables',
    siAbsente:
      'Le carnet CONTINUE DE MARCHER — c’est le parti pris du code : sans la table, chaque carte est lue comme neuve, donc due, et l’app se comporte comme avant (tout est à revoir, tout le temps). Mais rien n’est mémorisé d’une session à l’autre : aucune échéance ne tient, les couronnes restent à zéro, les plafonds ne s’appliquent pas et une session interrompue repart du début.',
    sonde: { type: 'table', table: 'carnet_question_states' },
    decision:
      'À exécuter après la 314. Dépend de la 186 (carnet_courses, carnet_questions, carnet_review_sessions). Elle REND `carnet_review_sessions.course_id` FACULTATIF pour que la session transverse (« À revoir », tous cours confondus) puisse enfin ouvrir une ligne — c’est la seule modification destructrice du lot, et elle ne fait qu’assouplir une contrainte. Le code retombe silencieusement sur des états neufs tant qu’elle n’est pas passée (code PostgREST 42P01 ignoré), comme le quota IA face à la 198 : déployer avant d’exécuter ne casse rien.',
  },
  {
    id: '316',
    fichier: '316_carnet_personnalisation.sql',
    feature:
      'Carnet personnalisable : étiquettes transverses, date de contrôle, rattachement à une matière, trois types de question de plus (appariement, remise en ordre, réponse chiffrée) et bucket d’images',
    siAbsente:
      'Le carnet marche, en retrait : la feuille « Comment tu veux réviser ? » ne propose aucune étiquette (la liste est lue en isolation et revient vide), l’onglet Paramètres n’enregistre ni la date du contrôle ni la matière, et les trois nouveaux types sont REFUSÉS PAR LA CONTRAINTE de la 186 — les créer échoue en base. Le dossier d’une matière n’affiche aucun cours du carnet.',
    sonde: { type: 'table', table: 'carnet_tags' },
    decision:
      'À exécuter après la 315. Dépend de la 186 et de la 008 (subjects). Elle REMPLACE la contrainte CHECK de `carnet_questions.type` (recherchée par son texte, pas par son nom : la 186 la laissait anonyme) — c’est la seule opération qui touche à l’existant, et elle ne fait qu’élargir la liste. Le bucket `carnet-medias` est PRIVÉ et rangé par élève : les policies s’appuient sur le premier segment du chemin (`<user_id>/…`), donc tout téléversement doit respecter ce préfixe.',
  },
  {
    id: '317',
    fichier: '317_carnet_dans_le_monde.sql',
    feature:
      'La série (flamme) compte les sessions de Mon carnet',
    siAbsente:
      'Réviser une heure sur son carnet ne compte PAS dans la série : l’élève voit sa flamme s’éteindre le soir même d’une vraie séance de travail. L’XP, elle, est versée sans cette migration (elle passe par `wallet_award_xp`, migration 192).',
    sonde: null,
    decision:
      'À exécuter après la 315 (elle rend `carnet_review_sessions.course_id` facultatif, ce qui permet enfin à la session transverse d’exister — et donc d’être comptée). REDÉFINIT `current_streak` : c’est un MIROIR EXACT de la version de la 170, à une cinquième source près (`carnet_review_sessions.started_at`). Toute évolution de la 170 doit être reportée ici, sinon la dernière exécutée gagne. NON SONDABLE À LA CLÉ ANON : une fonction redéfinie ne se distingue pas de l’ancienne par son existence — vérifier à la main qu’une session de carnet seule dans la journée allume bien la flamme.',
  },
  {
    id: '318',
    fichier: '318_dictees.sql',
    feature:
      'Le mode DICTÉE du français : catalogue de dictées, leurs segments, et les tentatives notées sur 20',
    siAbsente:
      'La carte « Les dictées » de l’onglet Mode de jeu mène à une liste VIDE (« Aucune dictée pour l’instant ») et aucune session n’est jouable. Le reste du dossier de français est intact — la lecture des dictées est isolée.',
    sonde: { type: 'table', table: 'dictees' },
    decision:
      'Indépendante des autres migrations du carnet (315 → 317) : elle ne touche à aucune table existante, elle en crée trois. Elle INSÈRE aussi une première dictée (« L’Homme foudroyé ») avec ses six segments — une liste vide donnerait un onglet mort dont on ne saurait pas si c’est le contenu ou le code qui manque. Rejouable : les segments sont supprimés puis réinsérés, la dictée est protégée par ON CONFLICT sur son slug. PAS DE FICHIERS AUDIO : la synthèse vocale du navigateur lit le texte du segment (`components/francais/dictee/LecteurDictee`) ; la colonne `audio_url` attend un enregistrement humain sans qu’une migration soit nécessaire.',
  },
  {
    id: '319',
    fichier: '319_espace_parents_v2.sql',
    feature:
      'Espace parents v2 : les contrôles à venir, la tendance sur 4 semaines, et les réglages du parent (objectif hebdomadaire, seuil d’alerte)',
    siAbsente:
      'Le volet Suivi se TAIT sur ces trois blocs — pas de contrôles à venir, pas de courbe des 4 semaines, pas de jauge d’objectif — et le volet Réglages affiche « pas encore actifs sur ce compte ». Le reste de la carte (temps, série, score par matière) est intact : le repli est volontaire, un « 0 min cette semaine » faux serait pire qu’un bloc absent.',
    sonde: { type: 'table', table: 'parent_prefs' },
    decision:
      'REDÉFINIT `child_dashboard` : miroir EXACT de la 199 (mêmes CTE, même bornage à la classe courante) augmenté de quatre clés — toute évolution de la 199 doit être reportée ici, sinon la dernière exécutée gagne. Les contrôles passent par cette fonction SECURITY DEFINER et NON par une policy sur `controles` : le lien parent↔enfant est vérifié à un seul endroit. Sûre à exécuter avant ou après le déploiement (le code déployé avant ignore les nouvelles clés, celui d’après tolère leur absence).',
  },
  {
    id: '320',
    fichier: '320_rls_initplan_permanent.sql',
    feature:
      'L’optimisation RLS rendue PERMANENTE : `optimiser_policies_rls()` appelable, rattrapage immédiat des policies nues, et un event trigger qui enveloppe toute policy à sa création',
    siAbsente:
      'Rien ne casse et rien ne se voit — c’est tout le problème. Les policies écrites depuis la 208 gardent `auth.uid()` nu : Postgres réévalue la fonction UNE FOIS PAR LIGNE examinée et renonce à l’index sur `user_id`. Invisible sur une table de mille lignes, mortel sur `test_sessions`, qui prendra ~3 M de lignes par jour à cent mille élèves. Au 26/08/2026 : 100 policies nues contre 13 enveloppées.',
    // NON SONDABLE À LA CLÉ ANON, et volontairement. Cette migration ne crée
    // que des fonctions d'exploitation, dont l'EXECUTE est justement RÉVOQUÉ
    // pour tout le monde — les sonder reviendrait à demander si une porte
    // fermée à clé est bien fermée. La vérification se fait à la main, avec la
    // requête laissée en pied du fichier SQL (elle doit rendre 0 ligne).
    sonde: null,
    decision:
      'À REJOUER APRÈS CHAQUE LOT tant que l’event trigger n’est pas posé : `CREATE EVENT TRIGGER` exige le superutilisateur, que Supabase n’accorde pas toujours au rôle `postgres`. La migration RATTRAPE cet échec et réussit quand même — lis le NOTICE qu’elle affiche. S’il dit « Déclencheur NON posé », ajoute `SELECT public.optimiser_policies_rls();` en dernière ligne de chaque migration qui crée une policy. Le garde-fou côté dépôt (`lib/rls-guard.ts`), lui, marche dans tous les cas.',
  },
  {
    id: '321',
    fichier: '321_mastery_agrege.sql',
    feature:
      'La maîtrise s’agrège en base : `mastery_inputs()` rend un meilleur score par quiz JOUÉ au lieu d’une ligne par session jouée',
    siAbsente:
      'Rien ne se voit — la maîtrise reste juste, et les couronnes avec elle : `lib/mastery-inputs.ts` retombe sur l’ancienne lecture complète. Mais chaque affichage de /defi, /reviser, /moi ou Marcel continue de transférer TOUT l’historique de sessions de l’élève (une ligne par session jouée depuis son inscription) pour n’en tirer qu’un maximum par quiz. Invisible sur un compte neuf, premier poste de charge de la base sur des comptes qui ont deux ans.',
    sonde: { type: 'rpc', fn: 'mastery_inputs', args: {} },
  },
  {
    id: '322',
    fichier: '322_arene_accueil.sql',
    feature:
      'L’arène en UN aller-retour : `arene_accueil()` groupe les vingt lectures de la vague 1 de /defi, et calcule le cycle scolaire en base pour supprimer la seconde vague',
    siAbsente:
      'Rien ne se voit — `lib/arene-vague1.ts` refait les vingt lectures d’avant, et l’arène est identique. Mais /defi, page d’ACCUEIL de l’app, redemande ~20 requêtes Postgres par affichage au lieu d’une : à cent mille élèves et ~180 pages/s au pic, ce sont ~4 500 requêtes/s pour cette seule page.',
    // Deux arguments, et ils sont OBLIGATOIRES pour la sonde : une RPC appelée
    // avec de MAUVAIS arguments répond PGRST202 exactement comme une RPC
    // absente — on la croirait éteinte pour toujours.
    sonde: {
      type: 'rpc',
      fn: 'arene_accueil',
      args: { p_today: '2026-01-01', p_prev_week: '2025-12-25' },
    },
  },
  {
    id: '323',
    fichier: '323_jours_actifs.sql',
    feature:
      'La série se calcule en base : `jours_actifs()` rend l’ensemble des jours travaillés au lieu d’une ligne par session',
    siAbsente:
      'Rien ne se voit — `lib/jours-actifs.ts` refait les quatre lectures d’avant (allégées des colonnes que plus rien ne consommait). Mais /reviser continue de transférer une ligne par SESSION JOUÉE sur 400 jours, sur les quatre tables d’activité, pour n’en tirer qu’un ensemble d’au plus 400 dates. Le rapport empire à chaque session que l’élève joue.',
    sonde: {
      type: 'rpc',
      fn: 'jours_actifs',
      args: { p_since: '2025-01-01T00:00:00Z' },
    },
  },
  {
    id: '324',
    fichier: '324_revoquer_outils_rls.sql',
    feature:
      'CORRECTIF DE SÉCURITÉ : ferme réellement les trois outils de DDL créés par la 320, que `REVOKE … FROM PUBLIC` laissait appelables par un visiteur ANONYME',
    siAbsente:
      '⚠️ `optimiser_une_policy`, `optimiser_policies_rls` et `rls_initplan_auto` répondent HTTP 200 à un appel non authentifié. Pas d’élévation de privilège — elles ne changent que la FORME d’une expression de policy — mais un DÉNI DE SERVICE : chaque appel prend un verrou de niveau ALTER, et le rattrapage en prend un sur les ~130 policies de la base. Appelée en boucle, elle bloque les écritures de toute l’application.',
    // SONDÉE À L'ENVERS (31/08/2026). Elle a longtemps été marquée non
    // sondable, au motif qu'un appel anon rend quelque chose avant comme après
    // (200 puis 42501) et qu'une sonde 'rpc' lit les deux comme « vivante ».
    // C'est vrai de la sonde 'rpc' — pas du fait lui-même : 200 et 42501 disent
    // exactement le contraire l'un de l'autre. D'où 'rpc-ferme', qui les
    // distingue. On sonde `optimiser_policies_rls`, la plus dangereuse des
    // trois : elle prend un verrou ALTER sur les ~130 policies d'un seul appel.
    sonde: { type: 'rpc-ferme', fn: 'optimiser_policies_rls', args: {} },
    decision:
      'À EXÉCUTER DÈS QUE POSSIBLE, et avant de laisser la 320 en place sur une base publique. La règle qu’elle établit vaut pour toute fonction future : sur ce projet, `REVOKE … FROM PUBLIC` ne ferme RIEN — Supabase accorde EXECUTE à `anon` et `authenticated` par des GRANT nommés. Il faut écrire `FROM PUBLIC, anon, authenticated`. Un test du dépôt (lib/rls-guard.test.ts) le vérifie désormais sur chaque migration neuve.',
  },
  {
    id: '325',
    fichier: '325_effort_par_matiere.sql',
    feature:
      'Le diagramme « Ton travail » de /moi : `effort_by_subject(p_days)` agrège en base le volume de révision par matière (questions de quiz + leçons lues) sur une fenêtre glissante',
    siAbsente:
      'La carte « Ton travail » DISPARAÎT de /moi — et c’est voulu : un diagramme à zéro contredirait le temps cumulé affiché juste au-dessus, et annoncerait « tu n’as rien travaillé » à un élève assidu. Le reste de l’onglet est intact.',
    sonde: { type: 'rpc', fn: 'effort_by_subject', args: { p_days: 30 } },
    decision:
      'À EXÉCUTER pour allumer le diagramme. Rien d’autre n’en dépend. Attention à la contrepartie assumée du calcul : il ne compte QUE les quiz et les leçons — `study_sessions` (les flashcards) et `challenge_sessions` (le Défi) n’ont aucun rattachement fiable à une matière, la première n’ayant qu’un nom en texte libre et la seconde rien du tout. Le jour où l’une des deux en gagne un, elle s’ajoute à la fonction sans toucher au reste.',
  },
  {
    id: '326',
    fichier: '326_contenu_physique_chimie_6e.sql',
    feature:
      'Physique-chimie 6e : les 10 fiches du programme sous leurs 4 chapitres (80 questions)',
    siAbsente:
      'La physique-chimie de 6e reste à DEUX fiches héritées de la 008 (« États et changements d’état », « Sources et formes d’énergie ») : c’est la matière la plus pauvre de l’app, dans la classe qui accueille les nouveaux collégiens. Mélanges, trajectoire, vitesse, conversions d’énergie et transmission d’un signal restent introuvables.',
    // Sonde par UUID et non par titre : les seeds de contenu dérivent leurs
    // identifiants du contenu (SHA-1), donc un UUID présent prouve que CE lot
    // précis est passé — un titre pourrait venir d'un autre niveau.
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '0b0d579c-326a-57ff-a214-05f4f1be73dd',
    },
    decision:
      'À EXÉCUTER pour remplir la SIXIÈME, la classe d’entrée du produit et la plus pauvre du collège. Les cinq migrations 326 → 330 sont indépendantes : chacune traite une matière et peut se coller seule.',
  },
  {
    id: '327',
    fichier: '327_contenu_svt_6e.sql',
    feature:
      'SVT 6e : les 9 fiches du programme sous leurs 3 chapitres (72 questions)',
    siAbsente:
      'Les SVT de 6e restent à 5 titres très larges hérités de la 008, sans découpage. La cellule, la classification, l’évolution, les besoins vitaux des organes, la conservation des aliments et la reproduction humaine n’ont aucune fiche propre.',
    // Sonde par UUID et non par titre : les seeds de contenu dérivent leurs
    // identifiants du contenu (SHA-1), donc un UUID présent prouve que CE lot
    // précis est passé — un titre pourrait venir d'un autre niveau.
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: 'b71f99c4-65f3-5068-976e-9d874d5122ad',
    },
    decision:
      'À EXÉCUTER pour remplir la SIXIÈME, la classe d’entrée du produit et la plus pauvre du collège. Les cinq migrations 326 → 330 sont indépendantes : chacune traite une matière et peut se coller seule.',
  },
  {
    id: '328',
    fichier: '328_contenu_francais_6e.sql',
    feature:
      'Français 6e : les 10 fiches du programme sous leurs 3 questionnements (80 questions)',
    siAbsente:
      'Le français de 6e reste aux 5 fiches de la 008. Un élève qui prépare un contrôle sur les récits de création, sur Molière ou sur la poésie du programme ne trouve rien.',
    // Sonde par UUID et non par titre : les seeds de contenu dérivent leurs
    // identifiants du contenu (SHA-1), donc un UUID présent prouve que CE lot
    // précis est passé — un titre pourrait venir d'un autre niveau.
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '8f69c9d1-7cdd-5e7e-b37d-ff57ba7a4e4b',
    },
    decision:
      'À EXÉCUTER pour remplir la SIXIÈME, la classe d’entrée du produit et la plus pauvre du collège. Les cinq migrations 326 → 330 sont indépendantes : chacune traite une matière et peut se coller seule.',
  },
  {
    id: '329',
    fichier: '329_contenu_maths_6e.sql',
    feature:
      'Maths 6e : les 22 fiches du programme sous leurs 6 chapitres (176 questions)',
    siAbsente:
      'Les maths de 6e restent à 5 titres très larges, dans la matière la plus travaillée du collège. Division euclidienne, symétrie axiale, somme des angles, durées, statistiques, probabilités et algorithmique n’ont aucune fiche.',
    // Sonde par UUID et non par titre : les seeds de contenu dérivent leurs
    // identifiants du contenu (SHA-1), donc un UUID présent prouve que CE lot
    // précis est passé — un titre pourrait venir d'un autre niveau.
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '59a20ff1-b14d-5cb2-a8fc-7d4a02e3294f',
    },
    decision:
      'À EXÉCUTER pour remplir la SIXIÈME, la classe d’entrée du produit et la plus pauvre du collège. Les cinq migrations 326 → 330 sont indépendantes : chacune traite une matière et peut se coller seule.',
  },
  {
    id: '330',
    fichier: '330_contenu_histoire_geo_6e.sql',
    feature:
      'Histoire-géo 6e : les 30 fiches du programme sous 7 chapitres et DEUX rayons (240 questions)',
    siAbsente:
      'L’histoire-géo de 6e reste à 5 fiches pour DEUX disciplines et une année entière, et le dossier n’a qu’un seul onglet. Néolithique, démocratie athénienne, naissance du judaïsme, romanisation, espaces de faible densité et répartition de la population mondiale sont absents.',
    // Sonde par UUID et non par titre : les seeds de contenu dérivent leurs
    // identifiants du contenu (SHA-1), donc un UUID présent prouve que CE lot
    // précis est passé — un titre pourrait venir d'un autre niveau.
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'id',
      valeur: '6673b42e-c53c-5b4f-934a-5036903c6dc9',
    },
    decision:
      'À EXÉCUTER pour remplir la SIXIÈME, la classe d’entrée du produit et la plus pauvre du collège. Les cinq migrations 326 → 330 sont indépendantes : chacune traite une matière et peut se coller seule.',
  },
] as const

/** Verdict d'une sonde exécutée. */
export type Verdict = 'vivante' | 'eteinte' | 'non-sondable'

/**
 * « permission denied for table … » — la relation EXISTE, la clé anon n'y a
 * simplement pas accès. Postgres (et donc PostgREST) rend ce code AVANT de
 * regarder la moindre policy RLS : c'est le GRANT qui manque, pas la table.
 * À distinguer absolument de 42P01 / PGRST205, qui disent « relation absente ».
 */
export const PERMISSION_DENIED = '42501'

/**
 * Interprète le retour Supabase d'une sonde. `rows` ne sert qu'aux sondes de
 * type 'ligne' (présence de données) ; pour les autres, seule l'erreur compte —
 * une table sous RLS répond « 0 ligne » sans erreur, et c'est bien « vivante ».
 */
export function interpreterSonde(
  sonde: Sonde,
  erreur: { code?: string; message?: string } | null,
  rows: number,
): Verdict {
  if (sonde.type === 'rpc-ferme') {
    // L'INVERSE de la sonde 'rpc' : ici, une réponse est un ÉCHEC.
    //   42501    = la fonction existe, l'accès anon est fermé → migration passée
    //   PGRST202 = elle n'est pas exposée du tout → fermée aussi (la migration
    //              qui la crée n'a pas tourné : sans fonction, pas de porte)
    //   pas d'erreur = un VISITEUR l'exécute → migration NON passée
    return erreur?.code === PERMISSION_DENIED || erreur?.code === 'PGRST202'
      ? 'vivante'
      : 'eteinte'
  }
  if (sonde.type === 'rpc') {
    // PGRST202 = « fonction introuvable ». Tout AUTRE retour (y compris une
    // erreur « not authenticated ») prouve que la fonction est déployée.
    return erreur?.code === 'PGRST202' ? 'eteinte' : 'vivante'
  }
  // 42501 = « permission denied ». La relation EXISTE — on n'a simplement pas
  // le droit de la lire à la clé anon.
  //
  // C'EST LA CORRECTION DU 26/08/2026, ET ELLE COMPTE. Toute erreur était
  // jusqu'ici lue comme « éteinte », si bien que la sonde déclarait mortes
  // exactement les migrations dont les tables sont les mieux protégées :
  // `push_send_log` (journal d'envoi), `ai_call_attempts` (quota IA) et
  // `subscription_interest` (intentions de paiement) n'accordent aucun GRANT à
  // `anon` — par conception, et c'est très bien ainsi. Les trois étaient en
  // base depuis des semaines et la sonde les donnait éteintes ; l'audit qui
  // s'appuyait dessus en a tiré deux priorités « P0 » imaginaires, dont une
  // fuite d'argent inexistante.
  //
  // Un instrument qui se trompe SUR LES SUJETS SENSIBLES est pire qu'une
  // absence d'instrument : il donne la confiance en prime de l'erreur.
  if (erreur?.code === PERMISSION_DENIED) {
    // Nuance sur la sonde 'ligne' : elle ne demande pas « la table existe-t-elle »
    // mais « cette ligne y est-elle ». Un accès refusé ne répond pas à cette
    // question-là — on ne voit rien, donc on ne conclut rien.
    return sonde.type === 'ligne' ? 'non-sondable' : 'vivante'
  }
  if (erreur) return 'eteinte'
  if (sonde.type === 'ligne') return rows > 0 ? 'vivante' : 'eteinte'
  return 'vivante'
}

/** Les migrations restant à exécuter, dans l'ordre, d'après les verdicts. */
export function restantes(
  verdicts: ReadonlyMap<string, Verdict>,
): MigrationSante[] {
  return MIGRATIONS_SANTE.filter((m) => {
    const v = verdicts.get(m.id)
    // Non sondable = à rejouer par sécurité (idempotent) tant qu'une voisine
    // est éteinte ; sondée vivante = rien à faire.
    return v !== 'vivante'
  })
}
