-- =============================================================================
-- Studuel — Migration 111 : CONTENU Espagnol 4e (cours + carte mentale + quiz)
-- Remplit les 4 chapitres d'Espagnol 4e (LV2 année 2, niveau A1→A2) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder existant)
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
-- PRÉREQUIS : les subjects/chapters/lessons d'Espagnol 4e, mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('El pretérito perfecto', $md$# El pretérito perfecto

## Ce que tu vas comprendre
Le **pretérito perfecto** est un temps du passé très courant en espagnol. Il sert à parler d'une action passée qui a un lien avec le présent, ou qui s'est produite dans une période **non terminée** (aujourd'hui, cette semaine…). Il correspond souvent au passé composé français.

## 1. Comment le former
Le pretérito perfecto se construit en **deux morceaux** : l'auxiliaire **haber** conjugué au présent + le **participe passé** du verbe.

| Personne | haber (présent) |
|---|---|
| yo | he |
| tú | has |
| él / ella / usted | ha |
| nosotros | hemos |
| vosotros | habéis |
| ellos / ustedes | han |

*Exemple : **He comido** = « j'ai mangé ».*

## 2. Le participe passé régulier
- Verbes en **-ar** → **-ado** : hablar → **hablado**.
- Verbes en **-er / -ir** → **-ido** : comer → **comido**, vivir → **vivido**.

## 3. Les participes irréguliers
Certains participes ne suivent pas la règle, il faut les apprendre par cœur :
- hacer → **hecho**, decir → **dicho**, ver → **visto**
- escribir → **escrito**, volver → **vuelto**, poner → **puesto**, abrir → **abierto**

*Exemple : **Hemos visto** una película = « nous avons vu un film ».*

## 4. Quand l'utiliser : les marqueurs
On l'emploie avec des marqueurs de temps liés au présent :
- **hoy** (aujourd'hui), **esta semana** (cette semaine), **este año** (cette année)
- **ya** (déjà), **todavía no** (pas encore), **alguna vez** (déjà, une fois), **nunca** (jamais)

*Exemple : **Esta semana he estudiado** mucho = « cette semaine j'ai beaucoup étudié ».*

## L'essentiel à retenir
- Formation : **haber au présent + participe passé**.
- Participe régulier : -ar → **-ado**, -er / -ir → **-ido**.
- Participes irréguliers fréquents : hecho, dicho, visto, escrito, vuelto, puesto, abierto.
- Marqueurs : hoy, esta semana, ya, todavía no, alguna vez, nunca.$md$),

    ('La ciudad y las direcciones', $md$# La ciudad y las direcciones

## Ce que tu vas comprendre
Ce chapitre te donne le vocabulaire de la **ville** et les expressions pour **demander** et **indiquer un chemin** en espagnol. Tu apprendras aussi les prépositions de lieu et l'impératif pour donner une direction.

## 1. Le vocabulaire de la ville
- **la calle** (la rue), **la plaza** (la place), **el barrio** (le quartier)
- **el ayuntamiento** (la mairie), **la estación** (la gare), **el museo** (le musée)
- **la parada** (l'arrêt), **el semáforo** (le feu), **la esquina** (le coin de rue)

## 2. Demander son chemin
Quelques formules utiles :
- **¿Dónde está la estación?** = « où est la gare ? »
- **¿Cómo se va al museo?** = « comment va-t-on au musée ? »
- **¿Hay un banco por aquí?** = « y a-t-il une banque par ici ? »
- **Perdona / Perdone** = « excuse-moi / excusez-moi » (pour aborder quelqu'un).

## 3. Indiquer le chemin (l'impératif)
Pour donner une direction, on utilise l'**impératif** (tú) :
- **sigue todo recto** = « continue tout droit »
- **gira a la derecha / a la izquierda** = « tourne à droite / à gauche »
- **cruza la calle** = « traverse la rue »
- **toma la primera calle** = « prends la première rue »

## 4. Les prépositions de lieu
- **al lado de** (à côté de), **enfrente de** (en face de)
- **cerca de** (près de), **lejos de** (loin de)
- **entre** (entre), **detrás de** (derrière), **delante de** (devant)

*Exemple : **El museo está enfrente del ayuntamiento** = « le musée est en face de la mairie ».*

## L'essentiel à retenir
- Vocabulaire clé : calle, plaza, barrio, estación, museo, esquina.
- Demander : **¿Dónde está…?**, **¿Cómo se va a…?**, **¿Hay… por aquí?**
- Indiquer avec l'impératif : sigue todo recto, gira, cruza, toma.
- Prépositions : al lado de, enfrente de, cerca de, lejos de, entre.$md$),

    ('Gustos y opiniones', $md$# Gustos y opiniones

## Ce que tu vas comprendre
Ce chapitre t'apprend à exprimer ce que tu **aimes** et ce que tu **n'aimes pas**, ainsi qu'à donner ton **opinion**. Le verbe **gustar** fonctionne d'une manière particulière qu'il faut bien comprendre.

## 1. Le verbe gustar
En espagnol, on ne dit pas « j'aime » mais littéralement « ça me plaît ». Le verbe **gustar** s'accorde avec la **chose aimée**, pas avec la personne :
- **Me gusta el chocolate** = « j'aime le chocolat » (une chose → **gusta**).
- **Me gustan los animales** = « j'aime les animaux » (plusieurs choses → **gustan**).
- Avec un verbe : **Me gusta bailar** = « j'aime danser ».

## 2. Les pronoms
Devant gustar, on place un pronom qui indique **à qui** ça plaît :

| Pronom | Sens |
|---|---|
| me | à moi |
| te | à toi |
| le | à lui / elle |
| nos | à nous |
| os | à vous |
| les | à eux / elles |

*Pour insister : **A mí me gusta**, **a ti te gusta**…*

## 3. D'autres verbes comme gustar
- **encantar** (adorer) : **Me encanta la música**.
- **interesar** (intéresser), **molestar** (déranger).

## 4. Être d'accord ou non
- **A mí también** = « moi aussi » (accord avec une phrase positive).
- **A mí tampoco** = « moi non plus » (accord avec une phrase négative).
- **A mí sí / A mí no** = « moi si / moi non » (désaccord).
- Donner son avis : **creo que**, **pienso que**, **en mi opinión**, **me parece que**.

## L'essentiel à retenir
- **gusta** + singulier / infinitif, **gustan** + pluriel.
- Pronoms : me, te, le, nos, os, les (+ a mí, a ti… pour insister).
- **encantar** = adorer, se construit comme gustar.
- Accord : también / tampoco ; désaccord : a mí sí / a mí no.$md$),

    ('La vida cotidiana', $md$# La vida cotidiana

## Ce que tu vas comprendre
Ce chapitre décrit la **vie quotidienne** : la routine, les gestes de tous les jours, l'heure et la fréquence. Tu y apprendras surtout les **verbes pronominaux**, très utilisés pour parler de ses habitudes.

## 1. Les verbes pronominaux
Un verbe pronominal se conjugue avec un **pronom réfléchi** (me, te, se…). Exemple avec **levantarse** (se lever) :

| Personne | levantarse |
|---|---|
| yo | me levanto |
| tú | te levantas |
| él / ella | se levanta |
| nosotros | nos levantamos |
| vosotros | os levantáis |
| ellos | se levantan |

Autres verbes utiles : **despertarse** (se réveiller), **ducharse** (se doucher), **vestirse** (s'habiller), **acostarse** (se coucher), **lavarse** (se laver).

## 2. Dire l'heure
- **¿Qué hora es?** = « quelle heure est-il ? »
- **Es la una** (il est une heure), **Son las dos** (il est deux heures).
- **y media** (et demie), **y cuarto** (et quart), **menos cuarto** (moins le quart).

*Exemple : **Son las ocho y media** = « il est huit heures et demie ».*

## 3. Les moments de la journée
- **por la mañana** (le matin), **por la tarde** (l'après-midi), **por la noche** (le soir / la nuit).

## 4. La fréquence
- **siempre** (toujours), **a menudo** (souvent), **a veces** (parfois), **nunca** (jamais).
- **todos los días** (tous les jours), **una vez por semana** (une fois par semaine).

*Exemple : **Todos los días me levanto a las siete** = « tous les jours je me lève à sept heures ».*

## L'essentiel à retenir
- Verbes pronominaux : pronom réfléchi (me, te, se…) + verbe : **me levanto**, **se ducha**.
- L'heure : **Es la una**, **Son las dos**, y media, y cuarto, menos cuarto.
- Moments : por la mañana, por la tarde, por la noche.
- Fréquence : siempre, a menudo, a veces, nunca, todos los días.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'espagnol'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '4e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (4 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('El pretérito perfecto', $json${
      "centre": "El pretérito perfecto",
      "branches": [
        { "titre": "Formation", "enfants": ["haber au présent + participe", "he, has, ha, hemos, habéis, han", "He comido = j'ai mangé"] },
        { "titre": "Participe régulier", "enfants": ["-ar → -ado (hablado)", "-er / -ir → -ido (comido)", "vivir → vivido"] },
        { "titre": "Participes irréguliers", "enfants": ["hecho, dicho, visto", "escrito, vuelto, puesto", "abierto"] },
        { "titre": "Marqueurs de temps", "enfants": ["hoy, esta semana, este año", "ya, todavía no", "alguna vez, nunca"] }
      ]
    }$json$),
    ('La ciudad y las direcciones', $json${
      "centre": "La ciudad y las direcciones",
      "branches": [
        { "titre": "Vocabulaire de la ville", "enfants": ["calle, plaza, barrio", "estación, museo, ayuntamiento", "esquina, semáforo, parada"] },
        { "titre": "Demander le chemin", "enfants": ["¿Dónde está…?", "¿Cómo se va a…?", "¿Hay… por aquí?"] },
        { "titre": "Indiquer (impératif)", "enfants": ["sigue todo recto", "gira a la derecha / izquierda", "cruza, toma"] },
        { "titre": "Prépositions de lieu", "enfants": ["al lado de, enfrente de", "cerca de, lejos de", "entre, detrás de"] }
      ]
    }$json$),
    ('Gustos y opiniones', $json${
      "centre": "Gustos y opiniones",
      "branches": [
        { "titre": "Le verbe gustar", "enfants": ["Ça me plaît (pas « j'aime »)", "gusta + singulier / infinitif", "gustan + pluriel"] },
        { "titre": "Les pronoms", "enfants": ["me, te, le", "nos, os, les", "a mí me gusta (insister)"] },
        { "titre": "Verbes semblables", "enfants": ["encantar = adorer", "interesar, molestar", "Me encanta la música"] },
        { "titre": "Accord / désaccord", "enfants": ["también / tampoco", "a mí sí / a mí no", "creo que, pienso que"] }
      ]
    }$json$),
    ('La vida cotidiana', $json${
      "centre": "La vida cotidiana",
      "branches": [
        { "titre": "Verbes pronominaux", "enfants": ["me levanto, te levantas", "se ducha, nos vestimos", "acostarse, lavarse"] },
        { "titre": "L'heure", "enfants": ["¿Qué hora es?", "Es la una / Son las dos", "y media, y cuarto, menos cuarto"] },
        { "titre": "Moments du jour", "enfants": ["por la mañana", "por la tarde", "por la noche"] },
        { "titre": "La fréquence", "enfants": ["siempre, a menudo", "a veces, nunca", "todos los días"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'espagnol'
 WHERE c.subject_id = s.id AND c.level = '4e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds ont déjà créé les quiz ; ce bloc ne fait rien
--     si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Espagnol', '4e', v.chapter, true, l.id
FROM (VALUES
  ('11119999-0000-4000-8000-000000000001'::uuid, 'El pretérito perfecto'),
  ('11119999-0000-4000-8000-000000000002'::uuid, 'La ciudad y las direcciones'),
  ('11119999-0000-4000-8000-000000000003'::uuid, 'Gustos y opiniones'),
  ('11119999-0000-4000-8000-000000000004'::uuid, 'La vida cotidiana')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'espagnol'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '4e' AND c.title = v.chapter
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
  -- Chapitre 1 — El pretérito perfecto
  ('11110000-0000-4000-8000-000000000104'::uuid, 'El pretérito perfecto',
   'Comment se forme le pretérito perfecto ?', 'mcq',
   '["Haber au présent + participe passé", "Ser au présent + participe", "Tener au présent + infinitif", "Estar + gérondif"]', 0,
   'Il se forme avec l''auxiliaire haber conjugué au présent, suivi du participe passé.', 4),
  ('11110000-0000-4000-8000-000000000105'::uuid, 'El pretérito perfecto',
   'Quel est le participe passé du verbe « hablar » ?', 'mcq',
   '["hablado", "hablido", "hablando", "hablar"]', 0,
   'Les verbes en -ar forment leur participe en -ado : hablar → hablado.', 5),
  ('11110000-0000-4000-8000-000000000106'::uuid, 'El pretérito perfecto',
   'Choisis la forme correcte pour « nous avons mangé ».', 'mcq',
   '["Hemos comido", "Habéis comido", "Han comido", "Ha comido"]', 0,
   'nosotros → hemos ; le participe de comer est comido : « hemos comido ».', 6),
  ('11110000-0000-4000-8000-000000000107'::uuid, 'El pretérito perfecto',
   'Quel est le participe passé irrégulier de « hacer » ?', 'mcq',
   '["hecho", "hacido", "hechado", "hacado"]', 0,
   'hacer est irrégulier : son participe est hecho.', 7),
  ('11110000-0000-4000-8000-000000000108'::uuid, 'El pretérito perfecto',
   'Le marqueur « hoy » (aujourd''hui) s''emploie avec le pretérito perfecto.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'hoy renvoie à une période non terminée : on utilise le pretérito perfecto.', 8),
  ('11110000-0000-4000-8000-000000000109'::uuid, 'El pretérito perfecto',
   'Quelle phrase est correcte ?', 'mcq',
   '["Esta semana he estudiado mucho", "Esta semana he estudiar mucho", "Esta semana estudiado he mucho", "Esta semana yo estudiado mucho"]', 0,
   'yo → he + participe estudiado : « esta semana he estudiado mucho ».', 9),
  ('11110000-0000-4000-8000-000000000110'::uuid, 'El pretérito perfecto',
   'Le participe passé de « ver » est « visto ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'ver est irrégulier : son participe passé est visto.', 10),

  -- Chapitre 2 — La ciudad y las direcciones
  ('11110000-0000-4000-8000-000000000204'::uuid, 'La ciudad y las direcciones',
   'Que veut dire « la calle » ?', 'mcq',
   '["La rue", "La place", "La gare", "Le quartier"]', 0,
   '« la calle » signifie la rue (la plaza = la place, la estación = la gare).', 4),
  ('11110000-0000-4000-8000-000000000205'::uuid, 'La ciudad y las direcciones',
   'Comment demande-t-on « où est la gare ? »', 'mcq',
   '["¿Dónde está la estación?", "¿Cómo es la estación?", "¿Qué hora es la estación?", "¿Cuánto está la estación?"]', 0,
   'On demande un lieu avec ¿Dónde está…? → « ¿Dónde está la estación? ».', 5),
  ('11110000-0000-4000-8000-000000000206'::uuid, 'La ciudad y las direcciones',
   'Que signifie l''ordre « gira a la derecha » ?', 'mcq',
   '["Tourne à droite", "Tourne à gauche", "Continue tout droit", "Traverse la rue"]', 0,
   '« gira a la derecha » = tourne à droite ; izquierda = gauche.', 6),
  ('11110000-0000-4000-8000-000000000207'::uuid, 'La ciudad y las direcciones',
   'Comment dit-on « en face de » ?', 'mcq',
   '["enfrente de", "al lado de", "lejos de", "detrás de"]', 0,
   '« enfrente de » = en face de ; al lado de = à côté de, lejos de = loin de.', 7),
  ('11110000-0000-4000-8000-000000000208'::uuid, 'La ciudad y las direcciones',
   'Que veut dire « sigue todo recto » ?', 'mcq',
   '["Continue tout droit", "Tourne à gauche", "Arrête-toi", "Reviens en arrière"]', 0,
   '« sigue todo recto » = continue tout droit.', 8),
  ('11110000-0000-4000-8000-000000000209'::uuid, 'La ciudad y las direcciones',
   'Le mot « la esquina » désigne le coin de la rue.', 'true_false',
   '["Vrai", "Faux"]', 0,
   '« la esquina » désigne le coin, l''angle de la rue.', 9),
  ('11110000-0000-4000-8000-000000000210'::uuid, 'La ciudad y las direcciones',
   'Pour indiquer un chemin, on utilise souvent l''impératif (gira, cruza, toma).', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les directions se donnent à l''impératif : sigue, gira, cruza, toma.', 10),

  -- Chapitre 3 — Gustos y opiniones
  ('11110000-0000-4000-8000-000000000304'::uuid, 'Gustos y opiniones',
   'Comment dit-on « j''aime le chocolat » ?', 'mcq',
   '["Me gusta el chocolate", "Me gustan el chocolate", "Yo gusto el chocolate", "Me gusto el chocolate"]', 0,
   'gustar s''accorde avec la chose aimée : un objet singulier → gusta. « Me gusta el chocolate ».', 4),
  ('11110000-0000-4000-8000-000000000305'::uuid, 'Gustos y opiniones',
   'Quelle phrase est correcte pour « j''aime les animaux » ?', 'mcq',
   '["Me gustan los animales", "Me gusta los animales", "Me gustas los animales", "Yo gusto los animales"]', 0,
   'Objet pluriel (los animales) → gustan : « Me gustan los animales ».', 5),
  ('11110000-0000-4000-8000-000000000306'::uuid, 'Gustos y opiniones',
   'Que veut dire « me encanta la música » ?', 'mcq',
   '["J''adore la musique", "Je déteste la musique", "La musique m''ennuie", "Je joue de la musique"]', 0,
   'encantar = adorer : « me encanta la música » = j''adore la musique.', 6),
  ('11110000-0000-4000-8000-000000000307'::uuid, 'Gustos y opiniones',
   'Pour dire « moi aussi » (accord après une phrase positive), on dit :', 'mcq',
   '["A mí también", "A mí tampoco", "A mí no", "A mí nunca"]', 0,
   '« A mí también » exprime l''accord après une phrase positive ; tampoco s''emploie après une phrase négative.', 7),
  ('11110000-0000-4000-8000-000000000308'::uuid, 'Gustos y opiniones',
   'Quel pronom complète « ___ gusta viajar » (à nous) ?', 'mcq',
   '["Nos", "Me", "Le", "Os"]', 0,
   '« à nous » = nos : « Nos gusta viajar ».', 8),
  ('11110000-0000-4000-8000-000000000309'::uuid, 'Gustos y opiniones',
   'Avec le verbe gustar, on peut ajouter « a mí » pour insister : « A mí me gusta ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   '« A mí me gusta » insiste sur la personne ; la structure reste a mí + me + gusta.', 9),
  ('11110000-0000-4000-8000-000000000310'::uuid, 'Gustos y opiniones',
   'L''expression « creo que » sert à donner son opinion.', 'true_false',
   '["Vrai", "Faux"]', 0,
   '« creo que » (je crois que) introduit une opinion, comme pienso que ou me parece que.', 10),

  -- Chapitre 4 — La vida cotidiana
  ('11110000-0000-4000-8000-000000000404'::uuid, 'La vida cotidiana',
   'Comment dit-on « je me lève » ?', 'mcq',
   '["Me levanto", "Te levantas", "Se levanta", "Levanto"]', 0,
   'Verbe pronominal levantarse à la 1re personne : me levanto.', 4),
  ('11110000-0000-4000-8000-000000000405'::uuid, 'La vida cotidiana',
   'Que signifie « se ducha » ?', 'mcq',
   '["Il / elle se douche", "Je me douche", "Nous nous douchons", "Ils se douchent"]', 0,
   '3e personne du singulier de ducharse : se ducha = il / elle se douche.', 5),
  ('11110000-0000-4000-8000-000000000406'::uuid, 'La vida cotidiana',
   'Comment dit-on « il est une heure » ?', 'mcq',
   '["Es la una", "Son la una", "Son las una", "Es las una"]', 0,
   'Pour une heure, on utilise le singulier : « Es la una ».', 6),
  ('11110000-0000-4000-8000-000000000407'::uuid, 'La vida cotidiana',
   'Comment dit-on « il est deux heures et demie » ?', 'mcq',
   '["Son las dos y media", "Es la dos y media", "Son las dos y cuarto", "Son las dos menos cuarto"]', 0,
   'À partir de deux heures : Son las… ; « et demie » = y media.', 7),
  ('11110000-0000-4000-8000-000000000408'::uuid, 'La vida cotidiana',
   'Que veut dire « todos los días » ?', 'mcq',
   '["Tous les jours", "Parfois", "Jamais", "Une fois par semaine"]', 0,
   '« todos los días » = tous les jours (marqueur de fréquence).', 8),
  ('11110000-0000-4000-8000-000000000409'::uuid, 'La vida cotidiana',
   'L''expression « por la mañana » signifie « le matin ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   '« por la mañana » = le matin ; por la tarde = l''après-midi ; por la noche = le soir.', 9),
  ('11110000-0000-4000-8000-000000000410'::uuid, 'La vida cotidiana',
   'Dans « me acuesto a las diez », le pronom « me » signale un verbe pronominal.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'acostarse est pronominal ; « me acuesto » = je me couche.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'espagnol'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '4e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
