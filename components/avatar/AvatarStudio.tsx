'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Check, Lock, Pencil, Sparkles } from 'lucide-react'
import { applyFreeAvatarField, type AvatarConfig, type FreeAvatarFieldKey } from '@/lib/avatar'
import type { BadgeState } from '@/lib/badges'
import { MAX_EQUIPPED } from '@/lib/badges'
import {
  LIBELLE_RARETE,
  NIVEAU_RARETE,
  PERSONNAGES_HISTORIQUES,
  imagePersonnage,
  personnageDebloque,
  personnageDuPortrait,
  portraitDePersonnage,
  type RaretePersonnage,
} from '@/lib/personnages-historiques'
import { choisirPersonnageAction, setAvatarFieldAction } from '@/app/moi/avatar/actions'
import { setEquippedBadges, updateGamertag } from '@/app/defi/profile-actions'
import AvatarRender from '@/components/avatar/AvatarRender'
import ItemGrid from '@/components/avatar/ItemGrid'
import AtelierAvatarIa from '@/components/moi/AtelierAvatarIa'
import BadgeIcone from '@/components/BadgeIcone'
import AvatarRang from '@/components/AvatarRang'
import type { BadgeRank } from '@/components/defi/RankBadge'
import { divisionDepuisRomain } from '@/lib/rang-visuel'
import { useTablist } from '@/components/useTablist'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'

// -----------------------------------------------------------------------------
// LE VESTIAIRE (revu le 05/10/2026). En haut, la photo dans son cadre gagné
// (lib/moi/cadre-profil), le nom et le pseudo qui se change d'un toucher. En
// bas, trois onglets :
//   · PORTRAIT — les treize avatars libres ;
//   · BADGES — le milieu et la fin du jeu (Lucas) : tous les badges, gagnés en
//     couleurs, à gagner en OMBRE ; un badge gagné se met en avant (trois au
//     plus), un badge en ombre dit comment on l'obtient ;
//   · PERSONNAGES — les personnages historiques, débloqués au niveau par
//     rareté (lib/personnages-historiques) ; le serveur relit le niveau avant
//     d'équiper.
// L'équipement est OPTIMISTE : appliqué tout de suite, défait si le serveur
// refuse.
// -----------------------------------------------------------------------------

const ONGLETS = [
  { id: 'portrait', label: 'Portrait' },
  { id: 'badges', label: 'Badges' },
  { id: 'personnages', label: 'Personnages' },
] as const
type Onglet = (typeof ONGLETS)[number]['id']

const ORDRE_RARETE: readonly RaretePersonnage[] = ['rare', 'epique', 'legendaire']

