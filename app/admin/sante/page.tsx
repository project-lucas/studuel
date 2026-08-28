import Link from 'next/link'
import { AlertTriangle, CheckCircle2, HelpCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'
import {
  MIGRATIONS_SANTE,
  interpreterSonde,
  restantes,
  type MigrationSante,
  type Verdict,
} from '@/lib/sante'
import {
  VARS_SANTE,
  varsManquantes,
  verdictsEnv,
  type VarSante,
} from '@/lib/sante-env'

export const metadata = { title: 'Santé de la base — Studuel' }
export const dynamic = 'force-dynamic'

/**
 * Santé de la base — le garde-fou contre l'ÉCHEC SILENCIEUX.
 *
 * Le code tolère volontairement l'absence de ses migrations : une migration
 * oubliée ne produit AUCUNE erreur, les features s'éteignent sans un mot. Cette
 * page rejoue les sondes de lib/sante.ts côté serveur et dit, feature par
 * feature, ce qui est vivant et ce qui dort. Elle a été créée après que dix
 * jours de travail (24 → 27/07/2026) ont dormi derrière 18 migrations.
 *
 * Accès : gardée par is_admin via app/admin/layout.tsx. Aucune donnée sensible
 * ici — des présences d'objets, jamais du contenu.
 */
export default async function SantePage() {
  const supabase = await createClient()

  const verdicts = new Map<string, Verdict>()
  await Promise.all(
    MIGRATIONS_SANTE.map(async (m) => {
      if (m.sonde === null) {
        verdicts.set(m.id, 'non-sondable')
        return
      }
      const s = m.sonde
      if (s.type === 'rpc') {
        const { error } = await supabase.rpc(s.fn, s.args)
        verdicts.set(m.id, interpreterSonde(s, error, 0))
        return
      }
      const colonne = s.type === 'table' ? '*' : s.colonne
      let query = supabase.from(s.table).select(colonne).limit(1)
      if (s.type === 'ligne') query = query.eq(s.colonne, s.valeur)
      const { data, error } = await query
      verdicts.set(m.id, interpreterSonde(s, error, data?.length ?? 0))
    }),
  )

  const aExecuter = restantes(verdicts)
  // LA CONFIGURATION, à côté des migrations. Le projet a deux façons de laisser
  // une fonctionnalité dans le noir — une migration jamais exécutée, et une
  // VARIABLE jamais posée — et cette page n'en surveillait qu'une. Au
  // 26/08/2026, tout le push est écrit et testé, et rien ne peut partir faute
  // de trois variables : l'élève lit « Les rappels push arrivent très bientôt »
  // depuis juillet.
  //
  // ⚠️ ON NE LIT QUE LA PRÉSENCE. Une valeur vide (`''`) compte comme absente :
  // c'est le piège du panneau de configuration où l'on a créé la ligne sans
  // coller la valeur, et il se lit « posée » à toute vérification naïve.
  // Aucune valeur n'est transmise au composant, donc aucune ne peut fuir dans
  // un rendu, un log ou une capture d'écran.
  const presentes = new Set(
    VARS_SANTE.map((v) => v.nom).filter(
      (nom) => (process.env[nom] ?? '').trim().length > 0,
    ),
  )
  const envVerdicts = verdictsEnv(presentes)
  const envManquantes = varsManquantes(envVerdicts)

  const eteintes = MIGRATIONS_SANTE.filter((m) => verdicts.get(m.id) === 'eteinte')
  const toutVivant = eteintes.length === 0

  return (
    <div className="space-y-6">
      <header className="flex items-baseline justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold">Santé de la base</h1>
        <p className="text-sm text-muted-foreground">
          {MIGRATIONS_SANTE.length} migrations surveillées
        </p>
      </header>

      {/* LE verdict, en une phrase. */}
      <section
        className={cn(
          'rounded-2xl border-2 p-5',
          toutVivant
            ? 'border-primary/40 bg-primary/10'
            : 'border-destructive/50 bg-destructive/10',
        )}
      >
        <p className="flex items-start gap-3 font-heading text-lg font-bold">
          {toutVivant ? (
            <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
          ) : (
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
          )}
          {toutVivant
            ? 'Tout ce qui est sondable est vivant. Les non-sondables restent à rejouer par sécurité (idempotent).'
            : `${eteintes.length} feature${eteintes.length > 1 ? 's' : ''} éteinte${eteintes.length > 1 ? 's' : ''} en production — le code est déployé, la base ne suit pas.`}
        </p>
        {aExecuter.length > 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            À exécuter dans l’ordre (SQL Editor Supabase, fichier unique :{' '}
            <code className="font-mono">_ASSOCIE/a-executer.sql</code>) :{' '}
            <span className="font-mono">
              {aExecuter.map((m) => m.id).join(' → ')}
            </span>
          </p>
        ) : null}
      </section>

      {/* La configuration : une variable manquante éteint aussi sûrement qu'une
          migration, et sans laisser la moindre trace. */}
      <section className="rounded-2xl border bg-card p-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-heading text-lg font-bold">Configuration</h2>
          <p className="text-sm text-muted-foreground">
            {envManquantes.length === 0
              ? 'tout est posé'
              : `${envManquantes.length} variable${envManquantes.length > 1 ? 's' : ''} manquante${envManquantes.length > 1 ? 's' : ''}`}
          </p>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Présence seule — aucune valeur n’est lue ni affichée ici.
        </p>
        <ul className="mt-3 space-y-3">
          {VARS_SANTE.map((v) => (
            <LigneEnv key={v.nom} variable={v} verdict={envVerdicts.get(v.nom)!} />
          ))}
        </ul>
      </section>

      {/* La carte de l'éteint : feature ↔ migration ↔ ce que l'élève voit. */}
      <section className="rounded-2xl border bg-card p-4">
        <h2 className="font-heading text-lg font-bold">Feature par feature</h2>
        <ul className="mt-3 space-y-3">
          {MIGRATIONS_SANTE.map((m) => (
            <LigneSante key={m.id} migration={m} verdict={verdicts.get(m.id)!} />
          ))}
        </ul>
      </section>

      <Link
        href="/admin"
        className="inline-block text-sm text-muted-foreground underline underline-offset-4"
      >
        Retour au studio
      </Link>
    </div>
  )
}

