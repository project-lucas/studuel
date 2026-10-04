'use client'

import { useEffect, useRef, useState, useSyncExternalStore, useTransition } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import coffrePalier from '@/public/images/niveau/coffre-palier-ferme.webp'
import ConfettiRain from '@/components/ConfettiRain'
import { Button } from '@/components/ui/button'
import XpIcon from '@/components/ui/XpIcon'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import { origineUnique, useRecompenses } from '@/components/recompenses/RecompensesProvider'
import { ouvrirPalierNiveau } from '@/app/niveau-actions'
import { estPalier, gemmesPalier, niveauxAFeter, paliersAOuvrir, prochainPalier } from '@/lib/niveaux'
import type { Gain } from '@/lib/gains'
import { buzz, sfx } from '@/lib/sounds'
import s from './FeteNiveau.module.css'

// -----------------------------------------------------------------------------
// LA FÊTE DE NIVEAU (03/10/2026 ; refaite le 04/10/2026, Lucas : « tout le
// système d'XP, de gain de niveau, d'animation de gain de niveau, tout doit
// être impeccable »).
//
// Le navigateur retient le dernier niveau qu'il a FÊTÉ (localStorage) : quand
// le bandeau en affiche un plus haut — c'est-à-dire juste après que les éclairs
// d'une fin de partie y ont atterri —, l'écran entier devient la fête : le
// grand éclair jaillit sur ses rayons, l'ancien chiffre s'envole, le nouveau
// tombe à sa place, et dessous ce qui vient — le coffre de palier à ouvrir
// tous les 5 niveaux, ou la distance au prochain. Depuis la 557, un niveau ne
// verse plus de gemme : la fête EST la récompense, le coffre de palier est la
// rareté. La première fois, rien : on retient le niveau sans fêter ce qui a
// été gagné avant cette version.
// -----------------------------------------------------------------------------

const CLE_VU = 'studuel-niveau-fete'
const abonnes = new Set<() => void>()

/** Les douze bras des étincelles, en degrés : un tous les 30°. */
const BRAS = Array.from({ length: 12 }, (_, i) => i * 30)

function lireVu(): string {
  try {
    return localStorage.getItem(CLE_VU) ?? ''
  } catch {
    return ''
  }
}

function ecrireVu(niveau: number): void {
  try {
    localStorage.setItem(CLE_VU, String(niveau))
  } catch {
    // stockage indisponible : la fête pourra se rejouer, rien de plus
  }
  for (const f of abonnes) f()
}

/** Un magasin qui ne change jamais : seul compte « serveur ou navigateur ». */
function abonnerRien(): () => void {
  return () => {}
}

function abonner(f: () => void): () => void {
  abonnes.add(f)
  return () => abonnes.delete(f)
}

/** L'XP du niveau, telle que le bandeau la lit (TopHud → XpHud). */
export type XpDuNiveau = { actuel: number; plancher: number; prochain: number | null }

export default function FeteNiveau({
  level,
  levelTitle,
  paliersOuverts,
  xp = null,
}: {
  level: number
  levelTitle: string | null
  paliersOuverts: number[]
  xp?: XpDuNiveau | null
}) {
  const brut = useSyncExternalStore(abonner, lireVu, () => 'serveur')
  const vu = brut === '' ? null : Number(brut)

  // Première visite : on retient le niveau sans fête (système extérieur).
  useEffect(() => {
    if (brut === '') ecrireVu(level)
  }, [brut, level])

  const fete = brut === 'serveur' ? [] : niveauxAFeter(vu, level)
  if (fete.length === 0) return null

  return (
    <FeteNiveauScene
      level={level}
      depuis={fete[0] - 1}
      levelTitle={levelTitle}
      paliersOuverts={paliersOuverts}
      xp={xp}
      onFermer={() => ecrireVu(level)}
    />
  )
}

