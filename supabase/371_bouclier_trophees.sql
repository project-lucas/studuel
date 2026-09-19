-- =============================================================================
-- 371 — LE BOUCLIER DE TROPHÉES remplace le boost « Trophées ×2 » au Marché
--
-- Lucas, 18/09/2026 : « à la place, le boost du multiplicateur de trophées sera
-- un bouclier qui protégera la perte de trophées une fois ». Un consommable,
-- pas une durée : le bouclier attend en réserve, et la PROCHAINE défaite qui
-- aurait coûté des trophées n'en coûte aucun — le bouclier est alors consommé.
--
--   · Réserve d'UN bouclier à la fois (`user_wallet.boucliers_trophees`, 0..1) :
--     on en rachète un une fois le précédent consommé.
--   · Consommé par apply_game_trophies, CÔTÉ SERVEUR, au moment du verdict :
--     le client n'annonce que victoire ou défaite, il ne peut ni poser ni
--     garder un bouclier.
--   · Jamais gaspillé : une défaite qui ne coûte rien (bande 0, ou compteur à
--     0) ne le consomme pas.
--   · Duel classé comme jeux de salon (même RPC, même compteur).
--
-- Le boost « Trophées ×2 » de la 370 n'est plus en vente (lib/boutique/offres.ts
-- ne le liste plus). Ses colonnes et sa règle restent : un boost déjà acheté
-- vaut jusqu'à sa fin.
--
-- Dépend de 238 (apply_game_trophies), 368 (user_wallet, boutique_offres,
-- acheter_offre) et 370 (trophees_x2_jusqua). Idempotente : ADD COLUMN IF NOT
-- EXISTS, DROP/ADD de contrainte, seeds en ON CONFLICT, CREATE OR REPLACE.
-- À exécuter à la main APRÈS la 370 : Supabase Dashboard → SQL Editor → Run.
-- ⚠️ Ne pas REJOUER la 370 après celle-ci : la 370 repose sa liste de types
-- d'offre, qui ignore le bouclier, et échouerait sur la ligne du bouclier.
-- Si c'est fait par mégarde, rejouer la 371 remet tout d'aplomb.
-- =============================================================================

-- ─────────────────────────────────────── 1. la réserve de boucliers

ALTER TABLE public.user_wallet
  ADD COLUMN IF NOT EXISTS boucliers_trophees SMALLINT NOT NULL DEFAULT 0;

-- Un bouclier à la fois (miroir de MAX_BOUCLIERS, lib/boutique/offres.ts).
ALTER TABLE public.user_wallet DROP CONSTRAINT IF EXISTS user_wallet_boucliers_borne;
ALTER TABLE public.user_wallet ADD CONSTRAINT user_wallet_boucliers_borne
  CHECK (boucliers_trophees BETWEEN 0 AND 1);

-- Rien à changer côté droits : la policy « user_wallet_select_own » (192)
-- laisse l'élève LIRE sa ligne ; seules les fonctions definer écrivent.

-- ─────────────────────────────────────── 2. le catalogue

ALTER TABLE public.boutique_offres DROP CONSTRAINT IF EXISTS boutique_offres_kind_check;
ALTER TABLE public.boutique_offres ADD CONSTRAINT boutique_offres_kind_check
  CHECK (kind IN ('double_xp', 'gel_serie', 'gemmes_x2', 'trophees_x2', 'bouclier_trophees'));

-- Prix PROVISOIRE — miroir de OFFRES (lib/boutique/offres.ts). `valeur` : le
-- nombre de boucliers ajoutés à la réserve.
INSERT INTO public.boutique_offres (id, kind, prix_gemmes, valeur) VALUES
  ('bouclier-trophees', 'bouclier_trophees', 25, 1)
ON CONFLICT (id) DO UPDATE SET
  kind        = EXCLUDED.kind,
  prix_gemmes = EXCLUDED.prix_gemmes,
  valeur      = EXCLUDED.valeur;

-- ─────────────────────────────────────── 3. acheter une offre

