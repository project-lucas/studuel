import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Check, ChevronRight, Timer } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { formatNote } from '@/lib/francais/dictee/correction'
import { NIVEAU_LABEL, type NiveauDictee } from '@/lib/francais/dictee/niveaux'
import { DICTEE_DEMO } from '@/lib/francais/dictee/demo'

export const metadata = { title: 'Les dictées — Studuel' }
export const dynamic = 'force-dynamic'

/**
 * LA LISTE DES DICTÉES.
 *
 * Une carte par texte : le titre, sa source, son niveau, sa durée. Quand
 * l'élève l'a déjà faite, la carte porte sa DERNIÈRE NOTE — c'est ce qui
 * transforme une liste de contenus en tableau de bord, et ce qui donne envie de
 * refaire celle où l'on a eu 9.
 */
export default async function DicteesPage() {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) redirect('/login')

  const [{ data: dictees }, { data: tentatives }] = await Promise.all([
    supabase
      .from('dictees')
      .select('id, slug, titre, source, niveau, duree_min, premium')
      .order('position', { ascending: true })
      .limit(100),
    // Toutes ses tentatives, la plus récente d'abord : la première rencontrée
    // pour une dictée est donc sa dernière note.
    supabase
      .from('dictee_attempts')
      .select('dictee_id, note, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(500),
  ])

  const derniereNote = new Map<string, number>()
  for (const t of tentatives ?? []) {
    const id = String(t.dictee_id)
    if (!derniereNote.has(id)) derniereNote.set(id, Number(t.note ?? 0))
  }

  // REPLI SUR LA DÉMO. Sans la migration 318, la table n'existe pas et la
  // requête échoue en silence : la liste serait vide, et on ne saurait pas si
  // c'est le contenu ou le code qui manque. La démo est servie depuis le code,
  // et signalée comme telle.
  const vraies = dictees ?? []
  const enDemo = vraies.length === 0
  const liste = enDemo
    ? [
        {
          id: DICTEE_DEMO.id,
          slug: DICTEE_DEMO.slug,
          titre: DICTEE_DEMO.titre,
          source: DICTEE_DEMO.source,
          niveau: DICTEE_DEMO.niveau,
          duree_min: DICTEE_DEMO.duree_min,
          premium: DICTEE_DEMO.premium,
        },
      ]
    : vraies

  return (
    <div className="mx-auto w-full max-w-xl">
      <Link
        href="/reviser"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Réviser
      </Link>

      <h1 className="font-heading text-3xl font-extrabold text-foreground">
        Les dictées
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Le moyen le plus efficace de te tester.
      </p>

      {/* Le badge « Aperçu » — règle du projet : jamais de données de
          démonstration sans le dire. Un élève qui croirait avoir fait une vraie
          dictée chercherait sa note dans son historique et ne la trouverait
          pas : elle n'est écrite nulle part. */}
      {enDemo ? (
        <p className="mt-3 flex items-center gap-2 rounded-2xl bg-highlight/25 px-3 py-2 text-xs font-semibold text-foreground">
          <span className="rounded-full bg-highlight px-2 py-0.5 text-[11px] font-extrabold">
            Aperçu
          </span>
          Une seule dictée de démonstration — sa note n’est pas enregistrée.
        </p>
      ) : null}

      {liste.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-muted/40 px-4 py-8 text-center text-sm text-muted-foreground">
          Aucune dictée pour l’instant — elles arrivent.
        </p>
      ) : (
        <ul className="mt-5 flex flex-col gap-3">
          {liste.map((d) => {
            const note = derniereNote.get(String(d.id))
            const faite = note !== undefined
            return (
              <li key={String(d.id)}>
                <Link
                  href={`/reviser/francais/dictee/${String(d.slug)}`}
                  className="quiz-plaque relative w-full flex-col items-start gap-2 px-4 py-4 text-left [--plaque-bas:color-mix(in_oklab,var(--card),black_4%)] [--plaque-bord:color-mix(in_oklab,var(--foreground),white_72%)] [--plaque-haut:var(--card)]"
                >
                  {d.premium ? (
                    <span className="absolute -top-px right-4 rounded-b-lg bg-destructive px-2.5 py-1 text-[11px] font-extrabold text-white">
                      Premium
                    </span>
                  ) : null}

                  <span className="flex w-full items-start gap-3">
                    <span className="min-w-0 flex-1">
                      <span className="font-heading block text-lg leading-snug font-extrabold text-balance text-foreground">
                        {String(d.titre)}
                      </span>
                      {d.source ? (
                        <span className="mt-0.5 block text-sm text-muted-foreground">
                          – {String(d.source)}
                        </span>
                      ) : null}
                    </span>

                    {/* LA DERNIÈRE NOTE prend la place du chevron : c'est elle
                        qu'on vient chercher quand on a déjà fait la dictée. */}
                    {faite ? (
                      <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-sm font-extrabold text-success tabular-nums">
                        <Check className="size-4" strokeWidth={3} aria-hidden="true" />
                        {formatNote(note)}/20
                      </span>
                    ) : (
                      <ChevronRight
                        className="size-5 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                    )}
                  </span>

                  <span className="flex items-center gap-3">
                    <span className="rounded-full bg-primary/12 px-2.5 py-1 text-xs font-extrabold text-primary">
                      {NIVEAU_LABEL[String(d.niveau) as NiveauDictee] ??
                        String(d.niveau)}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                      <Timer className="size-3.5" aria-hidden="true" />
                      {Number(d.duree_min)} min
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
