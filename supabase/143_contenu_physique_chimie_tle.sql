-- =============================================================================
-- Studuel — Migration 143 : CONTENU Physique-Chimie Tle (+ exercices type bac)
-- Remplit les 5 chapitres de Physique-Chimie Tle (spécialité, programme BO) :
--   1. Cours          → lessons.content de « L'essentiel du cours » (position 1)
--   2. Carte mentale  → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz           → complète le quiz de la leçon (positions 4→10, jointure
--                       leçon→quiz robuste à l'id existant ; filet si absent)
--   4. Exercices type bac → lessons.content de « Exercices types » (position 2) :
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
-- 1. COURS — lessons.content de « L'essentiel du cours » (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Cinétique chimique', $md$# Cinétique chimique

## Ce que tu vas comprendre
La cinétique chimique étudie la **vitesse** des réactions : pourquoi certaines sont quasi instantanées (une explosion) et d'autres très lentes (la rouille). Ce chapitre te donne les outils pour mesurer et modifier cette vitesse.

## 1. La vitesse de réaction
La **vitesse volumique** de disparition d'un réactif (ou d'apparition d'un produit) mesure la variation de sa concentration par unité de temps. Elle est **grande au début**, puis diminue à mesure que les réactifs s'épuisent, et **s'annule** à la fin.

*On la suit expérimentalement par une grandeur mesurable : absorbance, conductivité, pression ou volume de gaz…*

## 2. Les facteurs cinétiques
Un **facteur cinétique** est un paramètre qui modifie la vitesse d'une réaction :
- la **température** : plus elle est élevée, plus la réaction est rapide (les molécules s'agitent et se rencontrent plus souvent) ;
- la **concentration** des réactifs : plus elle est grande, plus les chocs efficaces sont fréquents, plus la réaction est rapide.

*C'est pourquoi on conserve les aliments au **froid** : on ralentit les réactions de dégradation.*

## 3. La catalyse
Un **catalyseur** accélère une réaction sans être consommé : on le retrouve intact à la fin. Il ne change pas l'état final, seulement la **durée** pour l'atteindre.
- catalyse **homogène** : catalyseur et réactifs dans la même phase ;
- catalyse **hétérogène** : phases différentes (ex. le pot catalytique d'une voiture) ;
- catalyse **enzymatique** : le catalyseur est une **enzyme** (biologique).

## 4. Le temps de demi-réaction
Le **temps de demi-réaction** t½ est la durée au bout de laquelle **la moitié** du réactif limitant a été consommée (l'avancement atteint la moitié de sa valeur finale).

*Il sert à comparer des réactions et à estimer la durée totale : une réaction est souvent quasi terminée au bout de quelques t½.*

## 5. Suivi temporel et modélisation
On trace la courbe de la concentration en fonction du temps. La **vitesse** à un instant se lit sur la **pente de la tangente** à cette courbe. La pente diminue au fil du temps : la réaction **ralentit**.

## L'essentiel à retenir
- La **vitesse** d'une réaction diminue au cours du temps et s'annule à la fin.
- **Facteurs cinétiques** : température et concentration (les augmenter accélère la réaction).
- Un **catalyseur** accélère sans être consommé ni changer l'état final.
- **t½** = durée pour consommer la moitié du réactif limitant.$md$),

    ('Acides et bases', $md$# Acides et bases

## Ce que tu vas comprendre
Ce chapitre relie l'acidité d'une solution à sa concentration en ions H₃O⁺, à travers le pH, les couples acide/base et les constantes d'acidité Ka. C'est un pilier de la chimie des solutions.

## 1. Le pH d'une solution
Le **pH** mesure l'acidité d'une solution aqueuse. Il est lié à la concentration en ions oxonium H₃O⁺ par :

**pH = −log [H₃O⁺]**   et   **[H₃O⁺] = 10^(−pH)**

- pH < 7 : solution **acide** ; pH = 7 : **neutre** ; pH > 7 : **basique** (à 25 °C).

*Exemple : si [H₃O⁺] = 10⁻³ mol/L, alors pH = 3.*

## 2. Couple acide / base
Un **acide** cède un proton H⁺ ; une **base** capte un proton. À chaque acide correspond sa **base conjuguée** : c'est un **couple acide/base**, noté AH / A⁻.

*Exemple : le couple acide éthanoïque / ion éthanoate : CH₃COOH / CH₃COO⁻.*

## 3. Constante d'acidité Ka et pKa
Pour la réaction d'un acide avec l'eau, on définit la **constante d'acidité** Ka, et le **pKa = −log Ka**.
- Plus le pKa est **petit**, plus l'acide est **fort**.
- On situe l'acide et sa base conjuguée grâce à la relation : **pH = pKa + log([A⁻]/[AH])**.

Quand [A⁻] = [AH], on a alors **pH = pKa**.

## 4. Le titrage acido-basique
Un **titrage** permet de déterminer une concentration inconnue. À l'**équivalence**, les réactifs sont introduits dans les **proportions stœchiométriques** :

**C_A × V_A = C_B × V_B** (pour un titrage à un proton, mole à mole).

L'équivalence se repère par un **saut de pH** (ou par le virage d'un indicateur coloré).

## 5. Les solutions tampons
Une **solution tampon** contient un acide et sa base conjuguée en quantités comparables. Son pH varie **très peu** quand on ajoute un peu d'acide, un peu de base, ou quand on dilue modérément. Le sang est tamponné autour de pH = 7,4.

## L'essentiel à retenir
- **pH = −log [H₃O⁺]** ; acide si pH < 7, basique si pH > 7 (à 25 °C).
- Un **couple acide/base** AH/A⁻ : l'acide cède H⁺, la base le capte.
- **pKa = −log Ka** : plus il est petit, plus l'acide est fort ; pH = pKa quand [A⁻] = [AH].
- À l'**équivalence** d'un titrage : C_A × V_A = C_B × V_B.$md$),

    ('Mécanique : lois de Newton', $md$# Mécanique : lois de Newton

## Ce que tu vas comprendre
Les lois de Newton relient les **forces** appliquées à un objet à son **mouvement**. Elles permettent de prévoir la trajectoire d'une balle, d'une voiture ou d'un satellite.

## 1. Vitesse et accélération
Le **vecteur vitesse** décrit la rapidité et la direction du mouvement. L'**accélération** mesure la variation du vecteur vitesse : elle est non nulle dès que la vitesse **change de valeur ou de direction**.

## 2. La première loi (principe d'inertie)
Dans un **référentiel galiléen**, si les forces se **compensent** (leur somme est nulle), le centre de masse est soit **immobile**, soit en **mouvement rectiligne uniforme** (vitesse constante). Réciproquement, un mouvement non uniforme trahit des forces non compensées.

## 3. La deuxième loi de Newton
La somme des forces extérieures est égale au produit de la masse par l'accélération :

**ΣF = m × a**

- ΣF en newtons (N), m en kilogrammes (kg), a en m/s².
- L'accélération a la **même direction et le même sens** que la force résultante.

*Exemple : une force résultante de 10 N sur un objet de 2 kg donne a = 10 ÷ 2 = 5 m/s².*

## 4. La chute libre
En **chute libre**, un objet n'est soumis qu'à son **poids**. La 2ᵉ loi donne alors a = g (≈ 9,8 m/s²) : l'accélération **ne dépend pas de la masse**. Tous les corps tombent de la même façon dans le vide.

## 5. Projectiles et satellites
- Un **projectile** (sans frottement) suit une trajectoire **parabolique** : mouvement horizontal uniforme combiné à une chute verticale.
- Un **satellite** en orbite circulaire n'est soumis qu'à la force de **gravitation**, qui joue le rôle de force **centripète** et le maintient sur son orbite.

## L'essentiel à retenir
- **1ʳᵉ loi** : forces compensées ⇔ immobile ou rectiligne uniforme (référentiel galiléen).
- **2ᵉ loi** : **ΣF = m·a** ; l'accélération a le sens de la force résultante.
- **Chute libre** : a = g, indépendante de la masse.
- Un **satellite** est maintenu par la gravitation (force centripète) ; un projectile décrit une parabole.$md$),

    ('Ondes lumineuses : diffraction', $md$# Ondes lumineuses : diffraction

## Ce que tu vas comprendre
La lumière est une **onde**. Ce chapitre montre comment elle se **diffracte** en passant par une fente étroite et comment des ondes peuvent **interférer** — deux phénomènes qui prouvent sa nature ondulatoire.

## 1. Longueur d'onde et fréquence
Une onde périodique est caractérisée par sa **longueur d'onde** λ (en mètres) et sa **fréquence** f. Elles sont reliées à la célérité c par :

**λ = c / f**   (dans le vide, c ≈ 3,0 × 10⁸ m/s)

*La lumière visible a une longueur d'onde comprise entre environ 400 nm (violet) et 800 nm (rouge).*

## 2. Le phénomène de diffraction
Quand une onde rencontre une **ouverture** (ou un obstacle) de taille comparable à sa longueur d'onde, elle **s'étale** : c'est la **diffraction**. Elle est d'autant plus marquée que la fente est **étroite**.

## 3. La figure de diffraction
Avec un laser et une fente de largeur a, on observe sur un écran une **tache centrale** large, entourée de taches secondaires. La **demi-largeur angulaire** θ de la tache centrale vaut :

**θ = λ / a**   (θ en radians)

*Plus la fente est fine (a petit), plus la tache centrale est large (θ grand).*

## 4. Les interférences
Quand deux ondes de même fréquence se superposent, elles **interfèrent** :
- **constructives** (franges brillantes) là où elles s'ajoutent ;
- **destructives** (franges sombres) là où elles s'annulent.

Le dispositif des **fentes de Young** produit des franges régulières : c'est une preuve du caractère ondulatoire de la lumière.

## 5. Mesurer une longueur d'onde
En mesurant la largeur de la tache de diffraction (ou l'interfrange), on peut **remonter à λ**. La diffraction est ainsi un moyen expérimental de mesurer la longueur d'onde d'un laser.

## L'essentiel à retenir
- **λ = c / f** ; la lumière visible : 400 nm (violet) à 800 nm (rouge).
- La **diffraction** étale l'onde à travers une fente étroite (taille proche de λ).
- Demi-largeur angulaire de la tache centrale : **θ = λ / a** (en radians).
- Les **interférences** (fentes de Young) prouvent la nature ondulatoire de la lumière.$md$),

    ('Énergie et thermodynamique', $md$# Énergie et thermodynamique

## Ce que tu vas comprendre
Ce chapitre décrit comment l'**énergie** se transfère et se conserve : transferts thermiques, premier principe, et rendement d'une transformation. C'est la physique des moteurs et du chauffage.

## 1. Les transferts thermiques
La chaleur se transmet spontanément du corps **chaud** vers le corps **froid**, selon trois modes :
- **conduction** : de proche en proche dans un solide ;
- **convection** : par déplacement d'un fluide (air, eau) ;
- **rayonnement** : par ondes, sans support matériel (comme la chaleur du Soleil).

## 2. Énergie interne et température
L'**énergie interne** U d'un système est l'énergie stockée à l'échelle microscopique (agitation des particules). Pour un corps de masse m et de capacité thermique massique c, une variation de température ΔT correspond au transfert thermique :

**Q = m × c × ΔT**

*Exemple : chauffer 2 kg d'eau (c = 4180 J/(kg·K)) de 20 °C à 30 °C : Q = 2 × 4180 × 10 = 83 600 J.*

## 3. Le premier principe de la thermodynamique
Le **premier principe** exprime la **conservation de l'énergie** : la variation d'énergie interne d'un système est égale à la somme des énergies reçues, sous forme de **travail** W et de **chaleur** Q :

**ΔU = W + Q**

L'énergie ne se crée pas et ne disparaît pas : elle se **transfère** ou se **convertit**.

## 4. Le rendement
Le **rendement** η compare l'énergie **utile** à l'énergie **consommée** :

**η = énergie utile / énergie consommée**   (compris entre 0 et 1, souvent exprimé en %)

Il est **toujours inférieur à 1** : une partie de l'énergie est dissipée, surtout en chaleur par frottements.

*Exemple : un moteur reçoit 1000 J et fournit 300 J utiles → η = 300 ÷ 1000 = 0,30 = 30 %.*

## 5. Dégradation de l'énergie
Les transferts s'accompagnent d'une **dégradation** : l'énergie se disperse en chaleur peu récupérable. C'est pourquoi le rendement d'un dispositif réel n'atteint **jamais 100 %**.

## L'essentiel à retenir
- Trois **transferts thermiques** : conduction, convection, rayonnement (du chaud vers le froid).
- Chaleur sensible : **Q = m·c·ΔT**.
- **Premier principe** : **ΔU = W + Q** (l'énergie se conserve).
- **Rendement** η = utile / consommée, toujours < 1 (pertes en chaleur).$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'physique-chimie'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Cinétique chimique', $json${
      "centre": "Cinétique chimique",
      "branches": [
        { "titre": "Vitesse de réaction", "enfants": ["Variation de concentration / temps", "Grande au début, nulle à la fin", "Suivie par absorbance, pression…"] },
        { "titre": "Facteurs cinétiques", "enfants": ["Température (plus chaud = plus rapide)", "Concentration des réactifs", "Le froid ralentit"] },
        { "titre": "Catalyse", "enfants": ["Accélère sans être consommé", "Ne change pas l'état final", "Homogène, hétérogène, enzymatique"] },
        { "titre": "Temps de demi-réaction", "enfants": ["t½ : moitié du réactif consommée", "Compare deux réactions", "Pente de la tangente = vitesse"] }
      ]
    }$json$),
    ('Acides et bases', $json${
      "centre": "Acides et bases",
      "branches": [
        { "titre": "Le pH", "enfants": ["pH = −log [H₃O⁺]", "[H₃O⁺] = 10^(−pH)", "acide <7, neutre 7, basique >7"] },
        { "titre": "Couple acide/base", "enfants": ["Acide cède H⁺", "Base capte H⁺", "AH / A⁻ (ex. CH₃COOH/CH₃COO⁻)"] },
        { "titre": "Ka et pKa", "enfants": ["pKa = −log Ka", "pKa petit = acide fort", "pH = pKa quand [A⁻]=[AH]"] },
        { "titre": "Titrage et tampon", "enfants": ["Équivalence : C_A V_A = C_B V_B", "Saut de pH / indicateur", "Tampon : pH quasi stable"] }
      ]
    }$json$),
    ('Mécanique : lois de Newton', $json${
      "centre": "Lois de Newton",
      "branches": [
        { "titre": "Vitesse et accélération", "enfants": ["Vecteur vitesse : valeur + direction", "Accélération = variation de vitesse", "Non nulle si la direction change"] },
        { "titre": "1ʳᵉ loi (inertie)", "enfants": ["Référentiel galiléen", "Forces compensées", "Immobile ou rectiligne uniforme"] },
        { "titre": "2ᵉ loi", "enfants": ["ΣF = m × a", "a dans le sens de la force", "10 N sur 2 kg → a = 5 m/s²"] },
        { "titre": "Chute et satellites", "enfants": ["Chute libre : a = g", "Indépendant de la masse", "Projectile parabole, satellite gravitation"] }
      ]
    }$json$),
    ('Ondes lumineuses : diffraction', $json${
      "centre": "Ondes lumineuses",
      "branches": [
        { "titre": "Longueur d'onde", "enfants": ["λ = c / f", "c ≈ 3,0 × 10⁸ m/s", "Visible : 400 à 800 nm"] },
        { "titre": "Diffraction", "enfants": ["Onde étalée par une fente", "Marquée si fente étroite", "Taille de fente proche de λ"] },
        { "titre": "Figure de diffraction", "enfants": ["Tache centrale large", "θ = λ / a (radians)", "Fente fine → tache large"] },
        { "titre": "Interférences", "enfants": ["Constructives : franges brillantes", "Destructives : franges sombres", "Fentes de Young"] }
      ]
    }$json$),
    ('Énergie et thermodynamique', $json${
      "centre": "Énergie et thermodynamique",
      "branches": [
        { "titre": "Transferts thermiques", "enfants": ["Conduction (solide)", "Convection (fluide)", "Rayonnement (sans support)"] },
        { "titre": "Chaleur sensible", "enfants": ["Q = m × c × ΔT", "Du chaud vers le froid", "Énergie interne = agitation"] },
        { "titre": "Premier principe", "enfants": ["ΔU = W + Q", "Conservation de l'énergie", "Ni créée ni détruite"] },
        { "titre": "Rendement", "enfants": ["η = utile / consommée", "Toujours < 1", "Pertes en chaleur (dégradation)"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'physique-chimie'
 WHERE c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds de contenu ont déjà créé les quiz PC Tle ; ce
--     bloc ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Physique-Chimie', 'Tle', v.chapter, true, l.id
FROM (VALUES
  ('14319999-0000-4000-8000-000000000001'::uuid, 'Cinétique chimique'),
  ('14319999-0000-4000-8000-000000000002'::uuid, 'Acides et bases'),
  ('14319999-0000-4000-8000-000000000003'::uuid, 'Mécanique : lois de Newton'),
  ('14319999-0000-4000-8000-000000000004'::uuid, 'Ondes lumineuses : diffraction'),
  ('14319999-0000-4000-8000-000000000005'::uuid, 'Énergie et thermodynamique')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'physique-chimie'
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
  -- Chapitre 1 — Cinétique chimique
  ('14310000-0000-4000-8000-000000000104'::uuid, 'Cinétique chimique',
   'Au cours du temps, la vitesse d''une réaction chimique : ', 'mcq',
   '["diminue puis s''annule", "augmente sans cesse", "reste constante", "est toujours nulle"]', 0,
   'La vitesse est grande au début, puis diminue à mesure que les réactifs s''épuisent, et s''annule à la fin.', 4),
  ('14310000-0000-4000-8000-000000000105'::uuid, 'Cinétique chimique',
   'Lequel de ces paramètres est un facteur cinétique ?', 'mcq',
   '["La température", "La couleur du récipient", "Le nom de l''espèce", "La forme du bécher"]', 0,
   'La température est un facteur cinétique : l''augmenter accélère la réaction.', 5),
  ('14310000-0000-4000-8000-000000000106'::uuid, 'Cinétique chimique',
   'Augmenter la température accélère en général une réaction chimique.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Une température plus élevée agite davantage les molécules et rend les chocs plus fréquents : la réaction est plus rapide.', 6),
  ('14310000-0000-4000-8000-000000000107'::uuid, 'Cinétique chimique',
   'Un catalyseur : ', 'mcq',
   '["accélère la réaction sans être consommé", "est entièrement consommé", "modifie l''état final", "ralentit la réaction"]', 0,
   'Un catalyseur accélère la réaction sans être consommé ni modifier l''état final ; on le retrouve intact.', 7),
  ('14310000-0000-4000-8000-000000000108'::uuid, 'Cinétique chimique',
   'Le temps de demi-réaction t½ correspond à : ', 'mcq',
   '["la durée pour consommer la moitié du réactif limitant", "la fin complète de la réaction", "le double de la durée totale", "le temps pour tout consommer"]', 0,
   't½ est la durée au bout de laquelle la moitié du réactif limitant est consommée.', 8),
  ('14310000-0000-4000-8000-000000000109'::uuid, 'Cinétique chimique',
   'Conserver un aliment au froid ralentit les réactions de dégradation.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Le froid abaisse la température, un facteur cinétique : les réactions de dégradation ralentissent.', 9),
  ('14310000-0000-4000-8000-000000000110'::uuid, 'Cinétique chimique',
   'La vitesse de réaction à un instant donné se lit sur : ', 'mcq',
   '["la pente de la tangente à la courbe C(t)", "l''ordonnée à l''origine", "l''aire sous la courbe", "la valeur finale de C"]', 0,
   'La vitesse instantanée est la pente de la tangente à la courbe concentration = f(temps).', 10),

  -- Chapitre 2 — Acides et bases
  ('14310000-0000-4000-8000-000000000204'::uuid, 'Acides et bases',
   'La relation entre le pH et la concentration en ions oxonium est : ', 'mcq',
   '["pH = −log [H₃O⁺]", "pH = log [H₃O⁺]", "pH = [H₃O⁺]", "pH = 10^[H₃O⁺]"]', 0,
   'Le pH est défini par pH = −log [H₃O⁺].', 4),
  ('14310000-0000-4000-8000-000000000205'::uuid, 'Acides et bases',
   'Si [H₃O⁺] = 10⁻³ mol/L, quel est le pH de la solution ?', 'mcq',
   '["3", "−3", "10", "0,001"]', 0,
   'pH = −log(10⁻³) = 3.', 5),
  ('14310000-0000-4000-8000-000000000206'::uuid, 'Acides et bases',
   'À 25 °C, une solution de pH = 9 est basique.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'À 25 °C, un pH supérieur à 7 correspond à une solution basique.', 6),
  ('14310000-0000-4000-8000-000000000207'::uuid, 'Acides et bases',
   'Dans un couple acide/base, l''acide est l''espèce qui : ', 'mcq',
   '["cède un proton H⁺", "capte un proton H⁺", "ne réagit jamais", "est toujours solide"]', 0,
   'L''acide cède un proton H⁺ ; la base conjuguée le capte.', 7),
  ('14310000-0000-4000-8000-000000000208'::uuid, 'Acides et bases',
   'Quand [A⁻] = [AH], que vaut le pH de la solution ?', 'mcq',
   '["pH = pKa", "pH = 7", "pH = 0", "pH = Ka"]', 0,
   'Dans la relation pH = pKa + log([A⁻]/[AH]), si [A⁻] = [AH] alors log(1) = 0, donc pH = pKa.', 8),
  ('14310000-0000-4000-8000-000000000209'::uuid, 'Acides et bases',
   'Plus le pKa d''un acide est petit, plus cet acide est fort.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Un pKa petit correspond à une constante Ka grande, donc à un acide fort.', 9),
  ('14310000-0000-4000-8000-000000000210'::uuid, 'Acides et bases',
   'À l''équivalence d''un titrage acide/base à un proton, on a : ', 'mcq',
   '["C_A × V_A = C_B × V_B", "C_A = C_B", "V_A = V_B", "C_A × V_B = C_B × V_A"]', 0,
   'À l''équivalence, les réactifs sont dans les proportions stœchiométriques : C_A × V_A = C_B × V_B.', 10),

  -- Chapitre 3 — Mécanique : lois de Newton
  ('14310000-0000-4000-8000-000000000304'::uuid, 'Mécanique : lois de Newton',
   'La deuxième loi de Newton s''écrit : ', 'mcq',
   '["ΣF = m × a", "ΣF = m / a", "ΣF = a / m", "ΣF = m + a"]', 0,
   'La deuxième loi relie la somme des forces à l''accélération : ΣF = m × a.', 4),
  ('14310000-0000-4000-8000-000000000305'::uuid, 'Mécanique : lois de Newton',
   'Une force résultante de 10 N s''exerce sur un objet de 2 kg. Quelle est son accélération ?', 'mcq',
   '["5 m/s²", "20 m/s²", "8 m/s²", "0,2 m/s²"]', 0,
   'a = ΣF / m = 10 / 2 = 5 m/s².', 5),
  ('14310000-0000-4000-8000-000000000306'::uuid, 'Mécanique : lois de Newton',
   'En chute libre sans frottement, l''accélération dépend de la masse de l''objet.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : en chute libre, a = g ne dépend pas de la masse (elle se simplifie dans m·a = m·g).', 6),
  ('14310000-0000-4000-8000-000000000307'::uuid, 'Mécanique : lois de Newton',
   'D''après le principe d''inertie, si les forces se compensent, le mouvement du centre de masse est : ', 'mcq',
   '["rectiligne uniforme (ou immobile)", "toujours accéléré", "circulaire", "parabolique"]', 0,
   'Forces compensées dans un référentiel galiléen : le mouvement est rectiligne uniforme, ou l''objet reste immobile.', 7),
  ('14310000-0000-4000-8000-000000000308'::uuid, 'Mécanique : lois de Newton',
   'Sans frottement, la trajectoire d''un projectile est : ', 'mcq',
   '["une parabole", "une droite verticale", "un cercle", "une hyperbole"]', 0,
   'Un projectile combine un mouvement horizontal uniforme et une chute verticale : sa trajectoire est une parabole.', 8),
  ('14310000-0000-4000-8000-000000000309'::uuid, 'Mécanique : lois de Newton',
   'Un satellite en orbite circulaire est maintenu par la force de gravitation.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La gravitation joue le rôle de force centripète et maintient le satellite sur son orbite.', 9),
  ('14310000-0000-4000-8000-000000000310'::uuid, 'Mécanique : lois de Newton',
   'En chute libre, l''accélération de l''objet est égale à : ', 'mcq',
   '["g ≈ 9,8 m/s²", "0", "la vitesse initiale", "la masse de l''objet"]', 0,
   'En chute libre, seul le poids agit : la 2ᵉ loi donne a = g ≈ 9,8 m/s².', 10),

  -- Chapitre 4 — Ondes lumineuses : diffraction
  ('14310000-0000-4000-8000-000000000404'::uuid, 'Ondes lumineuses : diffraction',
   'La relation entre longueur d''onde, célérité et fréquence est : ', 'mcq',
   '["λ = c / f", "λ = c × f", "λ = f / c", "λ = c + f"]', 0,
   'La longueur d''onde vaut λ = c / f.', 4),
  ('14310000-0000-4000-8000-000000000405'::uuid, 'Ondes lumineuses : diffraction',
   'La diffraction est d''autant plus marquée que la fente est : ', 'mcq',
   '["étroite", "large", "colorée", "épaisse"]', 0,
   'La diffraction est d''autant plus marquée que la fente est étroite (taille proche de λ).', 5),
  ('14310000-0000-4000-8000-000000000406'::uuid, 'Ondes lumineuses : diffraction',
   'La demi-largeur angulaire de la tache centrale de diffraction vaut : ', 'mcq',
   '["θ = λ / a", "θ = a / λ", "θ = λ × a", "θ = λ + a"]', 0,
   'La demi-largeur angulaire de la tache centrale est θ = λ / a (en radians).', 6),
  ('14310000-0000-4000-8000-000000000407'::uuid, 'Ondes lumineuses : diffraction',
   'La lumière visible a une longueur d''onde comprise entre environ 400 nm et 800 nm.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La lumière visible s''étend d''environ 400 nm (violet) à 800 nm (rouge).', 7),
  ('14310000-0000-4000-8000-000000000408'::uuid, 'Ondes lumineuses : diffraction',
   'Le phénomène produisant des franges brillantes et sombres par superposition de deux ondes s''appelle : ', 'mcq',
   '["les interférences", "la réfraction", "la réflexion", "la dispersion"]', 0,
   'La superposition de deux ondes de même fréquence produit des interférences (franges brillantes et sombres).', 8),
  ('14310000-0000-4000-8000-000000000409'::uuid, 'Ondes lumineuses : diffraction',
   'La diffraction et les interférences prouvent le caractère ondulatoire de la lumière.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Ces deux phénomènes ne s''expliquent que si la lumière est une onde : ils en prouvent le caractère ondulatoire.', 9),
  ('14310000-0000-4000-8000-000000000410'::uuid, 'Ondes lumineuses : diffraction',
   'Dans le vide, la célérité de la lumière c vaut environ : ', 'mcq',
   '["3,0 × 10⁸ m/s", "3,0 × 10⁶ m/s", "340 m/s", "1,5 × 10⁸ m/s"]', 0,
   'Dans le vide, c ≈ 3,0 × 10⁸ m/s.', 10),

  -- Chapitre 5 — Énergie et thermodynamique
  ('14310000-0000-4000-8000-000000000504'::uuid, 'Énergie et thermodynamique',
   'Le premier principe de la thermodynamique s''écrit : ', 'mcq',
   '["ΔU = W + Q", "ΔU = W − Q", "ΔU = W × Q", "ΔU = Q / W"]', 0,
   'Le premier principe exprime la conservation de l''énergie : ΔU = W + Q.', 4),
  ('14310000-0000-4000-8000-000000000505'::uuid, 'Énergie et thermodynamique',
   'Un moteur reçoit 1000 J et fournit 300 J utiles. Quel est son rendement ?', 'mcq',
   '["30 %", "70 %", "300 %", "3 %"]', 0,
   'η = énergie utile / énergie consommée = 300 / 1000 = 0,30 = 30 %.', 5),
  ('14310000-0000-4000-8000-000000000506'::uuid, 'Énergie et thermodynamique',
   'Chauffer 2 kg d''eau (c = 4180 J/(kg·K)) de 20 °C à 30 °C nécessite : ', 'mcq',
   '["83 600 J", "41 800 J", "8 360 J", "4180 J"]', 0,
   'Q = m·c·ΔT = 2 × 4180 × 10 = 83 600 J.', 6),
  ('14310000-0000-4000-8000-000000000507'::uuid, 'Énergie et thermodynamique',
   'Le rendement d''un dispositif réel est toujours inférieur à 1.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Une partie de l''énergie est toujours dissipée (en chaleur) : le rendement réel reste inférieur à 1.', 7),
  ('14310000-0000-4000-8000-000000000508'::uuid, 'Énergie et thermodynamique',
   'Le transfert thermique par déplacement d''un fluide s''appelle : ', 'mcq',
   '["la convection", "la conduction", "le rayonnement", "la fusion"]', 0,
   'La convection transfère la chaleur par déplacement d''un fluide (air, eau).', 8),
  ('14310000-0000-4000-8000-000000000509'::uuid, 'Énergie et thermodynamique',
   'La chaleur se transfère spontanément : ', 'mcq',
   '["du corps chaud vers le corps froid", "du corps froid vers le corps chaud", "dans les deux sens également", "jamais"]', 0,
   'Un transfert thermique se fait spontanément du corps chaud vers le corps froid.', 9),
  ('14310000-0000-4000-8000-000000000510'::uuid, 'Énergie et thermodynamique',
   'L''énergie transférée par rayonnement nécessite un support matériel.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : le rayonnement se propage sans support matériel (ex. la chaleur du Soleil traverse le vide).', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'physique-chimie'
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
    ('Cinétique chimique', $md$# Exercices types — Cinétique chimique

## Exercice 1 — Décomposition de l'eau oxygénée
On suit la décomposition de l'eau oxygénée H₂O₂ en présence d'ions catalyseurs. À t = 0, la concentration vaut [H₂O₂]₀ = 0,80 mol/L. On mesure qu'à t = 6 min, il reste [H₂O₂] = 0,40 mol/L.

a) Déterminer le temps de demi-réaction t½.
b) La réaction est-elle plus rapide au début ou vers la fin ? Justifier avec un facteur cinétique.

### Correction
a) Le temps de demi-réaction est la durée au bout de laquelle **la moitié** du réactif a été consommée. Ici [H₂O₂] passe de 0,80 à 0,40 mol/L, soit exactement la moitié, en 6 min. Donc **t½ = 6 min**.

b) La réaction est plus **rapide au début**. Au début, la concentration en réactif est maximale : les chocs efficaces entre molécules sont plus fréquents (la concentration est un facteur cinétique). À mesure que H₂O₂ est consommée, sa concentration diminue et la vitesse décroît.

## Exercice 2 — Rôle de la température et du catalyseur
On réalise trois fois la même réaction lente entre deux solutions :
- essai A : à 20 °C, sans catalyseur ;
- essai B : à 40 °C, sans catalyseur ;
- essai C : à 20 °C, avec un catalyseur.

a) Quel essai est le plus lent ? Justifier avec les facteurs cinétiques.
b) Le catalyseur modifie-t-il l'état final de la réaction ?

### Correction
a) Deux leviers accélèrent une réaction : augmenter la température et ajouter un catalyseur. L'essai B bénéficie d'une température plus élevée, l'essai C d'un catalyseur ; l'essai **A ne bénéficie d'aucun des deux**. C'est donc l'essai **A qui est le plus lent** ; B et C sont tous deux plus rapides que A.

b) **Non.** Un catalyseur accélère la réaction mais **ne modifie pas l'état final** : on obtient les mêmes produits, dans les mêmes quantités. Il n'est pas consommé et se retrouve intact à la fin.$md$),

    ('Acides et bases', $md$# Exercices types — Acides et bases

## Exercice 1 — pH d'une solution d'acide chlorhydrique
Une solution d'acide chlorhydrique (acide fort) a une concentration en ions oxonium [H₃O⁺] = 2,0 × 10⁻³ mol/L. On donne log(2,0) ≈ 0,30.

a) Calculer le pH de la solution (arrondi au dixième).
b) La solution est-elle acide, neutre ou basique ?

### Correction
a) pH = −log [H₃O⁺] = −log(2,0 × 10⁻³).
On décompose : −log(2,0 × 10⁻³) = −(log 2,0 + log 10⁻³) = −(0,30 − 3) = −(−2,70) = **2,7**.

b) pH = 2,7 < 7 : la solution est **acide**.

