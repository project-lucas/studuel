-- =============================================================================
-- Studuel — Migration 136 : CONTENU NSI 1re (cours + carte mentale + quiz)
-- Remplit les 4 chapitres de NSI 1re (spécialité Numérique et sciences
-- informatiques, programme officiel) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder)
--   2. Carte mentale → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz        → complète le quiz de la leçon (→ 10 questions). Les
--                    questions sont attachées au quiz DE LA LEÇON via la jointure
--                    leçon→quiz (robuste à l'id existant), positions 4→10.
--
-- Motif idempotent (comme 090) : UPDATE joint sur la clé naturelle
-- (slug, niveau, chapitre[, leçon]), garde `IS DISTINCT FROM`, contenu en
-- dollar-quoting $md$/$json$ ; INSERT des questions avec UUID fixes + garde
-- anti-doublon (ON CONFLICT). Filet : crée le quiz s'il manque. Réexécutable.
--
-- PRÉREQUIS : subjects/chapters/lessons NSI 1re, mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Types de données et représentation', $md$# Types de données et représentation

## Ce que tu vas comprendre
Un ordinateur ne manipule que des **0** et des **1**. Ce chapitre t'explique comment on représente les nombres, les caractères et les valeurs logiques à partir de ces deux chiffres binaires (**bits**).

## 1. Le binaire (base 2)
En base 2, chaque position vaut une puissance de 2 : 1, 2, 4, 8, 16, 32… (de droite à gauche). Un **bit** vaut 0 ou 1, un **octet** est un groupe de 8 bits.

*Exemple : 1101 en binaire = 1×8 + 1×4 + 0×2 + 1×1 = **13** en décimal.*

## 2. L'hexadécimal (base 16)
La base 16 utilise les chiffres 0 à 9 puis les lettres A, B, C, D, E, F (A=10 … F=15). Elle sert à écrire de façon compacte : **4 bits = 1 chiffre hexadécimal**.

*Exemple : 1111 en binaire = **F** en hexadécimal = 15 en décimal.*

## 3. Les entiers
Un entier positif s'écrit directement en binaire. Avec **n bits**, on code les entiers de 0 à **2ⁿ − 1** (par exemple sur 8 bits : 0 à 255).

## 4. Les nombres flottants
Les nombres à virgule sont approchés par des **flottants** (norme IEEE 754). Attention : certaines valeurs simples ne sont pas exactes en binaire.

```python
>>> 0.1 + 0.2
0.30000000000000004
```

## 5. Les booléens
Un **booléen** ne prend que deux valeurs : `True` ou `False`. On combine les booléens avec les opérateurs logiques **et** (`and`), **ou** (`or`), **non** (`not`).

## 6. L'encodage des caractères
Chaque caractère est associé à un nombre : c'est un **encodage**. La table **ASCII** code les caractères courants sur 7 bits ; l'**Unicode / UTF-8** étend cela à tous les alphabets et emojis du monde.

*Exemple : le caractère `A` a pour code ASCII **65**.*

## L'essentiel à retenir
- Le **bit** vaut 0 ou 1 ; un **octet** = 8 bits.
- Binaire : chaque position vaut une puissance de 2 ; hexadécimal : 4 bits = 1 chiffre.
- Sur n bits, on code les entiers de 0 à **2ⁿ − 1**.
- Les **flottants** sont approchés (0,1 + 0,2 n'est pas exact).
- Les **caractères** sont encodés (ASCII, UTF-8) : `A` = 65.$md$),

    ('Python : bases de la programmation', $md$# Python : bases de la programmation

## Ce que tu vas comprendre
Python est le langage de la spécialité NSI. Ce chapitre pose les **briques de base** : variables, types, opérateurs, conditions, boucles et fonctions.

## 1. Variables et affectation
Une **variable** est un nom qui désigne une valeur. On l'affecte avec `=`.

```python
age = 15
nom = "Léa"
```

## 2. Les types de base
- **int** : entier (`42`)
- **float** : nombre à virgule (`3.14`)
- **str** : chaîne de caractères (`"bonjour"`)
- **bool** : booléen (`True` / `False`)

La fonction `type(x)` donne le type d'une valeur.

## 3. Les opérateurs
- Arithmétiques : `+`, `-`, `*`, `/`, `//` (division entière), `%` (reste), `**` (puissance).
- Comparaison : `==`, `!=`, `<`, `>`, `<=`, `>=`.

*Exemple : `17 // 5` vaut **3** et `17 % 5` vaut **2**.*

## 4. Les conditions
On exécute du code **selon une condition** avec `if` / `elif` / `else`.

```python
if note >= 10:
    print("Reçu")
else:
    print("À revoir")
```

## 5. Les boucles
- La boucle **for** répète pour chaque valeur d'une séquence.
- La boucle **while** répète **tant que** la condition est vraie.

```python
for i in range(3):
    print(i)      # affiche 0 puis 1 puis 2
```

## 6. Les fonctions
Une **fonction** regroupe des instructions réutilisables. On la définit avec `def` et on renvoie un résultat avec `return`.

```python
def carre(x):
    return x * x

print(carre(4))   # affiche 16
```

## L'essentiel à retenir
- On affecte une variable avec `=` ; `type(x)` donne son type.
- Types de base : **int**, **float**, **str**, **bool**.
- `//` = division entière, `%` = reste, `**` = puissance.
- Conditions : `if` / `elif` / `else` ; boucles : `for` et `while`.
- Une **fonction** se définit avec `def` et renvoie une valeur avec `return`.$md$),

    ('Tableaux et dictionnaires', $md$# Tableaux et dictionnaires

## Ce que tu vas comprendre
Pour manipuler beaucoup de valeurs, on utilise des **collections**. Ce chapitre présente les **listes** (tableaux) et les **dictionnaires**, puis deux algorithmes de recherche.

## 1. Les listes
Une **liste** (tableau en Python) contient plusieurs valeurs ordonnées, entre crochets.

```python
notes = [12, 15, 9, 18]
```

## 2. L'indexation
Chaque élément a un **indice** qui commence à **0**. On accède à un élément avec `liste[indice]`.

```python
notes = [12, 15, 9, 18]
print(notes[0])    # affiche 12
print(notes[3])    # affiche 18
```

*Le dernier élément a l'indice `len(liste) - 1`.*

## 3. Parcourir une liste
On parcourt une liste avec une boucle **for**.

```python
for note in notes:
    print(note)
```

## 4. Les dictionnaires
Un **dictionnaire** associe des **clés** à des **valeurs** (couples clé/valeur), entre accolades.

```python
eleve = {"nom": "Léa", "age": 15}
print(eleve["nom"])    # affiche Léa
```

On accède à une valeur par sa **clé**, pas par un indice.

## 5. Algorithmes de recherche
- La **recherche séquentielle** parcourt la liste du début à la fin jusqu'à trouver la valeur.
- La **recherche dichotomique** ne marche que sur une liste **triée** : elle coupe en deux à chaque étape, donc elle est bien plus rapide.

```python
def recherche(liste, cible):
    for element in liste:
        if element == cible:
            return True
    return False
```

## L'essentiel à retenir
- Une **liste** stocke des valeurs ordonnées ; l'**indice** commence à **0**.
- Le dernier indice est `len(liste) - 1`.
- Un **dictionnaire** associe des **clés** à des **valeurs** (accès par la clé).
- **Recherche séquentielle** : on parcourt tout ; **dichotomique** : liste triée, on coupe en deux (plus rapide).$md$),

    ('Le web : HTML, CSS, HTTP', $md$# Le web : HTML, CSS, HTTP

## Ce que tu vas comprendre
Une page web repose sur trois piliers : **HTML** (le contenu), **CSS** (l'apparence) et **HTTP** (le transport entre le navigateur et le serveur). Ce chapitre les relie.

## 1. HTML : la structure
Le **HTML** décrit le **contenu** de la page avec des **balises** entre chevrons, souvent par paires (ouvrante et fermante).

```html
<h1>Titre principal</h1>
<p>Un paragraphe de texte.</p>
```

Balises courantes : `<h1>` (titre), `<p>` (paragraphe), `<a>` (lien), `<img>` (image), `<ul>`/`<li>` (liste).

## 2. CSS : le style
Le **CSS** décrit l'**apparence** : couleurs, tailles, positions. On cible un élément par un **sélecteur** puis on liste des propriétés.

```css
p {
  color: blue;
  font-size: 16px;
}
```

## 3. Le modèle client / serveur
Le **client** (ton navigateur) **demande** une page ; le **serveur** la **renvoie**. Le web fonctionne sur ce dialogue requête → réponse.

## 4. HTTP : requête et réponse
**HTTP** est le protocole d'échange du web. Le client envoie une **requête** (méthode **GET** pour demander une page, **POST** pour envoyer des données) ; le serveur renvoie une **réponse** avec un **code de statut**.

- **200** : tout va bien (OK).
- **404** : page **non trouvée**.
- **500** : erreur côté serveur.

*La version sécurisée et chiffrée s'appelle **HTTPS**.*

## L'essentiel à retenir
- **HTML** = contenu (balises), **CSS** = apparence, **HTTP** = transport.
- Une balise HTML s'écrit entre chevrons, souvent par paires : `<p>…</p>`.
- Modèle **client / serveur** : le client demande, le serveur répond.
- HTTP : **GET** demande, **POST** envoie ; code **200** = OK, **404** = non trouvée.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'nsi'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '1re' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Types de données et représentation', $json${
      "centre": "Types de données et représentation",
      "branches": [
        { "titre": "Binaire et hexadécimal", "enfants": ["Bit = 0 ou 1, octet = 8 bits", "Base 2 : puissances de 2", "Hexa : 4 bits = 1 chiffre (0-F)"] },
        { "titre": "Nombres", "enfants": ["Entiers : 0 à 2ⁿ − 1", "Flottants approchés (IEEE 754)", "0,1 + 0,2 n'est pas exact"] },
        { "titre": "Booléens", "enfants": ["True / False", "and, or, not", "Deux valeurs seulement"] },
        { "titre": "Caractères", "enfants": ["Encodage = code par caractère", "ASCII : A = 65", "Unicode / UTF-8 : tous les alphabets"] }
      ]
    }$json$),
    ('Python : bases de la programmation', $json${
      "centre": "Python : les bases",
      "branches": [
        { "titre": "Variables et types", "enfants": ["Affectation avec =", "int, float, str, bool", "type(x) donne le type"] },
        { "titre": "Opérateurs", "enfants": ["+ - * / // %", "** = puissance", "== < > pour comparer"] },
        { "titre": "Conditions", "enfants": ["if / elif / else", "Selon une condition", "Bloc indenté"] },
        { "titre": "Boucles et fonctions", "enfants": ["for : chaque valeur", "while : tant que", "def … return"] }
      ]
    }$json$),
    ('Tableaux et dictionnaires', $json${
      "centre": "Tableaux et dictionnaires",
      "branches": [
        { "titre": "Listes", "enfants": ["Valeurs ordonnées [ ]", "Indice commence à 0", "Dernier : len(liste) − 1"] },
        { "titre": "Parcours", "enfants": ["Accès : liste[indice]", "Boucle for element in liste", "len() = nombre d'éléments"] },
        { "titre": "Dictionnaires", "enfants": ["Couples clé / valeur { }", "Accès par la clé", "eleve['nom']"] },
        { "titre": "Recherche", "enfants": ["Séquentielle : tout parcourir", "Dichotomique : liste triée", "Couper en deux = plus rapide"] }
      ]
    }$json$),
    ('Le web : HTML, CSS, HTTP', $json${
      "centre": "Le web : HTML, CSS, HTTP",
      "branches": [
        { "titre": "HTML : contenu", "enfants": ["Balises entre chevrons", "Par paires : <p>…</p>", "h1, p, a, img, ul/li"] },
        { "titre": "CSS : apparence", "enfants": ["Couleurs, tailles, positions", "Sélecteur + propriétés", "color, font-size"] },
        { "titre": "Client / serveur", "enfants": ["Client = navigateur", "Serveur renvoie la page", "Requête → réponse"] },
        { "titre": "HTTP", "enfants": ["GET demande, POST envoie", "200 = OK, 404 = non trouvée", "HTTPS = version chiffrée"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'nsi'
 WHERE c.subject_id = s.id AND c.level = '1re' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'NSI', '1re', v.chapter, true, l.id
FROM (VALUES
  ('13619999-0000-4000-8000-000000000001'::uuid, 'Types de données et représentation'),
  ('13619999-0000-4000-8000-000000000002'::uuid, 'Python : bases de la programmation'),
  ('13619999-0000-4000-8000-000000000003'::uuid, 'Tableaux et dictionnaires'),
  ('13619999-0000-4000-8000-000000000004'::uuid, 'Le web : HTML, CSS, HTTP')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'nsi'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '1re' AND c.title = v.chapter
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
  -- Chapitre 1 — Types de données et représentation
  ('13610000-0000-4000-8000-000000000104'::uuid, 'Types de données et représentation',
   'Que vaut le nombre binaire 1101 en décimal ?', 'mcq',
   '["13", "11", "26", "1101"]', 0,
   '1101 = 1×8 + 1×4 + 0×2 + 1×1 = 8 + 4 + 1 = 13.', 4),
  ('13610000-0000-4000-8000-000000000105'::uuid, 'Types de données et représentation',
   'Combien de bits contient un octet ?', 'mcq',
   '["8", "4", "16", "1"]', 0,
   'Un octet est un groupe de 8 bits.', 5),
  ('13610000-0000-4000-8000-000000000106'::uuid, 'Types de données et représentation',
   'En hexadécimal, un seul chiffre représente 4 bits.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La base 16 regroupe les bits par 4 : 4 bits = 1 chiffre hexadécimal (0 à F).', 6),
  ('13610000-0000-4000-8000-000000000107'::uuid, 'Types de données et représentation',
   'Sur 8 bits, quel est le plus grand entier positif que l''on peut coder ?', 'mcq',
   '["255", "256", "128", "8"]', 0,
   'Sur n bits on code de 0 à 2ⁿ − 1, donc sur 8 bits jusqu''à 2⁸ − 1 = 255.', 7),
  ('13610000-0000-4000-8000-000000000108'::uuid, 'Types de données et représentation',
   'En Python, que renvoie 0.1 + 0.2 ?', 'mcq',
   '["0.30000000000000004", "0.3", "0.5", "Une erreur"]', 0,
   'Les flottants sont approchés en binaire : le résultat n''est pas exactement 0.3.', 8),
  ('13610000-0000-4000-8000-000000000109'::uuid, 'Types de données et représentation',
   'Quel est le code ASCII de la lettre A ?', 'mcq',
   '["65", "1", "97", "26"]', 0,
   'Dans la table ASCII, le caractère A majuscule a pour code 65.', 9),
  ('13610000-0000-4000-8000-000000000110'::uuid, 'Types de données et représentation',
   'Un booléen peut prendre plus de deux valeurs différentes.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : un booléen ne prend que deux valeurs, True ou False.', 10),

  -- Chapitre 2 — Python : bases de la programmation
  ('13610000-0000-4000-8000-000000000204'::uuid, 'Python : bases de la programmation',
   'Quel symbole utilise-t-on pour affecter une valeur à une variable en Python ?', 'mcq',
   '["=", "==", "->", ":="]', 0,
   'L''affectation se fait avec un simple signe = ; == sert à comparer.', 4),
  ('13610000-0000-4000-8000-000000000205'::uuid, 'Python : bases de la programmation',
   'Que vaut 17 // 5 en Python ?', 'mcq',
   '["3", "3.4", "2", "12"]', 0,
   '// est la division entière : 17 // 5 = 3 (et 17 % 5 = 2 est le reste).', 5),
  ('13610000-0000-4000-8000-000000000206'::uuid, 'Python : bases de la programmation',
   'Quel type Python correspond à la valeur "bonjour" ?', 'mcq',
   '["str", "int", "bool", "float"]', 0,
   'Une chaîne de caractères entre guillemets est de type str.', 6),
  ('13610000-0000-4000-8000-000000000207'::uuid, 'Python : bases de la programmation',
   'Que fait afficher cette boucle : for i in range(3): print(i) ?', 'mcq',
   '["0 puis 1 puis 2", "1 puis 2 puis 3", "0 puis 1 puis 2 puis 3", "3"]', 0,
   'range(3) parcourt 0, 1, 2 (le 3 est exclu).', 7),
  ('13610000-0000-4000-8000-000000000208'::uuid, 'Python : bases de la programmation',
   'La boucle while répète les instructions tant que sa condition est vraie.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'while répète le bloc tant que la condition reste vraie.', 8),
  ('13610000-0000-4000-8000-000000000209'::uuid, 'Python : bases de la programmation',
   'Quel mot-clé sert à définir une fonction en Python ?', 'mcq',
   '["def", "func", "function", "return"]', 0,
   'On définit une fonction avec def ; return sert à renvoyer un résultat.', 9),
  ('13610000-0000-4000-8000-000000000210'::uuid, 'Python : bases de la programmation',
   'Si def carre(x): return x * x, que vaut carre(4) ?', 'mcq',
   '["16", "8", "4", "44"]', 0,
   'La fonction renvoie x * x, donc 4 * 4 = 16.', 10),

  -- Chapitre 3 — Tableaux et dictionnaires
  ('13610000-0000-4000-8000-000000000304'::uuid, 'Tableaux et dictionnaires',
   'Dans la liste notes = [12, 15, 9, 18], que vaut notes[0] ?', 'mcq',
   '["12", "15", "18", "1"]', 0,
   'L''indice commence à 0, donc notes[0] est le premier élément : 12.', 4),
  ('13610000-0000-4000-8000-000000000305'::uuid, 'Tableaux et dictionnaires',
   'Dans une liste, le premier élément a l''indice 1.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : l''indexation commence à 0, donc le premier élément a l''indice 0.', 5),
  ('13610000-0000-4000-8000-000000000306'::uuid, 'Tableaux et dictionnaires',
   'Pour une liste de 4 éléments, quel est l''indice du dernier élément ?', 'mcq',
   '["3", "4", "5", "0"]', 0,
   'Le dernier indice est len(liste) − 1, soit 4 − 1 = 3.', 6),
  ('13610000-0000-4000-8000-000000000307'::uuid, 'Tableaux et dictionnaires',
   'Dans un dictionnaire, on accède à une valeur par : ', 'mcq',
   '["sa clé", "son indice", "sa position", "sa couleur"]', 0,
   'Un dictionnaire associe des clés à des valeurs : on accède à la valeur par sa clé.', 7),
  ('13610000-0000-4000-8000-000000000308'::uuid, 'Tableaux et dictionnaires',
   'Avec eleve = {"nom": "Léa", "age": 15}, que vaut eleve["nom"] ?', 'mcq',
   '["Léa", "15", "nom", "age"]', 0,
   'La clé "nom" est associée à la valeur "Léa".', 8),
  ('13610000-0000-4000-8000-000000000309'::uuid, 'Tableaux et dictionnaires',
   'La recherche dichotomique nécessite une liste triée.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La recherche dichotomique ne fonctionne que sur une liste triée, car elle coupe en deux à chaque étape.', 9),
  ('13610000-0000-4000-8000-000000000310'::uuid, 'Tableaux et dictionnaires',
   'Comment parcourt-on tous les éléments d''une liste appelée notes ?', 'mcq',
   '["for note in notes:", "if note in notes:", "def notes:", "while notes."]', 0,
   'La boucle for note in notes: parcourt chaque élément de la liste.', 10),

  -- Chapitre 4 — Le web : HTML, CSS, HTTP
  ('13610000-0000-4000-8000-000000000404'::uuid, 'Le web : HTML, CSS, HTTP',
   'À quoi sert le langage HTML dans une page web ?', 'mcq',
   '["Décrire le contenu et la structure", "Choisir les couleurs", "Transporter les données", "Faire des calculs"]', 0,
   'Le HTML décrit le contenu et la structure ; le CSS gère l''apparence.', 4),
  ('13610000-0000-4000-8000-000000000405'::uuid, 'Le web : HTML, CSS, HTTP',
   'Quelle balise HTML définit un paragraphe ?', 'mcq',
   '["<p>", "<h1>", "<a>", "<img>"]', 0,
   'La balise <p> définit un paragraphe ; <h1> est un titre, <a> un lien.', 5),
  ('13610000-0000-4000-8000-000000000406'::uuid, 'Le web : HTML, CSS, HTTP',
   'Le CSS sert à définir l''apparence (couleurs, tailles, positions) d''une page.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le CSS décrit le style : couleurs, tailles, positions des éléments.', 6),
  ('13610000-0000-4000-8000-000000000407'::uuid, 'Le web : HTML, CSS, HTTP',
   'Dans le modèle client / serveur, qui envoie la requête ?', 'mcq',
   '["Le client (le navigateur)", "Le serveur", "Le câble", "Le fichier CSS"]', 0,
   'Le client (navigateur) envoie la requête ; le serveur renvoie la réponse.', 7),
  ('13610000-0000-4000-8000-000000000408'::uuid, 'Le web : HTML, CSS, HTTP',
   'Quelle méthode HTTP sert à demander (récupérer) une page ?', 'mcq',
   '["GET", "POST", "PUT", "STOP"]', 0,
   'GET sert à demander une ressource ; POST sert à envoyer des données au serveur.', 8),
  ('13610000-0000-4000-8000-000000000409'::uuid, 'Le web : HTML, CSS, HTTP',
   'Que signifie le code de statut HTTP 404 ?', 'mcq',
   '["Page non trouvée", "Tout va bien", "Erreur du serveur", "Accès interdit"]', 0,
   '404 signifie que la page demandée n''a pas été trouvée (200 = OK, 500 = erreur serveur).', 9),
  ('13610000-0000-4000-8000-000000000410'::uuid, 'Le web : HTML, CSS, HTTP',
   'HTTPS est la version chiffrée et sécurisée de HTTP.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'HTTPS ajoute le chiffrement à HTTP pour sécuriser les échanges.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'nsi'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '1re' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
