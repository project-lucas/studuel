'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { Check, Crown, Pencil, Swords, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import FriendAddButton from '@/components/FriendAddButton'
import PortraitJoueur from '@/components/amis/PortraitJoueur'
import CompteXp from '@/components/amis/ligue/CompteXp'
import CoffreEquipe from '@/components/amis/ligue/CoffreEquipe'
import { useDuelLaunch } from '@/components/amis/useDuelLaunch'
import { renameSquad } from '@/app/amis/actions'
import { classerAmis, echelon, type CoffrePret, type CoffreSemaine, type JoueurAmi } from '@/lib/ligue'
import type { AvatarAffiche } from '@/lib/avatar-affiche'
import type { ReferralSummary } from '@/lib/gems'
import { DUEL_XP_BONUS } from '@/lib/social'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import plaques from '@/components/amis/PlaquesAmis.module.css'

// -----------------------------------------------------------------------------
// MES AMIS — UN SEUL BLOC (Lucas, 24/09/2026 : « assemble les deux blocs et
// condense le tout pour rendre clair cette mécanique »). La carte du bonus
// d'amis et le classement des amis n'en font plus qu'une, qui se lit de haut
// en bas comme la mécanique elle-même :
//
//   1. le nom du groupe (renommé par le n°1 de la semaine) ;
//   2. LE COFFRE D'ÉQUIPE — l'XP de mes amis et la mienne, ses cinq niveaux ;
//   3. mes amis, classés à l'XP de la semaine, blason de ligue et épée ;
//   4. « AJOUTER UN AMI » (+30 gemmes pour vous deux), compacté dans l'angle
//      haut-droit, sur la ligne du titre (Lucas, 24/09/2026).
//
// Coffre, lignes et « Ajouter un ami » sont des PLAQUES façon Clash Royale
// (cerne, épaisseur, chiffres cernés) : components/amis/PlaquesAmis.module.css.
// -----------------------------------------------------------------------------

const NOM_PAR_DEFAUT = 'Mes amis'

/** Le bouton ⚔️ d'une ligne : défier cet ami sur le Défi du jour (+XP). */
function BoutonDefi({ id, nom, onBlocked }: { id: string; nom: string; onBlocked: () => void }) {
  const { launch, launching } = useDuelLaunch(onBlocked)
  return (
    <button
      type="button"
      aria-label={`Défier ${nom} (+${DUEL_XP_BONUS} XP)`}
      disabled={launching}
      onClick={() => launch(id)}
      className={cn('grid size-9 shrink-0 cursor-pointer place-items-center text-primary-foreground disabled:opacity-60', plaques.defi)}
    >
      {launching ? (
        <Check className="size-4" aria-hidden="true" />
      ) : (
        <Swords className="size-4" strokeWidth={2.6} aria-hidden="true" />
      )}
    </button>
  )
}

/** Le nom du groupe d'amis, renommable par le n°1 de la semaine. */
function NomDuGroupe({ squadName, canRename }: { squadName: string | null; canRename: boolean }) {
  // Le nom renommé ICI, valable tant que le serveur rend le nom d'avant :
  // l'onglet reste monté, un nom venu d'ailleurs doit l'emporter.
  const [renomme, setRenomme] = useState<{ avant: string | null; nom: string | null } | null>(null)
  const name = renomme && renomme.avant === squadName ? renomme.nom : squadName
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(squadName ?? '')
  const [pending, start] = useTransition()

  const submit = () => {
    if (pending) return
    start(async () => {
      const res = await renameSquad(draft)
      if (res.ok) {
        setRenomme({ avant: squadName, nom: res.name })
        setEditing(false)
      }
    })
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={40}
          autoFocus
          aria-label="Nom du groupe"
          placeholder="Nom de ton groupe d’amis…"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sfx.tap()
              submit()
            }
            if (e.key === 'Escape') setEditing(false)
          }}
          className="font-heading min-h-10 min-w-0 flex-1 rounded-full border border-primary/40 bg-white px-4 text-base font-extrabold text-foreground"
        />
        <Button type="button" size="icon" onClick={submit} disabled={pending} aria-label="Valider le nom" className="shrink-0">
          <Check className="size-5" strokeWidth={2.6} aria-hidden="true" />
        </Button>
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setDraft(name ?? '')
            setEditing(false)
          }}
          aria-label="Annuler"
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted active:scale-90"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-w-0 items-center gap-1">
      <h2 className="titre-section truncate">{name ?? NOM_PAR_DEFAUT}</h2>
      {canRename ? (
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setDraft(name ?? '')
            setEditing(true)
          }}
          aria-label="Renommer le groupe"
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/10 active:scale-90"
        >
          <Pencil className="size-3.5" strokeWidth={2.4} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  )
}

