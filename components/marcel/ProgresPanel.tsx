'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, ChevronDown, GraduationCap, Mic } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'
import { subjectInitials } from '@/lib/subject-style'
import { marquerChapitreVu } from '@/app/marcel/actions'
import {
  assietteGlobale,
  couvertureFor,
  couvertureGlobale,
  type ChapitreCouvert,
  type ChapitreDetail,
  type CouvertureMatiere,
} from '@/lib/coach/couverture'
import { prioriteMaitrise, type Priorite } from '@/lib/progression'

// « Progrès » — le tableau de révision : une matière, et chacun de ses chapitres.
//
// QUATRE CHOSES QUE L'ANCIEN ÉCRAN NE FAISAIT PAS.
//
// 1. LE POURCENTAGE VEUT DIRE QUELQUE CHOSE. Il portait sur le programme de
//    l'année entière, chapitres jamais ouverts compris : une matière dont le
//    prof avait traité un seul chapitre s'affichait à 10 %, en rouge. Il porte
//    maintenant sur ce qui a été COMMENCÉ (lib/progression.ts).
//
// 2. L'ÉLÈVE PEUT LE DIRE. C'est la pièce que l'app ne pouvait pas deviner :
//    elle ne connaît que ce qui a été fait DANS l'app, jamais ce que le prof a
//    traité en classe. Une case par chapitre, et rien d'autre — on déclare le
//    périmètre, jamais son niveau.
//
// 3. LA BARRE MONTRE LE TRAVAIL, PAS LE PÉRIMÈTRE (corrigé le 01/08, le soir).
//    Elle se remplissait du nombre de chapitres COMMENCÉS : cocher ses 5
//    chapitres la remplissait entièrement, en rouge, à côté d'un « 12 % ». Elle
//    contredisait donc le seul chiffre de la ligne. Elle porte maintenant ce
//    pourcentage, et lui seul ; la couverture reste dite par « 5/5 chap. » et
//    par la phrase en dessous, en toutes lettres.
//
// 4. CHAQUE LIGNE EST UN GESTE. Un chapitre commencé porte « +12 % » — ce que la
//    matière gagnerait s'il était maîtrisé — et ce bouton mène au chapitre. On
//    ne constate plus : on sait où appuyer.
//
// LES COULEURS. Feu tricolore vert → orange → rouge, avec les mots à côté (8 %
// des garçons sont daltoniens, et c'est notre public). Ce sont les rôles
// `success` / `warning` / `destructive` de la DA — aucune couleur inventée pour
// l'occasion — mais leur emploi ici est une DÉROGATION assumée au monde violet
// et jaune, limitée à ce tableau : sur un écran de bilan, le jaune de la
// récompense se lisait comme une alarme de plus à côté du corail. Documentée
// dans CLAUDE.md.
//
// POURQUOI CE COMPOSANT EST CLIENT ET RECALCULE TOUT. Il reçoit les chapitres
// bruts et rappelle `couvertureFor`, la MÊME fonction que le serveur. Cocher une
// case met donc le tableau à jour instantanément, avec des chiffres exacts, sans
// dupliquer une ligne de règle métier — c'est tout l'intérêt d'avoir mis la
// définition dans un module pur.

/**
 * L'encre du texte secondaire de cet écran.
 *
 * `--muted-foreground` (#8f8a78) ne tient que 3,5:1 sur le blanc des cartes :
 * en dessous des 4,5:1 du texte courant, et c'est ici que vivent les phrases
 * qui expliquent le chiffre. L'encre marine de la DA à 70 % passe à 5,1:1 sans
 * durcir la page. (Le token global a le même défaut partout ailleurs — à
 * traiter à part, il touche toute l'app.)
 */
const SECONDAIRE = 'text-foreground/70'

/** Rouge = à reprendre, orange = à consolider, vert = acquis, gris = rien à faire. */
const TON: Record<Priorite, { texte: string; barre: string; puce: string }> = {
  urgente: {
    // Le corail brut ne fait que 3,3:1 sur blanc. Assombri, c'est le MÊME rôle
    // de la DA — pas une couleur inventée — et il devient lisible (5,4:1).
    texte: 'text-[color-mix(in_oklch,var(--destructive),black_20%)]',
    barre: 'bg-destructive',
    puce: 'bg-destructive/12 text-[color-mix(in_oklch,var(--destructive),black_20%)]',
  },
  attention: {
    // `--warning` (#b45309), l'ambre « à revoir » de la DA : 5:1 sur blanc, donc
    // lisible tel quel, et franchement orange à côté du corail et du vert.
    texte: 'text-warning',
    barre: 'bg-warning',
    puce: 'bg-warning/12 text-warning',
  },
  ok: {
    // Le vert `--success` ne fait que 3,5:1 sur blanc : lisible en aplat (barre,
    // pastille), pas en petit texte. D'où le même assombrissement qu'ailleurs.
    texte: 'text-[color-mix(in_oklch,var(--success),black_20%)]',
    barre: 'bg-success',
    puce: 'bg-success/12 text-[color-mix(in_oklch,var(--success),black_20%)]',
  },
  rien: {
    texte: SECONDAIRE,
    barre: 'bg-foreground/12',
    puce: cn('bg-foreground/8', SECONDAIRE),
  },
}

