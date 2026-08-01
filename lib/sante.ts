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
] as const

/** Verdict d'une sonde exécutée. */
export type Verdict = 'vivante' | 'eteinte' | 'non-sondable'

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
  if (sonde.type === 'rpc') {
    // PGRST202 = « fonction introuvable ». Tout AUTRE retour (y compris une
    // erreur « not authenticated ») prouve que la fonction est déployée.
    return erreur?.code === 'PGRST202' ? 'eteinte' : 'vivante'
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
