// -----------------------------------------------------------------------------
// LE RECORD DE LA SEMAINE — la tuile qui ouvre le tableau de bord de Moi.
//
// Lucas, 02/10/2026 : « rajouter le record de travail de la semaine, avec un
// affichage s'il est en train de battre son précédent record ». Le temps de
// travail de la semaine en cours (du lundi UTC, comme la ligue et le rythme)
// se mesure à la MEILLEURE SEMAINE D'AVANT, lue dans le même journal quotidien
// que le rythme (`work_daily`, un an de profondeur : aucune requête de plus).
//
// TOUT SE COMPARE À LA MINUTE. L'écran écrit des minutes (« 2 h 40 ») : un
// record battu de trente secondes s'afficherait « Battu de 0 min », et
// 2 h 40 min 59 s face à 3 h 05 donnerait « Encore 24 min » sous un « 2 h 40 ».
// Les durées sont donc ramenées à la minute entière AVANT toute comparaison,
// et rendues en secondes (des multiples de 60) pour `formatDuree`.
//
// Logique pure, aucun accès base.
// -----------------------------------------------------------------------------

import { formatDuree, lundiDe, type JourTravail } from '@/lib/moi/temps'

/** Un jour de la semaine en cours, du lundi (0) au dimanche (6). */
export type JourSemaine = {
  secondes: number
  aujourdhui: boolean
  /** Après aujourd'hui : rien à juger, la barre reste en pointillé. */
  aVenir: boolean
}

/**
 * - `vide`      : ni travail cette semaine, ni semaine passée ;
 * - `premier`   : aucune semaine passée — celle-ci pose le premier record ;
 * - `en_course` : un record existe, il n'est pas dépassé (égalé compris) ;
 * - `battu`     : la semaine en cours a dépassé la meilleure d'avant.
 */
export type EtatRecord = 'vide' | 'premier' | 'en_course' | 'battu'

export type RecordSemaine = {
  /** Le travail de la semaine en cours, à la minute. */
  secondes: number
  /** La meilleure semaine D'AVANT, à la minute (0 : aucune). */
  record: number
  etat: EtatRecord
  /** Ce qui manque pour égaler le record (0 s'il est égalé, battu ou absent). */
  manque: number
  /** L'avance sur l'ancien record (0 tant qu'il tient). */
  depassement: number
  /** Les sept jours, lundi → dimanche. */
  jours: JourSemaine[]
}

const JOURS_PAR_SEMAINE = 7
const MS_PAR_JOUR = 86_400_000

const aLaMinute = (secondes: number): number => Math.floor(secondes / 60) * 60

const estUnJour = (cle: string): boolean =>
  /^\d{4}-\d{2}-\d{2}$/.test(cle) && !Number.isNaN(new Date(`${cle}T00:00:00.000Z`).getTime())

const semaineVide = (): JourSemaine[] =>
  Array.from({ length: JOURS_PAR_SEMAINE }, () => ({ secondes: 0, aujourdhui: false, aVenir: false }))

/** La semaine en cours face à la meilleure semaine passée. */
export function recordSemaine(jours: readonly JourTravail[], today: string): RecordSemaine {
  if (!estUnJour(today)) {
    return { secondes: 0, record: 0, etat: 'vide', manque: 0, depassement: 0, jours: semaineVide() }
  }

  const lundi = lundiDe(today)
  const debut = new Date(`${lundi}T00:00:00.000Z`).getTime()
  const rangAujourdhui = Math.round((new Date(`${today}T00:00:00.000Z`).getTime() - debut) / MS_PAR_JOUR)

  const parSemaine = new Map<string, number>()
  const parJour = new Array<number>(JOURS_PAR_SEMAINE).fill(0)
  for (const ligne of jours) {
    const cle = String(ligne?.day ?? '')
    const secondes = Number(ligne?.seconds)
    // Une ligne illisible, vide ou datée de demain ne compte nulle part.
    if (!estUnJour(cle) || cle > today || !Number.isFinite(secondes) || secondes <= 0) continue
    const semaine = lundiDe(cle)
    parSemaine.set(semaine, (parSemaine.get(semaine) ?? 0) + secondes)
    if (semaine === lundi) {
      const rang = Math.round((new Date(`${cle}T00:00:00.000Z`).getTime() - debut) / MS_PAR_JOUR)
      parJour[rang] += secondes
    }
  }

  const secondes = aLaMinute(parSemaine.get(lundi) ?? 0)
  let record = 0
  for (const [semaine, total] of parSemaine) {
    if (semaine < lundi) record = Math.max(record, aLaMinute(total))
  }

  const etat: EtatRecord =
    record === 0 ? (secondes > 0 ? 'premier' : 'vide') : secondes > record ? 'battu' : 'en_course'

  return {
    secondes,
    record,
    etat,
    manque: etat === 'en_course' ? record - secondes : 0,
    depassement: etat === 'battu' ? secondes - record : 0,
    jours: parJour.map((s, rang) => ({
      secondes: aLaMinute(s),
      aujourdhui: rang === rangAujourdhui,
      aVenir: rang > rangAujourdhui,
    })),
  }
}

