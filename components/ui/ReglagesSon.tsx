'use client'

import { useState, useSyncExternalStore, type ReactNode } from 'react'
import Image, { type StaticImageData } from 'next/image'
import { Music, Volume2, VolumeX } from 'lucide-react'
import MusiqueDeFond from '@/components/son/MusiqueDeFond'
import { NAV_TABS } from '@/lib/nav-tabs'
import amisIcone from '@/public/images/nav/amis.webp'
import reviserIcone from '@/public/images/nav/reviser.webp'
import defiIcone from '@/public/images/nav/defi.webp'
import moiIcone from '@/public/images/nav/moi.webp'
import tresorIcone from '@/public/images/nav/tresor.webp'
import { getSoundOnServer, isSoundOn, setSoundOn, sfx, subscribeSound } from '@/lib/sounds'
import {
  getMusiqueOnServer,
  getTheme,
  getThemeServer,
  isMusiqueOn,
  setMusiqueOn,
  setTheme,
  basculerMusiqueOnglet,
  musiqueDansOnglet,
  subscribeMusique,
  THEMES,
  type OngletMusique,
  type Theme,
} from '@/lib/musique'
import { getVolume, getVolumeServer, pourcentVolume, setVolume, subscribeVolume, type Canal } from '@/lib/volumes'
import { cn } from '@/lib/utils'

// Les dessins de la barre d'onglets, importés comme dans Navigation (adresse à
// empreinte : un dessin remplacé n'est jamais resservi depuis un cache).
const ICONES_ONGLETS: Record<OngletMusique, StaticImageData> = {
  amis: amisIcone,
  reviser: reviserIcone,
  defi: defiIcone,
  moi: moiIcone,
  tresor: tresorIcone,
}

/**
 * LE SON DANS LES PARAMÈTRES (05/11/2026), EN UNE CARTE façon Clash Royale
 * (Lucas : « plus compact, inspire-toi de Clash Royale ») : une ligne par
 * canal — icône, nom, curseur de volume, interrupteur qui coupe PARTOUT — puis
 * le thème de fond en trois pastilles, qu'on entend dès qu'on en touche une.
 */
export default function ReglagesSon() {
  const effetsOn = useSyncExternalStore(subscribeSound, isSoundOn, getSoundOnServer)
  const musiqueOn = useSyncExternalStore(subscribeMusique, isMusiqueOn, getMusiqueOnServer)
  return (
    <section aria-labelledby="reglages-son" className="carte mx-auto mt-4 w-full max-w-md p-4">
      <h2 id="reglages-son" className="titre-section">
        Son
      </h2>
      <div className="mt-2 flex flex-col">
        <LigneSon
          canal="effets"
          nom="Effets"
          on={effetsOn}
          icone={effetsOn ? <Volume2 className="size-4" strokeWidth={2.4} /> : <VolumeX className="size-4" strokeWidth={2.4} />}
          onBasculer={() => {
            setSoundOn(!effetsOn)
            // Allumer joue un son : la preuve que le réglage a pris.
            if (!effetsOn) sfx.notice('success')
          }}
        />
        <LigneSon
          canal="musique"
          nom="Musique"
          on={musiqueOn}
          icone={<Music className="size-4" strokeWidth={2.4} />}
          onBasculer={() => setMusiqueOn(!musiqueOn)}
        />
        <ChoixTheme actif={musiqueOn} />
        <OngletsMusique actif={musiqueOn} />
      </div>
    </section>
  )
}

