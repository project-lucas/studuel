import Image from 'next/image'
import { notFound } from 'next/navigation'
import WorldBackdrop from '@/components/WorldBackdrop'
import DuelResult from '@/components/duel/DuelResult'
import VsScreen from '@/components/duel/VsScreen'
import styles from '@/components/duel/Course.module.css'
import { DEFAULT_AVATAR } from '@/lib/avatar'
import { TEINTE_MATIERE } from '@/lib/defi/modes-catalog'
import { SALONS } from '@/lib/jeux/catalog'
import { programmeSlug } from '@/lib/jeux/programme'
import { subjectVignette } from '@/lib/subject-style'
import type { DuelCourseOutcome } from '@/lib/duel/fin-course'

export const dynamic = 'force-dynamic'

// L'APERÇU DE L'ESPACE PVP — en développement seulement.
//
// La course classée ne montre son écran de fin qu'au bout de 90 s de jeu : pour
// relire le fond, les combattants, la ligue et les trophées, cette page rend
// l'écran VS ou l'écran de fin avec des données de démonstration (aucune base).
//
//   /dev/duel?m=SVT&e=vs          l'écran de la rencontre
//   /dev/duel?m=SVT&e=attente     la fin, le serveur compte encore
//   /dev/duel?m=SVT&e=defaite     la fin, perdue (+10 XP, ma place ne bouge pas)
//   /dev/duel?m=Maths&e=victoire  la fin, gagnée (14e → 11e, +8 trophées)
//   /dev/duel?e=victoire&entree=1 ma première XP de la semaine : j'entre dans la ligue
//   /dev/duel?e=victoire&ligue=0  sans ligue (migration 376 absente)
export default async function ApercuDuel({
  searchParams,
}: {
  searchParams: Promise<{ m?: string; e?: string; entree?: string; ligue?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { m = 'SVT', e = 'defaite', entree, ligue: avecLigue = '1' } = await searchParams
  const salon = SALONS.find((s) => s.subject === m) ?? SALONS[0]
  const vignette = subjectVignette(programmeSlug(salon.subject)) ?? null
  const teinte = TEINTE_MATIERE[salon.subject] ?? 'violet'
  const victoire = e === 'victoire'
  const moi = { name: 'Toi', avatar: DEFAULT_AVATAR, score: victoire ? 1000 : 678, goalAtMs: victoire ? 71_000 : null }
  const rival = { name: 'Manon', avatar: DEFAULT_AVATAR, score: victoire ? 842 : 711, goalAtMs: null, isBot: false }
  const xp = victoire ? 20 : 10
  const serveur: DuelCourseOutcome | null =
    e === 'attente'
      ? null
      : {
          saved: true,
          statut: 'verifie',
          outcome: victoire ? 'win' : 'loss',
          rival: { score: rival.score, goalAtMs: victoire ? null : 64_000 },
          stats: { score: moi.score, correct: 7, answered: 9, bestCombo: 4, goalAtMs: moi.goalAtMs },
          trophies: victoire
            ? { before: 22, after: 30, delta: 8, best: 30, total: 30 }
            : { before: 30, after: 22, delta: -8, best: 30, total: 22 },
          trophiesPause: false,
          clanPoints: victoire ? 5 : 0,
          questsCompleted: victoire ? ['duel_win'] : [],
          questDayDone: false,
          gains: [{ unite: 'xp', montant: xp }],
          replaySaved: true,
          ligue:
            avecLigue === '0'
              ? null
              : {
                  echelon: 3,
                  nom: 'Bronze 1',
                  rang: victoire ? 11 : 9,
                  rangAvant: entree === '1' ? 30 : victoire ? 14 : 10,
                  taille: 30,
                  promus: 7,
                  relegues: 5,
                  xpSemaine: 732,
                  xpAjoutee: xp,
                  entree: entree === '1',
                },
          rivalEchelon: 5,
        }

  return (
    <div className="course-scene robe-purple" data-teinte={teinte}>
      <WorldBackdrop className={styles.fond} teinte={teinte}>
        {vignette ? (
          <Image src={vignette} alt="" width={320} height={320} className={styles.filigrane} />
        ) : null}
      </WorldBackdrop>
      {e === 'vs' ? (
        <VsScreen
          me={{ name: 'Toi', avatar: DEFAULT_AVATAR, trophies: 30, caption: `30 trophées en ${salon.subject}` }}
          rival={{ name: 'Manon', avatar: DEFAULT_AVATAR, trophies: 42, caption: 'Même niveau que toi' }}
          subject={salon.subject}
          subjectEmoji={salon.emoji}
          vignette={vignette}
          count={3}
          counting={false}
        />
      ) : (
        <DuelResult
          outcome={victoire ? 'win' : 'loss'}
          server={serveur}
          recorded={e !== 'attente'}
          me={moi}
          rival={rival}
          hrefs={{ revanche: '/dev/duel', nouveau: '/dev/duel', arene: '/defi' }}
        />
      )}
    </div>
  )
}
