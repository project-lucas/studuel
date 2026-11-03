import { notFound } from 'next/navigation'
import DicteeSession from '@/components/francais/dictee/DicteeSession'
import { DICTEES_CONTENU, dicteeContenu, sessionDeContenu } from '@/lib/francais/dictee/contenu'

export const dynamic = 'force-dynamic'

// L'APERÇU D'UNE DICTÉE — en développement seulement, sans compte.
//
//   /dev/dictee                         la première dictée du contenu
//   /dev/dictee?d=louis-xvi-testament   une dictée précise
//
// La vraie session (contexte, écoute, écriture au baladeur, correction), la voix
// enregistrée ; la copie se corrige sur place et rien n'est enregistré.
export default async function ApercuDictee({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { d } = await searchParams
  const dictee = (d ? dicteeContenu(d) : null) ?? DICTEES_CONTENU[0]
  if (!dictee) notFound()
  const session = sessionDeContenu(dictee)

  return (
    <DicteeSession
      dicteeId={`apercu-${dictee.slug}`}
      titre={dictee.titre}
      segments={session.segments}
      audioIntegral={session.audioIntegral}
      contexte={session.contexte}
      retourHref="/dev/dictee"
      apercu
    />
  )
}
