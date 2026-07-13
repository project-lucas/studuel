-- =============================================================================
-- Studuel — Migration 033 : quiz de leçon, Français collège 6e·5e·4e·3e
--   (19 quiz, 57 questions — un quiz par chapitre sur « L'essentiel du cours »)
-- PRÉREQUIS : 002_quizzes.sql + 008_reviser.sql exécutés.
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run
-- Idempotent : UUID fixes + ON CONFLICT DO NOTHING + garde anti-doublon.
-- Rattachement : slug 'francais' → (niveau, titre chapitre) → « L'essentiel du
--   cours ». Le chapitre 6e « Conjugaison : présent et imparfait » a déjà son
--   quiz : la garde l'ignore, il n'est pas listé.
-- =============================================================================

INSERT INTO public.quizzes (id, title, subject, grade_level, chapter, is_free, lesson_id)
SELECT v.quiz_id, v.title, 'Français', v.level, v.chapter, true, l.id
FROM (VALUES
  -- 6e (Conjugaison présent/imparfait déjà couverte)
  ('03300000-0000-4000-8000-000000000061'::uuid, '6e', 'Le conte merveilleux',            'Le conte merveilleux'),
  ('03300000-0000-4000-8000-000000000062'::uuid, '6e', 'Récits d''aventures',            'Récits d''aventures'),
  ('03300000-0000-4000-8000-000000000063'::uuid, '6e', 'Poésie : jeux de langage',        'Poésie : jeux de langage'),
  ('03300000-0000-4000-8000-000000000064'::uuid, '6e', 'Le groupe nominal et ses accords','Le groupe nominal et ses accords'),
  -- 5e
  ('03300000-0000-4000-8000-000000000051'::uuid, '5e', 'Le roman de chevalerie',   'Le roman de chevalerie'),
  ('03300000-0000-4000-8000-000000000052'::uuid, '5e', 'Voyages et découvertes',   'Voyages et découvertes'),
  ('03300000-0000-4000-8000-000000000053'::uuid, '5e', 'Théâtre : la comédie',     'Théâtre : la comédie'),
  ('03300000-0000-4000-8000-000000000054'::uuid, '5e', 'Les compléments de phrase','Les compléments de phrase'),
  ('03300000-0000-4000-8000-000000000055'::uuid, '5e', 'Conjugaison : passé simple','Conjugaison : passé simple'),
  -- 4e
  ('03300000-0000-4000-8000-000000000041'::uuid, '4e', 'La lettre et l''épistolaire',     'La lettre et l''épistolaire'),
  ('03300000-0000-4000-8000-000000000042'::uuid, '4e', 'Le fantastique',                  'Le fantastique'),
  ('03300000-0000-4000-8000-000000000043'::uuid, '4e', 'La ville en poésie',              'La ville en poésie'),
  ('03300000-0000-4000-8000-000000000044'::uuid, '4e', 'Les propositions subordonnées',   'Les propositions subordonnées'),
  ('03300000-0000-4000-8000-000000000045'::uuid, '4e', 'Cause, conséquence et but',       'Cause, conséquence et but'),
  -- 3e
  ('03300000-0000-4000-8000-000000000031'::uuid, '3e', 'Se raconter : l''autobiographie',      'Se raconter : l''autobiographie'),
  ('03300000-0000-4000-8000-000000000032'::uuid, '3e', 'Dénoncer les travers de la société',   'Dénoncer les travers de la société'),
  ('03300000-0000-4000-8000-000000000033'::uuid, '3e', 'La poésie engagée',                    'La poésie engagée'),
  ('03300000-0000-4000-8000-000000000034'::uuid, '3e', 'Le discours rapporté',                 'Le discours rapporté'),
  ('03300000-0000-4000-8000-000000000035'::uuid, '3e', 'Préparer l''oral du brevet',           'Préparer l''oral du brevet')
) AS v(quiz_id, level, title, chapter)
JOIN public.subjects s ON s.slug = 'francais'
JOIN public.chapters c ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
JOIN public.lessons  l ON l.chapter_id = c.id AND l.title = 'L''essentiel du cours'
WHERE NOT EXISTS (SELECT 1 FROM public.quizzes q WHERE q.lesson_id = l.id)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.quiz_questions (id, quiz_id, question, kind, options, correct_index, explanation, position)
SELECT d.id, q.id, d.question, d.kind, d.options::jsonb, d.correct_index, d.explanation, d.position
FROM (VALUES
  -- ===== 6e =====
  -- 61 — Le conte merveilleux
  ('03310000-0000-4000-8000-000000000611'::uuid, '03300000-0000-4000-8000-000000000061'::uuid,
   'Par quelle formule commence souvent un conte merveilleux ?', 'mcq',
   '["Il était une fois", "En conclusion", "Cher ami", "Chapitre premier"]', 0,
   '« Il était une fois » est la formule d''ouverture traditionnelle du conte.', 1),
  ('03310000-0000-4000-8000-000000000612'::uuid, '03300000-0000-4000-8000-000000000061'::uuid,
   'Dans un conte, comment appelle-t-on un personnage qui aide le héros ?', 'mcq',
   '["un adjuvant", "un opposant", "un narrateur", "un destinataire"]', 0,
   'L''adjuvant aide le héros ; l''opposant, lui, cherche à le faire échouer.', 2),
  ('03310000-0000-4000-8000-000000000613'::uuid, '03300000-0000-4000-8000-000000000061'::uuid,
   'Dans un conte merveilleux, la magie et le surnaturel sont acceptés comme normaux.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Fées, ogres et sortilèges font partie du monde du conte sans étonner personne.', 3),

  -- 62 — Récits d'aventures
  ('03310000-0000-4000-8000-000000000621'::uuid, '03300000-0000-4000-8000-000000000062'::uuid,
   'Qu''est-ce qui caractérise le plus un récit d''aventures ?', 'mcq',
   '["de l''action et du suspense", "l''absence d''intrigue", "des tableaux de chiffres", "un ton uniquement triste"]', 0,
   'Péripéties, dangers et rebondissements en font le sel.', 1),
  ('03310000-0000-4000-8000-000000000622'::uuid, '03300000-0000-4000-8000-000000000062'::uuid,
   'Dans un récit au passé, quel temps exprime les actions brèves de premier plan ?', 'mcq',
   '["le passé simple", "le présent", "le conditionnel", "l''impératif"]', 0,
   'Le passé simple raconte les actions de premier plan ; l''imparfait décrit l''arrière-plan.', 2),
  ('03310000-0000-4000-8000-000000000623'::uuid, '03300000-0000-4000-8000-000000000062'::uuid,
   'Le héros d''un récit d''aventures affronte généralement des obstacles.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Les obstacles créent le suspense et font avancer l''intrigue.', 3),

  -- 63 — Poésie : jeux de langage
  ('03310000-0000-4000-8000-000000000631'::uuid, '03300000-0000-4000-8000-000000000063'::uuid,
   'Comment appelle-t-on la répétition d''un même son de consonne dans un vers ?', 'mcq',
   '["une allitération", "une métaphore", "une strophe", "une rime"]', 0,
   'L''allitération répète un son consonne ; l''assonance répète une voyelle.', 1),
  ('03310000-0000-4000-8000-000000000632'::uuid, '03300000-0000-4000-8000-000000000063'::uuid,
   'Comment nomme-t-on une strophe de quatre vers ?', 'mcq',
   '["un quatrain", "un tercet", "un distique", "un sonnet"]', 0,
   'Quatrain = 4 vers ; tercet = 3 vers ; distique = 2 vers.', 2),
  ('03310000-0000-4000-8000-000000000633'::uuid, '03300000-0000-4000-8000-000000000063'::uuid,
   'Deux vers qui se terminent par le même son forment une rime.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La rime est le retour d''un même son à la fin de deux vers ou plus.', 3),

  -- 64 — Le groupe nominal et ses accords
  ('03310000-0000-4000-8000-000000000641'::uuid, '03300000-0000-4000-8000-000000000064'::uuid,
   'Dans le groupe nominal « les petites maisons blanches », quel est le nom noyau ?', 'mcq',
   '["maisons", "petites", "blanches", "les"]', 0,
   'Le nom noyau est « maisons » ; les autres mots se rapportent à lui.', 1),
  ('03310000-0000-4000-8000-000000000642'::uuid, '03300000-0000-4000-8000-000000000064'::uuid,
   'Dans « des fleurs rouges », avec quoi l''adjectif « rouges » s''accorde-t-il ?', 'mcq',
   '["en genre et en nombre avec « fleurs »", "avec le verbe", "en personne", "avec rien"]', 0,
   'L''adjectif qualificatif s''accorde en genre et en nombre avec le nom.', 2),
  ('03310000-0000-4000-8000-000000000643'::uuid, '03300000-0000-4000-8000-000000000064'::uuid,
   'Dans un groupe nominal, le déterminant s''accorde avec le nom.', 'true_false',
   '["Vrai", "Faux"]', 0,
   '« le / la / les », « un / une / des » varient selon le genre et le nombre du nom.', 3),

  -- ===== 5e =====
  -- 51 — Le roman de chevalerie
  ('03310000-0000-4000-8000-000000000511'::uuid, '03300000-0000-4000-8000-000000000051'::uuid,
   'Quel idéal un chevalier du Moyen Âge devait-il respecter ?', 'mcq',
   '["la courtoisie", "la bureaucratie", "la publicité", "la démocratie"]', 0,
   'La courtoisie : honneur, bravoure, respect de la dame et du plus faible.', 1),
  ('03310000-0000-4000-8000-000000000512'::uuid, '03300000-0000-4000-8000-000000000051'::uuid,
   'Quel personnage est un célèbre chevalier de la Table ronde ?', 'mcq',
   '["Lancelot", "Ulysse", "Gavroche", "Harpagon"]', 0,
   'Lancelot est un chevalier des romans arthuriens (le roi Arthur).', 2),
  ('03310000-0000-4000-8000-000000000513'::uuid, '03300000-0000-4000-8000-000000000051'::uuid,
   'La quête, comme celle du Graal, est un motif fréquent du roman de chevalerie.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La quête (recherche d''un objet ou d''un idéal) structure de nombreux récits.', 3),

  -- 52 — Voyages et découvertes
  ('03310000-0000-4000-8000-000000000521'::uuid, '03300000-0000-4000-8000-000000000052'::uuid,
   'Que raconte le plus souvent un récit de voyage ?', 'mcq',
   '["la découverte de lieux et de peuples nouveaux", "une démonstration de maths", "une recette de cuisine", "un bulletin météo"]', 0,
   'Le voyageur décrit ce qu''il découvre et le fait partager.', 1),
  ('03310000-0000-4000-8000-000000000522'::uuid, '03300000-0000-4000-8000-000000000052'::uuid,
   'Un texte qui donne à voir précisément un lieu relève surtout de…', 'mcq',
   '["la description", "l''argumentation", "l''injonction", "la conjugaison"]', 0,
   'La description fait voir un lieu, un objet ou un personnage.', 2),
  ('03310000-0000-4000-8000-000000000523'::uuid, '03300000-0000-4000-8000-000000000052'::uuid,
   'Un récit de voyage peut mêler observations réelles et impressions personnelles.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''auteur rapporte des faits et livre en même temps son ressenti.', 3),

  -- 53 — Théâtre : la comédie
  ('03310000-0000-4000-8000-000000000531'::uuid, '03300000-0000-4000-8000-000000000053'::uuid,
   'Quel est le but principal d''une comédie ?', 'mcq',
   '["faire rire et corriger les mœurs", "faire pleurer", "enseigner les maths", "raconter une bataille"]', 0,
   'La comédie divertit tout en critiquant les défauts humains.', 1),
  ('03310000-0000-4000-8000-000000000532'::uuid, '03300000-0000-4000-8000-000000000053'::uuid,
   'Comment appelle-t-on les indications de mise en scène données par l''auteur ?', 'mcq',
   '["des didascalies", "des apartés", "des strophes", "des chapitres"]', 0,
   'Les didascalies précisent décors, gestes et tons (souvent en italique).', 2),
  ('03310000-0000-4000-8000-000000000533'::uuid, '03300000-0000-4000-8000-000000000053'::uuid,
   'Un aparté est une parole qu''un personnage dit sans être entendu des autres.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''aparté est dit « à part », comme pour le public seul.', 3),

  -- 54 — Les compléments de phrase
  ('03310000-0000-4000-8000-000000000541'::uuid, '03300000-0000-4000-8000-000000000054'::uuid,
   'Dans « Le soir, Léa lit dans sa chambre », quel est le complément de lieu ?', 'mcq',
   '["dans sa chambre", "Le soir", "Léa", "lit"]', 0,
   '« dans sa chambre » indique où ; « le soir » indique quand (complément de temps).', 1),
  ('03310000-0000-4000-8000-000000000542'::uuid, '03300000-0000-4000-8000-000000000054'::uuid,
   'En général, un complément circonstanciel peut être…', 'mcq',
   '["déplacé ou supprimé", "jamais déplacé", "toujours un verbe", "le noyau du groupe nominal"]', 0,
   'Le complément circonstanciel est mobile et souvent facultatif.', 2),
  ('03310000-0000-4000-8000-000000000543'::uuid, '03300000-0000-4000-8000-000000000054'::uuid,
   'Dans « Hier, il a plu », « Hier » est un complément circonstanciel de temps.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Il répond à la question « quand ? ».', 3),

  -- 55 — Conjugaison : passé simple
  ('03310000-0000-4000-8000-000000000551'::uuid, '03300000-0000-4000-8000-000000000055'::uuid,
   'Quelle est la forme correcte de « finir » à la 3ᵉ personne du singulier au passé simple ?', 'mcq',
   '["il finit", "il finissait", "il finira", "il finissa"]', 0,
   'Au passé simple, « finir » donne « il finit » (verbe du 2ᵉ groupe).', 1),
  ('03310000-0000-4000-8000-000000000552'::uuid, '03300000-0000-4000-8000-000000000055'::uuid,
   'Conjugué au passé simple, « ils (prendre) » donne…', 'mcq',
   '["ils prirent", "ils prenaient", "ils prendront", "ils prisent"]', 0,
   '« Prendre » fait « ils prirent » au passé simple.', 2),
  ('03310000-0000-4000-8000-000000000553'::uuid, '03300000-0000-4000-8000-000000000055'::uuid,
   'Le passé simple est surtout employé à l''écrit, dans les récits.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'À l''oral, on lui préfère le passé composé.', 3),

  -- ===== 4e =====
  -- 41 — La lettre et l'épistolaire
  ('03310000-0000-4000-8000-000000000411'::uuid, '03300000-0000-4000-8000-000000000041'::uuid,
   'Qu''est-ce qu''un roman épistolaire ?', 'mcq',
   '["un roman écrit sous forme de lettres", "un roman en vers", "un recueil de recettes", "un roman policier"]', 0,
   'L''intrigue progresse par l''échange de lettres entre les personnages.', 1),
  ('03310000-0000-4000-8000-000000000412'::uuid, '03300000-0000-4000-8000-000000000041'::uuid,
   'Dans une lettre, « Cher Paul » correspond à…', 'mcq',
   '["la formule d''appel", "la signature", "la date", "le post-scriptum"]', 0,
   'L''appel ouvre la lettre en s''adressant au destinataire.', 2),
  ('03310000-0000-4000-8000-000000000413'::uuid, '03300000-0000-4000-8000-000000000041'::uuid,
   'Dans une lettre, l''émetteur écrit et le destinataire reçoit.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'La lettre va de l''émetteur (l''expéditeur) vers le destinataire.', 3),

  -- 42 — Le fantastique
  ('03310000-0000-4000-8000-000000000421'::uuid, '03300000-0000-4000-8000-000000000042'::uuid,
   'Qu''est-ce qui caractérise le récit fantastique ?', 'mcq',
   '["l''hésitation entre explication rationnelle et surnaturelle", "l''absence de mystère", "un ton comique", "une démonstration scientifique"]', 0,
   'Le doute du personnage — et du lecteur — définit le fantastique.', 1),
  ('03310000-0000-4000-8000-000000000422'::uuid, '03300000-0000-4000-8000-000000000042'::uuid,
   'Contrairement au merveilleux, dans le fantastique le surnaturel…', 'mcq',
   '["fait peur et surprend", "est parfaitement normal", "n''existe jamais", "est toujours expliqué"]', 0,
   'Il surgit dans un monde réaliste et provoque l''inquiétude.', 2),
  ('03310000-0000-4000-8000-000000000423'::uuid, '03300000-0000-4000-8000-000000000042'::uuid,
   'Le fantastique s''installe souvent dans un cadre réaliste et quotidien.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'L''irruption de l''étrange y est d''autant plus troublante.', 3),

  -- 43 — La ville en poésie
  ('03310000-0000-4000-8000-000000000431'::uuid, '03300000-0000-4000-8000-000000000043'::uuid,
   'Quand un poète écrit « la ville dort », il utilise…', 'mcq',
   '["une personnification", "une addition", "une conjugaison", "une rime plate"]', 0,
   'On prête à la ville une action humaine (dormir) : c''est la personnification.', 1),
  ('03310000-0000-4000-8000-000000000432'::uuid, '03300000-0000-4000-8000-000000000043'::uuid,
   'Quel mot outil signale une comparaison ?', 'mcq',
   '["comme", "donc", "car", "et"]', 0,
   '« comme », « tel », « pareil à » introduisent une comparaison.', 2),
  ('03310000-0000-4000-8000-000000000433'::uuid, '03300000-0000-4000-8000-000000000043'::uuid,
   'Une métaphore est une comparaison sans mot de comparaison.', 'true_false',
   '["Vrai", "Faux"]', 0,
   '« Cette ville est une fourmilière » : le rapprochement est direct, sans « comme ».', 3),

  -- 44 — Les propositions subordonnées
  ('03310000-0000-4000-8000-000000000441'::uuid, '03300000-0000-4000-8000-000000000044'::uuid,
   'Dans « Je pense que tu as raison », par quel mot commence la subordonnée ?', 'mcq',
   '["que", "je", "pense", "raison"]', 0,
   '« que » introduit ici une proposition subordonnée complétive.', 1),
  ('03310000-0000-4000-8000-000000000442'::uuid, '03300000-0000-4000-8000-000000000044'::uuid,
   'Quels mots introduisent une proposition subordonnée relative ?', 'mcq',
   '["qui, que, dont, où", "et, ou, mais", "très, peu", "le, la, les"]', 0,
   'Les pronoms relatifs (qui, que, dont, où…) introduisent la relative.', 2),
  ('03310000-0000-4000-8000-000000000443'::uuid, '03300000-0000-4000-8000-000000000044'::uuid,
   'Une proposition subordonnée dépend d''une proposition principale.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Elle ne peut exister seule : elle complète la principale.', 3),

  -- 45 — Cause, conséquence et but
  ('03310000-0000-4000-8000-000000000451'::uuid, '03300000-0000-4000-8000-000000000045'::uuid,
   'Dans « Il pleut, donc je prends un parapluie », que exprime « donc » ?', 'mcq',
   '["la conséquence", "la cause", "le but", "l''opposition"]', 0,
   '« donc » introduit la conséquence de ce qui précède.', 1),
  ('03310000-0000-4000-8000-000000000452'::uuid, '03300000-0000-4000-8000-000000000045'::uuid,
   'Quelle expression introduit un but ?', 'mcq',
   '["afin que", "parce que", "car", "donc"]', 0,
   '« afin que », « pour que » expriment le but recherché.', 2),
  ('03310000-0000-4000-8000-000000000453'::uuid, '03300000-0000-4000-8000-000000000045'::uuid,
   '« parce que » introduit une cause.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Elle répond à la question « pourquoi ? ».', 3),

  -- ===== 3e =====
  -- 31 — Se raconter : l'autobiographie
  ('03310000-0000-4000-8000-000000000311'::uuid, '03300000-0000-4000-8000-000000000031'::uuid,
   'Dans une autobiographie, l''auteur, le narrateur et le personnage principal…', 'mcq',
   '["sont la même personne", "sont trois personnes différentes", "sont des animaux", "n''existent pas"]', 0,
   'C''est le « pacte autobiographique » : la même personne écrit, raconte et vit l''histoire.', 1),
  ('03310000-0000-4000-8000-000000000312'::uuid, '03300000-0000-4000-8000-000000000031'::uuid,
   'À quelle personne une autobiographie est-elle généralement écrite ?', 'mcq',
   '["la première personne (je)", "la deuxième personne (tu)", "la troisième personne (il)", "aucune"]', 0,
   'Le « je » relie l''auteur, le narrateur et le personnage.', 2),
  ('03310000-0000-4000-8000-000000000313'::uuid, '03300000-0000-4000-8000-000000000031'::uuid,
   'Un roman autobiographique mêle des éléments réels et de la fiction.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Contrairement à l''autobiographie stricte, il s''autorise l''invention.', 3),

  -- 32 — Dénoncer les travers de la société
  ('03310000-0000-4000-8000-000000000321'::uuid, '03300000-0000-4000-8000-000000000032'::uuid,
   'Comment appelle-t-on un texte qui cherche à convaincre le lecteur ?', 'mcq',
   '["un texte argumentatif", "un texte descriptif", "un simple récit", "un texte injonctif"]', 0,
   'L''argumentation défend une thèse à l''aide d''arguments.', 1),
  ('03310000-0000-4000-8000-000000000322'::uuid, '03300000-0000-4000-8000-000000000032'::uuid,
   'Quand un auteur exagère ou dit le contraire de ce qu''il pense pour se moquer, il utilise…', 'mcq',
   '["l''ironie", "une équation", "une conjugaison", "une didascalie"]', 0,
   'L''ironie (souvent au service de la satire) critique en disant le contraire.', 2),
  ('03310000-0000-4000-8000-000000000323'::uuid, '03300000-0000-4000-8000-000000000032'::uuid,
   'Un argument est une raison avancée pour défendre une opinion.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'On l''appuie souvent d''un exemple concret.', 3),

  -- 33 — La poésie engagée
  ('03310000-0000-4000-8000-000000000331'::uuid, '03300000-0000-4000-8000-000000000033'::uuid,
   'À quoi sert surtout un poème engagé ?', 'mcq',
   '["défendre une cause ou dénoncer une injustice", "donner une recette", "raconter sans avis", "expliquer un théorème"]', 0,
   'Le poète y prend position (guerre, liberté, injustice…).', 1),
  ('03310000-0000-4000-8000-000000000332'::uuid, '03300000-0000-4000-8000-000000000033'::uuid,
   'Comment nomme-t-on la répétition d''un même mot en début de plusieurs vers ?', 'mcq',
   '["une anaphore", "une rime", "un tercet", "une syllabe"]', 0,
   'L''anaphore martèle une idée (par exemple « Liberté… Liberté… »).', 2),
  ('03310000-0000-4000-8000-000000000333'::uuid, '03300000-0000-4000-8000-000000000033'::uuid,
   'La poésie engagée peut chercher à émouvoir pour faire réagir le lecteur.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Elle mobilise les émotions au service d''une cause.', 3),

  -- 34 — Le discours rapporté
  ('03310000-0000-4000-8000-000000000341'::uuid, '03300000-0000-4000-8000-000000000034'::uuid,
   'Dans « Il dit : "Je pars." », de quel type de discours s''agit-il ?', 'mcq',
   '["le discours direct", "le discours indirect", "le discours indirect libre", "le récit"]', 0,
   'Les paroles sont citées telles quelles, entre guillemets.', 1),
  ('03310000-0000-4000-8000-000000000342'::uuid, '03300000-0000-4000-8000-000000000034'::uuid,
   '« Il dit qu''il part » est un exemple de discours…', 'mcq',
   '["indirect", "direct", "avec guillemets", "théâtral"]', 0,
   'Les paroles sont intégrées dans une subordonnée, sans guillemets.', 2),
  ('03310000-0000-4000-8000-000000000343'::uuid, '03300000-0000-4000-8000-000000000034'::uuid,
   'Au discours direct, on emploie des guillemets et souvent un verbe de parole.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Par exemple : dit-il, s''écria-t-elle, avec les paroles entre « … ».', 3),

  -- 35 — Préparer l'oral du brevet
  ('03310000-0000-4000-8000-000000000351'::uuid, '03300000-0000-4000-8000-000000000035'::uuid,
   'Pour réussir un oral, il vaut mieux…', 'mcq',
   '["regarder le jury et parler clairement", "lire ses notes sans lever les yeux", "parler le plus vite possible", "chuchoter"]', 0,
   'Le contact visuel et une élocution claire captent l''auditoire.', 1),
  ('03310000-0000-4000-8000-000000000352'::uuid, '03300000-0000-4000-8000-000000000035'::uuid,
   'Présenter un projet à l''oral demande surtout d''être…', 'mcq',
   '["structuré (introduction, développement, conclusion)", "le plus long possible", "improvisé sans plan", "silencieux"]', 0,
   'Un plan clair aide le jury à suivre le propos.', 2),
  ('03310000-0000-4000-8000-000000000353'::uuid, '03300000-0000-4000-8000-000000000035'::uuid,
   'Respirer et faire des pauses aide à mieux se faire comprendre à l''oral.', 'true_false',
   '["Vrai", "Faux"]', 0,
   'Un débit maîtrisé rend le propos plus audible.', 3)
) AS d(id, quiz_id, question, kind, options, correct_index, explanation, position)
JOIN public.quizzes q ON q.id = d.quiz_id
ON CONFLICT (id) DO NOTHING;

-- Vérif : SELECT q.grade_level, q.title, count(qq.*) FROM public.quizzes q
--   LEFT JOIN public.quiz_questions qq ON qq.quiz_id = q.id
--   WHERE q.id LIKE '03300000-%' GROUP BY 1,2 ORDER BY 1,2;
