import { Fragment, type ReactNode } from 'react'
import { decouper, texteDuBloc, type Jeton } from '@/lib/exercices/mots'
import type { DocDialogue, DocTexte } from '@/lib/exercices/types'
import { cn } from '@/lib/utils'
import { etatCible, Fraction, type ZonesDoc } from '../commun'
import s from '../manuel.module.css'

/**
 * Les jetons d'une suite de chaînes, numérotés d'un bout à l'autre — le MÊME
 * parcours que le compilateur (lib/exercices/compiler, motsMarques) : c'est ce
 * qui garantit que le mot touché porte le numéro rangé dans la clé.
 */
export function jetonsNumerotes(chaines: string[]): Jeton[][] {
  let index = 0
  return chaines.map((c) => {
    const { jetons, suivant } = decouper(c, index)
    index = suivant
    return jetons
  })
}

/** Rend des jetons ; les mots se touchent quand une question le demande. */
export function Mots({ jetons, zones }: { jetons: Jeton[]; zones?: ZonesDoc }) {
  return (
    <>
      {jetons.map((j, k) => {
        if (j.kind === 'fraction') return <Fraction key={k} num={j.num} den={j.den} />
        const style = cn(j.gras && 'font-extrabold', j.italique && 'italic')
        if (j.kind === 'sep') return <span key={k} className={style || undefined}>{j.texte}</span>
        const id = `m${j.index}`
        const etat = etatCible(id, zones)
        const classes = cn(
          s.mot,
          style,
          zones?.actif && s.motTouchable,
          etat === 'choisie' && s.motChoisi,
          etat === 'juste' && s.motJuste,
          etat === 'fausse' && s.motFaux,
        )
        if (zones?.actif)
          return (
            <span
              key={k}
              role="button"
              tabIndex={0}
              aria-pressed={zones.choisies.has(id)}
              className={classes}
              onClick={() => zones.basculer(id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  zones.basculer(id)
                }
              }}
            >
              {j.texte}
            </span>
          )
        return (
          <span key={k} className={etat ? classes : style || undefined}>
            {j.texte}
          </span>
        )
      })}
    </>
  )
}

export function Texte({ doc, zones, portee }: { doc: DocTexte; zones?: ZonesDoc; portee?: number[] }) {
  const tous = jetonsNumerotes(doc.blocs.map(texteDuBloc))
  const garde = (i: number) => !portee || portee.includes(i)

  if (doc.genre === 'poeme') {
    // Le numéro de chaque vers (les lignes vides séparent les strophes).
    const numeros: number[] = []
    let compte = 0
    for (const b of doc.blocs) {
      if (texteDuBloc(b).trim()) compte += 1
      numeros.push(compte)
    }
    return (
      <div className={cn(s.texte, s.poeme)}>
        {doc.blocs.map((b, i) => {
          const t = texteDuBloc(b)
          if (!t.trim()) return garde(i) ? <div key={i} className={s.strophe} /> : null
          if (!garde(i)) return null
          const vers = numeros[i]
          return (
            <div key={i} className={s.vers}>
              <span className={s.repere} aria-hidden="true">
                {vers === 1 || vers % 5 === 0 ? vers : ''}
              </span>
              <span>
                <Mots jetons={tous[i]} zones={zones} />
              </span>
            </div>
          )
        })}
        {doc.auteur ? <Auteur auteur={doc.auteur} /> : null}
      </div>
    )
  }

  if (doc.genre === 'theatre') {
    return (
      <div className={s.texte}>
        {doc.blocs.map((b, i) => {
          if (!garde(i)) return null
          if (typeof b === 'object' && 'personnage' in b)
            return (
              <p key={i} className="mb-2 last:mb-0">
                <span className={s.personnage}>{b.personnage}</span>
                <span aria-hidden="true"> — </span>
                <Mots jetons={tous[i]} zones={zones} />
              </p>
            )
          return (
            <p key={i} className={cn('mb-2 last:mb-0', typeof b === 'object' && s.didascalie)}>
              <Mots jetons={tous[i]} zones={zones} />
            </p>
          )
        })}
        {doc.auteur ? <Auteur auteur={doc.auteur} /> : null}
      </div>
    )
  }

  const numeroter = doc.blocs.length > 1 && doc.genre !== 'consigne'
  return (
    <div className={cn(s.texte, doc.genre === 'lettre' && 'font-[Georgia,serif]')}>
      {doc.blocs.map((b, i) =>
        garde(i) ? (
          <div key={i} className={numeroter ? s.paragraphe : 'mb-2 last:mb-0'}>
            {numeroter ? (
              <span className={s.repere} aria-hidden="true">
                {i + 1}
              </span>
            ) : null}
            <p>
              <Mots jetons={tous[i]} zones={zones} />
            </p>
          </div>
        ) : null,
      )}
      {doc.auteur ? <Auteur auteur={doc.auteur} /> : null}
    </div>
  )
}

function Auteur({ auteur }: { auteur: string }) {
  return <p className="mt-2 text-right text-[0.78rem] font-bold text-[var(--encre-douce)]">{auteur}</p>
}

/** Un dialogue : SMS (bulles de messagerie) ou bulles de bande dessinée. */
export function Dialogue({ doc, zones }: { doc: DocDialogue; zones?: ZonesDoc }) {
  const tous = jetonsNumerotes(doc.repliques.map((r) => r.texte))
  const cote = new Map(doc.participants.map((p) => [p.nom, p] as const))
  let precedent = ''
  const lignes: ReactNode[] = []
  doc.repliques.forEach((r, i) => {
    const p = cote.get(r.qui)
    const droite = p?.cote === 'droite'
    const nouveau = r.qui !== precedent
    precedent = r.qui
    lignes.push(
      <Fragment key={i}>
        {nouveau ? (
          <span
            className={cn(
              'mt-1 flex items-center gap-1 text-[0.7rem] font-extrabold tracking-wide text-[var(--encre-douce)] uppercase',
              droite ? 'self-end' : 'self-start',
            )}
          >
            {p?.emoji ? <span aria-hidden="true">{p.emoji}</span> : null}
            {r.qui}
          </span>
        ) : null}
        <div
          className={cn(
            s.bulle,
            droite ? s.bulleDroite : s.bulleGauche,
            doc.modele === 'bulles' && 'border-2 border-[var(--foreground)]/70 !bg-white',
          )}
        >
          <Mots jetons={tous[i]} zones={zones} />
        </div>
      </Fragment>,
    )
  })
  return <div className="flex flex-col gap-1.5">{lignes}</div>
}
