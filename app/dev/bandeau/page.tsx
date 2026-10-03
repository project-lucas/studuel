import { notFound } from 'next/navigation'
import TopHud, { type AvatarHud } from '@/components/TopHud'
import { avatarDataUri, DEFAULT_AVATAR } from '@/lib/avatar'
import { portraitSrc } from '@/lib/portraits'
import { SemeurQuetes } from '../quetes/ApercuQuetes'

export const dynamic = 'force-dynamic'

// L'APERÇU DU BANDEAU DU HAUT — en développement seulement.
//
// Le bandeau d'un élève connecté, sans compte : l'avatar dans le disque et le
// multiplicateur d'XP contre la barre de niveau, dans plusieurs cas. Chaque bandeau est posé
// dans un cadre `transform` : son `position: fixed` s'y rattache, au lieu de
// se coller en haut de l'écran par-dessus celui du visiteur.
//
//   /dev/bandeau   (avec la pastille des quêtes du jour, semée par SemeurQuetes)

const BLASON: AvatarHud = { src: portraitSrc('7'), visage: true }
const COMPOSE: AvatarHud = { src: avatarDataUri(DEFAULT_AVATAR, 72), visage: false }

const CAS: {
  titre: string
  avatar: AvatarHud | null
  nbAmis: number | null
  boost?: boolean
  /** Solde de gemmes (défaut 40) : le cas réel le plus long, 1 000 015. */
  gems?: number
}[] = [
  { titre: '1 000 015 gemmes, 3 amis (×1,3)', avatar: BLASON, nbAmis: 3, gems: 1_000_015 },
  { titre: 'Potion d’XP, 10 amis (×4,0)', avatar: BLASON, nbAmis: 10, boost: true },
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
      <SemeurQuetes />
      {CAS.map((c) => (
        <section key={c.titre}>
          <p className="px-4 pb-1 text-xs font-bold text-muted-foreground">{c.titre}</p>
          <div className="relative h-14 [transform:translateZ(0)]">
            <TopHud
              gems={c.gems ?? 40}
              streak={3}
              level={7}
              levelTitle="Apprenti"
              progress={0.45}
              xp={{ actuel: 2440, plancher: 2100, prochain: 2800 }}
              userLabel="Sacha"
              boostXpJusqua={c.boost ? dansUneHeure : null}
              avatar={c.avatar}
              nbAmis={c.nbAmis}
            />
          </div>
        </section>
      ))}
    </div>
  )
}
