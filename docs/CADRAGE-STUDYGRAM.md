# Cadrage — le support « Studygram » (P2)

> Note de cadrage écrite par Lia (session `/jour` du 2026-07-14) **avant toute
> production**, comme demandé par le backlog. Objectif : décrire l'existant sans
> l'altérer, poser les options réalistes de pipeline, et sortir **une décision
> nette pour Lucas**. Rien n'a été produit ni modifié dans le code pour ce
> cadrage — c'est volontaire (le format n'est pas encore tranché).

## 1. Ce qu'est Studygram aujourd'hui (état réel, vérifié dans le code)

Studygram est le **4ᵉ support** d'une leçon-hub (à côté de Cours, Révision,
Quiz), et c'est aujourd'hui **une simple image externe** :

- **Donnée** : `lessons.studygram_url` — une **URL d'image** (colonne texte
  nullable). Type dans `lib/types.ts` (`studygram_url?: string | null`).
- **Affichage** : `app/reviser/[subject]/[chapter]/[lesson]/studygram/page.tsx`
  rend un `<img src={lesson.studygram_url}>` plein cadre (pas de `next/image` :
  le domaine des images n'est pas connu à l'avance — choix assumé dans le code).
- **Saisie** : dans le studio admin (`components/admin/AdminLessonEditor.tsx`,
  onglet « Studygram »), on **colle une URL d'image** (placeholder : « format
  9:16 conseillé ») avec aperçu. Aucune génération, aucun upload : juste une URL.
- **Avancement** : `lib/lesson-progress.ts` ne compte le support **que s'il
  existe** (`hasStudygram = Boolean(l.studygram_url)`, cf.
  `app/reviser/[subject]/page.tsx:124` et la page leçon `:81`). La tuile n'est
  cliquable que si l'URL est présente (`href: hasStudygram ? … : null`).

**Conséquence importante** : « Studygram à 0 % » **ne pénalise PAS** l'anneau de
progression ni l'UX aujourd'hui. C'est un support **optionnel** qui n'apparaît
que là où une image a été fournie. Il n'y a donc **aucune urgence P0/P1** : le
produit est cohérent sans lui. C'est un **bonus d'engagement**, pas un manque
bloquant.

## 2. Le vrai problème : asset visuel, pas contenu texte

Les quiz et les fiches ont pu être produits en masse **parce que ce sont du
texte** (SQL). Un Studygram, dans sa forme actuelle, est une **image décorée**
(type post Instagram de révision) hébergée quelque part. **Une session de code
ne peut pas fabriquer 538 images.** Produire du Studygram « comme c'est
aujourd'hui » = un chantier **design + hébergement**, pas un chantier d'agent.

→ **Conclusion directe** : sous le format actuel (URL d'image externe), le
« premier lot Studygram » du backlog **est bloqué** côté agent. Il faut soit des
assets fournis par Lucas, soit **changer la nature du support** (option B).

## 3. Deux pipelines réalistes

### Option A — Vraies images (statu quo, chantier design)

Des visuels 9:16 décorés sont créés (Canva / nano-banana, cf.
`docs/nano-banana-prompts.md`), **hébergés** (Supabase Storage ou CDN), puis
leurs URL collées dans l'admin (ou injectées par migration).

- ✅ Rendu « waouh » authentique (vraie carte illustrée).
- ❌ **Non automatisable par un agent** : coût humain de design × 538 leçons,
  hébergement à gérer, maintenance des URL. Irréaliste à l'échelle actuelle.
- **Verdict** : réservé à quelques leçons vitrines, pas à une couverture large.

### Option B — Studygram **rendu par l'app** depuis des données texte (recommandé)

On redéfinit Studygram comme une **carte mémo générée** : quelques punchlines à
retenir (titre + 3-5 points clés + une astuce/mnémo), que **l'app compose** en
un visuel façon « fiche Insta » (thème couleur de la matière, typo Baloo, motif
de fond — briques déjà présentes via `subjectTheme` / `GRID_PATTERN`).

- La **donnée devient du texte** → **productible en masse** comme les quiz/fiches
  (même méthode : mesurer les chapitres, fan-out de sous-agents, validation
  hors-ligne, commit par matière).
- **Additif et non destructif** : nouvelle colonne `studygram_card jsonb`
  nullable ; `hasStudygram = Boolean(studygram_url || studygram_card)` ; la page
  rend la carte composée si `studygram_card`, sinon l'`<img>` existante. Zéro
  régression sur les leçons qui ont déjà une image.
- ✅ Cohérent avec le design system « crème & violet », pas d'hébergement, pas
  d'assets externes, testable (composant pur + snapshot).
- ⚠️ **C'est un changement de définition produit** : Studygram n'est plus « une
  image IG » mais « une carte mémo maison ». À **valider par Lucas** avant de
  produire.

**Effort estimé Option B** : migration additive (~S) + composant de carte + son
test (~M) + branchement page/admin (~S) = socle ~M/L, **puis** production de
contenu en masse (~XL, réparti par matière). Le socle est finissable en une
session ; la production suit une fois le format validé.

## 4. Décision attendue de Lucas

- [ ] **A** — Garder Studygram = image externe. Alors Lucas fournit des assets
      (ou une source d'images) ; l'agent ne peut que **brancher des URL**, pas
      créer les visuels. Studygram reste à ~0 % tant qu'il n'y a pas d'assets.
- [ ] **B (recommandé)** — Passer Studygram à une **carte mémo rendue par
      l'app** (schéma additif, non destructif). L'agent construit le socle
      (migration + composant + branchement) puis **produit le contenu en masse**
      comme pour les quiz/fiches. → décochage réel de « Studygram à 0 % ».
- [ ] **C** — Ne rien faire pour l'instant : Studygram reste un bonus optionnel
      non bloquant ; on priorise ailleurs (polish Défi/Réviser/Moi).

**Recommandation de Lia : B.** C'est le seul chemin qui rend le 4ᵉ support
*réellement livrable à l'échelle* sans dépendre d'un chantier design externe, et
il est non destructif (les rares images déjà en place restent affichées).

## 5. En attendant la décision

Comme le format n'est pas tranché et que Studygram **n'est pas bloquant**, cette
session **ne produit pas** de Studygram et **bascule sur les fallbacks sûrs**
(contenu pur, zone 100 % sûre) : quiz des rares chapitres cœur restants (P1) et
retrofit de la variété de `correct_index` dans les anciens quiz (P3). Voir
`_ASSOCIE/BACKLOG-JOUR.md`.
