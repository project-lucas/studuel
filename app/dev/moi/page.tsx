import { notFound } from 'next/navigation'
import EcranMoi from '@/components/moi/EcranMoi'
import { DEFAULT_AVATAR } from '@/lib/avatar'
import type { BadgeState } from '@/lib/badges'
import { bilanCouronnes, couronnes, type MatiereACouronner } from '@/lib/moi/couronnes'
import { bilanMoyenne } from '@/lib/moi/moyenne'
import type { AmiClasse } from '@/lib/moi/classement-amis'
import { recordSemaine } from '@/lib/moi/record'
import { phraseRythme, rythmeHebdo, type JourTravail } from '@/lib/moi/temps'
import { standingFor } from '@/lib/percentile'
import { RANK_TIERS } from '@/lib/rank'
import { computeBacTrajectory, type TermPoint } from '@/lib/trajectoire-bac'

export const dynamic = 'force-dynamic'

// L'APERÇU DE L'ONGLET MOI — en développement seulement.
//
// Le tableau de bord (components/moi/EcranMoi) sur des données d'exemple, sans
// compte. Les actions (pseudo, badges, moyennes) et la relecture du classement
// restent muettes ici : sans session, elles n'ont nulle part où écrire.
//
//   /dev/moi                 le record en vue (2 h 40 sur 3 h 05)
//   /dev/moi?record=battu    le record tombé (3 h 20)
//   /dev/moi?record=premier  la première semaine
//   /dev/moi?record=vide     un compte neuf
//   /dev/moi?amis=0          sans ami
//   /dev/moi?amis=9          dix lignes
//   /dev/moi?notes=0         sans moyenne

const AUJOURDHUI = '2026-10-01'
const jour = (day: string, minutes: number): JourTravail => ({ day, seconds: minutes * 60 })

const SEMAINES_PASSEES: JourTravail[] = [
  jour('2026-08-18', 40),
  jour('2026-08-26', 75),
  jour('2026-09-02', 90),
  jour('2026-09-09', 130),
  jour('2026-09-14', 60),
  jour('2026-09-16', 65),
  jour('2026-09-19', 60),
  jour('2026-09-22', 50),
  jour('2026-09-25', 60),
]
const CETTE_SEMAINE: JourTravail[] = [
  jour('2026-09-28', 35),
  jour('2026-09-29', 50),
  jour('2026-09-30', 20),
  jour('2026-10-01', 55),
]

function journal(record: string | undefined): JourTravail[] {
  if (record === 'vide') return []
  if (record === 'premier') return [jour('2026-09-29', 20), jour('2026-10-01', 25)]
  if (record === 'battu') return [...SEMAINES_PASSEES, ...CETTE_SEMAINE, jour('2026-10-01', 40)]
  return [...SEMAINES_PASSEES, ...CETTE_SEMAINE]
}

const ami = (
  id: string,
  nom: string,
  portrait: string,
  trophees: number,
  tropheesSemaine: number,
  minutesSemaine: number,
  moi = false,
): AmiClasse => ({
  id,
  nom,
  portrait,
  moi,
  trophees,
  tropheesSemaine,
  secondesSemaine: minutesSemaine * 60,
  secondes: minutesSemaine * 60 * 12,
})

const AMIS: AmiClasse[] = [
  ami('lea', 'Léa', '6', 312, 12, 230),
  ami('ines', 'Inès', '11', 90, 5, 175),
  ami('malo', 'Malo', '3', 205, 4, 70),
  ami('rayan', 'Rayan', '5', 46, 30, 35),
  ami('jade', 'Jade', '4', 180, 0, 0),
  ami('noa', 'Noa', '8', 64, 9, 48),
  ami('lina', 'Lina', '10', 22, 2, 15),
  ami('tom', 'Tom', '12', 5, 5, 8),
  ami('sam', 'Sam', '13', 150, -6, 120),
]

const badge = (slug: string, title: string, icon: string, earned: boolean): BadgeState => ({
  id: slug,
  slug,
  title,
  description: title,
  icon,
  condition: { type: 'perfect_quiz' },
  earned,
  unlockedAt: earned ? '2026-09-20' : null,
})

const BADGES: BadgeState[] = [
  badge('serie-7', '7 jours de structure', '🔥', true),
  badge('temps-1h', 'Première heure', '⏱️', true),
  badge('temps-10h', '10 heures', '⏳', true),
  badge('quiz-10', 'Esprit vif', '🎯', true),
  badge('sans-faute', 'Sans faute', '⭐', true),
  badge('serie-30', '30 jours de structure', '🏆', false),
  badge('temps-100h', '100 heures', '🏅', false),
  badge('serie-100', '100 jours de structure', '💎', false),
]

