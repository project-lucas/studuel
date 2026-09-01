// -----------------------------------------------------------------------------
// LE SOUS-ENSEMBLE MARKDOWN DES COURS — la découpe, sans le rendu.
//
// `components/LessonRichContent` peint ; ce module DÉCIDE. La séparation n'est
// pas cosmétique : la règle qui suit est celle dont dépend l'affichage de 43 %
// des cours de l'app, et elle doit pouvoir se tester sans monter un composant.
//
// CE QUE LE CONTENU CONTIENT VRAIMENT (relevé du 31/08/2026 sur les 2 340
// leçons en base) :
//
//   *italique*     11 237 occurrences · 1 000 leçons     l'exemple en langue
//   **gras**          très répandu                       le terme à retenir
//   | tableau |       472 lignes      ·    75 leçons     conjugaisons, listes
//   1. étape          579 lignes      ·   158 leçons     marches à suivre
//   - puce            très répandu
//   > idée clé        répandu
//   ## / #            titres
//
// Ni `###`, ni `---`, ni backticks : zéro occurrence, rien à coder pour eux.
// -----------------------------------------------------------------------------

/** Un fragment de texte inline, une fois la découpe faite. */
export type Fragment =
  | { type: 'texte'; valeur: string }
  /** `**…**` — le terme à retenir. */
  | { type: 'gras'; valeur: string }
  /** `*…*` — l'exemple : mot étranger, titre d'œuvre, nom latin. */
  | { type: 'italique'; valeur: string }

/**
 * Découpe une ligne en fragments.
 *
 * ⚠️ L'ORDRE DES ALTERNATIVES EST LA TOTALITÉ DE LA DIFFICULTÉ. `**…**` se teste
 * AVANT `*…*` : dans l'autre sens, `**gras**` se lirait comme un italique vide
 * suivi de texte, et le gras disparaîtrait de tous les cours de l'app. Le test
 * « le gras n'est pas mangé par l'italique » existe pour cette raison précise.
 *
 * `[^*\n]` borne l'italique à une seule ligne et lui interdit d'avaler une
 * étoile : une astérisque isolée dans une phrase reste une astérisque au lieu
 * d'engloutir le reste du paragraphe.
 */
export function segmenterInline(texte: string): Fragment[] {
  return texte
    .split(/(\*\*[^*]+\*\*|\*[^*\n]+\*)/g)
    .filter((part) => part.length > 0)
    .map((part): Fragment => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return { type: 'gras', valeur: part.slice(2, -2) }
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return { type: 'italique', valeur: part.slice(1, -1) }
      }
      return { type: 'texte', valeur: part }
    })
}

/** Une ligne est-elle une ligne de tableau (`| a | b |`) ? */
export function estLigneTableau(ligne: string): boolean {
  return /^\s*\|.*\|\s*$/.test(ligne.trim())
}

/** La ligne de séparation d'un tableau (`|---|:--:|`), à jeter. */
export function estSeparateurTableau(ligne: string): boolean {
  return /^\s*\|[\s:|-]+\|\s*$/.test(ligne)
}

/** `| a | b |` → ['a', 'b']. Les tuyaux de bord sont retirés, pas les vides. */
export function cellules(ligne: string): string[] {
  return ligne
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim())
}

/** Un tableau prêt à peindre : la première ligne sert d'en-tête. */
export type Tableau = { entete: string[]; corps: string[][] }

/**
 * Assemble les lignes brutes d'un tableau. Renvoie `null` si rien d'exploitable
 * ne subsiste une fois les séparateurs retirés — un tableau vide vaut mieux
 * pas affiché du tout qu'affiché en cadre creux.
 */
export function construireTableau(lignes: string[]): Tableau | null {
  const utiles = lignes.filter((l) => !estSeparateurTableau(l))
  if (utiles.length === 0) return null
  const [entete, ...corps] = utiles.map(cellules)
  return { entete, corps }
}

/**
 * Une étape numérotée (`1. …`) ? Renvoie son texte, ou `null`.
 *
 * LE POINT **ET** L'ESPACE SONT EXIGÉS, et deux chiffres au plus. Sans cette
 * borne, « 1985. Une année charnière » — une phrase parfaitement ordinaire dans
 * un cours d'histoire — deviendrait une liste numérotée d'un seul élément.
 */
