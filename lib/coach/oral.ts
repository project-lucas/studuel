// -----------------------------------------------------------------------------
// L'ÉCHELLE DE L'ORAL — les quatre barreaux (doctrine COACH-PROF §4).
//
// Le bac de français, le grand oral et l'oral du brevet se jouent là, et aucune
// app ne le fait, parce que tout le monde cherche à faire NOTER l'oral par une
// IA. Studuel ne note pas : il fait **répéter**.
//
//   1. Les cartes         — l'élève choisit ce qu'il va dire (carnet, flashcards)
//   2. Seul, à voix haute — l'app lance un chrono, ne capte RIEN, mesure la
//                           durée tenue
//   3. Enregistré         — il s'écoute et s'auto-évalue sur trois critères ;
//                           l'audio ne quitte jamais l'appareil
//   4. Devant quelqu'un   — un ami (ou un parent) coche les MÊMES trois critères
//
// Coût IA : **zéro**, à tous les barreaux. C'est le différenciateur le moins
// cher du produit, et le barreau 4 est le seul usage social vraiment neuf que la
// doctrine propose — il branche Marcel sur l'onglet Amis.
//
// Ce module est PUR : il décide des barreaux, des seuils et des verdicts. Rien
// n'y touche à la base, au micro ni au minuteur.
// -----------------------------------------------------------------------------

export type BarreauId = 1 | 2 | 3 | 4

export type Barreau = {
  id: BarreauId
  titre: string
  promesse: string
  /** Ce que l'app fait — et surtout ce qu'elle ne fait pas. */
  precision: string
}

export const BARREAUX: readonly Barreau[] = [
  {
    id: 1,
    titre: 'Tes cartes',
    promesse: 'Choisis ce que tu vas dire : un texte, un axe, une problématique.',
    precision:
      'Tes fiches et tes flashcards existent déjà — l’oral part de là, pas d’une page blanche.',
  },
  {
    id: 2,
    titre: 'Seul, à voix haute',
    promesse: 'Tu parles, je compte le temps. Rien d’autre.',
    precision:
      'Aucun micro, aucun enregistrement : je mesure seulement combien de temps tu tiens.',
  },
  {
    id: 3,
    titre: 'Enregistré',
    promesse: 'Tu t’enregistres, tu te réécoutes, tu coches trois cases.',
    precision:
      'L’audio reste sur ton téléphone et n’est jamais envoyé. C’est TOI qui juges — c’est ça, l’exercice.',
  },
  {
    id: 4,
    titre: 'Devant quelqu’un',
    promesse: 'Un ami t’écoute et coche les mêmes trois cases.',
    precision:
      'C’est exactement ce que font les élèves qui réussissent leur oral. Et ça ne coûte rien.',
  },
] as const

// Les trois critères, identiques au barreau 3 (auto-évaluation) et au barreau 4
// (évaluation par un ami). C'est volontaire : l'élève apprend à se juger avec la
// même grille que celle d'un auditeur.
export type CritereId = 'intro' | 'plan' | 'transitions'

export const CRITERES: readonly { id: CritereId; label: string; aide: string }[] =
  [
    {
      id: 'intro',
      label: 'Intro claire',
      aide: 'On sait de quoi tu parles dès les vingt premières secondes.',
    },
    {
      id: 'plan',
      label: 'Plan annoncé',
      aide: 'On sait où tu vas : deux ou trois parties, dites à voix haute.',
    },
    {
      id: 'transitions',
      label: 'Transitions',
      aide: 'On sent le passage d’une partie à l’autre sans se perdre.',
    },
  ] as const

export type Criteres = Record<CritereId, boolean>

export const CRITERES_VIDES: Criteres = {
  intro: false,
  plan: false,
  transitions: false,
}

export function compterCriteres(c: Criteres): number {
  return CRITERES.filter((crit) => c[crit.id]).length
}

// -----------------------------------------------------------------------------
// Les épreuves et leur durée cible
// -----------------------------------------------------------------------------
export type EpreuveId = 'brevet' | 'francais' | 'grand-oral' | 'libre'

export type Epreuve = {
  id: EpreuveId
  nom: string
  /** Durée de l'exposé, en secondes. */
  cible: number
  detail: string
}

