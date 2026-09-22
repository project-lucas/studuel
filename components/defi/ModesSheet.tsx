'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { AnimatePresence, motion, useDragControls, useReducedMotion } from 'framer-motion'
import { ChevronDown, LayoutGrid } from 'lucide-react'
import ModeTicketCard from '@/components/defi/ModeTicket'
import { plaqueClaire } from '@/lib/defi/plaque-claire'
import { casesPalmares, type LignePalmares } from '@/lib/palmares/palmares'
import { isEpreuveId } from '@/lib/palmares/epreuves'
import { ordinal } from '@/lib/percentile'
import { FLANK_CLASS } from '@/components/defi/ArenaActionBar'
import { sfx } from '@/lib/sounds'
import { useDialogFocus } from '@/lib/use-dialog'
import { verrouillerDefilement } from '@/lib/scroll-lock'
import { useRecords } from '@/lib/jeux/use-records'
import { useEtoilesJeux } from '@/lib/jeux/use-etoiles-jeux'
import {
  funModeTickets,
  vueModes,
  type ModeTicket,
} from '@/lib/defi/modes-catalog'
import { cn } from '@/lib/utils'
import styles from './ModesSheet.module.css'

/**
 * « 1er cette semaine », « 7e sur 41 » : la place de la semaine de chaque
 * épreuve, lue du palmarès serveur. Une épreuve sans place n'a pas d'entrée —
 * le billet n'affiche alors rien plutôt qu'un rang inventé.
 */
function placesDeLaSemaine(lignes: readonly LignePalmares[]): Record<string, string> {
  const places: Record<string, string> = {}
  for (const c of casesPalmares(lignes)) {
    if (!isEpreuveId(c.mode) || c.semaine.kind === 'aucun') continue
    places[c.mode] =
      c.semaine.kind === 'rang'
        ? c.semaine.rank <= 3
          ? `${ordinal(c.semaine.rank)} cette semaine`
          : `${ordinal(c.semaine.rank)} sur ${c.semaine.total}`
        : c.semaine.side === 'top'
          ? `Top ${c.semaine.value} %`
          : `Mieux que ${c.semaine.value} %`
  }
  return places
}

// L'ouverture « smooth, légère » (Lucas, 19/09/2026) : la courbe des feuilles
// d'iOS — un départ franc qui se pose en douceur, sans rebond —, un voile qui
// se lève sans à-coup, et une fermeture plus vive que l'ouverture.
const GLISSE = { type: 'tween', duration: 0.44, ease: [0.32, 0.72, 0, 1] } as const
const REPLI = { type: 'tween', duration: 0.26, ease: [0.4, 0, 1, 1] } as const

/**
 * Le bouton « MODES DE JEU » de l'arène et sa feuille — l'écran des modes de
 * Clash Royale (Lucas, 19/09/2026) :
 *
 *   · la feuille monte du bas mais NE COUVRE PAS tout : le haut de l'arène
 *     reste visible, assombri — on sait d'où l'on vient, et un tap dessus
 *     referme ; la languette à chevron aussi, comme le glisser vers le bas ;
 *   · en tête, le titre « Modes de jeu » (le total de trophées y vivait
 *     aussi : il est parti sur l'arène, sous la carte du joueur — 22/09/2026) ;
 *   · puis la LISTE : le mode du jour en grand billet, chaque matière avec
 *     UN jeu — son jeu libre —, et les modes de l'Arène. Le bouton en haut à
 *     droite déplie TOUS les modes de chaque matière (les jeux Studuel+ sous
 *     cadenas pour qui ne l'a pas, les « Bientôt ») : sans lui, un mode par
 *     matière (Lucas, 19/09/2026).
 *
 * Plus de roulette de matières : la liste montre tout, comme au modèle. Le
 * titre d'une matière est son NOM seul (Lucas, 22/09/2026 : « retire les
 * illustrations collées au texte ») : la vignette du dossier, collée au titre,
 * faisait doublon avec la scène du billet juste dessous.
 */
