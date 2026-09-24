import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowRight, Timer } from 'lucide-react'
import EnTetePage from '@/components/reviser/EnTetePage'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/supabase/user'
import { formatNote } from '@/lib/francais/dictee/correction'
import { NIVEAU_LABEL, normalizeNiveau } from '@/lib/francais/dictee/niveaux'
import { DICTEE_DEMO, estDemo } from '@/lib/francais/dictee/demo'

export const metadata = { title: 'Dictée — Studuel' }
export const dynamic = 'force-dynamic'

/**
 * L'ÉCRAN DE PRÉSENTATION D'UNE DICTÉE.
 *
 * L'en-tête commun de Réviser (le titre du texte, sa source, ses pastilles de
 * niveau et de durée), puis ce que l'élève a besoin de savoir avant de se
 * lancer : où il en est sur CETTE dictée, et le conseil de méthode. Un seul
 * bouton en sortie. Plus de héros marine (audit du 23/09/2026) : c'est le mur
 * crème de toute l'app, la dictée se distingue par son contenu, pas par un
 * fond à part.
 *
 * La page est en PLEIN ÉCRAN (lib/quiz-chrome : ni bandeau ni barre
 * d'onglets), elle pose donc ses propres marges sûres.
 */
export default async function PresentationDicteePage({
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
    .select('id, slug, titre, source, niveau, duree_min')
    .eq('slug', slug)
    .maybeSingle()

  // Sans la migration 318, la table n'existe pas : la dictée de démonstration
  // est servie depuis le code pour que le parcours reste parcourable.
  const dictee = enBase ?? (estDemo(slug) ? DICTEE_DEMO : null)
  if (!dictee) notFound()
  const demo = !enBase

  // La démo n'écrit rien : lui chercher une tentative enverrait un identifiant
  // non-UUID à PostgREST, qui répondrait par une erreur.
  const { data: tentatives } = demo
    ? { data: null }
    : await supabase
        .from('dictee_attempts')
        .select('note, created_at')
        .eq('user_id', user.id)
        .eq('dictee_id', dictee.id)
        .order('created_at', { ascending: false })
        .limit(1)

  const derniere = tentatives?.[0]
  const niveau = normalizeNiveau(dictee.niveau)

  return (
    <div className="flex min-h-svh flex-col px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col">
        <EnTetePage
          retour={{ fallback: '/reviser/francais/dictee', label: 'Retour aux dictées' }}
          titre={String(dictee.titre)}
          sousTitre={dictee.source ? `– ${String(dictee.source)} –` : undefined}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-extrabold text-primary-foreground">
              {NIVEAU_LABEL[niveau]}
            </span>
            <span className="flex items-center gap-1 rounded-full border bg-card px-3 py-1 text-xs font-bold text-foreground">
              <Timer className="size-3.5" aria-hidden="true" />
              {Number(dictee.duree_min)} min
            </span>
          </div>
        </EnTetePage>

        <div className="mt-6 flex flex-1 flex-col">
          {demo ? (
            <p className="mb-3 flex items-center gap-2 rounded-2xl bg-highlight/25 px-3 py-2 text-xs font-semibold text-foreground">
              <span className="rounded-full bg-highlight px-2 py-0.5 text-[11px] font-extrabold">
                Aperçu
              </span>
              Dictée de démonstration — ta note ne sera pas enregistrée.
            </p>
          ) : null}

          <p className="text-sm font-semibold text-foreground">
            {derniere
              ? `Ta dernière note : ${formatNote(Number(derniere.note))}/20.`
              : 'Tu n’as pas encore fait cette dictée.'}
          </p>

          {/* LE CONSEIL DE MÉTHODE, dit par la mascotte. Une dictée ne se joue
              pas comme un quiz : écouter le texte EN ENTIER avant d'écrire un
              mot change tout, et personne ne le devine seul. */}
          <div className="mt-8 flex items-center gap-3 rounded-3xl border bg-card p-4 shadow-sm">
            <Image
              src="/images/nav/marcel.webp"
              alt=""
              aria-hidden="true"
              width={256}
              height={256}
              sizes="72px"
              className="size-16 shrink-0 rounded-full"
            />
            <p className="min-w-0 flex-1 text-sm leading-snug font-semibold text-balance text-foreground">
              Commence par écouter la dictée en entier, puis commence à écrire.
            </p>
          </div>

          <div className="flex-1" aria-hidden="true" />

          {/* L'action principale de l'écran : le gros bouton violet de l'app,
              plus de plaque verte à part (audit du 23/09/2026). */}
          <Button asChild size="xl" className="w-full">
            <Link href={`/reviser/francais/dictee/${String(dictee.slug)}/jouer`}>
              Commencer
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
