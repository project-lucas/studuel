import { ChevronRight } from 'lucide-react'
import EnTeteMoi, { type IdentiteMoi } from '@/components/moi/EnTeteMoi'
import ApercuRecord, { resumeRecord } from '@/components/moi/ApercuRecord'
import TuileOuvrante from '@/components/moi/TuileOuvrante'
import Classement from '@/components/moi/Classement'
import TuileMoyenne from '@/components/moi/TuileMoyenne'
import Vitrine from '@/components/moi/Vitrine'
import BadgesVitrine from '@/components/moi/BadgesVitrine'
import Palmares from '@/components/moi/Palmares'
import RythmeBarres from '@/components/moi/RythmeBarres'
import ClassementAmis from '@/components/moi/ClassementAmis'
import TrajectoryCard from '@/components/moi/TrajectoryCard'
import FlammeAnimee from '@/components/FlammeAnimee'
import TropheeAnime from '@/components/amis/TropheeAnime'
import type { Standing } from '@/lib/percentile'
import {
  cadreClassement,
  invitationClassement,
  titreClassement,
  type FiltreClassement,
} from '@/lib/moi/classement'
import type { BilanCouronnes, Couronne } from '@/lib/moi/couronnes'
import type { BilanMoyenne } from '@/lib/moi/moyenne'
import type { RecordSemaine } from '@/lib/moi/record'
import { formatDuree, type SemaineTravail } from '@/lib/moi/temps'
import { libelleMouvement, type AmiClasse } from '@/lib/moi/classement-amis'
import type { AvatarAffiche } from '@/lib/avatar-affiche'
import type { LignePalmares } from '@/lib/palmares/palmares'
import type { BacTrajectory, TermPoint } from '@/lib/trajectoire-bac'
import { cn } from '@/lib/utils'
import styles from '@/components/moi/TableauDeBord.module.css'

// -----------------------------------------------------------------------------
// L'ÉCRAN MOI, DESSINÉ — tout ce que la page a calculé, mis en place.
//
// Séparé de app/moi/onglet.tsx (qui lit et calcule) pour que la mise en page se
// lise d'un bloc, et se vérifie sur des données d'exemple sans compte
// (/dev/moi).
//
// LE TABLEAU DE BORD (refonte du 02/10/2026, maquette « D » choisie par Lucas
// entre quatre : « je ne trouve pas l'onglet au point »). Tout d'un coup d'œil,
// en tuiles sur deux colonnes, et chaque tuile ouvre son détail :
//   · QUI JE SUIS — une ligne, plus une carte (EnTeteMoi) ;
//   · LE RECORD DE LA SEMAINE — l'anneau qui se ferme sur la meilleure semaine
//     d'avant, les sept jours ; au toucher, le rythme des huit semaines ;
//   · la SÉRIE et les TROPHÉES ;
//   · TOI ET TES AMIS — une barre par personne, au travail ou aux trophées ;
//   · MA PLACE dans mon niveau (au toucher : la foule et ses deux filtres) et
//     MA MOYENNE (au toucher : la saisie) ;
//   · la COLLECTION (couronnes, badges) et le PALMARÈS, chacun dans sa feuille ;
//   · la trajectoire, seulement quand des notes existent.
// Les trois onglets du 17/09 (Progrès · Collection · Palmarès) ont disparu :
// leurs blocs vivent dans les feuilles, entiers.
// -----------------------------------------------------------------------------

export type EcranMoiProps = {
  identite: {
    data: IdentiteMoi
    gemmes: number
    /** Studuel+ : l'avatar dessiné par Marcel s'ouvre au toucher de l'avatar. */
    abonne: boolean
  } | null
  /** La semaine en cours face à la meilleure d'avant (lib/moi/record). */
  record: RecordSemaine
  travail: {
    /** Le cumul depuis le début, en secondes — le chiffre qui ne redescend jamais. */
    total: number
    /** Le titre d'assiduité (« Assidu »), sans numéro. */
    titre: string
  }
  /** Null : le journal quotidien (084) n'est pas en base — pas de graphique qui ment. */
  rythme: { semaines: readonly SemaineTravail[]; phrase: string } | null
  serie: { jours: number; meilleure: number }
  trophees: {
    total: number
    /** Gagnés ou perdus depuis lundi ; null tant que la 465 n'est pas en base. */
    semaine: number | null
    meilleur: number
  }
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
  badges: { gagnes: number; total: number }
  /** Moi et mes amis, aux trophées et au temps de travail (lib/moi/classement-amis). */
  amis: { joueurs: readonly AmiClasse[]; complet: boolean; monAvatar: AvatarAffiche | null }
  /** Null : aucune note, rien à projeter. */
  trajectoire: { trajectory: BacTrajectory; needsMigration: boolean } | null
}