export function FeteNiveauScene({
  level,
  depuis,
  levelTitle,
  paliersOuverts,
  xp,
  onFermer,
}: {
  level: number
  depuis: number
  levelTitle: string | null
  paliersOuverts: number[]
  xp: XpDuNiveau | null
  onFermer: () => void
}) {
  const bouton = useRef<HTMLButtonElement>(null)
  const sauts = level - depuis
  const auNavigateur = useSyncExternalStore(abonnerRien, () => true, () => false)

  // Le son et la vibration partent avec l'éclair, une seule fois ; le bouton
  // prend le focus pour qu'Entrée referme la fête.
  useEffect(() => {
    const t = setTimeout(() => {
      sfx.levelUp()
      buzz(true, 5)
    }, 260)
    bouton.current?.focus({ preventScroll: true })
    return () => clearTimeout(t)
  }, [])

  // Échap referme, comme une feuille.
  useEffect(() => {
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFermer()
    }
    window.addEventListener('keydown', surTouche)
    return () => window.removeEventListener('keydown', surTouche)
  }, [onFermer])

  // Le portail ne se monte qu'au navigateur — sans désaccord d'hydratation
  // (l'aperçu /dev/niveau la rend dès le premier rendu).
  if (!auNavigateur) return null

  const palierAtteint = paliersAOuvrir(level, paliersOuverts).length > 0
  const suivant = prochainPalier(level)
  const part =
    xp && xp.prochain !== null && xp.prochain > xp.plancher
      ? Math.min(1, Math.max(0, (xp.actuel - xp.plancher) / (xp.prochain - xp.plancher)))
      : 0
  const reste = xp && xp.prochain !== null ? Math.max(0, xp.prochain - xp.actuel) : null

  return createPortal(
    <div className={s.voile} role="dialog" aria-modal="true" aria-label={`Niveau ${level} atteint`}>
      <div className={s.confettis}>
        <ConfettiRain />
      </div>

      <div className={s.scene}>
        <div className={s.embleme} aria-hidden="true">
          <div className={s.halo} />
          <div className={s.rayonsCadre}>
            <div className={s.rayons} />
          </div>
          <div className={s.onde} />
          <div className={`${s.onde} ${s.onde2}`} />
          {BRAS.map((angle, i) => (
            <div key={angle} className={s.bras} style={{ transform: `rotate(${angle}deg)` }}>
              <span className={s.etincelle} data-loin={i % 2} />
            </div>
          ))}
          <XpIcon eclats className={`${s.eclair} size-34`} />
        </div>

        <p className={s.surtitre}>{sauts > 1 ? `+${sauts} niveaux` : 'Nouveau niveau'}</p>
        <p className={s.chiffres} aria-hidden="true">
          <span className={s.ancien}>{depuis}</span>
          <span className={s.nouveau}>{level}</span>
        </p>
        <h2 className="sr-only">Niveau {level} !</h2>
        {levelTitle ? <p className={s.titre}>{levelTitle}</p> : null}
        <p className={s.phrase}>Tout ce que tu as travaillé t’a fait monter. Continue comme ça !</p>

        <div className={s.suite}>
          {palierAtteint ? (
            <CoffresPalier niveau={level} ouverts={paliersOuverts} sombre />
          ) : (
            <div className={s.prochain}>
              <Image src={coffrePalier} alt="" aria-hidden="true" width={256} height={256} loading="eager" unoptimized className="size-12 shrink-0 object-contain opacity-90" />
              <div className="min-w-0 flex-1">
                <p>
                  Prochain coffre au <strong>niveau {suivant}</strong>
                  {estPalier(suivant) ? (
                    <span className="ml-1 inline-flex items-center gap-0.5 align-middle">
                      · <CristalIcon className="size-4" />
                      {gemmesPalier(suivant)}
                    </span>
                  ) : null}
                </p>
                {reste !== null ? (
                  <>
                    <div className={s.barre} aria-hidden="true">
                      <i style={{ transform: `scaleX(${part})` }} />
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-xs opacity-80">
                      <XpIcon className="size-3.5" />
                      Encore {reste.toLocaleString('fr-FR')} XP pour le niveau {level + 1}
                    </p>
                  </>
                ) : null}
              </div>
            </div>
          )}

          <Button ref={bouton} size="xl" shine className="w-full" onClick={onFermer}>
            Continuer
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

/**
 * Les coffres de palier atteints et pas encore ouverts — un bouton par coffre.
 * Partagé par la fête de niveau (`sombre`, sur son voile violet) et la bulle
 * du niveau du bandeau.
 */
export function CoffresPalier({
  niveau,
  ouverts,
  sombre = false,
}: {
  niveau: number
  ouverts: number[]
  sombre?: boolean
}) {
  const [ouvertsIci, setOuvertsIci] = useState<number[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [pending, start] = useTransition()
  const { celebrer } = useRecompenses()
  const bouton = useRef<HTMLButtonElement>(null)
  const restants = paliersAOuvrir(niveau, [...ouverts, ...ouvertsIci])
  if (restants.length === 0) return message ? <p className="text-xs font-bold text-muted-foreground">{message}</p> : null
  const palier = restants[0]

  const ouvrir = () => {
    if (pending) return
    sfx.tap()
    start(async () => {
      const r = await ouvrirPalierNiveau(palier)
      if (r.ok) {
        sfx.coin()
        setOuvertsIci((v) => [...v, palier])
        const gains: Gain[] = [{ unite: 'gemme', montant: r.gemmes }]
        celebrer(gains, origineUnique(bouton.current, gains))
        setMessage(null)
      } else if (r.raison === 'deja_ouvert') {
        setOuvertsIci((v) => [...v, palier])
      } else {
        setMessage(r.raison === 'bientot' ? 'Les coffres de palier arrivent très bientôt.' : 'Le coffre ne s’est pas ouvert. Réessaie.')
      }
    })
  }

  return (
    <div
      className={
        sombre
          ? 'flex w-full flex-col items-center gap-2 rounded-2xl bg-white/10 p-3 ring-1 ring-white/15'
          : 'flex w-full flex-col items-center gap-2 rounded-2xl bg-secondary/60 p-3'
      }
    >
      {/* Le coffre de palier dessiné (03/10/2026) : violet royal, étoile d'or. */}
      <Image
        src={coffrePalier}
        alt=""
        aria-hidden="true"
        width={256}
        height={256}
        loading="eager"
        unoptimized
        className={pending ? 'size-20 animate-pulse object-contain' : 'size-20 object-contain'}
      />
      <p className={sombre ? 'font-heading text-sm font-extrabold text-white' : 'font-heading text-sm font-extrabold text-foreground'}>
        Coffre du niveau {palier}
      </p>
      <Button ref={bouton} type="button" onClick={ouvrir} disabled={pending} className="gap-1.5">
        Ouvrir · <CristalIcon className="size-4" />+{gemmesPalier(palier)}
      </Button>
      {message ? <p className="text-xs font-bold text-muted-foreground">{message}</p> : null}
    </div>
  )
}
