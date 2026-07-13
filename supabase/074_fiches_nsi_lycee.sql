-- =============================================================================
-- Studuel — Migration 074 : fiches de révision NSI lycée (1re · Tle)
-- Remplit/enrichit lessons.revision_sheet (support « Révision ») pour la leçon
-- « L'essentiel du cours » de chaque chapitre — remplace le placeholder générique
-- posé par 025 par du contenu réel.
--
-- Motif : UPDATE joint sur la clé naturelle (slug, niveau, chapitre, leçon),
-- garde `IS DISTINCT FROM` → réexécutable sans effet de bord. Contenu en
-- dollar-quoting ($md$…$md$) pour éviter l'échappement des apostrophes.
--
-- Pour lister ce qu'il reste à écrire :
--   SELECT s.slug, c.level, c.title, l.title
--     FROM public.lessons l
--     JOIN public.chapters c ON c.id = l.chapter_id
--     JOIN public.subjects s ON s.id = c.subject_id
--    WHERE l.revision_sheet IS NULL
--    ORDER BY s.slug, c.level, c.position, l.position;
--
-- PRÉREQUIS : 008 (subjects/chapters/lessons), 025 (colonne revision_sheet).
-- Idempotent.
-- =============================================================================

UPDATE public.lessons l
   SET revision_sheet = v.md
  FROM (VALUES
    ('nsi', '1re', 'Types de données et représentation', $md$# Types de données et représentation — l'essentiel

**À retenir**
- L'ordinateur ne manipule que du **binaire** : des bits valant 0 ou 1. 8 bits = 1 octet.
- En **base 2**, chaque position vaut une puissance de 2 ; l'**hexadécimal** (base 16) regroupe 4 bits par chiffre (0–9 puis A–F).
- Les **entiers**, les **flottants** (nombres à virgule), les **booléens** (True/False) et les **caractères** (via Unicode/UTF-8) ont chacun leur représentation.
- Un booléen se combine avec **et**, **ou**, **non**.

**Méthode : convertir 1011 (binaire) en décimal**
- 1×8 + 0×4 + 1×2 + 1×1 = 8 + 2 + 1 = 11.

**Exemple**
> L'octet 1111 1111 vaut 255 en décimal et FF en hexadécimal (le plus grand entier non signé sur 8 bits).

**Erreur classique**
- Croire que les flottants sont exacts : 0,1 + 0,2 ne donne pas exactement 0,3 en machine (arrondi binaire).$md$),

    ('nsi', '1re', 'Python : bases de la programmation', $md$# Python : bases de la programmation — l'essentiel

**À retenir**
- Une **variable** stocke une valeur ; l'affectation se fait avec `=`.
- Les **conditions** (`if` / `elif` / `else`) et les **boucles** (`for`, `while`) contrôlent le déroulement.
- Une **fonction** (`def`) regroupe du code réutilisable et renvoie un résultat avec `return`.
- En Python, l'**indentation** délimite les blocs (pas d'accolades).

**Méthode / Exemple de code**
```python
def est_pair(n):
    if n % 2 == 0:
        return True
    return False

for i in range(5):     # 0, 1, 2, 3, 4
    print(i, est_pair(i))
```

**Exemple**
> `range(5)` produit 0, 1, 2, 3, 4 : la borne de fin est exclue.

**Erreur classique**
- Confondre `=` (affectation) et `==` (test d'égalité) dans une condition.$md$),

    ('nsi', '1re', 'Tableaux et dictionnaires', $md$# Tableaux et dictionnaires — l'essentiel

**À retenir**
- Une **liste** Python est une suite ordonnée d'éléments, **indexée à partir de 0** : `t[0]` est le premier.
- On parcourt une liste avec une boucle `for`, on ajoute avec `.append()`, on connaît sa taille avec `len()`.
- Un **dictionnaire** associe des **clés** à des **valeurs** : `d["age"]` accède à la valeur de la clé `"age"`.
- Les clés d'un dictionnaire sont **uniques** ; l'accès par clé est direct.

**Méthode / Exemple de code**
```python
notes = [12, 15, 9]        # liste indexée à 0
notes.append(18)           # -> [12, 15, 9, 18]
eleve = {"nom": "Ada", "age": 17}
print(eleve["nom"])        # Ada
```

**Exemple**
> Dans `t = [10, 20, 30]`, `t[0]` vaut 10 et `t[2]` vaut 30 ; `t[3]` déclenche une erreur d'indice.

**Erreur classique**
- Commencer à compter les indices à 1 : le premier élément est `t[0]`, pas `t[1]`.$md$),

    ('nsi', '1re', 'Le web : HTML, CSS, HTTP', $md$# Le web : HTML, CSS, HTTP — l'essentiel

**À retenir**
- **HTML** structure le contenu d'une page avec des **balises** (`<h1>`, `<p>`, `<a>`…).
- **CSS** décrit la **présentation** (couleurs, polices, mise en page), séparée du contenu.
- **HTTP** est le protocole de dialogue entre le **navigateur** (client) et le **serveur** ; les méthodes courantes sont **GET** (récupérer) et **POST** (envoyer).
- Une **URL** identifie une ressource ; le serveur répond avec un **code de statut** (200 = OK, 404 = introuvable).

**Méthode / Exemple de code**
```html
<a href="https://exemple.fr">Un lien</a>
<p style="color: violet;">Un paragraphe coloré</p>
```

**Exemple**
> Quand tu tapes une adresse, le navigateur envoie une requête GET ; le serveur renvoie le HTML avec le code 200.

**Erreur classique**
- Confondre le rôle des trois : HTML = structure, CSS = style, HTTP = transport. Mettre la mise en forme dans le HTML au lieu du CSS.$md$),

    ('nsi', 'Tle', 'Structures de données', $md$# Structures de données — l'essentiel

**À retenir**
- Une **pile** (stack) fonctionne en **LIFO** : dernier entré, premier sorti (empiler / dépiler au sommet).
- Une **file** (queue) fonctionne en **FIFO** : premier entré, premier sorti (enfiler à la fin, défiler au début).
- Une **liste chaînée** relie des maillons par des pointeurs ; un **arbre** organise les données de façon hiérarchique (racine, nœuds, feuilles).
- On choisit la structure selon les opérations dont on a besoin.

**Méthode / Exemple de code**
```python
pile = []
pile.append("a")   # empiler
pile.append("b")
pile.pop()          # dépile "b" (LIFO)

file = []
file.append("a")   # enfiler
file.append("b")
file.pop(0)         # défile "a" (FIFO)
```

**Exemple**
> Le bouton « Précédent » d'un navigateur est une pile (LIFO) ; une file d'attente d'impression est une file (FIFO).

**Erreur classique**
- Confondre pile et file : la pile sort par le sommet (LIFO), la file sort par le début (FIFO).$md$),

    ('nsi', 'Tle', 'Bases de données et SQL', $md$# Bases de données et SQL — l'essentiel

**À retenir**
- Une **base de données relationnelle** organise les données en **tables** (lignes = enregistrements, colonnes = attributs).
- Une **clé primaire** identifie de façon **unique** chaque ligne d'une table ; une **clé étrangère** référence la clé primaire d'une autre table.
- **SQL** interroge les données : `SELECT` choisit les colonnes, `FROM` la table, `WHERE` filtre les lignes.
- Les données doivent rester **cohérentes** (pas de doublon de clé primaire).

**Méthode / Exemple de code**
```sql
SELECT nom, note
FROM eleves
WHERE note >= 10;
```

**Exemple**
> `SELECT * FROM eleves WHERE classe = 'Tle'` renvoie toutes les colonnes des élèves de Terminale.

**Erreur classique**
- Oublier la clause `WHERE` quand on veut filtrer : sans elle, la requête renvoie toute la table.$md$),

    ('nsi', 'Tle', 'Réseaux et protocoles', $md$# Réseaux et protocoles — l'essentiel

**À retenir**
- Un **réseau** relie des machines qui échangent des données découpées en **paquets**.
- Le modèle **TCP/IP** empile des protocoles : **IP** adresse et achemine les paquets, **TCP** garantit une livraison **fiable et ordonnée**.
- Chaque machine a une **adresse IP** ; un **routeur** relaie les paquets de proche en proche.
- **UDP** est plus rapide que TCP mais sans garantie de livraison (utile pour le direct).

**Méthode / Exemple**
- Un message est découpé en paquets, chacun voyage indépendamment, puis TCP les réassemble dans l'ordre à l'arrivée.

**Exemple**
> Charger une page web utilise TCP (fiabilité) ; un jeu ou un appel vidéo en direct privilégie souvent UDP (rapidité).

**Erreur classique**
- Croire qu'un paquet suit un chemin fixe : le routage peut varier, et TCP se charge de remettre les paquets dans l'ordre.$md$),

    ('nsi', 'Tle', 'Algorithmique : les graphes', $md$# Algorithmique : les graphes — l'essentiel

**À retenir**
- Un **graphe** est un ensemble de **sommets** reliés par des **arêtes** (arcs si orientés).
- Il modélise des réseaux : routes, amis, pages web… On le représente par une **liste d'adjacence** ou une **matrice**.
- Le **parcours en largeur (BFS)** explore niveau par niveau à l'aide d'une **file** (FIFO) : il trouve le plus court chemin en nombre d'arêtes.
- Le **parcours en profondeur (DFS)** s'enfonce le plus loin possible à l'aide d'une **pile** (ou de la récursivité).

**Méthode / Exemple de code**
```python
def bfs(graphe, depart):
    vus = {depart}
    file = [depart]
    while file:
        s = file.pop(0)          # file : FIFO
        for voisin in graphe[s]:
            if voisin not in vus:
                vus.add(voisin)
                file.append(voisin)
    return vus
```

**Exemple**
> Pour trouver le chemin le plus court en nombre d'étapes, on utilise BFS ; pour détecter un cycle ou tout explorer, DFS convient.

**Erreur classique**
- Oublier de marquer un sommet comme **visité** : le parcours boucle alors indéfiniment sur les cycles.$md$)
  ) AS v(slug, level, chapter, md)
  JOIN public.subjects s ON s.slug = v.slug
  JOIN public.chapters c
    ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
 WHERE l.chapter_id = c.id
   AND l.title = 'L''essentiel du cours'
   AND l.revision_sheet IS DISTINCT FROM v.md;
