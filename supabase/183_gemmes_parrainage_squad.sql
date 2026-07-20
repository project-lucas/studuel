-- =============================================================================
-- Studuel — Migration 183 : les gemmes 💎, le parrainage et le squad.
--
-- Trois briques d'une même mécanique : faire venir des amis doit ouvrir du
-- contenu.
--
--   1. GEMMES (profiles.gems) — seconde monnaie, celle du CONTENU. 3 offertes
--      à l'ouverture du compte. Une gemme déverrouille UN chapitre, À VIE :
--      sa carte mentale et les fiches de révision de ses leçons. Elle n'ouvre
--      PAS les quiz ni les flashcards premium — ceux-là restent la contrepartie
--      de l'abonnement (et sont gatés par la RLS de `quiz_questions`).
--      Elles ne s'achètent pas avec des pièces : les pièces (lib/tresor)
--      restent cantonnées au cosmétique, sinon le grind cosmétique achèterait
--      l'offre Studuel+ et la viderait de sa contrepartie.
--
--   2. PARRAINAGE (referrals) — un compte créé avec le code d'un autre crée un
--      lien `pending`. Les DEUX camps touchent 1 gemme, mais SEULEMENT quand le
--      filleul a terminé sa première session de révision (trigger sur
--      test_sessions). Fabriquer un faux compte ne rapporte donc rien tant
--      qu'on n'a pas fait le travail d'un vrai élève. Plafond de 20 gemmes par
--      parrain : sans borne, un script ouvre le catalogue entier.
--
--   3. SQUAD (squad_members) — le cercle intime, distinct des relations.
--      Ajouter quelqu'un crée une RELATION (friendships, migration 019) : elle
--      compte pour le parrainage, les classements, les duels, et on veut qu'il
--      y en ait beaucoup. Le SQUAD est un sous-ensemble choisi à la main,
--      plafonné à 10. Sans cette séparation, accepter un inconnu pour gagner
--      une gemme polluerait le classement entre vrais copains — et les élèves
--      cesseraient d'ajouter, ce qui tuerait précisément le levier viral.
--
-- ⚠️ profiles.gems n'est JAMAIS accordé en UPDATE au client (cf. le REVOKE de
-- la migration 003) : le solde ne bouge que par les fonctions SECURITY DEFINER
-- ci-dessous. Un client qui tenterait `update profiles set gems = 999` se
-- heurte au GRANT colonne, pas seulement à la RLS.
--
-- Miroir applicatif : `lib/gems.ts` (montants, plafond, statuts). Toute
-- évolution des constantes doit toucher LES DEUX.
--
-- PRÉREQUIS : 003 (test_sessions, durcissement profiles), 008 (chapters),
-- 182 (révocation de chapters.mind_map — SANS ELLE le contrôle par gemme est
-- contournable : la carte reste lisible en direct par n'importe qui, anon
-- compris, et la 183 ne le vérifie ni ne le garantit),
-- 019 (friendships, friend_code), 181 (chapter_mind_map). Idempotente.
-- À exécuter à la main : Supabase Dashboard → SQL Editor → Run.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. LE SOLDE DE GEMMES
--
-- DEFAULT 3 couvre les futurs comptes ; l'UPDATE couvre ceux qui existent déjà
-- (ils n'ont jamais eu de gemmes, on ne les lèse pas). Le `WHERE gems IS NULL`
-- rend l'UPDATE rejouable sans re-créditer qui que ce soit.
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS gems INTEGER;

UPDATE public.profiles SET gems = 3 WHERE gems IS NULL;

ALTER TABLE public.profiles ALTER COLUMN gems SET DEFAULT 3;
ALTER TABLE public.profiles ALTER COLUMN gems SET NOT NULL;

-- Un solde négatif est un bug, pas un état : on le rend impossible.
DO $$ BEGIN
  ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_gems_positive CHECK (gems >= 0);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Compteur de gemmes DÉJÀ versées par parrainage, pour appliquer le plafond
-- sans avoir à recompter les filleuls (et sans qu'une suppression de compte
-- filleul « rembourse » des gemmes déjà dépensées).
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referral_gems_earned INTEGER NOT NULL DEFAULT 0;

-- -----------------------------------------------------------------------------
-- 2. CHAPITRES DÉVERROUILLÉS
--
-- Un déverrouillage est DÉFINITIF : l'élève a payé, la ligne reste même s'il
-- s'abonne puis se désabonne. `source` sert aux statistiques (d'où viennent les
-- ouvertures : gemme, cadeau, offre promotionnelle…).
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chapter_unlocks (
  user_id    UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES public.chapters (id) ON DELETE CASCADE,
  source     TEXT NOT NULL DEFAULT 'gem' CHECK (source IN ('gem', 'gift', 'promo')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, chapter_id)
);