// Le mot qui accompagne la couleur. Sans lui, la priorité ne se lirait qu'à la
// teinte — or 8 % des garçons sont daltoniens, et c'est notre public.
const MOT: Record<Priorite, string> = {
  urgente: 'À reprendre',
  attention: 'À consolider',
  ok: 'Acquis',
  rien: 'Rien à réviser',
}

/**
 * « 30 % » avec une espace insécable.
 *
 * Les pourcentages des chapitres étaient rendus en `font-mono` : l'espace y a
 * la chasse d'un chiffre, et le signe décrochait du nombre. La police du corps
 * règle la largeur, et l'insécable interdit la coupure.
 */
const pourcent = (n: number) => `${n} %`

function LigneChapitre({
  chapitre,
  slug,
  onToggle,
  enCours,
}: {
  chapitre: ChapitreDetail
  slug: string
  onToggle: (id: string, vu: boolean) => void
  enCours: boolean
}) {
  // Un chapitre porte la couleur de SA maîtrise, avec les seuils de sa matière.
  // Avant, les pourcentages du panneau déplié étaient tous du même gris : 30 %
  // et 90 % se ressemblaient, et la liste ne se scannait pas.
  const ton = TON[chapitre.commence ? prioriteMaitrise(chapitre.pct) : 'rien']

  return (
    <li className="flex items-center gap-1">
      {/* La case et le bouton d'action sont DEUX cibles : une ligne qui coche ET
          qui navigue serait un piège au pouce. La case garde la plus grande
          part, l'action se détache à droite. */}
      <button
        type="button"
        role="checkbox"
        aria-checked={chapitre.vuEnCours}
        aria-label={
          chapitre.commence
            ? `${chapitre.titre} — maîtrise ${chapitre.pct} %. Cocher : vu en cours`
            : `${chapitre.titre} — pas encore commencé. Cocher : vu en cours`
        }
        disabled={enCours}
        onClick={() => onToggle(chapitre.id, !chapitre.vuEnCours)}
        className="active:bg-foreground/4 -ml-1.5 flex min-w-0 flex-1 items-center gap-3 rounded-xl px-1.5 py-2.5 text-left transition-colors disabled:opacity-50"
      >
        <span
          aria-hidden="true"
          className={cn(
            'grid size-5 shrink-0 place-items-center rounded-md border-[1.5px] transition-colors',
            chapitre.vuEnCours
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-foreground/30 bg-transparent',
          )}
        >
          {chapitre.vuEnCours ? <Check className="size-3.5" strokeWidth={3} /> : null}
        </span>

        {/* Pas de « Pas encore vu en cours » sous chaque titre : la phrase
            revenait trois fois par matière alors que la case décochée et le
            tiret la disent déjà. Le titre pâlit, ça suffit. */}
        <span
          className={cn(
            'min-w-0 flex-1 text-[13px] leading-snug font-semibold',
            !chapitre.commence && SECONDAIRE,
          )}
        >
          {chapitre.titre}
        </span>

        {/* Un chapitre commencé montre sa maîtrise ; un chapitre pas encore vu
            n'affiche PAS « 0 % » — il n'a pas été raté, il n'a pas été fait. */}
        {chapitre.commence ? (
          <span
            className={cn(
              'shrink-0 text-xs font-extrabold tabular-nums',
              ton.texte,
            )}
          >
            {pourcent(chapitre.pct)}
          </span>
        ) : (
          <span aria-hidden="true" className="text-foreground/35 shrink-0 text-xs font-extrabold">
            —
          </span>
        )}
      </button>

      {/* LE GESTE. « +12 % », c'est ce que la matière gagnerait si ce chapitre
          était maîtrisé — un chiffre calculé par la même fonction que la barre,
          jamais une promesse en l'air (lib/progression.ts). Violet : sur cet
          écran passé au feu tricolore, le violet redevient ce qu'il est partout
          ailleurs dans l'app — la couleur de l'ACTION, pas d'un état.
          Absent quand il n'y a rien à promettre : chapitre pas encore commencé
          (l'ouvrir peut faire BAISSER la moyenne) ou déjà au sommet. */}
      {chapitre.gain > 0 ? (
        <Link
          href={`/reviser/${slug}/${chapitre.id}`}
          onClick={() => sfx.tap()}
          aria-label={`Réviser ${chapitre.titre} — tu peux gagner ${chapitre.gain} %`}
          className="bg-primary/12 text-primary active:bg-primary/20 inline-flex min-h-11 shrink-0 items-center gap-1 rounded-xl px-2.5 text-[11.5px] font-extrabold tabular-nums transition-colors"
        >
          +{chapitre.gain} %
          <ArrowRight aria-hidden="true" className="size-3.5" />
        </Link>
      ) : null}
    </li>
  )
}

