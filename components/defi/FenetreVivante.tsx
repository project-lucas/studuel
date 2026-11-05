'use client'

import { useEffect, useRef, useState } from 'react'
import {
  CASCADE,
  ECLATS,
  FENETRE,
  FICHIERS_FENETRE,
  FUMEE,
  HIBOU,
  NUAGES,
  OISEAUX,
  POUSSIERES,
  doitJouerLaVideo,
  enPourcentDePlanche,
} from '@/lib/arena-fenetre'
import { cn } from '@/lib/utils'
import styles from './FenetreVivante.module.css'

type Connexion = { saveData?: boolean; effectiveType?: string }

const mouvementReduit = () =>
  typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * LA FENÊTRE VIVANTE — le fond de l'arène : l'école vue de la fenêtre de la
 * chambre, en trois plans (la vue, le cadre de pierre, le plan proche). Voir
 * lib/arena-fenetre.ts pour la composition et la géométrie.
 *
 * - L'AFFICHE (image fixe de la vue) s'affiche tout de suite ; la VIDÉO en
 *   boucle se charge ensuite, seulement si elle a un sens (ni mouvement réduit,
 *   ni économie de données, ni 2G), et se pose en fondu quand elle joue.
 * - La vidéo se met en pause quand l'app passe à l'arrière-plan et quand
 *   l'onglet est caché (les effets d'un onglet gardé vivant sont démontés).
 * - LA VUE EST FIXE (Lucas, 05/11/2026) : ni dérive, ni parallaxe — voir
 *   lib/arena-fenetre.ts. Tout ce qui bouge vit DANS la vue ou devant elle.
 *
 * `anime={false}` fige tout (décor posé derrière un rideau, capture).
 */
