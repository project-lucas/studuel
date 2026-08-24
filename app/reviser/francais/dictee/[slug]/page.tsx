import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, ArrowRight, Timer } from 'lucide-react'
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
 * Un héros sombre — le texte y est le sujet, pas l'interface — puis ce que
 * l'élève a besoin de savoir avant de se lancer : où il en est sur CETTE
 * dictée, et le conseil de méthode. Un seul bouton en sortie.
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
    <div className="flex min-h-svh flex-col">
      {/* LE HÉROS. Fond marine : la dictée est un exercice d'examen, l'écran le
          dit avant le premier mot. Le reste de l'app est crème — le contraste
          fait de cette page un lieu, pas un onglet de plus. */}
      <header className="relative bg-[color-mix(in_oklab,var(--foreground),black_8%)] px-5 pt-4 pb-12 text-white">
        <div className="mx-auto w-full max-w-xl">
          <div className="flex items-center gap-3">
            <Link
              href="/reviser/francais/dictee"
              aria-label="Retour aux dictées"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-foreground shadow-sm"
            >
              <ArrowLeft className="size-5" aria-hidden="true" />
            </Link>
            <span className="flex flex-1 items-center justify-center gap-2 font-extrabold">
              <Timer className="size-5" aria-hidden="true" />
              {Number(dictee.duree_min)} min
            </span>
            <span className="size-10 shrink-0" aria-hidden="true" />
          </div>

          <h1 className="font-heading mt-8 text-center text-3xl leading-tight font-extrabold text-balance">
            {String(dictee.titre)}
          </h1>
          {dictee.source ? (
            <p className="mt-2 text-center text-lg opacity-80">
              – {String(dictee.source)} –
            </p>
          ) : null}
        </div>
      </header>

      {/* La pastille de niveau chevauche la couture des deux fonds : elle
          appartient aux deux, ce qui coud le héros au corps de la page. */}
      <div className="relative z-10 -mt-5 px-5">
        <div className="mx-auto flex w-full max-w-xl justify-end">
          <span className="rounded-full bg-primary px-4 py-2 text-sm font-extrabold text-primary-foreground shadow-sm">
            {NIVEAU_LABEL[niveau]}
          </span>
        </div>
      </div>

      <main className="flex flex-1 flex-col px-5 pt-6 pb-6">
        <div className="mx-auto flex w-full max-w-xl flex-1 flex-col">
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
          <div className="mt-8 flex items-center gap-3 rounded-3xl border-2 border-black/10 bg-card p-4">
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

          <Link
            href={`/reviser/francais/dictee/${String(dictee.slug)}/jouer`}
            className="quiz-plaque h-14 w-full gap-2 text-lg font-extrabold text-white [--plaque-bas:color-mix(in_oklab,var(--success),black_14%)] [--plaque-bord:color-mix(in_oklab,var(--success),black_50%)] [--plaque-haut:color-mix(in_oklab,var(--success),white_14%)]"
          >
            Commencer
            <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
        </div>
      </main>
    </div>
  )
}
