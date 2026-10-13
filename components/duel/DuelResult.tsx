'use client'

import Image from 'next/image'
import Link from 'next/link'
import { RefreshCw, Shuffle, Swords } from 'lucide-react'
import ArenaBackdrop from '@/components/ArenaBackdrop'
import AvatarRender from '@/components/avatar/AvatarRender'
import XpIcon from '@/components/ui/XpIcon'
import PanneauRecompenses from '@/components/recompenses/PanneauRecompenses'
import { Button } from '@/components/ui/button'
import type { AvatarConfig } from '@/lib/avatar'
import { cn } from '@/lib/utils'
import { outcomeCaption, outcomeTitle, type CourseOutcome } from '@/lib/duel/course'
import type { DuelCourseOutcome } from '@/lib/duel/fin-course'
import { enjeuLigue, ordinal, type LigueApresCourse } from '@/lib/duel/ligue-course'
import { TITRE_DEFAITE, TITRE_VICTOIRE } from '@/lib/duel/titres'
import { echelon } from '@/lib/ligue'
import styles from './Course.module.css'

export type ResultCamp = {
  name: string
  avatar: AvatarConfig
  score: number
  goalAtMs: number | null
  isBot?: boolean
}


/**
 * L'ÉCRAN DE FIN de la course — le « K.O. » de la planche Pokémon, choisi par
 * Lucas le 13/10/2026 (`assets-sources/maquettes/duel-pokemon.html`, colonne
 * D, « sans le cercle placé en dessous des avatars »), sur la cour d'honneur
 * vivante de l'arène et non plus sur l'aplat violet (« le fond violet du duel
 * me pose toujours souci »). De haut en bas : le VERDICT (bientôt une
 * illustration, cf. `assets-sources/duel-titres/`), les DEUX COMBATTANTS — le
 * gagnant cerclé d'or, le perdant basculé et grisé, et sous chacun sa
 * BANNIÈRE DE RANG (« Bronze 1 », la division de ligue) —, puis la carte du
 * bilan, ÉPURÉE (Lucas : « gain d'XP et gain de rang dans la division, et
 * c'est tout ») : MA PLACE DANS LA LIGUE avant → après (la seule échelle
 * depuis le 13/10 : « une défaite ne retire jamais rien »), l'XP versée, et
 * REVANCHE en or — la fin d'un duel est le meilleur moment d'en relancer un.
 * Ni trophées, ni combo, ni clan, ni quête ici : les trophées se lisent dans
 * le Classement de l'arène, le reste dans ses feuilles.
 *
 * ON N'AFFICHE QUE CE QUE LE SERVEUR A VERSÉ. Le verdict se calcule des deux
 * côtés avec les mêmes fonctions, donc il s'affiche tout de suite ; la ligue,
 * les trophées, l'XP et les rangs attendent la réponse — un « +8 » posé avant
 * que la base ne l'ait écrit est le défaut maison n°1, et il n'entre pas ici.
 */
