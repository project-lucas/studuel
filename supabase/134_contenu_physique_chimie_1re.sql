-- =============================================================================
-- Studuel — Migration 134 : CONTENU Physique-Chimie 1re (cours + carte mentale + quiz)
-- Remplit les 5 chapitres de Physique-Chimie 1re (spécialité, programme officiel) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder initial)
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
-- PRÉREQUIS : subjects/chapters/lessons (Physique-Chimie 1re), mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Suivi d''une transformation chimique', $md$# Suivi d'une transformation chimique

## Ce que tu vas comprendre
Au cours d'une transformation, les réactifs se consomment et les produits se forment. Ce chapitre t'apprend à **quantifier** cette évolution avec l'**avancement**, à repérer le **réactif limitant** et à déterminer une concentration inconnue par **titrage**.

## 1. L'équation et les quantités de matière
Une transformation est décrite par une **équation ajustée** : les nombres devant les formules (**coefficients stœchiométriques**) donnent les proportions de consommation et de formation.

*Exemple : 2 H₂ + O₂ → 2 H₂O. Il faut 2 fois plus de H₂ que de O₂.*

## 2. L'avancement x
L'**avancement** x (en mol) mesure « combien de fois » la réaction a eu lieu. Pour un réactif de coefficient a, la quantité restante vaut **n(t) = n₀ − a·x**. Pour un produit de coefficient b : **n(t) = b·x**.

## 3. Le tableau d'avancement
On dresse un **tableau d'avancement** : état initial (x = 0), état intermédiaire (x) et état final (x = x_max).

| État | 2 H₂ | O₂ | 2 H₂O |
|---|---|---|---|
| Initial | 4 | 3 | 0 |
| En cours | 4 − 2x | 3 − x | 2x |

## 4. Le réactif limitant
Le **réactif limitant** est celui qui s'épuise le premier ; il **fixe** l'avancement maximal x_max.

*Exemple : avec 4 mol de H₂ et 3 mol de O₂. Pour H₂ : 4 − 2x = 0 → x = 2. Pour O₂ : 3 − x = 0 → x = 3. Le plus petit gagne : **x_max = 2 mol**, le réactif limitant est **H₂**.*

## 5. Le titrage
Un **titrage** sert à déterminer une concentration inconnue. À l'**équivalence**, les réactifs sont introduits dans les **proportions stœchiométriques** : pour une réaction 1 pour 1, **C_A × V_A = C_B × V_B**.

*Exemple : on titre V_A = 10 mL d'acide par une base C_B = 0,10 mol/L ; équivalence à V_B = 12 mL. Alors C_A = (0,10 × 12) ÷ 10 = **0,12 mol/L**.*

