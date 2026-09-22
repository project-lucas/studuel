# L'Encyclopédie — guide de rédaction

Ce document est le contrat d'écriture des fiches de l'encyclopédie du dossier
Histoire-Géo (`/reviser/histoire-geo/encyclopedie`). Il vaut pour les fiches
déjà écrites comme pour celles à venir : **une fiche qui ne respecte pas ce
guide ne passe pas le test** (`lib/encyclopedie/contenu.test.ts`).

---

## 1. L'esprit

**Ce n'est pas un cours, c'est une encyclopédie.** L'élève n'arrive pas ici
pour réviser un chapitre — il a l'onglet Programme pour ça. Il arrive parce
qu'un nom est tombé quelque part : dans un cours, dans un quiz, dans un film,
dans une conversation. Il veut savoir **qui c'était, ce qui s'est passé, et
pourquoi on en parle encore** — en une minute, deux au maximum.

Trois conséquences :

1. **Dense, jamais bavard.** Chaque phrase apporte un fait, un nom, une date ou
   une idée. Aucune phrase de transition creuse (« Nous allons voir que… »,
   « Il est intéressant de noter… »). Si une phrase peut sauter sans perte, elle
   saute.
2. **Concret avant abstrait.** « Le pain coûte 12 sous sur 20 de salaire
   journalier » vaut mieux que « la situation économique était difficile ».
   Des chiffres, des lieux, des noms, des objets.
3. **Autonome.** Une fiche se lit sans avoir lu les autres. Un mot difficile qui
   apparaît est soit expliqué dans la phrase, soit mis dans `mots`.

## 2. LA CITATION EST LE CŒUR

C'est la règle qui distingue cette encyclopédie de n'importe quelle notice.

Une phrase célèbre **se retient mieux qu'une date de naissance**, elle se
répète, elle se cite en copie, elle donne une prise sur quelqu'un dont on ne
savait rien il y a trente secondes. Donc :

- **Une fiche sans citation est refusée.** Minimum 1, viser **2 à 4**.
- La citation phare (la première du tableau) est celle qui s'affiche **sur la
  carte de la liste** : c'est la plus connue, la plus frappante, la plus courte.
- Chaque citation porte son **contexte** (`contexte`) : où, quand, à qui. Une
  phrase sans situation ne se retient pas et se cite de travers.
- Quand la phrase est en vieux français, en latin, ou qu'elle demande une clé,
  on ajoute **`sens`** : ce que ça veut dire, en une phrase d'aujourd'hui.
- Une phrase **prêtée sans preuve** (« Qu'ils mangent de la brioche »,
  « Paris vaut bien une messe ») se marque `incertaine: true`. On la garde —
  elle fait partie de la culture commune — mais la fiche dit qu'elle est
  douteuse. Faire répéter à un élève une phrase inventée en la donnant pour
  vraie, c'est lui apprendre une faute.
- Sur un **événement**, la citation porte un `qui` : qui a prononcé la phrase.

Cherchez la vraie phrase, celle des manuels et des sources, pas une
reformulation. Si la formulation exacte varie selon les sources, prenez la plus
répandue et restez sobre sur le contexte.

## 3. Le ton — ce qui est explicitement demandé

### Les rois de France et les figures chrétiennes

**Ils sont traités avec respect et mis en valeur.** Ce n'est pas une consigne
d'édulcoration, c'est une consigne d'équité : ces fiches racontent des gens qui
ont fondé le pays, et le réflexe moderne de les juger de haut (le luxe, les
impôts, la religion « superstitieuse ») produit des fiches à la fois injustes et
ennuyeuses.

- **Saint Louis, Blanche de Castille, Jeanne d'Arc, Sainte Geneviève, Clovis,
  Charlemagne, Henri IV, Louis XIV** — on écrit ce qu'ils ont **bâti, tenu,
  fondé, protégé** : la justice, l'unité du royaume, les hôpitaux, les
  universités, les cathédrales, la paix civile.
- La **foi** de ces personnages est prise au sérieux, comme un moteur de leurs
  actes et non comme une naïveté d'époque. Saint Louis rend la justice sous le
  chêne de Vincennes **parce qu'il** croit devoir compte à Dieu de son royaume.
  Jeanne d'Arc ne « croit entendre » des voix : elle **dit** entendre des voix,
  et on rapporte ce qu'elle dit.
- Les difficultés, les échecs et les violences d'époque ne sont **pas cachés**
  (les croisades de Saint Louis échouent, la révocation de l'édit de Nantes
  chasse 200 000 protestants) — mais ils sont racontés **dans leur temps**, sans
  procès rétrospectif ni ironie.
