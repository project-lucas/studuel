import { cn } from '@/lib/utils'

// -----------------------------------------------------------------------------
// LA FEUILLE DE COURS — mise en forme « cahier » du contenu des leçons.
//
// CE QU'IL RENDAIT, ET CE QU'IL LAISSAIT PASSER (mesuré le 31/08/2026 sur les
// 2 340 leçons de la base) :
//
//   *italique*        11 237 occurrences sur 1 000 leçons — 43 % DES COURS
//   | tableaux |         472 lignes      sur    75 leçons
//   1. listes            579 lignes      sur   158 leçons
//
// Les astérisques, les tuyaux et les numéros s'affichaient TELS QUELS à l'écran.
// Et le défaut frappait exactement là où il fait le plus de dégâts : en LANGUES,
// où l'italique marque l'exemple en langue étrangère. Un cours d'anglais
// affichait « *a book*, *an hour* » — la moitié de sa valeur pédagogique noyée
// dans de la ponctuation parasite.
//
// POURQUOI PAS UNE BIBLIOTHÈQUE MARKDOWN. Le contenu n'est pas du markdown
// libre : c'est un sous-ensemble fermé, écrit par nous, dans `scripts/contenu`.
// Un moteur complet apporterait 40 ko de client, du HTML arbitraire à
// assainir, et surtout une mise en forme qui ne serait pas la nôtre — alors que
// le titre `#` doit devenir une pastille numérotée et la citation `>` un encadré
// à retenir. Ce qu'on veut, ce n'est pas « du markdown », c'est CE cahier-là.
//
// Composant serveur, aucun état.
// -----------------------------------------------------------------------------

/**
 * Rendu inline : `**gras**` et `*italique*` en une seule passe.
 *
 * L'ORDRE DES ALTERNATIVES DE LA REGEX EST LA TOTALITÉ DE LA DIFFICULTÉ. `**` se
 * teste AVANT `*` : dans l'autre sens, `**gras**` serait vu comme un italique
 * vide suivi de texte, et le gras disparaîtrait de tous les cours.
 * Le `[^*\n]` de l'italique l'empêche par ailleurs de franchir une fin de ligne
 * ou d'avaler une étoile — une astérisque isolée dans une phrase reste donc une
 * astérisque, et ne mange pas le reste du paragraphe.
 */
function renderInline(text: string) {
  return text
    .split(/(\*\*[^*]+\*\*|\*[^*\n]+\*)/g)
    .filter((part) => part.length > 0)
    .map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        // Le TERME à retenir : pleine encre, sur un corps volontairement plus
        // clair. C'est le contraste qui le désigne, pas une couleur de plus.
        return (
          <strong key={i} className="font-bold text-foreground">
            {part.slice(2, -2)}
          </strong>
        )
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        // L'EXEMPLE. En langues, c'est le mot étranger ; ailleurs, un titre
        // d'œuvre ou un nom latin. Dans les trois cas, l'italique est la
        // convention typographique juste — et l'encre pleine le détache du
        // corps du texte sans introduire de couleur, le violet et l'or ayant
        // déjà leur emploi (action et récompense).
        return (
          <em key={i} className="text-foreground italic">
            {part.slice(1, -1)}
          </em>
        )
      }
      return part
    })
}

// -----------------------------------------------------------------------------
// LES QUATRE BLOCS DU COLLÈGE (01/09/2026)
//
// La schématisation du lycée avait tout ramené au TABLEAU. De la 6e à la 4e,
// trois formes de savoir y perdent : l'ERREUR CLASSIQUE (qu'un élève de onze ans
// ne distingue pas de l'idée à retenir si les deux encadrés sont dorés), le
// PROCESSUS ordonné (cycle de l'eau, digestion, algorithme) et la CHRONOLOGIE,
// colonne vertébrale de l'histoire au collège. S'y ajoute la FORMULE, qu'on doit
// pouvoir retrouver sans relire le paragraphe qui la porte.
//
// Les marqueurs — `!>`, `~`, `@`, `=` — ont été choisis sur relevé : zéro
// occurrence en tête de ligne dans les 73 614 lignes des cours du dépôt. Voir
// `lib/lesson-markdown` pour la découpe et ses tests.
// -----------------------------------------------------------------------------

