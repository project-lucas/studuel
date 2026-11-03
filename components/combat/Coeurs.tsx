import { compteCoeurs, dernierCoeur, lectureCoeurs, pertes, remplissages, QUARTS_PAR_COEUR, type Coeurs } from '@/lib/combat/coeurs'
import { cn } from '@/lib/utils'
import s from './Coeurs.module.css'

/**
 * LA RANGÉE DE CŒURS (02/11/2026) — docs/CADRAGE-COMBAT-HEROS.md § 2.
 *
 * Chaque cœur est trois calques peints (`public/images/combat/coeurs/`) : le
 * creux sombre, le cœur plein ROGNÉ au nombre de quarts qui restent, et, le
 * temps d'un coup, le morceau perdu qui blanchit puis s'éteint. Un cœur vidé
 * par le coup se BRISE : ses deux moitiés tombent en tournant.
 *
 * Tout part en même temps que l'impact de l'attaque (`delaiMs`), par
 * animation CSS : la rangée affiche tout de suite son nouvel état, et le
 * morceau perdu, posé par-dessus, le cache jusqu'à l'impact. Transform et
 * opacité seulement ; la parité du coup (`perte.id`) rejoue l'animation.
 */
export default function RangeeCoeurs({
  coeurs,
  perte,
  delaiMs = 0,
  chiffre = false,
  taille = 'md',
  nom,
}: {
  coeurs: Coeurs
  /** Le dernier coup encaissé : sa clé et la rangée d'avant. */
  perte: { id: number; avant: Coeurs } | null
  /** Quand la perte se voit : à l'impact de l'attaque. */
  delaiMs?: number
  /** Écrire le compte (« 3½ ») à côté de la rangée. */
  chiffre?: boolean
  taille?: 'sm' | 'md'
  /** Qui perd ces cœurs (lecteur d'écran). */
  nom: string
}) {
  const pleins = remplissages(coeurs)
  const { perdus, brises } = perte ? pertes(perte.avant, coeurs) : { perdus: [], brises: [] }
  const parite = perte ? (perte.id % 2 === 0 ? 'a' : 'b') : null
  const bat = dernierCoeur(coeurs)

  return (
    <div
      className={s.rangee}
      data-taille={taille}
      data-bat={bat ? 'true' : undefined}
      role="meter"
      aria-label={`Cœurs de ${nom} : ${lectureCoeurs(coeurs)}`}
      aria-valuemin={0}
      aria-valuemax={coeurs.max * QUARTS_PAR_COEUR}
      aria-valuenow={coeurs.quarts}
      style={{ ['--delai' as string]: `${delaiMs}ms` }}
    >
      {pleins.map((q, i) => {
        const perduIci = perdus[i] ?? 0
        const brise = brises.includes(i)
        const avant = q + perduIci
        return (
          <span key={i} className={cn(s.coeur, bat && q > 0 && s.battant)} aria-hidden="true">
            <span className={s.vide} />
            {q > 0 ? <span className={s.plein} style={{ clipPath: rogne(0, q) }} /> : null}
            {parite && perduIci > 0 && !brise ? (
              // Le morceau perdu : visible tel qu'avant jusqu'à l'impact, puis il
              // blanchit et s'éteint.
              <span
                key={`p${perte?.id}`}
                className={cn(s.plein, s.perdu, s[`perdu_${parite}`])}
                style={{ clipPath: rogne(q, avant) }}
              />
            ) : null}
            {parite && brise ? (
              <span key={`b${perte?.id}`} className={s.brisure}>
                <span className={cn(s.plein, s.avantBrise, s[`avantBrise_${parite}`])} style={{ clipPath: rogne(0, avant) }} />
                <span className={cn(s.moitie, s.gauche, s[`gauche_${parite}`])} />
                <span className={cn(s.moitie, s.droite, s[`droite_${parite}`])} />
                <span className={cn(s.eclats, s[`eclats_${parite}`])} />
              </span>
            ) : null}
          </span>
        )
      })}
      {chiffre ? <span className={cn(s.compte, 'font-heading font-extrabold tabular-nums')}>{compteCoeurs(coeurs)}</span> : null}
    </div>
  )
}

/** Le cœur rogné à droite : on garde de `de` à `a` quarts, comptés depuis la gauche. */
function rogne(de: number, a: number): string {
  const gauche = (de / QUARTS_PAR_COEUR) * 100
  const droite = 100 - (a / QUARTS_PAR_COEUR) * 100
  return `inset(0 ${droite}% 0 ${gauche}%)`
}
