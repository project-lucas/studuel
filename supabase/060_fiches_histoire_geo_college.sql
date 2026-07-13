-- =============================================================================
-- Studuel — Migration 060 : fiches de révision Histoire-Géo collège (6e · 5e · 4e · 3e)
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
    ('histoire-geo', '6e', 'La longue histoire de l''humanité', $md$# La longue histoire de l'humanité — l'essentiel

**À retenir**
- La **Préhistoire** commence avec les premiers humains et se termine avec l'invention de l'**écriture** (vers 3300 av. J.-C.).
- Au **Paléolithique**, les humains sont **nomades**, chasseurs-cueilleurs ; ils maîtrisent le **feu** et taillent la pierre.
- Au **Néolithique**, la découverte de l'**agriculture** et de l'**élevage** rend les humains **sédentaires** (premiers villages).

**Repères**
- Vers 3,3 millions d'années : premiers outils taillés.
- Vers 10000 av. J.-C. : « révolution néolithique » (agriculture au Proche-Orient).

**Exemple**
> La grotte de Lascaux (vers 18000 av. J.-C.) montre des peintures rupestres d'animaux.

**Erreur classique**
- Croire que les humains et les dinosaures ont vécu ensemble : les dinosaures ont disparu bien avant l'apparition de l'humanité.$md$),

    ('histoire-geo', '6e', 'Premiers États, premières écritures', $md$# Premiers États, premières écritures — l'essentiel

**À retenir**
- Les premières **cités-États** naissent en **Mésopotamie** (entre le Tigre et l'Euphrate) et en **Égypte**, le long des fleuves.
- L'**écriture** apparaît pour gérer les récoltes, le commerce et les impôts.
- Un **roi** ou un **pharaon** dirige, aidé par des **scribes** et des prêtres.

**Repères**
- Vers 3300 av. J.-C. : naissance de l'écriture cunéiforme à Sumer.
- Vers 3000 av. J.-C. : hiéroglyphes en Égypte.

**Exemple**
> Le scribe égyptien note les récoltes sur un papyrus à l'aide de hiéroglyphes.

**Erreur classique**
- Confondre **cunéiforme** (Mésopotamie, sur tablettes d'argile) et **hiéroglyphes** (Égypte, sur pierre ou papyrus).$md$),

    ('histoire-geo', '6e', 'Rome : du mythe à l''histoire', $md$# Rome : du mythe à l'histoire — l'essentiel

**À retenir**
- La **légende** attribue la fondation de Rome à **Romulus** (et Remus), élevés par une louve.
- Rome passe de la **royauté** à la **République** (dirigée par le Sénat et des magistrats élus), puis à l'**Empire**.
- Rome étend sa domination sur tout le pourtour de la **Méditerranée**.

**Dates clés**
- 753 av. J.-C. : fondation légendaire de Rome.
- 509 av. J.-C. : début de la République.
- 27 av. J.-C. : Auguste, premier empereur.

**Exemple**
> Auguste devient le premier empereur romain et fonde un régime nouveau après la République.

**Erreur classique**
- Prendre la légende de Romulus pour un fait historique : c'est un **mythe** de fondation, pas une preuve.$md$),

    ('histoire-geo', '6e', 'Habiter une métropole', $md$# Habiter une métropole — l'essentiel

**À retenir**
- Une **métropole** est une très grande ville qui concentre population, activités et pouvoirs.
- Habiter une métropole, c'est y **loger**, s'y **déplacer**, y **travailler** et se **divertir**.
- Les métropoles des pays riches et des pays pauvres n'offrent pas les mêmes conditions de vie (bidonvilles, embouteillages…).

**Repères**
- Plus de la moitié de l'humanité vit aujourd'hui en ville.
- Exemples de métropoles : Paris, Tokyo, New York, Mumbai.

**Exemple**
> À Mumbai (Inde), gratte-ciel modernes et bidonvilles se côtoient dans la même métropole.

**Erreur classique**
- Croire qu'une métropole est seulement « une ville » : c'est surtout une ville qui **commande** (économie, décisions) à l'échelle d'un pays ou du monde.$md$),

    ('histoire-geo', '6e', 'Habiter les littoraux', $md$# Habiter les littoraux — l'essentiel

**À retenir**
- Un **littoral** est la zone de contact entre la terre et la mer.
- On distingue les littoraux **industrialo-portuaires** (ports, usines) et les littoraux **touristiques** (plages, tourisme).
- Les littoraux sont très **peuplés** mais aussi **fragiles** (montée des eaux, pollution).

**Repères**
- Une grande partie de la population mondiale vit à moins de 100 km d'une côte.
- Exemples : Shanghai (port), la Côte d'Azur (tourisme).

**Exemple**
> Le port de Shanghai (Chine) est l'un des plus grands du monde pour le commerce de marchandises.

**Erreur classique**
- Penser que tous les littoraux se ressemblent : un littoral **portuaire** et un littoral **touristique** ont des paysages et des activités très différents.$md$),

    ('histoire-geo', '5e', 'Byzance et l''Europe carolingienne', $md$# Byzance et l'Europe carolingienne — l'essentiel

**À retenir**
- Après la chute de Rome (Occident), l'**Empire byzantin** (capitale **Constantinople**) prolonge l'Empire romain d'Orient, chrétien et grec.
- En Occident, **Charlemagne** unifie une grande partie de l'Europe et est couronné **empereur**.
- Chrétienté d'Orient (**orthodoxe**) et chrétienté d'Occident (**catholique**) se séparent peu à peu.

**Dates clés**
- 476 : chute de l'Empire romain d'Occident.
- 800 : couronnement de Charlemagne comme empereur.

**Exemple**
> À Constantinople, l'empereur Justinien fait construire la basilique Sainte-Sophie.

**Erreur classique**
- Confondre **Byzance/Constantinople** (Orient grec) et l'**empire de Charlemagne** (Occident latin) : ce sont deux ensembles distincts.$md$),

    ('histoire-geo', '5e', 'Société, Église et pouvoir féodal', $md$# Société, Église et pouvoir féodal — l'essentiel

**À retenir**
- La société médiévale est divisée en trois groupes : ceux qui **prient** (clergé), ceux qui **combattent** (seigneurs) et ceux qui **travaillent** (paysans).
- La **féodalité** repose sur le lien entre le **seigneur** et son **vassal** (fidélité contre protection et fief).
- L'**Église** est très puissante : elle rythme la vie (fêtes, sacrements) et possède des terres.

**Repères**
- Xe-XIIIe siècle : apogée de la société féodale.
- Le **château fort** protège le seigneur et domine les campagnes.

**Exemple**
> Un paysan (serf) travaille la terre du seigneur et lui doit des redevances et des corvées.

**Erreur classique**
- Croire que le roi commande directement tout le monde : au Moyen Âge, le pouvoir est **morcelé** entre de nombreux seigneurs.$md$),

    ('histoire-geo', '5e', 'L''islam médiéval : pouvoirs et cultures', $md$# L'islam médiéval : pouvoirs et cultures — l'essentiel

**À retenir**
- L'**islam** naît au VIIe siècle en Arabie, prêché par le prophète **Mahomet**.
- Les conquêtes créent un vaste **empire musulman** allant de l'Espagne à l'Inde, dirigé par un **calife**.
- Les villes musulmanes (Bagdad, Cordoue) sont de grands foyers de **commerce** et de **savoir** (mathématiques, médecine).

**Dates clés**
- 622 : l'Hégire (départ de Mahomet vers Médine), an 1 du calendrier musulman.
- 762 : fondation de Bagdad, capitale du califat.

**Exemple**
> À Bagdad, la « Maison de la sagesse » traduit et étudie les textes grecs de mathématiques et de médecine.

**Erreur classique**
- Confondre l'**islam** (la religion) et un **pays** : l'empire musulman médiéval regroupe de nombreux peuples et régions.$md$),

    ('histoire-geo', '5e', 'La croissance démographique et ses effets', $md$# La croissance démographique et ses effets — l'essentiel

**À retenir**
- La **population mondiale** augmente très vite : elle a dépassé **7 milliards** d'habitants.
- Cette croissance vient surtout des pays en **développement** (forte natalité).
- Elle pose des défis : **nourrir**, **loger**, **scolariser** et préserver l'environnement.

**Repères**
- Vers 1800 : environ 1 milliard d'humains.
- Aujourd'hui : plus de 8 milliards d'humains.

**Exemple**
> En Inde, la population dépasse le milliard d'habitants et continue d'augmenter.

**Erreur classique**
- Croire que la population augmente partout au même rythme : certains pays riches ont une croissance **faible** ou nulle.$md$),

    ('histoire-geo', '5e', 'L''accès aux ressources : énergie et eau', $md$# L'accès aux ressources : énergie et eau — l'essentiel

**À retenir**
- Les **ressources** (eau douce, pétrole, gaz) sont **inégalement réparties** sur la planète.
- La demande en **énergie** et en **eau** augmente avec la population et le développement.
- Certaines ressources sont **épuisables** (pétrole) ; il faut les gérer et développer les énergies **renouvelables**.

**Repères**
- L'eau douce représente une très faible part de l'eau de la planète.
- Le pétrole reste la première source d'énergie mondiale.

**Exemple**
> Au Proche-Orient, l'accès à l'eau du fleuve peut être source de tensions entre pays voisins.

**Erreur classique**
- Confondre **eau disponible** et **eau potable** : une région peut avoir de l'eau sans qu'elle soit propre à la consommation.$md$),

    ('histoire-geo', '4e', 'L''Europe des Lumières', $md$# L'Europe des Lumières — l'essentiel

**À retenir**
- Au **XVIIIe siècle**, des **philosophes** (les Lumières) défendent la **raison**, la **liberté** et la **tolérance**.
- Ils critiquent la monarchie absolue, l'inégalité et le fanatisme religieux.
- Leurs idées circulent grâce aux **livres**, aux **salons** et à l'**Encyclopédie**.

**Repères**
- 1751-1772 : publication de l'*Encyclopédie* (Diderot et d'Alembert).
- Philosophes clés : Voltaire, Montesquieu, Rousseau.

**Exemple**
> Montesquieu propose la **séparation des pouvoirs** (législatif, exécutif, judiciaire) pour éviter la tyrannie.

**Erreur classique**
- Croire que « Lumières » désigne une invention technique : ce sont des **idées** nouvelles sur la société et le pouvoir.$md$),

    ('histoire-geo', '4e', 'La Révolution française et l''Empire', $md$# La Révolution française et l'Empire — l'essentiel

**À retenir**
- En **1789**, la Révolution met fin à la **monarchie absolue** et proclame la **Déclaration des droits de l'homme et du citoyen**.
- La France devient une **République** en 1792 ; le roi Louis XVI est exécuté.
- **Napoléon Bonaparte** prend le pouvoir puis devient **empereur** ; il réforme la France (Code civil) mais fait la guerre en Europe.

**Dates clés**
- 14 juillet 1789 : prise de la Bastille.
- 26 août 1789 : Déclaration des droits de l'homme et du citoyen.
- 1804 : Napoléon empereur.

**Exemple**
> La *Déclaration des droits de l'homme et du citoyen* affirme que « les hommes naissent libres et égaux en droits ».

**Erreur classique**
- Confondre **1789** (début de la Révolution) et **1792** (proclamation de la République) : la République n'arrive pas dès 1789.$md$),

    ('histoire-geo', '4e', 'L''Europe de la révolution industrielle', $md$# L'Europe de la révolution industrielle — l'essentiel

**À retenir**
- Au **XIXe siècle**, la **machine à vapeur**, le **charbon** et les **usines** transforment la production.
- De nouvelles classes sociales apparaissent : la **bourgeoisie** (patrons) et les **ouvriers**.
- Le développement du **chemin de fer** accélère les transports et le commerce.

**Repères**
- La révolution industrielle débute en **Angleterre** à la fin du XVIIIe siècle.
- Le travail en usine est long, dur et mal payé (y compris pour les enfants).

**Exemple**
> Dans une usine textile, des ouvriers travaillent plus de 12 heures par jour près des machines à vapeur.

**Erreur classique**
- Croire que tout le monde profite du progrès : les **ouvriers** vivent souvent dans la misère malgré la richesse produite.$md$),

    ('histoire-geo', '4e', 'L''urbanisation du monde', $md$# L'urbanisation du monde — l'essentiel

**À retenir**
- L'**urbanisation** est l'augmentation de la part de la population vivant en **ville**.
- Les villes s'**étalent** (banlieues, périurbain) et forment parfois des **mégalopoles**.
- Ce phénomène est très rapide dans les pays en développement (exode rural).

**Repères**
- Depuis 2007, plus de la moitié de l'humanité vit en ville.
- Certaines villes dépassent 20 millions d'habitants (mégapoles).

**Exemple**
> À Lagos (Nigeria), la population urbaine explose et la ville s'étend très vite.

**Erreur classique**
- Confondre **urbanisation** (part des citadins qui augmente) et simple **croissance de la population** : on peut avoir plus d'habitants sans plus de citadins.$md$),

    ('histoire-geo', '4e', 'Les mobilités humaines', $md$# Les mobilités humaines — l'essentiel

**À retenir**
- Les **mobilités** sont les déplacements des humains : **migrations** (installation durable) et **tourisme** (déplacement temporaire).
- On distingue le pays de **départ** (origine) et le pays d'**arrivée** (destination).
- Les migrants partent souvent pour des raisons **économiques**, **politiques** (guerres) ou **climatiques**.

**Repères**
- Les grands flux migratoires vont souvent des pays pauvres vers les pays riches.
- Le tourisme international concerne plus d'un milliard de voyageurs par an.

**Exemple**
> De nombreux migrants traversent la Méditerranée pour rejoindre l'Europe.

**Erreur classique**
- Confondre un **migrant** (qui s'installe durablement) et un **touriste** (qui voyage temporairement pour le loisir).$md$),

    ('histoire-geo', '3e', 'La Première Guerre mondiale', $md$# La Première Guerre mondiale — l'essentiel

**À retenir**
- La Première Guerre mondiale (**1914-1918**) oppose la **Triple-Entente** (France, Royaume-Uni, Russie) aux **Empires centraux** (Allemagne, Autriche-Hongrie).
- C'est une **guerre totale** : elle mobilise soldats, civils, économies et colonies.
- La guerre de **tranchées** (front) fait des millions de morts dans des conditions terribles (Verdun).

**Dates clés**
- 1914 : début de la guerre.
- 1916 : bataille de Verdun.
- 11 novembre 1918 : armistice.

**Exemple**
> À Verdun (1916), les soldats (« poilus ») subissent des mois de combats dans les tranchées.

**Erreur classique**
- Confondre l'**armistice** de 1918 (arrêt des combats) et le **traité de Versailles** de 1919 (paix qui punit l'Allemagne).$md$),

    ('histoire-geo', '3e', 'L''Europe entre les deux guerres', $md$# L'Europe entre les deux guerres — l'essentiel

**À retenir**
- Après 1918, l'Europe est fragilisée ; la **crise économique de 1929** aggrave le chômage et la misère.
- Des régimes **totalitaires** s'installent : le **communisme** en URSS (Staline), le **fascisme** en Italie (Mussolini), le **nazisme** en Allemagne (Hitler).
- Ces régimes suppriment les **libertés**, encadrent la population et persécutent leurs opposants.

**Dates clés**
- 1922 : Mussolini au pouvoir en Italie.
- 1929 : krach boursier de Wall Street.
- 1933 : Hitler au pouvoir en Allemagne.

**Exemple**
> En URSS, Staline impose la collectivisation des terres et élimine ses opposants.

**Erreur classique**
- Confondre les régimes : le **nazisme** (Allemagne) et le **communisme** stalinien (URSS) sont deux totalitarismes **différents**, malgré des points communs.$md$),

    ('histoire-geo', '3e', 'La Seconde Guerre mondiale', $md$# La Seconde Guerre mondiale — l'essentiel

**À retenir**
- La Seconde Guerre mondiale (**1939-1945**) oppose les **Alliés** (France, Royaume-Uni, URSS, États-Unis) à l'**Axe** (Allemagne nazie, Italie, Japon).
- C'est une **guerre d'anéantissement** : violences extrêmes contre les civils.
- Le régime nazi organise le **génocide** des Juifs et des Tsiganes (la Shoah).

**Dates clés**
- 1er septembre 1939 : invasion de la Pologne.
- 6 juin 1944 : débarquement en Normandie.
- 8 mai 1945 : capitulation de l'Allemagne.

**Exemple**
> Dans les camps d'extermination comme Auschwitz, les nazis assassinent des millions de Juifs d'Europe.

**Erreur classique**
- Confondre **camp de concentration** (travail forcé) et **camp d'extermination** (destiné à tuer) : ce ne sont pas exactement la même chose.$md$),

    ('histoire-geo', '3e', 'La France de 1944 à nos jours', $md$# La France de 1944 à nos jours — l'essentiel

**À retenir**
- À la **Libération** (1944), la France rétablit la **République** ; les **femmes** obtiennent le **droit de vote**.
- La **Ve République** est fondée en **1958** par le général **de Gaulle**, avec un président fort.
- La société change : décolonisation, construction européenne, alternances politiques.

**Dates clés**
- 1944 : droit de vote des femmes.
- 1958 : fondation de la Ve République.
- 1981 : première alternance (élection de François Mitterrand).

**Exemple**
> En 1944, les Françaises votent pour la première fois grâce au droit de vote accordé à la Libération.

**Erreur classique**
- Croire que les femmes votent en France depuis la Révolution : elles n'obtiennent ce droit qu'en **1944**.$md$),

    ('histoire-geo', '3e', 'Les aires urbaines en France', $md$# Les aires urbaines en France — l'essentiel

**À retenir**
- Une **aire urbaine** regroupe une ville-centre, sa **banlieue** et sa couronne **périurbaine**.
- La majorité des Français vivent dans des aires urbaines ; **Paris** est la plus grande.
- L'étalement urbain provoque des **déplacements quotidiens** (domicile-travail) et de la **périurbanisation**.

**Repères**
- Environ 8 Français sur 10 vivent dans une aire urbaine.
- Les grandes aires urbaines : Paris, Lyon, Marseille.

**Exemple**
> Beaucoup d'habitants de la couronne périurbaine de Paris travaillent chaque jour dans la ville-centre.

**Erreur classique**
- Confondre la **ville-centre** seule et l'**aire urbaine** entière : l'aire urbaine inclut aussi banlieue et zones périurbaines.$md$)
  ) AS v(slug, level, chapter, md)
  JOIN public.subjects s ON s.slug = v.slug
  JOIN public.chapters c
    ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
 WHERE l.chapter_id = c.id
   AND l.title = 'L''essentiel du cours'
   AND l.revision_sheet IS DISTINCT FROM v.md;
