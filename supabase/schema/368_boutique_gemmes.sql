-- =============================================================================
-- Studuel — Migration 368 : LA BOUTIQUE EN GEMMES — des boosts qui font
-- vraiment quelque chose, et six objets de profil payés en gemmes.
--
-- ─────────────────────────────────────────────────────────── LE CONSTAT
-- La boutique vendait un « gel de série » et un « double XP » (lib/tresor.ts,
-- ids `freeze` et `double`, achetés par `buy_shop_item`, 088) que RIEN ne
-- lisait : l'élève payait, et il ne se passait rien. Les écus quittent la
-- boutique ; tout s'y paie désormais en GEMMES (`profiles.gems`, CHECK >= 0,
-- jamais modifiable par le client — 183).
--
-- ─────────────────────────────────────────────── CE QUE FAIT CETTE MIGRATION
--
-- 1. L'ÉTAT DES BOOSTS, dans le portefeuille (`user_wallet`, 192) :
--      double_xp_jusqua          — l'XP compte double jusqu'à cet instant ;
--      gemmes_x2_debut / _fin    — le week-end des gemmes ×2 (heure de Paris) ;
--      gels_serie                — la réserve de gels, 0 à 2 ;
--      jours_geles               — les jours que des gels ont pontés.
--
-- 2. LE CATALOGUE `boutique_offres` (prix AUTORITATIF, miroir de
--    lib/boutique/offres.ts — un test vérifie l'alignement) et le journal
--    `boutique_achats` (où sont parties les gemmes : la seule trace d'un débit).
--
-- 3. DEUX RPC D'ACHAT, sur le modèle de `unlock_chapter_with_gem` (192) :
--    verrou d'abord, prix lu EN BASE, refus motivé, débit atomique.
--      acheter_offre(id)         → 'inconnue' | 'deja_actif' | 'plein' | 'pas_assez'
--      acheter_objet_profil(id)  → 'inconnu'  | 'deja'       | 'pas_assez'
--    Elles rendent {"ok": true, "gemmes": <solde>} ou {"ok": false, "raison": …}.
--
-- 4. LES EFFETS — des copies CREATE OR REPLACE de la DERNIÈRE version de chaque
--    fonction, où seules les lignes marquées « 368 » changent :
--      wallet_touch                 (348) gel de série + palier de 7 j ×2
--      wallet_award_xp              (348) double XP + gel + gemmes de palier ×2
--      wallet_grant_xp              (209) double XP + gemmes de niveau ×2
--      wallet_award_gems            (348) gemmes ×2
--      wallet_award_chapter_crowns  (348) rend l'XP RÉELLEMENT versée
--      current_streak               (317) la série compte les gels
--
--    NE SONT PAS DOUBLÉES : les gemmes de parrainage (activate_referral), les
--    dotations d'admin, et les récompenses à barème fixe réclamées à part
--    (quêtes, clan, saison, Traque) — leur XP, elle, passe par wallet_grant_xp
--    et profite donc du double XP.
--
-- 5. SIX OBJETS DE PROFIL EN GEMMES : `avatar_items.prix_gemmes`, posé sur
--    trois bannières de profil (200), une tenue et deux accessoires (189/240).
--
-- ⚠️ CORRECTIF DE SÉCURITÉ AU PASSAGE. `wallet_grant_xp` (209) n'était fermé
-- que par `REVOKE … FROM PUBLIC` — ce qui, sur Supabase, ne retire RIEN (cf.
-- 324) : n'importe quel élève pouvait s'appeler `wallet_grant_xp(son_id,
-- 'quests', NULL, 1000000)` et encaisser l'XP ET les gemmes de passage de
-- niveau qui vont avec. Maintenant que les gemmes achètent la boutique, cette
-- porte est fermée ici, nommément.
--
-- LE CODE TOLÈRE SON ABSENCE : sans elle, la vitrine s'affiche sans boost
-- actif, les achats répondent « la boutique ouvre bientôt », et la flamme
-- compte comme avant.
--
-- PRÉREQUIS : 183 (profiles.gems), 189 (avatar_items, user_avatar_items),
-- 192 (user_wallet, wallet_ensure, wallet_level_from_xp, xp_events,
-- gem_events), 200 (bannières de profil), 209 (wallet_grant_xp), 240
-- (vestiaire Open Peeps), 317 (current_streak), 348 (wallet_touch,
-- wallet_award_xp, wallet_award_gems, wallet_award_chapter_crowns).
-- Idempotente : ADD COLUMN IF NOT EXISTS, CREATE … IF NOT EXISTS, DROP/ADD de
-- contrainte, CREATE OR REPLACE, seeds en ON CONFLICT.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- ─────────────────────────────────────── 1. l'état des boosts, au portefeuille

ALTER TABLE public.user_wallet
  ADD COLUMN IF NOT EXISTS double_xp_jusqua TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS gemmes_x2_debut  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS gemmes_x2_fin    TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS gels_serie       SMALLINT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS jours_geles      DATE[]   NOT NULL DEFAULT '{}';

-- La réserve : deux gels au plus (miroir de MAX_GELS_SERIE, lib/streak.ts).
ALTER TABLE public.user_wallet DROP CONSTRAINT IF EXISTS user_wallet_gels_serie_borne;
ALTER TABLE public.user_wallet ADD CONSTRAINT user_wallet_gels_serie_borne
  CHECK (gels_serie BETWEEN 0 AND 2);

-- Une fenêtre de gemmes ×2 a un début avant sa fin.
ALTER TABLE public.user_wallet DROP CONSTRAINT IF EXISTS user_wallet_gemmes_x2_fenetre;
ALTER TABLE public.user_wallet ADD CONSTRAINT user_wallet_gemmes_x2_fenetre
  CHECK (gemmes_x2_debut IS NULL OR gemmes_x2_fin IS NULL OR gemmes_x2_debut < gemmes_x2_fin);

-- Rien à changer côté droits : la policy « user_wallet_select_own » (192) laisse
-- l'élève LIRE sa ligne, colonnes neuves comprises ; aucune écriture n'est
-- accordée au client — seules les fonctions definer ci-dessous écrivent.

-- ─────────────────────────────────────────── 2. le catalogue et le journal

CREATE TABLE IF NOT EXISTS public.boutique_offres (
  id          TEXT PRIMARY KEY,
  kind        TEXT    NOT NULL CHECK (kind IN ('double_xp', 'gel_serie', 'gemmes_x2')),
  prix_gemmes INTEGER NOT NULL CHECK (prix_gemmes >= 0),
  -- Heures pour double_xp, nombre de gels pour gel_serie, 0 pour gemmes_x2.
  valeur      INTEGER NOT NULL DEFAULT 0 CHECK (valeur >= 0)
);

ALTER TABLE public.boutique_offres ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "boutique_offres_lisible" ON public.boutique_offres;
CREATE POLICY "boutique_offres_lisible" ON public.boutique_offres
  FOR SELECT TO anon, authenticated USING (true);

REVOKE INSERT, UPDATE, DELETE ON public.boutique_offres FROM anon, authenticated;
GRANT SELECT ON public.boutique_offres TO anon, authenticated;

-- Prix PROVISOIRES — miroir de OFFRES (lib/boutique/offres.ts). Changer un prix,
-- c'est changer LES DEUX : la vitrine affiche l'un, la RPC débite l'autre.
INSERT INTO public.boutique_offres (id, kind, prix_gemmes, valeur) VALUES
  ('double-xp-24h',     'double_xp',  80, 24),
  ('double-xp-3j',      'double_xp', 180, 72),
  ('gel-serie',         'gel_serie',  60,  1),
  ('gel-serie-x2',      'gel_serie', 110,  2),
  ('gemmes-x2-weekend', 'gemmes_x2', 150,  0)
ON CONFLICT (id) DO UPDATE SET
  kind        = EXCLUDED.kind,
  prix_gemmes = EXCLUDED.prix_gemmes,
  valeur      = EXCLUDED.valeur;

-- Le journal des achats en gemmes : la seule trace de ce qu'un débit a payé.
CREATE TABLE IF NOT EXISTS public.boutique_achats (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id     UUID    NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  nature      TEXT    NOT NULL CHECK (nature IN ('offre', 'objet')),
  -- id de boutique_offres (nature 'offre') ou d'avatar_items (nature 'objet').
  article     TEXT    NOT NULL,
  prix_gemmes INTEGER NOT NULL CHECK (prix_gemmes >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS boutique_achats_user_idx
  ON public.boutique_achats (user_id, created_at DESC);

ALTER TABLE public.boutique_achats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "boutique_achats_select_own" ON public.boutique_achats;
CREATE POLICY "boutique_achats_select_own" ON public.boutique_achats
  FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));

REVOKE INSERT, UPDATE, DELETE ON public.boutique_achats FROM anon, authenticated;
GRANT SELECT ON public.boutique_achats TO authenticated;

-- ─────────────────────────────────────── 3. les trois règles, en un endroit

-- Le montant d'XP à verser, doublé tant que le double XP court.
CREATE OR REPLACE FUNCTION public.xp_avec_bonus(p_user UUID, p_montant INTEGER)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN COALESCE(p_montant, 0) <= 0 THEN COALESCE(p_montant, 0)
    WHEN EXISTS (
      SELECT 1 FROM public.user_wallet w
       WHERE w.user_id = p_user
         AND w.double_xp_jusqua IS NOT NULL
         AND now() < w.double_xp_jusqua
    ) THEN p_montant * 2
    ELSE p_montant
  END;
$$;

REVOKE ALL ON FUNCTION public.xp_avec_bonus(UUID, INTEGER) FROM PUBLIC, anon, authenticated;

-- Le montant de gemmes DE JEU à verser, doublé pendant le week-end réservé.
-- À n'appeler QUE sur des gemmes gagnées en jouant : jamais sur un parrainage
-- ni sur une dotation d'admin.
CREATE OR REPLACE FUNCTION public.gemmes_avec_bonus(p_user UUID, p_montant INTEGER)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN COALESCE(p_montant, 0) <= 0 THEN COALESCE(p_montant, 0)
    WHEN EXISTS (
      SELECT 1 FROM public.user_wallet w
       WHERE w.user_id = p_user
         AND w.gemmes_x2_debut IS NOT NULL
         AND w.gemmes_x2_fin IS NOT NULL
         AND now() >= w.gemmes_x2_debut
         AND now() <  w.gemmes_x2_fin
    ) THEN p_montant * 2
    ELSE p_montant
  END;
$$;

REVOKE ALL ON FUNCTION public.gemmes_avec_bonus(UUID, INTEGER) FROM PUBLIC, anon, authenticated;

-- LE GEL DE SÉRIE. L'élève revient le jour `p_today` ; s'il a manqué N jours
-- (1 ≤ N ≤ sa réserve), N gels sont consommés, les jours manqués inscrits dans
-- `jours_geles`, et `last_activity_date` passe à HIER : la règle de série
-- d'origine (« lendemain → +1 ») s'applique alors telle quelle, sans être
-- réécrite. Un jour gelé PONTE la série, il ne la fait pas monter (Duolingo).
-- Trou plus grand que la réserve : rien n'est consommé, la série repart à 1
-- comme avant, et les gels restent pour la prochaine fois.
-- Rend TRUE si des gels ont été consommés (l'appelant relit alors sa ligne).
-- Interne : appelée par wallet_touch et wallet_award_xp, qui tiennent déjà le
-- verrou de la ligne.
CREATE OR REPLACE FUNCTION public.serie_appliquer_gels(p_user UUID, p_today DATE)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_wallet  public.user_wallet%ROWTYPE;
  v_manques INTEGER;
BEGIN
  IF p_user IS NULL OR p_today IS NULL THEN RETURN FALSE; END IF;

  SELECT * INTO v_wallet FROM public.user_wallet WHERE user_id = p_user FOR UPDATE;
  IF NOT FOUND OR v_wallet.last_activity_date IS NULL OR v_wallet.streak_days <= 0 THEN
    RETURN FALSE;
  END IF;

  v_manques := p_today - v_wallet.last_activity_date - 1;
  IF v_manques < 1 OR v_manques > v_wallet.gels_serie THEN
    RETURN FALSE;
  END IF;

  UPDATE public.user_wallet
     SET gels_serie = gels_serie - v_manques,
         -- Les jours pontés, dédoublonnés, bornés à 400 jours (miroir
         -- d'activityCutoff, lib/streak.ts) : au-delà, la flamme ne remonte pas.
         jours_geles = ARRAY(
           SELECT DISTINCT j
             FROM unnest(
                    jours_geles
                    || ARRAY(SELECT v_wallet.last_activity_date + i
                               FROM generate_series(1, v_manques) AS i)
                  ) AS j
            WHERE j >= p_today - 400
            ORDER BY j),
         last_activity_date = p_today - 1,
         updated_at = now()
   WHERE user_id = p_user;

  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.serie_appliquer_gels(UUID, DATE) FROM PUBLIC, anon, authenticated;

-- ─────────────────────────────────────────────────── 4. acheter une offre

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
  IF v_offre.kind = 'gemmes_x2' AND v_wallet.gemmes_x2_fin > now() THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'deja_actif');
  END IF;
  -- La réserve de gels ne déborde jamais (deux au plus).
  IF v_offre.kind = 'gel_serie' AND v_wallet.gels_serie + v_offre.valeur > 2 THEN
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
  ELSIF v_offre.kind = 'gel_serie' THEN
    UPDATE public.user_wallet
       SET gels_serie = gels_serie + v_offre.valeur,
           updated_at = now()
     WHERE user_id = v_user;
  ELSE
    -- Le week-end DE L'ÉLÈVE : samedi 0 h → lundi 0 h, heure de Paris.
    -- Acheté en semaine → le week-end qui vient ; un samedi ou un dimanche →
    -- celui en cours. Miroir de fenetreWeekend (lib/boutique/offres.ts).
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

-- ─────────────────────────────────────────── 5. acheter un objet de profil

ALTER TABLE public.avatar_items
  ADD COLUMN IF NOT EXISTS prix_gemmes INTEGER CHECK (prix_gemmes >= 0);

CREATE OR REPLACE FUNCTION public.acheter_objet_profil(p_item_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_prix INTEGER;
  v_gems INTEGER;
BEGIN
  IF v_user IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'anonyme');
  END IF;

  -- Le prix est LU EN BASE : un objet sans prix en gemmes n'est pas en vente.
  SELECT prix_gemmes INTO v_prix
    FROM public.avatar_items
   WHERE id = p_item_id AND prix_gemmes IS NOT NULL;
  IF v_prix IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'inconnu');
  END IF;

  -- Le verrou vient avant toute vérification (cf. 183 : TOCTOU).
  SELECT gems INTO v_gems FROM public.profiles WHERE id = v_user FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'anonyme');
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.user_avatar_items
     WHERE user_id = v_user AND item_id = p_item_id
  ) THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'deja');
  END IF;

  IF COALESCE(v_gems, 0) < v_prix THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'pas_assez');
  END IF;

  INSERT INTO public.user_avatar_items (user_id, item_id)
  VALUES (v_user, p_item_id)
  ON CONFLICT (user_id, item_id) DO NOTHING;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'raison', 'deja');
  END IF;

  UPDATE public.profiles
     SET gems = gems - v_prix
   WHERE id = v_user
  RETURNING gems INTO v_gems;

  INSERT INTO public.boutique_achats (user_id, nature, article, prix_gemmes)
  VALUES (v_user, 'objet', p_item_id, v_prix);

  RETURN jsonb_build_object('ok', true, 'gemmes', v_gems);
