import CarteProfil, { type CarteProfilData } from '@/components/moi/CarteProfil'
import type { CompteurCarte } from '@/components/moi/CompteurVerre'
import Classement from '@/components/moi/Classement'
import TuileMoyenne from '@/components/moi/TuileMoyenne'
import Vitrine from '@/components/moi/Vitrine'
import BadgesVitrine from '@/components/moi/BadgesVitrine'
import Palmares from '@/components/moi/Palmares'
import RythmeBarres from '@/components/moi/RythmeBarres'
import TrajectoryCard from '@/components/moi/TrajectoryCard'
import OngletsMoi from '@/components/moi/OngletsMoi'
import type { Standing } from '@/lib/percentile'
import type { FiltreClassement } from '@/lib/moi/classement'
import type { BilanCouronnes, Couronne } from '@/lib/moi/couronnes'
import type { BilanMoyenne } from '@/lib/moi/moyenne'
import type { SemaineTravail } from '@/lib/moi/temps'
import type { LignePalmares } from '@/lib/palmares/palmares'
import type { BacTrajectory, TermPoint } from '@/lib/trajectoire-bac'

// -----------------------------------------------------------------------------
// L'ÉCRAN MOI, DESSINÉ — tout ce que la page a calculé, mis en place.
//
// Séparé de app/moi/page.tsx (qui lit et calcule) pour que la mise en page se
// lise d'un bloc, et se vérifie sur des données d'exemple sans compte.
//
// L'ORDRE (refonte du 17/09/2026) :
//   1. LA CARTE — qui je suis, mes quatre chiffres. Compacte : la barre des
//      onglets doit apparaître sans défiler.
//   2. LES ONGLETS, soudés sous la carte (un seul bloc violet), et collés en
//      haut en descendant :
//        Progrès    : classement · rythme · trajectoire (si notes)
//        Collection : couronnes · badges
//        Palmarès   : épreuves, duels, jeux par matière (repliés)
// -----------------------------------------------------------------------------

export type EcranMoiProps = {
  carte: {
    data: CarteProfilData
    workTitle: string
    gemmes: number
    compteurs: CompteurCarte[]
  } | null
  notes: { bilan: BilanMoyenne; terms: TermPoint[]; indisponible: boolean }
  classement: {
    /** Ma place pour chaque filtre du bloc (temps de travail, trophées). */
    mesures: Record<FiltreClassement, Standing>
    grade: string | null
    initiale: string
  }
  palmares: {
    lignes: readonly LignePalmares[]
    duels: { played: number; wins: number; trophies: number; bestTrophies: number } | null
  }
  couronnes: { liste: readonly Couronne[]; bilan: BilanCouronnes }
  /** Null : le journal quotidien (084) n'est pas en base — pas de graphique qui ment. */
  rythme: { semaines: readonly SemaineTravail[]; phrase: string } | null
  /** Null : aucune note, rien à projeter. */
  trajectoire: { trajectory: BacTrajectory; needsMigration: boolean } | null
}

export default function EcranMoi({
  carte,
  notes,
  classement,
  palmares,
  couronnes,
  rythme,
  trajectoire,
}: EcranMoiProps) {
  const badges = carte?.data.badges ?? []

  return (
    <div className="flex flex-col">
      {carte ? (
        <CarteProfil
          data={carte.data}
          workTitle={carte.workTitle}
          // La monnaie, en haut à droite de la carte — la place que le
          // bandeau lui donne sur les autres onglets. Plus de pièces (Lucas,
          // 16/09/2026) : il ne reste que les gemmes.
          monnaies={{ gemmes: carte.gemmes }}
          soudee
          compteurs={carte.compteurs}
          // LA TUILE DES NOTES, entière et cliente : la seule qui ouvre
          // quelque chose (la saisie des moyennes de trimestre).
          tuileNotes={
            <TuileMoyenne
              bilan={notes.bilan}
              terms={notes.terms}
              disabled={notes.indisponible}
            />
          }
        />
      ) : null}

      <OngletsMoi
        seule={carte === null}
        onglets={[
          {
            id: 'progres',
            label: 'Progrès',
            contenu: (
              <>
                {/* « Tu es dans le top 8 % des 5e ». Deux filtres : le temps
                    de travail (parmi les élèves du niveau, ouvert par défaut —
                    /moi est le miroir du travail fourni) et les trophées
                    (classement national de l'arène). */}
                <Classement
                  mesures={classement.mesures}
                  grade={classement.grade}
                  initiale={classement.initiale}
                />
                {rythme ? (
                  <RythmeBarres semaines={rythme.semaines} phrase={rythme.phrase} />
                ) : null}
                {trajectoire ? (
                  <TrajectoryCard
                    trajectory={trajectoire.trajectory}
                    needsMigration={trajectoire.needsMigration}
                  />
                ) : null}
              </>
            ),
          },
          {
            id: 'collection',
            label: 'Collection',
            contenu: (
              <>
                <Vitrine liste={couronnes.liste} bilan={couronnes.bilan} />
                <BadgesVitrine
                  badges={badges}
                  enAvant={carte?.data.equippedBadgeIds ?? []}
                />
              </>
            ),
          },
          {
            id: 'palmares',
            label: 'Palmarès',
            contenu: <Palmares lignes={palmares.lignes} duels={palmares.duels} />,
          },
        ]}
      />
    </div>
  )
}
