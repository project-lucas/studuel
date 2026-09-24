import { REFERRAL_GEM_REWARD } from '@/lib/gems'

export type IssuePartage = 'partage' | 'copie' | 'annule'

/**
 * Partage MON lien d'invitation (`/parrain/<code>`) : la feuille de partage du
 * téléphone quand il en a une, le presse-papier sinon. Le lien de parrainage
 * fait tout d'un coup : l'ami reçoit ses gemmes à sa première révision, et vous
 * devenez amis (claim_referral, migration 183) — son XP tombe aussitôt dans
 * le coffre d'équipe. Une invitation ratée ne casse jamais l'écran : `annule`.
 */
export async function partagerInvitation(code: string): Promise<IssuePartage> {
  if (!code || typeof window === 'undefined') return 'annule'
  const url = `${window.location.origin}/parrain/${encodeURIComponent(code)}`
  const texte = `Fais équipe avec moi sur Studuel : chaque ami booste notre XP de la semaine, et on gagne ${REFERRAL_GEM_REWARD} gemmes chacun 💎`
  try {
    if (navigator.share) {
      await navigator.share({ title: 'Studuel', text: texte, url })
      return 'partage'
    }
    await navigator.clipboard.writeText(`${texte}\n${url}`)
    return 'copie'
  } catch {
    return 'annule'
  }
}
