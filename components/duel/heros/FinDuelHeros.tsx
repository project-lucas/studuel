'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LogOut, Swords } from 'lucide-react'
import IconeUnite from '@/components/recompenses/IconeUnite'
import TropheeIcone from '@/components/ui/TropheeIcone'
import { Button } from '@/components/ui/button'
import courseStyles from '@/components/duel/Course.module.css'
import { TITRE_DEFAITE, TITRE_VICTOIRE } from '@/lib/duel/titres'
import { definition, dureeVague, libelleGain, type Gain } from '@/lib/gains'
import { ARENE_HEROS } from '@/lib/heros/catalogue'
import { barreTrophees, barreXp, partsVague, type BarreProgres } from '@/lib/heros/fin-duel'
import { cn } from '@/lib/utils'
import VoleeJetons, { type Point, type Vague } from './VoleeJetons'
import s from './FinDuelHeros.module.css'

// LA FIN DU DUEL DES HÉROS (29/10/2026, deuxième retour de Lucas le soir même) :
// « pas besoin d'afficher de nouveau le chevalier, la victoire suffit » ; les
// récompenses comme au quiz, avec les trophées ; « la barre de niveau qui monte
// en direct, et la barre de trophées qui monte aussi en direct » ; plus de
// pilule du joueur ; « comme Brawl Stars : soit Rejouer, qui trouve une partie,
// soit Quitter ». L'écran se lit de haut en bas :
//
//   1. la BANNIÈRE « Victoire ! » (ou « Défaite ») sous les rayons d'or ;
//   2. une carte par gain (la recette du ruban de récompenses,
//      RubanRecompenses) — ni ruban ni ligne de résumé (Lucas : « pas
//      nécessaires ») ;
//   3. la carte de PROGRESSION : niveau, et trophées DE LA MATIÈRE (Lucas :
//      « il faut préciser la matière » : les trophées se comptent par
//      matière, lib/trophy-road). Les éclairs puis les
//      trophées jaillissent des cartes et rentrent en vague dans leur barre,
//      qui monte jeton par jeton (VoleeJetons) — et passe au niveau ou au
//      palier suivant si elle déborde ;
//   4. QUITTER (blanc) · REJOUER (or), côte à côte.
//
// Démo : rien n'est versé, la vague ne touche pas au bandeau de l'élève.
// Transform et opacité seulement, valeurs littérales dans les images-clés.

/** Le temps que la bannière et les cartes se posent avant la vague. */
const MS_AVANT_VAGUE = 1500
/** Le souffle entre la vague d'XP et celle des trophées. */
const MS_ENTRE_VAGUES = 250

type Etape = 'attente' | 'xp' | 'trophee' | 'fini'

