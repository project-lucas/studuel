'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { Swords } from 'lucide-react'
import { bossById } from '@/lib/bosses'
import { sfx } from '@/lib/sounds'
import { CLOCK_STEP_MS, useClock } from '@/lib/use-clock'
import { useDialogFocus } from '@/lib/use-dialog'
import {
  apparitionAlive,
  apparitionMessage,
  countdownLabel,
  type TraqueApparition,
} from '@/lib/traque'

/**
 * LE RIDEAU D'APPARITION — ce que l'élève voit quand SA jauge vient de déborder.
 *
 * Le geste est repris du Death Match de 7DS Grand Cross, et il tient à quatre
 * choses, dans cet ordre d'importance :
 *
 *  1. LE GARDIEN SORT D'UNE MASSE D'ENCRE. Elle occupe le haut de l'écran, son
 *     bord bas est bombé et irrégulier, et le personnage y est PRIS : il n'est
 *     pas posé sur un fond. Un portrait dans un rectangle est une illustration ;
 *     un portrait sans bord est une présence. C'est 80 % de l'effet.
 *  2. C'EST UNE INTERRUPTION, PAS UNE PAGE. L'écran de fin reste visible sous
 *     un voile LÉGER — on le devine encore derrière les mots. Le message est
 *     « tu faisais autre chose, et ça vient de te tomber dessus », pas « voici
 *     un nouvel écran ».
 *  3. LE CADRAGE EST SERRÉ. Nos images sont des bustes détourés : affichées
 *     ÉNORMES, débordant des deux bords, elles donnent exactement ça. Un
 *     plein-pied centré ferait l'inverse — petit, sage, lointain.
 *  4. LE TEXTE N'A PAS DE PANNEAU. Nom orné de filets, ligne de danger,
 *     punchline du boss, et deux issues — une qui fuit, une qui engage. Un
 *     panneau opaque rendrait à l'écran le cadre qu'on vient de lui retirer.
 *
 * QUAND il s'ouvre : jamais au milieu d'une question. Les Server Actions de fin
 * de séquence (quiz terminé, session « À revoir » finie) renvoient
 * l'apparition, et c'est l'écran de fin qui monte ce composant. La cause est
 * encore chaude, et « Le défier » n'arrache plus personne à son travail —
 * le travail vient précisément d'être bouclé.
 *
 * UNE FOIS PAR APPARITION : la clé de session mémorise le couple gardien +
 * fenêtre. Revenir en arrière, re-rendre, rejouer le quiz ne rouvre pas le
 * rideau. Le gardien reste appelé par la bannière de l'arène pendant l'heure.
 */
