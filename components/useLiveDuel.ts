'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { channelName, liveWinner, type RoundRecord } from '@/lib/duel-live'
import { ROUND_SIZE, ROUNDS_TO_WIN, type RoundWinner } from '@/lib/defi-modes'

// Nombre max de questions à partager (BO3 : jusqu'à 3 manches).
const MAX_QUESTIONS = ROUND_SIZE * (ROUNDS_TO_WIN * 2 - 1)

export type LiveDuelPhase =
  | 'idle'
  | 'connecting'
  | 'waiting' // session créée, on attend le rival
  | 'active' // les deux joueurs sont là
  | 'done'
  | 'error'

export type LiveDuelState = {
  phase: LiveDuelPhase
  duelId: string | null
  isHost: boolean
  opponentPresent: boolean
  seed: string
  questionIds: string[]
  myRounds: RoundRecord[]
  theirRounds: RoundRecord[]
  winner: RoundWinner | null
}

const initialState: LiveDuelState = {
  phase: 'idle',
  duelId: null,
  isHost: false,
  opponentPresent: false,
  seed: '',
  questionIds: [],
  myRounds: [],
  theirRounds: [],
  winner: null,
}

// Hook de transport pour un duel temps réel. Gère le canal Realtime (présence
// du rival + échange des manches par broadcast) ; la logique de jeu et l'UI
// restent au composant. Le partage des questions passe par la table
// (create_live_duel / join_live_duel), l'ordre par la graine (lib/duel-live).
export function useLiveDuel(userId: string) {
  const [state, setState] = useState<LiveDuelState>(initialState)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const supabaseRef = useRef(createClient())

  const teardown = useCallback(() => {
    const ch = channelRef.current
    if (ch) {
      supabaseRef.current.removeChannel(ch)
      channelRef.current = null
    }
  }, [])

  useEffect(() => teardown, [teardown])

  // Abonnement au canal du duel : présence (rival en ligne) + manches reçues.
  const connect = useCallback(
    (duelId: string) => {
      teardown()
      const supabase = supabaseRef.current
      const channel = supabase.channel(channelName(duelId), {
        config: { presence: { key: userId } },
      })

      channel
        .on('broadcast', { event: 'round' }, ({ payload }) => {
          const r = payload as RoundRecord
          setState((s) => {
            if (s.theirRounds.some((x) => x.round === r.round)) return s
            const theirRounds = [...s.theirRounds, r]
            return {
              ...s,
              theirRounds,
              winner: liveWinner(s.myRounds, theirRounds),
            }
          })
        })
        .on('presence', { event: 'sync' }, () => {
          const others = Object.keys(channel.presenceState()).filter(
            (k) => k !== userId,
          )
          setState((s) => ({
            ...s,
            opponentPresent: others.length > 0,
            phase:
              others.length > 0 && s.phase === 'waiting' ? 'active' : s.phase,
          }))
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            channel.track({ online: true, at: Date.now() })
          }
        })

      channelRef.current = channel
    },
    [teardown, userId],
  )

  // Hôte : crée la session avec la liste partagée de questions.
  const create = useCallback(
    async (subject: string, orderedQuestionIds: string[]) => {
      const ids = orderedQuestionIds.slice(0, MAX_QUESTIONS)
      const seed =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${userId}-${ids[0] ?? 'x'}`
      setState({ ...initialState, phase: 'connecting' })
      const { data, error } = await supabaseRef.current.rpc('create_live_duel', {
        p_subject: subject,
        p_seed: seed,
        p_question_ids: ids,
      })
      if (error || !data) {
        setState((s) => ({ ...s, phase: 'error' }))
        return null
      }
      const duelId = data as string
      setState((s) => ({
        ...s,
        phase: 'waiting',
        duelId,
        isHost: true,
        seed,
        questionIds: ids,
      }))
      connect(duelId)
      return duelId
    },
    [connect, userId],
  )

  // Rival : rejoint une session par son code (l'id du duel).
  const join = useCallback(
    async (duelId: string) => {
      setState({ ...initialState, phase: 'connecting' })
      const { data, error } = await supabaseRef.current.rpc('join_live_duel', {
        p_id: duelId,
      })
      if (error || !data) {
        setState((s) => ({ ...s, phase: 'error' }))
        return null
      }
      const info = data as {
        id: string
        subject: string
        seed: string
        question_ids: string[]
      }
      setState((s) => ({
        ...s,
        phase: 'active',
        duelId: info.id,
        isHost: false,
        seed: info.seed,
        questionIds: info.question_ids,
      }))
      connect(info.id)
      return info
    },
    [connect],
  )

  // Déclare une manche : broadcast au rival + mise à jour locale.
  const sendRound = useCallback((record: RoundRecord) => {
    const ch = channelRef.current
    if (ch) {
      ch.send({ type: 'broadcast', event: 'round', payload: record })
    }
    setState((s) => {
      if (s.myRounds.some((x) => x.round === record.round)) return s
      const myRounds = [...s.myRounds, record]
      return { ...s, myRounds, winner: liveWinner(myRounds, s.theirRounds) }
    })
  }, [])

  // Persiste ses manches (historique) et clôt côté serveur si les deux ont fini.
  const persist = useCallback(async (duelId: string, rounds: RoundRecord[]) => {
    await supabaseRef.current.rpc('submit_live_rounds', {
      p_id: duelId,
      p_rounds: rounds,
    })
  }, [])

  const leave = useCallback(() => {
    teardown()
    setState(initialState)
  }, [teardown])

  return { state, create, join, sendRound, persist, leave }
}
