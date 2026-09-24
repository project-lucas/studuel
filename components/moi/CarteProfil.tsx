'use client'

import Link from 'next/link'
import { useEffect, useState, useTransition, type ReactNode } from 'react'
import { Check, GraduationCap, Pencil, School, Settings } from 'lucide-react'
import AvatarRender from '@/components/avatar/AvatarRender'
import CompteurVerre, { type CompteurCarte } from '@/components/moi/CompteurVerre'
import ProfileEditor from '@/components/defi/ProfileEditor'
import AtelierAvatarIa from '@/components/moi/AtelierAvatarIa'
import { useFermeAuMasquage } from '@/components/useFermeAuMasquage'
import BadgeGallery from '@/components/defi/BadgeGallery'
import type { BadgeRank } from '@/components/defi/RankBadge'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import { setEquippedBadges } from '@/app/defi/profile-actions'
import { MAX_EQUIPPED, type BadgeState } from '@/lib/badges'
import { avatarEstDessine, avatarPortraitSrc, type AvatarConfig } from '@/lib/avatar'
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
//   • QUATRE PASTILLES EN VERRE SUR UNE RANGÉE (série · travail · trophées ·
//     notes), puis LE CLASSEMENT en verre. Ils ont été trois pastilles ici ET
//     trois tuiles blanches dessous qui répétaient deux d'entre elles (« des
//     éléments en doublon », Lucas, 04/09/2026) : tout est monté dans la
//     carte, une fois — les chiffres d'abord (ses preuves), sa place ensuite.
//   • LES BADGES MIS EN AVANT sont collés au titre, dans l'identité : en pied
//     de carte, un badge seul flottait dans un coin.
//   • LE REFLET HOLOGRAPHIQUE balaie la carte UNE fois à l'ouverture, façon
//     carte à collectionner, et rejoue quand on la touche. C'est le seul effet
//     de l'écran — un seul objet le mérite, et il perd tout s'il est partagé.
//
// LE HAUT DE LA CARTE A CHANGÉ LE 16/09/2026 (Lucas : « l'avatar est petit,
// dans l'angle, comme s'il était caché ; descendre ce bloc pour laisser la
// place aux monnaies du jeu, en haut à droite »). Deux choses :
//
//   • UNE RANGÉE DE RESSOURCES d'abord — gemmes, engrenage — alignée à
//     droite, là où le bandeau les met sur les autres onglets. (Les pièces ont
//     disparu le 16/09/2026 : la monnaie n'existe plus pour le joueur.) Cet onglet n'a
//     pas de bandeau (lib/top-hud-routes), la carte reprend donc ce rôle : les
//     monnaies restent au même endroit d'un écran à l'autre.
//   • L'IDENTITÉ DESSOUS, avec L'AVATAR EN GRAND : le blason peint choisi à
//     l'onboarding (lib/portraits) fait 124 px, entier — c'est un écu, il a
//     déjà son cadre, on ne le remet pas dans un anneau. L'élève qui garde son
//     avatar composé (DiceBear) conserve l'anneau d'or, lui aussi agrandi. Le
//     niveau est posé au bas de l'avatar, centré, pour les deux.
//   • LE CRAYON de personnalisation quitte l'angle pour se coller au nom : il
//     règle le pseudo, la bannière et les badges — l'identité, pas le compte.
//
// LA CARTE A MAIGRI LE 17/09/2026 (Lucas : « on s'y perd »). Le classement
// en verre, sa foule et ses deux jauges la faisaient courir sur tout le
// premier écran : il est parti dans l'onglet Progrès, sous la carte
// (components/moi/OngletsMoi). Il reste ici QUI JE SUIS et MES QUATRE
// CHIFFRES ; l'avatar passe de 124 à 96 px pour que la barre des onglets
// apparaisse sans défiler.
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

/** La monnaie affichée en haut à droite de la carte. */
export type MonnaiesCarte = {
  gemmes: number
}

