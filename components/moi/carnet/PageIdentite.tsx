'use client'

import Link from 'next/link'
import AvatarRender from '@/components/avatar/AvatarRender'
import BadgeIcone from '@/components/BadgeIcone'
import RankBadge, { type BadgeRank } from '@/components/defi/RankBadge'
import AvatarRang from '@/components/AvatarRang'
import { Souligne, Eclats } from '@/components/moi/carnet/Croquis'
import { avatarPortraitSrc, type AvatarConfig } from '@/lib/avatar'
import { MAX_EQUIPPED, type BadgeState } from '@/lib/badges'
import { divisionDepuisRomain } from '@/lib/rang-visuel'
import { sfx } from '@/lib/sounds'
import styles from '@/components/moi/carnet/Pages.module.css'

// -----------------------------------------------------------------------------
// LA PAGE DE GARDE, À GAUCHE — la photo et le nom (04/10/2026, revue le
// 05/10/2026).
//
// LA PHOTO EST DANS L'ANNEAU DE SON RANG (16/10/2026, Lucas : « le cadre ici
// dans le profil est toujours moche, il faut que le cadre de la barre de
// niveau et celui dans l'onglet profil soient similaires ») : le même anneau
// que le bandeau du haut (components/AvatarRang) — le métal dit le rang de
// ligue, la plaque la division. Il remplace le polaroid et les cadres de
// niveau (lib/moi/cadre-profil, qui ne servent plus ici).
// La toucher ouvre le VESTIAIRE (/moi/avatar : portrait, badges, personnages) ;
// le crayon et la feuille « Personnaliser » sont partis (Lucas : « c'est en
// cliquant sur la photo de l'avatar que l'on peut modifier l'avatar »).
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

export default function PageIdentite({ data }: { data: IdentiteMoi; abonne: boolean }) {
  const portrait = avatarPortraitSrc(data.avatar)
  const ligne = [data.gradeLabel, data.rank.label].filter(Boolean).join(' · ')
  const enAvant = data.equippedBadgeIds
    .map((id) => data.badges.find((b) => b.id === id && b.earned))
    .filter((b): b is BadgeState => b !== undefined)
    .slice(0, MAX_EQUIPPED)
  const division = divisionDepuisRomain(data.rank.roman)

  const photo = portrait ? (
    // eslint-disable-next-line @next/next/no-img-element -- portrait servi tel quel, déjà au bon poids
    <img src={portrait} alt="" draggable={false} />
  ) : (
    <AvatarRender config={data.avatar} className="size-full" />
  )

  return (
    <div className={styles.identite}>
      <Link
        href="/moi/avatar"
        onClick={() => sfx.tap()}
        aria-label={`Changer mon avatar — rang ${data.rank.label}`}
        className={styles.photoCadree}
      >
        <AvatarRang photo={photo} rang={{ id: data.rank.tier.id, division }} className="w-full" />
      </Link>

      <h1 className={styles.nom}>{data.displayName}</h1>
      <Souligne className={styles.souligneNom} />

      {ligne ? <p className={styles.surligne}>{ligne}</p> : null}

      {/* Les badges mis en avant (choisis au vestiaire), collés comme des autocollants. */}
      {enAvant.length > 0 ? (
        <ul className={styles.enAvant} aria-label="Mes badges mis en avant">
          {enAvant.map((b, i) => (
            <li key={b.id} title={b.title} className={styles.autocollantPetit} style={{ rotate: `${(i - 1) * 7}deg` }}>
              <BadgeIcone slug={b.slug} icon={b.icon} tailleImage="size-full" />
            </li>
          ))}
        </ul>
      ) : null}

      <div className={styles.rang}>
        <Eclats className={styles.eclatsRangGauche} />
        <RankBadge rank={data.rank} size={64} className={styles.blason} />
        <Eclats className={styles.eclatsRangDroite} sens="droite" />
      </div>
    </div>
  )
}
