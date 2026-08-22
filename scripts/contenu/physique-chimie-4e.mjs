// Physique-Chimie — Quatrième : LE PROGRAMME COMPLET (31 fiches).
//
// LE DÉFAUT. La page « Physique-Chimie » d'un élève de 4e s'ouvre sur QUATRE
// fiches héritées du tout premier jeu de données (migration 008, contenu rempli
// par la 109) : « L'air et ses propriétés », « Les transformations chimiques »,
// « Intensité et tension électriques » et « Vitesse et mouvement ». Quatre
// lignes pour une année entière.
//
// CE QUE L'ÉLÈVE DOIT VOIR — exactement ce que montre la maquette de référence
// pour la 4e, et c'est le même découpage qu'en 3e, chapitre pour chapitre et
// fiche pour fiche : 7 chapitres, 31 fiches.
//   1. Les états de la matière                    (6)   5. L'énergie              (4)
//   2. Les transformations chimiques              (5)   6. Les circuits électriques (6)
//   3. L'organisation de la matière dans l'Univers (3)  7. Les signaux            (4)
//   4. Mouvements et interactions                 (3)
//
// POURQUOI IMPORTÉ ET NON RÉÉCRIT. Ce n'est pas une facilité, c'est la structure
// même du programme : le BO écrit la physique-chimie pour le **cycle 4** tout
// entier (5e, 4e, 3e) et non niveau par niveau — les mêmes quatre thèmes
// (organisation de la matière, mouvements et interactions, énergie, signaux) s'y
// approfondissent d'année en année, sans changer de découpage. La maquette de
// référence en tire la conséquence : elle affiche les MÊMES 31 fiches en 4e
// qu'en 3e. On importe donc les 31 chapitres de `physique-chimie-3e.mjs` sans y
// toucher, et on les republie sur le niveau '4e' : les UUID, dérivés de
// `slug|niveau|titre`, sont différents, le contenu est le même, et une
// correction faite une fois vaut pour les deux niveaux.
//
// C'est le geste des migrations 266, 267, 276, 286-288, 297 et 299, appliqué
// pour la première fois à une matière scientifique — parce que c'est le
// programme lui-même, et non la seule commodité, qui le justifie ici.
//
// ⚠️ Le slug `physique-chimie` porte désormais CINQ modules
// (`physique-chimie-tle.mjs` = 252, `physique-chimie-1re.mjs` = 270,
// `physique-chimie-2de.mjs` = 289, `physique-chimie-3e.mjs` = 295, celui-ci =
// 302) : ne JAMAIS générer avec `--slugs physique-chimie`. Toujours
// `--modules physique-chimie-4e`.

import physiqueChimie3e from './physique-chimie-3e.mjs'

// Les 31 fiches de 3e, telles quelles — chacune porte déjà son chapitre de
// programme (`axe`), le module de 3e ayant été écrit après la colonne
// `chapters.theme`.
//
// Le `throw` n'est pas décoratif : si un `axe` disparaissait de
// `physique-chimie-3e.mjs`, la fiche partirait sans chapitre et la page la
// rangerait dans un bloc « Autres chapitres » — le défaut même que cette
// migration corrige. Mieux vaut que la génération s'arrête.
const chapitres = physiqueChimie3e.blocs[0].chapitres.map((ch) => {
  if (!ch.axe) throw new Error(`physique-chimie-4e : aucun chapitre de programme pour « ${ch.titre} »`)
  return { ...ch }
})

export default {
  slug: 'physique-chimie',
  nom: 'Physique-Chimie',

  titreMigration: 'LA PHYSIQUE-CHIMIE DE QUATRIÈME, RENDUE À SON PROGRAMME (31 fiches)',

  motif: `LE DÉFAUT : la physique-chimie de 4e n'avait que les 4 fiches du premier jeu de
données de l'app — « L'air et ses propriétés », « Les transformations
chimiques », « Intensité et tension électriques », « Vitesse et mouvement ». Un
élève qui révisait les changements d'état, la masse volumique, les ions, le pH,
les constituants de l'atome, les forces, l'énergie cinétique, la loi d'Ohm, la
lumière ou le son ne trouvait RIEN.
CE QUE FAIT CETTE MIGRATION : elle rend à la matière son programme — 7 chapitres
et leurs 31 fiches, aux positions 1 à 31. Les 4 fiches héritées partent, leurs
quiz et leurs lignes de la file « À revoir » avec elles.
LE CONTENU EST CELUI DE LA 3e, et c'est le programme lui-même qui le veut : le
BO écrit la physique-chimie pour le CYCLE 4 tout entier (5e, 4e, 3e), les mêmes
quatre thèmes s'y approfondissant d'année en année sans changer de découpage. La
maquette de référence affiche d'ailleurs les mêmes 31 fiches aux deux niveaux.
Une correction faite une fois vaut désormais pour les deux.
PÉRIMÈTRE : la QUATRIÈME SEULE. La 5e garde ses fiches héritées — le ménage est
borné à level = '4e', sans quoi il la viderait sans rien mettre à la place.`,

  menage: [
    {
      raison: `La colonne de rangement d'abord : theme (migration 234) porte le chapitre du
programme, et l'INSERT l'écrit pour les 31 fiches. Elle est REPRISE ici en ADD
COLUMN IF NOT EXISTS, comme dans les migrations 243 à 299 — la 234 n'a jamais été
exécutée telle quelle.
Le ménage qui suit LIT cette colonne : elle doit exister avant lui, pas seulement
avant les insertions.
Le GRANT n'est pas décoratif : la 182 a révoqué le SELECT de table sur chapters
(pour cacher mind_map) et ne l'a rendu que colonne par colonne ; une colonne
ajoutée après elle n'hérite d'aucun droit, et l'app lirait « permission denied »
au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 4 fiches héritées de la 008 partent, au niveau 4e SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE, et c'est ici plus qu'une précaution :
« Les transformations chimiques » est à la fois le titre d'une fiche héritée ET
le nom d'un CHAPITRE du programme neuf. Un ménage par titre serait à la fois
inutilement fragile (« L'air et ses propriétés » porte une apostrophe dont rien
ne garantit la forme en base) et trompeur à la lecture. Le critère « pas de
chapitre de programme » vise exactement les quatre lignes voulues : elles datent
de la 008, bien avant la colonne theme, tandis que les 31 fiches neuves en
portent une dès l'INSERT — le ménage tourne AVANT les insertions et ne peut donc
jamais mordre sur elles, ni au premier passage ni au rejeu.
Le filtre level = '4e' est indispensable : la physique-chimie existe sur six
niveaux, et la 5e porte elle aussi des chapitres sans theme.
L'ordre compte : la file « À revoir » d'abord (review_items.item_id n'a PAS de
clé étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL : ils
survivraient orphelins, mais toujours tirables par le moteur de questions), puis
les chapitres, dont les leçons partent en cascade.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'physique-chimie'
   AND c.level = '4e'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'physique-chimie'
   AND c.level = '4e'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'physique-chimie'
   AND c.level = '4e'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['4e'],
      // Les 4 fiches héritées viennent d'être supprimées par le ménage : la
      // numérotation repart de 1, comme en 3e.
      chapitres,
    },
  ],
}
