import Link from 'next/link'
import { ChevronRight, Swords } from 'lucide-react'
import type { CompteErreurs } from '@/lib/srs'

/**
 * LA PORTE « MES ERREURS » SUR L'ACCUEIL RÉVISER (05/11/2026).
 *
 * Lucas : « pour affronter un boss on doit avant revoir ses erreurs, or c'est
 * une page qu'on ne voit nulle part ». La session existait (`/reviser/revoir`),
 * mais on n'y entrait que par une tuile de chapitre ou l'affiche d'un gardien.
 * Elle a maintenant sa carte, sous la série et la boucle ouverte : le compte
 * des erreurs à venger en grand (c'est lui qu'on a envie de vider), le reste
 * de la file du jour à côté. Rien quand la file est vide — on ne fabrique pas
 * de travail à zéro.
 *
 * Une `.carte` blanche : un BLOC, pas un objet à gagner (règle d'homogénéité).
 * Composant serveur, sans état : un simple lien.
 */
export default function CarteErreurs({ compte }: { compte: CompteErreurs }) {
  const { aVenger, aRevoir } = compte
  if (aVenger + aRevoir === 0) return null

  const titre = aVenger > 0 ? `${aVenger} erreur${aVenger > 1 ? 's' : ''} à venger` : `${aRevoir} question${aRevoir > 1 ? 's' : ''} à revoir`
  const detail =
    aVenger > 0 && aRevoir > 0
      ? `Puis ${aRevoir} à revoir`
      : aVenger > 0
        ? 'Avant d’affronter un gardien'
        : 'Avant que ta mémoire oublie'

  return (
    <Link
      href="/reviser/revoir"
      data-tour="mes-erreurs"
      className="carte group flex min-h-[76px] items-center gap-3 px-4 py-3 transition-transform active:scale-[0.99]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- illustration de la famille nav */}
      <img src="/images/supports/erreurs.webp" alt="" width={56} height={56} className="size-14 shrink-0" />
      <span className="min-w-0 flex-1">
        <span className="surtitre text-muted-foreground block">Mes erreurs</span>
        <span className="font-heading block text-lg leading-tight font-extrabold">{titre}</span>
        <span className="text-muted-foreground block text-[13px] font-semibold">{detail}</span>
      </span>
      <span className="bg-primary text-primary-foreground flex shrink-0 items-center gap-1 rounded-full py-2 pr-2.5 pl-3 text-sm font-extrabold shadow-[0_3px_0_0_color-mix(in_oklab,var(--primary),black_25%)]">
        {aVenger > 0 ? <Swords className="size-4" aria-hidden="true" /> : null}
        {aVenger > 0 ? 'Venger' : 'Revoir'}
        <ChevronRight className="size-4" aria-hidden="true" />
      </span>
    </Link>
  )
}
