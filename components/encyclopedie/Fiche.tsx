import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react'
import BackButton from '@/components/BackButton'
import { cn } from '@/lib/utils'
import { hrefEncyclopedie, hrefFiche } from '@/lib/encyclopedie/matieres'
import {
  PERIODE_LABELS,
  datesDe,
  estEvenement,
  estPersonnage,
  teinteDe,
  type Entree,
} from '@/lib/encyclopedie/types'
import CarteCitation from './CarteCitation'
import TexteRiche from './TexteRiche'
import styles from './Encyclopedie.module.css'

// LA FICHE — ce que l'élève vient lire.
//
// Le modèle qu'on remplace était une page d'encyclopédie en ligne ordinaire :
// un titre, un mur de prose en italique, un portrait avec deux dates, une
// rubrique « Statut », un lien en bas. Trois défauts : on ne savait pas par où
// entrer, la citation n'y était pas, et rien ne disait ce qui tombe au
// contrôle.
//
// Ici, l'ordre de lecture est décidé : la phrase célèbre, puis trente secondes
// de repères, puis le récit, puis la frise, puis ce qu'il faut retenir. On peut
// s'arrêter après n'importe lequel de ces étages et en être sorti plus savant —
// c'est la seule façon de faire lire un texte de trois mille signes à quelqu'un
// qui cherchait juste « qui c'est ».
//
// Composant SERVEUR, zéro interaction : c'est un livre, il n'a pas à être
// hydraté (cf. `MarqueurLu`, le seul brin de JavaScript de la page).
export default function Fiche({
  entree,
  slug,
  liens,
  voisines,
}: {
  entree: Entree
  slug: string
  /**
   * Les fiches vers lesquelles celle-ci renvoie, DÉJÀ RÉSOLUES par la page :
   * une puce doit afficher « Guerre de Cent Ans », pas « guerre-de-cent-ans ».
   * La résolution se fait en amont parce que la page a le corpus sous la main
   * et que le composant, lui, ne doit pas aller le chercher.
   */
  liens: { id: string; nom: string; emoji: string }[]
  voisines: { avant?: Entree; apres?: Entree }
}) {
  const [phare, ...autresCitations] = entree.citations
  const teinte = teinteDe(entree.periode)

  return (
    <article data-teinte={teinte} className="-mx-4 -mt-16 md:-mx-8 md:-mt-10">
      {/* ---------------------------------------------------------------
          LE BANDEAU. La teinte de la période en aplat : le seul endroit de
          l'app où elle est pleine, parce qu'elle doit dire « Moyen Âge »
          avant même qu'on ait lu la date.
      --------------------------------------------------------------- */}
      <header className={cn(styles.bandeau, 'relative overflow-hidden px-4 pt-20 pb-8 md:px-8 md:pt-12')}>
        <div className={cn(styles.bandeauTrame, 'pointer-events-none absolute inset-0')} aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-3xl">
          <div className="mb-4 flex items-center gap-3">
            <BackButton fallback={hrefEncyclopedie(slug)} label="Retour à l’encyclopédie" />
            <Link
              href={hrefEncyclopedie(slug)}
              className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white/90 transition-colors hover:bg-white/25"
            >
              Encyclopédie
            </Link>
          </div>

          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className={cn(
                styles.medaillonBandeau,
                'flex size-16 shrink-0 items-center justify-center rounded-2xl text-4xl md:size-20 md:text-5xl',
              )}
            >
              {entree.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="font-heading text-3xl leading-tight font-extrabold">
                {entree.nom}
              </h1>
              {estPersonnage(entree) && entree.surnom ? (
                <p className="text-sm font-semibold text-white/85 italic md:text-base">
                  {entree.surnom}
                </p>
              ) : null}
              <p className="mt-1 text-sm font-bold text-white/90">
                {datesDe(entree)}
                {estEvenement(entree) && entree.lieu ? ` · ${entree.lieu}` : ''}
                {estPersonnage(entree) && entree.origine ? ` · ${entree.origine}` : ''}
              </p>
            </div>
          </div>

          {/* Les étiquettes : ce qu'on lirait sous un portrait de musée, plus
              la période et les classes où ça tombe. */}
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            <Etiquette forte>{PERIODE_LABELS[entree.periode]}</Etiquette>
            {estPersonnage(entree)
              ? entree.roles.map((role) => <Etiquette key={role}>{role}</Etiquette>)
              : null}
            {entree.niveaux.map((niveau) => (
              <Etiquette key={niveau}>{niveau}</Etiquette>
            ))}
          </div>
        </div>
      </header>

      {/* Plus de feuille opaque sous le bandeau : le corps de la fiche se
          pose sur le mur crème de l'app comme toute page de Réviser (audit du
          23/09/2026). Le bandeau, lui, garde sa teinte : c'est la dérogation
          écrite des périodes. */}
      <div className="relative">
        <div className="mx-auto w-full max-w-3xl px-4 pt-6 pb-24 md:px-8">
          {/* L'ACCROCHE : une phrase, plus grande que le corps. Si l'élève ne
              lit que ça, il sait déjà pourquoi ce nom existe. */}
          <p className="font-heading text-lg leading-snug font-extrabold text-foreground md:text-xl">
            <TexteRiche texte={entree.accroche} />
          </p>

          {phare ? (
            <div className="mt-4">
              <CarteCitation citation={phare} principale />
            </div>
          ) : null}

          {/* LES CHIFFRES d'un événement, en bandeau : ils se lisent d'un
              regard et se retiennent mieux qu'une phrase. */}
          {estEvenement(entree) && entree.chiffres?.length ? (
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {entree.chiffres.map((chiffre) => (
                <div
                  key={`${chiffre.valeur}-${chiffre.quoi}`}
                  className="rounded-2xl border border-border bg-card px-3 py-2.5 text-center"
                >
                  <p className="font-heading text-lg leading-none font-extrabold text-foreground tabular-nums">
                    {chiffre.valeur}
                  </p>
                  <p className="mt-1 text-[0.7rem] leading-tight font-medium text-muted-foreground">
                    {chiffre.quoi}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {/* EN 30 SECONDES. La sortie de secours de la fiche : celui qui est
              pressé s'arrête là, et il n'est pas reparti les mains vides. */}
          <Section titre="En 30 secondes">
            <ul className="space-y-1.5">
              {entree.reperes.map((repere) => (
                <li key={repere} className="flex gap-2.5 text-sm leading-snug text-foreground/90">
                  <span
                    aria-hidden="true"
                    className={cn(styles.gommette, 'mt-[0.45rem] size-1.5 shrink-0 rounded-full')}
                  />
                  <span>
                    <TexteRiche texte={repere} />
                  </span>
                </li>
              ))}
            </ul>
          </Section>

          {/* POURQUOI — la première des trois colonnes d'un événement. */}
          {estEvenement(entree) ? (
            <Section titre="Pourquoi c’est arrivé">
              <ol className="space-y-2">
                {entree.causes.map((cause, i) => (
                  <li key={cause} className="flex gap-3 text-sm leading-snug text-foreground/90">
                    <span
                      aria-hidden="true"
                      className={cn(
                        styles.numero,
                        'flex size-5 shrink-0 items-center justify-center rounded-full text-[0.65rem] font-extrabold',
                      )}
                    >
                      {i + 1}
                    </span>
                    <span>
                      <TexteRiche texte={cause} />
                    </span>
                  </li>
                ))}
              </ol>
            </Section>
          ) : null}

          {/* LE RÉCIT. Des blocs titrés et numérotés : on sait combien il en
              reste, et on peut en sauter un sans perdre le fil. */}
          <Section titre={estEvenement(entree) ? 'Ce qui se passe' : 'Sa vie, son œuvre'}>
            <div className="space-y-4">
              {entree.recit.map((bloc, i) => (
                <div key={bloc.titre}>
                  <h3 className="font-heading flex items-center gap-2 text-base font-extrabold text-foreground">
                    <span
                      aria-hidden="true"
                      className={cn(
                        styles.numero,
                        'flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-extrabold',
                      )}
                    >
                      {i + 1}
                    </span>
                    {bloc.titre}
                  </h3>
                  <p className="mt-1.5 text-[0.9rem] leading-relaxed text-foreground/85">
                    <TexteRiche texte={bloc.texte} />
                  </p>
                </div>
              ))}
            </div>
          </Section>

          {/* CE QUE ÇA CHANGE — la troisième colonne. */}
          {estEvenement(entree) ? (
            <Section titre="Ce que ça change">
              <ul className="space-y-2">
                {entree.consequences.map((suite) => (
                  <li key={suite} className="flex gap-2.5 text-sm leading-snug text-foreground/90">
                    <ArrowRight
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span>
                      <TexteRiche texte={suite} />
                    </span>
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}

          {/* LA FRISE. Une fiche d'histoire se termine toujours par ses dates
              remises dans l'ordre : c'est ce qu'on révise la veille. */}
          <Section titre="La frise">
            <ol className={cn(styles.frise, 'space-y-2.5 pl-5')}>
              {entree.chrono.map((jalon) => (
                <li key={`${jalon.date}-${jalon.fait}`} className="relative">
                  <span
                    aria-hidden="true"
                    className={cn(
                      styles.jalonPastille,
                      'absolute top-[0.4rem] -left-5 size-2.5 rounded-full',
                    )}
                  />
                  <p className="text-[0.8rem] leading-tight font-extrabold text-foreground tabular-nums">
                    {jalon.date}
                  </p>
                  <p className="text-sm leading-snug text-foreground/85">
                    <TexteRiche texte={jalon.fait} />
                  </p>
                </li>
              ))}
            </ol>
          </Section>

          {entree.leSaisTu ? (
            <div className="mt-5 rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-4 py-3.5">
              <p className="font-heading flex items-center gap-2 text-sm font-extrabold text-primary">
                <Sparkles className="size-4" aria-hidden="true" />
                Le sais-tu&nbsp;?
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/85">
                <TexteRiche texte={entree.leSaisTu} />
              </p>
            </div>
          ) : null}

          {autresCitations.length > 0 ? (
            <Section
              titre={autresCitations.length > 1 ? 'Ses autres phrases' : 'Une autre phrase'}
            >
              <div className="space-y-2.5">
                {autresCitations.map((citation) => (
                  <CarteCitation key={citation.texte} citation={citation} />
                ))}
              </div>
            </Section>
          ) : null}

          {entree.mots?.length ? (
            <Section titre="Les mots à connaître">
              <dl className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
                {entree.mots.map((mot) => (
                  <div key={mot.mot} className="px-4 py-2.5">
                    <dt className="text-sm font-extrabold text-foreground">{mot.mot}</dt>
                    <dd className="text-[0.85rem] leading-snug text-muted-foreground">
                      <TexteRiche texte={mot.sens} />
                    </dd>
                  </div>
                ))}
              </dl>
            </Section>
          ) : null}

          {/* À RETENIR. La dernière section, en jaune — la couleur de ce qu'on
              gagne dans cette app. Ici, ce qu'on gagne, c'est ce qui tombe au
              contrôle. */}
          <Section titre="À retenir pour le contrôle">
            <ul className="space-y-2 rounded-2xl border border-highlight/40 bg-highlight/10 px-4 py-3.5">
              {entree.aRetenir.map((ligne) => (
                <li key={ligne} className="flex gap-2.5 text-sm leading-snug text-foreground">
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-highlight"
                    strokeWidth={3}
                    aria-hidden="true"
                  />
                  <span>
                    <TexteRiche texte={ligne} />
                  </span>
                </li>
              ))}
            </ul>
            {/* LE CHAPITRE D'OÙ ÇA VIENT. Une encyclopédie qui ne dit pas où
                la fiche retombe dans le programme laisse l'élève croire qu'il
                lit à côté de son travail. Cette ligne répond à « est-ce que
                ça peut tomber ? » — et la réponse est oui, à cet endroit-là. */}
            {entree.programme ? (
              <p className="mt-2 px-1 text-xs leading-snug text-muted-foreground">
                Au programme de{' '}
                <span className="font-bold text-foreground/80">
                  {entree.niveaux.join(', ')}
                </span>{' '}
                · {entree.programme}
              </p>
            ) : null}
          </Section>

          {liens.length > 0 ? (
            <Section titre="À lire ensuite">
              <div className="flex flex-wrap gap-2">
                {liens.map((lien) => (
                  <Link
                    key={lien.id}
                    href={hrefFiche(slug, lien.id)}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    <span aria-hidden="true">{lien.emoji}</span> {lien.nom}
                  </Link>
                ))}
              </div>
            </Section>
          ) : null}

          {/* PRÉCÉDENT / SUIVANT : dans une encyclopédie d'histoire, « à côté »
              veut dire « juste avant » et « juste après » sur la frise — pas
              dans l'alphabet. */}
          {voisines.avant || voisines.apres ? (
            <nav className="mt-8 grid grid-cols-2 gap-2" aria-label="Fiches voisines">
              {voisines.avant ? (
                <Voisine entree={voisines.avant} slug={slug} sens="avant" />
              ) : (
                <span />
              )}
              {voisines.apres ? (
                <Voisine entree={voisines.apres} slug={slug} sens="apres" />
              ) : null}
            </nav>
          ) : null}
        </div>
      </div>
    </article>
  )
}

function Etiquette({
  children,
  forte = false,
}: {
  children: React.ReactNode
  forte?: boolean
}) {
  return (
    <span
      className={cn(
        'rounded-full px-2.5 py-1 text-[0.7rem] font-bold',
        forte ? 'bg-white text-foreground' : 'bg-white/18 text-white',
      )}
    >
      {children}
    </span>
  )
}

/** Un titre de section, avec son filet dans la teinte de la période. */
function Section({ titre, children }: { titre: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className={cn(styles.filet, 'font-heading mb-2.5 pl-2.5 text-lg font-extrabold text-foreground')}>
        {titre}
      </h2>
      {children}
    </section>
  )
}

function Voisine({
  entree,
  slug,
  sens,
}: {
  entree: Entree
  slug: string
  sens: 'avant' | 'apres'
}) {
  return (
    <Link
      href={hrefFiche(slug, entree.id)}
      className={cn(
        'flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2.5 transition-colors hover:border-primary/50',
        sens === 'apres' ? 'flex-row-reverse text-right' : null,
      )}
    >
      {sens === 'avant' ? (
        <ArrowLeft className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      ) : (
        <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      )}
      <span className="min-w-0">
        <span className="block text-[0.65rem] font-bold text-muted-foreground uppercase">
          {sens === 'avant' ? 'Avant' : 'Après'}
        </span>
        <span className="block truncate text-sm font-extrabold text-foreground">
          {entree.emoji} {entree.nom}
        </span>
      </span>
    </Link>
  )
}
