import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { RAISONS_SIGNALEMENT } from '@/lib/ia-signalement'
import { marquerTraiteAction, supprimerSignalementAction } from './actions'

export const dynamic = 'force-dynamic'

// LES RÉPONSES DE MARCEL SIGNALÉES (25/10/2026, migration 597) : la question
// de l'élève, la réponse telle qu'il l'a vue, la raison. Les non traitées en
// tête. Le nom de l'élève n'est pas affiché : la réponse suffit à juger.
const formatDate = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Paris' })

type Signalement = {
  id: number
  cree_le: string
  raison: string
  question: string
  reponse: string
  traite_le: string | null
}

const LIBELLE_RAISON = Object.fromEntries(RAISONS_SIGNALEMENT.map((r) => [r.id, r.libelle]))

export default async function AdminSignalementsIaPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('ia_signalements')
    .select('id, cree_le, raison, question, reponse, traite_le')
    .order('traite_le', { ascending: false, nullsFirst: true })
    .order('cree_le', { ascending: false })
    .limit(200)
    .returns<Signalement[]>()

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="font-heading text-3xl font-extrabold">Signalements IA</h1>
        <p className="text-muted-foreground rounded-2xl border border-dashed p-6 text-sm">
          La table ne répond pas ({error.code ?? 'erreur'}) : la migration <strong>597</strong>{' '}
          (<code>schema/597_ia_signalements.sql</code>) n’est sans doute pas exécutée.
        </p>
      </div>
    )
  }

  const lignes = data ?? []
  const aTraiter = lignes.filter((l) => l.traite_le === null).length

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-3xl font-extrabold">Signalements IA</h1>
        <p className="text-muted-foreground text-sm">
          {aTraiter === 0 ? 'Rien à traiter.' : `${aTraiter} à traiter`} · {lignes.length} au total
        </p>
      </div>

      {lignes.length === 0 ? (
        <p className="text-muted-foreground rounded-2xl border border-dashed p-6 text-sm">
          Aucune réponse de Marcel n’a été signalée.
        </p>
      ) : (
        <ul className="space-y-3">
          {lignes.map((l) => (
            <li key={l.id} className={`carte space-y-2 p-4 ${l.traite_le ? 'opacity-60' : ''}`}>
              <p className="text-xs font-bold">
                <span className={l.raison === 'choquant' ? 'text-destructive' : ''}>
                  {LIBELLE_RAISON[l.raison] ?? l.raison}
                </span>
                <span className="text-muted-foreground"> · {formatDate.format(new Date(l.cree_le))}</span>
                {l.traite_le ? <span className="text-muted-foreground"> · traité</span> : null}
              </p>
              {l.question ? (
                <p className="bg-primary/10 rounded-xl px-3 py-2 text-sm whitespace-pre-wrap">{l.question}</p>
              ) : null}
              <p className="bg-secondary/60 max-h-60 overflow-y-auto rounded-xl px-3 py-2 text-sm whitespace-pre-wrap">
                {l.reponse}
              </p>
              <div className="flex gap-2">
                {l.traite_le ? null : (
                  <form action={marquerTraiteAction}>
                    <input type="hidden" name="id" value={l.id} />
                    <Button type="submit" size="sm">Traité</Button>
                  </form>
                )}
                <form action={supprimerSignalementAction}>
                  <input type="hidden" name="id" value={l.id} />
                  <Button type="submit" size="sm" variant="outline">Supprimer</Button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
