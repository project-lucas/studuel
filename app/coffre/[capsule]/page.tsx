import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Clock, Gift, Lock, Play, Check, Sparkles } from 'lucide-react'
import BackButton from '@/components/BackButton'
import { Button } from '@/components/ui/button'
import { capsuleById, euroLabel } from '@/lib/coffre'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ capsule: string }>
}) {
  const { capsule: id } = await params
  const capsule = capsuleById(id)
  return { title: capsule ? `${capsule.title} — Studuel` : 'Capsule — Studuel' }
}

// Fiche produit d'une capsule d'apprentissage. Capsule offerte et disponible :
// on présente le lecteur. Payante : mur d'achat (micro-paiement à venir).
// Indisponible : « Bientôt ». Aucun paiement n'est simulé ici.
export default async function CapsulePage({
  params,
}: {
  params: Promise<{ capsule: string }>
}) {
  const { capsule: id } = await params
  const capsule = capsuleById(id)
  if (!capsule) notFound()

  const free = capsule.priceEuros <= 0

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5">
      <BackButton fallback="/coffre" label="Retour au coffre" />

      {/* Affiche : emoji géant sur un cartouche violet. */}
      <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-[color-mix(in_oklch,var(--primary),black_28%)] text-white shadow-lg">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-white/20 to-transparent"
        />
        <span className="text-7xl drop-shadow-[0_3px_6px_rgba(0,0,0,0.35)]">
          {capsule.emoji}
        </span>
        <span className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-foreground px-3 py-1 font-mono text-xs font-extrabold text-background tabular-nums">
          {free ? (
            <>
              <Gift className="size-3.5" aria-hidden="true" /> Offert
            </>
          ) : (
            euroLabel(capsule.priceEuros)
          )}
        </span>
        <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm">
          <Clock className="size-3.5" aria-hidden="true" /> {capsule.duration}
        </span>
      </div>

      <div>
        <h1 className="font-heading text-2xl font-bold text-balance text-foreground">
          {capsule.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{capsule.tagline}</p>
      </div>

      {/* Ce que tu apprends. */}
      <section
        aria-label="Ce que tu apprends"
        className="rounded-2xl bg-card p-4 shadow-sm ring-1 ring-black/5"
      >
        <p className="font-heading mb-2 flex items-center gap-1.5 text-sm font-extrabold text-foreground">
          <Sparkles className="size-4 text-primary" aria-hidden="true" />
          Ce que tu apprends
        </p>
        <ul className="flex flex-col gap-2">
          {capsule.covers.map((line, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
              <Check
                className="mt-0.5 size-4 shrink-0 text-primary"
                strokeWidth={2.6}
                aria-hidden="true"
              />
              {line}
            </li>
          ))}
        </ul>
      </section>

      {/* Zone d'action : lecteur (offerte) / mur d'achat (payante) / bientôt. */}
      {!capsule.available ? (
        <div className="rounded-2xl bg-muted/50 p-5 text-center">
          <Lock
            className="mx-auto size-6 text-muted-foreground"
            aria-hidden="true"
          />
          <p className="mt-2 text-sm font-semibold text-foreground">
            Cette capsule arrive bientôt
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Je la tourne en ce moment — reviens vite la découvrir.
          </p>
        </div>
      ) : free ? (
        <>
          {/* Lecteur : cadre 16:9. La vidéo (tournée par le coach) sera
              branchée ici ; en attendant, un cadre « en préparation ». */}
          <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-foreground text-background shadow-inner">
            <span className="flex flex-col items-center gap-2">
              <span className="flex size-14 items-center justify-center rounded-full bg-background/15">
                <Play className="size-6 translate-x-0.5" aria-hidden="true" />
              </span>
              <span className="text-xs font-semibold opacity-80">
                Vidéo en préparation
              </span>
            </span>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Capsule offerte à tous les élèves.
          </p>
        </>
      ) : (
        <div className="rounded-2xl bg-gradient-to-br from-primary to-[color-mix(in_oklch,var(--primary),black_20%)] p-5 text-center text-primary-foreground shadow-md">
          <p className="font-heading text-lg font-bold">
            Débloque cette capsule
          </p>
          <p className="mt-1 text-sm text-primary-foreground/85">
            Un petit prix, une grande différence : {euroLabel(capsule.priceEuros)}.
          </p>
          <Button
            disabled
            className="mt-4 w-full rounded-full bg-white text-primary hover:bg-white/90"
          >
            Bientôt disponible à l’achat
          </Button>
          <p className="mt-2 text-[11px] text-primary-foreground/70">
            Le paiement sécurisé arrive très prochainement.
          </p>
        </div>
      )}

      <Link
        href="/coffre"
        className="text-center text-sm font-semibold text-primary hover:underline"
      >
        Voir toutes les capsules
      </Link>
    </div>
  )
}
