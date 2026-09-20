-- =============================================================================
-- Studuel — Migration 102 : CONTENU Espagnol 5e (cours + carte mentale + quiz)
-- Remplit les 4 chapitres d'Espagnol 5e (LV2 débutant, année 1, niveau A1) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder initial)
--   2. Carte mentale → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz        → complète le quiz de la leçon (3 → 10 questions). Les
--                    questions sont attachées au quiz DE LA LEÇON via la jointure
--                    leçon→quiz (robuste à l'id existant), positions 4→10.
--
-- Motif idempotent (comme 090) : UPDATE joint sur la clé naturelle
-- (slug, niveau, chapitre[, leçon]), garde `IS DISTINCT FROM`, contenu en
-- dollar-quoting $md$/$json$ ; INSERT des questions avec UUID fixes + garde
-- anti-doublon (ON CONFLICT). Filet : crée le quiz s'il manque. Réexécutable.
--
-- PRÉREQUIS : subjects/chapters/lessons pour Espagnol 5e, mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Saludos : se présenter', $md$# Saludos : se présenter

## Ce que tu vas comprendre
En espagnol, on commence toujours par **saluer** et **se présenter**. Ce chapitre te donne les mots et les phrases de base pour dire bonjour, dire ton nom, ton âge et d'où tu viens.

## 1. Saluer (los saludos)
Selon le moment de la journée, on ne dit pas la même chose :

| Espagnol | Français |
|---|---|
| **¡Hola!** | Salut ! |
| **Buenos días** | Bonjour (le matin) |
| **Buenas tardes** | Bonjour (l'après-midi) |
| **Buenas noches** | Bonsoir / Bonne nuit |
| **Adiós** | Au revoir |
| **Hasta luego** | À plus tard |

## 2. Demander et dire son nom
- **¿Cómo te llamas?** → Comment t'appelles-tu ?
- **Me llamo Marta.** → Je m'appelle Marta.
- **¿Y tú?** → Et toi ?

> Le verbe **llamarse** (« s'appeler ») est pronominal : *me llamo, te llamas, se llama*.

## 3. Dire d'où l'on vient
- **¿De dónde eres?** → D'où viens-tu ?
- **Soy de Francia.** → Je viens de France.
- **Soy francés / Soy francesa.** → Je suis français / française.

*On utilise le verbe **ser** pour l'origine et la nationalité.*

## 4. Dire son âge
- **¿Cuántos años tienes?** → Quel âge as-tu ?
- **Tengo doce años.** → J'ai douze ans.

*Attention : en espagnol on utilise **tener** (avoir) pour l'âge, comme en français.*

## L'essentiel à retenir
- On salue selon le moment : **Buenos días** (matin), **Buenas tardes** (après-midi).
- **¿Cómo te llamas?** → **Me llamo…** pour le nom.
- **¿De dónde eres?** → **Soy de…** avec le verbe **ser** pour l'origine.
- **¿Cuántos años tienes?** → **Tengo … años** avec le verbe **tener** pour l'âge.$md$),

    ('Los artículos y el género', $md$# Los artículos y el género

## Ce que tu vas comprendre
En espagnol, chaque nom a un **genre** (masculin ou féminin) et un **nombre** (singulier ou pluriel). L'**article** placé devant s'accorde avec le nom. Ce chapitre t'apprend à ne pas te tromper.

## 1. Le genre des noms
La règle générale se repère souvent à la **terminaison** :
- les noms en **-o** sont le plus souvent **masculins** : *el libro* (le livre), *el niño* (le garçon) ;
- les noms en **-a** sont le plus souvent **féminins** : *la casa* (la maison), *la niña* (la fille).

> Attention aux exceptions : *el día* (le jour, masculin en -a), *la mano* (la main, féminin en -o).

## 2. Les articles définis (el, la, los, las)
On les utilise pour parler d'une chose **précise** (« le / la / les »).

| | Singulier | Pluriel |
|---|---|---|
| **Masculin** | el | los |
| **Féminin** | la | las |

*Exemples : **el** libro → **los** libros ; **la** casa → **las** casas.*

## 3. Les articles indéfinis (un, una, unos, unas)
On les utilise pour parler d'une chose **quelconque** (« un / une / des »).

| | Singulier | Pluriel |
|---|---|---|
| **Masculin** | un | unos |
| **Féminin** | una | unas |

*Exemples : **un** amigo (un ami), **una** amiga (une amie), **unos** libros (des livres).*

## 4. Le pluriel des noms
- nom terminé par une **voyelle** → on ajoute **-s** : *libro → libros*, *casa → casas* ;
- nom terminé par une **consonne** → on ajoute **-es** : *profesor → profesores*, *ciudad → ciudades*.

## L'essentiel à retenir
- Terminaison **-o** → souvent masculin ; **-a** → souvent féminin (avec des exceptions).
- Articles définis : **el / la / los / las** ; indéfinis : **un / una / unos / unas**.
- L'article **s'accorde** en genre et en nombre avec le nom.
- Pluriel : **+ -s** après une voyelle, **+ -es** après une consonne.$md$),

    ('La familia y la casa', $md$# La familia y la casa

## Ce que tu vas comprendre
Ce chapitre te donne le vocabulaire pour parler de ta **famille** (la familia) et de ta **maison** (la casa), avec les deux verbes essentiels **ser** et **tener**.

## 1. La familia
| Espagnol | Français |
|---|---|
| **el padre** | le père |
| **la madre** | la mère |
| **el hermano / la hermana** | le frère / la sœur |
| **el abuelo / la abuela** | le grand-père / la grand-mère |
| **el hijo / la hija** | le fils / la fille |
| **los padres** | les parents |

*Exemple : **Tengo un hermano y una hermana.** → J'ai un frère et une sœur.*

## 2. La casa y las habitaciones
| Espagnol | Français |
|---|---|
| **la cocina** | la cuisine |
| **el salón** | le salon |
| **el dormitorio** | la chambre |
| **el cuarto de baño** | la salle de bains |
| **el jardín** | le jardin |

*Exemple : **En mi casa hay tres dormitorios.** → Dans ma maison il y a trois chambres.*

## 3. Le verbe SER (être : ce qu'on est)
On l'utilise pour décrire une personne, sa nationalité, son caractère.

| | ser |
|---|---|
| yo | **soy** |
| tú | **eres** |
| él / ella | **es** |
| nosotros | **somos** |

*Exemple : **Mi madre es simpática.** → Ma mère est sympathique.*

## 4. Le verbe TENER (avoir : ce qu'on possède)
On l'utilise pour la possession, la famille, l'âge.

| | tener |
|---|---|
| yo | **tengo** |
| tú | **tienes** |
| él / ella | **tiene** |
| nosotros | **tenemos** |

*Exemple : **Mi hermano tiene un perro.** → Mon frère a un chien.*

## L'essentiel à retenir
- Famille : **el padre, la madre, el hermano, la hermana, los abuelos**.
- Maison : **la cocina, el salón, el dormitorio, el cuarto de baño**.
- **ser** = décrire ce qu'on est : *soy, eres, es*.
- **tener** = posséder / la famille / l'âge : *tengo, tienes, tiene*.$md$),

    ('El presente de indicativo', $md$# El presente de indicativo

## Ce que tu vas comprendre
Le **présent de l'indicatif** sert à parler de ce qu'on fait maintenant ou d'habitude. En espagnol, les verbes se rangent en **trois groupes** selon leur terminaison : **-ar**, **-er**, **-ir**. Ce chapitre t'apprend les terminaisons régulières.

## 1. Les trois groupes de verbes
- verbes en **-ar** : *hablar* (parler) ;
- verbes en **-er** : *comer* (manger) ;
- verbes en **-ir** : *vivir* (vivre / habiter).

Pour conjuguer, on enlève la terminaison (**-ar / -er / -ir**) pour trouver le **radical**, puis on ajoute les terminaisons.

## 2. Les terminaisons du présent
| Pronom | -ar (hablar) | -er (comer) | -ir (vivir) |
|---|---|---|---|
| yo | habl**o** | com**o** | viv**o** |
| tú | habl**as** | com**es** | viv**es** |
| él / ella | habl**a** | com**e** | viv**e** |
| nosotros | habl**amos** | com**emos** | viv**imos** |
| vosotros | habl**áis** | com**éis** | viv**ís** |
| ellos / ellas | habl**an** | com**en** | viv**en** |

> Remarque : les verbes en **-er** et **-ir** ont presque les mêmes terminaisons, sauf à *nosotros* et *vosotros*.

## 3. Exemples en phrase
- **Yo hablo español.** → Je parle espagnol.
- **Tú comes una manzana.** → Tu manges une pomme.
- **Ella vive en Madrid.** → Elle habite à Madrid.
- **Nosotros hablamos con el profesor.** → Nous parlons avec le professeur.

## 4. Le pronom sujet est souvent omis
En espagnol, la terminaison suffit à savoir qui parle : on peut **enlever le pronom**.
- **Hablo español.** (= *Yo hablo español.*)
- **Vivimos en Francia.** (= *Nosotros vivimos en Francia.*)

## L'essentiel à retenir
- Trois groupes : **-ar, -er, -ir** ; on enlève la terminaison pour trouver le radical.
- **-ar** : -o, -as, -a, -amos, -áis, -an.
- **-er** : -o, -es, -e, -emos, -éis, -en ; **-ir** : -o, -es, -e, -imos, -ís, -en.
- Le **pronom sujet** est souvent omis car la terminaison indique la personne.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'espagnol'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '5e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Saludos : se présenter', $json${
      "centre": "Saludos : se présenter",
      "branches": [
        { "titre": "Saluer", "enfants": ["¡Hola! = Salut", "Buenos días (matin)", "Buenas tardes / noches"] },
        { "titre": "Dire son nom", "enfants": ["¿Cómo te llamas?", "Me llamo…", "Verbe llamarse"] },
        { "titre": "Dire son origine", "enfants": ["¿De dónde eres?", "Soy de Francia", "Verbe ser"] },
        { "titre": "Dire son âge", "enfants": ["¿Cuántos años tienes?", "Tengo doce años", "Verbe tener"] }
      ]
    }$json$),
    ('Los artículos y el género', $json${
      "centre": "Los artículos y el género",
      "branches": [
        { "titre": "Le genre", "enfants": ["-o → souvent masculin", "-a → souvent féminin", "Exceptions : el día, la mano"] },
        { "titre": "Articles définis", "enfants": ["el / la (singulier)", "los / las (pluriel)", "Chose précise : le / la"] },
        { "titre": "Articles indéfinis", "enfants": ["un / una", "unos / unas", "Chose quelconque : un / une"] },
        { "titre": "Le pluriel", "enfants": ["+ -s après voyelle", "+ -es après consonne", "libro → libros"] }
      ]
    }$json$),
    ('La familia y la casa', $json${
      "centre": "La familia y la casa",
      "branches": [
        { "titre": "La familia", "enfants": ["el padre, la madre", "el hermano, la hermana", "los abuelos"] },
        { "titre": "La casa", "enfants": ["la cocina, el salón", "el dormitorio", "el cuarto de baño"] },
        { "titre": "Verbe ser", "enfants": ["soy, eres, es", "Décrire ce qu'on est", "Mi madre es simpática"] },
        { "titre": "Verbe tener", "enfants": ["tengo, tienes, tiene", "Posséder / la famille", "Tengo un hermano"] }
      ]
    }$json$),
    ('El presente de indicativo', $json${
      "centre": "El presente de indicativo",
      "branches": [
        { "titre": "Trois groupes", "enfants": ["-ar : hablar", "-er : comer", "-ir : vivir"] },
        { "titre": "Terminaisons -ar", "enfants": ["-o, -as, -a", "-amos, -áis, -an", "Yo hablo español"] },
        { "titre": "Terminaisons -er / -ir", "enfants": ["-o, -es, -e", "-emos/-imos, -en", "Ella vive en Madrid"] },
        { "titre": "Pronom omis", "enfants": ["La terminaison suffit", "Hablo español", "Vivimos en Francia"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'espagnol'
 WHERE c.subject_id = s.id AND c.level = '5e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds de contenu ont déjà créé les quiz ; ce bloc ne
--     fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Espagnol', '5e', v.chapter, true, l.id
FROM (VALUES
  ('10219999-0000-4000-8000-000000000001'::uuid, 'Saludos : se présenter'),
  ('10219999-0000-4000-8000-000000000002'::uuid, 'Los artículos y el género'),
  ('10219999-0000-4000-8000-000000000003'::uuid, 'La familia y la casa'),
  ('10219999-0000-4000-8000-000000000004'::uuid, 'El presente de indicativo')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'espagnol'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '5e' AND c.title = v.chapter
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
  -- Chapitre 1 — Saludos : se présenter
  ('10210000-0000-4000-8000-000000000104'::uuid, 'Saludos : se présenter',
   'Que veut dire « ¡Hola! » ?', 'mcq',
   '["Salut !", "Au revoir !", "Merci !", "Bonne nuit !"]', 0,
   '« ¡Hola! » est le salut le plus courant : Salut !', 4),
  ('10210000-0000-4000-8000-000000000105'::uuid, 'Saludos : se présenter',
   'Comment demande-t-on « Comment t''appelles-tu ? » en espagnol ?', 'mcq',
   '["¿Cómo te llamas?", "¿De dónde eres?", "¿Cuántos años tienes?", "¿Qué tal?"]', 0,
   '« ¿Cómo te llamas? » = Comment t''appelles-tu ? On répond « Me llamo… ».', 5),
  ('10210000-0000-4000-8000-000000000106'::uuid, 'Saludos : se présenter',
   'Pour dire « Je m''appelle Marta », on dit : ', 'mcq',
   '["Me llamo Marta", "Soy de Marta", "Tengo Marta", "Te llamas Marta"]', 0,
   'Le verbe llamarse : « Me llamo Marta » = Je m''appelle Marta.', 6),
  ('10210000-0000-4000-8000-000000000107'::uuid, 'Saludos : se présenter',
   'Pour dire son origine (« Je viens de France »), on utilise le verbe « tener ».', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : on utilise le verbe « ser » → « Soy de Francia ». « Tener » sert pour l''âge.', 7),
  ('10210000-0000-4000-8000-000000000108'::uuid, 'Saludos : se présenter',
   'Que signifie « Buenas noches » ?', 'mcq',
   '["Bonsoir / Bonne nuit", "Bonjour (le matin)", "À plus tard", "Au revoir"]', 0,
   '« Buenas noches » se dit le soir : Bonsoir / Bonne nuit.', 8),
  ('10210000-0000-4000-8000-000000000109'::uuid, 'Saludos : se présenter',
   'Comment dit-on « J''ai douze ans » ?', 'mcq',
   '["Tengo doce años", "Soy doce años", "Me llamo doce", "Hay doce años"]', 0,
   'Pour l''âge on utilise « tener » : « Tengo doce años » = J''ai douze ans.', 9),
  ('10210000-0000-4000-8000-000000000110'::uuid, 'Saludos : se présenter',
   '« Hasta luego » veut dire « À plus tard ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   '« Hasta luego » = À plus tard, une façon de dire au revoir.', 10),

  -- Chapitre 2 — Los artículos y el género
  ('10210000-0000-4000-8000-000000000204'::uuid, 'Los artículos y el género',
   'Quel article défini masculin singulier utilise-t-on : « ___ libro » ?', 'mcq',
   '["el", "la", "los", "un"]', 0,
   '« libro » est masculin singulier → « el libro ».', 4),
  ('10210000-0000-4000-8000-000000000205'::uuid, 'Los artículos y el género',
   'Le plus souvent, un nom qui se termine par « -a » est féminin.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'En général, les noms en -a sont féminins (la casa), et ceux en -o masculins (el libro).', 5),
  ('10210000-0000-4000-8000-000000000206'::uuid, 'Los artículos y el género',
   'Quel est le pluriel de « la casa » ?', 'mcq',
   '["las casas", "los casas", "las casa", "unas casa"]', 0,
   'Féminin pluriel : article « las » + nom + -s → « las casas ».', 6),
  ('10210000-0000-4000-8000-000000000207'::uuid, 'Los artículos y el género',
   'Comment dit-on « une amie » (article indéfini féminin) ?', 'mcq',
   '["una amiga", "un amiga", "la amiga", "unas amiga"]', 0,
   'Article indéfini féminin singulier : « una amiga ».', 7),
  ('10210000-0000-4000-8000-000000000208'::uuid, 'Los artículos y el género',
   'On forme le pluriel de « profesor » en ajoutant : ', 'mcq',
   '["-es (profesores)", "-s (profesors)", "rien", "-as (profesoras)"]', 0,
   'Un nom terminé par une consonne prend « -es » : profesor → profesores.', 8),
  ('10210000-0000-4000-8000-000000000209'::uuid, 'Los artículos y el género',
   'Quel article défini féminin pluriel : « ___ niñas » ?', 'mcq',
   '["las", "los", "la", "unas"]', 0,
   'Féminin pluriel défini → « las niñas ».', 9),
  ('10210000-0000-4000-8000-000000000210'::uuid, 'Los artículos y el género',
   'L''article s''accorde en genre et en nombre avec le nom.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : el/la/los/las et un/una/unos/unas s''accordent avec le nom.', 10),

  -- Chapitre 3 — La familia y la casa
  ('10210000-0000-4000-8000-000000000304'::uuid, 'La familia y la casa',
   'Que veut dire « la hermana » ?', 'mcq',
   '["la sœur", "le frère", "la mère", "la grand-mère"]', 0,
   '« la hermana » = la sœur ; « el hermano » = le frère.', 4),
  ('10210000-0000-4000-8000-000000000305'::uuid, 'La familia y la casa',
   'Comment dit-on « la cuisine » en espagnol ?', 'mcq',
   '["la cocina", "el salón", "el dormitorio", "el jardín"]', 0,
   '« la cocina » = la cuisine ; « el salón » = le salon.', 5),
  ('10210000-0000-4000-8000-000000000306'::uuid, 'La familia y la casa',
   'Complète : « Mi madre ___ simpática. »', 'mcq',
   '["es", "tiene", "tengo", "eres"]', 0,
   'Pour décrire (ser) : « Mi madre es simpática » = Ma mère est sympathique.', 6),
  ('10210000-0000-4000-8000-000000000307'::uuid, 'La familia y la casa',
   'Complète : « Yo ___ un hermano. » (posséder)', 'mcq',
   '["tengo", "soy", "tiene", "es"]', 0,
   'Pour posséder on utilise tener : « Tengo un hermano » = J''ai un frère.', 7),
  ('10210000-0000-4000-8000-000000000308'::uuid, 'La familia y la casa',
   '« el dormitorio » désigne la salle de bains.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : « el dormitorio » = la chambre. La salle de bains, c''est « el cuarto de baño ».', 8),
  ('10210000-0000-4000-8000-000000000309'::uuid, 'La familia y la casa',
   'Quelle est la forme correcte du verbe « ser » pour « tú » ?', 'mcq',
   '["eres", "es", "soy", "somos"]', 0,
   'ser : soy (yo), eres (tú), es (él/ella), somos (nosotros).', 9),
  ('10210000-0000-4000-8000-000000000310'::uuid, 'La familia y la casa',
   'Que veut dire « los abuelos » ?', 'mcq',
   '["les grands-parents", "les parents", "les frères", "les enfants"]', 0,
   '« los abuelos » = les grands-parents (el abuelo, la abuela).', 10),

  -- Chapitre 4 — El presente de indicativo
  ('10210000-0000-4000-8000-000000000404'::uuid, 'El presente de indicativo',
   'À quel groupe appartient le verbe « hablar » ?', 'mcq',
   '["-ar", "-er", "-ir", "irrégulier"]', 0,
   '« hablar » se termine par -ar : c''est un verbe du 1er groupe.', 4),
  ('10210000-0000-4000-8000-000000000405'::uuid, 'El presente de indicativo',
   'Conjugue « hablar » à la 1re personne du singulier (yo) : ', 'mcq',
   '["hablo", "hablas", "habla", "hablamos"]', 0,
   'yo hablo : la terminaison -o marque le « je » pour les verbes en -ar.', 5),
  ('10210000-0000-4000-8000-000000000406'::uuid, 'El presente de indicativo',
   'Complète : « Ella ___ en Madrid. » (vivir)', 'mcq',
   '["vive", "vives", "vivo", "vivimos"]', 0,
   'vivir → él/ella vive : « Ella vive en Madrid » = Elle habite à Madrid.', 6),
  ('10210000-0000-4000-8000-000000000407'::uuid, 'El presente de indicativo',
   'Quelle est la bonne terminaison : « Nosotros com___ una manzana. » (comer)', 'mcq',
   '["comemos", "coméis", "comen", "come"]', 0,
   'comer → nosotros comemos ; la terminaison -emos marque le « nous ».', 7),
  ('10210000-0000-4000-8000-000000000408'::uuid, 'El presente de indicativo',
   'En espagnol, on peut souvent omettre le pronom sujet.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Vrai : la terminaison indique la personne, donc « Hablo español » suffit (= Yo hablo).', 8),
  ('10210000-0000-4000-8000-000000000409'::uuid, 'El presente de indicativo',
   'Conjugue « comer » avec « tú » : ', 'mcq',
   '["comes", "come", "como", "coméis"]', 0,
   'comer → tú comes ; la terminaison -es marque le « tu » pour les verbes en -er.', 9),
  ('10210000-0000-4000-8000-000000000410'::uuid, 'El presente de indicativo',
   'Que signifie « Yo hablo español » ?', 'mcq',
   '["Je parle espagnol", "Tu parles espagnol", "Nous parlons espagnol", "Il parle espagnol"]', 0,
   '« Yo hablo español » = Je parle espagnol (yo = je, hablo = parle).', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'espagnol'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '5e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
