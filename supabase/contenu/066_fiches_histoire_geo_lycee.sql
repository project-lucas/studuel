-- =============================================================================
-- Studuel — Migration 066 : fiches de révision Histoire-Géo lycée (2de · 1re · Tle)
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
    ('histoire-geo', '2de', 'La Méditerranée antique', $md$# La Méditerranée antique — l'essentiel

**À retenir**
- **Athènes au Ve siècle av. J.-C.** invente la **démocratie** : les citoyens votent à l'Ecclésia (assemblée), mais femmes, esclaves et métèques en sont exclus.
- **Rome** passe de la **République** (509 av. J.-C.) à l'**Empire** avec Auguste (27 av. J.-C.), puis diffuse la **citoyenneté** (édit de Caracalla, 212 apr. J.-C.).
- Ces deux modèles fondent l'idée occidentale de **citoyenneté** et de **cité** (polis, civitas).

**Dates clés**
- 508-507 av. J.-C. : réformes de Clisthène, naissance de la démocratie athénienne.
- 27 av. J.-C. : Auguste devient le premier empereur romain.
- 212 apr. J.-C. : édit de Caracalla, citoyenneté à tous les hommes libres de l'Empire.

**Exemple**
> À Athènes, sur ~300 000 habitants, seuls ~40 000 hommes sont citoyens : la démocratie reste une minorité.

**Erreur classique**
- Croire que la démocratie athénienne était universelle : elle excluait la grande majorité de la population.$md$),

    ('histoire-geo', '2de', 'La Méditerranée médiévale', $md$# La Méditerranée médiévale — l'essentiel

**À retenir**
- Au Moyen Âge, la Méditerranée est un espace de **contacts entre trois civilisations** : chrétienté latine, empire byzantin (chrétien orthodoxe) et monde musulman.
- Ces contacts sont faits de **conflits** (Croisades) mais aussi d'**échanges** commerciaux et culturels (transmission du savoir grec via les Arabes).
- Des cités marchandes comme **Venise** et **Gênes** dominent le commerce.

**Dates clés**
- 622 : Hégire, début de l'ère musulmane (départ de Mahomet vers Médine).
- 1095-1099 : première Croisade, prise de Jérusalem par les Latins (1099).
- 1453 : chute de Constantinople, prise par les Ottomans, fin de l'empire byzantin.

**Exemple**
> À Palerme et Cordoue, savants chrétiens, juifs et musulmans traduisent Aristote : c'est par l'Espagne musulmane que l'Occident redécouvre la philosophie grecque.

**Erreur classique**
- Réduire la Méditerranée médiévale à la seule guerre : les échanges commerciaux et intellectuels y sont tout aussi importants.$md$),

    ('histoire-geo', '2de', 'L''ouverture atlantique (XVe-XVIe)', $md$# L'ouverture atlantique (XVe-XVIe) — l'essentiel

**À retenir**
- Les **Grandes Découvertes** déplacent le centre du monde de la Méditerranée vers l'**Atlantique**.
- Portugais et Espagnols explorent les côtes africaines, les Amériques et ouvrent la route des Indes.
- Elles ouvrent l'ère des **empires coloniaux**, du **commerce triangulaire** et de la **traite des esclaves**.

**Dates clés**
- 1492 : Christophe Colomb atteint l'Amérique pour le compte de l'Espagne.
- 1494 : traité de Tordesillas, partage du Nouveau Monde entre Espagne et Portugal.
- 1519-1522 : premier tour du monde (expédition Magellan, achevée par Elcano).

**Exemple**
> L'argent des mines de Potosí (Pérou/Bolivie) inonde l'Europe et enrichit l'Espagne au XVIe siècle.

**Erreur classique**
- Dire que Colomb a « découvert » un continent vide : l'Amérique était peuplée par des civilisations (Aztèques, Incas…) détruites par la conquête.$md$),

    ('histoire-geo', '2de', 'Sociétés et environnements', $md$# Sociétés et environnements — l'essentiel

**À retenir**
- Un **environnement** est le milieu dans lequel vit une société, qu'elle exploite et transforme.
- Les sociétés font face à des **risques** naturels (séismes, cyclones) et technologiques, inégalement selon leur **vulnérabilité**.
- Le **développement durable** cherche à concilier besoins des sociétés et préservation des ressources.

**Repères**
- Anthropocène : ère marquée par l'empreinte décisive de l'humanité sur la planète.
- Risque = aléa (phénomène) × vulnérabilité (population/biens exposés).
- Rapports du GIEC : référence scientifique sur le changement climatique.

**Exemple**
> Un même séisme fait peu de morts au Japon (bâti parasismique) mais des milliers en Haïti (2010) faute de moyens : la vulnérabilité dépend du niveau de développement.

**Erreur classique**
- Confondre l'aléa (le phénomène naturel) et le risque (qui n'existe que si des populations sont exposées).$md$),

    ('histoire-geo', '2de', 'Des mobilités généralisées', $md$# Des mobilités généralisées — l'essentiel

**À retenir**
- Les **mobilités** humaines explosent : migrations de travail, réfugiés, mais aussi **tourisme** (1er flux mondial).
- Les migrations vont surtout des pays du **Sud** vers les pays du **Nord**, mais aussi Sud-Sud.
- Ces flux transforment les territoires de départ (transferts d'argent) comme d'arrivée.

**Repères**
- Environ 280 millions de migrants internationaux dans le monde (≈ 3,5 % de l'humanité).
- Plus d'1,4 milliard de touristes internationaux par an avant 2020.
- Principaux foyers d'accueil : États-Unis, Europe de l'Ouest, pays du Golfe.

**Exemple**
> Les remises (argent envoyé par les migrants à leur famille) dépassent le montant de l'aide publique au développement pour de nombreux pays du Sud.

**Erreur classique**
- Croire que la majorité des migrants sont des réfugiés : la plupart migrent pour le travail ou les études.$md$),

    ('histoire-geo', '1re', 'L''Europe face aux révolutions', $md$# L'Europe face aux révolutions — l'essentiel

**À retenir**
- La **Révolution française** (1789) abolit la monarchie absolue et proclame la **Déclaration des droits de l'homme et du citoyen** (26 août 1789).
- Elle diffuse en Europe les idées de **liberté**, d'**égalité** et de **nation**.
- Le XIXe siècle est marqué par le combat entre l'ordre monarchique restauré et les aspirations **libérales** et **nationales** (révolutions de 1830, 1848).

**Dates clés**
- 14 juillet 1789 : prise de la Bastille.
- 26 août 1789 : Déclaration des droits de l'homme et du citoyen.
- 1848 : « Printemps des peuples », vague révolutionnaire en Europe.

**Exemple**
> En 1848, la France proclame la IIe République et instaure le suffrage universel masculin.

**Erreur classique**
- Croire que la Révolution de 1789 a immédiatement établi une démocratie stable : la France connaît ensuite l'Empire, la Restauration et plusieurs révolutions.$md$),

    ('histoire-geo', '1re', 'La Troisième République', $md$# La Troisième République — l'essentiel

**À retenir**
- La **IIIe République** (1870-1940) est le régime le plus durable de la France depuis 1789.
- Elle enracine la République par les **lois scolaires de Jules Ferry** (école gratuite, laïque et obligatoire) et les **libertés fondamentales**.
- L'**affaire Dreyfus** (1894-1906) divise le pays et la **loi de 1905** sépare les Églises et l'État.

**Dates clés**
- 1881-1882 : lois Ferry sur l'école gratuite, laïque et obligatoire.
- 1894-1906 : affaire Dreyfus (réhabilitation en 1906).
- 9 décembre 1905 : loi de séparation des Églises et de l'État.

**Exemple**
> « J'accuse… ! », lettre d'Émile Zola publiée en janvier 1898, relance l'affaire Dreyfus et mobilise les intellectuels.

**Erreur classique**
- Dater la laïcité de 1789 : c'est la loi de 1905 qui instaure la séparation des Églises et de l'État.$md$),

    ('histoire-geo', '1re', 'La Grande Guerre et la fin des empires', $md$# La Grande Guerre et la fin des empires — l'essentiel

**À retenir**
- La **Première Guerre mondiale (1914-1918)** est une **guerre totale** : elle mobilise soldats, économies et populations civiles.
- C'est une **guerre de masse** et de tranchées (Verdun, 1916), d'une violence inédite.
- Elle provoque la **chute de quatre empires** (allemand, austro-hongrois, russe, ottoman) et une remise en cause de la domination européenne.

**Dates clés**
- 28 juin 1914 : attentat de Sarajevo, déclencheur du conflit.
- 1916 : batailles de Verdun et de la Somme.
- 11 novembre 1918 : armistice, fin des combats.

**Exemple**
> La bataille de Verdun (1916) fait près de 700 000 morts et blessés : elle symbolise l'enfer des tranchées.

**Erreur classique**
- Confondre l'**armistice** (11 novembre 1918, arrêt des combats) et le **traité de Versailles** (28 juin 1919, traité de paix).$md$),

    ('histoire-geo', '1re', 'La métropolisation', $md$# La métropolisation — l'essentiel

**À retenir**
- La **métropolisation** est la concentration croissante des populations, des activités et des pouvoirs dans les grandes villes (**métropoles**).
- Les métropoles concentrent les fonctions de commandement (économie, décision, culture) et sont connectées entre elles à l'échelle mondiale.
- Elle accentue les **inégalités** entre centres dynamiques et périphéries, et à l'intérieur même des villes (gentrification, ségrégation).

**Repères**
- Plus de la moitié de l'humanité vit en ville depuis 2007.
- Mégapole = agglomération de plus de 10 millions d'habitants (Tokyo, Delhi, Shanghai…).
- CBD (Central Business District) : quartier des affaires au cœur de la métropole.

**Exemple**
> Paris concentre à elle seule près d'un tiers du PIB français, illustration de la macrocéphalie urbaine.

**Erreur classique**
- Confondre urbanisation (la ville qui s'étend) et métropolisation (la concentration dans les plus grandes villes).$md$),

    ('histoire-geo', '1re', 'Les espaces productifs français', $md$# Les espaces productifs français — l'essentiel

**À retenir**
- Un **espace productif** est un territoire aménagé et exploité pour produire des richesses (industrie, agriculture, services).
- La France, dans la **mondialisation**, connaît une **désindustrialisation** au profit des services et des activités de haute technologie.
- Les espaces productifs se recomposent : **technopôles**, littoralisation, métropolisation des activités.

**Repères**
- Les services représentent environ 80 % de l'emploi en France.
- Sophia-Antipolis : première technopole française (près de Nice).
- La France reste la 1re puissance agricole de l'Union européenne.

**Exemple**
> L'aéronautique autour de Toulouse (Airbus) illustre un espace productif compétitif, intégré à la mondialisation.

**Erreur classique**
- Croire que la France ne produit plus rien : elle reste puissante dans l'agroalimentaire, l'aéronautique, le luxe et les services.$md$),

    ('histoire-geo', 'Tle', 'Démocraties fragiles et totalitarismes', $md$# Démocraties fragiles et totalitarismes — l'essentiel

**À retenir**
- Après 1918, les démocraties européennes sont fragilisées par la crise économique de **1929** et la montée des extrémismes.
- Trois **régimes totalitaires** émergent : l'**URSS de Staline** (communiste), l'**Italie fasciste de Mussolini** et l'**Allemagne nazie de Hitler**.
- Le totalitarisme se caractérise par un **parti unique**, un **chef**, une **idéologie**, la **terreur** et l'embrigadement des masses.

**Dates clés**
- 1922 : Mussolini arrive au pouvoir en Italie (Marche sur Rome).
- 1924-1953 : Staline dirige l'URSS.
- 30 janvier 1933 : Hitler devient chancelier en Allemagne.

**Exemple**
> Les lois de Nuremberg (1935) privent les Juifs allemands de leurs droits : le régime nazi institutionnalise l'antisémitisme d'État.

**Erreur classique**
- Mettre tous les totalitarismes sur le même plan : ils partagent des méthodes mais leurs idéologies (communisme, fascisme, nazisme) diffèrent profondément.$md$),

    ('histoire-geo', 'Tle', 'La Seconde Guerre mondiale', $md$# La Seconde Guerre mondiale — l'essentiel

**À retenir**
- La **Seconde Guerre mondiale (1939-1945)** est une **guerre d'anéantissement** menée au nom d'idéologies raciales.
- Elle culmine avec le **génocide des Juifs et des Tziganes** (la Shoah, environ 6 millions de Juifs assassinés).
- Elle s'achève par la victoire des Alliés et l'usage de l'**arme nucléaire** (Hiroshima et Nagasaki).

**Dates clés**
- 1er septembre 1939 : invasion de la Pologne par l'Allemagne.
- 6 juin 1944 : débarquement allié en Normandie.
- 8 mai 1945 (Europe) / 2 septembre 1945 (Japon) : capitulations, fin de la guerre.

**Exemple**
> La conférence de Wannsee (janvier 1942) organise la « solution finale », planification industrielle de l'extermination des Juifs d'Europe.

**Erreur classique**
- Confondre le 8 mai 1945 (fin de la guerre en Europe) et le 2 septembre 1945 (capitulation du Japon, fin mondiale du conflit).$md$),

    ('histoire-geo', 'Tle', 'La Guerre froide', $md$# La Guerre froide — l'essentiel

**À retenir**
- La **Guerre froide (1947-1991)** oppose deux blocs : les **États-Unis** (bloc de l'Ouest, capitaliste) et l'**URSS** (bloc de l'Est, communiste).
- C'est un affrontement idéologique, économique et militaire, sans guerre directe entre les deux Grands (équilibre de la terreur nucléaire).
- Elle se traduit par des crises (Berlin, Cuba) et des guerres périphériques (Corée, Vietnam).

**Dates clés**
- 1947 : doctrines Truman et Jdanov, début de la Guerre froide.
- 1962 : crise des missiles de Cuba, point culminant des tensions.
- 9 novembre 1989 : chute du mur de Berlin ; 1991 : dislocation de l'URSS.

**Exemple**
> Le mur de Berlin, construit en 1961, sépare la ville en deux jusqu'en 1989 : il symbolise le « rideau de fer » qui divise l'Europe.

**Erreur classique**
- Croire qu'il y a eu une guerre directe entre les États-Unis et l'URSS : l'affrontement est resté indirect (« froid »), par pays interposés.$md$),

    ('histoire-geo', 'Tle', 'Mers et océans dans la mondialisation', $md$# Mers et océans dans la mondialisation — l'essentiel

**À retenir**
- Les **mers et océans** sont au cœur de la mondialisation : environ **80 % du commerce mondial** transite par voie maritime.
- Ils concentrent des **ressources** (halieutiques, énergétiques, minérales) et sont des espaces de **tensions géopolitiques** (routes, détroits, ZEE).
- Leur exploitation pose des enjeux **environnementaux** majeurs (surpêche, pollution).

**Repères**
- ZEE (Zone économique exclusive) : 200 milles marins où l'État côtier exploite les ressources (droit issu de la convention de Montego Bay, 1982).
- Points de passage stratégiques : canaux de Suez et Panama, détroits d'Ormuz et de Malacca.
- La France possède la 2e ZEE mondiale grâce à ses territoires ultramarins.

**Exemple**
> Le détroit d'Ormuz, par lequel transite une large part du pétrole mondial, est un verrou stratégique surveillé par les grandes puissances.

**Erreur classique**
- Sous-estimer le rôle des mers : l'essentiel des marchandises mondiales voyage par porte-conteneurs, pas par avion.$md$),

    ('histoire-geo', 'Tle', 'L''Union européenne dans la mondialisation', $md$# L'Union européenne dans la mondialisation — l'essentiel

**À retenir**
- L'**Union européenne** est une puissance commerciale majeure et l'un des principaux pôles de la mondialisation.
- Elle repose sur un **marché unique**, une monnaie commune (l'**euro**, pour une partie des États) et l'espace de libre circulation **Schengen**.
- Elle reste une puissance **incomplète** : forte économiquement, mais divisée politiquement et militairement.

**Dates clés**
- 1957 : traité de Rome, création de la CEE (six États fondateurs).
- 1992 : traité de Maastricht, création de l'Union européenne.
- 2002 : mise en circulation des pièces et billets en euros ; 2020 : Brexit (sortie du Royaume-Uni).

**Exemple**
> Airbus, entreprise européenne multinationale, rivalise avec l'américain Boeing : l'UE peut peser dans la mondialisation quand ses États coopèrent.

**Erreur classique**
- Confondre l'Union européenne, la zone euro et l'espace Schengen : ce sont trois ensembles distincts qui ne regroupent pas les mêmes pays.$md$)
  ) AS v(slug, level, chapter, md)
  JOIN public.subjects s ON s.slug = v.slug
  JOIN public.chapters c
    ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
 WHERE l.chapter_id = c.id
   AND l.title = 'L''essentiel du cours'
   AND l.revision_sheet IS DISTINCT FROM v.md;