export const EPREUVES: readonly Epreuve[] = [
  {
    id: 'brevet',
    nom: 'Oral du brevet',
    cible: 5 * 60,
    detail: '5 min d’exposé, puis 10 min d’échange avec le jury.',
  },
  {
    id: 'francais',
    nom: 'Oral de français',
    cible: 8 * 60,
    detail: '8 min : lecture, explication linéaire, puis la question de grammaire.',
  },
  {
    id: 'grand-oral',
    nom: 'Grand oral',
    cible: 10 * 60,
    detail: '10 min d’exposé sans notes, puis 10 min d’échange.',
  },
  {
    id: 'libre',
    nom: 'Entraînement libre',
    cible: 3 * 60,
    detail: 'Trois minutes pour dire une idée proprement. Le format le plus utile.',
  },
] as const

export function epreuveOf(id: string | null | undefined): Epreuve {
  return EPREUVES.find((e) => e.id === id) ?? EPREUVES[EPREUVES.length - 1]
}

/**
 * L'épreuve que Marcel propose par défaut selon la classe. On ne devine pas au
 * hasard : un 3e passe le brevet, un 1re l'oral de français, un terminale le
 * grand oral. Tout le monde peut choisir autre chose.
 */
export function epreuveParDefaut(niveau: string | null | undefined): EpreuveId {
  if (niveau === '3e') return 'brevet'
  if (niveau === '1re') return 'francais'
  if (niveau === 'Tle') return 'grand-oral'
  return 'libre'
}

// -----------------------------------------------------------------------------
// Le verdict d'un passage — jamais une note
// -----------------------------------------------------------------------------
export type Verdict = {
  /** Part de la cible réellement tenue, bornée à 1. */
  ratio: number
  /** Ce que Marcel dit. Encourageant, jamais chiffré comme une note. */
  phrase: string
  /** Le passage compte-t-il comme « tenu » ? (≥ 80 % de la cible) */
  tenu: boolean
}

export const SEUIL_TENU = 0.8

export function verdictDuree(secondes: number, cible: number): Verdict {
  const duree = Math.max(0, Math.floor(secondes))
  const ratio = cible > 0 ? Math.min(1, duree / cible) : 0
  const tenu = ratio >= SEUIL_TENU

  if (duree < 30) {
    return {
      ratio,
      tenu: false,
      phrase: 'Trop court pour dire quelque chose. Reprends, sans t’arrêter.',
    }
  }
  if (ratio >= 1) {
    return { ratio, tenu, phrase: 'Tu as tenu la durée complète. C’est fait.' }
  }
  if (tenu) {
    return {
      ratio,
      tenu,
      phrase: 'Tu y es presque : il te manque moins d’une minute de contenu.',
    }
  }
  if (ratio >= 0.5) {
    return {
      ratio,
      tenu,
      phrase: 'La moitié tient. Cherche un exemple de plus par partie.',
    }
  }
  return {
    ratio,
    tenu,
    phrase: 'C’est un début. Vise d’abord de parler sans t’interrompre.',
  }
}

// Format court d'une durée : « 4 min 05 ».
export function formatDuree(secondes: number): string {
  const s = Math.max(0, Math.floor(secondes))
  const min = Math.floor(s / 60)
  const reste = s % 60
  if (min === 0) return `${reste} s`
  return `${min} min ${String(reste).padStart(2, '0')}`
}

// -----------------------------------------------------------------------------
// La progression sur l'échelle
// -----------------------------------------------------------------------------
export type PassageOral = {
  barreau: BarreauId
  /** Secondes tenues (barreaux 2 et 3). */
  duree: number
  criteres: Criteres | null
  /** Clé de jour UTC (YYYY-MM-DD). */
  jour: string
}

export type EtatEchelle = {
  /** Barreaux déjà franchis au moins une fois. */
  franchis: BarreauId[]
  /** Le prochain barreau à travailler. */
  prochain: BarreauId
  /** Nombre de passages, tous barreaux confondus. */
  passages: number
  /** Meilleure durée tenue, en secondes. */
  meilleureDuree: number
  /** Jours distincts où l'élève a répété. */
  jours: number
}

/**
 * Un barreau est FRANCHI quand il a produit un passage exploitable :
 *   · barreau 2 : au moins 30 secondes tenues (en dessous, rien n'a été dit) ;
 *   · barreau 3 : un passage avec auto-évaluation remplie ;
 *   · barreau 4 : un retour d'ami enregistré.
 * Le barreau 1 est franchi dès qu'un sujet existe — donc dès le premier passage.
 */
