-- 176_squad_amis.sql — Nom de « groupe d'amis » (squad).
-- L'onglet Amis affiche un TITRE d'équipe à la place de l'arène. Le leader du
-- classement (celui qui a le plus grimpé) peut le renommer. Le nom vit sur le
-- profil de chaque élève (profiles.squad_name) : chacun baptise son cercle.
-- Idempotent — réexécutable sans effet de bord.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS squad_name text;

-- Borne de longueur (défense en profondeur ; l'UI borne aussi à 40).
DO $$ BEGIN
  ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_squad_name_len
    CHECK (squad_name IS NULL OR char_length(squad_name) <= 40);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Écriture sous clé anon : GRANT au niveau colonne (modèle 082_avatar), la RLS
-- owner-only de profiles borne déjà la ligne. Lecture couverte par le GRANT
-- SELECT de table déjà en place.
GRANT UPDATE (squad_name) ON public.profiles TO authenticated;
