import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { getGradeChaptersCached, getSubjectsCached } from '@/lib/catalog'
import { construireIndex } from '@/lib/reviser/recherche-globale'

// L'INDEX DES FICHES DE LA CLASSE, pour la loupe globale de l'accueil Réviser
// (components/reviser/LoupeGlobale, 12/10/2026). Une ligne par fiche — id,
// titre, matière —, quelques dizaines de Ko, lu quand la loupe s'ouvre et gardé
// en mémoire par le navigateur ; la recherche elle-même est synchrone.
//
// Route GET et pas Server Action (elles s'exécutent une par une) ; tout vient
// du cache serveur du catalogue (`unstable_cache`, 5 min) : zéro aller-retour
// Supabase la plupart du temps, hors la classe du profil.
export async function GET(): Promise<Response> {
  const user = await getCurrentUser()
  if (!user) return new Response(null, { status: 401 })

  const supabase = await createClient()
  const [{ data: profil }, matieres] = await Promise.all([
    supabase
      .from('profiles')
      .select('grade_level')
      .eq('id', user.id)
      .maybeSingle<{ grade_level: string | null }>(),
    getSubjectsCached(),
  ])
  if (!profil?.grade_level) return new Response(null, { status: 404 })

  const chapitres = await getGradeChaptersCached(profil.grade_level)
  const index = construireIndex(matieres, chapitres)
  return Response.json(index, {
    // Privé (la classe est celle du profil) et bref : le catalogue bouge peu.
    headers: { 'Cache-Control': 'private, max-age=300' },
  })
}
