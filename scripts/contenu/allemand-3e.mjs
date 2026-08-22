// Allemand — Troisième : LE PROGRAMME DE LANGUE (36 fiches).
//
// LE DÉFAUT. La page « Allemand » d'un élève de 3e s'ouvre sur les SIX fiches du
// bloc collège de la migration 218, identiques en 5e, en 4e et en 3e : « Se
// présenter et saluer », « Les articles et les trois genres », « Le présent et
// la place du verbe », « Raconter au passé », « Le datif et les prépositions »,
// « L'Allemagne d'aujourd'hui ». Six lignes pour trois années. Un élève de 3e qui
// bloque sur la déclinaison de l'adjectif épithète, la place du verbe dans la
// subordonnée, nicht ou kein, le passif, le génitif, les verbes à préverbe
// séparable ou le subjonctif II ne trouve RIEN.
//
// CE QUE L'ÉLÈVE DOIT VOIR — exactement ce que montre la maquette de référence
// pour la 3e, et c'est le découpage de la Terminale, titre pour titre : les 5
// chapitres du programme de langue et leurs 36 fiches.
//   1. La phrase                   (8)   4. Le groupe verbal  (5)
//   2. Le groupe nominal          (11)   5. Les temps         (6)
//   3. Les groupes prépositionnels (6)
//
// POURQUOI LE MÊME CONTENU QU'AU LYCÉE, IMPORTÉ ET NON RECOPIÉ. La règle posée
// pour la campagne de 3e — « toutes écrites, aucune importée » — ne vaut PAS
// ici, et c'est la maquette elle-même qui le dit : ses 5 chapitres et ses 36
// fiches sont ceux de la Terminale, sans un titre d'écart. La grammaire
// allemande ne change pas entre la 3e et la Tle ; seuls le lexique et les
// attentes de production évoluent. On importe donc les 36 chapitres de
// `allemand-tle.mjs` sans y toucher, et on les republie sur le niveau '3e' : les
// UUID, dérivés de `slug|niveau|titre`, sont différents, le contenu est le même,
// et une correction de règle faite une fois vaut désormais pour QUATRE niveaux.
//
// C'est le geste des migrations 276 (1re), 288 (2de) et 297 (l'espagnol de 3e).
//
// LA FICHE DE CIVILISATION PART AUSSI. « L'Allemagne d'aujourd'hui » quitte la
// 3e comme elle a quitté la Terminale (249), la Première (276) et la Seconde
// (288) : une fiche unique qui prétend tenir tous les repères culturels d'une
// année n'est pas un chapitre du programme, c'est une ligne de plus qui rouvre
// le doute sur les autres. C'est la règle inscrite dans CLAUDE.md.
//
// PÉRIMÈTRE : LA TROISIÈME SEULE. La 5e et la 4e gardent leurs six fiches — le
// ménage est borné à level = '3e', sans quoi il les viderait sans rien mettre à
// la place.
//
// ⚠️ Le slug `allemand` porte désormais CINQ modules (`allemand.mjs` → 218,
// `allemand-tle.mjs` → 249, `allemand-1re.mjs` → 276, `allemand-2de.mjs` → 288,
// celui-ci → 299) : ne JAMAIS générer avec `--slugs allemand`, qui les
// fusionnerait et réécrirait quatre migrations. Toujours `--modules allemand-3e`.

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
  if (!ch.axe) throw new Error(`allemand-3e : aucun chapitre de programme pour « ${ch.titre} »`)
  return { ...ch }
})

