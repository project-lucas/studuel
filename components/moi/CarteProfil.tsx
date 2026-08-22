'use client'

import Link from 'next/link'
import { useState, useTransition, type ReactNode } from 'react'
import { Check, GraduationCap, Pencil, School, Settings } from 'lucide-react'
import AvatarRender from '@/components/avatar/AvatarRender'
import ProfileBannerArt from '@/components/defi/ProfileBannerArt'
import ProfileEditor from '@/components/defi/ProfileEditor'
import BadgeGallery from '@/components/defi/BadgeGallery'
import RankBadge, { type BadgeRank } from '@/components/defi/RankBadge'
import { setEquippedBadges } from '@/app/defi/profile-actions'
import { MAX_EQUIPPED, type BadgeState } from '@/lib/badges'
import type { AvatarConfig } from '@/lib/avatar'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'

// -----------------------------------------------------------------------------
// LA CARTE DE JOUEUR — le nouveau haut de l'onglet Moi.
//
// CE QU'ELLE REMPLACE, ET POURQUOI. `PanneauIdentite` posait un avatar, un
// prénom, un « rang de travail » numéroté et trois preuves chiffrées. Deux
// défauts, et le second était grave :
//
//   1. Elle affichait « Assidu · niveau 5 » avec sa barre, à trois centimètres
//      du bandeau du haut qui affiche « Niveau 6 · 93 % ». Deux nombres, deux
//      échelles sans rapport, le même mot. Le rang de travail garde ici son
//      TITRE — « Assidu » dit quelque chose — et perd son numéro : il n'y a plus
//      qu'un seul niveau dans l'app, celui du bandeau.
//
//   2. Le profil de JEU — bannière, badges, blason, école, pseudo — existait
//      déjà en entier, mais enfermé dans une modale de `/defi`. Une modale n'a
//      pas d'URL, pas de retour arrière, pas de partage : personne n'y va « pour
//      voir ». L'onglet dont l'icône est le visage de l'élève ne portait pas son
//      profil. Il le porte.
//
// LA BANNIÈRE EST LE FOND, PAS UNE VIGNETTE. C'est elle qui fait qu'une carte
// est la sienne : elle prend toute la largeur, l'avatar la chevauche, et le
// voile sombre en bas n'existe que pour que le pseudo reste lisible quelle que
// soit l'illustration.
//
// LE CRAYON N'OUVRE PAS UNE MODALE. Il déplie un panneau SOUS la carte
// (pseudo · bannière · badges). Même monde, même scroll, aucun piège de focus —
// et le vestiaire, lui, garde son écran plein : changer de visage n'est pas
// régler un profil.
//
// ELLE A DEUX ÉTAGES DEPUIS QU'ELLE A AVALÉ « MES CHIFFRES ». L'identité seule
// laissait la moitié droite de la carte vide — un grand aplat violet avec un
// visage dans un coin — pendant que six chiffres qui disent EXACTEMENT la même
// chose (qui est cet élève, ce qu'il a fait) vivaient deux blocs plus bas dans
// leur propre carte, sous leur propre titre. L'écran posait deux fois la même
// question à deux endroits.
//
// La carte prend donc la forme d'une carte à collectionner : le PORTRAIT en
// haut sur le violet, la PLAQUE DE STATISTIQUES en bas, blanche et encastrée
// (`chiffres`). Le pied de la carte est ce que l'élève montre — c'est là que
// vont les nombres, pas dans une carte de plus.
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

