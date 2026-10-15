-- =============================================================================
-- Studuel — Migration 578 : LES JEUX DE SALON DE MUSIQUE ET DE SPORT (14/10/2026).
--
-- Lucas : « trouve-moi des modes de jeu pour le sport, la musique », puis
-- « pour la musique oui un mode sur les instruments, un mode qui a composé »
-- et « pour le sport il doit y avoir un mode proche de l'anatomie, notamment
-- sur les muscles ». Trois jeux entrent au catalogue (lib/jeux/catalog.ts) :
--   · Musique : classe-instrument (libre), qui-a-compose (Studuel+)
--   · Sport   : muscles-express (libre) — « Classe-moi le sport », écrit le
--               même jour, a été retiré sur consigne de Lucas
-- Le serveur doit les connaître à deux endroits :
--   1. `game_catalog` (238) — la liste blanche d'`apply_game_trophies` : sans
--      la ligne, la RPC refuse les trophées du jeu. Le « programme » de chaque
--      matière y entre aussi (lib/jeux/programme, présent dans CHAQUE matière).
--   2. `mode_catalog` (352, 355) — les bornes de plausibilité du palmarès.
-- Miroirs : lib/trophy-catalog.test.ts et lib/palmares/epreuves.test.ts
-- relisent la 238 ∪ 578 et la 355 ∪ 578.
--
-- Idempotente. À exécuter à la main : Supabase Dashboard → SQL Editor → Run.
-- Sans elle, rien ne casse : les trois jeux se jouent, mais leurs trophées
-- sont refusés et leurs scores ne se classent pas.
-- =============================================================================

INSERT INTO public.game_catalog (subject_slug, game_id) VALUES
  ('musique', 'classe-instrument'),
  ('musique', 'qui-a-compose'),
  ('musique', 'programme'),
  ('sport',   'muscles-express'),
  ('sport',   'programme')
ON CONFLICT (subject_slug, game_id) DO NOTHING;

INSERT INTO public.mode_catalog (mode_id, max_score, min_ms_per_point) VALUES
  -- Classe-moi l'instrument
  ('classe-instrument', 30000, 1),
  -- Qui a composé ?
  ('qui-a-compose', 30000, 1),
  -- Muscles express
  ('muscles-express', 30000, 1)
ON CONFLICT (mode_id) DO UPDATE
  SET max_score = EXCLUDED.max_score,
      min_ms_per_point = EXCLUDED.min_ms_per_point;

DO $$
DECLARE
  n_jeux integer;
  n_modes integer;
BEGIN
  SELECT count(*) INTO n_jeux FROM public.game_catalog WHERE subject_slug IN ('musique', 'sport');
  SELECT count(*) INTO n_modes FROM public.mode_catalog
   WHERE mode_id IN ('classe-instrument', 'qui-a-compose', 'muscles-express');
  IF n_jeux < 5 OR n_modes < 3 THEN
    RAISE EXCEPTION 'Migration 578 incomplète : % lignes de game_catalog (5 attendues), % de mode_catalog (3)', n_jeux, n_modes;
  END IF;
  RAISE NOTICE 'Migration 578 OK : Musique et Sport ont leurs jeux (% couples, % modes).', n_jeux, n_modes;
END $$;
