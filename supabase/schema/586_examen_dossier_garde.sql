-- =============================================================================
-- Studuel — Migration 586 : LE DOSSIER D'ORAL, RÉSERVÉ À STUDUEL+ JUSQU'EN BASE
--
-- La relecture du 16/10/2026 sur la 585 : les fonctions `examen_oral_*`
-- étaient ouvertes à tout élève connecté ; seules les Server Actions
-- vérifiaient l'abonnement — un élève gratuit pouvait écrire son dossier en
-- appelant la fonction lui-même. Et `examen_oral_passage` cochait l'étape
-- « oral blanc » dès que l'élève finissait sa PRÉPARATION, avant même l'oral :
-- fermer la conversation suffisait à rendre la pièce « prête ».
--
-- CE QU'ELLE CHANGE :
--   1. ajouter, ajouter une liste, modifier, cocher une étape et compter un
--      passage exigent Studuel+ (`rente_abonne`, 580). Retirer une pièce reste
--      possible à tous : un ancien abonné peut ranger son dossier.
--   2. `examen_oral_passage` compte le passage SANS cocher l'étape : c'est
--      l'élève qui la coche, une fois l'oral passé.
--
-- PRÉREQUIS : 580 (rente_abonne), 585. Idempotent.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.examen_oral_ajouter(p_genre TEXT, p_titre TEXT, p_detail TEXT, p_matiere TEXT)
RETURNS UUID
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user  UUID := auth.uid();
  v_titre TEXT := left(NULLIF(btrim(COALESCE(p_titre, '')), ''), 200);
  v_det   TEXT := left(NULLIF(btrim(COALESCE(p_detail, '')), ''), 200);
  v_mat   TEXT := CASE WHEN p_matiere ~ '^[a-z0-9-]{1,40}$' THEN p_matiere END;
  v_n     INTEGER;
  v_id    UUID;
BEGIN
  IF v_user IS NULL OR v_titre IS NULL OR public.examen_oral_plafond(p_genre) = 0 THEN RETURN NULL; END IF;
  IF NOT public.rente_abonne(v_user) THEN RETURN NULL; END IF;
  PERFORM pg_advisory_xact_lock(hashtext('examen_oral:' || v_user::text));
  SELECT count(*) INTO v_n FROM public.examen_oral WHERE user_id = v_user AND genre = p_genre;
  IF v_n >= public.examen_oral_plafond(p_genre) THEN RETURN NULL; END IF;
  INSERT INTO public.examen_oral (user_id, genre, titre, detail, matiere, ordre)
  VALUES (v_user, p_genre, v_titre, v_det, v_mat, v_n + 1)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;
REVOKE ALL ON FUNCTION public.examen_oral_ajouter(TEXT, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.examen_oral_ajouter(TEXT, TEXT, TEXT, TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.examen_oral_ajouter_liste(p_textes JSONB)
RETURNS INTEGER
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user  UUID := auth.uid();
  v_n     INTEGER;
  v_ajout INTEGER := 0;
  v_e     JSONB;
  v_titre TEXT;
BEGIN
  IF v_user IS NULL OR p_textes IS NULL OR jsonb_typeof(p_textes) <> 'array' THEN RETURN 0; END IF;
  IF NOT public.rente_abonne(v_user) THEN RETURN 0; END IF;
  PERFORM pg_advisory_xact_lock(hashtext('examen_oral:' || v_user::text));
  SELECT count(*) INTO v_n FROM public.examen_oral WHERE user_id = v_user AND genre = 'texte';
  FOR v_e IN SELECT value FROM jsonb_array_elements(p_textes) LOOP
    EXIT WHEN v_n >= 30;
    CONTINUE WHEN jsonb_typeof(v_e) <> 'object';
    v_titre := left(NULLIF(btrim(COALESCE(v_e ->> 'titre', '')), ''), 200);
    CONTINUE WHEN v_titre IS NULL;
    CONTINUE WHEN EXISTS (SELECT 1 FROM public.examen_oral
                           WHERE user_id = v_user AND genre = 'texte' AND lower(titre) = lower(v_titre));
    v_n := v_n + 1;
    INSERT INTO public.examen_oral (user_id, genre, titre, detail, matiere, ordre)
    VALUES (v_user, 'texte', v_titre, left(NULLIF(btrim(COALESCE(v_e ->> 'detail', '')), ''), 200), 'francais', v_n);
    v_ajout := v_ajout + 1;
  END LOOP;
  RETURN v_ajout;
END;
$$;
REVOKE ALL ON FUNCTION public.examen_oral_ajouter_liste(JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.examen_oral_ajouter_liste(JSONB) TO authenticated;

CREATE OR REPLACE FUNCTION public.examen_oral_modifier(p_id UUID, p_titre TEXT, p_detail TEXT, p_matiere TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_titre TEXT := left(NULLIF(btrim(COALESCE(p_titre, '')), ''), 200);
BEGIN
  IF auth.uid() IS NULL OR v_titre IS NULL OR NOT public.rente_abonne(auth.uid()) THEN RETURN false; END IF;
  UPDATE public.examen_oral
     SET titre = v_titre,
         detail = left(NULLIF(btrim(COALESCE(p_detail, '')), ''), 200),
         matiere = CASE WHEN p_matiere ~ '^[a-z0-9-]{1,40}$' THEN p_matiere END
   WHERE id = p_id AND user_id = auth.uid();
  RETURN FOUND;
END;
$$;
REVOKE ALL ON FUNCTION public.examen_oral_modifier(UUID, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.examen_oral_modifier(UUID, TEXT, TEXT, TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.examen_oral_etape(p_id UUID, p_etape TEXT, p_fait BOOLEAN)
RETURNS BOOLEAN
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR p_etape IS NULL OR NOT public.rente_abonne(auth.uid()) THEN RETURN false; END IF;
  UPDATE public.examen_oral
     SET etapes = etapes || jsonb_build_object(p_etape, COALESCE(p_fait, false))
   WHERE id = p_id AND user_id = auth.uid()
     AND p_etape = ANY (public.examen_oral_etapes(genre));
  RETURN FOUND;
END;
$$;
REVOKE ALL ON FUNCTION public.examen_oral_etape(UUID, TEXT, BOOLEAN) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.examen_oral_etape(UUID, TEXT, BOOLEAN) TO authenticated;

-- Un oral blanc commencé : un passage de plus. L'étape « oral blanc » n'est
-- PLUS cochée ici — l'élève la coche une fois l'oral passé.
CREATE OR REPLACE FUNCTION public.examen_oral_passage(p_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_n INTEGER;
BEGIN
  IF auth.uid() IS NULL OR NOT public.rente_abonne(auth.uid()) THEN RETURN NULL; END IF;
  UPDATE public.examen_oral
     SET passages = LEAST(passages + 1, 999)
   WHERE id = p_id AND user_id = auth.uid()
  RETURNING passages INTO v_n;
  RETURN v_n;
END;
$$;
REVOKE ALL ON FUNCTION public.examen_oral_passage(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.examen_oral_passage(UUID) TO authenticated;