export default function ModesSheet({
  todayKey,
  liveDuel = false,
  palmares = [],
  premium = false,
}: {
  todayKey: string
  /** Élève connecté : les billets « Duel en direct » (QR) et « Mode Coop » rejoignent la liste. */
  liveDuel?: boolean
  /** Mon palmarès (352) : la place de la semaine se pose sur les billets. */
  palmares?: readonly LignePalmares[]
  /** Abonné Studuel+ : tous les jeux de chaque matière s'ouvrent. */
  premium?: boolean
}) {
  const [open, setOpen] = useState(false)
  // Tous les modes de chaque matière, ou un seul (le jeu libre) : le choix
  // tient le temps de la visite de l'arène.
  const [tout, setTout] = useState(false)
  const reduce = useReducedMotion()
  const panel = useRef<HTMLDivElement>(null)
  const drag = useDragControls()
  const titreId = useId()
  useDialogFocus(panel, open)

  // Fermeture au clavier (Échap) + verrou du défilement de la page tant que
  // la feuille est ouverte.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const libererDefilement = verrouillerDefilement()
    return () => {
      window.removeEventListener('keydown', onKey)
      libererDefilement()
    }
  }, [open])

  const fermer = () => {
    sfx.back()
    setOpen(false)
  }

  // Le mode du jour, UN jeu par matière — et, derrière le bouton « tous les
  // modes », le reste : seconds jeux, modes de l'Arène, Duel en direct, Coop.
  const { vedette, sections, arene, replies } = vueModes({
    dayKey: todayKey,
    premium,
    tout,
    connecte: liveDuel,
  })
  const modes = funModeTickets(todayKey)
  const places = placesDeLaSemaine(palmares)
  const tousLesBillets = [...sections.flatMap((s) => s.tickets), ...modes]
  const records = useRecords(tousLesBillets.flatMap((t) => (t.recordKey ? [t.recordKey] : [])))
  const etoiles = useEtoilesJeux(tousLesBillets.flatMap((t) => (t.gameId ? [t.gameId] : [])))

  const billet = (t: ModeTicket) => (
    <ModeTicketCard
      key={t.id}
      ticket={t}
      // Un jeu à paliers montre ses étoiles ; un mode au score, son record.
      etoiles={t.gameId && etoiles && !t.verrou ? (etoiles[t.gameId] ?? 0) : null}
      record={!t.gameId && records && t.recordKey ? (records[t.recordKey] ?? 0) : null}
      place={places[t.id] ?? null}
    />
  )

  return (
    <>
      {/* Le déclencheur : PLAQUE DE FLANC, jumelle de celle qui tient l'autre
          bord (même largeur, biseau, rayon, ombre). L'icône seule, en grand ;
          la phrase entière vit dans l'`aria-label` et l'infobulle. */}
      <button
        type="button"
        onClick={() => {
          sfx.tap()
          setOpen(true)
        }}
        aria-haspopup="dialog"
        aria-label="Modes de jeu — jeux par matière, Blitz, Chrono, Survie et boss"
        title="Modes de jeu — Blitz, Chrono, Survie, Boss"
        className={`arena-plate arena-plate--clair arena-plate--press ${FLANK_CLASS} flex cursor-pointer flex-col items-center justify-center focus-visible:ring-4 focus-visible:ring-white/60 focus-visible:outline-none`}
        style={{ background: plaqueClaire() }}
      >
        <Image
          src="/images/defi/icones/modes-v4.webp"
          alt=""
          aria-hidden="true"
          width={256}
          height={256}
          sizes="64px"
          className="size-16 object-contain"
        />
      </button>

      {typeof document !== 'undefined'
        ? createPortal(
            <AnimatePresence>
              {open ? (
                <>
                  {/* Le haut de l'arène, ASSOMBRI : visible, hors jeu. Un tap
                      referme, comme au modèle. */}
                  <motion.div
                    key="voile"
                    className={styles.voile}
                    aria-hidden="true"
                    onClick={fermer}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.22 } }}
                    transition={{ duration: 0.34, ease: 'easeOut' }}
                  />
                  <motion.div
                    key="feuille"
                    ref={panel}
                    className={styles.feuille}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titreId}
                    initial={reduce ? { opacity: 0 } : { y: '100%' }}
                    animate={reduce ? { opacity: 1 } : { y: 0 }}
                    exit={reduce ? { opacity: 0 } : { y: '100%', transition: REPLI }}
                    transition={GLISSE}
                    // Glisser la languette ou le bandeau vers le bas referme ;
                    // la liste, elle, garde son défilement.
                    drag={reduce ? false : 'y'}
                    dragListener={false}
                    dragControls={drag}
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={{ top: 0, bottom: 0.7 }}
                    onDragEnd={(_, info) => {
                      if (info.offset.y > 110 || info.velocity.y > 600) fermer()
                    }}
                  >
                    {/* La languette à chevron, qui dépasse du bandeau. */}
                    <div className={styles.languette} onPointerDown={(e) => drag.start(e)}>
                      <svg viewBox="0 0 285 115" preserveAspectRatio="none" aria-hidden="true">
                        <defs>
                          <linearGradient id="modes-languette" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" className={styles.languetteHaut} />
                            <stop offset="0.3" className={styles.languetteMilieu} />
                            <stop offset="1" className={styles.languetteBas} />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0 118 L38 16 Q44 2 60 2 H225 Q241 2 247 16 L285 118 Z"
                          fill="url(#modes-languette)"
                        />
                        <path
                          d="M40 13 Q46 3 60 3 H225 Q239 3 245 13"
                          fill="none"
                          strokeWidth="3"
                          className={styles.languetteFilet}
                        />
                      </svg>
                      <button
                        type="button"
                        onClick={fermer}
                        aria-label="Fermer les modes de jeu"
                        className={styles.poignee}
                      >
                        <ChevronDown className={styles.chevron} strokeWidth={3.4} aria-hidden="true" />
                      </button>
                    </div>

                    <header className={styles.bandeau} onPointerDown={(e) => drag.start(e)}>
                      <h2 id={titreId} className={cn(styles.encre, styles.titre, 'font-heading font-extrabold')}>
                        Modes de jeu
                      </h2>
                    </header>

                    <div className={styles.liste}>
                      <div className={styles.colonne}>
                        <div className={styles.enTete}>
                          {/* TOUS LES MODES : sans lui, un jeu par matière. */}
                          {replies > 0 ? (
                            <button
                              type="button"
                              onClick={() => {
                                sfx.tap()
                                setTout((t) => !t)
                              }}
                              aria-pressed={tout}
                              aria-label={
                                tout
                                  ? 'Revenir à un mode par matière'
                                  : `Voir tous les modes de jeu (${replies} de plus)`
                              }
                              title={tout ? 'Un mode par matière' : 'Tous les modes de jeu'}
                              className={styles.voirTout}
                            >
                              <LayoutGrid className={styles.voirToutIcone} strokeWidth={2.6} aria-hidden="true" />
                              {tout ? null : (
                                <span
                                  className={cn(styles.voirToutCompte, 'font-heading font-extrabold tabular-nums')}
                                  aria-hidden="true"
                                >
                                  +{replies}
                                </span>
                              )}
                            </button>
                          ) : null}
                        </div>

                        {/* Le mode du jour : le grand billet, en tête. */}
                        {vedette ? billet(vedette) : null}

                        {sections.map((s) => (
                          <section key={s.subject} aria-label={`Jeux · ${s.subject}`} className="contents">
                            <h3 className={cn(styles.separateur, 'font-heading font-extrabold')}>
                              <span className={styles.encre}>{s.subject}</span>
                            </h3>
                            {s.tickets.map(billet)}
                          </section>
                        ))}

                        {arene.length > 0 ? (
                          <section aria-label="Modes de l’Arène" className="contents">
                            <h3 className={cn(styles.separateur, 'font-heading font-extrabold')}>
                              <span className={styles.encre}>Modes de l’Arène</span>
                            </h3>
                            {arene.map(billet)}
                          </section>
                        ) : null}
                      </div>
                    </div>
                  </motion.div>
                </>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  )
}
