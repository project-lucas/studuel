-- =============================================================================
-- Studuel — Migration 070 : fiches de révision Technologie collège (5e · 4e · 3e)
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
    ('technologie', '5e', 'Le fonctionnement d''un objet technique', $md$# Le fonctionnement d'un objet technique — l'essentiel

**À retenir**
- Un **objet technique** est créé par l'humain pour répondre à un **besoin** (se déplacer, communiquer…).
- Sa **fonction d'usage** dit à quoi il sert ; sa **fonction d'estime** dit ce qui plaît (couleur, forme).
- Il est fait de **composants** qui remplissent chacun une **fonction technique** précise.

**Vocabulaire**
- **Besoin** : ce qui manque à l'utilisateur. **Solution technique** : le moyen choisi pour y répondre.

**Exemple**
> Un vélo : fonction d'usage = se déplacer ; le pédalier transmet le mouvement, les freins arrêtent la roue.

**Erreur classique**
- Confondre fonction d'usage (à quoi ça sert) et fonction d'estime (ce qui plaît).$md$),

    ('technologie', '5e', 'Matériaux et familles', $md$# Matériaux et familles — l'essentiel

**À retenir**
- On classe les matériaux en **familles** : métaux, plastiques, céramiques/verres, matières organiques (bois, textile).
- Chaque matériau a des **propriétés** : dureté, souplesse, masse, résistance, conductivité.
- Le **choix d'un matériau** dépend de la fonction de l'objet et de son coût.

**Vocabulaire**
- **Recyclable** : qui peut être transformé pour resservir. **Renouvelable** : qui se reconstitue (bois).

**Exemple**
> Une bouteille en plastique (PET) est légère, transparente et recyclable ; on ne la fait pas en métal.

**Erreur classique**
- Croire que « plastique » est une seule matière : il en existe de nombreuses aux propriétés très différentes.$md$),

    ('technologie', '5e', 'Croquis et schémas', $md$# Croquis et schémas — l'essentiel

**À retenir**
- Un **croquis** est un dessin à main levée pour exprimer une idée rapidement.
- Un **schéma** utilise des **symboles normalisés** pour représenter le fonctionnement, pas l'apparence.
- Une **vue** (face, dessus, côté) montre un objet sous un angle précis.

**Méthode : lire un schéma**
1. Je repère la **légende** et les symboles.
2. Je suis les liaisons pour comprendre comment les éléments sont reliés.

**Exemple**
> Un schéma électrique montre une pile, un interrupteur et une lampe reliés par des traits, sans dessiner les vrais objets.

**Erreur classique**
- Vouloir « faire joli » sur un schéma : ce qui compte, c'est la clarté et les bons symboles.$md$),

    ('technologie', '5e', 'Habitat et ouvrages', $md$# Habitat et ouvrages — l'essentiel

**À retenir**
- Un **ouvrage** est une construction fixe : maison, pont, tunnel, barrage.
- Il doit résister aux **contraintes** : son propre poids, le vent, l'eau, les charges.
- La **structure** (murs, poutres, fondations) répartit les efforts jusqu'au sol.

**Vocabulaire**
- **Fondation** : partie enterrée qui supporte l'ouvrage. **Poutre** : élément horizontal qui porte une charge.

**Exemple**
> Un pont à poutres repose sur des piliers ; les triangles d'une charpente la rendent plus rigide.

**Erreur classique**
- Penser qu'un mur plus épais suffit toujours : la forme de la structure compte autant que la quantité de matière.$md$),

    ('technologie', '4e', 'Chaîne d''information et d''énergie', $md$# Chaîne d'information et d'énergie — l'essentiel

**À retenir**
- La **chaîne d'énergie** alimente, distribue, convertit et transmet l'énergie pour agir (bouger, chauffer).
- La **chaîne d'information** acquiert, traite et communique des données pour commander l'objet.
- Un **capteur** fournit l'information ; un **actionneur** produit l'action.

**Vocabulaire**
- **Acquérir** : capter une grandeur. **Traiter** : décider. **Communiquer** : transmettre l'ordre.

**Exemple**
> Portail automatique : le capteur détecte la voiture (info), le moteur ouvre le portail (énergie).

**Erreur classique**
- Mélanger capteur et actionneur : le capteur mesure, l'actionneur agit sur le monde.$md$),

    ('technologie', '4e', 'La programmation par blocs', $md$# La programmation par blocs — l'essentiel

**À retenir**
- Un **programme** est une suite d'instructions exécutées dans l'ordre.
- Les **blocs** s'assemblent : événements, boucles, conditions, variables.
- Une **boucle** répète des actions ; une **condition** (si… alors) choisit selon une situation.

**Méthode : construire un script**
1. Je choisis l'**événement** de départ (quand le drapeau est cliqué).
2. J'enchaîne les blocs d'action, puis j'ajoute boucles et conditions.

**Exemple**
> « Répéter 4 fois : avancer de 100, tourner de 90° » dessine un carré.

**Erreur classique**
- Oublier la condition d'arrêt d'une boucle « répéter indéfiniment » : le programme ne s'arrête jamais.$md$),

    ('technologie', '4e', 'Réseaux et internet', $md$# Réseaux et internet — l'essentiel

**À retenir**
- Un **réseau** relie des appareils pour échanger des données.
- Sur internet, l'information est découpée en **paquets** qui voyagent puis se réassemblent.
- Chaque appareil a une **adresse IP** ; les serveurs **DNS** traduisent les noms de sites en adresses.

**Vocabulaire**
- **Client** : demande une ressource. **Serveur** : la fournit. **Protocole** : les règles d'échange (HTTP).

**Exemple**
> Taper une adresse web : le DNS trouve le serveur, qui renvoie la page en paquets.

**Erreur classique**
- Croire qu'internet et le web sont pareils : le web (les sites) n'est qu'un service qui circule sur internet.$md$),

    ('technologie', '4e', 'Prototypage', $md$# Prototypage — l'essentiel

**À retenir**
- Un **prototype** est un premier modèle réel pour **tester** une solution avant la fabrication finale.
- Il permet de vérifier le fonctionnement, corriger les défauts et améliorer l'objet.
- Outils courants : **impression 3D**, carte programmable, maquette carton.

**Méthode : démarche de prototypage**
1. Je conçois et je fabrique une première version.
2. Je **teste**, je note les défauts, je modifie, puis je recommence (itération).

**Exemple**
> Un boîtier imprimé en 3D est testé : trop petit → on corrige le modèle et on réimprime.

**Erreur classique**
- Vouloir un prototype parfait du premier coup : le but est justement d'essayer et d'améliorer.$md$),

    ('technologie', '3e', 'Modélisation et simulation', $md$# Modélisation et simulation — l'essentiel

**À retenir**
- Un **modèle** est une représentation simplifiée d'un objet (dessin 3D, maquette numérique).
- La **simulation** fait « fonctionner » ce modèle sur ordinateur pour prévoir son comportement.
- Elle évite des essais réels coûteux et permet de **comparer des solutions**.

**Vocabulaire**
- **Modélisation 3D** : construire l'objet en volume dans un logiciel. **Contrainte** : effort subi par la matière.

**Exemple**
> Simuler la charge d'une étagère montre où elle plie avant même de la fabriquer.

**Erreur classique**
- Prendre la simulation pour la réalité : un modèle simplifie, il faut valider par un test réel.$md$),

    ('technologie', '3e', 'Objets connectés', $md$# Objets connectés — l'essentiel

**À retenir**
- Un **objet connecté** capte des données et les échange via un réseau (Wi-Fi, Bluetooth).
- Il associe **capteurs**, **traitement** (carte/microcontrôleur) et **communication**.
- Les données peuvent être envoyées vers une application ou le **cloud** pour être utilisées à distance.

**Vocabulaire**
- **IoT** (Internet des objets) : ensemble des objets connectés. **Cloud** : serveurs distants qui stockent/traitent.

**Exemple**
> Un thermostat connecté mesure la température et se règle depuis un smartphone.

**Erreur classique**
- Oublier la **sécurité** et la **vie privée** : un objet connecté transmet des données qu'il faut protéger.$md$),

    ('technologie', '3e', 'Algorithmes et programmation', $md$# Algorithmes et programmation — l'essentiel

**À retenir**
- Un **algorithme** est une suite finie d'étapes pour résoudre un problème.
- On y trouve des **variables**, des **conditions** (si… alors… sinon) et des **boucles**.
- Un **programme** traduit l'algorithme dans un langage compris par la machine.

**Méthode : écrire un algorithme**
1. Je décris les étapes dans l'ordre, en langage clair.
2. Je vérifie chaque cas (conditions), puis je le traduis en blocs ou en code.

**Exemple**
> « Si la température < 18 alors allumer le chauffage, sinon l'éteindre » est un algorithme conditionnel.

**Erreur classique**
- Confondre = (affecter une valeur à une variable) et == (tester une égalité) dans une condition.$md$),

    ('technologie', '3e', 'Projet : concevoir un objet', $md$# Projet : concevoir un objet — l'essentiel

**À retenir**
- Un projet suit une **démarche** : besoin → cahier des charges → recherche de solutions → prototype → tests.
- Le **cahier des charges** liste les **fonctions** attendues et les **contraintes** (taille, coût, sécurité).
- On travaille en **équipe** avec un **planning** et une répartition des tâches.

**Méthode : conduire le projet**
1. J'analyse le besoin et je rédige le cahier des charges.
2. Je propose des solutions, j'en choisis une, je prototype puis je teste et présente.

**Exemple**
> Concevoir un porte-téléphone : contraintes = stable, moins de 10 cm, imprimable en 3D.

**Erreur classique**
- Se lancer dans la fabrication sans cahier des charges : on oublie une contrainte et l'objet ne convient pas.$md$)
  ) AS v(slug, level, chapter, md)
  JOIN public.subjects s ON s.slug = v.slug
  JOIN public.chapters c
    ON c.subject_id = s.id AND c.level = v.level AND c.title = v.chapter
 WHERE l.chapter_id = c.id
   AND l.title = 'L''essentiel du cours'
   AND l.revision_sheet IS DISTINCT FROM v.md;
