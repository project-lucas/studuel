'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react'

/**
 * LA VOIX DE LA DICTÉE.
 *
 * La synthèse vocale du navigateur (Web Speech API) lit le texte du segment.
 * Pas de fichiers audio : ils demanderaient un studio avant la première dictée
 * et des mégaoctets à servir pour chacune. La colonne `audio_url` existe en base
 * pour le jour où un enregistrement humain remplace la voix — le contrat de ce
 * hook ne changera pas.
 *
 * DEUX RÉGLAGES QUI FONT TOUTE LA DIFFÉRENCE :
 *   • le DÉBIT est ralenti. Une dictée lue au débit d'une notification est
 *     inécrivable — un professeur dicte lentement, en détachant.
 *   • la voix est FRANÇAISE, choisie explicitement. Sans `lang`, le navigateur
 *     sert sa voix par défaut, qui lit « Faval » à l'anglaise.
 */

/** Débit de lecture : nettement sous la normale, comme une vraie dictée. */
export const DEBIT_DICTEE = 0.75

export type EtatLecture = 'muet' | 'lecture'

/**
 * Le navigateur sait-il lire à voix haute ?
 *
 * Lu par `useSyncExternalStore` et non par un `setState` dans un effet : c'est
 * une CAPACITÉ, pas un état — elle ne change jamais pendant la vie de la page.
 * Le poser en état déclenchait un rendu en cascade au montage (et la règle
 * `react-hooks/set-state-in-effect` le refuse, à raison). Le troisième argument
 * est l'instantané SERVEUR : sans lui, le rendu serveur et le rendu client
 * divergeraient et React signalerait une erreur d'hydratation.
 */
const sansAbonnement = () => () => {}
const lireSupport = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window
const supportServeur = () => false

export function useLecteurDictee() {
  const [etat, setEtat] = useState<EtatLecture>('muet')
  const [pret, setPret] = useState(false)
  const voixRef = useRef<SpeechSynthesisVoice | null>(null)
  const supporte = useSyncExternalStore(
    sansAbonnement,
    lireSupport,
    supportServeur,
  )

  useEffect(() => {
    if (!supporte) return
    // La liste des voix arrive de façon asynchrone sur certains navigateurs :
    // on écoute l'événement en plus de lire tout de suite. `setPret` est appelé
    // depuis CE rappel (et non dans le corps de l'effet) : c'est bien un
    // abonnement à un système extérieur, ce que React autorise.
    const choisir = () => {
      const voix = window.speechSynthesis.getVoices()
      if (voix.length === 0) return
      voixRef.current =
        voix.find((v) => v.lang?.toLowerCase().startsWith('fr')) ?? null
      setPret(true)
    }
    choisir()
    window.speechSynthesis.addEventListener('voiceschanged', choisir)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', choisir)
      // Quitter l'écran doit faire taire la voix — sinon elle continue de lire
      // par-dessus l'écran suivant.
      window.speechSynthesis.cancel()
    }
  }, [supporte])

  const lire = useCallback((texte: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const t = String(texte ?? '').trim()
    if (t.length === 0) return
    const synth = window.speechSynthesis
    // On coupe TOUJOURS avant de relancer : deux segments qui se superposent
    // sont pires qu'un segment manquant.
    synth.cancel()
    const message = new SpeechSynthesisUtterance(t)
    message.lang = 'fr-FR'
    if (voixRef.current) message.voice = voixRef.current
    message.rate = DEBIT_DICTEE
    message.onend = () => setEtat('muet')
    message.onerror = () => setEtat('muet')
    setEtat('lecture')
    synth.speak(message)
  }, [])

  const couper = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    setEtat('muet')
  }, [])

  return { etat, pret, supporte, lire, couper }
}
