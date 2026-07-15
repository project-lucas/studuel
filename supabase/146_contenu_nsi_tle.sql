-- =============================================================================
-- Studuel — Migration 146 : CONTENU NSI Tle (+ exercices type bac)
-- Remplit les 4 chapitres de NSI Terminale (spécialité, programme officiel) :
--   1. Cours          → lessons.content de « L'essentiel du cours » (position 1)
--   2. Carte mentale  → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz           → complète le quiz de la leçon (positions 4→10, jointure
--                       leçon→quiz robuste à l'id existant ; filet si absent)
--   4. Exercices bac  → lessons.content de « Exercices types » (position 2) :
--                       2 exercices type bac corrigés pas à pas par chapitre.
--
-- Motif idempotent (comme 090) : UPDATE joint sur la clé naturelle
-- (slug, niveau, chapitre[, leçon]), garde `IS DISTINCT FROM`, contenu en
-- dollar-quoting $md$/$json$ ; INSERT des questions avec UUID fixes + garde
-- anti-doublon (ON CONFLICT). Filet : crée le quiz s'il manque. Réexécutable.
--
-- PRÉREQUIS : 008 (subjects/chapters/lessons), 029 (mind_map), 002 (quizzes).
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Structures de données', $md$# Structures de données

## Ce que tu vas comprendre
Une **structure de données** organise l'information en mémoire pour la manipuler efficacement. En Terminale, on étudie des structures **abstraites** (piles, files, listes, arbres) définies par leurs **opérations**, indépendamment de leur implémentation.

## 1. La pile (LIFO)
Une **pile** (*stack*) fonctionne en **dernier entré, premier sorti** (LIFO). On empile au sommet et on dépile au sommet.

- `empiler(p, x)` : ajoute x au sommet ;
- `depiler(p)` : retire et renvoie l'élément du sommet ;
- `est_vide(p)` : teste si la pile est vide.

```python
pile = []
pile.append(3)   # empiler
pile.append(7)
x = pile.pop()   # depiler -> 7 (le dernier entré)
```

*Usage : historique « annuler », évaluation d'expressions, appels de fonctions.*

## 2. La file (FIFO)
Une **file** (*queue*) fonctionne en **premier entré, premier sorti** (FIFO). On enfile en queue, on défile en tête.

```python
from collections import deque
file = deque()
file.append("A")     # enfiler
file.append("B")
x = file.popleft()   # defiler -> "A" (le premier entré)
```

*Usage : file d'attente, parcours en largeur d'un graphe.*

## 3. La liste chaînée
Une **liste chaînée** est une suite de **maillons** ; chaque maillon contient une **valeur** et un **pointeur** vers le maillon suivant. Contrairement au tableau, l'accès à un élément se fait en parcourant les maillons un à un.

## 4. Les arbres binaires
Un **arbre binaire** part d'une **racine** ; chaque nœud a au plus **deux fils** (gauche et droite). Une **feuille** n'a pas de fils. La **taille** est le nombre de nœuds, la **hauteur** la longueur du plus long chemin de la racine à une feuille.

## 5. Les parcours d'arbre
- Parcours en **profondeur** : préfixe (racine, gauche, droite), infixe, suffixe.
- Parcours en **largeur** : niveau par niveau (utilise une **file**).

## L'essentiel à retenir
- **Pile = LIFO** (dernier entré, premier sorti) ; **file = FIFO** (premier entré, premier sorti).
- Une **liste chaînée** relie des maillons par des pointeurs ; l'accès est séquentiel.
- Un **arbre binaire** : une racine, au plus 2 fils par nœud, des feuilles sans fils.
- Parcours : **profondeur** (préfixe/infixe/suffixe) ou **largeur** (niveau par niveau, via une file).$md$),

    ('Bases de données et SQL', $md$# Bases de données et SQL

## Ce que tu vas comprendre
Une **base de données relationnelle** organise l'information en **tables** liées entre elles. Le langage **SQL** permet d'interroger et de modifier ces données. C'est un chapitre central de la Terminale NSI.

## 1. Le modèle relationnel
Les données sont rangées dans des **relations** (les **tables**). Chaque table a des **attributs** (colonnes) ; chaque **enregistrement** (ligne) décrit une entité. Le **schéma** décrit les tables et leurs attributs.

*Exemple : une table `eleve(id, nom, classe)` et une table `note(id, id_eleve, matiere, valeur)`.*

## 2. Clés primaires et étrangères
- Une **clé primaire** identifie de façon **unique** chaque ligne d'une table (ex. `id`).
- Une **clé étrangère** est un attribut qui **référence** la clé primaire d'une autre table (ex. `note.id_eleve` référence `eleve.id`). Elle garantit l'**intégrité référentielle**.

## 3. Interroger avec SELECT
La requête **SELECT** lit des données. On projette des colonnes, on filtre avec `WHERE`, on trie avec `ORDER BY`.

```sql
SELECT nom, classe
FROM eleve
WHERE classe = 'Tle'
ORDER BY nom;
```

## 4. Modifier les données
```sql
INSERT INTO eleve (id, nom, classe) VALUES (12, 'Zoé', 'Tle');
UPDATE eleve SET classe = '1re' WHERE id = 12;
DELETE FROM eleve WHERE id = 12;
```

## 5. Les jointures
Une **jointure** combine les lignes de deux tables reliées par une clé étrangère.

```sql
SELECT eleve.nom, note.matiere, note.valeur
FROM eleve
JOIN note ON note.id_eleve = eleve.id;
```

## L'essentiel à retenir
- Le **modèle relationnel** : des **tables** (relations), des lignes (enregistrements), des colonnes (attributs).
- **Clé primaire** = identifiant unique ; **clé étrangère** = référence vers une autre table.
- **SELECT … FROM … WHERE** lit les données ; `INSERT`/`UPDATE`/`DELETE` les modifient.
- Une **jointure** (`JOIN … ON`) relie deux tables par leur clé.$md$),

    ('Réseaux et protocoles', $md$# Réseaux et protocoles

## Ce que tu vas comprendre
Un **réseau** relie des machines qui échangent des données. Pour communiquer, elles suivent des **protocoles** : des règles communes. En Terminale, on étudie le modèle **TCP/IP**, le routage et le découpage en paquets.

## 1. Le modèle en couches TCP/IP
La communication est découpée en **couches**, chacune avec un rôle :
- **Application** (HTTP, DNS, SMTP…) : les échanges vus par l'utilisateur ;
- **Transport** (TCP, UDP) : la fiabilité et le port ;
- **Réseau** (IP) : l'adressage et l'acheminement ;
- **Accès réseau** (Ethernet, Wi-Fi) : le lien physique.

## 2. L'adressage IP
Chaque machine a une **adresse IP** (ex. `192.168.1.10`). Le **masque** distingue la partie **réseau** de la partie **hôte**. Le **DNS** traduit un nom (`www.exemple.fr`) en adresse IP.

## 3. Le découpage en paquets
Un message est découpé en **paquets** (ou datagrammes). Chaque paquet voyage **indépendamment** et porte un **en-tête** (adresses source et destination). Les paquets sont **réassemblés** à l'arrivée.

## 4. Le routage
Un **routeur** relie plusieurs réseaux. Il possède une **table de routage** et choisit, pour chaque paquet, le **prochain saut** vers la destination. Un même message peut emprunter des chemins différents.

*Le protocole **RIP** choisit la route au plus petit nombre de sauts ; **OSPF** tient compte du « coût » (débit) des liens.*

## 5. TCP et UDP
- **TCP** établit une **connexion**, garantit l'ordre et la réception (accusés de réception, retransmission).
- **UDP** n'établit pas de connexion : plus rapide mais **sans garantie** (vidéo en direct, jeux).

## L'essentiel à retenir
- **TCP/IP** organise la communication en **couches** (application, transport, réseau, accès).
- Une **adresse IP** identifie une machine ; le **DNS** traduit les noms en adresses IP.
- Un message est découpé en **paquets** acheminés indépendamment puis réassemblés.
- Un **routeur** choisit le prochain saut ; **TCP** est fiable et connecté, **UDP** rapide mais sans garantie.$md$),

    ('Algorithmique : les graphes', $md$# Algorithmique : les graphes

## Ce que tu vas comprendre
Un **graphe** modélise des objets (les **sommets**) et leurs relations (les **arêtes**). Réseaux sociaux, cartes routières, pages web : tout se représente par un graphe. On apprend à les représenter et à les parcourir.

## 1. Vocabulaire des graphes
- Un **sommet** (ou nœud) est un objet ; une **arête** relie deux sommets.
- Un graphe est **orienté** si les arêtes ont un sens (arcs), sinon **non orienté**.
- Le **degré** d'un sommet est son nombre de voisins. Un **chemin** est une suite d'arêtes ; un **cycle** revient à son point de départ.

## 2. Les représentations
- **Matrice d'adjacence** : un tableau où `M[i][j] = 1` s'il existe une arête de i vers j.
- **Liste d'adjacence** : à chaque sommet on associe la liste de ses voisins.

```python
# liste d'adjacence
graphe = {
    "A": ["B", "C"],
    "B": ["A", "D"],
    "C": ["A", "D"],
    "D": ["B", "C"],
}
```

## 3. Le parcours en largeur (BFS)
Le **parcours en largeur** (*Breadth-First Search*) explore les sommets **niveau par niveau** à partir d'un départ, à l'aide d'une **file** (FIFO).

```python
from collections import deque
def bfs(g, depart):
    vus, file = {depart}, deque([depart])
    while file:
        s = file.popleft()
        for voisin in g[s]:
            if voisin not in vus:
                vus.add(voisin)
                file.append(voisin)
    return vus
```

## 4. Le parcours en profondeur (DFS)
Le **parcours en profondeur** (*Depth-First Search*) s'enfonce le plus loin possible avant de revenir en arrière. Il utilise une **pile** (LIFO) ou la **récursivité**.

## 5. Le plus court chemin
Le **BFS** donne le plus court chemin en **nombre d'arêtes** dans un graphe non pondéré. Quand les arêtes ont un **poids** (distance, temps), on utilise l'algorithme de **Dijkstra**.

## L'essentiel à retenir
- Un **graphe** = des **sommets** reliés par des **arêtes** ; orienté ou non.
- Deux représentations : **matrice d'adjacence** et **liste d'adjacence**.
- **BFS** (parcours en largeur) utilise une **file** ; **DFS** (profondeur) une **pile** ou la récursivité.
- Le **BFS** donne le plus court chemin en nombre d'arêtes ; **Dijkstra** le fait avec des poids.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'nsi'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Structures de données', $json${
      "centre": "Structures de données",
      "branches": [
        { "titre": "Pile (LIFO)", "enfants": ["Dernier entré, premier sorti", "empiler / depiler au sommet", "Annuler, appels de fonctions"] },
        { "titre": "File (FIFO)", "enfants": ["Premier entré, premier sorti", "enfiler en queue, defiler en tête", "File d'attente, parcours en largeur"] },
        { "titre": "Liste chaînée", "enfants": ["Maillons valeur + pointeur", "Accès séquentiel", "Suivant vers le maillon d'après"] },
        { "titre": "Arbres binaires", "enfants": ["Racine, au plus 2 fils", "Feuille sans fils", "Parcours profondeur / largeur"] }
      ]
    }$json$),
    ('Bases de données et SQL', $json${
      "centre": "Bases de données et SQL",
      "branches": [
        { "titre": "Modèle relationnel", "enfants": ["Tables (relations)", "Lignes = enregistrements", "Colonnes = attributs"] },
        { "titre": "Clés", "enfants": ["Primaire = identifiant unique", "Étrangère = référence", "Intégrité référentielle"] },
        { "titre": "Interroger", "enfants": ["SELECT … FROM …", "WHERE pour filtrer", "ORDER BY pour trier"] },
        { "titre": "Modifier et joindre", "enfants": ["INSERT / UPDATE / DELETE", "JOIN … ON …", "Relier deux tables par la clé"] }
      ]
    }$json$),
    ('Réseaux et protocoles', $json${
      "centre": "Réseaux et protocoles",
      "branches": [
        { "titre": "Couches TCP/IP", "enfants": ["Application (HTTP, DNS)", "Transport (TCP, UDP)", "Réseau (IP), accès (Ethernet)"] },
        { "titre": "Adressage", "enfants": ["Adresse IP + masque", "DNS : nom → adresse IP", "Partie réseau / partie hôte"] },
        { "titre": "Paquets", "enfants": ["Message découpé", "En-tête : source, destination", "Réassemblés à l'arrivée"] },
        { "titre": "Routage et transport", "enfants": ["Routeur : prochain saut", "RIP (sauts), OSPF (coût)", "TCP fiable, UDP rapide"] }
      ]
    }$json$),
    ('Algorithmique : les graphes', $json${
      "centre": "Les graphes",
      "branches": [
        { "titre": "Vocabulaire", "enfants": ["Sommets et arêtes", "Orienté ou non orienté", "Degré, chemin, cycle"] },
        { "titre": "Représentations", "enfants": ["Matrice d'adjacence", "Liste d'adjacence", "Voisins d'un sommet"] },
        { "titre": "Parcours", "enfants": ["BFS : largeur, file (FIFO)", "DFS : profondeur, pile", "Niveau par niveau vs récursif"] },
        { "titre": "Plus court chemin", "enfants": ["BFS : moins d'arêtes", "Dijkstra : arêtes pondérées", "Cartes, réseaux"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'nsi'
 WHERE c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds de contenu ont déjà créé les quiz Tle ; ce bloc
--     ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'NSI', 'Tle', v.chapter, true, l.id
FROM (VALUES
  ('14619999-0000-4000-8000-000000000001'::uuid, 'Structures de données'),
  ('14619999-0000-4000-8000-000000000002'::uuid, 'Bases de données et SQL'),
  ('14619999-0000-4000-8000-000000000003'::uuid, 'Réseaux et protocoles'),
  ('14619999-0000-4000-8000-000000000004'::uuid, 'Algorithmique : les graphes')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'nsi'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
WHERE NOT EXISTS (SELECT 1 FROM public.quizzes q WHERE q.lesson_id = l.id)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3b. Questions supplémentaires (positions 4→10), attachées au quiz DE LA LEÇON
--     via la jointure leçon→quiz (donc au quiz existant, quel que soit son id).
-- -----------------------------------------------------------------------------
INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT d.id, q.id, d.question, d.kind, d.options::jsonb, d.correct_index, d.explanation, d.position
FROM (VALUES
  -- Chapitre 1 — Structures de données
  ('14610000-0000-4000-8000-000000000104'::uuid, 'Structures de données',
   'Une pile fonctionne selon le principe : ', 'mcq',
   '["LIFO (dernier entré, premier sorti)", "FIFO (premier entré, premier sorti)", "Par ordre alphabétique", "Au hasard"]', 0,
   'La pile est LIFO : le dernier élément empilé est le premier à être dépilé.', 4),
  ('14610000-0000-4000-8000-000000000105'::uuid, 'Structures de données',
   'On empile 3 puis 7 dans une pile vide, puis on dépile une fois. Quelle valeur obtient-on ?', 'mcq',
   '["7", "3", "10", "La pile est vide"]', 0,
   'La pile est LIFO : le dernier entré (7) est le premier sorti.', 5),
  ('14610000-0000-4000-8000-000000000106'::uuid, 'Structures de données',
   'Une file fonctionne selon le principe FIFO.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La file est FIFO : premier entré, premier sorti (comme une file d''attente).', 6),
  ('14610000-0000-4000-8000-000000000107'::uuid, 'Structures de données',
   'Dans une liste chaînée, chaque maillon contient : ', 'mcq',
   '["Une valeur et un pointeur vers le suivant", "Uniquement une valeur", "Deux valeurs", "L''adresse de la racine"]', 0,
   'Un maillon stocke une valeur et un pointeur vers le maillon suivant.', 7),
  ('14610000-0000-4000-8000-000000000108'::uuid, 'Structures de données',
   'Dans un arbre binaire, un nœud possède au plus : ', 'mcq',
   '["Deux fils", "Un fils", "Trois fils", "Aucune limite"]', 0,
   'Dans un arbre binaire, chaque nœud a au plus deux fils (gauche et droite).', 8),
  ('14610000-0000-4000-8000-000000000109'::uuid, 'Structures de données',
   'Une feuille d''un arbre est un nœud sans fils.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Une feuille est un nœud qui n''a aucun fils.', 9),
  ('14610000-0000-4000-8000-000000000110'::uuid, 'Structures de données',
   'Quelle structure utilise-t-on pour un parcours d''arbre en largeur ?', 'mcq',
   '["Une file", "Une pile", "Une liste chaînée triée", "Une matrice"]', 0,
   'Le parcours en largeur (niveau par niveau) s''appuie sur une file (FIFO).', 10),

  -- Chapitre 2 — Bases de données et SQL
  ('14610000-0000-4000-8000-000000000204'::uuid, 'Bases de données et SQL',
   'Dans le modèle relationnel, les données sont organisées en : ', 'mcq',
   '["Tables", "Fichiers texte", "Arbres binaires", "Piles"]', 0,
   'Le modèle relationnel range les données dans des relations, c''est-à-dire des tables.', 4),
  ('14610000-0000-4000-8000-000000000205'::uuid, 'Bases de données et SQL',
   'Une clé primaire identifie de façon unique chaque ligne d''une table.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La clé primaire est un identifiant unique : deux lignes ne peuvent pas avoir la même.', 5),
  ('14610000-0000-4000-8000-000000000206'::uuid, 'Bases de données et SQL',
   'Quelle requête SQL sert à LIRE des données ?', 'mcq',
   '["SELECT", "INSERT", "DELETE", "UPDATE"]', 0,
   'SELECT lit des données ; INSERT ajoute, UPDATE modifie, DELETE supprime.', 6),
  ('14610000-0000-4000-8000-000000000207'::uuid, 'Bases de données et SQL',
   'Que fait la requête : DELETE FROM eleve WHERE id = 12 ; ?', 'mcq',
   '["Supprime la ligne dont l''id vaut 12", "Ajoute un élève", "Modifie l''id 12", "Affiche l''élève 12"]', 0,
   'DELETE … WHERE supprime les lignes qui vérifient la condition, ici l''élève d''id 12.', 7),
  ('14610000-0000-4000-8000-000000000208'::uuid, 'Bases de données et SQL',
   'Une clé étrangère référence la clé primaire d''une autre table.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La clé étrangère pointe vers la clé primaire d''une autre table et assure l''intégrité référentielle.', 8),
  ('14610000-0000-4000-8000-000000000209'::uuid, 'Bases de données et SQL',
   'Quelle clause SQL combine les lignes de deux tables reliées ?', 'mcq',
   '["JOIN", "WHERE", "ORDER BY", "GROUP"]', 0,
   'JOIN … ON … réalise une jointure entre deux tables par leur clé.', 9),
  ('14610000-0000-4000-8000-000000000210'::uuid, 'Bases de données et SQL',
   'Quelle clause permet de filtrer les lignes d''un SELECT ?', 'mcq',
   '["WHERE", "FROM", "INSERT", "VALUES"]', 0,
   'La clause WHERE filtre les lignes selon une condition.', 10),

  -- Chapitre 3 — Réseaux et protocoles
  ('14610000-0000-4000-8000-000000000304'::uuid, 'Réseaux et protocoles',
   'Dans le modèle TCP/IP, quel protocole assure l''adressage et l''acheminement ?', 'mcq',
   '["IP", "HTTP", "SMTP", "Ethernet"]', 0,
   'IP (couche réseau) gère l''adressage et l''acheminement des paquets.', 4),
  ('14610000-0000-4000-8000-000000000305'::uuid, 'Réseaux et protocoles',
   'Le DNS sert à traduire un nom de domaine en adresse IP.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le DNS convertit un nom (www.exemple.fr) en son adresse IP.', 5),
  ('14610000-0000-4000-8000-000000000306'::uuid, 'Réseaux et protocoles',
   'Un message envoyé sur le réseau est : ', 'mcq',
   '["Découpé en paquets acheminés indépendamment", "Envoyé d''un seul bloc", "Toujours par le même chemin fixe", "Stocké chez le routeur"]', 0,
   'Le message est découpé en paquets qui voyagent indépendamment puis sont réassemblés à l''arrivée.', 6),
  ('14610000-0000-4000-8000-000000000307'::uuid, 'Réseaux et protocoles',
   'Quel équipement relie plusieurs réseaux et choisit le prochain saut d''un paquet ?', 'mcq',
   '["Le routeur", "Le serveur DNS", "L''antivirus", "Le compilateur"]', 0,
   'Le routeur relie des réseaux et, grâce à sa table de routage, choisit le prochain saut.', 7),
  ('14610000-0000-4000-8000-000000000308'::uuid, 'Réseaux et protocoles',
   'TCP garantit la réception et l''ordre des données, contrairement à UDP.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'TCP est fiable et connecté (accusés, retransmission) ; UDP est rapide mais sans garantie.', 8),
  ('14610000-0000-4000-8000-000000000309'::uuid, 'Réseaux et protocoles',
   'Le protocole de routage RIP choisit la route selon : ', 'mcq',
   '["Le plus petit nombre de sauts", "Le coût des liens", "L''ordre alphabétique", "La couleur du câble"]', 0,
   'RIP choisit la route au plus petit nombre de sauts ; OSPF, lui, tient compte du coût des liens.', 9),
  ('14610000-0000-4000-8000-000000000310'::uuid, 'Réseaux et protocoles',
   'Dans quelle couche du modèle TCP/IP se trouve le protocole HTTP ?', 'mcq',
   '["Application", "Transport", "Réseau", "Accès réseau"]', 0,
   'HTTP est un protocole de la couche application.', 10),

  -- Chapitre 4 — Algorithmique : les graphes
  ('14610000-0000-4000-8000-000000000404'::uuid, 'Algorithmique : les graphes',
   'Dans un graphe, comment appelle-t-on le lien entre deux sommets ?', 'mcq',
   '["Une arête", "Une feuille", "Une clé", "Un paquet"]', 0,
   'Une arête relie deux sommets ; dans un graphe orienté on parle d''arc.', 4),
  ('14610000-0000-4000-8000-000000000405'::uuid, 'Algorithmique : les graphes',
   'Dans une matrice d''adjacence, M[i][j] = 1 signifie qu''il existe une arête de i vers j.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La matrice d''adjacence met 1 quand une arête relie i à j, 0 sinon.', 5),
  ('14610000-0000-4000-8000-000000000406'::uuid, 'Algorithmique : les graphes',
   'Le parcours en largeur (BFS) utilise : ', 'mcq',
   '["Une file", "Une pile", "Une matrice triée", "Un arbre binaire"]', 0,
   'Le BFS explore niveau par niveau à l''aide d''une file (FIFO).', 6),
  ('14610000-0000-4000-8000-000000000407'::uuid, 'Algorithmique : les graphes',
   'Le parcours en profondeur (DFS) peut s''implémenter avec une pile ou par récursivité.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le DFS s''enfonce le plus loin possible : il utilise une pile (LIFO) ou la récursivité.', 7),
  ('14610000-0000-4000-8000-000000000408'::uuid, 'Algorithmique : les graphes',
   'Dans un graphe non pondéré, quel parcours donne le plus court chemin en nombre d''arêtes ?', 'mcq',
   '["Le parcours en largeur (BFS)", "Le parcours en profondeur (DFS)", "Le tri par insertion", "La dichotomie"]', 0,
   'Le BFS explore par niveaux : il atteint chaque sommet par le plus petit nombre d''arêtes.', 8),
  ('14610000-0000-4000-8000-000000000409'::uuid, 'Algorithmique : les graphes',
   'Quel algorithme trouve le plus court chemin quand les arêtes ont un poids ?', 'mcq',
   '["Dijkstra", "Le BFS simple", "Le tri à bulles", "La recherche linéaire"]', 0,
   'Pour des arêtes pondérées (distance, temps), on utilise l''algorithme de Dijkstra.', 9),
  ('14610000-0000-4000-8000-000000000410'::uuid, 'Algorithmique : les graphes',
   'Un graphe dont les arêtes ont un sens est dit : ', 'mcq',
   '["Orienté", "Non orienté", "Pondéré", "Complet"]', 0,
   'Un graphe est orienté quand ses arêtes (des arcs) ont un sens ; sinon il est non orienté.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'nsi'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. EXERCICES TYPE BAC — lessons.content de « Exercices types » (position 2)
--    2 exercices type bac corrigés pas à pas par chapitre.
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Structures de données', $md$# Exercices types — Structures de données

## Exercice 1 — Vérifier un parenthésage avec une pile
On veut vérifier qu'une expression est bien parenthésée (chaque « ( » a sa « ) »). Complète la fonction ci-dessous en utilisant une **pile**.

```python
def bien_parenthesee(expr):
    pile = []
    for c in expr:
        if c == "(":
            ...          # (a) que faire à l'ouverture ?
        elif c == ")":
            if pile == []:
                return False
            ...          # (b) que faire à la fermeture ?
    return ...           # (c) condition finale
```

### Correction
- (a) À une ouverture, on **empile** le caractère : `pile.append(c)`.
- (b) À une fermeture, on **dépile** (une parenthèse ouvrante est refermée) : `pile.pop()`.
- (c) L'expression est correcte si, à la fin, la **pile est vide** : `return pile == []`.

```python
def bien_parenthesee(expr):
    pile = []
    for c in expr:
        if c == "(":
            pile.append(c)
        elif c == ")":
            if pile == []:
                return False
            pile.pop()
    return pile == []
```

Test : `bien_parenthesee("(a(b)c)")` renvoie `True` ; `bien_parenthesee("(a))")` renvoie `False`.

## Exercice 2 — Parcours d'un arbre binaire
Soit l'arbre binaire dont la racine est **5**, de fils gauche **3** (fils gauche 1, fils droit 4) et de fils droit **8** (fils gauche 7).

a) Donne le parcours **en largeur** (niveau par niveau, de gauche à droite).
b) Donne le parcours **infixe** (gauche, racine, droite).

### Correction
a) Niveau 0 : 5 ; niveau 1 : 3 puis 8 ; niveau 2 : 1, 4 puis 7.
Parcours en largeur : **5, 3, 8, 1, 4, 7**.

b) Infixe = (sous-arbre gauche) puis (racine) puis (sous-arbre droit).
- Gauche de 5 : 1, 3, 4 ; racine : 5 ; droite : 7, 8.
Parcours infixe : **1, 3, 4, 5, 7, 8** (les valeurs ressortent triées : l'arbre est un arbre binaire de recherche).$md$),

    ('Bases de données et SQL', $md$# Exercices types — Bases de données et SQL

## Exercice 1 — Écrire des requêtes SELECT
On dispose de deux tables :
- `eleve(id, nom, classe)`
- `note(id, id_eleve, matiere, valeur)` où `id_eleve` est une clé étrangère vers `eleve.id`.

a) Écris la requête qui affiche le **nom** de tous les élèves de la classe `'Tle'`, triés par ordre alphabétique.
b) Écris la requête qui affiche le **nom** de l'élève et la **valeur** de ses notes en `'NSI'` (jointure).

### Correction
a) On projette `nom`, on filtre avec `WHERE`, on trie avec `ORDER BY` :
```sql
SELECT nom
FROM eleve
WHERE classe = 'Tle'
ORDER BY nom;
```

b) On relie les deux tables par la clé étrangère, puis on filtre la matière :
```sql
SELECT eleve.nom, note.valeur
FROM eleve
JOIN note ON note.id_eleve = eleve.id
WHERE note.matiere = 'NSI';
```

## Exercice 2 — Modifier la base
En reprenant les tables précédentes :

a) Écris la requête qui **ajoute** l'élève d'id 20, nommé « Sami », en classe `'Tle'`.
b) « Sami » passe finalement en `'1re'`. Écris la requête qui **met à jour** sa classe.

### Correction
a) On insère une nouvelle ligne avec `INSERT INTO … VALUES` :
```sql
INSERT INTO eleve (id, nom, classe)
VALUES (20, 'Sami', 'Tle');
```

