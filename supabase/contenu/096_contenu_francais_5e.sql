-- =============================================================================
-- Studuel — Migration 096 : CONTENU Français 5e (cours + carte mentale + quiz)
-- Remplit les 5 chapitres de Français 5e (programme cycle 4, Éduscol) :
--   1. Cours       → lessons.content de « L'essentiel du cours » (remplace le
--                    placeholder éventuel)
--   2. Carte mentale → chapters.mind_map (JSON {centre, branches:[{titre,enfants}]})
--   3. Quiz        → complète le quiz de la leçon. Les questions sont attachées
--                    au quiz DE LA LEÇON via la jointure leçon→quiz (robuste à
--                    l'id existant), positions 4→10.
--
-- Motif idempotent (comme 090) : UPDATE joint sur la clé naturelle
-- (slug, niveau, chapitre[, leçon]), garde `IS DISTINCT FROM`, contenu en
-- dollar-quoting $md$/$json$ ; INSERT des questions avec UUID fixes + garde
-- anti-doublon (ON CONFLICT). Filet : crée le quiz s'il manque. Réexécutable.
--
-- PRÉREQUIS : les migrations qui créent subjects/chapters/lessons de Français 5e,
-- la colonne chapters.mind_map (029) et la table quizzes (002).
-- À exécuter à la main dans : Supabase Dashboard → SQL Editor → New query → Run.
-- Idempotent.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. COURS — lessons.content de « L'essentiel du cours » (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.lessons l
   SET content = v.md
  FROM (VALUES
    ('Le roman de chevalerie', $md$# Le roman de chevalerie

## Ce que tu vas comprendre
Au Moyen Âge, les romans de chevalerie racontent les aventures des **chevaliers**. Écrits d'abord en vers puis en prose, ils mettent en scène un **héros** courageux qui part en **quête** et défend de grandes **valeurs**. Ce chapitre t'apprend à reconnaître ce genre et ses codes.

## 1. Un genre né au Moyen Âge
Les premiers romans apparaissent au XIIe siècle. Le mot « roman » désigne d'abord une œuvre écrite en langue **romane** (le français ancien), et non plus en latin. Les plus célèbres racontent les aventures du roi **Arthur** et des chevaliers de la **Table ronde**, comme **Lancelot**, **Perceval** ou **Yvain** (écrits par Chrétien de Troyes).

## 2. Le héros chevalier
Le héros est un **chevalier** : un guerrier à cheval, armé d'une épée et d'une lance, protégé par une armure et un bouclier (l'**écu**). Il est souvent **jeune**, **noble** et cherche à prouver sa valeur. Au début du récit, il n'est parfois qu'un chevalier inconnu ; les épreuves vont le révéler.

## 3. Les valeurs chevaleresques
Le chevalier obéit à un **code d'honneur**. Il doit être :
- **courageux** au combat, sans jamais fuir ;
- **loyal** envers son seigneur (la **fidélité**) ;
- **généreux** et protecteur des **faibles**, des femmes et des pauvres ;
- **courtois**, c'est-à-dire respectueux et raffiné, en particulier envers la dame qu'il aime (l'**amour courtois**).

## 4. La quête et les épreuves
Le récit s'organise autour d'une **quête** : le héros part accomplir une mission (délivrer un prisonnier, retrouver un objet sacré comme le **Graal**, secourir une demoiselle). Sur sa route, il affronte des **épreuves** : combats contre des chevaliers ennemis, des géants ou des créatures. Le **merveilleux** est souvent présent (enchanteurs comme Merlin, fées, objets magiques).

## 5. Un modèle à transmettre
Le roman de chevalerie ne cherche pas seulement à distraire : il propose un **modèle** de conduite. En admirant le héros, le lecteur apprend le courage, l'honneur et la fidélité.

## L'essentiel à retenir
- Le roman de chevalerie naît au **Moyen Âge** (XIIe siècle) et raconte les aventures des **chevaliers** (Arthur, Table ronde).
- Le héros est un **chevalier** courageux qui cherche à prouver sa valeur.
- Il suit un **code d'honneur** : courage, loyauté, générosité, courtoisie.
- Le récit repose sur une **quête** semée d'**épreuves**, souvent teintée de **merveilleux**.$md$),

    ('Voyages et découvertes', $md$# Voyages et découvertes

## Ce que tu vas comprendre
Depuis toujours, les hommes racontent leurs **voyages**. Ces récits font découvrir des pays lointains, des peuples et des paysages nouveaux : c'est la rencontre avec l'**ailleurs**. Ce chapitre t'apprend à lire un récit de voyage et à comprendre ce qu'il apporte.

## 1. Qu'est-ce qu'un récit de voyage ?
Un **récit de voyage** raconte un déplacement, réel ou imaginaire, vers des terres inconnues. Il peut prendre la forme d'un **journal de bord**, de **lettres**, de **carnets** ou d'un roman. L'auteur y décrit ce qu'il voit, ce qu'il ressent et les gens qu'il rencontre.

## 2. Les grandes découvertes
À la **Renaissance** (XVe-XVIe siècles), les explorateurs européens partent sur les mers : **Christophe Colomb** atteint l'Amérique en 1492, **Magellan** organise le premier tour du monde. Ces expéditions nourrissent de nombreux récits qui font rêver les lecteurs restés au pays.

## 3. La découverte de l'ailleurs
Le voyageur découvre un monde **différent** du sien : climat, animaux, plantes, coutumes. Pour le décrire, il compare souvent l'inconnu à ce qu'il connaît déjà. Le récit mêle l'**émerveillement** (la beauté des paysages) et parfois la **peur** de l'inconnu.

## 4. La rencontre avec l'autre
Le voyage est une rencontre avec des **peuples** aux modes de vie différents. Le regard porté sur l'autre peut être plein de **curiosité** et de respect, mais aussi de préjugés. Les meilleurs récits invitent à réfléchir : est-il vraiment « sauvage », celui qui vit autrement ? Le voyage nous apprend aussi à mieux nous **connaître nous-mêmes**.

## 5. Décrire pour faire voir
Pour partager sa découverte, le voyageur utilise la **description**. Il emploie un vocabulaire précis des sens (couleurs, sons, odeurs) et des **comparaisons** pour que le lecteur imagine ce qu'il n'a jamais vu.

## L'essentiel à retenir
- Le **récit de voyage** raconte la découverte de terres et de peuples inconnus (l'**ailleurs**).
- Les **grandes découvertes** de la Renaissance ont nourri ces récits.
- Le voyageur mêle **émerveillement** et étonnement face au monde nouveau.
- La **rencontre avec l'autre** invite à la curiosité et à mieux se connaître soi-même.$md$),

    ('Théâtre : la comédie', $md$# Le théâtre : la comédie

## Ce que tu vas comprendre
La **comédie** est une pièce de théâtre qui cherche à **faire rire** tout en montrant les défauts des hommes. Ce chapitre t'apprend à reconnaître les ressorts du comique et les personnages types de la comédie.

## 1. Le théâtre : un texte fait pour être joué
Une pièce de théâtre est écrite pour être **jouée** devant un public. Le texte est fait de **répliques** (ce que disent les personnages) et de **didascalies** (les indications de mise en scène, en italique : gestes, décor, ton). L'histoire est découpée en **actes**, eux-mêmes divisés en **scènes**.

## 2. Comédie et tragédie
On distingue deux grands genres. La **tragédie** met en scène des personnages nobles dans une histoire grave qui finit mal. La **comédie**, elle, met en scène des personnages ordinaires, cherche à **faire rire** et se termine **bien** (souvent par un mariage). Le grand auteur de comédies au XVIIe siècle est **Molière**.

## 3. Les ressorts du comique
Pour faire rire, l'auteur utilise plusieurs procédés :
- le **comique de mots** : jeux de mots, répétitions, exagérations ;
- le **comique de gestes** : coups de bâton, chutes, grimaces, poursuites ;
- le **comique de situation** : quiproquos (un malentendu), personnage caché qui écoute, rebondissements ;
- le **comique de caractère** : un défaut poussé à l'extrême (l'avare, le menteur).

## 4. Les personnages types
La comédie reprend des personnages que le public reconnaît : le **valet** rusé qui mène l'intrigue, les **jeunes amoureux** qu'on veut empêcher de se marier, le **barbon** (vieil homme autoritaire, souvent le père), et le personnage dominé par un **défaut** (l'avare, le malade imaginaire).

## 5. Rire et corriger les défauts
En riant d'un personnage ridicule, le spectateur réfléchit à ses propres défauts. On dit que la comédie « corrige les mœurs par le rire » : elle fait rire pour faire réfléchir.

## L'essentiel à retenir
- Le texte de théâtre est fait de **répliques** et de **didascalies**, découpé en **actes** et **scènes**.
- La **comédie** cherche à **faire rire** et finit bien, contrairement à la **tragédie**.
- Le rire naît de quatre ressorts : **mots**, **gestes**, **situation**, **caractère**.
- Elle met en scène des **personnages types** et corrige les défauts par le rire.$md$),

    ('Les compléments de phrase', $md$# Les compléments de phrase

## Ce que tu vas comprendre
Dans une phrase, certains mots ne sont pas indispensables mais apportent des **précisions** : quand, où, comment se passe l'action. Ce sont les **compléments de phrase** (aussi appelés compléments **circonstanciels**). Ce chapitre t'apprend à les reconnaître.

## 1. Les deux sortes de compléments
Il faut distinguer :
- le **complément de verbe** (comme le COD ou le COI), qui dépend du verbe et ne peut ni se déplacer ni disparaître ;
- le **complément de phrase**, qui complète toute la phrase, se **déplace** et se **supprime** facilement.

*Exemple : « Léa lit **un livre** **le soir**. » → **un livre** = complément du verbe ; **le soir** = complément de phrase.*

## 2. Deux propriétés : déplaçable et supprimable
Le complément de phrase a deux caractéristiques :
- il est **supprimable** : « Léa lit le soir. » → « Léa lit. » (la phrase reste correcte) ;
- il est **déplaçable** : « **Le soir**, Léa lit. » (on peut le mettre en tête de phrase).

Ces deux tests permettent de le **reconnaître** à coup sûr.

## 3. Les principales circonstances
Le complément de phrase répond à des questions sur les **circonstances** de l'action :
- **temps** (quand ?) : « **Demain**, nous partons. »
- **lieu** (où ?) : « Je t'attends **devant l'école**. »
- **manière** (comment ?) : « Il répond **avec calme**. »
- **cause** (pourquoi ?) : « Le match est annulé **à cause de la pluie**. »

## 4. Sous quelle forme ?
Un complément de phrase peut être :
- un **groupe nominal** : « **La nuit**, tout dort. »
- un **adverbe** : « **Hier**, il a plu. »
- un **groupe prépositionnel** (avec préposition) : « Il court **dans le parc**. »

## L'essentiel à retenir
- Le **complément de phrase** (circonstanciel) précise les **circonstances** de l'action.
- Il est **déplaçable** et **supprimable** : ce sont les deux tests pour le reconnaître.
- Il indique surtout le **temps**, le **lieu**, la **manière** ou la **cause**.
- Il peut être un groupe nominal, un adverbe ou un groupe prépositionnel.$md$),

    ('Conjugaison : passé simple', $md$# La conjugaison du passé simple

## Ce que tu vas comprendre
Le **passé simple** est le temps du **récit** au passé. On le rencontre surtout à l'écrit, dans les contes, les romans et les récits historiques. Ce chapitre t'apprend ses valeurs et sa conjugaison aux trois groupes.

## 1. Les valeurs du passé simple
Le passé simple exprime une **action passée**, achevée, souvent **brève**, qui fait **avancer le récit**. On l'emploie très souvent avec l'**imparfait** : l'imparfait plante le décor (l'arrière-plan), le passé simple raconte les actions qui surviennent (le premier plan).

*Exemple : « Il **dormait** (imparfait, décor) quand un bruit le **réveilla** (passé simple, action). »*

## 2. Le 1er groupe (verbes en -er)
Terminaisons : **-ai, -as, -a, -âmes, -âtes, -èrent**.
*Chanter : je chantai, tu chantas, il chanta, nous chantâmes, vous chantâtes, ils chantèrent.*

## 3. Le 2e groupe (verbes en -ir comme finir)
Terminaisons : **-is, -is, -it, -îmes, -îtes, -irent**.
*Finir : je finis, tu finis, il finit, nous finîmes, vous finîtes, ils finirent.*

## 4. Le 3e groupe
Les terminaisons suivent trois séries selon le verbe :
- en **-is** : « il prit », « il fit », « il vit » ;
- en **-us** : « il courut », « il voulut », « il put » ;
- en **-ins** : pour *venir* et *tenir* : « il vint », « il tint ».

Attention aux verbes très fréquents : **être** → « il fut » ; **avoir** → « il eut » ; **aller** → « il alla ».

## 5. Ne pas confondre
À la 3e personne du singulier du 1er groupe, on écrit **-a** (« il chanta »), à ne pas confondre avec le présent **-e** (« il chante »). Pense aussi à l'accent circonflexe sur « nous » et « vous » : chantâmes, chantâtes.

## L'essentiel à retenir
- Le **passé simple** est le temps du **récit** écrit : actions brèves qui font avancer l'histoire.
- Il s'associe à l'**imparfait** (décor / action).
- 1er groupe : **-ai, -as, -a, -âmes, -âtes, -èrent** ; 2e groupe : **-is… -irent**.
- 3e groupe : séries en **-is**, **-us**, **-ins** (il prit, il courut, il vint) ; être → il fut, avoir → il eut.$md$)
  ) AS v(chapter, md)
  JOIN public.subjects s ON s.slug = 'francais'
  JOIN public.chapters c ON c.subject_id = s.id AND c.level = '5e' AND c.title = v.chapter
 WHERE l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
   AND l.content IS DISTINCT FROM v.md;

-- -----------------------------------------------------------------------------
-- 2. CARTES MENTALES — chapters.mind_map (5 chapitres)
-- -----------------------------------------------------------------------------
UPDATE public.chapters c
   SET mind_map = v.json::jsonb
  FROM (VALUES
    ('Le roman de chevalerie', $json${
      "centre": "Le roman de chevalerie",
      "branches": [
        { "titre": "Un genre médiéval", "enfants": ["Né au XIIe siècle", "Le roi Arthur", "Table ronde, Chrétien de Troyes"] },
        { "titre": "Le héros chevalier", "enfants": ["Guerrier à cheval, épée", "Noble et courageux", "Doit prouver sa valeur"] },
        { "titre": "Les valeurs", "enfants": ["Courage et loyauté", "Générosité, protège les faibles", "Courtoisie, amour courtois"] },
        { "titre": "La quête", "enfants": ["Mission à accomplir (le Graal)", "Épreuves et combats", "Merveilleux : Merlin, fées"] }
      ]
    }$json$),
    ('Voyages et découvertes', $json${
      "centre": "Voyages et découvertes",
      "branches": [
        { "titre": "Le récit de voyage", "enfants": ["Journal de bord, lettres", "Déplacement réel ou imaginaire", "Décrit ce que l'on voit"] },
        { "titre": "Les grandes découvertes", "enfants": ["Renaissance, XVe-XVIe s.", "Colomb, l'Amérique en 1492", "Magellan, tour du monde"] },
        { "titre": "L'ailleurs", "enfants": ["Un monde différent", "Émerveillement et étonnement", "Comparer l'inconnu au connu"] },
        { "titre": "La rencontre", "enfants": ["Peuples et coutumes", "Curiosité ou préjugés", "Mieux se connaître soi-même"] }
      ]
    }$json$),
    ('Théâtre : la comédie', $json${
      "centre": "Le théâtre : la comédie",
      "branches": [
        { "titre": "Le texte de théâtre", "enfants": ["Répliques et didascalies", "Actes et scènes", "Écrit pour être joué"] },
        { "titre": "Comédie et tragédie", "enfants": ["La comédie fait rire", "Elle finit bien", "Molière, XVIIe siècle"] },
        { "titre": "Les ressorts du comique", "enfants": ["Mots et gestes", "Situation : le quiproquo", "Caractère : un défaut"] },
        { "titre": "Personnages types", "enfants": ["Le valet rusé", "Les jeunes amoureux", "Le barbon, l'avare"] }
      ]
    }$json$),
    ('Les compléments de phrase', $json${
      "centre": "Les compléments de phrase",
      "branches": [
        { "titre": "Deux sortes", "enfants": ["Complément du verbe (COD)", "Complément de phrase", "Ne pas confondre"] },
        { "titre": "Deux propriétés", "enfants": ["Supprimable", "Déplaçable", "Les deux tests"] },
        { "titre": "Les circonstances", "enfants": ["Temps (quand ?)", "Lieu (où ?)", "Manière, cause"] },
        { "titre": "Les formes", "enfants": ["Groupe nominal : la nuit", "Adverbe : hier", "Groupe prépositionnel"] }
      ]
    }$json$),
    ('Conjugaison : passé simple', $json${
      "centre": "Le passé simple",
      "branches": [
        { "titre": "Ses valeurs", "enfants": ["Temps du récit écrit", "Action brève et achevée", "Fait avancer l'histoire"] },
        { "titre": "Avec l'imparfait", "enfants": ["Imparfait = décor", "Passé simple = action", "Il dormait, il se réveilla"] },
        { "titre": "1er et 2e groupes", "enfants": ["-ai, -as, -a, -èrent", "-is, -it, -irent", "il chanta, il finit"] },
        { "titre": "3e groupe", "enfants": ["-is : il prit, il fit", "-us : il courut, il put", "être → il fut, avoir → il eut"] }
      ]
    }$json$)
  ) AS v(chapter, json)
  JOIN public.subjects s ON s.slug = 'francais'
 WHERE c.subject_id = s.id AND c.level = '5e' AND c.title = v.chapter
   AND c.mind_map IS DISTINCT FROM v.json::jsonb;

-- -----------------------------------------------------------------------------
-- 3a. Filet de sécurité : crée le quiz de la leçon s'il n'en a pas déjà un.
--     (En temps normal les seeds de contenu 5e ont déjà créé les quiz ; ce bloc
--     ne fait rien si un quiz existe — garde NOT EXISTS.)
-- -----------------------------------------------------------------------------
INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.chapter, 'Français', '5e', v.chapter, true, l.id
FROM (VALUES
  ('09619999-0000-4000-8000-000000000001'::uuid, 'Le roman de chevalerie'),
  ('09619999-0000-4000-8000-000000000002'::uuid, 'Voyages et découvertes'),
  ('09619999-0000-4000-8000-000000000003'::uuid, 'Théâtre : la comédie'),
  ('09619999-0000-4000-8000-000000000004'::uuid, 'Les compléments de phrase'),
  ('09619999-0000-4000-8000-000000000005'::uuid, 'Conjugaison : passé simple')
) AS v(quiz_id, chapter)
JOIN public.subjects s ON s.slug = 'francais'
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
  -- Chapitre 1 — Le roman de chevalerie
  ('09610000-0000-4000-8000-000000000104'::uuid, 'Le roman de chevalerie',
   'À quelle époque naissent les romans de chevalerie ?', 'mcq',
   '["Au Moyen Âge", "À la Renaissance", "Au XXe siècle", "Dans l''Antiquité"]', 0,
   'Les romans de chevalerie naissent au Moyen Âge, au XIIe siècle.', 4),
  ('09610000-0000-4000-8000-000000000105'::uuid, 'Le roman de chevalerie',
   'Qui est le héros d''un roman de chevalerie ?', 'mcq',
   '["Un chevalier", "Un marchand", "Un roi paresseux", "Un simple paysan"]', 0,
   'Le héros est un chevalier, guerrier à cheval qui cherche à prouver sa valeur.', 5),
  ('09610000-0000-4000-8000-000000000106'::uuid, 'Le roman de chevalerie',
   'La loyauté envers son seigneur fait partie des valeurs du chevalier.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La loyauté (fidélité) envers son seigneur est une valeur essentielle du chevalier.', 6),
  ('09610000-0000-4000-8000-000000000107'::uuid, 'Le roman de chevalerie',
   'Comment appelle-t-on la mission que le héros part accomplir ?', 'mcq',
   '["La quête", "La ronde", "La rime", "La strophe"]', 0,
   'La quête est la mission que le héros part accomplir.', 7),
  ('09610000-0000-4000-8000-000000000108'::uuid, 'Le roman de chevalerie',
   'Quel roi rassemble les chevaliers de la Table ronde ?', 'mcq',
   '["Le roi Arthur", "Louis XIV", "Jules César", "Charlemagne"]', 0,
   'Le roi Arthur rassemble les chevaliers de la Table ronde.', 8),
  ('09610000-0000-4000-8000-000000000109'::uuid, 'Le roman de chevalerie',
   'Le merveilleux (enchanteurs, fées, objets magiques) est souvent présent dans ces romans.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Enchanteurs comme Merlin, fées et objets magiques : le merveilleux est fréquent.', 9),
  ('09610000-0000-4000-8000-000000000110'::uuid, 'Le roman de chevalerie',
   'Que désigne la « courtoisie » chez le chevalier ?', 'mcq',
   '["Un comportement respectueux et raffiné", "La peur du combat", "Le goût de l''argent", "L''art de monter à cheval"]', 0,
   'La courtoisie est un comportement respectueux et raffiné, surtout envers la dame aimée.', 10),

  -- Chapitre 2 — Voyages et découvertes
  ('09610000-0000-4000-8000-000000000204'::uuid, 'Voyages et découvertes',
   'Qu''est-ce qu''un récit de voyage ?', 'mcq',
   '["Un texte qui raconte la découverte de terres inconnues", "Une pièce de théâtre comique", "Un poème d''amour", "Une recette de cuisine"]', 0,
   'Le récit de voyage raconte la découverte de terres et de peuples inconnus.', 4),
  ('09610000-0000-4000-8000-000000000205'::uuid, 'Voyages et découvertes',
   'Quel explorateur atteint l''Amérique en 1492 ?', 'mcq',
   '["Christophe Colomb", "Molière", "Le roi Arthur", "Chrétien de Troyes"]', 0,
   'Christophe Colomb atteint l''Amérique en 1492.', 5),
  ('09610000-0000-4000-8000-000000000206'::uuid, 'Voyages et découvertes',
   'Sous quelle forme se présente souvent un récit de voyage ?', 'mcq',
   '["Un journal de bord", "Une facture", "Un bulletin de notes", "Une ordonnance"]', 0,
   'Il prend souvent la forme d''un journal de bord, de lettres ou de carnets.', 6),
  ('09610000-0000-4000-8000-000000000207'::uuid, 'Voyages et découvertes',
   'Le récit de voyage fait découvrir des peuples et des paysages nouveaux : c''est la rencontre avec l''ailleurs.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La découverte de l''ailleurs est au cœur du récit de voyage.', 7),
  ('09610000-0000-4000-8000-000000000208'::uuid, 'Voyages et découvertes',
   'À quelle époque ont lieu les grandes découvertes maritimes ?', 'mcq',
   '["À la Renaissance", "Au Moyen Âge", "Au XXIe siècle", "Dans la préhistoire"]', 0,
   'Les grandes découvertes ont lieu à la Renaissance (XVe-XVIe siècles).', 8),
  ('09610000-0000-4000-8000-000000000209'::uuid, 'Voyages et découvertes',
   'Pour décrire un pays inconnu, le voyageur le compare souvent...', 'mcq',
   '["à ce qu''il connaît déjà", "à rien du tout", "à un nombre", "à une équation"]', 0,
   'Pour se faire comprendre, le voyageur compare l''inconnu à ce qu''il connaît déjà.', 9),
  ('09610000-0000-4000-8000-000000000210'::uuid, 'Voyages et découvertes',
   'Découvrir d''autres peuples peut aussi aider à mieux se connaître soi-même.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'En rencontrant d''autres façons de vivre, on réfléchit aussi à soi-même.', 10),

  -- Chapitre 3 — Théâtre : la comédie
  ('09610000-0000-4000-8000-000000000304'::uuid, 'Théâtre : la comédie',
   'Comment appelle-t-on les indications de mise en scène (gestes, décor) ?', 'mcq',
   '["Les didascalies", "Les répliques", "Les strophes", "Les rimes"]', 0,
   'Les didascalies sont les indications de mise en scène (gestes, décor, ton).', 4),
  ('09610000-0000-4000-8000-000000000305'::uuid, 'Théâtre : la comédie',
   'Quel est le but principal de la comédie ?', 'mcq',
   '["Faire rire", "Faire peur", "Faire pleurer sur un destin tragique", "Endormir le public"]', 0,
   'La comédie cherche avant tout à faire rire.', 5),
  ('09610000-0000-4000-8000-000000000306'::uuid, 'Théâtre : la comédie',
   'Un quiproquo (un malentendu) est un exemple de comique...', 'mcq',
   '["de situation", "de mots", "de gestes", "de caractère"]', 0,
   'Le quiproquo, un malentendu entre personnages, relève du comique de situation.', 6),
  ('09610000-0000-4000-8000-000000000307'::uuid, 'Théâtre : la comédie',
   'Qui est le grand auteur de comédies du XVIIe siècle ?', 'mcq',
   '["Molière", "Christophe Colomb", "Chrétien de Troyes", "Magellan"]', 0,
   'Molière est le grand auteur de comédies du XVIIe siècle.', 7),
  ('09610000-0000-4000-8000-000000000308'::uuid, 'Théâtre : la comédie',
   'Contrairement à la tragédie, la comédie se termine généralement bien.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La comédie finit bien (souvent par un mariage), contrairement à la tragédie.', 8),
  ('09610000-0000-4000-8000-000000000309'::uuid, 'Théâtre : la comédie',
   'Comment nomme-t-on ce que disent les personnages sur scène ?', 'mcq',
   '["Les répliques", "Les didascalies", "Les actes", "Les décors"]', 0,
   'Les répliques sont les paroles échangées par les personnages.', 9),
  ('09610000-0000-4000-8000-000000000310'::uuid, 'Théâtre : la comédie',
   'Un défaut poussé à l''extrême, comme l''avarice, relève du comique de caractère.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Un défaut exagéré (l''avare, le menteur) est un comique de caractère.', 10),

  -- Chapitre 4 — Les compléments de phrase
  ('09610000-0000-4000-8000-000000000404'::uuid, 'Les compléments de phrase',
   'Quelles sont les deux propriétés du complément de phrase ?', 'mcq',
   '["Il est déplaçable et supprimable", "Il est obligatoire et fixe", "Il est toujours un verbe", "Il ne change jamais de place"]', 0,
   'Le complément de phrase se déplace et se supprime : ce sont ses deux tests.', 4),
  ('09610000-0000-4000-8000-000000000405'::uuid, 'Les compléments de phrase',
   'Dans « Le soir, Léa lit », quel est le complément de phrase ?', 'mcq',
   '["Le soir", "Léa", "lit", "Léa lit"]', 0,
   '« Le soir » complète toute la phrase et peut être déplacé ou supprimé.', 5),
  ('09610000-0000-4000-8000-000000000406'::uuid, 'Les compléments de phrase',
   '« Je t''attends devant l''école » : ce complément indique...', 'mcq',
   '["le lieu", "le temps", "la manière", "la cause"]', 0,
   '« Devant l''école » répond à la question « où ? » : c''est un complément de lieu.', 6),
  ('09610000-0000-4000-8000-000000000407'::uuid, 'Les compléments de phrase',
   '« Demain, nous partons » : le complément « Demain » indique...', 'mcq',
   '["le temps", "le lieu", "la manière", "la cause"]', 0,
   '« Demain » répond à « quand ? » : c''est un complément de temps.', 7),
  ('09610000-0000-4000-8000-000000000408'::uuid, 'Les compléments de phrase',
   'Un complément de phrase peut être supprimé sans rendre la phrase incorrecte.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'On peut le supprimer et la phrase reste correcte : « Léa lit ».', 8),
  ('09610000-0000-4000-8000-000000000409'::uuid, 'Les compléments de phrase',
   '« Il répond avec calme » : ce complément indique...', 'mcq',
   '["la manière", "le lieu", "le temps", "la cause"]', 0,
   '« Avec calme » répond à « comment ? » : c''est un complément de manière.', 9),
  ('09610000-0000-4000-8000-000000000410'::uuid, 'Les compléments de phrase',
   'Le complément de phrase peut se déplacer en tête de phrase.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Il est déplaçable : « Le soir, Léa lit ». C''est un de ses deux tests.', 10),

  -- Chapitre 5 — Conjugaison : passé simple
  ('09610000-0000-4000-8000-000000000504'::uuid, 'Conjugaison : passé simple',
   'Le passé simple est surtout le temps...', 'mcq',
   '["du récit écrit", "de la conversation courante", "du futur", "de l''ordre"]', 0,
   'Le passé simple est le temps du récit, surtout à l''écrit.', 4),
  ('09610000-0000-4000-8000-000000000505'::uuid, 'Conjugaison : passé simple',
   '« Chanter » à la 3e personne du singulier au passé simple donne...', 'mcq',
   '["il chanta", "il chante", "il chantait", "il chantera"]', 0,
   'Au passé simple : il chanta (présent : il chante ; imparfait : il chantait).', 5),
  ('09610000-0000-4000-8000-000000000506'::uuid, 'Conjugaison : passé simple',
   'Avec quel temps le passé simple est-il souvent associé pour planter le décor ?', 'mcq',
   '["L''imparfait", "Le futur", "Le présent", "Le conditionnel"]', 0,
   'L''imparfait plante le décor, le passé simple raconte les actions.', 6),
  ('09610000-0000-4000-8000-000000000507'::uuid, 'Conjugaison : passé simple',
   '« Finir » à « nous » au passé simple donne...', 'mcq',
   '["nous finîmes", "nous finissons", "nous finissions", "nous finirons"]', 0,
   'Au passé simple : nous finîmes (avec l''accent circonflexe).', 7),
  ('09610000-0000-4000-8000-000000000508'::uuid, 'Conjugaison : passé simple',
   '« Prendre » à la 3e personne du singulier au passé simple donne...', 'mcq',
   '["il prit", "il prend", "il prenait", "il prendra"]', 0,
   'Prendre est un verbe du 3e groupe : au passé simple, « il prit ».', 8),
  ('09610000-0000-4000-8000-000000000509'::uuid, 'Conjugaison : passé simple',
   'Le verbe « être » au passé simple, 3e personne du singulier, se conjugue « il fut ».', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Être au passé simple : je fus, tu fus, il fut, nous fûmes…', 9),
  ('09610000-0000-4000-8000-000000000510'::uuid, 'Conjugaison : passé simple',
   'Le passé simple exprime surtout des actions longues qui durent dans le passé.', 'true_false',
   '["Vrai", "Faux"]', 1,
   'Faux : le passé simple exprime des actions brèves et achevées ; c''est l''imparfait qui exprime la durée.', 10)
) AS d(id, chapter, question, kind, options, correct_index, explanation, position)
JOIN public.subjects s ON s.slug = 'francais'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = '5e' AND c.title = d.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
JOIN public.quizzes  q ON q.lesson_id = l.id
ON CONFLICT (id) DO NOTHING;
