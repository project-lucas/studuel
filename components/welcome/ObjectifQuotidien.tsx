'use client'

import {
  DAILY_GOALS,
  heuresParMois,
  type DailyGoalMinutes,
} from '@/lib/welcome'
import { OptionGroup, OptionRow } from './OnbBits'
import styles from './ObjectifQuotidien.module.css'

/**
 * L'écran « objectif quotidien » : la flamme de la série, qui grandit avec le
 * rythme choisi, le dit dans sa bulle ; chaque rythme porte sa flamme ; en bas,
 * ce que ce rythme donne en un mois. On ne choisit pas un nombre, on choisit
 * sa semaine. Sans choix encore, c'est le rythme conseillé qui parle.
 */
export default function ObjectifQuotidien({
  choisi,
  onPick,
}: {
  choisi: DailyGoalMinutes | null
  onPick: (minutes: DailyGoalMinutes) => void
}) {
  const vedette =
    DAILY_GOALS.find((g) => g.minutes === choisi) ??
    DAILY_GOALS.find((g) => g.conseille) ??
    DAILY_GOALS[0]

  return (
    <>
      <div className={styles.scene}>
        <div className={styles.heros} aria-hidden="true">
          <span className={styles.lueur} />
          {/* La clé rejoue l'apparition à chaque changement de rythme. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={vedette.minutes}
            src={vedette.flamme}
            alt=""
            width={437}
            height={512}
            className={styles.flamme}
          />
        </div>
        <p key={vedette.minutes} className={styles.bulle} aria-live="polite">
          {vedette.pitch}
        </p>
      </div>

      <div className={styles.liste}>
        <OptionGroup label="Ton objectif quotidien" className="contents">
          {DAILY_GOALS.map((g) => (
            <OptionRow
              key={g.minutes}
              selected={choisi === g.minutes}
              onClick={() => onPick(g.minutes)}
              icon={
                <span className={styles.vignette} aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.flamme} alt="" width={437} height={512} loading="eager" />
                </span>
              }
              label={g.label}
              description={`${g.minutes} min par jour`}
              trailing={
                <span className={styles.droite}>
                  {g.conseille ? <span className={styles.conseille}>Conseillé</span> : null}
                  <span className={styles.radio} aria-hidden="true" />
                </span>
              }
            />
          ))}
        </OptionGroup>
      </div>

      <div className={styles.mois}>
        <span key={vedette.minutes} className={styles.moisChiffre}>
          {heuresParMois(vedette.minutes)}
        </span>
        <span className={styles.moisTexte}>
          de révision <b>en un mois</b>. Tu pourras changer de rythme quand tu
          veux.
        </span>
      </div>
    </>
  )
}
