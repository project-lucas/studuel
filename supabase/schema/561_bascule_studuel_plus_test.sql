-- =============================================================================
-- 561 — LA BASCULE STUDUEL+ D'UN COMPTE COACH (13/10/2026)
--
-- Lucas : « potierlucas77 doit pouvoir switcher de Studuel normal à Studuel+,
-- de compte user à mon compte coach, et à l'interface parent (seule
-- exception) ». Un seul compte, trois casquettes : l'app élève (son profil
-- est un profil comme un autre), l'espace parents (qui ne refuse que les
-- comptes 'eleve') et l'espace coach (`est_coach()`, 560). Il ne manquait
-- que la bascule de l'abonnement, jusqu'ici réservée à l'admin
-- (`grant_subscription`, 221).
--
-- `basculer_studuel_plus_test()` : un compte COACH ou ADMIN bascule SON
-- PROPRE abonnement entre gratuit et Studuel+ (tier1), sans échéance, et la
-- bascule est journalisée dans `subscription_grants` (source 'test'). Personne
-- d'autre ne peut l'appeler ; elle ne touche jamais un autre compte.
--
-- PRÉREQUIS : 221 (subscription_grants), 560 (est_coach). Idempotente.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.basculer_studuel_plus_test()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid     UUID := auth.uid();
  v_tier    TEXT;
  v_nouveau TEXT;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'connexion_requise'; END IF;
  IF NOT public.est_coach() THEN RAISE EXCEPTION 'coach_requis'; END IF;

  SELECT subscription_tier INTO v_tier FROM public.profiles WHERE id = v_uid;
  -- Pas de liste de paliers recopiée (garde-miroir) : gratuit ↔ le premier
  -- palier payant, tout autre palier payant retombe sur gratuit.
  v_nouveau := CASE WHEN COALESCE(v_tier, 'free') = 'free' THEN 'tier1' ELSE 'free' END;

  UPDATE public.profiles SET subscription_tier = v_nouveau WHERE id = v_uid;
  INSERT INTO public.subscription_grants (user_id, tier, expires_at, source, reference, granted_by)
  VALUES (v_uid, v_nouveau, NULL, 'test', 'bascule du compte coach', v_uid);

  RETURN v_nouveau;
END;
$$;
REVOKE ALL ON FUNCTION public.basculer_studuel_plus_test() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.basculer_studuel_plus_test() TO authenticated;
