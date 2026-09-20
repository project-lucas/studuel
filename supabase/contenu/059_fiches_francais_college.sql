-- =============================================================================
-- Studuel — Migration 059 : fiches de révision Français collège (6e · 5e · 4e · 3e)
-- Remplit/enrichit lessons.revision_sheet (support « Révision ») pour la leçon
-- « L'essentiel du cours » de chaque chapitre — remplace le placeholder générique
-- posé par 025 par du contenu réel.
--
-- Motif : UPDATE joint sur la clé naturelle (slug, niveau, chapitre, leçon),
-- garde `IS DISTINCT FROM` → réexécutable sans effet de bord. Contenu en
-- dollar-quoting ($md$…$md$) pour éviter l'échappement des apostrophes.
--
-- Pour lister ce qu'il reste à écrire :
--   SELECT s.slug, c.level, c.title, l.title
--     FROM public.lessons l
--     JOIN public.chapters c ON c.id = l.chapter_id
--     JOIN public.subjects s ON s.id = c.subject_id
--    WHERE l.revision_sheet IS NULL
--    ORDER BY s.slug, c.level, c.position, l.position;
--
-- PRÉREQUIS : 008 (subjects/chapters/lessons), 025 (colonne revision_sheet).
-- Idempotent.
-- =============================================================================

