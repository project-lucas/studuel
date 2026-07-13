-- =============================================================================
-- Studuel — Migration 068 : fiches de révision SVT lycée (2de · 1re · Tle)
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
    ('svt', '2de', 'La cellule, unité du vivant', $md$# La cellule, unité du vivant — l'essentiel

**À retenir**
- La **cellule** est l'unité structurale et fonctionnelle de tous les êtres vivants (théorie cellulaire).
- Toute cellule est délimitée par une **membrane plasmique** et contient du **cytoplasme** et de l'**ADN**.
- Deux grands types : **procaryote** (ADN libre, sans noyau, ex. bactérie) et **eucaryote** (ADN dans un noyau, ex. cellule animale, végétale).
- Le **métabolisme** de la cellule repose sur ses organites (mitochondries, chloroplastes chez les végétaux).

**Vocabulaire**
- **Membrane plasmique** : bicouche de phospholipides qui contrôle les échanges avec l'extérieur.
- **Organite** : structure spécialisée du cytoplasme (mitochondrie, noyau, chloroplaste…).
- **Eucaryote / procaryote** : avec / sans noyau délimité par une enveloppe.

**Exemple**
> La bactérie *Escherichia coli* est procaryote : son ADN circulaire baigne dans le cytoplasme, sans noyau. Une cellule de peau humaine est eucaryote : son ADN est enfermé dans un noyau.

**Erreur classique**
- Croire que toutes les cellules ont un noyau : les procaryotes (bactéries) n'en ont pas, leur ADN est libre.$md$),

    ('svt', '2de', 'Biodiversité et évolution', $md$# Biodiversité et évolution — l'essentiel

**À retenir**
- La **biodiversité** se décline à trois échelles : diversité des **écosystèmes**, des **espèces** et des **gènes** (allèles).
- La biodiversité **change au cours du temps** sous l'effet de la sélection naturelle et du hasard (dérive).
- La **sélection naturelle** favorise les individus dont les caractères héréditaires augmentent la survie et la reproduction dans un milieu donné.

**Mécanisme : la sélection naturelle**
1. Les individus d'une population présentent des **variations héréditaires**.
2. Le milieu **sélectionne** ceux qui survivent et se reproduisent le mieux.
3. Génération après génération, les allèles avantageux deviennent plus **fréquents** : la population évolue.

**Exemple**
> La phalène du bouleau : durant la révolution industrielle, la forme sombre du papillon, mieux camouflée sur les troncs noircis de suie, a été favorisée face aux prédateurs.

**Erreur classique**
- Penser que l'individu « s'adapte » volontairement. L'évolution agit sur une **population** via le tri d'individus, pas par la volonté d'un individu.$md$),

    ('svt', '2de', 'Le métabolisme cellulaire', $md$# Le métabolisme cellulaire — l'essentiel

**À retenir**
- Le **métabolisme** est l'ensemble des réactions chimiques d'une cellule, contrôlées par des **enzymes**.
- La **respiration** dégrade le glucose en présence de dioxygène et libère beaucoup d'énergie (dans les mitochondries).
- La **photosynthèse** produit de la matière organique (glucose) à partir de CO₂, d'eau et de **lumière** (dans les chloroplastes).
- Une cellule est **autotrophe** si elle fabrique sa matière organique, **hétérotrophe** si elle la prélève.

**Mécanisme : respiration et photosynthèse**
- Respiration : glucose + dioxygène → dioxyde de carbone + eau + énergie.
- Photosynthèse : dioxyde de carbone + eau + lumière → glucose + dioxygène.

**Exemple**
> Une cellule de feuille verte réalise la photosynthèse le jour (chloroplastes) ET respire en permanence (mitochondries).

**Erreur classique**
- Croire que les végétaux ne respirent pas. Ils respirent en permanence ; la photosynthèse s'ajoute quand il y a de la lumière.$md$),

    ('svt', '2de', 'Érosion et sédimentation', $md$# Érosion et sédimentation — l'essentiel

**À retenir**
- L'**altération** (chimique et physique) fragmente les roches ; l'**érosion** arrache et transporte les débris.
- Les agents de transport sont l'eau, le vent, la glace et la gravité.
- Les débris se déposent puis se transforment en **roches sédimentaires** par **sédimentation** puis **diagenèse** (compaction + cimentation).

**Vocabulaire**
- **Altération** : dégradation d'une roche sur place (gel, dissolution, action de l'eau).
- **Sédiment** : particule déposée après transport (sable, argile, galets).
- **Diagenèse** : ensemble des transformations qui durcissent un sédiment en roche (grès, calcaire).

**Exemple**
> Le sable d'une plage provient de l'érosion de roches continentales ; enfoui et cimenté sur des millions d'années, il forme du **grès**.

**Erreur classique**
- Confondre altération (fragmentation/dégradation sur place) et érosion (arrachement + transport des débris) : ce sont deux étapes distinctes.$md$),

    ('svt', '2de', 'Microorganismes et santé', $md$# Microorganismes et santé — l'essentiel

**À retenir**
- Les **microorganismes** (bactéries, virus, champignons microscopiques) sont partout ; la plupart sont inoffensifs ou utiles.
- Un **agent pathogène** est un microorganisme capable de provoquer une maladie ; sa transmission peut être directe ou indirecte.
- L'organisme se défend par des **barrières** (peau, muqueuses) et par le **système immunitaire**.
- L'**hygiène**, les **antibiotiques** (contre les bactéries) et la **vaccination** limitent les infections.

**Vocabulaire**
- **Pathogène** : microorganisme responsable d'une maladie.
- **Antibiotique** : molécule qui tue ou bloque les bactéries — **sans effet sur les virus**.
- **Microbiote** : ensemble des microorganismes utiles vivant dans/sur l'organisme (ex. intestin).

**Exemple**
> L'angine bactérienne se soigne par antibiotiques ; une grippe (virus) non, car les antibiotiques n'agissent pas sur les virus.

**Erreur classique**
- Prendre un antibiotique contre un virus (grippe, rhume) : c'est inutile et favorise l'apparition de bactéries résistantes.$md$),

    ('svt', '1re', 'Expression du patrimoine génétique', $md$# Expression du patrimoine génétique — l'essentiel

**À retenir**
- Un **gène** est une portion d'ADN qui porte l'information pour fabriquer une **protéine**.
- L'expression suit le sens **ADN → ARN messager → protéine**.
- La **transcription** (dans le noyau) copie le gène en ARN messager ; la **traduction** (dans le cytoplasme, par les ribosomes) convertit l'ARN en protéine.
- Le **code génétique** associe chaque **codon** (3 nucléotides) à un acide aminé ; il est **universel**.

**Mécanisme : transcription puis traduction**
1. **Transcription** : l'ADN du gène est copié en ARN messager dans le noyau.
2. L'ARN messager sort vers le cytoplasme.
3. **Traduction** : le ribosome lit les codons et assemble les acides aminés → protéine.

**Exemple**
> Le codon AUG code l'acide aminé méthionine et marque le début de la traduction.

**Erreur classique**
- Inverser le sens de l'information : c'est ADN → ARN → protéine (transcription puis traduction), jamais l'inverse dans ce cadre.$md$),

    ('svt', '1re', 'La dynamique interne de la Terre', $md$# La dynamique interne de la Terre — l'essentiel

**À retenir**
- La surface terrestre est découpée en **plaques lithosphériques** rigides qui se déplacent de quelques cm par an.
- Ces plaques reposent sur l'**asthénosphère**, plus ductile ; le moteur est la **convection** du manteau.
- Trois types de frontières : **divergence** (dorsales, création de lithosphère), **convergence** (subduction/collision) et **coulissage** (failles transformantes).
- Séismes et volcans se concentrent aux **frontières de plaques**.

**Mécanisme : la tectonique des plaques**
- À la **dorsale** : le magma remonte et crée de la lithosphère océanique (accrétion).
- En **subduction** : une plaque océanique dense plonge sous une autre plaque, générant séismes profonds et volcanisme.

**Exemple**
> La cordillère des Andes résulte de la subduction de la plaque océanique Nazca sous la plaque continentale sud-américaine.

**Erreur classique**
- Croire que les continents « flottent » et bougent seuls. C'est la **lithosphère** entière (croûte + manteau supérieur rigide) qui se déplace, portée par la convection.$md$),

    ('svt', '1re', 'Écosystèmes et services', $md$# Écosystèmes et services — l'essentiel

**À retenir**
- Un **écosystème** = une **biocénose** (êtres vivants) + un **biotope** (milieu physico-chimique) en interaction.
- L'énergie circule le long des **réseaux trophiques** (producteurs → consommateurs → décomposeurs) ; la matière est **recyclée**.
- Les écosystèmes rendent des **services écosystémiques** : approvisionnement, régulation (climat, eau), culturels.
- Les activités humaines peuvent **perturber** les écosystèmes (déforestation, pollution) et réduire ces services.

**Vocabulaire**
- **Biocénose / biotope** : le vivant / le milieu non vivant d'un écosystème.
- **Réseau trophique** : ensemble des relations alimentaires « qui mange qui ».
- **Service écosystémique** : bénéfice que l'humain tire du fonctionnement d'un écosystème (pollinisation, épuration de l'eau…).

**Exemple**
> Une forêt stocke du carbone, filtre l'eau et abrite des pollinisateurs : autant de services écosystémiques gratuits.

**Erreur classique**
- Penser que la matière est « consommée » et disparaît. Elle est **recyclée** par les décomposeurs, qui la remettent à disposition des producteurs.$md$),

    ('svt', '1re', 'Variation génétique et santé', $md$# Variation génétique et santé — l'essentiel

**À retenir**
- Une **mutation** est une modification de la séquence de l'ADN ; elle est la source de nouveaux **allèles**.
- Les mutations peuvent être **spontanées** (erreurs de réplication) ou provoquées par des **agents mutagènes** (UV, tabac, radiations).
- Une mutation dans une **cellule germinale** est transmissible à la descendance ; dans une **cellule somatique**, elle ne l'est pas mais peut favoriser un cancer.
- Certaines variations génétiques influencent la **sensibilité aux maladies**.

**Vocabulaire**
- **Mutation** : changement de la séquence d'ADN (substitution, insertion, délétion).
- **Agent mutagène** : facteur qui augmente le taux de mutations (rayons UV, tabac).
- **Cellule germinale / somatique** : cellule reproductrice (transmissible) / cellule du corps (non transmissible).

**Exemple**
> Une exposition répétée aux UV endommage l'ADN des cellules de la peau et augmente le risque de mélanome (cancer cutané).

**Erreur classique**
- Croire que toutes les mutations sont graves ou héréditaires. Beaucoup sont neutres, et seules celles des cellules germinales se transmettent aux enfants.$md$),

    ('svt', 'Tle', 'Génétique et évolution', $md$# Génétique et évolution — l'essentiel

**À retenir**
- La **méiose** produit des cellules reproductrices (gamètes) à **n chromosomes** ; la **fécondation** rétablit **2n**.
- Deux sources de **diversité génétique** des gamètes : le **brassage interchromosomique** (répartition aléatoire des chromosomes) et le **brassage intrachromosomique** (crossing-over entre chromosomes homologues).
- La fécondation, en réunissant au hasard deux gamètes, ajoute un brassage supplémentaire.
- À l'échelle des populations, **sélection naturelle** et **dérive génétique** font évoluer les fréquences alléliques.

**Mécanisme : les brassages de la méiose**
1. **Intrachromosomique** (prophase I) : crossing-over → échange de segments entre chromosomes homologues.
2. **Interchromosomique** (anaphase I) : chaque paire d'homologues se sépare indépendamment des autres.

**Exemple**
> Chez l'humain (2n = 46), la seule séparation indépendante des 23 paires génère 2²³ combinaisons de gamètes possibles, avant même les crossing-over.

**Erreur classique**
- Confondre les deux brassages : l'intrachromosomique se fait **au sein** d'une paire (crossing-over), l'interchromosomique **entre** les paires (répartition indépendante).$md$),

    ('svt', 'Tle', 'Le temps et les roches', $md$# Le temps et les roches — l'essentiel

**À retenir**
- La **datation relative** ordonne les événements grâce à des principes (superposition, recoupement, continuité, inclusion) sans donner d'âge chiffré.
- La **datation absolue** donne un âge en années en mesurant la **désintégration radioactive** d'éléments (méthodes radiochronologiques).
- Chaque radioélément a une **demi-vie** constante : temps au bout duquel la moitié des noyaux se sont désintégrés.
- Le choix de la méthode (¹⁴C, K-Ar, U-Pb…) dépend de l'ordre de grandeur de l'âge à mesurer.

**Vocabulaire**
- **Principe de superposition** : une couche est plus récente que celle qu'elle recouvre.
- **Demi-vie** : durée au bout de laquelle la moitié d'un radioélément s'est désintégrée.
- **Datation absolue** : mesure d'un âge chiffré via la radioactivité.

**Exemple**
> Le carbone 14 (demi-vie ≈ 5730 ans) date des restes organiques récents (< 50 000 ans) ; l'uranium-plomb date des roches de plusieurs milliards d'années.

**Erreur classique**
- Utiliser le carbone 14 pour dater une roche ancienne : sa demi-vie est trop courte, il n'en resterait plus de mesurable au-delà de ~50 000 ans.$md$),

    ('svt', 'Tle', 'Les climats de la Terre', $md$# Les climats de la Terre — l'essentiel

**À retenir**
- Le **climat** est l'ensemble des conditions atmosphériques moyennes sur plusieurs décennies (à ne pas confondre avec la météo).
- Les **gaz à effet de serre** (CO₂, CH₄, vapeur d'eau) retiennent une partie du rayonnement infrarouge et réchauffent la surface.
- Le **cycle du carbone** échange le carbone entre atmosphère, océans, biosphère et roches ; il régule le CO₂ sur le long terme.
- Depuis l'ère industrielle, les activités humaines augmentent le CO₂ atmosphérique et provoquent un **réchauffement global**.

**Mécanisme : l'effet de serre**
1. Le Soleil chauffe la surface terrestre.
2. La Terre réémet de l'énergie sous forme d'**infrarouges**.
3. Les gaz à effet de serre **absorbent** une partie de ces infrarouges et en renvoient vers le sol → réchauffement.

**Exemple**
> Les **carottes de glace** polaires piègent des bulles d'air anciennes : elles montrent que le CO₂ actuel dépasse largement les niveaux des derniers 800 000 ans.

**Erreur classique**
- Confondre météo et climat. Un hiver froid ne contredit pas le réchauffement climatique, qui est une **tendance moyenne sur des décennies**.$md$),

    ('svt', 'Tle', 'Comportement et stress', $md$# Comportement et stress — l'essentiel

**À retenir**
- Le **stress aigu** est une réponse de l'organisme à une situation perçue comme menaçante, préparant à l'action.
- Il combine une réponse **nerveuse** rapide (système sympathique, **adrénaline**) et une réponse **hormonale** plus lente (**cortisol**).
- Ces réponses augmentent le rythme cardiaque, la glycémie et la vigilance (« combat ou fuite »).
- Un **stress chronique** (prolongé) devient délétère : fatigue, troubles cardiovasculaires, immunitaires.

**Mécanisme : l'axe du stress**
1. Le cerveau perçoit un stimulus stressant.
2. Réponse rapide : le système sympathique libère de l'**adrénaline** (cœur, respiration ↑).
3. Réponse lente : l'axe hypothalamo-hypophysaire déclenche la sécrétion de **cortisol** par les glandes surrénales.
4. Un rétrocontrôle ramène normalement l'organisme à l'équilibre.

**Exemple**
> Avant un examen, l'adrénaline accélère le cœur ; si le stress persiste des semaines, le cortisol élevé nuit au sommeil et aux défenses immunitaires.

**Erreur classique**
- Voir le stress comme uniquement négatif. Le stress **aigu** est adaptatif ; c'est le stress **chronique** qui devient pathologique.$md$),

    ('svt', 'Tle', 'De la plante sauvage à la plante cultivée', $md$# De la plante sauvage à la plante cultivée — l'essentiel

**À retenir**
- La **plante fixée** possède une organisation qui compense l'immobilité : grande surface d'échange avec l'air (feuilles) et le sol (racines).
- Elle réalise la **photosynthèse** (matière organique) et assure sa reproduction souvent grâce à des **interactions** (pollinisateurs, dispersion des graines).
- La **domestication** a transformé les plantes sauvages en plantes cultivées par **sélection** des caractères utiles (rendement, taille des fruits, absence de toxines).
- Les techniques modernes (sélection, hybridation, transgenèse) prolongent cette action humaine sur le génome des plantes.

**Vocabulaire**
- **Plante fixée** : organisme qui vit ancré, sans se déplacer, d'où des adaptations morphologiques.
- **Domestication** : transformation d'une espèce sauvage en espèce cultivée par sélection humaine sur des générations.
- **Sélection variétale** : choix et croisement des individus aux caractères recherchés.

**Exemple**
> Le maïs cultivé descend de la **téosinte**, une graminée sauvage aux minuscules épis ; des millénaires de sélection ont produit les gros épis actuels.

**Erreur classique**
- Croire que les plantes cultivées sont « naturelles » telles quelles. Elles résultent d'une **sélection humaine** longue qui a modifié leur génome par rapport aux formes sauvages.$md$)
  ) AS v(slug, level, chapter, md)
  JOIN public.subjects s ON s.slug = v.slug
  JOIN public.chapters c
    ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
 WHERE l.chapter_id = c.id
   AND l.title = 'L''essentiel du cours'
   AND l.revision_sheet IS DISTINCT FROM v.md;
