-- =============================================================================
-- Studuel — Migration 063 : fiches de révision Physique-Chimie collège (5e · 4e · 3e)
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
    ('physique-chimie', '5e', 'Les états de la matière', $md$# Les états de la matière — l'essentiel

**À retenir**
- La matière existe sous trois **états** : **solide** (forme propre), **liquide** (prend la forme du récipient, surface plane) et **gaz** (occupe tout l'espace, compressible).
- Les changements d'état ont un nom : **fusion** (solide→liquide), **solidification** (liquide→solide), **vaporisation** (liquide→gaz), **liquéfaction** (gaz→liquide).
- Un changement d'état conserve la **masse** ; le volume, lui, peut varier.

**Méthode : identifier un état**
- Forme fixe + volume fixe → solide. Volume fixe mais forme libre → liquide. Ni forme ni volume propres → gaz.

**Exemple**
> L'eau fond (fusion) à 0 °C et bout (vaporisation) à 100 °C sous pression normale.

**Erreur classique**
- Croire que la masse diminue quand la glace fond : la masse se conserve, seul le volume change.$md$),

    ('physique-chimie', '5e', 'Les mélanges et solutions', $md$# Les mélanges et solutions — l'essentiel

**À retenir**
- Un mélange est **homogène** si on ne distingue pas ses constituants (eau salée), **hétérogène** si on les voit (eau + huile).
- Dissoudre un **soluté** (sel) dans un **solvant** (eau) donne une **solution**.
- Techniques de séparation : **filtration** (retient le solide), **décantation** (dépôt par gravité), **distillation** (sépare selon l'ébullition).

**Méthode : séparer les constituants**
- Eau boueuse → décantation puis filtration. Eau salée → distillation (l'eau s'évapore, le sel reste).

**Exemple**
> 5 g de sel dissous dans 100 g d'eau donnent 105 g de solution : la masse se conserve.

**Erreur classique**
- Penser que la filtration retire le sel dissous : elle ne retient que ce qui est solide et non dissous.$md$),

    ('physique-chimie', '5e', 'Circuits électriques simples', $md$# Circuits électriques simples — l'essentiel

**À retenir**
- Un circuit fermé permet au courant de circuler ; un circuit **ouvert** (interrupteur ouvert) l'interrompt.
- En **série**, les composants sont sur une seule boucle ; en **dérivation**, ils sont sur des branches séparées.
- Un **court-circuit** met une pile en contact direct : danger de surchauffe.

**Méthode : série ou dérivation ?**
- En série, si une lampe grille, tout s'éteint. En dérivation, chaque branche est indépendante.

**Exemple**
> Deux lampes en série brillent moins que la même lampe seule ; en dérivation, chacune brille normalement.

**Erreur classique**
- Oublier que le courant a besoin d'une **boucle fermée** : une borne débranchée = pas de courant.$md$),

    ('physique-chimie', '5e', 'La lumière : sources et propagation', $md$# La lumière : sources et propagation — l'essentiel

**À retenir**
- Une source **primaire** produit sa lumière (Soleil, lampe) ; un objet **diffusant** ne fait que renvoyer la lumière reçue (Lune, mur).
- Dans un milieu **transparent et homogène**, la lumière se propage en **ligne droite**.
- Un objet opaque éclairé crée une **ombre** derrière lui.

**Méthode : expliquer une ombre**
- La lumière allant tout droit ne contourne pas l'obstacle : la zone non atteinte est l'ombre portée.

**Exemple**
> La lumière parcourt environ 300 000 km par seconde ; celle du Soleil met ~8 minutes à nous atteindre.

**Erreur classique**
- Croire que la Lune est une source primaire : elle diffuse seulement la lumière du Soleil.$md$),

    ('physique-chimie', '4e', 'L''air et ses propriétés', $md$# L'air et ses propriétés — l'essentiel

**À retenir**
- L'air est un **mélange de gaz** : environ 78 % de diazote (N₂) et 21 % de dioxygène (O₂).
- L'air est de la matière : il a une **masse** (~1,2 g par litre) et il est **compressible** (on peut réduire son volume).
- Comprimer un gaz augmente sa **pression** ; le détendre la diminue.

**Méthode : montrer que l'air a une masse**
- On pèse un ballon dégonflé puis gonflé : le ballon gonflé est plus lourd, donc l'air a une masse.

**Exemple**
> 1 L d'air a une masse d'environ 1,2 g dans les conditions usuelles.

**Erreur classique**
- Penser que l'air « ne pèse rien » : il a bien une masse, simplement faible par litre.$md$),

    ('physique-chimie', '4e', 'Les transformations chimiques', $md$# Les transformations chimiques — l'essentiel

**À retenir**
- Une **transformation chimique** fait disparaître des **réactifs** et apparaître des **produits** (nouvelles substances).
- La **masse totale se conserve** : masse des réactifs = masse des produits (Lavoisier).
- On la décrit par un **bilan** : réactifs → produits.

**Méthode : reconnaître une réaction chimique**
- Il y a réaction si de nouvelles substances apparaissent (couleur, gaz, dépôt), pas seulement un changement d'état.

**Exemple**
> Combustion du carbone : carbone + dioxygène → dioxyde de carbone. La masse totale ne change pas.

**Erreur classique**
- Croire que la masse diminue quand un gaz se forme : si on pèse tout (gaz compris), la masse est conservée.$md$),

    ('physique-chimie', '4e', 'Intensité et tension électriques', $md$# Intensité et tension électriques — l'essentiel

**À retenir**
- L'**intensité** I (en **ampères**, A) mesure le débit de courant ; on la mesure avec un **ampèremètre en série**.
- La **tension** U (en **volts**, V) mesure l'énergie entre deux points ; on la mesure avec un **voltmètre en dérivation**.
- La **loi d'Ohm** relie tension et intensité d'un conducteur : **U = R × I** (R en ohms Ω).

**Méthode : appliquer U = R × I**
- Pour R = 10 Ω et I = 0,5 A : U = 10 × 0,5 = 5 V.

**Exemple**
> Une résistance de 20 Ω traversée par 0,2 A a à ses bornes une tension U = 20 × 0,2 = 4 V.

**Erreur classique**
- Brancher l'ampèremètre en dérivation : il se place toujours **en série** ; le voltmètre, lui, en dérivation.$md$),

    ('physique-chimie', '4e', 'Vitesse et mouvement', $md$# Vitesse et mouvement — l'essentiel

**À retenir**
- Décrire un mouvement, c'est préciser sa **trajectoire** (la ligne suivie) par rapport à un **référentiel**.
- La **vitesse** se calcule par **v = d ÷ t** (distance divisée par durée).
- Unités : d en mètres et t en secondes → v en m/s ; d en km et t en h → v en km/h.

**Méthode : calculer une vitesse**
- 100 m parcourus en 20 s : v = 100 ÷ 20 = 5 m/s.

**Exemple**
> Une voiture qui fait 90 km en 1 h roule à v = 90 ÷ 1 = 90 km/h.

**Erreur classique**
- Mélanger les unités : diviser des km par des secondes. Il faut des unités cohérentes (km/h ou m/s).$md$),

    ('physique-chimie', '3e', 'Ions et pH', $md$# Ions et pH — l'essentiel

**À retenir**
- Un **ion** est un atome (ou groupe) chargé : **cation** (charge +, a perdu des électrons) ou **anion** (charge −, en a gagné).
- Le **pH** mesure l'acidité d'une solution, de 0 à 14.
- **pH < 7 → acide**, **pH = 7 → neutre**, **pH > 7 → basique**.

**Méthode : lire un pH**
- Solution de pH 3 : acide (riche en ions H⁺). Solution de pH 9 : basique. Eau pure : pH 7, neutre.

**Exemple**
> Le jus de citron a un pH ≈ 2 (acide) ; l'eau savonneuse un pH ≈ 9 (basique).

**Erreur classique**
- Penser qu'un pH plus grand = plus acide. C'est l'inverse : plus le pH est **petit**, plus c'est acide.$md$),

    ('physique-chimie', '3e', 'L''énergie et ses conversions', $md$# L'énergie et ses conversions — l'essentiel

**À retenir**
- L'énergie existe sous plusieurs **formes** : cinétique (mouvement), électrique, thermique, chimique, lumineuse…
- L'énergie se **convertit** d'une forme à une autre mais **ne se crée ni ne se détruit** (conservation).
- L'énergie se mesure en **joules** (J).

**Méthode : décrire une chaîne énergétique**
- On indique les conversions : source → convertisseur → forme utile (+ pertes, souvent en chaleur).

**Exemple**
> Une lampe convertit l'énergie électrique en énergie lumineuse (+ chaleur perdue).

**Erreur classique**
- Croire que l'énergie « disparaît » : elle est convertie, souvent en chaleur non utilisable.$md$),

    ('physique-chimie', '3e', 'La gravitation', $md$# La gravitation — l'essentiel

**À retenir**
- La **gravitation** est l'attraction mutuelle entre deux corps ayant une masse ; elle augmente avec les masses et diminue avec la distance.
- Le **poids** P est la force d'attraction de la Terre sur un objet : **P = m × g**, avec g ≈ 10 N/kg sur Terre.
- La **masse** (en kg) ne change pas ; le **poids** (en newtons, N) dépend de l'astre.

**Méthode : calculer un poids**
- Pour m = 2 kg sur Terre : P = 2 × 10 = 20 N.

**Exemple**
> Un objet de 6 kg pèse 60 N sur Terre mais seulement ~10 N sur la Lune (g plus faible), à masse identique.

**Erreur classique**
- Confondre masse et poids : la masse (kg) reste la même partout, le poids (N) change selon l'astre.$md$),

    ('physique-chimie', '3e', 'Puissance et énergie électriques', $md$# Puissance et énergie électriques — l'essentiel

**À retenir**
- La **puissance** électrique se calcule par **P = U × I** (U en volts, I en ampères, P en **watts**, W).
- L'**énergie** consommée dépend du temps : **E = P × t** (P en watts, t en secondes, E en joules).
- Le compteur EDF facture en **kilowattheures** (kWh) : 1 kWh = énergie d'un appareil de 1 000 W pendant 1 h.

**Méthode : appliquer P = U × I**
- Appareil sous U = 230 V parcouru par I = 2 A : P = 230 × 2 = 460 W.

**Exemple**
> Un radiateur de 1 000 W allumé 2 h consomme E = 1 × 2 = 2 kWh.

**Erreur classique**
- Confondre **puissance** (débit d'énergie, en W) et **énergie** (quantité totale, en J ou kWh, qui dépend de la durée).$md$)
  ) AS v(slug, level, chapter, md)
  JOIN public.subjects s ON s.slug = v.slug
  JOIN public.chapters c
    ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
 WHERE l.chapter_id = c.id
   AND l.title = 'L''essentiel du cours'
   AND l.revision_sheet IS DISTINCT FROM v.md;
