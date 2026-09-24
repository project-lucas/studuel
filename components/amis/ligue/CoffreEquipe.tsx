'use client'

import { useState } from 'react'
import { Lock } from 'lucide-react'
import CoffreDessin from '@/components/amis/CoffreDessin'
import CoffreContenu from '@/components/amis/ligue/CoffreContenu'
import OuvrirCoffre from '@/components/amis/ligue/OuvrirCoffre'
import { useMaintenant } from '@/components/amis/ligue/useMaintenant'
import Feuille from '@/components/boutique/Feuille'
import { useFermeAuMasquage } from '@/components/useFermeAuMasquage'
import {
  COFFRE_NIVEAUX,
  libelleFin,
  nombreFr,
  progressionCoffre,
  tronconsCoffre,
  type CoffrePret,
  type CoffreSemaine,
} from '@/lib/ligue'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import styles from '@/components/amis/PlaquesAmis.module.css'

// -----------------------------------------------------------------------------
// LE COFFRE D'ÉQUIPE (Lucas, 24/09/2026 : « à la place du cochon, un coffre ;
// ce coffre aura une barre de niveau, niv 1, 2, 3, 4… ; le joueur pourra
// cliquer dessus pour s'informer ; il ne pourra l'ouvrir que le lundi ; la
// barre se remplit à mesure que ses amis jouent »). Il remplace la tirelire.
//
// Toute l'XP que je gagne dans la semaine compte DEUX fois : dans ma barre de
// niveau, et dans ce coffre — celle de mes amis aussi. Une plaque de Clash
// Royale — BLEUE, pour que le coffre violet ressorte (« le violet du coffre
// sur le violet du fond, bof ») —, cernée, chiffres blancs cernés ; de haut en
// bas :
//   · le coffre d'une semaine finie, prêt à ouvrir, en billet d'or (OuvrirCoffre) ;
//   · le coffre de la semaine — on le touche pour voir ce qu'il contient
//     (CoffreContenu) —, son niveau, ma part et celle de mes amis ;
//   · la jauge à cinq jalons numérotés : les niveaux du coffre ;
//   · ce qui manque pour le niveau suivant, et « s'ouvre lundi » avec le
//     compte à rebours.
// Règle et miroir dans lib/ligue (`COFFRE_NIVEAUX`, `progressionCoffre`),
// migration 379 ; styles dans components/amis/PlaquesAmis.module.css.
// -----------------------------------------------------------------------------

export default function CoffreEquipe({
  coffre,
  prets,
  ouvrable,
  finIso,
  maintenantIso,
}: {
  coffre: CoffreSemaine
  /** Les coffres des semaines finies, pas encore ouverts. */
  prets: CoffrePret[]
  /** false tant que la migration 379 manque : on montre, on n'ouvre pas. */
  ouvrable: boolean
  /** Fin de la semaine (ISO) : le moment où ce coffre s'ouvrira. */
  finIso: string | null
  maintenantIso: string
}) {
  const [infos, setInfos] = useState(false)
  useFermeAuMasquage(setInfos, false)
  const maintenant = useMaintenant(maintenantIso)

  const { niveau, suivant } = progressionCoffre(coffre.points)
  const troncons = tronconsCoffre(coffre.points)
  const finMs = finIso ? Date.parse(finIso) : Number.NaN
  const pret = ouvrable ? (prets[0] ?? null) : null

  return (
    <div className={styles.coffre} data-teinte="bleu">
      {pret ? <OuvrirCoffre key={pret.semaine} pret={pret} /> : null}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            setInfos(true)
          }}
          aria-haspopup="dialog"
          aria-label={`Coffre d’équipe, niveau ${niveau} : voir ce qu’il contient`}
          className={styles.coffreBouton}
        >
          <CoffreDessin className="size-[68px]" />
          <span aria-hidden="true" className={styles.info}>
            i
          </span>
        </button>
        <div className="min-w-0 flex-1">
          <p className={styles.surtitre}>Coffre d’équipe</p>
          <p className="font-heading mt-0.5 leading-none font-extrabold">
            <span className={cn(styles.encre, 'text-[30px]')}>Niveau {niveau}</span>
          </p>
          {/* D'où viennent les points : ma part, celle de mes amis. */}
          <p className="mt-1.5 flex flex-wrap gap-1.5">
            <span className={styles.puce}>
              Toi <strong>+{nombreFr(coffre.xpMoi)}</strong>
            </span>
            <span className={styles.puce}>
              Tes amis <strong>+{nombreFr(coffre.partAmis)}</strong>
            </span>
          </p>
        </div>
      </div>

      {/* LA JAUGE : un tronçon et un jalon par niveau du coffre. */}
      <ol aria-label="Les niveaux du coffre" className={styles.jauge}>
        {COFFRE_NIVEAUX.map((n, i) => (
          <li key={n.niveau} className={styles.cran}>
            <span aria-hidden="true" className={styles.troncon}>
              <span className={styles.remplissage} style={{ width: `${troncons[i] * 100}%` }} />
            </span>
            <span className={styles.jalon} data-atteint={niveau >= n.niveau || undefined}>
              {n.niveau}
              <span className="sr-only">
                {` : dès ${n.seuil} XP${niveau >= n.niveau ? ', atteint' : ''}`}
              </span>
            </span>
          </li>
        ))}
      </ol>

      <p className={styles.pied}>
        <span>
          {suivant ? (
            <>
              <strong>{nombreFr(coffre.points)}</strong> / {nombreFr(suivant.seuil)}&nbsp;XP pour le niveau{' '}
              {suivant.niveau}
            </>
          ) : (
            <strong>Niveau maximum&nbsp;!</strong>
          )}
        </span>
        <span className="inline-flex items-center gap-1">
          <Lock className="size-3.5" strokeWidth={2.6} aria-hidden="true" />
          S’ouvre lundi{Number.isFinite(finMs) ? ` · dans ${libelleFin(finMs - maintenant)}` : ''}
        </span>
      </p>
      {coffre.xpMoi === 0 && coffre.points > 0 ? (
        <p className="mt-1.5 text-center text-[11.5px] font-bold text-highlight">
          Gagne de l’XP toi aussi cette semaine pour pouvoir l’ouvrir.
        </p>
      ) : null}

      <Feuille open={infos} onClose={() => setInfos(false)} label="Coffre d’équipe">
        <CoffreContenu points={coffre.points} xpMoi={coffre.xpMoi} />
      </Feuille>
    </div>
  )
}
