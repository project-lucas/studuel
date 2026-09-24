-- =============================================================================
-- Studuel — Migration 380 : LE MULTIPLICATEUR DE GAINS D'XP (24/09/2026)
--
-- Lucas : un multiplicateur BIEN RÉEL, affiché à côté de la barre de niveau —
-- pas un bonus versé plus tard, mais chaque gain d'XP multiplié au moment où
-- il tombe.
--
-- LA RÈGLE (miroir TS à tenir dans le code de l'app) :
--   • ×1,0 sans ami ; +0,1 par ami ACCEPTÉ, 10 amis au plus → ×2,0 ;
--     un ami lié dans les deux sens compte une fois, une demande en attente
--     ne compte pas ;
--   • la POTION D'XP (le Boost XP du Marché, `user_wallet.double_xp_jusqua`,
--     368 / 370 / 373) DOUBLE le tout : 3 amis + potion → ×2,6, au plus ×4,0 ;
--   • le montant multiplié par les amis est ARRONDI à l'entier le plus proche
--     (la moitié vers le haut : 5 XP avec un ami → 6), puis doublé par la
--     potion : 20 XP avec 3 amis → 26, et 52 sous potion.
--
-- COMMENT. `xp_avec_bonus` (368) est le point de passage de TOUTE l'XP versée
-- — `wallet_award_xp` (leçons, cartes, couronnes) et `wallet_grant_xp`
-- (quêtes, clan, coffre d'équipe…) l'appellent AVANT d'écrire la trace
-- `xp_events`. Elle est seule redéfinie ici ; `wallet_grant_xp` et
-- `wallet_award_xp` ne changent pas, et la trace dit toujours ce qui a été
-- VRAIMENT versé.
--
-- CONSÉQUENCES, voulues :
--   • l'XP de LIGUE (`ligue_xp_semaine`, 376/379) et les POINTS DU COFFRE
--     d'équipe (`ligue_coffre`, 379) sont des sommes d'`xp_events` : ils
--     profitent aussi du multiplicateur — mes amis me font monter plus vite
--     dans la ligue, et remplissent mon coffre deux fois (leur XP, et la
--     mienne multipliée) ;
--   • l'XP RENDUE par un coffre d'équipe passe aussi par le multiplicateur
--     (un coffre niveau 3 ouvert avec 3 amis verse 450 × 1,3 = 585 XP) :
--     plus d'amis, coffre plus riche. Elle reste hors ligue et hors coffre
--     (source « coffre_equipe », exclue par la 379) ;
--   • les rivaux IA de la ligue ne sont pas multipliés ;
--   • un écran qui annonce un gain FIXE (« +5 XP ») doit lire le montant
--     rendu par le serveur (`awarded`) ou appliquer le multiplicateur que
--     rend `multiplicateur_xp()` : sinon il affiche moins que ce qui tombe.
--
-- `multiplicateur_xp()` : une lecture légère pour le bandeau (le « ×1,3 » à
-- côté de la barre de niveau), qui rend le multiplicateur que le serveur
-- applique vraiment : { amis, potion, potion_jusqua, multiplicateur }.
--
-- PRÉREQUIS : 368 (xp_avec_bonus, user_wallet.double_xp_jusqua), 379 (coffre
-- d'équipe ; à exécuter APRÈS la 379), 019 (friendships), 374 (index
-- friendships_addressee_idx : le compte d'amis lit les deux sens par index).
-- Idempotent. À exécuter à la main dans : Supabase Dashboard → SQL Editor →
-- New query → Run.
-- =============================================================================

-- ─────────────────────────────────────────── 1. le nombre d'amis qui comptent

-- Les amis ACCEPTÉS, distincts (un lien dans les deux sens compte une fois),
-- 10 au plus. Deux lectures par index — la clé primaire (requester_id, …) et
-- friendships_addressee_idx (374) — plutôt qu'un OR qui les empêcherait.
CREATE OR REPLACE FUNCTION public.xp_amis_comptes(p_user UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT LEAST(10, count(*))::INTEGER
    FROM (
      SELECT f.addressee_id AS ami
        FROM public.friendships f
       WHERE f.requester_id = p_user AND f.status = 'accepted'
      UNION
      SELECT f.requester_id
        FROM public.friendships f
       WHERE f.addressee_id = p_user AND f.status = 'accepted'
    ) a
   WHERE p_user IS NOT NULL;
$$;

-- ───────────────────────────────────────────── 2. le multiplicateur appliqué

-- Le montant d'XP à verser : ×(1 + 0,1 par ami, 10 au plus), arrondi, puis
-- doublé tant que la potion court (même test que la 368). Un montant nul ou
-- négatif passe tel quel.
CREATE OR REPLACE FUNCTION public.xp_avec_bonus(p_user UUID, p_montant INTEGER)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN COALESCE(p_montant, 0) <= 0 THEN COALESCE(p_montant, 0)
    ELSE
      round(p_montant::numeric * (10 + public.xp_amis_comptes(p_user)) / 10)::INTEGER
      * CASE WHEN EXISTS (
               SELECT 1 FROM public.user_wallet w
                WHERE w.user_id = p_user
                  AND w.double_xp_jusqua IS NOT NULL
                  AND now() < w.double_xp_jusqua
             ) THEN 2 ELSE 1 END
  END;
$$;

-- ─────────────────────────────────────────── 3. ce que le bandeau affiche

-- Le multiplicateur de l'élève connecté, tel que `xp_avec_bonus` l'applique :
-- ses amis qui comptent, la potion (et sa fin), et le facteur (1,0 → 4,0, au
-- dixième). NULL pour un visiteur.
CREATE OR REPLACE FUNCTION public.multiplicateur_xp()
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user   UUID := auth.uid();
  v_amis   INTEGER;
  v_jusqua TIMESTAMPTZ;
  v_potion BOOLEAN;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;
  v_amis := public.xp_amis_comptes(v_user);
  SELECT w.double_xp_jusqua INTO v_jusqua
    FROM public.user_wallet w
   WHERE w.user_id = v_user;
  v_potion := v_jusqua IS NOT NULL AND now() < v_jusqua;
  RETURN jsonb_build_object(
    'amis', v_amis,
    'potion', v_potion,
    'potion_jusqua', CASE WHEN v_potion THEN v_jusqua END,
    'multiplicateur', round((10 + v_amis) / 10.0 * CASE WHEN v_potion THEN 2 ELSE 1 END, 1));
END;
$$;

-- ─────────────────────────────────────────────────────────────── 4. droits

-- Internes : seules les fonctions SECURITY DEFINER qui versent l'XP les
-- appellent (avec les droits du propriétaire).
REVOKE ALL ON FUNCTION public.xp_amis_comptes(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.xp_avec_bonus(UUID, INTEGER) FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.multiplicateur_xp() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.multiplicateur_xp() TO authenticated;

-- Vérifications (facultatives) :
--   SELECT public.xp_amis_comptes('<élève>'), public.xp_avec_bonus('<élève>', 20);
--   -- en tant qu'élève connecté : SELECT public.multiplicateur_xp();
