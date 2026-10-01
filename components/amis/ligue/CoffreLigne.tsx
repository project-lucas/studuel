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
  libelleFin,
  nombreFr,
  partsCoffre,
  progressionCoffre,
  type CoffrePret,
  type CoffreSemaine,
} from '@/lib/ligue'
import { sfx } from '@/lib/sounds'
import styles from '@/components/amis/PlaquesAmis.module.css'

// -----------------------------------------------------------------------------
// LE COFFRE D'ÉQUIPE, EN LIGNE (maquette « A », validée par Lucas le
// 01/10/2026). Il a été une plaque bleue à cinq jalons, qui disait le niveau
// sans dire d'où venaient les points. Dans le bloc refait, le héros est le
// multiplicateur et ses dix places ; le coffre tient sur une ligne, et sa barre
// se lit en DEUX PARTS — la mienne en violet, celle de mes amis en or : c'est
// elle qui montre que les amis remplissent le coffre.
//
// Rien ne change dans la mécanique (lib/ligue, migration 379) :
//   · toute l'XP de la semaine, la mienne et celle de mes amis, y compte ;
//   · il s'ouvre le lundi — le coffre d'une semaine finie reste en tête, en
//     billet d'or (OuvrirCoffre) ;
//   · on le touche pour voir ce que contient chaque niveau (CoffreContenu).
// -----------------------------------------------------------------------------

export default function CoffreLigne({
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
  const parts = partsCoffre(coffre)
  const finMs = finIso ? Date.parse(finIso) : Number.NaN
  const pret = ouvrable ? (prets[0] ?? null) : null

  return (
    <div className={styles.coffreLigne}>
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
          <CoffreDessin className="size-[58px]" />
          <span aria-hidden="true" className={styles.info}>
            i
          </span>
        </button>

        <div className="min-w-0 flex-1">
          <p className="flex items-center justify-between gap-2 text-[11px] font-extrabold text-muted-foreground">
            <span className="tracking-wide whitespace-nowrap uppercase">Coffre d’équipe</span>
            <span className="inline-flex min-w-0 items-center gap-1 whitespace-nowrap">
              <Lock className="size-3" strokeWidth={2.8} aria-hidden="true" />
              Lundi{Number.isFinite(finMs) ? ` · ${libelleFin(finMs - maintenant)}` : ''}
            </span>
          </p>
          <p className="mt-0.5 flex items-baseline gap-2">
            <span className="font-heading text-lg leading-tight font-extrabold whitespace-nowrap">
              Niveau {niveau}
            </span>
            <span className="text-xs font-semibold whitespace-nowrap text-muted-foreground tabular-nums">
              {suivant
                ? `${nombreFr(coffre.points)} / ${nombreFr(suivant.seuil)} XP`
                : 'Niveau maximum !'}
            </span>
          </p>
          <div
            role="progressbar"
            aria-label={
              suivant
                ? `Coffre d’équipe : ${coffre.points} XP sur ${suivant.seuil} pour le niveau ${suivant.niveau}`
                : 'Coffre d’équipe : niveau maximum'
            }
            aria-valuemin={0}
            aria-valuemax={suivant?.seuil ?? Math.max(coffre.points, 1)}
            aria-valuenow={coffre.points}
            className="mt-1.5 flex h-3 overflow-hidden rounded-full bg-muted"
          >
            <span className="h-full bg-primary" style={{ width: `${parts.moi}%` }} />
            <span className="h-full bg-highlight" style={{ width: `${parts.amis}%` }} />
          </div>
          {coffre.points > 0 ? (
            <p className="mt-1.5 flex flex-wrap gap-x-3 text-xs font-semibold text-muted-foreground tabular-nums">
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden="true" className="size-2 rounded-full bg-primary" />
                Toi {nombreFr(coffre.xpMoi)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden="true" className="size-2 rounded-full bg-highlight" />
                Tes amis {nombreFr(coffre.partAmis)}
              </span>
            </p>
          ) : (
            <p className="mt-1.5 text-xs font-semibold text-muted-foreground">
              Tes amis y versent toute leur XP de la semaine.
            </p>
          )}
        </div>
      </div>

      {coffre.xpMoi === 0 && coffre.points > 0 ? (
        <p className="mt-2 text-center text-[11.5px] font-bold text-warning">
          Gagne de l’XP toi aussi cette semaine pour pouvoir l’ouvrir.
        </p>
      ) : null}

      <Feuille open={infos} onClose={() => setInfos(false)} label="Coffre d’équipe">
        <CoffreContenu points={coffre.points} xpMoi={coffre.xpMoi} />
      </Feuille>
    </div>
  )
}