END;
$$;

REVOKE ALL ON FUNCTION public.acheter_objet_profil(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.acheter_objet_profil(TEXT) TO authenticated;

-- ─────────────────────────────────────────────── 6. les effets, fonction par fonction

-- 6a. wallet_touch — copie de la 348. Changements : le gel de série (appel à
--     serie_appliquer_gels juste après le verrou) et le palier de 7 jours
--     doublé pendant le week-end des gemmes ×2.
CREATE OR REPLACE FUNCTION public.wallet_touch()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := auth.uid();
  v_today  DATE := (now() AT TIME ZONE 'utc')::date;
  v_wallet public.user_wallet%ROWTYPE;
  v_new_streak INTEGER;
  v_gems INTEGER := 0;
  v_palier INTEGER;                                     -- 368
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;

  PERFORM public.wallet_ensure(v_user);
  SELECT * INTO v_wallet FROM public.user_wallet WHERE user_id = v_user FOR UPDATE;

  -- 368 · GEL DE SÉRIE : un trou couvert par la réserve est ponté (la dernière
  -- activité passe à hier), la règle ci-dessous voit alors un lendemain.
  IF public.serie_appliquer_gels(v_user, v_today) THEN
    SELECT * INTO v_wallet FROM public.user_wallet WHERE user_id = v_user;
  END IF;

  IF v_wallet.last_activity_date = v_today THEN
    v_new_streak := v_wallet.streak_days;
  ELSIF v_wallet.last_activity_date = v_today - 1 THEN
    v_new_streak := v_wallet.streak_days + 1;
  ELSE
    v_new_streak := 1;
  END IF;

  IF v_new_streak <> v_wallet.streak_days AND v_new_streak % 7 = 0 THEN
    -- 368 · GEMMES ×2 : le palier de série est une gemme gagnée en jouant.
    v_palier := public.gemmes_avec_bonus(v_user, 20);
    INSERT INTO public.gem_events (user_id, source, source_key, amount)
    VALUES (v_user, 'streak_7', v_today::text, v_palier)
    ON CONFLICT DO NOTHING;
    IF FOUND THEN v_gems := v_gems + v_palier; END IF;
  END IF;

  UPDATE public.user_wallet
     SET streak_days = v_new_streak,
         last_activity_date = v_today,
         updated_at = now()
   WHERE user_id = v_user;

  IF v_gems > 0 THEN
    UPDATE public.profiles SET gems = gems + v_gems WHERE id = v_user;
  END IF;

  RETURN jsonb_build_object(
    'awarded', 0,
    'xp', v_wallet.xp,
    'level', v_wallet.level,
    'level_up', false,
    'streak_days', v_new_streak,
    'gems_gained', v_gems);
END;
$$;

-- 6b. wallet_award_xp — copie de la 348. Changements : le montant doublé
--     pendant le double XP (AVANT la trace, pour que xp_events dise ce qui a
--     été versé), le gel de série avant la règle de série, et les gemmes de
--     palier (+20) et de niveau (+15) doublées pendant le week-end ×2.
CREATE OR REPLACE FUNCTION public.wallet_award_xp(
  p_source TEXT,
  p_key    TEXT DEFAULT NULL,
  p_amount INTEGER DEFAULT NULL   -- ignoré : gardé pour ne pas casser l'appel
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := auth.uid();
  v_amount INTEGER;
  v_key    TEXT := NULLIF(LEFT(COALESCE(p_key, ''), 80), '');
  v_today  DATE := (now() AT TIME ZONE 'utc')::date;
  v_wallet public.user_wallet%ROWTYPE;
  v_new_streak INTEGER;
  v_new_level  INTEGER;
  v_gems INTEGER := 0;
  v_lvl  INTEGER;
  v_palier INTEGER;                                     -- 368
  v_niveau INTEGER;                                     -- 368
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;

  -- LA CLÉ EST OBLIGATOIRE. Sans elle, l'index d'unicité ne s'applique pas et
  -- l'acquisition redeviendrait répétable — c'est-à-dire exactement ce que
  -- cette migration supprime.
  IF v_key IS NULL THEN RETURN NULL; END IF;

  v_amount := CASE p_source
    WHEN 'lecon'     THEN 5
    WHEN 'carte'     THEN 5
    WHEN 'couronne1' THEN 30
    WHEN 'couronne2' THEN 40
    WHEN 'couronne3' THEN 60
    ELSE NULL
  END;

  -- Source historique (ou inconnue) : on ne verse rien, mais on ne fait pas
  -- échouer l'appelant — un vieux client déployé doit continuer de tourner.
  IF v_amount IS NULL THEN
    PERFORM public.wallet_ensure(v_user);
    SELECT * INTO v_wallet FROM public.user_wallet WHERE user_id = v_user;
    RETURN jsonb_build_object(
      'awarded', 0, 'xp', v_wallet.xp, 'level', v_wallet.level,
      'level_up', false, 'streak_days', v_wallet.streak_days, 'gems_gained', 0);
  END IF;

  PERFORM public.wallet_ensure(v_user);
  SELECT * INTO v_wallet FROM public.user_wallet WHERE user_id = v_user FOR UPDATE;

  -- 368 · DOUBLE XP : le barème ci-dessus, doublé tant que le boost court.
  v_amount := public.xp_avec_bonus(v_user, v_amount);

  INSERT INTO public.xp_events (user_id, source, source_key, amount)
  VALUES (v_user, p_source, v_key, v_amount)
  ON CONFLICT DO NOTHING;
  IF NOT FOUND THEN
    -- Déjà payé : c'est le cas NORMAL d'une relecture ou d'un chapitre
    -- re-maîtrisé, pas une erreur.
    RETURN jsonb_build_object(
      'awarded', 0, 'xp', v_wallet.xp, 'level', v_wallet.level,
      'level_up', false, 'streak_days', v_wallet.streak_days, 'gems_gained', 0);
  END IF;

  -- 368 · GEL DE SÉRIE : comme dans wallet_touch, avant la règle de série.
  IF public.serie_appliquer_gels(v_user, v_today) THEN
    SELECT * INTO v_wallet FROM public.user_wallet WHERE user_id = v_user;
  END IF;

  -- La série avance aussi ici : acquérir, c'est être actif.
  IF v_wallet.last_activity_date = v_today THEN
    v_new_streak := v_wallet.streak_days;
  ELSIF v_wallet.last_activity_date = v_today - 1 THEN
    v_new_streak := v_wallet.streak_days + 1;
  ELSE
    v_new_streak := 1;
  END IF;

  IF v_new_streak <> v_wallet.streak_days AND v_new_streak % 7 = 0 THEN
    v_palier := public.gemmes_avec_bonus(v_user, 20);   -- 368 · gemmes ×2
    INSERT INTO public.gem_events (user_id, source, source_key, amount)
    VALUES (v_user, 'streak_7', v_today::text, v_palier)
    ON CONFLICT DO NOTHING;
    IF FOUND THEN v_gems := v_gems + v_palier; END IF;
  END IF;

  v_new_level := public.wallet_level_from_xp(v_wallet.xp + v_amount);
  IF v_new_level > v_wallet.level THEN
    v_niveau := public.gemmes_avec_bonus(v_user, 15);   -- 368 · gemmes ×2
    FOR v_lvl IN (v_wallet.level + 1) .. v_new_level LOOP
      INSERT INTO public.gem_events (user_id, source, source_key, amount)
      VALUES (v_user, 'level_up', v_lvl::text, v_niveau)
      ON CONFLICT DO NOTHING;
      IF FOUND THEN v_gems := v_gems + v_niveau; END IF;
    END LOOP;
  END IF;

  UPDATE public.user_wallet
     SET xp = xp + v_amount,
         level = GREATEST(level, v_new_level),
         streak_days = v_new_streak,
         last_activity_date = v_today,
         updated_at = now()
   WHERE user_id = v_user;

  IF v_gems > 0 THEN
    UPDATE public.profiles SET gems = gems + v_gems WHERE id = v_user;
  END IF;

  RETURN jsonb_build_object(
    'awarded', v_amount,
    'xp', v_wallet.xp + v_amount,
    'level', GREATEST(v_wallet.level, v_new_level),
    'level_up', v_new_level > v_wallet.level,
    'streak_days', v_new_streak,
    'gems_gained', v_gems);
END;
$$;

-- 6c. wallet_grant_xp — copie de la 209 (primitive des quêtes et du clan).
--     Changements : le montant doublé pendant le double XP, les gemmes de
--     niveau doublées pendant le week-end ×2, et la porte FERMÉE aux rôles de
--     l'API (voir l'en-tête : REVOKE … FROM PUBLIC seul ne fermait rien).
CREATE OR REPLACE FUNCTION public.wallet_grant_xp(
  p_user   UUID,
  p_source TEXT,
  p_key    TEXT,
  p_amount INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_wallet    public.user_wallet%ROWTYPE;
  v_new_level INTEGER;
  v_gems      INTEGER := 0;
  v_lvl       INTEGER;
  v_amount    INTEGER;                                  -- 368
  v_niveau    INTEGER;                                  -- 368
BEGIN
  IF p_user IS NULL OR COALESCE(p_amount, 0) <= 0 THEN RETURN; END IF;

  PERFORM public.wallet_ensure(p_user);
  SELECT * INTO v_wallet FROM public.user_wallet
   WHERE user_id = p_user FOR UPDATE;

  -- 368 · DOUBLE XP : le montant de l'appelant, doublé tant que le boost court.
  v_amount := public.xp_avec_bonus(p_user, p_amount);

  -- Trace (idempotente si clé, via xp_events_once_per_key) : déjà versé → stop.
  INSERT INTO public.xp_events (user_id, source, source_key, amount)
  VALUES (p_user, p_source, NULLIF(LEFT(COALESCE(p_key, ''), 80), ''), v_amount)
  ON CONFLICT DO NOTHING;
  IF NOT FOUND THEN RETURN; END IF;

  -- Niveau : +15 💎 par niveau franchi, chacun une seule fois (même règle que
  -- wallet_award_xp — l'élève ne doit pas voir deux barèmes de passage).
  v_new_level := public.wallet_level_from_xp(v_wallet.xp + v_amount);
  IF v_new_level > v_wallet.level THEN
    v_niveau := public.gemmes_avec_bonus(p_user, 15);   -- 368 · gemmes ×2
    FOR v_lvl IN (v_wallet.level + 1) .. v_new_level LOOP
      INSERT INTO public.gem_events (user_id, source, source_key, amount)
      VALUES (p_user, 'level_up', v_lvl::text, v_niveau)
      ON CONFLICT DO NOTHING;
      IF FOUND THEN v_gems := v_gems + v_niveau; END IF;
    END LOOP;
  END IF;

  UPDATE public.user_wallet
     SET xp = xp + v_amount,
         level = GREATEST(level, v_new_level),
         updated_at = now()
   WHERE user_id = p_user;

  IF v_gems > 0 THEN
    UPDATE public.profiles SET gems = COALESCE(gems, 0) + v_gems
     WHERE id = p_user;
  END IF;
END;
$$;

-- 368 · la fermeture que la 209 croyait faire. Les appelants (quest_claim,
-- clan_week_claim) sont SECURITY DEFINER : ils l'exécutent avec les droits du
-- propriétaire, ce REVOKE ne les touche pas.
REVOKE ALL ON FUNCTION public.wallet_grant_xp(UUID, TEXT, TEXT, INTEGER)
  FROM PUBLIC, anon, authenticated;

-- 6d. wallet_award_gems — copie de la 348. Seul changement : le montant, fixé
--     par la branche de sa source, est doublé pendant le week-end ×2 AVANT la
--     trace (gem_events dit ce qui a été versé, et la fonction le rend).
CREATE OR REPLACE FUNCTION public.wallet_award_gems(p_source TEXT, p_key TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user    UUID := auth.uid();
  v_key     TEXT := NULLIF(LEFT(COALESCE(p_key, ''), 80), '');
  v_today   DATE := (now() AT TIME ZONE 'utc')::date;
  v_chapter UUID;
  v_best    NUMERIC;
  v_amount  INTEGER;
BEGIN
  IF v_user IS NULL OR v_key IS NULL THEN RETURN 0; END IF;

  IF p_source = 'chapter_crowns' THEN
    SELECT l.chapter_id INTO v_chapter
      FROM public.quizzes q
      JOIN public.lessons l ON l.id = q.lesson_id
     WHERE q.id = v_key::uuid;
    IF v_chapter IS NULL THEN RETURN 0; END IF;

    SELECT MAX(t.score::numeric / t.total) INTO v_best
      FROM public.test_sessions t
      JOIN public.quizzes q ON q.id = t.quiz_id
      JOIN public.lessons l ON l.id = q.lesson_id
     WHERE t.user_id = v_user AND t.total > 0 AND l.chapter_id = v_chapter;
    IF COALESCE(v_best, 0) < 0.8 THEN RETURN 0; END IF;

    v_key := v_chapter::text;
    v_amount := 30;

  ELSIF p_source = 'defi_win' THEN
    -- LA FUITE. La clé valait « leçon:jour » : une victoire payée PAR LEÇON et
    -- par jour, soit ~250 versements quotidiens possibles pour un élève de 4e,
    -- quand un chapitre coûte 30 gemmes. Elle vaut désormais LE JOUR : une
    -- victoire payée par jour, toutes leçons confondues. La clé fournie par
    -- l'appelant est ignorée — c'est le serveur qui décide de la granularité.
    v_key := v_today::text;
    v_amount := 10;

  ELSIF p_source = 'achievement' THEN
    -- Les hauts faits (lib/hauts-faits.ts) : le montant vit dans le catalogue
    -- pur côté app, mais le SERVEUR ne fait confiance qu'à sa propre table.
    SELECT montant INTO v_amount FROM public.gem_achievements WHERE id = v_key;
    IF v_amount IS NULL THEN RETURN 0; END IF;

  ELSIF p_source = 'filon' THEN
    -- La trouvaille hebdomadaire, façon Gem Box : la clé est la SEMAINE ISO,
    -- donc un seul filon par semaine, quoi qu'il arrive.
    v_key := to_char(v_today, 'IYYY-"W"IW');
    v_amount := 25;

  ELSE
    RETURN 0;
  END IF;

  -- 368 · GEMMES ×2 : toutes ces sources sont du jeu (jamais un parrainage).
  v_amount := public.gemmes_avec_bonus(v_user, v_amount);

  INSERT INTO public.gem_events (user_id, source, source_key, amount)
  VALUES (v_user, p_source, v_key, v_amount)
  ON CONFLICT DO NOTHING;
  IF NOT FOUND THEN RETURN 0; END IF;

  UPDATE public.profiles SET gems = gems + v_amount WHERE id = v_user;
  RETURN v_amount;
EXCEPTION WHEN invalid_text_representation THEN
  RETURN 0;
END;
$$;

-- 6e. wallet_award_chapter_crowns — copie de la 348. Seul changement : la
--     somme rendue est celle que wallet_award_xp a RÉELLEMENT versée (son
--     `awarded`), et non plus le barème du palier — sous double XP, le barème
--     annoncerait la moitié de ce que le portefeuille a reçu.
CREATE OR REPLACE FUNCTION public.wallet_award_chapter_crowns(p_chapter UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user     UUID := auth.uid();
  v_best     NUMERIC;
  v_lesson   BOOLEAN;
  v_value    NUMERIC;
  v_crowns   INTEGER;
  v_total    INTEGER := 0;
  v_palier   INTEGER;
  v_source   TEXT;
  v_verse    INTEGER;                                   -- 368
BEGIN
  IF v_user IS NULL OR p_chapter IS NULL THEN RETURN 0; END IF;

  SELECT MAX(t.score::numeric / t.total) INTO v_best
    FROM public.test_sessions t
    JOIN public.quizzes q ON q.id = t.quiz_id
    JOIN public.lessons l ON l.id = q.lesson_id
   WHERE t.user_id = v_user AND t.total > 0 AND l.chapter_id = p_chapter;

  SELECT EXISTS (
    SELECT 1 FROM public.lesson_completions lc
      JOIN public.lessons l ON l.id = lc.lesson_id
     WHERE lc.user_id = v_user AND l.chapter_id = p_chapter
  ) INTO v_lesson;

  v_value := GREATEST(COALESCE(v_best, 0), CASE WHEN v_lesson THEN 0.30 ELSE 0 END);
  v_crowns := (CASE WHEN v_value >= 0.30 THEN 1 ELSE 0 END)
            + (CASE WHEN v_value >= 0.60 THEN 1 ELSE 0 END)
            + (CASE WHEN v_value >= 0.80 THEN 1 ELSE 0 END);
  IF v_crowns = 0 THEN RETURN 0; END IF;

  FOR v_palier IN 1 .. v_crowns LOOP
    v_source := 'couronne' || v_palier;
    -- 368 · ce qui a été versé, pas ce que le barème promettait.
    v_verse := COALESCE(
      (public.wallet_award_xp(v_source, p_chapter::text || ':' || v_palier) ->> 'awarded')::int,
      0);
    IF v_verse > 0 THEN
      v_total := v_total + v_verse;
    END IF;
  END LOOP;

  RETURN v_total;
END;
$$;

-- 6f. current_streak — la série de la 317 (bandeau du haut via my_streak,
--     séries d'amis, déblocages du vestiaire et des badges), qui compte
--     désormais les gels. MÊME RÈGLE que computeStreak (lib/streak.ts) :
--       · même définition d'un jour actif (les cinq sources de la 317) ;
--       · un jour gelé (jours_geles) ponte la série sans la faire monter ;
--       · aujourd'hui sans activité est pardonné (clémence) ; le trou qui court
--         au-delà peut être couvert par les gels EN RÉSERVE, qui attendent que
--         l'élève revienne pour être consommés ;
--       · un trou plus ancien, lui, a déjà été tranché par wallet_touch.
--     Réécrite en plpgsql : la réserve est un compteur qui décroît en marchant,
--     ce qu'une CTE récursive dit mal.
CREATE OR REPLACE FUNCTION public.current_streak(p_user UUID)
RETURNS INTEGER
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_today  DATE := (now() AT TIME ZONE 'UTC')::date;
  v_actifs DATE[];
  v_geles  DATE[];
  v_gels   INTEGER;
  v_jour   DATE;
  v_serie  INTEGER := 0;
BEGIN
  IF p_user IS NULL THEN RETURN 0; END IF;

  -- Les jours actifs : les cinq sources de la 317, sur la même borne de
  -- 400 jours (miroir d'activityCutoff, lib/streak.ts).
  SELECT COALESCE(array_agg(DISTINCT ((a.created_at AT TIME ZONE 'UTC')::date)), '{}')
    INTO v_actifs
    FROM (
      SELECT created_at FROM public.test_sessions
        WHERE user_id = p_user AND created_at >= now() - INTERVAL '400 days'
      UNION ALL
      SELECT created_at FROM public.study_sessions
        WHERE user_id = p_user AND created_at >= now() - INTERVAL '400 days'
      UNION ALL
      SELECT created_at FROM public.lesson_completions
        WHERE user_id = p_user AND created_at >= now() - INTERVAL '400 days'
      UNION ALL
      SELECT created_at FROM public.challenge_sessions
        WHERE user_id = p_user AND created_at >= now() - INTERVAL '400 days'
      UNION ALL
      SELECT started_at AS created_at FROM public.carnet_review_sessions
        WHERE user_id = p_user AND started_at >= now() - INTERVAL '400 days'
    ) a;

  SELECT w.jours_geles, w.gels_serie INTO v_geles, v_gels
    FROM public.user_wallet w
   WHERE w.user_id = p_user;
  v_geles := COALESCE(v_geles, '{}');
  v_gels := LEAST(2, GREATEST(0, COALESCE(v_gels, 0)));

  v_jour := v_today;
  IF NOT (v_jour = ANY (v_actifs)) THEN
    v_jour := v_today - 1;
    WHILE NOT (v_jour = ANY (v_actifs)) LOOP
      IF v_jour = ANY (v_geles) THEN
        v_jour := v_jour - 1;
      ELSIF v_gels > 0 THEN
        v_gels := v_gels - 1;
        v_jour := v_jour - 1;
      ELSE
        RETURN 0;
      END IF;
    END LOOP;
  END IF;

  WHILE v_jour = ANY (v_actifs) OR v_jour = ANY (v_geles) LOOP
    IF v_jour = ANY (v_actifs) THEN
      v_serie := v_serie + 1;
    END IF;
    v_jour := v_jour - 1;
  END LOOP;

  RETURN v_serie;
END;
$$;

-- ───────────────────────────────────── 7. les six objets de profil en gemmes

-- Prix PROVISOIRES (100 à 400), posés sur des objets que le vestiaire sait
-- déjà rendre et équiper. Le prix en écus (`price`) n'est pas touché : le
-- vestiaire (/moi/avatar) continue de les vendre en écus tant qu'on n'a pas
-- décidé du contraire. Une ligne absente (200 pas passée) est simplement
-- ignorée par l'UPDATE.
-- LES SIX OBJETS
UPDATE public.avatar_items AS i
   SET prix_gemmes = v.prix
  FROM (VALUES
    ('banner-couronne-royale', 400),
    ('banner-dragon-savoir',   350),
    ('banner-vitrail',         250),
    ('equip-casque',           200),
    ('tenue-blazer',           150),
    ('equip-lunettes',         120)
  ) AS v(id, prix)
 WHERE i.id = v.id;
-- FIN DES SIX OBJETS

-- =============================================================================
-- VÉRIFIER — connecté en élève (remplacer l'UUID), dans une transaction qu'on
-- annule. Chaque ligne dit ce qu'on doit lire.
-- =============================================================================
-- BEGIN;
--   SET LOCAL ROLE authenticated;
--   SET LOCAL request.jwt.claims = '{"sub":"COLLE-ICI-UN-UUID-ELEVE","role":"authenticated"}';
--   SELECT public.acheter_offre('gel-serie');           -- {"ok": true, "gemmes": solde - 60}
--   SELECT public.acheter_offre('gel-serie-x2');        -- {"ok": false, "raison": "plein"}
--   SELECT public.acheter_offre('double-xp-24h');       -- {"ok": true, …}
--   SELECT public.acheter_offre('double-xp-3j');        -- {"ok": false, "raison": "deja_actif"}
--   SELECT public.acheter_offre('nimporte');            -- {"ok": false, "raison": "inconnue"}
--   SELECT public.acheter_objet_profil('equip-casque'); -- ok, puis "deja" au second appel
--   SELECT double_xp_jusqua, gemmes_x2_debut, gemmes_x2_fin, gels_serie, jours_geles
--     FROM public.user_wallet;                          -- sa ligne, boosts posés
--   SELECT public.wallet_grant_xp(auth.uid(), 'quests', NULL, 1000);
--                                                       -- ERREUR : permission denied
-- ROLLBACK;
--
-- Les droits EFFECTIFS (les trois helpers internes doivent être à false) :
-- SELECT p.proname,
--        has_function_privilege('anon',          p.oid, 'EXECUTE') AS anon_peut,
--        has_function_privilege('authenticated', p.oid, 'EXECUTE') AS eleve_peut
--   FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
--  WHERE n.nspname = 'public'
--    AND p.proname IN ('xp_avec_bonus', 'gemmes_avec_bonus', 'serie_appliquer_gels',
--                      'wallet_grant_xp', 'acheter_offre', 'acheter_objet_profil')
--  ORDER BY 1;
