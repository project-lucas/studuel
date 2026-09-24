import { notFound } from 'next/navigation'
import TopHud, { type AvatarHud } from '@/components/TopHud'
import ClasseChip from '@/components/reviser/ClasseChip'
import ProfileChip from '@/components/defi/ProfileChip'
import type { ProfileData } from '@/app/defi/profile-actions'
import { avatarDataUri, DEFAULT_AVATAR } from '@/lib/avatar'
import { portraitSrc } from '@/lib/portraits'

export const dynamic = 'force-dynamic'

// L'APERÇU DU BANDEAU DU HAUT — en développement seulement.
//
// Le bandeau d'un élève connecté, sans compte : l'avatar dans le disque et le
// multiplicateur d'XP contre la barre de niveau, dans plusieurs cas. Chaque bandeau est posé
// dans un cadre `transform` : son `position: fixed` s'y rattache, au lieu de
// se coller en haut de l'écran par-dessus celui du visiteur.
//
// En bas, la carte du joueur de l'arène (ProfileChip), qui porte le même
// multiplicateur d'XP sur le verre de nuit.
//
//   /dev/bandeau

const BLASON: AvatarHud = { src: portraitSrc('7'), visage: true }
const COMPOSE: AvatarHud = { src: avatarDataUri(DEFAULT_AVATAR, 72), visage: false }

/** Juste ce que lit la carte fermée ; la modale de profil n'est pas ouverte ici. */
const JOUEUR = {
  displayName: 'Sacha',
  avatar: DEFAULT_AVATAR,
  summary: { totalXp: 730 },
} as unknown as ProfileData

const CAS_ARENE: { titre: string; nbAmis: number; boost?: boolean }[] = [
  { titre: 'Arène : 3 amis (×1,3)', nbAmis: 3 },
  { titre: 'Arène : sans ami (×1,0)', nbAmis: 0 },
  { titre: 'Arène : potion d’XP, 3 amis (×2,6)', nbAmis: 3, boost: true },
]

const CAS: {
  titre: string
  avatar: AvatarHud | null
  nbAmis: number | null
  boost?: boolean
  /** La puce de classe que Réviser pose au bord droit du bandeau. */
  classe?: boolean
}[] = [
  { titre: 'Réviser : avec la puce de classe, 3 amis (×1,3)', avatar: BLASON, nbAmis: 3, classe: true },
  { titre: 'Réviser : potion d’XP, 10 amis (×4,0)', avatar: BLASON, nbAmis: 10, boost: true, classe: true },
  { titre: 'Blason, 3 amis (×1,3)', avatar: BLASON, nbAmis: 3 },
  { titre: 'Avatar composé, sans ami (×1,0)', avatar: COMPOSE, nbAmis: 0 },
  { titre: 'Blason, 10 amis (×2,0)', avatar: BLASON, nbAmis: 10 },
  { titre: 'Potion d’XP, 1 ami (×2,2)', avatar: BLASON, nbAmis: 1, boost: true },
  { titre: 'Sans avatar ni compte d’amis (repli)', avatar: null, nbAmis: null },
]

export default async function ApercuBandeauPage() {
  if (process.env.NODE_ENV === 'production') notFound()
  const maintenant = new Date()
  const dansUneHeure = new Date(maintenant.getTime() + 3600_000).toISOString()
  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 px-0 pt-20 pb-28">
      <h1 className="sr-only">Aperçu du bandeau</h1>
      {CAS.map((c) => (
        <section key={c.titre}>
          <p className="px-4 pb-1 text-xs font-bold text-muted-foreground">{c.titre}</p>
          <div className="relative h-14 [transform:translateZ(0)]">
            <TopHud
              gems={40}
              streak={3}
              level={7}
              levelTitle="Apprenti"
              progress={0.45}
              userLabel="Sacha"
              boostXpJusqua={c.boost ? dansUneHeure : null}
              avatar={c.avatar}
              nbAmis={c.nbAmis}
            />
            {c.classe ? (
              <div className="fixed top-0 right-3 z-50 flex h-14 items-center">
                <ClasseChip court current="Tle techno" />
              </div>
            ) : null}
          </div>
        </section>
      ))}
      <div className="flex flex-col gap-3 bg-[color:var(--carte-sombre-fond)] px-4 py-4">
        {CAS_ARENE.map((c) => (
          <section key={c.titre}>
            <p className="pb-1 text-xs font-bold text-white/70">{c.titre}</p>
            <ProfileChip
              data={JOUEUR}
              gems={40}
              streak={3}
              nbAmis={c.nbAmis}
              boostXpJusqua={c.boost ? dansUneHeure : null}
            />
          </section>
        ))}
      </div>
    </div>
  )
}
