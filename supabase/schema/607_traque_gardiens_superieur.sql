-- =============================================================================
-- Studuel — Migration 607 : LES GARDIENS DU SUPÉRIEUR ENTRENT DANS LA TRAQUE
-- (03/11/2026)
--
-- Les étudiants (migration 606) ont un gardien par SECTEUR, pas par matière
-- (Lucas) : Thémistor garde le droit, Asclépion la santé (PASS), Dame Psyché
-- la psychologie ; l'économie-gestion garde Krach et STAPS le Coach Turbo.
-- Comme les autres, chacun a UN jour de semaine (règle de la 576) :
-- Thémistor le mardi, Dame Psyché le mercredi, Asclépion le jeudi. Le
-- week-end, tout le monde chasse.
--
-- Seule traque_en_chasse change : même signature, même règle, trois ids de
-- plus. Miroir de lib/traque.CHASSE_BY_WEEKDAY (lib/bosses-mirror.test.ts
-- relit CE bloc : garder la forme CASE v_dow … END ).
--
-- SANS ELLE : la base ne voit les trois gardiens « en chasse » que le
-- week-end ; la semaine, l'app les annonce mais aucun point ne monte.
--
-- Idempotent (CREATE OR REPLACE). Supabase Dashboard → SQL Editor → Run.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.traque_en_chasse(p_boss_id TEXT, p_day DATE)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  -- EXTRACT(isodow) : lundi = 1 … dimanche = 7.
  v_dow INTEGER := EXTRACT(isodow FROM p_day)::int;
BEGIN
  -- Nox, le boss du dimanche : jamais un autre jour.
  IF p_boss_id = 'nox' THEN RETURN v_dow = 7; END IF;
  -- Le week-end, tout le monde est disponible : c'est le rattrapage.
  IF v_dow >= 6 THEN RETURN TRUE; END IF;
  RETURN p_boss_id = ANY (
    CASE v_dow
      WHEN 1 THEN ARRAY['delta', 'imperator', 'nova']                        -- Maths · Latin · Ens. scientifique
      WHEN 2 THEN ARRAY['grammatork', 'plasma', 'fiscus', 'themistor']       -- Français · Physique-Chimie · Gestion · Droit
      WHEN 3 THEN ARRAY['chronos', 'bigben', 'sphinx', 'psyche']             -- Histoire-Géo · Anglais · Philosophie · Psychologie
      WHEN 4 THEN ARRAY['mitochondrix', 'eltoro', 'mecatron', 'asclepion']   -- SVT · Espagnol · Technologie · Santé
      ELSE       ARRAY['kaiser-fang', 'krach', 'coach-turbo', 'bugzilla']     -- Allemand · SES · Sport · NSI
    END
  );
END;
$$;

DO $sonde$
BEGIN
  -- 2026-11-03 est un mardi, 2026-11-07 un samedi.
  IF NOT public.traque_en_chasse('themistor', DATE '2026-11-03') THEN
    RAISE EXCEPTION 'Migration 607 : Thémistor devrait chasser le mardi';
  END IF;
  IF public.traque_en_chasse('asclepion', DATE '2026-11-03') THEN
    RAISE EXCEPTION 'Migration 607 : Asclépion ne chasse pas le mardi';
  END IF;
  IF NOT public.traque_en_chasse('psyche', DATE '2026-11-07') THEN
    RAISE EXCEPTION 'Migration 607 : le week-end, tout le monde chasse';
  END IF;
  RAISE NOTICE 'Migration 607 OK : les trois gardiens du supérieur ont leur jour.';
END $sonde$;
