'use client'

import { useState } from 'react'
import ProfileModal from '@/components/defi/ProfileModal'
import BadgeBoostXp, { useBoostEnCours } from '@/components/BadgeBoostXp'
import AvatarRender from '@/components/avatar/AvatarRender'
import FlammeAnimee from '@/components/FlammeAnimee'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import { walletLevelInfo } from '@/lib/wallet'
import { libelleMultiplicateur, multiplicateurXp } from '@/lib/ligue'
import type { ProfileData } from '@/app/defi/profile-actions'
import { sfx } from '@/lib/sounds'

/**
 * LA CARTE DU JOUEUR du HUD, dans l'angle haut-gauche de l'arène : qui je
 * suis, où j'en suis, ce que j'ai. Un tap ouvre la modale de profil (stats,
 * badges, bannières).
 *
 * REFONTE DU 17/09/2026 (Lucas : « assemble ces trois blocs en un seul bloc
 * placé en haut à gauche »). Le haut de l'arène portait TROIS objets de verre :
 * la plaque d'identité (blason, nom, rang, jauge de rang), la bande de saison
 * dessous, et la bande de ressources (série, cristaux) contre le bord droit.
 * Ils se fondent en UNE carte :
 *
 *   • en tête : l'AVATAR de l'élève (le vrai, celui du vestiaire — plus le
 *     blason de rang, qui vit dans la barre de trophées), son NOM, et à droite
 *     la série et les cristaux ;
 *   • dessous : la BARRE DE NIVEAU (jaune, la couleur de l'XP dans toute
 *     l'app), le niveau en disque violet à sa gauche.
 *
 * LA BARRE DE TROPHÉES A QUITTÉ LA CARTE (22/09/2026). Elle disait le rang et
 * « 30/500 » ; le compte de trophées de l'arène (CompteTropheesArene), posé
 * juste sous la carte comme le « 🏆 7503 » de Clash Royale, dit le total en
 * or et le rang — la même nouvelle n'a pas à se lire deux fois à quinze
 * pixels d'écart, et la carte ne dit plus que QUI je suis et où en est mon
 * niveau.
 *
 * La bande de saison est partie (« inutile »). Le bandeau du haut (TopHud) se
 * masque sur /defi : c'est cette carte qui porte série et cristaux, et les
 * cibles `data-hud-cible` du vol des récompenses (cf. lib/gains) avec eux.
 */