export default function AvatarStudio({
  initialConfig,
  name,
  gamertag,
  niveau,
  rang,
  levelLabel,
  badges,
  initialEquipped,
  abonne,
}: {
  initialConfig: AvatarConfig
  name: string
  gamertag: string | null
  niveau: number
  /** Le rang de ligue (l'anneau autour de la photo) ; null avant la première XP. */
  rang: BadgeRank | null
  levelLabel: string
  badges: readonly BadgeState[]
  initialEquipped: readonly string[]
  /** Studuel+ : Marcel dessine l'avatar (migration 378). */
  abonne: boolean
}) {
  const [config, setConfig] = useState(initialConfig)
  const [popKey, setPopKey] = useState(0)
  const [onglet, setOnglet] = useState<Onglet>('portrait')
  const [equipes, setEquipes] = useState<string[]>([...initialEquipped])
  const [pseudo, setPseudo] = useState(gamertag ?? '')
  const [editionPseudo, setEditionPseudo] = useState(false)
  const [atelier, setAtelier] = useState(false)
  const [, startTransition] = useTransition()
  const tabs = useTablist(ONGLETS.length, (i) => setOnglet(ONGLETS[i].id))
  const persoActuel = personnageDuPortrait(config.portrait)

  const pickFree = (field: FreeAvatarFieldKey, value: string) => {
    if (config[field] === value) return
    sfx.tap()
    const prev = config
    const next = applyFreeAvatarField(prev, field, value)
    if (next === prev) return
    setConfig(next)
    setPopKey((k) => k + 1)
    startTransition(async () => {
      const { ok } = await setAvatarFieldAction(field, value)
      if (!ok) {
        setConfig(prev)
        toast('Impossible d’enregistrer ce réglage pour le moment.', 'error')
      }
    })
  }

  const choisirPersonnage = (id: string) => {
    sfx.tap()
    const prev = config
    setConfig({ ...prev, portrait: portraitDePersonnage(id) })
    setPopKey((k) => k + 1)
    startTransition(async () => {
      const { ok } = await choisirPersonnageAction(id)
      if (!ok) {
        setConfig(prev)
        toast('Ce personnage n’est pas encore débloqué.', 'error')
      }
    })
  }

  const basculerBadge = (b: BadgeState) => {
    if (!b.earned) {
      sfx.tap()
      toast(`À gagner : ${b.description}`)
      return
    }
    const next = equipes.includes(b.id)
      ? equipes.filter((x) => x !== b.id)
      : equipes.length >= MAX_EQUIPPED
        ? equipes
        : [...equipes, b.id]
    if (next === equipes) {
      toast(`Trois badges au plus. Retires-en un d’abord.`)
      return
    }
    sfx.tap()
    setEquipes(next)
    startTransition(async () => {
      const r = await setEquippedBadges(next)
      if (r.ok && r.equipped) setEquipes(r.equipped)
      else if (!r.ok) setEquipes(equipes)
    })
  }

  const enregistrerPseudo = (valeur: string) => {
    const propre = valeur.trim()
    setEditionPseudo(false)
    if (propre === (gamertag ?? '') || propre === '') return
    startTransition(async () => {
      const r = await updateGamertag(propre)
      if (r.ok) {
        setPseudo(propre)
        toast('Pseudo enregistré.')
      } else {
        toast(r.error ?? 'Impossible d’enregistrer le pseudo.', 'error')
      }
    })
  }

  return (
    <div role="region" aria-label="Mon vestiaire" className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* --- En haut : la photo dans son cadre, le nom, le pseudo ---------- */}
      <div className="relative flex shrink-0 flex-col items-center bg-gradient-to-b from-[color-mix(in_oklch,var(--primary),black_35%)] to-primary px-4 pt-3 pb-4 text-white">
        <div className="flex w-full items-center">
          <Link
            href="/moi"
            aria-label="Retour à Moi"
            className="flex size-11 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md transition active:scale-90"
          >
            <ArrowLeft className="size-5" strokeWidth={2.6} aria-hidden="true" />
          </Link>
        </div>
        <div key={popKey} className="avatar-pop -mt-6 w-44">
          {/* Le même anneau de rang que le bandeau du haut et l'onglet Moi (16/10/2026). */}
          <AvatarRang
            className="w-full"
            photo={<AvatarRender config={config} forme="blason" className="size-full" />}
            rang={rang ? { id: rang.tier.id, division: divisionDepuisRomain(rang.roman) } : null}
          />
        </div>
        <p className="font-heading mt-1 text-2xl leading-tight font-extrabold">{name}</p>
        <p className="text-xs font-bold text-white/85">
          {levelLabel}
          {rang ? ` · ${rang.label}` : ''}
        </p>
        {editionPseudo ? (
          <form
            className="mt-2 flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              const champ = e.currentTarget.elements.namedItem('pseudo') as HTMLInputElement | null
              enregistrerPseudo(champ?.value ?? '')
            }}
          >
            <input
              name="pseudo"
              defaultValue={pseudo}
              autoFocus
              maxLength={16}
              placeholder="Ton pseudo"
              aria-label="Pseudo de jeu"
              className="h-10 w-44 rounded-full bg-white px-4 text-sm font-bold text-foreground outline-none"
            />
            <button type="submit" className="flex size-10 items-center justify-center rounded-full bg-highlight text-foreground">
              <Check className="size-5" strokeWidth={3} aria-hidden="true" />
              <span className="sr-only">Valider le pseudo</span>
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => {
              sfx.tap()
              setEditionPseudo(true)
            }}
            className="mt-2 flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-bold ring-1 ring-white/25 active:scale-95"
          >
            {pseudo ? `Pseudo : ${pseudo}` : 'Choisir un pseudo'}
            <Pencil className="size-3.5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* --- En bas : les trois onglets ------------------------------------ */}
      <div className="flex min-h-0 flex-1 flex-col">
        <div role="tablist" aria-label="Catégories du vestiaire" className="flex shrink-0 gap-1.5 border-b border-border bg-background px-3 py-2.5">
          {ONGLETS.map((t, i) => {
            const selected = t.id === onglet
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`vestiaire-tab-${t.id}`}
                aria-selected={selected}
                aria-controls="vestiaire-panel"
                {...tabs.props(i, selected)}
                onClick={() => {
                  sfx.tap()
                  setOnglet(t.id)
                }}
                className={cn(
                  'min-h-11 flex-1 rounded-full px-3 py-1.5 text-sm font-bold transition-colors',
                  selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground',
                )}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        <div
          id="vestiaire-panel"
          role="tabpanel"
          aria-labelledby={`vestiaire-tab-${onglet}`}
          className="min-h-0 flex-1 overflow-y-auto px-4 py-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
        >
          {onglet === 'portrait' ? (
            <>
            {/* L'atelier de Marcel : il dessine un avatar sur description. Il
                s'ouvrait en touchant la photo du carnet ; la photo mène
                désormais ici, l'atelier est la première tuile du portrait. */}
            <button
              type="button"
              onClick={() => {
                sfx.tap()
                setAtelier(true)
              }}
              className="carte mb-4 flex w-full items-center gap-3 p-3 text-left transition active:scale-[0.98]"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                <Sparkles className="size-5" strokeWidth={2.4} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-heading block text-base leading-tight font-extrabold">Marcel dessine ton avatar</span>
                <span className="block text-xs font-semibold text-muted-foreground">
                  {abonne ? 'Décris ton personnage, il le dessine.' : 'Avec Studuel+ : décris ton personnage, il le dessine.'}
                </span>
              </span>
            </button>
            <ItemGrid
              categories={[]}
              freeFields={['portrait']}
              catalog={[]}
              config={persoActuel ? { ...config, portrait: '' } : config}
              ownedIds={new Set()}
              onTap={() => {}}
              onPickFree={pickFree}
            />
            </>
          ) : onglet === 'badges' ? (
            <OngletBadges badges={badges} equipes={equipes} onTap={basculerBadge} />
          ) : (
            <OngletPersonnages niveau={niveau} actuel={persoActuel?.id ?? null} onChoisir={choisirPersonnage} />
          )}
        </div>
      </div>
      <AtelierAvatarIa open={atelier} onClose={() => setAtelier(false)} abonne={abonne} />
    </div>
  )
}

