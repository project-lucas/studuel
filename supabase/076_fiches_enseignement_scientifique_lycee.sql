-- =============================================================================
-- Studuel — Migration 076 : fiches de révision Enseignement scientifique lycée
-- (1re · Tle, tronc commun)
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
    ('enseignement-scientifique', '1re', 'La Terre, un astre singulier', $md$# La Terre, un astre singulier — l'essentiel

**À retenir**
- Dès l'Antiquité, **Ératosthène** a mesuré la circonférence de la Terre en comparant l'ombre du Soleil en deux villes : la Terre est **ronde**.
- Le **rayon de la Terre** vaut environ **6 400 km**.
- La Terre est **singulière** dans le système solaire : eau liquide, atmosphère respirable, vie.

**Notions / Mécanisme**
- Ératosthène observe que le Soleil est au zénith à Syène mais fait un angle à Alexandrie ; à partir de cet angle et de la distance entre les deux villes, il déduit la circonférence.
- La distance Terre–Soleil (~150 millions de km) et la présence d'une atmosphère placent la Terre dans une zone tempérée où l'eau reste liquide.

**Exemple**
> Un bâton planté à la verticale ne fait aucune ombre à midi à l'équateur au solstice, mais une ombre plus au nord : cette différence d'angle mesure la courbure de la Terre.

**Erreur classique**
- Confondre **rayon** (~6 400 km) et **circonférence** (~40 000 km). La circonférence = 2 × π × rayon.$md$),

    ('enseignement-scientifique', '1re', 'Le Soleil, source d''énergie', $md$# Le Soleil, source d'énergie — l'essentiel

**À retenir**
- L'énergie du Soleil provient de la **fusion nucléaire** de l'hydrogène en hélium (H → He) dans son cœur.
- Cette énergie est rayonnée dans toutes les directions ; seule une infime part atteint la Terre.
- La puissance reçue par une surface dépend de l'**angle d'incidence** des rayons (d'où les saisons et les climats).

**Notions / Mécanisme**
- Dans le cœur du Soleil (très chaud, très dense), des noyaux d'hydrogène fusionnent pour former de l'hélium ; une petite perte de masse se transforme en énergie (E = mc²).
- Plus les rayons arrivent **perpendiculairement**, plus la surface reçoit d'énergie par m² : l'équateur reçoit plus que les pôles.

**Exemple**
> En été, le Soleil est haut dans le ciel : ses rayons sont presque verticaux, l'énergie est concentrée et il fait chaud. En hiver, ils sont rasants et l'énergie est étalée.

**Erreur classique**
- Croire que le Soleil « brûle » comme un feu (combustion). C'est une **fusion nucléaire**, pas une combustion chimique.$md$),

    ('enseignement-scientifique', '1re', 'Une longue histoire de la matière', $md$# Une longue histoire de la matière — l'essentiel

**À retenir**
- Toute la matière est faite d'un petit nombre d'**éléments chimiques** organisés dans le tableau périodique.
- L'**hydrogène** est l'élément le plus **abondant** de l'Univers ; il s'est formé juste après le Big Bang.
- Les éléments plus lourds (carbone, oxygène, fer…) sont fabriqués dans les **étoiles** puis dispersés.

**Notions / Mécanisme**
- Un **atome** = noyau (protons + neutrons) entouré d'électrons. Le nombre de protons définit l'élément.
- Les étoiles fusionnent l'hydrogène puis des noyaux de plus en plus lourds ; en fin de vie, elles rejettent ces éléments dans l'espace, matière première des planètes.

**Exemple**
> Les atomes de carbone de notre corps ont été forgés au cœur d'étoiles anciennes : « nous sommes des poussières d'étoiles ».

**Erreur classique**
- Confondre **atome** et **molécule** : une molécule est un assemblage de plusieurs atomes liés (ex. H₂O = 2 hydrogènes + 1 oxygène).$md$),

    ('enseignement-scientifique', '1re', 'Son et musique', $md$# Son et musique — l'essentiel

**À retenir**
- Un **son** est une vibration qui se propage dans un **milieu matériel** (air, eau…) : pas de son dans le vide.
- La **fréquence** (en hertz, Hz) détermine la **hauteur** : grave = basse fréquence, aigu = haute fréquence.
- L'**amplitude** détermine l'**intensité** (le volume, en décibels dB).

**Notions / Mécanisme**
- Une corde ou une membrane qui vibre comprime et dilate l'air ; cette onde se propage jusqu'à l'oreille.
- Dans la musique, les notes correspondent à des fréquences précises ; deux sons dont les fréquences sont dans un rapport simple sont perçus comme harmonieux (octave = rapport 2).

**Exemple**
> Un diapason « la » vibre à 440 Hz. Doubler la fréquence (880 Hz) donne le même « la » une octave plus haut.

**Erreur classique**
- Croire que le son se propage dans le vide : sans matière à faire vibrer, aucun son ne voyage (contrairement à la lumière).$md$),

    ('enseignement-scientifique', 'Tle', 'L''atmosphère et le climat', $md$# L'atmosphère et le climat — l'essentiel

**À retenir**
- L'**effet de serre** est un phénomène naturel : certains gaz (CO₂, vapeur d'eau, méthane) piègent une partie du rayonnement infrarouge et réchauffent la surface.
- Sans effet de serre, la Terre serait gelée (~ −18 °C au lieu de +15 °C).
- Les activités humaines augmentent le **CO₂**, ce qui **amplifie** l'effet de serre et réchauffe le climat.

**Notions / Mécanisme**
- Le Soleil chauffe le sol, qui réémet de l'infrarouge ; les gaz à effet de serre absorbent une part de cet infrarouge et la renvoient vers le sol.
- La combustion des énergies fossiles (charbon, pétrole, gaz) rejette du CO₂ ; sa concentration a fortement augmenté depuis l'ère industrielle.

**Exemple**
> Les carottes de glace montrent que le CO₂ atmosphérique est aujourd'hui bien plus élevé qu'au cours des centaines de milliers d'années passées.

**Erreur classique**
- Croire que l'effet de serre est mauvais en soi : il est **naturel et vital**. Le problème est son **renforcement** par les émissions humaines.$md$),

    ('enseignement-scientifique', 'Tle', 'L''énergie : conversions et enjeux', $md$# L'énergie : conversions et enjeux — l'essentiel

**À retenir**
- L'énergie se **conserve** : elle ne se crée ni ne se détruit, elle se **convertit** d'une forme à une autre.
- Toute conversion s'accompagne de **pertes**, surtout sous forme de chaleur : le **rendement** est toujours **≤ 1** (≤ 100 %).
- On distingue énergies **renouvelables** (solaire, éolien, hydraulique) et **non renouvelables** (fossiles, nucléaire).

**Notions / Mécanisme**
- Rendement = énergie utile ÷ énergie fournie. Le reste est « perdu » (dissipé en chaleur, frottements).
- Une centrale, un moteur, une ampoule : chaque appareil transforme une énergie d'entrée en énergie utile + pertes.

**Exemple**
> Une ampoule LED convertit environ 40 % de l'électricité en lumière et le reste en chaleur ; son rendement est bien meilleur qu'une ampoule à incandescence (~5 %).

**Erreur classique**
- Penser qu'un rendement peut dépasser 100 %. C'est impossible : on ne récupère jamais plus d'énergie utile qu'on n'en a fourni.$md$),

    ('enseignement-scientifique', 'Tle', 'Une histoire du vivant', $md$# Une histoire du vivant — l'essentiel

**À retenir**
- Tous les êtres vivants partagent une même molécule d'information : l'**ADN**.
- Les espèces actuelles descendent d'ancêtres communs : c'est l'**évolution**.
- Le moteur principal de l'évolution est la **sélection naturelle** décrite par Darwin.

**Notions / Mécanisme**
- L'ADN porte les gènes ; des **mutations** aléatoires créent de la diversité au sein d'une population.
- Les individus les mieux adaptés à leur milieu survivent et se reproduisent davantage : leurs caractères se répandent au fil des générations.

**Exemple**
> La ressemblance de l'ADN entre l'humain et le chimpanzé (plus de 98 % commun) témoigne d'un ancêtre commun récent.

**Erreur classique**
- Croire que les espèces évoluent « pour » s'adapter, volontairement. L'évolution n'a pas de but : elle résulte du tri des variations existantes par le milieu.$md$),

    ('enseignement-scientifique', 'Tle', 'L''intelligence artificielle', $md$# L'intelligence artificielle — l'essentiel

**À retenir**
- L'**intelligence artificielle** regroupe des programmes capables de tâches associées à l'intelligence (reconnaître, décider, traduire).
- L'**apprentissage automatique** (machine learning) : la machine apprend des régularités à partir de **données** au lieu d'être programmée règle par règle.
- La qualité d'une IA dépend de la **quantité** et de la **qualité** des données d'entraînement.

**Notions / Mécanisme**
- On fournit au modèle de nombreux exemples ; il ajuste ses paramètres pour minimiser ses erreurs, puis généralise à de nouveaux cas.
- Des données **biaisées** produisent une IA **biaisée** : d'où des enjeux éthiques (discrimination, vie privée, transparence).

**Exemple**
> Un modèle entraîné sur des milliers de photos étiquetées « chat » / « chien » apprend à classer une image inédite sans qu'on lui ait décrit ce qu'est un chat.

**Erreur classique**
- Croire que l'IA « comprend » comme un humain. Elle calcule des **corrélations statistiques** sur des données ; elle n'a ni conscience ni compréhension du sens.$md$)
  ) AS v(slug, level, chapter, md)
  JOIN public.subjects s ON s.slug = v.slug
  JOIN public.chapters c
    ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
 WHERE l.chapter_id = c.id
   AND l.title = 'L''essentiel du cours'
   AND l.revision_sheet IS DISTINCT FROM v.md;
