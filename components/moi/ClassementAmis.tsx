'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { Crown, Swords } from 'lucide-react'
import PortraitJoueur from '@/components/amis/PortraitJoueur'
import EnTeteBloc from '@/components/moi/EnTeteBloc'
import { Button } from '@/components/ui/button'
import { useFermeAuMasquage } from '@/components/useFermeAuMasquage'
import type { AvatarAffiche } from '@/lib/avatar-affiche'
import {
  MESURES,
  challengerDe,
  classerAmisPar,
  couronneDe,
  detailJoueur,
  hauteursDesColonnes,
  libelleValeur,
  lireClassementAmis,
  phraseDuClassement,
  type AmiClasse,
  type Mesure,
} from '@/lib/moi/classement-amis'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import styles from '@/components/moi/ClassementAmis.module.css'

// -----------------------------------------------------------------------------
// TOI ET TES AMIS — le classement visuel de l'onglet Progrès (Lucas,
// 01/10/2026 : « à la place du bloc matière, un classement VISUEL du user
// vis-à-vis de ses amis — trophées, temps de travail, en temps réel — pour
// qu'il puisse se comparer et vouloir battre les autres, avec la couronne pour
// le numéro 1 et un autre icône pour celui qui a le plus révisé et gagné de
// trophées »). Il a pris la place de « Tes matières », dont il garde le
// langage : des colonnes qui poussent, le portrait au pied de chacune.
//
// Une colonne par personne, de la plus haute à la plus basse. Deux mesures, au
// choix : les trophées (le total de l'arène) et le temps de travail de la
// semaine. La MIENNE est en violet plein, celles des autres en violet clair —
// c'est moi que je cherche d'abord. La COURONNE va au n° 1 de la mesure ; les
// ÉPÉES au challenger, celui qui a fait la meilleure semaine (le plus de
// travail et de trophées gagnés) : c'est lui qui menace le classement.
//
// EN TEMPS RÉEL : la liste arrive avec la page, puis se relit toutes les
// 45 secondes tant que le bloc est à l'écran, et au retour dans l'app
// (`/api/classement-amis`). L'onglet gardé caché suspend ses effets : rien ne
// tourne en arrière-plan.
// -----------------------------------------------------------------------------

/** Au-delà, la rangée défile de côté (390 px de large). */
const COLONNES_VISIBLES = 6

/** Écart entre deux colonnes qui poussent, à l'ouverture. */
const DECALAGE_MS = 70

/** La relecture, tant que le bloc est affiché. */
const RELECTURE_MS = 45_000