export default function ProfileChip({
  data,
  gems,
  streak,
  boostXpJusqua = null,
  nbAmis = null,
}: {
  data: ProfileData
  /** Solde de cristaux ; `null` = inconnu (rien d'affiché). */
  gems: number | null
  /** Série en jours ; `null` = inconnue (rien d'affiché), zéro = flamme éteinte. */
  streak: number | null
  /** Fin du Boost XP du Marché qui court (ISO) : « ×2 XP » contre le niveau. */
  boostXpJusqua?: string | null
  /**
   * Amis acceptés : le multiplicateur d'XP (+0,1 par ami, migration 380), posé
   * contre la barre de niveau comme dans le bandeau. null : inconnu, rien
   * d'affiché.
   */
  nbAmis?: number | null
}) {
  const [open, setOpen] = useState(false)
  const potion = useBoostEnCours(boostXpJusqua)
  const info = walletLevelInfo(data.summary.totalXp)
  const xpLabel = `${info.currentXp.toLocaleString('fr-FR')} / ${info.nextAt.toLocaleString('fr-FR')} XP`
  const xpPct = Math.round(info.progress * 100)

  return (
    <>
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOpen(true)
        }}
        aria-haspopup="dialog"
        aria-label={`${data.displayName} — niveau ${info.level}, ${xpLabel}${
          streak !== null ? ` — série : ${streak} jour${streak > 1 ? 's' : ''}` : ''
        }${gems !== null ? ` — ${gems} cristaux` : ''}${
          nbAmis !== null ? ` — multiplicateur d’XP ${libelleMultiplicateur(multiplicateurXp(nbAmis, potion))}` : ''
        }. Voir mes stats et badges`}
        className="olympe-glass olympe-glass--sculpte olympe-press flex w-[14.5rem] cursor-pointer flex-col gap-1.5 rounded-[18px] p-2 text-left focus-visible:ring-4 focus-visible:ring-highlight/60 focus-visible:outline-none"
      >
        {/* --- La tête : avatar, nom, puis la série et les cristaux --------- */}
        <span className="flex items-center gap-2">
          <span className="relative shrink-0">
            <span className="relative block size-10 overflow-hidden rounded-full bg-black/30 ring-2 ring-highlight/70 shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
              <AvatarRender config={data.avatar} className="size-full" />
            </span>
            {/* LE BOOST XP QUI COURT, en étiquette au pied de l'avatar, comme
                dans le bandeau : contre la barre, avec le badge du bonus
                d'amis, il ne laissait à la jauge que 5 px. */}
            <BadgeBoostXp
              jusqua={boostXpJusqua}
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1 text-[8px] whitespace-nowrap"
            />
          </span>
          <span className="font-heading min-w-0 flex-1 truncate text-[0.86rem] leading-tight font-extrabold text-[#faf6ef]">
            {data.displayName}
          </span>
          <span className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
            {streak !== null ? (
              <span className="flex items-center gap-0.5">
                <FlammeAnimee className="size-6" eteinte={streak === 0} />
                <span
                  className={`font-mono text-[0.78rem] font-extrabold tabular-nums ${
                    streak > 0 ? 'text-highlight' : 'text-white/55'
                  }`}
                >
                  {streak}
                </span>
              </span>
            ) : null}
            {gems !== null ? (
              <span
                className="flex items-center gap-0.5"
                data-hud-cible="gemme"
              >
                <CristalIcon className="size-5" />
                <span className="font-mono text-[0.78rem] font-extrabold text-[#d8c9ff] tabular-nums">
                  {gems}
                </span>
              </span>
            ) : null}
          </span>
        </span>

        {/* --- La barre de niveau : disque violet, jauge jaune (l'XP) ------ */}
        <span className="flex items-center gap-1.5" data-hud-cible="xp">
          <span
            className="font-heading grid size-[18px] shrink-0 place-items-center rounded-full bg-primary text-[10px] leading-none font-extrabold text-primary-foreground ring-1 ring-highlight/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
            aria-hidden="true"
          >
            {info.level}
          </span>
          <span
            className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-black/40 ring-1 ring-white/15 ring-inset"
            role="progressbar"
            aria-label={`Niveau ${info.level} — ${xpLabel}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={xpPct}
          >
            <span
              className="block h-full rounded-full bg-gradient-to-r from-highlight to-accent shadow-[0_0_6px_color-mix(in_oklch,var(--highlight),transparent_45%)] transition-[width] duration-500"
              style={{ width: `${xpPct}%` }}
            />
          </span>
          <span
            className="font-heading shrink-0 text-[0.62rem] leading-none font-extrabold text-[#faf6ef] tabular-nums"
            aria-hidden="true"
          >
            {info.currentXp.toLocaleString('fr-FR')}
            <span className="text-white/55">/{info.nextAt.toLocaleString('fr-FR')}</span>
          </span>
          {/* LE MULTIPLICATEUR D'XP, contre la barre qu'il remplit (Lucas,
              24/09/2026) : le même « ×1,3 » que dans le bandeau des autres
              onglets, doré quand la potion d'XP court. */}
          {nbAmis !== null ? (
            <span
              aria-hidden="true"
              className={`font-heading shrink-0 rounded-full px-1.5 py-0.5 text-[0.68rem] leading-none font-extrabold tabular-nums ${
                potion ? 'bg-highlight text-foreground' : 'bg-white/15 text-[#faf6ef]'
              }`}
            >
              {libelleMultiplicateur(multiplicateurXp(nbAmis, potion))}
            </span>
          ) : null}
        </span>
      </button>

      {open ? <ProfileModal data={data} onClose={() => setOpen(false)} /> : null}
    </>
  )
}