b) On modifie la ligne concernée avec `UPDATE … SET … WHERE` :
```sql
UPDATE eleve
SET classe = '1re'
WHERE id = 20;
```
La clause `WHERE id = 20` est **essentielle** : sans elle, toutes les lignes de la table seraient modifiées.$md$),

    ('Réseaux et protocoles', $md$# Exercices types — Réseaux et protocoles

## Exercice 1 — Suivre un paquet dans le réseau
Un ordinateur A veut envoyer une page web à un ordinateur B situé sur un autre réseau. Le message passe par plusieurs routeurs.

a) Explique pourquoi le message est découpé en **paquets**.
b) Quelles informations un routeur lit-il dans l'**en-tête** d'un paquet pour l'acheminer ?
c) Deux paquets d'un même message empruntent-ils forcément le même chemin ?

### Correction
a) Le découpage en paquets permet de **partager** les liens entre plusieurs communications et de **retransmettre** seulement un petit paquet en cas d'erreur, plutôt que tout le message.

b) Le routeur lit l'**adresse IP de destination** (et de source). Grâce à sa **table de routage**, il choisit le **prochain saut** vers cette destination.

c) **Non** : chaque paquet est acheminé indépendamment. Selon l'état du réseau, deux paquets peuvent suivre des chemins différents et arriver dans le désordre ; ils sont **réassemblés** à l'arrivée (rôle de TCP).