## Exercice 2 — Titrage d'un acide par la soude
On titre un volume V_A = 10,0 mL d'une solution d'acide par une solution de soude (base) de concentration C_B = 0,10 mol/L. L'équivalence est atteinte pour un volume versé V_B = 12,0 mL. Le titrage est à un proton (mole à mole).

a) Rappeler la relation vérifiée à l'équivalence.
b) Calculer la concentration C_A de l'acide.

### Correction
a) À l'équivalence, les réactifs sont dans les proportions stœchiométriques :
**C_A × V_A = C_B × V_B**.

b) On isole C_A :
C_A = (C_B × V_B) / V_A = (0,10 × 12,0) / 10,0 = 1,2 / 10,0 = **0,12 mol/L**.$md$),

    ('Mécanique : lois de Newton', $md$# Exercices types — Mécanique : lois de Newton

## Exercice 1 — Démarrage d'un chariot
Un chariot de masse m = 4,0 kg est tiré sur un rail horizontal par une force résultante constante de valeur ΣF = 12 N. On néglige les frottements.

a) Énoncer la deuxième loi de Newton et calculer l'accélération a du chariot.
b) Partant du repos, quelle vitesse atteint-il au bout de 3,0 s ? (on utilise v = a × t)

### Correction
a) La deuxième loi de Newton : ΣF = m × a. On isole a :
a = ΣF / m = 12 / 4,0 = **3,0 m/s²**.