export function etapeNumerotee(ligne: string): string | null {
  const m = /^(\d{1,2})\.\s+(.*)$/.exec(ligne.trim())
  return m ? m[2] : null
}

// -----------------------------------------------------------------------------
// LES QUATRE BLOCS DU COLLÈGE (ajoutés le 01/09/2026)
//
// POURQUOI QUATRE MARQUEURS DE PLUS. La campagne de schématisation du lycée
// avait tout ramené au TABLEAU : c'est l'outil juste pour une opposition à deux
// entrées (ser/estar, série/dérivation), et un élève de Terminale s'en accommode.
// De la 6e à la 4e, trois formes de savoir passent mal en grille :
//
//   · l'ERREUR CLASSIQUE, qu'il faut désigner autrement que l'idée à retenir —
//     un élève de onze ans qui voit deux encadrés dorés côte à côte n'apprend
//     pas lequel est le piège ;
//   · le PROCESSUS ordonné (cycle de l'eau, digestion, chaîne alimentaire,
//     algorithme), que la prose oblige à reconstruire dans sa tête ;
//   · la CHRONOLOGIE, colonne vertébrale de l'histoire au collège, où la date
//     doit se lire avant la phrase.
//
// À quoi s'ajoute la FORMULE, qu'un élève doit pouvoir retrouver sans relire le
// paragraphe qui la contient.
//
// LE CHOIX DES MARQUEURS EST MESURÉ, PAS DEVINÉ. Relevé du 01/09/2026 sur les
// 73 614 lignes des 2 235 cours du dépôt : `!> `, `= `, `@ ` et `~ ` en début de
// ligne totalisent ZÉRO occurrence. Aucun cours existant ne change de rendu.
//
// Le marqueur `~ ` mérite un mot : la chaîne aurait pu se reconnaître à ses
// flèches seules, sans marqueur. Elle a été essayée — 154 lignes de prose
// existantes contiennent « → » (*alt → älter*, « 3,47 → 3,5 »), et seraient
// devenues des schémas. Le marqueur explicite est le seul moyen sûr.
// -----------------------------------------------------------------------------

/**
 * `!> …` — L'ALERTE : l'erreur classique, le piège du contrôle.
 *
 * Se distingue de `> …` (l'idée clé, en or) par la couleur seule à l'écran :
 * corail, la couleur des alertes de la charte. Renvoie le texte, ou `null`.
 *
 * Le test `!>` passe AVANT `>` dans le composant : dans l'autre sens, aucune
 * alerte ne serait jamais reconnue, `!> ` ne commençant pas par `> `.
 */
export function alerte(ligne: string): string | null {
  const m = /^!>\s+(.*)$/.exec(ligne.trim())
  return m ? m[1] : null
}

/**
 * `= …` — LA FORMULE, ou le repère chiffré à emporter tel quel.
 *
 * `Aire du rectangle = Longueur × largeur`, `1 kWh = 3 600 000 J`. Le signe
 * égal en tête n'est pas une convention arbitraire : c'est celui que l'élève
 * écrit lui-même dans la marge de son cahier.
 */
export function formule(ligne: string): string | null {
  const m = /^=\s+(.*)$/.exec(ligne.trim())
  return m ? m[1] : null
}

/** Un jalon de frise : sa date, et ce qui s'y est passé. */
export type Jalon = { date: string; evenement: string }

/**
 * `@ 1789 — Prise de la Bastille` — UN JALON DE FRISE.
 *
 * Le tiret cadratin sépare la date de l'événement. Sans lui, la ligne entière
 * devient la date et l'événement reste vide : on préfère alors `null`, une
 * frise à jalons muets ne valant rien.
 */
export function jalon(ligne: string): Jalon | null {
  const m = /^@\s+(.+?)\s+—\s+(.+)$/.exec(ligne.trim())
  return m ? { date: m[1], evenement: m[2] } : null
}

/**
 * `~ Évaporation → Condensation → Pluie` — UNE CHAÎNE (schéma de flux).
 *
 * Renvoie les maillons, ou `null` s'il n'y a pas au moins une flèche : un
 * maillon unique n'est pas un schéma, c'est une phrase.
 */
export function chaine(ligne: string): string[] | null {
  const m = /^~\s+(.*)$/.exec(ligne.trim())
  if (!m) return null
  const maillons = m[1]
    .split('→')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
  return maillons.length >= 2 ? maillons : null
}
