// HLP — Humanités, littérature et philosophie, TERMINALE : les 18 fiches du
// programme officiel, dans l'ordre des 6 chapitres du BO.
//
// Les deux semestres de terminale — « La recherche de soi » (chapitres 1 à 3)
// et « L'Humanité en question » (chapitres 4 à 6) — étaient jusqu'ici présents
// en base sous forme de DEUX chapitres portant exactement les deux titres de
// semestre. Autrement dit : la table des matières servie comme cours.
//
// POURQUOI UN SECOND MODULE plutôt qu'un ajout dans `hlp.mjs` : celui-ci part
// dans la migration 219, DÉJÀ EXÉCUTÉE, qui ne doit plus jamais être
// régénérée. Deux fichiers, même slug `hlp` — d'où la génération par
// `--modules hlp-tle` et non par `--slugs hlp`, qui les fusionnerait.
//
// Le bloc de PREMIÈRE de `hlp.mjs` n'est pas touché : le programme de 1re
// (« Les pouvoirs de la parole », « Les représentations du monde ») reste tel
// qu'il est. Cette migration ne concerne que la terminale.

export default {
  slug: 'hlp',
  nom: 'HLP',

  titreMigration: 'HLP Tle — LES 18 FICHES DU PROGRAMME OFFICIEL',

  motif: `CONSTAT MESURÉ (sonde en lecture seule sur la base, 05/08/2026) :
la spécialité HLP de terminale n'avait que 3 chapitres, dont DEUX étaient les
titres mêmes des deux semestres (« La recherche de soi », « L'Humanité en
question »). Tout le programme tenait en deux fiches. Un élève qui révisait
l'identité et le genre, la pop culture, Foucault et l'histoire de la
psychiatrie, la conscience écologique ou la bioéthique ne trouvait rien — et
ce sont exactement les entrées sur lesquelles tombe l'essai. Cette migration
installe les 18 fiches du programme officiel, dans l'ordre des 6 chapitres du
BO, et retire les 2 fiches de semestre qu'elles recouvrent entièrement. La
fiche « Méthode de l'épreuve » est CONSERVÉE — l'interprétation littéraire et
l'essai ne sont couverts par aucune entrée du programme — mais renvoyée en fin
de liste.`,

  // ON NE SUPPRIME PAS PAR TITRE DE CHAPITRE mais par titre de LEÇON : c'est le
  // repère le plus sûr. Les deux chapitres visés, et eux seuls, portent les
  // leçons posées par 219 (« Éducation, sensibilité, métamorphoses du moi » et
  // « Nature, technique et limites de l'humain ») — vérifié en base le
  // 05/08/2026. Aucune fiche neuve n'en porte : rejouer la migration ne
  // supprime plus rien.
  //
  // Le filtre `level = 'Tle'` protège la Première, qui garde ses 3 chapitres.
  //
  // ⚠️ Si quelqu'un recolle un jour la migration 219, les deux chapitres
  // reviennent. C'est le prix de l'idempotence : 219 ne peut pas être modifiée.
  menage: [
    {
      raison: `La file « À revoir » d'abord : review_items.item_id n'a PAS de clé
étrangère (il pointe soit une question, soit une carte). Rien ne casse si on
l'oublie — le lecteur écarte déjà un contenu disparu — mais le compteur
« X à revoir » continuerait de compter des questions qui n'existent plus.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'hlp'
   AND c.level = 'Tle'
   AND l.title IN ('Éducation, sensibilité, métamorphoses du moi',
                   'Nature, technique et limites de l’humain');`,
    },
    {
      raison: `Les quiz ensuite : quizzes.lesson_id est ON DELETE SET NULL, donc
supprimer le chapitre laisserait derrière lui des quiz orphelins, rattachés à
aucune leçon mais toujours servis par le moteur de révision.`,
      sql: `DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'hlp'
   AND c.level = 'Tle'
   AND l.title IN ('Éducation, sensibilité, métamorphoses du moi',
                   'Nature, technique et limites de l’humain');`,
    },
    {
      raison: `Puis les chapitres : leçons, fiches de révision, supports, progression
et chapitres cochés partent en cascade (toutes les clés étrangères vers
chapters et lessons sont ON DELETE CASCADE).`,
      sql: `DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'hlp'
   AND c.level = 'Tle'
   AND EXISTS (
     SELECT 1 FROM public.lessons l
      WHERE l.chapter_id = c.id
        AND l.title IN ('Éducation, sensibilité, métamorphoses du moi',
                        'Nature, technique et limites de l’humain')
   );`,
    },
    {
      raison: `Enfin la fiche de MÉTHODE survivante passe en fin de liste. Elle reste
indispensable (l'interprétation littéraire et l'essai ne relèvent d'aucune
entrée du programme), mais elle occupe la position 3, en plein milieu des 18
fiches neuves. Un INSERT ne peut pas renuméroter une ligne déjà en base :
c'est un UPDATE, ici, ou rien. Idempotent (rejouer réécrit la même valeur).`,
      sql: `UPDATE public.chapters c
   SET position = 90
  FROM public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'hlp'
   AND c.level = 'Tle'
   AND c.title = 'Méthode de l’épreuve';`,
    },
  ],

  blocs: [
    {
      niveaux: ['Tle'],
      chapitres: [
        // ---- Chapitre 1 : Éducation, transmission et émancipation ------------
        {
          titre: 'Le renouveau de l’éducation',
          lecon: {
            titre: 'Éduquer : conduire hors de soi ou faire pousser ?',
            cours: `Le mot lui-même hésite, et toute l’histoire de l’éducation tient dans cet écart.

| Racine latine | Ce qu’elle veut dire | Ce qu’elle suppose |
| *Educere* | Conduire **hors de** | L’enfant doit être arraché à son état premier |
| *Educare* | Nourrir, élever | L’enfant doit être aidé à s’accomplir |

## Le tournant de la Renaissance
**Montaigne**, dans « De l’institution des enfants » (*Essais*, I, 26), congédie le savoir accumulé : il veut « **une tête bien faite plutôt que bien pleine** ». L’élève doit passer le savoir au crible de son propre jugement — « qu’il ne lui demande pas seulement les mots de sa leçon, mais le sens et la substance ».

**Rabelais**, dans *Gargantua*, oppose deux précepteurs :

| Précepteur | Sa méthode | Son résultat |
| Thubal Holopherne | La récitation, le par cœur | Il abrutit |
| Ponocrates | Le corps, l’observation, la conversation | Il forme |

## Rousseau et l’éducation négative
*Émile ou De l’éducation* (1762) renverse la question : l’enfant n’est **pas** un adulte incomplet.

> « Le plus grand, le plus important, le plus utile de toute l’éducation, c’est de ne pas gagner du temps, c’est d’en perdre. »

L’**éducation négative** protège l’enfant des préjugés au lieu de les lui inculquer : il apprend par l’expérience et par la nécessité des choses, non par l’autorité du maître. **Kant** en tirera une formule tendue — « comment cultiver la liberté par la contrainte ? »

## L’école républicaine
| Date | L’étape | Ce qu’elle pose |
| 1792 | **Condorcet** | L’égalité politique reste fictive sans égalité des lumières |
| 1881-1882 | Lois **Ferry** | École gratuite, laïque et obligatoire |

L’instruction devient une **condition de la citoyenneté**, non un ornement.

## Les critiques contemporaines
| Auteur | Œuvre | Ce qu’il reproche à l’école |
| **Bourdieu et Passeron** | *Les Héritiers* (1964), *La Reproduction* (1970) | Sous couvert de méritocratie, elle transmet un capital culturel qui avantage ceux qui l’ont déjà |
| **Ivan Illich** | *Une société sans école* (1971) | L’institution crée le besoin qu’elle prétend satisfaire |
| **Paulo Freire** | *Pédagogie des opprimés* (1968) | L’éducation « bancaire » — le maître dépose, l’élève reçoit — contre la conscientisation |

## La question qui reste
Éduquer, est-ce **transmettre** un héritage ou rendre capable de le **contester** ? **Hannah Arendt**, dans *La Crise de la culture*, refuse de choisir : c’est parce que le monde est ancien qu’on doit l’enseigner, et parce qu’il est confié à des nouveaux venus qu’il peut être renouvelé.`,
          },
          questions: [
            ['Quelle formule de Montaigne résume son projet éducatif ?', ['« Une tête bien faite plutôt que bien pleine »', '« Que sais-je ? »', '« Connais-toi toi-même »', '« Je pense donc je suis »'], 0, 'Dans « De l’institution des enfants », *Essais*, I, 26.'],
            ['Rousseau prône dans « Émile » une éducation dite…', ['Négative', 'Encyclopédique', 'Autoritaire', 'Religieuse'], 0, 'Elle protège l’enfant des préjugés au lieu de les lui inculquer.'],
            ['Les lois Ferry rendent l’école gratuite, laïque et obligatoire.', ['Vrai', 'Faux'], 0, 'En 1881-1882 : l’instruction devient une condition de la citoyenneté.'],
            ['Que soutiennent Bourdieu et Passeron dans « Les Héritiers » ?', ['L’école reproduit les inégalités culturelles sous couvert de mérite', 'L’école abolit les classes sociales', 'L’école doit être supprimée', 'L’école est neutre'], 0, 'Le capital culturel avantage ceux qui le possèdent déjà.'],
            ['Ivan Illich défendait l’extension de l’institution scolaire.', ['Vrai', 'Faux'], 1, '*Une société sans école* (1971) soutient l’inverse.'],
            ['Que reproche Paulo Freire à l’éducation « bancaire » ?', ['Le maître dépose un savoir que l’élève reçoit passivement', 'Elle coûte trop cher', 'Elle est trop pratique', 'Elle ignore les mathématiques'], 0, 'Il lui oppose une pédagogie de la conscientisation.'],
            ['Selon Arendt, il faut choisir entre transmettre le monde et le renouveler.', ['Vrai', 'Faux'], 1, 'Elle refuse l’alternative : on transmet PARCE QUE le monde sera renouvelé.'],
            ['Que signifie l’étymologie « educere » ?', ['Conduire hors de', 'Nourrir', 'Instruire', 'Corriger'], 0, 'Face à *educare*, « élever, nourrir » : deux gestes en tension.'],
          ],
        },
        {
          titre: 'La transmission des savoirs',
          lecon: {
            titre: 'Ce qui passe d’une génération à l’autre',
            cours: `Transmettre n’est pas copier. Entre celui qui donne et celui qui reçoit, quelque chose se perd, se déforme — et parfois se crée.

## Les supports et leurs effets
Platon, dans le *Phèdre*, fait raconter par Socrate le mythe de **Theuth**.

| Personnage | Ce qu’il voit dans l’écriture |
| Theuth, l’inventeur | Un **remède** à la mémoire |
| Thamous, le roi | Un **poison** : on cessera de se souvenir, on croira savoir sans savoir |

L’écriture est un *pharmakon* — remède et poison à la fois. La même inquiétude accompagnera l’imprimerie, puis Internet : chaque support nouveau est accusé de ruiner la faculté qu’il prétend servir.

## L’imprimerie et la démocratisation
**Gutenberg**, vers 1450, fait basculer le savoir hors des scriptoria. Le livre devient reproductible, vérifiable, discutable : la Réforme, la révolution scientifique et les Lumières sont **indissociables** de ce changement matériel.

## Ce qui se transmet, et comment
| Ce qu’on transmet | Par quel canal | Qui le décrit |
| Des contenus | L’école, le livre | La tradition scolaire |
| Des **gestes**, des manières d’être | L’imitation, l’apprentissage | L’atelier, le compagnonnage |
| Un *habitus* — façons de parler, de se tenir, goûts | La famille, sans être enseigné | **Bourdieu** |
| Une **mémoire collective** | Monuments, manuels, commémorations | **Halbwachs** |

> Le savoir ne se transmet pas comme un objet : il se **reconstruit** par celui qui l’acquiert. Ce que le maître donne, l’élève doit le **refaire**.

**Michel Serres**, dans *Petite Poucette* (2012), en tire une conséquence : disposant d’un savoir accessible d’un clic, les nouvelles générations n’ont plus besoin qu’on leur transmette des contenus, mais qu’on leur apprenne à **s’orienter** dans ce qui est déjà là.

## La mémoire et l’oubli
Une société transmet aussi ce qu’elle décide de **commémorer** — et donc, en creux, ce qu’elle choisit d’oublier. Halbwachs montre que le souvenir individuel lui-même s’appuie sur des **cadres sociaux** : on ne se souvient jamais seul.

## Trahir pour transmettre
*Traduttore, traditore.* Toute transmission est une traduction, donc une **trahison partielle**. Mais c’est cette trahison qui permet au savoir de rester vivant : une tradition qui ne se réinterprète plus est une tradition morte.`,
          },
          questions: [
            ['Dans le « Phèdre », l’écriture est comparée à…', ['Un pharmakon : remède et poison', 'Un miroir', 'Une cité', 'Un jardin'], 0, 'Le mythe de Theuth : elle affaiblit la mémoire tout en la fixant.'],
            ['Gutenberg met au point l’imprimerie vers 1450.', ['Vrai', 'Faux'], 0, 'Le livre devient reproductible, vérifiable, discutable.'],
            ['Que désigne l’habitus chez Bourdieu ?', ['Des dispositions incorporées, transmises sans être enseignées', 'Un règlement scolaire', 'Un programme officiel', 'Une méthode de lecture'], 0, 'Façons de parler, de se tenir, goûts : elles pèsent sur la réussite.'],
            ['Selon Michel Serres, que faut-il transmettre à « Petite Poucette » ?', ['La capacité à s’orienter dans un savoir déjà accessible', 'Davantage de contenus à mémoriser', 'Rien du tout', 'Uniquement des savoir-faire manuels'], 0, 'Le savoir est disponible ; ce qui manque, c’est le tri et la mise en ordre.'],
            ['Halbwachs montre que la mémoire individuelle s’appuie sur des cadres sociaux.', ['Vrai', 'Faux'], 0, 'Une société transmet aussi ce qu’elle décide de commémorer — et d’oublier.'],
            ['« Traduttore, traditore » signifie…', ['Traduire, c’est trahir', 'Traduire, c’est créer', 'Le traducteur est un traître à sa patrie', 'La traduction est impossible'], 0, 'Toute transmission déforme, et c’est ce qui la maintient vivante.'],
            ['Le savoir se transmet exactement comme un objet passe de main en main.', ['Vrai', 'Faux'], 1, 'Il doit être reconstruit par celui qui l’acquiert.'],
            ['Selon Thamous, quel est le danger de l’écriture ?', ['Croire savoir sans savoir', 'Coûter trop cher', 'Être illisible', 'Être réservée aux prêtres'], 0, 'Les hommes se fieront aux signes extérieurs au lieu de se souvenir.'],
          ],
        },
        {
          titre: 'L’émancipation pour tous ?',
          lecon: {
            titre: 'Sortir de tutelle, et à quelles conditions',
            cours: `S’émanciper, en droit romain, c’est sortir de la *manus* — la main du père. Le mot garde cette trace : il désigne le passage d’un état de **tutelle** à un état d’**autonomie**.

## Les Lumières
**Kant**, dans *Qu’est-ce que les Lumières ?* (1784), donne la définition la plus nette : « La sortie de l’homme hors de l’état de **minorité** dont il est lui-même responsable. »

| Le mot | Ce qu’il désigne |
| **Minorité** | L’incapacité de se servir de son entendement sans la direction d’autrui |
| **Responsable** | Ce n’est pas la nature qui nous y maintient, mais la paresse et la lâcheté |
| *Sapere aude* | Ose savoir : le mot d’ordre qui en découle |

## Les émancipations politiques
| Date | L’émancipation | Sa fragilité |
| 1791 | Les **Juifs** en France | |
| 1794 | Abolition de l’**esclavage** | **Rétablie en 1802**, abolie définitivement en 1848 |
| 1944 | Droit de **vote des femmes** | La capacité juridique pleine n’arrive qu’en 1965 |
| Années 1950-1960 | La **décolonisation** | Son coût psychique, analysé par **Frantz Fanon** |

## L’émancipation par le savoir
**Jacotot**, redécouvert par **Jacques Rancière** dans *Le Maître ignorant* (1987), fait l’hypothèse de l’**égalité des intelligences** : ce n’est pas l’inégalité qu’il faut réduire, c’est l’égalité qu’il faut **poser au départ** et vérifier.

> Un maître qui explique installe la dépendance qu’il prétend guérir. D’où la tension du chapitre : l’éducation émancipe-t-elle, ou **fabrique-t-elle la minorité** qu’elle prétend abolir ?

## Les émancipations en tension
| L’émancipation | Ce qu’elle libère | Ce qu’elle impose |
| L’école obligatoire | De l’ignorance et du travail des enfants | Elle arrache aussi l’enfant à sa famille |
| La laïcité | Du dogme | Sa propre norme |

Il n’y a pas d’émancipation qui ne s’exerce **depuis quelque part**.

## L’émancipation aujourd’hui
Le mot s’est déplacé du politique vers l’individuel : s’émanciper des assignations de genre, d’origine, de classe.

**Simone de Beauvoir** (*Le Deuxième Sexe*, 1949) — « On ne naît pas femme : on le devient » — pose que ce qui est **construit** peut être défait. La question demeure : à quelles conditions **matérielles** une liberté proclamée devient-elle une liberté réelle ?`,
          },
          questions: [
            ['Comment Kant définit-il les Lumières ?', ['La sortie de l’homme hors de l’état de minorité dont il est responsable', 'Le progrès des sciences', 'La victoire de la raison sur la religion', 'Le règne des philosophes'], 0, 'D’où le mot d’ordre *Sapere aude* : ose savoir.'],
            ['Chez Kant, la minorité est un état dont nous sommes responsables.', ['Vrai', 'Faux'], 0, 'Ce n’est pas la nature qui nous y maintient mais la paresse et la lâcheté.'],
            ['Quelle hypothèse Rancière tire-t-il du « Maître ignorant » ?', ['L’égalité des intelligences, à poser au départ', 'La supériorité du maître', 'L’inutilité de l’école', 'La nécessité de la sélection'], 0, 'Un maître qui explique installe la dépendance qu’il prétend guérir.'],
            ['En quelle année les femmes obtiennent-elles le droit de vote en France ?', ['1944', '1918', '1936', '1965'], 0, 'La capacité de travailler sans autorisation maritale date, elle, de 1965.'],
            ['Frantz Fanon analyse le coût psychique de la colonisation.', ['Vrai', 'Faux'], 0, 'Notamment dans *Les Damnés de la terre* (1961).'],
            ['Que signifie la formule de Beauvoir « On ne naît pas femme : on le devient » ?', ['Ce qui est construit socialement peut être défait', 'La biologie détermine tout', 'Les femmes doivent imiter les hommes', 'Le genre n’existe pas'], 0, '*Le Deuxième Sexe*, 1949 : la condition féminine est un produit historique.'],
            ['Toute émancipation est exempte de contrainte.', ['Vrai', 'Faux'], 1, 'L’école obligatoire arrache l’enfant au travail, mais aussi à sa famille.'],
            ['L’étymologie d’« émanciper » renvoie…', ['À la sortie de la main du père (manus)', 'À la libération d’une prison', 'À l’adolescence', 'Au vote'], 0, 'Terme de droit romain, devenu politique puis individuel.'],
          ],
        },

        // ---- Chapitre 2 : Les expressions de la sensibilité ------------------
        {
          titre: '« Un seul être vous manque et tout est dépeuplé » : le sentiment romantique',
          lecon: {
            titre: 'Le moi romantique et son mal',
            cours: `Le vers est de Lamartine — « L’Isolement », *Méditations poétiques*, 1820. Il condense un basculement : le sentiment individuel devient le centre d’où l’on regarde le monde entier.

## Ce que le romantisme renverse
| | L’âge classique | Le romantisme |
| La passion est… | Un désordre à corriger par la raison | Une **source de vérité** |
| Le sujet | Se retient, se dissimule | Fait de son émotion la matière de l’œuvre |

## Le « mal du siècle »
| Œuvre | Auteur, date | Ce qu’elle établit |
| *René* | Chateaubriand, 1802 | Une mélancolie **sans objet** : le « vague des passions », où le désir devance l’expérience |
| *La Confession d’un enfant du siècle* | Musset, 1836 | Son explication **historique** : une génération née « entre deux mondes », l’Empire écroulé et une monarchie sans grandeur |

## La nature, miroir et refuge
Chez **Rousseau** déjà (*Les Rêveries du promeneur solitaire*), la nature n’est pas un décor : elle **répond** au sentiment. **Lamartine** (« Le Lac ») et **Hugo** (« Tristesse d’Olympio ») lui demandent de garder la mémoire d’un amour que le temps efface — le paysage devient ce que Baudelaire appellera plus tard un jeu de **correspondances**.

> Le romantisme lie trois choses, et c’est leur nœud qu’il faut savoir défaire : l’exaltation du **moi**, la découverte du **temps qui passe**, et le sentiment que le **monde ne répond pas** à notre attente.

## Les objections
| Penseur | Ce qu’il reproche au romantisme |
| **Hegel** | L’« âme belle » préfère sa pureté à l’action, et se complaît dans son insatisfaction |
| **Nietzsche** | Il distingue un romantisme de la **détresse**, qui souffre du manque, d’un art de la **surabondance** — et ne cache pas sa préférence |
| La **psychanalyse** | La mélancolie n’est pas une profondeur mais un **deuil impossible** : le mélancolique ne sait pas ce qu’il a perdu |

## Ce qui en reste
Le sentiment romantique a durablement installé l’idée que la **sincérité** de l’émotion vaut caution. C’est cet héritage que travaillent encore la chanson, le cinéma — et une bonne part des réseaux sociaux.`,
          },
          questions: [
            ['De quel poète est le vers « Un seul être vous manque et tout est dépeuplé » ?', ['Lamartine', 'Hugo', 'Musset', 'Baudelaire'], 0, '« L’Isolement », *Méditations poétiques*, 1820.'],
            ['Quelle œuvre de Chateaubriand fixe la figure du « mal du siècle » ?', ['René', 'Atala', 'Les Martyrs', 'Le Génie du christianisme'], 0, 'Un « vague des passions » : le désir devance toute expérience possible.'],
            ['Le romantisme fait de la passion une source de vérité.', ['Vrai', 'Faux'], 0, 'Là où l’âge classique y voyait un désordre à corriger par la raison.'],
            ['Comment Musset explique-t-il historiquement le mal du siècle ?', ['Une génération née « entre deux mondes », après l’Empire', 'Une crise économique', 'La perte de la foi seule', 'L’industrialisation'], 0, '*La Confession d’un enfant du siècle*, 1836.'],
            ['Que reproche Hegel à l’« âme belle » romantique ?', ['Elle préfère sa pureté à l’action', 'Elle est trop rationnelle', 'Elle méprise la nature', 'Elle refuse la poésie'], 0, 'Elle se complaît dans son insatisfaction plutôt que d’agir.'],
            ['Chez les romantiques, la nature n’est qu’un décor.', ['Vrai', 'Faux'], 1, 'Elle répond au sentiment et garde la mémoire : « Le Lac », « Tristesse d’Olympio ».'],
            ['Comment la psychanalyse relit-elle la mélancolie ?', ['Comme un deuil impossible, dont l’objet est inconnu', 'Comme une force créatrice pure', 'Comme une maladie du foie', 'Comme une posture sociale'], 0, 'Le mélancolique ne sait pas ce qu’il a perdu.'],
            ['Nietzsche distingue un romantisme de la détresse et un art de la surabondance.', ['Vrai', 'Faux'], 0, 'Et il ne cache pas sa préférence pour le second.'],
          ],
        },
        {
          titre: 'Les sentiments et la raison',
          lecon: {
            titre: 'Faut-il se méfier de ce que l’on ressent ?',
            cours: `La question traverse la philosophie entière : nos émotions nous **égarent**-elles, ou nous **renseignent**-elles sur ce qui compte ?

## La méfiance antique
| Penseur | Sa thèse | Son image |
| Les **stoïciens** | La passion est un **jugement faux** : ce n’est pas la chose qui trouble, c’est l’opinion qu’on en a | L’*apatheia* — non l’insensibilité, mais l’affranchissement des jugements précipités |
| **Platon** | L’âme est un attelage | Le cocher (la raison) maîtrise deux chevaux, dont l’un tire vers le bas |

## Le partage cartésien
**Descartes**, dans *Les Passions de l’âme* (1649), refuse de les condamner : elles sont « toutes bonnes de leur nature » et nous portent à ce qui est utile au corps. Ce qu’il faut, c’est ne pas s’y **soumettre** — la **générosité**, sentiment de sa propre liberté, est chez lui le remède.

## La réhabilitation
| Penseur | Ce qu’il établit |
| **Pascal** | « Le cœur a ses raisons que la raison ne connaît point » — non un éloge de l’irrationnel, mais un autre ordre de connaissance |
| **Hume** | « La raison est, et ne doit être, que l’esclave des passions » : elle calcule les **moyens**, elle ne fixe aucune **fin** |
| **Rousseau** | La **pitié** — la répugnance à voir souffrir son semblable — est un fondement moral **antérieur** à toute réflexion |

## Le tournant contemporain
| Chercheur | L’observation | Ce qu’elle prouve |
| **Antonio Damasio**, *L’Erreur de Descartes* (1994) | Des patients aux circuits émotionnels lésés, intelligence intacte, deviennent **incapables de décider** | L’émotion n’est pas le contraire du raisonnement : elle en est une **condition** |
| **Martha Nussbaum** | Les émotions sont des **jugements de valeur** | Avoir peur, c’est juger qu’une chose importante est menacée |

> Le débat s’est déplacé : non plus « faut-il obéir à ses sentiments ? », mais « **que connaissent-ils que la raison seule ne connaît pas ?** »

## Le point de tension à garder
Les émotions **renseignent**, mais elles se **manipulent**. C’est tout l’enjeu de la rhétorique du *pathos*, de la publicité et des algorithmes de recommandation, qui exploitent l’indignation parce qu’elle retient l’attention.`,
          },
          questions: [
            ['Pour les stoïciens, la passion est…', ['Un jugement faux sur les choses', 'Une maladie du corps', 'Un don divin', 'Une force à cultiver'], 0, 'Épictète : ce n’est pas la chose qui trouble, mais l’opinion qu’on en a.'],
            ['Descartes condamne les passions comme entièrement mauvaises.', ['Vrai', 'Faux'], 1, 'Il les dit « toutes bonnes de leur nature » : il faut en être maître, non les fuir.'],
            ['Que soutient Hume sur le rapport entre raison et passions ?', ['La raison est l’esclave des passions : elle calcule les moyens, pas les fins', 'La raison doit dominer les passions', 'Passions et raison sont identiques', 'Les passions n’existent pas'], 0, 'Seul un sentiment peut nous faire vouloir quelque chose.'],
            ['Qu’observe Damasio chez les patients aux circuits émotionnels lésés ?', ['Ils deviennent incapables de décider', 'Ils raisonnent mieux', 'Ils perdent la mémoire', 'Ils deviennent violents'], 0, '*L’Erreur de Descartes* : l’émotion est une condition du raisonnement pratique.'],
            ['Pascal fait du « cœur » un éloge de l’irrationnel.', ['Vrai', 'Faux'], 1, 'Il décrit un ordre de connaissance immédiate, distinct de la démonstration.'],
            ['Chez Rousseau, quel sentiment fonde la morale avant toute réflexion ?', ['La pitié', 'L’orgueil', 'La honte', 'La colère'], 0, 'La répugnance naturelle à voir souffrir son semblable.'],
            ['Martha Nussbaum décrit les émotions comme des jugements de valeur.', ['Vrai', 'Faux'], 0, 'Avoir peur, c’est juger qu’une chose importante est menacée.'],
            ['Dans le « Phèdre », l’âme est figurée par…', ['Un attelage conduit par un cocher', 'Un navire sans pilote', 'Une cité en guerre', 'Un miroir brisé'], 0, 'La raison mène deux chevaux, dont l’un tire vers le bas.'],
          ],
        },
        {
          titre: 'Musique et sensibilité artistique',
          lecon: {
            titre: 'L’art qui touche sans dire',
            cours: `La musique pose un problème unique : elle **émeut sans représenter**. Elle ne raconte rien, ne montre rien — et pourtant elle agit plus directement que les autres arts.

## La méfiance ancienne
| Penseur | Son inquiétude |
| **Platon**, *La République* | Certains modes musicaux amollissent, d’autres fortifient : la musique est une **éducation de l’âme**, donc une affaire politique |
| **Saint Augustin**, *Confessions* | Il craint de prendre plus de plaisir au chant qu’au texte sacré qu’il porte |

## L’art le plus haut
Le romantisme allemand **inverse** le rapport : parce qu’elle ne représente rien, la musique atteint ce que les mots manquent.

**Schopenhauer** en fait un cas à part — les autres arts figurent des apparences, la musique est l’expression **directe de la volonté**, du fond même du monde. D’où l’idée, courante au XIXe siècle, que tous les arts aspirent à l’état de musique.

## Le beau et le sublime
| | Le **beau** | Le **sublime** |
| Ce que c’est | Une forme qui s’accorde à nos facultés | Ce qui les **excède** : l’océan démonté, la montagne, l’infini |
| Ce qu’on éprouve | L’apaisement | Un déplaisir d’abord, une grandeur ensuite |
| Pourquoi | La forme est à notre mesure | L’imagination échoue là où la raison conçoit |

> **Kant** énonce aussi le paradoxe du goût : le jugement esthétique est **subjectif** — il repose sur un sentiment — mais prétend à l’**universalité**. On dit « c’est beau », pas « ça me plaît ».

## L’émotion esthétique est-elle une vraie émotion ?
Pleurer devant une fiction **sans croire à sa réalité** : c’est le « paradoxe de la fiction ». **Aristote** y répondait déjà par la **catharsis** — la tragédie purge les passions en les faisant éprouver à distance protégée.

## Le soupçon contemporain
| Penseur | Sa critique |
| **Adorno** | L’« industrie culturelle » standardise l’écoute : la musique de masse ne libère pas la sensibilité, elle la **formate** |
| **Bourdieu**, *La Distinction* (1979) | Les goûts musicaux sont des **marqueurs sociaux** : ce qu’on trouve beau dit d’où l’on vient |

## Ce qui reste ouvert
Si la musique n’imite rien, que nous apprend-elle ? Peut-être ceci : que la **sensibilité s’éduque**. Entendre une œuvre difficile n’est pas un don, c’est le résultat d’un apprentissage — ce qui est une réponse, indirecte, au chapitre sur l’éducation.`,
          },
          questions: [
            ['Pourquoi Platon veut-il régler les modes musicaux dans la cité ?', ['La musique éduque l’âme : c’est une affaire politique', 'Elle coûte trop cher', 'Elle distrait des mathématiques', 'Elle est réservée aux dieux'], 0, 'Certains modes amollissent, d’autres fortifient.'],
            ['Que représente la musique selon Schopenhauer ?', ['La volonté elle-même, fond du monde', 'Les apparences sensibles', 'Les idées mathématiques', 'Rien du tout'], 0, 'D’où sa place à part parmi les arts.'],
            ['Chez Kant, le sublime commence par un déplaisir.', ['Vrai', 'Faux'], 0, 'Nous mesurons notre petitesse, avant que la raison ne conçoive l’infini.'],
            ['Quel est le paradoxe kantien du jugement de goût ?', ['Il est subjectif mais prétend à l’universalité', 'Il est objectif et privé', 'Il est purement rationnel', 'Il ne concerne que l’artiste'], 0, 'On dit « c’est beau », non « ça me plaît ».'],
            ['La catharsis désigne chez Aristote…', ['La purgation des passions par la fiction tragique', 'La purification religieuse', 'L’imitation de la nature', 'La règle des trois unités'], 0, 'On éprouve les passions à distance protégée.'],
            ['Adorno voit dans l’industrie culturelle une libération de la sensibilité.', ['Vrai', 'Faux'], 1, 'Il y dénonce au contraire une standardisation de l’écoute.'],
            ['Que montre Bourdieu dans « La Distinction » ?', ['Les goûts fonctionnent comme des marqueurs sociaux', 'Le goût est inné', 'Tous les goûts se valent', 'La musique échappe au social'], 0, 'Ce qu’on trouve beau dit d’où l’on vient.'],
            ['Saint Augustin s’inquiète de prendre plus de plaisir au chant qu’au texte sacré.', ['Vrai', 'Faux'], 0, 'La musique agit avant le sens : c’est ce qui l’inquiète.'],
          ],
        },

        // ---- Chapitre 3 : Les métamorphoses du moi ---------------------------
        {
          titre: 'Les transformations historiques de l’ego',
          lecon: {
            titre: 'Une histoire du « je »',
            cours: `Le moi n’a pas toujours existé sous la forme que nous lui connaissons. Ce que nous prenons pour une **évidence intime** est le résultat d’une histoire.

## Les cinq étapes du « je »
| Époque | L’auteur | Ce que le moi devient |
| Antiquité | **Socrate** | Rien d’intime : « connais-toi » invite à mesurer ce qu’on sait et ce qu’on ignore |
| IVe siècle | **Augustin**, *Confessions* | Un **dedans** : *in interiore homine habitat veritas* |
| 1580 | **Montaigne**, *Essais* | Un **objet d’étude** : « je suis moi-même la matière de mon livre » |
| 1637 | **Descartes**, *cogito* | Un **fondement** : une substance pensante, transparente à elle-même |
| XIXe-XXe | Marx, Nietzsche, Freud | Un **soupçon** : le moi n’est plus transparent |

## Montaigne : un moi qui ne tient pas en place
Le moi des *Essais* n’est pas stable : « Je ne peins pas l’être, je peins le **passage**. » Mouvant, contradictoire, saisi dans le temps — c’est la première fois qu’un auteur en fait une qualité et non un défaut.

## Descartes : le moi comme socle
Le *cogito* fait du moi le point d’appui de toute certitude : je puis douter de tout, sauf que je pense. Le moi n’est plus un objet d’observation, c’est le **fondement**.

> C’est cette **transparence** que les siècles suivants vont démolir méthodiquement.

## Les trois blessures narcissiques
Freud décrit trois humiliations infligées à l’amour-propre humain.

| Blessure | Ce qu’elle retire à l’homme |
| **Copernic** | La Terre n’est pas au centre du monde |
| **Darwin** | L’homme n’est pas d’une autre nature que l’animal |
| La **psychanalyse** | Le moi « n’est pas maître dans sa propre maison » |

## Les soupçons croisés
| Penseur | Ce qu’il fait du moi |
| **Marx** | La conscience est déterminée par les conditions matérielles d’existence |
| **Nietzsche** | Le « je » est une **fiction grammaticale**, une cause inventée derrière l’action |
| **Sartre** | Il renverse : l’homme n’a pas de nature, « l’existence précède l’essence » |

## Aujourd’hui
Le moi se **met en scène** : profils, avatars, récits de soi. Ce qui était examen intérieur devient **exposition**. Le moi contemporain est peut-être moins un secret à découvrir qu’une image à administrer.`,
          },
          questions: [
            ['Quel ouvrage inaugure l’écriture de l’intériorité au IVe siècle ?', ['Les Confessions de saint Augustin', 'Les Essais de Montaigne', 'Le Discours de la méthode', 'La République'], 0, '*In interiore homine habitat veritas.*'],
            ['Que dit Montaigne de son projet dans les « Essais » ?', ['« Je suis moi-même la matière de mon livre »', '« Je pense donc je suis »', '« Connais-toi toi-même »', '« L’enfer, c’est les autres »'], 0, 'Et il ajoute : « Je ne peins pas l’être, je peins le passage. »'],
            ['Chez Descartes, le moi est une substance pensante transparente à elle-même.', ['Vrai', 'Faux'], 0, 'C’est cette transparence que Marx, Nietzsche et Freud contesteront.'],
            ['Quelles sont les trois « blessures narcissiques » selon Freud ?', ['Copernic, Darwin, la psychanalyse', 'Platon, Descartes, Kant', 'Galilée, Newton, Einstein', 'Marx, Nietzsche, Freud'], 0, 'Décentrement cosmologique, biologique, puis psychique.'],
            ['Pour Nietzsche, le « je » est une fiction grammaticale.', ['Vrai', 'Faux'], 0, 'Une cause inventée derrière l’action, par habitude de langage.'],
            ['Que signifie « l’existence précède l’essence » chez Sartre ?', ['L’homme n’a pas de nature donnée : il se fait', 'L’être précède la pensée', 'Le corps précède l’âme', 'La société précède l’individu'], 0, 'D’où la responsabilité entière du sujet sur ce qu’il devient.'],
            ['Le « connais-toi toi-même » socratique invite à l’introspection psychologique.', ['Vrai', 'Faux'], 1, 'Il invite à mesurer ce que l’on sait et ce que l’on ignore.'],
            ['Selon Marx, la conscience est déterminée par…', ['Les conditions matérielles d’existence', 'L’inconscient', 'Le langage seul', 'La volonté divine'], 0, 'Ce n’est pas la conscience qui détermine la vie, mais la vie la conscience.'],
          ],
        },
        {
          titre: 'Identité et genre',
          lecon: {
            titre: 'Ce qui est donné, ce qui est construit',
            cours: `L’identité désigne à la fois ce qui reste **identique** dans le temps et ce qui **distingue** de tous les autres. Le genre est l’un des lieux où cette double exigence se met le plus visiblement en tension.

## Le problème de l’identité personnelle
| Penseur | Ce qui fait l’identité | Sa difficulté |
| **Locke** | La **conscience**, qui relie les moments par la mémoire | Que devient l’identité quand la mémoire manque ? |
| **Hume** | Rien : seulement « un faisceau de perceptions » | L’unité du moi serait une fiction utile |
| **Ricœur** | Le **récit** qu’on se fait de soi | Il noue l’*idem* et l’*ipse* |

Ricœur distingue en effet l’*idem* — rester le même, la mêmeté — de l’*ipse* — se tenir à ses promesses, l’ipséité. On peut changer entièrement et rester fidèle : c’est l’**identité narrative**.

## Sexe et genre
| Terme | Ce qu’il désigne |
| Le **sexe** | Les caractères biologiques |
| Le **genre** | Les rôles, conduites et attentes qu’une société y associe |

**Simone de Beauvoir** l’anticipe en 1949 : « On ne naît pas femme : on le devient » — la féminité est un produit de l’histoire, non une essence.

## La performativité
**Judith Butler** (*Trouble dans le genre*, 1990) radicalise : le genre n’est pas ce que l’on **est**, c’est ce que l’on **fait** — une série d’actes répétés qui finissent par produire l’illusion d’une nature.

> Point de méthode, décisif en dissertation : dire qu’une chose est **construite** ne signifie pas qu’elle est **fausse** ou facile à défaire. Une construction sociale est réelle et contraignante — c’est même à cela qu’on la reconnaît.

## Les objections
| Objection | Ce qu’elle rappelle |
| Le corps | Ces analyses dissoudraient toute réalité corporelle |
| **Sartre**, *Réflexions sur la question juive* | Une identité peut être **subie** avant d’être choisie : c’est le regard de l’antisémite qui fait le Juif |
| **Amin Maalouf**, *Les Identités meurtrières* (1998) | Réduite à une **seule** appartenance, l’identité devient meurtrière |

## En littérature
Les *Mémoires d’Hadrien* de Yourcenar, *Orlando* de Virginia Woolf — dont le personnage traverse les siècles et change de sexe — ou *Une femme* d’Annie Ernaux montrent que la question du moi ne se sépare pas de celle du genre et de la classe.`,
          },
          questions: [
            ['Sur quoi Locke fonde-t-il l’identité personnelle ?', ['La conscience et la mémoire', 'La substance corporelle', 'Le nom propre', 'La communauté'], 0, 'Ce qui relie les moments, c’est la conscience qu’on en garde.'],
            ['Que trouve Hume lorsqu’il cherche son moi par introspection ?', ['Un faisceau de perceptions, jamais un moi', 'Une substance pensante', 'Une âme immortelle', 'Rien du tout, littéralement'], 0, 'L’unité du moi serait une fiction utile.'],
            ['Ricœur distingue la mêmeté (idem) et l’ipséité (ipse).', ['Vrai', 'Faux'], 0, 'L’identité narrative est le lieu où les deux se nouent.'],
            ['Que soutient Judith Butler sur le genre ?', ['Il est performatif : une série d’actes répétés', 'Il est purement biologique', 'Il est un choix libre et instantané', 'Il n’a aucune réalité'], 0, 'La répétition produit l’illusion d’une nature — et permet le déplacement.'],
            ['Dire qu’une chose est socialement construite signifie qu’elle est irréelle.', ['Vrai', 'Faux'], 1, 'Une construction sociale est réelle et contraignante.'],
            ['Que met en garde Amin Maalouf dans « Les Identités meurtrières » ?', ['Contre l’identité réduite à une seule appartenance', 'Contre le métissage', 'Contre les langues étrangères', 'Contre la mémoire collective'], 0, 'C’est la réduction à une appartenance unique qui rend l’identité meurtrière.'],
            ['Chez Sartre, une identité peut être imposée par le regard d’autrui.', ['Vrai', 'Faux'], 0, '*Réflexions sur la question juive* : c’est l’antisémite qui fait le Juif.'],
            ['Quel roman de Virginia Woolf met en scène un personnage qui change de sexe ?', ['Orlando', 'Mrs Dalloway', 'La Promenade au phare', 'Les Vagues'], 0, 'Publié en 1928, il traverse plusieurs siècles.'],
          ],
        },
        {
          titre: 'Mutilations de la guerre et détention',
          lecon: {
            titre: 'Quand le corps et l’enfermement défont le moi',
            cours: `Ce chapitre pose une question brutale : que reste-t-il du moi lorsqu’on lui retire le **corps intact**, la **liberté de mouvement**, ou le **nom** ?

## Les « gueules cassées »
La Première Guerre mondiale produit une catégorie inédite : des survivants au visage détruit. Le visage étant ce par quoi on est **reconnu**, la mutilation faciale attaque l’identité elle-même.

**Emmanuel Levinas** en donne la clé philosophique : le **visage** d’autrui n’est pas un objet, c’est ce qui m’**oblige**, ce qui me dit « tu ne tueras point ». Détruire un visage, c’est plus que blesser un corps.

| Œuvre | Auteur, date | Ce qu’elle montre |
| *Le Feu* | Barbusse, 1916 | La guerre depuis la tranchée |
| *À l’Ouest, rien de nouveau* | Remarque, 1929 | La génération sacrifiée |
| *Au revoir là-haut* | Pierre Lemaitre, 2013 | Un héros défiguré se fabrique des **masques** — devenir une image faute de redevenir un visage |

## Le corps comme épreuve du moi
**Merleau-Ponty** rappelle qu’on n’**a** pas un corps comme on a un objet : on **est** son corps, c’est par lui qu’on habite le monde.

> D’où la violence particulière de la mutilation : ce n’est pas une possession qui se perd, c’est le **rapport au monde** qui se reconfigure. Le « membre fantôme » en est le signe clinique — le corps vécu ne coïncide pas avec le corps objectif.

## La détention
**Foucault**, dans *Surveiller et punir* (1975), montre le déplacement de la peine.

| | La peine ancienne | La prison moderne |
| Ce qu’elle vise | Le **corps** du supplicié | L’**âme** |
| Ses moyens | Le spectacle du supplice | Discipline, emploi du temps, surveillance continue |
| Son modèle | L’échafaud | Le **panoptique** de Bentham |

Dans le panoptique, le détenu sait qu’il **peut** être vu à tout moment sans savoir **quand** : il finit par se surveiller lui-même. Le pouvoir devient **intérieur** — et c’est là son économie.

## L’expérience concentrationnaire
| Auteur | Œuvre | Ce qu’il établit |
| **Primo Levi** | *Si c’est un homme* (1947) | La « démolition d’un homme » : le nom remplacé par un numéro, les cheveux, les vêtements, le langage |
| **Robert Antelme** | *L’Espèce humaine* (1947) | Il n’existe **pas** plusieurs espèces humaines — et c’est précisément ce que le bourreau tentait de nier |

## Ce que ces expériences enseignent
Que le moi n’est pas une forteresse intérieure indépendante des conditions : il tient à un corps, à un nom, à un regard. Mais aussi qu’il **résiste** — les témoignages existent, et écrire est déjà une reconquête.`,
          },
          questions: [
            ['Que représente le visage chez Levinas ?', ['Ce qui m’oblige, et me dit « tu ne tueras point »', 'Un simple objet de perception', 'Un masque social', 'Une image trompeuse'], 0, 'D’où la gravité particulière de la mutilation faciale.'],
            ['Quel roman de Pierre Lemaitre met en scène un soldat défiguré ?', ['Au revoir là-haut', 'Le Feu', 'Les Croix de bois', 'Voyage au bout de la nuit'], 0, 'Prix Goncourt 2013 : son héros se fabrique des masques.'],
            ['Selon Merleau-Ponty, on a un corps comme on possède un objet.', ['Vrai', 'Faux'], 1, 'On EST son corps : c’est par lui qu’on habite le monde.'],
            ['Que vise la prison moderne selon Foucault ?', ['L’âme, par la discipline et la surveillance', 'Le corps, par le supplice', 'La fortune du condamné', 'La famille du détenu'], 0, '*Surveiller et punir*, 1975.'],
            ['Le panoptique fait que le détenu finit par se surveiller lui-même.', ['Vrai', 'Faux'], 0, 'Il peut être vu à tout moment sans savoir quand : le pouvoir devient intérieur.'],
            ['Que décrit Primo Levi dans « Si c’est un homme » ?', ['La « démolition d’un homme » : le nom remplacé par un numéro', 'La libération des camps', 'Le procès de Nuremberg', 'La vie d’après-guerre'], 0, 'Le camp détruit la personne avant de détruire le corps.'],
            ['Quelle conclusion Robert Antelme tire-t-il de l’expérience concentrationnaire ?', ['Il n’existe pas plusieurs espèces humaines', 'Les bourreaux ne sont pas humains', 'La littérature est impossible', 'Le témoignage est inutile'], 0, '*L’Espèce humaine* (1947) : c’est ce que le bourreau tentait de nier.'],
            ['Le « membre fantôme » montre un écart entre corps vécu et corps objectif.', ['Vrai', 'Faux'], 0, 'C’est l’un des arguments cliniques de la phénoménologie du corps.'],
          ],
        },

        // ---- Chapitre 4 : Création, continuités et ruptures ------------------
        {
          titre: 'La science en question',
          lecon: {
            titre: 'Ce qui fait qu’une science est une science',
            cours: `La science jouit d’une autorité particulière : on la croit sur parole là où l’on discute tout le reste. Ce chapitre demande sur quoi repose cette autorité — et ce qu’elle **ne garantit pas**.

## Le problème de l’induction
Aucun nombre d’observations ne prouve une loi générale : **Hume** le montre dès le XVIIIe siècle. Que le soleil se soit levé chaque jour n’implique pas qu’il se lèvera demain. Toute science empirique repose donc sur un **pari**.

## Les trois réponses
| Penseur | Sa thèse | Sa formule |
| **Popper** | Une théorie est scientifique parce qu’elle est **réfutable**, pas vérifiable | On progresse par « conjectures et réfutations » |
| **Kuhn** | La science ordinaire travaille dans un **paradigme** ; les anomalies s’accumulent, puis il bascule | Les paradigmes ne sont pas toujours commensurables |
| **Bachelard** | Le savoir se construit **contre** l’expérience première | « Le fait scientifique est conquis, construit, constaté » |

> Trois idées à ne jamais confondre en dissertation : **réfutable** (Popper) ne veut pas dire faux ; **paradigme** (Kuhn) ne veut pas dire opinion ; **construit** (Bachelard) ne veut pas dire arbitraire.

Une théorie qui explique **tout**, quel que soit le fait observé, n’est pas plus forte : elle est hors du champ scientifique.

## Ce que la science ne dit pas
| Ce qu’elle établit | Ce qu’elle n’établit pas |
| Ce qui **est** | Ce qui **doit être** |
| Une donnée climatique | La politique à mener |
| Une possibilité technique | La permission de l’employer |

**Hume** encore : on ne déduit pas un devoir d’un fait. **Weber** en tirait la **neutralité axiologique** du savant, et l’obligation de ne pas confondre sa chaire et sa tribune.

## Les défis contemporains
Crise de la reproductibilité, expertise contestée, désinformation organisée. La réponse n’est pas de **renforcer l’autorité** mais d’exposer la **méthode** : ce qui distingue une science, c’est qu’elle expose ce qui pourrait la démentir.`,
          },
          questions: [
            ['Quel critère Popper propose-t-il pour distinguer la science ?', ['La falsifiabilité : une théorie doit pouvoir être réfutée', 'La vérifiabilité', 'L’utilité pratique', 'Le consensus des savants'], 0, 'Une théorie qui explique tout n’est pas plus forte : elle sort du champ.'],
            ['Une théorie réfutable est une théorie fausse.', ['Vrai', 'Faux'], 1, 'Elle est simplement testable : c’est ce qui la rend scientifique.'],
            ['Que désigne un « paradigme » chez Kuhn ?', ['Un cadre partagé de problèmes et de méthodes', 'Une opinion majoritaire', 'Une hypothèse isolée', 'Un instrument de mesure'], 0, 'Les révolutions scientifiques sont des changements de paradigme.'],
            ['Selon Bachelard, le sens commun est un point de départ pour la science.', ['Vrai', 'Faux'], 1, 'C’est un obstacle épistémologique : la science se construit contre lui.'],
            ['En quoi consiste le problème de l’induction posé par Hume ?', ['Aucune série d’observations ne prouve une loi générale', 'Les instruments sont imprécis', 'Les savants se trompent', 'Les mathématiques sont abstraites'], 0, 'Toute science empirique repose donc sur un pari.'],
            ['Peut-on déduire un devoir d’un fait scientifique ?', ['Non : une donnée n’énonce aucune politique', 'Oui, toujours', 'Oui, en science physique', 'Oui, si les données sont sûres'], 0, 'C’est la loi de Hume, reprise par Weber sous le nom de neutralité axiologique.'],
            ['Pour Popper, le progrès scientifique se fait par conjectures et réfutations.', ['Vrai', 'Faux'], 0, 'On ne prouve jamais définitivement : on élimine ce qui résiste mal.'],
            ['Quelle formule résume la position de Bachelard ?', ['« Le fait scientifique est conquis, construit, constaté »', '« Tout est relatif »', '« La nature est un livre écrit en langage mathématique »', '« Je ne feins pas d’hypothèses »'], 0, 'Le fait n’est jamais donné : il est produit par une méthode.'],
          ],
        },
        {
          titre: 'Les arts contemporains : héritages et reniements',
          lecon: {
            titre: 'Rompre avec la tradition, une tradition ?',
            cours: `L’art du XXe siècle s’est défini **contre** : contre l’imitation, contre le métier, contre le musée. Reste à savoir si la rupture est un geste isolé — ou devenue elle-même une norme.

## La fin de l’imitation
Depuis Aristote, l’art était **mimesis**, imitation de la nature. La **photographie** (1839) rend cette fonction techniquement caduque : si la machine copie mieux, l’art doit chercher ailleurs.

| Mouvement | Ce qu’il abandonne |
| Impressionnisme | La ligne, le fini |
| Cubisme | Le point de vue unique |
| Abstraction | Le sujet lui-même |

Le tableau cesse d’être une **fenêtre** pour devenir une **surface**.

## Le geste de Duchamp
En 1917, **Duchamp** présente *Fountain*, un urinoir renversé et signé. Le ready-made déplace la question : ce n’est plus le **faire** qui fait l’œuvre, c’est le **choix** et le contexte de présentation. Le musée devient l’opérateur.

> D’où la question que le chapitre doit tenir jusqu’au bout : si l’art n’est plus défini par le savoir-faire ni par la beauté, **par quoi l’est-il ?**

## Les réponses
| Penseur | Sa réponse |
| **Arthur Danto** | Devant les *Boîtes Brillo* de Warhol (1964), rien de **visible** ne distingue l’œuvre du produit : la différence est **théorique** |
| **George Dickie** | Définition **institutionnelle** : est art ce qu’un monde de l’art traite comme tel |
| **Walter Benjamin** | La reproduction fait perdre l’**aura** — mais c’est aussi une chance politique : l’art sort du culte pour entrer dans l’usage |
| **Adorno** | La culture de masse ne démocratise pas, elle **standardise** ; l’art résiste en n’étant pas immédiatement consommable |

## La rupture comme institution
Les avant-gardes ont fini au **musée**. Ce qui devait scandaliser est aujourd’hui enseigné, coté, patrimonialisé.

C’est la tension à formuler dans un essai : **une transgression qui devient canonique reste-t-elle une transgression ?** Peut-être que la vraie continuité de l’art contemporain est celle de la **question** qu’il pose — non de la réponse qu’il donne.`,
          },
          questions: [
            ['Que déplace le ready-made de Duchamp ?', ['Ce n’est plus le faire qui fait l’œuvre, mais le choix et le contexte', 'La technique picturale', 'Le prix des œuvres', 'La durée de conservation'], 0, '*Fountain*, 1917 : un urinoir renversé et signé.'],
            ['Quelle invention rend l’imitation techniquement caduque au XIXe siècle ?', ['La photographie', 'Le cinéma', 'La lithographie', 'L’imprimerie'], 0, 'Si la machine copie mieux, l’art doit chercher ailleurs.'],
            ['Devant les « Boîtes Brillo », Danto constate que la différence est visible.', ['Vrai', 'Faux'], 1, 'Rien de visible ne distingue l’œuvre du produit : la différence est théorique.'],
            ['Que désigne l’« aura » chez Walter Benjamin ?', ['L’unicité de l’œuvre, liée à un ici et maintenant', 'La renommée de l’artiste', 'La lumière du tableau', 'Le prix de vente'], 0, 'La reproductibilité technique la fait perdre — et ouvre un usage politique.'],
            ['Selon la définition institutionnelle de Dickie, est art…', ['Ce qu’un monde de l’art traite comme tel', 'Ce qui est beau', 'Ce qui est bien fait', 'Ce qui plaît au public'], 0, 'La définition déplace le critère de l’objet vers l’institution.'],
            ['Adorno estime que la culture de masse démocratise l’art.', ['Vrai', 'Faux'], 1, 'Il y voit une standardisation, contre l’optimisme de Benjamin.'],
            ['Depuis Aristote, l’art était défini comme…', ['Mimesis, imitation de la nature', 'Expression du moi', 'Production de beauté pure', 'Artisanat utile'], 0, 'C’est cette définition que le XXe siècle congédie.'],
            ['Les avant-gardes transgressives ont fini par entrer au musée.', ['Vrai', 'Faux'], 0, 'D’où la question : une transgression devenue canonique en est-elle encore une ?'],
          ],
        },
        {
          titre: 'La question de la pop culture',
          lecon: {
            titre: 'Culture de masse, culture légitime',
            cours: `Séries, jeux vidéo, bandes dessinées, musiques populaires : ce que le XXe siècle a tenu pour un divertissement mineur constitue aujourd’hui l’**essentiel** de l’expérience culturelle. La question n’est plus de savoir si c’est de l’art, mais ce que ce déplacement change.

## Le procès d’Adorno et Horkheimer
Dans *La Dialectique de la raison* (1944), ils forgent la notion d’**industrie culturelle** — le mot est choisi **contre** « culture de masse » : les masses ne produisent pas cette culture, elles la reçoivent.

| Le reproche | Ce qu’il vise |
| La **standardisation** | Les mêmes formes répétées sous couvert de nouveauté |
| La **pseudo-individualisation** | Des variantes de surface qui simulent le choix |
| La **distraction** | Elle neutralise la critique : le divertissement prolonge le travail |

## Les réponses
| Penseur | Ce qu’il oppose |
| **Umberto Eco** (1964) | Il refuse le partage entre lucides et naïfs : il faut analyser James Bond avec les mêmes outils que le reste |
| **Stuart Hall**, *cultural studies* | La réception n’est pas passive : lectures **dominantes, négociées ou oppositionnelles** d’un même message |
| **Michel de Certeau** (1980) | Le **braconnage** : l’usager détourne, bricole, réemploie ce qui lui est donné |

## Bourdieu et la légitimité
*La Distinction* (1979) déplace la question du **contenu** vers l’**usage social** : ce qui sépare la culture légitime de la culture populaire n’est pas une propriété des œuvres mais un **rapport de force symbolique**. Les hiérarchies culturelles reconduisent les hiérarchies sociales.

> Le fait décisif, et le meilleur argument du chapitre : **les frontières bougent**. Le roman, le cinéma, le jazz et la bande dessinée ont tous été des divertissements suspects avant d’être des objets d’étude.

## Ce que la pop culture fait aujourd’hui
Elle produit les **mythologies** communes — au sens de **Barthes**, qui analysait déjà en 1957 le catch, la DS ou le bifteck-frites comme des récits collectifs.

Une série regardée par des dizaines de millions de personnes façonne des représentations de la justice, du travail, de la famille. C’est à ce titre qu’elle relève d’un examen **sérieux** : ni complaisance, ni mépris.`,
          },
          questions: [
            ['Pourquoi Adorno et Horkheimer parlent-ils d’« industrie culturelle » ?', ['Parce que les masses ne produisent pas cette culture, elles la reçoivent', 'Parce qu’elle emploie des ouvriers', 'Parce qu’elle est peu coûteuse', 'Parce qu’elle est récente'], 0, 'Le terme est choisi contre celui de « culture de masse ».'],
            ['Que désigne la « pseudo-individualisation » ?', ['Des variantes de surface qui simulent le choix', 'La personnalisation réelle des œuvres', 'L’anonymat des créateurs', 'La signature des artistes'], 0, 'Elle accompagne la standardisation des formes.'],
            ['Umberto Eco oppose radicalement lucides et naïfs face à la culture de masse.', ['Vrai', 'Faux'], 1, 'Il refuse ce partage : *Apocalittici e integrati*, 1964.'],
            ['Que montre Stuart Hall sur la réception des messages ?', ['Elle peut être dominante, négociée ou oppositionnelle', 'Elle est toujours passive', 'Elle est identique pour tous', 'Elle dépend du seul niveau de diplôme'], 0, 'Le public réinterprète ce qu’il reçoit.'],
            ['Michel de Certeau appelle « braconnage »…', ['Le détournement et le réemploi par l’usager', 'Le piratage informatique', 'La copie illégale', 'La critique universitaire'], 0, '*L’Invention du quotidien*, 1980.'],
            ['Selon Bourdieu, la légitimité culturelle est une propriété des œuvres.', ['Vrai', 'Faux'], 1, 'C’est un rapport de force symbolique, qui reconduit les hiérarchies sociales.'],
            ['Qui analyse le catch et le bifteck-frites comme des mythologies modernes ?', ['Roland Barthes', 'Pierre Bourdieu', 'Theodor Adorno', 'Umberto Eco'], 0, '*Mythologies*, 1957.'],
            ['Le roman et le cinéma ont d’abord été des divertissements suspects.', ['Vrai', 'Faux'], 0, 'Les frontières de la légitimité culturelle se déplacent avec le temps.'],
          ],
        },

        // ---- Chapitre 5 : Histoire et violence -------------------------------
        {
          titre: 'La dystopie : la fin de l’utopie',
          lecon: {
            titre: 'Quand la société parfaite devient un cauchemar',
            cours: `L’utopie et la dystopie sont **le même geste retourné** : décrire une société entièrement organisée. La première espère, la seconde avertit.

## L’utopie
**Thomas More** invente le mot en 1516, à partir du grec : *ou-topos*, le lieu de nulle part — avec un jeu possible sur *eu-topos*, le lieu du bonheur. Elle décrit une société idéale, close, réglée, sur une île ; mais son objet **réel** est la société de l’auteur, critiquée par contraste.

Même famille : *La République* de Platon, la *Cité du Soleil* de Campanella, la *Nouvelle Atlantide* de Bacon.

> Ce que l’utopie a toujours en commun : l’**organisation totale**. C’est cela même que la dystopie retourne contre elle.

## Les trois romans qui fixent le genre
| Œuvre | Auteur, date | Le moyen de la servitude |
| *Nous autres* | Zamiatine, 1920 | Des numéros, des maisons de verre, l’ablation chirurgicale de l’imagination |
| *Le Meilleur des mondes* | Huxley, 1932 | Le **plaisir** : conditionnement, castes fabriquées, *soma* |
| *1984* | Orwell, 1949 | La **terreur** et la **langue** : Big Brother, novlangue, double-pensée |

La **novlangue** est le dispositif le plus redoutable : appauvrir le vocabulaire pour rendre la dissidence littéralement **impensable**. La double-pensée fait tenir ensemble deux propositions contradictoires.

## Deux avertissements différents
| | Huxley | Orwell |
| Ce qu’il craint | Qu’on nous prive de liberté en nous **donnant ce que nous désirons** | Qu’on nous l’**arrache par la peur** |
| Le résumé de Postman | Que personne n’ait plus envie de lire | Que les livres soient interdits |

## Pourquoi la dystopie parle de l’histoire
Les dystopies sont écrites **après ou pendant** les totalitarismes : elles ne prédisent pas l’avenir, elles décrivent des mécanismes **réels** — contrôle de l’information, réécriture du passé, fabrique du consentement.

**Arendt**, dans *Les Origines du totalitarisme* (1951), en donne l’analyse théorique : idéologie totale, terreur, destruction de l’espace public.

## La dystopie aujourd’hui
Surveillance de masse, données personnelles, effondrement écologique, biotechnologies : *La Servante écarlate* d’Atwood, *Black Mirror*, les récits post-apocalyptiques. Le genre reste ce qu’il était chez More — un **détour pour parler du présent**.`,
          },
          questions: [
            ['Qui invente le mot « utopie » et en quelle année ?', ['Thomas More, en 1516', 'Platon, au IVe siècle av. J.-C.', 'Orwell, en 1949', 'Campanella, en 1602'], 0, 'Du grec *ou-topos* : le lieu de nulle part.'],
            ['Quel roman de 1920 sert de matrice au genre dystopique ?', ['Nous autres, de Zamiatine', '1984, d’Orwell', 'Le Meilleur des mondes, de Huxley', 'Fahrenheit 451, de Bradbury'], 0, 'Des numéros, des maisons de verre, l’ablation de l’imagination.'],
            ['Dans « Le Meilleur des mondes », la servitude passe par la terreur.', ['Vrai', 'Faux'], 1, 'Elle passe par le plaisir : conditionnement, castes, *soma*.'],
            ['À quoi sert la novlangue dans « 1984 » ?', ['À rendre la dissidence impensable en appauvrissant le vocabulaire', 'À unifier les langues du monde', 'À simplifier l’administration', 'À protéger les secrets d’État'], 0, 'Sans les mots pour la formuler, la contestation devient impossible.'],
            ['L’utopie et la dystopie partagent l’idée d’une organisation totale.', ['Vrai', 'Faux'], 0, 'La dystopie retourne contre l’utopie son propre principe.'],
            ['Quelle est la différence entre les avertissements d’Orwell et de Huxley ?', ['Orwell craint la peur, Huxley le plaisir', 'Orwell craint la technique, Huxley la religion', 'Ils disent la même chose', 'Orwell est optimiste'], 0, 'Interdire les livres, ou faire que personne n’ait plus envie d’en lire.'],
            ['Hannah Arendt analyse le totalitarisme par l’idéologie, la terreur et la destruction de l’espace public.', ['Vrai', 'Faux'], 0, '*Les Origines du totalitarisme*, 1951.'],
            ['« La Servante écarlate » est une dystopie de…', ['Margaret Atwood', 'Ray Bradbury', 'Philip K. Dick', 'Aldous Huxley'], 0, 'Publiée en 1985, elle traite du contrôle des corps des femmes.'],
          ],
        },
        {
          titre: 'Violence et société',
          lecon: {
            titre: 'La violence fonde-t-elle l’ordre, ou le détruit-elle ?',
            cours: `Toute société **interdit** la violence — et toute société en **exerce**. Cette contradiction apparente est le vrai sujet du chapitre.

## L’état de nature
| Penseur | Le diagnostic | Ce qui produit la violence |
| **Hobbes**, *Léviathan* (1651) | « Guerre de tous contre tous » : vie « solitaire, misérable, dangereuse, animale et brève » | L’absence d’État |
| **Rousseau** | L’homme naturel est pacifique et pitoyable | La **société**, la propriété, la comparaison |

Le contrat social échange, chez Hobbes, la liberté illimitée contre la sécurité.

## Le monopole de la violence légitime
**Max Weber** définit l’État moderne par une caractéristique unique : il revendique avec succès le **monopole de la violence physique légitime** sur un territoire.

> La violence n’a pas disparu : elle a été **confisquée et encadrée** — police, justice, armée. D’où la question critique : qu’est-ce qui rend une violence légitime, sinon celui qui la nomme ainsi ?

## Les violences invisibles
| Notion | Qui la forge | Ce qu’elle désigne |
| Violence **symbolique** | **Bourdieu** | Elle s’exerce avec la complicité tacite de ceux qui la subissent, parce qu’ils partagent les catégories qui la font paraître naturelle |
| Violence **structurelle** | **Galtung** | Des inégalités qui tuent sans qu’aucun coup soit porté |

> Ces notions **élargissent** le mot. À manier avec précaution dans un essai : si tout est violence, le mot ne distingue plus rien.

## Girard et le bouc émissaire
| Étape | Ce qui se passe |
| 1. Le **désir mimétique** | Nous désirons ce que l’autre désire |
| 2. La **rivalité** | Le désir partagé devient conflit |
| 3. La **crise** | La violence se généralise |
| 4. Le **bouc émissaire** | Toute la violence est reportée sur une victime arbitrairement désignée |
| 5. L’**unité restaurée** | Le sacrifice refait le groupe |

Les mythes racontent ces meurtres **du point de vue des meurtriers** : c’est ce que Girard prétend décrypter.

## Le procès de la civilisation
| Penseur | Sa thèse |
| **Norbert Elias** | Un processus de civilisation : montée de l’autocontrôle, baisse de la violence interpersonnelle |
| **Freud**, *Malaise dans la civilisation* (1930) | La civilisation s’obtient par le **refoulement** de l’agressivité, qui se retourne en culpabilité — et ressurgit dans la guerre |

## Ce qui reste à trancher
Y a-t-il des violences justes ? **Benjamin** distingue la violence qui **fonde** le droit de celle qui le **conserve**. **Gandhi** et **King** ont opposé une troisième voie — la non-violence organisée, qui n’est pas passivité mais **stratégie**.`,
          },
          questions: [
            ['Comment Hobbes décrit-il l’état de nature ?', ['Une guerre de tous contre tous', 'Un âge d’or pacifique', 'Une société égalitaire', 'Un état inconnaissable'], 0, 'La vie y est « solitaire, misérable, dangereuse, animale et brève ».'],
            ['Rousseau partage le diagnostic de Hobbes sur l’état de nature.', ['Vrai', 'Faux'], 1, 'Pour lui, l’homme naturel est pacifique : c’est la société qui produit la violence.'],
            ['Comment Weber définit-il l’État moderne ?', ['Par le monopole de la violence physique légitime', 'Par la démocratie', 'Par le territoire seul', 'Par la monnaie'], 0, 'La violence n’a pas disparu : elle a été confisquée et encadrée.'],
            ['Que désigne la violence symbolique chez Bourdieu ?', ['Une domination acceptée par ceux qui la subissent', 'Les insultes verbales', 'La violence des images', 'Les menaces sans passage à l’acte'], 0, 'Elle s’exerce grâce aux catégories partagées qui la font paraître naturelle.'],
            ['Selon Girard, le désir mimétique conduit à la rivalité puis au bouc émissaire.', ['Vrai', 'Faux'], 0, 'Le sacrifice d’une victime arbitraire restaure l’unité du groupe.'],
            ['Que soutient Freud dans « Malaise dans la civilisation » ?', ['La civilisation s’obtient par le refoulement de l’agressivité', 'La civilisation supprime l’agressivité', 'La violence est purement culturelle', 'La guerre est impossible'], 0, 'L’agressivité refoulée se retourne en culpabilité — et ressurgit.'],
            ['Norbert Elias décrit une montée de l’autocontrôle dans les sociétés européennes.', ['Vrai', 'Faux'], 0, 'C’est le « processus de civilisation ».'],
            ['La non-violence de Gandhi et King est…', ['Une stratégie organisée, non une passivité', 'Un refus de toute action', 'Une doctrine religieuse exclusivement', 'Une forme de résignation'], 0, 'Elle vise à rendre visible la violence de l’adversaire.'],
          ],
        },
        {
          titre: 'L’histoire de la psychiatrie (Foucault)',
          lecon: {
            titre: 'La folie, l’enfermement et le savoir',
            cours: `*Histoire de la folie à l’âge classique* (1961) est la thèse de **Michel Foucault**. Son objet n’est **pas** la maladie mentale, mais le **partage** entre raison et déraison : comment une société décide de ce qui relève de l’entendement.

## Les trois âges de la folie
| Époque | Le statut du fou | Le dispositif |
| Moyen Âge, Renaissance | Il **circule** et il **parle** | La nef des fous, le bouffon, Érasme, Shakespeare |
| À partir de **1656** | Il est **enfermé** et **tu** | L’**Hôpital général** de Paris |
| Fin du XVIIIe | Il est **observé** | La psychiatrie naissante |

## Le « grand renfermement »
En 1656, on enferme **ensemble** pauvres, oisifs, vénériens, libertins et insensés. Le critère n’est pas médical mais **social et moral** : l’incapacité de travailler.

> La thèse de Foucault : la raison classique ne **réfute** pas la folie, elle l’**exclut**. Le silence de l’interné est la condition du monologue de la raison sur lui.

## La naissance de la psychiatrie
À la fin du XVIIIe siècle, **Pinel** libère les aliénés de leurs chaînes — geste fondateur devenu image d’Épinal. Foucault le relit :

| Ce qu’on retire | Ce qu’on installe |
| Les chaînes | Le **regard médical** |
| La contrainte visible | L’observation et le jugement moral permanents |
| Une violence physique | Une contrainte **intériorisée** |

## Le prolongement
| Œuvre | Année | Ce qu’elle ajoute |
| *Naissance de la clinique* | 1963 | Le regard médical comme savoir-pouvoir |
| *Surveiller et punir* | 1975 | La discipline, le panoptique |
| *La Volonté de savoir* | 1976 | Le **biopouvoir** : un pouvoir qui prend en charge la vie, la santé, la population |

Le pouvoir moderne ne s’exerce plus principalement par l’**interdiction** mais par la **norme** : il produit des savoirs, classe, mesure, corrige.

## Les critiques
| Objection | Qui la porte |
| La chronologie du « grand renfermement » est contestable | Gauchet et Swain, Scull |
| On ne peut faire l’histoire de la folie **elle-même** dans le langage de la raison | **Derrida** |

Ces objections n’annulent pas la méthode : elles rappellent qu’une **archéologie** n’est pas une chronique.

## Ce qu’il faut en retenir pour l’essai
Foucault fournit un **outil** : ne jamais tenir une catégorie pour naturelle. Folie, délinquance, sexualité, normalité sont des **découpages historiques**, produits par des institutions et des savoirs — donc contestables.`,
          },
          questions: [
            ['Quel est l’objet réel de l’« Histoire de la folie » de Foucault ?', ['Le partage historique entre raison et déraison', 'Le traitement des maladies mentales', 'La biographie des aliénistes', 'La chimie des médicaments'], 0, 'Comment une société décide de ce qui relève de l’entendement.'],
            ['De quand Foucault date-t-il le « grand renfermement » ?', ['1656, avec l’Hôpital général de Paris', '1789', '1848', '1789 puis 1900'], 0, 'On y enferme ensemble pauvres, oisifs, libertins et insensés.'],
            ['Le critère du grand renfermement était d’abord médical.', ['Vrai', 'Faux'], 1, 'Il était social et moral : l’incapacité de travailler.'],
            ['Comment Foucault relit-il le geste de Pinel libérant les aliénés ?', ['Une contrainte visible remplacée par une contrainte intériorisée', 'Une libération pure et simple', 'Un échec thérapeutique', 'Une invention légendaire'], 0, 'Le regard médical installe un jugement moral permanent.'],
            ['Que désigne le « biopouvoir » chez Foucault ?', ['Un pouvoir qui prend en charge la vie, la santé, la population', 'Le pouvoir des biologistes', 'La domination de la nature', 'Le droit de vie et de mort du souverain'], 0, 'Il agit par la norme plus que par l’interdiction.'],
            ['Derrida a objecté qu’on ne peut faire l’histoire de la folie dans le langage de la raison.', ['Vrai', 'Faux'], 0, 'Objection célèbre, qui n’annule pas la méthode mais en marque la limite.'],
            ['Avant l’âge classique, le fou était systématiquement enfermé.', ['Vrai', 'Faux'], 1, 'Il circulait, et sa parole avait une place : Érasme, Shakespeare, la nef des fous.'],
            ['Quel outil de méthode Foucault fournit-il pour un essai ?', ['Ne jamais tenir une catégorie pour naturelle', 'Toujours se fier aux statistiques', 'Refuser toute histoire', 'Faire confiance aux institutions'], 0, 'Folie, délinquance, normalité sont des découpages historiques.'],
          ],
        },

        // ---- Chapitre 6 : L'humain et ses limites ----------------------------
        {
          titre: 'Le fantasme de la toute-puissance humaine',
          lecon: {
            titre: 'Prométhée, Faust, et les apprentis sorciers',
            cours: `Le désir de tout pouvoir est aussi ancien que les récits qui en avertissent. Ces récits ne condamnent pas la technique : ils posent la question du **prix**.

## Les mythes fondateurs
| Mythe | Le geste | Le châtiment |
| **Prométhée** | Il vole le feu aux dieux pour les hommes | Le supplice éternel |
| **Icare** | Il vole trop haut | La chute |
| **Babel** | Une tour, une langue unique | La dispersion |
| **Faust** | Il vend son âme contre la connaissance sans limite | La damnation |

## Descartes et la maîtrise
Le *Discours de la méthode* (1637) formule le programme moderne : la science pratique doit nous rendre « **comme** maîtres et possesseurs de la nature ».

> Le « comme » compte, et c’est souvent ce qu’on oublie de citer : Descartes ne **divinise** pas l’homme, il l’assigne à une tâche. Bacon, avant lui : « on ne commande à la nature qu’en lui obéissant ».

## Frankenstein
**Mary Shelley** (1818) sous-titre son roman *Le Prométhée moderne*.

| L’idée reçue | Ce que dit le roman |
| Victor Frankenstein est puni d’avoir **créé** | Il est puni d’avoir **abandonné** sa créature |
| La technique est monstrueuse | C’est le **refus d’en répondre** qui l’est |

D’où la formule utile en essai : la question n’est pas « **peut-on ?** » mais « **qui répondra de ce qui arrivera ?** »

## Le principe responsabilité
**Hans Jonas** (1979) constate que la technique moderne a changé d’**échelle** : ses effets portent sur des générations qui ne peuvent ni consentir ni protester.

| Son apport | Le contenu |
| L’impératif | « Agis de telle sorte que les effets de ton action soient compatibles avec la permanence d’une vie authentiquement humaine sur terre » |
| L’**heuristique de la peur** | Donner plus de poids au pronostic pessimiste, parce que l’enjeu est **irréversible** |

## Heidegger et l’arraisonnement
Pour **Heidegger**, la technique moderne n’est pas un outil neutre : elle est une manière de dévoiler le monde qui le transforme en **fonds disponible** (*Gestell*). Le fleuve n’est plus un fleuve mais une réserve d’énergie.

Ce qui est en jeu n’est pas l’**usage** de la technique, mais le **regard** qu’elle impose.

## Aujourd’hui
Géo-ingénierie, intelligence artificielle, édition du génome, conquête spatiale privée. Le fantasme de toute-puissance n’a pas disparu — il s’est **déplacé de la nature vers l’humain lui-même**, ce qui ouvre la question du transhumanisme et celle de la bioéthique.`,
          },
          questions: [
            ['Quel est le sous-titre de « Frankenstein » de Mary Shelley ?', ['Le Prométhée moderne', 'Le Docteur et le Monstre', 'La Créature', 'L’Apprenti sorcier'], 0, 'Publié en 1818, il place le mythe grec au cœur de la modernité.'],
            ['Quelle est la faute de Victor Frankenstein selon le roman ?', ['Avoir abandonné sa créature', 'Avoir créé un être vivant', 'Avoir étudié la médecine', 'Avoir désobéi à son père'], 0, 'La question se déplace de la puissance vers la responsabilité.'],
            ['Descartes veut rendre l’homme « comme maître et possesseur de la nature ».', ['Vrai', 'Faux'], 0, 'Formule du *Discours de la méthode*, 1637 — le « comme » nuance le projet.'],
            ['Quel impératif Hans Jonas formule-t-il ?', ['Agir pour que les effets soient compatibles avec une vie humaine durable', 'Agir selon son intérêt', 'Ne jamais innover', 'Suivre le progrès technique'], 0, '*Le Principe responsabilité*, 1979 : il vise les générations futures.'],
            ['L’« heuristique de la peur » consiste à donner plus de poids au pronostic pessimiste.', ['Vrai', 'Faux'], 0, 'Parce que l’enjeu — l’irréversible — ne se rattrape pas.'],
            ['Que désigne le « Gestell » chez Heidegger ?', ['L’arraisonnement : le monde réduit à un fonds disponible', 'Un outil de mesure', 'La technique artisanale', 'Le progrès scientifique'], 0, 'Le fleuve cesse d’être un fleuve pour devenir une réserve d’énergie.'],
            ['Le mythe de Prométhée présente la technique comme un don arraché aux dieux.', ['Vrai', 'Faux'], 0, 'Et puni : la technique a un prix, c’est ce que dit le mythe.'],
            ['Quelle formule de Bacon accompagne le projet moderne ?', ['« On ne commande à la nature qu’en lui obéissant »', '« La nature est un livre »', '« Rien ne se perd, rien ne se crée »', '« Connais-toi toi-même »'], 0, 'La maîtrise passe par la connaissance des lois, non par la force.'],
          ],
        },
        {
          titre: 'La conscience écologique',
          lecon: {
            titre: 'Habiter une planète que l’on abîme',
            cours: `La crise écologique n’est pas seulement un problème technique : elle oblige à **repenser ce que l’humanité est**, et ce qu’elle doit aux vivants qui ne sont pas elle.

## La rupture conceptuelle
Le concept d’**Anthropocène**, popularisé par Crutzen en 2000, énonce que l’activité humaine est devenue une **force géologique**.

> Conséquence philosophique lourde : la distinction entre **histoire humaine** et **histoire naturelle**, qui structurait toute la pensée moderne, ne tient plus. **Bruno Latour** en tire l’idée que nous n’avons jamais été aussi peu séparés de la nature qu’au moment où nous croyions l’avoir dominée.

## Généalogie du problème
| L’accusation | Ce qu’elle vise |
| Lynn White | Le récit biblique de la domination : « soumettez la terre » |
| La modernité cartésienne | La nature réduite à un objet mesurable |
| L’économie extractive | La nature réduite à une ressource |
| **Descola**, *Par-delà nature et culture* (2005) | Le partage nature / culture est une **singularité occidentale** : d’autres sociétés le découpent autrement |

## Élargir le cercle moral
| Penseur | Qui il inclut | Sur quel critère |
| **Hans Jonas** | Les **générations futures** | Elles ne peuvent ni consentir ni réclamer |
| **Aldo Leopold** (1949) | La **communauté biotique** | Est juste ce qui préserve son intégrité et sa beauté |
| **Peter Singer** | Les êtres **sensibles** | La capacité de souffrir — d’où l’antispécisme |
| **Arne Næss** | La nature entière | Elle a une **valeur intrinsèque** : écologie profonde contre écologie superficielle |

> Toute la discussion tient dans une seule question : la nature vaut-elle **pour nous**, ou **en elle-même** ?

## Les objections
| Objection | Ce qu’elle avance |
| **Luc Ferry**, *Le Nouvel Ordre écologique* (1992) | Une écologie qui subordonne l’humain à un tout est dangereuse |
| L’objection juridique | On ne peut accorder des **droits** à des entités incapables de **devoirs** |
| L’écologie politique | La crise est d’abord une question de **justice** : les moins responsables en subissent les effets les plus lourds |

## Ce que la littérature apporte
*Walden* de Thoreau, *L’Homme qui plantait des arbres* de Giono, *Le Baron perché* de Calvino, la *nature writing* contemporaine : elles ne démontrent pas, elles rendent **sensible** un rapport au monde.

Dans une crise où les chiffres ne suffisent pas à faire agir, ce n’est pas rien.`,
          },
          questions: [
            ['Que désigne l’Anthropocène ?', ['L’activité humaine devenue une force géologique', 'L’ère des grands singes', 'La période d’avant l’industrie', 'Une théorie économique'], 0, 'Concept popularisé par Crutzen vers 2000.'],
            ['L’Anthropocène remet en cause la séparation entre histoire humaine et histoire naturelle.', ['Vrai', 'Faux'], 0, 'C’est sa conséquence philosophique la plus lourde.'],
            ['Que montre Philippe Descola dans « Par-delà nature et culture » ?', ['Le partage nature/culture est une singularité occidentale', 'La nature est une invention récente', 'Les cultures sont toutes identiques', 'La nature n’existe pas'], 0, 'D’autres sociétés découpent le monde autrement.'],
            ['Sur quel critère Peter Singer étend-il la considération morale ?', ['La sensibilité, la capacité à souffrir', 'L’intelligence', 'L’appartenance à une espèce', 'L’utilité économique'], 0, 'D’où sa critique du spécisme.'],
            ['L’écologie profonde d’Arne Næss reconnaît à la nature une valeur intrinsèque.', ['Vrai', 'Faux'], 0, 'Par opposition à l’écologie superficielle, qui la protège pour notre utilité.'],
            ['Que formule Aldo Leopold dans son « éthique de la terre » ?', ['Est juste ce qui préserve l’intégrité de la communauté biotique', 'La terre appartient à ceux qui la cultivent', 'La nature doit être laissée intacte partout', 'L’homme est au sommet du vivant'], 0, '*Almanach d’un comté des sables*, 1949.'],
            ['Luc Ferry met en garde contre une écologie qui subordonnerait l’humain à un tout.', ['Vrai', 'Faux'], 0, '*Le Nouvel Ordre écologique*, 1992.'],
            ['Selon Bruno Latour, la modernité nous a réellement séparés de la nature.', ['Vrai', 'Faux'], 1, 'Il soutient l’inverse : nous n’avons jamais été aussi liés qu’en croyant dominer.'],
          ],
        },
        {
          titre: 'La bioéthique',
          lecon: {
            titre: 'Ce que la technique permet, ce que la loi autorise',
            cours: `La bioéthique naît d’un **écart** : la médecine peut faire des choses sur lesquelles aucune tradition morale ne s’était prononcée. Elle ne consiste pas à interdire, mais à décider **au nom de quoi** on autorise.

## L’origine : les crimes et le consentement
| Texte | Date | Ce qu’il pose |
| **Code de Nuremberg** | 1947 | Le **consentement volontaire** du sujet humain est « absolument essentiel » |
| Déclaration d’**Helsinki** | 1964 | Il l’étend à toute la recherche médicale |

Rédigé après le procès des médecins nazis, le code de Nuremberg fonde toute la bioéthique moderne sur un seul principe : **le corps n’est pas un matériau disponible**.

## Les quatre principes
Beauchamp et Childress (1979) proposent un cadre encore employé.

| Principe | Ce qu’il exige |
| **Autonomie** | Respecter la décision informée de la personne |
| **Bienfaisance** | Agir pour son bien |
| **Non-malfaisance** | *Primum non nocere* : d’abord ne pas nuire |
| **Justice** | L’équité dans l’accès aux soins et la répartition des ressources |

> Leur intérêt est aussi leur difficulté : ils **entrent en conflit**. Le débat bioéthique consiste le plus souvent à arbitrer entre l’**autonomie** du patient et la **bienfaisance** du soignant.

## Les grands dossiers
| Domaine | La question ouverte | L’état du droit français |
| **Début de vie** | Quel statut pour l’embryon ? | IVG, PMA ; GPA interdite |
| **Fin de vie** | Jusqu’où accompagner ? | Lois **Leonetti** (2005) et **Claeys-Leonetti** (2016) : sédation profonde et continue, pas d’euthanasie active |
| **Génome** | Modifier les cellules **germinales** ? | Moratoire international — franchi en 2018 par He Jiankui, condamné en Chine |
| Don, données de santé, IA | Qui décide, qui contrôle ? | En construction |

**CRISPR-Cas9** (2012) a rendu l’édition génétique simple et peu coûteuse : c’est ce qui a fait passer la question du laboratoire au débat public.

## Dignité et transhumanisme
**Kant** fournit l’argument le plus employé : la personne a une **dignité**, non un **prix** ; elle ne doit jamais être traitée « simplement comme un moyen ».

**Habermas** (*L’Avenir de la nature humaine*, 2001) objecte au transhumanisme que programmer génétiquement un enfant **rompt l’égalité entre générations** : celui qui a été conçu selon un projet ne peut plus se considérer comme l’auteur unique de sa vie.

## La méthode française
Le **CCNE** (créé en 1983), les lois de bioéthique révisées périodiquement, les états généraux : le choix assumé est celui d’une éthique **délibérative et révisable**, plutôt que de principes fixés une fois pour toutes.`,
          },
          questions: [
            ['Quel principe le code de Nuremberg pose-t-il en 1947 ?', ['Le consentement volontaire du sujet est essentiel', 'La gratuité des soins', 'Le secret médical', 'La liberté de la recherche'], 0, 'Il est rédigé après le procès des médecins nazis.'],
            ['Quels sont les quatre principes de Beauchamp et Childress ?', ['Autonomie, bienfaisance, non-malfaisance, justice', 'Liberté, égalité, fraternité, laïcité', 'Vérité, prudence, courage, tempérance', 'Utilité, plaisir, sécurité, ordre'], 0, 'Leur difficulté est qu’ils entrent régulièrement en conflit.'],
            ['La loi Claeys-Leonetti de 2016 autorise l’euthanasie active en France.', ['Vrai', 'Faux'], 1, 'Elle admet la sédation profonde et continue, pas l’euthanasie active.'],
            ['Qu’est-ce que CRISPR-Cas9 ?', ['Un outil d’édition génétique simple et peu coûteux', 'Un vaccin', 'Un test de dépistage', 'Un logiciel médical'], 0, 'Disponible depuis 2012, il a rendu l’édition du génome accessible.'],
            ['La modification des cellules germinales est transmissible aux descendants.', ['Vrai', 'Faux'], 0, 'D’où le moratoire international, franchi en 2018 par He Jiankui.'],
            ['Quel argument kantien est le plus employé en bioéthique ?', ['La personne a une dignité, non un prix', 'Le bonheur du plus grand nombre', 'La loi du plus fort', 'Le contrat social'], 0, 'Ne jamais traiter l’humanité « simplement comme un moyen ».'],
            ['Que reproche Habermas à la programmation génétique d’un enfant ?', ['Elle rompt l’égalité entre les générations', 'Elle coûte trop cher', 'Elle est techniquement impossible', 'Elle est contraire à la religion'], 0, '*L’Avenir de la nature humaine*, 2001.'],
            ['Les questions de bioéthique se tranchent par la science seule.', ['Vrai', 'Faux'], 1, 'La science ne dit jamais ce qui doit être : la décision est politique.'],
          ],
        },
      ],
    },
  ],
}