/** Les badges : gagnés en couleurs, à gagner en ombre ; trois mis en avant. */
function OngletBadges({
  badges,
  equipes,
  onTap,
}: {
  badges: readonly BadgeState[]
  equipes: readonly string[]
  onTap: (b: BadgeState) => void
}) {
  const gagnes = badges.filter((b) => b.earned).length
  const ranges = [...badges].sort((a, b) => Number(b.earned) - Number(a.earned))
  return (
    <>
      <p className="mb-3 text-sm font-bold text-muted-foreground">
        <span className="text-foreground">{gagnes}</span> sur {badges.length} gagnés · touche un badge gagné pour le mettre
        en avant ({equipes.length}/{MAX_EQUIPPED}), une ombre pour savoir comment l’obtenir.
      </p>
      <ul className="grid grid-cols-3 gap-3">
        {ranges.map((b) => {
          const rang = equipes.indexOf(b.id)
          return (
            <li key={b.id}>
              <button
                type="button"
                onClick={() => onTap(b)}
                aria-pressed={b.earned ? rang >= 0 : undefined}
                className={cn(
                  'carte relative flex w-full flex-col items-center gap-1 p-2 text-center transition active:scale-95',
                  rang >= 0 && 'ring-2 ring-highlight',
                )}
              >
                <span
                  className={cn(
                    'flex size-16 items-center justify-center text-5xl leading-none',
                    b.earned ? 'drop-shadow-[0_3px_3px_rgba(40,20,80,0.3)]' : 'opacity-20 brightness-0',
                  )}
                >
                  <BadgeIcone slug={b.slug} icon={b.icon} tailleImage="size-16" />
                </span>
                <span className="line-clamp-2 text-xs leading-tight font-bold">{b.title}</span>
                {rang >= 0 ? (
                  <span className="absolute -top-1.5 -right-1.5 flex size-6 items-center justify-center rounded-full bg-highlight text-xs font-extrabold">
                    {rang + 1}
                  </span>
                ) : null}
              </button>
            </li>
          )
        })}
      </ul>
    </>
  )
}

