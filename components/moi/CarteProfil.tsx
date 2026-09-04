'use client'

import Link from 'next/link'
import { useEffect, useState, useTransition, type ReactNode } from 'react'
import { Check, GraduationCap, Pencil, School, Settings } from 'lucide-react'
import AvatarRender from '@/components/avatar/AvatarRender'
import ProfileEditor from '@/components/defi/ProfileEditor'
import BadgeGallery from '@/components/defi/BadgeGallery'
import RankBadge, { type BadgeRank } from '@/components/defi/RankBadge'
import { setEquippedBadges } from '@/app/defi/profile-actions'
import { MAX_EQUIPPED, type BadgeState } from '@/lib/badges'
import type { AvatarConfig } from '@/lib/avatar'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'

// -----------------------------------------------------------------------------
// LA CARTE DE JOUEUR — un OBJET, plus un bandeau.
//
// Refonte du 03/09/2026 (Lucas : « les blocs sont bas de gamme »). La carte
// d'avant était un aplat violet avec un visage dans un coin, une plaque blanche
// de six chiffres en pied, et une étagère de couronnes entre les deux : trois
// matières collées, aucune ne pesait. Celle-ci n'a qu'une matière — le violet
// profond — et une seule chose qui brille.
//
//   • LE VIOLET EST RADIAL : une source de lumière en haut à gauche, un halo
//     doré en haut à droite, le fond qui s'assombrit vers le bas. C'est ce qui
//     fait lire un objet et non un fond (`.moi-carte`).
//   • L'AVATAR PORTE UN ANNEAU D'OR, et son niveau dans l'angle — celui du
//     bandeau du haut, même nombre, même échelle.
//   • TROIS COMPTEURS EN VERRE (série · temps · trophées) : ce que l'élève
//     montre. Les autres chiffres vivent dans les tuiles sous la carte.
//   • LE REFLET HOLOGRAPHIQUE balaie la carte UNE fois à l'ouverture, façon
//     carte à collectionner, et rejoue quand on la touche. C'est le seul effet
//     de l'écran — un seul objet le mérite, et il perd tout s'il est partagé.
//
// CE QUI N'A PAS BOUGÉ : le crayon déplie le panneau de personnalisation SOUS
// la carte (pseudo · bannière · badges), l'engrenage mène au compte, l'avatar
// au vestiaire. Le classement et les couronnes ont quitté la carte pour leurs
// propres blocs, où ils ont la place de compter.
// -----------------------------------------------------------------------------

