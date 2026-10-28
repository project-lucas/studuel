import { notFound } from 'next/navigation'
import PageJoueur, { type JoueurData } from '@/components/joueur/PageJoueur'
import { isArenaPeriod } from '@/lib/arena-background'
import { avatarDataUri, DEFAULT_AVATAR } from '@/lib/avatar'
import { barreNiveau, bureauDuPortrait, DECOR_JOUEUR, periodeInitiale, piedDuPortrait } from '@/lib/joueur'
import { blasonDeLigue } from '@/lib/ligue-place'
import { isPortraitKey, portraitSrc, type PortraitKey } from '@/lib/portraits'
import { walletLevelInfo } from '@/lib/wallet'
import ApercuChoix from './ApercuChoix'

export const dynamic = 'force-dynamic'

// L'APERÇU DE LA PAGE DU JOUEUR ET DU CHOIX DE PORTRAIT — en développement
// seulement, sans compte. Le bandeau du haut y est masqué comme sur /joueur.
//
//   /dev/joueur                 le roux (portrait 2) à son bureau, à l'heure qu'il est, Argent II, 7 jours
//   /dev/joueur?portrait=4      un autre portrait à son bureau
//   /dev/joueur?arena=night     fige la plage (dawn | morning | noon | afternoon | evening | night)
//   /dev/joueur?bureau=0        le repli d'avant : la chambre vide et le héros debout
//   /dev/joueur?pied=0          le repli du repli : le buste dans l'anneau (avatar composé)
//   /dev/joueur?echelon=20      Maître (0 = Bronze IV … 20) ; ?echelon=sans → anneau blanc
//   /dev/joueur?neuf=1          un compte neuf : niveau 1, rien encore
//   /dev/joueur?vue=choix       le gabarit ChoixPortrait (vestiaire : avec « Confirmer »)
//   /dev/joueur?vue=choix&vide=1   … sans portrait choisi (premier passage)

export default async function ApercuJoueurPage({
  searchParams,
}: {
  searchParams: Promise<{
    portrait?: string
    arena?: string
    bureau?: string
    pied?: string
    echelon?: string
    neuf?: string
    vue?: string
    vide?: string
  }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const q = await searchParams
  const portrait: PortraitKey = isPortraitKey(q.portrait) ? q.portrait : '2'

  if (q.vue === 'choix') {
    return (
      <div className="mx-auto w-full max-w-md px-0 pt-4 pb-24">
        <h1 className="sr-only">Aperçu du choix de portrait</h1>
        <ApercuChoix initial={q.vide === '1' ? null : portrait} />
      </div>
    )
  }

  const neuf = q.neuf === '1'
  const sansPied = q.pied === '0'
  const sansBureau = sansPied || q.bureau === '0'
  const rang = q.echelon === 'sans' ? null : blasonDeLigue(q.echelon === undefined ? 6 : Number(q.echelon) || 0)
  const data: JoueurData = {
    nom: neuf ? 'Sacha' : 'Lucas',
    classe: '3e',
    bureau: sansBureau ? null : bureauDuPortrait(portrait),
    periode: isArenaPeriod(q.arena) ? q.arena : periodeInitiale(new Date()),
    pied: sansPied ? null : piedDuPortrait(portrait),
    buste: sansPied
      ? { src: avatarDataUri(DEFAULT_AVATAR, 320), visage: false }
      : { src: portraitSrc(portrait), visage: true },
    rang,
    barre: barreNiveau(walletLevelInfo(neuf ? 0 : 2440)),
    serie: neuf ? 0 : 7,
    trophees: neuf ? 0 : 1284,
    xpSemaine: neuf ? 0 : 732,
    nbAmis: neuf ? 0 : 3,
    decor: DECOR_JOUEUR,
  }
  return <PageJoueur data={data} />
}
