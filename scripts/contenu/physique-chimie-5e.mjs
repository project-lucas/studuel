// Physique-Chimie — Cinquième : LE PROGRAMME COMPLET (31 fiches).
//
// LE DÉFAUT. La page « Physique-Chimie » d'un élève de 5e s'ouvre sur QUATRE
// fiches héritées du tout premier jeu de données (migration 008, contenu rempli
// par la 100) : « Les états de la matière », « Les mélanges et solutions »,
// « Circuits électriques simples » et « La lumière : sources et propagation ».
// Quatre lignes pour l'année d'entrée dans la matière.
//
// CE QUE L'ÉLÈVE DOIT VOIR — exactement ce que montre la maquette de référence
// pour la 5e, et c'est le même découpage qu'en 4e et en 3e, chapitre pour
// chapitre et fiche pour fiche : 7 chapitres, 31 fiches.
//
// POURQUOI IMPORTÉ. Le BO écrit la physique-chimie pour le **cycle 4** tout
// entier (5e, 4e, 3e) : les mêmes quatre thèmes — organisation de la matière,
// mouvements et interactions, énergie, signaux — s'y approfondissent d'année en
// année sans changer de découpage, et la maquette affiche les MÊMES 31 fiches
// aux trois niveaux. On importe donc les 31 chapitres de
// `physique-chimie-3e.mjs` sans y toucher, et on les republie sur le niveau
// '5e' : les UUID, dérivés de `slug|niveau|titre`, sont différents, le contenu
// est le même, et une correction faite une fois vaut pour les trois niveaux.
//
// ⚠️ UNE COLLISION DE TITRE, ET ELLE EST EXACTE. La fiche héritée « Les états de
// la matière » porte le titre EXACT d'une fiche du programme neuf, et `chapters`
// porte UNIQUE(subject_id, level, title). Le ménage est donc OBLIGATOIRE — sans
// lui, l'INSERT tomberait dans le ON CONFLICT DO NOTHING et la leçon échouerait
// sur une clé étrangère absente. Et c'est le repère `theme IS NULL` qui rend le
// REJEU sûr : borné au titre, le ménage supprimerait au second passage la fiche
// neuve, qui porte le même titre.
//
// ⚠️ Le slug `physique-chimie` porte désormais SIX modules
// (`physique-chimie-tle.mjs` = 252, `-1re` = 270, `-2de` = 289, `-3e` = 295,
// `-4e` = 302, celui-ci = 309) : ne JAMAIS générer avec
// `--slugs physique-chimie`. Toujours `--modules physique-chimie-5e`.

import physiqueChimie3e from './physique-chimie-3e.mjs'

// Les 31 fiches de 3e, telles quelles — chacune porte déjà son chapitre de
// programme (`axe`). Le `throw` n'est pas décoratif : sans `axe`, la fiche
// échapperait au repère `theme IS NULL` du ménage, qui la supprimerait au rejeu
// suivant.
const chapitres = physiqueChimie3e.blocs[0].chapitres.map((ch) => {
  if (!ch.axe) throw new Error(`physique-chimie-5e : aucun chapitre de programme pour « ${ch.titre} »`)
  return { ...ch }
})

export default {
  slug: 'physique-chimie',
  nom: 'Physique-Chimie',

  titreMigration: 'LA PHYSIQUE-CHIMIE DE CINQUIÈME, RENDUE À SON PROGRAMME (31 fiches)',

  motif: `LE DÉFAUT : la physique-chimie de 5e n'avait que les 4 fiches du premier jeu de
données de l'app — « Les états de la matière », « Les mélanges et solutions »,
« Circuits électriques simples », « La lumière : sources et propagation ». Un
élève qui révisait les changements d'état, la masse volumique, les ions, le pH,
les constituants de l'atome, les forces, l'énergie cinétique, la loi d'Ohm ou le
son ne trouvait RIEN.
CE QUE FAIT CETTE MIGRATION : elle rend à la matière son programme — 7 chapitres
et leurs 31 fiches, aux positions 1 à 31. Les 4 fiches héritées partent, leurs
quiz et leurs lignes de la file « À revoir » avec elles.
LE CONTENU EST CELUI DE LA 3e ET DE LA 4e, et c'est le programme lui-même qui le
veut : le BO écrit la physique-chimie pour le CYCLE 4 tout entier, les mêmes
thèmes s'y approfondissant d'année en année sans changer de découpage.
PÉRIMÈTRE : la CINQUIÈME SEULE — le ménage est borné à level = '5e'.`,

  menage: [
    {
      raison: `La colonne de rangement d'abord : theme (migration 234) porte le chapitre du
programme, et l'INSERT l'écrit pour les 31 fiches. Elle est REPRISE ici en ADD
COLUMN IF NOT EXISTS, comme dans les migrations 243 à 305.
Le ménage qui suit LIT cette colonne, et c'est lui qui protège les fiches neuves
d'un rejeu : elle doit exister avant lui, pas seulement avant les insertions.
Le GRANT n'est pas décoratif : la 182 a révoqué le SELECT de table sur chapters
et ne l'a rendu que colonne par colonne.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 4 fiches héritées de la 008 partent, au niveau 5e SEULEMENT.

CE MÉNAGE EST OBLIGATOIRE, pas seulement souhaitable : « Les états de la
matière » est à la fois un titre hérité et le titre d'une fiche du programme
neuf, et chapters porte UNIQUE(subject_id, level, title). Sans ménage préalable,
cet INSERT tomberait dans le ON CONFLICT DO NOTHING et sa leçon échouerait
ensuite sur une clé étrangère absente — la migration s'arrêterait à mi-parcours.

LE REPÈRE EST theme IS NULL, ET C'EST CE QUI REND LE REJEU SÛR. Borné au titre,
le ménage supprimerait au second passage la fiche NEUVE qui porte ce même titre.
L'ancienne série date de la 008, bien avant la colonne theme, tandis que les 31
fiches neuves en portent une dès l'INSERT : la distinction est exacte et stable.
Elle évite au passage la question de l'apostrophe de « La lumière : sources et
propagation ».
Le filtre level = '5e' est indispensable : la physique-chimie existe sur six
niveaux, et la 4e comme la 3e sont traitées par leurs propres migrations.
L'ordre compte : la file « À revoir » d'abord (review_items.item_id n'a PAS de
clé étrangère), puis les quiz (quizzes.lesson_id est ON DELETE SET NULL), puis
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
   AND c.level = '5e'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'physique-chimie'
   AND c.level = '5e'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'physique-chimie'
   AND c.level = '5e'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['5e'],
      chapitres,
    },
  ],
}