/** Les 3 badges mis en avant, posés sur la bannière. */
function BadgesEnAvant({ badges }: { badges: BadgeState[] }) {
  if (badges.length === 0) return null
  return (
    <ul role="list" className="flex items-center gap-1.5">
      {badges.map((b) => (
        <li
          key={b.id}
          title={b.title}
          aria-label={b.title}
          className="flex size-8 items-center justify-center rounded-xl bg-white/15 text-lg ring-1 ring-white/25 backdrop-blur-sm"
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
  couronnes = null,
  standing = null,
  chiffres = null,
}: {
  data: CarteProfilData
  /** Le titre d'assiduité (« Assidu »), SANS numéro — cf. en-tête du fichier. */
  workTitle: string
  /**
   * L'ÉTAGÈRE DES COURONNES (`components/moi/CouronnesRangee`), un emplacement
   * par matière. Passée en nœud pour la même raison que `chiffres` : elle n'a
   * aucun état, et l'importer ici l'aurait embarquée — avec les icônes de
   * matières — dans le paquet du navigateur pour rien.
   */
  couronnes?: ReactNode
  /** « Tu travailles plus que 96 % des 3e », rendu par le serveur. */
  standing?: ReactNode
  /**
   * LE PIED DE LA CARTE — « Mes chiffres », rendu par le serveur et passé ici
   * en nœud plutôt qu'importé : le bloc n'a besoin d'aucun état client, et le
   * faire traverser cette frontière l'aurait embarqué dans le paquet du
   * navigateur pour rien.
   */
  chiffres?: ReactNode
}) {
  const [editing, setEditing] = useState(false)
  const [banner, setBanner] = useState(data.profileBanner)
  const [equipped, setEquipped] = useState<string[]>(data.equippedBadgeIds)
  const [, startTransition] = useTransition()

  const earnedIds = new Set(data.badges.filter((b) => b.earned).map((b) => b.id))
  const enAvant = equipped
    .map((id) => data.badges.find((b) => b.id === id))
    .filter((b): b is BadgeState => b !== undefined)

  // Équiper/retirer un badge : maj optimiste (ordre conservé, ≤3), puis
  // persistance serveur qui re-nettoie contre les badges réellement acquis.
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
    <section
      aria-label="Ma carte de joueur"
      // Pleine largeur ET jusqu'au bord HAUT de l'écran. `-mt-16` annule
      // exactement le `pt-16` de <main> (la hauteur du bandeau flottant) :
      // la carte passe DERRIÈRE les pastilles du HUD au lieu de commencer
      // sous elles. C'est ce qui supprime la bande crème orpheline du haut —
      // 56 px de fond de page coincés entre le bord de l'écran et le violet,
      // qui faisaient lire le bandeau comme une barre d'appli posée sur rien.
      // Sur desktop le bandeau n'existe pas : `md:-mt-10` annule le `py-10`.
      className="relative -mx-4 -mt-16 md:-mx-8 md:-mt-10"
    >
      <div className="moi-carte overflow-hidden rounded-b-[2rem] md:rounded-b-[2.5rem]">
        {/* --- La bannière ------------------------------------------------- */}
        {/* Elle porte maintenant les 56 px du bandeau flottant EN PLUS de sa
            propre hauteur (128 px mobile, 144 px desktop où le bandeau n'existe
            pas) : l'illustration file jusqu'au bord de l'écran et les pastilles
            de niveau et de monnaies flottent DESSUS, comme sur l'arène. Rien
            n'est repoussé vers le bas — l'avatar et le pseudo restent à la même
            hauteur d'écran qu'avant. */}
        <div className="relative h-[11.5rem] sm:h-48 md:h-36">
          {/* `withGradient={false}` : LA BANNIÈRE NE PEINT PLUS DE FOND, elle ne
              peint qu'un visuel s'il en existe un. Son dégradé de repli était
              un second violet — bleuté — posé sur le violet magenta de la
              carte, et c'est cette superposition, pas un mauvais réglage, qui
              tirait une ligne en travers de l'écran. Aujourd'hui le repli, il
              est DANS la carte (`.moi-carte`), et il n'y en a qu'un.

              LES DEUX VOILES NOIRS SONT PARTIS AVEC. Ils n'existaient que pour
              détacher du texte d'une illustration ; sur un aplat qui est déjà
              la bonne couleur, ils ne faisaient qu'assombrir la zone de la
              bannière et donc RECRÉER la marche qu'on venait de supprimer. Le
              jour où des visuels de bannières existeront (public/banners/ est
              vide : aucun n'a jamais été généré), ils reviendront collés au
              visuel, pas au bloc. */}
          <ProfileBannerArt banner={banner} withGradient={false} />

          {/* Réglages et édition, dans l'angle. L'engrenage mène au compte —
              c'était jusqu'ici la seule porte de /compte, et elle vivait dans
              le bandeau du haut, loin de tout ce qu'elle règle. */}
          {/* Sous le bandeau flottant, pas dessous au sens du z-index : la
              bannière ayant grandi vers le haut, ces deux boutons doivent
              redescendre d'autant pour rester à la même hauteur d'écran et ne
              pas venir buter dans l'engrenage du HUD. */}
          <div className="absolute top-16 right-2 flex items-center gap-2 md:top-3">
            <button
              type="button"
              onClick={() => {
                sfx.tap()
                setEditing((v) => !v)
              }}
              aria-expanded={editing}
              aria-controls="moi-profil-edition"
              className="flex size-10 items-center justify-center rounded-full bg-black/35 text-white ring-1 ring-white/25 backdrop-blur-sm transition active:scale-90"
            >
              {editing ? (
                <Check className="size-5" strokeWidth={2.6} aria-hidden="true" />
              ) : (
                <Pencil className="size-4" strokeWidth={2.6} aria-hidden="true" />
              )}
              <span className="sr-only">
                {editing ? 'Terminer la personnalisation' : 'Personnaliser mon profil'}
              </span>
            </button>
            <Link
              href="/compte"
              onClick={() => sfx.tap()}
              className="flex size-10 items-center justify-center rounded-full bg-black/35 text-white ring-1 ring-white/25 backdrop-blur-sm transition active:scale-90"
            >
              <Settings className="size-5" strokeWidth={2.4} aria-hidden="true" />
              <span className="sr-only">Réglages du compte</span>
            </Link>
          </div>

          {/* Les badges mis en avant : sur la bannière, à gauche, là où on les
              cherche sur une carte de joueur. */}
          <div className="absolute bottom-2 left-3">
            <BadgesEnAvant badges={enAvant} />
          </div>
        </div>

        {/* --- L'identité, à cheval sur la bannière -------------------------- */}
        {/* Plus de fond à elle : le dégradé de `.moi-carte` traverse la carte
            entière, bannière comprise. Une bande qui repeint sa propre tranche
            de violet, c'est exactement ce qui fabriquait la couture. */}
        <div className="relative px-4 pb-4 md:px-8">
          <div className="-mt-11 flex items-end gap-3">
            {/* L'avatar mène au vestiaire — c'est le geste le plus visible de
                l'onglet, et il ne doit pas se confondre avec le crayon (qui
                règle le profil, pas le visage). */}
            <Link
              href="/moi/avatar"
              onClick={() => sfx.tap()}
              aria-label="Changer mon avatar"
              className="group relative block size-24 shrink-0 rounded-3xl bg-white/95 p-1 shadow-lg ring-2 ring-white/60 transition-transform active:scale-[0.97]"
            >
              <AvatarRender config={data.avatar} className="overflow-hidden rounded-[1.15rem]" />
              {/* Le niveau, dans l'angle : c'est CELUI du bandeau du haut, le
                  même nombre, la même échelle. */}
              <span className="absolute -right-1.5 -bottom-1.5 flex min-w-8 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[13px] leading-none font-extrabold text-primary-foreground shadow-md ring-2 ring-white tabular-nums">
                {data.level}
                <span className="sr-only"> — niveau</span>
              </span>
            </Link>

            <div className="min-w-0 flex-1 pb-0.5">
              <h1 className="font-heading truncate text-[22px] leading-tight font-extrabold text-white drop-shadow-sm">
                {data.displayName}
              </h1>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px] font-bold text-white/85">
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
              {/* Le titre d'assiduité : un mot, sans numéro et sans barre.
                  Il est monté en PASTILLE le jour où la carte est devenue une
                  vraie carte de joueur : posé à plat, un mot jaune sous deux
                  lignes blanches se lisait comme une quatrième ligne d'état
                  civil. Un titre se porte, il ne se déclare pas — et le jaune
                  est la couleur du gain dans la charte, il a droit à son
                  cartouche. */}
              <p className="mt-1.5">
                <span className="inline-flex items-center rounded-full bg-highlight/18 px-2 py-0.5 text-[10px] font-extrabold tracking-[0.08em] text-highlight uppercase ring-1 ring-highlight/35">
                  {workTitle}
                </span>
              </p>
            </div>

            {/* Le blason de rang : la mesure de l'arène, à sa place sur une
                carte de joueur. */}
            <div className="shrink-0 pb-2">
              <RankBadge rank={data.rank} size={54} />
            </div>
          </div>

          {standing ? <div className="mt-2.5">{standing}</div> : null}

          {/* L'ÉTAGÈRE DES COURONNES ferme le portrait. Une carte de joueur
              montre ce qu'on a gagné ; ici on montre en plus ce qui reste à
              gagner, parce que ce sont des trophées SCOLAIRES : la case vide
              d'une matière est une information que l'élève a le droit d'avoir
              sous les yeux. Le détail chiffré est replié DEDANS, derrière le ⋮
              au bout de la rangée — il n'y a plus de bloc « Mes couronnes »
              sous la carte. */}
          {couronnes ? <div className="mt-3">{couronnes}</div> : null}
        </div>

        {/* --- Le panneau d'édition, déplié sous la carte ------------------- */}
        {editing ? (
          <div
            id="moi-profil-edition"
            className="border-t border-white/15 px-4 py-4 md:px-8"
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

        {/* --- Le pied chiffré ---------------------------------------------- */}
        {/* Hors du padding de l'identité : la plaque touche les deux bords de
            la carte, et c'est ce débord qui la fait lire comme un ÉTAGE et non
            comme un encart posé dedans. Le `overflow-hidden` de la carte lui
            taille ses deux coins bas.

            EN DERNIER, même quand le panneau d'édition est déplié : c'est le
            PIED de la carte. Glissé au-dessus du panneau, il coupait la carte
            en violet / blanc / violet et le bas cessait d'être un bord. */}
        {chiffres}
      </div>
    </section>
  )
}
