// Espagnol — Première : LE PROGRAMME DE LANGUE (34 fiches).
//
// LE DÉFAUT. La page « Espagnol » d'un élève de Première s'ouvre sur TROIS
// fiches maison, héritées de la migration 220 et identiques en 2de, 1re et Tle :
// « Les temps du passé », « Ser, estar et les tournures essentielles », « Le
// monde hispanique aujourd'hui ». Sondé le 21/08/2026 (node
// _ASSOCIE/sonde-chapitres.mjs 1re espagnol) : ce sont toujours les trois seuls
// chapitres de la matière. Un élève qui bloque sur la négation, l'enclise des
// pronoms, cuyo, l'apocope, le subjonctif ou la concordance ne trouve rien.
//
// CE QUE L'ÉLÈVE DOIT VOIR — la même chose qu'en Terminale : les 4 chapitres du
// programme de langue et leurs 34 fiches.
//   1. La phrase          (4)    3. Le groupe verbal  (12)
//   2. Le groupe nominal  (12)   4. Les temps         (6)
// C'est la décision prise pour la Terminale (migrations 231 puis 244) et la
// règle inscrite dans CLAUDE.md : « un dossier de matière ne montre que son
// programme ». La fiche culturelle « Le monde hispanique aujourd'hui » part
// donc aussi de la Première, pour la raison qui l'a fait partir de la Terminale
// en 244 : une fiche unique qui prétend tenir tous les axes culturels d'une
// année n'est pas un chapitre du programme, c'est une ligne de plus qui rouvre
// le doute sur les autres.
//
// POURQUOI LE MÊME CONTENU QU'EN TERMINALE, IMPORTÉ ET NON RECOPIÉ. Même
// raisonnement que pour l'anglais de 1re (module `anglais-1re.mjs`, migration
// 266) : les programmes de LV sont écrits pour le CYCLE TERMINAL (2de-1re-Tle),
// pas pour un niveau, et la grammaire espagnole de Première est celle de
// Terminale. Le générateur sait dupliquer un bloc sur plusieurs niveaux — mais
// pas ici : la migration 231 est DÉJÀ EXÉCUTÉE, et ajouter '1re' à ses niveaux
// la ferait se régénérer différemment. On importe donc les 34 chapitres de
// `espagnol-tle.mjs` sans y toucher, et on les republie sur le niveau '1re' :
// les UUID, dérivés de `slug|niveau|titre`, sont différents, le contenu est le
// même, et une correction de règle faite une fois vaut pour les deux niveaux.
//
// ⚠️ Le slug reste `espagnol` (la matière existe depuis 008) et TROIS modules le
// portent désormais (`espagnol-lycee.mjs` → 220, `espagnol-tle.mjs` → 231,
// celui-ci → 267) : ne JAMAIS générer avec `--slugs espagnol`, qui les
// fusionnerait et réécrirait deux migrations déjà exécutées. Toujours
// `--modules espagnol-1re`.

import espagnolTle from './espagnol-tle.mjs'

// Le chapitre de programme qui coiffe chaque fiche (colonne `chapters.theme`).
// Écrit ici, et non dans `espagnol-tle.mjs` : ce module-là a généré la 231, qui
// ne portait pas encore la colonne — c'est la 244, écrite à la main, qui a rangé
// les 34 fiches de Terminale. La table ci-dessous en est la copie exacte.
const AXES = {
  'Les questions': 'La phrase',
  'La négation': 'La phrase',
  'La proposition subordonnée relative': 'La phrase',
  'La proposition subordonnée complétive': 'La phrase',
  'Genre et nombre': 'Le groupe nominal',
  'Les articles': 'Le groupe nominal',
  'Les démonstratifs': 'Le groupe nominal',
  'Les adjectifs': 'Le groupe nominal',
  'Les pronoms personnels sujets': 'Le groupe nominal',
  'Les pronoms personnels compléments': 'Le groupe nominal',
  'Les possessifs': 'Le groupe nominal',
  'Les pronoms relatifs': 'Le groupe nominal',
  'Les indéfinis': 'Le groupe nominal',
  'La comparaison': 'Le groupe nominal',
  'Le superlatif': 'Le groupe nominal',
  'L’apocope': 'Le groupe nominal',
  'L’auxiliaire haber': 'Le groupe verbal',
  'Les verbes pronominaux': 'Le groupe verbal',
  'Les verbes à diphtongue': 'Le groupe verbal',
  'Les verbes à affaiblissement': 'Le groupe verbal',
  'Ser et estar': 'Le groupe verbal',
  'Le gérondif': 'Le groupe verbal',
  'Le participe passé': 'Le groupe verbal',
  'Les verbes du type « gustar »': 'Le groupe verbal',
  'L’obligation': 'Le groupe verbal',
  'L’habitude': 'Le groupe verbal',
  'La probabilité': 'Le groupe verbal',
  'Le conseil': 'Le groupe verbal',
  'Le présent de l’indicatif': 'Les temps',
  'Le subjonctif présent': 'Les temps',
  'L’imparfait': 'Les temps',
  'Le passé composé': 'Les temps',
  'Le passé simple': 'Les temps',
  'Le futur': 'Les temps',
}

