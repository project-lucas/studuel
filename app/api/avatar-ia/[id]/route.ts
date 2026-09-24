import { createClient } from '@supabase/supabase-js'

// L'IMAGE D'UN AVATAR DESSINÉ (migration 378, `avatar_ia_image`) — publique :
// elle s'affiche dans la ligue et les listes d'amis des autres élèves. Un
// dessin ne change jamais sous son identifiant : cache d'un an, immuable.

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  const { id } = await params
  if (!UUID.test(id)) return new Response(null, { status: 404 })

  // Le client anonyme, sans cookies : la réponse est la même pour tous.
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data, error } = await supabase.rpc('avatar_ia_image', { p_id: id })
  if (error || typeof data !== 'string' || data.length === 0) return new Response(null, { status: 404 })

  return new Response(Buffer.from(data, 'base64'), {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