/** Une ligne de tableau markdown : `| a | b |` → ['a', 'b']. */
function cellules(ligne: string): string[] {
  return ligne
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => c.trim())
}

/** La ligne de séparation d'un tableau : `|---|:--:|`. */
const estSeparateur = (l: string) => /^\s*\|[\s:|-]+\|\s*$/.test(l)
const estLigneTableau = (l: string) => /^\s*\|.*\|\s*$/.test(l.trim())

/** `!> …` — l'erreur classique. Testé AVANT `> …`, qu'il ne commence pas. */
const litAlerte = (l: string) => /^!>\s+(.*)$/.exec(l)?.[1] ?? null
/** `= …` — la formule ou le repère chiffré, à emporter tel quel. */
const litFormule = (l: string) => /^=\s+(.*)$/.exec(l)?.[1] ?? null
/** `@ 1789 — Prise de la Bastille` — un jalon de frise. */
function litJalon(l: string): { date: string; evenement: string } | null {
  const m = /^@\s+(.+?)\s+—\s+(.+)$/.exec(l)
  return m ? { date: m[1], evenement: m[2] } : null
}
/** `~ A → B → C` — une chaîne. Moins de deux maillons : ce n'est pas un schéma. */
function litChaine(l: string): string[] | null {
  const m = /^~\s+(.*)$/.exec(l)
  if (!m) return null
  const maillons = m[1]
    .split('→')
    .map((s) => s.trim())
    .filter(Boolean)
  return maillons.length >= 2 ? maillons : null
}

