-- =============================================================================
-- Scolaria — Migration 010 : onglet Moi (habitudes, badges, trajets)
-- Catalogue d'habitudes scientifiquement justifiées, logs quotidiens
-- (manuels ou auto-validés), badges de jalons, créneaux de trajet.
-- PRÉREQUIS : 007 exécutée. Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. HABIT_CATALOG — catalogue prédéfini (pas de création libre)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.habit_catalog (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  icon            TEXT NOT NULL DEFAULT '✅',
  rationale       TEXT NOT NULL,          -- le pourquoi scientifique, affiché
  validation_type TEXT NOT NULL DEFAULT 'manual'
                    CHECK (validation_type IN ('auto_revision', 'auto_commute', 'manual')),
  default_target  JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- -----------------------------------------------------------------------------
-- 2. HABITS — habitudes activées par l'élève
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.habits (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  catalog_id UUID NOT NULL REFERENCES public.habit_catalog (id) ON DELETE CASCADE,
  target     JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, catalog_id)
);

-- -----------------------------------------------------------------------------
-- 3. HABIT_LOGS — un log par habitude et par jour
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.habit_logs (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id       UUID NOT NULL REFERENCES public.habits (id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  date           DATE NOT NULL,
  completed      BOOLEAN NOT NULL DEFAULT false,
  auto_validated BOOLEAN NOT NULL DEFAULT false,
  UNIQUE (habit_id, date)
);
CREATE INDEX IF NOT EXISTS habit_logs_user_date_idx
  ON public.habit_logs (user_id, date DESC);

-- -----------------------------------------------------------------------------
-- 4. BADGES + USER_BADGES — jalons prédéfinis
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.badges (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  icon        TEXT NOT NULL DEFAULT '🏅',
  condition   JSONB NOT NULL              -- évaluée côté application
);

CREATE TABLE IF NOT EXISTS public.user_badges (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  badge_id    UUID NOT NULL REFERENCES public.badges (id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, badge_id)
);

-- Créneaux de trajet (ex : [{"start":"07:30","end":"08:15"}]).
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS commute_slots JSONB;

REVOKE UPDATE ON public.profiles FROM authenticated, anon;
GRANT  UPDATE (full_name, grade_level, daily_goal, onboarded, selected_subjects, commute_slots)
  ON public.profiles TO authenticated;

-- -----------------------------------------------------------------------------
-- RLS
-- -----------------------------------------------------------------------------
ALTER TABLE public.habit_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges   ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "habit_catalog_select_auth" ON public.habit_catalog;
CREATE POLICY "habit_catalog_select_auth" ON public.habit_catalog
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "badges_select_auth" ON public.badges;
CREATE POLICY "badges_select_auth" ON public.badges
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "habits_all_own" ON public.habits;
CREATE POLICY "habits_all_own" ON public.habits
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "habit_logs_all_own" ON public.habit_logs;
CREATE POLICY "habit_logs_all_own" ON public.habit_logs
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "user_badges_select_own" ON public.user_badges;
CREATE POLICY "user_badges_select_own" ON public.user_badges
  FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "user_badges_insert_own" ON public.user_badges;
CREATE POLICY "user_badges_insert_own" ON public.user_badges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- SEED — catalogue d'habitudes (rationale scientifique affiché)
-- =============================================================================
INSERT INTO public.habit_catalog (id, title, icon, rationale, validation_type, default_target) VALUES
  ('55555555-5555-4555-8555-555555555501', 'Sommeil régulier', '😴',
   'Le cerveau consolide la mémoire pendant le sommeil profond : se coucher à heure fixe augmente la rétention de ce que tu as appris dans la journée.',
   'manual', '{"bedtime": "22:30"}'),
  ('55555555-5555-4555-8555-555555555502', 'Révision quotidienne', '🎯',
   'La répétition espacée bat le bachotage : une session chaque jour ancre les connaissances bien mieux qu''une grosse session la veille du contrôle.',
   'auto_revision', '{"sessions": 1}'),
  ('55555555-5555-4555-8555-555555555503', 'Test sur trajets', '🚌',
   'Les temps morts (bus, métro, voiture) sont parfaits pour un quiz : la récupération active en contexte varié renforce la mémoire à long terme.',
   'auto_commute', '{"quizzes": 1}'),
  ('55555555-5555-4555-8555-555555555504', 'Sport / bouger', '⚽',
   'L''exercice physique augmente le BDNF, une molécule qui favorise directement l''apprentissage et la concentration.',
   'manual', '{"minutes": 30}'),
  ('55555555-5555-4555-8555-555555555505', 'Lecture profonde', '📖',
   '15 minutes de lecture soutenue par jour reconstruisent la capacité d''attention longue, érodée par le scroll.',
   'manual', '{"minutes": 15}'),
  ('55555555-5555-4555-8555-555555555506', 'Pas d''écran avant de dormir', '🌙',
   'La lumière bleue retarde l''endormissement et dégrade le sommeil profond — donc la mémorisation de ta journée.',
   'manual', '{}'),
  ('55555555-5555-4555-8555-555555555507', 'Petit-déjeuner complet', '🥐',
   'Le cerveau consomme 20 % de l''énergie du corps : un petit-déjeuner stable évite le coup de barre de 10 h en plein cours.',
   'manual', '{}'),
  ('55555555-5555-4555-8555-555555555508', 'Téléphone hors de la chambre', '📵',
   'La simple présence du téléphone à portée de main réduit la mémoire de travail — même éteint.',
   'manual', '{}')
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- SEED — badges
-- =============================================================================
INSERT INTO public.badges (slug, title, description, icon, condition) VALUES
  ('serie-7', '7 jours de structure', 'Une semaine complète d''activité, sans casser la série.', '🔥', '{"type":"streak","days":7}'),
  ('serie-30', '30 jours de structure', 'Un mois entier de régularité — la structure est là.', '🏆', '{"type":"streak","days":30}'),
  ('serie-100', '100 jours de structure', 'Trois mois de constance. Niveau athlète.', '💎', '{"type":"streak","days":100}'),
  ('habitude-ancree', 'Habitude ancrée', 'Une habitude tenue 21 jours d''affilée : elle fait partie de toi.', '⚓', '{"type":"habit_anchored","days":21}'),
  ('trajets-10', 'Nomade du savoir', '10 quiz complétés pendant tes trajets.', '🚌', '{"type":"commute_quizzes","count":10}'),
  ('premiere-habitude', 'Premier pas', 'Première habitude ajoutée à ta structure.', '🌱', '{"type":"habits_count","count":1}'),
  ('quiz-10', 'Esprit vif', '10 quiz terminés, toutes matières confondues.', '🎯', '{"type":"quiz_count","count":10}'),
  ('sans-faute', 'Sans faute', 'Un quiz réussi à 100 %.', '⭐', '{"type":"perfect_quiz"}')
ON CONFLICT (slug) DO NOTHING;