/** Les 3 badges mis en avant, dans l'identité. */
function BadgesEnAvant({ badges }: { badges: BadgeState[] }) {
  if (badges.length === 0) return null
  return (
    <ul role="list" className="flex items-center gap-1">
      {badges.map((b) => (
        <li
          key={b.id}
          title={b.title}
          aria-label={b.title}
          className="flex size-[26px] items-center justify-center rounded-lg bg-white/14 text-[13px] ring-1 ring-white/18"
        >
          <span aria-hidden="true">{b.icon}</span>
        </li>
      ))}
    </ul>
  )
}

/**
 * Une monnaie en verre : l'illustration (le cristal) et le solde. Le même
 * matériau que les compteurs dessous, en pastille horizontale. Elle mène au
 * Trésor, où la monnaie se gagne et se dépense — comme la bande du bandeau.
 */
function MonnaieVerre({
  icone,
  valeur,
  legende,
}: {
  icone: ReactNode
  valeur: number
  legende: string
}) {
  return (
    <Link
      href="/tresor"
      onClick={(e) => {
        e.stopPropagation()
        sfx.tap()
      }}
      aria-label={`${valeur.toLocaleString('fr-FR')} ${legende} — ouvrir le Trésor`}
      className="flex h-9 items-center gap-1.5 rounded-full border border-white/16 bg-white/12 pr-3 pl-1.5 backdrop-blur-[4px] transition active:scale-95"
    >
      {icone}
      <span className="font-heading text-[15px] leading-none font-extrabold tabular-nums">
        {valeur.toLocaleString('fr-FR')}
      </span>
    </Link>
  )
}

