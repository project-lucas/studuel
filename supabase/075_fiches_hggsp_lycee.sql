-- =============================================================================
-- Studuel — Migration 075 : fiches de révision HGGSP lycée (1re · Tle)
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
    ('hggsp', '1re', 'La démocratie : fragilités et évolutions', $md$# La démocratie : fragilités et évolutions — l'essentiel

**À retenir**
- La **démocratie directe** naît à **Athènes** (Ve s. av. J.-C.) : les citoyens votent en personne à l'Ecclésia, mais la citoyenneté exclut femmes, métèques et esclaves.
- La **démocratie représentative** moderne repose sur des élus, la séparation des pouvoirs (Montesquieu) et l'État de droit.
- Les démocraties restent **fragiles** : elles peuvent basculer dans des régimes autoritaires ou populistes (ex. montée des fascismes dans l'entre-deux-guerres).
- L'**Union européenne** est un objet politique original, entre coopération d'États et intégration démocratique (déficit démocratique débattu).

**Dates clés / Repères**
- **Ve s. av. J.-C.** : démocratie athénienne (Clisthène 508, apogée sous Périclès).
- **1863** : discours de Gettysburg de Lincoln, « gouvernement du peuple, par le peuple, pour le peuple ».
- **1992** : traité de Maastricht, création de l'Union européenne et de la citoyenneté européenne.

**Exemple**
> À Athènes, seuls les citoyens (hommes libres nés de parents athéniens) participent : environ 40 000 personnes sur une population totale de plus de 300 000.

**Erreur classique**
- Croire que la démocratie athénienne était universelle : c'était une démocratie **directe mais très restreinte**, réservée à une minorité d'hommes.$md$),

    ('hggsp', '1re', 'Les frontières dans le monde', $md$# Les frontières dans le monde — l'essentiel

**À retenir**
- Une **frontière** est une limite qui sépare deux espaces sous souveraineté différente ; elle peut être terrestre, maritime ou immatérielle.
- Loin de disparaître avec la mondialisation, les frontières se **multiplient** : depuis 1991, des dizaines de nouveaux États et de nombreux **murs** (barrières) sont apparus.
- Les frontières ont des fonctions multiples : **contrôle** (migrations, marchandises), **protection**, mais aussi **contact** et échange.
- L'**espace Schengen** illustre une frontière ouverte à l'intérieur et contrôlée à l'extérieur.

**Dates clés / Repères**
- **1648** : traités de Westphalie, naissance de l'État territorial souverain aux frontières définies.
- **1989** : chute du mur de Berlin (érigé en 1961), symbole de la fin de la Guerre froide.
- **1985 / 1995** : accords puis mise en application de la convention de Schengen (libre circulation).

**Exemple**
> Le mur entre les États-Unis et le Mexique (plus de 3 000 km de frontière) montre la volonté de contrôler les flux migratoires malgré la mondialisation des échanges.

**Erreur classique**
- Penser que la mondialisation efface les frontières : elle les **transforme et en crée de nouvelles** (murs, zones de contrôle), elle ne les supprime pas.$md$),

    ('hggsp', '1re', 'Le pouvoir des médias', $md$# Le pouvoir des médias — l'essentiel

**À retenir**
- Les médias forment un **quatrième pouvoir** : ils informent, forment l'opinion et contrôlent les autres pouvoirs (contre-pouvoir).
- Leur histoire suit les révolutions techniques : **presse écrite**, radio, télévision, puis **Internet et réseaux sociaux**.
- La liberté de la presse est un pilier démocratique, mais les médias peuvent aussi servir la **propagande** ou diffuser des **infox** (fake news).
- Le numérique bouscule les médias traditionnels : information instantanée, mais fragmentée et difficile à vérifier.

**Dates clés / Repères**
- **1881** : loi française sur la **liberté de la presse**.
- **1938** : diffusion radio de *La Guerre des mondes* (Orson Welles), exemple de panique médiatique.
- **1974** : affaire du **Watergate**, la presse (Washington Post) fait tomber le président Nixon.

**Exemple**
> L'affaire du Watergate, révélée par deux journalistes du Washington Post, montre le rôle de contre-pouvoir de la presse : elle aboutit à la démission de Nixon en 1974.

**Erreur classique**
- Confondre **information** (vérifiée, sourcée) et **opinion** ou rumeur circulant sur les réseaux sociaux : tout ce qui est publié en ligne n'est pas de l'information fiable.$md$),

    ('hggsp', '1re', 'États et religions', $md$# États et religions — l'essentiel

**À retenir**
- Les rapports entre États et religions varient : **théocratie** (le religieux gouverne), **religion d'État**, ou **laïcité** (séparation).
- La **laïcité** française garantit la liberté de conscience, la neutralité de l'État et l'égalité des cultes.
- Aux États-Unis, la séparation existe aussi mais la religion reste très présente dans la vie publique (« In God We Trust »).
- Certains États restent des **théocraties** (ex. Iran depuis 1979, Vatican).

**Dates clés / Repères**
- **1598** : édit de Nantes (Henri IV), tolérance envers les protestants ; révoqué en 1685.
- **1789** : Déclaration des droits de l'homme, liberté de religion (article 10).
- **1905** : loi de **séparation des Églises et de l'État** en France (laïcité).

**Exemple**
> La loi de 1905 pose deux principes : la République ne reconnaît ni ne subventionne aucun culte, mais garantit le libre exercice des religions.

**Erreur classique**
- Confondre laïcité et athéisme d'État : la laïcité ne combat pas les religions, elle **garantit la liberté de croire ou de ne pas croire** et la neutralité de l'État.$md$),

    ('hggsp', 'Tle', 'Environnement : exploiter, préserver', $md$# Environnement : exploiter, préserver — l'essentiel

**À retenir**
- L'**environnement** est à la fois une ressource à exploiter et un patrimoine à préserver : la tension entre les deux structure les politiques actuelles.
- La prise de conscience écologique s'affirme depuis les années 1970 avec l'idée de **développement durable** (répondre aux besoins présents sans compromettre ceux des générations futures).
- Le **changement climatique** est devenu un enjeu géopolitique majeur, régulé par des conférences internationales (COP).
- Exploiter un milieu peut le dégrader durablement (déforestation, épuisement des sols), d'où la nécessité d'une gestion raisonnée.

**Dates clés / Repères**
- **1972** : sommet de **Stockholm**, première conférence de l'ONU sur l'environnement ; rapport Meadows *Halte à la croissance*.
- **1987** : rapport **Brundtland**, définition du développement durable.
- **1992** : sommet de la Terre de **Rio**. **2015** : **accord de Paris** (COP21), limiter le réchauffement sous 2 °C.

**Exemple**
> L'accord de Paris (2015) engage près de 195 États à limiter le réchauffement bien en dessous de 2 °C par rapport à l'ère préindustrielle.

**Erreur classique**
- Opposer totalement « exploiter » et « préserver » : le **développement durable** cherche justement à concilier développement économique et protection de l'environnement.$md$),

    ('hggsp', 'Tle', 'Guerres et paix', $md$# Guerres et paix — l'essentiel

**À retenir**
- **Clausewitz** définit la guerre comme « la continuation de la politique par d'autres moyens » : la guerre est un instrument au service d'objectifs politiques.
- Les formes de guerre évoluent : guerres interétatiques classiques, guerres **asymétriques** (contre des acteurs non étatiques), guerres irrégulières et terrorisme.
- Construire la paix passe par le **droit international** et des institutions : SDN puis **ONU**, chargées de la sécurité collective.
- La dissuasion **nucléaire** (équilibre de la terreur pendant la Guerre froide) a transformé le rapport à la guerre entre grandes puissances.

**Dates clés / Repères**
- **1832** : publication posthume de *De la guerre* de **Clausewitz**.
- **1919** : création de la **SDN** (Société des Nations) au traité de Versailles ; échec dans les années 1930.
- **1945** : création de l'**ONU** (Charte de San Francisco) ; Conseil de sécurité et 5 membres permanents.

**Exemple**
> Le Conseil de sécurité de l'ONU (1945) peut voter des sanctions ou autoriser une intervention, mais ses 5 membres permanents (États-Unis, Russie, Chine, France, Royaume-Uni) disposent d'un droit de veto qui peut le paralyser.

**Erreur classique**
- Croire que la guerre est le contraire de la politique : pour Clausewitz, elle en est au contraire le **prolongement**, un moyen au service de fins politiques.$md$),

    ('hggsp', 'Tle', 'L''enjeu de la connaissance', $md$# L'enjeu de la connaissance — l'essentiel

**À retenir**
- La **connaissance** (savoirs scientifiques, techniques, culturels) est une ressource stratégique et un enjeu de pouvoir entre États et acteurs.
- Sa production et sa diffusion s'appuient sur des institutions : universités, académies, aujourd'hui **Internet** et le numérique.
- La connaissance peut être **libre** (open source, science ouverte) ou **protégée** (brevets, secret, espionnage industriel).
- Elle est au cœur des **rivalités géopolitiques** : course technologique, cyberespace, intelligence artificielle.

**Dates clés / Repères**
- **XVIIe s.** : révolution scientifique (Galilée, Newton) et naissance des académies (Royal Society 1660, Académie des sciences 1666).
- **1969** : premiers échanges sur **ARPANET**, ancêtre d'Internet.
- **1990-1991** : invention du **Web** par Tim Berners-Lee au CERN, diffusion mondiale de la connaissance.

**Exemple**
> Le CERN, où naît le Web en 1991, illustre la connaissance comme bien partagé : le protocole est rendu public et gratuit, ce qui accélère sa diffusion mondiale.

**Erreur classique**
- Penser que la connaissance circule librement partout : elle est aussi un **enjeu de pouvoir**, protégée par des brevets, du secret ou censurée selon les régimes.$md$),

    ('hggsp', 'Tle', 'Le patrimoine', $md$# Le patrimoine — l'essentiel

**À retenir**
- Le **patrimoine** désigne l'héritage matériel (monuments, sites) et immatériel (langues, savoir-faire, traditions) transmis aux générations futures.
- Sa notion s'élargit : d'abord monuments nationaux, puis patrimoine **mondial**, naturel et immatériel.
- Le patrimoine est un enjeu **identitaire, politique et économique** (tourisme), mais aussi une cible en temps de guerre (destructions volontaires).
- L'**UNESCO** joue un rôle central de classement et de protection à l'échelle mondiale.

**Dates clés / Repères**
- **1793** : ouverture du **musée du Louvre**, patrimoine rendu accessible à la nation.
- **1972** : convention de l'UNESCO sur la protection du **patrimoine mondial** (culturel et naturel).
- **2003** : convention de l'UNESCO pour la sauvegarde du **patrimoine culturel immatériel**.

**Exemple**
> La destruction des bouddhas de Bâmiyân (Afghanistan) par les talibans en 2001 montre que le patrimoine peut devenir une cible politique et symbolique.

**Erreur classique**
- Réduire le patrimoine aux seuls monuments anciens : il inclut aussi le patrimoine **immatériel** (langues, fêtes, savoir-faire) et **naturel**, protégés depuis 1972 et 2003.$md$)
  ) AS v(slug, level, chapter, md)
  JOIN public.subjects s ON s.slug = v.slug
  JOIN public.chapters c
    ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
 WHERE l.chapter_id = c.id
   AND l.title = 'L''essentiel du cours'
   AND l.revision_sheet IS DISTINCT FROM v.md;
