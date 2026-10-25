# Le chantier des annales (25/10/2026)

> Lucas : « trouve et importe le maximum de sujets d'annales sur internet, sur le
> maximum d'années, et propose une correction Studuel ; que le rendu soit propre tel
> une fiche de révision ; et ajoute une icône dans l'angle de la section Annales : un
> récap des sujets tombés par année, pour que l'élève voie tout de suite les sujets
> qui tombent le plus souvent et priorise. Rendu impeccable. »

Le guide de rédaction reste `docs/annales-corrigees.md` (la règle d'or : le corrigé est
à nous, jamais un corrigé tiers, même reformulé). Ce document tient **l'inventaire des
sources**, l'état de l'import session par session, et les décisions à confirmer.

## 1. Ce que ce passage a livré

- **Le récap par année** : un champ `theme` (≤ 40 caractères, la même graphie d'une
  annale à l'autre) sur chaque partie des JSON, exigé par le validateur ; la logique
  pure `lib/annales-corrigees/recap.ts` (frise par année, fréquence « tombé 3 fois en
  6 sessions ») ; l'icône dans l'angle de « Les sujets tombés, corrigés » qui ouvre le
  pop-up `components/annales/RecapAnnales.tsx`.
- **Le corrigé façon fiche de révision** : `components/annales/corrige.css` (tokens
  sémantiques, rubans, post-its, surligneur, cartes cernées d'encre) et les composants
  `EcranAnnale`, `BlocsCorrige`, `TexteCorrige`, `PartiesCorrige`.
- **Le stockage** : les sujets habillés partent sur Cloudflare R2 (`R2_BUCKET_ANNALES`,
  `scripts/annales-deposer.mjs`), servis par `GET /api/annales/<id>/sujet` avec repli
  local (`annales-out/`, hors git, puis `public/annales/`) — voir § 5.
- **Le premier lot** : le brevet d'histoire-géographie-EMC, Métropole 2017 → 2026 (huit
  nouvelles sessions, 2025 existait déjà ; pas de session 2020).
- **Le deuxième lot** (même jour, second passage) : le brevet de **français**, de
  **mathématiques**, de **physique-chimie** et de **SVT**, Métropole 2017 → 2026 —
  27 annales (8 + 8 + 5 + 6), détail en § 4 ; la migration 599 (qui contient la 598).
  Le validateur n'exige plus le PDF source que sur une machine qui a le dossier
  `assets-sources/annales/sujets/` (décision 6, tranchée).
- **Le troisième lot** (même jour, troisième passage) : l'épreuve anticipée de
  **français** (1re, voie générale), Métropole 2021 → 2026 — 5 annales (2021 : la
  session unique aux deux documents, huit parties ; 2022, 2024, 2025, 2026 ; la 2023
  existait), chaque commentaire ET chaque dissertation corrigés, ≈ 50 600 mots en tout ;
  détail en § 3 ; la migration 600 (qui contient la 599). La couverture du sujet
  habillé s'adapte désormais au nombre de parties (décision 13).

## 2. Les sources

| Source | Ce qu'elle donne | Fiabilité |
|---|---|---|
| **sujetdebac.fr** | Tous les sujets du bac 2021 → 2026 (général : philosophie, français 1re, toutes les spécialités), par session et par centre, **PDF officiels** du ministère : `https://www.sujetdebac.fr/annales-pdf/<année>/<session>-sujet-officiel.pdf`. Pas de brevet. | Le PDF est celui du ministère (code repère en pied de page). Déjà utilisé pour les 42 premières annales. |
| **aufutur.fr** (média) | Les sujets du brevet par année, PDF officiels nommés par leur code (`https://aufutur.fr/wp-content/uploads/<année>/<mois>/<CODE>.pdf`, ex. `2024/07/24GENHGEMCME.pdf`, `2025/06/25GENHGEMCME1.pdf`). | PDF officiel tel quel. Couvre 2023 → 2026. |
| **hg.ac-besancon.fr** (académie de Besançon, histoire-géographie) | Les sujets du DNB d'histoire-géographie-EMC 2023, 2024, 2025 (juin, septembre, centres étrangers, série pro). | Site académique, PDF officiels. |
| **salle14.jimdofree.com** (site d'un professeur) | Les sujets du DNB d'histoire-géographie 2017 → 2022 (Métropole juin et septembre, Pondichéry, Washington, Liban, Polynésie, Antilles). | PDF officiels (code repère vérifié), parfois scannés (2021). Le fichier « Remplacement 2018 » est en réalité le sujet de septembre 2017. |
| **letudiant.fr** | Les sujets du brevet par année (`https://medias.letudiant.fr/corriges/brevet/histoiregenerale.pdf` = Métropole 2026) ; au même endroit, les sujets 2026 de français, de maths et de sciences (lot 2). | PDF officiel ; l'adresse est réécrite chaque année (à télécharger vite). |
| **eduscol.education.gouv.fr** (annales du DNB) | La page officielle « Préparer le DNB avec les sujets des annales » et ses fichiers `https://eduscol.education.gouv.fr/document/<id>/download` : la plupart des sujets de français, de maths et de sciences 2018 → 2024 (lot 2). | La PAGE est inaccessible par script (403) ; les fichiers `document/<id>/download` se téléchargent sans difficulté (l'id se lit dans la page, ouverte dans un navigateur). PDF officiels, code repère vérifié. |
| **education.gouv.fr** | Quelques sujets du brevet (fichiers `media/…`), pris au lot 2 quand eduscol n'avait pas la session. | PDF officiels. |
| **salle34.net** (site d'un professeur de lettres) | Le sujet de français 2017 (`17GENFRQRME1`). | PDF officiel, code vérifié. |
| **ac-martinique.fr** (académie) | Le sujet de maths 2017, **retapé** par l'académie (repère `17GENMATMEAG1` reproduit) : la seule version trouvée. | Même contenu, mais pas la mise en page du ministère — à remplacer par l'original s'il se trouve (décision 8). |
| **apmep.fr** (maths), **labolycee.org** (physique-chimie), **pi.ac3j.fr**, **brevetdescolleges.fr** | Non utilisés : APMEP, Labolycée et pi.ac3j republient les sujets avec leurs propres corrigés (**à ne jamais lire**) ; brevetdescolleges.fr n'a pas répondu (TLS). | — |

**Règle** : on ne télécharge que le **sujet** (jamais le corrigé d'un site), on vérifie
que le fichier commence par `%PDF-`, on lit le code repère imprimé en pied de page
(`24GENHGEMCME1`), on recompresse (`python -I scripts/annales-recompresser.py`) dans
`assets-sources/annales/sujets/<id>.pdf`.

## 3. Inventaire du bac (sujetdebac.fr, relevé le 25/10/2026)

Priorité : bac nouvelle formule 2021 → 2026, tous les centres. Avant 2021, seulement si
le programme est le même (philosophie, commentaire de français) — l'ancien bac
(S-ES-L) est rangé à part sur sujetdebac (`/annales/ancien-bac/`), non relevé ici.

| Matière | Sessions trouvées (2021 → 2026) | Importées |
|---|---|---|
| Philosophie (Tle) | 61 | 4 |
| Français (1re, épreuve anticipée) | 68 | 3 |
| HLP (Tle) | 88 | 2 |
| HGGSP (Tle) | 101 | 5 |
| SES (Tle) | 96 | 5 |
| Mathématiques (Tle) | 103 | 4 |
| Physique-chimie (Tle) | 100 | 3 |
| SVT (Tle) | 101 | 4 |
| NSI (Tle) | 92 | 3 |
| **Total bac** | **810** | **33** |

Les sessions « remplacement » sont celles de septembre ; « secours » et « bis » sont
des sujets de rechange effectivement utilisés ; « zéro » et « specimen » sont les sujets
d'entraînement publiés par le ministère avant la première session.

### Philosophie (Tle)

Rubrique : `https://www.sujetdebac.fr/annales/philosophie/<année>/`

| Année | Sessions trouvées (sujet officiel = `/annales-pdf/<année>/<session>-sujet-officiel.pdf`) |
|---|---|
| 2026 | Amérique du Nord · Antilles-Guyane · Asie · Centres étrangers · Métropole · Métropole secours · Polynésie · Polynésie remplacement |
| 2025 | **Amérique du Nord** ✓ · Amérique du Sud · Antilles-Guyane · Antilles-Guyane remplacement · Asie · Centres étrangers · Métropole · Métropole bis remplacement · Métropole remplacement · Métropole secours · Nouvelle-Calédonie · Polynésie · Polynésie remplacement |
| 2024 | **Amérique du Nord** ✓ · Antilles-Guyane · Antilles-Guyane remplacement · Asie · Centres étrangers · Métropole · Métropole remplacement · Polynésie · Polynésie remplacement |
| 2023 | Amérique du Nord · Antilles-Guyane · Antilles-Guyane remplacement · Asie · Centres étrangers · **Métropole** ✓ · Métropole remplacement · Polynésie · Polynésie remplacement |
| 2022 | Amérique du Nord · Amérique du Sud · Antilles-Guyane · Antilles-Guyane remplacement · Asie · Centres étrangers · Métropole · Métropole remplacement · Nouvelle-Calédonie · Polynésie · Polynésie remplacement |
| 2021 | Amérique du Nord · Antilles-Guyane · Antilles-Guyane remplacement · Asie · Centres étrangers · Métropole · Métropole remplacement · Polynésie · Polynésie remplacement · **sujet zéro jour 1** ✓ · sujet zéro jour 2 |

61 sessions trouvées, 4 importées (✓ en gras).

### Français (1re, épreuve anticipée)

Rubrique : `https://www.sujetdebac.fr/annales/francais-premiere/<année>/`

| Année | Sessions trouvées (sujet officiel = `/annales-pdf/<année>/<session>-sujet-officiel.pdf`) |
|---|---|
| 2026 | Amérique du Nord · Antilles-Guyane · Asie · Centres étrangers · **Métropole** ✓ · Métropole secours · Polynésie · Polynésie remplacement |
| 2025 | Amérique du Nord · Amérique du Sud · Antilles-Guyane · Antilles-Guyane remplacement · **Asie** ✓ · Centres étrangers · **Métropole** ✓ · Métropole remplacement · Métropole secours · Nouvelle-Calédonie · Polynésie · Polynésie remplacement |
| 2024 | Amérique du Nord · Antilles-Guyane · Antilles-Guyane remplacement · **Asie** ✓ · Centres étrangers · **Métropole** ✓ · Métropole remplacement · Polynésie · Polynésie remplacement |
| 2023 | Amérique du Nord · Antilles-Guyane · Antilles-Guyane remplacement · Asie · Centres étrangers · **Métropole** ✓ · Métropole remplacement · Nouvelle-Calédonie · Polynésie · Polynésie remplacement |
| 2022 | Amérique du Nord · Amérique du Nord remplacement · Amérique du Sud · Antilles-Guyane · Antilles-Guyane remplacement · Asie · Centres étrangers · **Métropole** ✓ · Métropole remplacement · Nouvelle-Calédonie · Polynésie · Polynésie remplacement · sujet zéro jour 1 |
| 2021 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Antilles-Guyane jour 1 · Antilles-Guyane jour 2 · Antilles-Guyane remplacement · Asie jour 1 · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · **Métropole jour 1 + jour 2** ✓ (une seule annale, décision 11) · Métropole remplacement · Polynésie jour 1 · Polynésie jour 1, remplacement · Polynésie jour 2 · Polynésie jour 2, remplacement |

68 sessions trouvées, 8 importées (✓ en gras) — toutes les sessions de Métropole de
juin, 2021 → 2026, sont corrigées.

#### Français 1re — TROISIÈME LOT, Métropole importé

Source : sujetdebac.fr (`/annales-pdf/<année>/francais-premiere-<année>-metropole[-1|-2]-sujet-officiel.pdf`),
PDF du ministère, code repère vérifié en pied de page. Une partie par sujet : le
commentaire (`theme` = l'objet d'étude, « Le roman et le récit », « La poésie »,
« La littérature d'idées » ; le titre de la partie porte l'auteur) et chaque
dissertation (`theme` = « Œuvre, Auteur », même graphie d'une session à l'autre — c'est
la clé du récap : « Les Contemplations, Hugo : tombé 2 fois en 8 sessions »). Chaque
corrigé : « En 30 secondes », analyse du sujet, problématique, introduction et conclusion
rédigées, trois parties développées, astuces, pièges, ce que le correcteur attend.

| Session | Code | État | Corrigé |
|---|---|---|---|
| 2021 Métropole | 21-FRGEME1 · 21-FRGEME1BIS | **importée** `francais-2021-metropole` — une session, deux documents réunis (décision 11) : Perec, Larbaud + Hugo, Baudelaire, Apollinaire, Molière, Marivaux, Lagarce | ≈ 17 100 mots (8 parties) |
| 2022 Métropole | 22-FRGEME2 | **importée** `francais-2022-metropole` — Sylvie Germain + Hugo, Baudelaire, Apollinaire | ≈ 8 750 mots |
| 2023 Métropole | 23-FRGEME1 | **importée** (avant le chantier) — Diderot + Prévost, Balzac, Colette | — |
| 2024 Métropole | 24-FRGEME1 | **importée** `francais-2024-metropole` — Claire de Duras + Rimbaud, Ponge, Dorion | ≈ 8 500 mots |
| 2025 Métropole | 25-FRGEME1 | **importée** `francais-2025-metropole` — Barbey d'Aurevilly + Corneille, Musset, Sarraute | ≈ 7 900 mots |
| 2026 Métropole | 26-FRGEME1 | **importée** `francais-2026-metropole` — Louise d'Épinay + Rimbaud, Ponge, Dorion | ≈ 8 400 mots |

Pas de session 2020 (l'écrit a été annulé). Non importés (décision 1) : les autres
centres et les sessions de remplacement et de secours. Avant 2021 : l'ancienne formule
(corpus, écriture d'invention) n'est pas retenue.

### HLP (Tle)

Rubrique : `https://www.sujetdebac.fr/annales/specialites/spe-humanites-litterature-philo/<année>/`

| Année | Sessions trouvées (sujet officiel = `/annales-pdf/<année>/<session>-sujet-officiel.pdf`) |
|---|---|
| 2026 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Antilles-Guyane jour 1 · Antilles-Guyane jour 2 · Asie jour 1 · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · Métropole jour 1 · Métropole jour 2 · Polynésie jour 1 · Polynésie jour 2 |
| 2025 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Amérique du Nord 2bis · Amérique du Sud jour 2 · Asie jour 1 · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · Nouvelle-Calédonie jour 1 · Nouvelle-Calédonie jour 2 · Polynésie jour 1 · Polynésie jour 1, remplacement · Polynésie jour 2 |
| 2024 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Asie jour 1 · Asie jour 2 · **Centres étrangers jour 1** ✓ · Centres étrangers jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · Polynésie jour 1 · Polynésie jour 2 · Suède jour 2 |
| 2023 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · La Réunion jour 1 · La Réunion jour 2 · Liban jour 1 · Liban jour 2 · **Métropole jour 1** ✓ · Métropole jour 2 · Nouvelle-Calédonie jour 1 · Nouvelle-Calédonie jour 2 · Polynésie jour 1 · Polynésie jour 2 |
| 2022 | Amérique du Nord jour 1 · Amérique du Sud jour 1 · Amérique du Sud jour 2 · Asie jour 1 · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · mayotte Liban jour 1 · mayotte Liban jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · Nouvelle-Calédonie jour 1 · Nouvelle-Calédonie jour 2 · Polynésie jour 1 · Polynésie jour 2 |
| 2021 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · Métropole candidats libres jour 1 · Métropole candidats libres jour 2 · Métropole jour 1, remplacement · Métropole jour 2, remplacement · Polynésie jour 1 · Polynésie jour 1, remplacement · sujet zéro jour 1 · sujet zéro jour 2 · sujet zéro jour 3 · sujet zéro jour 4 |

88 sessions trouvées, 2 importées (✓ en gras).

### HGGSP (Tle)

Rubrique : `https://www.sujetdebac.fr/annales/specialites/spe-hg-geopolitique-sciences-po/<année>/`

| Année | Sessions trouvées (sujet officiel = `/annales-pdf/<année>/<session>-sujet-officiel.pdf`) |
|---|---|
| 2026 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Antilles-Guyane jour 1 · Antilles-Guyane jour 2 · Asie jour 1 · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Métropole secours2 · Polynésie jour 1 · Polynésie jour 1, remplacement · Polynésie jour 2 |
| 2025 | **Amérique du Nord jour 1** ✓ · Amérique du Nord jour 2 · Amérique du Nord 2bis · Amérique du Sud jour 1 · Amérique du Sud jour 2 · Asie jour 1 · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · Nouvelle-Calédonie jour 1 · Nouvelle-Calédonie jour 2 · Polynésie jour 1 · Polynésie jour 2 |
| 2024 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Amérique du Sud jour 1 · Amérique du Sud jour 2 · Asie jour 1 · Asie jour 2 · **Centres étrangers jour 1** ✓ · Centres étrangers jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · Polynésie jour 1 · Polynésie jour 2 · Polynésie jour 2, remplacement · Suède jour 2 |
| 2023 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Amérique du Sud jour 1 · Amérique du Sud jour 2 · Asie jour 1 · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · La Réunion jour 1 · La Réunion jour 2 · Liban jour 1 · Liban jour 2 · Métropole jour 1 · **Métropole jour 2** ✓ · Métropole jour 2, remplacement · Nouvelle-Calédonie jour 1 · Nouvelle-Calédonie jour 2 · Polynésie jour 1 · Polynésie jour 1, remplacement · Polynésie jour 2 · specimen jour 2 |
| 2022 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Amérique du Sud jour 1 · Amérique du Sud jour 2 · Asie jour 1 · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · mayotte Liban jour 1 · mayotte Liban jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · Nouvelle-Calédonie jour 1 · Nouvelle-Calédonie jour 2 · Polynésie jour 1 · Polynésie jour 2 |
| 2021 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · Métropole candidats libres jour 1 · Métropole candidats libres jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · **sujet zéro jour 1** ✓ · **sujet zéro jour 2** ✓ · sujet zéro jour 3 |

101 sessions trouvées, 5 importées (✓ en gras).

### SES (Tle)

Rubrique : `https://www.sujetdebac.fr/annales/specialites/spe-sciences-eco-sociales/<année>/`

| Année | Sessions trouvées (sujet officiel = `/annales-pdf/<année>/<session>-sujet-officiel.pdf`) |
|---|---|
| 2026 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Antilles-Guyane jour 1 · Antilles-Guyane jour 2 · Asie jour 1 · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · Polynésie jour 1 · Polynésie jour 2 |
| 2025 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Amérique du Nord 2bis · Amérique du Sud jour 1 · Asie jour 1 · **Asie jour 2** ✓ · Centres étrangers jour 1 · Centres étrangers jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · Métropole secours1 · Nouvelle-Calédonie jour 1 · Nouvelle-Calédonie jour 2 · Polynésie jour 1 · Polynésie jour 2 |
| 2024 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · **Asie jour 1** ✓ · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · Polynésie jour 1 · Polynésie jour 1, remplacement · Polynésie jour 2 · Suède jour 2 |
| 2023 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Amérique du Sud jour 1 · Amérique du Sud jour 2 · Asie jour 1 · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · La Réunion jour 1 · La Réunion jour 2 · Liban jour 1 · Liban jour 2 · **Métropole jour 1** ✓ · **Métropole jour 2** ✓ · Nouvelle-Calédonie jour 1 · Nouvelle-Calédonie jour 2 · Polynésie jour 1 · Polynésie jour 2 |
| 2022 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Amérique du Sud jour 1 · Amérique du Sud jour 2 · Asie jour 1 · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · mayotte Liban jour 1 · mayotte Liban jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · Nouvelle-Calédonie jour 1 · Nouvelle-Calédonie jour 2 · Polynésie jour 1 · Polynésie jour 2 · Polynésie jour 2, remplacement |
| 2021 | Amérique du Nord jour 1 · Asie jour 1 · Centres étrangers jour 1 · Centres étrangers jour 2 · Métropole candidats libres jour 1 · Métropole candidats libres jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · Polynésie jour 1 · Polynésie jour 2 · **sujet zéro jour 1** ✓ · sujet zéro jour 2 |

96 sessions trouvées, 5 importées (✓ en gras).

### Mathématiques (Tle)

Rubrique : `https://www.sujetdebac.fr/annales/specialites/spe-mathematiques/<année>/`

| Année | Sessions trouvées (sujet officiel = `/annales-pdf/<année>/<session>-sujet-officiel.pdf`) |
|---|---|
| 2026 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Antilles-Guyane jour 1 · Antilles-Guyane jour 2 · Asie jour 1 · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · Polynésie jour 1 · Polynésie jour 2 |
| 2025 | **Amérique du Nord jour 1** ✓ · Amérique du Nord jour 2 · Amérique du Nord 2bis · Amérique du Sud jour 1 · Amérique du Sud jour 2 · Asie jour 1 · Asie jour 1, remplacement · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · Nouvelle-Calédonie jour 1 · Nouvelle-Calédonie jour 2 · Polynésie jour 1 · Polynésie jour 1, remplacement · Polynésie jour 2 |
| 2024 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Amérique du Sud jour 1 · Amérique du Sud jour 2 · Asie jour 1 · Asie jour 2 · **Centres étrangers jour 1** ✓ · Centres étrangers jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Métropole 2 bis · Métropole jour 2, remplacement · Polynésie jour 1 · Polynésie jour 1, remplacement · Polynésie jour 2 · Suède jour 2 · sujet zéro jour 1 |
| 2023 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Amérique du Sud jour 1 · Amérique du Sud jour 2 · Asie jour 1 · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · La Réunion jour 1 · La Réunion jour 2 · Liban jour 1 · Liban jour 2 · **Métropole jour 1** ✓ · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · Nouvelle-Calédonie jour 1 · Nouvelle-Calédonie jour 2 · Polynésie jour 1 · Polynésie jour 1, remplacement · Polynésie jour 2 |
| 2022 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Amérique du Sud jour 1 · Amérique du Sud jour 2 · Asie jour 1 · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · mayotte Liban jour 1 · mayotte Liban jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · Nouvelle-Calédonie jour 1 · Nouvelle-Calédonie jour 2 · Polynésie jour 1 · Polynésie jour 1, remplacement · Polynésie jour 2 |
| 2021 | Amérique du Nord jour 1 · Asie jour 1 · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · Métropole candidats libres jour 1 · Métropole candidats libres jour 2 · Métropole jour 1 · Métropole jour 2 · Métropole jour 2, remplacement · Polynésie jour 1 · **sujet zéro jour 1** ✓ |

103 sessions trouvées, 4 importées (✓ en gras).

### Physique-chimie (Tle)

Rubrique : `https://www.sujetdebac.fr/annales/specialites/spe-physique-chimie/<année>/`

| Année | Sessions trouvées (sujet officiel = `/annales-pdf/<année>/<session>-sujet-officiel.pdf`) |
|---|---|
| 2026 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Antilles-Guyane jour 1 · Antilles-Guyane jour 2 · Asie jour 1 · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · Métropole secours2 · Polynésie jour 1 · Polynésie jour 2 |
| 2025 | **Amérique du Nord jour 1** ✓ · Amérique du Nord jour 2 · Amérique du Nord 2bis · Amérique du Sud jour 1 · Amérique du Sud jour 2 · Asie jour 1 · Asie jour 1, remplacement · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · Métropole secours2 · Nouvelle-Calédonie jour 1 · Nouvelle-Calédonie jour 2 · Polynésie jour 1 · Polynésie jour 2 |
| 2024 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Asie jour 1 · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · Polynésie jour 1 · **Polynésie jour 2** ✓ · Polynésie jour 2, remplacement · Suède jour 2 |
| 2023 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Asie jour 1 · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · La Réunion jour 1 · La Réunion jour 2 · Liban jour 1 · Liban jour 2 · **Métropole jour 1** ✓ · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · Nouvelle-Calédonie jour 1 · Nouvelle-Calédonie jour 2 · Polynésie jour 1 · Polynésie jour 1, remplacement · Polynésie jour 2 |
| 2022 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Amérique du Sud jour 1 · Amérique du Sud jour 2 · Asie jour 1 · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · mayotte Liban jour 1 · mayotte Liban jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · Nouvelle-Calédonie jour 1 · Nouvelle-Calédonie jour 2 · Polynésie jour 1 · Polynésie jour 2 |
| 2021 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Asie jour 1 · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · Métropole candidats libres jour 1 · Métropole candidats libres jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · Polynésie jour 1 · sujet zéro jour 1 · sujet zéro jour 2 |

100 sessions trouvées, 3 importées (✓ en gras).

### SVT (Tle)

Rubrique : `https://www.sujetdebac.fr/annales/specialites/spe-sciences-vie-terre/<année>/`

| Année | Sessions trouvées (sujet officiel = `/annales-pdf/<année>/<session>-sujet-officiel.pdf`) |
|---|---|
| 2026 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Antilles-Guyane jour 1 · Antilles-Guyane jour 2 · Asie jour 1 · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Polynésie jour 1 · Polynésie jour 1, remplacement · Polynésie jour 2 |
| 2025 | **Amérique du Nord jour 1** ✓ · Amérique du Nord jour 2 · Amérique du Nord 2bis · Amérique du Sud jour 2 · Asie jour 1 · Asie jour 1, remplacement · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · Métropole bis remplacement · Nouvelle-Calédonie jour 1 · Nouvelle-Calédonie jour 2 · Polynésie jour 1 · Polynésie jour 2 · Polynésie jour 2, remplacement |
| 2024 | **Amérique du Nord jour 1** ✓ · Amérique du Nord jour 2 · Asie jour 1 · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · Polynésie jour 1 · Polynésie jour 2 · Suède jour 2 |
| 2023 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · La Réunion jour 1 · La Réunion jour 2 · Liban jour 1 · Liban jour 2 · **Métropole jour 1** ✓ · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · Nouvelle-Calédonie jour 1 · Nouvelle-Calédonie jour 2 · Polynésie jour 1 · Polynésie jour 2 · Polynésie jour 2, remplacement |
| 2022 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Amérique du Sud jour 1 · Asie jour 1 · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · mayotte Liban jour 1 · mayotte Liban jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · Nouvelle-Calédonie jour 1 · Nouvelle-Calédonie jour 2 · Polynésie jour 1 · Polynésie jour 1, remplacement · Polynésie jour 2 · Polynésie jour 2, remplacement |
| 2021 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Amérique du Sud jour 1 · Amérique du Sud jour 2 · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · Métropole candidats libres jour 1 · Métropole candidats libres jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · Polynésie jour 1 · Polynésie jour 2 · specimen jour 1 · **sujet zéro jour 1** ✓ · sujet zéro jour 2 · sujet zéro jour 3 |

101 sessions trouvées, 4 importées (✓ en gras).

### NSI (Tle)

Rubrique : `https://www.sujetdebac.fr/annales/specialites/spe-numerique-informatique/<année>/`

| Année | Sessions trouvées (sujet officiel = `/annales-pdf/<année>/<session>-sujet-officiel.pdf`) |
|---|---|
| 2026 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Antilles-Guyane jour 1 · Antilles-Guyane jour 2 · Asie jour 1 · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · Métropole jour 1 · Métropole jour 2 · Polynésie jour 1 · Polynésie jour 2 |
| 2025 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Amérique du Nord 2bis · Amérique du Sud jour 1 · Amérique du Sud jour 2 · **Asie jour 1** ✓ · Asie jour 1, remplacement · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · Nouvelle-Calédonie jour 1 · Nouvelle-Calédonie jour 2 · Polynésie jour 1 · Polynésie jour 2 |
| 2024 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Asie jour 1 · Asie jour 2 · **Centres étrangers jour 1** ✓ · Centres étrangers jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · Polynésie jour 1 · Polynésie jour 2 · Suède jour 2 · sujet zéro jour 1 · sujet zéro jour 2 |
| 2023 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Amérique du Sud jour 1 · Amérique du Sud jour 2 · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · La Réunion jour 1 · La Réunion jour 2 · Liban jour 1 · Liban jour 2 · **Métropole jour 1** ✓ · Métropole jour 2 · Nouvelle-Calédonie jour 1 · Nouvelle-Calédonie jour 2 · Polynésie jour 1 · Polynésie jour 2 · sujet zéro jour 1 · sujet zéro jour 2 |
| 2022 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Amérique du Sud jour 1 · Amérique du Sud jour 2 · Asie jour 1 · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · mayotte Liban jour 1 · mayotte Liban jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · Nouvelle-Calédonie jour 1 · Nouvelle-Calédonie jour 2 · Polynésie jour 1 |
| 2021 | Amérique du Nord jour 1 · Centres étrangers jour 1 · Centres étrangers jour 2 · Métropole candidats libres jour 1 · Métropole candidats libres jour 2 · Métropole jour 1 · Métropole jour 1, remplacement · Métropole jour 2 · Métropole jour 2, remplacement · Polynésie jour 2 · sujet zéro jour 1 |

92 sessions trouvées, 3 importées (✓ en gras).

## 4. Inventaire du brevet (3e)

Priorité 2017 → 2026 (brevet réformé, même programme depuis 2016 ; pas de session 2020,
annulée). Métropole d'abord, puis les centres étrangers (Amérique du Nord/Washington,
Asie/Pondichéry, Liban, Polynésie, Antilles-Guyane) et les sessions de septembre.

### Histoire-géographie-EMC — PREMIER LOT, Métropole importé

| Session | Code | Source du sujet officiel | État |
|---|---|---|---|
| 2017 Métropole (29 juin) | 17GENHGEMCME1 | salle14 `DNB Métropole 2017 Sujet.pdf` | **importée** `histoire-geo-brevet-2017-metropole` |
| 2017 Métropole septembre | 17GENHGEMCME3 | salle14 `DNB septembre2017.pdf` | téléchargée, à corriger |
| 2018 Métropole | 18GENHGEMCME2 | salle14 `DNB Metropole 2018 Sujet.pdf` | **importée** `histoire-geo-brevet-2018-metropole` |
| 2019 Métropole (2 juillet, après report canicule) | 19GENHGEMCME1 | salle14 `DNB Metropole 2019 Sujet.pdf` | **importée** `histoire-geo-brevet-2019-metropole` |
| 2019 Métropole septembre | 19GENHGEMCME2 | salle14 `DNB Metropole Septembre 2019 Sujet.pdf` | téléchargée, à corriger |
| 2021 Métropole | 21GENHGEMCME4 | salle14 `DNB Métropole 2021 Sujet.pdf` (scan, sans texte) | **importée** `histoire-geo-brevet-2021-metropole` — à remplacer par un PDF texte si on en trouve un |
| 2022 Métropole | 22GENHGEMCME2 | salle14 `DNB Métropole 2022 Sujet.pdf` | **importée** `histoire-geo-brevet-2022-metropole` |
| 2023 Métropole | 23GENHGEMCME1 | Besançon `sujet_DNB_juin_23GENHGEMCME.pdf` | **importée** `histoire-geo-brevet-2023-metropole` |
| 2023 Métropole septembre | 23GENHGEMCME3 | Besançon `sujet_DNB_setpembre_23GENHGEMCME.pdf` | téléchargée, à corriger |
| 2024 Métropole | 24GENHGEMCME1 | aufutur `2024/07/24GENHGEMCME.pdf` | **importée** `histoire-geo-brevet-2024-metropole` |
| 2024 Métropole septembre | 24GENHGEMCME4 | Besançon `Sujet-septembre-2-31012024_v1.pdf` | téléchargée, à corriger |
| 2025 Métropole | 25GENHGEMCME1 | aufutur `2025/06/25GENHGEMCME1.pdf` | **importée** (25/09/2026) |
| 2026 Métropole (29 juin) | 26GENHGEMCME1 | letudiant `histoiregenerale.pdf` | **importée** `histoire-geo-brevet-2026-metropole` |
| Centres étrangers 2017 → 2025 | — | salle14 (Pondichéry, Washington, Liban, Polynésie, Antilles 2017-2022), Besançon (Amérique, Asie 2023 ; 2024-2025 avec numéros), aufutur (groupe 1 Asie 2025 `25GENHGEMCG11`) | à importer |

Les thèmes tombés, pour le récap : Première Guerre mondiale (2023), Seconde Guerre
mondiale (2019, 2024), Régime de Vichy et Résistance (2018, 2026), Le régime nazi
(2022), La guerre froide (2021), La décolonisation (2017, 2025) ; Les aires urbaines
(2017, 2019), Les espaces de faible densité (2021, 2023, 2026), Les territoires
ultramarins (2018), La France et l'Union européenne (2022), La France et l'Europe dans
le monde (2024), Les espaces productifs (2025) ; L'engagement citoyen (2019, 2023,
2024, 2026), La Défense nationale (2017), Le droit et la règle (2018), Les valeurs de
la République (2021), L'éducation aux médias (2022), Égalité femmes-hommes (2025).

### Français — DEUXIÈME LOT, Métropole importé

Sources : eduscol (`document/<id>/download`) et education.gouv.fr pour 2018 → 2024,
salle34.net pour 2017, letudiant pour 2026. Le sujet de français tient en un seul PDF
(questions-grammaire, dictée, rédaction) ; code `YYGENFRQGCME1` (2017 : `17GENFRQRME1`).
Chaque corrigé traite les quatre épreuves, **les deux sujets de rédaction compris** ;
le texte littéraire et la dictée restent dans le PDF officiel (citations courtes).

| Session | Code | État | Corrigé |
|---|---|---|---|
| 2017 Métropole | 17GENFRQRME1 | **importée** `francais-brevet-2017-metropole` | ≈ 6 400 mots |
| 2018 Métropole | 18GENFRQGCME1 | **importée** `francais-brevet-2018-metropole` | ≈ 6 800 mots |
| 2019 Métropole | 19GENFRQGCME1 | **importée** `francais-brevet-2019-metropole` | ≈ 6 200 mots |
| 2021 Métropole | 21GENFRQGCME1 | **importée** `francais-brevet-2021-metropole` | ≈ 7 000 mots |
| 2022 Métropole | 22GENFRQGCME1 | **importée** `francais-brevet-2022-metropole` — version « Arial 16 » du sujet (décision 7) | ≈ 6 900 mots |
| 2023 Métropole | 23GENFRQGCME1 | **importée** `francais-brevet-2023-metropole` — rédaction en version « Arial 16 » (décision 7) | ≈ 6 500 mots |
| 2024 Métropole | 24GENFRQGCME1 | **importée** `francais-brevet-2024-metropole` | ≈ 6 800 mots |
| 2025 Métropole | 25GENFRQGCME1 | **importée** (avant le chantier) | — |
| 2026 Métropole | 26GENFRQGCME1 | **importée** `francais-brevet-2026-metropole` | ≈ 6 700 mots |

### Mathématiques — DEUXIÈME LOT, Métropole importé

Sources : eduscol et education.gouv.fr pour 2018 → 2024, ac-martinique (version retapée)
pour 2017, letudiant pour 2026. Code `YYGENMATMEAG1` (2026 : `26GENMATME1`). Une partie
par exercice, chaque question en bloc `question` (démarche, calcul en KaTeX, réponse) ;
les scripts Scratch sont décrits en texte ; `theme` = le chapitre (« Probabilités »,
« Théorème de Thalès », « Programmes de calcul »…). La formule 2026 change : une partie
« Automatismes » (6 points) puis quatre exercices courts, le tout sur 20 points.

| Session | Code | État | Corrigé |
|---|---|---|---|
| 2017 Métropole | 17GENMATMEAG1 | **importée** `maths-brevet-2017-metropole` (sujet retapé par l'académie de Martinique, décision 8) | ≈ 4 200 mots |
| 2018 Métropole | 18GENMATMEAG1 | **importée** `maths-brevet-2018-metropole` | ≈ 4 400 mots |
| 2019 Métropole | 19GENMATMEAG1 | **importée** `maths-brevet-2019-metropole` | ≈ 4 100 mots |
| 2021 Métropole | 21GENMATMEAG1 | **importée** `maths-brevet-2021-metropole` | ≈ 2 800 mots |
| 2022 Métropole | 22GENMATMEAG1 | **importée** `maths-brevet-2022-metropole` | ≈ 2 600 mots |
| 2023 Métropole | 23GENMATMEAG1 | **importée** `maths-brevet-2023-metropole` | ≈ 2 300 mots |
| 2024 Métropole | 24GENMATMEAG1 | **importée** `maths-brevet-2024-metropole` | ≈ 2 500 mots |
| 2025 Métropole | 25GENMATMEAG1 | **importée** (avant le chantier) | — |
| 2026 Métropole | 26GENMATME1 | **importée** `maths-brevet-2026-metropole` | ≈ 2 300 mots |

### Sciences (physique-chimie, SVT) — DEUXIÈME LOT, Métropole importé

Le sujet de sciences est UN PDF pour deux disciplines (code `YYGENSCMEAG1` ; 2022 :
`22GENSCMEAG2`), tirées chaque année parmi physique-chimie, SVT et technologie. On
importe **une annale par discipline** à partir du même PDF (`physique-chimie-brevet-…`
et `svt-brevet-…`, PDF source identique), jamais la technologie (décision 9). En 2026,
l'épreuve passe à 10 + 10 points (décision 10).

| Session | Code | Disciplines au sujet | État | Corrigés |
|---|---|---|---|---|
| 2017 Métropole | 17GENSCMEAG1 | — | **introuvable** (eduscol, education.gouv.fr, letudiant, sites académiques : rien ; décision 9) | — |
| 2018 Métropole | 18GENSCMEAG1 | SVT + technologie | **importée** `svt-brevet-2018-metropole` | ≈ 1 400 mots |
| 2019 Métropole | 19GENSCMEAG1 | SVT + physique-chimie | **importées** `svt-brevet-2019-metropole`, `physique-chimie-brevet-2019-metropole` | ≈ 1 450 + 1 450 mots |
| 2021 Métropole | 21GENSCMEAG1 | physique-chimie + SVT | **importées** `physique-chimie-brevet-2021-metropole`, `svt-brevet-2021-metropole` | ≈ 1 250 + 1 250 mots |
| 2022 Métropole | 22GENSCMEAG2 | SVT + technologie | **importée** `svt-brevet-2022-metropole` | ≈ 1 750 mots |
| 2023 Métropole | 23GENSCMEAG1 | physique-chimie + SVT | **importées** `physique-chimie-brevet-2023-metropole`, `svt-brevet-2023-metropole` | ≈ 1 300 + 1 600 mots |
| 2024 Métropole | 24GENSCMEAG1 | physique-chimie + technologie | **importée** `physique-chimie-brevet-2024-metropole` | ≈ 1 550 mots |
| 2025 Métropole | 25GENSCMEAG1 | physique-chimie + SVT | **importées** (avant le chantier) | — |
| 2026 Métropole | 26GENSCMEAG1 | physique-chimie + SVT (10 + 10 points) | **importées** `physique-chimie-brevet-2026-metropole`, `svt-brevet-2026-metropole` | ≈ 1 250 + 1 450 mots |

Les thèmes tombés en sciences, pour le récap : SVT — immunité (2018), nutrition des
végétaux (2019), photosynthèse et pigments (2021), coraux et climat (2022), reproduction
de l'algue rouge (2023), météo, climat et épisode méditerranéen (2026) ; physique-chimie
— atome, CO2 et poids (2019), combustion, énergie et vitesse (2021), atome, dilatation
et altimétrie radar (2023), pH, réaction chimique et plongeon (2024), ions, conduction
et satellite (2026).

### Centres étrangers et septembre (brevet, toutes matières)

Non importés : voir la décision 1. Les sujets de septembre d'histoire-géo 2017, 2019,
2023 et 2024 sont téléchargés (tableau ci-dessus).

## 5. La marche à suivre pour une annale de plus

1. Télécharger le sujet officiel dans un dossier à part, vérifier `%PDF-` et le code en
   pied de page ; le recompresser : `python -I scripts/annales-recompresser.py <src> assets-sources/annales/sujets/<id>.pdf`.
2. Écrire le corrigé `contenu/annales/<id>.json` (guide `docs/annales-corrigees.md`, avec
   `theme` sur chaque partie — reprendre la graphie d'un thème déjà posé) ;
   `node scripts/annales-valider.mjs contenu/annales/<id>.json`.
3. `node scripts/annales-sujets.mjs <id>` → le sujet habillé dans `annales-out/` (hors
   git ; seuls les 42 premiers restent dans `public/annales/`, plafonné à 25 Mo).
4. `node scripts/annales-registre.mjs`, puis `npx vitest run lib/annales-corrigees`.
5. **Une migration** qui redéfinit `annale_connue` avec la liste complète des ids
   (modèle : `supabase/schema/599_annales_brevet_lot2.sql`, engendrée depuis le dossier
   pour que la liste soit exacte), inscrite dans `lib/sante.ts`, `_ASSOCIE/sonde-base.mjs`
   et `supabase/README.md` — sans elle, `lib/economie.test.ts` est rouge et l'annale ne
   paie ni XP ni gemmes. La nouvelle migration CONTIENT la précédente : on marque
   l'ancienne `remplaceePar` dans `lib/sante.ts`, car la rejouer après la nouvelle
   effacerait les ids ajoutés depuis.
6. Vérifier `/dev/annales?id=<id>` et l'onglet `/dev/annales?matiere=<m>&niveau=<n>`.
7. Déposer le sujet : `node scripts/annales-deposer.mjs <id>` (ou `--manquants` pour
   tout rattraper) — il faut `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`
   et `R2_BUCKET_ANNALES` dans `.env.local` (et sur Vercel pour la route).

## 6. Ce que Lucas doit faire

- **Exécuter la migration 600** (`supabase/schema/600_annales_bac_francais.sql`) dans le
  SQL Editor : elle redéfinit `annale_connue` avec les 82 annales du dépôt (les 8 du lot
  1, les 27 du lot 2 et les 5 du lot 3) ; elle **contient la 599** (qui contenait la 598),
  qui ne sont plus à coller — et surtout pas APRÈS elle, ce qui effacerait les annales
  ajoutées depuis. Sans la 600, les 40 nouvelles annales se lisent mais ne paient ni XP
  ni gemmes. Contrôle : `select public.annale_connue('francais-2024-metropole');` → true.
- **Le bucket R2 existe et les 82 sujets y sont** (au lot 3, le 25/10 au soir,
  `node scripts/annales-deposer.mjs --manquants` : 33 déposés — les 5 nouveaux et 28 des
  lots 1 et 2 régénérés avec la nouvelle couverture —, 49 déjà là, 0 échec). Reste à
  vérifier que `R2_BUCKET_ANNALES` (et les trois variables R2) sont bien posées **sur
  Vercel** : sans elles, la route de production renvoie vers `public/annales/`, où les 40
  nouveaux sujets ne sont pas (404 sur « Lire le sujet » pour ces 40-là seulement).
- Plus tard, quand la route servira tout depuis R2 : vider `public/annales/` (les 42
  premiers y sont encore, plafond 25 Mo).

## 7. Décisions à confirmer

1. **Les sujets de septembre** (« Métropole remplacement ») : importés comme des sessions
   à part entière (`centre: "Métropole (septembre)"`, id `…-metropole-septembre`), ou
   ignorés ? Ils comptent dans les fréquences du récap. Proposition : les importer après
   les sessions de juin de tous les centres.
2. **Le sujet 2021 de Métropole** est un scan (sans texte) : il se lit mais ne se cherche
   pas ; à remplacer si une version texte se trouve (académies, letudiant).
3. **Le coefficient** du brevet : `null` jusqu'en 2025 (l'épreuve ne porte pas de
   coefficient), `2` pour 2026 (affiché sur le sujet) — appliqué aux cinq annales 2026
   du dépôt (histoire-géo, français, maths, physique-chimie, SVT).
4. **Le brevet avant 2017** (ancienne formule, programmes 2008) : non retenu.
5. **La granularité des thèmes** : un thème = un chapitre du programme (« Les espaces de
   faible densité »), pas le sujet précis (« le Morvan ») — c'est ce qui rend le comptage
   utile. L'épreuve composée de SES reçoit le thème de sa partie 3.
6. **`assets-sources/annales/` n'est pas dans git** — **tranchée par Lucas (25/10/2026)** :
   les PDF sources restent hors git. Le validateur (`scripts/annales-valider.mjs`, donc
   aussi le test `lib/annales-corrigees/contenu.test.ts`) n'exige le PDF source que si le
   dossier `assets-sources/annales/sujets/` existe sur la machine ; ailleurs (CI, autre
   poste), seule la présence du sujet habillé (`annales-out/` ou `public/annales/`) est
   vérifiée.
7. **Les versions « Arial 16 »** (sujets en gros caractères, même contenu, même code
   repère) : acceptées comme sujet source quand la version standard est introuvable —
   français 2022 (questions-grammaire) et la rédaction de français 2023. À remplacer par
   la version standard si elle se trouve, sans toucher au corrigé.
8. **Le sujet de maths 2017** est la version retapée par l'académie de Martinique
   (repère `17GENMATMEAG1` reproduit, contenu identique, mise en page différente) : le
   corrigé le signale dans sa consigne. À remplacer par le PDF du ministère s'il se
   trouve.
9. **Les sciences** : le sujet 2017 de Métropole est introuvable (eduscol, education.gouv.fr,
   letudiant, sites académiques) — à reprendre si un lecteur le signale ; la technologie
   n'est jamais importée (pas de matière dans l'app) ; les années où une discipline
   n'était pas au sujet (SVT 2024, physique-chimie 2018 et 2022) n'ont pas d'annale, ce
   que le récap montre comme une absence et non comme un oubli.
10. **Le format 2026 des sciences** (10 + 10 points au lieu de 25 + 25) et des maths
    (automatismes + quatre exercices, sur 20) : les `points` des parties suivent le sujet
    (10 par discipline, 6 + 3 + 4 + 3 + 2 en maths), et la consigne de chaque corrigé
    2026 annonce la nouvelle formule.
11. **La session 2021 de français** (lot 3) : sujetdebac la présente en « Métropole 1 » et
    « Métropole 2 », mais c'est UNE épreuve, le jeudi 17 juin 2021, où deux documents
    étaient remis ensemble (adaptation après l'année de pandémie) : `21-FRGEME1` (Perec +
    dissertations de poésie) et `21-FRGEME1BIS` (Larbaud + dissertations de théâtre), huit
    sujets au choix. Importée comme **une seule annale** `francais-2021-metropole` à huit
    parties (« Commentaire · Perec », « Commentaire bis · Larbaud », « Sujet A/B/C »,
    « Sujet A/B/C bis »), code « 21-FRGEME1 · 21-FRGEME1BIS », PDF source = les deux
    documents fusionnés (7 pages). Deux annales auraient compté pour deux sessions dans le
    récap et faussé les fréquences.
12. **Le thème du commentaire** (bac de français) = l'**objet d'étude** (« Le roman et le
    récit », « La poésie », « La littérature d'idées »), pas le texte : un texte ne retombe
    jamais, l'objet d'étude si — c'est ce que le récap doit compter. Le titre de la partie
    porte l'auteur (« Commentaire · Sylvie Germain »). Les trois annales antérieures au
    chantier (2023 Métropole, 2024 Asie, 2025 Asie) ont été alignées sur ces deux champs
    seulement (« Diderot, Salon de 1767 » → « La littérature d'idées », etc.) ; rien
    d'autre n'y a été touché. Le thème des dissertations reste « Œuvre, Auteur », graphie
    déjà posée par ces trois annales.
13. **La couverture du sujet habillé** (`scripts/annales-sujets.mjs`) : la carte « Ce qui
    t'attend » s'adapte désormais à la place disponible (consigne 3 → 2 → 1 lignes, énoncés
    4 → 0 lignes, interligne 8 → 4) pour que toutes les parties tiennent au-dessus de la
    carte d'or. Avant, les parties au-delà de la troisième passaient sous la carte (maths
    2018 : exercices 4 à 7 invisibles) ; les huit parties de 2021 l'exigeaient. Les sujets
    habillés des lots 1 et 2 dans `annales-out/` ont été régénérés avec cette couverture ;
    les 42 de `public/annales/` n'ont pas été touchés (plafond 25 Mo, l'optimiseur
    ressert l'ancien fichier sous la même adresse).
