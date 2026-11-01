'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, Mars, Venus } from 'lucide-react'
import OnbButton from '@/components/welcome/OnbButton'
import { OptionGroup } from '@/components/welcome/OnbBits'
import { useTablist } from '@/components/useTablist'
import {
  herosEleve,
  herosParGenre,
  herosSceneSrc,
  herosVisageSrc,
  isHerosKey,
  type GenreHeros,
  type HerosKey,
} from '@/lib/heros/eleves'
import { sfx } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import s from './ChoixHeros.module.css'

// -----------------------------------------------------------------------------
// LE CHOIX DU HÉROS (31/10/2026, Lucas : « une section choix du personnage
// hyper propre, qui fait haut de gamme »). L'écran est la SCÈNE du héros en
// plein écran — on le choisit dans son monde, pas sur une vignette :
//
//   · en haut, le retour, le titre et Garçons / Filles ;
//   · la scène occupe tout, elle se fond d'un héros à l'autre (opacité et
//     échelle seulement) et se balaie du doigt ;
//   · en bas, sur un voile sombre, le peuple, le surnom en grand, SON
//     CARACTÈRE (deux qualités, un travers, « c'est toi si… » : l'élève doit
//     s'y reconnaître, 01/11/2026), puis la rangée des visages (le héros choisi cerné de blanc) et le bouton.
//
// Le composant ne sait rien du compte : il reçoit la clé choisie et la rend.
// Sans choix encore (ou avec un ancien blason), il MONTRE le premier héros de
// l'onglet et l'enregistre au bouton : l'écran montre toujours quelqu'un, le
// bouton n'est jamais grisé. (Pas d'effet qui choisit à l'arrivée : le
// brouillon de l'onboarding, relu juste après le montage, l'effacerait.)
// -----------------------------------------------------------------------------

const ONGLETS: readonly { id: GenreHeros; label: string; Icone: typeof Mars }[] = [
  { id: 'garcons', label: 'Garçons', Icone: Mars },
  { id: 'filles', label: 'Filles', Icone: Venus },
]

/** Un balayage plus court que ça est un tap, pas un changement de héros. */
const SEUIL_BALAYAGE_PX = 48

