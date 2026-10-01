import fs from 'node:fs'
import path from 'node:path'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ApercuJoueur from '@/components/exercices/ApercuJoueur'
import Liseuse from '@/components/exercices/livre/Liseuse'
import { construireLivre } from '@/lib/exercices/livre'
import { compilerExercice } from '@/lib/exercices/compiler'
import type { FichierExercices } from '@/lib/exercices/types'
import { validerFichier } from '@/lib/exercices/valider'

export const dynamic = 'force-dynamic'

// L'APERÇU DU CAHIER — en développement seulement.
//
// Lit contenu/exercices/<niveau>/<matière>.json, compile un exercice comme le
// ferait la migration, et le rend JOUABLE avec le moteur de démonstration
// (juge local, aucune base, aucun compte). C'est l'outil de relecture : on
// regarde chaque carte, chaque graphique, on répond, on voit le bilan.
//
//   /dev/exercices                       la liste des fichiers et exercices
//   /dev/exercices?f=6e/maths&i=0        l'exercice n°0 du fichier, jouable
//   /dev/exercices?f=3e/maths.k016&i=0&livre=1   le même, dans la liseuse du manuel
//                                        (chaque exercice du fichier est une page)
const RACINE = path.join(process.cwd(), 'contenu', 'exercices')

function fichiers(): string[] {
  if (!fs.existsSync(RACINE)) return []
  return fs
    .readdirSync(RACINE)
    .flatMap((niveau) =>
      fs.statSync(path.join(RACINE, niveau)).isDirectory()
        ? fs
            .readdirSync(path.join(RACINE, niveau))
            .filter((f) => f.endsWith('.json'))
            .map((f) => `${niveau}/${f.replace(/\.json$/, '')}`)
        : [],
    )
    .sort()
}

function lire(f: string): FichierExercices | null {
  if (!/^[a-z0-9-]+\/[a-z0-9-]+(\.[a-z0-9-]+)?$/i.test(f)) return null
  const chemin = path.join(RACINE, `${f}.json`)
  if (!fs.existsSync(chemin)) return null
  return JSON.parse(fs.readFileSync(chemin, 'utf8')) as FichierExercices
}

export default async function ApercuExercices({
  searchParams,
}: {
  searchParams: Promise<{ f?: string; i?: string; livre?: string; sens?: string; sommaire?: string }>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const { f, i, livre: modeLivre, sens, sommaire } = await searchParams

  if (f && i !== undefined) {
    const fichier = lire(f)
    const n = Number(i)
    const ex = fichier?.exercices[n]
    if (!fichier || !ex) notFound()
    const { public: pub, cles } = compilerExercice(ex)
    const fautes = validerFichier({ ...fichier, exercices: [ex] })
    const adresse = (k: number) => `/dev/exercices?f=${f}&i=${k}${modeLivre ? '&livre=1' : ''}`
    // Le manuel de l'aperçu : chaque chapitre du fichier est une section, dans l'ordre.
    const chapitresIds = [...new Set(fichier.exercices.map((e) => e.chapitre))]
    const livre = modeLivre
      ? construireLivre(
          `Aperçu · ${f}`,
          'dev',
          chapitresIds.map((id, k) => ({ id, titre: `Chapitre ${k + 1}` })),
          fichier.exercices.map((e) => ({ chapitreId: e.chapitre, position: e.position, etoiles: e.etoiles, titre: e.titre, etat: 'ouvert' as const })),
          (c, p) => adresse(fichier.exercices.findIndex((e) => e.chapitre === c && e.position === p)),
        )
      : null
    return (
      <div className="flex flex-col gap-4 pb-24">
        <p className="text-center text-xs font-bold text-[var(--muted-foreground)]">
          APERÇU · {f} · exercice {n + 1}/{fichier.exercices.length} · chapitre {ex.chapitre.slice(0, 8)}…
        </p>
        {fautes.length ? (
          <ul className="rounded-2xl bg-[color-mix(in_oklch,var(--destructive),white_85%)] p-3 text-xs">
            {fautes.map((x, k) => (
              <li key={k}>
                <strong>{x.chemin}</strong> : {x.message}
              </li>
            ))}
          </ul>
        ) : null}
        {(() => {
          const joueur = (
            <ApercuJoueur
              exercice={{ id: `${ex.chapitre}:${ex.position}`, position: ex.position, etoiles: ex.etoiles, gemmes: 0, xp: 0, contenu: pub }}
              cles={cles}
              retour="/dev/exercices"
              suivant={n + 1 < fichier.exercices.length ? adresse(n + 1) : null}
            />
          )
          return livre ? (
            <Liseuse livre={livre} chapitreId={ex.chapitre} position={ex.position} sommaireOuvert={sommaire === '1'} sens={sens === 'suivante' || sens === 'precedente' ? sens : null}>
              {joueur}
            </Liseuse>
          ) : (
            joueur
          )
        })()}
        <details className="mx-auto w-full max-w-xl rounded-2xl bg-[var(--card)] p-3 text-xs">
          <summary className="cursor-pointer font-bold">Corrigé (aperçu)</summary>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            {ex.questions.map((q, k) => (
              <li key={k}>
                <code>{JSON.stringify('reponse' in q ? q.reponse : 'items' in q ? q.items : 'paires' in q ? q.paires : 'reponses' in q ? q.reponses : null)}</code>
              </li>
            ))}
          </ol>
        </details>
      </div>
    )
  }

  const liste = fichiers()
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4 pb-24">
      <h1 className="font-heading text-3xl font-extrabold">Aperçu du cahier d’exercices</h1>
      {liste.length === 0 ? <p>Aucun fichier dans contenu/exercices.</p> : null}
      {liste.map((f) => {
        const fichier = lire(f)
        const fautes = fichier ? validerFichier(fichier) : []
        return (
          <section key={f} className="rounded-2xl bg-[var(--card)] p-3">
            <h2 className="titre-section">
              {f} · {fichier?.exercices.length ?? 0} exercices
              {fautes.length ? <span className="ml-2 text-[var(--destructive)]">{fautes.length} faute(s)</span> : null}
            </h2>
            <ol className="mt-1 grid gap-0.5 text-sm">
              {fichier?.exercices.map((ex, k) => (
                <li key={k}>
                  <Link className="underline" href={`/dev/exercices?f=${f}&i=${k}`}>
                    {k + 1}. {'★'.repeat(ex.etoiles)} {ex.titre}
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        )
      })}
    </div>
  )
}
