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
    id: '235',
    fichier: '235_contenu_anglais_axes_tle.sql',
    feature:
      'Anglais Tle : les SIX axes du programme officiel (BO n° 22 du 29 mai 2025, en vigueur à la rentrée 2026-2027) remplacent les 4 intitulés hors-programme, et les 24 fiches de grammaire se rangent sous leurs 4 repères linguistiques — 48 questions',
    siAbsente:
      'L’anglais de Terminale ouvre sur 4 chapitres donnés pour « les axes du programme » qui n’en sont pas : « Faire société : unité et pluralité », « Environnements en mutation », « Art et débats d’idées », « Innovations et responsabilité ». Deux d’entre eux appartiennent à un AUTRE enseignement (la spécialité « Anglais, monde contemporain »). L’élève révise donc des intitulés absents de son cours, et ne trouve rien sur « Le Royaume-Uni et ses nations » — le seul axe que le programme rende obligatoire.',
    sonde: {
      type: 'ligne',
      table: 'chapters',
      colonne: 'title',
      valeur: 'Axe 6 — Le Royaume-Uni et ses nations',
    },
    decision:
      'La migration SUPPRIME les 4 faux axes (leurs leçons et quiz partent par cascade) : les garder laisserait quatre portes vers du hors-programme. Elle REPREND l’ALTER TABLE de la 234 en ADD COLUMN IF NOT EXISTS — 234 n’étant pas jouée en production, sans cette reprise la 235 échouerait à mi-parcours, les 4 anciens chapitres déjà supprimés et les 6 neufs pas encore posés, soit une matière vide. Les positions des 24 fiches de grammaire sont RÉÉCRITES UNE À UNE (7 à 30) et non décalées d’un « +6 » : un décalage relatif rejoué décalerait une seconde fois.',
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
    sonde: {
      type: 'ligne',
      table: 'exam_papers',
      colonne: 'session',
      valeur: '2026',
    },
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
