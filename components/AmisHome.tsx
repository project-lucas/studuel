'use client'

import { useCallback, useEffect, useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Check, UserPlus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SquadSection from '@/components/SquadSection'
import FriendStories from '@/components/amis/FriendStories'
import RivalCard from '@/components/amis/RivalCard'
import MesAmis from '@/components/amis/MesAmis'
import PortraitJoueur from '@/components/amis/PortraitJoueur'
import LigueSemaine from '@/components/amis/ligue/LigueSemaine'
import PopupInviterAmis from '@/components/amis/ligue/PopupInviterAmis'
import BilanSemaine from '@/components/amis/ligue/BilanSemaine'
import { useFermeAuMasquage } from '@/components/useFermeAuMasquage'
import {
  amiDevant,
  bilanLigueEnAttente,
  calculerCoffre,
  classerAmis,
  coffrePretEnAttente,
  doitProposerInvitation,
  ecouterBilanLigue,
  ecouterCoffrePret,
  type EtatLigue,
  type CoffreSemaine,
  type JoueurAmi,
} from '@/lib/ligue'
import type { ReferralSummary } from '@/lib/gems'
import type { Friend, PendingRequest } from '@/lib/social'
import type { AvatarAffiche } from '@/lib/avatar-affiche'
import { acceptFriend, removeFriend } from '@/app/amis/actions'
import { sfx } from '@/lib/sounds'

// -----------------------------------------------------------------------------
// L'ONGLET AMIS — la LIGUE DE LA SEMAINE au centre, façon Duolingo (Lucas,
// 24/09/2026). De haut en bas :
//
//   1. les demandes d'ami reçues (quelqu'un attend quelque chose de toi) ;
//   2. LA LIGUE : le rail des rangs, « Ligue Bronze 4 », la règle, le compte
//      à rebours, et les 30 joueurs classés à l'XP de la semaine ;
//   3. MES AMIS, un seul bloc : le COFFRE D'ÉQUIPE (toute l'XP de la semaine,
//      la mienne et celle de mes amis ; cinq niveaux ; il s'ouvre lundi), mes
//      amis classés à l'XP de la semaine, l'espace « Ajouter un ami » ;
//   4. le rival juste devant, puis les amis en ce moment (stories) ;
//   5. le groupe privé. (Le coffre du clan de l'école a quitté l'onglet le
//      24/09/2026 : le « coffre d'équipe » est désormais celui des amis. Il
//      reste sur le Défi.)
//
// Deux écrans s'ouvrent d'eux-mêmes : la FIN DE SEMAINE (BilanSemaine) quand
// la semaine passée vient d'être close — elle passe toujours d'abord —, puis,
// une fois par semaine, la fenêtre « Fais équipe avec tes amis » tant que le
// bonus n'est pas plein.
//
// Les trophées ne jouent plus ici : ils restent au duel classé de l'arène.
// -----------------------------------------------------------------------------

/** La semaine où la fenêtre d'invitation s'est ouverte d'elle-même. */
const CLE_INVITATION = 'studuel-invitation-semaine'
/** Le temps de voir l'onglet avant que la fenêtre ne s'ouvre. */
const DELAI_INVITATION_MS = 1200

function lireStockage(cle: string): string | null {
  try {
    return localStorage.getItem(cle)
  } catch {
    return null
  }
}

function ecrireStockage(cle: string, valeur: string): void {
  try {
    localStorage.setItem(cle, valeur)
  } catch {
    // stockage indisponible : la fenêtre pourra revenir, sans gravité
  }
}

// ------------------------------------------------------------- Demandes reçues
// Une demande d'ami à accepter ou refuser. Optimiste : la ligne se fige sur son
// issue dès l'action réussie, sans attendre le rechargement de la page.
function PendingRow({ request }: { request: PendingRequest }) {
  const [pending, start] = useTransition()
  const [done, setDone] = useState<'accepted' | 'refused' | null>(null)

  if (done === 'refused') return null

  if (done === 'accepted') {
    return (
      <li className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-foreground/10">
        <PortraitJoueur id={request.id} portrait={request.portrait} className="size-9" />
        <span className="min-w-0 flex-1 truncate text-sm font-semibold">{request.name}</span>
        <span className="flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">
          <Check className="size-3.5" /> Ami ajouté
        </span>
      </li>
    )
  }

  return (
    <li className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-foreground/10">
      <PortraitJoueur id={request.id} portrait={request.portrait} className="size-9" />
      <span className="min-w-0 flex-1 truncate text-sm font-semibold">
        {request.name}
        <span className="block text-xs font-normal text-muted-foreground">veut être ton ami</span>
      </span>
      <Button
        size="sm"
        className="rounded-full"
        disabled={pending}
        onClick={() => {
          start(async () => {
            const res = await acceptFriend(request.id)
            if (res.ok) setDone('accepted')
          })
        }}
      >
        Accepter
      </Button>
      <button
        type="button"
        aria-label={`Refuser la demande de ${request.name}`}
        disabled={pending}
        className="flex size-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
        onClick={() => {
          sfx.tap()
          start(async () => {
            const res = await removeFriend(request.id)
            if (res.ok) setDone('refused')
          })
        }}
      >
        <X className="size-4" />
      </button>
    </li>
  )
}

function DemandesRecues({ demandes }: { demandes: PendingRequest[] }) {
  if (demandes.length === 0) return null
  return (
    <section aria-labelledby="demandes-titre">
      <div className="mb-2 flex items-center justify-between">
        <h2 id="demandes-titre" className="titre-section flex items-center gap-2">
          <UserPlus className="size-4 text-primary" strokeWidth={2.4} aria-hidden="true" />
          Demandes reçues
        </h2>
        <span className="rounded-full bg-highlight px-2.5 py-0.5 font-mono text-xs font-bold text-foreground tabular-nums">
          {demandes.length}
        </span>
      </div>
      <ul className="flex flex-col gap-2">
        {demandes.map((r) => (
          <PendingRow key={r.id} request={r} />
        ))}
      </ul>
    </section>
  )
}

// ------------------------------------------------------------------------- Page
export default function AmisHome({
  connecte,
  inviterAuto = true,
  ligue,
  ligueApercu,
  joueurs,
  monId,
  monPortrait,
  monAvatar = null,
  onlineFriendIds,
  friends,
  pendingRequests,
  myFriendCode,
  squadName,
  canRenameSquad,
  referral,
  squadIds,
  maintenantIso,
}: {
  connecte: boolean
  /** La fenêtre d'invitation peut s'ouvrir d'elle-même (faux : page d'aperçu). */
  inviterAuto?: boolean
  /** La ligue de la semaine (migration 376) ; null = pas encore ouverte. */
  ligue: EtatLigue | null
  /** Ligue d'exemple (visiteur) : signalée « Aperçu ». */
  ligueApercu: boolean
  /** Moi et mes amis, à l'XP de la semaine. */
  joueurs: JoueurAmi[]
  monId: string
  monPortrait: string
  /** Mon avatar tel que l'onglet Moi le montre (null : visiteur). */
  monAvatar?: AvatarAffiche | null
  // Amis actuellement en session (RPC friends_live) : point vert.
  onlineFriendIds: string[]
  friends: Friend[]
  pendingRequests: PendingRequest[]
  myFriendCode: string
  // Nom du groupe d'amis (« squad », migration 176) et droit de le renommer.
  squadName: string | null
  canRenameSquad: boolean
  // Parrainage (migration 183) : où en sont mes invitations.
  referral: ReferralSummary
  // Composition du groupe privé (migration 183), sous-ensemble des relations.
  squadIds: string[]
  // Clan hebdo (migration 204) — null tant que la migration n'est pas passée.
  maintenantIso: string
}) {
  const router = useRouter()
  const [duelNotice, setDuelNotice] = useState(false)
  const [invitation, setInvitation] = useState(false)
  useFermeAuMasquage(setInvitation, false)
  const fermerInvitation = useCallback(() => setInvitation(false), [])

  // La fin de semaine se joue UNE fois : on retient la semaine rejouée.
  const [bilanJoue, setBilanJoue] = useState<string | null>(null)
  const bilan = connecte && !ligueApercu && ligue?.bilan && ligue.bilan.semaine !== bilanJoue ? ligue.bilan : null
  const semaineDuBilan = ligue?.bilan?.semaine ?? null
  const finirBilan = useCallback(() => {
    if (semaineDuBilan) setBilanJoue(semaineDuBilan)
  }, [semaineDuBilan])

  // UN BILAN EST ARRIVÉ PENDANT QUE L'ONGLET ÉTAIT GARDÉ (le réveil de la
  // ligue l'a annoncé, la pastille de l'onglet s'est allumée) : l'onglet a été
  // construit avant la clôture, il se relit — une fois PAR SEMAINE : l'onglet
  // peut rester monté des semaines, un simple booléen ne se réarmerait jamais.
  // Même chose quand un COFFRE D'ÉQUIPE devient prêt à ouvrir (379) : il
  // arrive d'ordinaire avec le bilan, mais un élève sans groupe de ligue a un
  // coffre sans bilan.
  const reluPour = useRef<string | null>(null)
  useEffect(() => {
    if (!connecte || !ligue || ligue.bilan) return
    const semaine = ligue.semaine
    const relire = () => {
      if (reluPour.current === semaine) return
      reluPour.current = semaine
      router.refresh()
    }
    const coffreDejaLa = ligue.coffresPrets.length > 0
    if (bilanLigueEnAttente() || (!coffreDejaLa && coffrePretEnAttente())) relire()
    const arreterBilan = ecouterBilanLigue((enAttente) => {
      if (enAttente) relire()
    })
    const arreterCoffre = ecouterCoffrePret((pret) => {
      if (pret && !coffreDejaLa) relire()
    })
    return () => {
      arreterBilan()
      arreterCoffre()
    }
  }, [connecte, ligue, router])

  // « FAIS ÉQUIPE AVEC TES AMIS » s'ouvre d'elle-même une fois par semaine.
  // L'effet ne tourne que lorsque l'onglet est VISIBLE : un onglet gardé
  // caché (<Activity>) a ses effets suspendus.
  useEffect(() => {
    if (!inviterAuto || !connecte || ligueApercu || !ligue || !myFriendCode) return
    const proposer = doitProposerInvitation({
      nbAmis: ligue.nbAmis,
      bilanEnAttente: bilan !== null,
      semaine: ligue.semaine,
      derniereSemaineVue: lireStockage(CLE_INVITATION),
    })
    if (!proposer) return
    const id = window.setTimeout(() => {
      ecrireStockage(CLE_INVITATION, ligue.semaine)
      setInvitation(true)
    }, DELAI_INVITATION_MS)
    return () => window.clearTimeout(id)
  }, [inviterAuto, connecte, ligueApercu, ligue, myFriendCode, bilan])

  const onlineIds = new Set(onlineFriendIds)
  const lignesAmis = classerAmis(joueurs)
  const moi = lignesAmis.find((l) => l.moi)
  const rival = amiDevant(lignesAmis)
  // Le coffre du serveur (379) ; à défaut, la même règle recalculée ici
  // depuis la ligue (376) — montré, pas encore ouvrable.
  const coffre: CoffreSemaine = ligue?.coffre ?? {
    xpMoi: ligue?.xpSemaine ?? 0,
    nbAmis: ligue?.nbAmis ?? friends.length,
    ...calculerCoffre(ligue?.xpSemaine ?? 0, ligue?.amis.map((a) => a.xp) ?? friends.map(() => 0)),
  }

  return (
    <div className="flex flex-col gap-6">
      <DemandesRecues demandes={pendingRequests} />

      <LigueSemaine etat={ligue} apercu={ligueApercu} maintenantIso={maintenantIso} monAvatar={monAvatar} />

      {/* Le visiteur voit une ligue d'exemple : on lui dit comment avoir la sienne. */}
      {!connecte ? (
        <div className="carte flex flex-col items-center gap-3 p-4 text-center">
          <p className="text-sm font-semibold text-muted-foreground text-balance">
            Crée ton compte&nbsp;: dès ta première XP, tu entres dans ta ligue de 30 joueurs.
          </p>
          <Button asChild size="lg" className="w-full">
            <Link href="/bienvenue">Commencer</Link>
          </Button>
        </div>
      ) : null}

      {/* MES AMIS, UN SEUL BLOC : le coffre d'équipe, mes amis classés, et
          l'espace « Ajouter un ami » (+30 gemmes). */}
      {connecte ? (
        <MesAmis
          joueurs={joueurs}
          coffre={coffre}
          coffresPrets={ligue?.coffresPrets ?? []}
          coffreOuvrable={ligue?.coffre != null}
          finIso={ligue?.fin ?? null}
          maintenantIso={maintenantIso}
          onlineFriendIds={onlineFriendIds}
          myFriendCode={myFriendCode}
          squadName={squadName}
          canRenameSquad={canRenameSquad}
          referral={referral}
          monAvatar={monAvatar}
        />
      ) : null}

      {rival && moi ? (
        <RivalCard
          rival={{ id: rival.id, nom: rival.nom, portrait: rival.portrait }}
          ecartXp={rival.xp - moi.xp}
          onDuelBlocked={() => setDuelNotice(true)}
        />
      ) : null}

      {duelNotice ? (
        <p role="status" className="-mt-3 rounded-2xl bg-muted/60 p-2.5 text-xs font-medium text-foreground/80">
          Ton défi du jour est déjà lancé — une seule mission par jour, reviens demain ⚔️
        </p>
      ) : null}

      {friends.length > 0 ? (
        <FriendStories
          friends={friends}
          onlineIds={onlineIds}
          myFriendCode={myFriendCode}
          onDuelBlocked={() => setDuelNotice(true)}
        />
      ) : null}

      {connecte ? <SquadSection friends={friends} squadIds={squadIds} squadName={squadName} /> : null}

      <PopupInviterAmis
        // Jamais par-dessus la fin de semaine : elle passe d'abord.
        open={invitation && bilan === null}
        onClose={fermerInvitation}
        nbAmis={ligue?.nbAmis ?? friends.length}
        myFriendCode={myFriendCode}
        monId={monId}
        monPortrait={monPortrait}
        monAvatar={monAvatar}
      />
      {bilan ? <BilanSemaine key={bilan.semaine} bilan={bilan} onFini={finirBilan} /> : null}
    </div>
  )
}