export default function ChoixHeros({
  choisi,
  onChoisir,
  onConfirmer,
  onRetour,
}: {
  choisi: string | null
  onChoisir: (cle: HerosKey) => void
  onConfirmer: () => void
  onRetour: () => void
}) {
  const enregistre = isHerosKey(choisi) ? choisi : null
  const [genre, setGenre] = useState<GenreHeros>(() => (enregistre ? herosEleve(enregistre).genre : 'garcons'))
  // La scène qui s'efface sous la nouvelle, le temps du fondu.
  const [ancien, setAncien] = useState<HerosKey | null>(null)
  const rangee = useRef<HTMLDivElement>(null)
  const depart = useRef<number | null>(null)
  const tabs = useTablist(ONGLETS.length, (i) => changerGenre(ONGLETS[i].id))

  const liste = useMemo(() => herosParGenre(genre), [genre])
  // Le héros à l'écran : le choisi s'il est de cet onglet, sinon le premier.
  const actuel: HerosKey =
    enregistre && liste.some((h) => h.cle === enregistre) ? enregistre : (liste[0].cle as HerosKey)
  const index = liste.findIndex((h) => h.cle === actuel)

  // Les deux voisins se chargent d'avance : le balayage tombe sur une image prête.
  useEffect(() => {
    for (const d of [-1, 1]) {
      const voisin = liste[index + d]
      if (voisin) new window.Image().src = herosSceneSrc(voisin.cle as HerosKey)
    }
  }, [index, liste])

  // Le visage choisi vient au centre de sa rangée (sans faire défiler la page).
  useEffect(() => {
    const el = rangee.current?.querySelector<HTMLElement>('[aria-checked="true"]')
    const box = rangee.current
    if (!el || !box) return
    box.scrollTo({ left: el.offsetLeft - box.clientWidth / 2 + el.clientWidth / 2, behavior: 'smooth' })
  }, [actuel, genre])

  function choisir(cle: HerosKey) {
    if (cle === actuel) return
    sfx.tap()
    setAncien(actuel)
    onChoisir(cle)
  }

  function changerGenre(g: GenreHeros) {
    if (g === genre) return
    sfx.tap()
    setGenre(g)
    setAncien(actuel)
    onChoisir(herosParGenre(g)[0].cle as HerosKey)
  }

  function confirmer() {
    if (actuel !== enregistre) onChoisir(actuel)
    onConfirmer()
  }

  function finBalayage(x: number) {
    if (depart.current === null) return
    const dx = x - depart.current
    depart.current = null
    if (Math.abs(dx) < SEUIL_BALAYAGE_PX) return
    const cible = liste[index + (dx < 0 ? 1 : -1)]
    if (cible) choisir(cible.cle as HerosKey)
  }

  const heros = herosEleve(actuel)

  return (
    <div className={s.ecran}>
      <div
        className={s.cadre}
        onPointerDown={(e) => (depart.current = e.clientX)}
        onPointerUp={(e) => finBalayage(e.clientX)}
        onPointerCancel={() => (depart.current = null)}
      >
        {/* --- La scène, en fondu d'un héros à l'autre ---------------------- */}
        <div className={s.scenes} aria-hidden="true">
          {ancien && ancien !== actuel ? (
            // eslint-disable-next-line @next/next/no-img-element -- scène peinte servie telle quelle
            <img key={`a-${ancien}`} src={herosSceneSrc(ancien)} alt="" draggable={false} className={s.scene} />
          ) : null}
          {/* eslint-disable-next-line @next/next/no-img-element -- scène peinte servie telle quelle */}
          <img
            key={actuel}
            src={herosSceneSrc(actuel)}
            alt=""
            draggable={false}
            fetchPriority="high"
            className={cn(s.scene, s.sceneEntre)}
            onAnimationEnd={() => setAncien(null)}
          />
        </div>
        <span aria-hidden="true" className={s.voileHaut} />
        <span aria-hidden="true" className={s.voileBas} />

        {/* --- En haut : retour, titre, Garçons / Filles -------------------- */}
        <header className={s.haut}>
          <div className={s.ligneTitre}>
            <button type="button" onClick={onRetour} aria-label="Étape précédente" className={s.retour}>
              <ChevronLeft className="size-6" strokeWidth={2.8} aria-hidden="true" />
            </button>
            <h1 className={cn('font-heading font-extrabold', s.titre)}>Choisis ton héros</h1>
            <span aria-hidden="true" className={s.retour} />
          </div>
          <div role="tablist" aria-label="Garçons ou filles" className={s.onglets}>
            {ONGLETS.map((o, i) => {
              const actif = o.id === genre
              return (
                <button
                  key={o.id}
                  type="button"
                  role="tab"
                  aria-selected={actif}
                  {...tabs.props(i, actif)}
                  onClick={() => changerGenre(o.id)}
                  className={cn(s.onglet, actif && s.ongletActif)}
                >
                  <o.Icone className="size-4" strokeWidth={2.8} aria-hidden="true" />
                  {o.label}
                </button>
              )
            })}
          </div>
        </header>

        {/* --- En bas : la plaque du héros, les visages, le bouton ---------- */}
        <div className={s.bas}>
          <div key={heros.cle} className={s.plaque} aria-live="polite">
            <span className={s.peuple}>{heros.peuple}</span>
            <h2 className={cn('font-heading font-extrabold', s.nom)}>{heros.titre}</h2>
            <ul className={s.traits} aria-label="Son caractère">
              {heros.qualites.map((q) => (
                <li key={q} className={s.qualite}>
                  {q}
                </li>
              ))}
              <li className={s.travers}>
                <span className="sr-only">mais </span>
                {heros.travers}
              </li>
            </ul>
            <p className={s.cestToi}>{heros.cestToi}</p>
          </div>

          <div ref={rangee} className={s.rangee}>
            <OptionGroup label={`Héros ${genre === 'garcons' ? 'garçons' : 'filles'}`} className={s.visages}>
              {liste.map((h) => {
                const coche = h.cle === actuel
                return (
                  <button
                    key={h.cle}
                    type="button"
                    role="radio"
                    aria-checked={coche}
                    aria-label={`${h.titre}, ${h.peuple.toLowerCase()}`}
                    onClick={() => choisir(h.cle as HerosKey)}
                    className={cn(s.visage, coche && s.visageChoisi)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- visage recadré servi tel quel */}
                    <img src={herosVisageSrc(h.cle as HerosKey)} alt="" width={384} height={384} draggable={false} />
                  </button>
                )
              })}
            </OptionGroup>
          </div>

          <OnbButton onClick={confirmer} className={s.cta}>
            C’est mon héros
          </OnbButton>
        </div>
      </div>
    </div>
  )
}
