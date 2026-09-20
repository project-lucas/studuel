'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { channelName, liveWinner, type RoundRecord } from '@/lib/duel-live'
import { botJoinDelayMs, botRound } from '@/lib/duel-live-bot'
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
  /**
   * Le ROBOT qui tient la place du rival (lib/duel-live-bot), ou null quand
   * un vrai joueur est attendu. Son niveau de référence est celui de l'élève :
   * c'est lui qui règle sa précision.
   */
  bot: { id: string; myLevel: number } | null
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
  bot: null,
}

// Hook de transport pour un duel temps réel. Gère le canal Realtime (présence
// du rival + échange des manches par broadcast) ; la logique de jeu et l'UI
// restent au composant. Le partage des questions passe par la table
// (create_live_duel / join_live_duel), l'ordre par la graine (lib/duel-live).
export function useLiveDuel(userId: string) {
  const [state, setState] = useState<LiveDuelState>(initialState)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const supabaseRef = useRef(createClient())
  // La minuterie du robot (arrivée, puis une par manche) : gardée pour être
  // annulée quand on quitte, sinon une manche tomberait dans un duel fini.
  const botTimerRef = useRef<{ round: number; id: number } | null>(null)
  // Mes manches déjà jouées, pour les RENVOYER quand le rival (re)paraît : un
  // broadcast part une fois, sans accusé de réception. Une manche envoyée
  // pendant que le téléphone du rival reconnectait (iOS coupe les websockets en
  // arrière-plan) était perdue pour de bon, et il attendait indéfiniment « la
  // manche du rival ». La réception écarte déjà les doublons (par numéro).
  const mesManchesRef = useRef<RoundRecord[]>([])

  const clearBotTimer = useCallback(() => {
    if (botTimerRef.current) {
      window.clearTimeout(botTimerRef.current.id)
      botTimerRef.current = null
    }
  }, [])

  const teardown = useCallback(() => {
    clearBotTimer()
    const ch = channelRef.current
    if (ch) {
      supabaseRef.current.removeChannel(ch)
      channelRef.current = null
    }
  }, [clearBotTimer])

  useEffect(() => teardown, [teardown])

  // Abonnement au canal du duel : présence (rival en ligne) + manches reçues.
  const connect = useCallback(
    (duelId: string) => {
      teardown()
      const supabase = supabaseRef.current
      // `private: true` n'est PAS cosmétique : les policies RLS posées sur
      // `realtime.messages` par la migration 178 ne s'appliquent QU'AUX canaux
      // privés. Sans ce drapeau, elles sont inertes et n'importe qui muni de la
      // clé anon (publique, dans le bundle JS) et d'un id de duel (fait pour
      // être partagé, affiché en QR) peut rejoindre le canal sans passer par
      // `join_live_duel` : espionner les manches, injecter de fausses réponses,
      // ou forcer la partie en `active` avant l'arrivée du vrai adversaire.
      //
      // ⚠️ DÉPENDANCE DE DÉPLOIEMENT : la migration 178 doit être exécutée
      // AVANT que ce code n'arrive en production. Sur un canal privé sans
      // policies, toutes les souscriptions sont refusées et les duels en direct
      // cessent purement et simplement de fonctionner.
      const channel = supabase.channel(channelName(duelId), {
        config: { presence: { key: userId }, private: true },
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
          if (others.length > 0) {
            for (const record of mesManchesRef.current) {
              channel.send({ type: 'broadcast', event: 'round', payload: record })
            }
          }
          setState((s) => ({
            ...s,
            opponentPresent: others.length > 0,
            phase:
              others.length > 0 && s.phase === 'waiting' ? 'active' : s.phase,
          }))
        })
        .subscribe((status, err) => {
          if (status === 'SUBSCRIBED') {
            channel.track({ online: true, at: Date.now() })
            return
          }
          // Le client Realtime rejoint tout seul après une coupure ; on le dit
          // au lieu de le taire (un canal refusé par les policies — migration
          // 178 absente — finissait sans une ligne de journal).
          if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            console.warn('[duel-live] canal', status, err?.message ?? '')
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
      mesManchesRef.current = []
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
      mesManchesRef.current = []
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
    if (!mesManchesRef.current.some((x) => x.round === record.round)) {
      mesManchesRef.current = [...mesManchesRef.current, record]
    }
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

  // ------------------------------------------------------------- LE ROBOT
  // Personne ne scanne le QR ? Un robot du banc prend la place du rival. Le
  // canal Realtime est coupé : à partir d'ici, la partie se joue en local, par
  // les mêmes états et les mêmes fonctions que face à un vrai joueur — c'est
  // ce qui la rend utile pour TESTER le duel en direct sans second appareil.
  // Il « rejoint » après un court délai, comme quelqu'un qui scanne.
  const challengeBot = useCallback(
    (botId: string, myLevel = 1) => {
      teardown()
      setState((s) => ({
        ...s,
        bot: { id: botId, myLevel },
        opponentPresent: false,
        theirRounds: [],
        winner: null,
      }))
      const id = window.setTimeout(() => {
        botTimerRef.current = null
        setState((s) =>
          s.bot?.id === botId
            ? { ...s, phase: 'active', opponentPresent: true }
            : s,
        )
      }, botJoinDelayMs(state.seed || botId))
      botTimerRef.current = { round: -1, id }
    },
    [teardown, state.seed],
  )

  // Le robot déclare la manche N quand elle a COMMENCÉ pour les deux camps
  // (chacun a fini la N-1), après le temps qu'il met à la jouer. Une seule
  // minuterie par manche : l'effet se relance à chaque changement d'état, mais
  // ne remet jamais le chronomètre d'une manche déjà lancée à zéro — sinon
  // l'élève qui finit la sienne repousserait celle du rival.
  useEffect(() => {
    const { bot, phase, myRounds, theirRounds, winner, seed } = state
    if (!bot || phase !== 'active' || winner) return
    const round = theirRounds.length
    if (myRounds.length < round) return
    if (botTimerRef.current?.round === round) return
    const record = botRound(bot.id, seed || bot.id, round, bot.myLevel)
    if (!record) return
    clearBotTimer()
    const id = window.setTimeout(() => {
      botTimerRef.current = null
      setState((s) => {
        if (s.bot?.id !== bot.id || s.winner) return s
        if (s.theirRounds.some((x) => x.round === record.round)) return s
        const next = [...s.theirRounds, record]
        return { ...s, theirRounds: next, winner: liveWinner(s.myRounds, next) }
      })
    }, record.timeMs)
    botTimerRef.current = { round, id }
  }, [state, clearBotTimer])

  const leave = useCallback(() => {
    teardown()
    mesManchesRef.current = []
    setState(initialState)
  }, [teardown])

  return { state, create, join, sendRound, persist, challengeBot, leave }
}