export default function FinDuelHeros({
  gagne,
  matiere,
  gains,
  xpAvant,
  tropheesAvant,
  onRejouer,
}: {
  gagne: boolean
  /** La matière du duel : ce sont ses trophées qui montent. */
  matiere: { nom: string; vignette: string | null }
  /** Ce que la partie rapporte (démo : rien n'est versé). */
  gains: readonly Gain[]
  /** L'XP cumulée et les trophées AVANT la partie. */
  xpAvant: number
  tropheesAvant: number
  /** Chercher une nouvelle partie. */
  onRejouer: () => void
}) {
  const xp = gains.find((g) => g.unite === 'xp')?.montant ?? 0
  const trophees = gains.find((g) => g.unite === 'trophee')?.montant ?? 0

  const [etape, setEtape] = useState<Etape>('attente')
  const [xpVerse, setXpVerse] = useState(0)
  const [tropheesVerses, setTropheesVerses] = useState(0)
  const [vague, setVague] = useState<Vague | null>(null)

  const cartes = useRef(new Map<Gain['unite'], HTMLElement>())
  const cibleXp = useRef<HTMLSpanElement>(null)
  const cibleTrophees = useRef<HTMLSpanElement>(null)

  // Le départ d'une vague : de la carte du gain vers l'icône de sa barre.
  const lancer = useCallback((unite: Vague['unite'], montant: number, cible: HTMLElement | null) => {
    const carte = cartes.current.get(unite)
    const parts = partsVague(montant)
    if (!carte || !cible || parts.length === 0) return false
    setVague({ unite, depart: centre(carte), arrivee: centre(cible), parts })
    return true
  }, [])

  // Le fil de l'écran : attente → vague d'XP → vague de trophées → fini.
  useEffect(() => {
    if (etape === 'attente') {
      const t = window.setTimeout(() => setEtape('xp'), MS_AVANT_VAGUE)
      return () => window.clearTimeout(t)
    }
    if (etape === 'xp' || etape === 'trophee') {
      const montant = etape === 'xp' ? xp : trophees
      const lancee = lancer(etape, montant, (etape === 'xp' ? cibleXp : cibleTrophees).current)
      const suite: Etape = etape === 'xp' ? 'trophee' : 'fini'
      const duree = lancee ? dureeVague(partsVague(montant).length) + MS_ENTRE_VAGUES : 0
      const t = window.setTimeout(() => {
        setVague(null)
        setEtape(suite)
      }, duree)
      return () => window.clearTimeout(t)
    }
  }, [etape, xp, trophees, lancer])

  const arrivee = useCallback(
    (part: number) => {
      if (vague?.unite === 'xp') setXpVerse((v) => Math.min(xp, v + part))
      else setTropheesVerses((v) => Math.min(trophees, v + part))
    },
    [vague, xp, trophees],
  )

  // La vague finie, la barre tient le compte juste même si un jeton s'est perdu.
  const xpAffiche = etape === 'trophee' || etape === 'fini' ? xp : xpVerse
  const tropheesAffiches = etape === 'fini' ? trophees : tropheesVerses
  const niveau = barreXp(xpAvant + xpAffiche)
  const palier = barreTrophees(tropheesAvant + tropheesAffiches)
  const niveauMonte = niveau.cran > barreXp(xpAvant).cran
  const palierMonte = palier.cran > barreTrophees(tropheesAvant).cran

  return (
    <section className={s.fin} data-gagne={gagne ? 'true' : undefined} aria-label={gagne ? 'Victoire' : 'Défaite'}>
      <div className={s.fond} aria-hidden="true">
        <Image unoptimized src={ARENE_HEROS} alt="" fill priority sizes="100vw" className={s.decor} />
      </div>
      <div className={s.voile} aria-hidden="true" />

      <div className={s.colonne}>
        <div className={s.haut}>
          {gagne ? <span className={s.rayons} aria-hidden="true" /> : null}
          <h1 className={s.titre}>
            <Image
              unoptimized
              src={gagne ? TITRE_VICTOIRE : TITRE_DEFAITE}
              alt=""
              width={720}
              height={360}
              priority
              className={s.titreImage}
            />
            <span className="sr-only">{gagne ? 'Victoire !' : 'Défaite'}</span>
          </h1>
        </div>

        <p className="sr-only">Tu gagnes {gains.map((g) => libelleGain(g)).join(', ')}.</p>
        <ul className={s.cartes} aria-hidden="true">
          {gains.map((g, i) => (
            <li
              key={g.unite}
              ref={(el) => {
                if (el) cartes.current.set(g.unite, el)
                else cartes.current.delete(g.unite)
              }}
              className={s.carte}
              data-unite={g.unite}
              data-part={vague?.unite === g.unite ? 'true' : undefined}
              style={{ animationDelay: `${650 + i * 140}ms` }}
            >
              <span className={s.objet}>
                <IconeUnite unite={g.unite} className={s.icone} />
              </span>
              <span className={cn(s.montant, 'font-heading')}>+{g.montant}</span>
              <span className={s.libelle}>{g.montant > 1 ? definition(g.unite).plusieurs : definition(g.unite).un}</span>
            </li>
          ))}
        </ul>

        <div className={cn('carte', s.progres)}>
          <LigneBarre
            icone={
              <span ref={cibleXp} className={s.rondNiveau} key={niveau.cran}>
                <span className="font-heading font-extrabold">{niveau.cran}</span>
              </span>
            }
            titre={niveauMonte ? `Niveau ${niveau.cran} !` : `Niveau ${niveau.cran}`}
            compte={`${niveau.fait} / ${niveau.pas} XP`}
            barre={niveau}
            ton="xp"
            monte={niveauMonte}
          />
          <LigneBarre
            icone={
              <span ref={cibleTrophees} className={s.rondMatiere} key={palier.cran}>
                {matiere.vignette ? (
                  <Image src={matiere.vignette} alt="" width={64} height={64} className={s.vignette} />
                ) : null}
                <span className={s.badgeTrophee}>
                  <TropheeIcone className="size-4.5" />
                </span>
              </span>
            }
            titre={palierMonte ? `${matiere.nom} · palier ${palier.cran} !` : matiere.nom}
            compte={`${tropheesAvant + tropheesAffiches} / ${palier.cran + palier.pas} trophées`}
            barre={palier}
            ton="trophee"
            monte={palierMonte}
          />
        </div>

        <div className={s.boutons}>
          <Button asChild size="xl" className={s.quitter}>
            <Link href="/defi">
              <LogOut className="size-5" aria-hidden="true" /> Quitter
            </Link>
          </Button>
          <Button size="xl" className={cn(courseStyles.btnOr, s.rejouer)} onClick={onRejouer}>
            <Swords className="size-5" aria-hidden="true" /> Rejouer
          </Button>
        </div>
        <p className={s.note}>Démo : rien n’est versé sur ton compte.</p>
      </div>

      {vague ? <VoleeJetons key={vague.unite} vague={vague} onArrivee={arrivee} /> : null}
    </section>
  )
}

function centre(el: HTMLElement): Point {
  const r = el.getBoundingClientRect()
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
}

/** Une ligne de la carte de progression : l'icône, le titre, le compte, la barre. */
function LigneBarre({
  icone,
  titre,
  compte,
  barre,
  ton,
  monte,
}: {
  icone: ReactNode
  titre: string
  compte: string
  barre: BarreProgres
  ton: 'xp' | 'trophee'
  monte: boolean
}) {
  return (
    <div className={s.ligne} data-ton={ton} data-monte={monte ? 'true' : undefined}>
      {icone}
      <div className="min-w-0 flex-1">
        <p className={s.ligneHaut}>
          <span className="font-heading font-extrabold">{titre}</span>
          <span className="tabular-nums">{compte}</span>
        </p>
        <span className={s.rail}>
          {/* Au changement de niveau ou de palier, la barre repart d'une
              nouvelle (la clé) au lieu de se vider à reculons. */}
          <span key={barre.cran} className={s.remplissage} style={{ transform: `scaleX(${barre.part})` }} />
        </span>
      </div>
    </div>
  )
}
