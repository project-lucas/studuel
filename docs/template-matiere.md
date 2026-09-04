# Le template d'une matière — l'onglet « Programme »

Référence visuelle et contrat de données de la page `/reviser/[matiere]`.
**Toute matière doit se lire comme ça.** Modèle validé sur l'anglais de
Terminale le 19/08/2026 (migration 243), appliqué à l'espagnol (244), à
l'histoire-géographie de 1re et de Tle (245, 246) et à l'enseignement
scientifique de Tle (248), puis à l’enseignement scientifique de 1re,
mathématiques comprises (258), et à l’anglais de 1re (266), qui reçoit le même
programme de langue que la Terminale — les programmes de LV s’écrivent pour le
cycle terminal, la grammaire y est la même. Réaligné le 04/09/2026 sur le code
(plus de numéro de chapitre, carte d'entrée, quiz du chapitre, jauge à la
moyenne).

## Ce que l'élève voit

```
┌──────────────────────────────────────────────┐
│  [icône]  Anglais                   ( 1 % )  │   header violet, ANNEAU du
│           Programme de 5e · 0/41 fiches      │   pourcentage à droite
│  ▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │   barre de progression
│  ( Programme )  ( 🎮 Mode de jeu )  ( Annales )│  onglets pilules
├──────────────────────────────────────────────┤   panneau crème, coins hauts
│  ON COMMENCE PAR ÇA                          │   arrondis, qui CHEVAUCHE
│  ┌────────────────────────────────────────┐  │   le header
│  │ (Commencer)                            │  │   la CARTE D'ENTRÉE, violette
│  │ Les noms                             → │  │   (ResumeCard) : le geste,
│  │ Le groupe nominal · ~6 min             │  │   la fiche, son chapitre,
│  └────────────────────────────────────────┘  │   sa durée
│  ┌────────────────────────────────────────┐  │
│  │ (25%)  Le groupe nominal            ⌃  │  │   chapitre DÉPLIÉ (celui de
│  │        ●●○○○○  0/6 fiches   [≡ Quiz]   │  │   la fiche à reprendre) ;
│  │                                        │  │   quiz SUR l'en-tête
│  │  ┌──────────────────────────────────┐  │  │
│  │  │ 1  Les noms · ~6 min          (+)│  │  │   fiche à reprendre : « + »
│  │  └──────────────────────────────────┘  │  │   JAUNE et liseré jaune
│  │  ┌──────────────────────────────────┐  │  │
│  │  │ 2  Les articles définis…      (+)│  │  │
│  │  └──────────────────────────────────┘  │  │
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │ ( 0%)  Le groupe verbal             ⌄  │  │   chapitres REPLIÉS
│  │        ○○○○○  0/5 fiches    [≡ Quiz]   │  │
│  └────────────────────────────────────────┘  │
│                    …                          │
└──────────────────────────────────────────────┘
```

**La carte d'entrée** (`components/reviser/ResumeCard.tsx`) répond à « par où
je commence ? » avant la liste. Elle écrit le libellé calculé par le serveur
(`resumeCta` : « Commencer » pour la première fiche jamais ouverte,
« Reprendre » pour la première fiche entamée), le titre de la fiche, le
chapitre qui la coiffe et sa durée estimée. C'est un **bouton** : il déplie
la fiche à sa place dans la liste et y amène l'écran — la carte ne
court-circuite pas la liste, elle y conduit. Elle disparaît quand tout est
terminé, et pendant une recherche.

**La carte de chapitre** (`components/reviser/ChapterList.tsx`) :

| Élément | Rôle | Style |
|---|---|---|
| Le médaillon | l'anneau du pourcentage du chapitre (48 px), comme celui du header ; disque d'or à la couronne une fois fini | `AnneauProgression`, gris à 0 %, jaune en marche |
| Le titre | l'intitulé du chapitre, mot pour mot celui du cours — **seul, sans numéro** | `font-heading` (Baloo), `text-lg`, `font-bold`, `text-balance` |
| Les pastilles | **une par fiche** : éteinte, jaune (entamée), violette (terminée) ; au-delà de 24 fiches, la barre (`ChapterProgressBar`) reprend | `h-2 w-3.5 rounded-full`, compte `0/6 fiches` dessous |
| `Quiz` | la commande du chapitre, **sur l'en-tête, replié ou non**, dès qu'il a ≥ 2 fiches | plaque violette 3D (`ListChecks`), or sur une carte finie |
| Chevron | la carte se déplie | pivote de 180° à l'ouverture |

