'use client'

import { useState } from 'react'
import SubjectHeader from '@/components/reviser/SubjectHeader'
import ModeTabs from '@/components/reviser/ModeTabs'
import ChapterList from '@/components/reviser/ChapterList'
import ModeContentList from '@/components/reviser/ModeContentList'
import ReviewBanner from '@/components/reviser/ReviewBanner'
import ExamBanner from '@/components/reviser/ExamBanner'
import SubjectErrors from '@/components/reviser/SubjectErrors'
import SubjectBossPanel from '@/components/reviser/SubjectBossPanel'
import AiFab from '@/components/reviser/AiFab'
import {
  MODE_EMPTY_LABELS,
  type ModeKey,
  type SubjectTemplateData,
} from '@/lib/subject-template'

// Template GÉNÉRIQUE de page matière : valable pour toutes les matières, tout
// vient de Supabase (via le vue-modèle sérialisable calculé côté serveur).
// Header + onglets de modes + vues, FAB IA. Seule interactivité : les onglets.
export default function SubjectTemplate({
  data,
  initialMode = 'chapitres',
}: {
  data: SubjectTemplateData
  // Onglet ouvert à l'arrivée (`?onglet=boss` depuis la feuille Modes de jeu).
  initialMode?: ModeKey
}) {
  const [mode, setMode] = useState<ModeKey>(initialMode)

  return (
    <div className="-mx-4 -mt-16 md:-mx-8 md:-mt-10">
      <SubjectHeader
        subject={data.subject}
        grade={data.grade}
        progress={data.progress}
        gems={data.gems}
        streak={data.streak}
      >
        <ModeTabs active={mode} onChange={setMode} />
      </SubjectHeader>

      {/* Panneau de contenu : il chevauche le header, façon carnet. Le `key`
          rejoue la petite animation d'entrée à chaque changement d'onglet —
          la seule animation de la page. */}
      <div className="relative -mt-6 rounded-t-3xl bg-background">
        <div
          key={mode}
          className="pop-in mx-auto w-full max-w-4xl px-4 pt-5 pb-24 md:px-8"
        >
          {mode === 'chapitres' ? (
            <>
              <ReviewBanner count={data.weakCount} />
              <ExamBanner subject={data.subject} />
              <ChapterList
                chapters={data.chapters}
                isNew={data.isNew}
                subjectName={data.subject.name}
                grade={data.grade}
              />
            </>
          ) : mode === 'erreurs' ? (
            <SubjectErrors erreurs={data.erreurs} subjectSlug={data.subject.slug} />
          ) : mode === 'boss' ? (
            <SubjectBossPanel
              subjectSlug={data.subject.slug}
              pool={data.bossPool}
            />
          ) : (
            <ModeContentList
              groups={data.modes[mode]}
              emptyLabel={MODE_EMPTY_LABELS[mode]}
            />
          )}
        </div>
      </div>

      <AiFab />
    </div>
  )
}
