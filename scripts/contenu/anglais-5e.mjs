// Anglais — Cinquième : LE PROGRAMME DE LANGUE (41 fiches).
//
// LE DÉFAUT. La page « Anglais » d'un élève de 5e s'ouvre sur CINQ fiches
// héritées du tout premier jeu de données (migration 008) : « Present simple vs
// continuous », « Le prétérit : raconter au passé », « Décrire un lieu, une
// ville », « La nourriture et les quantités » et « Les pays anglophones ». Cinq
// lignes pour une année entière, dont trois qui ne sont pas des points de langue
// mais des thèmes de vocabulaire.
//
// CE QUE L'ÉLÈVE DOIT VOIR — exactement ce que montre la maquette de référence
// pour la 5e, et c'est le même découpage qu'en 4e et en 3e, fiche pour fiche :
//   1. Le groupe nominal  (6)    3. Les temps   (8)
//   2. Le groupe verbal  (14)    4. La phrase  (13)
//
// POURQUOI IMPORTÉ. Les programmes de langue vivante sont écrits pour le
// **cycle 4** (5e, 4e, 3e) : la grammaire anglaise de 5e est celle de 3e, seuls
// le lexique et les attentes de production évoluent. La maquette affiche
// d'ailleurs les MÊMES 41 fiches aux trois niveaux.
//
// ⚠️ C'EST LE MODULE DE 3e QU'ON IMPORTE, PAS CELUI DE TERMINALE. Le module de
// Tle tient le programme en 24 fiches FUSIONNÉES ; celui de 3e a été ÉCRIT pour
// suivre le découpage fin de la maquette de collège — 41 fiches, une notion à la
// fois. C'est ce découpage-là que la 5e doit recevoir.
//
// ⚠️ Le slug `anglais` porte désormais SIX modules (`anglais-tle` = 226,
// `anglais-1re` = 266, `anglais-2de` = 286, `anglais-3e` = 298, `anglais-4e` =
// 304, celui-ci = 311) : ne JAMAIS générer avec `--slugs anglais`. Toujours
// `--modules anglais-5e`.

import anglais3e from './anglais-3e.mjs'

// Les 41 fiches de 3e, telles quelles — chacune porte déjà son chapitre de
// programme (`axe`). Le `throw` n'est pas décoratif : sans `axe`, la fiche
// échapperait au repère `theme IS NULL` du ménage, qui la supprimerait au rejeu
// suivant.
const chapitres = anglais3e.blocs[0].chapitres.map((ch) => {
  if (!ch.axe) throw new Error(`anglais-5e : aucun chapitre de programme pour « ${ch.titre} »`)
  return { ...ch }
})

export default {
  slug: 'anglais',
  nom: 'Anglais',

  titreMigration: 'L’ANGLAIS DE CINQUIÈME, RENDU À SON PROGRAMME (41 fiches)',

  motif: `LE DÉFAUT : l'anglais de 5e n'avait que les 5 fiches du premier jeu de données de
l'app — « Present simple vs continuous », « Le prétérit : raconter au passé »,
« Décrire un lieu, une ville », « La nourriture et les quantités », « Les pays
anglophones ». Un élève qui bloque sur les dénombrables, les question tags, le
gérondif, le discours indirect ou l'expression de la durée ne trouvait RIEN.
CE QUE FAIT CETTE MIGRATION : elle rend à la matière son programme de LANGUE —
4 chapitres (Le groupe nominal, Le groupe verbal, Les temps, La phrase) et leurs
41 fiches, aux positions 1 à 41. Les 5 fiches héritées partent, y compris les
trois qui ne sont pas des points de langue mais des thèmes de vocabulaire : un
dossier de matière ne montre que son programme, c'est la règle inscrite dans
CLAUDE.md.
LE CONTENU EST CELUI DE LA 3e, à dessein : les programmes de LV sont écrits pour
le CYCLE 4, la grammaire y est la même, et la maquette affiche les mêmes 41
fiches aux trois niveaux.
PÉRIMÈTRE : la CINQUIÈME SEULE — le ménage est borné à level = '5e'.`,

  menage: [
    {
      raison: `La colonne de rangement d'abord : theme (migration 234) porte le chapitre du
programme, et l'INSERT l'écrit pour les 41 fiches. Elle est REPRISE ici en ADD
COLUMN IF NOT EXISTS, comme dans les migrations 243 à 310.
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

LE REPÈRE EST theme IS NULL, PAS LE TITRE : « Le prétérit : raconter au passé »
et « La nourriture et les quantités » recouvrent des points que le programme neuf
traite sous d'autres titres, et un DELETE par titre demanderait de vérifier à
chaque relecture qu'aucune fiche neuve ne les reprend exactement. Le critère
« pas de chapitre de programme » vise exactement les cinq lignes voulues — elles
datent de la 008, bien avant la colonne theme, tandis que les 41 fiches neuves en
portent une dès l'INSERT. Le ménage tourne AVANT les insertions et ne peut donc
jamais mordre sur elles, ni au premier passage ni au rejeu.
Le filtre level = '5e' est indispensable : l'anglais existe sur sept niveaux, et
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
   AND s.slug = 'anglais'
   AND c.level = '5e'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'anglais'
   AND c.level = '5e'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'anglais'
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
