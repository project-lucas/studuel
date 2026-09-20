-- Scolaria - Migration 353 : LE PLANNING DU CARNET — une revision par dossier,
-- a des jours choisis, a une heure choisie.
--
-- POURQUOI. Le carnet sait QUOI reviser (le moteur, 315) et COMMENT (la
-- feuille « Comment tu veux reviser ? », 316), mais jamais QUAND. La date de
-- controle (exam_on) ne fait qu'un compte a rebours, et « Planifier ma
-- semaine » (012) est une case a cocher. Rien, nulle part, ne pose une
-- revision dans un jour futur. Or c'est la personnalisation qui manque le
-- plus a Anki et Wooflash : « le dossier Verbes irreguliers, lundi et jeudi a
-- 18 h, 20 cartes, en mode entrainement ».
--
-- CE QU'ON ENREGISTRE. Un plan = un dossier (le cours entier, ou un de ses
-- chapitres — les dossiers du carnet SONT les chapitres, imbriquables) + des
-- jours de la semaine + une heure facultative + la longueur et le mode de la
-- session. Le « fait / pas fait » n'est PAS stocke : il se DEDUIT des
-- sessions jouees (carnet_review_sessions, course_id + chapter_id + jour), la
-- seule preuve honnete qu'une revision a eu lieu.
--
-- LES JOURS suivent la convention de l'app (habits.target, 012) : 0 = lundi
-- ... 6 = dimanche. L'heure est en heure de l'eleve (Europe/Paris), texte
-- « HH:MM », comme les creneaux de trajet.
--
-- Idempotente. A EXECUTER A LA MAIN dans le SQL Editor, apres la 352.
-- Astuce : selectionne TOUT le fichier (Ctrl+A) avant de lancer.
--
-- TANT QU'ELLE N'EST PAS EXECUTEE : le carnet fonctionne comme avant, le bloc
-- « Ma semaine » et l'onglet « Planning » d'un cours restent vides, et
-- « Planifier ce dossier » repond « planning indisponible ». Rien ne casse.

CREATE TABLE IF NOT EXISTS public.carnet_plans (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id   UUID NOT NULL REFERENCES public.carnet_courses(id) ON DELETE CASCADE,
  -- NULL = le cours entier ; sinon un chapitre (dossier) du cours, et ses
  -- sous-dossiers avec lui (meme regle que la portee « chapitre » d'une session).
  chapter_id  UUID REFERENCES public.carnet_chapters(id) ON DELETE CASCADE,
  -- Les jours de la semaine, 0 = lundi ... 6 = dimanche, sans doublon.
  days        SMALLINT[] NOT NULL,
  -- Heure de l'eleve « HH:MM », facultative (un plan « le mercredi » suffit).
  at_time     TEXT,
  -- Longueur de la session : 10, 20, 40 cartes, ou NULL = tout ce qui est du.
  length      SMALLINT,
  -- Mode de la session, meme vocabulaire que lib/carnet/session-options.
  mode        TEXT NOT NULL DEFAULT 'apprentissage',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT carnet_plans_days_valides CHECK (
    cardinality(days) BETWEEN 1 AND 7
    AND 0 <= ALL (days) AND 6 >= ALL (days)
  ),
  CONSTRAINT carnet_plans_heure_valide CHECK (
    at_time IS NULL OR at_time ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'
  ),
  CONSTRAINT carnet_plans_longueur_valide CHECK (
    length IS NULL OR length IN (10, 20, 40)
  ),
  CONSTRAINT carnet_plans_mode_valide CHECK (
    mode IN ('apprentissage', 'entrainement', 'examen')
  )
);

-- « Mes plans » (le bloc Ma semaine) et « les plans de ce cours » (l'onglet
-- Planning) : les deux seules lectures.
CREATE INDEX IF NOT EXISTS carnet_plans_owner_idx
  ON public.carnet_plans (owner_id, created_at);
CREATE INDEX IF NOT EXISTS carnet_plans_course_idx
  ON public.carnet_plans (course_id);

-- Au plus UN plan par dossier : un dossier planifie deux fois, c'est deux
-- lignes qui se contredisent. Modifier, pas dupliquer.
CREATE UNIQUE INDEX IF NOT EXISTS carnet_plans_dossier_unique
  ON public.carnet_plans (owner_id, course_id, COALESCE(chapter_id, '00000000-0000-0000-0000-000000000000'::uuid));

ALTER TABLE public.carnet_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "carnet_plans_select_own" ON public.carnet_plans;
CREATE POLICY "carnet_plans_select_own" ON public.carnet_plans
  FOR SELECT TO authenticated USING (owner_id = (SELECT auth.uid()));

-- Ecrire : etre proprietaire du plan ET du cours vise. Sans la seconde
-- condition, un plan pourrait pointer le cours d'un autre eleve — la RLS de
-- carnet_courses empecherait de le lire, mais la ligne existerait quand meme.
DROP POLICY IF EXISTS "carnet_plans_insert_own" ON public.carnet_plans;
CREATE POLICY "carnet_plans_insert_own" ON public.carnet_plans
  FOR INSERT TO authenticated WITH CHECK (
    owner_id = (SELECT auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.carnet_courses c
       WHERE c.id = course_id AND c.owner_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "carnet_plans_update_own" ON public.carnet_plans;
CREATE POLICY "carnet_plans_update_own" ON public.carnet_plans
  FOR UPDATE TO authenticated
  USING (owner_id = (SELECT auth.uid()))
  WITH CHECK (
    owner_id = (SELECT auth.uid())
    AND EXISTS (
      SELECT 1 FROM public.carnet_courses c
       WHERE c.id = course_id AND c.owner_id = (SELECT auth.uid())
    )
  );

DROP POLICY IF EXISTS "carnet_plans_delete_own" ON public.carnet_plans;
CREATE POLICY "carnet_plans_delete_own" ON public.carnet_plans
  FOR DELETE TO authenticated USING (owner_id = (SELECT auth.uid()));

-- Le « fait aujourd'hui » se lit dans les sessions : cet index sert la
-- question « mes sessions de cette semaine » (user_id, started_at) — deja
-- posee par la 317 pour la serie. Rien de plus a creer.