CREATE INDEX IF NOT EXISTS chapter_unlocks_user_idx
  ON public.chapter_unlocks (user_id);

ALTER TABLE public.chapter_unlocks ENABLE ROW LEVEL SECURITY;

-- Lecture de ses propres déverrouillages uniquement. Aucune policy d'écriture :
-- seule la RPC `unlock_chapter_with_gem` (definer) insère, ce qui garantit que
-- le débit de la gemme et l'ouverture du chapitre sont indissociables.
DROP POLICY IF EXISTS "chapter_unlocks_select_own" ON public.chapter_unlocks;
CREATE POLICY "chapter_unlocks_select_own" ON public.chapter_unlocks
  FOR SELECT USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 3. DÉPENSER UNE GEMME
--
-- Débit et ouverture dans UNE transaction, avec `FOR UPDATE` sur la ligne de
-- profil : deux appels simultanés (double-clic, deux onglets) ne peuvent pas
-- ouvrir deux chapitres avec une seule gemme.
--
-- Renvoie : 'unlocked' | 'already' | 'premium' | 'no_gems' | 'not_found'.
-- Miroir exact de `UnlockResult` dans lib/gems.ts.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.unlock_chapter_with_gem(p_chapter_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_tier TEXT;
  v_gems INTEGER;
BEGIN
  IF v_user IS NULL THEN RETURN 'not_found'; END IF;

  IF NOT EXISTS (SELECT 1 FROM public.chapters WHERE id = p_chapter_id) THEN
    RETURN 'not_found';
  END IF;

  -- ⚠️ LE VERROU VIENT EN PREMIER, AVANT TOUTE VÉRIFICATION.
  --
  -- Poser le verrou après le test « déjà ouvert » ouvrait une fenêtre TOCTOU :
  -- deux appels visant LE MÊME chapitre (double-clic, deux onglets, deux
  -- appareils) passaient tous deux le test avant que le premier n'ait
  -- committé, débitaient chacun une gemme, et le second voyait son INSERT
  -- absorbé par `ON CONFLICT DO NOTHING` — le chapitre s'ouvrait une fois,
  -- l'élève payait deux fois, sans la moindre erreur affichée.
  --
  -- Le verrou sur la ligne de profil sérialise TOUS les appels du même élève :
  -- le second attend, puis relit un état déjà à jour.
  SELECT subscription_tier, gems INTO v_tier, v_gems
    FROM public.profiles
   WHERE id = v_user
     FOR UPDATE;

  -- Déjà ouvert : on ne débite pas deux fois. Testé APRÈS le verrou.
  IF EXISTS (
    SELECT 1 FROM public.chapter_unlocks
     WHERE user_id = v_user AND chapter_id = p_chapter_id
  ) THEN
    RETURN 'already';
  END IF;

  -- Un abonné a déjà tout : lui faire dépenser une gemme serait du vol.
  IF v_tier IN ('tier1', 'tier2', 'tier3') THEN
    RETURN 'premium';
  END IF;

  IF COALESCE(v_gems, 0) < 1 THEN
    RETURN 'no_gems';
  END IF;

  -- Ceinture ET bretelles : on insère d'abord et on n'accepte de débiter que
  -- si la ligne a réellement été créée. Même si un chemin de concurrence
  -- inattendu franchissait le verrou, `ON CONFLICT DO NOTHING` renverrait zéro
  -- ligne et la gemme ne serait pas prélevée.
  INSERT INTO public.chapter_unlocks (user_id, chapter_id, source)
  VALUES (v_user, p_chapter_id, 'gem')
  ON CONFLICT DO NOTHING;

  IF NOT FOUND THEN
    RETURN 'already';
  END IF;

  UPDATE public.profiles SET gems = gems - 1 WHERE id = v_user;

  RETURN 'unlocked';
END;
$$;

REVOKE ALL ON FUNCTION public.unlock_chapter_with_gem(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.unlock_chapter_with_gem(UUID) TO authenticated;

-- -----------------------------------------------------------------------------
-- 4. LECTURE DE LA CARTE MENTALE — l'abonnement OU la gemme
--
-- Remplace la version de la migration 181, qui n'ouvrait qu'aux abonnés. Même
-- contrat de sortie : NULL dans tous les cas de refus, aucun oracle.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.chapter_mind_map(p_chapter_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_tier TEXT;
  v_map  JSONB;
BEGIN
  IF v_user IS NULL THEN RETURN NULL; END IF;

  SELECT subscription_tier INTO v_tier
    FROM public.profiles
   WHERE id = v_user;

  -- Miroir de lib/subscription.ts (PREMIUM_TIERS) et de lib/gems.ts
  -- (chapterAccess). Deux chemins d'accès, un seul contenu.
  IF COALESCE(v_tier, '') NOT IN ('tier1', 'tier2', 'tier3')
     AND NOT EXISTS (
       SELECT 1 FROM public.chapter_unlocks
        WHERE user_id = v_user AND chapter_id = p_chapter_id
     )
  THEN
    RETURN NULL;
  END IF;

  SELECT mind_map INTO v_map
    FROM public.chapters
   WHERE id = p_chapter_id;

  RETURN v_map;
END;
$$;

REVOKE ALL ON FUNCTION public.chapter_mind_map(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.chapter_mind_map(UUID) TO authenticated;

-- -----------------------------------------------------------------------------
-- 5. PARRAINAGE
--
-- Une ligne par filleul (PK sur referee_id) : on ne peut être parrainé qu'une
-- fois, définitivement. `status` passe de 'pending' à 'activated' quand le
-- filleul termine sa première session — c'est là, et là seulement, que les
-- gemmes tombent.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.referrals (
  referee_id   UUID PRIMARY KEY REFERENCES public.profiles (id) ON DELETE CASCADE,
  referrer_id  UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  status       TEXT NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'activated')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  activated_at TIMESTAMPTZ,
  CHECK (referee_id <> referrer_id)
);

CREATE INDEX IF NOT EXISTS referrals_referrer_idx
  ON public.referrals (referrer_id, status);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Chacun voit les parrainages qui le concernent (comme parrain ou filleul).
-- Aucune policy d'écriture : tout passe par les fonctions definer.
DROP POLICY IF EXISTS "referrals_select_own" ON public.referrals;
CREATE POLICY "referrals_select_own" ON public.referrals
  FOR SELECT USING (auth.uid() IN (referee_id, referrer_id));

-- Fenêtre pendant laquelle un nouveau compte peut déclarer son parrain. Sans
-- elle, un élève installé depuis un an pourrait « se faire parrainer » par un
-- copain pour leur offrir deux gemmes — le parrainage doit récompenser une
-- ARRIVÉE, pas une amitié existante.
CREATE OR REPLACE FUNCTION public.claim_referral(p_code TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user     UUID := auth.uid();
  v_referrer UUID;
  v_created  TIMESTAMPTZ;
BEGIN
  IF v_user IS NULL THEN RETURN 'not_found'; END IF;

  -- Déjà parrainé : c'est définitif.
  IF EXISTS (SELECT 1 FROM public.referrals WHERE referee_id = v_user) THEN
    RETURN 'already';
  END IF;

  SELECT created_at INTO v_created FROM public.profiles WHERE id = v_user;

  -- Profil pas encore créé : le trigger qui le fabrique depuis auth.users n'a
  -- pas fini. On répond 'error' et NON 'too_late' — c'est le seul verdict que
  -- l'app considère comme réessayable, donc le seul qui préserve le cookie du
  -- parrain. Répondre 'too_late' ici perdrait silencieusement le parrainage.
  IF v_created IS NULL THEN RETURN 'error'; END IF;

  IF v_created < now() - INTERVAL '7 days' THEN
    RETURN 'too_late';
  END IF;

  SELECT id INTO v_referrer FROM public.profiles
   WHERE friend_code = upper(trim(p_code));
  IF v_referrer IS NULL THEN RETURN 'not_found'; END IF;
  IF v_referrer = v_user THEN RETURN 'self'; END IF;

  INSERT INTO public.referrals (referee_id, referrer_id)
  VALUES (v_user, v_referrer);

  -- Le parrainage crée aussi une RELATION acceptée : le filleul arrive avec au
  -- moins un ami, ce qui est tout l'intérêt. Il n'entre PAS dans le squad du
  -- parrain — c'est un choix explicite, pas une conséquence de l'invitation.
  -- `ON CONFLICT` ne suffirait pas : la clé primaire est le COUPLE ORDONNÉ
  -- (requester, addressee), donc une amitié déjà enregistrée dans l'autre sens
  -- ne déclencherait aucun conflit et on créerait un doublon miroir. On teste
  -- donc les deux sens explicitement.
  IF NOT EXISTS (
    SELECT 1 FROM public.friendships
     WHERE (requester_id = v_referrer AND addressee_id = v_user)
        OR (requester_id = v_user AND addressee_id = v_referrer)
  ) THEN
    INSERT INTO public.friendships (requester_id, addressee_id, status)
    VALUES (v_referrer, v_user, 'accepted');
  END IF;

  RETURN 'claimed';
END;
$$;

REVOKE ALL ON FUNCTION public.claim_referral(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_referral(TEXT) TO authenticated;

-- Activation : verse 1 gemme de chaque côté, dans la limite du plafond de 20
-- pour le PARRAIN (le filleul, lui, n'est parrainé qu'une fois de toute façon).
-- Le plafond ne bloque pas l'activation, il ne coupe que le versement : le
-- parrain garde le décompte de ses filleuls actifs.
CREATE OR REPLACE FUNCTION public.activate_referral(p_referee UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_referrer UUID;
  v_earned   INTEGER;
BEGIN
  UPDATE public.referrals
     SET status = 'activated', activated_at = now()
   WHERE referee_id = p_referee
     AND status = 'pending'
  RETURNING referrer_id INTO v_referrer;

  IF v_referrer IS NULL THEN RETURN false; END IF;

  -- Le filleul touche sa gemme d'arrivée, sans condition de plafond.
  UPDATE public.profiles SET gems = gems + 1 WHERE id = p_referee;

  -- Le parrain touche la sienne tant qu'il n'a pas atteint REFERRAL_GEM_CAP
  -- (20, miroir de lib/gems.ts).
  SELECT referral_gems_earned INTO v_earned
    FROM public.profiles WHERE id = v_referrer FOR UPDATE;

  IF COALESCE(v_earned, 0) < 20 THEN
    UPDATE public.profiles
       SET gems = gems + 1,
           referral_gems_earned = COALESCE(referral_gems_earned, 0) + 1
     WHERE id = v_referrer;
  END IF;

  RETURN true;
END;
$$;

-- Fonction interne : appelée par le trigger, jamais par le client. Un élève ne
-- doit pas pouvoir déclencher lui-même le versement.
REVOKE ALL ON FUNCTION public.activate_referral(UUID) FROM PUBLIC;

-- Déclencheur : la première session de quiz terminée du filleul active son
-- parrainage. `activate_referral` ne fait rien si le lien est déjà activé ou
-- inexistant, donc le trigger peut se déclencher à chaque session sans risque.
--
-- ⚠️ LE BLOC EXCEPTION N'EST PAS FACULTATIF. Un trigger AFTER INSERT s'exécute
-- dans la transaction de l'INSERT qui l'a déclenché : une exception non
-- interceptée ici annulerait la ligne `test_sessions` elle-même. Or
-- `activate_referral` pose un verrou de ligne (`FOR UPDATE`) sur le profil du
-- PARRAIN — une ligne qu'un autre appelant peut verrouiller au même instant
-- (achat, récompense de duel…), donc un interblocage ou une expiration de
-- verrou est possible. Sans ce bloc, un tel incident ferait perdre à l'élève
-- son score de quiz, son XP, sa série et sa validation d'habitude du jour,
-- pour une raison qui n'a RIEN à voir avec son quiz.
--
-- Le parrainage est une fonctionnalité annexe : elle n'a aucune raison métier
-- d'être synchrone avec l'enregistrement du score. En cas d'échec on l'abandonne
-- silencieusement pour cette session — la suivante réessaiera, puisque le lien
-- reste 'pending'. On journalise en WARNING pour pouvoir distinguer, dans les
-- logs Postgres, un parrainage raté d'un vrai incident réseau.
--
-- (À comparer avec `test_sessions_daily_cap`, migration 017, qui lui RAISE
-- volontairement : ce trigger-là a une raison métier de bloquer l'insertion,
-- l'anti-farming. Celui-ci n'en a aucune.)
CREATE OR REPLACE FUNCTION public.referral_activation_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  BEGIN
    PERFORM public.activate_referral(NEW.user_id);
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'activation du parrainage impossible pour % : %',
      NEW.user_id, SQLERRM;
  END;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS test_sessions_activate_referral ON public.test_sessions;
CREATE TRIGGER test_sessions_activate_referral
  AFTER INSERT ON public.test_sessions
  FOR EACH ROW EXECUTE FUNCTION public.referral_activation_trigger();

-- -----------------------------------------------------------------------------
-- 6. SQUAD — le cercle intime, choisi à la main
--
-- Volontairement UNILATÉRAL et privé : `owner_id` compose SA liste. Ce n'est
-- pas un clan à double consentement (ça existe déjà ailleurs), c'est un filtre
-- personnel sur ses relations — « mes potes », pour un classement qui a du
-- sens. Personne ne sait s'il figure dans le squad d'un autre : rien à refuser,
-- donc rien à blesser.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.squad_members (
  owner_id   UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  member_id  UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (owner_id, member_id),
  CHECK (owner_id <> member_id)
);

ALTER TABLE public.squad_members ENABLE ROW LEVEL SECURITY;

-- On ne voit que SA propre composition (d'où « privé »).
DROP POLICY IF EXISTS "squad_members_select_own" ON public.squad_members;
CREATE POLICY "squad_members_select_own" ON public.squad_members
  FOR SELECT USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "squad_members_delete_own" ON public.squad_members;
CREATE POLICY "squad_members_delete_own" ON public.squad_members
  FOR DELETE USING (auth.uid() = owner_id);
-- Pas de policy INSERT : squad_add (definer) fait respecter le plafond et
-- l'exigence d'amitié acceptée.

-- Ajoute une relation au squad. Renvoie 'added' | 'full' | 'not_friend' |
-- 'already' | 'self'.
CREATE OR REPLACE FUNCTION public.squad_add(p_member UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_size INTEGER;
BEGIN
  IF v_user IS NULL THEN RETURN 'not_friend'; END IF;
  IF p_member = v_user THEN RETURN 'self'; END IF;

  -- Verrou sur MA ligne de profil : il ne protège pas le profil lui-même, il
  -- sert de point de sérialisation pour toutes mes écritures de squad. Sans
  -- lui, deux ajouts concurrents de membres DIFFÉRENTS lisent le même
  -- `count(*)` avant que l'un ait committé, passent tous deux le test du
  -- plafond, et le groupe atteint 11 — la clé primaire (owner, member) ne
  -- protège que du doublon, jamais du dépassement.
  PERFORM 1 FROM public.profiles WHERE id = v_user FOR UPDATE;

  -- On n'entre au squad que par la porte : il faut être déjà une relation.
  IF NOT EXISTS (
    SELECT 1 FROM public.friendships
     WHERE status = 'accepted'
       AND ((requester_id = v_user AND addressee_id = p_member)
         OR (requester_id = p_member AND addressee_id = v_user))
  ) THEN
    RETURN 'not_friend';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.squad_members
     WHERE owner_id = v_user AND member_id = p_member
  ) THEN
    RETURN 'already';
  END IF;

  SELECT count(*) INTO v_size
    FROM public.squad_members WHERE owner_id = v_user;

  -- Plafond à 10 — miroir de MAX_SQUAD_SIZE dans lib/gems.ts.
  IF v_size >= 10 THEN RETURN 'full'; END IF;

  INSERT INTO public.squad_members (owner_id, member_id)
  VALUES (v_user, p_member)
  ON CONFLICT DO NOTHING;

  RETURN 'added';
END;
$$;

REVOKE ALL ON FUNCTION public.squad_add(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.squad_add(UUID) TO authenticated;

-- -----------------------------------------------------------------------------
-- 7. VÉRIFICATIONS MANUELLES (avec la clé anon, hors SQL Editor)
--
--   update profiles set gems = 999      → doit échouer (GRANT colonne)
--   select * from chapter_unlocks       → ne voit que ses propres lignes
--   rpc unlock_chapter_with_gem(<id>)   → 'unlocked' puis 'already'
--   rpc claim_referral('<son code>')    → 'self'
--   rpc squad_add(<non-ami>)            → 'not_friend'
-- =============================================================================
