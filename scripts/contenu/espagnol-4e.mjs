// Espagnol — Quatrième : LE PROGRAMME DE LANGUE (34 fiches).
//
// LE DÉFAUT. La page « Espagnol » d'un élève de 4e s'ouvre sur QUATRE fiches
// héritées du tout premier jeu de données (migration 008) : « El pretérito
// perfecto », « La ciudad y las direcciones », « Gustos y opiniones » et « La
// vida cotidiana ». Quatre lignes pour une année entière, dont trois qui sont
// des thèmes de vocabulaire et non des points de langue.
//
// CE QUE L'ÉLÈVE DOIT VOIR — exactement ce que montre la maquette de référence
// pour la 4e, et c'est le même découpage qu'en 3e, fiche pour fiche :
//   1. La phrase          (4)    3. Le groupe verbal  (12)
//   2. Le groupe nominal  (12)   4. Les temps         (6)
//
// POURQUOI IMPORTÉ. Les programmes de langue vivante sont écrits pour le
// **cycle 4** (5e, 4e, 3e) : la grammaire espagnole de 4e est celle de 3e —
// laquelle est déjà celle du lycée, la maquette reprenant partout les mêmes 4
// chapitres. On importe donc les 34 chapitres de `espagnol-3e.mjs` sans y
// toucher, et on les republie sur le niveau '4e'.
//
// LA CHAÎNE D'IMPORT, ASSUMÉE. `espagnol-3e.mjs` importe lui-même
// `espagnol-tle.mjs` en y ajoutant la table des chapitres de programme (la 231
// est antérieure à la colonne `chapters.theme`, c'est la 244 qui l'a rangée).
// Importer le module de 3e plutôt que celui de Terminale évite de recopier une
// cinquième fois cette table de 34 lignes — une seule source, un seul endroit à
// corriger.
//
// ⚠️ Le slug `espagnol` porte désormais SIX modules (`espagnol-lycee.mjs` = 220,
// `espagnol-tle.mjs` = 231, `espagnol-1re.mjs` = 267, `espagnol-2de.mjs` = 287,
// `espagnol-3e.mjs` = 297, celui-ci = 305) : ne JAMAIS générer avec
// `--slugs espagnol`. Toujours `--modules espagnol-4e`.

import espagnol3e from './espagnol-3e.mjs'

// Les 34 fiches de 3e, telles quelles — chacune porte déjà son chapitre de
// programme (`axe`), posé par le module de 3e.
//
// Le `throw` n'est pas décoratif : si un `axe` disparaissait de la chaîne
// d'import, la fiche partirait sans chapitre — et elle échapperait au repère
// `theme IS NULL` du ménage, qui la supprimerait au rejeu suivant.
const chapitres = espagnol3e.blocs[0].chapitres.map((ch) => {
  if (!ch.axe) throw new Error(`espagnol-4e : aucun chapitre de programme pour « ${ch.titre} »`)
  return { ...ch }
})

export default {
  slug: 'espagnol',
  nom: 'Espagnol',

  titreMigration: 'L’ESPAGNOL DE QUATRIÈME, RENDU À SON PROGRAMME (34 fiches)',

  motif: `LE DÉFAUT : l'espagnol de 4e n'avait que les 4 fiches du premier jeu de données
de l'app — « El pretérito perfecto », « La ciudad y las direcciones », « Gustos y
opiniones », « La vida cotidiana » —, dont trois sont des thèmes de vocabulaire
et non des points de langue. Un élève qui bloque sur la négation, l'enclise des
pronoms, ser et estar, l'apocope, gustar ou le subjonctif ne trouvait RIEN.
CE QUE FAIT CETTE MIGRATION : elle rend à la matière son programme de LANGUE —
4 chapitres (La phrase, Le groupe nominal, Le groupe verbal, Les temps) et leurs
34 fiches, aux positions 1 à 34. Les 4 fiches héritées partent, leurs quiz et
leurs lignes de la file « À revoir » avec elles : un dossier de matière ne montre
que son programme, c'est la règle inscrite dans CLAUDE.md.
LE CONTENU EST CELUI DE LA 3e, à dessein : les programmes de LV sont écrits pour
le CYCLE 4, la grammaire y est la même, et la maquette de référence affiche les
mêmes 34 fiches aux deux niveaux — comme au lycée, d'où la 3e les tient déjà.
PÉRIMÈTRE : la QUATRIÈME SEULE. La 5e garde ses fiches héritées — le ménage est
borné à level = '4e'.`,

  menage: [
    {
      raison: `La colonne de rangement d'abord : theme (migration 234) porte le chapitre du
programme, et l'INSERT l'écrit pour les 34 fiches. Elle est REPRISE ici en ADD
COLUMN IF NOT EXISTS, comme dans les migrations 243 à 304.
Le ménage qui suit LIT cette colonne : elle doit exister avant lui, pas seulement
avant les insertions.
Le GRANT n'est pas décoratif : la 182 a révoqué le SELECT de table sur chapters
et ne l'a rendu que colonne par colonne ; une colonne ajoutée après elle n'hérite
d'aucun droit, et l'app lirait « permission denied » au lieu du chapitre.`,
      sql: `ALTER TABLE public.chapters ADD COLUMN IF NOT EXISTS theme TEXT;
GRANT SELECT (theme) ON public.chapters TO anon;
GRANT SELECT (theme) ON public.chapters TO authenticated;`,
    },
    {
      raison: `Les 4 fiches héritées de la 008 partent, au niveau 4e SEULEMENT.

LE REPÈRE EST theme IS NULL, PAS LE TITRE — même choix qu'en 297 : les quatre
titres sont en espagnol et portent des accents (« El pretérito perfecto », « La
ciudad y las direcciones »), et rien ne garantit qu'un copier-coller les
restitue à l'octet près ; un DELETE par titre ne trouverait alors pas la ligne,
EN SILENCE. Le critère « pas de chapitre de programme » vise exactement les
quatre lignes voulues : elles datent de la 008, bien avant la colonne theme,
tandis que les 34 fiches neuves en portent une dès l'INSERT — le ménage tourne
AVANT les insertions et ne peut donc jamais mordre sur elles, ni au premier
passage ni au rejeu.
Le filtre level = '4e' est indispensable : l'espagnol existe sur six niveaux
(5e → Tle) et la 5e porte elle aussi des chapitres sans theme.
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
   AND s.slug = 'espagnol'
   AND c.level = '4e'
   AND c.theme IS NULL;

DELETE FROM public.quizzes q
 USING public.lessons l, public.chapters c, public.subjects s
 WHERE q.lesson_id = l.id
   AND l.chapter_id = c.id
   AND c.subject_id = s.id
   AND s.slug = 'espagnol'
   AND c.level = '4e'
   AND c.theme IS NULL;

DELETE FROM public.chapters c
 USING public.subjects s
 WHERE c.subject_id = s.id
   AND s.slug = 'espagnol'
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
