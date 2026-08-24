-- =============================================================================
-- Studuel — Migration 315 : le MOTEUR DE RÉVISION du carnet (v2).
--
-- POURQUOI CETTE TABLE EXISTE
--
-- Jusqu'ici, « qu'est-ce qui est dû aujourd'hui ? » était RECALCULÉ à chaque
-- affichage, en relisant jusqu'à 4 000 tentatives (`carnet_review_attempts`) et
-- en rejouant la règle de `lib/carnet-revoir` sur chacune. Trois conséquences :
--   1. le coût grandissait indéfiniment avec l'usage de l'élève ;
--   2. aucune question ne pouvait être POSÉE à la base — « qu'est-ce qui tombe
--      demain ? », « combien de cartes-sangsues ? » n'étaient pas requêtables ;
--   3. le planning ne pouvait pas être plus fin que « un palier par nombre de
--      bonnes réponses d'affilée », puisqu'il n'y avait nulle part où écrire
--      l'aisance d'une carte, ses rechutes ou son étape d'apprentissage.
--
-- `carnet_question_states` porte désormais l'état de CHAQUE carte pour CHAQUE
-- élève. Les tentatives restent l'historique (on n'y touche pas) ; cette table
-- est l'état courant, la seule chose que le planificateur lit et écrit.
--
-- CE QUE LE MOTEUR SAIT FAIRE, ET QUE L'ANCIEN NE SAVAIT PAS
--   • quatre verdicts (Encore / Difficile / Bien / Facile) au lieu de juste/faux ;
--   • une AISANCE (`ease`) par carte : deux cartes ne vieillissent plus pareil ;
--   • des ÉTAPES D'APPRENTISSAGE intra-journée (`phase = 'apprentissage'`) —
--     l'ancien moteur ne pouvait pas reproposer une carte le jour même, or
--     c'est précisément là que la mémorisation se fait ;
--   • une RECHUTE PROGRESSIVE (`lapses`) au lieu du retour à zéro ;
--   • les CARTES-SANGSUES (`is_leech`) : la carte ratée sans fin est signalée
--     à reformuler au lieu de tourner en boucle.
--
-- Le détail de la règle vit dans `lib/carnet/planification.ts` (pur et testé) :
-- cette migration ne fait que lui donner un endroit où écrire.
--
-- PRÉREQUIS : migration 186 (carnet_courses, carnet_questions,
-- carnet_review_sessions). Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- ------------------------------------------------- état d'une carte par élève ---
CREATE TABLE IF NOT EXISTS public.carnet_question_states (
  user_id       UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  question_id   UUID NOT NULL
    REFERENCES public.carnet_questions (id) ON DELETE CASCADE,

  -- 'apprentissage' : la carte est jeune (ou en rechute) et se revoit dans la
  -- JOURNÉE, par étapes de minutes. 'revision' : elle est diplômée, son
  -- intervalle se compte en jours.
  phase         TEXT NOT NULL DEFAULT 'apprentissage'
    CHECK (phase IN ('apprentissage', 'revision')),
  -- Index de l'étape d'apprentissage en cours (ignoré en phase 'revision').
  step          SMALLINT NOT NULL DEFAULT 0 CHECK (step >= 0),

  -- Intervalle courant en jours (0 tant que la carte n'est pas diplômée).
  interval_days INTEGER NOT NULL DEFAULT 0 CHECK (interval_days >= 0),
  -- L'aisance : multiplicateur de l'intervalle à chaque réussite. 2,50 au
  -- départ, jamais sous 1,30 — sous ce plancher une carte ne progresse plus du
  -- tout et l'élève la revoit à perpétuité.
  ease          NUMERIC(4, 2) NOT NULL DEFAULT 2.50
    CHECK (ease >= 1.30 AND ease <= 5.00),

  -- Bonnes réponses d'affilée (remis à 0 par un « Encore »).
  streak        INTEGER NOT NULL DEFAULT 0 CHECK (streak >= 0),
  -- Nombre total de passages sur la carte.
  reps          INTEGER NOT NULL DEFAULT 0 CHECK (reps >= 0),
  -- Rechutes : nombre de fois où une carte DIPLÔMÉE est retombée.
  lapses        INTEGER NOT NULL DEFAULT 0 CHECK (lapses >= 0),
  -- Carte-sangsue : trop de rechutes. Ce n'est pas l'élève qui a un problème,
  -- c'est la carte — elle est signalée à reformuler.
  is_leech      BOOLEAN NOT NULL DEFAULT FALSE,

  -- Le moment où la carte redevient due. Une seule colonne pour les deux
  -- phases : « dans 10 minutes » et « dans 3 jours » s'écrivent pareil, et
  -- « ce qui est dû » est toujours `due_at <= now()`.
  due_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at  TIMESTAMPTZ,

  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),

  PRIMARY KEY (user_id, question_id)
);

