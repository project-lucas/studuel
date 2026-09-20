-- =============================================================================
-- Studuel — Migration 062 : fiches de révision SVT collège (6e · 5e · 4e · 3e)
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
    ('svt', '6e', 'Le vivant et sa diversité', $md$# Le vivant et sa diversité — l'essentiel

**À retenir**
- Tous les êtres vivants sont faits de **cellules** : c'est l'unité de base du vivant.
- On **classe** les êtres vivants d'après leurs **attributs communs** (ce qu'ils possèdent), pas d'après ce qu'ils font.
- Un groupe emboîté rassemble les espèces qui partagent un même caractère (ex : les vertébrés ont un squelette interne).
- La **biodiversité** est la diversité des espèces et des milieux de vie.

**Vocabulaire**
- **Cellule** : plus petite unité vivante, limitée par une membrane.
- **Espèce** : ensemble d'êtres vivants qui se ressemblent et peuvent se reproduire entre eux.

**Exemple**
> Le chat et l'homme sont dans le groupe des vertébrés : tous deux ont une colonne vertébrale.

**Erreur classique**
- Classer selon le mode de vie (« ça vole ») : l'oiseau et la chauve-souris volent mais ne sont pas dans le même groupe.$md$),

    ('svt', '6e', 'Le développement des êtres vivants', $md$# Le développement des êtres vivants — l'essentiel

**À retenir**
- Un être vivant **naît, grandit, se reproduit puis meurt** : c'est son cycle de vie.
- Au cours du **développement**, l'organisme change de taille et parfois de forme.
- Certains animaux subissent une **métamorphose** (transformation profonde), d'autres non.

**Vocabulaire**
- **Métamorphose** : transformation du corps entre la forme jeune et la forme adulte (ex : chenille → papillon).
- **Larve** : forme jeune très différente de l'adulte.

**Exemple**
> La grenouille passe par le têtard (aquatique, à branchies) avant de devenir adulte (à poumons).

**Erreur classique**
- Croire que la larve est une autre espèce : c'est le même animal à un autre stade de développement.$md$),

    ('svt', '6e', 'Les besoins des plantes vertes', $md$# Les besoins des plantes vertes — l'essentiel

**À retenir**
- Les plantes vertes fabriquent leur **propre matière organique** : elles sont **productrices**.
- Pour cela il leur faut : de l'**eau**, des **sels minéraux** (puisés par les racines), du **dioxyde de carbone** et de la **lumière**.
- Cette fabrication à la lumière s'appelle la **photosynthèse** ; elle libère du dioxygène.

**Vocabulaire**
- **Photosynthèse** : production de matière organique par la plante, à partir d'eau et de CO₂, grâce à la lumière.
- **Sels minéraux** : éléments dissous dans l'eau du sol, absorbés par les racines.

**Exemple**
> Une plante privée de lumière jaunit et ne grandit plus : sans lumière, pas de photosynthèse.

**Erreur classique**
- Penser que la plante « mange » sa nourriture par les racines : elle fabrique sa matière elle-même à la lumière.$md$),

    ('svt', '6e', 'L''origine de nos aliments', $md$# L'origine de nos aliments — l'essentiel

**À retenir**
- Nos aliments proviennent d'êtres vivants : **végétaux** (blé, légumes) ou **animaux** (viande, lait, œufs).
- La production repose sur l'**élevage** et la **culture**, qui dépendent d'êtres vivants comme les micro-organismes.
- Certains aliments sont **transformés** par des **micro-organismes** (levures, bactéries) : pain, yaourt, fromage.

**Vocabulaire**
- **Micro-organisme** : être vivant invisible à l'œil nu (bactérie, levure, moisissure).
- **Fermentation** : transformation d'un aliment par des micro-organismes.

**Exemple**
> Le yaourt est obtenu par l'action de bactéries qui transforment le lait.

**Erreur classique**
- Croire que tous les micro-organismes sont dangereux : beaucoup sont utiles à l'alimentation.$md$),

    ('svt', '6e', 'La Terre dans le système solaire', $md$# La Terre dans le système solaire — l'essentiel

**À retenir**
- La Terre tourne sur **elle-même en 24 h** (jour/nuit) et autour du **Soleil en 1 an** (saisons).
- L'**alternance jour/nuit** vient de la rotation de la Terre, qui expose tour à tour une face au Soleil.
- Les **saisons** viennent de l'**inclinaison** de l'axe de la Terre au cours de sa révolution.

**Vocabulaire**
- **Rotation** : la Terre tourne sur son axe (donne le jour et la nuit).
- **Révolution** : la Terre tourne autour du Soleil (donne l'année).

**Exemple**
> En été, l'hémisphère Nord est incliné vers le Soleil : les journées sont longues et chaudes.

**Erreur classique**
- Croire que les saisons viennent de la distance Terre–Soleil : c'est l'inclinaison de l'axe qui compte.$md$),

    ('svt', '5e', 'La nutrition des êtres vivants', $md$# La nutrition des êtres vivants — l'essentiel

**À retenir**
- Se nourrir apporte à l'organisme la **matière** et l'**énergie** dont il a besoin.
- Les **nutriments** issus de la digestion passent dans le **sang** au niveau de l'intestin.
- Le sang **distribue** nutriments et dioxygène à tous les **organes**, qui les utilisent.

**Vocabulaire**
- **Nutriment** : petite molécule issue de la digestion des aliments, utilisable par les cellules.
- **Organe** : partie du corps ayant une fonction (cœur, muscle, poumon).

**Exemple**
> Après un repas, le glucose passe dans le sang au niveau de l'intestin puis nourrit les muscles.

**Erreur classique**
- Confondre aliment et nutriment : l'aliment doit d'abord être digéré en nutriments pour passer dans le sang.$md$),

    ('svt', '5e', 'La respiration en milieux variés', $md$# La respiration en milieux variés — l'essentiel

**À retenir**
- Respirer, c'est **prélever du dioxygène** (O₂) dans le milieu et **rejeter du dioxyde de carbone** (CO₂).
- Les **organes respiratoires** varient selon le milieu : **poumons** (air), **branchies** (eau), **trachées** (insectes).
- Les êtres vivants **occupent** un milieu selon la quantité de dioxygène disponible.

**Vocabulaire**
- **Branchies** : organes qui prélèvent le dioxygène dissous dans l'eau.
- **Trachées** : fins tubes qui amènent l'air aux organes des insectes.

**Exemple**
> Le poisson prélève le O₂ dissous dans l'eau grâce à ses branchies ; il meurt hors de l'eau.

**Erreur classique**
- Croire que les poissons respirent l'eau : ils respirent le dioxygène **dissous dans** l'eau.$md$),

    ('svt', '5e', 'Géologie externe : les paysages', $md$# Géologie externe : les paysages — l'essentiel

**À retenir**
- Les paysages se **transforment** sous l'action de l'eau, du vent, du gel : c'est l'**érosion**.
- Les débris arrachés sont **transportés** puis **déposés** : ce sont les **sédiments**.
- Ces sédiments s'accumulent et se compactent en **roches sédimentaires** (grès, calcaire).

**Vocabulaire**
- **Érosion** : usure et arrachement des roches par l'eau, le vent ou la glace.
- **Sédiment** : dépôt de particules (sable, argile) transportées par l'eau ou le vent.

**Exemple**
> Une rivière arrache des grains de sable, les transporte, puis les dépose au fond : au fil du temps ils forment du grès.

**Erreur classique**
- Croire que le relief est figé : les paysages évoluent en permanence, mais très lentement.$md$),

    ('svt', '5e', 'La reproduction sexuée', $md$# La reproduction sexuée — l'essentiel

**À retenir**
- La reproduction sexuée nécessite **deux cellules reproductrices** : une **mâle** et une **femelle**.
- Leur rencontre est la **fécondation** ; elle forme une **cellule-œuf** qui se développe en nouvel individu.
- Elle assure la **survie de l'espèce** et produit des descendants **variés**.

**Vocabulaire**
- **Fécondation** : union d'une cellule reproductrice mâle et d'une femelle.
- **Cellule-œuf** : première cellule du nouvel être vivant, issue de la fécondation.

**Exemple**
> Chez les plantes à fleurs, le pollen (mâle) féconde l'ovule (femelle) : il se forme une graine.

**Erreur classique**
- Confondre fécondation et naissance : la fécondation est le tout début, bien avant la naissance.$md$),

    ('svt', '5e', 'Les besoins de l''organisme', $md$# Les besoins de l'organisme — l'essentiel

**À retenir**
- Lors d'un **effort**, les muscles consomment davantage de **dioxygène** et de **nutriments** (glucose).
- Le **rythme cardiaque** et la **respiration** augmentent pour approvisionner les muscles plus vite.
- Une **alimentation équilibrée** et une activité physique régulière entretiennent la santé.

**Vocabulaire**
- **Rythme cardiaque** : nombre de battements du cœur par minute.
- **Besoin énergétique** : quantité d'énergie dont le corps a besoin, plus élevée pendant l'effort.

**Exemple**
> Pendant une course, le cœur bat plus vite pour livrer plus de dioxygène et de glucose aux muscles.

**Erreur classique**
- Croire que l'essoufflement est inutile : respirer plus vite sert à apporter davantage de dioxygène.$md$),

    ('svt', '4e', 'L''activité interne du globe', $md$# L'activité interne du globe — l'essentiel

**À retenir**
- La surface de la Terre est découpée en **plaques lithosphériques** qui se **déplacent** lentement.
- Un **séisme** est une **rupture brutale de roches** en profondeur ; l'énergie se propage en ondes sismiques.
- Un **volcan** émet du **magma** (roche fondue) qui remonte et se refroidit en lave.

**Vocabulaire**
- **Séisme** : secousse due à la rupture des roches le long d'une faille.
- **Magma** : roche en fusion présente en profondeur.

**Exemple**
> Deux plaques qui coulissent accumulent des contraintes ; quand la roche casse, c'est le séisme.

**Erreur classique**
- Croire qu'un séisme « ouvre » la Terre : il vient de la **rupture** de roches sous tension, pas d'un trou qui s'ouvre.$md$),

    ('svt', '4e', 'La transmission de la vie', $md$# La transmission de la vie — l'essentiel

**À retenir**
- À la **puberté**, le corps devient capable de se reproduire (fabrication des cellules reproductrices).
- La **fécondation** unit un spermatozoïde et un ovule pour former une **cellule-œuf**.
- L'embryon se développe dans l'**utérus** ; il est nourri via le **placenta**.

**Vocabulaire**
- **Spermatozoïde / ovule** : cellules reproductrices mâle et femelle.
- **Placenta** : organe qui assure les échanges (nutriments, dioxygène) entre la mère et le fœtus.

**Exemple**
> Après la fécondation, la cellule-œuf se divise et s'installe dans l'utérus où elle se développe pendant 9 mois.

**Erreur classique**
- Croire que le sang de la mère et du fœtus se mélangent : les échanges se font à travers le placenta, sans mélange direct.$md$),

    ('svt', '4e', 'Le système nerveux', $md$# Le système nerveux — l'essentiel

**À retenir**
- Le système nerveux comprend le **cerveau**, la **moelle épinière** et les **nerfs**.
- Les organes des sens captent un **message** transformé en **message nerveux**, transmis par les nerfs.
- Le **cerveau** reçoit, analyse et commande une **réponse** (mouvement d'un muscle).

**Vocabulaire**
- **Neurone** : cellule du système nerveux qui transmet le message nerveux.
- **Nerf** : câble reliant les organes au cerveau et à la moelle épinière.

**Exemple**
> Je vois un ballon : l'œil envoie un message au cerveau, qui commande aux muscles d'attraper.

**Erreur classique**
- Croire que le message nerveux circule dans le sang : il circule le long des neurones et des nerfs.$md$),

    ('svt', '4e', 'Météorologie et climats', $md$# Météorologie et climats — l'essentiel

**À retenir**
- La **météo** décrit le temps qu'il fait à un endroit, à un moment donné (court terme).
- Le **climat** décrit les conditions moyennes d'une région sur de **longues durées** (30 ans).
- L'atmosphère et les **océans** font circuler l'air et l'eau : ils répartissent la chaleur sur la planète.

**Vocabulaire**
- **Météorologie** : étude du temps à court terme (pluie, vent, température du jour).
- **Climat** : ensemble des conditions moyennes d'une région sur de nombreuses années.

**Exemple**
> Un orage aujourd'hui = météo ; « la région a des étés chauds et secs » = climat.

**Erreur classique**
- Confondre météo et climat : un jour de froid ne remet pas en cause le réchauffement climatique (tendance longue).$md$),

    ('svt', '3e', 'Le programme génétique', $md$# Le programme génétique — l'essentiel

**À retenir**
- Chaque cellule contient un **noyau** avec des **chromosomes** faits d'**ADN**.
- L'**ADN** porte l'**information génétique** sous forme de **gènes** ; un gène commande un caractère.
- L'espèce humaine possède **23 paires de chromosomes** dans chaque cellule.

**Vocabulaire**
- **ADN** : molécule support de l'information génétique.
- **Gène** : portion d'ADN qui détermine un caractère (couleur des yeux, groupe sanguin).

**Exemple**
> Le gène du groupe sanguin, porté par l'ADN, détermine si l'on est A, B, AB ou O.

**Erreur classique**
- Confondre chromosome, gène et ADN : l'ADN forme le chromosome, et un gène est un morceau d'ADN.$md$),

    ('svt', '3e', 'L''évolution des espèces', $md$# L'évolution des espèces — l'essentiel

**À retenir**
- Les espèces actuelles descendent d'espèces **anciennes** : c'est l'**évolution**.
- Les individus varient ; ceux les mieux **adaptés** à leur milieu survivent et se reproduisent davantage : c'est la **sélection naturelle**.
- Les **fossiles** témoignent des espèces disparues et de cette histoire.

**Vocabulaire**
- **Évolution** : transformation des espèces au cours des générations.
- **Sélection naturelle** : les individus les mieux adaptés transmettent plus souvent leurs caractères.

**Exemple**
> Des insectes résistants à un insecticide survivent et se reproduisent : la population devient résistante.

**Erreur classique**
- Croire qu'un individu « décide » de s'adapter : la sélection agit sur des variations déjà présentes dans la population.$md$),

    ('svt', '3e', 'Le système immunitaire', $md$# Le système immunitaire — l'essentiel

**À retenir**
- L'organisme se défend contre les **micro-organismes** (bactéries, virus) grâce au **système immunitaire**.
- Les **globules blancs** (phagocytes) détruisent les intrus par **phagocytose**.
- Certains globules blancs fabriquent des **anticorps** qui neutralisent un microbe précis (réponse spécifique).

**Vocabulaire**
- **Antigène** : élément étranger reconnu par le système immunitaire.
- **Anticorps** : molécule produite par certains globules blancs, dirigée contre un antigène précis.

**Exemple**
> Un phagocyte englobe et digère une bactérie ; c'est la phagocytose, première ligne de défense.

**Erreur classique**
- Croire qu'un anticorps agit contre tous les microbes : chaque anticorps est **spécifique** d'un seul antigène.$md$),

    ('svt', '3e', 'Santé et responsabilité', $md$# Santé et responsabilité — l'essentiel

**À retenir**
- La **vaccination** entraîne le corps à fabriquer des anticorps sans tomber malade : elle **prévient**.
- Les **antibiotiques** soignent les infections **bactériennes** (ils sont inefficaces contre les virus).
- Une bonne **hygiène de vie** (alimentation, sommeil, activité) protège la santé.

**Vocabulaire**
- **Vaccin** : préparation qui déclenche une réponse immunitaire mémorisée, sans danger.
- **Antibiotique** : médicament qui tue les bactéries ou bloque leur multiplication.

**Exemple**
> Le vaccin contre la grippe apprend au corps à reconnaître le virus avant toute infection.

**Erreur classique**
- Prendre un antibiotique contre un rhume (viral) : il est inutile et favorise l'antibiorésistance.$md$),

    ('svt', '3e', 'Les risques géologiques', $md$# Les risques géologiques — l'essentiel

**À retenir**
- Un **aléa** est un phénomène naturel dangereux (séisme, éruption) ; un **risque** naît quand des personnes sont exposées.
- La **surveillance** (sismographes, capteurs) permet d'**anticiper** et d'alerter.
- La **prévention** (constructions parasismiques, plans d'évacuation) réduit les dégâts.

**Vocabulaire**
- **Aléa** : phénomène naturel potentiellement dangereux.
- **Risque** : combinaison d'un aléa et de la présence d'une population exposée.

**Exemple**
> Une région sismique très peuplée présente un risque élevé ; des immeubles parasismiques le réduisent.

**Erreur classique**
- Confondre aléa et risque : un séisme en plein désert inhabité est un aléa mais un risque quasi nul.$md$)
  ) AS v(slug, level, chapter, md)
  JOIN public.subjects s ON s.slug = v.slug
  JOIN public.chapters c
    ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
 WHERE l.chapter_id = c.id
   AND l.title = 'L''essentiel du cours'
   AND l.revision_sheet IS DISTINCT FROM v.md;
