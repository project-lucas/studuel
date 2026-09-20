-- =============================================================================
-- Studuel — Migration 067 : fiches de révision Anglais lycée (2de · 1re · Tle)
-- Remplit/enrichit lessons.revision_sheet (support « Révision ») pour la leçon
-- « L'essentiel du cours » de chaque chapitre — remplace le placeholder générique
-- posé par 025 par du contenu réel (axes culturels du programme du lycée).
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
    ('anglais', '2de', 'Vivre entre générations', $md$# Vivre entre générations — l'essentiel

**À retenir**
- L'axe interroge les liens familiaux, la **transmission** entre âges (grandparents, parents, teenagers) et les conflits de génération.
- Notions clés : **coming of age** (passage à l'âge adulte), **elderly care**, **family ties**, **generation gap**.
- Point de langue : le **present perfect** (have/has + participe passé) relie le passé au présent, utile pour parler d'expérience et de transmission.

**Vocabulaire**
- *upbringing* (éducation reçue), *sibling* (frère/sœur), *to grow up*, *caregiver* (aidant), *retirement* (retraite), *heritage* (héritage culturel).

**Exemple**
> My grandmother **has taught** me a lot about my roots. → Ma grand-mère m'a appris beaucoup sur mes origines.

**Erreur classique**
- Utiliser le prétérit avec un lien au présent : on dit *We have lived here for ten years* (et non *We live here since ten years*). « For » = durée, « since » = point de départ.$md$),

    ('anglais', '2de', 'Les univers professionnels', $md$# Les univers professionnels — l'essentiel

**À retenir**
- L'axe explore le **monde du travail** : métiers, stages (**work experience**), entretiens (**job interviews**), équilibre vie pro/vie perso.
- Anglophonie : culture du **CV / résumé** (US), du *cover letter*, du *networking*.
- Point de langue : les **modaux** *can*, *could*, *should*, *would* pour exprimer capacité, conseil et politesse en contexte professionnel.

**Vocabulaire**
- *job seeker* (demandeur d'emploi), *skills* (compétences), *to apply for* (postuler), *wage/salary*, *self-employed* (indépendant), *deadline* (échéance).

**Exemple**
> You **should** highlight your teamwork skills during the interview. → Tu devrais mettre en avant tes compétences en travail d'équipe.

**Erreur classique**
- Faire suivre un modal d'un « to » : on dit *I can help* (et non *I can to help*). Après can/should/must, le verbe reste à la base verbale.$md$),

    ('anglais', '2de', 'Représentation de soi et d''autrui', $md$# Représentation de soi et d'autrui — l'essentiel

**À retenir**
- L'axe porte sur l'**image de soi**, les stéréotypes, l'apparence et le regard des autres (réseaux sociaux, mode, publicité).
- Notions : **self-image**, **prejudice** (préjugé), **peer pressure** (pression des pairs), **body image**.
- Point de langue : les **adjectifs et leur ordre** (opinion → taille → âge → couleur → origine) pour décrire une personne.

**Vocabulaire**
- *appearance*, *to fit in* (s'intégrer), *outgoing/shy*, *to judge*, *role model* (modèle), *to belong* (appartenir).

**Exemple**
> She is a **confident young** woman who refuses to follow stereotypes. → C'est une jeune femme sûre d'elle qui refuse les stéréotypes.

**Erreur classique**
- Accorder l'adjectif en nombre : en anglais l'adjectif est **invariable** — on dit *two tall boys* (et non *two talls boys*).$md$),

    ('anglais', '2de', 'Le passé dans le présent', $md$# Le passé dans le présent — l'essentiel

**À retenir**
- L'axe montre comment l'**histoire et la mémoire** façonnent le présent : monuments, commémorations, patrimoine (**heritage**), traditions.
- Notions : **legacy** (héritage), **remembrance** (commémoration), **landmark** (monument marquant), **roots**.
- Point de langue : le **prétérit** (verbes réguliers en -ed, irréguliers à mémoriser) pour raconter des faits passés datés et achevés.

**Vocabulaire**
- *past* / *present*, *to remember*, *ancestor*, *event*, *century* (siècle), *to commemorate*, *witness* (témoin).

**Exemple**
> Slavery **was abolished** in the British Empire in 1833. → L'esclavage fut aboli dans l'Empire britannique en 1833.

**Erreur classique**
- Confondre prétérit et present perfect : avec une **date précise** on emploie le prétérit (*I saw it in 2019*), jamais le present perfect (*I have seen it in 2019*).$md$),

    ('anglais', '1re', 'Identités et échanges', $md$# Identités et échanges — l'essentiel

**À retenir**
- L'axe traite des **migrations**, des frontières, du multiculturalisme et des mobilités (voyages, exil, diaspora).
- Notions : **melting pot**, **border**, **integration**, **cultural identity**, **globalisation**.
- Point de langue : les **comparatifs et superlatifs** (-er/-est ou more/most) pour comparer cultures et modes de vie.

**Vocabulaire**
- *migrant* / *refugee*, *to settle* (s'installer), *homeland* (pays d'origine), *diversity*, *citizenship*, *to belong to*.

**Exemple**
> London is one of **the most** cosmopolitan cities in the world. → Londres est l'une des villes les plus cosmopolites du monde.

**Erreur classique**
- Doubler la marque du comparatif : on dit *more interesting* ou *bigger*, jamais *more bigger*. Les adjectifs courts prennent -er, les longs prennent *more*.$md$),

    ('anglais', '1re', 'Espace privé et espace public', $md$# Espace privé et espace public — l'essentiel

**À retenir**
- L'axe oppose **vie privée** et **sphère publique** : données personnelles, surveillance, liberté d'expression, place des femmes.
- Notions : **privacy**, **surveillance**, **gender equality**, **public space**, **freedom of speech**.
- Point de langue : la **voix passive** (be + participe passé) pour mettre en avant l'action ou masquer l'agent, fréquente en anglais.

**Vocabulaire**
- *private life*, *data* (données), *to monitor* (surveiller), *rights* (droits), *empowerment*, *whistleblower* (lanceur d'alerte).

**Exemple**
> Personal data **is collected** by many websites without consent. → Les données personnelles sont collectées par de nombreux sites sans consentement.

**Erreur classique**
- Oublier l'auxiliaire *be* au passif : on dit *The law was passed* (et non *The law passed* si l'on veut le sens passif « fut votée »).$md$),

    ('anglais', '1re', 'Art et pouvoir', $md$# Art et pouvoir — l'essentiel

**À retenir**
- L'axe relie **création artistique** et **pouvoir** : art de propagande, art engagé, contestation, censure.
- Notions : **propaganda**, **protest song**, **street art**, **censorship**, **committed art** (art engagé).
- Point de langue : les **propositions relatives** (who, which, that, whose) pour enrichir une description d'œuvre ou d'artiste.

**Vocabulaire**
- *artwork* (œuvre), *to challenge* (remettre en cause), *masterpiece* (chef-d'œuvre), *audience* (public), *to raise awareness* (sensibiliser).

**Exemple**
> Banksy is an artist **whose** works criticise consumer society. → Banksy est un artiste dont les œuvres critiquent la société de consommation.

**Erreur classique**
- Employer *who* pour un objet : on dit *the painting **which** shocked people* (et non *the painting who...*). *Who* pour les personnes, *which* pour les choses.$md$),

    ('anglais', '1re', 'Citoyenneté et mondes virtuels', $md$# Citoyenneté et mondes virtuels — l'essentiel

**À retenir**
- L'axe examine la **citoyenneté à l'ère numérique** : réseaux sociaux, désinformation, engagement en ligne, e-democracy.
- Notions : **fake news**, **e-citizenship**, **digital footprint** (empreinte numérique), **cyberbullying**, **online activism**.
- Point de langue : les **propositions en if** (conditionnel type 1 et type 2) pour envisager conséquences et hypothèses.

**Vocabulaire**
- *social network*, *to share*, *to spread* (diffuser), *reliable source* (source fiable), *user*, *to log in*.

**Exemple**
> If people **checked** their sources, fake news **would** spread less. → Si les gens vérifiaient leurs sources, les fausses infos se propageraient moins.

**Erreur classique**
- Mettre *would* dans la proposition en *if* : on dit *If I had time* (et non *If I would have time*). *Would* va dans la principale, pas après *if*.$md$),

    ('anglais', 'Tle', 'Faire société : unité et pluralité', $md$# Faire société : unité et pluralité — l'essentiel

**À retenir**
- L'axe interroge le **vivre-ensemble** : cohésion sociale, minorités, égalité, communautés dans le monde anglophone.
- Notions : **community**, **inclusion**, **civil rights**, **discrimination**, **solidarity**, **the common good**.
- Point de langue : le **discours indirect** (reported speech) et la concordance des temps pour rapporter débats et témoignages.

**Vocabulaire**
- *society*, *to belong*, *equal rights*, *gap* (écart), *to bridge* (rapprocher), *fairness* (équité), *welfare* (protection sociale).

**Exemple**
> Martin Luther King said that he **had** a dream of equality. → Martin Luther King déclara qu'il avait un rêve d'égalité.

**Erreur classique**
- Oublier le recul des temps au discours indirect : *"I am tired"* devient *She said she **was** tired* (present → prétérit), pas *she said she is tired*.$md$),

    ('anglais', 'Tle', 'Environnements en mutation', $md$# Environnements en mutation — l'essentiel

**À retenir**
- L'axe traite du **changement climatique**, de l'urbanisation, des migrations environnementales et de l'écologie.
- Notions : **climate change**, **sustainability** (durabilité), **carbon footprint**, **biodiversity**, **eco-friendly**.
- Point de langue : le futur — **will** (prévision/décision) vs **be going to** (intention/indice présent) pour parler d'avenir et de projets.

**Vocabulaire**
- *global warming*, *to pollute*, *waste* (déchets), *renewable energy*, *to protect*, *awareness* (prise de conscience).

**Exemple**
> Sea levels **will** rise if we do not act now. → Le niveau des mers montera si nous n'agissons pas maintenant.

**Erreur classique**
- Mettre le futur après *if* de condition : on dit *If temperatures rise* (présent) et non *If temperatures will rise*. Le *will* reste dans la principale.$md$),

    ('anglais', 'Tle', 'Art et débats d''idées', $md$# Art et débats d'idées — l'essentiel

**À retenir**
- L'axe montre l'art comme **vecteur d'idées** : littérature engagée, dystopies, satire, débats esthétiques et éthiques.
- Notions : **dystopia**, **satire**, **freedom of thought**, **utopia**, **to convey a message** (transmettre un message).
- Point de langue : les **verbes d'opinion et modaux épistémiques** (may, might, must, can't) pour nuancer un jugement et débattre.

**Vocabulaire**
- *novel* (roman), *playwright* (dramaturge), *viewpoint* (point de vue), *to argue*, *thought-provoking* (qui fait réfléchir), *meaning*.

**Exemple**
> Orwell's *1984* **may** be read as a warning against totalitarianism. → *1984* d'Orwell peut se lire comme une mise en garde contre le totalitarisme.

**Erreur classique**
- Traduire « c'est pourquoi » par *that's why* mal placé, ou confondre *it means* et *that means* : préférer *which means* pour enchaîner une explication dans une même phrase.$md$),

    ('anglais', 'Tle', 'Innovations et responsabilité', $md$# Innovations et responsabilité — l'essentiel

**À retenir**
- L'axe relie **progrès scientifique** et **éthique** : intelligence artificielle, biotechnologies, robotique, responsabilité du chercheur.
- Notions : **breakthrough** (avancée majeure), **ethics**, **artificial intelligence**, **responsibility**, **risk assessment**.
- Point de langue : le **present perfect** vs le **prétérit** pour distinguer un progrès récent au bilan présent d'un fait daté.

**Vocabulaire**
- *research*, *device* (appareil), *to develop*, *harm* (préjudice), *to improve*, *side effect* (effet secondaire), *reliable*.

**Exemple**
> Scientists **have developed** vaccines faster than ever before. → Les scientifiques ont mis au point des vaccins plus vite que jamais.

**Erreur classique**
- Employer *since* avec une durée : on dit *for years* (durée) et *since 2020* (point de départ). *We have worked on it for months*, pas *since months*.$md$)
  ) AS v(slug, level, chapter, md)
  JOIN public.subjects s ON s.slug = v.slug
  JOIN public.chapters c
    ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
 WHERE l.chapter_id = c.id
   AND l.title = 'L''essentiel du cours'
   AND l.revision_sheet IS DISTINCT FROM v.md;
