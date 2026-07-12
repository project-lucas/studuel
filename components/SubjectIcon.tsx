import { createElement } from 'react'
import type { LucideProps } from 'lucide-react'
import { subjectIcon } from '@/lib/subject-style'

// Icône de matière rendue via createElement : subjectIcon() renvoie un
// composant Lucide défini au niveau module (jamais recréé) — ce wrapper évite
// le pattern « composant créé pendant le rendu » signalé par le lint.
export default function SubjectIcon({
  slug,
  ...props
}: LucideProps & { slug: string }) {
  return createElement(subjectIcon(slug), props)
}
