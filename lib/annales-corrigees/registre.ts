// -----------------------------------------------------------------------------
// LE REGISTRE DES ANNALES CORRIGÉES — fichier GÉNÉRÉ par
// scripts/annales-registre.mjs, ne pas éditer à la main.
//
// ⚠️ SERVEUR SEULEMENT : ce module tire tout le corpus des corrigés. Un
// composant client ne l'importe jamais ; il reçoit des aperçus (apercu.ts).
// (Pas d'import 'server-only' : le paquet n'est pas installé, et le
// processus où Next inspecte les pages dynamiques plantait dessus — la règle
// tient, comme pour le registre de l'encyclopédie, par la relecture.)
// -----------------------------------------------------------------------------

import type { AnnaleCorrigee } from './types'

import a_francais_2023_metropole from '@/contenu/annales/francais-2023-metropole.json'
import a_francais_2024_asie from '@/contenu/annales/francais-2024-asie.json'
import a_francais_2025_asie from '@/contenu/annales/francais-2025-asie.json'
import a_francais_brevet_2025_metropole from '@/contenu/annales/francais-brevet-2025-metropole.json'
import a_hggsp_2021_zero_1 from '@/contenu/annales/hggsp-2021-zero-1.json'
import a_hggsp_2021_zero_2 from '@/contenu/annales/hggsp-2021-zero-2.json'
import a_hggsp_2023_metropole_j2 from '@/contenu/annales/hggsp-2023-metropole-j2.json'
import a_hggsp_2024_centres_etrangers_j1 from '@/contenu/annales/hggsp-2024-centres-etrangers-j1.json'
import a_hggsp_2025_amerique_nord_j1 from '@/contenu/annales/hggsp-2025-amerique-nord-j1.json'
import a_histoire_geo_brevet_2025_metropole from '@/contenu/annales/histoire-geo-brevet-2025-metropole.json'
import a_hlp_2023_metropole_j1 from '@/contenu/annales/hlp-2023-metropole-j1.json'
import a_hlp_2024_centres_etrangers_j1 from '@/contenu/annales/hlp-2024-centres-etrangers-j1.json'
import a_hlp_2025_amerique_nord_secours from '@/contenu/annales/hlp-2025-amerique-nord-secours.json'
import a_maths_2021_zero_1 from '@/contenu/annales/maths-2021-zero-1.json'
import a_maths_2023_metropole_j1 from '@/contenu/annales/maths-2023-metropole-j1.json'
import a_maths_2024_centres_etrangers_j1 from '@/contenu/annales/maths-2024-centres-etrangers-j1.json'
import a_maths_2025_amerique_nord_j1 from '@/contenu/annales/maths-2025-amerique-nord-j1.json'
import a_maths_anticipee_2026_generale_sans_spe_metropole from '@/contenu/annales/maths-anticipee-2026-generale-sans-spe-metropole.json'
import a_maths_anticipee_2026_generale_spe_metropole from '@/contenu/annales/maths-anticipee-2026-generale-spe-metropole.json'
import a_maths_anticipee_2026_techno_metropole from '@/contenu/annales/maths-anticipee-2026-techno-metropole.json'
import a_maths_brevet_2025_metropole from '@/contenu/annales/maths-brevet-2025-metropole.json'
import a_nsi_2023_metropole_j1 from '@/contenu/annales/nsi-2023-metropole-j1.json'
import a_nsi_2024_centres_etrangers_j1 from '@/contenu/annales/nsi-2024-centres-etrangers-j1.json'
import a_nsi_2025_asie_j1 from '@/contenu/annales/nsi-2025-asie-j1.json'
import a_philosophie_2021_zero_1 from '@/contenu/annales/philosophie-2021-zero-1.json'
import a_philosophie_2023_metropole from '@/contenu/annales/philosophie-2023-metropole.json'
import a_philosophie_2024_amerique_nord from '@/contenu/annales/philosophie-2024-amerique-nord.json'
import a_philosophie_2025_amerique_nord from '@/contenu/annales/philosophie-2025-amerique-nord.json'
import a_physique_chimie_2023_metropole_j1 from '@/contenu/annales/physique-chimie-2023-metropole-j1.json'
import a_physique_chimie_2024_polynesie_j2 from '@/contenu/annales/physique-chimie-2024-polynesie-j2.json'
import a_physique_chimie_2025_amerique_nord_j1 from '@/contenu/annales/physique-chimie-2025-amerique-nord-j1.json'
import a_physique_chimie_brevet_2025_metropole from '@/contenu/annales/physique-chimie-brevet-2025-metropole.json'
import a_ses_2021_zero_1 from '@/contenu/annales/ses-2021-zero-1.json'
import a_ses_2023_metropole_j1 from '@/contenu/annales/ses-2023-metropole-j1.json'
import a_ses_2023_metropole_j2 from '@/contenu/annales/ses-2023-metropole-j2.json'
import a_ses_2024_asie_j1 from '@/contenu/annales/ses-2024-asie-j1.json'
import a_ses_2025_asie_j2 from '@/contenu/annales/ses-2025-asie-j2.json'
import a_svt_2021_zero_1 from '@/contenu/annales/svt-2021-zero-1.json'
import a_svt_2023_metropole_j1 from '@/contenu/annales/svt-2023-metropole-j1.json'
import a_svt_2024_amerique_nord_j1 from '@/contenu/annales/svt-2024-amerique-nord-j1.json'
import a_svt_2025_amerique_nord_j1 from '@/contenu/annales/svt-2025-amerique-nord-j1.json'
import a_svt_brevet_2025_metropole from '@/contenu/annales/svt-brevet-2025-metropole.json'

