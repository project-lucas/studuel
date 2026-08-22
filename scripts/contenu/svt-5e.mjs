// SVT — Cinquième : LE PROGRAMME COMPLET (31 fiches).
//
// LE DÉFAUT. La page « SVT » d'un élève de 5e s'ouvre sur CINQ fiches héritées du
// tout premier jeu de données (migration 008) : « La nutrition des êtres
// vivants », « La respiration en milieux variés », « Géologie externe : les
// paysages », « La reproduction sexuée » et « Les besoins de l'organisme ». Cinq
// lignes pour l'année d'entrée dans le cycle 4.
//
// CE QUE L'ÉLÈVE DOIT VOIR — exactement ce que montre la maquette de référence
// pour la 5e, et c'est le même découpage qu'en 4e et en 3e, fiche pour fiche :
// 14 chapitres, 31 fiches — de la tectonique des plaques à la procréation
// médicalement assistée, en passant par la nutrition, la génétique, l'évolution,
// l'immunité et la digestion.
//
// POURQUOI IMPORTÉ. Le BO écrit les SVT pour le **cycle 4** tout entier (5e, 4e,
// 3e) : ses trois grands domaines — la planète Terre et l'action humaine, le
// vivant et son évolution, le corps humain et la santé — s'y approfondissent
// d'année en année sans changer de découpage, et la maquette affiche les MÊMES
// 31 fiches aux trois niveaux. On importe donc les 31 chapitres de `svt-3e.mjs`
// sans y toucher, et on les republie sur le niveau '5e' : les UUID, dérivés de
// `slug|niveau|titre`, sont différents, le contenu est le même, et une
// correction faite une fois vaut pour les trois niveaux.
//
// ⚠️ Le slug `svt` porte désormais SIX modules (`svt-tle` = 233, `svt-1re` = 269,
// `svt-2de` = 285, `svt-3e` = 292, `svt-4e` = 303, celui-ci = 310) : ne JAMAIS
// générer avec `--slugs svt`. Toujours `--modules svt-5e`.

import svt3e from './svt-3e.mjs'

// Les 31 fiches de 3e, telles quelles — chacune porte déjà son chapitre de
// programme (`axe`). Le `throw` n'est pas décoratif : sans `axe`, la fiche
// échapperait au repère `theme IS NULL` du ménage, qui la supprimerait au rejeu
// suivant.
const chapitres = svt3e.blocs[0].chapitres.map((ch) => {
  if (!ch.axe) throw new Error(`svt-5e : aucun chapitre de programme pour « ${ch.titre} »`)
  return { ...ch }
})

export default {
  slug: 'svt',
  nom: 'SVT',

  titreMigration: 'LES SVT DE CINQUIÈME, RENDUES À LEUR PROGRAMME (31 fiches)',

  motif: `LE DÉFAUT : les SVT de 5e n'avaient que les 5 fiches du premier jeu de données de
l'app — « La nutrition des êtres vivants », « La respiration en milieux variés »,
« Géologie externe : les paysages », « La reproduction sexuée », « Les besoins de
l'organisme ». Un élève qui révisait la tectonique des plaques, les séismes, le
volcanisme, l'exploitation de l'eau et du pétrole, la nutrition des plantes, la
sélection naturelle, la digestion, l'immunité ou la procréation médicalement
assistée ne trouvait RIEN.
CE QUE FAIT CETTE MIGRATION : elle rend à la matière son programme — 14 chapitres
et leurs 31 fiches, aux positions 1 à 31. Les 5 fiches héritées partent, leurs
quiz et leurs lignes de la file « À revoir » avec elles.
LE CONTENU EST CELUI DE LA 3e ET DE LA 4e, et c'est le programme lui-même qui le
veut : le BO écrit les SVT pour le CYCLE 4 tout entier, les mêmes domaines s'y
approfondissant d'année en année sans changer de découpage.
PÉRIMÈTRE : la CINQUIÈME SEULE — le ménage est borné à level = '5e'.`,

  menage: [
    {
      raison: `La colonne de rangement d'abord : theme (migration 234) porte le chapitre du
programme, et l'INSERT l'écrit pour les 31 fiches. Elle est REPRISE ici en ADD
COLUMN IF NOT EXISTS, comme dans les migrations 243 à 309.
Le ménage qui suit LIT cette colonne, et c'est lui qui protège les fiches neuves
d'un rejeu : elle doit exister avant lui, pas seulement avant les insertions.
Le GRANT n'est pas décoratif : la 182 a révoqué le SELECT de table sur chapters
et ne l'a rendu que colonne par colonne.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 fiches héritées de la 008 partent, au niveau 5e SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE : « Les besoins de l'organisme » porte
une apostrophe, et rien ne garantit que la base porte la même que ce fichier
(droite dans le contenu ancien, typographique dans le récent) ; un DELETE par
titre ne trouverait alors pas la ligne, EN SILENCE. Le critère « pas de chapitre
de programme » vise exactement les cinq lignes voulues — elles datent de la 008,
bien avant la colonne theme, tandis que les 31 fiches neuves en portent une dès
l'INSERT. Le ménage tourne AVANT les insertions et ne peut donc jamais mordre sur
elles, ni au premier passage ni au rejeu.
Le filtre level = '5e' est indispensable : les SVT existent sur sept niveaux, et
la 4e comme la 3e sont traitées par leurs propres migrations.
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
   AND s.slug = 'svt'
   AND c.level = '5e'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'svt'
   AND c.level = '5e'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'svt'
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
