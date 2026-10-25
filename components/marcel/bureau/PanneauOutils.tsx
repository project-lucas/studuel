'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { PHRASE_CAFES_GRATUIT, motCafes } from '@/lib/coach/credits'
import { FAMILLES, OUTILS, coutOutil, libelleCoutOutil, outilsDe, type Outil } from '@/lib/coach/catalogue-outils'
import { useCoachFil } from '../CoachFil'
import CompteurCafes, { Dosette } from '../CompteurCafes'
import styles from './PanneauOutils.module.css'

/**
 * L’onglet « Outils » : les vingt-quatre outils de Marcel en BLOCS, trois par
 * rangée, chacun avec son dessin et son nom (Lucas, 16/10 : « je préfère quand
 * on mettait beaucoup d’outils à disposition, une succession de blocs carrés »).
 * Rangés par verbe (lib/coach/catalogue-outils).
 *
 * LE 25/10/2026 (Lucas : « retire le sous-texte gris, améliore les blocs — la
 * bordure blanche est trop simple ; corrige le coût en café de chaque
 * outil ») : plus de `mots` affichés (ils restent la description lue par les
 * lecteurs d’écran), chaque bloc est une PLAQUE crème à bord lavande posée sur
 * son ombre nette (PanneauOutils.module.css), le dessin déborde du haut comme
 * un objet posé, le nom en Baloo 2, et le COÛT au bas du bloc : « 1 » et la
 * dosette pour un mode du champ, « Offert » pour une page. En tête, le
 * compteur vivant et le barème : « Il te reste 174 cafés · une demande =
 * 1 café » (lib/coach/credits : un seul barème, pas de migration).
 *
 * Le MÊME catalogue pour tous : ouvert pour Studuel+, couronné pour le gratuit
 * (chaque bloc mène alors à Studuel+) — l’élève voit tout ce qu’il pourrait
 * faire. Un outil « mode » arme le champ (sa consigne, son placeholder) et lui
 * donne le focus ; un outil « page » ouvre son écran.
 */
export default function PanneauOutils({ ouvert, cafes }: { ouvert: boolean; cafes: number | null }) {
  return (
    <div>
      {ouvert && cafes !== null ? (
        <p className="flex flex-wrap items-center gap-x-1 px-1 text-[13px] font-bold">
          <span>Il te reste</span>
          <CompteurCafes cafes={cafes} taille="inline" className="text-primary" />
          <span className="text-muted-foreground">· une demande = {motCafes(1)}</span>
        </p>
      ) : (
        <div className="flex items-center gap-2 px-1 text-[13px] font-bold">
          <Dosette taille={26} />
          <p className="min-w-0 flex-1 leading-snug">
            <span className="block">{PHRASE_CAFES_GRATUIT}</span>
            <span className="text-muted-foreground block text-[12px]">
              {OUTILS.length} outils t’attendent.{' '}
              <Link href="/plus" className="text-primary inline-flex items-center gap-0.5 font-extrabold underline-offset-4 hover:underline">
                Découvrir
                <ArrowRight aria-hidden="true" className="size-3.5" strokeWidth={2.8} />
              </Link>
            </span>
          </p>
        </div>
      )}

      {FAMILLES.map((f) => (
        <section key={f.id} className="mt-3" aria-labelledby={`outils-${f.id}`}>
          <h2 id={`outils-${f.id}`} className="titre-section px-1 text-[15px]">
            {f.label}
          </h2>
          {/* Les dessins débordent du haut de leur plaque (14 px) : la grille
              leur laisse la place entre les rangées. */}
          <ul className="mt-3 grid grid-cols-3 gap-x-2 gap-y-2 px-0.5">
            {outilsDe(f.id).map((o) => (
              <li key={o.id} className="flex">
                <Bloc outil={o} ouvert={ouvert} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function Bloc({ outil, ouvert }: { outil: Outil; ouvert: boolean }) {
  const { proposer } = useCoachFil()
  const classe = cn(styles.bloc, !ouvert && styles.ferme, 'mt-3.5 px-1 pb-1.5 text-center')
  const cout = coutOutil(outil)
  const description = `${outil.label} : ${outil.mots} — ${libelleCoutOutil(outil)}`

  const contenu = (
    <>
      {!ouvert ? (
        <span className="bg-highlight absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full shadow-[0_2px_0_color-mix(in_oklch,var(--highlight),black_25%)]" aria-hidden="true">
          <Crown className="size-3" strokeWidth={2.6} />
        </span>
      ) : null}
      {/* Le dessin déborde du haut de la plaque, comme un objet posé dessus. */}
      <Image
        src={outil.image}
        alt=""
        aria-hidden="true"
        width={64}
        height={64}
        unoptimized
        className={cn(
          '-mt-3.5 size-[52px] shrink-0 object-contain drop-shadow-[0_4px_3px_rgba(36,48,79,.22)]',
          !ouvert && 'opacity-70 grayscale-[30%]',
        )}
      />
      <span className={cn('font-heading mt-0.5 line-clamp-2 min-h-[2.2em] text-[13px] leading-[1.1] font-extrabold', !ouvert && 'text-muted-foreground')}>
        {outil.label}
      </span>
      {/* LE COÛT : « 1 » et la dosette, ou « Offert ». */}
      <span
        aria-hidden="true"
        className={cn(
          'font-heading mt-1 inline-flex h-5 items-center gap-0.5 rounded-full px-1.5 text-[11px] leading-none font-extrabold tabular-nums',
          cout.type === 'offert' ? 'bg-success/12 text-success' : 'bg-secondary text-secondary-foreground',
        )}
      >
        {cout.type === 'offert' ? (
          'Offert'
        ) : (
          <>
            {cout.cafes}
            <Dosette taille={15} immobile />
          </>
        )}
      </span>
    </>
  )

  if (!ouvert) {
    return (
      <Link href="/plus" className={classe} aria-label={`${description} — avec Studuel+`}>
        {contenu}
      </Link>
    )
  }
  if (outil.cible.type === 'page') {
    return (
      <Link href={outil.cible.href} className={classe} aria-label={description}>
        {contenu}
      </Link>
    )
  }
  const { mode } = outil.cible
  return (
    <button
      type="button"
      className={classe}
      aria-label={description}
      onClick={() => {
        sfx.tap()
        proposer(mode)
      }}
    >
      {contenu}
    </button>
  )
}
