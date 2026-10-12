// -----------------------------------------------------------------------------
// LA COURSE DE LA SEMAINE ENTRE AMIS — logique pure de la page Amis du carnet.
//
// Lucas, 05/10/2026 : « si le user a des amis, on doit voir apparaître qui de
// ses amis est devant par rapport au groupe (nombre de trophées gagnés, gain de
// niveau, gain d'XP) ; il faut appuyer le côté compétition ».
//
// Trois épreuves, toutes comptées DEPUIS LUNDI (comme la ligue) : un cumul de
// toujours ne se rattrape pas, une semaine si.
//   · l'XP gagnée — le travail, sous toutes ses formes ;
//   · les trophées gagnés — l'arène ;
//   · les niveaux gagnés — ce que l'XP a fait franchir.
// Pour chacune : qui mène, ma place, et qui est JUSTE DEVANT moi, avec l'écart
// à combler. C'est l'écart et le prénom qui donnent envie de jouer.
//
// Les données viennent de `classement_amis()` (465, étendue par la 558 pour
// l'XP). Sans la 558, l'XP est inconnue : seule l'épreuve des trophées reste.
// -----------------------------------------------------------------------------

import type { AmiClasse } from '@/lib/moi/classement-amis'
import { levelFromXp } from '@/lib/wallet'

export type Epreuve = 'xp' | 'trophees' | 'niveaux'

export const EPREUVES: readonly { cle: Epreuve; titre: string; unite: (n: number) => string }[] = [
  { cle: 'xp', titre: 'XP gagnée', unite: (n) => `${nombre(n)} XP` },
  { cle: 'trophees', titre: 'Trophées gagnés', unite: (n) => `${n > 0 ? '+' : n < 0 ? '−' : ''}${nombre(Math.abs(n))}` },
  { cle: 'niveaux', titre: 'Niveaux gagnés', unite: (n) => `+${nombre(n)} niv.` },
]

const nombre = (n: number) => Math.round(n).toLocaleString('fr-FR').replace(/ |\s/g, ' ')

/** Les niveaux franchis depuis lundi : niveau d'aujourd'hui moins celui de lundi. */
export function niveauxGagnes(xp: number, xpSemaine: number): number {
  const avant = Math.max(0, xp - Math.max(0, xpSemaine))
  return Math.max(0, levelFromXp(xp) - levelFromXp(avant))
}

/** La valeur d'un joueur pour une épreuve ; null quand la base ne la donne pas. */
export function valeurEpreuve(j: AmiClasse, epreuve: Epreuve): number | null {
  if (epreuve === 'trophees') return j.tropheesSemaine
  if (j.xp === null || j.xp === undefined || j.xpSemaine === null || j.xpSemaine === undefined) return null
  return epreuve === 'xp' ? j.xpSemaine : niveauxGagnes(j.xp, j.xpSemaine)
}

export type LigneCourse = AmiClasse & { rang: number; valeur: number }

export type Course = {
  epreuve: Epreuve
  titre: string
  /** Du premier au dernier ; à égalité l'ami passe devant (il faut le dépasser). */
  lignes: LigneCourse[]
  /** Celui qui mène — null si personne n'a encore rien marqué. */
  tete: LigneCourse | null
  moi: LigneCourse | null
  /** Le joueur juste devant moi, et ce qu'il me manque pour le passer. */
  devant: { joueur: LigneCourse; manque: number } | null
  /** La phrase de la course, écrite comme on parle. */
  phrase: string
}

export function classerEpreuve(joueurs: readonly AmiClasse[], epreuve: Epreuve): LigneCourse[] {
  return joueurs
    .flatMap((j) => {
      const valeur = valeurEpreuve(j, epreuve)
      return valeur === null ? [] : [{ ...j, valeur }]
    })
    .sort(
      (a, b) =>
        b.valeur - a.valeur ||
        Number(a.moi) - Number(b.moi) ||
        a.nom.localeCompare(b.nom, 'fr') ||
        a.id.localeCompare(b.id),
    )
    .map((j, i) => ({ ...j, rang: i + 1 }))
}

function phraseCourse(epreuve: Epreuve, moi: LigneCourse | null, tete: LigneCourse | null, devant: Course['devant']): string {
  const def = EPREUVES.find((e) => e.cle === epreuve)!
  if (!moi) return ''
  if (!tete) return 'Personne n’a encore marqué cette semaine : prends la tête.'
  if (moi.rang === 1) return 'Tu mènes. Garde ta place jusqu’à dimanche.'
  if (!devant) return ''
  const qui = devant.joueur.nom
  if (epreuve === 'xp') return `Encore ${nombre(devant.manque)} XP pour passer ${qui}.`
  if (epreuve === 'trophees') {
    return `Encore ${nombre(devant.manque)} trophée${devant.manque > 1 ? 's' : ''} pour passer ${qui}.`
  }
  return `${qui} a pris ${def.unite(devant.joueur.valeur).replace('+', '')} cette semaine.`
}

export function courseEpreuve(joueurs: readonly AmiClasse[], epreuve: Epreuve): Course | null {
  const lignes = classerEpreuve(joueurs, epreuve)
  if (lignes.length < 2) return null
  const moi = lignes.find((l) => l.moi) ?? null
  const premier = lignes[0]
  const tete = premier.valeur > 0 ? premier : null
  const juste = moi && moi.rang > 1 ? lignes[moi.rang - 2] : null
  // Passer devant = faire STRICTEMENT plus (à égalité, l'ami reste devant).
  const devant = juste && moi ? { joueur: juste, manque: Math.max(1, juste.valeur - moi.valeur + 1) } : null
  return {
    epreuve,
    titre: EPREUVES.find((e) => e.cle === epreuve)!.titre,
    lignes,
    tete,
    moi,
    devant,
    phrase: phraseCourse(epreuve, moi, tete, devant),
  }
}

/** Les épreuves que la base sait mesurer, dans l'ordre : XP, trophées, niveaux. */
export function courseDeLaSemaine(joueurs: readonly AmiClasse[]): Course[] {
  return EPREUVES.flatMap((e) => {
    const c = courseEpreuve(joueurs, e.cle)
    return c ? [c] : []
  })
}

/** Le libellé d'une valeur pour une épreuve (« 340 XP », « +12 », « +1 niv. »). */
export function libelleEpreuve(epreuve: Epreuve, valeur: number): string {
  return EPREUVES.find((e) => e.cle === epreuve)!.unite(valeur)
}
