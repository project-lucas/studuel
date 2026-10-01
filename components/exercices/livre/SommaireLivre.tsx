import Link from 'next/link'
import { Check, Lock } from 'lucide-react'
import type { Livre } from '@/lib/exercices/livre'
import { Etoiles } from '../Etoiles'
import s from './livre.module.css'

/**
 * Le SOMMAIRE du manuel : les chapitres du thème et leurs pages, chacune avec
 * son numéro, ses étoiles et son état. Sert dans le tiroir de la liseuse et en
 * bas de la page du cahier. Une page verrouillée se voit mais ne s'ouvre pas.
 */
export default function SommaireLivre({
  livre,
  courante,
  onChoisir,
}: {
  livre: Livre
  /** La page ouverte, mise en avant (chapitre + position). */
  courante?: { chapitreId: string; position: number }
  /** Appelé au toucher d'une page (le tiroir se referme). */
  onChoisir?: () => void
}) {
  return (
    <nav aria-label={`Sommaire du manuel : ${livre.titre}`}>
      {livre.sections.map((section) => (
        <section key={section.id} className={s.section}>
          <h3 className={s.sectionTitre}>
            <strong>{section.titre}</strong>
            <span>
              {section.debut === section.fin ? `p. ${section.debut}` : `p. ${section.debut}–${section.fin}`}
            </span>
          </h3>
          {section.pages.map((p) => {
            const actuelle = courante?.chapitreId === p.chapitreId && courante.position === p.position
            const contenu = (
              <>
                <span className={s.entreeNumero}>p. {p.numero}</span>
                <span className={s.entreeTitre}>{p.titre}</span>
                <Etoiles n={p.etoiles} />
                {p.etat === 'reussi' ? (
                  <Check className="size-4 shrink-0 text-[var(--success)]" strokeWidth={3} aria-label="Réussi" />
                ) : p.etat === 'verrouille' ? (
                  <Lock className="size-4 shrink-0 text-[var(--muted-foreground)]" aria-label="À débloquer" />
                ) : null}
              </>
            )
            return p.etat === 'verrouille' ? (
              <div key={p.numero} className={s.entree} data-etat="verrouille" aria-current={actuelle ? 'page' : undefined}>
                {contenu}
              </div>
            ) : (
              <Link
                key={p.numero}
                href={p.href}
                className={s.entree}
                data-etat={p.etat}
                aria-current={actuelle ? 'page' : undefined}
                onClick={onChoisir}
              >
                {contenu}
              </Link>
            )
          })}
        </section>
      ))}
    </nav>
  )
}
