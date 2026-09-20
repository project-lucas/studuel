-- =============================================================================
-- Studuel — Migration 340 : LE COURS SUR LES DÉTERMINANTS ANGLAIS, SCHÉMATISÉ
--
-- CONSTAT. « A, an, the — et l'article zéro » est la première fiche de grammaire
-- de l'anglais, et la plus consultée : c'est le chapitre 1 du groupe nominal,
-- servi à l'identique en 2de, en 1re et en Terminale. Il était rédigé en quatre
-- paragraphes de prose pleine. Or ce cours n'est PAS de la prose : c'est une
-- décision à trois branches (identifié → the ; singulier dénombrable → a/an ;
-- sinon → rien) et quatre tableaux d'oppositions. Rendu en paragraphes, l'élève
-- devait reconstruire lui-même la grille — exactement le travail que la fiche
-- est censée lui épargner. Et le point qui coûte le plus de points au bac,
-- l'article zéro, n'y tenait qu'en une phrase noyée en milieu de troisième
-- paragraphe.
--
-- CE QUE CHANGE CETTE MIGRATION. Le même contenu, mis en forme par ce que le
-- rendu des leçons sait déjà peindre (cf. components/LessonRichContent) :
--
--   · l'arbre de décision en 3 étapes numérotées, en TÊTE de fiche ;
--   · un tableau à double entrée (identifié × dénombrable) qui donne les six
--     cas d'un coup d'œil, article zéro compris — noté « Ø », une case vide
--     n'existant pas en français ;
--   · le son contre la lettre pour a/an, en tableau ;
--   · les quatre fautes de l'article zéro en tableau « Faux / Juste », avec le
--     test qui tranche (« si l'on peut ajouter en général, c'est zéro ») ;
--   · this/that, le génitif et les possessifs, chacun sous son tableau.
--
-- Les 8 questions du quiz restent toutes couvertes par le cours : h muet,
-- university, life is hard, the Netherlands, students' bags, his sister,
-- these/those, superlatif. Aucune n'est orpheline.
--
-- ÉCRITURE PURE : aucune ligne créée ni supprimée, aucun UUID touché. Seule la
-- colonne `content` des trois leçons change — leur id, leur chapitre, leur quiz
-- et la progression des élèves qui les ont déjà lues sont intacts.
--
-- Idempotent : un UPDATE de valeur constante, gardé par le titre de la leçon.
-- Rejouable sans risque, et sans effet si les fiches ont déjà été mises à jour.
--
-- PRÉREQUIS : 226, 266 et 286 exécutées.
-- À exécuter dans : Supabase Dashboard → SQL Editor → New query → Run.
-- =============================================================================