export default function ClassementAmis({
  joueurs: joueursInitiaux,
  complet,
  monAvatar = null,
}: {
  /** Moi et mes amis (lib/moi/classement-amis). */
  joueurs: readonly AmiClasse[]
  /** false : la migration 465 manque, la liste ne porte que moi. */
  complet: boolean
  monAvatar?: AvatarAffiche | null
}) {
  const titreId = useId()
  const [mesure, setMesure] = useState<Mesure>('trophees')
  const [choisi, setChoisi] = useState<string | null>(null)
  // L'onglet reste monté : on le retrouve sur sa propre colonne.
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
  const hauteurs = hauteursDesColonnes(classes, mesure)
  const seul = classes.length <= 1
  // Seul, il n'y a personne à devancer : pas de couronne sur une colonne unique.
  const couronne = seul ? null : couronneDe(classes, mesure)
  const challenger = challengerDe(joueurs)
  const actif = classes.find((j) => j.id === choisi) ?? classes.find((j) => j.moi) ?? classes[0] ?? null

  return (
    <section aria-labelledby={titreId} className="carte p-4">
      <EnTeteBloc
        id={titreId}
        titre="Toi et tes amis"
        sousTitre={
          complet
            ? phraseDuClassement(classes, mesure)
            : 'Le classement de tes amis arrive avec la prochaine mise à jour.'
        }
      />

      {/* Les deux mesures : un segment, comme les filtres de « Ton classement ». */}
      <div role="group" aria-label="Mesure du classement" className="mt-3 grid grid-cols-2 gap-1 rounded-full bg-secondary p-1">
        {MESURES.map((m) => (
          <button
            key={m.cle}
            type="button"
            aria-pressed={mesure === m.cle}
            onClick={() => {
              sfx.tap()
              setMesure(m.cle)
            }}
            className={cn(
              'cursor-pointer rounded-full px-3 py-1.5 text-xs font-extrabold transition-colors',
              mesure === m.cle ? 'bg-card text-primary shadow-sm' : 'text-foreground/65',
            )}
          >
            {m.label}
            {m.cle === 'temps' ? <span className="sr-only"> de la semaine</span> : null}
          </button>
        ))}
      </div>

      <div className={styles.scene} data-defile={classes.length > COLONNES_VISIBLES || undefined}>
        {/* `key` : changer de mesure rejoue la pousse des colonnes. */}
        <ol
          key={mesure}
          aria-label={mesure === 'trophees' ? 'Classement aux trophées' : 'Classement au temps de travail de la semaine'}
          className={styles.colonnes}
        >
          {classes.map((j, i) => {
            const estActif = actif?.id === j.id
            const estChallenger = challenger === j.id
            return (
              <li
                key={j.id}
                className={styles.colonne}
                data-moi={j.moi || undefined}
                data-choisie={estActif || undefined}
              >
                <button
                  type="button"
                  onClick={() => {
                    sfx.tap()
                    setChoisi(j.id)
                  }}
                  aria-pressed={estActif}
                  aria-label={`${j.rang}${j.rang === 1 ? 'er' : 'e'} : ${detailJoueur(j)}${estChallenger ? ' — challenger de la semaine' : ''}`}
                  className={styles.piste}
                >
                  {couronne === j.id ? (
                    <Crown aria-hidden="true" strokeWidth={2.2} className={styles.couronne} />
                  ) : null}
                  <span aria-hidden="true" className={styles.valeur} style={{ animationDelay: `${i * DECALAGE_MS + 450}ms` }}>
                    {libelleValeur(j, mesure)}
                  </span>
                  <span className={styles.fut} aria-hidden="true">
                    <span
                      className={styles.barre}
                      style={{ height: `${hauteurs[i]}%`, animationDelay: `${i * DECALAGE_MS}ms` }}
                    />
                  </span>
                </button>
                <span aria-hidden="true" className={styles.portrait}>
                  <PortraitJoueur
                    id={j.id}
                    portrait={j.portrait}
                    avatar={j.moi ? monAvatar : null}
                    className="size-9"
                  />
                  {estChallenger ? (
                    <span className={styles.challenger}>
                      <Swords className="size-3" strokeWidth={2.8} />
                    </span>
                  ) : null}
                </span>
                <span aria-hidden="true" className={styles.nom}>
                  {j.moi ? 'Toi' : j.nom}
                </span>
              </li>
            )
          })}
        </ol>
      </div>

      {/* Le détail de la colonne allumée. */}
      {actif ? (
        <p aria-live="polite" className="mt-3 rounded-2xl bg-primary/10 px-3 py-1.5 text-center text-xs leading-snug font-bold text-foreground/85">
          {detailJoueur(actif)}
        </p>
      ) : null}

      {seul ? (
        <div className="mt-3 flex items-center gap-3">
          <p className="min-w-0 flex-1 text-sm font-semibold text-muted-foreground">
            Ajoute tes amis&nbsp;: leurs colonnes poussent ici, à côté de la tienne.
          </p>
          <Button asChild size="sm" className="shrink-0">
            <Link href="/amis">Mes amis</Link>
          </Button>
        </div>
      ) : (
        /* La légende des deux distinctions : ce que disent la couronne et les épées. */
        <ul className="mt-2.5 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] font-bold text-muted-foreground">
          <li className="inline-flex items-center gap-1">
            <Crown aria-hidden="true" strokeWidth={2.2} className={cn(styles.couronne, 'size-3.5')} />
            N°&nbsp;1
          </li>
          <li className="inline-flex items-center gap-1">
            <span aria-hidden="true" className={cn(styles.challenger, styles.challengerLegende)}>
              <Swords className="size-2.5" strokeWidth={2.8} />
            </span>
            Challenger&nbsp;: la meilleure semaine
          </li>
        </ul>
      )}
    </section>
  )
}