b) Le mouvement est rectiligne uniformément accéléré, sans vitesse initiale :
v = a × t = 3,0 × 3,0 = **9,0 m/s**.

## Exercice 2 — Chute libre d'une bille
On lâche sans vitesse initiale une bille du haut d'un immeuble. On néglige les frottements de l'air et on prend g = 9,8 m/s².

a) Justifier que l'accélération de la bille vaut 9,8 m/s², quelle que soit sa masse.
b) Calculer sa vitesse au bout de 2,0 s. (on utilise v = g × t)

### Correction
a) En chute libre, la bille n'est soumise qu'à son poids P = m × g. La 2ᵉ loi de Newton donne m × a = m × g, d'où **a = g = 9,8 m/s²**. La masse se simplifie : l'accélération **ne dépend pas de la masse**.

b) Sans vitesse initiale : v = g × t = 9,8 × 2,0 = **19,6 m/s** (soit environ 20 m/s).$md$),

    ('Ondes lumineuses : diffraction', $md$# Exercices types — Ondes lumineuses : diffraction

## Exercice 1 — Longueur d'onde d'un laser
Un laser émet dans le vide une lumière de fréquence f = 4,7 × 10¹⁴ Hz. On donne c ≈ 3,0 × 10⁸ m/s.

a) Calculer la longueur d'onde λ de ce laser.
b) À quelle partie du spectre visible correspond-elle ?