export default function MesAmis({
  joueurs,
  coffre,
  coffresPrets,
  coffreOuvrable,
  finIso,
  maintenantIso,
  onlineFriendIds,
  myFriendCode,
  squadName,
  canRenameSquad,
  referral,
  monAvatar = null,
}: {
  /** Moi et mes amis, avec l'XP de la semaine et l'échelon de ligue. */
  joueurs: JoueurAmi[]
  coffre: CoffreSemaine
  coffresPrets: CoffrePret[]
  /** La migration 379 est là : le coffre s'ouvre. */
  coffreOuvrable: boolean
  /** Fin de la semaine (ISO) : l'ouverture du coffre. */
  finIso: string | null
  maintenantIso: string
  onlineFriendIds: string[]
  myFriendCode: string
  squadName: string | null
  canRenameSquad: boolean
  referral: ReferralSummary
  monAvatar?: AvatarAffiche | null
}) {
  const [duelNotice, setDuelNotice] = useState(false)
  const lignes = classerAmis(joueurs)
  const aDesAmis = lignes.some((l) => !l.moi)
  const enLigne = new Set(onlineFriendIds)

  return (
    <section aria-label="Mes amis" className="carte flex flex-col gap-4 p-3 text-foreground">
      {/* Le titre du groupe, et « Ajouter un ami » dans l'angle. */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <NomDuGroupe squadName={squadName} canRename={canRenameSquad} />
        </div>
        <FriendAddButton variant="coin" myFriendCode={myFriendCode} referral={referral} />
      </div>

      <CoffreEquipe
        coffre={coffre}
        prets={coffresPrets}
        ouvrable={coffreOuvrable}
        finIso={finIso}
        maintenantIso={maintenantIso}
      />

      {aDesAmis ? (
        <ol aria-label="Mes amis, classés à l’XP de la semaine" className="flex flex-col gap-2">
          {lignes.map((l) => {
            const division = echelon(l.echelon)
            const connecte = !l.moi && enLigne.has(l.id)
            return (
              <li
                key={l.id}
                data-moi={l.moi || undefined}
                className={cn('flex items-center gap-2 p-2', plaques.ligneAmi)}
              >
                <span className="font-heading w-4 shrink-0 text-center text-sm font-extrabold text-muted-foreground tabular-nums">
                  {l.rang}
                </span>
                <span className="relative shrink-0">
                  <PortraitJoueur
                    id={l.id}
                    portrait={l.portrait}
                    avatar={l.moi ? monAvatar : null}
                    className="size-10 ring-1 ring-foreground/10"
                  />
                  {connecte ? (
                    <span
                      role="img"
                      aria-label="En ligne"
                      className="absolute -right-1 -bottom-1 flex size-3.5 items-center justify-center rounded-full border-2 border-card bg-success"
                    >
                      <span className="absolute size-full animate-ping rounded-full bg-success/70" />
                    </span>
                  ) : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={cn('flex items-center gap-1 truncate text-sm', l.moi ? 'font-extrabold' : 'font-semibold')}>
                    {l.moi ? 'Toi' : l.nom}
                    {l.rang === 1 && l.xp > 0 ? (
                      <Crown className="inline size-3.5 shrink-0 text-highlight" aria-hidden="true" />
                    ) : null}
                  </span>
                  <span className="mt-0.5 flex min-w-0 items-center gap-1 text-xs font-semibold text-primary">
                    <Image
                      src={division.rang.image}
                      alt=""
                      aria-hidden="true"
                      width={48}
                      height={48}
                      className="size-[20px] shrink-0 select-none object-contain"
                    />
                    <span className="truncate">{division.nom}</span>
                  </span>
                </span>
                <CompteXp xp={l.xp} accent={l.moi} />
                {l.moi ? null : <BoutonDefi id={l.id} nom={l.nom} onBlocked={() => setDuelNotice(true)} />}
              </li>
            )
          })}
        </ol>
      ) : null}
      {duelNotice ? (
        <p role="status" className="rounded-2xl bg-muted/60 p-2.5 text-xs font-medium text-foreground/80">
          Ton défi du jour est déjà lancé — une seule mission par jour, reviens demain ⚔️
        </p>
      ) : null}

    </section>
  )
}
