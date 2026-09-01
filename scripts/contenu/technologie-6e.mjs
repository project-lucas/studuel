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
            cours: `Un objet technique est fabriqué par l’humain pour répondre à un besoin. Un caillou n’en est pas un ; un marteau, si.

## Le besoin d’abord
!> On n’a **pas** inventé le vélo puis trouvé à quoi il servait. Le besoin — se déplacer — existait avant l’objet. **Le besoin précède toujours l’objet.**

## La fonction d’usage
= La fonction d’usage répond à : À QUOI ÇA SERT ?

Elle s’écrit avec un **verbe à l’infinitif** suivi d’un complément.

| L’objet | Sa fonction d’usage |
| Un parapluie | **Protéger de la pluie** |
| Une lampe | **Éclairer un espace** |
| Un vélo | **Se déplacer** |

## La fonction d’estime
C’est ce qui fait **préférer** un objet à un autre alors qu’ils rendent le même service : la couleur, la forme, la marque, le prix.

> La fonction d’usage explique pourquoi l’objet **existe**. La fonction d’estime explique pourquoi on achète **celui-là**.

## Le cahier des charges
La liste des **contraintes** que l’objet devra respecter.

| La contrainte | Exemple |
| Dimensions, poids | |
| Prix | |
| Sécurité | |
| Matériaux, durée de vie | |
| Impact sur l’environnement | |

!> Le cahier des charges dit **ce que l’objet doit faire**, jamais **comment** le faire. C’est un contrat, pas une notice.

## L’utilisateur
~ Une cuillère pour un adulte → pour un bébé → pour une personne qui n’a qu’une main valide

Un même besoin appelle des objets différents selon **qui** s’en sert.

> Concevoir, c’est d’abord regarder l’utilisateur.`,
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
            cours: `La fonction d’usage dit à quoi l’objet sert. Les fonctions techniques disent comment il y parvient.

## De l’usage à la technique
Un vélo sert à **se déplacer**. Pour cela, il doit :

| La fonction technique | Les organes qui l’assurent |
| **Transmettre** le mouvement | Pédalier, chaîne, roue |
| **Diriger** | Guidon, fourche |
| **Freiner** | Leviers, patins |
| **Soutenir** l’utilisateur | Cadre, selle |

## Les solutions techniques
Pour chaque fonction technique, plusieurs **solutions** sont possibles.

| La fonction | Les solutions possibles |
| **Freiner** | Patins sur la jante · frein à disque · rétropédalage |
| **Transmettre** | Chaîne · courroie · cardan |

Le concepteur choisit selon le **cahier des charges** : coût, poids, entretien, sécurité.

!> Une fonction technique est un **problème** à résoudre ; une solution technique est **une** réponse parmi d’autres. Il n’y a jamais une seule bonne solution.

## Le diagramme
~ La fonction d’usage → les fonctions techniques → les solutions retenues

On le représente en arbre, de haut en bas.

## Les composants
Chaque solution se réalise par des **composants** : un ressort, un engrenage, une vis, un moteur, un interrupteur. Un même composant peut servir plusieurs fonctions.

## Faire des choix
| Le critère de comparaison | |
| Prix | Masse |
| Résistance | Facilité de **réparation** |
| Impact environnemental | |

> Un tableau de comparaison rend le choix **explicite** au lieu de le laisser à l’intuition.`,
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
            cours: `Un objet technique n’apparaît pas d’un coup : il évolue. Et ce qui évolue, ce n’est presque jamais sa fonction d’usage.

## Ce qui pousse l’évolution
| Le moteur | Ce qu’il apporte |
| Les **progrès techniques** | Nouveaux matériaux, nouvelles énergies, électronique |
| Les **besoins** qui changent | Aller plus vite, plus loin, plus confortablement |
| La **société** | Lois de sécurité, normes, préoccupations environnementales |
| L’**économie** | Produire moins cher, en plus grande quantité |

## Un exemple : l’éclairage
~ Feu → bougie → lampe à huile → bec de gaz → lampe à incandescence → fluocompacte → LED

À chaque étape : **plus de lumière**, **moins d’énergie**, **moins de danger**.

= La LED consomme environ dix fois moins que l’ampoule à filament, pour le même éclairage

## Ce qui reste, ce qui change
| Ce qui reste | Ce qui change |
| La **fonction d’usage** — éclairer, se déplacer, conserver | Les **solutions techniques** |

> On n’a jamais cessé d’avoir besoin de lumière. On a cessé d’utiliser le feu pour l’obtenir.

## Familles et lignées
| Le mot | Ce qu’il regroupe |
| Une **famille** | Les objets qui remplissent la **même fonction d’usage** à une même époque |
| Une **lignée** | Un objet suivi **à travers le temps** |

## Le progrès n’est pas automatique
!> Un objet plus récent **n’est pas meilleur sur tous les critères** : il peut être plus difficile à réparer, plus coûteux à produire, ou dépendant de matériaux rares.

C’est pour cela que l’**analyse du cycle de vie** — extraction, fabrication, usage, fin de vie — est devenue un critère de conception.`,
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
            cours: `On ne choisit pas un matériau parce qu’il est « meilleur ». On le choisit parce que ses propriétés correspondent aux contraintes.

## Les grandes familles
| La famille | Ses qualités | Sa limite |
| Les **métaux** — fer, acier, aluminium, cuivre | Résistants, conducteurs, **recyclables à l’infini** | Souvent lourds |
| Les **plastiques** | Légers, faciles à mouler, isolants, peu chers | Issus du **pétrole**, longs à se dégrader |
| Les **céramiques et verres** | Durs, résistants à la chaleur | **Fragiles** : ils cassent net |
| Les **matériaux organiques** — bois, papier, cuir | **Renouvelables** | |
| Les **composites** — béton armé, fibre de carbone, contreplaqué | Ils cumulent les qualités de plusieurs matériaux | Difficiles à recycler |

## Les propriétés qu’on mesure
| La propriété | Ce qu’elle dit |
| La **dureté** | Il résiste à la rayure |
| L’**élasticité** | Il reprend sa forme |
| La **résistance** | Il supporte un effort sans casser |
| La **masse volumique** | Léger ou lourd à volume égal |
| La **conductivité** | Électrique et thermique |
| La résistance à la **corrosion** | À l’eau, à la chaleur |

## Le choix, en pratique
~ Une casserole : métal pour le corps (il CONDUIT la chaleur) → plastique pour le manche (il ISOLE)

> Deux matériaux dans un même objet, chacun pour une raison précise et opposée.

## L’origine et le coût
!> L’**aluminium** est très recyclable, mais sa production **initiale** consomme énormément d’électricité. Un matériau recyclable n’est pas pour autant un matériau bon marché à produire.

## Le recyclage
| Le matériau | Son recyclage |
| Le **verre**, les **métaux** | Presque **indéfiniment** |
| Le **plastique** | Il se **dégrade à chaque cycle** et finit par sortir de la boucle |`,
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
            cours: `Avant de vouloir réduire un impact, il faut savoir où il se trouve. Sinon on optimise ce qui ne pèse rien.

## Le cycle de vie
~ Extraction → fabrication → transport → utilisation → fin de vie

| L’étape | Son coût |
| L’**extraction** | Des matières premières |
| La **fabrication** | Énergie, eau, rejets |
| Le **transport** | Souvent des milliers de kilomètres |
| L’**utilisation** | L’énergie consommée pendant des années |
| La **fin de vie** | Réemploi, recyclage, incinération ou décharge |

## Où se joue l’impact
| L’objet | L’étape qui domine | Le geste utile |
| Un **smartphone** | La **fabrication** | Le garder **deux ans de plus** |
| Un **réfrigérateur** | L’**usage**, sur quinze ans | Choisir un bon rendement |

!> L’impact n’est pas toujours là où on le croit. Recharger « proprement » un smartphone pèse bien moins que retarder son remplacement.

## Les leviers, dans l’ordre d’efficacité
1. **Ne pas produire** l’objet : s’en passer, le partager, le louer ;
2. **allonger sa durée de vie** : entretenir, réparer, revendre ;
3. **réemployer** : une seconde vie sans transformation ;
4. **recycler** : refaire de la matière — utile, mais coûteux en énergie ;
5. **valoriser** : incinérer en récupérant la chaleur, en dernier recours.

> L’ordre compte autant que la liste : recycler est le **quatrième** levier, pas le premier.

## L’obsolescence
Un objet peut cesser d’être utilisé **alors qu’il fonctionne** : pièces indisponibles, logiciel qui ne se met plus à jour, mode.

@ 2021 — L’indice de réparabilité devient obligatoire en France

## L’écoconception
| Le principe | Ce qu’il donne |
| Moins de **matière** | |
| Des matériaux **recyclables** | |
| Un assemblage **démontable** | Vis plutôt que colle |
| Des **pièces détachées** disponibles | |`,
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
            cours: `Un objet ne se fabrique pas à partir d’une description orale. Il lui faut un dessin que tout le monde lise de la même façon.

## Les trois niveaux
| Le dessin | Ce qu’il montre | Sa précision |
| Le **croquis** | Une **idée** | À main levée, sans échelle exacte |
| Le **schéma** | Le **fonctionnement** ou les liaisons | Simplifié, avec des **symboles normalisés** |
| Le **plan** (dessin technique) | Comment **fabriquer** | À l’**échelle**, coté |

!> Le **schéma ne ressemble pas à l’objet**. Il montre comment ça marche, pas à quoi ça ressemble.

> Le croquis dit « voilà l’idée », le schéma dit « voilà comment ça marche », le plan dit « voilà comment le faire ».

## L’échelle
| L’échelle | Ce qu’elle signifie |
| **1:1** | Taille réelle |
| **1:10** | Le dessin est **10 fois plus petit** |
| **10:1** | Le dessin est **10 fois plus grand** — pour une petite pièce |

## Les vues
~ Vue de face → vue de dessus → vue de gauche

Ensemble, ces trois vues planes décrivent l’objet **sans ambiguïté**.

!> La **perspective** donne une idée du volume, mais **ne permet pas de mesurer**. Ce n’est pas un dessin de fabrication.

## Les cotes
Les **cotes** indiquent les dimensions **réelles**, en **millimètres**, quelle que soit l’échelle du dessin.

> On ne mesure jamais sur le papier : on **lit la cote**.

## Les outils numériques
La **conception assistée par ordinateur** (CAO) permet de dessiner en 3D, de tester avant de fabriquer, et d’envoyer le fichier directement à une imprimante 3D ou à une découpeuse.`,
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
            cours: `La gamme de fabrication est la suite ordonnée des opérations. Sans elle, chacun s’y prend autrement et les pièces ne s’assemblent pas.

## Les grandes opérations
~ Mesurer et tracer → découper → percer, usiner, poncer → assembler → contrôler → finir

| L’opération | Les outils |
| **Mesurer et tracer** | Reporter les cotes du plan sur la matière |
| **Découper** | Scie, cisaille, découpeuse laser |
| **Contrôler** | Vérifier que la pièce est conforme au plan |
| **Finir** | Peinture, vernis, protection |

## Les assemblages
| Le type | Ses moyens | Sa conséquence |
| **Démontable** | Vis, boulons, clips | On peut **réparer** et recycler |
| **Permanent** | Colle, soudure, rivet | Plus solide, mais **difficile à réparer** |

!> Choisir la colle plutôt que la vis, c’est décider **à la conception** que l’objet ne sera jamais réparé. Ce n’est pas un détail technique : c’est un choix de durée de vie.

## Le contrôle qualité
| On vérifie | Avec quoi |
| Les **dimensions** | Pied à coulisse, gabarit |
| L’**aspect** | À l’œil |
| Le **fonctionnement** | En essai |

= La tolérance : l’écart acceptable autour de la cote

Une pièce hors tolérance est **refusée**.

## La sécurité
!> Lunettes, gants, cheveux attachés, machine **arrêtée avant tout réglage**, un seul opérateur à la fois. Les consignes ne sont pas des formalités : les machines de l’atelier coupent, percent et chauffent.

## Prototype et série
| L’étape | Son rôle |
| Le **prototype** | Le premier exemplaire : il sert à **tester et corriger** |
| La **série** | Des outillages rendent chaque pièce **identique** |`,
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
            cours: `Le capteur est l’oreille, le microcontrôleur le cerveau, l’actionneur le muscle. Ces trois mots suffisent à lire n’importe quel objet.

## Deux chaînes en parallèle
| La chaîne | Ce qu’elle fait |
| D’**information** | Elle **acquiert**, **traite** et **communique** |
| D’**énergie** | Elle **alimente**, **distribue**, **convertit** et **transmet** |

## La chaîne d’information
| L’étape | Le composant | Son rôle |
| **Acquérir** | Le **capteur** | Il transforme une grandeur physique en signal : température, lumière, présence, bouton-poussoir |
| **Traiter** | La **carte programmable** (microcontrôleur) | Elle décide, selon le programme |
| **Communiquer** | Écran, LED, haut-parleur | Le résultat part vers la chaîne d’énergie ou vers l’utilisateur |

## La chaîne d’énergie
| L’étape | Le composant | Son rôle |
| **Alimenter** | Pile, secteur, batterie, panneau solaire | Fournir l’énergie |
| **Distribuer** | Interrupteur, relais | Laisser passer ou non |
| **Convertir** | L’**actionneur** | Moteur (mouvement), lampe (lumière), résistance (chaleur), buzzer (son) |
| **Transmettre** | Engrenages, courroies, roues | Porter l’action jusqu’au bout |

## Un exemple complet
~ Capteur de présence → carte programmable → relais → lampe

Information à gauche, énergie à droite, et le programme au milieu qui décide.

## Pourquoi les séparer
!> Les pannes ne se cherchent pas au même endroit. Si la lampe ne s’allume pas : soit le **capteur** n’a rien vu (information), soit l’**alimentation** est coupée (énergie).

> Distinguer les deux chaînes, c’est diviser le problème en deux.`,
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
            cours: `Une machine n’interprète pas : elle exécute exactement ce qui est écrit.

## Le programme
Une suite d’**instructions** que la carte exécute **dans l’ordre**. Il s’écrit par blocs (Scratch, mBlock) ou en texte (Python), puis se **téléverse** dans la carte.

## Les briques de base
| La brique | Ce qu’elle fait |
| L’**instruction** | Une action simple : allumer, attendre, lire un capteur |
| La **boucle** | Répéter sans réécrire : *répéter 10 fois*, *répéter indéfiniment* |
| La **condition** | *si … alors … sinon …* — c’est elle qui rend l’objet capable de **réagir** |
| La **variable** | Une case mémoire nommée : un compteur, une mesure |

## Un exemple lisible
= répéter indéfiniment : si le capteur de présence est activé, alors allumer la lampe et attendre 30 s ; sinon éteindre

> Trois lignes, et l’objet devient automatique.

## L’organigramme
| Le symbole | Ce qu’il représente |
| Le **rectangle** | Une action |
| Le **losange** | Une décision |
| La **flèche** | L’ordre d’exécution |

> Le **logigramme** se lit sans connaître le langage : c’est ce qui permet d’en discuter à plusieurs, avant d’écrire une ligne.

## Tester et déboguer
~ Tester → isoler l’instruction fautive → corriger → retester

!> Un **bug** n’est pas un échec : c’est une étape normale. Quand le résultat surprend, c’est presque toujours le **programme qui a raison** et l’**intention** qui était floue.

## Les objets connectés
Une carte peut envoyer ses mesures sur un réseau : c’est l’**objet connecté**.

!> Cela pose des questions de **sécurité** et de **données personnelles** : qui reçoit ces mesures, et pour en faire quoi ?`,
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
            cours: `Le « nuage » n’a rien d’immatériel : c’est un bâtiment climatisé plein de machines, quelque part sur la planète.

## L’information numérique
= Le binaire : deux états seulement, 0 et 1

~ Textes, images, sons, mesures → convertis en 0 et 1 → transmis → reconvertis à l’arrivée

## Les unités
| L’unité | Sa valeur |
| Le **bit** | L’unité de base |
| L’**octet** | **8 bits** |
| **ko**, **Mo**, **Go**, **To** | Les multiples |

Une photo de téléphone pèse quelques **Mo**, un film quelques **Go**.

## Les supports de transmission
| Le support | Sous quelle forme |
| Le **câble électrique** | Un **courant** |
| Les **ondes** — wifi, Bluetooth, téléphonie | Sans fil, dans l’air |
| La **fibre optique** | De la **lumière**, dans un fil de verre |

> La fibre est le support le plus rapide, et celui qui porte le plus de données.

## Le réseau
Un **réseau** relie des machines pour qu’elles échangent. **Internet** est le réseau des réseaux.

~ Les données sont découpées en PAQUETS → chaque paquet emprunte son propre chemin → ils sont réassemblés à l’arrivée

Chaque machine y possède une **adresse IP**.

## Le stockage
Disque dur, mémoire flash, carte SD, ou **serveur distant** — le « cloud ».

!> Le « cloud », c’est l’**ordinateur de quelqu’un d’autre**, dans un centre de données bien réel, qui consomme de l’électricité.

## Sécurité et responsabilité
~ Un mot de passe solide → des mises à jour → de la prudence sur ce qu’on publie

!> Une donnée transmise peut être **copiée**, **conservée** et **rediffusée** sans qu’on le sache. Ce qu’on met en ligne **échappe vite à son auteur**.`,
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