export default {
  slug: 'allemand',
  nom: 'Allemand',

  titreMigration: 'L’ALLEMAND DE TROISIÈME, RENDU À SON PROGRAMME',

  motif: `LE DÉFAUT : l'allemand de 3e n'a que les 6 fiches du bloc collège de la
migration 218 — « Se présenter et saluer », « Les articles et les trois genres »,
« Le présent et la place du verbe », « Raconter au passé », « Le datif et les
prépositions », « L'Allemagne d'aujourd'hui » —, les mêmes qu'en 5e et qu'en 4e.
Un élève de 3e qui bloque sur la déclinaison de l'adjectif épithète, la place du
verbe dans la subordonnée, nicht ou kein, le passif, le génitif, les verbes à
préverbe séparable ou le subjonctif II ne trouvait RIEN à réviser.
CE QUE FAIT CETTE MIGRATION : elle rend à la matière son programme de LANGUE,
comme la 249 l'a fait pour la Terminale, la 276 pour la Première et la 288 pour
la Seconde — 5 chapitres (La phrase, Le groupe nominal, Les groupes
prépositionnels, Le groupe verbal, Les temps) et leurs 36 fiches, aux positions 1
à 36. Les 6 fiches héritées partent (leurs quiz et leurs lignes de la file « À
revoir » avec elles), y compris la fiche de civilisation : c'est la décision
prise en 249, et la règle inscrite dans CLAUDE.md — un dossier de matière ne
montre que son programme.
LE CONTENU EST CELUI DU LYCÉE, à dessein : la maquette de 3e reprend, titre pour
titre, les 5 chapitres et les 36 fiches de la Terminale. La grammaire allemande
ne change pas d'un niveau à l'autre — seuls le lexique et les attentes de
production évoluent.
PÉRIMÈTRE : la TROISIÈME SEULE. La 5e et la 4e gardent leurs 6 fiches — le
ménage est borné à level = '3e', sans quoi il les viderait sans rien mettre à la
place.
⚠️ LA 218 EST REJOUABLE : la recoller un jour ferait revenir les six fiches au
niveau 3e. C'est le prix de l'idempotence — la 218 ne peut pas être modifiée.`,

  menage: [
    {
      raison: `La colonne de rangement d'abord : theme (migration 234) porte le chapitre du
programme, et l'INSERT l'écrit pour les 36 fiches. Elle est REPRISE ici en ADD
COLUMN IF NOT EXISTS, comme dans les migrations 243 à 297 — la 234 n'a jamais été
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
      raison: `Les 6 fiches de la 218 partent, au niveau 3e SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE — même choix qu'en 276 et en 288, et
pour la raison écrite noir sur blanc dans la 249 : « L'Allemagne d'aujourd'hui »
porte DEUX apostrophes typographiques (U+2019), et rien ne garantit que la base
porte les mêmes que ce fichier ; un DELETE par titre ne trouverait alors pas la
ligne, EN SILENCE, et la fiche de civilisation survivrait en tête du dossier. Le
critère « pas de chapitre de programme » vise exactement les six lignes voulues :
elles datent de la 218, bien avant la colonne theme, tandis que les 36 fiches
neuves en portent un dès l'INSERT — le ménage tourne AVANT les insertions et ne
peut donc jamais mordre sur elles, ni au premier passage ni au rejeu.
Le filtre level = '3e' est indispensable : l'allemand existe sur SIX niveaux,
tous bâtis sur les mêmes fiches. Seule la Troisième est refondue ici ; la 5e et
la 4e gardent leur bloc collège tant qu'aucun programme ne vient le remplacer.
L'ordre compte : la file « À revoir » d'abord (review_items.item_id n'a PAS de
clé étrangère — rien ne casserait, mais le compteur « X à revoir » continuerait
de compter des questions disparues), puis les quiz (quizzes.lesson_id est ON
DELETE SET NULL : ils survivraient orphelins, sans leçon mais toujours rattachés
à « Allemand / 3e » par subject + grade_level, donc toujours tirables par le
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
   AND c.level = '3e'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'allemand'
   AND c.level = '3e'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'allemand'
   AND c.level = '3e'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['3e'],
      // Les 6 fiches héritées viennent d'être supprimées par le ménage : la
      // numérotation repart de 1, comme la 249 l'a fait en Terminale.
      chapitres,
    },
  ],
}