UPDATE public.lessons l
   SET revision_sheet = v.md
  FROM (VALUES
    ('francais', '6e', 'Le conte merveilleux', $md$# Le conte merveilleux — l'essentiel

**À retenir**
- Le conte merveilleux est un **récit court** où le surnaturel est admis sans étonnement (fées, ogres, objets magiques).
- Il suit un **schéma narratif** : situation initiale, élément perturbateur, péripéties, dénouement, situation finale.
- Personnages types : le **héros**, l'**adjuvant** (qui aide) et l'**opposant** (qui nuit).
- Il transmet souvent une **morale** ou une leçon de vie.

**Repères**
- Formule d'ouverture (« Il était une fois »), imparfait et passé simple, fin heureuse.

**Exemple**
> « Il était une fois une jeune fille si douce qu'on l'appelait Cendrillon. »

**Erreur classique**
- Confondre conte (merveilleux accepté) et récit fantastique (le surnaturel fait peur et fait douter).$md$),

    ('francais', '6e', 'Récits d''aventures', $md$# Récits d'aventures — l'essentiel

**À retenir**
- Le récit d'aventures raconte un **voyage**, une **quête** ou un **exploit** avec des péripéties et du suspense.
- Le **héros** affronte des obstacles (nature, ennemis, dangers) et se transforme au fil de l'action.
- Le narrateur crée le **suspense** en retardant la résolution et en multipliant les rebondissements.

**Repères**
- Verbes d'action, passé simple pour les actions de premier plan, imparfait pour le décor.

**Exemple**
> « Soudain, le navire heurta un récif et l'équipage fut projeté dans les flots déchaînés. »

**Erreur classique**
- Oublier de varier le rythme : tout raconter au même niveau tue le suspense.$md$),

    ('francais', '6e', 'Poésie : jeux de langage', $md$# Poésie : jeux de langage — l'essentiel

**À retenir**
- Un **vers** est une ligne de poème ; une **strophe** est un groupe de vers.
- La **rime** est le retour d'un même son en fin de vers ; le **rythme** vient du nombre de syllabes.
- Le poète joue avec les sonorités : **allitération** (consonnes) et **assonance** (voyelles).
- Les **images** (comparaison, métaphore) donnent à voir autrement.

**Repères**
- Compter les syllabes à voix haute ; repérer le « e » muet en fin de vers.

**Exemple**
> « Pour qui sont ces serpents qui sifflent sur vos têtes ? » (allitération en « s »).

**Erreur classique**
- Croire qu'un poème doit forcément rimer : le vers libre existe et ne rime pas.$md$),

    ('francais', '6e', 'Le groupe nominal et ses accords', $md$# Le groupe nominal et ses accords — l'essentiel

**À retenir**
- Le **groupe nominal (GN)** est organisé autour d'un **nom noyau**.
- Il peut contenir un **déterminant**, un ou plusieurs **adjectifs** et un **complément du nom**.
- Tous les mots du GN s'accordent en **genre** (masculin/féminin) et en **nombre** (singulier/pluriel) avec le nom noyau.

**Méthode : accorder un GN**
1. Je repère le nom noyau et son genre/nombre.
2. J'accorde le déterminant et l'adjectif en conséquence.

**Exemple**
> « les **petites** maison**s** blanch**es** » : nom noyau « maisons » (féminin pluriel) commande tout.

**Erreur classique**
- Oublier d'accorder l'adjectif placé loin du nom : « des fleurs rouge » → « des fleurs rouge**s** ».$md$),

    ('francais', '6e', 'Conjugaison : présent et imparfait', $md$# Conjugaison : présent et imparfait — l'essentiel

**À retenir**
- Le **présent** situe l'action au moment où l'on parle (ou exprime une vérité générale).
- L'**imparfait** décrit le passé : décor, habitude, action qui dure.
- Terminaisons de l'imparfait, identiques pour tous les verbes : **-ais, -ais, -ait, -ions, -iez, -aient**.

**Méthode : former l'imparfait**
- Je prends le radical du présent en « nous » et j'ajoute les terminaisons. Nous finiss-ons → je finiss-ais.

**Exemple**
> Présent : « je mange ». Imparfait : « je mangeais quand il est entré. »

**Erreur classique**
- Oublier le « i » à « nous » et « vous » : « nous mangions », « vous criiez » (verbes en -ier).$md$),

    ('francais', '5e', 'Le roman de chevalerie', $md$# Le roman de chevalerie — l'essentiel

**À retenir**
- Le roman de chevalerie met en scène un **chevalier** au service d'un idéal (honneur, fidélité, foi, amour courtois).
- Le héros part en **quête** et prouve sa valeur par des **exploits** (combats, tournois, épreuves).
- Ancré au **Moyen Âge**, il célèbre les valeurs de la chevalerie et parfois le merveilleux.

**Repères**
- Vocabulaire médiéval : adoubement, prouesse, suzerain, vassal, courtoisie.

**Exemple**
> « Lancelot, sans crainte, éperonna son destrier et fondit sur le félon. »

**Erreur classique**
- Prendre le chevalier pour un simple guerrier : il incarne surtout un **code de valeurs**.$md$),

    ('francais', '5e', 'Voyages et découvertes', $md$# Voyages et découvertes — l'essentiel

**À retenir**
- Le récit de voyage raconte la **découverte** de terres, de peuples ou de coutumes nouvelles.
- L'auteur mêle **narration** (ce qui arrive) et **description** (ce qu'il voit) pour faire découvrir l'ailleurs.
- Le regard du voyageur révèle autant l'**autre** que **lui-même** (émerveillement, préjugés).

**Repères**
- Indicateurs de lieu et de temps, vocabulaire des sensations, présent de description.

**Exemple**
> « Nous découvrîmes une côte verdoyante d'où montaient des parfums inconnus. »

**Erreur classique**
- Oublier le point de vue : un voyage est toujours raconté à travers le regard **subjectif** de quelqu'un.$md$),

    ('francais', '5e', 'Théâtre : la comédie', $md$# Théâtre : la comédie — l'essentiel

**À retenir**
- La comédie est une pièce de théâtre qui **fait rire** et se termine bien, souvent pour corriger les défauts des hommes.
- Le texte se compose de **répliques**, de **didascalies** (indications de mise en scène) et se divise en **actes** et **scènes**.
- Ressorts du comique : de **mots**, de **gestes**, de **situation**, de **caractère**.

**Repères**
- Repérer les noms des personnages, les didascalies en italique, le découpage en scènes.

**Exemple**
> « HARPAGON, seul. — Au voleur ! au voleur ! » (comique de caractère : l'avare).

**Erreur classique**
- Confondre le **dramaturge** (l'auteur) et les **personnages** qui parlent sur scène.$md$),

    ('francais', '5e', 'Les compléments de phrase', $md$# Les compléments de phrase — l'essentiel

**À retenir**
- Le **complément de phrase** (ou circonstanciel) précise les circonstances de l'action : **temps, lieu, manière, cause**…
- Il est **mobile** (on peut le déplacer) et **supprimable** (la phrase reste correcte sans lui).
- Il complète toute la phrase, pas seulement le verbe.

**Méthode : le reconnaître**
1. Je vérifie si je peux le déplacer en tête de phrase.
2. Je vérifie si je peux le supprimer sans rendre la phrase fausse.

**Exemple**
> « **Ce matin**, Léa lit un roman **dans le jardin**. » → deux compléments de phrase (temps, lieu).

**Erreur classique**
- Confondre avec le COD, lui **non déplaçable** et **non supprimable** : « Léa lit *un roman* ».$md$),

    ('francais', '5e', 'Conjugaison : passé simple', $md$# Conjugaison : passé simple — l'essentiel

**À retenir**
- Le **passé simple** est le temps du récit : il exprime des **actions brèves et achevées** dans le passé.
- Il s'associe souvent à l'**imparfait**, qui pose le décor.
- Terminaisons du 1er groupe : **-ai, -as, -a, -âmes, -âtes, -èrent**.

**Méthode : 3e personne (la plus utile)**
- 1er groupe : il chant**a**, ils chant**èrent**. 2e groupe : il fin**it**, ils fin**irent**.

**Exemple**
> « La pluie tombait (imparfait) quand il ouvrit (passé simple) la porte. »

**Erreur classique**
- Confondre « il chanta » (passé simple, une fois) et « il chantait » (imparfait, habitude/durée).$md$),

    ('francais', '4e', 'La lettre et l''épistolaire', $md$# La lettre et l'épistolaire — l'essentiel

**À retenir**
- Le genre **épistolaire** rassemble les textes écrits sous forme de **lettres**.
- Une lettre a des codes : **date et lieu**, **formule d'appel**, **corps du message**, **formule de politesse**, **signature**.
- Elle emploie beaucoup la **1re** (l'émetteur) et la **2e personne** (le destinataire).
- Un roman peut être entièrement fait de lettres (roman épistolaire).

**Repères**
- Adapter le ton et la formule de politesse au destinataire (ami / adulte inconnu).

**Exemple**
> « Chère Marie, j'espère que tu vas bien… Amicalement, Paul. »

**Erreur classique**
- Utiliser une formule familière avec un destinataire qu'on ne connaît pas : le **registre** doit convenir.$md$),

    ('francais', '4e', 'Le fantastique', $md$# Le fantastique — l'essentiel

**À retenir**
- Le récit fantastique fait surgir un événement **inexplicable** dans un cadre **réaliste** et quotidien.
- Il crée l'**hésitation** : rêve ou réalité ? folie ou surnaturel ? Le doute n'est jamais tranché.
- Le narrateur exprime la **peur**, l'angoisse, le trouble face à l'étrange.

**Repères**
- Champ lexical de la peur, modalisateurs du doute (« il me sembla », « peut-être »), montée progressive de l'angoisse.

**Exemple**
> « Était-ce une ombre ? Je crus voir une main se poser sur mon épaule… mais il n'y avait personne. »

**Erreur classique**
- Confondre fantastique (le surnaturel **inquiète** et fait douter) et merveilleux (le surnaturel est **accepté** sans peur).$md$),

    ('francais', '4e', 'La ville en poésie', $md$# La ville en poésie — l'essentiel

**À retenir**
- La ville inspire les poètes : ils en font un lieu de **beauté**, de **mouvement** mais aussi de **misère** ou de solitude.
- Ils recourent aux **images** (métaphore, personnification) pour transfigurer le décor urbain.
- Le regard poétique révèle une **émotion** : fascination, mélancolie, révolte.

**Repères**
- Repérer le champ lexical de la ville, les figures de style, le registre (lyrique, réaliste).

**Exemple**
> « La ville dormait, ses réverbères veillaient comme des yeux fatigués. » (personnification).

**Erreur classique**
- Décrire la ville « telle quelle » : en poésie, le décor est **recréé** par le regard et les images.$md$),

    ('francais', '4e', 'Les propositions subordonnées', $md$# Les propositions subordonnées — l'essentiel

**À retenir**
- Une **phrase complexe** contient plusieurs verbes conjugués, donc plusieurs propositions.
- La **subordonnée** dépend d'une **principale** et ne peut exister seule ; elle est introduite par un mot subordonnant.
- La **relative** (introduite par qui, que, dont, où) complète un nom, son **antécédent**.
- La **conjonctive** (introduite par « que ») est souvent COD du verbe.

**Méthode : reconnaître une relative**
- Je cherche le pronom relatif et le nom qu'il complète juste avant.

**Exemple**
> « Le livre **que je lis** est passionnant. » → « que je lis » complète « livre ».

**Erreur classique**
- Confondre « que » relatif (complète un nom) et « que » conjonctif (complète un verbe : « je pense que… »).$md$),

    ('francais', '4e', 'Cause, conséquence et but', $md$# Cause, conséquence et but — l'essentiel

**À retenir**
- La **cause** explique *pourquoi* : parce que, car, puisque, comme, à cause de.
- La **conséquence** exprime le *résultat* : donc, si bien que, c'est pourquoi, tellement… que.
- Le **but** indique l'*intention* : pour que, afin que, pour, dans le but de.
- Après « pour que » et « afin que », le verbe se met au **subjonctif**.

**Méthode : distinguer cause et conséquence**
- La cause vient avant l'effet ; la conséquence est l'effet qui suit. « Il pleut (cause), **donc** je reste (conséquence). »

**Exemple**
> « Il travaille **pour** réussir. » (but) / « Il a tant plu **que** la rivière déborda. » (conséquence)

**Erreur classique**
- Mettre l'indicatif après « pour que » : on dit « pour que tu **viennes** », pas « tu viens ».$md$),

    ('francais', '3e', 'Se raconter : l''autobiographie', $md$# Se raconter : l'autobiographie — l'essentiel

**À retenir**
- L'**autobiographie** est le récit de sa propre vie : l'**auteur**, le **narrateur** et le **personnage** sont une seule et même personne.
- Elle repose sur un **pacte autobiographique** : l'auteur s'engage à dire la vérité.
- Emploi de la **1re personne** (« je ») et va-et-vient entre le « je » d'hier et le « je » d'aujourd'hui.
- Genres proches : mémoires, journal intime, autoportrait.

**Repères**
- Marques de la 1re personne, temps du passé (imparfait/passé composé), regard rétrospectif.

**Exemple**
> « Je me souviens du jardin de mon enfance, où tout me semblait immense. »

**Erreur classique**
- Confondre autobiographie (l'auteur raconte sa **propre** vie) et biographie (on raconte la vie **d'un autre**).$md$),

    ('francais', '3e', 'Dénoncer les travers de la société', $md$# Dénoncer les travers de la société — l'essentiel

**À retenir**
- Certains textes cherchent à **critiquer** les défauts de la société : injustice, hypocrisie, abus de pouvoir.
- L'auteur emploie l'**ironie** (dire le contraire de ce qu'il pense) et la **satire** pour faire réfléchir.
- L'**apologue** (fable, conte philosophique) délivre une leçon sous forme de récit plaisant.

**Repères**
- Repérer la cible, la thèse défendue, les procédés (ironie, exagération, antiphrase).

**Exemple**
> « Quelle belle époque, où le plus fort a toujours raison ! » (ironie : l'auteur dénonce l'injustice).

**Erreur classique**
- Prendre l'ironie au premier degré : il faut comprendre le sens **contraire** que vise l'auteur.$md$),

    ('francais', '3e', 'La poésie engagée', $md$# La poésie engagée — l'essentiel

**À retenir**
- La poésie engagée met la **beauté des mots au service d'une cause** : liberté, paix, justice, résistance.
- Le poète prend **position** et cherche à émouvoir pour convaincre.
- Elle mobilise des procédés forts : **anaphore**, apostrophe, images, rythme entraînant.

**Repères**
- Repérer la cause défendue, le destinataire (le « tu » ou le « vous »), les répétitions qui martèlent l'idée.

**Exemple**
> « Liberté, j'écris ton nom » (Paul Éluard) : l'anaphore martèle l'idéal défendu.

**Erreur classique**
- Croire qu'un poème engagé est un simple discours : c'est la **forme poétique** (images, rythme) qui porte le message.$md$),

    ('francais', '3e', 'Le discours rapporté', $md$# Le discours rapporté — l'essentiel

**À retenir**
- Rapporter des paroles se fait de plusieurs façons.
- **Discours direct** : paroles citées telles quelles, entre guillemets, avec un verbe de parole. Il dit : « Je pars. »
- **Discours indirect** : paroles intégrées par une subordonnée, sans guillemets. Il dit **qu'il part**.
- Le passage à l'indirect entraîne des **changements** de personne, de temps et parfois d'indicateurs de temps.

**Méthode : passer au discours indirect**
- Je supprime les guillemets, j'introduis par « que », j'ajuste le pronom et le temps du verbe.

**Exemple**
> Direct : Il dit : « Je viendrai demain. » → Indirect : Il dit **qu'il viendra le lendemain**.

**Erreur classique**
- Oublier de changer le pronom et le temps : « Il dit que je pars » au lieu de « qu'il partait ».$md$),

    ('francais', '3e', 'Préparer l''oral du brevet', $md$# Préparer l'oral du brevet — l'essentiel

**À retenir**
- L'épreuve orale du brevet dure environ 15 minutes : un **exposé** (5 min) suivi d'un **entretien** avec le jury.
- On présente un **projet** ou un **objet d'étude** (parcours artistique, stage…) qu'on connaît bien.
- Compétences évaluées : la **maîtrise de l'expression** orale et la **qualité du propos**.

**Méthode : réussir l'exposé**
1. J'annonce un plan clair (introduction, développement, conclusion).
2. Je regarde le jury, je parle **sans lire**, à voix posée.
3. J'anticipe quelques questions pour l'entretien.

**Exemple**
> « Bonjour, je vais vous présenter mon projet sur… Je l'ai choisi parce que… »

**Erreur classique**
- Lire ses notes mot à mot : le jury attend un discours **vivant**, pas une récitation.$md$)
  ) AS v(slug, level, chapter, md)
  JOIN public.subjects s ON s.slug = v.slug
  JOIN public.chapters c
    ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
 WHERE l.chapter_id = c.id
   AND l.title = 'L''essentiel du cours'
   AND l.revision_sheet IS DISTINCT FROM v.md;
