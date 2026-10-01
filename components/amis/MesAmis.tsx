'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { Check, Crown, Pencil, Plus, Swords, UserPlus, UserRound, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import { FenetreAjouterAmi } from '@/components/FriendAddButton'
import PortraitJoueur from '@/components/amis/PortraitJoueur'
import CompteXp from '@/components/amis/ligue/CompteXp'
import CoffreLigne from '@/components/amis/ligue/CoffreLigne'
import { useDuelLaunch } from '@/components/amis/useDuelLaunch'
import { useFermeAuMasquage } from '@/components/useFermeAuMasquage'
import { renameSquad } from '@/app/amis/actions'
import {
  AMIS_MAX,
  LIBELLE_BONUS_AMI,
  classerAmis,
  echelon,
  libelleMultiplicateur,
  multiplicateurXp,
  placesAmis,
  type CoffrePret,
  type CoffreSemaine,
  type JoueurAmi,
} from '@/lib/ligue'
import type { AvatarAffiche } from '@/lib/avatar-affiche'
import { REFERRAL_GEM_REWARD, type ReferralSummary } from '@/lib/gems'
import { DUEL_XP_BONUS } from '@/lib/social'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'

// -----------------------------------------------------------------------------
// MES AMIS — LES DIX PLACES (maquette « A », validée par Lucas le 01/10/2026 :
// « le but est le coffre qui augmente en fonction du nombre d'amis, mais aussi
// que plus il ajoute ses amis, plus son multiplicateur global d'expérience
// augmente »). Le bloc se lit de haut en bas comme la mécanique elle-même :
//
//   1. le nom du groupe (renommé par le n°1 de la semaine) ;
//   2. LE MULTIPLICATEUR D'XP, en grand : « ×1,3 » — toute l'XP gagnée ;
//   3. LES DIX PLACES : un ami = une place = +0,1. Une place vide est un bouton
//      d'invitation — sans ami, le bloc ENTIER est l'invitation ;
//   4. « AJOUTER UN AMI » (+30 gemmes pour vous deux), le gros bouton ;
//   5. LE COFFRE D'ÉQUIPE, en ligne : sa barre en deux parts, moi et mes amis ;
//   6. mes amis, classés à l'XP de la semaine, blason de ligue et épée.
//
// Avant, le coffre était une plaque bleue qui prenait tout le bloc, le
// multiplicateur n'y figurait pas (il ne se lisait que dans le bandeau), et
// « Ajouter un ami » était un rond dans l'angle : rien ne disait POURQUOI
// inviter. Le bloc parle la langue de Réviser : une `.carte` blanche, des
// boutons `Button` violets, l'or pour ce qui se gagne.
//
// ⚠️ Le multiplicateur porte sur l'XP (migration 380). Les gemmes n'en
// profitent qu'indirectement, par les niveaux gagnés plus vite : le bloc dit
// donc « XP », jamais « gemmes ».
// -----------------------------------------------------------------------------

const NOM_PAR_DEFAUT = 'Mes amis'

