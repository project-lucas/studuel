import { MonitorPlay, Plus, Save, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/server'
import {
  createParentVideo,
  updateParentVideo,
  deleteParentVideo,
} from '@/app/admin/actions'

export const dynamic = 'force-dynamic'

// Programme de l'espace parents : la liste de vidéos du coach scolaire.
// L'admin (le coach) la gère ici ; les parents la voient sur /parents.
type ParentVideo = {
  id: string
  title: string
  description: string | null
  url: string
  theme: string
  duration: string | null
  position: number
  published: boolean
}

export default async function AdminParentsPage() {
  const supabase = await createClient()
  const { data: videos } = await supabase
    .from('parent_videos')
    .select('*')
    .order('position', { ascending: true })
    .returns<ParentVideo[]>()

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-heading flex items-center gap-2 text-2xl font-bold">
          <MonitorPlay className="size-6" aria-hidden="true" />
          Programme parents
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Les vidéos du coach scolaire, dans l&apos;ordre où les parents les
          voient sur /parents. Décoche « publiée » pour préparer un brouillon.
        </p>
      </header>

      {/* Ajout d'une vidéo */}
      <form
        action={createParentVideo}
        className="grid gap-2 rounded-2xl border bg-card p-4 shadow-sm sm:grid-cols-2"
      >
        <Input name="title" placeholder="Titre de la vidéo" required maxLength={160} />
        <Input name="url" type="url" placeholder="https://…" required maxLength={2000} />
        <Input
          name="description"
          placeholder="Description courte (facultatif)"
          maxLength={500}
          className="sm:col-span-2"
        />
        <Input name="theme" placeholder="Thème (ex. Méthode)" maxLength={60} />
        <div className="flex gap-2">
          <Input name="duration" placeholder="Durée (ex. 8 min)" maxLength={20} />
          <Button type="submit" className="shrink-0">
            <Plus className="size-4" /> Ajouter
          </Button>
        </div>
      </form>

      {/* Vidéos existantes */}
      {(videos ?? []).length === 0 ? (
        <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          Aucune vidéo — exécute la migration 029 puis ajoute la première
          vidéo ci-dessus.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {(videos ?? []).map((video) => (
            <li key={video.id} className="rounded-2xl border bg-card p-4 shadow-sm">
              <form
                action={updateParentVideo}
                className="grid gap-2 sm:grid-cols-2"
              >
                <input type="hidden" name="id" value={video.id} />
                <Input
                  name="title"
                  defaultValue={video.title}
                  required
                  maxLength={160}
                  aria-label="Titre"
                />
                <Input
                  name="url"
                  type="url"
                  defaultValue={video.url}
                  required
                  maxLength={2000}
                  aria-label="URL"
                />
                <Input
                  name="description"
                  defaultValue={video.description ?? ''}
                  maxLength={500}
                  className="sm:col-span-2"
                  aria-label="Description"
                />
                <div className="flex gap-2">
                  <Input
                    name="theme"
                    defaultValue={video.theme}
                    maxLength={60}
                    aria-label="Thème"
                  />
                  <Input
                    name="duration"
                    defaultValue={video.duration ?? ''}
                    maxLength={20}
                    aria-label="Durée"
                  />
                  <Input
                    name="position"
                    type="number"
                    min={1}
                    defaultValue={video.position}
                    className="w-20"
                    aria-label="Position"
                  />
                </div>
                <div className="flex items-center justify-end gap-3">
                  <label className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      name="published"
                      defaultChecked={video.published}
                      className="size-4 accent-[var(--primary)]"
                    />
                    publiée
                  </label>
                  <Button type="submit" size="sm" variant="secondary">
                    <Save className="size-4" /> Enregistrer
                  </Button>
                </div>
              </form>
              <form action={deleteParentVideo} className="mt-2 flex justify-end">
                <input type="hidden" name="id" value={video.id} />
                <Button type="submit" size="sm" variant="ghost" className="text-destructive">
                  <Trash2 className="size-4" /> Supprimer
                </Button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