// Les 34 fiches de Terminale, telles quelles, chacune rattachée à son chapitre.
// La fiche culturelle « Le monde hispanique aujourd’hui » n'est PAS dans
// `espagnol-tle.mjs` (elle vient de la 220) : rien à filtrer ici, le ménage
// ci-dessous suffit à la retirer du niveau 1re.
//
// Le `throw` n'est pas décoratif : si un titre bouge dans `espagnol-tle.mjs`, la
// fiche partirait sans chapitre et la page la rangerait dans un bloc « Autres
// chapitres » — le défaut même que cette migration corrige. Mieux vaut que la
// génération s'arrête.
const chapitres = espagnolTle.blocs[0].chapitres.map((ch) => {
  const axe = AXES[ch.titre]
  if (!axe) throw new Error(`espagnol-1re : aucun chapitre de programme pour « ${ch.titre} »`)
  return { ...ch, axe }
})

export default {
  slug: 'espagnol',
  nom: 'Espagnol',

  titreMigration: 'L’ESPAGNOL DE PREMIÈRE, RENDU À SON PROGRAMME',

  motif: `LE DÉFAUT (sondé le 21/08/2026, node _ASSOCIE/sonde-chapitres.mjs 1re espagnol) :
l'espagnol de Première n'a que les 3 fiches maison de la migration 220 — « Les
temps du passé », « Ser, estar et les tournures essentielles », « Le monde
hispanique aujourd'hui » —, les mêmes qu'en 2de et qu'en Terminale avant la 231.
Un élève qui bloque sur la négation, l'enclise des pronoms, cuyo, l'apocope, le
subjonctif ou la concordance ne trouve RIEN à réviser.
CE QUE FAIT CETTE MIGRATION : elle rend à la matière son programme de LANGUE,
comme la 231 puis la 244 l'ont fait pour la Terminale — 4 chapitres (La phrase,
Le groupe nominal, Le groupe verbal, Les temps) et leurs 34 fiches, aux
positions 1 à 34. Les 3 fiches maison partent (leurs quiz et leurs lignes de la
file « À revoir » avec elles), y compris la fiche culturelle : c'est la décision
prise en 244 pour la Terminale, et la règle inscrite dans CLAUDE.md — un dossier
de matière ne montre que son programme.
LE CONTENU EST CELUI DE LA TERMINALE, à dessein : les programmes de LV sont
écrits pour le CYCLE TERMINAL, la grammaire y est la même. Le module importe les
34 fiches de la 231 au lieu de les recopier.
PÉRIMÈTRE : la PREMIÈRE SEULE. La 2de garde ses 3 fiches — le ménage est borné à
level = '1re', sans quoi il la viderait sans rien mettre à la place.`,

  menage: [
    {
      raison: `La colonne de rangement d'abord : theme (migration 234) porte le chapitre du
programme. Elle est REPRISE ici en ADD COLUMN IF NOT EXISTS, comme dans les
migrations 243 à 266 — la 234 n'a jamais été exécutée telle quelle.
Le GRANT n'est pas décoratif : la 182 a révoqué le SELECT de table sur chapters
(pour cacher mind_map) et ne l'a rendu que colonne par colonne ; une colonne
ajoutée après elle n'hérite d'aucun droit, et l'app lirait « permission denied »
au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 3 fiches maison de la 220 partent, au niveau 1re SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE — même raison qu'en anglais (266) et
en français (259) : « Le monde hispanique aujourd'hui » porte une apostrophe, et
rien ne garantit que la base porte la même que ce fichier (droite dans le
contenu ancien, typographique dans le récent) ; un DELETE par titre ne
trouverait alors pas la ligne, EN SILENCE. Le critère « pas de chapitre de
programme » vise exactement les trois lignes voulues : elles datent de la 220,
bien avant la colonne theme, tandis que les 34 fiches neuves en portent un dès
l'INSERT — le ménage tourne AVANT les insertions et ne peut donc jamais mordre
sur elles, ni au premier passage ni au rejeu.
Le filtre level = '1re' est indispensable : l'espagnol existe sur SIX niveaux
(5e → Tle) et la 2de porte les mêmes trois fiches, qu'aucun programme ne vient
remplacer ici.
L'ordre compte : la file « À revoir » d'abord (review_items.item_id n'a PAS de
clé étrangère — rien ne casserait, mais le compteur « X à revoir » continuerait
de compter des questions disparues), puis les quiz (quizzes.lesson_id est ON
DELETE SET NULL : ils survivraient orphelins, sans leçon mais toujours rattachés
à « Espagnol / 1re » par subject + grade_level, donc toujours tirables par le
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
   AND s.slug = 'espagnol'
   AND c.level = '1re'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'espagnol'
   AND c.level = '1re'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'espagnol'
   AND c.level = '1re'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['1re'],
      // Les 3 fiches maison viennent d'être supprimées par le ménage : la
      // numérotation repart de 1, comme la 244 l'a fait en Terminale.
      chapitres,
    },
  ],
}
