-- =============================================================================
-- 355 — Le Palmarès s'étend aux jeux de salon (par matière)
--
-- La 352 a donné aux cinq modes de l'Arène un score en base, un record de
-- toujours, un record de la semaine et une place dans la classe. Les jeux de
-- salon (calcul mental, orthographe, capitales… un salon par matière) rendent
-- eux aussi UN NOMBRE en fin de partie — le score du moteur lib/jeux/run :
-- 100 pts par bonne réponse, multiplicateur de série jusqu'à ×4, primes de
-- vague, de vitesse et de sans-faute — et ce nombre se classe de la même
-- façon. Il suffit donc d'inscrire chaque jeu à `mode_catalog` : les tables
-- (mode_runs, mode_bests, mode_weeks) et les RPC (record_mode_score,
-- mode_ladder, my_mode_palmares) de la 352 servent telles quelles.
--
-- LES BORNES SONT COMMUNES à tous les jeux (miroir de lib/palmares/epreuves.ts,
-- JEU_MAX_SCORE / JEU_MIN_MS_PAR_POINT, vérifié par test) : même barème, même
-- plafond. Une milliseconde par point : un jeu de 25 questions bouclé en 20 s
-- vaut au plus 10 000 pts, plausible. L'ÉPREUVE ULTIME n'est PAS classée ici :
-- sans plafond de score, elle a sa cote et son classement (314), et le client
-- ne l'envoie pas.
--
-- Un jeu qui passe « implemented » dans lib/jeux/catalog.ts doit recevoir sa
-- ligne dans une migration suivante — le test du miroir le réclame.
--
-- PRÉREQUIS : 352 (mode_catalog). Idempotent.
-- =============================================================================

INSERT INTO public.mode_catalog (mode_id, max_score, min_ms_per_point) VALUES
  -- Capitales du monde
  ('capitales', 30000, 1),
  -- La Frise folle
  ('frise-folle', 30000, 1),
  -- Duel d’orthographe
  ('orthographe', 30000, 1),
  -- Chasse à la faute
  ('chasse-faute', 30000, 1),
  -- Conjugaison éclair
  ('conjugaison-eclair', 30000, 1),
  -- Calcul mental éclair
  ('calcul-mental', 30000, 1),
  -- Le compte est bon
  ('compte-est-bon', 30000, 1),
  -- Suite logique
  ('suite-logique', 30000, 1),
  -- Traduction flash
  ('traduction-flash', 30000, 1),
  -- Faux amis
  ('faux-amis', 30000, 1),
  -- Phrase en vrac
  ('phrase-en-vrac', 30000, 1),
  -- Traducción flash
  ('traduccion-flash', 30000, 1),
  -- Falsos amigos
  ('falsos-amigos', 30000, 1),
  -- Anatomie express
  ('anatomie-express', 30000, 1),
  -- Classe-moi ça
  ('classe-moi-ca', 30000, 1),
  -- Chasse aux éléments
  ('chasse-elements', 30000, 1),
  -- La bonne unité
  ('bonne-unite', 30000, 1)
ON CONFLICT (mode_id) DO UPDATE
  SET max_score = EXCLUDED.max_score,
      min_ms_per_point = EXCLUDED.min_ms_per_point;
