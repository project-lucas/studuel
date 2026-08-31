// Technologie — 5e : LE PROGRAMME DU CYCLE 4, IMPORTÉ DE LA 3e (23 fiches).
//
// LE DÉFAUT. La technologie de 5e n'avait que QUATRE chapitres hérités du premier
// jeu de données — et quatre de ses leçons « Exercices types » n'avaient aucun
// quiz derrière (migration 331). Quatre lignes pour une année entière.
//
// ⚠️ POURQUOI L'IMPORT EST LÉGITIME ICI, alors qu'il a été refusé pour la 6e.
// Le BO écrit la technologie pour le CYCLE 4 tout entier — 5e, 4e et 3e — et les
// mêmes thèmes s'y approfondissent d'année en année sans changer de découpage :
// l'objet technique, ses fonctions, les matériaux, l'information et les
// programmes, la démarche de projet. C'est exactement l'argument qui a fait
// importer la physique-chimie (309) et les SVT (310) de 3e vers la 5e et la 4e.
// La 6e, elle, relève du CYCLE 3 : elle garde son module écrit.
//
// Une correction faite dans `technologie-3e.mjs` vaut désormais pour les trois
// niveaux du cycle : c'est le second intérêt de l'import, après le volume.
//
// ⚠️ Ne JAMAIS générer avec `--slugs technologie` : toujours
// `--modules technologie-5e`.

import technologie3e from './technologie-3e.mjs'

// Les 23 fiches de 3e, telles quelles — chacune porte déjà son chapitre de
// programme (`axe`). Le `throw` n'est pas décoratif : sans `axe`, la fiche
// échapperait au repère `theme IS NULL` du ménage, qui la supprimerait au rejeu
// suivant.
const chapitres = technologie3e.blocs[0].chapitres.map((ch) => {
  if (!ch.axe) throw new Error(`technologie-5e : aucun chapitre de programme pour « ${ch.titre} »`)
  return { ...ch }
})

export default {
  slug: 'technologie',
  nom: 'Technologie',

  titreMigration: 'TECHNOLOGIE 5E — LE PROGRAMME DU CYCLE 4 (23 fiches)',

  motif: `CONSTAT : la technologie de 5e n'avait que 4 chapitres hérités du premier jeu de
données, et quatre de ses leçons « Exercices types » n'avaient aucun quiz (traité
par la 331). Un élève qui révisait les fonctions d'un objet technique, les
matériaux, les chaînes d'information et d'énergie, la programmation ou la
démarche de projet ne trouvait presque RIEN.
CE QUE FAIT CETTE MIGRATION : elle rend à la matière son programme — 8 chapitres
et leurs 23 fiches. Les 4 fiches héritées partent, leurs quiz et leurs lignes de
la file « À revoir » avec elles.
LE CONTENU EST CELUI DE LA 3e, et c'est le programme qui le veut : le BO écrit la
technologie pour le CYCLE 4 entier, les mêmes thèmes s'y approfondissant d'année
en année sans changer de découpage — comme la physique-chimie (309) et les SVT
(310), importées de la même façon.
PÉRIMÈTRE : le niveau 5e SEUL — le ménage est borné à level = '5e'.`,

  menage: [
    {
      raison: `La colonne chapters.theme (migration 234) porte le chapitre du programme, et
l'INSERT l'écrit pour les 23 fiches. Elle est REPRISE ici en ADD COLUMN IF NOT
EXISTS parce qu'on ne peut pas garantir que la 234 soit passée en production —
sans cette reprise, la migration échouerait sur "column chapters.theme does not
exist", les 4 anciens chapitres déjà supprimés et les 23 neufs pas encore posés :
une matière vide.
Le GRANT n'est pas décoratif : la migration 182 a révoqué le SELECT de table sur
chapters et ne l'a rendu que colonne par colonne.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 4 chapitres hérités partent, au niveau 5e SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE : les 23 fiches importées portent leur
chapitre de programme dès l'INSERT, les 4 anciennes n'en ont aucun. Le ménage
tourne AVANT les insertions et ne peut donc jamais mordre sur les neuves, ni au
premier passage ni au rejeu.
Le filtre level = '5e' est indispensable : la technologie existe sur quatre
niveaux, et la 3e est la SOURCE de cet import — l'oublier viderait le module
dont on vient de copier le contenu.
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
   AND c.level = '5e'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'technologie'
   AND c.level = '5e'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'technologie'
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