export const ANNALES_CORRIGEES: readonly AnnaleCorrigee[] = [
  a_francais_2023_metropole,
  a_francais_2024_asie,
  a_francais_2025_asie,
  a_francais_brevet_2025_metropole,
  a_hggsp_2021_zero_1,
  a_hggsp_2021_zero_2,
  a_hggsp_2023_metropole_j2,
  a_hggsp_2024_centres_etrangers_j1,
  a_hggsp_2025_amerique_nord_j1,
  a_histoire_geo_brevet_2025_metropole,
  a_hlp_2023_metropole_j1,
  a_hlp_2024_centres_etrangers_j1,
  a_hlp_2025_amerique_nord_secours,
  a_maths_2021_zero_1,
  a_maths_2023_metropole_j1,
  a_maths_2024_centres_etrangers_j1,
  a_maths_2025_amerique_nord_j1,
  a_maths_anticipee_2026_generale_sans_spe_metropole,
  a_maths_anticipee_2026_generale_spe_metropole,
  a_maths_anticipee_2026_techno_metropole,
  a_maths_brevet_2025_metropole,
  a_nsi_2023_metropole_j1,
  a_nsi_2024_centres_etrangers_j1,
  a_nsi_2025_asie_j1,
  a_philosophie_2021_zero_1,
  a_philosophie_2023_metropole,
  a_philosophie_2024_amerique_nord,
  a_philosophie_2025_amerique_nord,
  a_physique_chimie_2023_metropole_j1,
  a_physique_chimie_2024_polynesie_j2,
  a_physique_chimie_2025_amerique_nord_j1,
  a_physique_chimie_brevet_2025_metropole,
  a_ses_2021_zero_1,
  a_ses_2023_metropole_j1,
  a_ses_2023_metropole_j2,
  a_ses_2024_asie_j1,
  a_ses_2025_asie_j2,
  a_svt_2021_zero_1,
  a_svt_2023_metropole_j1,
  a_svt_2024_amerique_nord_j1,
  a_svt_2025_amerique_nord_j1,
  a_svt_brevet_2025_metropole,
] as unknown as readonly AnnaleCorrigee[]