export default function DuelResult({
  outcome,
  server,
  recorded,
  envoiEchoue = false,
  onReessayer,
  me,
  rival,
  hrefs,
}: {
  outcome: CourseOutcome
  server: DuelCourseOutcome | null
  recorded: boolean
  /** L'envoi a échoué malgré ses relances : rien n'est écrit. */
  envoiEchoue?: boolean
  /** Renvoie la même course (jamais payée deux fois). */
  onReessayer?: () => void
  me: ResultCamp
  rival: ResultCamp
  hrefs: { revanche: string; nouveau: string; arene: string }
}) {
  // Le verdict du SERVEUR ne remplace celui de l'écran que s'il l'a VÉRIFIÉ.
  // Un rival introuvable, une session expirée : le serveur n'en sait pas plus
  // que l'écran, et « Victoire ! » ne doit pas basculer en « Défaite » pour ça.
  const verifie = server?.statut === 'verifie'
  const verdict = verifie && server ? server.outcome : outcome
  const won = verdict !== 'loss'
  const ligue = server?.ligue ?? null
  const rivalFinal = (verifie ? server?.rival : null) ?? { score: rival.score, goalAtMs: rival.goalAtMs }
  // Les rangs : le mien vient de la ligue relue après la course ; un robot
  // est réglé sur moi et porte le mien ; un élève rejoué le sien (562).
  const monEchelon = ligue?.echelon ?? null
  const rivalEchelon = server?.rivalEchelon ?? (rival.isBot ? monEchelon : null)

  return (
    <section className={styles.fin} aria-label="Résultat du duel">
      {/* La cour d'honneur, VIVANTE, repeinte sous l'écran (même geste que le
          rideau de recherche d'adversaire) ; `defi-arena-bg` fait socle le
          temps que l'illustration se décode. */}
      <div aria-hidden="true" className={cn('defi-arena-bg', styles.finCour)}>
        <ArenaBackdrop />
      </div>
      <div aria-hidden="true" className={styles.finVoile} />

      <div className={styles.verdict}>
        {won ? <Confettis /> : null}
        {/* LE VERDICT EST UNE ILLUSTRATION (13/10/2026, Lucas : « de belles
            illustrations pour victoire, défaite ») : les lettrages dessinés
            dans la famille nav, détourés par `scripts/duel-titres.mjs`. Le mot
            reste dans le DOM pour les lecteurs d'écran. */}
        <h1 className={styles.titre}>
          <Image
            src={won ? TITRE_VICTOIRE : TITRE_DEFAITE}
            alt=""
            width={720}
            height={360}
            priority
            unoptimized
            className={cn('course-tampon', styles.titreImage)}
          />
          <span className="sr-only">{outcomeTitle(verdict)}</span>
        </h1>
        <p className={styles.legende}>
          {outcomeCaption(verdict, rival.name, { score: me.score, goalAtMs: me.goalAtMs }, rivalFinal)}
        </p>
      </div>

      {/* Les deux combattants, sans plateau : le gagnant cerclé d'or, le
          perdant basculé — et sous chacun sa division de ligue. */}
      <div className={styles.combattants}>
        <Combattant camp={me} label="Toi" gagnant={won} echelon={monEchelon} />
        <Combattant camp={{ ...rival, score: rivalFinal.score }} label={rival.name} gagnant={!won} echelon={rivalEchelon} />
      </div>

      <div className={styles.bilan}>
        {/* LA LIGNE DU HAUT : ma place dans la ligue, avant et après. */}
        <div className={styles.ligne} aria-live="polite">
          {!recorded ? (
            <span className={styles.attente}>
              <XpIcon className="size-6" />
              Le serveur compte…
            </span>
          ) : ligue && server ? (
            <LigneLigue ligue={ligue} gains={server.gains} />
          ) : envoiEchoue ? (
            // Rien n'est écrit : on le dit, et on propose de renvoyer. La course
            // porte son identifiant — la renvoyer ne la paie jamais deux fois.
            <span className={styles.note}>
              Connexion perdue : ta course n’est pas encore enregistrée.
              {onReessayer ? (
                <Button type="button" variant="secondary" size="sm" className="mt-2 font-bold" onClick={onReessayer}>
                  <RefreshCw className="mr-1.5 size-4" aria-hidden="true" /> Réessayer
                </Button>
              ) : null}
            </span>
          ) : server && server.gains.length > 0 ? (
            // Pas de ligue (migration absente, ou course rejouée) : l'XP seule.
            <PanneauRecompenses compact gains={server.gains} />
          ) : (
            <span className={styles.note}>{messageSansLigue(server)}</span>
          )}
        </div>

        <div className={styles.boutons}>
          <Button asChild size="xl" className={cn('w-full', styles.btnOr)}>
            <Link href={hrefs.revanche}>
              <Swords className="size-5" aria-hidden="true" /> Revanche contre {rival.name}
            </Link>
          </Button>
          <div className={styles.deux}>
            <Button asChild variant="outline" size="lg" className="flex-1 font-extrabold">
              <Link href={hrefs.nouveau}>
                <Shuffle className="size-4" aria-hidden="true" /> Nouveau duel
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="flex-1 font-extrabold">
              <Link href={hrefs.arene}>Retour à l’arène</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * « Ligue Bronze 1 · 14e → 11e » et l'enjeu, avec l'XP versée en pastille —
 * la seule échelle qui monte (13/10/2026). Les XP volent d'ici vers le bandeau.
 */
function LigneLigue({ ligue, gains }: { ligue: LigueApresCourse; gains: DuelCourseOutcome['gains'] }) {
  const division = echelon(ligue.echelon)
  const monte = ligue.rangAvant > ligue.rang
  return (
    <div className={styles.ligue}>
      <Image src={division.rang.image} alt="" width={224} height={224} className={styles.ligueBlason} aria-hidden="true" />
      <div className={styles.ligueTexte}>
        <span className={styles.ligueLib}>Ligue {division.nom}</span>
        <span className={styles.liguePlace}>
          {ligue.entree ? (
            <>
              Tu entres <strong>{ordinal(ligue.rang)}</strong>
            </>
          ) : monte ? (
            <>
              <s>{ordinal(ligue.rangAvant)}</s>
              <span aria-hidden="true"> → </span>
              <span className="sr-only">, puis </span>
              <strong>{ordinal(ligue.rang)}</strong>
            </>
          ) : (
            <strong>{ordinal(ligue.rang)}</strong>
          )}
          <small> sur {ligue.taille}</small>
        </span>
        <span className={styles.ligueEnjeu}>{enjeuLigue(ligue)}</span>
      </div>
      <PanneauRecompenses compact gains={gains} className={styles.ligueGains} />
    </div>
  )
}

/** Pourquoi il n'y a ni ligue ni gain — ce que le serveur a vraiment établi. */
function messageSansLigue(server: DuelCourseOutcome | null): string {
  if (!server) return 'Résultat non confirmé : réessaie depuis l’arène.'
  switch (server.statut) {
    case 'non_verifie':
      return 'Adversaire non vérifié : course comptée, rien de plus.'
    case 'deja_compte':
      return 'Course déjà enregistrée : ta ligue est à jour dans l’onglet Amis.'
    case 'non_connecte':
      return 'Session expirée : reconnecte-toi pour que tes courses comptent.'
    default:
      return 'Course comptée.'
  }
}

function Combattant({
  camp,
  label,
  gagnant,
  echelon: index,
}: {
  camp: ResultCamp
  label: string
  gagnant: boolean
  /** Sa division de ligue (null : inconnue, pas d'étiquette). */
  echelon: number | null
}) {
  const division = index === null ? null : echelon(index)
  return (
    <div className={styles.combattant}>
      <div className={cn(styles.sprite, gagnant ? styles.spriteTouche : styles.spriteKo)}>
        <AvatarRender config={camp.avatar} className="size-full" />
        {camp.isBot ? <span className="course-robot">IA</span> : null}
      </div>
      <p className={styles.nom}>{label}</p>
      <p className={cn(styles.score, gagnant && styles.scoreOr)}>{camp.score}</p>
      {division ? (
        <p className={styles.rang}>
          <Image src={division.rang.image} alt="" width={224} height={224} aria-hidden="true" />
          {division.nom}
          <span className="sr-only"> — division de ligue</span>
        </p>
      ) : null}
    </div>
  )
}

// Une salve de confettis en CSS (`.defi-confetti`, déjà dans l'app) : vingt-huit
// pièces, aux couleurs de la maison — or, violet, crème.
const PIECES = Array.from({ length: 28 }, (_, i) => {
  const angle = (i / 28) * Math.PI * 2
  const dist = 90 + (i % 5) * 26
  return {
    tx: `${Math.round(Math.cos(angle) * dist)}px`,
    ty: `${Math.round(Math.sin(angle) * dist - 60)}px`,
    rot: `${(i * 47) % 360}deg`,
    delay: `${(i % 7) * 35}ms`,
    color: ['#f5b722', '#7a3fe0', '#fffdf7', '#fcd34d', '#b9a6ff'][i % 5],
  }
})

export function Confettis() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-16 h-0" aria-hidden="true">
      {PIECES.map((p, i) => (
        <span
          key={i}
          className="defi-confetti"
          style={
            {
              '--tx': p.tx,
              '--ty': p.ty,
              '--rot': p.rot,
              animationDelay: p.delay,
              // `both` : la salve finie, chaque pièce reste à son dernier état
              // (évanouie) — avec le `backwards` de la classe, les vingt-huit
              // retombaient au point de départ en un petit carré visible.
              animationFillMode: 'both',
              background: p.color,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
