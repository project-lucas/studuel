import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import BoutonHistorique from '../BoutonHistorique'
import PoseMarcel, { type Pose } from '../PoseMarcel'
import decorJour from '@/public/images/marcel/decor/jour.webp'
import decorSoir from '@/public/images/marcel/decor/soir.webp'
import type { Decor } from '@/lib/coach/bureau'

const DECORS = { jour: decorJour, soir: decorSoir } as const

/**
 * LA TÊTE DU BUREAU (16/10/2026, Lucas : « une atmosphère, un fond d'écran avec
 * une insertion de Marcel au bon endroit, comme un bureau de travail »).
 *
 * Le bureau de Marcel est PEINT (Nano Banana 2.1, dans le style de la cour de
 * l'académie — scripts/marcel-illustrations.mjs) : au jour de 7 h à 18 h, à la
 * lampe le reste du temps (`decorDuMoment`). Marcel se tient devant sa table,
 * à gauche ; sa phrase se pose sur le mur calme, à droite. Le retour et
 * l'historique flottent dans les coins : une seule bande au lieu de deux
 * rangées (la ligne de la flèche mangeait 50 px, Lucas : « un problème
 * d'optimisation de place »). Le bas du décor se fond dans le mur crème, où
 * commencent les onglets — un décor là où l'on pose un héros, le mur là où le
 * contenu défile (CLAUDE.md).
 *
 * PLUS DE BANDEAU AU-DESSUS (16/10/2026, Lucas : « as-tu besoin de montrer la
 * barre de niveau ici ? que le fond d'écran occupe plus de place et habille
 * plus l'interface ») : le décor part du BORD de l'écran, d'un côté à
 * l'autre (la largeur de l'écran, quelle que soit la marge de la page),
 * passe sous l'encoche, et gagne la hauteur libérée — Marcel y grandit.
 *
 * Le titre de la page reste « Coach Marcel », lu par les lecteurs d'écran.
 */
export default function EnTeteBureau({
  bulle,
  decor,
  pose = 'salut',
  avecHistorique = true,
}: {
  bulle: string
  decor: Decor
  pose?: Pose
  /** L'historique des conversations (absent de l'aperçu sans compte). */
  avecHistorique?: boolean
}) {
  return (
    // Repliée (components/marcel/replie : un panneau qu'on fait défiler, une
    // conversation ouverte), la tête n'est plus qu'une bande de décor avec le
    // retour et l'historique : ~170 px rendus au contenu. Une transition
    // ponctuelle de hauteur, pas une animation continue.
    <header className="relative h-[calc(15rem+env(safe-area-inset-top))] shrink-0 overflow-hidden transition-[height] duration-300 ease-out max-md:left-1/2 max-md:w-screen max-md:-translate-x-1/2 md:mt-2 md:h-[240px] md:rounded-[28px] [html.marcel-replie_&]:h-[calc(4.25rem+env(safe-area-inset-top))] md:[html.marcel-replie_&]:h-[72px]">
      <h1 className="sr-only">Coach Marcel</h1>
      <Image
        src={DECORS[decor]}
        alt=""
        aria-hidden="true"
        fill
        priority
        placeholder="blur"
        sizes="(min-width: 768px) 640px, 100vw"
        className="object-cover object-[22%_62%]"
      />
      {/* Le bas se fond dans le mur : les onglets ne flottent pas sur la peinture. */}
      <span
        aria-hidden="true"
        className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t to-transparent"
      />

      {/* Un voile en haut : l'heure et la batterie du téléphone restent lisibles sur la peinture. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[calc(3rem+env(safe-area-inset-top))] bg-gradient-to-b from-black/25 to-transparent"
      />

      <div className="absolute inset-x-4 top-[calc(0.75rem+env(safe-area-inset-top))] flex items-center justify-between">
        <Link
          href="/reviser"
          aria-label="Revenir à Réviser"
          className="bg-card text-primary flex size-10 items-center justify-center rounded-full shadow-[0_3px_10px_-4px_rgba(36,48,79,.45)] transition active:scale-95"
        >
          <ArrowLeft aria-hidden="true" className="size-5" strokeWidth={2.6} />
        </Link>
        {avecHistorique ? <BoutonHistorique /> : null}
      </div>

      <PoseMarcel
        pose={pose}
        hauteur={160}
        priority
        className="coach-entree absolute bottom-5 left-3 object-contain transition-opacity duration-200 [html.marcel-replie_&]:opacity-0 drop-shadow-[0_12px_14px_rgba(20,12,40,.35)]"
      />

      <p className="bg-card/95 absolute right-4 bottom-12 left-[136px] transition-opacity duration-200 [html.marcel-replie_&]:pointer-events-none [html.marcel-replie_&]:opacity-0 rounded-2xl px-3 py-2 text-[13px] leading-snug font-bold shadow-[0_8px_20px_-10px_rgba(36,48,79,.55)] before:absolute before:bottom-4 before:-left-[7px] before:border-y-[7px] before:border-r-[8px] before:border-y-transparent before:border-r-[color-mix(in_oklch,var(--card),transparent_5%)] before:content-['']">
        {bulle}
      </p>
    </header>
  )
}
