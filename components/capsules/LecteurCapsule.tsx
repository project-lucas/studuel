'use client'

import { useEffect, useRef, useState } from 'react'
import { BookOpen, FileText, Lightbulb, ListChecks, Medal, Wrench } from 'lucide-react'
import BackButton from '@/components/BackButton'
import { Button } from '@/components/ui/button'
import CouvertureCapsule from '@/components/capsules/CouvertureCapsule'
import QuizCapsule from '@/components/capsules/QuizCapsule'
import OutilCapsule from '@/components/capsules/outils/OutilCapsule'
import { ouvrirCapsule } from '@/app/carnet/capsules/actions'
import {
  ELEMENTS_CAPSULE,
  type Capsule,
  type ContenuCapsule,
  type TypeElement,
} from '@/lib/capsules'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'

const ICONES: Record<TypeElement, typeof BookOpen> = {
  cours: BookOpen,
  fiche: FileText,
  quiz: ListChecks,
  outil: Wrench,
}

/**
 * Le lecteur d'une capsule, dans le carnet : quatre onglets — le cours, la
 * fiche récap, le quiz, l'outil — dans l'ordre où on les lit. Chaque partie se
 * termine par le bouton qui mène à la suivante.
 *
 * La PREMIÈRE ouverture éteint la pastille du bouton « Mon carnet »
 * (`ouvrirCapsule`, une seule fois par montage).
 */
export default function LecteurCapsule({
  capsule,
  contenu,
  dejaOuverte,
  terminee,
}: {
  capsule: Capsule
  contenu: ContenuCapsule | null
  dejaOuverte: boolean
  terminee: boolean
}) {
  const [onglet, setOnglet] = useState<TypeElement>('cours')
  const haut = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!dejaOuverte) void ouvrirCapsule(capsule.id)
  }, [capsule.id, dejaOuverte])

  const aller = (type: TypeElement) => {
    sfx.tap()
    setOnglet(type)
    haut.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })
  }

  const suivant = ELEMENTS_CAPSULE[ELEMENTS_CAPSULE.findIndex((e) => e.type === onglet) + 1]

  return (
    <div ref={haut} className="mx-auto flex w-full max-w-xl scroll-mt-4 flex-col gap-4 pb-16">
      <header className="flex items-center gap-3">
        <BackButton fallback="/carnet" label="Retour au carnet" />
        <CouvertureCapsule capsule={capsule} taille="vignette" />
        <div className="min-w-0">
          <h1 className="font-heading text-xl leading-tight font-extrabold text-balance">{capsule.titre}</h1>
          <p className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
            {terminee ? (
              <>
                <Medal className="size-3.5 text-highlight" strokeWidth={2.6} aria-hidden="true" />
                Terminée · badge « {capsule.badge} »
              </>
            ) : (
              `${capsule.dureeMin} min · réussis le quiz pour le badge`
            )}
          </p>
        </div>
      </header>

      {!contenu ? (
        <p className="rounded-3xl bg-card px-4 py-6 text-center text-sm font-bold text-muted-foreground ring-1 ring-border">
          Cette capsule est en préparation. Reviens très vite : elle t’attend ici.
        </p>
      ) : (
        <>
          {/* Collée SOUS le bandeau du haut (TopHud, h-14, mobile seulement) :
              collée à 0, elle passait dessous et disparaissait. */}
          <div
            role="tablist"
            aria-label="Parties de la capsule"
            className="sticky top-[calc(env(safe-area-inset-top)+3.75rem)] z-20 grid grid-cols-4 gap-1 rounded-2xl bg-secondary p-1 shadow-sm md:top-4"
          >
            {ELEMENTS_CAPSULE.map(({ type, label }) => {
              const Icone = ICONES[type]
              const actif = type === onglet
              return (
                <button
                  key={type}
                  type="button"
                  role="tab"
                  id={`capsule-onglet-${type}`}
                  aria-selected={actif}
                  aria-controls={`capsule-panneau-${type}`}
                  onClick={() => (actif ? undefined : aller(type))}
                  className={cn(
                    'font-heading flex min-h-11 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-[11px] font-extrabold transition',
                    actif
                      ? 'bg-card text-primary shadow-[0_3px_0_color-mix(in_oklch,var(--primary),transparent_70%)]'
                      : 'text-secondary-foreground/70 active:scale-95',
                  )}
                >
                  <Icone className="size-4" strokeWidth={2.6} aria-hidden="true" />
                  {label}
                </button>
              )
            })}
          </div>

          <section
            role="tabpanel"
            id={`capsule-panneau-${onglet}`}
            aria-labelledby={`capsule-onglet-${onglet}`}
            className="flex flex-col gap-3"
          >
            <h2 className="font-heading px-1 text-2xl font-extrabold">{contenu[onglet].titre}</h2>
            {onglet === 'cours' ? (
              <Cours contenu={contenu.cours.contenu} />
            ) : onglet === 'fiche' ? (
              <Fiche contenu={contenu.fiche.contenu} />
            ) : onglet === 'quiz' ? (
              <QuizCapsule
                capsuleId={capsule.id}
                quiz={contenu.quiz.contenu}
                badge={capsule.badge}
                dejaTerminee={terminee}
              />
            ) : (
              <OutilCapsule capsuleId={capsule.id} outil={contenu.outil.contenu} />
            )}
          </section>

          {suivant && onglet !== 'quiz' ? (
            <Button size="lg" className="w-full rounded-full font-bold" onClick={() => aller(suivant.type)}>
              {suivant.type === 'fiche'
                ? 'Voir la fiche récap'
                : suivant.type === 'quiz'
                  ? 'Passer au quiz'
                  : 'Découvrir l’outil'}
            </Button>
          ) : onglet === 'quiz' ? (
            <Button
              size="lg"
              variant="secondary"
              className="w-full rounded-full font-bold"
              onClick={() => aller('outil')}
            >
              Découvrir l’outil
            </Button>
          ) : null}
        </>
      )}
    </div>
  )
}

