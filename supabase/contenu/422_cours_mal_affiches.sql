-- =============================================================================
-- Studuel — Migration 422 : COURS MAL AFFICHÉS CORRIGÉS
--
-- 19 fragments, remplacés à l’endroit exact où ils sont.
-- Relevé du 29/09/2026 sur les 2 969 cours : tableaux collés qui fusionnaient, cellules vides, tableau de 16 colonnes, balise HTML affichée telle quelle, et 12 programmes présentés en tableau (indentation simulée par des points) devenus de vrais blocs de code.
-- La même correction est faite dans la source (scripts/contenu, contenu/controles).
--
-- ⚠️ FICHIER GÉNÉRÉ — ne pas éditer à la main. Source : contenu/corrections/.
--    Regénérer : node scripts/corrections-sql.mjs --num 422 --fichiers lot-e-rendu,lot-f-code --titre … --motif … (ceux de l’en-tête)
--
-- Idempotent : chaque UPDATE ne touche que les lignes qui contiennent encore le
-- fragment fautif. À exécuter APRÈS 385 → 399 (les cours qu’elles réécrivent).
-- Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

DROP TABLE IF EXISTS pg_temp._corrections;
CREATE TEMP TABLE _corrections (n int, slug text, level text, chapter text, champ text, ancien text, nouveau text);
INSERT INTO _corrections VALUES
  (1, 'physique-chimie-maths', '1re', 'Mesure et incertitudes', 'cours', 'décalées dans le même sens |
| La qualité | Définition |', 'décalées dans le même sens |

| La qualité | Définition |'),
  (2, 'physique-chimie-maths', 'Tle', 'Acides, bases et pH', 'cours', 'reliés par : AH = A⁻ + H⁺ |
| Le couple | Acide | Base |', 'reliés par : AH = A⁻ + H⁺ |

| Le couple | Acide | Base |'),
  (3, 'francais', '4e', 'L’importance de la ville dans le roman policier', 'cours', 'on court après le criminel |

## Le rôle de la ville', 'on court après le criminel | Harlan Coben, Franck Thilliez |

## Le rôle de la ville'),
  (4, 'francais', '4e', 'L’importance de la ville dans le roman policier', 'cours', '| Ce qu’elle fournit | |', '| Ce qu’elle fournit | Ce qu’elle apporte au roman |'),
  (5, 'francais', '4e', 'L’importance de la ville dans le roman policier', 'cours', '| Une **atmosphère** | |', '| Une **atmosphère** | Brouillard, pluie, nuit : le décor inquiète avant le crime |'),
  (6, 'maths', '3e', 'La racine carrée et l’équation x² = a', 'cours', '| n | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
| n² | 1 | 4 | 9 | 16 | 25 | 36 | 49 | 64 | 81 | 100 | 121 | 144 | 169 | 196 | 225 |', '| n | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| n² | 1 | 4 | 9 | 16 | 25 | 36 | 49 | 64 |

| n | 9 | 10 | 11 | 12 | 13 | 14 | 15 |
| n² | 81 | 100 | 121 | 144 | 169 | 196 | 225 |'),
  (7, 'latin', '3e', 'L''Empire romain', 'cours', '(I<sup>er</sup>-II<sup>e</sup> s. apr. J.-C.)', '(Ier et IIe siècles apr. J.-C.)'),
  (8, 'maths', '1re', 'Simulation et échantillonnage : la moyenne se stabilise', 'cours', '| Ligne | Code |
| 1 | def essai(p): |
| 2 | ····if random() < p: |
| 3 | ········return 1 |
| 4 | ····return 0 |', '```python
def essai(p):
    if random() < p:
        return 1
    return 0
```'),
  (9, 'maths-techno', 'Tle', 'Placements, versements réguliers et sommes', 'cours', '| Ligne | Code |
| 1 | def somme_carres(n): |
| 2 | … s = 0 |
| 3 | … for k in range(1, n + 1): |
| 4 | … … s = s + pow(k, 2) |
| 5 | … return s |', '```python
def somme_carres(n):
    s = 0
    for k in range(1, n + 1):
        s = s + pow(k, 2)
    return s
```'),
  (10, 'maths-techno', '1re', 'Les suites numériques : générer et représenter', 'cours', '| Ligne | Code |
| 1 | n ← 0 |
| 2 | u ← 2 |
| 3 | tant que u ≤ 100 : |
| 4 | … n ← n + 1 |
| 5 | … u ← 2 × u − 1 |
| 6 | afficher n |', '```
n ← 0
u ← 2
tant que u ≤ 100 :
    n ← n + 1
    u ← 2 × u − 1
afficher n
```'),
  (11, 'maths', '1re', 'Les listes en Python', 'cours', '| Ligne | Code |
| 1 | s = 0 |
| 2 | for x in L: |
| 3 | ····s = s + x |', '```python
s = 0
for x in L:
    s = s + x
```'),
  (12, 'maths', '1re', 'Les listes en Python', 'cours', '| Ligne | Code |
| 1 | def termes(n): |
| 2 | ····u = 1000 |
| 3 | ····L = [u] |
| 4 | ····for i in range(n): |
| 5 | ········u = 1.05 * u |
| 6 | ········L.append(u) |
| 7 | ····return L |', '```python
def termes(n):
    u = 1000
    L = [u]
    for i in range(n):
        u = 1.05 * u
        L.append(u)
    return L
```'),
  (13, 'maths', '1re', 'Seuil, Newton, Euler : les algorithmes à connaître', 'cours', '| Ligne | Code |
| 1 | def seuil(): |
| 2 | ····n = 0 |
| 3 | ····u = 1000 |
| 4 | ····while u < 2000: |
| 5 | ········n = n + 1 |
| 6 | ········u = 1.05 * u |
| 7 | ····return n |', '```python
def seuil():
    n = 0
    u = 1000
    while u < 2000:
        n = n + 1
        u = 1.05 * u
    return n
```'),
  (14, 'ingenierie-dd', '1re', 'Codage de l’information et algorithmique', 'cours', '| Ligne | Code |
| 1 | tant que vrai : |
| 2 | lum ← lire_luminosite() |
| 3 | si lum < 300 et presence = vrai alors allumer() |
| 4 | sinon eteindre() |
| 5 | attendre(0,5 s) |', '```
tant que vrai :
    lum ← lire_luminosite()
    si lum < 300 et presence = vrai alors allumer()
    sinon eteindre()
    attendre(0,5 s)
```'),
  (15, 'maths', '1re', 'Python : variables, tests, boucles et fonctions', 'cours', '| Ligne | Code |
| 1 | s = 0 |
| 2 | for i in range(4): |
| 3 | ····s = s + i |', '```python
s = 0
for i in range(4):
    s = s + i
```'),
  (16, 'maths', '1re', 'Python : variables, tests, boucles et fonctions', 'cours', '| Ligne | Code |
| 1 | def terme(n): |
| 2 | ····u = 5 |
| 3 | ····for i in range(n): |
| 4 | ········u = 2 * u + 1 |
| 5 | ····return u |', '```python
def terme(n):
    u = 5
    for i in range(n):
        u = 2 * u + 1
    return u
```'),
  (17, 'spcl', '1re', 'Chaîne de mesure en tout ou rien et régulation de température', 'cours', '| Ligne | Code |
| 1 | lire la tension du capteur |
| 2 | convertir en température |
| 3 | si température > seuil alors allumer l’alarme |
| 4 | sinon éteindre l’alarme |
| 5 | attendre, puis recommencer |', '```
lire la tension du capteur
convertir en température
si température > seuil alors allumer l’alarme
sinon éteindre l’alarme
attendre, puis recommencer
```'),
  (18, 'management-sgn', 'Tle', 'Systèmes d’information de gestion', 'cours', '| Ligne | Code |
| 1 | SELECT nom, ville |
| 2 | FROM CLIENT |
| 3 | WHERE ville = ''Lyon'' |
| 4 | ORDER BY nom ; |', '```sql
SELECT nom, ville
FROM CLIENT
WHERE ville = ''Lyon''
ORDER BY nom ;
```'),
  (19, 'maths-techno', 'Tle', 'Coefficients binomiaux et triangle de Pascal', 'cours', '| Ligne | Code |
| 1 | def triangle(n): |
| 2 | … ligne = [1] |
| 3 | … for i in range(n): |
| 4 | … … ligne = [1] + [ligne[k] + ligne[k+1] for k in range(len(ligne) - 1)] + [1] |
| 5 | … return ligne |', '```python
def triangle(n):
    ligne = [1]
    for i in range(n):
        ligne = [1] + [ligne[k] + ligne[k+1] for k in range(len(ligne) - 1)] + [1]
    return ligne
```');

-- Les cours, une correction à la fois (plusieurs peuvent viser la même leçon).
DO $$
DECLARE k record;
BEGIN
  FOR k IN SELECT * FROM _corrections WHERE champ = 'cours' ORDER BY n LOOP
    UPDATE public.lessons l SET content = replace(l.content, k.ancien, k.nouveau)
      FROM public.subjects s
      JOIN public.chapters c ON c.subject_id = s.id
     WHERE s.slug = k.slug AND c.level = k.level AND c.title = k.chapter
       AND l.chapter_id = c.id AND strpos(l.content, k.ancien) > 0;
  END LOOP;
END $$;

-- Les questions de quiz (énoncé, explication, options), une correction à la fois.
DO $$
DECLARE k record;
BEGIN
  FOR k IN SELECT * FROM _corrections WHERE champ <> 'cours' ORDER BY n LOOP
    UPDATE public.quiz_questions x
       SET question    = CASE WHEN k.champ = 'question'    THEN replace(x.question, k.ancien, k.nouveau) ELSE x.question END,
           explanation = CASE WHEN k.champ = 'explication' THEN replace(x.explanation, k.ancien, k.nouveau) ELSE x.explanation END,
           options     = CASE WHEN k.champ = 'options'     THEN replace(x.options::text, k.ancien, k.nouveau)::jsonb ELSE x.options END
      FROM public.quizzes qz
      JOIN public.lessons l ON l.id = qz.lesson_id
      JOIN public.chapters c ON c.id = l.chapter_id
      JOIN public.subjects s ON s.id = c.subject_id
     WHERE x.quiz_id = qz.id AND s.slug = k.slug AND c.level = k.level AND c.title = k.chapter
       AND strpos(CASE k.champ WHEN 'question' THEN x.question WHEN 'explication' THEN x.explanation ELSE x.options::text END, k.ancien) > 0;
  END LOOP;
END $$;

-- Contrôle d’arrivée : chaque correction doit voir son texte juste en place.
DO $$
DECLARE n_absentes int;
BEGIN
  SELECT count(*) INTO n_absentes FROM _corrections k
   WHERE NOT EXISTS (
     SELECT 1 FROM public.subjects s
       JOIN public.chapters c ON c.subject_id = s.id AND c.level = k.level AND c.title = k.chapter
       JOIN public.lessons l ON l.chapter_id = c.id
       LEFT JOIN public.quizzes qz ON qz.lesson_id = l.id
       LEFT JOIN public.quiz_questions x ON x.quiz_id = qz.id
      WHERE s.slug = k.slug
        AND strpos(CASE k.champ WHEN 'cours' THEN l.content WHEN 'question' THEN x.question
                   WHEN 'explication' THEN x.explanation ELSE x.options::text END, k.nouveau) > 0);
  RAISE NOTICE 'Migration 422 : % correction(s) sur 19 introuvables.', n_absentes;
  IF n_absentes > 0 THEN
    RAISE WARNING 'Migration 422 : des corrections n''ont pas trouvé leur fiche (titre, niveau ou fragment changé ?).';
  END IF;
END $$;

DROP TABLE IF EXISTS pg_temp._corrections;
