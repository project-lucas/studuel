// Technologie — Sixième : LE PROGRAMME DU CYCLE 3 (10 fiches).
//
// LE DÉFAUT. La technologie de 6e n'avait que DEUX chapitres, 20 questions —
// la matière la plus pauvre du collège après la physique-chimie, désormais
// traitée (326). Deux lignes pour une année.
//
// ⚠️ POURQUOI ELLE N'IMPORTE PAS LA 3e, alors que la 5e et la 4e le font
// (334, 335). Le BO écrit la technologie pour le CYCLE 4 — 5e, 4e, 3e — et
// l'import entre ces trois niveaux est légitime. La 6e n'en fait pas partie :
// elle appartient au CYCLE 3, où la technologie est enseignée dans
// « sciences et technologie », avec un niveau d'exigence tout autre. Importer
// la 3e mettrait la démarche de projet et la validation de systèmes devant des
// élèves de onze ans.
//
// ⚠️ LA FRONTIÈRE AVEC LA PHYSIQUE-CHIMIE DE 6e (326) EST TENUE À DESSEIN.
// Les deux matières partagent le programme de sciences du cycle 3, et deux
// fiches auraient pu se recouvrir : le signal et l'information. La 326 traite
// le SIGNAL — ce qui se propage, lumière et son. Ce module traite l'OBJET qui
// le produit et le transporte : capteur, actionneur, chaîne d'information,
// programme. Rien n'est écrit deux fois.
//
// CE QUE L'ÉLÈVE DOIT VOIR — les 4 chapitres du programme et leurs 10 fiches :
//   1. L'objet technique et son besoin        (3)
//   2. Les matériaux                          (2)
//   3. Représenter et fabriquer               (2)
//   4. Objets programmables et information    (3)
//
// ⚠️ Ne JAMAIS générer avec `--slugs technologie` : toujours
// `--modules technologie-6e`.

