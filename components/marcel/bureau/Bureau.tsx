'use client'

import { useEffect, useRef, useState, type ReactNode, type UIEvent } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { ICONE_ONGLET, LIBELLE_ONGLET, ONGLETS_MARCEL, type OngletMarcel } from '@/lib/coach/bureau'
import { replier, verdictDefilement } from '../replie'

/** Ce que la tête rend au contenu en se repliant (240 → 68 px). */
const GAIN_TETE = 170

/**
 * LE BUREAU DE MARCEL — sa barre « Aujourd’hui · Radar · Toi · Outils », plus
 * « Examen » à droite en 3e, 1re et terminale (16/10/2026, maquettes
 * marcel-bureau-plus.html puis marcel-examen.html).
 *
 * Chaque onglet porte son DESSIN au-dessus de son nom (Lucas : « j’aime bien
 * que tu ajoutes des icônes à la barre »). L’onglet Examen est doré : le mode
 * examen est un pilier de Studuel+, et l’or en est l’identité.
 *
 * Les panneaux arrivent du serveur, déjà rendus ; ce composant ne fait que
 * montrer celui qu’on a touché. L’onglet vit dans l’adresse (`?onglet=`,
 * écrit par `replaceState`, sans empiler d’historique) : revenir d’un cours
 * rouvre le même onglet. Les panneaux restent montés, cachés : changer
 * d’onglet ne recalcule rien. Un onglet sans panneau (Examen hors classe à
 * examen) n’est pas montré.
 *
 * Le bas de chaque panneau garde 5 rem de marge : le bouton des quêtes flotte
 * au-dessus du champ, et la dernière rangée doit pouvoir remonter au-dessus.
 */
export default function Bureau({
  initial,
  panneaux,
}: {
  initial: OngletMarcel
  panneaux: Partial<Record<OngletMarcel, ReactNode>>
}) {
  const onglets = ONGLETS_MARCEL.filter((o) => panneaux[o] !== undefined && panneaux[o] !== null)
  const [onglet, setOnglet] = useState<OngletMarcel>(onglets.includes(initial) ? initial : 'aujourdhui')

  // La tête se replie quand on fait défiler un panneau (components/marcel/replie).
  const replie = useRef(false)
  useEffect(() => () => replier('defilement', false), [])
  const surDefilement = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const suite = verdictDefilement(replie.current, { haut: el.scrollTop, depassement: el.scrollHeight - el.clientHeight }, GAIN_TETE)
    if (suite !== replie.current) {
      replie.current = suite
      replier('defilement', suite)
    }
  }

  const choisir = (o: OngletMarcel) => {
    if (o === onglet) return
    sfx.tap()
    setOnglet(o)
    // Un autre onglet repart de son haut : la tête revient.
    replie.current = false
    replier('defilement', false)
    const url = new URL(window.location.href)
    if (o === 'aujourdhui') url.searchParams.delete('onglet')
    else url.searchParams.set('onglet', o)
    window.history.replaceState(window.history.state, '', url)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        role="tablist"
        aria-label="Le bureau de Marcel"
        className="bg-secondary grid shrink-0 gap-1 rounded-2xl p-1"
        style={{ gridTemplateColumns: `repeat(${onglets.length}, minmax(0, 1fr))` }}
      >
        {onglets.map((o) => {
          const actif = o === onglet
          const examen = o === 'examen'
          return (
            <button
              key={o}
              type="button"
              role="tab"
              id={`marcel-onglet-${o}`}
              aria-selected={actif}
              aria-controls={`marcel-panneau-${o}`}
              onClick={() => choisir(o)}
              className={cn(
                'font-heading flex min-h-[52px] min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-0 leading-none font-extrabold transition active:scale-[.97]',
                // À cinq onglets, « Aujourd’hui » doit tenir en entier sur 390 px.
                onglets.length > 4 ? 'text-[10.5px] tracking-[-0.01em]' : 'text-[11.5px]',
                actif ? 'bg-card text-foreground shadow-[0_2px_0_color-mix(in_oklch,var(--primary),transparent_70%)]' : 'text-primary',
                examen &&
                  (actif
                    ? 'text-foreground shadow-[inset_0_0_0_2px_var(--highlight),0_2px_0_color-mix(in_oklch,var(--highlight),black_25%)]'
                    : 'bg-[color-mix(in_oklch,var(--highlight),white_78%)] text-[color-mix(in_oklch,var(--highlight),black_55%)] shadow-[inset_0_0_0_1.5px_color-mix(in_oklch,var(--highlight),white_30%)]'),
              )}
            >
              <Image
                src={ICONE_ONGLET[o]}
                alt=""
                aria-hidden="true"
                width={26}
                height={26}
                unoptimized
                className={cn('size-[26px] object-contain transition', !actif && !examen && 'opacity-75 saturate-[.8]')}
              />
              <span className="max-w-full truncate">{LIBELLE_ONGLET[o]}</span>
            </button>
          )
        })}
      </div>

      {onglets.map((o) => (
        <div
          key={o}
          role="tabpanel"
          id={`marcel-panneau-${o}`}
          aria-labelledby={`marcel-onglet-${o}`}
          hidden={o !== onglet}
          onScroll={surDefilement}
          // Le contenu passe SOUS le champ, qui flotte (sa hauteur : --champ-marcel-h),
          // et se fond en haut sous les onglets au lieu d'y être coupé net.
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-0.5 pt-2.5 pb-[calc(var(--champ-marcel-h,4.5rem)+1.5rem)] [mask-image:linear-gradient(to_bottom,transparent_0,black_14px)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {panneaux[o]}
        </div>
      ))}
    </div>
  )
}
