'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import AvatarRang from '@/components/AvatarRang'
import type { AvatarAffiche } from '@/lib/avatar-affiche'
import { coeursAvant, SUPER_TOUTES, type Camp, type Coup } from '@/lib/combat/coup'
import { dernierCoeur, type Coeurs } from '@/lib/combat/coeurs'
import { ECLAT_CRITIQUE, type CleDePose, type Combattant } from '@/lib/combat/combattants'
import { PORTRAIT_FACE_CROP } from '@/lib/portraits'
import type { RankTierId } from '@/lib/rank'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import RangeeCoeurs from './Coeurs'
import s from './ArenaCombat.module.css'

// L'ARÈNE DU COMBAT (02/11/2026) — docs/CADRAGE-COMBAT-HEROS.md.
//
// UNE arène pour trois combats : le duel classé, le défi d'un ami, le combat
// de gardien. Moi en bas à gauche, vu de DOS ; l'adversaire (un héros, ou le
// prof-boss) en haut à droite, vu de FACE ; chacun sa plaque et sa rangée de
// CŒURS. Le composant n'a pas de fond (la page pose le décor) et ne décide de
// rien : il JOUE le dernier coup que l'appelant lui passe.
//
// La grammaire d'un coup, réglée sur MS_IMPACT :
//   0 ms      l'attaquant passe en pose d'attaque et fond en avant ;
//   100 ms    le projectile de son attaque fétiche part de sa main ;
//   MS_IMPACT l'impact éclate sur la cible, qui recule (pose « touché » ou
//             flash blanc), le chiffre des dégâts jaillit, ses cœurs perdent
//             leur quart ou se brisent ;
//   critique  l'éclat d'or, « Coup critique ! », l'arène tremble ;
//   super     le projectile en grand, la caméra qui pousse vers la cible.
//
// Tout est CSS : chaque animation existe en deux exemplaires (_a / _b) et la
// parité de l'id du coup choisit le sien — un nouveau coup rejoue tout sans
// remonter une image. Transform et opacité seulement, valeurs littérales.

/** L'instant de l'impact après le début du coup (ms). */
export const MS_IMPACT = 440

/** Qui se bat : son nom, son avatar, son rang (un élève) ou son rang de gardien. */
export type JoueurCombat = {
  nom: string
  photo: AvatarAffiche
  /** Le rang de ligue ; `null` : un anneau blanc (avant la 1re XP, ou un gardien). */
  rang: { id: RankTierId; division: number | null } | null
  /** « Bronze II », « Rang I », ou `null`. */
  rangLabel: string | null
}

export type CampCombat = { joueur: JoueurCombat; combattant: Combattant; coeurs: Coeurs }

/** Une réplique façon Pokémon, écrite lettre à lettre en bas de l'arène. */
export type Replique = { id: number; texte: string }

