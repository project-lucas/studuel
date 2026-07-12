-- =============================================================================
-- Scolaria — Migration 015 : exploits de trajet
-- Le trajet maison-école est un temps mort qu'on transforme en révision :
-- toute session jouée dans un créneau de trajet est un « exploit de trajet ».
-- Nouveaux badges (conditions évaluées côté application, comme les autres) :
--   - commute_quizzes : nombre total de sessions jouées en trajet ;
--   - commute_streak  : jours de trajet studieux consécutifs.
-- PRÉREQUIS : 010 (badges, commute_slots). Idempotent.
-- =============================================================================

INSERT INTO public.badges (slug, title, description, icon, condition) VALUES
  ('trajet-1', 'Trajet malin', 'Première session jouée pendant un trajet.', '🚏',
   '{"type":"commute_quizzes","count":1}'),
  ('trajet-serie-5', 'Navetteur assidu', '5 trajets studieux d''affilée.', '🚃',
   '{"type":"commute_streak","days":5}'),
  ('trajet-serie-20', 'Machine de trajet', '20 trajets studieux d''affilée.', '🚄',
   '{"type":"commute_streak","days":20}'),
  ('trajets-50', 'Cerveau nomade', '50 sessions jouées pendant tes trajets.', '🚇',
   '{"type":"commute_quizzes","count":50}')
ON CONFLICT (slug) DO NOTHING;