- **Interdit** : le ton moqueur, le clin d'œil complice au lecteur moderne, la
  formule qui ridiculise (« le roi Soleil et ses perruques ridicules »), la
  psychologisation à deux sous (« un roi faible et bête »).

### La Révolution française — le gros morceau

Elle est développée **entièrement**, c'est une demande explicite. Ni légende
dorée, ni légende noire : les **mécanismes**. Ce qui doit apparaître dans les
fiches de la période (réparti selon la fiche, pas tout partout) :

- **Les mauvais conseillers de Louis XVI** et l'entourage de cour : un roi qui
  veut réformer (Turgot, Necker), qui est freiné par les privilégiés, les
  parlements et sa propre cour, et qui **renvoie ses meilleurs ministres** sous
  la pression. La chute vient d'un blocage du système, pas d'une bêtise
  personnelle.
- **La guerre d'Amérique** (1778-1783) : la France y gagne un prestige immense
  et y **ruine ses finances** — plus d'un milliard de livres, la dette absorbe
  la moitié du budget. Les officiers rentrent la tête pleine d'idées
  républicaines (La Fayette). On aide une révolution au dehors, on prépare la
  sienne au dedans.
- **Le prix du pain et les marchands** : le pain, c'est la moitié du budget
  d'une famille. Après les mauvaises récoltes de 1788, le prix double. La
  libéralisation du commerce des grains laisse des **marchands et des
  spéculateurs fixer les prix**, stocker, attendre la hausse — d'où les émeutes
  frumentaires, la Grande Peur, et la marche des femmes sur Versailles. La faim
  est le moteur populaire de la Révolution.
- **La bourgeoisie remplace la noblesse** : avocats, notaires, médecins,
  négociants — instruits, riches, lecteurs des Lumières, et **bloqués** par une
  société d'ordres où la naissance décide de tout. Les deux tiers des députés du
  Tiers état de 1789 sont des hommes de loi. Ce sont eux qui écrivent la
  Révolution, et eux qui en sortent aux commandes.
- **L'argent prend le pouvoir** : la vente des biens du clergé, les assignats,
  les fournisseurs aux armées, les fortunes du Directoire. Le privilège de
  naissance recule, le pouvoir de la fortune avance — c'est le vrai basculement
  du siècle, et il faut l'écrire.

On garde la même exigence pour la **Terreur** (décrite, datée, chiffrée, sans
complaisance ni diabolisation), la **Vendée**, et pour ce que la Révolution
**fonde** et qui tient encore : égalité devant la loi, fin des privilèges,
Déclaration des droits de l'homme, état civil, Code civil, système métrique.

### Le reste

Neutralité de manuel : on expose, on date, on explique les causes. Sur les
sujets douloureux (esclavage, colonisation, Shoah, guerres), on est **factuel,
précis et sobre** — la précision fait plus d'effet que l'indignation.

## 4. Les champs, un par un

Les types font foi : `lib/encyclopedie/types.ts`. Les bornes de longueur sont
dans `lib/encyclopedie/valider.ts` (`REGLES`) et sont **vérifiées par le test**.