function LigneMatiere({
  matiere,
  ouvert,
  onOuvrir,
  onToggle,
  enCours,
}: {
  matiere: CouvertureMatiere
  ouvert: boolean
  onOuvrir: () => void
  onToggle: (id: string, vu: boolean) => void
  enCours: boolean
}) {
  const ton = TON[matiere.priorite]
  const panelId = `chapitres-${matiere.slug}`

  return (
    <li className="bg-card rounded-[20px] px-3.5 py-3 shadow-[0_2px_0_rgba(36,48,79,.06),0_14px_26px_-22px_rgba(36,48,79,.9)]">
      <button
        type="button"
        onClick={onOuvrir}
        aria-expanded={ouvert}
        aria-controls={panelId}
        className="flex w-full items-center gap-3 text-left"
      >
        {/* La pastille porte la priorité. Cinq pastilles grises identiques ne
            donnaient aucun point d'accroche pour scanner la liste. */}
        <span
          className={cn(
            'font-heading grid size-9 shrink-0 place-items-center rounded-xl text-[10px] font-extrabold',
            ton.puce,
          )}
        >
          {subjectInitials(matiere.slug, matiere.name)}
        </span>
        <span className="min-w-0 flex-1">
          <b className="block truncate text-[13.5px] font-extrabold">{matiere.name}</b>
          <span className={cn('text-[11px] font-extrabold', ton.texte)}>
            {MOT[matiere.priorite]}
          </span>
        </span>
        {/* Le pourcentage ET son assiette, jamais l'un sans l'autre : « 80 % »
            seul, sur un chapitre commencé des dix, serait un mensonge par
            omission trois semaines avant le brevet.
            Le chiffre reste en ENCRE : la priorité est déjà dite trois fois
            (pastille, mot, barre), un quatrième corail faisait de chaque ligne
            une alarme. */}
        <span className="shrink-0 text-right">
          <span className="block text-[15px] leading-none font-extrabold tabular-nums">
            {matiere.commences === 0 ? '—' : pourcent(matiere.pct)}
          </span>
          <span className={cn('mt-1 block text-[10.5px] font-bold tabular-nums', SECONDAIRE)}>
            {matiere.commences}/{matiere.total} chap.
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            'text-foreground/45 size-4 shrink-0 transition-transform duration-200',
            ouvert && 'rotate-180',
          )}
        />
      </button>

      {/* LA BARRE = LE POURCENTAGE, rien d'autre.
          Elle comptait les chapitres commencés : cocher ses 5 chapitres la
          remplissait à ras bord, en rouge, juste à côté d'un « 12 % ». Elle
          racontait le périmètre pendant que le chiffre racontait le travail —
          et c'est le périmètre qu'on lisait, parce qu'une barre pleine se voit
          de plus loin qu'un nombre. La couverture, elle, est dite deux fois en
          toutes lettres : « 5/5 chap. » au-dessus, la phrase en dessous. */}
      <div
        className="bg-foreground/10 mt-2.5 h-2.5 overflow-hidden rounded-full"
        role="img"
        aria-label={
          matiere.commences === 0
            ? 'Rien de commencé dans cette matière'
            : `Maîtrise ${matiere.pct} % sur ${matiere.commences} chapitre${matiere.commences > 1 ? 's' : ''} commencé${matiere.commences > 1 ? 's' : ''}`
        }
      >
        <span
          className={cn('block h-full rounded-full transition-[width] duration-300', ton.barre)}
          // Un filet de 6 px minimum : à 2 %, un remplissage strictement
          // proportionnel ne dessinerait rien du tout, et « rien » se confondrait
          // avec « pas encore commencé » — deux situations opposées.
          style={{
            width:
              matiere.commences === 0 || matiere.pct === 0
                ? 0
                : `max(${matiere.pct}%, 6px)`,
          }}
        />
      </div>

      {/* Le constat et la couverture, d'une seule encre. Ils étaient rendus en
          trois gris différents collés bout à bout — trois nuances pour une
          seule phrase, ça ne se hiérarchise pas, ça se brouille. */}
      <p className={cn('mt-2 text-xs leading-snug font-semibold', SECONDAIRE)}>
        {matiere.constat}
        {matiere.reste ? ` ${matiere.reste}` : null}
      </p>

      {ouvert ? (
        <div id={panelId} className="mt-2.5">
          {/* La consigne du régime est une INSTRUCTION : elle descend dans le
              panneau, là où l'élève vient agir. Répétée sous chaque matière
              repliée, elle empilait cinq conseils génériques sur l'écran. */}
          {matiere.consigne && matiere.commences > 0 ? (
            <p
              className={cn(
                'font-heading mb-1 rounded-xl px-3 py-2 text-[11.5px] leading-snug font-extrabold',
                ton.puce,
              )}
            >
              {matiere.consigne}
            </p>
          ) : null}
          <ul className="divide-foreground/8 border-foreground/8 divide-y border-t">
            {matiere.chapitres.map((c) => (
              <LigneChapitre
                key={c.id}
                chapitre={c}
                slug={matiere.slug}
                onToggle={onToggle}
                enCours={enCours}
              />
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  )
}

export default function ProgresPanel({
  chapitres,
  slugsExamen,
  oral,
}: {
  chapitres: ChapitreCouvert[]
  slugsExamen: string[]
  oral: { total: number; maitrises: number } | null
}) {
  // L'état des cases vit ici, et le tableau se recalcule à partir de lui : c'est
  // ce qui rend la coche instantanée sans dupliquer la règle du pourcentage.
  const [vus, setVus] = useState<Set<string>>(
    () => new Set(chapitres.filter((c) => c.vuEnCours).map((c) => c.chapterId)),
  )
  const [examen, setExamen] = useState(false)
  const [ouverte, setOuverte] = useState<string | null>(null)
  const [enCours, start] = useTransition()

  const aExamen = slugsExamen.length > 0

  const couverture = useMemo(() => {
    const source = chapitres.map((c) => ({ ...c, vuEnCours: vus.has(c.chapterId) }))
    const filtres =
      examen && aExamen
        ? source.filter((c) => slugsExamen.includes(c.subjectSlug))
        : source
    return couvertureFor(filtres)
  }, [chapitres, vus, examen, aExamen, slugsExamen])

  const globale = couvertureGlobale(couverture)
  const assiette = assietteGlobale(couverture)

  const toggle = (id: string, vu: boolean) => {
    sfx.tap()
    // Optimiste : la case bascule tout de suite, le tableau se recalcule avec
    // elle. Si le serveur refuse, on remet l'état d'avant et on le dit — un
    // pourcentage qui a bougé pour rien serait pire qu'un refus visible.
    setVus((prev) => {
      const next = new Set(prev)
      if (vu) next.add(id)
      else next.delete(id)
      return next
    })
    start(async () => {
      const res = await marquerChapitreVu(id, vu)
      if (res.ok) return
      setVus((prev) => {
        const next = new Set(prev)
        if (vu) next.delete(id)
        else next.add(id)
        return next
      })
      toast(
        res.unavailable
          ? 'Le suivi des chapitres n’est pas encore ouvert.'
          : 'Impossible d’enregistrer — réessaie.',
        'error',
      )
    })
  }

  if (chapitres.length === 0) {
    return (
      <p
        className={cn(
          'bg-card rounded-[20px] p-5 text-center text-[13px] leading-relaxed font-semibold',
          SECONDAIRE,
        )}
      >
        Je n’ai encore rien à regarder. Choisis tes matières dans Réviser, et je
        te dirai où tu en es.
      </p>
    )
  }

  return (
    <div>
      {/* Le mode examen : un filtre, pas une destination. Il ne s'affiche qu'aux
          classes qui passent une épreuve — en 5e, « ce qui tombe à l'examen »
          n'existe pas. */}
      {aExamen ? (
        <div
          role="group"
          aria-label="Périmètre du tableau"
          className="bg-foreground/8 mb-3 flex gap-1 rounded-2xl p-1"
        >
          {[
            { on: false, label: 'Tout le programme' },
            { on: true, label: 'Ce qui tombe à l’examen' },
          ].map(({ on, label }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                sfx.tap()
                setExamen(on)
              }}
              aria-pressed={examen === on}
              className={cn(
                'font-heading min-h-10 flex-1 rounded-xl px-2 text-[12px] font-extrabold transition-colors',
                examen === on
                  ? 'bg-card text-foreground shadow-[0_2px_0_rgba(36,48,79,.10)]'
                  : // L'onglet au repos était en `muted-foreground` sur beige :
                    // 2,6:1, illisible. L'encre à 75 % passe à 5:1.
                    'text-foreground/75',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}

      {/* Le chiffre de tête était le plus petit et le plus pâle de l'écran,
          alors que c'est LA réponse à « où j'en suis ». Il passe en gros, en
          encre — et il emmène son assiette, comme chaque ligne du tableau. */}
      <header className="mx-1 mb-2 flex items-end justify-between gap-3">
        <h2 className="font-heading text-[15px] leading-tight font-extrabold">
          {examen ? 'Où tu en es pour l’examen' : 'Où tu en es du programme'}
        </h2>
        <span className="shrink-0 text-right">
          <span className="font-heading block text-[22px] leading-none font-extrabold tabular-nums">
            {assiette.commences === 0 ? '—' : pourcent(globale)}
          </span>
          <span className={cn('mt-1 block text-[10.5px] font-bold tabular-nums', SECONDAIRE)}>
            {assiette.commences}/{assiette.total} chap.
          </span>
        </span>
      </header>

      {/* Une carte PAR MATIÈRE, séparées.
          Les cinq matières vivaient dans une seule carte, séparées par un filet
          d'un pixel : titre, barre, phrase et — une fois dépliée — la liste des
          chapitres s'empilaient sans respiration, et l'œil ne savait plus où
          finissait Histoire-Géo ni où commençait SVT. */}
      <ul className="space-y-2.5">
        {couverture.map((matiere) => (
          <LigneMatiere
            key={matiere.slug}
            matiere={matiere}
            ouvert={ouverte === matiere.slug}
            onOuvrir={() => {
              sfx.tap()
              setOuverte((prev) => (prev === matiere.slug ? null : matiere.slug))
            }}
            onToggle={toggle}
            enCours={enCours}
          />
        ))}
      </ul>

      {/* L'oral du bac de français ne se compte pas en chapitres mais en TEXTES :
          le tableau ne peut pas le porter, la ligne le dit à côté. */}
      {examen && oral ? (
        <section className="bg-card mt-3 flex items-center gap-3 rounded-[20px] p-3.5 shadow-[0_2px_0_rgba(36,48,79,.06)]">
          <span className="bg-primary/12 text-primary grid size-9 shrink-0 place-items-center rounded-xl">
            <Mic aria-hidden="true" className="size-4.5" />
          </span>
          <span className="min-w-0 flex-1">
            <b className="block text-[13px] font-extrabold">
              L’oral : {oral.total === 0 ? 'aucun texte' : `${oral.total} textes`}
            </b>
            <span className={cn('text-xs font-semibold', SECONDAIRE)}>
              {oral.total === 0
                ? 'Ton descriptif est vide — ajoute tes textes dans Réviser.'
                : `${oral.maitrises} maîtrisé${oral.maitrises > 1 ? 's' : ''} sur ${oral.total}.`}
            </span>
          </span>
        </section>
      ) : null}

      <div
        className={cn(
          'mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 px-1 text-[11px] font-bold',
          SECONDAIRE,
        )}
      >
        <span className="inline-flex items-center gap-1.5">
          <span className="bg-success size-2 rounded-sm" />
          Acquis
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="bg-warning size-2 rounded-sm" />
          À consolider
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="bg-destructive size-2 rounded-sm" />
          À reprendre
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="bg-foreground/12 size-2 rounded-sm" />
          Pas encore vu en cours
        </span>
      </div>

      <p
        className={cn(
          'mt-3 flex items-start gap-2 px-1 text-xs leading-relaxed font-semibold',
          SECONDAIRE,
        )}
      >
        <GraduationCap aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <span>
          Coche ce que ton prof a traité : je calcule ta maîtrise{' '}
          <b className="font-extrabold">sur ce que tu as commencé</b>, pas sur le
          programme de l’année. Tu déclares ce qui a été fait — ton niveau, lui,
          reste mesuré par tes quiz. Le{' '}
          <b className="font-extrabold">« +12 % »</b> à côté d’un chapitre, c’est
          ce que la matière gagnerait si tu le maîtrisais : touche-le, il t’y
          emmène.
        </span>
      </p>
    </div>
  )
}
