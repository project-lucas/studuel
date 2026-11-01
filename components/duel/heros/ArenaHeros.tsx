'use client'

import Image from 'next/image'
import AvatarRang from '@/components/AvatarRang'
import type { AvatarAffiche } from '@/lib/avatar-affiche'
import type { Heros, PosesHeros } from '@/lib/heros/catalogue'
import { partPv, pvRestants, tonPv, type Coup } from '@/lib/heros/combat'
import { PORTRAIT_FACE_CROP } from '@/lib/portraits'
import type { RankTierId } from '@/lib/rank'
import { cn } from '@/lib/utils'
import s from './ArenaHeros.module.css'

// L'ARÈNE DES HÉROS (29/10/2026) — la peau « Pokémon » de la course classée,
// avec les héros de l'académie à la place des avatars.
//
// Moi en bas à gauche, vu de DOS ; l'adversaire en haut à droite, vu de FACE ;
// chacun sur son plateau, sa plaque de PV en vis-à-vis — l'avatar de l'élève
// dans l'anneau de son rang de ligue. Le composant n'a pas de fond : la lice de
// l'académie couvre tout l'écran (la page la pose). Il ne décide de rien : il
// LIT les deux scores de la course et le dernier coup porté.
//
//   · une bonne réponse → l'attaque fétiche : le héros passe dans sa pose
//     d'attaque et fond sur l'autre, la croix de lumière éclate sur la cible,
//     les dégâts volent, sa barre descend (la barre fantôme suit en retard) ;
//   · la question dorée → le coup CRITIQUE : plus grand, l'arène tremble ;
//   · une barre vide → le K.O. : le héros s'assoit, sonné, les étoiles autour.
//
// Tout bouge en transform et opacité, valeurs littérales (règle de l'arène
// vivante). Une animation se rejoue en alternant deux noms d'images-clés
// identiques (parité du coup) : pas de remontage, donc pas d'image qui clignote.

/** La durée de la pose d'attaque (fente + retour), en ms. */
export const MS_POSE_ATTAQUE = 560

export type CoupDate = Coup & { atMs: number }

type Camp = 'moi' | 'rival'

/** Qui se bat : l'élève (son nom, son avatar, son rang de ligue). */
export type JoueurDuel = {
  nom: string
  photo: AvatarAffiche
  /** Le rang de ligue ; `null` avant la première XP (un anneau blanc). */
  rang: { id: RankTierId; division: number | null } | null
  /** « Bronze II », ou `null`. */
  rangLabel: string | null
}

type CampDuel = { joueur: JoueurDuel; heros: Heros; score: number }

export default function ArenaHeros({
  moi,
  rival,
  coup,
  maintenant,
  ko,
  fin = 'ko',
  entree,
  recherche = false,
}: {
  moi: CampDuel
  rival: CampDuel
  /** Le dernier coup porté, avec l'instant où il l'a été. */
  coup: CoupDate | null
  /** L'horloge de la course (ms) — elle fait retomber la pose d'attaque. */
  maintenant: number
  /** Le camp mis K.O., ou null. */
  ko: Camp | null
  /** Comment le duel s'est fini : barre vide, ou chrono à zéro (le perdant
   *  tombe aussi, mais le tampon ne ment pas sur ses PV). */
  fin?: 'ko' | 'temps'
  /** L'écran VS : les deux héros entrent en scène. */
  entree: boolean
  /** On cherche encore un adversaire : la lice n'a que mon héros. */
  recherche?: boolean
}) {
  const pvMoi = pvRestants(rival.score)
  const pvRival = pvRestants(moi.score)
  const enAttaque = coup !== null && maintenant - coup.atMs < MS_POSE_ATTAQUE ? coup.camp : null
  const parite = coup ? (coup.id % 2 === 0 ? 'a' : 'b') : null

  return (
    <section
      className={cn(s.arene, coup?.critique && parite && s[`secousse_${parite}`])}
      aria-label={recherche ? 'Recherche d’un adversaire' : `Duel : ${moi.joueur.nom} contre ${rival.joueur.nom}`}
      data-entree={entree ? 'true' : undefined}
    >
      {recherche ? null : (
        <>
          <Plaque camp="rival" joueur={rival.joueur} heros={rival.heros} pv={pvRival} />
          <Combattant
            camp="rival"
            heros={rival.heros}
            pose={ko === 'rival' ? 'ko' : enAttaque === 'rival' ? 'attaque' : 'repos'}
            coup={coup}
            parite={parite}
          />
        </>
      )}
      <Combattant
        camp="moi"
        heros={moi.heros}
        pose={ko === 'moi' ? 'ko' : enAttaque === 'moi' ? 'attaque' : 'repos'}
        coup={coup}
        parite={parite}
      />
      <Plaque camp="moi" joueur={moi.joueur} heros={moi.heros} pv={pvMoi} chiffres />

      {coup && parite ? <Impact coup={coup} parite={parite} cri={(coup.camp === 'moi' ? moi : rival).heros.attaque.cri} /> : null}

      {entree && !recherche ? (
        <span className={s.vs} aria-hidden="true">
          VS
        </span>
      ) : null}

      {ko ? (
        <span className={s.ko} data-camp={ko} role="status">
          {fin === 'temps' ? 'Temps !' : 'K.O. !'}
        </span>
      ) : null}
    </section>
  )
}

