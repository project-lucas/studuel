'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { Crown, Swords } from 'lucide-react'
import PortraitJoueur from '@/components/amis/PortraitJoueur'
import { Button } from '@/components/ui/button'
import { useFermeAuMasquage } from '@/components/useFermeAuMasquage'
import type { AvatarAffiche } from '@/lib/avatar-affiche'
import {
  challengerDe,
  classerAmisPar,
  couronneDe,
  detailJoueur,
  libelleValeur,
  lireClassementAmis,
  partsDuMeilleur,
  phraseDuClassement,
  type AmiClasse,
  type Mesure,
} from '@/lib/moi/classement-amis'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import styles from '@/components/moi/TableauDeBord.module.css'

// -----------------------------------------------------------------------------
// TOI ET TES AMIS — la grande tuile du tableau de bord de Moi (Lucas,
// 01/10/2026 : « un classement VISUEL du user vis-à-vis de ses amis — trophées,
// temps de travail, en temps réel — pour qu'il puisse se comparer et vouloir
// battre les autres, avec la couronne pour le numéro 1 et un autre icône pour
// celui qui a le plus révisé et gagné de trophées »).
//
// Une LIGNE par personne, de la première à la dernière : le rang, le portrait,
// une barre à la longueur de sa mesure, la valeur au bout. Les colonnes du
// 01/10 sont devenues des barres le 02/10/2026 (maquette « D », le tableau de
// bord) : couchées, elles tiennent dans une tuile et laissent lire dix amis
// sans défiler de côté. Deux mesures : le temps de travail de la semaine
// (ouvert d'abord — /moi est le miroir du travail fourni) et les trophées.
// MA barre est en violet plein, celles des autres en violet clair. La COURONNE
// va au n° 1 de la mesure ; les ÉPÉES au challenger, celui qui a fait la
// meilleure semaine : c'est lui qui menace le classement.
//
// EN TEMPS RÉEL : la liste arrive avec la page, puis se relit toutes les
// 45 secondes tant que le bloc est à l'écran, et au retour dans l'app
// (`/api/classement-amis`). L'onglet gardé caché suspend ses effets : rien ne
// tourne en arrière-plan.
// -----------------------------------------------------------------------------

/** Les deux mesures, dans l'ordre du segment, avec leur nom court. */
const SEGMENT: readonly { cle: Mesure; court: string; long: string }[] = [
  { cle: 'temps', court: 'Travail', long: 'Temps de travail de la semaine' },
  { cle: 'trophees', court: 'Trophées', long: 'Trophées' },
]

/** En deçà, mon prénom déborde de ma barre : il s'écrit en violet, pas en blanc. */
const PART_NOM_SUR_BARRE = 34

/** Écart entre deux barres qui poussent, à l'ouverture. */
const DECALAGE_MS = 60

/** La relecture, tant que le bloc est affiché. */
const RELECTURE_MS = 45_000

