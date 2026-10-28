'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useQuetesDuJour } from '@/components/quetes/store'
import enveloppe from '@/public/images/courrier/enveloppe.webp'
import { journeeBouclee } from '@/lib/quests'
import { sfx } from '@/lib/sounds'
import { isHudHidden } from '@/lib/top-hud-routes'
import { cn } from '@/lib/utils'
import styles from './BoutonCourrierFlottant.module.css'
import { relireCourrier, useNonLusCourrier } from './store'

/** Au plus une relecture toutes les dix minutes au retour dans l'app (comme les annonces). */
const INTERVALLE_MS = 10 * 60_000
/** L'app s'affiche d'abord ; le compte se lit ensuite. */
const DELAI_LANCEMENT_MS = 2500

/**
 * LE COURRIER EN BOUTON FLOTTANT (25/10/2026, cadrage « le jeu vivant » § G).
 *
 * L'enveloppe peinte dans le même rond blanc que le bouton des quêtes, le
 * NOMBRE de lettres non lues en pastille corail, « Courrier » écrit dessous.
 * Visible SEULEMENT quand quelque chose attend : une lettre pas lue, un cadeau
 * pas récupéré, une diffusion jamais vue, un défi d'ami à relever — c'est le
 * compte de `courrier_non_lus` (602), tenu à jour par la boîte elle-même.
 *
 * Il se pose AU-DESSUS du bouton des quêtes quand celui-ci est à l'écran
 * (mêmes règles : l'arène, la tête de Marcel, le champ du bureau — voir
 * components/quetes/BoutonQuetesFlottant), et prend sa place quand la journée
 * est bouclée. Jamais sur `/courrier` lui-même, ni là où le bandeau se cache.
 *
 * Le compte se relit au lancement (après 2,5 s) et au retour dans l'app, au
 * plus toutes les dix minutes — jamais en boucle.
 *
 * `demo` (aperçu `/dev/courrier`) : rien n'est relu, le compte vient du
 * magasin semé par la page.
 */
export default function BoutonCourrierFlottant({ demo = false }: { demo?: boolean }) {
  const pathname = usePathname()
  const nonLus = useNonLusCourrier()
  const quetes = useQuetesDuJour()
  const derniere = useRef(0)

  useEffect(() => {
    if (demo) return
    const relire = () => {
      if (document.visibilityState !== 'visible' || Date.now() - derniere.current < INTERVALLE_MS) return
      derniere.current = Date.now()
      void relireCourrier()
    }
    const t = setTimeout(relire, DELAI_LANCEMENT_MS)
    document.addEventListener('visibilitychange', relire)
    return () => {
      clearTimeout(t)
      document.removeEventListener('visibilitychange', relire)
    }
  }, [demo])

  if (!nonLus || nonLus <= 0 || pathname === '/courrier' || isHudHidden(pathname)) return null

  const quetesVisibles = quetes !== null && quetes.quetes.length > 0 && !journeeBouclee(quetes)
  const arene = pathname === '/defi'
  const position = quetesVisibles
    ? arene
      ? 'bottom-[18rem] md:bottom-[7.75rem]'
      : 'bottom-[11.75rem] md:bottom-[7.75rem] [html.marcel-fab_&]:bottom-[16.5rem] [html.memoire-fab_&]:bottom-[16.5rem] md:[html.memoire-fab_&]:bottom-[12.5rem] [html.champ-marcel_&]:bottom-[calc(var(--champ-marcel)+5.75rem)]'
    : arene
      ? 'bottom-[12.25rem] md:bottom-8'
      : 'bottom-24 md:bottom-8 [html.marcel-fab_&]:bottom-[10.75rem] [html.memoire-fab_&]:bottom-[10.75rem] md:[html.memoire-fab_&]:bottom-[6.75rem] [html.champ-marcel_&]:bottom-[var(--champ-marcel)]'

  return (
    <div data-tour="courrier" className={cn(styles.fab, 'fixed right-4 z-40', position)}>
      <Link
        href="/courrier"
        onClick={() => sfx.tap()}
        aria-label={`Courrier : ${nonLus} ${nonLus > 1 ? 'nouvelles lettres' : 'nouvelle lettre'}`}
        className="pointer-events-auto relative flex shrink-0 flex-col items-center transition active:scale-95"
      >
        <span className="relative grid size-16 place-items-center rounded-full bg-card shadow-[0_0_0_3px_var(--primary),0_5px_0_3px_color-mix(in_oklch,var(--primary),black_42%),0_12px_16px_-8px_color-mix(in_oklch,var(--primary),transparent_50%)]">
          <Image
            src={enveloppe}
            alt=""
            aria-hidden="true"
            width={96}
            height={83}
            sizes="48px"
            className={cn(styles.enveloppe, 'size-12 object-contain select-none')}
          />
          <span
            aria-hidden="true"
            className="font-heading absolute -top-1 -right-1 grid h-5.5 min-w-5.5 place-items-center rounded-full bg-destructive px-1.5 text-[13px] leading-none font-extrabold text-white tabular-nums ring-[2.5px] ring-card"
          >
            {nonLus > 99 ? '99+' : nonLus}
          </span>
        </span>
        <span
          aria-hidden="true"
          className="font-heading relative -mt-2 rounded-full bg-primary px-2.5 py-0.5 text-[12px] leading-tight font-extrabold text-primary-foreground ring-2 ring-card"
        >
          Courrier
        </span>
      </Link>
    </div>
  )
}
