// SVT — Quatrième : LE PROGRAMME COMPLET (31 fiches).
//
// LE DÉFAUT. La page « SVT » d'un élève de 4e s'ouvre sur QUATRE fiches héritées
// du tout premier jeu de données (migration 008) : « L'activité interne du
// globe », « La transmission de la vie », « Le système nerveux » et
// « Météorologie et climats ». Quatre lignes pour une année entière.
//
// CE QUE L'ÉLÈVE DOIT VOIR — exactement ce que montre la maquette de référence
// pour la 4e, et c'est le même découpage qu'en 3e, chapitre pour chapitre et
// fiche pour fiche : 14 chapitres, 31 fiches — de la tectonique des plaques à la
// procréation médicalement assistée, en passant par la nutrition, la génétique,
// l'évolution, l'immunité et la digestion.
//
// POURQUOI IMPORTÉ ET NON RÉÉCRIT. Même raison qu'en physique-chimie (302) : le
// BO écrit les SVT pour le **cycle 4** tout entier (5e, 4e, 3e) et non niveau
// par niveau. Ses trois grands domaines — la planète Terre et l'action humaine,
// le vivant et son évolution, le corps humain et la santé — s'approfondissent
// d'année en année sans changer de découpage, et la maquette de référence
// affiche les MÊMES 31 fiches aux deux niveaux. On importe donc les 31 chapitres
// de `svt-3e.mjs` sans y toucher, et on les republie sur le niveau '4e' : les
// UUID, dérivés de `slug|niveau|titre`, sont différents, le contenu est le même,
// et une correction faite une fois vaut pour les deux niveaux.
//
// ⚠️ Le slug `svt` porte désormais SIX modules (`svt-tle.mjs` = 233,
// `svt-1re.mjs` = 269, `svt-2de.mjs` = 285, `svt-3e.mjs` = 292, celui-ci = 303,
// plus les migrations 094 → 142 écrites à la main pour les autres niveaux, qui
// n'ont pas de module) : ne JAMAIS générer avec `--slugs svt`. Toujours
// `--modules svt-4e`.

import svt3e from './svt-3e.mjs'

// Les 31 fiches de 3e, telles quelles — chacune porte déjà son chapitre de
// programme (`axe`), le module de 3e ayant été écrit après la colonne
// `chapters.theme`.
//
// Le `throw` n'est pas décoratif : si un `axe` disparaissait de `svt-3e.mjs`, la
// fiche partirait sans chapitre et la page la rangerait dans un bloc « Autres
// chapitres » — le défaut même que cette migration corrige.
const chapitres = svt3e.blocs[0].chapitres.map((ch) => {
  if (!ch.axe) throw new Error(`svt-4e : aucun chapitre de programme pour « ${ch.titre} »`)
  return { ...ch }
})

export default {
  slug: 'svt',
  nom: 'SVT',

  titreMigration: 'LES SVT DE QUATRIÈME, RENDUES À LEUR PROGRAMME (31 fiches)',

  motif: `LE DÉFAUT : les SVT de 4e n'avaient que les 4 fiches du premier jeu de données
de l'app — « L'activité interne du globe », « La transmission de la vie », « Le
système nerveux », « Météorologie et climats ». Un élève qui révisait la
tectonique des plaques, les séismes, le volcanisme, l'exploitation de l'eau et du
pétrole, la nutrition des animaux et des plantes, la reproduction asexuée, la
sélection naturelle, l'effort physique, la digestion, l'immunité ou la
procréation médicalement assistée ne trouvait RIEN.
CE QUE FAIT CETTE MIGRATION : elle rend à la matière son programme — 14
chapitres et leurs 31 fiches, aux positions 1 à 31. Les 4 fiches héritées
partent, leurs quiz et leurs lignes de la file « À revoir » avec elles.
LE CONTENU EST CELUI DE LA 3e, et c'est le programme lui-même qui le veut : le
BO écrit les SVT pour le CYCLE 4 tout entier (5e, 4e, 3e), les trois grands
domaines s'y approfondissant d'année en année sans changer de découpage. La
maquette de référence affiche d'ailleurs les mêmes 31 fiches aux deux niveaux.
PÉRIMÈTRE : la QUATRIÈME SEULE. La 5e et le reste du collège gardent leurs
fiches héritées — le ménage est borné à level = '4e'.`,

  menage: [
    {
      raison: `La colonne de rangement d'abord : theme (migration 234) porte le chapitre du
programme, et l'INSERT l'écrit pour les 31 fiches. Elle est REPRISE ici en ADD
COLUMN IF NOT EXISTS, comme dans les migrations 243 à 302 — la 234 n'a jamais été
exécutée telle quelle.
Le ménage qui suit LIT cette colonne : elle doit exister avant lui.
Le GRANT n'est pas décoratif : la 182 a révoqué le SELECT de table sur chapters
et ne l'a rendu que colonne par colonne ; une colonne ajoutée après elle n'hérite
d'aucun droit, et l'app lirait « permission denied » au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 4 fiches héritées de la 008 partent, au niveau 4e SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE : « L'activité interne du globe »
porte une apostrophe, et rien ne garantit que la base porte la même que ce
fichier (droite dans le contenu ancien, typographique dans le récent) ; un DELETE
par titre ne trouverait alors pas la ligne, EN SILENCE. Le critère « pas de
chapitre de programme » vise exactement les quatre lignes voulues : elles datent
de la 008, bien avant la colonne theme, tandis que les 31 fiches neuves en
portent une dès l'INSERT — le ménage tourne AVANT les insertions et ne peut donc
jamais mordre sur elles, ni au premier passage ni au rejeu.
Le filtre level = '4e' est indispensable : les SVT existent sur sept niveaux, et
plusieurs portent encore des chapitres sans theme.
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
   AND c.level = '4e'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'svt'
   AND c.level = '4e'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'svt'
   AND c.level = '4e'
   AND c.theme IS NULL;`,
    },
  ],

  blocs: [
    {
      niveaux: ['4e'],
      chapitres,
    },
  ],
}