export default function ClassementAmis({
  joueurs: joueursInitiaux,
  complet,
  monAvatar = null,
  className,
}: {
  /** Moi et mes amis (lib/moi/classement-amis). */
  joueurs: readonly AmiClasse[]
  /** false : la migration 465 manque, la liste ne porte que moi. */
  complet: boolean
  monAvatar?: AvatarAffiche | null
  className?: string
}) {
  const titreId = useId()
  const [mesure, setMesure] = useState<Mesure>('temps')
  const [choisi, setChoisi] = useState<string | null>(null)
  // L'onglet reste monté : on le retrouve sans ligne allumée.
  useFermeAuMasquage(setChoisi, null)

  // La liste relue, valable tant que le serveur rend celle d'avant : une
  // nouvelle liste venue de la page (rafraîchissement) doit l'emporter.
  const [relue, setRelue] = useState<{ depuis: readonly AmiClasse[]; joueurs: AmiClasse[] } | null>(null)
  const joueurs = relue && relue.depuis === joueursInitiaux ? relue.joueurs : joueursInitiaux

  // L'heure de la dernière lecture (0 : celle de la page, à dater au premier
  // effet). Un ref : il survit quand l'onglet est caché puis remontré.
  const lueA = useRef(0)

  useEffect(() => {
    if (!complet) return
    let actif = true
    const relire = async () => {
      if (document.visibilityState !== 'visible') return
      try {
        const reponse = await fetch('/api/classement-amis', { cache: 'no-store' })
        if (!actif || reponse.status !== 200) return
        const corps = (await reponse.json()) as { joueurs?: unknown }
        const lus = lireClassementAmis(corps.joueurs)
        if (actif && lus.some((j) => j.moi)) {
          lueA.current = Date.now()
          setRelue({ depuis: joueursInitiaux, joueurs: lus })
        }
      } catch {
        // Hors ligne ou réponse illisible : on garde ce qu'on a.
      }
    }
    // L'onglet Moi reste monté : quand il redevient visible, ses effets
    // repartent — et l'intervalle avec, à zéro. Sans cette relecture, le
    // classement restait celui d'avant pendant 45 secondes de plus.
    if (lueA.current === 0) lueA.current = Date.now()
    else if (Date.now() - lueA.current > RELECTURE_MS / 3) void relire()
    const minuteur = window.setInterval(relire, RELECTURE_MS)
    document.addEventListener('visibilitychange', relire)
    return () => {
      actif = false
      window.clearInterval(minuteur)
      document.removeEventListener('visibilitychange', relire)
    }
  }, [complet, joueursInitiaux])

  const classes = classerAmisPar(joueurs, mesure)
  const parts = partsDuMeilleur(classes, mesure)
  const seul = classes.length <= 1
  // Seul, il n'y a personne à devancer : pas de couronne sur une ligne unique.
  const couronne = seul ? null : couronneDe(classes, mesure)
  const challenger = challengerDe(joueurs)
  const touche = classes.find((j) => j.id === choisi) ?? null
  const phrase = complet
    ? phraseDuClassement(classes, mesure)
    : 'Le classement de tes amis arrive avec la prochaine mise à jour.'

  return (
    <section aria-labelledby={titreId} className={cn('carte', styles.tuile, className)}>
      <div className="flex items-center gap-2">
        <h2 id={titreId} className="titre-section min-w-0 flex-1">
          Toi et tes amis
        </h2>
        {/* Les deux mesures : un segment, comme les filtres du classement. */}
        <div role="group" aria-label="Mesure du classement" className="grid shrink-0 grid-cols-2 gap-1 rounded-full bg-secondary p-1">
          {SEGMENT.map((m) => (
            <button
              key={m.cle}
              type="button"
              aria-pressed={mesure === m.cle}
              aria-label={m.long}
              onClick={() => {
                sfx.tap()
                setMesure(m.cle)
              }}
              className={cn(
                'cursor-pointer rounded-full px-3 py-1 text-xs font-extrabold transition-colors',
                mesure === m.cle ? 'bg-card text-primary shadow-sm' : 'text-foreground/65',
              )}
            >
              {m.court}
            </button>
          ))}
        </div>
      </div>

      {/* `key` : changer de mesure rejoue la pousse des barres. */}
      <ol
        key={mesure}
        aria-label={mesure === 'trophees' ? 'Classement aux trophées' : 'Classement au temps de travail de la semaine'}
        className={styles.barres}
      >
        {classes.map((j, i) => {
          const estChallenger = challenger === j.id
          return (
            <li key={j.id}>
              <button
                type="button"
                onClick={() => {
                  sfx.tap()
                  setChoisi(choisi === j.id ? null : j.id)
                }}
                aria-pressed={touche?.id === j.id}
                aria-label={`${j.rang}${j.rang === 1 ? 'er' : 'e'} : ${detailJoueur(j)}${estChallenger ? ' — challenger de la semaine' : ''}`}
                className={styles.ligne}
                data-moi={j.moi || undefined}
                data-choisie={touche?.id === j.id || undefined}
              >
                <span className={styles.rang} aria-hidden="true">
                  {couronne === j.id ? <Crown strokeWidth={2.2} className={styles.couronne} /> : j.rang}
                </span>
                <span className={styles.portrait} aria-hidden="true">
                  <PortraitJoueur
                    id={j.id}
                    portrait={j.portrait}
                    avatar={j.moi ? monAvatar : null}
                    className="size-8"
                  />
                  {estChallenger ? (
                    <span className={styles.challenger}>
                      <Swords className="size-2.5" strokeWidth={2.8} />
                    </span>
                  ) : null}
                </span>
                <span className={styles.fut} aria-hidden="true">
                  <span
                    className={styles.barre}
                    style={{ width: `${parts[i]}%`, animationDelay: `${i * DECALAGE_MS}ms` }}
                  />
                  <span className={styles.nom} data-sur-barre={parts[i] >= PART_NOM_SUR_BARRE || undefined}>
                    {j.moi ? 'Toi' : j.nom}
                  </span>
                </span>
                <span className={styles.valeur} aria-hidden="true">
                  {libelleValeur(j, mesure)}
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      {/* La phrase qui donne l'écart à combler ; une ligne touchée dit son détail. */}
      <p aria-live="polite" className="mt-3 text-[13px] leading-snug font-bold text-foreground/85">
        {touche ? detailJoueur(touche) : phrase}
      </p>

      {seul ? (
        <div className="mt-2 flex items-center gap-3">
          <p className="min-w-0 flex-1 text-sm font-semibold text-muted-foreground">
            Leurs barres se rangent ici, à côté de la tienne.
          </p>
          <Button asChild size="sm" className="shrink-0">
            <Link href="/amis">Mes amis</Link>
          </Button>
        </div>
      ) : challenger ? (
        /* Ce que disent les épées : la couronne, elle, se comprend seule. */
        <p className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
          <span aria-hidden="true" className={cn(styles.challenger, styles.challengerLegende)}>
            <Swords className="size-2.5" strokeWidth={2.8} />
          </span>
          Challenger&nbsp;: la meilleure semaine
        </p>
      ) : null}
    </section>
  )
}
