import { notFound } from 'next/navigation'
import AmisHome from '@/components/AmisHome'
import { ligueApercu } from '@/lib/ligue-apercu'
import { referralSummary } from '@/lib/gems'
import type { BilanLigue, JoueurAmi } from '@/lib/ligue'

export const dynamic = 'force-dynamic'

// L'APERÇU DE LA LIGUE DE LA SEMAINE — en développement seulement.
//
// L'onglet Amis avec une ligue d'exemple, et l'écran de fin de semaine à la
// demande, sans compte ni migration :
//
//   /dev/ligue                         Bronze 2, 9e sur 30, 3 amis
//   /dev/ligue?e=0&rang=3              Bronze 4, sur le podium
//   /dev/ligue?bilan=division          fin de semaine : Bronze 3 → Bronze 2
//   /dev/ligue?bilan=rang              fin de semaine : Bronze 1 → Argent 4
//   /dev/ligue?bilan=maintenu          fin de semaine : on reste
//   /dev/ligue?bilan=relegue           fin de semaine : Argent 3 → Argent 4
//   /dev/ligue?bilan=relegue-rang      fin de semaine : Argent 4 → Bronze 1
//   /dev/ligue?inscrit=0               pas encore d'XP cette semaine
//   /dev/ligue?absente=1               migration 376 pas passée
//   /dev/ligue?amis=0                  la carte du bonus, sans ami
//   /dev/ligue?invitation=0            sans la fenêtre d'invitation
//   /dev/ligue?coffre=3                le coffre de la semaine passée, niveau 3, à ouvrir
//
// La fenêtre « Fais équipe avec tes amis » s'ouvre une fois par semaine
// (localStorage `studuel-invitation-semaine`) : l'effacer pour la revoir.

const BILANS: Record<string, BilanLigue> = {
  division: bilan({ echelonAvant: 1, echelonApres: 2, rang: 3, xp: 640, gemmes: 15, nbAmis: 3, bonusXp: 192, niveauAvant: 6, niveauApres: 7, gemmesNiveau: 15 }),
  rang: bilan({ echelonAvant: 3, echelonApres: 4, rang: 1, xp: 1180, gemmes: 40, nbAmis: 5, bonusXp: 590, niveauAvant: 9, niveauApres: 11, gemmesNiveau: 30 }),
  maintenu: bilan({ echelonAvant: 2, echelonApres: 2, rang: 12, xp: 310, gemmes: 0, nbAmis: 1, bonusXp: 31 }),
  relegue: bilan({ echelonAvant: 5, echelonApres: 4, rang: 28, xp: 40, gemmes: 0 }),
  'relegue-rang': bilan({ echelonAvant: 4, echelonApres: 3, rang: 27, xp: 25, gemmes: 0 }),
}

function bilan(patch: Partial<BilanLigue>): BilanLigue {
  return {
    semaine: '2026-09-14',
    echelonAvant: 0,
    echelonApres: 0,
    rang: 10,
    taille: 30,
    xp: 0,
    gemmes: 0,
    nbAmis: 0,
    bonusXp: 0,
    niveauAvant: null,
    niveauApres: null,
    gemmesNiveau: 0,
    gemmesTirelire: 0,
    tirelireAmis: 0,
    coffreNiveau: 0,
    ...patch,
  }
}

const AMIS: JoueurAmi[] = [
  { id: 'ami-lea', nom: 'Léa', portrait: '', xp: 420, echelon: 5, moi: false },
  { id: 'ami-rayan', nom: 'Rayan', portrait: '', xp: 260, echelon: 2, moi: false },
  { id: 'ami-ines', nom: 'Inès', portrait: '', xp: 90, echelon: 1, moi: false },
]

export default async function ApercuLiguePage({
  searchParams,
}: {
  searchParams: Promise<{
    e?: string
    rang?: string
    bilan?: string
    inscrit?: string
    absente?: string
    amis?: string
    coffre?: string
    invitation?: string
  }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const q = await searchParams
  const entier = (v: string | undefined, defaut: number) => {
    const n = Number(v)
    return v !== undefined && Number.isFinite(n) ? Math.trunc(n) : defaut
  }
  const maintenant = new Date()
  const leBilan = q.bilan ? (BILANS[q.bilan] ?? null) : null
  const nbAmis = Math.max(0, entier(q.amis, 3))
  const ligue =
    q.absente === '1'
      ? null
      : ligueApercu({
          maintenant,
          echelon: leBilan ? leBilan.echelonApres : entier(q.e, 2),
          monRang: entier(q.rang, 9),
          inscrit: q.inscrit !== '0',
          nbAmis,
          bilan: leBilan,
          coffrePret: entier(q.coffre, 0),
        })
  const moi: JoueurAmi = {
    id: 'moi',
    nom: 'Toi',
    portrait: '',
    xp: ligue?.xpSemaine ?? 0,
    echelon: ligue?.echelon ?? 0,
    moi: true,
  }

  return (
    <div className="mx-auto max-w-md px-4 pt-20 pb-28">
      <h1 className="sr-only">Aperçu de la ligue</h1>
      <AmisHome
        connecte
        inviterAuto={q.invitation !== '0'}
        ligue={ligue}
        ligueApercu={false}
        joueurs={[moi, ...AMIS.slice(0, nbAmis)]}
        monId="moi"
        monPortrait=""
        onlineFriendIds={['ami-rayan']}
        friends={[]}
        pendingRequests={[]}
        myFriendCode="AB12CD"
        squadName={null}
        canRenameSquad={false}
        referral={referralSummary(0, 0)}
        squadIds={[]}
        maintenantIso={maintenant.toISOString()}
      />
    </div>
  )
}