export default {
  slug: 'technologie',
  nom: 'Technologie',

  titreMigration: 'TECHNOLOGIE 6e — LE PROGRAMME DU CYCLE 3 (10 fiches)',

  motif: `CONSTAT : la technologie de 6e n'avait que DEUX chapitres et 20 questions — après
la physique-chimie (traitée par la 326), la matière la plus pauvre du collège.
Un élève qui révisait le besoin, la fonction d'usage, les matériaux, le croquis,
la chaîne d'information ou la programmation d'un objet ne trouvait presque RIEN.
Cette migration installe 10 fiches sous les 4 chapitres du programme et retire
les 2 chapitres génériques.
ÉCRITE, PAS IMPORTÉE DE LA 3e, contrairement à la 5e (334) et à la 4e (335) : le
BO écrit la technologie pour le CYCLE 4, dont la 6e ne fait pas partie. Elle
relève du CYCLE 3, où la technologie s'enseigne dans « sciences et technologie ».
LA FRONTIÈRE AVEC LA PHYSIQUE-CHIMIE DE 6e EST TENUE : la 326 traite le SIGNAL
(lumière, son), ce module traite l'OBJET qui le produit et le transporte.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) porte le chapitre du programme, et
l'INSERT l'écrit pour les 10 fiches. Elle est REPRISE ici en ADD COLUMN IF NOT
EXISTS parce qu'on ne peut pas garantir que la 234 soit passée en production —
sans cette reprise, la migration échouerait sur "column chapters.theme does not
exist", les 2 anciens chapitres déjà supprimés et les 10 neufs pas encore posés.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters et ne l'a rendu que colonne par colonne.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 2 chapitres hérités partent, au niveau 6e SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE : les 10 fiches neuves portent leur
chapitre de programme dès l'INSERT, les 2 anciennes n'en ont aucun. Le ménage
tourne AVANT les insertions et ne peut donc jamais mordre sur les neuves.
Le filtre level = '6e' est indispensable : la technologie existe sur quatre
niveaux, et la 3e est la SOURCE des imports de 5e et 4e.
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
   AND c.level = '6e'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'technologie'
   AND c.level = '6e'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'technologie'
   AND c.level = '6e'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['6e'],
      chapitres: [
        // ===================================================================
        // Chapitre 1 : L'objet technique et son besoin (3)
        // ===================================================================
        {
          titre: 'Le besoin et la fonction d’usage',
          axe: 'L’objet technique et son besoin',
          lecon: {
            titre: 'Pourquoi cet objet existe',
            cours: `## L’objet technique
Un **objet technique** est un objet **fabriqué par l’humain** pour répondre à un **besoin**. Un caillou n’est pas un objet technique ; un marteau l’est.

## Le besoin
Le besoin est ce qui **manque** à quelqu’un. Un objet technique n’existe que parce qu’un besoin l’a précédé : on ne se déplace pas parce que le vélo existe, on a inventé le vélo parce qu’on voulait se déplacer.

## La fonction d’usage
La **fonction d’usage** répond à la question : **à quoi ça sert ?**
Elle s’exprime par un **verbe à l’infinitif** + un complément :
- un parapluie sert à **protéger de la pluie** ;
- une lampe sert à **éclairer un espace** ;
- un vélo sert à **se déplacer**.

## La fonction d’estime
C’est ce qui fait **préférer** un objet à un autre alors qu’ils rendent le même service : la couleur, la forme, la marque, le prix. Deux vélos ont la même fonction d’usage ; on choisit l’un pour sa fonction d’estime.

> La fonction d’usage explique pourquoi l’objet existe. La fonction d’estime explique pourquoi on achète **celui-là**.

## Le cahier des charges
Avant de concevoir, on écrit un **cahier des charges** : la liste des **contraintes** que l’objet devra respecter — dimensions, poids, prix, sécurité, matériaux, durée de vie, impact sur l’environnement.
C’est un contrat : il dit ce que l’objet doit faire, sans dire comment.

## L’utilisateur
Un même besoin appelle des objets différents selon **qui** s’en sert : une cuillère pour un adulte, pour un bébé, ou pour une personne qui n’a qu’une main valide. Concevoir, c’est d’abord regarder l’utilisateur.`,
          },
          questions: [
            ['Qu’est-ce qu’un objet technique ?', ['Un objet fabriqué par l’humain pour répondre à un besoin', 'Tout objet naturel', 'Un objet électrique', 'Un objet en métal'], 0, 'Un caillou n’en est pas un, un marteau si.'],
            ['À quelle question répond la fonction d’usage ?', ['À quoi ça sert ?', 'Comment c’est fait ?', 'Combien ça coûte ?', 'Qui l’a inventé ?'], 0, 'Elle s’exprime par un verbe à l’infinitif.'],
            ['Quelle est la fonction d’usage d’un parapluie ?', ['Protéger de la pluie', 'Être élégant', 'Coûter peu cher', 'Se ranger facilement'], 0, 'Un verbe à l’infinitif + un complément.'],
            ['Qu’est-ce que la fonction d’estime ?', ['Ce qui fait préférer un objet à un autre rendant le même service', 'Ce à quoi l’objet sert', 'Le prix de l’objet', 'La matière de l’objet'], 0, 'Couleur, forme, marque.'],
            ['Qu’est-ce qu’un cahier des charges ?', ['La liste des contraintes que l’objet devra respecter', 'Le mode d’emploi', 'La facture', 'Le plan de fabrication'], 0, 'Il dit ce que l’objet doit faire, pas comment.'],
            ['Qu’est-ce qui précède toujours l’objet technique ?', ['Le besoin', 'Le matériau', 'Le prix', 'La marque'], 0, 'On a inventé le vélo parce qu’on voulait se déplacer.'],
            ['Pourquoi un même besoin peut-il donner des objets différents ?', ['Parce que les utilisateurs sont différents', 'Parce que les matériaux manquent', 'Par hasard', 'Pour augmenter les prix'], 0, 'Concevoir, c’est d’abord regarder l’utilisateur.'],
            ['La fonction d’usage et la fonction d’estime sont la même chose.', ['Vrai', 'Faux'], 1, 'L’une dit à quoi ça sert, l’autre pourquoi on choisit celui-là.'],
          ],
        },
        {
          titre: 'Les fonctions techniques et les solutions',
          axe: 'L’objet technique et son besoin',
          lecon: {
            titre: 'Comment l’objet fait ce qu’il fait',
            cours: `## De l’usage à la technique
La **fonction d’usage** dit à quoi l’objet sert. Les **fonctions techniques** disent **comment** il y parvient : ce sont les tâches que doivent accomplir ses différentes parties.

Un vélo sert à se déplacer (usage). Pour cela, il doit :
- **transmettre** le mouvement (pédalier, chaîne, roue) ;
- **diriger** (guidon, fourche) ;
- **freiner** (leviers, patins) ;
- **soutenir** l’utilisateur (cadre, selle).

## Les solutions techniques
Pour chaque fonction technique, plusieurs **solutions** sont possibles :
- freiner → patins sur la jante, frein à disque, rétropédalage ;
- transmettre → chaîne, courroie, cardan.
Le concepteur choisit selon le **cahier des charges** : coût, poids, entretien, sécurité.

> Une fonction technique est un PROBLÈME à résoudre ; une solution technique est UNE réponse parmi d’autres. Il n’y a jamais une seule bonne solution.

## Le diagramme
On représente cela en arbre : la fonction d’usage en haut, les fonctions techniques en dessous, et sous chacune les solutions retenues.

## Les composants
Chaque solution se réalise par des **composants** : un ressort, un engrenage, une vis, un moteur, un interrupteur. Un même composant peut servir plusieurs fonctions.

## Faire des choix
Comparer deux solutions, c’est peser des **critères** : prix, masse, résistance, facilité de réparation, impact environnemental. Un tableau de comparaison rend le choix explicite au lieu de le laisser à l’intuition.`,
          },
          questions: [
            ['Que dit une fonction technique ?', ['Comment l’objet parvient à rendre son service', 'À quoi l’objet sert', 'Combien il coûte', 'Qui l’utilise'], 0, 'C’est la tâche d’une partie de l’objet.'],
            ['Quelle est une fonction technique du vélo ?', ['Transmettre le mouvement', 'Se déplacer', 'Être rouge', 'Coûter 300 euros'], 0, '« Se déplacer » est la fonction d’usage.'],
            ['Qu’est-ce qu’une solution technique ?', ['Une façon parmi d’autres de réaliser une fonction technique', 'Le but de l’objet', 'Le matériau utilisé', 'Le prix de vente'], 0, 'Freiner peut se faire par patins ou par disque.'],
            ['Sur quoi le concepteur s’appuie-t-il pour choisir une solution ?', ['Le cahier des charges', 'Son intuition seule', 'La mode', 'Le hasard'], 0, 'Coût, poids, entretien, sécurité.'],
            ['Comment représente-t-on l’ensemble des fonctions ?', ['Par un diagramme en arbre', 'Par une liste alphabétique', 'Par un graphique circulaire', 'Par une photo'], 0, 'Fonction d’usage en haut, fonctions techniques en dessous.'],
            ['Qu’est-ce qu’un composant ?', ['L’élément concret qui réalise une solution technique', 'Le besoin de départ', 'Le cahier des charges', 'L’utilisateur'], 0, 'Ressort, engrenage, vis, moteur.'],
            ['Comment comparer deux solutions techniques ?', ['En pesant des critères dans un tableau', 'En choisissant la moins chère toujours', 'En prenant la plus récente', 'Au hasard'], 0, 'Cela rend le choix explicite.'],
            ['Une fonction technique n’admet qu’une seule solution possible.', ['Vrai', 'Faux'], 1, 'C’est un problème, et il y a toujours plusieurs réponses.'],
          ],
        },
        {
          titre: 'L’évolution des objets techniques',
          axe: 'L’objet technique et son besoin',
          lecon: {
            titre: 'Pourquoi les objets changent',
            cours: `## Les objets ont une histoire
Un objet technique n’apparaît pas d’un coup : il **évolue**. Le vélo, le téléphone, l’éclairage, le vélocipède devenu VTT électrique — chacun a une lignée.

## Ce qui pousse l’évolution
- Les **progrès techniques** : nouveaux matériaux, nouvelles énergies, électronique.
- Les **besoins** qui changent : aller plus vite, plus loin, plus confortablement.
- La **société** : lois de sécurité, normes, préoccupations environnementales.
- L’**économie** : produire moins cher, en plus grande quantité.

## Un exemple : l’éclairage
Feu → bougie → lampe à huile → bec de gaz → lampe à incandescence → fluocompacte → **LED**.
À chaque étape : plus de lumière, moins d’énergie, moins de danger. La LED consomme environ **dix fois moins** que l’ampoule à filament pour le même éclairage.

## Ce qui reste, ce qui change
La **fonction d’usage** reste souvent la même sur des siècles — éclairer, se déplacer, conserver les aliments. Ce sont les **solutions techniques** qui changent.

> On n’a jamais cessé d’avoir besoin de lumière. On a cessé d’utiliser le feu pour l’obtenir.

## Les familles et les lignées
- une **famille** regroupe les objets qui remplissent la même fonction d’usage à une même époque ;
- une **lignée** suit un objet à travers le temps.

## Le progrès n’est pas automatique
Un objet plus récent n’est pas meilleur sur tous les critères : il peut être plus difficile à réparer, plus coûteux à produire, ou dépendant de matériaux rares. C’est en cela que l’**analyse du cycle de vie** — extraction, fabrication, usage, fin de vie — est devenue un critère de conception.`,
          },
          questions: [
            ['Qu’est-ce qui pousse un objet technique à évoluer ?', ['Progrès techniques, besoins, société et économie', 'Uniquement la mode', 'Uniquement le prix', 'Rien, ils ne changent pas'], 0, 'Plusieurs causes agissent ensemble.'],
            ['Qu’est-ce qui reste souvent identique au fil de l’évolution ?', ['La fonction d’usage', 'Les solutions techniques', 'Les matériaux', 'Le prix'], 0, 'On a toujours eu besoin de lumière.'],
            ['Quelle est la lignée de l’éclairage ?', ['Feu, bougie, lampe à huile, gaz, incandescence, LED', 'LED, bougie, feu', 'Gaz, feu, bougie', 'Incandescence, feu, LED'], 0, 'Chaque étape apporte plus de lumière pour moins d’énergie.'],
            ['Combien la LED consomme-t-elle par rapport à l’ampoule à filament ?', ['Environ dix fois moins', 'Autant', 'Deux fois plus', 'Cent fois moins'], 0, 'Pour un éclairage équivalent.'],
            ['Qu’est-ce qu’une famille d’objets techniques ?', ['Des objets remplissant la même fonction d’usage à une même époque', 'Un objet suivi dans le temps', 'Des objets du même fabricant', 'Des objets de même couleur'], 0, 'La lignée, elle, suit un objet à travers le temps.'],
            ['Qu’est-ce que l’analyse du cycle de vie ?', ['L’étude de l’objet de l’extraction à la fin de vie', 'La durée de la garantie', 'Le temps de fabrication', 'La durée d’utilisation seule'], 0, 'Elle est devenue un critère de conception.'],
            ['Un objet plus récent est-il toujours meilleur ?', ['Non : il peut être plus difficile à réparer ou dépendre de matériaux rares', 'Oui, toujours', 'Oui, sauf pour le prix', 'Cela ne se mesure pas'], 0, 'Le progrès n’est pas automatique sur tous les critères.'],
            ['La fonction d’usage change à chaque évolution technique.', ['Vrai', 'Faux'], 1, 'Ce sont les solutions techniques qui changent.'],
          ],
        },

        // ===================================================================
        // Chapitre 2 : Les matériaux (2)
        // ===================================================================
        {
          titre: 'Les familles de matériaux',
          axe: 'Les matériaux',
          lecon: {
            titre: 'De quoi les objets sont faits',
            cours: `## Les grandes familles
- **Métaux** : fer, acier, aluminium, cuivre. Résistants, conducteurs de chaleur et d’électricité, souvent lourds, recyclables à l’infini.
- **Plastiques** : légers, faciles à mouler, isolants, peu chers — mais issus du **pétrole** et longs à se dégrader.
- **Céramiques et verres** : durs, résistants à la chaleur, mais **fragiles** (ils cassent net).
- **Matériaux organiques** : bois, papier, cuir, textiles naturels. Renouvelables.
- **Composites** : plusieurs matériaux associés pour cumuler leurs qualités — béton armé, fibre de carbone, contreplaqué.

## Les propriétés qu’on mesure
- **dureté** : résiste à la rayure ;
- **élasticité** : reprend sa forme ;
- **résistance** : supporte un effort sans casser ;
- **masse volumique** : léger ou lourd à volume égal ;
- **conductivité** électrique et thermique ;
- **résistance à la corrosion**, à l’eau, à la chaleur.

> On ne choisit pas un matériau parce qu’il est « meilleur » : on le choisit parce que ses propriétés correspondent aux contraintes du cahier des charges.

## Le choix
Une casserole : métal pour conduire la chaleur, plastique pour le manche parce qu’il est **isolant**. Deux matériaux dans un même objet, chacun pour une raison précise.

## L’origine et le coût
Extraction, transport, transformation : chaque matériau a un coût économique **et** environnemental. L’aluminium est très recyclable, mais sa production initiale consomme énormément d’électricité.

## Le recyclage
Trier permet de réintroduire la matière dans un nouveau cycle. Le **verre** et les **métaux** se recyclent presque indéfiniment ; le **plastique** se dégrade à chaque cycle et finit par sortir de la boucle.`,
          },
          questions: [
            ['Quelle famille regroupe le fer, l’aluminium et le cuivre ?', ['Les métaux', 'Les plastiques', 'Les céramiques', 'Les composites'], 0, 'Résistants et conducteurs.'],
            ['Quelle est la principale origine des plastiques ?', ['Le pétrole', 'Le bois', 'Le sable', 'Le minerai de fer'], 0, 'Ils sont longs à se dégrader.'],
            ['Qu’est-ce qu’un matériau composite ?', ['Plusieurs matériaux associés pour cumuler leurs qualités', 'Un métal très pur', 'Un plastique recyclé', 'Un matériau naturel'], 0, 'Béton armé, fibre de carbone, contreplaqué.'],
            ['Quelle propriété désigne la résistance à la rayure ?', ['La dureté', 'L’élasticité', 'La conductivité', 'La masse volumique'], 0, 'L’élasticité, c’est reprendre sa forme.'],
            ['Pourquoi le manche d’une casserole est-il en plastique ?', ['Parce que le plastique est isolant thermique', 'Parce qu’il est plus dur', 'Parce qu’il coûte plus cher', 'Parce qu’il conduit la chaleur'], 0, 'Chaque matériau est choisi pour une raison précise.'],
            ['Quels matériaux se recyclent presque indéfiniment ?', ['Le verre et les métaux', 'Les plastiques', 'Le bois', 'Les composites'], 0, 'Le plastique se dégrade à chaque cycle.'],
            ['Quelle est la faiblesse des céramiques et des verres ?', ['Ils sont fragiles et cassent net', 'Ils fondent à basse température', 'Ils conduisent l’électricité', 'Ils rouillent'], 0, 'Ils sont pourtant durs et résistants à la chaleur.'],
            ['On choisit un matériau parce qu’il est meilleur que les autres.', ['Vrai', 'Faux'], 1, 'On le choisit parce que ses propriétés répondent aux contraintes.'],
          ],
        },
        {
          titre: 'L’impact environnemental des objets',
          axe: 'Les matériaux',
          lecon: {
            titre: 'Ce que coûte un objet, au-delà de son prix',
            cours: `## Le cycle de vie
Tout objet technique passe par cinq étapes, et chacune a un coût pour l’environnement :
1. **extraction** des matières premières ;
2. **fabrication** (énergie, eau, rejets) ;
3. **transport** (souvent sur des milliers de kilomètres) ;
4. **utilisation** (énergie consommée pendant des années) ;
5. **fin de vie** : réemploi, recyclage, incinération ou décharge.

## Où se joue l’impact
Il n’est pas toujours là où on le croit. Pour un smartphone, l’essentiel de l’empreinte vient de la **fabrication**, pas de l’usage : le garder deux ans de plus fait plus de bien que de le recharger « proprement ».
Pour un réfrigérateur, c’est l’inverse : c’est l’**usage**, sur quinze ans, qui domine.

> Avant de vouloir réduire un impact, il faut savoir OÙ il se trouve. Sinon on optimise ce qui ne pèse rien.

## Les leviers, dans l’ordre d’efficacité
1. **Ne pas produire** l’objet : s’en passer, le partager, le louer.
2. **Allonger sa durée de vie** : entretenir, réparer, revendre.
3. **Réemployer** : donner une seconde vie sans transformation.
4. **Recycler** : refaire de la matière — utile, mais coûteux en énergie.
5. **Valoriser** : incinérer en récupérant la chaleur, en dernier recours.

## L’obsolescence
Un objet peut cesser d’être utilisé alors qu’il fonctionne : pièces indisponibles, logiciel qui ne se met plus à jour, mode. L’**indice de réparabilité**, affiché en France depuis 2021, informe l’acheteur.

## L’écoconception
C’est concevoir en pensant à tout le cycle : moins de matière, matériaux recyclables, assemblage démontable (vis plutôt que colle), pièces détachées disponibles.`,
          },
          questions: [
            ['Quelles sont les cinq étapes du cycle de vie d’un objet ?', ['Extraction, fabrication, transport, utilisation, fin de vie', 'Achat, usage, revente', 'Conception, vente, recyclage', 'Fabrication, vente, réparation'], 0, 'Chacune a un coût environnemental.'],
            ['Où se situe l’essentiel de l’impact d’un smartphone ?', ['Dans sa fabrication', 'Dans son utilisation', 'Dans son transport', 'Dans sa fin de vie'], 0, 'Le garder plus longtemps est donc le meilleur levier.'],
            ['Où se situe l’essentiel de l’impact d’un réfrigérateur ?', ['Dans son utilisation, sur quinze ans', 'Dans sa fabrication', 'Dans son transport', 'Dans son emballage'], 0, 'C’est l’inverse du smartphone.'],
            ['Quel est le levier le plus efficace pour réduire l’impact ?', ['Ne pas produire l’objet : s’en passer, le partager, le louer', 'Le recycler', 'L’incinérer', 'Le transporter autrement'], 0, 'Le recyclage vient loin après.'],
            ['Qu’est-ce que l’obsolescence ?', ['Un objet cesse d’être utilisé alors qu’il fonctionne', 'Un objet qui casse', 'Un objet recyclé', 'Un objet neuf'], 0, 'Pièces indisponibles, logiciel non mis à jour, mode.'],
            ['Qu’est-ce que l’indice de réparabilité ?', ['Une note affichée qui informe sur la facilité de réparation', 'Le prix des pièces', 'La durée de la garantie', 'Le poids de l’objet'], 0, 'Affiché en France depuis 2021.'],
            ['Qu’est-ce que l’écoconception ?', ['Concevoir en pensant à tout le cycle de vie', 'Fabriquer avec du plastique recyclé seulement', 'Vendre moins cher', 'Produire localement uniquement'], 0, 'Moins de matière, assemblage démontable, pièces disponibles.'],
            ['Recycler un objet est le meilleur moyen de réduire son impact.', ['Vrai', 'Faux'], 1, 'Allonger sa durée de vie et ne pas le produire sont plus efficaces.'],
          ],
        },

        // ===================================================================
        // Chapitre 3 : Représenter et fabriquer (2)
        // ===================================================================
        {
          titre: 'Croquis, schémas et plans',
          axe: 'Représenter et fabriquer',
          lecon: {
            titre: 'Dessiner pour se faire comprendre',
            cours: `## Pourquoi représenter
Un objet ne se fabrique pas à partir d’une description orale : il faut un **dessin** que tout le monde lise de la même façon. C’est un **langage**, avec ses règles.

## Les trois niveaux
- Le **croquis** : dessin à main levée, rapide, pour montrer une idée. Pas d’échelle exacte.
- Le **schéma** : dessin simplifié qui montre le **fonctionnement** ou les liaisons, avec des **symboles** normalisés. Il ne ressemble pas à l’objet.
- Le **plan** (ou dessin technique) : dessin précis, à l’**échelle**, coté, qui permet de **fabriquer**.

> Le croquis dit « voilà l’idée », le schéma dit « voilà comment ça marche », le plan dit « voilà comment le faire ». Trois usages, trois dessins.

## L’échelle
Elle compare le dessin au réel :
- **1:1** → taille réelle ;
- **1:10** → le dessin est 10 fois plus petit ;
- **10:1** → le dessin est 10 fois plus grand (pour une petite pièce).

## Les vues
Un objet en trois dimensions se représente par plusieurs **vues** planes : de **face**, de **dessus**, de **gauche**. Ensemble, elles décrivent l’objet sans ambiguïté.
La **perspective** donne une idée du volume, mais ne permet pas de mesurer.

## Les cotes
Les **cotes** indiquent les dimensions réelles, en **millimètres**, quelle que soit l’échelle du dessin. On ne mesure jamais sur le papier : on lit la cote.

## Les outils numériques
La **conception assistée par ordinateur** (CAO) permet de dessiner en 3D, de tester avant de fabriquer, et d’envoyer le fichier directement à une machine — imprimante 3D ou découpeuse.`,
          },
          questions: [
            ['Qu’est-ce qu’un croquis ?', ['Un dessin à main levée qui montre une idée', 'Un dessin précis et coté', 'Un dessin avec des symboles normalisés', 'Une photographie'], 0, 'Pas d’échelle exacte.'],
            ['Que montre un schéma ?', ['Le fonctionnement ou les liaisons, avec des symboles', 'L’apparence exacte de l’objet', 'Les dimensions réelles', 'La couleur de l’objet'], 0, 'Il ne ressemble pas à l’objet.'],
            ['À quoi sert un plan technique ?', ['À fabriquer l’objet : il est à l’échelle et coté', 'À montrer une idée', 'À décorer', 'À vendre l’objet'], 0, 'C’est le dessin le plus précis.'],
            ['Que signifie l’échelle 1:10 ?', ['Le dessin est 10 fois plus petit que le réel', 'Le dessin est 10 fois plus grand', 'Le dessin est à taille réelle', 'L’objet mesure 10 cm'], 0, '10:1 serait l’inverse.'],
            ['Quelles sont les vues classiques d’un dessin technique ?', ['De face, de dessus, de gauche', 'De face seulement', 'En perspective seulement', 'De dessous et de droite'], 0, 'Ensemble, elles décrivent l’objet sans ambiguïté.'],
            ['Dans quelle unité les cotes sont-elles indiquées ?', ['En millimètres', 'En centimètres', 'En mètres', 'Selon l’échelle'], 0, 'On lit la cote, on ne mesure jamais sur le papier.'],
            ['Que permet la CAO ?', ['Dessiner en 3D, tester avant de fabriquer et piloter une machine', 'Uniquement imprimer des plans', 'Calculer un prix', 'Choisir un matériau automatiquement'], 0, 'Imprimante 3D, découpeuse.'],
            ['On peut mesurer directement sur un plan pour connaître les dimensions réelles.', ['Vrai', 'Faux'], 1, 'On lit les cotes : le dessin est à l’échelle, pas à la taille réelle.'],
          ],
        },
        {
          titre: 'Fabriquer un objet',
          axe: 'Représenter et fabriquer',
          lecon: {
            titre: 'Du plan à l’objet réel',
            cours: `## La gamme de fabrication
C’est la **suite ordonnée** des opérations qui transforment la matière en objet. Chaque ligne indique l’opération, l’outil, et le contrôle à faire. Sans elle, chacun s’y prend autrement et les pièces ne s’assemblent pas.

## Les grandes opérations
- **Mesurer et tracer** : reporter les cotes du plan sur la matière.
- **Découper** : scie, cisaille, découpeuse laser.
- **Percer**, **usiner**, **poncer**.
- **Assembler**.
- **Contrôler** : vérifier que la pièce est conforme au plan.
- **Finir** : peinture, vernis, protection.

## Les assemblages
- **Démontables** : vis, boulons, clips. On peut réparer et recycler.
- **Permanents** : colle, soudure, rivet. Plus solides, mais l’objet devient difficile à réparer.

> Choisir la colle plutôt que la vis, c’est décider, à la conception, que l’objet ne sera jamais réparé. Ce n’est pas un détail technique, c’est un choix de durée de vie.

## Le contrôle qualité
On vérifie les **dimensions** (pied à coulisse, gabarit), l’**aspect**, le **fonctionnement**. Une pièce hors **tolérance** — l’écart acceptable autour de la cote — est refusée.

## La sécurité
Lunettes, gants, cheveux attachés, machine arrêtée avant tout réglage, un seul opérateur à la fois. Les consignes ne sont pas des formalités : les machines de l’atelier coupent, percent et chauffent.

## Prototype et série
Le **prototype** est le premier exemplaire : il sert à tester et à corriger. La **série** vient ensuite, avec des outillages qui rendent chaque pièce identique.`,
          },
          questions: [
            ['Qu’est-ce qu’une gamme de fabrication ?', ['La suite ordonnée des opérations pour fabriquer l’objet', 'La liste des matériaux', 'Le prix de revient', 'Le plan coté'], 0, 'Elle indique aussi les outils et les contrôles.'],
            ['Quel assemblage permet de réparer l’objet ?', ['Un assemblage démontable, par vis ou clips', 'Un assemblage collé', 'Une soudure', 'Un rivet'], 0, 'Il facilite aussi le recyclage.'],
            ['Que décide-t-on en choisissant la colle plutôt que la vis ?', ['Que l’objet ne sera pratiquement pas réparable', 'Qu’il sera moins cher à l’usage', 'Qu’il durera plus longtemps', 'Rien de particulier'], 0, 'C’est un choix de durée de vie.'],
            ['Qu’est-ce que la tolérance ?', ['L’écart acceptable autour de la cote', 'Le temps de fabrication', 'Le prix maximal', 'La dureté du matériau'], 0, 'Une pièce hors tolérance est refusée.'],
            ['Quel outil sert à contrôler précisément une dimension ?', ['Le pied à coulisse', 'La scie', 'La perceuse', 'Le pinceau'], 0, 'Ou un gabarit.'],
            ['À quoi sert un prototype ?', ['À tester et corriger avant la série', 'À vendre en premier', 'À décorer', 'À remplacer le plan'], 0, 'La série vient ensuite.'],
            ['Quelle règle de sécurité s’applique avant un réglage ?', ['Arrêter la machine', 'Travailler plus vite', 'Retirer ses gants', 'Appeler un camarade'], 0, 'Les machines coupent, percent et chauffent.'],
            ['La gamme de fabrication est facultative si l’on connaît le plan.', ['Vrai', 'Faux'], 1, 'Sans elle, chacun s’y prend autrement et les pièces ne s’assemblent pas.'],
          ],
        },

        // ===================================================================
        // Chapitre 4 : Objets programmables et information (3)
        // ===================================================================
        {
          titre: 'La chaîne d’information et la chaîne d’énergie',
          axe: 'Objets programmables et information',
          lecon: {
            titre: 'Les deux circuits de tout objet technique',
            cours: `## Deux chaînes en parallèle
Tout objet technique un peu élaboré contient **deux chaînes** qui travaillent ensemble :
- la **chaîne d’information** : elle **acquiert**, **traite** et **communique** ;
- la **chaîne d’énergie** : elle **alimente**, **distribue**, **convertit** et **transmet**.

## La chaîne d’information
1. **Acquérir** — le **capteur** transforme une grandeur physique en signal : capteur de température, de lumière, de présence, bouton-poussoir.
2. **Traiter** — la **carte programmable** (microcontrôleur) décide selon le programme.
3. **Communiquer** — le résultat part vers la chaîne d’énergie ou vers un écran, une LED, un haut-parleur.

## La chaîne d’énergie
1. **Alimenter** — pile, secteur, batterie, panneau solaire.
2. **Distribuer** — interrupteur, relais : laisser passer ou non.
3. **Convertir** — l’**actionneur** transforme l’énergie en action : moteur (mouvement), lampe (lumière), résistance (chaleur), buzzer (son).
4. **Transmettre** — engrenages, courroies, roues.

> Le capteur est l’oreille, le microcontrôleur le cerveau, l’actionneur le muscle. Retenir ces trois mots suffit à lire n’importe quel objet.

## Un exemple complet
Un éclairage automatique de couloir :
capteur de **présence** → carte programmable → relais → **lampe**.
Information à gauche, énergie à droite, et le programme au milieu qui décide.

## Pourquoi les séparer
Parce que les pannes ne se cherchent pas au même endroit : si la lampe ne s’allume pas, soit le capteur n’a rien vu (information), soit l’alimentation est coupée (énergie). Distinguer les deux chaînes, c’est diviser le problème en deux.`,
          },
          questions: [
            ['Quelles sont les deux chaînes d’un objet technique ?', ['La chaîne d’information et la chaîne d’énergie', 'La chaîne de production et de vente', 'La chaîne de montage et de contrôle', 'La chaîne mécanique et électrique'], 0, 'Elles travaillent ensemble.'],
            ['Que fait un capteur ?', ['Il transforme une grandeur physique en signal', 'Il produit du mouvement', 'Il stocke l’énergie', 'Il éclaire'], 0, 'Température, lumière, présence.'],
            ['Que fait un actionneur ?', ['Il transforme l’énergie en action', 'Il mesure une grandeur', 'Il décide selon un programme', 'Il stocke l’information'], 0, 'Moteur, lampe, résistance, buzzer.'],
            ['Quelles sont les trois fonctions de la chaîne d’information ?', ['Acquérir, traiter, communiquer', 'Alimenter, distribuer, convertir', 'Mesurer, couper, chauffer', 'Percer, assembler, contrôler'], 0, 'Capteur, microcontrôleur, sortie.'],
            ['Quelles sont les fonctions de la chaîne d’énergie ?', ['Alimenter, distribuer, convertir, transmettre', 'Acquérir, traiter, communiquer', 'Tracer, découper, assembler', 'Voir, décider, agir'], 0, 'De la pile jusqu’aux engrenages.'],
            ['Quel élément décide selon le programme ?', ['La carte programmable', 'Le capteur', 'L’actionneur', 'La pile'], 0, 'C’est le microcontrôleur.'],
            ['Pourquoi distingue-t-on les deux chaînes ?', ['Pour localiser une panne : information ou énergie', 'Par tradition', 'Pour réduire le prix', 'Pour accélérer la fabrication'], 0, 'Cela divise le problème en deux.'],
            ['Un moteur est un capteur.', ['Vrai', 'Faux'], 1, 'C’est un actionneur : il transforme l’énergie en mouvement.'],
          ],
        },
        {
          titre: 'Programmer un objet technique',
          axe: 'Objets programmables et information',
          lecon: {
            titre: 'Donner des instructions à une carte',
            cours: `## Le programme
Un **programme** est une suite d’**instructions** que la carte exécute dans l’ordre. Il est écrit par blocs (Scratch, mBlock) ou en texte (Python), puis **téléversé** dans la carte.

## Les briques de base
- L’**instruction** : une action simple — allumer, attendre, lire un capteur.
- La **boucle** : répéter sans réécrire — *répéter 10 fois*, *répéter indéfiniment*.
- La **condition** : *si … alors … sinon …* — c’est elle qui rend l’objet capable de **réagir**.
- La **variable** : une case mémoire nommée qui retient une valeur — un compteur, une mesure.

## Un exemple lisible
> **répéter indéfiniment**
>   **si** le capteur de présence est activé **alors** allumer la lampe ; attendre 30 secondes
>   **sinon** éteindre la lampe

Trois lignes, et l’objet devient automatique.

## L’organigramme
Avant de programmer, on dessine le **logigramme** : des rectangles pour les actions, des losanges pour les décisions, des flèches pour l’ordre. Il se lit sans connaître le langage — c’est ce qui permet d’en discuter à plusieurs.

## Tester et déboguer
Un programme fonctionne rarement du premier coup. On **teste**, on isole l’instruction fautive, on corrige. Un **bug** n’est pas un échec : c’est une étape normale.

> Une machine n’interprète pas : elle exécute exactement ce qui est écrit. Quand le résultat surprend, c’est presque toujours le programme qui a raison et l’intention qui était floue.

## Les objets connectés
Une carte peut envoyer ses mesures sur un réseau : c’est l’**objet connecté**. Utile — mais cela pose des questions de **sécurité** et de **données personnelles** : qui reçoit ces mesures, et pour en faire quoi ?`,
          },
          questions: [
            ['Qu’est-ce qu’un programme ?', ['Une suite d’instructions exécutées dans l’ordre', 'Un schéma de câblage', 'Un plan coté', 'Une liste de matériaux'], 0, 'Il est téléversé dans la carte.'],
            ['À quoi sert une boucle ?', ['À répéter des instructions sans les réécrire', 'À arrêter le programme', 'À poser une question', 'À stocker une valeur'], 0, '« Répéter indéfiniment ».'],
            ['Quelle instruction rend un objet capable de réagir ?', ['La condition « si … alors … sinon »', 'La boucle', 'La variable', 'L’instruction simple'], 0, 'Elle fait dépendre l’action d’un capteur.'],
            ['Qu’est-ce qu’une variable ?', ['Une case mémoire nommée qui retient une valeur', 'Une instruction de répétition', 'Un capteur', 'Un actionneur'], 0, 'Un compteur, une mesure.'],
            ['Qu’est-ce qu’un logigramme ?', ['Un schéma des actions et des décisions du programme', 'Le plan de la carte', 'La liste des composants', 'Le code source'], 0, 'Rectangles pour les actions, losanges pour les décisions.'],
            ['Que faire quand un programme ne fonctionne pas ?', ['Tester pas à pas et isoler l’instruction fautive', 'Tout réécrire', 'Changer de carte', 'Abandonner'], 0, 'Un bug est une étape normale.'],
            ['Quelle question pose un objet connecté ?', ['Qui reçoit les données, et pour en faire quoi', 'Combien il pèse', 'De quelle couleur il est', 'Où il est fabriqué'], 0, 'Sécurité et données personnelles.'],
            ['Une machine interprète l’intention du programmeur.', ['Vrai', 'Faux'], 1, 'Elle exécute exactement ce qui est écrit.'],
          ],
        },
        {
          titre: 'L’information et sa circulation',
          axe: 'Objets programmables et information',
          lecon: {
            titre: 'Comment les objets se parlent',
            cours: `## L’information numérique
Une machine ne comprend que deux états, notés **0** et **1** : c’est le **binaire**. Textes, images, sons et mesures sont d’abord **convertis** en suites de 0 et de 1, transmis, puis reconvertis à l’arrivée.

## Les unités
Le **bit** est l’unité de base ; l’**octet** vaut 8 bits. Puis **ko**, **Mo**, **Go**, **To**. Une photo de téléphone pèse quelques Mo, un film quelques Go.

## Les supports de transmission
- **Câble électrique** : l’information circule sous forme de courant.
- **Ondes** : wifi, Bluetooth, téléphonie — sans fil, dans l’air.
- **Fibre optique** : sous forme de **lumière**, dans un fil de verre. C’est le support le plus rapide et celui qui porte le plus de données.

## Le réseau
Un **réseau** relie des machines pour qu’elles échangent. **Internet** est le réseau des réseaux : les données y voyagent découpées en **paquets**, qui empruntent des chemins différents et sont réassemblés à l’arrivée.
Chaque machine y possède une **adresse IP**.

## Le stockage
Disque dur, mémoire flash, carte SD, serveur distant (le « cloud » — c’est-à-dire l’ordinateur de quelqu’un d’autre, dans un centre de données réel qui consomme de l’électricité).

> Le « nuage » n’a rien d’immatériel : c’est un bâtiment climatisé plein de machines, quelque part sur la planète.

## Sécurité et responsabilité
Un **mot de passe** solide, des **mises à jour**, de la prudence sur ce qu’on publie. Une donnée transmise peut être **copiée**, **conservée** et **rediffusée** sans qu’on le sache : ce qu’on met en ligne échappe vite à son auteur.`,
          },
          questions: [
            ['Quels sont les deux états du langage binaire ?', ['0 et 1', 'A et B', 'Oui et non', '+ et −'], 0, 'Toute information y est convertie.'],
            ['Combien de bits vaut un octet ?', ['8', '2', '10', '16'], 0, 'Puis viennent ko, Mo, Go, To.'],
            ['Quel support transporte l’information sous forme de lumière ?', ['La fibre optique', 'Le câble électrique', 'Les ondes wifi', 'Le Bluetooth'], 0, 'C’est le plus rapide.'],
            ['Comment les données voyagent-elles sur internet ?', ['Découpées en paquets qui empruntent des chemins différents', 'En un seul bloc continu', 'Toujours par le même câble', 'Sans être découpées'], 0, 'Elles sont réassemblées à l’arrivée.'],
            ['Qu’est-ce qu’une adresse IP ?', ['L’adresse d’une machine sur un réseau', 'Un mot de passe', 'Un type de câble', 'Une unité de mesure'], 0, 'Chaque machine connectée en possède une.'],
            ['Qu’est-ce que le « cloud » ?', ['Des serveurs distants dans un centre de données réel', 'Une mémoire dans les nuages', 'Un type de câble', 'Un logiciel'], 0, 'Un bâtiment climatisé qui consomme de l’électricité.'],
            ['Que devient une photo avant d’être transmise ?', ['Elle est convertie en une suite de 0 et de 1', 'Elle est imprimée', 'Elle est compressée en papier', 'Rien, elle circule telle quelle'], 0, 'Puis reconvertie à l’arrivée.'],
            ['Une donnée publiée en ligne reste sous le contrôle de son auteur.', ['Vrai', 'Faux'], 1, 'Elle peut être copiée, conservée et rediffusée à son insu.'],
          ],
        },
      ],
    },
  ],
}
