// -----------------------------------------------------------------------------
// LE CONTRÔLE DES FICHES.
//
// Deux cents fiches écrites à la main — par plusieurs mains — dérivent : l'une
// oublie sa citation, l'autre renvoie vers une fiche qui n'existe pas, une
// troisième écrit un « récit » de deux lignes. Ce module dit NON à ma place, et
// le test `contenu.test.ts` le passe sur la totalité du corpus à chaque `npm
// test`. Il ne juge pas le style, il tient le CONTRAT : ce qu'une fiche doit
// avoir pour être utile à un élève.
//
// Pur : aucune lecture de fichier, aucune dépendance. Il reçoit les fiches
// déjà chargées et rend la liste des reproches, en français, avec l'id devant.
// -----------------------------------------------------------------------------

import {
  NIVEAUX,
  PERIODE_BORNES,
  PERIODES,
  estEvenement,
  estPersonnage,
  type Entree,
} from './types'

/** Les bornes du contrat, toutes au même endroit pour qu'elles se discutent. */
export const REGLES = {
  accroche: { min: 50, max: 200 },
  // Quatre signes, et pas huit : « Rien. » — le journal de chasse de Louis XVI
  // au 14 juillet 1789 — est une pièce d'encyclopédie à lui seul, et « Tout. »
  // est la réponse de Sieyès à sa propre question. Les phrases les plus courtes
  // de cette histoire sont parfois les plus célèbres ; la borne haute suffit à
  // écarter le paragraphe déguisé en citation.
  citation: { min: 4, max: 400 },
  contexte: { max: 200 },
  sens: { max: 260 },
  reperes: { min: 3, max: 6, ligne: { min: 15, max: 200 } },
  recit: { min: 3, max: 7, titre: { max: 70 }, texte: { min: 180, max: 1600 } },
  chrono: { min: 3, max: 12 },
  aRetenir: { min: 3, max: 6, ligne: { min: 15, max: 240 } },
  causes: { min: 3, max: 7 },
  consequences: { min: 3, max: 7 },
  roles: { min: 1, max: 4 },
  tags: { min: 2, max: 14 },
} as const

const ID_VALIDE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** Les caractères qui trahissent un id fabriqué à la va-vite (accents, points). */
export function idValide(id: string): boolean {
  return ID_VALIDE.test(id)
}

function longueur(texte: string): number {
  // Une citation en caractères Unicode, pas en unités UTF-16 : « … » et les
  // apostrophes typographiques ne doivent pas compter double.
  return [...texte].length
}

function verifierListe(
  problemes: string[],
  id: string,
  nom: string,
  lignes: readonly string[] | undefined,
  regle: { min: number; max: number; ligne?: { min: number; max: number } },
): void {
  const valeurs = lignes ?? []
  if (valeurs.length < regle.min || valeurs.length > regle.max) {
    problemes.push(
      `${id} — ${nom} : ${valeurs.length} au lieu de ${regle.min} à ${regle.max}.`,
    )
  }
  if (!regle.ligne) return
  for (const ligne of valeurs) {
    const n = longueur(ligne)
    if (n < regle.ligne.min || n > regle.ligne.max) {
      problemes.push(
        `${id} — ${nom} : « ${ligne.slice(0, 40)}… » fait ${n} signes (attendu ${regle.ligne.min} à ${regle.ligne.max}).`,
      )
    }
  }
}

/**
 * Les reproches faits à UNE fiche, sans regarder les autres.
 * Tableau vide = la fiche tient le contrat.
 */
