-- =============================================================================
-- Studuel — Migration 420 : ERREURS DE COURS ET DE QUIZ CORRIGÉES
--
-- 127 fragments faux ou approximatifs, relevés par les relecteurs des
-- contrôles blancs (28-29/09/2026), remplacés à l’endroit exact où ils sont.
-- La même correction est faite dans la source (scripts/contenu, contenu/controles).
--
-- ⚠️ FICHIER GÉNÉRÉ — ne pas éditer à la main. Source : contenu/corrections/.
--    Regénérer : node scripts/corrections-sql.mjs --num 420
--
-- Idempotent : chaque UPDATE ne touche que les lignes qui contiennent encore le
-- fragment fautif. À exécuter APRÈS 385 → 399 (les cours qu’elles réécrivent).
-- Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

DROP TABLE IF EXISTS pg_temp._corrections;
CREATE TEMP TABLE _corrections (n int, slug text, level text, chapter text, champ text, ancien text, nouveau text);
INSERT INTO _corrections VALUES
  (1, 'histoire-geo', '2de', 'L’Arctique : un espace fragile et attractif', 'cours', '**huit États riverains** — Russie, Canada, États-Unis, Danemark via le Groenland, Norvège, Islande, Suède, Finlande |', '**huit États arctiques** — Russie, Canada, États-Unis, Danemark via le Groenland, Norvège, Islande, Suède, Finlande ; seuls les cinq premiers bordent l''océan Arctique |'),
  (2, 'histoire-geo', '2de', 'L’Arctique : un espace fragile et attractif', 'question', 'Combien d’États riverains siègent au Conseil de l’Arctique ?', 'Combien d’États membres siègent au Conseil de l’Arctique ?'),
  (3, 'histoire-geo', '2de', 'Les relations entre l’Angleterre et ses colonies américaines', 'cours', 'Le traité de Versailles-Paris reconnaît les États-Unis', 'Le traité de Paris reconnaît les États-Unis'),
  (4, 'histoire-geo', '2de', 'Les relations entre l’Angleterre et ses colonies américaines', 'explication', 'Le traité de Versailles-Paris de 1783', 'Le traité de Paris de 1783'),
  (5, 'histoire-geo', '1re', 'L’instauration de la République et de la démocratie parlementaire (1870-1875)', 'cours', '> Cette renonciation durera jusqu’en **1958**.', '> Plus aucune Chambre ne sera dissoute jusqu’en 1940 ; la dissolution ne reparaît qu’en **1955**, sous la IVe République (Edgar Faure).'),
  (6, 'histoire-geo', '1re', 'L’enracinement de la culture républicaine (1876-1899)', 'cours', '; l’élection des **maires** par les conseils municipaux |', '; la loi municipale, qui confirme l’élection des **maires** par les conseils municipaux (acquise en 1882) |'),
  (7, 'histoire-geo', '1re', 'L’enracinement de la culture républicaine (1876-1899)', 'question', 'Quelle réforme de 1884 démocratise la vie municipale ?', 'Quelle réforme des années 1882-1884 démocratise la vie municipale ?'),
  (8, 'histoire-geo', '1re', 'L’enracinement de la culture républicaine (1876-1899)', 'explication', 'Depuis 1884, le maire est élu par le conseil municipal, et non plus nommé :', 'Depuis la loi de 1882, confirmée par la loi municipale de 1884, le maire est élu par le conseil municipal, et non plus nommé :'),
  (9, 'histoire-geo', '1re', 'L’Europe entre restauration et révolution (1814-1848)', 'cours', '| La France revient à ses frontières de **1792** |', '| La France revient à ses frontières de **1790** (second traité de Paris, 1815) |'),
  (10, 'histoire-geo', '1re', 'L’Europe entre restauration et révolution (1814-1848)', 'question', 'À quelles frontières le congrès de Vienne ramène-t-il la France ?', 'À quelles frontières le premier traité de Paris (1814) ramène-t-il la France ?'),
  (11, 'histoire-geo', '1re', 'L’Europe entre restauration et révolution (1814-1848)', 'explication', 'efface de la carte les conquêtes de la Révolution et de l’Empire.', 'efface de la carte les conquêtes de la Révolution et de l’Empire ; après les Cent-Jours, le second traité de Paris (1815) la ramène à celles de 1790.'),
  (12, 'histoire-geo', '1re', 'Les métropoles françaises', 'cours', '**21 métropoles** exercent des compétences élargies', '**21 métropoles**, plus la **Métropole de Lyon**, exercent des compétences élargies'),
  (13, 'histoire-geo', '1re', 'Les métropoles françaises', 'options', '21', '22'),
  (14, 'histoire-geo', '1re', 'Les métropoles françaises', 'explication', 'Trois d’entre elles (Paris, Lyon, Marseille) ont un statut particulier.', 'Vingt et une, plus la Métropole de Lyon, collectivité à part ; trois d’entre elles (Paris, Lyon, Marseille) ont un statut particulier.'),
  (15, 'histoire-geo', 'Tle', 'Les recompositions territoriales en France', 'cours', '— 21 aujourd’hui, dont Grand Paris, Lyon et Aix-Marseille à statut particulier |', '— 22 aujourd’hui, dont Grand Paris, Lyon et Aix-Marseille à statut particulier |'),
  (16, 'histoire-geo', 'Tle', 'Les recompositions territoriales en France', 'explication', 'On compte aujourd’hui 21 métropoles, dont trois à statut particulier.', 'On compte aujourd’hui 22 métropoles (Métropole de Lyon comprise), dont trois à statut particulier.'),
  (17, 'histoire-geo', 'Tle', 'Les recompositions territoriales en France', 'options', '21', '22'),
  (18, 'histoire-geo', 'Tle', 'Les recompositions territoriales en France', 'explication', 'La loi MAPTAM (2014) crée le statut ; Grand Paris', 'La loi MAPTAM (2014) crée le statut ; on en compte 21, plus la Métropole de Lyon, collectivité à part ; Grand Paris'),
  (19, 'hggsp', '1re', 'Les frontières en débat : reconnaître et dépasser les frontières', 'cours', 'supprime les contrôles intérieurs de 27 pays,', 'supprime les contrôles intérieurs de 29 pays,'),
  (20, 'hggsp', '1re', 'Enjeux migratoires : les frontières externes et internes de l’Union européenne', 'cours', 'Supprime les contrôles intérieurs pour 27 pays, dont quatre hors Union', 'Supprime les contrôles intérieurs pour 29 pays, dont quatre hors Union'),
  (21, 'hggsp', '1re', 'Enjeux migratoires : les frontières externes et internes de l’Union européenne', 'explication', 'Il compte 27 pays, dont quatre qui ne sont pas membres de l’Union.', 'Il compte 29 pays, dont quatre qui ne sont pas membres de l’Union.'),
  (22, 'hggsp', '1re', 'Avancées des démocraties : les exemples du Portugal et de l’Espagne de 1974 à 1982', 'cours', '| **1976** | Constitution, élection de Mário Soares |', '| **1976** | Constitution ; Mário Soares devient Premier ministre |'),
  (23, 'hggsp', '1re', 'Avancées des démocraties : les exemples du Portugal et de l’Espagne de 1974 à 1982', 'question', 'Qui est élu à la tête du Portugal en 1976, après l’adoption de la Constitution ?', 'Qui devient Premier ministre du Portugal en 1976, après l’adoption de la Constitution ?'),
  (24, 'hggsp', '1re', 'Avancées des démocraties : les exemples du Portugal et de l’Espagne de 1974 à 1982', 'explication', 'La Constitution de 1976 et l’élection de Mário Soares installent la démocratie portugaise.', 'La Constitution de 1976 et le gouvernement de Mário Soares, issu des élections, installent la démocratie portugaise ; il sera président en 1986.'),
  (25, 'hggsp', '1re', 'Liberté ou contrôle de l’information : l’affaire Dreyfus et la presse', 'cours', '| **1906** | Il est **réhabilité** et réintégré dans l''armée |', '| **1905** | L''affaire nourrit la **loi de séparation** des Églises et de l''État |'),
  (26, 'hggsp', '1re', 'Liberté ou contrôle de l’information : l’affaire Dreyfus et la presse', 'cours', '| **1905** | L''affaire nourrit la loi de séparation des Églises et de l''État |', '| **1906** | Dreyfus est **réhabilité** et réintégré dans l''armée |'),
  (27, 'hggsp', 'Tle', 'La Chine à la conquête de l’espace, des mers et des océans', 'cours', 'habitée en continu | Depuis 2021 |', 'habitée en continu | Depuis fin 2022 |'),
  (28, 'hggsp', 'Tle', 'La Chine à la conquête de l’espace, des mers et des océans', 'explication', 'sur Mars et occupe en continu sa station Tiangong :', 'sur Mars ; fin 2022, sa station Tiangong est occupée en permanence :'),
  (29, 'hggsp', 'Tle', 'Vers une société de la connaissance', 'cours', 'consacrés à la R&D | **Rarement atteinte** |', 'consacrés à la R&D, fixée à Barcelone en **2002** dans ce cadre | **Rarement atteinte** |'),
  (30, 'hggsp', 'Tle', 'Vers une société de la connaissance', 'question', 'Quel objectif de R&D la stratégie de Lisbonne fixe-t-elle en 2000 ?', 'Quel objectif de R&D l’Union se fixe-t-elle dans le cadre de la stratégie de Lisbonne ?'),
  (31, 'hggsp', 'Tle', 'Vers une société de la connaissance', 'explication', 'Un objectif que la plupart', 'Fixé au Conseil européen de Barcelone (2002), un objectif que la plupart'),
  (32, 'emc', '1re', 'Lutter contre les inégalités économiques et sociales', 'cours', 'Un quota de **logements sociaux** — 25 % en zone tendue : un outil', 'Un quota de **logements sociaux** — 20 %, porté à 25 % en 2013 (hors zones peu tendues) : un outil'),
  (33, 'emc', '1re', 'Lutter contre les inégalités économiques et sociales', 'explication', 'Jusqu’à 25 % dans les zones tendues :', '20 % en 2000, porté à 25 % en 2013 dans les zones tendues :'),
  (34, 'emc', '1re', 'Lutter contre les inégalités économiques et sociales', 'explication', 'La loi SRU de 2000 fixe 25 % de logements sociaux en zone tendue :', 'La loi SRU de 2000 fixait 20 % de logements sociaux, porté à 25 % en zone tendue en 2013 :'),
  (35, 'emc', '1re', 'Nationalité et citoyenneté', 'cours', 's''il y réside depuis ses 11 ans (5 ans au moins) ;', 's''il y réside et y a résidé au moins cinq ans depuis l''âge de 11 ans ;'),
  (36, 'emc', '1re', 'Nationalité et citoyenneté', 'explication', 'Il doit résider en France depuis l’âge de 11 ans, au moins 5 ans.', 'Il doit résider en France et y avoir résidé au moins cinq ans depuis l’âge de 11 ans.'),
  (37, 'snt', '2de', 'Internet : le réseau des réseaux', 'cours', '**ARPANET** relie quatre universités américaines ;', '**ARPANET** relie quatre sites américains (trois universités et un institut de recherche) ;'),
  (38, 'snt', '2de', 'Internet : le réseau des réseaux', 'explication', 'Il reliait quatre universités américaines.', 'Il reliait quatre sites américains : trois universités et un institut de recherche.'),
  (39, 'snt', '2de', 'Internet : le réseau des réseaux', 'question', 'Combien d’universités américaines ARPANET relie-t-il en 1969 ?', 'Combien de sites américains ARPANET relie-t-il en 1969 ?'),
  (40, 'snt', '2de', 'Internet : le réseau des réseaux', 'explication', 'ARPANET relie quatre universités ;', 'ARPANET relie quatre sites, trois universités et un institut de recherche ;'),
  (41, 'svt', '1re', 'Les zones de subduction entre les plaques lithosphériques', 'cours', 'ou continental (Andes), à 100-150 km au-dessus du plan de subduction |', 'ou continental (Andes), là où le plan de subduction atteint 100-150 km de profondeur |'),
  (42, 'svt', '1re', 'La réplication de l’ADN', 'cours', '> Sans ces origines multiples, copier 3 milliards de paires de bases prendrait des semaines.', '> Sans ces origines multiples, copier un seul chromosome prendrait des semaines, et les 3 milliards de paires de bases du génome, de l''ordre d''un an.'),
  (43, 'svt', '1re', 'La réplication de l’ADN', 'explication', 'Trois milliards de paires de bases à partir d’une seule origine prendraient des semaines.', 'Trois milliards de paires de bases à partir d’une seule origine prendraient de l’ordre d’un an.'),
  (44, 'enseignement-scientifique', '1re', 'La Terre dans l’Univers', 'cours', '| L’Univers observable | environ **13,8 milliards** d’années-lumière |', '| L’Univers observable | environ **46 milliards** d’années-lumière de rayon (son âge : 13,8 milliards d’années) |'),
  (45, 'physique-chimie', '3e', 'La tension électrique', 'cours', 'Elle change de signe **50 fois par seconde** en France : 50 Hz |', 'En France, **50 périodes par seconde** (50 Hz) : elle change de signe 100 fois par seconde |'),
  (46, 'physique-chimie', '3e', 'La tension électrique', 'explication', 'La tension alternative change de signe 50 fois par seconde.', 'La tension alternative accomplit 50 périodes par seconde, et change donc de signe 100 fois par seconde.'),
  (47, 'physique-chimie', '4e', 'La tension électrique', 'cours', 'Elle change de signe **50 fois par seconde** en France : 50 Hz |', 'En France, **50 périodes par seconde** (50 Hz) : elle change de signe 100 fois par seconde |'),
  (48, 'physique-chimie', '4e', 'La tension électrique', 'explication', 'La tension alternative change de signe 50 fois par seconde.', 'La tension alternative accomplit 50 périodes par seconde, et change donc de signe 100 fois par seconde.'),
  (49, 'physique-chimie', '5e', 'La tension électrique', 'cours', 'Elle change de signe **50 fois par seconde** en France : 50 Hz |', 'En France, **50 périodes par seconde** (50 Hz) : elle change de signe 100 fois par seconde |'),
  (50, 'physique-chimie', '5e', 'La tension électrique', 'explication', 'La tension alternative change de signe 50 fois par seconde.', 'La tension alternative accomplit 50 périodes par seconde, et change donc de signe 100 fois par seconde.'),
  (51, 'nsi', '1re', 'Une machine programmable', 'cours', '| Détectées **avant** le lancement | Au moment où la ligne est atteinte |', '| Détectées **avant** le lancement | En Python aussi, avant le lancement ; ce sont les erreurs d''exécution qui attendent que la ligne soit atteinte |'),
  (52, 'nsi', '1re', 'Une machine programmable', 'cours', 'avant de s''arrêter sur une faute située à la fin.', 'avant de s''arrêter sur une erreur d''exécution (nom inconnu, division par zéro) située à la fin.'),
  (53, 'nsi', '1re', 'Une machine programmable', 'explication', 'Un programme interprété, lui, s’arrête au moment où il atteint la ligne fautive.', 'En Python aussi, une erreur de syntaxe empêche le lancement ; ce sont les erreurs d’exécution qui n’apparaissent qu’en atteignant la ligne.'),
  (54, 'nsi', '1re', 'Une machine programmable', 'question', 'quand une erreur de syntaxe en fin de programme est-elle détectée ?', 'quand une division par zéro en fin de programme est-elle détectée ?'),
  (55, 'nsi', '1re', 'Une machine programmable', 'explication', 'L’interprète traduit au fur et à mesure : le programme peut tourner longtemps avant de s’arrêter sur la faute.', 'C’est une erreur d’exécution : le programme peut tourner longtemps avant de s’arrêter sur la faute. Une erreur de syntaxe, elle, empêche le lancement.'),
  (56, 'histoire-geo-techno', '1re', 'La Troisième République avant 1914 : un régime, un empire colonial', 'cours', 'Élection des maires par le conseil municipal | 1884 |', 'Élection des maires par le conseil municipal | 1882-1884 |'),
  (57, 'francais', '2de', 'Sonnets : structure et animalité (Du Bellay et Ronsard)', 'cours', '| Le sonnet fameux | « Mignonne, allons voir si la rose » |', '| Le poème fameux | « Mignonne, allons voir si la rose » — une **ode** (trois sizains d''octosyllabes), pas un sonnet |'),
  (58, 'francais', '2de', 'Drame romantique et triangle amoureux : Les Caprices de Marianne, Musset', 'cours', '> « Je ne t''aimais pas, Cœlio, c''est toi qui m''aimais. » La réplique finale de Marianne à Octave', '> « Je ne vous aime pas, Marianne ; c''était Cœlio qui vous aimait. » La réplique finale d''Octave à Marianne'),
  (59, 'francais', '2de', 'Universalité et pluralité de l’image du lion', 'cours', '| On a toujours besoin d''un plus petit que soi :', '| « On a souvent besoin d''un plus petit que soi » :'),
  (60, 'francais', '1re', 'Les Caractères', 'cours', '| « L’on **s’élève** à la cour, mais on n’y **monte** pas » |', '| « La cour **ne rend pas content** ; elle empêche qu’on ne le soit ailleurs » |'),
  (61, 'francais', '1re', 'Les Caractères', 'cours', '| Le pouvoir, la guerre | Les paysans « **animaux farouches** » qui **deviennent des hommes quand ils se lèvent** |', '| Le pouvoir, la guerre | Le bon prince, **berger** de son peuple (les paysans « **animaux farouches** » sont, eux, au livre **XI, « De l’homme »**) |'),
  (62, 'francais', '1re', 'Les Caractères', 'options', '« L’on s’élève à la cour, mais on n’y monte pas »', '« La cour ne rend pas content ; elle empêche qu’on ne le soit ailleurs »'),
  (63, 'francais', '1re', 'Les Caractères', 'explication', 'C’est l’une des pages les plus fortes du livre X.', 'C’est l’une des pages les plus fortes du livre XI, « De l’homme ».'),
  (64, 'francais', '1re', 'Les Caractères, Jean de La Bruyère', 'explication', '« L’on s’élève à la cour, mais on n’y monte pas. »', '« La cour ne rend pas content ; elle empêche qu’on ne le soit ailleurs. »'),
  (65, 'francais', '1re', 'Les Caractères, Jean de La Bruyère', 'cours', '> Sa page sur les **paysans**, « animaux farouches »', '> Sa page sur les **paysans** (livre XI, « De l’homme »), « animaux farouches »'),
  (66, 'francais', '1re', 'Le Rouge et le Noir', 'cours', '> Et la définition restée célèbre : « **Un roman est un miroir que l’on promène le long d’un chemin.** »', '> Et la formule restée célèbre, en épigraphe d’un chapitre (Stendhal l’attribue à Saint-Réal) : « **Un roman : c’est un miroir qu’on promène le long d’un chemin.** »'),
  (67, 'francais', '1re', 'Le Rouge et le Noir', 'question', 'Quelle définition du roman Stendhal donne-t-il ?', 'Quelle définition du roman Stendhal place-t-il en épigraphe ?'),
  (68, 'francais', '1re', 'Le Rouge et le Noir', 'options', '« Un miroir que l’on promène le long d’un chemin »', '« Un miroir qu’on promène le long d’un chemin »'),
  (69, 'francais', '1re', 'Le Rouge et le Noir, Stendhal', 'cours', '> Sa définition célèbre : « **Un roman est un miroir que l’on promène le long d’un chemin.** »', '> Sa définition célèbre, en épigraphe d’un chapitre : « **Un roman : c’est un miroir qu’on promène le long d’un chemin.** »'),
  (70, 'francais', '1re', 'Les Fleurs du mal - Partie 2', 'cours', 'de ses amours décomposées.', 'de ses « amours décomposés ».'),
  (71, 'hlp', '1re', 'L’invention de la perspective', 'cours', '| La taille décroît avec l''éloignement | Proportionnellement à la distance |', '| La taille décroît avec l''éloignement | Inversement proportionnelle à la distance |'),
  (72, 'hlp', 'Tle', 'La recherche de soi', 'cours', '| L’autobiographie moderne, sans instance divine |', '| L’autobiographie moderne : le moi raconté devant les hommes, même si le préambule invoque l’« Être éternel » |'),
  (73, 'hlp', 'Tle', 'La recherche de soi', 'options', 'L’autobiographie moderne, sans instance divine', 'L’autobiographie moderne, adressée aux hommes'),
  (74, 'hlp', 'Tle', 'La recherche de soi', 'explication', 'Augustin se confesse devant Dieu ; Rousseau se raconte devant les hommes,', 'Augustin se confesse devant Dieu ; Rousseau, s’il invoque l’« Être éternel » dans son préambule, se raconte devant ses semblables,'),
  (75, 'hlp', 'Tle', 'Les transformations historiques de l’ego', 'cours', '| Un **dedans** : *in interiore homine habitat veritas* |', '| Un **dedans** : *in interiore homine habitat veritas*, écrit-il aussi (*De vera religione*) |'),
  (76, 'hlp', 'Tle', 'Les transformations historiques de l’ego', 'explication', '*In interiore homine habitat veritas.*', 'Augustin y cherche Dieu au-dedans ; *in interiore homine habitat veritas*, écrit-il dans le *De vera religione*.'),
  (77, 'philosophie', 'Tle', 'Le libre arbitre', 'cours', '« elle est si ample qu’elle nous rend en quelque façon semblables à Dieu ».', 'c’est par elle, écrit-il, que « je porte l’image et la ressemblance de Dieu ».'),
  (78, 'philosophie', 'Tle', 'La nature', 'cours', 'compatibles avec la permanence d’une vie humaine sur terre |', 'compatibles avec la permanence d’une vie authentiquement humaine sur terre |'),
  (79, 'philosophie', 'Tle', 'La science', 'cours', '> « L’expérimentateur doit douter, fuir les idées fixes. »', '> « L’expérimentateur doit douter, fuir les idées fixes et garder toujours sa liberté d’esprit. »'),
  (80, 'espagnol', 'Tle', 'Le présent de l’indicatif', 'cours', 'sur cinq de ses six formes :', 'sur quatre de ses six formes (*estás, está, estáis, están*) :'),
  (81, 'espagnol', '1re', 'Le présent de l’indicatif', 'cours', 'sur cinq de ses six formes :', 'sur quatre de ses six formes (*estás, está, estáis, están*) :'),
  (82, 'espagnol', '2de', 'Le présent de l’indicatif', 'cours', 'sur cinq de ses six formes :', 'sur quatre de ses six formes (*estás, está, estáis, están*) :'),
  (83, 'espagnol', '3e', 'Le présent de l’indicatif', 'cours', 'sur cinq de ses six formes :', 'sur quatre de ses six formes (*estás, está, estáis, están*) :'),
  (84, 'espagnol', '4e', 'Le présent de l’indicatif', 'cours', 'sur cinq de ses six formes :', 'sur quatre de ses six formes (*estás, está, estáis, están*) :'),
  (85, 'espagnol', '5e', 'Le présent de l’indicatif', 'cours', 'sur cinq de ses six formes :', 'sur quatre de ses six formes (*estás, está, estáis, están*) :'),
  (86, 'espagnol', 'Tle', 'La mise en relief', 'cours', '*Fue el Guernica lo que Picasso pintó en 1937.*', '*Fue el Guernica el que Picasso pintó en 1937.*'),
  (87, 'anglais', '2de', 'Les réponses courtes et les reprises : So do I, Neither can she', 'cours', 'Yes, he does, but I don’t think so for long!', 'Yes, he does, but I don’t think he will for long!'),
  (88, 'histoire-geo-techno', '1re', 'L’Europe bouleversée par la Révolution française (1789-1815)', 'cours', 'Après la défaite de **Waterloo (18 juin 1815)**, le **congrès de Vienne** (1814-1815) redessine', 'Réuni de 1814 jusqu’à la veille de **Waterloo (18 juin 1815)**, le **congrès de Vienne** redessine'),
  (89, 'histoire-geo-techno', '1re', 'Les puissances européennes contre Napoléon : la bataille de Waterloo', 'cours', '- Le **congrès de Vienne** (acte final du 9 juin 1815) redessine l’Europe ; la **Sainte-Alliance**', '- Signé neuf jours avant la bataille, l’acte final du **congrès de Vienne** (9 juin 1815) redessine l’Europe ; après Waterloo, la **Sainte-Alliance**'),
  (90, 'histoire-geo-techno', '1re', 'L’instruction des filles sous la Troisième République avant 1914', 'cours', 'Jules Ferry déclare en **1870** que « celui qui tient la femme tient tout » : il veut', 'Jules Ferry explique en **1870** que qui a l’influence sur les femmes l’a sur toute la famille : il veut'),
  (91, 'histoire-geo-techno', '1re', 'L’instruction des filles sous la Troisième République avant 1914', 'cours', '## Les institutrices, « hussardes noires » de la République', '## Les institutrices, aux côtés des « hussards noirs » de la République'),
  (92, 'histoire-geo-techno', '1re', 'Vivre à Alger au début du XXe siècle', 'cours', 'portent des noms de généraux et d’hommes politiques français (rue d’Isly, place Bugeaud)', 'portent des noms de victoires et de généraux français (rue d’Isly, du nom d’une bataille de 1844 ; place Bugeaud)'),
  (93, 'innovation-technologique', '1re', 'Ergonomie et expérience utilisateur', 'cours', '(détrompeur d’une prise USB-C réversible, par exemple)', '(détrompeur d’une prise HDMI, ou prise USB-C rendue réversible, par exemple)'),
  (94, 'biochimie-biologie', '1re', 'Réplication de l’ADN, mitose et cycle cellulaire', 'cours', 'L’**ADN polymérase** sépare les deux brins et fabrique, face à chacun, un brin complémentaire.', 'L’**hélicase** sépare les deux brins, puis l’**ADN polymérase** fabrique, face à chacun, un brin complémentaire.'),
  (95, 'biochimie-biologie', '1re', 'Lipides et membranes biologiques', 'cours', 'Dans l’eau, les phospholipides s’organisent spontanément :', 'Dans l’eau, les molécules amphiphiles s’organisent spontanément :'),
  (96, 'biochimie-biologie', '1re', 'Lipides et membranes biologiques', 'cours', '- en **micelles** (queues vers l’intérieur) ;', '- en **micelles** (queues vers l’intérieur), surtout celles à une seule chaîne (acides gras, savons) ;'),
  (97, 'biochimie-biologie', '1re', 'Lipides et membranes biologiques', 'cours', '- en **bicouche** : deux couches, têtes vers l’eau, queues face à face.', '- en **bicouche** : deux couches, têtes vers l’eau, queues face à face — c’est l’organisation typique des phospholipides.'),
  (98, 'biochimie-biologie', '1re', 'Lipides et membranes biologiques', 'cours', '(testostérone, œstrogènes, progestérone) et dans la **vitamine D** : ce noyau permet de les reconnaître d’un coup d’œil.', '(testostérone, œstrogènes, progestérone) : ce noyau permet de les reconnaître d’un coup d’œil ; la **vitamine D** en dérive aussi, avec un cycle ouvert.'),
  (99, 'sciences-sanitaires-sociales', '1re', 'Inégalités sociales et territoriales de santé et de bien-être', 'cours', 'vit en moyenne une douzaine d''années de plus', 'vit en moyenne environ 13 ans de plus'),
  (100, 'sciences-sanitaires-sociales', '1re', 'Les acteurs en santé et les droits de la personne', 'cours', 'La loi **Claeys-Leonetti** (2016) permet en outre de rédiger des **directives anticipées** sur sa fin de vie.', 'Depuis la loi **Leonetti** (2005), on peut rédiger des **directives anticipées** sur sa fin de vie ; la loi **Claeys-Leonetti** (2016) les rend contraignantes pour le médecin.'),
  (101, 'sciences-sanitaires-sociales', '1re', 'Les acteurs en santé et les droits de la personne', 'question', 'Quelle loi de 2016 permet de rédiger des directives anticipées sur la fin de vie ?', 'Quelle loi de 2016 rend les directives anticipées sur la fin de vie contraignantes pour le médecin ?'),
  (102, 'i2d', 'Tle', 'Méthode : l’épreuve écrite de 2I2D', 'cours', '| Lire la mise en situation et survoler tout le sujet | 10 à 15 min |', '| Lire la mise en situation et survoler tout le sujet | 10 à 15 min, pris sur les 2 h 30 du tronc commun |'),
  (103, 'i2d', 'Tle', 'Méthode : l’épreuve écrite de 2I2D', 'cours', '| Tronc commun | 2 h 15 |', '| Tronc commun | le reste, environ 2 h 15 |'),
  (104, 'i2d', 'Tle', 'Méthode : l’épreuve écrite de 2I2D', 'cours', '| Enseignement spécifique | 1 h |', '| Enseignement spécifique | 1 h, relecture comprise |'),
  (105, 'i2d', 'Tle', 'Méthode : l’épreuve écrite de 2I2D', 'cours', '| Relecture, documents réponses | 5 à 10 min |', '| Relecture, documents réponses | 5 à 10 min, pris sur la dernière heure |'),
  (106, 'i2d', 'Tle', 'Asservissement et régulation', 'cours', 'entre 93,1 et 102,9 tr/min (± 5 % de la valeur finale).', 'entre 93,1 et 102,9 tr/min (± 5 % de la variation totale, ici de 0 à 98 tr/min, autour de la valeur finale).'),
  (107, 'i2d', 'Tle', 'Asservissement et régulation', 'question', 'l’instant après lequel la sortie reste à ± 5 % de sa valeur finale.', 'l’instant après lequel la sortie reste à ± 5 % de sa variation totale autour de sa valeur finale.'),
  (108, 'spcl', 'Tle', 'Chaîne d’information, moteur pas à pas et régulation continue', 'cours', '(temps pour rester dans ± 5 % de la valeur finale) ;', '(temps pour rester à moins de 5 % de la variation totale autour de la valeur finale) ;'),
  (109, 'spcl', 'Tle', 'Chaîne d’information, moteur pas à pas et régulation continue', 'options', 'Reste dans ± 5 % de sa valeur finale', 'Reste autour de sa valeur finale, à ± 5 % de sa variation totale'),
  (110, 'allemand', 'Tle', 'Poètes, penseurs, artistes : l’Allemagne de la culture', 'cours', 'En 1836, l’historien de la littérature Wolfgang Menzel qualifie l’Allemagne de « pays des poètes et des penseurs »', 'Au XIXe siècle se popularise une formule qui fait de l’Allemagne le « pays des poètes et des penseurs »'),
  (111, 'allemand', 'Tle', 'Poètes, penseurs, artistes : l’Allemagne de la culture', 'question', 'Qui a qualifié l’Allemagne de « Land der Dichter und Denker » en 1836 ?', 'Que signifie « Land der Dichter und Denker », formule popularisée au XIXe siècle ?'),
  (112, 'allemand', 'Tle', 'Poètes, penseurs, artistes : l’Allemagne de la culture', 'options', 'Goethe', 'Le pays des princes et des soldats'),
  (113, 'allemand', 'Tle', 'Poètes, penseurs, artistes : l’Allemagne de la culture', 'options', 'Wolfgang Menzel', 'Le pays des poètes et des penseurs'),
  (114, 'allemand', 'Tle', 'Poètes, penseurs, artistes : l’Allemagne de la culture', 'options', 'Kant', 'Le pays des musiciens et des peintres'),
  (115, 'allemand', 'Tle', 'Poètes, penseurs, artistes : l’Allemagne de la culture', 'options', 'Bismarck', 'Le pays des savants et des ingénieurs'),
  (116, 'allemand', 'Tle', 'Poètes, penseurs, artistes : l’Allemagne de la culture', 'explication', 'Un historien de la littérature, en hommage à Goethe, Schiller et Lessing.', 'Une formule popularisée au XIXe siècle, en hommage à Goethe, Schiller et Lessing.'),
  (117, 'anglais', 'Tle', 'Sphère privée, sphère publique', 'cours', 'depuis la rupture d’Henri VIII avec Rome (1534).', ': Henri VIII, en rompant avec Rome (1534), s’en était proclamé « chef suprême », titre devenu « gouverneur suprême » sous Élisabeth Ire (1559).'),
  (118, 'anglais', 'Tle', 'Sphère privée, sphère publique', 'explication', 'Depuis la rupture d’Henri VIII avec Rome.', 'Titre fixé sous Élisabeth Ire (1559), après la rupture d’Henri VIII avec Rome.'),
  (119, 'grec', 'Tle', 'Atrides et Labdacides : les familles maudites', 'cours', 'chez Sophocle, voir et savoir sont le même verbe (οἶδα, « je sais », signifie « j’ai vu »).', 'chez Sophocle, voir et savoir viennent de la même racine (οἶδα, « je sais », est de la famille d’εἶδον, « je vis » : savoir, c’est avoir vu).'),
  (120, 'grec', 'Tle', 'Troisième déclinaison, αὐτός et aoriste passif', 'cours', 'le suffixe **-θη-** signale le passif ; l’aoriste thématique moyen fait λαβέσθαι (de λαμβάνω).', 'le suffixe **-θη-** signale le passif ; l’aoriste **moyen**, lui, n’en a pas : thématique, il fait λαβέσθαι (de λαμβάνω).'),
  (121, 'llcer-anglais', 'Tle', 'L’art qui fait débat : scandales et censure', 'cours', 'Marcel Duchamp, 1917 (exposé à New York)', 'Marcel Duchamp, 1917 (refusé au salon des Indépendants de New York)'),
  (122, 'llcer-anglais', 'Tle', 'L’art qui fait débat : scandales et censure', 'cours', '| *Girl with Balloon* | Banksy, 2018 |', '| *Girl with Balloon* | Banksy, toile de 2006, détruite en 2018 |'),
  (123, 'llcer-anglais', 'Tle', 'L’expression des émotions : du sonnet à The Piano', 'cours', 'le rachète et propose un marché : Ada pourra le récupérer, touche après touche', 'l’obtient de Stewart en échange de terres et propose un marché : Ada pourra le regagner, touche après touche'),
  (124, 'llcer-anglais', 'Tle', 'L’expression des émotions : du sonnet à The Piano', 'question', 'Qui rachète le piano d’Ada et lui propose un marché ?', 'Qui obtient le piano d’Ada contre des terres et lui propose un marché ?'),
  (125, 'llcer-anglais', 'Tle', 'L’expression des émotions : du sonnet à The Piano', 'explication', 'Ada récupère le piano touche après touche, en échange de leçons.', 'Ada regagne le piano touche après touche, en échange de leçons.'),
  (126, 'latin', 'Tle', 'Chaos, fatum et Sibylle : le destin chez les Latins', 'cours', 'l’une file, l’autre déroule, la troisième coupe.', 'l’une file, l’autre mesure, la troisième coupe.'),
  (127, 'latin', 'Tle', 'Chaos, fatum et Sibylle : le destin chez les Latins', 'explication', 'Les Parques filent, déroulent et coupent le fil de la vie', 'Les Parques filent, mesurent et coupent le fil de la vie');

