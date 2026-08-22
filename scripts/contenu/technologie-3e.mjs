// Technologie — Troisième : LE PROGRAMME COMPLET (23 fiches).
//
// CE QUE REMPLACE CE MODULE. La 3e n'avait que QUATRE chapitres de technologie,
// hérités du tout premier jeu de données (migration 008, contenu rempli par la
// 119) : « Modélisation et simulation », « Objets connectés », « Algorithmes et
// programmation » et « Projet : concevoir un objet ». Quatre fiches pour un
// programme de cycle 4 qui en demande vingt-trois : rien sur l'évolution des
// objets techniques, rien sur les fonctions et les contraintes, rien sur la
// chaîne d'énergie ni la chaîne d'information, rien sur les matériaux, les
// procédés de fabrication, la sécurité, les réseaux, la gestion de projet ni le
// prototypage.
//
// LE VOCABULAIRE DE LA MAQUETTE. Elle écrit « OST » — Objet et Système
// Technique. Le sigle est repris tel quel dans les titres, parce que c'est celui
// que l'élève lit dans son cours et cherchera dans l'application ; il est
// développé dès la première fiche.
//
// LE DÉCOUPAGE. Les 8 chapitres de la maquette de référence, éclatés en leurs
// 23 fiches. Chaque fiche est un chapitre en base ; le CHAPITRE du programme est
// porté par `axe` (colonne `chapters.theme`).
//
// LES QUATRE FICHES HÉRITÉES PARTENT (voir `menage`). Toutes les quatre sont
// recouvertes par le nouveau découpage : « Algorithmes et programmation »
// devient le chapitre 5, « Modélisation et simulation » se répartit entre les
// chapitres 7 et 8, « Objets connectés » entre les chapitres 3 et 6, « Projet :
// concevoir un objet » devient le chapitre 7. Aucun des quatre titres n'est
// repris à l'identique : le ménage ne peut donc pas mordre sur les fiches neuves
// à un rejeu.
//
// ⚠️ AUCUN EXTRAIT SQL EXÉCUTABLE DANS LES COURS. Le chapitre 6 parle de bases
// de données : c'est exactement le piège de la 254 (NSI), où un `SELECT … FROM
// eleve;` cité dans un cours a fait échouer la migration sur « la relation eleve
// n'existe pas » lorsqu'un littéral s'est rompu au collage. Les tables y sont
// donc décrites en français, jamais en requêtes — et le code Python cité l'est
// en ligne, mots-clés en gras, sans point-virgule.
//
// ⚠️ Le slug `technologie` porte DEUX modules (`technologie.mjs` — les niveaux
// 5e et 4e de la 216 — et celui-ci = 296) : ne JAMAIS générer avec
// `--slugs technologie`. Toujours `--modules technologie-3e`.

