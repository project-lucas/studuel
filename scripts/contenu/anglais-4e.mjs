// Anglais — Quatrième : LE PROGRAMME DE LANGUE (41 fiches).
//
// LE DÉFAUT. La page « Anglais » d'un élève de 4e s'ouvre sur CINQ fiches
// héritées du tout premier jeu de données (migration 008) : « Le present
// perfect », « Comparatifs et superlatifs », « Exprimer le futur », « Les médias
// et les réseaux » et « Portraits d'artistes anglophones ». Cinq lignes pour une
// année entière, dont deux qui ne sont pas des points de langue mais des thèmes.
//
// CE QUE L'ÉLÈVE DOIT VOIR — exactement ce que montre la maquette de référence
// pour la 4e, et c'est le même découpage qu'en 3e, fiche pour fiche :
//   1. Le groupe nominal  (6)    3. Les temps   (8)
//   2. Le groupe verbal  (14)    4. La phrase  (13)
//
// POURQUOI IMPORTÉ. Les programmes de langue vivante sont écrits pour le
// **cycle 4** (5e, 4e, 3e) : la grammaire anglaise de 4e est celle de 3e, seuls
// le lexique et les attentes de production évoluent. La maquette de référence
// affiche d'ailleurs les MÊMES 41 fiches aux deux niveaux. On importe donc les
// 41 chapitres de `anglais-3e.mjs` sans y toucher, et on les republie sur le
// niveau '4e'.
//
// ⚠️ C'EST LE MODULE DE 3e QU'ON IMPORTE, PAS CELUI DE TERMINALE. Le module de
// Tle tient le programme en 24 fiches FUSIONNÉES ; celui de 3e a été ÉCRIT pour
// suivre le découpage fin de la maquette de collège — 41 fiches, une notion à la
// fois. C'est ce découpage-là que la 4e doit recevoir.
//
// ⚠️ DEUX TITRES HÉRITÉS ENTRENT EN COLLISION AVEC LES FICHES NEUVES : « Le
// present perfect » et « Exprimer le futur » sont à la fois des titres de la 008
// et des titres du programme neuf, et `chapters` porte
// UNIQUE(subject_id, level, title). Le ménage est donc indispensable — et son
// repère `theme IS NULL` est ce qui le rend rejouable sans détruire les fiches
// neuves, qui portent une colonne theme dès l'INSERT (voir plus bas).
//
// ⚠️ Le slug `anglais` porte désormais CINQ modules (`anglais-tle.mjs` = 226,
// `anglais-1re.mjs` = 266, `anglais-2de.mjs` = 286, `anglais-3e.mjs` = 298,
// celui-ci = 304) : ne JAMAIS générer avec `--slugs anglais`. Toujours
// `--modules anglais-4e`.

import anglais3e from './anglais-3e.mjs'

// Les 41 fiches de 3e, telles quelles — chacune porte déjà son chapitre de
// programme (`axe`).
//
// Le `throw` n'est pas décoratif : si un `axe` disparaissait de
// `anglais-3e.mjs`, la fiche partirait sans chapitre — et, pire ici, elle
// échapperait au repère `theme IS NULL` du ménage, qui la supprimerait au rejeu
// suivant.
const chapitres = anglais3e.blocs[0].chapitres.map((ch) => {
  if (!ch.axe) throw new Error(`anglais-4e : aucun chapitre de programme pour « ${ch.titre} »`)
  return { ...ch }
})

export default {
  slug: 'anglais',
  nom: 'Anglais',

  titreMigration: 'L’ANGLAIS DE QUATRIÈME, RENDU À SON PROGRAMME (41 fiches)',

  motif: `LE DÉFAUT : l'anglais de 4e n'avait que les 5 fiches du premier jeu de données
de l'app — « Le present perfect », « Comparatifs et superlatifs », « Exprimer le
futur », « Les médias et les réseaux », « Portraits d'artistes anglophones ». Un
élève qui bloque sur les dénombrables, les question tags, le gérondif, le
discours indirect ou l'expression de la durée ne trouvait RIEN.
CE QUE FAIT CETTE MIGRATION : elle rend à la matière son programme de LANGUE —
4 chapitres (Le groupe nominal, Le groupe verbal, Les temps, La phrase) et leurs
41 fiches, aux positions 1 à 41. Les 5 fiches héritées partent, y compris les
deux qui ne sont pas des points de langue mais des thèmes (« Les médias et les
réseaux », « Portraits d'artistes anglophones ») : un dossier de matière ne
montre que son programme, c'est la règle inscrite dans CLAUDE.md.
LE CONTENU EST CELUI DE LA 3e, à dessein : les programmes de LV sont écrits pour
le CYCLE 4, la grammaire y est la même, et la maquette de référence affiche les
mêmes 41 fiches aux deux niveaux.
PÉRIMÈTRE : la QUATRIÈME SEULE. Le ménage est borné à level = '4e'.`,

  menage: [
    {
      raison: `La colonne de rangement d'abord : theme (migration 234) porte le chapitre du
programme, et l'INSERT l'écrit pour les 41 fiches. Elle est REPRISE ici en ADD
COLUMN IF NOT EXISTS, comme dans les migrations 243 à 303.
Le ménage qui suit LIT cette colonne, et c'est lui qui protège les fiches neuves
d'un rejeu : elle doit exister avant lui, pas seulement avant les insertions.
Le GRANT n'est pas décoratif : la 182 a révoqué le SELECT de table sur chapters
et ne l'a rendu que colonne par colonne.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 5 fiches héritées de la 008 partent, au niveau 4e SEULEMENT.

CE MÉNAGE EST OBLIGATOIRE, pas seulement souhaitable : « Le present perfect » et
« Exprimer le futur » sont à la fois des titres hérités et des titres du
programme neuf, et chapters porte UNIQUE(subject_id, level, title). Sans ménage
préalable, ces deux INSERT tomberaient dans le ON CONFLICT DO NOTHING et leurs
leçons échoueraient ensuite sur une clé étrangère absente — la migration
s'arrêterait à mi-parcours.

LE REPÈRE EST theme IS NULL, ET C'EST CE QUI REND LE REJEU SÛR. Borné aux seuls
titres, le ménage supprimerait au second passage les deux fiches NEUVES qui
portent ces mêmes titres. L'ancienne série date de la 008, bien avant la colonne
theme, tandis que les 41 fiches neuves en portent une dès l'INSERT : la
distinction est exacte et stable. Elle évite au passage la question de
l'apostrophe de « Portraits d'artistes anglophones ».
Le filtre level = '4e' est indispensable : l'anglais existe sur sept niveaux, et
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
   AND s.slug = 'anglais'
   AND c.level = '4e'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'anglais'
   AND c.level = '4e'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'anglais'
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
