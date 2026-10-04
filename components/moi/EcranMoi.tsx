import Link from 'next/link'
import { Settings } from 'lucide-react'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import Carnet, { type OngletCarnet } from '@/components/moi/carnet/Carnet'
import { pagesDuCarnet } from '@/components/moi/carnet/pagesMoi'
import type { IdentiteMoi } from '@/components/moi/carnet/PageIdentite'
import type { Standing } from '@/lib/percentile'
import type { FiltreClassement } from '@/lib/moi/classement'
import type { BilanCouronnes, Couronne } from '@/lib/moi/couronnes'
import type { BilanMoyenne } from '@/lib/moi/moyenne'
import type { RecordSemaine } from '@/lib/moi/record'
import type { SemaineTravail } from '@/lib/moi/temps'
import type { AmiClasse } from '@/lib/moi/classement-amis'
import type { AvatarAffiche } from '@/lib/avatar-affiche'
import type { LignePalmares } from '@/lib/palmares/palmares'
import type { BacTrajectory, TermPoint } from '@/lib/trajectoire-bac'
import styles from '@/components/moi/carnet/Bureau.module.css'

// -----------------------------------------------------------------------------
// L'ÉCRAN MOI, DESSINÉ — tout ce que la page a calculé, mis en place.
//
// Séparé de app/moi/onglet.tsx (qui lit et calcule) pour que la mise en page se
// lise d'un bloc, et se vérifie sur des données d'exemple sans compte
// (/dev/moi).
//
// LE CARNET (04/10/2026, maquette « cahier ouvert » choisie par Lucas : « le
// côté carnet avec la possibilité de tourner les pages — très important,
// l'animation doit être impeccable —, le fond autour type bureau de travail,
// la photo du user et son nom »). Un carnet à spirale posé sur un bureau :
//   · la page de garde — la photo scotchée et le nom ; en face, la série, les
//     trophées, le niveau et le travail de la semaine ;
//   · quatre intercalaires — Progrès, Amis, Collection, Palmarès — dont le
//     rôle de chaque double page est écrit dans components/moi/carnet/pagesMoi.
// Les pages tournent au doigt ou à l'onglet (components/moi/carnet/Carnet) ;
// chaque page ouvre son détail complet dans une feuille, comme les tuiles du
// tableau de bord qu'il remplace (02/10/2026). Les gemmes et l'engrenage du
// compte restent en haut, de part et d'autre de l'étiquette « Moi ».
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

/** Les intercalaires, dans l'ordre des doubles pages (la page de garde n'en a pas). */
const ONGLETS: readonly OngletCarnet[] = [
  { titre: 'Progrès', teinte: 'jaune' },
  { titre: 'Amis', teinte: 'rose' },
  { titre: 'Collection', teinte: 'vert' },
  { titre: 'Palmarès', teinte: 'violet' },
]

export default function EcranMoi(props: EcranMoiProps) {
  const { identite } = props
  const gemmes = identite?.gemmes ?? 0

  return (
    <div className={styles.bureau}>
      <div aria-hidden="true" className={styles.fond} />

      <header className={styles.entete}>
        <Link
          href="/tresor"
          aria-label={`${gemmes.toLocaleString('fr-FR')} gemmes — ouvrir la Boutique`}
          className={styles.gemmes}
        >
          <CristalIcon className="size-6" />
          {gemmes.toLocaleString('fr-FR').replace(/ /g, ' ')}
        </Link>
        <p className={styles.etiquette}>Moi</p>
        <Link href="/compte" className={styles.reglages}>
          <Settings className="size-[18px]" strokeWidth={2.4} aria-hidden="true" />
          <span className="sr-only">Réglages du compte</span>
        </Link>
      </header>

      <div className={styles.place}>
        {identite ? (
          <Carnet pages={pagesDuCarnet({ ...props, identite })} onglets={ONGLETS} label="Mon carnet" />
        ) : (
          <p className={styles.vide}>Ton carnet se prépare. Reviens dans un instant.</p>
        )}
      </div>
    </div>
  )
}
