// EMC — Sixième : LE PROGRAMME DU CYCLE 3 (8 fiches).
//
// LE DÉFAUT. L'EMC de 6e n'avait que TROIS chapitres — « Le respect d'autrui »,
// « Les symboles de la République », « Droits et devoirs de l'élève » — soit
// trois fiches pour une année. Le lycée a reçu ses programmes (230, 277, 284) ;
// le collège est resté aux seeds d'origine.
//
// ⚠️ POURQUOI LA 6e A SON MODULE, SÉPARÉ DU CYCLE 4. Le programme d'EMC est
// écrit par cycle, et la 6e appartient au CYCLE 3. Les mêmes notions y sont
// abordées — le respect, la règle, la République — mais à partir de l'expérience
// immédiate de l'élève : la classe, la cour, le collège. Le cycle 4 (module
// `emc-cycle4`) les reprend au niveau du droit, des institutions et du débat.
//
// CE QUE L'ÉLÈVE DOIT VOIR — les 3 chapitres du programme et leurs 8 fiches :
//   1. Respecter autrui                          (3)
//   2. Les valeurs et symboles de la République   (3)
//   3. Construire une culture civique             (2)
//
// ⚠️ Ne JAMAIS générer avec `--slugs emc` : le slug porte plusieurs modules
// (Tle = 230, 1re = 277, 2de = 284, celui-ci = 6e, et `emc-cycle4`).
// Toujours `--modules emc-6e`.

