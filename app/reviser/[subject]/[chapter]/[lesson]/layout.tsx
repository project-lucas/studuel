import WorkTimer from '@/components/WorkTimer'

// Layout du sous-arbre leçon (hub + supports cours/révision/studygram/
// flashcards) : monte le compteur de temps de travail invisible, qui reste
// actif tant que l'élève navigue entre les supports d'une même leçon.
export default function LessonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <WorkTimer />
      {children}
    </>
  )
}
