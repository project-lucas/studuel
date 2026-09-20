-- =============================================================================
-- Studuel — Migration 116 : CONTENU Anglais 3e (+ exercices types)
-- Remplit les 5 chapitres d'Anglais 3e (programme cycle 4, LV1 A2→B1) :
--   1. Cours          → lessons.content de « L'essentiel du cours » (remplace le
--                       placeholder de la structure)
--   2. Carte mentale  → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz           → complète le quiz de la leçon (3 → 10 questions). Les
--                       questions sont attachées au quiz DE LA LEÇON via la
--                       jointure leçon→quiz (robuste à l'id existant), pos 4→10.
--   4. Exercices types → lessons.content de « Exercices types » (position 2) :
--                       2 exercices + correction par chapitre.
--
-- Motif idempotent (comme 090) : UPDATE joint sur la clé naturelle
-- (slug, niveau, chapitre[, leçon]), garde `IS DISTINCT FROM`, contenu en
-- dollar-quoting $md$/$json$ ; INSERT des questions avec UUID fixes + garde
-- anti-doublon (ON CONFLICT). Filet : crée le quiz s'il manque. Réexécutable.
--
-- PRÉREQUIS : subjects/chapters/lessons d'Anglais 3e, mind_map, quizzes.
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Le passif', $md$# Le passif

## Ce que tu vas comprendre
La voix **passive** met en avant l'action ou son résultat plutôt que celui qui la fait. En anglais, on l'emploie très souvent, surtout quand l'auteur de l'action est inconnu ou sans importance. Ce chapitre t'apprend à former le passif et à transformer une phrase active en phrase passive.

## 1. Comment se forme le passif
Le passif se construit toujours de la même façon :
**be (au bon temps) + participe passé (past participle)** du verbe.

- *English is spoken here.* → L'anglais est parlé ici.
- *The car was repaired.* → La voiture a été réparée.

C'est le verbe **be** qui porte le temps ; le **participe passé** ne change jamais.

## 2. Le participe passé
- Verbes réguliers : base + **-ed** (*play → played*, *use → used*).
- Verbes irréguliers : 3e colonne (*take → taken*, *write → written*, *make → made*).

## 3. Passer de l'actif au passif
On suit trois étapes :
1. Le **complément** (COD) de la phrase active devient le **sujet** de la phrase passive.
2. Le verbe passe à **be + participe passé** (au même temps).
3. L'ancien sujet, si on le garde, est introduit par **by** (« par »).

*Actif :* **Shakespeare wrote** this play.
*Passif :* This play **was written by** Shakespeare.

## 4. Le passif à différents temps
| Temps | Actif | Passif |
|---|---|---|
| Présent | They clean the room. | The room **is cleaned**. |
| Prétérit | They cleaned the room. | The room **was cleaned**. |
| Present perfect | They have cleaned the room. | The room **has been cleaned**. |
| Futur | They will clean the room. | The room **will be cleaned**. |

## 5. Quand utilise-t-on le passif ?
- Quand on ne sait pas **qui** fait l'action : *My bike was stolen.* (on ignore par qui).
- Quand l'auteur est **évident** ou sans importance : *The results will be published tomorrow.*
- Dans un style **formel**, scientifique ou journalistique.

## L'essentiel à retenir
- Passif = **be + participe passé** ; c'est **be** qui porte le temps.
- Le COD de l'actif devient le **sujet** du passif.
- L'auteur de l'action est introduit par **by** (souvent omis).
- On l'emploie quand l'auteur est inconnu, évident ou peu important.$md$),

    ('Les modaux : conseils et obligation', $md$# Les modaux : conseils et obligation

## Ce que tu vas comprendre
Les **modaux** (must, have to, should, can…) sont de petits auxiliaires qui expriment une **obligation**, un **conseil**, une **capacité** ou une **permission**. Ce chapitre t'apprend à choisir le bon modal selon le sens et à l'employer correctement.

## 1. Les règles de base des modaux
- Ils sont **invariables** : jamais de -s à la 3e personne (*she can*, pas *she cans*).
- Ils sont suivis de la **base verbale** (sans *to*) : *You should go*, pas *to go*.
- **have to** est le seul « faux modal » : il se conjugue (*he has to*).

## 2. L'obligation : must / have to
- **must** : obligation forte, souvent venue de celui qui parle. *You must wear a helmet.*
- **have to** : obligation venue d'une règle extérieure. *I have to wear a uniform at school.*

À l'oral, les deux traduisent souvent « devoir ».

## 3. Interdiction et absence d'obligation
Attention à ce piège très fréquent :
| Forme | Sens |
|---|---|
| **mustn't** | c'est **interdit** (*You mustn't smoke.*) |
| **don't have to** | ce n'est **pas obligatoire** (*You don't have to come.*) |

## 4. Le conseil : should
**should** (« devrait ») donne un **conseil** ou une **recommandation**.
- *You should revise before the test.* → Tu devrais réviser.
- *You shouldn't eat so much sugar.* → Tu ne devrais pas…

## 5. Capacité et permission : can
- **can** = capacité : *I can swim.*
- **can** = permission : *Can I open the window?*
- Passé de *can* : **could** (*She could read at 4.*).

## L'essentiel à retenir
- Un modal est **invariable** et suivi de la **base verbale** (sans *to*).
- **must / have to** = obligation ; **should** = conseil ; **can** = capacité/permission.
- **mustn't** = interdiction, mais **don't have to** = pas d'obligation (à ne pas confondre !).$md$),

    ('Present perfect vs prétérit', $md$# Present perfect vs prétérit

## Ce que tu vas comprendre
Le **prétérit** et le **present perfect** parlent tous les deux du passé, mais pas de la même manière. Le choix dépend du **lien avec le présent** et des **marqueurs de temps**. Ce chapitre t'aide à ne plus les confondre.

## 1. Le prétérit : un passé terminé
Le **prétérit** décrit une action **finie**, à un moment **précis** du passé, sans lien avec maintenant.
- Formation : base + **-ed** (réguliers) ou 2e colonne (irréguliers).
- *I visited London in 2019.* / *She saw the film yesterday.*

## 2. Le present perfect : un passé lié au présent
Le **present perfect** (**have/has + participe passé**) relie une action passée au **présent** : le moment exact n'a pas d'importance.
- *I have visited London.* (l'expérience compte, pas la date).
- *She has lost her keys.* (résultat : elle ne les a toujours pas).

## 3. Les marqueurs qui font la différence
| Prétérit (passé daté) | Present perfect (lien présent) |
|---|---|
| yesterday, ago, in 2019 | already, yet, ever, never |
| last week, then | for, since, just |
| **when** (quand ?) | so far, up to now |

Règle simple : **when → prétérit** ; **already / yet / for / since → present perfect**.

## 4. For et since
- **for** + **durée** : *for three years*, *for a week*.
- **since** + **point de départ** : *since 2020*, *since Monday*.

*I have lived here for five years / since 2019.*

## 5. Already, yet, just
- **already** : déjà (phrase affirmative) — *I have already eaten.*
- **yet** : encore/déjà (négation et question, en fin de phrase) — *Have you finished yet?*
- **just** : venir de — *She has just arrived.*

## L'essentiel à retenir
- **Prétérit** = passé **terminé et daté** (yesterday, when, in 2019).
- **Present perfect** = passé **relié au présent** (already, yet, for, since).
- **when → prétérit** ; **for / since / already / yet → present perfect**.
- **for** + durée ; **since** + point de départ.$md$),

    ('Le monde du travail', $md$# Le monde du travail

## Ce que tu vas comprendre
Ce chapitre te donne le **vocabulaire** pour parler des **métiers**, du **travail** et pour te projeter dans ta future vie professionnelle. Tu apprends aussi à parler de tes goûts et de tes projets.

## 1. Parler des métiers (jobs)
| English | Français |
|---|---|
| a job / a career | un emploi / une carrière |
| a nurse, a doctor | un(e) infirmier(ère), un médecin |
| an engineer | un(e) ingénieur(e) |
| a shop assistant | un(e) vendeur(euse) |
| a firefighter | un(e) pompier(ère) |

Pour dire son métier : *She is a teacher.* / *He works as a mechanic.*

## 2. Le lieu et le monde du travail
- **a company / a firm** : une entreprise.
- **an office** : un bureau ; **a factory** : une usine.
- **an employer / an employee** : un employeur / un(e) salarié(e).
- **a colleague / a boss** : un(e) collègue / un(e) patron(ne).

## 3. Le travail des jeunes
- **a summer job** : un job d'été.
- **work experience / an internship** : un stage.
- **to earn money / pocket money** : gagner de l'argent / argent de poche.
- **to babysit, to deliver newspapers** : garder des enfants, distribuer des journaux.

## 4. Parler de ses projets
Pour se projeter, on utilise le futur (*will*, *going to*) et *would like to* :
- *I would like to be a vet.* → J'aimerais être vétérinaire.
- *I want to work abroad.* → Je veux travailler à l'étranger.
- *She is going to study medicine.* → Elle va étudier la médecine.

## 5. Qualités et goûts
- *I'm good at maths.* → Je suis bon en maths.
- *I enjoy working with children / outdoors.* → J'aime travailler avec des enfants / dehors.
- **skills** : les compétences ; **hard-working** : travailleur.

## L'essentiel à retenir
- Métier : *She is a nurse.* / *He works as an engineer.*
- Lieux : *company, office, factory* ; personnes : *employer, employee, colleague, boss*.
- Jobs de jeunes : *summer job, internship, to earn money*.
- Projets : *would like to*, *want to*, *going to* + base verbale.$md$),

    ('Préparer l''épreuve orale', $md$# Préparer l'épreuve orale

## Ce que tu vas comprendre
À l'oral (brevet, exposé), on te demande souvent de **présenter un document** (image, texte, projet) et d'en **parler**. Ce chapitre te donne la **méthode** et les **phrases utiles** pour réussir ta prise de parole en anglais.

## 1. Présenter un document
Commence par dire **ce que c'est** :
- *This document is a photo / an advert / an article.*
- *It was taken from… / It shows…*
- *The title is… / It is about…*

## 2. Décrire une image
Utilise les **repères de position** :
- **in the foreground / in the background** : au premier plan / à l'arrière-plan.
- **on the left / on the right / in the middle** : à gauche / à droite / au milieu.
- **There is… / There are…** pour énumérer.

## 3. Donner son avis
Montre que tu **réagis** au document :
- *I think that… / In my opinion…* → Je pense que…
- *This document is interesting because…*
- *I like / I don't like… because…*

## 4. Structurer sa présentation
Une bonne présentation suit un **plan** :
1. **Introduction** : présenter le document (nature, sujet).
2. **Développement** : décrire, expliquer, donner des exemples.
3. **Conclusion** : donner son avis, faire un lien avec le thème.

Mots de liaison utiles : *first, then, moreover, however, finally.*

## 5. Conseils pour le jour J
- Parle **lentement** et **fort** ; soigne la **prononciation**.
- Ne récite pas par cœur : garde seulement des **mots-clés**.
- Si tu bloques : *Sorry, let me rephrase… / How can I say…?*

## L'essentiel à retenir
- Présenter : *This document is… / It shows… / It is about…*
- Décrire une image : *in the foreground, in the background, on the left/right*.
- Donner son avis : *I think that…, In my opinion…, because…*
- Structure : **introduction → développement → conclusion**, avec des mots de liaison.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'anglais'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Le passif', $json${
      "centre": "Le passif",
      "branches": [
        { "titre": "Formation", "enfants": ["be + participe passé", "be porte le temps", "English is spoken here."] },
        { "titre": "Actif → passif", "enfants": ["Le COD devient sujet", "Auteur introduit par by", "This play was written by Shakespeare."] },
        { "titre": "À tous les temps", "enfants": ["is cleaned (présent)", "was cleaned (prétérit)", "will be cleaned (futur)"] },
        { "titre": "Quand l'employer", "enfants": ["Auteur inconnu (My bike was stolen)", "Auteur évident ou sans importance", "Style formel / scientifique"] }
      ]
    }$json$),
    ('Les modaux : conseils et obligation', $json${
      "centre": "Les modaux",
      "branches": [
        { "titre": "Règles de base", "enfants": ["Invariables (pas de -s)", "Suivis de la base verbale", "Sans to : you should go"] },
        { "titre": "Obligation", "enfants": ["must : venue de soi", "have to : règle extérieure", "You must wear a helmet."] },
        { "titre": "Interdit ≠ pas obligatoire", "enfants": ["mustn't = interdit", "don't have to = pas obligatoire", "Piège classique !"] },
        { "titre": "Conseil et capacité", "enfants": ["should = conseil", "can = capacité / permission", "could = passé de can"] }
      ]
    }$json$),
    ('Present perfect vs prétérit', $json${
      "centre": "Present perfect vs prétérit",
      "branches": [
        { "titre": "Prétérit", "enfants": ["Passé terminé et daté", "yesterday, ago, in 2019", "I saw the film yesterday."] },
        { "titre": "Present perfect", "enfants": ["have/has + participe passé", "Lien avec le présent", "She has lost her keys."] },
        { "titre": "Les marqueurs", "enfants": ["when → prétérit", "already, yet → present perfect", "for, since → present perfect"] },
        { "titre": "For et since", "enfants": ["for + durée (five years)", "since + point de départ (2019)", "just = venir de"] }
      ]
    }$json$),
    ('Le monde du travail', $json${
      "centre": "Le monde du travail",
      "branches": [
        { "titre": "Les métiers", "enfants": ["a nurse, a doctor", "an engineer, a firefighter", "She works as a mechanic."] },
        { "titre": "Le lieu de travail", "enfants": ["a company, an office", "a factory", "employer / employee / boss"] },
        { "titre": "Le travail des jeunes", "enfants": ["a summer job", "an internship (stage)", "to earn pocket money"] },
        { "titre": "Parler de ses projets", "enfants": ["would like to be…", "want to work abroad", "going to study medicine"] }
      ]
    }$json$),
    ('Préparer l''épreuve orale', $json${
      "centre": "Préparer l'épreuve orale",
      "branches": [
        { "titre": "Présenter un document", "enfants": ["This document is a photo.", "It shows… / It is about…", "It was taken from…"] },
        { "titre": "Décrire une image", "enfants": ["in the foreground / background", "on the left / right / middle", "There is… / There are…"] },
        { "titre": "Donner son avis", "enfants": ["I think that… / In my opinion…", "interesting because…", "I like / I don't like…"] },
        { "titre": "Structurer et réussir", "enfants": ["Intro → développement → conclusion", "Mots de liaison (however, finally)", "Parler lentement et fort"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'anglais'
 WHERE c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Anglais', '3e', v.chapter, true, l.id
FROM (VALUES
  ('11619999-0000-4000-8000-000000000001'::uuid, 'Le passif'),
  ('11619999-0000-4000-8000-000000000002'::uuid, 'Les modaux : conseils et obligation'),
  ('11619999-0000-4000-8000-000000000003'::uuid, 'Present perfect vs prétérit'),
  ('11619999-0000-4000-8000-000000000004'::uuid, 'Le monde du travail'),
  ('11619999-0000-4000-8000-000000000005'::uuid, 'Préparer l''épreuve orale')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'anglais'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
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
  -- Chapitre 1 — Le passif
  ('11610000-0000-4000-8000-000000000104'::uuid, 'Le passif',
   'Comment forme-t-on le passif en anglais ?', 'mcq',
   '["be + participe passé", "have + participe passé", "be + base verbale + -ing", "do + base verbale"]', 0,
   'Le passif = be (au bon temps) + participe passé du verbe : English is spoken here.', 4),
  ('11610000-0000-4000-8000-000000000105'::uuid, 'Le passif',
   'Mets au passif : « Shakespeare wrote this play. »', 'mcq',
   '["This play was written by Shakespeare.", "This play is written by Shakespeare.", "This play was wrote by Shakespeare.", "This play has write by Shakespeare."]', 0,
   'Le COD (this play) devient sujet, be au prétérit + participe passé (written), auteur avec by.', 5),
  ('11610000-0000-4000-8000-000000000106'::uuid, 'Le passif',
   'Quel est le participe passé du verbe « take » ?', 'mcq',
   '["taken", "took", "taked", "taking"]', 0,
   'take est irrégulier : take / took / taken. Au passif on utilise la 3e colonne : taken.', 6),
  ('11610000-0000-4000-8000-000000000107'::uuid, 'Le passif',
   'Au passif, c''est le verbe « be » qui porte le temps.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Exact : be se conjugue (is/was/will be…) tandis que le participe passé ne change pas.', 7),
  ('11610000-0000-4000-8000-000000000108'::uuid, 'Le passif',
   'Complète : « The room ___ cleaned yesterday. »', 'mcq',
   '["was", "is", "has", "will be"]', 0,
   'yesterday = passé daté → prétérit passif : was cleaned.', 8),
  ('11610000-0000-4000-8000-000000000109'::uuid, 'Le passif',
   'Par quel mot introduit-on l''auteur de l''action au passif ?', 'mcq',
   '["by", "with", "from", "of"]', 0,
   'L''agent (celui qui fait l''action) est introduit par by : written by Shakespeare.', 9),
  ('11610000-0000-4000-8000-000000000110'::uuid, 'Le passif',
   '« My bike was stolen. » s''emploie bien quand on ignore qui a fait l''action.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'On choisit le passif justement parce que l''auteur du vol est inconnu.', 10),

  -- Chapitre 2 — Les modaux : conseils et obligation
  ('11610000-0000-4000-8000-000000000204'::uuid, 'Les modaux : conseils et obligation',
   'Quel modal utilise-t-on pour donner un conseil ?', 'mcq',
   '["should", "must", "can", "have to"]', 0,
   'should (« devrait ») sert à donner un conseil : You should revise.', 4),
  ('11610000-0000-4000-8000-000000000205'::uuid, 'Les modaux : conseils et obligation',
   'Complète : « You ___ smoke here, it''s forbidden. »', 'mcq',
   '["mustn''t", "don''t have to", "should", "can"]', 0,
   'mustn''t exprime une interdiction : c''est interdit de fumer.', 5),
  ('11610000-0000-4000-8000-000000000206'::uuid, 'Les modaux : conseils et obligation',
   '« You don''t have to come » veut dire « tu n''as pas le droit de venir ».', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : don''t have to = ce n''est pas obligatoire (mais tu peux venir). L''interdiction, c''est mustn''t.', 6),
  ('11610000-0000-4000-8000-000000000207'::uuid, 'Les modaux : conseils et obligation',
   'Après un modal, le verbe se met : ', 'mcq',
   '["à la base verbale (sans to)", "à l''infinitif avec to", "au participe passé", "en -ing"]', 0,
   'Un modal est suivi de la base verbale sans to : You should go (pas « to go »).', 7),
  ('11610000-0000-4000-8000-000000000208'::uuid, 'Les modaux : conseils et obligation',
   'Quel est le passé du modal « can » ?', 'mcq',
   '["could", "canned", "caned", "will can"]', 0,
   'Le passé de can est could : She could read at four.', 8),
  ('11610000-0000-4000-8000-000000000209'::uuid, 'Les modaux : conseils et obligation',
   'Les modaux prennent un -s à la 3e personne du singulier (she cans).', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : les modaux sont invariables. On dit she can, jamais « she cans ».', 9),
  ('11610000-0000-4000-8000-000000000210'::uuid, 'Les modaux : conseils et obligation',
   '« I have to wear a uniform » exprime une obligation qui vient : ', 'mcq',
   '["d''une règle extérieure", "de mon envie personnelle", "d''une interdiction", "d''un conseil"]', 0,
   'have to marque une obligation imposée de l''extérieur (le règlement de l''école).', 10),

  -- Chapitre 3 — Present perfect vs prétérit
  ('11610000-0000-4000-8000-000000000304'::uuid, 'Present perfect vs prétérit',
   'Quel temps emploie-t-on avec « yesterday » ?', 'mcq',
   '["le prétérit", "le present perfect", "le présent simple", "le futur"]', 0,
   'yesterday indique un moment passé précis et daté → prétérit : I saw the film yesterday.', 4),
  ('11610000-0000-4000-8000-000000000305'::uuid, 'Present perfect vs prétérit',
   'Les marqueurs « already », « yet », « since » appellent : ', 'mcq',
   '["le present perfect", "le prétérit", "le présent en -ing", "l''impératif"]', 0,
   'Ces marqueurs relient l''action au présent → present perfect.', 5),
  ('11610000-0000-4000-8000-000000000306'::uuid, 'Present perfect vs prétérit',
   'Le present perfect se forme avec : ', 'mcq',
   '["have/has + participe passé", "be + participe passé", "did + base verbale", "was/were + -ing"]', 0,
   'Present perfect = have ou has + participe passé : She has lost her keys.', 6),
  ('11610000-0000-4000-8000-000000000307'::uuid, 'Present perfect vs prétérit',
   'On emploie « for » avec : ', 'mcq',
   '["une durée", "un point de départ", "une date précise", "un lieu"]', 0,
   'for + durée : for five years, for a week. (since + point de départ).', 7),
  ('11610000-0000-4000-8000-000000000308'::uuid, 'Present perfect vs prétérit',
   'On emploie « since » avec : ', 'mcq',
   '["un point de départ", "une durée", "un nombre d''objets", "un pays"]', 0,
   'since + point de départ : since 2019, since Monday.', 8),
  ('11610000-0000-4000-8000-000000000309'::uuid, 'Present perfect vs prétérit',
   'La question « When… ? » se construit normalement au present perfect.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : when demande un moment précis → on répond au prétérit, pas au present perfect.', 9),
  ('11610000-0000-4000-8000-000000000310'::uuid, 'Present perfect vs prétérit',
   'Que signifie « She has just arrived » ?', 'mcq',
   '["Elle vient d''arriver.", "Elle arrivera bientôt.", "Elle arrivait souvent.", "Elle est arrivée hier."]', 0,
   'have/has + just = venir de : l''arrivée est toute récente.', 10),

  -- Chapitre 4 — Le monde du travail
  ('11610000-0000-4000-8000-000000000404'::uuid, 'Le monde du travail',
   'Que veut dire « a nurse » ?', 'mcq',
   '["un(e) infirmier(ère)", "un(e) ingénieur(e)", "un(e) vendeur(euse)", "un(e) pompier(ère)"]', 0,
   'a nurse = un(e) infirmier(ère). (engineer = ingénieur, firefighter = pompier).', 4),
  ('11610000-0000-4000-8000-000000000405'::uuid, 'Le monde du travail',
   'Complète : « He works ___ a mechanic. »', 'mcq',
   '["as", "like", "for", "in"]', 0,
   'On dit to work as + métier : He works as a mechanic.', 5),
  ('11610000-0000-4000-8000-000000000406'::uuid, 'Le monde du travail',
   'Que signifie « an internship » ?', 'mcq',
   '["un stage", "un salaire", "un entretien", "une usine"]', 0,
   'an internship (ou work experience) = un stage en entreprise.', 6),
  ('11610000-0000-4000-8000-000000000407'::uuid, 'Le monde du travail',
   'Que veut dire « to earn money » ?', 'mcq',
   '["gagner de l''argent", "dépenser de l''argent", "emprunter de l''argent", "économiser"]', 0,
   'to earn money = gagner de l''argent (par son travail).', 7),
  ('11610000-0000-4000-8000-000000000408'::uuid, 'Le monde du travail',
   'Un « employer » est : ', 'mcq',
   '["un employeur", "un(e) salarié(e)", "un(e) collègue", "un bureau"]', 0,
   'employer = employeur ; employee = salarié(e). Attention à ne pas les confondre.', 8),
  ('11610000-0000-4000-8000-000000000409'::uuid, 'Le monde du travail',
   'Complète : « I would like ___ be a vet. »', 'mcq',
   '["to", "-", "for", "at"]', 0,
   'would like est suivi de to + base verbale : I would like to be a vet.', 9),
  ('11610000-0000-4000-8000-000000000410'::uuid, 'Le monde du travail',
   '« A summer job » désigne un petit boulot d''été.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Exact : a summer job = un job d''été, souvent pour gagner un peu d''argent.', 10),

  -- Chapitre 5 — Préparer l'épreuve orale
  ('11610000-0000-4000-8000-000000000504'::uuid, 'Préparer l''épreuve orale',
   'Pour dire de quoi parle un document, on emploie : ', 'mcq',
   '["It is about…", "It was taken…", "There is…", "On the left…"]', 0,
   'It is about… annonce le sujet du document.', 4),
  ('11610000-0000-4000-8000-000000000505'::uuid, 'Préparer l''épreuve orale',
   'Que signifie « in the foreground » ?', 'mcq',
   '["au premier plan", "à l''arrière-plan", "à gauche", "au centre"]', 0,
   'in the foreground = au premier plan ; in the background = à l''arrière-plan.', 5),
  ('11610000-0000-4000-8000-000000000506'::uuid, 'Préparer l''épreuve orale',
   'Quelle expression sert à donner son avis ?', 'mcq',
   '["In my opinion…", "It shows…", "There are…", "It was taken from…"]', 0,
   'In my opinion… (ou I think that…) introduit un avis personnel.', 6),
  ('11610000-0000-4000-8000-000000000507'::uuid, 'Préparer l''épreuve orale',
   'Que veut dire « on the left » ?', 'mcq',
   '["à gauche", "à droite", "au fond", "devant"]', 0,
   'on the left = à gauche ; on the right = à droite.', 7),
  ('11610000-0000-4000-8000-000000000508'::uuid, 'Préparer l''épreuve orale',
   'Une bonne présentation suit le plan : introduction → développement → conclusion.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Exact : on présente le document, on le décrit/explique, puis on conclut par son avis.', 8),
  ('11610000-0000-4000-8000-000000000509'::uuid, 'Préparer l''épreuve orale',
   'Quel mot de liaison signifie « cependant / pourtant » ?', 'mcq',
   '["however", "moreover", "finally", "first"]', 0,
   'however = cependant/pourtant, pour nuancer ou opposer une idée.', 9),
  ('11610000-0000-4000-8000-000000000510'::uuid, 'Préparer l''épreuve orale',
   'Que signifie « in the background » ?', 'mcq',
   '["à l''arrière-plan", "au premier plan", "à droite", "en haut"]', 0,
   'in the background = à l''arrière-plan (le fond de l''image).', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'anglais'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 4. EXERCICES TYPES — lessons.content de « Exercices types » (position 2).
--    Même jointure que la section 1, mais sur la leçon 'Exercices types'.
--    Garde IS DISTINCT FROM pour rester idempotent.
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Le passif', $md$# Exercices — Le passif

## Exercice 1 — Mettre au passif
Transforme ces phrases actives en phrases passives (garde le même temps).
1. *The teacher corrects the tests.*
2. *Somebody stole my phone.*
3. *They will build a new stadium.*
4. *Millions of people watch this show.*

## Exercice 2 — Compléter au bon temps
Complète avec le verbe **be** au bon temps + le participe passé du verbe entre parenthèses.
1. This book (write) ___ by a famous author in 1998.
2. English (speak) ___ in many countries today.
3. The letters (send) ___ tomorrow.

### Correction

**Exercice 1**
1. *The tests are corrected (by the teacher).* → présent passif.
2. *My phone was stolen.* → prétérit passif (on omet « by somebody »).
3. *A new stadium will be built.* → futur passif.
4. *This show is watched by millions of people.* → présent passif.

**Exercice 2**
1. *was written* — action datée (1998) → prétérit passif.
2. *is spoken* — vérité générale → présent passif.
3. *will be sent* — action à venir → futur passif.$md$),

    ('Les modaux : conseils et obligation', $md$# Exercices — Les modaux : conseils et obligation

## Exercice 1 — Le bon modal
Complète avec **must**, **mustn't**, **should** ou **don't have to**.
1. You look tired, you ___ go to bed early. *(conseil)*
2. You ___ use your phone during the exam. *(interdit)*
3. It's Sunday, we ___ get up early. *(pas obligatoire)*
4. Passengers ___ wear a seatbelt. *(obligation)*

## Exercice 2 — Corriger l'erreur
Chaque phrase contient une erreur de modal. Réécris-la correctement.
1. *She cans swim very well.*
2. *You should to revise tonight.*
3. *He must to finish his homework.*

### Correction

**Exercice 1**
1. *should* — c'est un conseil.
2. *mustn't* — c'est une interdiction.
3. *don't have to* — ce n'est pas obligatoire.
4. *must* — c'est une obligation.

**Exercice 2**
1. *She can swim very well.* — un modal est invariable, jamais de -s.
2. *You should revise tonight.* — pas de *to* après un modal.
3. *He must finish his homework.* — base verbale sans *to*.$md$),

    ('Present perfect vs prétérit', $md$# Exercices — Present perfect vs prétérit

## Exercice 1 — Choisir le temps
Prétérit ou present perfect ? Conjugue le verbe entre parenthèses.
1. I (see) ___ this film yesterday.
2. She (never / visit) ___ London.
3. We (live) ___ here since 2018.
4. They (win) ___ the match last week.

## Exercice 2 — For ou since ?
Complète avec **for** ou **since**.
1. I have known him ___ five years.
2. She has been ill ___ Monday.
3. We have studied English ___ 2015.

### Correction

**Exercice 1**
1. *saw* — *yesterday* = passé daté → prétérit.
2. *has never visited* — *never* + lien présent → present perfect.
3. *have lived* — *since* → present perfect.
4. *won* — *last week* = passé daté → prétérit.

**Exercice 2**
1. *for* — cinq ans = une durée.
2. *since* — Monday = un point de départ.
3. *since* — 2015 = un point de départ.$md$),

    ('Le monde du travail', $md$# Exercices — Le monde du travail

## Exercice 1 — Vocabulaire des métiers
Associe chaque métier anglais à sa traduction.
1. a nurse
2. an engineer
3. a firefighter
4. a shop assistant

a. un(e) ingénieur(e)
b. un(e) infirmier(ère)
c. un(e) vendeur(euse)
d. un(e) pompier(ère)

## Exercice 2 — Compléter le dialogue
Complète avec : *as, would like, internship, earn*.
1. Next summer I want to do an ___ in a hospital.
2. My brother works ___ a mechanic.
3. I ___ to be a vet one day.
4. I babysit to ___ some pocket money.

### Correction

**Exercice 1**
1 → b (a nurse = infirmier/ère) ; 2 → a (engineer = ingénieur) ; 3 → d (firefighter = pompier) ; 4 → c (shop assistant = vendeur/euse).

**Exercice 2**
1. *internship* — un stage.
2. *as* — *to work as* + métier.
3. *would like* — *would like to* + base verbale.
4. *earn* — *to earn money*.$md$),

    ('Préparer l''épreuve orale', $md$# Exercices — Préparer l'épreuve orale

## Exercice 1 — Présenter un document
Remets ces amorces dans l'ordre logique d'une présentation (introduction → avis).
a. *In my opinion, this photo shows a real problem.*
b. *This document is a photo.*
c. *It is about pollution in big cities.*
d. *In the foreground, there is a river full of rubbish.*

## Exercice 2 — La bonne expression
Choisis l'expression qui convient.
1. Pour situer au premier plan : *in the background / in the foreground*.
2. Pour donner ton avis : *It was taken from / I think that*.
3. Pour annoncer le sujet : *It is about / on the left*.

### Correction

**Exercice 1**
Ordre logique : **b → c → d → a**
- (b) on présente la **nature** du document ;
- (c) on annonce le **sujet** ;
- (d) on **décrit** l'image ;
- (a) on donne son **avis**.

**Exercice 2**
1. *in the foreground* — au premier plan.
2. *I think that* — pour donner un avis.
3. *It is about* — pour annoncer le sujet.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'anglais'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '3e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'Exercices types'
   AND l.content IS DISTINCT FROM v.md;
