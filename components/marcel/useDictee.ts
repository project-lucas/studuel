'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'

// La reconnaissance vocale du navigateur (Web Speech API) : gratuite, sans
// serveur, sans jeton. Chrome et Safari la proposent (préfixée `webkit`),
// Firefox non — le micro ne s'affiche alors simplement pas.
type Reconnaissance = {
  lang: string
  interimResults: boolean
  continuous: boolean
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
}
type Constructeur = new () => Reconnaissance

function constructeur(): Constructeur | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as { SpeechRecognition?: Constructeur; webkitSpeechRecognition?: Constructeur }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

const rien = () => () => {}

/**
 * DICTER SA QUESTION À MARCEL (16/10/2026) — la critique du bureau : « un élève
 * de 6e peu à l'aise à l'écrit a besoin de la voix ». Le texte dicté est
 * AJOUTÉ au champ ; c'est l'élève qui relit et envoie (rien ne part tout seul).
 */
export function useDictee(ajouter: (texte: string) => void) {
  // `false` côté serveur, la vraie réponse au client : pas d'écart d'hydratation.
  const possible = useSyncExternalStore(rien, () => constructeur() !== null, () => false)
  const [ecoute, setEcoute] = useState(false)
  const reco = useRef<Reconnaissance | null>(null)
  const ajouterRef = useRef(ajouter)
  useEffect(() => {
    ajouterRef.current = ajouter
  }, [ajouter])

  const arreter = useCallback(() => {
    reco.current?.stop()
  }, [])

  const demarrer = useCallback(() => {
    const C = constructeur()
    if (!C || reco.current) return
    const r = new C()
    r.lang = 'fr-FR'
    r.interimResults = false
    r.continuous = false
    r.onresult = (e) => {
      const morceaux: string[] = []
      for (let i = 0; i < e.results.length; i += 1) morceaux.push(e.results[i][0].transcript)
      const texte = morceaux.join(' ').trim()
      if (texte) ajouterRef.current(texte)
    }
    const fin = () => {
      reco.current = null
      setEcoute(false)
    }
    r.onend = fin
    r.onerror = fin
    reco.current = r
    setEcoute(true)
    try {
      r.start()
    } catch {
      fin()
    }
  }, [])

  // Quitter l'écran coupe le micro.
  useEffect(() => () => reco.current?.abort(), [])

  return { possible, ecoute, demarrer, arreter }
}