-- L'index qui porte la question centrale : « qu'est-ce qui est dû ? ».
CREATE INDEX IF NOT EXISTS carnet_question_states_due_idx
  ON public.carnet_question_states (user_id, due_at);

-- « Quelles cartes de CE cours sont dues ? » passe par les questions ; cet
-- index sert les jointures et le comptage par carte.
CREATE INDEX IF NOT EXISTS carnet_question_states_question_idx
  ON public.carnet_question_states (question_id);

ALTER TABLE public.carnet_question_states ENABLE ROW LEVEL SECURITY;

-- Owner-only, et la question doit appartenir à un cours de l'élève : sans le
-- EXISTS, un appel forgé écrirait l'état d'une carte qui n'est pas à lui (la
-- clé primaire ne l'en empêche pas, `user_id` étant le sien).
DROP POLICY IF EXISTS "carnet_question_states_all_own"
  ON public.carnet_question_states;
CREATE POLICY "carnet_question_states_all_own"
  ON public.carnet_question_states
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1
      FROM public.carnet_questions q
      JOIN public.carnet_courses c ON c.id = q.course_id
      WHERE q.id = question_id AND c.owner_id = auth.uid()
    )
  );

-- ------------------------------------- plafonds quotidiens, réglés par cours ---
-- Le mur de 300 cartes dues est le premier motif d'abandon d'une révision
-- espacée : on ne peut pas laisser la file grandir sans borne. Les plafonds
-- sont PAR COURS (comme les paquets d'Anki) : réviser 20 mots d'anglais par
-- jour et 60 dates d'histoire est un choix légitime.
ALTER TABLE public.carnet_courses
  ADD COLUMN IF NOT EXISTS new_per_day INTEGER NOT NULL DEFAULT 15;
ALTER TABLE public.carnet_courses
  ADD COLUMN IF NOT EXISTS reviews_per_day INTEGER NOT NULL DEFAULT 80;

-- La tolérance orthographique, elle aussi par cours : en langues on veut
-- l'orthographe exacte, en histoire « Rooseveltt » ne doit pas coûter la carte.
-- Lue par `lib/carnet/correction`.
ALTER TABLE public.carnet_courses
  ADD COLUMN IF NOT EXISTS spell_tolerance TEXT NOT NULL DEFAULT 'normale';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'carnet_courses_tolerance_valide'
  ) THEN
    ALTER TABLE public.carnet_courses
      ADD CONSTRAINT carnet_courses_tolerance_valide
      CHECK (spell_tolerance IN ('stricte', 'normale', 'large'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'carnet_courses_caps_bornes'
  ) THEN
    ALTER TABLE public.carnet_courses
      ADD CONSTRAINT carnet_courses_caps_bornes
      CHECK (
        new_per_day BETWEEN 0 AND 200
        AND reviews_per_day BETWEEN 0 AND 500
      );
  END IF;
END $$;

-- ------------------------------------------------------- sessions reprenables ---
-- `carnet_review_sessions` était ÉCRITE et lue nulle part : de la donnée morte.
-- Elle devient ce qui permet de rouvrir une session interrompue au bon endroit
-- — fermer l'onglet ne remet plus l'élève au début.
-- La session transverse (« À revoir aujourd'hui », tous cours confondus)
-- n'ouvrait AUCUNE ligne, faute de `course_id` à y mettre : c'est justement la
-- session la plus longue, donc la plus exposée à l'interruption. La colonne
-- devient facultative pour qu'elle existe, elle aussi.
ALTER TABLE public.carnet_review_sessions
  ALTER COLUMN course_id DROP NOT NULL;

ALTER TABLE public.carnet_review_sessions
  ADD COLUMN IF NOT EXISTS queue JSONB;
ALTER TABLE public.carnet_review_sessions
  ADD COLUMN IF NOT EXISTS cursor_index INTEGER NOT NULL DEFAULT 0;
ALTER TABLE public.carnet_review_sessions
  ADD COLUMN IF NOT EXISTS correct_count INTEGER NOT NULL DEFAULT 0;
-- Les réglages choisis dans la feuille « Comment tu veux réviser ? » (portée,
-- sens, types, longueur, mode) : les rouvrir, c'est reprendre LA MÊME session.
ALTER TABLE public.carnet_review_sessions
  ADD COLUMN IF NOT EXISTS options JSONB;

-- Retrouver « la session en cours » d'un élève sans balayer tout l'historique.
CREATE INDEX IF NOT EXISTS carnet_review_sessions_ouvertes_idx
  ON public.carnet_review_sessions (user_id, started_at DESC)
  WHERE ended_at IS NULL;
