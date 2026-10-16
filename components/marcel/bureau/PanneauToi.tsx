'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { Clock, Crown, Heart, Lock, Sparkles, Swords, Target, X, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from '@/lib/toast'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import {
  MOMENTS,
  OBJECTIFS,
  PASSIONS,
  depuisQuand,
  identiteVide,
  pucesIdentite,
  usagesIdentite,
  type IdentiteMarcel,
  type NoteMarcel,
} from '@/lib/coach/carnet-marcel'
import { effacerNote, enregistrerIdentite } from '@/app/marcel/carnet-actions'
import PoseMarcel from '../PoseMarcel'

type Choix = { id: string; label: string; emoji: string }

/** Une icône par réponse (la règle de la DA : pas d’emoji comme icône). */
const ICONE_PUCE: Record<string, LucideIcon> = {
  passion: Sparkles,
  preferee: Heart,
  beteNoire: Swords,
  objectif: Target,
  moment: Clock,
}
type Etape = { cle: keyof IdentiteMarcel; question: string; choix: Choix[] }

/**
 * L’onglet « Toi » : ce que Marcel sait de l’élève, et rien d’autre.
 *
 * LA CARTE D’IDENTITÉ vient de la PREMIÈRE RENCONTRE — cinq questions à choix,
 * une par écran, qu’on peut passer. Aucune réponse libre (rien d’identifiant,
 * rien d’injectable), aucun appel IA : elle est offerte au gratuit.
 *
 * LES NOTES — ce que l’élève a confié en conversation — sont réservées à
 * Studuel+ ; chacune s’efface d’un toucher.
 */