/**
 * Ce que l'anneau dessine : `fait` est la part du record atteinte (1 quand il
 * est égalé ou battu, et pour un premier record — chaque minute EST le record),
 * `surplus` l'avance sur l'ancien record, en part de celui-ci, au plus un tour.
 */
export function anneauRecord(r: RecordSemaine): { fait: number; surplus: number } {
  if (r.etat === 'vide') return { fait: 0, surplus: 0 }
  if (r.etat === 'premier') return { fait: 1, surplus: 0 }
  if (r.etat === 'battu') return { fait: 1, surplus: Math.min(1, r.depassement / r.record) }
  return { fait: r.secondes / r.record, surplus: 0 }
}

export type LibellesRecord = {
  /** Le chiffre au cœur de l'anneau : le travail de la semaine. */
  valeur: string
  /** Le petit mot au-dessus de la cible. */
  sourcil: string
  /** La durée à côté de l'anneau : le record à battre, ou l'ancien. */
  cible: string
  /** La pastille : ce qui manque, ou l'avance. */
  pastille: string
  /** `vue` : jaune pâle (en chemin) ; `battu` : or plein ; `neutre` : rien à fêter. */
  ton: 'vue' | 'battu' | 'neutre'
}

/** Ce que la tuile écrit, état par état. */
export function libellesRecord(r: RecordSemaine): LibellesRecord {
  const valeur = formatDuree(r.secondes)
  switch (r.etat) {
    case 'vide':
      return { valeur, sourcil: 'Record de la semaine', cible: '—', pastille: 'À toi de le poser', ton: 'neutre' }
    case 'premier':
      return { valeur, sourcil: 'Ton premier record', cible: valeur, pastille: 'Il grandit à chaque minute', ton: 'vue' }
    case 'battu':
      return {
        valeur,
        sourcil: 'Ancien record',
        cible: formatDuree(r.record),
        pastille: `Battu de ${formatDuree(r.depassement)}`,
        ton: 'battu',
      }
    case 'en_course':
      return {
        valeur,
        sourcil: 'Record à battre',
        cible: formatDuree(r.record),
        pastille: r.manque > 0 ? `Encore ${formatDuree(r.manque)}` : 'Record égalé',
        ton: 'vue',
      }
  }
}

/**
 * La plus longue suite de jours d'activité consécutifs. Elle ne descend jamais
 * sous la série EN COURS : celle-ci compte les jours pontés par un gel
 * (lib/streak), que les jours d'activité seuls ne montrent pas.
 *
 * Elle ne voit que ce qu'on lui donne : `jours_actifs()` remonte à 400 jours
 * (lib/streak), une série plus ancienne n'y figure plus.
 */
export function meilleureSerie(joursActifs: Iterable<string>, serieEnCours: number): number {
  const dates = [...new Set(joursActifs)]
    .filter(estUnJour)
    .map((cle) => new Date(`${cle}T00:00:00.000Z`).getTime())
    .sort((a, b) => a - b)

  let meilleure = 0
  let suite = 0
  let precedente: number | null = null
  for (const date of dates) {
    suite = precedente !== null && date - precedente === MS_PAR_JOUR ? suite + 1 : 1
    meilleure = Math.max(meilleure, suite)
    precedente = date
  }
  return Math.max(meilleure, Math.max(0, Math.floor(Number(serieEnCours) || 0)))
}