## Exercice 2 — TCP ou UDP ?
Pour chacun des usages suivants, indique s'il vaut mieux utiliser **TCP** ou **UDP**, en justifiant :

a) Le téléchargement d'un fichier.
b) La visioconférence en direct.

### Correction
a) **TCP** : le fichier doit arriver **complet et dans l'ordre**, sans aucune perte. TCP garantit la réception (accusés de réception et retransmission des paquets perdus).

b) **UDP** : en visioconférence, la **rapidité** prime sur la perfection. Retransmettre un paquet perdu arriverait trop tard ; on préfère UDP, plus rapide et sans connexion, quitte à perdre quelques images.

À retenir : **TCP** = fiable et connecté ; **UDP** = rapide, sans garantie, adapté au temps réel.$md$),

    ('Algorithmique : les graphes', $md$# Exercices types — Algorithmique : les graphes

## Exercice 1 — Tracer un parcours en largeur
On considère le graphe non orienté donné par sa liste d'adjacence :

```python
graphe = {
    "A": ["B", "C"],
    "B": ["A", "D", "E"],
    "C": ["A", "F"],
    "D": ["B"],
    "E": ["B", "F"],
    "F": ["C", "E"],
}
```

a) Donne l'ordre de visite d'un **parcours en largeur (BFS)** à partir de `"A"` (voisins explorés dans l'ordre de la liste).
b) Quelle structure de données garantit l'ordre « niveau par niveau » ?