## L'essentiel à retenir
- Les **coefficients stœchiométriques** donnent les proportions de la réaction.
- **Avancement** x : n(t) = n₀ − a·x pour un réactif ; b·x pour un produit.
- Le **réactif limitant** impose x_max (plus petite valeur qui annule un réactif).
- Au **titrage**, à l'équivalence les réactifs sont en proportions stœchiométriques (1:1 → C_A·V_A = C_B·V_B).$md$),

    ('Structure des entités chimiques', $md$# Structure des entités chimiques

## Ce que tu vas comprendre
La forme et les propriétés d'une molécule découlent de la façon dont ses électrons se répartissent. Ce chapitre t'apprend à écrire un **schéma de Lewis**, à prévoir la **géométrie**, et à relier **électronégativité**, **polarité** et **cohésion** de la matière.

## 1. Le schéma de Lewis
Le **schéma de Lewis** représente les **doublets liants** (liaisons entre atomes) et les **doublets non liants** (paires d'électrons libres). Les atomes cherchent à respecter la **règle de l'octet** (8 électrons de valence, 2 pour l'hydrogène).

*Exemple : dans H₂O, l'oxygène porte 2 doublets liants (vers les H) et 2 doublets non liants.*

## 2. La géométrie des molécules
Les doublets autour d'un atome central se repoussent et s'écartent au maximum. On en déduit la **géométrie** :
- 2 directions → **linéaire** (CO₂) ;
- 3 directions → **triangulaire** ;
- 4 directions → **tétraédrique** (CH₄).

*L'eau H₂O est **coudée** : les 2 doublets non liants « poussent » les liaisons.*

## 3. L'électronégativité
L'**électronégativité** mesure la tendance d'un atome à **attirer** les électrons d'une liaison. Elle **augmente** de la gauche vers la droite et du bas vers le haut du tableau périodique. Le fluor et l'oxygène sont très électronégatifs.

## 4. La polarité
Si deux atomes liés ont des électronégativités différentes, la liaison est **polarisée** : charges partielles δ⁺ et δ⁻. Une molécule est **polaire** si ses liaisons polarisées **ne se compensent pas**.

*CO₂ est linéaire : les deux liaisons polaires se compensent → molécule **apolaire**. H₂O est coudée : elles ne se compensent pas → molécule **polaire**.*

## 5. La cohésion de la matière
Entre les molécules agissent des **interactions faibles** :
- les **interactions de Van der Waals** (d'autant plus fortes que la molécule est grosse) ;
- les **liaisons hydrogène** (fortes, entre un H lié à O, N ou F et un atome électronégatif voisin).

Ces interactions expliquent les **températures de changement d'état** (l'eau bout haut grâce aux liaisons hydrogène).

## L'essentiel à retenir
- **Lewis** : doublets liants + doublets non liants ; règle de l'octet.
- La **géométrie** vient de la répulsion des doublets (linéaire, tétraédrique, coudée…).
- L'**électronégativité** augmente vers la droite et le haut du tableau.
- Molécule **polaire** si liaisons polaires non compensées ; **cohésion** assurée par Van der Waals et liaisons hydrogène.$md$),

    ('Mouvement et interactions', $md$# Mouvement et interactions

## Ce que tu vas comprendre
Décrire un mouvement, c'est suivre l'évolution de la vitesse, et l'expliquer, c'est relier cette évolution aux **forces**. Ce chapitre introduit les **vecteurs** vitesse et accélération et la **deuxième loi de Newton**.

## 1. Le vecteur vitesse
La **vitesse** d'un point est un **vecteur** : elle a une valeur (en m/s), une direction (la tangente à la trajectoire) et un sens. Sa valeur se calcule par **v = d ÷ Δt** sur un petit intervalle.

## 2. Le vecteur accélération
L'**accélération** décrit **comment la vitesse varie**. C'est aussi un vecteur (en m/s²) : **a = Δv ÷ Δt**. Si le vecteur vitesse change (en valeur OU en direction), l'accélération n'est pas nulle.

## 3. Les forces
Une **force** modélise une action mécanique : elle a une direction, un sens et une valeur (en **newtons, N**). Exemples : le **poids** P = m·g, la réaction du support, les frottements, la tension d'un fil.

*Le poids d'un objet de masse m = 3 kg (avec g = 10 N/kg) vaut P = 3 × 10 = **30 N**.*

## 4. La deuxième loi de Newton
La **deuxième loi de Newton** relie la somme des forces à l'accélération :

**ΣF = m · a**

La **somme des forces** (résultante) et l'**accélération** ont même direction et même sens.

*Exemple : une force résultante de 10 N sur un objet de masse 2 kg donne a = ΣF ÷ m = 10 ÷ 2 = **5 m/s²**.*

## 5. Cas du mouvement rectiligne uniforme
Si la **résultante des forces est nulle**, l'accélération est nulle : le mouvement est **rectiligne uniforme** (vitesse constante) — c'est le **principe d'inertie** (1ʳᵉ loi).

## L'essentiel à retenir
- La **vitesse** est un vecteur tangent à la trajectoire (v = d ÷ Δt).
- L'**accélération** mesure la variation du vecteur vitesse (a = Δv ÷ Δt).
- Une **force** se mesure en newtons ; le poids vaut P = m·g.
- **2ᵉ loi de Newton : ΣF = m·a** ; résultante nulle → mouvement rectiligne uniforme.$md$),

    ('L''énergie mécanique', $md$# L'énergie mécanique

## Ce que tu vas comprendre
L'énergie mécanique regroupe l'énergie liée au **mouvement** et l'énergie liée à la **position**. Ce chapitre t'apprend à les calculer, à comprendre le **travail d'une force** et la **conservation** de l'énergie mécanique.

## 1. L'énergie cinétique
L'**énergie cinétique** est l'énergie du mouvement :

**Ec = ½ · m · v²**  (m en kg, v en m/s, Ec en joules J)

*Exemple : m = 2 kg et v = 3 m/s → Ec = ½ × 2 × 3² = ½ × 2 × 9 = **9 J**.*

## 2. L'énergie potentielle de pesanteur
L'**énergie potentielle de pesanteur** dépend de l'**altitude** :

**Epp = m · g · h**  (h : hauteur au-dessus d'une référence)

*Exemple : m = 1 kg, g = 10 N/kg, h = 5 m → Epp = 1 × 10 × 5 = **50 J**.*

## 3. Le travail d'une force
Le **travail** d'une force constante sur un déplacement d mesure l'énergie transférée :

**W = F · d · cos(α)**  (α : angle entre la force et le déplacement)

- Force dans le sens du mouvement (α = 0) : travail **moteur** (positif).
- Force opposée (α = 180°) : travail **résistant** (négatif).

*Exemple : F = 10 N, d = 4 m, même sens → W = 10 × 4 × cos(0) = **40 J**.*

## 4. L'énergie mécanique
L'**énergie mécanique** est la somme :

**Em = Ec + Epp**

## 5. La conservation de l'énergie mécanique
**En l'absence de frottements**, l'énergie mécanique se **conserve** : Em reste constante. L'énergie potentielle se transforme en énergie cinétique (et inversement).

*Exemple : une balle qui tombe perd de l'Epp mais gagne autant d'Ec ; Em ne change pas.*

S'il y a des **frottements**, une partie de Em est dissipée (chaleur) : Em **diminue**.

## L'essentiel à retenir
- **Énergie cinétique : Ec = ½·m·v²** (en joules).
- **Énergie potentielle : Epp = m·g·h**.
- **Travail : W = F·d·cos(α)** ; moteur si α = 0, résistant si α = 180°.
- **Em = Ec + Epp** ; **conservée** sans frottements, dissipée avec frottements.$md$),

    ('Ondes mécaniques', $md$# Ondes mécaniques

## Ce que tu vas comprendre
Une onde transporte de l'énergie **sans transporter de matière**. Ce chapitre décrit la **célérité**, la **période** et la **longueur d'onde** d'une onde mécanique, avec l'exemple du **son**.

## 1. Qu'est-ce qu'une onde mécanique ?
Une **onde mécanique** est la propagation d'une **perturbation** dans un milieu matériel (eau, corde, air). Le milieu se déforme puis revient à sa position : **la matière ne se déplace pas globalement**, seule l'énergie se propage.

## 2. La célérité
La **célérité** v est la vitesse de propagation de l'onde :

**v = d ÷ Δt**  (d : distance parcourue, Δt : durée)

*Exemple : le son parcourt 680 m en 2 s → v = 680 ÷ 2 = **340 m/s** (célérité du son dans l'air).*

## 3. La période et la fréquence
Pour une onde **périodique**, le motif se répète :
- la **période** T (en s) est la durée d'un motif ;
- la **fréquence** f (en hertz, Hz) est le nombre de motifs par seconde.

**f = 1 ÷ T**

*Exemple : f = 100 Hz → T = 1 ÷ 100 = **0,01 s**.*

## 4. La longueur d'onde
La **longueur d'onde** λ est la distance parcourue par l'onde pendant **une période** :

**λ = v · T = v ÷ f**

*Exemple : un son de fréquence f = 170 Hz dans l'air (v = 340 m/s) : λ = 340 ÷ 170 = **2 m**.*

## 5. Le son
Un **son** est une onde mécanique qui a besoin d'un milieu (il ne se propage **pas dans le vide**). Sa **fréquence** détermine la **hauteur** (grave = basse fréquence, aigu = haute fréquence) ; son **amplitude** détermine le **volume**.

## L'essentiel à retenir
- Une **onde mécanique** transporte de l'énergie **sans déplacer** la matière.
- **Célérité : v = d ÷ Δt** (son dans l'air ≈ 340 m/s).
- **Fréquence : f = 1 ÷ T** (en hertz).
- **Longueur d'onde : λ = v ÷ f = v·T** ; le son ne se propage pas dans le vide.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'physique-chimie'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '1re' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Suivi d''une transformation chimique', $json${
      "centre": "Suivi d'une transformation",
      "branches": [
        { "titre": "Équation et quantités", "enfants": ["Équation ajustée", "Coefficients stœchiométriques", "Proportions de réaction"] },
        { "titre": "Avancement x", "enfants": ["Réactif : n0 − a·x", "Produit : b·x", "Tableau d'avancement"] },
        { "titre": "Réactif limitant", "enfants": ["S'épuise le premier", "Fixe x_max", "Plus petite valeur qui annule"] },
        { "titre": "Titrage", "enfants": ["Trouver une concentration", "Équivalence = proportions stœchio.", "1:1 → C_A·V_A = C_B·V_B"] }
      ]
    }$json$),
    ('Structure des entités chimiques', $json${
      "centre": "Structure des entités",
      "branches": [
        { "titre": "Schéma de Lewis", "enfants": ["Doublets liants", "Doublets non liants", "Règle de l'octet"] },
        { "titre": "Géométrie", "enfants": ["Répulsion des doublets", "Linéaire, tétraédrique", "H2O coudée"] },
        { "titre": "Électronégativité", "enfants": ["Attire les électrons", "Augmente vers la droite/le haut", "F et O très électronégatifs"] },
        { "titre": "Polarité et cohésion", "enfants": ["Liaisons non compensées → polaire", "CO2 apolaire, H2O polaire", "Van der Waals, liaisons hydrogène"] }
      ]
    }$json$),
    ('Mouvement et interactions', $json${
      "centre": "Mouvement et interactions",
      "branches": [
        { "titre": "Vecteur vitesse", "enfants": ["v = d ÷ Δt", "Tangent à la trajectoire", "En m/s"] },
        { "titre": "Vecteur accélération", "enfants": ["a = Δv ÷ Δt", "Variation de la vitesse", "En m/s²"] },
        { "titre": "Forces", "enfants": ["En newtons (N)", "Poids P = m·g", "Direction, sens, valeur"] },
        { "titre": "2ᵉ loi de Newton", "enfants": ["ΣF = m·a", "Résultante et a colinéaires", "ΣF nulle → rectiligne uniforme"] }
      ]
    }$json$),
    ('L''énergie mécanique', $json${
      "centre": "L'énergie mécanique",
      "branches": [
        { "titre": "Énergie cinétique", "enfants": ["Ec = ½·m·v²", "Énergie du mouvement", "En joules (J)"] },
        { "titre": "Énergie potentielle", "enfants": ["Epp = m·g·h", "Liée à l'altitude", "Référence de hauteur"] },
        { "titre": "Travail d'une force", "enfants": ["W = F·d·cos(α)", "Moteur si α = 0", "Résistant si α = 180°"] },
        { "titre": "Énergie mécanique", "enfants": ["Em = Ec + Epp", "Conservée sans frottements", "Dissipée avec frottements"] }
      ]
    }$json$),
    ('Ondes mécaniques', $json${
      "centre": "Ondes mécaniques",
      "branches": [
        { "titre": "Onde mécanique", "enfants": ["Propage une perturbation", "Transporte de l'énergie", "Pas de transport de matière"] },
        { "titre": "Célérité", "enfants": ["v = d ÷ Δt", "Son dans l'air ≈ 340 m/s", "Dépend du milieu"] },
        { "titre": "Période et fréquence", "enfants": ["Période T en s", "Fréquence f = 1 ÷ T", "f en hertz (Hz)"] },
        { "titre": "Longueur d'onde et son", "enfants": ["λ = v ÷ f = v·T", "Grave/aigu = fréquence", "Le son ne va pas dans le vide"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'physique-chimie'
 WHERE c.subject_id = s.id AND c.level = '1re' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (Ne fait rien si un quiz existe déjà — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Physique-Chimie', '1re', v.chapter, true, l.id
FROM (VALUES
  ('13419999-0000-4000-8000-000000000001'::uuid, 'Suivi d''une transformation chimique'),
  ('13419999-0000-4000-8000-000000000002'::uuid, 'Structure des entités chimiques'),
  ('13419999-0000-4000-8000-000000000003'::uuid, 'Mouvement et interactions'),
  ('13419999-0000-4000-8000-000000000004'::uuid, 'L''énergie mécanique'),
  ('13419999-0000-4000-8000-000000000005'::uuid, 'Ondes mécaniques')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'physique-chimie'
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
  -- Chapitre 1 — Suivi d'une transformation chimique
  ('13410000-0000-4000-8000-000000000104'::uuid, 'Suivi d''une transformation chimique',
   'Que représente l''avancement x d''une transformation ?', 'mcq',
   '["Combien de fois la réaction a eu lieu (en mol)", "La masse des produits", "Le volume de gaz formé", "La température de la réaction"]', 0,
   'L''avancement x (en mol) mesure le degré d''avancement : n(t) = n0 − a·x pour un réactif.', 4),
  ('13410000-0000-4000-8000-000000000105'::uuid, 'Suivi d''une transformation chimique',
   'Le réactif limitant est celui qui s''épuise le premier.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le réactif limitant s''épuise le premier et fixe l''avancement maximal x_max.', 5),
  ('13410000-0000-4000-8000-000000000106'::uuid, 'Suivi d''une transformation chimique',
   'Pour 2 H₂ + O₂ → 2 H₂O avec 4 mol de H₂ et 3 mol de O₂, quel est x_max ?', 'mcq',
   '["2 mol", "3 mol", "4 mol", "7 mol"]', 0,
   'H₂ : 4 − 2x = 0 → x = 2 ; O₂ : 3 − x = 0 → x = 3. On garde le plus petit : x_max = 2 mol.', 6),
  ('13410000-0000-4000-8000-000000000107'::uuid, 'Suivi d''une transformation chimique',
   'Dans la réaction précédente, quel est le réactif limitant ?', 'mcq',
   '["H₂", "O₂", "H₂O", "Aucun"]', 0,
   'C''est H₂ qui impose le plus petit avancement (x = 2), donc H₂ est le réactif limitant.', 7),
  ('13410000-0000-4000-8000-000000000108'::uuid, 'Suivi d''une transformation chimique',
   'À l''équivalence d''un titrage, les réactifs sont introduits dans les proportions stœchiométriques.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'À l''équivalence, réactifs titrant et titré ont réagi dans les proportions de l''équation.', 8),
  ('13410000-0000-4000-8000-000000000109'::uuid, 'Suivi d''une transformation chimique',
   'On titre 10 mL d''acide par une base à 0,10 mol/L (réaction 1:1). Équivalence à 12 mL. Quelle est C_A ?', 'mcq',
   '["0,12 mol/L", "0,10 mol/L", "1,2 mol/L", "0,08 mol/L"]', 0,
   'C_A × V_A = C_B × V_B → C_A = (0,10 × 12) ÷ 10 = 0,12 mol/L.', 9),
  ('13410000-0000-4000-8000-000000000110'::uuid, 'Suivi d''une transformation chimique',
   'Dans un tableau d''avancement, la ligne « état initial » correspond à x = 0.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'À l''état initial la réaction n''a pas commencé : x = 0.', 10),

  -- Chapitre 2 — Structure des entités chimiques
  ('13410000-0000-4000-8000-000000000204'::uuid, 'Structure des entités chimiques',
   'Dans un schéma de Lewis, que représente un doublet non liant ?', 'mcq',
   '["Une paire d''électrons non engagée dans une liaison", "Une liaison double", "Un proton isolé", "Un atome central"]', 0,
   'Un doublet non liant est une paire d''électrons de valence qui ne participe pas à une liaison.', 4),
  ('13410000-0000-4000-8000-000000000205'::uuid, 'Structure des entités chimiques',
   'Quelle est la géométrie de la molécule d''eau H₂O ?', 'mcq',
   '["Coudée", "Linéaire", "Tétraédrique régulière", "Triangulaire plane"]', 0,
   'Les 2 doublets non liants de l''oxygène « poussent » les liaisons : la molécule est coudée.', 5),
  ('13410000-0000-4000-8000-000000000206'::uuid, 'Structure des entités chimiques',
   'L''électronégativité augmente de la gauche vers la droite d''une période du tableau.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Elle augmente vers la droite et vers le haut ; F et O sont parmi les plus électronégatifs.', 6),
  ('13410000-0000-4000-8000-000000000207'::uuid, 'Structure des entités chimiques',
   'Pourquoi la molécule de CO₂ est-elle apolaire malgré ses liaisons polaires ?', 'mcq',
   '["Elle est linéaire : les liaisons polaires se compensent", "Le carbone n''est pas électronégatif", "Elle n''a pas de doublet", "Elle est coudée"]', 0,
   'CO₂ est linéaire et symétrique : les deux liaisons polarisées se compensent → molécule apolaire.', 7),
  ('13410000-0000-4000-8000-000000000208'::uuid, 'Structure des entités chimiques',
   'Combien d''électrons de valence la règle de l''octet vise-t-elle pour un atome (hors hydrogène) ?', 'mcq',
   '["8", "2", "4", "10"]', 0,
   'La règle de l''octet vise 8 électrons de valence (2 pour l''hydrogène : règle du duet).', 8),
  ('13410000-0000-4000-8000-000000000209'::uuid, 'Structure des entités chimiques',
   'Les liaisons hydrogène expliquent en partie la cohésion de l''eau liquide.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les liaisons hydrogène (entre H lié à O et un O voisin) assurent une forte cohésion de l''eau.', 9),
  ('13410000-0000-4000-8000-000000000210'::uuid, 'Structure des entités chimiques',
   'Une molécule est polaire lorsque :', 'mcq',
   '["Ses liaisons polarisées ne se compensent pas", "Elle est toujours linéaire", "Elle ne contient que des atomes identiques", "Elle n''a aucun doublet non liant"]', 0,
   'Une molécule est polaire si les moments de ses liaisons polaires ne se compensent pas.', 10),

  -- Chapitre 3 — Mouvement et interactions
  ('13410000-0000-4000-8000-000000000304'::uuid, 'Mouvement et interactions',
   'Dans quelle unité s''exprime une force ?', 'mcq',
   '["Le newton (N)", "Le joule (J)", "Le mètre par seconde (m/s)", "Le watt (W)"]', 0,
   'Une force se mesure en newtons (N).', 4),
  ('13410000-0000-4000-8000-000000000305'::uuid, 'Mouvement et interactions',
   'Quelle est l''expression de la deuxième loi de Newton ?', 'mcq',
   '["ΣF = m·a", "ΣF = m ÷ a", "ΣF = ½·m·v²", "ΣF = m·g·h"]', 0,
   'La deuxième loi de Newton s''écrit : somme des forces = masse × accélération (ΣF = m·a).', 5),
  ('13410000-0000-4000-8000-000000000306'::uuid, 'Mouvement et interactions',
   'Une force résultante de 10 N agit sur un objet de masse 2 kg. Quelle est l''accélération ?', 'mcq',
   '["5 m/s²", "20 m/s²", "0,2 m/s²", "12 m/s²"]', 0,
   'a = ΣF ÷ m = 10 ÷ 2 = 5 m/s².', 6),
  ('13410000-0000-4000-8000-000000000307'::uuid, 'Mouvement et interactions',
   'Le poids d''un objet de masse 3 kg (g = 10 N/kg) vaut :', 'mcq',
   '["30 N", "3 N", "0,3 N", "13 N"]', 0,
   'P = m·g = 3 × 10 = 30 N.', 7),
  ('13410000-0000-4000-8000-000000000308'::uuid, 'Mouvement et interactions',
   'Le vecteur vitesse est toujours tangent à la trajectoire.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le vecteur vitesse est porté par la tangente à la trajectoire au point considéré.', 8),
  ('13410000-0000-4000-8000-000000000309'::uuid, 'Mouvement et interactions',
   'Si la résultante des forces est nulle, le mouvement est :', 'mcq',
   '["Rectiligne uniforme", "Accéléré", "Circulaire", "Impossible"]', 0,
   'Résultante nulle → accélération nulle → mouvement rectiligne uniforme (principe d''inertie).', 9),
  ('13410000-0000-4000-8000-000000000310'::uuid, 'Mouvement et interactions',
   'L''accélération peut être non nulle même si la valeur de la vitesse est constante.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : si la direction du vecteur vitesse change (virage), l''accélération n''est pas nulle.', 10),

  -- Chapitre 4 — L'énergie mécanique
  ('13410000-0000-4000-8000-000000000404'::uuid, 'L''énergie mécanique',
   'Quelle est l''expression de l''énergie cinétique ?', 'mcq',
   '["Ec = ½·m·v²", "Ec = m·g·h", "Ec = m·v", "Ec = F·d"]', 0,
   'L''énergie cinétique vaut Ec = ½·m·v² (en joules).', 4),
  ('13410000-0000-4000-8000-000000000405'::uuid, 'L''énergie mécanique',
   'Un objet de masse 2 kg se déplace à 3 m/s. Quelle est son énergie cinétique ?', 'mcq',
   '["9 J", "6 J", "18 J", "3 J"]', 0,
   'Ec = ½ × 2 × 3² = ½ × 2 × 9 = 9 J.', 5),
  ('13410000-0000-4000-8000-000000000406'::uuid, 'L''énergie mécanique',
   'L''énergie potentielle de pesanteur d''un objet (m = 1 kg, h = 5 m, g = 10 N/kg) vaut :', 'mcq',
   '["50 J", "15 J", "5 J", "0,5 J"]', 0,
   'Epp = m·g·h = 1 × 10 × 5 = 50 J.', 6),
  ('13410000-0000-4000-8000-000000000407'::uuid, 'L''énergie mécanique',
   'Quelle est l''expression du travail d''une force constante ?', 'mcq',
   '["W = F·d·cos(α)", "W = ½·m·v²", "W = m·g·h", "W = F ÷ d"]', 0,
   'Le travail d''une force constante vaut W = F·d·cos(α), avec α l''angle force/déplacement.', 7),
  ('13410000-0000-4000-8000-000000000408'::uuid, 'L''énergie mécanique',
   'Une force de 10 N tire un objet de 4 m dans le sens du déplacement. Quel est son travail ?', 'mcq',
   '["40 J", "2,5 J", "14 J", "0 J"]', 0,
   'W = F·d·cos(0) = 10 × 4 × 1 = 40 J (travail moteur).', 8),
  ('13410000-0000-4000-8000-000000000409'::uuid, 'L''énergie mécanique',
   'En l''absence de frottements, l''énergie mécanique se conserve.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Sans frottements, Em = Ec + Epp reste constante : l''Epp se transforme en Ec et inversement.', 9),
  ('13410000-0000-4000-8000-000000000410'::uuid, 'L''énergie mécanique',
   'Un travail est dit résistant lorsque la force :', 'mcq',
   '["S''oppose au déplacement (α = 180°)", "Est dans le sens du déplacement", "Est perpendiculaire au déplacement", "Est nulle"]', 0,
   'Un travail résistant (négatif) correspond à une force opposée au déplacement (α = 180°).', 10),

  -- Chapitre 5 — Ondes mécaniques
  ('13410000-0000-4000-8000-000000000504'::uuid, 'Ondes mécaniques',
   'Que transporte une onde mécanique ?', 'mcq',
   '["De l''énergie, sans transport de matière", "De la matière uniquement", "Des électrons", "De la chaleur uniquement"]', 0,
   'Une onde mécanique propage une perturbation et transporte de l''énergie sans déplacer la matière.', 4),
  ('13410000-0000-4000-8000-000000000505'::uuid, 'Ondes mécaniques',
   'Le son parcourt 680 m en 2 s. Quelle est sa célérité ?', 'mcq',
   '["340 m/s", "1360 m/s", "170 m/s", "680 m/s"]', 0,
   'v = d ÷ Δt = 680 ÷ 2 = 340 m/s (célérité du son dans l''air).', 5),
  ('13410000-0000-4000-8000-000000000506'::uuid, 'Ondes mécaniques',
   'Quelle relation lie la fréquence f et la période T ?', 'mcq',
   '["f = 1 ÷ T", "f = T", "f = T²", "f = 2·T"]', 0,
   'La fréquence est l''inverse de la période : f = 1 ÷ T (en hertz).', 6),
  ('13410000-0000-4000-8000-000000000507'::uuid, 'Ondes mécaniques',
   'Une onde de période T = 0,01 s a une fréquence de :', 'mcq',
   '["100 Hz", "0,01 Hz", "10 Hz", "1000 Hz"]', 0,
   'f = 1 ÷ T = 1 ÷ 0,01 = 100 Hz.', 7),
  ('13410000-0000-4000-8000-000000000508'::uuid, 'Ondes mécaniques',
   'Un son de 170 Hz se propage dans l''air (v = 340 m/s). Quelle est sa longueur d''onde ?', 'mcq',
   '["2 m", "0,5 m", "510 m", "170 m"]', 0,
   'λ = v ÷ f = 340 ÷ 170 = 2 m.', 8),
  ('13410000-0000-4000-8000-000000000509'::uuid, 'Ondes mécaniques',
   'Le son peut se propager dans le vide.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : le son est une onde mécanique, il a besoin d''un milieu matériel et ne se propage pas dans le vide.', 9),
  ('13410000-0000-4000-8000-000000000510'::uuid, 'Ondes mécaniques',
   'Un son aigu correspond à une fréquence élevée.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La hauteur d''un son dépend de sa fréquence : aigu = fréquence élevée, grave = fréquence basse.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'physique-chimie'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '1re' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
