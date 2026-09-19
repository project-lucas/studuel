import type { CSSProperties, ReactNode } from 'react'
import type { BlocScratch, CategorieScratch, DocScratch } from '@/lib/exercices/types'
import { cn } from '@/lib/utils'
import { etatCible, propsCible, type ZonesDoc } from '../commun'
import s from '../manuel.module.css'

/**
 * LES BLOCS SCRATCH — reproduits aux couleurs de Scratch 3, que les élèves
 * retrouvent en salle informatique. Une dérogation de palette de plus, et la
 * plus évidente : un bloc « avancer » qui ne serait pas bleu ne serait plus
 * un bloc Scratch. Les « (10) » du texte deviennent des cases blanches.
 */
const COULEURS: Record<CategorieScratch, string> = {
  evenement: 'oklch(0.83 0.16 85)',
  mouvement: 'oklch(0.66 0.15 255)',
  apparence: 'oklch(0.6 0.19 295)',
  son: 'oklch(0.66 0.2 330)',
  controle: 'oklch(0.78 0.16 70)',
  capteur: 'oklch(0.72 0.1 225)',
  operateur: 'oklch(0.7 0.15 145)',
  variable: 'oklch(0.73 0.17 55)',
  stylo: 'oklch(0.7 0.13 165)',
}

function Libelle({ texte }: { texte: string }) {
  const parts: ReactNode[] = []
  const re = /\(([^)]*)\)|\[([^\]]*)\]/g
  let dernier = 0
  let m: RegExpExecArray | null
  let k = 0
  while ((m = re.exec(texte))) {
    if (m.index > dernier) parts.push(<span key={k++}>{texte.slice(dernier, m.index)}</span>)
    parts.push(
      <span key={k++} className={cn(s.entree, m[2] !== undefined && '!rounded-[0.3rem]')}>
        {m[1] ?? m[2]}
      </span>,
    )
    dernier = m.index + m[0].length
  }
  if (dernier < texte.length) parts.push(<span key={k++}>{texte.slice(dernier)}</span>)
  return <>{parts}</>
}

function Bloc({ b, zones, premier }: { b: BlocScratch; zones?: ZonesDoc; premier: boolean }) {
  const etat = etatCible(b.id, zones)
  const style = { ['--bloc' as string]: COULEURS[b.categorie] } as CSSProperties
  const classesEtat = cn(
    zones?.actif && b.id && s.blocTouchable,
    etat === 'choisie' && s.blocChoisi,
    etat === 'juste' && s.blocJuste,
    etat === 'fausse' && s.blocFaux,
  )
  if (b.interieur) {
    return (
      <div className={cn(s.bouche, classesEtat)} style={style} {...propsCible(b.id, zones, b.texte)}>
        <div className={cn(s.bloc, s.blocTete)} style={style}>
          <Libelle texte={b.texte} />
        </div>
        <div className={s.boucheCorps}>
          <Pile blocs={b.interieur} zones={zones} />
        </div>
        {b.sinon ? (
          <>
            <div className={cn(s.bloc, s.blocTete)} style={style}>
              sinon
            </div>
            <div className={s.boucheCorps}>
              <Pile blocs={b.sinon} zones={zones} />
            </div>
          </>
        ) : null}
      </div>
    )
  }
  const chapeau = premier && b.categorie === 'evenement'
  return (
    <div className={cn(s.bloc, chapeau && s.chapeau, classesEtat)} style={style} {...propsCible(b.id, zones, b.texte)}>
      <Libelle texte={b.texte} />
    </div>
  )
}

function Pile({ blocs, zones, racine = false }: { blocs: BlocScratch[]; zones?: ZonesDoc; racine?: boolean }) {
  return (
    <div className={s.pile}>
      {blocs.map((b, i) => (
        <Bloc key={i} b={b} zones={zones} premier={racine && i === 0} />
      ))}
    </div>
  )
}

export function Scratch({ doc, zones }: { doc: DocScratch; zones?: ZonesDoc }) {
  return (
    <div className={s.scratch}>
      {doc.scripts.map((script, i) => (
        <Pile key={i} blocs={script} zones={zones} racine />
      ))}
    </div>
  )
}