const pluriel = (n: number, mot: string) => `${n.toLocaleString('fr-FR')} ${mot}${n > 1 ? 's' : ''}`

/** Sous la série : son record, sans jamais écrire un zéro. */
function phraseSerie({ jours, meilleure }: EcranMoiProps['serie']): string {
  if (meilleure <= 0) return 'Elle démarre à ta première session'
  if (jours > 0 && jours >= meilleure) return 'C’est ton record'
  return `Ton record : ${pluriel(meilleure, 'jour')}`
}

export default function EcranMoi({
  identite,
  record,
  travail,
  rythme,
  serie,
  trophees,
  notes,
  classement,
  palmares,
  couronnes,
  badges,
  amis,
  trajectoire,
}: EcranMoiProps) {
  const equipes = identite?.data.equippedBadgeIds ?? []
  const listeBadges = identite?.data.badges ?? []

  // Ma place au temps de travail, parmi les élèves de mon niveau : c'est elle
  // que la tuile écrit (la feuille garde les deux filtres).
  const cadre = cadreClassement('travail', classement.grade)
  const place = titreClassement(classement.mesures.travail, cadre)

  const duels = palmares.duels
  const resumePalmares = duels && duels.played > 0
    ? `${pluriel(duels.played, 'duel')} · ${pluriel(duels.wins, 'victoire')}`
    : 'Tes records et tes duels'

  return (
    <div className="flex flex-col">
      {identite ? <EnTeteMoi data={identite.data} gemmes={identite.gemmes} abonne={identite.abonne} /> : null}

      <div className={styles.grille}>
        {/* --- Le record de la semaine ------------------------------------- */}
        {rythme ? (
          <TuileOuvrante
            className={cn(styles.large, styles.record)}
            etat={record.etat}
            label={`${resumeRecord(record)} Voir mon rythme.`}
            titreFeuille="Ton rythme"
            apercu={<ApercuRecord record={record} />}
          >
            <RythmeBarres semaines={rythme.semaines} phrase={rythme.phrase} nu />
            <p className="text-center text-sm font-bold text-muted-foreground">
              <span className="text-foreground">{formatDuree(travail.total)}</span> de travail depuis le
              début · {travail.titre}
            </p>
          </TuileOuvrante>
        ) : (
          // Sans le journal quotidien, la tuile n'ouvre rien : elle garde son nom
          // (le dessin, lui, est caché au lecteur d'écran).
          <div
            role="group"
            aria-label={resumeRecord(record)}
            className={cn('carte', styles.tuile, styles.large, styles.record)}
            data-etat={record.etat}
          >
            <ApercuRecord record={record} />
          </div>
        )}

        {/* --- La série, les trophées -------------------------------------- */}
        <div className={cn('carte', styles.tuile)}>
          <span className="surtitre">Série</span>
          <span className="mt-1.5 flex items-center gap-2">
            <FlammeAnimee className="size-[38px]" eteinte={serie.jours <= 0} />
            <span className={styles.grand}>
              {serie.jours}&nbsp;j
            </span>
          </span>
          <span className="mt-1.5 text-xs font-semibold text-muted-foreground">{phraseSerie(serie)}</span>
        </div>

        <div className={cn('carte', styles.tuile)}>
          <span className="surtitre">Trophées</span>
          <span className="mt-1.5 flex items-center gap-2">
            <TropheeAnime className="size-[38px]" />
            <span className={styles.grand}>{trophees.total.toLocaleString('fr-FR')}</span>
          </span>
          <span className="mt-1.5 text-xs font-semibold text-muted-foreground">
            {trophees.semaine !== null && trophees.semaine !== 0 ? (
              <>
                <span className={trophees.semaine > 0 ? 'font-extrabold text-success' : 'font-extrabold'}>
                  {libelleMouvement(trophees.semaine)}
                </span>{' '}
                cette semaine
              </>
            ) : trophees.meilleur > trophees.total ? (
              `Ton record : ${trophees.meilleur.toLocaleString('fr-FR')}`
            ) : trophees.total > 0 ? (
              'C’est ton record'
            ) : (
              'Ils se gagnent dans l’arène'
            )}
          </span>
        </div>

        {/* --- Toi et tes amis ---------------------------------------------- */}
        <ClassementAmis
          className={styles.large}
          joueurs={amis.joueurs}
          complet={amis.complet}
          monAvatar={amis.monAvatar}
        />

        {/* --- Ma place, ma moyenne ----------------------------------------- */}
        <TuileOuvrante
          label={
            place
              ? `Ton classement : ${place.grand} ${place.petit}. Voir le détail.`
              : `Ton classement : ${invitationClassement('travail').titre} Voir le détail.`
          }
          titreFeuille="Ton classement"
          apercu={
            <>
              <span className="surtitre">Ton classement</span>
              {place ? (
                <>
                  <span className={cn(styles.grand, 'mt-1.5 text-primary')}>{place.grand}</span>
                  <span className="mt-1.5 text-xs font-semibold text-muted-foreground">{place.petit}</span>
                </>
              ) : (
                <span className="mt-1.5 text-xs leading-snug font-semibold text-muted-foreground">
                  {invitationClassement('travail').titre}
                </span>
              )}
            </>
          }
        >
          <Classement mesures={classement.mesures} grade={classement.grade} initiale={classement.initiale} />
        </TuileOuvrante>

        <TuileMoyenne bilan={notes.bilan} terms={notes.terms} disabled={notes.indisponible} />

        {/* --- La collection, le palmarès ------------------------------------ */}
        <TuileOuvrante
          className={styles.large}
          label={`Ma collection : ${pluriel(couronnes.bilan.gagnees, 'couronne')}, ${pluriel(badges.gagnes, 'badge')}. Voir la collection.`}
          titreFeuille="Ma collection"
          apercu={
            <span className="flex w-full items-center gap-3">
              <span className="min-w-0 flex-1">
                <span className="font-heading block text-[19px] leading-tight font-extrabold">
                  {pluriel(couronnes.bilan.gagnees, 'couronne')}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  sur {pluriel(couronnes.bilan.matieres, 'matière')}
                </span>
              </span>
              <span aria-hidden="true" className="w-px self-stretch bg-border" />
              <span className="min-w-0 flex-1">
                <span className="font-heading block text-[19px] leading-tight font-extrabold">
                  {pluriel(badges.gagnes, 'badge')}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">sur {badges.total}</span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-primary/45" strokeWidth={3} aria-hidden="true" />
            </span>
          }
        >
          <Vitrine liste={couronnes.liste} bilan={couronnes.bilan} />
          <BadgesVitrine badges={listeBadges} enAvant={equipes} />
        </TuileOuvrante>

        <TuileOuvrante
          className={styles.large}
          label={`Mon palmarès : ${resumePalmares}. Voir le palmarès.`}
          titreFeuille="Mon palmarès"
          apercu={
            <span className="flex w-full items-center gap-3">
              <span className="font-heading min-w-0 flex-1 text-[17px] leading-tight font-extrabold">Palmarès</span>
              <span className="truncate text-xs font-semibold text-muted-foreground">{resumePalmares}</span>
              <ChevronRight className="size-4 shrink-0 text-primary/45" strokeWidth={3} aria-hidden="true" />
            </span>
          }
        >
          <Palmares lignes={palmares.lignes} duels={palmares.duels} />
        </TuileOuvrante>

        {/* --- La trajectoire : seulement s'il y a de quoi projeter ---------- */}
        {trajectoire ? (
          <div className={styles.large}>
            <TrajectoryCard trajectory={trajectoire.trajectory} needsMigration={trajectoire.needsMigration} />
          </div>
        ) : null}
      </div>
    </div>
  )
}
