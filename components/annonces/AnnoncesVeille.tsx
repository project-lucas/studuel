'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Check, ClipboardList, Megaphone, MessageCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import {
  annonceRecueDepuis,
  prochaineAnnonce,
  reponsesPropres,
  type AnnonceRecue,
  type Reponse,
} from '@/lib/annonces/annonces'
import { estEspaceAdmin, estEspaceCoach, estEspaceMessages, estOnboarding, estPleinEcran } from '@/lib/quiz-chrome'
import { cn } from '@/lib/utils'

const INTERVALLE_MS = 10 * 60_000
const CLE_BANDEAU = 'studuel_messages_bandeau'

/**
 * LES ANNONCES ET SONDAGES, CÔTÉ ÉLÈVE ET PARENT (16/10/2026, migration 588).
 * Au lancement et au retour dans l'app (au plus toutes les 10 min), elle relit
 * ce qui l'attend (`/api/annonces`) et montre UNE fenêtre à la fois : un
 * message (« Fermer » le range pour de bon) ou un sondage (« Plus tard » le
 * repousse à la prochaine visite, « Envoyer » le range). Et si son coach lui
 * a écrit, un bandeau mène aux messages. Jamais en pleine partie, ni dans la
 * console, ni pendant l'inscription.
 */
export default function AnnoncesVeille() {
  const pathname = usePathname()
  const supabase = useMemo(() => createClient(), [])
  const [annonces, setAnnonces] = useState<AnnonceRecue[]>([])
  const [ecartees, setEcartees] = useState<Set<string>>(new Set())
  const [nonLus, setNonLus] = useState(0)
  const [bandeauFerme, setBandeauFerme] = useState(false)
  const derniere = useRef(0)
  const masque = estPleinEcran(pathname) || estOnboarding(pathname) || estEspaceCoach(pathname) || estEspaceAdmin(pathname) || estEspaceMessages(pathname)

  const relire = useCallback(() => {
    if (document.visibilityState !== 'visible' || Date.now() - derniere.current < INTERVALLE_MS) return
    derniere.current = Date.now()
    fetch('/api/annonces', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { annonces?: unknown[]; nonLus?: number } | null) => {
        if (!d) return
        setAnnonces((d.annonces ?? []).map((a) => annonceRecueDepuis(a as Record<string, unknown>)))
        setNonLus(Number(d.nonLus ?? 0) || 0)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    // Laisse l'app s'afficher avant de proposer quoi que ce soit.
    const t = setTimeout(() => {
      try {
        setBandeauFerme(sessionStorage.getItem(CLE_BANDEAU) === '1')
      } catch {
        // Stockage indisponible : le bandeau reste proposé.
      }
      relire()
    }, 2500)
    document.addEventListener('visibilitychange', relire)
    return () => {
      clearTimeout(t)
      document.removeEventListener('visibilitychange', relire)
    }
  }, [relire])

  const courante = masque ? null : prochaineAnnonce(annonces, ecartees)

  // « vue » : la première fois que la fenêtre s'ouvre.
  useEffect(() => {
    if (courante) void supabase.rpc('annonce_marquer', { p_annonce: courante.id, p_quoi: 'vue' })
  }, [courante, supabase])

  const ecarter = (id: string, quoi: 'fermee' | 'clic' | null) => {
    setEcartees((s) => new Set(s).add(id))
    if (quoi) void supabase.rpc('annonce_marquer', { p_annonce: id, p_quoi: quoi })
  }

  if (masque) return null

  return (
    <>
      {nonLus > 0 && !bandeauFerme && !courante ? (
        <div className="fixed inset-x-0 top-[calc(0.5rem+env(safe-area-inset-top))] z-[75] mx-auto flex w-[min(28rem,calc(100%-1.5rem))] items-center gap-3 rounded-2xl bg-card p-3 shadow-xl ring-1 ring-primary/15">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
            <MessageCircle className="size-5" aria-hidden="true" />
          </span>
          <Link href="/messages" onClick={() => setNonLus(0)} className="min-w-0 flex-1">
            <span className="block text-sm font-extrabold">
              {nonLus} nouveau{nonLus > 1 ? 'x' : ''} message{nonLus > 1 ? 's' : ''}
            </span>
            <span className="block text-xs font-semibold text-muted-foreground">De ton coach · touche pour lire</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              setBandeauFerme(true)
              try {
                sessionStorage.setItem(CLE_BANDEAU, '1')
              } catch {
                // Idem.
              }
            }}
            aria-label="Fermer"
            className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-secondary"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}
      {courante ? <FenetreAnnonce key={courante.id} annonce={courante} onEcarter={ecarter} /> : null}
    </>
  )
}

function FenetreAnnonce({ annonce, onEcarter }: { annonce: AnnonceRecue; onEcarter: (id: string, quoi: 'fermee' | 'clic' | null) => void }) {
  const supabase = useMemo(() => createClient(), [])
  const [reponses, setReponses] = useState<Record<string, Reponse | undefined>>({})
  const [etat, setEtat] = useState<'saisie' | 'envoi' | 'merci' | 'erreur'>('saisie')
  const sondage = annonce.type === 'sondage'
  const pret = sondage ? reponsesPropres(annonce.questions, reponses) !== null : true

  const envoyer = async () => {
    const propres = reponsesPropres(annonce.questions, reponses)
    if (!propres) return
    setEtat('envoi')
    const { data, error } = await supabase.rpc('sondage_repondre', { p_annonce: annonce.id, p_reponses: propres })
    if (error || (data !== 'ok' && data !== 'deja')) return setEtat('erreur')
    setEtat('merci')
    setTimeout(() => onEcarter(annonce.id, null), 1400)
  }

  return (
    <div className="fixed inset-0 z-[85] flex items-end justify-center bg-foreground/40 p-3 sm:items-center" role="dialog" aria-modal="true" aria-labelledby={`annonce-${annonce.id}`}>
      <div className="flex max-h-[88dvh] w-full max-w-lg flex-col overflow-hidden rounded-carte bg-card shadow-2xl">
        <div className="flex items-start gap-3 border-b border-primary/10 p-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
            {sondage ? <ClipboardList className="size-5" aria-hidden="true" /> : <Megaphone className="size-5" aria-hidden="true" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="surtitre">{annonce.auteurCoach ? `${annonce.auteur} · ton coach` : 'L’équipe Studuel'}</p>
            <h2 id={`annonce-${annonce.id}`} className="font-heading text-xl leading-tight font-extrabold">
              {annonce.titre}
            </h2>
          </div>
          <button type="button" onClick={() => onEcarter(annonce.id, sondage ? null : 'fermee')} aria-label={sondage ? 'Plus tard' : 'Fermer'} className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-secondary">
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {annonce.corps ? <p className="text-[15px] whitespace-pre-wrap">{annonce.corps}</p> : null}
          {sondage && etat !== 'merci' ? (
            <div className="mt-3 flex flex-col gap-5">
              {annonce.questions.map((q, i) => (
                <fieldset key={q.id}>
                  <legend className="text-sm font-extrabold">
                    {i + 1}. {q.libelle}
                  </legend>
                  {q.type === 'choix' || q.type === 'multiple' ? (
                    <div className="mt-2 flex flex-col gap-1.5">
                      {(q.options ?? []).map((o) => {
                        const actuelle = reponses[q.id]
                        const coche = q.type === 'choix' ? actuelle === o : Array.isArray(actuelle) && actuelle.includes(o)
                        return (
                          <button
                            key={o}
                            type="button"
                            aria-pressed={coche}
                            onClick={() =>
                              setReponses((r) => {
                                if (q.type === 'choix') return { ...r, [q.id]: o }
                                const liste = Array.isArray(r[q.id]) ? (r[q.id] as string[]) : []
                                return { ...r, [q.id]: liste.includes(o) ? liste.filter((x) => x !== o) : [...liste, o] }
                              })
                            }
                            className={cn(
                              'flex min-h-11 items-center gap-2 rounded-xl px-3 text-left text-sm font-bold ring-1 transition-colors',
                              coche ? 'bg-secondary ring-primary' : 'ring-primary/15 hover:bg-secondary/50',
                            )}
                          >
                            <span className={cn('grid size-5 shrink-0 place-items-center border-2', q.type === 'choix' ? 'rounded-full' : 'rounded-md', coche ? 'border-primary bg-primary text-primary-foreground' : 'border-primary/30')}>
                              {coche ? <Check className="size-3" aria-hidden="true" /> : null}
                            </span>
                            {o}
                          </button>
                        )
                      })}
                      {q.type === 'multiple' ? <p className="text-xs font-semibold text-muted-foreground">Plusieurs réponses possibles.</p> : null}
                    </div>
                  ) : q.type === 'note' ? (
                    <div className="mt-2 flex gap-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          aria-pressed={reponses[q.id] === n}
                          aria-label={`${n} sur 5`}
                          onClick={() => setReponses((r) => ({ ...r, [q.id]: n }))}
                          className={cn('font-heading grid size-12 place-items-center rounded-xl text-lg font-extrabold ring-1', reponses[q.id] === n ? 'bg-primary text-primary-foreground ring-primary' : 'ring-primary/15 hover:bg-secondary')}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      value={typeof reponses[q.id] === 'string' ? (reponses[q.id] as string) : ''}
                      onChange={(e) => setReponses((r) => ({ ...r, [q.id]: e.target.value }))}
                      maxLength={1000}
                      rows={3}
                      placeholder="Ta réponse…"
                      className="mt-2 w-full rounded-xl border bg-background px-3 py-2 text-sm"
                    />
                  )}
                </fieldset>
              ))}
              {annonce.anonyme ? <p className="text-xs font-semibold text-muted-foreground">Sondage anonyme : ton prénom n’est pas montré avec tes réponses.</p> : null}
            </div>
          ) : null}
          {etat === 'merci' ? (
            <p className="font-heading mt-4 flex items-center gap-2 text-lg font-extrabold text-(--success)">
              <Check className="size-5" aria-hidden="true" /> Merci pour tes réponses !
            </p>
          ) : null}
          {etat === 'erreur' ? <p className="mt-3 text-sm font-bold text-(--destructive)" role="alert">L’envoi a échoué. Réessaie.</p> : null}
        </div>

        <div className="flex flex-col gap-2 border-t border-primary/10 p-4 sm:flex-row-reverse">
          {sondage ? (
            etat !== 'merci' ? (
              <>
                <Button size="xl" className="sm:flex-1" disabled={!pret || etat === 'envoi'} onClick={envoyer}>
                  Envoyer mes réponses
                </Button>
                <Button size="xl" variant="ghost" onClick={() => onEcarter(annonce.id, 'fermee')}>
                  Ne pas répondre
                </Button>
              </>
            ) : null
          ) : (
            <>
              {annonce.lien ? (
                <Button size="xl" className="sm:flex-1" asChild>
                  <Link href={annonce.lien} onClick={() => onEcarter(annonce.id, 'clic')}>
                    {annonce.lienLibelle ?? 'Voir'}
                  </Link>
                </Button>
              ) : null}
              <Button size="xl" variant={annonce.lien ? 'ghost' : 'default'} className={annonce.lien ? '' : 'sm:flex-1'} onClick={() => onEcarter(annonce.id, 'fermee')}>
                {annonce.lien ? 'Plus tard' : 'Compris'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