export default function ArenaCombat({
  moi,
  rival,
  coup,
  ko,
  fin = 'ko',
  entree,
  recherche = false,
  serie = 0,
  replique = null,
  variante = 'duel',
}: {
  moi: CampCombat
  rival: CampCombat
  /** Le dernier coup : il porte, ou il est esquivé (`coup.rate`). */
  coup: Coup | null
  /** Le camp mis K.O., ou null. */
  ko: Camp | null
  /** Barre vide, ou chrono à zéro (le tampon ne ment pas sur les cœurs). */
  fin?: 'ko' | 'temps'
  /** L'écran VS : les deux combattants entrent en scène. */
  entree: boolean
  /** On cherche encore un adversaire : la lice n'a que mon héros. */
  recherche?: boolean
  /** Mes bonnes réponses d'affilée : la jauge du super. */
  serie?: number
  replique?: Replique | null
  /** `boss` : l'adversaire est un prof-boss, plus grand, sur le seuil de sa tanière. */
  variante?: 'duel' | 'boss'
}) {
  const parite = coup ? (coup.id % 2 === 0 ? 'a' : 'b') : null
  const cible: Camp | null = coup ? (coup.camp === 'moi' ? 'rival' : 'moi') : null
  const perteDe = (camp: Camp, coeurs: Coeurs) =>
    coup && cible === camp ? { id: coup.id, avant: coeursAvant(coeurs, coup) } : null
  const alerte = !ko && !recherche && dernierCoeur(moi.coeurs)

  // Le son de l'impact, calé sur l'image (MS_IMPACT) : un coup franc, ou le
  // coup lourd et cristallin du critique et du super. Une esquive ne tape rien.
  const coupId = coup?.id ?? null
  const coupSonore = coup && !coup.rate ? (coup.critique || coup.super ? 'fort' : 'franc') : null
  useEffect(() => {
    if (coupId === null || coupSonore === null) return
    const m = window.setTimeout(() => sfx.impact(coupSonore === 'fort'), MS_IMPACT)
    return () => window.clearTimeout(m)
  }, [coupId, coupSonore])

  return (
    <section
      className={s.arene}
      data-variante={variante}
      data-entree={entree ? 'true' : undefined}
      data-replique={replique ? 'true' : undefined}
      aria-label={recherche ? 'Recherche d’un adversaire' : `Combat : ${moi.joueur.nom} contre ${rival.joueur.nom}`}
    >
      {/* La caméra : elle tremble au critique et pousse au super. */}
      <div
        className={cn(
          s.camera,
          coup && parite && coup.critique && s[`secousse_${parite}`],
          coup && parite && coup.super && s[`pousse_${coup.camp}_${parite}`],
        )}
      >
        {recherche ? null : (
          <Combattant camp="rival" c={rival.combattant} ko={ko === 'rival'} coup={coup} parite={parite} />
        )}
        <Combattant camp="moi" c={moi.combattant} ko={ko === 'moi'} coup={coup} parite={parite} />
        {coup && parite ? (
          <Attaque coup={coup} parite={parite} c={(coup.camp === 'moi' ? moi : rival).combattant} />
        ) : null}
        {coup && parite && coup.rate ? <MotEsquive camp={coup.camp === 'moi' ? 'rival' : 'moi'} parite={parite} /> : null}
      </div>

      {alerte ? <span className={s.alerte} aria-hidden="true" /> : null}

      {recherche ? null : (
        <Plaque camp="rival" camp_={rival} perte={perteDe('rival', rival.coeurs)} />
      )}
      <Plaque camp="moi" camp_={moi} perte={perteDe('moi', moi.coeurs)} serie={serie} />

      {entree && !recherche ? (
        <span className={s.vs} aria-hidden="true">
          VS
        </span>
      ) : null}

      {replique ? <BoiteReplique replique={replique} /> : null}

      {ko ? (
        <span className={s.ko} data-camp={ko} role="status">
          {fin === 'temps' ? 'Temps !' : 'K.O. !'}
        </span>
      ) : null}
    </section>
  )
}

// --- la plaque : avatar dans l'anneau de rang, nom, cœurs, jauge du super -----

function Plaque({
  camp,
  camp_: { joueur, combattant, coeurs },
  perte,
  serie,
}: {
  camp: Camp
  camp_: CampCombat
  perte: { id: number; avant: Coeurs } | null
  /** Ma série : la jauge du super (seulement sur ma plaque). */
  serie?: number
}) {
  const photo = joueur.photo.visage ? (
    // eslint-disable-next-line @next/next/no-img-element -- portrait servi tel quel, cadré sur le visage
    <img src={joueur.photo.src} alt="" draggable={false} className="absolute max-w-none object-contain" style={PORTRAIT_FACE_CROP} />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element -- avatar composé (data-URI) ou dessiné
    <img src={joueur.photo.src} alt="" draggable={false} className="size-full object-cover" />
  )
  const charge = serie === undefined ? null : serie % SUPER_TOUTES
  return (
    <div className={s.plaque} data-camp={camp}>
      <AvatarRang photo={photo} rang={joueur.rang} className={s.avatar} />
      <div className={s.corps}>
        <div className={s.plaqueHaut}>
          <span className={cn(s.nom, 'font-heading font-extrabold')}>{joueur.nom}</span>
          {joueur.rangLabel ? <span className={s.rang}>{joueur.rangLabel}</span> : null}
        </div>
        <RangeeCoeurs
          coeurs={coeurs}
          perte={perte}
          delaiMs={MS_IMPACT}
          chiffre={camp === 'moi'}
          taille={coeurs.max > 5 ? 'sm' : 'md'}
          nom={`${joueur.nom} (${combattant.nom})`}
        />
        {charge !== null ? (
          <span className={s.super} aria-label={`Super : ${charge} sur ${SUPER_TOUTES}`} role="img">
            {Array.from({ length: SUPER_TOUTES }, (_, i) => (
              <span key={i} className={s.cran} data-plein={i < charge ? 'true' : undefined} />
            ))}
            <span className={s.superMot}>Super</span>
          </span>
        ) : null}
      </div>
    </div>
  )
}

