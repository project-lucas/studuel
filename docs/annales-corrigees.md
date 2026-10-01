# Annales corrigées : le guide de rédaction

Un **sujet officiel** (le PDF du ministère, habillé aux couleurs de Studuel par
`scripts/annales-sujets.mjs`) et son **corrigé Studuel**, écrit par nous, en JSON
dans `contenu/annales/<id>.json`. Les types sont dans `lib/annales-corrigees/types.ts`,
la relecture automatique dans `scripts/annales-valider.mjs` (l'outil des rédacteurs, repris tel quel par `lib/annales-corrigees/contenu.test.ts`).

## 1. La règle d'or : le corrigé est À NOUS

Les corrigés reçus avec les sujets viennent d'un site concurrent (SchoolMouv).
**On ne les reprend pas, même reformulés** : dans une dissertation, un commentaire ou
une étude de documents, la problématique, le plan et le choix des exemples SONT
l'œuvre protégée ; les suivre de près en changeant les mots reste une copie.

- **Philosophie, HLP, français, SES, HGGSP** : on n'ouvre pas le corrigé tiers. On part
  du sujet officiel, du programme et de sa propre culture.
- **Maths, physique-chimie, SVT, NSI** : on résout soi-même, puis on peut comparer ses
  **résultats** (valeurs numériques, réponse finale) au corrigé tiers pour attraper une
  erreur de calcul. Un résultat n'appartient à personne ; la rédaction, les astuces et
  la présentation, si. Rien n'en est recopié.

## 2. L'esprit

Un bon corrigé Studuel n'est pas une copie modèle à admirer : c'est **une méthode
qu'on voit travailler**. L'élève doit pouvoir s'arrêter à n'importe quel étage :

1. **En 30 secondes** (`enBref`, 3 à 5 phrases) : la problématique et le plan, ou les
   résultats clés d'un exercice. Celui qui n'a que ça doit déjà savoir quoi faire.
2. **L'analyse** : les mots du sujet, ce qu'il présuppose, le piège d'interprétation.
3. **Le corrigé** : plan détaillé ou questions une à une.
4. **Les encadrés** : `astuce` (le conseil Studuel, une méthode qui resservira),
   `piege` (l'erreur fréquente), `attendu` (ce que le correcteur note).

On **tutoie** l'élève (« tu »), comme partout dans l'app. Phrases courtes, vocabulaire
exact, pas de jargon gratuit. Pas d'emoji. Pas de « nous allons voir que ».

## 3. Par nature d'épreuve

**Dissertation (philo, français, SES, HGGSP) / essai (HLP)**
- `titre` « Analyser le sujet » : définitions des termes, présupposé, tension.
- `titre` « Problématique » : une question en `reponse`.
- `titre` « Introduction rédigée » : 1 paragraphe complet (accroche → définition →
  problématique → annonce du plan).
- Pour chaque grande partie : un `titre` (« I. … »), puis chaque sous-partie en
  `texte` qui commence par l'idée en **gras**, développe l'argument, et donne
  l'exemple ou la référence précise (auteur, œuvre, date, chiffre, étude de cas).
- `titre` « Conclusion rédigée » : 1 paragraphe complet.
- Au moins une `astuce`, un `piege`, un `attendu`.
- Longueur : 1 200 à 2 000 mots par partie.

**Explication de texte (philo) / commentaire (français) / interprétation (HLP)**
- Thèse, enjeu, structure du texte (mouvements avec leurs lignes).
- Explication mouvement par mouvement (ou axes pour le commentaire), avec
  **citations courtes** du texte officiel entre guillemets.
- Introduction et conclusion rédigées.

**Étude critique de documents (HGGSP) / épreuve composée (SES)**
- Présentation des documents (nature, auteur, date, contexte).
- Plan répondant à la consigne, chaque idée confrontée aux documents ET complétée
  par les connaissances. L'épreuve composée : ses trois parties sont des `question`.

**Exercices (maths, physique-chimie, SVT, NSI)**
- Une partie par exercice (`nature: "exercice"`, `points` du sujet).
- Chaque question du sujet est un bloc `question` (`numero` « 1.a », `intitule` =
  l'énoncé abrégé), avec la démarche, les calculs, et la réponse finale en `reponse`.
- Formules en KaTeX : `$f'(x) = \\frac{0{,}0288}{(0{,}93x+0{,}03)^2}$` en ligne, ou un
  bloc `formule`. Virgule décimale française : `0{,}93`. Unités en `\\text{ m·s}^{-1}`.
- NSI : le code en bloc `code` (Python, SQL), indenté de 4 espaces, qui s'exécute.
- SVT exercice 1 (restitution) : comme une dissertation courte (intro, parties, conclusion).
- SVT / PC : on nomme le document exploité (« Document 2 : … ») avant d'en tirer quoi que ce soit.

## 4. Le format

```json
{
  "id": "philosophie-2024-amerique-nord",
  "matiere": "philosophie",
  "niveau": "Tle",
  "examen": "bac",
  "annee": 2024,
  "centre": "Amérique du Nord",
  "jour": null,
  "code": "24-PHGEAN1",
  "titre": "Bac 2024 — Philosophie",
  "dureeMin": 240,
  "coefficient": 8,
  "consigne": "Trois sujets au choix : deux dissertations et une explication de texte. Tu en traites un seul.",
  "parties": [
    {
      "id": "sujet-1",
      "titre": "Sujet 1",
      "nature": "dissertation",
      "enonce": "Comment être heureux, si rien ne dure ?",
      "points": 20,
      "minutes": 240,
      "enBref": ["…", "…", "…"],
      "blocs": [
        { "type": "titre", "texte": "Analyser le sujet" },
        { "type": "texte", "texte": "**Le bonheur** désigne…" },
        { "type": "astuce", "texte": "…" }
      ]
    }
  ]
}
```

Blocs : `titre`, `texte`, `liste` (`items`, `ordonnee`), `formule` (`tex`), `code`
(`langage` : python · sql · texte), `tableau` (`entetes`, `lignes`), `citation`
(`texte`, `source`), `astuce`, `piege`, `attendu`, `reponse`, `question`
(`numero`, `intitule`, `points`, `blocs` — jamais de question dans une question).

Balisage du texte courant : `**gras**`, `*italique*`, `` `code` ``, `$TeX$`. Rien d'autre
(pas de HTML, pas de lien, pas de `#`). Dans le JSON, un antislash TeX s'écrit
doublé : `"$\\frac{1}{2}$"`.

`id` = nom du fichier = nom du PDF dans `assets-sources/annales/sujets/`. `matiere` est
le slug de `subjects` : philosophie · hlp · hggsp · ses · maths · physique-chimie ·
svt · nsi · francais. `code` : le code officiel imprimé en pied de page du sujet
(« 24-PHGEAN1 »), `""` s'il n'y en a pas (sujets zéro).

## 5. Publier une annale

1. Le sujet officiel (PDF du ministère) dans `assets-sources/annales/sujets/<id>.pdf`. Les
   sujets de 2021 à 2025 viennent de sujetdebac.fr, qui héberge les PDF officiels
   (`/annales-pdf/<année>/<page>-sujet-officiel.pdf`) ; leurs images ont été recompressées
   (PyMuPDF, 150 dpi, qualité 72) sans toucher au texte.
2. Le corrigé dans `contenu/annales/<id>.json`, relu par `node scripts/annales-valider.mjs`.
3. `node scripts/annales-sujets.mjs <id>` : le sujet habillé (couverture Studuel, bandeau et
   pagination sur chaque page officielle) dans `public/annales/<id>.pdf`. Il lit les
   métadonnées du corrigé : à relancer si elles changent.
4. `node scripts/annales-registre.mjs` : le registre serveur (`lib/annales-corrigees/registre.ts`).

L'annale apparaît alors dans l'onglet Annales de sa matière (Réviser › matière › Annales,
classe 1re ou Tle), sous « Les sujets tombés, corrigés » ; sa page est
`/reviser/<matière>/annales/<id>`, le lecteur du sujet `…/sujet`. Aperçu sans compte :
`/dev/annales` (développement seulement).

## 6. Relecture

```bash
npx vitest run lib/annales-corrigees
```

Le test refuse : un champ manquant, un bloc inconnu, une formule que KaTeX ne sait pas
lire, un sujet sans PDF, une annale écrite mais pas au registre (`contenu/annales/`
est lu en entier), et une partie dont l'`enBref` est vide.