export function validerEntree(entree: Entree): string[] {
  const problemes: string[] = []
  const { id } = entree

  if (!idValide(id)) {
    problemes.push(`${id} — identifiant : attendu en kebab-case sans accent.`)
  }
  if (!entree.nom.trim()) problemes.push(`${id} — nom vide.`)
  if (!PERIODES.includes(entree.periode)) {
    problemes.push(`${id} — période inconnue : « ${entree.periode} ».`)
  }
  if (!entree.emoji.trim() || longueur(entree.emoji) > 3) {
    problemes.push(`${id} — emoji : un seul pictogramme attendu.`)
  }

  // La période et l'année de tri doivent se répondre : une fiche classée au
  // Moyen Âge et triée en 1789 se retrouverait au mauvais bout de la frise.
  const bornes = PERIODE_BORNES[entree.periode]
  if (bornes && (entree.tri < bornes.debut || entree.tri > bornes.fin)) {
    problemes.push(
      `${id} — tri ${entree.tri} hors de la période « ${entree.periode} » (${bornes.debut} à ${bornes.fin}).`,
    )
  }

  const nAccroche = longueur(entree.accroche)
  if (nAccroche < REGLES.accroche.min || nAccroche > REGLES.accroche.max) {
    problemes.push(
      `${id} — accroche : ${nAccroche} signes (attendu ${REGLES.accroche.min} à ${REGLES.accroche.max}).`,
    )
  }

  // LA CITATION, le cœur du contrat : une fiche sans phrase citée n'a pas de
  // raison d'exister dans CETTE encyclopédie-là.
  if (entree.citations.length === 0) {
    problemes.push(`${id} — aucune citation.`)
  }
  for (const citation of entree.citations) {
    const n = longueur(citation.texte)
    if (n < REGLES.citation.min || n > REGLES.citation.max) {
      problemes.push(
        `${id} — citation « ${citation.texte.slice(0, 30)}… » : ${n} signes.`,
      )
    }
    if (citation.contexte && longueur(citation.contexte) > REGLES.contexte.max) {
      problemes.push(`${id} — contexte de citation trop long.`)
    }
    if (citation.sens && longueur(citation.sens) > REGLES.sens.max) {
      problemes.push(`${id} — explication de citation trop longue.`)
    }
  }

  verifierListe(problemes, id, 'repères', entree.reperes, REGLES.reperes)
  verifierListe(problemes, id, 'à retenir', entree.aRetenir, REGLES.aRetenir)
  verifierListe(problemes, id, 'tags', entree.tags, REGLES.tags)

  if (entree.recit.length < REGLES.recit.min || entree.recit.length > REGLES.recit.max) {
    problemes.push(
      `${id} — récit : ${entree.recit.length} blocs (attendu ${REGLES.recit.min} à ${REGLES.recit.max}).`,
    )
  }
  for (const bloc of entree.recit) {
    if (!bloc.titre.trim() || longueur(bloc.titre) > REGLES.recit.titre.max) {
      problemes.push(`${id} — titre de bloc invalide : « ${bloc.titre} ».`)
    }
    const n = longueur(bloc.texte)
    if (n < REGLES.recit.texte.min || n > REGLES.recit.texte.max) {
      problemes.push(
        `${id} — bloc « ${bloc.titre} » : ${n} signes (attendu ${REGLES.recit.texte.min} à ${REGLES.recit.texte.max}).`,
      )
    }
  }

  if (entree.chrono.length < REGLES.chrono.min || entree.chrono.length > REGLES.chrono.max) {
    problemes.push(
      `${id} — frise : ${entree.chrono.length} jalons (attendu ${REGLES.chrono.min} à ${REGLES.chrono.max}).`,
    )
  }

  if (entree.niveaux.length === 0) {
    problemes.push(`${id} — aucune classe : la fiche ne remonterait dans aucun filtre.`)
  }
  for (const niveau of entree.niveaux) {
    if (!NIVEAUX.includes(niveau)) problemes.push(`${id} — classe inconnue : ${niveau}.`)
  }

  if (entree.lies?.includes(id)) {
    problemes.push(`${id} — se renvoie à elle-même.`)
  }

  if (estPersonnage(entree)) {
    if (!entree.dates.trim()) problemes.push(`${id} — dates manquantes.`)
    verifierListe(problemes, id, 'rôles', entree.roles, REGLES.roles)
  }

  if (estEvenement(entree)) {
    if (!entree.date.trim()) problemes.push(`${id} — date manquante.`)
    verifierListe(problemes, id, 'causes', entree.causes, REGLES.causes)
    verifierListe(problemes, id, 'conséquences', entree.consequences, REGLES.consequences)
    if (entree.fin !== undefined && entree.fin < entree.tri) {
      problemes.push(`${id} — l'événement finit avant d'avoir commencé.`)
    }
  }

  return problemes
}

/**
 * Les reproches faits au CORPUS : ce qu'une fiche seule ne peut pas savoir —
 * les doublons d'identifiant et les renvois vers le vide.
 *
 * Un lien mort ne casse rien à l'écran (la puce ne s'affiche pas), et c'est
 * précisément pour ça qu'il faut le dire ici : sans ce test, il vivrait des
 * mois.
 */
export function validerCorpus(
  entrees: readonly Entree[],
  /**
   * L'UNIVERS des fiches connues, quand on ne contrôle qu'un lot : les renvois
   * d'une fiche partent souvent vers un autre fichier, et les déclarer morts
   * parce qu'on relit un lot isolé n'apprendrait rien. Par défaut, l'univers
   * est le lot lui-même — c'est le cas du corpus entier.
   */
  univers: readonly Entree[] = entrees,
): string[] {
  const problemes: string[] = []
  const vus = new Map<string, number>()
  for (const entree of entrees) {
    vus.set(entree.id, (vus.get(entree.id) ?? 0) + 1)
  }
  for (const [id, n] of vus) {
    if (n > 1) problemes.push(`${id} — identifiant en double (${n} fiches).`)
  }
  const connus = new Set(univers.map((entree) => entree.id))
  for (const entree of entrees) {
    for (const lien of entree.lies ?? []) {
      if (!connus.has(lien)) {
        problemes.push(`${entree.id} — renvoie vers « ${lien} », qui n'existe pas.`)
      }
    }
    problemes.push(...validerEntree(entree))
  }
  return problemes
}
