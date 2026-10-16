'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { subjectVignette } from '@/lib/subject-style'
import type { OngletExamenVue } from '@/lib/examen/onglet-server'
import HerosExamen from './HerosExamen'
import GestesSemaine from './GestesSemaine'
import ListeEpreuves from './ListeEpreuves'
import DossierOral from './DossierOral'
import Simulateur from './Simulateur'
import JourJ from './JourJ'

/**
 * L’ONGLET EXAMEN DU BUREAU DE MARCEL (16/10/2026, maquettes de
 * assets-sources/maquettes/marcel-examen.html) — seulement en 3e, 1re et
 * terminale. Il répond à quatre questions, dans l’ordre : où j’en suis
 * (HerosExamen), qu’est-ce que je fais cette semaine (GestesSemaine),
 * qu’est-ce qui m’attend (ListeEpreuves, chaque épreuve s’ouvre), et l’oral
 * (DossierOral, avec l’oral blanc). En terminale, le simulateur « Ce qu’il
 * te faut en juin ». À J-7, il devient le jour J (JourJ).
 *
 * Offert : le compte à rebours, les étapes, les épreuves, les sujets tombés,
 * le simulateur et le jour J (rien n’appelle le modèle). Studuel+ : le plan de
 * la semaine, le dossier d’oral, les oraux blancs, la correction de copie.
 */
export default function PanneauExamen({ vue, ouvert }: { vue: OngletExamenVue; ouvert: boolean }) {
  // Le hasard du tirage de l’oral blanc, fixé au toucher (`null` = fermé).
  const [oralBlanc, setOralBlanc] = useState<number | null>(null)
  const ouvrirOralBlanc = () => setOralBlanc(Math.random())
  const allerALOral = () => {
    document.getElementById('dossier-oral')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    if (ouvert && vue.pieces.length > 0) ouvrirOralBlanc()
  }

  const dossier = (
    <DossierOral
      examen={vue.examen.id}
      pieces={vue.pieces}
      disponible={vue.dossierDisponible}
      ouvert={ouvert}
      specialites={vue.specialites}
      oralBlanc={oralBlanc}
      ouvrirOralBlanc={ouvrirOralBlanc}
      fermerOralBlanc={() => setOralBlanc(null)}
    />
  )

  return (
    <div className="space-y-2.5">
      {vue.jourJ ? (
        <>
          <JourJ examen={vue.examen.id} nom={vue.examen.nom} jours={vue.jours} />
          <ListeEpreuves epreuves={vue.epreuves} ouvert={ouvert} onOralBlanc={allerALOral} />
          {dossier}
        </>
      ) : (
        <>
          <HerosExamen nom={vue.examen.nom} periode={vue.examen.periode} jours={vue.jours} phase={vue.phase} preparation={vue.preparation} />
          <GestesSemaine gestes={vue.gestes} ouvert={ouvert} />
          {vue.notes ? <Simulateur initial={vue.notes} /> : null}
          <ListeEpreuves epreuves={vue.epreuves} ouvert={ouvert} onOralBlanc={allerALOral} />
          {dossier}
          {vue.sujets.length > 0 ? (
            <section className="carte p-3.5" aria-labelledby="examen-sujets">
              <div className="flex items-baseline justify-between gap-2">
                <h2 id="examen-sujets" className="font-heading text-[17px] font-extrabold">
                  Les sujets tombés
                </h2>
                <span className="text-muted-foreground text-[11.5px] font-extrabold">corrigés par Studuel</span>
              </div>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {vue.sujets.map((s) => {
                  const vignette = subjectVignette(s.matiere)
                  return (
                    <li key={s.matiere}>
                      <Link
                        href={`/reviser/${s.matiere}?onglet=annales`}
                        className="bg-card inline-flex min-h-10 items-center gap-1.5 rounded-xl py-1 pr-2.5 pl-1 text-[12px] font-extrabold ring-[1.5px] ring-[color-mix(in_oklch,var(--primary),white_82%)] active:translate-y-px"
                      >
                        {vignette ? <Image src={vignette} alt="" width={24} height={24} unoptimized className="size-6" /> : null}
                        {s.nom}
                        <span className="text-muted-foreground font-bold">
                          {s.faits}/{s.total}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </section>
          ) : null}
        </>
      )}
    </div>
  )
}
