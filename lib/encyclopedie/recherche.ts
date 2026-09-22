// -----------------------------------------------------------------------------
// LA BARRE DE RECHERCHE de l'encyclopédie, et les filtres qui l'accompagnent.
//
// Deux cents fiches, c'est trop pour une liste qu'on parcourt et trop peu pour
// un moteur : tout tient en mémoire, la recherche est SYNCHRONE et s'exécute à
// chaque touche sur un index déjà normalisé (`apercu.cles`). Aucun réseau,
// aucun délai, aucun « chargement… » — c'est ce qui fait qu'on ose taper.
//
// TROIS DÉCISIONS, et elles se voient à l'usage :
//
// 1. SANS ACCENT NI APOSTROPHE. « jeanne darc », « lumieres », « ete » trouvent
//    Jeanne d'Arc, les Lumières et l'été. Un élève de 4e ne tape pas « d'Arc »
//    avec l'apostrophe typographique, et il ne doit pas avoir à le savoir.
// 2. PAR DÉBUT DE MOT. « napo » trouve Napoléon, « revo » la Révolution.
//    Chercher n'importe où dans le mot ferait remonter des fiches sans rapport
//    et brouillerait le classement.
// 3. LES CITATIONS SONT INDEXÉES. On se souvient d'une phrase sans savoir de
//    qui elle est : « veni vidi vici », « l'État c'est moi », « la France a
//    perdu une bataille » mènent à leur fiche.
//
// Pur, sans dépendance, testé dans `recherche.test.ts`.
// -----------------------------------------------------------------------------

import type { Apercu } from './apercu'
import type { Niveau, Periode, Volet } from './types'

/**
 * Passe un texte en clé de recherche : minuscules, sans accent, sans
 * ponctuation, mots séparés par une seule espace.
 *
 * La décomposition NFD sépare la lettre de son accent ; le bloc U+0300-U+036F
 * (les diacritiques combinants) part ensuite à la poubelle. C'est la même
 * mécanique que `searchKey` (lib/subject-template) — volontairement, pour que
 * chercher se comporte pareil dans toute l'app.
 */