### Correction
a) λ = c / f = (3,0 × 10⁸) / (4,7 × 10¹⁴) ≈ 6,4 × 10⁻⁷ m = **640 nm**.

b) 640 nm se situe entre 400 et 800 nm, dans la partie **rouge / orangé** du spectre visible.

## Exercice 2 — Diffraction par une fente
On éclaire une fente de largeur a = 0,10 mm avec un laser de longueur d'onde λ = 630 nm.

a) Calculer la demi-largeur angulaire θ de la tache centrale de diffraction. (on utilise θ = λ / a)
b) Que devient la tache centrale si l'on remplace la fente par une fente plus étroite ?

### Correction
a) On convertit en mètres : λ = 630 nm = 6,3 × 10⁻⁷ m et a = 0,10 mm = 1,0 × 10⁻⁴ m.
θ = λ / a = (6,3 × 10⁻⁷) / (1,0 × 10⁻⁴) = **6,3 × 10⁻³ rad**.

b) Si la fente est plus étroite (a plus petit), le rapport θ = λ / a **augmente** : la tache centrale devient **plus large**. La diffraction est d'autant plus marquée que la fente est fine.$md$),

    ('Énergie et thermodynamique', $md$# Exercices types — Énergie et thermodynamique

## Exercice 1 — Chauffage d'une casserole d'eau
On chauffe m = 1,5 kg d'eau de 15 °C à 100 °C. La capacité thermique massique de l'eau est c = 4180 J/(kg·K).

a) Calculer l'énergie thermique Q nécessaire.
b) Ce chauffage est fourni par une plaque qui consomme 700 kJ d'énergie électrique. Calculer le rendement.

