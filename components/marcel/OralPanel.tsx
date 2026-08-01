import Link from 'next/link'
import { Check, ChevronRight, Mic, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  accrocheEchelle,
  BARREAUX,
  compterCriteres,
  formatDuree,
  retourEcoute,
} from '@/lib/coach/oral'
import type { OralSnapshot } from '@/lib/coach/oral-server'

// « L'oral » — la vue de Marcel qui porte l'échelle à quatre barreaux.
//
// Elle montre TOUJOURS les quatre barreaux, franchis ou non : l'échelle est
// aussi une explication de ce qu'est un oral réussi. Un élève qui découvre
// qu'on peut « demander à un ami d'écouter » a déjà appris quelque chose, même
// s'il ne le fait pas aujourd'hui.
//
// Ce qu'on n'affiche jamais : une note, un score, un pourcentage de réussite à
// l'oral. Marcel fait répéter — il ne juge pas la voix.

function BarreauLigne({
  index,
  franchi,
  courant,
}: {
  index: number
  franchi: boolean
  courant: boolean
}) {
  const b = BARREAUX[index]
  return (
    <li
      className={cn(
        'flex gap-3 px-3 py-3',
        courant && 'bg-primary/5 rounded-2xl',
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold',
          franchi
            ? 'bg-primary text-primary-foreground'
            : courant
              ? 'bg-primary/15 text-primary ring-primary/30 ring-2'
              : 'bg-muted text-muted-foreground',
        )}
        aria-hidden="true"
      >
        {franchi ? <Check className="size-4" /> : b.id}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="font-heading text-[15px] font-extrabold">{b.titre}</span>
          {courant ? (
            <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-[10px] font-extrabold">
              à faire
            </span>
          ) : null}
        </span>
        <span className="text-foreground/75 mt-0.5 block text-sm">{b.promesse}</span>
        <span className="text-muted-foreground mt-0.5 block text-xs">
          {b.precision}
        </span>
      </span>
    </li>
  )
}

export default function OralPanel({ snapshot }: { snapshot: OralSnapshot }) {
  const { etat, envoyees, disponible } = snapshot

  if (!disponible) {
    return (
      <div className="bg-card rounded-[20px] p-5 text-center">
        <Mic className="text-muted-foreground mx-auto size-6" aria-hidden="true" />
        <p className="font-heading mt-2 text-[15px] font-extrabold">
          L’atelier d’oral n’est pas encore ouvert.
        </p>
        <p className="text-muted-foreground mx-auto mt-1 max-w-sm text-sm">
          La migration <code>222_oral_echelle.sql</code> attend d’être exécutée.
          Tant qu’elle dort, tes passages n’auraient nulle part où être comptés —
          je préfère te le dire que faire semblant.
        </p>
      </div>
    )
  }

  const repondues = envoyees.filter((d) => d.statut === 'ecoutee' && d.criteres)
  const attente = envoyees.filter((d) => d.statut === 'en_attente')

  return (
    <div className="flex flex-col gap-4">
      {/* L'accroche : toujours la PROCHAINE marche, jamais un pourcentage. */}
      <section className="bg-card rounded-[20px] p-4 shadow-[0_2px_0_rgba(36,48,79,.06),0_14px_26px_-22px_rgba(36,48,79,.9)]">
        <p className="font-heading text-[15px] leading-snug font-extrabold text-balance">
          {accrocheEchelle(etat)}
        </p>

        {etat.passages > 0 ? (
          <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold">
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden="true" />
              meilleur passage&nbsp;: {formatDuree(etat.meilleureDuree)}
            </span>
            <span>
              {etat.passages} passage{etat.passages > 1 ? 's' : ''} · {etat.jours}{' '}
              jour{etat.jours > 1 ? 's' : ''}
            </span>
          </div>
        ) : null}

        <Link
          href="/marcel/oral"
          className="bg-primary text-primary-foreground font-heading mt-3 flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-extrabold"
        >
          <Mic className="size-4" aria-hidden="true" />
          {etat.passages === 0 ? 'Commencer à répéter' : 'Répéter maintenant'}
        </Link>
      </section>

      {/* L'échelle, en entier. */}
      <section>
        <h2 className="font-heading mx-0.5 mb-1.5 text-[15px] font-extrabold">
          Les quatre barreaux
        </h2>
        <ul className="bg-card divide-foreground/8 divide-y rounded-[20px] py-1 shadow-[0_2px_0_rgba(36,48,79,.06),0_14px_26px_-22px_rgba(36,48,79,.9)]">
          {BARREAUX.map((b, i) => (
            <BarreauLigne
              key={b.id}
              index={i}
              franchi={etat.franchis.includes(b.id)}
              courant={etat.prochain === b.id && !etat.franchis.includes(b.id)}
            />
          ))}
        </ul>
      </section>

      {/* Les retours d'amis : c'est la récompense du barreau 4. */}
      {repondues.length > 0 ? (
        <section>
          <h2 className="font-heading mx-0.5 mb-1.5 text-[15px] font-extrabold">
            Ce qu’on t’a répondu
          </h2>
          <ul className="flex flex-col gap-2">
            {repondues.slice(0, 3).map((d) => (
              <li
                key={d.id}
                className="bg-card rounded-[20px] px-4 py-3 shadow-[0_2px_0_rgba(36,48,79,.06)]"
              >
                <p className="text-[13px] font-extrabold">{d.sujet}</p>
                <p className="text-foreground/80 mt-1 text-sm">
                  {d.criteres ? retourEcoute(d.criteres) : ''}
                </p>
                {d.commentaire ? (
                  <p className="text-muted-foreground mt-1 text-xs italic">
                    « {d.commentaire} »
                  </p>
                ) : null}
                <p className="text-muted-foreground mt-1 text-[11px] font-bold">
                  {d.criteres ? compterCriteres(d.criteres) : 0}/3 critères
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {attente.length > 0 ? (
        <p className="text-muted-foreground px-1 text-xs font-semibold">
          {attente.length} demande{attente.length > 1 ? 's' : ''} d’écoute en
          attente de réponse.
        </p>
      ) : null}

      <Link
        href="/reviser"
        className="text-muted-foreground flex items-center justify-center gap-1 text-xs font-bold underline underline-offset-2"
      >
        Préparer mes cartes dans Réviser
        <ChevronRight className="size-3.5" aria-hidden="true" />
      </Link>
    </div>
  )
}
