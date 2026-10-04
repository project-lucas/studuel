'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { Check, Pencil, Settings } from 'lucide-react'
import AvatarRender from '@/components/avatar/AvatarRender'
import ProfileEditor from '@/components/defi/ProfileEditor'
import AtelierAvatarIa from '@/components/moi/AtelierAvatarIa'
import { useFermeAuMasquage } from '@/components/useFermeAuMasquage'
import BadgeGallery from '@/components/defi/BadgeGallery'
import type { BadgeRank } from '@/components/defi/RankBadge'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import { setEquippedBadges } from '@/app/defi/profile-actions'
import { MAX_EQUIPPED, type BadgeState } from '@/lib/badges'
import BadgeIcone from '@/components/BadgeIcone'
import { avatarEstDessine, avatarPortraitSrc, type AvatarConfig } from '@/lib/avatar'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'

// -----------------------------------------------------------------------------
// QUI JE SUIS — la ligne d'identité en tête du tableau de bord de Moi.
//
// Refonte du 02/10/2026 (maquette « D », le tableau de bord). La carte de
// joueur — bannière, avatar à cheval, quatre pastilles en verre — prenait le
// premier écran pour dire quatre chiffres que les tuiles disent maintenant
// chacune à leur place. Il reste une LIGNE posée sur le mur : l'avatar et son
// niveau, le prénom, la classe et le rang, les gemmes et l'engrenage à droite
// (cet onglet n'a pas de bandeau, lib/top-hud-routes : les monnaies gardent
// leur place d'un écran à l'autre).
//
// CE QUI N'A PAS BOUGÉ : toucher l'avatar ouvre l'atelier (Marcel le dessine,
// le vestiaire à un tap), le crayon déplie le panneau de personnalisation
// (pseudo · bannière · badges) sous la ligne, l'engrenage mène au compte. La
// bannière se choisit toujours ici : elle coiffe la fiche de profil de l'arène.
// -----------------------------------------------------------------------------

export type IdentiteMoi = {
  displayName: string
  gamertag: string | null
  gradeLabel: string | null
  schoolName: string | null
  avatar: AvatarConfig
  profileBanner: string | null
  availableBanners: string[]
  rank: BadgeRank
  level: number
  badges: BadgeState[]
  equippedBadgeIds: string[]
}

