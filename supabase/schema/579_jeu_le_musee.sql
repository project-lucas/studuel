-- =============================================================================
-- Studuel — Migration 579 : LE MUSÉE, LE JEU DES ARTS PLASTIQUES (14/10/2026).
--
-- Lucas : « quel mode de jeu pour l'art plastique ? Je pense qu'on doit faire
-- comme l'histoire de l'art […] crée un mode de jeu avec plusieurs paliers de
-- difficulté, mais complet et addictif ». Un jeu entre au catalogue
-- (lib/jeux/catalog.ts, lib/jeux/le-musee.ts) :
--   · Arts plastiques : le-musee (libre) — une œuvre, quatre réponses ; la
--     question monte avec le palier (l'artiste, le titre, le mouvement, le siècle)
-- Le serveur doit le connaître à deux endroits, comme pour la 578 :
--   1. `game_catalog` (238) — la liste blanche d'`apply_game_trophies` ; le
--      « programme » de la matière y entre aussi (lib/jeux/programme).
--   2. `mode_catalog` (352, 355) — les bornes de plausibilité du palmarès.
-- Miroirs : lib/trophy-catalog.test.ts et lib/palmares/epreuves.test.ts
-- relisent la 238 ∪ 578 ∪ 579 et la 355 ∪ 578 ∪ 579.
--
-- Idempotente. À exécuter à la main : Supabase Dashboard → SQL Editor → Run.
-- Sans elle, rien ne casse : Le Musée se joue, mais ses trophées sont refusés
-- et ses scores ne se classent pas.
-- =============================================================================

INSERT INTO public.game_catalog (subject_slug, game_id) VALUES
  ('arts-plastiques', 'le-musee'),
  ('arts-plastiques', 'programme')
ON CONFLICT (subject_slug, game_id) DO NOTHING;

INSERT INTO public.mode_catalog (mode_id, max_score, min_ms_per_point) VALUES
  -- Le Musée
  ('le-musee', 30000, 1)
ON CONFLICT (mode_id) DO UPDATE
  SET max_score = EXCLUDED.max_score,
      min_ms_per_point = EXCLUDED.min_ms_per_point;

DO $$
DECLARE
  n_jeux integer;
  n_modes integer;
BEGIN
  SELECT count(*) INTO n_jeux FROM public.game_catalog WHERE subject_slug = 'arts-plastiques';
  SELECT count(*) INTO n_modes FROM public.mode_catalog WHERE mode_id = 'le-musee';
  IF n_jeux < 2 OR n_modes < 1 THEN
    RAISE EXCEPTION 'Migration 579 incomplète : % lignes de game_catalog (2 attendues), % de mode_catalog (1)', n_jeux, n_modes;
  END IF;
  RAISE NOTICE 'Migration 579 OK : les arts plastiques ont Le Musée (% couples, % mode).', n_jeux, n_modes;
END $$;
