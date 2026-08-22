# Le template d'une matière — l'onglet « Programme »

Référence visuelle et contrat de données de la page `/reviser/[matiere]`.
**Toute matière doit se lire comme ça.** Modèle validé sur l'anglais de
Terminale le 19/08/2026 (migration 243), appliqué à l'espagnol (244), à
l'histoire-géographie de 1re et de Tle (245, 246) et à l'enseignement
scientifique de Tle (248), puis à l’enseignement scientifique de 1re,
mathématiques comprises (258), et à l’anglais de 1re (266), qui reçoit le même
programme de langue que la Terminale — les programmes de LV s’écrivent pour le
cycle terminal, la grammaire y est la même.

## Ce que l'élève voit

```
┌──────────────────────────────────────────────┐
│  [icône]  Anglais                            │   header violet (ou décor
│           Programme de Tle · 0/24 fiches · 0%│   d'arène de la matière)
│  ▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │   barre de progression
│  ( Programme )  ( 🎮 Mode de jeu )  ( Annales )│  onglets pilules
├──────────────────────────────────────────────┤   panneau crème, coins hauts
│  ┌────────────────────────────────────────┐  │   arrondis, qui CHEVAUCHE
│  │ CHAPITRE 1                          ⌄  │  │   le header
│  │ Le groupe nominal                      │  │
│  │ 0/3 fiches                             │  │
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │ CHAPITRE 2                          ⌄  │  │
│  │ Le groupe verbal                       │  │
│  │ 0/5 fiches                             │  │
│  └────────────────────────────────────────┘  │
│                    …                          │
└──────────────────────────────────────────────┘
```

**La carte de chapitre** (`components/reviser/ChapterList.tsx`) :

| Élément | Rôle | Style |
|---|---|---|
| `CHAPITRE N` | le numéro du chapitre **du programme** | `text-primary`, `text-xs`, `uppercase`, `font-extrabold`, `tracking-wide` |
| Le titre | l'intitulé du chapitre, mot pour mot celui du cours | `font-heading` (Baloo), `font-bold`, `text-balance` |
| `0/3 fiches` | avancement dans le chapitre | `text-xs`, `font-semibold`, `text-muted-foreground`, `tabular-nums` |
| Chevron | la carte se déplie | pivote de 180° à l'ouverture |

La carte est un `<details>` : **une seule section est ouverte à l'arrivée**,
celle du chapitre à reprendre. Quatre en-têtes tiennent dans un écran ; les 24
fiches dépliées d'un coup, non — c'est le mur qu'on est venu supprimer.

**La ligne dépliée** (`ChapterItem.tsx`) porte son titre NU (« Les
déterminants »), son rang **dans le chapitre** dans la pastille de gauche, sa
durée estimée, ses couronnes gagnées et son état. Pas de préfixe « Chapitre N ·»
: le mot « chapitre » appartient à l'en-tête, seul endroit où il est vrai.

**La matière sans ordre imposé.** Une matière qui n'est PAS rangée par thèmes
garde, elle, le préfixe « Chapitre N · » de sa liste à plat — sauf si son
programme est une liste sans ordre. C'est le cas de la **philosophie** : ses
notions se traitent dans l'ordre que choisit le professeur, et « Chapitre 8 · Le
devoir » promettrait une progression qui n'existe pas, tout en volant la vedette
à la notion. La liste s'y écrit donc en titres nus (`chaptersAreNumbered`,
`lib/subject-template.ts` — une seule liste de slugs à compléter). La pastille
de gauche garde son chiffre : c'est un repère de place à l'écran et le
porte-drapeau de l'état « terminé », pas une promesse d'ordre.

## Le contrat de données

| En base | Ce que c'est à l'écran |
|---|---|
| `chapters.theme` | **le chapitre du programme** — l'en-tête de section |
| une ligne de `chapters` | **une fiche** de ce chapitre |
| `lessons` d'une fiche | les supports de la fiche (cours, révision, studygram, quiz) |

Le vocabulaire suit la donnée, automatiquement : dès qu'une matière porte des
thèmes, le header compte en **fiches** et non plus en chapitres (`chapterUnit`,
`lib/subject-template.ts`), et l'onglet « Mode de jeu » affiche le chapitre du
programme en surtitre au lieu du rang de la fiche.

Sans aucun thème en base, la matière retombe sur la **liste à plat** d'avant :
« Chapitre 1 · Nombres et calculs », « Chapitre 2 · … ». Aucune régression, et
le remplissage se fait matière par matière.

## Les matières qui en réunissent deux

`chapters.discipline` (migration 247) vaut `'histoire'` ou `'geographie'` — ou
`NULL`, l'état par défaut de tout le reste du contenu. Dès qu'une matière porte
**deux** disciplines, l'onglet « Programme » laisse place à **un onglet par
discipline** (`disciplinesOf` → `modesFor`, testés) :

