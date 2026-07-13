'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import {
  coopChannelName,
  coopStatus,
  COOP_QUESTIONS,
  type CoopAnswer,
} from '@/lib/coop'

// On partage au plus COOP_QUESTIONS questions (la série d'équipe).
const MAX_QUESTIONS = COOP_QUESTIONS

export type CoopPhase =
  | 'idle'
  | 'connecting'
  | 'waiting' // session créée, on attend le partenaire
  | 'active' // les deux sont là
  | 'error'

export type CoopState = {
  phase: CoopPhase
  sessionId: string | null
  isHost: boolean
  partnerPresent: boolean
  seed: string
  questionIds: string[]
  myAnswers: CoopAnswer[]
  theirAnswers: CoopAnswer[]
  // Fin d'équipe : dérivée des deux camps (gagné / perdu / null).
  outcome: 'won' | 'lost' | null
}

const initialState: CoopState = {
  phase: 'idle',
  sessionId: null,
  isHost: false,
  partnerPresent: false,
  seed: '',
  questionIds: [],
  myAnswers: [],
  theirAnswers: [],
  outcome: null,
}

// Hook de transport d'une session coop (miroir de useLiveDuel). Canal Realtime :
// présence du partenaire + échange des réponses par broadcast. La logique de
// jeu (état d'équipe) reste pure dans lib/coop.ts.
export function useCoop(userId: string) {
  const [state, setState] = useState<CoopState>(initialState)
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

  const connect = useCallback(
    (sessionId: string) => {
      teardown()
      const supabase = supabaseRef.current
      const channel = supabase.channel(coopChannelName(sessionId), {
        config: { presence: { key: userId } },
      })

      channel
        .on('broadcast', { event: 'answer' }, ({ payload }) => {
          const ans = payload as CoopAnswer
          setState((s) => {
            if (s.theirAnswers.some((x) => x.q === ans.q)) return s
            const theirAnswers = [...s.theirAnswers, ans]
            return {
              ...s,
              theirAnswers,
              outcome: coopStatus(s.myAnswers, theirAnswers).outcome,
            }
          })
        })
        .on('presence', { event: 'sync' }, () => {
          const others = Object.keys(channel.presenceState()).filter(
            (k) => k !== userId,
          )
          setState((s) => ({
            ...s,
            partnerPresent: others.length > 0,
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
      const { data, error } = await supabaseRef.current.rpc('create_coop', {
        p_subject: subject,
        p_seed: seed,
        p_question_ids: ids,
      })
      if (error || !data) {
        setState((s) => ({ ...s, phase: 'error' }))
        return null
      }
      const sessionId = data as string
      setState((s) => ({
        ...s,
        phase: 'waiting',
        sessionId,
        isHost: true,
        seed,
        questionIds: ids,
      }))
      connect(sessionId)
      return sessionId
    },
    [connect, userId],
  )

  // Partenaire : rejoint une session par son code.
  const join = useCallback(
    async (sessionId: string) => {
      setState({ ...initialState, phase: 'connecting' })
      const { data, error } = await supabaseRef.current.rpc('join_coop', {
        p_id: sessionId,
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
        sessionId: info.id,
        isHost: false,
        seed: info.seed,
        questionIds: info.question_ids,
      }))
      connect(info.id)
      return info
    },
    [connect],
  )

  // Déclare une réponse : broadcast au partenaire + mise à jour locale.
  const sendAnswer = useCallback((answer: CoopAnswer) => {
    const ch = channelRef.current
    if (ch) {
      ch.send({ type: 'broadcast', event: 'answer', payload: answer })
    }
    setState((s) => {
      if (s.myAnswers.some((x) => x.q === answer.q)) return s
      const myAnswers = [...s.myAnswers, answer]
      return {
        ...s,
        myAnswers,
        outcome: coopStatus(myAnswers, s.theirAnswers).outcome,
      }
    })
  }, [])

  // Persiste ses réponses (historique) et clôt la session côté serveur.
  const persist = useCallback(async (sessionId: string, answers: CoopAnswer[]) => {
    await supabaseRef.current.rpc('submit_coop_answers', {
      p_id: sessionId,
      p_answers: answers,
    })
  }, [])

  const leave = useCallback(() => {
    teardown()
    setState(initialState)
  }, [teardown])

  return { state, create, join, sendAnswer, persist, leave }
}
