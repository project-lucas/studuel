// Allemand — Première : LE PROGRAMME DE LANGUE (36 fiches).
//
// LE DÉFAUT. La page « Allemand » d'un élève de Première s'ouvre sur TROIS
// fiches héritées du bloc lycée de la migration 218, identiques en 2de, en 1re
// et — jusqu'à la 249 — en Terminale : « Raconter au passé », « Le datif et les
// prépositions », « L'Allemagne d'aujourd'hui ». Sondé le 21/08/2026 (node
// _ASSOCIE/sonde-chapitres.mjs 1re allemand) : ce sont toujours les trois seuls
// chapitres de la matière. Un élève qui bloque sur la déclinaison de l'adjectif
// épithète, la place du verbe dans la subordonnée, nicht ou kein, le passif, le
// génitif, les verbes à préverbe séparable ou le subjonctif II ne trouve rien.
//
// CE QUE L'ÉLÈVE DOIT VOIR — la même chose qu'en Terminale : les 5 chapitres du
// programme de langue et leurs 36 fiches.
//   1. La phrase                   (8)   4. Le groupe verbal  (5)
//   2. Le groupe nominal          (11)   5. Les temps         (6)
//   3. Les groupes prépositionnels (6)
// C'est la décision prise pour la Terminale (migration 249) et la règle inscrite
// dans CLAUDE.md : « un dossier de matière ne montre que son programme — ni axe
// culturel isolé, ni fiche de synthèse maison, ni chapitre hérité d'un vieux
// seed ». La fiche de civilisation « L'Allemagne d'aujourd'hui » part donc aussi
// de la Première, pour la raison qui l'a fait partir de la Terminale en 249 et
// qui a fait partir « Le monde hispanique aujourd'hui » en 244 : une fiche
// unique qui prétend tenir tous les repères culturels d'une année n'est pas un
// chapitre du programme, c'est une ligne de plus qui rouvre le doute sur les
// autres.
//
// POURQUOI LE MÊME CONTENU QU'EN TERMINALE, IMPORTÉ ET NON RECOPIÉ. Même
// raisonnement que pour l'anglais (module `anglais-1re.mjs`, migration 266) et
// l'espagnol (`espagnol-1re.mjs`, 267) : les programmes de LV sont écrits pour
// le CYCLE TERMINAL (2de-1re-Tle), pas pour un niveau, et la grammaire allemande
// de Première est celle de Terminale. Le générateur sait dupliquer un bloc sur
// plusieurs niveaux — mais pas ici : la migration 249 est DÉJÀ EXÉCUTÉE, et
// ajouter '1re' à ses niveaux la ferait se régénérer différemment. On importe
// donc les 36 chapitres de `allemand-tle.mjs` sans y toucher, et on les republie
// sur le niveau '1re' : les UUID, dérivés de `slug|niveau|titre`, sont
// différents, le contenu est le même, et une correction de règle faite une fois
// vaut pour les deux niveaux.
//
// ⚠️ Le slug reste `allemand` (la matière existe depuis 008) et TROIS modules le
// portent désormais (`allemand.mjs` → 218, `allemand-tle.mjs` → 249, celui-ci →
// 276) : ne JAMAIS générer avec `--slugs allemand`, qui les fusionnerait et
// réécrirait deux migrations déjà exécutées. Toujours `--modules allemand-1re`.

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
  if (!ch.axe) throw new Error(`allemand-1re : aucun chapitre de programme pour « ${ch.titre} »`)
  return { ...ch }
})