export default function FenetreVivante({ anime = true }: { anime?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [avecVideo, setAvecVideo] = useState(false)
  const [videoPrete, setVideoPrete] = useState(false)

  // La vidéo ne part qu'après le premier affichage : l'affiche, le cadre et le
  // HUD passent d'abord.
  useEffect(() => {
    if (!anime) return
    const connexion = (navigator as Navigator & { connection?: Connexion }).connection
    const jouer = doitJouerLaVideo({
      mouvementReduit: mouvementReduit(),
      economieDeDonnees: connexion?.saveData === true,
      reseau: connexion?.effectiveType,
    })
    if (!jouer) return
    const attente = window.setTimeout(() => setAvecVideo(true), 400)
    return () => window.clearTimeout(attente)
  }, [anime])

  useEffect(() => {
    const video = videoRef.current
    // Figé (`anime={false}`), le décor ne décode plus rien : le nettoyage de
    // l'effet précédent a déjà mis la vidéo en pause.
    if (!video || !avecVideo || !anime) return
    // React ne pose pas toujours l'attribut `muted` : sans lui, la lecture
    // automatique est refusée.
    video.muted = true
    const suivreLaVisibilite = () => {
      if (document.visibilityState !== 'visible') {
        video.pause()
        return
      }
      // Lecture refusée (réglage du navigateur, économie d'énergie) : ce n'est
      // pas une erreur — l'affiche reste, et la vie légère en CSS continue.
      video.play().catch(() => undefined)
    }
    suivreLaVisibilite()
    document.addEventListener('visibilitychange', suivreLaVisibilite)
    return () => {
      document.removeEventListener('visibilitychange', suivreLaVisibilite)
      video.pause()
    }
  }, [avecVideo, anime])

  return (
    <div className={cn(styles.cadre, !anime && styles.fige)} aria-hidden="true">
      <div className={styles.socle} />
      <div className={styles.planche}>
        {/* 1. LA VUE */}
        <div className={styles.boite} style={enPourcentDePlanche(FENETRE.vue)}>
          <div className={styles.vue}>
            {/* eslint-disable-next-line @next/next/no-img-element -- déjà à sa taille, servie telle quelle */}
            <img className={styles.affiche} src={FICHIERS_FENETRE.affiche} alt="" decoding="async" fetchPriority="high" />
            {avecVideo ? (
              // L'adresse est posée sur la vidéo elle-même, jamais dans un
              // <source> : changer un <source> ne recharge pas une vidéo déjà
              // lancée, et l'ancienne vue restait à l'écran sous la nouvelle
              // (deux chouettes, le 05/11/2026, dans un onglet resté ouvert).
              <video
                ref={videoRef}
                className={cn(styles.video, videoPrete && styles.videoPrete)}
                src={FICHIERS_FENETRE.video}
                muted
                loop
                playsInline
                autoPlay
                preload="auto"
                disablePictureInPicture
                tabIndex={-1}
                onPlaying={() => setVideoPrete(true)}
              />
            ) : null}

            {NUAGES.map((n) => (
              <div
                key={n.src}
                className={styles.couloir}
                style={{
                  top: `${n.haut}%`,
                  aspectRatio: `${100 / (n.largeur * n.rapport)}`,
                  animationDuration: `${n.duree}s`,
                  animationDelay: `${n.retard}s`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- élément détouré, servi tel quel */}
                <img
                  className={cn(styles.nuage, n.miroir && styles.nuageMiroir)}
                  src={n.src}
                  alt=""
                  decoding="async"
                  style={{ width: `${n.largeur}%` }}
                />
              </div>
            ))}

            <div className={styles.vol}>
              {OISEAUX.map((o) => (
                <i
                  key={`${o.x}-${o.y}`}
                  className={styles.oiseau}
                  style={{ left: `${o.x}%`, top: `${o.y}%`, animationDelay: `${o.retard}s` }}
                >
                  <svg viewBox="0 0 12 6" fill="none" aria-hidden="true">
                    <path d="M0.6 1.6 Q3.4 0.4 6 5 Q8.6 0.4 11.4 1.6" stroke="#55607f" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </i>
              ))}
            </div>

            {/* La chouette au courrier fait sa tournée, devant les nuages. */}
            <div className={styles.hibouX}>
              <div className={styles.hibouY}>
                <div className={styles.hibouCorps} style={{ width: `${HIBOU.largeur}%` }}>
                  <div className={styles.hibouAiles} style={{ aspectRatio: `${HIBOU.caseL} / ${HIBOU.caseH}` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- bande de poses, servie telle quelle */}
                    <img
                      className={styles.hibouBande}
                      src={HIBOU.src}
                      alt=""
                      decoding="async"
                      style={{
                        width: `${HIBOU.poses * 100}%`,
                        animationDuration: `${HIBOU.battement}s`,
                        animationTimingFunction: `steps(${HIBOU.poses})`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              className={styles.chute}
              style={{
                left: `${CASCADE.boite.x}%`,
                top: `${CASCADE.boite.y}%`,
                width: `${CASCADE.boite.l}%`,
                height: `${CASCADE.boite.h}%`,
              }}
            >
              <i className={styles.filet} style={{ left: '12%' }} />
              <i className={styles.filet} style={{ left: '44%', animationDelay: '-0.45s' }} />
              <i className={styles.filet} style={{ left: '72%', animationDelay: '-0.85s' }} />
            </div>
            <i
              className={styles.ecume}
              style={{ left: `${CASCADE.ecume.x}%`, top: `${CASCADE.ecume.y}%`, width: `${CASCADE.ecume.taille}%` }}
            />

            {[0, -2.1, -4.3].map((retard) => (
              <i
                key={retard}
                className={styles.volute}
                style={{ left: `${FUMEE.x}%`, top: `${FUMEE.y}%`, width: `${FUMEE.taille}%`, animationDelay: `${retard}s` }}
              />
            ))}

            {ECLATS.map((e) => (
              <i
                key={`${e.x}-${e.y}`}
                className={styles.eclat}
                style={{
                  left: `${e.x}%`,
                  top: `${e.y}%`,
                  width: `${e.taille}%`,
                  animationDuration: `${e.duree}s`,
                  animationDelay: `${e.retard}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* 2. LE CADRE */}
        {/* eslint-disable-next-line @next/next/no-img-element -- détouré, déjà à sa taille, servi tel quel */}
        <img className={styles.pierre} src={FICHIERS_FENETRE.cadre} alt="" decoding="async" />

        {/* 3. LE PLAN PROCHE */}
        <div className={styles.proche}>
          <div className={styles.rayon} />
          {POUSSIERES.map((p) => (
            <i
              key={`${p.x}-${p.y}`}
              className={cn(styles.grain, styles[`trajet${p.trajet}`])}
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${(p.taille / FENETRE.largeur) * 100}%`,
                animationDuration: `${p.duree}s`,
                animationDelay: `${p.retard}s`,
              }}
            />
          ))}
        </div>
      </div>
      {/* Écran large : les bords de la fenêtre se fondent dans le mur. */}
      <div className={cn(styles.fondu, styles.fonduGauche)} />
      <div className={cn(styles.fondu, styles.fonduDroit)} />
    </div>
  )
}
