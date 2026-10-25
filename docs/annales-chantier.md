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

## 2. Les sources

| Source | Ce qu'elle donne | Fiabilité |
|---|---|---|
| **sujetdebac.fr** | Tous les sujets du bac 2021 → 2026 (général : philosophie, français 1re, toutes les spécialités), par session et par centre, **PDF officiels** du ministère : `https://www.sujetdebac.fr/annales-pdf/<année>/<session>-sujet-officiel.pdf`. Pas de brevet. | Le PDF est celui du ministère (code repère en pied de page). Déjà utilisé pour les 42 premières annales. |
| **aufutur.fr** (média) | Les sujets du brevet par année, PDF officiels nommés par leur code (`https://aufutur.fr/wp-content/uploads/<année>/<mois>/<CODE>.pdf`, ex. `2024/07/24GENHGEMCME.pdf`, `2025/06/25GENHGEMCME1.pdf`). | PDF officiel tel quel. Couvre 2023 → 2026. |
| **hg.ac-besancon.fr** (académie de Besançon, histoire-géographie) | Les sujets du DNB d'histoire-géographie-EMC 2023, 2024, 2025 (juin, septembre, centres étrangers, série pro). | Site académique, PDF officiels. |
| **salle14.jimdofree.com** (site d'un professeur) | Les sujets du DNB d'histoire-géographie 2017 → 2022 (Métropole juin et septembre, Pondichéry, Washington, Liban, Polynésie, Antilles). | PDF officiels (code repère vérifié), parfois scannés (2021). Le fichier « Remplacement 2018 » est en réalité le sujet de septembre 2017. |
| **letudiant.fr** | Les sujets du brevet par année (`https://medias.letudiant.fr/corriges/brevet/histoiregenerale.pdf` = Métropole 2026). | PDF officiel ; l'adresse est réécrite chaque année (à télécharger vite). |
| **eduscol.education.gouv.fr** (annales du DNB) | La page officielle « Préparer le DNB avec les sujets des annales ». | **Inaccessible par script** (403), à ouvrir dans un navigateur. |
| **education.gouv.fr**, **apmep.fr** (maths), **labolycee.org** (physique-chimie), **brevetdescolleges.fr** | Pas encore exploités : APMEP et Labolycée republient les sujets de maths et de physique-chimie avec leurs propres corrigés (**à ne jamais lire**) ; brevetdescolleges.fr n'a pas répondu (TLS). | — |

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
| 2026 | Amérique du Nord · Antilles-Guyane · Asie · Centres étrangers · Métropole · Métropole secours · Polynésie · Polynésie remplacement |
| 2025 | Amérique du Nord · Amérique du Sud · Antilles-Guyane · Antilles-Guyane remplacement · **Asie** ✓ · Centres étrangers · Métropole · Métropole remplacement · Métropole secours · Nouvelle-Calédonie · Polynésie · Polynésie remplacement |
| 2024 | Amérique du Nord · Antilles-Guyane · Antilles-Guyane remplacement · **Asie** ✓ · Centres étrangers · Métropole · Métropole remplacement · Polynésie · Polynésie remplacement |
| 2023 | Amérique du Nord · Antilles-Guyane · Antilles-Guyane remplacement · Asie · Centres étrangers · **Métropole** ✓ · Métropole remplacement · Nouvelle-Calédonie · Polynésie · Polynésie remplacement |
| 2022 | Amérique du Nord · Amérique du Nord remplacement · Amérique du Sud · Antilles-Guyane · Antilles-Guyane remplacement · Asie · Centres étrangers · Métropole · Métropole remplacement · Nouvelle-Calédonie · Polynésie · Polynésie remplacement · sujet zéro jour 1 |
| 2021 | Amérique du Nord jour 1 · Amérique du Nord jour 2 · Antilles-Guyane jour 1 · Antilles-Guyane jour 2 · Antilles-Guyane remplacement · Asie jour 1 · Asie jour 2 · Centres étrangers jour 1 · Centres étrangers jour 2 · Métropole jour 1 · Métropole jour 2 · Métropole remplacement · Polynésie jour 1 · Polynésie jour 1, remplacement · Polynésie jour 2 · Polynésie jour 2, remplacement |

68 sessions trouvées, 3 importées (✓ en gras).

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

### Français, mathématiques, sciences (brevet)

| Matière | Sessions repérées | État |
|---|---|---|
| Français | Métropole 2025 (importée). aufutur 2025 : `25GENFRQGCME1` (questions-grammaire), `25GENFRDAME1` (dictée), `25GENFRRME1-1` (rédaction) ; 2023-2026 par aufutur/letudiant ; 2017-2022 à chercher (letudiant, sites académiques de lettres). | 1 importée |
| Mathématiques | Métropole 2025 (importée). aufutur 2025 `25GENMATMEAG1` ; 2017 → 2026 par l'APMEP (`apmep.fr`, rubrique « Annales du brevet », sujets seuls à prendre) et letudiant. | 1 importée |
| Sciences (physique-chimie, SVT) | Métropole 2025 (importées, une par discipline). aufutur 2025 `25GENSCMEAG1` ; les autres années par letudiant et les sites académiques de SVT/physique. | 2 importées |

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
   (modèle : `supabase/schema/598_annales_brevet_histoire_geo.sql`), inscrite dans
   `lib/sante.ts`, `_ASSOCIE/sonde-base.mjs` et `supabase/README.md` — sans elle,
   `lib/economie.test.ts` est rouge et l'annale ne paie ni XP ni gemmes.
6. Vérifier `/dev/annales?id=<id>` et l'onglet `/dev/annales?matiere=<m>&niveau=<n>`.
7. Déposer le sujet : `node scripts/annales-deposer.mjs <id>` (ou `--manquants` pour
   tout rattraper) — il faut `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`
   et `R2_BUCKET_ANNALES` dans `.env.local` (et sur Vercel pour la route).

## 6. Ce que Lucas doit faire

- **Exécuter la migration 598** (`supabase/schema/598_annales_brevet_histoire_geo.sql`)
  dans le SQL Editor : elle redéfinit `annale_connue` avec les huit nouvelles annales ;
  sans elle, elles se lisent mais ne paient ni XP ni gemmes.
- Créer le bucket Cloudflare R2 **`studuel-annales`** (il peut rester privé : la route
  sert les fichiers), et poser `R2_BUCKET_ANNALES=studuel-annales` dans `.env.local` et
  sur Vercel, à côté des trois variables R2 déjà prévues pour les fiches. Tant que ce
  n'est pas fait, les huit nouveaux sujets ne sont servis qu'en local (`annales-out/`) ;
  en production la route renverrait vers `public/annales/`, où ils ne sont pas (404 sur
  « Lire le sujet » pour ces huit-là seulement).
- Puis `node scripts/annales-deposer.mjs` une fois (dépose les 50 sujets, les 42 de
  `public/` compris, ce qui permettra plus tard de vider `public/annales/`).

## 7. Décisions à confirmer

1. **Les sujets de septembre** (« Métropole remplacement ») : importés comme des sessions
   à part entière (`centre: "Métropole (septembre)"`, id `…-metropole-septembre`), ou
   ignorés ? Ils comptent dans les fréquences du récap. Proposition : les importer après
   les sessions de juin de tous les centres.
2. **Le sujet 2021 de Métropole** est un scan (sans texte) : il se lit mais ne se cherche
   pas ; à remplacer si une version texte se trouve (académies, letudiant).
3. **Le coefficient** du brevet : `null` jusqu'en 2025 (l'épreuve ne porte pas de
   coefficient), `2` pour 2026 (sous-épreuves 1,5 + 0,5, affiché sur le sujet).
4. **Le brevet avant 2017** (ancienne formule, programmes 2008) : non retenu.
5. **La granularité des thèmes** : un thème = un chapitre du programme (« Les espaces de
   faible densité »), pas le sujet précis (« le Morvan ») — c'est ce qui rend le comptage
   utile. L'épreuve composée de SES reçoit le thème de sa partie 3.
6. **`assets-sources/annales/` n'est pas dans git** : le validateur (et donc la CI)
   exige pourtant le PDF source. À trancher : suivre ces sources dans git (≈ 28 Mo), ou
   ne vérifier leur présence que dans le script, pas dans le test.
