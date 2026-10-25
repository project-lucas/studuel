'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import coffrePalier from '@/public/images/niveau/coffre-palier-ferme.webp'
import ConfettiRain from '@/components/ConfettiRain'
import { Button } from '@/components/ui/button'
import XpIcon from '@/components/ui/XpIcon'
import { CristalIcon } from '@/components/ui/MonnaieIcon'
import RubanOr from '@/components/recompenses/RubanOr'
import { CoffresPalier } from '@/components/niveau/CoffrePalier'
import Debloque from '@/components/niveau/Debloque'
import type { OuverturePalier } from '@/app/niveau-actions'
import { decouvertesAuNiveau, type Decouverte } from '@/lib/decouverte/catalogue'
import { estPalier, gemmesPalier, niveauxAFeter, paliersAOuvrir, prochainPalier } from '@/lib/niveaux'
import { buzz, sfx } from '@/lib/sounds'
import s from './FeteNiveau.module.css'

export { CoffresPalier } from '@/components/niveau/CoffrePalier'

// -----------------------------------------------------------------------------
// LA FÊTE DE NIVEAU (03/10/2026 ; refaite le 04/10/2026 ; REFAITE FAÇON « LEVEL
// UP » LE 25/10/2026, cadrage « le jeu vivant » § B : le niveau est un
// ÉVÉNEMENT, comme dans le jeu que Lucas a montré).
//
// Le navigateur retient le dernier niveau qu'il a FÊTÉ (localStorage) : quand
// le bandeau en affiche un plus haut — juste après que les éclairs d'une fin de
// partie y ont atterri —, l'écran entier devient la fête :
//   · le ruban d'or « Niveau 7 ! » se pose et ondule ;
//   · le BADGE du niveau arrive en tournant et en grossissant, sur ses rayons,
//     une onde, une couronne d'étincelles ;
//   · « avant → après » : Niv. 6, la barre qui se remplit, Niv. 7 ;
//   · la section « DÉBLOQUÉ » : ce que le niveau ouvre, lu dans le catalogue
//     des découvertes, chaque nouveauté avec son bouton « Découvrir » ;
//   · le coffre de palier à ouvrir (tous les 5 niveaux : la pluie de gemmes,
//     puis le ruban de récompenses), ou la distance au prochain.
// Depuis la 557, un niveau ne verse plus de gemme : la fête EST la récompense,
// le coffre de palier est la rareté. La première fois, rien : on retient le
// niveau sans fêter ce qui a été gagné avant cette version.
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

/** Tout ce que les niveaux franchis (de `depuis` exclu à `level` inclus) ouvrent. */
export function nouveautesEntre(depuis: number, level: number): Decouverte[] {
  const out: Decouverte[] = []
  for (let n = Math.max(1, Math.floor(depuis) + 1); n <= level; n += 1) out.push(...decouvertesAuNiveau(n))
  return out
}

export function FeteNiveauScene({
  level,
  depuis,
  levelTitle,
  paliersOuverts,
  xp,
  onFermer,
  ouvrirPalier,
}: {
  level: number
  depuis: number
  levelTitle: string | null
  paliersOuverts: number[]
  xp: XpDuNiveau | null
  onFermer: () => void
  /** L'ouverture d'un coffre de palier — l'aperçu `/dev/niveau` en passe une fausse. */
  ouvrirPalier?: (palier: number) => Promise<OuverturePalier>
}) {
  const bouton = useRef<HTMLButtonElement>(null)
  const sauts = level - depuis
  const auNavigateur = useSyncExternalStore(abonnerRien, () => true, () => false)

  // Le son et la vibration partent avec le badge, une seule fois ; le bouton
  // prend le focus pour qu'Entrée referme la fête.
  useEffect(() => {
    const t = setTimeout(() => {
      sfx.levelUp()
      buzz(true, 5)
    }, 300)
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
  const nouveautes = nouveautesEntre(depuis, level)

  return createPortal(
    <div className={s.voile} role="dialog" aria-modal="true" aria-label={`Niveau ${level} atteint`}>
      <div className={s.confettis}>
        <ConfettiRain />
      </div>
      <div className={s.lumiere} aria-hidden="true" />

      <div className={s.scene}>
        <div className={s.ruban}>
          <RubanOr ondule>{sauts > 1 ? `+${sauts} niveaux !` : `Niveau ${level} !`}</RubanOr>
        </div>
        <h2 className="sr-only">Niveau {level} atteint</h2>

        {/* LE BADGE : il arrive en tournant et en grossissant, sur ses rayons. */}
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
          <div className={s.medaille}>
            <span className={s.chiffre}>{level}</span>
            <XpIcon className={s.fermoir} />
          </div>
        </div>

        {/* AVANT → APRÈS : l'ancien niveau, la barre qui se remplit, le nouveau. */}
        <p className={s.passage} aria-label={`Du niveau ${depuis} au niveau ${level}`}>
          <span className={s.avant}>Niv. {depuis}</span>
          <span className={s.piste} aria-hidden="true">
            <i />
          </span>
          <span className={s.apres}>Niv. {level}</span>
        </p>

        {levelTitle ? <p className={s.titre}>{levelTitle}</p> : null}
        <p className={s.phrase}>Tout ce que tu as travaillé t’a fait monter. Continue comme ça !</p>

        <Debloque decouvertes={nouveautes} onDecouvrir={onFermer} />

        <div className={s.suite}>
          {palierAtteint ? (
            <CoffresPalier niveau={level} ouverts={paliersOuverts} sombre ouvrir={ouvrirPalier} />
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
