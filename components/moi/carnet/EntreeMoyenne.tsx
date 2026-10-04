'use client'

import { useState } from 'react'
import { SaisieMoyennesSheet } from '@/components/moi/SaisieMoyennes'
import { useFermeAuMasquage } from '@/components/useFermeAuMasquage'
import { formatMoyenne, phraseDelta, type BilanMoyenne } from '@/lib/moi/moyenne'
import type { TermPoint } from '@/lib/trajectoire-bac'
import { sfx } from '@/lib/sounds'
import styles from '@/components/moi/carnet/Pages.module.css'

/**
 * MA MOYENNE, sur la page Progrès du carnet : la note du dernier trimestre et
 * son sens ; au toucher, la saisie des moyennes (la même feuille qu'avant).
 */
export default function EntreeMoyenne({
  bilan,
  terms,
  disabled,
}: {
  bilan: BilanMoyenne
  terms: readonly TermPoint[]
  /** La migration 187 n'est pas passée : la saisie n'a nulle part où aller. */
  disabled: boolean
}) {
  const [ouvert, setOuvert] = useState(false)
  useFermeAuMasquage(setOuvert, false)
  const moyenne = formatMoyenne(bilan)
  const fleche = bilan.delta === null || bilan.precedent === null ? '' : bilan.delta > 0 ? ' ↗' : bilan.delta < 0 ? ' ↘' : ' →'

  if (disabled) {
    return (
      <div className={styles.bloc}>
        <span className={styles.etiquette}>Ma moyenne</span>
        <span className={styles.petit}>Bientôt</span>
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOuvert(true)
        }}
        aria-haspopup="dialog"
        aria-label={moyenne ? `Ma moyenne : ${moyenne} sur 20. Modifier mes moyennes.` : 'Ajouter mes moyennes de trimestre'}
        className={styles.bloc}
      >
        <span className={styles.etiquette}>Ma moyenne</span>
        {moyenne ? (
          <>
            <span className={styles.chiffre}>
              {moyenne}
              <span className={styles.sur}>/20{fleche}</span>
            </span>
            <span className={styles.petit}>{phraseDelta(bilan) ?? 'ce trimestre'}</span>
          </>
        ) : (
          <span className={styles.aEcrire}>+ Ajoute tes notes</span>
        )}
      </button>
      <SaisieMoyennesSheet open={ouvert} onClose={() => setOuvert(false)} terms={terms} />
    </>
  )
}
