import Image from 'next/image'
import Link from 'next/link'
import { subjectVignette, subjectInitials, subjectPastel } from '@/lib/subject-style'
import { dureeLabel, radarAxes, type EffortDiagram, type EffortRow } from '@/lib/effort'
import EffortRadar from '@/components/moi/EffortRadar'
import { cn } from '@/lib/utils'

// -----------------------------------------------------------------------------
// TON TRAVAIL, PAR MATIÈRE — le diagramme de /moi.
//
// IL RÉPOND À UNE QUESTION, PAS À DEUX. Pas « combien ai-je travaillé » (la
// carte de joueur le dit déjà, en cumul), mais « EST-CE QUE JE TRAVAILLE AU BON
// ENDROIT ». D'où deux repères sur chaque ligne — ce que tu DONNES, ce que ça
// PÈSE à ton épreuve — et un écart qui se lit sans être calculé.
//
// POURQUOI DES BARRES ET PAS UN RADAR. Le radar est la forme qui vient à
// l'esprit pour « mes matières en un coup d'œil », et c'est la pire ici :
// au-delà de six axes il devient illisible, l'aire qu'il dessine CHANGE selon
// l'ordre des axes — il encode donc une information qui n'existe pas — et il
// flatte toujours. Le camembert tombe pareil : quinze parts, aucune comparable.
// La question posée est une comparaison de grandeurs entre catégories, avec un
// regroupement : la réponse est la barre horizontale triée.
//
// L'ÉCHELLE EST COMMUNE À TOUTES LES LIGNES (`diagram.scale`) et exprimée en
// PART du travail total. C'est ce qui rend une barre comparable à sa voisine ET
// à son propre repère de poids : les deux disent une fraction du même tout. Une
// échelle par ligne serait plus jolie et ne voudrait rien dire.
//
// DEUX BLOCS, ET LE SECOND NE S'APPELLE JAMAIS « SECONDAIRE ». En terminale, le
// contrôle continu vaut 40 % du bac et il est fait exactement des matières du
// bas. « Aussi au programme » est un fait ; « secondaire » serait un conseil, et
// un mauvais.
// -----------------------------------------------------------------------------

/** Au-delà, le bloc du bas se replie : il ne doit jamais dominer celui du haut. */
const MAX_AUTRES = 6

/** « 6/20 », « 12,5/20 » — virgule décimale, comme sur un bulletin français. */
const noteLabel = (v: number) =>
  `${(Math.round(v * 10) / 10).toString().replace('.', ',')}/20`

