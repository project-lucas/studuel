import Link from 'next/link'
import { CreditCard, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { isMissingSchemaObject } from '@/lib/schema-fallback'
import { libelleEcheance } from '@/lib/abonnement'
import GrantPanel, { ExpirePanel } from '@/components/admin/GrantPanel'

export const metadata = { title: 'Abonnements — Studuel' }
export const dynamic = 'force-dynamic'

/**
 * La caisse, v0 (migration 221).
 *
 * Ce que cet écran répond, et que RIEN ne savait dire avant lui : combien de
 * familles ont demandé à payer, lesquelles, et qui a réellement un abonnement
 * actif. Le paiement lui-même se fait hors de l'app — cet écran est le pont
 * entre « un parent a dit oui » et « son compte est passé tier1 ».
 *
 * Le droit d'accorder est vérifié en base (`grant_subscription`), pas ici :
 * cette page n'est qu'un guichet.
 */
type Interet = {
  id: string
  user_id: string
  plan_id: string
  contact: string | null
  note: string | null
  created_at: string
  handled_at: string | null
  profil: { full_name: string | null; grade_level: string | null } | null
}

type Octroi = {
  id: string
  user_id: string
  tier: string
  expires_at: string | null
  source: string
  reference: string | null
  created_at: string
  profil: { full_name: string | null } | null
}

const PLAN_LABEL: Record<string, string> = {
  tier1: 'Studuel+',
  tier2: 'Famille',
  tier3: 'Famille+',
  free: 'Gratuit',
}

function dateCourte(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function AbonnementsPage() {
  const supabase = await createClient()

  const [interets, octrois, abonnes] = await Promise.all([
    supabase
      .from('subscription_interest')
      .select(
        'id, user_id, plan_id, contact, note, created_at, handled_at, profil:profiles!inner(full_name, grade_level)',
      )
      .order('created_at', { ascending: false })
      .limit(100)
      .returns<Interet[]>(),
    supabase
      .from('subscription_grants')
      .select(
        'id, user_id, tier, expires_at, source, reference, created_at, profil:profiles!inner(full_name)',
      )
      .order('created_at', { ascending: false })
      .limit(50)
      .returns<Octroi[]>(),
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .neq('subscription_tier', 'free'),
  ])

  // La 221 n'est pas passée : on le dit, au lieu d'afficher un écran vide qui
  // laisserait croire que personne n'a jamais demandé à s'abonner.
  const manqueMigration =
    isMissingSchemaObject(interets.error) || isMissingSchemaObject(octrois.error)

  if (manqueMigration) {
    return (
      <div className="rounded-3xl border border-dashed p-8 text-center">
        <AlertTriangle
          className="text-destructive mx-auto size-8"
          aria-hidden="true"
        />
        <h1 className="font-heading mt-3 text-xl font-bold">
          La caisse n’est pas encore branchée
        </h1>
        <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
          La migration <code>221_abonnements_v0.sql</code> n’a pas été exécutée.
          Tant qu’elle dort, les demandes d’abonnement ne sont enregistrées nulle
          part et aucun compte ne peut passer payant.
        </p>
        <p className="text-muted-foreground mt-3 text-xs">
          Supabase Dashboard → SQL Editor → coller{' '}
          <code>supabase/221_abonnements_v0.sql</code> → Run.
        </p>
      </div>
    )
  }

  const lignes = interets.data ?? []
  const enAttente = lignes.filter((i) => !i.handled_at)
  const historique = octrois.data ?? []
  const nbAbonnes = abonnes.count ?? 0

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-heading flex items-center gap-2 text-2xl font-bold">
          <CreditCard className="text-primary size-6" aria-hidden="true" />
          Abonnements
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Le paiement se fait hors de l’app. Ici : qui a demandé, et à qui
          l’accès a été réellement accordé.
        </p>
      </header>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Demandes en attente', valeur: enAttente.length },
          { label: 'Demandes au total', valeur: lignes.length },
          { label: 'Comptes payants', valeur: nbAbonnes },
        ].map((c) => (
          <div
            key={c.label}
            className="bg-card rounded-2xl border px-3 py-3 text-center shadow-sm"
          >
            <p className="font-heading text-2xl font-extrabold tabular-nums">
              {c.valeur}
            </p>
            <p className="text-muted-foreground text-[11px] font-semibold">
              {c.label}
            </p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="font-heading mb-2 text-sm font-bold tracking-wide uppercase">
          Demandes
        </h2>
        {lignes.length === 0 ? (
          <p className="text-muted-foreground rounded-2xl border border-dashed px-4 py-6 text-center text-sm">
            Aucune demande pour l’instant. L’onglet Trésor en enregistre une à
            chaque fois qu’une famille choisit une offre.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {lignes.map((i) => (
              <li
                key={i.id}
                className="bg-card flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border px-3 py-2.5 text-sm shadow-sm"
              >
                <span className="font-semibold">
                  {i.profil?.full_name ?? 'Élève sans nom'}
                </span>
                <span className="text-muted-foreground text-xs">
                  {i.profil?.grade_level ?? '—'}
                </span>
                <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[11px] font-bold">
                  {PLAN_LABEL[i.plan_id] ?? i.plan_id}
                </span>
                {i.contact ? (
                  <span className="font-mono text-xs">{i.contact}</span>
                ) : (
                  <span className="text-muted-foreground text-xs italic">
                    sans contact
                  </span>
                )}
                <span className="text-muted-foreground ml-auto text-xs tabular-nums">
                  {dateCourte(i.created_at)}
                </span>
                <GrantPanel
                  userId={i.user_id}
                  interetId={i.id}
                  planPropose={i.plan_id}
                  dejaTraitee={Boolean(i.handled_at)}
                />
                {i.note ? (
                  <p className="text-muted-foreground w-full text-xs">{i.note}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-heading mb-2 text-sm font-bold tracking-wide uppercase">
          Derniers octrois
        </h2>
        {historique.length === 0 ? (
          <p className="text-muted-foreground rounded-2xl border border-dashed px-4 py-6 text-center text-sm">
            Aucun abonnement accordé pour l’instant.
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {historique.map((g) => (
              <li
                key={g.id}
                className="bg-card flex flex-wrap items-center gap-x-3 rounded-xl border px-3 py-2 text-xs shadow-sm"
              >
                <span className="font-semibold">
                  {g.profil?.full_name ?? g.user_id.slice(0, 8)}
                </span>
                <span className="bg-muted rounded-full px-2 py-0.5 font-bold">
                  {PLAN_LABEL[g.tier] ?? g.tier}
                </span>
                <span className="text-muted-foreground">
                  {libelleEcheance(g.expires_at)}
                </span>
                <span className="text-muted-foreground">{g.source}</span>
                {g.reference ? (
                  <span className="font-mono">{g.reference}</span>
                ) : null}
                <span className="text-muted-foreground ml-auto tabular-nums">
                  {dateCourte(g.created_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed px-4 py-3">
        <p className="text-muted-foreground max-w-md text-xs">
          Un abonnement accordé pour N mois ne se coupe pas tout seul. À lancer
          de temps en temps — ou à brancher sur le cron des rappels (
          <code>expire_subscriptions</code>).
        </p>
        <ExpirePanel />
      </div>

      <p className="text-muted-foreground text-xs">
        <Link href="/admin/sante" className="underline underline-offset-2">
          Voir l’état des migrations
        </Link>
      </p>
    </div>
  )
}