export function etatEchelle(passages: readonly PassageOral[]): EtatEchelle {
  const franchis = new Set<BarreauId>()
  let meilleureDuree = 0
  const jours = new Set<string>()

  for (const p of passages) {
    jours.add(p.jour)
    meilleureDuree = Math.max(meilleureDuree, p.duree)
    franchis.add(1)
    if (p.barreau === 2 && p.duree >= 30) franchis.add(2)
    if (p.barreau === 3 && p.criteres) {
      franchis.add(2)
      franchis.add(3)
    }
    if (p.barreau === 4 && p.criteres) {
      franchis.add(2)
      franchis.add(3)
      franchis.add(4)
    }
  }

  const ordre: BarreauId[] = [1, 2, 3, 4]
  const prochain = ordre.find((b) => !franchis.has(b)) ?? 4

  return {
    franchis: ordre.filter((b) => franchis.has(b)),
    prochain,
    passages: passages.length,
    meilleureDuree,
    jours: jours.size,
  }
}

/**
 * La phrase d'accroche de l'échelle, côté Marcel. Elle dit toujours la
 * PROCHAINE marche, jamais un pourcentage : « il te reste 40 % » ne fait
 * répéter personne.
 */
export function accrocheEchelle(etat: EtatEchelle): string {
  if (etat.passages === 0) {
    return 'Un oral, ça ne se relit pas : ça se répète. On commence par trois minutes.'
  }
  // Échelle complète : `prochain` vaut 4 (on redescend toujours travailler le
  // dernier barreau), mais il ne faut PAS redemander un auditeur à quelqu'un
  // qui en a déjà eu un. Sans ce test, Marcel réclamait éternellement l'étape
  // que l'élève venait de franchir.
  if (etat.franchis.length === BARREAUX.length) {
    return 'Tu as gravi les quatre barreaux. Refais-en un aujourd’hui : ça ne tient que par la répétition.'
  }
  switch (etat.prochain) {
    case 2:
      return 'Tu as ton sujet. Maintenant, debout, à voix haute, sans t’arrêter.'
    case 3:
      return 'Tu tiens la durée. Enregistre-toi une fois : tu vas t’entendre.'
    case 4:
      return 'Il te manque un auditeur. Demande à un ami de t’écouter — c’est le vrai test.'
    default:
      return 'Tu as gravi les quatre barreaux. Refais-en un aujourd’hui : ça ne tient que par la répétition.'
  }
}

// -----------------------------------------------------------------------------
// Le barreau 4 : la demande d'écoute
// -----------------------------------------------------------------------------
export type StatutDemande = 'en_attente' | 'ecoutee' | 'refusee'

export type DemandeEcoute = {
  id: string
  sujet: string
  epreuve: EpreuveId
  statut: StatutDemande
  criteres: Criteres | null
  commentaire: string | null
}

const MAX_SUJET = 120
const MAX_COMMENTAIRE = 280

export type SujetVerifie = { ok: true; valeur: string } | { ok: false; raison: string }

export function verifierSujet(brut: string | null | undefined): SujetVerifie {
  const valeur = (brut ?? '').trim().replace(/\s+/g, ' ')
  if (valeur.length < 3) {
    return { ok: false, raison: 'Dis en deux mots sur quoi tu vas parler.' }
  }
  if (valeur.length > MAX_SUJET) {
    return { ok: false, raison: 'C’est un titre, pas l’exposé : fais plus court.' }
  }
  return { ok: true, valeur }
}

export function nettoyerCommentaire(brut: string | null | undefined): string | null {
  const valeur = (brut ?? '').trim().replace(/\s+/g, ' ')
  if (valeur === '') return null
  return valeur.slice(0, MAX_COMMENTAIRE)
}

/**
 * Le retour rendu à l'élève après une écoute. Deux critères sur trois, c'est
 * déjà un oral qui tient : on le dit, au lieu d'aligner des croix.
 */
export function retourEcoute(criteres: Criteres): string {
  const n = compterCriteres(criteres)
  if (n === 3) return 'Les trois critères y sont. Ton oral tient debout.'
  if (n === 2) {
    const manquant = CRITERES.find((c) => !criteres[c.id])
    return `Deux critères sur trois. Il te manque : ${manquant?.label.toLowerCase()}.`
  }
  if (n === 1) {
    const acquis = CRITERES.find((c) => criteres[c.id])
    return `${acquis?.label} est là. Reprends le reste, une chose à la fois.`
  }
  return 'Rien n’est acquis pour l’instant — commence par annoncer ton plan.'
}
