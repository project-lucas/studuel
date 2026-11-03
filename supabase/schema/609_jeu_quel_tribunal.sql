-- =============================================================================
-- Studuel — Migration 609 : QUEL TRIBUNAL ?, LE PREMIER JEU DU SUPÉRIEUR
-- (03/11/2026).
--
-- Lucas : « il faudra également créer les modes de jeu ». Un jeu entre au
-- catalogue (lib/jeux/catalog.ts, lib/jeux/quel-tribunal.ts) :
--   · Institutions juridictionnelles (L1 droit) : quel-tribunal (libre) — une
--     affaire, quatre juridictions ; la banque monte avec le palier (première
--     instance, voies de recours, cours suprêmes et européennes).
-- Le serveur doit le connaître aux deux mêmes endroits que pour la 579 :
--   1. `game_catalog` (238) — la liste blanche d'`apply_game_trophies` ; le
--      « programme » de la matière y entre aussi (lib/jeux/programme).
--   2. `mode_catalog` (352, 355) — les bornes de plausibilité du palmarès.
-- Miroirs : lib/trophy-catalog.test.ts et lib/palmares/epreuves.test.ts.
--
-- À exécuter APRÈS la 606 (la matière doit exister). Idempotente. À la main :
-- Supabase Dashboard → SQL Editor → Run. Sans elle, rien ne casse : le jeu se
-- joue, mais ses trophées sont refusés et ses scores ne se classent pas.
-- =============================================================================

INSERT INTO public.game_catalog (subject_slug, game_id) VALUES
  ('institutions-juridictionnelles', 'quel-tribunal'),
  ('institutions-juridictionnelles', 'programme')
ON CONFLICT (subject_slug, game_id) DO NOTHING;

INSERT INTO public.mode_catalog (mode_id, max_score, min_ms_per_point) VALUES
  -- Quel tribunal ?
  ('quel-tribunal', 30000, 1)
ON CONFLICT (mode_id) DO UPDATE
  SET max_score = EXCLUDED.max_score,
      min_ms_per_point = EXCLUDED.min_ms_per_point;

DO $$
DECLARE
  n_jeux integer;
  n_modes integer;
BEGIN
  SELECT count(*) INTO n_jeux FROM public.game_catalog WHERE subject_slug = 'institutions-juridictionnelles';
  SELECT count(*) INTO n_modes FROM public.mode_catalog WHERE mode_id = 'quel-tribunal';
  IF n_jeux < 2 OR n_modes < 1 THEN
    RAISE EXCEPTION 'Migration 609 incomplète : % lignes de game_catalog (2 attendues), % de mode_catalog (1)', n_jeux, n_modes;
  END IF;
  RAISE NOTICE 'Migration 609 OK : la L1 droit a Quel tribunal ? (% couples, % mode).', n_jeux, n_modes;
END $$;
