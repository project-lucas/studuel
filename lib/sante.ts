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
  {
    id: '188',
    fichier: '188_tour_guide.sql',
    feature: 'Tour guidé post-onboarding',
    siAbsente: 'Le tour guidé ne se lance jamais après l’onboarding.',
    sonde: { type: 'colonne', table: 'profiles', colonne: 'tutorial_completed' },
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
    id: '212',
    fichier: '212_traque_boss.sql',
    feature: 'La Traque — boss débusqués en révisant',
    siAbsente:
      'Aucune jauge de traque : le bandeau des gardiens du jour et la tuile Boss de /defi n’apparaissent pas, réviser ne débusque jamais personne.',
    sonde: { type: 'table', table: 'boss_gauges' },
  },
  {
    id: '193',
    fichier: '193_matieres_completes.sql',
    feature: 'Catalogue de matières complet (+6 matières)',
    siAbsente:
      '6 matières du programme officiel absentes du catalogue — MAIS les exécuter aujourd’hui ajoute 6 coquilles vides cliquables (11 matières sans contenu sur 31).',
    sonde: { type: 'ligne', table: 'subjects', colonne: 'slug', valeur: 'snt' },
    decision:
      'À n’exécuter qu’une fois les matières vides masquées côté élève (chantier 8), ou avec leur contenu.',
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