export default {
  slug: 'technologie',
  nom: 'Technologie',

  titreMigration: 'TECHNOLOGIE 3e — LE PROGRAMME COMPLET (23 fiches)',

  motif: `CONSTAT : la Troisième n'avait que QUATRE chapitres de technologie, hérités
du premier jeu de données de l'app, pour un programme de cycle 4 qui en demande
vingt-trois. Un élève de 3e qui révisait l'évolution des objets techniques, les
fonctions et les contraintes, la chaîne d'énergie, la chaîne d'information, les
matériaux, les procédés de fabrication, les règles de sécurité, les réseaux
informatiques, la gestion de projet ou le prototypage ne trouvait RIEN. Cette
migration installe les 23 fiches, rangées sous leurs 8 chapitres, et retire les
4 fiches génériques que ce découpage recouvre.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) conditionne tout ce qui suit :
ce module range ses 23 fiches sous 8 chapitres, et l'INSERT écrit la colonne.
Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS parce qu'on ne peut pas
garantir que la 234 soit passée en production — sans cette reprise, la migration
échouerait sur "column chapters.theme does not exist", les 4 anciens chapitres
déjà supprimés et les 23 neufs pas encore posés : une matière vide.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters (pour cacher mind_map) et ne l'a rendu que colonne par colonne. Une
colonne ajoutée après elle n'hérite d'aucun droit — sans lui, l'app lirait
"permission denied" au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 4 chapitres hérités partent. Tous les quatre sont recouverts par le
nouveau découpage : "Algorithmes et programmation" devient le chapitre 5,
"Modélisation et simulation" se répartit entre les chapitres 7 et 8, "Objets
connectés" entre les chapitres 3 et 6, et "Projet : concevoir un objet" devient
le chapitre 7. Les garder ferait deux objets voisins à deux places différentes.
Aucun des quatre titres n'est repris à l'identique par une fiche neuve : le
ménage, qui tourne AVANT les insertions à chaque passage, ne peut donc pas
mordre sur le contenu neuf à un rejeu.
Le filtre level = '3e' est indispensable : "Algorithmes et programmation" et
"Objets connectés" sont aussi des titres de 5e et de 4e, et le ménage mordrait
sur les deux autres niveaux du collège — les seuls que la technologie possède.
L'ordre compte : la file "À revoir" d'abord (review_items.item_id n'a PAS de clé
étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL), puis les
chapitres, dont les leçons partent en cascade.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'technologie'
   AND c.level = '3e'
   AND c.title IN ('Modélisation et simulation',
                   'Objets connectés',
                   'Algorithmes et programmation',
                   'Projet : concevoir un objet');

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'technologie'
   AND c.level = '3e'
   AND c.title IN ('Modélisation et simulation',
                   'Objets connectés',
                   'Algorithmes et programmation',
                   'Projet : concevoir un objet');

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'technologie'
   AND c.level = '3e'
   AND c.title IN ('Modélisation et simulation',
                   'Objets connectés',
                   'Algorithmes et programmation',
                   'Projet : concevoir un objet');`,
    },
  ],

  blocs: [
    {
      niveaux: ['3e'],
      chapitres: [
        // ===================================================================
        // Chapitre 1 : L'évolution des OST
        // ===================================================================
        {
          titre: 'Les OST',
          axe: 'L’évolution des OST',
          lecon: {
            titre: 'Objets et systèmes techniques : de quoi parle-t-on ?',
            cours: `Un **OST** — **Objet et Système Technique** — est un objet **conçu et fabriqué par l’homme** pour **satisfaire un besoin**. Un vélo, un smartphone, un ascenseur, un feu tricolore en sont.

## Objet ou système ?
- Un **objet technique** répond à un besoin par lui-même : un tournevis, une chaise.
- Un **système technique** associe plusieurs objets qui travaillent ensemble, souvent avec de l’électronique et un programme : une alarme, un ascenseur, un portail automatisé.

## Le besoin
Tout OST naît d’un **besoin**. On l’exprime par trois questions :
- **À qui rend-il service ?** (l’utilisateur)
- **Sur quoi agit-il ?** (la matière d’œuvre)
- **Dans quel but ?** (la fonction d’usage)

Une lampe rend service à celui qui lit, agit sur la lumière de la pièce, dans le but d’éclairer.

## L’évolution dans le temps
Un OST n’est jamais figé : il évolue sous l’effet de
- **l’évolution des besoins** (se déplacer plus vite, plus proprement) ;
- **le progrès scientifique et technique** (nouveaux matériaux, électronique, informatique) ;
- **les contraintes économiques** (coût de fabrication, prix de vente) ;
- **les contraintes environnementales et réglementaires** (normes, recyclage, sécurité).

> Le vélo n’a pas changé de fonction en 150 ans — se déplacer — mais tout le reste a changé : matériaux, transmission, freins, éclairage, et maintenant l’assistance électrique.

## La famille et la lignée
- Une **famille** regroupe des objets qui remplissent la **même fonction d’usage** par des solutions différentes (bougie, lampe à huile, ampoule, LED).
- Une **lignée** suit un objet et ses **améliorations successives** au fil du temps.`,
          },
          questions: [
            ['Que signifie le sigle OST ?', ['Objet et Système Technique', 'Organisation Standard du Travail', 'Outil de Simulation Technique', 'Objet Sans Transformation'], 0, 'C’est le vocabulaire employé tout au long du programme.'],
            ['Qu’est-ce qui distingue un système technique d’un objet technique ?', ['Il associe plusieurs objets qui travaillent ensemble', 'Il est toujours plus grand', 'Il ne consomme pas d’énergie', 'Il n’a pas d’utilisateur'], 0, 'Un ascenseur ou une alarme sont des systèmes.'],
            ['À quelle question répond la fonction d’usage d’un objet ?', ['Dans quel but l’objet est-il utilisé ?', 'Combien coûte-t-il ?', 'De quel matériau est-il fait ?', 'Qui l’a inventé ?'], 0, 'Elle complète « à qui rend-il service » et « sur quoi agit-il ».'],
            ['Qu’est-ce qui fait évoluer un objet technique ?', ['Les besoins, le progrès technique, les contraintes économiques et environnementales', 'Uniquement la mode', 'Uniquement le prix des matériaux', 'Rien : un objet réussi ne change plus'], 0, 'Ces quatre moteurs jouent ensemble.'],
            ['Qu’est-ce qu’une famille d’objets techniques ?', ['Des objets qui remplissent la même fonction d’usage par des solutions différentes', 'Des objets fabriqués par la même entreprise', 'Des objets vendus au même prix', 'Des objets du même matériau'], 0, 'Bougie, lampe à huile, ampoule et LED forment une famille.'],
            ['Qu’est-ce qu’une lignée d’objets techniques ?', ['Un objet suivi dans ses améliorations successives au fil du temps', 'Une gamme de produits d’une marque', 'Une chaîne de fabrication', 'Un classement par prix'], 0, 'Elle raconte l’histoire d’un même objet.'],
            ['Qu’est-ce qu’un besoin, en technologie ?', ['Ce qui justifie l’existence de l’objet technique', 'Le prix maximal accepté par l’acheteur', 'La quantité d’énergie consommée', 'Le nombre de pièces de l’objet'], 0, 'Tout OST naît d’un besoin à satisfaire.'],
            ['Un objet technique existe indépendamment de tout besoin humain.', ['Vrai', 'Faux'], 1, 'Il est conçu et fabriqué précisément pour satisfaire un besoin.'],
          ],
        },
        {
          titre: 'La fonction technique et le principe technique',
          axe: 'L’évolution des OST',
          lecon: {
            titre: 'Ce que l’objet doit faire, et comment il le fait',
            cours: `Trois notions s’emboîtent, de la plus générale à la plus concrète.

## La fonction d’usage
C’est le **service rendu** à l’utilisateur : « éclairer une pièce », « percer un trou », « garder les aliments au froid ». Elle s’exprime par un **verbe à l’infinitif**.

## La fonction technique
C’est ce que l’objet doit **assurer en interne** pour remplir sa fonction d’usage. Un vélo doit : transmettre le mouvement, freiner, diriger, supporter le poids, éclairer. Chacune est une **fonction technique**.

## Le principe technique et la solution technique
- Le **principe technique** est le phénomène physique utilisé : le frottement pour freiner, l’électromagnétisme pour produire du courant.
- La **solution technique** est le composant concret retenu : un frein à patins, un frein à disque, un frein à rétropédalage.

> Une même fonction technique — freiner — se réalise par plusieurs solutions techniques, toutes fondées sur le même principe : le frottement.

## Le diagramme des fonctions
On représente ces relations par un tableau ou un arbre :
**fonction d’usage → fonctions techniques → solutions techniques**

C’est l’outil qui permet, en conception, de comparer plusieurs solutions pour une même fonction, et de choisir selon les contraintes (coût, poids, sécurité, entretien).

## Les critères et les niveaux
Chaque fonction se **mesure** : un critère (la distance de freinage) et un niveau (moins de 5 mètres à 20 km/h). C’est ce qui rend un cahier des charges vérifiable — sans critère chiffré, une exigence n’est qu’un vœu.`,
          },
          questions: [
            ['Qu’est-ce que la fonction d’usage d’un objet ?', ['Le service qu’il rend à l’utilisateur', 'Le phénomène physique qu’il exploite', 'Le composant qui le réalise', 'Son prix de revient'], 0, 'Elle s’exprime par un verbe à l’infinitif.'],
            ['Qu’est-ce qu’une fonction technique ?', ['Ce que l’objet doit assurer en interne pour remplir sa fonction d’usage', 'Le service rendu à l’utilisateur', 'Le matériau employé', 'Le mode d’emploi'], 0, 'Transmettre le mouvement, freiner, diriger, pour un vélo.'],
            ['Qu’est-ce qu’un principe technique ?', ['Le phénomène physique utilisé pour réaliser une fonction', 'Le composant concret retenu', 'Le service rendu', 'La norme à respecter'], 0, 'Le frottement pour freiner, l’électromagnétisme pour produire du courant.'],
            ['Qu’est-ce qu’une solution technique ?', ['Le composant concret retenu pour réaliser une fonction', 'Le besoin de l’utilisateur', 'Le phénomène physique exploité', 'La durée de vie de l’objet'], 0, 'Frein à patins ou frein à disque : deux solutions, un même principe.'],
            ['Combien de solutions techniques une même fonction peut-elle avoir ?', ['Plusieurs', 'Une seule', 'Aucune', 'Autant que d’utilisateurs'], 0, 'C’est ce qui rend la comparaison possible en conception.'],
            ['Qu’est-ce qui rend une exigence du cahier des charges vérifiable ?', ['Un critère mesurable et un niveau chiffré', 'Une description détaillée', 'Un dessin de l’objet', 'La signature du client'], 0, 'Sans niveau chiffré, une exigence n’est qu’un vœu.'],
            ['Comment représente-t-on le lien entre fonctions et solutions ?', ['Par un diagramme ou un arbre des fonctions', 'Par un graphique en camembert', 'Par un chronogramme', 'Par une carte du réseau'], 0, 'Fonction d’usage → fonctions techniques → solutions techniques.'],
            ['Une fonction d’usage et une fonction technique désignent la même chose.', ['Vrai', 'Faux'], 1, 'L’une regarde l’utilisateur, l’autre l’intérieur de l’objet.'],
          ],
        },
        {
          titre: 'Cycle de vie d’un OST',
          axe: 'L’évolution des OST',
          lecon: {
            titre: 'De l’extraction du minerai à la déchèterie',
            cours: `Le **cycle de vie** d’un objet technique décrit toutes les étapes de son existence, **de l’extraction des matières premières à sa fin de vie**.

## Les cinq étapes
1. **Extraction** des matières premières (minerai, pétrole, bois, sable).
2. **Fabrication** : transformation des matériaux, assemblage, emballage.
3. **Distribution** : transport et vente.
4. **Utilisation** : usage, consommation d’énergie, entretien, réparation.
5. **Fin de vie** : collecte, tri, **recyclage**, **valorisation énergétique** ou enfouissement.

## L’impact environnemental
Chaque étape consomme de l’**énergie**, de l’**eau** et des **ressources**, et produit des **déchets** et des **émissions**. L’**analyse du cycle de vie (ACV)** mesure ces impacts sur toute la chaîne, pour comparer deux objets sans se limiter à leur usage.

> Un sac réutilisable coûte plus cher à fabriquer qu’un sac plastique : il ne devient avantageux qu’après un certain nombre de réemplois. Le cycle de vie est le seul moyen de le savoir.

## L’économie circulaire
Le modèle **linéaire** — extraire, fabriquer, jeter — épuise les ressources. Le modèle **circulaire** cherche à refermer la boucle :
- **réduire** (écoconception, moins de matière, moins d’emballage) ;
- **réemployer** et **réparer** (indice de réparabilité, pièces détachées disponibles) ;
- **recycler** (le déchet redevient matière première).

## Les déchets d’équipements électriques
Les **DEEE** (téléphones, ordinateurs, électroménager) contiennent des métaux précieux et des substances dangereuses : ils ne vont **jamais** à la poubelle ordinaire, mais en déchèterie ou en point de collecte.

## L’obsolescence
Un objet peut cesser d’être utilisé sans être cassé : parce qu’une pièce n’existe plus, parce qu’un logiciel n’est plus mis à jour, ou par simple effet de mode. La loi impose désormais un **indice de réparabilité** sur plusieurs familles de produits.`,
          },
          questions: [
            ['Quelle est la première étape du cycle de vie d’un objet ?', ['L’extraction des matières premières', 'La fabrication', 'La distribution', 'L’utilisation'], 0, 'Le cycle commence bien avant l’usine.'],
            ['Que mesure une analyse du cycle de vie (ACV) ?', ['Les impacts environnementaux de l’objet à toutes ses étapes', 'Le prix de vente de l’objet', 'La durée de la garantie', 'Le nombre de pièces de l’objet'], 0, 'Elle permet de comparer deux objets sans se limiter à leur usage.'],
            ['Qu’est-ce que l’économie circulaire ?', ['Un modèle qui réduit, réemploie et recycle pour refermer la boucle', 'Un modèle qui produit toujours plus', 'Le commerce entre pays voisins', 'La vente d’objets d’occasion uniquement'], 0, 'Elle s’oppose au modèle linéaire extraire-fabriquer-jeter.'],
            ['Que désignent les DEEE ?', ['Les déchets d’équipements électriques et électroniques', 'Les déchets d’emballages en entreprise', 'Les données d’économie énergétique', 'Les documents d’étude environnementale'], 0, 'Ils se déposent en déchèterie ou en point de collecte.'],
            ['Quelle étape du cycle de vie consomme souvent le plus d’énergie pour un appareil électroménager ?', ['L’utilisation', 'La distribution', 'La fin de vie', 'L’emballage'], 0, 'D’où l’importance des étiquettes énergie.'],
            ['Qu’est-ce que la valorisation énergétique d’un déchet ?', ['Récupérer de l’énergie en le brûlant', 'Le revendre d’occasion', 'Le broyer pour en faire une matière première', 'L’enfouir sous terre'], 0, 'C’est une solution moins bonne que le recyclage, meilleure que l’enfouissement.'],
            ['Qu’est-ce que l’indice de réparabilité ?', ['Une note obligatoire indiquant si un produit est facile à réparer', 'Le nombre de réparations effectuées', 'La durée de la garantie légale', 'Le prix des pièces détachées'], 0, 'Il lutte contre l’obsolescence en informant l’acheteur.'],
            ['Un objet non cassé ne peut pas devenir inutilisable.', ['Vrai', 'Faux'], 1, 'L’obsolescence logicielle ou l’absence de pièces détachées suffit à le rendre inutilisable.'],
          ],
        },
        // ===================================================================
        // Chapitre 2 : L'OST, ses utilisateurs, son environnement, ses contraintes
        // ===================================================================
        {
          titre: 'OST et interacteurs extérieurs',
          axe: 'L’OST, ses utilisateurs, son environnement et ses contraintes',
          lecon: {
            titre: 'Tout ce qui entoure l’objet et agit sur lui',
            cours: `Un objet technique n’existe jamais seul : il est entouré d’**interacteurs** — les éléments de son environnement avec lesquels il est en relation.

## Qui sont les interacteurs ?
- L’**utilisateur** (celui qui s’en sert) ;
- la **matière d’œuvre** (ce sur quoi l’objet agit) ;
- l’**énergie** dont il a besoin ;
- le **milieu** : air, eau, température, poussière, vibrations ;
- les **normes** et les **règlements** ;
- les autres **objets** avec lesquels il communique ou se connecte ;
- le **budget** et l’**esthétique**.

## Le diagramme des interacteurs
On le trace en plaçant l’objet au centre et les interacteurs autour. Chaque **liaison** entre deux interacteurs qui passe par l’objet définit une **fonction** :
- la **fonction principale** relie **deux** interacteurs à travers l’objet — c’est la raison d’être de l’objet ;
- les **fonctions contraintes** relient l’objet à **un seul** interacteur — s’adapter au réseau électrique, résister à la pluie, respecter une norme.

## Un exemple : le lampadaire de rue
- Fonction principale : permettre au **piéton** de voir la **chaussée** la nuit.
- Fonctions contraintes : résister aux **intempéries**, s’alimenter sur le **réseau électrique**, respecter les **normes** d’éclairage, s’intégrer au **paysage urbain**, rester dans le **budget** de la commune.

> Un objet réussi n’est pas celui qui remplit sa fonction principale : c’est celui qui la remplit **sans manquer** une seule de ses fonctions contraintes.

## À quoi ça sert
Ce diagramme est la première étape d’un **cahier des charges** : chaque fonction identifiée devient une exigence à mesurer.`,
          },
          questions: [
            ['Qu’est-ce qu’un interacteur ?', ['Un élément de l’environnement en relation avec l’objet technique', 'Une pièce interne de l’objet', 'Un logiciel de conception', 'Un défaut de fabrication'], 0, 'Utilisateur, énergie, milieu, normes, budget en sont.'],
            ['Que relie une fonction principale dans un diagramme des interacteurs ?', ['Deux interacteurs à travers l’objet', 'L’objet à un seul interacteur', 'Deux objets entre eux', 'L’objet à son fabricant'], 0, 'C’est la raison d’être de l’objet.'],
            ['Que relie une fonction contrainte ?', ['L’objet à un seul interacteur', 'Deux interacteurs entre eux', 'Deux fonctions principales', 'L’utilisateur au fabricant'], 0, 'Résister à la pluie, respecter une norme, tenir dans un budget.'],
            ['Quelle est la fonction principale d’un lampadaire de rue ?', ['Permettre au piéton de voir la chaussée la nuit', 'Résister aux intempéries', 'Respecter le budget de la commune', 'S’intégrer au paysage urbain'], 0, 'Les trois autres propositions sont des fonctions contraintes.'],
            ['Où place-t-on l’objet dans un diagramme des interacteurs ?', ['Au centre, les interacteurs autour', 'En haut, les interacteurs en dessous', 'À gauche, comme point de départ', 'À l’extérieur du diagramme'], 0, 'Les liaisons partent de lui vers son environnement.'],
            ['À quoi sert le diagramme des interacteurs ?', ['À établir le cahier des charges de l’objet', 'À dessiner l’objet en trois dimensions', 'À calculer son prix de revient', 'À programmer son microcontrôleur'], 0, 'Chaque fonction identifiée devient une exigence à mesurer.'],
            ['Qu’appelle-t-on la matière d’œuvre d’un objet technique ?', ['Ce sur quoi l’objet agit', 'Le matériau dont il est fait', 'L’énergie qu’il consomme', 'L’outil qui l’a fabriqué'], 0, 'Pour un sèche-cheveux, ce sont les cheveux, pas le plastique du boîtier.'],
            ['Un objet qui remplit sa fonction principale remplit forcément son cahier des charges.', ['Vrai', 'Faux'], 1, 'Il doit aussi satisfaire toutes ses fonctions contraintes.'],
          ],
        },
        {
          titre: 'OST et contraintes',
          axe: 'L’OST, ses utilisateurs, son environnement et ses contraintes',
          lecon: {
            titre: 'Les limites dans lesquelles il faut concevoir',
            cours: `Une **contrainte** est une exigence imposée au concepteur : elle limite ses choix et doit être respectée.

## Les grandes familles de contraintes
- **Fonctionnelles** : ce que l’objet doit faire, et à quel niveau de performance.
- **Techniques** : matériaux disponibles, procédés de fabrication, dimensions, poids.
- **Économiques** : coût de fabrication, prix de vente, coût d’entretien.
- **Réglementaires et normatives** : lois, normes NF ou CE, sécurité électrique, âge minimal.
- **Environnementales** : recyclabilité, consommation d’énergie, matériaux dangereux interdits.
- **Ergonomiques** : confort, facilité d’usage, accessibilité aux personnes en situation de handicap.
- **Esthétiques** : forme, couleur, style, image de marque.
- **De sécurité** : ne présenter aucun danger pour l’utilisateur ni pour son entourage.

## Le cahier des charges fonctionnel
C’est le document qui **rassemble toutes ces exigences**. Chaque fonction y est décrite avec :
- un **critère** (ce qu’on mesure) ;
- un **niveau** (la valeur à atteindre) ;
- une **flexibilité** (la tolérance acceptée : F0 impératif, F1 peu négociable, F2 négociable).

> « Le casque doit être léger » n’est pas une exigence ; « masse inférieure à 300 g, tolérance ±20 g » en est une.

## Des contraintes qui s’opposent
Alléger un objet le rend souvent **moins résistant** ou **plus cher** ; le rendre plus sûr l’alourdit. Concevoir, c’est **arbitrer** entre des contraintes contradictoires — jamais toutes les satisfaire au maximum.

## Vérifier
Chaque exigence chiffrée sera **testée** en fin de projet : c’est le rôle des essais et de la validation (chapitre 8). Une contrainte non mesurable est une contrainte invérifiable.`,
          },
          questions: [
            ['Qu’est-ce qu’une contrainte, en technologie ?', ['Une exigence imposée au concepteur, qui limite ses choix', 'Un défaut de l’objet', 'Une panne en cours d’usage', 'Le prix de vente conseillé'], 0, 'Elle doit être respectée par la solution retenue.'],
            ['Quel document rassemble toutes les exigences d’un projet ?', ['Le cahier des charges fonctionnel', 'La notice d’utilisation', 'Le plan de fabrication', 'Le devis'], 0, 'Chaque fonction y porte un critère, un niveau et une flexibilité.'],
            ['Que doit comporter une exigence bien rédigée ?', ['Un critère mesurable et un niveau chiffré', 'Un adjectif qualificatif', 'Un dessin', 'Le nom du fabricant'], 0, '« Masse inférieure à 300 g » plutôt que « le plus léger possible ».'],
            ['À quelle famille appartient la contrainte « respecter la norme CE » ?', ['Aux contraintes réglementaires et normatives', 'Aux contraintes esthétiques', 'Aux contraintes ergonomiques', 'Aux contraintes économiques'], 0, 'Les normes s’imposent au concepteur.'],
            ['À quelle famille appartient la contrainte « être utilisable par une personne en fauteuil » ?', ['Aux contraintes ergonomiques', 'Aux contraintes économiques', 'Aux contraintes techniques', 'Aux contraintes esthétiques'], 0, 'L’accessibilité relève du confort et de l’usage.'],
            ['Que signifie la flexibilité d’une exigence ?', ['La tolérance acceptée sur le niveau à atteindre', 'La souplesse du matériau', 'La durée de la garantie', 'Le nombre de solutions possibles'], 0, 'F0 impératif, F1 peu négociable, F2 négociable.'],
            ['Pourquoi concevoir suppose-t-il d’arbitrer ?', ['Parce que certaines contraintes s’opposent entre elles', 'Parce que le client change d’avis', 'Parce que les normes évoluent chaque année', 'Parce que les matériaux manquent toujours'], 0, 'Alléger un objet le rend souvent moins résistant ou plus cher.'],
            ['Une contrainte peut être vérifiée même si elle n’est pas mesurable.', ['Vrai', 'Faux'], 1, 'Sans critère chiffré, aucun essai ne peut conclure.'],
          ],
        },
        {
          titre: 'Critères de choix d’un OST',
          axe: 'L’OST, ses utilisateurs, son environnement et ses contraintes',
          lecon: {
            titre: 'Comparer plusieurs solutions et justifier',
            cours: `Face à un besoin, plusieurs solutions techniques sont possibles. **Choisir** suppose de les comparer sur des **critères explicites**.

## Les critères de comparaison usuels
- **Performance** : l’objet fait-il ce qu’on attend, et à quel niveau ?
- **Coût** : prix d’achat, mais aussi coût d’usage (énergie, consommables) et d’entretien.
- **Fiabilité et durée de vie** : combien de temps sans panne ?
- **Impact environnemental** : matériaux, consommation, recyclabilité.
- **Ergonomie** : facilité et confort d’utilisation.
- **Encombrement et masse**.
- **Sécurité** et conformité aux normes.
- **Disponibilité** des pièces détachées et **réparabilité**.

## L’outil de décision : le tableau comparatif
On dresse un tableau **solutions en colonnes, critères en lignes**, on note chaque case, et on additionne. Quand certains critères comptent plus que d’autres, on leur donne un **coefficient** (une pondération) : c’est le tableau **multicritère pondéré**.

> Une comparaison sans pondération traite le prix et la sécurité comme équivalents. C’est le coefficient qui fait entrer les priorités du cahier des charges dans le calcul.

## Justifier un choix
Un choix ne se justifie pas par « c’est mieux », mais par la **confrontation au cahier des charges** : telle solution atteint le niveau exigé sur les critères impératifs (F0), les autres non.

## Le coût global
Le prix d’achat ne dit pas tout : une ampoule LED coûte plus cher qu’une ampoule à filament, mais consomme sept fois moins et dure vingt fois plus longtemps. Sur la durée de vie, elle est bien moins chère — c’est le **coût global** qui décide.`,
          },
          questions: [
            ['Quel outil sert à comparer plusieurs solutions techniques ?', ['Un tableau multicritère', 'Un diagramme des interacteurs', 'Un chronogramme', 'Un schéma de câblage'], 0, 'Solutions en colonnes, critères en lignes.'],
            ['À quoi sert la pondération dans un tableau comparatif ?', ['À donner plus de poids aux critères les plus importants', 'À augmenter le nombre de solutions', 'À réduire le nombre de critères', 'À calculer le prix de vente'], 0, 'Sans elle, prix et sécurité pèseraient autant.'],
            ['Qu’est-ce que le coût global d’un objet ?', ['Le prix d’achat plus les coûts d’usage et d’entretien', 'Le prix d’achat seul', 'Le coût de fabrication', 'Le coût de recyclage'], 0, 'Une LED chère à l’achat revient moins cher sur sa durée de vie.'],
            ['Comment justifie-t-on correctement un choix technique ?', ['En le confrontant aux exigences du cahier des charges', 'En invoquant le goût du concepteur', 'En choisissant la solution la moins chère', 'En prenant la solution la plus récente'], 0, 'Les critères impératifs (F0) départagent d’abord.'],
            ['Quel critère mesure le temps de fonctionnement sans panne ?', ['La fiabilité', 'L’ergonomie', 'L’encombrement', 'L’esthétique'], 0, 'Elle est souvent liée à la durée de vie annoncée.'],
            ['Pourquoi la réparabilité est-elle devenue un critère de choix ?', ['Parce qu’elle allonge la durée de vie et réduit les déchets', 'Parce qu’elle diminue le prix d’achat', 'Parce qu’elle accélère la fabrication', 'Parce qu’elle améliore l’esthétique'], 0, 'Un indice de réparabilité est désormais obligatoire sur plusieurs familles de produits.'],
            ['Quel critère relève de l’impact environnemental ?', ['La recyclabilité des matériaux', 'Le confort d’utilisation', 'La rapidité de fabrication', 'Le style du produit'], 0, 'Consommation d’énergie et matériaux employés en relèvent aussi.'],
            ['La solution la moins chère à l’achat est toujours la plus économique.', ['Vrai', 'Faux'], 1, 'Le coût global inclut l’énergie, les consommables et l’entretien.'],
          ],
        },
        // ===================================================================
        // Chapitre 3 : L'organisation interne et les échanges d'un OST
        // ===================================================================
        {
          titre: 'La chaîne d’énergie',
          axe: 'L’organisation interne et les échanges d’un OST',
          lecon: {
            titre: 'Alimenter, distribuer, convertir, transmettre',
            cours: `La **chaîne d’énergie** décrit le trajet de l’énergie dans un objet technique, depuis sa source jusqu’à l’action produite. Elle comporte **quatre fonctions**, dans cet ordre.

## Alimenter
Fournir l’énergie au système. Les **sources** : réseau électrique, pile, batterie, panneau solaire, carburant, air comprimé.

## Distribuer
Laisser passer l’énergie, ou l’interrompre, sur ordre de la partie commande. Les composants : **interrupteur**, **relais**, **transistor**, **variateur**, **distributeur pneumatique**.

## Convertir
Transformer l’énergie d’une forme en une autre — c’est le cœur de la chaîne. Les **actionneurs** : **moteur** (électrique → mécanique), **vérin** (pneumatique → mécanique), **résistance chauffante**, **lampe**, **haut-parleur**.

## Transmettre
Acheminer l’énergie mécanique jusqu’à l’endroit utile, en adaptant vitesse et effort. Les composants : **engrenages**, **poulies-courroie**, **chaîne**, **arbre**, **roue**, **réducteur**.

> Le résultat de la chaîne s’appelle l’**action** : la roue tourne, la porte s’ouvre, l’air se réchauffe.

## Un exemple complet : le portail automatique
- **Alimenter** : réseau 230 V
- **Distribuer** : relais commandé par la carte électronique
- **Convertir** : moteur électrique
- **Transmettre** : réducteur puis crémaillère
- **Action** : le vantail s’ouvre

## Le lien avec la chaîne d’information
La chaîne d’énergie **agit** ; la chaîne d’information **décide**. C’est la partie commande qui envoie l’ordre à la fonction « distribuer » : les deux chaînes se rejoignent exactement là.`,
          },
          questions: [
            ['Quelles sont les quatre fonctions de la chaîne d’énergie, dans l’ordre ?', ['Alimenter, distribuer, convertir, transmettre', 'Acquérir, traiter, communiquer, agir', 'Convertir, alimenter, transmettre, distribuer', 'Alimenter, convertir, distribuer, agir'], 0, 'Elle se termine par l’action produite.'],
            ['Quelle fonction assure un interrupteur ou un relais ?', ['Distribuer', 'Alimenter', 'Convertir', 'Transmettre'], 0, 'Ils laissent passer ou interrompent l’énergie.'],
            ['Quelle fonction assure un moteur électrique ?', ['Convertir', 'Alimenter', 'Distribuer', 'Transmettre'], 0, 'Il transforme l’énergie électrique en énergie mécanique.'],
            ['Comment appelle-t-on les composants qui convertissent l’énergie ?', ['Les actionneurs', 'Les capteurs', 'Les interfaces', 'Les protocoles'], 0, 'Moteur, vérin, lampe, résistance chauffante.'],
            ['Quelle fonction assurent des engrenages ou une courroie ?', ['Transmettre', 'Convertir', 'Alimenter', 'Distribuer'], 0, 'Ils acheminent l’énergie mécanique en adaptant vitesse et effort.'],
            ['Quelle source d’énergie assure la fonction « alimenter » d’un objet nomade ?', ['Une batterie', 'Un engrenage', 'Un relais', 'Un capteur'], 0, 'Pile, batterie ou panneau solaire selon les cas.'],
            ['Où les chaînes d’énergie et d’information se rejoignent-elles ?', ['À la fonction « distribuer », qui reçoit l’ordre de la partie commande', 'À la fonction « alimenter »', 'À la fonction « transmettre »', 'Elles ne se rejoignent jamais'], 0, 'La chaîne d’information décide, la chaîne d’énergie agit.'],
            ['Un vérin pneumatique appartient à la fonction « transmettre ».', ['Vrai', 'Faux'], 1, 'C’est un actionneur : il convertit l’énergie pneumatique en énergie mécanique.'],
          ],
        },
        {
          titre: 'Les mécanismes de transmission et de transformation de mouvements',
          axe: 'L’organisation interne et les échanges d’un OST',
          lecon: {
            titre: 'Changer la vitesse, l’effort ou la nature du mouvement',
            cours: `Deux familles de mécanismes à ne jamais confondre.

## Transmettre : le mouvement garde sa nature
Le mouvement d’entrée et de sortie sont de **même nature** (le plus souvent des rotations). On modifie la **vitesse** et l’**effort**.

- **Engrenages** : deux roues dentées. Elles tournent en **sens inverse** (sauf avec une roue intermédiaire, ou en engrenage intérieur).
- **Poulies et courroie** : transmission **silencieuse**, sur une plus grande distance, avec risque de glissement. Même sens de rotation avec une courroie droite, sens inverse avec une courroie croisée.
- **Pignons et chaîne** : pas de glissement, même sens de rotation — c’est la transmission du vélo.
- **Roues de friction** : simples, mais elles patinent.

## Le rapport de transmission
**r = vitesse de sortie ÷ vitesse d’entrée = nombre de dents de l’entrée ÷ nombre de dents de la sortie**

- **r < 1** : c’est un **réducteur** — on perd de la vitesse, on gagne de la force.
- **r > 1** : c’est un **multiplicateur** — l’inverse.

> Un grand pignon entraîné par un petit fait tourner moins vite mais plus fort : c’est exactement ce que l’on cherche en montant une côte à vélo.

## Transformer : le mouvement change de nature
Le mouvement passe de **rotation à translation**, ou l’inverse.
- **Pignon-crémaillère** : rotation → translation (portail coulissant, direction de voiture).
- **Système vis-écrou** : rotation → translation lente et puissante (étau, presse).
- **Bielle-manivelle** : rotation ↔ translation alternative (moteur thermique, pompe).
- **Came et poussoir** : rotation → translation alternative (soupapes).

## Le vocabulaire du mouvement
Un mouvement de **rotation** tourne autour d’un axe ; un mouvement de **translation** se déplace en ligne droite ou selon une courbe, sans tourner sur lui-même.`,
          },
          questions: [
            ['Quelle différence y a-t-il entre transmettre et transformer un mouvement ?', ['Transmettre conserve la nature du mouvement, transformer la change', 'Transmettre change la nature, transformer conserve la vitesse', 'Ce sont deux mots pour la même chose', 'Transmettre concerne l’électricité, transformer la mécanique'], 0, 'Rotation vers rotation, ou rotation vers translation.'],
            ['Dans quel sens tournent deux roues dentées en contact ?', ['En sens inverse l’une de l’autre', 'Dans le même sens', 'Elles ne tournent pas', 'Cela dépend de leur diamètre'], 0, 'Sauf avec une roue intermédiaire ou un engrenage intérieur.'],
            ['Quel système de transmission n’a aucun risque de glissement ?', ['Pignons et chaîne', 'Poulies et courroie', 'Roues de friction', 'Courroie croisée'], 0, 'C’est la transmission du vélo.'],
            ['Comment calcule-t-on le rapport de transmission ?', ['Vitesse de sortie ÷ vitesse d’entrée', 'Vitesse d’entrée × vitesse de sortie', 'Nombre de dents de sortie × vitesse d’entrée', 'Diamètre de sortie + diamètre d’entrée'], 0, 'Il vaut aussi le nombre de dents de l’entrée divisé par celui de la sortie.'],
            ['Que fait un réducteur ?', ['Il diminue la vitesse et augmente la force', 'Il augmente la vitesse et diminue la force', 'Il inverse le sens du mouvement', 'Il transforme la rotation en translation'], 0, 'Son rapport de transmission est inférieur à 1.'],
            ['Quel système transforme une rotation en translation ?', ['Le pignon-crémaillère', 'Les poulies-courroie', 'Les pignons-chaîne', 'Les roues de friction'], 0, 'Le système vis-écrou et la bielle-manivelle aussi.'],
            ['Quel système équipe un moteur thermique pour transformer le mouvement des pistons ?', ['La bielle-manivelle', 'Le pignon-crémaillère', 'La vis sans fin', 'La courroie croisée'], 0, 'Il convertit la translation alternative en rotation.'],
            ['Une transmission par courroie ne peut jamais glisser.', ['Vrai', 'Faux'], 1, 'Le glissement est justement son principal inconvénient face à la chaîne.'],
          ],
        },
        {
          titre: 'Matériaux et procédés',
          axe: 'L’organisation interne et les échanges d’un OST',
          lecon: {
            titre: 'Choisir la matière selon ce qu’on lui demande',
            cours: `## Les grandes familles de matériaux
- **Métalliques** : acier, aluminium, cuivre, laiton. Résistants, conducteurs, recyclables, mais lourds et sensibles à la corrosion.
- **Organiques** : plastiques, bois, cuir, papier. Légers, faciles à mettre en forme ; les plastiques dérivent du pétrole et se recyclent mal.
- **Céramiques** : verre, porcelaine, béton. Très durs, résistants à la chaleur, mais **fragiles** (ils cassent sans se déformer).
- **Composites** : deux matériaux associés pour cumuler leurs qualités — fibre de carbone dans une résine, béton armé, contreplaqué.

## Les propriétés à connaître
- **Dureté** : résistance à la rayure.
- **Résistance mécanique** : capacité à supporter un effort sans rompre.
- **Élasticité** : capacité à reprendre sa forme après déformation.
- **Ductilité** : capacité à être étiré en fil.
- **Masse volumique** : masse par unité de volume — c’est elle qui décide de la légèreté.
- **Conductivité** électrique et thermique.
- **Résistance à la corrosion**, aux UV, à l’humidité.
- **Recyclabilité** et coût.

> On ne choisit pas « le meilleur matériau » : on choisit celui dont le **profil de propriétés** correspond aux contraintes du cahier des charges, au meilleur coût.

## Le lien matériau-procédé
Chaque famille impose ses procédés :
- les **thermoplastiques** se ramollissent à la chaleur : injection, extrusion, thermoformage, impression 3D ;
- les **métaux** : usinage, pliage, moulage, soudage, découpe laser ;
- le **bois** : sciage, ponçage, collage, assemblage.

## L’impact environnemental
Extraction, transport, transformation et fin de vie pèsent différemment selon les matériaux. L’aluminium coûte très cher à produire mais se recycle presque indéfiniment ; un plastique composite est léger mais quasi impossible à séparer pour le recyclage.`,
          },
          questions: [
            ['À quelle famille appartient le verre ?', ['Aux céramiques', 'Aux métalliques', 'Aux organiques', 'Aux composites'], 0, 'Dur, résistant à la chaleur, mais fragile.'],
            ['Qu’est-ce qu’un matériau composite ?', ['Un matériau associant deux matériaux pour cumuler leurs qualités', 'Un matériau recyclé', 'Un métal allié à un autre métal', 'Un plastique coloré'], 0, 'Fibre de carbone dans une résine, béton armé, contreplaqué.'],
            ['Que mesure la dureté d’un matériau ?', ['Sa résistance à la rayure', 'Sa capacité à revenir à sa forme initiale', 'Sa masse par unité de volume', 'Sa conductivité électrique'], 0, 'À ne pas confondre avec la résistance mécanique.'],
            ['Que signifie l’élasticité d’un matériau ?', ['Il reprend sa forme après déformation', 'Il se raye difficilement', 'Il conduit bien la chaleur', 'Il résiste à la corrosion'], 0, 'Au-delà d’une limite, la déformation devient permanente.'],
            ['Quelle propriété décide de la légèreté d’une pièce ?', ['La masse volumique du matériau', 'Sa dureté', 'Sa conductivité', 'Son élasticité'], 0, 'C’est la masse par unité de volume.'],
            ['Quel procédé convient à un thermoplastique ?', ['L’injection', 'Le soudage à l’arc', 'Le forgeage', 'Le sciage à la scie à métaux'], 0, 'Extrusion, thermoformage et impression 3D également.'],
            ['Quel avantage environnemental présente l’aluminium ?', ['Il se recycle presque indéfiniment', 'Il ne consomme pas d’énergie à produire', 'Il se dégrade naturellement', 'Il ne nécessite aucune extraction'], 0, 'Sa production initiale reste, elle, très énergivore.'],
            ['Il existe un matériau meilleur que tous les autres en toutes circonstances.', ['Vrai', 'Faux'], 1, 'On choisit selon le profil de propriétés exigé par le cahier des charges.'],
          ],
        },
        {
          titre: 'La chaîne d’information',
          axe: 'L’organisation interne et les échanges d’un OST',
          lecon: {
            titre: 'Acquérir, traiter, communiquer',
            cours: `La **chaîne d’information** est la partie « cerveau » d’un système technique. Elle comporte **trois fonctions**.

## Acquérir
Recueillir une information sur l’environnement ou sur le système lui-même. Les composants sont les **capteurs** :
- **capteur de position** ou **fin de course** ;
- **capteur de température**, de **lumière** (photorésistance), de **distance** (ultrason, infrarouge) ;
- **capteur de présence**, de pression, d’humidité ;
- le **bouton-poussoir** est le plus simple des capteurs — il capte l’action de l’utilisateur.

## Traiter
Décider quoi faire de l’information : c’est le rôle de la **partie commande** — **microcontrôleur**, carte programmable, automate — qui exécute un **programme**.

## Communiquer
Transmettre l’information à l’utilisateur ou à un autre système : **écran**, **LED**, **buzzer**, liaison **Wi-Fi**, **Bluetooth** ou radio.

> Capteur → microcontrôleur → actionneur : c’est le schéma de tout objet connecté, du portail automatique au thermostat.

## Le lien avec la chaîne d’énergie
La chaîne d’information **décide**, la chaîne d’énergie **agit**. L’ordre du microcontrôleur arrive à la fonction « distribuer » de la chaîne d’énergie, qui laisse alors passer le courant vers l’actionneur.

## Capteur et actionneur, à ne pas confondre
| | Capteur | Actionneur |
|---|---|---|
| Rôle | prendre une information | produire une action |
| Chaîne | information | énergie |
| Exemples | bouton, thermistance, ultrason | moteur, vérin, lampe, buzzer |

## Les objets connectés
Un objet connecté ajoute une fonction : envoyer ses données vers un serveur ou un téléphone, et recevoir des ordres à distance. Cela pose des questions de **sécurité** (piratage) et de **données personnelles**.`,
          },
          questions: [
            ['Quelles sont les trois fonctions de la chaîne d’information ?', ['Acquérir, traiter, communiquer', 'Alimenter, distribuer, convertir', 'Capter, convertir, agir', 'Mesurer, calculer, imprimer'], 0, 'Capteurs, partie commande, moyens de communication.'],
            ['À quelle fonction correspond un capteur ?', ['Acquérir', 'Traiter', 'Communiquer', 'Convertir'], 0, 'Il recueille une information sur l’environnement ou le système.'],
            ['Quel composant assure la fonction « traiter » ?', ['Le microcontrôleur', 'Le capteur de température', 'Le moteur', 'La LED'], 0, 'Il exécute le programme et prend les décisions.'],
            ['Quelle est la différence entre un capteur et un actionneur ?', ['Le capteur prend une information, l’actionneur produit une action', 'Le capteur produit une action, l’actionneur mesure', 'Ils appartiennent tous deux à la chaîne d’énergie', 'Ils font la même chose'], 0, 'L’un est dans la chaîne d’information, l’autre dans la chaîne d’énergie.'],
            ['À quelle fonction appartient un écran d’affichage ?', ['Communiquer', 'Acquérir', 'Traiter', 'Transmettre'], 0, 'Il transmet l’information à l’utilisateur.'],
            ['Quel capteur mesure une distance sans contact ?', ['Le capteur à ultrasons', 'Le bouton-poussoir', 'Le capteur de température', 'Le fin de course'], 0, 'Il mesure le temps de retour de l’écho.'],
            ['Que doit garantir un objet connecté au-delà de sa fonction ?', ['La sécurité des données personnelles qu’il transmet', 'Une durée de vie illimitée', 'L’absence de programme interne', 'Une consommation nulle'], 0, 'Un objet connecté mal protégé est une porte d’entrée pour le piratage.'],
            ['Un bouton-poussoir est un actionneur.', ['Vrai', 'Faux'], 1, 'C’est le plus simple des capteurs : il capte l’action de l’utilisateur.'],
          ],
        },
        // ===================================================================
        // Chapitre 4 : Fabrication / réalisation d'un objet technique
        // ===================================================================
        {
          titre: 'Procédés de fabrication',
          axe: 'Fabrication/réalisation d’un objet technique',
          lecon: {
            titre: 'Enlever, déformer, ajouter, assembler',
            cours: `Fabriquer une pièce, c’est lui donner sa forme définitive. Les procédés se rangent en **quatre familles**.

## Par enlèvement de matière
On part d’un bloc et on retire ce qui est en trop : **sciage**, **perçage**, **fraisage**, **tournage**, **découpe laser**, **découpe jet d’eau**.
- Précis, adapté à toutes les matières.
- Produit des **copeaux** : de la matière perdue.

## Par déformation
La matière change de forme sans être retirée : **pliage**, **emboutissage**, **forgeage**, **extrusion**, **thermoformage**.
- Aucune perte de matière, rapide en série.
- Nécessite un outillage coûteux.

## Par ajout de matière
On dépose la matière couche par couche : c’est l’**impression 3D** (fabrication additive).
- Idéale pour le **prototype** et les formes complexes.
- Lente pour la grande série.

## Par assemblage
On réunit plusieurs pièces :
- **démontable** : vis, boulon, clips — on peut réparer et recycler ;
- **non démontable** : soudure, rivet, collage — plus résistant, mais définitif.

## Les machines à commande numérique
Une **MOCN** (machine-outil à commande numérique) exécute un programme issu du dessin numérique : elle garantit la **répétabilité** — mille pièces identiques — et la précision.

## Choisir un procédé
Le choix dépend du **matériau**, de la **forme**, de la **précision** exigée, de la **quantité** à produire et du **coût**. L’impression 3D convient à une pièce unique ; l’injection plastique à cent mille.

> Un prototype et une série n’appellent presque jamais le même procédé : c’est la quantité qui décide.`,
          },
          questions: [
            ['À quelle famille appartient le perçage ?', ['À l’enlèvement de matière', 'À la déformation', 'À l’ajout de matière', 'À l’assemblage'], 0, 'Il produit des copeaux : de la matière est perdue.'],
            ['À quelle famille appartient le pliage ?', ['À la déformation', 'À l’enlèvement de matière', 'À l’ajout de matière', 'À l’assemblage'], 0, 'La matière change de forme sans être retirée.'],
            ['Comment appelle-t-on la fabrication par ajout de matière ?', ['L’impression 3D, ou fabrication additive', 'Le fraisage', 'L’emboutissage', 'Le rivetage'], 0, 'La matière est déposée couche par couche.'],
            ['Quel assemblage permet de réparer et de recycler l’objet ?', ['Un assemblage démontable par vis ou clips', 'Une soudure', 'Un rivetage', 'Un collage'], 0, 'Les assemblages non démontables sont définitifs.'],
            ['Que garantit une machine à commande numérique ?', ['La répétabilité et la précision des pièces produites', 'L’absence totale de déchets', 'Un coût nul', 'Une fabrication sans programme'], 0, 'Elle exécute un programme issu du dessin numérique.'],
            ['Quel procédé convient le mieux à une pièce unique de forme complexe ?', ['L’impression 3D', 'L’injection plastique', 'L’emboutissage', 'Le moulage en série'], 0, 'Les procédés de série exigent un outillage coûteux.'],
            ['Quel critère décide principalement du choix d’un procédé ?', ['La quantité de pièces à produire', 'La couleur souhaitée', 'Le nom du fabricant', 'La date de livraison seule'], 0, 'Matériau, forme, précision et coût interviennent également.'],
            ['La fabrication par déformation produit beaucoup de copeaux.', ['Vrai', 'Faux'], 1, 'C’est l’enlèvement de matière qui en produit ; la déformation n’en perd pas.'],
          ],
        },
        {
          titre: 'Règles de sécurité',
          axe: 'Fabrication/réalisation d’un objet technique',
          lecon: {
            titre: 'Travailler en atelier sans se blesser',
            cours: `Un atelier de technologie contient des machines, des outils tranchants et de l’électricité : la sécurité y est une **règle**, pas une recommandation.

## Les équipements de protection individuelle (EPI)
- **Lunettes** de protection : perçage, sciage, meulage, tout ce qui projette.
- **Gants** : manipulation de pièces coupantes ou chaudes — mais **jamais** près d’une pièce en rotation, où ils peuvent être happés.
- **Blouse** ou vêtements ajustés, **cheveux attachés**, aucun **bijou** ni écharpe pendante.
- **Chaussures fermées**.
- **Protection auditive** en cas de bruit prolongé.

## Les règles de conduite
1. Ne jamais utiliser une machine **sans autorisation** ni sans avoir reçu la consigne.
2. Vérifier que les **carters** et protections sont en place avant de démarrer.
3. **Un opérateur à la fois** sur une machine ; ne jamais distraire celui qui travaille.
4. Machine **à l’arrêt complet** avant tout réglage, changement d’outil ou nettoyage.
5. Ranger l’outil après usage, garder le poste **dégagé** et propre.
6. Signaler immédiatement toute **anomalie**, tout câble abîmé, tout incident.

## Les pictogrammes
- **Triangle jaune** : danger (risque électrique, laser, matière chaude).
- **Rond bleu** : obligation (port des lunettes, des gants).
- **Rond rouge barré** : interdiction.
- **Carré vert** : information de secours (issue, trousse de premiers soins).

## Le bouton d’arrêt d’urgence
Rouge sur fond jaune, il coupe l’alimentation immédiatement. Chacun doit savoir **où il se trouve avant** de démarrer la machine — le chercher pendant l’incident est déjà trop tard.

> La règle la plus enfreinte est aussi la plus simple : ne jamais régler une machine qui tourne encore. La grande majorité des accidents d’atelier vient de là.`,
          },
          questions: [
            ['Quand porte-t-on des lunettes de protection ?', ['Dès qu’une opération peut projeter des éclats', 'Uniquement lors des soudures', 'Seulement si la machine est bruyante', 'Uniquement en cas de produits chimiques'], 0, 'Perçage, sciage et meulage projettent des particules.'],
            ['Pourquoi ne porte-t-on pas de gants près d’une pièce en rotation ?', ['Parce qu’ils peuvent être happés par la pièce', 'Parce qu’ils réduisent la précision', 'Parce qu’ils s’usent trop vite', 'Parce qu’ils isolent du courant'], 0, 'Le gant entraîne alors la main avec lui.'],
            ['Que faut-il vérifier avant de démarrer une machine ?', ['Que les carters et protections sont en place', 'Que la salle est vide', 'Que la pièce est peinte', 'Que le programme est enregistré'], 0, 'Et savoir où se trouve l’arrêt d’urgence.'],
            ['Quand peut-on régler ou nettoyer une machine ?', ['Uniquement à l’arrêt complet', 'Pendant qu’elle tourne au ralenti', 'Dès que l’enseignant est présent', 'À tout moment avec des gants'], 0, 'C’est la règle la plus enfreinte et la principale cause d’accidents.'],
            ['Que signifie un pictogramme en triangle jaune ?', ['Un danger', 'Une obligation', 'Une interdiction', 'Une information de secours'], 0, 'Le rond bleu signale une obligation, le rond rouge barré une interdiction.'],
            ['Que signifie un pictogramme rond bleu ?', ['Une obligation, comme le port des lunettes', 'Un danger électrique', 'Une interdiction', 'Une issue de secours'], 0, 'Le bleu impose un comportement ou un équipement.'],
            ['Que doit-on savoir avant de démarrer une machine ?', ['Où se trouve le bouton d’arrêt d’urgence', 'Le prix de la machine', 'Le nom du fabricant', 'La durée totale de l’opération'], 0, 'Le chercher pendant l’incident est déjà trop tard.'],
            ['Deux élèves peuvent travailler simultanément sur la même machine.', ['Vrai', 'Faux'], 1, 'Un seul opérateur à la fois, et sans être distrait.'],
          ],
        },
        // ===================================================================
        // Chapitre 5 : Programmes
        // ===================================================================
        {
          titre: 'Bases de la programmation',
          axe: 'Programmes',
          lecon: {
            titre: 'Séquence, condition, boucle, variable',
            cours: `Un **algorithme** est une suite d’instructions permettant d’obtenir un résultat. Un **programme** en est la traduction dans un langage compris par la machine.

## Les quatre structures fondamentales
**1. La séquence** — les instructions s’exécutent **l’une après l’autre**, dans l’ordre écrit.

**2. La condition** (structure conditionnelle) — on exécute un bloc **seulement si** un test est vrai :
**si** température > 25 **alors** allumer le ventilateur **sinon** l’éteindre

**3. La boucle** (structure itérative) — on répète des instructions :
- **boucle bornée** : répéter 10 fois — on connaît le nombre de tours d’avance ;
- **boucle non bornée** : tant que le bouton n’est pas appuyé — on répète jusqu’à ce qu’une condition change.

**4. La variable** — une case mémoire nommée qui **stocke** une valeur susceptible de changer : un compteur, une mesure, un score.

## Les opérateurs
- **Comparaison** : =, <, >, ≤, ≥, ≠
- **Logiques** : **et**, **ou**, **non** — « si porte fermée **et** code correct ».
- **Arithmétiques** : +, −, ×, ÷, reste de la division.

## Les entrées et les sorties
Un programme d’objet technique **lit des capteurs** (entrées) et **commande des actionneurs** (sorties). C’est le lien direct avec la chaîne d’information.

> Une boucle « tant que » dont la condition ne devient jamais fausse ne s’arrête jamais : c’est la **boucle infinie**, l’erreur la plus fréquente du débutant.

## Représenter un algorithme
- L’**organigramme** : des losanges pour les tests, des rectangles pour les actions, des flèches pour l’enchaînement.
- Le **pseudo-code** : le texte en français, structuré et indenté.

Les deux se traduisent ensuite dans n’importe quel langage.`,
          },
          questions: [
            ['Qu’est-ce qu’un algorithme ?', ['Une suite d’instructions permettant d’obtenir un résultat', 'Un langage de programmation', 'Un composant électronique', 'Un logiciel de dessin'], 0, 'Le programme en est la traduction pour la machine.'],
            ['Quelle structure permet d’exécuter des instructions seulement dans certains cas ?', ['La condition', 'La séquence', 'La boucle bornée', 'La variable'], 0, 'Elle repose sur un test vrai ou faux.'],
            ['Qu’est-ce qu’une boucle bornée ?', ['Une répétition dont on connaît le nombre de tours d’avance', 'Une répétition sans fin', 'Une répétition qui dépend d’un capteur', 'Une instruction unique'], 0, '« Répéter 10 fois » en est une.'],
            ['À quoi sert une variable ?', ['À stocker une valeur susceptible de changer', 'À répéter des instructions', 'À comparer deux nombres', 'À commander un moteur'], 0, 'Compteur, mesure, score : elle porte un nom et une valeur.'],
            ['Que fait l’opérateur logique « et » ?', ['Il exige que les deux conditions soient vraies', 'Il exige qu’au moins une condition soit vraie', 'Il inverse une condition', 'Il additionne deux nombres'], 0, '« si porte fermée et code correct ».'],
            ['Qu’est-ce qu’une boucle infinie ?', ['Une boucle dont la condition d’arrêt n’est jamais atteinte', 'Une boucle qui s’exécute une seule fois', 'Une boucle qui contient une condition', 'Une boucle correctement bornée'], 0, 'C’est l’erreur la plus fréquente du débutant.'],
            ['Comment appelle-t-on la représentation graphique d’un algorithme ?', ['Un organigramme', 'Un tableau comparatif', 'Un diagramme des interacteurs', 'Un schéma cinématique'], 0, 'Losanges pour les tests, rectangles pour les actions.'],
            ['Un algorithme dépend du langage de programmation utilisé.', ['Vrai', 'Faux'], 1, 'Il se traduit ensuite dans n’importe quel langage : c’est la logique qui compte.'],
          ],
        },
        {
          titre: 'Programmation graphique et programmation textuelle',
          axe: 'Programmes',
          lecon: {
            titre: 'Des blocs à assembler, ou des lignes à écrire',
            cours: `Deux façons d’écrire un programme, pour la même logique.

## La programmation graphique (par blocs)
On assemble des **briques** colorées qui s’emboîtent : Scratch, mBlock, Blockly, Snap!.
- **Avantages** : aucune faute de syntaxe possible (les blocs incompatibles ne s’emboîtent pas), lecture immédiate de la structure, prise en main rapide.
- **Limites** : peu adaptée aux programmes longs, dépendante d’un environnement particulier, difficile à partager sous forme de texte.

## La programmation textuelle
On écrit des **lignes de code** : Python, JavaScript, C, C++ (Arduino).
- **Avantages** : plus rapide à écrire pour qui la maîtrise, sans limite de taille, facile à copier, versionner et partager.
- **Limites** : la **syntaxe** est stricte — une majuscule, un deux-points ou une indentation oubliés suffisent à empêcher l’exécution.

## La même logique dans les deux mondes
Une condition en blocs (« si … alors … sinon … ») devient en Python :
**if** temperature > 25 **:** puis, en dessous et **indenté**, l’instruction à exécuter, puis **else :** et son instruction.

> Passer des blocs au texte ne change **rien** à l’algorithme : séquence, condition, boucle et variable sont les mêmes. Seule l’écriture change.

## En Python, deux règles à retenir
- Le **deux-points** termine la ligne qui ouvre un bloc (condition, boucle, fonction).
- L’**indentation** (le décalage) indique ce qui appartient au bloc : elle n’est pas décorative, elle fait partie du langage.

## Quel usage au collège ?
Le programme du cycle 4 demande de savoir lire et modifier les deux. On commence par les blocs pour la logique, on passe au texte pour piloter une carte programmable ou traiter des données.`,
          },
          questions: [
            ['Quel est l’avantage principal de la programmation par blocs ?', ['Aucune faute de syntaxe n’est possible', 'Elle s’exécute plus vite', 'Elle permet des programmes plus longs', 'Elle est plus facile à partager par texte'], 0, 'Les blocs incompatibles ne s’emboîtent tout simplement pas.'],
            ['Quel logiciel relève de la programmation graphique ?', ['Scratch', 'Python', 'C++', 'JavaScript'], 0, 'mBlock et Blockly également.'],
            ['Quelle est la principale difficulté de la programmation textuelle ?', ['La syntaxe, très stricte', 'L’impossibilité de faire des boucles', 'L’absence de variables', 'La lenteur d’exécution'], 0, 'Un deux-points ou une indentation oubliés bloquent l’exécution.'],
            ['En Python, que signale l’indentation ?', ['Ce qui appartient au bloc en cours', 'La fin du programme', 'Un commentaire', 'Une erreur de frappe'], 0, 'Elle fait partie du langage, ce n’est pas une mise en forme.'],
            ['Que change le passage des blocs au texte pour l’algorithme ?', ['Rien : séquence, condition, boucle et variable sont les mêmes', 'Tout : la logique doit être repensée', 'Les variables disparaissent', 'Les boucles deviennent impossibles'], 0, 'Seule l’écriture change.'],
            ['Quel caractère termine en Python la ligne qui ouvre un bloc ?', ['Le deux-points', 'Le point-virgule', 'L’accolade', 'La parenthèse'], 0, 'Il annonce le bloc indenté qui suit.'],
            ['Quel avantage la programmation textuelle offre-t-elle pour le travail en équipe ?', ['Le code se copie, se compare et se partage facilement', 'Elle se lit sans aucune formation', 'Elle interdit toute erreur', 'Elle ne nécessite pas d’ordinateur'], 0, 'Un fichier texte se versionne, pas un assemblage de blocs.'],
            ['Un programme écrit en blocs ne peut pas piloter une carte programmable.', ['Vrai', 'Faux'], 1, 'mBlock et les environnements dérivés pilotent très bien une carte.'],
          ],
        },
        {
          titre: 'Écrire mettre au point et exécuter un programme simple',
          axe: 'Programmes',
          lecon: {
            titre: 'Du besoin au programme qui marche',
            cours: `Écrire un programme qui fonctionne, c’est suivre une **démarche**, pas écrire du premier coup.

## Les cinq étapes
1. **Analyser le besoin** : que doit faire le système ? Quelles entrées (capteurs), quelles sorties (actionneurs) ?
2. **Écrire l’algorithme** en pseudo-code ou en organigramme, **avant** de toucher au clavier.
3. **Traduire** en programme, dans le langage choisi.
4. **Tester** : exécuter, comparer le comportement obtenu au comportement attendu.
5. **Corriger** — c’est le **débogage** — puis retester, jusqu’à conformité.

## Les types d’erreurs
- **Erreur de syntaxe** : le programme ne démarre pas ; le message d’erreur indique la ligne fautive. C’est la plus facile à corriger.
- **Erreur de logique** : le programme s’exécute mais fait **autre chose** que prévu. Aucun message : c’est la plus difficile.
- **Erreur d’exécution** : le programme s’arrête en cours de route (division par zéro, capteur absent).

## Les techniques de mise au point
- **Tester par morceaux** : valider une fonction à la fois plutôt que tout le programme.
- **Afficher les valeurs** intermédiaires des variables pour voir où le comportement dévie.
- **Exécuter pas à pas**, en mode débogage.
- **Jeux d’essai** : préparer des cas de test — un cas normal, un cas limite, un cas interdit.

> Un programme qui « marche une fois » n’est pas validé. Ce sont les **cas limites** — la valeur nulle, la valeur maximale, l’entrée absurde — qui révèlent les défauts.

## Documenter
Des **commentaires** dans le code, des **noms de variables explicites** (**vitesse** plutôt que **v2**) et un court mode d’emploi : c’est ce qui rend le programme modifiable par un autre — ou par soi-même trois mois plus tard.`,
          },
          questions: [
            ['Que faut-il faire avant d’écrire le programme ?', ['Analyser le besoin et écrire l’algorithme', 'Choisir la couleur de l’interface', 'Acheter la carte programmable', 'Tester le programme'], 0, 'L’algorithme se pense avant de toucher au clavier.'],
            ['Comment appelle-t-on la recherche et la correction des erreurs ?', ['Le débogage', 'La compilation', 'L’exécution', 'La documentation'], 0, 'Elle alterne avec les tests jusqu’à conformité.'],
            ['Quelle erreur empêche le programme de démarrer ?', ['L’erreur de syntaxe', 'L’erreur de logique', 'L’erreur d’ergonomie', 'L’erreur de câblage'], 0, 'Le message d’erreur indique généralement la ligne fautive.'],
            ['Quelle erreur est la plus difficile à détecter ?', ['L’erreur de logique', 'L’erreur de syntaxe', 'L’erreur d’orthographe dans un commentaire', 'L’erreur de nom de fichier'], 0, 'Le programme s’exécute sans message, mais fait autre chose que prévu.'],
            ['Qu’est-ce qu’un jeu d’essai ?', ['Un ensemble de cas de test préparés à l’avance', 'Une partie du programme non utilisée', 'Un jeu vidéo de démonstration', 'Une simulation graphique'], 0, 'Un cas normal, un cas limite, un cas interdit.'],
            ['Pourquoi tester les cas limites ?', ['Parce que ce sont eux qui révèlent les défauts', 'Parce qu’ils sont plus rapides à exécuter', 'Parce qu’ils sont exigés par la norme', 'Parce qu’ils simplifient le code'], 0, 'Un programme qui marche une fois n’est pas validé.'],
            ['Pourquoi commenter et nommer clairement ses variables ?', ['Pour rendre le programme modifiable par un autre, ou par soi plus tard', 'Pour accélérer l’exécution', 'Pour réduire la taille du fichier', 'Pour éviter les erreurs de syntaxe'], 0, 'Un nom explicite vaut mieux qu’un commentaire.'],
            ['Un programme sans message d’erreur fonctionne forcément correctement.', ['Vrai', 'Faux'], 1, 'Une erreur de logique s’exécute sans rien signaler.'],
          ],
        },
        // ===================================================================
        // Chapitre 6 : Information et données
        // ===================================================================
        {
          titre: 'Structuration et traitement des données',
          axe: 'Information et données',
          lecon: {
            titre: 'Organiser pour pouvoir chercher',
            cours: `Une **donnée** est une valeur brute (18, « Dupont », 21/08/2026). Une **information** est une donnée **interprétée** dans un contexte : « la température du local est de 18 °C ».

## Structurer les données
Des données en vrac sont inexploitables. On les organise en **tableaux** :
- chaque **ligne** est un **enregistrement** (un objet, une personne, une mesure) ;
- chaque **colonne** est un **champ** (nom, date, valeur, unité) ;
- un champ sert de **clé** : il identifie chaque ligne sans ambiguïté.

C’est le principe du **tableur** comme de la **base de données**.

## Les types de données
Nombre entier, nombre décimal, texte, booléen (vrai/faux), date. Le type détermine ce qu’on peut faire : on additionne des nombres, on trie des dates, on compare des textes.

## Traiter les données
- **Trier** : ranger selon un champ (par ordre croissant de température).
- **Filtrer** : ne garder que les lignes qui vérifient une condition (mesures supérieures à 25 °C).
- **Calculer** : somme, moyenne, minimum, maximum, écart.
- **Représenter** : courbe pour une évolution dans le temps, histogramme pour comparer, camembert pour des parts d’un tout.

> Le choix du graphique n’est pas décoratif : une courbe raconte une évolution, un camembert une répartition. Se tromper de graphique, c’est raconter autre chose que ce que disent les données.

## Les formats d’échange
- **CSV** : un tableau en texte, une ligne par enregistrement, des champs séparés par des virgules ou des points-virgules. Simple, lisible partout.
- **JSON** : des données structurées en couples nom-valeur, utilisé par les objets connectés et les sites web.

## La qualité des données
Une donnée mal saisie, une unité oubliée, une valeur aberrante faussent tout le traitement. Vérifier les valeurs extrêmes fait partie du travail.`,
          },
          questions: [
            ['Quelle différence y a-t-il entre une donnée et une information ?', ['L’information est une donnée interprétée dans un contexte', 'La donnée est toujours un texte', 'L’information est plus courte', 'Ce sont deux mots pour la même chose'], 0, '« 18 » est une donnée ; « 18 °C dans le local » est une information.'],
            ['Dans un tableau de données, que représente une ligne ?', ['Un enregistrement', 'Un champ', 'Une clé', 'Un type de données'], 0, 'Les colonnes, elles, sont les champs.'],
            ['À quoi sert une clé dans un tableau de données ?', ['À identifier chaque ligne sans ambiguïté', 'À trier les colonnes', 'À protéger le fichier', 'À convertir les unités'], 0, 'Deux enregistrements ne peuvent pas partager la même clé.'],
            ['Que fait un filtre sur un jeu de données ?', ['Il ne garde que les lignes vérifiant une condition', 'Il range les lignes par ordre croissant', 'Il calcule une moyenne', 'Il supprime les doublons automatiquement'], 0, 'Le tri, lui, range sans rien enlever.'],
            ['Quel graphique convient pour représenter une évolution dans le temps ?', ['Une courbe', 'Un camembert', 'Un tableau croisé', 'Un diagramme de Venn'], 0, 'Le camembert représente des parts d’un tout.'],
            ['Qu’est-ce qu’un fichier CSV ?', ['Un tableau en texte, avec des champs séparés par des virgules ou points-virgules', 'Une image compressée', 'Un programme exécutable', 'Un format de vidéo'], 0, 'Simple et lisible par tous les tableurs.'],
            ['Pourquoi vérifier les valeurs extrêmes d’un jeu de données ?', ['Parce qu’une valeur aberrante fausse tout le traitement', 'Parce qu’elles sont toujours fausses', 'Parce qu’elles ralentissent le calcul', 'Parce qu’elles doivent être supprimées systématiquement'], 0, 'Une unité oubliée ou une saisie erronée se repère souvent là.'],
            ['Le choix du type de graphique n’a aucune conséquence sur la lecture des données.', ['Vrai', 'Faux'], 1, 'Une courbe raconte une évolution, un camembert une répartition : se tromper change le message.'],
          ],
        },
        {
          titre: 'Système d’information et stockage de données',
          axe: 'Information et données',
          lecon: {
            titre: 'Où vivent les données, et qui y a droit',
            cours: `Un **système d’information** réunit tout ce qui permet de **collecter, stocker, traiter et diffuser** des données : matériel, logiciels, données, procédures et utilisateurs.

## Où sont stockées les données ?
- **Localement** : disque dur, SSD, carte mémoire, clé USB. Accessible sans réseau, mais fragile — une panne, un vol, un incendie et tout disparaît.
- **Sur un serveur** de l’établissement ou de l’entreprise, accessible par le réseau local.
- **Dans le nuage (cloud)** : sur les serveurs d’un prestataire, accessibles depuis n’importe où avec une connexion. Pratique, mais dépendant du réseau et du prestataire.

> « Le nuage » n’a rien d’immatériel : ce sont des **centres de données** bien réels, qui consomment électricité et eau de refroidissement.

## Les unités de capacité
1 octet = 8 bits ; 1 ko = 1 000 octets ; 1 Mo = 10⁶ octets ; 1 Go = 10⁹ octets ; 1 To = 10¹² octets.
Une photo : quelques Mo. Un film : quelques Go. Un disque : plusieurs To.

## La sauvegarde
La règle **3-2-1** : **3** copies des données, sur **2** supports différents, dont **1** hors du lieu principal. Une sauvegarde jamais testée n’est pas une sauvegarde.

## La sécurité
- **Mot de passe** long et unique, **authentification à deux facteurs**.
- **Chiffrement** des données sensibles : illisibles sans la clé.
- **Droits d’accès** : chaque utilisateur ne voit que ce qui le concerne.
- **Mises à jour** régulières contre les failles connues.

## Les données personnelles
Le **RGPD** encadre la collecte des données personnelles en Europe : consentement explicite, finalité déclarée, durée de conservation limitée, droit d’accès, de rectification et de **suppression**. Un objet connecté qui collecte des données y est soumis comme un site web.`,
          },
          questions: [
            ['Qu’est-ce qu’un système d’information ?', ['L’ensemble matériel, logiciel, données, procédures et utilisateurs qui traite l’information', 'Un ordinateur puissant', 'Un logiciel de base de données', 'Un réseau de câbles'], 0, 'Il collecte, stocke, traite et diffuse des données.'],
            ['Qu’est-ce que le stockage « dans le nuage » ?', ['Un stockage sur les serveurs d’un prestataire, accessible par Internet', 'Un stockage sans support physique', 'Un stockage sur une clé USB', 'Un stockage temporaire dans la mémoire vive'], 0, 'Ce sont des centres de données bien réels, gourmands en énergie.'],
            ['À combien d’octets correspond 1 Go ?', ['10⁹ octets', '10⁶ octets', '10³ octets', '10¹² octets'], 0, 'Un film pèse quelques Go, une photo quelques Mo.'],
            ['Que dit la règle de sauvegarde 3-2-1 ?', ['3 copies, sur 2 supports différents, dont 1 hors du lieu principal', '3 sauvegardes par jour pendant 2 semaines sur 1 disque', '3 mots de passe, 2 comptes, 1 administrateur', '3 To minimum, 2 disques, 1 serveur'], 0, 'Et une sauvegarde jamais testée n’est pas une sauvegarde.'],
            ['À quoi sert le chiffrement des données ?', ['À les rendre illisibles sans la clé', 'À les compresser', 'À les sauvegarder automatiquement', 'À accélérer leur transfert'], 0, 'C’est la protection de dernier recours en cas de vol.'],
            ['Que garantit le RGPD aux personnes ?', ['Un droit d’accès, de rectification et de suppression de leurs données', 'La gratuité des services en ligne', 'Un stockage illimité', 'L’anonymat total sur Internet'], 0, 'Il impose aussi consentement, finalité déclarée et durée limitée.'],
            ['Quel est l’inconvénient principal d’un stockage uniquement local ?', ['Une panne, un vol ou un incendie fait tout disparaître', 'Il nécessite une connexion permanente', 'Il est toujours plus lent', 'Il est interdit par le RGPD'], 0, 'D’où l’intérêt d’une copie hors du lieu principal.'],
            ['Les données stockées dans le nuage ne se trouvent sur aucun support physique.', ['Vrai', 'Faux'], 1, 'Elles sont sur les disques de centres de données bien réels.'],
          ],
        },
        {
          titre: 'La circulation de l’information dans un réseau informatique',
          axe: 'Information et données',
          lecon: {
            titre: 'Comment un message va d’une machine à l’autre',
            cours: `Un **réseau informatique** relie des machines pour qu’elles **échangent des données** et **partagent des ressources** (imprimante, fichiers, connexion).

## Les échelles de réseau
- **LAN** (réseau local) : une salle, un établissement, une maison.
- **WAN** (réseau étendu) : plusieurs sites, une région, un pays.
- **Internet** : le réseau mondial qui relie tous les autres.

## Les équipements
- **Switch** (commutateur) : relie les machines d’un même réseau local et **aiguille** les messages vers le bon destinataire.
- **Routeur** : relie **deux réseaux différents** et choisit le chemin d’un message vers sa destination.
- **Box** : elle réunit dans un seul boîtier un routeur, un switch, un modem et un point d’accès Wi-Fi.
- **Serveur** : une machine qui rend un service (fichiers, web, messagerie) ; le **client** est celui qui le demande.

## L’adressage
Chaque machine du réseau possède une **adresse IP** unique, qui l’identifie — comme une adresse postale. Le **DNS** traduit un nom lisible (un nom de site) en adresse IP : sans lui, il faudrait retenir des suites de chiffres.

## Les protocoles
Un **protocole** est un ensemble de règles que les machines respectent pour se comprendre : **HTTP** et **HTTPS** pour le web, **FTP** pour les fichiers, **SMTP** pour le courrier. Le **S** de HTTPS signifie que l’échange est **chiffré**.

## Le découpage en paquets
Un message n’est pas envoyé d’un bloc : il est découpé en **paquets** numérotés, qui peuvent emprunter des chemins différents et sont **réassemblés** à l’arrivée. Si un paquet manque, il est redemandé.

> C’est ce découpage qui rend Internet robuste : si un chemin est coupé, les paquets passent par un autre.

## Filaire ou sans fil
Le **câble Ethernet** est plus rapide, plus stable et plus sûr ; le **Wi-Fi** est plus pratique mais plus sensible aux obstacles et aux interceptions — d’où l’importance de son mot de passe.`,
          },
          questions: [
            ['Que désigne un LAN ?', ['Un réseau local, limité à un bâtiment ou un site', 'Le réseau mondial', 'Un réseau sans fil uniquement', 'Un protocole de sécurité'], 0, 'Le WAN relie, lui, plusieurs sites.'],
            ['Quel équipement relie deux réseaux différents ?', ['Le routeur', 'Le switch', 'Le serveur', 'La carte réseau'], 0, 'Le switch, lui, aiguille au sein d’un même réseau local.'],
            ['À quoi sert une adresse IP ?', ['À identifier une machine sur le réseau', 'À chiffrer les données', 'À mesurer le débit', 'À stocker les fichiers'], 0, 'Elle joue le rôle d’une adresse postale.'],
            ['Que fait le DNS ?', ['Il traduit un nom de site en adresse IP', 'Il chiffre les communications', 'Il découpe les messages en paquets', 'Il distribue les adresses IP locales'], 0, 'Sans lui, il faudrait retenir des suites de chiffres.'],
            ['Que signifie le S de HTTPS ?', ['L’échange est chiffré, donc sécurisé', 'Le site est un serveur', 'La connexion est plus rapide', 'Le site est officiel'], 0, 'Le contenu échangé devient illisible pour un intercepteur.'],
            ['Comment un message circule-t-il sur Internet ?', ['Découpé en paquets numérotés, réassemblés à l’arrivée', 'D’un seul bloc, par un chemin unique', 'Uniquement par câble', 'Toujours par le même serveur central'], 0, 'Si un chemin est coupé, les paquets passent par un autre.'],
            ['Quel équipement réunit routeur, switch, modem et point d’accès Wi-Fi ?', ['La box', 'Le serveur', 'Le commutateur seul', 'La carte mère'], 0, 'C’est le boîtier présent dans la plupart des foyers.'],
            ['Une connexion Wi-Fi est plus sûre qu’une connexion filaire.', ['Vrai', 'Faux'], 1, 'Le signal se diffuse dans l’air : il est plus exposé aux interceptions.'],
          ],
        },
        // ===================================================================
        // Chapitre 7 : Gérer un projet technique
        // ===================================================================
        {
          titre: 'Organisation d’un projet technique',
          axe: 'Gérer un projet technique',
          lecon: {
            titre: 'Des tâches, des délais, une équipe',
            cours: `Un **projet** est un ensemble d’actions coordonnées, avec un **objectif**, un **délai** et des **moyens** limités.

## Les grandes phases
1. **Analyse du besoin** et rédaction du **cahier des charges**.
2. **Recherche de solutions** : plusieurs pistes, comparées sur des critères.
3. **Conception** : choix d’une solution, dessins, plans, calculs.
4. **Réalisation** : prototype ou objet final.
5. **Tests et validation** face au cahier des charges.
6. **Bilan** : ce qui a fonctionné, ce qui est à améliorer.

## Découper en tâches
Chaque phase se découpe en **tâches**, avec pour chacune :
- une **durée** estimée ;
- un ou plusieurs **responsables** ;
- des **antériorités** — les tâches qui doivent être finies avant qu’elle commence.

## Le diagramme de Gantt
Un tableau où le **temps** court en abscisse et les **tâches** en ordonnée ; chaque tâche est une barre horizontale dont la longueur est sa durée. Il montre d’un coup d’œil ce qui se fait **en parallèle**, ce qui **attend**, et la date de fin.

> Le **chemin critique** est la suite de tâches dont le moindre retard décale toute la fin du projet. Les autres disposent d’une marge.

## Répartir les rôles
Un projet d’équipe suppose des rôles clairs : responsable de la conception, de la fabrication, de la programmation, de la documentation, coordinateur. Les **revues de projet** régulières font le point et corrigent la trajectoire.

## La traçabilité
Un **carnet de bord** ou un dossier partagé garde les décisions, les essais ratés et leurs raisons. Un essai raté documenté vaut mieux qu’un succès inexpliqué : il évite qu’un autre refasse la même erreur.`,
          },
          questions: [
            ['Qu’est-ce qu’un projet technique ?', ['Un ensemble d’actions coordonnées avec un objectif, un délai et des moyens limités', 'La fabrication d’un objet unique', 'Un dessin technique détaillé', 'Un cahier des charges'], 0, 'Il se découpe en phases puis en tâches.'],
            ['Quelle est la première phase d’un projet ?', ['L’analyse du besoin et le cahier des charges', 'La réalisation du prototype', 'Les tests de validation', 'Le bilan'], 0, 'On ne conçoit rien avant de savoir ce qui est demandé.'],
            ['Que représente un diagramme de Gantt ?', ['Les tâches et leur durée dans le temps', 'Les fonctions de l’objet', 'Les interacteurs du système', 'Le budget du projet'], 0, 'Chaque tâche est une barre horizontale.'],
            ['Qu’est-ce qu’une antériorité entre deux tâches ?', ['Une tâche qui doit être finie avant qu’une autre commence', 'Une tâche facultative', 'Une tâche déjà réalisée dans un projet précédent', 'Une tâche sans responsable'], 0, 'Elle contraint l’ordre du planning.'],
            ['Qu’est-ce que le chemin critique ?', ['La suite de tâches dont tout retard décale la fin du projet', 'La tâche la plus difficile', 'La tâche la plus coûteuse', 'Le trajet des pièces dans l’atelier'], 0, 'Les autres tâches disposent d’une marge.'],
            ['À quoi sert une revue de projet ?', ['À faire le point en équipe et corriger la trajectoire', 'À valider le produit auprès du client final', 'À commander les matériaux', 'À rédiger la notice'], 0, 'Elle se tient régulièrement, pas seulement à la fin.'],
            ['Pourquoi documenter un essai raté ?', ['Pour éviter qu’un autre refasse la même erreur', 'Pour justifier le retard', 'Parce que la norme l’exige', 'Pour augmenter le nombre de pages du dossier'], 0, 'Un essai raté documenté vaut mieux qu’un succès inexpliqué.'],
            ['Toutes les tâches d’un projet doivent se dérouler l’une après l’autre.', ['Vrai', 'Faux'], 1, 'Beaucoup se mènent en parallèle : c’est ce que montre le diagramme de Gantt.'],
          ],
        },
        {
          titre: 'Modes de représentation d’un OST',
          axe: 'Gérer un projet technique',
          lecon: {
            titre: 'Dessiner pour se faire comprendre',
            cours: `Un objet technique se représente de plusieurs façons, chacune répondant à une question différente.

## Le croquis
Un dessin **à main levée**, rapide, pour fixer une idée et la partager. Il n’est ni à l’échelle ni normalisé — c’est ce qui le rend utile en début de projet.

## Le schéma
Il représente le **fonctionnement**, pas la forme :
- **schéma de principe** : les fonctions et leurs liens ;
- **schéma électrique** : les composants normalisés d’un circuit ;
- **schéma cinématique** : les liaisons entre pièces et les mouvements possibles.

## Le dessin technique
Un dessin **normalisé**, à l’**échelle**, avec des **cotes** :
- l’**échelle** compare le dessin au réel : 1:2 = deux fois plus petit ; 2:1 = deux fois plus grand ; 1:1 = grandeur nature ;
- la **cotation** donne les dimensions réelles, en millimètres ;
- les **vues** (face, dessus, gauche) sont disposées selon des règles fixes ;
- les **traits** ont un sens : continu fort pour les arêtes vues, interrompu pour les arêtes cachées, mixte fin pour les axes.

> Un dessin technique n’est pas un joli dessin : c’est un **document contractuel**, qui doit être lu de la même façon par le concepteur et par le fabricant.

## La modélisation 3D
Réalisée sur un **logiciel de CAO** (conception assistée par ordinateur), elle permet de :
- visualiser l’objet sous tous les angles et en **éclaté** ;
- **simuler** les mouvements, les efforts, la résistance ;
- vérifier les **interférences** entre pièces avant toute fabrication ;
- **exporter** le fichier vers une imprimante 3D ou une machine à commande numérique.

## Choisir la bonne représentation
Croquis pour chercher, schéma pour expliquer un fonctionnement, dessin technique pour faire fabriquer, modèle 3D pour simuler et produire.`,
          },
          questions: [
            ['Qu’est-ce qu’un croquis ?', ['Un dessin à main levée, rapide, pour fixer une idée', 'Un dessin normalisé à l’échelle', 'Un schéma électrique', 'Un modèle 3D simplifié'], 0, 'Ni à l’échelle, ni normalisé : c’est ce qui le rend rapide.'],
            ['Que représente un schéma cinématique ?', ['Les liaisons entre pièces et les mouvements possibles', 'Le circuit électrique', 'Les dimensions réelles de l’objet', 'Le planning du projet'], 0, 'Il décrit le fonctionnement mécanique, pas la forme.'],
            ['Que signifie une échelle 1:2 ?', ['Le dessin est deux fois plus petit que l’objet réel', 'Le dessin est deux fois plus grand', 'Le dessin est à taille réelle', 'L’objet mesure 2 mm'], 0, 'Une échelle 2:1 serait deux fois plus grande que le réel.'],
            ['Que donne la cotation d’un dessin technique ?', ['Les dimensions réelles de l’objet, en millimètres', 'La liste des matériaux', 'Le nom du concepteur', 'Le prix de fabrication'], 0, 'Elle rend le dessin exploitable par le fabricant.'],
            ['Que signifie un trait interrompu sur un dessin technique ?', ['Une arête cachée', 'Une arête vue', 'Un axe de symétrie', 'Une cote'], 0, 'Le trait continu fort marque les arêtes vues.'],
            ['Que permet la modélisation 3D avant toute fabrication ?', ['Simuler les mouvements et détecter les interférences entre pièces', 'Réduire le prix des matériaux', 'Supprimer les tests de validation', 'Éviter le cahier des charges'], 0, 'Elle permet aussi d’exporter vers une imprimante 3D ou une MOCN.'],
            ['Quelle représentation sert à faire fabriquer une pièce ?', ['Le dessin technique coté et à l’échelle', 'Le croquis à main levée', 'Le schéma de principe', 'Le diagramme de Gantt'], 0, 'C’est un document contractuel entre concepteur et fabricant.'],
            ['Un croquis doit toujours être réalisé à l’échelle.', ['Vrai', 'Faux'], 1, 'C’est justement sa liberté qui en fait un outil de recherche rapide.'],
          ],
        },
        {
          titre: 'Concevoir et fabriquer un OST',
          axe: 'Gérer un projet technique',
          lecon: {
            titre: 'De l’idée à l’objet réel',
            cours: `Concevoir, c’est passer d’un **besoin** à une **solution réalisable**, puis la fabriquer. La démarche est toujours la même, quel que soit l’objet.

## 1. Analyser
Identifier le besoin, les utilisateurs, les interacteurs, puis rédiger le **cahier des charges fonctionnel** avec des exigences chiffrées.

## 2. Rechercher des solutions
Produire **plusieurs** idées avant d’en choisir une : croquis, recherche documentaire, observation d’objets existants. Une seule idée n’est pas un choix.

## 3. Choisir
Comparer les solutions dans un **tableau multicritère pondéré**, confronter au cahier des charges, **justifier** le choix retenu.

## 4. Concevoir en détail
Dessins, **modélisation 3D**, choix des matériaux, dimensionnement, choix des composants électroniques, **nomenclature** (la liste des pièces avec quantités et références).

## 5. Préparer la fabrication
Définir les **procédés**, l’ordre des opérations (la **gamme de fabrication**), les machines et les outils, les règles de sécurité applicables.

## 6. Fabriquer et assembler
Réaliser les pièces, les contrôler au fur et à mesure — une pièce hors cote détectée tôt coûte infiniment moins cher — puis assembler.

## 7. Tester, valider, améliorer
Confronter l’objet fini à chaque exigence du cahier des charges, corriger, documenter.

> La démarche n’est pas une ligne droite : un test raté renvoie à la conception, un matériau indisponible renvoie au choix. On appelle cela une démarche **itérative**.

## La documentation finale
Dossier de conception, plans, nomenclature, programme commenté, notice d’utilisation, bilan environnemental. C’est ce dossier, autant que l’objet, qui prouve la maîtrise de la démarche.`,
          },
          questions: [
            ['Par quoi commence toute démarche de conception ?', ['L’analyse du besoin et le cahier des charges', 'Le choix du matériau', 'La fabrication du prototype', 'La rédaction de la notice'], 0, 'On ne conçoit pas avant de savoir ce qui est demandé.'],
            ['Pourquoi chercher plusieurs solutions avant de choisir ?', ['Parce qu’une seule idée n’est pas un choix', 'Pour allonger la durée du projet', 'Parce que la norme l’impose', 'Pour utiliser tous les matériaux disponibles'], 0, 'La comparaison est ce qui rend le choix justifiable.'],
            ['Qu’est-ce qu’une nomenclature ?', ['La liste des pièces avec quantités et références', 'Le planning du projet', 'La liste des utilisateurs', 'Le nom commercial de l’objet'], 0, 'Elle accompagne les dessins de conception.'],
            ['Qu’est-ce qu’une gamme de fabrication ?', ['L’ordre des opérations pour réaliser une pièce', 'La gamme de prix du produit', 'La liste des fournisseurs', 'L’ensemble des variantes du produit'], 0, 'Elle précise machines, outils et règles de sécurité.'],
            ['Pourquoi contrôler les pièces au fur et à mesure ?', ['Parce qu’un défaut détecté tôt coûte beaucoup moins cher', 'Pour occuper le temps d’attente', 'Parce que le client l’exige', 'Pour éviter la nomenclature'], 0, 'Un assemblage terminé avec une pièce hors cote est à refaire entièrement.'],
            ['Que signifie une démarche itérative ?', ['Elle revient en arrière quand un test échoue ou qu’une contrainte change', 'Elle suit un ordre strict et immuable', 'Elle se fait sans tests', 'Elle ne concerne que la fabrication'], 0, 'Un test raté renvoie à la conception.'],
            ['Que contient la documentation finale d’un projet ?', ['Dossier de conception, plans, nomenclature, programme et notice', 'Uniquement la facture des matériaux', 'Uniquement les photos de l’objet', 'Uniquement le cahier des charges'], 0, 'Elle prouve la maîtrise de la démarche autant que l’objet lui-même.'],
            ['La démarche de conception se déroule toujours en ligne droite.', ['Vrai', 'Faux'], 1, 'Elle est itérative : on revient en arrière dès qu’un test ou une contrainte l’impose.'],
          ],
        },
        // ===================================================================
        // Chapitre 8 : Tester et valider les OST
        // ===================================================================
        {
          titre: 'Tester et valider la tenue mécanique, le comportement et les performances d’un objet technique',
          axe: 'Tester et valider les OST',
          lecon: {
            titre: 'Prouver que l’objet fait ce qu’on a promis',
            cours: `**Tester**, c’est mesurer le comportement réel de l’objet. **Valider**, c’est comparer cette mesure à l’exigence du cahier des charges et conclure : conforme ou non conforme.

## Les essais de tenue mécanique
- **Traction** : on tire sur la pièce jusqu’à la rupture, pour mesurer sa résistance.
- **Compression** : on l’écrase.
- **Flexion** : on la charge en son milieu, appuyée à ses extrémités.
- **Torsion** : on la vrille.
- **Chocs** : on mesure la résistance à un impact.
- **Fatigue** : on répète un effort des milliers de fois — beaucoup de pièces cassent non par un effort excessif, mais par répétition.

## Les essais de comportement et de performance
Vitesse, autonomie, temps de réponse, précision, consommation, niveau sonore, température de fonctionnement, étanchéité, tenue aux UV et à la corrosion.

## Le protocole d’essai
Un essai n’a de valeur que s’il est **reproductible**. On note :
- la **grandeur mesurée** et l’**instrument** utilisé ;
- les **conditions** (température, charge, durée) ;
- le **mode opératoire** ;
- les **résultats**, avec leur **incertitude**.

> Un résultat sans conditions d’essai n’est pas un résultat : « il tient 40 kg » ne veut rien dire sans savoir comment la charge a été appliquée.

## La simulation numérique
Sur le modèle 3D, un logiciel calcule les **contraintes**, les **déformations** et les zones de rupture probables. Elle permet d’essayer vingt formes sans rien fabriquer — mais elle repose sur des **hypothèses**, et ne remplace jamais entièrement l’essai réel.

## La conclusion de validation
Pour chaque exigence : la valeur mesurée, le niveau exigé, et le verdict — **conforme** ou **non conforme**. Une non-conformité renvoie à la conception : c’est le retour de boucle de la démarche itérative.`,
          },
          questions: [
            ['Quelle différence y a-t-il entre tester et valider ?', ['Tester mesure, valider compare la mesure à l’exigence', 'Tester compare, valider mesure', 'Ce sont deux mots pour la même chose', 'Tester concerne le prototype, valider la série'], 0, 'La validation conclut : conforme ou non conforme.'],
            ['Quel essai consiste à tirer sur une pièce jusqu’à la rupture ?', ['L’essai de traction', 'L’essai de compression', 'L’essai de flexion', 'L’essai de torsion'], 0, 'La compression, elle, écrase la pièce.'],
            ['Quel essai révèle une rupture due à la répétition d’un effort ?', ['L’essai de fatigue', 'L’essai de traction', 'L’essai de dureté', 'L’essai d’étanchéité'], 0, 'Beaucoup de pièces cassent par répétition, pas par excès d’effort.'],
            ['Que doit contenir un protocole d’essai ?', ['La grandeur mesurée, l’instrument, les conditions et le mode opératoire', 'Uniquement le résultat final', 'Le nom du fabricant', 'Le prix de l’objet testé'], 0, 'C’est ce qui rend l’essai reproductible.'],
            ['Que calcule une simulation numérique sur un modèle 3D ?', ['Les contraintes, les déformations et les zones de rupture probables', 'Le prix de revient', 'La durée de fabrication', 'Le nombre d’utilisateurs'], 0, 'Elle permet d’essayer plusieurs formes sans rien fabriquer.'],
            ['Quelle est la limite de la simulation numérique ?', ['Elle repose sur des hypothèses et ne remplace pas l’essai réel', 'Elle est toujours plus lente qu’un essai', 'Elle ne fonctionne que sur les métaux', 'Elle ne donne aucun résultat chiffré'], 0, 'Un modèle est une représentation, pas la réalité.'],
            ['Que fait-on en cas de non-conformité ?', ['On revient à la conception pour corriger', 'On ajuste le cahier des charges au résultat obtenu', 'On refait le même essai jusqu’à réussir', 'On livre l’objet en le signalant'], 0, 'C’est le retour de boucle de la démarche itérative.'],
            ['Un résultat d’essai se suffit à lui-même, sans ses conditions.', ['Vrai', 'Faux'], 1, '« Il tient 40 kg » ne veut rien dire sans savoir comment la charge a été appliquée.'],
          ],
        },
        {
          titre: 'Prototypage de solutions',
          axe: 'Tester et valider les OST',
          lecon: {
            titre: 'Fabriquer pour apprendre, avant de fabriquer pour vendre',
            cours: `Un **prototype** est un premier exemplaire, fabriqué pour **vérifier** une solution avant la production. Il n’est pas le produit final : il sert à **apprendre**.

## À quoi sert un prototype
- **Vérifier** que la solution fonctionne réellement.
- **Mesurer** des performances impossibles à calculer sur le papier.
- **Détecter** les problèmes d’assemblage, d’ergonomie, d’encombrement.
- **Montrer** l’objet à l’utilisateur et recueillir son avis — bien plus efficace qu’un dessin.

## Les degrés de prototype
- La **maquette** : à l’échelle, non fonctionnelle, elle montre la **forme** et l’encombrement.
- Le **prototype fonctionnel** : il fonctionne, mais avec des matériaux et des procédés qui ne seront pas ceux de la série.
- Le **préséries** : fabriqué comme le sera le produit final, pour valider le **procédé** autant que l’objet.

## Les moyens de prototypage rapide
- **Impression 3D** : formes complexes, une pièce à la fois, en quelques heures.
- **Découpe laser** et découpe vinyle sur plaques.
- **Cartes programmables** et modules électroniques enfichables, câblés sans soudure.
- Carton plume, bois, mousse pour les maquettes de forme.

> Un prototype raté n’est pas un échec : c’est un test qui a donné son résultat. Le vrai échec est de lancer la production sans avoir jamais rien fabriqué.

## Itérer
Prototype → test → analyse → modification → nouveau prototype. Chaque tour coûte du temps mais en fait gagner bien davantage : une erreur détectée sur un prototype coûte cent fois moins cher que la même erreur détectée sur dix mille exemplaires vendus.

## Documenter le prototype
Photos, mesures, difficultés rencontrées, modifications apportées et raisons : c’est la mémoire du projet, et la matière du dossier final.`,
          },
          questions: [
            ['Qu’est-ce qu’un prototype ?', ['Un premier exemplaire fabriqué pour vérifier une solution', 'Le produit final vendu au client', 'Un dessin en trois dimensions', 'Un cahier des charges illustré'], 0, 'Il sert à apprendre avant de produire.'],
            ['Qu’est-ce qu’une maquette ?', ['Un modèle à l’échelle, non fonctionnel, qui montre la forme', 'Un prototype qui fonctionne', 'Le premier exemplaire de la série', 'Un dessin technique coté'], 0, 'Elle sert à juger l’encombrement et l’aspect.'],
            ['Qu’est-ce qu’un prototype fonctionnel ?', ['Un exemplaire qui fonctionne, avec des matériaux différents de la série', 'Une maquette en carton', 'Le produit final', 'Un modèle numérique'], 0, 'Il valide la solution, pas encore le procédé de fabrication.'],
            ['Quel moyen permet de fabriquer rapidement une pièce de forme complexe ?', ['L’impression 3D', 'Le moulage par injection', 'L’emboutissage', 'Le forgeage'], 0, 'Une pièce à la fois, en quelques heures.'],
            ['Pourquoi montrer un prototype à l’utilisateur ?', ['Parce que son avis sur un objet réel est bien plus riche que sur un dessin', 'Pour lui faire signer le cahier des charges', 'Pour fixer le prix de vente', 'Parce que la norme l’impose'], 0, 'On y détecte des problèmes d’usage invisibles sur le papier.'],
            ['Que signifie itérer en prototypage ?', ['Enchaîner prototype, test, analyse, modification et nouveau prototype', 'Fabriquer plusieurs exemplaires identiques', 'Répéter le même essai', 'Produire en série'], 0, 'Chaque tour coûte du temps mais en fait gagner beaucoup plus.'],
            ['Pourquoi une erreur détectée sur un prototype coûte-t-elle peu ?', ['Parce qu’elle n’affecte qu’un exemplaire, pas toute une production', 'Parce que le prototype est gratuit', 'Parce qu’elle est toujours mineure', 'Parce qu’elle ne nécessite aucune correction'], 0, 'La même erreur sur dix mille exemplaires vendus est cent fois plus coûteuse.'],
            ['Un prototype qui ne fonctionne pas rend le projet inutile.', ['Vrai', 'Faux'], 1, 'C’est un test qui a donné son résultat : le vrai risque serait de produire sans avoir rien testé.'],
          ],
        },
      ],
    },
  ],
}
