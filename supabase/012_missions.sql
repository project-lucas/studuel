-- =============================================================================
-- Scolaria — Migration 012 : missions planifiées
-- Les habitudes deviennent des missions avec jours + heure (stockés dans
-- habits.target : {"days":[0..6], "time":"HH:MM"} — 0 = lundi, 6 = dimanche).
-- Nouvelles entrées du catalogue, dont la mission fixe du dimanche.
-- PRÉREQUIS : 010 exécutée. Idempotent.
-- =============================================================================

INSERT INTO public.habit_catalog (id, title, icon, rationale, validation_type, default_target) VALUES
  -- Mission FIXE pour tous : planifier sa semaine, le dimanche.
  ('55555555-5555-4555-8555-555555555509', 'Planifier ma semaine', '🗓️',
   'Planifier sa semaine le dimanche réduit la charge mentale et double le taux de passage à l''action : les décisions sont déjà prises quand la fatigue arrive.',
   'manual', '{"days": [6], "time": "18:00"}'),
  ('55555555-5555-4555-8555-555555555510', 'Hydratation au réveil', '💧',
   'Le cerveau est composé d''environ 75 % d''eau : 2 % de déshydratation suffisent à dégrader l''attention et la mémoire de travail. Un grand verre d''eau au réveil relance la machine.',
   'manual', '{"days": [0,1,2,3,4,5,6], "time": "07:15"}'),
  ('55555555-5555-4555-8555-555555555511', 'Marche 15 minutes', '🚶',
   'Le réveil neuronal : 15 minutes de marche augmentent le flux sanguin cérébral et la vigilance pendant des heures — idéal avant les cours ou une session.',
   'manual', '{"days": [0,1,2,3,4,5,6], "time": "08:00"}')
ON CONFLICT (id) DO NOTHING;

-- Sport : cible portée à 1 h (référence produit).
UPDATE public.habit_catalog
SET default_target = '{"minutes": 60, "days": [2,5]}'::jsonb
WHERE id = '55555555-5555-4555-8555-555555555504'
  AND default_target = '{"minutes": 30}'::jsonb;