/** Le bouton ⚔️ d'une ligne : défier cet ami sur le Défi du jour (+XP). */
function BoutonDefi({ id, nom, onBlocked }: { id: string; nom: string; onBlocked: () => void }) {
  const { launch, launching } = useDuelLaunch(onBlocked)
  return (
    <Button
      type="button"
      size="icon-sm"
      aria-label={`Défier ${nom} (+${DUEL_XP_BONUS} XP)`}
      disabled={launching}
      onClick={() => launch(id)}
    >
      {launching ? (
        <Check className="size-4" aria-hidden="true" />
      ) : (
        <Swords className="size-4" strokeWidth={2.6} aria-hidden="true" />
      )}
    </Button>
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

/**
 * LES DIX PLACES. Une place occupée montre l'ami et ce qu'il rapporte (+0,1) ;
 * une place vide est un bouton d'invitation — la première est mise en avant :
 * c'est la prochaine marche.
 */
function Places({
  amis,
  nbAmis,
  onInviter,
}: {
  amis: (JoueurAmi & { rang: number })[]
  /** Le nombre d'amis compté par le serveur (celui du multiplicateur). */
  nbAmis: number
  onInviter: () => void
}) {
  const { occupees, anonymes, libres } = placesAmis(amis, nbAmis)
  const bonus = (
    <span className="font-heading absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-highlight px-1.5 text-[10.5px] leading-[18px] font-extrabold whitespace-nowrap text-foreground ring-2 ring-card">
      {LIBELLE_BONUS_AMI}
    </span>
  )
  return (
    <ul
      aria-label={`Tes ${AMIS_MAX} places d’amis`}
      className="grid grid-cols-5 justify-items-center gap-x-1.5 gap-y-4"
    >
      {occupees.map((ami) => (
        <li key={ami.id} className="relative">
          <PortraitJoueur
            id={ami.id}
            portrait={ami.portrait}
            className="size-[54px] ring-[3px] ring-primary"
          />
          <span className="sr-only">{ami.nom}, </span>
          {bonus}
        </li>
      ))}
      {/* Un ami compté par le serveur dont la liste ne porte pas le portrait :
          sa place est prise quand même. */}
      {Array.from({ length: anonymes }, (_, i) => (
        <li key={`anonyme-${i}`} className="relative">
          <span className="grid size-[54px] place-items-center rounded-full bg-secondary text-primary ring-[3px] ring-primary">
            <UserRound className="size-6" strokeWidth={2.4} aria-hidden="true" />
          </span>
          <span className="sr-only">Un ami, </span>
          {bonus}
        </li>
      ))}
      {Array.from({ length: libres }, (_, i) => (
        <li key={`libre-${i}`}>
          <button
            type="button"
            onClick={() => {
              sfx.tap()
              onInviter()
            }}
            aria-haspopup="dialog"
            aria-label={`Place libre : ajouter un ami (${LIBELLE_BONUS_AMI})`}
            className={cn(
              'grid size-[54px] cursor-pointer place-items-center rounded-full border-[2.5px] border-dashed transition-transform active:scale-90',
              i === 0
                ? 'border-primary bg-secondary text-primary'
                : 'border-primary/30 text-primary/45',
            )}
          >
            <Plus className="size-5" strokeWidth={3} aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
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
  const [ajout, setAjout] = useState(false)
  useFermeAuMasquage(setAjout, false)

  const lignes = classerAmis(joueurs)
  const amis = lignes.filter((l) => !l.moi)
  const enLigne = new Set(onlineFriendIds)

  // Le nombre d'amis qui COMPTE est celui du serveur (le coffre) ; la liste
  // affichée peut en porter davantage ou, hors ligue, tenir lieu de compte.
  const nbAmis = Math.max(coffre.nbAmis, amis.length)
  // Le multiplicateur et les mots suivent ce COMPTE ; seule la liste classée
  // dépend des amis dont on a la ligne (`amis.length`).
  const aDesAmis = nbAmis > 0
  const { enPlus } = placesAmis(amis, nbAmis)
  const complet = nbAmis >= AMIS_MAX
  const multiplicateur = libelleMultiplicateur(multiplicateurXp(nbAmis, false))
  const sommet = libelleMultiplicateur(multiplicateurXp(AMIS_MAX, false))

  return (
    <section aria-label="Mes amis" className="carte flex flex-col gap-4 p-3.5 text-foreground">
      <NomDuGroupe squadName={squadName} canRename={canRenameSquad} />

      {/* LE MULTIPLICATEUR, en grand : c'est lui que les amis font monter. */}
      <div className="flex items-center gap-3.5">
        <p
          className={cn(
            'font-heading text-[54px] leading-[0.9] font-extrabold tracking-tight tabular-nums',
            aDesAmis ? 'text-primary' : 'text-primary/35',
          )}
        >
          <span className="sr-only">Ton multiplicateur d’XP : </span>
          {multiplicateur}
        </p>
        <div className="min-w-0">
          <p aria-hidden="true" className="font-heading text-base leading-tight font-extrabold">
            Ton multiplicateur d’XP
          </p>
          <p className="mt-0.5 text-xs leading-snug font-semibold text-muted-foreground">
            {complet
              ? 'Le maximum : toute l’XP que tu gagnes compte double.'
              : aDesAmis
                ? `Toute l’XP que tu gagnes est multipliée. Chaque ami ajoute ${LIBELLE_BONUS_AMI}.`
                : `Chaque ami ajoute ${LIBELLE_BONUS_AMI} à toute l’XP que tu gagnes, jusqu’à ${sommet}.`}
          </p>
        </div>
      </div>

      <Places amis={amis} nbAmis={nbAmis} onInviter={() => setAjout(true)} />

      <p className="-mb-1 text-center text-xs font-semibold text-muted-foreground">
        {complet ? (
          <>
            <strong className="font-extrabold text-foreground">
              {AMIS_MAX} amis sur {AMIS_MAX}
            </strong>
            {enPlus > 0
              ? ` · ${enPlus} de plus, qui remplissent aussi le coffre`
              : ' · tu es au sommet'}
          </>
        ) : (
          <>
            <strong className="font-extrabold text-foreground">
              {nbAmis} ami{nbAmis > 1 ? 's' : ''} sur {AMIS_MAX}
            </strong>
            {` · à ${AMIS_MAX} amis, tu passes à `}
            <strong className="font-extrabold text-foreground">{sommet}</strong>
          </>
        )}
      </p>

      <Button
        type="button"
        size="xl"
        onClick={() => setAjout(true)}
        aria-haspopup="dialog"
        className="w-full"
      >
        <UserPlus strokeWidth={2.8} aria-hidden="true" />
        {aDesAmis ? 'Ajouter un ami' : 'Ajouter mon premier ami'}
        <span className="font-heading ml-1 inline-flex items-center gap-0.5 rounded-full bg-highlight py-0.5 pr-1 pl-2 text-xs leading-none font-extrabold text-foreground">
          +{REFERRAL_GEM_REWARD}
          <CristalIcon className="-my-1 size-4" />
          <span className="sr-only"> gemmes chacun</span>
        </span>
      </Button>

      <CoffreLigne
        coffre={coffre}
        prets={coffresPrets}
        ouvrable={coffreOuvrable}
        finIso={finIso}
        maintenantIso={maintenantIso}
      />

      {amis.length > 0 ? (
        <ol aria-label="Mes amis, classés à l’XP de la semaine" className="flex flex-col gap-0.5">
          {lignes.map((l) => {
            const division = echelon(l.echelon)
            const connecte = !l.moi && enLigne.has(l.id)
            return (
              <li
                key={l.id}
                data-moi={l.moi || undefined}
                className={cn('flex items-center gap-2 rounded-2xl px-2 py-1.5', l.moi && 'bg-primary/10 ring-2 ring-primary/50')}
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

      <FenetreAjouterAmi
        open={ajout}
        onClose={() => setAjout(false)}
        myFriendCode={myFriendCode}
        referral={referral}
      />
    </section>
  )
}