const STYLE: Record<Verdict, string> = {
  vivante: 'text-primary',
  eteinte: 'text-destructive',
  'non-sondable': 'text-muted-foreground',
}

const LIBELLE: Record<Verdict, string> = {
  vivante: 'vivante',
  eteinte: 'ÉTEINTE',
  'non-sondable': 'non sondable — rejouer',
}

function LigneSante({
  migration,
  verdict,
}: {
  migration: MigrationSante
  verdict: Verdict
}) {
  return (
    <li className="border-b pb-3 last:border-0 last:pb-0">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm font-semibold">
          <span className="mr-2 font-mono text-xs text-muted-foreground">
            {migration.id}
          </span>
          {migration.feature}
        </p>
        <p
          className={cn(
            'flex shrink-0 items-center gap-1 text-xs font-bold',
            STYLE[verdict],
          )}
        >
          {verdict === 'vivante' ? (
            <CheckCircle2 className="size-3.5" />
          ) : verdict === 'eteinte' ? (
            <AlertTriangle className="size-3.5" />
          ) : (
            <HelpCircle className="size-3.5" />
          )}
          {LIBELLE[verdict]}
        </p>
      </div>
      {verdict !== 'vivante' ? (
        <p className="mt-1 text-xs text-muted-foreground">{migration.siAbsente}</p>
      ) : null}
      {migration.decision ? (
        <p className="mt-1 text-xs font-semibold text-destructive">
          Décision requise : {migration.decision}
        </p>
      ) : null}
    </li>
  )
}

/** Une variable d'environnement : posée, manquante, ou manquante sans gravité. */
function LigneEnv({
  variable,
  verdict,
}: {
  variable: VarSante
  verdict: 'posee' | 'manquante' | 'manquante-facultative'
}) {
  const manque = verdict === 'manquante'
  return (
    <li className="flex items-start gap-3">
      {verdict === 'posee' ? (
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
      ) : manque ? (
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
      ) : (
        <HelpCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      )}
      <div className="min-w-0">
        <p className="flex flex-wrap items-baseline gap-x-2">
          <code className="font-mono text-sm font-semibold">{variable.nom}</code>
          <span className="text-xs text-muted-foreground">
            {variable.portee === 'client'
              ? 'client (publique par construction)'
              : variable.portee === 'serveur'
                ? 'serveur'
                : 'secret GitHub'}
            {verdict === 'manquante-facultative' ? ' · facultative' : ''}
          </span>
        </p>
        <p className="text-sm">{variable.feature}</p>
        {verdict !== 'posee' ? (
          <p className={cn('mt-0.5 text-sm', manque ? 'text-destructive' : 'text-muted-foreground')}>
            {variable.siAbsente}
          </p>
        ) : null}
      </div>
    </li>
  )
}