export function normaliser(texte: string): string {
  return texte
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/** Les mots d'une requête, normalisés, sans les mots d'une seule lettre. */
export function motsDe(requete: string): string[] {
  return normaliser(requete)
    .split(' ')
    .filter((mot) => mot.length > 0)
}

/**
 * LES ÉLISIONS RECOLLÉES — « jeanne darc », « lencyclopedie », « quatrevingt ».
 *
 * `normaliser` transforme « Jeanne d’Arc » en « jeanne d arc » : l'apostrophe
 * devient une espace, et le mot « arc » reste cherchable. Mais un élève tape
 * « jeanne darc » — sans apostrophe du tout — et ne trouvait alors RIEN, parce
 * que « darc » ne commence aucun mot de l'index. Le défaut touchait tout le
 * français : « l'Encyclopédie », « d'Alembert », « l'édit de Nantes ».
 *
 * On ajoute donc à l'index les mots recollés : chaque mot d'une ou deux lettres
 * (les élisions d’, l’, j’, n’, s’, qu’) soudé au suivant. Deux tokens de plus
 * par fiche, et la barre de recherche cesse de punir une apostrophe oubliée.
 */
export function elisions(normalise: string): string[] {
  const mots = normalise.split(' ').filter((mot) => mot.length > 0)
  const recolles: string[] = []
  for (let i = 0; i < mots.length - 1; i++) {
    if (mots[i].length <= 2) recolles.push(mots[i] + mots[i + 1])
  }
  return recolles
}

/**
 * Un mot de la requête est-il le DÉBUT d'un mot de l'index ?
 *
 * L'index est une suite de mots séparés par des espaces : on borne donc la
 * recherche à un début de mot en testant « ^mot » ou « mot précédé d'une
 * espace ». Pas de regex : construite à chaque frappe sur deux cents fiches,
 * elle coûtait plus cher que les deux `indexOf` qu'elle remplace, et une
 * requête contenant un caractère spécial aurait dû être échappée.
 */
export function commenceUnMot(cles: string, mot: string): boolean {
  // UN NOMBRE SE CHERCHE EN ENTIER, pas par son début. « louis 14 » remontait
  // Louis XI (mort en 1483) et Anne de Bretagne (1477-1514), parce que « 14 »
  // est le début de « 1483 » — et « 14 juillet » passait derrière le sacre de
  // Charles VII (1429). Une date tapée est une date voulue.
  if (/^\d+$/.test(mot)) return ` ${cles} `.includes(` ${mot} `)
  if (cles.startsWith(mot)) return true
  return cles.includes(` ${mot}`)
}

/**
 * LES CHIFFRES ROMAINS, RENDUS EN CHIFFRES ARABES — « Louis XIV » indexe aussi
 * « 14 », « Napoléon III » aussi « 3 ».
 *
 * Un élève de quatrième tape « louis 14 » et « napoleon 3 » : c'est comme ça
 * qu'on parle, et c'est comme ça qu'on cherche. Sans cette conversion,
 * « napoleon 3 » ne rendait RIEN et « louis 16 » tombait sur Louis XIV.
 *
 * Ne s'applique qu'aux NOMS : un « I » ou un « V » isolé dans une citation ne
 * veut rien dire, alors qu'après « Louis » il ne veut dire qu'une chose.
 */
const ROMAINS: Record<string, string> = {
  i: '1', ii: '2', iii: '3', iv: '4', v: '5', vi: '6', vii: '7', viii: '8',
  ix: '9', x: '10', xi: '11', xii: '12', xiii: '13', xiv: '14', xv: '15',
  xvi: '16', xvii: '17', xviii: '18', xix: '19', xx: '20',
}

export function chiffresRomains(normalise: string): string[] {
  const trouves: string[] = []
  for (const mot of normalise.split(' ')) {
    const arabe = ROMAINS[mot]
    if (arabe) trouves.push(arabe)
  }
  return trouves
}

/**
 * Le score d'une fiche pour une requête, ou 0 si elle ne correspond pas.
 *
 * TOUS les mots de la requête doivent être trouvés (un « et », pas un « ou ») :
 * « louis xiv » ne doit pas remonter les dix-huit Louis parce que « louis »
 * suffirait.
 *
 * Le classement met devant ce que l'élève cherchait le plus probablement :
 * une fiche dont le NOM commence par la requête avant une fiche qui ne la
 * contient que dans une citation.
 */
export function score(apercu: Apercu, mots: string[]): number {
  if (mots.length === 0) return 1
  let points = 0
  const nom = normaliser(apercu.nom)
  // LA VEDETTE : le nom ET le surnom. Un mot trouvé là vaut plus qu'un mot
  // trouvé dans une citation ou un tag — « roi soleil » remontait Charles
  // Quint, dont la fiche parle de « l'empire où le soleil ne se couche
  // jamais », devant Louis XIV, dont c'est le SURNOM. Deux mots trouvés au
  // même endroit ne se valent pas selon l'endroit.
  const vedette = normaliser(`${apercu.nom} ${apercu.detail ?? ''}`)
  for (const mot of mots) {
    if (!commenceUnMot(apercu.cles, mot)) return 0
    if (nom.startsWith(mot)) points += 4
    else if (commenceUnMot(vedette, mot)) points += 2
    else points += 1
  }
  return points
}

/**
 * Les mots que la CARTE affiche déjà : le nom, le surnom (ou le lieu), les
 * dates et la citation tronquée.
 *
 * Ils ne voyagent pas dans `cles` — ils sont déjà dans l'aperçu pour être
 * peints, et les envoyer deux fois pesait cinquante kilo-octets. Le client
 * recolle les deux moitiés au premier rendu.
 */
export function clesAffichees(apercu: {
  nom: string
  detail?: string
  dates: string
  citation: string
  citationQui?: string
}): string {
  const normalise = normaliser(
    [apercu.nom, apercu.detail ?? '', apercu.dates, apercu.citation, apercu.citationQui ?? ''].join(
      ' ',
    ),
  )
  const mots = new Set(normalise.split(' ').filter((mot) => mot.length > 1))
  for (const recolle of elisions(normalise)) mots.add(recolle)
  // « Louis XIV » se cherche aussi « louis 14 » — mais seulement sur le nom,
  // jamais dans une citation où un « V » isolé ne veut rien dire.
  for (const arabe of chiffresRomains(normaliser(apercu.nom))) mots.add(arabe)
  return [...mots].join(' ')
}

/**
 * L'index complet, côté client : ce que le serveur a envoyé (`cles`, les mots
 * invisibles) recollé aux mots de la carte. Un `map` sur deux cent cinquante
 * lignes, une seule fois par ouverture d'écran — à mémoïser par l'appelant.
 */
export function indexer(liste: readonly Apercu[]): Apercu[] {
  return liste.map((apercu) => ({
    ...apercu,
    cles: `${clesAffichees(apercu)} ${apercu.cles}`.trim(),
  }))
}

export type Filtres = {
  volet: Volet
  /** `null` = toutes les périodes. */
  periode?: Periode | null
  /** `null` = toutes les classes ; sinon, les fiches de CETTE classe. */
  niveau?: Niveau | null
  requete?: string
}

/**
 * Les fiches à afficher, filtrées puis classées.
 *
 * SANS REQUÊTE, l'ordre est CHRONOLOGIQUE — c'est une encyclopédie d'histoire,
 * la frise est son classement naturel, et une liste alphabétique mettrait
 * Napoléon avant Clovis. AVEC une requête, l'ordre est celui de la
 * pertinence : ce qu'on cherche doit être la première ligne, pas la septième.
 */
export function filtrer(apercusListe: readonly Apercu[], filtres: Filtres): Apercu[] {
  const mots = motsDe(filtres.requete ?? '')
  const retenus: { apercu: Apercu; points: number }[] = []
  for (const apercu of apercusListe) {
    if (apercu.volet !== filtres.volet) continue
    if (filtres.periode && apercu.periode !== filtres.periode) continue
    if (filtres.niveau && !apercu.niveaux.includes(filtres.niveau)) continue
    const points = score(apercu, mots)
    if (points === 0) continue
    retenus.push({ apercu, points })
  }
  retenus.sort((a, b) => {
    if (mots.length > 0 && b.points !== a.points) return b.points - a.points
    if (a.apercu.tri !== b.apercu.tri) return a.apercu.tri - b.apercu.tri
    return a.apercu.nom.localeCompare(b.apercu.nom, 'fr')
  })
  return retenus.map((r) => r.apercu)
}

/**
 * Les périodes qui ont au moins une fiche dans ce volet, dans l'ordre du
 * temps : un filtre qui ne filtre rien est un bouton qui ment.
 */
export function periodesPresentes(
  apercusListe: readonly Apercu[],
  volet: Volet,
  ordre: readonly Periode[],
): Periode[] {
  const vues = new Set<Periode>()
  for (const apercu of apercusListe) {
    if (apercu.volet === volet) vues.add(apercu.periode)
  }
  return ordre.filter((periode) => vues.has(periode))
}

/** Le compte de fiches par volet, pour les deux onglets de l'écran. */
export function comptes(apercusListe: readonly Apercu[]): Record<Volet, number> {
  const total: Record<Volet, number> = { personnages: 0, evenements: 0 }
  for (const apercu of apercusListe) total[apercu.volet] += 1
  return total
}

/**
 * LA CITATION DU JOUR — la même pour tout le monde, un jour durant.
 *
 * Tirée de la clé du jour (`YYYY-MM-DD`) et non de `Math.random` : le serveur
 * et le client doivent tomber sur la même, sinon React reproche une hydratation
 * divergente et l'élève voit la phrase changer sous ses yeux au chargement.
 */
export function indexDuJour(cleDuJour: string, total: number): number {
  if (total <= 0) return 0
  let empreinte = 0
  for (const lettre of cleDuJour) {
    empreinte = (empreinte * 31 + lettre.charCodeAt(0)) % 100000007
  }
  return empreinte % total
}
