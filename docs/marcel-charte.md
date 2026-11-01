# La charte de Marcel

> Écrite le 28/10/2026 après le constat de Lucas : « il y a chaque fois une incohérence
> entre chaque production, la couleur de peau, sa taille, rien n'est clair ». Cette page
> est LA référence : une illustration de Marcel qui ne la respecte pas ne sort pas.
> Les fichiers lourds vivent dans `assets-sources/marcel/` (hors git).

## 1. Le constat

Deux Marcel cohabitaient, et le premier dérivait :

| Famille | Où | Peau | Tenue | Silhouette |
|---|---|---|---|---|
| **Canon** | Play Store (25/10), Instagram | pêche `#EEA99A` | pull bleu roi, veste tweed | grosse tête, ≈ 2,5 têtes |
| Ancienne | app : `public/images/marcel/poses/`, `onboarding/marcel-*`, `nav/marcel`, `mascotte/marcel-bravo` | mate `#E3A08B` | costume trois-pièces marron, pas de pull | plus élancé |
| Dérive | buste `reference.png`, poses Insta `explique`, `dort` | rose `#EC9FA2` | — | — |

La dérive rose vient du buste `assets-sources/play-store/marcel/reference.png` : chaque
image tirée de lui seul glisse vers le rose bonbon. **Ce buste ne sert plus de référence.**

## 2. Le canon

- **L'étalon** : `assets-sources/play-store/marcel/plan.png` (Marcel au bloc-notes), avec
  `cafe.png` et `trophee.png`.
- **La fiche modèle** : `assets-sources/marcel/fiche-modele/turnaround-v1.png` (face,
  trois-quarts, profil, dos) et `expressions-v1.png` (douze expressions).
- **L'élément Higgsfield** `marcel-studuel` (id `9288fd69-152f-421e-8691-6af07b633fec`),
  fait des trois poses de l'étalon : il s'injecte dans un prompt par `<<<id>>>`.

## 3. L'ADN — ce qui ne change jamais

| | Valeur |
|---|---|
| Peau | pêche `#EEA99A`, joues rosées ; **jamais rose bonbon, jamais mate** |
| Cheveux | noir de jais à reflets indigo-violet, grande houppe dressée, deux mèches au-dessus des oreilles |
| Lunettes | rondes, grosse monture noire, larges branches noires |
| Yeux, sourcils | gris-brun ; sourcils noirs épais |
| Haut | col de chemise blanc, cravate marine, **pull bleu roi `#3D5B92` col V** |
| Veste | tweed à chevrons marron `#743F38`, coudières plus foncées |
| Bas | pantalon anthracite, chaussures de cuir marron foncé |
| Accessoire | montre argentée au poignet gauche |
| Silhouette | chibi, ≈ 2,5 têtes ; du haut des cheveux au pull ≈ 55 % de la hauteur |
| Trait | contour prune foncé épais, aplats ombrés à dégradés doux, fini « autocollant » brillant de jeu mobile |

**Interdits** : changer de tenue (pas de costume trois-pièces, pas de pull d'une autre
couleur), vieillir ou rajeunir le visage, des lunettes fines ou carrées, des cheveux bruns,
un second personnage qui lui ressemble, du texte dans l'image.

## 4. Fabriquer une illustration

1. Le prompt commence TOUJOURS par le bloc `assets-sources/marcel/adn.txt` (l'élément +
   la description), puis `SCENE: …`, puis la fin fixe : plein pied, fond blanc uni, ni
   sol ni décor, ni texte, un seul personnage.
2. Modèle : Nano Banana Pro (`nano_banana_pro`), format 3:4.
3. Détourage : `remove_background` de Higgsfield.
4. **Contrôle** (§ 5), puis entrée dans la bibliothèque (§ 6).

Un fond peint (une scène) se pose ENSUITE, autour du Marcel détouré : on ne lui demande
pas de se dessiner dans un décor, c'est là que la peau et la taille dérivent.

## 5. Le contrôle automatique

`node assets-sources/marcel/controle.mjs <images…>` mesure la peau, le pull et la veste et
les compare au canon (écart de couleur ΔE ; peau ≤ 9, pull ≤ 16, veste ≤ 22). Il refuse
aussi la peau « rose » (le vert doit dépasser le bleu d'au moins 4). `--debout` ajoute la
part de la tête pour une pose debout, bras le long du corps.

Un refus se VÉRIFIE À L'ŒIL : un objet couleur chair (pages lilas, carton) peut tromper
la mesure. Si le visage seul passe (le recadrer et le remesurer), l'image entre avec
`--forcer`.

Résultat sur l'existant au 28/10 : neuf poses du Play Store sur onze passent ;
`bras` et `reference` sont recalés pour le rose, comme les poses Instagram `explique`
et `dort`.

## 6. La bibliothèque — ne jamais servir deux fois la même image

`assets-sources/marcel/bibliotheque/<registre>/<nom>.png`, inventaire dans
`catalogue.json`, utilisations dans `utilisations.json`.

| Registre | Pour |
|---|---|
| `explique` | il montre, enseigne (tableau, doigt levé, loupe) |
| `serieux` | il travaille, corrige, réfléchit, prévient |
| `drole` | gags, maladresses, exagérations |
| `fete` | victoire, bravo, récompense |
| `emotion` | réconfort, surprise, inquiétude, fatigue |
| `app` | avec un téléphone, un écran, un objet de Studuel |
| `quotidien` | café, sommeil, trajet, bureau |

```
node assets-sources/marcel/bibliotheque.mjs choisir drole 3      # les moins servies d'abord
node assets-sources/marcel/bibliotheque.mjs utiliser drole/facepalm "post 5 erreurs, slide 4"
node assets-sources/marcel/bibliotheque.mjs liste
```

**Règle** : avant chaque post, story ou écran, `choisir`, puis `utiliser`. Une image déjà
servie ne revient que lorsque son registre n'a plus d'image neuve.

## 7. Ce qui reste à décider

- **L'ancien Marcel de l'app** (poses de `/marcel`, onboarding, onglet, mascotte) n'est pas
  au canon. Le redessiner au canon : une vingtaine d'images, mêmes noms de fichiers, servies
  sous de NOUVELLES adresses (l'optimiseur ressert l'ancienne image).
- Les poses Instagram `explique`, `salut`, `dort` et les carrousels qui les utilisent sont à
  refaire avec des Marcel de la bibliothèque.
