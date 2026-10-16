'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Crown, TriangleAlert } from 'lucide-react'
import Feuille from '@/components/boutique/Feuille'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import type { EpreuveVue } from '@/lib/examen/onglet'
import type { Piege } from '@/lib/examen/pieges'
import { useCoachFil } from '@/components/marcel/CoachFil'
import { imageEpreuve } from './ListeEpreuves'

const OUTIL = (id: string) => `/images/marcel/outils/${id}.webp`

/** La durée en mots : 70 → « 1 h 10 », 20 → « 20 min ». */
function enMots(min: number): string {
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h} h ${String(m).padStart(2, '0')}` : `${h} h`
}

/**
 * UNE ÉPREUVE, EN ENTIER (maquette 3) : comment ça se passe (le temps,
 * découpé), où TU en es (trois compteurs), ce que Marcel fait pour toi, et
 * tes pièges — les chapitres où tu te trompes le plus, lus à l’ouverture.
 */
export default function FeuilleEpreuve({
  epreuve,
  ouvert,
  onClose,
  onOralBlanc,
}: {
  epreuve: EpreuveVue | null
  ouvert: boolean
  onClose: () => void
  onOralBlanc: () => void
}) {
  const { proposer } = useCoachFil()
  const [pieges, setPieges] = useState<{ pour: string; liste: Piege[] } | null>(null)
  const matieres =
    epreuve?.id === 'brevet-sciences' ? ['svt', 'physique-chimie', 'technologie'] : epreuve?.matiere ? [epreuve.matiere] : []
  const cle = epreuve && epreuve.nature === 'ecrit' ? matieres.join(',') : ''

  useEffect(() => {
    if (!cle) return
    const ctrl = new AbortController()
    fetch(`/api/examen/pieges?matieres=${encodeURIComponent(cle)}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : []))
      .then((liste: Piege[]) => setPieges({ pour: cle, liste: Array.isArray(liste) ? liste : [] }))
      .catch(() => undefined)
    return () => ctrl.abort()
  }, [cle])

  const e = epreuve
  const total = e?.temps.reduce((s, t) => s + t.minutes, 0) ?? 0
  const piegesIci = pieges?.pour === cle ? pieges.liste : null

  return (
    <Feuille open={!!e} onClose={onClose} label={e ? `L’épreuve : ${e.titre}` : 'Une épreuve'}>
      {e ? (
        <div className="space-y-2.5 pt-1">
          <header className="flex items-center gap-3 pr-12">
            <span className="bg-card grid size-14 shrink-0 place-items-center rounded-2xl ring-2 ring-[color-mix(in_oklch,var(--primary),white_82%)]">
              <Image src={imageEpreuve(e)} alt="" width={46} height={46} unoptimized className="size-[46px] object-contain" />
            </span>
            <div className="min-w-0">
              <h2 className="font-heading text-[23px] leading-none font-extrabold">{e.titre}</h2>
              <p className="text-muted-foreground mt-1 text-[12px] font-bold">
                {e.nature === 'oral' ? 'Oral' : 'Écrit'} · {e.duree}
                {e.coefficient ? ` · coefficient ${e.coefficient}` : ''}
              </p>
            </div>
          </header>

          <section className="bg-secondary/50 rounded-2xl p-3" aria-labelledby="epreuve-deroule">
            <h3 id="epreuve-deroule" className="font-heading text-[15px] font-extrabold">
              Comment ça se passe
            </h3>
            {e.temps.length > 0 ? (
              <>
                <div className="mt-2 flex h-10 overflow-hidden rounded-xl" aria-hidden="true">
                  {e.temps.map((t, i) => (
                    <span
                      key={t.quoi}
                      style={{ flex: t.minutes }}
                      className={cn(
                        'grid min-w-0 place-items-center px-1 text-center text-[10.5px] leading-[1.1] font-extrabold text-white',
                        ['bg-primary', 'bg-[color-mix(in_oklch,var(--primary),white_35%)]', 'bg-[color-mix(in_oklch,var(--primary),black_22%)]'][i % 3],
                      )}
                    >
                      <span className="truncate">{enMots(t.minutes)}</span>
                      <span className="w-full truncate font-bold opacity-90">{t.quoi}</span>
                    </span>
                  ))}
                </div>
                <p className="sr-only">
                  {e.temps.map((t) => `${enMots(t.minutes)} : ${t.quoi}`).join(', ')} — {enMots(total)} en tout.
                </p>
                {e.tempsConseil ? (
                  <p className="text-muted-foreground mt-1 text-[11px] font-bold">Le découpage que je te conseille, pas une règle.</p>
                ) : null}
              </>
            ) : null}
            <ul className="mt-2 space-y-1">
              {e.format.map((f) => (
                <li key={f} className="flex gap-2 text-[12.5px] leading-snug font-semibold">
                  <span aria-hidden="true" className="bg-primary mt-[7px] size-1.5 shrink-0 rounded-full" />
                  {f}
                </li>
              ))}
            </ul>
          </section>

          {e.nature === 'ecrit' ? (
            <section aria-labelledby="epreuve-ou" className="rounded-2xl p-0.5">
              <h3 id="epreuve-ou" className="font-heading px-1 text-[15px] font-extrabold">
                Où tu en es
              </h3>
              <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                {[
                  { v: e.chapitres ? `${e.chapitres.maitrises}/${e.chapitres.total}` : '—', l: 'chapitres maîtrisés' },
                  { v: e.annales ? `${e.annales.faites}/${e.annales.total}` : '—', l: 'sujets tombés faits' },
                  { v: String(e.blancs), l: e.blancs > 1 ? 'épreuves blanches' : 'épreuve blanche' },
                ].map((c) => (
                  <div key={c.l} className="bg-secondary rounded-2xl px-1.5 py-2 text-center">
                    <b className="font-heading text-primary block text-[19px] leading-none font-extrabold">{c.v}</b>
                    <span className="text-muted-foreground mt-0.5 block text-[10.5px] leading-tight font-bold">{c.l}</span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <section aria-labelledby="epreuve-marcel">
            <h3 id="epreuve-marcel" className="font-heading px-1 text-[15px] font-extrabold">
              Marcel t’entraîne
            </h3>
            <ul className="mt-1">
              {e.nature === 'oral' ? (
                <Action
                  image={OUTIL('oral')}
                  titre="Ton oral blanc"
                  detail="Comme le jour J : je joue le jury"
                  onClick={onOralBlanc}
                />
              ) : (
                <>
                  {e.matiere ? (
                    <Action
                      image={OUTIL('examen')}
                      titre="Simuler l’épreuve"
                      detail="Une épreuve blanche, au chrono"
                      href={`/reviser/examen-blanc?subject=${e.matiere}`}
                    />
                  ) : null}
                  {e.annales && e.matiere ? (
                    <Action
                      image={OUTIL('planning')}
                      titre="Les sujets tombés"
                      detail="Corrigés par Studuel, partie par partie"
                      href={`/reviser/${e.matiere}?onglet=annales`}
                    />
                  ) : null}
                  <Action
                    image={OUTIL('copie')}
                    titre="Corrige ma copie"
                    detail="Prends ta copie en photo, je la note"
                    couronne={!ouvert}
                    href={ouvert ? undefined : '/plus'}
                    onClick={
                      ouvert
                        ? () => {
                            onClose()
                            proposer('copie', `Corrige ma copie de ${e.titre.toLowerCase()} : `)
                          }
                        : undefined
                    }
                  />
                  {e.matiere ? (
                    <Action
                      image={OUTIL('redaction')}
                      titre="La méthode"
                      detail="Ce que le correcteur attend"
                      href={`/marcel?vue=methode&matiere=${e.matiere}`}
                    />
                  ) : null}
                </>
              )}
            </ul>
          </section>

          {e.nature === 'ecrit' && piegesIci && piegesIci.length > 0 ? (
            <section aria-labelledby="epreuve-pieges" className="bg-card rounded-2xl p-3 ring-2 ring-[color-mix(in_oklch,var(--warning),white_70%)]">
              <h3 id="epreuve-pieges" className="font-heading flex items-baseline justify-between text-[15px] font-extrabold">
                Tes pièges
                <span className="text-muted-foreground font-sans text-[11px] font-bold">d’après tes erreurs</span>
              </h3>
              <ul className="mt-1">
                {piegesIci.map((p) => (
                  <li key={p.chapitre} className="flex items-center gap-2 py-1 text-[12.5px] font-bold">
                    <TriangleAlert aria-hidden="true" className="text-warning size-4 shrink-0" strokeWidth={2.6} />
                    <span className="min-w-0 flex-1 truncate">{p.titre}</span>
                    <span className="bg-[color-mix(in_oklch,var(--warning),white_80%)] shrink-0 rounded-full px-2 py-0.5 text-[11px] font-extrabold text-[color-mix(in_oklch,var(--warning),black_45%)]">
                      {p.erreurs} erreur{p.erreurs > 1 ? 's' : ''}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/reviser/revoir" className="text-primary mt-1 inline-flex min-h-10 items-center gap-1 text-[13px] font-extrabold">
                Les revoir maintenant
                <ChevronRight aria-hidden="true" className="size-4" strokeWidth={2.6} />
              </Link>
            </section>
          ) : null}
        </div>
      ) : null}
    </Feuille>
  )
}

function Action({
  image,
  titre,
  detail,
  href,
  onClick,
  couronne = false,
}: {
  image: string
  titre: string
  detail: string
  href?: string
  onClick?: () => void
  couronne?: boolean
}) {
  const contenu = (
    <>
      <Image src={image} alt="" width={40} height={40} unoptimized className="size-10 shrink-0 object-contain" />
      <span className="min-w-0 flex-1">
        <span className="font-heading block text-[14px] leading-tight font-extrabold">{titre}</span>
        <span className="text-muted-foreground block truncate text-[11.5px] font-semibold">{detail}</span>
      </span>
      {couronne ? (
        <Crown aria-label="Avec Studuel+" className="fill-highlight text-accent-foreground size-4 shrink-0" />
      ) : (
        <ChevronRight aria-hidden="true" className="text-primary/40 size-5 shrink-0" strokeWidth={2.6} />
      )}
    </>
  )
  const classe = 'border-secondary flex min-h-14 w-full items-center gap-2.5 border-t-[1.5px] py-1.5 text-left first:border-t-0 active:opacity-80'
  return (
    <li className="[&:first-child>*]:border-t-0">
      {href ? (
        <Link href={href} className={classe} onClick={() => sfx.tap()}>
          {contenu}
        </Link>
      ) : (
        <button
          type="button"
          className={classe}
          onClick={() => {
            sfx.tap()
            onClick?.()
          }}
        >
          {contenu}
        </button>
      )}
    </li>
  )
}
