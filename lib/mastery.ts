// MODULE PUR — aucun accès à la base, aucune dépendance serveur.
//
// Il l'était presque : la seule fonction qui lisait la base,
// `getChapterMastery`, vivait ici et tirait avec elle `lib/catalog` (cache
// serveur + client supabase-js) et `lib/mastery-inputs`. Or ce module est
// aussi importé par des composants CLIENT (SubjectsHome, le catalogue des
// salons via ModesSheet) pour ses seuils et ses règles : chaque écran qui les
// affichait embarquait donc le client Supabase du navigateur — près de 60 Ko
// compressés sur l'arène, Réviser, Marcel et le quiz, pour trois constantes et
// deux fonctions pures. La lecture vit désormais dans `lib/mastery-server.ts`.

// Progression par chapitre :
// - quiz terminé → meilleur score (0..1), seul moyen de dépasser 30 %
// - leçon terminée → plancher de 30 % (LESSON_FLOOR)
// L'élève voit que chaque geste paye, et la source distingue les états
// (une leçon lue n'est pas un quiz raté : pas de « fragile » injustifié).

export const LESSON_FLOOR = 0.3
export const MASTERY_THRESHOLDS = { mastered: 0.8, fragile: 0.5 } as const

export type ChapterProgress = {
  value: number // 0..1, ce qui remplit les barres
  quizAttempted: boolean
  lessonDone: boolean
}

export type ChapterMastery = Map<string, ChapterProgress>

export type ChapterState = 'maitrise' | 'en_cours' | 'fragile' | 'a_commencer'

export function chapterState(p: ChapterProgress | undefined): ChapterState {
  // « À commencer » = aucun geste posé. Un quiz TENTÉ (même échoué 0/10) est une
  // progression : il doit remonter en « fragile » (priorité à revoir), pas se
  // faire masquer — sinon l'élève en difficulté disparaît du radar.
  if (!p || (p.value === 0 && !p.lessonDone && !p.quizAttempted))
    return 'a_commencer'
  if (!p.quizAttempted) return 'en_cours' // leçon lue, quiz pas encore tenté
  if (p.value >= MASTERY_THRESHOLDS.mastered) return 'maitrise'
  if (p.value >= MASTERY_THRESHOLDS.fragile) return 'en_cours'
  return 'fragile' // quiz tenté mais < 50 % : à retravailler en priorité
}

// Rang de maîtrise façon jeu compétitif — même donnée que chapterState, mais
// présentée comme un rang à monter. Au-delà de « maîtrisé » (or), deux rangs
// de prestige tirent vers l'excellence : diamant (≥ 90 %) et légendaire (100 %).
// Le bronze récompense le premier geste (leçon lue) ; les rangs supérieurs
// exigent un quiz — lire ne suffit pas pour grimper.

export type MasteryRank = 'bronze' | 'argent' | 'or' | 'diamant' | 'legendaire'

// Habillage des rangs pour l'UI (carnet, célébrations…) : un seul vocabulaire
// visuel pour toute l'app.
export const MASTERY_RANK_LABEL: Record<MasteryRank, string> = {
  bronze: 'Bronze',
  argent: 'Argent',
  or: 'Or',
  diamant: 'Diamant',
  legendaire: 'Légendaire',
}

export const MASTERY_RANK_EMOJI: Record<MasteryRank, string> = {
  bronze: '🥉',
  argent: '🥈',
  or: '🥇',
  diamant: '💎',
  legendaire: '🏆',
}

// Rang d'une valeur agrégée (moyenne de matière, 0..1) — mêmes paliers que
// masteryRank, sans la nuance leçon/quiz qui n'a pas de sens sur une moyenne.
// null tant que rien n'est commencé (pas de rang « vide » culpabilisant).
export function rankForValue(value: number): MasteryRank | null {
  if (value <= 0) return null
  if (value >= 1) return 'legendaire'
  if (value >= 0.9) return 'diamant'
  if (value >= MASTERY_THRESHOLDS.mastered) return 'or'
  if (value >= MASTERY_THRESHOLDS.fragile) return 'argent'
  return 'bronze'
}

export function masteryRank(
  p: ChapterProgress | undefined,
): MasteryRank | null {
  // Idem chapterState : un quiz tenté à 0 vaut « bronze », pas « pas de rang ».
  if (!p || (p.value === 0 && !p.lessonDone && !p.quizAttempted)) return null
  if (!p.quizAttempted) return 'bronze'
  if (p.value >= 1) return 'legendaire'
  if (p.value >= 0.9) return 'diamant'
  if (p.value >= MASTERY_THRESHOLDS.mastered) return 'or'
  if (p.value >= MASTERY_THRESHOLDS.fragile) return 'argent'
  return 'bronze'
}

// Assemblage pur : des meilleurs scores par quiz et des leçons terminées vers
// la maîtrise par chapitre. Séparé de l'accès base pour être testable — et
// partagé par le chemin rapide (charpente en cache) et le repli.
export function assembleMastery(
  bestByQuiz: Map<string, number>,
  completedLessons: Set<string>,
  quizLessons: Map<string, string>,
  chapterByLesson: Map<string, string>,
): ChapterMastery {
  const mastery: ChapterMastery = new Map()

  const upsert = (chapterId: string, patch: Partial<ChapterProgress>) => {
    const current = mastery.get(chapterId) ?? {
      value: 0,
      quizAttempted: false,
      lessonDone: false,
    }
    mastery.set(chapterId, {
      value: Math.max(current.value, patch.value ?? 0),
      quizAttempted: current.quizAttempted || (patch.quizAttempted ?? false),
      lessonDone: current.lessonDone || (patch.lessonDone ?? false),
    })
  }

  // Scores de quiz.
  for (const [quizId, ratio] of bestByQuiz) {
    const lessonId = quizLessons.get(quizId)
    if (!lessonId) continue
    const chapterId = chapterByLesson.get(lessonId)
    if (!chapterId) continue
    upsert(chapterId, { value: ratio, quizAttempted: true })
  }

  // Plancher des leçons terminées.
  for (const lessonId of completedLessons) {
    const chapterId = chapterByLesson.get(lessonId)
    if (!chapterId) continue
    upsert(chapterId, { value: LESSON_FLOOR, lessonDone: true })
  }

  return mastery
}