export default function EnTeteMoi({
  data,
  gemmes,
  abonne = false,
  sansAvatar = false,
}: {
  data: IdentiteMoi
  gemmes: number
  /** Studuel+ : Marcel dessine l'avatar (sinon, l'atelier montre ce qu'il ouvrirait). */
  abonne?: boolean
  /** L'avatar vit dans la vitrine (VitrineMoi) : la ligne ne garde que le nom. */
  sansAvatar?: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [banner, setBanner] = useState(data.profileBanner)
  const [equipped, setEquipped] = useState<string[]>(data.equippedBadgeIds)
  const [, startTransition] = useTransition()
  const [atelier, setAtelier] = useState(false)
  useFermeAuMasquage(setAtelier, false)

  const earnedIds = new Set(data.badges.filter((b) => b.earned).map((b) => b.id))
  const enAvant = equipped
    .map((id) => data.badges.find((b) => b.id === id))
    .filter((b): b is BadgeState => b !== undefined)
  // Le blason s'affiche ENTIER (un écu, il porte déjà son cadre) ; un avatar
  // dessiné par Marcel, comme l'avatar composé, dans l'anneau d'or.
  const aPortrait = avatarPortraitSrc(data.avatar) !== null && !avatarEstDessine(data.avatar)
  // La classe et le rang d'abord : sur un téléphone, c'est l'école qui se tronque.
  const sousTitre = [data.gradeLabel, data.rank.label, data.schoolName].filter(Boolean).join(' · ')

  const toggleEquip = (id: string) => {
    if (!earnedIds.has(id)) return
    // Calculé HORS de la mise à jour d'état : une fonction de mise à jour est
    // rejouée par React (mode strict), le son et l'envoi partiraient deux fois.
    const next = equipped.includes(id)
      ? equipped.filter((x) => x !== id)
      : equipped.length >= MAX_EQUIPPED
        ? equipped
        : [...equipped, id]
    sfx.tap()
    setEquipped(next)
    startTransition(async () => {
      const r = await setEquippedBadges(next)
      if (r.ok && r.equipped) setEquipped(r.equipped)
    })
  }

  return (
    <section aria-label="Mon profil">
      <div className="flex items-center gap-3 px-1 pt-1 pb-3">
        {sansAvatar ? null : (
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setAtelier(true)
          }}
          aria-haspopup="dialog"
          aria-label={`Changer mon avatar — niveau ${data.level}`}
          className={cn(
            'relative block shrink-0 transition-transform active:scale-[0.96]',
            aPortrait ? 'w-[68px]' : 'size-[62px]',
          )}
        >
          {aPortrait ? (
            <AvatarRender
              config={data.avatar}
              forme="blason"
              className="w-full drop-shadow-[0_5px_8px_rgba(40,20,80,.26)]"
            />
          ) : (
            <>
              {/* L'anneau d'or : avec le niveau, le seul or de la ligne. */}
              <span aria-hidden="true" className="absolute inset-0 rounded-full bg-highlight ring-[3px] ring-card" />
              <span className="absolute inset-[3px] overflow-hidden rounded-full bg-card">
                <AvatarRender config={data.avatar} className="size-full" />
              </span>
            </>
          )}
          <span className="font-heading absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-highlight px-2 py-0.5 text-[12px] leading-tight font-extrabold whitespace-nowrap text-accent-foreground shadow-[0_0_0_2px_var(--card)] tabular-nums">
            Niv. {data.level}
          </span>
        </button>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {sansAvatar ? (
              <p className="min-w-0 truncate text-[13px] font-extrabold text-foreground/75">{sousTitre}</p>
            ) : (
              <h1 className="font-heading min-w-0 truncate text-[23px] leading-[1.1] font-extrabold">
                {data.displayName}
              </h1>
            )}
            {/* Le crayon, collé au nom : il règle l'identité (pseudo, bannière,
                badges), pas le compte. */}
            <button
              type="button"
              onClick={() => {
                sfx.tap()
                setEditing((v) => !v)
              }}
              aria-expanded={editing}
              aria-controls="moi-profil-edition"
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-card text-primary shadow-sm transition active:scale-90"
            >
              {editing ? (
                <Check className="size-3.5" strokeWidth={2.8} aria-hidden="true" />
              ) : (
                <Pencil className="size-3" strokeWidth={2.6} aria-hidden="true" />
              )}
              <span className="sr-only">
                {editing ? 'Terminer la personnalisation' : 'Personnaliser mon profil'}
              </span>
            </button>
          </div>
          {sousTitre && !sansAvatar ? (
            <p className="mt-0.5 truncate text-[12.5px] font-bold text-muted-foreground">{sousTitre}</p>
          ) : null}
          {!sansAvatar && enAvant.length > 0 ? (
            <ul role="list" className="mt-1 flex items-center gap-1">
              {enAvant.map((b) => (
                <li
                  key={b.id}
                  title={b.title}
                  aria-label={b.title}
                  className="flex size-[24px] items-center justify-center rounded-lg bg-card text-[12px] shadow-sm"
                >
                  <BadgeIcone slug={b.slug} icon={b.icon} tailleImage="size-[18px]" />
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <Link
            href="/tresor"
            onClick={() => sfx.tap()}
            aria-label={`${gemmes.toLocaleString('fr-FR')} gemmes — ouvrir la Boutique`}
            className="flex h-9 items-center gap-1.5 rounded-full bg-card pr-3 pl-1.5 text-foreground shadow-sm transition active:scale-95"
          >
            <CristalIcon className="size-6" />
            <span className="font-heading text-[15px] leading-none font-extrabold tabular-nums">
              {gemmes.toLocaleString('fr-FR').replace(/\u202f/g, '\u00a0')}
            </span>
          </Link>
          <Link
            href="/compte"
            onClick={() => sfx.tap()}
            className="flex size-9 items-center justify-center rounded-full bg-card text-primary shadow-sm transition active:scale-90"
          >
            <Settings className="size-[18px]" strokeWidth={2.4} aria-hidden="true" />
            <span className="sr-only">Réglages du compte</span>
          </Link>
        </div>
      </div>

      {/* --- Le panneau de personnalisation, déplié sous la ligne ------------- */}
      {editing ? (
        <div id="moi-profil-edition" className="carte-sombre relative mb-3 p-4 text-white">
          <ProfileEditor
            gamertag={data.gamertag}
            currentBanner={banner}
            availableBanners={data.availableBanners}
            onBannerChange={setBanner}
          />
          <div className="mt-4">
            <BadgeGallery badges={data.badges} equippedIds={equipped} editing onToggle={toggleEquip} />
          </div>
          <Link
            href="/moi/avatar"
            onClick={() => sfx.tap()}
            className={cn(
              'mt-4 flex items-center justify-center gap-2 rounded-2xl bg-white/12 px-4 py-3',
              'text-sm font-extrabold text-white ring-1 ring-white/20 transition active:scale-[0.98]',
            )}
          >
            <Pencil className="size-4" aria-hidden="true" />
            Changer mon avatar au vestiaire
          </Link>
        </div>
      ) : null}

      {sansAvatar ? null : <AtelierAvatarIa open={atelier} onClose={() => setAtelier(false)} abonne={abonne} />}
    </section>
  )
}
