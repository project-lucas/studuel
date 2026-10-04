'use client'

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import {
  DUREE_FEUILLETEE,
  DUREE_PAGE,
  ECART_FEUILLETEE,
  angleSousLeDoigt,
  courbePage,
  courbeRetour,
  dureeDeRetour,
  feuillesATourner,
  gesteAbouti,
  ombreDeFeuille,
  pile,
} from '@/lib/moi/carnet'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import styles from '@/components/moi/carnet/Carnet.module.css'

// -----------------------------------------------------------------------------
// LE CARNET — le moteur des pages qui tournent (04/10/2026).
//
// « Le côté carnet avec la possibilité de tourner les pages — très important,
// l'animation doit être impeccable » (Lucas). Ce composant ne sait rien de ce
// qu'il y a sur les pages : il reçoit des DOUBLES PAGES (gauche, droite) et les
// relie par des FEUILLES qui pivotent autour de la spirale (lib/moi/carnet).
//
// CE QUI REND LE GESTE JUSTE :
//   · le papier reste SOUS LE DOIGT — l'angle est l'arc cosinus de la position
//     du doigt (`angleSousLeDoigt`), pas une proportion du glissé ;
//   · un lancer franc finit la page, même court ; un geste lâché avant la
//     verticale la laisse retomber, avec la vitesse qu'elle avait ;
//   · la face qui se dresse s'assombrit, la page découverte reçoit l'ombre de
//     celle qui passe, et chaque feuille a sa propre perspective (la plus
//     haute paraît plus grande, comme une page qu'on soulève vers soi) ;
//   · l'onglet FEUILLETTE : plusieurs pages partent l'une après l'autre.
//
// PERFORMANCE. Les pages sont rendues UNE fois ; pendant un geste ou une
// animation, React ne re-rend rien : une boucle `requestAnimationFrame` écrit
// le `transform` des feuilles et l'opacité des ombres (transform et opacité
// seulement, la règle des animations continues de l'app). Seules les feuilles
// visibles sont peintes (`pile`) : une page couverte ne coûte rien.
// Mouvement réduit : la page change sans tourner.
// -----------------------------------------------------------------------------

export type DoublePage = { gauche: ReactNode; droite: ReactNode }

export type OngletCarnet = {
  titre: string
  /** La couleur de l'intercalaire (une identité, comme les outils de Marcel). */
  teinte: 'jaune' | 'rose' | 'vert' | 'violet'
}

type Animation = { de: number; vers: number; debut: number; duree: number; courbe: (t: number) => number }

type Geste = {
  id: number
  x0: number
  y0: number
  /** Position du point saisi, rapportée à la spirale. */
  rayon: number
  /** null tant que le geste n'est pas décidé (tap ou glissé ?). */
  feuille: number | null
  sens: 'avant' | 'arriere'
  echantillons: { x: number; t: number }[]
}

/** En deçà, c'est un tap : les boutons des pages gardent leur clic. */
const SEUIL_GLISSE = 9
/** Mémoire du navigateur : l'élève a déjà tourné une page. */
const CLE_DEJA_TOURNE = 'studuel-carnet-tourne'