// --- un combattant : ses poses empilées, la bascule est une opacité ----------

/** Moi de dos, l'adversaire de face. */
const POSES: Record<Camp, { repos: CleDePose; attaque: CleDePose; touche: CleDePose | null }> = {
  moi: { repos: 'dos', attaque: 'attaqueDos', touche: 'toucheDos' },
  rival: { repos: 'face', attaque: 'attaqueFace', touche: null },
}

/** Moi, je regarde à droite (l'adversaire est en haut à droite) ; lui, à gauche. */
const REGARD: Record<Camp, 'gauche' | 'droite'> = { moi: 'droite', rival: 'gauche' }

function Combattant({
  camp,
  c,
  ko,
  coup,
  parite,
}: {
  camp: Camp
  c: Combattant
  ko: boolean
  coup: Coup | null
  parite: 'a' | 'b' | null
}) {
  const cles = POSES[camp]
  // Un boss n'a pas de dos : s'il était de mon côté (jamais), il garderait sa face.
  const src = (cle: CleDePose | null) => (cle ? c.poses[cle] : undefined) ?? c.poses.face
  const miroir = (cle: CleDePose) => (c.regards[cle] ?? REGARD[camp]) !== REGARD[camp]
  const attaque = !ko && coup && parite && coup.camp === camp
  const touche = !ko && coup && parite && coup.camp !== camp && !coup.rate
  const toucheDessinee = cles.touche !== null && Boolean(c.poses[cles.touche])
  // Visé par une attaque ratée : il l'esquive d'un pas de côté.
  const pEsq = !ko && coup && parite && coup.rate && coup.camp !== camp ? parite : null

  const calque = (cle: CleDePose | null, classe: string | false | undefined | null, alt: string) => {
    const vraieCle = cle && c.poses[cle] ? cle : camp === 'moi' ? 'dos' : 'face'
    return (
      <span className={cn(s.calque, miroir(vraieCle) && s.miroir)}>
        <Image
          unoptimized
          src={src(cle) as string}
          alt={alt}
          aria-hidden={alt ? undefined : true}
          fill
          sizes="(max-width: 640px) 60vw, 360px"
          className={cn(s.sprite, classe)}
        />
      </span>
    )
  }

  return (
    <div className={s.combattant} data-camp={camp} data-famille={c.famille} data-pose={ko ? 'ko' : 'repos'}>
      <span className={s.plateau} aria-hidden="true" />
      <div className={cn(s.esquive, pEsq && s[`esquive_${camp}_${pEsq}`])}>
        <div className={s.souffle}>
          <div
            className={cn(
              s.geste,
              attaque && s[`fente_${camp}_${parite}`],
              touche && s[`recul_${camp}_${parite}`],
            )}
          >
            {ko ? (
              calque('ko', cn(s.visible, s.chute), `${c.nom}, K.O.`)
            ) : (
              <>
                {/* Les poses restent montées : la bascule est une opacité, jamais un chargement. */}
                {calque(
                  cles.repos,
                  cn(
                    s.visible,
                    attaque && s[`cacheAttaque_${parite}`],
                    touche && toucheDessinee && s[`cacheTouche_${parite}`],
                  ),
                  c.nom,
                )}
                {calque(cles.attaque, cn(s.pose, attaque && s[`montreAttaque_${parite}`]), '')}
                {toucheDessinee ? calque(cles.touche, cn(s.pose, touche && s[`montreTouche_${parite}`]), '') : null}
                {/* Le voile blanc du coup encaissé, sur la pose de repos de qui n'a pas de « touché » dessiné. */}
                {touche && !toucheDessinee ? calque(cles.repos, cn(s.pose, s.flash, s[`flash_${parite}`]), '') : null}
                {/* Le ko reste chargé, invisible, pour tomber sans attendre son image. */}
                {calque('ko', s.pose, '')}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// --- l'attaque : le projectile, l'impact, les dégâts, le critique ------------

function Attaque({ coup, parite, c }: { coup: Coup; parite: 'a' | 'b'; c: Combattant }) {
  const { projectile, projectileVers = 'droite', impact } = c.attaque.effet
  const cible: Camp = coup.camp === 'moi' ? 'rival' : 'moi'
  // Le projectile file vers la droite quand c'est moi qui frappe, vers la
  // gauche sinon : on retourne celui qui est dessiné dans l'autre sens.
  const versDessin = coup.camp === 'moi' ? 'droite' : 'gauche'
  return (
    <>
      {projectile ? (
        <span className={cn(s.trajet, s[`vol_${coup.camp}${coup.rate ? '_rate' : ''}_${parite}`])} data-camp={coup.camp} aria-hidden="true">
          <span className={cn(s.projectile, coup.super && s.projectileSuper)} data-camp={coup.camp}>
            <span className={cn(s.dessin, projectileVers !== versDessin && s.miroir)}>
              <Image unoptimized src={projectile} alt="" fill sizes="40vw" className={s.vfx} />
            </span>
          </span>
        </span>
      ) : null}
      {coup.rate ? null : (
        <span
          className={cn(s.impact, s[`impact_${parite}`], (coup.critique || coup.super) && s.impactFort)}
          data-cible={cible}
          aria-hidden="true"
        >
          <Image unoptimized src={impact} alt="" fill sizes="40vw" className={s.vfx} />
        </span>
      )}
      {coup.critique ? (
        <span className={cn(s.impact, s.eclatCritique, s[`impact_${parite}`])} data-cible={cible} aria-hidden="true">
          <Image unoptimized src={ECLAT_CRITIQUE} alt="" fill sizes="40vw" className={s.vfx} />
        </span>
      ) : null}
      {coup.degats !== null ? (
        <span className={cn(s.degats, s[`degats_${parite}`], 'font-heading font-extrabold tabular-nums')} data-cible={cible}>
          −{coup.degats}
        </span>
      ) : null}
      {coup.critique || coup.super ? (
        <span className={cn(s.annonce, s[`annonce_${parite}`], 'font-heading font-extrabold')} data-super={coup.super ? 'true' : undefined} aria-hidden="true">
          {coup.critique ? 'Coup critique !' : c.attaque.nom}
          <small>{c.attaque.cri}</small>
        </span>
      ) : null}
    </>
  )
}

/** « Esquivé ! » au-dessus de celui qui a évité l'attaque. */
function MotEsquive({ camp, parite }: { camp: Camp; parite: 'a' | 'b' }) {
  return (
    <span className={cn(s.motEsquive, s[`motEsquive_${parite}`], 'font-heading font-extrabold')} data-camp={camp} aria-hidden="true">
      Esquivé !
    </span>
  )
}

// --- la boîte de réplique, façon Pokémon -------------------------------------

/** L'écart entre deux lettres qui s'écrivent (ms). */
const MS_LETTRE = 28

function BoiteReplique({ replique }: { replique: Replique }) {
  const lettres = Array.from(replique.texte)
  return (
    <p key={replique.id} className={cn(s.replique, 'font-heading font-extrabold')} role="status" aria-label={replique.texte}>
      {lettres.map((l, i) => (
        <span key={i} className={s.lettre} style={{ animationDelay: `${i * MS_LETTRE}ms` }} aria-hidden="true">
          {l}
        </span>
      ))}
      <span className={s.suite} style={{ animationDelay: `${lettres.length * MS_LETTRE + 200}ms` }} aria-hidden="true" />
    </p>
  )
}