function LigneSon({
  canal,
  nom,
  on,
  icone,
  onBasculer,
}: {
  canal: Canal
  nom: string
  on: boolean
  icone: ReactNode
  onBasculer: () => void
}) {
  const volume = useSyncExternalStore(subscribeVolume, () => getVolume(canal), getVolumeServer)
  const pct = pourcentVolume(volume)
  return (
    <div className="flex min-h-12 items-center gap-3">
      <span
        aria-hidden="true"
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-lg',
          on ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
        )}
      >
        {icone}
      </span>
      <span className="w-16 shrink-0 font-bold">{nom}</span>
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={pct}
        disabled={!on}
        aria-label={`Volume ${nom === 'Effets' ? 'des effets' : 'de la musique'}`}
        aria-valuetext={`${pct} %`}
        onChange={(e) => setVolume(canal, Number(e.target.value) / 100)}
        // On ENTEND le niveau des effets en lâchant le curseur ; la musique
        // suit pendant qu'on glisse (lib/musique s'abonne au volume).
        onPointerUp={() => {
          if (canal === 'effets') sfx.notice('success')
        }}
        className="h-11 min-w-0 flex-1 cursor-pointer accent-[var(--primary)] disabled:cursor-default disabled:opacity-35"
      />
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={nom}
        onClick={onBasculer}
        className="flex size-11 shrink-0 cursor-pointer items-center justify-center"
      >
        <span
          aria-hidden="true"
          className={cn('flex h-6 w-11 items-center rounded-full p-0.5 transition-colors', on ? 'bg-primary' : 'bg-muted-foreground/30')}
        >
          <span className={cn('size-5 rounded-full bg-white shadow-sm transition-transform', on && 'translate-x-5')} />
        </span>
      </button>
    </div>
  )
}

/**
 * La musique ONGLET PAR ONGLET : les cinq icônes de la barre, dans son ordre.
 * En couleur, la musique y joue ; grise, elle s'y tait. Un tap bascule.
 */
function OngletsMusique({ actif }: { actif: boolean }) {
  return (
    <div className={cn('flex flex-col gap-1 pt-2', !actif && 'opacity-40')}>
      <span className="text-sm font-bold">Musique dans les onglets</span>
      <div className="flex justify-between px-1">
        {NAV_TABS.map((t) => (
          <IconeOnglet key={t.icon} onglet={t.icon} nom={t.name} actif={actif} />
        ))}
      </div>
    </div>
  )
}

function IconeOnglet({ onglet, nom, actif }: { onglet: OngletMusique; nom: string; actif: boolean }) {
  const on = useSyncExternalStore(subscribeMusique, () => musiqueDansOnglet(onglet), () => onglet !== 'reviser')
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={`Musique dans ${nom}`}
      title={`${nom} : musique ${on ? 'allumée' : 'coupée'}`}
      disabled={!actif}
      onClick={() => {
        sfx.tap()
        basculerMusiqueOnglet(onglet)
      }}
      className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl transition-transform active:scale-90 disabled:cursor-default"
    >
      <Image
        src={ICONES_ONGLETS[onglet]}
        alt=""
        width={40}
        height={40}
        className={cn('size-9 object-contain transition-[filter,opacity]', !on && 'opacity-45 grayscale')}
      />
    </button>
  )
}

function ChoixTheme({ actif }: { actif: boolean }) {
  const theme = useSyncExternalStore(subscribeMusique, getTheme, getThemeServer)
  // L'aperçu ne part qu'après un choix : ouvrir les paramètres ne lance pas de
  // musique, toucher un thème le fait entendre.
  const [apercu, setApercu] = useState(false)
  const choisir = (id: Theme) => {
    setTheme(id)
    setApercu(true)
  }
  return (
    <div className={cn('flex flex-col gap-1.5 pt-2', !actif && 'opacity-40')}>
      <span className="text-sm font-bold">Thème musical</span>
      <div role="radiogroup" aria-label="Thème musical" className="flex gap-1.5">
        {THEMES.map((t) => {
          const choisi = t.id === theme
          return (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={choisi}
              title={t.titre}
              disabled={!actif}
              onClick={() => choisir(t.id)}
              className={cn(
                'h-10 min-w-0 flex-1 cursor-pointer truncate rounded-full px-2 text-sm font-bold transition-colors disabled:cursor-default',
                choisi ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-muted/70',
              )}
            >
              {t.court}
            </button>
          )
        })}
      </div>
      {apercu && actif ? <MusiqueDeFond piste="arene" /> : null}
    </div>
  )
}
