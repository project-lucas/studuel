-- =============================================================================
-- 598 — Les annales du brevet d'histoire-géographie-EMC, Métropole 2017 → 2026
--       (25/10/2026, chantier des annales — docs/annales-chantier.md)
--
-- `annale_connue(p_annale)` (557) est le MIROIR de contenu/annales/*.json : une
-- annale que la base ne connaît pas ne se valide pas (ni chrono, ni XP, ni
-- gemmes — `annale_commencer` et `epreuve_recompenser` la refusent). Le test
-- lib/economie.test.ts exige l'égalité exacte entre cette liste et le dépôt.
--
-- Huit annales entrent : histoire-geo-brevet-2017 · 2018 · 2019 · 2021 · 2022 ·
-- 2023 · 2024 · 2026-metropole (la 2025 y était). Les 42 autres sont inchangées.
--
-- PRÉREQUIS : 557. Idempotente (CREATE OR REPLACE). Non sondable : la fonction
-- existe depuis la 557 — contrôle après exécution :
--   select public.annale_connue('histoire-geo-brevet-2024-metropole');  → true
-- À exécuter à la main : Supabase Dashboard → SQL Editor → Run.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.annale_connue(p_annale TEXT)
RETURNS BOOLEAN
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT p_annale = ANY (ARRAY[
    'francais-2023-metropole',
    'francais-2024-asie',
    'francais-2025-asie',
    'francais-brevet-2025-metropole',
    'hggsp-2021-zero-1',
    'hggsp-2021-zero-2',
    'hggsp-2023-metropole-j2',
    'hggsp-2024-centres-etrangers-j1',
    'hggsp-2025-amerique-nord-j1',
    'histoire-geo-brevet-2017-metropole',
    'histoire-geo-brevet-2018-metropole',
    'histoire-geo-brevet-2019-metropole',
    'histoire-geo-brevet-2021-metropole',
    'histoire-geo-brevet-2022-metropole',
    'histoire-geo-brevet-2023-metropole',
    'histoire-geo-brevet-2024-metropole',
    'histoire-geo-brevet-2025-metropole',
    'histoire-geo-brevet-2026-metropole',
    'hlp-2023-metropole-j1',
    'hlp-2024-centres-etrangers-j1',
    'hlp-2025-amerique-nord-secours',
    'maths-2021-zero-1',
    'maths-2023-metropole-j1',
    'maths-2024-centres-etrangers-j1',
    'maths-2025-amerique-nord-j1',
    'maths-anticipee-2026-generale-sans-spe-metropole',
    'maths-anticipee-2026-generale-spe-metropole',
    'maths-anticipee-2026-techno-metropole',
    'maths-brevet-2025-metropole',
    'nsi-2023-metropole-j1',
    'nsi-2024-centres-etrangers-j1',
    'nsi-2025-asie-j1',
    'philosophie-2021-zero-1',
    'philosophie-2023-metropole',
    'philosophie-2024-amerique-nord',
    'philosophie-2025-amerique-nord',
    'physique-chimie-2023-metropole-j1',
    'physique-chimie-2024-polynesie-j2',
    'physique-chimie-2025-amerique-nord-j1',
    'physique-chimie-brevet-2025-metropole',
    'ses-2021-zero-1',
    'ses-2023-metropole-j1',
    'ses-2023-metropole-j2',
    'ses-2024-asie-j1',
    'ses-2025-asie-j2',
    'svt-2021-zero-1',
    'svt-2023-metropole-j1',
    'svt-2024-amerique-nord-j1',
    'svt-2025-amerique-nord-j1',
    'svt-brevet-2025-metropole'
  ]);
$$;