export default function CarteProfil({
  data,
  workTitle,
  compteurs,
  monnaies = null,
  tuileNotes = null,
  suite = null,
  soudee = false,
  abonne = false,
  boutonGauche = null,
}: {
  data: CarteProfilData
  /** Le titre d'assiduité (« Assidu »), sans numéro. */
  workTitle: string
  /** Les pastilles en verre : série, travail, trophées. */
  compteurs: CompteurCarte[]
  /** Les gemmes, en haut à droite. Null : la rangée ne porte que l'engrenage. */
  monnaies?: MonnaiesCarte | null
  /** La pastille des notes (cliente : elle ouvre la saisie), la quatrième. */
  tuileNotes?: ReactNode
  /**
   * Coins du bas carrés : la barre des onglets de Moi se soude dessous et
   * termine l'objet (components/moi/OngletsMoi).
   */
  soudee?: boolean
  /** Rendu sous la carte, dans la même section (l'écran continue). */
  suite?: ReactNode
  /** Studuel+ : Marcel dessine l'avatar (sinon, l'atelier montre ce qu'il ouvrirait). */
  abonne?: boolean
  /** À gauche de la rangée du haut, en face des gemmes : le bouton du rythme. */
  boutonGauche?: ReactNode
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
  // Le blason s'affiche ENTIER (un écu) ; un avatar dessiné par Marcel, comme
  // l'avatar composé, dans l'anneau d'or.
  const aPortrait = avatarPortraitSrc(data.avatar) !== null && !avatarEstDessine(data.avatar)
  // « MARCEL DESSINE TON AVATAR » s'ouvre au toucher de l'avatar.
  const [atelier, setAtelier] = useState(false)
  useFermeAuMasquage(setAtelier, false)

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
      {/* La carte prend LE HAUT DE L'ÉCRAN : l'onglet Moi n'a plus de bandeau
          (lib/top-hud-routes — la carte disait déjà tout ce qu'il affichait).
          Elle reste un objet posé sur la table, avec ses bords, pas une
          bannière qui file jusqu'au bord de l'écran. */}
      <div
        className={cn(
          'moi-carte relative overflow-hidden text-white',
          // Le rayon de LA carte (token) : le dégradé documenté reste le sien.
          soudee ? 'rounded-t-carte' : 'rounded-carte',
        )}
        onClick={() => setReflet((n) => n + 1)}
      >
        {/* Le reflet holographique. `key` relance l'animation à chaque toucher. */}
        {reflet > 0 ? <span key={reflet} className="moi-foil" aria-hidden="true" /> : null}

        <div className="relative px-4 pt-3 pb-4">
          {/* --- La rangée de ressources : le rythme à gauche, les monnaies à
              droite, l'engrenage au bout. */}
          <div className="flex items-center gap-1.5">
            {boutonGauche}
            <span className="flex-1" />
            {monnaies ? (
              <MonnaieVerre
                icone={<CristalIcon className="size-6" />}
                valeur={monnaies.gemmes}
                legende="gemmes"
              />
            ) : null}
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

          {/* --- L'identité, sous la rangée : l'avatar en grand ------------- */}
          <div className="mt-1 flex items-center gap-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                sfx.tap()
                setAtelier(true)
              }}
              aria-haspopup="dialog"
              aria-label="Changer mon avatar"
              className={cn(
                'relative block shrink-0 transition-transform active:scale-[0.96]',
                aPortrait ? 'w-[96px]' : 'size-[84px]',
              )}
            >
              {aPortrait ? (
                // Le blason, entier : c'est un écu, il porte déjà son cadre.
                <AvatarRender
                  config={data.avatar}
                  forme="blason"
                  className="w-full drop-shadow-[0_10px_16px_rgba(0,0,0,.45)]"
                />
              ) : (
                <>
                  {/* L'anneau d'or : le seul or de la carte, avec le niveau. */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-highlight shadow-[0_6px_16px_-6px_rgba(0,0,0,.5)]"
                  />
                  <span className="absolute inset-[3px] overflow-hidden rounded-full bg-white">
                    <AvatarRender config={data.avatar} className="size-full" />
                  </span>
                </>
              )}
              <span className="font-heading absolute -bottom-1.5 left-1/2 -translate-x-1/2 rounded-full bg-highlight px-2.5 py-0.5 text-[12.5px] leading-tight font-extrabold whitespace-nowrap text-[#6b4a00] shadow-md tabular-nums">
                Niv. {data.level}
                <span className="sr-only"> — niveau</span>
              </span>
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-2">
                <h1 className="font-heading min-w-0 flex-1 truncate text-[22px] leading-[1.1] font-extrabold tracking-[0.2px]">
                  {data.displayName}
                </h1>
                {/* Le crayon, collé au nom : il règle l'identité (pseudo,
                    bannière, badges), pas le compte. */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    sfx.tap()
                    setEditing((v) => !v)
                  }}
                  aria-expanded={editing}
                  aria-controls="moi-profil-edition"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/14 text-white ring-1 ring-white/20 transition active:scale-90"
                >
                  {editing ? (
                    <Check className="size-4" strokeWidth={2.8} aria-hidden="true" />
                  ) : (
                    <Pencil className="size-[14px]" strokeWidth={2.6} aria-hidden="true" />
                  )}
                  <span className="sr-only">
                    {editing ? 'Terminer la personnalisation' : 'Personnaliser mon profil'}
                  </span>
                </button>
              </div>
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
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/14 px-2.5 py-[3px] text-[10.5px] font-extrabold tracking-[0.06em] uppercase">
                  {workTitle}
                  <span aria-hidden="true" className="opacity-60">
                    ·
                  </span>
                  {/* « Bronze IV » : le libellé porte déjà sa division. */}
                  {data.rank.label}
                </span>
                {enAvant.length > 0 ? <BadgesEnAvant badges={enAvant} /> : null}
              </div>
            </div>
          </div>

          {/* PLUS DE BLASON D'ARÈNE dans l'angle : retiré à la demande de Lucas
              (04/09/2026). Le rang se lit déjà en toutes lettres dans la
              pastille (« Bronze IV ») et le trophée compte dans ses compteurs. */}

          {/* --- Les pastilles en verre, sur une rangée ---------------------- */}
          <div className="mt-4 grid grid-cols-4 gap-2">
            {compteurs.map((c) => (
              <CompteurVerre key={c.legende} {...c} />
            ))}
            {tuileNotes ? (
              <div className="min-w-0" onClick={(e) => e.stopPropagation()}>
                {tuileNotes}
              </div>
            ) : null}
          </div>
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
      <AtelierAvatarIa open={atelier} onClose={() => setAtelier(false)} abonne={abonne} />
    </section>
  )
}