export default function EffortParMatiere({
  diagram,
  jours,
}: {
  diagram: EffortDiagram
  /** Fenêtre de lecture, en jours — dite à l'élève, jamais supposée. */
  jours: number
}) {
  const { exam, autres, regime, totalMinutes } = diagram

  // RIEN DE TRAVAILLÉ : pas de diagramme vide. Un graphique à zéro n'apprend
  // rien et se lit comme un reproche ; la liste des matières de l'épreuve, elle,
  // dit par où commencer. (cf. lib/sante.ts : ne jamais afficher un écran qui
  // ment par omission.)
  if (totalMinutes <= 0) {
    return (
      <section className="rounded-3xl border bg-card p-4 shadow-sm">
        <Entete jours={jours} total={0} />
        <p className="mt-2 text-sm font-semibold text-muted-foreground">
          {exam.length > 0
            ? `Ton épreuve, c'est ${exam.length} matières. Commence par celle que tu veux.`
            : 'Ouvre une matière : ton travail se rangera ici.'}
        </p>
        {exam.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {exam.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/reviser/${r.slug}`}
                  className="flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-sm font-bold transition-colors hover:bg-muted"
                >
                  <Medaillon row={r} taille={20} />
                  {r.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    )
  }

  // LA TOILE PREND LES SIX PREMIÈRES MATIÈRES ; les barres montrent le reste.
  // Un radar n'a de forme qu'au-delà de trois axes et devient illisible au-delà
  // de six (cf. `radarAxes`) : sous ce plancher, il n'y a pas de toile et les
  // barres restent seules — elles, n'ont pas de minimum.
  const surLaToile = new Set(radarAxes(diagram).map((r) => r.slug))
  const horsToile = (r: EffortRow) => !surLaToile.has(r.slug)
  const restants = Math.max(0, autres.filter(horsToile).length - MAX_AUTRES)

  return (
    <section className="rounded-3xl border bg-card p-4 shadow-sm">
      <Entete jours={jours} total={totalMinutes} />

      {/* LA PHRASE. C'est elle qui tient la promesse « en une seconde » ; le
          diagramme dessous ne fait que la démontrer. Une seule, jamais une
          liste — cinq constats ne se lisent pas. */}
      {diagram.phrase ? (
        <p className="mt-2 text-[15px] leading-snug font-semibold text-balance">
          {diagram.phrase}
        </p>
      ) : null}

      <EffortRadar diagram={diagram} />

      {exam.filter(horsToile).length > 0 ? (
        <>
          <Titre>{regime === 'part' ? 'À ton épreuve' : 'À ton examen'}</Titre>
          <ul className="mt-1.5 flex flex-col">
            {exam.filter(horsToile).map((row) => (
              <Ligne key={row.slug} row={row} scale={diagram.scale} dense={false} />
            ))}
          </ul>
        </>
      ) : null}

      {autres.filter(horsToile).length > 0 ? (
        <>
          {/* Un FILET, pas un second titre de section : la coupure doit se voir
              sans peser autant que le bloc du haut. */}
          <hr className="mt-3 border-t" />
          <Titre muted>Aussi au programme</Titre>
          <ul className="mt-1.5 flex flex-col">
            {autres
              .filter(horsToile)
              .slice(0, MAX_AUTRES)
              .map((row) => (
                <Ligne key={row.slug} row={row} scale={diagram.scale} dense />
              ))}
          </ul>
          {restants > 0 ? (
            <p className="mt-1 text-right text-xs font-semibold text-muted-foreground">
              + {restants} autre{restants > 1 ? 's' : ''}
            </p>
          ) : null}
        </>
      ) : null}
    </section>
  )
}

function Entete({ jours, total }: { jours: number; total: number }) {
  return (
    <>
      <h2 className="font-heading text-base font-extrabold">Ton travail</h2>
      <p className="font-heading mt-0.5 text-3xl leading-none font-extrabold tabular-nums">
        {/* LE « ≈ » N'EST PAS UNE COQUETTERIE. La base ne chronomètre rien par
            matière : cette durée est DÉRIVÉE d'un volume de questions et de
            leçons (cf. migration 325). Afficher « 2 h 40 » net serait donner
            pour mesuré ce qui est estimé. */}
        {total > 0 ? `≈ ${dureeLabel(total)}` : '—'}
      </p>
      <p className="text-xs font-semibold text-muted-foreground">
        de révision sur {jours} jours
      </p>
    </>
  )
}

function Titre({
  children,
  muted = false,
}: {
  children: React.ReactNode
  muted?: boolean
}) {
  return (
    <p
      className={cn(
        'mt-3 text-[11px] font-extrabold tracking-wide uppercase',
        muted ? 'text-muted-foreground' : 'text-primary',
      )}
    >
      {children}
    </p>
  )
}

/**
 * Une ligne. Le bloc du haut est plus haut et porte les repères ; celui du bas
 * est dense et n'en porte pas — c'est cette différence de densité qui fait la
 * hiérarchie, sans qu'on ait à écrire « moins important ».
 */
function Ligne({
  row,
  scale,
  dense,
}: {
  row: EffortRow
  scale: number
  dense: boolean
}) {
  const largeur = scale > 0 ? Math.min(100, (row.share / scale) * 100) : 0
  const repere =
    row.weight !== null && scale > 0
      ? Math.min(100, (row.weight / scale) * 100)
      : null

  return (
    <li>
      <Link
        href={`/reviser/${row.slug}`}
        // LE DIAGNOSTIC DOIT MENER AU GESTE : chaque ligne ouvre son dossier.
        // Un constat sur lequel on ne peut rien faire n'est qu'un reproche.
        className={cn(
          'flex items-center gap-3 rounded-2xl px-1 transition-colors hover:bg-muted/50',
          dense ? 'py-1.5' : 'py-2',
        )}
        // Tout ce que la couleur et la longueur disent, dit en toutes lettres :
        // c'est la seule version que lit un lecteur d'écran.
        aria-label={[
          row.name,
          `${dureeLabel(row.minutes)} de révision`,
          `${Math.round(row.share * 100)} % de ton travail`,
          row.moyenne !== null ? `moyenne ${noteLabel(row.moyenne)}` : null,
          row.weight !== null
            ? `pèse ${Math.round(row.weight * 100)} % de ton épreuve`
            : null,
          row.verdict === 'en_retard' ? 'sous la moyenne' : null,
          row.verdict === 'trop' ? 'tu en fais beaucoup' : null,
          row.verdict === 'a_rattraper' ? 'à rattraper' : null,
        ]
          .filter(Boolean)
          .join(', ')}
      >
        <Medaillon row={row} taille={dense ? 24 : 32} />

        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-2">
            <span
              className={cn(
                'truncate font-semibold',
                dense ? 'text-[13px]' : 'text-[15px]',
              )}
            >
              {row.name}
            </span>
            <span className="flex shrink-0 items-baseline gap-2 text-xs font-semibold tabular-nums">
              {/* LA MOYENNE, quand l'élève en a saisi une. Elle est le seul
                  chiffre VÉRIFIABLE de la ligne — le travail est estimé, le
                  poids est un barème, la note est un fait. D'où sa place avant
                  la durée, et sa couleur quand elle passe sous la moyenne. */}
              {row.moyenne !== null ? (
                <span
                  className={cn(
                    row.verdict === 'en_retard'
                      ? 'font-extrabold text-destructive'
                      : 'text-foreground/70',
                  )}
                >
                  {noteLabel(row.moyenne)}
                </span>
              ) : null}
              <span className="text-muted-foreground">
                {dureeLabel(row.minutes)}
              </span>
            </span>
          </span>

          {/* LA PISTE. Le remplissage violet est ce que l'élève donne ; le trait
              doré est ce que la matière pèse. L'écart entre les deux est tout
              le propos de ce bloc. */}
          <span
            aria-hidden="true"
            className={cn(
              'relative mt-1 block overflow-hidden rounded-full bg-black/10',
              dense ? 'h-1.5' : 'h-2',
            )}
          >
            <span
              className={cn(
                'block h-full rounded-full',
                // Une matière sous la moyenne se voit à sa BARRE, pas seulement
                // à sa pastille : c'est ce qui la fait sortir d'un balayage.
                row.verdict === 'en_retard' ? 'bg-destructive' : 'bg-primary',
              )}
              style={{ width: `${largeur}%` }}
            />
            {repere !== null ? (
              <span
                className="absolute inset-y-0 w-0.5 rounded-full bg-highlight"
                style={{ left: `calc(${repere}% - 1px)` }}
              />
            ) : null}
          </span>

          {/* LA PASTILLE DE VERDICT ne sort qu'au-delà d'un écart significatif
              (lib/effort.ts) : cinq alarmes ne sont plus une alarme. Elle porte
              un MOT — jamais la seule couleur. */}
          {row.verdict ? (
            <span
              className={cn(
                'mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-bold',
                row.verdict === 'trop'
                  ? 'bg-warning/15 text-warning'
                  : 'bg-destructive/12 text-destructive',
              )}
            >
              {row.verdict === 'en_retard'
                ? 'sous la moyenne'
                : row.verdict === 'a_rattraper'
                  ? 'à rattraper'
                  : 'beaucoup'}
            </span>
          ) : null}
        </span>
      </Link>
    </li>
  )
}

/**
 * L'illustration de la matière — celle de son dossier. C'est ce qui sépare cet
 * écran d'un graphique de tableur. Repli sur la pastille d'initiales pour les
 * rares matières sans dessin (cf. lib/subject-style.ts).
 */
function Medaillon({ row, taille }: { row: EffortRow; taille: number }) {
  const vignette = subjectVignette(row.slug)
  if (vignette) {
    return (
      <Image
        src={vignette}
        alt=""
        width={320}
        height={320}
        sizes="32px"
        className="h-auto shrink-0"
        style={{ width: taille }}
      />
    )
  }
  return (
    <span
      aria-hidden="true"
      className="font-heading grid shrink-0 place-items-center rounded-full text-[10px] font-extrabold"
      style={{
        width: taille,
        height: taille,
        background: subjectPastel(''),
      }}
    >
      {subjectInitials(row.slug, row.name)}
    </span>
  )
}
