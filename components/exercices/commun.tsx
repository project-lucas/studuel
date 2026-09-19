import type { CSSProperties, ReactNode } from 'react'
import { decouper } from '@/lib/exercices/mots'
import type { Motif, Teinte } from '@/lib/exercices/types'
import s from './manuel.module.css'

/** La couleur d'une teinte de document (variable du module manuel). */
export function couleur(t: Teinte | undefined, defaut: Teinte = 'encre'): string {
  return `var(--t-${t ?? defaut})`
}

/** La même, assombrie : le contour d'une surface peinte dans cette teinte. */
export function couleurFoncee(t: Teinte | undefined, defaut: Teinte = 'encre', part = 35): string {
  return `color-mix(in oklch, var(--t-${t ?? defaut}), black ${part}%)`
}

/** La même, éclaircie (aplat de fond, motif « clair »). */
export function couleurClaire(t: Teinte | undefined, defaut: Teinte = 'encre', part = 72): string {
  return `color-mix(in oklch, var(--t-${t ?? defaut}), white ${part}%)`
}

/**
 * Le remplissage d'une surface selon son motif. Les hachures et les points
 * sont des <pattern> déclarés une fois par SVG (MotifsSvg), un par teinte.
 */
export function remplissage(t: Teinte | undefined, motif: Motif | undefined, id: string): string {
  switch (motif) {
    case 'hachures':
      return `url(#${id}-h-${t ?? 'encre'})`
    case 'points':
      return `url(#${id}-p-${t ?? 'encre'})`
    case 'clair':
      return couleurClaire(t)
    case 'aucun':
      return 'none'
    default:
      return couleur(t)
  }
}

/** Les motifs (hachures, points) des teintes utilisées dans un SVG. */
export function MotifsSvg({ id, teintes, echelle = 1 }: { id: string; teintes: Teinte[]; echelle?: number }) {
  const uniques = [...new Set(teintes)]
  const pas = 6 * echelle
  return (
    <defs>
      {uniques.map((t) => (
        <g key={t}>
          <pattern id={`${id}-h-${t}`} width={pas} height={pas} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width={pas} height={pas} style={{ fill: couleurClaire(t, 'encre', 82) }} />
            <line x1={0} y1={0} x2={0} y2={pas} style={{ stroke: couleur(t) }} strokeWidth={1.6 * echelle} />
          </pattern>
          <pattern id={`${id}-p-${t}`} width={pas} height={pas} patternUnits="userSpaceOnUse">
            <rect width={pas} height={pas} style={{ fill: couleurClaire(t, 'encre', 84) }} />
            <circle cx={pas / 2} cy={pas / 2} r={1.1 * echelle} style={{ fill: couleur(t) }} />
          </pattern>
        </g>
      ))}
    </defs>
  )
}

// --------------------------------------------------------------- le texte

/**
 * Le texte d'un exercice, avec sa mise en forme légère : `**gras**`,
 * `*italique*`, `{{3/4}}` (fraction en étage) et les retours à la ligne.
 */
export function Inline({ texte, className }: { texte: string; className?: string }) {
  const lignes = texte.split('\n')
  return (
    <span className={className}>
      {lignes.map((ligne, n) => (
        <span key={n}>
          {n > 0 ? <br /> : null}
          {morceaux(ligne)}
        </span>
      ))}
    </span>
  )
}

function morceaux(ligne: string): ReactNode[] {
  const out: ReactNode[] = []
  let tampon = ''
  let style = { gras: false, italique: false }
  const vider = (k: number) => {
    if (!tampon) return
    const contenu = tampon
    tampon = ''
    if (style.gras && style.italique)
      out.push(
        <strong key={k} className="font-extrabold">
          <em>{contenu}</em>
        </strong>,
      )
    else if (style.gras)
      out.push(
        <strong key={k} className="font-extrabold">
          {contenu}
        </strong>,
      )
    else if (style.italique) out.push(<em key={k}>{contenu}</em>)
    else out.push(contenu)
  }
  decouper(ligne).jetons.forEach((j, k) => {
    if (j.kind === 'fraction') {
      vider(k * 2)
      out.push(<Fraction key={k * 2 + 1} num={j.num} den={j.den} />)
      return
    }
    if (j.gras !== style.gras || j.italique !== style.italique) {
      vider(k * 2)
      style = { gras: j.gras, italique: j.italique }
    }
    tampon += j.texte
  })
  vider(-1)
  return out
}

export function Fraction({ num, den }: { num: string; den: string }) {
  return (
    <span className={s.fraction} aria-label={`${num} sur ${den}`}>
      <span>{num}</span>
      <span>{den}</span>
    </span>
  )
}

// --------------------------------------------------------------- les zones

/**
 * Ce qu'une question « zone » confie à un document : quelles cibles sont
 * choisies, comment basculer une cible, et — une fois la question finie —
 * lesquelles étaient justes.
 */
export type ZonesDoc = {
  /** Les cibles se touchent (la question est en cours). */
  actif: boolean
  choisies: ReadonlySet<string>
  basculer: (id: string) => void
  /** Correction : les bonnes cibles (vert). */
  justes?: ReadonlySet<string>
}

export type EtatCible = 'choisie' | 'juste' | 'fausse' | null

export function etatCible(id: string | undefined, z: ZonesDoc | undefined): EtatCible {
  if (!z || !id) return null
  if (z.justes) {
    if (z.justes.has(id)) return 'juste'
    if (z.choisies.has(id)) return 'fausse'
    return null
  }
  return z.choisies.has(id) ? 'choisie' : null
}

/** Les attributs d'un élément SVG ou HTML touchable. */
export function propsCible(
  id: string | undefined,
  z: ZonesDoc | undefined,
  libelle: string,
): Record<string, unknown> {
  if (!z?.actif || !id) return {}
  return {
    role: 'button',
    tabIndex: 0,
    'aria-pressed': z.choisies.has(id),
    'aria-label': libelle,
    onClick: () => z.basculer(id),
    onKeyDown: (e: { key: string; preventDefault: () => void }) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        z.basculer(id)
      }
    },
  }
}

/** La couleur de trait d'une cible selon son état (SVG). */
export function traitCible(etat: EtatCible): CSSProperties | undefined {
  if (etat === 'choisie') return { stroke: 'var(--zone-choisie)', strokeWidth: 3 }
  if (etat === 'juste') return { stroke: 'var(--zone-juste)', strokeWidth: 3 }
  if (etat === 'fausse') return { stroke: 'var(--zone-fausse)', strokeWidth: 3 }
  return undefined
}

export function fondCible(etat: EtatCible): string | undefined {
  if (etat === 'choisie') return 'color-mix(in oklch, var(--zone-choisie), white 65%)'
  if (etat === 'juste') return 'color-mix(in oklch, var(--zone-juste), white 60%)'
  if (etat === 'fausse') return 'color-mix(in oklch, var(--zone-fausse), white 65%)'
  return undefined
}

// --------------------------------------------------------------- les dates

/** « 3000 av. J.-C. », « 476 », « 1er janvier » non : une année seule. */
export function annee(n: number, court = false): string {
  if (n < 0) return court ? `−${Math.abs(n)}` : `${Math.abs(n)} av. J.-C.`
  return String(n)
}

/** Un nombre écrit à la française (virgule, espace fine des milliers). */
export function nombreFr(n: number): string {
  const arrondi = Math.round(n * 1000) / 1000
  const [e, d] = String(Math.abs(arrondi)).split('.')
  const groupes = e.length > 4 ? e.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : e
  return `${arrondi < 0 ? '−' : ''}${groupes}${d ? `,${d}` : ''}`
}