-- La 370, plus le bouclier : la réserve ne déborde jamais (`plein`).
CREATE OR REPLACE FUNCTION public.acheter_offre(p_offre TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := auth.uid();
  v_offre  public.boutique_offres%ROWTYPE;
  v_wallet public.user_wallet%ROWTYPE;
  v_gems   INTEGER;
  v_jour   DATE;
  v_samedi DATE;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'anonyme');
  END IF;

  SELECT * INTO v_offre FROM public.boutique_offres WHERE id = p_offre;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'inconnue');
  END IF;

  -- Sans profil, pas de portefeuille possible (clé étrangère de user_wallet).
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = v_user) THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'anonyme');
  END IF;

  -- LES VERROUS D'ABORD (TOCTOU, cf. 183), et dans l'ordre des fonctions du
  -- portefeuille — le portefeuille, PUIS le profil — pour ne jamais croiser
  -- un wallet_award_xp du même élève en interblocage.
  PERFORM public.wallet_ensure(v_user);
  SELECT * INTO v_wallet FROM public.user_wallet WHERE user_id = v_user FOR UPDATE;
  SELECT gems INTO v_gems FROM public.profiles WHERE id = v_user FOR UPDATE;

  -- Un boost à durée qui court ne se rachète pas (miroir d'etatOffre).
  IF v_offre.kind = 'double_xp' AND v_wallet.double_xp_jusqua > now() THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'deja_actif');
  END IF;
  IF v_offre.kind = 'trophees_x2' AND v_wallet.trophees_x2_jusqua > now() THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'deja_actif');
  END IF;
  IF v_offre.kind = 'gemmes_x2' AND v_wallet.gemmes_x2_fin > now() THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'deja_actif');
  END IF;
  -- Les réserves ne débordent jamais : deux gels, un bouclier.
  IF v_offre.kind = 'gel_serie' AND v_wallet.gels_serie + v_offre.valeur > 2 THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'plein');
  END IF;
  IF v_offre.kind = 'bouclier_trophees'
     AND v_wallet.boucliers_trophees + v_offre.valeur > 1 THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'plein');
  END IF;

  IF COALESCE(v_gems, 0) < v_offre.prix_gemmes THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'pas_assez');
  END IF;

  UPDATE public.profiles
     SET gems = gems - v_offre.prix_gemmes
   WHERE id = v_user
  RETURNING gems INTO v_gems;

  IF v_offre.kind = 'double_xp' THEN
    UPDATE public.user_wallet
       SET double_xp_jusqua = now() + make_interval(hours => v_offre.valeur),
           updated_at = now()
     WHERE user_id = v_user;
  ELSIF v_offre.kind = 'bouclier_trophees' THEN
    UPDATE public.user_wallet
       SET boucliers_trophees = boucliers_trophees + v_offre.valeur,
           updated_at = now()
     WHERE user_id = v_user;
  ELSIF v_offre.kind = 'trophees_x2' THEN
    UPDATE public.user_wallet
       SET trophees_x2_jusqua = now() + make_interval(hours => v_offre.valeur),
           updated_at = now()
     WHERE user_id = v_user;
  ELSIF v_offre.kind = 'gel_serie' THEN
    UPDATE public.user_wallet
       SET gels_serie = gels_serie + v_offre.valeur,
           updated_at = now()
     WHERE user_id = v_user;
  ELSIF v_offre.kind = 'gemmes_x2' THEN
    -- Le week-end DE L'ÉLÈVE : samedi 0 h → lundi 0 h, heure de Paris (368).
    v_jour := (now() AT TIME ZONE 'Europe/Paris')::date;
    v_samedi := v_jour + (6 - EXTRACT(ISODOW FROM v_jour)::int);
    UPDATE public.user_wallet
       SET gemmes_x2_debut = (v_samedi::timestamp) AT TIME ZONE 'Europe/Paris',
           gemmes_x2_fin   = ((v_samedi + 2)::timestamp) AT TIME ZONE 'Europe/Paris',
           updated_at = now()
     WHERE user_id = v_user;
  END IF;

  INSERT INTO public.boutique_achats (user_id, nature, article, prix_gemmes)
  VALUES (v_user, 'offre', v_offre.id, v_offre.prix_gemmes);

  RETURN jsonb_build_object('ok', true, 'gemmes', v_gems);