-- Le cours, une fois pour les trois niveaux ---------------------------------
-- Le garde sur le titre n'est pas décoratif : si l'un de ces UUID désignait un
-- jour une autre fiche, l'UPDATE ne ferait rien plutôt que d'écraser un cours
-- étranger.
UPDATE public.lessons AS l
   SET content = v.content
  FROM (VALUES
    (E'Devant un nom anglais, il n’y a que trois possibilités : **a/an**, **the**, ou **rien du tout**. Le choix se joue toujours sur la même question : de quoi parle-t-on exactement ?\n\n## L’arbre de décision\n1. Mon interlocuteur sait-il **de quel exemplaire** je parle ? → **the**\n2. Sinon, est-ce un **singulier dénombrable** ? → **a / an**\n3. Sinon — pluriel ou indénombrable pris au sens général → **article zéro** : on n’écrit rien.\n\n| Le nom est… | Non identifié | Identifié |\n| Singulier dénombrable | **a** *book* | **the** *book* |\n| Pluriel | **Ø** *books* | **the** *books* |\n| Indénombrable | **Ø** *water* | **the** *water* |\n\n**Ø** est l’article zéro : la case est vide, on ne met rien. C’est la colonne qui n’existe pas en français, où l’on dirait « des livres », « de l’eau » — et c’est là que se logent presque toutes les fautes.\n\n## a / an : c’est le son qui décide\nLa règle ne regarde pas la lettre écrite, mais le son que l’on prononce.\n\n| On écrit | Devant un son de… | Exemples |\n| **a** | consonne | *a book*, *a university* (« you- »), *a European* |\n| **an** | voyelle | *an apple*, *an hour* (h muet), *an MP* (« em-pi ») |\n\n> Prononce le mot avant de l’écrire : *a university*, mais *an hour*. La lettre ment, le son jamais.\n\n*A / an* ne s’emploie **qu’au singulier dénombrable**. Deux emplois s’y ajoutent, sans équivalent en français :\n- le **métier** ou la fonction : *She is a dentist*, *He became a teacher* ;\n- la **fréquence** ou le prix : *twice a week*, *five euros a kilo*.\n\n## the : ce qui est déjà identifié\n**The** dit « celui-là, tu vois lequel ». Quatre façons de le savoir :\n\n1. le nom a **déjà été mentionné** : *I bought a car. The car is red.*\n2. le **contexte ou une relative** le précise : *the book I bought*\n3. l’objet est **unique** au monde : *the sun*, *the moon*, *the Queen*\n4. c’est un **superlatif** : *the best student in the class*\n\nS’y ajoute une liste de noms propres qui, eux, gardent l’article : les fleuves (*the Thames*), les océans (*the Atlantic*), les chaînes de montagnes (*the Alps*), et les pays au pluriel ou composés (*the United States*, *the Netherlands*, *the United Kingdom*).\n\n## L’article zéro : le piège n° 1 du bac\nUn **indénombrable** ou un **pluriel** pris au **sens général** ne prend aucun article. Le français, lui, en met un — d’où la faute, systématique.\n\n| Ce qu’on veut dire | Faux | Juste |\n| La vie est dure | *The life is hard* | *Life is hard* |\n| J’aime la musique | *I like the music* | *I like music* |\n| Les chiens sont fidèles | *The dogs are loyal* | *Dogs are loyal* |\n| L’eau est indispensable | *The water is essential* | *Water is essential* |\n\n> Dès que la phrase parle de la chose **en général**, et non d’un exemplaire précis, l’anglais n’écrit rien.\n\nLe test qui tranche en une seconde : si l’on peut ajouter « en général » à la fin de la phrase française sans la déformer, c’est l’article zéro.\n\n## this, that, these, those\nCes déterminants **montrent** : ils situent le nom par rapport à celui qui parle.\n\n| Distance | Singulier | Pluriel |\n| Proche — ici, maintenant | *this* | *these* |\n| Éloigné — là-bas, autrefois | *that* | *those* |\n\n*This exercise is easy* (celui que j’ai sous les yeux) · *Those days are gone* (une époque révolue).\n\n## Le génitif : à qui appartient la chose\n| Le possesseur est… | On ajoute | Exemple |\n| un singulier | ’s | *Peter’s car* |\n| un pluriel en -s | l’apostrophe seule | *the students’ bags* |\n| un pluriel irrégulier | ’s | *the children’s toys* |\n\n> Le génitif se lit à l’envers du français : *Peter’s car*, c’est « la voiture **de** Peter ». Le possesseur passe devant.\n\n## Les possessifs s’accordent avec le possesseur\n| Sujet | Possessif | Exemple |\n| *I* | *my* | *my sister* |\n| *you* | *your* | *your bag* |\n| *he* | *his* | *his sister* |\n| *she* | *her* | *her brother* |\n| *it* | *its* | *its colour* |\n| *we* | *our* | *our school* |\n| *they* | *their* | *their books* |\n\n> C’est le **possesseur** qui commande, jamais l’objet possédé : *his sister* si c’est la sœur de Paul, *her brother* si c’est le frère de Marie. Le français dirait « sa » dans les deux cas.\n\nDernier réflexe à prendre : *its* (le possessif) ne prend **pas d’apostrophe**. *It’s* avec apostrophe est la contraction de *it is*.'::text)
  ) AS v(content)
 WHERE l.id IN (
    '466b7a0c-244e-51e4-a48c-f14c948469f8'::uuid,  -- Tle (migration 226)
    '1b3b3b73-3d8c-5c3c-8221-c8bd8da22b02'::uuid,  -- 1re (migration 266)
    'bee7a60a-40ce-5cd7-91b2-da307a8dd108'::uuid  -- 2de (migration 286)
       )
   AND l.title = 'A, an, the — et l’article zéro';

-- Contrôle -----------------------------------------------------------------
-- Doit renvoyer 3 lignes, toutes à `ok = true`.
SELECT c.level,
       l.title,
       length(l.content)                              AS taille,
       l.content LIKE '%## L’arbre de décision%'       AS ok
  FROM public.lessons l
  JOIN public.chapters c ON c.id = l.chapter_id
 WHERE l.id IN (
    '466b7a0c-244e-51e4-a48c-f14c948469f8'::uuid,
    '1b3b3b73-3d8c-5c3c-8221-c8bd8da22b02'::uuid,
    'bee7a60a-40ce-5cd7-91b2-da307a8dd108'::uuid
       )
 ORDER BY c.level;
