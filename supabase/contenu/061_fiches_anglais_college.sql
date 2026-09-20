-- =============================================================================
-- Studuel — Migration 061 : fiches de révision Anglais collège (6e · 5e · 4e · 3e)
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
    ('anglais', '6e', 'Se présenter et parler de soi', $md$# Se présenter et parler de soi — l'essentiel

**À retenir**
- Le verbe **be** sert à donner son nom, son âge et sa nationalité : I **am**, you **are**, he/she/it **is**.
- L'âge se dit avec **be**, pas avec « have » : *I am 12* (et non « I have 12 »).
- Les **pronoms personnels** sujets : I, you, he, she, it, we, they.

**Structure**
- Sujet + be + reste : *I am… / My name is… / I am from…*

**Exemple**
> My name is Tom. I am 12 (years old) and I am from London. → Je m'appelle Tom. J'ai 12 ans et je viens de Londres.

**Erreur classique**
- Dire « I have 12 years » : on dit **I am 12**, l'âge se construit avec *be*.$md$),

    ('anglais', '6e', 'Present simple : routines', $md$# Present simple : routines — l'essentiel

**À retenir**
- Le **present simple** décrit les habitudes et ce qui est toujours vrai.
- À la **3e personne du singulier** (he/she/it), on ajoute **-s** au verbe : *she plays*.
- Les négations et questions utilisent **do / does** : *I don't, he doesn't, do you…?*

**Structure**
- Affirmatif : sujet + verbe (+ **s** à la 3e pers.) : *He works.*
- Négatif : sujet + **don't/doesn't** + verbe : *She doesn't work.*

**Exemple**
> Every morning she gets up at seven and goes to school. → Chaque matin elle se lève à sept heures et va à l'école.

**Erreur classique**
- Oublier le **-s** à la 3e personne : on dit *he plays*, pas « he play ».$md$),

    ('anglais', '6e', 'La famille et les animaux', $md$# La famille et les animaux — l'essentiel

**À retenir**
- Le **génitif 's** exprime l'appartenance : *my sister's cat* = le chat de ma sœur.
- Les **adjectifs possessifs** : my, your, his, her, its, our, their.
- Le pluriel des noms se forme en général avec **-s** : *a dog → two dogs*.

**Structure**
- Possesseur + **'s** + objet possédé : *Tom's dog* = le chien de Tom.

**Exemple**
> This is my brother's rabbit. Its name is Snowy. → C'est le lapin de mon frère. Il s'appelle Snowy.

**Erreur classique**
- Traduire « le chien de mon père » par « the dog of my father » : on dit *my father's dog* (génitif 's).$md$),

    ('anglais', '6e', 'L''école en pays anglophone', $md$# L'école en pays anglophone — l'essentiel

**À retenir**
- On donne l'heure avec **it's** : *it's half past eight* (8 h 30).
- Les matières scolaires ne prennent **pas d'article** : *I like maths and history*.
- **There is / there are** pour dire ce qu'il y a : singulier / pluriel.

**Structure**
- *There is a…* (singulier) / *There are… * (pluriel) : *There is a library.*

**Exemple**
> At school there are twelve classrooms and I have English at nine o'clock. → À l'école il y a douze salles et j'ai anglais à neuf heures.

**Erreur classique**
- Utiliser *there are* avec un singulier : on dit *there is a pen*, pas « there are a pen ».$md$),

    ('anglais', '6e', 'Fêtes et traditions', $md$# Fêtes et traditions — l'essentiel

**À retenir**
- Le **présent en be + -ing** (present continuous) décrit une action en cours : *we are celebrating*.
- **Like + -ing** pour dire ce qu'on aime faire : *I like giving presents*.
- Vocabulaire des fêtes : Christmas, Halloween, birthday, presents, costume.

**Structure**
- Sujet + be + **verbe-ing** : *They are dressing up.*

**Exemple**
> At Halloween children are wearing costumes and eating sweets. → À Halloween les enfants portent des costumes et mangent des bonbons.

**Erreur classique**
- Oublier l'auxiliaire *be* : on dit *she is dancing*, pas « she dancing ».$md$),

    ('anglais', '5e', 'Present simple vs continuous', $md$# Present simple vs continuous — l'essentiel

**À retenir**
- Le **present simple** = habitudes et vérités générales (*every day, always, usually*).
- Le **present continuous** (be + -ing) = action **en train** de se dérouler maintenant (*now, right now, look!*).
- Certains verbes d'état (like, want, know) ne se mettent **pas** en -ing.

**Structure**
- Simple : *I play football.* — Continuous : *I am playing football now.*

**Exemple**
> I usually walk to school, but today I am taking the bus. → D'habitude je vais à l'école à pied, mais aujourd'hui je prends le bus.

**Erreur classique**
- Employer le continuous pour une habitude : « I am going to school every day » → dire *I go to school every day*.$md$),

    ('anglais', '5e', 'Le prétérit : raconter au passé', $md$# Le prétérit : raconter au passé — l'essentiel

**À retenir**
- Le **prétérit** (past simple) raconte une action **terminée** dans le passé.
- Verbes **réguliers** : on ajoute **-ed** : *play → played, watch → watched*.
- Verbes **irréguliers** : forme à apprendre par cœur : *go → went, have → had, see → saw*.

**Structure**
- Affirmatif : sujet + verbe-**ed** (ou forme irrégulière) : *I visited / I went.*
- Négatif / question : **did(n't)** + base verbale : *Did you go? I didn't go.*

**Exemple**
> Yesterday I watched a film and then I went to bed. → Hier j'ai regardé un film puis je suis allé me coucher.

**Erreur classique**
- Garder le -ed après *did* : on dit *did you play?*, pas « did you played? ».$md$),

    ('anglais', '5e', 'Décrire un lieu, une ville', $md$# Décrire un lieu, une ville — l'essentiel

**À retenir**
- **There is / there are** pour dire ce qu'il y a ; **some / any** pour les quantités indéfinies.
- Les **prépositions de lieu** : in, on, under, next to, between, behind, in front of.
- **any** s'emploie surtout dans les questions et les négations : *Is there any park?*

**Structure**
- *There is a… / There are some…* + lieu : *There are some shops near the station.*

**Exemple**
> In my town there is a big park and there are two cinemas next to the market. → Dans ma ville il y a un grand parc et deux cinémas à côté du marché.

**Erreur classique**
- Utiliser *some* dans une question : on dit *Is there any museum?*, pas « Is there some museum? ».$md$),

    ('anglais', '5e', 'La nourriture et les quantités', $md$# La nourriture et les quantités — l'essentiel

**À retenir**
- Noms **dénombrables** (an apple, two eggs) vs **indénombrables** (water, rice, milk).
- **Some** (affirmatif) / **any** (négatif, question) : *some bread, any sugar?*
- **How much** (indénombrable) / **how many** (dénombrable) pour la quantité.

**Structure**
- *How much + indénombrable / How many + pluriel* : *How many apples? How much milk?*

**Exemple**
> There isn't any juice but there are some apples in the fridge. → Il n'y a pas de jus mais il y a des pommes dans le frigo.

**Erreur classique**
- Mettre les indénombrables au pluriel : on dit *some water*, pas « some waters ».$md$),

    ('anglais', '5e', 'Les pays anglophones', $md$# Les pays anglophones — l'essentiel

**À retenir**
- **Adjectifs de nationalité** avec majuscule : British, American, Australian, Irish.
- **Can** exprime la capacité : *I can speak English* (« can » ne prend jamais de -s).
- Le comparatif court se forme en **-er + than** : *bigger than*.

**Structure**
- Sujet + **can** + base verbale : *People can visit London.*

**Exemple**
> The USA is bigger than the UK, and you can travel from coast to coast. → Les États-Unis sont plus grands que le Royaume-Uni, et on peut voyager d'une côte à l'autre.

**Erreur classique**
- Ajouter -s à *can* : on dit *she can swim*, pas « she cans swim ».$md$),

    ('anglais', '4e', 'Le present perfect', $md$# Le present perfect — l'essentiel

**À retenir**
- Le **present perfect** relie le passé au présent : action passée qui compte **maintenant**.
- Il se forme avec **have / has + participe passé** : *I have finished, she has gone*.
- Mots-clés fréquents : **just, already, yet, ever, never, since, for**.

**Structure**
- Sujet + **have/has** + participe passé : *We have seen this film.*

**Exemple**
> I have just finished my homework. → Je viens de finir mes devoirs (et c'est fait, là, maintenant).

**Erreur classique**
- Employer le present perfect avec une date passée précise : *yesterday* exige le prétérit (*I saw*, pas « I have seen yesterday »).$md$),

    ('anglais', '4e', 'Comparatifs et superlatifs', $md$# Comparatifs et superlatifs — l'essentiel

**À retenir**
- **Adjectifs courts** (1 syllabe) : comparatif **-er + than**, superlatif **the -est**.
- **Adjectifs longs** : **more + adjectif + than**, superlatif **the most + adjectif**.
- Irréguliers à connaître : *good → better → the best ; bad → worse → the worst*.

**Structure**
- Comparatif : *taller than / more famous than*. Superlatif : *the tallest / the most famous*.

**Exemple**
> London is bigger than York, but Tokyo is the most crowded city. → Londres est plus grande que York, mais Tokyo est la ville la plus peuplée.

**Erreur classique**
- Cumuler les deux formes : on dit *more interesting*, jamais « more interestinger ».$md$),

    ('anglais', '4e', 'Exprimer le futur', $md$# Exprimer le futur — l'essentiel

**À retenir**
- **Will + base verbale** : décision spontanée, prédiction : *It will rain.*
- **Be going to + base verbale** : intention, projet, indice visible : *I am going to travel.*
- **Present continuous** pour un rendez-vous déjà fixé : *I am meeting Tom tomorrow.*

**Structure**
- *Sujet + will + verbe* / *Sujet + be going to + verbe.*

**Exemple**
> Look at those clouds — it is going to rain. I think I will take an umbrella. → Regarde ces nuages, il va pleuvoir. Je crois que je vais prendre un parapluie.

**Erreur classique**
- Mettre un verbe conjugué après *will* : on dit *he will come*, pas « he will comes ».$md$),

    ('anglais', '4e', 'Les médias et les réseaux', $md$# Les médias et les réseaux — l'essentiel

**À retenir**
- **Adverbes de fréquence** (always, often, sometimes, never) : devant le verbe, après *be*.
- **Trop / assez** : **too + adjectif** (excès), **enough** (suffisance, après l'adjectif).
- Vocabulaire : to post, to share, to follow, a screen, a network, online.

**Structure**
- *too + adjectif* : *too expensive* — *adjectif + enough* : *old enough*.

**Exemple**
> I often check my phone, but I am not old enough to post everything online. → Je regarde souvent mon téléphone, mais je ne suis pas assez âgé pour tout publier en ligne.

**Erreur classique**
- Placer *enough* avant l'adjectif : on dit *good enough*, pas « enough good ».$md$),

    ('anglais', '4e', 'Portraits d''artistes anglophones', $md$# Portraits d'artistes anglophones — l'essentiel

**À retenir**
- Une **biographie** se raconte au **prétérit** : *He was born… / She started…*
- **Prépositions de temps** : *in 1990* (année), *on Monday* (jour), *at 8* (heure).
- **When / while** relient deux moments passés : *while he was singing…*

**Structure**
- Prétérit + repères de temps : *She was born in 1985 and became famous in 2005.*

**Exemple**
> The Beatles started in Liverpool and they became famous all over the world. → Les Beatles ont commencé à Liverpool et sont devenus célèbres dans le monde entier.

**Erreur classique**
- Confondre les prépositions : on dit *in 1990* et *on Monday*, pas « in Monday ».$md$),

    ('anglais', '3e', 'Le passif', $md$# Le passif — l'essentiel

**À retenir**
- Le **passif** met en avant l'action ou l'objet, pas celui qui agit.
- Il se forme avec **be + participe passé** : *is made, was written, are sold*.
- Celui qui agit, s'il est mentionné, est introduit par **by** : *by Shakespeare*.

**Structure**
- Sujet + **be** (au bon temps) + participe passé (+ **by**…) : *This book was written by Orwell.*

**Exemple**
> Tea is grown in India and it is drunk all over the world. → Le thé est cultivé en Inde et il est bu dans le monde entier.

**Erreur classique**
- Oublier l'auxiliaire *be* : on dit *the door was closed*, pas « the door closed » (qui serait actif).$md$),

    ('anglais', '3e', 'Les modaux : conseils et obligation', $md$# Les modaux : conseils et obligation — l'essentiel

**À retenir**
- **Should** = conseil : *You should rest.* (« tu devrais »).
- **Must / have to** = obligation forte ; **mustn't** = interdiction.
- **Don't have to** = absence d'obligation (≠ interdiction).

**Structure**
- Sujet + **modal** + base verbale (sans *to*, sauf *have to*) : *You must wait.*

**Exemple**
> You should revise, and you must be on time, but you don't have to run. → Tu devrais réviser, et tu dois être à l'heure, mais tu n'es pas obligé de courir.

**Erreur classique**
- Confondre *mustn't* (interdit) et *don't have to* (facultatif) : ce n'est pas la même chose.$md$),

    ('anglais', '3e', 'Present perfect vs prétérit', $md$# Present perfect vs prétérit — l'essentiel

**À retenir**
- **Prétérit** = action passée **datée**, terminée, coupée du présent (*yesterday, in 2010, last week*).
- **Present perfect** = lien avec le présent, sans date précise (*ever, never, already, since, for*).
- **Since** + point de départ / **for** + durée : *since 2010 / for three years*.

**Structure**
- Prétérit : *I saw him yesterday.* — Present perfect : *I have known him for years.*

**Exemple**
> I have lived here for ten years, and I moved in when I was five. → J'habite ici depuis dix ans, et j'ai emménagé quand j'avais cinq ans.

**Erreur classique**
- Mettre le present perfect avec une date : *I have seen him yesterday* est faux → *I saw him yesterday*.$md$),

    ('anglais', '3e', 'Le monde du travail', $md$# Le monde du travail — l'essentiel

**À retenir**
- Poser une question sur un métier : *What do you do? What does she do for a living?*
- Le **would** exprime le souhait / l'hypothèse : *I would like to be a doctor.*
- Vocabulaire : a job, a career, an interview, skills, to apply for.

**Structure**
- *I would like to + base verbale* : *I would like to work abroad.*

**Exemple**
> She would like to become an engineer because she is good at maths. → Elle aimerait devenir ingénieure parce qu'elle est bonne en maths.

**Erreur classique**
- Ajouter *to* après *would like to be* mal placé : on dit *I would like to be a nurse*, pas « I would like be ».$md$),

    ('anglais', '3e', 'Préparer l''épreuve orale', $md$# Préparer l'épreuve orale — l'essentiel

**À retenir**
- Structurer son propos avec des **connecteurs** : first, then, however, because, finally.
- Donner son avis : *I think that…, in my opinion…, I believe that…*
- Varier les temps : présent pour le thème, prétérit pour les exemples, futur pour conclure.

**Méthode**
- Introduire le thème, développer 2 idées avec exemples, conclure en donnant son avis.

**Exemple**
> In my opinion, this project is interesting because it shows how people can help each other. → À mon avis, ce projet est intéressant parce qu'il montre comment les gens peuvent s'entraider.

**Erreur classique**
- Enchaîner les phrases sans connecteur : sans *first, then, because…*, le propos paraît décousu.$md$)
  ) AS v(slug, level, chapter, md)
  JOIN public.subjects s ON s.slug = v.slug
  JOIN public.chapters c
    ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
 WHERE l.chapter_id = c.id
   AND l.title = 'L''essentiel du cours'
   AND l.revision_sheet IS DISTINCT FROM v.md;
