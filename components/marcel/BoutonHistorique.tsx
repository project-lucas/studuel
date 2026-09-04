'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import { Check, History, Pencil, Plus, Trash2, X } from 'lucide-react'
import BottomSheet from '@/components/carnet/BottomSheet'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sounds'
import { toast } from '@/lib/toast'
import { MAX_TITRE_LEN, quandDit } from '@/lib/coach/conversations'
import type { ConversationResume } from '@/lib/coach/conversations'
import {
  listerConversations,
  renommerConversation,
  supprimerConversation,
} from '@/app/marcel/conversations-actions'
import { useCoachFil } from './CoachFil'

// L'HISTORIQUE — la pastille sous la flèche de retour, et la feuille qu'elle
// ouvre.
//
// Une conversation qui disparaît au rechargement n'est pas une conversation.
// La pastille est posée SOUS la flèche de sortie, dans la même colonne et avec
// le même objet (disque blanc, icône violette, creux au doigt) : deux gestes de
// navigation voisins se ressemblent, on ne les cherche pas.
//
// La liste n'est chargée QU'À L'OUVERTURE de la feuille. C'est une requête que
// l'écran d'accueil n'a aucune raison de payer pour un panneau que la plupart
// des élèves n'ouvriront pas.
//
// Chaque ligne se RENOMME et se SUPPRIME, sur place. Le renommage se fait dans
// la ligne (pas de deuxième feuille par-dessus la première), et la suppression
// demande confirmation DANS la ligne aussi : un `confirm()` du navigateur
// bloque tout et fait sortir de l'app, pour un geste qui n'a rien de grave.
//
// La feuille est celle du carnet (components/carnet/BottomSheet) : voile, focus
// piégé, Échap, défilement verrouillé. Rien à réécrire.