-- Les cours, une correction à la fois (plusieurs peuvent viser la même leçon).
DO $$
DECLARE k record;
BEGIN
  FOR k IN SELECT * FROM _corrections WHERE champ = 'cours' ORDER BY n LOOP
    UPDATE public.lessons l SET content = replace(l.content, k.ancien, k.nouveau)
      FROM public.subjects s
      JOIN public.chapters c ON c.subject_id = s.id
     WHERE s.slug = k.slug AND c.level = k.level AND c.title = k.chapter
       AND l.chapter_id = c.id AND strpos(l.content, k.ancien) > 0;
  END LOOP;
END $$;

-- Les questions de quiz (énoncé, explication, options), une correction à la fois.
DO $$
DECLARE k record;
BEGIN
  FOR k IN SELECT * FROM _corrections WHERE champ <> 'cours' ORDER BY n LOOP
    UPDATE public.quiz_questions x
       SET question    = CASE WHEN k.champ = 'question'    THEN replace(x.question, k.ancien, k.nouveau) ELSE x.question END,
           explanation = CASE WHEN k.champ = 'explication' THEN replace(x.explanation, k.ancien, k.nouveau) ELSE x.explanation END,
           options     = CASE WHEN k.champ = 'options'     THEN replace(x.options::text, k.ancien, k.nouveau)::jsonb ELSE x.options END
      FROM public.quizzes qz
      JOIN public.lessons l ON l.id = qz.lesson_id
      JOIN public.chapters c ON c.id = l.chapter_id
      JOIN public.subjects s ON s.id = c.subject_id
     WHERE x.quiz_id = qz.id AND s.slug = k.slug AND c.level = k.level AND c.title = k.chapter
       AND strpos(CASE k.champ WHEN 'question' THEN x.question WHEN 'explication' THEN x.explanation ELSE x.options::text END, k.ancien) > 0;
  END LOOP;
END $$;

-- Contrôle d’arrivée : chaque correction doit voir son texte juste en place.
DO $$
DECLARE n_absentes int;
BEGIN
  SELECT count(*) INTO n_absentes FROM _corrections k
   WHERE NOT EXISTS (
     SELECT 1 FROM public.subjects s
       JOIN public.chapters c ON c.subject_id = s.id AND c.level = k.level AND c.title = k.chapter
       JOIN public.lessons l ON l.chapter_id = c.id
       LEFT JOIN public.quizzes qz ON qz.lesson_id = l.id
       LEFT JOIN public.quiz_questions x ON x.quiz_id = qz.id
      WHERE s.slug = k.slug
        AND strpos(CASE k.champ WHEN 'cours' THEN l.content WHEN 'question' THEN x.question
                   WHEN 'explication' THEN x.explanation ELSE x.options::text END, k.nouveau) > 0);
  RAISE NOTICE 'Migration 420 : % correction(s) sur 127 introuvables.', n_absentes;
  IF n_absentes > 0 THEN
    RAISE WARNING 'Migration 420 : des corrections n''ont pas trouvé leur fiche (titre, niveau ou fragment changé ?).';
  END IF;
END $$;

DROP TABLE IF EXISTS pg_temp._corrections;
