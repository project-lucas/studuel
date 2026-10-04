'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { Pencil } from 'lucide-react'
import AvatarRender from '@/components/avatar/AvatarRender'
import BadgeIcone from '@/components/BadgeIcone'
import AtelierAvatarIa from '@/components/moi/AtelierAvatarIa'
import BadgeGallery from '@/components/defi/BadgeGallery'
import ProfileEditor from '@/components/defi/ProfileEditor'
import RankBadge, { type BadgeRank } from '@/components/defi/RankBadge'
import Feuille from '@/components/boutique/Feuille'
import { useFermeAuMasquage } from '@/components/useFermeAuMasquage'
import { Eclats, Souligne } from '@/components/moi/carnet/Croquis'
import { setEquippedBadges } from '@/app/defi/profile-actions'
import { avatarPortraitSrc, type AvatarConfig } from '@/lib/avatar'
import { MAX_EQUIPPED, type BadgeState } from '@/lib/badges'
import { sfx } from '@/lib/sounds'
import styles from '@/components/moi/carnet/Pages.module.css'

// -----------------------------------------------------------------------------
// LA PAGE DE GARDE, À GAUCHE — la photo et le nom (04/10/2026).
//
// La photo est un POLAROID scotché (l'avatar de l'élève) : la toucher ouvre
// l'atelier, où Marcel dessine l'avatar (le vestiaire est à un tap). Le nom est
// écrit à la main, souligné ; le crayon à côté ouvre la personnalisation —
// pseudo, bannière, badges mis en avant — dans une feuille. Dessous, la
// classe et le rang, puis le blason du rang.
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

export default function PageIdentite({ data, abonne }: { data: IdentiteMoi; abonne: boolean }) {
  const [atelier, setAtelier] = useState(false)
  const [edition, setEdition] = useState(false)
  const [banner, setBanner] = useState(data.profileBanner)
  const [equipped, setEquipped] = useState<string[]>(data.equippedBadgeIds)
  const [, startTransition] = useTransition()
  useFermeAuMasquage(setAtelier, false)
  useFermeAuMasquage(setEdition, false)

  const portrait = avatarPortraitSrc(data.avatar)
  const earnedIds = new Set(data.badges.filter((b) => b.earned).map((b) => b.id))
  const ligne = [data.gradeLabel, data.rank.label].filter(Boolean).join(' · ')
  const enAvant = equipped
    .map((id) => data.badges.find((b) => b.id === id))
    .filter((b): b is BadgeState => b !== undefined)
    .slice(0, MAX_EQUIPPED)

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
    <div className={styles.identite}>
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setAtelier(true)
        }}
        aria-haspopup="dialog"
        aria-label="Changer mon avatar"
        className={styles.polaroid}
      >
        <Eclats className={styles.eclatsPolaroid} />
        <span className={styles.photo}>
          {portrait ? (
            // eslint-disable-next-line @next/next/no-img-element -- portrait servi tel quel, déjà au bon poids
            <img src={portrait} alt="" draggable={false} />
          ) : (
            <AvatarRender config={data.avatar} className="size-full" />
          )}
        </span>
        <span aria-hidden="true" className={styles.scotchHaut} />
        <span aria-hidden="true" className={styles.scotchBas} />
      </button>

      <div className={styles.nomLigne}>
        <h1 className={styles.nom}>{data.displayName}</h1>
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setEdition(true)
          }}
          aria-haspopup="dialog"
          className={styles.crayon}
        >
          <Pencil aria-hidden="true" strokeWidth={2.6} />
          <span className="sr-only">Personnaliser mon profil</span>
        </button>
      </div>
      <Souligne className={styles.souligneNom} />

      {ligne ? <p className={styles.surligne}>{ligne}</p> : null}

      {/* Les badges mis en avant, collés comme des autocollants. */}
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

      <AtelierAvatarIa open={atelier} onClose={() => setAtelier(false)} abonne={abonne} />
      <Feuille open={edition} onClose={() => setEdition(false)} label="Personnaliser mon profil">
        <div className="carte-sombre relative mt-8 p-4 text-white">
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
            className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-white/12 px-4 py-3 text-sm font-extrabold text-white ring-1 ring-white/20 transition active:scale-[0.98]"
          >
            <Pencil className="size-4" aria-hidden="true" />
            Changer mon avatar au vestiaire
          </Link>
        </div>
      </Feuille>
    </div>
  )
}
