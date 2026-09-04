'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from 'react'
import { demanderAMarcel, type DemandeResult } from '@/app/marcel/actions'
import { chargerConversation } from '@/app/marcel/conversations-actions'
import type { Message } from '@/lib/coach/conversations'
import type { CarteIa } from '@/lib/coach/cartes-ia'
import type { PieceJointe } from '@/lib/coach/piece-jointe'
import { MODE_PAR_DEFAUT, type ModeCle } from '@/lib/coach/outils'

// LE FIL EN COURS — l'état partagé de l'écran du coach.
//
// Trois endroits de la page ont besoin du même état, et ils sont loin les uns
// des autres : la pastille d'historique (en haut), le RAIL des outils (au
// milieu, qui arme le mode) et le champ (tout en bas, qui envoie). Passer l'état
// de l'un à l'autre aurait obligé à remonter la moitié de la page en composant
// client ; un contexte le fait sans rien déplacer, et la page reste un
// composant serveur.
//
// L'ENVOI EST OPTIMISTE : la demande de l'élève s'affiche AVANT la réponse du
// modèle. C'est ce qui distingue une conversation d'un formulaire — sans ça, on
// tape, tout disparaît, et il ne se passe rien pendant trois secondes. Si
// l'appel échoue, la demande est retirée du fil et l'appelant reçoit le
// résultat pour le dire.

type Etat = {
  /** `null` = fil neuf, pas encore ouvert en base. */
  id: string | null
  titre: string | null
  messages: Message[]
  /** Les cartes du dernier « flashcards » — en attente de relecture. */
  cartes: CarteIa[] | null
}

type FilContexte = Etat & {
  /** Un envoi (ou un chargement) est en cours. */
  occupe: boolean
  /** Ce que Marcel va faire de la prochaine demande. */
  mode: ModeCle
  choisirMode: (mode: ModeCle) => void
  envoyer: (
    texte: string,
    matiere: string | null,
    piece?: PieceJointe | null,
  ) => Promise<DemandeResult>
  ouvrir: (id: string) => void
  nouveau: () => void
  oublierCartes: () => void
  /** Le fil a-t-il au moins un échange complet ? (bouton « dans mon carnet ») */
  rangeable: boolean
}

const VIDE: Etat = { id: null, titre: null, messages: [], cartes: null }

const Contexte = createContext<FilContexte | null>(null)

let compteur = 0
/** Identifiant local d'un message affiché avant d'exister en base. */
const idLocal = () => `local-${++compteur}`

export function CoachFilProvider({ children }: { children: ReactNode }) {
  const [etat, setEtat] = useState<Etat>(VIDE)
  const [mode, setMode] = useState<ModeCle>(MODE_PAR_DEFAUT)
  const [occupe, start] = useTransition()

  const envoyer = useCallback(
    (
      texte: string,
      matiere: string | null,
      piece: PieceJointe | null = null,
    ): Promise<DemandeResult> => {
      const question = texte.trim()
      if (question.length === 0 && !piece) return Promise.resolve({ ok: false })

      // Ce que l'élève voit de sa propre demande : son texte, et la mention de
      // ce qu'il a joint — la photo elle-même n'est pas gardée.
      const vu =
        question.length > 0
          ? piece
            ? `${question} · ${piece.type === 'image' ? '📎 photo' : `📎 ${piece.nom}`}`
            : question
          : piece?.type === 'image'
            ? '📎 photo'
            : `📎 ${piece?.nom ?? 'document'}`

      const provisoire: Message = { id: idLocal(), role: 'eleve', texte: vu }
      setEtat((e) => ({
        ...e,
        cartes: null,
        messages: [...e.messages, provisoire],
      }))

      return new Promise<DemandeResult>((resolve) => {
        start(async () => {
          const res = await demanderAMarcel(question, matiere, etat.id, {
            mode,
            piece,
          })

          setEtat((e) => {
            if (!res.ok || !res.reponse) {
              // Refus (quota, plafond, pièce illisible, panne) : on retire la
              // demande du fil plutôt que de la laisser sans réponse, ce qui se
              // lirait comme un message perdu.
              return {
                ...e,
                messages: e.messages.filter((m) => m.id !== provisoire.id),
              }
            }
            return {
              id: res.conversationId ?? e.id,
              titre: res.titre ?? e.titre,
              cartes: res.cartes ?? null,
              messages: [
                ...e.messages,
                { id: idLocal(), role: 'marcel', texte: res.reponse },
              ],
            }
          })

          resolve(res)
        })
      })
    },
    [etat.id, mode],
  )

  const ouvrir = useCallback((id: string) => {
    start(async () => {
      const res = await chargerConversation(id)
      if (!res.ok) return
      setEtat({
        id,
        titre: res.titre ?? null,
        messages: res.messages,
        // Les cartes ne sont pas gardées en base : rouvrir un vieux fil ne
        // ressuscite pas un écran de relecture dont les cartes sont peut-être
        // déjà rangées.
        cartes: null,
      })
    })
  }, [])

  const nouveau = useCallback(() => {
    setEtat(VIDE)
    setMode(MODE_PAR_DEFAUT)
  }, [])

  const oublierCartes = useCallback(
    () => setEtat((e) => ({ ...e, cartes: null })),
    [],
  )

  const valeur = useMemo<FilContexte>(
    () => ({
      ...etat,
      occupe,
      mode,
      choisirMode: setMode,
      envoyer,
      ouvrir,
      nouveau,
      oublierCartes,
      rangeable:
        etat.id !== null && etat.messages.some((m) => m.role === 'marcel'),
    }),
    [etat, occupe, mode, envoyer, ouvrir, nouveau, oublierCartes],
  )

  return <Contexte.Provider value={valeur}>{children}</Contexte.Provider>
}

export function useCoachFil(): FilContexte {
  const valeur = useContext(Contexte)
  if (!valeur) {
    throw new Error('useCoachFil doit être appelé sous <CoachFilProvider>')
  }
  return valeur
}
