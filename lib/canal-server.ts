import { cookies } from 'next/headers'
import { COOKIE_CANAL, estCanalPlay } from '@/lib/canal'

/** La page est-elle servie à l'app Android du Play Store ? Voir lib/canal.ts. */
export async function estAppPlay(): Promise<boolean> {
  const jar = await cookies()
  return estCanalPlay(jar.get(COOKIE_CANAL)?.value)
}