export type CarteProfilData = {
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

export type CompteurCarte = {
  valeur: string
  legende: string
}

/** Les 3 badges mis en avant, en pied de carte. */
function BadgesEnAvant({ badges }: { badges: BadgeState[] }) {
  if (badges.length === 0) return null
  return (
    <ul role="list" className="flex items-center gap-2">
      {badges.map((b) => (
        <li
          key={b.id}
          title={b.title}
          aria-label={b.title}
          className="flex size-[34px] items-center justify-center rounded-xl bg-white/14 text-base ring-1 ring-white/18"
        >
          <span aria-hidden="true">{b.icon}</span>
        </li>
      ))}
    </ul>
  )
}

export default function CarteProfil({
  data,
  workTitle,
  compteurs,
  suite = null,
}: {
  data: CarteProfilData
  /** Le titre d'assiduité (« Assidu »), sans numéro. */
  workTitle: string
  /** Les trois compteurs en verre : série, temps, trophées. */
  compteurs: [CompteurCarte, CompteurCarte, CompteurCarte]
  /** Rendu sous la carte, dans la même section (l'écran continue). */
  suite?: ReactNode
}) {
  const [editing, setEditing] = useState(false)
  const [banner, setBanner] = useState(data.profileBanner)
  const [equipped, setEquipped] = useState<string[]>(data.equippedBadgeIds)
  const [, startTransition] = useTransition()
  // Le reflet : joué au montage, rejoué au toucher. Le compteur force une
  // nouvelle animation à chaque toucher (la classe seule ne rejouerait pas).
  const [reflet, setReflet] = useState(0)
  useEffect(() => {
    const id = window.setTimeout(() => setReflet(1), 250)
    return () => window.clearTimeout(id)
  }, [])

  const earnedIds = new Set(data.badges.filter((b) => b.earned).map((b) => b.id))
  const enAvant = equipped
    .map((id) => data.badges.find((b) => b.id === id))
    .filter((b): b is BadgeState => b !== undefined)

  const toggleEquip = (id: string) => {
    if (!earnedIds.has(id)) return
    setEquipped((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length >= MAX_EQUIPPED
          ? prev
          : [...prev, id]
      sfx.tap()
      startTransition(async () => {
        const r = await setEquippedBadges(next)
        if (r.ok && r.equipped) setEquipped(r.equipped)
      })
      return next
    })
  }

  return (
    <section aria-label="Ma carte de joueur" className="relative">
      {/* La carte commence SOUS le bandeau flottant du haut (pt-16 de <main>),
          comme un objet posé sur la table — plus de bannière qui file jusqu'au
          bord de l'écran : un objet a des bords. */}
      <div
        className="moi-carte relative overflow-hidden rounded-3xl text-white"
        onClick={() => setReflet((n) => n + 1)}
      >
        {/* Le reflet holographique. `key` relance l'animation à chaque toucher. */}
        {reflet > 0 ? <span key={reflet} className="moi-foil" aria-hidden="true" /> : null}

        <div className="relative px-4 pt-4 pb-4">
          {/* Réglages et personnalisation, dans l'angle. */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                sfx.tap()
                setEditing((v) => !v)
              }}
              aria-expanded={editing}
              aria-controls="moi-profil-edition"
              className="flex size-9 items-center justify-center rounded-full bg-white/14 text-white ring-1 ring-white/20 transition active:scale-90"
            >
              {editing ? (
                <Check className="size-[18px]" strokeWidth={2.6} aria-hidden="true" />
              ) : (
                <Pencil className="size-4" strokeWidth={2.6} aria-hidden="true" />
              )}
              <span className="sr-only">
                {editing ? 'Terminer la personnalisation' : 'Personnaliser mon profil'}
              </span>
            </button>
            <Link
              href="/compte"
              onClick={(e) => {
                e.stopPropagation()
                sfx.tap()
              }}
              className="flex size-9 items-center justify-center rounded-full bg-white/14 text-white ring-1 ring-white/20 transition active:scale-90"
            >
              <Settings className="size-[18px]" strokeWidth={2.4} aria-hidden="true" />
              <span className="sr-only">Réglages du compte</span>
            </Link>
          </div>

          {/* --- L'identité --------------------------------------------------- */}
          <div className="flex items-center gap-3.5 pr-20">
            <Link
              href="/moi/avatar"
              onClick={(e) => {
                e.stopPropagation()
                sfx.tap()
              }}
              aria-label="Changer mon avatar"
              className="relative block size-[72px] shrink-0 transition-transform active:scale-[0.96]"
            >
              {/* L'anneau d'or : le seul or de la carte, avec le niveau. */}
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-highlight shadow-[0_6px_16px_-6px_rgba(0,0,0,.5)]"
              />
              <span className="absolute inset-[3px] overflow-hidden rounded-full bg-white">
                <AvatarRender config={data.avatar} className="size-full" />
              </span>
              <span className="font-heading absolute -right-1 -bottom-1 rounded-full bg-highlight px-2 py-0.5 text-[12px] leading-tight font-extrabold text-[#6b4a00] shadow-md tabular-nums">
                Niv. {data.level}
                <span className="sr-only"> — niveau</span>
              </span>
            </Link>

            <div className="min-w-0 flex-1">
              <h1 className="font-heading truncate text-[24px] leading-[1.1] font-extrabold tracking-[0.2px]">
                {data.displayName}
              </h1>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] font-bold text-white/85">
                {data.gradeLabel ? (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="size-3.5" aria-hidden="true" />
                    {data.gradeLabel}
                  </span>
                ) : null}
                {data.schoolName ? (
                  <span className="flex min-w-0 items-center gap-1">
                    <School className="size-3.5 shrink-0" aria-hidden="true" />
                    <span className="truncate">{data.schoolName}</span>
                  </span>
                ) : null}
              </p>
              <p className="mt-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/14 px-2.5 py-[3px] text-[10.5px] font-extrabold tracking-[0.06em] uppercase">
                  {workTitle}
                  <span aria-hidden="true" className="opacity-60">
                    ·
                  </span>
                  {/* « Bronze IV » : le libellé porte déjà sa division. */}
                  {data.rank.label}
                </span>
              </p>
            </div>
          </div>

          {/* Le blason de l'arène, en bas à droite de l'identité. */}
          <div className="absolute top-[68px] right-3">
            <RankBadge rank={data.rank} size={46} hideDivision />
          </div>

          {/* --- Les trois compteurs en verre --------------------------------- */}
          <dl className="mt-4 grid grid-cols-3 gap-2">
            {compteurs.map((c) => (
              <div
                key={c.legende}
                className="rounded-2xl border border-white/16 bg-white/12 px-2 py-2 text-center backdrop-blur-[4px]"
              >
                <dd className="font-heading text-[19px] leading-none font-extrabold tabular-nums">
                  {c.valeur}
                </dd>
                <dt className="mt-1 text-[10px] font-bold tracking-[0.05em] text-white/80 uppercase">
                  {c.legende}
                </dt>
              </div>
            ))}
          </dl>

          {enAvant.length > 0 ? (
            <div className="mt-3">
              <BadgesEnAvant badges={enAvant} />
            </div>
          ) : null}
        </div>

        {/* --- Le panneau de personnalisation, déplié sous la carte ---------- */}
        {editing ? (
          <div
            id="moi-profil-edition"
            onClick={(e) => e.stopPropagation()}
            className="relative border-t border-white/15 px-4 py-4"
          >
            <ProfileEditor
              gamertag={data.gamertag}
              currentBanner={banner}
              availableBanners={data.availableBanners}
              onBannerChange={setBanner}
            />
            <div className="mt-4">
              <BadgeGallery
                badges={data.badges}
                equippedIds={equipped}
                editing
                onToggle={toggleEquip}
              />
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
      </div>
      {suite}
    </section>
  )
}