```
( Histoire )  ( Géographie )  ( 🎮 Mode de jeu )  ( Annales )
```

Chaque onglet ne montre que ses chapitres, et le header compte **ses** fiches :
annoncer « 0/53 fiches » au-dessus de la seule géographie serait un mensonge. Le
CTA « Reprendre » est recalculé pour la même raison — celui du dossier entier
désignerait souvent un chapitre invisible dans l'onglet ouvert. L'onglet « Mode
de jeu » reste commun, mais son surtitre nomme la discipline.

Les onglets sont identifiés par un **`tabId`** (`programme:geographie`) et non
par leur clé, puisque deux onglets partagent désormais `programme` ; `?onglet=`
accepte l'identifiant complet, la clé seule (qui ouvre la première discipline)
et les anciennes clés de format.

## Les matières qui ont plusieurs RAYONS

Le français a élargi ce mécanisme, et c'est assumé : ses trois rayons ne sont
pas trois disciplines mais trois **usages** du même dossier —

```
( Programme )  ( Fiches )  ( Grammaire )  ( 🎮 Mode de jeu )  ( Annales )
```

`chapters.discipline` y vaut `programme` (les quatre objets d'étude du bac et
leurs œuvres), `fiches` (le rayon des fiches de lecture : 260 œuvres qu'on vient
chercher une par une, jamais dans l'ordre) ou `grammaire` (les points de langue
interrogés à l'oral). Le besoin est exactement celui de l'histoire-géo — couper
une liste que personne ne parcourt en entier — et le mécanisme est le même,
jusqu'au compte du header et au CTA « Reprendre » recalculés par rayon. Une
colonne `section` en doublon de `discipline` n'aurait rien réglé de plus.

Deux conséquences pratiques :

1. **Le format d'une fiche dépend de son rayon.** Les fiches du Programme sont
   longues (on les révise pour l'oral), celles du rayon Fiches sont courtes et
   complètes (on les consulte) : histoire, personnages, ce qu'il faut retenir,
   une phrase à citer, six questions.
2. **Les titres du rayon Fiches portent l'auteur** (« Manon Lescaut, abbé
   Prévost ») là où le Programme porte le titre nu (« Manon Lescaut »). Ce n'est
   pas décoratif : `chapters` est UNIQUE(subject_id, level, title), et c'est ce
   qui permet à une même œuvre d'exister dans les deux rayons — étudiée d'un
   côté, retrouvée de l'autre.

L'ordre des onglets est celui des `position` : chaque module de contenu déclare
son `positionDepart` (programme 1→48, fiches 100→359, grammaire 500→509).

Une matière n'est PAS dédoublée en base pour autant : le bulletin, le bac, la
moyenne, le classement et le boss disent « Histoire-Géographie ». La distinction
n'existe qu'à l'intérieur du dossier — c'est un problème d'affichage, il se
règle à l'affichage.

## Les trois règles

1. **Le dossier d'une matière ne montre que son programme.** Rien à côté : pas
   d'axe culturel isolé, pas de fiche de synthèse maison, pas de chapitre hérité
   d'un vieux jeu de données. Une ligne de trop rouvre le doute sur toutes les
   autres — c'est ce qu'ont coûté les 4 faux axes d'anglais et la fiche
   « Le monde hispanique aujourd’hui » en espagnol.
2. **Les intitulés sont ceux du cours**, mot pour mot. L'élève doit reconnaître
   le sommaire de son classeur, pas une reformulation.
3. **Un thème sur une fiche, sinon aucun.** Une matière à moitié rangée affiche
   un groupe « Autres chapitres » : c'est un aveu, pas une catégorie.

## Le piège du cache

`getProgrammeCached` sert le programme depuis un cache de **300 s** : un
chapitre supprimé en base y survit jusqu'à l'expiration et continue de
s'afficher — sans thème, donc dans un groupe « Autres chapitres » fantôme. La
page les écarte en croisant le catalogue caché avec le select des axes, qui est
frais (`app/reviser/[subject]/page.tsx`). Après un ménage de contenu, vérifier
la matière **dans l'app**, pas seulement en base.

## Appliquer ce template à une matière

1. Sonder l'existant : `node _ASSOCIE/sonde-chapitres.mjs <niveau> <slug>`.
2. Comparer au programme officiel (le BO, ou le sommaire fourni par Lucas).
3. Écrire une migration numérotée idempotente qui, dans cet ordre :
   les lignes `review_items` des questions qui partent → les quiz orphelins
   (`quizzes.lesson_id` est ON DELETE SET NULL) → les chapitres hors programme
   (leçons en cascade) → l'`UPDATE` des positions **écrites une à une** et des
   `theme`. Finir par un `DO $$` qui compte et crie si le total est faux.
4. Ajouter l'entrée dans `lib/sante.ts` **et** dans `_ASSOCIE/sonde-base.mjs`.