### Correction
a) La variation de température vaut ΔT = 100 − 15 = 85 °C (soit 85 K).
Q = m × c × ΔT = 1,5 × 4180 × 85 ≈ **5,3 × 10⁵ J** (533 000 J).

b) Le rendement compare l'énergie utile (celle reçue par l'eau) à l'énergie consommée :
η = Q / E_consommée = 533 000 / 700 000 ≈ 0,76 = **76 %**.

## Exercice 2 — Bilan d'énergie d'un moteur
Un moteur reçoit par combustion une énergie de 5,0 × 10³ J. Il fournit un travail utile de 1,5 × 10³ J ; le reste est évacué sous forme de chaleur.

a) Calculer le rendement du moteur.
b) Quelle énergie est dissipée sous forme de chaleur ? Commenter avec la notion de dégradation de l'énergie.

### Correction
a) η = énergie utile / énergie consommée = (1,5 × 10³) / (5,0 × 10³) = 0,30 = **30 %**.

b) Par conservation de l'énergie (premier principe), l'énergie dissipée en chaleur est :
E_chaleur = 5,0 × 10³ − 1,5 × 10³ = **3,5 × 10³ J**.
Cette énergie est **dégradée** : dispersée en chaleur peu récupérable. C'est pourquoi un moteur réel a un rendement inférieur à 1.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'physique-chimie'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = 'Tle' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'Exercices types'
   AND l.content IS DISTINCT FROM v.md;
