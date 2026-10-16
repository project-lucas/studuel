'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, ClipboardList, Loader2, Megaphone, Plus, Trash2, Users } from 'lucide-react'
import {
  BROUILLON_VIDE,
  CLASSES,
  LIBELLE_QUESTION,
  nouvelleQuestion,
  segmentsPour,
  type Brouillon,
  type Question,
  type TypeQuestion,
} from '@/lib/annonces/annonces'
import { cn } from '@/lib/utils'
import { estimerCibleAction, publierAnnonceAction } from '@/app/coach/diffusion/actions'

/**
 * LE COMPOSITEUR D'UNE DIFFUSION : message ou sondage, le public (avec le
 * nombre de destinataires estimé en direct), puis l'aperçu tel que l'élève le
 * verra dans l'app. Pensé pour l'ordinateur : rédaction à gauche, aperçu à droite.
 */
export default function Compositeur({
  admin,
  groupes,
  typeInitial,
}: {
  admin: boolean
  groupes: { id: string; nom: string }[]
  typeInitial: 'message' | 'sondage'
}) {
  const router = useRouter()
  const [b, setB] = useState<Brouillon>({
    ...BROUILLON_VIDE,
    type: typeInitial,
    segment: admin ? 'eleves' : 'coaches',
    questions: typeInitial === 'sondage' ? [nouvelleQuestion('choix', 1)] : [],
  })
  const cleCible = `${b.segment}|${b.groupeId ?? ""}|${b.classes.join(",")}`
  const [cibleLue, setCibleLue] = useState<{ cle: string; n: number } | null>(null)
  const cible = cibleLue?.cle === cleCible ? cibleLue.n : null
  const [erreurs, setErreurs] = useState<string[]>([])
  const [succes, setSucces] = useState(false)
  const [enCours, demarrer] = useTransition()
  const segments = segmentsPour(admin)
  const seg = segments.find((s) => s.id === b.segment)

  // Le compte de la cible, à chaque changement de public.
  useEffect(() => {
    let vivant = true
    const cle = `${b.segment}|${b.groupeId ?? ""}|${b.classes.join(",")}`
    const t = setTimeout(() => {
      void estimerCibleAction(b.segment, b.groupeId, b.classes).then((n) => vivant && setCibleLue({ cle, n }))
    }, 250)
    return () => {
      vivant = false
      clearTimeout(t)
    }
  }, [b.segment, b.groupeId, b.classes])

  const maj = (p: Partial<Brouillon>) => {
    setSucces(false)
    setB((x) => ({ ...x, ...p }))
  }
  const majQuestion = (i: number, p: Partial<Question>) => maj({ questions: b.questions.map((q, j) => (j === i ? { ...q, ...p } : q)) })

  const publier = () => {
    setErreurs([])
    demarrer(async () => {
      const r = await publierAnnonceAction(b)
      if (!r.ok) return setErreurs(r.erreurs)
      setSucces(true)
      setB({ ...BROUILLON_VIDE, type: b.type, segment: b.segment, groupeId: b.groupeId, questions: b.type === 'sondage' ? [nouvelleQuestion('choix', 1)] : [] })
      router.refresh()
    })
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_24rem]">
      <section className="carte flex flex-col gap-5 p-5" aria-label="Rédiger">
        {/* Message ou sondage. */}
        <div className="flex gap-2" role="group" aria-label="Sorte d’envoi">
          {(['message', 'sondage'] as const).map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={b.type === t}
              onClick={() => maj({ type: t, questions: t === 'sondage' && b.questions.length === 0 ? [nouvelleQuestion('choix', 1)] : b.questions })}
              className={cn('inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-bold', b.type === t ? 'bg-primary text-primary-foreground' : 'bg-secondary')}
            >
              {t === 'message' ? <Megaphone className="size-4" aria-hidden="true" /> : <ClipboardList className="size-4" aria-hidden="true" />}
              {t === 'message' ? 'Message' : 'Sondage'}
            </button>
          ))}
        </div>

        {/* Le public. */}
        <fieldset>
          <legend className="surtitre mb-2">Public</legend>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {segments.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={b.segment === s.id}
                onClick={() => maj({ segment: s.id, groupeId: s.id === 'groupe' ? (b.groupeId ?? groupes[0]?.id ?? null) : null })}
                disabled={s.id === 'groupe' && groupes.length === 0}
                className={cn('rounded-2xl p-3 text-left ring-1 transition-colors disabled:opacity-40', b.segment === s.id ? 'bg-secondary ring-primary' : 'ring-primary/15 hover:bg-secondary/50')}
              >
                <span className="block text-sm font-extrabold">{s.libelle}</span>
                <span className="block text-xs font-semibold text-muted-foreground">{s.aide}</span>
              </button>
            ))}
          </div>
          {b.segment === 'groupe' ? (
            <select
              value={b.groupeId ?? ''}
              onChange={(e) => maj({ groupeId: e.target.value || null })}
              aria-label="Groupe"
              className="mt-3 h-10 rounded-full border bg-background px-3 text-sm font-semibold"
            >
              {groupes.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.nom}
                </option>
              ))}
            </select>
          ) : null}
          {seg?.classes ? (
            <div className="mt-3 flex flex-wrap items-center gap-1.5" role="group" aria-label="Classes">
              <span className="mr-1 text-xs font-bold text-muted-foreground">Classes :</span>
              {CLASSES.map((c) => {
                const on = b.classes.includes(c)
                return (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={on}
                    onClick={() => maj({ classes: on ? b.classes.filter((x) => x !== c) : [...b.classes, c] })}
                    className={cn('h-8 rounded-full px-3 text-xs font-bold', on ? 'bg-primary text-primary-foreground' : 'bg-secondary')}
                  >
                    {c}
                  </button>
                )
              })}
              {b.classes.length ? (
                <button type="button" onClick={() => maj({ classes: [] })} className="text-xs font-bold text-primary underline">
                  toutes
                </button>
              ) : null}
            </div>
          ) : null}
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm font-bold">
            <Users className="size-4 text-primary" aria-hidden="true" />
            {cible === null ? 'Calcul…' : `${cible.toLocaleString('fr-FR')} destinataire${cible > 1 ? 's' : ''}`}
          </p>
        </fieldset>

        {/* Le texte. */}
        <label className="flex flex-col gap-1">
          <span className="surtitre">Titre</span>
          <input
            value={b.titre}
            onChange={(e) => maj({ titre: e.target.value })}
            maxLength={90}
            placeholder={b.type === 'sondage' ? 'Ton avis sur Studuel' : 'Bravo pour cette semaine !'}
            className="h-11 rounded-xl border bg-background px-3 font-bold outline-none focus:border-primary"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="surtitre">{b.type === 'sondage' ? 'Introduction (facultative)' : 'Message'}</span>
          <textarea
            value={b.corps}
            onChange={(e) => maj({ corps: e.target.value })}
            maxLength={2000}
            rows={b.type === 'sondage' ? 2 : 5}
            className="rounded-xl border bg-background px-3 py-2 outline-none focus:border-primary"
          />
          <span className="self-end text-xs font-semibold text-muted-foreground tabular-nums">{b.corps.length} / 2000</span>
        </label>

        {b.type === 'message' ? (
          <div className="grid gap-3 sm:grid-cols-[1fr_14rem]">
            <label className="flex flex-col gap-1">
              <span className="surtitre">Lien dans l’app (facultatif)</span>
              <input value={b.lien} onChange={(e) => maj({ lien: e.target.value })} placeholder="/reviser" className="h-10 rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="surtitre">Texte du bouton</span>
              <input value={b.lienLibelle} onChange={(e) => maj({ lienLibelle: e.target.value })} maxLength={40} placeholder="J’y vais" className="h-10 rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary" />
            </label>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="surtitre">Questions</p>
            {b.questions.map((q, i) => (
              <div key={i} className="rounded-2xl bg-secondary/50 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-heading text-sm font-extrabold">{i + 1}.</span>
                  <select
                    value={q.type}
                    onChange={(e) => {
                      const t = e.target.value as TypeQuestion
                      majQuestion(i, { type: t, options: t === 'choix' || t === 'multiple' ? (q.options?.length ? q.options : ['', '']) : undefined })
                    }}
                    aria-label="Type de question"
                    className="h-9 rounded-full border bg-background px-3 text-xs font-bold"
                  >
                    {(Object.keys(LIBELLE_QUESTION) as TypeQuestion[]).map((t) => (
                      <option key={t} value={t}>
                        {LIBELLE_QUESTION[t]}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => maj({ questions: b.questions.filter((_, j) => j !== i) })}
                    className="ml-auto grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-card"
                    aria-label={`Retirer la question ${i + 1}`}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
                <input
                  value={q.libelle}
                  onChange={(e) => majQuestion(i, { libelle: e.target.value })}
                  maxLength={200}
                  placeholder="La question"
                  aria-label={`Question ${i + 1}`}
                  className="mt-2 h-10 w-full rounded-xl border bg-background px-3 text-sm font-bold outline-none focus:border-primary"
                />
                {q.type === 'choix' || q.type === 'multiple' ? (
                  <div className="mt-2 flex flex-col gap-1.5">
                    {(q.options ?? []).map((o, k) => (
                      <div key={k} className="flex items-center gap-2">
                        <input
                          value={o}
                          onChange={(e) => majQuestion(i, { options: (q.options ?? []).map((x, m) => (m === k ? e.target.value : x)) })}
                          maxLength={80}
                          placeholder={`Réponse ${k + 1}`}
                          aria-label={`Réponse ${k + 1}`}
                          className="h-9 flex-1 rounded-xl border bg-background px-3 text-sm outline-none focus:border-primary"
                        />
                        {(q.options?.length ?? 0) > 2 ? (
                          <button type="button" onClick={() => majQuestion(i, { options: (q.options ?? []).filter((_, m) => m !== k) })} className="text-muted-foreground" aria-label={`Retirer la réponse ${k + 1}`}>
                            <Trash2 className="size-4" aria-hidden="true" />
                          </button>
                        ) : null}
                      </div>
                    ))}
                    {(q.options?.length ?? 0) < 8 ? (
                      <button type="button" onClick={() => majQuestion(i, { options: [...(q.options ?? []), ''] })} className="self-start text-xs font-bold text-primary">
                        + une réponse
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ))}
            {b.questions.length < 10 ? (
              <button
                type="button"
                onClick={() => maj({ questions: [...b.questions, nouvelleQuestion('choix', b.questions.length + 1)] })}
                className="inline-flex h-10 items-center gap-1.5 self-start rounded-full bg-secondary px-4 text-sm font-bold text-primary"
              >
                <Plus className="size-4" aria-hidden="true" /> Ajouter une question
              </button>
            ) : null}
            <label className="flex items-center gap-2 text-sm font-bold">
              <input type="checkbox" checked={b.anonyme} onChange={(e) => maj({ anonyme: e.target.checked })} className="accent-primary" />
              Sondage anonyme (les prénoms ne sont pas montrés dans les résultats)
            </label>
          </div>
        )}

        {/* Les options d'envoi. */}
        <div className="flex flex-wrap items-center gap-4 border-t border-primary/10 pt-4">
          <label className="flex items-center gap-2 text-sm font-bold">
            <input type="checkbox" checked={b.push} onChange={(e) => maj({ push: e.target.checked })} className="accent-primary" />
            <Bell className="size-4 text-primary" aria-hidden="true" />
            Notification sur le téléphone
          </label>
          <label className="flex items-center gap-2 text-sm font-bold">
            Visible
            <select value={b.jours} onChange={(e) => maj({ jours: Number(e.target.value) })} className="h-9 rounded-full border bg-background px-3 text-sm">
              {[3, 7, 14, 30, 60].map((j) => (
                <option key={j} value={j}>
                  {j} jours
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={publier}
            disabled={enCours}
            className="font-heading ml-auto inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 font-extrabold text-primary-foreground disabled:opacity-50"
          >
            {enCours ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
            {b.type === 'sondage' ? 'Lancer le sondage' : 'Envoyer le message'}
          </button>
        </div>
        {erreurs.length ? (
          <ul className="rounded-2xl bg-(--destructive)/10 p-3 text-sm font-bold text-(--destructive)" role="alert">
            {erreurs.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        ) : null}
        {succes ? (
          <p className="rounded-2xl bg-(--success)/10 p-3 text-sm font-bold text-(--success)" role="status">
            C’est parti : {b.type === 'sondage' ? 'le sondage' : 'le message'} s’affichera à l’ouverture de l’app.
          </p>
        ) : null}
      </section>

      {/* L'aperçu. */}
      <aside className="xl:sticky xl:top-24 xl:self-start" aria-label="Aperçu">
        <p className="surtitre mb-2">Aperçu dans l’app</p>
        <div className="rounded-[2rem] bg-foreground/80 p-3">
          <div className="overflow-hidden rounded-[1.5rem] bg-card">
            <div className="flex items-start gap-3 border-b border-primary/10 p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
                {b.type === 'sondage' ? <ClipboardList className="size-5" aria-hidden="true" /> : <Megaphone className="size-5" aria-hidden="true" />}
              </span>
              <div className="min-w-0">
                <p className="surtitre">{b.segment === 'coaches' || b.segment === 'groupe' ? 'Ton coach' : 'L’équipe Studuel'}</p>
                <p className="font-heading text-lg leading-tight font-extrabold">{b.titre || 'Titre'}</p>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto p-4 text-sm">
              {b.corps ? <p className="whitespace-pre-wrap">{b.corps}</p> : <p className="text-muted-foreground">Le texte s’affichera ici.</p>}
              {b.type === 'sondage'
                ? b.questions.map((q, i) => (
                    <div key={i} className="mt-3">
                      <p className="font-extrabold">
                        {i + 1}. {q.libelle || 'Question'}
                      </p>
                      {q.type === 'choix' || q.type === 'multiple' ? (
                        <ul className="mt-1 flex flex-col gap-1">
                          {(q.options ?? []).filter(Boolean).map((o) => (
                            <li key={o} className="rounded-lg px-2 py-1.5 ring-1 ring-primary/15">
                              {o}
                            </li>
                          ))}
                        </ul>
                      ) : q.type === 'note' ? (
                        <p className="mt-1 flex gap-1">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <span key={n} className="grid size-8 place-items-center rounded-lg ring-1 ring-primary/15">
                              {n}
                            </span>
                          ))}
                        </p>
                      ) : (
                        <p className="mt-1 h-12 rounded-lg ring-1 ring-primary/15" />
                      )}
                    </div>
                  ))
                : null}
            </div>
            <div className="border-t border-primary/10 p-3">
              <p className="font-heading grid h-11 place-items-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground">
                {b.type === 'sondage' ? 'Envoyer mes réponses' : b.lien ? b.lienLibelle || 'Voir' : 'Compris'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}