export default {
  slug: 'emc',
  nom: 'EMC',

  titreMigration: 'EMC 6e — LE PROGRAMME DU CYCLE 3 (8 fiches)',

  motif: `CONSTAT : l'EMC de 6e n'avait que TROIS chapitres hérités du premier jeu de
données, pour une année entière. Le lycée a reçu ses programmes (230, 277, 284),
le collège est resté aux seeds d'origine. Un élève qui révisait le harcèlement,
la laïcité, la devise de la République, la différence entre règle et loi ou
l'engagement ne trouvait presque RIEN.
Cette migration installe 8 fiches sous les 3 chapitres du programme et retire les
3 chapitres génériques.
ÉCRITE POUR LE CYCLE 3, séparément du cycle 4 : le programme d'EMC est rédigé par
cycle, et la 6e aborde les mêmes notions à partir de l'expérience immédiate de
l'élève — la classe, la cour, le collège — là où le cycle 4 les reprend au niveau
du droit et des institutions.
PÉRIMÈTRE : la SIXIÈME SEULE — le ménage est borné à level = '6e'.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) porte le chapitre du programme, et
l'INSERT l'écrit pour les 8 fiches. Elle est REPRISE ici en ADD COLUMN IF NOT
EXISTS parce qu'on ne peut pas garantir que la 234 soit passée en production.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters et ne l'a rendu que colonne par colonne.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 3 chapitres hérités partent, au niveau 6e SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE — et il compte ici : la fiche neuve
« Le respect d'autrui, et les différences » est proche du chapitre hérité « Le
respect d'autrui », et chapters impose UNIQUE(subject_id, level, title). Le
critère « pas de chapitre de programme » vise exactement les trois lignes
voulues ; les 8 fiches neuves portent un thème dès l'INSERT, et le ménage tourne
AVANT elles.
Le filtre level = '6e' est indispensable : l'EMC existe sur sept niveaux, dont
trois ont déjà leur module au lycée.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'emc'
   AND c.level = '6e'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'emc'
   AND c.level = '6e'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'emc'
   AND c.level = '6e'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['6e'],
      chapitres: [
        // --- Chapitre 1 : Respecter autrui ---
        {
          titre: 'Le respect d’autrui, et les différences',
          axe: 'Respecter autrui',
          lecon: {
            titre: 'Vivre ensemble sans se ressembler',
            cours: `Respecter quelqu’un, ce n’est pas être d’accord avec lui. C’est refuser de le rabaisser.

## Ce qu’est le respect
Reconnaître qu’une personne a la **même valeur** que soi, même si elle ne pense pas, ne croit pas, ne vit pas comme soi.

## La dignité
= La dignité ne se mérite pas et ne se perd pas

Elle ne dépend ni des notes, ni de l’argent, ni de l’apparence, ni de l’origine.

> C’est le fondement de **tous** les droits : si la dignité se méritait, les droits se retireraient.

## Les différences
Origine, religion ou absence de religion, famille, santé, handicap, goûts : ces différences sont **normales**.

!> Un groupe où tout le monde serait identique **n’existe pas**. La question n’est donc jamais « faut-il des différences ? », mais « comment vit-on avec ? ».

## Le préjugé et le stéréotype
| Le mot | Ce qu’il est | Exemple |
| Le **stéréotype** | Une idée toute faite sur un **groupe** | « Les filles sont… », « les garçons sont… » |
| Le **préjugé** | Un jugement porté **avant** de connaître | |

Tous deux se répandent **sans preuve**, et font mal parce qu’ils traitent une personne comme un **exemplaire de son groupe**.

> On ne choisit pas d’avoir des préjugés : on les reçoit. Mais on peut choisir de les **vérifier** avant d’agir dessus.

## La discrimination
= Traiter quelqu’un moins bien à cause de son origine, son sexe, sa religion, son handicap ou son apparence

!> Ce n’est pas seulement impoli : c’est **interdit par la loi**. C’est un **délit**.

## Le respect en actes
~ Écouter sans couper → ne pas se moquer → ne pas surnommer sans accord → s’excuser quand on a blessé

> Le respect n’est pas une intention : c’est une suite de gestes qui **se voient**.`,
          },
          questions: [
            ['Que signifie respecter quelqu’un ?', ['Reconnaître qu’il a la même valeur que soi', 'Être d’accord avec lui', 'Lui obéir', 'L’éviter'], 0, 'Ce n’est pas être d’accord, c’est refuser de rabaisser.'],
            ['Qu’est-ce que la dignité ?', ['Une valeur que chaque personne possède sans avoir à la mériter', 'Une récompense', 'Un droit qu’on obtient à 18 ans', 'Un titre honorifique'], 0, 'Elle ne se perd pas.'],
            ['Qu’est-ce qu’un stéréotype ?', ['Une idée toute faite sur un groupe', 'Une insulte', 'Une loi', 'Une preuve'], 0, '« Les filles sont… », « les garçons sont… ».'],
            ['Qu’est-ce qu’un préjugé ?', ['Un jugement porté avant de connaître', 'Un jugement de tribunal', 'Une opinion vérifiée', 'Une règle de classe'], 0, 'Il se répand sans preuve.'],
            ['Qu’est-ce qu’une discrimination ?', ['Traiter quelqu’un moins bien en raison de ce qu’il est', 'Ne pas aimer quelqu’un', 'Être en désaccord', 'Préférer un ami à un autre'], 0, 'C’est interdit par la loi.'],
            ['La discrimination est-elle seulement impolie ?', ['Non, c’est un délit puni par la loi', 'Oui, c’est un simple manque de savoir-vivre', 'Non, c’est autorisé', 'Cela dépend des cas'], 0, 'La loi la sanctionne.'],
            ['Comment le respect se manifeste-t-il ?', ['Par des gestes concrets : écouter, ne pas se moquer, s’excuser', 'Par de bonnes intentions', 'En se taisant toujours', 'En évitant les autres'], 0, 'Il se voit, il ne se déclare pas.'],
            ['Les différences entre élèves d’une classe sont un problème.', ['Vrai', 'Faux'], 1, 'Elles sont normales : un groupe identique n’existe pas.'],
          ],
        },
        {
          titre: 'Le harcèlement : reconnaître et agir',
          axe: 'Respecter autrui',
          lecon: {
            titre: 'Ce n’est jamais « juste pour rire »',
            cours: `Le harcèlement s’effondre presque toujours quand les témoins cessent d’être un public.

## La définition
Une violence **répétée**, exercée contre quelqu’un qui ne peut pas se défendre. Trois éléments le caractérisent :

1. la **répétition** ;
2. l’**intention** de nuire ;
3. le **déséquilibre** de force — en nombre, en popularité, en âge.

!> Une dispute entre **deux élèves à égalité** n’est pas du harcèlement. Une moquerie répétée par un **groupe** contre une même personne, si. Les trois critères comptent ensemble.

## Les formes
| La forme | Exemples |
| **Verbale** | Moqueries, insultes, surnoms |
| **Sociale** | Mise à l’écart, rumeurs |
| **Matérielle** | Vol ou dégradation d’affaires |
| **Physique** | Coups, bousculades |
| **Cyber** | Messages, photos, comptes créés pour nuire |

## Pourquoi le cyberharcèlement est pire
| Ce qui change | Sa conséquence |
| Il ne s’arrête pas à la grille | Il suit la victime **chez elle**, **la nuit** |
| Les traces restent | Elles se **rediffusent** indéfiniment |
| L’écran | Le harceleur se croit protégé — alors qu’une **adresse IP s’identifie** |

## Les trois rôles
| Le rôle | Ce qu’il faut savoir |
| La **victime** | Elle ne « l’a pas cherché ». **Personne ne mérite d’être harcelé** |
| Les **harceleurs** | |
| Les **témoins** | Ce sont eux qui font tout basculer |

!> Un groupe qui rit **encourage** ; un groupe qui refuse **arrête**. Ne rien faire, c’est **déjà choisir un camp**.

## Que faire
~ En parler à un adulte → conserver les preuves (captures d’écran) → ne pas répondre aux provocations → bloquer

!> **Signaler n’est pas rapporter.** Rapporter, c’est nuire à quelqu’un ; **signaler, c’est protéger**.

## Les numéros
| Le numéro | Pour quoi |
| **3018** | Harcèlement et cyberharcèlement — gratuit et anonyme |
| **119** | Enfance en danger |

@ 2022 — Le harcèlement scolaire devient un délit puni par la loi, y compris pour les mineurs`,
          },
          questions: [
            ['Quels sont les trois éléments du harcèlement ?', ['La répétition, l’intention de nuire, le déséquilibre de force', 'La colère, le bruit, la peur', 'L’âge, le sexe, l’origine', 'Une seule insulte suffit'], 0, 'Une dispute à égalité n’est pas du harcèlement.'],
            ['Pourquoi le cyberharcèlement est-il particulièrement grave ?', ['Il suit la victime chez elle et les traces se rediffusent', 'Il est moins visible', 'Il ne concerne que les adultes', 'Il s’arrête vite'], 0, 'Il ne s’arrête pas à la grille du collège.'],
            ['Quel rôle est décisif pour arrêter le harcèlement ?', ['Les témoins', 'La victime seule', 'Les harceleurs', 'Personne'], 0, 'Un groupe qui rit encourage, un groupe qui refuse arrête.'],
            ['Quelle est la différence entre rapporter et signaler ?', ['Rapporter nuit à quelqu’un, signaler protège quelqu’un', 'Aucune', 'Signaler est interdit', 'Rapporter est plus courageux'], 0, 'En parler n’est pas trahir.'],
            ['Quel numéro appeler en cas de harcèlement ?', ['Le 3018', 'Le 15', 'Le 17', 'Le 112'], 0, 'Gratuit et anonyme. Le 119 concerne l’enfance en danger.'],
            ['Que faut-il faire des messages de cyberharcèlement ?', ['Conserver les preuves par captures d’écran', 'Les supprimer aussitôt', 'Répondre pour se défendre', 'Les partager largement'], 0, 'Et bloquer sans répondre aux provocations.'],
            ['Depuis quand le harcèlement scolaire est-il un délit ?', ['Depuis 2022', 'Depuis 1990', 'Il ne l’est pas', 'Depuis 2005'], 0, 'Y compris pour les mineurs, avec des peines adaptées.'],
            ['Une victime de harcèlement a forcément fait quelque chose pour le provoquer.', ['Vrai', 'Faux'], 1, 'Personne ne mérite d’être harcelé.'],
          ],
        },
        {
          titre: 'L’égalité entre les filles et les garçons',
          axe: 'Respecter autrui',
          lecon: {
            titre: 'Le même droit, et la même liberté de choisir',
            cours: `Un droit inscrit dans la loi n’est pas encore une réalité dans les faits. C’est justement pour cela qu’on continue d’en parler.

## Le principe
Filles et garçons ont **les mêmes droits** : même école, mêmes matières, mêmes métiers possibles, même liberté de choisir. C’est inscrit dans la **Constitution** et dans la loi.

## Ce qui gêne encore
| L’obstacle | Comment il agit |
| Les **stéréotypes** | « Les maths, c’est pour les garçons », « le soin, c’est pour les filles » : rien ne les fonde, et ils orientent pourtant des choix d’études à 15 ans |
| Le partage de l’**espace** | Dans une cour de récréation, le terrain central est le plus souvent occupé par des garçons |
| Les **remarques** sur l’apparence | Plus fréquentes envers les filles |

## Dans le monde du travail
@ 1972 — La loi impose l’égalité salariale en France

!> Elle **n’est toujours pas atteinte** : à travail comparable, les femmes gagnent encore moins, et les postes de direction leur sont moins ouverts.

## Le sexisme
= Traiter quelqu’un moins bien, ou le juger, à cause de son sexe

Blagues rabaissantes, remarques sur le corps, insultes genrées.

> Ce ne sont pas des maladresses : ce sont des **atteintes**.

## Le consentement et le respect du corps
!> Personne n’a le droit de toucher quelqu’un **sans son accord**. Le **consentement** est libre, clair, et peut être **retiré à tout moment** — à tout âge et dans toutes les situations.

## Agir
~ Ne pas rire d’une blague sexiste → ne pas relayer une image → dire quand ce n’est pas normal → en parler à un adulte`,
          },
          questions: [
            ['Que garantit la loi entre filles et garçons ?', ['Les mêmes droits et la même liberté de choisir', 'Des matières différentes', 'Des métiers séparés', 'Rien de particulier'], 0, 'C’est inscrit dans la Constitution.'],
            ['Qu’est-ce qu’un stéréotype de genre ?', ['Une idée toute faite sur ce que feraient « les filles » ou « les garçons »', 'Une loi', 'Un métier', 'Une matière scolaire'], 0, 'Rien ne le fonde, et il oriente pourtant des choix d’études.'],
            ['Depuis quand la loi impose-t-elle l’égalité salariale en France ?', ['Depuis 1972', 'Depuis 2020', 'Depuis 1945', 'Elle ne l’impose pas'], 0, 'Elle n’est toujours pas atteinte dans les faits.'],
            ['Qu’est-ce que le sexisme ?', ['Traiter ou juger quelqu’un moins bien à cause de son sexe', 'Une opinion politique', 'Une préférence personnelle', 'Une règle scolaire'], 0, 'Blagues rabaissantes, remarques sur le corps, insultes genrées.'],
            ['Qu’est-ce que le consentement ?', ['Un accord libre et clair, qui peut être retiré à tout moment', 'Une autorisation définitive', 'Un contrat écrit', 'Une règle de politesse'], 0, 'Personne n’a le droit de toucher sans accord.'],
            ['Comment se manifeste l’inégalité dans une cour de récréation ?', ['Le terrain central est le plus souvent occupé par des garçons', 'Les filles arrivent en retard', 'Les garçons parlent moins', 'Il n’y a aucune différence'], 0, 'Le partage de l’espace est un indicateur.'],
            ['Que faire face à une blague sexiste ?', ['Ne pas en rire, dire que ce n’est pas normal, en parler', 'Rire pour ne pas faire d’histoires', 'La répéter', 'L’ignorer toujours'], 0, 'Le silence des témoins la valide.'],
            ['L’égalité entre les sexes est atteinte en France puisqu’elle est dans la loi.', ['Vrai', 'Faux'], 1, 'Un droit inscrit n’est pas encore une réalité dans les faits.'],
          ],
        },

        // --- Chapitre 2 : Les valeurs et symboles de la République ---
        {
          titre: 'Les symboles de la République française',
          axe: 'Les valeurs et symboles de la République',
          lecon: {
            titre: 'Ce qui représente la France',
            cours: `Un symbole n’est pas une décoration : c’est un raccourci qui rappelle une histoire commune.

## Le drapeau tricolore
| La couleur | Son origine |
| Le **bleu** et le **rouge** | Les couleurs de **Paris** |
| Le **blanc** | La couleur du **roi** |

@ 1790 — Naissance du drapeau tricolore, qui réunit la ville et la monarchie

Il flotte sur les bâtiments publics.

## La Marseillaise
@ 1792 — Rouget de Lisle l’écrit à Strasbourg, comme chant de guerre
@ 1879 — Elle devient hymne national

Elle doit son nom aux **fédérés marseillais** qui la chantaient en montant à Paris.

## Marianne
Une figure de femme coiffée du **bonnet phrygien**, porté par les **esclaves affranchis** de Rome : elle représente la **liberté** et la République.

> On la trouve dans toutes les mairies et sur les timbres.

## La devise
= Liberté, Égalité, Fraternité

Apparue pendant la Révolution, officielle sous la Troisième République. Elle est gravée au fronton des mairies et des écoles.

## Le 14 Juillet
@ 1880 — Le 14 Juillet devient fête nationale

!> Il commémore **deux** événements : la prise de la **Bastille** (1789) **et** la **Fête de la Fédération** (1790), qui célébrait l’unité de la Nation.

## Le coq gaulois
Un symbole plus ancien et **non officiel**, né d’un jeu de mots latin : *gallus* signifie à la fois « coq » et « gaulois ». On le voit surtout dans le sport.

## À quoi ça sert
> Les symboles disent qu’au-delà des différences, les citoyens appartiennent à une **même communauté politique**. Ils sont visibles partout précisément pour être un rappel quotidien.`,
          },
          questions: [
            ['Quelles sont les couleurs du drapeau français, et d’où viennent-elles ?', ['Bleu et rouge de Paris, blanc du roi', 'Trois couleurs choisies au hasard', 'Les couleurs de la Révolution américaine', 'Les couleurs de la Bastille'], 0, 'Le drapeau naît en 1790.'],
            ['Qui a écrit la Marseillaise, et en quelle année ?', ['Rouget de Lisle, en 1792', 'Victor Hugo, en 1848', 'Napoléon, en 1804', 'Jules Ferry, en 1881'], 0, 'Elle devient hymne national en 1879.'],
            ['Que porte Marianne sur la tête ?', ['Le bonnet phrygien', 'Une couronne', 'Un casque', 'Un chapeau de paille'], 0, 'Porté par les esclaves affranchis de Rome, il symbolise la liberté.'],
            ['Quelle est la devise de la République française ?', ['Liberté, Égalité, Fraternité', 'Travail, Famille, Patrie', 'Unité, Force, Justice', 'Paix, Ordre, Progrès'], 0, 'Elle est gravée au fronton des mairies et des écoles.'],
            ['Depuis quand le 14 Juillet est-il la fête nationale ?', ['Depuis 1880', 'Depuis 1789', 'Depuis 1848', 'Depuis 1958'], 0, 'Il commémore la Bastille et la Fête de la Fédération.'],
            ['D’où vient le symbole du coq gaulois ?', ['D’un jeu de mots latin : gallus signifie coq et gaulois', 'D’une loi de 1880', 'Du drapeau', 'D’un roi'], 0, 'C’est un symbole non officiel.'],
            ['À quoi servent les symboles de la République ?', ['Rappeler que les citoyens appartiennent à une même communauté', 'Décorer les bâtiments', 'Distinguer les régions', 'Marquer les frontières'], 0, 'Ils sont visibles partout pour être un rappel quotidien.'],
            ['Marianne est un personnage historique ayant réellement existé.', ['Vrai', 'Faux'], 1, 'C’est une figure allégorique qui représente la République.'],
          ],
        },
        {
          titre: 'La devise : liberté, égalité, fraternité',
          axe: 'Les valeurs et symboles de la République',
          lecon: {
            titre: 'Trois mots, trois exigences',
            cours: `Liberté et égalité peuvent s’opposer. La fraternité est ce qui permet de tenir les deux ensemble.

## La liberté
Le droit de **penser, croire, s’exprimer, circuler, se réunir**.

= La liberté des uns s’arrête où commence celle des autres

!> On ne peut ni **insulter**, ni **menacer**, ni **diffamer**, ni **appeler à la haine** au nom de la liberté d’expression. Ces limites sont fixées par la loi.

## L’égalité
Tous les citoyens sont **égaux devant la loi** : mêmes droits, mêmes devoirs, même justice, quels que soient l’origine, la religion, le sexe, la fortune.

!> **Égalité ne veut pas dire identité** : les gens restent différents. Et elle ne veut pas dire égalité des **situations** — l’école gratuite existe justement parce que les familles ne sont pas également riches.

## L’équité
= Traiter également des personnes en situation inégale ne suffit pas

~ Un élève dyslexique reçoit du temps supplémentaire → ce n’est pas un privilège → c’est ce qui rétablit l’égalité RÉELLE

## La fraternité
Le lien qui fait qu’on se sent concerné par les autres : entraide, solidarité, refus de laisser quelqu’un de côté.

!> C’est la **seule des trois qui ne s’impose pas par la loi** — elle se pratique. Elle est pourtant inscrite dans le droit : la **non-assistance à personne en danger** est un délit.

## Pourquoi les trois ensemble
| Seule | Ce qu’elle produit |
| La **liberté** totale | Elle **creuse les écarts** |
| L’**égalité** absolue | Elle **supprime les choix** |
| La **fraternité** | Elle permet de tenir les deux ensemble |

## En classe
La liberté d’exprimer son avis, l’égalité de traitement entre élèves, l’entraide : la devise n’est pas un slogan lointain, elle se joue chaque jour dans un établissement.`,
          },
          questions: [
            ['Où s’arrête la liberté de chacun ?', ['Là où commence celle des autres', 'Nulle part', 'À la porte de l’école', 'Elle est illimitée'], 0, 'La loi fixe ces limites.'],
            ['Que signifie l’égalité devant la loi ?', ['Mêmes droits, mêmes devoirs et même justice pour tous', 'Tout le monde est identique', 'Tout le monde a le même revenu', 'Chacun fait ce qu’il veut'], 0, 'Quels que soient l’origine, la religion, le sexe ou la fortune.'],
            ['Qu’est-ce que l’équité ?', ['Adapter le traitement pour rétablir une égalité réelle', 'Traiter tout le monde exactement pareil', 'Donner un privilège', 'Supprimer les différences'], 0, 'Le tiers-temps d’un élève dyslexique en est un exemple.'],
            ['Qu’est-ce que la fraternité ?', ['Le lien de solidarité qui fait qu’on se sent concerné par les autres', 'Une obligation légale de s’aimer', 'Un lien de famille', 'Une association'], 0, 'Elle se pratique plus qu’elle ne s’impose.'],
            ['Quel délit rattache la fraternité au droit ?', ['La non-assistance à personne en danger', 'Le vol', 'La diffamation', 'L’excès de vitesse'], 0, 'Ne pas porter secours est puni.'],
            ['Peut-on tout dire au nom de la liberté d’expression ?', ['Non : insulte, menace, diffamation et appel à la haine sont interdits', 'Oui, toujours', 'Oui, sauf à l’école', 'Cela dépend de l’âge'], 0, 'La loi fixe des limites précises.'],
            ['Pourquoi l’école est-elle gratuite ?', ['Parce que les familles ne sont pas également riches', 'Pour occuper les enfants', 'Par tradition', 'Parce que c’est moins cher'], 0, 'C’est une application de l’égalité.'],
            ['Liberté et égalité vont toujours dans le même sens.', ['Vrai', 'Faux'], 1, 'Elles peuvent s’opposer : c’est la fraternité qui les tient ensemble.'],
          ],
        },
        {
          titre: 'La laïcité à l’école',
          axe: 'Les valeurs et symboles de la République',
          lecon: {
            titre: 'Un espace où chacun est libre de croire ou non',
            cours: `La laïcité ne demande à personne de renoncer à ce qu’il croit. Elle demande que l’État, lui, ne croie rien.

## Ce qu’elle garantit
| La garantie | Ce qu’elle veut dire |
| La **liberté de conscience** | Croire, ne pas croire, changer d’avis |
| La **séparation** | Entre l’État et les religions |
| L’**égalité** | De tous devant la loi, quelle que soit la croyance |

## Ce qu’elle n’est pas
!> Ce n’est **pas** l’interdiction des religions, ni une opinion contre elles. L’État ne se mêle pas des croyances : il ne les impose pas, ne les combat pas, **n’en finance aucune**.

> C’est parce qu’il ne croit rien qu’il peut accueillir tout le monde.

## La loi de 1905
@ 1905 — La séparation des Églises et de l’État

Elle met fin au financement public des cultes et garantit le libre exercice de chacun.

## À l’école publique
| Qui | Ce que la règle lui demande |
| Les **enseignants**, agents de l’État | Une **stricte neutralité** |
| Les **élèves** | Libres de croire, mais **pas de signes religieux ostensibles** |
| Les **programmes** | Les mêmes pour tous : pas de dispense au nom d’une croyance |

@ 15 mars 2004 — La loi interdit les signes religieux ostensibles dans les écoles, collèges et lycées publics
@ 2013 — La Charte de la laïcité, en 15 articles, est affichée dans tous les établissements

## Pourquoi l’école
> C’est le lieu où l’on apprend **ensemble**, avant de choisir. Mettre les croyances à distance dans la classe, c’est faire en sorte qu’aucun élève ne soit d’abord vu comme **le représentant d’un groupe**.

## Ce qui reste possible
!> **Parler des religions en cours est prévu par les programmes** — en histoire, en français, en arts. Les **connaître** est un savoir ; les **pratiquer** est un choix privé.`,
          },
          questions: [
            ['Que garantit la laïcité ?', ['La liberté de conscience, la séparation État-religions et l’égalité', 'L’interdiction des religions', 'Le financement des cultes', 'Une religion officielle'], 0, 'Trois choses en même temps.'],
            ['Quelle loi établit la séparation des Églises et de l’État ?', ['La loi de 1905', 'La loi de 2004', 'La loi de 1881', 'La loi de 1789'], 0, 'Elle met fin au financement public des cultes.'],
            ['Que dit la loi du 15 mars 2004 ?', ['Elle interdit les signes religieux ostensibles dans les écoles publiques', 'Elle interdit toute religion en France', 'Elle finance les écoles privées', 'Elle supprime les cours d’histoire des religions'], 0, 'Elle concerne écoles, collèges et lycées publics.'],
            ['À quoi les enseignants sont-ils tenus ?', ['À une stricte neutralité', 'À déclarer leur religion', 'À enseigner une religion', 'À rien de particulier'], 0, 'Ils sont agents de l’État.'],
            ['Peut-on parler des religions en cours ?', ['Oui, c’est prévu par les programmes', 'Non, c’est interdit', 'Seulement en dehors des cours', 'Uniquement avec autorisation'], 0, 'Les connaître est un savoir, les pratiquer un choix privé.'],
            ['La laïcité est-elle une opinion contre les religions ?', ['Non, l’État ne les impose ni ne les combat', 'Oui', 'Oui, depuis 2004', 'Cela dépend des établissements'], 0, 'Elle protège aussi le libre exercice des cultes.'],
            ['Qu’est-ce que la Charte de la laïcité ?', ['Un texte de 15 articles affiché dans les établissements depuis 2013', 'Une loi de 1905', 'Un règlement intérieur', 'Un programme scolaire'], 0, 'Elle rappelle les principes en termes simples.'],
            ['Un élève peut être dispensé d’un cours au nom de sa croyance.', ['Vrai', 'Faux'], 1, 'Les programmes sont les mêmes pour tous.'],
          ],
        },

        // --- Chapitre 3 : Construire une culture civique ---
        {
          titre: 'La règle et la loi',
          axe: 'Construire une culture civique',
          lecon: {
            titre: 'Pourquoi on n’est pas libre de tout faire',
            cours: `Une règle n’est pas là pour empêcher, elle est là pour permettre. Sans règles, un match de football n’est pas plus libre : il n’existe pas.

## Règle ou loi
| Le texte | À qui il s’applique | Qui le fait |
| La **règle** | À **un groupe précis** : un collège, un jeu, une famille | Le groupe lui-même |
| La **loi** | À **tous**, sur tout le territoire | Le **Parlement** : Assemblée nationale et Sénat |

La loi est publiée au *Journal officiel*.

## À quoi elles servent
| Leur rôle | Le détail |
| **Protéger** | La loi protège le plus **faible** du plus **fort** |
| **Organiser** | Le code de la route ne bride pas la liberté de circuler : il la **rend possible** |
| **Sanctionner** | Ce qui porte atteinte à autrui |

!> Sans loi, seul le **rapport de force** compterait. C’est exactement ce dont elle protège.

## La hiérarchie des normes
~ La Constitution → les lois → les décrets → les règlements

!> Une règle ne peut **jamais** contredire une norme supérieure : le règlement intérieur d’un collège ne peut pas aller contre la loi.

## Comment une loi se fait
~ Une proposition (parlementaires) ou un projet (gouvernement) → discuté et voté par les deux chambres → éventuel contrôle du Conseil constitutionnel → promulgation par le président

## Une loi peut changer
@ 1848 — Abolition définitive de l’esclavage
@ 1981 — Abolition de la peine de mort

> Une loi n’est pas éternelle : elle est votée par des représentants **élus**, et peut être modifiée ou abrogée.

## Sanction et réparation
| La sanction doit être… | |
| **Proportionnée** | À la faute |
| **Prévue à l’avance** | Pas inventée après coup |
| **Expliquée** | |

!> La sanction n’est pas une **vengeance**. Elle vise aussi à **réparer** — d’où les mesures de responsabilisation au collège.`,
          },
          questions: [
            ['Quelle est la différence entre une règle et une loi ?', ['La règle vaut dans un cadre précis, la loi s’applique à tous', 'Aucune', 'La loi ne concerne que les adultes', 'La règle est plus forte'], 0, 'La loi est votée par le Parlement.'],
            ['Qui vote la loi en France ?', ['Le Parlement : Assemblée nationale et Sénat', 'Le président seul', 'Le gouvernement seul', 'Les maires'], 0, 'Elle est ensuite publiée au Journal officiel.'],
            ['À quoi sert principalement la loi ?', ['Protéger, organiser la vie commune et sanctionner', 'Empêcher toute liberté', 'Punir uniquement', 'Enrichir l’État'], 0, 'Elle protège le plus faible du plus fort.'],
            ['Quelle norme est au sommet de la hiérarchie ?', ['La Constitution', 'La loi', 'Le décret', 'Le règlement intérieur'], 0, 'Aucune règle ne peut la contredire.'],
            ['Une loi peut-elle être changée ?', ['Oui, elle peut être modifiée ou abrogée', 'Non, jamais', 'Seulement par référendum', 'Seulement tous les dix ans'], 0, 'C’est ainsi que la peine de mort a été abolie en 1981.'],
            ['Quelles conditions une sanction doit-elle respecter ?', ['Être proportionnée, prévue à l’avance et expliquée', 'Être la plus sévère possible', 'Être décidée sur le moment', 'Rester secrète'], 0, 'Elle vise aussi à réparer.'],
            ['Le règlement intérieur d’un collège peut-il contredire la loi ?', ['Non, il lui est subordonné', 'Oui, dans l’établissement', 'Oui, si le principal le décide', 'Cela dépend des cas'], 0, 'C’est la hiérarchie des normes.'],
            ['Sans règles, un jeu serait plus libre.', ['Vrai', 'Faux'], 1, 'Sans règles, il n’existerait pas : elles rendent le jeu possible.'],
          ],
        },
        {
          titre: 'S’engager : le délégué, les associations, les secours',
          axe: 'Construire une culture civique',
          lecon: {
            titre: 'Agir avant d’avoir 18 ans',
            cours: `On n’attend pas la majorité pour agir. Le collège offre plusieurs voies concrètes.

## Le délégué de classe
Élu par ses camarades au **scrutin secret**, il les **représente** au conseil de classe.

| Son devoir | |
| Porter la parole **du groupe**, pas la sienne | |
| **Rendre compte** ensuite | |
| Ne pas révéler ce qui est **confidentiel** | |

> C’est la première expérience de **démocratie représentative** : on choisit quelqu’un pour parler en son nom, et **on lui demande des comptes**.

## Les autres instances
| L’instance | Son objet |
| Le **CVC** (conseil de la vie collégienne) | Les élèves proposent des projets sur la vie de l’établissement |
| Les **éco-délégués** | Tri, gaspillage alimentaire, énergie |
| Le **foyer socio-éducatif**, les clubs, l’**AS** | La vie associative de l’établissement |

## Les associations
= Une association loi 1901 : des personnes réunies autour d’un but NON LUCRATIF

Bénévolat, aide aux devoirs, protection animale, secourisme, environnement : des millions de personnes y consacrent du temps **sans être payées**.

## Porter secours
| Le numéro | Pour quoi |
| **15** | SAMU — urgence médicale |
| **17** | Police / Gendarmerie |
| **18** | Pompiers |
| **112** | Numéro d’urgence **européen**, depuis n’importe quel téléphone |
| **114** | Urgences **par SMS**, pour les personnes sourdes ou malentendantes |

Au collège, la formation **PSC1** apprend les gestes qui sauvent.

~ Alerter → masser → utiliser un défibrillateur

!> **Ne pas porter secours quand on le peut est un délit.** Appeler, c’est déjà secourir.

## Ce que l’engagement apporte
> Il change le rapport à l’établissement : on cesse de **subir** un lieu pour en devenir **responsable**. Et il s’apprend — comme tout le reste.`,
          },
          questions: [
            ['Comment le délégué de classe est-il désigné ?', ['Élu par ses camarades au scrutin secret', 'Désigné par le professeur principal', 'Tiré au sort', 'Volontaire sans vote'], 0, 'C’est une première expérience de démocratie représentative.'],
            ['Quel est le rôle du délégué ?', ['Porter la parole du groupe et rendre compte', 'Donner son avis personnel', 'Noter les élèves', 'Surveiller la classe'], 0, 'Il ne révèle pas ce qui est confidentiel.'],
            ['Que font les éco-délégués ?', ['Ils portent les questions d’environnement dans l’établissement', 'Ils surveillent la cantine', 'Ils notent les absences', 'Ils remplacent les délégués'], 0, 'Tri, gaspillage alimentaire, énergie.'],
            ['Qu’est-ce qu’une association loi 1901 ?', ['Un groupement de personnes autour d’un but non lucratif', 'Une entreprise', 'Un service de l’État', 'Un syndicat obligatoire'], 0, 'Le bénévolat n’est pas rémunéré.'],
            ['Quel numéro appeler pour une urgence médicale ?', ['Le 15', 'Le 17', 'Le 18', 'Le 114'], 0, 'Le 112 fonctionne aussi partout en Europe.'],
            ['Quel numéro permet d’alerter par SMS ?', ['Le 114', 'Le 15', 'Le 18', 'Le 112'], 0, 'Il est destiné aux personnes sourdes ou malentendantes.'],
            ['Qu’apprend la formation PSC1 ?', ['Les gestes qui sauvent : alerter, masser, utiliser un défibrillateur', 'Le code de la route', 'Le règlement intérieur', 'Les premiers secours des animaux'], 0, 'Elle se suit dès le collège.'],
            ['Il faut avoir 18 ans pour s’engager utilement.', ['Vrai', 'Faux'], 1, 'Délégué, éco-délégué, CVC, associations, secours : tout est possible avant.'],
          ],
        },
      ],
    },
  ],
}