END;
$$;

REVOKE ALL ON FUNCTION public.acheter_offre(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.acheter_offre(TEXT) TO authenticated;

-- ─────────────────────────────────────── 4. les trophées d'une partie

-- La 370 à l'identique, plus LE BOUCLIER : une défaite qui aurait coûté des
-- trophées n'en coûte aucun si l'élève a un bouclier en réserve, et le
-- bouclier est consommé. Le portefeuille est verrouillé (FOR UPDATE) : deux
-- défaites simultanées ne consomment pas le même bouclier. Ordre des verrous :
-- game_trophies, puis user_wallet, puis profiles — aucune autre fonction ne
-- les prend en sens inverse. La réponse dit si le bouclier a joué
-- (`bouclier`) et ce qu'il en reste (`boucliersRestants`).
CREATE OR REPLACE FUNCTION public.apply_game_trophies(
  p_subject_slug TEXT,
  p_game_id TEXT,
  p_won     BOOLEAN,
  p_score   INTEGER DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := auth.uid();
  v_before INTEGER;
  v_best   INTEGER;
  v_band   INTEGER;
  v_win    INTEGER;
  v_loss   INTEGER;
  v_delta  INTEGER;
  v_after  INTEGER;
  v_total  INTEGER;
  v_peak   INTEGER;
  v_subject_total INTEGER;
  v_subject_peak  INTEGER;
  v_season TEXT;
  v_boost  BOOLEAN := false;
  v_bouclier  BOOLEAN := false;
  v_boucliers SMALLINT;
  -- Saison courante, meme cle que lib/saison.seasonKey ('YYYY-MM', UTC).
  v_now_season CONSTANT TEXT := to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM');
  -- Largeur d'une bande, miroir de BAND_SPAN (lib/trophy-road.ts).
  v_band_span CONSTANT INTEGER := 100;
  -- Index de la derniere bande (0-based) : 9 bandes, la 9e est ouverte.
  v_last_band CONSTANT INTEGER := 8;
  -- Plancher protege a la bascule de saison, miroir de SEASON_KEEP_FLOOR.
  v_season_floor CONSTANT INTEGER := 500;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;

  -- Couple inconnu du catalogue : on refuse (garde-fou anti-farming, 238).
  IF NOT EXISTS (
    SELECT 1 FROM public.game_catalog
     WHERE subject_slug = p_subject_slug AND game_id = p_game_id
  ) THEN
    RETURN NULL;
  END IF;

  -- Borne de rythme : 60 parties classees par heure glissante (238).
  IF (SELECT count(*) FROM public.game_matches
        WHERE user_id = v_user
          AND created_at >= now() - INTERVAL '1 hour') >= 60 THEN
    RETURN NULL;
  END IF;

  -- Cree la ligne au premier match sur ce jeu, et la verrouille.
  INSERT INTO public.game_trophies (user_id, subject_slug, game_id)
  VALUES (v_user, p_subject_slug, p_game_id)
  ON CONFLICT (user_id, subject_slug, game_id) DO NOTHING;

  SELECT trophies, best, season INTO v_before, v_best, v_season
    FROM public.game_trophies
   WHERE user_id = v_user AND subject_slug = p_subject_slug AND game_id = p_game_id
     FOR UPDATE;

  -- BASCULE DE SAISON, en paresseux (238). MIROIR de lib/trophy-road.seasonReset.
  IF v_season IS DISTINCT FROM v_now_season THEN
    IF v_before > v_season_floor THEN
      v_before := v_season_floor + ((v_before - v_season_floor) / 2);
    END IF;
    UPDATE public.game_trophies
       SET trophies = v_before, season = v_now_season
     WHERE user_id = v_user AND subject_slug = p_subject_slug AND game_id = p_game_id;
  END IF;

  -- La bande du compteur, plafonnee sur la derniere (ouverte vers le haut).
  v_band := LEAST(v_last_band, v_before / v_band_span);
  -- Miroir de TROPHY_BANDS : gain 10..2 (decroissant), perte 0..8 (croissant).
  v_win  := 10 - v_band;
  v_loss := v_band;

  IF p_won THEN
    -- Le boost trophees ×2 (370), s'il en reste un qui court.
    SELECT trophees_x2_jusqua > now() INTO v_boost
      FROM public.user_wallet WHERE user_id = v_user;
    v_boost := COALESCE(v_boost, false);
    v_delta := CASE WHEN v_boost THEN v_win * 2 ELSE v_win END;
  ELSE
    v_delta := -LEAST(v_loss, v_before);
    -- LE BOUCLIER (371) : seulement si la defaite COUTE quelque chose — une
    -- defaite a 0 trophee perdu ne le gaspille pas.
    IF v_delta < 0 THEN
      SELECT boucliers_trophees INTO v_boucliers
        FROM public.user_wallet WHERE user_id = v_user
         FOR UPDATE;
      IF COALESCE(v_boucliers, 0) > 0 THEN
        UPDATE public.user_wallet
           SET boucliers_trophees = boucliers_trophees - 1,
               updated_at = now()
         WHERE user_id = v_user;
        v_boucliers := v_boucliers - 1;
        v_bouclier := true;
        v_delta := 0;
      END IF;
    END IF;
  END IF;

  v_after := GREATEST(0, v_before + v_delta);
  -- Delta REEL apres ecretage : l'ecran de fin annonce le mouvement observe du
  -- compteur, pas le bareme theorique.
  v_delta := v_after - v_before;
  v_best  := GREATEST(v_best, v_after);

  UPDATE public.game_trophies
     SET trophies = v_after, best = v_best, season = v_now_season,
         updated_at = now()
   WHERE user_id = v_user AND subject_slug = p_subject_slug AND game_id = p_game_id;

  INSERT INTO public.game_matches
    (user_id, subject_slug, game_id, won, delta, trophies, score)
  VALUES (v_user, p_subject_slug, p_game_id, p_won, v_delta, v_after, p_score);

  -- Le total de la MATIERE, et son pic (238).
  SELECT COALESCE(sum(trophies), 0) INTO v_subject_total
    FROM public.game_trophies
   WHERE user_id = v_user AND subject_slug = p_subject_slug;

  INSERT INTO public.subject_peaks (user_id, subject_slug, peak)
  VALUES (v_user, p_subject_slug, v_subject_total)
  ON CONFLICT (user_id, subject_slug) DO UPDATE
    SET peak = GREATEST(public.subject_peaks.peak, EXCLUDED.peak),
        updated_at = now()
  RETURNING peak INTO v_subject_peak;

  -- Le global est la SOMME, recopiee dans profiles (238).
  SELECT COALESCE(sum(trophies), 0) INTO v_total
    FROM public.game_trophies WHERE user_id = v_user;

  UPDATE public.profiles
     SET trophies = v_total,
         best_trophies = GREATEST(best_trophies, v_total)
   WHERE id = v_user
  RETURNING best_trophies INTO v_peak;

  RETURN jsonb_build_object(
    'before',  v_before,
    'after',   v_after,
    'delta',   v_delta,
    'best',    v_best,
    'total',   v_total,
    'peak',    COALESCE(v_peak, v_total),
    'subjectTotal', v_subject_total,
    'subjectPeak',  v_subject_peak,
    'bandWin', v_win,
    'bandLoss', v_loss,
    'boostTrophees', v_boost,
    'bouclier', v_bouclier,
    'boucliersRestants', v_boucliers
  );
END;
$$;

REVOKE ALL ON FUNCTION public.apply_game_trophies(TEXT, TEXT, BOOLEAN, INTEGER)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.apply_game_trophies(TEXT, TEXT, BOOLEAN, INTEGER)
  TO authenticated;