export default function LessonRichContent({
  content,
  className,
}: {
  content: string
  className?: string
}) {
  const lines = content.split('\n')
  const blocks: React.ReactNode[] = []

  // Les trois accumulateurs des blocs qui s'étendent sur plusieurs lignes.
  let puces: string[] = []
  let numeros: string[] = []
  let tableau: string[] = []
  let frise: { date: string; evenement: string }[] = []
  let sectionCount = 0

  const flushPuces = () => {
    if (puces.length === 0) return
    const items = puces
    puces = []
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 leading-[1.7] text-foreground/85">
            <span aria-hidden="true" className="mt-0.5 shrink-0 text-primary">
              ✱
            </span>
            <span className="min-w-0">{renderInline(item)}</span>
          </li>
        ))}
      </ul>,
    )
  }

  const flushNumeros = () => {
    if (numeros.length === 0) return
    const items = numeros
    numeros = []
    blocks.push(
      <ol key={`ol-${blocks.length}`} className="space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3 leading-[1.7] text-foreground/85">
            {/* Le numéro est une PASTILLE, pas un simple chiffre : dans une
                marche à suivre, l'élève doit retrouver son rang d'un coup
                d'œil après avoir exécuté une étape. */}
            <span
              aria-hidden="true"
              className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary/12 font-mono text-[11px] font-bold text-primary tabular-nums"
            >
              {i + 1}
            </span>
            <span className="min-w-0">{renderInline(item)}</span>
          </li>
        ))}
      </ol>,
    )
  }

  const flushTableau = () => {
    if (tableau.length === 0) return
    const lignes = tableau.filter((l) => !estSeparateur(l))
    tableau = []
    if (lignes.length === 0) return
    const [entete, ...corps] = lignes.map(cellules)
    blocks.push(
      // Le conteneur qui défile est la SEULE façon honnête de poser un tableau
      // sur un téléphone : sans lui, une colonne de trop pousse toute la page
      // vers la droite et casse la lecture du cours entier.
      <div
        key={`tbl-${blocks.length}`}
        className="-mx-1 overflow-x-auto rounded-2xl ring-1 ring-border"
      >
        <table className="w-full border-collapse text-[15px]">
          <thead>
            <tr className="bg-muted">
              {entete.map((c, i) => (
                <th
                  key={i}
                  scope="col"
                  className="px-3 py-2 text-left font-heading text-[13px] font-bold whitespace-nowrap text-foreground"
                >
                  {renderInline(c)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {corps.map((ligne, i) => (
              <tr
                key={i}
                className={cn(
                  'border-t border-border',
                  // Le zébrage : sur un tableau de conjugaison, il évite de
                  // sauter d'une ligne à l'autre en suivant du doigt.
                  i % 2 === 1 && 'bg-card/60',
                )}
              >
                {ligne.map((c, j) => (
                  <td
                    key={j}
                    className="px-3 py-2 align-top leading-snug text-foreground/85"
                  >
                    {renderInline(c)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>,
    )
  }

  const flushFrise = () => {
    if (frise.length === 0) return
    const jalons = frise
    frise = []
    blocks.push(
      // LA FRISE. La date passe DEVANT la phrase, et sur sa propre ligne : en
      // histoire, c'est elle le point d'accroche de la mémoire. Le rail et les
      // pastilles disent l'ordre sans qu'on ait à numéroter — une chronologie
      // n'est pas une marche à suivre, on n'en « exécute » pas les étapes.
      <ol
        key={`frise-${blocks.length}`}
        className="frise ml-1 space-y-3.5 border-l-2 border-primary/25 pl-5"
      >
        {jalons.map(({ date, evenement }, i) => (
          <li key={i} className="relative">
            <span
              aria-hidden="true"
              className="absolute top-1.5 -left-[1.5rem] size-2.5 rounded-full bg-primary ring-4 ring-background"
            />
            <span className="font-heading block text-[13px] font-extrabold tracking-wide text-primary">
              {renderInline(date)}
            </span>
            <span className="block leading-snug text-foreground/85">
              {renderInline(evenement)}
            </span>
          </li>
        ))}
      </ol>,
    )
  }

  /** Referme tout bloc multiligne en cours. */
  const flushTout = () => {
    flushPuces()
    flushNumeros()
    flushTableau()
    flushFrise()
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed) {
      flushTout()
      continue
    }

    // --- Tableau : on accumule les lignes contiguës commençant par « | ».
    if (estLigneTableau(trimmed)) {
      flushPuces()
      flushNumeros()
      flushFrise()
      tableau.push(trimmed)
      continue
    }
    flushTableau()

    // --- Frise : les jalons `@ …` contigus forment une seule chronologie.
    const jalon = litJalon(trimmed)
    if (jalon) {
      flushPuces()
      flushNumeros()
      frise.push(jalon)
      continue
    }
    flushFrise()

    // --- Puce.
    if (trimmed.startsWith('- ') || /^\* /.test(trimmed)) {
      flushNumeros()
      puces.push(trimmed.slice(2))
      continue
    }

    // --- Étape numérotée. Le point ET l'espace sont exigés : sans quoi
    //     « 1985. Une année charnière » deviendrait une liste d'un élément.
    const numero = /^(\d{1,2})\.\s+(.*)$/.exec(trimmed)
    if (numero) {
      flushPuces()
      numeros.push(numero[2])
      continue
    }

    flushTout()

    const alerteTexte = litAlerte(trimmed)
    const formuleTexte = litFormule(trimmed)
    const maillons = litChaine(trimmed)

    if (trimmed.startsWith('## ')) {
      blocks.push(
        <h3
          key={`h3-${blocks.length}`}
          className="font-heading flex items-baseline gap-2.5 pt-4 text-[1.35rem] leading-tight font-extrabold text-balance text-foreground first:pt-0"
        >
          {/* Un repère de structure, pas un bouton : la barre violette scande
              la page sans jamais ressembler à quelque chose de cliquable. */}
          <span
            aria-hidden="true"
            className="mt-1 h-4 w-1 shrink-0 rounded-full bg-primary"
          />
          <span className="min-w-0">{renderInline(trimmed.slice(3))}</span>
        </h3>,
      )
    } else if (trimmed.startsWith('# ')) {
      sectionCount += 1
      blocks.push(
        <h2
          key={`h2-${blocks.length}`}
          className="font-heading flex items-center gap-3 pt-5 text-2xl font-bold first:pt-0"
        >
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-primary font-mono text-base font-bold text-primary"
          >
            {sectionCount}
          </span>
          <span className="min-w-0 text-balance">
            {renderInline(trimmed.slice(2))}
          </span>
        </h2>,
      )
    } else if (alerteTexte) {
      // L'ALERTE. Elle a la même forme que l'idée clé, et une AUTRE couleur :
      // le corail des alertes de la charte, contre l'or de ce qu'on emporte.
      // C'est tout l'enjeu au collège — deux encadrés dorés côte à côte, l'un
      // disant « retiens ceci » et l'autre « ne tombe pas là-dedans », ne
      // s'opposent pas ; deux couleurs, si.
      blocks.push(
        <p
          key={`piege-${blocks.length}`}
          className="piege flex gap-3 rounded-2xl border-l-4 border-destructive bg-destructive/10 px-4 py-3 leading-[1.65] font-semibold text-foreground"
        >
          <span
            aria-hidden="true"
            className="font-heading mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-destructive/20 text-[13px] font-extrabold text-destructive"
          >
            !
          </span>
          <span className="min-w-0">{renderInline(alerteTexte)}</span>
        </p>,
      )
    } else if (formuleTexte) {
      // LA FORMULE, seule sur sa ligne et au centre. Le cadre en pointillés dit
      // « recopie-moi dans la marge » : c'est le geste qu'on attend d'un élève
      // de sixième devant « Aire = Longueur × largeur ».
      blocks.push(
        <p
          key={`formule-${blocks.length}`}
          className="formule font-heading rounded-2xl border-2 border-dashed border-primary/35 bg-primary/6 px-4 py-3 text-center text-[1.05rem] leading-snug font-extrabold text-balance text-foreground"
        >
          {renderInline(formuleTexte)}
        </p>,
      )
    } else if (maillons) {
      // LA CHAÎNE. Un processus (cycle de l'eau, digestion, algorithme) se lit
      // d'un coup d'œil en maillons fléchés, là où la même phrase obligerait
      // l'élève à reconstruire l'ordre lui-même.
      blocks.push(
        <p
          key={`chaine-${blocks.length}`}
          className="chaine flex flex-wrap items-center gap-x-1.5 gap-y-2"
        >
          {maillons.map((maillon, i) => (
            <span key={i} className="contents">
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="text-base font-bold text-primary"
                >
                  →
                </span>
              )}
              <span className="rounded-xl bg-card px-3 py-1.5 text-[14px] leading-snug font-bold text-foreground ring-1 ring-border">
                {renderInline(maillon)}
              </span>
            </span>
          ))}
        </p>,
      )
    } else if (trimmed.startsWith('> ')) {
      // L'IDÉE CLÉ devient un encadré, et sa couleur est motivée : l'or de la
      // charte marque ce qu'on emporte (progression, récompense). Une phrase à
      // retenir en est exactement un — là où le violet aurait dit « agis ».
      blocks.push(
        <p
          key={`key-${blocks.length}`}
          // `idee-cle` n'habille rien à l'écran : c'est la prise que le bloc
          // `@media print` de globals.css saisit pour interdire qu'un saut de
          // page coupe l'encadré en deux.
          className="idee-cle flex gap-3 rounded-2xl border-l-4 border-highlight bg-accent px-4 py-3 leading-[1.65] font-semibold text-accent-foreground"
        >
          <span aria-hidden="true" className="shrink-0">
            →
          </span>
          <span className="min-w-0">{renderInline(trimmed.slice(2))}</span>
        </p>,
      )
    } else {
      blocks.push(
        <p
          key={`p-${blocks.length}`}
          className="leading-[1.7] text-foreground/85"
        >
          {renderInline(trimmed)}
        </p>,
      )
    }
  }
  flushTout()

  return (
    // 16 px de corps : le plancher de lisibilité sur mobile. L'interligne à 1,7
    // tient dans la fourchette 1,5–1,75 recommandée pour un texte suivi, et la
    // largeur de lecture est bornée par le conteneur de la page (max-w-2xl,
    // soit environ 70 caractères).
    <div className={cn('space-y-4 text-base', className)}>{blocks}</div>
  )
}
