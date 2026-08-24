'use client'

import { useEffect, useState } from 'react'
import { Volume2 } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Le bouton « écouter » d'une face de flashcard.
 *
 * Les colonnes `langue_recto` / `langue_verso` existaient EN BASE depuis la
 * migration 186 sans que rien ne s'en serve : le carnet était muet, alors que
 * les langues sont le premier usage des flashcards. La synthèse vocale du
 * navigateur (Web Speech API) suffit et ne coûte pas un octet de dépendance.
 *
 * Le bouton ne s'affiche que si la voix EXISTE réellement : proposer d'écouter
 * puis ne rien émettre est pire que ne rien proposer.
 */

const LOCALE: Record<string, string> = {
  fr: 'fr-FR',
  en: 'en-GB',
  es: 'es-ES',
  de: 'de-DE',
  it: 'it-IT',
  // Le latin n'est parlé par aucune voix installée : on le lit à l'italienne,
  // qui en est la prononciation scolaire la plus proche.
  la: 'it-IT',
}

export default function BoutonEcouter({
  texte,
  langue,
  className,
}: {
  texte: string
  langue: string | null
  className?: string
}) {
  const [possible, setPossible] = useState(false)
  const [enCours, setEnCours] = useState(false)

  useEffect(() => {
    // `speechSynthesis` manque sur certains navigateurs, et la liste des voix
    // arrive de façon asynchrone sur d'autres : on écoute les deux cas.
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    const verifier = () => setPossible(window.speechSynthesis.getVoices().length > 0)
    verifier()
    window.speechSynthesis.addEventListener('voiceschanged', verifier)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', verifier)
      // Une face quittée pendant qu'elle parle doit se taire.
      window.speechSynthesis.cancel()
    }
  }, [])

  if (!possible || langue === null || texte.trim().length === 0) return null

  const parler = () => {
    const synth = window.speechSynthesis
    synth.cancel()
    const message = new SpeechSynthesisUtterance(texte)
    message.lang = LOCALE[langue] ?? 'fr-FR'
    // Un peu plus lent que la normale : c'est un mot qu'on apprend, pas une
    // notification qu'on écarte.
    message.rate = 0.9
    message.onend = () => setEnCours(false)
    message.onerror = () => setEnCours(false)
    setEnCours(true)
    synth.speak(message)
  }

  return (
    <button
      type="button"
      onClick={parler}
      aria-label={`Écouter « ${texte.slice(0, 60)} »`}
      className={cn(
        'flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/80 text-primary ring-1 ring-black/5 transition active:scale-95',
        enCours && 'animate-pulse',
        className,
      )}
    >
      <Volume2 className="size-4" strokeWidth={2.2} aria-hidden="true" />
    </button>
  )
}
