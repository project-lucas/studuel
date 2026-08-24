import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import WorkTimer from '@/components/WorkTimer'
import { DICTEE_DEMO, estDemo } from '@/lib/francais/dictee/demo'
import DicteeSession, {
  type SegmentDictee,
} from '@/components/francais/dictee/DicteeSession'

export const metadata = { title: 'Dictée — Studuel' }
export const dynamic = 'force-dynamic'

/**
 * La session de dictée. La page ne fait que charger le texte et ses segments —
 * toute la mise en scène (écoute, support, écriture, score, correction) vit
 * dans `DicteeSession`.
 *
 * Le texte attendu n'est PAS transmis au client : seuls les segments partent,
 * et c'est le serveur qui recompose l'attendu au moment de corriger
 * (`enregistrerDictee`). L'élève a de toute façon les segments — il les
 * écoute — mais la note, elle, ne se calcule jamais avec un texte venu du
 * navigateur.
 */
export default async function JouerDicteePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const { data: enBase } = await supabase
    .from('dictees')
    .select('id, slug, titre')
    .eq('slug', slug)
    .maybeSingle()

  const dictee = enBase ?? (estDemo(slug) ? DICTEE_DEMO : null)
  if (!dictee) notFound()

  const { data: rows } = enBase
    ? await supabase
        .from('dictee_segments')
        .select('position, texte')
        .eq('dictee_id', enBase.id)
        .order('position', { ascending: true })
    : { data: null }

  const segments: SegmentDictee[] = enBase
    ? (rows ?? []).map((r) => ({
        position: Number(r.position),
        texte: String(r.texte),
      }))
    : DICTEE_DEMO.segments
  // Une dictée sans segment n'est pas jouable : mieux vaut la page « introuvable »
  // qu'un écran d'écriture sans rien à écouter.
  if (segments.length === 0) notFound()

  return (
    <>
      {/* Une dictée est du travail : le chrono compte ces minutes. */}
      <WorkTimer />
      <DicteeSession
        dicteeId={String(dictee.id)}
        titre={String(dictee.titre)}
        segments={segments}
        retourHref="/reviser/francais/dictee"
      />
    </>
  )
}
