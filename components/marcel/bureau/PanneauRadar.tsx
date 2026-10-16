import Link from 'next/link'
import { ArrowRight, CircleAlert, CircleCheck, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { subjectVignette } from '@/lib/subject-style'
import { nomDuJour, quandEnMots, tonPreparation, type ControleBureau } from '@/lib/coach/bureau'
import type { CouvertureMatiere } from '@/lib/coach/couverture'
import type { Remarque } from '@/lib/coach/remarques'
import PoseMarcel from '../PoseMarcel'

const TON_TEXTE = { success: 'text-success', warning: 'text-warning', destructive: 'text-destructive' } as const
const TON_FOND = { success: 'bg-success', warning: 'bg-warning', destructive: 'bg-destructive' } as const
const MAX_MATIERES = 6
const CRANS = 10

/**
 * L’onglet « Radar » (refait le 16/10/2026, Lucas : « le Radar doit passer à
 * une version bien meilleure niveau design ») : où en est l’élève, sans rien
 * deviner. En tête, LE PROCHAIN CONTRÔLE en grand — la matière par son
 * médaillon (son identité, jamais un fond), la préparation en chiffre et en
 * jauge à dix crans, ses chapitres, et le bouton qui y mène ; puis les autres
 * contrôles, les matières en tuiles, l’acquis face au fragile, et ce que Marcel
 * a remarqué. Un écran de BILAN : le feu tricolore y est permis (décision b du
 * 23/09/2026). Offert à tous.
 */
export default function PanneauRadar({
  controles,
  couverture,
  forts,
  faibles,
  remarques,
  aujourdhui,
}: {
  controles: ControleBureau[]
  couverture: CouvertureMatiere[]
  forts: { titre: string; matiere: string }[]
  faibles: { titre: string; matiere: string }[]
  remarques: Remarque[]
  aujourdhui: string
}) {
  const [prochain, ...suivants] = controles
  const matieres = couverture
    .filter((m) => m.commences > 0)
    .sort((a, b) => b.commences - a.commences)
    .slice(0, MAX_MATIERES)

  return (
    <div className="space-y-2.5">
      {prochain ? (
        <ProchainControle controle={prochain} aujourdhui={aujourdhui} />
      ) : (
        <section className="carte flex items-center gap-3 p-3.5">
          <span className="bg-secondary text-primary grid size-12 shrink-0 place-items-center rounded-2xl">
            <Plus aria-hidden="true" className="size-6" strokeWidth={2.6} />
          </span>
          <span className="min-w-0 flex-1">
            <b className="font-heading block text-[16px] leading-tight font-extrabold">Aucun contrôle annoncé</b>
            <span className="text-muted-foreground block text-[12px] leading-snug font-semibold">
              Annonce-le dans Réviser : je prépare ton plan jusqu’au jour J.
            </span>
          </span>
          <Link href="/reviser" aria-label="Annoncer un contrôle dans Réviser" className="text-primary grid size-10 shrink-0 place-items-center">
            <ArrowRight aria-hidden="true" className="size-5" strokeWidth={2.6} />
          </Link>
        </section>
      )}

      {suivants.length > 0 ? (
        <section className="carte px-3.5 py-2" aria-label="Les contrôles suivants">
          <ul>
            {suivants.map((c, i) => (
              <li key={`${c.slug}-${c.dans}-${i}`} className={cn('flex items-center gap-3 py-2', i > 0 && 'border-secondary border-t-[1.5px]')}>
                <Vignette slug={c.slug} taille="size-9" />
                <span className="min-w-0 flex-1">
                  <b className="block truncate text-[13.5px] font-extrabold">{c.matiere}</b>
                  <span className="text-muted-foreground block truncate text-[11.5px] font-semibold">
                    {nomDuJour(aujourdhui, c.dans)} · J-{c.dans}
                  </span>
                </span>
                <b className={cn('font-heading shrink-0 text-[16px] font-extrabold', TON_TEXTE[tonPreparation(c.pret)])}>{c.pret} %</b>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="radar-matieres">
        <h2 id="radar-matieres" className="titre-section px-1 text-[16px]">Tes matières</h2>
        {matieres.length === 0 ? (
          <p className="carte text-muted-foreground mt-1.5 p-3.5 text-[12.5px] font-semibold">
            Fais un premier quiz : je saurai où tu en es.
          </p>
        ) : (
          <ul className="mt-1.5 grid grid-cols-2 gap-2">
            {matieres.map((m) => (
              <li key={m.slug} className="carte p-2.5">
                <div className="flex items-center gap-2">
                  <Vignette slug={m.slug} taille="size-9" />
                  <span className="min-w-0 flex-1 truncate text-[12.5px] leading-tight font-extrabold">{m.name}</span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <b className={cn('font-heading text-[20px] leading-none font-extrabold', TON_TEXTE[tonPreparation(m.pct)])}>{m.pct} %</b>
                  <span className="text-muted-foreground text-[10.5px] font-bold">
                    {m.commences}/{m.total} chap.
                  </span>
                </div>
                <span className="bg-secondary mt-1.5 block h-1.5 overflow-hidden rounded-full">
                  <span className={cn('block h-full rounded-full', TON_FOND[tonPreparation(m.pct)])} style={{ width: `${m.pct}%` }} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {forts.length + faibles.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          <section className="carte p-3" aria-labelledby="radar-acquis">
            <h2 id="radar-acquis" className="text-success flex items-center gap-1.5 text-[12.5px] font-extrabold">
              <CircleCheck aria-hidden="true" className="size-4" strokeWidth={2.6} />
              Acquis
            </h2>
            {forts.length === 0 ? <p className="text-muted-foreground mt-1.5 text-[11.5px] font-semibold">Bientôt.</p> : null}
            <ul className="mt-1 space-y-1">
              {forts.slice(0, 3).map((c) => (
                <li key={c.titre} className="text-[12px] leading-snug font-bold">{c.titre}</li>
              ))}
            </ul>
          </section>
          <section className="carte p-3" aria-labelledby="radar-fragile">
            <h2 id="radar-fragile" className="text-destructive flex items-center gap-1.5 text-[12.5px] font-extrabold">
              <CircleAlert aria-hidden="true" className="size-4" strokeWidth={2.6} />
              À renforcer
            </h2>
            {faibles.length === 0 ? <p className="text-muted-foreground mt-1.5 text-[11.5px] font-semibold">Rien de fragile.</p> : null}
            <ul className="mt-1 space-y-1">
              {faibles.slice(0, 3).map((c) => (
                <li key={c.titre} className="text-[12px] leading-snug font-bold">{c.titre}</li>
              ))}
            </ul>
          </section>
        </div>
      ) : null}

      {remarques.length > 0 ? (
        <section aria-labelledby="radar-remarques" className="flex items-end gap-1.5">
          <PoseMarcel pose="lit" hauteur={84} className="mb-1 shrink-0 object-contain" />
          <div className="carte min-w-0 flex-1 p-3">
            <h2 id="radar-remarques" className="text-primary text-[11.5px] font-extrabold">Marcel a remarqué</h2>
            <p className="mt-0.5 text-[12.5px] leading-snug font-bold">{remarques[0].texte}</p>
            <Button asChild size="sm" className="mt-2 rounded-full">
              <Link href={remarques[0].action.href}>
                {remarques[0].action.label}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  )
}

function ProchainControle({ controle, aujourdhui }: { controle: ControleBureau; aujourdhui: string }) {
  const ton = tonPreparation(controle.pret)
  const pleins = Math.round((controle.pret / 100) * CRANS)
  const quand = quandEnMots(aujourdhui, controle.dans)
  return (
    <section className="carte p-3.5" aria-labelledby="radar-prochain">
      <div className="flex items-center gap-3">
        <Vignette slug={controle.slug} taille="size-14" />
        <div className="min-w-0 flex-1">
          <h2 id="radar-prochain" className="font-heading truncate text-[18px] leading-tight font-extrabold">
            {controle.matiere}
          </h2>
          <p className="text-muted-foreground text-[12px] font-bold">
            Contrôle {quand} · <span className="text-primary">J-{controle.dans}</span>
          </p>
        </div>
        <div className="shrink-0 text-right">
          <b className={cn('font-heading block text-[30px] leading-none font-extrabold', TON_TEXTE[ton])}>{controle.pret} %</b>
          <span className="text-muted-foreground text-[11px] font-bold">prêt</span>
        </div>
      </div>

      <div className="mt-3 flex gap-1" role="img" aria-label={`Préparation : ${controle.pret} %`}>
        {Array.from({ length: CRANS }, (_, i) => (
          <span key={i} className={cn('h-2.5 flex-1 rounded-full', i < pleins ? TON_FOND[ton] : 'bg-secondary')} />
        ))}
      </div>

      {controle.chapitres.length > 0 ? (
        <ul className="mt-2.5 flex flex-wrap gap-1.5">
          {controle.chapitres.map((ch) => (
            <li key={ch} className="bg-secondary rounded-full px-2.5 py-1 text-[11.5px] font-extrabold">
              {ch}
            </li>
          ))}
        </ul>
      ) : null}

      {controle.slug && controle.chapitreId ? (
        <Button asChild size="lg" className="mt-3 w-full">
          <Link href={`/reviser/${controle.slug}/${controle.chapitreId}`}>
            Réviser pour {quand}
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      ) : null}
    </section>
  )
}

function Vignette({ slug, taille }: { slug: string | null; taille: string }) {
  const src = slug ? subjectVignette(slug) : null
  return (
    <span className={cn('bg-card grid shrink-0 place-items-center overflow-hidden rounded-xl border', taille)}>
      {src ? (
        // Petite vignette WebP déjà au bon format : pas d'optimiseur.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" aria-hidden="true" className="size-[85%] object-contain" />
      ) : (
        <span className="bg-secondary size-full" aria-hidden="true" />
      )}
    </span>
  )
}