export default function Carnet({
  pages,
  onglets,
  initiale = 0,
  onChange,
  label,
}: {
  pages: readonly DoublePage[]
  /** Un onglet par double page, sauf la première (la page de garde). */
  onglets: readonly OngletCarnet[]
  initiale?: number
  onChange?: (index: number) => void
  /** Le nom du carnet pour le lecteur d'écran. */
  label: string
}) {
  const nbFeuilles = pages.length - 1
  const [courante, setCourante] = useState(initiale)
  // L'onglet suit la destination dès le toucher, sans attendre la fin du feuilleté.
  const [cible, setCible] = useState(initiale)

  const livre = useRef<HTMLDivElement>(null)
  const feuilles = useRef<(HTMLDivElement | null)[]>([])
  const ombreDroite = useRef<HTMLDivElement>(null)
  const ombreGauche = useRef<HTMLDivElement>(null)

  const angles = useRef<number[]>(Array.from({ length: nbFeuilles }, (_, i) => (i < initiale ? 180 : 0)))
  const bouge = useRef<boolean[]>(Array.from({ length: nbFeuilles }, () => false))
  const animations = useRef(new Map<number, Animation>())
  const boucle = useRef<number | null>(null)
  const geste = useRef<Geste | null>(null)
  const avaleClic = useRef(false)
  const courantRef = useRef(initiale)
  const mouvementReduit = useRef(false)

  // --- La peinture : écrit l'état des feuilles dans le DOM ---------------------
  const peindre = useCallback(() => {
    const etats = pile(angles.current, bouge.current)
    let principale = -1
    for (let i = 0; i < nbFeuilles; i++) {
      const el = feuilles.current[i]
      if (!el) continue
      const angle = angles.current[i]
      const { z, peinte } = etats[i]
      el.style.zIndex = String(z)
      el.style.visibility = peinte ? 'visible' : 'hidden'
      el.style.transform = `perspective(var(--perspective)) rotateY(${-angle}deg)`
      // La lumière sur chaque face : la face qui se dresse s'assombrit.
      const ombre = ombreDeFeuille(angle)
      el.style.setProperty('--ombre-recto', angle < 90 ? String(ombre) : '1')
      el.style.setProperty('--ombre-verso', angle > 90 ? String(ombre) : '1')
      if (bouge.current[i] && (principale < 0 || Math.abs(angle - 90) < Math.abs(angles.current[principale] - 90))) {
        principale = i
      }
    }
    // L'ombre portée de la feuille la plus « debout » sur la page qu'elle couvre.
    const od = ombreDroite.current
    const og = ombreGauche.current
    if (od && og) {
      if (principale < 0) {
        od.style.opacity = '0'
        og.style.opacity = '0'
      } else {
        const angle = angles.current[principale]
        const cos = Math.cos((angle * Math.PI) / 180)
        const force = ombreDeFeuille(angle)
        const z = String(etats[principale].z - 1)
        if (angle < 90) {
          od.style.zIndex = z
          od.style.opacity = String(Math.min(1, force * 1.1))
          od.style.transform = `scaleX(${Math.min(1, cos + 0.18)})`
          og.style.opacity = '0'
        } else {
          og.style.zIndex = z
          og.style.opacity = String(Math.min(1, force * 1.1))
          og.style.transform = `scaleX(${Math.min(1, -cos + 0.18)})`
          od.style.opacity = '0'
        }
      }
    }
  }, [nbFeuilles])

  // --- La boucle d'animation ---------------------------------------------------
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const finir = useCallback(() => {
    // La double page affichée : autant de feuilles posées à gauche.
    const n = angles.current.filter((a) => a >= 179.5).length
    if (n !== courantRef.current) {
      courantRef.current = n
      setCourante(n)
      onChangeRef.current?.(n)
    }
    setCible(n)
  }, [])

  // La boucle se relance d'image en image par une référence : un rappel ne
  // peut pas se nommer lui-même dans sa propre déclaration.
  const etapeRef = useRef<(maintenant: number) => void>(() => {})
  const tourner = useCallback(
    (maintenant: number) => {
      boucle.current = null
      for (const [i, a] of animations.current) {
        const t = Math.min(1, (maintenant - a.debut) / a.duree)
        if (t < 0) continue
        angles.current[i] = a.de + (a.vers - a.de) * a.courbe(t)
        bouge.current[i] = true
        if (t >= 1) {
          animations.current.delete(i)
          angles.current[i] = a.vers
          bouge.current[i] = false
        }
      }
      peindre()
      if (animations.current.size > 0) {
        boucle.current = requestAnimationFrame((t) => etapeRef.current(t))
      } else if (geste.current?.feuille == null) {
        finir()
      }
    },
    [peindre, finir],
  )

  useEffect(() => {
    etapeRef.current = tourner
  }, [tourner])

  const lancer = useCallback(() => {
    if (boucle.current === null) boucle.current = requestAnimationFrame(tourner)
  }, [tourner])

  const animer = useCallback(
    (feuille: number, vers: number, duree: number, retard = 0, courbe = courbePage) => {
      animations.current.set(feuille, {
        de: angles.current[feuille],
        vers,
        debut: performance.now() + retard,
        duree,
        courbe,
      })
      lancer()
    },
    [lancer],
  )

  // --- Aller à une double page (onglet, coin, clavier) ---------------------------
  const allerA = useCallback(
    (vers: number) => {
      const depuis = courantRef.current
      if (vers === depuis || vers < 0 || vers > nbFeuilles) return
      if (animations.current.size > 0 || geste.current?.feuille != null) return
      const plan = feuillesATourner(depuis, vers)
      setCible(vers)
      if (mouvementReduit.current) {
        for (const { feuille, vers: a } of plan) angles.current[feuille] = a
        peindre()
        finir()
        sfx.page(true)
        return
      }
      const feuillete = plan.length > 1
      plan.forEach(({ feuille, vers: a }, k) => {
        animer(feuille, a, feuillete ? DUREE_FEUILLETEE : DUREE_PAGE, k * ECART_FEUILLETEE)
        window.setTimeout(() => sfx.page(feuillete), k * ECART_FEUILLETEE + 60)
      })
    },
    [animer, finir, nbFeuilles, peindre],
  )

  // --- Le doigt ---------------------------------------------------------------------
  const spirale = () => {
    const r = livre.current?.getBoundingClientRect()
    return r ? { x: r.left + r.width / 2, demiLargeur: r.width / 2 } : null
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 || animations.current.size > 0) return
    const s = spirale()
    if (!s) return
    geste.current = {
      id: e.pointerId,
      x0: e.clientX,
      y0: e.clientY,
      rayon: e.clientX - s.x,
      feuille: null,
      sens: e.clientX >= s.x ? 'avant' : 'arriere',
      echantillons: [{ x: e.clientX, t: e.timeStamp }],
    }
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const g = geste.current
    if (!g || g.id !== e.pointerId) return
    const s = spirale()
    if (!s) return
    g.echantillons.push({ x: e.clientX, t: e.timeStamp })
    if (g.echantillons.length > 6) g.echantillons.shift()

    if (g.feuille === null) {
      const dx = e.clientX - g.x0
      const dy = e.clientY - g.y0
      if (Math.abs(dx) < SEUIL_GLISSE || Math.abs(dx) < Math.abs(dy) * 1.2) return
      // Saisie à droite et tirée vers la gauche : la page suivante. L'inverse :
      // la précédente. Un geste dans l'autre sens (rien à tourner) est ignoré.
      const feuille =
        g.sens === 'avant' && dx < 0 && courantRef.current < nbFeuilles
          ? courantRef.current
          : g.sens === 'arriere' && dx > 0 && courantRef.current > 0
            ? courantRef.current - 1
            : null
      if (feuille === null) {
        geste.current = null
        return
      }
      g.feuille = feuille
      bouge.current[feuille] = true
      avaleClic.current = true
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
      sfx.page(true)
    }

    angles.current[g.feuille] = angleSousLeDoigt(e.clientX, s.x, g.rayon, s.demiLargeur * 0.55)
    peindre()
  }

  const onPointerEnd = (e: React.PointerEvent) => {
    const g = geste.current
    if (!g || g.id !== e.pointerId) return
    geste.current = null
    if (g.feuille === null) return
    const ech = g.echantillons
    const premier = ech[0]
    const dernier = ech[ech.length - 1]
    const vitesse = dernier.t > premier.t ? (dernier.x - premier.x) / (dernier.t - premier.t) : 0
    const angle = angles.current[g.feuille]
    const abouti = e.type === 'pointerup' && gesteAbouti(g.sens, angle, vitesse)
    const arrivee = (g.sens === 'avant') === abouti ? 180 : 0
    if (abouti) setCible(courantRef.current + (g.sens === 'avant' ? 1 : -1))
    animer(g.feuille, arrivee, dureeDeRetour(angle, arrivee), 0, courbeRetour)
  }

  // Un glissé ne doit pas finir en clic sur le bouton où le doigt s'est posé.
  const onClickCapture = (e: React.MouseEvent) => {
    if (avaleClic.current) {
      avaleClic.current = false
      e.stopPropagation()
      e.preventDefault()
    }
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') allerA(courantRef.current + 1)
    else if (e.key === 'ArrowLeft') allerA(courantRef.current - 1)
  }

  // --- Montage ------------------------------------------------------------------------
  useEffect(() => {
    mouvementReduit.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    peindre()
    const anims = animations.current
    const mouvants = bouge.current
    return () => {
      if (boucle.current !== null) cancelAnimationFrame(boucle.current)
      boucle.current = null
      // Onglet de l'app caché (Activity) en plein geste ou en plein feuilleté :
      // les pages se posent là où elles allaient, et le geste est oublié.
      for (const [i, a] of anims) angles.current[i] = a.vers
      anims.clear()
      geste.current = null
      angles.current = angles.current.map((a) => (a > 90 ? 180 : 0))
      mouvants.fill(false)
      finir()
    }
  }, [peindre, finir])

  // La première fois, le coin de la page se soulève tout seul : on comprend
  // qu'elle se tourne sans qu'il faille l'écrire.
  useEffect(() => {
    if (mouvementReduit.current || courantRef.current >= nbFeuilles) return
    let deja = false
    try {
      deja = window.localStorage.getItem(CLE_DEJA_TOURNE) === '1'
    } catch {
      deja = true
    }
    if (deja) return
    let retour = 0
    const minuteur = window.setTimeout(() => {
      if (animations.current.size > 0 || geste.current) return
      const f = courantRef.current
      animer(f, 28, 520, 0, courbeRetour)
      retour = window.setTimeout(() => animer(f, 0, 460, 0, courbePage), 640)
    }, 1100)
    return () => {
      window.clearTimeout(minuteur)
      window.clearTimeout(retour)
    }
  }, [animer, nbFeuilles])

  // Une page tournée une fois : l'invitation ne revient plus.
  useEffect(() => {
    if (courante === 0) return
    try {
      window.localStorage.setItem(CLE_DEJA_TOURNE, '1')
    } catch {
      // Stockage indisponible : l'invitation reviendra, sans dommage.
    }
  }, [courante])

  const depart = pile(
    Array.from({ length: nbFeuilles }, (_, i) => (i < initiale ? 180 : 0)),
    Array.from({ length: nbFeuilles }, () => false),
  )

  // Les pages hors de la double page affichée ne se lisent ni ne se touchent.
  const visible = (double: number) => double === courante

  return (
    <div className={styles.scene}>
      <div
        ref={livre}
        className={styles.livre}
        role="region"
        aria-roledescription="carnet"
        aria-label={label}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onClickCapture={onClickCapture}
      >
        <div aria-hidden="true" className={styles.couverture} />
        <div
          aria-hidden="true"
          className={cn(styles.tranche, styles.trancheGauche)}
          style={{ ['--epaisseur' as string]: Math.min(4, courante) }}
        />
        <div
          aria-hidden="true"
          className={cn(styles.tranche, styles.trancheDroite)}
          style={{ ['--epaisseur' as string]: Math.min(4, nbFeuilles - courante) }}
        />

        {/* Les deux pages fixes : la gauche de la page de garde, la droite de la dernière. */}
        <div className={cn(styles.page, styles.gauche, styles.fixe)} inert={!visible(0)}>
          {pages[0].gauche}
        </div>
        <div className={cn(styles.page, styles.droite, styles.fixe)} inert={!visible(nbFeuilles)}>
          {pages[nbFeuilles].droite}
        </div>

        <div ref={ombreDroite} aria-hidden="true" className={cn(styles.ombre, styles.ombreDroite)} />
        <div ref={ombreGauche} aria-hidden="true" className={cn(styles.ombre, styles.ombreGauche)} />

        {Array.from({ length: nbFeuilles }, (_, i) => (
          <div
            key={i}
            ref={(el) => {
              feuilles.current[i] = el
            }}
            className={styles.feuille}
            // L'état de départ, dès le premier HTML (avant que la peinture ne
            // reprenne la main). Constant : React ne le réécrit jamais.
            style={{
              transform: `perspective(var(--perspective)) rotateY(${i < initiale ? -180 : 0}deg)`,
              zIndex: depart[i].z,
              visibility: depart[i].peinte ? 'visible' : 'hidden',
            }}
          >
            <div className={cn(styles.page, styles.droite, styles.recto)} inert={!visible(i)}>
              {pages[i].droite}
              <span aria-hidden="true" className={styles.lumiereRecto} />
            </div>
            <div className={cn(styles.page, styles.gauche, styles.verso)} inert={!visible(i + 1)}>
              {pages[i + 1].gauche}
              <span aria-hidden="true" className={styles.lumiereVerso} />
            </div>
          </div>
        ))}

        <Spirale />

        {/* Les coins cornés : on tourne aussi d'un tap. */}
        {courante < nbFeuilles ? (
          <button
            type="button"
            className={cn(styles.coin, styles.coinDroit)}
            onClick={() => allerA(courantRef.current + 1)}
            aria-label="Page suivante"
          />
        ) : null}
        {courante > 0 ? (
          <button
            type="button"
            className={cn(styles.coin, styles.coinGauche)}
            onClick={() => allerA(courantRef.current - 1)}
            aria-label="Page précédente"
          />
        ) : null}
        <nav aria-label="Intercalaires du carnet" className={styles.onglets}>
          {onglets.map((o, k) => {
            const double = k + 1
            const actif = cible === double
            return (
              <button
                key={o.titre}
                type="button"
                data-teinte={o.teinte}
                data-actif={actif || undefined}
                aria-current={actif ? 'page' : undefined}
                className={styles.onglet}
                onClick={() => {
                  sfx.tap()
                  // L'intercalaire déjà ouvert referme le carnet sur la page de garde.
                  allerA(actif ? 0 : double)
                }}
              >
                <span className={styles.ongletTexte}>{o.titre}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

/**
 * La spirale : treize boucles de fil, chacune sort d'un trou de la page gauche,
 * passe par-dessus la reliure et rentre dans le trou d'en face. Le fil est
 * cerné d'encre, son reflet de métal court sur le dessus de la boucle.
 */
function Spirale() {
  const gradient = useId()
  return (
    <div aria-hidden="true" className={styles.spirale}>
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.45" stopColor="#c9c1de" />
            <stop offset="1" stopColor="#6d6489" />
          </linearGradient>
        </defs>
      </svg>
      {Array.from({ length: 13 }, (_, i) => (
        <svg key={i} viewBox="0 0 34 17" className={styles.anneau} preserveAspectRatio="none">
          <path d="M4 13.2C4 3.2 30 3.2 30 13.2" fill="none" stroke="#2a1d47" strokeWidth="5.6" strokeLinecap="round" />
          <path d="M4 13.2C4 3.2 30 3.2 30 13.2" fill="none" stroke={`url(#${gradient})`} strokeWidth="3" strokeLinecap="round" />
          <path d="M9 7.6C13 5.4 21 5.4 25 7.6" fill="none" stroke="#fff" strokeOpacity="0.85" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      ))}
    </div>
  )
}