export default function BossApparition({
  apparition,
  onClose,
}: {
  apparition: TraqueApparition
  onClose?: () => void
}) {
  const router = useRouter()
  const reduce = useReducedMotion()
  const now = useClock(CLOCK_STEP_MS)
  const [visible, setVisible] = useState(false)
  const panel = useRef<HTMLDivElement>(null)
  const defierRef = useRef<HTMLButtonElement>(null)
  useDialogFocus(panel, visible)

  const boss = bossById(apparition.bossId)

  // Le rugissement ne se joue qu'UNE fois par apparition. La garde vit dans
  // l'effet (et non au rendu) : lire le stockage pendant le rendu donnerait
  // deux résultats différents au serveur et au client.
  useEffect(() => {
    if (!boss) return
    const key = `studuel-traque-rideau:${apparition.bossId}:${apparition.endsAt}`
    try {
      if (window.sessionStorage.getItem(key)) return
      window.sessionStorage.setItem(key, '1')
    } catch {
      // Stockage bloqué : on ouvre quand même. Un rideau de trop vaut mieux
      // qu'un gardien débusqué que personne ne voit sortir.
    }
    // L'écran de fin s'installe d'abord (le score, la mascotte), PUIS la tanière
    // s'ouvre. Sans ce battement, les deux animations se marchent dessus et
    // l'apparition passe pour un bug d'affichage.
    const timer = setTimeout(() => {
      setVisible(true)
      // Le SEUL son épique de l'app, rumble haptique compris. Il ne sert
      // aujourd'hui qu'au « MATCH CLASSÉ » — un gardien qui sort de sa tanière
      // est exactement le deuxième moment qui le mérite.
      sfx.battle()
    }, 700)
    return () => clearTimeout(timer)
  }, [apparition.bossId, apparition.endsAt, boss])

  useEffect(() => {
    if (visible) defierRef.current?.focus()
  }, [visible])

  if (!boss || !visible) return null

  // La fenêtre s'est refermée pendant que le rideau était ouvert (écran de fin
  // laissé de côté) : on retire l'appel plutôt que de promettre un combat que
  // le serveur refuserait.
  if (now !== null && !apparitionAlive(apparition, now)) return null

  const remaining = now === null ? null : apparition.endsAt - now

  const dismiss = () => {
    sfx.tap()
    setVisible(false)
    onClose?.()
  }

  const fight = () => {
    sfx.tap()
    setVisible(false)
    onClose?.()
    router.push(`/defi/traque/${boss.id}`)
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${apparitionMessage(boss)} ${boss.name}, ${boss.epithet}. Défiable pendant encore ${remaining === null ? 'une heure' : countdownLabel(remaining)}.`}
      className="traque-rideau fixed inset-0 z-50 flex flex-col justify-end"
    >
      {/* --- LA TACHE ET LE GARDIEN DEDANS. Il n'est pas posé sur un fond : il
          ÉMERGE d'une masse noire au bord déchiré, et déborde des deux côtés
          de l'écran. --- */}
      <div className="traque-rideau-encre" aria-hidden="true">
        <div className="traque-rideau-halo" />
        {/* Boîte volontairement plus LARGE que l'écran : sans elle l'image
            carrée se cale sur la largeur et le gardien tient sagement dedans. */}
        <div className="traque-rideau-scene">
          <motion.div
            className="traque-rideau-buste"
            // `scale: 1.04` est l'état de REPOS, pas un effet : c'est lui qui fait
            // déborder le gardien des deux bords de l'écran (cf. .traque-rideau-buste).
            // L'entrée part de plus loin encore — il fond sur le joueur.
            initial={
              reduce
                ? { opacity: 0, scale: 1.04 }
                : { opacity: 0, scale: 1.5, y: '5%' }
            }
            animate={{ opacity: 1, scale: 1.04, y: '0%' }}
            transition={{ type: 'spring', stiffness: 160, damping: 18 }}
          >
            {boss.image ? (
              <Image
                src={boss.image}
                alt=""
                fill
                sizes="150vw"
                priority
                className="object-contain object-bottom"
              />
            ) : (
              <span className="grid size-full place-items-center text-[7rem]">
                {boss.emoji}
              </span>
            )}
          </motion.div>
        </div>
      </div>

      {/* Éclaboussures détachées, sous la tache. Sans elles le bord se lit
          comme une découpe ; avec elles, comme de l'encre qui a giclé. */}
      <span
        className="traque-rideau-goutte traque-rideau-goutte-1"
        aria-hidden="true"
      />
      <span
        className="traque-rideau-goutte traque-rideau-goutte-2"
        aria-hidden="true"
      />
      <span
        className="traque-rideau-goutte traque-rideau-goutte-3"
        aria-hidden="true"
      />

      {/* --- LE TEXTE. Posé À MÊME le voile, sans panneau ni liseré : sur la
          maquette on voit encore le jeu derrière les mots, et c'est ce qui
          maintient l'impression d'interruption jusqu'au bas de l'écran. --- */}
      <motion.div
        ref={panel}
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.12,
          type: 'spring',
          stiffness: 240,
          damping: 24,
        }}
        className="traque-rideau-texte relative px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center outline-none"
      >
        <p className="traque-rideau-titre font-heading text-2xl leading-tight font-extrabold text-white">
          {boss.name}
        </p>
        <p className="mt-1 text-[0.72rem] font-extrabold tracking-[0.18em] text-[#ff6b6b] uppercase">
          {apparition.subject || boss.epithet}
        </p>

        <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed font-bold text-white/85">
          <span className="text-highlight">{apparitionMessage(boss)}</span>
          <br />
          <span className="italic">« {boss.intro} »</span>
        </p>

        <p className="mt-3 text-xs font-bold text-white/60">
          Il retourne dans sa tanière dans{' '}
          <span className="tabular-nums text-highlight">
            {remaining === null ? '1 h' : countdownLabel(remaining)}
          </span>
        </p>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={dismiss}
            className="olympe-press flex-1 rounded-2xl border border-white/20 bg-white/5 px-4 py-3 font-heading text-sm font-extrabold text-white/80 focus-visible:ring-4 focus-visible:ring-white/40 focus-visible:outline-none"
          >
            Plus tard
          </button>
          <button
            ref={defierRef}
            type="button"
            onClick={fight}
            className="olympe-gold olympe-press flex flex-[1.4] items-center justify-center gap-2 rounded-2xl px-4 py-3 font-heading text-sm font-extrabold focus-visible:ring-4 focus-visible:ring-highlight/70 focus-visible:outline-none"
          >
            <Swords className="size-4" strokeWidth={2.8} aria-hidden="true" />
            Le défier
          </button>
        </div>
      </motion.div>
    </div>,
    document.body,
  )
}
