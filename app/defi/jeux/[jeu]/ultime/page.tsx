import { redirect } from 'next/navigation'
import GameTable from '@/components/jeux/GameTable'
import { playableSalonGame } from '@/lib/jeux/catalog'
import { gameFormat } from '@/lib/jeux/formats'
import { buildUltimePool } from '@/lib/jeux/pools'
import { hasUltime, ultimeFormat } from '@/lib/jeux/ultime'
import { getCurrentUser } from '@/lib/supabase/user'
import { nowMs } from '@/lib/defi-modes'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ jeu: string }>
}) {
  const { jeu } = await params
  const found = playableSalonGame(jeu)
  return {
    title: found ? `${found.game.name} · Épreuve ultime — Studuel` : 'Salon — Studuel',
  }
}

/**
 * Route /defi/jeux/[jeu]/ultime — L'ÉPREUVE ULTIME d'un jeu : une seule vie,
 * aucune fin, la difficulté qui monte tant qu'on ne se trompe pas.
 *
 * Elle est volontairement HORS de l'échelle des paliers (`palier={null}`) : elle
 * n'a pas d'étoiles à distribuer, et surtout aucun plancher de classe ne la
 * règle. C'est la condition pour que ses résultats se comparent entre TOUS les
 * joueurs — sans quoi un élève de 6e ne pourrait jamais prouver qu'il calcule
 * mieux qu'un lycéen, ce qui est exactement la raison d'être de cet écran.
 *
 * Seuls les jeux à banque générative l'ont (`ULTIME_GAMES`) : sur une banque
 * finie, la difficulté ne pourrait monter que par le chrono, et le classement
 * mesurerait la vitesse de lecture au lieu de la maîtrise.
 */
export default async function UltimePage({
  params,
}: {
  params: Promise<{ jeu: string }>
}) {
  const { jeu } = await params
  const found = playableSalonGame(jeu)
  if (!found) redirect('/defi')
  if (!hasUltime(jeu)) redirect(`/defi/jeux/${jeu}`)

  const base = gameFormat(jeu)
  if (!base) redirect('/defi')
  const format = ultimeFormat(base)

  const user = await getCurrentUser()
  if (!user) redirect('/defi')

  // Le déblocage (trois étoiles au dernier palier) vit dans le stockage local :
  // le serveur ne peut pas le vérifier ici. Un lien profond joue donc l'épreuve
  // sans l'avoir méritée — ce n'est pas un accès à protéger, et le classement,
  // lui, ne récompense que ce qui a réellement été joué.
  const seed = `${user.id}:${jeu}:ultime:${nowMs()}`
  const levels = buildUltimePool(jeu, seed)
  if (!levels || levels.length === 0) redirect(`/defi/jeux/${jeu}`)

  return (
    <GameTable
      format={format}
      palier={null}
      levels={levels}
      // Le premier paquet sert de garde-fou « banque vide » à la table ; la
      // partie, elle, pioche niveau par niveau dans `levels`.
      pool={levels[0]}
      name={found.game.name}
      subject={found.salon.subject}
      subjectEmoji={found.salon.emoji}
    />
  )
}