function Plaque({
  camp,
  joueur,
  heros,
  pv,
  chiffres = false,
}: {
  camp: Camp
  joueur: JoueurDuel
  heros: Heros
  pv: number
  /** Mes PV s'écrivent en chiffres ; ceux de l'adversaire se lisent à la barre. */
  chiffres?: boolean
}) {
  const part = partPv(pv)
  const photo = joueur.photo.visage ? (
    // eslint-disable-next-line @next/next/no-img-element -- portrait servi tel quel, cadré sur le visage
    <img src={joueur.photo.src} alt="" draggable={false} className="absolute max-w-none object-contain" style={PORTRAIT_FACE_CROP} />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element -- avatar composé (data-URI) ou dessiné
    <img src={joueur.photo.src} alt="" draggable={false} />
  )
  return (
    <div className={s.plaque} data-camp={camp}>
      <AvatarRang photo={photo} rang={joueur.rang} className={s.avatar} />
      <div className={s.corps}>
        <div className={s.plaqueHaut}>
          <span className={cn(s.nom, 'font-heading font-extrabold')}>{joueur.nom}</span>
          {joueur.rangLabel ? <span className={s.rang}>{joueur.rangLabel}</span> : null}
        </div>
        <div
          className={s.barre}
          role="meter"
          aria-label={`Points de vie de ${joueur.nom} (${heros.nom})`}
          aria-valuemin={0}
          aria-valuemax={1000}
          aria-valuenow={pv}
        >
          <span className={s.pv}>PV</span>
          <span className={s.rail}>
            <span className={s.fantome} style={{ transform: `scaleX(${part})` }} />
            <span className={s.remplissage} data-ton={tonPv(part)} style={{ transform: `scaleX(${part})` }} />
          </span>
        </div>
        {chiffres ? (
          <span className={cn(s.chiffres, 'tabular-nums')}>
            {pv} / 1000
          </span>
        ) : null}
      </div>
    </div>
  )
}

const POSES_DU_CAMP: Record<Camp, Record<'repos' | 'attaque' | 'ko', keyof PosesHeros>> = {
  // Moi de dos, l'adversaire de face.
  moi: { repos: 'dos', attaque: 'attaqueDos', ko: 'ko' },
  rival: { repos: 'face', attaque: 'attaqueFace', ko: 'ko' },
}

/** Moi, je regarde à droite (l'adversaire est en haut à droite) ; lui, à gauche. */
const REGARD_DU_CAMP: Record<Camp, 'gauche' | 'droite'> = { moi: 'droite', rival: 'gauche' }

function Combattant({
  camp,
  heros,
  pose,
  coup,
  parite,
}: {
  camp: Camp
  heros: Heros
  pose: 'repos' | 'attaque' | 'ko'
  coup: CoupDate | null
  parite: 'a' | 'b' | null
}) {
  const cles = POSES_DU_CAMP[camp]
  const retournee = (p: 'repos' | 'attaque' | 'ko') => heros.regards[cles[p]] !== REGARD_DU_CAMP[camp]
  const geste =
    coup && parite && pose !== 'ko'
      ? coup.camp === camp
        ? s[`attaque_${camp}_${parite}`]
        : s[`touche_${parite}`]
      : undefined
  const touche = coup !== null && coup.camp !== camp && pose !== 'ko'

  return (
    <div className={s.combattant} data-camp={camp} data-pose={pose}>
      <span className={s.plateau} aria-hidden="true" />
      <div className={s.souffle}>
        <div className={cn(s.geste, geste)}>
          {/* Les trois poses restent montées : la bascule est une opacité,
              jamais un chargement. Chacune dans son calque, retourné si elle
              regarde du mauvais côté. */}
          {(['repos', 'attaque', 'ko'] as const).map((p) => (
            <span key={p} className={cn(s.calque, retournee(p) && s.miroir)}>
              <Image
                unoptimized
                src={heros.poses[cles[p]]}
                alt={p === pose ? `${heros.nom}${p === 'ko' ? ', K.O.' : ''}` : ''}
                aria-hidden={p === pose ? undefined : true}
                fill
                priority
                sizes="(max-width: 640px) 60vw, 360px"
                className={cn(s.sprite, p === pose && s.visible, p === 'ko' && pose === 'ko' && s.chute)}
              />
            </span>
          ))}
          {touche && parite ? (
            <span className={cn(s.calque, retournee('repos') && s.miroir)}>
              <Image
                unoptimized
                src={heros.poses[cles.repos]}
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 640px) 60vw, 360px"
                className={cn(s.sprite, s.flash, s[`flash_${parite}`])}
              />
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function Impact({ coup, parite, cri }: { coup: CoupDate; parite: 'a' | 'b'; cri: string }) {
  const cible: Camp = coup.camp === 'moi' ? 'rival' : 'moi'
  return (
    <>
      <span
        className={cn(s.impact, s[`impact_${parite}`], coup.critique && s.impactCritique)}
        data-cible={cible}
        aria-hidden="true"
      >
        <span className={s.eclat} />
        <span className={s.croix} />
      </span>
      <span className={cn(s.degats, s[`degats_${parite}`], 'font-heading font-extrabold tabular-nums')} data-cible={cible}>
        −{coup.degats}
      </span>
      {coup.critique ? (
        <span className={cn(s.critique, s[`critique_${parite}`], 'font-heading font-extrabold')} aria-hidden="true">
          Coup critique !<small>{cri}</small>
        </span>
      ) : null}
    </>
  )
}
