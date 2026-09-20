-- =============================================================================
-- Studuel — Migration 073 : fiches de révision SES lycée (2de · 1re · Tle)
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
    ('ses', '2de', 'Comment raisonnent les économistes ?', $md$# Comment raisonnent les économistes ? — l'essentiel

**À retenir**
- L'économie étudie comment des **ressources rares** sont utilisées pour satisfaire des **besoins illimités** : tout choix implique un renoncement.
- Un agent rationnel compare le **coût** et le **bénéfice** de chaque option avant de décider.
- Les économistes construisent des **modèles** : des représentations simplifiées du réel « toutes choses égales par ailleurs ».

**Notions**
- **Rareté** : une ressource est rare quand elle est disponible en quantité limitée face aux besoins.
- **Coût d'opportunité** : ce à quoi on renonce quand on choisit une option plutôt qu'une autre.
- **Utilité** : la satisfaction qu'un bien ou un service procure à celui qui le consomme.

**Exemple**
> Passer une heure à réviser plutôt qu'à travailler pour un salaire : le coût d'opportunité de la révision est le salaire non gagné.

**Erreur classique**
- Croire que « gratuit » signifie « sans coût » : même un bien gratuit a un coût d'opportunité (le temps, l'usage alternatif).$md$),

    ('ses', '2de', 'La production', $md$# La production — l'essentiel

**À retenir**
- **Produire**, c'est créer des biens ou des services en combinant des **facteurs de production**.
- Les deux grands facteurs sont le **travail** (main-d'œuvre) et le **capital** (machines, locaux, outils).
- La **valeur ajoutée** mesure la richesse réellement créée par une entreprise.

**Notions**
- **Facteur travail** : ensemble des heures de travail humain mobilisées dans la production.
- **Facteur capital** : biens durables utilisés pour produire (capital fixe), distincts des consommations intermédiaires.
- **Valeur ajoutée** = valeur de la production − consommations intermédiaires. La somme des VA donne le PIB.

**Exemple**
> Un boulanger qui vend 1 000 € de pain avec 300 € de farine et d'énergie crée une valeur ajoutée de 700 €.

**Erreur classique**
- Confondre chiffre d'affaires et valeur ajoutée : le chiffre d'affaires inclut ce qui a été acheté à d'autres, la VA ne compte que la richesse ajoutée.$md$),

    ('ses', '2de', 'Comment se forment les prix ?', $md$# Comment se forment les prix ? — l'essentiel

**À retenir**
- Sur un **marché** concurrentiel, le prix résulte de la rencontre entre l'**offre** et la **demande**.
- La **demande** diminue quand le prix augmente ; l'**offre** augmente quand le prix augmente.
- Le **prix d'équilibre** est celui pour lequel la quantité offerte égale la quantité demandée.

**Mécanisme**
- **Offre** : quantité qu'un producteur est prêt à vendre à chaque prix (courbe croissante).
- **Demande** : quantité que les consommateurs veulent acheter à chaque prix (courbe décroissante).
- Si le prix est trop haut → surplus (offre > demande) → le prix baisse. S'il est trop bas → pénurie → le prix monte.

**Exemple**
> Une récolte de blé abondante augmente l'offre : la courbe se déplace, le prix d'équilibre baisse.

**Erreur classique**
- Confondre un mouvement le long de la courbe (variation du prix) et un déplacement de toute la courbe (variation d'un autre facteur : revenu, météo, mode).$md$),

    ('ses', '2de', 'La socialisation', $md$# La socialisation — l'essentiel

**À retenir**
- La **socialisation** est le processus par lequel un individu intériorise les normes et valeurs de sa société.
- La **socialisation primaire** (enfance) est la plus déterminante ; la **socialisation secondaire** (âge adulte) la complète et parfois la transforme.
- Les **instances de socialisation** (famille, école, groupe de pairs, médias) transmettent ces repères.

**Notions**
- **Norme** : règle de conduite attendue dans une situation donnée (dire bonjour, respecter la file).
- **Valeur** : idéal auquel une société adhère (la liberté, l'égalité, la réussite).
- **Socialisation différentielle** : filles et garçons, milieux sociaux différents ne sont pas socialisés de la même manière.

**Exemple**
> Un enfant à qui l'on offre une dînette et à qui on interdit de se battre intériorise des rôles de genre par la socialisation primaire.

**Erreur classique**
- Penser que la socialisation « programme » totalement l'individu : elle oriente les comportements mais laisse une marge d'autonomie et peut être reconfigurée à l'âge adulte.$md$),

    ('ses', '1re', 'Le marché et ses défaillances', $md$# Le marché et ses défaillances — l'essentiel

**À retenir**
- Un marché concurrentiel alloue efficacement les ressources, mais il peut **échouer** (défaillances de marché).
- Les principales défaillances sont les **externalités**, les **biens communs/publics** et les **asymétries d'information**.
- L'**intervention publique** (taxe, subvention, réglementation) peut corriger ces défaillances.

**Mécanisme**
- **Externalité** : effet d'une activité sur un tiers, sans compensation par le prix (négative : pollution ; positive : vaccination).
- **Bien public** : non rival et non excluable (éclairage public) → le marché le sous-produit.
- **Asymétrie d'information** : une partie en sait plus que l'autre (marché de l'occasion), ce qui fausse les échanges.

**Exemple**
> Une usine qui pollue une rivière impose un coût aux riverains : une **taxe** (principe pollueur-payeur) internalise cette externalité négative.

**Erreur classique**
- Croire qu'une défaillance de marché justifie toujours l'État : l'intervention publique a elle aussi des coûts et des limites (défaillances de l'État).$md$),

    ('ses', '1re', 'La monnaie et le financement', $md$# La monnaie et le financement — l'essentiel

**À retenir**
- La monnaie remplit trois fonctions : **unité de compte**, **intermédiaire des échanges** et **réserve de valeur**.
- Les banques commerciales **créent de la monnaie** en accordant des crédits (« les crédits font les dépôts »).
- Les agents à besoin de financement se financent par **autofinancement**, **crédit bancaire** (indirect) ou **marchés financiers** (direct).

**Mécanisme**
- **Création monétaire** : quand une banque accorde un prêt, elle inscrit une somme au compte de l'emprunteur → la masse monétaire augmente. Le remboursement détruit cette monnaie.
- La **banque centrale** encadre cette création via le taux directeur et supervise la monnaie.
- **Financement direct** (émission d'actions/obligations) vs **indirect** (intermédiation bancaire).

**Exemple**
> Une banque prête 10 000 € à un ménage pour une voiture : elle crée ces 10 000 € ex nihilo en créditant le compte, sans puiser dans les dépôts existants.

**Erreur classique**
- Croire que les banques ne prêtent que l'argent déjà déposé : l'essentiel de la monnaie est de la monnaie scripturale créée par le crédit.$md$),

    ('ses', '1re', 'Socialisation et groupes sociaux', $md$# Socialisation et groupes sociaux — l'essentiel

**À retenir**
- La socialisation se poursuit toute la vie : la **socialisation secondaire** (travail, couple, associations) reconfigure les acquis de l'enfance.
- Un **groupe social** rassemble des individus en interaction ayant conscience d'une appartenance commune.
- On distingue le **groupe d'appartenance** (celui auquel on appartient) du **groupe de référence** (celui auquel on veut ressembler).

**Notions**
- **Groupe primaire** : petit, relations directes et affectives (famille, bande d'amis).
- **Groupe secondaire** : plus large, relations plus formelles et fonctionnelles (entreprise, syndicat).
- **Socialisation anticipatrice** : adopter par avance les normes du groupe que l'on souhaite intégrer.

**Exemple**
> Un étudiant qui adopte le langage et les codes vestimentaires de la profession qu'il vise pratique une socialisation anticipatrice.

**Erreur classique**
- Confondre groupe social et simple catégorie statistique : « les 15-25 ans » forment une catégorie, pas nécessairement un groupe (pas d'interaction ni de conscience commune).$md$),

    ('ses', '1re', 'L''opinion publique', $md$# L'opinion publique — l'essentiel

**À retenir**
- L'**opinion publique** désigne les jugements partagés par une population sur les questions de société.
- Les **sondages** prétendent la mesurer mais la construisent en partie (choix des questions, échantillon).
- La formation de l'opinion est influencée par les **médias**, la position sociale et les interactions.

**Notions**
- **Sondage** : enquête sur un échantillon représentatif visant à estimer une opinion à un instant donné.
- **Effet de contexte** : la formulation ou l'ordre des questions modifie les réponses.
- **Agenda médiatique** : les sujets mis en avant par les médias orientent ce dont l'opinion se saisit.

**Exemple**
> Selon qu'on demande d'« interdire » ou de « ne pas autoriser » une pratique, un sondage peut donner des résultats sensiblement différents.

**Erreur classique**
- Prendre un sondage pour une photographie neutre de l'opinion : c'est une mesure encadrée par une marge d'erreur et façonnée par le protocole d'enquête.$md$),

    ('ses', 'Tle', 'Croissance et environnement', $md$# Croissance et environnement — l'essentiel

**À retenir**
- La **croissance économique** est l'augmentation durable de la production, mesurée par le **PIB**.
- Elle repose sur l'accumulation de facteurs et surtout sur les **gains de productivité** liés au **progrès technique**.
- La soutenabilité interroge la compatibilité entre croissance et préservation du **capital naturel**.

**Notions**
- **PIB** : somme des valeurs ajoutées produites sur un territoire pendant un an ; indicateur imparfait du bien-être.
- **Productivité globale des facteurs** : efficacité de la combinaison travail-capital, moteur de la croissance (théorie de la croissance endogène).
- **Soutenabilité faible / forte** : le capital naturel est-il substituable par du capital technique (faible) ou irremplaçable (forte) ?

**Exemple**
> Le progrès technique permet de produire plus avec autant de facteurs ; mais épuiser une ressource non renouvelable réduit le capital naturel légué aux générations futures.

**Erreur classique**
- Assimiler croissance du PIB et progrès du bien-être : le PIB ignore les inégalités, le travail domestique et la dégradation de l'environnement.$md$),

    ('ses', 'Tle', 'Le commerce international', $md$# Le commerce international — l'essentiel

**À retenir**
- Les pays échangent car ils se **spécialisent** dans ce qu'ils produisent le plus efficacement.
- La théorie de l'**avantage comparatif** (Ricardo) montre qu'un pays gagne à se spécialiser même s'il est moins performant partout.
- Le **libre-échange** accroît le bien-être global mais fait des perdants (secteurs concurrencés).

**Mécanisme**
- **Avantage comparatif** (Ricardo) : un pays doit se spécialiser là où son coût d'opportunité est le plus faible, pas seulement là où il est le meilleur en absolu.
- **Libre-échange** vs **protectionnisme** (droits de douane, quotas) : protéger un secteur a un coût pour les consommateurs.
- **Décomposition internationale des processus productifs** : les biens sont fabriqués via des chaînes de valeur mondiales.

**Exemple**
> Si le Portugal produit le vin à moindre coût relatif et l'Angleterre le drap, chacun se spécialise et les deux gagnent à l'échange (exemple de Ricardo).

**Erreur classique**
- Confondre avantage **absolu** (produire à moindre coût) et avantage **comparatif** (coût d'opportunité le plus faible) : c'est ce dernier qui fonde la spécialisation.$md$),

    ('ses', 'Tle', 'Les mutations du travail', $md$# Les mutations du travail — l'essentiel

**À retenir**
- L'**emploi** se transforme : tertiarisation, montée des qualifications et diversité des statuts.
- Le **chômage** peut être conjoncturel (lié à l'activité) ou structurel (inadéquation durable).
- Le travail reste un facteur d'**intégration sociale**, mais les formes atypiques (précarité, indépendants) le fragilisent.

**Notions**
- **Population active** : personnes en emploi + chômeurs (au sens du BIT : sans emploi, disponibles, en recherche).
- **Chômage structurel** : dû à un décalage durable entre qualifications offertes et demandées ou à des rigidités du marché.
- **Polarisation de l'emploi** : croissance des emplois très qualifiés et peu qualifiés, recul des emplois intermédiaires (automatisation).

**Exemple**
> Un salarié dont le poste est automatisé et qui ne retrouve pas d'emploi faute de qualification adaptée relève du chômage structurel, non conjoncturel.

**Erreur classique**
- Confondre inactif et chômeur : un étudiant ou un retraité est inactif ; le chômeur, lui, recherche activement un emploi.$md$),

    ('ses', 'Tle', 'La justice sociale', $md$# La justice sociale — l'essentiel

**À retenir**
- La **justice sociale** vise une répartition jugée équitable des ressources et des positions.
- On distingue l'**égalité des droits**, l'**égalité des chances** et l'**égalité des situations**.
- L'action des pouvoirs publics passe par la **redistribution**, la **fiscalité** et la **protection sociale**.

**Notions**
- **Équité vs égalité** : l'équité peut justifier des traitements différenciés (discrimination positive) pour corriger des inégalités de départ.
- **Redistribution** : prélèvements (impôts, cotisations) et prestations qui réduisent les écarts de revenu (horizontale et verticale).
- **Égalité des chances** : donner à chacun les mêmes possibilités de réussite, indépendamment de son origine.

**Exemple**
> Un impôt progressif prélève une part plus forte sur les hauts revenus : c'est un instrument de redistribution verticale au service de la justice sociale.

**Erreur classique**
- Réduire la justice sociale à l'égalité stricte des revenus : la plupart des théories admettent certaines inégalités si elles profitent aux plus défavorisés (Rawls) ou récompensent le mérite.$md$)
  ) AS v(slug, level, chapter, md)
  JOIN public.subjects s ON s.slug = v.slug
  JOIN public.chapters c
    ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
 WHERE l.chapter_id = c.id
   AND l.title = 'L''essentiel du cours'
   AND l.revision_sheet IS DISTINCT FROM v.md;