| Champ | Ce qu'on y met |
|---|---|
| `id` | kebab-case sans accent, stable : `jeanne-d-arc`, `prise-de-la-bastille`. C'est l'URL. |
| `nom` | Le nom tel qu'on l'écrit dans un manuel. |
| `surnom` (personnage) | « la Pucelle d'Orléans », « le Roi-Soleil ». Sans majuscule d'attaque. |
| `dates` / `date` | Le libellé affiché : « vers 1412 – 1431 », « 14 juillet 1789 », « 1337 – 1453 ». Tiret demi-cadratin `–` entre deux dates. |
| `tri` | L'année qui sert au classement (négative avant J.-C.). Pour un personnage : son année de mort, ou de son fait majeur s'il vaut mieux. Doit tomber dans les bornes de la période. |
| `periode` | Une des sept (`PERIODES`). |
| `emoji` | Un seul pictogramme, celui du médaillon. Évitez les doublons dans un même lot. |
| `roles` (personnage) | 1 à 4 étiquettes, comme sous un portrait de musée : « Roi de France », « Sainte », « Physicienne ». |
| `origine` (personnage) | « Domrémy, Lorraine ». |
| `lieu` (événement) | « Paris », « Reims », « Orléans et la Loire ». |
| `accroche` | **Une** phrase, 50 à 200 signes : ce qu'on retient si on ne lit rien d'autre. Pas de « était un roi français » — dites ce qui compte. |
| `citations` | Cf. § 2. |
| `reperes` | 3 à 6 puces, « en 30 secondes ». Une info par puce, sans verbe conjugué inutile : « Roi à 12 ans, sa mère Blanche de Castille gouverne jusqu'en 1234 ». |
| `recit` | 3 à 7 blocs `{ titre, texte }`. Le titre est court et dit ce qui se passe (« Orléans, en neuf jours »), jamais « Partie 2 ». Le texte fait 180 à 1600 signes, avec du `**gras**` sur les termes à retenir et de l'`*italique*` pour les titres d'œuvres et les mots étrangers. |
| `chrono` | 3 à 12 jalons `{ date, fait }`, dans l'ordre. `fait` est court (moins de 80 signes). |
| `causes` (événement) | 3 à 7 puces : de la cause profonde à l'étincelle. |
| `consequences` (événement) | 3 à 7 puces : ce que ça change, y compris longtemps après. |
| `chiffres` (événement) | Les chiffres qui frappent : `{ valeur: '1 200', quoi: 'cahiers de doléances conservés' }`. |
| `leSaisTu` | L'anecdote vraie qui se raconte à la récré. 80 à 400 signes. Facultatif mais on en veut partout où c'est possible. |
| `aRetenir` | 3 à 6 affirmations vérifiables, du niveau du contrôle. Datées. |
| `mots` | Le vocabulaire du cours défini sur place : `{ mot: 'Régence', sens: '…' }`. 0 à 6. |
| `lies` | Les `id` d'autres fiches. **Vérifiés par le test** : un id inexistant fait échouer `npm test`. Dans le doute, mettre moins. |
| `niveaux` | Les classes où ça tombe : `['5e']`, `['4e', '1re']`. |
| `programme` | Le chapitre du programme : « Société, Église et pouvoir politique dans l'Occident féodal ». |
| `tags` | 2 à 14 mots-clés de recherche : lieux, surnoms, mots du cours, synonymes, orthographes alternatives. C'est ce qui rend la barre de recherche utile. |

## 5. Écriture — règles de forme

- **Français, toujours.** Apostrophe typographique `’` dans les textes affichés
  (pas `'`), guillemets français `« »` avec espaces insécables si besoin.
- Pas de `'` droit dans les chaînes JS en apostrophe simple sans échappement :
  utilisez `’` (c'est de toute façon la bonne typographie) ou des backticks.
- **Gras** sur les termes à retenir, **jamais** sur des phrases entières.
- Pas de listes à puces dans `recit.texte` (ce sont des paragraphes) — les
  listes, ce sont `reperes`, `aRetenir`, `causes`, `consequences`.
- Dates : « 14 juillet 1789 », « vers 1412 », « 52 av. J.-C. », « 1337 – 1453 ».
- Nombres : espace fine insécable ou espace normale comme séparateur de
  milliers (« 20 000 »), jamais de virgule anglo-saxonne.

## 6. Où vivent les fiches

```
lib/encyclopedie/
  types.ts            les types (le contrat)
  valider.ts          les bornes, vérifiées par le test
  apercu.ts           ce que le client reçoit (liste + recherche)
  recherche.ts        la barre de recherche et les filtres
  contenu/
    index.ts          le registre : importe tous les lots
    personnages-*.ts  un lot de personnages
    evenements-*.ts   un lot d'événements
```

Un lot = un fichier = un `export const` typé `Personnage[]` ou `Evenement[]`.
Un lot vise 6 à 12 fiches.

**Le registre et le sommaire se régénèrent :**

```bash
node scripts/encyclopedie-registre.mjs
```

Il rebranche tous les lots dans `contenu/index.ts` et réécrit
`docs/encyclopedie-sommaire.md` à partir de ce qui existe vraiment. À lancer
après avoir ajouté un fichier — le test refuse un lot écrit mais non branché.

**Pour relire UN lot** sans être arrêté par le chantier d'à côté :

```powershell
$env:ENCY_LOT='personnages-antiquite-rome'; npx vitest run lib/encyclopedie/contenu.test.ts
```

Le contenu est en TypeScript et **pas en base** : il est le même pour tous les
élèves, il ne bouge jamais d'une session à l'autre, et une lecture Supabase par
ouverture de fiche coûterait 60 ms pour rien. Il n'est lu que par des composants
**serveur** — le client ne reçoit que les aperçus (`apercu.ts`).

## 7. Avant de rendre une fiche

- [ ] Au moins une citation, avec son contexte.
- [ ] L'accroche tient en une phrase et donne envie.
- [ ] `tri` est dans les bornes de la période.
- [ ] Les `lies` pointent vers des `id` qui existent.
- [ ] Aucun jugement moqueur sur les rois de France ni sur les figures
      chrétiennes ; leurs actes sont racontés dans leur temps.
- [ ] `npm run typecheck` et `npm test` passent.