function Cours({ contenu }: { contenu: ContenuCapsule['cours']['contenu'] }) {
  return (
    <>
      {contenu.intro ? <p className="px-1 text-base leading-relaxed font-semibold">{contenu.intro}</p> : null}
      {contenu.sections.map((section, i) => (
        <article key={section.titre} className="rounded-3xl bg-card p-4 ring-1 ring-border">
          <h3 className="font-heading flex items-baseline gap-2 text-lg leading-snug font-extrabold">
            <span className="text-primary tabular-nums">{i + 1}.</span>
            {section.titre}
          </h3>
          <div className="mt-2 flex flex-col gap-2.5 text-[15px] leading-relaxed">
            {section.texte.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          {section.astuce ? (
            <p className="mt-3 flex items-start gap-2 rounded-2xl bg-accent px-3 py-2.5 text-sm font-bold text-accent-foreground">
              <Lightbulb className="mt-0.5 size-4 shrink-0" strokeWidth={2.4} aria-hidden="true" />
              {section.astuce}
            </p>
          ) : null}
        </article>
      ))}
    </>
  )
}

function Fiche({ contenu }: { contenu: ContenuCapsule['fiche']['contenu'] }) {
  return (
    <>
      <ol className="flex flex-col gap-2">
        {contenu.points.map((point, i) => (
          <li key={point.titre} className="flex gap-3 rounded-3xl bg-card p-3.5 ring-1 ring-border">
            <span className="font-heading grid size-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground">
              {i + 1}
            </span>
            <div>
              <p className="font-heading font-extrabold">{point.titre}</p>
              <p className="mt-0.5 text-sm leading-relaxed">{point.texte}</p>
            </div>
          </li>
        ))}
      </ol>
      {contenu.aRetenir ? (
        <p className="rounded-3xl bg-primary px-4 py-4 text-center text-primary-foreground">
          <span className="block text-xs font-extrabold tracking-wide text-highlight uppercase">À retenir</span>
          <span className="font-heading mt-1 block text-lg leading-snug font-extrabold">{contenu.aRetenir}</span>
        </p>
      ) : null}
    </>
  )
}
