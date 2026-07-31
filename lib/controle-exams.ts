// -----------------------------------------------------------------------------
// Adaptateur `controles` (203) → « contrôles à venir » (087).
//
// La migration 203 a fait du contrôle un OBJET UNIQUE (`controles` +
// `sessions_preparation`), et c'est la seule voie de création depuis
// `AddExamSheet` → `createControle`. Mais deux écrans piochaient encore dans
// l'ANCIENNE source, `profiles.upcoming_exams` (087), que plus personne
// n'alimente : le Défi (qui priorise les chapitres du prochain contrôle) et
// l'annotation des dossiers de Réviser. Résultat : un contrôle annoncé ne
// nourrissait plus ni l'un ni l'autre.
//
// Ce module traduit un `Controle` en la forme `NextExam` que ces écrans savent
// déjà consommer (`activeExams`, `examChapterIds`, `examProximity`…), et
// fusionne les deux sources tant que d'anciens `upcoming_exams` peuvent encore
// traîner en base (migration de reprise 211). Logique pure et testable.
// -----------------------------------------------------------------------------

import type { Controle } from '@/lib/prep-plan'
import type { NextExam } from '@/lib/next-exam'

// Un contrôle porte N chapitres ; chacun devient une cible de révision, comme
// le faisait 087 (un chapitre = une entrée). La date et la matière du contrôle
// sont recopiées telles quelles. `level` n'existe pas dans `controles` : il
// n'était lu nulle part côté écran (champ hérité de 087), d'où son absence.
export function controleToExams(controle: Controle): NextExam[] {
  return controle.chapters
    .filter((c) => c.id.length > 0 && c.title.length > 0)
    .map((c) => ({
      subject: controle.subject,
      chapterId: c.id,
      chapterTitle: c.title,
      date: controle.date,
    }))
}

export function controlesToExams(controles: readonly Controle[]): NextExam[] {
  return controles.flatMap(controleToExams)
}

// Fusionne la source moderne (`controles`) et l'ancienne (`upcoming_exams`),
// dédoublonnées par chapitre : **la moderne gagne**. Tant que la migration de
// reprise 211 n'est pas passée, un contrôle déclaré avant la 203 continue donc
// d'alimenter le Défi et les annotations ; une fois reprise, le doublon est
// écarté au lieu de compter deux fois.
export function mergeExamSources(
  fromControles: readonly NextExam[],
  fromLegacy: readonly NextExam[],
): NextExam[] {
  const byChapter = new Map<string, NextExam>()
  for (const exam of fromLegacy) byChapter.set(exam.chapterId, exam)
  for (const exam of fromControles) byChapter.set(exam.chapterId, exam)
  return [...byChapter.values()]
}
