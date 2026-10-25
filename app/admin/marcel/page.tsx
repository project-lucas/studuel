import { createClient } from '@/lib/supabase/server'
import { CREDITS_MENSUELS } from '@/lib/coach/credits'
import { coutAppel, coutMoyenCredit, libelleCout, margeAbonne } from '@/lib/coach/cout'
import { PLANS } from '@/lib/premium'
import { FILIERES } from '@/lib/prepa-sup/catalogue'

export const dynamic = 'force-dynamic'

// CE QUE COÛTE MARCEL (15/10/2026, Lucas : « faire attention à ce que cette
// fonctionnalité ne flingue pas ma marge »). Deux colonnes :
//   • la MESURE : les jetons notés par chaque appel ce mois-ci (`marcel_usage`,
//     581), convertis en euros aux tarifs de lib/coach/cout ;
//   • l'ESTIMATION : la marge d'un abonné qui viderait ses 200 crédits, au
//     modèle configuré.
// Plus, en pied, les votes de la prépa du supérieur (582) : par quelle filière
// commencer le remplissage.

type Ligne = { modele: string; mode: string; appels: number; entree: number; entree_cache: number; sortie: number }
type Bilan = { mois: string; lignes: Ligne[]; eleves: number; abonnes: number; recharges_payees: number }

export default async function AdminMarcelPage() {
  const supabase = await createClient()
  const [{ data, error }, { data: votes }] = await Promise.all([
    supabase.rpc('marcel_usage_mois', {}),
    supabase.rpc('prepa_sup_votes'),
  ])
  const bilan = !error && data ? (data as Bilan) : null

  const modele = process.env.AI_MODEL ?? 'gpt-4o-mini'
  const prix = PLANS.find((p) => p.id === 'plus')?.priceMonthly ?? 4.99
  const credit = coutMoyenCredit(modele)
  const store = margeAbonne({ prixTTC: prix, credits: CREDITS_MENSUELS, coutCredit: credit, fraisPaiement: 0.15 })
  const carte = margeAbonne({ prixTTC: prix, credits: CREDITS_MENSUELS, coutCredit: credit, fraisPaiement: 0.03 })

  const lignes = bilan?.lignes ?? []
  const coutTotal = lignes.reduce(
    (s, l) => s + coutAppel(l.modele, { entree: Number(l.entree), entreeCache: Number(l.entree_cache), sortie: Number(l.sortie) }),
    0,
  )
  const appels = lignes.reduce((s, l) => s + Number(l.appels), 0)
  const nomFiliere = new Map<string, string>(FILIERES.map((f) => [f.id, f.nom]))

  return (
    <div className="flex flex-col gap-6 px-4 pb-10">
      <header>
        <h1 className="font-heading text-3xl font-extrabold">Ce que coûte Marcel</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Modèle configuré : <strong>{modele}</strong> · un café (une demande) coûte en moyenne {libelleCout(credit)}.
        </p>
      </header>

      <section className="carte p-4">
        <h2 className="titre-section">L’estimation : un abonné qui boit ses {CREDITS_MENSUELS} cafés</h2>
        <table className="mt-3 w-full text-sm">
          <tbody>
            <tr>
              <td className="py-1">Coût de l’IA</td>
              <td className="py-1 text-right font-bold tabular-nums">{libelleCout(store.coutIaMax)}</td>
            </tr>
            <tr>
              <td className="py-1">Revenu net (magasin d’applications, 15 %)</td>
              <td className="py-1 text-right font-bold tabular-nums">{libelleCout(store.revenuNet)}</td>
            </tr>
            <tr>
              <td className="py-1">Marge (magasin) · part de l’IA</td>
              <td className="py-1 text-right font-bold tabular-nums">
                {libelleCout(store.marge)} · {(store.partIa * 100).toFixed(1).replace('.', ',')} %
              </td>
            </tr>
            <tr>
              <td className="py-1">Marge (carte en direct, 3 %)</td>
              <td className="py-1 text-right font-bold tabular-nums">{libelleCout(carte.marge)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="carte p-4">
        <h2 className="titre-section">La mesure, ce mois-ci</h2>
        {!bilan ? (
          <p className="text-muted-foreground mt-2 text-sm">La migration 581 n’est pas encore passée : rien n’est mesuré.</p>
        ) : (
          <>
            <p className="mt-2 text-sm">
              <strong>{appels}</strong> appels au modèle, <strong>{bilan.eleves}</strong> élèves, coût{' '}
              <strong>{libelleCout(coutTotal)}</strong> — {bilan.abonnes} abonnés, soit{' '}
              <strong>{libelleCout(bilan.abonnes > 0 ? coutTotal / bilan.abonnes : 0)}</strong> par abonné. Recharges
              payées : <strong>{Number(bilan.recharges_payees).toFixed(2).replace('.', ',')} €</strong>.
            </p>
            {lignes.length > 0 ? (
              <table className="mt-3 w-full text-xs">
                <thead>
                  <tr className="text-muted-foreground text-left">
                    <th className="py-1">Modèle · mode</th>
                    <th className="py-1 text-right">Appels</th>
                    <th className="py-1 text-right">Entrée (cache)</th>
                    <th className="py-1 text-right">Sortie</th>
                    <th className="py-1 text-right">Coût</th>
                  </tr>
                </thead>
                <tbody>
                  {lignes.map((l) => (
                    <tr key={`${l.modele}-${l.mode}`} className="border-t">
                      <td className="py-1">
                        {l.modele} · {l.mode}
                      </td>
                      <td className="py-1 text-right tabular-nums">{l.appels}</td>
                      <td className="py-1 text-right tabular-nums">
                        {l.entree} ({l.entree_cache})
                      </td>
                      <td className="py-1 text-right tabular-nums">{l.sortie}</td>
                      <td className="py-1 text-right tabular-nums">
                        {libelleCout(coutAppel(l.modele, { entree: Number(l.entree), entreeCache: Number(l.entree_cache), sortie: Number(l.sortie) }))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
          </>
        )}
      </section>

      <section className="carte p-4">
        <h2 className="titre-section">Prépa du supérieur : les votes</h2>
        {Array.isArray(votes) && votes.length > 0 ? (
          <ul className="mt-2 space-y-1 text-sm">
            {(votes as { piste: string; eleves: number }[]).map((v) => (
              <li key={v.piste} className="flex justify-between">
                <span>{nomFiliere.get(v.piste) ?? v.piste}</span>
                <strong className="tabular-nums">{v.eleves}</strong>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground mt-2 text-sm">Aucun vote pour l’instant (ou la migration 582 n’est pas passée).</p>
        )}
      </section>
    </div>
  )
}
