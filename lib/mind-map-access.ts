import type { SupabaseClient } from '@supabase/supabase-js'
import type { MindMapData } from '@/lib/types'

// Accès aux cartes mentales — la partie qui touche la base.
//
// Le CONTENU d'une carte (`chapters.mind_map`) est du payant : la migration 182
// en révoque la lecture pour `anon` et `authenticated`, si bien qu'une requête
// directe (`supabase.from('chapters').select('mind_map')`, faisable par
// n'importe qui avec la clé anon publique) ne renvoie plus rien. Le seul chemin
// restant est la RPC `chapter_mind_map`, qui vérifie l'abonnement côté serveur.
//
// L'EXISTENCE d'une carte n'est pas un secret (la tuile du chapitre l'affiche à
// tout le monde) : elle vit dans la colonne générée `has_mind_map`.
//
// Les deux fonctions ci-dessous tolèrent une base où les migrations 181/182 ne
// sont pas encore passées — le code doit être déployé AVANT elles, sinon
// Réviser casse le temps du déploiement.

// Chapitres (parmi `chapterIds`) qui ont une carte mentale.
export async function chaptersWithMindMap(
  supabase: SupabaseClient,
  chapterIds: string[],
): Promise<Set<string>> {
  if (chapterIds.length === 0) return new Set()

  const { data, error } = await supabase
    .from('chapters')
    .select('id, has_mind_map')
    .in('id', chapterIds)
    .returns<{ id: string; has_mind_map: boolean }[]>()

  if (!error) {
    return new Set((data ?? []).filter((c) => c.has_mind_map).map((c) => c.id))
  }

  // Repli transitoire : migration 181 pas encore exécutée (colonne absente).
  // La 182 n'est pas passée non plus, donc `mind_map` est encore lisible.
  const { data: legacy } = await supabase
    .from('chapters')
    .select('id, mind_map')
    .in('id', chapterIds)
    .returns<{ id: string; mind_map: MindMapData | null }[]>()

  return new Set((legacy ?? []).filter((c) => c.mind_map).map((c) => c.id))
}

export async function chapterHasMindMap(
  supabase: SupabaseClient,
  chapterId: string,
): Promise<boolean> {
  const withMap = await chaptersWithMindMap(supabase, [chapterId])
  return withMap.has(chapterId)
}

// Contenu d'une carte mentale. Renvoie `null` si le chapitre n'en a pas OU si
// l'appelant n'y a pas droit — l'abonnement est vérifié par la RPC, donc côté
// serveur : l'appel n'est pas contournable en bidouillant le client.
export async function fetchMindMap(
  supabase: SupabaseClient,
  chapterId: string,
): Promise<MindMapData | null> {
  const { data, error } = await supabase.rpc('chapter_mind_map', {
    p_chapter_id: chapterId,
  })

  if (!error) return (data as MindMapData | null) ?? null

  // Repli transitoire : migration 181 pas encore exécutée (RPC absente).
  const { data: legacy } = await supabase
    .from('chapters')
    .select('mind_map')
    .eq('id', chapterId)
    .maybeSingle<{ mind_map: MindMapData | null }>()

  return legacy?.mind_map ?? null
}
