import Link from 'next/link'
import { ChevronDown, Medal, Play, Swords } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ordinal } from '@/lib/percentile'
import { epreuve, epreuveHref, formatScore } from '@/lib/palmares/epreuves'
import {
  casesJeux,
  casesPalmares,
  resumeJeux,
  resumePalmares,
  sousTitreJeux,
  sousTitrePalmares,
  type CasePalmares,
  type LignePalmares,
} from '@/lib/palmares/palmares'

/**
 * LE PALMARÈS de l'onglet Moi — les cinq épreuves de l'Arène, mon record sur
 * chacune, et ma place de la semaine dans ma classe. Une collection montre
 * ses cases vides : une épreuve jamais jouée est une case en pointillé, avec
 * un bouton pour aller la remplir.
 *
 * Composant SERVEUR : il ne fait que dessiner ce que `my_mode_palmares` (352)
 * a rendu, normalisé par lib/palmares. Le duel classé (trophées par matière)
 * n'est pas ici : il a ses compteurs sur la carte de profil et l'arène.
 */
export default function Palmares({
  lignes,
  duels,
}: {
  lignes: readonly LignePalmares[]
  /** Le bilan des duels classés (course) : parties, victoires, trophées. */
  duels: { played: number; wins: number; trophies: number; bestTrophies: number } | null
}) {
  const cases = casesPalmares(lignes)
  const resume = resumePalmares(cases)
  // LES JEUX DE SALON, matière par matière : les mêmes cases (record, place
  // de la semaine, bouton jouer), rangées sous leur matière — migration 355.
  const groupesJeux = casesJeux(lignes)
  const resumeDesJeux = resumeJeux(groupesJeux)

  return (
    <section aria-label="Ton palmarès" className="carte p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
          <Medal className="size-5" strokeWidth={2.4} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="titre-section">Ton palmarès</h2>
          <p className="surtitre">{sousTitrePalmares(resume)}</p>
        </div>
        {resume.podiums > 0 ? (
          <span className="shrink-0 rounded-full bg-highlight px-3 py-1 text-xs font-extrabold text-foreground">
            {resume.podiums} podium{resume.podiums > 1 ? 's' : ''}
          </span>
        ) : null}
      </div>

      <ul role="list" className="palm-cases">
        {cases.map((c) => (
          <li key={c.mode} className="contents">
            <Case c={c} />
          </li>
        ))}
      </ul>

      {duels ? (
        <Link
          href="/defi"
          className="mt-3 flex items-center gap-3 rounded-2xl border-2 border-border bg-card px-3 py-2.5 text-foreground"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <Swords className="size-5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="surtitre block">
              Duels classés
            </span>
            <span className="block text-sm font-bold">
              {duels.played === 0
                ? 'Aucune course encore — lance ton premier duel.'
                : `${duels.wins} victoire${duels.wins > 1 ? 's' : ''} sur ${duels.played} duel${duels.played > 1 ? 's' : ''} · ${duels.trophies.toLocaleString('fr-FR')} trophées`}
            </span>
            {duels.bestTrophies > duels.trophies ? (
              <span className="block text-xs text-muted-foreground">
                Record : {duels.bestTrophies.toLocaleString('fr-FR')} trophées
              </span>
            ) : null}
          </span>
          <Play className="size-4 shrink-0 text-primary" aria-hidden="true" />
        </Link>
      ) : null}

      {/* JEUX PAR MATIÈRE — calcul mental, orthographe, capitales… Chaque
          matière montre tous ses jeux, joués ou non : c'est une collection.

          REPLIÉES PAR DÉFAUT (17/09/2026, Lucas : « on s'y perd »). Toutes
          les matières dépliées faisaient plusieurs écrans de cases, souvent
          vides. Une ligne par matière, avec son compte de records ; un tap
          ouvre ses jeux. */}
      <div className="mt-5 mb-1">
        <h3 className="titre-section">Jeux par matière</h3>
        <p className="surtitre">{sousTitreJeux(resumeDesJeux)}</p>
      </div>
      {groupesJeux.map((g) => {
        const joues = g.cases.filter((c) => c.ligne).length
        return (
          <details key={g.matiere} className="palm-matiere group">
            <summary className="palm-matiere-tete cursor-pointer list-none rounded-xl border-2 border-border px-3 py-2.5 [&::-webkit-details-marker]:hidden">
              <span className="palm-matiere-emoji" aria-hidden="true">
                {g.emoji}
              </span>
              <span className="palm-matiere-nom">{g.matiere}</span>
              <span className="palm-matiere-compte">
                {joues}/{g.cases.length} record{g.cases.length > 1 ? 's' : ''}
              </span>
              <ChevronDown
                className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                strokeWidth={2.6}
                aria-hidden="true"
              />
            </summary>
            <ul role="list" className="palm-cases palm-cases--jeux">
              {g.cases.map((c) => (
                <li key={c.mode} className="contents">
                  <Case c={c} />
                </li>
              ))}
            </ul>
          </details>
        )
      })}
    </section>
  )
}

function Case({ c }: { c: CasePalmares }) {
  const e = epreuve(c.mode)
  const place = placeLabel(c)
  return (
    <Link
      href={epreuveHref(c.mode)}
      className={cn('palm-case', !c.ligne && 'palm-case--vide', c.metal && `palm-case--${c.metal}`)}
      aria-label={
        c.ligne
          ? `${e.nom} : record ${formatScore(c.mode, c.ligne.best)}${place ? `, ${place}` : ''}. Jouer.`
          : `${e.nom} : aucun record. Jouer.`
      }
    >
      <span className="palm-case-tete">
        <span className="palm-case-emoji" aria-hidden="true">
          {e.emoji}
        </span>
        <span className="palm-case-nom">{e.nom}</span>
      </span>
      {c.ligne ? (
        <span className="palm-case-record">
          {String(c.ligne.best).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
          <small>{c.ligne.best === 1 ? e.unite.un : e.unite.plusieurs}</small>
        </span>
      ) : (
        <span className="palm-case-record text-muted-foreground">—</span>
      )}
      <span className={cn('palm-case-place', !place && 'palm-case-place--vide')}>
        {place ?? (c.ligne ? 'Pas joué cette semaine' : 'À poser')}
      </span>
      <span className="palm-case-jouer" aria-hidden="true">
        <Play className="size-3.5" />
      </span>
    </Link>
  )
}

/** « 1er cette semaine », « 7e sur 41 », « Top 5 % » — ou rien. */
function placeLabel(c: CasePalmares): string | null {
  const s = c.semaine
  if (s.kind === 'rang') {
    return s.rank <= 3 ? `${ordinal(s.rank)} cette semaine` : `${ordinal(s.rank)} sur ${s.total}`
  }
  if (s.kind === 'pourcentage') {
    return s.side === 'top' ? `Top ${s.value} % cette semaine` : `Mieux que ${s.value} %`
  }
  return null
}
