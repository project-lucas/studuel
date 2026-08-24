import { Fragment } from 'react'
import { lireFormule, formuleEnTexte } from '@/lib/carnet/formules'

/**
 * Rend un texte qui peut contenir des notations mathématiques.
 *
 * Les exposants et indices simples (« x^2 », « H_2O ») sont déjà devenus des
 * caractères Unicode dans la logique pure : ils arrivent ici comme du texte et
 * ne coûtent rien. Seuls les trois cas qui demandent une vraie mise en page —
 * fraction en pile, racine, exposant complexe — produisent du balisage.
 *
 * `aria-label` porte la formule à plat : un lecteur d'écran doit entendre
 * « 3/4 », pas « 3 » puis « 4 » sur deux lignes sans lien.
 */
export default function Formule({
  texte,
  className,
}: {
  texte: string
  className?: string
}) {
  const segments = lireFormule(texte)
  const aPlat = formuleEnTexte(texte)
  const aDuBalisage = segments.some((s) => s.type !== 'texte')

  if (!aDuBalisage) {
    return <span className={className}>{aPlat}</span>
  }

  return (
    <span className={className} aria-label={aPlat}>
      {segments.map((s, i) => {
        if (s.type === 'texte') {
          return <Fragment key={i}>{s.valeur}</Fragment>
        }
        if (s.type === 'fraction') {
          return (
            <span
              key={i}
              aria-hidden="true"
              className="mx-0.5 inline-flex flex-col items-center align-middle leading-none"
            >
              <span className="px-1 text-[0.8em]">{s.numerateur}</span>
              <span className="my-0.5 h-px w-full bg-current" />
              <span className="px-1 text-[0.8em]">{s.denominateur}</span>
            </span>
          )
        }
        if (s.type === 'racine') {
          return (
            <span key={i} aria-hidden="true" className="whitespace-nowrap">
              √
              <span className="border-t border-current pt-0.5">{s.valeur}</span>
            </span>
          )
        }
        // Exposant / indice trop riches pour l'Unicode (« x^{a+b} »).
        return (
          <span key={i} aria-hidden="true" className="whitespace-nowrap">
            {s.base}
            <span
              className={
                s.type === 'exposant'
                  ? 'align-super text-[0.7em]'
                  : 'align-sub text-[0.7em]'
              }
            >
              {s.valeur}
            </span>
          </span>
        )
      })}
    </span>
  )
}