export default function PanneauToi({
  identite,
  notes,
  matieres,
  ouvert,
  carnetPret,
  maintenant,
}: {
  identite: IdentiteMarcel
  notes: NoteMarcel[]
  matieres: { slug: string; name: string }[]
  ouvert: boolean
  /** La migration 584 est-elle passée ? */
  carnetPret: boolean
  /** L’instant du rendu serveur (ISO), pour dater les notes sans décalage. */
  maintenant: string
}) {
  const [rencontre, setRencontre] = useState(false)
  const [visibles, setVisibles] = useState(notes)
  const [, start] = useTransition()

  const nomMatiere = (slug: string) => matieres.find((m) => m.slug === slug)?.name ?? null
  const puces = pucesIdentite(identite, nomMatiere)
  const usages = usagesIdentite(identite, nomMatiere)

  const effacer = (id: string) => {
    sfx.tap()
    const avant = visibles
    setVisibles((v) => v.filter((n) => n.id !== id))
    start(async () => {
      const r = await effacerNote(id)
      if (!r.ok) {
        setVisibles(avant)
        toast('Je n’ai pas réussi à l’effacer. Réessaie.', 'error')
      }
    })
  }

  return (
    <div className="space-y-2.5">
      <p className="text-muted-foreground flex items-center gap-1.5 px-1 text-[11.5px] font-bold">
        <Lock aria-hidden="true" className="size-3.5 shrink-0" strokeWidth={2.6} />
        Seuls toi et Marcel voyez ceci — ni tes parents, ni tes profs.
      </p>
      <section className="carte p-3.5" aria-labelledby="toi-identite">
        <div className="flex items-baseline justify-between gap-2">
          <h2 id="toi-identite" className="font-heading text-[17px] font-extrabold">Ta carte d’identité</h2>
          {!rencontre && !identiteVide(identite) ? (
            <button type="button" onClick={() => setRencontre(true)} className="text-primary min-h-9 px-1 text-[12px] font-extrabold">
              Modifier
            </button>
          ) : null}
        </div>

        {rencontre ? (
          <PremiereRencontre
            depart={identite}
            matieres={matieres}
            carnetPret={carnetPret}
            fermer={() => setRencontre(false)}
          />
        ) : identiteVide(identite) ? (
          <>
            <div className="mt-1 flex items-end gap-2">
              <PoseMarcel pose="invite" hauteur={72} className="shrink-0 object-contain" />
              <p className="text-muted-foreground mb-1 text-[12.5px] leading-snug font-semibold">
                Cinq questions, une minute : ta passion, ta matière préférée, ta bête noire… Je m’en sers pour te parler avec tes exemples.
              </p>
            </div>
            <Button type="button" size="lg" className="mt-2.5 w-full" onClick={() => { sfx.tap(); setRencontre(true) }}>
              Faisons connaissance
            </Button>
          </>
        ) : (
          <>
          {/* Des ÉTIQUETTES, pas des boutons (Lucas, 16/10 : « à quoi ça sert ? » —
              la pastille lavande se lisait comme une action) : contour fin,
              encre neutre. Ce que Marcel en fait est dit juste dessous. */}
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {puces.map((p) => (
              <li key={p.cle} className="text-foreground inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11.5px] font-bold ring-1 ring-[color-mix(in_oklch,var(--primary),white_75%)]">
                {(() => {
                  const Icone = ICONE_PUCE[p.cle] ?? Sparkles
                  return <Icone aria-hidden="true" className="text-primary size-3.5" strokeWidth={2.6} />
                })()}
                {p.label}
              </li>
            ))}
          </ul>
          {usages.length > 0 ? (
            <div className="bg-secondary/60 mt-2.5 rounded-xl px-3 py-2">
              <p className="text-primary text-[11.5px] font-extrabold">Ce que j’en fais</p>
              <ul className="mt-0.5 space-y-0.5">
                {usages.map((u) => (
                  <li key={u} className="text-[12px] leading-snug font-semibold">
                    {u}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          </>
        )}
      </section>

      <section className="carte p-3.5" aria-labelledby="toi-notes">
        <div className="flex items-baseline justify-between gap-2">
          <h2 id="toi-notes" className="font-heading text-[17px] font-extrabold">Ce que tu m’as confié</h2>
          {ouvert && visibles.length > 0 ? (
            <span className="text-muted-foreground text-[11.5px] font-bold">Tu peux tout effacer</span>
          ) : null}
        </div>
        {!ouvert ? (
          <>
            <p className="text-muted-foreground mt-1 text-[12.5px] leading-snug font-semibold">
              Avec Studuel+, je retiens ce que tu me racontes — tes contrôles, tes profs, tes objectifs — pour ne jamais te reposer la question.
            </p>
            <Button asChild size="lg" className="bg-highlight text-foreground hover:bg-highlight/90 mt-2.5 w-full font-extrabold">
              <Link href="/plus">
                <Crown aria-hidden="true" />
                Débloquer Marcel
              </Link>
            </Button>
          </>
        ) : visibles.length === 0 ? (
          <p className="text-muted-foreground mt-1 text-[12.5px] leading-snug font-semibold">
            Rien pour l’instant. Bientôt, je retiendrai ce que tu me confies en discutant : tu le verras ici, et tu pourras tout effacer.
          </p>
        ) : (
          <ul className="mt-1">
            {visibles.map((n, i) => (
              <li key={n.id} className={cn('flex items-center gap-2 py-2', i > 0 && 'border-secondary border-t-[1.5px]')}>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12.5px] leading-snug font-bold">{n.texte}</span>
                  <span className="text-muted-foreground block text-[10.5px] font-semibold">{depuisQuand(n.creeLe, new Date(maintenant))}</span>
                </span>
                <button
                  type="button"
                  aria-label={`Effacer : ${n.texte}`}
                  onClick={() => effacer(n.id)}
                  className="text-muted-foreground grid size-10 shrink-0 place-items-center rounded-full active:scale-95"
                >
                  <X aria-hidden="true" className="size-4" strokeWidth={2.6} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function PremiereRencontre({
  depart,
  matieres,
  carnetPret,
  fermer,
}: {
  depart: IdentiteMarcel
  matieres: { slug: string; name: string }[]
  carnetPret: boolean
  fermer: () => void
}) {
  const choixMatieres: Choix[] = matieres.map((m) => ({ id: m.slug, label: m.name, emoji: '' }))
  const etapes: Etape[] = [
    { cle: 'passion', question: 'Ce qui te fait vibrer en dehors des cours ?', choix: [...PASSIONS] },
    { cle: 'preferee', question: 'Ta matière préférée ?', choix: choixMatieres },
    { cle: 'beteNoire', question: 'Et ta bête noire ?', choix: choixMatieres },
    { cle: 'objectif', question: 'Ce que tu veux cette année ?', choix: [...OBJECTIFS] },
    { cle: 'moment', question: 'Tu bosses plutôt…', choix: [...MOMENTS] },
  ].filter((e) => e.choix.length > 0) as Etape[]

  const [i, setI] = useState(0)
  const [reponses, setReponses] = useState<IdentiteMarcel>(depart)
  const [pending, start] = useTransition()

  const finir = (finales: IdentiteMarcel) => {
    start(async () => {
      const r = carnetPret ? await enregistrerIdentite(finales) : { ok: false }
      if (r.ok) {
        sfx.notice('success')
        toast('C’est noté. Je m’en souviendrai.', 'success')
        fermer()
      } else {
        toast('Je n’ai pas pu l’enregistrer pour l’instant. Réessaie plus tard.', 'error')
      }
    })
  }

  const suivant = (valeur: string | undefined) => {
    sfx.tap()
    const etape = etapes[i]
    const nouvelles = { ...reponses, [etape.cle]: valeur }
    if (valeur === undefined) delete nouvelles[etape.cle]
    setReponses(nouvelles)
    if (i + 1 < etapes.length) setI(i + 1)
    else finir(nouvelles)
  }

  const etape = etapes[i]
  return (
    <div className="mt-2">
      <div className="flex items-center gap-1" aria-hidden="true">
        {etapes.map((e, k) => (
          <span key={e.cle} className={cn('h-1.5 flex-1 rounded-full', k <= i ? 'bg-primary' : 'bg-secondary')} />
        ))}
      </div>
      <p className="font-heading mt-2.5 text-[16px] font-extrabold" aria-live="polite">
        {etape.question}
      </p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {etape.choix.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              disabled={pending}
              onClick={() => suivant(c.id)}
              className={cn(
                'min-h-10 rounded-full px-3 text-[12.5px] font-extrabold transition active:scale-95',
                reponses[etape.cle] === c.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary',
              )}
            >
              {c.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex justify-between">
        <button type="button" onClick={fermer} className="text-muted-foreground min-h-9 px-1 text-[12px] font-bold">
          Plus tard
        </button>
        <button type="button" disabled={pending} onClick={() => suivant(undefined)} className="text-primary min-h-9 px-1 text-[12px] font-extrabold">
          Passer
        </button>
      </div>
    </div>
  )
}