export default function BoutonHistorique() {
  const { id: filCourant, ouvrir, nouveau } = useCoachFil()
  const [ouverte, setOuverte] = useState(false)
  const [fils, setFils] = useState<ConversationResume[] | null>(null)
  const [indisponible, setIndisponible] = useState(false)
  const [renomme, setRenomme] = useState<{ id: string; valeur: string } | null>(null)
  const [aSupprimer, setASupprimer] = useState<string | null>(null)
  const [pending, start] = useTransition()

  const recharger = useCallback(() => {
    start(async () => {
      const res = await listerConversations()
      setIndisponible(res.unavailable === true)
      setFils(res.conversations)
    })
  }, [])

  useEffect(() => {
    if (ouverte) recharger()
  }, [ouverte, recharger])

  const fermer = () => {
    setOuverte(false)
    setRenomme(null)
    setASupprimer(null)
  }

  const valider = (id: string) => {
    const valeur = renomme?.valeur ?? ''
    start(async () => {
      const res = await renommerConversation(id, valeur)
      if (!res.ok) {
        toast('Ce nom ne convient pas.', 'error')
        return
      }
      setFils((liste) =>
        (liste ?? []).map((f) => (f.id === id ? { ...f, titre: res.titre! } : f)),
      )
      setRenomme(null)
    })
  }

  const supprimer = (id: string) => {
    start(async () => {
      const res = await supprimerConversation(id)
      if (!res.ok) {
        toast('Suppression impossible.', 'error')
        return
      }
      setFils((liste) => (liste ?? []).filter((f) => f.id !== id))
      setASupprimer(null)
      // Le fil ouvert vient d'être effacé : l'écran repart à neuf plutôt que de
      // garder à l'affichage des messages qui n'existent plus.
      if (id === filCourant) nouveau()
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOuverte(true)
        }}
        aria-label="Tes conversations avec Marcel"
        className="bg-card text-primary flex size-10 shrink-0 items-center justify-center rounded-full shadow-sm ring-1 ring-black/5 transition active:translate-y-px active:scale-95"
      >
        <History aria-hidden="true" className="size-5" strokeWidth={2.6} />
      </button>

      <BottomSheet open={ouverte} onClose={fermer} title="Tes conversations">
        <button
          type="button"
          onClick={() => {
            sfx.tap()
            nouveau()
            fermer()
          }}
          className="font-heading bg-primary text-primary-foreground mb-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-4 text-[15px] font-extrabold shadow-[0_4px_0_color-mix(in_oklch,var(--primary),black_28%)] transition active:translate-y-px"
        >
          <Plus aria-hidden="true" className="size-4" strokeWidth={2.6} />
          Nouvelle conversation
        </button>

        {indisponible ? (
          <p className="text-muted-foreground py-6 text-center text-[13px] leading-relaxed font-semibold">
            L’historique n’est pas encore ouvert sur ce compte. Tes questions
            fonctionnent, elles ne sont juste pas encore gardées.
          </p>
        ) : fils === null ? (
          <p className="text-muted-foreground py-6 text-center text-[13px] font-semibold">
            Un instant…
          </p>
        ) : fils.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center text-[13px] leading-relaxed font-semibold">
            Rien encore. Pose ta première question à Marcel : elle restera là,
            et tu pourras la retrouver demain.
          </p>
        ) : (
          <ul className="space-y-2">
            {fils.map((fil) => (
              <li
                key={fil.id}
                className={cn(
                  'bg-background/60 rounded-[18px] p-2 transition',
                  fil.id === filCourant &&
                    'ring-primary/40 bg-primary/8 ring-[1.5px]',
                )}
              >
                {renomme?.id === fil.id ? (
                  <form
                    className="flex items-center gap-2"
                    onSubmit={(e) => {
                      e.preventDefault()
                      valider(fil.id)
                    }}
                  >
                    <label className="sr-only" htmlFor={`titre-${fil.id}`}>
                      Nouveau nom de la conversation
                    </label>
                    <input
                      id={`titre-${fil.id}`}
                      autoFocus
                      value={renomme.valeur}
                      maxLength={MAX_TITRE_LEN}
                      onChange={(e) =>
                        setRenomme({ id: fil.id, valeur: e.target.value })
                      }
                      className="border-primary/40 focus:border-primary min-h-10 min-w-0 flex-1 rounded-xl border-[1.5px] bg-white px-3 text-[13px] font-bold outline-none"
                    />
                    <button
                      type="submit"
                      disabled={pending}
                      aria-label="Valider le nom"
                      className="bg-primary text-primary-foreground grid size-10 shrink-0 place-items-center rounded-xl disabled:opacity-40"
                    >
                      <Check aria-hidden="true" className="size-4" strokeWidth={2.8} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setRenomme(null)}
                      aria-label="Annuler le renommage"
                      className="text-muted-foreground grid size-10 shrink-0 place-items-center rounded-xl"
                    >
                      <X aria-hidden="true" className="size-4" strokeWidth={2.8} />
                    </button>
                  </form>
                ) : aSupprimer === fil.id ? (
                  <div className="flex items-center gap-2">
                    <p className="min-w-0 flex-1 px-1 text-[13px] font-bold">
                      Supprimer « {fil.titre} » ?
                    </p>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => supprimer(fil.id)}
                      className="bg-destructive min-h-10 shrink-0 rounded-xl px-3 text-xs font-extrabold text-white disabled:opacity-40"
                    >
                      Supprimer
                    </button>
                    <button
                      type="button"
                      onClick={() => setASupprimer(null)}
                      className="text-muted-foreground min-h-10 shrink-0 rounded-xl px-2 text-xs font-extrabold"
                    >
                      Non
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        sfx.tap()
                        ouvrir(fil.id)
                        fermer()
                      }}
                      className="min-h-11 min-w-0 flex-1 px-1.5 text-left"
                    >
                      <b className="block truncate text-[13.5px] font-extrabold">
                        {fil.titre}
                      </b>
                      <span className="text-muted-foreground text-[11px] font-semibold">
                        {quandDit(fil.maj)}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRenomme({ id: fil.id, valeur: fil.titre })}
                      aria-label={`Renommer « ${fil.titre} »`}
                      className="text-muted-foreground grid size-10 shrink-0 place-items-center rounded-xl transition active:translate-y-px"
                    >
                      <Pencil aria-hidden="true" className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setASupprimer(fil.id)}
                      aria-label={`Supprimer « ${fil.titre} »`}
                      className="text-muted-foreground grid size-10 shrink-0 place-items-center rounded-xl transition active:translate-y-px"
                    >
                      <Trash2 aria-hidden="true" className="size-4" />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </BottomSheet>
    </>
  )
}
