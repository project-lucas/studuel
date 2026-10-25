import Link from 'next/link'
import { ArrowRight, BookOpenCheck, Crown, GraduationCap, Landmark, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import EnTetePage from '@/components/reviser/EnTetePage'
import CoffreRente from '@/components/plus/CoffreRente'
import { Button } from '@/components/ui/button'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import { PILIERS, type PilierId } from '@/lib/studuel-plus/formule'
import { promesseRente } from '@/lib/studuel-plus/rente'

/**
 * STUDUEL+ — L'ÉCRAN DE L'ABONNEMENT (15/10/2026, Lucas : « les gens veulent
 * être suivis, guidés, que l'on pense pour eux, avant eux »).
 *
 * Deux visages : l'ABONNÉ y trouve ce que son abonnement lui rapporte
 * AUJOURD'HUI (sa rente à récolter, les cafés de Marcel, son jour J), le
 * GRATUIT y lit les cinq piliers et ce qu'il en garde sans payer — jamais un
 * mur nu. Les piliers viennent de lib/studuel-plus/formule : la carte de la
 * Boutique et cet écran disent la même chose. Écran sans lecture : la page
 * (app/plus) et l'aperçu (/dev/plus) lui passent ses données.
 */

const ICONES: Record<PilierId, LucideIcon> = {
  marcel: Sparkles,
  examen: GraduationCap,
  annales: BookOpenCheck,
  rente: Crown,
  prepa: Landmark,
}

export type DonneesEcranPlus = {
  abonne: boolean
  /** Ce que chaque pilier dit à CET élève, aujourd'hui (abonné). */
  etatDe: Record<PilierId, string>
  /** La rente lue en base (580) ; `null` : pas encore là. */
  rente: { depuisMs: number; maintenantMs: number; total: number } | null
  /** L'app Android du Play Store ne vend pas Studuel+ (lib/canal). */
  achatPossible: boolean
}

export default function EcranPlus({ abonne, etatDe, rente, achatPossible }: DonneesEcranPlus) {
  return (
    <div className="pb-10">
      <EnTetePage
        retour={{ fallback: '/tresor' }}
        titre="Studuel+"
        sousTitre={abonne ? 'Ce que ton abonnement fait pour toi' : 'Un guide qui pense pour toi, avant toi.'}
      />

      <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 pt-3">
        {abonne ? (
          rente ? (
            <CoffreRente depuisMs={rente.depuisMs} maintenantMs={rente.maintenantMs} total={rente.total} />
          ) : (
            <section className="carte flex items-center gap-3 p-4">
              <CristalIcon className="size-10 shrink-0" />
              <p className="text-sm font-semibold text-balance">
                Ta rente de gemmes arrive très bientôt : {promesseRente()}.
              </p>
            </section>
          )
        ) : null}

        <section aria-labelledby="piliers-titre" className="flex flex-col gap-2.5">
          <h2 id="piliers-titre" className="titre-section px-1">
            {abonne ? 'Ton abonnement' : 'Ce que comprend Studuel+'}
          </h2>
          <ul className="flex flex-col gap-2.5">
            {/* L'abonné a SON coffre juste au-dessus : le pilier de la rente
                ne le lui répète pas. */}
            {PILIERS.filter((p) => !(abonne && p.id === 'rente')).map((p) => {
              const Icone = ICONES[p.id]
              return (
                <li key={p.id}>
                  <Link href={p.href} className="carte flex items-start gap-3 p-4 transition active:translate-y-px">
                    <span className="bg-secondary text-primary grid size-11 shrink-0 place-items-center rounded-2xl">
                      <Icone aria-hidden="true" className="size-5" strokeWidth={2.4} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="font-heading text-[16px] leading-tight font-extrabold">{p.titre}</span>
                        {p.statut === 'bientot' ? (
                          <span className="bg-secondary text-primary rounded-full px-2 py-0.5 text-[10.5px] font-extrabold">
                            Bientôt
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-snug font-semibold">{p.promesse}</span>
                      <span className="text-muted-foreground mt-1 block text-[12px] leading-snug font-semibold">
                        {abonne ? etatDe[p.id] : p.detail}
                      </span>
                      {!abonne ? (
                        <span className="text-muted-foreground mt-1.5 block text-[11.5px] font-bold">
                          Sans Studuel+ : {p.gratuit.charAt(0).toLowerCase()}
                          {p.gratuit.slice(1)}
                        </span>
                      ) : null}
                    </span>
                    <ArrowRight aria-hidden="true" className="text-muted-foreground mt-1 size-4 shrink-0" />
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>

        {!abonne && achatPossible ? (
          <Button asChild size="xl" shine className="w-full">
            <Link href="/tresor">
              <Crown aria-hidden="true" />
              Passer à Studuel+
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  )
}