### Correction
a) On part de A, puis on visite ses voisins, puis les voisins des voisins :
- niveau 0 : A ;
- niveau 1 : B, C (voisins de A) ;
- niveau 2 : D, E (voisins de B), F (voisin de C).
Ordre de visite : **A, B, C, D, E, F**.

b) L'ordre niveau par niveau est garanti par une **file** (FIFO) : on enfile chaque sommet découvert et on défile toujours le plus ancien. Un ensemble `vus` évite de repasser deux fois sur un sommet.

## Exercice 2 — Compléter un parcours en profondeur récursif
Complète la fonction de **parcours en profondeur (DFS)** récursif qui affiche les sommets visités.

```python
def dfs(graphe, sommet, vus):
    vus.add(sommet)
    print(sommet)
    for voisin in graphe[sommet]:
        if ... :          # (a) condition
            dfs(graphe, voisin, vus)   # (b) que fait cet appel ?
```

### Correction
- (a) On ne relance l'exploration que sur un voisin **non encore visité** : `if voisin not in vus:`.
- (b) L'appel `dfs(graphe, voisin, vus)` est **récursif** : il s'enfonce dans le voisin avant de revenir explorer les autres. C'est ce qui distingue le DFS (en profondeur) du BFS (en largeur).

```python
def dfs(graphe, sommet, vus):
    vus.add(sommet)
    print(sommet)
    for voisin in graphe[sommet]:
        if voisin not in vus:
            dfs(graphe, voisin, vus)
```

Appel de départ : `dfs(graphe, "A", set())`. L'ensemble `vus` empêche de tourner en boucle sur les cycles du graphe.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'nsi'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'Exercices types'
   AND l.content IS DISTINCT FROM v.md;
