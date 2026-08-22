// Allemand — Seconde : LE PROGRAMME DE LANGUE (36 fiches).
//
// LE DÉFAUT. La page « Allemand » d'un élève de Seconde s'ouvre sur TROIS
// fiches, héritées du bloc lycée de la migration 218 et écrites pour la 2de, la
// 1re et la Tle à la fois : « Raconter au passé », « Le datif et les
// prépositions », « L'Allemagne d'aujourd'hui ». La Terminale a reçu son
// programme en 249, la Première en 276 ; la Seconde est le dernier niveau du
// lycée à en être restée là. Un élève qui bloque sur la déclinaison de
// l'adjectif épithète, la place du verbe dans la subordonnée, les verbes à
// préverbe séparable, les prépositions mixtes ou le subjonctif II ne trouve
// RIEN.
//
// CE QUE L'ÉLÈVE DOIT VOIR — la même chose qu'en Terminale et qu'en Première :
// les 5 chapitres du programme de langue et leurs 36 fiches.
//   1. La phrase                  (8)   4. Le groupe verbal (5)
//   2. Le groupe nominal         (11)   5. Les temps        (6)
//   3. Les groupes prépositionnels (6)
// La fiche culturelle « L'Allemagne d'aujourd'hui » part donc aussi de la
// Seconde, pour la raison qui l'a fait partir des deux autres niveaux : une
// fiche unique qui prétend tenir tous les repères culturels d'une année n'est
// pas un chapitre du programme, c'est une ligne de plus qui rouvre le doute sur
// les autres.
//
// POURQUOI LE MÊME CONTENU QU'EN TERMINALE, IMPORTÉ ET NON RECOPIÉ. Même
// raisonnement qu'en 266, 267 et 276 : les programmes de LV sont écrits pour le
// CYCLE TERMINAL (2de-1re-Tle), pas pour un niveau, et la grammaire allemande de
// Seconde est celle de Terminale. Le générateur sait dupliquer un bloc sur
// plusieurs niveaux — mais pas ici : les migrations 249 et 276 sont DÉJÀ
// ÉCRITES, et ajouter '2de' aux niveaux de la première les ferait se régénérer
// différemment. On importe donc les 36 chapitres de `allemand-tle.mjs` sans y
// toucher, et on les republie sur le niveau '2de' : les UUID, dérivés de
// `slug|niveau|titre`, sont différents, le contenu est le même, et une
// correction de règle faite une fois vaut pour les trois niveaux.
//
// ⚠️ Le slug reste `allemand` et QUATRE modules le portent désormais
// (`allemand.mjs` → 218, `allemand-tle.mjs` → 249, `allemand-1re.mjs` → 276,
// celui-ci → 288) : ne JAMAIS générer avec `--slugs allemand`, qui les
// fusionnerait et réécrirait trois migrations. Toujours `--modules allemand-2de`.
//
// ⚠️ LA 218 EST REJOUABLE : la recoller un jour ferait revenir les trois fiches
// sur les trois niveaux du lycée. C'est le prix de l'idempotence.

import allemandTle from './allemand-tle.mjs'

// Les 36 fiches de Terminale, telles quelles. Contrairement à l'anglais et à
// l'espagnol, aucune table d'axes à recopier ici : `allemand-tle.mjs` porte déjà
// son chapitre de programme sur CHAQUE fiche (`axe`), la 249 ayant été écrite
// après la colonne `chapters.theme`.
//
// Le `throw` n'est pas décoratif : si un `axe` disparaissait de
// `allemand-tle.mjs`, la fiche partirait sans chapitre et la page la rangerait
// dans un bloc « Autres chapitres » — le défaut même que cette migration
// corrige. Mieux vaut que la génération s'arrête.
const chapitres = allemandTle.blocs[0].chapitres.map((ch) => {
  if (!ch.axe) throw new Error(`allemand-2de : aucun chapitre de programme pour « ${ch.titre} »`)
  return { ...ch }
})

