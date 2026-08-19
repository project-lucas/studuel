'use client'

import { useState } from 'react'
import StandingLine from '@/components/StandingLine'
import SubjectHeader from '@/components/reviser/SubjectHeader'
import SubjectStickyBar from '@/components/reviser/SubjectStickyBar'
import ModeTabs from '@/components/reviser/ModeTabs'
import ChapterList from '@/components/reviser/ChapterList'
import TrainingPanel from '@/components/reviser/TrainingPanel'
import ReviewBanner from '@/components/reviser/ReviewBanner'
import ExamBanner from '@/components/reviser/ExamBanner'
import AnnalesPanel from '@/components/reviser/AnnalesPanel'
import AiFab from '@/components/reviser/AiFab'
import { modesFor, type ModeKey, type SubjectTemplateData } from '@/lib/subject-template'
import { examYearFor } from '@/lib/annales'

// Template GÉNÉRIQUE de page matière : valable pour toutes les matières, tout
// vient de Supabase (via le vue-modèle sérialisable calculé côté serveur).
// Header + trois onglets + vues, FAB IA. Seule interactivité : les onglets.
export default function SubjectTemplate({
  data,
  initialMode = 'programme',
}: {
  data: SubjectTemplateData
  // Onglet ouvert à l'arrivée (`?onglet=boss` depuis la feuille Modes de jeu).
  initialMode?: ModeKey
}) {
  const [mode, setMode] = useState<ModeKey>(initialMode)
  // Les onglets dépendent de la CLASSE : « Annales » n'existe que les années à
  // examen. `gradeLevel` est le niveau brut du profil (« 3e », « Tle »).
  const modes = modesFor(data.gradeLevel)
  const exam = examYearFor(data.gradeLevel)

  return (
    <div className="-mx-4 -mt-16 md:-mx-8 md:-mt-10">
      <SubjectHeader
        subject={data.subject}
        grade={data.grade}
        progress={data.progress}
        gems={data.gems}
        streak={data.streak}
        standing={
          data.standing ? (
            <StandingLine
              standing={data.standing}
              grade={data.gradeLevel}
              className="mt-0.5"
            />
          ) : null
        }
      >
        <ModeTabs modes={modes} active={mode} onChange={setMode} />
      </SubjectHeader>

      <SubjectStickyBar name={data.subject.name} progress={data.progress} />

      {/* Panneau de contenu : il chevauche le header, façon carnet. Le `key`
          rejoue la petite animation d'entrée à chaque changement d'onglet —
          la seule animation de la page. */}
      <div className="relative -mt-6 rounded-t-3xl bg-background">
        <div
          key={mode}
          className="pop-in mx-auto w-full max-w-4xl px-4 pt-5 pb-24 md:px-8"
        >
          {mode === 'programme' ? (
            <>
              <ReviewBanner count={data.weakCount} />
              {/* L'examen blanc n'apparaît ici que si l'onglet Annales n'existe
                  pas (année sans examen) — sinon c'est là-bas qu'il vit, et le
                  répéter ferait deux portes pour la même épreuve. Sans Annales,
                  il ne prend la tête que lorsqu'il a du sens (`examBannerOnTop`),
                  et attend en pied de liste le reste du temps. */}
              {!exam && data.examOnTop ? (
                <ExamBanner subject={data.subject} />
              ) : null}
              <ChapterList
                chapters={data.chapters}
                resume={data.resume}
                subjectName={data.subject.name}
                grade={data.grade}
              />
              {!exam && !data.examOnTop ? (
                <div className="mt-6">
                  <ExamBanner subject={data.subject} />
                </div>
              ) : null}
            </>
          ) : mode === 'annales' && exam ? (
            <AnnalesPanel subject={data.subject} exam={exam} papers={data.papers} />
          ) : (
            // L'onglet « Mode de jeu » porte TROIS familles, dans cet ordre :
            // le gardien de la matière (le rendez-vous), les jeux de l'arène
            // (on joue tout de suite), puis chaque chapitre avec ses formats.
            <TrainingPanel
              subject={data.subject}
              rows={data.training}
              bossPool={data.bossPool}
            />
          )}
        </div>
      </div>

      <AiFab />
    </div>
  )
}