export default {
  slug: 'allemand',
  nom: 'Allemand',

  titreMigration: 'L’ALLEMAND DE PREMIÈRE, RENDU À SON PROGRAMME',

  motif: `LE DÉFAUT (sondé le 21/08/2026, node _ASSOCIE/sonde-chapitres.mjs 1re allemand) :
l'allemand de Première n'a que les 3 fiches du bloc lycée de la migration 218 —
« Raconter au passé », « Le datif et les prépositions », « L'Allemagne
d'aujourd'hui » —, les mêmes qu'en 2de et qu'en Terminale avant la 249. Un élève
qui bloque sur la déclinaison de l'adjectif épithète, la place du verbe dans la
subordonnée, nicht ou kein, le passif, le génitif, les verbes à préverbe
séparable ou le subjonctif II ne trouve RIEN à réviser.
CE QUE FAIT CETTE MIGRATION : elle rend à la matière son programme de LANGUE,
comme la 249 l'a fait pour la Terminale — 5 chapitres (La phrase, Le groupe
nominal, Les groupes prépositionnels, Le groupe verbal, Les temps) et leurs 36
fiches, aux positions 1 à 36. Les 3 fiches héritées partent (leurs quiz et leurs
lignes de la file « À revoir » avec elles), y compris la fiche de civilisation :
c'est la décision prise en 249 pour la Terminale, et la règle inscrite dans
CLAUDE.md — un dossier de matière ne montre que son programme.
LE CONTENU EST CELUI DE LA TERMINALE, à dessein : les programmes de LV sont
écrits pour le CYCLE TERMINAL, la grammaire y est la même. Le module importe les
36 fiches de la 249 au lieu de les recopier.
PÉRIMÈTRE : la PREMIÈRE SEULE. La 2de garde ses 3 fiches — le ménage est borné à
level = '1re', sans quoi il la viderait sans rien mettre à la place. Le collège
(5e, 4e, 3e), qui a son propre bloc dans la 218, n'est pas touché.
⚠️ LA 218 EST REJOUABLE : la recoller un jour ferait revenir les trois fiches au
niveau 1re. C'est le prix de l'idempotence — 218 ne peut pas être modifiée.`,

  menage: [
    {
      raison: `La colonne de rangement d'abord : theme (migration 234) porte le chapitre du
programme. Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS, comme dans les
migrations 243 à 275 — la 234 n'a jamais été exécutée telle quelle.
Le GRANT n'est pas décoratif : la 182 a révoqué le SELECT de table sur chapters
(pour cacher mind_map) et ne l'a rendu que colonne par colonne ; une colonne
ajoutée après elle n'hérite d'aucun droit, et l'app lirait « permission denied »
au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 3 fiches de la 218 partent, au niveau 1re SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE — même choix qu'en anglais (266) et en
espagnol (267), et pour la raison qui est écrite noir sur blanc dans la 249 :
« L'Allemagne d'aujourd'hui » porte DEUX apostrophes typographiques (U+2019), et
rien ne garantit que la base porte les mêmes que ce fichier ; un DELETE par titre
ne trouverait alors pas la ligne, EN SILENCE, et la fiche de civilisation
survivrait en tête du dossier. Le critère « pas de chapitre de programme » vise
exactement les trois lignes voulues : elles datent de la 218, bien avant la
colonne theme, tandis que les 36 fiches neuves en portent un dès l'INSERT — le
ménage tourne AVANT les insertions et ne peut donc jamais mordre sur elles, ni au
premier passage ni au rejeu.
Le filtre level = '1re' est indispensable : l'allemand existe sur SIX niveaux,
tous bâtis sur les mêmes fiches. Seule la Première est refondue ici (la Terminale
l'a été par la 249).
L'ordre compte : la file « À revoir » d'abord (review_items.item_id n'a PAS de
clé étrangère — rien ne casserait, mais le compteur « X à revoir » continuerait
de compter des questions disparues), puis les quiz (quizzes.lesson_id est ON
DELETE SET NULL : ils survivraient orphelins, sans leçon mais toujours rattachés
à « Allemand / 1re » par subject + grade_level, donc toujours tirables par le
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
   AND c.level = '1re'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'allemand'
   AND c.level = '1re'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'allemand'
   AND c.level = '1re'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['1re'],
      // Les 3 fiches héritées viennent d'être supprimées par le ménage : la
      // numérotation repart de 1, comme la 249 l'a fait en Terminale.
      chapitres,
    },
  ],
}