/** Les personnages historiques, par rareté ; verrouillés jusqu'à leur niveau. */
function OngletPersonnages({
  niveau,
  actuel,
  onChoisir,
}: {
  niveau: number
  actuel: string | null
  onChoisir: (id: string) => void
}) {
  return (
    <div className="flex flex-col gap-5">
      {ORDRE_RARETE.map((rarete) => {
        const liste = PERSONNAGES_HISTORIQUES.filter((p) => p.rarete === rarete)
        const ouvert = niveau >= NIVEAU_RARETE[rarete]
        return (
          <section key={rarete}>
            <h2 className="titre-section flex items-baseline justify-between">
              {LIBELLE_RARETE[rarete]}
              <span className="text-sm font-bold text-muted-foreground">
                {ouvert ? `${liste.length} débloqués` : `Niveau ${NIVEAU_RARETE[rarete]}`}
              </span>
            </h2>
            <ul className="mt-2 grid grid-cols-3 gap-3">
              {liste.map((p) => {
                const libre = personnageDebloque(p, niveau)
                const porte = actuel === p.id
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() =>
                        libre
                          ? porte || onChoisir(p.id)
                          : toast(`${p.nom} se débloque au niveau ${NIVEAU_RARETE[p.rarete]}.`)
                      }
                      aria-pressed={porte}
                      aria-label={libre ? p.nom : `${p.nom} — niveau ${NIVEAU_RARETE[p.rarete]}`}
                      className={cn(
                        'relative flex w-full flex-col items-center gap-1 text-center transition active:scale-95',
                      )}
                    >
                      <span
                        className={cn(
                          'relative block aspect-square w-full overflow-hidden rounded-2xl ring-2',
                          porte ? 'ring-highlight' : 'ring-transparent',
                        )}
                      >
                        <Image
                          src={imagePersonnage(p.id)}
                          alt=""
                          fill
                          sizes="120px"
                          className={cn('object-cover', !libre && 'brightness-[0.35] grayscale')}
                        />
                        {!libre ? (
                          <span className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-white">
                            <Lock className="size-5" strokeWidth={2.6} aria-hidden="true" />
                            <span className="text-[11px] font-extrabold">Niv. {NIVEAU_RARETE[p.rarete]}</span>
                          </span>
                        ) : null}
                        {porte ? (
                          <span className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-highlight">
                            <Check className="size-4" strokeWidth={3} aria-hidden="true" />
                          </span>
                        ) : null}
                      </span>
                      <span className="line-clamp-2 text-xs leading-tight font-bold">{p.nom}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
