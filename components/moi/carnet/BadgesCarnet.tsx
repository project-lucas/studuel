'use client'

import { useState } from 'react'
import BadgeIcone from '@/components/BadgeIcone'
import Feuille from '@/components/boutique/Feuille'
import { useFermeAuMasquage } from '@/components/useFermeAuMasquage'
import type { BadgeState } from '@/lib/badges'
import { sfx } from '@/lib/sounds'
import styles from '@/components/moi/carnet/Pages.module.css'

/**
 * LES BADGES DU CARNET (05/10/2026, Lucas : « je n'aime pas le fond blanc, je
 * veux voir les illustrations pleines et plus grandes, et on doit pouvoir
 * cliquer pour comprendre comment gagner les suivantes, donc il faut les
 * ombres »).
 *
 * Plus de pastille blanche : le dessin du badge, en grand, à même le papier.
 * Un badge pas encore gagné est son OMBRE — la même silhouette, noircie — :
 * on voit qu'il existe et ce qu'il représente, sans l'avoir. Toucher un badge,
 * gagné ou non, ouvre sa fiche : son nom, et comment on l'obtient.
 *
 * Les gagnés d'abord, puis les ombres, `max` au plus sur la page.
 */
export default function BadgesCarnet({ badges, max }: { badges: readonly BadgeState[]; max: number }) {
  const [vu, setVu] = useState<BadgeState | null>(null)
  useFermeAuMasquage(setVu, null)

  const ranges = [...badges].sort((a, b) => Number(b.earned) - Number(a.earned)).slice(0, max)

  return (
    <>
      <ul className={styles.badgesGrille}>
        {ranges.map((b, i) => (
          <li key={b.id}>
            <button
              type="button"
              onClick={() => {
                sfx.tap()
                setVu(b)
              }}
              aria-label={b.earned ? `${b.title} — gagné` : `${b.title} — à gagner : ${b.description}`}
              className={styles.badgeCase}
              data-gagne={b.earned || undefined}
              style={b.earned ? { rotate: `${((i * 37) % 11) - 5}deg` } : undefined}
            >
              <BadgeIcone slug={b.slug} icon={b.icon} tailleImage="size-full" className={styles.badgeDessin} />
            </button>
          </li>
        ))}
      </ul>

      <Feuille open={vu !== null} onClose={() => setVu(null)} label={vu?.title ?? 'Badge'}>
        {vu ? (
          <div className="flex flex-col items-center gap-3 px-2 pt-8 pb-4 text-center">
            <span className={styles.badgeFiche} data-gagne={vu.earned || undefined}>
              <BadgeIcone slug={vu.slug} icon={vu.icon} tailleImage="size-full" className={styles.badgeDessin} />
            </span>
            <h2 className="font-heading text-2xl font-extrabold">{vu.title}</h2>
            <p className="max-w-xs text-base font-semibold text-muted-foreground">{vu.description}</p>
            <span
              className={
                vu.earned
                  ? 'rounded-full bg-highlight px-3 py-1 text-sm font-extrabold'
                  : 'rounded-full bg-secondary px-3 py-1 text-sm font-extrabold text-primary'
              }
            >
              {vu.earned
                ? `Gagné${vu.unlockedAt ? ` le ${new Date(vu.unlockedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}` : ''}`
                : 'Pas encore gagné'}
            </span>
          </div>
        ) : null}
      </Feuille>
    </>
  )
}