export default {
  slug: 'allemand',
  nom: 'Allemand',

  titreMigration: 'L’ALLEMAND DE SECONDE, RENDU À SON PROGRAMME',

  motif: `LE DÉFAUT : l'allemand de Seconde n'avait que les 3 fiches du bloc lycée de la
migration 218 — « Raconter au passé », « Le datif et les prépositions »,
« L'Allemagne d'aujourd'hui » —, les mêmes qu'en 1re et qu'en Terminale avant les
migrations 276 et 249. Un élève qui bloque sur la déclinaison de l'adjectif
épithète, la place du verbe dans la subordonnée, les verbes à préverbe séparable,
les prépositions mixtes, le génitif saxon ou le subjonctif II ne trouvait RIEN.
CE QUE FAIT CETTE MIGRATION : elle rend à la matière son programme de LANGUE,
comme la 249 l'a fait pour la Terminale et la 276 pour la Première — 5 chapitres
(La phrase, Le groupe nominal, Les groupes prépositionnels, Le groupe verbal, Les
temps) et leurs 36 fiches, aux positions 1 à 36. Les 3 fiches héritées partent
(leurs quiz et leurs lignes de la file « À revoir » avec elles), y compris la
fiche culturelle : c'est la décision prise en 249, et la règle inscrite dans
CLAUDE.md — un dossier de matière ne montre que son programme.
LE CONTENU EST CELUI DE LA TERMINALE, à dessein : les programmes de LV sont
écrits pour le CYCLE TERMINAL, la grammaire y est la même. Le module importe les
36 fiches de la 249 au lieu de les recopier.
PÉRIMÈTRE : la SECONDE SEULE. Le ménage est borné à level = '2de' — le collège
(5e, 4e, 3e) a ses propres chapitres dans la 218, qu'aucun programme ne vient
remplacer ici.
⚠️ LA 218 EST REJOUABLE : la recoller ferait revenir les 3 fiches au niveau 2de.`,

  menage: [
    {
      raison: `La colonne de rangement d'abord : theme (migration 234) porte le chapitre du
programme, et l'INSERT l'écrit pour les 36 fiches. Elle est REPRISE ici en ADD
COLUMN IF NOT EXISTS, comme dans les migrations 243 à 287 — la 234 n'a jamais été
exécutée telle quelle. Sans cette reprise, la migration échouerait sur « column
chapters.theme does not exist », les 3 anciennes fiches déjà supprimées et les 36
neuves pas encore posées : une matière vide.
Le GRANT n'est pas décoratif : la 182 a révoqué le SELECT de table sur chapters
(pour cacher mind_map) et ne l'a rendu que colonne par colonne ; une colonne
ajoutée après elle n'hérite d'aucun droit, et l'app lirait « permission denied »
au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 3 fiches du bloc lycée de la 218 partent, au niveau 2de SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE — même choix qu'en 266, 267, 276, 277
et 284 : « L'Allemagne d'aujourd'hui » porte une apostrophe, et rien ne garantit
que la base porte la même que ce fichier (droite dans le contenu ancien,
typographique dans le récent) ; un DELETE par titre ne trouverait alors pas la
ligne, EN SILENCE. Le critère « pas de chapitre de programme » vise exactement
les trois lignes voulues : elles datent de la 218, bien avant la colonne theme,
tandis que les 36 fiches neuves en portent un dès l'INSERT — le ménage tourne
AVANT les insertions et ne peut donc jamais mordre sur elles, ni au premier
passage ni au rejeu.
Le filtre level = '2de' est indispensable : le collège porte lui aussi des
chapitres sans theme, qu'aucun programme ne vient remplacer ici.
L'ordre compte : la file « À revoir » d'abord (review_items.item_id n'a PAS de
clé étrangère — rien ne casserait, mais le compteur « X à revoir » continuerait
de compter des questions disparues), puis les quiz (quizzes.lesson_id est ON
DELETE SET NULL : ils survivraient orphelins, sans leçon mais toujours rattachés
à « Allemand / 2de » par subject + grade_level, donc toujours tirables par le
moteur de questions), puis les chapitres, dont les leçons partent en cascade.`,
      sql: `DELETE FROM public.review_items ri
 USING public.quiz_questions qq, public.quizzes qz, public.lessons l,
       public.chapters c, public.subjects s
 WHERE ri.item_kind = 'question'
   AND ri.item_id = qq.id
   AND qq.quiz_id = qz.id
   AND qz.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'allemand'
   AND c.level = '2de'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'allemand'
   AND c.level = '2de'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'allemand'
   AND c.level = '2de'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['2de'],
      // Les 3 fiches héritées viennent d'être supprimées par le ménage : la
      // numérotation repart de 1, comme la 249 l'a fait en Terminale.
      chapitres,
    },
  ],
}
