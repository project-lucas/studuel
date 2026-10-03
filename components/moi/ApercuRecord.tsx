import { Star } from 'lucide-react'
import { anneauRecord, libellesRecord, type RecordSemaine } from '@/lib/moi/record'
import { formatDuree } from '@/lib/moi/temps'
import styles from '@/components/moi/TableauDeBord.module.css'

// -----------------------------------------------------------------------------
// LE RECORD DE LA SEMAINE, DESSINÉ — la grande tuile qui ouvre le tableau de
// bord (lib/moi/record). Un anneau qui se ferme sur le record : le travail de
// la semaine au cœur, le record à battre à côté, ce qui manque dans la
// pastille, les sept jours dessous. Quand le record tombe, l'avance s'écrit en
// or par-dessus l'anneau plein et la tuile se cercle d'or.
//
// Composant serveur : un SVG statique et des mots, rien à embarquer.
// -----------------------------------------------------------------------------

const RAYON = 52
const TOUR = 2 * Math.PI * RAYON
const INITIALES_JOURS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'] as const
const NOMS_JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'] as const

/** Ce que la tuile dit d'une traite, pour le lecteur d'écran. */
export function resumeRecord(record: RecordSemaine): string {
  const mots = libellesRecord(record)
  const cible = record.etat === 'vide' ? '' : ` ${mots.sourcil} : ${mots.cible}.`
  return `${mots.valeur} de travail cette semaine.${cible} ${mots.pastille}.`
}

export default function ApercuRecord({ record }: { record: RecordSemaine }) {
  const mots = libellesRecord(record)
  const { fait, surplus } = anneauRecord(record)
  const aUnRecord = record.etat === 'en_course' || record.etat === 'battu'
  const maxJour = Math.max(0, ...record.jours.map((j) => j.secondes))

  return (
    <>
      <span className={styles.anneau} aria-hidden="true">
        <svg viewBox="0 0 124 124">
          <circle className={styles.anneauPiste} cx="62" cy="62" r={RAYON} fill="none" strokeWidth="13" />
          {fait > 0 ? (
            <circle
              className={styles.anneauFait}
              cx="62"
              cy="62"
              r={RAYON}
              fill="none"
              strokeWidth="13"
              strokeLinecap="round"
              strokeDasharray={`${fait * TOUR} ${TOUR}`}
              transform="rotate(-90 62 62)"
            />
          ) : null}
          {surplus > 0 ? (
            <circle
              className={styles.anneauSurplus}
              cx="62"
              cy="62"
              r={RAYON}
              fill="none"
              strokeWidth="13"
              strokeLinecap="round"
              strokeDasharray={`${surplus * TOUR} ${TOUR}`}
              transform="rotate(-90 62 62)"
            />
          ) : null}
          {aUnRecord ? (
            <g>
              <circle className={styles.anneauFanion} cx="62" cy="10" r="9" />
              <path className={styles.anneauFanionTrait} d="M59.5 5.5v9M60 6h6l-1.6 2.3L66 10.6h-6z" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          ) : null}
        </svg>
        <span className={styles.anneauCoeur}>
          <span className={styles.anneauValeur}>{mots.valeur}</span>
          <span className="mt-0.5 text-[10.5px] font-extrabold text-muted-foreground">cette semaine</span>
        </span>
      </span>

      <span className="block min-w-0 flex-1" aria-hidden="true">
        <span className="surtitre block">{mots.sourcil}</span>
        <span className={`${styles.cible} block`}>{mots.cible}</span>
        <span className={styles.pastille} data-ton={mots.ton}>
          {mots.ton === 'battu' ? <Star className="size-3.5 fill-current" strokeWidth={0} /> : null}
          {mots.pastille}
        </span>
        <span className={styles.jours}>
          {record.jours.map((j, i) => (
            <span
              key={NOMS_JOURS[i]}
              className={styles.jour}
              data-aujourdhui={j.aujourdhui || undefined}
              data-a-venir={j.aVenir || undefined}
              title={j.aVenir ? undefined : `${NOMS_JOURS[i]} : ${formatDuree(j.secondes)}`}
            >
              <span className={styles.jourFut}>
                <span
                  className={styles.jourBarre}
                  style={
                    j.aVenir || maxJour <= 0
                      ? undefined
                      : { height: `${Math.round((j.secondes / maxJour) * 100)}%` }
                  }
                />
              </span>
              {INITIALES_JOURS[i]}
            </span>
          ))}
        </span>
      </span>
    </>
  )
}