**La robe de la carte dit l'effort** (`ChapitreEntete`, `ROBES`, `data-etat`) :
carte crème tant que rien n'est commencé (`vierge`), la même cernée de
**jaune solaire** dès le premier quiz (`entame`), **violet plein à texte
blanc et socle sombre** quand toutes les fiches sont terminées (`termine`) —
la plaque des boutons d'action, un trophée sur l'étagère. Le header porte le
même signal en grand : un **anneau de 64 px** (`AnneauProgression`) avec le
pourcentage de la matière, qui se remplit en jaune.

Il n'y a **plus de surtitre « CHAPITRE N »** (retiré le 28/08/2026) : le
numéro promettait un ordre que personne ne suit — chaque professeur traite le
programme dans la progression qu'il choisit — et il volait la place du titre.
C'était déjà la règle en philosophie ; elle vaut pour toutes les matières
(`lib/subject-template.ts`, bloc « il n'y a plus de numéro de chapitre »).

Le pliage est tenu **en état React** (`deplies`), pas en `<details>` natif :
la barre de recherche vit à l'intérieur du bloc, et un repli du navigateur que
React ne voit pas pourrait l'escamoter. **Une seule section est ouverte à
l'arrivée**, celle du chapitre à reprendre (`openGroupIndex`). Quatre en-têtes
tiennent dans un écran ; les 24 fiches dépliées d'un coup, non — c'est le mur
qu'on est venu supprimer. Déplier un chapitre le met sous le projecteur : les
autres blocs reculent à moitié d'opacité, sans être désactivés.

**La jauge d'un chapitre suit la règle du header** (`chapterGroupProgress`) :
la barre se remplit à la **moyenne des avancements** des fiches (un quiz à 50 %
la fait bouger), le compte écrit à côté ne dit que les fiches **terminées**
(≥ 80 %, `COMPLETE_THRESHOLD`). C'est exactement ce que fait la barre du header
avec `subjectProgress` — deux jauges, une règle.

**Le quiz du chapitre** : les contrôles tombent par chapitre, et l'examen blanc
tire sur toute la matière. Deux gestes suffisent (la matière, puis le quiz sur
l'en-tête, sans déplier). La pastille mène à
`/reviser/examen-blanc?subject=<slug>&chapitre=<thème>` : le même moteur
(chrono, pas de correction en route), restreint aux fiches du chapitre, avec
un bilan **fiche par fiche** à la fin. Le sujet s'équilibre entre les fiches
(`composeExam` tourne sur elles à tour de rôle).

**La ligne d'une fiche** (`ChapterItem.tsx`) porte son titre NU (« Les
déterminants »), son rang **dans le chapitre** en chiffre écrit dans la
pastille de gauche (plus de chiffres peints depuis le 04/09/2026), sa
durée estimée, ses couronnes gagnées (à partir de la première) et son état
(« En cours », « Terminé »). Pas de préfixe « Chapitre N · » : le mot
« chapitre » appartient à l'en-tête, seul endroit où il est vrai. Taper la
ligne la **déplie sur place** et découvre ses supports en rangée : Cours ·
Quiz · Flashcards · **Carte mentale** · Défi (· Mes erreurs, les jours où il y
en a). Le support s'appelle comme la page qu'il ouvre — il s'est appelé
« Fiches », mais le header compte déjà des fiches. La fiche à reprendre porte
son « + » en jaune.

**Le cours d'une fiche** (`[lesson]/cours/page.tsx`) s'ouvre sous le titre de
la **fiche** qu'on vient de taper ; le titre propre de la leçon, s'il diffère,
se lit dessous avec la matière.

## Le contrat de données

| En base | Ce que c'est à l'écran |
|---|---|
| `chapters.theme` | **le chapitre du programme** — l'en-tête de section |
| une ligne de `chapters` | **une fiche** de ce chapitre |
| `lessons` d'une fiche | les supports de la fiche (cours, révision, studygram, quiz) |

Le vocabulaire suit la donnée, automatiquement : dès qu'une matière porte des
thèmes, le header compte en **fiches** et non plus en chapitres (`chapterUnit`,
`lib/subject-template.ts`).

Sans aucun thème en base, la matière retombe sur la **liste à plat** d'avant :
une ligne = un chapitre, sans numéro ni en-tête. Aucune régression, et le
remplissage se fait matière par matière.

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
CTA « Reprendre » (et donc la carte d'entrée) est recalculé pour la même raison
— celui du dossier entier désignerait souvent un chapitre invisible dans
l'onglet ouvert. L'onglet « Mode de jeu » reste commun.

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

Le rayon Fiches est un seul bloc de 260 lignes : c'est le seul cas où l'en-tête
porte une **loupe** (`SEARCH_MIN_CHAPTERS`, un seul bloc). Un programme rangé
en chapitres n'en a pas — le rangement EST la navigation.

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