const matiere = (slug: string, nom: string, maitrises: number, total: number): MatiereACouronner => ({
  subjectId: slug,
  subjectSlug: slug,
  subjectName: nom,
  chapitres: Array.from({ length: total }, (_, i) => ({
    value: i < maitrises ? 1 : 0,
    state: i < maitrises ? ('maitrise' as const) : ('a_commencer' as const),
    vuEnCours: false,
  })),
})

const MATIERES: MatiereACouronner[] = [
  matiere('maths', 'Maths', 9, 18),
  matiere('francais', 'Français', 4, 20),
  matiere('histoire-geo', 'Histoire-Géo', 7, 14),
  matiere('svt', 'SVT', 1, 12),
  matiere('physique-chimie', 'Physique-Chimie', 0, 14),
  matiere('anglais', 'Anglais', 3, 16),
]

export default async function ApercuMoi({
  searchParams,
}: {
  searchParams: Promise<{ record?: string; amis?: string; notes?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { record: etatRecord, amis: nbAmis, notes } = await searchParams

  const jours = journal(etatRecord)
  const record = recordSemaine(jours, AUJOURDHUI)
  const semaines = rythmeHebdo(jours, AUJOURDHUI)
  const neuf = etatRecord === 'vide'

  const combien = nbAmis === undefined ? 4 : Math.max(0, Math.min(AMIS.length, Number(nbAmis) || 0))
  const moi = ami('moi', 'Lucas', '7', neuf ? 0 : 128, neuf ? 0 : 8, record.secondes / 60, true)
  const joueurs = [moi, ...AMIS.slice(0, combien)]

  const terms: TermPoint[] =
    notes === '0' || neuf
      ? [
          { t: 1, avg: null, source: null },
          { t: 2, avg: null, source: null },
          { t: 3, avg: null, source: null },
        ]
      : [
          { t: 1, avg: 12.6, source: 'manuel' },
          { t: 2, avg: 13.4, source: 'manuel' },
          { t: 3, avg: null, source: null },
        ]
  const trajectory = computeBacTrajectory(terms, 62, 78)
  const listeCouronnes = couronnes(neuf ? MATIERES.map((m) => matiere(m.subjectSlug, m.subjectName, 0, m.chapitres.length)) : MATIERES)
  const badges = neuf ? BADGES.map((b) => ({ ...b, earned: false, unlockedAt: null })) : BADGES

  return (
    <div className="mx-auto w-full max-w-md pb-16">
      <EcranMoi
        identite={{
          data: {
            displayName: 'Lucas',
            gamertag: 'lucas#2607',
            gradeLabel: '3e',
            schoolName: 'Collège Jean-Moulin',
            avatar: { ...DEFAULT_AVATAR, portrait: '7' },
            profileBanner: null,
            availableBanners: [],
            rank: { tier: RANK_TIERS[0], roman: 'II', label: 'Bronze II' },
            level: neuf ? 1 : 7,
            badges,
            equippedBadgeIds: neuf ? [] : ['serie-7', 'sans-faute'],
          },
          gemmes: neuf ? 0 : 240,
          abonne: false,
        }}
        record={record}
        travail={{ total: neuf ? 0 : 27 * 3600 + 40 * 60, titre: neuf ? 'Curieux' : 'Assidu' }}
        rythme={{ semaines, phrase: phraseRythme(semaines) }}
        serie={{ jours: neuf ? 0 : 12, meilleure: neuf ? 0 : 19 }}
        trophees={{ total: moi.trophees, semaine: moi.tropheesSemaine, meilleur: neuf ? 0 : 141 }}
        notes={{ bilan: bilanMoyenne(terms), terms, indisponible: false }}
        classement={{
          mesures: neuf
            ? { travail: { kind: 'aucun' }, trophees: { kind: 'aucun' } }
            : {
                travail: standingFor({ rank: 132, total: 940 }),
                trophees: standingFor({ rank: 2140, total: 5200 }),
              },
          grade: '3e',
          initiale: 'L',
        }}
        palmares={{
          lignes: [],
          duels: neuf ? null : { played: 14, wins: 9, trophies: 128, bestTrophies: 141 },
        }}
        couronnes={{ liste: listeCouronnes, bilan: bilanCouronnes(listeCouronnes) }}
        badges={{ gagnes: badges.filter((b) => b.earned).length, total: badges.length }}
        amis={{ joueurs, complet: true, monAvatar: null }}
        trajectoire={trajectory.hasData ? { trajectory, needsMigration: false } : null}
      />
    </div>
  )
}
